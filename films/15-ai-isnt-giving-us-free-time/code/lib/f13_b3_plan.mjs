// Film 13 · builder B3 · the planner wall (c12 → c13): the grid of a hundred coins becomes a week of hours, you stand under it,
// its floor line becomes the time line of c13. Drawn by sc12 (from the words) and by sc13 (its first seconds, from END12).
// World coordinates; a flat 2D camera { s, tx, ty }: screen = world · s + (tx, ty). No 3D flight: one pull-back, one slow pan.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import * as B from './f13_b3_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, drift, prng, lin, rad, halo } = E;

// ---- geometry (world) ----
export const COIN_R = 23, GRID = { cx: 960, y0: 200, dx: 62, dy: 62 };                 // 10 × 10 coins, row-major
export const coinXY = (k) => [GRID.cx + ((k % 10) - 4.5) * GRID.dx, GRID.y0 + Math.floor(k / 10) * GRID.dy];
export const BASE_Y = 800;                                                                 // the study's base line (c12 opening)
export const PL = { x0: 638, y0: 168, cw: 92, ch: 46, w: 80, h: 36, cols: 7, rows: 14 };     // the week: 7 days × 14 hours (8:00–22:00)
export const N_CELLS = PL.cols * PL.rows;
export const cellXY = (i) => [PL.x0 + PL.cw / 2 + (i % PL.cols) * PL.cw, PL.y0 + PL.ch / 2 + Math.floor(i / PL.cols) * PL.ch];
// coin → cell: the coins are cut into 7 groups by x (14 or 15 each), each group sorted by y fills one day top to bottom
// (a short, mostly vertical move for every coin; the two extra coins end on their neighbour's cell, under it)
const DUP = new Uint8Array(100);
const C2C = (() => {
  const ks = [...Array(100).keys()].sort((a, b) => coinXY(a)[0] - coinXY(b)[0] || coinXY(a)[1] - coinXY(b)[1]), out = new Int16Array(100); DUP.fill(0);
  let s0 = 0; for (let c = 0; c < 7; c++) { const n = c === 2 || c === 4 ? 15 : 14, g = ks.slice(s0, s0 + n).sort((a, b) => coinXY(a)[1] - coinXY(b)[1]); s0 += n;
    g.forEach((k, j) => { out[k] = Math.min(j, PL.rows - 1) * 7 + c; if (j >= PL.rows) DUP[k] = 1; }); }
  return out;
})();
export const coinCell = (k) => C2C[k];
export const GOLD = [37, 64];                                                              // the two who chose time
export const HOUR = 8 * 7 + 2;                                                             // Wednesday, 16:00: the first saved hour
export const CHIPS = [HOUR + 1, HOUR - 7, HOUR + 7];                                      // the tasks next to it that want in
export const WEEKEND = []; for (let r = 0; r < PL.rows; r++) WEEKEND.push(r * 7 + 5, r * 7 + 6);
export const EVENING = []; for (let r = 11; r < PL.rows; r++) for (let c = 0; c < 5; c++) EVENING.push(r * 7 + c);
export const FLOOR_Y = 1480, DU_X = 560, DU_H = 400;   // (you stay below the frame while the camera is at home)
// the time line of c13 lives on the floor: world x of a year
export const xYear = (yr) => 960 + (yr - 2026) * 13.16;
export const TL = { y0: 1780, y1: 2130 };   // years the floor line spans (screen 140 … 1780 at the end camera)

// ---- cameras ----
export const CAM0 = { s: 1, tx: 0, ty: 0 };
export const CAMR = { s: .5, tx: 1010 - 960 * .5, ty: 380 - 490 * .5 };         // the room: planner centre at (1010, 380), floor at y 875 (subtitles below 910)
export const CAMB = { s: .42, tx: 1450 - 960 * .42, ty: 800 - 1480 * .42 };     // the c12|c13 boundary: floor (the time line) at y 800, planner centre y 384
export function camMix(a, b, u) { return { s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)), tx: lerp(a.tx, b.tx, u), ty: lerp(a.ty, b.ty, u) }; }
// a mix in which the point `fx,fy` (screen) moves on a straight line (no swing from the log zoom)
export const toS = (c, x, y) => [x * c.s + c.tx, y * c.s + c.ty];

