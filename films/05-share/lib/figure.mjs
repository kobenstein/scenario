// Faceless figures for Film 5. figure() = Film 4's approved art.person() (dressed: coat, trousers, skin, hair; form light,
// rim on the lit side) + Film 5 rules on top: accent colour on the clothing, breath + weight shift from o.t (nobody
// stands still), walk(phase) and sit presets, arms clamped to the front/side (never behind the back).
// figureFlat() is the older one-colour silhouette (Film 4 K-kit port) with volume shading + hatch: use it for crowds.
//
//   figure(ctx, x, y, s, pose, o) → { hand(i), feetY }   x,y = hip joint on screen, s = scale (1 → ~185 px standing)
//     o: { t, seed, accent, accentPart: 'coat'|'scarf'|'sleeve', dress: {coat, pants, shoes, skin, hair, scarf},
//          light: {x, y, col, a} (form light from that screen point), rim, rimSide, rimW, flip, prop(ctx, frontArm, backArm, dress),
//          shadow: true (contact shadow), cast: {x, y} (long cast shadow away from a light at x,y), shadeA (darken for depth/fog) }
//   figureFlat(ctx, x, y, s, pose, o)   one-colour silhouette, cheap (o.fast) — crowds, distant figures
//     pose: { lean, head, sh:[front,back], el:[front,back], hip:[front,back], kn:[front,back], hair, coat, skirt, bulk, dy }
//           angles in radians, 0 = straight down, + = forward (toward +x; flip mirrors). Use the presets below.
//     o:    { t, seed, col, rim, rimSide (+1 light from +x, -1 from -x), flip, accent, accentPart: 'sweater'|'scarf'|'coat'|'sleeve',
//             skin (hands, default = col), shade (0..1 volume), hatch (true), shadow (contact shadow, true), fast (no offscreen, for crowds),
//             prop(ctx, frontArm, backArm) drawn in figure units after the front arm }
//   handPos(x, y, s, pose, i = 0, flip)  screen position of hand i (0 front, 1 back) — to put a phone, pen or light in it
//   POSES.stand / hold / reach / lean / look / sit, walk(phase), breath(t), weight(t)
import { rgba, mix, clamp, canvas, hatch } from '../engine.mjs';
import { person, castShadow } from './art.mjs';

function capsule(ctx, x1, y1, r1, x2, y2, r2) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = Math.hypot(x2 - x1, y2 - y1), k = Math.asin(Math.max(-1, Math.min(1, (r1 - r2) / (d || 1))));
  ctx.beginPath();
  ctx.arc(x1, y1, r1, a + Math.PI / 2 + k, a + 3 * Math.PI / 2 - k);
  ctx.arc(x2, y2, r2, a - Math.PI / 2 - k, a + Math.PI / 2 + k);
  ctx.closePath(); ctx.fill();
}
export const FIGDEF = { lean: 0, head: 0, sh: [0.18, 0.08], el: [0.32, 0.26], hip: [0.05, -0.05], kn: [0, 0], hair: 'short', coat: false, skirt: false, bulk: 1, dy: 0 };
export const POSES = {
  stand: {},
  hold: { sh: [0.62, 0.5], el: [1.15, 1.2], head: .28 },             // phone / object held at the chest, head down
  reach: { sh: [1.55, 0.25], el: [0.05, 0.3], lean: .06 },           // front arm stretched out
  lean: { lean: .12, sh: [0.45, 0.35], el: [0.7, 0.8], head: .1 },    // leaning forward over a table
  look: { head: -.22, sh: [0.12, 0.06], el: [0.25, 0.2] },           // looking up
  sit: { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [0.55, 0.45], el: [0.85, 0.9], lean: .04 },
};
// walk cycle: phase in radians (2π per double step); arms swing, but stay at the side/front
export function walk(phase) {
  const s = Math.sin(phase), c = Math.cos(phase);
  return { hip: [0.36 * s, -0.36 * s], kn: [Math.max(0, -c) * 0.7 + .05, Math.max(0, c) * 0.7 + .05], sh: [Math.max(-.05, 0.12 - 0.2 * s), Math.max(-.05, 0.12 + 0.2 * s)], el: [0.3 + .1 * Math.max(0, -s), 0.3 + .1 * Math.max(0, s)], dy: -2.2 * Math.abs(c), lean: .03 };
}
// breathing (4.2 s) and slow weight shift (9 s) as small pose offsets
export const breath = (t, ph = 0) => Math.sin(t * Math.PI * 2 / 4.2 + ph);
export const weight = (t, ph = 0) => Math.sin(t * Math.PI * 2 / 9 + ph * 1.7) * .7 + Math.sin(t * Math.PI * 2 / 3.7 + ph) * .3;

