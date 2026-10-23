// Film 7 · c06 · the orbit pieces of the twist (04a). Builder: c06. Pure functions of t and their options, deterministic (prng only).
// The orbit world itself is the kit's (sky, earthHorizon, curve, dome, ring); this file adds what only c06 needs:
//   lampPlate(ctx, t, A)                 a copy of handoff4's 'light' plate (tone lamp) drawn at alpha A (A = 1 → the identical plate)
//   plateOut(ctx, t, k, cx, cy)          leave the lamp plate: the plate (alpha) over a warm light growing from a source point (k 1 → plate)
//   axis(ctx, t, m, st)                  the chart axis ENERGY beside the curve; flicker; the label splits into GROWTH and APPETITE
//   FORKS / forks(ctx, t, m, st)         32 small pairs of lines on 32 city clusters of the kit Earth (cool rises, amber dips): the decoupling
//                                        (st.glint(i) → 0..1: one glint runs up fork i's cool line)
//   WPAIR / worldPair(ctx, t, m, st)     the world's own big pair rising from the left limb: economy (cool) and emissions (amber, flat on a
//                                        dashed RECORD mark); they stay close (st.gap). limbWarm(ctx, t, m, h): warm haze breathing along the limb
//   peel geometry: coolPath(q), peelPts(CW, iS, f, t), helixThread(ctx, t, CW, iS, m, o)   THE SPLIT: the cool fibre unwinds off the amber
//   bendPts(CW, iS, u)                   the amber curve bends over and lies down along the ring (polar morph around the Earth's centre)
//   RING_R                               the radius (world) the bent line lies at (inside the kit ring band)
//   duskPlate(ctx, t, sh, front)         a copy of handoff4's 'dusk' sky plate moved UP by sh px; only below the screen line `front` (soft edge
//                                        above it) — the dusk rises from the limb; sh = 0 and front ≤ -400 → the identical plate
//   sunset(ctx, t, m, u) / sunsetLimb()  the sun sinking behind the left limb (u 1 → 0) and the rose-gold light on the limb
import { W, H, rgba, clamp, lin, mix, sm, prng, drift, text } from '../engine.mjs';
import { vnoise, fbm } from './art.mjs';
import { F7, EARTH, CURVE, onSphere, curve, glowAt, ease, mod, n1, limbY } from './f7_kit.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- the lamp plate (copy of handoff4 lightPlate, tone 'lamp')
const DOTS = (() => { const r = prng(901), d = []; for (let i = 0; i < 2600; i++) d.push([r(), r(), r()]); return d; })();
export function lampPlate(ctx, t, A = 1) {
  if (A <= 0) return;
  const c0 = '#fff1d6', c1 = '#ffcf8a', c2 = '#e08a3c', br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
  const cx = W / 2 + 18 * drift(t, 1, 3), cy = H / 2 + 12 * drift(t, 1, 7);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = clamp(A);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 1150 * br); g.addColorStop(0, c0); g.addColorStop(.42, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = prng(31 + Math.floor(t * 12)); ctx.fillStyle = rgba(c2, .32);
  for (const [u, v, k] of DOTS) {
    const x = u * W, y = v * H, d = Math.hypot(x - cx, y - cy) / 1100; if (d < .35) continue;
    if (k > (d - .35) * 1.4) continue; const s = .8 + r() * 1.1; ctx.fillRect(x + (r() - .5) * 2, y + (r() - .5) * 2, s, s);
  }
  ctx.restore();
}
// leave the plate: the world is drawn; a warm light grows round (cx, cy) and the plate lies over it with alpha; k = 1 → exactly the plate
export function plateOut(ctx, t, k, cx, cy) {
  if (k <= 0) return;
  const kk = clamp(k);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  const R = mix(70, 2600, Math.pow(kk, 1.25)), g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  g.addColorStop(0, rgba('#fff1d6', clamp(.55 + .45 * kk))); g.addColorStop(.28, rgba('#ffcf8a', clamp(.25 + .5 * kk))); g.addColorStop(1, rgba('#e08a3c', 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  lampPlate(ctx, t, kk >= .999 ? 1 : sm(lin(.3, 1, kk)));
}

// ---------------------------------------------------------------- the chart axis and its label (6.01, 6.02)
export const AX = { x: -655, y1: -3545, yl: -3335 };
// st: { a (axis draw-on 0..1), lab 0..1 (label wipe-in), flick [t0,…] (flicker starts), split 0..1, g 0..1 (GROWTH), p 0..1 (APPETITE), tg, tp (their start times) }
export function axis(ctx, t, m, st) {
  const a = st.a ?? 0; if (a <= 0) return;
  const X = m.X(AX.x), Y0 = m.Y(limbY(AX.x) - 6), Y1 = m.Y(AX.y1), Yc = mix(Y0, Y1, ease.out(a));
  ctx.save(); ctx.lineCap = 'round';
  // the engraved axis: a fine line, ticks, a small arrow at the top
  ctx.globalCompositeOperation = 'lighter';
  ctx.strokeStyle = rgba('#cfd6ee', .1); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(X, Y0); ctx.lineTo(X, Yc); ctx.stroke();
  ctx.strokeStyle = rgba('#e6e9f6', .82); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X, Y0); ctx.lineTo(X, Yc); ctx.stroke();
  ctx.lineWidth = 1.1;
  for (let k = 1; ; k++) { const yy = Y0 - k * 34 * Math.max(.6, m.k); if (yy < Yc + 4) break; const big = k % 5 === 0; ctx.strokeStyle = rgba('#e6e9f6', big ? .75 : .45); ctx.beginPath(); ctx.moveTo(X - (big ? 13 : 7), yy); ctx.lineTo(X, yy); ctx.stroke(); }
  if (a > .9) { const q = clamp((a - .9) * 10); ctx.strokeStyle = rgba('#e6e9f6', .7 * q); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(X - 7, Y1 + 12); ctx.lineTo(X, Y1); ctx.lineTo(X + 7, Y1 + 12); ctx.stroke(); }
  ctx.restore();
  // the label
  const lab = st.lab ?? 0; if (lab <= 0) return;
  const bx = X + 30, by = m.Y(AX.yl) + 14;
  // flicker: a failing sign, three quick dims after each start (never a strobe: soft, ≤ .5 s)
  let fl = 1;
  for (const t0 of st.flick || []) { const d = t - t0; if (d < 0 || d > .7) continue; fl *= 1 - .75 * (Math.exp(-((((d - .05) / .04)) ** 2)) + .8 * Math.exp(-((((d - .24) / .05)) ** 2)) + .6 * Math.exp(-((((d - .45) / .06)) ** 2))); }
  const split = ease.io(st.split ?? 0), g = st.g ?? 0, p = st.p ?? 0;
  const size = 40, sp = 11;
  ctx.save(); ctx.font = `600 ${size}px "Inter"`; try { ctx.letterSpacing = sp + 'px'; } catch { }
  const wE = ctx.measureText('ENERGY').width; ctx.restore();
  const word = (s, x, y, col, glowCol, sz, clip) => {
    ctx.save();
    if (clip) { ctx.beginPath(); ctx.rect(clip[0], clip[1], clip[2], clip[3]); ctx.clip(); }
    ctx.shadowColor = glowCol; ctx.shadowBlur = 16;
    text(ctx, s, x, y, { size: sz, weight: 600, color: col, spacing: sp * sz / size });
    ctx.restore();
  };
  // ENERGY (whole, until the split)
  const lw = (wE + 20) * ease.out(lab);
  if (split <= 0) { word('ENERGY', bx, by, rgba('#f3ecda', .95 * fl), rgba('#ffd9a8', .35 * fl), size, [bx - 6, by - 52, lw, 74]); return; }
  // the split: the word tears along its middle; the two halves drift apart and each becomes a new word (mask replace, left to right)
  const mid = by - size * .36;
  const tTop = [bx - 10 * split - (st.tg ? Math.max(0, t - st.tg) * 3 : 0), by - 92 * split - (st.tg ? Math.max(0, t - st.tg) * 5 : 0)];
  const tBot = [bx + 120 * split + (st.tp ? Math.max(0, t - st.tp) * 6 : 0), by + 96 * split + (st.tp ? Math.max(0, t - st.tp) * 3 : 0)];
  const sz2 = mix(size, 54, split);
  ctx.save(); ctx.font = `600 ${sz2}px "Inter"`; try { ctx.letterSpacing = (sp * sz2 / size) + 'px'; } catch { } const wG = ctx.measureText('GROWTH').width, wA = ctx.measureText('APPETITE').width; ctx.restore();
  // top half of ENERGY → GROWTH (cool)
  const gx = tTop[0] + (wG + 30) * ease.out(g);
  ctx.save(); ctx.translate(tTop[0] - bx, tTop[1] - by); word('ENERGY', bx, by, rgba('#e9f4ff', .95), rgba('#bfe3ff', .4), size, [Math.max(bx - 6, gx - (tTop[0] - bx)), by - 52, 400, mid - (by - 52)]); ctx.restore();
  if (g > 0) word('GROWTH', tTop[0], tTop[1] + (sz2 - size) * .5, '#e3f2ff', rgba('#bfe3ff', .65), sz2, [tTop[0] - 6, tTop[1] - 56, (wG + 30) * ease.out(g), 84]);
  // bottom half of ENERGY → APPETITE (amber)
  const ax = tBot[0] + (wA + 30) * ease.out(p);
  ctx.save(); ctx.translate(tBot[0] - bx, tBot[1] - by); word('ENERGY', bx, by, rgba('#ffe6c4', .95), rgba('#ffb35c', .4), size, [Math.max(bx - 6, ax - (tBot[0] - bx)), mid, 400, by + 22 - mid]); ctx.restore();
  if (p > 0) word('APPETITE', tBot[0], tBot[1] + (sz2 - size) * .5, '#ffe2bd', rgba('#ffb35c', .6), sz2, [tBot[0] - 6, tBot[1] - 56, (wA + 30) * ease.out(p), 84]);
  // the tear: a bright hairline between the halves while they part
  const tl = sm(lin(0, .25, split)) * (1 - sm(lin(.5, 1, split)));
  if (tl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#fff6e0', .7 * tl); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(bx - 10, mid); ctx.lineTo(bx + wE + 10, mid); ctx.stroke(); ctx.restore(); }
}

// ---------------------------------------------------------------- the Earth's land model (copied from f7_kit: same seeds → same coasts)
const RC = Math.cos(EARTH.tilt), RS = Math.sin(EARTH.tilt);
const latlon = (nx, ny, nz) => [Math.atan2(nx, ny * RS + nz * RC), Math.asin(clamp(ny * RC - nz * RS, -1, 1))];
const gauss = (x, y, cx, cy, r) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r));
const NL = vnoise(101); vnoise(202); vnoise(303); const NT = vnoise(404);
function landAt(x, y) {
  const v = onSphere(x, y); if (!v) return -1;
  const [lon, lat] = latlon(...v);
  let f = fbm(NL, lon * 2.1 + 7.3, lat * 3.0 + 2.2, 5) - .5;
  f += .32 * gauss(x, y, CURVE.S[0], CURVE.S[1], 520) + .12 * gauss(x, y, -600, -2950, 500) - .3 * gauss(x, y, 780, -2860, 420) - .18 * gauss(x, y, 1250, -2700, 380);
  return f;
}
// the kit's city clusters (same generator), then 32 of them spread over the visible night side (never the hero city)
export const FORKS = (() => {
  const r = prng(4242), cl = [];
  for (let i = 0; i < 9000 && cl.length < 517; i++) {
    const x = -2900 + r() * 5800, y = -3000 + r() * 2400, v = onSphere(x, y); if (!v || v[2] < .03) continue;
    const f = landAt(x, y); if (f < .02) continue;
    const [lon, lat] = latlon(...v), de = fbm(NT, lon * 16, lat * 24, 3); if (r() > Math.pow(de, 3) * 2.5 + .02) continue;
    cl.push([x, y, 8 + r() * r() * 34, Math.round(20 + r() * r() * 260)]);
  }
  const cand = cl.filter(([x, y]) => x > -1950 && x < 2250 && y > -2985 && y < -2080 && Math.hypot(x - CURVE.S[0], y - CURVE.S[1]) > 230).sort((a, b) => b[3] - a[3]);
  const out = [];
  for (const c of cand) { if (out.length >= 32) break; if (out.every((o) => Math.hypot((o[0] - c[0]) * .8, (o[1] - c[1]) * 1.6) > 300)) out.push(c); }
  // fill up with the next best if the spacing rule left fewer than 32
  for (const c of cand) { if (out.length >= 32) break; if (!out.includes(c) && out.every((o) => Math.hypot(o[0] - c[0], (o[1] - c[1]) * 1.4) > 170)) out.push(c); }
  return out.sort((a, b) => a[0] - b[0]).map(([x, y], i) => ({ x, y, i, ph: hash(i * 7.7) * TAU, len: .8 + .4 * hash(i * 3.3), dip: .6 + .5 * hash(i * 5.1) }));
})();
function hash(x) { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); }
// st: { grow(i) → 0..1, open 0..1, flip 0..1, a 1, s (px scale, default 1) }
export function forks(ctx, t, m, st) {
  const a = st.a ?? 1; if (a <= 0) return;
  const S = st.s ?? 1;
  for (const F of FORKS) {
    const g = st.grow(F.i); if (g <= 0) continue;
    const X = m.X(F.x), Y = m.Y(F.y); if (X < -150 || X > W + 50 || Y < -100 || Y > H + 100) continue;
    const L = 76 * S * F.len, open = (st.open ?? 1), wob = .5 + .5 * Math.sin(t * 1.9 + F.ph), fl = (st.flip ?? 0) * (.55 + .45 * wob);
    const cool = [], amb = [];
    for (let q = 0; q <= 1.0001; q += 1 / 24) {
      const d = Math.max(0, q - .28) / .72, x = X + L * q, y0 = Y - L * .2 * q;
      cool.push([x, y0 - L * .62 * d * d * open - L * .05 * d, .9]);
      amb.push([x, y0 + L * .34 * F.dip * d * d * open * (1 - fl) - L * .3 * fl * d * d - L * .05 * d * fl, .9]);
    }
    // the root: a city light
    glowAt(ctx, X, Y, 16 * S, .55 * a * clamp(g * 3), F7.amber, F7.amberCore);
    curve(ctx, t, amb, { tone: 'amber', u: g, w: .5 * S, br: .85 * a, shimmer: 0, ticks: false, sparks: 0, tipA: .6, seed: F.i + 3 });
    const cv = curve(ctx, t, cool, { tone: 'cool', u: g, w: .55 * S, br: .95 * a, ticks: false, tipA: .7, seed: F.i + 5 });
    // one glint running up the cool line, once (st.glint(i) → 0..1 its position, ≤ 0 or ≥ 1: none)
    const gq = st.glint ? st.glint(F.i) : 0;
    if (cv && gq > 0 && gq < 1) { const [gx, gy] = cv.at(ease.io(gq)); glowAt(ctx, gx, gy, 30 * S, .85 * Math.sin(Math.PI * gq), F7.cool, '#ffffff'); }
  }
}

