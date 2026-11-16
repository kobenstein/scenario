// c03 · B1 · one plan sequence with c03–c05 (lib/f23_b1.mjs): the chunk returns the shared draw, so the inner seams are identical frames.
import { b1 } from '../lib/f23_b1.mjs';
export default (T, R) => [{ t: R.a, draw: b1(T).draw, tr: 'cut' }];
