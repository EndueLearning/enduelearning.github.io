// header.js - robust loader: prepends header to body
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const repoSeg = window.location.hostname.includes("github.io") ? ('/' + (window.location.pathname.split('/').filter(Boolean)[0] || '')) : '';
    const url = `${window.location.origin}${repoSeg}/components/header.html`.replace(/([^:]\/)\//g, '$1');
    const res = await fetch(url);
    if(!res.ok) throw new Error('Header fetch failed ' + res.status);
    const html = await res.text();
    const existing = document.querySelector('header.main-header');
    if(existing) existing.remove();
    const wrapper = document.createElement('div'); wrapper.innerHTML = html;
    const headerEl = wrapper.firstElementChild;
    if(headerEl) { document.body.prepend(headerEl);
      const toggle = document.getElementById('menuToggle'); const nav = document.getElementById('navLinks');
      if(toggle && nav) toggle.addEventListener('click', ()=> nav.classList.toggle('active'));
      const path = location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('#navLinks a').forEach(a=>{ if(a.getAttribute('href')===path) a.classList.add('active'); });
    }
  } catch(e){ console.error('Header load error', e); }
});