// ---------------------------------------------------------------- the world's own pair (6.07b: "Worldwide, though, … They just haven't yet")
// One big pair of lines rising from the limb on the left: world economy (cool) and world emissions (amber). Both climb together; the
// amber flattens high, on a dashed RECORD mark; the cool runs only a little above it (st.gap). World units, so it rides with the camera.
export const WPAIR = { x0: -2330, x1: -830, top: -3330, H: 1444 };
WPAIR.y0 = limbY(WPAIR.x0);
const wpF = (u) => 1 - Math.pow(1 - u, 2.4);
export function wpairPts(gap, k = 'amber') {
  const P = [], { x0, x1, y0, H: Hh } = WPAIR;
  for (let i = 0; i <= 60; i++) { const u = i / 60, f = wpF(u) + (k === 'cool' ? gap * Math.pow(u, 2.2) : 0); P.push([mix(x0, x1, u), y0 - Hh * f, 1]); }
  return P;
}
// st: { u 0..1 (draw-on by length), gap (cool above amber at the end, in units of H), br 1, rec 0..1 (the record mark draws on), recA 1,
//       pulse 0..1 (the amber tip flares on the mark), tag(ctx, X, Y) (draws the mark's tag at the mark's right end) }
export function worldPair(ctx, t, m, st) {
  const u = st.u ?? 0, br = st.br ?? 1; if (u <= 0 && (st.rec ?? 0) <= 0) return;
  const { x0, x1, top } = WPAIR;
  // the record mark: a fine dashed cream line at the amber's top, from mid-chart to just past the tip
  const rec = st.rec ?? 0;
  if (rec > 0) {
    const xa = m.X(mix(x0, x1, .42)), xb = m.X(x1 + 170), Y = m.Y(top) - 1, xe = mix(xa, xb, ease.out(clamp(rec)));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    ctx.strokeStyle = rgba('#f3ecda', .55 * (st.recA ?? 1)); ctx.lineWidth = 1.4; ctx.setLineDash([10, 9]); ctx.lineDashOffset = 0;
    ctx.beginPath(); ctx.moveTo(xa, Y); ctx.lineTo(xe, Y); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = rgba('#f3ecda', .75 * (st.recA ?? 1)); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(xb, Y - 9); ctx.lineTo(xb, Y + 9); ctx.stroke();
    ctx.restore();
    if (st.tag) st.tag(ctx, xb, Y);
  }
  if (u <= 0) return;
  const sc = (P) => P.map(([x, y, w]) => [m.X(x), m.Y(y), w]);
  const S = clamp(m.k / .36, .7, 1.6);
  glowAt(ctx, m.X(x0), m.Y(WPAIR.y0), 30 * S, .6 * clamp(u * 4) * br, F7.amber, F7.amberCore);
  const a = curve(ctx, t, sc(wpairPts(0, 'amber')), { tone: 'amber', u, w: .95 * S, br: .95 * br, shimmer: .8, sparks: 0, tipA: .9, seed: 21 });
  curve(ctx, t, sc(wpairPts(st.gap ?? .08, 'cool')), { tone: 'cool', u, w: .95 * S, br: 1.0 * br, tipA: .9, seed: 23 });
  const pl = st.pulse ?? 0;
  if (a && pl > 0) { glowAt(ctx, a.tip[0], a.tip[1], 70 * S, .55 * pl, F7.amber, F7.amberCore); glowAt(ctx, a.tip[0], a.tip[1], 190 * S, .16 * pl, F7.amberDeep, F7.amber); }
}
// the warming: a warm haze that breathes up along the limb (outside the disc; 'lighter'), h 0..1
export function limbWarm(ctx, t, m, h) {
  if (h <= 0) return;
  const cx = m.X(0), cy = m.Y(0), r0 = EARTH.R * m.k, br = 1 + .12 * Math.sin(t * 1.4) + .05 * Math.sin(t * 3.1 + 1), ext = (90 + 240 * h) * m.k * br;
  const g = ctx.createRadialGradient(cx, cy, r0 - 30 * m.k, cx, cy, r0 + ext);
  g.addColorStop(0, 'rgba(255,170,100,0)'); g.addColorStop(.08, rgba('#ffc98f', .30 * h)); g.addColorStop(.22, rgba('#ff9a5a', .2 * h)); g.addColorStop(.55, rgba('#d0684e', .07 * h)); g.addColorStop(1, 'rgba(160,70,60,0)');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r0 + ext, 0, TAU); ctx.fill(); ctx.restore();
}

