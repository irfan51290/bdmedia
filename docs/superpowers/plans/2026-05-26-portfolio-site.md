# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Irfan Dhamiry's portfolio site in `bdmedia/` — a clean minimal static site with electric blue accents, an animated week-by-week project timeline, per-project detail pages, and a real-time Supabase vote system.

**Architecture:** Pure static HTML/CSS/JS — no framework, no build step. A single `projects.js` data file drives the homepage timeline and all prev/next navigation so adding a new project only requires one data edit + one new HTML page. Supabase (JS CDN client) handles real-time vote counts.

**Tech Stack:** HTML5, CSS3 (custom properties, Intersection Observer, CSS keyframes), vanilla JS (ES2020), Supabase JS v2 (CDN), Supabase Realtime

---

## File Map

| File | Responsibility |
|---|---|
| `index.html` | Homepage shell — nav, hero, `<div id="timeline">` placeholder, about strip, footer |
| `finance-tracker.html` | Week 1 detail page |
| `color-fit.html` | Week 2 detail page |
| `dream-future-quiz.html` | Week 3 detail page |
| `watch-hunter.html` | Week 4 detail page |
| `jobber.html` | Week 5 detail page |
| `stocks-manager.html` | Week 6 detail page |
| `css/style.css` | All styles — design tokens, nav, hero, timeline, detail page, vote bar, skills section, responsive |
| `js/projects.js` | `const PROJECTS = [...]` — single source of truth for all project data |
| `js/votes.js` | Supabase init, fetch vote counts, realtime subscription, castVote/undoVote, localStorage dedup |
| `js/main.js` | `renderTimeline()` for homepage, `renderDetailNav()` for detail pages, scroll animations |

---

## Task 1: Scaffold the folder structure

**Files:**
- Create: `bdmedia/css/style.css`
- Create: `bdmedia/js/projects.js`
- Create: `bdmedia/js/votes.js`
- Create: `bdmedia/js/main.js`

- [ ] **Step 1: Create the folders**

```bash
mkdir -p "c:/Users/Irfan/Desktop/Visual Studio/bdmedia/css"
mkdir -p "c:/Users/Irfan/Desktop/Visual Studio/bdmedia/js"
```

- [ ] **Step 2: Create `css/style.css` with design tokens and CSS reset**

```css
/* ============================================================
   DESIGN TOKENS
   ============================================================ */
:root {
  --bg:          #f8f8f4;
  --bg-card:     #ffffff;
  --accent:      #2563eb;
  --accent-light:#eff6ff;
  --accent-border:#bfdbfe;
  --text-primary:#111111;
  --text-secondary:#666666;
  --text-muted:  #888888;
  --text-dim:    #aaaaaa;
  --border:      #e8e8e0;
  --dark-bg:     #111111;
  --green:       #16a34a;
  --amber:       #d97706;
  --shadow-blue: rgba(37, 99, 235, 0.12);
  --font:        -apple-system, 'SF Pro Display', 'Segoe UI', sans-serif;
  --radius-sm:   8px;
  --radius-md:   14px;
  --radius-lg:   20px;
  --radius-pill: 100px;
}

/* ============================================================
   RESET
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text-primary);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
a { text-decoration: none; color: inherit; }
button { font-family: var(--font); cursor: pointer; border: none; background: none; }

/* ============================================================
   TYPOGRAPHY UTILITIES
   ============================================================ */
.label {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 2px;
  color: var(--accent);
}
.section-rule {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 56px;
}
.section-rule::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

/* ============================================================
   NAV
   ============================================================ */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 48px;
  background: rgba(248, 248, 244, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}
.nav-logo {
  font-size: 17px; font-weight: 800; letter-spacing: -0.5px;
  color: var(--text-primary);
}
.nav-logo .dot { color: var(--accent); }
.nav-links { display: flex; gap: 28px; }
.nav-links a {
  font-size: 13px; color: var(--text-muted);
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--text-primary); }
.nav-back {
  font-size: 13px; color: var(--text-muted);
  transition: color 0.2s;
}
.nav-back:hover { color: var(--accent); }

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50%       { transform: translateY(-53%) scale(1.05); }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}
.fade-up-1 { opacity: 0; animation: fadeUp 0.8s ease 0.2s forwards; }
.fade-up-2 { opacity: 0; animation: fadeUp 0.9s ease 0.4s forwards; }
.fade-up-3 { opacity: 0; animation: fadeUp 0.9s ease 0.6s forwards; }
.fade-up-4 { opacity: 0; animation: fadeUp 0.9s ease 0.8s forwards; }
.fade-up-5 { opacity: 0; animation: fadeUp 0.9s ease 1.0s forwards; }

/* Scroll-reveal — JS adds .visible */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
```

- [ ] **Step 3: Create empty `js/projects.js`, `js/votes.js`, `js/main.js`**

```js
// js/projects.js — filled in Task 2
const PROJECTS = [];
```

```js
// js/votes.js — filled in Tasks 8–9
```

```js
// js/main.js — filled in Tasks 4, 6, 14
```

- [ ] **Step 4: Verify folder structure**

Open File Explorer and confirm:
```
bdmedia/
├── css/style.css
└── js/
    ├── projects.js
    ├── votes.js
    └── main.js
```

---

## Task 2: Build `projects.js` — single source of truth

**Files:**
- Modify: `bdmedia/js/projects.js`

- [ ] **Step 1: Write the full PROJECTS array**

