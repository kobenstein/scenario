// c07 · B2 · ALZHEIMER'S: 20 years early, the street of today, the cohort and the tally, A4 failed, "difficult to reverse", C1, ✗ (5.01–5.07)
// One continuous take with c06–c09: the draw function lives in lib/f54_b2_take.mjs (shot table there), so the inner chunk
// boundaries are the same picture by construction. Anchors: phrases only. In: S.plateMind (c06) · out: S.plateKiosk (c09).
import * as F from '../lib/f54_kit.mjs';
import { take } from '../lib/f54_b2_take.mjs';

export default async (T, R) => [{ t: R.a, draw: take(T).draw, print: F.PRINT54 }];
