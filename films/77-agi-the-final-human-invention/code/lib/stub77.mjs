// Film 77 · stub chunks (until a builder replaces scenes/scNN.mjs): one stub card per sentence (lib/stub.mjs), plus the seam plates at the
// group boundaries (±S.SEAM_HALF) and the end screen in the last 15 s, so the whole film renders end to end and the seams already hold.
//   export default async (T, R) => stub77(T, R, { start: 'plateBand', end: 'plateSample', endScreen: true })
import { stubChunk } from './stub.mjs';
import * as F from './f77_kit.mjs';
import * as S from './f77_seams.mjs';
export function stub77(T, R, { start, end, endScreen } = {}) {
  let out = stubChunk(T, R).map((e) => ({ ...e, print: F.PRINT77 }));
  if (start) { out = out.map((e) => ({ ...e, t: Math.max(e.t, R.a + S.SEAM_HALF) })); out.unshift({ t: R.a, draw: (ctx, t) => S[start](ctx, t, T), print: F.PRINT77 }); }
  if (end) { const t0 = R.b - S.SEAM_HALF; out = out.filter((e) => e.t < t0); out.push({ t: t0, draw: (ctx, t) => S[end](ctx, t, T), print: F.PRINT77 }); }
  if (endScreen) { const t0 = T.duration - 15; out = out.filter((e) => e.t < t0); out.push({ t: t0, draw: (ctx, t) => S.endScreen(ctx, t, T), print: F.PRINT77 }); }
  out.sort((p, q) => p.t - q.t);
  return out.filter((e, k) => !(out[k + 1] && Math.abs(out[k + 1].t - e.t) < 1e-6));
}
