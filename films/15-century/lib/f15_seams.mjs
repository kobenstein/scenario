// Film 15 · seam plates between the groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary, drawn in screen space (after the camera, before finish). The handing side
// steers its last move so the frame converges to the plate and draws the plate over everything for t in [T0 - .5, T0); the
// receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it. Both call it with the same t, so the
// frames on both sides of the cut come from one function: the seam is invisible by construction. Check with tools/seam.mjs.
//   lead → B1 at T.seg('s02').start (≈ 44.40, c02 → c03): plateCell · THE TUMOUR AS A TEXT. Nine rows of A C G T fill the night,
//            the middle row bright, a cool reading cursor at x 960; the rows drift left at CELL.v px/s (reading). The lead gets
//            here by flying through the "0" (approved: 0) whose hole already shows these rows. B1 keeps reading (genomeRows with
//            the same CELL numbers and cellShift(t)), then picks out the marks.
//   B1 → B2 at T.seg('s06').start (≈ 198.46, c06 → c07): plateDivide · ONE CELL, DIVIDING. A single living cell of warm light in the
//            middle of the night (split .8: a peanut with a clear waist, two nuclei), cool dust round it: "a human body takes the time it
//            takes … over years". B1 arrives here by pushing into one cell of the dividing tissue. B2: the cell finishes dividing,
//            the two daughter cells drift apart and become the two gold quotation marks of the June 2026 quote card.
//   B2 → B3 at T.seg('s12').start (≈ 380.30, c11 → c12): plateShot · THE SHOT, TRAVELLING. The twice-a-year HIV shot (a slim syringe
//            of light) lies across the middle, needle to the right, a fine gold trail behind it from the left edge: "how does
//            something that new travel that far, that fast?". B3: the shot clones into a row of copies ("cheaper copies"), the
//            price ($40) rises from their baseline.
//   Inside a group (optional, shared shapes): platePill (B1, c05 → c06 at T.seg('s05').start ≈ 157.32: the pill, split) and
//            plateReach (B2, c10 → c11 at T.seg('s11').start ≈ 331.00: the road of light). Use them or build your own carrier.
import { Path2D } from '@napi-rs/canvas';
import { W, H, P, rgba, rad, lin, drift, clamp, expoOut, halo, dust } from './f10_editorial.mjs';
import { genomeRows, pill, cell, syringe, COOL_HI } from './f15_kit.mjs';

export const SEAM_HALF = .5;                      // seconds each side draws the plate
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;

