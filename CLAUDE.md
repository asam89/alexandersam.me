# CLAUDE.md

Guidance for Claude (and other agents) working on **alexandersam.me**, Alex Sam's personal portfolio and blog.

## TL;DR — how changes reach the live site

1. Edit files on a branch (content lives in `content/`, UI in `components/` + `pages/`).
2. Open a PR into `main`.
3. Merging to `main` triggers `.github/workflows/deploy.yml`, which builds the site and FTP-uploads it to Hostinger.
4. The live site at https://alexandersam.me updates about 2 minutes later.

**You never need deploy credentials locally.** Every secret lives in GitHub Actions, and the only way to deploy is to push or merge to `main`, or to run the workflow manually (`workflow_dispatch`). Never hardcode, echo, or commit secrets.

## Stack

- Nuxt 2 static site (`target: 'static'`, `ssr: false`), generated with `yarn generate` (`nuxt generate -m`) into `dist/`
- Tailwind CSS (JIT), `@nuxt/content` v1 for Markdown, nuxt-i18n, PWA, sitemap, RSS feed (`/feed.xml`)
- CI uses Node 18 and Yarn 1 (`yarn install --frozen-lockfile --ignore-engines`). If you add a dependency, update `yarn.lock` too, or CI fails.
- Hosting: Hostinger shared hosting (Apache + PHP). There is no Node server in production.
- Forked from the karngyan.com template, so you'll see `karngyan.*` names in a few places.

## Repo map

| Path | Purpose |
|---|---|
| `karngyan.config.js` | **Main site config**: name, socials, which sections are on, "worked at" logos, every UI string (`strings.en_US`) |
| `content/posts/*.md` | Blog posts |
| `content/projects/*.md` | Project cards. `gh-*.md` files are **auto-generated, don't edit them by hand** |
| `components/home/*.vue` | Homepage sections (Hero, Experience, Skills, Certifications, LiveApps, GithubCalendar, etc.) |
| `pages/` | Routes: `index`, `blog/`, `projects/`, `resume/`, `uses/` |
| `static/` | Served as-is from `/` (images in `static/images/`, project images in `static/images/projects/`) |
| `static/admin/` | Decap CMS (`/admin`) config |
| `static/auth/` | PHP OAuth proxy for Decap CMS GitHub login |
| `scripts/sync-github-projects.mjs` | CI step that turns public `asam89` repos into `content/projects/gh-*.md` |
| `.github/workflows/deploy.yml` | The only workflow: build + deploy |

## GitHub Actions secrets

The deploy workflow reads these from **Settings → Secrets and variables → Actions**:

| Secret | Used by | Status (as of the 2026-10-21 run) |
|---|---|---|
| `FTP_SERVER` | FTP deploy step | ✅ set and working |
| `FTP_USER` | FTP deploy step | ✅ set and working |
| `FTP_PASS` | FTP deploy step | ✅ set and working |
| `GITHUB_TOKEN` | Project sync script (higher GitHub API rate limit) | ✅ provided automatically by Actions |
| `GH_OAUTH_CLIENT_ID` | Writes `dist/auth/config.php` for `/admin` login | ❌ **not set**: CI warns "/admin login will not work" |
| `GH_OAUTH_CLIENT_SECRET` | Same as above | ❌ **not set** |

To turn on the `/admin` CMS login: create a GitHub OAuth App with callback URL `https://alexandersam.me/auth/callback.php`, add both `GH_OAUTH_*` secrets, then re-run the workflow. Nothing else depends on them: the site builds and deploys fine without them.

Rules for agents:
- Don't add secrets to the repo, `.env`, `karngyan.config.js`, or workflow files. `static/auth/config.php` and `.env` are gitignored on purpose.
- A new integration that needs a credential should read it from `${{ secrets.NAME }}` in the workflow, and the PR should document it in the table above so the owner can add it.
- Keep workflow steps that depend on optional secrets **non-fatal** (warn and skip), following the OAuth step's pattern.

## Deploy workflow details (`deploy.yml`)

