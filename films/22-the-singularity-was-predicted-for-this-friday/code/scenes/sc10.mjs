// c10 · A test (1973) · options vs. choices · hold the rule up · say no · the tutor passes, the form fails
// Builder B3. Plan: docs/shots.md 10.01–10.06. The shop window goes dark as the candle 115 is struck (the light passes to the flame);
// the question card gets A TEST → the 1973 card drops in on its pin, the quote writes itself with the voice → OPTIONS struck, CHOICES
// ringed → the ring flies to a screen and becomes one of its identical buttons; your hand hovers, turns away, draws your own line →
// ★ the card turns into a vellum gauge held over an app and a law, the needle swings, NO stays lit → tutor ✓ | form ✗; the ✓ runs on.
// One entry (plan sequence). c09, c10 and c11 draw the SAME function (lib/f19_b3_world.mjs b3World) with the same t, so the
// B3-internal seams (c09→c10, c10→c11) are identical frames by construction.
import { b3World, PRINT } from '../lib/f19_b3_world.mjs';

export default async (T, R) => [{ t: R.a, draw: b3World(T), print: PRINT }];
