// ✅ header.js
document.addEventListener("DOMContentLoaded", () => {
  const pathPrefix = window.location.pathname.includes("/components/")
    ? "" 
    : window.location.pathname.includes("/") 
    ? "./" 
    : "";

  fetch(`${pathPrefix}components/header.html`)
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
