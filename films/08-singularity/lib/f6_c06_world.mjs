// Film 6 · c06 · the two worlds of §3a: the dark ground of the amber pulse line (world A: "you", the ember in the chest, the pane that
// becomes Seth's screen) and the night nursery behind the glass (world B: two bassinets, the laundry corner, the study page on the floor).
// Pure functions of t; deterministic prng; cached layers via the kit's layer(). Owned by c06 (builder of scenes/sc06.mjs).
// Copied (with changes, see each note): the line plate of lib/handoff4.mjs (lineGround + pulseLine: the same ground and the same
// stroke recipe, the line now a function y(x) so it can beat and end at the chest); babyBundle + the basket of babyBed from lib/figure.mjs
// (baby + bassinet: the baby can cry); the bezier easings of lib/f6_c04_mind.mjs.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, drift, rough, poly, text } from '../engine.mjs';
import { stipple } from './art.mjs';
import { fibreFill } from './print.mjs';
import { F6, layer, ember, reveal } from './f6_kit.mjs';
import { scribble } from './paper.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- easing (MOTION.md), copied from lib/f6_c04_mind.mjs
export function bezier(x1, y1, x2, y2) {
  const A = (a1, a2) => 1 - 3 * a2 + 3 * a1, B = (a1, a2) => 3 * a2 - 6 * a1, C = (a1) => 3 * a1;
  const calc = (u, a1, a2) => ((A(a1, a2) * u + B(a1, a2)) * u + C(a1)) * u, slope = (u, a1, a2) => 3 * A(a1, a2) * u * u + 2 * B(a1, a2) * u + C(a1);
  return (x) => { x = clamp(x); if (x <= 0) return 0; if (x >= 1) return 1; let u = x; for (let i = 0; i < 8; i++) { const s = slope(u, x1, x2); if (Math.abs(s) < 1e-6) break; u -= (calc(u, x1, x2) - x) / s; } return calc(clamp(u), y1, y2); };
}
export const QUART = bezier(.76, 0, .24, 1), EXPO_OUT = bezier(.16, 1, .3, 1), EXPO_IN = bezier(.7, 0, .84, 0);
export const bell = (q) => (Math.abs(q) >= 1 ? 0 : Math.pow(Math.cos(q * Math.PI / 2), 2));
const shadeHex = (hex, d) => { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.round(clamp(v + d * 255, 0, 255)); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); };

