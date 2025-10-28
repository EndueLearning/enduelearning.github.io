// assets/js/footer.js
document.addEventListener("DOMContentLoaded", () => {
  const baseURL = window.location.hostname.includes("github.io")
    ? `${window.location.origin}/components/footer.html`
    : "components/footer.html";

  fetch(baseURL)
    .then(res => res.text())
    .then(data => {
      const footerContainer = document.getElementById("footer");
      if (footerContainer) footerContainer.innerHTML = data;
    })
    .catch(err => console.error("Footer load error:", err));
});
