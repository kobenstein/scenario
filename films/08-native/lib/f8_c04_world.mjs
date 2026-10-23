// Film 8 · c04/c05 world helpers (owner: B1). The stage of night: the weave behind, the swarm between, the figure in front.
// World units: the Z = 0 plane of lib/f8_c03_world.mjs (S, plane, FCAM; k = 1 → 1 unit = 1 px), the ground at FLOOR = 830.
import { W, H, rgba, clamp, mix, prng, text } from '../engine.mjs';
import { F8, conductor, eoutX } from './f8_kit.mjs';
import { S } from './f8_c03_world.mjs';

const TAU = Math.PI * 2;
export const sine = (x) => .5 - .5 * Math.cos(Math.PI * clamp(x));
export const bump = (t, c, w) => Math.exp(-Math.pow((t - c) / w, 2));
export const WV = { x: 210, y: 20, w: 1600, h: 800 };   // the weave (centre 1010, 420)
export const FIG0 = [1010, 830], FS = .62;              // the figure's place and scale (≈ 115 units tall)
export const SW = [1010, 600];                          // the swarm's centre

// zoom-about-a-point camera (same as c03): k moves in log space; the focus (end centre on a push, start centre on a pull) travels on a
// straight screen line. Keys { t, x, y, k, e? } (e: the ease INTO that key, default sine).
export function camKeys(K, t) {
  if (t <= K[0].t) return { x: K[0].x, y: K[0].y, k: K[0].k };
  for (let i = 1; i < K.length; i++) {
    const a = K[i - 1], b = K[i]; if (t > b.t) continue;
    const u = (b.e || sine)((t - a.t) / (b.t - a.t)), k = Math.exp(mix(Math.log(a.k), Math.log(b.k), u));
    const F = b.k >= a.k ? [b.x, b.y] : [a.x, a.y];
    const s0 = [W / 2 + (F[0] - a.x) * a.k, H / 2 + (F[1] - a.y) * a.k], s1 = [W / 2 + (F[0] - b.x) * b.k, H / 2 + (F[1] - b.y) * b.k];
    const sp = [mix(s0[0], s1[0], u), mix(s0[1], s1[1], u)];
    return { x: F[0] - (sp[0] - W / 2) / k, y: F[1] - (sp[1] - H / 2) / k, k };
  }
  const L = K[K.length - 1]; return { x: L.x, y: L.y, k: L.k };
}

// the figure, with a turn: sq (0.5 … 1) squeezes the silhouette about its feet while it turns (back ↔ profile)
export function drawFig(ctx, t, c, F) {
  const p = S(c, F.x, F.y), s = FS * c.k * (F.sc ?? 1);
  if (p[0] < -300 || p[0] > W + 300 || p[1] - 200 * s > H + 50 || p[1] < -50) return null;
  ctx.save(); ctx.translate(p[0], p[1]); if (F.lean) ctx.rotate(F.lean); ctx.scale(F.sq ?? 1, 1); ctx.translate(-p[0], -p[1]);
  const r = conductor(ctx, t, p[0], p[1], s, { pose: F.pose || 'stand', from: F.from, u: F.u ?? 1, view: F.view || 'back', flip: F.flip, rim: F.rim ?? 1, glow: F.glow ?? 1, walkPhase: F.walkPhase, seed: 8,
    light: F.light || { x: p[0] + 600 * s, y: p[1] - 420 * s, col: F8.amber, a: .9 } });
  ctx.restore();
  return r;
}
// the profile of the head in the back view (2.16: on "people" she turns her head): a nose and brow on the light side
export function headTurn(ctx, head, s, u, rimA = 0) {
  if (u <= 0) return; const e = eoutX(u), hx = head[0], hy = head[1];
  ctx.save(); ctx.translate(hx, hy); ctx.scale(s, s);
  ctx.fillStyle = '#17111a'; ctx.beginPath(); ctx.ellipse(1.5 * e, 0, 9.3 + 1.2 * e, 11.2, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#3a2a24'; ctx.beginPath(); ctx.moveTo(8.5 * e, -4); ctx.quadraticCurveTo(13.5 * e, 1, 9.5 * e, 4.5); ctx.quadraticCurveTo(10 * e, 8, 7 * e, 9.5); ctx.lineTo(6 * e, -4); ctx.fill();
  if (rimA > 0) { ctx.strokeStyle = rgba(F8.amber, .8 * rimA * e); ctx.lineWidth = 1.4 / s; ctx.beginPath(); ctx.moveTo(8.5 * e, -6); ctx.quadraticCurveTo(13.5 * e, 1, 9.5 * e, 4.5); ctx.stroke(); }
  ctx.restore();
}

// a dotted ghost figure (people who are not there): dots along a standing outline; u 1 = whole, 0 = gone (the dots blow away with wind)
const GF = (() => { const pts = [];
  for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; pts.push([Math.cos(a) * .085, -.9 + Math.sin(a) * .095]); }                       // head
  const body = [[-.06, -.79], [-.17, -.72], [-.19, -.5], [-.16, -.42], [-.14, -.24], [-.1, 0], [-.02, 0], [0, -.4], [.02, 0], [.1, 0], [.14, -.24], [.16, -.42], [.19, -.5], [.17, -.72], [.06, -.79]];
  for (let i = 0; i < body.length - 1; i++) { const [a, b] = [body[i], body[i + 1]], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / .045)); for (let k = 0; k < n; k++) pts.push([mix(a[0], b[0], k / n), mix(a[1], b[1], k / n)]); }
  return pts; })();
