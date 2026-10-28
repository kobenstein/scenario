// Film 10 · B1 world module for c02 (Editorial-Nacht): the map of the forty halls (2.01), the joint graph (2.02),
// the globe CHINA → USA (2.03), and your living room at night (2.05–2.12) with its flow, quote, crown, disc and notebook.
// Built on lib/f10_editorial.mjs (never changed) + lib/f10_c01_draw.mjs + lib/f10_c01_world.mjs (the hall).
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as D from './f10_c01_draw.mjs';
const { W, H, P, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, halo, prng, cam3, cardM, card, F0 } = E;

// ===================================================================================================== camera helpers
// interpolate two cameras with eased share u (log distance to the focus card, like E.camAt)
export function camLerp(a, b, u, ref = F0) {
  const out = cam3(); for (const k of ['x', 'y', 'f', 'roll']) out[k] = lerp(a[k] ?? out[k], b[k] ?? out[k], u);
  const da = Math.max(1, ref - (a.z || 0)), db = Math.max(1, ref - (b.z || 0)); out.z = ref - Math.exp(lerp(Math.log(da), Math.log(db), u)); return out;
}
// cubic Hermite share with start slope m0 (normalised) and end slope m1 — to continue a camera that is already moving
export const herm = (x, m0 = 0, m1 = 0) => { x = clamp(x); const x2 = x * x, x3 = x2 * x; return (x3 - 2 * x2 + x) * m0 + (-2 * x3 + 3 * x2) + (x3 - x2) * m1; };
// a cool light stroke (machine, copy, not yet): the kit trail is warm, this is its cool twin
export function coolTrail(ctx, pts, u = 1, o = {}) {
  if (u <= 0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const stop = len[len.length - 1] * clamp(u), a = o.a ?? 1; let head = pts[0];
  for (const [k, al, col, op] of [[5, .3, P.blue0, 'lighter'], [2.2, .7, D.COOL, 'source-over'], [1, 1, mixHex(D.COOL_HI, P.cream, .4), 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = al * a;
    if (k > 3) ctx.filter = `blur(${(o.w || 3) * 2}px)`;
    if (o.dash) ctx.setLineDash(o.dash);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      if (len[i - 1] >= stop) break;
      let q = pts[i]; if (len[i] > stop) { const f = (stop - len[i - 1]) / (len[i] - len[i - 1]); q = pts[i - 1].map((v, j) => lerp(v, pts[i][j], f)); }
      ctx.lineTo(q[0], q[1]); head = q;
    }
    ctx.lineWidth = (o.w ?? 3) * k; ctx.stroke(); ctx.restore();
  }
  if (o.spark !== false && u < 1) halo(ctx, head[0], head[1], (o.w ?? 3) * 12, .7 * a, P.blue0, D.COOL_HI);
  return head;
}

// ===================================================================================================== 2.01: the map of the forty halls
// A card at Z 1300 in front of the hall: the dark land seen from above with a hole for our hall's window; around it 42 more halls
// (roof + lit window) that ignite in a cascade on "forty". FAR = the camera that shows the whole map (our hall at the bottom centre).
export const MAPZ = 1300, OPEN = { x: 960 - 1200, y: 540 - 675, w: 2400, h: 1350 };
export const FAR = E.aim(MAPZ, 960, 540, .07, 960, 815);
export const HALLS = (() => {
  const m = cardM(FAR, MAPZ), r = prng(1340), out = [];
  const rows = [[815, 1, 2], [632, .64, 3], [520, .43, 4], [452, .29, 5], [410, .2, 6]];
  for (const [sy, f, n] of rows) for (let c = -n; c <= n; c++) {
    if (sy === 815 && c === 0) continue;   // ours
    if (out.length >= 42) break;
    const sx = 960 + c * 300 * f + (r() - .5) * 40 * f, yy = sy + (r() - .5) * 18 * f, w = 168 * f * (.86 + r() * .22);
    if (sx < -60 || sx > W + 60) continue;
    out.push({ x: (sx - m.e) / m.k, y: (yy - m.f) / m.k, w: w / m.k, d: Math.hypot(sx - 960, (yy - 815) * 2.2), seed: Math.floor(r() * 1000) });
  }
  const dm = Math.max(...out.map((h) => h.d)); for (const h of out) h.d /= dm;
  return out;
})();
// st { ign (time of the first ignition), mark (0..1 ring round ours) }
export function hallMap(ctx, t, c, st) {
  card(ctx, c, MAPZ, (k) => {
    const m = cardM(FAR, MAPZ), horY = (300 - m.f) / m.k;
    // the land with the hole for our hall
    const land = new Path2D(); land.rect(-40000, horY, 80000, 60000); land.rect(OPEN.x, OPEN.y, OPEN.w, OPEN.h);   // evenodd: the hole
    ctx.fillStyle = lin(ctx, 0, horY, 0, OPEN.y + OPEN.h + 4000, [[0, P.ind1], [.3, P.ind0], [1, P.night1]]);
    ctx.fill(land, 'evenodd');
    // the sky above the far horizon of the map
    const sky = new Path2D(); sky.rect(-40000, -60000, 80000, 60000 + horY);
    ctx.fillStyle = lin(ctx, 0, horY - 9000, 0, horY, [[0, P.night0], [1, P.ind1]]); ctx.fill(sky);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, horY - 600, 0, horY + 300, [[0, rgba(P.blue0, 0)], [.7, rgba(P.blue0, .7)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-40000, horY - 600, 80000, 900); ctx.restore();
    E.stars(ctx, 31, 160, t, [-14000, horY - 9000, 30000, 8600], .8);
    // faint roads between the halls (a map)
    ctx.save(); ctx.strokeStyle = rgba(P.blue1, .35); ctx.lineWidth = 2.2 / k; ctx.setLineDash([10 / k, 14 / k]);
    for (const h of HALLS) { ctx.beginPath(); ctx.moveTo(960, OPEN.y + OPEN.h); ctx.quadraticCurveTo(lerp(960, h.x, .2), lerp(OPEN.y + OPEN.h, h.y + h.w * .35, .7), h.x, h.y + h.w * .35); ctx.stroke(); }
    ctx.restore();
    // our hall's building round the hole: a roof frame with a cool rim
    const fr = new Path2D(); fr.rect(OPEN.x - 300, OPEN.y - 520, OPEN.w + 600, OPEN.h + 820); const fh = new Path2D(fr); fh.rect(OPEN.x, OPEN.y, OPEN.w, OPEN.h);
    ctx.fillStyle = lin(ctx, 0, OPEN.y - 520, 0, OPEN.y + OPEN.h + 300, [[0, P.ind2], [1, P.night1]]); ctx.fill(fh, 'evenodd');
    ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 3 / k; ctx.stroke(fr);
    // the other halls
    for (const h of HALLS) {
      const on = smooth(span(t, st.ign + h.d * 1.7, st.ign + h.d * 1.7 + .35)), w = h.w, wh = w * .5625;
      ctx.fillStyle = mixHex(P.ind1, P.night1, .5); ctx.fillRect(h.x - w * .64, h.y - wh * .5 - w * .2, w * 1.28, wh + w * .32);
      ctx.fillStyle = rgba(P.blue0, .7); ctx.fillRect(h.x - w * .64, h.y - wh * .5 - w * .2, w * 1.28, Math.max(2 / k, w * .012));
      if (on > 0) halo(ctx, h.x, h.y, w * 1.5, .5 * on, P.halo1, P.halo0);
      ctx.fillStyle = mixHex(P.blue0, P.ind1, .35); ctx.fillRect(h.x - w / 2, h.y - wh / 2, w, wh);
      if (on > .02) { ctx.fillStyle = lin(ctx, 0, h.y - wh / 2, 0, h.y + wh / 2, [[0, rgba(P.core0, on)], [.6, rgba(P.core1, on)], [1, rgba(P.halo0, on)]]); ctx.fillRect(h.x - w / 2, h.y - wh / 2, w, wh); }
    }
    // "like that one": a ring of light round ours
    if (st.mark > 0) { const p = new Path2D(); p.roundRect(OPEN.x - 160, OPEN.y - 160, OPEN.w + 320, OPEN.h + 320, 120); E.lightShape(ctx, p.stroke({ width: 70 * expoOut(st.mark) + 1 }), t, { lit: 1, dust: 0, glow: .4, a: st.mark }); }
  });
}

// ===================================================================================================== 2.02: joint arcs + the angle graph
// angle arcs at your shoulder, elbow and wrist (design coords on F0), u = [s, e, w] growth
export function jointArcs(ctx, t, J, u, o = {}) {
  const arcAt = (p, a0, a1, r, k, seed) => {
    if (k <= 0) return; const p2 = new Path2D(); p2.arc(p[0], p[1], r, a0, lerp(a0, a1, expoOut(k)), a1 < a0);
    E.lightShape(ctx, p2.stroke({ width: 3.2, cap: 1 }), t, { lit: 1, dust: 0, glow: .6, seed, a: o.a ?? 1 });
    const d = new Path2D(); d.arc(p[0], p[1], 4.5 * Math.min(1, k * 2), 0, 6.29); E.lightShape(ctx, d, t, { lit: 1, dust: 0, a: o.a ?? 1 });
  };
  const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  arcAt(J.shR, Math.PI / 2, ang(J.shR, J.elR), 26, u[0], 3);
  arcAt(J.elR, ang(J.elR, J.shR), ang(J.elR, J.R), 22, u[1], 4);
  if (!o.noWrist) arcAt(J.R, ang(J.R, J.elR), ang(J.R, J.elR) - 2.1, 18, u[2], 5);
}
export const ANGLE = [[0, .22], [.12, .24], [.28, .4], [.42, .72], [.56, .86], [.7, .82], [.84, .58], [1, .5]];
const COPY = ANGLE.map(([x, y]) => [Math.min(1, x + .035), y - .03 + .02 * Math.sin(x * 9)]);
// the graph "angle over time": warm = you, cool = the robot's copy on top. o { rect [x,y,w,h], uW, uC, a, lab }
export function angleGraph(ctx, t, o) {
  const [x, y, w, h] = o.rect, a = o.a ?? 1; if (a <= 0) return null;
  ctx.save(); ctx.globalAlpha = a;
  const ax = smooth(clamp(o.axis ?? 1));
  ctx.strokeStyle = rgba(P.blue1, .85); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y + h - h * ax); ctx.lineTo(x, y + h); ctx.lineTo(x + w * ax, y + h); ctx.stroke();
  ctx.restore();
  const map = ([u, v]) => [x + u * w, y + h - v * h];
  let head = null;
  if (o.uW > 0) {
    const pts = E.catmull(ANGLE.map((p) => [...map(p), 2.6]), 12);
    const iu = Math.max(1, Math.floor(clamp(o.uW) * (pts.length - 1)));
    const ar = new Path2D(); ar.moveTo(pts[0][0], y + h); for (let i = 0; i <= iu; i++) ar.lineTo(pts[i][0], pts[i][1]); ar.lineTo(pts[iu][0], y + h); ar.closePath();
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, rgba(P.halo0, .42)], [.6, rgba(P.halo1, .14)], [1, rgba(P.blue0, .04)]]); ctx.fill(ar); ctx.restore();
    E.trail(ctx, pts, o.uW, { w: 2.6, a, spark: o.uW < 1 });
  }
  if (o.uC > 0) head = coolTrail(ctx, E.catmull(COPY.map((p) => [...map(p), 2]), 12), o.uC, { w: 2, a, spark: o.uC < 1 });
  const ls = o.lab ?? 20;
  D.wipeText(ctx, 'ANGLE', x - 10, y - 14, span(t, o.t0, o.t0 + .6), { size: ls, spacing: .16, glow: false, col: P.halo2 });
  D.wipeText(ctx, 'TIME', x + w, y + h + ls * 1.5, span(t, o.t0 + .2, o.t0 + .8), { size: ls, spacing: .16, glow: false, col: P.halo2, align: 'right' });
  D.wipeText(ctx, 'YOU', map(ANGLE[4])[0] - 6, map(ANGLE[4])[1] - ls * .9, span(t, o.tW, o.tW + .6), { size: ls * .9, spacing: .16, glow: false, col: P.core1, align: 'right' });
  D.wipeText(ctx, 'ROBOT', map(COPY[6])[0] + 12, map(COPY[6])[1] + ls * 1.4, span(t, o.tC, o.tC + .6), { size: ls * .9, spacing: .16, glow: false, col: D.COOL_HI });
  return { head, map };
}

