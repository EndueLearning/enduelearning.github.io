/* ===========================
   FOOTER LOADER + LOGIC
=========================== */

document.addEventListener("DOMContentLoaded", () => {

  /* Lazy-load footer */
  fetch("/components/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer").innerHTML = html;
      initFooter();
    });

});

function initFooter() {

  /* YEAR */
  document.getElementById("yr").textContent = new Date().getFullYear();

  /* BACK TO TOP */
  const backTop = document.getElementById("backTop");
  window.addEventListener("scroll", () => {
    backTop.style.display = window.scrollY > 300 ? "block" : "none";
  });
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* VIEW COUNTER (local demo) */
  let views = localStorage.getItem("endue_views") || 0;
  views++;
  localStorage.setItem("endue_views", views);
  document.getElementById("viewCount").textContent = views;

  /* SUBSCRIBE → GOOGLE SHEETS */
  document.getElementById("subscribeForm").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("subEmail").value.trim();

    fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" }
    })
    .then(() => {
      alert("Thank you for subscribing!");
      e.target.reset();
    })
    .catch(() => alert("Subscription failed. Try again."));
  });

}
