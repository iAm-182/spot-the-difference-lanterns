// scenes.js — the three hand-drawn scenes of Lantern Festival.
// Each level paints its picture in a 600 x 640 panel. The left panel is the
// original; the right panel is the same picture with every difference applied.
// A difference is { x, y, r, label, paint(ctx) }: paint() redraws just that
// spot the way it looks on the right, covering the original first.

function skyGradient(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 640);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 640);
}

function starField(ctx, seed) {
  ctx.fillStyle = '#fff8d0';
  let s = seed;
  for (let i = 0; i < 46; i++) {
    s = (s * 16807) % 2147483647;
    const x = (s % 600);
    s = (s * 16807) % 2147483647;
    const y = (s % 240);
    const r = 1 + (s % 3) * 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paperLantern(ctx, x, y, r, body, glow) {
  ctx.save();
  ctx.fillStyle = glow;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(x, y, r + 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(90,20,20,0.55)';
  ctx.lineWidth = 1.5;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.ellipse(x, y, r * Math.abs(i) / 2.4, r * 1.15, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a1f1f';
  ctx.fillRect(x - 5, y - r * 1.15 - 5, 10, 6);
  ctx.fillRect(x - 5, y + r * 1.15 - 1, 10, 6);
  ctx.restore();
}

function hangingLantern(ctx, x, y, r, body) {
  ctx.strokeStyle = '#3a2a18';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - r - 26);
  ctx.lineTo(x, y - r);
  ctx.stroke();
  paperLantern(ctx, x, y, r, body, body);
}

function stall(ctx, x, y, w, awning, counter) {
  // awning
  ctx.fillStyle = awning;
  ctx.beginPath();
  ctx.moveTo(x - 14, y);
  ctx.lineTo(x + w + 14, y);
  ctx.lineTo(x + w + 4, y + 34);
  ctx.lineTo(x - 4, y + 34);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(x + 8 + i * (w / 5), y + 2, w / 10, 30);
  }
  // posts + counter
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(x, y + 34, 8, 120);
  ctx.fillRect(x + w - 8, y + 34, 8, 120);
  ctx.fillStyle = counter;
  ctx.fillRect(x - 8, y + 120, w + 16, 16);
  ctx.fillStyle = '#3a2412';
  ctx.fillRect(x - 8, y + 136, w + 16, 60);
}

function signBoard(ctx, x, y, w, h, text, bg, fg) {
  ctx.fillStyle = '#4a2c14';
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fg;
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
}

function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color || '#2c2c34';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 7 * s, x + 10 * s, y);
  ctx.stroke();
}

function pine(ctx, x, y, s) {
  ctx.fillStyle = '#4a2c14';
  ctx.fillRect(x - 5 * s, y - 10 * s, 10 * s, 34 * s);
  ctx.fillStyle = '#1e5c34';
  for (let i = 0; i < 3; i++) {
    const w = (46 - i * 12) * s;
    const ty = y - 22 * s - i * 26 * s;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, ty + 26 * s);
    ctx.lineTo(x, ty - 8 * s);
    ctx.lineTo(x + w / 2, ty + 26 * s);
    ctx.closePath();
    ctx.fill();
  }
}

function cat(ctx, x, y, s, body) {
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, 26 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 20 * s, y - 12 * s, 12 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 12 * s, y - 20 * s);
  ctx.lineTo(x + 15 * s, y - 30 * s);
  ctx.lineTo(x + 19 * s, y - 21 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 22 * s, y - 21 * s);
  ctx.lineTo(x + 27 * s, y - 30 * s);
  ctx.lineTo(x + 29 * s, y - 20 * s);
  ctx.closePath();
  ctx.fill();
  // tail, curled up
  ctx.strokeStyle = body;
  ctx.lineWidth = 5 * s;
  ctx.beginPath();
  ctx.moveTo(x - 24 * s, y + 2 * s);
  ctx.quadraticCurveTo(x - 38 * s, y - 6 * s, x - 30 * s, y - 22 * s);
  ctx.stroke();
}

