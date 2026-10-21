// c18 · "you" from behind (three-quarter back view), the same person as 1.04: dark navy coat, ochre scarf lifting in the wind, round
// sloping shoulders, back-lit by the sunrise (a warm rim toward the light, a cool rim of sky), engraved hatching in the shadow.
// Copied from lib/sc01_m1_you.mjs (youFree, minute file, never imported) and extended for 18.08–18.10: the right arm can be posed from
// 3D (the scene projects shoulder → elbow → wrist into figure units) to take up the burin from the coping and push it along the line,
// and the burin is drawn in the hand. Buffers are size-quantised (no cache growth while the camera moves).
//   you(ctx, x, y, s, o) → { head, shoulder, hand }   x, y = between the feet, s = scale (1 → 1000 px tall)
//     o: { t, look 0..1 (head bowed → lifted), wind, light: { x, y, col, a }, sky, accent, coat, pants, skin, hair,
//          arm: null (hanging) | { el: [x, y], wr: [x, y] } (figure units, feet at 0,0, head top −1000), burin: null | { h: [x, y], tip: [x, y] },
//          lean 0..1 (a slight bow of the upper body toward the coping) }
import { rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { once } from './v2_c18_kit.mjs';

const BUF = new Map();
function buf(key, w, h) { if (!BUF.has(key)) { if (BUF.size >= 9) BUF.delete(BUF.keys().next().value); BUF.set(key, canvas(w, h)); } const [c, g] = BUF.get(key);   // a few recent sizes only (three buffers a size)
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, w, h); return [c, g]; }
function mkHatch() {   // one engraved diagonal hatch, drawn once at a fixed size and scaled into the figure's box
  const w = 900, h = 1200, [c, g] = canvas(w, h), r = prng(11), gap = 4.2;
  g.strokeStyle = '#000'; g.lineCap = 'round';
  for (let d = -h; d < w + h; d += gap * (.85 + r() * .3)) { g.globalAlpha = .5 + .5 * r(); g.lineWidth = .9 * (.7 + .6 * r()); g.beginPath(); let pen = false; for (let q = 0; q <= 1.0001; q += .02) { const x = d - q * h * .55, y = q * h; if (r() < .06) { pen = false; continue; } if (!pen) { g.moveTo(x, y); pen = true; } else g.lineTo(x + Math.sin(q * 40 + d) * .6, y); } g.stroke(); }
  return c;
}
const hatchTile = () => once('c18youhatch', mkHatch);
export const prewarmYou = () => hatchTile();
const q64 = (v) => Math.ceil(v / 64) * 64;
function shadeH(hex, d) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(clamp(v * (1 + d), 0, 255)); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
// a tapered limb (capsule) between two points with radii r1, r2
function limb(g, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(clamp((r1 - r2) / (d || 1), -1, 1));
  g.beginPath(); g.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); g.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); g.closePath(); g.fill();
}
// the burin in figure units: mushroom handle (wood) at h, ferrule, steel shaft to the tip (lozenge section: a light upper facet)
export function burinShape(g, h, tip, w = 1, mono = null) {
  const dx = tip[0] - h[0], dy = tip[1] - h[1], L = Math.hypot(dx, dy) || 1, a = Math.atan2(dy, dx);
  g.save(); g.translate(h[0], h[1]); g.rotate(a);
  const hr = 13 * w, hl = Math.min(L * .2, hr * 2.1), sw = 4.2 * w;
  const wood = mono || (() => { const gr = g.createLinearGradient(0, -hr, 0, hr); gr.addColorStop(0, '#b07a4c'); gr.addColorStop(.45, '#6a3f22'); gr.addColorStop(1, '#2a160c'); return gr; })();
  // the mushroom handle: a round knob (flattened underneath, as engravers cut it), a short neck, a brass ferrule
  g.fillStyle = wood; g.beginPath(); g.ellipse(hr * .72, -hr * .04, hr * .72, hr, 0, Math.PI * .58, Math.PI * 2.42); g.lineTo(hl, -hr * .36); g.quadraticCurveTo(hl + 4 * w, -hr * .3, hl + 7 * w, -hr * .24); g.lineTo(hl + 7 * w, hr * .24); g.quadraticCurveTo(hl + 4 * w, hr * .3, hl, hr * .36); g.lineTo(hr * 1.1, hr * .62); g.closePath(); g.fill();
  if (!mono) { g.strokeStyle = 'rgba(255,214,170,.55)'; g.lineWidth = 1.6 * w; g.beginPath(); g.ellipse(hr * .72, -hr * .04, hr * .6, hr * .86, 0, Math.PI * 1.05, Math.PI * 1.55); g.stroke(); }
  g.fillStyle = mono || '#c9a860'; g.fillRect(hl + 6 * w, -hr * .28, 5 * w, hr * .56);
  // the steel shaft: square section seen on its edge (a bright upper facet, a dark lower one), the bevelled point
  const steel = mono || (() => { const gr = g.createLinearGradient(0, -sw, 0, sw); gr.addColorStop(0, '#f3f4f6'); gr.addColorStop(.45, '#b4b8be'); gr.addColorStop(.55, '#575c64'); gr.addColorStop(1, '#22252a'); return gr; })();
  g.fillStyle = steel; g.beginPath(); g.moveTo(hl + 11 * w, -sw); g.lineTo(L - 14 * w, -sw * .8); g.lineTo(L, sw * .25); g.lineTo(L - 14 * w, sw * .8); g.lineTo(hl + 11 * w, sw); g.closePath(); g.fill();
  if (!mono) { g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 1.2 * w; g.beginPath(); g.moveTo(hl + 13 * w, -sw * .6); g.lineTo(L - 15 * w, -sw * .5); g.stroke(); g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(L - 14 * w, -sw * .8); g.lineTo(L, sw * .25); g.lineTo(L - 12 * w, -sw * .1); g.closePath(); g.fill(); }
  g.restore();
}
export function you(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, look = clamp(o.look ?? 1), wind = o.wind ?? 1, lean = clamp(o.lean ?? 0);
  const coat = o.coat || '#222c46', pants = o.pants || '#141526', skin = o.skin || '#b98262', hair = o.hair || '#141019', acc = o.accent || '#c8843a';
  const L = o.light || { x: x + 900 * s, y: y - 700 * s, col: '#ffe2b8', a: .9 };
  const br = Math.sin(t * Math.PI * 2 / 4.3), sway = Math.sin(t * Math.PI * 2 / 9.4) * .7 + Math.sin(t * 1.3) * .3;
  // figure units: feet at (0,0), head top at -1000; the box we draw into (room on the right for the arm and the burin)
  const X0 = -340, Y0 = -1080, BW = 860, BH = 1100, k = s, cw = q64(BW * k), ch = q64(BH * k);
  const [F, f] = buf('F' + cw + 'x' + ch, cw, ch), [M, m] = buf('M' + cw + 'x' + ch, cw, ch), [R, r] = buf('R' + cw + 'x' + ch, cw, ch);
  const U = (g) => g.setTransform(k, 0, 0, k, -X0 * k, -Y0 * k);
  const sy = -br * 3.5 + lean * 26, hx = sway * 4 + lean * 10;                   // shoulders breathe (and bow a little), hips sway
  const hd = { x: mix(8, 26, look) + hx * .5 + lean * 14, y: mix(-878, -905, look) + sy, rot: mix(.32, -.06, look) };
  const SH = [104 + lean * 8, -790 + sy];
  const paint = (g, mono) => {
    U(g); const C = (c) => mono || c;
    // legs
    g.fillStyle = C(pants);
    g.beginPath(); g.moveTo(-118 + hx, -420); g.bezierCurveTo(-120, -260, -112, -120, -96, 20); g.lineTo(-22, 20); g.bezierCurveTo(-28, -140, -20, -280, -6 + hx, -420); g.closePath(); g.fill();
    g.fillStyle = C(shadeH(pants, -.04)); g.beginPath(); g.moveTo(8 + hx, -420); g.bezierCurveTo(16, -280, 22, -140, 30, 20); g.lineTo(102, 20); g.bezierCurveTo(108, -130, 106, -270, 104 + hx, -420); g.closePath(); g.fill();
    // the right arm (far side): hanging, or posed from 3D (sleeve capsules, a mitten hand with the burin)
    if (!o.arm) {
      g.fillStyle = C(shadeH(coat, -.05)); g.beginPath();
      g.moveTo(98, -790 + sy); g.bezierCurveTo(150, -768 + sy, 166, -690, 166, -610); g.bezierCurveTo(166, -540, 160, -486, 152, -448); g.lineTo(110, -452); g.bezierCurveTo(112, -520, 112, -600, 100, -690); g.closePath(); g.fill();
      g.fillStyle = C(shadeH(skin, -.72)); g.beginPath(); g.moveTo(112, -452); g.bezierCurveTo(108, -436, 110, -416, 118, -404); g.bezierCurveTo(126, -394, 140, -394, 148, -402);
      g.bezierCurveTo(154, -410, 154, -424, 150, -436); g.lineTo(150, -452); g.closePath(); g.fill();
    } else {
      const E = o.arm.el, Wr = o.arm.wr, fa = Math.atan2(Wr[1] - E[1], Wr[0] - E[0]);
      if (o.burin) burinShape(g, o.burin.h, o.burin.tip, o.burin.w ?? 1, mono);
      g.fillStyle = C(shadeH(coat, -.05)); limb(g, SH[0] - 6, SH[1] + 22, 40, E[0], E[1], 31);
      g.fillStyle = C(shadeH(coat, -.02)); limb(g, E[0], E[1], 30, Wr[0], Wr[1], 25);
      // the hand round the handle: a dark mitten along the forearm, the thumb on top
      const hx2 = Wr[0] + Math.cos(fa) * 26, hy2 = Wr[1] + Math.sin(fa) * 26;
      g.fillStyle = C(shadeH(skin, -.68)); limb(g, Wr[0] + Math.cos(fa) * 4, Wr[1] + Math.sin(fa) * 4, 19, hx2, hy2, 17);
      g.beginPath(); g.ellipse(hx2 + Math.cos(fa - .9) * 12, hy2 + Math.sin(fa - .9) * 12, 11, 7, fa, 0, Math.PI * 2); g.fill();
      g.fillStyle = C(shadeH(coat, .04)); limb(g, Wr[0] - Math.cos(fa) * 10, Wr[1] - Math.sin(fa) * 10, 27, Wr[0] + Math.cos(fa) * 3, Wr[1] + Math.sin(fa) * 3, 26);   // the cuff
    }
    // the coat: round sloping shoulders, a soft waist, an A-line hem, the collar standing up at the neck
    g.fillStyle = C(coat); g.beginPath();
    g.moveTo(-178 + hx * .3, -340);
    g.bezierCurveTo(-170, -460, -150, -560, -148, -640);
    g.bezierCurveTo(-150, -700, -168, -748 + sy, -150, -786 + sy);
    g.bezierCurveTo(-120, -826 + sy, -60, -834 + sy, -18, -836 + sy);
    g.bezierCurveTo(30, -836 + sy, 84 + lean * 8, -828 + sy, 110 + lean * 8, -800 + sy);
    g.bezierCurveTo(134, -770 + sy, 126, -720, 124, -660);
    g.bezierCurveTo(122, -560, 140, -450, 150 + hx * .3, -338);
    g.quadraticCurveTo(-10, -318, -178 + hx * .3, -340); g.closePath(); g.fill();
    // near arm (left): hangs at the side, a little forward, the hand by the thigh
    g.fillStyle = C(shadeH(coat, .03)); g.beginPath();
    g.moveTo(-150, -780 + sy); g.bezierCurveTo(-196, -760 + sy, -206, -680, -204, -600); g.bezierCurveTo(-202, -530, -196, -480, -184, -446); g.lineTo(-140, -452); g.bezierCurveTo(-146, -520, -146, -600, -132, -690); g.closePath(); g.fill();
    g.fillStyle = C(shadeH(skin, -.72)); g.beginPath(); g.moveTo(-180, -452); g.bezierCurveTo(-186, -436, -186, -418, -178, -404); g.bezierCurveTo(-170, -392, -156, -390, -148, -398);
    g.bezierCurveTo(-142, -404, -142, -414, -146, -420); g.bezierCurveTo(-138, -424, -134, -434, -138, -444); g.lineTo(-142, -452); g.closePath(); g.fill();
    g.strokeStyle = C(shadeH(skin, -.82)); g.lineWidth = 1.6; g.beginPath(); g.moveTo(-174, -420); g.quadraticCurveTo(-164, -416, -152, -420); g.moveTo(-176, -408); g.quadraticCurveTo(-166, -403, -154, -406); g.stroke();
    // neck and the lost profile (no face)
    g.fillStyle = C(shadeH(skin, -.35)); g.beginPath(); g.moveTo(-34, -830 + sy); g.lineTo(34, -830 + sy); g.lineTo(26 + hd.x * .4, hd.y + 30); g.lineTo(-30 + hd.x * .4, hd.y + 34); g.closePath(); g.fill();
    g.save(); g.translate(hd.x, hd.y); g.rotate(hd.rot);
    g.fillStyle = C(shadeH(skin, -.25)); g.beginPath(); g.ellipse(8, 4, 60, 76, .08, 0, 7); g.fill();
    g.fillStyle = C(hair); g.beginPath();
    g.moveTo(52, -50); g.bezierCurveTo(30, -84, -30, -88, -56, -54); g.bezierCurveTo(-74, -20, -66, 30, -50, 52); g.bezierCurveTo(-30, 66, 0, 66, 20, 50);
    g.bezierCurveTo(28, 30, 30, 0, 40, -16); g.bezierCurveTo(48, -26, 56, -36, 52, -50); g.closePath(); g.fill();
    g.fillStyle = C(shadeH(skin, -.4)); g.beginPath(); g.ellipse(38, 2, 9, 15, .2, 0, 7); g.fill();
    g.restore();
    // scarf: a wrapped band at the collar and one tail over the left shoulder blade, lifting in the wind
    const wv = (q) => wind * (Math.sin(t * 2.3 + q * 3) * 10 + Math.sin(t * 3.7 + q * 5) * 4) * q;
    g.fillStyle = C(acc); g.beginPath(); g.ellipse(-4, -828 + sy, 92, 30, -.04, 0, 7); g.fill();
    g.beginPath(); g.moveTo(-70, -820 + sy); g.bezierCurveTo(-96 + wv(.3), -760, -104 + wv(.6), -690, -96 + wv(1), -610); g.lineTo(-48 + wv(1) * 1.1, -606); g.bezierCurveTo(-52 + wv(.6), -690, -44 + wv(.3), -760, -24, -818 + sy); g.closePath(); g.fill();
  };
  paint(f, null); paint(m, '#fff');
  // ---- form: cool sky on the shoulders, dark toward the ground, the side away from the light deeper ----
  f.setTransform(1, 0, 0, 1, 0, 0); f.globalCompositeOperation = 'source-atop';
  const vg = f.createLinearGradient(0, 0, 0, BH * k); vg.addColorStop(0, 'rgba(140,165,215,.16)'); vg.addColorStop(.35, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(2,3,9,.55)'); f.fillStyle = vg; f.fillRect(0, 0, cw, ch);
  const lx = (L.x - x) / k - X0, sideL = lx > BW / 2 ? 1 : -1;
  const hg = f.createLinearGradient(sideL > 0 ? 0 : BW * k, 0, sideL > 0 ? BW * k : 0, 0); hg.addColorStop(0, 'rgba(2,3,10,.5)'); hg.addColorStop(.55, 'rgba(2,3,10,.05)'); hg.addColorStop(1, rgba(L.col || '#ffe2b8', .06)); f.fillStyle = hg; f.fillRect(0, 0, cw, ch);
  f.globalAlpha = .34; f.drawImage(hatchTile(), 0, 0, 900, 1200, 0, 0, Math.max(cw, 900 * k), Math.max(ch, 1200 * k)); f.globalAlpha = 1;
  U(f); f.globalCompositeOperation = 'source-atop'; f.strokeStyle = 'rgba(0,0,0,.45)'; f.lineWidth = 2.2; f.beginPath(); f.moveTo(-14, -800 + sy); f.bezierCurveTo(-18, -640, -10, -480, -6, -330); f.stroke();
  f.lineWidth = 1.6; f.beginPath(); f.moveTo(-120, -560); f.quadraticCurveTo(-100, -500, -112, -420); f.moveTo(70, -600); f.quadraticCurveTo(84, -520, 76, -440); f.stroke();
  f.strokeStyle = rgba('#3a1a06', .45); f.lineWidth = 2; f.beginPath(); f.ellipse(-4, -822 + sy, 86, 16, -.04, .2, 2.9); f.stroke();
  if (o.burin) { f.globalCompositeOperation = 'source-over'; burinShape(f, o.burin.h, o.burin.tip, o.burin.w ?? 1); }   // the steel stays bright (not hatched)
  if (o.arm) {   // the hand and the cuff over the handle again (the burin sits in the hand)
    const E = o.arm.el, Wr = o.arm.wr, fa = Math.atan2(Wr[1] - E[1], Wr[0] - E[0]), hx2 = Wr[0] + Math.cos(fa) * 26, hy2 = Wr[1] + Math.sin(fa) * 26;
    f.fillStyle = shadeH(skin, -.7); limb(f, Wr[0] + Math.cos(fa) * 4, Wr[1] + Math.sin(fa) * 4, 19, hx2, hy2, 17);
    f.beginPath(); f.ellipse(hx2 + Math.cos(fa - .9) * 12, hy2 + Math.sin(fa - .9) * 12, 11, 7, fa, 0, Math.PI * 2); f.fill();
  }
  f.setTransform(1, 0, 0, 1, 0, 0);
  // ---- rims (mask minus the mask shifted away from the light) ----
  const rimLayer = (dx, dy, col, a, fade) => {
    r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'source-over'; r.clearRect(0, 0, cw, ch); r.drawImage(M, 0, 0); r.globalCompositeOperation = 'destination-out'; r.drawImage(M, -dx, -dy);
    if (fade) { r.globalCompositeOperation = 'destination-in'; fade(r); }
    r.globalCompositeOperation = 'source-in'; r.fillStyle = col; r.fillRect(0, 0, cw, ch);
    f.globalCompositeOperation = 'source-over'; f.globalAlpha = a; f.drawImage(R, 0, 0); f.globalAlpha = 1;
  };
  const dxL = L.x - x, dyL = L.y - (y - 700 * k), mL = Math.hypot(dxL, dyL) || 1, rw = Math.max(2, 4.2 * k);
  rimLayer(dxL / mL * rw, dyL / mL * rw, L.col || '#ffe2b8', L.a ?? .9, (g) => { const lg = g.createLinearGradient(0, 0, 0, BH * k); lg.addColorStop(0, '#fff'); lg.addColorStop(.62, 'rgba(255,255,255,.8)'); lg.addColorStop(.8, 'rgba(255,255,255,0)'); g.fillStyle = lg; g.fillRect(0, 0, cw, ch); });
  rimLayer(-rw * .7, -rw * 1.1, o.sky || '#9fb6cf', .45, (g) => { const lg = g.createLinearGradient(0, 0, 0, BH * k * .5); lg.addColorStop(0, '#fff'); lg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = lg; g.fillRect(0, 0, cw, ch); });
  ctx.drawImage(F, x + X0 * k, y + Y0 * k);
  const P = (ux, uy) => [x + ux * k, y + uy * k];
  return { head: P(hd.x, hd.y), shoulder: P(SH[0], SH[1]), hand: o.arm ? P(o.arm.wr[0], o.arm.wr[1]) : P(130, -420), tip: o.burin ? P(o.burin.tip[0], o.burin.tip[1]) : null };
}
// 3D two-bone arm: shoulder S, target wrist T (metres), lengths a (upper) b (fore), pole p (the way the elbow points) → elbow, wrist
export function arm3(S, T, a, b, p) {
  const d = [T[0] - S[0], T[1] - S[1], T[2] - S[2]], D = Math.hypot(...d), dd = Math.min(D, a + b - 1e-4), u = d.map((v) => v / (D || 1));
  const x = (a * a - b * b + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, a * a - x * x));
  const pd = p[0] * u[0] + p[1] * u[1] + p[2] * u[2], pn = [p[0] - u[0] * pd, p[1] - u[1] * pd, p[2] - u[2] * pd], pl = Math.hypot(...pn) || 1;
  const E = [0, 1, 2].map((i) => S[i] + u[i] * x + pn[i] / pl * h), W = [0, 1, 2].map((i) => S[i] + u[i] * dd);
  return { E, W };
}
