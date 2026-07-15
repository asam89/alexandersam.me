#!/usr/bin/env node
// Pulls public repos for the GitHub user below and generates a project markdown
// file for each one, so the /projects page stays in sync without manual edits.
// Runs in CI before `yarn generate`. Generated files are prefixed `gh-` and are
// fully regenerated on every run.

import { readFileSync, readdirSync, writeFileSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECTS_DIR = join(__dirname, '..', 'content', 'projects')

const GH_USER = 'asam89'
const DEFAULT_IMAGE = '/images/projects/ignytedev-bot.png'
const GEN_PREFIX = 'gh-'
const ID_BASE = 1000

// Repos we never want on the site (portfolio itself, profile/cert repos, or
// ones already covered by a richer hand-written card). Matched case-insensitively.
const EXCLUDE_NAMES = new Set([
  'alexandersam.me',
  'alexsam.com',
  'asam89',
  'dotfiles',
  'readme',
  'cissp',
  // already represented by curated cards that don't link to GitHub:
  'fit',
  'ignyte',
  'ignytec',
])

function ghHeaders() {
  const headers = { 'User-Agent': 'alexandersam.me-sync', Accept: 'application/vnd.github+json' }
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function fetchRepos() {
  const repos = []
  for (let page = 1; page <= 5; page++) {
    const url = `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed&direction=desc&page=${page}`
    const res = await fetch(url, { headers: ghHeaders() })
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`)
    const batch = await res.json()
    repos.push(...batch)
    if (batch.length < 100) break
  }
  return repos
}

// Repo names already covered by a hand-written project file, so we don't dupe.
function curatedRepoNames() {
  const names = new Set()
  for (const file of readdirSync(PROJECTS_DIR)) {
    if (!file.endsWith('.md') || file.startsWith(GEN_PREFIX)) continue
    const body = readFileSync(join(PROJECTS_DIR, file), 'utf8')
    const re = /github\.com\/[^/\s]+\/([A-Za-z0-9._-]+)/g
    let m
    while ((m = re.exec(body))) names.add(m[1].replace(/\.git$/, '').toLowerCase())
  }
  return names
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function titleCase(name) {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function techTags(repo) {
  const tags = []
  if (Array.isArray(repo.topics)) tags.push(...repo.topics)
  if (repo.language) tags.push(repo.language)
  const clean = tags
    .map((t) => String(t).toLowerCase().trim())
    .filter(Boolean)
  return [...new Set(clean)].slice(0, 6)
}

function esc(str) {
  return String(str || '').replace(/'/g, "''").replace(/[\r\n]+/g, ' ').trim()
}

function removeGenerated() {
  for (const file of readdirSync(PROJECTS_DIR)) {
    if (file.startsWith(GEN_PREFIX) && file.endsWith('.md')) {
      unlinkSync(join(PROJECTS_DIR, file))
    }
  }
}

async function main() {
  let repos
  try {
    repos = await fetchRepos()
  } catch (err) {
    console.error(`[sync-github-projects] fetch failed, keeping existing files: ${err.message}`)
    process.exit(0) // don't break the build if GitHub is unreachable
  }

  const curated = curatedRepoNames()

  const selected = repos
    .filter((r) => !r.fork && !r.archived && !r.private)
    .filter((r) => !EXCLUDE_NAMES.has(r.name.toLowerCase()))
    .filter((r) => !curated.has(r.name.toLowerCase()))
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))

  removeGenerated()

  selected.forEach((repo, i) => {
    const slug = slugify(repo.name)
    const title = titleCase(repo.name)
    const description = repo.description || `${title} — a project by ${GH_USER}.`
    const tech = techTags(repo)
    const link = repo.homepage && repo.homepage.trim() ? repo.homepage.trim() : repo.html_url
    const date = repo.pushed_at || repo.created_at
    const techYaml = `[${tech.map((t) => `'${esc(t)}'`).join(', ')}]`

    const md = `---
id: ${ID_BASE + i}
title: ${esc(title)}
description: ${esc(description)}
image: ${DEFAULT_IMAGE}
tech: ${techYaml}
link: '${esc(link)}'
github: '${esc(repo.html_url)}'
date: '${date}'
generated: true
---

## ${esc(title)}

${esc(description)}

### Links

- Live / repo: [${esc(link)}](${esc(link)})
- Source: [${esc(repo.html_url)}](${esc(repo.html_url)})
`

    writeFileSync(join(PROJECTS_DIR, `${GEN_PREFIX}${slug}.md`), md)
    console.log(`[sync-github-projects] wrote ${GEN_PREFIX}${slug}.md`)
  })

  console.log(`[sync-github-projects] generated ${selected.length} project(s)`)
}

main()
