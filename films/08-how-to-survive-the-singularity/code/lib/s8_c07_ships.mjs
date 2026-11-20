// Film 8 · c07 local pieces (owner B2): the fast cutter (software: months), the slow barge with three lit decks (schools, laws, training:
// years), the gangplank between them that stretches and slips, and a big swell ridge for Hōkūleʻa to rise over.
//   cutter(ctx, t, C, S)        S: { x, z, head, L 16, speed (m/s, for the bow spray) } → { light: [sx, sy], stern: [X, Y, Z], bow }
//   barge(ctx, t, C, S)         S: { x, z, head, L 46 } → { bow: [X, Y, Z] (deck level at the bow), deck: Y }
//   plank(ctx, t, C, A, B, o)   a gangplank from world point A to B (it sags), o: { slip 0..1 (B's end has slipped: it swings down from A),
//                               figs [{ u 0..1 along, stumble 0..1 }], lantern { u, drop 0..1 } } → { lantern: [sx, sy] | null }
//   swellRidge(ctx, t, C, o)    a big swell crossing in front: o: { z, x0, x1, h (m), col } (dark water body with engraved crest lines)
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projPoly, projRuns, fillPoly, mixHex, hash, eoX, eiX } from './s8_kit.mjs';
import { lanterns } from './s8_harbour.mjs';
import { backFig } from './s8_people.mjs';

