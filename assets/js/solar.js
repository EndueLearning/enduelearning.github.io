const canvas = document.getElementById("solarCanvas");
const ctx = canvas.getContext("2d");
const infoBox = document.getElementById("infoBox");

let zoom = 1;
let speed = 1;
let paused = false;
let teacherMode = false;
let hovered = null;
let quizTarget = "Jupiter";
let showRotationAxis = false;

const center = { x: canvas.width / 2, y: canvas.height / 2 };

function loadImg(name) {
  const img = new Image();
  img.src = `/assets/images/planets/${name}.jpg`;
  return img;
}

// Enhanced planet data with realistic information
// rotationPeriod: hours to complete one rotation (day length)
// revolutionPeriod: Earth days to complete one orbit
// distanceFromSun: Million km
// diameter: 1000s of km
const planets = [
  { 
    name: "Sun", 
    size: 40, 
    img: loadImg("sun"), 
    color: "#FDB813",
    rotationPeriod: 609.12,
    revolutionPeriod: 0,
    distanceFromSun: 0,
    diameter: 1391000,
    info: "The Sun - Center of Solar System" 
  },
  { 
    name: "Mercury", 
    a: 70, 
    b: 60, 
    size: 5, 
    period: 4, 
    img: loadImg("mercury"),
    color: "#8C7853",
    rotationPeriod: 1407.6,
    revolutionPeriod: 88,
    distanceFromSun: 57.9,
    diameter: 3824,
    info: "Mercury - Closest to Sun"
  },
  { 
    name: "Venus", 
    a: 100, 
    b: 85, 
    size: 8, 
    period: 7, 
    img: loadImg("venus"),
    color: "#FFC649",
    rotationPeriod: 5832.5,
    revolutionPeriod: 225,
    distanceFromSun: 108.2,
    diameter: 12104,
    info: "Venus - Hottest Planet"
  },
  { 
    name: "Earth", 
    a: 130, 
    b: 110, 
    size: 9, 
    period: 10, 
    img: loadImg("earth"),
    color: "#4A90E2",
    rotationPeriod: 24,
    revolutionPeriod: 365.25,
    distanceFromSun: 149.6,
    diameter: 12742,
    info: "Earth - Our Home"
  },
  { 
    name: "Mars", 
    a: 160, 
    b: 135, 
    size: 7, 
    period: 15, 
    img: loadImg("mars"),
    color: "#E74C3C",
    rotationPeriod: 24.6,
    revolutionPeriod: 687,
    distanceFromSun: 227.9,
    diameter: 6779,
    info: "Mars - The Red Planet"
  },
  { 
    name: "Jupiter", 
    a: 210, 
    b: 180, 
    size: 18, 
    period: 25, 
    img: loadImg("jupiter"),
    color: "#C88B3A",
    rotationPeriod: 9.9,
    revolutionPeriod: 4333,
    distanceFromSun: 778.5,
    diameter: 139820,
    info: "Jupiter - Gas Giant"
  },
  { 
    name: "Saturn", 
    a: 250, 
    b: 210, 
    size: 16, 
    period: 30, 
    img: loadImg("saturn"), 
    color: "#FAD5A5",
    rotationPeriod: 10.7,
    revolutionPeriod: 10759,
    distanceFromSun: 1434.0,
    diameter: 116460,
    rings: true,
    info: "Saturn - Ringed Beauty"
  },
  { 
    name: "Uranus", 
    a: 290, 
    b: 245, 
    size: 12, 
    period: 35, 
    img: loadImg("uranus"),
    color: "#4FD0E7",
    rotationPeriod: 17.2,
    revolutionPeriod: 30688,
    distanceFromSun: 2871.0,
    diameter: 50724,
    info: "Uranus - Ice Giant"
  },
  { 
    name: "Neptune", 
    a: 330, 
    b: 280, 
    size: 12, 
    period: 40, 
    img: loadImg("neptune"),
    color: "#4166F5",
    rotationPeriod: 16.1,
    revolutionPeriod: 60182,
    distanceFromSun: 4495.1,
    diameter: 49244,
    info: "Neptune - Windiest Planet"
  }
];

planets.forEach(p => p.angle = Math.random() * Math.PI * 2);
planets.forEach(p => p.rotationAngle = Math.random() * Math.PI * 2);

