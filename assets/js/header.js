document.addEventListener("DOMContentLoaded", () => {
  fetch("components/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
      const menuToggle = document.getElementById("menuToggle");
      const navMenu = document.getElementById("navMenu");
      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
      });
    })
    .catch(err => console.error("Header load error:", err));
});
