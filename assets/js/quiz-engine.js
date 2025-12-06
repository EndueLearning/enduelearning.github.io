/* FINAL QUIZ ENGINE - single file */
document.addEventListener("DOMContentLoaded", () => {
  const qBox = document.getElementById("quiz-box");
  const progressEl = document.getElementById("progress");
  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const explanationEl = document.getElementById("explanation");
  const nextBtn = document.getElementById("next-btn");
  const progressBar = document.getElementById("quiz-progress-bar");

  let quiz = [];
  let idx = 0;
  let score = 0;

  function jsonPathFromUrl() {
    // e.g. /games/quizsets/science/physics/light_concave-mirror.html
    const parts = window.location.pathname.split("/").filter(Boolean);
    const htmlFile = parts.pop(); // light_concave-mirror.html
    const jsonFile = htmlFile.replace(/\.html?$/i, ".json");
    const topic = parts.pop() || "physics";
    const subject = parts.pop() || "science";
    return `/assets/data/quiz/${subject}/${topic}/${jsonFile}`;
  }

  async function loadQuiz() {
    const path = jsonPathFromUrl();
    try {
      const res = await fetch(path, {cache: "no-store"});
      if (!res.ok) throw new Error("Quiz JSON not found: " + path);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("Quiz JSON invalid or empty");
      quiz = data;
      renderQuestion();
    } catch (err) {
      console.error(err);
      progressEl.textContent = "Unable to load quiz.";
    }
  }

  function renderQuestion() {
    const item = quiz[idx];
    if (!item) return;
    progressEl.textContent = `Question ${idx+1} of ${quiz.length}`;
    updateProgressBar(idx, quiz.length);

    // question text
    const qtext = item.question ?? item.q ?? item.qn ?? "No question text";
    questionEl.textContent = qtext;

    // options array
    const opts = item.options ?? item.opts ?? [];
    optionsEl.innerHTML = "";
    explanationEl.style.display = "none";
    explanationEl.textContent = "";

    opts.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "option-btn";
      b.type = "button";
      b.textContent = opt;
      // ensure long text wraps; styling in CSS will handle
      b.addEventListener("click", () => handleAnswer(b, i, item));
      optionsEl.appendChild(b);
    });

    nextBtn.style.display = "none";
  }

  function handleAnswer(button, selectedIndex, item) {
    // disable further selections
    const buttons = optionsEl.querySelectorAll(".option-btn");
    buttons.forEach((btn) => { btn.disabled = true; btn.classList.remove("correct","wrong"); });

    // resolve correct index (allow answer as index or as text)
    let correctIndex = 0;
    if (typeof item.answer === "number") correctIndex = item.answer;
    else if (typeof item.answer === "string") {
      correctIndex = (item.options ?? []).findIndex(o => (""+o).trim().toLowerCase() === item.answer.trim().toLowerCase());
      if (correctIndex < 0) correctIndex = 0;
    } else {
      // fallback to 0
      correctIndex = 0;
    }

    // apply classes
    const allBtns = Array.from(buttons);
    allBtns.forEach((b, i) => {
      if (i === correctIndex) b.classList.add("correct");
      if (i === selectedIndex && selectedIndex !== correctIndex) b.classList.add("wrong");
    });

    if (selectedIndex === correctIndex) {
      score++;
      if (typeof confetti === "function") confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 }});
    }

    // show explanation
    const explanationText = item.explanation ?? item.explain ?? item.exp ?? "";
    if (explanationText) {
      explanationEl.style.display = "block";
      explanationEl.innerHTML = `<strong>Explanation:</strong> ${explanationText}`;
    }

    nextBtn.style.display = "inline-block";
  }

  nextBtn.addEventListener("click", () => {
    idx++;
    if (idx >= quiz.length) return showResults();
    renderQuestion();
  });

  function showResults() {
    // show final card (animated in CSS)
    qBox.innerHTML = `
      <div id="score-card">
        <div class="score-circle">${score}/${quiz.length}</div>
        <h2>Your Result</h2>
        <div class="remark">${getRemark(score, quiz.length)}</div>
        <div style="margin-top:16px;">
          <button class="score-btn" onclick="location.reload()">🔁 Retry</button>
          <button class="score-btn" onclick="window.location='/games/quizsets/'">⬅ Back</button>
        </div>
      </div>
    `;
    if (typeof confetti === "function") confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }});
  }

  function getRemark(s, t) {
    const p = Math.round((s / t) * 100);
    if (p === 100) return "🌟 Excellent! Perfect Score!";
    if (p >= 80) return "💚 Great job!";
    if (p >= 50) return "🙂 Good — keep practicing!";
    return "🔴 Needs more practice — you can do it!";
  }

  function updateProgressBar(index, total) {
    const bar = document.getElementById("quiz-progress-bar");
    if (!bar) return;
    const percent = Math.round((index / total) * 100);
    bar.style.width = percent + "%";
  }

  // start
  loadQuiz();
});
