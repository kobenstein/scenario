// c16 · the grid of weeks: the deep sky plate's stars slow down, fly into 80 rows × 52 engraved rings (a life of ~4,000 weeks),
// the lived weeks fill amber up to a breathing "now" ring, the camera dives into one of the last rings (a portal: the room is drawn
// inside it by the caller), comes back out, glides along the last row to the very last week, turns to look back over the whole grid,
// the weeks light in a wave and the amber flows out of the grid as a river of light into which the camera dives (the fire plate).
// World: y up, the grid lies in the plane y = 0; ring (row r, col c) sits at X = c, Z = r (1 unit = one week's pitch); rows run down
// the screen in the top-down overview (screen up = -Z).
//   gridSetup(A)                  build stars, rings, river (cached); A = anchors (scenes/sc16.mjs)
//   gridCamAt(t, A) → cam state   { x, y, z, yaw, pitch, f }
//   drawGrid(ctx, t, A, o)        o: { portal(ctx, t, ring) draws the room into the room ring (ring: {cx, cy, R, m: [a,b,c,d]}),
//                                       plate(ctx, t) the fire plate (for the river's surface) }
//   ROOM_RING                     { r, c } of the ring that opens into the room
import { W, H, rgba, clamp, mix, lin, sm, prng, canvas, text } from '../engine.mjs';
import { once, onceRaw, toImg, best, eoX, eiX, qio, cio, sstep, smoother, hash, cam3, SKYP, skyGround, TAU } from './v2_c16_kit.mjs';

export const COLS = 52, ROWS = 80, NR = COLS * ROWS, RING = .36;
export const NOW = { r: 33, c: 18 }, NOWK = NOW.r * COLS + NOW.c;
export const ROOM_RING = { r: 79, c: 13 };
const ROOMK = ROOM_RING.r * COLS + ROOM_RING.c;
const F0 = 1400, S0 = 30;                        // px per unit at the plate (camera height F0 / S0)
const G0 = { x: 25.5, z: 39.5 };                // the plane point under the camera at the plate
const OV = { x: -10.5, z: 44, d: 140 };          // the overview: 10 px per unit, grid at the right of the frame
const CREAM = '#f3efe2', AMB = '#ffb35c', CORE = '#fff1d6';

// ======================================================================= camera
// look-at states { tx, ty, tz, d, yaw, elev, f } → cam3 states (pos = target - d·forward)
const fwd = (yaw, pitch) => [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)];
export function lookCam(s) {
  const F = fwd(s.yaw, -s.elev);
  return { x: s.tx - s.d * F[0], y: (s.ty || 0) - s.d * F[1], z: s.tz - s.d * F[2], yaw: s.yaw, pitch: -s.elev, f: s.f || F0 };
}
// interpolate look-at keys: position of the target linear, distance in log space, angles linear; e = easing
function lookMix(a, b, u, o = {}) {
  const e = (k, def) => (o[k] ? o[k](u) : def(u));
  const up = e('pos', (x) => x), ud = e('dist', (x) => x), ua = e('ang', (x) => x);
  return { tx: mix(a.tx, b.tx, up), ty: mix(a.ty || 0, b.ty || 0, up), tz: mix(a.tz, b.tz, up), d: Math.exp(mix(Math.log(a.d), Math.log(b.d), ud)),
    yaw: mix(a.yaw, b.yaw, ua), elev: mix(a.elev, b.elev, ua), f: mix(a.f || F0, b.f || F0, ua) };
}
const TOP = Math.PI / 2;
export function gridKeys(A) {
  const K = {
    start: { tx: G0.x, tz: G0.z, d: F0 / S0, yaw: 0, elev: TOP },
    ov: { tx: OV.x, tz: OV.z, d: OV.d, yaw: 0, elev: TOP },
    ovEnd: { tx: OV.x + .6, tz: OV.z - .4, d: OV.d * .935, yaw: 0, elev: TOP },
    diveMid: { tx: 9, tz: 66, d: 26, yaw: .1, elev: 1.02 },
    ring: { tx: ROOM_RING.c, tz: ROOM_RING.r, d: .3, yaw: 0, elev: TOP },
    exitUp: { tx: ROOM_RING.c + .4, tz: ROOM_RING.r - .2, d: 5.5, yaw: .25, elev: 1.25 },
    glide0: { tx: ROOM_RING.c + 6, tz: ROOM_RING.r - .1, d: 4.4, yaw: Math.PI / 2, elev: .42 },
    glide1: { tx: 48.6, tz: 79, d: 4.1, yaw: Math.PI / 2, elev: .4 },
    last: { tx: 51, tz: 79, d: 3.6, yaw: Math.PI / 2 - .08, elev: .46 },
    back: { tx: 37, tz: 63, d: 24, yaw: -.72, elev: .33 },
    backEnd: { tx: 36.4, tz: 62.2, d: 22.8, yaw: -.74, elev: .335 },
    river: { tx: 55.6, tz: 83.6, d: 2.3, yaw: -.785, elev: TOP - .02 },
  };
  return K;
}
export function gridCamAt(t, A) {
  const K = A.K || (A.K = gridKeys(A));
  let s;
  if (t < A.fly0) s = K.start;
  else if (t < A.fly1) { const u = lin(A.fly0, A.fly1, t); s = lookMix(K.start, K.ov, u, { pos: cio, dist: (x) => cio(x), ang: cio }); }
  else if (t < A.dive0) s = lookMix(K.ov, K.ovEnd, sm(lin(A.fly1, A.dive0, t)));
  else if (t < A.ringIn) {
    // the dive: one curve through ovEnd → diveMid → ring, the distance shrinking exponentially, the tilt rising and settling
    const u = lin(A.dive0, A.ringIn, t), w = qio(u);
    const a = lookMix(K.ovEnd, K.diveMid, clamp(w / .55), { pos: sm, dist: sm, ang: sm }), b = lookMix(K.diveMid, K.ring, clamp((w - .45) / .55), { pos: sm, dist: sm, ang: sm });
    const k = sstep(.4, .6, w);
    s = { tx: mix(a.tx, b.tx, k), tz: mix(a.tz, b.tz, k), d: Math.exp(mix(Math.log(a.d), Math.log(b.d), k)), yaw: mix(a.yaw, b.yaw, k), elev: mix(a.elev, b.elev, k) };
  }
  else if (t < A.ringOut) s = K.ring;
  else if (t < A.glide0) { const u = lin(A.ringOut, A.glide0, t); const a = lookMix(K.ring, K.exitUp, clamp(u / .5), { pos: sm, dist: eoX, ang: sm }), b = lookMix(K.exitUp, K.glide0, clamp((u - .4) / .6), { pos: sm, dist: sm, ang: sm }); const k = sstep(.4, .55, u); s = { tx: mix(a.tx, b.tx, k), tz: mix(a.tz, b.tz, k), d: Math.exp(mix(Math.log(a.d), Math.log(b.d), k)), yaw: mix(a.yaw, b.yaw, k), elev: mix(a.elev, b.elev, k) }; }
  else if (t < A.arrive) s = lookMix(K.glide0, K.glide1, lin(A.glide0, A.arrive, t), { pos: (x) => x * .85 + .15 * sm(x), dist: sm, ang: sm });
  else if (t < A.turn0) s = lookMix(K.glide1, K.last, lin(A.arrive, A.turn0, t), { pos: eoX, dist: sm, ang: sm });
  else if (t < A.turn1) s = lookMix(K.last, K.back, lin(A.turn0, A.turn1, t), { pos: qio, dist: (x) => cio(x), ang: qio });
  else if (t < A.riv1) s = lookMix(K.back, K.backEnd, sm(lin(A.turn1, A.riv1, t)));
  else s = lookMix(K.backEnd, K.river, lin(A.riv1, A.end, t), { pos: (x) => eiX(x * .7 + .3) * .9 + x * .1, dist: (x) => Math.pow(x, 1.6), ang: (x) => sm(x) });
  return lookCam(s);
}

