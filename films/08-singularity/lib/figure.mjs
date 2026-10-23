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
//   POSES.stand / hold / reach / lean / look / sit / perch, walk(phase), breath(t), weight(t), life(t, seed), blink(t, seed)
// Life (o.t given): every figure breathes (4–4.6 s), shifts its weight now and then (a smooth step every 8–13 s), glances about
//   (a head turn every 6–11 s, eased in, held, eased back) and blinks (figure, figureKid); each on its own phase and rate via o.seed.
// walk(phase): a real gait (heel strike with the toe up, flat foot, push-off on the toe, knee flexed in the swing, the opposite arm swinging,
//   the lowest foot kept on the ground so the body bobs) → also returns ft (foot pitch) and _walk.
// Faces: figure() → art.person() v3 (near-profile face, blink, gaze, smile); figureKid draws a child's face when it is big enough.
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
  // sitting on a wall / bench edge with the knees toward the viewer (thighs foreshortened), the torso turned to the side
  perch: { hip: [1.35, 1.45], kn: [1.33, 1.43], thigh: [.62, .56], hipX: [0, 5], sh: [0.5, 0.42], el: [0.9, 0.95], lean: .06, hands: ['relaxed', 'open'] },
};
// walk cycle: phase in radians (2π per double step). Keyframed gait per leg (u = 0 heel strike → .6 toe-off → swing), the other leg
// half a cycle later; arms swing opposite to the legs, mostly in front of the body (never behind the back).
const GAIT = {
  hip: [[0, .44], [.15, .31], [.5, -.21], [.6, -.15], [.75, .2], [.88, .46]],
  kn: [[0, .05], [.12, .28], [.38, .07], [.5, .2], [.6, .6], [.72, 1.0], [.86, .42], [.96, .06]],
  ft: [[0, .3], [.08, 0], [.4, 0], [.52, -.22], [.62, -.7], [.72, -.28], [.84, .06], [.94, .22]],
};
function gait(K, u) {   // periodic Catmull-Rom through the keys
  const n = K.length; let i = 0; for (let j = 0; j < n; j++) if (K[j][0] <= u) i = j;
  const k1 = K[i], k2 = K[(i + 1) % n], u2 = i + 1 < n ? k2[0] : 1, q = (u - k1[0]) / (u2 - k1[0]), p0 = K[(i - 1 + n) % n][1], p1 = k1[1], p2 = k2[1], p3 = K[(i + 2) % n][1];
  return .5 * (2 * p1 + (p2 - p0) * q + (2 * p0 - 5 * p1 + 4 * p2 - p3) * q * q + (3 * p1 - p0 - 3 * p2 + p3) * q * q * q);
}
export function walk(phase) {
  const u0 = ((phase / (Math.PI * 2)) % 1 + 1) % 1, u1 = (u0 + .5) % 1;
  const hip = [gait(GAIT.hip, u0), gait(GAIT.hip, u1)], kn = [gait(GAIT.kn, u0), gait(GAIT.kn, u1)], ft = [gait(GAIT.ft, u0), gait(GAIT.ft, u1)];
  const c = Math.cos(Math.PI * 2 * (u0 - .03)), c2 = Math.cos(Math.PI * 2 * (u0 - .1));
  const sh = [Math.max(-.05, .14 - .26 * c), Math.max(-.05, .14 + .26 * c)], el = [.36 + .1 * (1 - c2), .36 + .1 * (1 + c2)];
  // the lowest point of either shoe stays on the ground (heel at the strike, toe at the push-off): the bob comes out of the legs
  const low = (i) => { const a = hip[i], p = ft[i]; return Math.cos(a) * 45 + Math.cos(a - kn[i]) * 43 + Math.max(4.6 * Math.cos(p) + 5.6 * Math.sin(p), 4.6 * Math.cos(p) - 13.8 * Math.sin(p)); };
  return { hip, kn, ft, sh, el, dy: 92.6 - Math.max(low(0), low(1)), lean: .04 + .012 * Math.sin(Math.PI * 4 * u0 + .6), head: -.03, _walk: true };
}
// breathing (4.2 s) and slow weight shift (9 s) as small pose offsets
export const breath = (t, ph = 0) => Math.sin(t * Math.PI * 2 / 4.2 + ph);
export const weight = (t, ph = 0) => Math.sin(t * Math.PI * 2 / 9 + ph * 1.7) * .7 + Math.sin(t * Math.PI * 2 / 3.7 + ph) * .3;
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
const smo = (x) => x * x * (3 - 2 * x);
// the slow life of one figure: { b breath -1..1, w weight -1..1 (held, then shifted), turn -1..1 and nod -1..1 (a glance, eased) }
export function life(t, seed = 0) {
  const sd = seed * 1.37 + .5, b = Math.sin(t * Math.PI * 2 / 4.2 * (1 + .12 * (hash(sd) - .5)) + sd * 2.3);
  const v = clamp(Math.sin(t * Math.PI * 2 / (8 + 5 * hash(sd * 2.3)) + sd * 2.1) * 2.2, -1, 1), w = v * (3 - v * v) / 2;
  const pg = 6.5 + 4.5 * hash(sd * 3.3), tg = t / pg + hash(sd * 5.1), k = Math.floor(tg), u = tg - k;
  const r1 = hash(k * 7.7 + sd * 1.3), r2 = hash(k * 3.1 + sd * 2.9), on = hash(k * 5.3 + sd) < .82 ? 1 : 0, u0 = .08 + .3 * r2, d = .13, hold = .22 + .2 * r1;
  const env = on * smo(clamp((u - u0) / d)) * (1 - smo(clamp((u - u0 - d - hold) / d)));
  return { b, w, turn: (r1 - .5) * 2 * env, nod: (r2 - .5) * 2 * env };
}
// a blink every 3.4–5 s (lids close in 80 ms, open in 140 ms)
export function blink(t, seed = 0) {
  const sd = seed * 1.37 + .5, per = 3.4 + 1.6 * hash(sd * 7.1), tt = t + hash(sd * 1.9) * per, k = Math.floor(tt / per), d = tt - k * per - per * (.12 + .7 * hash(k * 13.7 + sd));
  return d < 0 || d > .22 ? 0 : d < .08 ? smo(d / .08) : 1 - smo((d - .08) / .14);
}

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
    const ph = (o.seed || 0) * 1.37, Lf = life(o.t, o.seed || 0), b = Lf.b, w = Lf.w, sitting = P.hip[0] > 1 || (P.thigh != null), walking = !!P._walk;
    P._b = b; P._life = Lf; P.lean += w * .014 + b * .004; P.head += b * .015;
    if (!sitting && !walking) { P.hip[0] += w * .05; P.hip[1] -= w * .05; P.kn[w > 0 ? 1 : 0] += Math.abs(w) * .1; }
    if (!(pose.lock && pose.lock[0])) P.sh[0] += .025 * Math.sin(o.t * .9 + ph);
    if (!(pose.lock && pose.lock[1])) P.sh[1] += .02 * Math.sin(o.t * .8 + ph + 1);
    P._wx = walking ? 0 : w * (sitting ? 1 : 2);
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
  if (P._life) P.head += P._life.turn * .17 + P._life.nod * .07;
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
// arm i reaches a screen point (the hand point, as handPos returns it) → { sh, el } for the pose (+ lock it against the idle sway).
// Same o (t, seed) as the figure() call; a point out of reach is approached along the line. elbow -1 bends the other way.
export function reachArm(x, y, s, pose, i, flip, o, target, elbow = 1) {
  const P = resolve(pose, o), f = flip ? -1 : 1, px = x + (P._wx || 0) * s * f, py = y + ((P.dy || 0) + (P._b || 0) * -.35) * s;
  let ux = (target[0] - px) / (s * f), uy = (target[1] - py) / s; const c = Math.cos(-P.lean), sn = Math.sin(-P.lean); [ux, uy] = [ux * c - uy * sn, ux * sn + uy * c];
  const sx = i ? -3 : 3, sy = -64 + (P._b || 0) * -.9 + 7, dx = ux - sx, dy = uy - sy, A = 29, Bf = 30, d = clamp(Math.hypot(dx, dy), Math.abs(A - Bf) + .5, A + Bf - .05);
  const inner = Math.acos(clamp((A * A + Bf * Bf - d * d) / (2 * A * Bf), -1, 1)), alpha = Math.acos(clamp((A * A + d * d - Bf * Bf) / (2 * A * d), -1, 1)), base = Math.atan2(dx, dy);
  const r = elbow > 0 ? { sh: base - alpha, el: Math.PI - inner } : { sh: base + alpha, el: inner - Math.PI };
  if (r.sh < -.35) { r.el += r.sh + .35; r.sh = -.35; }   // the upper arm never swings far behind the back
  return r;
}
function shadeHex(hex, d) { const n = parseInt(hex.slice(1), 16); const fx = (v) => Math.round(clamp(v + d * 255, 0, 255)); return '#' + [fx(n >> 16), fx((n >> 8) & 255), fx(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
export { capsule };

// ---------- figure(): art.person() with Film 5 rules ----------
const SKINS = ['#e9c3a0', '#d9b08e', '#b98762', '#8d5f40', '#6a4430', '#f0d2b4'];
export function figure(ctx, x, y, s, pose = {}, o = {}) {
  const P = resolve(pose, o), flip = !!o.flip;
  if (P._life) { const Lf = P._life; P.turn = (pose.turn || 0) + Lf.turn * .7; P.head += Lf.nod * .07 + Lf.turn * .02; if (pose.eye == null) P.eye = blink(o.t, o.seed || 0); }
  const dress = Object.assign({ coat: '#2c3450', pants: '#15142a', shoes: '#0b0a18', skin: SKINS[(o.seed || 0) % SKINS.length], hair: '#1c1420' }, o.dress || {});
  const part = o.accentPart || 'coat';
  if (o.accent) { if (part === 'scarf') { P.scarf = true; dress.scarf = o.accent; } else dress.coat = o.accent; }
  if (part === 'sleeve' && o.accent) dress.coat = o.accent;
  const px = x + (P._wx || 0) * s * (flip ? -1 : 1), py = y + ((P.dy || 0) + (P._b || 0) * -.35) * s;
  const sitting = P.hip[0] > .9 || P.thigh != null;
  if (o.cast && o.part !== 'front') castShadow(ctx, px, py + 88 * s, s, o.cast.x, o.cast.y, { a: o.cast.a ?? .4, len: o.cast.len ?? 2.4 });
  if (o.shadow !== false && !sitting && o.part !== 'front') {
    const fy = py + 90 * s, g = ctx.createRadialGradient(px, fy, 0, px, fy, 40 * s);
    g.addColorStop(0, 'rgba(4,4,14,.5)'); g.addColorStop(1, 'rgba(4,4,14,0)');
    ctx.save(); ctx.translate(px, fy); ctx.scale(1, .2); ctx.translate(-px, -fy); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, fy, 40 * s, 0, 7); ctx.fill(); ctx.restore();
  }
  return person(ctx, px, py, s, P, { flip, rim: o.rim, rimSide: o.rimSide, rimW: o.rimW, light: o.light, dress, prop: o.prop, shadeA: o.shadeA, shadeCol: o.shadeCol, part: o.part, hatch: o.hatch });
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

// ---------- children (shots.md §6 "Kind": 3.07c, 4.12, 4.16, 4.18) ----------
//   figureKid(ctx, x, y, s, pose, o) → { hand(i), feetY, head }   same conventions as figure(): x,y = hip joint, s = the ADULT scale
//     (so a child next to an adult with the same s has the right size: child ≈ .66, toddler ≈ .48 of an adult's height)
//     pose: KIDPOSES.stand / reachUp (holds an adult's hand above) / hold / sit / squat (crouches to plant) / walk(phase) (shared cycle)
//     o: { age: 'child' | 'toddler', t, seed, dress: { top, pants, shoes, skin, hair }, accent (top colour), hair: 'short' | 'pigtails' |
//          'curly' | 'bob' | 'beanie', light: { x, y, col, a } (form light), rim, rimSide, shadow (true), flip, prop(ctx, frontArm, backArm) }
//   POSES.cradle + cradleProp(o)  an adult holding a baby: figure(ctx, x, y, s, POSES.cradle, { prop: cradleProp({ blanket, skin, t }) })
//   babyBundle(ctx, x, y, s, o)    the swaddled baby alone (o: { t, ang, skin, blanket, hair, light, rim }); s = adult scale
//   smallFeet(ctx, x, y, s, o)     close-up: a small child's bare feet standing on soil; x,y = ground point between the feet,
//                                  s = 1 → a foot ~110 px long; o: { t, skin, soil true, light: { x, y } (warm key light), seed, mud .35 }
//   smallFeetSide(ctx, x, y, s, o) the same feet in profile, toddling (4.18): o.step [near, far] 0..1 (0 flat, .5 heel strike, 1 lifted), o.dir, o.gap
//   babyBed(ctx, x, y, s, kind, o) a sleeping baby in a 'basket' | 'crib' | 'hammock' | 'mat' (4.12, 4.16)
export const KIDPOSES = {
  stand: {},
  reachUp: { sh: [2.45, 0.18], el: [0.12, 0.3], lean: -.03, head: -.15 },
  hold: { sh: [0.7, 0.6], el: [1.2, 1.3], head: .28 },
  sit: { hip: [1.45, 1.5], kn: [1.45, 1.5], sh: [0.5, 0.42], el: [0.8, 0.9], lean: .05 },
  squat: { hip: [1.95, 1.85], kn: [2.5, 2.4], lean: .5, sh: [0.95, 0.75], el: [0.45, 0.55], head: .4, dy: 0 },
};
POSES.cradle = { sh: [0.78, 0.66], el: [1.42, 1.55], head: .34, lean: .02 };
const KIDP = {
  child: { legU: 25, legL: 24, thigh: 6.9, knee: 5.3, ankle: 4.2, foot: [7.2, 3.9], T: 37, shw: 11.6, armU: 17, armL: 15.5, armR: [5.8, 4.6], hand: 3.8, head: [10.8, 11.9], neck: 3.1 },
  toddler: { legU: 15.5, legL: 14, thigh: 7, knee: 5.9, ankle: 4.9, foot: [6.8, 4], T: 27, shw: 11.2, armU: 12, armL: 11, armR: [5.5, 4.9], hand: 3.9, head: [10.6, 11.2], neck: 2.1 },
};
const KIDC = new Map();
export function figureKid(ctx, x, y, s, pose = {}, o = {}) {
  const A = KIDP[o.age || 'child'] || KIDP.child, P = resolve(pose, o), flip = o.flip ? -1 : 1;
  if (P._life) { P.head += P._life.turn * .12 + P._life.nod * .06; P.eye = pose.eye ?? blink(o.t, o.seed || 0); P.turn = P._life.turn * .7; }
  const D = Object.assign({ top: o.accent || '#d9824a', pants: '#2a2f52', shoes: '#16141f', skin: SKINS[(o.seed || 0) % SKINS.length], hair: '#21161a' }, o.dress || {});
  if (o.accent) D.top = o.accent;
  const legY = A.legU + A.legL, sY = -A.T + (P._b || 0) * -.5, pad = Math.ceil(110 * s), key = pad;
  if (!KIDC.has(key)) KIDC.set(key, [canvas(pad * 2, pad * 2), canvas(pad * 2, pad * 2)]);
  const [[c, g], [rc, rg]] = KIDC.get(key); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, pad * 2, pad * 2);
  g.translate(pad, pad); g.scale(s * flip, s);
  const leg = (i) => { const a = P.hip[i], k = P.kn[i], sx = i ? -A.shw * .32 : A.shw * .32, kx = sx + Math.sin(a) * A.legU, ky = Math.cos(a) * A.legU, fx = kx + Math.sin(a - k) * A.legL, fy = ky + Math.cos(a - k) * A.legL;
    g.fillStyle = i ? shadeHex(D.pants, -.05) : D.pants; capsule(g, sx, 0, A.thigh, kx, ky, A.knee); capsule(g, kx, ky, A.knee, fx, fy, A.ankle);
    g.fillStyle = D.shoes; g.beginPath(); g.ellipse(fx + A.foot[0] * .55, fy + A.foot[1] * .6, A.foot[0], A.foot[1], 0, 0, TAU2); g.fill(); return [fx, fy]; };
  const arm = (i) => { const a = P.sh[i], e = P.el[i], sx = i ? -A.shw * .25 : A.shw * .25, sy = sY + A.armR[0] * .9, ex = sx + Math.sin(a) * A.armU, ey = sy + Math.cos(a) * A.armU, hx = ex + Math.sin(a + e) * A.armL, hy = ey + Math.cos(a + e) * A.armL;
    g.fillStyle = i ? shadeHex(D.top, -.07) : D.top; capsule(g, sx, sy, A.armR[0], ex, ey, A.armR[1]); capsule(g, ex, ey, A.armR[1], hx, hy, A.armR[1] * .85);
    g.fillStyle = D.skin; g.beginPath(); g.ellipse(hx + Math.sin(a + e) * A.hand * .7, hy + Math.cos(a + e) * A.hand * .7, A.hand, A.hand * 1.12, -(a + e), 0, TAU2); g.fill(); return { sx, sy, ex, ey, hx, hy, ang: a + e }; };
  leg(1); const f0 = leg(0);
  g.save(); g.translate(P._wx || 0, 0); g.rotate(P.lean);
  const backArm = arm(1);
  // torso: short, round belly, sloping shoulders; the top in the accent colour
  const w = A.shw; g.fillStyle = D.top; g.beginPath();
  g.moveTo(-w * .95, 3); g.bezierCurveTo(-w * 1.15, -A.T * .35, -w * 1.05, sY + 8, -w * .55, sY - 1); g.quadraticCurveTo(0, sY - 4, w * .6, sY - 1);
  g.bezierCurveTo(w * 1.12, sY + 8, w * 1.3, -A.T * .35, w * 1.02, 3); g.quadraticCurveTo(0, 8, -w * .95, 3); g.closePath(); g.fill();
  g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(-w * .9, -2, w * 1.9, 3);   // waistband shadow
  // neck + head (faceless), hair
  g.save(); g.translate(1, sY - 1); g.rotate(P.head); g.fillStyle = D.skin; capsule(g, 0, 2, A.neck + 1, 1, -A.neck, A.neck);
  const hy = -A.neck - A.head[1] * .92; g.beginPath(); g.ellipse(2, hy, A.head[0], A.head[1], .1, 0, TAU2); g.fill();
  g.fillStyle = D.hair; const hs = o.hair || (o.age === 'toddler' ? 'curly' : 'short');
  if (hs === 'beanie') { g.fillStyle = o.accent || D.top; g.beginPath(); g.ellipse(1, hy - A.head[1] * .35, A.head[0] * 1.05, A.head[1] * .78, .1, Math.PI, TAU2 + .05); g.closePath(); g.fill(); g.beginPath(); g.arc(-1, hy - A.head[1] * 1.15, 2.4, 0, TAU2); g.fill(); }
  else if (hs === 'curly') { for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-7 + i * 2.6, hy - A.head[1] * .62 + Math.sin(i * 2.1) * 1.2 + (i < 2 ? 4 : 0), 3.7, 0, TAU2); g.fill(); } }
  else { g.beginPath(); g.ellipse(0, hy - 2.5, A.head[0] * 1.02, A.head[1] * .82, .12, Math.PI * .72, Math.PI * 2.05); g.closePath(); g.fill();
    if (hs === 'pigtails') { for (const sx of [-A.head[0] * .95]) { g.beginPath(); g.ellipse(sx, hy + 2, 3.2, 5.2, .3, 0, TAU2); g.fill(); } }
    if (hs === 'bob') { g.beginPath(); g.moveTo(-A.head[0] * .9, hy - 4); g.quadraticCurveTo(-A.head[0] * 1.2, hy + 6, -A.head[0] * .5, hy + A.head[1] * .75); g.lineTo(-A.head[0] * .2, hy + 2); g.closePath(); g.fill(); } }
  kidFace(g, A, hy, D, s * A.head[1] * 2, P, hs);
  g.restore();
  const frontArm = arm(0);
  if (o.prop) o.prop(g, frontArm, backArm, D);
  g.restore();
  // form light, rim, then onto the frame
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (o.light) { const { x: lx, y: ly, col = '#ffd9a0', a = .5 } = o.light, dx = lx - x, dy = ly - y, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    g.globalCompositeOperation = 'source-atop'; const gr = g.createLinearGradient(pad - ux * 22 * s, pad - 30 * s - uy * 22 * s, pad + ux * 22 * s, pad - 30 * s + uy * 22 * s);
    gr.addColorStop(0, 'rgba(5,6,20,.36)'); gr.addColorStop(.5, 'rgba(5,6,20,0)'); gr.addColorStop(.62, rgba(col, 0)); gr.addColorStop(1, rgba(col, a)); g.fillStyle = gr; g.fillRect(0, 0, pad * 2, pad * 2); g.globalCompositeOperation = 'source-over'; }
  const px = x + (P._wx || 0) * 0, py = y + ((P.dy || 0) + (P._b || 0) * -.25) * s, sitting = P.hip[0] > 1.2;
  if (o.shadow !== false && !sitting) { const fy = y + legY * s, gr = ctx.createRadialGradient(x, fy, 0, x, fy, 26 * s); gr.addColorStop(0, 'rgba(4,4,14,.5)'); gr.addColorStop(1, 'rgba(4,4,14,0)'); ctx.save(); ctx.translate(x, fy); ctx.scale(1, .22); ctx.translate(-x, -fy); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, fy, 26 * s, 0, TAU2); ctx.fill(); ctx.restore(); }
  if (o.rim) { rg.setTransform(1, 0, 0, 1, 0, 0); rg.globalCompositeOperation = 'source-over'; rg.clearRect(0, 0, pad * 2, pad * 2); rg.drawImage(c, 0, 0); rg.globalCompositeOperation = 'source-in'; rg.fillStyle = o.rim; rg.fillRect(0, 0, pad * 2, pad * 2);
    const off = Math.max(1.1, 1.4 * s), side = o.rimSide ?? 1; ctx.drawImage(rc, px - pad + side * off, py - pad - off * .4); }
  ctx.drawImage(c, px - pad, py - pad);
  const toScr = (hx, hy) => { const cs = Math.cos(P.lean), sn = Math.sin(P.lean); return [px + ((hx * cs - hy * sn) + (P._wx || 0)) * s * flip, py + (hx * sn + hy * cs) * s]; };
  return { hand: (i) => { const m = i ? backArm : frontArm; return toScr(m.hx, m.hy); }, feetY: y + legY * s, head: toScr(2, sY - A.neck - A.head[1]) };
}
const TAU2 = Math.PI * 2;
// a child's face in profile on the round head (centre (2, hy)): a small nose, the eye (lid, blink), brow, mouth, cheek, ear.
// px = head height on screen: < 14 px nothing, < 34 px an eye mark + nose + mouth, larger the lid, iris and brow.
function kidFace(g, A, hy, D, px, P, hs) {
  if (px < 14) return;
  const rx = A.head[0], ry = A.head[1], cx = 2, skin = D.skin, big = px >= 34, op = clamp(1 - (P.eye || 0)), tn = clamp(P.turn || 0, -1, 1);
  g.fillStyle = skin; g.beginPath(); g.ellipse(cx + rx * .93, hy + ry * .2, rx * .17, rx * .15, .3, 0, TAU2); g.fill();              // nose
  g.fillStyle = shadeHex(skin, -.05); g.beginPath(); g.ellipse(cx - rx * .12 - tn * 1.2, hy + ry * .14, rx * .17, ry * .25, .1, 0, TAU2); g.fill();   // ear
  g.fillStyle = 'rgba(200,96,76,.16)'; g.beginPath(); g.ellipse(cx + rx * .5, hy + ry * .4, rx * .22, ry * .14, 0, 0, TAU2); g.fill();   // cheek
  const ex = cx + rx * .56 + tn * .8, ey = hy + ry * .05;
  if (big) {
    g.save(); g.beginPath(); g.moveTo(ex - 1.5, ey); g.quadraticCurveTo(ex - .1, ey - 2.4 * op, ex + 1.2, ey + .1); g.quadraticCurveTo(ex, ey + 1.2 * op, ex - 1.5, ey); g.closePath();
    if (op > .1) { g.fillStyle = mixHexF(skin, '#f4ece2', .55); g.fill(); g.clip(); g.fillStyle = '#1d1416'; g.beginPath(); g.arc(ex + .4, ey - .1, 1.0, 0, TAU2); g.fill(); }
    g.restore();
    g.strokeStyle = shadeHex(skin, -.42); g.lineCap = 'round'; g.lineWidth = .55; g.beginPath(); g.moveTo(ex - 1.7, ey); g.quadraticCurveTo(ex - .1, ey - 2.45 * op - .1 + (1 - op) * 1.2, ex + 1.3, ey + .1); g.stroke();
    if (hs !== 'short' && hs !== 'curly') { g.strokeStyle = shadeHex(D.hair, .05); g.lineWidth = .8; g.beginPath(); g.moveTo(ex - 2, ey - 2.4); g.quadraticCurveTo(ex, ey - 3.3, ex + 1.8, ey - 2.6); g.stroke(); }
  } else { g.fillStyle = '#1d1416'; g.beginPath(); g.ellipse(ex + .3, ey, 1.1, .25 + .65 * op, 0, 0, TAU2); g.fill(); }
  g.strokeStyle = rgba(shadeHex(skin, -.45), .85); g.lineWidth = big ? .55 : .75; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx + rx * .86, hy + ry * .5); g.quadraticCurveTo(cx + rx * .74, hy + ry * .53, cx + rx * .64, hy + ry * .48); g.stroke();
}
function mixHexF(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (k) => Math.round(mix((A >> k) & 255, (B >> k) & 255, u)); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }

