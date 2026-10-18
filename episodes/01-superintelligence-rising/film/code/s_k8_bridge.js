// "None of this is finished. Nobody can properly check a deal like that yet,"
// A bridge being built from two cliffs over a misty gorge. Cranes on both ends; a segment is lowered, but the gap stays open.
// On "check" a worker at the end of one deck lifts a lamp toward the other side; the beam dies in the fog before it gets there.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, ease } = L;

const T0 = 541.80, T1 = 546.50;

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
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}

const DECK = 560, GAP_L = 830, GAP_R = 1150;   // deck height and the open gap
function skyArt(c) {
  gf(c, cc => cc.rect(-100, -100, W + 200, H + 200), lin(c, 0, -100, 0, H, [[0, '#070820'], [0.45, '#1a1846'], [0.7, '#3b2f6e'], [1, '#14112f']]), 0.55);
  const r = rng(4);
  for (let i = 0; i < 160; i++) { const s = r(); c.fillStyle = rgba('#e6e2f8', 0.1 + 0.4 * s); c.fillRect(r() * W, r() * 420 - 80, 1 + s * 1.4, 1 + s * 1.4); }
  // far ridges
  for (const [y0, col, amp] of [[640, '#2a2458', 50], [700, '#1e1a44', 40]]) gf(c, cc => { cc.moveTo(-100, H); for (let x = -100; x <= W + 100; x += 40) cc.lineTo(x, y0 - amp * Math.abs(Math.sin(x * 0.003 + y0)) - 20 * Math.sin(x * 0.011)); cc.lineTo(W + 100, H); cc.closePath(); }, col, 0.5);
}
function cliffsArt(c) {
  // left and right cliffs dropping into the gorge
  gf(c, cc => { cc.moveTo(-100, 520); cc.lineTo(330, 540); cc.lineTo(380, 600); cc.lineTo(420, 760); cc.lineTo(470, 980); cc.lineTo(520, H + 100); cc.lineTo(-100, H + 100); cc.closePath(); }, lin(c, 0, 520, 380, H, [[0, '#2c2654'], [1, '#0c0a20']]), 0.6);
  gf(c, cc => { cc.moveTo(W + 100, 500); cc.lineTo(1600, 530); cc.lineTo(1560, 610); cc.lineTo(1520, 780); cc.lineTo(1470, 1000); cc.lineTo(1440, H + 100); cc.lineTo(W + 100, H + 100); cc.closePath(); }, lin(c, W, 500, 1500, H, [[0, '#2c2654'], [1, '#0c0a20']]), 0.6);
  c.strokeStyle = 'rgba(164,159,196,0.18)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-100, 520); c.lineTo(330, 540); c.stroke(); c.beginPath(); c.moveTo(W + 100, 500); c.lineTo(1600, 530); c.stroke();
  // piers rising from the gorge
  for (const px of [560, 1380]) gf(c, cc => { cc.moveTo(px - 26, DECK + 30); cc.lineTo(px + 26, DECK + 30); cc.lineTo(px + 40, H + 100); cc.lineTo(px - 40, H + 100); cc.closePath(); }, lin(c, px - 40, 0, px + 40, 0, [[0, '#3a3270'], [1, '#141236']]), 0.55);
  // the two half decks with truss
  for (const [x0, x1] of [[300, GAP_L], [GAP_R, 1640]]) {
    gf(c, cc => cc.rect(x0, DECK, x1 - x0, 30), lin(c, 0, DECK, 0, DECK + 30, [[0, '#4a4088'], [1, '#1e1a44']]), 0.45);
    c.strokeStyle = '#2a2458'; c.lineWidth = 5;
    for (let x = x0; x < x1 - 20; x += 60) { c.beginPath(); c.moveTo(x, DECK + 30); c.lineTo(x + 30, DECK + 80); c.lineTo(x + 60, DECK + 30); c.stroke(); }
    c.beginPath(); c.moveTo(x0, DECK + 80); c.lineTo(x1 - 20, DECK + 80); c.stroke();
    c.fillStyle = 'rgba(164,159,196,0.3)'; c.fillRect(x0, DECK - 2, x1 - x0, 3);
    // railing posts
    c.fillStyle = '#2a2458'; for (let x = x0; x < x1; x += 30) c.fillRect(x, DECK - 22, 3, 22); c.fillRect(x0, DECK - 22, x1 - x0, 3);
  }
  // rebar sticking out of the unfinished ends
  c.strokeStyle = '#5a4a8a'; c.lineWidth = 2;
  for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(GAP_L, DECK + 6 + k * 5); c.lineTo(GAP_L + 18 + k * 3, DECK + 4 + k * 6); c.stroke(); c.beginPath(); c.moveTo(GAP_R, DECK + 6 + k * 5); c.lineTo(GAP_R - 18 - k * 3, DECK + 4 + k * 6); c.stroke(); }
}