// ---------------------------------------------------------------- THE SPLIT: the cool fibre's own path and the peel
// coolPath(q): world point; q 0 = the hero city S, q 1 = just above the split framing's top edge, q > 1 keeps climbing toward the stars.
// A steeper exponential than the amber: it leaves S on the amber's own tangent (so the two are one line at the root) and turns upward
// sooner, ending near-vertical with a slight lean back; beyond q 1 it keeps climbing on that heading.
const CS = CURVE.S, BC = 3.5, EC = Math.exp(BC) - 1, HC = 930;
export function coolPath(q) {
  if (q <= 1) return [CS[0] + 470 * q - 300 * q * q * q, CS[1] - HC * (Math.exp(BC * q) - 1) / EC];
  const d = q - 1, x1 = CS[0] + 170, y1 = CS[1] - HC;
  return [x1 - 430 * d + 150 * d * d, y1 - (3365 * d - 810 * d * d)];
}
export const coolPts = (q0, q1, n = 160) => { const o = []; for (let i = 0; i <= n; i++) { const q = mix(q0, q1, i / n); const p = coolPath(q); o.push([p[0], p[1], 1]); } return o; };
const normals = (P) => P.map((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; return [-dy / d, dx / d]; });
// the amber at s ∈ [0,1] of its rising part (S → C), interpolated
// the peel (a zipper running up the line): f 0..1 is the front on the amber, rel 0..1 the release once the front has reached the top.
//   free:  the cool fibre below the front, on its own path but bent so it lands exactly on the front (a clean Y, no loop), world [x,y,w]
//   wound: the part above the front, still wound round the amber (helix points [x,y,cos] for helixThread)
//   amber: the amber with a small recoil where the fibre leaves it;  front: the junction point
export function peelState(CW, iS, f, t, rel = 0) {
  const N = CW.length - 1, NA = normals(CW), wound = [], amber = CW.map((p) => [p[0], p[1], p[2]]);
  const fF = clamp(f), helix = (i, s) => { const A = CW[i], nA = NA[i], d = fF - s, loose = 1 + 1.6 * Math.exp(-((d / .06) ** 2)), h = 5.5 * loose, ph = TAU * 7.5 * s - t * 2.4; return [A[0] + nA[0] * h * Math.sin(ph), A[1] + nA[1] * h * Math.sin(ph), Math.cos(ph)]; };
  for (let i = iS; i <= N; i++) {
    const s = (i - iS) / (N - iS), d = fF - s;
    if (d <= 0 && rel <= 0) wound.push(helix(i, s));
    // cause and effect: the amber flinches a little where the fibre leaves it
    const rec = (rel > 0 ? 1 - rel : 1) * 3.2 * Math.exp(-((((d - .015) / .035)) ** 2)), A = CW[i], nA = NA[i];
    amber[i] = [A[0] - nA[0] * rec, A[1] - nA[1] * rec, A[2]];
  }
  if (fF <= 0) return { free: null, wound, amber, front: null };
  // the junction: the helix point at the front (so free and wound meet)
  const iF = Math.min(N, iS + Math.round(fF * (N - iS))), J = helix(iF, (iF - iS) / (N - iS)), C1 = coolPath(fF), D = [J[0] - C1[0], J[1] - C1[1]];
  // the release: the top end springs off the amber's tip to its own path, with one small damped overshoot
  const r = rel <= 0 ? 0 : 1 - Math.exp(-4.5 * rel) * Math.cos(7.5 * rel) * (1 - rel);
  const free = [], n = Math.max(8, Math.round(140 * fF));
  for (let k = 0; k <= n; k++) {
    const s = fF * k / n, c = coolPath(s), h = (k / n) ** 3 * (1 - r);
    free.push([c[0] + D[0] * h, c[1] + D[1] * h, 1]);
  }
  return { free, wound, amber, front: rel > 0 ? null : [J[0], J[1]] };
}
// the fibre still wound round the amber: short segments, brighter where it passes in front (cos > 0)
export function helixThread(ctx, t, m, wound, a = 1) {
  if (!wound || wound.length < 2 || a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let i = 1; i < wound.length; i++) {
    const p = wound[i - 1], q = wound[i], fr = .5 + .5 * q[2];
    ctx.strokeStyle = rgba('#d6eeff', a * (.12 + .55 * fr)); ctx.lineWidth = .8 + 1.1 * fr;
    ctx.beginPath(); ctx.moveTo(m.X(p[0]), m.Y(p[1])); ctx.lineTo(m.X(q[0]), m.Y(q[1])); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the amber bends over and lies down in the ring
export const RING_R = EARTH.R * 1.045;
const polar = (x, y) => [Math.atan2(x, -y), Math.hypot(x, y)];
const fromPolar = (th, r) => [r * Math.sin(th), -r * Math.cos(th)];
// u 0..1: the bend (the top first, the base last); returns world polyline with the same points as CW
export function bendPts(CW, iS, u, ext = 1) {
  if (u <= 0) return CW;
  const N = CW.length - 1, [thS, rS] = polar(CS[0], CS[1]);
  // arc lengths of the rising part (the line keeps its length when it lies down)
  const L = [0]; for (let i = iS + 1; i <= N; i++) L.push(L[L.length - 1] + Math.hypot(CW[i][0] - CW[i - 1][0], CW[i][1] - CW[i - 1][1]));
  const tot = L[L.length - 1];
  return CW.map((p, i) => {
    if (i < iS) return p;
    const s = (i - iS) / (N - iS), lag = .55, b = ease.io(clamp((u - (1 - s) * lag) / (1 - lag)));
    if (b <= 0) return p;
    const [th0, r0] = polar(p[0], p[1]), len = L[i - iS] * ext;
    // target: rise from the city to the ring radius over the first ~140 units, then along the ring (clockwise = to the right)
    const rise = clamp(len / 160), rT = mix(rS, RING_R, ease.sine(rise)), thT = thS + len / RING_R * .98;
    return [...fromPolar(mix(th0, thT, b), mix(r0, rT, b)), p[2]];
  });
}

// ---------------------------------------------------------------- the dusk sky plate (copy of handoff4 skyPlate, tone dusk), movable
const PST = (() => { const r = prng(4242), s = []; for (let i = 0; i < 520; i++) { const m = r(); s.push([r() * W, r() * H, m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4, r() * TAU, .4 + r() * 1.6]); } return s; })();
const PBAND = (() => { const r = prng(55), d = []; for (let i = 0; i < 900; i++) { const x = (r() - .5) * W * 1.5, y = (r() + r() + r() - 1.5) * 150, a = .05 + .1 * r(); d.push([x, y, a]); } return d; })();
const DUSK = ['#0b0f2a', '#3b2f6e', '#c77a8a'];
const hex3 = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const duskAt = (v) => { const a = v < .62 ? hex3(DUSK[0]) : hex3(DUSK[1]), b = v < .62 ? hex3(DUSK[1]) : hex3(DUSK[2]), q = v < .62 ? clamp(v / .62) : clamp((v - .62) / .38); return a.map((c, i) => Math.round(mix(c, b[i], q))); };
// the screen position of a plate star at t (plate coordinates; add -sh when the plate is moved up)
export const plateStar = (i, t) => { const [x, y] = PST[i]; return [((x + t * 2.2) % W + W) % W, ((y + t * .6) % H + H) % H]; };
export const PLATE_STARS = PST;
// sh: the plate is moved UP by sh px (its bottom edge at H - sh; below it the rose of its bottom continues down to `ext` px).
// front: screen y above which the plate is not yet there (soft 260 px edge above it); -1e9 = everywhere.
export function duskPlate(ctx, t, sh = 0, front = -1e9, ext = 0) {
  const soft = 260, mask = (Y) => (Y >= front ? 1 : clamp(1 - (front - Y) / soft));
  if (front > H + 10) return;
  const top = Math.max(-2, front - soft), bot = H - sh + ext;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const full = sh < .5 && front < -soft;
  if (full) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, DUSK[0]); g.addColorStop(.62, DUSK[1]); g.addColorStop(1, DUSK[2]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  else {
    // the gradient with the soft top edge folded into its stops (sampled)
    const y0 = top, y1 = Math.min(H + 2, bot); if (y1 > y0) {
      const g = ctx.createLinearGradient(0, y0, 0, y1), n = 7;
      for (let k = 0; k <= n; k++) { const Y = mix(y0, y1, k / n), v = clamp((Y + sh) / H), c = duskAt(v); g.addColorStop(k / n, `rgba(${c[0]},${c[1]},${c[2]},${mask(Y)})`); }
      ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0);
    }
  }
  // the band (same dots, same drift)
  ctx.save(); ctx.translate(W / 2, H / 2 - sh); ctx.rotate(-.42); const sa = Math.sin(-.42), ca = Math.cos(-.42);
  for (const [x, y, a] of PBAND) { const X = x + t * 1.5, Ys = H / 2 - sh + X * sa + y * ca, k = full ? 1 : (Ys > H - sh ? 0 : mask(Ys)); if (k <= 0) continue; ctx.fillStyle = `rgba(216,230,255,${a * k})`; ctx.fillRect(X, y, 1.3, 1.3); }
  ctx.restore();
  const dx = t * 2.2, dy = t * .6;
  for (const [x, y, s, ph, f] of PST) {
    const tw = .55 + .45 * Math.sin(t * f + ph), X = ((x + dx) % W + W) % W, Y0 = ((y + dy) % H + H) % H;
    if (Y0 > H * .7) continue;
    const Y = Y0 - sh, k = full ? 1 : mask(Y); if (k <= 0 || Y < -14) continue;
    ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8) * k})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
    if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw * k})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the sun setting behind the left limb
