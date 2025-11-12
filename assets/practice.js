// assets/js/practice.js - load a JSON set, render 10 questions, grade, and store results
function escapeHtml(s){ if(!s && s!==0) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function loadSet(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error('Failed to load set');
  return await res.json();
}

function renderSet(data){
  const title = document.getElementById('set-title');
  const container = document.getElementById('questions-container');
  const actions = document.getElementById('practice-actions');
  const results = document.getElementById('results');
  results.style.display = 'none';
  actions.style.display = 'block';
  title.textContent = data.title || 'Practice Set';
  container.innerHTML = '';

  data.questions.forEach((q,i)=>{
    const wrapper = document.createElement('div');
    wrapper.className = 'card';
    wrapper.innerHTML = `<p><strong>Q${i+1}.</strong> ${escapeHtml(q.q)}</p>`;
    const opts = document.createElement('div');
    q.options.forEach(opt=>{
      const id = `q${i}-${Math.random().toString(36).slice(2,8)}`;
      const label = document.createElement('label');
      label.style.display='block';
      label.innerHTML = `<input type="radio" name="q${i}" value="${escapeHtml(opt)}"> ${escapeHtml(opt)}`;
      opts.appendChild(label);
    });
    wrapper.appendChild(opts);
    container.appendChild(wrapper);
  });

  document.getElementById('submit-answers').onclick = ()=> gradeSet(data);
}

function gradeSet(data){
  let correct = 0;
  data.questions.forEach((q,i)=>{
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    const val = sel ? sel.value : null;
    if(val && val === q.answer) correct++;
  });

  const results = document.getElementById('results');
  results.style.display = 'block';
  results.innerHTML = `<h3>Your score: ${correct} / ${data.questions.length}</h3>
    <p>${feedbackMessage(correct,data.questions.length)}</p>`;

  // store attempt
  try {
    const now = new Date().toISOString();
    const store = JSON.parse(localStorage.getItem('endue_practice')||'[]');
    store.push({ set: data.title, score: correct, total: data.questions.length, date: now });
    localStorage.setItem('endue_practice', JSON.stringify(store));
  } catch(e){}
}

function feedbackMessage(score, total){
  const pct = (score/total)*100;
  if(pct === 100) return 'Perfect! Fantastic work 🎉';
  if(pct >= 80) return 'Great job! Keep practicing for mastery.';
  if(pct >= 50) return 'Nice attempt — review weak topics and retry.';
  return 'Keep practicing — you will improve!';
}

document.addEventListener('DOMContentLoaded', ()=>{
  const loadBtn = document.getElementById('loadSetBtn');
  loadBtn.addEventListener('click', async ()=>{
    const select = document.getElementById('setSelect');
    const url = select.value;
    try {
      const data = await loadSet(url);
      renderSet(data);
      window.scrollTo({ top: document.getElementById('practice-app').offsetTop - 20, behavior: 'smooth' });
    } catch(e){
      alert('Failed to load set. Check console.');
      console.error(e);
    }
  });
});
