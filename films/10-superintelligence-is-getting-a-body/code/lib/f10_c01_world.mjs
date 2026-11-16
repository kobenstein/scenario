// Film 10 · B1 world module for c01 (Editorial-Nacht): the valley take (1.07–1.17) and the hall (1.18–1.21). Reused in c02/c03.
//   VALLEY  the valley as a map of light (card Z 3600): main road, the fork (hall left, home right), the 13,000 block,
//           the flood to the horizon (~1 billion), the light edge, the loupe (2 billion hands), the warm wave (learning from ours)
//   TL      the road map of the film (card Z 2400): a line of light 0 → 11 MIN with three marks (COMING? · COST · LIFE)
//   HALL    the K3 hall: tall window in a dark wall, the robot in its light, you (headset, cup); the copied move as an arc
// Everything is drawn in design px of its card (home camera: design = screen). Built on lib/f10_editorial.mjs (never changed).
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as D from './f10_c01_draw.mjs';
const { W, H, P, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, halo, prng, cam3, cardM, card, F0 } = E;

// ===================================================================================================== sky · sun · ridges
export function sky(ctx, t, glow = 0) {
  E.nightSky(ctx, [[0, P.night0], [.55, P.night1], [1, P.ind1]], -260, 560);
  if (glow > 0) {   // the afterglow where the sun went down (a warm band over the ridge line, it fades with the night)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(1120, 430); ctx.scale(1, .32);
    ctx.fillStyle = rad(ctx, 0, 0, 1100, [[0, rgba(P.halo0, .42 * glow)], [.4, rgba(P.halo1, .16 * glow)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 1100, 0, 6.29); ctx.fill(); ctx.restore();
  }
  ctx.fillStyle = rad(ctx, 1080, 470, 1350, [[0, rgba(P.blue0, .95)], [.35, rgba(P.blue0, .5)], [.7, rgba(P.ind1, .2)], [1, rgba(P.ind0, 0)]]);
  ctx.fillRect(-W, -H, 3 * W, 3 * H);
  E.stars(ctx, 21, 230, t, [-500, -360, W + 1000, 720], .85);
}
// the setting sun (the hero light of 1.07): a big disc of light, quiet dust, a warm glow over the ridge line
export function sun(ctx, t, x, y, r, a = 1) {
  if (a <= 0) return;
  halo(ctx, x, y, r * 3.4, .32 * a, P.halo1, P.halo2);
  E.lightForm(ctx, 'disc', x - r, y - r, 2 * r, 2 * r, t, { a, breath: .012, dust: 2600, seed: 91 });
}
export function ridges(ctx) {
  const L = -900, R = 2900, B = 1600;
  ctx.beginPath(); ctx.moveTo(L, 404); ctx.bezierCurveTo(-200, 340, 300, 318, 700, 362); ctx.bezierCurveTo(950, 392, 1150, 322, 1460, 330);
  ctx.bezierCurveTo(1760, 338, 2050, 384, R, 352); ctx.lineTo(R, B); ctx.lineTo(L, B); ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, 320, 0, 470, [[0, P.ind1], [1, P.ind0]]); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 2.2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(L, 430); ctx.bezierCurveTo(-100, 392, 420, 388, 760, 410); ctx.bezierCurveTo(1000, 428, 1320, 400, 1560, 414);
  ctx.bezierCurveTo(1860, 430, 2200, 404, R, 418); ctx.lineTo(R, B); ctx.lineTo(L, B); ctx.closePath();
  ctx.fillStyle = lin(ctx, 0, 400, 0, 480, [[0, P.ind2], [1, P.ind0]]); ctx.fill(); ctx.strokeStyle = rgba(P.blue1, .85); ctx.lineWidth = 1.6; ctx.stroke();
}

// ===================================================================================================== the ledge (F0): your hill
// warm 0..1: the crest catches the setting sun (1.07), later it is a cool night rim
const LEDGE = (() => { const top = [[-600, 660], [-150, 662], [200, 670], [410, 686], [528, 690], [612, 701], [700, 742], [800, 826], [890, 980], [975, 1240], [1010, 1600]]; return E.catmull(top.map((p) => [...p, 0]), 10); })();
export function ledge(ctx, warm = 0) {
  const p = new Path2D(); p.moveTo(LEDGE[0][0], LEDGE[0][1]); for (const q of LEDGE.slice(1)) p.lineTo(q[0], q[1]);
  const body = new Path2D(p); body.lineTo(-600, 1600); body.closePath();
  ctx.fillStyle = lin(ctx, 0, 660, 0, 1100, [[0, P.night1], [.4, mixHex(P.night1, P.night0, .5)], [1, P.night0]]); ctx.fill(body);
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = lin(ctx, 0, 0, 1000, 0, [[0, rgba(P.blue0, .8)], [.5, rgba(mixHex(P.blue0, P.halo1, warm * .8), .95)], [1, rgba(mixHex(P.blue0, P.halo0, warm), 1)]]);
  ctx.lineWidth = 3; ctx.stroke(p);
  if (warm > .02) { ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(6px)'; ctx.globalAlpha = .45 * warm; ctx.strokeStyle = P.halo0; ctx.lineWidth = 7; ctx.stroke(p); }
  ctx.restore();
}

// ===================================================================================================== VALLEY (card Z 3600)
// a ground plane seen from the ledge: horizon HOR, focal FOC, eye height CAMH (design px). gp: ground (X, Z) → design point.
const HOR = 452, FOC = 1000, CAMH = 330;
const gp = (X, Z) => [W / 2 + X * FOC / Z, HOR + CAMH * FOC / Z];
const gi = (x, y) => { const Z = CAMH * FOC / Math.max(1, y - HOR); return [(x - W / 2) * Z / FOC, Z]; };
export const VALLEY = {
  Z: 3600, HOR,
  road: [[1100, 1000], [985, 862], [1036, 742], [962, 642], [1010, 560]],
  fork: [1010, 560], hall: [800, 522], home: [1252, 510],
  cluster: [1030, 738],
  toHorizon: [[880, 664], [700, 566], [560, 494], [520, 462]],
  loupe: [1452, 792],
  gp, gi,
};
const WALK = (() => { const pts = [VALLEY.hall, [900, 540], VALLEY.fork, [962, 642], VALLEY.cluster]; return E.catmull(pts.map((p) => [...p, 0]), 10); })();
const plen = (pts) => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; };
const WALKL = plen(WALK);
function along(pts, L, f) {
  const d = clamp(f) * L[L.length - 1]; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const k = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)];
}
export const FIELD = (() => {
  const r = prng(4242), [Xc, Zc] = gi(...VALLEY.cluster);
  const block = [];
  for (let i = 0; i < 20; i++) for (let j = 0; j < 10; j++) {
    const [x, y] = gp(Xc + (i - 9.5) * 11 + (r() - .5) * 3, Zc + (j - 5) * 34 + (r() - .5) * 8);
    block.push({ x, y, s: 3, ph: r() * 6.3, wd: 0, ord: (j * 20 + i) / 200 + r() * .04 });
  }
  const pts = [];
  const towns = [];
  for (let i = 0; i < 150; i++) { const Z = 600 * Math.pow(26, Math.pow(r(), .8)), sx = -240 + r() * (W + 480); towns.push({ X: (sx - W / 2) * Z / FOC, Z, n: 16 + Math.floor(r() * r() * 150) }); }
  for (const tw of towns) {
    const sig = (34 + Math.sqrt(tw.n) * 9) * Math.pow(tw.Z / 1200, .55);
    for (let i = 0; i < tw.n; i++) { let u = 0, v = 0; for (let k = 0; k < 3; k++) { u += r() - .5; v += r() - .5; } pts.push([tw.X + u * sig * 2.2, Math.max(560, tw.Z + v * sig * 1.4)]); }
  }
  for (let i = 0; i < 3400; i++) { const y = HOR + 5 + (H + 140 - HOR) * Math.pow(r(), 1.7), x = -260 + r() * (W + 520); pts.push(gi(x, y)); }
  const out = pts.map(([X, Z]) => { const [x, y] = gp(X, Z); return { x, y, s: clamp(3.6 * 800 / Z, 1.3, 3.8), ph: r() * 6.3, d: Math.hypot(X - Xc, (Z - Zc) * .6) }; })
    .filter((p) => p.y > HOR + 3 && p.x > -300 && p.x < W + 300);
  out.sort((a, b) => a.d - b.d);
  out.forEach((p, i) => { p.fd = Math.pow(i / out.length, .78); p.wd = Math.pow(i / out.length, .7) + r() * .03; });
  // the loupe opens out of one real dot
  let best = out[0]; for (const p of out) if (Math.hypot(p.x - VALLEY.loupe[0], p.y - VALLEY.loupe[1]) < Math.hypot(best.x - VALLEY.loupe[0], best.y - VALLEY.loupe[1])) best = p;
  VALLEY.loupe = [best.x, best.y]; best.loupe = true;
  return { block, pts: out, Xc, Zc };
})();

