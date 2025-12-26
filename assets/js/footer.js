// assets/js/footer.js
document.addEventListener("DOMContentLoaded", async () => {
  const footerContainer = document.getElementById("footer");
  if (!footerContainer) return;

  // Load footer.html
  const res = await fetch("/components/footer.html");
  const html = await res.text();
  footerContainer.innerHTML = html;

  /* YEAR */
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* BACK TO TOP */
  const topBtn = document.getElementById("backToTop");
  if (topBtn) {
    window.addEventListener("scroll", () => {
      topBtn.classList.toggle("visible", window.scrollY > 300);
    });
    topBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* SUBSCRIBE */
  const form = document.getElementById("subscribeForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("subEmail").value.trim();
      if (!email) return alert("Enter a valid email");
      alert("Thank you for subscribing!");
      form.reset();
    });
  }
});
