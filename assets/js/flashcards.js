document.addEventListener("DOMContentLoaded", () => {

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

  const card = document.getElementById("flashCard");
  const front = document.getElementById("cardFront");
  const back = document.getElementById("cardBack");
  const progress = document.getElementById("fcProgress");

  const prev = document.getElementById("prevCard");
  const next = document.getElementById("nextCard");

  function updateCard() {
    front.textContent = cards[index].front;
    back.textContent = cards[index].back;

    progress.textContent = `${index + 1} / ${cards.length}`;

    card.classList.remove("flipped");
  }

  // Flip on click
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  // Navigation
  next.addEventListener("click", () => {
    index = (index + 1) % cards.length;
    updateCard();
  });
  prev.addEventListener("click", () => {
    index = (index - 1 + cards.length) % cards.length;
    updateCard();
  });

  updateCard();
});
