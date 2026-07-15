---
id: 4
date: '2026-03-12'
title: Mac Mini AI Assistant
description: Telegram bot running on Mac Mini M4 with local Ollama LLM for intent routing, integrating Google Calendar, Microsoft To Do, and Obsidian.
image: /images/projects/mac-mini-assistant.png
tech: ['python', 'ollama', 'telegram', 'tailscale']
link: https://github.com/asam89/macmini-assistant
---

## Mac Mini AI Assistant

Personal AI assistant running entirely on local hardware.

### Key Features

- **Local LLM routing** via Ollama (Qwen 2.5:7B) for intent classification
- **Telegram interface** for natural language commands from anywhere
- **Tool integrations** — Google Calendar, Microsoft To Do, Obsidian
- **Tailscale networking** for secure remote access without port forwarding
- **Privacy-first** — sensitive data never leaves the local network

### Tech Stack

- Python (async Telegram bot)
- Ollama with Qwen 2.5:7B model
- Mac Mini M4 (16GB) as always-on server
- Tailscale for zero-config VPN access
