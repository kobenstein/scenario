// M1 · your phone: display up, seen from above (or held), with the buzz, the slide over the wood and the display light
// spilling onto the surroundings. (Base version by K0; C1 owns and extends this file — keep the signature.)
//   phone(ctx, x, y, s, { t, buzz: t0 | [t0, …] (two short pulses each), slide: [dx, dy] px it travels on a buzz,
//          ang (rad), glow (0..1 display light), lit (0..1 display on), card: { title, sub, kind: 'warm'|'grey', t0, from: 'top'|'bottom', icon: 'share'|'dot' },
//          screen(ctx, w, h, t) draws your own screen content in phone units (0..w, 0..h), held: true (no table shadow), body: '#15151c' })
//   → returns { x, y, ang } where it is after the slide (use it for the cup it bumps into)
//   phoneCard(ctx, x, y, w, t, card)  the notification card alone (screen space), e.g. pushed in big on the display
//   buzzOffset(t, t0) → [dx, dy] jitter of one buzz (two pulses, 0.55 s)
//   lockScreen(g, w, h, t, o)  a lock screen in display units: o = { time '6:12', day 'Monday', lit 0..1,
//          cards: [{ title, sub, t0 (slides in), t1 (wiped off to the left) }], share: { t0, title 'Your share', sub, glint true } }
//          grey cards slide in from the top and get wiped; the share card drops in, locks with a small overshoot and a foil glint.
//          Text is fitted to the card (never cut off).
//   heldPhone(ctx, x, y, s, o)  POV close-up: your right hand holds the phone (four fingers curl round the left edge, seen from
//          the side with nail slivers; the thumb, two segments from a round thenar pad, along the right edge; the heel narrows
//          into the wrist and a sleeve cuff), the phone tilted slightly back (foreshortened), lit only by its display (hand
//          layers cached per scale, skin and sleeve). The hand lives on its own: small grip shifts, the thumb lifts every few
//          seconds, a squeeze with each buzz and a settle after it (all from t, deterministic).
//          o: { t, buzz, ang (roll), pitch (.22), skin ('#b98261'), lit (0..1, default from buzz), lock (lockScreen options) or
//               screen(g, w, h, t), warm (0..1 display light on the fingers), rim ('#e9e4d8' cool light from the rings on the outer
//               contour, null = none), rimA (.55), sleeve (cuff colour; false = bare wrist; default picked from the skin),
//               seed (varies the idle motion) }
//          → { x, y, ang, s, map(px, py) → [sx, sy] (phone units → screen; phone is 150 × 310 units centred on 0,0),
//              w0, h0 (half size of the phone on screen, for ripple()) }
import { rgba, clamp, lin, eout, eio, sm, addGlow, text, mix, canvas, back } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { shareLight } from './share.mjs';
import { rosette } from './certificate.mjs';
import { hatch as artHatch, stipple } from './art.mjs';

export function buzzOffset(t, t0) {
  const u = t - t0; if (u < 0 || u > .62) return [0, 0];
  const env = (u < .26 ? Math.sin(Math.PI * u / .26) : u > .34 ? Math.sin(Math.PI * (u - .34) / .26) : 0);
  return [Math.sin(u * 190) * 2.6 * env, Math.cos(u * 157) * 1.6 * env];
}
export function phoneCard(ctx, x, y, w, t, c = {}) {
  const t0 = c.t0 ?? -99, u = eout(lin(t0, t0 + .45, t)); if (u <= 0) return;
  const h = w * .28, from = c.from === 'bottom' ? 1 : -1, yy = y + from * (1 - u) * h * 1.4, warm = c.kind === 'warm';
  ctx.save(); ctx.globalAlpha = u;
  ctx.fillStyle = warm ? 'rgba(48,34,30,.94)' : 'rgba(38,40,50,.92)'; ctx.beginPath(); ctx.roundRect(x, yy, w, h, h * .22); ctx.fill();
  ctx.strokeStyle = warm ? rgba('#ffb35c', .45) : 'rgba(200,210,230,.18)'; ctx.lineWidth = Math.max(1, w * .004); ctx.stroke();
  const ix = x + h * .5, iy = yy + h * .5;
  if (c.icon === 'share' || warm) shareLight(ctx, ix, iy, h * .17, t, { born: c.born ?? (t0 + .3), pulse: 1 });
  else { ctx.fillStyle = 'rgba(160,168,185,.6)'; ctx.beginPath(); ctx.roundRect(ix - h * .2, iy - h * .2, h * .4, h * .4, h * .08); ctx.fill(); }
  if (c.title) text(ctx, c.title, x + h * .95, yy + h * .44, { size: Math.round(h * .26), weight: 600, color: warm ? '#fff1d6' : 'rgba(225,230,240,.85)' });
  else { ctx.fillStyle = 'rgba(210,215,228,.55)'; ctx.fillRect(x + h * .95, yy + h * .3, w * .45, h * .12); }
  if (c.sub) text(ctx, c.sub, x + h * .95, yy + h * .76, { size: Math.round(h * .19), weight: 400, color: warm ? 'rgba(255,225,190,.75)' : 'rgba(200,205,220,.6)' });
  else { ctx.fillStyle = 'rgba(190,196,210,.32)'; ctx.fillRect(x + h * .95, yy + h * .6, w * .6, h * .09); }
  ctx.restore();
}
export function phone(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, W0 = 150, H0 = 310; // phone units
  const buzzes = o.buzz == null ? [] : [].concat(o.buzz);
  let jx = 0, jy = 0, slid = 0;
  for (const b0 of buzzes) { const [dx, dy] = buzzOffset(t, b0); jx += dx; jy += dy; slid += eout(lin(b0, b0 + .6, t)); }
  const sl = o.slide || [0, 0], px = x + sl[0] * slid / Math.max(1, buzzes.length) + jx * s, py = y + sl[1] * slid / Math.max(1, buzzes.length) + jy * s;
  const ang = (o.ang ?? 0) + .01 * Math.sin(t * 40) * (Math.abs(jx) > .1 ? 1 : 0);
  const lit = o.lit ?? (buzzes.length ? Math.max(...buzzes.map((b0) => sm(lin(b0, b0 + .25, t)))) : 0), glowA = (o.glow ?? 1) * lit;
  // display light on the table around the phone
  if (glowA > 0) { addGlow(ctx, px, py, 420 * s, .3 * glowA, '#9fd4ff', '#e8f6ff'); addGlow(ctx, px, py, 220 * s, .22 * glowA, '#cfe6ff', '#ffffff'); }
  ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.scale(s, s);
  if (!o.held) { ctx.fillStyle = 'rgba(4,3,10,.55)'; ctx.beginPath(); ctx.roundRect(-W0 / 2 + 10, -H0 / 2 + 14, W0, H0, 22); ctx.fill(); }
  // body with a thin metal rim catching the window light
  ctx.fillStyle = o.body || '#14141b'; ctx.beginPath(); ctx.roundRect(-W0 / 2, -H0 / 2, W0, H0, 22); ctx.fill();
  const rg = ctx.createLinearGradient(-W0 / 2, -H0 / 2, W0 / 2, H0 / 2); rg.addColorStop(0, 'rgba(230,236,255,.55)'); rg.addColorStop(.4, 'rgba(230,236,255,.05)'); rg.addColorStop(1, 'rgba(255,200,150,.25)');
  ctx.strokeStyle = rg; ctx.lineWidth = 3; ctx.stroke();
  // display
  const dw = W0 - 14, dh = H0 - 16;
  ctx.save(); ctx.beginPath(); ctx.roundRect(-dw / 2, -dh / 2, dw, dh, 17); ctx.clip();
  const dg = ctx.createLinearGradient(0, -dh / 2, 0, dh / 2); dg.addColorStop(0, mixc('#0b0d16', '#2a3550', lit)); dg.addColorStop(1, mixc('#06070c', '#141a2c', lit));
  ctx.fillStyle = dg; ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
  if (o.screen) { ctx.save(); ctx.translate(-dw / 2, -dh / 2); o.screen(ctx, dw, dh, t); ctx.restore(); }
  if (o.card) phoneCard(ctx, -dw / 2 + 8, -dh / 2 + 34, dw - 16, t, o.card);
  // glass reflection of the window: one soft diagonal band
  const gl = ctx.createLinearGradient(-dw / 2, -dh / 2, dw / 2, dh / 2); gl.addColorStop(.25, 'rgba(255,255,255,0)'); gl.addColorStop(.33, 'rgba(220,235,255,.10)'); gl.addColorStop(.42, 'rgba(255,255,255,0)');
  ctx.fillStyle = gl; ctx.fillRect(-dw / 2, -dh / 2, dw, dh);
  ctx.restore();
  ctx.fillStyle = '#05050a'; ctx.beginPath(); ctx.roundRect(-16, -dh / 2 + 6, 32, 9, 4.5); ctx.fill(); // camera notch
  ctx.restore();
  return { x: px, y: py, ang };
}
function mixc(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return `rgb(${m(16)},${m(8)},${m(0)})`; }

