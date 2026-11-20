// c10 · Scenario · day one, year one · built by B3. 'Twenty thirty. Day one' → 'Year ten'.
// Plan: docs/shots.md 10.01–10.12 · world/rules: docs/MOTION.md · seams: the barn of lib/f24_b3_parts.mjs (barnPart, the same function as
// c09 draws) at the start, the courtroom (courtPart, the same function as c11 draws) at the end.
// ONE entry, one continuous take, no cut:
//   the barn: the strip grows big (2030 · TARGET HIT · SCENARIO), the SCENARIO stamp rises (DAY 1) → the barn shrinks into the Europe pig
//   pin, ONE flight south, the gold Amboseli medallion opens onto a camp at dawn → push to the laptop: the chorus runs, the gold listener
//   rises out of the screen and drinks the calls → WOW: the bar fills for the first time, "time to go" (SCENARIO); the family sets off
//   toward the rising sun, the camera pulls back wide → REAL card (SCI. REP. 2026) → the researcher's hand stops over the speaker's
//   button: "Do we answer?" → the phone on the table lights, the feed scrolls, its video card grows into the clip plate (C5, Aza Raskin) →
//   the plate shrinks back into the phone → YEAR 1: the camp shrinks into its pin, ONE long flight to New Zealand, the courtroom opens →
//   REAL: NEAR SHIPS, CALLS SHIFT · REAL: HE WHAKAPUTANGA MOANA / TOHORĀ ORANGA BILL → SCENARIO: "too loud", the judge nods, the ship
//   outside the window slows, its wake calms.
//
// | ID    | anchor (phrase)                    | picture (one idea)                                              | move / carrier                  |
// |-------|------------------------------------|-----------------------------------------------------------------|---------------------------------|
// | 10.01 | Twenty thirty. Day one · Kenya     | strip big → TARGET HIT; SCENARIO · DAY 1; the barn → pig pin →  | strip · stamp · ONE flight      |
// |       |                                    | the Amboseli medallion                                           |                                 |
// | 10.02 | In this scenario                   | the camp at dawn opens out of the medallion: laptop, chorus      | iris (the medallion opens)      |
// | 10.03 | Their A.I. understands … chorus    | push to the laptop; the listener rises, drinks the calls         | push · drink                    |
// | 10.04★| The first message … time to go     | the bar types "time to go" (SCENARIO); the family walks; wide    | typed · walk · pull back (WOW)  |
// | 10.05 | Not far-fetched                    | REAL: VOICES LINE UP WHEN FAMILIES SEEM TO PLAN · SCI. REP. 2026 | card                            |
// | 10.06 | Do we answer                       | her hand stops over the speaker's button                         | push · hesitate                 |
// | 10.07 | The man who invented the endless   | the phone lights, the feed scrolls; its video card grows         | push into the phone · grow      |
// | 10.08 | [C5]                               | Aza Raskin · ORIGINAL FOOTAGE (the plate)                        | clip                            |
// | 10.09 | Year one. A courtroom              | the plate shrinks into the phone; YEAR 1; ONE flight to NZ       | shrink · stamp · flight · iris  |
// | 10.10 | Two parts of this are real         | REAL: NEAR SHIPS, CALLS SHIFT · DOMINICA · 13 WHALES · 2026      | card                            |
// | 10.11 | And Māori and Pacific              | REAL: HE WHAKAPUTANGA MOANA · 2024 / TOHORĀ ORANGA BILL · 2026   | card                            |
// | 10.12 | The rest is our scenario           | "too loud" (SCENARIO); the judge nods; the ship slows            | typed · nod · ship              |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f24_kit.mjs';
import * as K from '../lib/f24_b3_kit.mjs';
import * as S from '../lib/f24_b3_sets.mjs';
import { A3, barnPart, courtPart, NZ } from '../lib/f24_b3_parts.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn } = E;
const { rise } = F;
const F0 = E.F0;

export const PRINT = F.PRINT24;
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: scene(A3(T), T, R), print: PRINT }]; };

