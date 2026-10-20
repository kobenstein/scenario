// v4 "Lichtlinie zeichnet" in the one shared space: a single point of light is the protagonist and draws each next object into the
// same space; the camera follows it with a soft lag. Nothing cuts, fades or wipes: everything the light has drawn stays.
//   0.3      the first buzz gives birth to the light at the phone
//   0.3–1.0  it rises from your hand into the sky
//   1.0–2.6  it circles above the city and the rosette is drawn behind it, line by line
//   2.6–3.3  it flies up to the corner of an empty patch of sky; the camera cranes after it
//   3.3–4.4  it cuts the certificate's outline; the engraving follows, the paper materialises behind the cut lines
//   4.4–5.3  it crosses the sheet over the foil title to the seal and pulls the rosette in after it (the rosette becomes the seal)
//   5.3–6.6  it circles the seal
//   6.6–9.4  it leaves the seal and lays the thread along Alaska's coast; the camera pans with it and settles on both
import { W, H, rgba, clamp, lin, mix, eio, sm, prng } from '../05-share/engine.mjs';
import { rosette, ring } from '../05-share/lib/certificate.mjs';
import { drawWorld, applyCam, toScreen, ROOF, ROS, PHONE, tipBloom } from './worlds.mjs';
import { kf, aim, qio, nearFade } from './motion.mjs';
import { Z, SC, SEAL, SEAL_R, certP, AKC, akTip, drawSky } from './space.mjs';

const TAU = Math.PI * 2;
const U = (t) => { const x = clamp((t - 6.6) / 2.8); return x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };
const bez = (p0, p1, p2, q) => [mix(mix(p0[0], p1[0], q), mix(p1[0], p2[0], q), q), mix(mix(p0[1], p1[1], q), mix(p1[1], p2[1], q), q)];
// ---------- the light's path in the sky plane (before 1.0 it rises from the phone on the main plane) ----------
const RR = ROS.R;                                                     // radius the light circles at (the rosette's outer ring)
const drawU = (t) => eio(lin(1.0, 2.6, t));                           // rosette draw-on, synced with the light's angle
const rosRot = (t) => t * .02;
const ringPt = (t) => { const a = rosRot(t) + drawU(t) * TAU - Math.PI / 2; return [ROS.x + Math.cos(a) * RR, ROS.y + Math.sin(a) * RR]; };
const CW = 1500, CH = 980, BI = 45;
const perim = (q) => { const a = CW - 2 * BI, b = CH - 2 * BI, per = 2 * (a + b); let d = q * per, p;
  if (d < a) p = [-CW / 2 + BI + d, -CH / 2 + BI]; else if ((d -= a) < b) p = [CW / 2 - BI, -CH / 2 + BI + d]; else if ((d -= b) < a) p = [CW / 2 - BI - d, CH / 2 - BI]; else { d -= a; p = [-CW / 2 + BI, CH / 2 - BI - d]; }
  return certP(p[0], p[1]); };
