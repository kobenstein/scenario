// C2 · the small brass bell of 0.08 (the ritual of a stock market debut), seen from below in a cone of light. Owner C2.
//   bell(ctx, x, y, s, t, o) → { hi: [x, y] (the hero highlight, the carrier into 0.10), lip: { x, y, rx, ry } }
//     x, y = the crown (top of the bell's body) on screen; s = scale (1 → body height 300 px)
//     o: { sway (rad, the whole bell swings about the hanger), clapper (rad, extra swing of the clapper), mouth (.0–.5: how far we
//          look into the mouth, low angle), glint (0..1 travelling highlight), hanger (true: bracket and loop above), a }
// Brass is built from the light: a lit band on the left, engraved hatching on the shadow side, a hot specular streak.
import { rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';

const TAU = Math.PI * 2;
// radius of the bell (in units of the body height) at height h (0 = crown, 1 = lip)
function prof(h) {
  if (h < .08) return .2 + .12 * Math.sin(h / .08 * Math.PI / 2);   // shoulder
  if (h < .62) return .32 + .045 * ((h - .08) / .54);                // waist, nearly straight
  const q = (h - .62) / .38; return .365 + .27 * q * q;              // the flare to the lip
}
const HB = 300;
function pts(s, n = 40) { const L = [], R = []; for (let i = 0; i <= n; i++) { const h = i / n, r = prof(h) * HB * s; L.push([-r, h * HB * s]); R.push([r, h * HB * s]); } return { L, R }; }
const HATCH = new Map();
function hatchLayer(s) {
  const key = Math.round(s * 100); if (HATCH.has(key)) return HATCH.get(key);
  const w = Math.ceil(HB * s * 1.4), h = Math.ceil(HB * s * 1.1), [c, g] = canvas(w, h), r = prng(4);
  g.translate(w / 2, 4); g.strokeStyle = 'rgba(30,16,6,.75)'; g.lineCap = 'round';
  // contour hatching on the shadow side: lines following the flare, swelling toward the dark edge
  for (let k = 0; k < 26; k++) {
    const f = .42 + k / 26 * .58; g.lineWidth = .6 + 1.5 * Math.pow(k / 26, 1.4); g.beginPath();
    for (let i = 0; i <= 60; i++) { const hh = .04 + i / 60 * .92, x = prof(hh) * HB * s * f, y = hh * HB * s + (r() - .5) * .6; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  }
  HATCH.set(key, c); return c;
}
export function bell(ctx, x, y, s, t, o = {}) {
  const sway = o.sway ?? 0, a = o.a ?? 1, mouth = o.mouth ?? .32, Hs = HB * s, rl = prof(1) * Hs, ry = rl * mouth;
  const P = pts(s);
  ctx.save(); ctx.globalAlpha = a;
  // hanger: a dark iron bracket from above and the bell's loop (canon)
  if (o.hanger !== false) {
    ctx.save(); ctx.strokeStyle = '#120c0a'; ctx.lineWidth = 16 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 160 * s, y - 120 * s); ctx.lineTo(x + 160 * s, y - 120 * s); ctx.stroke();
    ctx.lineWidth = 7 * s; ctx.beginPath(); ctx.moveTo(x - 150 * s, y - 120 * s); ctx.lineTo(x - 150 * s, y - 400 * s); ctx.moveTo(x + 150 * s, y - 120 * s); ctx.lineTo(x + 150 * s, y - 400 * s); ctx.stroke();
    ctx.strokeStyle = rgba('#ffd59a', .25); ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(x - 160 * s, y - 128 * s); ctx.lineTo(x + 100 * s, y - 128 * s); ctx.stroke(); ctx.restore();
  }
  ctx.translate(x, y - 110 * s); ctx.rotate(sway); ctx.translate(0, 110 * s);
  if (o.hanger !== false) { // the loop (canon) through the bracket
    ctx.save(); ctx.strokeStyle = '#6a4a22'; ctx.lineWidth = 12 * s; ctx.beginPath(); ctx.ellipse(0, -62 * s, 34 * s, 46 * s, 0, 0, TAU); ctx.stroke(); ctx.strokeStyle = rgba('#ffe2a8', .5); ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.ellipse(0, -62 * s, 34 * s, 46 * s, 0, Math.PI * .9, Math.PI * 1.45); ctx.stroke(); ctx.restore();
  }
  // body silhouette: sides, closed below by the front half of the lip ellipse
  const body = new Path2D(); body.moveTo(P.L[0][0], P.L[0][1]); for (const p of P.L) body.lineTo(p[0], p[1]);
  body.ellipse(0, Hs, rl, ry, 0, Math.PI, 0, true); for (let i = P.R.length - 1; i >= 0; i--) body.lineTo(P.R[i][0], P.R[i][1]);
  body.ellipse(0, 0, P.R[0][0], P.R[0][0] * .28, 0, 0, Math.PI, true); body.closePath();
  // brass: horizontal light across the form (lit from the upper left)
  const g = ctx.createLinearGradient(-rl, 0, rl, 0);
  g.addColorStop(0, '#5a3a16'); g.addColorStop(.14, '#c88a3a'); g.addColorStop(.27, '#f6d48e'); g.addColorStop(.33, '#fff2cf'); g.addColorStop(.4, '#e3a85a'); g.addColorStop(.62, '#8a5a24'); g.addColorStop(.86, '#3a2410'); g.addColorStop(1, '#1e1208');
  ctx.fillStyle = g; ctx.fill(body);
  // vertical falloff (the top in the light, the flare darker)
  ctx.save(); ctx.clip(body); const vg = ctx.createLinearGradient(0, 0, 0, Hs); vg.addColorStop(0, 'rgba(255,230,180,.18)'); vg.addColorStop(.6, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,4,.35)'); ctx.fillStyle = vg; ctx.fillRect(-rl, -10, rl * 2, Hs + 20);
  // engraved hatching on the shadow side
  const HL = hatchLayer(s); ctx.globalAlpha = a * .75; ctx.drawImage(HL, -HL.width / 2, -4); ctx.globalAlpha = a;
  // raised bands: two rings at the waist and above the sound bow
  for (const [hh, lw] of [[.16, 3], [.2, 1.5], [.78, 3.5], [.83, 1.6]]) { const r = prof(hh) * Hs, yy = hh * Hs; ctx.strokeStyle = 'rgba(40,22,8,.55)'; ctx.lineWidth = lw * s; ctx.beginPath(); ctx.ellipse(0, yy, r, r * mouth * .9, 0, 0, Math.PI); ctx.stroke(); ctx.strokeStyle = 'rgba(255,236,190,.4)'; ctx.lineWidth = lw * .5 * s; ctx.beginPath(); ctx.ellipse(0, yy - 2 * s, r, r * mouth * .9, 0, Math.PI * .55, Math.PI * .95); ctx.stroke(); }
  ctx.restore();
  // the inside of the mouth (we look up into it): dark brass, a warm bounce at the back
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, Hs, rl * .985, ry * .97, 0, 0, TAU); ctx.clip();
  const ig = ctx.createRadialGradient(-rl * .2, Hs - ry * .4, 0, 0, Hs, rl); ig.addColorStop(0, '#5a3a18'); ig.addColorStop(.5, '#24160a'); ig.addColorStop(1, '#0c0703'); ctx.fillStyle = ig; ctx.fillRect(-rl, Hs - ry, rl * 2, ry * 2);
  // clapper: a stem from the dark crown inside and a ball; it hangs a little below the lip and trembles
  const ca = sway * -.6 + (o.clapper ?? 0), cl = Hs * .95;
  ctx.restore();
  ctx.save(); ctx.translate(0, Hs * .25); ctx.rotate(ca);
  ctx.strokeStyle = '#1a0f06'; ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(0, Hs * .55); ctx.lineTo(0, cl); ctx.stroke();
  const bg = ctx.createRadialGradient(-8 * s, cl - 6 * s, 0, 0, cl, 26 * s); bg.addColorStop(0, '#d9a25a'); bg.addColorStop(.5, '#6a421a'); bg.addColorStop(1, '#1a0f06'); ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(0, cl, 24 * s, 0, TAU); ctx.fill();
  ctx.restore();
  // the sound bow: a thick lip ring, lit on the left
  ctx.save(); ctx.lineWidth = 7 * s; const lg = ctx.createLinearGradient(-rl, 0, rl, 0); lg.addColorStop(0, '#6a4418'); lg.addColorStop(.25, '#ffe6b0'); lg.addColorStop(.45, '#c4843a'); lg.addColorStop(1, '#2a1a0a'); ctx.strokeStyle = lg;
  ctx.beginPath(); ctx.ellipse(0, Hs, rl, ry, 0, 0, TAU); ctx.stroke(); ctx.restore();
  // specular streak and the hero highlight (it travels a little with the sway; o.glint runs a band down the body)
  const hx = -rl * .34 + sway * 40 * s, hy = Hs * .42;
  ctx.save(); ctx.clip(body); ctx.globalCompositeOperation = 'lighter';
  const sg = ctx.createLinearGradient(hx - 18 * s, 0, hx + 18 * s, 0); sg.addColorStop(0, 'rgba(255,240,200,0)'); sg.addColorStop(.5, 'rgba(255,248,230,.5)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = sg; ctx.fillRect(hx - 20 * s, 0, 40 * s, Hs);
  if ((o.glint ?? -1) >= 0) { const gy = mix(-40, Hs + 40, o.glint) * 1, g2 = ctx.createLinearGradient(0, gy - 30 * s, 0, gy + 30 * s); g2.addColorStop(0, 'rgba(255,230,180,0)'); g2.addColorStop(.5, 'rgba(255,248,230,.55)'); g2.addColorStop(1, 'rgba(255,230,180,0)'); ctx.fillStyle = g2; ctx.fillRect(-rl, gy - 30 * s, rl * 2, 60 * s); }
  ctx.restore();
  const m = ctx.getTransform(); ctx.restore();
  const hiS = [m.a * hx + m.c * hy + m.e, m.b * hx + m.d * hy + m.f], lipS = [m.a * 0 + m.c * Hs + m.e, m.b * 0 + m.d * Hs + m.f];
  return { hi: hiS, lip: { x: lipS[0], y: lipS[1], rx: rl, ry } };
}
