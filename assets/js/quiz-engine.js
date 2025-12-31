/* FINAL QUIZ ENGINE - AUTO PATH RESOLUTION */
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

  /* 🔹 SMART PATH RESOLVER */
  function resolveQuizJsonPath() {
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    const htmlFile = parts[parts.length - 1];
    const jsonFile = htmlFile.replace(".html", ".json");

    /* CASE 1: classwise quizzes */
    if (parts.includes("classwise")) {
      const i = parts.indexOf("classwise");
      const cls = parts[i + 1];
      const subject = parts[i + 2];
      return `/assets/data/classwise/${cls}/${subject}/${jsonFile}`;
    }

    /* CASE 2: topic-based quizzes */
    if (parts.includes("science") || parts.includes("maths")) {
      const subject = parts[parts.length - 2];
      const topic = parts[parts.length - 1].replace(".html", "");
      return `/assets/data/quiz/${subject}/${topic}/${jsonFile}`;
    }

    return null;
  }

  async function loadQuiz() {
    const path = resolveQuizJsonPath();

    if (!path) {
      progressEl.textContent = "Quiz path not resolved.";
      return;
    }

    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error("Quiz JSON not found");
      quiz = await res.json();
      renderQuestion();
    } catch (err) {
      console.error(err);
      progressEl.textContent = "Unable to load quiz.";
    }
  }

  function renderQuestion() {
    const item = quiz[idx];
    progressEl.textContent = `Question ${idx + 1} of ${quiz.length}`;
    updateProgressBar(idx, quiz.length);

    questionEl.textContent = item.question;
    optionsEl.innerHTML = "";
    explanationEl.style.display = "none";

    item.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(btn, i, item);
      optionsEl.appendChild(btn);
    });

    nextBtn.style.display = "none";
  }

  function handleAnswer(btn, index, item) {
    const buttons = optionsEl.querySelectorAll(".option-btn");
    buttons.forEach(b => b.disabled = true);

    const correct = item.answer;
    if (index === correct) {
      btn.classList.add("correct");
      score++;
      if (window.confetti) confetti({ particleCount: 40, spread: 60 });
    } else {
      btn.classList.add("wrong");
      buttons[correct].classList.add("correct");
    }

    explanationEl.innerHTML = `<strong>Explanation:</strong> ${item.explanation}`;
    explanationEl.style.display = "block";
    nextBtn.style.display = "inline-block";
  }

  nextBtn.onclick = () => {
    idx++;
    idx < quiz.length ? renderQuestion() : showResults();
  };

  function showResults() {
    qBox.innerHTML = `
      <div id="score-card">
        <div class="score-circle">${score}/${quiz.length}</div>
        <h2>Your Result</h2>
        <p>${getRemark()}</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
    if (window.confetti) confetti({ particleCount: 120, spread: 90 });
  }

  function getRemark() {
    const p = (score / quiz.length) * 100;
    if (p === 100) return "🌟 Excellent!";
    if (p >= 80) return "💚 Great Job!";
    if (p >= 50) return "🙂 Good effort!";
    return "🔴 Needs practice";
  }

  function updateProgressBar(i, t) {
    progressBar.style.width = `${((i + 1) / t) * 100}%`;
  }

  loadQuiz();
});
