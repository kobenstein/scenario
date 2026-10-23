// Film 8 · chunk c09 · world D (8.15–8.17) and the c09>c10 deed (owner B3; others may import, never edit). Also used by c10 (B3).
//
//   paperPlateLocal(ctx, t, tone)       an exact copy of handoff4's paper plate, drawn in the CURRENT transform (0…W × 0…H), so the plate
//                                       can be the paper of an object (handoff4.plate() resets the transform, so it cannot be nested)
//   lightPlateLocal(ctx, t, tone)       the same for the light plate (c10>c11)
//   DEED                                the deed of 8.17 / 9.01 in plate units: paper rect R (16:9; at H.a it IS the frame), margin, seal
//   deed(ctx, t, o)                     draws the deed (current transform = deed units → screen): margin with an engraved border, the paper
//                                       plate nested in R, the wax seal on the right margin, the ribbon (the thread) held under the seal;
//                                       o = { rise 0..1 (colour from the dark), seal 0..1 (pressed), glint 0..1, thread [[x,y]…] }
//   waxSeal(ctx, t, x, y, r, o)         a red wax seal with an engraved rosette; o = { press 0..1, glint 0..1, a }
//   plateD(ctx, t, cam, o)              the anatomy plate seen through a zoom camera (cam = { x, y, d } in plate units, d = 1/zoom)
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift } from '../engine.mjs';
import { F8, anatomyPlate, plateGround, firefly, swarm, eoutX, einX, qio } from './f8_kit.mjs';
import { inkText } from './f8_chart.mjs';
import { glow, sine } from './f8_c09_world.mjs';

const TAU = Math.PI * 2;
// ---------------------------------------------------------------- handoff4 plates, copied verbatim (current transform respected)
const FIB = (() => { const r = prng(77), f = []; for (let i = 0; i < 420; i++) f.push([r() * W, r() * H, (r() - .5) * 2.4, 6 + r() * 26, r()]); return f; })();
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();
const PAPER = { cream: ['#f3ecda', '#e3d6b8', '#cdbb94'], warm: ['#f6e7c9', '#e8cfa2', '#d2ad74'] };
export function paperPlateLocal(ctx, t, tone = 'warm') {
  ctx.save();
  const [p0, p1, p2] = PAPER[tone] || PAPER.cream, lx = W * .32 + 30 * drift(t, 1, 2), ly = H * .25;
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1700); g.addColorStop(0, p0); g.addColorStop(.6, p1); g.addColorStop(1, p2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.lineCap = 'round';
  for (const [x, y, a, L, k] of FIB) { ctx.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .07 + .06 * k); ctx.lineWidth = .7 + k * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke(); }
  ctx.strokeStyle = rgba('#9c8458', .1); ctx.lineWidth = .8; const R0 = 300, rot = t * .02;
  for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let i = 0; i <= 360; i++) { const q = i / 360 * TAU, rr = R0 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); const x = W * .72 + rr * Math.cos(q + rot), y = H * .56 + rr * Math.sin(q + rot) * .92; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .75); v.addColorStop(0, 'rgba(60,40,20,0)'); v.addColorStop(1, 'rgba(60,40,20,.22)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
const LIGHT = { weave: ['#fff8e6', '#f3d9a0', '#6e5a36'], firefly: ['#f2fff5', '#b9f0c8', '#173a30'], dawn: ['#fff6e2', '#ffd9a0', '#f4a77a'], fire: ['#fff1d6', '#ffb35c', '#c4512e'], lamp: ['#fff1d6', '#ffcf8a', '#e08a3c'], ember: ['#fff1d6', '#ff9a3c', '#7a2a12'] };
export function lightPlateLocal(ctx, t, tone = 'weave') {
  ctx.save();
  const [c0, c1, c2] = LIGHT[tone] || LIGHT.lamp, br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
  const cx = W / 2 + 18 * drift(t, 1, 3), cy = H / 2 + 12 * drift(t, 1, 7);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1150 * br); g.addColorStop(0, c0); g.addColorStop(.42, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = prng(31 + Math.floor(t * 12)); ctx.fillStyle = rgba(c2, .32);
  for (const [u, v, k] of DOTS) {
    const x = u * W, y = v * H, d = Math.hypot(x - cx, y - cy) / 1100; if (d < .35) continue;
    if (k > (d - .35) * 1.4) continue; const s = .8 + r() * 1.1; ctx.fillRect(x + (r() - .5) * 2, y + (r() - .5) * 2, s, s);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the wax seal
export function waxSeal(ctx, t, x, y, r, o = {}) {
  const press = clamp(o.press ?? 1), a = o.a ?? 1, rr = prng(o.seed ?? 5);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  // the blob: an irregular round, a darker rim, a raised ring and an engraved rosette (pressed in)
  const pts = []; for (let i = 0; i < 28; i++) { const q = i / 28 * TAU; pts.push([Math.cos(q) * r * (1 + .07 * Math.sin(q * 5 + 1) + .04 * Math.sin(q * 11)), Math.sin(q) * r * (1 + .07 * Math.sin(q * 5 + 1) + .04 * Math.sin(q * 11))]); }
  ctx.fillStyle = 'rgba(40,10,6,.35)'; ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px + r * .08, py + r * .12) : ctx.moveTo(px + r * .08, py + r * .12))); ctx.closePath(); ctx.fill();
  const g = ctx.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r * 1.1); g.addColorStop(0, '#c8473a'); g.addColorStop(.6, '#9a2a22'); g.addColorStop(1, '#5e1712');
  ctx.fillStyle = g; ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(40,8,4,.5)'; ctx.lineWidth = r * .05; ctx.stroke();
  if (press > 0) {
    ctx.globalAlpha = a * press;
    ctx.strokeStyle = 'rgba(50,10,6,.55)'; ctx.lineWidth = r * .06; ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,170,150,.35)'; ctx.lineWidth = r * .03; ctx.beginPath(); ctx.arc(-r * .02, -r * .03, r * .75, Math.PI * 1.05, Math.PI * 1.75); ctx.stroke();
    ctx.strokeStyle = 'rgba(50,10,6,.6)'; ctx.lineWidth = r * .045; ctx.beginPath();
    for (let k = 0; k < 8; k++) { const q = k / 8 * TAU; ctx.moveTo(0, 0); ctx.quadraticCurveTo(Math.cos(q + .4) * r * .45, Math.sin(q + .4) * r * .45, Math.cos(q) * r * .58, Math.sin(q) * r * .58); }
    ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * .12, 0, TAU); ctx.fillStyle = 'rgba(60,12,8,.6)'; ctx.fill();
  }
  ctx.restore();
  // the glint: a soft highlight that slides over the wax
  const gl = clamp(o.glint ?? 0); if (gl > 0 && gl < 1) { const gx = x + mix(-r * .8, r * .8, gl), gy = y + mix(-r * .6, r * .5, gl); glow(ctx, gx, gy, r * 1.1, '#ffd6c8', .7 * Math.sin(Math.PI * gl) * a); }
}

