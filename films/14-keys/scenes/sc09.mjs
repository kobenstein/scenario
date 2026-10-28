// c09 · Finale + end screen (s19–s22 + ~15 s) · shots 9.01–9.12 · KEY ANCHOR 4 (the key ring) · lead.
// One plan sequence drawn by lib/f14_finale.mjs; it grows out of the seam plate plateScale (B3 → lead, lib/f14_seams.mjs).
import * as E from '../lib/f10_editorial.mjs';
import { finale, finaleAnchors, PRINT } from '../lib/f14_finale.mjs';
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: finale(finaleAnchors(T)), print: PRINT }]; };
