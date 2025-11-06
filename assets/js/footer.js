// assets/js/footer.js
// Robust footer loader: same multi-path strategy as header

(async function loadFooter() {
  const container = document.getElementById('footer');
  if (!container) return;

  const candidates = [
    'components/footer.html',
    './components/footer.html',
    '/components/footer.html',
    `${window.location.origin}/components/footer.html`
  ];

  const segs = window.location.pathname.split('/').filter(Boolean);
  if (segs.length > 0 && !segs[0].includes('.')) {
    candidates.push(`${window.location.origin}/${segs[0]}/components/footer.html`);
  }

  let html = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) { html = await res.text(); break; }
    } catch (e) {}
  }

  if (!html) {
    console.error('Footer load failed. Tried:', candidates);
    return;
  }

  // remove any existing footer.site-footer
  const existing = document.querySelector('footer.site-footer');
  if (existing) existing.remove();

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const footerEl = wrapper.firstElementChild;
  if (footerEl) {
    document.body.appendChild(footerEl);
  } else {
    console.warn('Footer loaded but empty.');
  }
})();
