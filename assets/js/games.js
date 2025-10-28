const questions = [
  { q: "Which planet is known as the Red Planet?", a: "Mars", options: ["Earth", "Mars", "Jupiter", "Venus"] },
  { q: "What is the capital of India?", a: "New Delhi", options: ["Mumbai", "Chennai", "New Delhi", "Kolkata"] },
  { q: "Which is the largest mammal?", a: "Blue Whale", options: ["Elephant", "Blue Whale", "Giraffe", "Rhino"] },
  { q: "5 + 3 = ?", a: "8", options: ["6", "8", "7", "9"] },
  { q: "Which gas do plants absorb?", a: "Carbon Dioxide", options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"] }
  { q: "What planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Saturn"], answer: "Mars" },
  { q: "Which gas do plants use for photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], answer: "Carbon Dioxide" },
  { q: "Who invented the light bulb?", options: ["Einstein", "Edison", "Newton", "Tesla"], answer: "Edison" },
  { q: "What is 8 × 7?", options: ["54", "56", "64", "42"], answer: "56" },
  { q: "Which organ pumps blood in your body?", options: ["Lungs", "Brain", "Heart", "Kidneys"], answer: "Heart" },
];

let currentIndex = 0;
let bookCount = 0;
let wrongCount = 0;

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
});

function loadQuestion() {
  const q = questions[currentIndex];
  document.getElementById("question").textContent = q.q;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const q = questions[currentIndex];
  if (selected === q.a) {
    // Correct answer
    bookCount++;
    wrongCount = 0; // reset wrong answers
    updateProgress();
    showMascot();
    rotateAd();
  } else {
    wrongCount++;
    showEncouragement();
    if (wrongCount >= 3) {
      showMessageBox();
      wrongCount = 0;
    }
  }

  nextQuestion();
}

function nextQuestion() {
  currentIndex = (currentIndex + 1) % questions.length;
  loadQuestion();
}

function updateProgress() {
  document.getElementById("bookCount").textContent = bookCount;
  const fill = document.getElementById("progressFill");
  fill.style.width = `${(bookCount % 10) * 10}%`;
}

function showMascot() {
  const mascot = document.getElementById("mascot");
  mascot.style.display = "block";
  setTimeout(() => mascot.style.display = "none", 1200);
}

function showEncouragement() {
  const messages = [
    "Nice try! Keep going 💪",
    "You’re improving! Try the next one 🤗",
    "Almost there — you’ve got this 🌟"
  ];
  alert(messages[Math.floor(Math.random() * messages.length)]);
}

function showMessageBox() {
  document.getElementById("messageBox").classList.remove("hidden");
  document.querySelector(".question-box").classList.add("hidden");
}

function rotateAd() {
  const adArea = document.getElementById("ad-area");
  adArea.innerHTML = `<p class="ad-placeholder">[ New Ad will load here ]</p>`;

  // If AdSense is integrated, refresh ads dynamically
  try {
    (adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.log("Ad refresh skipped (not live AdSense).");
  }
}
