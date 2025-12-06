/* ============================================================
   CROSSWORD ENGINE – Endue Learning
   Features:
   ✔ Auto-check words
   ✔ Correct/Wrong sound effects
   ✔ Smooth navigation
   ✔ Highlighting
   ✔ Works with crossword.json structure
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------
     Load sound effects
  ----------------------------- */
  const correctSound = new Audio("/assets/sounds/correct.mp3");
  const wrongSound = new Audio("/assets/sounds/wrong.mp3");

  /* -----------------------------
     Elements
  ----------------------------- */
  const gridContainer = document.getElementById("cw-grid");
  const acrossList = document.getElementById("acrossList");
  const downList = document.getElementById("downList");

  let crosswordData = null;
  let cellMatrix = [];  // 2D array storing cell objects

  /* -----------------------------
     LOAD JSON FILE
  ----------------------------- */
  async function loadCrossword() {
    try {
      const url = "/assets/data/crossword/math-crossword.json";
      const res = await fetch(url);
      if (!res.ok) throw new Error("JSON not found");

      crosswordData = await res.json();
      buildGrid();
      buildClues();

    } catch (err) {
      console.error("Crossword error:", err);
      gridContainer.innerHTML = "<p>Unable to load crossword.</p>";
    }
  }

  /* -----------------------------
     BUILD CROSSWORD GRID
  ----------------------------- */
  function buildGrid() {
    const rows = crosswordData.rows;
    const cols = crosswordData.cols;
    const layout = crosswordData.layout;

    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

    cellMatrix = [];

    for (let r = 0; r < rows; r++) {
      cellMatrix[r] = [];
      for (let c = 0; c < cols; c++) {

        const cellData = layout[r][c];
        const cellDiv = document.createElement("div");

        // Black cell
        if (cellData === "#") {
          cellDiv.className = "cw-cell black";
          gridContainer.appendChild(cellDiv);
          cellMatrix[r][c] = null;
          continue;
        }

        // Normal white cell
        cellDiv.className = "cw-cell";

        // Numbering
        if (typeof cellData === "object" && cellData.num) {
          const num = document.createElement("div");
          num.className = "cw-number";
          num.textContent = cellData.num;
          cellDiv.appendChild(num);
        }

        // Input
        const input = document.createElement("input");
        input.maxLength = 1;
        input.dataset.row = r;
        input.dataset.col = c;
        cellDiv.appendChild(input);

        // Input typing handler
        input.addEventListener("input", (e) => {
          input.value = input.value.toUpperCase().slice(0, 1);
          checkWordsForCell(r, c);
          moveNext(r, c);
        });

        gridContainer.appendChild(cellDiv);
        cellMatrix[r][c] = { el: cellDiv, input };
      }
    }
  }

  /* -----------------------------
     BUILD CLUES LIST
  ----------------------------- */
  function buildClues() {
    acrossList.innerHTML = "";
    downList.innerHTML = "";

    crosswordData.across.forEach(clue => addClue(acrossList, clue));
    crosswordData.down.forEach(clue => addClue(downList, clue));
  }

  function addClue(parent, clue) {
    const li = document.createElement("li");
    li.textContent = clue.clue;
    parent.appendChild(li);
  }

  /* -----------------------------
     GET CELLS OF A WORD
  ----------------------------- */
  function getCellsForClue(clue) {
    const cells = [];
    let { row, col } = clue;

    for (let i = 0; i < clue.answer.length; i++) {
      const cell = cellMatrix[row][col];
      if (!cell) return [];

      cells.push(cell);
      if (clue.dir === "across") col++;
      else row++;
    }
    return cells;
  }

  /* -----------------------------
     AUTO-CHECK words that touch a cell
  ----------------------------- */
  function checkWordsForCell(row, col) {
    const allClues = [...crosswordData.across, ...crosswordData.down];

    allClues.forEach(clue => {
      const cells = getCellsForClue(clue);
      clue.cells = cells;

      if (cells.some(c => !c)) return;

      autoCheckWord(clue);
    });
  }

  /* -----------------------------
     AUTO-CHECK WORD LOGIC
  ----------------------------- */
  function autoCheckWord(clue) {
    const letters = clue.cells.map(c => c.input.value.toUpperCase());
    const attempt = letters.join("");
    const answer = clue.answer.toUpperCase();

    // Skip incomplete words
    if (attempt.length < answer.length || attempt.includes("")) return;

    if (attempt === answer) {
      clue.cells.forEach(c => {
        c.el.classList.remove("wrong");
        c.el.classList.add("correct");
      });
      correctSound.play();
    } else {
      clue.cells.forEach(c => {
        c.el.classList.remove("correct");
        c.el.classList.add("wrong");
      });
      wrongSound.play();

      // remove wrong highlight after flash
      setTimeout(() => {
        clue.cells.forEach(c => c.el.classList.remove("wrong"));
      }, 700);
    }
  }

  /* -----------------------------
     Move to next cell automatically
  ----------------------------- */
  function moveNext(r, c) {
    // Try right cell
    if (cellMatrix[r][c + 1] && cellMatrix[r][c + 1].input) {
      cellMatrix[r][c + 1].input.focus();
      return;
    }

    // Try down cell
    if (cellMatrix[r + 1] && cellMatrix[r + 1][c] && cellMatrix[r + 1][c].input) {
      cellMatrix[r + 1][c].input.focus();
    }
  }

  /* -----------------------------
     START
  ----------------------------- */
  loadCrossword();
});
