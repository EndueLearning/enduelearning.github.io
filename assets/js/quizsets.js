// assets/js/quizsets.js
(function(){
  'use strict';
  const subjects = { math: '/assets/data/quizsets_math.json', science: '/assets/data/quizsets_science.json', english: '/assets/data/quizsets_english.json' };
  let currentBank = [], current = 0, answers = [];
  const qbox = document.getElementById('qbox');
  const quizArea = document.getElementById('quizArea');
  const scoreDiv = document.getElementById('score');
  const nextBtn = document.getElementById('nextBtn');

  function loadSubject(subj){
    const url = subjects[subj];
    return fetch(url).then(r => r.ok ? r.json() : []).then(data => {
      currentBank = Array.isArray(data) ? data.slice(0) : [];
    });
  }

  function startQuiz(subj){
    loadSubject(subj).then(()=> {
      // shuffle and pick 10
      currentBank.sort(()=>0.5 - Math.random());
      currentBank = currentBank.slice(0,10);
      current = 0; answers = new Array(currentBank.length);
      quizArea.style.display = 'block';
      scoreDiv.innerHTML = '';
      renderQ();
    }).catch(err => {
      alert('Failed to load questions.');
      console.error(err);
    });
  }

  function renderQ(){
    const q = currentBank[current];
    if(!q){ finishQuiz(); return; }
    qbox.innerHTML = `<div class="question"><strong>Q ${current+1}.</strong> ${escapeHtml(q.q)}</div>`;
    const opts = document.createElement('div'); opts.className='options';
    q.options.forEach(opt=>{
      const b = document.createElement('button'); b.className='opt-btn'; b.innerText = opt;
      b.addEventListener('click', ()=> handleAnswer(b, opt, q.a));
      opts.appendChild(b);
    });
    qbox.appendChild(opts);
  }

  function handleAnswer(button, selected, correct){
    // disable all
    Array.from(qbox.querySelectorAll('.opt-btn')).forEach(b => b.disabled = true);
    // mark answers
    if(selected === correct){
      button.style.borderColor = '#34c759'; button.style.background = '#e9ffef';
    } else {
      button.style.borderColor = '#ff3b30'; button.style.background = '#ffecec';
      // highlight correct
      Array.from(qbox.querySelectorAll('.opt-btn')).forEach(b => { if(b.innerText === correct){ b.style.borderColor = '#34c759'; b.style.background = '#e9ffef'; } });
    }
    answers[current] = selected;
    // auto-advance after 1.2s
    setTimeout(()=> {
      current++;
      if(current >= currentBank.length) finishQuiz(); else renderQ();
    }, 1200);
  }

  function finishQuiz(){
    let score=0;
    currentBank.forEach((q,i)=> { if(answers[i] === q.a) score++; });
    quizArea.style.display='none';
    scoreDiv.innerHTML = `<div class="result">You scored <strong>${score}</strong> / ${currentBank.length}. <a href="/games/quizsets.html">Try another set</a></div>`;
  }

  function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // wire up start button
  document.getElementById('startBtn').addEventListener('click', ()=>{
    const subj = document.getElementById('subjectSelect').value;
    startQuiz(subj);
  });
})();
