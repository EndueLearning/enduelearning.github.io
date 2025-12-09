document.addEventListener("DOMContentLoaded", () => {

  // SAMPLE DATA — add more anytime
  const cards = [
    { word: "Hot", antonym: "Cold" },
    { word: "Brave", antonym: "Cowardly" },
    { word: "Early", antonym: "Late" },
    { word: "Happy", antonym: "Sad" },
    { word: "Strong", antonym: "Weak" },
    { word: "Generous", antonym: "Stingy" },
    { word: "Accept", antonym: "Reject" },
    { word: "Calm", antonym: "Agitated" },
    { word: "Increase", antonym: "Decrease" },
    { word: "Wide", antonym: "Narrow" }
  ];

  let index = 0;

  const cardEl = document.getElementById("flashCard");
  const frontText = document.getElementById("frontText");
  const backText = document.getElementById("backText");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const flipBtn = document.getElementById("flipBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");

  function loadCard() {
    const c = cards[index];
    frontText.textContent = c.word;
    backText.textContent = c.antonym;
    cardEl.classList.remove("flipped");
  }

  /* Flip Card */
  flipBtn.addEventListener("click", () => {
    cardEl.classList.toggle("flipped");
  });

  cardEl.addEventListener("click", () => {
    cardEl.classList.toggle("flipped");
  });

  /* Next / Prev */
  nextBtn.addEventListener("click", () => {
    index = (index + 1) % cards.length;
    loadCard();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + cards.length) % cards.length;
    loadCard();
  });

  /* Shuffle */
  shuffleBtn.addEventListener("click", () => {
    cards.sort(() => Math.random() - 0.5);
    index = 0;
    loadCard();
  });

  // Load first card
  loadCard();
});
