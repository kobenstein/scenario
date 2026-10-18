// "...and at the UN, the US government said no to global control of AI."
// A large assembly hall seen from the back rows: curved tiers of delegates, each desk with its small warm lamp, facing
// a podium under a tall pale wall. On "said no" one delegation's lamp goes out and its delegate leans back; its
// nameplate reads United States. The camera drifts slowly toward that one dark seat. Sober, quiet.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, label, out, ease } = L;

const T0 = 546.20, T1 = 551.80;

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

// tiers: arcs around the podium at (960, 250); rows from far (small) to near (big)
const PX = 960, PY = 250;
const ROWS = [];
for (let r = 0; r < 7; r++) {
  const k = r / 6, ry = lerp(140, 640, Math.pow(k, 1.15)), rx = ry * 2.1, s = lerp(0.32, 1.05, Math.pow(k, 1.1));
  const n = Math.round(lerp(13, 11, k)), seats = [];
  const span = lerp(1.05, 0.62, k);   // angular half-span (near rows cut by frame anyway)
  for (let i = 0; i < n; i++) { const a = Math.PI / 2 + lerp(-span, span, n > 1 ? i / (n - 1) : 0.5); seats.push({ x: PX + Math.cos(a) * rx, y: PY + Math.sin(a) * ry, a, s }); }
  ROWS.push({ ry, rx, s, seats });
}
const USR = 3, USI = 5;     // the US seat: middle row, just left of centre
const RS = rng(546);
ROWS.forEach(row => row.seats.forEach(st => { st.ph = RS() * 6; st.hair = RS(); st.coat = RS(); st.empty = RS() < 0.07; }));
ROWS[USR].seats[USI].empty = false;

function hallArt(c) {
  gf(c, cc => cc.rect(-100, -100, W + 200, H + 200), lin(c, 0, -100, 0, H, [[0, '#0a0b24'], [0.4, '#141336'], [1, '#0c0a20']]), 0.6);
  // the tall back wall behind the podium, pale with vertical panels
  gf(c, cc => { cc.moveTo(560, -60); cc.lineTo(1360, -60); cc.lineTo(1300, 250); cc.lineTo(620, 250); cc.closePath(); }, lin(c, 0, -60, 0, 250, [[0, '#3b3a72'], [1, '#5a5690']]), 0.5);
  c.strokeStyle = 'rgba(10,10,32,0.35)'; c.lineWidth = 3;
  for (let k = 0; k <= 12; k++) { const x0 = lerp(560, 1360, k / 12), x1 = lerp(620, 1300, k / 12); c.beginPath(); c.moveTo(x0, -60); c.lineTo(x1, 250); c.stroke(); }
  // an empty round emblem shape on the wall (no logo)
  c.strokeStyle = 'rgba(243,239,226,0.25)'; c.lineWidth = 4; c.beginPath(); c.arc(960, 70, 60, 0, 7); c.stroke();
  c.lineWidth = 2; c.beginPath(); c.arc(960, 70, 42, 0, 7); c.stroke();
  // podium and dais
  gf(c, cc => { cc.moveTo(700, 250); cc.lineTo(1220, 250); cc.lineTo(1260, 300); cc.lineTo(660, 300); cc.closePath(); }, lin(c, 0, 250, 0, 300, [[0, '#4a4088'], [1, '#262052']]), 0.45);
  gf(c, cc => cc.rect(920, 205, 80, 60), lin(c, 0, 205, 0, 265, [[0, '#6a5aa8'], [1, '#3b2f6e']]), 0.4);
  // side walls
  gf(c, cc => { cc.moveTo(-100, -100); cc.lineTo(560, -60); cc.lineTo(620, 250); cc.lineTo(-100, 520); cc.closePath(); }, lin(c, -100, 0, 600, 0, [[0, '#07081c'], [1, '#1a1846']]), 0.55);
  gf(c, cc => { cc.moveTo(W + 100, -100); cc.lineTo(1360, -60); cc.lineTo(1300, 250); cc.lineTo(W + 100, 520); cc.closePath(); }, lin(c, W + 100, 0, 1320, 0, [[0, '#07081c'], [1, '#1a1846']]), 0.55);
  // the tiered floor as bands
  ROWS.forEach((row, r) => {
    c.fillStyle = r % 2 ? 'rgba(30,26,70,0.85)' : 'rgba(24,20,58,0.85)';
    c.beginPath(); c.ellipse(PX, PY, row.rx + 120 * row.s, row.ry + 40 * row.s, 0, 0, Math.PI); c.ellipse(PX, PY, Math.max(10, row.rx - 120 * row.s), Math.max(10, row.ry - 30 * row.s), 0, Math.PI, 0, true); c.closePath(); c.fill();
  });
}