function limbs(P) {
  const shY = -64 + (P._b || 0) * -.9, out = {};
  out.arm = (i) => {
    const a = P.sh[i], e = P.el[i], sx = i ? -3 : 3, sy = shY + 7;
    const ex = sx + Math.sin(a) * 29, ey = sy + Math.cos(a) * 29, hx = ex + Math.sin(a + e) * 26, hy = ey + Math.cos(a + e) * 26;
    return { sx, sy, ex, ey, hx, hy, ang: a + e };
  };
  out.leg = (i) => {
    const a = P.hip[i], k = P.kn[i], sx = i ? -4 : 4;
    const kx = sx + Math.sin(a) * 45, ky = Math.cos(a) * 45, fx = kx + Math.sin(a - k) * 43, fy = ky + Math.cos(a - k) * 43;
    return { sx, kx, ky, fx, fy };
  };
  out.shY = shY; return out;
}
function resolve(pose, o) {
  const P = Object.assign({}, FIGDEF, pose);
  P.sh = [...P.sh]; P.el = [...P.el]; P.hip = [...P.hip]; P.kn = [...P.kn];
  if (o.t != null) {
    const ph = (o.seed || 0) * 1.37, b = breath(o.t, ph), w = weight(o.t, ph);
    P._b = b; P.lean += w * .012; P.head += b * .015;
    if (P.hip[0] < 1) { P.hip[0] += w * .035; P.hip[1] -= w * .035; }
    P.sh[0] += .025 * Math.sin(o.t * .9 + ph); P.sh[1] += .02 * Math.sin(o.t * .8 + ph + 1);
    P._wx = w * 1.3;
  }
  if (!o.allowBack) { P.sh[0] = Math.max(-0.05, P.sh[0]); P.sh[1] = Math.max(-0.05, P.sh[1]); }
  return P;
}
// draw the silhouette parts in figure units. fills: { leg, legBack, arm, armBack, torso, head, hand }
function body(ctx, P, L, g, F, o) {
  const B = P.bulk, wx = P._wx || 0, b = P._b || 0;
  const leg = (i) => { const l = L.leg(i); ctx.fillStyle = i ? F.legBack : F.leg; capsule(ctx, l.sx, 0, 9.5 * B + g, l.kx, l.ky, 6.5 + g); capsule(ctx, l.kx, l.ky, 6.5 + g, l.fx, l.fy, 4.6 + g); ctx.beginPath(); ctx.ellipse(l.fx + 6, l.fy + 2.5, 9.5 + g, 4.6 + g, 0, 0, 7); ctx.fill(); };
  leg(1); leg(0);
  ctx.save(); ctx.translate(wx, 0); ctx.rotate(P.lean);
  const arm = (i) => { const m = L.arm(i); ctx.fillStyle = i ? F.armBack : F.arm; capsule(ctx, m.sx, m.sy, 8.6 * B + g, m.ex, m.ey, 6.4 + g); capsule(ctx, m.ex, m.ey, 6.2 + g, m.hx, m.hy, 4.6 + g); ctx.fillStyle = F.hand; ctx.beginPath(); ctx.ellipse(m.hx + Math.sin(m.ang) * 3.5, m.hy + Math.cos(m.ang) * 3.5, 4.8 + g, 5.6 + g, -m.ang, 0, 7); ctx.fill(); };
  arm(1);
  const sY = L.shY, w = B * (1 + b * .012);
  ctx.fillStyle = F.torso; ctx.beginPath();
  ctx.moveTo(-15 * w - g, 4);
  ctx.bezierCurveTo(-17 * w - g, -14, -13 * w - g, -30, -14 * w - g, -46);
  ctx.bezierCurveTo(-15 * w - g, sY + 4, -12 * w - g, sY - 3 - g, -4, sY - 4 - g);
  ctx.lineTo(5, sY - 4 - g);
  ctx.bezierCurveTo(14 * w + g, sY - 3 - g, 20 * w + g, sY + 6, 19 * w + g, -44);
  ctx.bezierCurveTo(18 * w + g, -30, 13 * w + g, -14, 15 * w + g, 4);
  if (P.coat) { ctx.lineTo(19 * w + g, 34); ctx.lineTo(-19 * w - g, 34); }
  else if (P.skirt) { ctx.lineTo(22 * w + g, 44); ctx.quadraticCurveTo(0, 48, -22 * w - g, 44); }
  else ctx.quadraticCurveTo(0, 12 + g, -15 * w - g, 4);
  ctx.closePath(); ctx.fill();
  if (F.scarf) { // scarf: a soft roll round the neck + one end hanging in front
    ctx.fillStyle = F.scarf;
    ctx.beginPath(); ctx.ellipse(2, sY - 1, 13 + g, 6.5 + g, -.08, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(7, sY + 1); ctx.quadraticCurveTo(15 + g, sY + 14, 12 + g, sY + 30); ctx.lineTo(5 - g, sY + 29); ctx.quadraticCurveTo(7, sY + 14, 1, sY + 2); ctx.closePath(); ctx.fill();
  }
  ctx.save(); ctx.translate(1, sY - 2); ctx.rotate(P.head); ctx.fillStyle = F.head;
  capsule(ctx, 0, 3, 5.6 + g, 1.5, -5, 5 + g);
  ctx.beginPath(); ctx.ellipse(2.5, -16, 10.4 + g, 12 + g, .12, 0, 7); ctx.fill();
  if (P.hair === 'long') { ctx.beginPath(); ctx.moveTo(-6, -29 - g); ctx.quadraticCurveTo(-15 - g, -14, -11 - g, 12); ctx.quadraticCurveTo(-4, 14, 1, 6); ctx.quadraticCurveTo(-5, -10, 2, -28); ctx.closePath(); ctx.fill(); }
  if (P.hair === 'bun') { ctx.beginPath(); ctx.arc(-6, -28, 5.8 + g, 0, 7); ctx.fill(); }
  if (P.hair === 'curly') { for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-6 + i * 3.4, -29 + Math.sin(i * 2) * 1.5, 5 + g, 0, 7); ctx.fill(); } }
  if (P.hair === 'grey') { ctx.beginPath(); ctx.ellipse(-1, -24, 10 + g, 8 + g, -.3, Math.PI * .8, Math.PI * 2.1); ctx.fill(); }
  ctx.restore();
  arm(0);
  if (o.prop) o.prop(ctx, L.arm(0), L.arm(1), F.torso);
  ctx.restore();
}
const scratch = new Map();
function scratchFor(w, h) { const k = `${Math.ceil(w / 64)}x${Math.ceil(h / 64)}`; if (!scratch.has(k)) scratch.set(k, canvas(Math.ceil(w / 64) * 64, Math.ceil(h / 64) * 64)); return scratch.get(k); }

