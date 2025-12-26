document.addEventListener("DOMContentLoaded", () => {

  fetch("/components/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer").innerHTML = html;

      // Year
      document.getElementById("footerYear").textContent =
        new Date().getFullYear();

      // Subscribe
      const form = document.getElementById("subscribeForm");
      form.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("subEmail").value.trim();
        if (!email) return alert("Please enter a valid email");
        alert("Thank you for subscribing!");
        form.reset();
      });

      // Back to top
      const btn = document.getElementById("backTop");
      window.addEventListener("scroll", () => {
        btn.style.display = window.scrollY > 300 ? "block" : "none";
      });
      btn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      );
    });

});
