/* ==================================================
   QUIZ ENGINE - FINAL VERSION (FULL WORKING FILE)
   ================================================== */

let quizData = [];
let currentIndex = 0;
let correctCount = 0;

const startBtn = document.getElementById("startQuizBtn");
const quizBox = document.getElementById("quizBox");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("optionsBox");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("resultBox");


/* --------------------------------------------------
   1. AUTO-LOAD QUIZ JSON BASED ON URL
----------------------------------------------------- */
function loadQuiz() {

  const path = window.location.pathname.split("/");
  const filename = path[path.length - 1]; // example: light_concave-mirror.html
  const jsonName = filename.replace(".html", ".json");

  const subject = path[path.length - 3]; // science
  const topic = path[path.length - 2];   // physics

  const jsonPath = `/assets/data/quiz/${subject}/${topic}/${jsonName}`;

  fetch(jsonPath)
    .then(res => res.json())
    .then(data => {
      quizData = data;
      startBtn.disabled = false;
    })
    .catch(err => {
      console.error("Quiz Load Error:", err);
      startBtn.innerText = "Error Loading Quiz ❌";
    });
}


/* --------------------------------------------------
   2. START QUIZ
----------------------------------------------------- */
startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  quizBox.style.display = "block";
  currentIndex = 0;
  correctCount = 0;
  showQuestion();
});


/* --------------------------------------------------
   3. SHOW QUESTION + OPTIONS
----------------------------------------------------- */
function showQuestion() {
  const q = quizData[currentIndex];

  questionText.innerHTML = q.question;

  // clear previous options
  optionsBox.innerHTML = "";
  nextBtn.style.display = "none";

  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;

    btn.onclick = () => checkAnswer(index);

    optionsBox.appendChild(btn);
  });
}


/* --------------------------------------------------
   4. CHECK ANSWER
----------------------------------------------------- */
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

  // show explanation
  const exp = document.createElement("div");
  exp.className = "explanation-box";
  exp.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
  quizBox.appendChild(exp);

  if (selectedIndex === q.answer) {
    correctCount++;
  }

  nextBtn.style.display = "block";
}


/* --------------------------------------------------
   5. NEXT QUESTION
----------------------------------------------------- */
nextBtn.addEventListener("click", () => {
  currentIndex++;

  // finish quiz
  if (currentIndex >= quizData.length) {
    finishQuiz();
    return;
  }

  // remove explanation box
  const expBox = document.querySelector(".explanation-box");
  if (expBox) expBox.remove();

  showQuestion();
});


/* --------------------------------------------------
   6. FINISH QUIZ + SHOW SCORE
----------------------------------------------------- */
function finishQuiz() {
  quizBox.style.display = "none";

  const total = quizData.length;
  const score = correctCount;
  const percent = Math.round((score / total) * 100);

  let remark = "";
  if (percent === 100) remark = "🌟 Excellent — Perfect Score!";
  else if (percent >= 80) remark = "💚 Great Job — Keep it up!";
  else if (percent >= 50) remark = "🟡 Good — A little more practice!";
  else remark = "🔴 Needs Practice — Keep Learning!";

  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <h2>Your Score</h2>
    <p class="score-number">${score} / ${total}</p>
    <p class="remark">${remark}</p>

    <button class="quiz-btn" onclick="location.reload()">🔁 Retry</button>
    <button class="quiz-btn secondary" onclick="window.location.href='/games/quizsets/'">⬅ Back</button>
  `;
}


/* --------------------------------------------------
   INITIAL CALL
----------------------------------------------------- */
loadQuiz();
