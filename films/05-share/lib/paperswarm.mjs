// Thousands of paper fragments (handwriting, print, music, squared paper, recipe cards, letters, code), owner C2 (1.06, 1.07a, 1.10a);
// also used by C10 (6.24). Cached sprites (front-lit and back-lit), a whirl in 2.5D around a vertical axis, depth-sorted, tumbling.
//
// paperSwarm(ctx, t, o) draws only the swarm (no background) and returns anchors.
//   o: { x = 960, y = 540 (foot of the whirl's axis on screen), R = 300 (orbit radius px), u = 0..1 (0 loose whirl → 1 settled into
//        the outline of a building, or into o.shape), kinds = ['hand', 'print', 'notes', 'grid'] (+ 'recipe', 'letter', 'code'),
//        n = 1500, seed = 1, light = '#ffb35c' (back light colour), a = 1,
//        side = 'all' | 'back' | 'front' (draw only the half behind / in front of the axis: put a scaffold or hands in between),
//        shape = null | [[x, y], …] (screen targets for u → 1; e.g. scaffold().outline(n)), height = 1.6 (whirl height in R),
//        tilt = .32 (orbit ellipse squash), rise = 1 (0..1: fragments still lying on the ground lift off and join), inflow = 0 (0..1: they
//        spiral into the axis and vanish, e.g. into the scaffold), sink = [x, y] or { x, y } (where inflow ends, default mid-axis),
//        spin = 1, size = 1 (fragment size factor), back = .6 (0..1 how strongly the light shines through the paper), t0 = 0,
//        trail = .5 (faint light streaks along the orbit, 0 = off) }
//   → { n, centre: [x, y] }
// drawFragment(ctx, kind, x, y, w, rot, o)  one fragment (screen px width w), o: { flip (-1..1, tumble), back 0..1, a, seed }
import { rgba, clamp, mix, eio, eout, sm, prng, canvas } from '../engine.mjs';

