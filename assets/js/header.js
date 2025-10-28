// assets/js/header.js
document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header");

  // Dynamically load header HTML
  fetch("components/header.html")
    .then(res => res.text())
    .then(data => {
      headerContainer.innerHTML = data;

      // Once loaded, attach mobile toggle logic
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
