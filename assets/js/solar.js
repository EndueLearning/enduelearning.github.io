const canvas = document.getElementById("solarCanvas");
const ctx = canvas.getContext("2d");
const infoBox = document.getElementById("infoBox");

let zoom = 1;
let speed = 1;
let paused = false;
let teacherMode = false;
let hovered = null;
let quizTarget = "Jupiter";

const center = { x: canvas.width / 2, y: canvas.height / 2 };

function loadImg(name) {
  const img = new Image();
  img.src = `/assets/images/planets/${name}.jpg`;
  return img;
}

const planets = [
  { name: "Sun", size: 40, img: loadImg("sun"), info: "Center of Solar System" },
  { name: "Mercury", a: 70, b: 60, size: 5, period: 4, img: loadImg("mercury") },
  { name: "Venus", a: 100, b: 85, size: 8, period: 7, img: loadImg("venus") },
  { name: "Earth", a: 130, b: 110, size: 9, period: 10, img: loadImg("earth") },
  { name: "Mars", a: 160, b: 135, size: 7, period: 15, img: loadImg("mars") },
  { name: "Jupiter", a: 210, b: 180, size: 18, period: 25, img: loadImg("jupiter") },
  { name: "Saturn", a: 250, b: 210, size: 16, period: 30, img: loadImg("saturn"), rings: true },
  { name: "Uranus", a: 290, b: 245, size: 12, period: 35, img: loadImg("uranus") },
  { name: "Neptune", a: 330, b: 280, size: 12, period: 40, img: loadImg("neptune") }
];

planets.forEach(p => p.angle = Math.random() * Math.PI * 2);

/* Asteroid Belt */
const asteroids = Array.from({ length: 200 }, () => ({
  angle: Math.random() * Math.PI * 2,
  radius: 185 + Math.random() * 20
}));

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utter);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Orbits
  planets.forEach(p => {
    if (!p.a) return;
    ctx.strokeStyle = hovered === p ? "#fff" : "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, p.a * zoom, p.b * zoom, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Asteroids
  ctx.fillStyle = "#888";
  asteroids.forEach(a => {
    const x = center.x + Math.cos(a.angle) * a.radius * zoom;
    const y = center.y + Math.sin(a.angle) * a.radius * zoom;
    ctx.fillRect(x, y, 2, 2);
    if (!paused) a.angle += 0.002 * speed;
  });

  // Planets
  planets.forEach(p => {
    let x = center.x, y = center.y;
    if (p.a) {
      x += Math.cos(p.angle) * p.a * zoom;
      y += Math.sin(p.angle) * p.b * zoom;
      if (!paused) p.angle += 0.01 * speed / p.period;
    }

    p.x = x; p.y = y;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, p.size * zoom, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(p.img, x - p.size * zoom, y - p.size * zoom, p.size * 2 * zoom, p.size * 2 * zoom);
    ctx.restore();

    if (p.rings) {
      ctx.strokeStyle = "rgba(200,200,200,0.6)";
      ctx.beginPath();
      ctx.ellipse(x, y, p.size * 1.6 * zoom, p.size * 0.8 * zoom, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (teacherMode || hovered === p) {
      ctx.fillStyle = "#fff";
      ctx.fillText(p.name, x + 6, y - 6);
    }
  });

  requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", e => {
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;
  hovered = null;

  planets.forEach(p => {
    if (Math.hypot(mx - p.x, my - p.y) < p.size * zoom + 5) hovered = p;
  });

  if (hovered) {
    infoBox.style.display = "block";
    infoBox.innerHTML = `<b>${hovered.name}</b>`;
  } else infoBox.style.display = "none";
});

canvas.addEventListener("click", () => {
  if (!hovered) return;

  speak(hovered.name);

  if (hovered.name === quizTarget) {
    document.getElementById("quizResult").textContent = " ✅ Correct!";
  } else {
    document.getElementById("quizResult").textContent = " ❌ Try again!";
  }
});

document.getElementById("resetBtn").onclick = () => zoom = 1;
document.getElementById("pauseBtn").onclick = () => paused = !paused;
document.getElementById("teacherBtn").onclick = () => teacherMode = !teacherMode;
document.getElementById("speedControl").oninput = e => speed = e.target.value;

draw();
