#!/usr/bin/env node
// Announces newly published blog posts on LinkedIn (personal profile and/or the
// Ignyte company page). Used by deploy.yml in two phases:
//
//   node scripts/linkedin-announce.mjs detect   (before the FTP upload)
//     Compares the freshly built dist/feed.xml with the feed that is live right
//     now on https://alexandersam.me/feed.xml and writes the posts that are new
//     to .linkedin-new-posts.json. If the live feed can't be read, nothing is
//     treated as new (so a hiccup never re-announces old posts).
//
//   node scripts/linkedin-announce.mjs post     (after a successful upload)
//     Shares each new post as an article on every author in LINKEDIN_AUTHOR_URNS.
//
// Env:
//   LINKEDIN_ACCESS_TOKEN  secret; OAuth token with w_member_social (and
//                          w_organization_social to post as a company page)
//   LINKEDIN_AUTHOR_URNS   comma-separated, e.g. "urn:li:person:abc123,urn:li:organization:456"
//   LINKEDIN_API_VERSION   optional YYYYMM LinkedIn-Version header (default below)
//   SITE_URL               optional, default https://alexandersam.me

import { existsSync, readFileSync, writeFileSync } from 'fs'

const mode = process.argv[2]
const SITE = (process.env.SITE_URL || 'https://alexandersam.me').replace(/\/$/, '')
const STATE = '.linkedin-new-posts.json'
const API_VERSION = process.env.LINKEDIN_API_VERSION || '202610'

const decode = (s) =>
  String(s || '')
    .replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'))
  return m ? decode(m[1]) : ''
}
const items = (xml) =>
  (xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []).map((b) => ({
    title: tag(b, 'title'),
    link: tag(b, 'link'),
    description: tag(b, 'description'),
  }))

async function detect() {
  if (!existsSync('dist/feed.xml')) {
    console.log('[linkedin] dist/feed.xml missing; nothing to announce')
    return writeFileSync(STATE, '[]')
  }
  const built = items(readFileSync('dist/feed.xml', 'utf8'))
  let live
  try {
    const res = await fetch(`${SITE}/feed.xml`, { signal: AbortSignal.timeout(20000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    live = items(await res.text())
  } catch (err) {
    console.log(`[linkedin] couldn't read live feed (${err.message}); announcing nothing this run`)
    return writeFileSync(STATE, '[]')
  }
  const seen = new Set(live.map((i) => i.link))
  const fresh = built.filter((i) => i.link && !seen.has(i.link))
  console.log(`[linkedin] ${fresh.length} newly published post(s)${fresh.length ? ': ' + fresh.map((i) => i.title).join(' | ') : ''}`)
  writeFileSync(STATE, JSON.stringify(fresh, null, 2))
}

async function post() {
  const fresh = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : []
  if (!fresh.length) return console.log('[linkedin] nothing new to announce')
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  const authors = (process.env.LINKEDIN_AUTHOR_URNS || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (!token || !authors.length) {
    console.log('::warning::New posts were published but LINKEDIN_ACCESS_TOKEN / LINKEDIN_AUTHOR_URNS are not set; skipping LinkedIn announcement.')
    return
  }
  let failures = 0
  for (const item of fresh) {
    for (const author of authors) {
      const body = {
        author,
        commentary: `New post: ${item.title}\n\n${item.description}\n\n${item.link}`.slice(0, 2900),
        visibility: 'PUBLIC',
        distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
        content: { article: { source: item.link, title: item.title.slice(0, 400), description: item.description.slice(0, 4000) } },
        lifecycleState: 'PUBLISHED',
        isReshareDisabledByAuthor: false,
      }
      const res = await fetch('https://api.linkedin.com/rest/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'LinkedIn-Version': API_VERSION,
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        console.log(`[linkedin] shared "${item.title}" as ${author} (${res.headers.get('x-restli-id') || res.status})`)
      } else {
        failures++
        console.log(`::warning::LinkedIn post failed for ${author} (${res.status}): ${(await res.text()).slice(0, 300)}`)
        if (res.status === 401) console.log('::warning::LinkedIn tokens expire after 60 days; refresh LINKEDIN_ACCESS_TOKEN.')
      }
    }
  }
  if (failures) console.log(`[linkedin] ${failures} share(s) failed; the site deploy itself succeeded.`)
}

if (mode === 'detect') await detect()
else if (mode === 'post') await post()
else {
  console.error('usage: node scripts/linkedin-announce.mjs detect|post')
  process.exit(1)
}
