// assets/js/header.js
document.addEventListener("DOMContentLoaded", () => {
  // Automatically detect correct path for GitHub Pages or local
  const basePath = window.location.hostname.includes("github.io")
    ? `${window.location.origin}/components/header.html`
    : "components/header.html";

  fetch(basePath)
    .then(res => res.text())
    .then(data => {
      const headerEl = document.getElementById("header");
      if (headerEl) headerEl.innerHTML = data;

      // Mobile toggle after header is loaded
      const toggle = document.getElementById("menuToggle");
      const nav = document.getElementById("navLinks");
      if (toggle && nav) {
        toggle.addEventListener("click", () => {
          nav.classList.toggle("active");
        });
      }
    })
    .catch(err => console.error("Header load error:", err));
});
