// assets/js/playncharity.js
(function(){
  'use strict';
  const Q_URL = '/assets/data/playncharity_questions.json';
  const ADS = [
    'https://via.placeholder.com/200x100?text=Ad+1',
    'https://via.placeholder.com/200x100?text=Ad+2',
    'https://via.placeholder.com/200x100?text=Ad+3'
  ];

  // DOM
  const qTitle = document.getElementById('questionTitle');
  const opts = document.getElementById('options');
  const msg = document.getElementById('msg');
  const adImg = document.getElementById('adImg');
  const mascotEl = document.getElementById('mascot');
  const coinsEl = document.getElementById('coins');
  const donatedEl = document.getElementById('donated');
  const robot = document.getElementById('robot');
  const robotText = document.getElementById('robotText');
  const robotVideo = document.getElementById('robotVideo');
  const confettiContainer = document.getElementById('confettiContainer');

  // State
  let QUESTIONS = [];
  let idx = 0;
  let coins = parseInt(localStorage.getItem('endue_coins')||'0',10);
  let donated = parseInt(localStorage.getItem('endue_donated')||'0',10);
  coinsEl && (coinsEl.innerText = coins);
  donatedEl && (donatedEl.innerText = donated);

  function save() {
    localStorage.setItem('endue_coins', coins);
    localStorage.setItem('endue_donated', donated);
  }

  function rotateAd() {
    if(!adImg) return;
    const i = Math.floor(Math.random()*ADS.length);
    adImg.src = ADS[i];
  }

  function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderQuestion() {
    if(!QUESTIONS.length) { qTitle.innerHTML = '<strong>No questions loaded.</strong>'; return; }
    const q = QUESTIONS[idx % QUESTIONS.length];
    qTitle.innerHTML = `<strong>${escapeHtml(q.q)}</strong>`;
    opts.innerHTML = '';
    q.options.forEach(opt=>{
      const b = document.createElement('button');
      b.className = 'opt-btn';
      b.innerText = opt;
      b.addEventListener('click', ()=> checkAnswer(opt));
      opts.appendChild(b);
    });
  }

  function showMascotAndConfetti() {
    const masc = ['📘','✏️','🧠','🎈','🖍️'];
    if(mascotEl) mascotEl.innerText = masc[Math.floor(Math.random()*masc.length)];
    // lightweight confetti
    if(!confettiContainer) return;
    confettiContainer.innerHTML = '';
    for(let i=0;i<24;i++){
      const el = document.createElement('div');
      el.style.position='absolute';
      el.style.left = (Math.random()*100)+'%';
      el.style.top = (Math.random()*60)+'%';
      el.style.width='8px'; el.style.height='12px';
      el.style.background = ['#f9c74f','#90be6d','#f94144','#577590'][Math.floor(Math.random()*4)];
      el.style.opacity='0.95';
      el.style.borderRadius='2px';
      confettiContainer.appendChild(el);
      el.animate([{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(120vh) rotate(360deg)'}], {duration:1500+Math.random()*900, easing:'linear'});
    }
    setTimeout(()=> confettiContainer.innerHTML = '', 2100);
  }

  function maybeRobot() {
    if(!robot) return;
    // show robot helper briefly with a suggestion (video link or tip)
    const facts = [
      'Tip: Read the hint if you are stuck!',
      'Video lessons can clarify this topic — watch and try again.',
      'Don’t worry — small mistakes help you learn.'
    ];
    robotText.innerText = facts[Math.floor(Math.random()*facts.length)];
    robot.style.display = 'block';
    robot.animate([{transform:'translateX(40px)', opacity:0},{transform:'translateX(0)', opacity:1}], {duration:300, easing:'ease'});
    setTimeout(()=> {
      robot.animate([{opacity:1},{opacity:0}], {duration:400, easing:'ease'});
      setTimeout(()=> robot.style.display='none', 400);
    }, 6000);
  }

  function floatingEncouragement(){
    const el = document.createElement('div');
    el.textContent = 'Keep trying — you’re learning!';
    el.style.position = 'fixed';
    el.style.left = '50%'; el.style.transform = 'translateX(-50%)';
    el.style.bottom = '110px'; el.style.background='rgba(255,255,255,0.98)';
    el.style.padding='10px 12px'; el.style.borderRadius='10px'; el.style.boxShadow='0 8px 20px rgba(0,0,0,0.12)';
    el.style.zIndex = 5000;
    document.body.appendChild(el);
    el.animate([{opacity:1, transform:'translateY(0)'},{opacity:0, transform:'translateY(-40px)'}], {duration:2200});
    setTimeout(()=> el.remove(), 2200);
  }

  function checkAnswer(option) {
    const q = QUESTIONS[idx % QUESTIONS.length];
    if(option === q.a) {
      coins++; donated++;
      save(); coinsEl.innerText = coins; donatedEl.innerText = donated;
      msg.innerText = 'Correct! +1 coin & 1 virtual book donated.';
      showMascotAndConfetti();
      rotateAd();
      maybeRobot();
    } else {
      msg.innerText = 'Not quite — try the next one.';
      floatingEncouragement();
    }
    idx++;
    setTimeout(()=> { msg.innerText=''; renderQuestion(); }, 700);
  }

  document.getElementById('skipBtn').addEventListener('click', ()=>{ idx++; renderQuestion(); });
  document.getElementById('hintBtn').addEventListener('click', ()=> { msg.innerText='Hint: think of the basics.'; setTimeout(()=> msg.innerText='', 2000); });

  // load questions
  fetch(Q_URL)
    .then(r => r.ok ? r.json() : Promise.reject('No data'))
    .then(data => {
      QUESTIONS = Array.isArray(data) ? data : [];
      renderQuestion();
      rotateAd();
    })
    .catch(err => { console.error('PlaynCharity load error', err); qTitle.innerHTML='<strong>Failed to load questions.</strong>'; });

})();