// ======================================================================= time warp (let time stop for a moment)
export function tau(t, A) {
  const t0 = A.Hb, D = A.slow1 - t0, rmin = .04;
  if (t <= t0) return t;
  const u = (t - t0) / D;
  if (u <= 1) return t0 + D * (u - (1 - rmin) * (u ** 3 - u ** 4 / 2));
  const tau1 = t0 + D * (1 - (1 - rmin) * .5), t1 = A.slow1;
  // time resumes softly once the grid stands (the sky twinkles again, slowly)
  const r2 = .3, ta = A.fly1, tb = A.fly1 + 2.5;
  if (t <= ta) return tau1 + rmin * (t - t1);
  const base = tau1 + rmin * (ta - t1), v = Math.min(t, tb) - ta, Dv = tb - ta, ramp = rmin * v + (r2 - rmin) * Dv * ((v / Dv) ** 3 - (v / Dv) ** 4 / 2);
  return base + ramp + (t > tb ? r2 * (t - tb) : 0);
}

// ======================================================================= the stars
// plate stars split into sky stars (stay, at infinity) and plane stars (fly into the grid); more of both beyond the first frame
function buildStars(A) {
  return onceRaw('c16stars', () => {
    const plane = [], sky = [];
    const camD = (sx, sy) => { const x = (sx - 960) / F0, z = (sy - 540) / F0, n = Math.hypot(x, 1, z); return [x / n, -1 / n, z / n]; };
    SKYP.stars.forEach(([x, y, s, ph, f], i) => {
      const isSky = s > 1.9 || hash(i * 7.31 + .4) < .18;
      (isSky ? sky : plane).push({ x0: x, y0: y, s, ph, f, inFrame: true, i });
    });
    const nIn = plane.length, dens = nIn / ((W / S0) * (H / S0));
    // plane stars outside the first frame, same density and sizes, taken by a growing 16:9 box until there is one per week
    const r = prng(1601), cand = [], hw = W / S0 / 2, hh = H / S0 / 2, BX = 150, BZ = 90, nC = Math.round(dens * (2 * BX) * (2 * BZ));
    for (let i = 0; i < nC; i++) {
      const X = G0.x + (r() * 2 - 1) * BX, Z = G0.z + (r() * 2 - 1) * BZ, m = r(); let s = m < .9 ? .5 + r() * .9 : 1.2 + r() * 1.4; if (s > 1.9) s = 1.2 + (s - 1.2) * .5;
      const ph = r() * TAU, f = .4 + r() * 1.6;
      if (Math.abs(X - G0.x) < hw && Math.abs(Z - G0.z) < hh) continue;
      cand.push({ X, Z, s, ph, f, inFrame: false, box: Math.max(Math.abs(X - G0.x) / 16, Math.abs(Z - G0.z) / 9) + r() * .02 });
    }
    cand.sort((p, q) => p.box - q.box);
    for (const c of cand) { if (plane.length >= NR) break; plane.push(c); }
    // sky stars over the whole sphere (directions); the plate's own sky stars keep their screen position until the camera moves
    const rs = prng(1602), skyDens = sky.length / ((W / F0) * (H / F0)), nS = Math.round(skyDens * 4 * Math.PI);
    for (let i = 0; i < nS; i++) {
      const u = rs() * 2 - 1, a = rs() * TAU, q = Math.sqrt(1 - u * u), d = [q * Math.cos(a), u, q * Math.sin(a)];
      const m = rs(), s = m < .9 ? .5 + rs() * .9 : 1.2 + rs() * 1.4, ph = rs() * TAU, f = .4 + rs() * 1.6;
      if (d[1] < 0) { const sx = 960 + F0 * d[0] / -d[1], sy = 540 + F0 * d[2] / -d[1]; if (sx > -40 && sx < W + 40 && sy > -40 && sy < H + 40) continue; }
      sky.push({ d, s, ph, f, inFrame: false });
    }
    return { plane, sky, camD };
  });
}
// the time at which the stars' drift is frozen into world positions (the camera starts to move at A.fly0)
function freezeStars(A) {
  return onceRaw('c16freeze', () => {
    const S = buildStars(A), tf = tau(A.fly0, A), dx = tf * 2.2, dy = tf * .6, dHb = A.Hb, dxb = dHb * 2.2, dyb = dHb * .6;
    // plane stars: world (X, Z) at the freeze; the in-frame ones from their plate position at Hb (wrapped) + the slow drift since
    for (const p of S.plane) {
      if (p.inFrame) { const sx = ((p.x0 + dxb) % W + W) % W + (tf - dHb) * 2.2, sy = ((p.y0 + dyb) % H + H) % H + (tf - dHb) * .6; p.X = G0.x + (sx - 960) / S0; p.Z = G0.z + (sy - 540) / S0; }
      else { p.X = p.X + (tf - dHb) * 2.2 / S0; p.Z = p.Z + (tf - dHb) * .6 / S0; }
      p.X0 = p.X; p.Z0 = p.Z;
    }
    for (const q of S.sky) if (q.inFrame) { const sx = ((q.x0 + dxb) % W + W) % W + (tf - dHb) * 2.2, sy = ((q.y0 + dyb) % H + H) % H + (tf - dHb) * .6; q.d = S.camD(sx, sy); }
    // the band of the milky way (plate: rotated -.42 about the frame centre, drifting 1.5 px per plate second)
    const band = SKYP.band.map(([x, y, a]) => { const bx = x + tf * 1.5, c = Math.cos(-.42), s = Math.sin(-.42), sx = 960 + bx * c - y * s, sy = 540 + bx * s + y * c; return { d: S.camD(sx, sy), a }; });
    // assignment: sort by Z into 80 rows of 52, each row by X → (row, col); flight times by row (top rows first)
    const idx = S.plane.map((p, i) => i).sort((i, j) => S.plane[i].Z - S.plane[j].Z);
    for (let r = 0; r < ROWS; r++) {
      const row = idx.slice(r * COLS, (r + 1) * COLS).sort((i, j) => S.plane[i].X - S.plane[j].X);
      row.forEach((i, c) => { const p = S.plane[i]; p.r = r; p.c = c; p.k = r * COLS + c; });
    }
    const byK = new Array(NR); S.plane.forEach((p) => { byK[p.k] = p; });
    for (const p of S.plane) {
      const h1 = hash(p.k * 3.7 + .1), h2 = hash(p.k * 5.3 + .7);
      p.t0 = A.fly0 + .35 + 1.25 * (p.r / (ROWS - 1)) + .25 * h1 + .1 * (p.c / COLS);
      p.dur = 1.25 + .3 * h2;
      p.bow = (p.X0 < p.c ? 1 : -1) * (.1 + .08 * h2);
    }
    return { ...S, band, byK };
  });
}
// a plane star's world position and its landing state at time t
function starAt(p, t) {
  const u = clamp((t - p.t0) / p.dur);
  if (u <= 0) return { X: p.X0, Z: p.Z0, u: 0, open: 0 };
  const e = cio(u), dx = p.c - p.X0, dz = p.r - p.Z0, b = Math.sin(Math.PI * e) * p.bow;
  return { X: p.X0 + dx * e - dz * b, Z: p.Z0 + dz * e + dx * b, u, open: sstep(.8, 1, u) };
}

