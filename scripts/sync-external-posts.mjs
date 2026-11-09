#!/usr/bin/env node
// Pulls recent posts from the other blogs listed in karngyan.config.js
// (crossPost.externalBlogs, e.g. the Ignyte Consulting blog) and writes them to
// content/external/<blog-id>-<slug>.json so /blog can list them next to local
// posts, each linking out to the original. Runs in CI before `yarn generate`.
//
// For each blog, the RSS/Atom URL is `feed` if set; otherwise it is discovered
// from <link rel="alternate" type="application/rss+xml|atom+xml"> on `url`.
// Any failure is logged and skipped: the build never breaks because another
// site is down.

import { mkdirSync, readdirSync, unlinkSync, writeFileSync, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'content', 'external')
const MAX_PER_BLOG = 12
const UA = 'alexandersam.me-sync (+https://alexandersam.me)'

// karngyan.config.js is an ES module in a CommonJS package, so read the block as data.
function loadBlogs() {
  const src = readFileSync(join(ROOT, 'karngyan.config.js'), 'utf8')
  const m = src.match(/externalBlogs:\s*(\[[\s\S]*?\n\s*\])/)
  if (!m) return []
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${m[1]})`)()
}

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' }, redirect: 'follow', signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return { text: await res.text(), url: res.url }
}

const decode = (s) =>
  String(s || '')
    .replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .trim()

const stripTags = (s) => decode(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'))
  return m ? decode(m[1]) : ''
}

function discoverFeed(html, pageUrl) {
  const links = html.match(/<link\b[^>]*>/gi) || []
  for (const l of links) {
    if (/rel=["']?alternate/i.test(l) && /type=["']?application\/(rss|atom)\+xml/i.test(l)) {
      const href = l.match(/href=["']([^"']+)["']/i)
      if (href) return new URL(decode(href[1]), pageUrl).toString()
    }
  }
  return ''
}

function parseFeed(xml, base) {
  const items = []
  const isAtom = /<feed[\s>]/i.test(xml)
  const blocks = xml.match(isAtom ? /<entry[\s>][\s\S]*?<\/entry>/gi : /<item[\s>][\s\S]*?<\/item>/gi) || []
  for (const b of blocks) {
    let link = ''
    if (isAtom) {
      const alt = b.match(/<link\b[^>]*rel=["']alternate["'][^>]*>/i) || b.match(/<link\b[^>]*>/i)
      const href = alt && alt[0].match(/href=["']([^"']+)["']/i)
      link = href ? decode(href[1]) : ''
    } else {
      link = tag(b, 'link') || tag(b, 'guid')
    }
    const title = stripTags(tag(b, 'title'))
    if (!title || !link) continue
    const date = tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated') || tag(b, 'dc:date')
    const description = stripTags(tag(b, 'description') || tag(b, 'summary') || tag(b, 'content')).slice(0, 280)
    items.push({ title, url: new URL(link, base).toString(), date: date && !isNaN(new Date(date)) ? new Date(date).toISOString() : null, description })
  }
  return items
}

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  const blogs = loadBlogs()
  for (const blog of blogs) {
    const prefix = `${blog.id}-`
    let items
    try {
      let feed = blog.feed
      if (!feed) {
        const page = await get(blog.url)
        feed = discoverFeed(page.text, page.url)
        if (!feed) {
          console.log(`[sync-external-posts] ${blog.name}: no RSS/Atom feed found on ${blog.url}; set crossPost.externalBlogs[].feed to enable. Keeping existing files.`)
          continue
        }
      }
      const res = await get(feed)
      items = parseFeed(res.text, res.url).slice(0, MAX_PER_BLOG)
      console.log(`[sync-external-posts] ${blog.name}: ${items.length} post(s) from ${feed}`)
    } catch (err) {
      console.log(`[sync-external-posts] ${blog.name}: fetch failed (${err.message}); keeping existing files.`)
      continue
    }

    for (const f of readdirSync(OUT_DIR)) if (f.startsWith(prefix) && f.endsWith('.json')) unlinkSync(join(OUT_DIR, f))
    for (const item of items) {
      const doc = { ...item, source: blog.name, sourceUrl: blog.url, external: true }
      writeFileSync(join(OUT_DIR, `${prefix}${slugify(item.title) || 'post'}.json`), JSON.stringify(doc, null, 2) + '\n')
    }
  }
}

main().catch((err) => {
  console.log(`[sync-external-posts] unexpected error, skipping: ${err.message}`)
})
