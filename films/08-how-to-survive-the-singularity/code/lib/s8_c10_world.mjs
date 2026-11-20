// Film 8 · c10 local pieces (B3): the fork. ONE sea under ONE sky, split by a seam along X = 0 (the vertical line of the c09>c10 plate):
// the drift world on the left (X < 0: colder, dimmer, lanterns at 30 %), the navigate world on the right (X > 0: warm, lanterns full).
//   seam(C) → { a, b, d, n } the seam's screen line (a near point, b far point, d unit direction toward the horizon, n unit normal to the LEFT)
//   clipHalf(ctx, C, side, below)   clip to one half of the sea (side -1 left, +1 right); below: also clip above the horizon away
//   seamLine(ctx, t, C, o)          the engraved cream seam on the water (o: { a, w, pulse 0..1 })
//   coldHalf(ctx, C, k)             the left half's cold, dim tone (sea only)
//   farBoat(ctx, t, C, B)           a far boat as a cheap engraved glyph (B: { x, z, head, sail 'full'|'slack', lan 0..1, needle: angle|null, k? })
//   ship(ctx, t, C, S)              the big ship with a glass wheelhouse, three at its wheel (S: { x, z, head, L }) → { stern, bow, wheel }
//   towLine(ctx, t, C, a, b, o)     a long sagging tow line between two world points
//   crew(ctx, t, C, B, list)        figures on a boat() hull: list [{ u, w, pose, flip, sit }] (boat-local metres)
//   ruleBoard(ctx, t, C, o)         an open deck (raft) with a rule board everyone can see, lanterns, people round it → { pen: [x, y] }
//   gate(ctx, t, C, o)              the lit inspection gate on the water (two posts + beam);  vessel(ctx, t, C, V) the new cool-lit vessel
//   paddleHands(ctx, t, o)          screen space: the canoe's long steering paddle shaft and the hands on it (o: { u: [..] per hand, you })
import { rgba, clamp, prng } from '../engine.mjs';
import { TAU, projRuns, projPoly, fillPoly, mixHex, hash, eoX, eiX, sio, u01 } from './s8_kit.mjs';
import { waterY } from './s8_sea.mjs';
import { figure } from './figure.mjs';
import { hand } from './hand.mjs';
import { frameOf } from './s8_boats.mjs';