// ---- pieces ----
function cellPath(x, y, w, h, r) { const p = new Path2D(); p.roundRect(x - w / 2, y - h / 2, w, h, r); return p; }
// one coin of the grid (cheap: no blur per coin; the grid gets one glow behind it)
function gridCoin(ctx, x, y, r, gold, a = 1) {
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rad(ctx, x - r * .3, y - r * .35, r * 1.4, gold > .5 ? [[0, P.core0], [.4, P.halo0], [1, P.halo1]] : [[0, P.cream], [.4, B.COOL], [1, mixHex(P.blue2, P.blue0, .4)]]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  if (gold > 0 && gold < 1) { ctx.globalAlpha = a * (gold > .5 ? 1 - gold : gold); ctx.fillStyle = rad(ctx, x - r * .3, y - r * .35, r * 1.4, gold > .5 ? [[0, P.cream], [.4, B.COOL], [1, mixHex(P.blue2, P.blue0, .4)]] : [[0, P.core0], [.4, P.halo0], [1, P.halo1]]); ctx.fill(); ctx.globalAlpha = a; }
  ctx.strokeStyle = rgba(gold > .5 ? P.shade0 : P.blue1, .65); ctx.lineWidth = Math.max(1, r * .09); ctx.beginPath(); ctx.arc(x, y, r * .7, 0, 6.29); ctx.stroke();
  ctx.restore();
}

// st: { cam, t, coinUp (0..1 coins risen from the base line), cellU (coin → cell), gold[2], empty (Float32Array N_CELLS),
//       chips [{ i, u }] (u: 0 at home … 1 at the hour), guard (ring 0..1), duLook, duArm, floorU, ticksU, glow }
export function planner(ctx, t, st) {
  const c = st.cam, s = c.s, Vc = B.viewCam(c);   // (st.cam in view space; the caller has applied B.VIEW for its own screen-space drawing)
  ctx.save(); B.applyView(ctx);
  // the light of the wall: one soft glow behind the grid (the planner is the hero light of the room)
  const [gx, gy] = toS(c, 960, 500);
  const col = clamp(st.collapse ?? 0);
  halo(ctx, gx, gy, 760 * s * (1 - .7 * col), (.2 + .06 * (st.glow ?? 0)) * (1 - col), P.blue0, P.blue0);
  ctx.restore();

  ctx.save(); ctx.setTransform(Vc.s, 0, 0, Vc.s, Vc.tx, Vc.ty);
  const cu = clamp(st.cellU ?? 0), cue = smooth(cu);
  // planner frame: a thin cool line round the week (drawn out of the base line as the cells arrive)
  if (cu > 0) {
    const fr = new Path2D(); fr.roundRect(PL.x0 - 14, PL.y0 - 14, PL.cols * PL.cw + 28, PL.rows * PL.ch + 28, 12);
    ctx.save(); ctx.globalAlpha = sineIO(span(cu, .4, 1)) * (1 - sineIO(span(col, 0, .5))); ctx.strokeStyle = rgba(B.COOL, .35); ctx.lineWidth = 2 / Math.max(.4, s) ; ctx.stroke(fr); ctx.restore();
  }
  // the coins / cells
  const emp = st.empty, n = 100;
  for (let k = 0; k < n; k++) {
    const up = st.coinUp == null ? 1 : expoOut(clamp((st.coinUp - (9 - Math.floor(k / 10)) * .055 - (k % 10) * .012) / .45));
    if (up <= 0) continue;
    const [x0, y0] = coinXY(k), ci = coinCell(k), [x1, y1] = cellXY(ci);
    const yy0 = lerp(BASE_Y, y0, up);
    const gold = k === GOLD[0] ? st.gold[0] : k === GOLD[1] ? st.gold[1] : 0;
    if (cu <= 0) {
      const r = COIN_R * (.4 + .6 * up);
      if (gold > .05) halo(ctx, x0, yy0, r * 5, .5 * gold, P.halo1, P.halo0);
      gridCoin(ctx, x0, yy0, r, gold);
      continue;
    }
    if (DUP[k] && cu >= 1) continue;   // the two extra coins lie under their neighbours by now
    // the coin slides to its cell and squares off (each with a small delay by its distance)
    const d = Math.hypot(x1 - x0, y1 - y0), uu = sineIO(clamp((cu - d / 2600) / .75));
    const x = lerp(x0, x1, uu), y = lerp(y0, y1, uu), w = lerp(2 * COIN_R, PL.w, uu), h = lerp(2 * COIN_R, PL.h, uu), r = lerp(COIN_R, 7, uu);
    const e = emp ? emp[ci] : 0;
    if (ci === HOUR && st.hourOff) continue;
    if (col > 0 && ci !== HOUR) {   // the week folds into its one saved hour (c13: "time never arrives on its own")
      const [hx, hy] = cellXY(HOUR), d2 = Math.hypot(x - hx, y - hy) / 700, cc = sineIO(clamp((col - .35 * d2) / .65));
      if (cc >= 1) continue;
      cell(ctx, t, lerp(x, hx, cc), lerp(y, hy, cc), w * (1 - cc), h * (1 - cc), r * (1 - cc), e, 0, s);
      continue;
    }
    cell(ctx, t, x, y, w, h, r, e, gold * (1 - uu), s);
  }
  // the tasks that want into the empty hour (cool chips sliding from their cells; pushed back by the guard)
  for (const ch of st.chips || []) {
    if (ch.u <= 0) continue;
    const [ax, ay] = cellXY(ch.i), [bx, by] = cellXY(HOUR), u = ch.u;
    const x = lerp(ax, bx, u * .8), y = lerp(ay, by, u * .8);
    ctx.save(); ctx.shadowColor = rgba(P.night0, .6); ctx.shadowBlur = 10;
    ctx.fillStyle = lin(ctx, 0, y - PL.h / 2, 0, y + PL.h / 2, [[0, mixHex(B.COOL, P.cream, .45)], [1, B.COOL]]);
    ctx.fill(cellPath(x, y - 4 * u, PL.w * .92, PL.h * .86, 6)); ctx.restore();
  }
  // the guard: a warm ring breathes out from the hour
  if ((st.guard ?? 0) > 0) {
    const [hx, hy] = cellXY(HOUR), g = expoOut(st.guard), gr = 1 - st.guard;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, .9 * gr); ctx.lineWidth = 3 / s; ctx.shadowColor = rgba(P.halo1, gr); ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.roundRect(hx - PL.w / 2 - 8 - 70 * g, hy - PL.h / 2 - 8 - 70 * g, PL.w + 16 + 140 * g, PL.h + 16 + 140 * g, 10 + 40 * g); ctx.stroke(); ctx.restore();
  }
  ctx.restore();
  // the empty hours are the warm light of the wall (screen-space glow, so it reads at any distance)
  if (emp) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < N_CELLS; i++) if (emp[i] > 0 && !(i === HOUR && st.hourOff) && !(col > 0 && i !== HOUR)) { const [x, y] = toS(c, ...cellXY(i)); halo(ctx, x, y, (i === HOUR ? 120 : 60) * Math.max(.5, s), (i === HOUR ? .4 : .16) * emp[i], P.halo1, P.halo0); }
    ctx.restore();
  }

  // ---- the floor (a line of light from your feet), and on it the years (c12's last words) ----
  const fy = FLOOR_Y * s + c.ty, fu = st.floorU ?? 0;
  if (fu > 0) {
    const [dx] = toS(c, DU_X, 0), xl = toS(c, xYear(TL.y0), 0)[0], xr = toS(c, xYear(TL.y1), 0)[0];
    ctx.save(); ctx.fillStyle = lin(ctx, 0, fy, 0, H, [[0, rgba(P.night0, .55 * fu)], [1, rgba(P.night0, .85 * fu)]]); ctx.fillRect(-200, fy, W + 400, H - fy + 240); ctx.restore();
    const pts = [[xl, fy, 2.5], [xr, fy, 2.5]], f0 = (dx - xl) / (xr - xl), k = sineIO(fu);
    K.trailSpan(ctx, pts, f0 * (1 - k), f0 + (1 - f0) * k, { w: 2.5, spark: fu < 1 });
  }
  const tu = st.ticksU ?? 0;
  if (tu > 0) yearTicks(ctx, t, c, fy, tu, st.ticksOut ?? 0);

  // ---- you: under the wall, looking up at the hour; one arm up to guard it ----
  const [dx, dy] = toS(c, st.duX ?? DU_X, FLOOR_Y);
  if (dy - DU_H * s < H + 20 && !st.duOff) {
    const look = st.duLook ?? 0, arm = st.duArm ?? 0;
    E.du(ctx, dx, dy, DU_H * s, { dir: 1, look: .25 + .75 * look, lean: -.03 * look, light: 1, back: .25,
      armR: [lerp(.15, 2.25, arm), lerp(.1, 2.55, arm)], armL: [-.15, -.08], ...(st.duO || {}) });
  }
}