// valley(ctx, t, s, k, a): s = state from sc01 (trace, group, flood, edge, loupe, wave …), k = card scale, a = word anchors
export function valley(ctx, t, s, k, a) {
  const V = VALLEY, zs = Math.pow(k, .75);
  // the floor
  ctx.fillStyle = lin(ctx, 0, HOR, 0, 1250, [[0, P.ind2], [.2, P.ind0], [1, P.night1]]); ctx.fillRect(-900, HOR, W + 1800, 1500);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, HOR - 2, 0, HOR + 70, [[0, rgba(P.blue0, .55)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-900, HOR - 2, W + 1800, 72); ctx.restore();
  terrain(ctx);
  // the main road (cool, tapered) and the two branches at the fork
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.blue1, .7);
  const rd = E.catmull(V.road.map((p) => [...p, 0]), 10);
  for (let i = 1; i < rd.length; i++) { ctx.lineWidth = lerp(7, 2.2, i / rd.length); ctx.beginPath(); ctx.moveTo(rd[i - 1][0], rd[i - 1][1]); ctx.lineTo(rd[i][0], rd[i][1]); ctx.stroke(); }
  ctx.restore();
  const fk = sineIO(span(t, a.andWho + .1, a.working - .2));
  if (fk > 0) {
    for (const [tg, mid] of [[V.hall, [905, 534]], [V.home, [1130, 528]]]) E.trail(ctx, E.catmull([[...V.fork, 2.2], [...mid, 1.8], [tg[0], tg[1] + 8, 1.6]], 8), fk, { spark: false, a: .55 });
    const ki = expoOut(span(t, a.andWho + .5, a.working + .2)), hallLit = smooth(span(t, a.lastYear - .2, a.lastYear + .6));
    if (ki > 0) {
      E.icon(ctx, 'factory', V.hall[0], V.hall[1] - 30, 92 * ki, t, { lit: 0, dust: 0, seed: 41, glow: .35 });
      E.icon(ctx, 'house', V.home[0], V.home[1] - 28, 84 * ki, t, { lit: 0, dust: 0, seed: 42, glow: .35 });
      if (hallLit > 0) halo(ctx, V.hall[0], V.hall[1] - 30, 150, .45 * hallLit, P.blue0, D.COOL_HI);
    }
  }
  // ---- the dots
  const F = FIELD, cool = D.COOL, warmT = s.wave, fl = s.flood, ex = s.edge > 0 && s.edge < 1 ? lerp(-200, W + 200, sineIO(s.edge)) : -1e4;
  const dot = (x, y, sz, p, wd) => {
    const w = warmT > wd * 1.7 ? smooth(clamp((warmT - wd * 1.7) / .35)) : 0, eg = Math.max(0, 1 - Math.abs(x - ex) / 220);
    ctx.fillStyle = w > .5 ? P.core1 : eg > .5 ? D.COOL_HI : cool;
    ctx.globalAlpha = w > .5 ? 1 : Math.min(1, (.8 + .2 * Math.sin(t * .8 + p.ph)) + eg * .3);
    const q = sz * (1 + .2 * w + .3 * eg) / zs; ctx.fillRect(x - q / 2, y - q / 2, q, q);
  };
  ctx.save();
  if (s.group > 0) {   // the 13,000: a small group walks out of the hall, down the road, and packs into a block
    for (const b of F.block) {
      const u = clamp((s.group - b.ord * .55) / .45);
      if (u <= 0) continue;
      let x, y;
      if (u < .82) [x, y] = along(WALK, WALKL, u / .82); else { const [px, py] = along(WALK, WALKL, 1), f = sineIO((u - .82) / .18); x = lerp(px, b.x, f); y = lerp(py, b.y, f); }
      dot(x, y, b.s, b, 0);
    }
  }
  if (fl > 0) {        // the flood: out of the block over every road to the horizon, the far ones arrive on "billion"
    const [cx, cy] = V.cluster;
    for (const p of F.pts) {
      const t0 = p.fd * 2.9; if (fl < t0) break;
      const kk = expoOut(clamp((fl - t0) / .5)), x = lerp(lerp(cx, p.x, .72), p.x, kk), y = lerp(lerp(cy, p.y, .72), p.y, kk);
      dot(x, y, p.s * (.4 + .6 * kk), p, p.wd);
    }
  }
  ctx.restore();
  // the light edge: a quiet band of light that sweeps the field once (counting)
  if (ex > -1e3) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const e = Math.sin(Math.PI * s.edge);
    ctx.fillStyle = lin(ctx, ex - 240, 0, ex + 240, 0, [[0, rgba(P.blue0, 0)], [.5, rgba(P.blue0, .5 * e)], [1, rgba(P.blue0, 0)]]);
    ctx.beginPath(); ctx.rect(ex - 240, HOR + 2, 480, 1100); ctx.fill(); ctx.restore();
  }
  // the warm wave: a pool of light that spreads from the block as the dots turn warm (all of them learning from ours)
  if (warmT > 0) {
    const R = 260 + 1700 * expoOut(clamp(warmT / 2.2)), aa = .3 * smooth(clamp(warmT / .6));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(V.cluster[0], V.cluster[1]); ctx.scale(1, .34);
    ctx.fillStyle = rad(ctx, 0, 0, R, [[0, rgba(P.halo0, aa)], [.45, rgba(P.halo1, aa * .45)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.29); ctx.fill(); ctx.restore();
  }
  if (s.loupe > 0) loupe(ctx, t, s.loupe);
  // ---- the numbers, upper left on the night sky of the valley card (one slot, each sinks before the next rises)
  D.numBlock(ctx, t, { x: 196, y: 252, num: '>13,000', label: 'ROBOTS · 2025', src: 'OMDIA', t0: a.thirteen - .25, t1: a.century - .75, size: 150 });
  D.numBlock(ctx, t, { x: 196, y: 252, num: '~1 billion', label: 'BY 2050 · FORECAST', src: 'MORGAN STANLEY', t0: a.billion - .3, t1: a.two - .2, size: 150 });
  D.numBlock(ctx, t, { x: 196, y: 252, num: '2 billion', label: 'NEW HANDS', src: 'FORECAST · MORGAN STANLEY', t0: a.two + .35, t1: a.all + .2, size: 150 });
  return null;
}
// the land as a map: contour lines that crowd toward the horizon and a river of reflected light (quiet, cool, no dots: dots are robots)
const TERR = (() => {
  const r = prng(77), lines = [];
  for (let j = 0; j < 16; j++) {
    const Z = 640 * Math.pow(1.27, j), pts = [];
    const ph = r() * 6.3, amp = 26 + r() * 30;
    for (let x = -900; x <= W + 900; x += 40) { const X = (x - W / 2) * Z / FOC, Zw = Z + amp * Z / 900 * Math.sin(X / (380 + 60 * j) * 1.0 + ph) + .3 * amp * Z / 900 * Math.sin(X / 140 + ph * 2); pts.push(gp(X, Math.max(560, Zw))); }
    lines.push({ pts, a: .1 + .14 * (1 - j / 16) });
  }
  const riv = []; for (let i = 0; i <= 48; i++) { const f = i / 48, Z = 560 * Math.pow(32, f), xs = lerp(1760, 1330, Math.pow(f, .6)) + 150 * Math.sin(f * 9 + .5) * (1 - f); riv.push([(xs - W / 2) * Z / FOC, Z]); }
  return { lines, riv };
})();
function terrain(ctx) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const L of TERR.lines) { ctx.strokeStyle = rgba(P.blue1, L.a); ctx.lineWidth = 1.4; ctx.beginPath(); L.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  // the river: a band whose width follows the perspective, filled with the blue of the sky
  const left = [], right = [];
  for (const [X, Z] of TERR.riv) { const w = 46; left.push(gp(X - w, Z)); right.push(gp(X + w, Z)); }
  const rp = new Path2D(); rp.moveTo(...left[0]); for (const p of left.slice(1)) rp.lineTo(...p); for (const p of right.reverse()) rp.lineTo(...p); rp.closePath();
  ctx.fillStyle = lin(ctx, 0, HOR, 0, H, [[0, rgba(P.blue0, .85)], [.5, rgba(P.blue0, .45)], [1, rgba(P.ind1, .5)]]); ctx.fill(rp);
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 1.2; ctx.stroke(rp);
  ctx.restore();
}
// the loupe: a ring of light that opens out of one dot; inside, the dot is a robot raising both hands, more behind it
function loupe(ctx, t, u) {
  const [x, y] = VALLEY.loupe, R = 176 * u; if (R < 2) return;
  ctx.save();
  const disc = new Path2D(); disc.arc(x, y, R, 0, 6.29);
  ctx.save(); ctx.clip(disc);
  ctx.fillStyle = rad(ctx, x, y - R * .2, R * 1.1, [[0, P.blue0], [.55, mixHex(P.blue0, P.ind1, .6)], [1, P.night1]]); ctx.fill(disc);
  const sc = R / 176; ctx.translate(x, y); ctx.scale(sc, sc);
  // far rows of raised hands (tiny warm dots in pairs), then three robots in front
  for (let row = 0; row < 3; row++) for (let i = -7; i <= 7; i++) {
    const yy = -30 + row * 26, xx = i * 26 + (row % 2) * 13, hh = 34 + row * 10;
    ctx.fillStyle = rgba(P.night1, .85); ctx.fillRect(xx - 2.5, yy - hh * .55, 5, hh * .55);
    ctx.fillStyle = P.core1; ctx.globalAlpha = .9; ctx.fillRect(xx - 5, yy - hh * .78, 2.6, 2.6); ctx.fillRect(xx + 2.4, yy - hh * .78, 2.6, 2.6); ctx.globalAlpha = 1;
  }
  ctx.fillStyle = lin(ctx, 0, 40, 0, 180, [[0, P.ind2], [1, P.night0]]); ctx.fillRect(-200, 66, 400, 140);
  for (const [rx, rh, sd] of [[-92, 128, 1], [0, 150, -1], [94, 124, 1]]) {
    const hd = E.robot(ctx, rx, 132, rh, { pose: 'lift', dir: sd, light: 1, rim: mixHex(P.blue2, P.halo0, .7), body: P.night0 });
    for (const k of ['R', 'L']) { halo(ctx, hd[k][0], hd[k][1], 34, .8); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(hd[k][0], hd[k][1], 4, 0, 6.29); ctx.fill(); }
  }
  ctx.restore();
  const ring = new Path2D(); ring.arc(x, y, R, 0, 6.29);
  E.lightShape(ctx, ring.stroke({ width: Math.max(2, 7 * Math.min(1, u * 1.5)) }), t, { lit: 1, dust: 0, glow: .5 });
  ctx.restore();
}