// ---------------------------------------------------------------- the deed (8.17 → 9.01)
// in deed units: the paper R is 1920 × 1080 (the plate's own frame), the margin 90 left/top/bottom, 300 right (the seal sits there)
export const DEED = { R: { x: 0, y: 0, w: W, h: H }, m: [90, 90, 480, 90], seal: { x: W + 240, y: H * .6, r: 200 } };
export function deed(ctx, t, o = {}) {
  const rise = clamp(o.rise ?? 1), [ml, mt, mr, mb] = DEED.m, X0 = -ml, Y0 = -mt, X1 = W + mr, Y1 = H + mb;
  if (rise <= 0) return;
  // the deed unrolls from its sealed right edge to the left (a mask reveal with a rolled edge), taking its colour out of the dark
  const ux = mix(X1 + 40, X0 - 40, sine(rise)), dark = 0;
  ctx.save(); if (rise < 1) { ctx.beginPath(); ctx.rect(ux, Y0 - 60, X1 - ux + 120, Y1 - Y0 + 160); ctx.clip(); }
  // the sheet (shadow, margin paper, engraved double border), then the paper plate in R, then the seal
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(X0 + 30, Y0 + 40, X1 - X0, Y1 - Y0);
  ctx.fillStyle = '#ead6ae'; ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
  ctx.save(); ctx.beginPath(); ctx.rect(X0, Y0, X1 - X0, Y1 - Y0); ctx.rect(W, 0, -W, H); ctx.clip('evenodd');
  ctx.strokeStyle = 'rgba(120,80,40,.12)'; ctx.lineWidth = 3; ctx.beginPath(); for (let k = -1400; k < 2600; k += 16) { ctx.moveTo(k, Y1); ctx.lineTo(k + 700, Y0); } ctx.stroke(); ctx.restore();
  ctx.strokeStyle = 'rgba(110,70,30,.65)'; ctx.lineWidth = 6; ctx.strokeRect(X0 + 26, Y0 + 26, X1 - X0 - 52, Y1 - Y0 - 52); ctx.lineWidth = 2.5; ctx.strokeRect(X0 + 50, Y0 + 50, X1 - X0 - 100, Y1 - Y0 - 100);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); paperPlateLocal(ctx, t, 'warm'); ctx.restore();
  // the thread (gold) ends under the seal: its last part is visible on the margin
  if (o.thread) { ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = 'rgba(176,122,46,.9)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); o.thread.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.strokeStyle = 'rgba(255,240,200,.7)'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
  if (!o.noSeal) waxSeal(ctx, t, DEED.seal.x, DEED.seal.y, DEED.seal.r, { press: o.seal ?? 1, glint: o.glint ?? 0 });
  if (dark > 0) { ctx.fillStyle = rgba('#0a0c22', dark); ctx.fillRect(X0 - 2, Y0 - 2, X1 - X0 + 34, Y1 - Y0 + 44); }
  ctx.restore();
  if (rise < 1 && ux > X0 - 40) { const g = ctx.createLinearGradient(ux - 50, 0, ux + 40, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.55, 'rgba(234,214,174,.9)'); g.addColorStop(1, 'rgba(120,90,50,.6)'); ctx.save(); ctx.fillStyle = g; ctx.fillRect(Math.max(ux - 10, X0 - 10), Y0 - 6, 50, Y1 - Y0 + 12); ctx.restore(); }
}

