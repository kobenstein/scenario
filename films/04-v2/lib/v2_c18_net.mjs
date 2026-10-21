// c18 · the light's infrastructure: the aqueduct of 3.02 that carries the amber share lights from the left horizon into district A (only),
// the castellum where it ends, the network the burin draws on in 18.05 (a trunk to the sunrise, lines to every district and town up to
// the horizon), the towns, and the line to you: from A's castellum to the far rim, a ragged broken end over the gap, the dotted ghost of
// the next stretch across the valley to your parapet, the stretch you engrave yourself (18.09).
import { W, H, clamp, mix, rgba, prng } from '../engine.mjs';
import { shareLight } from './share.mjs';
import { burinShape } from './v2_c18_you.mjs';
import { cs, toScr, NEAR, path3, line3, proj, mixRGB, css, mix3, hash, eoX, sio, smoothPath } from './v2_c18_kit.mjs';
import { G, plainY, groundY, farEdge, fogK, hazeRGB, tri } from './v2_c18_land.mjs';
import { CASTELLUM, LANDING, AQ_CTRL, NODE, LINE_DEF, BR_CTRL } from './v2_c18_city.mjs';
import { arcade, arcadeItems, flowLights, side3 } from './v2_c18_arcade.mjs';

const TOP = G.coping;   // every channel runs at the height of your coping
const ARC = { top: TOP, bay: 30, pier: 6, width: 6, upper: 9.5, small: 3 };
// ---------------------------------------------------------------- the aqueduct of 3.02, from the left horizon into district A
export const AQ = arcade(smoothPath(AQ_CTRL, 24), { ...ARC, ground: (x, z) => plainY(x, z) });
// ---------------------------------------------------------------- the line to you: your parapet → the far rim → A's castellum
const DIR = [Math.sin(.253), -Math.cos(.253)];
export const B0 = BR_CTRL.B0;
const BR_PTS = BR_CTRL.pts;
export const BR = arcade(BR_PTS, { ...ARC, bay: 26.8, width: 3.4, ground: (x, z) => groundY(x, z), midY: -42 });   // a walk one could cross
export const S_BREAK = 94;                  // the far side's ragged end, a bay and a half out over the valley
export const S_YOURS = 26.8 * 2;            // the stretch you engrave
export const S_LAND = 134;                   // the far rim (the valley lies between your parapet and here)
// ---------------------------------------------------------------- the network (18.05): nodes, lines, towns
const LINES = LINE_DEF.map((d) => ({ ...d }));
for (const L of LINES) { L.path = smoothPath(L.n.map((k) => NODE[k]), 24); L.A = arcade(L.path, { ...ARC, ground: (x, z) => plainY(x, z) }); L.cum = [0]; for (let i = 1; i < L.n.length; i++) { const a = NODE[L.n[i - 1]], b = NODE[L.n[i]]; L.cum.push(L.cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); } const k = L.A.len / L.cum[L.cum.length - 1]; L.cum = L.cum.map((v) => v * k); }
// towns: one at every t-node, villages along the lines (lit when the line's front passes their attach point)
export const TOWNS = (() => {
  const r = prng(616), out = [];
  for (const [k, p] of Object.entries(NODE)) if (k[0] === 't' && p) out.push({ x: p[0] + 40, z: p[1] - 20, R: 110 + r() * 90, n: 12 + Math.floor(r() * 9), seed: Math.floor(r() * 1e5), node: k, church: true });
  for (const L of LINES) { if (L.id.startsWith('spur')) continue; for (let s = 700; s < L.A.len - 300; s += 900 + r() * 700) { const [x, z, dx, dz] = L.A.at(s), side = r() < .5 ? -1 : 1, off = 160 + r() * 260; out.push({ x: x - dz * side * off, z: z + dx * side * off, R: 50 + r() * 50, n: 5 + Math.floor(r() * 5), seed: Math.floor(r() * 1e5), line: L.id, s, church: r() < .4 }); } }
  // houses (relative to the town centre), sorted later by depth
  for (const T of out) { const q = prng(T.seed); T.h = []; for (let i = 0; i < T.n; i++) { const a = q() * Math.PI * 2, d = T.R * Math.sqrt(q()); T.h.push({ dx: Math.cos(a) * d, dz: Math.sin(a) * d * .7, w: 7 + q() * 7, hh: 5 + q() * 6, r: 3 + q() * 3, tone: q(), win: q() }); } if (T.church) T.h.push({ dx: 0, dz: 0, w: 9, hh: 13, r: 4, spire: 18 + q() * 8, tone: .3, win: .5 }); if (q() < .5) T.h.push({ dx: (q() - .5) * T.R, dz: (q() - .5) * T.R * .5, w: 6, hh: 20 + q() * 10, r: 0, tone: .6, win: .7, tower: true }); T.trees = Array.from({ length: 6 + Math.floor(q() * 8) }, () => { const a = q() * Math.PI * 2, d = T.R * (.6 + q() * .7); return { dx: Math.cos(a) * d, dz: Math.sin(a) * d * .7, s: 4 + q() * 4 }; }); }
  return out;
})();
// the network's clock: built from the scene's anchors. K = { t0 (burin lands at A), every (the trunk reaches the horizon), sparks }
export function netClock(K) {
  const L = LINES, reach = {}, line = {};
  const trunk = L[0], tl = trunk.A.len, inv = (y) => (y >= .999 ? 1 : -Math.log2(1 - y) / 10);   // eoX⁻¹
  line.trunk = { t0: K.t0, f: (t) => tl * eoX(clamp((t - K.t0) / (K.every - K.t0))), len: tl };
  trunk.n.forEach((k, i) => { reach[k] = K.t0 + (K.every - K.t0) * inv(trunk.cum[i] / tl); });
  const sparkSpeed = 5200;
  for (const Ln of L.slice(1)) {
    const st = (Ln.at ? K.spurs : reach[Ln.n[0]]) + .06, len = Ln.A.len, dur = clamp(len / sparkSpeed, .3, 1.05);
    const f = (t) => len * (1 - Math.pow(1 - clamp((t - st) / dur), 2.2));
    line[Ln.id] = { t0: st, f, len, dur };
    Ln.n.forEach((k, i) => { if (i === 0) return; const y = Ln.cum[i] / len; reach[k] = st + dur * (1 - Math.pow(1 - y, 1 / 2.2)); });
  }
  const townT = (T) => (T.node ? reach[T.node] : (line[T.line].t0 + line[T.line].dur * (1 - Math.pow(1 - T.s / line[T.line].len, 1 / 2.2)))) + .08;
  for (const T of TOWNS) T.tl = townT(T);
  return { reach, line, front: (id, t) => line[id].f(t), townLit: (T, t) => sio(clamp((t - T.tl) / .45)), distLit: (d, t) => (reach[d] != null ? sio(clamp((t - reach[d] - .05) / .45)) : 0) };
}
export const LINE_LIST = LINES;
// ---------------------------------------------------------------- painter items for everything out there
export function netItems(t, cam, S, NC) {
  const items = [], hz = hazeRGB(S.L), base = { L: S.L, hz };
  // the old aqueduct (lit: the light flows into A)
  for (const it of arcadeItems(t, cam, AQ, { ...base, lit: 1 })) items.push(it);
  items.push({ d: cs(cam, CASTELLUM[0], TOP, CASTELLUM[1])[2], draw: (ctx) => castellum(ctx, t, cam, S) });
  // the network, as far as the burin has drawn it: the stone unrolls down from the engraved line behind the front
  for (const Ln of LINES) {
    const f = NC.front(Ln.id, t); if (f <= .5) continue;
    const drop = (b) => clamp((f - b.s1) / 220 + .05) ** .8;
    for (const it of arcadeItems(t, cam, Ln.A, { ...base, lit: clamp((t - NC.line[Ln.id].t0 - .3) / .6), s1: f, drop })) items.push(it);
  }
  // the line to you: the far branch (from A's castellum back to its broken end), your stretch
  const fb = S.branch ?? 0;   // 0..1 how far the far branch is drawn (from the castellum toward the gap); its valley part is drawn by the scene
  if (fb > 0) { const sF = mix(BR.len, S_BREAK, fb); for (const it of arcadeItems(t, cam, BR, { ...base, lit: S.branchLit ?? 0, walk: true, s0: Math.max(sF, S_LAND), s1: BR.len, drop: (b) => clamp((b.s0 - sF) / 50 + .15) })) items.push(it); }
  // towns
  for (const T of TOWNS) { const c = cs(cam, T.x, plainY(T.x, T.z), T.z); if (c[2] < NEAR) continue; items.push({ d: c[2], draw: (ctx) => town(ctx, t, cam, S, T, NC.townLit(T, t), c) }); }
  return items;
}
// the castellum: a round water tower where the aqueduct ends, its lantern lit
function castellum(ctx, t, cam, S) {
  const [x, z] = CASTELLUM, y0 = plainY(x, z) - 2, y1 = TOP + 4, r = 8, L = S.L, hz = hazeRGB(L), c = cs(cam, x, (y0 + y1) / 2, z); if (c[2] < NEAR) return;
  const k = fogK(Math.hypot(c[0], c[2]), L), col = mix3(tri(['#272b5a', '#544a74', '#9a7c8e'], L), hz, k), n = 18;
  const ring = (yy, rr) => Array.from({ length: n }, (_, i) => [x + Math.cos(i / n * Math.PI * 2) * rr, yy, z + Math.sin(i / n * Math.PI * 2) * rr]);
  const lo = ring(y0, r), hi = ring(y1, r);
  for (let i = 0; i < n; i++) { const j = (i + 1) % n, mx = (lo[i][0] + lo[j][0]) / 2, mz = (lo[i][2] + lo[j][2]) / 2; if ((cam.x - mx) * (mx - x) + (cam.z - mz) * (mz - z) <= 0) continue; if (path3(ctx, cam, [hi[i], hi[j], lo[j], lo[i]])) { const sh = clamp(.5 - .5 * ((mx - x) / r)); ctx.fillStyle = css(mix3(col, [5, 6, 22], .4 * sh)); ctx.fill(); } }
  const cap = ring(y1, r + .9); if (path3(ctx, cam, cap)) { ctx.fillStyle = css(mix3(col, [255, 220, 200], .18)); ctx.fill(); }
  ctx.beginPath(); for (let i = 0; i < n; i++) { const j = (i + 1) % n; path3(ctx, cam, [cap[i], cap[j], [x, y1 + 7, z]], true); } ctx.fillStyle = css(mix3(col, [0, 0, 0], .25)); ctx.fill();
  const p = cs(cam, x, y1 - 5, z + r + .3); if (p[2] > NEAR) { const s = toScr(cam, p), q = cam.f / p[2]; shareLight(ctx, s[0], s[1], clamp(q * 1.6, 1.2, 16), t, { pulse: .5 }); }
}
// a town: gabled houses, a church with its spire, a tower, trees, windows; lit = the network reached it (warm windows, a glow)
const HOUSE = [['#11143a', '#2c2848', '#6a5262'], ['#141840', '#332c50', '#76586a']];
function town(ctx, t, cam, S, T, lit, c0) {
  const L = S.L, hz = hazeRGB(L), d = Math.hypot(c0[0], c0[2]), k = fogK(d, L), q0 = cam.f / c0[2], fl = S.flare ? S.flare(T.z) : 0;
  const s0 = toScr(cam, c0); if (s0[0] < -T.R * q0 * 1.4 - 30 || s0[0] > W + T.R * q0 * 1.4 + 30 || s0[1] < -60 || s0[1] > H + 60) return;
  const rim = tri(['#39407a', '#f4b49c', '#ffe4bc'], L), win = mix3(mixRGB('#ffcf8a', '#ffb35c', .6), [255, 240, 200], fl * .5);
  if (q0 * 10 < 1.4) {   // far: a cluster of specks
    ctx.fillStyle = css(mix3(tri(HOUSE[0], L), hz, k * .9)); ctx.beginPath(); for (const h of T.h) { const c = cs(cam, T.x + h.dx, plainY(T.x, T.z), T.z + h.dz); if (c[2] < NEAR) continue; const s = toScr(cam, c); ctx.rect(s[0] - 1, s[1] - 1.6, 2, 1.6); } ctx.fill();
  } else {
    const hs = T.h.map((h) => ({ h, c: cs(cam, T.x + h.dx, plainY(T.x + h.dx, T.z + h.dz) - .5, T.z + h.dz) })).filter((e) => e.c[2] > NEAR).sort((a, b) => b.c[2] - a.c[2]);
    for (const tr of T.trees) { const c = cs(cam, T.x + tr.dx, plainY(T.x, T.z), T.z + tr.dz); if (c[2] < NEAR) continue; const s = toScr(cam, c), q = cam.f / c[2]; ctx.fillStyle = css(mix3(tri(['#0d1430', '#24284a', '#4a4a52'], L), hz, k)); ctx.beginPath(); ctx.ellipse(s[0], s[1] - tr.s * q * .9, tr.s * q * .7, tr.s * q, 0, 0, Math.PI * 2); ctx.fill(); }
    for (const { h, c } of hs) {
      const s = toScr(cam, c), q = cam.f / c[2], w = h.w * q / 2, hh = h.hh * q, rr = h.r * q, kk = fogK(Math.hypot(c[0], c[2]), L);
      const body = mix3(tri(HOUSE[h.tone < .5 ? 0 : 1], L), hz, kk);
      ctx.fillStyle = css(body); ctx.beginPath();
      if (h.tower) { ctx.rect(s[0] - w * .6, s[1] - hh, w * 1.2, hh); }
      else { ctx.moveTo(s[0] - w, s[1]); ctx.lineTo(s[0] - w, s[1] - hh); ctx.lineTo(s[0], s[1] - hh - rr); ctx.lineTo(s[0] + w, s[1] - hh); ctx.lineTo(s[0] + w, s[1]); ctx.closePath(); }
      ctx.fill();
      if (h.spire) { ctx.beginPath(); ctx.moveTo(s[0] - w * .45, s[1] - hh - rr); ctx.lineTo(s[0], s[1] - hh - rr - h.spire * q); ctx.lineTo(s[0] + w * .45, s[1] - hh - rr); ctx.closePath(); ctx.fill(); }
      // the dawn rim on the roof line (the sun is ahead, slightly right)
      if (q * h.w > 3) { ctx.strokeStyle = css(rim, clamp(L * .6) * (1 - kk * .7)); ctx.lineWidth = clamp(q * .4, .6, 1.4); ctx.beginPath(); if (h.tower) { ctx.moveTo(s[0] - w * .6, s[1] - hh); ctx.lineTo(s[0] + w * .6, s[1] - hh); ctx.lineTo(s[0] + w * .6, s[1] - hh * .5); } else { ctx.moveTo(s[0], s[1] - hh - rr - (h.spire ? h.spire * q : 0)); ctx.lineTo(s[0] + w * (h.spire ? .45 : 1), s[1] - hh - (h.spire ? rr : 0)); } ctx.stroke(); }
      // windows: dark before, warm once the light has reached the town
      if (q * h.w > 4) {
        const n = h.tower ? 3 : 2, on = lit * (.55 + .45 * h.win);
        for (let i = 0; i < n; i++) { const wx = s[0] + (h.tower ? 0 : (i - (n - 1) / 2) * w * .9), wy = s[1] - hh * (h.tower ? .25 + i * .25 : .45), ws = clamp(q * 1.2, .8, 6);
          if (hash(T.seed + i * 7 + h.dx) < on) { ctx.fillStyle = css(win, .95 * (1 - kk * .4)); ctx.fillRect(wx - ws / 2, wy - ws * .7, ws, ws * 1.3); } }
      }
    }
  }
  // the town's glow once lit (its light seen through the haze)
  if (lit > .02) { const r = clamp(T.R * q0 * 1.1, 6, 170), g = ctx.createRadialGradient(s0[0], s0[1] - r * .15, 0, s0[0], s0[1] - r * .15, r); g.addColorStop(0, rgba('#ffcf8a', .34 * lit * (1 - k * .3))); g.addColorStop(.4, rgba('#ffb35c', .12 * lit)); g.addColorStop(1, 'rgba(255,179,92,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(s0[0] - r, s0[1] - r * 1.15, r * 2, r * 2); ctx.restore(); }
}
// ---------------------------------------------------------------- the lights flowing on the channels (drawn after all stone)
function dot(ctx, x, y, r, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, rgba('#fff1d6', a)); g.addColorStop(.3, rgba('#ffb35c', .6 * a)); g.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6); }
export function netLights(ctx, t, cam, S, NC) {
  const all = [];
  for (const p of flowLights(cam, AQ, { t, v: 60, gap: 120, dir: 1 })) all.push(p);
  for (const Ln of LINES) { const f = NC.front(Ln.id, t), t0 = NC.line[Ln.id].t0 + .35; if (t < t0 || f < 30) continue; const sf = Math.min(f, (t - t0) * 900); for (const p of flowLights(cam, Ln.A, { t, v: 60, gap: 130, dir: 1, s1: sf })) all.push(p); }
  // the far branch: the light flows from A toward the gap and waits at the broken end
  if ((S.branchLit ?? 0) > 0) { for (const p of flowLights(cam, BR, { t, v: 50, gap: 70, dir: -1, s0: S_BREAK + 14, s1: BR.len })) all.push(p); }
  all.sort((a, b) => b[3] - a[3]);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, r] of all) { if (r < 2.6) dot(ctx, x, y, Math.max(.8, r), .9); }
  ctx.restore();
  for (const [x, y, r] of all) if (r >= 2.6) shareLight(ctx, x, y, r, t, { pulse: .4 });
  // the lights gathered at the broken end, waiting
  if ((S.branchLit ?? 0) > 0) { const [x, z] = BR.at(S_BREAK + 10), c = cs(cam, x, TOP + .9, z); if (c[2] > NEAR) { const s = toScr(cam, c), r = clamp(cam.f / c[2] * 1.2, 1, 12); for (let i = 0; i < 3; i++) { const [x2, z2] = BR.at(S_BREAK + 10 + i * 7), c2 = cs(cam, x2, TOP + .9, z2); if (c2[2] > NEAR) { const s2 = toScr(cam, c2); shareLight(ctx, s2[0], s2[1], clamp(cam.f / c2[2] * 1.2, 1, 12) * S.branchLit, t + i * 1.3, { pulse: 1 }); } } void s; void r; } }
}
// ---------------------------------------------------------------- the next stretch: the dotted ghost across the gap, your engraved line
const DOT = (ctx, x, y, r, a) => { ctx.fillStyle = `rgba(243,236,220,${a})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
export function ghostStretch(ctx, t, cam, S, o) {
  const sk = clamp(o.sketch ?? 0); if (sk <= 0) return;
  const solid = clamp(o.solid ?? 0, 0, S_BREAK), sMin = mix(S_BREAK, 0, sk), y0 = TOP + .06;
  const P = (x, y, z) => { const c = cs(cam, x, y, z); return c[2] > NEAR ? [toScr(cam, c), cam.f / c[2]] : null; };
  // the missing bays' arches, dotted and faint (the ghost of the bridge's shape)
  ctx.save();
  for (const b of BR.bays) {
    if (b.s1 > S_BREAK + 1 || b.s0 < Math.max(sMin, solid) - 1) continue;
    // seen end-on (along the bridge) the arches collapse into vertical dots: they fade out unless the bridge is seen from the side
    const [bx, bz, bdx, bdz] = BR.at(b.sm), vx = bx - cam.x, vz = bz - cam.z, vl = Math.hypot(vx, vz) || 1, vis = clamp((Math.abs(vx * bdz - vz * bdx) / vl - .3) / .3);
    if (vis <= 0) continue;
    const sd = 1, arcs = [];
    const o0 = b.s0 + BR.pw / 2, o1 = b.s1 - BR.pw / 2, r = (o1 - o0) / 2, yc = BR.top - BR.up;
    if (b.gy < BR.midY - 14) { arcs.push([o0 + 1, o1 - 1, BR.midY - 1.6]); arcs.push([o0, o1, yc - 1.6]); } else arcs.push([o0, o1, yc - 2]);
    for (const [a0, a1, crown] of arcs) {
      const rr = (a1 - a0) / 2, ys = crown - rr, m = (a0 + a1) / 2, n = 40;
      for (let k = 0; k <= n; k++) { const an = Math.PI - k / n * Math.PI, s = m + Math.cos(an) * rr, [x, z] = BR.at(s), q = P(x, ys + Math.sin(an) * rr, z); if (!q) continue; if (k % 2) continue; DOT(ctx, q[0][0], q[0][1], clamp(q[1] * .07, .7, 2.4), .42 * sk * vis); }
    }
    // the cornice under the small arches
    for (let s = b.s0; s < b.s1; s += 2.4) { const [x, z] = BR.at(s), q = P(x, yc, z); if (q) DOT(ctx, q[0][0], q[0][1], clamp(q[1] * .06, .6, 2), .3 * sk * vis); }
  }
  // the two lips of the missing walk, dotted and fainter: the ghost reads as a stretch of bridge, not a wire
  for (const sd of [-1, 1]) {
    let s2 = S_BREAK - .4;
    while (s2 > Math.max(sMin, solid)) { const q = P(...side3(BR, s2, sd, TOP + .6)); if (!q) { s2 -= 1; continue; } DOT(ctx, q[0][0], q[0][1], clamp(q[1] * .04, .7, 2.4), .55); s2 -= clamp(13 / q[1], .14, 4); }
  }
  // the top line: dots at an even screen pitch, from the broken end toward you (as far as the burin has sketched), never over the solid
  let s = S_BREAK - .4;
  while (s > Math.max(sMin, solid)) {
    const [x, z] = BR.at(s), q = P(x, y0, z); if (!q) { s -= 1; continue; }
    const [p, qq] = q; DOT(ctx, p[0], p[1], clamp(qq * .055, .9, 3.4), .92);
    s -= clamp(11 / qq, .12, 4);
  }
  // your engraved line: solid gold from the parapet to the front, a soft glow, a spark at the front while it runs
  if (solid > .05) {
    const pts = []; for (let u = 0; u <= solid; u += Math.max(.2, solid / 120)) { const [x, z] = BR.at(u), q = P(x, y0, z); if (q) pts.push(q); }
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i < pts.length; i++) { const w = clamp(pts[i][1] * .1, 1.2, 7); ctx.strokeStyle = 'rgba(255,170,80,.22)'; ctx.lineWidth = w * 3.5; ctx.beginPath(); ctx.moveTo(pts[i - 1][0][0], pts[i - 1][0][1]); ctx.lineTo(pts[i][0][0], pts[i][0][1]); ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 1; i < pts.length; i++) { const w = clamp(pts[i][1] * .045, 1, 4); ctx.strokeStyle = '#ffe2b0'; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(pts[i - 1][0][0], pts[i - 1][0][1]); ctx.lineTo(pts[i][0][0], pts[i][0][1]); ctx.stroke(); }
    if (solid < S_YOURS - .5 && pts.length) { const [p, qq] = pts[pts.length - 1], R = clamp(qq * .6, 8, 40); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], R); g.addColorStop(0, 'rgba(255,246,226,.95)'); g.addColorStop(.3, 'rgba(255,190,110,.45)'); g.addColorStop(1, 'rgba(255,170,80,0)'); ctx.fillStyle = g; ctx.fillRect(p[0] - R, p[1] - R, 2 * R, 2 * R); }
  }
  ctx.restore();
}
// the burin at landscape scale (18.05–18.06): the tool in screen space, tip leading, a glint and foil dust where it draws
export function bigBurin(ctx, t, B) {
  const a = B.ang, len = B.len, hx = B.x - Math.cos(a - .28) * len, hy = B.y - Math.sin(a - .28) * len;
  ctx.save(); burinShape(ctx, [hx, hy], [B.x, B.y], len / 124); ctx.restore();
  const R = len * .22 * (B.draw ? 1 : .6), g = ctx.createRadialGradient(B.x, B.y, 0, B.x, B.y, R);
  g.addColorStop(0, 'rgba(255,246,226,.95)'); g.addColorStop(.25, 'rgba(255,190,110,.42)'); g.addColorStop(1, 'rgba(255,170,80,0)');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(B.x - R, B.y - R, 2 * R, 2 * R);
  if (B.draw) { const r = prng(91); for (let i = 0; i < 22; i++) { const life = (t * (.9 + r() * .8) + r()) % 1, sp = (r() - .5) * 1.4, d = len * .08 * (.4 + life * 3); ctx.fillStyle = `rgba(255,${200 + (r() * 40 | 0)},150,${(1 - life) * .7})`; const z = 1 + r() * 1.6; ctx.fillRect(B.x - Math.cos(a + sp) * d, B.y - Math.sin(a + sp) * d - life * 10, z, z); } }
  ctx.restore();
}
export { NODE, TOP, DIR };
