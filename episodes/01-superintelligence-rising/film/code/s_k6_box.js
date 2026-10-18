// "Until recently, nobody could look inside and check."
// The model as a huge black cube. A small person walks up with a lamp and raises it; the warm light only
// slides over the cube's skin, it cannot get in. They move the lamp along the face, searching, nothing.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out } = L;
const { figure } = require('./s_timeline');
const { cube, grainFill, poly } = require('./s_k6_key');

const T0 = 344.15, T1 = 348.05;

const R = rng(344);
const DUST = Array.from({ length: 60 }, () => [R(), R(), R(), R()]);
const CUBE = [760, 330, 330];

function room(ctx, t) {
  grainFill(ctx, c => c.rect(-300, -300, W + 600, 1060), lin(ctx, 0, 0, 0, 720, [[0, '#070918'], [0.7, '#141640'], [1, '#221f4c']]), 0.55, [-300, -300, W + 600, 1060]);
  grainFill(ctx, c => c.rect(-300, 720, W + 600, 700), lin(ctx, 0, 720, 0, H, [[0, '#1a1744'], [1, '#07071a']]), 0.6, [-300, 720, W + 600, 700]);
  light(ctx, 760, 690, 900, C.violet, 0.25);
}

// the lamp the person holds (a small hand lantern); returns its flame position
function handLamp(ctx, hx, hy, t, sw) {
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(sw);
  ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16); ctx.stroke();
  ctx.fillStyle = '#3a1a0c'; ctx.fillRect(-15, 14, 30, 7); ctx.fillRect(-15, 58, 30, 7);
  grainFill(ctx, c => { c.moveTo(-12, 21); c.lineTo(12, 21); c.lineTo(14, 58); c.lineTo(-14, 58); c.closePath(); }, rad(ctx, 0, 40, 2, 22, [[0, '#fff3d6'], [0.5, '#ffc070'], [1, '#c9702e']]), 0.2, [-20, 10, 40, 60]);
  ctx.restore();
  return [hx - Math.sin(sw) * 40, hy + Math.cos(sw) * 40];
}

// a figure in a long coat: body from the rig, a coat laid over torso and thighs, then the arms on top
function coated(ctx, f, coat = ['#d27a34', '#8a4019', '#3a160a']) {
  const arms = f.arms || [];
  figure(ctx, { ...f, arms: arms.map(a => (a && a.behind ? a : null)) });
  const s = f.s, len = 118 * s * (f.len ?? 1), lean = f.lean || 0, cs = Math.cos(lean), sn = Math.sin(lean);
  const P = (x, y) => [f.x + x * cs - y * sn, f.y + x * sn + y * cs];
  const sw = 47 * s, hem = 74 * s * (f.hem ?? 1), fl = (f.flap || 0) * s;
  const pts = [P(-sw * 0.62, -len * 1.0), P(-sw * 1.02, -len * 0.84), P(-sw * 0.98, -len * 0.4), P(-sw * 0.9 - fl, hem), P(sw * 0.9 - fl * 0.6, hem + 3 * s), P(sw * 0.98, -len * 0.4), P(sw * 1.02, -len * 0.84), P(sw * 0.62, -len * 1.0)];
  const box = [f.x - 200 * s, f.y - 260 * s, 400 * s, 400 * s];
  if (f.rim) { ctx.save(); ctx.translate(f.rimDx ?? -3, f.rimDy ?? -2); grainFill(ctx, poly(pts), rgba(f.rim, (f.rimA ?? 0.9)), 0); ctx.restore(); }
  grainFill(ctx, c => { c.moveTo(pts[0][0], pts[0][1]); c.quadraticCurveTo(pts[1][0], pts[1][1] - 6 * s, pts[1][0], pts[1][1]); for (let i = 2; i < pts.length - 1; i++) c.lineTo(pts[i][0], pts[i][1]); c.quadraticCurveTo(pts[6][0], pts[6][1] - 6 * s, pts[7][0], pts[7][1]); c.closePath(); },
    lin(ctx, f.x + (f.lx ?? -1) * sw, f.y - len, f.x - (f.lx ?? -1) * sw, f.y + hem, [[0, coat[0]], [0.5, coat[1]], [1, coat[2]]]), 0.45, box);
  // centre seam / back vent and a belt line
  const a = P(0, -len * 0.95), b = P(0, hem), c1 = P(-sw * 0.95, -len * 0.05), c2 = P(sw * 0.95, -len * 0.05);
  ctx.strokeStyle = rgba(coat[2], 0.6); ctx.lineWidth = 2.5 * s; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]); ctx.stroke();
  // collar
  const k1 = P(-sw * 0.62, -len * 1.0), k2 = P(sw * 0.62, -len * 1.0), k3 = P(0, -len * 0.9);
  grainFill(ctx, c => { c.moveTo(k1[0], k1[1]); c.lineTo(k2[0], k2[1]); c.lineTo(k3[0], k3[1]); c.closePath(); }, coat[2], 0);
  return figure(ctx, { ...f, only: 'arms', arms: arms.map(a => (a && !a.behind ? a : null)) });
}

