document.addEventListener("DOMContentLoaded", () => {

  // --- Antonym Data ---
  const cards = [
    { front: "Hot", back: "Cold" },
    { front: "Brave", back: "Cowardly" },
    { front: "Early", back: "Late" },
    { front: "Strong", back: "Weak" },
    { front: "Accept", back: "Reject" },
    { front: "Calm", back: "Agitated" },
    { front: "Increase", back: "Decrease" },
    { front: "Wide", back: "Narrow" },
    { front: "Happy", back: "Sad" },
    { front: "Generous", back: "Stingy" }
  ];

  let index = 0;

  const cardBox = document.getElementById("flashCard");
  const front = document.getElementById("cardFront");
  const back = document.getElementById("cardBack");

  const prevBtn = document.getElementById("prevCard");
  const nextBtn = document.getElementById("nextCard");

  function loadCard() {
    const c = cards[index];
    front.textContent = c.front;
    back.textContent = c.back;
    cardBox.classList.remove("flipped");
  }

  // Flip card on tap
  cardBox.addEventListener("click", () => {
    cardBox.classList.toggle("flipped");
  });

  // Next card
  nextBtn.addEventListener("click", () => {
    index = (index + 1) % cards.length;
    loadCard();
  });

  // Previous card
  prevBtn.addEventListener("click", () => {
    index = (index - 1 + cards.length) % cards.length;
    loadCard();
  });

  // Swipe support (mobile)
  let startX = 0;
  cardBox.addEventListener("touchstart", e => startX = e.changedTouches[0].clientX);
  cardBox.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) prevBtn.click();
    if (startX - endX > 50) nextBtn.click();
  });

  loadCard();
});
