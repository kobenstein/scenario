// "And most of these numbers come from the companies, about themselves."  /  "So, an outside check."
// Three lab towers at night. Each one has a projector on its own roof that bends its beam back onto its own
// facade, where a bar chart grows: they measure themselves. Then the camera pulls back and down: a fence in
// front of the campus, and an amber inspector with a clipboard walks in from outside, stops and looks up.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, clamp, label } = L;
const { grainFill, roundRect, poly, cap, cached, motes } = require('./s_k2_studio');

const T0 = 113.25, T1 = 119.8;
const T_PULL = 117.45;          // "So," : camera pulls back to reveal the fence and the inspector

const GROUND = 820;
const TOWERS = [
  { x: 330, w: 300, top: 150, seed: 1, ch: 114.2 },
  { x: 810, w: 330, top: 60, seed: 2, ch: 114.45 },
  { x: 1310, w: 280, top: 200, seed: 3, ch: 114.7 },
];
function towerArt(c, T) {
  const { x, w, top } = T, r = rng(T.seed * 31);
  // body: glass curtain wall with a lit side and a dark side
  grainFill(c, k => k.rect(x, top, w, GROUND - top + 300), lin(c, x, 0, x + w, 0, [[0, '#18275a'], [0.55, '#111a44'], [1, '#090d28']]), 0.55);
  grainFill(c, k => { k.moveTo(x + w, top); k.lineTo(x + w + 46, top + 26); k.lineTo(x + w + 46, GROUND + 300); k.lineTo(x + w, GROUND + 300); k.closePath(); }, lin(c, 0, top, 0, GROUND, [[0, '#0a0c24'], [1, '#05061a']]), 0.55);
  // window grid
  for (let fy = top + 30; fy < GROUND - 20; fy += 26) for (let fx = x + 14; fx < x + w - 14; fx += 22) {
    const lit = r(); c.fillStyle = lit < 0.28 ? rgba(C.cyan, 0.30 + r() * 0.25) : lit < 0.33 ? rgba(C.amber, 0.35) : 'rgba(30,50,110,0.35)'; c.fillRect(fx, fy, 14, 15);
  }
  // crown and rooftop machinery
  c.fillStyle = '#070818'; c.fillRect(x - 6, top - 10, w + 12, 14); c.fillRect(x + w * 0.2, top - 34, w * 0.3, 26); c.fillRect(x + w * 0.62, top - 22, w * 0.18, 14);
  c.fillStyle = rgba(C.cyanW, 0.25); c.fillRect(x - 6, top - 10, w + 12, 2);
}
// the chart each tower paints on its own facade
const PANEL = T => ({ x: T.x + T.w * 0.16, y: T.top + 120, w: T.w * 0.68, h: 300 });
const BARS = [0.42, 0.58, 0.74, 0.97];
function selfChart(ctx, t, T, i, k) {
  const P = PANEL(T), on = ramp(t, T.ch - 0.5, T.ch);
  if (on <= 0) return;
  // projector on an arm that reaches out from the roof and points back at its own building
  const px = T.x + T.w * 0.5, arm = out(ramp(t, T.ch - 0.9, T.ch - 0.3)), py = T.top - 40 - 30 * arm, ax = px + 90 * arm;
  ctx.strokeStyle = '#070818'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(px - 30, T.top - 10); ctx.lineTo(px - 10, py); ctx.lineTo(ax, py); ctx.stroke();
  grainFill(ctx, c => { c.save(); c.translate(ax, py); c.rotate(2.1); roundRect(c, -18, -12, 36, 24, 5); c.restore(); }, '#1a2050', 0);
  // the beam folds back down onto the facade
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, ax, py, P.x + P.w / 2, P.y + P.h, [[0, rgba(C.cyanW, 0.32 * on * k)], [1, rgba(C.cyan, 0.05 * on * k)]]);
  ctx.beginPath(); ctx.moveTo(ax - 4, py + 6); ctx.lineTo(P.x, P.y); ctx.lineTo(P.x, P.y + P.h); ctx.lineTo(P.x + P.w, P.y + P.h); ctx.lineTo(P.x + P.w, P.y); ctx.lineTo(ax + 6, py + 4); ctx.closePath(); ctx.fill();
  ctx.restore();
  light(ctx, ax, py, 60, C.cyanW, 0.6 * on * k);
  // the projected panel and its bars, growing on "numbers"
  ctx.fillStyle = rgba('#0a3a55', 0.75 * on); ctx.fillRect(P.x, P.y, P.w, P.h);
  ctx.strokeStyle = rgba(C.cyanW, 0.6 * on); ctx.lineWidth = 2; ctx.strokeRect(P.x, P.y, P.w, P.h);
  const bw = P.w / (BARS.length * 1.6), g = ramp(t, T.ch - 0.1, T.ch + 1.3);
  BARS.forEach((b, j) => {
    const hgt = (P.h - 40) * b * out(clamp(g * 1.6 - j * 0.2)) * (1 + 0.015 * Math.sin(t * 2 + j + i));
    const bx = P.x + bw * 0.5 + j * bw * 1.6, by = P.y + P.h - 16 - hgt;
    ctx.fillStyle = j === BARS.length - 1 ? rgba(C.cyanW, 0.95 * on) : rgba(C.cyan, 0.75 * on); ctx.fillRect(bx, by, bw, hgt);
  });
  ctx.fillStyle = rgba(C.cyanW, 0.5 * on); ctx.fillRect(P.x + 10, P.y + P.h - 14, P.w - 20, 2);
  light(ctx, P.x + P.w / 2, P.y + P.h / 2, P.w, C.cyan, 0.14 * on * k);
}

