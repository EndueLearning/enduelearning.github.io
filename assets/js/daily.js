/**
 * assets/js/daily.js
 * Uses wordLibrary & thoughtLibrary from assets/data/library.js (preferred).
 * Falls back to assets/data/words.json and assets/data/thoughts.json if needed.
 * Deterministic: changes once per calendar day (based on UTC day), and auto-refreshes at midnight.
 */

(function () {
  'use strict';

  function daysSinceEpochUTC(date = new Date()) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return Math.floor(utc / msPerDay);
  }

  function indexForToday(length) {
    if (!length || length <= 0) return 0;
    const days = daysSinceEpochUTC();
    return days % length;
  }

  function escapeHtml(s) {
    if (!s && s !== 0) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function render(wordObj, thoughtText) {
    const wordEl = document.getElementById('word-of-day') || document.getElementById('home-word');
    const thoughtEl = document.getElementById('thought-of-day') || document.getElementById('home-thought');

    if (wordEl && wordObj) {
      const pron = wordObj.pronunciation ? ` <small>(${escapeHtml(wordObj.pronunciation)})</small>` : '';
      const example = wordObj.example ? `<p class="small"><em>Example: </em>${escapeHtml(wordObj.example)}</p>` : '';
      wordEl.innerHTML = `
        <h3>Word of the Day: <span>${escapeHtml(wordObj.word)}</span>${pron}</h3>
        <p>${escapeHtml(wordObj.meaning || '')}</p>
        ${example}
      `;
    }

    if (thoughtEl && thoughtText) {
      thoughtEl.innerHTML = `
        <h3>Thought of the Day</h3>
        <p>"${escapeHtml(thoughtText)}"</p>
      `;
    }
  }

  async function fetchFallbackAndRender() {
    try {
      const [wRes, tRes] = await Promise.all([
        fetch('assets/data/words.json').then(r => r.ok ? r.json() : []),
        fetch('assets/data/thoughts.json').then(r => r.ok ? r.json() : [])
      ]);

      const wArr = Array.isArray(wRes) ? wRes : [];
      const tArr = Array.isArray(tRes) ? tRes : [];

      const wi = indexForToday(wArr.length || 1);
      const ti = indexForToday(tArr.length || 1);

      const wordObj = wArr[wi] || { word: 'Learn', meaning: 'Keep exploring new things.' };
      const thoughtText = tArr[ti] || 'Keep learning and keep smiling.';

      const todayKey = new Date().toISOString().slice(0,10);
      try { localStorage.setItem('endue_daily_shown_' + todayKey, JSON.stringify({ wi, ti })); } catch(e) {}

      render(wordObj, thoughtText);
    } catch (err) {
      console.error('daily fallback load error', err);
    }
  }

  async function initDaily() {
    // Only run if placeholders exist
    if (!document.getElementById('word-of-day') && !document.getElementById('thought-of-day') && !document.getElementById('home-word') && !document.getElementById('home-thought')) {
      return;
    }

    // If library.js provided arrays, use them (preferred)
    if (typeof window.wordLibrary !== 'undefined' && typeof window.thoughtLibrary !== 'undefined') {
      const wArr = Array.isArray(window.wordLibrary) ? window.wordLibrary : [];
      const tArr = Array.isArray(window.thoughtLibrary) ? window.thoughtLibrary : [];

      const wi = indexForToday(wArr.length || 1);
      const ti = indexForToday(tArr.length || 1);

      const wordObj = wArr[wi] || { word: 'Learn', meaning: 'Keep exploring new things.' };
      const thoughtText = tArr[ti] || 'Keep learning and keep smiling.';

      // Persist today's choice in localStorage to avoid flicker on refresh
      const todayKey = new Date().toISOString().slice(0,10);
      try {
        const saved = JSON.parse(localStorage.getItem('endue_daily_shown_' + todayKey) || 'null');
        if (!saved || typeof saved.wi === 'undefined' || typeof saved.ti === 'undefined') {
          localStorage.setItem('endue_daily_shown_' + todayKey, JSON.stringify({ wi, ti }));
        }
      } catch (e) {}

      render(wordObj, thoughtText);
      return;
    }

    // fallback to JSON files
    fetchFallbackAndRender();
  }

  // auto-refresh at date-change (midnight detection)
  (function midnightWatcher() {
    let shownKey = new Date().toISOString().slice(0,10);
    setInterval(() => {
      const nowKey = new Date().toISOString().slice(0,10);
      if (nowKey !== shownKey) {
        // Re-run the daily init (safe)
        try { initDaily(); } catch (e) { console.warn('daily reload fallback -> full reload', e); window.location.reload(); }
        shownKey = nowKey;
      }
    }, 60 * 1000);
  })();

  // run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDaily);
  } else {
    initDaily();
  }
})();
