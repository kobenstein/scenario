// Film 71 · stub chunks (until a builder replaces scenes/scNN.mjs): one stub card per sentence (lib/stub.mjs), plus the seam plates at the
// group boundaries (±S.SEAM_HALF, lib/f71_world.mjs plateRow) and the end screen in the last 15 s, so the whole film renders end to end and
// the seams already hold. start / end = the rank n of the seam plate (11, 6, 1), endScreen = true for the last chunk.
import { stubChunk } from './stub.mjs';
import * as F from './f71_kit.mjs';
import * as S from './f71_world.mjs';
export function stub71(T, R, { start, end, endScreen } = {}) {
  let out = stubChunk(T, R).map((e) => ({ ...e, print: F.PRINT71 }));
  if (start) { out = out.map((e) => ({ ...e, t: Math.max(e.t, R.a + S.SEAM_HALF) })); out.unshift({ t: R.a, draw: (ctx, t) => S.plateRow(ctx, t, T, start), print: F.PRINT71 }); }
  if (end) { const t0 = R.b - S.SEAM_HALF; out = out.filter((e) => e.t < t0); out.push({ t: t0, draw: (ctx, t) => S.plateRow(ctx, t, T, end), print: F.PRINT71 }); }
  if (endScreen) { const t0 = T.duration - 15; out = out.filter((e) => e.t < t0); out.push({ t: t0, draw: (ctx, t) => S.endScreen(ctx, t, T), print: F.PRINT71 }); }
  return out.sort((p, q) => p.t - q.t);
}
