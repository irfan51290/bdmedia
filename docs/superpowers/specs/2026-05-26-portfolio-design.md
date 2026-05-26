# Irfan Dhamiry — Portfolio Site Design Spec
**Date:** 2026-05-26
**Status:** Approved

---

## Overview

A personal portfolio website for Irfan Dhamiry, hosted at bdmedia.net. Showcases 6 AI-powered projects built with Claude — one per week — as a chronological builder's journey. Serves two audiences simultaneously: general visitors who can vote on projects they want developed further, and recruiters who want to assess technical skills and depth.

---

## Goals

- Tell the story of building 6 real-world tools with AI, one week at a time
- Let visitors vote on which projects they want developed further (validation signal)
- Display real-time vote counts on the homepage
- Give recruiters a clear, honest view of skills, stack, and complexity per project — without signalling it's a job-search portfolio
- Feel premium and futuristic (Apple-style smooth animations) while staying clean and readable

---

## Design Language

| Token | Value |
|---|---|
| Background | `#f8f8f4` (warm off-white) |
| Accent | `#2563eb` (electric blue) |
| Text primary | `#111` |
| Text secondary | `#666` / `#888` |
| Card background | `#ffffff` |
| Border | `#e8e8e0` |
| Accent light | `#eff6ff` (blue tint for tags, icon fills) |
| Dark strip | `#111` (about section) |
| Font | `-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif` |

**Accent usage:** Electric blue is used for the logo dot, hero emphasis words, section labels, category badges, week badges, tag fills, vote button, complexity bars, and hover states. Everything else is neutral.

---

## Hero Copy (Evergreen)

```
1 app.
1 week.
1 real problem.
```

Subtitle: *"Building AI-powered tools to solve real-world problems — one week at a time."*

This never needs updating regardless of how many projects are added.

---

## Site Structure

```
bdmedia/
├── index.html               ← Homepage (timeline generated from projects.js)
├── finance-tracker.html     ← Week 1
├── color-fit.html           ← Week 2
├── dream-future-quiz.html   ← Week 3
├── watch-hunter.html        ← Week 4
├── jobber.html              ← Week 5
├── stocks-manager.html      ← Week 6
├── css/
│   └── style.css            ← Shared styles
└── js/
    ├── projects.js          ← Single source of truth for all project data
    ├── main.js              ← Renders timeline from projects.js, scroll animations, nav
    └── votes.js             ← Supabase real-time vote logic
```

**`projects.js` data shape (one object per project):**
```js
const PROJECTS = [
  {
    id: 'finance-tracker',
    week: 1,
    title: 'Finance Tracker',
    category: 'Finance · AI',
    description: 'Upload your bank statement and AI automatically recategorises your spending into a clean visual breakdown.',
    icon: '💰',
    tags: ['Python', 'Claude AI', 'Data Viz'],
    status: 'Live',
    buildCost: '~$20',
    monthlyCost: '$0',
    page: 'finance-tracker.html',
  },
  // ... one entry per project
];
```

Adding a new project = append one object to this array + create the detail HTML page.

All pages are plain HTML files. No framework, no build step. Deployable as a static site drop onto any web host.

**Adding a new project in the future requires only two steps:**
1. Edit `js/projects.js` — add one object to the array (name, week, description, stack, costs, etc.)
2. Create the new `week-N-project.html` detail page by copying an existing one

The homepage timeline, vote counts, and prev/next navigation all update automatically from the data file. No need to touch `index.html`.

---

## Pages

### 1. Homepage (`index.html`)

**Sections in order:**

#### Nav (fixed, frosted glass)
- Logo: `irfan.` (blue dot)
- Links: Work · About · Contact
- Always visible, backdrop blur + off-white tint

#### Hero
- Eyebrow: `Irfan Dhamiry · Singapore`
- Headline: `1 app. / 1 week. / 1 real problem.` (large, staggered fade-up on load)
- Subtitle paragraph
- CTA button: `See the journey ↓` (scrolls to timeline)
- Background: subtle floating blue radial gradient blob (CSS animation)

#### Timeline (scroll-triggered)
- Section label: `The Journey` with blue accent and a horizontal rule extending to the right
- Vertical blue line connecting all 6 project entries
- Each entry: week badge (left column) + project card (right column)
- Project cards slide up and fade in via Intersection Observer as they enter the viewport, staggered by 100ms each
- Week 6 (Stocks Manager) card has a blue-filled background and blue icon to signal it as the most ambitious build

**Each project card on homepage shows:**
- Week badge (e.g. `Wk 1`)
- Category label + project name + one-line description
- Tech stack tags
- Vote count with live dot: `247 want this` (Supabase Realtime)
- Arrow (`↗`) — navigates to detail page on click
- Hover: card lifts 3px, border turns blue, icon fills blue

#### About Strip (dark)
- Background `#111`
- Left: `Irfan / Dhamiry.` large text (blue accent on surname)
- Right: 2-sentence bio + `Get in touch →` email link

#### Footer
- `Irfan Dhamiry © 2026` · `Built with Claude`

---

### 2. Project Detail Pages (×6)

Same structure for every project. Content differs per project.

**Sections in order:**

#### Nav
Same as homepage. Back link: `← All projects` on the right.

#### Hero Band
- Week + category badge: e.g. `Week 4 · Automation`
- Large icon (72×72px, blue filled, rounded, shadow)
- Project title (large, tight tracking)
- One-paragraph tagline (2–3 sentences)
- Meta row: Built in / Stack tags / Status (● Live or ● In Progress) / Build cost / Monthly running cost

#### Vote Bar
- Button: 👍 `Want this developed further?`
  - On click: turns green, shows `✅ Thanks for the vote!`
  - Second click: undoes vote (toggle)
  - One vote per device enforced via localStorage
