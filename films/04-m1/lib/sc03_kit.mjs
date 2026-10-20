// C3 helpers (shots 1.02–2.08): the burin (hand + graver + chip + foil dust), engraved deeds, the public-fund box, the bill,
// legal file stacks, a mini share certificate and cached plates. Owner C3. Pure draw functions, cached static parts.
//   burin(ctx, x, y, ang, s, t, o)   x,y = the cutting point (tip) on screen; ang = direction the shaft points (hand → tip);
//                                    s = scale (1 → wrist to tip ~345 px); o: { lift 0..1 (tip off the plate), cut 0..1 (cutting: chip + dust),
//                                    sleeve, skin, rim, a, glow 0..1 (tip light on knuckles and fingertips) }
//   fadedHand(ctx, x, y, s, o)       lib/hand.mjs hand whose sleeve folds and dissolves ~250 px behind the wrist (scratch layer + destination-out)
//   deed(ctx, kind, x, y, s, rot, o)  'house' | 'book' | 'share' engraved documents lying on the plate (cached), o: { shadow, a, lift }
//   fundBox(ctx, x, y, s, t, o)      the public fund (an engraved strongbox, open, label PUBLIC FUND); o: { fill 0..1 (stack inside), glow }
//   miniCert(ctx, x, y, s, rot, o)   a small share certificate (cached), o: { a, col (accent of the rosette), ghost }
//   billSheet(ctx, x, y, s, rot, t, o) the bill (own typography, § A BILL), o: { turn 0..1 (top page turns), hi 0..1 (paragraph lit) }
//   fileStack(ctx, x, y, s, h, t, o) a stack of legal files growing to h folders
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas, lin, eout, sm, text, hatch } from '../engine.mjs';
import { hand } from './hand.mjs';
import { rosette, gBorder, microtext, intaglio, guilloche } from './certificate.mjs';
import { fibreFill } from './print.mjs';
import { stipple, roughPath, vnoise } from './art.mjs';

const TAU = Math.PI * 2;
const CACHE = new Map(); export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
export const INK = '#1f2a3a', CREAM = '#f3efe2', PAPER = '#efe6cf', AMBER = '#ffb35c', CORE = '#fff1d6', RUST = '#c4512e';

