// c07 · His own worry · out of plate67 (the gap, the headline with the post behind the veil): the words sink, the crack closes into a
// line; the camera lifts the post header up; the 1000x crop unrolls out of it (highlighter); the closed crack is a measuring tape at your
// feet: you = one unit, at "a thousand" the tape shoots out of the frame · the handover crop (highlighter) · ★ HANDOVER lifts out of the
// print in gold, alone in the dark · it glides down onto your town, the town hall's windows light → plateHandover (lead, 'Not like a coup').
// T.G('And behind that headline') → T.G('Not like a coup') · builder B2 · plan: docs/shots.md 6.01–6.03 · ONE entry, one camera.
//
// | ID    | anchor (phrase)            | picture (one idea)                                                              | carrier   | camera            |
// |-------|----------------------------|---------------------------------------------------------------------------------|-----------|-------------------|
// | 6.01  | And behind that headline   | crack closes into a tape; 1000x crop unrolls out of the post; tape shoots ×1000  | the tape  | lift · EXPL       |
// | 6.02★ | And he writes              | handover crop, highlighter; HANDOVER lifts out in gold, alone in the dark        | HANDOVER  | creep · EXPL      |
// | 6.03  | A handover. What would     | HANDOVER glides down over your town; the town hall's windows light → plate       | HANDOVER  | glide to TOWN_CAM |
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import * as B from '../lib/b2_extra.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth } = E;
const { GOLD, CREAM, rise } = F;
const GY = S.GY;
export const PRINT = F.PRINT67;

export default async (T, R) => {
  E.prepareEditorial();
  const A = R.a, G = (p) => T.G(p, 0, A);
  const a = { a: A, end: R.b };
  a.worried = G("Wang's own essay is worried"); a.control = G('keeping control'); a.thousand = G('a thousand times'); a.field = G('in every field');
  a.writes = G('And he writes'); a.notOk = G('We should not be okay'); a.ho1 = G('a handover of society'); a.ho2 = T.G('A handover', 1, A); a.what = G('What would that look like');
  return [{ t: A, draw: (ctx, t) => B.plate67(ctx, t, T), print: PRINT }, { t: A + S.SEAM_HALF, draw: scene(a, T), print: PRINT }];
};

const CAMX = (s = 1.05, v = 600) => E.aim(S.Z_HEAD, 960, v, s);
const CROPW = 1240, TAPE = { y: 812 }, HO = { x: 960, y: 470, size: 150 };
const HOPLATE = [S.HALL.x + 60, GY - 330, 74];
const dummy = createCanvas(8, 8).getContext('2d');

