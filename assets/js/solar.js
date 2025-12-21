const canvas = document.getElementById("solarCanvas");
const ctx = canvas.getContext("2d");
const infoBox = document.getElementById("infoBox");

const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const pauseBtn = document.getElementById("pauseBtn");
const speedControl = document.getElementById("speedControl");
const toggleLabels = document.getElementById("toggleLabels");

let zoom = 1;
let paused = false;
let speedMultiplier = 1;

const AU = 80; // Scale legend: 1 AU = 80 pixels
const center = { x: canvas.width / 2, y: canvas.height / 2 };

const bodies = [
  {
    name: "Sun",
    radius: 28,
    color: ["#fff59d", "#f57f17"],
    info: "Sun | Star | Center of our Solar System",
    x: center.x,
    y: center.y
  },
  {
    name: "Mercury", a: 0.39*AU, b: 0.32*AU, size: 4, speed: 0.04,
    color: ["#cfd8dc", "#455a64"],
    info: "Mercury | Orbit: 88 days | Smallest planet"
  },
  {
    name: "Venus", a: 0.72*AU, b: 0.6*AU, size: 7, speed: 0.032,
    color: ["#f5deb3", "#c49a6c"],
    info: "Venus | Orbit: 225 days | Hottest planet"
  },
  {
    name: "Earth", a: 1*AU, b: 0.9*AU, size: 8, speed: 0.025,
    color: ["#2196f3", "#0d47a1"],
    info: "Earth | Orbit: 365 days | Our home"
  },
  {
    name: "Mars", a: 1.52*AU, b: 1.3*AU, size: 6, speed: 0.02,
    color: ["#e53935", "#6d1b1b"],
    info: "Mars | Orbit: 687 days | Red planet"
  },
  {
    name: "Jupiter", a: 5.2*AU, b: 4.8*AU, size: 16, speed: 0.012,
    color: ["#ffcc80", "#e65100"],
    rings: true,
    info: "Jupiter | Orbit: 12 years | Largest planet"
  },
  {
    name: "Saturn", a: 9.5*AU, b: 8.8*AU, size: 14, speed: 0.009,
    color: ["#ffe0b2", "#bcaaa4"],
    rings: true,
    info: "Saturn | Orbit: 29 years | Ringed planet"
  },
  {
    name: "Uranus", a: 19.2*AU, b: 18*AU, size: 10, speed: 0.006,
    color: ["#80deea", "#006064"],
    info: "Uranus | Orbit: 84 years | Sideways rotation"
  },
  {
    name: "Neptune", a: 30*AU, b: 28*AU, size: 10, speed: 0.005,
    color: ["#64b5f6", "#0d47a1"],
    info: "Neptune | Orbit: 165 years | Farthest planet"
  }
];

// Random starting positions
bodies.forEach(b => b.angle = Math.random() * Math.PI * 2);

function drawPlanet(x, y, r, colors) {
  const g = ctx.createRadialGradient(x-r/3, y-r/3, r/4, x, y, r);
  g.addColorStop(0, colors[0]);
  g.addColorStop(1, colors[1]);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fill();
}

function animate() {
  if (!paused) {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Sun
    drawPlanet(center.x, center.y, bodies[0].radius*zoom, bodies[0].color);

    bodies.slice(1).forEach(p => {
      p.angle += p.speed * speedMultiplier;

      p.x = center.x + p.a * Math.cos(p.angle) * zoom;
      p.y = center.y + p.b * Math.sin(p.angle) * zoom;

      // Orbit
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, p.a*zoom, p.b*zoom, 0, 0, Math.PI*2);
      ctx.stroke();

      // Rings
      if (p.rings) {
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, (p.size+6)*zoom, (p.size-2)*zoom, 0, 0, Math.PI*2);
        ctx.stroke();
      }

      drawPlanet(p.x, p.y, p.size*zoom, p.color);

      // Labels
      if (toggleLabels.checked) {
        ctx.fillStyle = "#fff";
        ctx.font = "12px Arial";
        ctx.fillText(p.name, p.x+5, p.y-5);
      }
    });
  }

  requestAnimationFrame(animate);
}

// Hover detection
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  let found = null;

  bodies.forEach(p => {
    const px = p.x || center.x;
    const py = p.y || center.y;
    const r = (p.radius || p.size) * zoom;

    if (Math.hypot(mx-px, my-py) < r+4) found = p;
  });

  if (found) {
    infoBox.style.display = "block";
    infoBox.innerHTML = `<strong>${found.name}</strong><br>${found.info}`;
  } else {
    infoBox.style.display = "none";
  }
});

// Controls
zoomInBtn.onclick = () => zoom *= 1.1;
zoomOutBtn.onclick = () => zoom /= 1.1;

pauseBtn.onclick = () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶ Play" : "⏸ Pause";
};

speedControl.oninput = e => speedMultiplier = e.target.value;

animate();

