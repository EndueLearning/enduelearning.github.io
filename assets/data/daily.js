// assets/js/daily.js
// Picks a random word and thought daily from the library

document.addEventListener("DOMContentLoaded", () => {
  const wordDisplay = document.getElementById("word-of-day");
  const thoughtDisplay = document.getElementById("thought-of-day");

  if (!wordDisplay || !thoughtDisplay) return;

  // Get today's date number (so same word for everyone that day)
  const daySeed = new Date().getDate();

  // Pick word & thought based on date index
  const wordData = wordLibrary[daySeed % wordLibrary.length];
  const thoughtData = thoughtLibrary[daySeed % thoughtLibrary.length];

  // Display content
  wordDisplay.innerHTML = `<strong>${wordData.word}</strong><br>${wordData.meaning}`;
  thoughtDisplay.textContent = thoughtData;
});
