// Film 18 · seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary, drawn in SCREEN space (after the cards, before the finish; the film-wide camera
// float and the finish apply on top for both sides alike). The handing side steers its last move so its frame converges to the plate
// and draws the plate over everything for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows
// its world out of it (the plate becomes a thing of the new world, never a blend). Both call it with the same t: the seam is invisible
// by construction. Check: tools/seam.mjs at T0 with both chunks (SECS=c01,c02 …), and node tools/seam_plates18.mjs <dir>.
//   Lead → B1 at T.G('At the end of') (c01 → c02): plateTag    INSIDE YOUR PRICE TAG. The face of your cooled tag fills the frame (cool
//            light, the printed border near the left and right edges, the number has run off).
//            B1 (2.01): pull back out of the face (it warms again as $20 prints): the tag hangs in the sky, prints "$20" and rides its thread down the falling price line.
//   B1 → B2  at T.G('And the value') (c04 → c05): plateHook   THE EMPTY HOOK. A thread hangs into the frame and ends in an empty eyelet
//            ring: the tag has left. Below it a column of warm light stands up from the bottom edge (the value that stayed).
//            B1 (4.07): the tags lift off and leave; push to the empty hook over the field. B2 (5.01): pull back, the column is the
//            value on your field; the search bar grows on it.
//   B2 → B3  at T.G('The second set of rules') (c08 → c09): plateRules   RULE CARD II, CLOSE. The card of light (Rules II · everybody
//            wins) fills the centre over the dark board. B2 (8.07): card II is drawn back out of the dark and turns to us; push in.
//            B3 (9.01): the card lays itself down onto the board; its loop glyph becomes the free road.
import { W, H, P, rgba, rad, lin, drift, mixHex, halo, clamp } from './f10_editorial.mjs';
import { tag, ruleCard, evap, COOL } from './f18_kit.mjs';
import * as E from './f10_editorial.mjs';

export const SEAM_HALF = .5;                      // seconds each side draws the plate
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
const night = (ctx, t) => {
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); ctx.fillRect(0, 0, W, H);
  E.stars(ctx, 1818, 90, t, [0, 0, W, H], .55);
};

// --- Lead → B1: your price tag, cooled, its number gone -----------------------------------------------------------------------------
// INSIDE the tag: its face fills the frame (eyelet above the frame at (TAG_PLATE.x, TAG_PLATE.y), width TAG_PLATE.w > the frame, so
// only the lit face with its printed border lines near the left/right edges shows). The handing side flies into its tag until it
// sits exactly here (same w, cool, sway .012·sin(1.3 t), no text); B1 pulls back out of the face and finds the tag in the sky.
export const TAG_PLATE = { x: 960, y: -560, w: 2120, cool: .9 };   // cool .9: the tag's light has gone (dim blue face)
export function plateTag(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  night(ctx, t);
  const T = TAG_PLATE, sw = .012 * Math.sin(t * 1.3);
  tag(ctx, t, T.x, T.y, T.w, { cool: T.cool, swing: sw, emit: () => .35, seed: 18 });
  ctx.restore();
}

// --- B1 → B2: the empty hook over the value that stayed --------------------------------------------------------------------------
export const HOOK_PLATE = { x: 960, y: 380, r: 22, colTop: 520, colW: 300 };
export function plateHook(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  night(ctx, t);
  const T = HOOK_PLATE, sx = T.x + 3 * Math.sin(t * 1.1);
  // the column of warm light (value), standing up from below the frame
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, T.x, H + 200, 900, [[0, rgba(P.halo1, .35)], [.5, rgba(P.blue0, .2)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  const cw = T.colW * (1 + .02 * Math.sin(t * 1.4));
  ctx.fillStyle = lin(ctx, T.x - cw / 2, 0, T.x + cw / 2, 0, [[0, rgba(P.halo1, 0)], [.2, rgba(P.halo0, .7)], [.5, P.core1], [.8, rgba(P.halo0, .7)], [1, rgba(P.halo1, 0)]]);
  ctx.beginPath(); ctx.moveTo(T.x - cw / 2, H + 10); ctx.lineTo(T.x - cw * .42, T.colTop + 40); ctx.quadraticCurveTo(T.x, T.colTop - 30, T.x + cw * .42, T.colTop + 40); ctx.lineTo(T.x + cw / 2, H + 10); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, T.colTop, 0, H, [[0, rgba(P.core0, .5)], [1, rgba(P.core0, 0)]]); ctx.fillRect(T.x - cw * .12, T.colTop, cw * .24, H - T.colTop); ctx.restore();
  evap(ctx, t, [[T.x - cw * .35, T.colTop + 30], [T.x + cw * .35, T.colTop + 30]], () => .4, { seed: 5, size: 3, rise: 260 });
  // the thread and the empty eyelet ring
  ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(T.x, -10); ctx.lineTo(sx, T.y - T.r); ctx.stroke();
  ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx, T.y, T.r, 0, 6.29); ctx.stroke();
  halo(ctx, sx, T.y, 70, .35, P.halo0, P.core1);
  ctx.restore();
}

// --- B2 → B3: rule card II, close --------------------------------------------------------------------------------------------------
export const RULES_PLATE = { x: 960, y: 520, w: 1040 };
export function plateRules(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  night(ctx, t);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 960, 1180, 1100, [[0, rgba(P.halo1, .18)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(0, 0, W, H); ctx.restore();
  ruleCard(ctx, t, RULES_PLATE.x + 2 * drift(t, 1, 5), RULES_PLATE.y, RULES_PLATE.w, { n: 'II', sub: 'everybody wins', glow: 1 + .05 * Math.sin(t * 1.2) });
  ctx.restore();
}