// ======================================================================= ring sprites (mip levels, ghost levels, lit overlay)
const MIPS = [16, 32, 64, 128, 256, 512];
const GH = [1, .62, .3, 0];                      // ghost levels (1 dotted … 0 solid engraved)
function ringSprite(S, g) {
  return once(`c16ring${S}_${g}`, () => {
    const [c, x] = canvas(S, S), R = S / 2, ro = R * .72, ri = R * .5, lw = Math.max(.75, S * .016);
    x.translate(R, R); x.lineCap = 'round';
    const dots = (rad, n, size, a) => { x.fillStyle = rgba(CREAM, a); for (let i = 0; i < n; i++) { const q = i / n * TAU; x.beginPath(); x.arc(Math.cos(q) * rad, Math.sin(q) * rad, size, 0, TAU); x.fill(); } };
    if (S <= 16) {   // tiny: a soft engraved circle (dotted ones lighter and broken)
      x.strokeStyle = rgba(CREAM, mix(.95, .62, g)); x.lineWidth = mix(1.05, .95, g); if (g > .5) x.setLineDash([1.4, 1.2]);
      x.beginPath(); x.arc(0, 0, ro, 0, TAU); x.stroke(); return c;
    }
    if (g >= .99) {
      const n = Math.max(12, Math.round(TAU * ro / Math.max(2.4, S * .05)));
      dots(ro, n, Math.max(.55, S * .012), .95);
      if (S >= 64) dots(ri, Math.round(n * .7), Math.max(.45, S * .008), .55);
      if (S >= 128) { x.fillStyle = rgba(CREAM, .35); for (let i = 0; i < n * 2; i++) { const q = i / (n * 2) * TAU, rr = mix(ri, ro, .5 + .38 * Math.sin(q * 9)); x.beginPath(); x.arc(Math.cos(q) * rr, Math.sin(q) * rr, S * .005, 0, TAU); x.fill(); } }
      return c;
    }
    // solid engraved: outer + inner circle, a guilloche band between them (fewer lines when small); g > 0: broken into dashes
    const dash = g > .02 ? [Math.max(1, S * .05 * (1 - g)), S * .05 * g + .5] : [];
    x.setLineDash(dash);
    x.strokeStyle = rgba(CREAM, .95); x.lineWidth = lw * 1.2; x.beginPath(); x.arc(0, 0, ro, 0, TAU); x.stroke();
    if (S >= 32) { x.strokeStyle = rgba(CREAM, .7); x.lineWidth = lw * .8; x.beginPath(); x.arc(0, 0, ri, 0, TAU); x.stroke(); }
    if (S >= 64) {
      const L = S >= 256 ? 5 : 3; x.lineWidth = Math.max(.6, lw * .55);
      for (let k = 0; k < L; k++) { x.strokeStyle = rgba(CREAM, .42); x.beginPath(); for (let i = 0; i <= 240; i++) { const q = i / 240 * TAU, rr = mix(ri, ro, .5 + .42 * Math.sin(q * 11 + k * TAU / L)); i ? x.lineTo(Math.cos(q) * rr, Math.sin(q) * rr) : x.moveTo(Math.cos(q) * rr, Math.sin(q) * rr); } x.stroke(); }
    }
    return c;
  });
}
// the lit week: warm light inside the ring, the ring in foil, a soft glow round it
function litSprite(S) {
  return once(`c16lit${S}`, () => {
    const [c, x] = canvas(S, S), R = S / 2, ro = R * .72, ri = R * .5, lw = Math.max(.8, S * .018);
    x.translate(R, R);
    const g = x.createRadialGradient(0, 0, 0, 0, 0, R); g.addColorStop(0, rgba(AMB, .5)); g.addColorStop(.6, rgba(AMB, .22)); g.addColorStop(1, rgba(AMB, 0)); x.fillStyle = g; x.fillRect(-R, -R, S, S);
    const f = x.createRadialGradient(-ro * .25, -ro * .3, 0, 0, 0, ro); f.addColorStop(0, CORE); f.addColorStop(.55, '#ffd28f'); f.addColorStop(1, '#e48a3a');
    x.fillStyle = f; x.beginPath(); x.arc(0, 0, ro * .98, 0, TAU); x.fill();
    if (S >= 32) { x.strokeStyle = 'rgba(122,59,23,.55)'; x.lineWidth = lw * .7; x.beginPath(); x.arc(0, 0, ri, 0, TAU); x.stroke();
      if (S >= 64) { x.lineWidth = Math.max(.5, lw * .4); for (let k = 0; k < 3; k++) { x.strokeStyle = 'rgba(122,59,23,.32)'; x.beginPath(); for (let i = 0; i <= 240; i++) { const q = i / 240 * TAU, rr = mix(ri, ro, .5 + .42 * Math.sin(q * 11 + k * TAU / 3)); i ? x.lineTo(Math.cos(q) * rr, Math.sin(q) * rr) : x.moveTo(Math.cos(q) * rr, Math.sin(q) * rr); } x.stroke(); } } }
    x.strokeStyle = '#fff4dc'; x.lineWidth = lw * 1.25; x.beginPath(); x.arc(0, 0, ro, 0, TAU); x.stroke();
    return c;
  });
}
function haloSprite(S) {
  return once(`c16halo${S}`, () => {
    const [c, x] = canvas(S, S), R = S / 2; const g = x.createRadialGradient(R, R, 0, R, R, R);
    g.addColorStop(0, rgba(CORE, .55)); g.addColorStop(.18, rgba(AMB, .32)); g.addColorStop(.5, rgba(AMB, .08)); g.addColorStop(1, rgba(AMB, 0)); x.fillStyle = g; x.fillRect(0, 0, S, S); return c;
  });
}
const pickMip = (px) => { for (const m of MIPS) if (m >= px) return m; return MIPS[MIPS.length - 1]; };
export function warmSprites() { for (const m of MIPS) { for (const g of GH) ringSprite(m, g); litSprite(m); } for (const m of [64, 256]) haloSprite(m); }

