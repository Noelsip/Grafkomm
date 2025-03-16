const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

const mirrorX = canvas.width / 2; 
const groundY = canvas.height - 80; 

let objectHeight = 80;
let objectDistance = 150;
let focalLength = 100;

const objectHeightInput = document.getElementById("objectHeightInput");
const objectDistanceInput = document.getElementById("objectDistanceInput");
const focalLengthInput = document.getElementById("focalLengthInput");

const objectHeightSlider = document.getElementById("objectHeightSlider");
const objectDistanceSlider = document.getElementById("objectDistanceSlider");
const focalLengthSlider = document.getElementById("focalLengthSlider");

const imageDistanceInput = document.getElementById("imageDistanceInput");
const imageHeightInput = document.getElementById("imageHeightInput");

function draw_line(x1, y1, x2, y2, color = "black", dashed = false) {
    ctx.strokeStyle = color;
    ctx.setLineDash(dashed ? [5, 5] : []);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw_table(x, y, height, color = "blue") {
    ctx.fillStyle = color;
    ctx.fillRect(x - 10, y - height, 20, height);
}

function draw_concave_mirror() {
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(mirrorX, 40);
    ctx.lineTo(mirrorX, groundY + 40);
    ctx.stroke();
    
    // Titik fokus ditampilkan sebagai lingkaran hitam kecil
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(mirrorX - focalLength, groundY, 5, 0, Math.PI * 2);
    ctx.fill();
}

function calculate_image_position(s, f) {
    if (s === f) return null; 
    return mirrorX - (f * s) / (s - f);
}

function draw_reflection() {
    let imageX = calculate_image_position(objectDistance, focalLength);
    if (imageX === null) {
        imageDistanceInput.value = "Tak Hingga";
        imageHeightInput.value = "Tak Hingga";
        return;
    }

    let imageSize = (focalLength * objectHeight) / (objectDistance - focalLength);
    imageSize = Math.abs(imageSize);
    let imageY = groundY + imageSize;

    imageDistanceInput.value = Math.round(Math.abs(imageX - mirrorX));
    imageHeightInput.value = Math.round(imageSize);

    draw_table(imageX, imageY, imageSize, "yellow");

    let topObjectX = mirrorX - objectDistance;
    let topObjectY = groundY - objectHeight;

    draw_line(topObjectX, topObjectY, mirrorX - focalLength, groundY, "red");
    draw_line(topObjectX, topObjectY, mirrorX, topObjectY, "blue");
    draw_line(mirrorX, topObjectY, imageX, imageY, "red", true);
}

function draw_legend() {
    let legendCanvas = document.getElementById("legendCanvas");
    let legendCtx = legendCanvas.getContext("2d");
    legendCanvas.width = 200;
    legendCanvas.height = 180;
    legendCtx.clearRect(0, 0, legendCanvas.width, legendCanvas.height);

    let startX = 10;
    let startY = 20;
    let spacing = 25;

    legendCtx.fillStyle = "black";
    legendCtx.font = "14px Arial";
    legendCtx.fillText("Legenda:", startX, startY);

    let legends = [
        { color: "green", text: "Cermin Cekung" },
        { color: "purple", text: "Benda Asli" },
        { color: "yellow", text: "Bayangan" },
        { color: "black", text: "Sinar Datang" },
        { color: "blue", text: "Sinar Pantul" },
        { color: "red", text: "Sinar Tambahan" },
        { color: "black", text: "Titik Fokus" }
    ];

    legends.forEach((legend, index) => {
        let y = startY + (index + 1) * spacing;
        legendCtx.fillStyle = legend.color;
        legendCtx.fillRect(startX, y - 12, 12, 12);
        legendCtx.fillStyle = "black";
        legendCtx.fillText(legend.text, startX + 20, y);
    });
}

function draw_scene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();

    draw_concave_mirror();
    draw_table(mirrorX - objectDistance, groundY, objectHeight, "purple");
    draw_reflection();
    draw_legend();
}

function updateValues() {
    objectHeight = parseInt(objectHeightInput.value);
    objectDistance = parseInt(objectDistanceInput.value);
    focalLength = parseInt(focalLengthInput.value);

    objectHeightSlider.value = objectHeight;
    objectDistanceSlider.value = objectDistance;
    focalLengthSlider.value = focalLength;

    draw_scene();
}

function updateSliders() {
    objectHeightInput.value = objectHeightSlider.value;
    objectDistanceInput.value = objectDistanceSlider.value;
    focalLengthInput.value = focalLengthSlider.value;

    updateValues();
}

objectHeightInput.addEventListener("input", updateValues);
objectDistanceInput.addEventListener("input", updateValues);
focalLengthInput.addEventListener("input", updateValues);

objectHeightSlider.addEventListener("input", updateSliders);
objectDistanceSlider.addEventListener("input", updateSliders);
focalLengthSlider.addEventListener("input", updateSliders);

draw_scene();