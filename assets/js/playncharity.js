// assets/js/playncharity.js
(function(){
  'use strict';
  const Q_URL = '/assets/data/playncharity_questions.json';

  // DOM
  const qTitle = document.getElementById('questionTitle');
  const qCategory = document.getElementById('category');
  const opts = document.getElementById('options');
  const msg = document.getElementById('msg');
  const coinsEl = document.getElementById('coins');
  const donatedEl = document.getElementById('donated');
  const streakEl = document.getElementById('streak');
  const confettiContainer = document.getElementById('confettiContainer');
  const skipBtn = document.getElementById('skipBtn');
  const hintBtn = document.getElementById('hintBtn');

  // State
  let QUESTIONS = [];
  let idx = 0;
  let currentStreak = 0;
  let coins = parseInt(localStorage.getItem('endue_coins')||'0',10);
  let donated = parseInt(localStorage.getItem('endue_donated')||'0',10);
  let streak = parseInt(localStorage.getItem('endue_streak')||'0',10);
  
  updateDisplay();

  function updateDisplay() {
    coinsEl && (coinsEl.innerText = coins);
    donatedEl && (donatedEl.innerText = donated);
    streakEl && (streakEl.innerText = currentStreak);
  }

  function save() {
    localStorage.setItem('endue_coins', coins);
    localStorage.setItem('endue_donated', donated);
    localStorage.setItem('endue_streak', currentStreak);
  }

  function escapeHtml(s){ 
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); 
  }

  function renderQuestion() {
    if(!QUESTIONS.length) { 
      qTitle.innerHTML = '<strong>No questions loaded.</strong>'; 
      return; 
    }
    
    const q = QUESTIONS[idx % QUESTIONS.length];
    qCategory && (qCategory.innerText = q.category || 'General Knowledge');
    qTitle.innerHTML = `${escapeHtml(q.q)}`;
    
    msg.innerText = '';
    msg.className = '';
    
    opts.innerHTML = '';
    q.options.forEach(opt=>{
      const b = document.createElement('button');
      b.className = 'pnc-option';
      b.innerText = opt;
      b.addEventListener('click', ()=> checkAnswer(opt, b));
      opts.appendChild(b);
    });
  }

  function showConfetti() {
    if(!confettiContainer) return;
    confettiContainer.innerHTML = '';
    const colors = ['#f9c74f','#90be6d','#f94144','#577590','#2b9cff'];
    for(let i=0;i<30;i++){
      const el = document.createElement('div');
      el.style.position='absolute';
      el.style.left = (Math.random()*100)+'%';
      el.style.top = '-10px';
      el.style.width='8px';
      el.style.height='8px';
      el.style.background = colors[Math.floor(Math.random()*colors.length)];
      el.style.opacity='0.9';
      el.style.borderRadius='50%';
      confettiContainer.appendChild(el);
      
      const duration = 2000 + Math.random()*800;
      const distance = 200 + Math.random()*400;
      const angle = Math.random() * Math.PI;
      const endX = Math.cos(angle) * distance;
      
      el.animate([
        {transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1},
        {transform: `translateY(${distance}px) translateX(${endX}px) rotate(360deg)`, opacity: 0}
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });
    }
    setTimeout(()=> confettiContainer.innerHTML = '', 2800);
  }

  function checkAnswer(option, buttonEl) {
    const q = QUESTIONS[idx % QUESTIONS.length];
    
    // Disable all options temporarily
    document.querySelectorAll('.pnc-option').forEach(btn => btn.disabled = true);
    
    if(option === q.a) {
      coins++;
      donated++;
      currentStreak++;
      save();
      updateDisplay();
      
      buttonEl.classList.add('correct');
      msg.innerText = '✓ Correct! +1 coin & 1 book donated';
      msg.className = 'pnc-feedback correct';
      
      showConfetti();
      
      setTimeout(()=> { 
        msg.innerText = ''; 
        idx++; 
        renderQuestion();
      }, 800);
    } else {
      currentStreak = 0;
      updateDisplay();
      
      buttonEl.classList.add('incorrect');
      // Show correct answer
      document.querySelectorAll('.pnc-option').forEach(btn => {
        if(btn.innerText === q.a) btn.classList.add('correct');
      });
      
      msg.innerText = '✗ Not quite. Try the next one!';
      msg.className = 'pnc-feedback incorrect';
      
      setTimeout(()=> { 
        msg.innerText = ''; 
        idx++; 
        renderQuestion();
      }, 1200);
    }
  }

  skipBtn.addEventListener('click', ()=>{ 
    currentStreak = 0;
    updateDisplay();
    idx++; 
    renderQuestion(); 
  });

  hintBtn.addEventListener('click', ()=> { 
    msg.innerText = '💡 Hint: Think about the basics and fundamentals.';
    msg.className = '';
    setTimeout(()=> msg.innerText = '', 2500); 
  });

  // Load questions
  fetch(Q_URL)
    .then(r => r.ok ? r.json() : Promise.reject('No data'))
    .then(data => {
      QUESTIONS = Array.isArray(data) ? data : [];
      renderQuestion();
    })
    .catch(err => { 
      console.error('PlaynCharity load error', err); 
      qTitle.innerHTML='<strong>Failed to load questions.</strong>'; 
    });

})();