// --- lead → B1: the tumour as a text ---------------------------------------------------------------------------------------------
// the numbers B1 continues with (genomeRows(ctx, CELL.x, CELL.y, CELL.w, t, { rows, pitch, size, shift: cellShift(t), cursor: CELL.cursor }))
export const CELL = { T0: 44.40, x: -40, y: 556, w: 2000, rows: 9, pitch: 66, size: 34, v: 38, cursor: 962, seed: 15 };
export const cellShift = (t) => 480 + CELL.v * (t - CELL.T0);   // constant reading speed (mechanical: linear is allowed)
export function plateCellBg(ctx, t) {
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rad(ctx, 960, 540 + 6 * drift(t, 1, 3), 1250, [[0, P.ind1], [.45, P.ind0], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
}
// o.enter 0..1: the rows slide in from the right (only the lead uses < 1, inside the hole of the zero, before T0 - .5)
export function plateCell(ctx, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  plateCellBg(ctx, t);
  const enter = clamp(o.enter ?? 1), dx = (1 - expoOut(enter)) * 1300;
  genomeRows(ctx, CELL.x + dx, CELL.y, CELL.w, t, { rows: CELL.rows, pitch: CELL.pitch, size: CELL.size, shift: cellShift(t), seed: CELL.seed, cursor: enter >= 1 ? CELL.cursor : null, hi: 1 });
  ctx.restore();
}

// --- inside B1 (c05 → c06, optional): the pill, split ----------------------------------------------------------------------------------------------------
export const PILL = { T0: 157.32, x: 960, y: 520, w: 300, split: .55 };
export function platePill(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rad(ctx, 960, 560, 1200, [[0, P.ind1], [.5, P.ind0], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  const y = PILL.y + 5 * drift(t, 1, 7);
  pill(ctx, PILL.x, y, PILL.w, t, { split: PILL.split, lit: [1, .12], rot: .02 * drift(t * .7, 1, 2), dust: 600 });
  ctx.restore();
}

// --- inside B2 (c10 → c11, optional): the road of light --------------------------------------------------------------------------------------------------
export const ROAD = { T0: 331.0, horizon: 650, far: [1240, 650], near: [[60, 1080], [470, 1080]] };
export function plateReach(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, ROAD.horizon, [[0, P.night0], [.6, P.night1], [1, P.ind0]]); ctx.fillRect(0, 0, W, ROAD.horizon + 2);
  ctx.fillStyle = rad(ctx, ROAD.far[0], ROAD.horizon, 900, [[0, rgba(P.ind1, .9)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(0, 0, W, ROAD.horizon);
  ctx.fillStyle = lin(ctx, 0, ROAD.horizon, 0, H, [[0, P.ind2], [.25, P.night1], [1, P.night0]]); ctx.fillRect(0, ROAD.horizon, W, H - ROAD.horizon);
  ctx.fillStyle = rgba(P.blue0, .9); ctx.fillRect(0, ROAD.horizon - 1, W, 2);
  // the road: a warm strip narrowing to the far point (perspective), brightest near you, gold dust along it
  const [fx, fy] = ROAD.far, [[ax, ay], [bx, by]] = ROAD.near, br = 1 + .03 * Math.sin(t * 1.1);
  const road = new Path2D(); road.moveTo(ax, ay); road.lineTo(fx - 3, fy); road.lineTo(fx + 3, fy); road.lineTo(bx, by); road.closePath();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(28px)'; ctx.fillStyle = rgba(P.halo1, .35 * br); ctx.fill(road); ctx.restore();
  ctx.fillStyle = lin(ctx, 0, H, 0, fy, [[0, P.core1], [.5, P.halo0], [.9, P.halo1], [1, P.shade0]]); ctx.fill(road);
  halo(ctx, fx, fy, 70, .55 * br, P.halo1, P.core0);
  dust(ctx, 331, 900, (ax + fx) / 2 + 60, (ay + fy) / 2, 330, 120, t, .55, P.halo0, Math.atan2(fy - ay, fx - ax));
  ctx.restore();
}

// --- B1 → B2: one cell, dividing ------------------------------------------------------------------------------------------------
export const DIVIDE = { T0: 198.46, x: 960, y: 530, r: 250, split: .8, rot: -.08 };
export function plateDivide(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rad(ctx, 960, 540, 1250, [[0, P.ind1], [.5, P.ind0], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  dust(ctx, 198, 520, 960, 540, 900, 460, t, .45, COOL_HI);
  const y = DIVIDE.y + 4 * drift(t, 1, 5);
  cell(ctx, DIVIDE.x, y, DIVIDE.r, t, { split: DIVIDE.split, rot: DIVIDE.rot + .01 * drift(t * .5, 1, 9), dust: 500 });
  ctx.restore();
}

// --- B2 → B3: the shot, travelling -------------------------------------------------------------------------------------------------
export const SHOT = { T0: 380.30, x: 1010, y: 530, len: 640, trail: 720 };
export function plateShot(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rad(ctx, 1000, 560, 1300, [[0, P.ind1], [.5, P.ind0], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  const y = SHOT.y + 4 * drift(t, 1, 3), x0 = SHOT.x - SHOT.len * .52;
  // the trail: a fine gold line from the left edge into the plunger end, brighter towards the shot (how far it has come)
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = lin(ctx, 0, 0, x0, 0, [[0, rgba(P.halo1, 0)], [.6, rgba(P.halo1, .45)], [1, rgba(P.core1, .95)]]); ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(0, y + 26); ctx.bezierCurveTo(x0 * .45, y + 30, x0 * .8, y + 4, x0, y); ctx.stroke(); ctx.restore();
  dust(ctx, 380, 300, x0 * .55, y + 20, x0 * .45, 50, t, .5, P.halo0);
  syringe(ctx, SHOT.x, y, SHOT.len, t, { fill: .8, rot: .004 * drift(t * .6, 1, 7) });
  ctx.restore();
}
export { COOL_HI };
