// assets/js/daily.js
// Local-date based daily picker. Prefers window.wordLibrary & window.thoughtLibrary defined in assets/data/library.js.
// Falls back to assets/data/words.json and assets/data/thoughts.json.
// Auto-refreshes at local midnight.

(function(){
  'use strict';

  function daysSinceEpochLocal(date = new Date()) {
    // Use local date (not UTC) so "daily" aligns with user's local midnight
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.floor(d.getTime() / (24*60*60*1000));
  }

  function indexForToday(length) {
    if (!length || length <= 0) return 0;
    const days = daysSinceEpochLocal();
    return days % length;
  }

  function escapeHtml(s){
    if(!s && s !== 0) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function render(wordObj, thoughtText) {
    const wordEl = document.getElementById('word-of-day') || document.getElementById('home-word');
    const thoughtEl = document.getElementById('thought-of-day') || document.getElementById('home-thought');

    if (wordEl && wordObj) {
      const pron = wordObj.pronunciation ? ` <small>(${escapeHtml(wordObj.pronunciation)})</small>` : '';
      const example = wordObj.example ? `<p class="small"><em>Example:</em> ${escapeHtml(wordObj.example)}</p>` : '';
      wordEl.innerHTML = `<h3>Word of the Day: <span>${escapeHtml(wordObj.word)}</span>${pron}</h3><p>${escapeHtml(wordObj.meaning||'')}</p>${example}`;
    }
    if (thoughtEl && thoughtText) {
      thoughtEl.innerHTML = `<h3>Thought of the Day</h3><p>"${escapeHtml(thoughtText)}"</p>`;
    }
  }

  async function fallbackLoadAndRender(){
    try {
      const [wRes, tRes] = await Promise.all([
        fetch('assets/data/words.json').then(r => r.ok? r.json(): []),
        fetch('assets/data/thoughts.json').then(r => r.ok? r.json(): [])
      ]);

      const wArr = Array.isArray(wRes)? wRes : [];
      const tArr = Array.isArray(tRes)? tRes : [];

      const wi = indexForToday(wArr.length || 1);
      const ti = indexForToday(tArr.length || 1);

      const wordObj = wArr[wi] || { word: 'Learn', meaning: 'Keep exploring.' };
      const thoughtText = tArr[ti] || 'Keep learning and keep smiling.';

      const todayKey = new Date().toISOString().slice(0,10);
      try { localStorage.setItem('endue_daily_shown_' + todayKey, JSON.stringify({ wi, ti })); } catch(e){}

      render(wordObj, thoughtText);
    } catch(e){
      console.error('daily fallback failed', e);
    }
  }

  async function initDaily(){
    // only run if placeholders exist
    if (!document.getElementById('word-of-day') && !document.getElementById('thought-of-day') && !document.getElementById('home-word') && !document.getElementById('home-thought')) return;

    // prefer library.js if present
    if (Array.isArray(window.wordLibrary) && Array.isArray(window.thoughtLibrary)) {
      const wArr = window.wordLibrary;
      const tArr = window.thoughtLibrary;
      const wi = indexForToday(wArr.length || 1);
      const ti = indexForToday(tArr.length || 1);
      const wordObj = wArr[wi] || { word: 'Learn', meaning: 'Keep exploring.' };
      const thoughtText = tArr[ti] || 'Keep learning and keep smiling.';

      const todayKey = new Date().toISOString().slice(0,10);
      try {
        const saved = JSON.parse(localStorage.getItem('endue_daily_shown_' + todayKey) || 'null');
        if (!saved || typeof saved.wi === 'undefined' || typeof saved.ti === 'undefined') {
          localStorage.setItem('endue_daily_shown_' + todayKey, JSON.stringify({ wi, ti }));
        }
      } catch(e){}

      render(wordObj, thoughtText);
      return;
    }

    // fallback to JSON files
    fallbackLoadAndRender();
  }

  // auto-refresh at local midnight (checks every minute)
  (function midnightWatcher(){
    let lastKey = new Date().toISOString().slice(0,10);
    setInterval(()=> {
      const nowKey = new Date().toISOString().slice(0,10);
      if (nowKey !== lastKey) {
        try { initDaily(); } catch(e) { window.location.reload(); }
        lastKey = nowKey;
      }
    }, 60*1000);
  })();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDaily); else initDaily();
})();
