// c11 · Ending · every time the machine took a step, the human took one up · the step you take next · J6 · subscribe 2 · 15 s end screen
// second 'Every time the machine took a step' → end · built by B3 (draw: lib/f25_b3_main.mjs). Plan: docs/shots.md 11.01–11.06
//
// | ID     | anchor (phrase)                     | picture (one idea)                                                       | camera / layer       |
// |--------|-------------------------------------|--------------------------------------------------------------------------|----------------------|
// | 11.01  | Every time the machine took a step  | the K3 plate shrank into the stone of light: ROW1 fallen, one stands, you | push · ROW           |
// |        | … the human took one up             | beside it; the stone flares, you look up                                  |                      |
// | 11.02  | So the last human job isn't waiting | the camera glides along the fallen row to its end                         | truck right · ROW    |
// | 11.03  | It's the step you take next         | pull back: you take one step forward into the plain                      | pull back · ROW      |
// | 11.04  | [J6]                                | further along: Jakob beside his TOPIC stone; two figures, two lights      | truck right · ROW    |
// | 11.05  | This channel exists so that …       | subscribe 2: tiny lamps wake on the horizon                               | rise · ROW           |
// | 11.06  | END (15 s)                          | end screen: both lights bottom left, the right two thirds a quiet night;  | creep · ROW          |
// |        |                                     | stars, lamps, figures keep breathing                                      |                      |
import * as F from '../lib/f25_kit.mjs';
import { makeB3 } from '../lib/f25_b3_main.mjs';

export default async (T, R) => [{ t: R.a, draw: makeB3(T), print: F.PRINT25 }];
