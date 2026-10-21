// Film 6 · c05 · the GREAT MIRROR of the mind. A variant of the kit's mirrorOfMind()/pane()/paneFrame()/glassRect() (lib/f6_kit.mjs, K0),
// copied here because this mirror (a) carries the c04>c05 glass plate as its own surface (the plate is glued to the glass at the camera of
// H.b, so the pull-back leaves the plate without a cut), (b) grows from 480×740 to 1104×1702 (one fixed reflection scratch per size bucket:
// the kit's scratch() would allocate a new canvas for every size), (c) keeps its reflection faintly visible under the brilliant scripts,
// (d) lets one heartbeat ripple flatten into the amber line of the c05>c06 plate and mixes its ground into that plate's ground.
// World coordinates (the main parallax plane, camera z 1 = 1920×1080); the ring, the ground mix and the plate line are screen space.
// Pure functions of t; deterministic; no state between frames except the cached layers.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, canvas, addGlow } from '../engine.mjs';
import { F6, layer, once, coolText } from './f6_kit.mjs';

const TAU = Math.PI * 2;
export const MX = 1180, W0 = 480, H0 = 740, FOOT = 880;        // centre x, size at s = 1, the y of the frame's foot (world)
export const mirrorY = (s) => FOOT - 19 - H0 * s / 2;           // the centre y at size factor s (the foot stays on the floor)
export const LINE_Y = 560;                                       // lib/handoff4.mjs HAND['c05>c06'].o.y
const AMB = ['#ffb35c', '#fff1d6'];

// ---------------------------------------------------------------- the glass plate as a texture glued to the glass (copy of handoff4 glassPlate)
// M0 = camMap() of the camera at H.b (world → screen). Drawn in the current (world) transform; at that camera it is the plate pixel for pixel,
// extended beyond the frame with the same gradient and a longer sheen so the glass has no edge inside it.
export function plateGlass(g, t, M0) {
  g.save(); g.translate(-M0.tx / M0.k, -M0.ty / M0.k); g.scale(1 / M0.k, 1 / M0.k);
  const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#0a0f24'); gr.addColorStop(1, '#05060f'); g.fillStyle = gr; g.fillRect(-9000, -9000, W + 18000, H + 18000);
  const x = W * (.3 + .04 * Math.sin(t * .4)); g.save(); g.translate(x, H / 2); g.rotate(.5);
  const s = g.createLinearGradient(-260, 0, 260, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, 'rgba(216,247,255,.06)'); s.addColorStop(1, 'rgba(216,247,255,0)');
  g.fillStyle = s; g.fillRect(-260, -9000, 520, 18000); g.restore();
  const r = prng(12); for (let i = 0; i < 70; i++) { const px = r() * W, py = (r() * H + t * 8 * (r() + .3)) % H; g.fillStyle = `rgba(216,247,255,${.05 + .08 * r()})`; g.fillRect(px, py, 1.6, 1.6); }
  g.restore();
}

// ---------------------------------------------------------------- the brilliant scripts: five columns of every script, cached once, scrolled
const SW = 230, SCOLS = 5, SH = 1900;
function scriptsLayer() {
  return layer('c05scripts', SW * SCOLS, SH, (g) => {
    for (let ci = 0; ci < SCOLS; ci++) coolText(g, 100, { x: 14 + ci * SW, y: 0, w: SW - 28, size: 10, lines: 100, lineH: 19, cps: 1e4, gap: 0, seed: 40 + ci, script: 'mix', cursor: false, ripple: false, a: 1 });
  });
}

