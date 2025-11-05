// assets/js/progress.js
function getProgress(){
  const coins = Number(localStorage.getItem('endue_coins') || 0);
  const completed = Number(localStorage.getItem('endue_completed') || 0);
  return { coins, completed };
}

function showProgressOnPage(){
  const p = getProgress();
  const el = document.getElementById('progressSummary');
  if(!el) return;
  el.innerHTML = `<div class="card"><h3>Your Progress</h3><p>Knowledge coins: <strong>${p.coins}</strong></p><p>Completed items: <strong>${p.completed}</strong></p></div>`;
}

document.addEventListener('DOMContentLoaded', showProgressOnPage);
