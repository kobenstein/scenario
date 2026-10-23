// Film 8 · coast and harbour at night / dawn (owner B2; first use c05.05, also c06 Papeete, c07 the fog town, c08 lock gate, lagoons, posts;
// B3 c09 Ostrom's bay, c11). Everything is world geometry (metres, +Y up, sea level Y = 0) projected through the s8 camera, so a camera can
// fly over it, crane up from it or look at it through a window. Engraved and opaque: dark facades with a cool rim, warm lit windows.
//
//   makeTown(o) → TOWN        o: { x 0, z (the quay line), face +1 (sea toward +Z; −1 sea toward −Z), w 220 (width along X), depth 90 (inland),
//                                   rise 22 (height of the slope's top), n 120 (houses), seed 1, gap: [x0, x1] (no houses: a street) }
//                              TOWN = { houses: [...], quay: [[x,z]...], lamps: [[x,y,z]...], o }
//   drawTown(ctx, t, C, TOWN, o)   o: { lit .7 (share of lit windows), warm 1 (window light), phones 0..1 (cool phone glow + a figure holding
//                                   one, per window), dawn 0..1 (morning: facades pale, windows off), lamps 1 (quay lanterns), twin 0..1 (every
//                                   lantern shows an opaque twin: trust), fogK 0..1 (distance fog colour on the facades), tone 'night'|'storm'|'dawn' }
//                                   → { lights: [[sx, sy, r], …] } screen points of the lit lanterns (to draw over fog)
//   breakwater(ctx, t, C, o)   a stone arm on the water. o: { pts: [[x,z],…] (its centre line), h 2.2 (above the sea), w 5, lamps 1, lampEvery 14,
//                                   lineA 0..1 (its lamp row seen as one lit line: the c04>c05 / C4 handoff), col }
//   calmBasin(ctx, t, C, o)    still water inside a harbour: o: { poly: [[x,z],…], a 1, refl: [[x,y,z,col],…] lights that mirror in it }
//   coastline(ctx, t, C, o)    a long coast of hills with harbour after harbour lit along it. o: { z0 (shore line Z near), x0, x1, n 9, lit 0..1 (lights
//                                   come on one harbour after another), ridge '#0b0b1c', seed }
//   lockGate(ctx, t, C, o)     a canal lock (c08.13): two walls, a gate that opens (o.open 0..1), lamps on its walls. o: { x, z, w 14, L 60, open }
//   lagoons(ctx, t, C, o)      a row of roped-off lagoons along a coast (c08.14): o: { x0, z, n 6, R 18, gapX 46, lit 0..1, boom 0..1 (one boom opens), at 2 }
//   post(ctx, t, C, o)         a harbour post with a sheet pinned to it (c08.16–19): o: { x, z, h 3.2, sheet 0..1 (pinned), drop 0..1 (falls),
//                                   frost 0..1, crack 0..1, ink 0..1 (new lines written), candle 0..1 (left), candleOn 0..1 } → { sheet: affine, candle: [sx,sy] }
//   houseBox(ctx, C, H, o)     one house (used by drawTown; exported for single buildings)
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projPoly, projRuns, fillPoly, mixHex, hash, eoX } from './s8_kit.mjs';
import { backFig } from './s8_people.mjs';

const PAL = {
  night: { wall: '#121327', wall2: '#0b0c1c', roof: '#08081a', rim: '#7e8ab8', win: '#ffb35c', winCore: '#fff1d6' },
  storm: { wall: '#1a2030', wall2: '#11151f', roof: '#0c0f18', rim: '#8a96b4', win: '#ffb35c', winCore: '#fff1d6' },
  dawn: { wall: '#6a5a6a', wall2: '#4a3e52', roof: '#3a2c3a', rim: '#ffd0a0', win: '#ffcf8a', winCore: '#fff6e2' },
};