// ---------- the burin: an engraver's right hand seen from above (index finger along the shaft, thumb at its side,
// the other fingers curled), a short tool close to the plate, a short sleeve that dissolves into the dark ----------
// local units: the tool's tip at (0,0), +u toward the tip, the hand behind (−u), the thumb on −v. cap() is copied from lib/hand.mjs.
function burinTool() {
  return once('burintool2', () => {
    // tip at (250, 50) of a 262×100 canvas, shaft toward −x, the mushroom handle at the left (it sits in the palm)
    const [c, g] = canvas(262, 100), ty = 50;
    const hg = g.createLinearGradient(0, ty - 26, 0, ty + 26); hg.addColorStop(0, '#c08a55'); hg.addColorStop(.45, '#8a5530'); hg.addColorStop(1, '#3a2014');
    g.fillStyle = hg; g.beginPath(); g.ellipse(30, ty, 28, 25, 0, Math.PI * .5, Math.PI * 1.5); g.lineTo(60, ty - 13); g.quadraticCurveTo(72, ty - 11, 80, ty - 8); g.lineTo(80, ty + 8); g.quadraticCurveTo(72, ty + 11, 60, ty + 13); g.closePath(); g.fill();
    const fg = g.createLinearGradient(0, ty - 8, 0, ty + 8); fg.addColorStop(0, '#e8d3a0'); fg.addColorStop(.5, '#9a7a40'); fg.addColorStop(1, '#4a3418');
    g.fillStyle = fg; g.fillRect(78, ty - 8, 12, 16);
    const sg = g.createLinearGradient(0, ty - 5.5, 0, ty + 5.5); sg.addColorStop(0, '#eef2f8'); sg.addColorStop(.42, '#98a2b3'); sg.addColorStop(.55, '#59616f'); sg.addColorStop(1, '#232833');
    g.fillStyle = sg; g.beginPath(); g.moveTo(90, ty - 5.5); g.lineTo(224, ty - 3.8); g.lineTo(250, ty); g.lineTo(224, ty + 3.8); g.lineTo(90, ty + 5.5); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = .8; g.beginPath(); g.moveTo(92, ty - 4.2); g.lineTo(222, ty - 2.8); g.stroke();
    g.fillStyle = '#f6f8fc'; g.beginPath(); g.moveTo(226, ty - 3.3); g.lineTo(250, ty); g.lineTo(229, ty + 1); g.closePath(); g.fill();
    return c;
  });
}
function cap(p, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1))));
  p.moveTo(x1 + Math.cos(a + Math.PI / 2 + k) * r1, y1 + Math.sin(a + Math.PI / 2 + k) * r1);
  p.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k);
  p.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k);
  p.closePath();
}
function smoothClosed(p, P) {
  const n = P.length; p.moveTo(P[0][0], P[0][1]);
  for (let i = 0; i < n; i++) { const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]); }
  p.closePath();
}
function handGeo(t) {
  const pr = Math.sin(t * 2.1) * .5 + .5, br = Math.sin(t * 1.3 + .7);   // pressure pulse on the shaft, breathing of the curled fingers
  return {
    IDX: [[-200, 5, 13.5], [-141, 2, 11.8], [-104 + pr * 1.5, .5, 10.6], [-75 + pr * 2, 0, 9.4]],
    CURL: [[[-208, 28, 13.2], [-163, 35 + br * .6, 12.2], [-176, 45, 10.4]], [[-215, 50, 12.2], [-176, 59 + br * .6, 11.2], [-189, 67, 9.4]], [[-224, 69, 10.8], [-194, 79 + br * .5, 9.6], [-203, 86, 8.4]]],
    TH: [[-292, -14, 17], [-212, -32, 13.6], [-156, -27, 11.6], [-116 + pr * 1.2, -16, 10]],
    BACK: [[-196, -7], [-206, 30], [-214, 82], [-262, 90], [-318, 80], [-352, 70], [-358, 28], [-350, -10], [-306, -30], [-246, -22]],
  };
}
function engraverHand(g, t, o) {
  const G = handGeo(t), skin = o.skin || '#a8734f', rim = o.rim || '#ffd59a', gl = clamp(o.glow ?? 1);
  const S = new Path2D(); smoothClosed(S, G.BACK);
  const chain = (P) => { for (let i = 0; i < P.length - 1; i++) cap(S, P[i][0], P[i][1], P[i][2], P[i + 1][0], P[i + 1][1], P[i + 1][2]); };
  chain(G.TH); for (const f of G.CURL) chain(f); chain(G.IDX);
  // rim: the silhouette shifted toward the tip light; strongest on the fingertips and knuckles that face the tip
  const rg = g.createRadialGradient(0, 0, 50, 0, 0, 400); rg.addColorStop(0, rgba(rim, gl)); rg.addColorStop(.4, rgba(rim, .55 * gl)); rg.addColorStop(1, rgba(rim, .06));
  g.save(); g.translate(3, -.4); g.fillStyle = rg; g.fill(S); g.restore();
  g.save(); g.translate(-1.6, 1.8); g.fillStyle = 'rgba(8,5,14,.55)'; g.fill(S); g.restore();   // dark edge on the far side
  g.fillStyle = skin; g.fill(S);
  g.save(); g.clip(S);
  // warm light from the tip, the wrist half falls into the dark
  const wl = g.createRadialGradient(0, 0, 40, 0, 0, 330); wl.addColorStop(0, `rgba(255,196,130,${.5 * gl})`); wl.addColorStop(.5, `rgba(255,168,96,${.14 * gl})`); wl.addColorStop(1, 'rgba(255,168,96,0)'); g.fillStyle = wl; g.fillRect(-420, -130, 440, 260);
  const dk = g.createLinearGradient(-175, 0, -365, 0); dk.addColorStop(0, 'rgba(10,6,18,0)'); dk.addColorStop(1, 'rgba(10,6,18,.66)'); g.fillStyle = dk; g.fillRect(-420, -130, 440, 260);
  const sv = g.createLinearGradient(0, -40, 0, 95); sv.addColorStop(0, 'rgba(10,6,18,.28)'); sv.addColorStop(.3, 'rgba(10,6,18,0)'); sv.addColorStop(.75, 'rgba(10,6,18,0)'); sv.addColorStop(1, 'rgba(10,6,18,.3)'); g.fillStyle = sv; g.fillRect(-420, -130, 440, 260);
  g.lineCap = 'round';
  // round volume: a soft ridge light along each finger, separations between the curled fingers
  const ridge = (P, a0) => { g.strokeStyle = `rgba(255,226,190,${a0})`; g.lineWidth = 5; g.beginPath(); g.moveTo(P[0][0], P[0][1] - P[0][2] * .3); for (let i = 1; i < P.length; i++) g.lineTo(P[i][0], P[i][1] - P[i][2] * .3); g.stroke(); };
  ridge(G.IDX, .16 + .1 * gl); ridge(G.TH.slice(1), .1 + .08 * gl); for (const f of G.CURL) ridge(f.slice(0, 2), .1 + .06 * gl);
  g.strokeStyle = 'rgba(46,18,16,.5)'; g.lineWidth = 1.6;
  for (let i = 0; i < 2; i++) { const a = G.CURL[i], b = G.CURL[i + 1]; g.beginPath(); g.moveTo((a[0][0] + b[0][0]) / 2 - 4, (a[0][1] + b[0][1]) / 2); g.quadraticCurveTo((a[1][0] + b[1][0]) / 2 - 10, (a[1][1] + b[1][1]) / 2 - 2, (a[1][0] + b[1][0]) / 2 + 2, (a[1][1] + b[1][1]) / 2 + 1); g.stroke(); }
  // knuckle creases (index PIP and DIP across the finger, small folds on the curled PIPs)
  g.strokeStyle = 'rgba(70,30,24,.38)'; g.lineWidth = 1.1;
  for (const [u, v, h] of [[G.IDX[1][0], G.IDX[1][1], 8], [G.IDX[1][0] - 5, G.IDX[1][1], 6.5], [G.IDX[2][0], G.IDX[2][1], 6.5]]) { g.beginPath(); g.moveTo(u + 1, v - h); g.quadraticCurveTo(u - 3, v, u + 1, v + h); g.stroke(); }
  for (const f of G.CURL) { const [u, v, r] = f[1]; g.beginPath(); g.arc(u + 2, v, r * .55, -1.1, 1.1); g.stroke(); }
  // tendons on the back of the hand (faint light ridges toward the wrist)
  g.strokeStyle = 'rgba(255,224,190,.045)'; g.lineWidth = 5;
  for (const [u, v] of [[-214, 6], [-222, 28], [-228, 49], [-235, 67]]) { g.beginPath(); g.moveTo(u, v); g.quadraticCurveTo(u - 40, v * .85 + 5, -300, 22 + v * .55); g.stroke(); }
  // engraved hatching on the shadow half (the film's print language)
  hatch(g, null, -.9, 3.6, .3, { box: [-380, -60, 240, 170], fade: [-365, 0, -215, 0], col: '#140a14', w: .8, wobble: .4 });
  g.restore();
  // nails: index (seen from above) and the thumb's edge
  g.save(); g.translate(G.IDX[3][0] - 8, G.IDX[3][1]); g.fillStyle = 'rgba(255,214,192,.42)'; g.beginPath(); g.ellipse(0, 0, 9.5, 6.2, 0, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(90,40,30,.4)'; g.lineWidth = 1; g.beginPath(); g.ellipse(0, 0, 9.5, 6.2, 0, Math.PI * .6, Math.PI * 1.4); g.stroke(); g.restore();
  g.save(); g.translate(G.TH[3][0] - 7, G.TH[3][1] - 5); g.rotate(.27); g.fillStyle = 'rgba(255,214,192,.36)'; g.beginPath(); g.ellipse(0, 0, 8, 3.6, 0, 0, TAU); g.fill(); g.restore();
  // the tip's glow on what faces it: fingertips, thumb tip, the curled knuckles, the knuckle row
  g.save(); g.globalCompositeOperation = 'lighter';
  const spot = (u, v, r, a0) => { if (a0 <= .005) return; const q = g.createRadialGradient(u, v, 0, u, v, r); q.addColorStop(0, `rgba(255,190,118,${a0})`); q.addColorStop(1, 'rgba(255,190,118,0)'); g.fillStyle = q; g.fillRect(u - r, v - r, r * 2, r * 2); };
  spot(G.IDX[3][0] + 2, G.IDX[3][1], 26, .5 * gl); spot(G.TH[3][0] + 3, G.TH[3][1], 22, .36 * gl);
  G.CURL.forEach((f, i) => spot(f[1][0] + f[1][2] * .6, f[1][1], 17, (.28 - i * .07) * gl));
  [G.IDX[0], ...G.CURL.map((f) => f[0])].forEach((p, i) => spot(p[0] + p[2] * .5, p[1], 15, (.16 - i * .03) * gl));
  g.restore();
}
function sleeveShort(g, t, o) {
  const col = o.sleeve || '#3a2a3a', rim = o.rim || '#ffd59a', gl = clamp(o.glow ?? 1), top = (u) => -18 + (u + 342) * .07, bot = (u) => 82 - (u + 342) * .07;
  const P = new Path2D(); P.moveTo(-344, -18); P.quadraticCurveTo(-326, 32, -342, 82); P.lineTo(-700, bot(-700)); P.lineTo(-700, top(-700)); P.closePath();
  g.save(); g.fillStyle = col; g.fill(P); g.clip(P);
  const sv = g.createLinearGradient(0, -40, 0, 110); sv.addColorStop(0, 'rgba(255,232,205,.12)'); sv.addColorStop(.32, 'rgba(255,232,205,0)'); sv.addColorStop(1, 'rgba(4,3,10,.5)'); g.fillStyle = sv; g.fillRect(-720, -60, 400, 190);
  const su = g.createLinearGradient(-345, 0, -560, 0); su.addColorStop(0, 'rgba(4,3,10,0)'); su.addColorStop(1, 'rgba(4,3,10,.8)'); g.fillStyle = su; g.fillRect(-720, -60, 400, 190);
  // soft folds across the sleeve (they breathe a little)
  g.lineCap = 'round';
  [[-372, 1], [-402, .8], [-440, .6], [-488, .4], [-540, .25]].forEach(([u0, w0], i) => { const b = 10 + 4 * Math.sin(t * .9 + i * 1.7), y0 = top(u0) + 6, y1 = bot(u0) - 6;
    g.strokeStyle = `rgba(0,0,0,${.4 * w0})`; g.lineWidth = 5; g.beginPath(); g.moveTo(u0, y0); g.quadraticCurveTo(u0 + b, (y0 + y1) / 2, u0 + 3, y1); g.stroke();
    g.strokeStyle = `rgba(255,232,205,${.12 * w0})`; g.lineWidth = 1.6; g.beginPath(); g.moveTo(u0 + 5, y0 + 2); g.quadraticCurveTo(u0 + b + 5, (y0 + y1) / 2, u0 + 8, y1 - 2); g.stroke(); });
  g.restore();
  // the cuff edge catches the tip light
  g.save(); g.strokeStyle = rgba(rim, .42 * gl); g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(-343, -16); g.quadraticCurveTo(-325, 32, -341, 80); g.stroke(); g.restore();
}
// erase everything left of x1 in a scratch layer, softly from x1 to x0 (identity transform: a gradient's pad region under a
// transform is not painted with destination-out in @napi-rs/canvas, so the solid part is a separate rect)
function eraseLeft(g, x0, x1, w, h) {
  g.save(); g.globalCompositeOperation = 'destination-out'; const fo = g.createLinearGradient(x0, 0, x1, 0); fo.addColorStop(0, 'rgba(0,0,0,1)'); fo.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = fo; g.fillRect(x0, 0, x1 - x0, h); if (x0 > 0) { g.fillStyle = '#000'; g.fillRect(0, 0, x0, h); } g.restore();
}
const OW = 1100, OH = 420, OX = 1060, OY = 150; let OFF = null;
export function burin(ctx, x, y, ang, s, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const lift = clamp(o.lift ?? 0), cut = clamp(o.cut ?? 0), r = prng(31);
  const dx = Math.cos(ang), dy = Math.sin(ang);
  // the tool lifts toward the viewer: tip moves back along the shaft and up a little
  const tx = x - dx * lift * 26 * s, ty = y - dy * lift * 26 * s - lift * 34 * s;
  // soft shadow of hand and tool on the plate, cast away from the tip light (no live blur: gradients)
  ctx.save(); ctx.globalAlpha = a; ctx.translate(tx, ty); ctx.rotate(ang); ctx.scale(s, s); const sa = .5 * (1 - lift * .5);
  ctx.save(); ctx.translate(-270 - lift * 24, 40 + lift * 34); ctx.scale(1, .34); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 250); sg.addColorStop(0, `rgba(0,0,0,${sa})`); sg.addColorStop(.6, `rgba(0,0,0,${sa * .4})`); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.fillRect(-250, -250, 500, 500); ctx.restore();
  for (const [hw, al] of [[6, .22], [3.4, .38]]) { ctx.fillStyle = `rgba(0,0,0,${sa * al})`; ctx.beginPath(); ctx.roundRect(-92, 6 + lift * 24 - hw, 88, hw * 2, hw); ctx.fill(); }
  ctx.restore();
  // hand, tool and sleeve in a scratch layer, so the sleeve can dissolve (destination-out) instead of running off as a tube
  if (!OFF) OFF = canvas(OW, OH); const [oc, g] = OFF;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, OW, OH);
  g.translate(OX, OY); g.scale(s, s);
  g.drawImage(burinTool(), -250, -50);
  engraverHand(g, t, o);
  sleeveShort(g, t, o);
  g.setTransform(1, 0, 0, 1, 0, 0); eraseLeft(g, OX - 560 * s, OX - 420 * s, OW, OH);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(tx, ty); ctx.rotate(ang); ctx.drawImage(oc, -OX, -OY); ctx.restore();
  // cutting: the curl of metal chip rising behind the tip + foil dust + a hot contact glint
  if (cut > 0 && lift < .5) {
    const k = cut * (1 - lift * 2) * a, S = 13 * s;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gl = ctx.createRadialGradient(x, y, 0, x, y, S * 3.2); gl.addColorStop(0, rgba(CORE, .95 * k)); gl.addColorStop(.25, rgba(AMBER, .5 * k)); gl.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = gl; ctx.fillRect(x - S * 3.2, y - S * 3.2, S * 6.4, S * 6.4);
    for (let i = 0; i < 34; i++) { const life = (t * (.8 + r() * .9) + r()) % 1, sp = (r() - .5) * 1.9, dist = S * (.4 + life * (1.6 + r() * 2.8));
      const px = x - Math.cos(ang + sp) * dist, py = y - Math.sin(ang + sp) * dist - life * S * 1.1; ctx.fillStyle = rgba(r() < .6 ? AMBER : CORE, (1 - life) * (.35 + .55 * r()) * k); const z = .8 + r() * 1.4; ctx.fillRect(px, py, z, z); }
    ctx.restore();
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang + Math.PI); ctx.strokeStyle = rgba('#ffe2a8', .9 * k); ctx.lineWidth = Math.max(.8, S * .09); ctx.lineCap = 'round';
    const wob = Math.sin(t * 7) * .12; ctx.beginPath(); ctx.moveTo(S * .2, 0); ctx.bezierCurveTo(S * .9, -S * (.1 + wob), S * 1.25, -S * .85, S * .8, -S * 1.1); ctx.bezierCurveTo(S * .38, -S * 1.3, S * .22, -S * .8, S * .58, -S * .66); ctx.stroke(); ctx.restore();
  }
  const wu = -345, wv = 30;
  return { tip: [tx, ty], wrist: [tx + (wu * dx - wv * dy) * s, ty + (wu * dy + wv * dx) * s] };
}