// ---------------------------------------------------------------- the ring: one heartbeat runs out as an amber ring and flattens into the plate's line
// screen space. k = life 0..1; at the end the exact line of the plate is drawn (same code as handoff4 linePlate's line).
export function plateLine(ctx, t, y) {
  const L = 1400, br = .9 + .1 * Math.sin(t * 2.1);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(W / 2, y + 2 * Math.sin(t * .9)); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [w, al, c] of [[26, .05, AMB[0]], [10, .14, AMB[0]], [3.2, .55 * br, AMB[0]], [1.4, .95, AMB[1]]]) { ctx.strokeStyle = rgba(c, al); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(L, 0); ctx.stroke(); }
  ctx.strokeStyle = rgba(AMB[1], .35); ctx.lineWidth = 1; ctx.beginPath(); for (let x = -L; x < L; x += 9) { const h = 2 + 1.5 * Math.sin(x * .07 + t); ctx.moveTo(x, -h); ctx.lineTo(x + 3, h); } ctx.stroke();
  ctx.restore();
}
function ring(ctx, t, cx, cy, k) {
  // the ring grows (its sides leave the frame), its top and bottom arcs stay in view (≤ 440 px) and flatten into the line
  const rx = 40 + eout(k) * 1600, ryMax = 300 + 140 * sm(lin(0, .3, k)), fl = sm(lin(.25, .95, k)), ry = Math.max(0, Math.min(rx * .72, ryMax) * (1 - fl)), br = .9 + .1 * Math.sin(t * 2.1), yy = cy + 2 * Math.sin(t * .9);
  if (ry < 1.2) { plateLine(ctx, t, cy); return; }
  const f = mix(1, .5, lin(14, 1.2, ry));   // the two arcs meet: half strength each so the sum is the line
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [w, al, c] of [[26, .05, AMB[0]], [10, .14, AMB[0]], [3.2, .55 * br, AMB[0]], [1.4, .95, AMB[1]]]) { ctx.strokeStyle = rgba(c, al * f); ctx.lineWidth = w; ctx.beginPath(); ctx.ellipse(cx, yy, rx, ry, 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
}
// the ground of the line plate (copy of handoff4 linePlate's ground), screen space, at strength u (a colour change of the glass)
function lineGround(ctx, t, u) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = rgba('#0a0c22', u); ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(W / 2, LINE_Y, 0, W / 2, LINE_Y, W * .7); v.addColorStop(0, `rgba(40,36,90,${.55 * u})`); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = `rgba(160,150,220,${.05 * u})`; ctx.lineWidth = 1; ctx.beginPath(); for (let k = -40; k < 80; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x, 0); ctx.lineTo(x - 520, H); } ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- the reflection scratch: one canvas per size bucket (never one per frame)
const RS = new Map();
function reflScratch(w, h) {
  const bw = Math.ceil((w + 16) / 80) * 80, bh = Math.ceil((h + 16) / 80) * 80, key = bw + 'x' + bh;
  if (!RS.has(key)) RS.set(key, canvas(bw, bh));
  const [c, g] = RS.get(key); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, bw, bh); return [c, g];
}