// ===================================================================================================== TL: the road map (card Z 2400)
// placed so that the line sits at screen y 430, x 420 → 1700 in the crane-up camera of sc01 (tlCam)
const TLC = cam3({ x: 70, y: -300, z: -40 });
export const TL = (() => {
  const Z = 2400, m = cardM(TLC, Z), y = (430 - m.f) / m.k, x0 = (420 - m.e) / m.k, x1 = (1700 - m.e) / m.k;
  return { Z, x0, y, w: x1 - x0, cam: TLC, marks: [.2, .5, .8].map((f) => ({ f, x: x0 + (x1 - x0) * f, y })) };
})();
const pw = (t, K) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t < K[i][0]) return lerp(K[i - 1][1], K[i][1], sineIO((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0]))); return K[K.length - 1][1]; };
export function roadmap(ctx, t, s, a) {
  if (!(s.tl > 0)) return;
  const { x0, y, w, marks } = TL, x1 = x0 + w;
  const reach = [a.whether + .2, a.cost - .1, a.wake - .05];
  const u = pw(t, [[a.eleven + .2, 0], [reach[0], .2], [a.cost - .9, .2], [reach[1], .5], [a.wake - .85, .5], [reach[2], .8]]);
  // the whole road ahead as dotted cool light (drawn by the trace arriving from the horizon), the travelled part solid
  ctx.save(); ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(D.COOL_HI, .85); ctx.lineWidth = 4.4;
  ctx.beginPath(); ctx.moveTo(x0 + w * u, y); ctx.lineTo(x0 + w * s.tl, y); ctx.stroke(); ctx.restore();
  if (u > 0) E.trail(ctx, [[x0, y, 3.4], [x0 + w * u, y, 3.4]], 1, { w: 3.4, spark: false });
  const hx = x0 + w * u; halo(ctx, hx, y, 64, .9); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(hx, y, 6, 0, 6.29); ctx.fill();
  // ends: 0 and 11 MIN (the film's own length)
  D.wipeText(ctx, '0', x0, y + 70, span(s.tl, .02, .35), { size: 34, align: 'center', col: D.COOL_HI, glow: false, spacing: .1 });
  D.wipeText(ctx, '11 MIN', x1, y + 70, span(t, a.eleven + .9, a.eleven + 1.6), { size: 34, align: 'center', col: D.COOL_HI, glow: false, spacing: .14 });
  // the three marks: a node on the line, a symbol of light above, one word below
  marks.forEach((m, i) => {
    const k = smooth(span(t, reach[i] - .12, reach[i] + .4)), g = expoOut(span(t, reach[i] - .1, reach[i] + .7));
    const nd = new Path2D(); nd.arc(m.x, y, 11 + 5 * k, 0, 6.29); E.lightShape(ctx, nd, t, { lit: k > .5 ? 1 : 0, a: .7 + .3 * k, dust: 0 });
    if (i === 0 && g > 0) E.icon(ctx, 'robot', m.x, y - 132, 150 * g, t, { lit: 1, dust: 0, seed: 81 });
    if (i === 1 && g > 0) {
      E.icon(ctx, 'coin', m.x - 64, y - 118, 104 * g, t, { lit: 1, dust: 0, seed: 82 });
      const pg = expoOut(span(t, a.planet - .2, a.planet + .6));
      if (pg > 0) { const pl = new Path2D(); pl.arc(m.x + 70, y - 118, 44 * pg, 0, 6.29); const ri = new Path2D(); ri.ellipse(m.x + 70, y - 118, 74 * pg, 18 * pg, -.32, 0, 6.29); E.lightShape(ctx, pl.op(ri.stroke({ width: 7 * pg }), PathOp.Union), t, { lit: 1, dust: 0, seed: 83 }); }
    }
    if (i === 2) {   // a sun of light rises out of the line (clipped at the line: a sunrise on the road map)
      const ru = sineIO(span(t, reach[2] - .1, a.life + .2)), r = 78 * (1 + .04 * smooth(span(t, a.life - .1, a.life + .6))), cy = lerp(y + r + 6, y - 40, ru);
      if (ru > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(m.x - 900, y - 2000, 1800, 2000 + 2); ctx.clip();
        E.lightForm(ctx, 'disc', m.x - r, cy - r, 2 * r, 2 * r, t, { a: smooth(clamp(ru * 3)), breath: .02, dust: 1800, seed: 84 });
        ctx.restore();
        E.rays(ctx, m.x, cy, r * 1.35, r * 1.9, 14, .22 * smooth(span(t, a.life - .2, a.life + .8)), t * .02);
      }
    }
  });
  const lab = [['COMING?', a.coming - .2], ['COST', a.cost - .05], ['LIFE', a.life - .1]];
  marks.forEach((m, i) => D.wipeText(ctx, lab[i][0], m.x, y + 84, span(t, lab[i][1], lab[i][1] + .7), { size: 40, align: 'center', spacing: .14, col: P.cream }));
}