// ===================================================================================================== 2.03: the globe, CHINA → USA (on F0, right of the hall)
export const GLOBE = { cx: 3900, cy: 2650, r: 1800, usa: [3700, 861] };
export function globe(ctx, t, o) {
  const { cx, cy, r } = GLOBE;
  const g = new Path2D(); g.arc(cx, cy, r, 0, 6.29);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(90px)'; ctx.strokeStyle = rgba(P.blue0, 1); ctx.lineWidth = 160; ctx.stroke(g); ctx.filter = 'blur(14px)'; ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 24; ctx.stroke(g); ctx.restore();
  ctx.fillStyle = rad(ctx, cx, cy - r * .7, r * 1.2, [[0, P.ind1], [.6, P.ind0], [1, P.night1]]); ctx.fill(g);
  ctx.save(); ctx.clip(g); ctx.strokeStyle = rgba(P.blue1, .4); ctx.lineWidth = 2;
  for (let i = 1; i < 7; i++) { ctx.beginPath(); ctx.ellipse(cx, cy, r * Math.sin(i / 7 * Math.PI / 2 + .2), r, 0, 0, 6.29); ctx.stroke(); }
  for (let i = 1; i < 6; i++) { const yy = cy - r * Math.cos(i / 6 * Math.PI / 2) ; ctx.beginPath(); ctx.moveTo(cx - r, yy); ctx.lineTo(cx + r, yy); ctx.stroke(); }
  ctx.restore();
  ctx.strokeStyle = rgba(P.blue0, 1); ctx.lineWidth = 3; ctx.stroke(g);
  const [ux, uy] = GLOBE.usa, k = expoOut(o.usa ?? 0);
  if (k > 0) {
    E.icon(ctx, 'house', ux, uy - 70 * k, 130 * k, t, { lit: 1, seed: 51 });
    D.wipeText(ctx, 'USA', ux, uy + 90, span(t, o.tLab, o.tLab + .7), { size: 64, spacing: .18, align: 'center', col: P.cream });
  }
}