function boxShot(ctx, t, opt = {}) {
  const z = lerp(1.0, 1.08, sm((t - T0) / (T1 - T0))) * (opt.zoom || 1);
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 5) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  // person: walks in from the right, stops, raises the lamp on "look", sweeps it on "check"
  const walk = clamp((t - T0) / 1.2), px = lerp(1640, 1440, out(walk)), step = (1 - out(walk));
  const raise = ramp(t, 346.2, 346.75), sweep = Math.sin(clamp((t - 347.1) / 1.4) * Math.PI * 1.5) * ramp(t, 347.0, 347.4);
  const b = Math.sin(t * 1.7);
  const hip = [px, 842 + b * 1.2 - Math.abs(Math.sin(t * 7)) * 6 * step];
  const hand = [px - lerp(60, 150, raise) - sweep * 40, hip[1] - lerp(70, 250, raise) + sweep * 50];
  const sw = Math.sin(t * 2.3) * 0.08 * (1 - raise) + Math.sin(t * 7) * 0.12 * step;
  // lamp light
  const fl = [hand[0] - Math.sin(sw) * 40, hand[1] + Math.cos(sw) * 40];
  const flick = 0.92 + 0.08 * Math.sin(t * 13) * Math.sin(t * 4.1);
  layer(0.4, () => room(ctx, t));
  layer(0.8, () => {
    const g = cube(ctx, CUBE[0], CUBE[1], CUBE[2], 0.25 + 0.1 * Math.sin(t * 1.3), t, opt.open || 0);
    // the lamp's light lands on the cube's right face only as a pool on its surface: it cannot get in
    ctx.save(); ctx.beginPath(); poly([g.B, g.R, g.RB, g.BB])(ctx); ctx.clip();
    const lp = [lerp(g.R[0], fl[0], 0.0) - 60 - sweep * 60, fl[1] + 30];
    light(ctx, lp[0], lp[1], lerp(160, 300, raise), C.amber, (0.12 + 0.32 * raise) * flick);
    ctx.restore();
    // a thin bright rim where the light grazes the edge, then black
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.amber, 0.35 * raise * flick); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(g.R[0], g.R[1]); ctx.lineTo(g.RB[0], g.RB[1]); ctx.stroke(); ctx.restore();
    light(ctx, fl[0], fl[1], 520, C.amber, 0.28 * flick);
    // floor pool of lamp light around the person
    ctx.save(); ctx.translate(px - 40, 960); ctx.scale(1, 0.25); light(ctx, 0, 0, 420, C.amber, 0.3 * flick); ctx.restore();
    // the person's long shadow toward the cube
    ctx.fillStyle = 'rgba(3,3,12,0.45)'; ctx.beginPath(); ctx.moveTo(px - 30, 966); ctx.lineTo(px + 30, 966); ctx.lineTo(px - 300, 1010); ctx.lineTo(px - 360, 990); ctx.closePath(); ctx.fill();
    // figure
    const ph = t * 7, st = step;
    const legs = [{ a1: 1.62 + Math.sin(ph) * 0.35 * st, a2: 1.6 + Math.max(0, Math.sin(ph)) * 0.5 * st }, { a1: 1.5 - Math.sin(ph) * 0.35 * st, a2: 1.55 + Math.max(0, -Math.sin(ph)) * 0.5 * st, behind: true }];
    coated(ctx, { x: hip[0], y: hip[1], s: 1.25, len: 0.98, facing: 'back', br: b, lean: -0.03 - 0.05 * raise, turn: lerp(-0.45, -0.75, raise) + sweep * 0.1, tilt: lerp(0.05, -0.18, raise), lx: -1, flap: 6 * st * Math.sin(ph),
      rim: C.amber, rimA: 0.55, rimDx: -4, rimDy: -2, pal: ['#e8964e', '#a85424', '#401a0a'],
      arms: [{ tx: hand[0], ty: hand[1], bend: 1 }, { tx: px + 34, ty: hip[1] + 14 + Math.sin(ph) * 10 * st, bend: -1 }], legs });
    handLamp(ctx, hand[0], hand[1], t, sw);
    light(ctx, fl[0], fl[1], 70, '#ffe2b0', 0.8 * flick);
  });
  // dust floating through the lamp light
  for (const [u, v, s, p] of DUST) {
    const x = 900 + u * 900 + Math.sin(t * 0.5 + p * 9) * 20, y = 200 + ((v + t * 0.015 * (0.5 + s)) % 1) * 760;
    const near = Math.exp(-Math.hypot(x - fl[0], y - fl[1]) / 260);
    ctx.fillStyle = rgba('#ffe2b0', 0.5 * near * (0.4 + s)); ctx.beginPath(); ctx.arc(x, y, 1 + s * 1.5, 0, Math.PI * 2); ctx.fill();
  }
}

function draw(ctx, t) { boxShot(ctx, t); }

module.exports = { T0, T1, draw, boxShot, CUBE, coated };