// the swaddled baby: a blanket bundle with folds, a small head with a wisp of hair, one tiny hand at the face
export function babyBundle(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, b = breath(t * 1.6, 1) * .6, skin = o.skin || '#d9a984', bl = o.blanket || '#efe4cc';
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.ang ?? -.35); ctx.scale(s, s);
  if (o.rim) { ctx.save(); ctx.translate(1.4, -1); ctx.fillStyle = o.rim; ctx.beginPath(); ctx.ellipse(-2, 0, 25, 13 + b * .3, 0, 0, TAU2); ctx.fill(); ctx.beginPath(); ctx.arc(20, -3, 9.5, 0, TAU2); ctx.fill(); ctx.restore(); }
  // blanket body
  const g = ctx.createLinearGradient(-20, -12, 6, 14); g.addColorStop(0, shadeHex(bl, .06)); g.addColorStop(1, shadeHex(bl, -.18));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(26, -10); ctx.bezierCurveTo(14, -15, -18, -15 - b * .3, -27, -4); ctx.bezierCurveTo(-31, 6, -20, 14 + b * .3, -2, 13); ctx.bezierCurveTo(14, 12, 24, 8, 28, 2); ctx.closePath(); ctx.fill();
  // head in the hood of the blanket
  ctx.fillStyle = shadeHex(bl, -.08); ctx.beginPath(); ctx.ellipse(20, -3, 11.5, 10.5, -.2, 0, TAU2); ctx.fill();
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(20.5, -3.2, 8.2, 7.6, -.2, 0, TAU2); ctx.fill();
  ctx.strokeStyle = o.hair || '#2a1c18'; ctx.lineWidth = 1.3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(15.5, -9); ctx.quadraticCurveTo(19, -12.5, 22.5, -10.2); ctx.quadraticCurveTo(20.5, -8.4, 19, -9.6); ctx.stroke();   // a wisp of hair under the hood
  ctx.fillStyle = shadeHex(skin, .05); ctx.beginPath(); ctx.ellipse(12.5, 1.5, 3, 2.6, .3, 0, TAU2); ctx.fill();   // tiny hand
  // folds: engraved lines on the blanket
  ctx.strokeStyle = 'rgba(60,40,30,.32)'; ctx.lineWidth = .7; ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-20 + i * 6, -10 + i * .6); ctx.quadraticCurveTo(-14 + i * 6, 0, -18 + i * 5.5, 10); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(8, -12); ctx.quadraticCurveTo(4, 0, 9, 11); ctx.stroke();
  ctx.restore();
}
export function cradleProp(o = {}) {
  return (g, front, back, D) => {
    const mx = (front.hx + back.hx) / 2 - 2, my = Math.min(front.hy, back.hy) - 6;
    babyBundle(g, mx, my, 1, { ang: -.28, ...o });
    // the front forearm and hand wrap around the bundle again
    g.fillStyle = D.coat || '#2c3450'; capsule(g, front.ex, front.ey, 6.2, front.hx, front.hy, 5);
    g.fillStyle = D.skin || '#c99a74'; g.beginPath(); g.ellipse(front.hx + Math.sin(front.ang) * 3.5, front.hy + Math.cos(front.ang) * 3.5, 4.6, 5.4, -front.ang, 0, TAU2); g.fill();
  };
}

