// "OpenAI says its AI agents put in about three days of research work for every day its human researchers do."
// A human researcher at a lamp-lit desk on the left; three cyan agents materialise at desks on the right.
// Above each worker hangs a day tile. In the same stretch of time the human fills one tile, the agents fill three.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, label, stamp, out } = L;
const { figure, roundRect } = require('./s_timeline');

const T0 = 76.7, T1 = 84.8;

let PAT = null;
function grainFill(ctx, pathFn, fill, grain = 0.5, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat');
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-300, -300, W + 600, H + 600);
  }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn) {
  if (!CACHE[key]) { const cv = L.createCanvas(x1 - x0, y1 - y0), c = cv.getContext('2d'); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0);
}

const F0 = 79.6, F1 = 82.64;                 // the shared stretch of time in which the tiles fill
const HUM = { x: 400, y: 770 };
const AG = [{ x: 1000, y: 780, ph: 0.3, t: 78.6 }, { x: 1310, y: 780, ph: 1.7, t: 78.8 }, { x: 1620, y: 780, ph: 2.9, t: 79.0 }];
const TY = 262, TS = 150;                     // tile top and size
const CYPAL = ['#d8f7ff', '#5fc4e4', '#0a4f6c'], CYSKIN = ['#e8fbff', '#8fe6ff', '#0a6f8c'];
const R = rng(31);
const MOTES = Array.from({ length: 70 }, () => [R(), R(), R()]);
const SPARK = Array.from({ length: 90 }, () => [R(), R(), R(), R()]);

function tile(ctx, x, t, fill, col, colD, colW, pulse, txt) {
  const x0 = x - TS / 2;
  ctx.save();
  grainFill(ctx, c => roundRect(c, x0, TY, TS, TS, 14), 'rgba(12,12,40,0.85)', 0.4, [x0, TY, TS, TS]);
  if (fill > 0) {
    ctx.save(); ctx.beginPath(); roundRect(ctx, x0, TY, TS, TS, 14); ctx.clip();
    const y = TY + TS * (1 - fill), wv = 3 * Math.sin(t * 4 + x);
    grainFill(ctx, c => { c.moveTo(x0 - 5, y + wv); c.quadraticCurveTo(x, y - wv * 2, x0 + TS + 5, y - wv); c.lineTo(x0 + TS + 5, TY + TS + 5); c.lineTo(x0 - 5, TY + TS + 5); c.closePath(); },
      lin(ctx, 0, y, 0, TY + TS, [[0, colW], [0.25, col], [1, colD]]), 0.35, [x0, TY, TS, TS]);
    ctx.restore();
  }
  ctx.strokeStyle = rgba(col, 0.55 + 0.45 * pulse); ctx.lineWidth = 2 + 2 * pulse; ctx.beginPath(); roundRect(ctx, x0, TY, TS, TS, 14); ctx.stroke();
  // a small sun mark: this tile is one day
  ctx.strokeStyle = rgba(fill > 0.85 ? '#1a1030' : C.cream, 0.7); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(x, TY + 58, 13, 0, 7); ctx.stroke();
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + t * 0.3; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 20, TY + 58 + Math.sin(a) * 20); ctx.lineTo(x + Math.cos(a) * 27, TY + 58 + Math.sin(a) * 27); ctx.stroke(); }
  ctx.fillStyle = rgba(fill > 0.4 ? '#1a1030' : C.cream, 0.85); ctx.font = '22px "Inter SemiBold"'; ctx.letterSpacing = '4px'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(txt, x, TY + 112);
  ctx.restore();
  if (pulse > 0) light(ctx, x, TY + TS / 2, 160, col, 0.45 * pulse);
}

function desk(ctx, x, y, w, col) {
  grainFill(ctx, c => { c.moveTo(x - w / 2, y); c.lineTo(x + w / 2, y); c.lineTo(x + w / 2 + 16, y + 26); c.lineTo(x - w / 2 - 16, y + 26); c.closePath(); }, lin(ctx, 0, y, 0, y + 26, [[0, '#2e2864'], [1, '#1a1640']]), 0.5, [x - w, y, 2 * w, 40]);
  grainFill(ctx, c => c.rect(x - w / 2 - 16, y + 26, w + 32, 200), lin(ctx, 0, y + 26, 0, y + 226, [[0, '#15123a'], [1, '#08081a']]), 0.6, [x - w, y, 2 * w, 240]);
  ctx.strokeStyle = rgba(col, 0.25); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - w / 2, y + 1); ctx.lineTo(x + w / 2, y + 1); ctx.stroke();
}

