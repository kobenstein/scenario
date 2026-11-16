// Film 19 · seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary, drawn in SCREEN space (after the world, before the finish; the film-wide camera
// float and the finish apply on top for both sides alike). The handing side steers its last move so its frame converges to the plate
// and draws the plate over everything for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows
// its world out of it (the plate becomes a thing of the new world, never a blend). Both call it with the same t: the seam is invisible
// by construction. Check: tools/seam.mjs at T0 with both chunks (SECS=c01,c02 …), and node tools/seam_plates19.mjs <dir>.
//   Lead → B1 at T.G('In a lab') (c01 → c02): plateClock   THE CELL'S CLOCK. Top view into the dish (the dish field, rim faint, no net):
//            one round blood cell in the centre, a clock ring round it, the hands turning BACKWARD at a constant rate.
//            B1 (2.01): the clock keeps turning back, the cell warms and becomes the stem cell; the ring opens into its fan of futures.
//   B1 → B2  at T.G('It comes down to a number') (c05 → c06): plateRack   THE RACK. The living rack in the dark aisle, front view, all
//            twenty drawers shut, gold seams breathing; drawer 11 (the box that just slid back in) a little brighter.
//            B1 (5.07): the box slides back into the rack, pull back onto RACK_PLATE_CAM. B2 (6.01): push past the rack to you: "a number
//            inside your head".
//   B2 → B3  at T.G('First, how big') (c08 → c09): plateNet   THE NET, MACRO. Top view deep in a dish: the gold net huge, one soma in the
//            exact centre glowing (a single spark flickers), the rest dimmed. B2 (8.07): fly down into the dish. B3 (9.01): pull back
//            out: the net shrinks into the box's window, the box stands on the size ladder.
import { W, H, P, rgba, rad, lin, mixHex, clamp } from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
import * as E from './f10_editorial.mjs';

export const SEAM_HALF = .5;                      // seconds each side draws the plate
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
const night = (ctx) => { ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H); };

// --- Lead → B1: the cell's clock ---------------------------------------------------------------------------------------------------
// the dish field (centre 960/540, r 470, chip .5, electrodes .25, no net); the cell (kind 'blood', warm .3, r 92) with its clock ring
// (R = 2.7 r) and the minute hand at CLOCK_PLATE.hand(t) (turning back: −1.6 rad/s); hour hand = minute / 12.
export const CLOCK_PLATE = { cx: 960, cy: 540, r: 470, cellR: 92, warm: .3, clockR: 2.7, hand: (t) => -1.6 * t };
export function plateClock(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  night(ctx);
  const C = CLOCK_PLATE;
  F.dish(ctx, t, F.fieldMap(C.cx, C.cy, C.r), { glow: .55, chip: .5, electrodes: .25, net: false, rim: .7 });
  F.cell(ctx, t, C.cx, C.cy, C.cellR, { kind: 'blood', warm: C.warm, clock: 1, clockR: C.clockR, hand: C.hand(t) });
  ctx.restore();
}

// --- B1 → B2: the rack -------------------------------------------------------------------------------------------------------------
export const RACK_PLATE_CAM = F.cam({ tx: 0, ty: 1120, tz: 0, d: 4300, p: -.05, f: 1500 });
export const RACK_PLATE = { glow: .6 };            // the seam of drawer F.OPEN a little brighter (the box just went back in)
export function plateRack(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const v = F.view(RACK_PLATE_CAM);
  F.hall(ctx, v, t, { pool: .25 });
  F.rack(ctx, v, t, { alive: 1, open: F.OPEN, slide: 0, glow: RACK_PLATE.glow });
  ctx.restore();
}

// --- B2 → B3: the net, macro -------------------------------------------------------------------------------------------------------
// the dish field at r 2400 around the centre soma (NET.centre sits exactly on 960/540); dim .65; that soma flickers (NET_PLATE.fire)
export const NET_PLATE = { r: 2400, dim: .65, ambient: .45, fire: (t) => .55 + .45 * Math.sin(t * 5.3) * Math.sin(t * 1.7) };
export function netPlateMap() { const [sx, sy] = F.NET.somas[F.NET.centre]; return F.fieldMap(960 - sx * NET_PLATE.r, 540 + sy * NET_PLATE.r, NET_PLATE.r); }
export function plateNet(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  night(ctx);
  const m = netPlateMap();
  F.dish(ctx, t, m, { glow: .7, chip: .5, electrodes: .2, rim: .5, net: { lit: 1, dim: NET_PLATE.dim, focus: F.NET.centre, ambient: NET_PLATE.ambient, w: .45, fire: (i) => (i === F.NET.centre ? NET_PLATE.fire(t) : 0) } });
  ctx.restore();
}