```js
// js/projects.js
const PROJECTS = [
  {
    id:          'finance-tracker',
    week:        1,
    title:       'Finance Tracker',
    category:    'Finance · AI',
    description: 'Upload your bank statement and AI automatically recategorises your spending into a clean visual breakdown.',
    icon:        '💰',
    tags:        ['Python', 'Claude AI', 'Data Viz'],
    status:      'Live',
    buildCost:   '~$20',
    monthlyCost: '$0',
    page:        'finance-tracker.html',
    skills: {
      confident: ['Data Processing', 'Claude AI Integration', 'Python Scripting'],
      learning:  ['Data Visualisation'],
    },
    complexity: { backend: 70, frontend: 20, ai: 80 },
  },
  {
    id:          'color-fit',
    week:        2,
    title:       'Color-Fit',
    category:    'Web App · Design',
    description: 'TBD — fill in before launch.',
    icon:        '🎨',
    tags:        ['TBD'],
    status:      'Live',
    buildCost:   '~$20',
    monthlyCost: '$0',
    page:        'color-fit.html',
    skills: {
      confident: [],
      learning:  [],
    },
    complexity: { backend: 0, frontend: 0, ai: 0 },
  },
  {
    id:          'dream-future-quiz',
    week:        3,
    title:       'Dream Future Quiz',
    category:    'Web App · Quiz',
    description: 'A personality quiz that maps your dreams and ambitions to a future career path.',
    icon:        '🔮',
    tags:        ['Next.js', 'Vercel', 'JavaScript'],
    status:      'Live',
    buildCost:   '~$20',
    monthlyCost: '$0',
    page:        'dream-future-quiz.html',
    skills: {
      confident: ['Next.js', 'React', 'Vercel Deployment'],
      learning:  ['UX Flow Design'],
    },
    complexity: { backend: 10, frontend: 75, ai: 30 },
  },
  {
    id:          'watch-hunter',
    week:        4,
    title:       'Carousell Watch Hunter',
    category:    'Automation · Bot',
    description: 'Monitors Carousell SG every 15 minutes for undervalued Rolex, AP & RM watches. Sends a Telegram alert with one-tap auto-message to the seller.',
    icon:        '⌚',
    tags:        ['Python', 'Playwright', 'Telegram API', 'SQLite'],
    status:      'Live',
    buildCost:   '~$20',
    monthlyCost: '~$5',
    page:        'watch-hunter.html',
    skills: {
      confident: ['Web Scraping', 'Async Python', 'Bot Architecture', 'API Integration'],
      learning:  ['VPS Deployment', 'Rate Limiting'],
    },
    complexity: { backend: 85, frontend: 0, ai: 55 },
  },
  {
    id:          'jobber',
    week:        5,
    title:       'Jobber',
    category:    'iOS App · AI',
    description: 'Tinder-style job search for iOS. Swipe right to apply, left to skip. AI auto-tailors your resume per role and tracks every application.',
    icon:        '💼',
    tags:        ['React Native', 'Expo', 'Supabase', 'GPT-4'],
    status:      'In Progress',
    buildCost:   '~$20',
    monthlyCost: '$0',
    page:        'jobber.html',
    skills: {
      confident: ['React Native', 'Supabase', 'Mobile UI'],
      learning:  ['iOS Deployment', 'AI Resume Parsing'],
    },
    complexity: { backend: 65, frontend: 80, ai: 70 },
  },
  {
    id:          'stocks-manager',
    week:        6,
    title:       'Stocks Manager',
    category:    'Trading · Dashboard',
    description: 'A real-time trading dashboard with live market data, portfolio tracking, AI-powered alerts, and a full component system.',
    icon:        '📈',
    tags:        ['Python', 'Claude AI', 'React'],
    status:      'Live',
    buildCost:   '~$20',
    monthlyCost: '$0',
    page:        'stocks-manager.html',
    skills: {
      confident: ['React', 'Python Backend', 'Real-Time Data', 'Claude AI'],
      learning:  ['WebSocket Streams', 'Financial APIs'],
    },
    complexity: { backend: 80, frontend: 85, ai: 75 },
  },
];
```

- [ ] **Step 2: Open browser console and verify**

Open any HTML file in browser, add a temporary `<script src="js/projects.js">` tag, then in console:
```js
console.log(PROJECTS.length); // expected: 6
console.log(PROJECTS[3].id);  // expected: 'watch-hunter'
```

---

## Task 3: Homepage HTML — nav + hero

**Files:**
- Create: `bdmedia/index.html`
- Modify: `bdmedia/css/style.css` (append hero styles)

- [ ] **Step 1: Create `index.html` shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Irfan Dhamiry — AI Builder</title>
  <link rel="stylesheet" href="css/style.css"/>
</head>
<body>

  <!-- NAV -->
  <nav class="nav">
    <div class="nav-logo">irfan<span class="dot">.</span></div>
    <div class="nav-links">
      <a href="#timeline">Work</a>
      <a href="#about">About</a>
      <a href="mailto:irfan51290@gmail.com">Contact</a>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-blob"></div>
    <div class="hero-eyebrow fade-up-1">Irfan Dhamiry · Singapore</div>
    <h1 class="hero-title fade-up-2">
      1 app.<br>
      1 week.<br>
      <span class="hero-accent">1 real problem.</span>
    </h1>
    <p class="hero-subtitle fade-up-3">
      Building AI-powered tools to solve real-world problems — one week at a time.
    </p>
    <a href="#timeline" class="hero-cta fade-up-4">See the journey ↓</a>
  </section>

  <!-- TIMELINE (rendered by main.js) -->
  <section class="timeline-section" id="timeline">
    <div class="section-rule label">The Journey</div>
    <div class="timeline" id="timeline-list"></div>
  </section>

  <!-- ABOUT -->
  <div class="about-strip" id="about">
    <div class="about-name">Irfan<br><span>Dhamiry.</span></div>
    <div class="about-body">
      <p>Based in Singapore. I build AI-powered tools that solve real problems — one week at a time. Everything here was made with Claude as my co-builder.</p>
      <a href="mailto:irfan51290@gmail.com" class="about-contact">Get in touch →</a>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <span>Irfan Dhamiry © 2026</span>
    <span>Built with Claude</span>
  </footer>

  <script src="js/projects.js"></script>
  <script src="js/votes.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Append hero styles to `css/style.css`**

