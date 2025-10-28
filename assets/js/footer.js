// ✅ footer.js
document.addEventListener("DOMContentLoaded", () => {
  const pathPrefix = window.location.pathname.includes("/components/")
    ? ""
    : window.location.pathname.includes("/")
    ? "./"
    : "";

  fetch(`${pathPrefix}components/footer.html`)
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch(err => console.error("Footer load error:", err));
});
