// assets/js/header.js
document.addEventListener("DOMContentLoaded", () => {
  // Detect path for GitHub Pages or local
  const baseURL = window.location.hostname.includes("github.io")
    ? `${window.location.origin}/components/header.html`
    : "components/header.html";

  fetch(baseURL)
    .then(res => res.text())
    .then(data => {
      const headerContainer = document.getElementById("header");
      if (headerContainer) {
        headerContainer.innerHTML = data;
      }
    })
    .catch(err => console.error("Header load error:", err));
});
