// Film 16 · builder B3 · c09 + c10 + c11 (+ end screen) as ONE continuous take: 421.60 → 582.80.
// sc09 / sc10 / sc11 each return one entry that draws this same function, so the chunk seams (c09|c10 at "Could the rules", c10|c11
// at "So, can you give") are identical frames by construction. Inside, three worlds are joined by flights into a surface:
//   plateNib (B2 → B3 seam, [T0, T0 + .5))  →  A  the writing room (lectern, writer, window, ballot)        f16_b3_room.mjs
//   A → B  flight into the sheet: the frame is pure paper on both sides (the same sheet drawn in plate coordinates)
//   B  the explainer night: the page of light, quote, money, critics, the second document, chain vs character, the beam,
//      the 1,000 points, the pen                                                                         f16_b3_docs.mjs
//   B → D  the pen rises in a close shot (only the pen, the hand and the shared sky in frame): the world below changes unseen
//   D  the ending: the tower of seven steps, the book, the head of light, the city, first light, the end screen  f16_b3_end.mjs
// Timing: every key from a phrase (lib/f16_b3_common anchors). Calm: one or two moves at a time, camera keys on words.
import * as E from './f10_editorial.mjs';
import * as K from './f16_kit.mjs';
import { plateNib, SEAM_HALF } from './f16_seams.mjs';
import { anchors } from './f16_b3_common.mjs';
import { room, S_A, PCA, plateToA } from './f16_b3_room.mjs';
import { docs } from './f16_b3_docs.mjs';
import { ending } from './f16_b3_end.mjs';
const { W, H, P, clamp, lerp, span, smooth, sineIO, expoIn, cam3, camAt, camDrift, aim, F0 } = E;

const CACHE = new Map();
export function b3(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const a = anchors(T);
  const A = room(a), B = docs(a);
  const T0 = a.T0, tA = T0 + SEAM_HALF;
  // ---------------------------------------------------------------- world A camera (world A coordinates)
  const PSW = [920, 250], S_SW = 7;                            // the flight into the sheet ends here (plate point at the screen centre)
  const tsA = a.bigword - .5;
  const KA = [
    [tA, aim(F0, PCA[0], PCA[1], S_A)],                                    // = plateNib
    [a.notTest + .5, aim(F0, 566, 452, 3.3)],                              // pull back, the sheet moves right: the stamp stands on the dark board
    [a.whoE + .75, aim(F0, 735, 505, 1.48)],                               // on: the page, the pen, the writer's hand
    [a.askellE, aim(F0, 742, 503, 1.53)],                                  // breathing hold (the name)
    [a.its + .3, aim(F0, 1160, 430, 1.12)],                                // behind her: the window, one company
    [a.millions + .7, aim(F0, 1175, 440, 1.04)],                           // slow pull back while the lights spread
    [a.voted + 1.3, aim(F0, 20, 700, 1.6)],                                // across the room: the ballot box and you
    [a.changing - .1, aim(F0, 26, 696, 1.66)],                            // hold
    [tsA, aim(F0, ...plateToA(...PSW), S_SW)],                             // flight into the sheet
  ];
  B.nibX = A.nibX;
  B.setSwitch(PSW, S_SW / S_A, tsA);
  const D = ending(a, B);                                                  // shares B's coordinates and continues B's camera list
  const KB = B.keys, KD = D.keys;
  const tsC = B.tsC;                                                       // B → D (pen close-up)

  const draw = (ctx, t) => {
    if (t < tA) { plateNib(ctx, t); return; }
    if (t < tsA) {
      const dA = smooth(span(t, tA, tA + 2.2)) * (1 - smooth(span(t, tsA - 1.2, tsA)));
      A.draw(ctx, t, camDrift(camAt(t, KA), t, .5 * dA));
    } else if (t < tsC) {
      B.draw(ctx, t, camDrift(camAt(t, KB), t, .8 * B.driftAmt(t)));
    } else {
      D.draw(ctx, t, camDrift(camAt(t, KD), t, .8 * D.driftAmt(t)));
    }
    // the level badge: 6 → the LEVEL 7 stamp after the plate; it sinks as the ending begins
    if (t < a.so) K.level(ctx, t, { n: 7, title: 'Who holds the pen', t0: tA + .55, from: 6 });
    else D.badgeOut(ctx, t);
    D.overlay(ctx, t);
  };
  CACHE.set(T, draw);
  return draw;
}