const PIG = K.PIG, AMB = K.AMBO;
const ZR_K = 2.0, ZR_NZ = .8;                  // pin-size zooms of the two flights (the medallions stay ~60 px at the flights' widest)
const FAR = { u: 960, v: 560, s: 1.0 };        // the inner camera while a medallion is small
const BAR_C = [1500, 452];                     // the bar over the family (card 3000)
const LIS = [830, 478, 54];                    // the listener over the laptop (card F0): x, y, size

function scene(a, T, R) {
  const barn = barnPart(a, T), court = courtPart(a, T), c5 = a.c5;
  // ---- flight 1: the barn → the Amboseli medallion
  const h1 = [a.day1 + .4, a.inThis + 1.1];
  const PIG_IN = K.inView(PIG.lon, PIG.lat, ZR_K), AMB_IN = K.inView(AMB.lon, AMB.lat, ZR_K);
  // ---- the camp
  const L1 = h1[1];
  const camC = K.glide([
    [L1, FAR],
    [a.chorus + .2, { u: 985, v: 575, s: 1.12 }],
    [a.finishE, { u: 1000, v: 585, s: 1.3 }],
    [a.something, { u: 1030, v: 580, s: 1.36 }],
    [a.timeToGoE + 1.8, { u: 1090, v: 538, s: .93 }],     // WOW: the pull back, the family walks into the sunrise
    [a.planE, { u: 1110, v: 540, s: .98 }],
    [a.answer + .5, { u: 1080, v: 610, s: 1.55 }],        // her hand over the button
    [a.warningE - .4, { u: 962, v: 646, s: 3.0 }],        // into the phone
    [c5.end, { u: 962, v: 646, s: 3.3 }],
    [c5.end + 1.3, { u: 1000, v: 600, s: 1.6 }],
  ]);
  const campDrift = (t) => 1.6 * (1 - .6 * sineIO(span(t, a.warningE - 1.2, a.warningE)));
  const chorus = (t) => Math.max(span(t, a.chorus - .3, a.chorus + .5) * (1 - span(t, a.first + 1.2, a.first + 2.2)), span(t, a.something - .2, a.timeToGo) * (1 - span(t, a.timeToGoE + .3, a.timeToGoE + 1.3)));
  const lisU = (t) => rise(span(t, a.chorus + .1, a.chorus + 1.0)) * (1 - expoIn(span(t, a.timeToGo - .2, a.timeToGo + .4)));
  const phoneOn = (t) => span(t, a.man - .3, a.man + .2) * (1 - span(t, c5.end + 1.0, c5.end + 1.6));
  const growU = (t) => sineIO(span(t, a.warningE - .5, c5.start));
  const backU = (t) => sineIO(span(t, c5.end, c5.end + .9));
  function campWorld(ctx, t, c, O) {
    const out = S.camp(ctx, c, t, {
      rise: sineIO(span(t, a.something - .5, a.notFar + 2.5)),
      walk: t < a.timeToGoE ? null : (t - a.timeToGoE) * 1.3,
      chorus: chorus(t),
      hand: span(t, a.answer - .7, a.answer + .45),
      tremble: span(t, a.answer + .3, a.answer + 1.2),
      phone: { on: phoneOn(t), scroll: lerp(-70, 49.7, expoOut(span(t, a.man, a.feed + .6))), card: 3 },
      screen: 1,
    });
    // the listener rises out of the laptop's screen and drinks the chorus (gold: the ESP's A.I.)
    const lu = lisU(t);
    let bell = null;
    if (lu > 0) E.card(ctx, c, F0, () => F.listener(ctx, t, LIS[0], LIS[1], LIS[2], { u: lu, dir: -1, drink: chorus(t), col: 'gold' }));
    if (lu > 0) bell = K.onScreen(c, F0, LIS[0] + .9 * LIS[2], LIS[1]);   // frame coords (K.scr draws through O)
    // the calls: small rumble lines leave the elephants' mouths and arc into the listener's bell
    if (bell && chorus(t) > 0) K.scr(ctx, O, () => {
      out.els.forEach((e, i) => {
        if (!e || !e.mouth) return;
        const m = K.onScreen(c, 3000, e.mouth[0], e.mouth[1]); if (!m) return;
        for (let j = 0; j < 2; j++) {
          const u = (((t * .5 + i * .29 + j * .5) % 1) + 1) % 1, k = sineIO(u), a1 = chorus(t) * lu * Math.sin(Math.PI * u) ** .7;
          const x = lerp(m[0], bell[0], k), y = lerp(m[1], bell[1], k) - 120 * (O ? O.k : 1) * Math.sin(Math.PI * k);
          F.wave(ctx, t, x, y, 104 * (1 - .45 * k), 30, 'rumble', { u: 1, bars: 9, seed: 50 + i * 3 + j, col: k > .7 ? 'gold' : 'cream', a: .85 * a1, head: false });
        }
      });
    });
    // WOW: the bar fills for the first time, over the family: "time to go" (SCENARIO)
    const bu = rise(span(t, a.first + .5, a.first + 1.2)) * (1 - expoIn(span(t, a.answer - .5, a.answer)));
    if (bu > 0) E.card(ctx, c, 3000, () => F.transBar(ctx, t, BAR_C[0], BAR_C[1], { w: 400, u: bu, text: 'time to go', typed: span(t, a.timeToGo, a.timeToGoE + .1), stamp: t >= a.timeToGo ? 'SCENARIO' : null }));
    if (t >= a.timeToGo && t < a.timeToGo + 1.2) { const p = K.onScreen(c, 3000, BAR_C[0], BAR_C[1]); if (p) K.scr(ctx, O, () => E.halo(ctx, p[0], p[1], 360 * p[2], .22 * (1 - span(t, a.timeToGo, a.timeToGo + 1.2)), P.halo1, P.core1)); }
    // REAL: the family's voices line up when it seems to plan
    K.scr(ctx, O, () => {
      const u = sineIO(span(t, a.already - .55, a.already + .55)) * (1 - expoIn(span(t, a.answer - .45, a.answer + .05)));   // a soft start (the card is big)
      if (u > 0) K.realCard(ctx, t, 110, 236, { u, stampU: span(t, a.already + .1, a.already + .6), w: 600, lines: [
        ['VOICES LINE UP WHEN', 30, P.cream, rise(span(t, a.already + .25, a.already + .95))],
        ['FAMILIES SEEM TO PLAN', 30, P.cream, rise(span(t, a.lineUp - .1, a.lineUp + .6))],
        ['SCI. REP. 2026', 21, P.halo2, rise(span(t, a.seemsPlan - .2, a.seemsPlan + .5))]] });
    });
    return out;
  }
  // the phone's video card on screen (for the grow into / shrink back from the clip plate)
  function vidRect(c, out) {
    const ph = out && out.phone; if (!ph || !ph.vid) return null;
    const v = ph.vid, p0 = K.onScreen(c, F0, v.x, v.y), p1 = K.onScreen(c, F0, v.x + v.w, v.y + v.h); if (!p0 || !p1) return null;
    return { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] };
  }
  const CR = { x: F.CLIP_RECT.x, y: F.CLIP_RECT.y, w: F.CLIP_RECT.w, h: F.CLIP_RECT.h };
  // ---- flight 2: the camp → New Zealand
  const h2 = [a.year1 + .25, a.twoParts - .05];
  const AMB_IN2 = K.inView(AMB.lon, AMB.lat, ZR_NZ), NZ_IN = K.inView(NZ.lon, NZ.lat, ZR_NZ);
  const campInner = (t, r) => K.mixCam(FAR, camC(t), sineIO(K.openOf(r)));

  // ---- the stamp and the strip (screen layer, over everything)
  function overlay(ctx, t) {
    const off = expoIn(span(t, c5.start - 1.0, c5.start - .4)), on2 = rise(span(t, a.year1 - .15, a.year1 + .6));
    const su = t < c5.end ? rise(span(t, a.day1 + .1, a.day1 + .9)) * (1 - off) : on2;
    K.scenarioStamp(ctx, t, { u: su, at: sineIO(span(t, a.year1 + .25, a.year1 + 1.05)) });
    const k = t < c5.start ? 1 - sineIO(span(t, c5.start - 1.0, c5.start - .3)) : sineIO(span(t, c5.end + .2, c5.end + .9));
    if (k >= .999) F.strip(ctx, t, T, barn.stripState(t) || {}); else K.stripShrunk(ctx, t, T, k);
  }

  return (ctx, t) => {
    if (t < h1[0]) barn.world(ctx, t, K.camAt(barn.cam(t), t, 1.6, 9), null);
    else if (t < h1[1]) {   // ONE flight: the barn shrinks into the pig pin; the Amboseli medallion (gold) opens onto the camp at dawn
      const v = F.flight(PIG_IN, AMB_IN, K.HOP(span(t, h1[0], h1[1])));
      const rA = K.medHead(v, AMB.lon, AMB.lat, ZR_K).r, lu = rise(span(t, a.campW - .1, a.campW + .7)) * (1 - span(K.openOf(rA), .45, .6));
      K.mapWith(ctx, t, T, v, [
        { id: 'pigs', lon: PIG.lon, lat: PIG.lat, kind: 'other', zref: ZR_K, scene: (c2, O) => barn.world(c2, t, K.camAt(barn.inner(t, K.medHead(v, PIG.lon, PIG.lat, ZR_K).r), t, 1.6, 9), O) },
        { id: 'amboseli', lon: AMB.lon, lat: AMB.lat, kind: 'esp', zref: ZR_K, label: [AMB.l1, AMB.l2], lu, scene: (c2, O) => campWorld(c2, t, K.camAt(campInner(t, rA), t, 1.4, 4), O) },
      ], { hide: ['kenya'] });
    } else if (t < h2[0]) {   // the camp, full frame (the clip plate grows out of the phone and shrinks back into it)
      const c = K.camAt(camC(t), t, campDrift(t), 4);
      const out = campWorld(ctx, t, c, null);
      F.questionLine(ctx, t, a.answer - .05, a.man + .35, { text: 'Do we answer?', y: 172, size: 58 });
      if (t >= a.warningE - .5 && t < c5.end + .9) {
        const vr = vidRect(c, out);
        if (t < c5.start) { if (vr) K.clipInRect(ctx, t, T, 'C5', K.lerpRect(vr, CR, growU(t)), { rr: lerp(3, 14, growU(t)) }); }
        else if (t < c5.end) F.clipPlate(ctx, t, T, 'C5', { morph: 1 });
        else if (vr) K.clipInRect(ctx, t, T, 'C5', K.lerpRect(CR, vr, backU(t)), { rr: lerp(14, 3, backU(t)) });
      }
    } else if (t < h2[1]) {   // ONE long flight east: the camp closes into its pin, the courtroom opens out of the New Zealand pin
      const v = F.flight(AMB_IN2, NZ_IN, K.HOP(span(t, h2[0], h2[1])));
      const rN = K.medHead(v, NZ.lon, NZ.lat, ZR_NZ).r, lu = rise(span(t, h2[1] - 2.7, h2[1] - 2.0)) * (1 - span(K.openOf(rN), .5, .62));
      K.mapWith(ctx, t, T, v, [
        { id: 'amboseli', lon: AMB.lon, lat: AMB.lat, kind: 'esp', zref: ZR_NZ, scene: (c2, O) => campWorld(c2, t, K.camAt(campInner(t, K.medHead(v, AMB.lon, AMB.lat, ZR_NZ).r), t, 1.4, 4), O) },
        { ...NZ, zref: ZR_NZ, label: [F.PIN.nz.l1, F.PIN.nz.l2], lu, scene: (c2, O) => court.world(c2, t, K.camAt(court.inner(t, rN, FAR), t, 1.4, 11), O) },
      ], { hide: ['kenya'] });
    } else court.world(ctx, t, K.camAt(court.cam(t), t, 1.6, 11), null);
    overlay(ctx, t);
  };
}
