let quizData = [];
let current = 0;
let score = 0;

let questionBox = document.getElementById("question");
let optionsBox = document.getElementById("options");
let explanationBox = document.getElementById("explanation");
let progressBox = document.getElementById("progress");
let nextBtn = document.getElementById("next-btn");

async function loadQuiz() {
  let path = window.location.pathname.replace(".html", ".json");
  path = "/assets/data/quiz" + path.replace("/games/quizsets", "");

  try {
    const res = await fetch(path);
    quizData = await res.json();
    showQuestion();
  } catch (e) {
    progressBox.textContent = "Error loading quiz";
  }
}

function showQuestion() {
  let q = quizData[current];

  progressBox.textContent = `Question ${current + 1} of ${quizData.length}`;
  questionBox.textContent = q.question;
  explanationBox.style.display = "none";
  explanationBox.textContent = "";

  optionsBox.innerHTML = "";

  q.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;

    btn.onclick = () => checkAnswer(btn, q);
    optionsBox.appendChild(btn);
  });
}

function checkAnswer(button, q) {
  let selected = button.textContent;

  // highlight correct & wrong buttons
  document.querySelectorAll(".option-btn").forEach(btn => {
    if (btn.textContent === q.answer) btn.classList.add("correct");
    if (btn === button && selected !== q.answer) btn.classList.add("wrong");
    btn.disabled = true;
  });

  // scoring
  if (selected === q.answer) score++;

  // explanation
  explanationBox.style.display = "block";
  explanationBox.textContent = q.explanation || "";

  // show NEXT
  nextBtn.style.display = "block";

  // play feedback effect
  if (selected === q.answer) fireSuccessConfetti();
}

nextBtn.onclick = () => {
  nextBtn.style.display = "none";
  current++;

  if (current < quizData.length) {
    showQuestion();
  } else {
    showResults();
  }
};

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

function getRemark(s, t) {
  let p = (s / t) * 100;
  if (p === 100) return "🌟 Excellent! You're a genius!";
  if (p >= 80) return "👍 Great job!";
  if (p >= 50) return "🙂 Good effort — keep practicing!";
  return "📘 Needs more practice. You can do it!";
}

/* ---------------- Confetti Effects ---------------- */

function fireSuccessConfetti() {
  confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 40,
    origin: { y: 0.6 }
  });
}

function fireFinalConfetti() {
  confetti({
    particleCount: 120,
    spread: 90,
    startVelocity: 45,
    origin: { y: 0.6 }
  });
}

document.addEventListener("DOMContentLoaded", loadQuiz);
