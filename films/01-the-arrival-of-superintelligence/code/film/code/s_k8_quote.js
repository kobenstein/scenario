// "In September, Anthropic's CEO, Dario Amodei, wrote: 'We must slow the pace at which we improve the capabilities of AI models.'"
// A writing desk at night under a warm lamp: an essay page fills with lines. The quote writes itself in, word by word,
// in time with the voice; "slow the pace" is underlined in amber.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, label, out } = L;

const T0 = 502.00, T1 = 511.55;

let PAT = null;
function gf(ctx, pathFn, fill, grain = 0.45, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) { if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat'); ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-300, -300, W + 600, H + 600); }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}

function roomArt(c) {
  gf(c, cc => cc.rect(-100, -100, W + 200, 640), lin(c, 0, 0, 0, 540, [[0, '#07081c'], [1, '#141336']]), 0.6);
  // a tall window with a night city, far left
  gf(c, cc => cc.rect(80, 60, 420, 420), lin(c, 0, 60, 0, 480, [[0, '#0f1036'], [1, '#231d52']]), 0.5);
  const r = rng(31); let x = 80;
  while (x < 500) { const w = 26 + r() * 50, h = 60 + r() * 200; c.fillStyle = '#0b0b26'; c.fillRect(x, 480 - h, w, h);
    for (let wy = 490 - h; wy < 470; wy += 14) for (let wx = x + 5; wx < x + w - 5; wx += 10) if (r() < 0.1) { c.fillStyle = rgba(r() < 0.4 ? C.cyan : '#ffb35c', 0.3 + r() * 0.3); c.fillRect(wx, wy, 3, 5); }
    x += w + 3; }
  c.fillStyle = '#06061a'; c.fillRect(74, 54, 432, 10); c.fillRect(74, 474, 432, 12); c.fillRect(284, 54, 8, 430);
  // desk top in perspective
  gf(c, cc => { cc.moveTo(-100, 540); cc.lineTo(W + 100, 540); cc.lineTo(W + 100, H + 100); cc.lineTo(-100, H + 100); cc.closePath(); }, lin(c, 0, 540, 0, H, [[0, '#2a2052'], [1, '#100c26']]), 0.6);
  c.strokeStyle = 'rgba(6,5,26,0.35)'; c.lineWidth = 2;
  for (let i = 0; i < 14; i++) { const y = 560 + i * i * 3.2; c.beginPath(); c.moveTo(-100, y); c.lineTo(W + 100, y + 4); c.stroke(); }
  c.fillStyle = 'rgba(164,159,196,0.18)'; c.fillRect(-100, 538, W + 200, 3);
}

// the page: a sheet on the desk, foreshortened
const PG = { x: 1300, y: 760, w: 470, h: 600, rot: -0.12, sy: 0.55 };
const ROWS = (() => { const r = rng(77), a = []; for (let i = 0; i < 17; i++) { const words = []; let x = 0; const end = i % 6 === 5 ? 200 + r() * 100 : 350 + r() * 40; while (x < end) { const w = 20 + r() * 60; words.push([x, Math.min(w, end - x)]); x += w + 11; } a.push(words); } return a; })();
const TYPE0 = 502.2, RATE = 2.1;   // rows per second

function page(ctx, t, lamp) {
  ctx.save(); ctx.translate(PG.x, PG.y); ctx.scale(1, PG.sy); ctx.rotate(PG.rot);
  ctx.fillStyle = 'rgba(4,4,16,0.5)'; ctx.fillRect(-PG.w / 2 + 14, -PG.h / 2 + 18, PG.w, PG.h);
  gf(ctx, c => c.rect(-PG.w / 2, -PG.h / 2, PG.w, PG.h), lin(ctx, 0, -PG.h / 2, 0, PG.h / 2, [[0, '#f3ead6'], [1, '#c9bca4']]), 0.3, [-PG.w / 2, -PG.h / 2, PG.w, PG.h]);
  const done = (t - TYPE0) * RATE;
  ROWS.forEach((row, i) => {
    const k = clamp(done - i); if (k <= 0) return;
    const len = row.reduce((s, w) => Math.max(s, w[0] + w[1]), 0) * k;
    ctx.fillStyle = 'rgba(40,30,70,0.7)';
    for (const [x, w] of row) { if (x > len) break; ctx.fillRect(-PG.w / 2 + 50 + x, -PG.h / 2 + 60 + i * 30, Math.min(w, len - x), 7); }
  });
  ctx.restore();
}

function lampDraw(ctx, t, fl) {
  // arm lamp at the top right, shade pointing down at the page
  ctx.strokeStyle = '#0c0b22'; ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(1830, 640); ctx.lineTo(1880, 330); ctx.lineTo(1620, 210); ctx.stroke();
  gf(ctx, c => c.ellipse(1830, 650, 90, 22, 0, 0, 7), '#0c0b22', 0.3);
  gf(ctx, c => { c.moveTo(1540, 270); c.lineTo(1660, 180); c.lineTo(1700, 230); c.lineTo(1620, 320); c.closePath(); }, lin(ctx, 1540, 200, 1700, 320, [[0, '#2a2252'], [1, '#0c0b22']]), 0.4);
  // the light falling on the page
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 1580, 300, 1350, 780, [[0, rgba('#ffb35c', 0.20 * fl)], [1, rgba('#ffb35c', 0.0)]]);
  ctx.beginPath(); ctx.moveTo(1550, 280); ctx.lineTo(1640, 320); ctx.lineTo(1800, 900); ctx.lineTo(1000, 900); ctx.closePath(); ctx.fill(); ctx.restore();
  light(ctx, 1590, 300, 120, '#ffe2a8', 0.6 * fl);
  light(ctx, 1350, 760, 620, '#ffb35c', 0.30 * fl);
}

