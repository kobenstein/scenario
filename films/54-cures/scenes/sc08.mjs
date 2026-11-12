// c08 · B2 · the blood test · why a date? the stage · C5 (audio only) · ★ THE GLASS PIPELINE · the label (5.08–6.05)
// One continuous take with c06–c09: the draw function lives in lib/f54_b2_take.mjs (shot table there), so the inner chunk
// boundaries are the same picture by construction. Anchors: phrases only. In: S.plateMind (c06) · out: S.plateKiosk (c09).
import * as F from '../lib/f54_kit.mjs';
import { take } from '../lib/f54_b2_take.mjs';

export default async (T, R) => [{ t: R.a, draw: take(T).draw, print: F.PRINT54 }];