function scene(a, T) {
  const tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.4, t0 = a.a + S.SEAM_HALF;
  const c67 = (t) => { const k = S.creep(t, T, 'And behind that headline'); return B.CAM67(k, S.trk(k) * .3); };
  const creepTown = (t) => { const k = 1 + S.CREEP * (t - tPlate); return S.TOWN_CAM(k, S.trk(k) * .3); };
  const tA = t0 + .3;
  const K = [[tA, c67(tA)], [a.worried + 1.4, CAMX(1.05)], [a.writes, CAMX(1.08, 596)], [a.ho2 - .3, CAMX(1.1, 592)], [tCreep, creepTown(tCreep)]];
  const camRaw = (t) => (t < tA ? c67(t) : t < tCreep ? F.camPath(t, K) : creepTown(t));
  const cam = (t) => E.camDrift(camRaw(t), t, 4 * smooth(span(t, t0, t0 + .9)) * (1 - smooth(span(t, tPlate - 2, tPlate))), 13);

  const words = (t) => 1 - span(t, t0 + .1, t0 + 1.0);
  const close = (t) => sineIO(span(t, t0 + .2, t0 + 1.4));
  const ground = (t) => 1 - span(t, a.writes + .2, a.writes + 1.2);
  const crop1 = (t) => span(t, a.worried + .3, a.worried + 1.6) * (1 - span(t, a.writes - .1, a.writes + .8));
  const crop2 = (t) => span(t, a.notOk - .5, a.notOk + .7) * (1 - span(t, a.ho2 - .1, a.ho2 + .8));
  const tapeOut = (t) => span(t, a.control - .4, a.control + .4);
  const tapeShoot = (t) => span(t, a.thousand - .1, a.thousand + 1.1);
  const tapeBack = (t) => span(t, a.writes - .4, a.writes + .3);
  const lift = (t) => sineIO(span(t, a.ho2 - .25, a.ho2 + 1.1));
  const fly = (t) => sineIO(span(t, a.what - .4, tPlate - .25));
  const veil = (t) => lerp(B.GAP.veil, .84, sineIO(span(t, a.ho2 - .3, a.ho2 + 1))) * (1 - sineIO(span(t, a.what - .2, tPlate - .2)));
  const dim = (t) => lerp(.3, .85, sineIO(span(t, a.ho2 - .3, a.ho2 + 1.2)));
  const hall = (t) => lerp(.35, 1, sineIO(span(t, a.what + .2, tPlate - .3)));

  return (ctx, t) => {
    if (t >= tPlate) { S.plateHandover(ctx, t, T); return; }
    const c = cam(t), fl = fly(t), lf = lift(t);
    S.landWorld(ctx, c, t, { head: { dim: dim(t) }, post: 1 - span(t, a.what - .2, tPlate - .9), windows: .3, hall: hall(t), you: false,
      land: (cx) => { if (fl >= 1) F.edgeSafe(cx, { x: HOPLATE[0] - HOPLATE[2] * 2.8, y: HOPLATE[1] - HOPLATE[2], w: HOPLATE[2] * 5.6, h: HOPLATE[2] * 1.25 }, (g) => F.goldText(g, [['HANDOVER', 1]], HOPLATE[0], HOPLATE[1], HOPLATE[2], 1, { serif: true, align: 'center', glow: true })); } });
    F.veil(ctx, veil(t));
    // the gap closes; the ground line stays with you on it, and becomes the tape's floor
    const gu = ground(t);
    if (gu > 0) B.gapScene(ctx, t, { u: gu, words: words(t), crack: 1, close: close(t) });
    // the 1000x crop and the handover crop unroll out of the post header
    const pr = S.postRect(c), x = clamp(pr ? pr.x + pr.w / 2 - CROPW / 2 : 340, 60, W - CROPW - 60), y = (pr ? pr.y + pr.h : 600) + 14;
    const c1 = crop1(t); if (c1 > 0) F.xQuote(ctx, t, 'thousand', x, y, CROPW, { u: c1, hiU: span(t, a.thousand - .05, a.thousand + .9) });
    const c2 = crop2(t); if (c2 > 0) F.xQuote(ctx, t, 'handover', x, y, CROPW, { u: c2, hiU: span(t, a.ho1 - .1, a.ho1 + .7) });
    // the measuring tape: you = one unit (your height); "a thousand times" → it shoots out of the frame, then snaps back
    const to = tapeOut(t), ts = tapeShoot(t), tb = tapeBack(t);
    if (to > 0 && tb < 1 && gu > 0) {
      const unit = 74, x0 = B.GAP.x + 26, len = lerp(0, 1, expoOut(to)) + 999 * expoIn(ts) * (1 - expoIn(tb));
      const tip = B.tape(ctx, t, x0, TAPE.y, unit, Math.max(.01, len * (1 - tb)), { a: gu });
      if (ts <= 0) F.goldText(ctx, [['1×', 1]], x0 + unit / 2, TAPE.y - 24, 28, rise(span(to, .4, 1)), { serif: false, weight: 700, align: 'center' });
      if (ts > 0) F.goldText(ctx, [['1000×', 1]], Math.min(tip - 10, W - 60), TAPE.y - 24, 34, rise(span(ts, 0, .3)) * (1 - tb), { serif: false, weight: 700, align: 'right', glow: true });
    }
    // ★ HANDOVER lifts out of the print, alone in the dark; then glides down onto the town hall (lands on the plate's own word)
    if (lf > 0 && fl < 1) {
      const q = F.xQuote(dummy, t, 'handover', x, y, CROPW, { u: 1 }), h0 = q?.hi?.[0] ?? { x: 900, y: 700, w: 140, h: 30 };
      let px = lerp(h0.x + h0.w / 2, HO.x, lf), py = lerp(h0.y + h0.h * .85, HO.y, lf) - 90 * Math.sin(Math.PI * lf), sz = lerp(h0.h * 1.05, HO.size, lf);
      if (fl > 0) { const p = E.project(c, S.Z_LAND, HOPLATE[0], HOPLATE[1]); if (p) { px = lerp(px, p[0], fl); py = lerp(py, p[1], fl); sz = lerp(sz, HOPLATE[2] * p[2], fl); } }
      F.goldText(ctx, [['HANDOVER', 1]], px, py, sz, 1, { serif: true, align: 'center', glow: true });
    }
    F.checklist(ctx, t, T, { lit: t < a.worried + 2 ? 3 : undefined });
  };
}