// ---------- lock screen ----------
const SCR = new Map();
const scratch = (key, w, h) => { if (!SCR.has(key)) SCR.set(key, canvas(Math.ceil(w), Math.ceil(h))); return SCR.get(key); };
function fitSize(g, str, maxW, size, font, weight = 400) { let z = size; g.font = `${weight} ${z}px "${font}"`; while (z > 3 && g.measureText(str).width > maxW) { z *= .95; g.font = `${weight} ${z}px "${font}"`; } return z; }
function cardShell(g, x, y, w, h, warm, a) {
  g.save(); g.globalAlpha = a;
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.roundRect(x + 1, y + 2.5, w, h, h * .2); g.fill();
  if (warm) { const bg = g.createLinearGradient(x, y, x + w, y + h); bg.addColorStop(0, '#5a3218'); bg.addColorStop(.55, '#3a2214'); bg.addColorStop(1, '#2a1a12'); g.fillStyle = bg; }
  else g.fillStyle = 'rgba(58,64,80,.88)';
  g.beginPath(); g.roundRect(x, y, w, h, h * .2); g.fill();
  g.strokeStyle = warm ? 'rgba(255,190,110,.75)' : 'rgba(210,220,240,.16)'; g.lineWidth = warm ? .7 : .5; g.stroke();
  g.restore();
}
function greyCard(g, x, y, w, h, c, a) {
  cardShell(g, x, y, w, h, false, a); g.save(); g.globalAlpha = a;
  const ix = x + h * .42, iy = y + h * .5; g.fillStyle = 'rgba(150,160,180,.55)'; g.beginPath(); g.roundRect(ix - h * .2, iy - h * .2, h * .4, h * .4, h * .09); g.fill();
  const tx = x + h * .8, mw = w - h * .8 - h * .3;
  if (c.title) { const z = fitSize(g, c.title, mw * .78, h * .24, 'Inter', 600); g.fillStyle = 'rgba(232,236,245,.92)'; g.textBaseline = 'alphabetic'; g.fillText(c.title, tx, y + h * .43); }
  if (c.sub) { const z = fitSize(g, c.sub, mw, h * .19, 'Inter', 400); g.fillStyle = 'rgba(200,206,222,.7)'; g.fillText(c.sub, tx, y + h * .76); }
  g.font = `400 ${h * .15}px "Inter"`; g.fillStyle = 'rgba(200,206,222,.55)'; g.textAlign = 'right'; g.fillText(c.when || 'now', x + w - h * .22, y + h * .36); g.textAlign = 'left';
  g.restore();
}
function shareCard(g, x, y, w, h, c, t, a) {
  cardShell(g, x, y, w, h, true, a); g.save(); g.globalAlpha = a;
  const pad = h * .16, r = h * .2, title = c.title || 'Your share';
  // the medallion: a small guilloche rosette in foil with the share light at its heart
  const ix = x + pad + r, iy = y + h * .42;
  rosette(g, ix, iy, { R: r * .7, A: r * .2, B: r * .08, n: 12, m: 5, lines: 12, col: '#e8a860', w: .3, a: .75 * a, rot: t * .2, steps: 200 });
  shareLight(g, ix, iy, r * .22, t, { born: (c.t0 ?? 0) + .25, pulse: 1, a: .8 });
  // title in foil + glint, fitted into the card (never cut)
  const tx = ix + r + pad * .7, mw = x + w - pad - tx;
  const z = fitSize(g, title, mw, h * .4, 'Instrument Serif', 400), tw = Math.ceil(g.measureText(title).width + 4), th = Math.ceil(z * 1.3);
  const [mc, mx] = scratch('sharetitle' + Math.round(w) + 'x' + Math.round(h) + title, tw + 2, th + 2);
  mx.setTransform(1, 0, 0, 1, 0, 0); mx.globalCompositeOperation = 'source-over'; mx.clearRect(0, 0, tw + 2, th + 2); mx.font = `400 ${z}px "Instrument Serif"`; mx.textBaseline = 'alphabetic';
  const fg = mx.createLinearGradient(0, 0, tw, th); fg.addColorStop(0, '#ffd99a'); fg.addColorStop(.45, '#ffb35c'); fg.addColorStop(.7, '#fff1d6'); fg.addColorStop(1, '#e09040'); mx.fillStyle = fg; mx.fillText(title, 1, z);
  if (c.glint !== false) { const u = clamp((t - (c.t0 ?? 0) - .55) / .9); if (u > 0 && u < 1) { mx.globalCompositeOperation = 'source-atop'; const bx = mix(-tw * .3, tw * 1.3, eio(u)); const gg = mx.createLinearGradient(bx - tw * .18, 0, bx + tw * .18, th); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(.5, 'rgba(255,252,240,.95)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); mx.fillStyle = gg; mx.fillRect(0, 0, tw + 2, th + 2); } }
  g.drawImage(mc, tx - 1, y + h * .52 - z);
  if (c.sub !== '') { const sub = c.sub || 'of the largest fortune ever made'; fitSize(g, sub, x + w - pad - tx, h * .13, 'Inter', 500); g.fillStyle = 'rgba(255,226,190,.85)'; g.textBaseline = 'alphabetic'; g.fillText(sub, tx, y + h * .76); }
  g.font = `500 ${h * .11}px "Inter"`; g.fillStyle = 'rgba(255,214,160,.7)'; g.textAlign = 'right'; g.fillText(c.when || 'now', x + w - pad * .8, y + h * .22); g.textAlign = 'left';
  g.restore();
  // the lock-in: one bright pass of light around the card edge
  const lk = t - (c.t0 ?? 0) - .38; if (lk > 0 && lk < .7) { g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(255,214,150,${.9 * (1 - lk / .7)})`; g.lineWidth = 1.2 + 3 * (1 - lk / .7); g.beginPath(); g.roundRect(x - lk * 4, y - lk * 4, w + lk * 8, h + lk * 8, h * .2 + lk * 4); g.stroke(); g.restore(); }
}
export function lockScreen(g, w, h, t, o = {}) {
  const lit = clamp(o.lit ?? 1);
  if (lit <= 0) return;
  g.save(); g.globalAlpha = lit;
  // wallpaper: deep slate with an engraved rosette watermark, warmer where the share card sits
  const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#1b2236'); bg.addColorStop(1, '#0b0e18'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  const sh = o.share, shareOn = sh ? eout(lin(sh.t0, sh.t0 + .5, t)) : 0;
  if (shareOn > 0) { const wg = g.createRadialGradient(w * .5, h * .3, 0, w * .5, h * .3, h * .7); wg.addColorStop(0, `rgba(150,80,30,${.55 * shareOn})`); wg.addColorStop(1, 'rgba(150,80,30,0)'); g.fillStyle = wg; g.fillRect(0, 0, w, h); }
  // time
  g.fillStyle = 'rgba(236,240,250,.9)'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.fillStyle = 'rgba(236,240,250,.72)'; g.font = `500 ${w * .05}px "Inter"`; g.fillText(o.day || 'Monday', w / 2, h * .085);
  g.font = `400 ${w * .2}px "Inter"`; g.fillText(o.time || '6:12', w / 2, h * .17);
  g.textAlign = 'left';
  // cards
  const cw = w * .92, chh = cw * .3, cx0 = (w - cw) / 2, top = h * .22;
  const cards = o.cards || [];
  let slot = 0;
  for (const c of cards) {
    const inn = eout(lin(c.t0, c.t0 + .4, t)); if (inn <= 0) continue;
    const wipe = c.t1 != null ? clamp((t - c.t1) / .32) : 0; if (wipe >= 1) continue;
    const y = top + slot * (chh + 6) - (1 - inn) * chh * 1.2, x = cx0 - eio(wipe) * w * 1.15;
    if (wipe > 0) for (const k of [1, 2]) greyCard(g, x + k * w * .08 * wipe, y, cw, chh, c, .18 * inn * (1 - wipe));   // smear of the wipe
    greyCard(g, x, y, cw, chh, c, inn * (1 - wipe * .6));
    if (c.t1 == null || t < c.t1) slot++;
  }
  if (sh && shareOn > 0) {
    const u = clamp((t - sh.t0) / .55), y = top - (1 - back(u)) * chh * 1.6, sc = 1 + .05 * Math.exp(-Math.pow((t - sh.t0 - .45) / .12, 2));
    const ch2 = cw * .44;
    g.save(); g.translate(w / 2, y + ch2 / 2); g.scale(sc, sc); g.translate(-w / 2, -(y + ch2 / 2));
    shareCard(g, cx0, y, cw, ch2, sh, t, Math.min(1, u * 2.5));
    g.restore();
  }
  g.restore();
}

// ---------- the phone in your hand ----------
// A natural right hand, seen by its owner (phone units: phone 150 × 310 centred on 0,0; x right, y down). The phone's back rests
// on the palm, which lies diagonally behind it: four fingers curl round the LEFT edge (index highest, little finger lowest and
// smallest; we see their sides and tips, the middle knuckles just outside the edge, the tips over the bezel, the nails only as
// slivers), the thumb (two segments, thick, from a round thenar pad) lies along the RIGHT edge with its tip on the bezel, the
// heel of the hand narrows into the wrist and a sleeve cuff. Every part is a cached sprite in the print look (form shading toward
// the display light, engraved hatch in the shade, stipple grain, creases); per frame the fingers and the thumb move a little on
// their own (grip shifts, the thumb lifts every few seconds, a squeeze and a settle after each buzz). In the dark the display
// backlights thumb and fingertips (a warm translucent rim), the rings rim the outer contour in cool light.
const FINGERS = [   // K = middle knuckle (outside the edge), T = tip (over the bezel), w = width at the knuckle, wt = at the tip, bend = droop of the tip
  { K: [-110, -45], T: [-63, -42], w: 33.5, wt: 26, bend: 2.5 },    // index
  { K: [-120, -12.5], T: [-57, -7], w: 35, wt: 27.5, bend: 4.5 },    // middle (the longest reach)
  { K: [-116, 19.5], T: [-61, 27], w: 33, wt: 26, bend: 5.5 },       // ring
  { K: [-103, 49.5], T: [-68.5, 58], w: 27.5, wt: 21.5, bend: 6 },   // little
];
// the thumb: outline from the tip, down the nail side, round the base (faded into the thenar) and up the pad side
const THUMB = [[79, -8], [92, -4.5], [101.5, 5], [106.5, 19], [109, 34], [110, 49], [112.5, 62], [115.5, 77], [120, 91], [126.5, 104], [134, 117], [141, 131], [146, 150],
  [124, 170], [96, 152], [83, 129], [76, 107], [71.5, 87], [68.5, 70], [67.5, 58], [64.5, 45], [62.5, 30], [63, 15], [67.5, 2]];
const THUMB_NAIL = [[87, -1.5], [95.5, 1], [100.8, 9], [102.6, 19], [101.8, 27.5], [97.5, 29.5], [93.2, 24.5], [90.2, 14.5], [88, 5]];
// palm (behind the phone): ulnar border below the little finger, heel, wrist into the sleeve, thenar round to the thumb's base
const PALM = [[-40, 26], [-74, 52], [-85, 74], [-88, 100], [-86, 128], [-79, 156], [-66, 186], [-46, 214], [-23, 240], [-3, 262], [7, 290], [12, 330], [16, 420], [16, 470],
  [136, 470], [136, 400], [133, 330], [130, 292], [133, 268], [141, 240], [148, 206], [150, 172], [146, 142], [137, 120], [126, 104], [112, 86], [80, 52], [20, 28]];
const CUFF = { l: [2, 300], r: [135, 292] };   // the sleeve's opening (the wrist goes into it), below runs the sleeve
const HB = { x: -150, y: -80, w: 330, h: 600 };          // world box of the whole hand (phone units)

function loop(P, n = 7) {   // closed Catmull-Rom through P
  const out = [], N = P.length;
  for (let i = 0; i < N; i++) {
    const p0 = P[(i - 1 + N) % N], p1 = P[i], p2 = P[(i + 1) % N], p3 = P[(i + 2) % N];
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t, f = (a, b, c, d) => .5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3); out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]); }
  }
  return out;
}
function open(P, n = 7) {   // open Catmull-Rom through P (ends repeated)
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t, f = (a, b, c, d) => .5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3); out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]); }
  }
  out.push(P[P.length - 1]); return out;
}
const toPath = (pts, p = new Path2D()) => { p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); p.closePath(); return p; };
const polyline = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); };
const boxOf = (pts, pad) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); } return { x: Math.floor(x0 - pad), y: Math.floor(y0 - pad), w: Math.ceil(x1 - x0 + 2 * pad), h: Math.ceil(y1 - y0 + 2 * pad) }; };

// one curled finger seen from the side: local frame u along K→T, v across (v < 0 = the upper, back-of-finger side)
function fingerShape(F, i) {
  const [kx, ky] = F.K, L = Math.hypot(F.T[0] - kx, F.T[1] - ky), ux = (F.T[0] - kx) / L, uy = (F.T[1] - ky) / L, vx = -uy, vy = ux;
  const bend = F.bend || 0, at = (u, v) => { const b = bend * Math.pow(Math.max(0, u) / L, 2); return [kx + ux * u + vx * (v + b), ky + uy * u + vy * (v + b)]; };
  const hw = F.w / 2, ht = F.wt / 2, hd = (hw + ht) / 2, D = L - 2.05 * ht;
  const P = [[L, -.3 * ht], [L - .45 * ht, -.88 * ht], [L - 1.3 * ht, -ht], [D, -.95 * hd], [D * .62, -hw], [7, -1.03 * hw], [-.6, -.84 * hw], [-3.8, -.36 * hw], [-3.6, .18 * hw],
    [-1, .74 * hw], [5, .99 * hw], [D * .6, .96 * hw], [D + 1, .86 * hd], [L - 1.25 * ht, ht], [L - .4 * ht, .7 * ht]];
  const out = loop(P.map(([u, v]) => at(u, v)), 6);
  const arc = (pts) => open(pts.map(([u, v]) => at(u, v)), 6);
  const creases = [
    { pts: arc([[D + 1, hd * .86], [D + 2.6, hd * .35], [D + 2.2, -hd * .1]]), a: .6, w: .7 },      // DIP fold on the pad side
    { pts: arc([[D - 1.6, hd * .86], [D - .2, hd * .45], [D - .3, hd * .12]]), a: .4, w: .55 },
    { pts: arc([[D - 1, -hd * .92], [D + 1, -hd * .62], [D + 1.4, -hd * .36]]), a: .5, w: .6 },     // DIP wrinkles on the back
    { pts: arc([[3.4, -hw * .66], [2.2, -hw * .4], [2.4, -hw * .12]]), a: .4, w: .6 },               // middle-knuckle skin folds (top only)
    { pts: arc([[7.6, -hw * .72], [6.4, -hw * .46], [6.8, -hw * .22]]), a: .3, w: .55 },
  ];
  // the nail: seen edge-on, a sliver along the back of the tip
  const nail = loop([[L - 1.32 * ht, -.97 * ht], [L - .5 * ht, -.9 * ht], [L - .06 * ht, -.42 * ht], [L - .3 * ht, -.5 * ht], [L - 1.2 * ht, -.78 * ht]].map(([u, v]) => at(u, v)), 6);
  return { out, path: toPath(out), nail, creases, pivot: F.K, box: boxOf(out, 9), ax: { kx, ky, ux, uy, vx, vy, L, hw, ht, D, at }, i };
}
function thumbShape() {
  const out = loop(THUMB, 6);
  const creases = [
    { pts: open([[95, 51.5], [101.5, 48.5], [108.5, 49.5]]), a: .55, w: .7 },   // knuckle wrinkles on the back of the joint
    { pts: open([[96.5, 57.5], [103, 55], [109.5, 57]]), a: .45, w: .6 },
    { pts: open([[99, 63], [104.5, 61.5], [110, 63.5]]), a: .25, w: .5 },
    { pts: open([[67.5, 56.5], [73.5, 58.5], [80.5, 57]]), a: .75, w: .75 },     // IP fold on the pad side
    { pts: open([[68.5, 62], [73, 63.5], [77, 62.5]]), a: .35, w: .55 },
    { pts: open([[80, 114], [87, 121], [97, 124.5]]), a: .35, w: .6 },          // where the thumb leaves the web
  ];
  return { out, path: toPath(out), nail: loop(THUMB_NAIL, 6), creases, pivot: [122, 128], box: boxOf(out, 10) };
}
function palmShape() {
  const out = loop(PALM, 6);
  const creases = [
    { pts: open([[32, 152], [42, 184], [56, 218], [70, 248], [78, 270]]), a: .5, w: .9 },   // the thenar crease round the thumb pad
    { pts: open([[12, 276], [48, 270], [90, 269], [128, 274]]), a: .45, w: .8 },             // wrist creases
    { pts: open([[14, 285], [60, 280], [100, 280], [130, 286]]), a: .28, w: .6 },
  ];
  // the roots of the fingers beside the left edge (in shade behind the curled fingers: they grow out of one hand)
  const roots = new Path2D(); roots.moveTo(-72, -58); roots.bezierCurveTo(-86, -56, -95, -30, -96, -4); roots.bezierCurveTo(-97, 26, -94, 54, -86, 76); roots.lineTo(-60, 76); roots.lineTo(-60, -58); roots.closePath();
  return { out, path: toPath(out), roots, creases, box: boxOf(out, 10) };
}
function cuffShape() {
  const { l, r } = CUFF, P = new Path2D();
  P.moveTo(l[0], l[1]); P.bezierCurveTo(40, 284, 100, 281, r[0], r[1]); P.lineTo(142, 540); P.lineTo(8, 540); P.closePath();
  const hem = new Path2D(); hem.moveTo(l[0] + 1, l[1] + 17); hem.bezierCurveTo(41, 301, 100, 298, r[0] + 1, r[1] + 17);
  return { path: P, hem, box: { x: -14, y: 270, w: 170, h: 280 } };
}
let GEO = null;
const handGeo = () => GEO || (GEO = { fingers: FINGERS.map(fingerShape), thumb: thumbShape(), palm: palmShape(), cuff: cuffShape() });

// skin tones: the given skin seen in the dim light of the scenes (hue kept, shadows warmer)
function tonesOf(skin) {
  const n = parseInt((skin || '#b98261').slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = (f, fr = 1, fg = 1, fb = 1) => [r * f * fr, g * f * fg, b * f * fb].map((v) => Math.round(clamp(v, 0, 255)));
  return { deep: t(.29, 1.12, .9, .86), shade: t(.43, 1.06, .95, .92), mid: t(.58), light: t(.78, 1, 1, .98), hi: t(.92, 1, 1, .97), blush: t(.63, 1.14, .84, .8), nail: t(.7, 1, .97, .98) };
}
const css = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const SLEEVES = ['#a8742c', '#2f6f74', '#7a3b2e', '#3b4a72', '#6a5a2a', '#5c3a5a'];
function sleeveOf(o) {
  if (o.sleeve === false || o.sleeve === null) return null; if (typeof o.sleeve === 'string') return o.sleeve;
  const s = (o.skin || '#b98261').toLowerCase(); if (s === '#b98261') return '#a8742c';   // you: the ochre sleeve of the hook
  if (s === '#c99a74') return '#1f6f78';   // the petrol sleeve of the typing hand in sc02 (the same person)
  let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 9973; return SLEEVES[h % SLEEVES.length];
}
const hashf = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ---------- cached sprites ----------
const HAND = new Map();
export function _handLayers(k, skin, sleeve) { return handLayers(k, skin, sleeve); }
function handLayers(k, skin, sleeve) {
  const key = k.toFixed(2) + skin + sleeve; if (HAND.has(key)) return HAND.get(key);
  const G = handGeo(), T = tonesOf(skin);
  const mk = (b) => { const [c, g] = canvas(Math.ceil(b.w * k), Math.ceil(b.h * k)); g.setTransform(k, 0, 0, k, -b.x * k, -b.y * k); return [c, g]; };
  const unit = (g, b) => g.setTransform(k, 0, 0, k, -b.x * k, -b.y * k), id = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
  const fillR = (g, b, style) => { g.fillStyle = style; g.fillRect(b.x, b.y, b.w, b.h); };
  const radial = (g, b, x, y, r, col, a, sx = 1, sy = 1, rot = 0) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(sx, sy); const rg = g.createRadialGradient(0, 0, 0, 0, 0, r); rg.addColorStop(0, css(col, a)); rg.addColorStop(1, css(col, 0)); g.fillStyle = rg; g.fillRect(-r, -r, 2 * r, 2 * r); g.restore(); };
  const edgeShade = (g, path, wU, a, col = T.deep) => { g.save(); g.clip(path); g.filter = `blur(${wU * .45}px)`; g.globalAlpha = a; g.strokeStyle = css(col); g.lineWidth = wU; g.stroke(path); g.restore(); g.filter = 'none'; };
  const crease = (g, c, wmul = 1) => { g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; polyline(g, c.pts.map(([x, y]) => [x + .55, y + .45])); g.strokeStyle = css(T.light, .22 * c.a); g.lineWidth = c.w * .8 * wmul; g.stroke();
    polyline(g, c.pts); g.strokeStyle = css(T.deep, .85 * c.a); g.lineWidth = c.w * wmul; g.stroke(); g.restore(); };
  // engraved hatch: parallel fine lines inside `path`, kept only where `mask(g)` paints (the shade)
  const engrave = (c, b, path, angle, gap, mask, a = .5, seed = 1) => {
    const [hc, hg] = mk(b); hg.save(); hg.clip(path); artHatch(hg, [b.x, b.y, b.w, b.h], { angle, gap, w: Math.max(.32, .55 / k), col: css(T.deep), a: 1, wobble: .35, seed, broken: .3 }); hg.restore();
    hg.globalCompositeOperation = 'destination-in'; mask(hg); hg.globalCompositeOperation = 'source-over';
    const g = c.getContext('2d'); id(g); g.globalAlpha = a; g.drawImage(hc, 0, 0); g.globalAlpha = 1; unit(g, b);
  };
  const grain = (c, b, path, a, seed) => {   // skin tooth: sparse dark and light dots
    const [sc, sg] = mk(b); sg.fillStyle = css(T.deep, .2); sg.fill(path); id(sg); stipple(sc, { k: 1, g: 1, seed, mid: false, boost: 1.6 });
    const [lc, lg] = mk(b); lg.fillStyle = css(T.hi, .1); lg.fill(path); id(lg); stipple(lc, { k: 1, g: 1, seed: seed + 50, mid: false, boost: 2 });
    const g = c.getContext('2d'); id(g); g.globalAlpha = a; g.drawImage(sc, 0, 0); g.drawImage(lc, 0, 0); g.globalAlpha = 1; unit(g, b);
  };
  const maskOf = (path, b) => { const [c, g] = mk(b); g.fillStyle = '#fff'; g.fill(path); return c; };

  // ---- palm + wrist + cuff (one sprite, behind the phone) ----
  const PB = { x: HB.x, y: -70, w: HB.w, h: 620 }, PP = G.palm.path;
  const [pc, pg] = mk(PB);
  pg.fillStyle = css(T.mid); pg.fill(PP);
  pg.save(); pg.clip(PP);
  radial(pg, PB, 112, 180, 54, T.light, .62, 1, 1.25, .25);           // the thenar pad (the thumb's root)
  radial(pg, PB, -50, 178, 46, T.light, .4, .8, 1.5, -.6);            // the hypothenar along the outer edge
  radial(pg, PB, 36, 206, 50, T.deep, .5, 1, 1.4, .2);                // the hollow of the palm between them
  radial(pg, PB, 40, 160, 80, T.blush, .25);                          // warmth just under the phone
  { const lg = pg.createLinearGradient(0, 215, 0, 300); lg.addColorStop(0, css(T.deep, 0)); lg.addColorStop(1, css(T.deep, .7)); pg.fillStyle = lg; pg.fillRect(PB.x, 215, PB.w, 345); }
  { const lg = pg.createLinearGradient(-92, 0, -62, 0); lg.addColorStop(0, css(T.deep, .5)); lg.addColorStop(1, css(T.deep, 0)); pg.fillStyle = lg; pg.fillRect(-100, 60, 50, 110); }
  pg.restore();
  edgeShade(pg, PP, 16, .55);
  { const R = G.palm.roots; pg.fillStyle = css(T.shade); pg.fill(R); pg.save(); pg.clip(R); const lg = pg.createLinearGradient(-96, 0, -72, 0); lg.addColorStop(0, css(T.deep, .8)); lg.addColorStop(1, css(T.deep, .2)); pg.fillStyle = lg; pg.fillRect(-100, -60, 40, 140); pg.restore(); }
  engrave(pc, PB, PP, -.7, 2.6, (g) => { const lg = g.createLinearGradient(0, 190, 0, 300); lg.addColorStop(0, 'rgba(255,255,255,.1)'); lg.addColorStop(1, '#fff'); g.fillStyle = lg; g.fillRect(PB.x, PB.y, PB.w, PB.h); radial(g, PB, 36, 206, 52, [255, 255, 255], .9); }, .42, 5);
  grain(pc, PB, PP, .55, 3);
  for (const c of G.palm.creases) crease(pg, c);
  // the phone presses into the palm: a soft contact shadow along its bottom edge
  pg.save(); pg.clip(PP); pg.filter = 'blur(3px)'; pg.fillStyle = css(T.deep, .75); pg.beginPath(); pg.roundRect(-70, 146, 140, 14, 7); pg.fill(); pg.filter = 'none'; pg.restore();
  // the sleeve: the wrist goes into a cuff (fabric in the accent colour, ribbed hem, rim of display light on its edge)
  if (sleeve) {
    const C = G.cuff, sl = parseInt(sleeve.slice(1), 16), S = [sl >> 16, (sl >> 8) & 255, sl & 255], sc = (f) => S.map((v) => Math.round(clamp(v * f, 0, 255)));
    pg.save(); pg.clip(PP); pg.filter = 'blur(4px)'; pg.fillStyle = 'rgba(4,3,8,.6)'; pg.translate(0, -6); pg.fill(C.path); pg.restore(); pg.filter = 'none';   // the cuff shades the wrist
    pg.fillStyle = css(sc(.55)); pg.fill(C.path);
    pg.save(); pg.clip(C.path);
    { const lg = pg.createLinearGradient(0, 0, 160, 0); lg.addColorStop(0, css(sc(.85), .7)); lg.addColorStop(.45, css(sc(.6), 0)); lg.addColorStop(1, css(sc(.25), .8)); pg.fillStyle = lg; pg.fillRect(-20, 280, 200, 280); }
    { const lg = pg.createLinearGradient(0, 300, 0, 470); lg.addColorStop(0, 'rgba(4,3,8,0)'); lg.addColorStop(1, 'rgba(4,3,8,.75)'); pg.fillStyle = lg; pg.fillRect(-20, 280, 200, 280); }
    pg.strokeStyle = css(sc(.3), .55); pg.lineWidth = .7; for (let x = 0; x < 140; x += 4.2) { pg.beginPath(); pg.moveTo(x + 1, 278); pg.lineTo(x + 1.6, 318); pg.stroke(); }   // ribs of the hem
    pg.strokeStyle = css(sc(.25), .8); pg.lineWidth = 1.2; pg.stroke(C.hem);
    artHatch(pg, [-20, 310, 200, 240], { angle: -1.2, gap: 3, w: Math.max(.35, .6 / k), col: css(sc(.2)), a: .45, wobble: .4, seed: 9, broken: .3 });
    pg.restore();
    pg.save(); pg.lineCap = 'round'; pg.strokeStyle = css(sc(1.1), .55); pg.lineWidth = 1.4; pg.beginPath(); pg.moveTo(CUFF.l[0] + 2, CUFF.l[1] - 1); pg.bezierCurveTo(40, 283, 100, 280, CUFF.r[0] - 1, CUFF.r[1] - 1); pg.stroke(); pg.restore();
  }
  const palmMask = (() => { const [c, g] = mk(PB); g.fillStyle = '#fff'; g.fill(PP); g.fill(G.palm.roots); if (sleeve) g.fill(G.cuff.path); return c; })();

  // ---- the digits (front sprites) ----
  const paintFinger = (F) => {
    const b = F.box, A = F.ax, [c, g] = mk(b);
    g.fillStyle = css(T.mid); g.fill(F.path);
    g.save(); g.clip(F.path);
    { const p0 = A.at(0, -A.hw), p1 = A.at(0, A.hw), lg = g.createLinearGradient(p0[0], p0[1], p1[0], p1[1]); lg.addColorStop(0, css(T.light, .55)); lg.addColorStop(.35, css(T.light, .06)); lg.addColorStop(.6, css(T.deep, .05)); lg.addColorStop(1, css(T.deep, .75)); g.fillStyle = lg; fillR(g, b, lg); }
    { const p0 = A.at(-4, 0), p1 = A.at(A.L, 0), lg = g.createLinearGradient(p0[0], p0[1], p1[0], p1[1]); lg.addColorStop(0, css(T.deep, .62)); lg.addColorStop(.42, css(T.deep, 0)); lg.addColorStop(.72, css(T.blush, 0)); lg.addColorStop(1, css(T.blush, .55)); fillR(g, b, lg); }
    const tp = A.at(A.L - A.ht * .9, A.ht * .25); radial(g, b, tp[0], tp[1], A.ht * 1.1, T.light, .4);    // the tip pad, round and full
    const kp = A.at(5, -A.hw * .5); radial(g, b, kp[0], kp[1], A.hw * .55, T.light, .18);               // the knuckle catches a little light
    g.restore();
    edgeShade(g, F.path, 5, .45);
    engrave(c, b, F.path, Math.atan2(A.uy, A.ux) + Math.PI / 2 + .25, 2.1, (h) => { const p0 = A.at(0, -A.hw), p1 = A.at(0, A.hw), lg = h.createLinearGradient(p0[0], p0[1], p1[0], p1[1]); lg.addColorStop(.35, 'rgba(255,255,255,0)'); lg.addColorStop(1, '#fff'); h.fillStyle = lg; h.fillRect(b.x, b.y, b.w, b.h); }, .45, 11 + F.i);
    grain(c, b, F.path, .5, 20 + F.i);
    for (const cr of F.creases) crease(g, cr, .9);
    // the nail sliver: a little lighter and cooler, a hard dark line where it meets the skin, one glint
    const NP = toPath(F.nail); g.fillStyle = css(T.nail, .9); g.fill(NP); g.strokeStyle = css(T.deep, .55); g.lineWidth = .5; g.stroke(NP);
    { const a0 = A.at(A.L - F.ax.ht * 1.5, -A.ht * .9), a1 = A.at(A.L - A.ht * .5, -A.ht * .78); g.strokeStyle = css(T.hi, .45); g.lineWidth = .6; g.beginPath(); g.moveTo(a0[0], a0[1]); g.lineTo(a1[0], a1[1]); g.stroke(); }
    return c;
  };
  const paintThumb = (Th) => {
    const b = Th.box, [c, g] = mk(b);
    g.fillStyle = css(T.mid); g.fill(Th.path);
    g.save(); g.clip(Th.path);
    { const lg = g.createLinearGradient(62, 0, 116, 0); lg.addColorStop(0, css(T.light, .75)); lg.addColorStop(.4, css(T.light, .05)); lg.addColorStop(.65, css(T.deep, .05)); lg.addColorStop(1, css(T.deep, .7)); fillR(g, b, lg); }
    radial(g, b, 76, 22, 22, T.light, .45, .8, 1.3);     // the pad of the distal segment
    radial(g, b, 80, 92, 26, T.light, .3, .8, 1.5, -.2); // the proximal segment
    radial(g, b, 78, 2, 18, T.blush, .5);               // the tip, thin skin over the display
    radial(g, b, 106, 56, 12, T.deep, .3);              // the joint folds in
    g.restore();
    edgeShade(g, Th.path, 7, .55);
    engrave(c, b, Th.path, .32, 2.2, (h) => { const lg = h.createLinearGradient(70, 0, 116, 0); lg.addColorStop(.3, 'rgba(255,255,255,0)'); lg.addColorStop(1, '#fff'); h.fillStyle = lg; h.fillRect(b.x, b.y, b.w, b.h); }, .45, 17);
    grain(c, b, Th.path, .5, 31);
    for (const cr of Th.creases) crease(g, cr);
    const NP = toPath(Th.nail); g.fillStyle = css(T.nail, .85); g.fill(NP);
    g.save(); g.clip(NP); radial(g, b, 92, 2, 12, T.hi, .3); { const lg = g.createLinearGradient(0, -4, 0, 30); lg.addColorStop(0, css(T.hi, .2)); lg.addColorStop(.7, css(T.nail, 0)); lg.addColorStop(1, css(T.blush, .35)); g.fillStyle = lg; g.fillRect(80, -8, 30, 42); } g.restore();
    g.strokeStyle = css(T.deep, .6); g.lineWidth = .6; g.stroke(NP);
    g.strokeStyle = css(T.deep, .45); g.lineWidth = .8; g.beginPath(); g.moveTo(93, 27.5); g.quadraticCurveTo(98, 33.5, 102.5, 28.5); g.stroke();   // the cuticle fold
    g.strokeStyle = css(T.hi, .45); g.lineWidth = .7; g.beginPath(); g.moveTo(97, 2); g.quadraticCurveTo(100.5, 9, 101.2, 20); g.stroke();       // a glint along the nail
    // the root of the thumb melts into the thenar (no seam with the palm sprite)
    id(g); g.globalCompositeOperation = 'destination-in'; unit(g, b); { const lg = g.createLinearGradient(120, 160, 108, 128); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(1, '#fff'); g.fillStyle = lg; fillR(g, b, lg); } g.globalCompositeOperation = 'source-over';
    return c;
  };
  const fingerC = G.fingers.map(paintFinger), thumbC = paintThumb(G.thumb);

  // ---- light layers (white masks, tinted when drawn): cool rim on the outer contour of the whole hand, warm display light ----
  const WB = HB, wmask = (path) => maskOf(path, WB);
  const [uc, ux] = mk(WB); ux.fillStyle = '#fff'; ux.fill(PP); ux.fill(G.palm.roots); if (sleeve) ux.fill(G.cuff.path); ux.fill(G.thumb.path); for (const F of G.fingers) ux.fill(F.path);
  const rimOf = (mask, w) => { const [c, g] = canvas(mask.width, mask.height); g.drawImage(mask, 0, 0); g.globalCompositeOperation = 'destination-out'; const [e, ex] = canvas(mask.width, mask.height); ex.drawImage(mask, 0, 0); ex.globalCompositeOperation = 'destination-in'; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; ex.drawImage(mask, Math.cos(a) * w * k, Math.sin(a) * w * k); } g.drawImage(e, 0, 0); return c; };
  const cool = (() => { const r = rimOf(uc, 2.1), [c, g] = canvas(r.width, r.height); g.filter = `blur(${.5 * k}px)`; g.drawImage(r, 0, 0); g.filter = 'none'; return c; })();
  { const g = cool.getContext('2d'); g.globalCompositeOperation = 'destination-in'; unit(g, WB); const rg = g.createRadialGradient(5, 30, 80, 5, 30, 190); rg.addColorStop(0, 'rgba(255,255,255,0)'); rg.addColorStop(1, '#fff'); g.fillStyle = rg; fillR(g, WB, rg);
    const lg = g.createLinearGradient(0, 150, 0, 300); lg.addColorStop(0, '#fff'); lg.addColorStop(1, 'rgba(255,255,255,.2)'); g.fillStyle = lg; fillR(g, WB, lg); id(g); g.globalCompositeOperation = 'source-over'; }
  // cut a world layer into a sprite's box (only where that sprite is the visible one)
  const cut = (src, b, keep, drop = []) => { const [c, g] = canvas(Math.ceil(b.w * k), Math.ceil(b.h * k)); g.drawImage(src, (WB.x - b.x) * k, (WB.y - b.y) * k); const [m, mg] = mk(b); mg.fillStyle = '#fff'; for (const q of [].concat(keep)) mg.fill(q); g.globalCompositeOperation = 'destination-in'; g.drawImage(m, 0, 0); g.globalCompositeOperation = 'destination-out'; unit(g, b); for (const p of drop) g.fill(p); id(g); g.globalCompositeOperation = 'source-over'; return c; };
  // warm: the display light. A thin translucent rim on the side of each digit that faces the glass, a soft glow, a spill on the palm.
  const dirRim = (path, b, w, d) => { const m = maskOf(path, b), [c, g] = canvas(m.width, m.height); g.drawImage(m, 0, 0); g.globalCompositeOperation = 'destination-out'; g.drawImage(m, -d[0] * w * k, -d[1] * w * k); return c; };
  const glowOf = (core, b, path, extra) => { const [c, g] = canvas(core.width, core.height); g.filter = `blur(${4 * k}px)`; g.drawImage(core, 0, 0); g.filter = 'none'; unit(g, b); g.save(); g.clip(path); extra(g); g.restore(); id(g); stipple(c, { k: .5, g: 1.1, seed: 7 }); return c; };
  const tintC = (src, col) => { const [c, g] = canvas(src.width, src.height); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); return c; };
  const sprite = (base, b, path, warmCore, warmGlow, coolRim, pivot) => ({ base, b, mask: maskOf(path, b), warmCore: warmCore && tintC(warmCore, '#ffd6a8'), warmGlow: warmGlow && tintC(warmGlow, '#ff9550'), cool: coolRim, pivot, tints: {} });
  const S = [];
  // palm: spill of display light just below the phone, on the hypothenar beside the edge
  const palmWarm = (() => { const [c, g] = mk(PB); g.save(); g.clip(PP); radial(g, PB, 4, 156, 92, [255, 255, 255], .5, 1, .42); radial(g, PB, -80, 120, 26, [255, 255, 255], .25); g.restore(); id(g); stipple(c, { k: .5, g: 1.1, seed: 4 }); return c; })();
  const fingerDrop = (i) => G.fingers.filter((F) => F.i > i).map((F) => F.path).concat([G.thumb.path]);   // later sprites cover earlier ones
  S.push({ ...sprite(pc, PB, PP, null, null, cut(cool, PB, [PP, G.palm.roots], [G.thumb.path, ...G.fingers.map((F) => F.path)]), null), mask: palmMask, warmBack: tintC(palmWarm, '#ff8a48'), id: 'palm' });
  for (const F of G.fingers) {
    const core = dirRim(F.path, F.box, 3.8, [F.ax.ux, F.ax.uy]);
    { const g = core.getContext('2d'); g.globalCompositeOperation = 'destination-in'; unit(g, F.box); const p0 = F.ax.at(F.ax.L - 26, 0), p1 = F.ax.at(F.ax.L - 4, 0), lg = g.createLinearGradient(p0[0], p0[1], p1[0], p1[1]); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(1, '#fff'); fillR(g, F.box, lg); id(g); g.globalCompositeOperation = 'source-over'; }
    const glow = glowOf(core, F.box, F.path, (g) => { const p = F.ax.at(F.ax.L - 6, 0); radial(g, F.box, p[0], p[1], 20, [255, 255, 255], .22); });
    S.push({ ...sprite(fingerC[F.i], F.box, F.path, core, glow, cut(cool, F.box, F.path, fingerDrop(F.i)), F.pivot), id: 'f' + F.i });
  }
  { const Th = G.thumb, core = dirRim(Th.path, Th.box, 3.4, [-.96, -.28]);
    { const g = core.getContext('2d'); g.globalCompositeOperation = 'destination-in'; unit(g, Th.box); const lg = g.createLinearGradient(70, -8, 92, 130); lg.addColorStop(0, '#fff'); lg.addColorStop(.6, 'rgba(255,255,255,.5)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); fillR(g, Th.box, lg); id(g); g.globalCompositeOperation = 'source-over'; }
    const glow = glowOf(core, Th.box, Th.path, (g) => { radial(g, Th.box, 72, 8, 24, [255, 255, 255], .28); });
    const tc = cut(cool, Th.box, Th.path); { const g = tc.getContext('2d'); g.globalCompositeOperation = 'destination-in'; g.drawImage(thumbC, 0, 0); g.globalCompositeOperation = 'source-over'; }
    S.push({ ...sprite(thumbC, Th.box, Th.path, core, glow, tc, Th.pivot), id: 'thumb' });
    const m = S[S.length - 1].mask, g = m.getContext('2d'); id(g); g.globalCompositeOperation = 'destination-in'; g.drawImage(thumbC, 0, 0); g.globalCompositeOperation = 'source-over'; }   // the dimming follows the faded root
  const L = { k, S, tones: T };
  HAND.set(key, L); return L;
}
function tinted(L, sp, which, col) { const kk = which + col; if (sp.tints[kk]) return sp.tints[kk]; const src = sp[which], [c, g] = canvas(src.width, src.height); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); sp.tints[kk] = c; return c; }

// the hand's own life: grip shifts, a thumb lift every few seconds, a squeeze with each buzz and a settle after it
function handMotion(t, buzzes, seed) {
  let sq = 0, st = 0, busy = 0;
  for (const b0 of buzzes) { const u = t - b0; busy = Math.max(busy, clamp((u + .5) / .3) * clamp((2.2 - u) / .6)); if (u <= 0 || u > 4) continue;
    sq += u < .16 ? sm(u / .16) : Math.exp(-(u - .16) * 2.6) * Math.cos((u - .16) * 5.2); if (u > .5) st += Math.exp(-(u - .5) * 2.2) * Math.sin((u - .5) * 7.5); }
  const fingers = [0, 1, 2, 3].map((i) => { const ph = seed + i * 1.73;
    return { dx: .55 * Math.sin(t * .83 + ph) + .25 * Math.sin(t * 2.1 + ph * 2.3) + 1.6 * sq * (1 - i * .15), dy: .4 * Math.sin(t * .57 + ph * 1.3) + .4 * sq, rot: .008 * Math.sin(t * .71 + ph * .7) + .012 * sq }; });
  const cyc = (t + seed * .26) / 3.4, n = Math.floor(cyc), f = cyc - n, amp = .55 + .45 * hashf(n + seed * 13), q = clamp((f - .5) / .42);
  const lift = (q > 0 && q < 1 ? Math.pow(Math.sin(Math.PI * Math.pow(q, .8)), 2) * amp : 0) * (1 - busy);   // never while it buzzes
  const thumb = { rot: .01 * Math.sin(t * .47 + seed) + .05 * lift - .025 * sq, dx: .5 * Math.sin(t * .63 + seed * 2) + 1.2 * lift, dy: -.6 * lift, sc: 1 + .015 * lift };
  return { fingers, thumb, settle: st };
}

export function heldPhone(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, pitch = o.pitch ?? .22, cp = Math.cos(pitch);
  const buzzes = o.buzz == null ? [] : [].concat(o.buzz);
  let jx = 0, jy = 0; for (const b0 of buzzes) { const [dx, dy] = buzzOffset(t, b0); jx += dx; jy += dy; }
  const lit = o.lit ?? (buzzes.length ? Math.max(...buzzes.map((b0) => sm(lin(b0, b0 + .25, t)))) : 1);
  const skin = o.skin || '#b98261', sleeve = sleeveOf(o), seed = (o.seed ?? 0) + (parseInt(skin.slice(1), 16) % 997) * .013;
  const k = Math.max(1, Math.round(s * 10) / 10), L = handLayers(k, skin, sleeve || '');
  const M = handMotion(t, buzzes, seed);
  const ang = (o.ang ?? -.1) + .006 * M.settle, px = x + jx * s, py = y + (jy + .8 * M.settle) * s;
  const rimCol = o.rim === undefined ? '#dfe6f2' : o.rim, rimA = o.rimA ?? .6, warm = (o.warm ?? 1) * lit, dim = .5 * (1 - clamp(lit));
  ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.scale(s, s * cp);   // the tilt foreshortens the phone a little
  const draw = (sp, mo) => {
    ctx.save();
    if (mo) { const [qx, qy] = sp.pivot; ctx.translate(qx + mo.dx, qy + mo.dy); ctx.rotate(mo.rot); if (mo.sc) ctx.scale(mo.sc, mo.sc); ctx.translate(-qx, -qy); }
    ctx.translate(sp.b.x, sp.b.y); ctx.scale(1 / k, 1 / k);
    ctx.drawImage(sp.base, 0, 0);
    if (dim > .01) { ctx.globalAlpha = dim; ctx.drawImage(tinted(L, sp, 'mask', '#04050b'), 0, 0); }
    if (rimCol && rimA > 0 && sp.cool) { ctx.globalAlpha = rimA; ctx.drawImage(tinted(L, sp, 'cool', rimCol), 0, 0); }
    if (warm > .005) { ctx.globalCompositeOperation = 'lighter';
      if (sp.warmBack) { ctx.globalAlpha = .55 * warm; ctx.drawImage(sp.warmBack, 0, 0); }
      if (sp.warmGlow) { ctx.globalAlpha = .75 * warm; ctx.drawImage(sp.warmGlow, 0, 0); }
      if (sp.warmCore) { ctx.globalAlpha = .7 * warm; ctx.drawImage(sp.warmCore, 0, 0); } }
    ctx.restore();
  };
  draw(L.S[0], null);
  const screen = o.screen || ((g, w, h, tt) => lockScreen(g, w, h, tt, { lit, ...(o.lock || {}) }));
  phone(ctx, 0, 0, 1, { t, lit, glow: 0, held: true, screen, body: o.body || '#101219' });
  for (let i = 1; i <= 4; i++) draw(L.S[i], M.fingers[i - 1]);
  draw(L.S[5], M.thumb);
  ctx.restore();
  const map = (X, Y) => { const u = X, v = Y * cp, c = Math.cos(ang), sn = Math.sin(ang); return [px + (u * c - v * sn) * s, py + (u * sn + v * c) * s]; };
  return { x: px, y: py, ang, s, map, w0: 75 * s, h0: 155 * s * cp, lit };
}