// ---------- a hand from lib/hand.mjs whose sleeve ends in soft folds and dissolves into the dark (~250 px behind the wrist) ----------
//   fadedHand(ctx, x, y, s, o)  same arguments as hand(); o.fade0 / o.fade1 = start / end of the dissolve behind the wrist (hand units),
//   o.res = extra resolution when the caller draws under a zoom (the scratch layer is rendered at s·res and composited at 1/res)
const HW = 760, HH = 440, HX = 390, HY = 220; let HOFF = null;
export function fadedHand(ctx, x, y, s, o = {}) {
  if (!HOFF) HOFF = canvas(HW, HH); const [hc, g] = HOFF, ang = o.ang ?? 0, f = o.flip ? -1 : 1, res = o.res ?? 1, sr = s * res;
  const L = o.light || [.3, -1], c = Math.cos(-ang), sn = Math.sin(-ang), light = [L[0] * c - L[1] * sn, L[0] * sn + L[1] * c];
  const fade0 = o.fade0 ?? 85, fade1 = o.fade1 ?? 150, t = o.t ?? 0;
  // where the sleeve dissolves the table goes dark too (the arm's soft shadow), so nothing shows through it as a ghost
  { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s); ctx.translate(-(fade0 + fade1) / 2 - 10, 4 * f); const ry = 52; ctx.scale(fade1 * .95 / ry, 1);
    const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, ry); sg.addColorStop(0, `rgba(4,4,14,${o.shadow ?? .62})`); sg.addColorStop(.6, `rgba(4,4,14,${(o.shadow ?? .62) * .5})`); sg.addColorStop(1, 'rgba(4,4,14,0)');
    ctx.fillStyle = sg; ctx.fillRect(-ry, -ry, ry * 2, ry * 2); ctx.restore(); }
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, HW, HH);
  hand(g, HX, HY, sr, { ...o, ang: 0, light, sleeveLen: fade1 + 30 });
  // soft folds on the sleeve behind the cuff, sinking into the dark
  g.save(); g.translate(HX, HY); g.scale(sr, sr * f); g.beginPath(); g.rect(-fade1 - 30, -27, fade1 + 16, 54); g.clip();
  g.lineCap = 'round';
  [[-30, 1], [-52, .85], [-80, .65], [-112, .45], [-146, .3]].forEach(([u0, w0], i) => { const b = 7 + 3 * Math.sin(t * .8 + i * 1.9 + (o.seed || 0));
    g.strokeStyle = `rgba(0,0,0,${.34 * w0})`; g.lineWidth = 3.6; g.beginPath(); g.moveTo(u0, -27); g.quadraticCurveTo(u0 + b, 0, u0 + 2, 27); g.stroke();
    g.strokeStyle = `rgba(255,236,210,${.13 * w0})`; g.lineWidth = 1.3; g.beginPath(); g.moveTo(u0 + 4, -25); g.quadraticCurveTo(u0 + b + 4, 0, u0 + 6, 25); g.stroke(); });
  const dk = g.createLinearGradient(-18, 0, -fade1, 0); dk.addColorStop(0, 'rgba(6,5,16,0)'); dk.addColorStop(1, 'rgba(6,5,16,.72)'); g.fillStyle = dk; g.fillRect(-fade1 - 30, -27, fade1 + 16, 54);
  g.restore();
  g.setTransform(1, 0, 0, 1, 0, 0); eraseLeft(g, HX - fade1 * sr, HX - fade0 * sr, HW, HH);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); if (res !== 1) ctx.scale(1 / res, 1 / res); ctx.drawImage(hc, -HX, -HY); ctx.restore();
}