function human(ctx, t) {
  const b = Math.sin(t * 1.6), wr = Math.sin(t * 8) * 4 + Math.sin(t * 2.1) * 7;
  const lampF = 0.95 + 0.05 * Math.sin(t * 6.3) * Math.sin(t * 1.7);
  // lamp cone and pool
  light(ctx, HUM.x - 120, 660, 420, C.amber, 0.28 * lampF);
  figure(ctx, { x: HUM.x, y: HUM.y + b * 1.5, s: 1.3, facing: 'front', br: b, len: 0.92, lean: 0.12, turn: 0.15 + 0.08 * Math.sin(t * 0.4), tilt: 0.32, lx: -1,
    arms: [{ tx: HUM.x - 40, ty: HUM.y - 52, bend: -1 }, { tx: HUM.x + 46 + wr, ty: HUM.y - 46 + Math.abs(Math.sin(t * 11)) * 3, bend: 1 }] });
  desk(ctx, HUM.x, HUM.y - 40, 380, C.amber);
  // papers and an open book on the desk
  ctx.save(); ctx.translate(HUM.x + 20, HUM.y - 30); ctx.transform(1, 0, -0.5, 0.35, 0, 0);
  grainFill(ctx, c => c.rect(-80, -60, 160, 110), lin(ctx, 0, -60, 0, 50, [[0, '#f2e6c8'], [1, '#b8a888']]), 0.3, [-90, -70, 180, 130]);
  ctx.restore();
  // lamp
  const lx = HUM.x - 150, ly = HUM.y - 40;
  ctx.strokeStyle = '#1a1638'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx - 20, ly - 120); ctx.lineTo(lx + 30, ly - 170); ctx.stroke();
  ctx.save(); ctx.translate(lx + 40, ly - 168); ctx.rotate(0.5);
  cone(ctx, 0, 24, 60, 360, 220, C.amber, 0.1 * lampF);
  grainFill(ctx, c => { c.moveTo(-14, -26); c.lineTo(14, -26); c.lineTo(38, 22); c.lineTo(-38, 22); c.closePath(); }, lin(ctx, -36, 0, 36, 0, [[0, '#3c3270'], [1, '#120e2a']]), 0.5, [-50, -40, 100, 80]);
  ctx.fillStyle = '#ffe6b8'; ctx.beginPath(); ctx.ellipse(0, 22, 38, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  light(ctx, lx + 50, ly - 140, 90, C.amber, 0.55 * lampF);
}

