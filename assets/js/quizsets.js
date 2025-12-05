/* ==================================================
   QUIZ ENGINE - Robust final version
   - tolerant to JSON key differences
   - tolerant to id naming mismatches (finds fallbacks)
   - supports answer as index or as answer-string
   - shows explanation, next button, score + remarks
   ================================================== */

(function () {
  'use strict';

  // ---------- Helpers ----------
  function $(id) { return document.getElementById(id); }
  function createEl(tag, attrs = {}, txt = '') {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v));
    if (txt) e.textContent = txt;
    return e;
  }

  // Find elements with fallback creation if missing
  const startBtn = $('startQuizBtn') || (function(){
    const b = createEl('button',{id:'startQuizBtn', disabled:true}, 'Start Quiz');
    // insert near top of body if not present
    const main = document.querySelector('main') || document.body;
    main.insertBefore(b, main.firstChild);
    return b;
  })();

  const quizBox = $('quizBox') || (function(){
    const d = createEl('div',{id:'quizBox', style:'display:none;'});
    const main = document.querySelector('main') || document.body;
    main.appendChild(d);
    return d;
  })();

  const questionText = $('questionText') || (function(){
    const h = createEl('h2',{id:'questionText'}, '');
    quizBox.appendChild(h);
    return h;
  })();

  const optionsBox = $('optionsBox') || (function(){
    const d = createEl('div',{id:'optionsBox'});
    quizBox.appendChild(d);
    return d;
  })();

  const nextBtn = $('nextBtn') || (function(){
    const b = createEl('button',{id:'nextBtn', class:'quiz-btn', style:'display:none;'}, 'Next');
    quizBox.appendChild(b);
    return b;
  })();

  const resultBox = $('resultBox') || (function(){
    const d = createEl('div',{id:'resultBox', style:'display:none;'});
    quizBox.parentNode && quizBox.parentNode.appendChild(d);
    return d;
  })();

  // small UI helpers
  function showError(msg) {
    console.error('Quiz Error:', msg);
    if (questionText) questionText.innerText = msg;
  }

  // ---------- Quiz state ----------
  let quizData = [];
  let idx = 0;
  let correctCount = 0;
  let loaded = false;

  // ---------- Load JSON robustly ----------
  async function loadQuizJSON() {
    // Build json path from URL: /games/quizsets/<subject>/<topic>/page.html
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    // We expect pathParts like ["games","quizsets","science","physics","light_concave-mirror.html"]
    const fileName = pathParts[pathParts.length-1] || 'quiz.html';
    const jsonName = fileName.replace(/\.html?$/i, '.json');

    // subject folder likely at -3 and topic -2 (we follow the pattern used on site)
    const subject = pathParts.length >= 3 ? pathParts[pathParts.length-3] : 'science';
    const topic = pathParts.length >= 2 ? pathParts[pathParts.length-2] : 'physics';

    // build absolute JSON path the site uses
    const jsonPath = `/assets/data/quiz/${subject}/${topic}/${jsonName}`;

    console.debug('Quiz loader will try JSON path:', jsonPath);

    try {
      const r = await fetch(jsonPath, {cache: 'no-store'});
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Quiz JSON empty or not an array');
      }
      // normalize items: ensure { question, options[], answerIndex, explanation }
      quizData = data.map(item => {
        // allow keys: question or q
        const question = item.question ?? item.q ?? item.qn ?? item.Q ?? '';
        // options array may be named options or opts
        const options = item.options ?? item.opts ?? item.O ?? [];
        // answer may be number (index) or string
        let answer = item.answer ?? item.a ?? item.ans ?? item.A;
        // explanation optional
        const explanation = item.explanation ?? item.explain ?? item.exp ?? item.ex ?? '';

        // if answer is a string, find index by matching text
        if (typeof answer === 'string') {
          const found = options.findIndex(o => String(o).trim().toLowerCase() === answer.trim().toLowerCase());
          answer = found >= 0 ? found : 0;
        } else if (typeof answer === 'number') {
          // keep as-is
        } else {
          // fallback: if item has correct option by text in item.correct?
          answer = 0;
        }

        return { question, options, answer: Number(answer), explanation };
      });

      loaded = true;
      startBtn.disabled = false;
      startBtn.textContent = 'Start Quiz';
      console.debug('Quiz loaded, items:', quizData.length);
    } catch (err) {
      showError('Failed to load quiz. JSON not found or invalid.');
      startBtn.disabled = true;
      startBtn.textContent = 'Error loading quiz';
      console.error(err);
    }
  }

  // ---------- Render question ----------
  function renderQuestion() {
    if (!loaded || idx < 0 || idx >= quizData.length) {
      showError('No question available');
      return;
    }

    const item = quizData[idx];
    questionText.innerText = `Q${idx+1}. ${item.question || '(No text)'} `;
    optionsBox.innerHTML = ''; // clear

    item.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.type = 'button';
      btn.textContent = opt;
      btn.style.whiteSpace = 'normal';
      btn.style.display = 'block';
      btn.style.width = '100%';
      btn.style.textAlign = 'left';
      btn.addEventListener('click', () => handleAnswer(i));
      optionsBox.appendChild(btn);
    });

    nextBtn.style.display = 'none';
    resultBox.style.display = 'none';
  }

  // ---------- Answer handling ----------
  function handleAnswer(selectedIndex) {
    if (!loaded) return;
    const item = quizData[idx];
    const correctIndex = Number(item.answer);

    const buttons = Array.from(optionsBox.querySelectorAll('.option-btn'));
    buttons.forEach((b, i) => {
      b.disabled = true;
      b.classList.remove('correct','wrong');
      if (i === correctIndex) b.classList.add('correct');
      if (i === selectedIndex && i !== correctIndex) b.classList.add('wrong');
    });

    // increment correct count if match
    if (selectedIndex === correctIndex) correctCount++;

    // show explanation
    const exp = document.createElement('div');
    exp.className = 'explanation-box';
    exp.innerHTML = `<strong>Explanation:</strong> ${item.explanation || '—'}`;
    // ensure only one explanation present
    const existing = quizBox.querySelector('.explanation-box');
    if (existing) existing.remove();
    quizBox.appendChild(exp);

    // show Next button
    nextBtn.style.display = 'inline-block';
  }

  // ---------- Next / Finish ----------
  function handleNext() {
    // remove explanation if any
    const existing = quizBox.querySelector('.explanation-box');
    if (existing) existing.remove();

    idx++;
    if (idx >= quizData.length) {
      showResults();
      return;
    }
    renderQuestion();
  }

  function showResults() {
    quizBox.style.display = 'none';
    resultBox.style.display = 'block';
    const total = quizData.length;
    const score = correctCount;
    const percent = Math.round((score/total)*100);

    let remark = '';
    if (percent === 100) remark = '🌟 Excellent — Perfect Score!';
    else if (percent >= 80) remark = '💚 Great Job — Keep it up!';
    else if (percent >= 50) remark = '🟡 Good — A little more practice!';
    else remark = '🔴 Needs Practice — Keep Learning!';

    resultBox.innerHTML = `
      <h2>Your Score</h2>
      <p class="score-number">${score} / ${total}</p>
      <p class="remark">${remark}</p>
      <div style="margin-top:12px;">
        <button id="retryNow" class="quiz-btn">🔁 Retry</button>
        <button id="backNow" class="quiz-btn secondary">⬅ Back</button>
      </div>
    `;

    // attach handlers
    const retry = $('retryNow');
    if (retry) retry.addEventListener('click', () => location.reload());

    const back = $('backNow');
    if (back) back.addEventListener('click', () => {
      // go back to subject list or parent
      // try to go up two levels -> /games/quizsets/<subject>/
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length >= 3) {
        const subject = parts[parts.length-3];
        window.location.href = `/games/quizsets/${subject}/`;
      } else {
        window.location.href = '/games/quizsets/';
      }
    });
  }

  // ---------- wire events ----------
  startBtn.addEventListener('click', function(){
    if (!loaded) return;
    startBtn.style.display = 'none';
    // show quiz UI
    quizBox.style.display = 'block';
    idx = 0; correctCount = 0;
    renderQuestion();
  });

  nextBtn.addEventListener('click', handleNext);

  // ---------- init ----------
  // small CSS classes used: .correct .wrong .explanation-box .option-btn etc.
  // ensure we attempt to load
  loadQuizJSON();

})();