// ---------------------------------------------------------------- the town
export function makeTown(o = {}) {
  const r = prng(o.seed || 1), x0 = o.x ?? 0, zq = o.z ?? 0, face = o.face ?? 1, w = o.w ?? 220, depth = o.depth ?? 90, rise = o.rise ?? 22, n = o.n ?? 120;
  const houses = [];
  for (let i = 0; i < n * 3 && houses.length < n; i++) {
    const u = r(), v = Math.pow(r(), .8), X = x0 + (u - .5) * w, back = 6 + v * depth;
    if (o.gap && X > o.gap[0] && X < o.gap[1]) continue;
    const Z = zq - face * back, base = rise * Math.pow(back / (depth + 6), 1.3), hw = 3 + r() * 3.5, hd = 3.5 + r() * 3, hh = 4.5 + r() * 5 + (r() < .1 ? 5 : 0);
    if (houses.some((H) => Math.abs(H.x - X) < (H.w + hw) * .55 && Math.abs(H.z - Z) < (H.d + hd) * .6)) continue;
    const wins = []; const cols = Math.max(1, Math.round(hw * 2 / 2.6)), rows = Math.max(1, Math.round(hh / 3.2));
    for (let a = 0; a < cols; a++) for (let b = 0; b < rows; b++) wins.push({ u: (a + .5) / cols, v: (b + .55) / rows, k: r(), ph: r() * TAU, fig: r() });
    houses.push({ x: X, z: Z, y: base, w: hw, d: hd, h: hh, roof: 1.5 + r() * 2.2, face, wins, seed: r() * 100, flat: r() < .25 });
  }
  const quay = [[x0 - w / 2, zq], [x0 + w / 2, zq]];
  const lamps = []; for (let X = x0 - w / 2 + 8; X < x0 + w / 2; X += 13 + 4 * r()) lamps.push([X, 3.2, zq - face * 1.5]);
  return { houses, quay, lamps, o: { x: x0, z: zq, face, w, depth, rise } };
}

