// assets/js/header.js
// Robust header loader: tries multiple candidate paths until one works.
// Safe for GitHub Pages (user or project site), local file previews, and pages at root or subpaths.

(async function loadHeader() {
  const container = document.getElementById('header');
  if (!container) return;

  // candidate paths, from most-local to absolute
  const candidates = [
    'components/header.html',          // typical relative path (root)
    './components/header.html',        // explicit relative
    '/components/header.html',         // absolute path on the domain
    `${window.location.origin}/components/header.html` // explicit origin
  ];

  // also try possible repo-name path IF the first pathname segment looks like a repo folder (no .html)
  const segs = window.location.pathname.split('/').filter(Boolean);
  if (segs.length > 0 && !segs[0].includes('.')) {
    // example: /repoName/...
    candidates.push(`${window.location.origin}/${segs[0]}/components/header.html`);
    candidates.push(`${window.location.origin}/${segs[0]}/components/header.html`.replace(/([^:]\/)\//g, '$1'));
  }

  // try each candidate until one succeeds
  let html = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) { html = await res.text(); break; }
    } catch (e) {
      // ignore and try next
    }
  }

  if (!html) {
    console.error('Header load failed: none of the candidate paths returned success.', candidates);
    return;
  }

  // insert header HTML
  // remove any existing header.main-header to avoid duplicates
  const existing = document.querySelector('header.main-header');
  if (existing) existing.remove();

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const headerEl = wrapper.firstElementChild;
  if (!headerEl) {
    console.error('Header loaded but contains no top-level element.');
    return;
  }
  // prepend to body so header is always at top-level (not accidentally inside a hero)
  document.body.prepend(headerEl);

  // attach mobile toggle (if present)
  const toggle = document.getElementById('menuToggle') || headerEl.querySelector('#menuToggle');
  const nav = document.getElementById('navLinks') || headerEl.querySelector('#navLinks');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('active'));
  }

  // mark active nav item
  try {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#navLinks a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  } catch (e) { /* silent */ }
})();