function delegate(ctx, t, st, dark, lean) {
  const s = st.s, br = Math.sin(t * 1.5 + st.ph) * 1.2 * s, turn = Math.sin(t * 0.4 + st.ph * 2) * 0.15;
  const x = st.x, y = st.y;
  const box = [-80 * s, -110 * s, 160 * s, 170 * s];
  if (st.empty) return;
  // the delegate from behind: shoulders and head, leaning back on "no"
  ctx.save(); ctx.translate(x, y - lean * 6 * s); ctx.rotate(st.a - Math.PI / 2 + turn * 0.2);
  const coat = st.coat < 0.3 ? ['#c9702e', '#5a2a12'] : st.coat < 0.8 ? ['#3a3470', '#141236'] : ['#e8964e', '#7a3b17'];
  gf(ctx, c => { c.moveTo(-38 * s, 40 * s); c.bezierCurveTo(-42 * s, -6 * s, -36 * s, -30 * s + br, 0, -32 * s + br); c.bezierCurveTo(36 * s, -30 * s + br, 42 * s, -6 * s, 38 * s, 40 * s); c.closePath(); },
    lin(ctx, 0, -32 * s, 0, 40 * s, [[0, coat[0]], [1, coat[1]]]), 0.4, box);
  gf(ctx, c => c.ellipse(turn * 10 * s, -56 * s + br - lean * 4 * s, 17 * s, 20 * s, 0, 0, 7), st.hair < 0.3 ? '#1c0a05' : st.hair < 0.7 ? '#3a1a0c' : '#a49fc4', 0.35, box);
  ctx.restore();
  const on = 1 - dark;
  // rim of warm light from the desk on the head; a dimmed silhouette once the lamp is off
  if (on > 0.01) { ctx.fillStyle = rgba('#ffb35c', 0.35 * on); ctx.beginPath(); ctx.ellipse(x, y - 70 * s, 10 * s, 3 * s, 0, 0, 7); ctx.fill(); }
  if (dark > 0) { ctx.fillStyle = rgba('#070918', 0.5 * dark); ctx.beginPath(); ctx.ellipse(x, y - 20 * s, 50 * s, 70 * s, 0, 0, 7); ctx.fill(); }
}

function draw(ctx, t) {
  const k = (t - T0) / (T1 - T0);
  const us = ROWS[USR].seats[USI];
  // slow push toward the US seat
  const p = ease(ramp(t, 546.6, 550.6));
  const z = lerp(1.0, 1.9, p), dx = drift(t, 1, 2) * 5, dy = drift(t, 1, 9) * 3;
  const fx = lerp(W / 2, us.x, p * 0.8), fy = lerp(H / 2, us.y - 40, p * 0.8);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-fx + dx, -fy + dy);
  cached(ctx, 'hall', -100, -100, W + 100, H + 100, hallArt);
  // soft light on the wall and the empty podium
  light(ctx, 960, 120, 520, '#a49fc4', 0.16);
  light(ctx, 960, 230, 160, '#ffe2a8', 0.18);
  const no = ramp(t, 548.62, 549.0);
  ROWS.forEach((row, r) => {
    // the row's desk: one continuous curved band in front of the delegates
    const s = row.s, span = Math.abs(row.seats[0].a - Math.PI / 2) + 0.12, f = 1 - 92 * s / row.ry;
    ctx.save(); ctx.beginPath();
    ctx.ellipse(PX, PY, row.rx * f + 26 * s, row.ry * f + 10 * s, 0, Math.PI / 2 - span, Math.PI / 2 + span);
    ctx.ellipse(PX, PY, row.rx * f - 26 * s, row.ry * f - 10 * s, 0, Math.PI / 2 + span, Math.PI / 2 - span, true); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, PY + row.ry * f - 12 * s, 0, PY + row.ry * f + 12 * s, [[0, '#4a4088'], [1, '#1e1a44']]); ctx.fill();
    ctx.strokeStyle = rgba('#ffe2a8', 0.18); ctx.lineWidth = 1.5 * s; ctx.beginPath(); ctx.ellipse(PX, PY, row.rx * f + 26 * s, row.ry * f + 10 * s, 0, Math.PI / 2 - span, Math.PI / 2 + span); ctx.stroke();
    ctx.restore();
    // one small lamp per seat on the desk
    row.seats.forEach((st, i) => {
      const isUS = r === USR && i === USI, on = isUS ? 1 - no : 1;
      const lx = PX + Math.cos(st.a) * row.rx * f, ly = PY + Math.sin(st.a) * row.ry * f - 4 * s;
      ctx.fillStyle = on > 0.5 ? rgba('#fff1cf', 0.95) : '#2a2c50'; ctx.beginPath(); ctx.ellipse(lx, ly, 9 * s, 4.5 * s, 0, 0, 7); ctx.fill();
      if (on > 0.01) { light(ctx, lx, ly, 110 * s, C.amber, 0.38 * on); light(ctx, lx, ly, 20 * s, '#fff1cf', 0.6 * on); }
    });
    row.seats.forEach((st, i) => { const isUS = r === USR && i === USI; delegate(ctx, t, st, isUS ? no : 0, isUS ? ramp(t, 548.7, 549.4) : 0); });
  });
  // the nameplate on the US desk
  const na = ramp(t, 547.8, 548.3);
  if (na > 0) {
    ctx.save(); ctx.translate(PX + Math.cos(us.a) * ROWS[USR].rx * (1 - 92 * us.s / ROWS[USR].ry), PY + Math.sin(us.a) * ROWS[USR].ry * (1 - 92 * us.s / ROWS[USR].ry) + 14 * us.s); ctx.rotate(us.a - Math.PI / 2); ctx.globalAlpha = na;
    ctx.fillStyle = '#e9e2cc'; ctx.fillRect(-58 * us.s, -20 * us.s, 116 * us.s, 18 * us.s);
    ctx.fillStyle = '#1a1640'; ctx.font = `${Math.round(12 * us.s)}px "Inter SemiBold"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('UNITED STATES', 0, -11 * us.s);
    ctx.restore();
  }
  // a faint cold cast over the dark seat
  if (no > 0) light(ctx, us.x, us.y - 40 * us.s, 120 * us.s, '#5a6ab0', 0.12 * no);
  ctx.restore();
  label(ctx, t, 547.0, T1 + 0.4, 'United Nations', 'the US says no to global control of AI', 110, 110);
}

module.exports = { T0, T1, draw };
