// c02 · Hook II (s03, s04) · built so far: 2.01–2.03 (the dive into the keyhole, the giant file, the copy) = the end of the style test.
// Same plan sequence as c01 (lib/f14_hook.mjs), so the seam at s03 is seamless. 2.04–2.06 (who can reach it, the rhyme glimpse) are
// the builders' (BRIEF-builders.md §1, B1): they continue from the last state of the hook (the file and its copy, camera inside).
import * as E from '../lib/f10_editorial.mjs';
import { hook, hookAnchors, PRINT } from '../lib/f14_hook.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: hook(hookAnchors(T)), print: PRINT }]; };
