// assets/js/dynamic-content.js
window.addEventListener("load", () => {
  // ✅ Wait for everything (including header/footer) to load before running
  Promise.all([
    fetch('assets/data/words.json').then(r => r.json()),
    fetch('assets/data/thoughts.json').then(r => r.json())
  ])
  .then(([words, thoughts]) => {
    const wordEl = document.getElementById('wordOfDay') || document.getElementById('home-word');
    const thoughtEl = document.getElementById('thoughtOfDay') || document.getElementById('home-thought');
    
    if (wordEl && words.length > 0) {
      wordEl.innerHTML = `<h3>${words[0].word}</h3><p>${words[0].meaning}</p>`;
    }

    if (thoughtEl && thoughts.length > 0) {
      thoughtEl.innerText = thoughts[0];
    }
  })
  .catch(err => console.error("Dynamic content load error:", err));
});
