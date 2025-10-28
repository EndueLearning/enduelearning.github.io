// assets/js/footer.js
document.addEventListener("DOMContentLoaded", async () => {
  const footer = document.getElementById("footer");
  if (!footer) return;

  try {
    const res = await fetch("components/footer.html");
    if (!res.ok) throw new Error("Footer not found");
    footer.innerHTML = await res.text();
  } catch (err) {
    console.error("Footer load error:", err);
  }
});
