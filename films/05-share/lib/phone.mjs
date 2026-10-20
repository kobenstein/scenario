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
//   heldPhone(ctx, x, y, s, o)  POV close-up: your hand holds the phone (fingertips over the left edge, thumb on the right edge,
//          palm heel below), the phone tilted slightly back (foreshortened), lit only by its display (hand layers cached per scale).
//          o: { t, buzz, ang (roll), pitch (.22), skin ('#b98261'), lit (0..1, default from buzz), lock (lockScreen options) or
//               screen(g, w, h, t), warm (0..1 display light on the fingers), rim ('#e9e4d8' cool light from the rings on the outer
//               contour, null = none), rimA (.55) }
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
// Right hand, seen by its owner (phone units: phone 150 × 310, centred). The fingertips curl over the left edge (nails up),
// the finger bodies show end-on beside the edge, the little finger rests under the bottom corner, the thumb lies along the
// right edge with its tip on the display margin, the palm heel and the thenar fill the space below. In the dark the hand is
// a warm silhouette: the display backlights thumb and fingertips (a translucent orange rim where the skin is thin), the
// rings rim the outer contour in cool light.
const TIPS = [4, 44, 82];   // fingertip rows on the left edge (index, middle, ring)
function spline(P, n = 10) {   // Catmull-Rom through the points
  const out = [];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t, f = (a, b, c, d) => .5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3); out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]); }
  }
  out.push(P[P.length - 1]); return out;
}
// outline of a limb around centreline C with widths Wd (flat at the base, round cap at the tip) → appended to `path`
function limb(path, C, Wd) {
  const S = spline(C, 12), n = S.length, half = (i) => { const u = i / (n - 1) * (Wd.length - 1), k = Math.min(Wd.length - 2, Math.floor(u)); return mix(Wd[k], Wd[k + 1], u - k) / 2; };
  const L = [], R = [];
  for (let i = 0; i < n; i++) { const a = S[Math.max(0, i - 1)], b = S[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, nx = -dy / m, ny = dx / m, w = half(i); L.push([S[i][0] + nx * w, S[i][1] + ny * w]); R.push([S[i][0] - nx * w, S[i][1] - ny * w]); }
  const e = S[n - 1], d = S[n - 2], ang = Math.atan2(e[1] - d[1], e[0] - d[0]), w = half(n - 1);
  path.moveTo(L[0][0], L[0][1]); for (const p of L) path.lineTo(p[0], p[1]);
  for (let k = 1; k < 14; k++) { const a = ang + Math.PI / 2 - k / 14 * Math.PI; path.lineTo(e[0] + Math.cos(a) * w, e[1] + Math.sin(a) * w); }
  for (let i = n - 1; i >= 0; i--) path.lineTo(R[i][0], R[i][1]);
  path.closePath();
  return { tip: e, dir: ang, w };
}
function handShapes() {
  const back = new Path2D(), front = new Path2D(), thumb = new Path2D(), tips = new Path2D(), nails = [];
  // palm heel, hypothenar (left) and thenar (right) below the phone; the part behind the phone is hidden anyway
  back.moveTo(-40, 146); back.bezierCurveTo(-64, 178, -62, 226, -38, 262); back.bezierCurveTo(-20, 290, -2, 318, 14, 350); back.lineTo(44, 440); back.lineTo(196, 440); back.lineTo(160, 340);
  back.bezierCurveTo(158, 300, 164, 262, 160, 226); back.bezierCurveTo(156, 194, 144, 168, 128, 150); back.lineTo(100, 118); back.lineTo(0, 118); back.closePath();
  // finger bodies beside the left edge (end-on), little finger under the bottom corner
  for (const yc of TIPS) limb(back, [[-60, yc + 36], [-86, yc + 22], [-95, yc + 4], [-84, yc - 8], [-64, yc - 12]], [36, 37, 34, 30, 27]);
  limb(back, [[-2, 196], [-36, 188], [-60, 176], [-74, 158]], [33, 31, 28, 24]);
  // front: fingertips over the bezel, the thumb along the right edge
  for (const yc of TIPS) { const r = limb(tips, [[-86, yc - 4], [-76, yc - 9], [-63, yc - 12]], [30, 28.5, 27]); nails.push([r.tip[0] - Math.cos(r.dir) * 6.5, r.tip[1] - Math.sin(r.dir) * 6.5, 8.6, 6.6, r.dir]); }
  const T = limb(thumb, [[160, 268], [146, 226], [126, 164], [102, 112], [82, 74], [67, 46]], [60, 58, 52, 46, 40, 34]);
  nails.push([T.tip[0] - Math.cos(T.dir) * 9, T.tip[1] - Math.sin(T.dir) * 9, 12.5, 10, T.dir]);
  for (const yc of TIPS) limb(front, [[-86, yc - 4], [-76, yc - 9], [-63, yc - 12]], [30, 28.5, 27]);
  limb(front, [[160, 268], [146, 226], [126, 164], [102, 112], [82, 74], [67, 46]], [60, 58, 52, 46, 40, 34]);
  return { back, front, thumb, tips, nails };
}
const HAND = new Map();
export function _handLayers(k, skin) { return handLayers(k, skin); }
function handLayers(k, skin) {
  const key = k.toFixed(2) + skin; if (HAND.has(key)) return HAND.get(key);
  const X0 = -140, Y0 = -190, WU = 320, HU = 560, S = handShapes();
  const cw = Math.ceil(WU * k), ch = Math.ceil(HU * k);
  const mk = () => { const [c, g] = canvas(cw, ch); g.setTransform(k, 0, 0, k, -X0 * k, -Y0 * k); return [c, g]; };
  const id = (g) => g.setTransform(1, 0, 0, 1, 0, 0), unit = (g) => g.setTransform(k, 0, 0, k, -X0 * k, -Y0 * k);
  const deep = shadeHex(skin, -.74), dark = shadeHex(skin, -.62), mid = shadeHex(skin, -.42);
  // body: dark warm skin, the form in soft light and engraved hatch
  const body = (path, front) => {
    const [c, g] = mk();
    g.fillStyle = front ? dark : deep; g.fill(path);
    g.save(); g.clip(path);
    if (!front) { // palm heel: thenar and hypothenar mounds catch a little light, the hollow between them stays dark
      for (const [x, y, r, a] of [[118, 214, 70, .5], [-34, 214, 52, .35], [40, 300, 90, .25]]) { const rg = g.createRadialGradient(x, y - 12, 0, x, y, r); rg.addColorStop(0, rgba(mid.startsWith('rgb') ? '#7a5240' : mid, a)); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(X0, Y0, WU, HU); }
      for (const yc of TIPS) { const rg = g.createRadialGradient(-92, yc, 0, -90, yc + 6, 22); rg.addColorStop(0, 'rgba(122,82,64,.45)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(X0, Y0, WU, HU); }
    } else { const rg = g.createRadialGradient(100, 110, 0, 100, 110, 110); rg.addColorStop(0, 'rgba(122,82,64,.4)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(X0, Y0, WU, HU); }
    if (!front) { const dg = g.createLinearGradient(0, 230, 40, 380); dg.addColorStop(0, 'rgba(4,3,8,0)'); dg.addColorStop(1, 'rgba(4,3,8,.75)'); g.fillStyle = dg; g.fillRect(X0, Y0, WU, HU); }
    artHatch(g, [X0, Y0, WU, HU], { angle: front ? -1.05 : -.55, gap: 2.4, w: .42, col: '#0c0607', a: front ? .32 : .5, wobble: .4, seed: front ? 3 : 5, broken: .35 });
    g.restore();
    return [c, g];
  };
  const [bc, bg] = body(S.back, false);
  // palm creases and the knuckle folds of the finger bodies
  bg.save(); bg.clip(S.back); bg.strokeStyle = 'rgba(8,4,4,.6)'; bg.lineWidth = .9; bg.lineCap = 'round';
  bg.beginPath(); bg.moveTo(-24, 182); bg.bezierCurveTo(10, 196, 50, 200, 84, 186); bg.stroke();
  bg.beginPath(); bg.moveTo(96, 168); bg.bezierCurveTo(78, 214, 72, 252, 76, 296); bg.stroke();
  for (const yc of TIPS) { bg.beginPath(); bg.moveTo(-104, yc + 10); bg.quadraticCurveTo(-98, yc + 1, -88, yc - 1); bg.stroke(); }
  bg.restore();
  const [fc, fx] = body(S.front, true);
  for (const [nx, ny, rx, ry, a] of S.nails) { fx.save(); fx.translate(nx, ny); fx.rotate(a); fx.fillStyle = shadeHex(skin, -.5); fx.beginPath(); fx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); fx.fill(); fx.strokeStyle = 'rgba(10,4,4,.55)'; fx.lineWidth = .7; fx.stroke(); fx.strokeStyle = 'rgba(255,230,210,.22)'; fx.lineWidth = .9; fx.beginPath(); fx.ellipse(rx * .1, -ry * .2, rx * .6, ry * .55, 0, 3.4, 5.4); fx.stroke(); fx.restore(); }
  fx.save(); fx.clip(S.thumb); fx.strokeStyle = 'rgba(8,4,4,.55)'; fx.lineWidth = .9; fx.beginPath(); fx.moveTo(90, 96); fx.quadraticCurveTo(100, 88, 114, 94); fx.stroke(); fx.restore();
  // the thumb grows out of the thenar: fade its base so the two layers meet without a seam
  { id(fx); fx.globalCompositeOperation = 'destination-in'; unit(fx); const lg = fx.createLinearGradient(150, 240, 128, 180); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(255,255,255,1)'); fx.fillStyle = lg; fx.fillRect(X0, Y0, WU, HU); fx.globalCompositeOperation = 'source-over'; }
  // rims are raster operations on masks (union outlines, no seams between overlapping parts)
  const maskOf = (path) => { const [c, g] = mk(); g.fillStyle = '#fff'; g.fill(path); return c; };
  const rim = (mask, w, dir) => {   // dir = [dx, dy] toward the light: rim on that side; null: the whole outline
    const [c, g] = canvas(cw, ch); g.drawImage(mask, 0, 0); g.globalCompositeOperation = 'destination-out';
    if (dir) g.drawImage(mask, -dir[0] * w * k, -dir[1] * w * k);
    else { const [e, ex] = canvas(cw, ch); ex.drawImage(mask, 0, 0); ex.globalCompositeOperation = 'destination-in'; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; ex.drawImage(mask, Math.cos(a) * w * k, Math.sin(a) * w * k); } g.drawImage(e, 0, 0); }
    return c;
  };
  const masked = (c, paint) => { const g = c.getContext('2d'); g.globalCompositeOperation = 'destination-in'; unit(g); paint(g); id(g); g.globalCompositeOperation = 'source-over'; return c; };
  const radial = (x, y, r0, r1, a0, a1) => (g) => { const rg = g.createRadialGradient(x, y, r0, x, y, r1); rg.addColorStop(0, `rgba(255,255,255,${a0})`); rg.addColorStop(1, `rgba(255,255,255,${a1})`); g.fillStyle = rg; g.fillRect(X0, Y0, WU, HU); };
  const mBack = maskOf(S.back), mThumb = maskOf(S.thumb), mTips = maskOf(S.tips), mFront = maskOf(S.front);
  // cool rim (the rings' light) on the outer contour of the whole hand (union: no seams where the thumb meets the palm),
  // split into the part on the back shapes (under the phone) and the part on the front shapes (over it)
  const [mu, mux] = canvas(cw, ch); mux.drawImage(mBack, 0, 0); mux.drawImage(mThumb, 0, 0); mux.drawImage(mTips, 0, 0);
  const coolAll = masked(rim(mu, 2.4, null), radial(10, 40, 95, 175, 0, 1));
  const part = (m) => { const [c, g] = canvas(cw, ch); g.drawImage(coolAll, 0, 0); g.globalCompositeOperation = 'destination-in'; g.drawImage(m, 0, 0); return c; };
  const coolFront = part(fc), coolBack = (() => { const [c, g] = canvas(cw, ch); g.drawImage(coolAll, 0, 0); g.globalCompositeOperation = 'destination-out'; g.drawImage(fc, 0, 0); return c; })();
  // warm display light: a translucent rim where thumb and fingertips lie on the glass, soft glow, a little spill
  const wT = rim(mThumb, 3.4, [-.95, -.3]), wF = rim(mTips, 3.6, [1, .15]);
  masked(wT, (g) => { const lg = g.createLinearGradient(67, 46, 126, 186); lg.addColorStop(0, '#fff'); lg.addColorStop(.6, 'rgba(255,255,255,.55)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = lg; g.fillRect(X0, Y0, WU, HU); });
  const [wc2, wx2] = canvas(cw, ch); wx2.drawImage(wT, 0, 0); wx2.drawImage(wF, 0, 0);
  const [gc, gx] = canvas(cw, ch); gx.filter = 'blur(6px)'; gx.drawImage(wc2, 0, 0); gx.filter = 'none';
  unit(gx); gx.save(); gx.clip(S.front); for (const [x, y, r, a] of [[-60, TIPS[0] - 12, 22, .2], [-60, TIPS[1] - 12, 22, .2], [-60, TIPS[2] - 12, 22, .18], [63, 40, 24, .25]]) { const rg = gx.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(255,255,255,${a})`); rg.addColorStop(1, 'rgba(255,255,255,0)'); gx.fillStyle = rg; gx.fillRect(X0, Y0, WU, HU); } gx.restore();
  id(gx); stipple(gc, { k: .5, g: 1.1, seed: 7 });
  const [warmBack] = canvas(cw, ch);
  { const g = warmBack.getContext('2d'); unit(g); g.save(); g.clip(S.back); const lg = g.createLinearGradient(0, 152, 0, 196); lg.addColorStop(0, 'rgba(255,255,255,.5)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = lg; g.fillRect(-90, 140, 260, 70);
    for (const yc of TIPS) { const rg = g.createRadialGradient(-78, yc + 2, 0, -78, yc + 2, 22); rg.addColorStop(0, 'rgba(255,255,255,.35)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fillRect(X0, Y0, WU, HU); } g.restore(); id(g); }
  const warmFront = gc;
  const tint = (src, col) => { const [c, g] = canvas(cw, ch); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, cw, ch); return c; };
  const L = { k, X0, Y0, WU, HU, back: bc, front: fc, coolBack, coolFront, warmFront: tint(warmFront, '#ff9550'), warmCore: tint(wc2, '#ffd6a8'), warmBack: tint(warmBack, '#ff8a48'), tint };
  HAND.set(key, L); return L;
}
function shadeHex(hex, d) { const n = parseInt(hex.slice(1), 16), f = (v) => Math.round(clamp(v * (1 + d), 0, 255)); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }
function tinted(L, which, col, key) {   // a coloured copy of a white rim layer (cached)
  const kk = which + col; if (L[kk]) return L[kk];
  const src = L[which], [c, g] = canvas(src.width, src.height); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); L[kk] = c; return c;
}
export function heldPhone(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, pitch = o.pitch ?? .22, cp = Math.cos(pitch), ang = o.ang ?? -.1;
  const buzzes = o.buzz == null ? [] : [].concat(o.buzz);
  let jx = 0, jy = 0; for (const b0 of buzzes) { const [dx, dy] = buzzOffset(t, b0); jx += dx; jy += dy; }
  const lit = o.lit ?? (buzzes.length ? Math.max(...buzzes.map((b0) => sm(lin(b0, b0 + .25, t)))) : 1);
  const k = Math.max(1, Math.round(s * 10) / 10), L = handLayers(k, o.skin || '#b98261');
  // static layers pre-composited once per rim colour (drawing a canvas costs ~1 ms per megapixel; never use the 9-argument
  // drawImage with a source rectangle on a canvas: napi copies the whole source for every call)
  const rimCol = o.rim === undefined ? '#dfe6f2' : o.rim, rimA = o.rimA ?? .6, ck = 'c' + rimCol + rimA;
  if (!L[ck]) {
    const comp = (base, rimL) => { const [c, g] = canvas(base.width, base.height); g.drawImage(base, 0, 0); if (rimCol) { g.globalAlpha = rimA; g.drawImage(L.tint(rimL, rimCol), 0, 0); } return c; };
    const [w, wg] = canvas(L.warmFront.width, L.warmFront.height); wg.drawImage(L.warmFront, 0, 0); wg.globalCompositeOperation = 'lighter'; wg.globalAlpha = .7; wg.drawImage(L.warmCore, 0, 0);
    L[ck] = { back: comp(L.back, L.coolBack), front: comp(L.front, L.coolFront), warm: w };
  }
  const C = L[ck], px = x + jx * s, py = y + jy * s, warm = (o.warm ?? 1) * lit;
  ctx.save(); ctx.translate(px, py); ctx.rotate(ang); ctx.scale(s, s * cp);   // the tilt foreshortens the phone a little
  const layer = (c, a = 1, op) => { ctx.save(); ctx.scale(1 / k, 1 / k); if (op) ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.drawImage(c, L.X0 * k, L.Y0 * k); ctx.restore(); };
  layer(C.back);
  if (warm > 0) layer(L.warmBack, .7 * warm, 'lighter');
  const screen = o.screen || ((g, w, h, tt) => lockScreen(g, w, h, tt, { lit, ...(o.lock || {}) }));
  phone(ctx, 0, 0, 1, { t, lit, glow: 0, held: true, screen, body: o.body || '#101219' });
  layer(C.front);
  if (warm > 0) layer(C.warm, .85 * warm, 'lighter');
  ctx.restore();
  const map = (X, Y) => { const u = X, v = Y * cp, c = Math.cos(ang), sn = Math.sin(ang); return [px + (u * c - v * sn) * s, py + (u * sn + v * c) * s]; };
  return { x: px, y: py, ang, s, map, w0: 75 * s, h0: 155 * s * cp, lit };
}