const DUST = (() => { const r = rng(5), a = []; for (let i = 0; i < 40; i++) a.push([r(), r(), r()]); return a; })();

// the quote, word by word
const Q = [
  [['We', 507.02], ['must', 507.29], ['slow', 507.70], ['the', 507.96], ['pace', 508.12]],
  [['at', 508.46], ['which', 508.62], ['we', 508.85], ['improve', 508.96], ['the', 509.44]],
  [['capabilities', 509.58], ['of', 510.37], ['AI', 510.56], ['models.', 510.93]],
];
function quote(ctx, t) {
  const QX = 120, QY = 260, LH = 96, SZ = 84;
  const fade = 1 - ramp(t, T1 - 0.4, T1);
  ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 22;
  // the big opening mark lands on "wrote"
  const qa = ramp(t, 506.1, 506.6) * fade;
  ctx.globalAlpha = qa; ctx.fillStyle = C.amber; ctx.font = '220px "Instrument Serif"'; ctx.fillText('“', QX - 18, QY - 30 + (1 - out((t - 506.1) / 0.8)) * 20);
  ctx.font = `${SZ}px "Instrument Serif"`;
  let under = null;
  Q.forEach((line, li) => {
    let x = QX; const y = QY + 80 + li * LH;
    for (const [w, tw] of line) {
      const k = ramp(t, tw - 0.08, tw + 0.3);
      const wd = ctx.measureText(w + ' ').width;
      if (k > 0) { ctx.globalAlpha = k * fade; ctx.fillStyle = C.cream; ctx.fillText(w, x, y + (1 - out((t - tw + 0.08) / 0.5)) * 14); }
      if (li === 0 && w === 'slow') under = [x, y + 16];
      if (li === 0 && w === 'pace') under.push(x + ctx.measureText(w).width);
      x += wd;
    }
  });
  ctx.restore();
  // amber underline under "slow the pace", drawn on "slow"
  const u = out((t - 507.7) / 0.7);
  if (u > 0 && under) { ctx.save(); ctx.globalAlpha = fade; ctx.strokeStyle = C.amber; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(under[0], under[1]);
    const xe = lerp(under[0], under[2], u); for (let x = under[0]; x <= xe; x += 8) ctx.lineTo(x, under[1] + Math.sin(x * 0.05) * 2); ctx.stroke();
    ctx.restore(); light(ctx, (under[0] + xe) / 2, under[1], 160, '#ffb35c', 0.12 * u * fade); }
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.07, sm((t - T0) / (T1 - T0))), dx = drift(t, 1, 8) * 6, dy = drift(t, 1, 9) * 4;
  const fl = 0.94 + 0.06 * Math.sin(t * 1.7) * Math.sin(t * 0.6);
  ctx.save(); ctx.translate(W * 0.7, H * 0.6); ctx.scale(z, z); ctx.translate(-W * 0.7 + dx, -H * 0.6 + dy);
  cached(ctx, 'room', -100, -100, W + 100, H + 100, roomArt);
  page(ctx, t, fl);
  // a pen resting by the page, rolling a little
  ctx.save(); ctx.translate(1060, 860 + Math.sin(t * 0.8) * 2); ctx.rotate(-0.5 + 0.02 * Math.sin(t * 0.8));
  gf(ctx, c => { c.moveTo(-150, -7); c.lineTo(110, -7); c.lineTo(150, 0); c.lineTo(110, 7); c.lineTo(-150, 7); c.closePath(); }, lin(ctx, 0, -7, 0, 7, [[0, '#3a3470'], [1, '#100c26']]), 0.3, [-160, -10, 320, 20]);
  ctx.fillStyle = 'rgba(255,179,92,0.7)'; ctx.fillRect(60, -7, 8, 14); ctx.restore();
  lampDraw(ctx, t, fl);
  for (const [a, b, c] of DUST) { const ph = (b + t * (0.03 + c * 0.03)) % 1, x = 1200 + a * 520 + Math.sin(t * 0.6 + a * 9) * 14, y = 330 + ph * 480;
    ctx.fillStyle = rgba('#ffe2a8', 0.3 * Math.sin(ph * Math.PI)); ctx.beginPath(); ctx.arc(x, y, 1 + c * 1.6, 0, 7); ctx.fill(); }
  ctx.restore();
  // darken the left so the type reads
  ctx.fillStyle = lin(ctx, 0, 0, 1200, 0, [[0, 'rgba(5,5,18,0.55)'], [1, 'rgba(5,5,18,0)']]); ctx.fillRect(0, 0, 1200, H);
  label(ctx, t, 503.4, T1, 'Dario Amodei', 'CEO, Anthropic · September 2026', 120, 640);
  quote(ctx, t);
}

module.exports = { T0, T1, draw };
