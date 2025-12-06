/* crossword.js - fixed version
   - fixes incorrect initial score when no answers entered
   - smarter moveNext to support vertical typing
   - robust saved-state handling
*/

document.addEventListener("DOMContentLoaded", () => {
  // WORD LIST (answers are uppercase, underscores allowed for readability)
  const words = [
    {id:1, clue:"Any number multiplied by zero is", answer:"ZERO", row:0, col:8, dir:"down"},
    {id:2, clue:"The number left over after division", answer:"REMAINDER", row:2, col:0, dir:"across"},
    {id:3, clue:"The number by which we divide", answer:"DIVISOR", row:3, col:6, dir:"down"},
    {id:4, clue:"An eight digit number starts with this place", answer:"CRORE", row:4, col:9, dir:"down"},
    {id:5, clue:"The number you subtract", answer:"SUBTRAHEND", row:4, col:15, dir:"down"},
    {id:6, clue:"The number from which you subtract", answer:"MINUEND", row:5, col:12, dir:"across"},
    {id:7, clue:"The before number", answer:"PREDECESSOR", row:8, col:5, dir:"across"},
    {id:8, clue:"The answer in multiplication", answer:"PRODUCT", row:10, col:18, dir:"down"},
    {id:9, clue:"The next number", answer:"SUCCESSOR", row:11, col:11, dir:"across"},
    {id:10, clue:"The numbers to be added", answer:"ADDENDS", row:13, col:14, dir:"across"}
    ];

  const ROWS = 21, COLS = 21;
  const grid = Array.from({length:ROWS}, ()=>Array.from({length:COLS}, ()=>null));

   // Place words into grid model
  words.forEach(w=>{
    const ans = w.answer.replace(/\s+/g,'').toUpperCase();
    if (w.dir === 'across') {
      for (let i=0;i<ans.length;i++){
        const r = w.row, c = w.col + i;
        grid[r][c] = grid[r][c] || {char: ans[i], entries:[]};
        grid[r][c].entries.push(w.id);
      }
    } else {
      for (let i=0;i<ans.length;i++){
        const r = w.row + i, c = w.col;
        grid[r][c] = grid[r][c] || {char: ans[i], entries:[]};
        grid[r][c].entries.push(w.id);
      }
    }
  });

  // Build DOM grid
  const crosswordDiv = document.getElementById("crossword");
  crosswordDiv.innerHTML = ""; // ensure clean
  const gridEl = document.createElement("div");
  gridEl.className = "cw-grid";
  gridEl.style.gridTemplateColumns = `repeat(${COLS}, auto)`;

  // numbering
  const numberMap = {};
  let num = 1;
  words.forEach(w => numberMap[w.id] = num++);

  for (let r=0;r<ROWS;r++){
    for (let c=0;c<COLS;c++){
      const cellData = grid[r][c];
      const cell = document.createElement("div");
      cell.className = "cw-cell";

      if (!cellData){
        cell.classList.add("black");
        cell.setAttribute("aria-hidden","true");
        gridEl.appendChild(cell);
        continue;
      }

      // number if this is start of a word
      const starts = words.filter(w=>{
        if (w.dir === 'across') return (w.row===r && w.col===c);
        return (w.dir==='down' && w.row===r && w.col===c);
      });
      if (starts.length) {
        const numSpan = document.createElement("span");
        numSpan.className = "cw-number";
        numSpan.textContent = numberMap[starts[0].id];
        cell.appendChild(numSpan);
      }

      const input = document.createElement("input");
      input.setAttribute("maxlength", "1");
      input.setAttribute("data-row", r);
      input.setAttribute("data-col", c);
      input.setAttribute("aria-label", `Crossword cell r${r}c${c}`);
      input.autocapitalize = "characters";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.addEventListener("input", onInput);
      input.addEventListener("keydown", onKeyDown);
      input.addEventListener("focus", ()=> {
        // when user focuses a cell, store preferred direction based on context
        const preferred = detectPreferredDirection(r, c);
        input.dataset.pref = preferred; // 'across' or 'down'
      });
      cell.appendChild(input);
      gridEl.appendChild(cell);
    }
  }

  crosswordDiv.appendChild(gridEl);

  // build clue lists
  const acrossList = document.getElementById("acrossList");
  const downList = document.getElementById("downList");
  acrossList.innerHTML = ""; downList.innerHTML = "";
  words.forEach(w=>{
    const li = document.createElement("li");
    li.innerHTML = `<strong>${numberMap[w.id]}.</strong> ${w.clue}`;
    if (w.dir === 'across') acrossList.appendChild(li);
    else downList.appendChild(li);
  });

  // saved-state handling
  const STORAGE_KEY = "cw_math_v1";
  const rawSaved = localStorage.getItem(STORAGE_KEY);
  let saved = {};
  try { saved = JSON.parse(rawSaved || "{}"); } catch(e){ saved = {}; }

  if (saved && saved.cells && Object.keys(saved.cells).length > 0) {
    // populate inputs
    document.querySelectorAll(".cw-cell input").forEach(inp=>{
      const r = inp.dataset.row, c = inp.dataset.col;
      const key = `${r},${c}`;
      if (saved.cells[key]) inp.value = saved.cells[key];
    });
    document.getElementById("savedStatus").textContent = "Yes";
  } else {
    // ensure empty
    document.querySelectorAll(".cw-cell input").forEach(inp=> inp.value = "");
    document.getElementById("savedStatus").textContent = "No";
  }

  // Input handlers
  function onInput(e){
    const t = e.target;
    const before = t.value;
    const val = (before || "").toUpperCase().replace(/[^A-Z]/g,'');
    t.value = val;
    // move to next cell based on preferred direction or smart detection
    const r = +t.dataset.row, c = +t.dataset.col;
    const preferred = t.dataset.pref || detectPreferredDirection(r,c);
    moveNextSmart(r, c, preferred);
    saveState();
  }

  function onKeyDown(e){
    const t = e.target;
    const r = +t.dataset.row, c = +t.dataset.col;
    if (e.key === "ArrowRight") { e.preventDefault(); focusCell(r, c+1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); focusCell(r, c-1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); focusCell(r-1, c); }
    else if (e.key === "ArrowDown") { e.preventDefault(); focusCell(r+1, c); }
    else if (e.key === "Backspace") {
      // if current is empty, move to previous
      if (!t.value) {
        e.preventDefault();
        // move backward in preferred direction
        const preferred = t.dataset.pref || detectPreferredDirection(r,c);
        movePrevSmart(r, c, preferred);
      }
    }
  }

  // Focus helper
  function focusCell(r,c){
    const el = document.querySelector(`.cw-cell input[data-row="${r}"][data-col="${c}"]`);
    if (el) el.focus();
  }

  // Smart next: tries next cell in preferred direction, else finds next available
  function moveNextSmart(r,c, preferred) {
    // normalize
    preferred = preferred === 'down' ? 'down' : 'across';
    if (preferred === 'across') {
      // try right
      for (let cc = c+1; cc<COLS; cc++){
        if (grid[r][cc]) { focusCell(r,cc); return; }
      }
      // fallback: try down from current
      for (let rr = r+1; rr<ROWS; rr++){
        if (grid[rr][c]) { focusCell(rr,c); return; }
      }
    } else {
      // preferred down
      for (let rr = r+1; rr<ROWS; rr++){
        if (grid[rr][c]) { focusCell(rr,c); return; }
      }
      // fallback to right
      for (let cc = c+1; cc<COLS; cc++){
        if (grid[r][cc]) { focusCell(r,cc); return; }
      }
    }
    // if none found, do nothing
  }

  function movePrevSmart(r,c, preferred) {
    preferred = preferred === 'down' ? 'down' : 'across';
    if (preferred === 'across') {
      for (let cc = c-1; cc>=0; cc--){
        if (grid[r][cc]) { focusCell(r,cc); return; }
      }
      for (let rr = r-1; rr>=0; rr--){
        if (grid[rr][c]) { focusCell(rr,c); return; }
      }
    } else {
      for (let rr = r-1; rr>=0; rr--){
        if (grid[rr][c]) { focusCell(rr,c); return; }
      }
      for (let cc = c-1; cc>=0; cc--){
        if (grid[r][cc]) { focusCell(r,cc); return; }
      }
    }
  }

  // Detect preferred direction for a given cell:
  // - if there's a non-black cell to the right => across exists
  // - if there's a non-black cell below => down exists
  // Decision heuristic:
  //  - If only across exists -> across
  //  - If only down exists -> down
  //  - If both exist -> prefer across unless left is black and above exists (likely start of down)
  function detectPreferredDirection(r,c) {
    const hasRight = (c+1<COLS) && !!grid[r][c+1];
    const hasLeft = (c-1>=0) && !!grid[r][c-1];
    const hasDown = (r+1<ROWS) && !!grid[r+1][c];
    const hasUp = (r-1>=0) && !!grid[r-1][c];

    if (hasRight && !hasDown) return 'across';
    if (hasDown && !hasRight) return 'down';
    if (hasRight && hasDown) {
      // if this is likely starting cell of down word (no left but has up) prefer down
      if (!hasLeft && hasDown) return 'down';
      return 'across';
    }
    // default
    return hasRight ? 'across' : (hasDown ? 'down' : 'across');
  }

  // Buttons
  document.getElementById("checkBtn").addEventListener("click", ()=> checkAnswers(false));
  document.getElementById("revealBtn").addEventListener("click", ()=> revealAnswers());
  document.getElementById("clearBtn").addEventListener("click", ()=> {
    if (!confirm("Clear all answers?")) return;
    document.querySelectorAll(".cw-cell input").forEach(inp => inp.value="");
    document.querySelectorAll(".cw-cell").forEach(c=>c.classList.remove("correct","wrong"));
    localStorage.removeItem(STORAGE_KEY);
    document.getElementById("savedStatus").textContent = "No";
  });
  document.getElementById("printBtn").addEventListener("click", ()=> window.print());

  // Reveal solution: fill letters (and save)
  function revealAnswers(){
    words.forEach(w=>{
      const ans = w.answer.replace(/\s+/g,'').toUpperCase();
      for (let i=0;i<ans.length;i++){
        let r = w.row + (w.dir==='down'?i:0);
        let c = w.col + (w.dir==='across'?i:0);
        const inp = document.querySelector(`.cw-cell input[data-row="${r}"][data-col="${c}"]`);
        if (inp) inp.value = ans[i];
      }
    });
    saveState();
    // mark all as correct
    words.forEach(w=>{
      const ans = w.answer.replace(/\s+/g,'').toUpperCase();
      for (let i=0;i<ans.length;i++){
        const r = w.row + (w.dir==='down'?i:0);
        const c = w.col + (w.dir==='across'?i:0);
        const cell = document.querySelector(`.cw-cell input[data-row="${r}"][data-col="${c}"]`).parentElement;
        if (cell) cell.classList.add("correct");
      }
    });
  }

  // Check answers: only count a word as correct when ALL its letters match
  function checkAnswers(showAll){
    // clear classes
    document.querySelectorAll(".cw-cell").forEach(c=>c.classList.remove("correct","wrong"));

    let total = 0;
    let correct = 0;

    words.forEach(w=>{
      const ans = w.answer.replace(/\s+/g,'').toUpperCase();
      let wordCorrect = true;
      let anyLetterEntered = false;

      for (let i=0;i<ans.length;i++){
        const r = w.row + (w.dir==='down'?i:0);
        const c = w.col + (w.dir==='across'?i:0);
        const inp = document.querySelector(`.cw-cell input[data-row="${r}"][data-col="${c}"]`);
        const val = inp ? (inp.value || "").toUpperCase() : "";
        if (val) anyLetterEntered = true;
        if (val !== ans[i]) wordCorrect = false;
      }

      total++;
      if (wordCorrect) {
        correct++;
        // mark each cell green
        for (let i=0;i<ans.length;i++){
          const r = w.row + (w.dir==='down'?i:0);
          const c = w.col + (w.dir==='across'?i:0);
          const cell = document.querySelector(`.cw-cell input[data-row="${r}"][data-col="${c}"]`).parentElement;
          if (cell) cell.classList.add("correct");
        }
      } else {
        // mark wrong cells only if some letters entered for that word
        if (anyLetterEntered) {
          for (let i=0;i<ans.length;i++){
            const r = w.row + (w.dir==='down'?i:0);
            const c = w.col + (w.dir==='across'?i:0);
            const inp = document.querySelector(`.cw-cell input[data-row="${r}"][data-col="${c}"]`);
            const cell = inp ? inp.parentElement : null;
            if (!cell) continue;
            const val = (inp.value || "").toUpperCase();
            if (val && val !== ans[i]) cell.classList.add("wrong");
          }
        }
      }
    });

    // If no letters entered anywhere, report 0/total rather than misleading positive
    const anyFilled = Array.from(document.querySelectorAll(".cw-cell input")).some(inp => inp.value);
    if (!anyFilled) correct = 0; // enforce 0 when all empty

    alert(`You got ${correct} out of ${total} words correct.`);
  }

  // Save to localStorage
  function saveState(){
    const cells = {};
    document.querySelectorAll(".cw-cell input").forEach(inp=>{
      const r = inp.dataset.row, c = inp.dataset.col;
      const key = `${r},${c}`;
      if (inp.value) cells[key] = inp.value.toUpperCase();
    });
    if (Object.keys(cells).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({cells}));
      document.getElementById("savedStatus").textContent = "Yes";
    } else {
      localStorage.removeItem(STORAGE_KEY);
      document.getElementById("savedStatus").textContent = "No";
    }
  }

  // Back-to-top visibility (if footer loader uses id backTop)
  const backBtn = document.getElementById("backTop");
  window.addEventListener("scroll", () => {
    if (!backBtn) return;
    if (window.scrollY > 300) backBtn.classList.add("show");
    else backBtn.classList.remove("show");
  });

});
