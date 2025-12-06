document.addEventListener("DOMContentLoaded", () => {

  

  const state = {
    filter: 'all',
    query: '',
  };

  // DOM refs
  const postsEl = document.getElementById('posts');
  const religionGrid = document.getElementById('religionGrid');
  const searchEl = document.getElementById('search');
  const menu = document.getElementById('menu');
  const menuBtn = document.getElementById('menuBtn');
  const closeMenu = document.getElementById('closeMenu');
  const toggleTheme = document.getElementById('toggleTheme');
  const app = document.getElementById('app');

  // --- Helper Functions ---

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  function highlightActiveFilter(religion) {
    document.querySelectorAll('.religion').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.religion[data-religion="${religion}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  function renderPosts() {
    if (!postsEl) {
      console.error("❌ #posts element not found!");
      return;
    }

    postsEl.innerHTML = '';
    const q = state.query.trim().toLowerCase();

    const filtered = postsData.filter(p => {
      if (state.filter !== 'all' && p.religion !== state.filter) return false;
      if (!q) return true;
      return (p.title + p.excerpt + p.content).toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      postsEl.innerHTML = `<div style="padding:18px;color:var(--muted)">No posts found.</div>`;
      return;
    }

    for (const p of filtered) {
      const card = document.createElement('article');
      card.className = 'post';
      card.innerHTML = `
        <div class="thumb" aria-hidden="true">${p.thumb}</div>
        <div class="content">
          <h4>${escapeHtml(p.title)}</h4>
          <p>${escapeHtml(p.excerpt)}</p>
          <div class="meta">
            <small style="color:var(--muted)">${p.religion.toUpperCase()}</small>
            <div style="flex:1"></div>
            <a href="post.html?id=${p.id}" class="btn" aria-label="Read ${escapeHtml(p.title)}">Read</a>
          </div>
        </div>
      `;
      postsEl.appendChild(card);
    }
  }

  // --- Event Listeners ---

  searchEl.addEventListener('input', (e) => {
    state.query = e.target.value;
    renderPosts();
  });

  religionGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.religion');
    if (!btn) return;
    state.filter = btn.dataset.religion;
    renderPosts();
    highlightActiveFilter(state.filter);
  });

  menuBtn?.addEventListener('click', () => menu.setAttribute('aria-hidden', 'false'));
  closeMenu?.addEventListener('click', () => menu.setAttribute('aria-hidden', 'true'));

  toggleTheme?.addEventListener('click', () => {
  app.classList.toggle('dark');
  app.classList.toggle('light');
  try {
    localStorage.setItem('theme', app.classList.contains('dark') ? 'dark' : 'light');
  } catch (e) {
    console.warn("Storage not allowed here — theme will reset next visit");
  }
});

  // --- Initialize ---

  state.filter = 'all';
  state.query = '';
  renderPosts();
  highlightActiveFilter('all');

  console.log("✅ Spiritual Wisdom loaded with 'All' filter");

});
