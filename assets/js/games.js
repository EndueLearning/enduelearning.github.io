let questions = [];
let currentQuestionIndex = 0;
let knowledgeCoins = 0;
let wrongAttempts = 0;

const adImages = ["assets/images/ad1.jpg", "assets/images/ad2.jpg", "assets/images/ad3.jpg"];
const mascots = ["📘", "✏️", "🧠", "🎈", "🖍️", "📗", "🪄"];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startGameBtn").addEventListener("click", startGame);
});

async function startGame() {
  const subject = document.getElementById("subjectSelect").value;
  if (!subject) {
    alert("Please select a subject to start!");
    return;
  }

  try {
    const response = await fetch(`assets/data/questions_${subject}.json`);
    questions = await response.json();

    document.querySelector(".subject-select").classList.add("hidden");
    document.getElementById("gameBox").classList.remove("hidden");
    document.getElementById("adSection").classList.remove("hidden");

    loadQuestion();
  } catch (error) {
    console.error("Error loading questions:", error);
    document.getElementById("question").textContent = "Error loading questions.";
  }
}

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById("question").textContent = q.q;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const q = questions[currentQuestionIndex];

  if (selected === q.answer) {
    knowledgeCoins++;
    document.getElementById("coinDisplay").textContent = `🪙 Knowledge Coins: ${knowledgeCoins}`;
    document.getElementById("donationProgress").textContent = `🎁 You’ve donated ${Math.floor(knowledgeCoins / 5)} virtual books!`;
    triggerMascot();
    changeAd();
    wrongAttempts = 0;
    nextQuestion();
  } else {
    wrongAttempts++;
    showFloatingMessage("Oops! Try again, you’ve got this! 💪");
    if (wrongAttempts >= 3) showRobotTutor();
  }
}

function nextQuestion() {
  currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
  loadQuestion();
}

function triggerMascot() {
  const mascot = document.getElementById("mascot");
  const randomMascot = mascots[Math.floor(Math.random() * mascots.length)];
  mascot.textContent = randomMascot;
  mascot.classList.add("celebrate");
  setTimeout(() => mascot.classList.remove("celebrate"), 800);
}

function showFloatingMessage(text) {
  const container = document.getElementById("floatingMessageContainer");
  const msg = document.createElement("div");
  msg.className = "floating-message";
  msg.textContent = text;
  container.appendChild(msg);
  setTimeout(() => msg.remove(), 2500);
}

function changeAd() {
  const adImg = document.getElementById("adImage");
  const randomAd = adImages[Math.floor(Math.random() * adImages.length)];
  adImg.src = randomAd;
}

// 🤖 Tutor Bot animation
function showRobotTutor() {
  const bot = document.getElementById("robotTutor");
  const msg = document.getElementById("robotMessage");
  bot.classList.remove("hidden");
  msg.classList.add("slide-in");

  setTimeout(() => msg.classList.remove("hidden"), 100);
  setTimeout(() => msg.classList.remove("slide-in"), 5500);
  setTimeout(() => msg.classList.add("hidden"), 6500);
}
