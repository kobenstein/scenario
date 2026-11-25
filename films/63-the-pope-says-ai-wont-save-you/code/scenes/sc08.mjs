// c08 · builder B2: one shared continuous draw for c07–c09 (lib/f63_b2_film.mjs). Starts on S.plateYes, ends on S.plateStays.
import * as F from '../lib/f63_kit.mjs';
import { b2Draw } from '../lib/f63_b2_film.mjs';
export default async (T, R) => { const B = b2Draw(T); return [{ t: R.a, draw: (ctx, t) => B.draw(ctx, t), print: F.PRINT63 }]; };
