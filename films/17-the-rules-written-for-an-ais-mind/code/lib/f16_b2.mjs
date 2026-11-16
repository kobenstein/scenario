// Film 16 · builder B2 · c05–c08 (228.68 → 421.60) as ONE plan sequence over two stages:
//   S1 (lib/f16_b2_s1.mjs): out of plateButton → control room → the dial → the apology → push into the far light: the book closes
//   S2 (lib/f16_b2_s2.mjs): the closed book → the test diorama → 96 / 100 → the separate chart → the head → the backside → the stack →
//                           the pen → plateNib
// The stage switch happens on a frame that only shows the night sky (screen space) and the book (drawn in screen space from the same
// numbers by both stages), so it is invisible. Every chunk file (sc05 … sc08) returns this same draw function: the chunk boundaries
// inside the group are the same picture on both sides by construction.
import * as E from './f10_editorial.mjs';
import { anchorsS1, makeS1 } from './f16_b2_s1.mjs';
import { anchorsS2, makeS2 } from './f16_b2_s2.mjs';

const CACHE = new WeakMap();
export function b2(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial();
  const a1 = anchorsS1(T), s1 = makeS1(a1);
  const a2 = anchorsS2(T, a1), s2 = makeS2(a2, s1);
  const draw = (ctx, t) => (t < s1.tSwitch ? s1.draw(ctx, t) : s2.draw(ctx, t));
  const out = { draw, s1, s2, a1, a2 };
  CACHE.set(T, out);
  return out;
}
