// Film 15 · B1 group (c03–c06, 44.40 – 198.46) · ONE draw function for all four chunk files (scenes/sc03.mjs … sc06.mjs), so the
// chunk seams inside the group (85.16, 129.84, 157.32) are invisible by construction (the sc01/sc02 pattern).
// Sets (each its own world, see the module headers): c03 page/vial/envelope (lib/f15_b1_c03.mjs) · c04 box → clock → start line → lab
// window (lib/f15_b1_c04.mjs) · c05 lab: protein, medal, world map, the pill (lib/f15_b1_c05.mjs) · c06 the way through the tests, ring and
// cell (lib/f15_b1_c06.mjs). Switches: plateCell (lead → B1, 44.40) · c03 → c04 one design space and camera (the slip flies from the envelope to the box) · flight into the
// lab window (portal, c04 → c05) · platePill (c05 → c06, 157.32) · plateDivide (B1 → B2, 198.46).
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import { plateCell, platePill, plateDivide, SEAM_HALF, PILL, DIVIDE } from './f15_seams.mjs';
import * as U from './f15_b1_util.mjs';
import { setC03 } from './f15_b1_c03.mjs';
import { setC04 } from './f15_b1_c04.mjs';
import { setC05 } from './f15_b1_c05.mjs';
import { setC06 } from './f15_b1_c06.mjs';
const { W, H, F0, lerp, span, smooth, sineIO, clamp, aim, camDrift } = E;

export const PRINT = F.PRINT15;

export function anchors(T) {
  const last = (seg, ph, n) => { const ws = T.W(seg, ph, ph); return ws[ws.length - 1].s; };
  const A2 = (w, n) => T.S('s02', w, n), A3 = (w, n) => T.S('s03', w, n), A4 = (w, n) => T.S('s04', w, n), A5 = (w, n) => T.S('s05', w, n);
  const a = {
    T0: T.seg('s02').start, T4: T.seg('s03').start, T5: T.seg('s04').start, T6: T.seg('s05').start, T7: T.seg('s06').start,
    // s02 · station 1
    reads: A2('reads'), letter: A2('letter by'), text: last('s02', 'like a text'), marks: A2('marks'), only: A2('only this'), carries: A2('carries'),
    from: A2('From that'), list: last('s02', 'that list'), vaccine: last('s02', 'a vaccine'), made: last('s02', 'is made'), person: last('s02', 'For one person'),
    nobody: A2('Nobody'), medicine: A2('Medicine that'), readsYou: A2('reads you'), average: A2('average'), isThat: A2('Is that'), artificial: A2('artificial'),
    moderna: A2('Moderna'), machine: A2('machine learning'), secret: A2('secret'), check: A2('check'), andVaccine: A2('And the vaccine'), approved: A2('approved'),
    helps: A2('helps'), longer: A2('longer'), known: last('s02', "isn't known"), lucky: A2('lucky'), thousand: A2('thousand'), ifComp: A2('If a computer'),
    cancer3: last('s02', "person's cancer"), whatElse: A2('what else'), list2: last('s02', 'the list'),
    // s03 · station 2
    picture: A3('Picture'), box: A3('box'), ten: A3('Ten'), each: A3('each year'), promise: A3('the promise puts'), inside: A3('inside'),
    infectious: A3('infectious'), cancers: A3('cancers'), alz: A3("Alzheimer's"), mental: A3('mental'), double: A3('double'), poorer: A3('poorer'),
    clock: A3('clock'), written: A3('written'), starts: A3('It starts'), enough: A3('good enough'), powerful: A3('powerful'), earliest: A3('earliest'),
    twentySix: last('s03', 'twenty twenty-six'), so: A3('So you'), finish: A3('finish'), atMost: A3('At most'), start: last('s03', 'standing at the start'),
    andAt: A3('And at the start'), first: A3('first light'), pharmacy: A3('pharmacy'), lab: A3('lab'),
    // s04 · station 3
    alphafold: A4('AlphaFold'), shape: A4('shape'), proteins: A4('proteins'), machines: A4('machines'), body: A4('body runs'), nobel: A4('Nobel'),
    realNews: A4('the real news'), uses: A4('uses'), million: A4('million'), lmic: A4('low and'), free: A4('free'), trickle: A4('trickle'),
    landed: A4('landed'), everywhere: A4('everywhere'), tool: A4('a tool'), cure: A4('cure'), medicines: A4('medicines'), splits: A4('splits'), two: A4('in two'),
    // s05 · station 4a
    follow: A5('Follow'), toYou: last('s05', 'way to you'), pharmacy2: A5('pharmacy'), people: last('s05', 'in people'), firstAsks: A5('The first asks'),
    safe: A5('safe'), secondAsks: A5('The second asks'), help: A5('help'), drugs: A5('Drugs found'), firstTest: A5('first test'), nine: A5('nine'),
    usually: A5('Usually'), half: A5('half'), andSecond: A5('And the second'), secondTest: last('s05', 'second test'), noBetter: A5('no better'),
    early: A5('early count'), small: A5('small'), limit: A5('limit'), computer: A5('A computer'), faster: A5('faster'), humanBody: A5('human body'),
    takes: A5('takes the time'), medWorks: last('s05', 'medicine works'), trials: A5('clinical trials'), years: A5('years'),
  };
  return a;
}

