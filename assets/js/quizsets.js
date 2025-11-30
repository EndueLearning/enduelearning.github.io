// assets/js/quizsets.js
(function(){

  const SUBJECT_PATHS = {
    math: "/assets/data/quizsets_math.json",
    science: "/assets/data/quizsets_science.json",
    english: "/assets/data/quizsets_english.json"
  };

  const startBtn = document.getElementById("startBtn");
  const subjectSelect = document.getElementById("subjectSelect");
  const quizArea = document.getElementById("quizArea");
  const qbox = document.getElementById("qbox");
  const scoreDiv = document.getElementById("score");

  let questions = [];
  let index = 0;
  let answers = [];

  function startQuiz() {
    const subject = subjectSelect.value;
    const filePath = SUBJECT_PATHS[subject];

    fetch(filePath)
      .then(r => r.json())
      .then(data => {
        questions = data.sort(() => Math.random() - 0.5).slice(0, 10);
        index = 0;
        answers = [];
        scoreDiv.innerHTML = "";
        quizArea.style.display = "block";
        loadQuestion();
      });
  }

  function loadQuestion() {
    const q = questions[index];
    qbox.innerHTML = `
      <div class="question"><strong>Q${index + 1}:</strong> ${q.q}</div>
      <div class="options"></div>
    `;

    const optionsDiv = qbox.querySelector(".options");

    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "opt-btn";
      btn.textContent = opt;

      btn.onclick = () => handleAnswer(btn, opt, q.a);

      optionsDiv.appendChild(btn);
    });
  }

  function handleAnswer(button, selected, correct) {
    const buttons = qbox.querySelectorAll(".opt-btn");
    buttons.forEach(b => (b.disabled = true));

    if (selected === correct) {
      button.style.background = "#d4ffd8";
      button.style.border = "2px solid #28a745";
    } else {
      button.style.background = "#ffd4d4";
      button.style.border = "2px solid #dc3545";

      buttons.forEach(b => {
        if (b.textContent === correct) {
          b.style.background = "#d4ffd8";
          b.style.border = "2px solid #28a745";
        }
      });
    }

    answers.push(selected);

    setTimeout(() => {
      index++;
      if (index >= questions.length) showScore();
      else loadQuestion();
    }, 1200);
  }

  function showScore() {
    quizArea.style.display = "none";

    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.a) score++;
    });

    scoreDiv.innerHTML = `
      <h3>Your Score: ${score} / ${questions.length}</h3>
      <a href="/games/quizsets.html" class="btn-primary">Try Another Set</a>
    `;
  }

  startBtn.addEventListener("click", startQuiz);

})();
