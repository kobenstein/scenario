// Film 78 · B1 (c02–c06, 'So what was in those pages' → 'That is why this channel exists') as ONE continuous take:
// one camera (S.camPath2 keys on phrases from every part), one stage, the parts (lib/b1_c02.mjs … b1_c06.mjs) draw their rows when
// their time has come. The chunk files (scenes/sc02.mjs … sc06.mjs) each return the same take for their range, so every inner chunk
// boundary is the same continuous picture (no seam to match). Group seams: S.plateHook for [T0, T0 + .5) and S.plateRecord for
// [T1 − .5, T1) are separate entries (see takeEntries).
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
import * as S from './f78_world.mjs';
import c02 from './b1_c02.mjs';
import c03 from './b1_c03.mjs';
import c04 from './b1_c04.mjs';
import c05 from './b1_c05.mjs';
import c06 from './b1_c06.mjs';
const { W, H, clamp, span } = E;

const CACHE = new WeakMap();
export function take(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const T0 = T.G('So what was in those pages'), T1 = T.G('That is why this channel exists'), h = S.SEAM_HALF;
  const ctxB = { T, T0, T1, G: (p, n = 0, a = -1) => T.G(p, n, a), GE: (p, n = 0, a = -1) => T.GE(p, n, a) };
  const parts = [c02, c03, c04, c05, c06].map((f) => f(ctxB));
  // the camera: the plate creep on both ends (continuous with S.creep / S.trk), the parts' keys in between
  const k0 = S.creep(T0 + h, T, 'So what was in those pages'), k1 = 1 + S.CREEP;   // at T1 - h the plate starts at k = 1
  const K = [[T0 - h, { x: W / 2, y: H / 2, s: 1 }], [T0 + h, { x: W / 2 + S.trk(k0) * .5, y: H / 2, s: k0 }]];
  for (const p of parts) for (const k of p.keys) if (k[0] > T0 + h + .05 && k[0] < T1 - h - .05) K.push(k);
  K.push([T1 - h, { x: W / 2, y: H / 2, s: 1 }], [T1 + h, { x: W / 2 + S.trk(k1) * .5, y: H / 2, s: k1 }]);
  K.sort((a, b) => a[0] - b[0]);
  const cam = (t) => {
    const c = S.camPath2(t, K), amp = span(t, T0 + h, T0 + h + 2.5) * (1 - span(t, T1 - h - 2.5, T1 - h));
    return S.drift2(c, t, .7 * amp, 21);
  };
  const dawn = (t) => Math.max(0, ...parts.map((p) => (p.dawn ? p.dawn(t) : 0)));
  const draw = (ctx, t) => {
    const c = cam(t);
    S.stage(ctx, t, c, { dawn: dawn(t) });
    for (const p of parts) { S.view(ctx, c); ctx.save(); p.draw(ctx, t, c); ctx.restore(); }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
  const out = { draw, cam, T0, T1, K };
  CACHE.set(T, out);
  return out;
}
// the entries for one chunk: the take for its range, plus the plates at the group seams
export function takeEntries(T, R) {
  const tk = take(T), h = S.SEAM_HALF, out = [];
  if (Math.abs(R.a - tk.T0) < 1e-6) { out.push({ t: R.a, draw: (ctx, t) => S.plateHook(ctx, t, T), print: F.PRINT78 }); out.push({ t: R.a + h, draw: tk.draw, print: F.PRINT78 }); }
  else out.push({ t: R.a, draw: tk.draw, print: F.PRINT78 });
  if (Math.abs(R.b - tk.T1) < 1e-6) out.push({ t: R.b - h, draw: (ctx, t) => S.plateRecord(ctx, t, T), print: F.PRINT78 });
  return out;
}