- Vote count: large number + `people want this` + live pulsing green dot
- Context blurb (right side): *"Vote to show your interest. I use this to gauge which projects are worth developing further — no guarantees, just real signal."*

#### Mockup Frame
- Browser chrome (three dots, URL label)
- Dark body area — user drops in a screenshot, GIF, or the existing mockup.html rendered as an image

#### Content Blocks (2×2 grid)
1. **The Problem** — Why this project existed
2. **How It Works** — Bullet list of key technical steps
3. **What I Learned** — Honest reflection on hard parts
4. **Built With Claude** — How Claude Code was used to build it

#### Skills & Stack
- Section label: `Skills & Stack`
- Two cards side by side:
  - **Skills Demonstrated** — Tags colour-coded: blue = confident, amber = still learning. Legend underneath.
  - **Complexity Breakdown** — Three horizontal bar charts: Backend/Systems · Frontend/UI · AI Integration. Each labelled with level (Beginner / Intermediate / Advanced / None).

#### Prev/Next Navigation
- `← Week N / Project Name` on left
- `Week N → / Project Name` on right
- Wraps around (Week 1 prev = Week 6, Week 6 next = Week 1)

---

## Project Data

| Week | Project | Category | Stack | Status |
|---|---|---|---|---|
| 1 | Finance Tracker | Finance · AI | Python, Claude AI, Data Viz | Live |
| 2 | Color-Fit | TBD | TBD | TBD |
| 3 | Dream Future Quiz | Web App · Quiz | Next.js, Vercel, JavaScript | Live |
| 4 | Carousell Watch Hunter | Automation · Bot | Python, Playwright, Telegram API, SQLite | Live |
| 5 | Jobber | iOS App · AI | React Native, Expo, Supabase, GPT-4 | In Progress |
| 6 | Stocks Manager | Trading · Dashboard | Python, Claude AI, React | Live |

> Color-Fit description and stack to be filled in by Irfan before build.

---

## Vote System (Supabase)

**Why Supabase:** Irfan already uses it in Jobber. Free tier covers this volume. No Node or build step needed — accessed via the Supabase JavaScript client loaded from CDN.

**Database schema:**

```sql
create table projects (
  id text primary key,        -- e.g. 'watch-hunter'
  name text not null,
  vote_count integer default 0
);
```

**Vote logic (`votes.js`):**
1. On page load: fetch current vote count from Supabase, render it
2. Subscribe to Supabase Realtime on the `projects` table — update displayed count live whenever any user votes
3. On vote button click: check localStorage for `voted_<project_id>`
   - If not voted: call Supabase RPC `increment_vote(project_id)`, set localStorage flag, update UI to voted state
   - If already voted: call Supabase RPC `decrement_vote(project_id)`, clear localStorage flag, revert UI

**Homepage:** Loads vote count for all 6 projects in a single query on page load. Subscribes to Realtime for live updates.

---

## Animation Spec

All animations use CSS + vanilla JS only. No libraries.

| Element | Animation | Trigger |
|---|---|---|
| Hero eyebrow | Fade up, 0.8s, delay 0.2s | Page load |
| Hero headline | Fade up, 0.9s, delay 0.4s | Page load |
| Hero subtitle | Fade up, 0.9s, delay 0.6s | Page load |
| Hero CTA | Fade up, 0.9s, delay 0.8s | Page load |
| Timeline items | Fade up + translate Y, 0.7s | Intersection Observer (threshold 0.12), staggered 100ms |
| Project card hover | translateY(-3px) + border blue + shadow | CSS :hover |
| Card icon hover | Background fills blue (#2563eb) | CSS :hover |
| Vote button click | Background → green, scale 0.97 then release | JS onclick |
| Nav background | Fade in backdrop blur | CSS (always visible, blur via backdrop-filter) |
| Hero blob | Float up/down, 7s loop | CSS keyframe |
| Detail page sections | Fade up on load, staggered 0.1s each | CSS animation with delay |
| Prev/next hover | Opacity 0.65 | CSS :hover |

---

## Responsive Behaviour

Desktop-first design. Mobile breakpoints:
- **< 768px:** Nav links hidden (hamburger or just logo), single-column content grid, timeline collapses to vertical list without the left column, vote bar stacks vertically
- **< 480px:** Hero font size clamps down, padding reduced

---

## Project Costings

Each detail page shows two cost figures in the meta row, demonstrating the efficiency of AI-assisted development:

| Field | What to put | Example |
|---|---|---|
| **Build cost** | Total spent to build the project (Claude Pro subscription, any paid APIs, tools) | `~$20` (one month Claude Pro) |
| **Monthly running cost** | Ongoing infra/API cost to keep it live | `$0` (free tier) or `~$5/mo` |

These are honest estimates. If a project used only the Claude Pro subscription ($20/mo flat) and free-tier APIs, build cost is `~$20`. If it also used paid APIs or a VPS, add those in.

**Suggested costings per project (to be confirmed by Irfan):**

| Project | Build Cost | Monthly Cost |
|---|---|---|
| Finance Tracker | ~$20 | $0 |
| Color-Fit | TBD | TBD |
| Dream Future Quiz | ~$20 | $0 (Vercel free) |
| Watch Hunter | ~$20 | ~$5 (VPS) |
| Jobber | ~$20 | $0 (Supabase free) |
| Stocks Manager | ~$20 | $0 |

> Irfan to confirm/adjust before build. The point is to show that real, working tools were built for the cost of one subscription — a strong signal of AI development efficiency.

---

## What's Not In Scope

- CMS or admin panel — content is hardcoded in HTML
- Contact form — email link only
- Analytics — can be added later via a script tag
- Color-Fit content — placeholder until Irfan provides description
- Dark mode toggle
