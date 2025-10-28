// assets/js/games.js
document.addEventListener("DOMContentLoaded", () => {
  const questionBox = document.getElementById("question");
  const optionsBox = document.getElementById("options");
  const scoreDisplay = document.getElementById("score");
  const nextBtn = document.getElementById("next-btn");
  const resultBox = document.getElementById("result");
  const finalScore = document.getElementById("final-score");
  const restartBtn = document.getElementById("restart-btn");

  let currentQuestion = 0;
  let score = 0;

  const questions = [
    { q: "What planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Saturn"], answer: "Mars" },
    { q: "Which gas do plants use for photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], answer: "Carbon Dioxide" },
    { q: "Who invented the light bulb?", options: ["Einstein", "Edison", "Newton", "Tesla"], answer: "Edison" },
    { q: "What is 8 × 7?", options: ["54", "56", "64", "42"], answer: "56" },
    { q: "Which organ pumps blood in your body?", options: ["Lungs", "Brain", "Heart", "Kidneys"], answer: "Heart" },
  ];

  function loadQuestion() {
    const q = questions[currentQuestion];
    questionBox.textContent = q.q;
    optionsBox.innerHTML = "";
    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(opt);
      optionsBox.appendChild(btn);
    });
    nextBtn.disabled = true;
  }

  function checkAnswer(selected) {
    const correct = questions[currentQuestion].answer;
    if (selected === correct) {
      score++;
      scoreDisplay.textContent = score;
      triggerConfetti();
    }
    nextBtn.disabled = false;
  }

  function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      endGame();
    }
  }

  function endGame() {
    document.getElementById("game-area").style.display = "none";
    resultBox.classList.remove("hidden");
    finalScore.textContent = score;
    localStorage.setItem("endue_coins", score);
  }

  function restartGame() {
    currentQuestion = 0;
    score = 0;
    scoreDisplay.textContent = 0;
    document.getElementById("game-area").style.display = "block";
    resultBox.classList.add("hidden");
    loadQuestion();
  }

  nextBtn.addEventListener("click", nextQuestion);
    restartBtn.addEventListener("click", restartGame);

  loadQuestion();
});

// Trigger confetti if available
function triggerConfetti() {
  if (typeof confetti === "function") confetti({ particleCount: 60, spread: 80 });
}