// one house: walls (the faces turned to the camera), a gable or flat roof, windows on the sea side
export function houseBox(ctx, t, C, H, o = {}) {
  const P = PAL[o.tone] || PAL.night, f = H.face, hx = H.w, hz = H.d, y0 = H.y, y1 = H.y + H.h, yR = y1 + (H.flat ? .4 : H.roof);
  const c = [[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz]].map(([a, b]) => [H.x + a, H.z + b]);
  const fogK = o.fogK || 0, dawn = o.dawn || 0;
  const wallCol = (k) => mixHex(mixHex(k ? P.wall : P.wall2, PAL.dawn.wall, dawn * (k ? 1 : .8)), o.fogCol || '#3a4442', fogK);
  // faces: front (sea side) and the two sides and back, keep those that face the camera
  const faces = [];
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4], mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2, nx = mx - H.x, nz = mz - H.z;
    if ((C.x - mx) * nx + (C.z - mz) * nz <= 0) continue;
    const front = Math.abs(nz) > Math.abs(nx);
    faces.push({ q: [[a[0], y0 - 2, a[1]], [b[0], y0 - 2, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]], front, a, b, side: Math.abs(nx) > Math.abs(nz) });
  }
  for (const F of faces) {
    const S = projPoly(C, F.q); if (S.length < 3) continue;
    fillPoly(ctx, S, wallCol(F.front ? 1 : 0));
    // gable triangle on the sides (roof ridge along X)
    if (!H.flat && F.side) { const m = [(F.a[0] + F.b[0]) / 2, yR, (F.a[1] + F.b[1]) / 2], G = projPoly(C, [[F.a[0], y1, F.a[1]], m, [F.b[0], y1, F.b[1]]]); fillPoly(ctx, G, wallCol(0)); }
    if (F.front) {
      // windows: lit (warm) or dark; some show a phone's cool light and the one who holds it
      const lit = o.lit ?? .7, ph = o.phones || 0;
      for (const Wd of H.wins) {
        const u0 = Wd.u - .16 / (H.w / 3), u1 = Wd.u + .16 / (H.w / 3), v0 = Wd.v - .14, v1 = Wd.v + .14;
        const L = (u, v) => [F.a[0] + (F.b[0] - F.a[0]) * u, y0 + (y1 - y0) * v, F.a[1] + (F.b[1] - F.a[1]) * u];
        const Q = projPoly(C, [L(u0, v0), L(u1, v0), L(u1, v1), L(u0, v1)]); if (Q.length < 3) continue;
        const on = Wd.k < lit ? 1 : 0, phone = Wd.fig < .55 ? clamp(ph * 1.6 - Wd.fig * 1.1) : 0;
        const warm = on * (o.warm ?? 1) * (1 - dawn * .85) * (.85 + .15 * Math.sin(t * 1.3 + Wd.ph));
        const col = phone > 0 ? mixHex(mixHex('#0a0c18', P.win, warm * .5), '#9fd4ff', phone * .55) : mixHex(mixHex('#07080f', '#2a2a3a', dawn), P.win, warm);
        fillPoly(ctx, Q, col);
        if (phone > 0 || warm > .3) {
          const cx = (Q[0][0] + Q[2][0]) / 2, cy = (Q[0][1] + Q[2][1]) / 2, sz = Math.abs(Q[2][1] - Q[0][1]);
          if (phone > .05 && sz > 5) {   // a head and shoulders against the window, the phone's cool light on the face
            ctx.fillStyle = '#05060c'; ctx.beginPath(); ctx.arc(cx, cy - sz * .02 + Math.sin(t * 1.1 + Wd.ph) * sz * .02, sz * .17, 0, TAU); ctx.fill();
            ctx.beginPath(); ctx.ellipse(cx, cy + sz * .5, sz * .36, sz * .3, 0, Math.PI, TAU); ctx.fill();
            ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(cx + sz * .05, cy + sz * .2, 0, cx + sz * .05, cy + sz * .2, sz * .5); g.addColorStop(0, rgba('#cfe6ff', .8 * phone)); g.addColorStop(1, rgba('#9fd4ff', 0)); ctx.fillStyle = g; ctx.fillRect(cx - sz, cy - sz, sz * 2, sz * 2); ctx.restore();
          }
          if (sz > 3) { ctx.strokeStyle = rgba('#05050c', .7); ctx.lineWidth = Math.max(.6, sz * .06); ctx.beginPath(); ctx.moveTo((Q[0][0] + Q[1][0]) / 2, Q[0][1]); ctx.lineTo((Q[3][0] + Q[2][0]) / 2, Q[2][1]); ctx.stroke(); }
        }
      }
    }
    // the cool rim along the top edge (starlight / storm light)
    const R = projRuns(C, [F.q[3], F.q[2]]); ctx.strokeStyle = rgba(mixHex(P.rim, PAL.dawn.rim, dawn), .35); ctx.lineWidth = 1; for (const run of R) { ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  }
  // roof
  const rc = mixHex(mixHex(P.roof, PAL.dawn.roof, dawn), o.fogCol || '#3a4442', fogK * .9);
  if (H.flat) fillPoly(ctx, projPoly(C, c.map(([x, z]) => [x, y1 + .4, z])), rc);
  else for (const sd of [-1, 1]) { const Q = projPoly(C, [[c[0][0] - .4, y1 - .2, H.z + sd * (hz + .4)], [c[1][0] + .4, y1 - .2, H.z + sd * (hz + .4)], [c[1][0] + .4, yR, H.z], [c[0][0] - .4, yR, H.z]]); if (fillPoly(ctx, Q, sd === f ? rc : mixHex(rc, '#000000', .3))) { const R = projRuns(C, [[c[0][0] - .4, yR, H.z], [c[1][0] + .4, yR, H.z]]); ctx.strokeStyle = rgba(mixHex(P.rim, PAL.dawn.rim, dawn), .3); ctx.lineWidth = 1; for (const run of R) { ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } } }
}

