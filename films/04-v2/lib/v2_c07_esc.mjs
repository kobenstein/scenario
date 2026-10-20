// c07 · escalators, landing bridges, the riders and the hero ("you"), drawn in world space through any camera P = proj(C), so the hall
// (7.01–7.03) and the void after it (7.04–7.06, the camera circles the fragment) draw the same objects.
//   drawEsc(ctx, P, C, e, t, K, o)      one escalator: supports, far balustrade, moving steps, riders (+ hero on E0), cladding, glass,
//                                       handrail with its newel loops. o = { L (lit 0..1), dark (unlit = solid dark silhouette), sA (draw
//                                       only from s = sA up: the dissolve eats E0 from its foot), riders, hero, morning (0..1), st }
//   escStrip(ctx, P, C, e, t, K, a, o)  the lit strip under the near handrail: on its straight run exactly the c06>c07 plate's line
//   drawBridge(ctx, P, C, br, t, K, part, o)   a landing bridge (deck, lattice girder, railing, post clock): part 'back' | 'front'
//   drawHero(ctx, P, C, t, K, o)        the hero on E0: rides, steps off one step, stands bowed; the phone on "escaping" (7.03)
//   stepNose(e, s, t, K)                the nose of the moving step under s (riders stand on treads, not on the slope)
// Nothing fades in: a part that is not lit yet is a solid silhouette in the plate's dark ground (kit.solid / kit.bgAt).
import { W, H, rgba, clamp, mix, prng } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { figure, figureFlat, walk } from './figure.mjs';
import { TAU, sstep, cio, mixHex, pline, linePlateLine, glowAt, bgAt, solid, path2 } from './v2_c07_kit.mjs';
import { clockAt } from './v2_c07_clock.mjs';
import { T30, C30, RAILH, SKIRT, TRUSS, A, F, HW, STRIP, STEP, COL, E0, geo, runDist, HERO, heroPath, STEPOFF, riders, riderAt, fogC } from './v2_c07_world.mjs';

const lw = (q, m, min = .6) => Math.max(min, m * q);
const strokePts = (ctx, pts) => { ctx.beginPath(); pline(ctx, pts); ctx.stroke(); };
const visible = (pts) => pts.some((p) => p[0] > -200 && p[0] < W + 200 && p[1] > -200 && p[1] < H + 200);
export function stepNose(e, s, t, K) { const off = ((runDist(t, K) * e.mv) % STEP + STEP) % STEP; return s - ((((s - off) % STEP) + STEP) % STEP); }
// the colour of something lit to L at screen point p: its own (fogged) colour over the plate's dark ground
export const litCol = (hex, L, p) => (L >= .998 ? hex : mixHex(bgAt(p[0], p[1]), hex, clamp(L)));

