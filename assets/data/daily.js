// assets/js/daily.js

document.addEventListener("DOMContentLoaded", function () {
  // Calculate daily index based on date
  const today = new Date();
  const dayIndex = today.getDate() % wordsLibrary.length;
  const thoughtIndex = today.getDate() % thoughtsLibrary.length;

  // Pick today's word & thought
  const todayWord = wordsLibrary[dayIndex];
  const todayThought = thoughtsLibrary[thoughtIndex];

  // Update DOM elements
  document.getElementById("word-of-day").innerHTML = `
    <strong>${todayWord.word}</strong>: ${todayWord.meaning}
  `;

  document.getElementById("thought-of-day").textContent = todayThought;
});