// tower crane: mast at x, jib swings slightly; hook carries a hanging segment
function crane(ctx, t, x, dir, ph, load) {
  const top = 170, sw = 0.03 * Math.sin(t * 0.5 + ph);
  ctx.strokeStyle = '#4a4088'; ctx.lineWidth = 3;
  // lattice mast
  for (let y = DECK; y > top; y -= 36) { ctx.strokeRect(x - 12, y - 36, 24, 36); ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y - 36); ctx.stroke(); }
  ctx.save(); ctx.translate(x, top); ctx.scale(1, 1); ctx.rotate(sw);
  const jl = 420 * dir;
  ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-120 * dir, 0); ctx.lineTo(jl, 0); ctx.stroke();
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -60); ctx.lineTo(jl, 0); ctx.moveTo(0, -60); ctx.lineTo(-120 * dir, 0); ctx.stroke();
  for (let k = 0; k < 10; k++) { ctx.beginPath(); ctx.moveTo(k * jl / 10, 0); ctx.lineTo((k + 0.5) * jl / 10, -10); ctx.lineTo((k + 1) * jl / 10, 0); ctx.stroke(); }
  gf(ctx, c => c.rect(-120 * dir - (dir > 0 ? 0 : 50), -4, 50, 30), '#3a3270', 0.3, null);
  // trolley and cable
  const tx = jl * load.trolley, cl = load.len;
  ctx.strokeStyle = 'rgba(120,110,180,0.8)'; ctx.lineWidth = 1.5;
  const swing = 6 * Math.sin(t * 1.1 + ph);
  ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx + swing, cl); ctx.stroke();
  // hanging girder segment
  ctx.save(); ctx.translate(tx + swing, cl); ctx.rotate(0.02 * Math.sin(t * 0.9 + ph));
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, 26); ctx.moveTo(0, 0); ctx.lineTo(60, 26); ctx.stroke();
  gf(ctx, c => c.rect(-80, 26, 160, 22), lin(ctx, 0, 26, 0, 48, [[0, '#5a4a8a'], [1, '#2a2458']]), 0.4, null);
  ctx.restore();
  ctx.restore();
  // red warning light at the top
  if ((t * 0.7 + ph) % 1 < 0.2) light(ctx, x, top - 62, 30, '#ff8a5c', 0.8);
}

// a worker at the deck end, small and warm; arm lifts a lamp on "check"
function worker(ctx, t, x, f, ph, lampUp) {
  const s = 0.8, br = Math.sin(t * 1.7 + ph);
  ctx.save(); ctx.translate(x, DECK); ctx.scale(s * f, s);
  gf(ctx, c => { c.rect(-14, -70, 11, 70); c.rect(3, -70, 11, 70); }, '#4a2210', 0.3, null);
  gf(ctx, c => { c.moveTo(-22, -66); c.bezierCurveTo(-26, -110, -20, -146 + br, 0, -150 + br); c.bezierCurveTo(22, -146 + br, 26, -110, 22, -66); c.closePath(); }, lin(ctx, 0, -150, 0, -66, [[0, '#ffc27c'], [1, '#c9702e']]), 0.4, null);
  // hi-vis stripes
  ctx.fillStyle = 'rgba(243,239,226,0.7)'; ctx.fillRect(-22, -100, 44, 4); ctx.fillRect(-21, -84, 42, 4);
  gf(ctx, c => c.ellipse(2, -168 + br, 15, 17, 0, 0, 7), '#c9702e', 0.3, null);
  gf(ctx, c => { c.ellipse(2, -176 + br, 18, 11, 0, Math.PI, 0); c.rect(-18, -178 + br, 40, 4); }, '#ffe2a8', 0.2, null);   // hard hat
  // arm with the lamp
  const ax = lerp(16, 40, lampUp), ay = lerp(-80, -170, lampUp);
  gf(ctx, c => cap(c, 12, -138 + br, ax, ay, 7, 6), '#e08a42', 0.3, null);
  ctx.restore();
  return [x + ax * s * f, DECK + ay * s];
}