export function ghostFig(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1, u = clamp(o.u ?? 1), gone = 1 - u, r = prng((o.seed ?? 1) * 31 + 7), col = o.col || '#cfc8f0', wind = o.wind ?? [1, -.35];
  if (a <= 0 || u <= 0) return;
  ctx.save(); ctx.fillStyle = col;
  for (const [px, py] of GF) {
    const q = r(), q2 = r(), d = clamp((gone - q * .5) / .5), dx = wind[0] * d * (60 + 120 * q2) * h / 115 + Math.sin(t * 2 + q * 9) * 4 * d, dy = wind[1] * d * (40 + 60 * q) * h / 115;
    const al = a * (1 - d) * (.55 + .45 * Math.sin(t * 3 + q * 20) * (o.flicker ?? 0) + .45 * (1 - (o.flicker ?? 0)));
    if (al <= .01) continue; ctx.globalAlpha = clamp(al); const sz = Math.max(1, h * .022);
    ctx.fillRect(x + px * h + dx - sz / 2, y + py * h + dy - sz / 2, sz, sz);
  }
  ctx.restore();
}
// dotted ghost shapes on the ground (3.06): kind 'bridge' | 'boat' | 'house' | 'arch'; solid 0..1 engraves it; blow 0..1 scatters the dots
export function ghostShape(ctx, t, kind, x, y, w, k, o = {}) {
  const solid = clamp(o.solid ?? 0), blow = clamp(o.blow ?? 0), a = o.a ?? 1, r = prng(kind.length * 13 + 5), col = o.col || '#cfc8f0';
  const path = shapePath(kind, w);
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (solid > 0) {   // engraved: a dark body, a hatched shade, a lit rim
    ctx.globalAlpha = a * solid; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const seg of path) { ctx.beginPath(); seg.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); if (seg.closed) { ctx.closePath(); ctx.fillStyle = '#171a3c'; ctx.fill(); } ctx.strokeStyle = o.gold ? rgba(F8.goldCore, .95) : rgba('#d9d0f6', .85); ctx.lineWidth = (o.gold ? 2.2 : 1.6) / k; ctx.stroke(); }
    if (o.gold) { ctx.globalCompositeOperation = 'lighter'; for (const seg of path) { ctx.beginPath(); seg.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.strokeStyle = rgba(F8.gold, .25 * o.gold); ctx.lineWidth = 9 / k; ctx.stroke(); } ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = 1;
  }
  if (solid < 1) {
    ctx.fillStyle = col;
    for (const seg of path) for (let i = 0; i < seg.length - 1; i++) { const [p0, p1] = [seg[i], seg[i + 1]], n = Math.max(1, Math.round(Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 7));
      for (let j = 0; j < n; j++) { const q = r(), d = clamp((blow - q * .4) / .6), px = mix(p0[0], p1[0], j / n) + d * (50 + 90 * q) + Math.sin(t * 2 + q * 7) * 5 * d, py = mix(p0[1], p1[1], j / n) - d * (30 + 50 * r());
        const al = a * (1 - solid) * (1 - d) * (.7 + .3 * Math.sin(t * 2.4 + q * 13)); if (al < .02) continue; ctx.globalAlpha = al; const sz = 2.2 / Math.max(.6, Math.sqrt(k)); ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz); } }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