// close-up: a small child's bare feet on dark soil (4.18). Soil crumbs, clods, contact shadow, rim light from the key light.
export function smallFeet(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, skin = o.skin || '#c08a64', r0 = (o.seed ?? 3), Lx = o.light ? o.light.x - x : 300, Ly = o.light ? o.light.y - y : -400, Lm = Math.hypot(Lx, Ly) || 1, lx = Lx / Lm, ly = Ly / Lm;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.soil !== false) {   // soil: dark loam with crumbs and small clods
    const sg = ctx.createRadialGradient(0, 10, 10, 0, 10, 260); sg.addColorStop(0, '#3a2a1f'); sg.addColorStop(.6, '#2a1d16'); sg.addColorStop(1, 'rgba(20,14,11,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(0, 10, 280, 120, 0, 0, TAU2); ctx.fill();
    let r = r0 * 7919 + 1; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 520; i++) { const a = rnd() * TAU2, d = Math.pow(rnd(), .6) * 250, px = Math.cos(a) * d, py = 10 + Math.sin(a) * d * .42, z = .8 + rnd() * 3.2, lit = rnd() < .5; ctx.fillStyle = lit ? `rgba(120,88,62,${.35 + rnd() * .4})` : `rgba(14,9,7,${.4 + rnd() * .4})`; ctx.beginPath(); ctx.ellipse(px, py, z, z * .7, rnd() * 3, 0, TAU2); ctx.fill(); }
  }
  const foot = (fx, mirror, ph) => {
    ctx.save(); ctx.translate(fx, 0); ctx.scale(mirror, 1);
    // contact shadow
    const cg = ctx.createRadialGradient(0, 4, 0, 0, 4, 70); cg.addColorStop(0, 'rgba(6,4,3,.65)'); cg.addColorStop(1, 'rgba(6,4,3,0)'); ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(0, 6, 70, 22, 0, 0, TAU2); ctx.fill();
    // leg stub + foot body (3/4 view from the front, toes toward the viewer-right)
    const g = ctx.createLinearGradient(-30 * lx * mirror, -60, 30 * lx * mirror, 0); g.addColorStop(0, shadeHex(skin, .1)); g.addColorStop(1, shadeHex(skin, -.16)); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(-22, -150); ctx.bezierCurveTo(-24, -90, -30, -40, -34, -8); ctx.bezierCurveTo(-30, 6, 10, 8, 40, 4); ctx.bezierCurveTo(52, 2, 56, -14, 46, -22); ctx.bezierCurveTo(30, -34, 14, -48, 16, -90); ctx.lineTo(18, -150); ctx.closePath(); ctx.fill();
    // toes: five, getting smaller, slight wiggle
    const toes = [[44, -12, 8.5], [55, -6, 6.6], [61, -1, 5.8], [65, 4, 5.1], [67, 9, 4.4]];
    toes.forEach(([tx, ty, tr], i) => { const wg = Math.sin(t * 2 + ph + i * .7) * .8; ctx.fillStyle = shadeHex(skin, -.03 - i * .015); ctx.beginPath(); ctx.ellipse(tx * .82 + wg, ty - 2, tr, tr * .86, 0, 0, TAU2); ctx.fill();
      ctx.fillStyle = 'rgba(255,236,220,.45)'; ctx.beginPath(); ctx.ellipse(tx * .82 + wg + tr * .25, ty - 2 - tr * .3, tr * .38, tr * .28, -.3, 0, TAU2); ctx.fill(); });
    // ankle bone, crease, rim toward the key light
    ctx.strokeStyle = rgba('#3a2216', .35); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(-8, -40, 9, -1.2, 1.4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-20, -70); ctx.quadraticCurveTo(-4, -64, 12, -70); ctx.stroke();
    ctx.strokeStyle = rgba('#ffe2b8', .7); ctx.lineWidth = 2.2; ctx.beginPath(); if (lx * mirror > 0) { ctx.moveTo(18, -150); ctx.lineTo(16, -90); ctx.bezierCurveTo(14, -48, 30, -34, 46, -22); } else { ctx.moveTo(-22, -150); ctx.bezierCurveTo(-24, -90, -30, -40, -34, -8); } ctx.stroke();
    // soil on the toes and the sole edge (the feet are standing IN the earth)
    if (o.soil !== false) { let r = (r0 + ph * 10) * 104729 + 3; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 90 * (o.mud ?? .35) + 20; i++) { const px = -34 + rnd() * 100, py = -2 + rnd() * 10; ctx.fillStyle = rnd() < .5 ? 'rgba(42,29,22,.9)' : 'rgba(96,70,50,.8)'; ctx.beginPath(); ctx.ellipse(px, py, 1 + rnd() * 2.4, .8 + rnd() * 1.6, 0, 0, TAU2); ctx.fill(); } }
    ctx.restore();
  };
  foot(-58, -1, 0); foot(58, 1, 1.3);
  ctx.restore();
}