// ======================================================================= ring states over time
// ghost g (1 dotted → 0 solid) and light L (0 … 1.6) of week k at t
function ringState(k, t, A) {
  const r = (k / COLS) | 0, c = k % COLS;
  let g = 1, L = 0;
  // 16.04 the lived weeks fill amber from the top left (a front in reading order), ending in the "now" ring
  if (k <= NOWK) {
    const front = NOWK * qio(lin(A.fill0, A.fill1, t)), q = clamp((front - k) / 160 + .02);
    const e = sm(clamp(q * 1.6)); g = 1 - e; L = e;
  }
  // 16.11 the wave: every week lights warm, one after another (first week → last week)
  if (t > A.wave0) {
    const front = (NR + 300) * lin(A.wave0, A.wave1, t) - 150, q = sm(clamp((front - k) / 260));
    g = Math.min(g, 1 - q); L = Math.max(L, q) + .55 * Math.exp(-Math.pow((front - k) / 140, 2)) * (q > 0 ? 1 : 0);
  }
  return { g, L, r, c };
}

// ======================================================================= the river of light (16.12)
function riverPath() {
  return onceRaw('c16river', () => {
    const C = [[-.4, -3.5], [.6, 1.2], [7.5, 10.5], [3.6, 22.5], [16.5, 31.8], [30.5, 41.5], [24.5, 55.5], [38.5, 66], [47.5, 74.6], [51.6, 79.6], [55.6, 83.6], [62, 90], [72, 100]];
    const pts = [];
    for (let i = 0; i < C.length - 1; i++) {
      const p0 = C[Math.max(0, i - 1)], p1 = C[i], p2 = C[i + 1], p3 = C[Math.min(C.length - 1, i + 2)];
      for (let j = 0; j < 24; j++) { const u = j / 24, cr = (a, b, c2, d) => .5 * (2 * b + (c2 - a) * u + (2 * a - 5 * b + 4 * c2 - d) * u * u + (3 * b - a - 3 * c2 + d) * u * u * u); pts.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])]); }
    }
    pts.push(C[C.length - 1]);
    const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = d[d.length - 1];
    // the corner (the last week) along the river, as an arc-length fraction
    let sCorner = 0, best = 1e9; pts.forEach((p, i) => { const q = Math.hypot(p[0] - 51, p[1] - 79); if (q < best) { best = q; sCorner = d[i] / L; } });
    return { pts, d, L, sCorner };
  });
}
const riverW = (s, sc) => (s < sc ? .3 + 2.9 * Math.pow(s / sc, 1.25) : 3.2 + 4.5 * sstep(sc, sc + .12, s));   // full width (units)
function riverAt(s) {   // point + direction at arc fraction s
  const Rv = riverPath(), x = clamp(s) * Rv.L; let i = 0; while (i < Rv.d.length - 2 && Rv.d[i + 1] < x) i++;
  const q = (x - Rv.d[i]) / ((Rv.d[i + 1] - Rv.d[i]) || 1), a = Rv.pts[i], b = Rv.pts[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return { X: mix(a[0], b[0], q), Z: mix(a[1], b[1], q), dx: (b[0] - a[0]) / len, dz: (b[1] - a[1]) / len };
}

// ======================================================================= draw
let STATE = null;
export function gridSetup(A) { STATE = freezeStars(A); riverPath(); return STATE; }

export function drawGrid(ctx, t, A, o = {}) {
  const S = STATE || gridSetup(A), C = cam3(gridCamAt(t, A)), tp = tau(t, A);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  skyGround(ctx);
  // ---- sky (infinity): the band and the sky stars
  const moving = t >= A.fly0;
  if (!moving) {
    // the plate itself, slowed down (identical to the plate at Hb): band + all stars in screen space; plane stars too
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-.42);
    for (const [x, y, a] of SKYP.band) { ctx.fillStyle = `rgba(216,230,255,${a})`; ctx.fillRect(x + tp * 1.5, y, 1.3, 1.3); }
    ctx.restore();
    const dxb = A.Hb * 2.2, dyb = A.Hb * .6;
    for (const [x, y, s, ph, f] of SKYP.stars) {
      const tw = .55 + .45 * Math.sin(tp * f + ph), X = ((x + dxb) % W + W) % W + (tp - A.Hb) * 2.2, Y = ((y + dyb) % H + H) % H + (tp - A.Hb) * .6;
      ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
      if (s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(X, Y, s * 5, 0, TAU); ctx.fill(); }
    }
    ctx.restore(); return { cam: C };
  }
  for (const b of S.band) { const [x, y, z] = C.D(b.d[0], b.d[1], b.d[2]); if (z <= 0 || x < -4 || x > W + 4 || y < -4 || y > H + 4) continue; ctx.fillStyle = `rgba(216,230,255,${b.a})`; ctx.fillRect(x, y, 1.3, 1.3); }
  for (const q of S.sky) {
    const [x, y, z] = C.D(q.d[0], q.d[1], q.d[2]); if (z <= 0 || x < -30 || x > W + 30 || y < -30 || y > H + 30) continue;
    const tw = .55 + .45 * Math.sin(tp * q.f + q.ph);
    ctx.fillStyle = `rgba(243,239,226,${(.35 + .65 * tw) * (q.s > 1.2 ? 1 : .8)})`; ctx.beginPath(); ctx.arc(x, y, q.s, 0, TAU); ctx.fill();
    if (q.s > 2) { ctx.fillStyle = `rgba(255,241,214,${.07 * tw})`; ctx.beginPath(); ctx.arc(x, y, q.s * 5, 0, TAU); ctx.fill(); }
  }
  // ---- the plane: labels, rings, flying stars
  const flying = t < A.fly1 + .6;
  drawLabels(ctx, t, A, C);
  const lived = t > A.fill0 - .1 && t < A.wave1 + 4;
  if (lived) livedGlow(ctx, t, A, C);
  drawRings(ctx, t, A, C, S, flying, o);
  if (t > A.riv0) drawRiver(ctx, t, A, C, S, o);
  ctx.restore();
  return { cam: C };
}