export function drawTown(ctx, t, C, TOWN, o = {}) {
  const out = { lights: [] }, tone = o.tone || 'night';
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // the hillside behind (a dark mass the houses sit on)
  const { x, z, face, w, depth, rise } = TOWN.o, hill = [];
  for (let i = 0; i <= 24; i++) { const X = x - w * .75 + i / 24 * w * 1.5, b = depth + 30 + 14 * Math.sin(i * 1.3 + 1); hill.push([X, rise * 1.35 + 8 * Math.sin(i * .9) + 6, z - face * b]); }
  const HP = projPoly(C, [[x - w * .75, -1, z], ...hill, [x + w * .75, -1, z]]);
  fillPoly(ctx, HP, mixHex(tone === 'dawn' ? '#2a2034' : '#090a18', '#2e3634', (o.fogK || 0) * .7));
  // the quay wall (a dark band at the waterline, lit edge)
  const qd = 4, Q = projPoly(C, [[x - w / 2, -.5, z], [x + w / 2, -.5, z], [x + w / 2, 2, z], [x - w / 2, 2, z]]);
  fillPoly(ctx, Q, tone === 'dawn' ? '#3a3040' : '#0a0a16');
  const QT = projPoly(C, [[x - w / 2, 2, z], [x + w / 2, 2, z], [x + w / 2, 2, z - face * qd], [x - w / 2, 2, z - face * qd]]);
  fillPoly(ctx, QT, tone === 'dawn' ? '#5a4a52' : '#14152a');
  for (const run of projRuns(C, [[x - w / 2, 2, z], [x + w / 2, 2, z]])) { ctx.strokeStyle = rgba(tone === 'dawn' ? '#ffd0a0' : '#a4b0dc', .4); ctx.lineWidth = 1.2; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  // houses far → near
  const list = TOWN.houses.map((H) => [C.depth(H.x, H.y + H.h / 2, H.z), H]).filter((p) => p[0] > 1).sort((a, b) => b[0] - a[0]);
  for (const [d, H] of list) { const p = C.P(H.x, H.y, H.z); if (!p || p[0] < -400 || p[0] > 2320 || p[1] < -300) continue; houseBox(ctx, t, C, H, { ...o, tone }); }
  // quay lanterns
  const la = o.lamps ?? 1, tw = o.twin || 0;
  if (la > 0) for (const [X, Y, Z] of TOWN.lamps) {
    const a = C.P(X, 2, Z), b = C.P(X, Y, Z); if (!a || !b || b[0] < -60 || b[0] > 1980) continue;
    ctx.strokeStyle = '#06060e'; ctx.lineWidth = Math.max(1, b[2] * .12); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    out.lights.push([b[0], b[1], Math.max(1.5, b[2] * .22), hash(X)]);
  }
  ctx.restore();
  if (!o.lightsLater) lanterns(ctx, t, out.lights, la, tw);
  return out;
}
// lanterns (screen points [x, y, r, seed]) with an optional opaque twin each (trust): drawn after the fog so they shine through it
export function lanterns(ctx, t, lights, a = 1, twin = 0, o = {}) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, r, s] of lights) {
    const one = (xx, ph) => { const R = r * (1 + .07 * Math.sin(t * 7.3 + ph) + .04 * Math.sin(t * 17 + ph * 2)) * (o.big || 1); const g = ctx.createRadialGradient(xx, y, 0, xx, y, R * 5); g.addColorStop(0, rgba('#fff1d6', a)); g.addColorStop(.12, rgba(o.col || '#ffb35c', .7 * a)); g.addColorStop(.4, rgba(o.col || '#ffb35c', .12 * a)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(xx, y, R * 5, 0, TAU); ctx.fill(); ctx.fillStyle = rgba('#fff6e2', a); ctx.beginPath(); ctx.arc(xx, y, Math.max(.8, R * .4), 0, TAU); ctx.fill(); };
    one(x, s * 10);
    if (twin > 0) { const tw = eoX(clamp(twin * 1.4 - s * .4)); if (tw > 0) one(x + r * (2.6 + 1.2 * s) * tw * (s > .5 ? 1 : -1), s * 10 + 2.3); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the breakwater
export function breakwater(ctx, t, C, o) {
  const pts = o.pts, h = o.h ?? 2.2, w = o.w ?? 5, la = o.lamps ?? 1;
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // sides: build left/right offset lines
  const L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dz = b[1] - a[1], d = Math.hypot(dx, dz) || 1, nx = -dz / d, nz = dx / d;
    L.push([pts[i][0] + nx * w / 2, pts[i][1] + nz * w / 2]); R.push([pts[i][0] - nx * w / 2, pts[i][1] - nz * w / 2]);
  }
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) for (const S of [L, R]) segs.push([[S[i][0], -.6, S[i][1]], [S[i + 1][0], -.6, S[i + 1][1]], [S[i + 1][0], h, S[i + 1][1]], [S[i][0], h, S[i][1]]]);
  for (let i = 0; i < pts.length - 1; i++) segs.push([[L[i][0], h, L[i][1]], [L[i + 1][0], h, L[i + 1][1]], [R[i + 1][0], h, R[i + 1][1]], [R[i][0], h, R[i][1]], 'top']);
  segs.map((q) => [q.slice(0, 4).reduce((s, p) => s + C.depth(...p), 0) / 4, q]).sort((a, b) => b[0] - a[0]).forEach(([, q]) => {
    const P = projPoly(C, q.slice(0, 4)); if (P.length < 3) return;
    fillPoly(ctx, P, q[4] ? (o.top || '#1a1a30') : (o.col || '#0c0c1a')); ctx.strokeStyle = q[4] ? (o.top || '#1a1a30') : (o.col || '#0c0c1a'); ctx.lineWidth = 1; ctx.stroke();
  });
  // stones: engraved block joints on the sea face
  ctx.strokeStyle = rgba('#05050c', .5); ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 4; k++) { const u = (k + hash(i * 3 + k) * .5) / 4, X = L[i][0] + (L[i + 1][0] - L[i][0]) * u, Z = L[i][1] + (L[i + 1][1] - L[i][1]) * u, a = C.P(X, -.4, Z), b = C.P(X, h - .1, Z); if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } }
  ctx.stroke();
  // the lit top edge
  for (const run of projRuns(C, L.map(([x, z]) => [x, h, z]))) { ctx.strokeStyle = rgba('#a4b0dc', .45); ctx.lineWidth = 1.3; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
  // lamps on posts along its top
  const lights = [];
  if (la > 0) {
    let acc = 0, every = o.lampEvery ?? 14;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      for (let s = (every - acc % every) % every; s < d; s += every) { const u = s / d, X = a[0] + (b[0] - a[0]) * u, Z = a[1] + (b[1] - a[1]) * u, p0 = C.P(X, h, Z), p = C.P(X, h + 2.4, Z); if (!p || !p0) continue; ctx.strokeStyle = '#06060e'; ctx.lineWidth = Math.max(1, p[2] * .1); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); lights.push([p[0], p[1], Math.max(1.4, p[2] * .2), hash(X * .37 + Z)]); }
      acc += d;
    }
    lanterns(ctx, t, lights, la, o.twin || 0);
  }
  return { lights };
}

