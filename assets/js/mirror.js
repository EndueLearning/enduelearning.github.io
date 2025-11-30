// assets/js/mirror.js - attach to mirror page (deferred)
(function(){
  const canvas = document.getElementById('mirrorCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function fit(){
    const container = document.querySelector('.sim-container') || document.body;
    const cssW = Math.min(980, Math.max(320, container.clientWidth - 40));
    const aspect = 0.5;
    const cssH = Math.round(cssW * aspect);
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr,dpr);
  }
  window.addEventListener('resize', fit);
  fit();
  // If any page script exposes update(), call it after fit
  setTimeout(()=> { if(typeof window.mirrorUpdate === 'function') window.mirrorUpdate(); }, 100);
})();