```css
/* ============================================================
   HERO
   ============================================================ */
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 140px 48px 80px;
  position: relative; overflow: hidden;
}
.hero-blob {
  position: absolute; right: -100px; top: 50%; transform: translateY(-50%);
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%);
  border-radius: 50%;
  animation: float 7s ease-in-out infinite;
  pointer-events: none;
}
.hero-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--accent); margin-bottom: 22px;
}
.hero-title {
  font-size: clamp(52px, 7vw, 96px);
  font-weight: 800; letter-spacing: -3px; line-height: 1.0;
  color: var(--text-primary); margin-bottom: 24px;
}
.hero-accent { color: var(--accent); }
.hero-subtitle {
  font-size: 17px; color: var(--text-secondary); max-width: 460px;
  line-height: 1.75; margin-bottom: 40px;
}
.hero-cta {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--text-primary); color: white;
  padding: 14px 28px; border-radius: var(--radius-pill);
  font-size: 14px; font-weight: 600;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  width: fit-content;
}
.hero-cta:hover {
  background: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37,99,235,0.3);
}

/* ============================================================
   ABOUT STRIP
   ============================================================ */
.about-strip {
  background: var(--dark-bg); color: white;
  padding: 80px 48px;
  display: flex; align-items: center; gap: 80px;
}
.about-name {
  font-size: 44px; font-weight: 800; letter-spacing: -1.5px;
  white-space: nowrap; line-height: 1.1; flex-shrink: 0;
}
.about-name span { color: var(--accent); }
.about-body p {
  font-size: 15px; color: #999; line-height: 1.8;
  max-width: 480px; margin-bottom: 24px;
}
.about-contact {
  font-size: 13px; font-weight: 600; color: var(--accent);
  border-bottom: 1px solid rgba(37,99,235,0.4); padding-bottom: 2px;
  display: inline-flex; align-items: center; gap: 6px;
  transition: opacity 0.2s;
}
.about-contact:hover { opacity: 0.75; }

/* ============================================================
   FOOTER
   ============================================================ */
.footer {
  padding: 28px 48px;
  display: flex; justify-content: space-between;
  border-top: 1px solid var(--border);
  font-size: 12px; color: var(--text-dim);
}
```

- [ ] **Step 3: Open `index.html` in browser**

Expected: nav visible at top, large hero title visible, about strip dark at bottom, footer. Timeline section empty (rendered in Task 4).

---

## Task 4: Homepage timeline rendering (`main.js`)

**Files:**
- Modify: `bdmedia/js/main.js`
- Modify: `bdmedia/css/style.css` (append timeline styles)

- [ ] **Step 1: Append timeline styles to `css/style.css`**

```css
/* ============================================================
   TIMELINE
   ============================================================ */
.timeline-section {
  padding: 80px 48px 120px;
}
.timeline {
  position: relative;
}
.timeline::before {
  content: '';
  position: absolute; left: 72px; top: 0; bottom: 0; width: 1px;
  background: linear-gradient(to bottom, var(--accent) 0%, var(--border) 100%);
}

.timeline-item {
  display: flex; gap: 0; position: relative;
}

/* Week column */
.week-col {
  width: 72px; flex-shrink: 0;
  display: flex; flex-direction: column; align-items: center;
  padding-top: 30px; position: relative;
}
.week-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--accent); border: 2px solid var(--bg);
  position: absolute; left: 50%; top: 30px;
  transform: translateX(-50%); z-index: 3;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
}
.week-badge {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--accent);
  background: var(--accent-light); border: 1px solid var(--accent-border);
  border-radius: var(--radius-pill); padding: 4px 10px;
  white-space: nowrap; position: relative; z-index: 2;
  margin-top: 24px;
}
.week-badge.featured {
  background: var(--accent); color: white; border-color: var(--accent);
}

/* Project card */
.project-card {
  flex: 1; margin-left: 28px; margin-bottom: 40px;
  background: var(--bg-card); border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  padding: 26px 30px;
  display: flex; gap: 20px; align-items: flex-start;
  cursor: pointer;
  transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
}
.project-card:hover {
  box-shadow: 0 12px 40px var(--shadow-blue);
  transform: translateY(-3px);
  border-color: var(--accent-border);
}
.project-card.featured {
  border-color: var(--accent-border);
  background: linear-gradient(135deg, #fff 0%, var(--accent-light) 100%);
}
.project-card:hover .card-icon { background: var(--accent); }
.project-card:hover .card-icon-emoji { filter: brightness(10); }
.project-card:hover .card-arrow { color: var(--accent); transform: translate(3px, -3px); }

.card-icon {
  width: 54px; height: 54px; border-radius: 13px;
  background: var(--accent-light); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.25s;
}
.card-icon.featured { background: var(--accent); }
.card-icon-emoji {
  font-size: 26px;
  transition: filter 0.25s;
}
.card-body { flex: 1; min-width: 0; }
.card-category {
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 1.2px; color: var(--accent); margin-bottom: 5px;
}
.card-name {
  font-size: 20px; font-weight: 800; letter-spacing: -0.5px;
  color: var(--text-primary); margin-bottom: 6px;
}
.card-desc {
  font-size: 13px; color: var(--text-muted); line-height: 1.55;
  margin-bottom: 14px;
}
.card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.card-tag {
  font-size: 10px; font-weight: 600; padding: 4px 10px;
  border-radius: var(--radius-pill);
  background: var(--accent-light); color: var(--accent);
}
.card-right {
  display: flex; flex-direction: column;
  align-items: flex-end; gap: 12px; flex-shrink: 0;
}
.card-arrow {
  font-size: 20px; color: var(--border);
  transition: color 0.2s, transform 0.2s;
}
.card-votes {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: var(--text-muted);
}
.vote-live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--green); animation: pulse 2s infinite; flex-shrink: 0;
}
.vote-num { font-weight: 700; color: var(--text-primary); font-size: 14px; }
```

- [ ] **Step 2: Write `renderTimeline()` in `main.js`**

