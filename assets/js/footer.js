// assets/js/footer.js
document.addEventListener("DOMContentLoaded", function() {
  fetch('/components/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer').innerHTML = data;
    })
    .catch(error => console.error('Footer load error:', error));
});