function shapePath(kind, w) {
  const h = w * .5, seg = (pts, closed) => Object.assign(pts, { closed });
  if (kind === 'bridge') { const arc = []; for (let i = 0; i <= 16; i++) { const q = i / 16; arc.push([-w / 2 + q * w, -Math.sin(Math.PI * q) * h * .55]); }
    const deck = [[-w / 2 - 10, -h * .62], [w / 2 + 10, -h * .62]], rail = []; for (let i = 0; i <= 8; i++) rail.push([-w / 2 + i * w / 8, -h * .62], [-w / 2 + i * w / 8, -h * .82]);
    const posts = []; for (let i = 1; i < 8; i++) { const q = i / 8; posts.push(seg([[-w / 2 + q * w, -Math.sin(Math.PI * q) * h * .55], [-w / 2 + q * w, -h * .62]])); }
    return [seg(arc), seg(deck), seg([[-w / 2 - 10, -h * .82], [w / 2 + 10, -h * .82]]), ...posts]; }
  if (kind === 'boat') return [seg([[-w / 2, -h * .3], [w / 2, -h * .3], [w * .36, 0], [-w * .38, 0]], true), seg([[0, -h * .3], [0, -h * 1.5]]), seg([[0, -h * 1.45], [w * .32, -h * .4], [0, -h * .4]], true)];
  if (kind === 'house') return [seg([[-w / 2, 0], [-w / 2, -h * .9], [0, -h * 1.5], [w / 2, -h * .9], [w / 2, 0]], true), seg([[-w * .12, 0], [-w * .12, -h * .5], [w * .12, -h * .5], [w * .12, 0]])];
  if (kind === 'arch' || kind === 'crooked') { const pts = []; for (let i = 0; i <= 18; i++) { const q = i / 18, cr = kind === 'crooked' ? Math.sin(q * 5) * .18 * h + q * h * .35 : 0; pts.push([-w / 2 + q * w, -Math.sin(Math.PI * q) * h * 1.1 - cr]); } return [seg(pts)]; }
  return [];
}
// the arch curve (for fireflies building it): point at q 0..1 in world units relative to its foot centre
export function archPt(kind, w, q) { const h = w * .5, cr = kind === 'crooked' ? Math.sin(q * 5) * .18 * h + q * h * .35 : 0; return [-w / 2 + q * w, -Math.sin(Math.PI * q) * h * 1.1 - cr]; }

// a light circle on the ground under the figure (3.15 "stand")
export function lightCircle(ctx, x, y, r, a) {
  if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(1, .2);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, rgba(F8.amber, .42 * a)); g.addColorStop(.7, rgba(F8.amber, .14 * a)); g.addColorStop(1, rgba(F8.amber, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba('#ffd9a0', .55 * a); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, 0, r * .72, 0, TAU); ctx.stroke(); ctx.restore();
}
// caps label with a rule, wiped in by u (0 … 1) and out by o (0 … 1)
export function capsLabel(ctx, txt, x, y, u, o = 0, opt = {}) {
  if (u <= 0 || o >= 1) return; const size = opt.size ?? 22, wdt = opt.w ?? (txt.length * size * .95 + 20), col = opt.col || '#efe4c6';
  ctx.save(); ctx.beginPath(); ctx.rect(x - 4 + wdt * eoutX(o), y - size * 1.6, wdt * (eoutX(u) - eoutX(o)) + 8, size * 2.6); ctx.clip();
  text(ctx, txt, x, y, { size, weight: 600, color: col, spacing: opt.spacing ?? 6 });
  if (opt.rule !== false) { ctx.strokeStyle = rgba(opt.ruleCol || '#b9f0c8', .7); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + size * .7); ctx.lineTo(x + Math.min(wdt, 220), y + size * .7); ctx.stroke(); }
  ctx.restore();
}

