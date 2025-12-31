/* FINAL QUIZ ENGINE — URL-based JSON loading */
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

  /* ===============================
     AUTO-DETECT JSON FROM URL
     =============================== */
  function jsonPathFromUrl() {
    // Example:
    // /games/quizsets/science/biology/life-process.html
    // → /assets/data/quiz/science/biology/life-process.json

    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);

    const htmlFile = parts[parts.length - 1];
    const topic = parts[parts.length - 2];
    const subject = parts[parts.length - 3];

    const jsonFile = htmlFile.replace(/\.html$/i, ".json");

    return `/assets/data/quiz/${subject}/${topic}/${jsonFile}`;
  }

  /* ===============================
     LOAD QUIZ
     =============================== */
  async function loadQuiz() {
    const path = jsonPathFromUrl();

    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error("Quiz JSON not found: " + path);

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Quiz JSON empty or invalid");
      }

      quiz = data;
      renderQuestion();

    } catch (err) {
      console.error(err);
      progressEl.textContent = "⚠ Unable to load quiz questions.";
    }
  }

  /* ===============================
     RENDER QUESTION
     =============================== */
  function renderQuestion() {
    const item = quiz[idx];
    if (!item) return;

    progressEl.textContent = `Question ${idx + 1} of ${quiz.length}`;
    updateProgressBar(idx, quiz.length);

    questionEl.textContent = item.question || item.q || "Question missing";

    optionsEl.innerHTML = "";
    explanationEl.style.display = "none";
    explanationEl.textContent = "";

    item.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(btn, i, item);
      optionsEl.appendChild(btn);
    });

    nextBtn.style.display = "none";
  }

  /* ===============================
     ANSWER HANDLING
     =============================== */
  function handleAnswer(button, selectedIndex, item) {
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach(b => b.disabled = true);

    let correctIndex = item.answer;

    if (typeof item.answer === "string") {
      correctIndex = item.options.findIndex(
        o => o.trim().toLowerCase() === item.answer.trim().toLowerCase()
      );
    }

    buttons.forEach((b, i) => {
      if (i === correctIndex) b.classList.add("correct");
      if (i === selectedIndex && i !== correctIndex) b.classList.add("wrong");
    });

    if (selectedIndex === correctIndex) {
      score++;
      if (typeof confetti === "function") {
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
      }
    }

    if (item.explanation) {
      explanationEl.style.display = "block";
      explanationEl.innerHTML = `<strong>Explanation:</strong> ${item.explanation}`;
    }

    nextBtn.style.display = "inline-block";
  }

  /* ===============================
     NEXT / RESULT
     =============================== */
  nextBtn.onclick = () => {
    idx++;
    if (idx >= quiz.length) showResults();
    else renderQuestion();
  };

  function showResults() {
    qBox.innerHTML = `
      <div id="score-card">
        <div class="score-circle">${score}/${quiz.length}</div>
        <h2>Your Result</h2>
        <div class="remark">${getRemark(score, quiz.length)}</div>
        <div style="margin-top:16px;">
          <button class="score-btn" onclick="location.reload()">🔁 Retry</button>
          <button class="score-btn" onclick="window.location='/games/quizsets.html'">⬅ Back</button>
        </div>
      </div>
    `;

    if (typeof confetti === "function") {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
    }
  }

  function getRemark(s, t) {
    const p = Math.round((s / t) * 100);
    if (p === 100) return "🌟 Excellent! Perfect Score!";
    if (p >= 80) return "💚 Great job!";
    if (p >= 50) return "🙂 Good — keep practicing!";
    return "🔴 Needs more practice!";
  }

  /* ===============================
     PROGRESS BAR (FIXED)
     =============================== */
  function updateProgressBar(index, total) {
    if (!progressBar) return;
    const percent = Math.round(((index + 1) / total) * 100);
    progressBar.style.width = percent + "%";
  }

  /* START */
  loadQuiz();
});