// ---------- small feet in profile (4.18: two small bare feet toddle into frame next to the sprout) ----------
//   smallFeetSide(ctx, x, y, s, { t, skin, light, soil, seed, step: [near, far] 0..1 (per foot: 0 = flat, .5 = landing on the heel,
//             toes up, 1 = lifted off the ground),
//             gap 105 (units between the feet along the ground), dir 1 | -1 (walking to the right / left) })   x,y = ground point of the near heel;
//             the legs run up ~470·s px: frame them out at the top (a ground-level macro)
function sideFoot(ctx, skin, step, lx, ly, t, ph, near, soilOn, seed) {
  const lift = clamp((step - .5) * 2), heel = clamp(step * 2) * .42, up = lift * 46;
  ctx.save(); ctx.translate(0, -up);
  // pivot on the ball of the foot while the heel rises
  ctx.translate(46, 0); ctx.rotate(-heel + lift * .2); ctx.translate(-46, 0);
  const sk = near ? skin : shadeHex(skin, -.14), dark = shadeHex(sk, -.22), lite = shadeHex(sk, .12);
  // the smaller toes sit behind the big toe and peek over the instep
  for (let i = 3; i >= 0; i--) { const wg = Math.sin(t * 2.2 + ph + i) * .6; ctx.fillStyle = shadeHex(sk, -.1 - i * .03); ctx.beginPath(); ctx.ellipse(57 - i * 5.2 + wg, -13.5 + i * 1.6, 5.2 - i * .45, 4.6 - i * .4, -.35, 0, TAU2); ctx.fill(); }
  // lower leg (chubby calf tapering to the ankle), heel, instep, sole
  const g = ctx.createLinearGradient(-30, -120, 40, 0); g.addColorStop(0, lite); g.addColorStop(.55, sk); g.addColorStop(1, dark); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(-48, -470); ctx.lineTo(-42, -330); ctx.bezierCurveTo(-40, -280, -30, -220, -24, -176); ctx.bezierCurveTo(-34, -140, -32, -100, -22, -66); ctx.bezierCurveTo(-18, -48, -26, -34, -32, -20);
  ctx.bezierCurveTo(-38, -6, -30, 1, -18, 1); ctx.bezierCurveTo(4, 2, 34, 1, 56, 0); ctx.bezierCurveTo(70, -1, 72, -9, 66, -15);
  ctx.bezierCurveTo(52, -20, 30, -26, 14, -42); ctx.bezierCurveTo(8, -50, 7, -62, 9, -76); ctx.bezierCurveTo(13, -110, 18, -150, 20, -190); ctx.bezierCurveTo(24, -230, 30, -280, 34, -330); ctx.lineTo(40, -470); ctx.closePath(); ctx.fill();
  ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(62.5, -7.5, 8.4, 7, -.1, 0, TAU2); ctx.fill();   // the big toe
  ctx.fillStyle = 'rgba(255,236,220,.42)'; ctx.beginPath(); ctx.ellipse(65, -11, 3, 1.8, -.2, 0, TAU2); ctx.fill();   // nail sheen
  // creases: ankle fold, chubby fold on the calf, the arch
  ctx.strokeStyle = rgba('#3a2216', .32); ctx.lineWidth = 1.3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(10, -50); ctx.quadraticCurveTo(-2, -44, -14, -50); ctx.stroke();
  ctx.beginPath(); ctx.arc(-6, -30, 6, -2.2, .6); ctx.stroke();   // ankle bone
  ctx.beginPath(); ctx.moveTo(-26, -104); ctx.quadraticCurveTo(-14, -98, 0, -104); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-12, -5); ctx.quadraticCurveTo(14, -11, 40, -5); ctx.stroke();
  // rim toward the key light (top/back edge) and a warm bounce from the soil underneath
  ctx.strokeStyle = rgba('#ffe2b8', .75 * (near ? 1 : .6)); ctx.lineWidth = 2.4; ctx.beginPath();
  if (lx < 0) { ctx.moveTo(-42, -330); ctx.bezierCurveTo(-40, -280, -30, -220, -24, -176); ctx.bezierCurveTo(-34, -140, -30, -100, -22, -66); ctx.bezierCurveTo(-18, -48, -26, -34, -32, -20); ctx.bezierCurveTo(-38, -6, -30, 1, -18, 1); }
  else { ctx.moveTo(34, -330); ctx.bezierCurveTo(30, -280, 24, -230, 20, -190); ctx.bezierCurveTo(18, -150, 13, -110, 9, -76); ctx.bezierCurveTo(7, -62, 8, -50, 14, -42); ctx.bezierCurveTo(30, -26, 52, -20, 66, -15); }
  ctx.stroke();
  ctx.strokeStyle = rgba('#8a5a34', .45); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-28, 0); ctx.bezierCurveTo(-10, 3, 30, 2, 56, 1); ctx.stroke();
  if (soilOn) { let r = seed * 104729 + 3 + ph * 77; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 46; i++) { const px = -30 + rnd() * 98, py = -3 + rnd() * 6 - (px > 40 ? (px - 40) * .25 * rnd() : 0); ctx.fillStyle = rnd() < .55 ? 'rgba(42,29,22,.9)' : 'rgba(110,80,56,.8)'; ctx.beginPath(); ctx.ellipse(px, py, .8 + rnd() * 2.2, .7 + rnd() * 1.4, 0, 0, TAU2); ctx.fill(); } }
  ctx.restore();
  return up;
}
export function smallFeetSide(ctx, x, y, s, o = {}) {
  const t = o.t ?? 0, skin = o.skin || '#c08a64', Lx = o.light ? o.light.x - x : -300, Ly = o.light ? o.light.y - y : -400, dir = o.dir ?? 1, gap = o.gap ?? 105, st = o.step || [0, 0], seed = o.seed ?? 3;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  if (o.soil !== false) {
    const sg = ctx.createRadialGradient(20, 6, 10, 20, 6, 300); sg.addColorStop(0, '#3a2a1f'); sg.addColorStop(.6, '#2a1d16'); sg.addColorStop(1, 'rgba(20,14,11,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(20, 8, 320, 70, 0, 0, TAU2); ctx.fill();
    let r = seed * 7919 + 1; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 380; i++) { const px = -280 + rnd() * 600, py = -4 + Math.pow(rnd(), 1.4) * 60, z = .8 + rnd() * 3; ctx.fillStyle = rnd() < .45 ? `rgba(120,88,62,${.3 + rnd() * .4})` : `rgba(14,9,7,${.4 + rnd() * .4})`; ctx.beginPath(); ctx.ellipse(px, py, z * 1.3, z * .6, 0, 0, TAU2); ctx.fill(); }
  }
  const shadow = (fx, up, k) => { const cg = ctx.createRadialGradient(fx + 20, 2, 0, fx + 20, 2, 80); cg.addColorStop(0, `rgba(6,4,3,${.7 * k / (1 + up / 30)})`); cg.addColorStop(1, 'rgba(6,4,3,0)'); ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(fx + 20, 3, 82, 12, 0, 0, TAU2); ctx.fill(); };
  // far foot (behind, a little up the ground plane), then the near one
  ctx.save(); ctx.translate(gap, -16); ctx.scale(.92, .92); shadow(0, st[1] > .5 ? (st[1] - .5) * 90 : 0, .8); sideFoot(ctx, skin, st[1], Lx * dir, Ly, t, 1.7, false, o.soil !== false, seed); ctx.restore();
  shadow(0, st[0] > .5 ? (st[0] - .5) * 90 : 0, 1); sideFoot(ctx, skin, st[0], Lx * dir, Ly, t, 0, true, o.soil !== false, seed + 1);
  ctx.restore();
}

