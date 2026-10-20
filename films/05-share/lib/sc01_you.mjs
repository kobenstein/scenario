// C1 · "you", the main character of the hook (H.04/H.05): a large figure seen from behind in three-quarter view on the roof, the phone
// in the right hand in front of the chest, an ochre scarf whose tail moves in the wind, the head bowed to the phone (look 0) and lifting
// toward the rising light (look 1). Back-lit: a dark, round-shouldered silhouette with a warm rim from the key light, a cool rim of sky,
// the display's warm light on the hand, the jaw and the scarf; engraved hatching in the shadow, stipple in the rim falloff.
// Faceless, arms in front / beside the body (never behind the back). Reusable by C10 for the close on the roof (import from here).
//   youBack(ctx, x, y, s, o) → { phone: [x, y] (display centre on screen), head: [x, y], hand: [x, y] }
//     x, y = between the feet (may be below the frame), s = scale (1 → 1000 px tall)
//     o: { t, look 0..1, lit 0..1 (display on), light: { x, y, col, a } (key light, screen), sky '#9fb6cf' (cool rim), accent '#c8843a',
//          wind 1, coat '#222c46', pants '#141526', skin '#b98262', hair '#141019', phoneUp 0..1 (raises the phone toward the face) }
import { rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { stipple } from './art.mjs';

const BUF = new Map();
function buf(key, w, h) { if (!BUF.has(key)) BUF.set(key, canvas(w, h)); const [c, g] = BUF.get(key); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.filter = 'none'; g.clearRect(0, 0, w, h); return [c, g]; }
const HAT = new Map();
function hatchTile(w, h, s) {   // engraved diagonal hatch (cached per size)
  const key = w + 'x' + h; if (HAT.has(key)) return HAT.get(key);
  const [c, g] = canvas(w, h), r = prng(11), gap = Math.max(2.6, 4.2 * s);
  g.strokeStyle = '#000'; g.lineCap = 'round';
  for (let d = -h; d < w + h; d += gap * (.85 + r() * .3)) { g.globalAlpha = .5 + .5 * r(); g.lineWidth = Math.max(.6, .9 * s) * (.7 + .6 * r()); g.beginPath(); let pen = false; for (let q = 0; q <= 1.0001; q += .02) { const x = d - q * h * .55, y = q * h; if (r() < .06) { pen = false; continue; } if (!pen) { g.moveTo(x, y); pen = true; } else g.lineTo(x + Math.sin(q * 40 + d) * .6, y); } g.stroke(); }
  HAT.set(key, c); return c;
}
export function youBack(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, look = clamp(o.look ?? 1), lit = clamp(o.lit ?? 1), wind = o.wind ?? 1, up = clamp(o.phoneUp ?? 0);
  const coat = o.coat || '#222c46', pants = o.pants || '#141526', skin = o.skin || '#b98262', hair = o.hair || '#141019', acc = o.accent || '#c8843a';
  const L = o.light || { x: x + 900 * s, y: y - 700 * s, col: '#ffe2b8', a: .9 };
  const br = Math.sin(t * Math.PI * 2 / 4.2), sway = Math.sin(t * Math.PI * 2 / 9) * .7 + Math.sin(t * 1.7) * .3;
  // figure units: feet at (0,0), head top at -1000; the box we draw into
  const X0 = -330, Y0 = -1060, BW = 700, BH = 1080, k = s, cw = Math.ceil(BW * k), ch = Math.ceil(BH * k);
  const [F, f] = buf('F' + cw + 'x' + ch, cw, ch), [M, m] = buf('M' + cw + 'x' + ch, cw, ch), [R, r] = buf('R' + cw + 'x' + ch, cw, ch);
  const U = (g) => g.setTransform(k, 0, 0, k, -X0 * k, -Y0 * k);
  const sy = -br * 3.5, hx = sway * 4;                      // shoulders breathe, hips sway
  const hd = { x: mix(8, 26, look) + hx * .5, y: mix(-878, -905, look) + sy, rot: mix(.32, -.06, look) };   // head: bowed → lifted, turning right
  const ph = { x: mix(150, 132, up), y: mix(-640, -720, up) + sy * .6 };   // the phone (display faces you, we see its back and its light)
  // ---- shapes (one function paints all parts; mono = mask colour) ----
  const paint = (g, mono) => {
    U(g); const C = (c) => mono || c;
    // legs (near leg left, a little forward; far leg right) — the coat covers them to the knee
    g.fillStyle = C(pants);
    g.beginPath(); g.moveTo(-118 + hx, -420); g.bezierCurveTo(-120, -260, -112, -120, -96, 20); g.lineTo(-22, 20); g.bezierCurveTo(-28, -140, -20, -280, -6 + hx, -420); g.closePath(); g.fill();
    g.fillStyle = C(shadeH(pants, -.04)); g.beginPath(); g.moveTo(8 + hx, -420); g.bezierCurveTo(16, -280, 22, -140, 30, 20); g.lineTo(102, 20); g.bezierCurveTo(108, -130, 106, -270, 104 + hx, -420); g.closePath(); g.fill();
    // far arm (right): upper arm angling out to the elbow, forearm forward to the phone (behind the coat edge)
    g.fillStyle = C(shadeH(coat, -.05));
    g.beginPath(); g.moveTo(100, -792 + sy); g.bezierCurveTo(150, -770 + sy, 182, -700, 186, -630); g.bezierCurveTo(188, -590, 170, -560, 148, -566); g.bezierCurveTo(128, -600, 110, -690, 92, -740); g.closePath(); g.fill();
    // the coat: round sloping shoulders, a soft waist, an A-line hem, the collar standing up at the neck
    g.fillStyle = C(coat); g.beginPath();
    g.moveTo(-178 + hx * .3, -340);
    g.bezierCurveTo(-170, -460, -150, -560, -148, -640);
    g.bezierCurveTo(-150, -700, -168, -748 + sy, -150, -786 + sy);
    g.bezierCurveTo(-120, -826 + sy, -60, -834 + sy, -18, -836 + sy);
    g.bezierCurveTo(30, -836 + sy, 84, -828 + sy, 110, -800 + sy);
    g.bezierCurveTo(134, -770 + sy, 126, -720, 124, -660);
    g.bezierCurveTo(122, -560, 140, -450, 150 + hx * .3, -338);
    g.quadraticCurveTo(-10, -318, -178 + hx * .3, -340); g.closePath(); g.fill();
    // near arm (left): hangs at the side, a little forward, the hand by the thigh
    g.fillStyle = C(shadeH(coat, .03)); g.beginPath();
    g.moveTo(-150, -780 + sy); g.bezierCurveTo(-196, -760 + sy, -206, -680, -204, -600); g.bezierCurveTo(-202, -530, -196, -480, -184, -446); g.lineTo(-140, -452); g.bezierCurveTo(-146, -520, -146, -600, -132, -690); g.closePath(); g.fill();
    // the hand: relaxed, fingers curled toward the thigh (a real silhouette, in the coat's shadow)
    g.fillStyle = C(shadeH(skin, -.72)); g.beginPath(); g.moveTo(-180, -452); g.bezierCurveTo(-186, -436, -186, -418, -178, -404); g.bezierCurveTo(-170, -392, -156, -390, -148, -398);
    g.bezierCurveTo(-142, -404, -142, -414, -146, -420); g.bezierCurveTo(-138, -424, -134, -434, -138, -444); g.lineTo(-142, -452); g.closePath(); g.fill();
    g.strokeStyle = C(shadeH(skin, -.82)); g.lineWidth = 1.6; g.beginPath(); g.moveTo(-174, -420); g.quadraticCurveTo(-164, -416, -152, -420); g.moveTo(-176, -408); g.quadraticCurveTo(-166, -403, -154, -406); g.stroke();
    // neck and the lost profile: jaw and cheek on the right edge of the head (no face)
    g.fillStyle = C(shadeH(skin, -.35)); g.beginPath(); g.moveTo(-34, -830 + sy); g.lineTo(34, -830 + sy); g.lineTo(26 + hd.x * .4, hd.y + 30); g.lineTo(-30 + hd.x * .4, hd.y + 34); g.closePath(); g.fill();
    g.save(); g.translate(hd.x, hd.y); g.rotate(hd.rot);
    g.fillStyle = C(shadeH(skin, -.25)); g.beginPath(); g.ellipse(8, 4, 60, 76, .08, 0, 7); g.fill();              // skull + cheek
    g.fillStyle = C(hair); g.beginPath();                                                                         // hair: covers the back, the cheek stays on the right
    g.moveTo(52, -50); g.bezierCurveTo(30, -84, -30, -88, -56, -54); g.bezierCurveTo(-74, -20, -66, 30, -50, 52); g.bezierCurveTo(-30, 66, 0, 66, 20, 50);
    g.bezierCurveTo(28, 30, 30, 0, 40, -16); g.bezierCurveTo(48, -26, 56, -36, 52, -50); g.closePath(); g.fill();
    g.fillStyle = C(shadeH(skin, -.4)); g.beginPath(); g.ellipse(38, 2, 9, 15, .2, 0, 7); g.fill();               // ear
    g.restore();
    // scarf: a wrapped band at the collar and one tail over the left shoulder blade, lifting in the wind
    const wv = (q) => wind * (Math.sin(t * 2.3 + q * 3) * 10 + Math.sin(t * 3.7 + q * 5) * 4) * q;
    g.fillStyle = C(acc); g.beginPath(); g.ellipse(-4, -828 + sy, 92, 30, -.04, 0, 7); g.fill();
    g.beginPath(); g.moveTo(-70, -820 + sy); g.bezierCurveTo(-96 + wv(.3), -760, -104 + wv(.6), -690, -96 + wv(1), -610); g.lineTo(-48 + wv(1) * 1.1, -606); g.bezierCurveTo(-52 + wv(.6), -690, -44 + wv(.3), -760, -24, -818 + sy); g.closePath(); g.fill();
    // the hand around the phone, at the right edge of the chest (fingers over the edge, lit by the display)
    g.fillStyle = C('#05060c'); g.beginPath(); g.roundRect(ph.x - 30, ph.y - 62, 58, 118, 10); g.fill();          // phone back
    g.fillStyle = C(shadeH(skin, -.3)); g.beginPath(); g.moveTo(ph.x - 34, ph.y + 18); g.bezierCurveTo(ph.x - 40, ph.y + 52, ph.x - 6, ph.y + 70, ph.x + 22, ph.y + 54);
    g.bezierCurveTo(ph.x + 38, ph.y + 44, ph.x + 40, ph.y + 10, ph.x + 30, ph.y - 6); g.bezierCurveTo(ph.x + 10, ph.y + 8, ph.x - 20, ph.y + 6, ph.x - 34, ph.y + 18); g.closePath(); g.fill();
    for (const dy of [-34, -14]) { g.beginPath(); g.ellipse(ph.x + 30, ph.y + dy, 9, 11, .2, 0, 7); g.fill(); }
  };
  paint(f, null); paint(m, '#fff');
  // ---- form: cool sky on the shoulders, dark toward the ground, the shadow side (left) deeper ----
  f.setTransform(1, 0, 0, 1, 0, 0); f.globalCompositeOperation = 'source-atop';
  const vg = f.createLinearGradient(0, 0, 0, ch); vg.addColorStop(0, 'rgba(140,165,215,.16)'); vg.addColorStop(.35, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(2,3,9,.55)'); f.fillStyle = vg; f.fillRect(0, 0, cw, ch);
  const lx = (L.x - x) / k - X0, sideL = lx > BW / 2 ? 1 : -1;
  const hg = f.createLinearGradient(sideL > 0 ? 0 : cw, 0, sideL > 0 ? cw : 0, 0); hg.addColorStop(0, 'rgba(2,3,10,.5)'); hg.addColorStop(.55, 'rgba(2,3,10,.05)'); hg.addColorStop(1, rgba(L.col || '#ffe2b8', .06)); f.fillStyle = hg; f.fillRect(0, 0, cw, ch);
  f.globalAlpha = .34; f.drawImage(hatchTile(cw, ch, k), 0, 0); f.globalAlpha = 1;
  // coat seam, collar line, a fold or two (ink)
  U(f); f.globalCompositeOperation = 'source-atop'; f.strokeStyle = 'rgba(0,0,0,.45)'; f.lineWidth = 2.2; f.beginPath(); f.moveTo(-14, -800 + sy); f.bezierCurveTo(-18, -640, -10, -480, -6, -330); f.stroke();
  f.lineWidth = 1.6; f.beginPath(); f.moveTo(-120, -560); f.quadraticCurveTo(-100, -500, -112, -420); f.moveTo(70, -600); f.quadraticCurveTo(84, -520, 76, -440); f.stroke();
  f.strokeStyle = rgba('#3a1a06', .45); f.lineWidth = 2; f.beginPath(); f.ellipse(-4, -822 + sy, 86, 16, -.04, .2, 2.9); f.stroke();
  f.setTransform(1, 0, 0, 1, 0, 0);
  // ---- rims (mask minus the mask shifted away from the light) ----
  const rimLayer = (dx, dy, col, a, fade) => {
    r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'source-over'; r.clearRect(0, 0, cw, ch); r.drawImage(M, 0, 0); r.globalCompositeOperation = 'destination-out'; r.drawImage(M, -dx, -dy);
    if (fade) { r.globalCompositeOperation = 'destination-in'; fade(r); }
    r.globalCompositeOperation = 'source-in'; r.fillStyle = col; r.fillRect(0, 0, cw, ch);
    f.globalCompositeOperation = 'source-over'; f.globalAlpha = a; f.drawImage(R, 0, 0); f.globalAlpha = 1;
  };
  const dxL = L.x - x, dyL = L.y - (y - 700 * k), mL = Math.hypot(dxL, dyL) || 1, rw = Math.max(2, 4.2 * k);
  rimLayer(dxL / mL * rw, dyL / mL * rw, L.col || '#ffe2b8', L.a ?? .9, (g) => { const lg = g.createLinearGradient(0, 0, 0, ch); lg.addColorStop(0, '#fff'); lg.addColorStop(.62, 'rgba(255,255,255,.8)'); lg.addColorStop(.8, 'rgba(255,255,255,0)'); g.fillStyle = lg; g.fillRect(0, 0, cw, ch); });
  rimLayer(-rw * .7, -rw * 1.1, o.sky || '#9fb6cf', .45, (g) => { const lg = g.createLinearGradient(0, 0, 0, ch * .5); lg.addColorStop(0, '#fff'); lg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = lg; g.fillRect(0, 0, cw, ch); });
  // ---- the display's warm light on the hand, the jaw, the scarf's right side ----
  if (lit > 0) {
    const px = (ph.x - X0) * k, py = (ph.y - Y0) * k;
    r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'source-over'; r.clearRect(0, 0, cw, ch); r.drawImage(M, 0, 0); r.globalCompositeOperation = 'destination-in';
    const gg = r.createRadialGradient(px - 10 * k, py - 30 * k, 0, px - 10 * k, py - 30 * k, 300 * k); gg.addColorStop(0, '#fff'); gg.addColorStop(.35, 'rgba(255,255,255,.4)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); r.fillStyle = gg; r.fillRect(0, 0, cw, ch);
    r.globalCompositeOperation = 'destination-out'; r.drawImage(M, 14 * k, 4 * k);       // only the edges that face the phone (left of it)
    r.globalCompositeOperation = 'source-in'; r.fillStyle = '#ffb35c'; r.fillRect(0, 0, cw, ch);
    f.globalCompositeOperation = 'lighter'; f.globalAlpha = .95 * lit; f.drawImage(R, 0, 0); f.drawImage(R, -2 * k, 0); f.globalAlpha = 1; f.globalCompositeOperation = 'source-over';
    // the phone's edge glows (its display faces the body)
    U(f); f.strokeStyle = rgba('#ffd9a8', .7 * lit); f.lineWidth = 2.4; f.beginPath(); f.moveTo(ph.x - 30, ph.y - 52); f.lineTo(ph.x - 30, ph.y + 46); f.stroke(); f.setTransform(1, 0, 0, 1, 0, 0);
  }
  ctx.drawImage(F, x + X0 * k, y + Y0 * k);
  const P = (ux, uy) => [x + ux * k, y + uy * k];
  return { phone: P(ph.x - 34, ph.y - 6), head: P(hd.x, hd.y), hand: P(ph.x, ph.y + 30), shoulder: P(110, -800) };
}
function shadeH(hex, d) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(clamp(v * (1 + d), 0, 255)); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