// ===================================================================================================== HALL (K3): window, robot, you
// frontal: window x 1110–1630, y 70–860 (mullions 3×2), floor from 860; you with headset left (feet 944, h 250, cup in the right hand),
// the robot right in the window light (feet 904, h 372, facing left, warm rim). st { lift, rob, look, glint, place {s,t0}, arc, echo, echoT }
export const HALL = { win: { x: 1110, y: 70, w: 520, h: 790 }, fy: 860, du: { x: 640, y: 944, h: 250 }, rob: { x: 1385, y: 904, h: 372 } };
export function hall(ctx, t, c, st = {}) {
  const { win: WN, fy } = HALL, cx = WN.x + WN.w / 2;
  let hands = null;
  card(ctx, c, 9000, () => {   // the dark beyond the wall (only seen when the camera pulls far back)
    E.nightSky(ctx, [[0, P.night0], [1, P.night1]], -2000, 3000);
  });
  const RW = (st.right ?? W + 1400) + 1400;   // st.right: where the building ends (c02 trucks out past its corner)
  card(ctx, c, F0, () => {
    // the back wall: night with the saturated blue bloom of the window
    ctx.fillStyle = lin(ctx, 0, -400, 0, fy, [[0, P.night0], [.7, P.night1], [1, P.ind0]]); ctx.fillRect(-1400, -900, RW, fy + 900);
    ctx.fillStyle = rad(ctx, cx, fy - 300, 1400, [[0, rgba(P.blue0, 1)], [.38, rgba(P.blue0, .5)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-1400, -900, RW, fy + 900);
    // the floor
    ctx.fillStyle = lin(ctx, 0, fy, 0, H + 200, [[0, P.ind1], [.16, P.ind0], [1, P.night0]]); ctx.fillRect(-1400, fy, RW, 1400);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, fy - 2, 0, fy + 26, [[0, rgba(P.blue0, .7)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-1400, fy - 2, RW, 28); ctx.restore();
    if (st.right != null) { ctx.fillStyle = rgba(P.blue0, .95); ctx.fillRect(st.right - 3, -900, 3, fy + 900 + 1400); }
    // the window (the one light form), its light falling out onto the floor toward us
    E.lightForm(ctx, 'window', WN.x, WN.y, WN.w, WN.h, t, { mullions: [3, 2], dust: 6500, seed: 77 });
    E.lightPool(ctx, WN.x, WN.x + WN.w, fy, 380, H - fy + 220, 1);
    // long shadows toward the viewer
    E.castShadow(ctx, HALL.rob.x, HALL.rob.y, 62, 300, 1.42, .7);
    E.castShadow(ctx, HALL.du.x, HALL.du.y, 50, 240, 2.2, .45);
    // the robot in the light, copying your move
    const rl = smooth(clamp(st.rob ?? 0));
    const rh = E.robot(ctx, HALL.rob.x, HALL.rob.y, HALL.rob.h, { dir: -1, light: -1, rim: P.halo0, body: P.night1, cup: 'R', armR: [lerp(.2, 1.35, rl), lerp(.1, 2.55, rl)], armL: [-.08, -.03] });
    // you, the trainer, with the headset
    const lf = smooth(clamp(st.lift ?? 0));
    const dh = E.du(ctx, HALL.du.x, HALL.du.y, HALL.du.h, { dir: 1, light: 1, back: .25, headset: true, cup: 'R', look: st.look ?? .1, armR: [lerp(.18, 1.35, lf), lerp(.1, 2.55, lf)], armL: [-.1, -.04] });
    if ((st.glint ?? 0) > 0 && st.glint < 1) { const hx = HALL.du.x + HALL.du.h * .058, hy = HALL.du.y - HALL.du.h * .873; halo(ctx, hx, hy, 70, .9 * Math.sin(Math.PI * st.glint)); }
    hands = { du: dh.R, rob: rh.R };
    // the move, copied as a trace of light; the repetitions pile up as faint echoes (a crown)
    const A0 = [dh.R[0] + 6, dh.R[1] - 14], B0 = [rh.R[0] - 6, rh.R[1] - 14];
    const ne = Math.floor(st.echo ?? 0);
    for (let i = 0; i < ne; i++) {
      const hsh = ((i * 7919) % 97) / 97, lift = 120 + 340 * Math.pow(hsh, .8), born = (st.echoBorn ? st.echoBorn(i) : -1), g = born < 0 ? 1 : clamp((t - born) / .4);
      E.trail(ctx, D.arcPts(A0, B0, lift, 1.1 + .5 * (i % 3 === 0)), expoOut(g), { a: (.14 + .1 * ((i * 5) % 3) / 2) * (st.echoA ?? 1), spark: false });
    }
    if ((st.arc ?? 0) > 0 && (st.echoA ?? 1) > 0) E.trail(ctx, D.arcPts(A0, B0, 150, 3.2), st.arc, { w: 3.2, spark: st.arc < 1, a: st.echoA ?? 1 });
  });
  card(ctx, c, 1250, () => {   // a dark soft sweep in the foreground (left), depth
    ctx.beginPath(); ctx.moveTo(-500, -300); ctx.bezierCurveTo(300, 60, 430, 520, 330, 1400); ctx.lineTo(-500, 1400); ctx.closePath();
    ctx.fillStyle = lin(ctx, 420, 0, -200, 0, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .8)]]); ctx.fill();
  });
  if (st.place) placeTag(ctx, t, st.place);
  return hands;
}
// a place label in the footage-tag position (bottom left), without ORIGINAL FOOTAGE: short line of light + cream caps
export function placeTag(ctx, t, { s, t0, out }) {
  const u = span(t, t0, t0 + .7); if (u <= 0) return;
  const x = 108, y = 846, k = expoOut(u) * (1 - quartIO(span(t, out ?? 1e9, (out ?? 1e9) + .5)));
  ctx.save(); ctx.fillStyle = rad(ctx, x + 160, y + 10, 420, [[0, rgba(P.night0, .45)], [1, rgba(P.night0, 0)]]); ctx.fillRect(x - 200, y - 240, 760, 380);
  ctx.fillStyle = rgba(P.core1, .95); ctx.fillRect(x, y - 52, 74 * k, 3); halo(ctx, x + 74 * k, y - 50.5, 20, .5 * k); ctx.restore();
  D.wipeText(ctx, s.toUpperCase(), x, y, span(t, t0 + .12, t0 + .82), { size: 34, spacing: .16, col: P.cream, out: out != null ? span(t, out, out + .5) : 0 });
}

// ===================================================================================================== 1.21: "Thousands of times."
// The same hall after the footage: you hold the cup up, the robot holds the copy; the copied move as an arc of light and its
// repetitions piling up into a dense crown. The camera pulls back slowly (and keeps going into c02: echoCam is shared).
export function echoCam(t, t0) {
  const u = Math.max(0, t - t0);
  return E.camDrift(cam3({ x: 20 - 4 * u, y: -6 + 2 * u, z: 20 - 60 * u - 35 * u * u }), t, .5);
}
export const echoCount = (t, t0) => Math.min(90, Math.floor(4 * (Math.pow(2, 1.8 * Math.max(0, t - t0)) - 1)));
export const echoBorn = (t0) => (i) => t0 + Math.log2(i / 4 + 1) / 1.8;
export function echoFrame(ctx, t, t0) {
  const u = t - t0;
  return hall(ctx, t, echoCam(t, t0), { lift: 1, rob: 1 - .06 * Math.sin(u * 2.2), look: .3, arc: expoOut(clamp(u / .7)), echo: echoCount(t, t0), echoBorn: echoBorn(t0) });
}
export const hallEcho = (t0) => (ctx, t) => { echoFrame(ctx, t, t0); };