export const SUNSET = { th: -.5, rs: 30 };
export function sunset(ctx, t, m, u) {
  if (u <= 0) return null;
  const h = mix(-80, 40, u), [wx, wy] = fromPolar(SUNSET.th, EARTH.R + h), X = m.X(wx), Y = m.Y(wy), k = m.k, br = 1 + .03 * Math.sin(t * 2.3);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  glowAt(ctx, X, Y, 1700 * k * br, .26 * clamp(u * 1.6), '#ff9a6a', '#ffd9b0');
  glowAt(ctx, X, Y, 460 * k * br, .55 * clamp(u * 1.4), '#ffb37a', '#fff1d6');
  glowAt(ctx, X, Y, 100 * k * br, .9 * clamp(u * 2), '#fff1d6', '#ffffff');
  ctx.fillStyle = rgba('#fff6e8', clamp(u * 3)); ctx.beginPath(); ctx.arc(X, Y, SUNSET.rs * k, 0, TAU); ctx.fill();
  ctx.restore();
  return [X, Y];
}
// after earthHorizon: the limb near the sun burns rose-gold (a thin crescent); a = strength
export function sunsetLimb(ctx, t, m, a) {
  if (a <= 0) return;
  const cx = m.X(0), cy = m.Y(0), r = EARTH.R * m.k, thC = SUNSET.th - Math.PI / 2;
  // a gaussian round the sun's angle in 7 stops (conic starts opposite the sun, so the peak sits at .5)
  const prof = (spread, amp, col) => { const cg = ctx.createConicGradient(thC - Math.PI, cx, cy), sg = Math.sqrt(spread / 2) / TAU; for (const k of [-9, -3, -1.5, 0, 1.5, 3, 9]) { const u = clamp(.5 + k * sg, 0, 1), dd = (u - .5) * TAU; cg.addColorStop(u, rgba(col, Math.abs(k) > 8 ? 0 : clamp(amp * Math.exp(-dd * dd / spread)))); } return cg; };
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [lw, sp, amp, dr, col] of [[Math.max(16, 70 * m.k), .12, .2 * a, 8, '#e98a86'], [Math.max(5, 16 * m.k), .06, .5 * a, 2, '#ffc08a'], [1.6, .04, .9 * a, 0, '#ffe2bd']]) {
    ctx.strokeStyle = prof(sp, amp, col); ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(cx, cy, r + dr * m.k, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}
