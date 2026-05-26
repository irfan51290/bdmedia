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

// Entry point — runs on every page
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();  // no-op on detail pages (no #timeline-list)
  if (typeof initVotes === 'function') initVotes();  // defined in votes.js
});