// the cells: cool = a filled hour; empty → the fill drains to the bottom, a warm outline and a soft warm glow inside
function cell(ctx, t, x, y, w, h, r, e, gold, s) {
  const p = cellPath(x, y, w, h, r);
  ctx.save();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fill(p);
  if (e < 1) {
    ctx.save(); ctx.clip(p); ctx.beginPath(); ctx.rect(x - w, y - h / 2 + h * e, 2 * w, h); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, y - h / 2, 0, y + h / 2, [[0, mixHex(B.COOL, P.blue1, .2)], [.55, mixHex(B.COOL, P.blue1, .42)], [1, mixHex(B.COOL, P.blue1, .7)]]); ctx.fill(p);
    if (e > 0) { ctx.fillStyle = rgba(P.core1, .7); ctx.fillRect(x - w, y - h / 2 + h * e - 1.5, 2 * w, 3); }   // the falling edge of the fill
    ctx.restore();
  }
  if (gold > 0) { ctx.globalAlpha = gold; ctx.fillStyle = rad(ctx, x - w * .2, y - h * .3, Math.max(w, h), [[0, P.core0], [.5, P.halo0], [1, P.halo1]]); ctx.fill(p); ctx.globalAlpha = 1; }
  if (e > 0) {
    ctx.save(); ctx.clip(p); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, x, y - h * .2, Math.max(w, h) * .75, [[0, rgba(P.halo0, .8 * e)], [.55, rgba(P.halo1, .6 * e)], [1, rgba(P.shade0, .45 * e)]]); ctx.fill(p); ctx.restore();
    ctx.strokeStyle = rgba(P.halo0, .95 * e); ctx.lineWidth = 2.6 / s; ctx.shadowColor = rgba(P.halo1, .9); ctx.shadowBlur = 12 * e; ctx.stroke(p);
  }
  ctx.restore();
}