const frame = (S, t, bob = .15) => { const h = S.head, fx = Math.sin(h), fz = Math.cos(h), rx = Math.cos(h), rz = -Math.sin(h), y0 = bob * Math.sin(t * 1.1 + S.x * .1), pit = (S.pitch ?? 0) + .015 * Math.sin(t * 1.4); return (u, v, w) => [S.x + rx * u + fx * w, y0 + v + w * pit, S.z + rz * u + fz * w]; };
function solid(ctx, C, faces) {
  faces.map((f) => [f.q.reduce((s, p) => s + C.depth(...p), 0) / f.q.length, f]).sort((a, b) => b[0] - a[0]).forEach(([, f]) => { const P = projPoly(C, f.q); if (fillPoly(ctx, P, f.c)) { ctx.strokeStyle = f.e || f.c; ctx.lineWidth = 1; ctx.stroke(); } });
}
function hullFaces(F, L, B, H, sleek, c1, c2) {
  const N = 14, top = [], bot = [];
  for (let i = 0; i <= N; i++) { const v = i / N, w = -L / 2 + v * L, bw = B * Math.pow(Math.sin(Math.PI * Math.min(1, .12 + .88 * v)), sleek) * (v > .75 ? 1 - (v - .75) * 2.4 * (sleek > .5 ? 1.2 : .6) : 1); top.push([bw, w]); bot.push([bw * .7, w * .96]); }
  const T = [...top.map(([u, w]) => F(u, H, w)), ...top.slice().reverse().map(([u, w]) => F(-u, H, w))];
  const Bt = [...bot.map(([u, w]) => F(u, -.4, w)), ...bot.slice().reverse().map(([u, w]) => F(-u, -.4, w))];
  const faces = [];
  for (let i = 0; i < T.length; i++) { const j = (i + 1) % T.length; faces.push({ q: [T[i], T[j], Bt[j], Bt[i]], c: mixHex(c1, c2, .5 + .5 * Math.sin(i * .4)) }); }
  return { faces, deck: T };
}
export function cutter(ctx, t, C, S) {
  const F = frame(S, t, .08), L = S.L ?? 16, sp = S.speed ?? 0;
  const p0 = C.P(...F(0, 1, 0)); if (!p0 || p0[0] < -1200 || p0[0] > 3100) return null;
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // the wake: long white streaks fanning out behind (world), spray at the bow
  const wk = Math.min(1, sp / 30);
  if (wk > 0) {
    ctx.strokeStyle = rgba('#d8e2f8', .5 * wk); ctx.lineWidth = Math.max(1, p0[2] * .12);
    for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) { const pts = []; for (let i = 0; i <= 20; i++) { const back = i * 6, w = -L / 2 - back; pts.push(F(sd * (1.2 + back * (.18 + k * .05)), .05, w)); } for (const run of projRuns(C, pts, .3)) { ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
    for (let i = 0; i < 26; i++) { const ph = (t * 3 + hash(i)) % 1, p = C.P(...F((hash(i * 3) - .5) * 4, .3 + ph * 2.2 * hash(i * 7), L / 2 - 2 - ph * 6)); if (p) { ctx.fillStyle = rgba('#e8f0ff', (1 - ph) * .7 * wk); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(.8, p[2] * .12), 0, TAU); ctx.fill(); } }
  }
  const { faces, deck } = hullFaces(F, L, 1.7, 1.3, .45, '#10141f', '#1c2232');
  solid(ctx, C, faces); fillPoly(ctx, projPoly(C, deck), '#161a28');
  // a low cabin, raked
  const cab = (u, w, v) => F(u, 1.3 + v, w), q = [[-1, -2], [1, -2], [.8, 3], [-.8, 3]];
  const top = q.map(([u, w]) => cab(u * .9, w - .4 + (w > 0 ? -.8 : 0), 1.6)), base = q.map(([u, w]) => cab(u, w, 0));
  const fc = []; for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; fc.push({ q: [base[i], base[j], top[j], top[i]], c: i === 1 ? '#232a3c' : '#151a28' }); } fc.push({ q: top, c: '#1e2436' });
  solid(ctx, C, fc);
  // its windows: a cool strip
  for (const run of projRuns(C, [cab(-.95, 2.6, .9), cab(.95, 2.6, .9)])) { ctx.strokeStyle = rgba('#bfe3ff', .8); ctx.lineWidth = Math.max(1, run[0][2] * .25); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  for (const run of projRuns(C, [...deck, deck[0]])) { ctx.strokeStyle = rgba('#a8c0e8', .45); ctx.lineWidth = 1.2; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
  // the cool masthead light
  const lp = C.P(...F(0, 4.3, .5)), m0 = C.P(...F(0, 2.9, .5));
  if (lp && m0) { ctx.strokeStyle = '#0a0d16'; ctx.lineWidth = Math.max(1, lp[2] * .12); ctx.beginPath(); ctx.moveTo(m0[0], m0[1]); ctx.lineTo(lp[0], lp[1]); ctx.stroke(); lanterns(ctx, t, [[lp[0], lp[1], Math.max(2, lp[2] * .35), .3]], 1, 0, { col: '#8fe6ff' }); }
  return { light: lp, stern: F(0, 1.3, -L / 2 + 1), bow: F(0, 1.3, L / 2 - 1), p: p0 };
}
// the barge: a long heavy hull with three decks of lit windows; inside each deck a tiny scene in silhouette (desks and a board · a bench ·
// a workbench)
export function barge(ctx, t, C, S) {
  const F = frame(S, t, .04), L = S.L ?? 46, B = 5.2;
  const p0 = C.P(...F(0, 3, 0)); if (!p0 || p0[0] < -2400 || p0[0] > 4300) return null;
  ctx.save(); ctx.lineJoin = 'round';
  const { faces, deck } = hullFaces(F, L, B, 1.6, .2, '#0e0d18', '#1a1826');
  solid(ctx, C, faces); fillPoly(ctx, projPoly(C, deck), '#14131e');
  // three decks: boxes stacked, each slightly shorter; their windows on the camera side
  const decks = [[1.6, 4.4, .82], [4.4, 7.2, .7], [7.2, 9.8, .56]];
  const scenes = ['class', 'court', 'work'];
  decks.forEach(([v0, v1, f], d) => {
    const u = B * .82, w0 = -L / 2 * f + 2, w1 = L / 2 * f - 4;
    const c = [[-u, w0], [u, w0], [u, w1], [-u, w1]], T = c.map(([a, w]) => F(a, v1, w)), Bt = c.map(([a, w]) => F(a, v0, w));
    const fc = []; for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; fc.push({ q: [Bt[i], Bt[j], T[j], T[i]], c: '#121120', i }); } fc.push({ q: T, c: '#0c0b16' });
    fc.map((x) => [x.q.reduce((s, p) => s + C.depth(...p), 0) / 4, x]).sort((a, b) => b[0] - a[0]).forEach(([, x]) => {
      const P = projPoly(C, x.q); if (!fillPoly(ctx, P, x.c)) return;
      if (x.i == null) return;
      // which way it faces: windows only on the long sides
      if (x.i !== 0 && x.i !== 2) {
        const sd = x.i === 1 ? 1 : -1, n = Math.floor((w1 - w0) / 3.2);
        for (let k = 0; k < n; k++) {
          const wa = w0 + (k + .2) * (w1 - w0) / n, wb = w0 + (k + .8) * (w1 - w0) / n, ya = v0 + .7, yb = v1 - .5;
          const Q = projPoly(C, [F(sd * u * 1.001, ya, wa), F(sd * u * 1.001, ya, wb), F(sd * u * 1.001, yb, wb), F(sd * u * 1.001, yb, wa)]);
          if (Q.length < 3) continue;
          fillPoly(ctx, Q, mixHex('#ffb35c', '#ffd9a0', .3 + .2 * Math.sin(t * 1.1 + k + d)));
          // the silhouette inside: a figure and the deck's thing
          const xs = Q.map((p) => p[0]), ys = Q.map((p) => p[1]), qx = (Math.min(...xs) + Math.max(...xs)) / 2, qb = Math.max(...ys), qh = qb - Math.min(...ys), qw = Math.max(...xs) - Math.min(...xs);
          if (qh < 6) continue;
          ctx.save(); fillPoly(ctx, Q); ctx.clip(); ctx.fillStyle = '#2a1a10';
          const kind = scenes[d], ph = hash(k * 3 + d);
          if (kind === 'class') { ctx.fillRect(qx - qw * .4, qb - qh * .3, qw * .8, qh * .06); ctx.beginPath(); ctx.arc(qx + qw * (ph - .5) * .4, qb - qh * .48 + Math.sin(t * 2 + k) * qh * .02, qh * .1, 0, TAU); ctx.fill(); ctx.fillRect(qx + qw * (ph - .5) * .4 - qh * .1, qb - qh * .38, qh * .2, qh * .1); }
          else if (kind === 'court') { ctx.fillRect(qx - qw * .45, qb - qh * .42, qw * .9, qh * .1); ctx.fillRect(qx - qw * .45, qb - qh * .42, qw * .9 * .08, qh * .42); ctx.beginPath(); ctx.arc(qx, qb - qh * .6, qh * .1, 0, TAU); ctx.fill(); }
          else { ctx.fillRect(qx - qw * .4, qb - qh * .34, qw * .8, qh * .08); ctx.beginPath(); ctx.arc(qx - qw * .15, qb - qh * .55, qh * .1, 0, TAU); ctx.fill(); const a = Math.sin(t * 5 + k) * .5; ctx.save(); ctx.translate(qx - qw * .05, qb - qh * .45); ctx.rotate(a); ctx.fillRect(0, -qh * .02, qh * .3, qh * .05); ctx.restore(); }
          ctx.restore();
        }
      }
    });
  });
  for (const run of projRuns(C, [...deck, deck[0]])) { ctx.strokeStyle = rgba('#d0a070', .4); ctx.lineWidth = 1.2; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
  // the warm glow round it on the water
  const gp = C.P(...F(0, 0, 0)); if (gp) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(gp[0], gp[1]); ctx.scale(1, .25); const R = gp[2] * L * .8, g = ctx.createRadialGradient(0, 0, 0, 0, 0, R); g.addColorStop(0, rgba('#ffb35c', .16)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.restore(); }
  return { bow: F(0, 1.6, L / 2 - 3), deck: 1.6, p: p0 };
}
export function plank(ctx, t, C, A, B, o = {}) {
  const sl = eiX(clamp(o.slip || 0)), out = { lantern: null };
  // after the slip the far end swings down into the water (a hinge at A)
  const L = Math.hypot(B[0] - A[0], B[2] - A[2]), dx = (B[0] - A[0]) / L, dz = (B[2] - A[2]) / L, ang = sl * 1.25;
  const E = [A[0] + dx * L * Math.cos(ang), A[1] - L * Math.sin(ang) * .9 + (B[1] - A[1]) * (1 - sl), A[2] + dz * L * Math.cos(ang)];
  const P = (u) => { const s = Math.sin(Math.PI * u) * (.25 + .5 * (o.stretch || 0)) * (1 - sl); return [A[0] + (E[0] - A[0]) * u, A[1] + (E[1] - A[1]) * u - s, A[2] + (E[2] - A[2]) * u]; };
  const nx = -dz * .45, nz = dx * .45, Lp = [], Rp = [];
  for (let i = 0; i <= 16; i++) { const p = P(i / 16); Lp.push([p[0] + nx, p[1], p[2] + nz]); Rp.push([p[0] - nx, p[1], p[2] - nz]); }
  const Q = projPoly(C, [...Lp, ...Rp.reverse()]);
  if (fillPoly(ctx, Q, '#2a2030')) { ctx.strokeStyle = rgba('#d0a070', .5); ctx.lineWidth = 1.2; ctx.stroke(); }
  // rails (two ropes)
  for (const sd of [-1, 1]) { const pts = []; for (let i = 0; i <= 16; i++) { const p = P(i / 16); pts.push([p[0] + nx * sd * 1.1, p[1] + .9 - Math.sin(Math.PI * i / 16) * .2, p[2] + nz * sd * 1.1]); } for (const run of projRuns(C, pts)) { ctx.strokeStyle = rgba('#8a7a6a', .6); ctx.lineWidth = 1; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  // the small figures on it (they stumble: lean, sway)
  for (const f of o.figs || []) {
    const p = P(f.u), s = C.P(...p); if (!s) continue;
    const k = s[2], sz = k * 1.7 / 178, st = f.stumble || 0;
    ctx.save(); ctx.translate(s[0], s[1]); ctx.rotate(st * .35 * Math.sin(t * 5 + f.u * 9) + st * .2);
    backFig(ctx, t, 0, 0, sz, { seed: Math.floor(f.u * 10), dress: { coat: '#141322', pants: '#0a0912', skin: '#3a2a26', hair: '#0c0a12' }, hold: 'none', light: { x: 0, y: -200, col: '#ffb35c', a: .4 } });
    ctx.restore();
  }
  // the lantern, held at the middle, then dropping into the gap (with a ring on the water)
  if (o.lantern) {
    const lu = o.lantern.u ?? .5, d = clamp(o.lantern.drop || 0), p = P(lu), y = p[1] + 1.2 - (p[1] + 1.2 + .2) * d * d;
    const s = C.P(p[0] + nx * .4, y, p[2] + nz * .4);
    if (s && d < .99) { out.lantern = s; lanterns(ctx, t, [[s[0], s[1], Math.max(2, s[2] * .22), .7]], 1 - .8 * clamp((d - .9) * 10), 0); }
    if (d >= .99) { const age = o.lantern.age || 0, s0 = C.P(p[0], .02, p[2]); if (s0) for (let k = 0; k < 3; k++) { const a = age - k * .25; if (a < 0) continue; const rr = .5 + a * 3, pts = []; for (let i = 0; i <= 40; i++) { const th = i / 40 * TAU; pts.push([p[0] + Math.sin(th) * rr, .03, p[2] + Math.cos(th) * rr]); } for (const run of projRuns(C, pts)) { ctx.strokeStyle = rgba('#ffcf8a', .5 * Math.max(0, 1 - a / 1.6)); ctx.lineWidth = 1.2; ctx.beginPath(); run.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); } } }
  }
  return out;
}
export function swellRidge(ctx, t, C, o) {
  const Z = o.z, x0 = o.x0 ?? -80, x1 = o.x1 ?? 80, h = o.h ?? 2, top = [];
  for (let i = 0; i <= 40; i++) { const X = x0 + (x1 - x0) * i / 40; top.push([X, h * (.85 + .15 * Math.sin(X * .08 + t * .7)), Z + 1.5 * Math.sin(X * .03)]); }
  const body = projPoly(C, [[x0, -1, Z - 6], ...top, [x1, -1, Z - 6]]);
  if (!fillPoly(ctx, body)) return;
  const ys = body.map((p) => p[1]), g = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys)); g.addColorStop(0, o.c0 || '#1c2234'); g.addColorStop(.3, o.c1 || '#0e121e'); g.addColorStop(1, '#06080e');
  ctx.fillStyle = g; ctx.fill();
  for (let k = 0; k < 6; k++) { const pts = top.map(([X, Y, Zz]) => [X, Y - k * h * .14 - .15 * Math.sin(X * .2 + k + t), Zz - k * .9]); for (const run of projRuns(C, pts)) { ctx.strokeStyle = rgba(k ? '#05070c' : '#c8d4f0', k ? .35 : .55); ctx.lineWidth = k ? 1 : 1.6; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); } }
  // spray off the crest
  for (let i = 0; i < 40; i++) { const ph = (t * .8 + hash(i)) % 1, X = x0 + (x1 - x0) * hash(i * 2.7), p = C.P(X - ph * 3, h + ph * 1.5 - ph * ph * 2, Z - ph * 2); if (p) { ctx.fillStyle = rgba('#d8e2f8', .5 * (1 - ph)); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(.7, p[2] * .05), 0, TAU); ctx.fill(); } }
}
