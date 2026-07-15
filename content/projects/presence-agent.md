---
id: 12
date: '2026-06-06'
title: Presence Agent
description: Autonomous GitHub commit agent that reads context, generates daily build logs, and commits 3x/day via Claude API on OCI Ampere.
image: /images/projects/ignytedev-bot.png
tech: ['python', 'claude-api', 'oci', 'github-actions']
link: https://github.com/asam89/presence-agent
---

## Presence Agent

Autonomous agent that maintains a daily public build log on GitHub.

### Key Features

- **Autonomous operation** — runs 3x daily without manual intervention
- **Context-aware** — reads CareerBot and project data for relevant content
- **Claude API integration** — generates meaningful commit messages and logs
- **OCI Ampere deployment** — always-on ARM instance for low-cost operation

### Tech Stack

- Python with Claude API
- Oracle Cloud Infrastructure (Ampere A1)
- GitHub API for automated commits
- Cron-based scheduling