// the soft warm glow over the lived weeks (one shape, not 1,700 glows)
function livedGlow(ctx, t, A, C) {
  const a = sm(lin(A.fill0, A.fill1, t)) * (t > A.riv0 ? 1 - .3 * sm(lin(A.riv0, A.end, t)) : 1);
  if (a <= 0) return;
  const pts = [[-.5, -.5], [COLS - .5, -.5], [COLS - .5, NOW.r - .5], [NOW.c + .5, NOW.r - .5], [NOW.c + .5, NOW.r + .5], [-.5, NOW.r + .5]].map(([X, Z]) => C.P(X, 0, Z));
  if (pts.some((p) => p[2] <= .05)) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length, R = Math.max(60, Math.hypot(pts[0][0] - pts[2][0], pts[0][1] - pts[2][1]) * .75);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, rgba(AMB, .1 * a)); g.addColorStop(.6, rgba(AMB, .05 * a)); g.addColorStop(1, rgba(AMB, 0));
  ctx.fillStyle = g; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R); ctx.restore();
}

function drawRings(ctx, t, A, C, S, flying, o) {
  const P = C.P, now = NOWK;
  const breath = .5 + .5 * Math.sin((t - A.behind) * TAU / 2.6);
  let portal = null;
  ctx.save();
  for (let k = 0; k < NR; k++) {
    const p = S.byK[k];
    let X = p.c, Z = p.r, open = 1, u = 1;
    if (flying) { const st = starAt(p, t); X = st.X; Z = st.Z; open = st.open; u = st.u; }
    const c0 = P(X, 0, Z); if (c0[2] < .02) continue;
    const pad = 80; if (c0[0] < -pad - 600 || c0[0] > W + pad + 600 || c0[1] < -pad - 600 || c0[1] > H + pad + 600) continue;
    // a star still flying (or not yet landed): a point of light with a short trail
    if (open < 1) {
      const tw = .55 + .45 * Math.sin(tau(t, A) * p.f + p.ph), al = (.35 + .65 * tw) * (p.s > 1.2 ? 1 : .8) * (1 - open);
      if (u > 0 && u < 1) { const st0 = starAt(p, t - .045), q0 = P(st0.X, 0, st0.Z); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = `rgba(243,239,226,${al * .45})`; ctx.lineWidth = p.s * 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(c0[0], c0[1]); ctx.stroke(); }
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(243,239,226,${al})`; ctx.beginPath(); ctx.arc(c0[0], c0[1], p.s * (1 - .6 * open), 0, TAU); ctx.fill();
      if (open <= 0) continue;
    }
    // the ring: local affine of the projection (one unit cell)
    const cx = P(X + .5, 0, Z), cz = P(X, 0, Z + .5);
    let a = cx[0] - c0[0], b = cx[1] - c0[1], c = cz[0] - c0[0], d = cz[1] - c0[1];
    const size = 2 * Math.max(Math.hypot(a, b), Math.hypot(c, d));
    if (c0[0] < -size || c0[0] > W + size || c0[1] < -size || c0[1] > H + size) continue;
    const sc = flying ? eoX(open) : 1; a *= sc; b *= sc; c *= sc; d *= sc;
    const st = ringState(k, t, A), M = pickMip(size * .95), k2 = 2 / M;
    // the room ring holds the room (the caller draws it) — remember its screen ellipse
    if (k === ROOMK) portal = { cx: c0[0], cy: c0[1], m: [a, b, c, d], size };
    ctx.setTransform(a * k2, b * k2, c * k2, d * k2, c0[0], c0[1]);
    // ghost level: nearest two levels, the lighter one under
    const gi = st.g >= .99 ? 0 : st.g <= .01 ? 3 : st.g > .62 ? 1 : st.g > .3 ? 2 : 3;
    ctx.globalAlpha = 1; ctx.drawImage(ringSprite(M, GH[gi]), -M / 2, -M / 2);
    if (st.L > .01) { ctx.globalAlpha = Math.min(1, st.L); ctx.drawImage(litSprite(M), -M / 2, -M / 2); }
    if (k === now && t > A.fill1 - .3) {
      const H2 = haloSprite(256), q = sm(lin(A.fill1 - .3, A.behind + .2, t)), sz = M * (2.6 + .5 * breath);
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = q * (.55 + .35 * breath); ctx.drawImage(H2, -sz / 2, -sz / 2, sz, sz);
      ctx.globalAlpha = q * (.5 + .4 * breath); ctx.drawImage(litSprite(M), -M / 2, -M / 2); ctx.globalCompositeOperation = 'source-over';
      // a fine engraved circle round "now"
      ctx.globalAlpha = q * .7; ctx.strokeStyle = CORE; ctx.lineWidth = M * .012; ctx.beginPath(); ctx.arc(0, 0, M * .5 * (1.08 + .06 * breath), 0, TAU); ctx.stroke();
    }
    if (st.L > 1.02) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, st.L - 1); const sz = M * 2.2; ctx.drawImage(haloSprite(64), -sz / 2, -sz / 2, sz, sz); ctx.globalCompositeOperation = 'source-over'; }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  ctx.restore();
  if (portal && o.portal) o.portal(ctx, t, portal);
}

// ---- labels on the plane: 4,000 weeks / 80 years / source, the year marks along the left edge
function drawLabels(ctx, t, A, C) {
  const P = C.P;
  const put = (X, Z, draw) => {
    const c0 = P(X, 0, Z); if (c0[2] < .5) return; const cx = P(X + 1, 0, Z), cz = P(X, 0, Z + 1);
    ctx.save(); ctx.setTransform((cx[0] - c0[0]) / 10, (cx[1] - c0[1]) / 10, (cz[0] - c0[0]) / 10, (cz[1] - c0[1]) / 10, c0[0], c0[1]); draw(); ctx.restore();
  };
  // year marks (drawn by a burin top to bottom on "Eighty")
  const yb = qio(lin(A.eighty - .1, A.eighty + .75, t));
  if (yb > 0) {
    const z0 = -.5, z1 = ROWS - .5, zb = mix(z0, z1, yb);
    put(-1.05, 0, () => {
      ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(0, z0 * 10); ctx.lineTo(0, zb * 10); ctx.stroke();
      for (let y = 0; y <= 80; y += 10) {
        const zz = y - .5; if (zz > zb + .01) break; const q = sm(clamp((zb - zz) / 3));
        ctx.strokeStyle = rgba(CREAM, .75 * q); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(0, zz * 10); ctx.lineTo(4.2, zz * 10); ctx.stroke();
        ctx.globalAlpha = q; ctx.fillStyle = CREAM; ctx.font = '16px "Instrument Serif"'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(String(y), -4, zz * 10 + 1);
        ctx.globalAlpha = 1;
      }
      if (yb < 1) { ctx.fillStyle = rgba(CORE, .9); ctx.beginPath(); ctx.arc(0, zb * 10, 1.6, 0, TAU); ctx.fill(); }
    });
  }
  // the title block (mask reveals, rising inside a clip)
  const reveal = (t0, dur = .55) => eoX(lin(t0, t0 + dur, t));
  const r1 = reveal(A.four - .05), r2 = reveal(A.eighty), r3 = reveal(A.weeks + .25, .7);
  if (r1 > 0) put(-88, 33.2, () => {
    ctx.save(); ctx.beginPath(); ctx.rect(-10, -140, 900, 160); ctx.clip();
    ctx.fillStyle = CREAM; ctx.font = '148px "Instrument Serif"'; ctx.textBaseline = 'alphabetic'; ctx.fillText('4,000', 0, (1 - r1) * 150);
    const w4 = ctx.measureText('4,000 ').width; ctx.fillStyle = rgba(CREAM, .92); ctx.fillText('weeks', w4, (1 - reveal(A.four + .25)) * 150);
    ctx.restore();
  });
  if (r2 > 0) put(-88, 42.6, () => {
    ctx.save(); ctx.beginPath(); ctx.rect(-10, -90, 700, 110); ctx.clip();
    ctx.fillStyle = rgba(CREAM, .86); ctx.font = '84px "Instrument Serif"'; ctx.fillText('80', 0, (1 - r2) * 100);
    const w8 = ctx.measureText('80 ').width; ctx.fillText('years', w8, (1 - reveal(A.years - .05)) * 100);
    ctx.restore();
  });
  if (r3 > 0) put(-87.6, 49.2, () => {
    ctx.save(); ctx.beginPath(); ctx.rect(-10, -30, 900, 44); ctx.clip();
    ctx.fillStyle = rgba('#b9b3d6', .92); ctx.font = '600 17px Inter'; try { ctx.letterSpacing = '4px'; } catch { }
    ctx.fillText('OLIVER BURKEMAN · FOUR THOUSAND WEEKS (2021)', 0, (1 - r3) * 34); ctx.restore();
  });
}

// ---- the river: the light of every week runs to it, it flows from the first week to the last and out into the dark
function drawRiver(ctx, t, A, C, S, o) {
  const Rv = riverPath(), sc = Rv.sCorner, P = C.P;
  const head = mix(-.02, 1.08, sstep(0, 1, lin(A.riv0, A.riv0 + 1.9, t))) + .6 * sstep(0, 1, lin(A.riv0 + 1.6, A.end, t));
  if (head <= 0) return;
  // tributaries: from the lit weeks (every 3rd) little streaks run to the nearest river point, then downstream
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (let k = 0; k < NR; k += 3) {
    const r = (k / COLS) | 0, c = k % COLS, sk = riverNear(c, r), q = lin(A.riv0 + .1 + 1.2 * sk.s / sc - .25 * hash(k), A.riv0 + .1 + 1.2 * sk.s / sc - .25 * hash(k) + .7, t);
    if (q <= 0 || q >= 1) continue;
    const e = cio(q), X = mix(c, sk.X, e), Z = mix(r, sk.Z, e), Xb = mix(c, sk.X, cio(Math.max(0, q - .12))), Zb = mix(r, sk.Z, cio(Math.max(0, q - .12)));
    const p1 = P(X, 0, Z), p0 = P(Xb, 0, Zb); if (p1[2] < .1 || p0[2] < .1) continue;
    ctx.strokeStyle = rgba(q < .8 ? AMB : CORE, .5 * Math.sin(Math.PI * q)); ctx.lineWidth = Math.max(.8, Math.min(5, 160 / p1[2] * .08)); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
  }
  ctx.restore();
  // the river surface: the fire plate itself, clipped to the banks (so where it fills the frame it IS the plate)
  const n = 140, L = [], R = [];
  const s1 = Math.min(head, 1.0);
  for (let i = 0; i <= n; i++) {
    const s = s1 * i / n, p = riverAt(s), w = riverW(s, sc) * .5 * sstep(0, .03, s1 - s + .004) * (s < .02 ? sstep(-.01, .02, s) : 1);
    const a = P(p.X - p.dz * w, 0, p.Z + p.dx * w), b = P(p.X + p.dz * w, 0, p.Z - p.dx * w);
    if (a[2] < .02 || b[2] < .02) continue; L.push(a); R.push(b);
  }
  if (L.length < 2) return;
  ctx.save();
  // a soft glow along the banks (the light spilling onto the plane)
  ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const mid = L.map((p, i) => [(p[0] + R[i][0]) / 2, (p[1] + R[i][1]) / 2, Math.hypot(p[0] - R[i][0], p[1] - R[i][1])]);
  for (const [wk, al] of [[3.2, .05], [1.9, .08], [1.3, .1]]) {
    ctx.strokeStyle = rgba(AMB, al); for (let i = 1; i < mid.length; i++) { ctx.lineWidth = Math.max(2, mid[i][2] * wk); ctx.beginPath(); ctx.moveTo(mid[i - 1][0], mid[i - 1][1]); ctx.lineTo(mid[i][0], mid[i][1]); ctx.stroke(); }
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath(); L.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]); ctx.closePath();
  ctx.clip();
  if (o.plate) o.plate(ctx, t); else { ctx.fillStyle = AMB; ctx.fillRect(0, 0, W, H); }
  // flow lines (engraved streamlines) moving downstream; they leave with the last of the flow
  const tail = sstep(0, 1, lin(A.end - .95, A.end - .08, t)) * 1.5;
  ctx.globalCompositeOperation = 'lighter';
  for (let j = 0; j < 9; j++) {
    const lam = -.8 + 1.6 * j / 8, sp = .16 + .03 * hash(j * 3.3), ph = hash(j * 7.1);
    ctx.strokeStyle = rgba(j % 2 ? CORE : '#ffe2a8', .3); ctx.lineWidth = 1.6;
    ctx.beginPath(); let pen = false;
    for (let i = 0; i <= 220; i++) {
      const s = Math.min(head, 1.6) * i / 220; if (s < tail) { pen = false; continue; }
      const dash = ((s * 22 - t * sp * 22 + ph * 4) % 1 + 1) % 1; if (dash > .55) { pen = false; continue; }
      const p = riverAt(s), w = riverW(s, sc) * .5 * lam, q = P(p.X - p.dz * w, 0, p.Z + p.dx * w); if (q[2] < .02) { pen = false; continue; }
      pen ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); pen = true;
    }
    ctx.stroke();
  }
  ctx.restore();
}
const NEAR = new Map();
function riverNear(c, r) {
  const k = r * COLS + c; if (NEAR.has(k)) return NEAR.get(k);
  const Rv = riverPath(); let best = 1e9, bi = 0; for (let i = 0; i < Rv.pts.length; i += 2) { const q = (Rv.pts[i][0] - c) ** 2 + (Rv.pts[i][1] - r) ** 2; if (q < best) { best = q; bi = i; } }
  const v = { X: Rv.pts[bi][0], Z: Rv.pts[bi][1], s: Rv.d[bi] / Rv.L }; NEAR.set(k, v); return v;
}
