// footer.js - loads footer
document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.getElementById("footer");
  if (!footerContainer) return;
  const fetchUrl = window.location.hostname.includes("github.io")
    ? `${window.location.origin}${window.location.pathname.split('/').filter(Boolean)[0] ? '/' + window.location.pathname.split('/').filter(Boolean)[0] : ''}/components/footer.html`
    : 'components/footer.html';
  fetch(fetchUrl).then(r=>r.text()).then(html=> footerContainer.innerHTML = html).catch(e=>console.error('Footer load error', e));
});