export function figureFlat(ctx, x, y, s, pose = {}, o = {}) {
  const P = resolve(pose, o), L = limbs(P), flip = o.flip ? -1 : 1, rimSide = o.rimSide ?? 1;
  const col = o.col || '#120f30', rim = o.rim || null, acc = o.accent || null, part = o.accentPart || 'sweater';
  y += (P.dy || 0) * s;
  const F = { leg: col, legBack: shadeHex(col, -.02), arm: col, armBack: shadeHex(col, -.03), torso: col, head: col, hand: o.skin || col, scarf: null };
  if (acc) {
    if (part === 'sweater' || part === 'coat') { F.torso = acc; if (part === 'sweater') { F.arm = acc; F.armBack = shadeHex(acc, -.08); } }
    if (part === 'sleeve') { F.arm = acc; F.armBack = shadeHex(acc, -.08); }
    if (part === 'scarf') F.scarf = acc;
  }
  // contact shadow on the ground
  const sitting = P.hip[0] > 1;
  if (o.shadow !== false && !sitting) {
    const fy = y + 90 * s, g = ctx.createRadialGradient(x, fy, 0, x, fy, 46 * s);
    g.addColorStop(0, 'rgba(4,4,14,.55)'); g.addColorStop(1, 'rgba(4,4,14,0)');
    ctx.save(); ctx.translate(x, fy); ctx.scale(1, .22); ctx.translate(-x, -fy); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, fy, 46 * s, 0, 7); ctx.fill(); ctx.restore();
  }
  const off = o.rimW ?? Math.max(1.4, 1.3 * s);
  if (o.fast || s < .35) { // crowds and distant figures: direct, no offscreen
    const draw = (fills, dx, dy) => { ctx.save(); ctx.translate(x + dx, y + dy); ctx.scale(s * flip, s); body(ctx, P, L, 0, fills, o); ctx.restore(); };
    if (rim) draw(Object.fromEntries(Object.keys(F).map((k) => [k, F[k] ? rim : null])), rimSide * off, -off * .35);
    draw(F, 0, 0); return;
  }
  // offscreen: rim + body + volume shading + hatch, then one drawImage
  const bw = 200 * s + 8, bh = 300 * s + 8, ox = bw / 2, oy = 175 * s + 4;
  const [sc, sx] = scratchFor(bw, bh);
  sx.setTransform(1, 0, 0, 1, 0, 0); sx.globalCompositeOperation = 'source-over'; sx.globalAlpha = 1; sx.clearRect(0, 0, bw + 64, bh + 64);
  const at = (dx, dy, fills) => { sx.save(); sx.translate(ox + dx, oy + dy); sx.scale(s * flip, s); body(sx, P, L, 0, fills, o); sx.restore(); };
  if (rim) at(rimSide * off, -off * .35, Object.fromEntries(Object.keys(F).map((k) => [k, F[k] ? rim : null])));
  at(0, 0, F);
  // volume: dark toward the shadow side, a little lift toward the light
  const sh = o.shade ?? .55, L0 = ox + rimSide * 22 * s, L1 = ox - rimSide * 26 * s;
  sx.globalCompositeOperation = 'source-atop';
  const g = sx.createLinearGradient(L0, 0, L1, 0); g.addColorStop(0, `rgba(255,236,210,${.1 * sh})`); g.addColorStop(.45, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(2,2,10,${.55 * sh})`);
  sx.fillStyle = g; sx.fillRect(0, 0, bw, bh);
  const gv = sx.createLinearGradient(0, oy - 100 * s, 0, oy + 95 * s); gv.addColorStop(0, 'rgba(0,0,0,0)'); gv.addColorStop(1, `rgba(2,2,10,${.35 * sh})`); sx.fillStyle = gv; sx.fillRect(0, 0, bw, bh);
  if (o.hatch !== false && s > .6) hatch(sx, null, rimSide > 0 ? -1.05 : 1.05, Math.max(3, 3.2 * s), .32, { box: [0, 0, bw, bh], fade: [L1, 0, ox, 0], col: '#000000', w: Math.max(.7, .5 * s), wobble: .5 });
  if (rim && o.rimGlow !== false) { // a soft warm bleed of the rim into the body edge
    const gr = sx.createLinearGradient(ox + rimSide * 20 * s, 0, ox + rimSide * 8 * s, 0); gr.addColorStop(0, rgba(rim, .35)); gr.addColorStop(1, rgba(rim, 0)); sx.fillStyle = gr; sx.fillRect(0, 0, bw, bh);
  }
  sx.globalCompositeOperation = 'source-over';
  ctx.drawImage(sc, 0, 0, bw, bh, x - ox, y - oy, bw, bh);
}
// screen position of a hand (i = 0 front, 1 back); pass the same o.t/o.seed as figure() to follow the breathing
export function handPos(x, y, s, pose, i = 0, flip = false, o = {}) {
  const P = resolve(pose, o), f = flip ? -1 : 1, m = limbs(P).arm(i);
  const hx = m.hx + Math.sin(m.ang) * 4, hy = m.hy + Math.cos(m.ang) * 4;
  const c = Math.cos(P.lean), sn = Math.sin(P.lean);
  return [x + ((hx * c - hy * sn) + (P._wx || 0)) * s * f, y + (hx * sn + hy * c) * s + (P.dy || 0) * s];
}
function shadeHex(hex, d) { const n = parseInt(hex.slice(1), 16); const fx = (v) => Math.round(clamp(v + d * 255, 0, 255)); return '#' + [fx(n >> 16), fx((n >> 8) & 255), fx(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
export { capsule };

// ---------- figure(): art.person() with Film 5 rules ----------
const SKINS = ['#e9c3a0', '#d9b08e', '#b98762', '#8d5f40', '#6a4430', '#f0d2b4'];
export function figure(ctx, x, y, s, pose = {}, o = {}) {
  const P = resolve(pose, o), flip = !!o.flip;
  const dress = Object.assign({ coat: '#2c3450', pants: '#15142a', shoes: '#0b0a18', skin: SKINS[(o.seed || 0) % SKINS.length], hair: '#1c1420' }, o.dress || {});
  const part = o.accentPart || 'coat';
  if (o.accent) { if (part === 'scarf') { P.scarf = true; dress.scarf = o.accent; } else dress.coat = o.accent; }
  if (part === 'sleeve' && o.accent) dress.coat = o.accent;
  const px = x + (P._wx || 0) * s * (flip ? -1 : 1), py = y + ((P.dy || 0) + (P._b || 0) * -.35) * s;
  const sitting = P.hip[0] > 1;
  if (o.cast) castShadow(ctx, px, py + 88 * s, s, o.cast.x, o.cast.y, { a: o.cast.a ?? .4, len: o.cast.len ?? 2.4 });
  if (o.shadow !== false && !sitting) {
    const fy = py + 90 * s, g = ctx.createRadialGradient(px, fy, 0, px, fy, 40 * s);
    g.addColorStop(0, 'rgba(4,4,14,.5)'); g.addColorStop(1, 'rgba(4,4,14,0)');
    ctx.save(); ctx.translate(px, fy); ctx.scale(1, .2); ctx.translate(-px, -fy); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, fy, 40 * s, 0, 7); ctx.fill(); ctx.restore();
  }
  return person(ctx, px, py, s, P, { flip, rim: o.rim, rimSide: o.rimSide, rimW: o.rimW, light: o.light, dress, prop: o.prop, shadeA: o.shadeA, shadeCol: o.shadeCol });
}

// ---------- figureBack(): a person seen from behind (rooftop, window, horizon) ----------
// Faceless, capsule limbs, round shoulders, the scene's accent on the scarf; back-lit: a dark silhouette with a rim on the
// side facing the light and the phone's warm light wrapping around the chest. Breath and weight shift from o.t.
//   figureBack(ctx, x, y, s, o) → { phone: [x, y] (the phone, hidden in front of the chest: put its glow / rings there), head, feetY }
//     x,y = between the feet on the ground, s = scale (1 → ~185 px tall)
//     o: { t, seed, dress: { coat, pants, shoes, skin, hair }, accent (scarf, default ochre), hold: 'phone' | 'none',
//          light: { x, y, col, a } (screen point of the back light: rim on that side), glow: { col, a } (phone light around the chest),
//          headTilt (+ looks down at the phone), shade (0..1 extra darkening for distance),
//          rimFloor (units above the feet below which the back light is blocked, e.g. by a parapet: no rim there) }
const BACKC = new Map();
export function figureBack(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, b = breath(t, o.seed || 0) * .8, w8 = weight(t, o.seed || 0) * 1.4, hold = (o.hold ?? 'phone') === 'phone';
  const D = Object.assign({ coat: '#26304a', pants: '#131427', shoes: '#0a0a12', skin: '#8d5f40', hair: '#16111a' }, o.dress || {});
  const scarf = o.accent ?? '#c8843a', tilt = o.headTilt ?? .22;
  const U = { w: 140, h: 210, ox: 70, oy: 198 }, cw = Math.ceil(U.w * s), ch = Math.ceil(U.h * s);
  const key = cw + 'x' + ch; if (!BACKC.has(key)) BACKC.set(key, [canvas(cw, ch), canvas(cw, ch), canvas(cw, ch)]);
  const [[c, g], [mc, mg], [rc, rg]] = BACKC.get(key);
  for (const q of [g, mg, rg]) { q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-over'; q.globalAlpha = 1; q.clearRect(0, 0, cw, ch); }
  const paint = (q, mono) => {
    q.setTransform(s, 0, 0, s, U.ox * s, U.oy * s);
    const col = (k) => mono || D[k], sh = (k, d) => mono || shadeHex(D[k], d);
    const sy = -b, hx = w8;   // shoulders breathe, hips sway
    // legs: weight on the left leg, the right knee eased (a little shorter, slightly out)
    q.fillStyle = col('pants'); capsule(q, -8 + hx, -92, 9, -8.8, -50, 6.9); capsule(q, -8.8, -50, 6.7, -8.4, -9, 5.2);
    q.fillStyle = sh('pants', .03); capsule(q, 8 + hx, -92, 9, 10.4, -52, 6.9); capsule(q, 10.4, -52, 6.6, 9.6, -10, 5.2);
    q.fillStyle = col('shoes'); q.beginPath(); q.ellipse(-8.6, -4.6, 6.2, 4.6, 0, 0, 7); q.fill(); q.beginPath(); q.ellipse(9.8, -5.2, 6.2, 4.4, .1, 0, 7); q.fill();
    // left arm at the side (never behind the back), a slight bend, hand by the thigh
    q.fillStyle = sh('coat', -.04); capsule(q, -19, -142 + sy, 6.9, -24, -113, 5.9); capsule(q, -24, -113, 5.7, -22, -87, 4.7);
    q.fillStyle = col('skin'); q.beginPath(); q.ellipse(-21.4, -81.5, 3.9, 5.2, .15, 0, 7); q.fill();
    // coat: round shoulders, a little waist, A-line hem, stand-up collar
    q.fillStyle = col('coat'); q.beginPath();
    q.moveTo(-18.5, -77); q.bezierCurveTo(-19.5, -92, -16.2, -106, -16.4, -120); q.bezierCurveTo(-16.8, -134, -23, -140 + sy, -18.5, -147 + sy); q.bezierCurveTo(-13, -152 + sy, -6, -151.5 + sy, 0, -151.5 + sy);
    q.bezierCurveTo(6, -151.5 + sy, 13, -152 + sy, 18.5, -147 + sy); q.bezierCurveTo(23, -140 + sy, 16.8, -134, 16.4, -120); q.bezierCurveTo(16.2, -106, 19.5, -92 + hx * .2, 18.5, -77);
    q.quadraticCurveTo(0, -73.5, -18.5, -77); q.closePath(); q.fill();
    // right arm: the upper arm angles out to the elbow; the forearm goes forward to the phone in front of the chest (hidden)
    if (hold) { q.fillStyle = col('coat'); capsule(q, 17.5, -142 + sy, 7, 27.5, -117, 6.3); q.beginPath(); q.ellipse(27, -115.5, 6.6, 6.2, .5, 0, 7); q.fill(); }
    else { q.fillStyle = col('coat'); capsule(q, 19, -142 + sy, 6.9, 24, -113, 5.9); capsule(q, 24, -113, 5.7, 22, -87, 4.7); q.fillStyle = col('skin'); q.beginPath(); q.ellipse(21.4, -81.5, 3.9, 5.2, -.15, 0, 7); q.fill(); }
    // collar, neck, head bowed toward the phone, hair
    q.fillStyle = sh('coat', .08); q.beginPath(); q.moveTo(-9.5, -148 + sy); q.quadraticCurveTo(0, -146 + sy, 9.5, -148 + sy); q.lineTo(8.5, -154 + sy); q.quadraticCurveTo(0, -152.5 + sy, -8.5, -154 + sy); q.closePath(); q.fill();
    q.fillStyle = sh('skin', -.18); capsule(q, 0, -151 + sy, 4.6, 0, -158 + sy + tilt * 3, 4.3);
    q.save(); q.translate(0, -166.5 + sy + tilt * 5);
    q.fillStyle = col('hair'); q.beginPath(); q.ellipse(0, 0, 9.3, 11.4 - tilt * 2, 0, 0, 7); q.fill();
    q.beginPath(); q.moveTo(-8.6, 3); q.quadraticCurveTo(0, 12.5 - tilt * 3, 8.6, 3); q.lineTo(7.8, 6.5); q.quadraticCurveTo(0, 11, -7.8, 6.5); q.closePath(); q.fill();
    q.restore();
    // scarf (the accent): a wrapped band at the collar, one short tail with a fold
    q.fillStyle = mono || scarf; q.beginPath(); q.ellipse(0, -149.5 + sy, 10.4, 4.2, 0, 0, 7); q.fill();
    q.beginPath(); q.moveTo(-8, -150 + sy); q.quadraticCurveTo(-11.5, -139, -9.5, -128); q.lineTo(-4.2, -129); q.quadraticCurveTo(-5.4, -139, -2.8, -149 + sy); q.closePath(); q.fill();
    if (!mono) { q.fillStyle = 'rgba(40,16,4,.35)'; q.beginPath(); q.ellipse(0, -147.6 + sy, 10, 2.2, 0, 0, Math.PI); q.fill(); q.strokeStyle = 'rgba(40,16,4,.4)'; q.lineWidth = .7; q.beginPath(); q.moveTo(-7.4, -141); q.lineTo(-5.2, -140); q.moveTo(-8.2, -134); q.lineTo(-5.6, -133.4); q.stroke(); }
  };
  paint(g, null);
  // form and print: cool sky on the shoulders, darker toward the ground, engraved hatch, coat seams
  g.setTransform(s, 0, 0, s, U.ox * s, U.oy * s); g.globalCompositeOperation = 'source-atop';
  const fg = g.createLinearGradient(0, -190, 0, 0); fg.addColorStop(0, 'rgba(120,150,200,.16)'); fg.addColorStop(.35, 'rgba(0,0,0,0)'); fg.addColorStop(1, 'rgba(3,4,10,.45)'); g.fillStyle = fg; g.fillRect(-70, -200, 140, 210);
  if (o.shade) { g.fillStyle = `rgba(10,14,30,${o.shade})`; g.fillRect(-70, -200, 140, 210); }
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = .6; g.beginPath(); g.moveTo(0, -146); g.lineTo(.5, -78); g.stroke(); g.beginPath(); g.moveTo(-.2, -92); g.lineTo(-.4, -78); g.lineWidth = 1.2; g.stroke();
  g.setTransform(1, 0, 0, 1, 0, 0); hatch(g, null, -1.1, 3.2 * Math.max(1, s * .9), .2, { box: [0, 0, cw, ch], col: '#05060c', w: Math.max(.6, s * .35), wobble: .5 });
  g.globalCompositeOperation = 'source-over';
  // rim toward the back light (mask minus mask shifted away from it)
  paint(mg, '#fff'); mg.setTransform(1, 0, 0, 1, 0, 0);
  const L = o.light || { x: x + 600, y: y - 500, col: '#ffe2b8', a: .9 }, dx = L.x - x, dy = L.y - (y - 120 * s), m = Math.hypot(dx, dy) || 1, rw = Math.max(1.2, s * 1.3);
  rg.setTransform(1, 0, 0, 1, 0, 0); rg.drawImage(mc, 0, 0); rg.globalCompositeOperation = 'destination-out'; rg.drawImage(mc, -dx / m * rw, -dy / m * rw);
  if (o.rimFloor) { rg.globalCompositeOperation = 'destination-in'; const lg = rg.createLinearGradient(0, (U.oy - o.rimFloor - 18) * s, 0, (U.oy - o.rimFloor) * s); lg.addColorStop(0, '#fff'); lg.addColorStop(1, 'rgba(255,255,255,0)'); rg.fillStyle = lg; rg.fillRect(0, 0, cw, ch); }
  rg.globalCompositeOperation = 'source-in'; rg.fillStyle = L.col || '#ffe2b8'; rg.fillRect(0, 0, cw, ch);
  g.globalAlpha = L.a ?? .9; g.drawImage(rc, 0, 0); g.globalAlpha = 1;
  // a faint cool rim of sky on the other shoulder and the top of the head (volume)
  rg.globalCompositeOperation = 'source-over'; rg.clearRect(0, 0, cw, ch); rg.drawImage(mc, 0, 0); rg.globalCompositeOperation = 'destination-out'; rg.drawImage(mc, rw * .8, rw * 1.1);
  rg.globalCompositeOperation = 'destination-in'; { const lg = rg.createLinearGradient(0, (U.oy - 190) * s, 0, (U.oy - 110) * s); lg.addColorStop(0, '#fff'); lg.addColorStop(1, 'rgba(255,255,255,0)'); rg.fillStyle = lg; rg.fillRect(0, 0, cw, ch); }
  rg.globalCompositeOperation = 'source-in'; rg.fillStyle = '#9fb6cf'; rg.fillRect(0, 0, cw, ch); g.globalAlpha = .55; g.drawImage(rc, 0, 0); g.globalAlpha = 1;
  // the phone's warm light wraps around the right side of the chest and the inside of the arm
  if (hold && o.glow !== null) {
    const G = o.glow || { col: '#ffb35c', a: .9 };
    rg.globalCompositeOperation = 'source-over'; rg.clearRect(0, 0, cw, ch); rg.drawImage(mc, 0, 0); rg.globalCompositeOperation = 'destination-out'; rg.drawImage(mc, -rw * 1.6, rw * .3);
    rg.globalCompositeOperation = 'destination-in'; const px = (U.ox + 10) * s, py = (U.oy - 124) * s, gg = rg.createRadialGradient(px, py, 0, px, py, 34 * s); gg.addColorStop(0, '#fff'); gg.addColorStop(1, 'rgba(255,255,255,0)'); rg.fillStyle = gg; rg.fillRect(0, 0, cw, ch);
    rg.globalCompositeOperation = 'source-in'; rg.fillStyle = G.col; rg.fillRect(0, 0, cw, ch);
    g.globalCompositeOperation = 'lighter'; g.globalAlpha = G.a ?? .9; g.drawImage(rc, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  ctx.drawImage(c, x - U.ox * s, y - U.oy * s);
  return { phone: [x + 9 * s, y - 124 * s], head: [x, y - 167 * s], feetY: y };
}
