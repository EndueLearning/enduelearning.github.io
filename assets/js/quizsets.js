// =========================
// QUIZ ENGINE – FULL FILE
// =========================

let quizData = [];
let currentIndex = 0;
let correctCount = 0;

const startBtn = document.getElementById("startQuizBtn");
const quizBox = document.getElementById("quizBox");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("optionsBox");
const resultBox = document.getElementById("resultBox");

// -----------------------------
// 1. Load quiz based on page URL
// -----------------------------
function loadQuiz() {
  const pathParts = window.location.pathname.split("/");
  const fileName = pathParts[pathParts.length - 1]; // light_concave-mirror.html
  const jsonName = fileName.replace(".html", ".json");

  const subject = pathParts[pathParts.length - 3];   // science
  const topic = pathParts[pathParts.length - 2];     // physics

  const jsonPath = `/assets/data/quiz/${subject}/${topic}/${jsonName}`;

  fetch(jsonPath)
    .then(r => r.json())
    .then(data => {
      quizData = data;
      startBtn.disabled = false;
    })
    .catch(err => {
      console.error("Quiz load error:", err);
      startBtn.innerText = "Error Loading Quiz ❌";
    });
}

// -----------------------------
// 2. Start quiz
// -----------------------------
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  quizBox.style.display = "block";
  showQuestion();
});

// -----------------------------
// 3. Display question
// -----------------------------
function showQuestion() {
  const q = quizData[currentIndex];

  // Safety check in case JSON missing fields
  if (!q || !q.question) {
    questionText.innerHTML = "⚠ Error: Invalid question format!";
    return;
  }

  questionText.innerHTML = q.question;

  optionsBox.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;

    btn.onclick = () => checkAnswer(i);

    optionsBox.appendChild(btn);
  });
}

// -----------------------------
// 4. Check answer
// -----------------------------
function checkAnswer(selectedIndex) {
  const q = quizData[currentIndex];

  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, index) => {
    btn.disabled = true;

    if (index === q.answer) {
      btn.classList.add("correct");
    } else if (index === selectedIndex) {
      btn.classList.add("wrong");
    }
  });

  // Explanation box
  const exp = document.createElement("div");
  exp.className = "explanation-box";
  exp.innerHTML = `
    <strong>Explanation:</strong> ${q.explanation}
  `;
  quizBox.appendChild(exp);

  if (selectedIndex === q.answer) {
    correctCount++;
  }

  setTimeout(() => {
    exp.remove();
    nextQuestion();
  }, 1500);
}

// -----------------------------
// 5. Load next or finish
// -----------------------------
function nextQuestion() {
  currentIndex++;

  if (currentIndex >= quizData.length) {
    finishQuiz();
    return;
  }

  showQuestion();
}

// -----------------------------
// 6. Finish Quiz + Show Score
// -----------------------------
function finishQuiz() {
  quizBox.style.display = "none";

  let score = correctCount;
  let total = quizData.length;
  let percent = Math.round((score / total) * 100);

  let remark = "";

  if (percent === 100) remark = "🌟 Excellent — Perfect Score!";
  else if (percent >= 80) remark = "💚 Great Job — Keep it up!";
  else if (percent >= 50) remark = "🟡 Good — A little more practice!";
  else remark = "🔴 Needs Practice — You can do it!";

  resultBox.innerHTML = `
    <h2>Your Score</h2>
    <p class="score-number">${score} / ${total}</p>
    <p class="remark">${remark}</p>

    <button id="retryQuiz" class="quiz-btn">🔁 Retry</button>
    <button id="goBack" class="quiz-btn secondary">⬅ Back</button>
  `;

  resultBox.style.display = "block";

  document.getElementById("retryQuiz").onclick = () => {
    location.reload();
  };

  document.getElementById("goBack").onclick = () => {
    window.location.href = "/games/quizsets/";
  };
}

// -----------------------------
// INIT
// -----------------------------
loadQuiz();
