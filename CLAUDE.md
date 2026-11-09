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
| `scripts/blog/` | Claude-powered blog drafter (own `package.json`, separate from the site's yarn deps) |
| `.github/workflows/deploy.yml` | Build + deploy (on push to `main`, daily schedule, manual) |
| `.github/workflows/blog-draft.yml` | Drafts a blog post with Claude and opens a PR |

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
| `ANTHROPIC_API_KEY` | `blog-draft.yml` (AI blog drafts) | ❌ **needs adding**: without it the draft workflow warns and does nothing |

Optional repository **variable** (not secret): `BLOG_DRAFT_MODEL` overrides the drafting model (default `claude-opus-5-5`).

The draft workflow opens PRs with `GITHUB_TOKEN`, which requires **Settings → Actions → General → Workflow permissions → "Allow GitHub Actions to create and approve pull requests"**.

To turn on the `/admin` CMS login: create a GitHub OAuth App with callback URL `https://alexandersam.me/auth/callback.php`, add both `GH_OAUTH_*` secrets, then re-run the workflow. Nothing else depends on them: the site builds and deploys fine without them.

Rules for agents:
- Don't add secrets to the repo, `.env`, `karngyan.config.js`, or workflow files. `static/auth/config.php` and `.env` are gitignored on purpose.
- A new integration that needs a credential should read it from `${{ secrets.NAME }}` in the workflow, and the PR should document it in the table above so the owner can add it.
- Keep workflow steps that depend on optional secrets **non-fatal** (warn and skip), following the OAuth step's pattern.

## Deploy workflow details (`deploy.yml`)

Triggers: `push` to `main`, `workflow_dispatch`, and a daily `schedule` (10:17 UTC). The daily run re-syncs GitHub projects and publishes any post whose `date` has arrived. A `concurrency` group stops two FTP deploys from overlapping. Steps:
1. Checkout, set up Node 18 with the yarn cache, `yarn install --frozen-lockfile --ignore-engines`
2. `node scripts/sync-github-projects.mjs`: regenerates `content/projects/gh-*.md` from public, non-fork, non-archived `asam89` repos. On an API failure it exits 0 and keeps the existing files.
3. `yarn generate` → `dist/`
4. Write `dist/auth/config.php` from the OAuth secrets (skipped with a warning if they're missing)
5. FTP-sync `dist/` → `/domains/alexandersam.me/public_html/` with `SamKirkland/FTP-Deploy-Action@v4.3.5`, then one retry after 30s, because Hostinger's FTP sometimes times out

Notes:
- FTP-Deploy keeps a `.ftp-deploy-sync-state.json` on the server and uploads only diffs. Files you delete from `dist/` are deleted from the server.
- CI does **not** commit the regenerated `gh-*.md` files back to the repo. The copies in git may be stale; the live site uses whatever CI generated at build time.
- PRs that `blog-draft.yml` opens with `GITHUB_TOKEN` don't trigger other workflows; that's fine, since nothing runs on PRs. Merging still deploys.
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

How the post date and visibility work (the `content:file:beforeInsert` hook in `nuxt.config.js`):
- `date` overrides `createdAt`, so lists, the RSS feed and the post page all sort and display by the frontmatter date. File timestamps are meaningless in CI.
- `published` is computed **at build time**: `false` if `draft: true` or `date` is in the future. Unpublished posts are left out of `/blog`, the homepage, `feed.xml` and `sitemap.xml`, and `/blog/<slug>` returns a 404. Every query on `posts` must keep `.where({ published: true })`.
- Scheduling a post: merge it with a future `date`. The daily deploy publishes it that morning.
- Hidden posts still ship in the client-side content DB JSON, so treat them as unlisted, not secret.

### Automated blog drafts (`blog-draft.yml`)
Two ways to start one:
1. **Actions → "Draft blog post with Claude" → Run workflow**, with `topic`, optional `notes`, and an optional `publish_date`.
2. **Open an issue** (title = topic, body = notes/outline) and add the **`blog`** label. This works well from the GitHub mobile app.

`scripts/blog/draft-post.mjs` sends the topic and notes, plus context from the site (config, experience, certifications, project frontmatter, an existing post for voice), to the Claude API with structured JSON output. It then writes `content/posts/<slug>.md`, pushes a `blog/<slug>-<run>` branch and opens a PR (labelled-issue runs comment the PR link on the issue and close it on merge). The prompt forbids inventing facts about Alex and leaves `<!-- TODO(alex): ... -->` comments where real details are needed. **Always review and resolve those before merging.** Server-side refusal fallback (`fallbacks: "default"`) is on.

To run it locally: `npm install --prefix scripts/blog`, then `TOPIC="..." NOTES="..." ANTHROPIC_API_KEY=... node scripts/blog/draft-post.mjs`.

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
- Keep the blog drafter's dependencies in `scripts/blog/package.json`, not the root `package.json`, so the site's `yarn.lock` and its Node 18 build stay untouched.
