// "Anthropic says its engineers merge about eight times as much code per day as they did in 2024."
// Two engineers at their screens, one above the other. From each screen a branch carries blocks of code into a
// main line, and every day's merged blocks stack into a column on the right. 2024: one block a day (amber).
// Now: eight a day (cyan). The columns read as a bar chart that builds itself.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, label, stamp, out } = L;
const { figure, roundRect } = require('./s_timeline');

const T0 = 69.7, T1 = 77.0;

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

const D0 = 70.3, P = 1.0, TT = 1.4;          // first day starts, length of a "day", travel time of a block
const BW = 52, BH = 22, GAP = 5, COL0 = 1262, COLW = 96;
// lanes: o = vertical offset; per = blocks per day
const LANES = [
  { o: 0, per: 1, col: C.amber, colD: '#7a3b17', colW: '#ffe2b8', name: '2024', pal: ['#e8964e', '#a85424', '#401a0a'], t0: 70.0 },
  { o: 430, per: 8, col: C.cyan, colD: C.cyanD, colW: C.cyanW, name: 'Now', pal: ['#ffc27c', '#cf7a36', '#5a2a12'], t0: 70.2 },
];
for (const ln of LANES) {
  ln.mainY = 420 + ln.o; ln.base = 470 + ln.o; ln.mon = [190, 250 + ln.o, 260, 150];
  // the branch: from the screen's right edge, curving down into the main line; then along main to the pile
  const pts = [], [mx, my, mw, mh] = ln.mon, sx = mx + mw + 6, sy = my + 50, nx = 760;
  for (let i = 0; i <= 30; i++) { const u = i / 30, a = 1 - u; pts.push([a * a * a * sx + 3 * a * a * u * (sx + 200) + 3 * a * u * u * (nx - 170) + u * u * u * nx, a * a * a * sy + 3 * a * a * u * sy + 3 * a * u * u * ln.mainY + u * u * u * ln.mainY]); }
  for (let i = 1; i <= 20; i++) pts.push([lerp(nx, 1210, i / 20), ln.mainY]);
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  ln.pts = pts; ln.len = len; ln.node = [nx, ln.mainY];
  ln.mergeU = len[30] / len[len.length - 1];
}
function along(ln, u) {
  const d = clamp(u) * ln.len[ln.len.length - 1]; let i = 1; while (i < ln.len.length - 1 && ln.len[i] < d) i++;
  const k = (d - ln.len[i - 1]) / Math.max(1e-6, ln.len[i] - ln.len[i - 1]);
  return [lerp(ln.pts[i - 1][0], ln.pts[i][0], k), lerp(ln.pts[i - 1][1], ln.pts[i][1], k)];
}
const R = rng(72);
const LINES = Array.from({ length: 64 }, () => [0.3 + R() * 0.5, 0.2 + R() * 0.55]);
const MOTES = Array.from({ length: 50 }, () => [R(), R(), R()]);

function block(ctx, x, y, ln, i, a, glow) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  grainFill(ctx, c => roundRect(c, -BW / 2, -BH / 2, BW, BH, 5), lin(ctx, 0, -BH / 2, 0, BH / 2, [[0, ln.colW], [0.35, ln.col], [1, ln.colD]]), 0.3, [-BW, -BH, 2 * BW, 2 * BH]);
  const [a1, a2] = LINES[i % LINES.length];
  ctx.fillStyle = rgba(ln.colD, 0.75); ctx.fillRect(-BW / 2 + 7, -5, (BW - 14) * a1, 3); ctx.fillRect(-BW / 2 + 12, 2, (BW - 18) * a2, 3);
  ctx.restore();
  if (glow > 0) light(ctx, x, y, 46, ln.col, glow);
}

// a chair back in front of a seated figure seen from behind: covers the lower back
function chair(ctx, x, hip, s, col) {
  const w = 52 * s, top = hip - 62 * s, bot = hip + 120 * s;
  const p = c => { c.moveTo(x - w, bot); c.lineTo(x - w * 1.02, top + 18 * s); c.quadraticCurveTo(x - w, top, x - w * 0.8, top - 2 * s); c.quadraticCurveTo(x, top - 10 * s, x + w * 0.8, top - 2 * s); c.quadraticCurveTo(x + w, top, x + w * 1.02, top + 18 * s); c.lineTo(x + w, bot); c.closePath(); };
  ctx.save(); ctx.translate(0, -3); grainFill(ctx, p, rgba(col, 0.35), 0); ctx.restore();
  grainFill(ctx, p, lin(ctx, x - w, top, x + w, bot, [[0, '#2a2458'], [1, '#0a0a1c']]), 0.55, [x - w - 10, top - 20, 2 * w + 20, bot - top + 30]);
}