function skyArt(c) {
  grainFill(c, k => k.rect(-400, -600, W + 800, 1700), lin(c, 0, -600, 0, GROUND, [[0, '#04051a'], [0.6, '#0e1236'], [1, '#22204e']]), 0.5);
  const r = rng(8); for (let i = 0; i < 90; i++) { c.fillStyle = rgba(C.cream, 0.15 + r() * 0.4); c.fillRect(-400 + r() * (W + 800), -600 + r() * 900, 1.6, 1.6); }
  // far city
  let x = -400; while (x < W + 400) { const w = 40 + r() * 90, h = 60 + r() * 160; c.fillStyle = '#0b0d28'; c.fillRect(x, GROUND - h, w, h + 10);
    for (let j = 0; j < 6; j++) if (r() < 0.5) { c.fillStyle = rgba(C.cyan, 0.15); c.fillRect(x + 6 + r() * (w - 12), GROUND - h + 10 + r() * (h - 20), 3, 3); } x += w + 6; }
}
function groundArt(c) {
  grainFill(c, k => k.rect(-400, GROUND, W + 800, 700), lin(c, 0, GROUND, 0, GROUND + 600, [[0, '#191a44'], [0.3, '#121236'], [1, '#07071a']]), 0.55);
  // a path from the viewer to the gate
  grainFill(c, poly([[700, GROUND + 6], [860, GROUND + 6], [1200, GROUND + 520], [300, GROUND + 520]]), lin(c, 0, GROUND, 0, GROUND + 500, [[0, '#24224e'], [1, '#141236']]), 0.5);
}
// a chain-link fence across the front of the campus, with an open gate in the middle
const FY0 = 640, FY1 = 860;     // fence top / bottom (world coordinates, drawn in the near layer)
function fenceArt(c) {
  const posts = []; for (let x = -340; x < W + 400; x += 190) if (x < 640 || x > 980) posts.push(x);
  c.save(); c.beginPath(); c.rect(-400, FY0, 1040, FY1 - FY0); c.rect(980, FY0, W + 800, FY1 - FY0); c.clip();
  c.strokeStyle = 'rgba(160,170,230,0.20)'; c.lineWidth = 1.3;
  for (let d = -800; d < W + 1200; d += 22) { c.beginPath(); c.moveTo(d, FY0); c.lineTo(d + 220, FY1); c.stroke(); c.beginPath(); c.moveTo(d + 220, FY0); c.lineTo(d, FY1); c.stroke(); }
  c.restore();
  c.fillStyle = '#0a0a1e'; for (const x of posts) c.fillRect(x - 5, FY0 - 12, 10, FY1 - FY0 + 14);
  c.fillRect(-400, FY0 - 4, 1046, 7); c.fillRect(976, FY0 - 4, W + 800, 7);
  // gate posts and an open gate swung inward
  c.fillStyle = '#0c0c22'; c.fillRect(630, FY0 - 40, 16, FY1 - FY0 + 42); c.fillRect(974, FY0 - 40, 16, FY1 - FY0 + 42);
  c.strokeStyle = 'rgba(160,170,230,0.28)'; c.lineWidth = 3; c.strokeRect(990, FY0 + 10, 110, FY1 - FY0 - 30);
  c.fillStyle = 'rgba(255,179,92,0.10)'; for (const x of posts) c.fillRect(x - 5, FY0 - 12, 2, FY1 - FY0 + 14);
}

