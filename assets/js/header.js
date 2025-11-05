// header.js - loads header and toggles mobile menu
document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header");
  if (!headerContainer) return;
  const fetchUrl = window.location.hostname.includes("github.io")
    ? `${window.location.origin}${window.location.pathname.split('/').filter(Boolean)[0] ? '/' + window.location.pathname.split('/').filter(Boolean)[0] : ''}/components/header.html`
    : 'components/header.html';
  fetch(fetchUrl).then(r=>r.text()).then(html=>{
    headerContainer.innerHTML = html;
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('navLinks');
    if(toggle && nav) toggle.addEventListener('click', ()=> nav.classList.toggle('active'));
  }).catch(e=>console.error('Header load error', e));
});
