// c02 · Hook II (s03, s04) · 2.01–2.03 (the dive into the keyhole, the giant file, the copy) = the lead's hook (lib/f14_hook.mjs);
// 2.04–2.06 (who can reach it, the rhyme glimpse) = B1. Both are ONE plan sequence: lib/f14_b1_station1.mjs draws the hook itself up
// to 'Researchers' (identical frame), then continues in its own replica of the inner world, through c03 and c04 to the plateScreen.
import * as E from '../lib/f10_editorial.mjs';
import { PRINT } from '../lib/f14_hook.mjs';
import { station1 } from '../lib/f14_b1_station1.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: station1(T), print: PRINT }]; };
