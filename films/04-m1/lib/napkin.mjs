// Paper napkin, owner C1 (H.10); also used by C6 (3.14–3.17, where it turns into the planSheet). First real version by C1.
// napkin(ctx, x, y, s, t, { rot = 0, fold = 0..1, lift = 0, marks = { dot, sprout, fruit } (0..1 drawn-on pen signs), words = 0..1
//   (PLANT · GROW · HARVEST under them), light = 'night' | 'dawn' })   x, y = centre, s = 1 → about 360 × 360 px
//   → { mark(i) → { x, y } (screen centre of sign i: 0 dot, 1 sprout, 2 fruit), corners: [[x, y] × 4] }
//
// Added options (C1): tilt 0..1 (the napkin lies on a knee seen at an angle: squashes it vertically, default 0), arrows true (small pen arrows
//   between the signs, drawn with the sign that follows), ink '#1d2238', glow 0..1 (warm light on the paper, e.g. the display or dawn),
//   pen(i) → { x, y, ang } is also returned: where the pen tip is while sign i (or word i: 3 + i) is being drawn (to put a pen there).
// The paper body (embossed border, quarter-fold creases, fibre, a crumple) is cached per scale + light; signs and words are live strokes.
import { rgba, clamp, mix, prng, canvas, eio } from '../engine.mjs';
import { stipple, vnoise } from './art.mjs';

