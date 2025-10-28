let questions = [];
let currentQuestionIndex = 0;
let knowledgeCoins = 0;
let wrongAttempts = 0;

const adImages = [
  "assets/images/ad1.jpg",
  "assets/images/ad2.jpg",
  "assets/images/ad3.jpg"
];

async function loadQuestions() {
  try {
    const response = await fetch("assets/data/questions.json");
    questions = await response.json();
    loadQuestion();
  } catch (error) {
    console.error("Failed to load questions:", error);
    document.getElementById("question").innerText = "Error loading questions.";
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
    nextQuestion();
  } else {
    wrongAttempts++;
    showFloatingMessage("Oops! Keep trying, you’ll get it! 💪");

    if (wrongAttempts === 3) {
      showFloatingMessage("💡 Learn more from our resources and come back stronger!");
      wrongAttempts = 0; // reset after message
    }
  }
}

function nextQuestion() {
  currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
  loadQuestion();
}

function triggerMascot() {
  const mascot = document.getElementById("mascot");
  mascot.classList.add("celebrate");
  setTimeout(() => mascot.classList.remove("celebrate"), 1000);
}

function showFloatingMessage(text) {
  const container = document.getElementById("floatingMessageContainer");
  const msg = document.createElement("div");
  msg.className = "floating-message";
  msg.textContent = text;
  container.appendChild(msg);

  setTimeout(() => msg.remove(), 2000);
}

function changeAd() {
  const adImg = document.getElementById("adImage");
  const randomAd = adImages[Math.floor(Math.random() * adImages.length)];
  adImg.src = randomAd;
}

document.addEventListener("DOMContentLoaded", loadQuestions);
