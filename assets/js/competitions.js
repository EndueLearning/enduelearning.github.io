// assets/js/competitions.js
document.addEventListener('DOMContentLoaded', () => {
  const comps = [
    { name: "International Math Olympiad (IMO)", link: "https://www.imo-official.org/" },
    { name: "National Science Olympiad (NSO)", link: "https://www.example.com/nso" },
    { name: "KVPY", link: "https://www.kvpy.iisc.ac.in/" },
    { name: "Google Code-in / Code Jam", link: "https://codingcompetitions.withgoogle.com/" },
    { name: "Young Innovators Challenge", link: "#" }
  ];

  const ul = document.getElementById('competitions-list');
  if (!ul) return;
  ul.innerHTML = comps.map(c => `<li><a href="${c.link}" target="_blank" rel="noopener noreferrer">${c.name}</a></li>`).join('');
});