// ================================================================ world A: the ground of the line plate (lib/handoff4.mjs linePlate), extended
// beyond the frame so the camera may move; at the identity camera it is the plate's ground pixel for pixel.
export function lineGround(ctx, t, o = {}) {
  const y = o.y ?? 560, X0 = -800, X1 = 2800, Y0 = -500, Y1 = 1600;
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
  const v = ctx.createRadialGradient(W / 2, y, 0, W / 2, y, W * .7); v.addColorStop(0, 'rgba(40,36,90,.55)'); v.addColorStop(1, 'rgba(10,12,34,0)'); ctx.fillStyle = v; ctx.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
  ctx.strokeStyle = 'rgba(160,150,220,.05)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let k = -70; k < 110; k++) { const x = k * 34 + (t * 6) % 34; ctx.moveTo(x + 520 * (-Y0 / H), Y0); ctx.lineTo(x - 520 * (Y1 / H), Y1); }
  ctx.stroke();
}
// the amber pulse line: the plate's stroke recipe along y = yAt(x) from x0 to x1 (the plate: y = o.y + 2 sin(.9 t), x ∈ [W/2 − 1400, W/2 + 1400])
export function pulseLine(ctx, t, o = {}) {
  const col = ['#ffb35c', '#fff1d6'], a = o.a ?? 1, x0 = o.x0 ?? W / 2 - 1400, x1 = o.x1 ?? W / 2 + 1400, yAt = o.yAt || (() => 560);
  if (x1 - x0 < 4) return;
  const wob = 2 * Math.sin(t * .9), br = .9 + .1 * Math.sin(t * 2.1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const trace = () => { ctx.beginPath(); for (let x = x0; x < x1 + 6; x += 6) { const xx = Math.min(x, x1); xx === x0 ? ctx.moveTo(xx, yAt(xx) + wob) : ctx.lineTo(xx, yAt(xx) + wob); if (xx === x1) break; } };
  for (const [w, al, c] of [[26, .05, col[0]], [10, .14, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) { ctx.strokeStyle = rgba(c, al * a); ctx.lineWidth = w; trace(); ctx.stroke(); }
  // the engraving texture: tiny ticks at the plate's positions (x relative to W/2, every 9 px)
  ctx.strokeStyle = rgba(col[1], .35 * a); ctx.lineWidth = 1; ctx.beginPath();
  const k0 = Math.ceil((x0 - W / 2) / 9), k1 = Math.floor((x1 - W / 2) / 9);
  for (let k = k0; k <= k1; k++) { const xr = k * 9, x = W / 2 + xr, h = 2 + 1.5 * Math.sin(xr * .07 + t), y = yAt(x) + wob; ctx.moveTo(x, y - h); ctx.lineTo(x + 3, y + h); }
  ctx.stroke(); ctx.restore();
  if (o.head && x1 < W / 2 + 1390) { // the retracting tip: a bright head (the thread being drawn into the chest)
    const y = yAt(x1) + wob; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x1, y, 0, x1, y, 34); g.addColorStop(0, rgba(col[1], .9 * a)); g.addColorStop(.3, rgba(col[0], .5 * a)); g.addColorStop(1, rgba(col[0], 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x1, y, 34, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba('#ffffff', .95 * a); ctx.beginPath(); ctx.arc(x1, y, 2.2, 0, TAU); ctx.fill(); ctx.restore();
  }
}
// one engraved heartbeat (P · QRS · T) as a rise in px at distance d from the beat's centre (positive = up)
export function ecg(d, amp = 1) {
  if (d < -170 || d > 160) return 0;
  const R = (q) => (Math.abs(q) >= 1 ? 0 : Math.pow(1 - Math.abs(q), 1.5));
  return amp * (9 * bell((d + 120) / 34) - 8 * bell((d + 24) / 12) + 98 * R(d / 20) - 26 * bell((d - 22) / 15) + 17 * bell((d - 96) / 40));
}

// ---------------------------------------------------------------- the small clockwork in the head (callback to §2: thinking is machinery)
function gearPath(ctx, r, n) {
  ctx.beginPath();
  for (let i = 0; i < n; i++) { const a0 = i / n * TAU, w = TAU / n; const pts = [[a0, r], [a0 + w * .2, r], [a0 + w * .3, r * 1.3], [a0 + w * .6, r * 1.3], [a0 + w * .7, r]];
    pts.forEach(([a, rr], j) => { const x = Math.cos(a) * rr, y = Math.sin(a) * rr; (i === 0 && j === 0) ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }); }
  ctx.closePath();
}
//   gears(ctx, t, { x, y, s, ang (accumulated turn of the big gear, rad), a })  three small meshing gears, silver-blue, a cool bloom
export function gears(ctx, t, o = {}) {
  const s = o.s ?? 1, a = o.a ?? 1, G = [{ dx: 0, dy: 0, r: 13, n: 10 }, { dx: 21.5, dy: -8, r: 8, n: 7 }, { dx: -15, dy: -15, r: 6.5, n: 6 }];
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s, s);
  ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(4, -6, 0, 4, -6, 42); gl.addColorStop(0, rgba(F6.cool, .22 * a)); gl.addColorStop(1, rgba(F6.cool, 0)); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(4, -6, 42, 0, TAU); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  G.forEach((g, i) => {
    ctx.save(); ctx.translate(g.dx, g.dy); ctx.rotate((o.ang ?? 0) * 13 / g.r * (i % 2 ? -1 : 1) + i * .3);
    gearPath(ctx, g.r, g.n); ctx.fillStyle = rgba('#0d1a2e', .9 * a); ctx.fill(); ctx.lineWidth = .9; ctx.strokeStyle = rgba(F6.cool, .85 * a); ctx.stroke();
    ctx.strokeStyle = rgba(F6.coolCore, .7 * a); ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(0, 0, g.r * .55, 0, TAU); ctx.stroke();
    for (let k = 0; k < 3; k++) { const an = k / 3 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(an) * g.r * .2, Math.sin(an) * g.r * .2); ctx.lineTo(Math.cos(an) * g.r * .55, Math.sin(an) * g.r * .55); ctx.stroke(); }
    ctx.fillStyle = rgba(F6.coolCore, .9 * a); ctx.beginPath(); ctx.arc(0, 0, 1.3, 0, TAU); ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}

// ---------------------------------------------------------------- goose bumps: a run of tiny lights along an arm (6.03)
export function gooseBumps(ctx, t, from, to, t0, seed = 1, k = 1) {
  const n = 13, r = prng(seed), u = lin(t0, t0 + .45, t); if (u <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const q = i / (n - 1), on = clamp((u - q * .8) / .2), life = clamp((t - t0 - q * .36) / 1.6); if (on <= 0 || life >= 1) continue;
    const x = mix(from[0], to[0], q) + (r() - .5) * 12 * k, y = mix(from[1], to[1], q) + (r() - .5) * 10 * k - 5 * k, s = (1.2 + r() * 1.2) * k * on * (1 - life * .7);
    const g = ctx.createRadialGradient(x, y, 0, x, y, s * 4); g.addColorStop(0, rgba('#fff1d6', .9 * on * (1 - life))); g.addColorStop(.4, rgba(F6.amber, .4 * on * (1 - life))); g.addColorStop(1, rgba(F6.amber, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s * 4, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- a screen-space source label (Inter caps, a warm rule), written and unwritten by a mask
export function sourceLabel(ctx, t, str, t0, t1, o = {}) {
  const x = o.x ?? 110, y = o.y ?? 850, u = Math.min(sm(lin(t0, t0 + .5, t)), 1 - sm(lin(t1, t1 + .4, t))); if (u <= 0) return;
  ctx.save(); ctx.font = '600 17px "Inter"'; const w = ctx.measureText(str).width + str.length * 4 + 12; ctx.restore();
  reveal(ctx, x - 4, y - 26, w, 44, u, (g) => {
    text(g, str, x, y, { size: 17, weight: 600, color: rgba(o.col || F6.cream, .9), spacing: 4 });
    g.strokeStyle = rgba(o.rule || F6.amber, .55); g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + 14); g.lineTo(x + w - 12, y + 14); g.stroke();
  });
}

// ================================================================ world B: the night nursery (world 1920×1080, the floor line at y 850)
export const NB = { floorY: 850, lamp: [232, 598], cribA: [560, 850], cribB: [880, 850], rack: [1790, 850], adult: [1430, 850], kid: [1590, 850], page: { x: 1150, y: 965, w: 250, h: 170, rot: -.08 } };
export function nurseryWall(ctx) {
  const L = layer('c06-nursery', 3000, 1600, (g, c) => {
    g.translate(500, 300);   // world (-500, -300) … (2500, 1300)
    const fy = NB.floorY;
    // the wall: warm plaster, darker toward the ceiling and the corners; a dado rail; a faint stencil of stars (a nursery wall)
    const wg = g.createLinearGradient(0, -300, 0, fy); wg.addColorStop(0, '#1b1512'); wg.addColorStop(.5, '#2e2520'); wg.addColorStop(1, '#3a2e27'); g.fillStyle = wg; g.fillRect(-500, -300, 3000, fy + 300);
    const r = prng(61); g.fillStyle = 'rgba(240,215,170,.07)';
    for (let i = 0; i < 90; i++) { const x = -500 + r() * 3000, y = -300 + r() * (fy - 200), s = 3 + r() * 4; g.beginPath(); for (let k = 0; k < 10; k++) { const an = k / 10 * TAU - TAU / 4, rr = k % 2 ? s * .42 : s; g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } g.closePath(); g.fill(); }
    g.fillStyle = '#241c18'; g.fillRect(-500, fy - 230, 3000, 9); g.fillStyle = 'rgba(255,230,190,.08)'; g.fillRect(-500, fy - 232, 3000, 2);   // the rail
    g.fillStyle = '#211a16'; g.fillRect(-500, fy - 14, 3000, 14); g.fillStyle = 'rgba(255,230,190,.06)'; g.fillRect(-500, fy - 15, 3000, 1.5);   // the skirting
    // the floor: boards
    const fg = g.createLinearGradient(0, fy, 0, 1300); fg.addColorStop(0, '#2a1f19'); fg.addColorStop(1, '#120d0b'); g.fillStyle = fg; g.fillRect(-500, fy, 3000, 460);
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1.2; for (let y = fy + 26; y < 1300; y += 34 + (y - fy) * .12) { g.beginPath(); g.moveTo(-500, y); g.lineTo(2500, y); g.stroke(); }
    g.strokeStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < 60; i++) { const x = -500 + r() * 3000, y0 = fy + r() * 420; g.beginPath(); g.moveTo(x, y0); g.lineTo(x + (r() - .5) * 30, y0 + 30 + r() * 30); g.stroke(); }
    g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(0, 0, 3000, 1600); fibreFill(g, .08); stipple(c, { k: .22, g: 1, seed: 4, mid: false, boost: 1 });
  });
  ctx.drawImage(L, -500, -300);
}
// the chest of drawers under the lamp
export function dresser(ctx, x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-150, 0, 310, 10);
  const g = ctx.createLinearGradient(-150, 0, 150, 0); g.addColorStop(0, '#5a4433'); g.addColorStop(.5, '#7a5d44'); g.addColorStop(1, '#3e2e22'); ctx.fillStyle = g; ctx.fillRect(-150, -250, 300, 250);
  ctx.fillStyle = '#8a6a4c'; ctx.fillRect(-156, -256, 312, 10);
  for (let i = 0; i < 3; i++) { const dy = -232 + i * 76; ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 1.5; ctx.strokeRect(-134, dy, 268, 62); ctx.fillStyle = '#d9b58a'; ctx.beginPath(); ctx.arc(0, dy + 31, 5, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// the baby: copy of figure.mjs babyBundle with a cry (0..1): the bundle shudders, the mouth opens, the eyes scrunch, the hand lifts
export function baby(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, cry = clamp(o.cry ?? 0), b = Math.sin(t * 1.6 * TAU / 4.2 + 1) * .6, skin = o.skin || '#d9a984', bl = o.blanket || '#efe4cc';
  ctx.save(); ctx.translate(x + cry * 1.6 * Math.sin(t * 29), y + cry * 1.2 * Math.sin(t * 23 + 1)); ctx.rotate((o.ang ?? -.35) + cry * .05 * Math.sin(t * 34)); ctx.scale(s, s);
  const g = ctx.createLinearGradient(-20, -12, 6, 14); g.addColorStop(0, shadeHex(bl, .06)); g.addColorStop(1, shadeHex(bl, -.18));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(26, -10); ctx.bezierCurveTo(14, -15, -18, -15 - b * .3, -27, -4); ctx.bezierCurveTo(-31, 6, -20, 14 + b * .3, -2, 13); ctx.bezierCurveTo(14, 12, 24, 8, 28, 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = shadeHex(bl, -.08); ctx.beginPath(); ctx.ellipse(20, -3, 11.5, 10.5, -.2, 0, TAU); ctx.fill();
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(20.5, -3.2, 8.2, 7.6, -.2, 0, TAU); ctx.fill();
  ctx.strokeStyle = o.hair || '#2a1c18'; ctx.lineWidth = 1.3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(15.5, -9); ctx.quadraticCurveTo(19, -12.5, 22.5, -10.2); ctx.quadraticCurveTo(20.5, -8.4, 19, -9.6); ctx.stroke();
  // the face: closed eyes (two soft arcs), a cheek; crying: the eyes scrunch, the cheek flushes, the mouth opens
  ctx.strokeStyle = rgba(shadeHex(skin, -.4), .8); ctx.lineWidth = .7;
  for (const ex of [17.2, 23.4]) { ctx.beginPath(); ctx.moveTo(ex - 1.6, -4.6); ctx.quadraticCurveTo(ex, -3.6 - cry * 1.4, ex + 1.6, -4.6); ctx.stroke(); }
  ctx.fillStyle = rgba('#c8604c', .16 + .3 * cry); ctx.beginPath(); ctx.ellipse(24.5, -1.2, 2.4, 1.6, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(16.3, -1, 2.2, 1.5, 0, 0, TAU); ctx.fill();
  if (cry > .05) { ctx.fillStyle = '#5a1e1a'; ctx.beginPath(); ctx.ellipse(20.6, .6, 1.3 + 1.1 * cry, .5 + 1.6 * cry * (.8 + .2 * Math.sin(t * 31)), 0, 0, TAU); ctx.fill(); }
  else { ctx.strokeStyle = rgba(shadeHex(skin, -.4), .7); ctx.beginPath(); ctx.moveTo(19.4, .9); ctx.quadraticCurveTo(20.6, 1.8, 21.8, .9); ctx.stroke(); }
  ctx.fillStyle = shadeHex(skin, .05); ctx.beginPath(); ctx.ellipse(12.5 + cry * 1.5, 1.5 - cry * 3 * Math.abs(Math.sin(t * 9)), 3, 2.6, .3, 0, TAU); ctx.fill();   // the tiny hand
  ctx.strokeStyle = 'rgba(60,40,30,.32)'; ctx.lineWidth = .7; ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-20 + i * 6, -10 + i * .6); ctx.quadraticCurveTo(-14 + i * 6, 0, -18 + i * 5.5, 10); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(8, -12); ctx.quadraticCurveTo(4, 0, 9, 11); ctx.stroke();
  ctx.restore();
}
// a hospital bassinet: the kit's woven basket (figure.mjs babyBed 'basket', copied) on a wheeled stand; x, y = the stand on the floor
export function bassinet(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, wv = o.weave || '#b0814f', dk = shadeHex(wv, -.35), lift = 70;
  ctx.save(); ctx.translate(x, y);
  // the stand: two legs, a cross bar, the wheels
  ctx.fillStyle = 'rgba(4,4,12,.4)'; ctx.beginPath(); ctx.ellipse(0, 2, 60 * s * .75, 7, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#6b6f80'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-34 * s * .75, -lift + 6); ctx.lineTo(-40 * s * .75, -6); ctx.moveTo(34 * s * .75, -lift + 6); ctx.lineTo(40 * s * .75, -6); ctx.moveTo(-36 * s * .75, -lift * .5); ctx.lineTo(36 * s * .75, -lift * .5); ctx.stroke();
  ctx.fillStyle = '#2a2c36'; for (const wx of [-40 * s * .75, 40 * s * .75]) { ctx.beginPath(); ctx.arc(wx, -3, 7, 0, TAU); ctx.fill(); ctx.fillStyle = '#4a4e5e'; ctx.beginPath(); ctx.arc(wx, -3, 2.5, 0, TAU); ctx.fill(); ctx.fillStyle = '#2a2c36'; }
  ctx.translate(0, -lift); ctx.scale(s, s);
  ctx.fillStyle = dk; ctx.beginPath(); ctx.ellipse(0, -22, 40, 9, 0, 0, TAU); ctx.fill();   // the inside, back rim
  ctx.save(); ctx.translate(0, -24); baby(ctx, 0, 0, 1, { ang: 0, t, cry: o.cry, skin: o.skin, blanket: o.blanket, hair: o.hair }); ctx.restore();
  const g = ctx.createLinearGradient(0, -24, 0, 0); g.addColorStop(0, shadeHex(wv, .1)); g.addColorStop(1, shadeHex(wv, -.25)); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-40, -22); ctx.bezierCurveTo(-40, -6, -30, 0, 0, 0); ctx.bezierCurveTo(30, 0, 40, -6, 40, -22); ctx.bezierCurveTo(30, -15, -30, -15, -40, -22); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#3a2414', .38); ctx.lineWidth = .8; for (let i = -44; i <= 44; i += 4) { ctx.beginPath(); ctx.moveTo(i, -24); ctx.quadraticCurveTo(i * .92, -10, i * .8, 2); ctx.stroke(); }
  for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.ellipse(0, -22 + j * 5.5, 40 - j * 2.5, 7.5 - j * .5, 0, .1, Math.PI - .1); ctx.stroke(); } ctx.restore();
  ctx.strokeStyle = rgba('#ffd9a0', .55); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, -22, 40, 8.5, 0, .05, Math.PI - .05); ctx.stroke();
  ctx.restore();
}
// the wooden clothes horse with two small garments pegged to the top bar; x = centre, y = the floor
export function rack(ctx, x, y, o = {}) {
  const t = o.t ?? 0, hgt = 240, wd = '#8a6a48', sway = Math.sin(t * .7) * 1.2;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(4,4,12,.35)'; ctx.beginPath(); ctx.ellipse(0, 2, 150, 8, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = shadeHex(wd, -.25); ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 118, -4); ctx.lineTo(sx * 46, -hgt); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sx * 100, -4); ctx.lineTo(sx * 38, -hgt + 8); ctx.stroke(); }
  ctx.strokeStyle = wd; ctx.lineWidth = 5;
  for (const [yy, hw] of [[-hgt + 2, 150], [-hgt * .62, 128], [-hgt * .3, 112]]) { ctx.beginPath(); ctx.moveTo(-hw, yy); ctx.lineTo(hw, yy); ctx.stroke(); }
  // the garments on the top bar: a small sleep suit and a bib, hanging, swaying a little; two pegs hold each
  const top = -hgt + 2;
  ctx.save(); ctx.translate(-92 + sway, top); ctx.rotate(sway * .01);
  ctx.fillStyle = '#9fb8c9'; ctx.beginPath(); ctx.moveTo(-30, 4); ctx.lineTo(30, 4); ctx.lineTo(36, 60); ctx.lineTo(16, 64); ctx.lineTo(8, 112); ctx.lineTo(-8, 112); ctx.lineTo(-16, 64); ctx.lineTo(-36, 60); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.fillRect(-2, 40, 4, 70); ctx.restore();
  ctx.save(); ctx.translate(58 - sway * .6, top); ctx.rotate(-sway * .012);
  ctx.fillStyle = '#e8c8a0'; ctx.beginPath(); ctx.moveTo(-26, 4); ctx.lineTo(26, 4); ctx.quadraticCurveTo(30, 44, 0, 54); ctx.quadraticCurveTo(-30, 44, -26, 4); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(120,80,50,.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 18, 9, 0, TAU); ctx.stroke(); ctx.restore();
  for (const px of [-116, -68, 36, 80]) peg(ctx, x - x + px, top - 2, .9, Math.PI);
  ctx.restore();
}
// a wooden clothes peg: two prongs, the spring. x, y = the spring; ang = the direction the prongs point (0 = right)
export function peg(ctx, x, y, s, ang = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(4,4,12,.25)'; ctx.fillRect(-8, -2, 34, 12);
  const g = ctx.createLinearGradient(0, -8, 0, 8); g.addColorStop(0, '#e6c79a'); g.addColorStop(1, '#a8804f');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-10, -7.5, 36, 6, 2); ctx.fill(); ctx.beginPath(); ctx.roundRect(-10, 1.5, 36, 6, 2); ctx.fill();
  ctx.fillStyle = '#6e5235'; ctx.fillRect(-10, -7.5, 8, 15);
  ctx.strokeStyle = '#8c929e'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, 4.2, .6, TAU - .6); ctx.stroke();
  ctx.restore();
}
// the study page on the floor: a cream sheet whose surface IS the paper plate (drawn in screen space, clipped to the sheet) under a floor shade
// that lifts as the camera pushes into it; a scribbled heading and two lines in its upper part (unreadable: the study, not its words).
//   page(ctx, t, { x, y, w, h, rot, plate(ctx, t), shade 0..1, toScreen(px, py) → [X, Y] })
export function page(ctx, t, o) {
  const { x, y, w, h, rot } = o;
  const edge = rough([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], 1.2, 9, { step: 12 });
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.save(); ctx.translate(5, 7); ctx.fillStyle = 'rgba(0,0,0,.45)'; poly(ctx, edge); ctx.fill(); ctx.restore();
  poly(ctx, edge); ctx.save(); ctx.clip();
  // the plate in screen space
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); o.plate(ctx, t); ctx.restore();
  ctx.fillStyle = `rgba(28,18,10,${.5 * o.shade})`; ctx.fillRect(-w, -h, 2 * w, 2 * h);
  const ink = rgba('#2a2420', .75 * (.55 + .45 * (1 - o.shade)));
  scribble(ctx, -w / 2 + 22, -h / 2 + 17, w * .5, 7, { seed: 21, ink, lw: 1.5 });
  scribble(ctx, -w / 2 + 22, -h / 2 + 29, w * .78, 4.5, { seed: 22, ink, lw: 1 });
  scribble(ctx, -w / 2 + 22, -h / 2 + 38, w * .66, 4.5, { seed: 23, ink, lw: 1 });
  ctx.restore();
  ctx.strokeStyle = 'rgba(90,70,50,.35)'; ctx.lineWidth = 1.2; poly(ctx, edge); ctx.stroke();
  ctx.restore();
}
export const pageBounds = (o) => { const { x, y, w, h, rot } = o, c = Math.cos(rot), s = Math.sin(rot); return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([px, py]) => [x + px * c - py * s, y + px * s + py * c]); };
// dust motes in the lamp light (the nearest plane)
export function motes(ctx, t, cx, cy, seed = 5, n = 28, R = 520, A = 1) {
  if (A <= 0) return;
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const a0 = r() * TAU, rr = (r() * .9 + .1) * R, sp = .4 + r() * .8, ph = r() * TAU; const x = cx + Math.cos(a0) * rr + drift(t * sp, 24, ph), y = cy + Math.sin(a0) * rr * .7 + drift(t * sp * .7, 18, ph + 2), k = .35 + .65 * (.5 + .5 * Math.sin(t * sp * 1.3 + ph)); ctx.fillStyle = rgba('#ffe2b8', .22 * k * A); ctx.beginPath(); ctx.arc(x, y, 1.4 + .8 * k, 0, TAU); ctx.fill(); }
  ctx.restore();
}
