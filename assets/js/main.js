// main.js
document.addEventListener('DOMContentLoaded', ()=>{
  document.addEventListener('click', (e)=>{
    const nav = document.getElementById('navLinks'); const toggle = document.getElementById('menuToggle');
    if(!nav || !toggle) return;
    if(nav.classList.contains('active') && !nav.contains(e.target) && e.target !== toggle) nav.classList.remove('active');
  });
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navLinks a').forEach(a=>{ if(a.getAttribute('href')===path) a.classList.add('active'); });
});
