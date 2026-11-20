// Film 24 · B2 · the stretch that straddles c06 | c07: the whole night map with all pins lit, the tablet's empty middle has become the
// [translating…] bar; the cursor waits. Called by BOTH sc06 and sc07 with the same (t, T) (boundary T.G('Why is meaning so hard')).
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import * as B from './f24_b2_world.mjs';
const { W, H, P, clamp, lerp, span, sineIO } = E;

export const WORLD = F.mapView(-28, 22, 1.18);
export const BAR_AT = [960, 540];
export function wallTimes(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.machines = G('But the machines'); a.names = G('names', a.machines); a.feelingsW = G('feelings', a.machines);
  a.going = G("even what's going on", a.machines); a.goingE = GE("even what's going on", a.machines);
  a.notone = G('Not one of them can tell'); a.single = G('single call says', a.notone); a.singleE = GE('single call says', a.notone);
  a.why = G('Why is meaning so hard');
  a.wv0 = a.machines - .15; a.wv1 = a.wv0 + 2.7;          // the pull back onto the whole world
  a.tm0 = a.goingE - .35; a.tm1 = a.tm0 + 1.8;            // the tablet glides to the centre
  a.bm0 = a.tm1 + .05; a.bm1 = a.bm0 + 1.5;               // its empty middle widens into the bar, the slab sinks away
  return a;
}
export const worldView = (t, a) => B.crept(WORLD, 1 + .014 * Math.max(0, t - a.wv1));
export const fieldDim = (t, a) => .5 * sineIO(span(t, a.tm0, a.bm1));
// the map behind the bar (also the explainer field of c07): o { dim, pulse, calls }
export function barMap(ctx, t, T, a, o = {}) {
  const v = worldView(t, a);
  F.map(ctx, t, v, { calls: o.calls ?? .32, dim: o.dim ?? fieldDim(t, a), callA: o.callA });
  return { v, hd: F.pins(ctx, t, T, v, { pulse: o.pulse, labels: o.labels, hide: o.hide, grow: o.grow }) };
}
// the bar (born from the tablet's MEANING slot: same centre, slot width → bar width). o { w, u, x, y }
export function bar(ctx, t, a, o = {}) {
  const w = o.w ?? lerp(262, 600, sineIO(span(t, a.bm0 + .5, a.bm1)));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const r = F.transBar(ctx, t, o.x ?? BAR_AT[0], o.y ?? BAR_AT[1], { w, u: o.u ?? 1, text: o.text, typed: o.typed });
  ctx.restore();
  return r;
}