const TAU = Math.PI * 2;
const SPR = new Map();
const KINDS = ['hand', 'print', 'notes', 'grid', 'recipe', 'letter', 'code'];
// one sprite: { L: five canvases from front-lit (0) to fully back-lit (4), asp }
function sprite(kind, v) {
  const key = kind + v; if (SPR.has(key)) return SPR.get(key);
  const seed = 17 + v * 31 + KINDS.indexOf(kind) * 101, r0 = prng(seed), portrait = kind === 'recipe' ? false : r0() < .45;
  const w = portrait ? 44 : 64, h = portrait ? 60 : 44, pad = 3;
  // the outline: a slightly irregular quad; one edge may be torn (small zigzag)
  const j = () => (r0() - .5) * 2.6, pts = [[j(), j()], [w + j(), j()], [w + j(), h + j()], [j(), h + j()]];
  if (r0() < .4) { const e = Math.floor(r0() * 4), [a, b] = [pts[e], pts[(e + 1) % 4]], k = 6 + Math.floor(r0() * 4), mid = [];
    for (let i = 1; i < k; i++) { const q = i / k, nx = -(b[1] - a[1]), ny = b[0] - a[0], L = Math.hypot(nx, ny) || 1; const d = (r0() - .3) * 3.2; mid.push([mix(a[0], b[0], q) + nx / L * d, mix(a[1], b[1], q) + ny / L * d]); }
    pts.splice(e + 1, 0, ...mid); }
  const path = (g) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
  const mk = (backlit) => {
    const r = prng(seed + 7);   // same content on both faces
    const [c, g] = canvas(w + pad * 2, h + pad * 2); g.translate(pad, pad);
    path(g);
    const base = kind === 'letter' ? '#efe4cc' : kind === 'recipe' ? '#f4ead2' : kind === 'grid' ? '#eef0e8' : '#ede1c6';
    if (backlit) { const gr = g.createRadialGradient(w * .5, h * .5, 0, w * .5, h * .5, w * .7); gr.addColorStop(0, '#ffe7bd'); gr.addColorStop(.6, '#ffbf72'); gr.addColorStop(1, '#e98a3a'); g.fillStyle = gr; }
    else { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#fbf3e1'); gr.addColorStop(1, base); g.fillStyle = gr; }
    g.fill(); g.save(); g.clip();
    const ink = backlit ? 'rgba(150,62,14,.55)' : 'rgba(31,26,38,.62)', lw = 1.05;
    g.strokeStyle = ink; g.fillStyle = ink; g.lineWidth = lw; g.lineCap = 'round';
    if (kind === 'hand' || kind === 'letter') {   // handwriting: looping strokes on lines
      const rows = kind === 'letter' ? 3 : 5; for (let i = 0; i < rows; i++) { const y = 8 + i * (h - 12) / rows + 4; let x = 5 + r() * 4; g.beginPath(); g.moveTo(x, y); while (x < w - 6 - r() * 10) { const st = 3 + r() * 4; g.quadraticCurveTo(x + st * .5, y - 3 - r() * 3, x + st, y + (r() - .5) * 1.5); x += st; if (r() < .12) { x += 4; g.moveTo(x, y); } } g.stroke(); }
      if (kind === 'letter') { g.strokeStyle = backlit ? 'rgba(150,62,14,.4)' : 'rgba(80,60,40,.45)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w / 2, h * .45); g.lineTo(w, 0); g.stroke(); g.fillStyle = backlit ? 'rgba(170,40,20,.5)' : 'rgba(142,47,42,.8)'; g.beginPath(); g.arc(w / 2, h * .45, 3.2, 0, TAU); g.fill(); }
    } else if (kind === 'print' || kind === 'code') {   // set type: justified rows of word-blocks (code: indented, short)
      const rows = Math.floor((h - 8) / 4.4); for (let i = 0; i < rows; i++) { let x = 5 + (kind === 'code' ? Math.floor(r() * 3) * 5 : 0); const y = 5 + i * 4.4; const end = kind === 'code' ? 12 + r() * (w - 20) : w - 5; while (x < end) { const ww = 2 + r() * 7; g.fillRect(x, y, Math.min(ww, end - x), 1.6); x += ww + 1.6; } }
    } else if (kind === 'notes') {   // a staff with notes
      for (const y0 of [8, h * .55 + 2]) { for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(3, y0 + i * 3); g.lineTo(w - 3, y0 + i * 3); g.stroke(); } for (let x = 8; x < w - 6; x += 6 + r() * 5) { const ny = y0 + Math.round(r() * 8) * 1.5; g.beginPath(); g.ellipse(x, ny, 2, 1.5, -.4, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x + 1.8, ny); g.lineTo(x + 1.8, ny - 8); g.stroke(); } }
    } else if (kind === 'grid') {   // squared paper with a few figures and a sketch
      g.strokeStyle = backlit ? 'rgba(160,80,30,.3)' : 'rgba(70,110,150,.35)'; g.lineWidth = .6; for (let x = 0; x < w; x += 5) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 5) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
      g.strokeStyle = ink; g.lineWidth = 1.1; g.beginPath(); for (let i = 0; i < 6; i++) { const x = 6 + i * (w - 12) / 5, y = h - 8 - (i * i * .5 + r() * 4) * (h - 16) / 16; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    } else if (kind === 'recipe') {   // index card: red header line, a stain, handwriting
      g.strokeStyle = backlit ? 'rgba(170,40,20,.45)' : 'rgba(170,50,40,.7)'; g.beginPath(); g.moveTo(2, 10); g.lineTo(w - 2, 10); g.stroke();
      g.strokeStyle = backlit ? 'rgba(160,80,30,.25)' : 'rgba(80,110,160,.3)'; for (let y = 17; y < h; y += 6) { g.beginPath(); g.moveTo(2, y); g.lineTo(w - 2, y); g.stroke(); }
      g.fillStyle = backlit ? 'rgba(150,62,14,.2)' : 'rgba(140,100,50,.18)'; g.beginPath(); g.arc(w * (.3 + r() * .4), h * (.5 + r() * .3), 6 + r() * 5, 0, TAU); g.fill();
      g.strokeStyle = ink; for (let i = 0; i < 4; i++) { const y = 16 + i * 6; let x = 5; g.beginPath(); g.moveTo(x, y); while (x < w - 10 - r() * 14) { const st = 3 + r() * 3; g.quadraticCurveTo(x + st * .5, y - 3, x + st, y); x += st; } g.stroke(); }
    }
    g.restore();
    g.strokeStyle = backlit ? 'rgba(255,240,210,.85)' : 'rgba(90,70,50,.35)'; g.lineWidth = backlit ? 1.2 : .8; path(g); g.stroke();
    return c;
  };
  const F = mk(false), B = mk(true), L = [F];
  for (const k of [.25, .5, .75]) { const [c, g] = canvas(F.width, F.height); g.drawImage(F, 0, 0); g.globalAlpha = k; g.drawImage(B, 0, 0); L.push(c); }
  L.push(B);
  const out = { L, asp: w / h, pad: pad / w }; SPR.set(key, out); return out;
}
// one fragment through the 2×3 matrix m = [a, b, c, d, e, f] of the caller (no save/restore: fast)
function frag(ctx, m, S, x, y, w, rot, flip, bk, a) {
  const h = w / S.asp, fx = Math.abs(flip) < .06 ? .06 * Math.sign(flip || 1) : flip, co = Math.cos(rot), si = Math.sin(rot);
  // local: rotate(rot) · scale(fx, 1)
  const la = co * fx, lb = si * fx, lc = -si, ld = co;
  ctx.setTransform(m[0] * la + m[2] * lb, m[1] * la + m[3] * lb, m[0] * lc + m[2] * ld, m[1] * lc + m[3] * ld, m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]);
  ctx.globalAlpha = a; const img = S.L[Math.max(0, Math.min(4, Math.round(bk * 4)))], pw = w * (1 + 2 * S.pad), ph = h + w * 2 * S.pad;
  ctx.drawImage(img, -pw / 2, -ph / 2, pw, ph);
}
const mat = (ctx) => { const T = ctx.getTransform(); return [T.a, T.b, T.c, T.d, T.e, T.f]; };
export function drawFragment(ctx, kind, x, y, w, rot = 0, o = {}) {
  const S = sprite(kind, (o.seed ?? 0) % 6), flip = o.flip ?? 1, bk = clamp((o.back ?? 0) + (flip < 0 ? .6 : 0));
  ctx.save(); frag(ctx, mat(ctx), S, x, y, w, rot, flip, bk, o.a ?? 1); ctx.restore();
}
// default target: the outline of a building around the axis (gable, walls, floor lines), in screen px relative to (x, y, R)
function buildingShape(x, y, R, n, seed) {
  const w = R * .85, h = R * 1.5, ridge = R * .5, r = prng(seed + 5), E = [];
  E.push([[-w, 0], [-w, -h]], [[w, 0], [w, -h]], [[-w, -h], [0, -h - ridge]], [[0, -h - ridge], [w, -h]], [[-w, -h], [w, -h]], [[-w, 0], [w, 0]], [[-w, -h * .5], [w, -h * .5]]);
  const L = E.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1])), tot = L.reduce((s, v) => s + v, 0), out = [];
  for (let i = 0; i < n; i++) { let s = r() * tot, e = 0; while (s > L[e]) { s -= L[e]; e++; } const [a, b] = E[e], q = s / L[e]; out.push([x + mix(a[0], b[0], q) + (r() - .5) * 8, y + mix(a[1], b[1], q) + (r() - .5) * 8]); }
  return out;
}
const SHAPES = new Map();
export function paperSwarm(ctx, t, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 540, R = o.R ?? 300, n = Math.min(4000, o.n ?? 1500), seed = o.seed ?? 1, kinds = o.kinds || ['hand', 'print', 'notes', 'grid'];
  const u = clamp(o.u ?? 0), side = o.side || 'all', tilt = o.tilt ?? .32, Hh = (o.height ?? 1.6) * R, rise = clamp(o.rise ?? 1), inflow = clamp(o.inflow ?? 0), spin = o.spin ?? 1, size = o.size ?? 1, back = o.back ?? .6, A = o.a ?? 1;
  if (A <= 0) return { n: 0, centre: [x, y - Hh / 2] };
  let shape = o.shape; if (!shape && u > 0) { const k = [x, y, R, n, seed].join(); if (!SHAPES.has(k)) { if (SHAPES.size > 20) SHAPES.clear(); SHAPES.set(k, buildingShape(x, y, R, n, seed)); } shape = SHAPES.get(k); }
  const sk = o.sink, sink = sk ? (Array.isArray(sk) ? sk : [sk.x, sk.y]) : [x, y - Hh * .45], r = prng(seed * 7 + 3), list = [], trail = o.trail ?? .5, tr2 = [];
  for (let i = 0; i < n; i++) {
    const th0 = r() * TAU, w0 = (.25 + r() * .35) * spin * (r() < .5 ? 1 : .8), rr0 = R * (.45 + Math.pow(r(), .6) * .7), h0 = r(), vh = .035 + r() * .05, ph = r() * TAU, tr = (r() - .5) * 2.4, rot0 = r() * TAU, rs = (r() - .5) * 1.6;
    const kind = kinds[Math.floor(r() * kinds.length)], v = Math.floor(r() * 6), sz = (8 + Math.pow(r(), 2) * 16) * size, q = r(), q2 = r();
    // the whirl: orbit + slow rise (wrapping, faded at the top and bottom of the column)
    const th = th0 + w0 * (t - (o.t0 ?? 0)), hq = (h0 + vh * t) % 1, rr = rr0 * (.8 + .4 * hq), X = Math.cos(th) * rr, Z = Math.sin(th) * rr, wob = Math.sin(t * 1.3 + ph) * 6;
    let px = x + X, py = y - hq * Hh + Z * tilt + wob, depth = Z / R, fade = clamp(hq * 6) * clamp((1 - hq) * 5);
    // rising from the ground: still lying in the plain until its turn
    if (rise < 1) { const lift = eout(clamp((rise - q * .75) / .25)); const gx = x + (q2 - .5) * R * 3.4, gy = y + 10 + q * 60; px = mix(gx, px, lift); py = mix(gy, py, lift); fade = mix(.55, fade, lift); }
    let flip = Math.cos(ph + tr * t), rot = rot0 + rs * t, free = rise < 1 ? eout(clamp((rise - q * .75) / .25)) : 1;
    // settling into the outline (u) and flowing into the axis (inflow)
    if (shape) { const uu = eio(clamp(u * 1.35 - q * .35)); if (uu > 0) { free *= 1 - uu; const [tx, ty] = shape[i % shape.length]; px = mix(px, tx, uu); py = mix(py, ty, uu); fade = mix(fade, 1, uu); flip = mix(flip, .85 + .15 * Math.sin(t + ph), uu); rot = mix(rot, rot0 * .15 + Math.sin(t * .7 + ph) * .1, uu); depth = mix(depth, depth * .2, uu); } }
    if (inflow > 0) { const f = eio(clamp(inflow * 1.4 - q * .4)); free *= 1 - f; px = mix(px, sink[0] + (q2 - .5) * R * .25, f); py = mix(py, sink[1] + (q - .5) * Hh * .5, f); fade *= 1 - sm(clamp((f - .7) / .3)); }
    if (fade <= .02) continue;
    if (side === 'back' && depth > 0) continue; if (side === 'front' && depth <= 0) continue;
    // a short streak behind the fragment along its orbit (shows the turning direction in a still frame)
    if (trail > 0 && free > .05 && (i & 1)) { const pts = []; for (let k = 1; k <= 3; k++) { const tk = th - w0 * .16 * k; pts.push(px - X + Math.cos(tk) * rr, py - Z * tilt + Math.sin(tk) * rr * tilt); } tr2.push([depth, px, py, pts, fade * free]); }
    list.push([depth, kind, v, px, py, sz * (1 + .3 * depth), rot, flip, fade, i]);
  }
  list.sort((p, q) => p[0] - q[0]);
  const m = mat(ctx); ctx.save();
  if (tr2.length) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = o.light || '#ffb35c'; ctx.lineCap = 'round';
    for (const [lo, hi, aa] of [[-1.01, -.2, .1], [-.2, .5, .16], [.5, 1.01, .24]]) { ctx.beginPath(); for (const [d, px, py, P, f] of tr2) { if (d < lo || d >= hi || f < .3) continue; ctx.moveTo(px, py); for (let k = 0; k < 6; k += 2) ctx.lineTo(P[k], P[k + 1]); } ctx.globalAlpha = aa * trail * A; ctx.lineWidth = 1 + (hi > .5 ? .6 : 0); ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over'; }
  for (const [depth, kind, v, px, py, sz, rot, flip, fade] of list) {
    const bl = clamp(back * (.6 - .5 * depth)) , bk = clamp(bl + (flip < 0 ? .6 : 0));
    frag(ctx, m, sprite(kind, v), px, py, sz, rot, flip, bk, A * fade * clamp(.55 + .45 * (depth + 1)));
  }
  ctx.restore();
  return { n: list.length, centre: [x, y - Hh / 2] };
}