// ---------- the inspector: a walk cycle, long coat, clipboard ----------
const LEG = { th: 82, sh: 80 };
function legPose(p) {
  const th = 0.44 * Math.sin(p), knee = 0.08 + 1.0 * Math.pow(Math.max(0, Math.cos(p + 0.45)), 2);
  const kx = Math.sin(th) * LEG.th, ky = Math.cos(th) * LEG.th, ph = th - knee;
  return { kx, ky, ax: kx + Math.sin(ph) * LEG.sh, ay: ky + Math.cos(ph) * LEG.sh, fa: clamp(-ph * 0.6 - 0.05, -0.5, 0.7) };
}
function inspector(ctx, t, p, walkAmt, lift, look) {
  // when standing, the legs settle into a stance
  const A0 = legPose(p), B0 = legPose(p + Math.PI), st = { kx: 4, ky: LEG.th, ax: 6, ay: LEG.th + LEG.sh, fa: 0 }, st2 = { kx: -10, ky: LEG.th - 2, ax: -14, ay: LEG.th + LEG.sh - 2, fa: 0 };
  const mix = (a, b) => ({ kx: lerp(b.kx, a.kx, walkAmt), ky: lerp(b.ky, a.ky, walkAmt), ax: lerp(b.ax, a.ax, walkAmt), ay: lerp(b.ay, a.ay, walkAmt), fa: lerp(b.fa, a.fa, walkAmt) });
  const A = mix(A0, st), B = mix(B0, st2);
  const hipY = -Math.max(A.ay, B.ay) - 10, br = Math.sin(t * 1.7) * 1.2;
  const lean = 0.07 * walkAmt - 0.04 * look, sx = Math.sin(lean) * 132, sy = hipY - Math.cos(lean) * 132 + br;
  const legFill = (L0, near) => {
    const kx = L0.kx, ky = hipY + L0.ky, ax = L0.ax, ay = hipY + L0.ay;
    grainFill(ctx, c => { cap(c, 0, hipY, kx, ky, 17, 13); cap(c, kx, ky, ax, ay, 13, 10); }, near ? lin(ctx, 0, hipY, 0, 0, [[0, '#6a3418'], [1, '#3a1a0c']]) : '#2a1208', 0.4);
    grainFill(ctx, c => { c.save(); c.translate(ax, ay); c.rotate(L0.fa); c.moveTo(-12, -9); c.lineTo(22, -7); c.quadraticCurveTo(36, -2, 33, 10); c.lineTo(-14, 10); c.closePath(); c.restore(); }, near ? '#2a1208' : '#1a0a04', 0);
  };
  ctx.fillStyle = 'rgba(4,4,16,0.45)'; ctx.beginPath(); ctx.ellipse(8, 2, 70, 9, 0, 0, 7); ctx.fill();
  legFill(B, false);
  // far arm swings opposite to the near leg
  const sw = Math.sin(p) * 0.5 * walkAmt;
  grainFill(ctx, c => { const ex = sx - 6 + Math.sin(-sw) * 60, ey = sy + 70; cap(c, sx - 4, sy + 16, ex, ey, 13, 11); cap(c, ex, ey, ex + Math.sin(-sw + 0.3) * 50, ey + 48, 11, 9); }, '#8a451c', 0.4);
  // long coat: flares at the hem, swings with the stride
  const hem = Math.sin(p * 2) * 6 * walkAmt;
  grainFill(ctx, c => {
    c.moveTo(-30 + hem * 0.5, hipY + 52);
    c.bezierCurveTo(-34, hipY - 40, -34 + sx * 0.5, sy + 70, -26 + sx, sy + 12);
    c.bezierCurveTo(-18 + sx, sy - 6, -4 + sx, sy - 12, 8 + sx, sy - 12);
    c.bezierCurveTo(24 + sx, sy - 6, 32 + sx, sy + 24, 31 + sx, sy + 56);
    c.bezierCurveTo(31 + sx * 0.5, sy + 100, 34, hipY - 10, 38 + hem, hipY + 48); c.closePath();
  }, lin(ctx, 0, sy - 20, 0, hipY + 50, [[0, '#ffb35c'], [0.55, '#c9702e'], [1, '#7a3b17']]), 0.42);
  // belt and lapel
  ctx.strokeStyle = 'rgba(74,34,16,0.7)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-30, sy + 110); ctx.lineTo(30 + sx * 0.3, sy + 108); ctx.stroke();
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx + 16, sy - 6); ctx.quadraticCurveTo(sx + 26, sy + 40, sx + 18, sy + 104); ctx.stroke();
  legFill(A, true);
  // head: faceless, hair tied back, looks up at the towers when he stops
  ctx.save(); ctx.translate(sx + 6, sy - 6); ctx.rotate(0.05 - look * 0.32);
  grainFill(ctx, c => cap(c, 0, 4, 2, -22, 10, 9), '#b0602a', 0);
  grainFill(ctx, c => { c.moveTo(-18, -26); c.bezierCurveTo(-22, -52, -10, -70, 6, -70); c.bezierCurveTo(24, -70, 32, -56, 30, -40); c.bezierCurveTo(30, -32, 34, -30, 32, -24); c.bezierCurveTo(28, -14, 18, -10, 8, -12); c.bezierCurveTo(-4, -12, -14, -16, -18, -26); c.closePath(); },
    lin(ctx, 0, -70, 0, -10, [[0, '#ffc488'], [1, '#c36a2b']]), 0.35);
  grainFill(ctx, c => { c.moveTo(-20, -28); c.bezierCurveTo(-26, -58, -10, -78, 8, -76); c.bezierCurveTo(26, -76, 34, -62, 30, -50); c.bezierCurveTo(18, -60, 4, -56, -2, -46); c.bezierCurveTo(-6, -38, -10, -32, -20, -28); c.closePath(); c.ellipse(-24, -40, 10, 8, 0.4, 0, 7); }, '#3a1a0c', 0.4);
  grainFill(ctx, c => c.ellipse(-1, -38, 5, 8, 0.1, 0, 7), '#b0602a', 0.3);
  ctx.restore();
  // collar
  grainFill(ctx, c => { c.moveTo(sx - 16, sy - 2); c.quadraticCurveTo(sx + 2, sy - 24, sx + 22, sy - 6); c.lineTo(sx + 16, sy + 8); c.quadraticCurveTo(sx + 2, sy - 6, sx - 12, sy + 8); c.closePath(); }, '#d27a34', 0.4);
  // near arm holds the clipboard; on "check" it lifts to read it
  const cbx = sx + lerp(34, 52, lift), cby = sy + lerp(70, 26, lift), crot = lerp(0.25, -0.5, lift);
  ctx.save(); ctx.translate(cbx, cby); ctx.rotate(crot);
  grainFill(ctx, c => roundRect(c, -6, -44, 50, 66, 4), lin(ctx, 0, -44, 0, 22, [[0, '#7a4a2a'], [1, '#4a2a18']]), 0.4);
  grainFill(ctx, c => c.rect(-1, -36, 40, 54), '#efe6cf', 0.25);
  ctx.fillStyle = '#2a1a10'; ctx.fillRect(10, -48, 20, 8);
  ctx.fillStyle = 'rgba(40,30,50,0.6)'; for (let j = 0; j < 5; j++) ctx.fillRect(4, -26 + j * 9, 26 - (j % 2) * 8, 2);
  ctx.restore();
  const ex = sx + 4 + 6 * lift, ey = sy + 76 - 14 * lift;
  grainFill(ctx, c => { cap(c, sx + 4, sy + 16, ex, ey, 15, 12); cap(c, ex, ey, cbx + 6, cby + 10, 12, 9); }, lin(ctx, 0, sy, 0, sy + 100, [[0, '#ffb35c'], [1, '#c36a2b']]), 0.42);
  grainFill(ctx, c => c.ellipse(cbx + 8, cby + 8, 9, 11, 0, 0, 7), '#e08a42', 0.3);
}

