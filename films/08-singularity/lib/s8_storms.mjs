// Film 8 · the three storms (owner B2; first use c07, also c08 and B3's c09). Engraved, opaque cloud bodies lit from above, never a
// face or a machine: POWER is a whirl (a towering front whose base turns, a spiral current on the sea that pulls lanterns into three
// big dark ships), TRUST is a green-grey sea fog in which every light shows an opaque twin, SPEED is a squall line (a low shelf cloud
// with rain curtains that races in). Plus the storm light (grey-blue tone for sky and sea) and lightning.
//
//   stormTone(ctx, C, k, o)          grey-blue storm light over what is drawn so far (sky and sea): k 0..1; o.kind 'storm'|'trust'|'slate'
//   front(ctx, t, C, o)              a storm front on the horizon (sky directions, at infinity). o: { az, w (rad, half width), h (rad, top el),
//                                    kind 'power'|'trust'|'speed', seed, flash 0..1, fx (-1..1 where the flash sits), bolt (seed, > 0 draws
//                                    a bolt while flash > .5), spin (power: base rotation speed), a (0..1 rise: the front grows up from
//                                    the horizon; opaque at every stage), glow (power: the sick amber of captured lights in its base) }
//                                    → { top: [x, y] screen point of the top centre, base: [x, y] }
//   flashAt(t, times, d)             1 during each flash window (2 frames by default) → lightning flashes on VO words
//   whirl(ctx, t, C, o)              the spiral current on the water (power). o: { x, z, R, a, spin, bright 0..1 (lines catch more light), col }
//   bigShip(ctx, t, C, S)            one big dark ship (power). S: { x, z, head, L (length m), glow 0..1 (its hold lit by the taken lights) }
//                                    → { hold: [X, Y, Z] world point of the hold (where lights fly to) }
//   lightFlight(ctx, t, C, from, to, u, o)   a lantern light carried over the water from a boat to a hold (u 0..1), with its short trail
//   fogBank(ctx, t, C, o)            a bank of sea fog (trust). o: { x0, x1, z0 (leading edge), z1, h (m), a (0..1 density), drift (m/s) }
//   twinLamp(ctx, t, x, y, r, a, o)  a lamp in screen space; o.twin 0..1 opens an opaque twin beside it (o.dx px), o.col
//   squall(ctx, t, C, o)             the squall line in the world (speed). o: { z (leading edge Z), x0, x1, base (m), top (m), a, rain }
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projRuns, projPoly, fillPoly, mixHex, hash, spline, nz, eoX, once, toImg, best as best0 } from './s8_kit.mjs';
import { skyDir } from './s8_sky.mjs';
import { vnoise, fbm, layer, stipple } from './art.mjs';

