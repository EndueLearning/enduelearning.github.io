/* ======================
   Dynamic Footer Loader
   ====================== */

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("footer").innerHTML = `
  
  <!-- Wave SVG -->
  <div class="footer-wave">
    <svg viewBox="0 0 1440 320">
      <path fill="#0A2640" 
            d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,186.7C840,171,960,117,1080,122.7C1200,128,1320,192,1380,224L1440,256V0H0Z">
      </path>
    </svg>
  </div>

  <footer class="site-footer fade-in">

    <div class="footer-grid">

      <!-- Column 1 -->
      <div class="footer-col">
        <img src="/assets/images/mascot_footer.png" class="footer-mascot" alt="Mascot">
        <h3>Endue Learning</h3>
        <p>Fun learning anywhere — worksheets, games, activities & simulations for kids.</p>

        <button id="themeToggle" class="theme-toggle">
          🌙 Dark Mode
        </button>
      </div>

      <!-- Column 2 -->
      <div class="footer-col">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/index.html">Home</a></li>
          <li><a href="/activities.html">Activities</a></li>
          <li><a href="/worksheets.html">Worksheets</a></li>
          <li><a href="/games.html">Games</a></li>
          <li><a href="/simulations/index.html">Simulations</a></li>
          <li><a href="/games/quizsets/">Quiz Sets</a></li>
        </ul>

        <h3 style="margin-top:18px;">Follow Us</h3>
        <div class="social-row">
          <a href="https://www.youtube.com/@enduelearning" aria-label="YouTube">
            <svg viewBox="0 0 576 512"><path fill="currentColor" d="M549.6 124.1c..."></path></svg>
          </a>
          <a href="https://www.instagram.com/enduelearning/" aria-label="Instagram">
            <svg viewBox="0 0 448 512"><path fill="currentColor" d="M224 202.7c..."></path></svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg viewBox="0 0 512 512"><path fill="currentColor" d="M459.4 151.7c..."></path></svg>
          </a>
        </div>
      </div>

      <!-- Column 3 -->
      <div class="footer-col">
        <h3>Contact Us</h3>
        <p>Email: <a href="mailto:enduelearning@gmail.com">enduelearning@gmail.com</a></p>

        <h3 style="margin-top:18px;">Subscribe</h3>
        <form id="subscribeForm">
          <input type="email" id="subEmail" placeholder="Your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>

    </div>

    <div class="copyright">
      © <span id="yr"></span> Endue Learning — All rights reserved.
    </div>

    <button id="backTop" class="back-top">↑</button>

  </footer>
  `;

  /* YEAR */
  document.getElementById("yr").innerText = new Date().getFullYear();

  /* SUBSCRIBE */
  const form = document.getElementById("subscribeForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const em = document.getElementById("subEmail").value.trim();
    if (!em) return alert("Please enter a valid email.");
    alert("Thank you for subscribing!");
    form.reset();
  });

  /* BACK TO TOP */
  document.getElementById("backTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* DARK MODE TOGGLE */
  const btn = document.getElementById("themeToggle");
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    btn.textContent = document.body.classList.contains("dark-mode")
      ? "☀ Light Mode"
      : "🌙 Dark Mode";
  });

});
