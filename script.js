const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const centerY = canvas.height / 2;
const mirrorX = 700;

const focusSlider = document.getElementById('focusSlider');
const objectXSlider = document.getElementById('objectXSlider');
const objectHeightSlider = document.getElementById('objectHeightSlider');

const focusInput = document.getElementById('focusInput');
const objectXInput = document.getElementById('objectXInput');
const objectHeightInput = document.getElementById('objectHeightInput');

const infoDistance = document.getElementById("imageDistance");
const infoHeight = document.getElementById("imageHeight");

function drawScene(focus, objectX, objectHeight) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sumbu utama
  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.strokeStyle = "black";
  ctx.stroke();

  // Cermin cekung
  ctx.beginPath();
  ctx.arc(mirrorX + focus, centerY, focus, Math.PI * 1.5, Math.PI * 0.5, true);
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Garis vertikal cermin
  ctx.beginPath();
  ctx.moveTo(mirrorX, centerY - 150);
  ctx.lineTo(mirrorX, centerY + 150);
  ctx.strokeStyle = "gray";
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Fokus
  ctx.fillStyle = "black";
  ctx.fillText("F", mirrorX - focus - 10, centerY + 15);
  ctx.beginPath();
  ctx.arc(mirrorX - focus, centerY, 3, 0, 2 * Math.PI);
  ctx.fill();

  // Objek (panah hijau)
  ctx.beginPath();
  ctx.moveTo(objectX, centerY);
  ctx.lineTo(objectX, centerY - objectHeight);
  ctx.lineTo(objectX - 5, centerY - objectHeight + 10);
  ctx.moveTo(objectX, centerY - objectHeight);
  ctx.lineTo(objectX + 5, centerY - objectHeight + 10);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillText("Objek", objectX - 20, centerY - objectHeight - 10);

  // Sinar sejajar → pantul ke fokus
  ctx.beginPath();
  ctx.moveTo(objectX, centerY - objectHeight);
  ctx.lineTo(mirrorX, centerY - objectHeight);
  ctx.strokeStyle = "orange";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(mirrorX, centerY - objectHeight);
  ctx.lineTo(mirrorX - focus, centerY);
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Sinar ke fokus → pantul sejajar
  ctx.beginPath();
  ctx.moveTo(objectX, centerY - objectHeight);
  ctx.lineTo(mirrorX - focus, centerY);
  ctx.strokeStyle = "orange";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(mirrorX, centerY);
  ctx.lineTo(mirrorX - 150, centerY);
  ctx.setLineDash([5, 5]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Bayangan
  const distance = mirrorX - objectX;
  const imageX = 1 / (1 / focus - 1 / distance);  // rumus cermin: 1/f = 1/s + 1/s'
  const realImageX = mirrorX - imageX;
  const magnification = imageX / distance;
  const imageHeight = -objectHeight * magnification;

  // Update tampilan informasi
  infoDistance.textContent = distance.toFixed(2);
  infoHeight.textContent = imageHeight.toFixed(2);

  ctx.beginPath();
  ctx.moveTo(realImageX, centerY);
  ctx.lineTo(realImageX, centerY - imageHeight);

  // Ujung panah bayangan
  if (imageHeight < 0) {
    // Terbalik
    ctx.lineTo(realImageX - 5, centerY - imageHeight - 10);
    ctx.moveTo(realImageX, centerY - imageHeight);
    ctx.lineTo(realImageX + 5, centerY - imageHeight - 10);
  } else {
    // Tegak
    ctx.lineTo(realImageX - 5, centerY - imageHeight + 10);
    ctx.moveTo(realImageX, centerY - imageHeight);
    ctx.lineTo(realImageX + 5, centerY - imageHeight + 10);
  }

  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillText("Bayangan", realImageX - 25, centerY - imageHeight - 10);
}

// Event sinkronisasi slider dan input
function syncSliderAndInput(slider, input, callback) {
  slider.addEventListener('input', () => {
    input.value = slider.value;
    callback();
  });
  input.addEventListener('input', () => {
    slider.value = input.value;
    callback();
  });
}

// Update semua
function update() {
  const focus = parseInt(focusSlider.value);
  const objectX = parseInt(objectXSlider.value);
  const objectHeight = parseInt(objectHeightSlider.value);
  drawScene(focus, objectX, objectHeight);
}

// Sinkronkan semua kontrol
syncSliderAndInput(focusSlider, focusInput, update);
syncSliderAndInput(objectXSlider, objectXInput, update);
syncSliderAndInput(objectHeightSlider, objectHeightInput, update);

// Inisialisasi
update();
