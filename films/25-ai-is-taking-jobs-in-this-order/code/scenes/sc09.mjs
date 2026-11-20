// c09 · No. 1 where we want a human · chess: beaten for 30 years, bigger than ever · the crowd comes for the humans · three amber
// stones (sits with you · signs off · decides) · COULD, but we want a person · the one we won't hand over
// "Number one isn't" → 'So how do you stay' · built by B3 (draw: lib/f25_b3_main.mjs, one take for c08–c11). Plan: docs/shots.md 9.01–9.08
//
// | ID    | anchor (phrase)                    | picture (one idea)                                                          | camera / layer        |
// |-------|------------------------------------|-----------------------------------------------------------------------------|-----------------------|
// | 9.01W | Number one isn't                   | out of No. 1's light (door W2 from TOPIC): No. 1 · WHERE WE WANT A HUMAN; rail gold | out of light · ROW |
// | 9.02  | It's the one where we want a human | you walk in and stand beside No. 1, look up on "On purpose"                  | push · ROW            |
// | 9.03  | Computers have beaten …            | a chess glyph lights on No. 1's face and lifts into the sky onto a board; a cool | tilt up · EXPL     |
// |       |                                    | bead drops and topples the piece; 1997 + source KASPAROV                     |                       |
// | 9.04  | And chess has never been bigger    | the piece stands again, two players walk in; ≈10 MILLION A DAY: a field of   | pull back · EXPL      |
// |       |                                    | tiny figures spreads from the board; source CHESS.COM                        |                       |
// | 9.05  | Machines play each other too       | the bead clones at an empty board; the crowd turns away and gathers round the | hold · MIX           |
// |       | The crowds come for the humans     | two people                                                                  |                       |
// | 9.06  | It's the person who sits with you  | a light line runs right; three amber stones stand up on their words          | truck right · EXPL    |
// | 9.07  | Those aren't tasks a machine can't | cool dashed outlines: COULD; on "we want a person" they glow warmer          | push · EXPL           |
// | 9.08  | The last human job isn't the one   | the three stones fly down into No. 1; No. 1 and you alone                    | tilt down · ROW       |
import * as F from '../lib/f25_kit.mjs';
import { makeB3 } from '../lib/f25_b3_main.mjs';

export default async (T, R) => [{ t: R.a, draw: makeB3(T), print: F.PRINT25 }];