function koi(ctx, x, y, s, body) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.5);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, 16 * s, 7 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-14 * s, 0);
  ctx.lineTo(-24 * s, -7 * s);
  ctx.lineTo(-24 * s, 7 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.arc(5 * s, -2 * s, 3 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- scene 1
function drawNightMarket(ctx) {
  skyGradient(ctx, '#1a1440', '#3d1f5e');
  starField(ctx, 12345);
  // big golden moon
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.arc(480, 86, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f2c14e';
  ctx.beginPath();
  ctx.arc(466, 74, 9, 0, Math.PI * 2);
  ctx.arc(494, 100, 7, 0, Math.PI * 2);
  ctx.fill();
  // distant rooftops
  ctx.fillStyle = '#241a3d';
  ctx.fillRect(0, 300, 600, 90);
  ctx.fillStyle = '#2e2148';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 100, 300);
    ctx.lineTo(70 + i * 100, 262);
    ctx.lineTo(120 + i * 100, 300);
    ctx.closePath();
    ctx.fill();
  }
  // festoon strings of lanterns
  ctx.strokeStyle = '#3a2a18';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 130);
  ctx.quadraticCurveTo(300, 178, 600, 128);
  ctx.stroke();
  hangingLantern(ctx, 90, 168, 17, '#e8442e');
  hangingLantern(ctx, 210, 180, 15, '#f2a03d');
  hangingLantern(ctx, 330, 182, 17, '#e8442e');
  hangingLantern(ctx, 450, 172, 15, '#f2a03d');
  hangingLantern(ctx, 540, 158, 16, '#e8442e');
  // ground
  ctx.fillStyle = '#4a3350';
  ctx.fillRect(0, 390, 600, 250);
  ctx.fillStyle = '#5a4060';
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 8; c++) {
      ctx.fillRect(10 + c * 76 + (r % 2) * 30, 400 + r * 40, 58, 30);
    }
  }
  // three stalls
  stall(ctx, 30, 300, 150, '#c23b2e', '#8a5a2e');
  stall(ctx, 225, 300, 150, '#2e7a4a', '#8a5a2e');
  stall(ctx, 420, 300, 150, '#2e5a8a', '#8a5a2e');
  // goods on the counters
  paperLantern(ctx, 80, 402, 13, '#e8442e', '#e8442e');
  paperLantern(ctx, 130, 402, 13, '#f2a03d', '#f2a03d');
  ctx.fillStyle = '#d8b25a';
  ctx.beginPath();
  ctx.arc(275, 408, 12, 0, Math.PI * 2);
  ctx.arc(305, 408, 12, 0, Math.PI * 2);
  ctx.arc(335, 408, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7ec8e8';
  ctx.beginPath();
  ctx.arc(470, 408, 11, 0, Math.PI * 2);
  ctx.arc(500, 408, 11, 0, Math.PI * 2);
  ctx.arc(530, 408, 11, 0, Math.PI * 2);
  ctx.fill();
  // signs
  signBoard(ctx, 55, 252, 100, 40, '灯笼', '#f5e9c8', '#a02818');
  signBoard(ctx, 250, 252, 100, 40, '茶', '#f5e9c8', '#1e5c34');
  signBoard(ctx, 445, 252, 100, 40, '玩具', '#f5e9c8', '#1e3a5c');
  // cat on a crate, bottom left
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(52, 540, 74, 58);
  ctx.strokeStyle = '#5a3a22';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 540, 74, 58);
  ctx.beginPath();
  ctx.moveTo(52, 569);
  ctx.lineTo(126, 569);
  ctx.stroke();
  cat(ctx, 88, 534, 1, '#e07830');
  // ground lanterns, bottom right
  paperLantern(ctx, 470, 560, 18, '#e8442e', '#e8442e');
  paperLantern(ctx, 520, 585, 15, '#f2a03d', '#f2a03d');
  // a small dog by the middle stall
  ctx.fillStyle = '#8a6a42';
  ctx.beginPath();
  ctx.ellipse(380, 560, 26, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(402, 548, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(394, 540);
  ctx.lineTo(396, 530);
  ctx.lineTo(401, 539);
  ctx.closePath();
  ctx.fill();
  // birds on the top wire
  gull(ctx, 150, 96, 0.8, '#0f0c22');
  gull(ctx, 250, 82, 0.8, '#0f0c22');
}

const nightMarketDiffs = [
  {
    x: 480, y: 86, r: 52, label: 'moon turned pale',
    paint(ctx) {
      ctx.fillStyle = '#cfe0f2';
      ctx.beginPath();
      ctx.arc(480, 86, 46, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#aebfd8';
      ctx.beginPath();
      ctx.arc(466, 74, 9, 0, Math.PI * 2);
      ctx.arc(494, 100, 7, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    x: 210, y: 180, r: 24, label: 'lantern missing from the string',
    paint(ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 640);
      g.addColorStop(0, '#1a1440');
      g.addColorStop(1, '#3d1f5e');
      ctx.fillStyle = g;
      ctx.fillRect(186, 148, 48, 52);
      ctx.strokeStyle = '#3a2a18';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(186, 172);
      ctx.quadraticCurveTo(210, 176, 234, 172);
      ctx.stroke();
    },
  },
  {
    x: 350, y: 92, r: 22, label: 'an extra bird on the wire',
    paint(ctx) { gull(ctx, 350, 92, 0.9, '#0f0c22'); },
  },
  {
    x: 300, y: 272, r: 30, label: 'tea sign changed character',
    paint(ctx) { signBoard(ctx, 250, 252, 100, 40, '酒', '#f5e9c8', '#1e5c34'); },
  },
  {
    x: 88, y: 528, r: 34, label: 'the cat turned grey',
    paint(ctx) {
      ctx.fillStyle = '#4a3350';
      ctx.fillRect(48, 490, 90, 52);
      ctx.fillStyle = '#7a5230';
      ctx.fillRect(52, 540, 74, 58);
      ctx.strokeStyle = '#5a3a22';
      ctx.lineWidth = 2;
      ctx.strokeRect(52, 540, 74, 58);
      ctx.beginPath();
      ctx.moveTo(52, 569);
      ctx.lineTo(126, 569);
      ctx.stroke();
      cat(ctx, 88, 534, 1, '#8a8a96');
    },
  },
  {
    x: 556, y: 540, r: 24, label: 'an extra ground lantern',
    paint(ctx) { paperLantern(ctx, 556, 540, 15, '#7ec8e8', '#7ec8e8'); },
  },
  {
    x: 300, y: 318, r: 30, label: 'middle awning stripe colour changed',
    paint(ctx) {
      ctx.fillStyle = '#c23b2e';
      ctx.fillRect(283, 302, 30, 30);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillRect(291, 302, 15, 30);
    },
  },
];

// ---------------------------------------------------------------- scene 2
function drawHarbor(ctx) {
  skyGradient(ctx, '#f7c98a', '#e88a5a');
  // rising sun
  ctx.fillStyle = '#fff2b8';
  ctx.beginPath();
  ctx.arc(470, 120, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffdf6a';
  ctx.beginPath();
  ctx.arc(470, 120, 34, 0, Math.PI * 2);
  ctx.fill();
  // clouds
  ctx.fillStyle = 'rgba(255,240,220,0.85)';
  ctx.beginPath();
  ctx.ellipse(120, 90, 70, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(170, 82, 50, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(300, 150, 60, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  // gulls
  gull(ctx, 130, 170, 1, '#4a3a2c');
  gull(ctx, 220, 140, 0.9, '#4a3a2c');
  gull(ctx, 330, 190, 1, '#4a3a2c');
  // sea
  ctx.fillStyle = '#2e6a8a';
  ctx.fillRect(0, 300, 600, 190);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 40, 330 + i * 18);
    ctx.quadraticCurveTo(60 + i * 40, 322 + i * 18, 100 + i * 40, 330 + i * 18);
    ctx.stroke();
  }
  // boats
  boat(ctx, 90, 340, 1, '#c23b2e', '#f5e9c8');
  boat(ctx, 170, 410, 0.8, '#2e7a4a', '#e8442e');
  boat(ctx, 470, 330, 0.7, '#2e5a8a', '#f2a03d');
  // buoy
  ctx.fillStyle = '#e8442e';
  ctx.beginPath();
  ctx.arc(200, 455, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f5e9c8';
  ctx.fillRect(192, 449, 16, 6);
  // lighthouse on the far shore
  ctx.fillStyle = '#f5e9c8';
  ctx.fillRect(520, 180, 44, 120);
  ctx.fillStyle = '#c23b2e';
  ctx.fillRect(520, 210, 44, 18);
  ctx.fillRect(520, 252, 44, 18);
  ctx.fillStyle = '#2c2c34';
  ctx.fillRect(516, 162, 52, 20);
  ctx.fillStyle = '#ffd76a';
  ctx.beginPath();
  ctx.arc(542, 172, 8, 0, Math.PI * 2);
  ctx.fill();
  // pier + crates + nets
  ctx.fillStyle = '#6a4a2a';
  ctx.fillRect(0, 490, 600, 26);
  ctx.fillStyle = '#7a5230';
  for (let i = 0; i < 12; i++) ctx.fillRect(i * 52, 516, 6, 60);
  ctx.fillStyle = '#8a6a42';
  ctx.fillRect(60, 440, 52, 50);
  ctx.fillRect(120, 452, 44, 38);
  ctx.strokeStyle = '#5a3a22';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 440, 52, 50);
  ctx.strokeRect(120, 452, 44, 38);
  // rope coil
  ctx.strokeStyle = '#d8b25a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(470, 470, 20, 0, Math.PI * 2);
  ctx.arc(470, 470, 12, 0, Math.PI * 2);
  ctx.stroke();
  // fish stall on the pier
  stall(ctx, 230, 380, 130, '#2e7a4a', '#8a5a2e');
  ctx.fillStyle = '#9ab8c8';
  ctx.beginPath();
  ctx.ellipse(265, 500, 22, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(320, 500, 22, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  signBoard(ctx, 250, 340, 90, 34, '鱼', '#e8f2f5', '#1e3a5c');
  // foreground sand
  ctx.fillStyle = '#d8b98a';
  ctx.fillRect(0, 576, 600, 64);
  ctx.fillStyle = '#c8a878';
  ctx.beginPath();
  ctx.ellipse(140, 610, 40, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(430, 620, 50, 12, 0, 0, Math.PI * 2);
  ctx.fill();
}

function boat(ctx, x, y, s, hull, sail) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  // mast + sail
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(-3, -72, 6, 72);
  ctx.fillStyle = sail;
  ctx.beginPath();
  ctx.moveTo(4, -70);
  ctx.lineTo(4, -12);
  ctx.lineTo(52, -12);
  ctx.closePath();
  ctx.fill();
  // flag
  ctx.fillStyle = '#e8442e';
  ctx.beginPath();
  ctx.moveTo(0, -72);
  ctx.lineTo(22, -66);
  ctx.lineTo(0, -60);
  ctx.closePath();
  ctx.fill();
  // hull
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(-58, 0);
  ctx.lineTo(58, 0);
  ctx.lineTo(40, 22);
  ctx.lineTo(-40, 22);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(-58, 0, 116, 4);
  ctx.restore();
}

const harborDiffs = [
  {
    x: 410, y: 130, r: 24, label: 'an extra gull in the sky',
    paint(ctx) { gull(ctx, 410, 130, 1, '#4a3a2c'); },
  },
  {
    x: 192, y: 377, r: 32, label: 'middle boat sail changed colour',
    paint(ctx) {
      boat(ctx, 170, 410, 0.8, '#2e7a4a', '#2e6a8a');
    },
  },
  {
    x: 142, y: 471, r: 26, label: 'a crate vanished from the pier',
    paint(ctx) {
      ctx.fillStyle = '#2e6a8a';
      ctx.fillRect(118, 448, 48, 44);
      ctx.fillStyle = '#6a4a2a';
      ctx.fillRect(118, 488, 48, 4);
    },
  },
  {
    x: 542, y: 172, r: 20, label: 'lighthouse lamp turned red',
    paint(ctx) {
      ctx.fillStyle = '#e8442e';
      ctx.beginPath();
      ctx.arc(542, 172, 8, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    x: 400, y: 440, r: 22, label: 'an extra buoy in the water',
    paint(ctx) {
      ctx.fillStyle = '#f2a03d';
      ctx.beginPath();
      ctx.arc(400, 440, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f5e9c8';
      ctx.fillRect(393, 435, 14, 5);
    },
  },
  {
    x: 295, y: 357, r: 28, label: 'fish sign changed character',
    paint(ctx) { signBoard(ctx, 250, 340, 90, 34, '虾', '#e8f2f5', '#1e3a5c'); },
  },
  {
    x: 470, y: 470, r: 26, label: 'the rope coil is gone',
    paint(ctx) {
      ctx.fillStyle = '#2e6a8a';
      ctx.fillRect(444, 444, 52, 46);
      ctx.fillStyle = '#6a4a2a';
      ctx.fillRect(444, 488, 52, 4);
    },
  },
  {
    x: 90, y: 272, r: 24, label: 'first boat flag turned blue',
    paint(ctx) {
      ctx.fillStyle = '#2e5a8a';
      ctx.beginPath();
      ctx.moveTo(90, 268);
      ctx.lineTo(112, 274);
      ctx.lineTo(90, 280);
      ctx.closePath();
      ctx.fill();
    },
  },
];

// ---------------------------------------------------------------- scene 3
function drawTeaHouse(ctx) {
  skyGradient(ctx, '#bfe0f2', '#f2e2b8');
  // mountains
  ctx.fillStyle = '#7a9ab8';
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.lineTo(140, 110);
  ctx.lineTo(280, 260);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8aa8c2';
  ctx.beginPath();
  ctx.moveTo(200, 260);
  ctx.lineTo(380, 70);
  ctx.lineTo(560, 260);
  ctx.closePath();
  ctx.fill();
  // snow caps
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(118, 132);
  ctx.lineTo(140, 110);
  ctx.lineTo(162, 132);
  ctx.lineTo(150, 128);
  ctx.lineTo(140, 140);
  ctx.lineTo(130, 128);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(356, 94);
  ctx.lineTo(380, 70);
  ctx.lineTo(404, 94);
  ctx.lineTo(392, 90);
  ctx.lineTo(380, 102);
  ctx.lineTo(368, 90);
  ctx.closePath();
  ctx.fill();
  // clouds
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.ellipse(90, 60, 60, 14, 0, 0, Math.PI * 2);
  ctx.ellipse(480, 44, 70, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  // pines on the slopes
  pine(ctx, 60, 300, 1.1);
  pine(ctx, 540, 290, 1.2);
  pine(ctx, 500, 330, 0.8);
  // ground + pond
  ctx.fillStyle = '#6a8a4a';
  ctx.fillRect(0, 260, 600, 380);
  ctx.fillStyle = '#4a7a8a';
  ctx.beginPath();
  ctx.ellipse(150, 540, 130, 62, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(150, 540, 110, 48, 0, 0, Math.PI * 2);
  ctx.stroke();
  koi(ctx, 130, 530, 1, '#e87830');
  koi(ctx, 180, 560, 0.9, '#f5f0e0');
  // stone lantern by the pond
  ctx.fillStyle = '#9a9a92';
  ctx.fillRect(288, 520, 34, 60);
  ctx.fillRect(280, 508, 50, 14);
  ctx.fillRect(284, 470, 42, 38);
  ctx.fillStyle = '#ffd76a';
  ctx.fillRect(296, 482, 18, 16);
  ctx.fillStyle = '#7a7a72';
  ctx.beginPath();
  ctx.moveTo(272, 470);
  ctx.lineTo(338, 470);
  ctx.lineTo(305, 448);
  ctx.closePath();
  ctx.fill();
  // tea house
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(330, 300, 220, 180);
  ctx.fillStyle = '#f5e9c8';
  ctx.fillRect(340, 310, 200, 160);
  // roof
  ctx.fillStyle = '#a02818';
  ctx.beginPath();
  ctx.moveTo(310, 310);
  ctx.lineTo(440, 240);
  ctx.lineTo(570, 310);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a1f1f';
  ctx.fillRect(310, 306, 260, 8);
  // sliding doors + window
  ctx.strokeStyle = '#5a3a22';
  ctx.lineWidth = 3;
  ctx.strokeRect(356, 330, 84, 140);
  ctx.strokeRect(452, 330, 72, 140);
  ctx.beginPath();
  ctx.moveTo(398, 330);
  ctx.lineTo(398, 470);
  ctx.moveTo(356, 400);
  ctx.lineTo(440, 400);
  ctx.stroke();
  ctx.fillStyle = '#bfe0f2';
  ctx.fillRect(458, 340, 60, 46);
  ctx.strokeRect(452, 334, 72, 58);
  // veranda + tea tray
  ctx.fillStyle = '#8a5a2e';
  ctx.fillRect(330, 470, 220, 16);
  ctx.fillStyle = '#3a2412';
  ctx.fillRect(380, 452, 110, 18);
  ctx.fillStyle = '#e8442e';
  ctx.beginPath();
  ctx.arc(405, 446, 9, 0, Math.PI * 2);
  ctx.arc(435, 446, 9, 0, Math.PI * 2);
  ctx.arc(465, 446, 9, 0, Math.PI * 2);
  ctx.fill();
  // teapot on the tray
  ctx.fillStyle = '#2e5a8a';
  ctx.beginPath();
  ctx.arc(520, 452, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(516, 436, 8, 8);
  // bamboo cluster, right edge
  ctx.strokeStyle = '#2e7a4a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(576, 640);
  ctx.lineTo(576, 420);
  ctx.moveTo(588, 640);
  ctx.lineTo(588, 460);
  ctx.stroke();
  ctx.fillStyle = '#7ec86a';
  ctx.beginPath();
  ctx.ellipse(572, 410, 22, 10, -0.5, 0, Math.PI * 2);
  ctx.ellipse(590, 450, 20, 9, 0.5, 0, Math.PI * 2);
  ctx.fill();
  // stepping stones
  ctx.fillStyle = '#b8b0a0';
  ctx.beginPath();
  ctx.ellipse(330, 600, 34, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(420, 620, 34, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(510, 600, 34, 12, 0, 0, Math.PI * 2);
  ctx.fill();
}

const teaHouseDiffs = [
  {
    x: 150, y: 540, r: 30, label: 'an extra koi in the pond',
    paint(ctx) { koi(ctx, 110, 570, 0.9, '#f2a03d'); },
  },
  {
    x: 465, y: 446, r: 18, label: 'a tea cup is missing',
    paint(ctx) {
      ctx.fillStyle = '#3a2412';
      ctx.fillRect(452, 440, 26, 14);
    },
  },
  {
    x: 230, y: 330, r: 26, label: 'an extra pine on the slope',
    paint(ctx) { pine(ctx, 230, 340, 0.7); },
  },
  {
    x: 305, y: 490, r: 20, label: 'stone lantern flame turned blue',
    paint(ctx) {
      ctx.fillStyle = '#7ec8e8';
      ctx.fillRect(296, 482, 18, 16);
    },
  },
  {
    x: 488, y: 363, r: 26, label: 'window paper turned gold',
    paint(ctx) {
      ctx.fillStyle = '#f2c14e';
      ctx.fillRect(458, 340, 60, 46);
    },
  },
  {
    x: 250, y: 330, r: 22, label: 'a butterfly by the tea house',
    paint(ctx) {
      ctx.fillStyle = '#e878d8';
      ctx.beginPath();
      ctx.ellipse(244, 326, 8, 5, -0.6, 0, Math.PI * 2);
      ctx.ellipse(258, 326, 8, 5, 0.6, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    x: 380, y: 86, r: 26, label: 'snow cap gone from the tall peak',
    paint(ctx) {
      ctx.fillStyle = '#8aa8c2';
      ctx.beginPath();
      ctx.moveTo(356, 94);
      ctx.lineTo(380, 70);
      ctx.lineTo(404, 94);
      ctx.lineTo(392, 90);
      ctx.lineTo(380, 102);
      ctx.lineTo(368, 90);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    x: 588, y: 500, r: 24, label: 'a bamboo stalk is missing',
    paint(ctx) {
      ctx.fillStyle = '#6a8a4a';
      ctx.fillRect(582, 450, 14, 190);
    },
  },
  {
    x: 440, y: 262, r: 26, label: 'roof ridge turned gold',
    paint(ctx) {
      ctx.fillStyle = '#f2c14e';
      ctx.beginPath();
      ctx.moveTo(420, 254);
      ctx.lineTo(440, 240);
      ctx.lineTo(460, 254);
      ctx.lineTo(450, 250);
      ctx.lineTo(440, 260);
      ctx.lineTo(430, 250);
      ctx.closePath();
      ctx.fill();
    },
  },
];

export const LEVELS = [
  {
    name: 'Lantern Night Market',
    timeLimit: 180,
    draw: drawNightMarket,
    differences: nightMarketDiffs,
  },
  {
    name: 'Harbor at Dawn',
    timeLimit: 150,
    draw: drawHarbor,
    differences: harborDiffs,
  },
  {
    name: 'Mountain Tea House',
    timeLimit: 120,
    draw: drawTeaHouse,
    differences: teaHouseDiffs,
  },
];

// drawLevelPanel(ctx, level, side, foundSet) — paints one 600x640 panel.
// side is 'left' (original) or 'right' (all differences applied).
export function drawLevelPanel(ctx, level, side) {
  ctx.save();
  level.draw(ctx);
  if (side === 'right') {
    for (const d of level.differences) d.paint(ctx);
  }
  ctx.restore();
}
