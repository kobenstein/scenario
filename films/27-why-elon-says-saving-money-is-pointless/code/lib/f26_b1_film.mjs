// Film 26 · B1 · the one draw function for c02–c04 (scenes/sc02.mjs … sc04.mjs each return ONE entry with it, starting at their chunk).
// One camera path (lib/f26_b1_core.mjs camB1) and one world state over the whole stretch, so the inner boundaries c02|c03 and c03|c04
// are the same continuous take by construction. Seams: plateCondition for t < T0 + .5 (Lead → B1), plateMailbox from T5 − .5 (B1 → B2).
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
import * as S from './f26_seams.mjs';
import { anchors, camB1, worldAt, wareWorld } from './f26_b1_core.mjs';
import { c02 } from './f26_b1_c02.mjs';
import { c03 } from './f26_b1_c03.mjs';
import { c04 } from './f26_b1_c04.mjs';

const DRAW = new WeakMap();
const { lerp, span, sineIO } = E;
// door 2.06|3.01 carries the test card: from the end of line 4 it already drifts towards its corner (right, up, smaller) while the camera
// rises (otherwise sky + a still card = frozen frames). The drift fades exactly as the kit's own corner slide lands: d · (1 − k).
function cardFloat(a, tt, t) {
  const f0 = a.advice + 1.3, t0 = a.write[3] + .7, t1 = tt.corner + 1.6;
  if (!(t > f0 && t < t1)) return null;
  const G = F.TEST, C = G.corner, k = t < tt.corner ? 0 : sineIO(span(t, tt.corner, t1));
  const d = (1 - (1 - span(t, t0, t1)) ** 1.5) * (1 - k);
  // while it is written it hangs in the sky and sways (a slow float that starts from rest and dies into the corner slide)
  const e = E.smooth(span(t, f0, f0 + 2.5)) * (1 - k), tf = t - f0;
  const fx = 26 * Math.sin(tf * .8) * e, fy = 15 * Math.sin(tf * 1.15 + .4) * e - 15 * Math.sin(.4) * e;
  const b = [lerp(960, C.x - G.w * C.s / 2, k), lerp(470, C.y + G.h * C.s / 2, k), lerp(1, C.s, k)];
  return { at: [b[0] + 170 * d + fx, b[1] - 60 * d + fy, b[2] * (1 - .1 * d + .012 * Math.sin(tf * .6) * e)] };
}
export function b1Draw(T) {
  if (DRAW.has(T)) return DRAW.get(T);
  const a = anchors(T), tt = F.testTimes(T);
  const draw = (ctx, t) => {
    if (t < a.b0 + S.SEAM_HALF) { S.plateCondition(ctx, t, T); return; }
    if (t >= a.T5 - S.SEAM_HALF) { S.plateMailbox(ctx, t, T); return; }
    const c = camB1(a, t), world = worldAt(a, t);
    // the street as plateCondition left it (the older you at her window, the calendar on 2061, your lamp on)
    const st = { room: { page: 35, label: S.CAL_LABEL, gold: S.CAL_GOLD, who: 'older', piggy: false, lit: 1, fig: { look: .05 * Math.sin(t * .9), lean: .1 } } };
    const w = {};
    const L = { field: [], mid: [], front: [], screen: [] };
    c02(a, t, st, L, c, world); c03(a, t, w, L, c, world); c04(a, t, st, w, L, c, world);
    const run = (list) => (ctx2, cc) => { for (const f of list) f(ctx2, cc); };
    if (world === 'ware') wareWorld(ctx, c, t, { ...w, field: run(L.field), mid: run(L.mid), front: run(L.front) });
    else S.streetWorld(ctx, c, t, { ...st, field: run(L.field), mid: run(L.mid), front: run(L.front) });
    for (const f of L.screen) f(ctx, c);
    F.testCard(ctx, t, T, st.tc || w.tc || cardFloat(a, tt, t) || {});
    for (const f of L.top || []) f(ctx, c);
  };
  DRAW.set(T, draw); return draw;
}
