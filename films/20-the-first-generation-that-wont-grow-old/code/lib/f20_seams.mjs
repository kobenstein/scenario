// Film 20 · the seam plates between the lead's and the builders' chunks (docs/MOTION.md §8, docs/BRIEF-builders.md).
// A plate is ONE fixed picture (fixed camera + fixed world state; only breathing, stars, the lamp's sway and the camera float move).
// The chunk before a seam ENDS on the plate for its last SEAM_HALF seconds, the chunk after it STARTS on the plate for its first
// SEAM_HALF seconds; both call the same function, so the hard cut between the two chunks is invisible. Never edit a plate alone:
// both neighbours depend on it (wishes to the lead).
//
//   plateYou   Lead → B1   at T.G('Aging looks like')         you from behind at the finish line you just reached, the track
//                                                             to the dial (needle 1.7, the push wedge), card WHY DO BODIES AGE?
//   plateEye   B1 → B2     at T.G('Yes. Earlier this year')   the hook's eye on the kitchen table under the lamp, risen, open
//   plateTrack B2 → B3     at T.G("The optimists' estimates") the wide track to the dial, needle 1.7, the finish line far away
import * as E from './f10_editorial.mjs';
import * as F from './f20_kit.mjs';
const { cam3, clamp } = E;

export const SEAM_HALF = .5;
// where the family stands on the track after c01 1.10 (Z on the ground; X = lane centres). Builders keep them there unless the
// story moves them (B3 may walk them on).
export const STOPS = { grand: 4800, parent: 5200, you: 6800, kid: 7400 };
export const famOnTrack = (o = {}) => F.FAMILY.map((f) => ({ who: f.who, X: f.X, Z: STOPS[f.who], view: 'back', dir: 1, light: 1, ...(o[f.who] || {}) }));
export const FIN_FAR = 26000;                                 // the finish line after it moved away (c01 1.12)
export const DIAL = { lit: 1, ticks: 1, num: 1, needle: 1.7, thr: 1 };
export const PUSH = { v0: 1.7, v1: 7, u: 1, cool: .6, label: 0 };

// ---- plateYou: close behind you (you on the right third, the dial huge behind, the lanes running to it)
export const YOU_CAM = cam3({ x: 62, y: 80, z: 5500 });
export const youState = () => ({ dial: { ...DIAL, push: { ...PUSH } }, track: { lit: 1, reach: 1, fin: FIN_FAR, finA: .7 }, fam: famOnTrack(), table: null, lamp: null });
export const Q_YOU = 'WHY DO BODIES AGE?';
export function plateYou(ctx, t) {
  F.scene20(ctx, YOU_CAM, t, youState());
  F.qcard(ctx, t, [[-100, Q_YOU]]);
}

// ---- plateEye: the eye risen out of the tabletop under the lamp, the family seated at the table edges (as c01 1.04)
export const EYE_CAM = F.camFor(0, -390, F.LAMP.Z, 1.8, 960, 500);
export const EYE_STATE = { rise: 1, open: 1, young: .55, look: [0, 0] };
export const famSeated = (o = {}) => F.FAMILY.map((f, i) => ({ who: f.who, X: f.X, Z: F.SEAT.Z, seat: 1, dir: i < 2 ? 1 : -1, light: i < 2 ? 1 : -1, look: .35, ...(o[f.who] || {}) }));
export function plateEye(ctx, t) {
  F.scene20(ctx, EYE_CAM, t, { dial: { ...DIAL, lit: .12, thr: 0 }, track: null, fam: famSeated(), table: { years: 1 }, lamp: { on: 1 },
    onTable: (cx, c, tt) => F.tableEye(cx, c, tt, EYE_STATE) });
}

// ---- plateTrack: the wide track from behind the family to the dial (needle 1.7, no wedge), the finish line far away
export const TRACK_CAM = cam3({ x: 0, y: -20, z: 1800 });
export const trackState = () => ({ dial: { ...DIAL }, track: { lit: 1, reach: 1, fin: FIN_FAR, finA: .7 }, fam: famOnTrack(), table: null, lamp: null });
export function plateTrack(ctx, t) { F.scene20(ctx, TRACK_CAM, t, trackState()); }

export const PLATES = { you: plateYou, eye: plateEye, track: plateTrack };
