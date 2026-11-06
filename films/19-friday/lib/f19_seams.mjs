// Film 19 · seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary. It is drawn with the kit itself (a fixed camera on THE SHEET plus a fixed state),
// so the handing side can converge onto it with its own world and the receiving side grows its world out of it. Both sides call it
// with the same t; the film-wide camera float and the finish apply on top for both alike. The handing side draws it for
// t ∈ [T0 − .5, T0), the receiving side for t ∈ [T0, T0 + .5). Check: SECS=c01,c02 node tools/seam.mjs --at T0, and
// node tools/seam_plates19.mjs <dir> for stills.
//   Lead → B1 at T.G('So what bent the first line') (c01 → c02): plateLines   THE TWO LINES. The whole 1960 page, wide: the red
//            line with its knee, the dashed formula up to ∞ and the slip FRI 13 NOV 2026, the light line shooting off the top on the
//            right, you tiny at the knee looking at it. c01 draws chart1960() with LINES_PLATE.st and pulls back onto LINES_PLATE.cam.
//            B1 (2.01): push from here into the knee; the question card drops in on its pin.
//   B1 → B2  at T.G('A date sounds precise') (c05 → c06): plateSlip   THE BLANK SLIP. The calendar slip close (pin at the top of the
//            frame), face FRI ?, on the lamp-lit night sheet with the cool spill of the light line. B1 (5.04): pull back out of the C3 frame
//            onto it. B2 (6.01): the ? page tears off on "precise": FRI 13 NOV 2026, then pull back.
//   B2 → B3  at T.G('Right now, though') (c08 → c09): plateWheel   THE EMPTY WHEEL. A steering wheel cut from indigo paper, close,
//            centred, lifted off the sheet (paper shadow), a big gold light behind it (the wheel in silhouette, its rim lit). B2 (8.04): fly through the doorway light; the light
//            resolves into the wheel. B3 (9.01): pull back: the wheel is huge, in a quiet room, a few hands on its rim.
import * as E from './f10_editorial.mjs';
import { PAL, ZS, sheet, chart1960, KNEE, slip, wheel, lifted, you, onSheet } from './f19_kit.mjs';
const { W, H, aim, rgba, rad, drift, camDrift } = E;

export const SEAM_HALF = .5;                      // seconds each side draws the plate
export const PLATE_DRIFT = .8;                    // the plates keep breathing: camDrift(PLATE.cam, t, PLATE_DRIFT); converge with the same drift amount
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;

// --- Lead → B1: the two lines, wide -------------------------------------------------------------------------------------------------
export const LINES_PLATE = {
  cam: aim(ZS, 1900, -110, .54),
  sheet: { lamp: [1450, 250], lampR: 2300, dim: .32, cool: [2450, -250, 1700, .8] },
  st: { mast: 1, axes: 1, pplLab: 1, fu: 1, dash: 1, cap: 0, ppl: 0, ru: 2026, ahead: 0, inf: 1, now: 1, r60: 0, ai: 1, aiLab: 1, aiSpill: 0,
    slip: { day: 'FRI', num: '13', mon: 'NOV 2026' } },
  you: { h: 110, o: { dir: 1, look: .55, light: 1 } },          // at the knee, facing the light line, its cool rim (rim set in the plate)
};
export function youAtKnee(ctx, t, o = {}) {
  const br = Math.sin(t * 1.6) * .03;
  return you(ctx, KNEE.x, KNEE.y, LINES_PLATE.you.h, { ...LINES_PLATE.you.o, rim: PAL.cool1, armR: [.12 + br, .08], armL: [-.14 - br, -.06], ...o });
}
export function plateLines(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const c = camDrift(LINES_PLATE.cam, t, PLATE_DRIFT);
  sheet(ctx, c, t, LINES_PLATE.sheet);
  chart1960(ctx, c, t, LINES_PLATE.st);
  onSheet(ctx, c, () => youAtKnee(ctx, t));
  ctx.restore();
}

// --- B1 → B2: the blank slip, close -----------------------------------------------------------------------------------------------
export const SLIP_PLATE = { x: 2610, y: -1150, w: 190, cam: aim(ZS, 2610, -1000, 3.1, W / 2, H * .5), face: { day: 'FRI', q: true, cool: true, mon: 'NOV 2026' } };
export function plateSlip(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const c = camDrift(SLIP_PLATE.cam, t, PLATE_DRIFT);
  sheet(ctx, c, t, { lamp: [2500, -900], lampR: 1600, dim: .1, cool: [2620, -700, 900, .55] });
  onSheet(ctx, c, () => slip(ctx, t, SLIP_PLATE.x, SLIP_PLATE.y, SLIP_PLATE.w, SLIP_PLATE.face));
  ctx.restore();
}

// --- B2 → B3: the empty steering wheel, close -------------------------------------------------------------------------------------
export const WHEEL_PLATE = { x: 960, y: 1900, r: 330, cam: aim(ZS, 960, 1900, 1.15) };
export function plateWheel(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const c = camDrift(WHEEL_PLATE.cam, t, PLATE_DRIFT), P = WHEEL_PLATE;
  sheet(ctx, c, t, { lamp: [960, 1700], lampR: 1300, dim: .05 });
  onSheet(ctx, c, () => { const R = P.r * 1.75 * (1 + .015 * Math.sin(t * .9)); ctx.fillStyle = E.rad(ctx, P.x, P.y, R, [[0, rgba(PAL.gold1, .62)], [.42, rgba(PAL.gold2, .3)], [1, rgba(PAL.gold2, 0)]]); ctx.fillRect(P.x - R, P.y - R, R * 2, R * 2); });   // the warm light the empty wheel stands in
  lifted(ctx, c, .7, () => wheel(ctx, t, P.x + drift(t, 2, 3), P.y, P.r, { turn: .02 * Math.sin(t * .8) }));
  ctx.restore();
}
