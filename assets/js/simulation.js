// simulation.js — lightweight animated ray simulator
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('simCanvas');
  const ctx = canvas.getContext('2d');
  const tabs = document.querySelectorAll('.tab');
  const focal = document.getElementById('focal');
  const objectDist = document.getElementById('objectDist');
  const animateToggle = document.getElementById('animateToggle');
  const formulaText = document.getElementById('formulaText');

  let topic = 'concave-mirror';
  let animFrame = null;
  let t = 0;

  const centerX = canvas.width/2;
  const centerY = canvas.height/2;

  function setTopic(newTopic) {
    topic = newTopic;
    tabs.forEach(b => b.classList.toggle('active', b.dataset.topic === topic));
    updateFormula();
    draw(); // immediate draw
  }

  tabs.forEach(b => b.addEventListener('click', () => setTopic(b.dataset.topic)));

  function updateFormula(){
    const f = Number(focal.value);
    let html = '';
    switch(topic){
      case 'concave-mirror':
        html = `<div class="formula">Mirror formula: 1/f = 1/v + 1/u<br/>f = ${f} px (scale)</div>`;
        break;
      case 'convex-mirror':
        html = `<div class="formula">Mirror formula (signs): 1/f = 1/v + 1/u (f negative for convex)</div>`;
        break;
      case 'convex-lens':
        html = `<div class="formula">Lens formula: 1/f = 1/v - 1/u<br/>f = ${f} px (scale)</div>`;
        break;
      case 'concave-lens':
        html = `<div class="formula">Lens formula (signs): 1/f = 1/v - 1/u (f negative for concave lens)</div>`;
        break;
    }
    formulaText.innerHTML = html;
  }

  function clear() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  function drawAxis(){
    ctx.strokeStyle = '#cfe6ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
  }

  function drawMirrorOrLens(){
    const f = Number(focal.value);
    ctx.lineWidth = 3;
    if(topic === 'concave-mirror' || topic === 'convex-mirror') {
      // draw mirror as arc
      ctx.strokeStyle = '#333';
      ctx.beginPath();
      const sign = topic === 'concave-mirror' ? 1 : -1;
      const radius = 120;
      ctx.arc(centerX, centerY, radius, Math.PI/2 - 1.2*sign, Math.PI*3/2 + 1.2*sign, sign>0);
      ctx.stroke();

      // pole and center markers
      ctx.fillStyle = '#333';
      ctx.fillRect(centerX-2, centerY-2,4,4);
      ctx.fillText('P', centerX+6, centerY+4);
    } else {
      // draw lens as two arcs
      ctx.strokeStyle = '#333';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 40, 140, 0, 0, 2*Math.PI);
      ctx.stroke();
      ctx.fillText('O', centerX-6, centerY+4);
    }

    // mark focal points on axis
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath();
    ctx.arc(centerX + f, centerY, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX - f, centerY, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#444';
    ctx.fillText('F', centerX + f + 6, centerY+4);
    ctx.fillText("F'", centerX - f - 26, centerY+4);
  }

  function drawRay(x0,y0, x1,y1, glow=false){
    ctx.save();
    if(glow){
      ctx.shadowColor = 'rgba(255,215,0,0.8)';
      ctx.shadowBlur = 18;
    }
    ctx.strokeStyle = glow ? '#ffd54f' : '#ffb74d';
    ctx.lineWidth = glow?2.5:1.6;
    ctx.beginPath();
    ctx.moveTo(x0,y0);
    ctx.lineTo(x1,y1);
    ctx.stroke();
    ctx.restore();
  }

  function animate(){
    t += 1;
    clear();
    drawAxis();
    drawMirrorOrLens();

    const u = Number(objectDist.value); // in px
    const f = Number(focal.value);
    const objX = centerX - u; // object position on axis
    const objY = centerY - 80;

    // draw object
    ctx.fillStyle = '#2b7';
    ctx.beginPath();
    ctx.moveTo(objX, objY);
    ctx.lineTo(objX-10, objY+30);
    ctx.lineTo(objX+10, objY+30);
    ctx.closePath();
    ctx.fill();
    ctx.fillText('Object', objX-30, objY-50);

    // produce 3 rays: parallel, center, focus
    // vary phase for animation
    const phase = (t%120)/120;

    // Ray 1: parallel -> through focus (for concave mirror or lens behavior)
    const start1x = objX; const start1y = objY;
    const mid1x = centerX; const mid1y = objY;
    // after interaction, rays go to focus or behave per topic:

    if(topic === 'concave-mirror'){
      // reflected to focus (right side)
      drawRay(start1x,start1y, mid1x,mid1y, true);
      // animate last segment with slight motion
      const end1x = centerX + f + 30 * Math.sin(2*Math.PI*phase);
      const end1y = centerY;
      drawRay(mid1x,mid1y, end1x,end1y, false);
    } else if(topic === 'convex-mirror'){
      // parallel ray reflects as if coming from virtual focus left
      drawRay(start1x,start1y, mid1x,mid1y, true);
      const end1x = centerX + 50;
      drawRay(mid1x,mid1y, end1x, centerY - 40, false);
      // dashed virtual back-prolongation
      ctx.setLineDash([6,6]);
      ctx.strokeStyle = '#ffcc66';
      ctx.beginPath();
      ctx.moveTo(mid1x, centerY - 40);
      ctx.lineTo(centerX - f, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if(topic === 'convex-lens'){
      // refracted through focus (right side)
      drawRay(start1x,start1y, centerX, start1y, true);
      drawRay(centerX, start1y, centerX + f + 20 * Math.cos(2*Math.PI*phase), centerY, false);
    } else { // concave-lens
      drawRay(start1x,start1y, centerX, start1y, true);
      // diverging after lens
      drawRay(centerX, start1y, centerX + 80, start1y - 30, false);
      // show virtual extension back
      ctx.setLineDash([6,6]);
      ctx.beginPath();
      ctx.moveTo(centerX + 80, start1y - 30);
      ctx.lineTo(centerX - f, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Ray 2: through center (or undeviated for lens)
    if(topic.includes('lens')){
      drawRay(objX-6,objY+10, centerX + 20, centerY - 10, true);
      drawRay(centerX + 20, centerY -10, centerX + 150, centerY - 10 * Math.cos(phase*2), false);
    } else {
      drawRay(objX-6,objY+10, centerX, centerY - 10, true);
      // reflect back
      drawRay(centerX, centerY - 10, centerX + f + 30 * Math.sin(phase*2), centerY, false);
    }

    // Ray 3: via focus -> parallel
    if(topic === 'concave-mirror' || topic === 'convex-lens'){
      drawRay(centerX - f, centerY, objX, objY, true);
      drawRay(centerX - f, centerY, centerX + 300 * Math.cos(phase), centerY + 20, false);
    }

    if(animateToggle.checked) animFrame = requestAnimationFrame(animate);
  }

  function draw() {
    if(animFrame) cancelAnimationFrame(animFrame);
    animate();
  }

  // event listeners
  focal.addEventListener('input', () => { updateFormula(); draw(); });
  objectDist.addEventListener('input', draw);
  animateToggle.addEventListener('change', () => { if(animateToggle.checked) animate(); else cancelAnimationFrame(animFrame); });

  // init
  setTopic(topic);
  draw();
});