let CACHE = null;
export function b1(T) {
  if (CACHE) return CACHE;
  const a = anchors(T);
  const S3 = setC03(T, a), S4 = setC04(T, a, S3);
  a.S45 = S4.S45;                                                     // c04 → c05: the lab window fills the frame (portal)
  const S5 = setC05(T, a), S6 = setC06(T, a);
  const k4 = S4.KEYS[0][0];
  // c03 + c04: one design space, one camera; the drift fades in after the plate and out during the flight into the window (ends = cam3())
  const K34 = [...S3.KEYS, ...S4.KEYS.slice(1)];   // c03 + c04: one key list, one glide (no stop at the hand-over)
  const cam34 = (t) => camDrift(t <= S4.tZ ? U.camGlide(t, K34) : S4.camRaw(t), t, 1.6 * smooth(span(t, a.T0 + .5, a.T0 + 2.2)) * (1 - smooth(span(t, a.lab + .25, S4.S45))));
  // the portal: c05's world inside the lab window, seen through c05's own camera at its first frame, scaled onto the window
  const drawInside = (ctx, t) => (ctx2, WIN) => {
    const m = ctx2.getTransform(), sw = m.a * WIN.w, sx = m.a * (WIN.x + WIN.w / 2) + m.e, sy = m.d * (WIN.y + WIN.h / 2) + m.f;
    ctx2.save(); ctx2.setTransform(1, 0, 0, 1, 0, 0);
    S5.draw(ctx2, Math.max(t, S4.S45), aim(F0, W / 2, H / 2, sw / W, sx, sy), true);
    ctx2.restore();
  };
  CACHE = (ctx, t) => {
    if (t < a.T0 + SEAM_HALF) { plateCell(ctx, t); return; }
    if (t < S4.S45) {
      U.nightBg(ctx, t, { wob: 6 * E.drift(t, 1, 3), lift: .4 * smooth(span(t, a.finish - .5, a.finish + 1.5)) });   // the open night of the track is a little lighter
      const c = cam34(t);
      if (t < a.whatElse + .35) S4.drawSlip(ctx, t, c);
      if (t < a.box + 1) S3.draw(ctx, t, c);
      if (t > a.whatElse) S4.draw(ctx, t, c, drawInside(ctx, t));
      if (t >= a.whatElse + .35) S4.drawSlip(ctx, t, c);
      return;
    }
    if (t < a.T6 - SEAM_HALF) { S5.draw(ctx, t); return; }
    if (t < a.T6 + SEAM_HALF) { platePill(ctx, t); return; }
    if (t < a.T7 - SEAM_HALF) { S6.draw(ctx, t); return; }
    plateDivide(ctx, t);
  };
  CACHE.a = a; CACHE.sets = { S3, S4, S5, S6 };
  return CACHE;
}
// the entry every B1 scene file returns
export const entry = (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b1(T), print: PRINT }]; };
