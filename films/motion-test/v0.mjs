// v0: smoke test, rest camera, hard switches (not a version)
import { drawWorld, ROOF, CERTW, COASTW, uOf } from './worlds.mjs';
export function frame(ctx, t) {
  if (t < 3.4) drawWorld(ctx, ROOF, t, {});
  else if (t < 6.7) drawWorld(ctx, CERTW, t, {});
  else drawWorld(ctx, COASTW, t, {}, { p: { u: uOf(t) } });
}
