// assets/js/daily.js
(function(){
  'use strict';
  function daysSinceEpochLocal(date = new Date()){
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.floor(d.getTime() / (24*60*60*1000));
  }
  function indexForToday(length){
    if (!length) return 0;
    return daysSinceEpochLocal() % length;
  }
  function render(wordObj, thoughtText, factText){
    const wordEl = document.getElementById('word-of-day');
    const thoughtEl = document.getElementById('thought-of-day');
    const factEl = document.getElementById('fun-fact');
    if(wordEl && wordObj){
      wordEl.innerHTML = `<h4>${wordObj.word}</h4><p class="small">${wordObj.meaning}</p>`;
    }
    if(thoughtEl && thoughtText){
      thoughtEl.innerHTML = `<p class="small">"${thoughtText}"</p>`;
    }
    if(factEl && factText){
      factEl.innerHTML = `<p class="small">${factText}</p>`;
    }
  }
  function init(){
    if(!window.dailyWords || !window.dailyThoughts || !window.dailyFacts) return;
    const w = window.dailyWords[indexForToday(window.dailyWords.length)];
    const t = window.dailyThoughts[indexForToday(window.dailyThoughts.length)];
    const f = window.dailyFacts[indexForToday(window.dailyFacts.length)];
    render(w,t,f);
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', init); } else { init(); }
  // refresh at local midnight
  let last = new Date().toISOString().slice(0,10);
  setInterval(()=>{ const now = new Date().toISOString().slice(0,10); if(now !== last){ last = now; init(); } }, 60*1000);
})();
