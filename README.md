# alexandersam.me

Personal portfolio and blog for Alex Sam — software engineer and founder of [Ignyte Consulting](https://ignyteconsulting.com).

## Tech Stack

- **Nuxt.js 2** (Static Site Generator)
- **Tailwind CSS** for styling
- **Nuxt Content** for blog posts and project pages (Markdown)
- **GitHub Calendar** heatmap
- **Vue Typer** for animated hero text

## Local Development

```bash
# Install dependencies
yarn install

# Run dev server
yarn dev

# Open http://localhost:3000
```

## Deployment (Hostinger)

```bash
# Generate static site
yarn generate

# Upload contents of dist/ to Hostinger file manager
# at: srv486-files.hstgr.io → public_html/
```

The site is hosted on Hostinger at [alexandersam.me](https://alexandersam.me).

## Adding Content

### Projects
Add markdown files to `content/projects/` with frontmatter:

```yaml
---
id: 1
title: Project Name
description: Short description
tech: typescript nextjs
logo: /images/projects/project-name.png
website: https://example.com
github: https://github.com/asam89/repo
---
```

### Blog Posts
Add markdown files to `content/posts/` with frontmatter:

```yaml
---
id: 1
title: Post Title
description: Short description
tags: ['tag1', 'tag2']
createdAt: 2026-06-24
---
```

## Configuration

All site configuration lives in `karngyan.config.js` — name, socials, enabled sections, and all UI strings.

## License

MIT