Triggers: `push` to `main` and `workflow_dispatch`. Steps:
1. Checkout, set up Node 18 with the yarn cache, `yarn install --frozen-lockfile --ignore-engines`
2. `node scripts/sync-github-projects.mjs`: regenerates `content/projects/gh-*.md` from public, non-fork, non-archived `asam89` repos. On an API failure it exits 0 and keeps the existing files.
3. `yarn generate` → `dist/`
4. Write `dist/auth/config.php` from the OAuth secrets (skipped with a warning if they're missing)
5. FTP-sync `dist/` → `/domains/alexandersam.me/public_html/` with `SamKirkland/FTP-Deploy-Action@v4.3.5`, then one retry after 30s, because Hostinger's FTP sometimes times out

Notes:
- FTP-Deploy keeps a `.ftp-deploy-sync-state.json` on the server and uploads only diffs. Files you delete from `dist/` are deleted from the server.
- CI does **not** commit the regenerated `gh-*.md` files back to the repo. The copies in git may be stale; the live site uses whatever CI generated at build time.
- PRs don't trigger a build. To check a change, run `yarn generate` locally.
- Workflow runs and logs: https://github.com/asam89/alexandersam.me/actions

## Writing content

### Blog post: `content/posts/<slug>.md` → `/blog/<slug>`

```yaml
---
id: 2
title: "Post title"
description: "One-line summary (used in cards, RSS, meta)"
date: 2026-11-09
author: Alexander Sam
tags: ['ai', 'automation']
---
```
Then the Markdown body (`##` headings, tables, and fenced code with Prism highlighting all work).

⚠️ The blog list and the homepage sort by `createdAt` (Nuxt Content's file timestamp, which in CI is the checkout time), not by `date`. Today's single post sorts fine, but ordering between several posts isn't reliable until `pages/blog/index.vue` and `pages/index.vue` sort by `date`.

### Project: `content/projects/<slug>.md` → `/projects/<slug>`

```yaml
---
id: 12
date: '2026-11-09'          # projects page sorts by date desc, then id desc
title: Project Name
description: Short description shown on the card
image: /images/projects/project-name.png   # put the file in static/images/projects/
tech: ['typescript', 'azure']              # drives the tech filter on /projects
link: 'https://example.com'                # optional
github: 'https://github.com/asam89/repo'   # optional
---
```
- Never use the `gh-` filename prefix for hand-written files: the sync script deletes every `gh-*.md` on each run.
- If a curated file links `github.com/asam89/<repo>`, the sync script skips that repo, so you won't get duplicate cards. To hide a repo entirely, add it to `EXCLUDE_NAMES` in `scripts/sync-github-projects.mjs`.
- Generated cards use ids 1000+, so keep curated ids below 1000.

### Site-wide copy, sections, socials, logos
Edit `karngyan.config.js`. Section toggles (`blog`, `projects`, `resume`, `uses`, `workedAt`, etc.) and every homepage string live there. Company logos go in `static/images/`.

### Decap CMS (`/admin`)
`static/admin/config.yml` commits straight to `main` through the GitHub backend, which also triggers a deploy. Its field schemas (`date` widget, project `image`/`tech`/`link`) roughly match the frontmatter above. If you change the frontmatter conventions, update this file too. Login needs the `GH_OAUTH_*` secrets (not set yet; see above).

## Local commands

```bash
yarn install --ignore-engines   # Node 18 recommended (the Nuxt 2 / webpack 4 era)
yarn dev                        # http://localhost:3000
yarn generate                   # production build into dist/ (same as CI)
node scripts/sync-github-projects.mjs   # optional: refresh gh-*.md locally
```
There are no tests or linters. A successful `yarn generate` is the check.

## Conventions

- Commit style: Conventional Commits (`feat:`, `fix:`, `ci:`, `docs:`).
- Work on a feature branch, open a PR to `main`, and merge it (merging deploys).
- Keep changes small and content-focused. This is a personal site: accuracy about Alex's real experience matters more than flashy copy, so don't invent employers, metrics, or certifications.
- The README's "Deployment" section (manual upload) is outdated. CI handles deploys.
