// c09 · A few hands on a heavy wheel · eight billion · billions of family decisions · use, refuse, vote · shiny: bigger or smaller?
// Builder B3. Plan: docs/shots.md 9.01–9.05. From plateWheel (B2 → B3, lib/f19_seams.mjs) at T.G('Right now, though'): pull back,
// the huge wheel in a quiet room, a few people at its rim (build · fund · rules land beside them) → it dips under the heavy load →
// ★ pull back: eight billion lights spread over the sheet → they fly up into the gold line as tiny arrows (family decisions), the
// same arrows on the light line → the kitchen lifts round the light line (you: phone up, face down, vote) → you walk to the shop window
// (shiny), the question card BIGGER OR SMALLER? pins on the glass.
// One entry (plan sequence). c09, c10 and c11 draw the SAME function (lib/f19_b3_world.mjs b3World) with the same t, so the
// B3-internal seams (c09→c10, c10→c11) are identical frames by construction.
import { b3World, PRINT } from '../lib/f19_b3_world.mjs';

export default async (T, R) => [{ t: R.a, draw: b3World(T), print: PRINT }];