const FOG = (() => { const r = rng(12), a = []; for (let i = 0; i < 10; i++) a.push({ x: r() * W, y: 640 + r() * 260, w: 260 + r() * 340, v: 10 + r() * 18, a: 0.08 + r() * 0.08 }); return a; })();

function draw(ctx, t) {
  const k = (t - T0) / (T1 - T0);
  const z = lerp(1.0, 1.08, sm(k)), dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 5) * 4;
  ctx.save(); ctx.translate(W / 2, H * 0.55); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H * 0.55 + dy);
  cached(ctx, 'sky', -100, -100, W + 100, H + 100, skyArt);
  light(ctx, 990, 600, 900, '#7a64b0', 0.30);
  cached(ctx, 'cliffs', -100, 480, W + 100, H + 100, cliffsArt);
  // cranes: the left one lowers a segment toward the gap on "finished" but it stops short
  const low = ease(ramp(t, 542.2, 543.6));
  crane(ctx, t, 420, 1, 0.3, { trolley: 0.92, len: lerp(140, 300, low) });
  crane(ctx, t, 1540, -1, 2.0, { trolley: 0.6, len: 210 + 10 * Math.sin(t * 0.4) });
  // work lights on the deck ends
  const fl = 0.93 + 0.07 * Math.sin(t * 2.2);
  for (const x of [GAP_L - 10, GAP_R + 10]) { light(ctx, x, DECK - 40, 160, C.amber, 0.3 * fl); ctx.fillStyle = '#ffe2a8'; ctx.fillRect(x - 4, DECK - 46, 8, 6); }
  // workers
  worker(ctx, t, 680, 1, 0.5, 0);
  worker(ctx, t, 1290, -1, 1.7, 0.3 * (0.5 + 0.5 * Math.sin(t * 0.8)));
  const up = ease(ramp(t, 544.5, 545.0));
  const lamp = worker(ctx, t, GAP_L - 50, 1, 2.9, up);
  // the lamp beam: reaches out toward the far deck but fades in the fog
  const beam = ramp(t, 544.8, 545.3) * (1 - 0.3 * ramp(t, 546.0, 546.5));
  if (beam > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const L0 = lamp[0], L1 = lamp[1], reach = 300 * beam;
    ctx.fillStyle = lin(ctx, L0, 0, L0 + reach, 0, [[0, rgba('#ffe2a8', 0.45 * beam)], [0.5, rgba('#ffb35c', 0.16 * beam)], [1, rgba('#ffb35c', 0)]]);
    ctx.beginPath(); ctx.moveTo(L0, L1 - 4); ctx.lineTo(L0 + reach, L1 - 60); ctx.lineTo(L0 + reach, L1 + 70); ctx.lineTo(L0, L1 + 4); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  light(ctx, lamp[0], lamp[1], 70, '#ffe2a8', 0.2 + 0.7 * up);
  // fog drifting through the gorge, thickest in the gap
  for (const f of FOG) { const x = ((f.x + t * f.v) % (W + 600)) - 300; ctx.save(); ctx.translate(x, f.y); ctx.scale(1, 0.22);
    ctx.fillStyle = rad(ctx, 0, 0, 0, f.w, [[0, rgba('#a49fc4', f.a)], [1, rgba('#a49fc4', 0)]]); ctx.fillRect(-f.w, -f.w, 2 * f.w, 2 * f.w); ctx.restore(); }
  ctx.save(); ctx.translate((GAP_L + GAP_R) / 2, DECK + 120); ctx.scale(1, 0.6); ctx.fillStyle = rad(ctx, 0, 0, 0, 320, [[0, 'rgba(164,159,196,0.16)'], [1, 'rgba(164,159,196,0)']]); ctx.fillRect(-320, -320, 640, 640); ctx.restore();
  ctx.restore();
}

module.exports = { T0, T1, draw };