const CACHE = new Map();
const N = 360;   // napkin units
function body(light, k) {
  const key = light + k.toFixed(2); if (CACHE.has(key)) return CACHE.get(key);
  const S = Math.ceil(N * k + 40), [c, g] = canvas(S, S), r = prng(17), n = vnoise(23);
  g.translate(S / 2, S / 2); g.scale(k, k);
  // outline: soft paper with a slightly wavy, torn-soft edge
  const edge = []; const h = N / 2;
  const side = (x0, y0, x1, y1, seed) => { for (let i = 0; i < 40; i++) { const q = i / 40, j = (n(q * 9 + seed, seed) - .5) * 3.2; edge.push([mix(x0, x1, q) + (y1 - y0 ? j : 0), mix(y0, y1, q) + (x1 - x0 ? j : 0)]); } };
  side(-h, -h, h, -h, 1); side(h, -h, h, h, 2); side(h, h, -h, h, 3); side(-h, h, -h, -h, 4);
  const path = () => { g.beginPath(); edge.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
  // soft shadow under it
  g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 14; g.shadowOffsetY = 6; g.fillStyle = '#000'; path(); g.fill(); g.restore();
  const tone = light === 'dawn' ? ['#fff6e6', '#f1e3c8', '#cdb796'] : ['#f6ead6', '#e6d6bc', '#a8927a'];
  const pg = g.createRadialGradient(-h * .3, -h * .4, 0, 0, 0, h * 1.5); pg.addColorStop(0, tone[0]); pg.addColorStop(.55, tone[1]); pg.addColorStop(1, tone[2]);
  path(); g.fillStyle = pg; g.fill();
  g.save(); path(); g.clip();
  // embossed border: a row of small raised diamonds and a double line (catches the light on one side)
  for (const inset of [16, 24]) { g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 1; g.strokeRect(-h + inset - .6, -h + inset - .6, N - inset * 2, N - inset * 2); g.strokeStyle = 'rgba(90,70,50,.22)'; g.strokeRect(-h + inset + .6, -h + inset + .6, N - inset * 2, N - inset * 2); }
  for (let i = 0; i < 36; i++) for (const sd of [0, 1, 2, 3]) {
    const q = -h + 20 + (i + .5) * (N - 40) / 36, [x, y] = sd === 0 ? [q, -h + 9] : sd === 1 ? [h - 9, q] : sd === 2 ? [q, h - 9] : [-h + 9, q];
    g.fillStyle = 'rgba(255,255,255,.5)'; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x, y - 3); g.lineTo(x + 3, y); g.closePath(); g.fill();
    g.fillStyle = 'rgba(90,70,50,.18)'; g.beginPath(); g.moveTo(x - 3, y); g.lineTo(x, y + 3); g.lineTo(x + 3, y); g.closePath(); g.fill();
  }
  // quarter-fold creases (cached at full strength; the live fold param fades an overlay)
  for (const [ax, ay, bx, by] of [[0, -h, 0, h], [-h, 0, h, 0]]) {
    const lg = g.createLinearGradient(ax === bx ? -6 : 0, ay === by ? -6 : 0, ax === bx ? 6 : 0, ay === by ? 6 : 0);
    lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(.45, 'rgba(80,60,40,.16)'); lg.addColorStop(.55, 'rgba(255,255,255,.35)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = lg; if (ax === bx) g.fillRect(-6, -h, 12, N); else g.fillRect(-h, -6, N, 12);
  }
  // crumple: a few soft facets and fibre
  for (let i = 0; i < 26; i++) { const x = (r() - .5) * N, y = (r() - .5) * N, R = 30 + r() * 70, gg = g.createRadialGradient(x, y, 0, x, y, R), lt = r() < .5; gg.addColorStop(0, lt ? 'rgba(255,255,255,.12)' : 'rgba(90,70,50,.08)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gg; g.fillRect(x - R, y - R, R * 2, R * 2); }
  g.lineCap = 'round'; for (let i = 0; i < 900; i++) { const x = (r() - .5) * N, y = (r() - .5) * N, L = 2 + r() * 9, a0 = r() * 6.28; g.strokeStyle = r() < .5 ? `rgba(255,255,255,${.15 + r() * .2})` : `rgba(110,85,60,${.06 + r() * .1})`; g.lineWidth = .5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a0) * L, y + Math.sin(a0) * L); g.stroke(); }
  g.restore();
  g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .25, g: 1, seed: 5, mid: false, boost: 1 });   // putImageData honours the transform: reset first
  CACHE.set(key, c); if (CACHE.size > 24) CACHE.delete(CACHE.keys().next().value); return c;
}
// the three signs as pen strokes in napkin units (each a list of polylines); drawn on with u 0..1
const SIGN_X = [-112, 0, 112], SIGN_Y = -22;
const circ = (cx, cy, r, a0 = -1.2, sweep = 6.5, n = 40) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + sweep * i / n; p.push([cx + Math.cos(a) * r * (1 + .04 * Math.sin(a * 3)), cy + Math.sin(a) * r]); } return p; };
const SIGNS = [
  [circ(SIGN_X[0], SIGN_Y, 7, 0, 6.6, 18), circ(SIGN_X[0], SIGN_Y, 3, 0, 6.4, 10), [[SIGN_X[0] - 30, SIGN_Y + 26], [SIGN_X[0] + 30, SIGN_Y + 25]]],          // a seed in the ground
  [[[SIGN_X[1] - 2, SIGN_Y + 26], [SIGN_X[1], SIGN_Y + 8], [SIGN_X[1] + 2, SIGN_Y - 8], [SIGN_X[1] + 1, SIGN_Y - 22]],                                             // a sprout: stem, two leaves, ground
    [[SIGN_X[1] + 1, SIGN_Y - 6], [SIGN_X[1] + 10, SIGN_Y - 16], [SIGN_X[1] + 22, SIGN_Y - 18], [SIGN_X[1] + 12, SIGN_Y - 8], [SIGN_X[1] + 1, SIGN_Y - 6]],
    [[SIGN_X[1], SIGN_Y - 2], [SIGN_X[1] - 10, SIGN_Y - 10], [SIGN_X[1] - 20, SIGN_Y - 10], [SIGN_X[1] - 11, SIGN_Y - 3], [SIGN_X[1], SIGN_Y - 2]],
    [[SIGN_X[1] - 30, SIGN_Y + 26], [SIGN_X[1] + 30, SIGN_Y + 27]]],
  [circ(SIGN_X[2], SIGN_Y + 2, 16, -1.6, 6.5, 36), [[SIGN_X[2] + 1, SIGN_Y - 14], [SIGN_X[2] + 3, SIGN_Y - 22]], [[SIGN_X[2] + 3, SIGN_Y - 20], [SIGN_X[2] + 12, SIGN_Y - 27], [SIGN_X[2] + 19, SIGN_Y - 24], [SIGN_X[2] + 10, SIGN_Y - 19], [SIGN_X[2] + 3, SIGN_Y - 20]], [[SIGN_X[2] - 8, SIGN_Y - 3], [SIGN_X[2] - 4, SIGN_Y - 8]]],   // a fruit
];
const ARROWS = [[[-80, SIGN_Y], [-40, SIGN_Y - 2], [-46, SIGN_Y - 8], [-40, SIGN_Y - 2], [-46, SIGN_Y + 4]], [[40, SIGN_Y], [78, SIGN_Y - 2], [72, SIGN_Y - 8], [78, SIGN_Y - 2], [72, SIGN_Y + 4]]];
const WORDS = ['PLANT', 'GROW', 'HARVEST'];
function lens(P) { let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; }
// draw a list of polylines on with u (sequential), pressure-varying width; returns the pen tip
function inkOn(g, lines, u, w, ink, seed) {
  const L = lines.map(lens), tot = L.reduce((a, b) => a + b, 0); let left = tot * clamp(u), tip = null; const r = prng(seed);
  g.strokeStyle = ink; g.lineCap = 'round'; g.lineJoin = 'round';
  for (let k = 0; k < lines.length && left > 0; k++) {
    const P = lines[k]; let acc = 0;
    for (let i = 1; i < P.length && left > 0; i++) {
      const sl = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]), q = Math.min(1, left / (sl || 1));
      const x = mix(P[i - 1][0], P[i][0], q), y = mix(P[i - 1][1], P[i][1], q);
      g.lineWidth = w * (.75 + .5 * r()); g.beginPath(); g.moveTo(P[i - 1][0], P[i - 1][1]); g.lineTo(x, y); g.stroke();
      tip = [x, y, Math.atan2(P[i][1] - P[i - 1][1], P[i][0] - P[i - 1][0])]; left -= sl * q; acc += sl * q;
    }
  }
  return tip;
}
export function napkin(ctx, x, y, s, t, { rot = 0, fold = 0, lift = 0, marks = {}, words = 0, light = 'night', tilt = 0, arrows = true, ink = '#1d2238', glow = 0 } = {}) {
  const k = Math.max(.3, Math.round(s * 10) / 10), B = body(light === 'dawn' ? 'dawn' : 'night', k), sy = 1 - .45 * clamp(tilt);
  const breathe = .004 * Math.sin(t * 1.1);   // the paper never lies perfectly still (knee, wind)
  const c = Math.cos(rot), sn = Math.sin(rot), P = (px, py) => { const X = px * s, Y = py * s * sy; return { x: x + X * c - Y * sn, y: y - lift + X * sn + Y * c }; };
  ctx.save(); ctx.translate(x, y - lift); ctx.rotate(rot + breathe); ctx.scale(1, sy);
  ctx.save(); ctx.scale(s / k, s / k); ctx.drawImage(B, -B.width / 2, -B.height / 2); ctx.restore();
  ctx.scale(s, s);
  if (fold > 0) { ctx.save(); ctx.globalAlpha = .5 * clamp(fold); ctx.fillStyle = 'rgba(70,50,30,.25)'; ctx.fillRect(0, -N / 2, N / 2, N / 2); ctx.restore(); }
  if (glow > 0) { const gg = ctx.createRadialGradient(0, -40, 0, 0, -40, N * .7); gg.addColorStop(0, rgba(light === 'dawn' ? '#ffd08a' : '#ffb35c', .35 * glow)); gg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = gg; ctx.fillRect(-N / 2, -N / 2, N, N); ctx.globalCompositeOperation = 'source-over'; }
  const tips = [];
  const m = [marks.dot ?? 0, marks.sprout ?? 0, marks.fruit ?? 0];
  for (let i = 0; i < 3; i++) {
    let u = clamp(m[i]); if (u <= 0) { tips.push(null); continue; }
    let tip = null;
    if (arrows && i > 0) { const ua = clamp(u * 3); tip = inkOn(ctx, [ARROWS[i - 1]], ua, 1.6, ink, 40 + i); u = clamp((u - .33) / .67); }
    if (u > 0) tip = inkOn(ctx, SIGNS[i], u, 2.2, ink, 10 + i);
    tips.push(tip);
  }
  // the words, lettered under the signs (a reveal from left to right, like being written)
  if (words > 0) {
    ctx.font = '600 18px "Inter"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; try { ctx.letterSpacing = '2px'; } catch { }
    for (let i = 0; i < 3; i++) {
      const u = clamp(words * 3 - i); if (u <= 0) continue; const wd = WORDS[i], tw = ctx.measureText(wd).width;
      ctx.save(); ctx.beginPath(); ctx.rect(SIGN_X[i] - tw / 2 - 4, 20, (tw + 8) * eio(u), 60); ctx.clip(); ctx.translate(SIGN_X[i], 52); ctx.rotate((i - 1) * .02);
      ctx.fillStyle = ink; ctx.globalAlpha = .9; ctx.fillText(wd, 0, 0); ctx.restore();
      if (u < 1) tips.push([SIGN_X[i] - tw / 2 + tw * eio(u), 46, 0]); else tips.push(null);
    }
    try { ctx.letterSpacing = '0px'; } catch { }
  }
  ctx.restore();
  const mark = (i) => P(SIGN_X[i] ?? 0, SIGN_Y);
  const pen = (i) => { const tp = tips[i]; if (!tp) return null; const q = P(tp[0], tp[1]); return { x: q.x, y: q.y, ang: tp[2] + rot }; };
  return { mark, pen, corners: [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => { const p = P(a * N / 2, b * N / 2); return [p.x, p.y]; }) };
}