```js
// js/main.js

function renderTimeline() {
  const container = document.getElementById('timeline-list');
  if (!container) return;

  container.innerHTML = PROJECTS.map((p, i) => {
    const isFeatured = i === PROJECTS.length - 1;
    return `
      <div class="timeline-item reveal" data-delay="${i * 100}" data-id="${p.id}">
        <div class="week-col">
          <div class="week-dot"></div>
          <div class="week-badge ${isFeatured ? 'featured' : ''}">Wk ${p.week}</div>
        </div>
        <a href="${p.page}" class="project-card ${isFeatured ? 'featured' : ''}">
          <div class="card-icon ${isFeatured ? 'featured' : ''}">
            <span class="card-icon-emoji">${p.icon}</span>
          </div>
          <div class="card-body">
            <div class="card-category">${p.category}</div>
            <div class="card-name">${p.title}</div>
            <div class="card-desc">${p.description}</div>
            <div class="card-tags">
              ${p.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
            </div>
          </div>
          <div class="card-right">
            <div class="card-arrow">↗</div>
            <div class="card-votes">
              <div class="vote-live-dot"></div>
              <span class="vote-num" id="votes-${p.id}">—</span>
              <span>want this</span>
            </div>
          </div>
        </a>
      </div>
    `;
  }).join('');

  initScrollReveal();
}

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => observer.observe(el));
}

// Entry point
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();
});
```

- [ ] **Step 3: Open `index.html` in browser and verify**

Expected: All 6 project cards visible in the timeline, staggered slide-up animation as you scroll down, Week 6 card has blue-tinted background. Vote counts show `—` (not yet wired).

---

## Task 5: Supabase database setup

**Files:** No code files — this is Supabase dashboard work.

- [ ] **Step 1: Decide which Supabase project to use**

Option A — Use existing Jobber project (recommended, no new account needed).
Option B — Create a new Supabase project at supabase.com.

Either way: note down your **Project URL** and **anon public key** from Project Settings → API.

- [ ] **Step 2: Run this SQL in Supabase SQL Editor**

```sql
-- Create the projects table
create table if not exists public.projects (
  id           text primary key,
  name         text not null,
  vote_count   integer not null default 0
);

-- Seed one row per project
insert into public.projects (id, name) values
  ('finance-tracker',    'Finance Tracker'),
  ('color-fit',          'Color-Fit'),
  ('dream-future-quiz',  'Dream Future Quiz'),
  ('watch-hunter',       'Carousell Watch Hunter'),
  ('jobber',             'Jobber'),
  ('stocks-manager',     'Stocks Manager')
on conflict (id) do nothing;

-- RPC: increment vote (floor at 0 handled by constraint)
create or replace function increment_vote(project_id text)
returns void
language sql
security definer
as $$
  update public.projects
  set vote_count = vote_count + 1
  where id = project_id;
$$;

-- RPC: decrement vote (never goes below 0)
create or replace function decrement_vote(project_id text)
returns void
language sql
security definer
as $$
  update public.projects
  set vote_count = greatest(vote_count - 1, 0)
  where id = project_id;
$$;
```

- [ ] **Step 3: Enable Realtime on the projects table**

In Supabase dashboard: Table Editor → `projects` table → click the realtime toggle to ON.

- [ ] **Step 4: Verify in Table Editor**

Expected: `projects` table has 6 rows, all with `vote_count = 0`.

---

## Task 6: `votes.js` — fetch counts + realtime

**Files:**
- Modify: `bdmedia/js/votes.js`

- [ ] **Step 1: Write votes.js**

Replace the placeholder with:

```js
// js/votes.js
// -----------------------------------------------------------
// FILL THESE IN from Supabase Project Settings → API
// -----------------------------------------------------------
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY';
// -----------------------------------------------------------

const { createClient } = supabase;  // loaded from CDN script tag
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// Fetch all vote counts and update any [id="votes-<projectId>"] elements
async function loadVoteCounts() {
  const { data, error } = await db.from('projects').select('id, vote_count');
  if (error) { console.error('loadVoteCounts:', error); return; }
  data.forEach(row => updateVoteDisplay(row.id, row.vote_count));
}

// Update a vote count display element by project id
function updateVoteDisplay(projectId, count) {
  const el = document.getElementById(`votes-${projectId}`);
  if (el) el.textContent = count;
}

// Subscribe to realtime changes on the projects table
function subscribeToVotes() {
  db.channel('votes-channel')
    .on('postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'projects' },
      (payload) => {
        updateVoteDisplay(payload.new.id, payload.new.vote_count);
      }
    )
    .subscribe();
}

// Cast or undo a vote for a project. Returns new voted state.
async function castVote(projectId) {
  const key = `voted_${projectId}`;
  const alreadyVoted = localStorage.getItem(key) === '1';

  if (alreadyVoted) {
    await db.rpc('decrement_vote', { project_id: projectId });
    localStorage.removeItem(key);
    return false; // now un-voted
  } else {
    await db.rpc('increment_vote', { project_id: projectId });
    localStorage.setItem(key, '1');
    return true; // now voted
  }
}

function hasVoted(projectId) {
  return localStorage.getItem(`voted_${projectId}`) === '1';
}

// Called on DOMContentLoaded from main.js
function initVotes() {
  loadVoteCounts();
  subscribeToVotes();
}
```

- [ ] **Step 2: Add Supabase CDN to `index.html` (before other scripts)**

In `index.html`, add before the existing `<script>` tags:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

- [ ] **Step 3: Call initVotes() from main.js**

In `js/main.js`, update the DOMContentLoaded handler:

```js
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();
  // initVotes() runs on ALL pages (homepage + detail pages).
  // On detail pages, renderTimeline() finds no #timeline-list and returns early.
  // initVotes() fetches all vote counts and subscribes to Realtime on every page.
  initVotes();
});
```

- [ ] **Step 4: Fill in your Supabase credentials in `votes.js`**

Replace `'https://YOUR_PROJECT_ID.supabase.co'` and `'YOUR_ANON_PUBLIC_KEY'` with your actual values from Supabase → Project Settings → API.

- [ ] **Step 5: Verify in browser**

Open `index.html`. Open DevTools → Network tab. Expected: a request to `supabase.co/rest/v1/projects`. Vote counts should update from `—` to `0` (or whatever the DB has).

---

## Task 7: Detail page CSS

**Files:**
- Modify: `bdmedia/css/style.css` (append detail page styles)

- [ ] **Step 1: Append detail page styles to `css/style.css`**

```css
/* ============================================================
   DETAIL PAGE — HERO BAND
   ============================================================ */
.detail-hero {
  padding: 140px 48px 56px;
  background: linear-gradient(160deg, var(--bg) 0%, var(--accent-light) 100%);
  border-bottom: 1px solid #e0e8ff;
}
.detail-week-badge {
  font-size: 10px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--accent);
  background: var(--accent-light); border: 1px solid var(--accent-border);
  border-radius: var(--radius-pill); padding: 5px 14px;
  display: inline-block; margin-bottom: 24px;
}
.detail-header { display: flex; align-items: flex-start; gap: 24px; margin-bottom: 24px; }
.detail-icon {
  width: 72px; height: 72px; border-radius: 18px;
  background: var(--accent); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 34px; box-shadow: 0 8px 24px rgba(37,99,235,0.25);
}
.detail-category {
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--accent); margin-bottom: 6px;
}
.detail-title {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800; letter-spacing: -1.5px; line-height: 1.0; color: var(--text-primary);
}
.detail-tagline {
  font-size: 17px; color: var(--text-secondary);
  line-height: 1.65; max-width: 580px; margin-bottom: 28px;
}
.meta-row { display: flex; gap: 28px; align-items: flex-start; flex-wrap: wrap; }
.meta-item { display: flex; flex-direction: column; gap: 4px; }
.meta-label {
  font-size: 9px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--text-dim);
}
.meta-value { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.meta-value.live { color: var(--green); }
.meta-value.in-progress { color: var(--amber); }
.meta-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.meta-tag {
  font-size: 11px; font-weight: 600; padding: 4px 11px;
  border-radius: var(--radius-pill); background: var(--accent-light); color: var(--accent);
}

/* ============================================================
   DETAIL PAGE — VOTE BAR
   ============================================================ */
.vote-bar {
  display: flex; align-items: center; gap: 24px;
  padding: 22px 48px; background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}
.vote-btn {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--accent); color: white;
  border-radius: var(--radius-pill); padding: 13px 26px;
  font-size: 14px; font-weight: 700;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 4px 16px rgba(37,99,235,0.25);
  white-space: nowrap;
}
.vote-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.35); }
.vote-btn:active { transform: scale(0.97); }
.vote-btn.voted { background: var(--green); box-shadow: 0 4px 16px rgba(22,163,74,0.25); }
.vote-count-wrap { display: flex; flex-direction: column; gap: 2px; }
.vote-count { font-size: 30px; font-weight: 800; letter-spacing: -1px; color: var(--text-primary); line-height: 1; }
.vote-live { display: flex; align-items: center; gap: 5px; }
.vote-live-dot-green {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--green); animation: pulse 2s infinite; flex-shrink: 0;
}
.vote-live-label { font-size: 11px; color: var(--text-dim); }
.vote-context {
  font-size: 12px; color: #999; line-height: 1.65; max-width: 280px;
  border-left: 2px solid #e0e8ff; padding-left: 16px; margin-left: auto;
}
.vote-context strong { color: var(--text-primary); font-weight: 600; }

/* ============================================================
   DETAIL PAGE — MOCKUP FRAME
   ============================================================ */
.mockup-section { padding: 48px 48px 0; }
.mockup-frame {
  background: var(--bg-card); border-radius: var(--radius-lg);
  border: 1px solid #e0e8ff; overflow: hidden;
  box-shadow: 0 24px 64px var(--shadow-blue);
}
.mockup-titlebar {
  background: #f0f4ff; border-bottom: 1px solid #e0e8ff;
  padding: 12px 20px; display: flex; align-items: center; gap: 7px;
}
.mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
.mockup-label { font-size: 11px; color: var(--text-dim); margin-left: 8px; }
.mockup-body {
  min-height: 320px; background: #0e1117;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 8px;
}
.mockup-body p { font-size: 13px; color: #555; }
.mockup-body small { font-size: 11px; color: var(--accent); }

/* ============================================================
   DETAIL PAGE — CONTENT BLOCKS
   ============================================================ */
.content-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  padding: 40px 48px;
}
.content-block {
  background: var(--bg-card); border-radius: var(--radius-md);
  padding: 28px; border: 1px solid var(--border);
}
.content-block h3 {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--accent); margin-bottom: 14px;
}
.content-block p { font-size: 14px; color: var(--text-secondary); line-height: 1.75; }
.content-block ul { padding-left: 16px; }
.content-block li {
  font-size: 14px; color: var(--text-secondary); line-height: 1.75; margin-bottom: 4px;
}

/* ============================================================
   DETAIL PAGE — SKILLS & STACK
   ============================================================ */
.skills-section { padding: 0 48px 56px; }
.skills-divider {
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
}
.skills-divider span {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-dim); white-space: nowrap;
}
.skills-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.skills-card {
  background: var(--bg-card); border-radius: var(--radius-md);
  padding: 24px; border: 1px solid var(--border);
}
.skills-card h4 {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--text-dim); margin-bottom: 14px;
}
.skill-tag {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600; padding: 5px 11px;
  border-radius: 7px; margin: 3px;
}
.skill-tag.confident {
  background: var(--accent-light); color: var(--accent); border: 1px solid var(--accent-border);
}
.skill-tag.learning {
  background: #fef9ec; color: var(--amber); border: 1px solid #fde68a;
}
.skill-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.skill-dot.confident { background: var(--accent); }
.skill-dot.learning  { background: var(--amber); }
.skill-legend {
  font-size: 10px; color: var(--text-dim); margin-top: 12px;
  display: flex; gap: 14px; align-items: center;
}
.skill-legend span { display: flex; align-items: center; gap: 5px; }
.complexity-bar { margin-bottom: 14px; }
.complexity-bar:last-child { margin-bottom: 0; }
.complexity-label {
  font-size: 11px; color: var(--text-muted); margin-bottom: 6px;
  display: flex; justify-content: space-between;
}
.complexity-label strong { font-weight: 700; }
.bar-track { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
.bar-fill { height: 100%; background: var(--accent); border-radius: 3px; }
.bar-fill.amber { background: var(--amber); }

/* ============================================================
   DETAIL PAGE — PREV/NEXT
   ============================================================ */
.detail-nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: 36px 48px; border-top: 1px solid var(--border);
}
.detail-nav-btn { display: flex; flex-direction: column; gap: 4px; }
.detail-nav-btn:hover { opacity: 0.65; }
.detail-nav-direction {
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--text-dim);
}
.detail-nav-name { font-size: 16px; font-weight: 700; color: var(--text-primary); }
.detail-nav-btn.next { text-align: right; }
```

---

## Task 8: Watch Hunter detail page (reference template)

**Files:**
- Create: `bdmedia/watch-hunter.html`

- [ ] **Step 1: Create `watch-hunter.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Carousell Watch Hunter — Irfan Dhamiry</title>
  <link rel="stylesheet" href="css/style.css"/>
</head>
<body>

  <nav class="nav">
    <div class="nav-logo">irfan<span class="dot">.</span></div>
    <a class="nav-back" href="index.html">← All projects</a>
  </nav>

  <div class="detail-hero">
    <div class="detail-week-badge">Week 4 · Automation</div>
    <div class="detail-header">
      <div class="detail-icon">⌚</div>
      <div>
        <div class="detail-category">Automation · Bot</div>
        <div class="detail-title">Carousell<br>Watch Hunter</div>
      </div>
    </div>
    <p class="detail-tagline">
      Monitors Carousell SG every 15 minutes for undervalued Rolex, AP &amp; RM watches.
      Sends a Telegram alert with one-tap auto-message to the seller.
    </p>
    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">Built in</span>
        <span class="meta-value">1 week</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Stack</span>
        <div class="meta-tags">
          <span class="meta-tag">Python</span>
          <span class="meta-tag">Playwright</span>
          <span class="meta-tag">Telegram API</span>
          <span class="meta-tag">SQLite</span>
        </div>
      </div>
      <div class="meta-item">
        <span class="meta-label">Status</span>
        <span class="meta-value live">● Live</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Build Cost</span>
        <span class="meta-value">~$20</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Monthly Cost</span>
        <span class="meta-value">~$5</span>
      </div>
    </div>
  </div>

  <div class="vote-bar">
    <button class="vote-btn" id="vote-btn">
      <span id="vote-emoji">👍</span>
      <span id="vote-text">Want this developed further?</span>
    </button>
    <div class="vote-count-wrap">
      <div class="vote-count" id="votes-watch-hunter">—</div>
      <div class="vote-live">
        <div class="vote-live-dot-green"></div>
        <span class="vote-live-label">people want this</span>
      </div>
    </div>
    <div class="vote-context">
      <strong>Vote to show your interest.</strong>
      I use this to gauge which projects are worth developing further — no guarantees, just real signal.
    </div>
  </div>

  <div class="mockup-section">
    <div class="mockup-frame">
      <div class="mockup-titlebar">
        <div class="mockup-dot" style="background:#ff5f57"></div>
        <div class="mockup-dot" style="background:#febc2e"></div>
        <div class="mockup-dot" style="background:#28c840"></div>
        <span class="mockup-label">watch-hunter — mockup</span>
      </div>
      <div class="mockup-body">
        <p>📸 Drop your screenshot or mockup image here</p>
        <small>Replace this div with an &lt;img&gt; tag</small>
      </div>
    </div>
  </div>

  <div class="content-grid">
    <div class="content-block">
      <h3>The Problem</h3>
      <p>Finding undervalued luxury watches on Carousell is manual and slow. Great deals vanish in minutes. I needed 24/7 monitoring and to be first to message when a deal appears.</p>
    </div>
    <div class="content-block">
      <h3>How It Works</h3>
      <ul>
        <li>Scrapes Carousell SG every 15 minutes via Playwright</li>
        <li>Filters to individual sellers only — no dealers</li>
        <li>Compares listing price against computed market median</li>
        <li>Sends Telegram alert if ≥15% below market</li>
        <li>One-tap button fires pre-drafted opener to the seller</li>
      </ul>
    </div>
    <div class="content-block">
      <h3>What I Learned</h3>
      <p>Building a reliable scraper that handles dynamic rendering, rate limits, and session expiry — while keeping it lightweight enough to run 24/7 on a cheap VPS.</p>
    </div>
    <div class="content-block">
      <h3>Built With Claude</h3>
      <p>Full architecture designed and shipped in one week using Claude Code. The Playwright scraper, price valuation engine, and Telegram bot were all built through conversation.</p>
    </div>
  </div>

  <div class="skills-section">
    <div class="skills-divider"><span>Skills &amp; Stack</span></div>
    <div class="skills-grid">
      <div class="skills-card">
        <h4>Skills Demonstrated</h4>
        <span class="skill-tag confident"><span class="skill-dot confident"></span>Web Scraping</span>
        <span class="skill-tag confident"><span class="skill-dot confident"></span>Async Python</span>
        <span class="skill-tag confident"><span class="skill-dot confident"></span>Bot Architecture</span>
        <span class="skill-tag confident"><span class="skill-dot confident"></span>API Integration</span>
        <span class="skill-tag learning"><span class="skill-dot learning"></span>VPS Deployment</span>
        <span class="skill-tag learning"><span class="skill-dot learning"></span>Rate Limiting</span>
        <div class="skill-legend">
          <span><span class="skill-dot confident"></span>Confident</span>
          <span><span class="skill-dot learning"></span>Still learning</span>
        </div>
      </div>
      <div class="skills-card">
        <h4>Complexity Breakdown</h4>
        <div class="complexity-bar">
          <div class="complexity-label"><span>Backend / Systems</span><strong style="color:var(--accent)">Advanced</strong></div>
          <div class="bar-track"><div class="bar-fill" style="width:85%"></div></div>
        </div>
        <div class="complexity-bar">
          <div class="complexity-label"><span>Frontend / UI</span><strong style="color:var(--text-dim)">None</strong></div>
          <div class="bar-track"><div class="bar-fill" style="width:0%"></div></div>
        </div>
        <div class="complexity-bar">
          <div class="complexity-label"><span>AI Integration</span><strong style="color:var(--amber)">Intermediate</strong></div>
          <div class="bar-track"><div class="bar-fill amber" style="width:55%"></div></div>
        </div>
      </div>
    </div>
  </div>

  <div class="detail-nav" id="detail-nav">
    <!-- Rendered by main.js renderDetailNav() -->
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/projects.js"></script>
  <script src="js/votes.js"></script>
  <script src="js/main.js"></script>
  <script>
    const PROJECT_ID = 'watch-hunter';
    // Note: initVotes() is NOT called here — main.js already calls it on DOMContentLoaded
    // for all pages, fetching vote counts and subscribing to Realtime.
    document.addEventListener('DOMContentLoaded', () => {
      initDetailVoteButton(PROJECT_ID);
      renderDetailNav(PROJECT_ID);
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: Open `watch-hunter.html` in browser and verify**

Expected: Hero band with week badge, vote bar with `—` count (not yet wired), mockup placeholder, 4 content blocks, skills section, empty detail-nav div.

---

## Task 9: Wire votes into detail pages (`votes.js` + `main.js`)

**Files:**
- Modify: `bdmedia/js/votes.js`
- Modify: `bdmedia/js/main.js`

- [ ] **Step 1: Add `initDetailVoteButton()` to `votes.js`**

Append to the end of `votes.js`:

```js
// Wire up the vote button on a detail page
function initDetailVoteButton(projectId) {
  const btn   = document.getElementById('vote-btn');
  const emoji = document.getElementById('vote-emoji');
  const text  = document.getElementById('vote-text');
  if (!btn) return;

  const applyVotedState = (voted) => {
    if (voted) {
      btn.classList.add('voted');
      emoji.textContent = '✅';
      text.textContent  = 'Thanks for the vote!';
    } else {
      btn.classList.remove('voted');
      emoji.textContent = '👍';
      text.textContent  = 'Want this developed further?';
    }
  };

  // Restore state from localStorage on load
  applyVotedState(hasVoted(projectId));

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const nowVoted = await castVote(projectId);
    applyVotedState(nowVoted);
    btn.disabled = false;
  });
}
```

- [ ] **Step 2: Add `renderDetailNav()` to `main.js`**

Append to `main.js`:

```js
function renderDetailNav(projectId) {
  const container = document.getElementById('detail-nav');
  if (!container) return;

  const idx  = PROJECTS.findIndex(p => p.id === projectId);
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  container.innerHTML = `
    <a class="detail-nav-btn" href="${prev.page}">
      <span class="detail-nav-direction">← Week ${prev.week}</span>
      <span class="detail-nav-name">${prev.title}</span>
    </a>
    <a class="detail-nav-btn next" href="${next.page}">
      <span class="detail-nav-direction">Week ${next.week} →</span>
      <span class="detail-nav-name">${next.title}</span>
    </a>
  `;
}
```

- [ ] **Step 3: Verify vote button works end-to-end**

Open `watch-hunter.html`. Click "Want this developed further?". Expected:
- Button turns green, says "Thanks for the vote!"
- Vote count increments by 1
- Open a second browser tab to the same page — vote count should already show the new number (Realtime)
- Refresh the page — button stays green (localStorage remembers)
- Click again — vote removed, count drops back

---

## Task 10: Remaining 5 detail pages

**Files:**
- Create: `bdmedia/finance-tracker.html`
- Create: `bdmedia/color-fit.html`
- Create: `bdmedia/dream-future-quiz.html`
- Create: `bdmedia/jobber.html`
- Create: `bdmedia/stocks-manager.html`

For each page: copy `watch-hunter.html` and replace all project-specific content. The inline `<script>` at the bottom changes only the `PROJECT_ID` value.

- [ ] **Step 1: Create `finance-tracker.html`**

Copy `watch-hunter.html`. Change:
- `<title>` → `Finance Tracker — Irfan Dhamiry`
- Week badge → `Week 1 · Finance`
- Icon → `💰`
- Category → `Finance · AI`
- Title → `Finance<br>Tracker`
- Tagline → `Upload your bank statement and AI automatically recategorises your spending into a clean visual breakdown. My first Claude-powered project.`
- Meta stack tags → `Python`, `Claude AI`, `Data Viz`
- Status → `● Live`
- Build cost → `~$20`, Monthly → `$0`
- Content blocks → problem/how-it-works/learned/built-with-claude for Finance Tracker
- Skills → confident: `Data Processing`, `Claude AI Integration`, `Python Scripting` / learning: `Data Visualisation`
- Complexity bars → Backend 70%, Frontend 20%, AI 80%
- `id="votes-watch-hunter"` → `id="votes-finance-tracker"`
- `PROJECT_ID = 'finance-tracker'`

- [ ] **Step 2: Create `color-fit.html`**

Copy `watch-hunter.html`. Change:
- `<title>` → `Color-Fit — Irfan Dhamiry`
- Week badge → `Week 2 · Design`
- Icon → `🎨`
- Category → `Web App · Design`
- Title → `Color-Fit`
- Tagline → *(fill in from Color-Fit description)*
- Stack tags → *(fill in)*
- Status → `● Live`
- Build cost → `~$20`, Monthly → `$0`
- All content blocks → *(fill in from Color-Fit details)*
- Skills / complexity → *(fill in)*
- `id="votes-color-fit"`, `PROJECT_ID = 'color-fit'`

- [ ] **Step 3: Create `dream-future-quiz.html`**

Copy `watch-hunter.html`. Change:
- `<title>` → `Dream Future Quiz — Irfan Dhamiry`
- Week badge → `Week 3 · Quiz`
- Icon → `🔮`
- Category → `Web App · Quiz`
- Title → `Dream Future<br>Quiz`
- Tagline → `A personality quiz that maps your dreams and ambitions to a future career path. Built with Next.js and deployed on Vercel in one week.`
- Stack tags → `Next.js`, `Vercel`, `JavaScript`
- Status → `● Live`
- Build cost → `~$20`, Monthly → `$0`
- Skills → confident: `Next.js`, `React`, `Vercel Deployment` / learning: `UX Flow Design`
- Complexity → Backend 10%, Frontend 75%, AI 30%
- `id="votes-dream-future-quiz"`, `PROJECT_ID = 'dream-future-quiz'`

- [ ] **Step 4: Create `jobber.html`**

Copy `watch-hunter.html`. Change:
- `<title>` → `Jobber — Irfan Dhamiry`
- Week badge → `Week 5 · iOS`
- Icon → `💼`
- Category → `iOS App · AI`
- Title → `Jobber`
- Tagline → `Tinder-style job search for iOS. Swipe right to apply, left to skip. AI auto-tailors your resume per role and tracks every application in one place.`
- Stack tags → `React Native`, `Expo`, `Supabase`, `GPT-4`
- Status → `● In Progress` (use class `in-progress`)
- Build cost → `~$20`, Monthly → `$0`
- Skills → confident: `React Native`, `Supabase`, `Mobile UI` / learning: `iOS Deployment`, `AI Resume Parsing`
- Complexity → Backend 65%, Frontend 80%, AI 70%
- `id="votes-jobber"`, `PROJECT_ID = 'jobber'`

- [ ] **Step 5: Create `stocks-manager.html`**

Copy `watch-hunter.html`. Change:
- `<title>` → `Stocks Manager — Irfan Dhamiry`
- Week badge → `Week 6 · Dashboard`
- Icon → `📈`
- Category → `Trading · Dashboard`
- Title → `Stocks<br>Manager`
- Tagline → `A real-time trading dashboard with live market data, portfolio tracking, AI-powered alerts, and a full component system. The most ambitious build so far.`
- Stack tags → `Python`, `Claude AI`, `React`
- Status → `● Live`
- Build cost → `~$20`, Monthly → `$0`
- Skills → confident: `React`, `Python Backend`, `Real-Time Data`, `Claude AI` / learning: `WebSocket Streams`, `Financial APIs`
- Complexity → Backend 80%, Frontend 85%, AI 75%
- `id="votes-stocks-manager"`, `PROJECT_ID = 'stocks-manager'`

- [ ] **Step 6: Verify all 6 detail pages**

Open each page in browser. Check:
- Correct title, icon, week badge
- Vote count loads from Supabase
- Prev/next nav renders with correct adjacent project names
- Clicking vote button works

---

## Task 11: Responsive CSS

**Files:**
- Modify: `bdmedia/css/style.css` (append at end)

- [ ] **Step 1: Append responsive styles**

```css
/* ============================================================
   RESPONSIVE — TABLET (< 900px)
   ============================================================ */
