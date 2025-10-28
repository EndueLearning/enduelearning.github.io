// assets/js/footer.js
document.addEventListener("DOMContentLoaded", () => {
  const basePath = window.location.hostname.includes("github.io")
    ? `${window.location.origin}/components/footer.html`
    : "components/footer.html";

  fetch(basePath)
    .then(res => res.text())
    .then(data => {
      const footerEl = document.getElementById("footer");
      if (footerEl) footerEl.innerHTML = data;
    })
    .catch(err => console.error("Footer load error:", err));
});