// ---------------------------------------------------------------- one escalator
export function drawEsc(ctx, P, C, e, t, K, o = {}) {
  const g = geo(e), zN = e.z + HW, zF = e.z - HW, L = o.L ?? 1, dark = !!o.dark;
  if (L <= .002 && !dark) return;
  const sA = Math.max(g.s0, o.sA ?? g.s0), s1 = g.s1; if (s1 - sA < .3) return;
  const X = g.X, Y = g.Y, mid = P(X((sA + s1) / 2), Y((sA + s1) / 2), e.z); if (mid[2] < 1) return;
  const q = mid[3], depth = mid[2], fz = (c, k = 1) => fogC(c, depth, k);
  const n = Math.max(12, Math.min(140, Math.round((s1 - sA) / .45)));
  const ss = []; for (let i = 0; i <= n; i++) ss.push(sA + (s1 - sA) * i / n);
  const bot = (s) => Math.max(e.yb - (e.yb > 0 ? 1.4 : 0), Y(s) - TRUSS - (s > g.top - .5 || s < g.bot + .5 ? .45 : 0));
  const hi = o.hi || mixHex(COL.ironHi, COL.morning, o.morning ?? 0);
  // supports under the long ones
  if (e.R > 30) for (const f of [.36, .68]) {
    const s = g.run * f; if (s < sA) continue; const x = X(s), yt = Y(s) - TRUSS, pq = [P(x - .32, e.yb, e.z), P(x + .32, e.yb, e.z), P(x + .32, yt, e.z), P(x - .32, yt, e.z)];
    if (!visible(pq)) continue;
    solid(ctx, path2(pq), null, fz(COL.iron), L, t, dark);
    if (L > .002) { ctx.save(); ctx.globalAlpha = L; ctx.strokeStyle = rgba(fz(hi), .3); ctx.lineWidth = lw(q, .05); strokePts(ctx, [pq[0], pq[3]]); ctx.strokeStyle = rgba('#000000', .3); ctx.lineWidth = lw(q, .02, .5); ctx.beginPath(); for (let y = e.yb + .6; y < yt; y += .6) { const a = P(x - .32, y, e.z), b = P(x + .32, y + .3, e.z); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } ctx.stroke(); ctx.restore(); }
  }
  if (L > .002) {
    // far balustrade: glass and the far handrail
    const top = ss.map((s) => P(X(s), Y(s) + RAILH - .06, zF)), low = ss.map((s) => P(X(s), Y(s) + SKIRT, zF)).reverse();
    ctx.save(); ctx.globalAlpha = L; ctx.fillStyle = rgba(fz(COL.glass, .6), .07); ctx.beginPath(); pline(ctx, top.concat(low)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = fz('#07080f'); ctx.lineWidth = lw(q, .075, .7); ctx.lineCap = 'round'; strokePts(ctx, ss.map((s) => P(X(s), Y(s) + RAILH, zF)));
    ctx.restore();
    // the moving steps, seen through the glass from above: aluminium treads with grooves
    if (q > 28) {
      const off = ((runDist(t, K) * e.mv) % STEP + STEP) % STEP, tr = fz('#4b5572'), gr = rgba('#0b0e1a', .55);
      ctx.save(); ctx.globalAlpha = L;
      const ch = [ss.map((s) => P(X(s), Y(s) - .02, zF + .06)), ss.map((s) => P(X(s), Y(s) + SKIRT, zF + .06)).reverse()];
      ctx.fillStyle = fz('#0b0e1a'); ctx.beginPath(); pline(ctx, ch[0].concat(ch[1])); ctx.closePath(); ctx.fill();
      for (let sk = Math.ceil((Math.max(sA, g.bot - .4) - off) / STEP) * STEP + off; sk < Math.min(s1 - .3, g.top + .4); sk += STEP) {
        const y = Y(sk); if (C.y < y + .05) continue;
        const x0 = X(sk), x1 = X(sk + STEP * .96), qd = [P(x0, y, zF + .1), P(x1, y, zF + .1), P(x1, y, zN - .1), P(x0, y, zN - .1)];
        if (!visible(qd)) continue;
        ctx.fillStyle = tr; ctx.beginPath(); pline(ctx, qd); ctx.closePath(); ctx.fill();
        if (q > 60) { ctx.strokeStyle = gr; ctx.lineWidth = .7; ctx.beginPath(); for (let k = 1; k < 7; k++) { const z = mix(zF + .1, zN - .1, k / 7), a = P(x0, y, z), b = P(x1, y, z); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } ctx.stroke(); }
        ctx.strokeStyle = rgba(fz(hi), .5); ctx.lineWidth = lw(q, .015, .6); strokePts(ctx, [qd[0], qd[3]]);   // the nose catches the light
      }
      ctx.restore();
    }
  }
  if (o.mid) o.mid();
  // near side: the truss cladding (solid), engraved
  const topN = ss.map((s) => P(X(s), Y(s) + SKIRT, zN)), btN = ss.map((s) => P(X(s), bot(s), zN));
  const clad = path2(topN.concat(btN.slice().reverse()));
  solid(ctx, clad, null, fz(COL.clad), L, t, dark);
  if (L > .002) {
    ctx.save(); ctx.globalAlpha = L; ctx.clip(clad);
    const hs = Math.max(.1, 4.6 / q);
    ctx.strokeStyle = rgba('#000000', .34); ctx.lineWidth = Math.max(.6, .018 * q); ctx.beginPath();
    for (let s = sA; s < s1 + .8; s += hs) { const a = P(X(s), Y(s) + SKIRT + .1, zN), b = P(X(s) + e.d * 1.1, bot(s) - .4, zN); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    ctx.stroke();
    // panel joints and rivets
    ctx.strokeStyle = rgba(fz(hi), .2); ctx.lineWidth = lw(q, .02, .6); ctx.beginPath();
    for (let s = Math.ceil(sA / 2.4) * 2.4; s < s1; s += 2.4) { const a = P(X(s), Y(s) + SKIRT, zN), b = P(X(s), bot(s), zN); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    ctx.stroke();
    // lower edge in shadow, upper band in light
    ctx.strokeStyle = rgba('#000000', .5); ctx.lineWidth = lw(q, .12, 1); strokePts(ctx, btN);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = L; ctx.lineCap = 'round';
    ctx.strokeStyle = rgba(fz(hi), .55); ctx.lineWidth = lw(q, .025, .7); strokePts(ctx, topN);
    ctx.strokeStyle = rgba(fz(hi), .16); ctx.lineWidth = lw(q, .015, .5); strokePts(ctx, ss.map((s) => P(X(s), Y(s) + SKIRT - .16, zN)));
    if (q > 50) { ctx.fillStyle = rgba(fz(hi), .35); for (let s = Math.ceil(sA / .6) * .6; s < s1; s += .6) { const p = P(X(s), Y(s) + SKIRT - .08, zN); ctx.fillRect(p[0] - .8, p[1] - .8, 1.6, 1.6); } }
    ctx.restore();
    // near glass with panel joints and a few reflections, then the handrail with its newel loops
    const ends = [sA <= g.s0 + .01, true];
    const glass = glassOutline(P, e, g, sA, s1, zN, ends);
    ctx.save(); ctx.globalAlpha = L; ctx.fillStyle = rgba(fz(COL.glass, .6), .1); ctx.beginPath(); pline(ctx, glass); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(fz('#cfe0ff', .6), .2); ctx.lineWidth = lw(q, .012, .5); ctx.beginPath();
    for (let s = Math.ceil(sA / 1.6) * 1.6 + .8; s < s1 - .3; s += 1.6) { const a = P(X(s), Y(s) + SKIRT, zN), b = P(X(s), Y(s) + RAILH - .06, zN); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    ctx.stroke();
    if (q > 20) { ctx.strokeStyle = rgba('#e6efff', .07); ctx.lineWidth = lw(q, .05, .8); ctx.beginPath(); for (let s = Math.ceil(sA / 1.6) * 1.6 + .2; s < s1 - .5; s += 1.6) { const a = P(X(s), Y(s) + SKIRT + .2, zN), b = P(X(s + .5), Y(s + .5) + RAILH - .2, zN); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } ctx.stroke(); }
    const rail = railPath(P, e, g, sA, s1, zN, ends);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#06070d'; ctx.lineWidth = lw(q, .085, 1.1); strokePts(ctx, rail);
    ctx.strokeStyle = rgba(fz(hi), .5); ctx.lineWidth = lw(q, .02, .6); strokePts(ctx, ss.map((s) => P(X(s), Y(s) + RAILH + .03, zN)));
    ctx.restore();
  }
}
// glass panel outline (with the rounded newel ends) and the handrail path (straight run + the loops round the newels)
function glassOutline(P, e, g, sA, s1, zN, ends) {
  const X = g.X, Y = g.Y, out = [], r = .36, yT = RAILH - .06;
  for (let i = 0; i <= 40; i++) { const s = mix(sA, s1, i / 40); out.push(P(X(s), Y(s) + yT, zN)); }
  if (ends[1]) { const cx = X(s1), cy = Y(s1) + yT - r; for (let i = 1; i <= 8; i++) { const a = Math.PI / 2 - i / 8 * Math.PI / 2; out.push(P(cx + e.d * r * Math.cos(a), cy + r * Math.sin(a), zN)); } out.push(P(cx + e.d * r, Y(s1) + SKIRT, zN)); }
  for (let i = 40; i >= 0; i--) { const s = mix(sA, s1, i / 40); out.push(P(X(s), Y(s) + SKIRT, zN)); }
  if (ends[0]) { const cx = X(sA), cy = Y(sA) + yT - r; out.push(P(cx - e.d * r, Y(sA) + SKIRT, zN)); for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI / 2; out.push(P(cx - e.d * r * Math.cos(a), cy + r * Math.sin(a), zN)); } }
  return out;
}
function railPath(P, e, g, sA, s1, zN, ends) {
  const X = g.X, Y = g.Y, out = [], r = .42;
  if (ends[0]) { const cx = X(sA), cy = Y(sA) + RAILH - r; out.push(P(cx + e.d * .3, cy - r, zN)); for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 - i / 12 * Math.PI; out.push(P(cx + e.d * r * Math.cos(a), cy + r * Math.sin(a), zN)); } }
  for (let i = 0; i <= 60; i++) { const s = mix(sA, s1, i / 60); out.push(P(X(s), Y(s) + RAILH, zN)); }
  if (ends[1]) { const cx = X(s1), cy = Y(s1) + RAILH - r; for (let i = 1; i <= 12; i++) { const a = Math.PI / 2 - i / 12 * Math.PI; out.push(P(cx + e.d * r * Math.cos(a), cy + r * Math.sin(a), zN)); } out.push(P(cx - e.d * .3, cy - r, zN)); }
  return out;
}

// ---------------------------------------------------------------- the lit strip under the near handrail (light pass)
// on the straight run it is drawn exactly like the plate line (linePlateLine, ticks sliding with the steps); the bends as polylines
export function escStrip(ctx, P, C, e, t, K, a, o = {}) {
  if (a <= 0) return;
  const g = geo(e), zN = e.z + HW; if (C.z - zN < .8) return;
  const sA = Math.max(g.s0 + .3, o.sA ?? -1e9);
  const pa0 = P(g.X(A + .02), g.Y(A + .02) + STRIP, zN), pb = P(g.X(g.run - A - .02), g.Y(g.run - A - .02) + STRIP, zN);
  const q = pa0[3], k = q / (F / 17), shift = runDist(t, K) / C30 * e.mv * q;
  const ang = Math.atan2(pb[1] - pa0[1], pb[0] - pa0[0]), len = Math.hypot(pb[0] - pa0[0], pb[1] - pa0[1]);
  const pm = [(pa0[0] + pb[0]) / 2, (pa0[1] + pb[1]) / 2];
  let x0 = -len / 2; if (sA > A + .02) { const pc = P(g.X(sA), g.Y(sA) + STRIP, zN); x0 = Math.max(x0, (pc[0] - pm[0]) * Math.cos(ang) + (pc[1] - pm[1]) * Math.sin(ang)); }
  ctx.save(); ctx.globalAlpha = a;
  if (x0 < len / 2) linePlateLine(ctx, t, { cx: pm[0], cy: pm[1], ang, L: 1400, x0, x1: len / 2, k: Math.min(1, k), ks: k, shift, glow: o.glow ?? 1, tick: clamp((k * 9 - 3) / 4) });
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [s0, s1] of [[g.s0 + .3, A + .02], [g.run - A - .02, g.s1 - .3]]) {
    const u0 = Math.max(s0, sA); if (s1 <= u0) continue;
    const pts = []; for (let i = 0; i <= 16; i++) { const s = mix(u0, s1, i / 16); pts.push(P(g.X(s), g.Y(s) + STRIP, zN)); }
    for (const [w, al] of [[10 * Math.min(1, k), .14], [Math.max(1.4, 3.2 * Math.min(1, k)), .5], [Math.max(.9, 1.4 * Math.min(1, k)), .9]]) { ctx.strokeStyle = rgba(al > .6 ? '#fffaf0' : '#e9dcc0', al); ctx.lineWidth = w; ctx.beginPath(); pline(ctx, pts); ctx.stroke(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- riders
export function drawRiders(ctx, P, C, e, t, K, o = {}) {
  const g = geo(e), L = o.L ?? 1, dark = !!o.dark; if (L <= .002 && !dark) return;
  const pc = P(g.X(g.run / 2), g.Y(g.run / 2), e.z); if (pc[2] < 1) return;
  const faceRight = e.d * e.mv > 0, mo = o.morning ?? 0;
  for (const rd of riders(e)) {
    const R = riderAt(rd, e, t, K);
    if (R.s < g.s0 - 16 || R.s > g.s1 + 22) continue;
    if (o.sA != null && R.s < o.sA) continue;
    const onFlat = R.s < g.bot || R.s > g.top, y = onFlat ? (R.s < g.bot ? e.yb : e.yb + e.R) : e.yb + g.yN(stepNose(e, R.s, t, K));
    const z = e.z + (rd.dz || 0), p = P(g.X(R.s), y + .87, z); if (p[2] < 1.5) continue;
    const s = p[3] * 1.75 / 185; if (s < .018) continue;
    if (p[0] < -80 || p[0] > W + 80 || p[1] < -60 || p[1] > H + 260) continue;
    const pose = R.mode === 'walk' ? { ...walk(R.ph), coat: rd.coat, hair: rd.hair, bulk: rd.bulk } : { sh: [rd.arm, .1], el: [.36, .3], coat: rd.coat, hair: rd.hair, bulk: rd.bulk, head: .06 };
    const flip = R.mode === 'ride' ? !faceRight : (e.mv > 0 ? e.d < 0 : e.d > 0);
    const near = clamp((g.X(R.s) - 20) / 12) * mo;   // the riders reaching the top catch the morning
    const col = litCol(fogC(rd.col, p[2]), L, p);
    const rimC = mixHex(COL.rim, COL.morning, near), rim = s > .06 && L > .3 ? rgba(fogC(rimC, p[2], .5), (.5 + .3 * near) * L) : null;
    ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(C.roll || 0);
    figureFlat(ctx, 0, 0, s, pose, { fast: true, col, rim, rimSide: 1, flip, t, seed: rd.seed, shadow: false });
    ctx.restore();
  }
}

// ---------------------------------------------------------------- landing bridges
// br = { x0, x1, y, z0, z1, deep, railFrom, clock: x | null }; part 'back' (deck or its underside) before the riders, 'front' after
export function drawBridge(ctx, P, C, br, t, K, part, o = {}) {
  const L = o.L ?? 1, dark = !!o.dark; if (L <= .002 && !dark) return;
  const { x0, x1, y, z0, z1 } = br, deep = br.deep ?? 1.25;
  const f = [P(x0, y, z1), P(x1, y, z1), P(x1, y - deep, z1), P(x0, y - deep, z1)]; if (f.some((p) => p[2] < .5)) return;
  const q = (f[0][3] + f[1][3]) / 2, depth = (f[0][2] + f[1][2]) / 2, fz = (c, k = 1) => fogC(c, depth, k), hi = o.hi || mixHex(COL.ironHi, COL.morning, o.morning ?? 0);
  if (part === 'back') {
    if (C.y > y) {
      const tp = [P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)];
      solid(ctx, path2(tp), null, fz('#252e4c'), L, t, dark);
      if (L > .002) {
        ctx.save(); ctx.globalAlpha = L; ctx.strokeStyle = rgba('#05070f', .45); ctx.lineWidth = lw(q, .015, .6); ctx.beginPath();
        for (let x = x0 + .6; x < x1; x += .6) { const a = P(x, y, z0), b = P(x, y, z1); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
        ctx.stroke(); ctx.strokeStyle = rgba(fz(hi), .22); ctx.beginPath(); for (const z of [z0 + .3, z1 - .3]) { const a = P(x0, y, z), b = P(x1, y, z); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } ctx.stroke();
        ctx.restore();
      }
    } else if (C.y < y - deep) solid(ctx, path2([P(x0, y - deep, z0), P(x1, y - deep, z0), P(x1, y - deep, z1), P(x0, y - deep, z1)]), null, fz('#0d1326'), L, t, dark);
    // the post clock stands on the deck, behind the railing
    if (br.clock != null && L > .002) {
      const cx = br.clock, zc = z1 - .35, b0 = P(cx, y, zc), b1 = P(cx, y + 3.1, zc);
      ctx.save(); ctx.globalAlpha = L; ctx.strokeStyle = fz('#0b0e1a'); ctx.lineCap = 'butt'; ctx.lineWidth = lw(b0[3], .12, 1); strokePts(ctx, [b0, b1]);
      ctx.strokeStyle = rgba(fz(hi), .35); ctx.lineWidth = lw(b0[3], .025, .6); const b2 = P(cx + .05, y, zc), b3 = P(cx + .05, y + 3.1, zc); strokePts(ctx, [b2, b3]);
      ctx.restore();
      const r = clockAt(ctx, C, cx, y + 3.58, zc, .5, t, K, { L, dark });
      if (r && o.st) o.st.clocks.push([cx, y + 3.58, zc, .5, L, false]);
    }
    return;
  }
  // front: lattice girder (chords, posts, crossed diagonals, rivets) and the railing above it
  const at = (x, yy) => P(x, yy, z1), bar = (xa, ya, xb, yb, w) => { const a = at(xa, ya), b = at(xb, yb); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); };
  const gx0 = Math.max(x0, br.girderFrom ?? x0); if (x1 - gx0 < .2) return;
  const chordT = path2([at(gx0, y), at(x1, y), at(x1, y - .24), at(gx0, y - .24)]), chordB = path2([at(gx0, y - deep + .22), at(x1, y - deep + .22), at(x1, y - deep), at(gx0, y - deep)]);
  solid(ctx, chordT, null, fz(COL.iron), L, t, dark); solid(ctx, chordB, null, fz(COL.iron), L, t, dark);
  const cm = at((gx0 + x1) / 2, y - deep / 2), ironC = litCol(fz(COL.iron), L, cm);
  const panel = 1.25, n = Math.max(1, Math.round((x1 - gx0) / panel)), pw = (x1 - gx0) / n, r0 = br.railFrom ?? x0, r1 = br.railTo ?? x1;
  ctx.save(); ctx.lineCap = 'butt';
  ctx.strokeStyle = ironC; ctx.lineWidth = lw(q, .12, 1); ctx.beginPath();
  for (let i = 0; i <= n; i++) bar(gx0 + i * pw, y - .24, gx0 + i * pw, y - deep + .22);
  for (let i = 0; i < n; i++) { const xa = gx0 + i * pw, xb = xa + pw; bar(xa, y - .24, xb, y - deep + .22); bar(xb, y - .24, xa, y - deep + .22); }
  ctx.stroke();
  // railing: balusters, posts, rails
  if (!br.noRail) {
    ctx.lineWidth = lw(q, .022, .6); ctx.beginPath(); for (let x = r0 + .08; x < r1; x += .16) bar(x, y + .12, x, y + 1.0); ctx.stroke();
    ctx.lineWidth = lw(q, .08, .9); ctx.beginPath(); for (let x = r0; x <= r1 + .01; x += 2.5) bar(x, y, x, y + 1.08); bar(r0, y + 1.04, r1, y + 1.04); bar(r0, y + .12, r1, y + .12); ctx.stroke();
  }
  if (L > .002) {
    ctx.globalAlpha = L;
    ctx.strokeStyle = rgba(fz(hi), .5); ctx.lineWidth = lw(q, .022, .6); ctx.beginPath(); bar(gx0, y - .01, x1, y - .01); bar(gx0, y - deep + .21, x1, y - deep + .21); for (let i = 0; i <= n; i++) bar(gx0 + i * pw - .05, y - .24, gx0 + i * pw - .05, y - deep + .22); ctx.stroke();
    if (q > 45) { ctx.fillStyle = rgba(fz(hi), .45); for (let x = gx0 + .15; x < x1; x += .3) for (const yy of [y - .12, y - deep + .11]) { const p = at(x, yy); ctx.fillRect(p[0] - .9, p[1] - .9, 1.8, 1.8); } }
    if (!br.noRail) { ctx.strokeStyle = rgba(fz(hi), .45); ctx.lineWidth = lw(q, .018, .5); ctx.beginPath(); bar(r0, y + 1.075, r1, y + 1.075); ctx.stroke(); }
  }
  ctx.restore();
  if (o.st && o.st.ghostLines) o.st.ghostLines.push({ z: z1, lines: [[at(x0, y), at(x1, y)], [at(x0, y - deep), at(x1, y - deep)], [at(br.railFrom ?? x0, y + 1.04), at(x1, y + 1.04)]] });
}

// ---------------------------------------------------------------- the hero
const lerpPose = (a, b, k) => {
  const o = { ...a, ...b }, m = (x, y) => mix(x ?? 0, y ?? 0, k), m2 = (x, y) => [m(x?.[0], y?.[0]), m(x?.[1], y?.[1])];
  for (const key of ['sh', 'el', 'hip', 'kn', 'ft']) if (a[key] || b[key]) o[key] = m2(a[key] || [0, 0], b[key] || [0, 0]);
  for (const key of ['lean', 'head', 'dy']) o[key] = m(a[key], b[key]);
  if (k < 1) { if (a._walk) o._walk = true; } else delete o._walk;
  for (const key of Object.keys(o)) if (o[key] === undefined) delete o[key];
  return o;
};
export { lerpPose };
// the hero's pose at t (7.01–7.03): riding, the one step, standing with bowed shoulders, the phone coming up on "escaping"
export function heroPose(t, K) {
  const h = heroPath(t, K), ride = { sh: [.3, .1], el: [.36, .3], head: .12 };
  let pose = ride;
  if (!h.carried && h.step > 0) {
    const u = h.step, w = walk(.35 + u * Math.PI), k = sstep(0, .22, u) * (1 - sstep(.7, 1, u));
    pose = lerpPose(ride, w, k);
  }
  const bow = sstep(K.top + .35, K.stop + .5, t), bowed = { sh: [.16, .06], el: [.24, .2], head: .38, lean: .09 };
  pose = lerpPose(pose, { ...bowed, ...(pose.hip ? { hip: pose.hip, kn: pose.kn } : {}), ...(pose.ft ? { ft: pose.ft } : {}), dy: pose.dy || 0 }, bow * (h.carried ? .4 : 1));
  const ph = K.phone0 ? cio(clamp((t - K.phone0) / .75)) : 0;
  if (ph > 0) pose = lerpPose(pose, { sh: [.66, .52], el: [1.16, 1.22], head: .46, lean: .1 }, ph);
  return { ...pose, coat: 1, hair: 'short', phone: ph };
}
export function drawHero(ctx, P, C, t, K, o = {}) {
  const h = heroPath(t, K), g = geo(E0);
  const fy = h.carried ? E0.yb + g.yN(stepNose(E0, h.s, t, K)) : E0.yb + E0.R;
  const hp = o.hip || [h.x, fy + .87, E0.z], p = P(hp[0], hp[1], hp[2]); if (p[2] < .8) return null;
  const s = p[3] * 1.75 / 185, pose = o.pose || heroPose(t, K), L = o.L ?? 1, lit = o.lit ?? L;
  const mo = o.morning ?? 0, cy = o.cyan ?? 0;
  // the dress: dark until lit (rises out of the dark as one figure), then darkens again as the hall goes (lit only by the phone)
  const base = bgAt(p[0], p[1]), dress = {};
  for (const [k, v] of Object.entries(HERO.dress)) dress[k] = mixHex(base, mixHex(v, '#0d1024', .55 * (1 - lit)), clamp(L));
  const rimC = o.rimC || mixHex(COL.rim, COL.morning, mo), rimA = o.rimA ?? lit * (.45 + .45 * mo);
  ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(C.roll || 0);
  const light = o.light !== undefined ? (typeof o.light === 'function' ? o.light(s) : o.light) : cy > .01 ? { x: 90 * s, y: -50 * s, col: COL.cyan, a: .32 * cy } : mo > .05 ? { x: 600, y: -500, col: COL.morning, a: .35 * mo * lit } : null;
  const fr = figure(ctx, (o.dxU ?? 0) * s, 0, s, pose, { t, seed: HERO.seed, dress, accent: mixHex(base, mixHex(HERO.scarf, '#2a1c14', .5 * (1 - lit)), clamp(L)), accentPart: 'scarf', rim: rimA > .05 ? rgba(rimC, Math.min(1, rimA)) : null, rimSide: o.rimSide ?? 1, light, shadow: false, hatch: s > .6 });
  ctx.restore();
  // the phone: a thin dark slab in the front hand, its screen light on the face and hands
  const cr = Math.cos(C.roll || 0), sr = Math.sin(C.roll || 0), toS = (v) => [p[0] + v[0] * cr - v[1] * sr, p[1] + v[0] * sr + v[1] * cr];
  const hand = fr && fr.hand ? toS(fr.hand(0)) : null, head = fr && fr.head ? toS(fr.head) : null;
  if (hand && pose.phone > .3 && cy > .01) {
    const ph = s * 16;
    ctx.save(); ctx.translate(hand[0] + 1.5 * s, hand[1] - 5 * s); ctx.rotate((pose.phoneAng ?? -.5) + (C.roll || 0));
    ctx.fillStyle = '#0b0d16'; ctx.beginPath(); ctx.roundRect(-ph * .09, -ph / 2, ph * .18, ph, ph * .05); ctx.fill();
    ctx.fillStyle = rgba('#d8fbff', .9 * cy); ctx.fillRect(-ph * .09 - Math.max(1, ph * .04), -ph * .44, Math.max(1, ph * .05), ph * .88);
    ctx.restore();
    glowAt(ctx, hand[0] - 4 * s, hand[1] - 14 * s, 95 * s, COL.cyan, .26 * cy, '#e0fdff');
    if (head) glowAt(ctx, head[0] + 8 * s, head[1] + 8 * s, 34 * s, COL.cyan, .12 * cy);
  }
  return { x: p[0], y: p[1], s, pose, hand, head, feet: P(h.x, fy, E0.z) };
}
