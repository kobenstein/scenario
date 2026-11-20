// c07 · STUB (lead, 20.11.): the builder replaces this file (docs/BRIEF-builders.md, docs/shots.md). Until then: one sentence card per
// spoken sentence (lib/stub.mjs).
import { stubChunk } from '../lib/stub.mjs';
import * as S from '../lib/f66_world.mjs';
import * as F from '../lib/f66_kit.mjs';
const IN = null, OUT = null, END = false;
export default async (T, R) => {
  const hi = END ? T.duration - 15 : OUT ? R.b - S.SEAM_HALF : R.b, lo = IN ? R.a + S.SEAM_HALF : R.a;
  const out = stubChunk(T, R).filter((e) => e.t < hi).map((e) => ({ ...e, t: Math.max(e.t, lo) }));
  if (IN) out.unshift({ t: R.a, draw: (ctx, t) => S[IN](ctx, t, T), print: F.PRINT66 });
  if (OUT) out.push({ t: R.b - S.SEAM_HALF, draw: (ctx, t) => S[OUT](ctx, t, T), print: F.PRINT66 });
  if (END) out.push({ t: T.duration - 15, draw: (ctx, t) => S.endScreen(ctx, t, T), print: F.PRINT66 });
  return out;
};
