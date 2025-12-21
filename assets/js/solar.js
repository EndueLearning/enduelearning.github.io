const canvas = document.getElementById("solarCanvas");
const ctx = canvas.getContext("2d");
const infoBox = document.getElementById("infoBox");

const center = { x: canvas.width / 2, y: canvas.height / 2 };

let zoom = 1;
let paused = false;
let speedMultiplier = 1;
let hoveredPlanet = null;
let lockedPlanet = null;
let teacherMode = true;

const AU = 60; // 1 AU = 60 pixels (scale legend)

const planets = [
  { name:"Mercury", a:0.39, b:0.38, size:4, color:"#aaa", orbit:88, rotation:58.6, glow:"#888" },
  { name:"Venus", a:0.72, b:0.71, size:7, color:"#e1b469", orbit:225, rotation:-243, glow:"#e1b469" },
  { name:"Earth", a:1, b:0.99, size:8, color:"#3fa9f5", orbit:365, rotation:1, glow:"#3fa9f5" },
  { name:"Mars", a:1.52, b:1.51, size:6, color:"#c1440e", orbit:687, rotation:1.03, glow:"#c1440e" },
  { name:"Jupiter", a:5.2, b:5.18, size:18, color:"#d2b48c", orbit:4333, rotation:0.41, glow:"#f5deb3" },
  { name:"Saturn", a:9.5, b:9.45, size:16, color:"#deb887", orbit:10759, rotation:0.45, glow:"#deb887", rings:true },
  { name:"Uranus", a:19.2, b:19.1, size:12, color:"#7fffd4", orbit:30687, rotation:-0.72, glow:"#7fffd4" },
  { name:"Neptune", a:30, b:29.9, size:12, color:"#4169e1", orbit:60190, rotation:0.67, glow:"#4169e1" }
];

planets.forEach(p => p.angle = Math.random() * Math.PI * 2);

// ---------------- CONTROLS ----------------
zoomIn.onclick = () => zoom *= 1.1;
zoomOut.onclick = () => zoom /= 1.1;
pause.onclick = () => paused = !paused;
speed.oninput = e => speedMultiplier = e.target.value;
teacherMode.onchange = e => teacherMode = e.target.checked;

// ---------------- INTERACTION ----------------
canvas.addEventListener("click", () => {
  lockedPlanet = hoveredPlanet;
});

canvas.addEventListener("mousemove", e => {
  if (lockedPlanet) return;

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  hoveredPlanet = null;

  planets.forEach(p => {
    const a = p.a * AU * zoom;
    const b = p.b * AU * zoom;

    const dx = (mx - center.x) / a;
    const dy = (my - center.y) / b;
    const ellipseCheck = dx*dx + dy*dy;

    if (ellipseCheck > 0.95 && ellipseCheck < 1.05) hoveredPlanet = p;

    const px = center.x + a * Math.cos(p.angle);
    const py = center.y + b * Math.sin(p.angle);

    if (Math.hypot(mx - px, my - py) < p.size * zoom + 4) hoveredPlanet = p;
  });
});

// ---------------- DRAW LOOP ----------------
function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // Sun
  ctx.beginPath();
  ctx.arc(center.x, center.y, 25*zoom, 0, Math.PI*2);
  ctx.fillStyle = "yellow";
  ctx.fill();

  planets.forEach(p => {
    const a = p.a * AU * zoom;
    const b = p.b * AU * zoom;

    // Orbit
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, a, b, 0, 0, Math.PI*2);
    ctx.strokeStyle = (hoveredPlanet===p || lockedPlanet===p) ? p.glow : "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (!paused) p.angle += (2*Math.PI / p.orbit) * speedMultiplier * 0.5;

    const x = center.x + a * Math.cos(p.angle);
    const y = center.y + b * Math.sin(p.angle);

    // Planet
    ctx.beginPath();
    ctx.arc(x, y, p.size*zoom, 0, Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.fill();

    // Saturn Rings
    if (p.rings) {
      ctx.beginPath();
      ctx.ellipse(x, y, p.size*zoom*1.8, p.size*zoom*0.8, 0, 0, Math.PI*2);
      ctx.strokeStyle = "#c2b280";
      ctx.stroke();
    }

// Label logic (corrected)
if (
  teacherMode ||
  (!teacherMode && (hoveredPlanet === p || lockedPlanet === p))
) {
  ctx.fillStyle = "white";
  ctx.font = "12px Arial";
  ctx.fillText(p.name, x + 8, y - 8);
}

    p.x = x;
    p.y = y;
  });

  // Info Box
  const target = lockedPlanet || hoveredPlanet;
  if (target) {
    infoBox.style.display = "block";
    infoBox.innerHTML = `
      <h3>${target.name}</h3>
      <p><b>Distance:</b> ${target.a} AU</p>
      <p><b>Orbit:</b> ${target.orbit} Earth days</p>
      <p><b>Rotation:</b> ${target.rotation} days</p>
    `;
  } else infoBox.style.display = "none";

  // Scale Legend
  ctx.fillStyle = "white";
  ctx.fillText("Scale: 1 AU ≈ 60 pixels", 20, canvas.height-20);

  requestAnimationFrame(draw);
}

draw();
