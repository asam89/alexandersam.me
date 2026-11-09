#!/usr/bin/env node
// Drafts a blog post with Claude and writes it to content/posts/<slug>.md.
// Run by .github/workflows/blog-draft.yml, which then opens a PR for review.
// Nothing is published until a human merges that PR.
//
// Env:
//   ANTHROPIC_API_KEY  required
//   TOPIC              required - what the post is about
//   NOTES              optional - bullet points, facts, links, a rough outline
//   PUBLISH_DATE       optional - YYYY-MM-DD; future dates stay hidden until then
//   DRAFT_MODEL        optional - defaults to claude-opus-5-5

import Anthropic from '@anthropic-ai/sdk'
import { existsSync, readFileSync, readdirSync, writeFileSync, appendFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const POSTS_DIR = join(ROOT, 'content', 'posts')
const PROJECTS_DIR = join(ROOT, 'content', 'projects')

const topic = (process.env.TOPIC || '').trim()
const notes = (process.env.NOTES || '').trim()
const model = (process.env.DRAFT_MODEL || '').trim() || 'claude-opus-5-5'
const publishDate = (process.env.PUBLISH_DATE || '').trim() || new Date().toISOString().slice(0, 10)

if (!topic) fail('TOPIC is empty - nothing to write about.')
if (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate)) fail(`PUBLISH_DATE must be YYYY-MM-DD, got "${publishDate}"`)

function fail(msg) {
  console.error(`[draft-post] ${msg}`)
  process.exit(1)
}

function read(rel) {
  const p = join(ROOT, rel)
  return existsSync(p) ? readFileSync(p, 'utf8') : ''
}

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/)
  return m ? m[1] : ''
}

// --- Context so the draft is grounded in Alex's real background -------------
const existingPosts = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
const styleSample = existingPosts.length ? readFileSync(join(POSTS_DIR, existingPosts[0]), 'utf8') : ''
const projectSummaries = readdirSync(PROJECTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => frontmatter(readFileSync(join(PROJECTS_DIR, f), 'utf8')))
  .join('\n---\n')

const nextId =
  1 +
  Math.max(
    0,
    ...existingPosts.map((f) => {
      const m = frontmatter(readFileSync(join(POSTS_DIR, f), 'utf8')).match(/^id:\s*(\d+)/m)
      return m ? Number(m[1]) : 0
    })
  )

const system = `You write blog posts for alexandersam.me, the personal site of Alexander (Alex) Sam: a Toronto-based technical project manager, engineer, and founder of Ignyte Consulting (an IT consulting / MSP firm).

Rules:
- Write in first person as Alex. Practical, direct, technical where useful; no hype, no filler intros.
- Only state facts about Alex (employers, projects, metrics, certifications, clients) that appear in the provided context or notes. Never invent numbers, clients, or credentials. Where a concrete personal detail would help but isn't provided, insert an HTML comment like <!-- TODO(alex): add the real migration timeline --> so the reviewer can fill it in.
- Body is GitHub-flavoured Markdown. Start with a "## " heading (the page already renders the title as H1). Use ## / ### headings, short paragraphs, lists, tables and fenced code blocks with a language tag where they help.
- Aim for 900-1800 words unless the notes ask otherwise.
- tags: 2-6 lowercase, hyphenated keywords.
- slug: lowercase, hyphen-separated, max 60 chars, no dates.`

const user = `Write a new blog post.

<topic>
${topic}
</topic>

<notes>
${notes || '(none provided)'}
</notes>

<site_config description="Alex's profile, socials, worked-at list and homepage copy">
${read('karngyan.config.js')}
</site_config>

<experience_section>
${read('components/home/ExperienceSection.vue')}
</experience_section>

<certifications_section>
${read('components/home/Certifications.vue')}
</certifications_section>

<projects description="frontmatter of every project card on the site">
${projectSummaries}
</projects>

<existing_post description="match this voice and formatting">
${styleSample}
</existing_post>`

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'slug', 'description', 'tags', 'body'],
  properties: {
    title: { type: 'string' },
    slug: { type: 'string' },
    description: { type: 'string', description: 'One sentence, under 200 characters, for cards, RSS and meta tags.' },
    tags: { type: 'array', items: { type: 'string' } },
    body: { type: 'string', description: 'Markdown body without frontmatter.' },
  },
}

const client = new Anthropic()

console.log(`[draft-post] drafting "${topic}" with ${model}`)
const stream = client.beta.messages.stream({
  model,
  max_tokens: 32000,
  thinking: { type: 'adaptive' },
  output_config: { effort: 'high', format: { type: 'json_schema', schema } },
  // If a safety classifier declines, retry server-side on Anthropic's recommended fallback model.
  betas: ['server-side-fallback-2026-07-01'],
  fallbacks: 'default',
  system,
  messages: [{ role: 'user', content: user }],
})
const message = await stream.finalMessage()

if (message.stop_reason === 'refusal') {
  fail(`model declined the request (${message.stop_details?.category ?? 'no category'}): ${message.stop_details?.explanation ?? ''}`)
}
if (message.stop_reason === 'max_tokens') fail('response hit max_tokens before finishing; try a narrower topic.')

const text = message.content
  .filter((b) => b.type === 'text')
  .map((b) => b.text)
  .join('')

let post
try {
  post = JSON.parse(text)
} catch (err) {
  fail(`could not parse model output as JSON: ${err.message}`)
}

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')

let slug = slugify(post.slug || post.title) || `post-${nextId}`
let n = 2
const base = slug
while (existsSync(join(POSTS_DIR, `${slug}.md`))) slug = `${base}-${n++}`

const q = (s) => JSON.stringify(String(s).replace(/[\r\n]+/g, ' ').trim())
const tags = (post.tags || []).map((t) => `'${slugify(t)}'`).filter((t) => t !== "''")

const md = `---
id: ${nextId}
title: ${q(post.title)}
description: ${q(post.description)}
date: ${publishDate}
author: Alexander Sam
tags: [${tags.join(', ')}]
---

${String(post.body).trim()}
`

const file = join(POSTS_DIR, `${slug}.md`)
writeFileSync(file, md)
console.log(`[draft-post] wrote content/posts/${slug}.md (${message.usage.output_tokens} output tokens, served by ${message.model})`)

// Hand values to later workflow steps.
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `slug=${slug}\ntitle=${String(post.title).replace(/[\r\n]+/g, ' ')}\nfile=content/posts/${slug}.md\n`)
}