function engineer(ctx, ln, t, act) {
  const [mx, my, mw, mh] = ln.mon, flick = 0.92 + 0.08 * Math.sin(t * 9 + ln.o) * Math.sin(t * 2.3);
  // desk
  grainFill(ctx, c => { c.moveTo(60, my + mh + 6); c.lineTo(560, my + mh + 6); c.lineTo(600, my + mh + 40); c.lineTo(20, my + mh + 40); c.closePath(); }, lin(ctx, 0, my + mh, 0, my + mh + 40, [[0, '#2a2560'], [1, '#14123a']]), 0.5, [0, my + mh, 620, 60]);
  // screen
  ctx.fillStyle = '#05060f'; ctx.beginPath(); roundRect(ctx, mx - 10, my - 10, mw + 20, mh + 20, 8); ctx.fill();
  ctx.fillRect(mx + mw / 2 - 8, my + mh + 8, 16, 14);
  const glass = ln.per > 1 ? [[0, '#3fb6d8'], [0.6, '#137a9c'], [1, '#08405c']] : [[0, '#c9803e'], [0.6, '#7a3e1c'], [1, '#3a1a0c']];
  grainFill(ctx, c => roundRect(c, mx, my, mw, mh, 4), lin(ctx, mx, my, mx + mw * 0.5, my + mh, glass), 0.3, [mx, my, mw, mh]);
  // lines being written on the screen
  ctx.save(); ctx.beginPath(); ctx.rect(mx + 8, my + 8, mw - 16, mh - 16); ctx.clip();
  const speed = ln.per > 1 ? 9 : 2.2, sc = (t * speed) % 1, base = Math.floor(t * speed);
  for (let k = 0; k < 9; k++) { const y = my + 18 + k * 16 - sc * 16; const [a1] = LINES[(base + k) % LINES.length]; ctx.fillStyle = rgba(ln.colW, 0.55); ctx.fillRect(mx + 16 + (k % 3) * 10, y, (mw - 50) * a1, 5); }
  ctx.restore();
  light(ctx, mx + mw / 2, my + mh / 2, 260, ln.col, (ln.per > 1 ? 0.3 : 0.18) * flick * act);
  // the engineer, from behind, typing
  const b = Math.sin(t * 1.6 + ln.o), ty = Math.sin(t * (ln.per > 1 ? 13 : 7)) * 3;
  figure(ctx, { x: mx + mw / 2 + 6, y: my + mh + 195 + b, s: 1.12, facing: 'back', br: b, len: 0.95, lean: -0.03, turn: 0.15 * Math.sin(t * 0.5 + ln.o), tilt: 0.12, lx: 1,
    pal: ln.pal, rim: ln.col, rimA: 0.55, rimDx: 0, rimDy: -4,
    arms: [{ a1: 1.95, a2: 0.15 + ty * 0.02, behind: true }, { a1: 1.19, a2: 2.99 - ty * 0.02, behind: true }] });
      chair(ctx, mx + mw / 2 + 6, my + mh + 195 + b, 1.12, ln.col);
}