function agent(ctx, a, t, i) {
  const k = ramp(t, a.t, a.t + 0.9); if (k <= 0) return;
  const b = Math.sin(t * 1.6 + a.ph), flick = 0.9 + 0.1 * Math.sin(t * 9 + a.ph);
  const top = lerp(a.y + 60, a.y - 330, out(k));
  // materialising: revealed from the desk upward, a bright scan line at the edge
  light(ctx, a.x, a.y - 120, 260, C.cyan, 0.16 * flick * k);
  ctx.save(); ctx.beginPath(); ctx.rect(a.x - 200, top, 400, 600); ctx.clip();
  ctx.globalAlpha = 0.92;
  figure(ctx, { x: a.x, y: a.y + b, s: 1.12, facing: 'front', br: b, len: 0.95, lean: 0.03, turn: 0.1 * Math.sin(t * 0.5 + a.ph), tilt: 0.2, lx: 1, pal: CYPAL, skin: CYSKIN, hair0: '#2a8fb0', grain: 0.3,
    arms: [{ tx: a.x - 38 + Math.sin(t * 14 + a.ph) * 3, ty: a.y - 44 + Math.abs(Math.sin(t * 10 + a.ph)) * 3, bend: -1 }, { tx: a.x + 42 + Math.sin(t * 12 + a.ph) * 3, ty: a.y - 44 + Math.abs(Math.sin(t * 11)) * 3, bend: 1 }] });
  ctx.restore();
  if (k < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(C.cyanW, 0.7 * (1 - k)); ctx.fillRect(a.x - 110, top - 2, 220, 3); ctx.restore(); light(ctx, a.x, top, 140, C.cyan, 0.5 * (1 - k)); }
  ctx.save(); ctx.globalAlpha = k;
  desk(ctx, a.x, a.y - 40, 250, C.cyan);
  // laptop seen from behind, glowing edge
  grainFill(ctx, c => { c.moveTo(a.x - 62, a.y - 120); c.lineTo(a.x + 62, a.y - 120); c.lineTo(a.x + 70, a.y - 40); c.lineTo(a.x - 70, a.y - 40); c.closePath(); }, lin(ctx, 0, a.y - 120, 0, a.y - 40, [[0, '#2e2d5c'], [1, '#14143a']]), 0.4, [a.x - 80, a.y - 130, 160, 100]);
  ctx.strokeStyle = rgba(C.cyanW, 0.7 * flick); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.x - 62, a.y - 120); ctx.lineTo(a.x + 62, a.y - 120); ctx.stroke();
  ctx.restore();
  // sparks rising off the agent while it works
  if (t > F0 - 0.5 && t < F1 + 0.4) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let j = i; j < SPARK.length; j += 3) { const [p, q, r2, s2] = SPARK[j], ph = (p + t * (0.35 + q * 0.3)) % 1; const y = a.y - 160 - ph * 200, x = a.x + (r2 - 0.5) * 140 + Math.sin(t * 2 + j) * 8;
      ctx.fillStyle = rgba(C.cyanW, 0.5 * Math.sin(ph * Math.PI) * ramp(t, F0 - 0.5, F0) * (1 - ramp(t, F1, F1 + 0.4))); ctx.beginPath(); ctx.arc(x, y, 1.2 + s2 * 1.8, 0, 7); ctx.fill(); }
    ctx.restore();
  }
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.06, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 11) * 6, dy = drift(t, 1, 13) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  const fill = L.ease((t - F0) / (F1 - F0));
  const agentsOn = ramp(t, 78.5, 79.4);
  layer(0.3, () => {
    cached(ctx, 'bg', -100, -100, W + 100, H + 100, c => {
      grainFill(c, cc => cc.rect(-100, -100, W + 200, H + 200), lin(c, 0, 0, 0, H, [[0, '#0b0d28'], [0.6, '#17163c'], [1, '#0b0a1e']]), 0.55);
      grainFill(c, cc => cc.rect(-100, 760, W + 200, 400), lin(c, 0, 760, 0, H, [[0, '#14123a'], [1, '#07071a']]), 0.6);
      // a quiet divider between the human and the agents
      c.fillStyle = 'rgba(164,159,196,0.10)'; c.fillRect(700, 210, 2, 560);
    });
    light(ctx, 1310, 560, 760, C.cyan, 0.13 * agentsOn * (0.9 + 0.1 * Math.sin(t * 1.1)));
    light(ctx, 380, 560, 560, C.amber, 0.10);
  });
  layer(0.55, () => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [a, b, c] of MOTES) { const x = (a * W + t * (6 + c * 8)) % W, y = b * 760 + Math.sin(t * 0.6 + c * 9) * 14; ctx.fillStyle = rgba(x > 700 ? C.cyan : '#ffd9a0', 0.16 * (0.5 + 0.5 * Math.sin(t * 1.3 + a * 20))); ctx.beginPath(); ctx.arc(x, y, 1.2 + c * 1.5, 0, 7); ctx.fill(); }
    ctx.restore();
  });
  layer(0.8, () => {
    // headers
    ctx.save(); ctx.font = '22px "Inter Medium"'; ctx.letterSpacing = '6px'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.globalAlpha = ramp(t, 77.6, 78.3); ctx.fillStyle = C.amber; ctx.fillText('HUMAN RESEARCHER', HUM.x, TY - 26);
    ctx.globalAlpha = agentsOn; ctx.fillStyle = C.cyan; ctx.fillText('AI AGENTS', AG[1].x, TY - 26);
    ctx.restore();
    // the tiles: one for the human, three for the agents, all filling in the same stretch of time
    const ha = ramp(t, 77.6, 78.3);
    const hp = Math.exp(-Math.max(0, t - 83.2) * 2) * (t > 83.2 ? 1 : 0) + Math.exp(-Math.max(0, t - F1) * 3) * (t > F1 ? 0.6 : 0);
    ctx.save(); ctx.globalAlpha = ha; tile(ctx, HUM.x, t, fill, C.amber, C.amberD, '#ffe2b8', hp, 'DAY 1'); ctx.restore();
    const three = Math.exp(-Math.max(0, t - 80.36) * 2) * (t > 80.36 ? 1 : 0) + Math.exp(-Math.max(0, t - F1) * 3) * (t > F1 ? 0.6 : 0);
    AG.forEach((a, i) => { ctx.save(); ctx.globalAlpha = ramp(t, a.t, a.t + 0.6); tile(ctx, a.x, t, fill, C.cyan, C.cyanD, C.cyanW, three * (0.85 + 0.15 * Math.sin(t * 6 + i)), 'DAY ' + (i + 1)); ctx.restore(); });
    // the shared clock: a thin line under the tiles that both sides run along together
    const cy = TY + TS + 26;
    ctx.save(); ctx.globalAlpha = ramp(t, 79.0, 79.6) * (1 - ramp(t, 83.6, 84.4));
    ctx.strokeStyle = rgba(C.lav, 0.3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(HUM.x - TS / 2, cy); ctx.lineTo(AG[2].x + TS / 2, cy); ctx.stroke();
    const cx = lerp(HUM.x - TS / 2, AG[2].x + TS / 2, fill);
    ctx.strokeStyle = rgba(C.cream, 0.8); ctx.beginPath(); ctx.moveTo(HUM.x - TS / 2, cy); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fill();
    ctx.font = '18px "Inter Medium"'; ctx.letterSpacing = '4px'; ctx.fillStyle = C.lav; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('SAME TIME', AG[2].x + TS / 2 + 16, cy);
    ctx.restore();
  });
  layer(1.0, () => {
    human(ctx, t);
    AG.forEach((a, i) => agent(ctx, a, t, i));
  });
  label(ctx, t, 77.12, T1 + 1, 'OpenAI', 'agent research time', 96, 40, { color: C.cyan });
  stamp(ctx, t, 82.64, T1 + 1, '3 : 1', 'agent days per human day', { size: 120, x: 1240, y: 24 });
}

module.exports = { T0, T1, draw };
