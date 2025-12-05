/* ==========================================
   FINAL STABLE QUIZ ENGINE FOR ENDUE LEARNING
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ---- DOM HOOKS ----
  const qBox     = document.getElementById("question");
  const optBox   = document.getElementById("options");
  const nextBtn  = document.getElementById("next-btn");
  const progress = document.getElementById("progress");
  const explain  = document.getElementById("explanation");

  let quiz = [];
  let index = 0;
  let score = 0;
  let lock = false;

  // ---- JSON PATH BUILDER ----
  function quizJSONPath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const file = parts.pop().replace(".html", ".json");
    const topic = parts.pop();
    const subject = parts.pop();
    return `/assets/data/quiz/${subject}/${topic}/${file}`;
  }

  // ---- LOAD JSON ----
  fetch(quizJSONPath())
    .then(r => r.json())
    .then(data => {
      quiz = data;
      progress.innerText = "Click a choice to begin!";
      renderQuestion();
    })
    .catch(() => {
      progress.innerText = "Quiz cannot be loaded.";
    });

  // ---- RENDER QUESTION ----
  function renderQuestion() {
    const q = quiz[index];
    progress.innerText = `Question ${index+1} of ${quiz.length}`;
    qBox.innerText = q.question;
    explain.innerHTML = "";
    nextBtn.style.display = "none";
    lock = false;

    optBox.innerHTML = "";
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.innerText = opt;
      btn.onclick = () => checkAnswer(i);
      optBox.appendChild(btn);
    });
  }

  // ---- CHECK ANSWER ----
  function checkAnswer(clicked) {
    if (lock) return;
    lock = true;

    const q = quiz[index];
    const correct = q.answer;

    const buttons = document.querySelectorAll(".option");
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === correct) b.classList.add("correct");
      if (i === clicked && clicked !== correct) b.classList.add("wrong");
    });

    if (clicked === correct) score++;

    explain.innerHTML = `
      <div class="explain-box"><strong>Explanation:</strong><br>${q.explanation}</div>
    `;

    nextBtn.style.display = "block";
  }

  // ---- NEXT / FINISH ----
  nextBtn.addEventListener("click", () => {
    index++;
    if (index >= quiz.length) return showResults();
    renderQuestion();
  });

  // ---- FINAL SCORE ----
  function showResults() {
    let remark = "";
    const percent = (score / quiz.length) * 100;

    if (percent === 100) remark = "🌟 Excellent!";
    else if (percent >= 80) remark = "💚 Great job!";
    else if (percent >= 50) remark = "🟡 Needs more practice.";
    else remark = "🔴 Keep learning — try again!";

    document.getElementById("quiz-box").innerHTML = `
      <h2>Quiz Completed!</h2>
      <p class="final-score">Your Score: ${score} / ${quiz.length}</p>
      <p class="remark">${remark}</p>

      <button onclick="location.reload()" class="option">🔁 Retry</button>
      <a href="/games/quizsets/" class="option">⬅ Back</a>
    `;
  }

});
