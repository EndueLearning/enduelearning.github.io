// Improved Ray Diagram Simulation
(function () {

const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

const modeSel = document.getElementById("modeSelect");
const objSlider = document.getElementById("objDist");
const fSlider = document.getElementById("focalLen");

const objVal = document.getElementById("objVal");
const fVal = document.getElementById("fVal");
const details = document.getElementById("details");

function draw() {
  const mode = modeSel.value;
  const u = -parseFloat(objSlider.value);
  const f = parseFloat(fSlider.value);

  objVal.textContent = Math.abs(u);
  fVal.textContent = f;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const mid = canvas.height / 2;
  const pole = canvas.width / 2;

  // Principal axis
  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(canvas.width, mid);
  ctx.strokeStyle = "#000";
  ctx.stroke();

  // Draw mirror or lens
  if (mode === "concave") {
    ctx.beginPath();
    ctx.arc(pole, mid, 60, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.stroke();
  } else {
    ctx.strokeRect(pole - 4, mid - 60, 8, 120);
  }

  // Mark F & 2F
  ctx.fillText("F", pole - f, mid - 10);
  ctx.fillText("2F", pole - 2 * f, mid - 10);

  // Object
  const objX = pole + u;
  ctx.beginPath();
  ctx.moveTo(objX, mid);
  ctx.lineTo(objX, mid - 60);
  ctx.strokeStyle = "green";
  ctx.stroke();
  ctx.fillText("Object", objX - 20, mid - 70);

  // Mirror/Lens formula
  const v = (f * u) / (u - f);
  const imgX = pole + v;

  const m = (v / u);
  const imgH = -60 * m;

  const isReal = (mode === "concave") ? (v < 0) : true;

  // Draw image
  ctx.beginPath();
  ctx.moveTo(imgX, mid);
  ctx.lineTo(imgX, mid - imgH);
  ctx.strokeStyle = isReal ? "red" : "blue";
  ctx.setLineDash(isReal ? [] : [5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillText("Image", imgX - 20, mid - imgH - 10);

  // Details
  details.innerHTML = `
    <h3>Image Details</h3>
    <p><strong>Object Distance (u):</strong> ${Math.abs(u)} cm</p>
    <p><strong>Image Distance (v):</strong> ${Math.abs(v.toFixed(2))} cm</p>
    <p><strong>Magnification (m = v/u):</strong> ${m.toFixed(2)}</p>
    <p><strong>Image Type:</strong> ${isReal ? "Real & Inverted" : "Virtual & Erect"}</p>
    <p><strong>Formula Used:</strong> 1/f = 1/v + 1/u</p>
  `;
}

objSlider.addEventListener("input", draw);
fSlider.addEventListener("input", draw);
modeSel.addEventListener("change", draw);

draw();

})();
