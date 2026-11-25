// Film 75 · stub chunks (until a builder replaces scenes/scNN.mjs): one stub card per sentence (lib/stub.mjs), plus the seam plates at the
// group boundaries (±S.SEAM_HALF) and the end screen in the last 15 s, so the whole film renders end to end and the seams already hold.
//   stub75(T, R, { start: 'plateSofa', end: 'plateClocks', endScreen: true })
import { stubChunk } from './stub.mjs';
import * as F from './f75_kit.mjs';
import * as S from './f75_world.mjs';
export function stub75(T, R, { start, end, endScreen } = {}) {
  let out = stubChunk(T, R).map((e) => ({ ...e, print: F.PRINT75 }));
  if (start) { out = out.map((e) => ({ ...e, t: Math.max(e.t, R.a + S.SEAM_HALF) })); out.unshift({ t: R.a, draw: (ctx, t) => S[start](ctx, t, T), print: F.PRINT75 }); }
  if (end) { const t0 = R.b - S.SEAM_HALF; out = out.filter((e) => e.t < t0); out.push({ t: t0, draw: (ctx, t) => S[end](ctx, t, T), print: F.PRINT75 }); }
  if (endScreen) { const t0 = T.duration - 15; out = out.filter((e) => e.t < t0); out.push({ t: t0, draw: (ctx, t) => S.endScreen(ctx, t, T), print: F.PRINT75 }); }
  return out.sort((p, q) => p.t - q.t);
}
