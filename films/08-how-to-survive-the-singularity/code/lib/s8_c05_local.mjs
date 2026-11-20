// Film 8 · c05 local pieces (owner B2): the Harvard archive (cut-paper profile cards on a long lamp-lit table), the beach of Taleb's candle
// and driftwood fire, the boat shed of Sarasvathy's founders (lamp, rolled blueprint, driftwood, rope, old sail, the plank stack, the small
// raft), a moon and moonlit sand. World pieces are in metres (s8 camera, +Y up); everything is opaque and lit by one light.
//
//   cardImg(kind)                       a portrait card (canvas 400 × 520): cut-paper silhouette in an oval mount, year, a pencil caption.
//                                       kind 'young' (sepia, 1938) | 'old' (the same man, older) | 'child' (the next generation) | 'a'…'f' (others)
//   archive(ctx, t, C, o)               the long table with rows of cards. o: { cards: [{ x, z, kind, rot }], lamps: [[x, y, z, lv]], lift: {i, u} }
//                                       → { rect(i): screen bbox [x, y, w, h] of card i }
//   oilLamp(ctx, t, C, [x, y, z], lv)   a small oil lamp standing on a surface (brass foot, glass chimney, the flame) → flame screen point
//   sand(ctx, t, C, o)                  moonlit sand landward of a shoreline z = o.shore(x) (default 0), with ripples and the foam line
//   moon(ctx, C, az, el, o)             the moon disc + halo at sky direction (az, el) → screen point | null
//   candleJar(ctx, t, C, [x, y, z], o)  a candle in a glass jar. o: { on 0..1 (1 lit, 0 out: a smoke thread rises), gust 0..1 }
//   driftFire(ctx, t, C, [x, y, z], o)  driftwood logs and a fire. o: { flare 0..1 (it grows), gust 0..1 (flames lean) } → flame base screen point
//   SHED, shed(ctx, t, C, o)            the boat shed (door to the sea at z = SHED.door, facing +Z). o: { lamp 1, sea(ctx, t, C) draws the
//                                       outside in the door opening, items: [fn(ctx, t, C)], gust 0..1 }
//   roll(ctx, t, C, a, b, r, o)         a rolled sheet (blueprint) from world point a to b, radius r
//   logs / raft(ctx, t, C, o)           the small raft: o: { x, z, head, n 4, lash 0..1, mast 0..1, sail 0..1, tear 0..1, rerig 0..1 }
//   planks(ctx, t, C, o)                a tall stack of planks (they stay stacked)
//   coil(ctx, t, C, [x, y, z], R)       a rope coil · sailHeap(ctx, t, C, [x, y, z], s) the old sail folded
import { createCanvas } from '@napi-rs/canvas';
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projPoly, projRuns, fillPoly, mixHex, hash, nz, spline, once, eoX } from './s8_kit.mjs';
import { skyDir } from './s8_sky.mjs';
import { flames } from './s8_canoe.mjs';

const INK = '#2a2420';
const P2 = (P) => (P ? [P[0], P[1]] : null);

