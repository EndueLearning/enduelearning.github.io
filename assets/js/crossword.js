/* Improved crossword.js
   - precise placement using JSON row/col/dir
   - proper merging of overlapping cells
   - smart auto-advance by typed-word preference
   - arrow-key navigation and backspace behavior
   - conflict detection (if JSON letters disagree)
   - highlight complete words (correct/wrong)
*/

document.addEventListener("DOMContentLoaded", () => {
  const GRID_JSON = "/assets/data/crossword/math-gridB.json";
  const gridContainer = document.getElementById("cw-grid");
  const acrossListEl = document.getElementById("across-list") || document.getElementById("across-clues") || document.getElementById("acrossList");
  const downListEl = document.getElementById("down-list") || document.getElementById("down-clues") || document.getElementById("downList");
  const checkBtn = document.getElementById("check-btn");

  let puzzle = null;
  let ROWS = 0, COLS = 0;
  // internal model: 2D array of cells { letter, words: [num,...], starts: [num,...], el?, input? , conflict? }
  let model = [];

  // Load puzzle JSON
  async function loadPuzzle() {
    const res = await fetch(GRID_JSON, {cache: "no-store"});
    if (!res.ok) {
      console.error("Could not load puzzle JSON:", GRID_JSON);
      gridContainer.innerHTML = "<p>Unable to load crossword data.</p>";
      return;
    }
    puzzle = await res.json();
    ROWS = puzzle.rows || 12;
    COLS = puzzle.cols || 12;
    buildModel();
    renderGrid();
    renderClues();
    attachCheck();
  }

  // Initialize model with nulls
  function buildModel() {
    model = Array.from({length: ROWS}, ()=>Array.from({length: COLS}, ()=>null));
    // Place words precisely
    (puzzle.words || []).forEach(word => {
      const ans = (word.answer || "").toUpperCase();
      const r0 = word.row|0;
      const c0 = word.col|0;
      const dir = (word.dir || "across").toLowerCase();
      for (let i = 0; i < ans.length; i++) {
        const r = r0 + (dir === "down" ? i : 0);
        const c = c0 + (dir === "across" ? i : 0);
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) {
          console.warn(`Word "${word.answer}" goes out of bounds at ${r},${c}`);
          continue;
        }
        if (!model[r][c]) {
          model[r][c] = { letter: ans[i], words: [word.number], starts: [], conflict: false };
        } else {
          // Already has a letter from another word
          if (model[r][c].letter !== ans[i]) {
            // Conflict — mark but keep first letter to keep deterministic behaviour
            model[r][c].conflict = true;
            console.warn(`Conflict at cell ${r},${c}: existing="${model[r][c].letter}" vs new="${ans[i]}" (word ${word.number})`);
            // keep the existing letter, but still note the word
            model[r][c].words.push(word.number);
          } else {
            // matching overlap
            if (!model[r][c].words.includes(word.number)) model[r][c].words.push(word.number);
          }
        }
        // mark start cell
        if (i === 0) {
          if (!model[r][c]) model[r][c] = { letter: ans[i], words: [], starts: [word.number], conflict:false };
          else {
            model[r][c].starts = model[r][c].starts || [];
            if (!model[r][c].starts.includes(word.number)) model[r][c].starts.push(word.number);
          }
        }
      }
    });
  }

  // Render DOM grid from model
  function renderGrid() {
    // clear previous
    gridContainer.innerHTML = "";
    gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 40px)`;
    // build cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = model[r][c];
        const div = document.createElement("div");
        div.className = "cw-cell";
        if (!cell) {
          // black cell
          div.classList.add("black");
          gridContainer.appendChild(div);
          continue;
        }
        // add number if this cell is a start of any word (pick smallest starting number)
        if (cell.starts && cell.starts.length) {
          const num = Math.min(...cell.starts);
          const numEl = document.createElement("div");
          numEl.className = "cw-number";
          numEl.textContent = num;
          div.appendChild(numEl);
        }
        // input
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.autocapitalize = "characters";
        input.autocomplete = "off";
        input.spellcheck = false;
        input.dataset.row = r;
        input.dataset.col = c;
        input.dataset.answer = cell.letter; // expected letter
        // mark conflict visually if any
        if (cell.conflict) {
          div.classList.add("conflict");
          div.title = "Letter conflict in puzzle data";
        }
        // keep references
        cell.el = div;
        cell.input = input;

        // events
        input.addEventListener("focus", () => {
          // set preferred direction for this input if not present
          if (!input.dataset.pref) {
            input.dataset.pref = detectPreferredDirection(r, c);
          }
        });

        input.addEventListener("input", (e) => {
          const v = (input.value || "").toUpperCase().replace(/[^A-Z]/g,"");
          input.value = v;
          // immediate style feedback for single-letter correctness (optional)
          div.classList.remove("correct","wrong");
          // when full word(s) are typed, auto-check those words
          // find words that include this cell and check each
          const words = model[r][c].words || [];
          words.forEach(num => {
            const w = findWordByNumber(num);
            if (w) checkCompleteWord(w);
          });
          // move cursor to next cell according to preference
          moveCursorAfterInput(r, c);
        });

        // keyboard navigation
        input.addEventListener("keydown", (ev) => {
          const key = ev.key;
          if (key === "ArrowRight") { ev.preventDefault(); focusCell(r, c+1); return; }
          if (key === "ArrowLeft") { ev.preventDefault(); focusCell(r, c-1); return; }
          if (key === "ArrowUp") { ev.preventDefault(); focusCell(r-1, c); return; }
          if (key === "ArrowDown") { ev.preventDefault(); focusCell(r+1, c); return; }
          if (key === "Backspace") {
            // if current cell empty, move to previous cell in preferred direction
            if (!input.value) {
              ev.preventDefault();
              const pref = input.dataset.pref || detectPreferredDirection(r,c);
              moveCursorPrev(r, c, pref);
            } else {
              // clear current value (default behavior) and keep focus
            }
          }
        });

        div.appendChild(input);
        gridContainer.appendChild(div);
      }
    }
  }

  // Helper: find word by number in puzzle.words
  function findWordByNumber(num) {
    return (puzzle.words || []).find(w => w.number === num);
  }

  // Check a full word (when all its letters filled)
  function checkCompleteWord(word) {
    const ans = (word.answer || "").toUpperCase();
    const positions = [];
    let filled = "";
    for (let i = 0; i < ans.length; i++) {
      const r = word.row + (word.dir === "down" ? i : 0);
      const c = word.col + (word.dir === "across" ? i : 0);
      const cell = model[r][c];
      if (!cell || !cell.input) return; // shouldn't happen
      positions.push(cell);
      filled += (cell.input.value || "").toUpperCase();
    }
    // if not fully filled, skip marking
    if (filled.length !== ans.length || filled.includes("")) return;
    // compare
    if (filled === ans) {
      positions.forEach(cell => {
        cell.el.classList.remove("wrong");
        cell.el.classList.add("correct");
      });
      // optional: play sound/confetti (if you have correct sound)
      // try { new Audio('/assets/sounds/correct.mp3').play(); } catch(e){}
    } else {
      positions.forEach(cell => {
        cell.el.classList.remove("correct");
        cell.el.classList.add("wrong");
      });
      // optional wrong sound
      // try { new Audio('/assets/sounds/wrong.mp3').play(); } catch(e){}
      // remove wrong highlight after a short delay to avoid permanent red
      setTimeout(()=> positions.forEach(c => c.el.classList.remove("wrong")), 900);
    }
  }

  // Move cursor after typing in (smart)
  function moveCursorAfterInput(r, c) {
    const input = model[r][c].input;
    const pref = input.dataset.pref || detectPreferredDirection(r, c);
    // Try to move along preferred direction first
    if (pref === "across") {
      if (isCellWritable(r, c+1)) { focusCell(r, c+1); return; }
      // else try down
      if (isCellWritable(r+1, c)) { focusCell(r+1, c); return; }
    } else {
      if (isCellWritable(r+1, c)) { focusCell(r+1, c); return; }
      if (isCellWritable(r, c+1)) { focusCell(r, c+1); return; }
    }
    // fallback: find next writable cell scanning row-major
    for (let rr = r; rr < ROWS; rr++) {
      for (let cc = (rr === r ? c+1 : 0); cc < COLS; cc++) {
        if (isCellWritable(rr, cc)) { focusCell(rr, cc); return; }
      }
    }
  }

  function moveCursorPrev(r, c, pref) {
    if (pref === "across") {
      if (isCellWritable(r, c-1)) { focusCell(r, c-1); return; }
      if (isCellWritable(r-1, c)) { focusCell(r-1, c); return; }
    } else {
      if (isCellWritable(r-1, c)) { focusCell(r-1, c); return; }
      if (isCellWritable(r, c-1)) { focusCell(r, c-1); return; }
    }
    // fallback scan backward
    for (let rr = r; rr >= 0; rr--) {
      for (let cc = (rr === r ? c-1 : COLS-1); cc >= 0; cc--) {
        if (isCellWritable(rr, cc)) { focusCell(rr, cc); return; }
      }
    }
  }

  // Check if cell is writable (not null and has input)
  function isCellWritable(r, c) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS && model[r][c] && model[r][c].input;
  }

  // Focus a specific cell input
  function focusCell(r, c) {
    if (!isCellWritable(r,c)) return;
    model[r][c].input.focus();
  }

  // Decide preferred direction for a cell (across vs down)
  function detectPreferredDirection(r, c) {
    const inAcross = (puzzle.words || []).some(w => w.dir === "across" && w.row === r && w.col <= c && c < w.col + (w.answer||"").length);
    const inDown = (puzzle.words || []).some(w => w.dir === "down" && w.col === c && w.row <= r && r < w.row + (w.answer||"").length);
    // if both true, prefer the one that started at this cell (start cell)
    if (inAcross && inDown) {
      const startAcross = (puzzle.words || []).some(w => w.dir === "across" && w.row === r && w.col === c);
      if (startAcross) return "across";
      const startDown = (puzzle.words || []).some(w => w.dir === "down" && w.row === r && w.col === c);
      if (startDown) return "down";
      // fallback: prefer across
      return "across";
    }
    if (inAcross) return "across";
    if (inDown) return "down";
    // default
    return "across";
  }

  // Render clue lists with numbers (once)
  function renderClues() {
    if (!acrossListEl || !downListEl) return;
    acrossListEl.innerHTML = "";
    downListEl.innerHTML = "";
    (puzzle.words || []).forEach(w => {
      const li = document.createElement("li");
      li.textContent = `${w.number}. ${w.clue}`;
      if (w.dir === "across") acrossListEl.appendChild(li);
      else downListEl.appendChild(li);
    });
  }

  // Attach check button if present
  function attachCheck() {
    if (!checkBtn) return;
    checkBtn.addEventListener("click", () => {
      (puzzle.words || []).forEach(w => checkCompleteWord(w));
    });
  }

  // Load
  loadPuzzle();
});
