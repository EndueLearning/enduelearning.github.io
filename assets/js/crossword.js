/* ======================================================
   FINAL CROSSWORD ENGINE — For GRID_B 12×12 Template
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const gridEl = document.getElementById("cw-grid");
  const acrossEl = document.getElementById("across-clues");
  const downEl = document.getElementById("down-clues");

  /* Load puzzle JSON */
  async function loadPuzzle() {
    const res = await fetch("/assets/data/crossword/math-gridB.json");
    const data = await res.json();

    const template = GRID_B_TEMPLATE();
    buildGrid(template, data);
  }

  /* GRID_B (12x12) fixed layout pattern */
  function GRID_B_TEMPLATE() {

    const size = 12;
    const grid = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({ black: false, num: "" }))
    );

    /* Pre-designed black cell pattern — balanced & symmetric */
    const blacks = [
      [0,0],[0,1],[0,10],[0,11],
      [1,0],[1,1],[1,10],[1,11],
      [10,0],[10,1],[10,10],[10,11],
      [11,0],[11,1],[11,10],[11,11]
    ];

    blacks.forEach(([r,c]) => grid[r][c].black = true);

    return grid;
  }

  /* Build the grid and fill with clues */
  function buildGrid(template, puzzle) {

    /* Layout grid */
    gridEl.style.gridTemplateColumns = `repeat(12, 40px)`;

    /* Expand actual DOM grid */
    const cellMap = [];
    template.forEach((row, r) => {
      const rowMap = [];
      row.forEach((cell, c) => {
        const div = document.createElement("div");
        div.className = cell.black ? "cw-cell black" : "cw-cell";

        if (!cell.black) {
          const inp = document.createElement("input");
          inp.maxLength = 1;
          div.appendChild(inp);
          rowMap.push({ el: div, input: inp, row:r, col:c });
        } else {
          rowMap.push({ el: div, input: null, row:r, col:c });
        }
        gridEl.appendChild(div);
      });
      cellMap.push(rowMap);
    });

    /* Number placement + clue mapping */
    let num = 1;

    function placeWord(answer, dir) {
      for (let r = 0; r < 12; r++) {
        for (let c = 0; c < 12; c++) {

          if (dir === "across") {
            if (c + answer.length <= 12 &&
                canPlaceAcross(r,c,answer,cellMap)) {
              assignAcross(r,c,answer,cellMap,num);
              const n = num++;
              return { row:r, col:c, num:n };
            }
          }

          else if (dir === "down") {
            if (r + answer.length <= 12 &&
                canPlaceDown(r,c,answer,cellMap)) {
              assignDown(r,c,answer,cellMap,num);
              const n = num++;
              return { row:r, col:c, num:n };
            }
          }

        }
      }
      return null;
    }

    /* Placement rules */
    function canPlaceAcross(r,c,word,map) {
      for (let i=0;i<word.length;i++){
        if (map[r][c+i].el.classList.contains("black")) return false;
      }
      return true;
    }

    function canPlaceDown(r,c,word,map) {
      for (let i=0;i<word.length;i++){
        if (map[r+i][c].el.classList.contains("black")) return false;
      }
      return true;
    }

    function assignAcross(r,c,word,map,n){
      map[r][c].el.innerHTML =
        `<div class='cw-number'>${n}</div>` + map[r][c].el.innerHTML;

      for (let i=0;i<word.length;i++){
        map[r][c+i].answer = word[i];
      }
    }

    function assignDown(r,c,word,map,n){
      map[r][c].el.innerHTML =
        `<div class='cw-number'>${n}</div>` + map[r][c].el.innerHTML;

      for (let i=0;i<word.length;i++){
        map[r+i][c].answer = word[i];
      }
    }

    /* Place Across words */
    puzzle.across.forEach(cl => {
      const pos = placeWord(cl.answer, "across");
      if (pos) {
        const li = document.createElement("li");
        li.textContent = `${pos.num}. ${cl.clue}`;
        acrossEl.appendChild(li);
      }
    });

    /* Place Down words */
    puzzle.down.forEach(cl => {
      const pos = placeWord(cl.answer, "down");
      if (pos) {
        const li = document.createElement("li");
        li.textContent = `${pos.num}. ${cl.clue}`;
        downEl.appendChild(li);
      }
    });

    enableAutoCheck(cellMap);
  }

  /* Auto-check logic */
  function enableAutoCheck(map) {

    const correctSound = new Audio("/assets/sounds/correct.mp3");
    const wrongSound = new Audio("/assets/sounds/wrong.mp3");

    map.forEach(row => {
      row.forEach(cell => {
        if (!cell.input) return;

        cell.input.addEventListener("input", () => {
          const letter = cell.input.value.toUpperCase().slice(0,1);
          cell.input.value = letter;

          if (!letter) return;

          if (letter === cell.answer) {
            cell.el.classList.add("correct");
            cell.el.classList.remove("wrong");
            correctSound.play();
            confetti({ particleCount:8, spread:30, origin:{y:0.5} });
          } else {
            cell.el.classList.add("wrong");
            cell.el.classList.remove("correct");
            wrongSound.play();
          }
        });
      });
    });
  }

  loadPuzzle();

});