// ---------------------------------------------------------------- the seam
export function seam(C) {
  const z0 = C.z + Math.max(2, C.y * .3), a = C.P(0, 0, z0, .05) || C.P(0, 0, C.z + 40, .05), b = C.P(0, 0, C.z + 4000, .05);
  if (!a || !b) return null;
  const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, d = [dx / m, dy / m];
  return { a, b, d, n: [d[1], -d[0]] };
}
export function clipHalf(ctx, C, side, below = true) {
  const S = seam(C); ctx.beginPath();
  if (!S) { if (side < 0) ctx.rect(0, 0, 0, 0); else ctx.rect(0, 0, 1920, 1080); ctx.clip(); return; }
  const { a, d, n } = S, L = 6000, s = side < 0 ? 1 : -1;
  const p1 = [a[0] - d[0] * L, a[1] - d[1] * L], p2 = [a[0] + d[0] * L, a[1] + d[1] * L];
  ctx.moveTo(...p1); ctx.lineTo(...p2); ctx.lineTo(p2[0] + n[0] * L * s, p2[1] + n[1] * L * s); ctx.lineTo(p1[0] + n[0] * L * s, p1[1] + n[1] * L * s); ctx.closePath(); ctx.clip();
  if (below) { ctx.beginPath(); ctx.rect(-10, C.hy - 1, 1940, 1200); ctx.clip(); }
}
export function seamLine(ctx, t, C, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const pts = []; for (let i = 0; i <= 60; i++) { const z = C.z + Math.max(.5, C.y * .1) + Math.pow(i / 60, 3) * 5000; pts.push([0, .05, z]); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const pu = o.pulse || 0, w = o.w ?? 1;
  for (const run of projRuns(C, pts, .2)) {
    for (const [lw, al, c] of [[26, .05, '#e9dcc0'], [10, .14, '#e9dcc0'], [3.2, .5, '#e9dcc0'], [1.4, .9, '#fffaf0']]) {
      ctx.strokeStyle = rgba(c, Math.min(1, al * a * (1 + 1.2 * pu))); ctx.lineWidth = lw * w * (1 + .6 * pu);
      ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    }
  }
  ctx.restore();
}
export function coldHalf(ctx, C, k) {
  if (k <= 0) return;
  ctx.save(); clipHalf(ctx, C, -1, true);
  ctx.fillStyle = rgba('#0a1428', .38 * k); ctx.fillRect(0, 0, 1920, 1080);
  ctx.globalCompositeOperation = 'color'; ctx.fillStyle = rgba('#3a4a6a', .35 * k); ctx.fillRect(0, 0, 1920, 1080);
  ctx.restore();
}

// ---------------------------------------------------------------- a far boat (glyph; projected hull outline, sail, lantern, needle)
export function farBoat(ctx, t, C, B) {
  const y0 = waterY(B.x, B.z, t) * .6, p = C.P(B.x, y0 + .4, B.z, .5); if (!p || p[0] < -60 || p[0] > 1980 || p[1] < C.hy - 40 || p[1] > 1120) return null;
  const k = p[2], sc = B.k ?? 1, h = B.head, fx = Math.sin(h), fz = Math.cos(h);
  if (k * 5 * sc < 1.2) { if (B.lan > 0) { ctx.fillStyle = rgba('#ffb35c', .8 * B.lan); ctx.fillRect(p[0] - .7, p[1] - .7, 1.4, 1.4); } return p; }
  const bow = C.P(B.x + fx * 2.6 * sc, y0, B.z + fz * 2.6 * sc, .5), st = C.P(B.x - fx * 2.6 * sc, y0, B.z - fz * 2.6 * sc, .5);
  if (!bow || !st) return p;
  const bx = (bow[0] - st[0]) / 2, by = (bow[1] - st[1]) / 2, len = Math.hypot(bx, by) || 1, wv = Math.max(.8, k * .9 * sc);
  const cx = (bow[0] + st[0]) / 2, cy = (bow[1] + st[1]) / 2, nx = -by / len * wv, ny = bx / len * wv;
  ctx.save();
  ctx.fillStyle = '#07060e'; ctx.beginPath(); ctx.moveTo(bow[0], bow[1]); ctx.quadraticCurveTo(cx + nx * 1.6, cy + ny * 1.6, st[0] + nx * .7, st[1] + ny * .7); ctx.lineTo(st[0] - nx * .7, st[1] - ny * .7); ctx.quadraticCurveTo(cx - nx * 1.6, cy - ny * 1.6, bow[0], bow[1]); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(B.lan > .5 ? '#d8a070' : '#7e8ab8', .35 + .2 * (B.lan || 0)); ctx.lineWidth = Math.max(.6, k * .06); ctx.stroke();
  // sail: a triangle standing up from the mast (in screen space the mast goes up by k·5 m when the camera is level, less from above)
  if (B.sail !== 'none') {
    const m0 = C.P(B.x + fx * .4 * sc, y0 + .6, B.z + fz * .4 * sc, .5), m1 = C.P(B.x + fx * .4 * sc, y0 + 5.2 * sc, B.z + fz * .4 * sc, .5);
    if (m0 && m1) {
      const slack = B.sail === 'slack', sw = slack ? .25 * Math.sin(t * .9 + B.x) : (B.side ?? .5);
      const cl = C.P(B.x - fx * 2 * sc + Math.cos(h) * sw * 2.2 * sc, y0 + 1, B.z - fz * 2 * sc - Math.sin(h) * sw * 2.2 * sc, .5);
      if (cl) {
        const bul = slack ? .12 * Math.sin(t * 3.1 + B.z) : .25;
        ctx.fillStyle = slack ? '#22213a' : '#2e2c48'; ctx.beginPath(); ctx.moveTo(m0[0], m0[1]); ctx.lineTo(m1[0], m1[1]);
        ctx.quadraticCurveTo((m1[0] + cl[0]) / 2 + (cl[1] - m1[1]) * bul, (m1[1] + cl[1]) / 2 - (cl[0] - m1[0]) * bul, cl[0], cl[1]); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = rgba('#c8cff0', slack ? .18 : .3); ctx.lineWidth = Math.max(.5, k * .05); ctx.stroke();
        if ((B.lan || 0) > .2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb070', .2 * B.lan); ctx.beginPath(); ctx.moveTo(m0[0], m0[1]); ctx.lineTo(cl[0], cl[1]); ctx.stroke(); ctx.restore(); }
      }
    }
  }
  // the lantern at the stern
  const lan = B.lan || 0;
  if (lan > 0) {
    const lp = C.P(B.x - fx * 2.2 * sc, y0 + 1.2, B.z - fz * 2.2 * sc, .5);
    if (lp) {
      ctx.globalCompositeOperation = 'lighter'; const fl = 1 + .08 * Math.sin(t * 8.3 + B.x * 3) + .05 * Math.sin(t * 21 + B.z);
      const R = Math.max(3, lp[2] * 1.6) * fl, g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], R);
      g.addColorStop(0, rgba('#fff1d6', .9 * lan)); g.addColorStop(.18, rgba('#ffb35c', .55 * lan)); g.addColorStop(1, rgba('#c4512e', 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lp[0], lp[1], R, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba('#fff6e2', lan); ctx.beginPath(); ctx.arc(lp[0], lp[1], Math.max(.8, lp[2] * .08), 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  if (B.needle != null) needleGlyph(ctx, t, C, B.x, y0 + 1.4, B.z, B.needle, B.glow ?? 1, sc);
  ctx.restore();
  return p;
}

// a tiny glowing amber compass needle held over a boat (all the right half's needles point the same way)
export function needleGlyph(ctx, t, C, X, Y, Z, a, gA = 1, sc = 1) {
  const q = C.P(X, Y, Z, .5); if (!q) return;
  const L = 2.4 * sc, tip = C.P(X + Math.sin(a) * L, Y, Z + Math.cos(a) * L, .5), tl = C.P(X - Math.sin(a) * L * .6, Y, Z - Math.cos(a) * L * .6, .5);
  if (!tip || !tl) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const R = Math.max(6, q[2] * 2.4), g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], R); g.addColorStop(0, rgba('#ffb35c', .6 * gA)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q[0], q[1], R, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba('#ff9a4a', .5 * gA); ctx.lineWidth = Math.max(3, q[2] * .5); ctx.beginPath(); ctx.moveTo(tl[0], tl[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
  ctx.strokeStyle = rgba('#fff1d6', .95 * gA); ctx.lineWidth = Math.max(1.3, q[2] * .18); ctx.beginPath(); ctx.moveTo(tl[0], tl[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
  ctx.restore();
}
// ---------------------------------------------------------------- the big ship with the glass wheelhouse (the few at the wheel)
const SH = (() => { const a = []; for (let i = 0; i <= 18; i++) { const v = i / 18, w = -.5 + v, e = Math.abs(w) / .5; a.push([.5 * Math.pow(Math.max(0, 1 - Math.pow(Math.max(0, (w - .1) / .4), 2.2)), .5) * (w < -.42 ? .9 : 1) + .02, w]); } return a; })();
export function ship(ctx, t, C, S) {
  const L = S.L ?? 34, B = L * .2, Hh = 2.4, h = S.head, fx = Math.sin(h), fz = Math.cos(h), rx = Math.cos(h), rz = -Math.sin(h);
  const y0 = .15 * Math.sin(t * .6 + S.x * .1), roll = .01 * Math.sin(t * .5);
  const F = (u, v, w) => [S.x + rx * u * B + fx * w * L, y0 + v + u * B * roll, S.z + rz * u * B + fz * w * L];
  ctx.save(); ctx.lineJoin = 'round';
  const top = [...SH.map(([u, w]) => F(u, Hh, w)), ...SH.slice().reverse().map(([u, w]) => F(-u, Hh, w))];
  const bot = [...SH.map(([u, w]) => F(u * .85, -.3, w * .97)), ...SH.slice().reverse().map(([u, w]) => F(-u * .85, -.3, w * .97))];
  fillPoly(ctx, projPoly(C, bot.map(([x, y, z]) => [x, .02, z])), 'rgba(2,2,8,.5)');
  const quads = []; for (let i = 0; i < top.length; i++) { const j = (i + 1) % top.length, q = [top[i], top[j], bot[j], bot[i]]; quads.push([q.reduce((s, p) => s + C.depth(...p), 0) / 4, q, i]); }
  quads.sort((a, b) => b[0] - a[0]);
  for (const [, q, i] of quads) { const P = projPoly(C, q); if (P.length < 3) continue; const c = mixHex('#07070d', '#1c1b2c', .35 + .4 * Math.sin(i * .21)); fillPoly(ctx, P, c); ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.stroke(); }
  fillPoly(ctx, projPoly(C, top), '#0c0b14');
  for (const run of projRuns(C, [...top, top[0]])) { ctx.strokeStyle = rgba('#9aa6d8', .4); ctx.lineWidth = 1.3; ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  // the wheelhouse: a tall glass room aft of midships, lit cold from inside; three figures at the wheel seen through the glass
  const u0 = -.36, u1 = .36, w0 = -.26, w1 = -.08, v0 = Hh, v1 = Hh + 4.2;
  const corners = [[u0, w0], [u1, w0], [u1, w1], [u0, w1]], T = corners.map(([u, w]) => F(u, v1, w)), Bt = corners.map(([u, w]) => F(u, v0, w));
  const faces = []; for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; faces.push([[T[i], T[j], Bt[j], Bt[i]], (C.depth(...T[i]) + C.depth(...T[j])) / 2, i]); }
  faces.sort((a, b) => b[1] - a[1]);
  const wheel = F(0, v0 + 1.6, (w0 + w1) / 2 + .02), wp = C.P(...wheel);
  // far walls first (solid lower panel, glass band above), then the people, then the near walls; a roof slab that overhangs
  const face = (q, near) => {
    const [a0, a1, b1, b0] = q, mid = (p, r, v) => p.map((x, i) => x + (r[i] - x) * v), band = 1.2 / (v1 - v0);
    const solid = projPoly(C, [mid(b0, a0, band), mid(b1, a1, band), b1, b0]), gl = projPoly(C, [a0, a1, mid(b1, a1, band), mid(b0, a0, band)]);
    fillPoly(ctx, solid, near ? '#0b0f18' : '#080b12');
    if (fillPoly(ctx, gl, near ? rgba('#6ad0ea', .14) : '#0d2230')) {
      ctx.save(); fillPoly(ctx, gl); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
      const c = gl.reduce((s2, p) => [s2[0] + p[0] / gl.length, s2[1] + p[1] / gl.length], [0, 0]), g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 220); g.addColorStop(0, rgba('#d8f7ff', near ? .2 : .32)); g.addColorStop(1, rgba('#8fe6ff', near ? .02 : .06)); ctx.fillStyle = g; ctx.fillRect(c[0] - 260, c[1] - 260, 520, 520); ctx.restore();
    }
  };
  for (const [q] of faces.slice(0, 2)) face(q, false);
  // the three at the wheel (inside, between the far and near glass)
  if (wp) {
    const k = wp[2], s = k * 1.75 / 184;
    for (const [du, ph] of [[-.2, 0], [0, 1.3], [.2, 2.4]]) {
      const pp = C.P(...F(du, v0, (w0 + w1) / 2 + .03)); if (!pp) continue;
      figure(ctx, pp[0], pp[1] - 90 * s, s, { sh: [.9 + .1 * Math.sin(t * .8 + ph), .9], el: [.6, .6], head: .1 }, { t, seed: 7 + ph * 3, rim: '#bfefff', light: { x: pp[0], y: pp[1] - 120 * s, col: '#bfefff', a: .7 }, dress: { coat: '#141a28', pants: '#0b0d18', skin: '#2a2a30', hair: '#0a0a10' }, shadow: false });
    }
    ctx.strokeStyle = rgba('#bfefff', .55); ctx.lineWidth = Math.max(1, k * .06); ctx.beginPath(); ctx.ellipse(wp[0], wp[1], k * .45, k * .45, 0, 0, TAU); ctx.stroke();
  }
  for (const [q] of faces.slice(2)) face(q, true);
  // mullions (thin, on the glass band only) and the overhanging roof
  ctx.strokeStyle = rgba('#a8e8f6', .4); ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) for (let m = 0; m <= 4; m++) { const v = m / 4, ci = corners[i], cj = corners[(i + 1) % 4], u = ci[0] + (cj[0] - ci[0]) * v, w = ci[1] + (cj[1] - ci[1]) * v, a = C.P(...F(u, v0 + 1.2, w)), b = C.P(...F(u, v1, w)); if (a && b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  const roof = projPoly(C, [[u0 - .05, w0 - .03], [u1 + .05, w0 - .03], [u1 + .05, w1 + .04], [u0 - .05, w1 + .04]].map(([u, w]) => F(u, v1 + .05, w)));
  fillPoly(ctx, roof, '#090b12'); ctx.strokeStyle = rgba('#9aa6d8', .5); ctx.lineWidth = 1.2; ctx.stroke();
  // its light spills cold on the water and the deck
  if (wp) { ctx.globalCompositeOperation = 'lighter'; const R = wp[2] * 9, g = ctx.createRadialGradient(wp[0], wp[1], 0, wp[0], wp[1], R); g.addColorStop(0, rgba('#8fe6ff', .22)); g.addColorStop(1, rgba('#0a6f8c', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(wp[0], wp[1], R, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
  // a mast with a cold top light
  { const a = C.P(...F(0, Hh, .18)), b = C.P(...F(0, Hh + 9, .18)); if (a && b) { ctx.strokeStyle = '#08070e'; ctx.lineWidth = Math.max(1.2, a[2] * .2); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#d8f7ff', .9); ctx.beginPath(); ctx.arc(b[0], b[1], Math.max(1.5, b[2] * .12), 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; } }
  ctx.restore();
  return { stern: F(0, Hh * .6, -.5), bow: F(0, Hh, .5), wheel, F };
}
export function towLine(ctx, t, C, a, b, o = {}) {
  const pts = []; for (let i = 0; i <= 24; i++) { const v = i / 24, sag = (o.sag ?? .8) * Math.sin(Math.PI * v) * (1 - (o.taut ?? 0)); pts.push([a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v - sag, a[2] + (b[2] - a[2]) * v]); }
  ctx.save(); ctx.lineCap = 'round';
  for (const run of projRuns(C, pts, .3)) { const k = run[0][2]; ctx.strokeStyle = rgba('#a4b0dc', (o.a ?? .5)); ctx.lineWidth = Math.max(.7, k * .04); ctx.beginPath(); run.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- figures on a boat (boat-local metres; u across, w along)
export function crew(ctx, t, C, B, list, o = {}) {
  const F = frameOf(B, t), sc = B.scale ?? 1;
  const items = list.map((c, i) => { const w = F(c.u * sc, .62 * sc, c.w * sc); return { c, w, d: C.depth(...w), i }; }).sort((a, b) => b.d - a.d);
  for (const { c, w, i } of items) {
    const p = C.P(...w); if (!p) continue;
    const s = p[2] * 1.72 / 184 * sc * (c.size ?? 1); if (s > 5) continue;
    const pose = c.sit ? { hip: [1.42, 1.5], kn: [1.42, 1.5], sh: [.3, .25], el: [.6, .7], lean: .22 + .04 * Math.sin(t * .4 + i), head: .45 } : (c.pose || {});
    const yy = c.sit ? p[1] - 50 * s : p[1] - 90 * s;
    figure(ctx, p[0], yy, s, pose, { t, seed: (o.seed || 11) + i * 3, flip: !!c.flip, rim: o.rim || '#a4b0dc', light: o.light ? { x: o.light[0], y: o.light[1], col: o.lightCol || '#ffc890', a: o.lightA ?? .7 } : undefined, dress: o.dress || { coat: '#1a1a2e', pants: '#0e0d1c', skin: '#3a2a26', hair: '#0c0a12' }, shadow: false });
  }
}

// ---------------------------------------------------------------- the open deck with a rule board everyone can see
const RULES = (() => { const r = prng(4410), L = []; for (let i = 0; i < 7; i++) { const w = []; let x = 0; while (x < .82) { const l = .05 + r() * .14; w.push([x, Math.min(.86, x + l)]); x += l + .03 + r() * .02; } L.push(w); } return L; })();
export function ruleBoard(ctx, t, C, o) {
  const X = o.x, Z = o.z, y0 = waterY(X, Z, t) * .35, head = o.head ?? 0, fx = Math.sin(head), fz = Math.cos(head), rx = Math.cos(head), rz = -Math.sin(head);
  const F = (u, v, w) => [X + rx * u + fx * w, y0 + v, Z + rz * u + fz * w];
  ctx.save(); ctx.lineJoin = 'round';
  // the raft: a wide deck of planks on the water
  const deck = [F(-5, .5, -4), F(5, .5, -4), F(5, .5, 3.4), F(-5, .5, 3.4)];
  fillPoly(ctx, projPoly(C, deck.map(([x, , z]) => [x, .02, z])), 'rgba(2,2,8,.5)');
  const DP = projPoly(C, deck);
  if (fillPoly(ctx, DP, '#1c1218')) {
    ctx.save(); fillPoly(ctx, DP); ctx.clip();
    const lc = C.P(...F(0, .6, -.6)); if (lc) { const g = ctx.createRadialGradient(lc[0], lc[1], 0, lc[0], lc[1], lc[2] * 6); g.addColorStop(0, rgba('#ffb35c', .55)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
    ctx.strokeStyle = rgba('#05030a', .6); ctx.lineWidth = 1; ctx.beginPath(); for (let u = -5; u <= 5; u += .45) { const a = C.P(...F(u, .51, -4)), b = C.P(...F(u, .51, 3.4)); if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } } ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = rgba('#ffb066', .35); ctx.lineWidth = 1.2; ctx.beginPath(); DP.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
  }
  // the board: a cream sheet on two posts, facing the camera side (−w), lamp-lit
  const bw = 1.7, bv0 = 1.5, bv1 = 3.1, bwz = 1.4;
  for (const u of [-bw - .05, bw + .05]) { const a = C.P(...F(u, .5, bwz)), b = C.P(...F(u, bv1 + .2, bwz)); if (a && b) { ctx.strokeStyle = '#120a0a'; ctx.lineWidth = Math.max(1.5, a[2] * .1); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  const corners = [F(-bw, bv1, bwz), F(bw, bv1, bwz), F(bw, bv0, bwz), F(-bw, bv0, bwz)].map((p) => C.P(...p, .5));
  const A = corners.every((p) => p && p[0] > -3000 && p[0] < 4900 && p[1] > -3000 && p[1] < 4000) ? C.plane(F(-bw, bv1, bwz), [rx, 0, rz], [0, -1, 0]) : null;
  let pen = null;
  if (A) {
    ctx.save(); ctx.transform(...A);
    const W2 = bw * 2, H2 = bv1 - bv0;
    const g = ctx.createRadialGradient(W2 * .5, H2 * .9, 0, W2 * .5, H2 * .9, W2 * .9); g.addColorStop(0, '#f6eedc'); g.addColorStop(.6, '#e2cfa4'); g.addColorStop(1, '#8a6a44');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W2, H2);
    ctx.strokeStyle = '#2a2420'; ctx.lineCap = 'round';
    ctx.lineWidth = .045; ctx.beginPath(); ctx.moveTo(W2 * .08, H2 * .14); ctx.lineTo(W2 * .5, H2 * .14); ctx.stroke();   // heading
    const n = RULES.length - 1, addU = clamp(o.add ?? 0);
    RULES.forEach((ln, i) => {
      const yy = H2 * (.3 + i * .095); if (i === n && addU <= 0) return;
      ctx.lineWidth = .022; ctx.beginPath();
      for (const [a, b] of ln) { const e = i === n ? Math.min(b, a + (addU * .9 - a) * 1) : b; if (i === n && addU * .9 < a) break; ctx.moveTo(W2 * (.08 + a), yy + .01 * Math.sin(a * 40)); ctx.lineTo(W2 * (.08 + Math.min(b, i === n ? addU * .9 : b)), yy - .008 * Math.sin(b * 30)); }
      ctx.stroke();
      if (i === n) { const xx = W2 * (.08 + Math.min(.86, addU * .9)); pen = [A[0] * xx + A[2] * yy + A[4], A[1] * xx + A[3] * yy + A[5]]; }
    });
    ctx.restore();
  }
  // lanterns on poles at the deck corners
  for (const [u, w] of [[-4.4, -3.4], [4.4, -3.4], [-4.4, 2.8], [4.4, 2.8]]) {
    const a = C.P(...F(u, .5, w)), b = C.P(...F(u, 2.6, w)); if (!a || !b) continue;
    ctx.strokeStyle = '#100808'; ctx.lineWidth = Math.max(1, a[2] * .06); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    ctx.globalCompositeOperation = 'lighter'; const R = b[2] * 1.8 * (1 + .06 * Math.sin(t * 9 + u)), g = ctx.createRadialGradient(b[0], b[1], 0, b[0], b[1], R); g.addColorStop(0, rgba('#fff1d6', .95)); g.addColorStop(.15, rgba('#ffb35c', .55)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b[0], b[1], R, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
  return { pen, F };
}

// ---------------------------------------------------------------- the inspection gate and the new vessel
export function gate(ctx, t, C, o) {
  const X = o.x, Z = o.z, half = o.half ?? 6, on = o.on ?? 1;
  ctx.save();
  const post = (x) => {
    const a = C.P(x, -.2, Z), b = C.P(x, 6.5, Z); if (!a || !b) return null;
    const w = Math.max(2, a[2] * .5);
    ctx.fillStyle = '#0c0a12'; ctx.fillRect(a[0] - w / 2, b[1], w, a[1] - b[1]);
    ctx.strokeStyle = rgba('#ffb066', .4); ctx.lineWidth = 1; ctx.strokeRect(a[0] - w / 2, b[1], w, a[1] - b[1]);
    return b;
  };
  const l = post(X - half), r = post(X + half);
  if (l && r) {
    ctx.strokeStyle = '#0c0a12'; ctx.lineWidth = Math.max(2, l[2] * .4); ctx.beginPath(); ctx.moveTo(l[0], l[1]); ctx.lineTo(r[0], r[1]); ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i <= 6; i++) { const v = i / 6, x = l[0] + (r[0] - l[0]) * v, y = l[1] + (r[1] - l[1]) * v + 3, R = Math.max(5, l[2] * 1.2) * (1 + .05 * Math.sin(t * 6 + i)); const g = ctx.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, rgba('#fff1d6', .9 * on)); g.addColorStop(.2, rgba('#ffb35c', .5 * on)); g.addColorStop(1, rgba('#c4512e', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill(); }
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
}
export function vessel(ctx, t, C, V) {
  const h = V.head, fx = Math.sin(h), fz = Math.cos(h), rx = Math.cos(h), rz = -Math.sin(h), y0 = waterY(V.x, V.z, t) * .4;
  const F = (u, v, w) => [V.x + rx * u + fx * w, y0 + v, V.z + rz * u + fz * w];
  const hull = []; for (let i = 0; i <= 12; i++) { const v = i / 12, w = -5 + 10 * v, bw = 1.3 * Math.pow(Math.max(0, 1 - Math.pow(Math.max(0, (w - 1) / 4), 2)), .6) + .05; hull.push([bw, w]); }
  const top = [...hull.map(([u, w]) => F(u, 1.1, w)), ...hull.slice().reverse().map(([u, w]) => F(-u, 1.1, w))];
  ctx.save();
  fillPoly(ctx, projPoly(C, top.map(([x, , z]) => [x, .02, z])), 'rgba(2,2,8,.5)');
  const P = projPoly(C, top); fillPoly(ctx, P, '#0d1018');
  ctx.strokeStyle = rgba('#bfefff', .55); ctx.lineWidth = 1.3; ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
  // a low sleek cabin with a cool light inside
  const cab = projPoly(C, [F(-.8, 1.1, -2.5), F(.8, 1.1, -2.5), F(.6, 2.1, -1), F(-.6, 2.1, -1)]); fillPoly(ctx, cab, '#123040');
  const lp = C.P(...F(0, 1.8, -1.6));
  if (lp) { ctx.globalCompositeOperation = 'lighter'; const R = lp[2] * 3, g = ctx.createRadialGradient(lp[0], lp[1], 0, lp[0], lp[1], R); g.addColorStop(0, rgba('#d8f7ff', .8)); g.addColorStop(.2, rgba('#8fe6ff', .3)); g.addColorStop(1, rgba('#0a6f8c', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(lp[0], lp[1], R, 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
  ctx.restore();
  return lp;
}

// ---------------------------------------------------------------- the canoe's steering paddle and the hands on it (screen space)
// The shaft runs from the bottom right up to the top left (the paddle blade is in the water behind the canoe); the hands come up from below
// (sleeves to the bottom edge) and close round it, one after another; on "steer" all of them lean on it together (o.lean 0..1).
const HANDS = [
  { s: .30, skin: '#7a4f33', sleeve: '#3a2a1e', tilt: .25 },
  { s: .46, skin: '#a8734f', sleeve: '#1e2a3a', tilt: -.15 },
  { s: .61, skin: '#5a3a26', sleeve: '#3a2418', tilt: .2 },
  { s: .76, skin: '#c99a74', sleeve: '#26304a', tilt: -.2 },
];
export function paddleHands(ctx, t, o) {
  const lean = o.lean || 0, sway = 18 * Math.sin(t * .8) + 60 * lean;
  const en = 1 - (o.enter ?? 1), ox = en * 900, oy = en * 1000;   // the camera passes the shaft: it slides in from the bottom right
  const A = [1720 + sway + ox, 1160 + oy], B = [260 + sway * .4 + ox, 130 + 40 * lean + oy], sw = 30;
  const d = [B[0] - A[0], B[1] - A[1]], L = Math.hypot(...d), u = [d[0] / L, d[1] / L], n = [-u[1], u[0]];   // n points up-right of the shaft… make it point down
  const dn = n[1] > 0 ? n : [-n[0], -n[1]];
  const sa = o.shaftA ?? 1;
  if (sa > 0) {
    ctx.save();
    ctx.fillStyle = '#1a0e0a'; ctx.beginPath(); ctx.moveTo(A[0] + n[0] * sw, A[1] + n[1] * sw); ctx.lineTo(B[0] + n[0] * sw * .8, B[1] + n[1] * sw * .8); ctx.lineTo(B[0] - n[0] * sw * .8, B[1] - n[1] * sw * .8); ctx.lineTo(A[0] - n[0] * sw, A[1] - n[1] * sw); ctx.closePath(); ctx.fill();
    const g = ctx.createLinearGradient(A[0] - dn[0] * sw, A[1] - dn[1] * sw, A[0] + dn[0] * sw, A[1] + dn[1] * sw); g.addColorStop(0, 'rgba(255,175,95,.6)'); g.addColorStop(.3, 'rgba(140,70,35,.25)'); g.addColorStop(1, 'rgba(0,0,0,.35)');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(30,14,8,.55)'; ctx.lineWidth = 1.1; ctx.beginPath(); for (let k = 0; k < 5; k++) { const off = (k / 5 - .4) * sw * 1.5; ctx.moveTo(A[0] + n[0] * off, A[1] + n[1] * off); ctx.lineTo(B[0] + n[0] * off * .8, B[1] + n[1] * off * .8); } ctx.stroke();
    ctx.restore();
  }
  const at = (s) => [A[0] + d[0] * s, A[1] + d[1] * s];
  const list = HANDS.map((h, i) => ({ ...h, u: o.u[i] ?? 0 }));
  if (o.you != null) list.push({ s: .14, skin: o.youSkin || '#c99a74', sleeve: o.youSleeve || '#2a2236', tilt: .05, u: o.you, you: true });
  for (const h of list) {
    if (h.u <= 0) continue;
    const e = eoX(clamp(h.u)), p = at(h.s), drop = (1 - e) * 650 + oy * .2;
    // fingers point up across the shaft (perpendicular to it, upward), the wrist sits below the shaft
    const ang = Math.atan2(-dn[1], -dn[0]) + h.tilt * .5, sc = h.you ? 1.25 : 1.15;
    const wx = p[0] + dn[0] * 62 * sc - Math.cos(ang) * 0, wy = p[1] + dn[1] * 62 * sc + drop;
    hand(ctx, wx, wy, sc, { pose: 'grip', ang, flip: h.tilt < 0, skin: h.skin, sleeve: h.sleeve, sleeveLen: 520, rim: '#ffc27a', light: [.5, -.6], t, seed: 3 + h.s * 10, close: .15 * (1 - e) });
  }
  return { at };
}