@media (max-width: 900px) {
  .content-grid  { grid-template-columns: 1fr; }
  .skills-grid   { grid-template-columns: 1fr; }
  .about-strip   { flex-direction: column; gap: 32px; }
  .recruiter-grid { grid-template-columns: 1fr; }
}

/* ============================================================
   RESPONSIVE — MOBILE (< 768px)
   ============================================================ */
@media (max-width: 768px) {
  .nav          { padding: 16px 20px; }
  .nav-links    { display: none; }

  .hero         { padding: 100px 20px 60px; }
  .hero-title   { font-size: clamp(40px, 11vw, 64px); letter-spacing: -2px; }

  .timeline-section { padding: 48px 20px 80px; }
  .timeline::before { left: 0; display: none; }
  .week-col     { display: none; }
  .project-card { margin-left: 0; }

  .vote-bar {
    flex-wrap: wrap; padding: 18px 20px; gap: 16px;
  }
  .vote-context { margin-left: 0; max-width: 100%; border-left: none; padding-left: 0; border-top: 1px solid var(--border); padding-top: 12px; }

  .detail-hero  { padding: 100px 20px 40px; }
  .detail-title { font-size: clamp(32px, 9vw, 48px); }
  .meta-row     { gap: 16px; }

  .mockup-section { padding: 24px 20px 0; }
  .content-grid   { padding: 24px 20px; }
  .skills-section { padding: 0 20px 40px; }
  .detail-nav     { padding: 28px 20px; }

  .about-strip  { padding: 56px 20px; }
  .about-name   { font-size: 32px; }
  .footer       { padding: 20px; flex-direction: column; gap: 8px; }
}