// still water inside the harbour: the sea's swell lines stop at the breakwater; inside, dark glass with long reflections
export function calmBasin(ctx, t, C, o) {
  const P = projPoly(C, o.poly.map(([x, z]) => [x, .02, z])); if (P.length < 3) return;
  const a = o.a ?? 1;
  ctx.save(); fillPoly(ctx, P); ctx.clip();
  const ys = P.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, rgba(o.c0 || '#0d0c24', a)); g.addColorStop(1, rgba(o.c1 || '#05050e', a)); ctx.fillStyle = g; ctx.fillRect(0, y0, 1920, y1 - y0 + 2);
  // a few slow ripples (long thin strokes) and the reflections of the lights: vertical broken streaks
  ctx.strokeStyle = rgba('#7e8ab8', .1 * a); ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i < 40; i++) { const u = hash(i * 1.7), v = hash(i * 2.9), X = o.poly[0][0] + (o.poly[2][0] - o.poly[0][0]) * u, Z = o.poly[0][1] + (o.poly[2][1] - o.poly[0][1]) * v, p = C.P(X + Math.sin(t * .3 + i) * .6, .02, Z, .5); if (!p) continue; const L = p[2] * (1.5 + 2 * hash(i)); ctx.moveTo(p[0] - L, p[1]); ctx.lineTo(p[0] + L, p[1]); }
  ctx.stroke();
  ctx.globalCompositeOperation = 'lighter';
  for (const [X, Y, Z, col] of o.refl || []) {
    const top = C.P(X, -.1, Z, .5), bot = C.P(X, -Y * 1.6, Z, .5); if (!top || !bot) continue;
    const n = 9; for (let k = 0; k < n; k++) { const v = k / n, y = top[1] + (bot[1] - top[1]) * v, wob = Math.sin(t * 2.1 + k * 1.3 + X) * top[2] * .25, L = top[2] * (.35 + .2 * Math.sin(t * 3 + k)) * (1 - v * .6); ctx.strokeStyle = rgba(col || '#ffb35c', .5 * (1 - v) * a); ctx.lineWidth = Math.max(1, top[2] * .08); ctx.beginPath(); ctx.moveTo(top[0] - L + wob, y); ctx.lineTo(top[0] + L + wob, y); ctx.stroke(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- a long coast with harbour after harbour (c05.06)
export function coastline(ctx, t, C, o) {
  const r = prng(o.seed || 5), n = o.n ?? 9, x0 = o.x0 ?? -900, x1 = o.x1 ?? 900, z0 = o.z0 ?? 0, lit = o.lit ?? 1;
  ctx.save();
  // ridges: three layers inland, each a little lighter (layered indigo)
  for (const [k, back, hgt, col] of [[2, 260, 120, '#0e0e24'], [1, 140, 70, '#0a0a1c'], [0, 50, 34, '#07071a']]) {
    const pts = []; for (let i = 0; i <= 60; i++) { const X = x0 - 200 + (x1 - x0 + 400) * i / 60; pts.push([X, hgt * (.5 + .5 * Math.sin(X * .004 + k * 2) * Math.sin(X * .011 + k)) + hgt * .3, z0 - back - 40 * Math.sin(X * .003 + k)]); }
    fillPoly(ctx, projPoly(C, [[x0 - 200, -2, z0 - back + 30], ...pts, [x1 + 200, -2, z0 - back + 30]]), col);
    for (const run of projRuns(C, pts)) { ctx.strokeStyle = rgba('#7e8ab8', .18 + .06 * k); ctx.lineWidth = 1; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  }
  // the shore line (a pale engraved edge) and the harbours: clusters of warm lights, each with a small breakwater arc of lamps
  for (const run of projRuns(C, Array.from({ length: 80 }, (_, i) => { const X = x0 + (x1 - x0) * i / 79; return [X, .1, z0 + 12 * Math.sin(X * .02)]; }))) { ctx.strokeStyle = rgba('#a4b0dc', .3); ctx.lineWidth = 1.2; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  const lights = [];
  for (let h = 0; h < n; h++) {
    const hx = x0 + (x1 - x0) * (h + .5) / n + (r() - .5) * 40, on = clamp(lit * (n + 2) - h * .9 - (o.order === -1 ? (n - h) : 0) * 0);
    if (on <= 0) continue;
    const zz = z0 + 12 * Math.sin(hx * .02);
    for (let i = 0; i < 26; i++) { const X = hx + (r() - .5) * 60, Z = zz - 4 - r() * 50, Y = 2 + (zz - Z) * .35 + r() * 4, p = C.P(X, Y, Z); if (p && p[0] > -20 && p[0] < 1940) lights.push([p[0], p[1], Math.max(1.8, p[2] * .3), r()]); }
    for (let i = 0; i <= 8; i++) { const a = Math.PI * (.15 + .7 * i / 8), X = hx + Math.cos(a) * 30, Z = zz + Math.sin(a) * 22, p = C.P(X, 3, Z); if (p) lights.push([p[0], p[1], Math.max(1.8, p[2] * .3), r()]); }
    // a calm glitter under the harbour
    const p = C.P(hx, 0, zz + 10); if (p) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], p[2] * 50); g.addColorStop(0, rgba('#ffb35c', .3 * on)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, .3); ctx.beginPath(); ctx.arc(0, 0, p[2] * 50, 0, TAU); ctx.fill(); ctx.restore(); ctx.restore(); }
  }
  ctx.restore();
  lanterns(ctx, t, lights, 1, 0);
}

// ---------------------------------------------------------------- the lock gate (c08.13)
export function lockGate(ctx, t, C, o) {
  const X = o.x ?? 0, Z = o.z ?? 0, w = o.w ?? 14, L = o.L ?? 60, op = clamp(o.open ?? 0), hh = 4;
  ctx.save();
  const parts = [];
  for (const sd of [-1, 1]) {
    const x = X + sd * (w / 2 + 3);
    parts.push([[x - 3, -1, Z], [x + 3, -1, Z], [x + 3, hh, Z], [x - 3, hh, Z]], [[x - 3, hh, Z], [x + 3, hh, Z], [x + 3, hh, Z + L], [x - 3, hh, Z + L]], [[x - sd * 3, -1, Z], [x - sd * 3, -1, Z + L], [x - sd * 3, hh, Z + L], [x - sd * 3, hh, Z]]);
  }
  parts.map((q) => [q.reduce((s, p) => s + C.depth(...p), 0) / 4, q]).sort((a, b) => b[0] - a[0]).forEach(([, q], i) => fillPoly(ctx, projPoly(C, q), q[0][1] === hh && q[2][1] === hh ? '#1a1a30' : '#0c0c1a'));
  // the two gate leaves at the far end (Z + L): they swing open outward
  for (const sd of [-1, 1]) {
    const hx = X + sd * w / 2, ang = op * 1.25, ex = hx - sd * Math.cos(ang) * w / 2, ez = Z + L + Math.sin(ang) * w / 2;
    const q = [[hx, -1, Z + L], [ex, -1, ez], [ex, hh - .4, ez], [hx, hh - .4, Z + L]];
    if (fillPoly(ctx, projPoly(C, q), '#100e1c')) { for (const run of projRuns(C, [q[3], q[2]])) { ctx.strokeStyle = rgba('#a4b0dc', .5); ctx.lineWidth = 1.4; ctx.beginPath(); run.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  }
  ctx.restore();
  const lights = [];
  for (const sd of [-1, 1]) for (let z = 4; z < L; z += 14) { const p = C.P(X + sd * (w / 2 + 2.5), hh + 1.8, Z + z), p0 = C.P(X + sd * (w / 2 + 2.5), hh, Z + z); if (!p || !p0) continue; ctx.strokeStyle = '#06060e'; ctx.lineWidth = Math.max(1, p[2] * .1); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); lights.push([p[0], p[1], Math.max(1.4, p[2] * .2), hash(z + sd)]); }
  lanterns(ctx, t, lights, 1, 0);
  return { lights };
}

// ---------------------------------------------------------------- roped lagoons along a coast (c08.14–15)
export function lagoons(ctx, t, C, o) {
  const n = o.n ?? 6, R = o.R ?? 18, gx = o.gapX ?? 46, x0 = o.x0 ?? -(n - 1) * gx / 2, Z = o.z ?? 0, lit = o.lit ?? 1, boom = clamp(o.boom ?? 0), at = o.at ?? 2;
  const lights = [];
  ctx.save(); ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const cx = x0 + i * gx, on = clamp(lit * (n + 1) - i), open = i === at ? boom : 0;
    // the rope ring of floats: a dotted ellipse on the water, the seaward arc swings open on the boom
    const pts = []; for (let k = 0; k <= 64; k++) { let a = k / 64 * TAU; const sea = Math.cos(a) > .82; if (sea && open > 0) continue; pts.push([cx + Math.sin(a) * R, .15 + .05 * Math.sin(t * 1.3 + k), Z + Math.cos(a) * R * .8]); }
    if (open > 0) { const a0 = Math.acos(.82); for (const sd of [-1, 1]) { const ang = sd * (a0 + open * 1.1), bx = cx + Math.sin(sd * a0) * R, bz = Z + Math.cos(a0) * R * .8, L = R * .65; for (const run of projRuns(C, [[bx, .15, bz], [bx + Math.sin(ang - sd * .6) * L * sd * sd, .15, bz + Math.cos(ang - sd * .6) * L]], .3)) { ctx.strokeStyle = rgba('#ffd9a0', .7 * on); ctx.lineWidth = 2; ctx.beginPath(); run.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } } }
    for (const run of projRuns(C, pts, .3)) { ctx.strokeStyle = rgba('#ffd9a0', .6 * on); ctx.lineWidth = 1.6; ctx.setLineDash([3, 5]); ctx.beginPath(); run.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.setLineDash([]); }
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; if (open > 0 && Math.cos(a) > .82) continue; const p = C.P(cx + Math.sin(a) * R, .5, Z + Math.cos(a) * R * .8); if (p && on > 0) lights.push([p[0], p[1], Math.max(1, p[2] * .14), hash(i * 12 + k)]); }
  }
  ctx.restore();
  lanterns(ctx, t, lights, lit > 0 ? 1 : 0, 0);
  return { lights };
}

// ---------------------------------------------------------------- a harbour post with a sheet pinned to it (c08.16–19)
export function post(ctx, t, C, o) {
  const X = o.x ?? 0, Z = o.z ?? 0, h = o.h ?? 3.2;
  const a = C.P(X, -1, Z), b = C.P(X, h, Z); if (!a || !b) return {};
  const k = b[2], w = .32 * k;
  ctx.save();
  // the post: weathered wood, engraved grain, a cool rim on one side
  ctx.fillStyle = '#1a1420'; ctx.beginPath(); ctx.moveTo(a[0] - w, a[1]); ctx.lineTo(b[0] - w, b[1]); ctx.lineTo(b[0] + w, b[1] - w * .2); ctx.lineTo(a[0] + w, a[1]); ctx.fill();
  ctx.strokeStyle = rgba('#05040a', .5); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 6; i++) { const x = b[0] - w * .7 + i * w * .28; ctx.moveTo(x, b[1] + 4); ctx.bezierCurveTo(x + 3, (a[1] + b[1]) / 2, x - 3, (a[1] + b[1]) / 2 + 30, x, a[1]); } ctx.stroke();
  ctx.strokeStyle = rgba('#a4b0dc', .35); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(b[0] + w, b[1]); ctx.lineTo(a[0] + w, a[1]); ctx.stroke();
  ctx.restore();
  // the sheet's affine: an A4-ish sheet 0.5 × 0.7 m on the post's face, 0.4 m below its top (it can drop: slides down and tilts into the water)
  const drop = clamp(o.drop ?? 0), dy = drop * drop * 3.6, rot = drop * .6;
  const S = C.plane([X, h - .9 - dy, Z - .02], [Math.cos(rot), Math.sin(rot) * .5, 0], [Math.sin(rot) * .3, -1, -.1 * drop]);
  return { sheet: S, top: b, k };
}
