---
id: 2
title: MyCareer Bot
description: AI-driven career automation platform — analyzes job descriptions, tailors resumes and cover letters, tracks applications, and auto-applies to jobs.
tech: python fastapi sqlite anthropic playwright docker
logo: /images/projects/mycareer.png
website: ''
github: https://github.com/asam89/career-dev-bot
twitter: ''
---

## MyCareer Bot

An AI-driven career automation platform that streamlines the entire job application lifecycle.

### Key Features

- **Job description analysis** with fit scoring (0–5 scale)
- **Tailored resume generation** — AI rewrites your resume for each role
- **Cover letter generation** from templates and job context
- **Application pipeline tracking** (Saved → Applied → Interview → Offer)
- **Auto-apply automation** using Playwright browser automation
- **Resume template gallery** with upload style extraction
- **PDF + DOCX export** with WeasyPrint
- **Token usage tracking** and budget management for AI agents

### Tech Stack

- FastAPI + Python
- SQLite for persistence
- Anthropic Claude API for AI
- Playwright for browser automation
- Jinja2 templates + WeasyPrint for PDF generation
- Docker for deployment
