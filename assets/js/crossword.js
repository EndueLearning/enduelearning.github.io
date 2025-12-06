document.addEventListener("DOMContentLoaded", () => {
  const gridBox = document.getElementById("cw-grid");
  const acrossList = document.getElementById("across-list");
  const downList = document.getElementById("down-list");
  const checkBtn = document.getElementById("check-btn");

  let crossword = null;

  async function loadJSON() {
    const res = await fetch("/assets/data/crossword/math-gridB.json");
    crossword = await res.json();
    buildGrid();
    buildClues();
  }

  function buildGrid() {
    gridBox.innerHTML = "";
    const rows = crossword.rows;
    const cols = crossword.cols;

    // blank 2D array
    const grid = [...Array(rows)].map(() =>
      [...Array(cols)].fill(null)
    );

    // place words
    crossword.words.forEach(w => {
      let r = w.row, c = w.col;
      for (let i = 0; i < w.answer.length; i++) {
        grid[r][c] = { letter: w.answer[i], number: i === 0 ? w.number : "" };
        if (w.dir === "across") c++;
        else r++;
      }
    });

    // draw
    grid.forEach(row => {
      row.forEach(cell => {
        const div = document.createElement("div");

        if (!cell) {
          div.className = "cw-cell black";
        } else {
          div.className = "cw-cell";

          if (cell.number) {
            const num = document.createElement("div");
            num.className = "cw-number";
            num.textContent = cell.number;
            div.appendChild(num);
          }

          const inp = document.createElement("input");
          inp.maxLength = 1;
          inp.dataset.answer = cell.letter;
          div.appendChild(inp);
        }

        gridBox.appendChild(div);
      });
    });
  }

  function buildClues() {
    acrossList.innerHTML = "";
    downList.innerHTML = "";

    crossword.words.forEach(w => {
      const li = document.createElement("li");
      li.textContent = `${w.number}. ${w.clue}`;

      if (w.dir === "across") acrossList.appendChild(li);
      else downList.appendChild(li);
    });
  }

  checkBtn.addEventListener("click", () => {
    const inputs = document.querySelectorAll(".cw-cell input");

    inputs.forEach(inp => {
      const correct = inp.dataset.answer.toUpperCase();
      const val = inp.value.toUpperCase();

      inp.parentElement.classList.remove("correct", "wrong");

      if (!val) return;

      if (val === correct) inp.parentElement.classList.add("correct");
      else inp.parentElement.classList.add("wrong");
    });
  });

  loadJSON();
});