// ---------------------------------------------------------------- storm light
const TONES = {
  storm: { sky: ['#0e121e', '#232c40', '#55607a'], sea: '#2a3346', color: '#55607a' },
  trust: { sky: ['#0f1418', '#28322e', '#5f6a60'], sea: '#2a3330', color: '#66706a' },
  slate: { sky: ['#0c1020', '#1c2440', '#44507a'], sea: '#202a44', color: '#4a5680' },
};
export function stormTone(ctx, C, k, o = {}) {
  if (k <= 0) return;
  const P = TONES[o.kind] || TONES.storm, hy = C.hy, z = C.F / 1400;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (hy > 0) {   // sky: an overcast that lies over the night (the stars mostly gone), brightest at the horizon
    const g = ctx.createLinearGradient(0, hy - 1100 * z, 0, hy); g.addColorStop(0, rgba(P.sky[0], .9 * k)); g.addColorStop(.55, rgba(P.sky[1], .88 * k)); g.addColorStop(1, rgba(P.sky[2], .9 * k));
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, Math.min(1080, hy + 1));
  }
  if (hy < 1080) {   // sea: lift the dark water toward slate, keep its engraved lines (screen), then colour it (color)
    const y0 = Math.max(0, hy);
    ctx.globalCompositeOperation = 'screen'; const g = ctx.createLinearGradient(0, y0, 0, 1080); g.addColorStop(0, rgba(P.sea, .85 * k)); g.addColorStop(1, rgba('#0a0e18', .5 * k)); ctx.fillStyle = g; ctx.fillRect(0, y0, 1920, 1080 - y0);
    ctx.globalCompositeOperation = 'color'; ctx.fillStyle = rgba(P.color, .55 * k); ctx.fillRect(0, y0, 1920, 1080 - y0);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the storm fronts (sky directions, at infinity)
// each kind has an outline in (x −1..1 across, e 0..1 up) with a boiling edge, filled with an engraved cloud texture (fbm billows, dark
// base, starlit tops), cauliflower billows engraved inside, a cool rim along the top. Opaque at every stage; a = rise from the horizon.
const COL = {
  power: { tex: ['#0c0b16', '#1e1c2c', '#3a3850', '#6a6a88'], rim: '#a4aad0', rain: '#3a3c5c' },
  trust: { tex: ['#1c2024', '#323a3c', '#505a5a', '#7e8886'], rim: '#b4c0bc', rain: '#4a5450' },
  speed: { tex: ['#0e1322', '#1c2438', '#34405e', '#5c6a90'], rim: '#9aa8cc', rain: '#4a5680' },
};
const OUT = {
  // cumulonimbus: a broad tower, an anvil that overhangs both sides
  power: [[-.72, 0], [-.7, .1], [-.62, .2], [-.6, .3], [-.5, .42], [-.44, .55], [-.6, .64], [-.88, .69], [-1.06, .74], [-.98, .79], [-.6, .85], [-.2, .9], [.2, .91], [.6, .87], [.95, .81], [1.08, .76], [.9, .7], [.6, .66], [.42, .6], [.48, .47], [.58, .34], [.64, .2], [.74, .1], [.76, 0]],
  // the fog wall: low, wide, a soft rolling top
  trust: [[-1, 0], [-1.02, .3], [-.9, .62], [-.7, .78], [-.4, .86], [-.1, .9], [.25, .86], [.55, .8], [.82, .66], [1, .4], [1.02, 0]],
  // the shelf cloud: a long wedge, its leading edge low and sharp, layers stacked behind
  speed: [[-1, 0], [-1, .5], [-.8, .8], [-.4, .95], [0, 1], [.4, .96], [.7, .85], [.9, .6], [1.02, .3], [1.04, 0]],
};
const TEXC = new Map();
function frontTex(kind) {
  if (TEXC.has(kind)) return best0(TEXC.get(kind));
  const W0 = 900, H0 = 520, [c, g] = layer(W0, H0), n = vnoise(kind.length * 31 + 7), n2 = vnoise(kind.length * 17 + 3), img = g.createImageData(W0, H0), d = img.data;
  const P = COL[kind].tex.map((h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
  for (let y = 0; y < H0; y++) for (let x = 0; x < W0; x++) {
    const f = fbm(n, x * .006, y * .009, 5), r = 1 - Math.abs(fbm(n2, x * .012, y * .016, 3) * 2 - 1);   // billows + ridges
    const up = 1 - y / H0, m = clamp(.12 + .55 * f + .35 * r * r + .35 * up - .25);
    const i0 = Math.min(2, Math.floor(m * 3)), q = m * 3 - i0, A = P[i0], B = P[i0 + 1], k = (y * W0 + x) * 4;
    d[k] = A[0] + (B[0] - A[0]) * q; d[k + 1] = A[1] + (B[1] - A[1]) * q; d[k + 2] = A[2] + (B[2] - A[2]) * q; d[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  stipple(c, { k: .45, g: 1, seed: 9, boost: 1.8 });
  const r = prng(kind.length * 5 + 1); g.lineCap = 'round';
  for (let k = 0; k < 260; k++) { const x = r() * W0, y = r() * H0, R = 10 + r() * 34; g.strokeStyle = `rgba(200,210,235,${.06 + .06 * (1 - y / H0)})`; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, R, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.strokeStyle = 'rgba(5,5,12,.18)'; g.beginPath(); g.arc(x, y + R * .15, R, Math.PI * .15, Math.PI * .85); g.stroke(); }
  TEXC.set(kind, toImg(c)); return best0(TEXC.get(kind));
}
export function front(ctx, t, C, o) {
  const kind = o.kind || 'power', col = COL[kind], az0 = o.az, wd = o.w ?? .3, hh = o.h ?? .3, rise = clamp(o.a ?? 1), z = C.F / 1400, seed = o.seed || 1;
  const spin = o.spin ?? (kind === 'power' ? .4 : 0), boil = kind === 'speed' ? .5 : .25;
  const D = (x, el) => C.D(...skyDir(az0 + x * wd, el));
  const ctr = D(0, .02); if (!ctr || rise <= 0) return null;
  if (ctr[0] < -2400 * z || ctr[0] > 4300 * z) return null;
  const hy = C.hy, f = o.flash || 0;
  // the outline with its boiling edge (resampled, displaced by slow noise), grown by rise
  const src = OUT[kind], pts = [];
  for (let i = 0; i < src.length - 1; i++) {
    const [x0, e0] = src[i], [x1, e1] = src[i + 1], n = Math.max(2, Math.round(Math.hypot((x1 - x0) * wd, (e1 - e0) * hh) * 260));
    for (let k = 0; k < n; k++) {
      const v = k / n, x = x0 + (x1 - x0) * v, e = e0 + (e1 - e0) * v, edge = e > .02 ? 1 : 0;
      const bump = edge * (.035 * nz(i * 3.1 + v * 4 + t * .12 * boil, seed) + .018 * Math.abs(nz(i * 7 + v * 11 + t * .3 * boil, seed + 2)));
      const sw = kind === 'power' ? .03 * Math.sin(t * .25 * spin + e * 5) * (1 - e) : 0;
      pts.push([x * (1 + bump * .6) + sw, Math.max(0, e + bump) * rise]);
    }
  }
  pts.push(src[src.length - 1]);
  const S = pts.map(([x, e]) => D(x, .004 + e * hh)); if (S.some((p) => !p)) return null;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // rain curtains below the base, slanted, falling
  const rainA = kind === 'trust' ? 0 : kind === 'speed' ? .7 : .5;
  if (rainA > 0 && rise > .2) {
    ctx.strokeStyle = rgba(col.rain, rainA); ctx.lineWidth = 1.4 * Math.max(.7, z); ctx.beginPath();
    for (let i = 0; i < 140; i++) {
      const x = (kind === 'speed' ? -.95 : -.45) + (kind === 'speed' ? 1.9 : .9) * hash(i * 3.1 + seed), dens = .4 + .6 * Math.sin(x * 6 + 1 + t * .1); if (hash(i * 7.7) > dens) continue;
      const p = D(x, .006); if (!p) continue; const sl = (14 + 12 * hash(i)) * z, ph = (t * 1.6 + hash(i * 2.3)) % 1;
      ctx.moveTo(p[0] + sl * ph * .2, p[1] + (hy - p[1]) * ph * .15); ctx.lineTo(p[0] - sl, hy + 1);
    }
    ctx.stroke();
  }
  // the body: texture inside the outline
  ctx.beginPath(); spline(ctx, S, true); ctx.save(); ctx.clip();
  const xs = S.map((p) => p[0]), ys = S.map((p) => p[1]), bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(hy, ...ys);
  const tex = frontTex(kind), dr = (t * (kind === 'power' ? 6 : 3) * z) % ((bx1 - bx0) * .5 + 1);
  ctx.drawImage(tex, bx0 - dr - (bx1 - bx0) * .25, by0, (bx1 - bx0) * 1.5, by1 - by0 + 2);
  // light from above (cool), the dark base, the power front's sick amber glow from the captured lights
  const g = ctx.createLinearGradient(0, by0, 0, by1); g.addColorStop(0, rgba(col.rim, .16)); g.addColorStop(.35, 'rgba(0,0,0,0)'); g.addColorStop(.85, 'rgba(4,4,10,.35)'); g.addColorStop(1, 'rgba(4,4,10,.6)');
  ctx.fillStyle = g; ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0 + 2);
  // cauliflower billows: engraved arcs that boil slowly (lit cap, dark underside)
  const r = prng(seed * 13 + kind.length), NB = kind === 'trust' ? 10 : kind === 'speed' ? 0 : 22;
  for (let i = 0; i < NB; i++) {
    const v = r(), x = (r() * 2 - 1) * (kind === 'power' ? (v > .62 ? 1 : .45) : .95), e = (kind === 'power' ? v * .9 : v * .7) * rise, p = D(x + .01 * Math.sin(t * .2 + i), .004 + e * hh);
    if (!p) continue; const R = (18 + 46 * r()) * z * hh / .3 * (kind === 'trust' ? 1.6 : 1) * (1 + .05 * Math.sin(t * .4 * boil * 4 + i));
    ctx.strokeStyle = rgba(col.rim, .1 + .08 * v); ctx.lineWidth = Math.max(1, R * .04); ctx.beginPath(); ctx.arc(p[0], p[1], R, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    ctx.fillStyle = 'rgba(4,4,10,.16)'; ctx.beginPath(); ctx.ellipse(p[0], p[1] + R * .55, R * 1.1, R * .45, 0, 0, TAU); ctx.fill();
  }
  if (kind === 'speed') for (let k = 0; k < 7; k++) { const e = (.12 + k * .12) * rise, row = []; for (let i = 0; i <= 30; i++) { const x = -1 + 2 * i / 30, p = D(x, .004 + e * hh * (1 - .25 * x * x) + .01 * hh * Math.sin(x * 9 + t * .6 + k)); if (p) row.push(p); } ctx.strokeStyle = rgba(col.rim, .18); ctx.lineWidth = 1.4; ctx.beginPath(); row.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.strokeStyle = 'rgba(4,4,10,.35)'; ctx.lineWidth = 3; ctx.beginPath(); row.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + 4) : ctx.moveTo(p[0], p[1] + 4))); ctx.stroke(); }
  if (o.glow > 0) { const p = D(0, .01); if (p) { ctx.globalCompositeOperation = 'lighter'; const R = 520 * wd / .3 * z; const gg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); gg.addColorStop(0, rgba('#c8783a', .4 * o.glow)); gg.addColorStop(.4, rgba('#7a3a1e', .16 * o.glow)); gg.addColorStop(1, rgba('#3a1a10', 0)); ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(p[0], p[1], R, R * .5, 0, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; } }
  if (f > 0) { const c = D(o.fx ?? -.1, .3 * hh * rise) || ctr; ctx.globalCompositeOperation = 'lighter'; const R = 800 * hh / .3 * z, lg = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], R); lg.addColorStop(0, rgba('#eef6ff', .9 * f)); lg.addColorStop(.3, rgba('#8fb8e6', .45 * f)); lg.addColorStop(1, rgba('#3a4a7a', 0)); ctx.fillStyle = lg; ctx.fillRect(c[0] - R, c[1] - R, 2 * R, 2 * R); }
  ctx.restore();
  // the rim along the top edge (the sky's last light on the tops)
  const top = S.filter((p, i) => pts[i][1] > .08 * rise);
  ctx.strokeStyle = rgba(col.rim, .5); ctx.lineWidth = 1.4 * Math.max(.8, z); ctx.beginPath(); top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  if (f > .5 && o.bolt) bolt(ctx, D(o.fx ?? -.1, .01), hy, o.bolt, f, z);
  ctx.restore();
  return { top: D(0, hh * rise), base: ctr };
}
export function bolt(ctx, s, hy, seed, f, z = 1) {
  if (!s) return;
  const r = prng(seed), pts = [[s[0], s[1]]]; let x = s[0], y = s[1];
  while (y < hy) { y += (14 + 20 * r()) * z; x += (r() - .5) * 34 * z; pts.push([x, Math.min(y, hy)]); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'miter'; ctx.lineCap = 'round';
  for (const [lw, a] of [[10, .15], [3.2, .6], [1.4, 1]]) {
    ctx.strokeStyle = rgba(lw > 2 ? '#a8d0ff' : '#ffffff', a * f); ctx.lineWidth = lw * Math.max(.7, z); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    const m = pts[Math.floor(pts.length * .4)]; if (m) { ctx.moveTo(m[0], m[1]); ctx.lineTo(m[0] + 28 * z, m[1] + 22 * z); ctx.lineTo(m[0] + 40 * z, m[1] + 50 * z); } ctx.stroke();
  }
  const sea = ctx.createRadialGradient(x, hy + 4, 0, x, hy + 4, 260 * z); sea.addColorStop(0, rgba('#a8d0ff', .25 * f)); sea.addColorStop(1, rgba('#a8d0ff', 0)); ctx.fillStyle = sea; ctx.fillRect(x - 260 * z, hy - 40, 520 * z, 300 * z);
  ctx.restore();
}
// flashes on VO words: times = [t0, …], each lasts d (2 frames)
export const flashAt = (t, times, d = 2 / 30) => { for (const a of times) if (t >= a && t < a + d) return 1; return 0; };

// ---------------------------------------------------------------- power, on the water: the spiral current and the big dark ships
export function whirl(ctx, t, C, o) {
  const a = o.a ?? 1; if (a <= 0) return;
  const { x: X0, z: Z0, R } = o, sp = o.spin ?? .25;
  ctx.save(); ctx.lineCap = 'round';
  // the sea round the ships goes dark (a dark pool on the water plane)
  const A = C.plane([X0, .02, Z0], [1, 0, 0], [0, 0, 1]);
  if (A) { ctx.save(); ctx.transform(...A); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.4); g.addColorStop(0, rgba('#020206', .75 * a)); g.addColorStop(.6, rgba('#03030a', .5 * a)); g.addColorStop(1, rgba('#03030a', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R * 1.4, 0, TAU); ctx.fill(); ctx.restore(); }
  // spiral arms: engraved lines that turn inward
  for (let arm = 0; arm < 5; arm++) {
    const pts = [];
    for (let i = 0; i <= 90; i++) { const v = i / 90, rr = R * (1.25 - 1.1 * v), th = arm / 5 * TAU + v * 4.2 - t * sp; pts.push([X0 + Math.sin(th) * rr, .05, Z0 + Math.cos(th) * rr]); }
    for (const run of projRuns(C, pts, .5)) {
      ctx.strokeStyle = rgba(o.col || '#7e8ab8', Math.min(1, .32 * a * (1 + 1.6 * (o.bright || 0)))); ctx.lineWidth = 1.3 * (1 + (o.bright || 0)); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    }
  }
  ctx.restore();
}
const SHIPH = (() => { const g = []; for (let i = 0; i <= 24; i++) { const v = i / 24, s = -.5 + v, bow = clamp((v - .78) / .22), stern = clamp((.06 - v) / .06); g.push([.5 * Math.sqrt(1 - bow * bow) * (1 - .25 * stern), s]); } return g; })();
export function bigShip(ctx, t, C, S) {
  const L = S.L ?? 40, B = L * .17, Hh = L * .12, h = S.head, fx = Math.sin(h), fz = Math.cos(h), rx = Math.cos(h), rz = -Math.sin(h);
  const roll = .012 * Math.sin(t * .6 + S.x), y0 = .2 * Math.sin(t * .5 + S.z);
  const F = (u, v, w) => [S.x + rx * u * B + fx * w * L, y0 + v + u * B * roll, S.z + rz * u * B + fz * w * L];
  const glow = clamp(S.glow ?? 0);
  ctx.save(); ctx.lineJoin = 'round';
  const top = [...SHIPH.map(([u, w]) => F(u, Hh, w)), ...SHIPH.slice().reverse().map(([u, w]) => F(-u, Hh, w))];
  const bot = [...SHIPH.map(([u, w]) => F(u * .85, -.5, w * .97)), ...SHIPH.slice().reverse().map(([u, w]) => F(-u * .85, -.5, w * .97))];
  const dC = C.depth(...F(0, Hh * .5, 0)), quads = [];
  for (let i = 0; i < top.length; i++) { const j = (i + 1) % top.length, q = [top[i], top[j], bot[j], bot[i]]; quads.push([q.reduce((s, p) => s + C.depth(...p), 0) / 4, q, i]); }
  quads.sort((a, b) => b[0] - a[0]);
  for (const [d, q, i] of quads) { const P = projPoly(C, q); if (P.length < 3) continue; const c = mixHex('#07070d', '#191826', .4 + .4 * Math.sin(i * .26)); fillPoly(ctx, P, c); ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.stroke(); }
  fillPoly(ctx, projPoly(C, top), '#0b0a12');
  // the superstructure aft, the cranes, the hold amidships (lit from inside by what it took)
  const box = (u0, u1, w0, w1, v0, v1, cf, cs) => { const c = [[u0, w0], [u1, w0], [u1, w1], [u0, w1]]; const T = c.map(([u, w]) => F(u, v1, w)), Bt = c.map(([u, w]) => F(u, v0, w)); const sides = []; for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; sides.push([[T[i], T[j], Bt[j], Bt[i]], C.depth(...T[i]) + C.depth(...T[j])]); } sides.sort((a, b) => b[1] - a[1]); for (const [q] of sides) fillPoly(ctx, projPoly(C, q), cs); fillPoly(ctx, projPoly(C, T), cf); return T; };
  const holdT = [[-.3, -.12], [.3, -.12], [.3, .18], [-.3, .18]].map(([u, w]) => F(u, Hh + .05, w));
  const HP = projPoly(C, holdT);
  if (fillPoly(ctx, HP, mixHex('#0a0806', '#ffb35c', .2 + .7 * glow))) {
    if (glow > 0) { ctx.save(); fillPoly(ctx, HP); ctx.clip(); const c = HP.reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]); const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 160); g.addColorStop(0, rgba('#fff1d6', .9 * glow)); g.addColorStop(1, rgba('#c4512e', .4 * glow)); ctx.fillStyle = g; ctx.fillRect(c[0] - 200, c[1] - 200, 400, 400); ctx.restore(); }
  }
  box(-.42, .42, -.46, -.3, Hh, Hh + L * .09, '#0d0c16', '#08070e');
  box(-.25, .25, -.44, -.36, Hh + L * .09, Hh + L * .14, '#0d0c16', '#08070e');
  for (const w of [-.2, .3]) { const a = C.P(...F(0, Hh, w)), b = C.P(...F(0, Hh + L * .2, w)), c2 = C.P(...F(0, Hh + L * .16, w + .12)); if (a && b && c2) { ctx.strokeStyle = '#08070e'; ctx.lineWidth = Math.max(1.4, a[2] * .35); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c2[0], c2[1]); ctx.stroke(); ctx.strokeStyle = rgba('#8a90b8', .35); ctx.lineWidth = 1; ctx.stroke(); } }
  // rim light along the deck edge
  for (const run of projRuns(C, [...top, top[0]])) { ctx.strokeStyle = rgba(glow > .3 ? '#d89a5a' : '#8a90b8', .35 + .3 * glow); ctx.lineWidth = 1.4; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  // the glow spills up out of the hold
  if (glow > 0) { const p = C.P(...F(0, Hh + 1, .03)); if (p) { ctx.globalCompositeOperation = 'lighter'; const R = p[2] * L * .35 * (1 + .03 * Math.sin(t * 5 + S.x)); const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, rgba('#ffb35c', .5 * glow)); g.addColorStop(.35, rgba('#c4512e', .15 * glow)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.fill(); } }
  ctx.restore();
  return { hold: F(0, Hh + .3, .03), depth: dC };
}
// a lantern's light pulled over the water into a hold: an arc low over the sea, curling with the whirl, a short warm trail
export function lightFlight(ctx, t, C, from, to, u, o = {}) {
  if (u <= 0 || u >= 1) return;
  const curl = o.curl ?? 1, pos = (v) => { const e = v * v * (3 - 2 * v), x = from[0] + (to[0] - from[0]) * e, z = from[2] + (to[2] - from[2]) * e, y = from[1] + (to[1] - from[1]) * e + Math.sin(Math.PI * v) * 1.2; const dx = to[0] - from[0], dz = to[2] - from[2], d = Math.hypot(dx, dz) || 1, s = Math.sin(Math.PI * v) * d * .22 * curl; return [x + dz / d * s, y, z - dx / d * s]; };
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const pts = []; for (let i = 0; i <= 10; i++) { const v = Math.max(0, u - .18 * i / 10); const p = C.P(...pos(v), .3); if (p) pts.push(p); }
  for (let i = 1; i < pts.length; i++) { const a = 1 - i / pts.length; ctx.strokeStyle = rgba('#ffb35c', .55 * a); ctx.lineWidth = Math.max(1, pts[i][2] * .18 * a); ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
  const p = pts[0]; if (p) { const R = Math.max(5, p[2] * 1.1), g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, rgba('#fff1d6', .95)); g.addColorStop(.2, rgba('#ffb35c', .6)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], R, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ---------------------------------------------------------------- trust: sea fog and doubled lights
const FOGPUFF = () => once('s8storm-fogpuff', () => {
  const S = 256, [c, g] = layer(S, S), n = vnoise(91), img = g.createImageData(S, S), p = img.data;
  for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) { const dx = (i - S / 2) / (S / 2), dy = (j - S / 2) / (S / 2), d = Math.hypot(dx, dy * 1.5), v = clamp(1 - d) ** 1.1 * (.6 + .9 * (fbm(n, i * .028, j * .028, 4) - .4)), k = (j * S + i) * 4; p[k] = 92; p[k + 1] = 104; p[k + 2] = 98; p[k + 3] = Math.round(255 * clamp(v * 1.6)); }
  g.putImageData(img, 0, 0); stipple(c, { k: .4, g: 1, seed: 5, boost: 1.6 }); return c;
});
const FOGP = (() => { const r = prng(919), a = []; for (let i = 0; i < 140; i++) a.push({ u: r(), dz: r(), y: r(), s: .7 + r() * .9, ph: r() * TAU }); return a; })();
export function fogBank(ctx, t, C, o) {
  const a = o.a ?? 1; if (a <= 0) return;
  const im = FOGPUFF(), x0 = o.x0 ?? -200, x1 = o.x1 ?? 200, z0 = o.z0, z1 = o.z1 ?? z0 + 200, h = o.h ?? 18, dr = (o.drift ?? .6) * t;
  const list = [];
  for (const P of FOGP) {
    const X = x0 + ((P.u * (x1 - x0) + dr) % (x1 - x0) + (x1 - x0)) % (x1 - x0), Z = z0 + P.dz * (z1 - z0), Y = P.y * h * .7 + .3 * h * Math.sin(t * .15 + P.ph) * .2;
    const p = C.P(X, Y, Z, .5); if (!p) continue;
    const s = P.s * h * p[2]; if (p[0] + s * 1.6 < 0 || p[0] - s * 1.6 > 1920 || p[1] - s > 1080) continue;
    list.push([C.depth(X, Y, Z), p, s]);
  }
  list.sort((p, q) => q[0] - p[0]);
  ctx.save(); ctx.globalAlpha = .9 * a;
  for (const [, p, s] of list) ctx.drawImage(im, p[0] - s * 1.6, p[1] - s * .8, s * 3.2, s * 1.6);
  ctx.restore();
}
// a lamp in screen space with an opaque twin that slides out beside it (the doubled light of the trust storm)
export function twinLamp(ctx, t, x, y, r, a, o = {}) {
  const col = o.col || '#ffb35c', core = o.core || '#fff1d6', tw = clamp(o.twin ?? 0), dx = (o.dx ?? r * 2.4) * eoX(tw);
  const one = (xx, ph) => { const R = r * (1 + .06 * Math.sin(t * 7.3 + ph) + .04 * Math.sin(t * 17 + ph * 2)); const g = ctx.createRadialGradient(xx, y, 0, xx, y, R * 4); g.addColorStop(0, rgba(core, a)); g.addColorStop(.12, rgba(col, .7 * a)); g.addColorStop(.4, rgba(col, .14 * a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(xx, y, R * 4, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(core, a); ctx.beginPath(); ctx.arc(xx, y, Math.max(1, R * .35), 0, TAU); ctx.fill(); };
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  one(x, o.seed || 0);
  if (tw > 0) one(x + dx, (o.seed || 0) + 2.1);   // the twin: the same brightness, its own flicker (not a ghost)
  ctx.restore();
}

// ---------------------------------------------------------------- speed: the squall line in the world (it races in over the sea)
export function squall(ctx, t, C, o) {
  const a = o.a ?? 1; if (a <= 0) return;
  const Z = o.z, x0 = o.x0 ?? -400, x1 = o.x1 ?? 400, base = o.base ?? 14, top = o.top ?? 70, depth = o.depth ?? 600;
  ctx.save(); ctx.lineCap = 'round';
  // the dark wall behind the leading edge (rain-filled air), from the sea to the cloud base
  const wall = projPoly(C, [[x0, 0, Z + 6], [x1, 0, Z + 6], [x1, base, Z + 10], [x0, base, Z + 10]]);
  if (fillPoly(ctx, wall)) { const ys = wall.map((p) => p[1]), g = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys)); g.addColorStop(0, rgba('#0e1322', .95 * a)); g.addColorStop(1, rgba('#1c2438', .9 * a)); ctx.fillStyle = g; ctx.fill(); }
  // rain curtains: long slanted strokes from the base down to the sea, falling (time-lapse)
  ctx.strokeStyle = rgba('#5a6890', .45 * a); ctx.lineWidth = 1.2; ctx.beginPath();
  for (let i = 0; i < 260; i++) {
    const X = x0 + (x1 - x0) * hash(i * 1.37), dz = 4 + 30 * hash(i * 2.9), ph = (t * 1.3 + hash(i * 4.1)) % 1;
    const p = C.P(X, base * (1 - ph * .5), Z + dz, .5), q = C.P(X - 3, 0, Z + dz - 2, .5); if (!p || !q) continue;
    if (p[0] < -50 || p[0] > 1970) continue; ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
  }
  ctx.stroke();
  // the shelf: its underside (a plane at the base, receding), then the stepped front face, both carrying the engraved cloud texture
  const tex = frontTex('speed');
  const under = projPoly(C, [[x0, base, Z + 4], [x1, base, Z + 4], [x1, base + 6, Z + depth], [x0, base + 6, Z + depth]]);
  const ftop = []; for (let i = 0; i <= 48; i++) { const X = x1 - (x1 - x0) * i / 48; ftop.push([X, base + (top - base) * (.55 + .3 * nz(X * .006 + t * .05, 3) + .15 * Math.abs(nz(X * .03 + t * .2, 5))), Z + 40]); }
  const face = projPoly(C, [[x0, base, Z + 4], [x1, base, Z + 4], ...ftop]);
  for (const [P, dark] of [[face, .2], [under, .45]]) {
    if (!fillPoly(ctx, P)) continue; ctx.save(); ctx.clip();
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]), bx = Math.min(...xs), by = Math.min(...ys), bw = Math.max(...xs) - bx, bh = Math.max(...ys) - by;
    ctx.drawImage(tex, bx - (t * 20) % 200, by, bw + 400, bh + 2);
    ctx.fillStyle = `rgba(4,6,14,${dark})`; ctx.fillRect(bx, by, bw, bh + 2);
    // the rolls: striations parallel to the leading edge
    ctx.strokeStyle = 'rgba(150,165,205,.16)'; ctx.lineWidth = 1.3;
    for (let k = 1; k < 14; k++) { const zz = Z + 4 + (dark > .3 ? depth : 36) * Math.pow(k / 14, 1.6), yy = dark > .3 ? base + 6 * k / 14 : base + (top - base) * k / 14; const run = projRuns(C, [[x0, yy, zz], [x1, yy, zz]], .5); for (const r of run) { ctx.beginPath(); r.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + 2 * Math.sin(t + k)) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
    ctx.restore();
  }
  const col = { rim: '#9aa8cc' };
  // the roll's leading lip: a long rolling tube along the front edge (it turns: engraved lines run over it)
  const lip = []; for (let i = 0; i <= 60; i++) { const X = x0 + (x1 - x0) * i / 60; lip.push([X, base + 2 + 1.2 * Math.sin(X * .05 + t * .5), Z + 4]); }
  for (const run of projRuns(C, lip, .5)) {
    const k = run[Math.floor(run.length / 2)][2], R = Math.max(4, 7 * k);
    ctx.strokeStyle = '#1c2438'; ctx.lineWidth = R * 2; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    ctx.strokeStyle = rgba(col.rim, .4); ctx.lineWidth = Math.max(1, R * .12); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] - R) : ctx.moveTo(p[0], p[1] - R))); ctx.stroke();
    ctx.strokeStyle = rgba('#05060c', .4); ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i < run.length - 1; i += 2) { const p = run[i], ph = ((i * .7 + t * 3) % 2) - 1; ctx.moveTo(p[0] - R * .6, p[1] + R * ph * .8); ctx.lineTo(p[0] + R * .6, p[1] + R * ph * .8 - R * .3); }
    ctx.stroke();
  }
  // whitecaps on the sea under the leading edge
  ctx.strokeStyle = rgba('#c8d4f0', .45 * a); ctx.lineWidth = 1.4; ctx.beginPath();
  for (let i = 0; i < 160; i++) { const X = x0 + (x1 - x0) * hash(i * 5.3), dz = -8 + 24 * hash(i * 6.1), ph = (t * 2 + hash(i)) % 1; if (ph > .5) continue; const p = C.P(X, .1, Z + dz, .5); if (!p) continue; const L = (4 + 6 * hash(i * 2)) * p[2] * .3; ctx.moveTo(p[0] - L, p[1]); ctx.lineTo(p[0] + L, p[1]); }
  ctx.stroke();
  ctx.restore();
}
