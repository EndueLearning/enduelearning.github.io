/**
 * assets/js/daily.js
 * Uses wordLibrary and thoughtLibrary from assets/data/library.js (preferred).
 * Falls back to assets/data/words.json and assets/data/thoughts.json if needed.
 *
 * Behavior:
 * - Deterministic, changes once per calendar day (based on user's system date).
 * - Uses "days since epoch" mod length to pick an index so it rotates predictably.
 * - Persists the last-used index for today's date in localStorage to avoid flicker.
 */

(function () {
  'use strict';

  // Helper: days since Unix epoch (UTC) — consistent day boundaries regardless of timezone shifts.
  function daysSinceEpochUTC(date = new Date()) {
    // calculate using UTC so everyone on a device sees change at their local midnight
    const msPerDay = 24 * 60 * 60 * 1000;
    const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return Math.floor(utc / msPerDay);
  }

  // Helper: deterministic index for given array length and date
  function indexForToday(length) {
    if (!length || length <= 0) return 0;
    const days = daysSinceEpochUTC();
    return days % length;
  }

  // Insert the selected word and thought into DOM
  function render(wordObj, thoughtText) {
    const wordEl = document.getElementById('word-of-day') || document.getElementById('home-word');
    const thoughtEl = document.getElementById('thought-of-day') || document.getElementById('home-thought');

    if (wordEl && wordObj) {
      // wordObj can be {word, meaning, pronunciation, example} optionally
      const pron = wordObj.pronunciation ? ` <small>(${wordObj.pronunciation})</small>` : '';
      const example = wordObj.example ? `<p class="small"><em>Example: </em>${wordObj.example}</p>` : '';
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

  // Small HTML escape helper to avoid accidental injection if your JSON ever contains odd characters
  function escapeHtml(s) {
    if (!s && s !== 0) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Fallback loader for JSON files if library arrays are not present
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

      // store shown index for today (optional)
      const todayKey = new Date().toISOString().slice(0,10); // YYYY-MM-DD
      try { localStorage.setItem('endue_daily_shown_' + todayKey, JSON.stringify({ wi, ti })); } catch(e) {}

      render(wordObj, thoughtText);
    } catch (err) {
      console.error('daily fallback load error', err);
    }
  }

  // Main init
  async function init() {
    // Ensure DOM elements exist; if not, abort early
    if (!document.getElementById('word-of-day') && !document.getElementById('thought-of-day')
        && !document.getElementById('home-word') && !document.getElementById('home-thought')) {
      return;
    }

    // If library arrays are already present (from library.js), use them
    if (typeof window.wordLibrary !== 'undefined' && typeof window.thoughtLibrary !== 'undefined') {
      const wArr = Array.isArray(window.wordLibrary) ? window.wordLibrary : [];
      const tArr = Array.isArray(window.thoughtLibrary) ? window.thoughtLibrary : [];

      const wi = indexForToday(wArr.length || 1);
      const ti = indexForToday(tArr.length || 1);

      const wordObj = wArr[wi] || { word: 'Learn', meaning: 'Keep exploring new things.' };
      const thoughtText = tArr[ti] || 'Keep learning and keep smiling.';

      // Persist today's choice in localStorage (keyed by date) so reloads on same day show same pick
      const todayKey = new Date().toISOString().slice(0,10); // YYYY-MM-DD
      try {
        const saved = JSON.parse(localStorage.getItem('endue_daily_shown_' + todayKey) || 'null');
        if (!saved || typeof saved.wi === 'undefined' || typeof saved.ti === 'undefined') {
          localStorage.setItem('endue_daily_shown_' + todayKey, JSON.stringify({ wi, ti }));
        }
      } catch (e) {
        /* ignore storage errors */
      }

      render(wordObj, thoughtText);
      return;
    }

    // Otherwise, try fallback JSON files
    fetchFallbackAndRender();
  }

  // Run on DOMContentLoaded to ensure placeholders exist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
