let quizData = [];
let current = 0;
let score = 0;

let questionBox, optionsBox, explanationBox, progressBox, nextBtn;

document.addEventListener("DOMContentLoaded", () => {
  questionBox = document.getElementById("question");
  optionsBox = document.getElementById("options");
  explanationBox = document.getElementById("explanation");
  progressBox = document.getElementById("progress");
  nextBtn = document.getElementById("next-btn");

  loadQuiz();
});

// ─────────────────────────────────────
// Load correct JSON no matter the folder
// ─────────────────────────────────────
async function loadQuiz() {
  let path = window.location.pathname.replace(".html", ".json");
  path = "/assets/data/quiz" + path.replace("/games/quizsets", "");

  try {
    const res = await fetch(path);
    quizData = await res.json();
    showQuestion();
  } catch (e) {
    progressBox.textContent = "Error loading quiz.";
    console.error(e);
  }
}

// ─────────────────────────────────────
// Show Question
// ─────────────────────────────────────
function showQuestion() {
  let q = quizData[current];

  progressBox.textContent = `Question ${current + 1} of ${quizData.length}`;
  questionBox.textContent = q.question;

  optionsBox.innerHTML = "";
  explanationBox.style.display = "none";

  q.options.forEach((opt) => {
    let btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;

    btn.onclick = () => checkAnswer(btn, q);
    optionsBox.appendChild(btn);
  });

  nextBtn.style.display = "none";

  updateProgressBar(current, quizData.length);
}

// ─────────────────────────────────────
// CHECK ANSWER
// ─────────────────────────────────────
function checkAnswer(button, q) {
  let selected = button.textContent;

  // Disable all options
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.disabled = true;

    if (btn.textContent === q.answer) btn.classList.add("correct");
    if (btn === button && selected !== q.answer) btn.classList.add("wrong");
  });

  if (selected === q.answer) {
    score++;
    fireSuccessConfetti();
  }

  explanationBox.style.display = "block";
  explanationBox.textContent = q.explanation || "";

  nextBtn.style.display = "block";
}

// ─────────────────────────────────────
// NEXT QUESTION
// ─────────────────────────────────────
nextBtn.onclick = () => {
  current++;

  if (current < quizData.length) {
    showQuestion();
  } else {
    showResults();
  }
};

// ─────────────────────────────────────
// SHOW RESULTS (with animated score card)
// ─────────────────────────────────────
function showResults() {
  document.getElementById("quiz-box").innerHTML = `
    <div id="score-card">
      <div class="score-circle">${score}/${quizData.length}</div>
      <h2>Your Score</h2>
      <div class="remark">${getRemark(score, quizData.length)}</div>

      <button class="score-btn" onclick="location.reload()">Retry</button>
      <button class="score-btn" onclick="window.location='/games/quizsets/'">Back</button>
    </div>
  `;

  fireFinalConfetti();
}

// ─────────────────────────────────────
// STUDENT REMARKS
// ─────────────────────────────────────
function getRemark(s, total) {
  const percent = (s / total) * 100;

  if (percent === 100) return "🌟 Excellent! Perfect!";
  if (percent >= 80) return "👍 Great job!";
  if (percent >= 50) return "🙂 Good effort — keep practicing!";
  return "📘 Needs more practice — you can do it!";
}

// ─────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────
function updateProgressBar(index, total) {
  const bar = document.getElementById("quiz-progress-bar");
  if (!bar) return;

  const percent = ((index) / total) * 100;
  bar.style.width = percent + "%";
}

// ─────────────────────────────────────
// CONFETTI EFFECTS
// ─────────────────────────────────────
function fireSuccessConfetti() {
  if (typeof confetti !== "undefined")
    confetti({ particleCount: 40, spread: 60, startVelocity: 40 });
}

function fireFinalConfetti() {
  if (typeof confetti !== "undefined")
    confetti({ particleCount: 120, spread: 90, startVelocity: 45 });
}