/* ============================================================
   RESPONSIVE — SMALL MOBILE (< 480px)
   ============================================================ */
@media (max-width: 480px) {
  .hero-title { font-size: clamp(36px, 12vw, 52px); }
  .detail-header { flex-direction: column; }
  .vote-btn   { padding: 12px 18px; font-size: 13px; }
}
```

- [ ] **Step 2: Verify on mobile**

Open Chrome DevTools → toggle device toolbar → test at 375px width.
Expected: nav shows only logo, timeline shows cards without the left week column, vote bar stacks vertically.

---

## Task 12: Final verification checklist

- [ ] **Step 1: Test all 7 pages load without console errors**

Open each page in browser. DevTools → Console tab. Expected: zero red errors.

- [ ] **Step 2: Test the full journey**

1. Land on `index.html` — hero animates in
2. Scroll down — 6 timeline cards reveal one by one
3. All 6 vote counts show real numbers (not `—`)
4. Click Watch Hunter card → navigates to `watch-hunter.html`
5. Click vote button → turns green, count increments
6. Open `index.html` in same browser — Watch Hunter vote count updated
7. Open `index.html` in incognito tab — same updated count visible (Realtime working)
8. Click prev/next nav → correct adjacent pages load

- [ ] **Step 3: Add Color-Fit content**

When Irfan has the Color-Fit description:
1. Update the `color-fit` entry in `js/projects.js` (description, tags, skills, complexity)
2. Fill in `color-fit.html` content blocks

- [ ] **Step 4: Deploy to bdmedia.net**

Upload the entire `bdmedia/` folder contents to the web host root. No build step required — all files are ready to serve as-is.

---

## Adding a New Project (future reference)

When you build week 7+:

1. **Add to `js/projects.js`** — append one object to the `PROJECTS` array following the same shape
2. **Create `week-7-project-name.html`** — copy any existing detail page, update `PROJECT_ID` and all content
3. **Add Supabase row:**
   ```sql
   insert into public.projects (id, name) values ('project-id', 'Project Name');
   ```
4. Done — homepage timeline and all prev/next links update automatically
