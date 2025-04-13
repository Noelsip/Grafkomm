// src/components/Canvas.js
import React, { useRef, useEffect } from 'react';

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function point(x, y) {
  return new Point(x, y);
}

function midpointLine(x1, y1, x2, y2, ctx, color) {
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    ctx.fillStyle = color;
    ctx.fillRect(x1, y1, 1, 1);
    if (x1 === x2 && y1 === y2) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
}

function drawLine(ctx, start, end, color, useMidpoint = false) {
  if (useMidpoint) {
    midpointLine(Math.round(start.x), Math.round(start.y), Math.round(end.x), Math.round(end.y), ctx, color);
  } else {
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawDashedLine(ctx, start, end, color, dash = [5, 5]) {
  ctx.beginPath();
  ctx.setLineDash(dash);
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawArrow(ctx, from, to, color) {
  const headlen = 10;
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6));
  ctx.lineTo(to.x, to.y);
  ctx.fillStyle = color;
  ctx.fill();
}

export default function Canvas({
  jarakBenda,
  tinggiBenda,
  titikFokus,
  setJarakBayangan,
  setTinggiBayangan
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (jarakBenda !== 0) {
      draw(context);
    } else {
      setJarakBayangan(0);
      setTinggiBayangan(0);
    }
  }, [jarakBenda, tinggiBenda, titikFokus]);

  function drawPencil(ctx, baseX, baseY, height, isShadow = false) {
    const bodyColor = isShadow ? 'rgba(128, 0, 128, 0.6)' : '#4CAF50'; // hijau
    const tipColor = isShadow ? 'rgba(255, 255, 0, 0.5)' : '#FFD700'; // kuning
    const eraserColor = isShadow ? 'rgba(255, 182, 193, 0.5)' : '#FFB6C1'; // pink
    const outlineColor = isShadow ? 'rgba(0,0,0,0.5)' : 'black';
  
    const width = 20;
    const halfWidth = width / 2;
    const tipHeight = 10;
    const eraserHeight = 10;
  
    const direction = height >= 0 ? 1 : -1;
    const absHeight = Math.abs(height);
    const bodyHeight = absHeight - tipHeight - eraserHeight;
  
    const topY = baseY - direction * absHeight;
    const eraserY = topY;
    const bodyY = topY + direction * eraserHeight;
    const tipY = baseY - direction * tipHeight;
  
    // Badan pensil
    ctx.fillStyle = bodyColor;
    ctx.fillRect(baseX - halfWidth, bodyY, width, direction * bodyHeight);
    ctx.strokeStyle = outlineColor;
    ctx.strokeRect(baseX - halfWidth, bodyY, width, direction * bodyHeight);
  
    // Penghapus
    ctx.fillStyle = eraserColor;
    ctx.fillRect(baseX - halfWidth, eraserY, width, direction * eraserHeight);
    ctx.strokeStyle = outlineColor;
    ctx.strokeRect(baseX - halfWidth, eraserY, width, direction * eraserHeight);
  
    // Ujung runcing (selalu di baseY)
    ctx.beginPath();
    ctx.moveTo(baseX - halfWidth, tipY);
    ctx.lineTo(baseX + halfWidth, tipY);
    ctx.lineTo(baseX, baseY);
    ctx.closePath();
    ctx.fillStyle = tipColor;
    ctx.fill();
    ctx.strokeStyle = outlineColor;
    ctx.stroke();
  
    // Label
    ctx.fillStyle = isShadow ? 'purple' : 'black';
    ctx.font = '14px sans-serif';
    ctx.fillText(isShadow ? "A′" : "A", baseX - 10, topY - 5 * direction);
  }
  
  

  const draw = (ctx) => {
    const canvasWidth = 800;
    const canvasHeight = 500;

    const titikX = canvasWidth / 2;
    const titikY = canvasHeight / 2;

    const hasilJarakBayangan = (jarakBenda === 0 || jarakBenda === titikFokus)
      ? Infinity
      : (jarakBenda * titikFokus) / (jarakBenda - titikFokus);

    const hasilTinggiBayangan = jarakBenda === 0
      ? 0
      : (hasilJarakBayangan * tinggiBenda) / jarakBenda;

    setJarakBayangan(hasilJarakBayangan);
    setTinggiBayangan(hasilTinggiBayangan);

    const bendaX = titikX - jarakBenda;
    const bendaY = titikY - tinggiBenda;
    const bayanganX = titikX - hasilJarakBayangan;
    const bayanganY = titikY + hasilTinggiBayangan;

    // Sumbu utama
    drawLine(ctx, point(titikX, 0), point(titikX, canvasHeight), 'black');
    drawLine(ctx, point(0, titikY), point(canvasWidth, titikY), 'black');
    // Label cermin
    ctx.save();
    ctx.translate(titikX, titikY); // Pindah ke posisi tengah cermin
    ctx.rotate(-Math.PI / 2); // Putar teks agar vertikal
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText("Cermin", -30, -10); // Sedikit geser ke atas & ke kiri
    ctx.restore();


    // Gambar pensil sebagai benda
      drawPencil(ctx, bendaX, titikY, tinggiBenda, false);

    // Gambar bayangan
    if (isFinite(hasilJarakBayangan)) {
      drawPencil(ctx, bayanganX, titikY, -hasilTinggiBayangan, true);
    }
    

    // Sinar 1: sejajar → ke fokus
    drawArrow(ctx, point(bendaX, bendaY), point(titikX, bendaY), 'orange');
    if (hasilJarakBayangan < 0) {
      drawDashedLine(ctx, point(titikX, bendaY), point(bayanganX, bayanganY), 'orange');
    } else {
      drawArrow(ctx, point(titikX, bendaY), point(bayanganX, bayanganY), 'orange');
    }

    // Sinar 2: menuju fokus → pantulan sejajar
    drawArrow(ctx, point(bendaX, bendaY), point(titikX, bayanganY), 'blue');
    if (hasilJarakBayangan < 0) {
      drawDashedLine(ctx, point(titikX, bayanganY), point(canvasWidth, bayanganY), 'blue');
    } else {
      drawArrow(ctx, point(titikX, bayanganY), point(canvasWidth, bayanganY), 'blue');
    }

    // Titik fokus dan pusat kelengkungan
    const fokusX = titikX - titikFokus;
    const centerX = titikX - 2 * titikFokus;

    ctx.beginPath();
    ctx.arc(fokusX, titikY, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText("F", fokusX - 10, titikY - 10);

    ctx.beginPath();
    ctx.arc(centerX, titikY, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText("C", centerX - 10, titikY - 10);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      style={{ border: '1px solid black' }}
    />
  );
}
