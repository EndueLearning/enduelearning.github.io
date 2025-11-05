// assets/js/main.js - site-wide helpers
document.addEventListener('DOMContentLoaded', () => {
  // close mobile nav when click outside
  document.addEventListener('click', (e) => {
    const nav = document.getElementById('navLinks');
    const toggle = document.getElementById('menuToggle');
    if(!nav || !toggle) return;
    if(nav.classList.contains('active') && !nav.contains(e.target) && e.target !== toggle){
      nav.classList.remove('active');
    }
  });

  // progressive enhancement: mark current nav link active
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === path) a.classList.add('active');
  });
});