const MOTE = (() => { const r = rng(311); return Array.from({ length: 34 }, () => [r(), r(), r()]); })();

function draw(ctx, t) {
  // camera: close on the towers, then (on "So,") it pulls back and drops to the fence line
  const pull = ease(ramp(t, T_PULL - 0.15, T_PULL + 1.1));
  const z = lerp(lerp(1.0, 1.08, sm((t - T0) / (T_PULL - T0))), 0.86, pull);
  const cy = lerp(0, 150, pull);
  const dx = drift(t, 1, 5) * 6, dy = drift(t, 1, 6) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par - cy * par); fn(); ctx.restore(); };
  const k = 0.92 + 0.08 * Math.sin(t * 1.4);

  layer(0.25, () => cached(ctx, 'k2sky', -400, -600, W + 400, GROUND + 20, skyArt, 1));
  layer(0.6, () => {
    cached(ctx, 'k2ground', -400, GROUND, W + 400, GROUND + 600, groundArt, 1);
    TOWERS.forEach((T, i) => {
      light(ctx, T.x + T.w / 2, T.top + 300, 520, C.cyanD, 0.18);
      cached(ctx, 'k2tower' + i, T.x - 10, T.top - 40, T.x + T.w + 50, GROUND + 300, c => towerArt(c, T), 1);
    });
    TOWERS.forEach((T, i) => selfChart(ctx, t, T, i, k));
    // haze along the base
    ctx.save(); ctx.translate(960, GROUND - 20); ctx.scale(4, 0.6); light(ctx, 0, 0, 380, '#5a6ab0', 0.12); ctx.restore();
  });
  // the near ground: fence and inspector (below frame until the camera drops)
  layer(1.0, () => {
    ctx.save(); ctx.translate(0, 300 + 420 * (1 - pull));
    grainFill(ctx, c => c.rect(-400, FY1 - 40, W + 800, 500), lin(ctx, 0, FY1 - 40, 0, FY1 + 300, [[0, '#15143a'], [1, '#08081c']]), 0.5);
    cached(ctx, 'k2fence', -400, FY0 - 60, W + 400, FY1 + 10, fenceArt, 1);
    // a gate lamp: the warm light that meets the inspector
    ctx.fillStyle = '#0c0c22'; ctx.fillRect(626, FY0 - 70, 6, 34); light(ctx, 629, FY0 - 74, 140, C.amber, 0.55 * k); light(ctx, 629, FY0 - 74, 22, '#ffe6c0', 0.8);
    ctx.save(); ctx.translate(629, FY1 + 50); ctx.scale(1, 0.25); light(ctx, 0, 0, 260, C.amber, 0.3 * k); ctx.restore();
    // the inspector walks in from the left, outside the fence, and stops at the gate
    const u = ramp(t, T_PULL - 0.2, 118.85), x = lerp(-160, 470, 1 - Math.pow(1 - clamp((t - (T_PULL - 0.2)) / 1.55), 1.6));
    const walk = 1 - ramp(t, 118.55, 118.95), p = (x + 120) / 118 * Math.PI;
    const lift = ramp(t, 118.72, 119.15), look = ramp(t, 118.9, 119.4);
    ctx.save(); ctx.translate(x, FY1 + 150); ctx.scale(1.6, 1.6);
    // amber rim light from the lamp
    inspector(ctx, t, p, walk * (u > 0 ? 1 : 0) + (u <= 0 ? 1 : 0), lift, look);
    ctx.restore();
    ctx.restore();
  });
  layer(0.8, () => motes(ctx, t, MOTE, 0, 0, W, 900, C.cyanW, 0.22));
  label(ctx, t, 114.3, T_PULL + 0.1, 'Self-reported', 'the labs measure themselves', 96, 120);
  label(ctx, t, 118.24, T1 + 0.2, 'Outside check', 'independent researchers', 96, 120, { color: C.amber });
}

module.exports = { T0, T1, draw };