/* Asteroid Belt */
const asteroids = Array.from({ length: 200 }, () => ({
  angle: Math.random() * Math.PI * 2,
  radius: 185 + Math.random() * 20
}));

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utter);
}

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toFixed(2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background stars
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 100; i++) {
    const x = (i * 137) % canvas.width;
    const y = (i * 241) % canvas.height;
    ctx.fillRect(x, y, 0.5, 0.5);
  }

  // Orbits with labels for teacher mode
  planets.forEach((p, idx) => {
    if (!p.a) return;
    ctx.strokeStyle = hovered === p ? "#fff" : "rgba(255,255,255,0.15)";
    ctx.lineWidth = hovered === p ? 2 : 1;
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, p.a * zoom, p.b * zoom, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Show orbit period in teacher mode
    if (teacherMode) {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "10px Arial";
      const labelRadius = p.a * zoom + 15;
      const labelX = center.x + Math.cos(0) * labelRadius;
      const labelY = center.y + Math.sin(0) * labelRadius;
      ctx.fillText(`${p.revolutionPeriod}d`, labelX, labelY);
    }
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
      if (!paused) {
        p.angle += 0.01 * speed / p.period;
        p.rotationAngle += 0.05 * speed / (p.rotationPeriod || 1);
      }
    } else {
      if (!paused) p.rotationAngle += 0.05 * speed / (p.rotationPeriod || 1);
    }

    p.x = x;
    p.y = y;

    // Draw planet
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, p.size * zoom, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(p.img, x - p.size * zoom, y - p.size * zoom, p.size * 2 * zoom, p.size * 2 * zoom);
    ctx.restore();

    // Draw rotation visualization (stripes) for hovered/teacher mode
    if ((teacherMode || hovered === p) && p.a) {
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      // Draw rotation indicator lines
      for (let i = 0; i < 4; i++) {
        const angle = p.rotationAngle + (i * Math.PI / 2);
        const x1 = x + Math.cos(angle) * p.size * zoom * 0.7;
        const y1 = y + Math.sin(angle) * p.size * zoom * 0.7;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Rings (Saturn)
    if (p.rings) {
      ctx.strokeStyle = "rgba(200,200,200,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x, y, p.size * 1.6 * zoom, p.size * 0.8 * zoom, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Planet labels
    if (teacherMode || hovered === p) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px Arial";
      ctx.fillText(p.name, x + 10, y - 12);

      // Show rotation axis in teacher mode
      if (teacherMode && p.a) {
        ctx.strokeStyle = "rgba(100,200,255,0.5)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(x - p.size * zoom * 1.2, y);
        ctx.lineTo(x + p.size * zoom * 1.2, y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  });

  // Teacher mode legend
  if (teacherMode) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(10, 10, 280, 120);
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.fillText("📚 TEACHER MODE", 20, 30);
    ctx.fillText("• Dashed line = Rotation axis", 20, 50);
    ctx.fillText("• Stripes on planet = Rotation", 20, 70);
    ctx.fillText("• Planet moves on ellipse = Revolution", 20, 90);
    ctx.fillText("• Numbers = Revolution period (days)", 20, 110);
  }

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
    let html = `<b>${hovered.name}</b><br><hr style="border:none;border-top:1px solid #555;margin:5px 0;">`;
    
    if (hovered.name !== "Sun") {
      html += `<span class="info-item">🌍 Revolution: <strong>${hovered.revolutionPeriod} days</strong></span><br>`;
    }
    
    html += `<span class="info-item">🔄 Rotation: <strong>${hovered.rotationPeriod} hours</strong></span><br>`;
    
    if (hovered.distanceFromSun > 0) {
      html += `<span class="info-item">📏 Distance: <strong>${hovered.distanceFromSun} M km</strong></span><br>`;
    }
    
    html += `<span class="info-item">⭕ Diameter: <strong>${formatNumber(hovered.diameter)} km</strong></span>`;
    
    infoBox.innerHTML = html;
  } else {
    infoBox.style.display = "none";
  }
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
document.getElementById("teacheBtn").onclick = () => teacherMode = !teacherMode;
document.getElementById("speedControl").oninput = e => speed = e.target.value;

draw();
