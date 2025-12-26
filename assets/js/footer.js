document.addEventListener("DOMContentLoaded", () => {

  const footerHolder = document.getElementById("footer");
  if (!footerHolder) return;

  fetch("/components/footer.html")
    .then(res => res.text())
    .then(html => {
      footerHolder.innerHTML = html;

      /* Year */
      const yr = document.getElementById("yr");
      if (yr) yr.textContent = new Date().getFullYear();

      /* Subscribe (Google Sheets ready) */
      const form = document.getElementById("subscribeForm");
      if (form) {
        form.addEventListener("submit", e => {
          e.preventDefault();
          const email = document.getElementById("subEmail").value.trim();
          if (!email) return alert("Enter a valid email");

          // 👉 Replace with Google Apps Script URL
          fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
            method: "POST",
            body: new URLSearchParams({ email })
          }).then(() => {
            alert("Thank you for subscribing!");
            form.reset();
          }).catch(() => {
            alert("Saved locally. Will sync later.");
          });
        });
      }
    });
});

/* ===============================
   BACK TO TOP FUNCTIONALITY
================================ */

const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