// ---------- engraved deeds (cached) ----------
function sheetBase(g, w, h, seed, tone = PAPER) {
  g.beginPath(); roughPath(g, [[0, 0], [w, 0], [w, h], [0, h]], { amp: 1.2, step: 9, seed });
  const pg = g.createRadialGradient(w * .4, h * .35, 0, w * .5, h * .5, w * .8); pg.addColorStop(0, '#f8f0de'); pg.addColorStop(.7, tone); pg.addColorStop(1, '#cdb894'); g.fillStyle = pg; g.fill();
  g.save(); g.clip(); const r = prng(seed); g.lineCap = 'round'; for (let i = 0; i < w * h / 120; i++) { const px = r() * w, py = r() * h, L = 3 + r() * 14, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(255,252,240,${.2 + r() * .3})` : `rgba(120,95,60,${.08 + r() * .14})`; g.lineWidth = .5; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a0) * L, py + Math.sin(a0) * L); g.stroke(); } g.restore();
}
function deedLayer(kind) {
  return once('deed-' + kind, () => {
    if (kind === 'book') {   // a savings book: dark cloth cover with an engraved panel
      const w = 230, h = 310, [c, g] = canvas(w, h);
      g.fillStyle = '#2f4a52'; g.beginPath(); g.roundRect(0, 0, w, h, 10); g.fill();
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, 16, h); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(16, 0, 2, h);
      gBorder(g, 30, 30, w - 52, h - 60, { band: 12, lines: 4, waves: 70, col: '#e9c98a', w: .6, a: .8, radius: 6 });
      text(g, 'SAVINGS', w / 2 + 6, 120, { size: 20, weight: 600, color: '#e9c98a', align: 'center', spacing: 5 });
      rosette(g, w / 2 + 6, 190, { R: 34, A: 9, B: 4, n: 12, m: 5, lines: 16, col: '#e9c98a', w: .55, a: .9 });
      stipple(c, { k: .2, g: 1, seed: 8, mid: false, boost: 1 }); return c;
    }
    const w = kind === 'house' ? 360 : 330, h = kind === 'house' ? 250 : 230, [c, g] = canvas(w, h);
    sheetBase(g, w, h, kind === 'house' ? 5 : 9);
    gBorder(g, 10, 10, w - 20, h - 20, { band: 14, lines: 5, waves: 90, col: kind === 'house' ? '#3a4a60' : '#5a3a26', w: .55, a: .8, radius: 8 });
    if (kind === 'house') {   // a house vignette in an oval, engraved
      const vx = w / 2, vy = 112; g.save(); g.beginPath(); g.ellipse(vx, vy, 92, 58, 0, 0, TAU); g.clip();
      intaglio(g, vx - 92, vy - 58, 184, 116, { gap: 3.2, angle: 0, col: '#22314a', maxW: 2.4, tone: (x, y) => (y > 86 ? .55 : .18 + y / 300) });
      g.fillStyle = PAPER; g.beginPath(); g.moveTo(vx - 44, vy + 40); g.lineTo(vx - 44, vy - 2); g.lineTo(vx, vy - 34); g.lineTo(vx + 44, vy - 2); g.lineTo(vx + 44, vy + 40); g.closePath(); g.fill();
      g.strokeStyle = '#22314a'; g.lineWidth = 1.4; g.stroke(); g.fillStyle = '#22314a'; g.fillRect(vx - 9, vy + 14, 18, 26); g.fillRect(vx - 32, vy + 4, 14, 12); g.fillRect(vx + 18, vy + 4, 14, 12);
      g.restore(); g.strokeStyle = rgba('#22314a', .8); g.lineWidth = 1; g.beginPath(); g.ellipse(vx, vy, 95, 61, 0, 0, TAU); g.stroke();
      text(g, 'DEED', w / 2, 210, { size: 22, weight: 600, color: '#3a4a60', align: 'center', spacing: 8 });
    } else {                   // a company share: rosette + foil band
      rosette(g, w / 2, 100, { R: 52, A: 12, B: 6, n: 14, m: 5, lines: 22, col: '#7a3b17', w: .55, a: .85 });
      text(g, 'SHARES', w / 2, 192, { size: 20, weight: 600, color: '#5a3a26', align: 'center', spacing: 8 });
      microtext(g, 40, 168, w - 80, 'COMMON STOCK · FULLY PAID', { size: 5, col: '#5a3a26', a: .7 });
    }
    stipple(c, { k: .2, g: 1, seed: 3, mid: false, boost: 1 }); return c;
  });
}
export function deed(ctx, kind, x, y, s, rot, o = {}) {
  const c = deedLayer(kind), a = o.a ?? 1, lift = o.lift ?? 0; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (o.shadow !== false) { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 22 + lift; ctx.shadowOffsetX = 10 + lift * .5; ctx.shadowOffsetY = 14 + lift; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(-c.width / 2 + 6, -c.height / 2 + 6, c.width - 12, c.height - 12); ctx.restore(); }
  ctx.drawImage(c, -c.width / 2, -c.height / 2); ctx.restore();
}

// ---------- the mini share certificate (flying shares, the border scatter) ----------
function miniLayer(col) {
  return once('mini' + col, () => {
    const w = 120, h = 80, [c, g] = canvas(w, h); sheetBase(g, w, h, 12);
    gBorder(g, 4, 4, w - 8, h - 8, { band: 7, lines: 3, waves: 40, col: '#3a4a60', w: .45, a: .85, radius: 4 });
    rosette(g, w / 2, h / 2 - 4, { R: 15, A: 4, B: 2, n: 10, m: 4, lines: 12, col, w: .5, a: .9 });
    g.fillStyle = rgba('#3a4a60', .6); g.fillRect(w / 2 - 24, h - 18, 48, 1.4);
    return c;
  });
}
export function miniCert(ctx, x, y, s, rot, o = {}) {
  const c = miniLayer(o.col || '#8a5a24'), a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (o.shadow !== false) { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-c.width / 2 + 5, -c.height / 2 + 7, c.width, c.height); }
  ctx.drawImage(c, -c.width / 2, -c.height / 2);
  if (o.glow) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(AMBER, .25 * o.glow); ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height); }
  ctx.restore();
}

// ---------- the public fund: an engraved strongbox, open on top, seen 3/4 from above ----------
function boxLayer() {
  return once('fundbox', () => {
    const w = 520, h = 470, [c, g] = canvas(w, h), x0 = 60, top = 150, fw = 360, fh = 250, d = 90; // front face x0..x0+fw, top edge at `top`
    // back rim (inside) and the dark inside
    g.fillStyle = '#06071a'; g.beginPath(); g.moveTo(x0, top); g.lineTo(x0 + d, top - d * .62); g.lineTo(x0 + fw + d, top - d * .62); g.lineTo(x0 + fw, top); g.closePath(); g.fill();
    // side face (right): deep indigo, engraved diagonals
    const sg = g.createLinearGradient(x0 + fw, 0, x0 + fw + d, 0); sg.addColorStop(0, '#22264f'); sg.addColorStop(1, '#0f1132');
    g.fillStyle = sg; g.beginPath(); g.moveTo(x0 + fw, top); g.lineTo(x0 + fw + d, top - d * .62); g.lineTo(x0 + fw + d, top - d * .62 + fh); g.lineTo(x0 + fw, top + fh); g.closePath(); g.fill();
    g.save(); g.clip(); g.strokeStyle = 'rgba(233,215,170,.07)'; g.lineWidth = 1; for (let i = 0; i < 70; i++) { const yy = top - d + i * 5; g.beginPath(); g.moveTo(x0 + fw, yy); g.lineTo(x0 + fw + d, yy - d * .62); g.stroke(); } g.restore();
    // front face: an engraved panel (intaglio lines on indigo), a guilloche border in cream foil, the label plate
    const fg = g.createLinearGradient(0, top, 0, top + fh); fg.addColorStop(0, '#30346a'); fg.addColorStop(1, '#171a40'); g.fillStyle = fg; g.fillRect(x0, top, fw, fh);
    g.save(); g.beginPath(); g.rect(x0, top, fw, fh); g.clip(); g.strokeStyle = 'rgba(233,215,170,.09)'; g.lineWidth = .9; for (let i = 0; i < 64; i++) { const yy = top + i * 4 + Math.sin(i * .7) * 1.2; g.beginPath(); g.moveTo(x0, yy); g.bezierCurveTo(x0 + fw * .3, yy + 4, x0 + fw * .7, yy - 4, x0 + fw, yy + 1); g.stroke(); } g.restore();
    gBorder(g, x0 + 10, top + 10, fw - 20, fh - 20, { band: 14, lines: 5, waves: 90, col: '#f0d6a0', w: .6, a: .8, radius: 6 });
    // foil rivets in the corners
    for (const [cx, cy] of [[x0 + 24, top + 24], [x0 + fw - 24, top + 24], [x0 + 24, top + fh - 24], [x0 + fw - 24, top + fh - 24]]) { const rg = g.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, 7); rg.addColorStop(0, '#fff1d6'); rg.addColorStop(.6, '#d9a85a'); rg.addColorStop(1, '#6a4a20'); g.fillStyle = rg; g.beginPath(); g.arc(cx, cy, 6.5, 0, TAU); g.fill(); }
    // label plate (paper)
    const lx = x0 + 60, ly = top + 78, lw = fw - 120, lh = 84; g.save(); g.translate(lx, ly); sheetBase(g, lw, lh, 17); g.restore();
    g.strokeStyle = rgba(INK, .6); g.lineWidth = 1; g.strokeRect(lx + 6, ly + 6, lw - 12, lh - 12);
    text(g, 'PUBLIC FUND', lx + lw / 2, ly + 52, { size: 30, font: 'Instrument Serif', color: '#22314a', align: 'center', spacing: 4 });
    // foil edges (the rim catches the light)
    g.strokeStyle = 'rgba(255,214,150,.75)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x0, top + fh); g.lineTo(x0, top); g.lineTo(x0 + fw, top); g.lineTo(x0 + fw + d, top - d * .62); g.stroke();
    g.strokeStyle = 'rgba(255,214,150,.3)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x0 + fw, top); g.lineTo(x0 + fw, top + fh); g.stroke();
    stipple(c, { k: .25, g: 1, seed: 19, mid: false, boost: 1 });
    return { c, x0, top, fw, fh, d };
  });
}
// x,y = centre of the box's front face bottom edge; returns the mouth point (where things drop in)
export function fundBox(ctx, x, y, s, t, o = {}) {
  const B = boxLayer(), ox = x - (B.x0 + B.fw / 2) * s, oy = y - (B.top + B.fh) * s, a = o.a ?? 1;
  const mouth = [ox + (B.x0 + B.fw / 2 + B.d / 2) * s, oy + (B.top - B.d * .31) * s];
  if (a <= 0) return { mouth };
  ctx.save(); ctx.globalAlpha = a;
  // floor shadow
  ctx.save(); ctx.translate(x + 30 * s, y + 6 * s); ctx.scale(1, .18); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 300 * s); sg.addColorStop(0, 'rgba(0,0,0,.6)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, 300 * s, 0, TAU); ctx.fill(); ctx.restore();
  ctx.drawImage(B.c, ox, oy, B.c.width * s, B.c.height * s);
  // what is inside: a stack of certificates rising with fill (seen above the rim)
  const fill = clamp(o.fill ?? 0);
  if (fill > 0) { const n = Math.round(fill * 9); for (let i = 0; i < n; i++) { const r = prng(40 + i); miniCert(ctx, mouth[0] + (r() - .5) * 120 * s, mouth[1] + 26 * s - i * 4 * s, s * 1.15, (r() - .5) * .5, { a, shadow: false }); } }
  if (o.glow) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(mouth[0], mouth[1], 0, mouth[0], mouth[1], 220 * s); gg.addColorStop(0, rgba(AMBER, .35 * o.glow)); gg.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = gg; ctx.fillRect(mouth[0] - 220 * s, mouth[1] - 220 * s, 440 * s, 440 * s); ctx.restore(); }
  ctx.restore();
  return { mouth };
}

// ---------- the bill (our own typography; never a facsimile) ----------
function billLayer(page) {
  return once('bill' + page, () => {
    const w = 760, h = 980, [c, g] = canvas(w, h); sheetBase(g, w, h, 23 + page, '#f1ead6');
    if (page === 0) {
      text(g, '§', 90, 190, { size: 150, font: 'Instrument Serif', color: '#8a3a2a' });
      text(g, 'A BILL', 200, 172, { size: 92, font: 'Instrument Serif', color: '#1f2a3a', spacing: 6 });
      text(g, 'AMERICAN AI SOVEREIGN WEALTH FUND ACT', 92, 250, { size: 19, weight: 600, color: '#3a4a60', spacing: 4 });
      g.fillStyle = rgba('#1f2a3a', .7); g.fillRect(92, 278, w - 184, 1.6); g.fillRect(92, 284, w - 184, .8);
    }
    // body: lines of type as fine grey bars (not readable text), paragraph marks
    const r = prng(5 + page); let y = page === 0 ? 340 : 120;
    while (y < h - 110) { const para = r() < .22; if (para) { text(g, '§', 92, y + 8, { size: 26, font: 'Instrument Serif', color: '#8a3a2a' }); }
      const n = 3 + Math.floor(r() * 4); for (let i = 0; i < n && y < h - 110; i++) { const x0 = (para && i === 0) ? 128 : 92, x1 = w - 92 - (i === n - 1 ? r() * 260 : r() * 20); g.fillStyle = rgba('#2a3448', .42 + r() * .12); let xx = x0; while (xx < x1) { const ww = 14 + r() * 58; g.fillRect(xx, y, Math.min(ww, x1 - xx), 5); xx += ww + 7; } y += 17; } y += 20; }
    stipple(c, { k: .2, g: 1, seed: 9 + page, mid: false, boost: 1 });
    return c;
  });
}
// x,y = sheet centre; o.turn 0..1 the top page turns over its left edge; o.hi 0..1 a paragraph glows (returns its screen centre)
export function billSheet(ctx, x, y, s, rot, t, o = {}) {
  const p0 = billLayer(0), p1 = billLayer(1), w = p0.width, h = p0.height, turn = clamp(o.turn ?? 0), a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetX = 18; ctx.shadowOffsetY = 26; ctx.fillStyle = '#000'; ctx.fillRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16); ctx.restore();
  ctx.drawImage(p1, -w / 2 + 6, -h / 2 + 5);           // the page underneath
  // the paragraph that will glow lies on the second page
  const hy = -h / 2 + 430, hx = -w / 2 + 92, hw = w - 184, hh = 70;
  if ((o.hi ?? 0) > 0 && turn > .5) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#e7a07a', .55 * o.hi); ctx.fillRect(hx - 8, hy - 12, hw * clamp(o.hi * 1.2), hh); ctx.restore(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(RUST, .12 * o.hi); ctx.fillRect(hx - 8, hy - 12, hw * clamp(o.hi * 1.2), hh); ctx.restore(); }
  if (turn < 1) {
    // top page: hinged at its left edge, squashed in x as it turns (with a shade)
    const k = Math.cos(turn * Math.PI), sx = Math.abs(k);
    ctx.save(); ctx.translate(-w / 2, 0); ctx.scale(k >= 0 ? sx : -sx, 1); ctx.translate(w / 2, 0);
    if (k >= 0) ctx.drawImage(p0, -w / 2, -h / 2); else { ctx.fillStyle = '#e6dcc4'; ctx.fillRect(-w / 2, -h / 2, w, h); fibreFill(ctx, .3); }
    ctx.fillStyle = `rgba(30,20,10,${.35 * Math.sin(turn * Math.PI)})`; ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.restore();
  const c = Math.cos(rot), sn = Math.sin(rot), px = (hx + hw / 2) * s, py = (hy + hh / 2 - 12) * s;
  return { para: [x + px * c - py * sn, y + px * sn + py * c] };
}

// ---------- a stack of legal files (folders with a ribbon), growing ----------
export function fileStack(ctx, x, y, s, h, t, o = {}) {
  const n = Math.floor(h), fr = h - n, r = prng(o.seed ?? 3); let yy = y;
  ctx.save();
  // ground shadow
  ctx.save(); ctx.translate(x, y + 4 * s); ctx.scale(1, .25); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 120 * s); sg.addColorStop(0, `rgba(0,0,0,${.5 * clamp(h * .6)})`); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, 120 * s, 0, TAU); ctx.fill(); ctx.restore();
  for (let i = 0; i <= n; i++) {
    const th = (10 + r() * 8) * s, w = (150 + r() * 26) * s, dx = (r() - .5) * 14 * s, tone = ['#d9c9a4', '#cbb88f', '#e2d3b0', '#c4ae86'][Math.floor(r() * 4)];
    if (i === n) { if (fr <= 0) break; const k = eout(fr); yy -= th * k; const drop = (1 - k) * 60 * s; ctx.globalAlpha = k; drawFolder(ctx, x + dx, yy - drop, w, th, tone, r, s); ctx.globalAlpha = 1; break; }
    yy -= th; drawFolder(ctx, x + dx, yy, w, th, tone, r, s);
  }
  ctx.restore();
  return { top: yy };
}
function drawFolder(ctx, x, y, w, th, tone, r, s) {
  ctx.fillStyle = tone; ctx.fillRect(x - w / 2, y, w, th);
  ctx.fillStyle = 'rgba(255,248,230,.5)'; ctx.fillRect(x - w / 2, y, w, 1.2 * s);
  ctx.fillStyle = 'rgba(40,25,15,.35)'; ctx.fillRect(x - w / 2, y + th - 1.5 * s, w, 1.5 * s);
  for (let k = 0; k < 3; k++) { ctx.fillStyle = 'rgba(250,245,232,.85)'; ctx.fillRect(x - w / 2 + 3 * s + k * 2 * s, y + 3 * s + k * 1.5 * s, w - 10 * s, .8 * s); }
  if (r() < .5) { ctx.fillStyle = '#8e2f2a'; ctx.fillRect(x + w * (r() - .5) * .5, y, 5 * s, th); }
}