// ---------- where babies sleep (4.12 basket by the armchair, 4.16 hammock · basket · crib · mat) ----------
//   babyBed(ctx, x, y, s, kind, o)   kind 'basket' | 'crib' | 'hammock' | 'mat'; x,y = centre of the bed on the ground (hammock: centre
//     of the sling); s = adult scale (the baby is babyBundle at the same s). o: { t, blanket, skin, hair, wood, weave, cloth, light, rim }
export function babyBed(ctx, x, y, s, kind = 'basket', o = {}) {
  const t = o.t ?? 0, b = (o2) => babyBundle(ctx, 0, 0, 1, { ang: 0, t, ...o, ...o2 });
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 'basket') {
    const wv = o.weave || '#b0814f', dk = shadeHex(wv, -.35);
    ctx.fillStyle = 'rgba(4,4,12,.45)'; ctx.beginPath(); ctx.ellipse(0, 2, 46, 7, 0, 0, TAU2); ctx.fill();
    ctx.fillStyle = dk; ctx.beginPath(); ctx.ellipse(0, -22, 40, 9, 0, 0, TAU2); ctx.fill();   // the inside, back rim
    ctx.save(); ctx.translate(0, -24); b(); ctx.restore();
    const g = ctx.createLinearGradient(0, -24, 0, 0); g.addColorStop(0, shadeHex(wv, .1)); g.addColorStop(1, shadeHex(wv, -.25)); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(-40, -22); ctx.bezierCurveTo(-40, -6, -30, 0, 0, 0); ctx.bezierCurveTo(30, 0, 40, -6, 40, -22); ctx.bezierCurveTo(30, -15, -30, -15, -40, -22); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#3a2414', .38); ctx.lineWidth = .8; for (let i = -44; i <= 44; i += 4) { ctx.beginPath(); ctx.moveTo(i, -24); ctx.quadraticCurveTo(i * .92, -10, i * .8, 2); ctx.stroke(); }
    for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.ellipse(0, -22 + j * 5.5, 40 - j * 2.5, 7.5 - j * .5, 0, .1, Math.PI - .1); ctx.stroke(); } ctx.restore();
    ctx.strokeStyle = rgba('#ffd9a0', .55); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, -22, 40, 8.5, 0, .05, Math.PI - .05); ctx.stroke();
  } else if (kind === 'crib') {
    const wd = o.wood || '#c9a27a';
    ctx.strokeStyle = shadeHex(wd, -.3); ctx.lineWidth = 2.2; for (let i = -40; i <= 40; i += 8) { ctx.beginPath(); ctx.moveTo(i + 4, -66); ctx.lineTo(i + 4, -24); ctx.stroke(); }
    ctx.fillStyle = '#e9e0cc'; ctx.fillRect(-46, -30, 92, 9); ctx.save(); ctx.translate(-4, -34); b(); ctx.restore();
    ctx.fillStyle = shadeHex(wd, -.12); ctx.fillRect(-52, -72, 6, 72); ctx.fillRect(46, -72, 6, 72); ctx.fillRect(-52, -72, 104, 5); ctx.fillRect(-52, -24, 104, 5);
    ctx.strokeStyle = wd; ctx.lineWidth = 2.6; for (let i = -40; i <= 40; i += 8) { ctx.beginPath(); ctx.moveTo(i, -67); ctx.lineTo(i, -24); ctx.stroke(); }
    ctx.fillStyle = 'rgba(4,4,12,.4)'; ctx.beginPath(); ctx.ellipse(0, 1, 60, 6, 0, 0, TAU2); ctx.fill();
  } else if (kind === 'hammock') {
    const cl = o.cloth || '#c8442f', sw = Math.sin(t * 1.1) * 3;
    ctx.translate(sw, 0); ctx.strokeStyle = 'rgba(40,28,20,.8)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-50, -14); ctx.lineTo(-120, -110); ctx.moveTo(50, -14); ctx.lineTo(120, -110); ctx.stroke();
    ctx.fillStyle = shadeHex(cl, -.3); ctx.beginPath(); ctx.moveTo(-52, -16); ctx.quadraticCurveTo(0, 22, 52, -16); ctx.quadraticCurveTo(0, -2, -52, -16); ctx.fill();
    ctx.save(); ctx.translate(0, -8); b({ ang: .05 }); ctx.restore();
    const g = ctx.createLinearGradient(0, -10, 0, 16); g.addColorStop(0, shadeHex(cl, .1)); g.addColorStop(1, shadeHex(cl, -.25)); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(-52, -16); ctx.quadraticCurveTo(0, 26, 52, -16); ctx.quadraticCurveTo(0, 6, -52, -16); ctx.fill();
    ctx.strokeStyle = rgba('#ffe2b8', .35); ctx.lineWidth = .8; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-48 + i * 4, -12 + i); ctx.quadraticCurveTo(0, 14 + i * 2, 48 - i * 4, -12 + i); ctx.stroke(); }
  } else {   // mat
    const m = o.weave || '#c9a46a';
    ctx.fillStyle = shadeHex(m, -.2); ctx.beginPath(); ctx.ellipse(0, -2, 64, 15, 0, 0, TAU2); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, -2, 64, 15, 0, 0, TAU2); ctx.clip(); ctx.strokeStyle = rgba('#3a2414', .3); ctx.lineWidth = 1; for (let i = -70; i < 70; i += 5) { ctx.beginPath(); ctx.moveTo(i, -20); ctx.lineTo(i + 12, 16); ctx.stroke(); }
    ctx.fillStyle = rgba('#c8442f', .55); ctx.fillRect(-70, -9, 140, 3); ctx.fillRect(-70, 4, 140, 3); ctx.restore();
    ctx.save(); ctx.translate(0, -12); b({ ang: .02 }); ctx.restore();
  }
  ctx.restore();
}
