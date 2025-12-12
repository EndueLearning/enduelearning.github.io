/* flashcards.js
   Full Flashcards engine for Endue Learning
   - loads JSON deck
   - flip on click
   - prev/next + keyboard
   - shuffle, autoplay
   - study grid
   - know/don't-know scoring + result card
   - uses absolute paths for sounds: /assets/sounds/*.mp3
*/

/* eslint-disable no-console */
document.addEventListener("DOMContentLoaded", () => {

  // locate player root element (there may be many players; we target the one present)
  const playerSection = document.querySelector(".fc-player");
  if (!playerSection) return; // nothing to do

  // UI elements
  const cardStage = document.getElementById("cardStage");
  const card = document.getElementById("card");
  const cardInner = card.querySelector(".card-inner");
  const cardFront = document.getElementById("cardFront");
  const cardBack = document.getElementById("cardBack");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const knowBtn = document.getElementById("knowBtn");
  const dontKnowBtn = document.getElementById("dontKnowBtn");
  const progressText = document.getElementById("progressText");

  const shuffleBtn = document.getElementById("shuffleBtn");
  const autoplayBtn = document.getElementById("autoplayBtn");
  const studyBtn = document.getElementById("studyBtn");

  const studyGrid = document.getElementById("studyGrid");
  const scoreModal = document.getElementById("scoreModal");
  const scoreText = document.getElementById("scoreText");
  const remarkText = document.getElementById("remarkText");
  const retryBtn = document.getElementById("retryBtn");
  const backDeckBtn = document.getElementById("backDeckBtn");

  // sounds (place files at these paths)
  const SOUND_FLIP = "/assets/sounds/flip.mp3";
  const SOUND_CORRECT = "/assets/sounds/correct.mp3";
  const SOUND_WRONG = "/assets/sounds/wrong.mp3";

  const flipSound = new Audio(SOUND_FLIP);
  const correctSound = new Audio(SOUND_CORRECT);
  const wrongSound = new Audio(SOUND_WRONG);

  // controls
  let deck = [];          // array of {front, back}
  let order = [];         // indices into deck
  let index = 0;          // current index into order
  let score = {know:0, dont:0};
  let autoTimer = null;
  let autoplay = false;

  // fetch JSON path from data attribute
  const jsonPath = playerSection.dataset.json;
  if (!jsonPath) {
    console.error("Flashcards: data-json not provided.");
    return;
  }

  // load deck
  fetch(jsonPath, {cache:"no-store"})
    .then(r => {
      if (!r.ok) throw new Error("Deck not found: " + jsonPath);
      return r.json();
    })
    .then(data => {
      // data should be array of {front, back}
      deck = Array.isArray(data) ? data : [];
      if (!deck.length) throw new Error("Deck is empty.");
      order = deck.map((_, i) => i);
      renderCard();
      renderProgress();
    })
    .catch(err => {
      console.error(err);
      cardStage.innerHTML = "<div style='padding:20px;color:#333;'>Unable to load deck.</div>";
    });

  /* ---------- helpers ---------- */

  function renderCard() {
    const idx = order[index];
    const item = deck[idx];
    if (!item) return;
    cardFront.textContent = item.front;
    cardBack.textContent = item.back;
    card.classList.remove("flipped");
    // small visual reset
    cardInner.style.transition = "transform .7s cubic-bezier(.22,.8,.3,1)";
    // stop autoplay highlight when card changes
    renderProgress();
  }

  function renderProgress() {
    progressText.textContent = `${index+1} / ${order.length}`;
  }

  function flipCard(playSound = true) {
    card.classList.toggle("flipped");
    if (playSound) {
      try { flipSound.currentTime = 0; flipSound.play(); } catch(e){ /* ignore */ }
    }
  }

  function nextCard() {
    index = (index + 1) % order.length;
    renderCard();
  }
  function prevCard() {
    index = (index - 1 + order.length) % order.length;
    renderCard();
  }

  function shuffleDeck() {
    order = deck.map((_,i)=>i).sort(()=>Math.random()-0.5);
    index = 0;
    renderCard();
  }

  function startAutoPlay() {
    autoplay = true;
    autoplayBtn.classList.add("active");
    autoTimer = setInterval(() => {
      flipCard(false);
      // flip back after 2.5s then next after 3s
      setTimeout(()=> {
        if (card.classList.contains("flipped")) flipCard(false);
        nextCard();
      }, 2500);
    }, 4000);
  }

  function stopAutoPlay() {
    autoplay = false;
    autoplayBtn.classList.remove("active");
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  function enterStudyView() {
    // build cards grid
    studyGrid.innerHTML = "";
    deck.forEach((d, i)=> {
      const div = document.createElement("div");
      div.className = "study-card";
      div.innerHTML = `<div class="front">${d.front}</div><div class="back">${d.back}</div>`;
      studyGrid.appendChild(div);
    });
    studyGrid.classList.remove("hide");
    studyBtn.textContent = "Back to Player";
    // hide main player elements to show grid
    cardStage.classList.add("hide");
    document.querySelector(".fc-info").classList.add("hide");
    document.querySelector(".fc-nav").classList.add("hide");
  }

  function exitStudyView() {
    studyGrid.classList.add("hide");
    studyBtn.textContent = "Study view";
    cardStage.classList.remove("hide");
    document.querySelector(".fc-info").classList.remove("hide");
    document.querySelector(".fc-nav").classList.remove("hide");
  }

  function showScore() {
    const total = score.know + score.dont;
    scoreText.textContent = `${score.know} / ${total}`;
    const pct = total ? Math.round((score.know / total) * 100) : 0;
    let remark = "";
    if (pct === 100) remark = "🌟 Perfect! Great work!";
    else if (pct >= 80) remark = "Great job — almost perfect!";
    else if (pct >= 50) remark = "Good effort — keep practicing!";
    else remark = "Keep trying — you'll improve!";
    remarkText.textContent = remark;
    scoreModal.classList.remove("hide");
  }

  function resetScore() {
    score = {know:0, dont:0};
    index = 0;
    renderCard();
  }

  /* ---------- events ---------- */

  // flip on card click
  card.addEventListener("click", (e)=> {
    flipCard(true);
  });

  // keyboard
  document.addEventListener("keydown", (e)=>{
    if (e.key === "ArrowRight") nextCard();
    if (e.key === "ArrowLeft") prevCard();
    if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); flipCard(true); }
    if (e.key === "s") shuffleDeck();
  });

  // nav buttons
  nextBtn.addEventListener("click", ()=> nextCard());
  prevBtn.addEventListener("click", ()=> prevCard());

  // know/don't know
  knowBtn.addEventListener("click", ()=> {
    score.know++;
    // play correct sound
    try { correctSound.currentTime = 0; correctSound.play(); } catch(e){}
    // short confetti if perfect (if confetti lib available)
    try { if (window.confetti) confetti({ particleCount: 20, spread: 40, origin: { y: 0.6 } }); } catch(e){}
    // move to next or show result if last
    if (score.know + score.dont >= order.length) { showScore(); }
    else nextCard();
  });

  dontKnowBtn.addEventListener("click", ()=> {
    score.dont++;
    try { wrongSound.currentTime = 0; wrongSound.play(); } catch(e){}
    if (score.know + score.dont >= order.length) { showScore(); }
    else nextCard();
  });

  // shuffle
  shuffleBtn.addEventListener("click", ()=> {
    shuffleDeck();
  });

  // autoplay
  autoplayBtn.addEventListener("click", ()=> {
    if (!autoplay) startAutoPlay(); else stopAutoPlay();
  });

  // study view toggle
  studyBtn.addEventListener("click", ()=> {
    if (studyGrid.classList.contains("hide")) enterStudyView(); else exitStudyView();
  });

  // score modal actions
  retryBtn.addEventListener("click", ()=> {
    resetScore();
    scoreModal.classList.add("hide");
  });
  backDeckBtn.addEventListener("click", ()=> {
    window.location = "/flashcards/english/index.html";
  });

  // close modal if background clicked
  scoreModal.addEventListener("click", (e)=> {
    if (e.target === scoreModal) scoreModal.classList.add("hide");
  });

});