function lane(ctx, ln, t, li) {
  const act = ramp(t, ln.t0, ln.t0 + 0.8), hl = li === 0 ? Math.exp(-Math.max(0, t - 75.5) * 1.5) * (t > 75.44 ? 1 : 0) : 0;
  ctx.save(); ctx.globalAlpha = act;
  // the main line, with old commits along it on the left
  ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(ln.col, 0.18); ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(470, ln.mainY); ctx.lineTo(1215, ln.mainY); ctx.stroke();
  ctx.strokeStyle = rgba(ln.col, 0.55); ctx.lineWidth = 3; ctx.stroke();
  for (let k = 0; k < 4; k++) { ctx.fillStyle = rgba(ln.col, 0.5); ctx.beginPath(); ctx.arc(500 + k * 60, ln.mainY, 6, 0, 7); ctx.fill(); }
  // the branch
  ctx.strokeStyle = rgba(ln.col, 0.16); ctx.lineWidth = 12; ctx.beginPath(); ln.pts.slice(0, 31).forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke();
  ctx.strokeStyle = rgba(ln.col, 0.5); ctx.lineWidth = 3; ctx.setLineDash([10, 9]); ctx.lineDashOffset = -t * 40; ctx.stroke(); ctx.setLineDash([]);
  // pile floor with day ticks
  ctx.strokeStyle = rgba(C.lav, 0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(COL0 - 50, ln.base + BH / 2 + 6); ctx.lineTo(COL0 + 6 * COLW + 10, ln.base + BH / 2 + 6); ctx.stroke();
  ctx.fillStyle = rgba(C.lav, 0.7); ctx.font = '15px "Inter Medium"'; ctx.letterSpacing = '2px'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  for (let d = 0; d < 6; d++) { const a = ramp(t, D0 + d * P + TT - 0.2, D0 + d * P + TT + 0.2); if (a <= 0) continue; ctx.globalAlpha = act * a * 0.8; ctx.fillText('DAY ' + (d + 1), COL0 + d * COLW, ln.base + BH / 2 + 16); }
  ctx.globalAlpha = act; ctx.textAlign = 'left';
  // the lane's year
  ctx.fillStyle = C.cream; ctx.font = '64px "Instrument Serif"'; ctx.textBaseline = 'alphabetic'; ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 16;
  ctx.save(); ctx.translate(520, ln.mon[1] + 40); ctx.scale(1 + 0.12 * hl, 1 + 0.12 * hl); ctx.fillStyle = hl > 0.05 ? '#ffe2b8' : C.cream; ctx.fillText(ln.name, 0, 0); ctx.restore();
  ctx.shadowBlur = 0;
  ctx.restore();
  if (hl > 0) light(ctx, 590, ln.mon[1] + 20, 160, C.amber, 0.4 * hl);
  engineer(ctx, ln, t, act);
  // merge node: flashes as each block joins main
  let flash = 0;
  const blocks = [];
  for (let d = 0; d < 7; d++) for (let j = 0; j < ln.per; j++) {
    const te = D0 + d * P + (j + 0.5) * P / ln.per - P / (2 * ln.per) + (ln.per === 1 ? 0.3 : 0);
    if (t < te) continue;
    const u = (t - te) / TT, i = d * ln.per + j;
    const tm = te + ln.mergeU * TT; flash = Math.max(flash, Math.exp(-Math.max(0, t - tm) * 9) * (t > tm ? 1 : 0));
    const tx = COL0 + d * COLW, ty = ln.base - j * (BH + GAP);
    if (u < 1) { const p = along(ln, out(u * 0.15) * 0.15 + u * 0.85); blocks.push([p[0], p[1], i, 1, 0.12]); }
    else { const k = clamp((u - 1) * TT / 0.35), e = out(k), hop = Math.sin(k * Math.PI) * 30;
      blocks.push([lerp(1210, tx, e), lerp(ln.mainY, ty, e) - hop, i, 1, 0.3 * Math.exp(-Math.max(0, (u - 1) * TT - 0.3) * 3)]); }
  }
  light(ctx, ln.node[0], ln.node[1], 70 + 50 * flash, ln.col, (0.25 + 0.6 * flash) * act);
  ctx.save(); ctx.globalAlpha = act; ctx.fillStyle = ln.colW; ctx.beginPath(); ctx.arc(ln.node[0], ln.node[1], 9 + 4 * flash, 0, 7); ctx.fill(); ctx.restore();
  for (const b of blocks) block(ctx, b[0], b[1], ln, b[2], b[3], b[4]);
  // a soft glow on the pile, growing with what has been merged
  const n = blocks.length;
  light(ctx, COL0 + 160, ln.base - 40, 260 + n * 4, ln.col, Math.min(0.3, 0.02 + n * (ln.per > 1 ? 0.006 : 0.03)) * act);
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.06, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 7) * 6, dy = drift(t, 1, 9) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  layer(0.3, () => {
    cached(ctx, 'bg', -100, -100, W + 100, H + 100, c => {
      grainFill(c, cc => cc.rect(-100, -100, W + 200, H + 200), lin(c, 0, 0, 0, H, [[0, '#0b0d28'], [0.5, '#151640'], [1, '#0a0a1e']]), 0.55);
      c.strokeStyle = 'rgba(164,159,196,0.05)'; c.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { c.beginPath(); c.moveTo(x, -100); c.lineTo(x, H + 100); c.stroke(); }
      for (let y = 0; y < H; y += 60) { c.beginPath(); c.moveTo(-100, y); c.lineTo(W + 100, y); c.stroke(); }
      // a soft divider between then and now
      c.fillStyle = lin(c, 0, 600, 0, 680, [[0, 'rgba(4,4,16,0)'], [0.5, 'rgba(4,4,16,0.35)'], [1, 'rgba(4,4,16,0)']]); c.fillRect(-100, 600, W + 200, 80);
    });
    light(ctx, 1500, 760, 700, C.cyan, 0.08 + 0.04 * Math.sin(t * 0.9));
  });
  layer(0.6, () => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [a, b, c] of MOTES) { const x = (a * W + t * (8 + c * 10)) % W, y = b * H + Math.sin(t * 0.6 + c * 9) * 14; ctx.fillStyle = rgba(c < 0.5 ? C.cyan : C.lav, 0.18 * (0.5 + 0.5 * Math.sin(t * 1.3 + a * 20))); ctx.beginPath(); ctx.arc(x, y, 1.2 + c * 1.6, 0, 7); ctx.fill(); }
    ctx.restore();
  });
  layer(1.0, () => { lane(ctx, LANES[0], t, 0); lane(ctx, LANES[1], t, 1); });
  label(ctx, t, 70.12, T1 + 1, 'Anthropic', "engineers' merged code per day", 96, 40, { color: C.cyan });
  stamp(ctx, t, 72.64, T1 + 1, '8x', 'as much code as 2024', { size: 170, x: 1380, y: 30 });
}

module.exports = { T0, T1, draw };
