/* CLEAN FLASHCARDS ENGINE — Quizlet style */

document.addEventListener("DOMContentLoaded", () => {

  const player = document.querySelector(".fc-player");
  if (!player) return;

  const card = document.getElementById("card");
  const cardFront = document.getElementById("cardFront");
  const cardBack = document.getElementById("cardBack");
  const progressText = document.getElementById("progressText");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const autoplayBtn = document.getElementById("autoplayBtn");
  const studyBtn = document.getElementById("studyBtn");
  const studyGrid = document.getElementById("studyGrid");

  const flipSound = new Audio("/assets/sounds/flip.mp3");
  const starBtn = document.getElementById("starBtn");
  const STAR_KEY = "endue_starred_cards";

  let starred = JSON.parse(localStorage.getItem(STAR_KEY)) || {};


  let deck = [];
  let order = [];
  let index = 0;
  let autoplay = false;
  let autoTimer = null;

  const jsonPath = player.dataset.json;

  fetch(jsonPath, { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
      deck = data;
      order = deck.map((_, i) => i);
      render();
    })
    .catch(err => {
  console.error("Flashcards error:", err);
  cardFront.textContent = "⚠ Flashcards not found";
  cardBack.textContent = "Check JSON path";
});

  function render() {
    const item = deck[order[index]];
    cardFront.textContent = item.front;
    cardBack.textContent = item.back;
    card.classList.remove("flipped");
    progressText.textContent = `${index + 1} / ${order.length}`;

    const cardId = order[index];
    starBtn.classList.toggle("active", starred[cardId]);
    starBtn.textContent = starred[cardId] ? "★" : "☆";

  }

  function flip() {
    card.classList.toggle("flipped");
    try { flipSound.play(); } catch {}
  }

  function next() {
    index = (index + 1) % order.length;
    render();
  }

  function prev() {
    index = (index - 1 + order.length) % order.length;
    render();
  }

  function shuffle() {
    order.sort(() => Math.random() - 0.5);
    index = 0;
    render();
  }

  function toggleAutoplay() {
    autoplay = !autoplay;
    autoplayBtn.textContent = autoplay ? "Stop" : "Auto-play";

    if (autoplay) {
      autoTimer = setInterval(() => {
        flip();
        setTimeout(() => {
          if (card.classList.contains("flipped")) flip();
          next();
        }, 2000);
      }, 3500);
    } else {
      clearInterval(autoTimer);
    }
  }

  function toggleStudy() {
    if (!studyGrid) return;

    if (!studyGrid.classList.contains("hide")) {
      studyGrid.classList.add("hide");
      studyBtn.textContent = "Study view";
      return;
    }

    studyGrid.innerHTML = "";
    deck.forEach(d => {
      const div = document.createElement("div");
      div.className = "study-card";
      div.innerHTML = `<div class="front">${d.front}</div><div class="back">${d.back}</div>`;
      studyGrid.appendChild(div);
    });

    studyGrid.classList.remove("hide");
    studyBtn.textContent = "Back";
  }

  card.addEventListener("click", flip);
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  shuffleBtn.addEventListener("click", shuffle);
  autoplayBtn.addEventListener("click", toggleAutoplay);
  studyBtn.addEventListener("click", toggleStudy);

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
    if (e.key === " ") { e.preventDefault(); flip(); }
  });
/* ==========================
   Mobile Swipe Support
========================== */

let startX = 0;
let endX = 0;

card.addEventListener("touchstart", e => {
  startX = e.changedTouches[0].screenX;
});

card.addEventListener("touchend", e => {
  endX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const diff = endX - startX;
  if (Math.abs(diff) < 40) return; // ignore small swipes

  if (diff < 0) next();     // swipe left
  else prev();              // swipe right
}

  starBtn.addEventListener("click", () => {
  const cardId = order[index];
  starred[cardId] = !starred[cardId];
  localStorage.setItem(STAR_KEY, JSON.stringify(starred));
  render();
});

  
});