// ===================================================================================================== the living room at night (2.05–2.12)
// cards: outside 9000 (far valley, a small warm window with a person in a headset) · back wall 2600 (window hole, door) · F0
// (lamp = the hero, table, cup, notebook on a stand, sofa with you seen from behind, the home robot) · foreground 1150 (plant)
export const ROOM = {
  floor: 905, win: { x: 380, y: 150, w: 600, h: 450 }, door: { x: 1790, y: 300, w: 180, h: 480 },
  lamp: { x: 1780, y: 410 }, table: { x0: 800, x1: 1110, y: 760 }, cup: [858, 760], book: { x: 1002, y: 712, w: 66, h: 46 },
  sofa: { x0: 1170, x1: 1570, y: 690 }, du: { x: 1350, y: 792, h: 250 }, rob: { x: 715, y: 905, h: 360 },
  far: { x: 812, y: 470 },
};
export function room(ctx, t, c, st = {}) {
  const R = ROOM, wa = st.winWarm ?? 0;
  const out = {};
  card(ctx, c, 9000, () => {   // outside: the night valley, a far hill with one small warm window
    E.nightSky(ctx, [[0, P.night0], [.6, P.night1], [1, P.ind1]], -600, 560);
    ctx.fillStyle = rad(ctx, 760, 520, 900, [[0, rgba(P.blue0, .9)], [.5, rgba(P.blue0, .35)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-800, -800, 3600, 2600);
    E.stars(ctx, 41, 90, t, [200, 60, 900, 380], .8);
    ctx.beginPath(); ctx.moveTo(-600, 560); ctx.bezierCurveTo(200, 520, 560, 470, 780, 486); ctx.bezierCurveTo(980, 500, 1300, 560, 2400, 540); ctx.lineTo(2400, 1600); ctx.lineTo(-600, 1600); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, 470, 0, 700, [[0, P.ind2], [1, P.night0]]); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke();
    // the far window and the person in it (the teleoperator)
    const fx = R.far.x, fy = R.far.y;
    halo(ctx, fx, fy, 70, .55, P.halo1, P.halo0);
    ctx.fillStyle = lin(ctx, 0, fy - 22, 0, fy + 18, [[0, P.core0], [1, P.halo0]]); ctx.fillRect(fx - 26, fy - 22, 52, 40);
    const ph = E.person(ctx, fx + 2, fy + 18, 34, { dir: -1, light: 1, headset: true, armR: [lerp(.15, 2.6, st.farHand ?? 0), lerp(.1, 2.75, st.farHand ?? 0)], armL: [-.1, -.05] });
    out.farHand = ph.R;
  });
  card(ctx, c, 2600, () => {   // the back wall with the window hole and the door
    const wall = new Path2D(); wall.rect(-1500, -1200, W + 3000, 1980); wall.rect(R.win.x, R.win.y, R.win.w, R.win.h);
    ctx.fillStyle = lin(ctx, 0, -200, 0, 780, [[0, P.night0], [.55, P.night1], [1, P.ind2]]); ctx.fill(wall, 'evenodd');
    ctx.fillStyle = rad(ctx, R.lamp.x, R.lamp.y + 80, 1100, [[0, rgba(P.halo1, .2 * (st.lampA ?? 1))], [.35, rgba(P.blue0, .45)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-1500, -1200, W + 3000, 1980);
    // the floor
    ctx.fillStyle = lin(ctx, 0, 780, 0, 1500, [[0, P.ind1], [.2, P.ind0], [1, P.night0]]); ctx.fillRect(-1500, 780, W + 3000, 1200);
    ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(-1500, 778, W + 3000, 3);
    // the window frame (mullion cross, sill)
    ctx.strokeStyle = mixHex(P.ind2, P.blue1, .4); ctx.lineWidth = 12; ctx.strokeRect(R.win.x, R.win.y, R.win.w, R.win.h);
    ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(R.win.x + R.win.w / 2, R.win.y); ctx.lineTo(R.win.x + R.win.w / 2, R.win.y + R.win.h); ctx.moveTo(R.win.x, R.win.y + R.win.h * .38); ctx.lineTo(R.win.x + R.win.w, R.win.y + R.win.h * .38); ctx.stroke();
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.fillRect(R.win.x - 30, R.win.y + R.win.h, R.win.w + 60, 14);
    // 2.08: the window becomes the hall window (the same light form as K3)
    if (wa > 0) E.lightForm(ctx, 'window', R.win.x, R.win.y, R.win.w, R.win.h, t, { a: wa, mullions: [2, 2], dust: 3500, seed: 71 });
    // the door (right)
    ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 6; ctx.strokeRect(R.door.x, R.door.y, R.door.w, R.door.h);
    ctx.fillStyle = rgba(P.halo1, .7); ctx.beginPath(); ctx.arc(R.door.x + 26, R.door.y + 260, 6, 0, 6.29); ctx.fill();
    if (st.wall) st.wall(ctx);
  });
  card(ctx, c, F0, () => {
    const la = st.lampA ?? 1;
    // the window light on the floor (2.08) and the lamp's cone
    if (wa > 0) { E.lightPool(ctx, R.win.x + 60, R.win.x + R.win.w + 120, R.floor - 30, 300, 240, wa); }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(18px)';
    ctx.beginPath(); ctx.moveTo(R.lamp.x - 90, R.lamp.y + 60); ctx.lineTo(R.lamp.x + 90, R.lamp.y + 60); ctx.lineTo(R.lamp.x + 260, R.floor + 60); ctx.lineTo(R.lamp.x - 700, R.floor + 60); ctx.closePath();
    ctx.fillStyle = lin(ctx, 0, R.lamp.y + 60, 0, R.floor + 60, [[0, rgba(P.halo0, .34 * la)], [1, rgba(P.halo1, .1 * la)]]); ctx.fill(); ctx.restore();
    E.lightPool(ctx, R.lamp.x - 520, R.lamp.x + 160, R.floor - 6, 160, 150, .7 * la);
    // shadows from the lamp (to the left)
    E.castShadow(ctx, R.rob.x, R.rob.y, 40, 300, 3.0, .55);
    E.castShadow(ctx, (R.table.x0 + R.table.x1) / 2, R.floor, 120, 200, 3.0, .4);
    // the table, the cup, the notebook on its stand
    ctx.fillStyle = mixHex(P.ind2, P.night1, .4);
    ctx.fillRect(R.table.x0 + 20, R.table.y + 10, 12, R.floor - R.table.y - 10); ctx.fillRect(R.table.x1 - 32, R.table.y + 10, 12, R.floor - R.table.y - 10);
    ctx.fillStyle = lin(ctx, R.table.x0, 0, R.table.x1, 0, [[0, P.ind2], [1, mixHex(P.ind2, P.halo1, .35 * la)]]); ctx.fillRect(R.table.x0, R.table.y, R.table.x1 - R.table.x0, 12);
    ctx.fillStyle = rgba(P.halo0, .8 * la); ctx.fillRect(R.table.x0 + 40, R.table.y - 1, R.table.x1 - R.table.x0 - 40, 2);
    book(ctx, t, st.book ?? 0);
    // the robot (rim from the lamp on the right) and its right hand on the cup
    const rb = R.rob, rArm = st.robArm || { armR: [.12, .06], armL: [-.1, -.05] };
    out.rob = E.robot(ctx, rb.x, rb.y, rb.h, { dir: 1, light: 1, rim: mixHex(mixHex(P.halo0, P.blue0, .2), P.ind1, st.rimSoft ?? 0), body: P.ind0, ...rArm });
    out.robJ = D.robotJ(rb.x, rb.y, rb.h, rArm);
    if (st.lens > 0) { const hx = rb.x + rb.h * .055, hy = rb.y - rb.h * .945; for (const dx of [0, rb.h * .028]) { halo(ctx, hx + dx, hy, 18, .9 * st.lens, P.blue0, D.COOL_HI); ctx.fillStyle = rgba(P.core0, st.lens); ctx.beginPath(); ctx.arc(hx + dx, hy, 2.4, 0, 6.29); ctx.fill(); } out.lens = [hx + rb.h * .014, hy]; }
    const cp = st.cup || { x: R.cup[0], y: R.cup[1], tilt: 0 };
    D.cup(ctx, cp.x, cp.y, 30, { tilt: cp.tilt, lit: .6 * la });
    out.cup = [cp.x, cp.y - 15];
    // you on the sofa, seen from behind (the backrest hides the rest); the phone's glow on "allow"
    E.du(ctx, R.du.x, R.du.y, R.du.h, { dir: -1, light: -1, back: .55, look: -.1, armR: [.35, 1.1], armL: [-.3, -1.0] });
    sofa(ctx, la);
    if (st.phone > 0) { halo(ctx, R.du.x - 6, R.sofa.y - 8, 110, .75 * st.phone, P.halo1, P.core0); }
    out.phone = [R.du.x - 6, R.sofa.y - 8];
    // the lamp (the hero light of the room)
    ctx.fillStyle = mixHex(P.ind2, P.night0, .3); ctx.fillRect(R.lamp.x - 4, R.lamp.y + 50, 8, R.floor - R.lamp.y - 50); ctx.fillRect(R.lamp.x - 46, R.floor - 8, 92, 8);
    const sh = new Path2D(); sh.moveTo(R.lamp.x - 64, R.lamp.y - 66); sh.lineTo(R.lamp.x + 64, R.lamp.y - 66); sh.lineTo(R.lamp.x + 104, R.lamp.y + 60); sh.lineTo(R.lamp.x - 104, R.lamp.y + 60); sh.closePath();
    halo(ctx, R.lamp.x, R.lamp.y + 30, 520, .35 * la, P.halo1, P.halo0);
    E.lightShape(ctx, sh, t, { lit: 1, a: .55 + .45 * la, dust: Math.round(1800 * la), seed: 61, cy: .3 });
    if (st.f0) st.f0(ctx, out);
  });
  card(ctx, c, 1150, () => {   // a plant in the dark foreground (left)
    ctx.fillStyle = P.night0;
    for (const [x0, y0, a, l] of [[60, 1200, -1.9, 520], [90, 1200, -1.55, 600], [130, 1200, -1.2, 470], [40, 1200, -2.3, 380], [170, 1200, -1.0, 360]]) {
      const ex = x0 + Math.cos(a) * l, ey = y0 + Math.sin(a) * l, nx = -Math.sin(a), ny = Math.cos(a), sw = Math.sin(t * .6 + x0) * 6;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(lerp(x0, ex, .5) + nx * 60 + sw, lerp(y0, ey, .5) + ny * 60, ex + sw, ey); ctx.quadraticCurveTo(lerp(x0, ex, .5) - nx * 20 + sw, lerp(y0, ey, .5) - ny * 20, x0, y0); ctx.fill();
    }
  });
  return out;
}
function sofa(ctx, la) {
  const S = ROOM.sofa, b = new Path2D();
  b.moveTo(S.x0, ROOM.floor); b.lineTo(S.x0, S.y + 40); b.quadraticCurveTo(S.x0, S.y - 10, S.x0 + 50, S.y - 10); b.lineTo(S.x1 - 50, S.y - 10); b.quadraticCurveTo(S.x1, S.y - 10, S.x1, S.y + 40); b.lineTo(S.x1, ROOM.floor); b.closePath();
  ctx.fillStyle = lin(ctx, 0, S.y, 0, ROOM.floor, [[0, P.ind2], [1, P.night1]]); ctx.fill(b);
  ctx.fillStyle = rgba(mixHex(P.halo0, P.blue0, .3), .8 * la); ctx.fillRect(S.x0 + 40, S.y - 12, S.x1 - S.x0 - 80, 3);
  ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 2; ctx.stroke(b);
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(S.x0 + 20, S.y + 60, S.x1 - S.x0 - 40, 3);
}
// the notebook on its stand: two pages, open (u 0) → closing (u 1 = shut, only the gap of light left)
function book(ctx, t, close) {
  const B = ROOM.book, x0 = B.x - B.w, x1 = B.x + B.w, y0 = B.y - B.h, y1 = B.y + B.h;
  ctx.fillStyle = mixHex(P.ind2, P.night0, .4); ctx.fillRect(B.x - 3, y1, 6, ROOM.table.y - y1); ctx.fillRect(B.x - 30, ROOM.table.y - 4, 60, 4);
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .25);
  ctx.fillRect(x0 - 4, y0 - 4, (x1 - x0) + 8, (y1 - y0) + 8);   // cover
  const pg = lin(ctx, x0, 0, x1, 0, [[0, mixHex(P.ind2, P.night1, .3)], [.5, P.ind2], [1, mixHex(P.ind2, P.halo1, .18)]]);
  ctx.fillStyle = pg; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = rgba(P.night0, .5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(B.x, y0); ctx.lineTo(B.x, y1); ctx.stroke();
  ctx.strokeStyle = rgba(P.blue1, .35); ctx.lineWidth = .4; for (let i = 1; i < 8; i++) { const yy = y0 + (y1 - y0) * i / 8; ctx.beginPath(); ctx.moveTo(x0 + 6, yy); ctx.lineTo(B.x - 6, yy); ctx.moveTo(B.x + 6, yy); ctx.lineTo(x1 - 6, yy); ctx.stroke(); }
}
// 2.12: closing the notebook (drawn on top, in its own local frame): the right cover swings over; a gap of light is left at the spine
export function bookClose(ctx, u) {
  if (u <= 0) return;
  const B = ROOM.book, y0 = B.y - B.h - 4, y1 = B.y + B.h + 4, hw = B.w + 4;
  const s = Math.cos(Math.PI * clamp(u * .5 + .0));   // right cover: width shrinks to 0 at u = 1
  const wR = hw * Math.max(0, s), wL = hw * smooth(span(u, .55, 1));
  ctx.fillStyle = lin(ctx, B.x, 0, B.x + hw, 0, [[0, P.night0], [1, mixHex(P.ind2, P.blue1, .2)]]);
  if (wR > 0) ctx.fillRect(B.x, y0, wR, y1 - y0);
  if (u > .5) { ctx.fillStyle = lin(ctx, B.x - hw, 0, B.x, 0, [[0, mixHex(P.ind2, P.blue1, .2)], [1, P.night0]]); ctx.fillRect(B.x - wL, y0, wL, y1 - y0); }
}