// the stage's land at night (c04/c05): two ridges that slide with x-parallax but follow the camera vertically like the Z = 0 plane
// (so a tilt up leaves only the sky plate), a band of mist, the ground at FLOOR with engraved grass ticks. day 0 … 1 lifts the tones.
const RIDGES = [{ base: 650, amp: 120, pf: .35, f: 1, c0: '#1d1a4a', c1: '#141436', rim: '#8a7fd0', seed: 1.3 }, { base: 742, amp: 64, pf: .6, f: 1.7, c0: '#15153c', c1: '#0e1030', rim: '#7a70c0', seed: 4.1 }];
const rn = (x, s) => .5 * Math.sin(x * .004 + s) + .3 * Math.sin(x * .011 + s * 2.1) + .15 * Math.sin(x * .027 + s * 3.3) + .05 * Math.sin(x * .07 + s);
export function stageLand(ctx, t, c, o = {}) {
  const FL = 830, tone = o.tone || null;
  for (const R of RIDGES) {
    const pts = []; let top = 1e9;
    for (let sx = -40; sx <= W + 40; sx += 8) { const wx = c.x * R.pf + (sx - W / 2) / c.k * R.pf * R.f, y = R.base + R.amp * rn(wx, R.seed) - (R.amp * .8), sy = H / 2 + (y - c.y) * c.k; pts.push([sx, sy]); top = Math.min(top, sy); }
    if (top > H + 10) continue;
    ctx.beginPath(); ctx.moveTo(-40, H + 10); for (const [x, y] of pts) ctx.lineTo(x, y); ctx.lineTo(W + 40, H + 10); ctx.closePath();
    const g = ctx.createLinearGradient(0, top, 0, top + 380 * c.k); g.addColorStop(0, tone ? tone[0] : R.c0); g.addColorStop(1, tone ? tone[1] : R.c1); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = rgba(R.rim, .4); ctx.lineWidth = 1.4; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  }
  // mist over the foot of the ridges
  { const y0 = H / 2 + (700 - c.y) * c.k, y1 = H / 2 + (FL - c.y) * c.k; if (y0 < H && y1 > 0) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(93,90,156,0)'); g.addColorStop(.7, `rgba(93,90,156,${.16 * (o.mist ?? 1)})`); g.addColorStop(1, 'rgba(93,90,156,0)'); ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0); } }
  // the ground
  const gy = H / 2 + (FL - c.y) * c.k; if (gy < H + 2) {
    const g = ctx.createLinearGradient(0, gy, 0, gy + 300 * c.k); g.addColorStop(0, o.ground ? o.ground[0] : '#0e1226'); g.addColorStop(1, o.ground ? o.ground[1] : '#05060f'); ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy + 2);
    ctx.strokeStyle = rgba('#7a74b8', .3); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, gy + .5); ctx.lineTo(W, gy + .5); ctx.stroke();
    const r = prng(61); ctx.strokeStyle = rgba('#6f6aa8', .2); ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i < 700; i++) { const x = -3000 + r() * 7000, yy = FL + 4 + r() * r() * 200, L = (3 + r() * 6) * c.k, sw = Math.sin(t * .8 + i) * 1.2, sx = W / 2 + (x - c.x) * c.k, sy = H / 2 + (yy - c.y) * c.k; if (sx < -10 || sx > W + 10 || sy > H + 10 || sy < gy) continue; ctx.moveTo(sx, sy); ctx.lineTo(sx + sw + 1, sy - L); }
    ctx.stroke();
  }
}
