// assets/js/dailyfacts.js
(function(){
  'use strict';
  const FACTS_URL = '/assets/data/dailyfacts.json';
  let facts = [];

  const robot = document.getElementById('robot') || (function create() {
    const el = document.createElement('div');
    el.id = 'robot';
    el.className = 'robot-note';
    el.style.display = 'none';
    el.innerHTML = `<div style="font-weight:700">Robot helper 🤖</div><div class="small" id="robotText"></div><a id="robotVideo" class="small" href="https://www.youtube.com/" target="_blank">Watch lesson</a>`;
    document.body.appendChild(el);
    return el;
  })();

  const robotText = robot.querySelector('#robotText') || robot.querySelector('.small');
  const robotVideo = robot.querySelector('#robotVideo');

  function pickFact() {
    if(!Array.isArray(facts) || facts.length===0) return 'Keep exploring — new facts every day!';
    return facts[Math.floor(Math.random()*facts.length)];
  }

  function showRobot() {
    if(!robot) return;
    robotText.innerText = pickFact();
    robot.style.display = 'block';
    robot.animate([{transform:'translateX(40px)', opacity:0},{transform:'translateX(0)', opacity:1}], {duration:350, easing:'ease'});
    setTimeout(()=> {
      robot.animate([{opacity:1},{opacity:0}], {duration:450, easing:'ease'});
      setTimeout(()=> robot.style.display='none', 450);
    }, 7000);
  }

  // load facts
  fetch(FACTS_URL).then(r => r.ok ? r.json() : []).then(data => { facts = data; }).catch(e => { console.error(e); });

  // show robot periodically at random intervals (45s - 90s)
  function scheduleNext() {
    const delay = 45000 + Math.floor(Math.random()*45000);
    setTimeout(()=> { showRobot(); scheduleNext(); }, delay);
  }

  // start after DOM ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ()=>{ scheduleNext(); });
  else scheduleNext();

  // hotkey: press "f" to show robot immediately (helpful)
  document.addEventListener('keydown', (e) => { if(e.key === 'f' || e.key === 'F') showRobot(); });

})();