// ================================================================ greatMirror(ctx, t, o)
//   o: { s 1 (size factor), M0 (camMap at H.b: the plate texture), reflect(g) (the hall in the glass: world coords, pre-mirror; the glass flips x),
//        reflectA 0..1, dim .18, text 0..1 (the brilliant scripts), ground 0..1 (the glass becomes the line plate's ground),
//        ring { t0, life } | null, ringAt [wx, wy] (world; default the mirror's centre), scr (camMap of the main plane: for the ring's centre), edge 1, floorA 1 }
//   → { x, y, w, h, cx, cy (screen centre) }
export function greatMirror(ctx, t, o = {}) {
  const s = o.s ?? 1, w = W0 * s, h = H0 * s, x = MX, y = mirrorY(s), tx = clamp(o.text ?? 0), rA = clamp(o.reflectA ?? 0), ug = clamp(o.ground ?? 0), dim = o.dim ?? .34;
  const scr = o.scr, rc = o.ringAt ?? [x, y], cx = scr ? scr.X(rc[0]) : W / 2, cy = scr ? scr.Y(rc[1]) : LINE_Y;   // the ring's centre (world), default the mirror's
  // the mirror's light on the floor (silver when dim, cool and wide when brilliant)
  if ((o.floorA ?? 1) > 0 && ug < 1) { ctx.save(); ctx.translate(x, y + h / 2 + 30); ctx.scale(1, .25); const fg = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 1.2); fg.addColorStop(0, rgba(tx > .3 ? F6.cool : F6.silver, (.14 + .3 * tx) * (o.floorA ?? 1) * (1 - ug))); fg.addColorStop(1, rgba(F6.silver, 0)); ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(0, 0, w * 1.2, 0, TAU); ctx.fill(); ctx.restore(); }
  // ---- the glass
  ctx.save(); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 2); ctx.clip();
  plateGlass(ctx, t, o.M0);
  if (o.reflect && rA > 0) {
    const [rc, rg] = reflScratch(w, h);
    rg.translate(w / 2 + 8, h / 2 + 8); rg.scale(-1, 1); rg.save(); rg.beginPath(); rg.rect(-w / 2, -h / 2, w, h); rg.clip(); rg.translate(-x, -y); o.reflect(rg); rg.restore();
    // a reflection is light the glass gives back: it is ADDED to the dark glass at strength rA (dimmed to `dim`), never alpha-faded as an object
    rg.setTransform(1, 0, 0, 1, 0, 0); rg.globalCompositeOperation = 'source-atop'; rg.fillStyle = rgba('#000000', 1 - dim); rg.fillRect(0, 0, rc.width, rc.height);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = rA; ctx.drawImage(rc, x - w / 2 - 8, y - h / 2 - 8); ctx.restore();
  }
  if (tx > 0) {
    // a cool haze that brightens toward the centre, the scripts running upward (light, so the reflection stays under them), a slow sheen
    const hz = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * .7); hz.addColorStop(0, rgba('#1a2c58', .85 * tx)); hz.addColorStop(.6, rgba('#121d3e', .6 * tx)); hz.addColorStop(1, rgba('#0a0f24', .3 * tx)); ctx.fillStyle = hz; ctx.fillRect(x - w / 2, y - h / 2, w, h);
    const L = scriptsLayer(), off = (t * 14) % SH, lx = x - SW * SCOLS / 2, ly = y - h / 2;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = tx;
    ctx.drawImage(L, lx, ly - off); ctx.drawImage(L, lx, ly - off + SH);
    // the brilliance lives in the middle: a soft core of light, and a few lines that run brighter at their own speed (light on water)
    const cg = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * .55); cg.addColorStop(0, rgba(F6.cool, .22 * tx)); cg.addColorStop(.5, rgba(F6.cool, .07 * tx)); cg.addColorStop(1, rgba(F6.cool, 0)); ctx.fillStyle = cg; ctx.fillRect(x - w / 2, y - h / 2, w, h);
    const r = prng(7); ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const yy = y - h / 2 + ((r() * h + t * (22 + r() * 30)) % h), x0 = x - w / 2 + r() * w * .5, len = 60 + r() * 160, a = (.3 + .4 * Math.sin(t * 1.3 + i)) * tx; if (a <= 0) continue; ctx.strokeStyle = rgba(F6.coolCore, a * .35); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 + len, yy); ctx.stroke(); }
    const sx = x + w * (.22 * Math.sin(t * .27)); ctx.translate(sx, y); ctx.rotate(.5); const sg = ctx.createLinearGradient(-w * .25, 0, w * .25, 0); sg.addColorStop(0, rgba(F6.cool, 0)); sg.addColorStop(.5, rgba(F6.cool, .09 * tx)); sg.addColorStop(1, rgba(F6.cool, 0)); ctx.fillStyle = sg; ctx.fillRect(-w * .25, -h * 2, w * .5, h * 4);
    ctx.restore();
    // the light falls off toward the mirror's edges (the glass darkens there)
    const vg = ctx.createRadialGradient(x, y, Math.min(w, h) * .3, x, y, Math.max(w, h) * .62); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, rgba(F6.glassBot, .5 * tx)); ctx.fillStyle = vg; ctx.fillRect(x - w / 2, y - h / 2, w, h);
  }
  if (ug > 0) lineGround(ctx, t, ug);
  if (o.ring && t >= o.ring.t0) { const k = (t - o.ring.t0) / (o.ring.life ?? 1.3); if (k < 1) ring(ctx, t, cx, cy, k); else plateLine(ctx, t, cy); }
  ctx.restore();
  // ---- the cool line on the edge, the frame, the spill
  const edge = (o.edge ?? 1) * (1 - ug);
  if (edge > 0) { ctx.save(); ctx.lineWidth = 1.2; ctx.strokeStyle = rgba(F6.cool, .45 * edge); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 2); ctx.stroke();
    ctx.strokeStyle = rgba(F6.coolCore, .8 * edge); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - w / 2 + 2, y - h / 2); ctx.lineTo(x + w / 2 - 2, y - h / 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2 + 2); ctx.lineTo(x - w / 2, y + h / 2 - 2); ctx.stroke(); ctx.restore(); }
  if (ug < 1) { // the frame (copy of the kit's paneFrame 'mirror')
    const b = 7; ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
    ctx.strokeStyle = '#8a7a5a'; ctx.lineWidth = b; ctx.strokeRect(-w / 2 - b / 2, -h / 2 - b / 2, w + b, h + b); ctx.strokeStyle = 'rgba(255,230,190,.35)'; ctx.lineWidth = 1; ctx.strokeRect(-w / 2 - b + 1, -h / 2 - b + 1, w + 2 * b - 2, h + 2 * b - 2);
    ctx.fillStyle = '#4a4030'; ctx.fillRect(-w * .36, h / 2 + b, w * .72, 10); ctx.fillStyle = '#2a2418'; ctx.beginPath(); ctx.ellipse(0, h / 2 + b + 12, w * .42, 9, 0, 0, TAU); ctx.fill(); ctx.restore();
  }
  if (tx > 0) addGlow(ctx, x, y, Math.max(w, h) * .8, .22 * tx, F6.cool, F6.coolCore);
  return { x, y, w, h, cx, cy };
}
