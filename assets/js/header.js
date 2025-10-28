// assets/js/header.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;

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
