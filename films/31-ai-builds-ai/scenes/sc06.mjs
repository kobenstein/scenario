// c06 · Subscribe 1 (the foundry at work, the hall lights) · How fast? time left to agree on the rules → plateClimb · built by B1.
// The B1 group engine (one camera, one world, the hall, the climbing machine, the HUD) lives in scenes/sc02.mjs; this file is c06's
// explainer layer. The group hands over to B2 on S.plateClimb at "So don't take Anthropic's word" (WIDE_CAM creep, lamp on, rungs CLIMB, HUD).
//
// | ID   | anchor (phrase)                   | picture (one idea)                                                                | carrier → next |
// |------|-----------------------------------|-----------------------------------------------------------------------------------|----------------|
// | M.01 | This channel exists               | the foundry at work, wide (one take from 5.09); the HUD sinks; the hall windows    | the builders   |
// |      |                                   | light one by one (everybody) (engine)                                              |                |
// | M.02 | Including the part where machines | push in a little: the builders weld; the climbing machine climbs the last rungs   | the HUD        |
// |      |                                   | and goes into the core (machines building machines) (engine)                       |                |
// | 6.01 | How fast? For you                 | the HUD returns; a small gauge beside it, its needle trembles; card TIME LEFT TO   | plateClimb     |
// |      |                                   | AGREE ON THE RULES; both sink, the camera settles wide → plateClimb                |                |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f31_kit.mjs';
import { group } from './sc02.mjs';
const { P, rgba, clamp, lerp, span, sineIO, expoOut, halo } = E;
const { rise, FORGE } = F;
export default (T, R) => group(T, R);

const GA = { x: 610, y: 210, r: 82 };

export function layer(ctx, t, a, T, X) {
  if (t < a.hf - 1) return;
  const tEnd = a.Z - .5;
  // the gauge beside the HUD: its arc draws in, the needle trembles (no number: how fast is still open), it unwinds before the seam
  const gu = sineIO(span(t, a.hf + .2, a.hf + 1.4)) * (1 - sineIO(span(t, tEnd - 1.6, tEnd - .25)));
  if (gu > 0) {
    const { x, y, r } = GA, a0 = Math.PI, a1 = Math.PI + Math.PI * gu;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.cream, .22); ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke();
    ctx.strokeStyle = rgba(FORGE.body, .5); ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 1.25, Math.min(a1, Math.PI * 1.9)); if (a1 > Math.PI * 1.25) ctx.stroke();
    for (let k = 0; k <= 4; k++) { const an = Math.PI + k * Math.PI / 4; if (an > a1 + 1e-6) break; ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * r * .72, y + Math.sin(an) * r * .72); ctx.lineTo(x + Math.cos(an) * r * .84, y + Math.sin(an) * r * .84); ctx.stroke(); }
    const na = Math.PI * (1.15 + .5 * expoOut(gu)) + .07 * Math.sin(t * 9.1) * Math.sin(t * 2.3) + .04 * Math.sin(t * 13.7), nl = r * .9 * expoOut(gu);
    ctx.strokeStyle = FORGE.hot; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(na) * nl, y + Math.sin(na) * nl); ctx.stroke();
    halo(ctx, x + Math.cos(na) * nl, y + Math.sin(na) * nl, 16, .7, FORGE.halo, FORGE.core);
    ctx.fillStyle = FORGE.body; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
    const hu = span(t, a.hf + .5, a.hf + 1.2) * (1 - span(t, tEnd - 1.6, tEnd - 1.0));
    if (hu > 0) F.goldText(ctx, [['HOW FAST?', .8]], x, y + 48, 26, rise(hu), { serif: false, weight: 600, spacing: .12, align: 'center' });
    ctx.restore();
  }
  // the card: TIME LEFT TO AGREE ON THE RULES (a paper card that drops from the gauge on a gold thread, then rises away)
  const cu = span(t, a.rules - .6, a.rules + .4), co = sineIO(span(t, tEnd - 1.2, tEnd - .2));
  if (cu > 0 && co < 1) {
    ctx.save(); F.float(ctx, t, .5 * (1 - co));
    F.priceTag(ctx, t, GA.x + GA.r + 380, -20 - co * 520, ['TIME LEFT TO AGREE', 'ON THE RULES'], cu, { len: 230, size: 34 });
    ctx.restore();
  }
}
