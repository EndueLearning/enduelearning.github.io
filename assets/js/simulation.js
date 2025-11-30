// Physics Ray Diagram Simulation
(function() {

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
  const u = -parseFloat(objSlider.value);  // object distance
  const f = parseFloat(fSlider.value);     // focal length

  objVal.textContent = Math.abs(u);
  fVal.textContent = f;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const mid = canvas.height / 2;
  const pole = canvas.width / 2;

  // Draw principal axis
  ctx.beginPath();
  ctx.moveTo(0, mid);
  ctx.lineTo(canvas.width, mid);
  ctx.strokeStyle = "black";
  ctx.stroke();

  // Draw mirror/lens
  if (mode === "concave") {
    ctx.beginPath();
    ctx.arc(pole, mid, 80, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.strokeStyle = "black";
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(pole - 5, mid - 80);
    ctx.lineTo(pole + 5, mid - 80);
    ctx.lineTo(pole + 5, mid + 80);
    ctx.lineTo(pole - 5, mid + 80);
    ctx.closePath();
    ctx.stroke();
  }

  // Mark F & C or 2F
  ctx.fillText("F", pole - f, mid - 5);
  ctx.fillText("2F", pole - 2*f, mid - 5);

  // Draw object
  const objX = pole + u;
  ctx.beginPath();
  ctx.moveTo(objX, mid);
  ctx.lineTo(objX, mid - 80);
  ctx.strokeStyle = "green";
  ctx.stroke();
  ctx.fillText("Object", objX - 15, mid - 90);

  // Calculate image distance using mirror/lens formula
  // 1/f = 1/v + 1/u  => v = (fu)/(u - f)
  const v = (f * u) / (u - f);

  const imgX = pole + v;

  let isReal = (mode === "concave") ? (v < 0) : (u !== f);
  let magnification = v / u;
  let imgH = -80 * magnification;

  // Draw image
  ctx.beginPath();
  ctx.moveTo(imgX, mid);
  ctx.lineTo(imgX, mid - imgH);
  ctx.strokeStyle = isReal ? "red" : "blue";
  ctx.setLineDash(isReal ? [] : [6, 5]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillText("Image", imgX - 10, mid - imgH - 10);

  // Show details
  details.innerHTML = `
    <h3>Image Details</h3>
    <p><strong>Object Distance (u):</strong> ${Math.abs(u)} cm</p>
    <p><strong>Image Distance (v):</strong> ${Math.abs(v.toFixed(2))} cm</p>
    <p><strong>Magnification (m = v/u):</strong> ${magnification.toFixed(2)}</p>
    <p><strong>Image Nature:</strong> ${isReal ? "Real & Inverted" : "Virtual & Erect"}</p>
    <p><strong>Formula Used:</strong> 1/f = 1/v + 1/u</p>
  `;
}

objSlider.addEventListener("input", draw);
fSlider.addEventListener("input", draw);
modeSel.addEventListener("change", draw);

draw();

})();
