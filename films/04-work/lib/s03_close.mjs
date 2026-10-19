// s03_close · close-up props for chapter 03 (first half): hands, remote, phone with card feed, glasses, ticket, keys.
// All drawn per frame with plain paths (cheap), shaded with one light direction + a rim.
import { W, H, P, rgba, clamp, mix, prng, shade, mixHex, roughPoly, roughRect, roughLine, glowA, vg } from './s03_kit.mjs';

function cap(g, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1) || 1, k = Math.asin(clamp((r1 - r2) / d, -1, 1));
  g.beginPath(); g.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k); g.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k); g.closePath(); g.fill();
}
// hand seen from the back, fingers toward -y at rot 0. curl 0 = open, 1 = closed around something.
// o: { col, dark, rim, rimA, cuff (sleeve colour), cuffLen, glove, band (wristband colour) }
export function hand(g, x, y, s, rot, curl, o = {}) {
  const col = o.col || '#d9a77e', dark = o.dark || shade(col, -.12);
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  // sleeve / forearm
  if (o.cuff) { g.fillStyle = o.cuff; cap(g, 0, 60, 34, 0, 330, 40); }
  g.fillStyle = o.glove ? col : shade(col, -.02); cap(g, 0, 40, 30, 0, 120, 32);
  if (o.band) { g.fillStyle = o.band; g.fillRect(-32, 70, 64, 16); g.fillStyle = rgba('#000', .25); g.fillRect(-10, 74, 18, 8); }
  // palm
  g.fillStyle = col; g.beginPath(); g.roundRect(-36, -40, 72, 84, 24); g.fill();
  // fingers (4) with two segments
  const fx = [-26, -9, 9, 26], fl = [44, 52, 54, 46];
  for (let i = 0; i < 4; i++) {
    const c = clamp(curl * (1 + i * .05)), a1 = c * .5 + (i - 1.5) * .06, a2 = a1 + c * 1.1, l1 = fl[i] * .55 * (1 - .45 * c), l2 = fl[i] * .5 * (1 - .6 * c);
    const x0 = fx[i], y0 = -34, x1b = x0 + Math.sin(a1) * l1, y1 = y0 - Math.cos(a1) * l1, x2 = x1b + Math.sin(a2) * l2, y2 = y1 - Math.cos(a2) * l2;
    g.fillStyle = i % 2 ? shade(col, -.03) : col; cap(g, x0, y0, 9.5, x1b, y1, 8.5); cap(g, x1b, y1, 8.5, x2, y2, 7.5);
    if (c > .6) { g.fillStyle = dark; g.beginPath(); g.ellipse(x1b, y1, 8, 5, 0, 0, 7); g.fill(); }
  }
  // thumb
  const tc = clamp(curl); g.fillStyle = shade(col, -.04); cap(g, -34, 10, 12, -58 + tc * 20, -26 + tc * 8, 9);
  // form shade + rim
  g.globalCompositeOperation = 'source-atop';
  const gr = g.createLinearGradient(-40, 0, 40, 0); gr.addColorStop(0, rgba('#000', o.shadeA ?? .35)); gr.addColorStop(.7, rgba('#000', 0)); g.fillStyle = gr; g.fillRect(-120, -140, 240, 500);
  g.globalCompositeOperation = 'source-over';
  if (o.rim) { g.strokeStyle = rgba(o.rim, o.rimA ?? .7); g.lineWidth = 2.4; g.beginPath(); g.moveTo(36, 30); g.lineTo(36, -28); g.quadraticCurveTo(36, -60, 30, -80); g.stroke(); }
  if (o.glove) { g.strokeStyle = rgba('#000', .3); g.lineWidth = 2; g.beginPath(); g.moveTo(-34, 30); g.quadraticCurveTo(0, 38, 34, 30); g.stroke(); g.fillStyle = rgba('#000', .18); for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(-20 + i * 8, -10 + (i % 3) * 14, 6, 3, .4, 0, 7); g.fill(); } }
  g.restore();
}
export function remote(g, x, y, s, rot, { led = 1, rim = P.cy } = {}) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = '#0b0c16'; g.beginPath(); g.roundRect(-22, -95, 44, 190, 16); g.fill();
  g.fillStyle = '#1c1e30'; for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-12 + i * 12, -30 + j * 18, 4, 0, 7); g.fill(); }
  g.fillStyle = '#3a1a1a'; g.beginPath(); g.arc(0, -70, 7, 0, 7); g.fill();
  g.strokeStyle = rgba(rim, .5); g.lineWidth = 2; g.beginPath(); g.moveTo(22, -80); g.lineTo(22, 80); g.stroke();
  g.restore();
  if (led > 0) glowA(g, x + Math.sin(rot) * 80 * s, y - Math.cos(rot) * 80 * s, 14 * s, .3 * led, '#ff6a5a', '#ffd0c0');
}
export function wine(g, x, y, s, { fill = .5, col = P.wine, rim = '#cfe9f5', a = .85, lit = 0, surfaceTilt = 0, wobble = 0 } = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const bowl = () => { g.beginPath(); g.moveTo(-60, -300); g.bezierCurveTo(-74, -190, -52, -128, 0, -124); g.bezierCurveTo(52, -128, 74, -190, 60, -300); };
  // glass body tint
  g.fillStyle = rgba('#a8c8e8', .06); bowl(); g.closePath(); g.fill();
  if (fill > 0) {
    g.save(); bowl(); g.closePath(); g.clip(); const top = mix(-128, -280, fill);
    vg(g, [[0, shade(col, .12)], [1, shade(col, -.1)]], 0, top, 0, -124, [-80, top - 10, 160, 200]);
    g.fillStyle = rgba('#ff9aa8', .25 + lit * .4); g.beginPath(); g.ellipse(Math.sin(wobble) * 2, top, 66, 6 + surfaceTilt, Math.sin(wobble) * .03, 0, 7); g.fill();
    g.restore();
  }
  g.strokeStyle = rgba(rim, a); g.lineWidth = 3.2; bowl(); g.stroke();
  g.beginPath(); g.ellipse(0, -300, 60, 7, 0, 0, 7); g.stroke();
  g.lineWidth = 4; g.beginPath(); g.moveTo(0, -124); g.lineTo(0, -10); g.stroke();
  g.lineWidth = 3; g.beginPath(); g.ellipse(0, -6, 46, 9, 0, 0, 7); g.stroke();
  g.strokeStyle = rgba('#ffffff', .45 * a); g.lineWidth = 4; g.beginPath(); g.moveTo(-40, -280); g.quadraticCurveTo(-50, -200, -26, -160); g.stroke();
  g.restore();
}
// paper lottery slip: a long cream slip with perforated stub, a grid of number boxes (six crossed), a barcode, an ink stamp
export function ticket(g, x, y, s, rot, { glint = 0, stamp = 1, seed = 3 } = {}) {
  const r = prng(seed * 31 + 7), w = 420, h = 170;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = rgba('#3a1a08', .28); g.beginPath(); g.roundRect(-w / 2 + 10, -h / 2 + 12, w, h, 4); g.fill();
  g.fillStyle = '#f6eedb'; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 4); g.fill();
  // stub with perforation and a barcode
  g.strokeStyle = rgba('#7a6a50', .55); g.lineWidth = 1.2; g.setLineDash([2, 4]); g.beginPath(); g.moveTo(w / 2 - 92, -h / 2 + 6); g.lineTo(w / 2 - 92, h / 2 - 6); g.stroke(); g.setLineDash([]);
  for (let i = 0; i < 26; i++) { g.fillStyle = '#2a2420'; g.fillRect(w / 2 - 80 + i * 2.6, 22, r() < .5 ? 1.2 : 2, 46); }
  g.fillStyle = '#d8a040'; g.fillRect(-w / 2, -h / 2, w - 92, 6);
  // number boxes: 5 rows x 10, six of them crossed
  const crossed = new Set(); while (crossed.size < 6) crossed.add(Math.floor(r() * 50));
  for (let j = 0; j < 5; j++) for (let i = 0; i < 10; i++) {
    const bx = -w / 2 + 16 + i * 30, by = -h / 2 + 20 + j * 28, k = j * 10 + i;
    g.strokeStyle = rgba('#b0503a', .55); g.lineWidth = 1; g.strokeRect(bx, by, 24, 20);
    g.fillStyle = rgba('#7a3a2a', .7); g.font = '500 10px Inter'; g.fillText(String(k + 1), bx + (k < 9 ? 9 : 6), by + 14);
    if (crossed.has(k)) { g.strokeStyle = '#1a1a3a'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(bx + 3, by + 3); g.lineTo(bx + 21, by + 17); g.moveTo(bx + 21, by + 3); g.lineTo(bx + 3, by + 17); g.stroke(); }
  }
  // the ink stamp (already validated)
  if (stamp > 0) { g.save(); g.translate(60, 10); g.rotate(-.22); g.strokeStyle = rgba('#a03a2a', .75 * stamp); g.lineWidth = 3; g.strokeRect(-58, -24, 116, 48); g.lineWidth = 1.4; g.strokeRect(-52, -18, 104, 36); g.fillStyle = rgba('#a03a2a', .7 * stamp); g.font = '600 15px Inter'; g.fillText('2 0 2 6', -28, 6); g.restore(); }
  if (glint > 0) { const gx = mix(-w * .7, w * .7, glint); const gr = g.createLinearGradient(gx - 80, -h / 2, gx + 80, h / 2); gr.addColorStop(0, rgba('#ffffff', 0)); gr.addColorStop(.5, rgba('#fffaf0', .8 * Math.sin(Math.PI * glint))); gr.addColorStop(1, rgba('#ffffff', 0)); g.fillStyle = gr; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 4); g.fill(); }
  g.restore();
}
export function keys(g, x, y, s, rot) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.strokeStyle = '#8a8c98'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 24, 0, 6.2832); g.stroke();
  for (const [a, l] of [[.4, 90], [1.1, 74], [2.2, 82]]) { g.save(); g.rotate(a); g.fillStyle = '#9a9ca8'; g.beginPath(); g.roundRect(18, -9, 30, 18, 6); g.fill(); g.fillRect(44, -4, l - 40, 8); for (let k = 0; k < 4; k++) g.fillRect(52 + k * 9, 4, 5, 4 + (k % 2) * 3); g.restore(); }
  g.restore();
}
