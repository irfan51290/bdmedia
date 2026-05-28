// js/main.js

function renderTimeline() {
  const container = document.getElementById('timeline-list');
  if (!container) return;

  container.innerHTML = PROJECTS.map((p, i) => {
    const isFeatured = i === PROJECTS.length - 1;
    return `
      <div class="timeline-item reveal" id="project-${p.id}" data-delay="${i * 100}" data-id="${p.id}">
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

function initMobileNav() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  // Inject hamburger button
  const burger = document.createElement('button');
  burger.className = 'nav-burger';
  burger.setAttribute('aria-label', 'Menu');
  burger.innerHTML = `<span></span><span></span><span></span>`;
  navLinks.parentElement.appendChild(burger);

  // Inject mobile drawer
  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.innerHTML = navLinks.innerHTML;
  document.body.appendChild(drawer);

  // Toggle
  burger.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function fillCard(card, p) {
  const complexity = Math.round((p.complexity.backend + p.complexity.frontend + p.complexity.ai) / 3);
  card.href = `#project-${p.id}`;
  card.innerHTML = `
    <div class="hero-card-icon">${p.icon}</div>
    <div class="hero-card-title">${p.title}</div>
    <div class="hero-card-sub">${p.tagline}</div>
    <div class="hero-card-bar"><div class="hero-card-bar-fill" style="width:${complexity}%"></div></div>
  `;
}

function initFloatingCards() {
  const cards = Array.from(document.querySelectorAll('.hero-card-float'));
  if (!cards.length) return;

  const slotProjects = [];
  for (let i = 0; i < cards.length; i++) {
    slotProjects.push(i % PROJECTS.length);
    fillCard(cards[i], PROJECTS[slotProjects[i]]);
  }

  let rotateIdx = 0;
  setInterval(() => {
    const slot = rotateIdx % cards.length;
    rotateIdx++;

    const usedIndices = new Set(slotProjects);
    let nextIdx = (slotProjects[slot] + 1) % PROJECTS.length;
    let attempts = 0;
    while (usedIndices.has(nextIdx) && attempts < PROJECTS.length) {
      nextIdx = (nextIdx + 1) % PROJECTS.length;
      attempts++;
    }

    const card = cards[slot];
    card.classList.add('fading');
    setTimeout(() => {
      slotProjects[slot] = nextIdx;
      fillCard(card, PROJECTS[nextIdx]);
      card.classList.remove('fading');
    }, 450);
  }, 4500);
}

// Entry point — runs on every page
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();  // no-op on detail pages (no #timeline-list)
  if (typeof initVotes === 'function') initVotes();  // defined in votes.js
  initMobileNav();
  initFloatingCards();

  // If page loaded with a hash targeting a project, make it visible immediately
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target && target.classList.contains('reveal')) {
      target.classList.add('visible');
    }
  }
});