// ---------------------------------------------------------------- profiles (cut paper, facing right; unit: chin→crown ≈ 1)
const PROF = {
  young: [[-.3, .58], [-.33, .3], [-.43, .06], [-.42, -.26], [-.24, -.5], [.02, -.6], [.2, -.5], [.31, -.3], [.35, -.12], [.33, -.05], [.45, .07], [.36, .12], [.38, .18], [.34, .22], [.37, .27], [.31, .32], [.33, .41], [.2, .47], [.12, .52], [.12, .66], [.48, .82], [.62, 1.02], [-.62, 1.02], [-.48, .8]],
  old: [[-.3, .56], [-.35, .28], [-.44, .05], [-.41, -.25], [-.25, -.47], [.0, -.53], [.18, -.47], [.3, -.29], [.35, -.12], [.33, -.04], [.48, .1], [.37, .15], [.38, .2], [.33, .23], [.35, .28], [.29, .34], [.31, .42], [.24, .5], [.16, .58], [.16, .7], [.5, .86], [.62, 1.02], [-.62, 1.02], [-.5, .78]],
  child: [[-.24, .5], [-.3, .3], [-.46, .08], [-.48, -.22], [-.34, -.5], [-.06, -.62], [.18, -.55], [.32, -.34], [.36, -.14], [.35, -.06], [.41, .04], [.35, .08], [.36, .14], [.33, .18], [.35, .22], [.3, .27], [.3, .33], [.2, .38], [.12, .42], [.12, .52], [.38, .66], [.48, .82], [-.5, .82], [-.38, .64]],
};
function profile(g, x, y, s, kind, seed) {
  const base = PROF[kind] || PROF[['young', 'old', 'child'][seed % 3]], r = prng(seed + 3);
  const jit = PROF[kind] ? 0 : .02;
  const pts = base.map(([a, b]) => [x + (a + (r() - .5) * jit) * s, y + (b + (r() - .5) * jit) * s]);
  g.beginPath(); spline(g, pts); g.fillStyle = '#16110e'; g.fill();
  // cut-paper edge: a faint lighter rim on the top left (the paper's thickness catching the lamp)
  g.save(); g.clip(); g.strokeStyle = 'rgba(120,96,70,.35)'; g.lineWidth = 2.2; g.beginPath(); spline(g, pts.map(([a, b]) => [a + 1.5, b + 1.5])); g.stroke(); g.restore();
  if (kind === 'young') { g.fillStyle = '#16110e'; g.beginPath(); g.ellipse(x + .02 * s, y - .58 * s, .26 * s, .08 * s, -.15, 0, TAU); g.fill(); }   // the quiff
  if (kind === 'old') { g.strokeStyle = 'rgba(150,140,128,.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + .3 * s, y - .12 * s); g.lineTo(x + .45 * s, y - .12 * s); g.stroke(); }   // spectacles
}
const CARD = { young: { bg: '#c9a46e', year: '1938', tint: 'rgba(120,70,30,.18)' }, old: { bg: '#d8c7a4', year: '1978', tint: 'rgba(60,50,40,.08)' }, child: { bg: '#e6dcc4', year: '2004', tint: 'rgba(0,0,0,0)' } };
export function cardImg(kind) {
  return once('c05card:' + kind, () => {
    const W = 400, H = 520, c = createCanvas(W, H), g = c.getContext('2d'), d = CARD[kind] || { bg: ['#d9c9a6', '#cdb58c', '#e2d6bc'][kind.charCodeAt(0) % 3], year: String(1938 + (kind.charCodeAt(0) - 97) * 9), tint: 'rgba(90,60,30,.1)' };
    const r = prng(kind.charCodeAt(0) * 7 + 1);
    g.fillStyle = d.bg; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${r() < .5 ? '255,250,235' : '70,50,30'},${.05 + r() * .06})`; g.fillRect(r() * W, r() * H, 1 + r() * 3, 1); }   // fibre
    g.fillStyle = d.tint; g.fillRect(0, 0, W, H);
    // the oval mount: cream, a ruled double line
    g.save(); g.beginPath(); g.ellipse(W / 2, H * .43, W * .36, H * .34, 0, 0, TAU); g.fillStyle = '#efe5cd'; g.fill(); g.clip();
    profile(g, W * .47, H * .4, H * .42, kind.length > 1 ? kind : null, kind.charCodeAt(0));
    g.restore();
    g.strokeStyle = 'rgba(60,40,24,.7)'; g.lineWidth = 3; g.beginPath(); g.ellipse(W / 2, H * .43, W * .36, H * .34, 0, 0, TAU); g.stroke();
    g.lineWidth = 1.2; g.beginPath(); g.ellipse(W / 2, H * .43, W * .39, H * .37, 0, 0, TAU); g.stroke();
    // the year and a pencil caption
    g.fillStyle = 'rgba(50,34,22,.85)'; g.font = '600 38px "Instrument Serif"'; g.textAlign = 'center'; g.fillText(d.year, W / 2, H * .9);
    g.strokeStyle = 'rgba(50,40,30,.45)'; g.lineWidth = 2; g.beginPath(); for (let i = 0; i < 6; i++) { const x0 = 70 + i * 46 + r() * 8; g.moveTo(x0, H * .95); g.lineTo(x0 + 28 + r() * 10, H * .95 + (r() - .5) * 3); } g.stroke();
    g.strokeStyle = 'rgba(40,26,16,.6)'; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4);
    return c;
  });
}

// ---------------------------------------------------------------- the archive table
const quad = (ctx, img, P) => {   // image onto 4 projected corners (TL, TR, BR, BL), two affine triangles
  const tri = (s, d) => {
    const [s0, s1, s2] = s, [d0, d1, d2] = d, den = (s1[0] - s0[0]) * (s2[1] - s0[1]) - (s2[0] - s0[0]) * (s1[1] - s0[1]); if (Math.abs(den) < 1e-9) return;
    const a = ((d1[0] - d0[0]) * (s2[1] - s0[1]) - (d2[0] - d0[0]) * (s1[1] - s0[1])) / den, c = ((d2[0] - d0[0]) * (s1[0] - s0[0]) - (d1[0] - d0[0]) * (s2[0] - s0[0])) / den;
    const b = ((d1[1] - d0[1]) * (s2[1] - s0[1]) - (d2[1] - d0[1]) * (s1[1] - s0[1])) / den, dd = ((d2[1] - d0[1]) * (s1[0] - s0[0]) - (d1[1] - d0[1]) * (s2[0] - s0[0])) / den;
    ctx.save(); ctx.beginPath(); const cx = (d0[0] + d1[0] + d2[0]) / 3, cy = (d0[1] + d1[1] + d2[1]) / 3; for (const [i, p] of [d0, d1, d2].entries()) { const l = Math.hypot(p[0] - cx, p[1] - cy) || 1, q = [p[0] + (p[0] - cx) / l * .8, p[1] + (p[1] - cy) / l * .8]; i ? ctx.lineTo(...q) : ctx.moveTo(...q); } ctx.closePath(); ctx.clip();
    ctx.transform(a, b, c, dd, d0[0] - a * s0[0] - c * s0[1], d0[1] - b * s0[0] - dd * s0[1]); ctx.drawImage(img, 0, 0); ctx.restore();
  };
  const w = img.width, h = img.height, S = [[0, 0], [w, 0], [w, h], [0, h]];
  tri([S[0], S[1], S[2]], [P[0], P[1], P[2]]); tri([S[0], S[2], S[3]], [P[0], P[2], P[3]]);
};
export function lightAt(lamps, x, y, z) { let L = 0; for (const [lx, ly, lz, lv = 1] of lamps) { const d = Math.hypot(x - lx, (y - ly) * 1.3, z - lz); L += lv / (1 + d * d * .9); } return Math.min(1.15, L); }
export function archive(ctx, t, C, o = {}) {
  const top = o.top ?? .76, X0 = o.x0 ?? -1.1, X1 = o.x1 ?? 1.1, Z0 = o.z0 ?? -1, Z1 = o.z1 ?? 18, lamps = o.lamps || [];
  // the room is dark; the table: dark wood, lit in pools
  const T4 = projPoly(C, [[X0, top, Z0], [X1, top, Z0], [X1, top, Z1], [X0, top, Z1]]);
  if (fillPoly(ctx, T4, '#120b08')) {
    ctx.save(); fillPoly(ctx, T4); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    for (const [lx, ly, lz, lv = 1] of lamps) { const p = C.P(lx, top, lz); if (!p) continue; const R = Math.min(2600, p[2] * 1.5); const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, rgba('#8a5428', .55 * lv)); g.addColorStop(.35, rgba('#5a3418', .3 * lv)); g.addColorStop(1, rgba('#2a160a', 0)); ctx.fillStyle = g; ctx.fillRect(p[0] - R, p[1] - R, 2 * R, 2 * R); }
    ctx.globalCompositeOperation = 'source-over';
    // grain along the table
    ctx.strokeStyle = 'rgba(10,6,4,.35)'; ctx.lineWidth = 1;
    for (let i = 0; i < 26; i++) { const x = X0 + (X1 - X0) * (i + .5) / 26 + .01 * Math.sin(i * 3.1); const pts = []; for (let k = 0; k <= 40; k++) { const z = Z0 + (Z1 - Z0) * k / 40; pts.push([x + .006 * Math.sin(z * 3 + i), top + .0005, z]); } for (const run of projRuns(C, pts)) { ctx.beginPath(); run.forEach((p, j) => (j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
    ctx.restore();
    // the near edge catches the light
    for (const run of projRuns(C, [[X0, top, Z0], [X1, top, Z0]])) { ctx.strokeStyle = rgba('#c07a44', .4); ctx.lineWidth = 2; ctx.beginPath(); run.forEach((p, j) => (j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  }
  // the cards, far → near
  const out = { rects: [] }, cw = o.cw ?? .15, ch = cw * 1.3;
  const list = (o.cards || []).map((c, i) => ({ c, i, d: C.depth(c.x, top, c.z) })).filter((q) => q.d > .05).sort((a, b) => b.d - a.d);
  for (const { c, i } of list) {
    const rot = c.rot || 0, cr = Math.cos(rot), sr = Math.sin(rot), lift = c.lift || 0, y = top + .002 + lift * .05;
    const at = (u, v) => [c.x + cr * u * cw + sr * v * ch, y + (v + .5) * lift * .06, c.z - sr * u * cw + cr * v * ch];
    const W4 = [at(-.5, .5), at(.5, .5), at(.5, -.5), at(-.5, -.5)].map((p) => C.P(...p, .05));
    if (W4.some((p) => !p)) continue;
    if (Math.max(...W4.map((p) => p[0])) < -50 || Math.min(...W4.map((p) => p[0])) > 1970 || Math.max(...W4.map((p) => p[1])) < -50 || Math.min(...W4.map((p) => p[1])) > 1130) { out.rects[i] = null; continue; }
    // contact shadow
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 10; fillPoly(ctx, W4, '#0a0604'); ctx.restore();
    quad(ctx, cardImg(c.kind), W4);
    const L = lightAt(lamps, c.x, top, c.z) * (c.boost ?? 1), dark = clamp(1 - L * 1.1);
    fillPoly(ctx, W4, `rgba(10,6,4,${.92 * dark})`);
    if (L > .4) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; fillPoly(ctx, W4, `rgba(255,170,90,${.08 * (L - .4)})`); ctx.restore(); }
    // the far edge catches a cool rim (the night window of the archive)
    ctx.strokeStyle = rgba('#8c96c8', .25 + .2 * (1 - dark)); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(W4[3][0], W4[3][1]); ctx.lineTo(W4[2][0], W4[2][1]); ctx.stroke();
    const xs = W4.map((p) => p[0]), ys = W4.map((p) => p[1]);
    out.rects[i] = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
    out[i] = W4;
  }
  for (const lp of lamps) if (lp[4] !== false) out.lamp = oilLamp(ctx, t, C, [lp[0], top, lp[2]], lp[3] ?? 1);
  return out;
}
// a small oil lamp on a surface at world point p (its foot); flame ≈ 22 cm above
export function oilLamp(ctx, t, C, p, lv = 1) {
  const b = C.P(p[0], p[1], p[2]), f = C.P(p[0], p[1] + .22, p[2]); if (!b || !f) return null;
  const k = b[2], fl = lv * (1 + .03 * Math.sin(t * 9.1) + .02 * nz(t * 6, 3));
  ctx.save();
  // brass foot and font
  const bg = ctx.createLinearGradient(b[0] - .07 * k, 0, b[0] + .07 * k, 0); bg.addColorStop(0, '#3a2412'); bg.addColorStop(.35, '#c08a44'); bg.addColorStop(.6, '#7a4e22'); bg.addColorStop(1, '#2a180a');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(b[0], b[1], .06 * k, .018 * k, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(b[0] - .025 * k, b[1]); ctx.lineTo(b[0] - .015 * k, b[1] - .05 * k); ctx.lineTo(b[0] + .015 * k, b[1] - .05 * k); ctx.lineTo(b[0] + .025 * k, b[1]); ctx.fill();
  ctx.beginPath(); ctx.ellipse(b[0], b[1] - .075 * k, .055 * k, .035 * k, 0, 0, TAU); ctx.fill();
  // the glass chimney
  const cy0 = b[1] - .1 * k, cy1 = f[1] - .07 * k;
  ctx.strokeStyle = rgba('#ffe2b0', .35); ctx.lineWidth = Math.max(1, .004 * k);
  ctx.beginPath(); ctx.moveTo(b[0] - .03 * k, cy0); ctx.quadraticCurveTo(b[0] - .05 * k, (cy0 + f[1]) / 2, b[0] - .022 * k, cy1); ctx.moveTo(b[0] + .03 * k, cy0); ctx.quadraticCurveTo(b[0] + .05 * k, (cy0 + f[1]) / 2, b[0] + .022 * k, cy1); ctx.stroke();
  // the flame + glow
  ctx.globalCompositeOperation = 'lighter';
  const R = .9 * k * fl, g = ctx.createRadialGradient(f[0], f[1], 0, f[0], f[1], R); g.addColorStop(0, rgba('#ffd9a0', .55)); g.addColorStop(.12, rgba('#ffb35c', .25)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(f[0] - R, f[1] - R, 2 * R, 2 * R);
  const fh = .05 * k * fl, fw = .013 * k, sway = .004 * k * Math.sin(t * 5.3);
  ctx.fillStyle = rgba('#ffb35c', .9); ctx.beginPath(); ctx.moveTo(f[0] + sway, f[1] - fh); ctx.quadraticCurveTo(f[0] + fw * 1.4, f[1] - fh * .2, f[0], f[1] + fh * .25); ctx.quadraticCurveTo(f[0] - fw * 1.4, f[1] - fh * .2, f[0] + sway, f[1] - fh); ctx.fill();
  ctx.fillStyle = rgba('#fff6e2', .95); ctx.beginPath(); ctx.ellipse(f[0], f[1] - fh * .15, fw * .45, fh * .35, 0, 0, TAU); ctx.fill();
  ctx.restore();
  return [f[0], f[1], k];
}

// ---------------------------------------------------------------- the moonlit beach
export function moon(ctx, C, az, el, o = {}) {
  const p = C.D(...skyDir(az, el)); if (!p) return null;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const R = (o.R ?? 18), g = ctx.createRadialGradient(p[0], p[1], R * .8, p[0], p[1], R * 9); g.addColorStop(0, rgba('#dfe6ff', .35)); g.addColorStop(.3, rgba('#a8b4e8', .1)); g.addColorStop(1, rgba('#a8b4e8', 0)); ctx.fillStyle = g; ctx.fillRect(p[0] - R * 9, p[1] - R * 9, R * 18, R * 18);
  ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#eef0fa'; ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(150,160,190,.35)'; for (const [dx, dy, r] of [[-.3, -.2, .28], [.25, .1, .22], [-.05, .35, .18], [.35, -.3, .12]]) { ctx.beginPath(); ctx.arc(p[0] + dx * R, p[1] + dy * R, r * R, 0, TAU); ctx.fill(); }
  ctx.restore();
  return p;
}
export function sand(ctx, t, C, o = {}) {
  const shore = o.shore || (() => 0), x0 = o.x0 ?? -120, x1 = o.x1 ?? 120, back = o.back ?? -160;
  const wash = (x) => .45 * Math.sin(t * .7 + x * .13) + .25 * Math.sin(t * 1.3 + x * .31);
  const S = []; for (let i = 0; i <= 120; i++) { const x = x0 + (x1 - x0) * i / 120; S.push([x, 0, shore(x) + wash(x)]); }
  const P = projPoly(C, [...S, [x1, 0, back], [x0, 0, back]]);
  if (!fillPoly(ctx, P, '#16142a')) return;
  ctx.save(); fillPoly(ctx, P); ctx.clip();
  const g = ctx.createLinearGradient(0, C.hy, 0, 1080); g.addColorStop(0, 'rgba(70,72,110,.45)'); g.addColorStop(1, 'rgba(20,18,36,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  ctx.strokeStyle = rgba('#b8c2ea', .08); ctx.lineWidth = 1;
  for (let k = 0; k < 40; k++) { const z = -1 - k * 1.1; const pts = []; for (let i = 0; i <= 40; i++) { const x = x0 * .4 + (x1 - x0) * .4 * i / 40; pts.push([x, 0, Math.min(shore(x) - .8, z + .25 * Math.sin(x * .7 + k))]); } for (const run of projRuns(C, pts)) { ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  ctx.restore();
  for (const run of projRuns(C, S.map(([x, , z]) => [x, .01, z - .7]))) { ctx.strokeStyle = 'rgba(8,8,20,.55)'; ctx.lineWidth = 7; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  for (const run of projRuns(C, S.map(([x, , z]) => [x, .02, z]))) { ctx.strokeStyle = rgba('#eef0fa', .55 + .15 * Math.sin(t * 1.2)); ctx.lineWidth = 1.8; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
}
// ---------------------------------------------------------------- Taleb: the candle in a jar and the driftwood fire
export function candleJar(ctx, t, C, p, o = {}) {
  const b = C.P(...p); if (!b) return null; const k = b[2], on = clamp(o.on ?? 1), gust = o.gust || 0;
  const w = .09 * k, h = .2 * k;
  ctx.save();
  // the candle stub
  ctx.fillStyle = '#d8c8a8'; ctx.fillRect(b[0] - w * .35, b[1] - h * .55, w * .7, h * .55);
  ctx.fillStyle = 'rgba(255,240,210,.5)'; ctx.beginPath(); ctx.ellipse(b[0], b[1] - h * .55, w * .35, w * .1, 0, 0, TAU); ctx.fill();
  const fx = b[0] + gust * w * .5, fy = b[1] - h * .6;
  if (on > 0) {
    ctx.globalCompositeOperation = 'lighter';
    const R = 2.2 * h * on, g = ctx.createRadialGradient(fx, fy, 0, fx, fy, R); g.addColorStop(0, rgba('#ffd9a0', .45 * on)); g.addColorStop(.2, rgba('#ffb35c', .18 * on)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(fx - R, fy - R, 2 * R, 2 * R);
    const fh = h * .28 * on * (1 - .5 * gust), fw = w * .12;
    ctx.fillStyle = rgba('#ffb35c', .95); ctx.beginPath(); ctx.moveTo(fx + gust * fh * 1.2, fy - fh); ctx.quadraticCurveTo(fx + fw * 1.5, fy - fh * .2, fx, fy + fh * .2); ctx.quadraticCurveTo(fx - fw * 1.5, fy - fh * .2, fx + gust * fh * 1.2, fy - fh); ctx.fill();
    ctx.fillStyle = rgba('#fff6e2', .95 * on); ctx.beginPath(); ctx.ellipse(fx, fy - fh * .1, fw * .5, fh * .3, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  } else if (o.outT != null) {   // the smoke thread after it went out
    const a = clamp(1 - (t - o.outT) / 2.5); ctx.strokeStyle = rgba('#c8c8d8', .5 * a); ctx.lineWidth = Math.max(1, .006 * k); ctx.beginPath(); ctx.moveTo(b[0], fy);
    for (let i = 1; i <= 14; i++) { const v = i / 14; ctx.lineTo(b[0] + Math.sin(v * 7 + t * 2) * w * .3 * v + gust * v * w, fy - v * h * 1.6 * Math.min(1, (t - o.outT) * 1.5 + .2)); } ctx.stroke();
  }
  // the jar: glass, cool rim highlights, warm inside when lit
  ctx.strokeStyle = rgba(on > .1 ? '#ffd9a0' : '#b8c2ea', .55); ctx.lineWidth = Math.max(1, .005 * k);
  ctx.beginPath(); ctx.moveTo(b[0] - w * .5, b[1] - h); ctx.lineTo(b[0] - w * .5, b[1] - w * .1); ctx.quadraticCurveTo(b[0], b[1] + w * .15, b[0] + w * .5, b[1] - w * .1); ctx.lineTo(b[0] + w * .5, b[1] - h); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(b[0], b[1] - h, w * .5, w * .13, 0, 0, TAU); ctx.stroke();
  ctx.strokeStyle = rgba('#ffffff', .25); ctx.beginPath(); ctx.moveTo(b[0] - w * .32, b[1] - h * .9); ctx.lineTo(b[0] - w * .32, b[1] - h * .2); ctx.stroke();
  ctx.restore();
  return [fx, fy, k];
}
export function driftFire(ctx, t, C, p, o = {}) {
  const b = C.P(...p); if (!b) return null; const k = b[2], flare = o.flare || 0, gust = o.gust || 0;
  // the logs: driftwood, bleached, crossing
  ctx.save(); ctx.lineCap = 'round';
  for (const [a, L, r] of [[.5, .9, .07], [-.45, .85, .065], [1.6, .7, .06], [2.6, .8, .07], [-2.2, .75, .06]]) {
    const ex = Math.cos(a) * L * .5, ez = Math.sin(a) * L * .5;
    const A = C.P(p[0] - ex, p[1] + .05, p[2] - ez), B = C.P(p[0] + ex, p[1] + .12, p[2] + ez); if (!A || !B) continue;
    ctx.strokeStyle = '#2a1c14'; ctx.lineWidth = r * k; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
    ctx.strokeStyle = rgba('#ffb35c', .45); ctx.lineWidth = r * k * .3; ctx.beginPath(); ctx.moveTo(A[0], A[1] - r * k * .3); ctx.lineTo(B[0], B[1] - r * k * .3); ctx.stroke();
  }
  ctx.restore();
  const f = C.P(p[0], p[1] + .12, p[2]); if (!f) return null;
  // glow on the sand and the flames (they lean in the gust, then flare)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const R = (2.6 + 2.2 * flare) * k, g = ctx.createRadialGradient(f[0], f[1], 0, f[0], f[1], R); g.addColorStop(0, rgba('#ffb35c', .4 + .2 * flare)); g.addColorStop(.3, rgba('#ff7a2e', .14)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.fillRect(f[0] - R, f[1] - R, 2 * R, 2 * R);
  ctx.restore();
  ctx.save(); ctx.translate(f[0], f[1]); ctx.transform(1, 0, -.5 * gust, 1, 0, 0); flames(ctx, t, 0, 0, (.55 + .6 * flare) * k); ctx.restore();
  // sparks
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const n = Math.round(10 + 30 * flare);
  for (let i = 0; i < n; i++) { const ph = (t * (.5 + hash(i) * .5) + hash(i * 3)) % 1, x = f[0] + (hash(i * 5) - .5) * .5 * k + Math.sin(ph * 6 + i) * .15 * k + gust * ph * .8 * k, y = f[1] - ph * (1.6 + flare) * k; ctx.fillStyle = rgba('#ffd9a0', .8 * (1 - ph)); ctx.fillRect(x, y, 2, 2); }
  ctx.restore();
  return [f[0], f[1], k];
}

// ---------------------------------------------------------------- the boat shed (door to the sea at z = door, facing +Z)
export const SHED = { x0: -3, x1: 3, back: -12, door: -6, h: 3.1, ridge: 4.3, dx0: -2.1, dx1: 2.1, dh: 2.9, lamp: [0, 2.05, -10.9], bench: { x0: -1.8, x1: 1.8, z0: -11.75, z1: -11.0, y: .92 } };
function litPoly(ctx, C, pts, base, lp, R, a = .6) {
  const P = projPoly(C, pts); if (!fillPoly(ctx, P, base)) return null;
  if (lp) { ctx.save(); fillPoly(ctx, P); ctx.clip(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], R); g.addColorStop(0, rgba('#a8642e', a)); g.addColorStop(.4, rgba('#5a3418', a * .45)); g.addColorStop(1, rgba('#2a160a', 0)); ctx.fillStyle = g; ctx.fillRect(lp[0] - R, lp[1] - R, 2 * R, 2 * R); ctx.restore(); }
  return P;
}
function boards(ctx, C, a, b, n, h0, h1, col) {   // vertical board seams on a wall from a to b
  ctx.strokeStyle = col; ctx.lineWidth = 1;
  for (let i = 1; i < n; i++) { const u = i / n, x = a[0] + (b[0] - a[0]) * u, z = a[2] + (b[2] - a[2]) * u; for (const run of projRuns(C, [[x, h0, z], [x, h1, z]])) { ctx.beginPath(); ctx.moveTo(...run[0]); ctx.lineTo(...run[run.length - 1]); ctx.stroke(); } }
}
export function shed(ctx, t, C, o = {}) {
  const S = SHED, lv = (o.lamp ?? 1) * (1 + .03 * Math.sin(t * 6.1) + .02 * nz(t * 4, 1)), inside = C.z < S.door && C.z > S.back && C.x > S.x0 && C.x < S.x1;
  const LMP = [S.lamp[0] + (o.sway || 0), S.lamp[1] - Math.abs(o.sway || 0) * .15, S.lamp[2]], lp = C.P(...LMP), R = lp ? Math.min(2400, lp[2] * 2.8) * lv : 0;
  const { x0, x1, back, door, h, ridge, dx0, dx1, dh } = S, wallCol = '#0d0806';
  if (inside) {
    ctx.fillStyle = '#07050a'; ctx.fillRect(0, 0, 1920, 1080);
    // the door opening to the sea first (behind everything), then the shell around it
    const D = projPoly(C, [[dx0, 0, door], [dx1, 0, door], [dx1, dh, door], [dx0, dh, door]]);
    if (D.length > 2 && o.sea) { ctx.save(); fillPoly(ctx, D); ctx.clip(); o.sea(ctx, t, C); ctx.restore(); }
    litPoly(ctx, C, [[x0, 0, back], [x1, 0, back], [x1, h, back], [0, ridge, back], [x0, h, back]], wallCol, lp, R);
    boards(ctx, C, [x0, 0, back], [x1, 0, back], 18, 0, h, 'rgba(0,0,0,.7)');
    litPoly(ctx, C, [[x0, 0, back], [x0, 0, door], [x0, h, door], [x0, h, back]], '#0a0605', lp, R, .5);
    litPoly(ctx, C, [[x1, 0, back], [x1, 0, door], [x1, h, door], [x1, h, back]], '#0a0605', lp, R, .5);
    boards(ctx, C, [x0, 0, back], [x0, 0, door], 14, 0, h, 'rgba(0,0,0,.65)'); boards(ctx, C, [x1, 0, back], [x1, 0, door], 14, 0, h, 'rgba(0,0,0,.65)');
    litPoly(ctx, C, [[x0, h, back], [0, ridge, back], [0, ridge, door], [x0, h, door]], '#0b0708', lp, R, .25);
    litPoly(ctx, C, [[x1, h, back], [0, ridge, back], [0, ridge, door], [x1, h, door]], '#0b0708', lp, R, .25);
    // the front wall round the door (seen from inside)
    for (const q of [[[x0, 0, door], [dx0, 0, door], [dx0, dh, door], [x0, h, door]], [[dx1, 0, door], [x1, 0, door], [x1, h, door], [dx1, dh, door]], [[x0, h, door], [dx0, dh, door], [dx1, dh, door], [x1, h, door], [0, ridge, door]]]) litPoly(ctx, C, q, '#0e0908', lp, R, .3);
    litPoly(ctx, C, [[x0, 0, back], [x1, 0, back], [x1, 0, door], [x0, 0, door]], '#0b0705', lp, R, .6);   // floor
    // the slipway rails down the middle to the door
    for (const xr of [-.5, .5]) for (const run of projRuns(C, [[xr, .02, back + 2.4], [xr, .02, door + .1]])) { ctx.strokeStyle = 'rgba(150,110,70,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...run[0]); ctx.lineTo(...run[run.length - 1]); ctx.stroke(); }
    // rafters
    for (let i = 0; i < 6; i++) { const z = back + (door - back) * (i + .5) / 6; for (const run of projRuns(C, [[x0, h, z], [0, ridge, z], [x1, h, z]])) { ctx.strokeStyle = '#1c120c'; ctx.lineWidth = Math.max(2, 10 * (C.P(0, ridge, z)?.[2] ?? 100) / 400); ctx.beginPath(); run.forEach((p, j) => (j ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); } }
    bench(ctx, t, C, lp, R);
  } else {
    // from the beach: the facade with its open, lamp-lit door
    litPoly(ctx, C, [[x0, 0, door], [x1, 0, door], [x1, h, door], [0, ridge, door], [x0, h, door]], '#141220', null);
    boards(ctx, C, [x0, 0, door], [x1, 0, door], 20, 0, h, 'rgba(160,170,220,.08)');
    for (const run of projRuns(C, [[x0 - .2, h - .1, door + .2], [0, ridge + .15, door + .2], [x1 + .2, h - .1, door + .2]])) { ctx.strokeStyle = rgba('#b8c2ea', .3); ctx.lineWidth = 2; ctx.beginPath(); run.forEach((p, j) => (j ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); }
    const D = projPoly(C, [[dx0, 0, door], [dx1, 0, door], [dx1, dh, door], [dx0, dh, door]]);
    if (fillPoly(ctx, D, '#1a0f08')) {
      ctx.save(); fillPoly(ctx, D); ctx.clip();
      const lpp = C.P(...LMP); if (lpp) { const g = ctx.createRadialGradient(lpp[0], lpp[1], 0, lpp[0], lpp[1], lpp[2] * 4); g.addColorStop(0, rgba('#ffcf8a', .9 * lv)); g.addColorStop(.25, rgba('#c07a44', .55 * lv)); g.addColorStop(1, rgba('#2a160a', .2)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
      bench(ctx, t, C, lpp, lpp ? lpp[2] * 5 : 0);
      ctx.restore();
    }
    // the warm light spilling onto the sand in front of the door
    const sp = C.P(0, 0, door + 2.2); if (sp) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(sp[0], sp[1]); ctx.scale(1, .28); const r = sp[2] * 3.4, g = ctx.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, rgba('#ffb35c', .22 * lv)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(-r, -r, 2 * r, 2 * r); ctx.restore(); }
  }
  for (const f of o.items || []) f(ctx, t, C, lp, R);
  // the hanging lamp
  if (lp) { const top = C.P(S.lamp[0], ridge - .3, S.lamp[2]); if (top) { ctx.strokeStyle = '#2a1c12'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(lp[0], lp[1] - .1 * lp[2]); ctx.stroke(); } oilLamp(ctx, t, C, [LMP[0], LMP[1] - .2, LMP[2]], lv); }
  return { lamp: lp };
}
function bench(ctx, t, C, lp, R) {
  const B = SHED.bench;
  litPoly(ctx, C, [[B.x0, B.y, B.z0], [B.x1, B.y, B.z0], [B.x1, B.y, B.z1], [B.x0, B.y, B.z1]], '#24170f', lp, R, .7);
  litPoly(ctx, C, [[B.x0, B.y, B.z1], [B.x1, B.y, B.z1], [B.x1, B.y - .08, B.z1], [B.x0, B.y - .08, B.z1]], '#1a100a', lp, R, .5);
  for (const x of [B.x0 + .1, B.x1 - .1]) for (const run of projRuns(C, [[x, B.y - .08, B.z1 - .05], [x, 0, B.z1 - .05]])) { ctx.strokeStyle = '#150d08'; ctx.lineWidth = Math.max(2, .06 * (lp ? lp[2] : 300)); ctx.beginPath(); ctx.moveTo(...run[0]); ctx.lineTo(...run[run.length - 1]); ctx.stroke(); }
  // tools on the wall above the bench: a saw, a coil of line, a hand drill (silhouettes)
  const W = (x, y) => C.P(x, y, SHED.back + .02);
  const s0 = W(-1.2, 1.7), s1 = W(-.5, 1.55); if (s0 && s1) { ctx.fillStyle = '#0c0806'; ctx.beginPath(); ctx.moveTo(s0[0], s0[1]); ctx.lineTo(s1[0], s1[1]); ctx.lineTo(s1[0], s1[1] + (s1[1] - s0[1]) * 0 + 18); ctx.lineTo(s0[0], s0[1] + 30); ctx.fill(); }
  const c0 = W(1.1, 1.65); if (c0) { ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(c0[0], c0[1] + i * 2, c0[2] * .16, c0[2] * .2, 0, 0, TAU); ctx.stroke(); } }
}
// a rolled sheet (the blueprint) between world points a and b, radius r: pale blue paper, a spiral end
export function roll(ctx, t, C, a, b, r, o = {}) {
  const A = C.P(...a), B = C.P(...b); if (!A || !B) return;
  const k = (A[2] + B[2]) / 2, w = 2 * r * k;
  ctx.save(); ctx.lineCap = 'butt';
  ctx.strokeStyle = '#6f86a8'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  ctx.strokeStyle = '#a8bcd8'; ctx.lineWidth = w * .45; ctx.beginPath(); ctx.moveTo(A[0], A[1] - w * .18); ctx.lineTo(B[0], B[1] - w * .18); ctx.stroke();
  ctx.strokeStyle = rgba('#e8f0ff', .5); ctx.lineWidth = w * .12; ctx.beginPath(); ctx.moveTo(A[0], A[1] - w * .3); ctx.lineTo(B[0], B[1] - w * .3); ctx.stroke();
  // a white grid line drawn on the paper peeks out (blueprint), and a ribbon tie
  const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; ctx.strokeStyle = '#a8322a'; ctx.lineWidth = Math.max(2, w * .25); ctx.beginPath(); ctx.moveTo(m[0] - w * .1, m[1] - w * .5); ctx.lineTo(m[0] + w * .1, m[1] + w * .5); ctx.stroke();
  // the spiral end
  ctx.fillStyle = '#8aa0c0'; ctx.beginPath(); ctx.ellipse(B[0], B[1], w * .2, w * .5, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#4a5e7e'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 30; i++) { const q = i / 30 * TAU * 3, rr = w * .45 * i / 30; ctx.lineTo(B[0] + Math.cos(q) * rr * .4, B[1] + Math.sin(q) * rr); } ctx.stroke();
  ctx.restore();
}
// driftwood: one bleached log between two world points
export function log(ctx, C, a, b, r, lit = .5) {
  const A = C.P(...a), B = C.P(...b); if (!A || !B) return;
  const k = (A[2] + B[2]) / 2; ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = '#3a2c22'; ctx.lineWidth = 2 * r * k; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
  ctx.strokeStyle = rgba('#b89a78', .35 + .4 * lit); ctx.lineWidth = .7 * r * k; ctx.beginPath(); ctx.moveTo(A[0], A[1] - .55 * r * k); ctx.lineTo(B[0], B[1] - .55 * r * k); ctx.stroke();
  ctx.strokeStyle = 'rgba(20,14,10,.6)'; ctx.lineWidth = 1; for (let i = 1; i < 6; i++) { const u = i / 6, x = A[0] + (B[0] - A[0]) * u, y = A[1] + (B[1] - A[1]) * u; ctx.beginPath(); ctx.moveTo(x - 3, y - r * k * .6); ctx.lineTo(x + 3, y + r * k * .2); ctx.stroke(); }
  ctx.restore();
}
export function coil(ctx, C, p, R) {
  const c = C.P(...p); if (!c) return; const k = c[2];
  ctx.save(); for (let i = 0; i < 6; i++) { ctx.strokeStyle = i % 2 ? '#7a6040' : '#a8885c'; ctx.lineWidth = Math.max(1.5, .025 * k); ctx.beginPath(); ctx.ellipse(c[0], c[1] - i * .012 * k, R * k * (1 - i * .06), R * k * .38 * (1 - i * .06), 0, 0, TAU); ctx.stroke(); } ctx.restore();
}
export function sailHeap(ctx, C, p, s) {
  const c = C.P(...p); if (!c) return; const k = c[2] * s;
  ctx.save(); ctx.fillStyle = '#b8aa8a'; ctx.beginPath(); ctx.moveTo(c[0] - .5 * k, c[1]); ctx.quadraticCurveTo(c[0] - .3 * k, c[1] - .32 * k, c[0], c[1] - .25 * k); ctx.quadraticCurveTo(c[0] + .3 * k, c[1] - .38 * k, c[0] + .55 * k, c[1]); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(60,46,30,.6)'; ctx.lineWidth = 1.5; for (const [a, b] of [[-.3, -.18], [.05, -.22], [.3, -.2]]) { ctx.beginPath(); ctx.moveTo(c[0] + a * k, c[1] + b * k); ctx.quadraticCurveTo(c[0] + (a + .1) * k, c[1] + (b + .1) * k, c[0] + (a + .05) * k, c[1]); ctx.stroke(); }
  ctx.fillStyle = '#8a7a5a'; ctx.fillRect(c[0] + .1 * k, c[1] - .2 * k, .14 * k, .1 * k);   // a patch
  ctx.restore();
}
export function planks(ctx, t, C, o = {}) {
  const x = o.x ?? 2.45, z0 = o.z0 ?? -10, z1 = o.z1 ?? -7, n = o.n ?? 22, th = .045;
  for (let i = 0; i < n; i++) {
    const y = i * th, dz = .04 * Math.sin(i * 2.3);
    const P = projPoly(C, [[x - .32, y + th, z0 + dz], [x + .32, y + th, z0 + dz], [x + .32, y + th, z1 + dz], [x - .32, y + th, z1 + dz]]);
    fillPoly(ctx, P, i % 2 ? '#3a2818' : '#33231a');
    const F = projPoly(C, [[x - .32, y, z1 + dz], [x + .32, y, z1 + dz], [x + .32, y + th, z1 + dz], [x - .32, y + th, z1 + dz]]);
    if (fillPoly(ctx, F, '#5a4028')) { ctx.strokeStyle = 'rgba(10,6,4,.6)'; ctx.lineWidth = 1; ctx.stroke(); }
    const L = projPoly(C, [[x - .32, y, z0 + dz], [x - .32, y, z1 + dz], [x - .32, y + th, z1 + dz], [x - .32, y + th, z0 + dz]]);
    if (fillPoly(ctx, L, '#4a3220')) { ctx.strokeStyle = 'rgba(10,6,4,.5)'; ctx.lineWidth = 1; ctx.stroke(); }
  }
}
// the small raft: o.n logs side by side (lashed), a short mast, the old sail; tear rips its upper half, rerig shows the smaller sail
export function raft(ctx, t, C, o = {}) {
  const h = o.head ?? 0, cs = Math.cos(h), sn = Math.sin(h), n = o.n ?? 4, L = o.L ?? 2.2, y = o.y ?? .12, bob = o.bob ?? 0;
  const W = (u, v, w) => [o.x + cs * u + sn * w, y + v + bob, o.z - sn * u + cs * w];   // u across, w along
  const placed = o.placed ?? n;
  for (let i = 0; i < n; i++) { if (i >= placed) break; const u = (i - (n - 1) / 2) * .26; log(ctx, C, W(u, 0, -L / 2), W(u, 0, L / 2), .12, .7); }
  const lash = clamp(o.lash ?? 1);
  if (lash > 0) for (const w of [-L * .32, L * .32]) { const A = C.P(...W(-(n / 2) * .26 * lash, .08, w)), B = C.P(...W((n / 2) * .26 * lash, .08, w)); if (A && B) { ctx.strokeStyle = '#c8a878'; ctx.lineWidth = Math.max(1.5, .025 * A[2]); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); } }
  const mast = clamp(o.mast ?? 1); if (mast <= 0) return;
  const mb = W(0, .1, .25), mt = W(0, .1 + 1.6 * mast, .25), MB = C.P(...mb), MT = C.P(...mt); if (!MB || !MT) return;
  ctx.strokeStyle = '#2a1c12'; ctx.lineWidth = Math.max(2, .05 * MB[2]); ctx.beginPath(); ctx.moveTo(MB[0], MB[1]); ctx.lineTo(MT[0], MT[1]); ctx.stroke();
  const sail = clamp(o.sail ?? 0); if (sail <= 0) return;
  const tear = clamp(o.tear ?? 0), re = clamp(o.rerig ?? 0), top = 1.55 * (1 - .45 * re), gust = o.gust || 0;
  const S = (a, b) => C.P(...W(a * .9 * sail, .15 + b, .25 + .02 + a * .3 * gust));
  const pts = [S(0, top), S(.85 + .1 * gust, .25), S(0, .2)].filter(Boolean); if (pts.length < 3) return;
  ctx.save(); ctx.beginPath(); ctx.moveTo(...P2(pts[0])); ctx.quadraticCurveTo(pts[1][0] + 10 * gust, (pts[0][1] + pts[1][1]) / 2, pts[1][0], pts[1][1]); ctx.lineTo(pts[2][0], pts[2][1]); ctx.closePath();
  ctx.fillStyle = '#c8b894'; ctx.fill(); ctx.strokeStyle = 'rgba(60,46,30,.7)'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.clip(); ctx.fillStyle = '#9a8a6a'; const pa = S(.25, .55); if (pa) ctx.fillRect(pa[0], pa[1], 14, 10);   // a patch
  if (tear > 0 && re < 1) {   // the rip: a dark jagged line across the upper sail, the flap lifts
    const a = S(0, top * .55), b = S(.55, top * .5); if (a && b) { ctx.strokeStyle = '#120c08'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a[0], a[1]); for (let i = 1; i <= 8; i++) { const v = i / 8 * tear; ctx.lineTo(a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v + (i % 2 ? -5 : 5)); } ctx.stroke(); }
  }
  ctx.restore();
  if (tear > .3 && re < .5) {   // the torn flap streams downwind
    const a = S(0, top * .55), b = S(.55, top * .5), c = S(0, top); if (a && b && c) { const fl = 18 * Math.sin(t * 17) * (1 - re * 2); ctx.fillStyle = '#b8a884'; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(b[0] + 40 * tear + fl, b[1] - 30 * tear); ctx.lineTo(a[0], a[1]); ctx.closePath(); ctx.fill(); }
  }
}
