# LifeOS

A browser based personal operating system - a desktop shell with a window manager, taskbar and a Start Menu, built around everyday apps: Tasks, Habits, Goals, Calendar, Journal, an AI Assistant. And like a real os, it also includes a Terminal with its own virtual file system, a file explorer and an App Store.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling / animation:** Tailwind CSS, Framer Motion
- **State:** Zustand (window manager), TanStack Query (data fetching)
- **Database:** Neon Postgres
- **Auth:** Auth.js (credentials-based)
- **AI Model for AI Assistant:** Gemini 2.5 Flash via API key

## Features

- Full desktop shell: draggable/resizable windows, taskbar, Start Menu, boot + lock screen
- Tasks, Habits, Goals, Calendar, Journal, Settings
- AI Assistant chat
- A virtual file system with a real Terminal shell and a File Explorer UI
- An App Store for installing more apps over time
- Desktop icons with drag-to-reorder and multi-select
- Per-window state persistence across refresh (e.g. Terminal keeps its history, Explorer keeps its folder)

## Getting Started (Running Locally)

```bash
git clone https://github.com/Aarib260/LifeOS.git
cd LifeOS
npm install
```

Create a `.env.local` file (never commit this) with:

```
DATABASE_URL=your_neon_postgres_connection_string
AUTH_SECRET=a_random_secret_string
HACKCLUB_AI_API_KEY=your_hackclub_ai_key
HACKCLUB_AI_MODEL=the_model_name
```

Then:

```bash
npm run dev
```

Open http://localhost:xxxx. Whatever url u get.