// decades as small ticks, half-centuries taller, centuries labelled; they light up as a spark runs left from your feet
function yearTicks(ctx, t, c, fy, u, out = 0) {
  const yR = 2020, yL = TL.y0, xr = toS(c, xYear(yR), 0)[0], xl = toS(c, xYear(yL), 0)[0], head = lerp(xr + 30, xl - 10, sineIO(u));
  for (let yr = yR; yr >= yL; yr -= 10) {
    const x = toS(c, xYear(yr), 0)[0]; if (x < head) continue;
    const k = clamp((x - head) / 120), big = yr % 50 === 0, cent = yr % 100 === 0;
    const hh = (cent ? 22 : big ? 14 : 8) * expoOut(k) * (1 - out); if (hh <= .2) continue;
    ctx.save(); ctx.strokeStyle = rgba(cent ? P.halo0 : B.COOL, cent ? .95 : .6); ctx.lineWidth = cent ? 2.4 : 1.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, fy + 6); ctx.lineTo(x, fy + 6 + hh); ctx.stroke(); ctx.restore();
    if (cent) B.label(ctx, String(yr), x, fy + 78, clamp((x - head) / 160) * (1 - out), { col: P.halo2, glow: false });
  }
  if (u < 1) halo(ctx, head, fy, 34, .8);
}
