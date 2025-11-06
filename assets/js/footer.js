// footer.js - append footer
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const repoSeg = window.location.hostname.includes("github.io") ? ('/' + (window.location.pathname.split('/').filter(Boolean)[0] || '')) : '';
    const url = `${window.location.origin}${repoSeg}/components/footer.html`.replace(/([^:]\/)\//g, '$1');
    const res = await fetch(url);
    if(!res.ok) throw new Error('Footer fetch failed ' + res.status);
    const html = await res.text();
    const existing = document.querySelector('footer.site-footer'); if(existing) existing.remove();
    const wrapper = document.createElement('div'); wrapper.innerHTML = html; const footerEl = wrapper.firstElementChild;
    if(footerEl) document.body.appendChild(footerEl);
  } catch(e){ console.error('Footer load error', e); }
});