// ---------------------------------------------------------------- the anatomy plate through a zoom camera
// cam = { x, y, d } plate units (identity: 960, 540, 1). o = { veil 0..1 (left half dark), memGlow, labels {memory,hands,will},
// leaders {memory,hands,will} 0..1, will 0..1, seed, after(ctx, P) }. P = { X(x), Y(y), k } maps plate units → screen.
export const PLATE_D = { x: 860, y: 800, s: 2.6, rect: { x: 110, y: 64, w: W - 220, h: 846 }, LX: 1330, LY: 250, LG: 120 };
export function plateD(ctx, t, cam, o = {}) {
  const k = 1 / cam.d, X = (x) => W / 2 + (x - cam.x) * k, Y = (y) => H / 2 + (y - cam.y) * k, P = { X, Y, k };
  ctx.save(); ctx.setTransform(k, 0, 0, k, W / 2 - cam.x * k, H / 2 - cam.y * k); ctx.fillStyle = '#090a1c'; ctx.fillRect(-W, -H, 3 * W, 3 * H); plateGround(ctx, t, 1, 1, o.seed ?? 1, PLATE_D.rect); ctx.restore();
  const D = PLATE_D, s = D.s * k;
  const pl = anatomyPlate(ctx, t, { x: X(D.x), y: Y(D.y), s, paper: 0, frame: 0, open: 1, leaders: 0, will: o.will ?? 1, memGlow: o.memGlow ?? 0, seed: o.seed ?? 1,
    handsLoop: o.handsLoop, stitches: o.stitches, interiorExtra: o.interiorExtra, ws: { lit: 1, glowA: 1 } });
  // leader lines + labels (own copy of the kit's, so each organ's line can come on its own word); drawn in plate units through P
  const names = [['memory', 'MEMORY'], ['hands', 'HANDS'], ['will', 'WILL']];
  names.forEach(([key, lab], i) => {
    const u = clamp(o.leaders?.[key] ?? 0); if (u <= 0) return; const e = eio(u), p = pl[key], LX = X(D.LX), ty = Y(D.LY + i * D.LG), m = [mix(p[0], LX, .55), ty];
    const L1 = Math.hypot(m[0] - p[0], m[1] - p[1]), L2 = LX - m[0], d = (L1 + L2) * e;
    ctx.save(); ctx.strokeStyle = rgba('#d9cfb0', .8); ctx.lineWidth = Math.max(1.2, 1.2 * k); ctx.beginPath(); ctx.moveTo(p[0], p[1]);
    if (d <= L1) ctx.lineTo(mix(p[0], m[0], d / L1), mix(p[1], m[1], d / L1)); else { ctx.lineTo(m[0], m[1]); ctx.lineTo(m[0] + d - L1, ty); }
    ctx.stroke(); ctx.fillStyle = '#e9dfc4'; ctx.beginPath(); ctx.arc(p[0], p[1], 3 * Math.max(1, k * .8), 0, TAU); ctx.fill(); if (e >= 1) { ctx.beginPath(); ctx.arc(LX, ty, 3 * Math.max(1, k * .8), 0, TAU); ctx.fill(); }
    ctx.restore();
    const lu = clamp(o.labels?.[key] ?? 0);
    if (lu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(LX + 14 * k, ty - 26 * k, 260 * k * eoutX(lu), 40 * k); ctx.clip(); ctx.fillStyle = '#efe4c6'; ctx.font = `600 ${26 * k}px "Inter"`; try { ctx.letterSpacing = `${7 * k}px`; } catch { } ctx.textBaseline = 'middle'; ctx.fillText(lab, LX + 20 * k, ty); ctx.restore(); }
  });
  // the veil: the left half of the plate in shadow (8.15, "half"), with a soft edge on the frame's centre line
  const v = clamp(o.veil ?? 0);
  if (v > 0) { const ex = X(960), g = ctx.createLinearGradient(ex - 60 * k, 0, ex + 30 * k, 0); g.addColorStop(0, rgba('#04050e', .78 * v)); g.addColorStop(1, rgba('#04050e', 0)); ctx.fillStyle = g; ctx.fillRect(Math.min(0, ex - 60 * k), 0, Math.max(0, ex + 30 * k - Math.min(0, ex - 60 * k)), H); }
  if (o.after) o.after(ctx, P, pl);
  return { P, pl };
}
