// Film 24 · seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary, drawn in SCREEN space (after the world, before the finish; the film-wide camera
// float and the finish apply on top for both sides alike). The handing side steers its last move so its frame converges to the plate
// and draws the plate over everything for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows
// its world out of it (the plate becomes a thing of the new world, never a blend). Both call it with the same (t, T): the seam is
// invisible by construction. Check: tools/seam.mjs at T0 with both chunks (SECS=c01,c02 …), and node tools/kit_sheet24.mjs <dir>.
// All three plates are stations of the guiding image (Jakob 9.11.): the night map, and the barn of the hook.
//   Lead → B1 at T.G('Their A.I. can already') (c01 → c02): plateCalifornia   THE MAP ON CALIFORNIA. The night map at CA_VIEW, the
//            calls of every species at CA_CALLS, the gold ESP pin with its label up, the 2030 strip docked top right.
//            Lead (1.10): the push onto California ends exactly here. B1 (2.01): zoom into the gold pin: its medallion opens (iris)
//            onto the explainer field where the listener stands.
//   B1 → B2  at T.G('Now north, to Spain') (c04 → c05): plateNorth   THE MAP, KENYA TO SPAIN. The night map at NORTH_VIEW (Africa and
//            Europe), the Kenya pins (cream + gold Amboseli), the León pin growing on its own phrase, the tablet at TABLET_AT with
//            NAMES and WHAT'S GOING ON engraved, the strip docked. B1 (4.07): the chorus scene closes into the Amboseli pin
//            (iris) while the map pulls back onto NORTH_VIEW. B2 (5.01): the flight north to León, into the crow medallion.
// Plates keep a slow push (creep, CREEP = 3 %/s from T0 − .5): the receiving side continues it.
//   B2 → B3  at T.G('Now think back to those pigs') (c08 → c09): plateBarn   THE BARN OF THE HOOK. The barn at night (home camera
//            E.cam3()), both pigs at rest and alive, no you, no cards; the strip docked (it reads WHAT CHANGES?).
//            B2 (8.03): from the map, zoom into the Europe pig pin (iris) onto the barn. B3 (9.01): the slow push to pig 2, then on
//            "Today, going without meat …" the camera rises out of the barn.
import { W, H, P } from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';

export const SEAM_HALF = .5;                      // seconds each side draws the plate
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
// a plate is never frozen: it keeps a slow push (CREEP per second) that starts at T0 − SEAM_HALF from the plate's base values;
// the receiving side continues from creep(t) (the value at T0 + .5 is its first frame's value).
export const CREEP = .03;
export const creep = (t, T, phrase) => 1 + CREEP * Math.max(0, t - (T.G(phrase) - SEAM_HALF));
const zv = (v, k) => F.mapView(v.lon, v.lat, v.z * k);

// --- Lead → B1: the map on California ----------------------------------------------------------------------------------------------
export const CA_VIEW = F.mapView(-110, 33.5, 3.4);
export const CA_CALLS = .45;                       // the "every species" calls, calmer than in the world view
export function plateCalifornia(ctx, t, T) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const v = zv(CA_VIEW, creep(t, T, 'Their A.I. can already'));
  F.map(ctx, t, v, { calls: CA_CALLS });
  F.pins(ctx, t, T, v, { labels: { esp: 1 } });
  F.strip(ctx, t, T);
  ctx.restore();
}

// --- B1 → B2: the map, Kenya to Spain ----------------------------------------------------------------------------------------------
export const NORTH_VIEW = F.mapView(16, 21, 2.0);
export const TABLET_AT = { x: 330, y: 800, s: .4 };   // where the tablet sits on the map during the tour (c04–c06)
export const NORTH_TABLET = ['names', 'room'];
export function plateNorth(ctx, t, T) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const v = zv(NORTH_VIEW, creep(t, T, 'Now north, to Spain'));
  F.map(ctx, t, v, { calls: CA_CALLS });
  F.pins(ctx, t, T, v, { labels: { kenya: 0, amboseli: 0 } });
  F.tablet(ctx, t, T, TABLET_AT.x, TABLET_AT.y, TABLET_AT.s, { filled: NORTH_TABLET });
  F.strip(ctx, t, T);
  ctx.restore();
}

// --- B2 → B3: the barn of the hook -------------------------------------------------------------------------------------------------
export const BARN_CAM = F.cam3();
export function plateBarn(ctx, t, T) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  F.barnCast(ctx, F.aim(F.F0, W / 2, H / 2, creep(t, T, 'Now think back to those pigs')), t, { you: false });   // = BARN_CAM at T0 − .5
  F.strip(ctx, t, T);
  ctx.restore();
}