const sealPt = (a) => [SEAL[0] + Math.cos(a) * SEAL_R * 1.02, SEAL[1] + Math.sin(a) * SEAL_R * 1.02];
const A_SEAL0 = Math.PI * .75;
function skyPoint(t) {
  if (t < 2.6) return ringPt(Math.max(t, 1.0));
  if (t < 3.3) return bez(ringPt(2.6), [ROS.x - 80, ROS.y - RR - 260], perim(0), qio(lin(2.6, 3.3, t)));
  if (t < 4.4) return perim(eio(lin(3.3, 4.4, t)));
  if (t < 5.3) return bez(perim(0), certP(40, 260), sealPt(A_SEAL0), qio(lin(4.4, 5.3, t)));
  if (t < 6.6) return sealPt(A_SEAL0 + eio(lin(5.3, 6.6, t)) * TAU * 1.12);
  return akTip(U(t), t);
}
// screen position of the light for a camera (rises from the phone to the sky plane until 1.0)
function lightScreen(cam, t) {
  const s = toScreen(cam, ...skyPoint(t), Z);
  if (t >= 1.0) return s;
  const p = toScreen(cam, PHONE.x, PHONE.y, 1), q = eio(lin(.3, 1.0, t));
  return [mix(p[0], s[0], q) + Math.sin(q * Math.PI) * -60, mix(p[1], s[1], q)];
}
// ---------- camera: follows the light with a soft lag (average of where it was in the last .7 s) ----------
function baseCam(t) {
  const dz = kf(t, [[0, 0], [2.4, .25], [4.2, 1.15], [8.6, 1.25], [10, 1.05]]);
  const zoom = kf(t, [[0, 1], [2.4, 1.02], [4.2, 1.9], [6.6, 1.9], [8.8, 1.55], [10, 1.5]]);
  return { dz, zoom, y: kf(t, [[0, 0], [4.2, -50], [10, -30]]), r: kf(t, [[0, 0], [3.3, .015], [5.5, -.01], [9, .006], [10, 0]]) };
}
function camAt(t) {
  const c = baseCam(t); let x = 0, y = 0; const n = 12;
  for (let i = 0; i < n; i++) { const s = Math.max(1.0, t - .7 * i / n), p = skyPoint(s); x += p[0]; y += p[1]; }
  x /= n; y /= n;
  // frame the whole object around the light: blend the light with the object it is drawing
  const obj = t < 3.0 ? [ROS.x, ROS.y - 80] : t < 6.6 ? [SC.x, SC.y] : [mix(SC.x, AKC[0], .6), mix(SC.y, AKC[1], .55)];
  const k = t < 3.0 ? .25 : t < 6.6 ? .35 : .55, fx = mix(x, obj[0], 1 - k), fy = mix(y, obj[1], 1 - k);
  return aim(c, fx, fy, Z, W / 2, H / 2 - 20, eio(lin(.6, 3.2, t)) * .95);
}
function light(ctx, x, y, t, a = 1, s = 1) {
  if (a <= .01) return; const B = tipBloom(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(B, x - B.width / 2 * s, y - B.height / 2 * s, B.width * s, B.height * s);
  const r = prng(9); for (let i = 0; i < 40; i++) { const ang = r() * TAU, life = (t * (.7 + r() * .8) + r()) % 1, d = 5 + life * (30 + r() * 60), px = x + Math.cos(ang) * d, py = y + Math.sin(ang) * d - life * 14; ctx.fillStyle = `rgba(255,${200 + r() * 40 | 0},150,${.8 * (1 - life) * (.3 + .7 * r())})`; const z = 1 + r() * 1.3; ctx.fillRect(px, py, z, z); }
  ctx.restore();
}
function hotTrail(ctx, cam, t) {
  if (t < .32 || t > 6.6) return; const pts = []; for (let k = 12; k >= 0; k--) { const s = t - k * .025; if (s < .3) continue; pts.push(lightScreen(cam, s)); }
  if (pts.length < 2) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 1; i < pts.length; i++) { const q = i / (pts.length - 1); ctx.strokeStyle = rgba('#ffcf96', .5 * q); ctx.lineWidth = 1 + 4 * q; ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
  ctx.restore();
}
export function frame(ctx, t) {
  const cam = camAt(t), du = drawU(t);
  const pull = eio(lin(4.2, 5.4, t));                                    // the rosette follows the light into the seal
  // ---------- the city (the rosette is drawn by the light, so the world's own rosette is replaced) ----------
  drawWorld(ctx, ROOF, t, cam, { skip: ['rosette'], p: { rise: .15 + .85 * du }, alpha: (L) => (L.screen ? 1 : nearFade(cam, L.z)) });
  // ---------- the rosette, drawn on behind the light ----------
  if (du > 0) {
    ctx.save(); applyCam(ctx, cam, Z);
    const k = mix(1, SEAL_R * 1.25 / ROS.R, pull), x = mix(ROS.x, SEAL[0], pull), y = mix(ROS.y, SEAL[1], pull), fade = (1 - .92 * pull) * (1 - .45 * sm(lin(3.0, 3.7, t)));
    ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-ROS.x, -ROS.y);
    ctx.globalCompositeOperation = 'lighter';
    const B = (r, a) => { const g = ctx.createRadialGradient(ROS.x, ROS.y, 0, ROS.x, ROS.y, r); g.addColorStop(0, `rgba(255,214,160,${a})`); g.addColorStop(.3, `rgba(255,180,110,${a * .35})`); g.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = g; ctx.fillRect(ROS.x - r, ROS.y - r, 2 * r, 2 * r); };
    B(520, .45 * du * fade);
    const rot = rosRot(t);
    rosette(ctx, ROS.x, ROS.y, { R: 300, A: 30, B: 14, n: 48, m: 13, lines: 60, col: '#fff1d6', w: .55, a: .09 * fade, rot, u: du, cache: true });
    rosette(ctx, ROS.x, ROS.y, { R: 196, A: 26, B: 10, n: 30, m: 11, lines: 48, col: '#ffc887', w: .5, a: .11 * fade, rot, u: clamp(du * 1.1), cache: true });
    rosette(ctx, ROS.x, ROS.y, { R: 92, A: 16, B: 7, n: 16, m: 7, lines: 36, col: '#ffe0b0', w: .5, a: .14 * fade, rot, u: clamp(du * 1.25), cache: true });
    ring(ctx, ROS.x, ROS.y, RR, RR, { lines: 9, band: 20, wave: 26, col: '#fff1d6', glow: '#ffb35c', glowA: .08, a: .5 * sm(clamp(du * 1.4 - .3)) * fade, lw: .6, ph: t * .3 });
    ctx.restore();
  }
  // ---------- the sky plane: certificate cut by the light, then the coast laid by it ----------
  const burin = clamp((t - 3.3) / 2.0), paper = sm(lin(4.5, 5.6, t));
  drawSky(ctx, t, cam, { burin, paper, u: U(t), showCoast: t > 6.5, ghostA: sm(lin(6.5, 7.0, t)), glow: burin });
  // ---------- the light ----------
  hotTrail(ctx, cam, t);
  const [lx, ly] = lightScreen(cam, t);
  if (t < 6.6) light(ctx, lx, ly, t, sm(lin(.28, .42, t)), t < 1 ? .7 : 1);
}
export const print = () => ({ riso: .35 });
