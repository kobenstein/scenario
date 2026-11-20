// c11 · Scenario · year ten · other minds · back to today · end screen · built by B3. 'Year ten' → the end (635.48).
// Plan: docs/shots.md 11.01–11.15 · world/rules: docs/MOTION.md · seam: the courtroom of lib/f24_b3_parts.mjs (courtPart, the same
// function as c10 draws) at the start.
// ONE entry ✂ ONE planned rhyme cut (11.07: the machine mind's wave on the map = the line of light in the room, same place, same size):
//   the courtroom: YEAR 10 → it shrinks into the New Zealand pin, ONE long flight across the world, the Iowa medallion opens onto a farm
//   kitchen at dusk → push to the window: the microphone under the barn's eave, the FEELS card rises out of its light → the table, dinner
//   → the camera tilts down under the table: the dog; the bar types "walk. walk. walk." (SCENARIO) → the kitchen shrinks into the Iowa
//   pin, the whole night map: every species' calls over its pin; a calm machine wave blooms between them (OTHER MINDS) and grows, the
//   map dims under it ✂ the same wave hangs in a room full of people as a line of light; they turn to it → BACK TO TODAY: the room
//   shrinks into the strip's TODAY dot while the strip glides big (TODAY · NOV 2026 … 2030), the dashed part stretches on "far longer"
//   → the strip docks, the map pushes into the Europe pig pin: the barn of the hook, PIG 2's FEELS bead slides to NOT FINE; you lower
//   your head and listen → the slow pull: the barn moves into the left third (SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY) →
//   END SCREEN 15 s: the barn at rest, the lamp, the pigs breathing, the right two thirds a quiet dark wall.
//
// | ID    | anchor (phrase)                     | picture (one idea)                                         | move / carrier                   |
// |-------|-------------------------------------|------------------------------------------------------------|----------------------------------|
// | 11.01 | Year ten. A farm kitchen in Iowa    | YEAR 10; court → NZ pin → ONE flight → the Iowa kitchen    | stamp · flight · iris            |
// | 11.02 | Microphones in every barn           | the mic's light under the eave; FEELS card (FINE)          | push to the window               |
// | 11.03 | Whether that changes … can't say    | the table, dinner                                          | breathing hold                   |
// | 11.04 | Under the table … Mostly: walk.     | the dog; the bar "walk. walk. walk." (SCENARIO)            | tilt down · typed                |
// | 11.05 | Listening to animals is practice    | pull out: the calls over every pin; a machine wave; OTHER MINDS | zoom out · bloom             |
// | 11.06 | And one of those minds              | the machine wave grows, the map dims                       | grow                             |
// | 11.07✂| Soon, we may not be                 | the room: the same wave = a line of light; people turn     | rhyme cut · turn                 |
// | 11.08 | Then listening won't be             | hold on the line of light                                  | push                             |
// | 11.09 | Back to today                       | the room shrinks into the strip's TODAY dot; the night map | iris → dot · strip big           |
// | 11.10 | Twenty thirty is only a few         | the strip big: TODAY · NOV 2026 … 2030; "far longer"       | strip stretches                  |
// | 11.11 | But one part has already arrived    | the strip docks; zoom into the Europe pig pin              | zoom in (carrier: pig medallion) |
// | 11.12 | A.I. can hear them now              | the barn; PIG 2's FEELS bead slides to NOT FINE            | push · bead                      |
// | 11.13 | Whether we listen                   | you lower your head                                        | hold                             |
// | 11.14 | Want the arrival … subscribe        | the slow pull; SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY| slow pull                        |
// | 11.15 | END                                 | the barn at rest in the left third; dark wall right        | very slow drift                  |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f24_kit.mjs';
import * as K from '../lib/f24_b3_kit.mjs';
import * as S from '../lib/f24_b3_sets.mjs';
import { A3, courtPart, NZ, IOWA_P } from '../lib/f24_b3_parts.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { rise } = F;
const F0 = E.F0;

export const PRINT = F.PRINT24;
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: scene(A3(T), T, R), print: PRINT }]; };

const PIG = K.PIG;
const ZR_W = .4;                                  // NZ → Iowa: the pin-size zoom of the flight across the world
const ZR_P = 1.1;                                 // the pig pin at the world view
const FAR = { u: 960, v: 560, s: 1.0 };
const WV = F.mapView(8, 16, 1.12);                // the whole night map (all pins)
const MW0 = { w: 560, h: 80 }, MW1 = { w: 1000, h: 110 };   // the machine wave on the map → its size in the room (S.MIND, card 2400)
const STRIP_A = [960, 560];                       // the strip big (back to today)
const CARD2 = [1352, 300], CS = 1.2;              // the hook's PIG 2 card
const END = { u: 2130, v: 170, s: .5 };           // the end framing: the barn in the left third
const DOG_BAR = [1020, 690];

function scene(a, T, R) {
  const court = courtPart(a, T);
  // ---- flight: NZ → Iowa
  const h3 = [a.year10 + .2, a.mics + .95];
  const NZ_IN = K.inView(NZ.lon, NZ.lat, ZR_W), IO_IN = K.inView(IOWA_P.lon, IOWA_P.lat, ZR_W);
  // ---- the kitchen
  const camI = K.glide([
    [h3[1], FAR],
    [a.feelE + .4, { u: 1470, v: 455, s: 1.42 }],          // the window: the microphone, the card
    [a.whether + 1.5, { u: 830, v: 590, s: 1.22 }],        // the table
    [a.sayE + 1.4, { u: 815, v: 600, s: 1.27 }],
    [a.under + 1.6, { u: 800, v: 760, s: 1.62 }],          // tilt down: under the table
    [a.dog + .4, { u: 830, v: 785, s: 1.8 }],
    [a.walkE + .6, { u: 850, v: 770, s: 1.86 }],
  ]);
  function kitchen(ctx, t, c, O) {
    const out = S.farmKitchen(ctx, c, t, {
      mic: .35 + .65 * span(t, a.mics + .2, a.mics + .9),
      look: .1 + .5 * sineIO(span(t, a.dog - .3, a.dog + .6)), tilt: .6 * Math.sin(Math.PI * span(t, a.thinks - .1, a.thinks + 1.3)),
      wag: 3 + 6 * span(t, a.walk - .2, a.walk + .4), youDown: sineIO(span(t, a.under + .6, a.dog + .4)),
    });
    // the FEELS card rises out of the microphone's light
    const cu = rise(span(t, a.mics + .9, a.mics + 1.7)) * (1 - expoIn(span(t, a.whether + .3, a.whether + .9)));
    if (cu > 0) {
      const m = K.onScreen(c, 7000, out.mic[0], out.mic[1]);
      if (m) K.scr(ctx, O, () => { ctx.save(); ctx.translate(m[0] - 360, m[1] + 36); ctx.scale(1.05, 1.05);
        F.idCard(ctx, t, 0, 0, { name: 'PIG', sub: 'MICROPHONE', animal: 'pig', feelRow: true, u: cu, feel: 1, feelU: span(t, a.feelE - .3, a.feelE + .6), feelWord: 'FINE' }); ctx.restore(); });
    }
    // "walk." three times (SCENARIO), beside the dog
    const bu = rise(span(t, a.mostly - .2, a.mostly + .5));
    if (bu > 0) E.card(ctx, c, F0, () => F.transBar(ctx, t, DOG_BAR[0], DOG_BAR[1], { w: 420, u: bu, text: 'walk. walk. walk.', typed: span(t, a.walk - .05, a.walk + 1.3), stamp: t >= a.walk ? 'SCENARIO' : null }));
    return out;
  }
  // ---- the world map: the kitchen closes into the Iowa pin; calls; the machine wave
  const z0 = a.practice - .15, z1 = a.minds + .3;
  const IO_IN2 = K.inView(IOWA_P.lon, IOWA_P.lat, ZR_W);
  const mapV = (t) => (t < z1 ? F.flight(IO_IN2, WV, K.ZOUT(span(t, z0, z1))) : F.mapView(WV.lon, WV.lat, WV.z * (1 + .01 * (t - z1))));
  const kitchenInner = (t, r) => K.mixCam(FAR, camI(t), sineIO(K.openOf(r)));
  const mindGrow = (t) => sineIO(span(t, a.building + .3, a.nowE + .2));
  function machineWave(ctx, t, ln = 1) {   // the calm abstract wave of a machine mind (cream, kind 'mind'), centred on S.MIND
    const b = expoOut(span(t, a.minds - .35, a.minds + .9)); if (b <= 0) return;
    const g = mindGrow(t), w = lerp(MW0.w, MW1.w, g) * b, h = lerp(MW0.h, MW1.h, g) * Math.min(1, b * 1.4);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    halo(ctx, S.MIND.x, S.MIND.y, w * .6, .3 * b * ln, P.blue0, mixHex(P.blue0, P.cream, .6));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, S.MIND.x - w / 2 - 200, 0, S.MIND.x + w / 2 + 200, 0, [[0, rgba(P.cream, 0)], [.5, rgba(P.cream, .5 * b)], [1, rgba(P.cream, 0)]]); ctx.fillRect(S.MIND.x - w / 2 - 200, S.MIND.y - 1.5, w + 400, 3); ctx.restore();
    if (w > 20) F.wave(ctx, t, S.MIND.x, S.MIND.y, w, h, 'mind', { u: 1, live: true, seed: 9, col: 'cream', bars: 64, head: false });
    ctx.restore();
  }
  function worldMap(ctx, t) {
    const v = mapV(t), dim = .55 * mindGrow(t);
    const rI = K.medHead(v, IOWA_P.lon, IOWA_P.lat, ZR_W).r;
    if (rI >= F.RF * .999) { kitchen(ctx, t, K.camAt(kitchenInner(t, rI), t, 1.4, 6), null); return; }
    F.map(ctx, t, v, { calls: .45 + .5 * span(t, a.practice + .3, a.practice + 1.4) - .5 * mindGrow(t), dim });
    F.pins(ctx, t, T, v, { hide: ['iowa'], labels: {}, labDur: 0 });
    K.medallion(ctx, t, v, { lon: IOWA_P.lon, lat: IOWA_P.lat, kind: 'other', zref: ZR_W, scene: (c2, O) => kitchen(c2, t, K.camAt(kitchenInner(t, rI), t, 1.4, 6), O) });
    if (dim > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, .5 * dim); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    machineWave(ctx, t);
    const lu = rise(span(t, a.minds + .1, a.minds + .8)) * (1 - expoIn(span(t, a.soon - .45, a.soon - .05)));
    if (lu > 0) K.capsLine(ctx, 'OTHER MINDS', S.MIND.x, S.MIND.y + 120, 30, lu, { align: 'center', col: P.cream });
  }
  // ---- the room (after the rhyme cut)
  const camRm = K.glide([[a.soon, { u: 960, v: 540, s: 1.0 }], [a.roomE, { u: 960, v: 522, s: 1.1 }], [a.skillE, { u: 960, v: 505, s: 1.22 }], [a.backToday + 1.5, { u: 960, v: 500, s: 1.27 }]], { u: 0, v: -4, ls: .03 });
  const roomScene = (ctx, t, O) => S.room(ctx, K.camAt(camRm(t), t, 1.2, 8), t, { turn: t - a.soon - .5, line: 1, mind: { x: S.MIND.x, y: S.MIND.y, w: MW1.w, h: MW1.h } });
  // ---- back to today: the room shrinks into the strip's TODAY dot; the strip big → docked
  const iz = [a.backToday - .1, a.backToday + 2.4];
  const stripO = (t) => {
    const b1 = sineIO(span(t, a.backToday + .1, a.backToday + 1.7)), b2 = 1 - sineIO(span(t, a.onePart - .05, a.arrivedE + .2)), lg = sineIO(span(t, a.longer - .25, a.longerE + .5));
    return { big: Math.min(b1, b2), at: STRIP_A, w: lerp(1100, 1320, lg), s: 1.9, today: lerp(.62, .5, lg), todayLabel: 'TODAY · NOV 2026' };
  };
  // ---- the zoom into the pig pin: the barn of the hook, the end
  const pz = [a.onePart + .45, a.startE + .55];
  const PIG_IN = K.inView(PIG.lon, PIG.lat, ZR_P);
  const vToday = (t) => F.mapView(WV.lon, WV.lat, WV.z * (1 + .01 * (iz[0] - z1) + .008 * Math.max(0, t - iz[0])));
  const camE = K.glide([
    [pz[1], { u: 900, v: 560, s: 1.08 }],
    [a.hearNowE + .3, { u: 880, v: 562, s: 1.13 }],
    [a.upToUsE + .4, { u: 860, v: 566, s: 1.16 }],
    [a.want + .2, { u: 900, v: 556, s: 1.1 }],
    [a.subscribeE + 1.2, END],
    [a.endScreen + 15, { u: END.u + 30, v: END.v - 4, s: END.s * 1.035 }],
  ]);
  const barnInner = (t, r) => K.mixCam(K.BARN_MED_P, camE(t), sineIO(K.openOf(r)));
  function endBarn(ctx, t, c, O) {
    const down = sineIO(span(t, a.listen - .1, a.listen + 1.2)) * (1 - .4 * sineIO(span(t, a.endScreen, a.endScreen + 4)));
    F.barnCast(ctx, c, t, { you: { look: .12 - .3 * down + .02 * Math.sin(t * .5), lean: .08 + .1 * down } });
    endFloor(ctx, c);
    // PIG 2's card: its FEELS bead slides to NOT FINE on "can hear them now"
    const cu = rise(span(t, a.heard + .2, a.heard + 1.0)) * (1 - expoIn(span(t, a.upToUsE - .2, a.upToUsE + .4)));
    if (cu > 0) E.card(ctx, c, F0, () => { ctx.save(); ctx.translate(CARD2[0], CARD2[1]); ctx.scale(CS, CS);
      const fu = span(t, a.hearNow, a.hearNowE + .3);
      F.idCard(ctx, t, 0, 0, { name: 'PIG 2', sub: 'FARM · EUROPE', animal: 'pig', feelRow: true, u: cu, q: fu <= 0, feel: fu > 0 ? -1 : null, feelU: fu, feelWord: 'NOT FINE' });
      ctx.restore(); });
  }
  // the barn's floor and back wall carried on to the right (the end framing looks past the kit set's right edge); drawn under barnCast
  function endFloor(ctx, c) {   // only beyond the kit set's edges (wall x > W + 1600 on card 7000, floor x > W + 1200 on F0)
    const g = F.BARN.ground, fy = K.onScreen(c, F0, W + 1200, g - 18), wx = K.onScreen(c, 7000, W + 1600, 0);
    if (!fy) return;
    if (wx && wx[0] < W) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(wx[0] - 1, -10, W, fy[1] + 12); ctx.restore(); ctx.save(); ctx.clip();
    E.card(ctx, c, 7000, () => {
      ctx.fillStyle = E.lin(ctx, 0, -600, 0, H + 600, [[0, P.night0], [.5, mixHex(P.night1, P.ind0, .4)], [1, P.night1]]); ctx.fillRect(W + 1598, -900, 6000, H + 1800);
      ctx.strokeStyle = rgba(P.night0, .35); ctx.lineWidth = 3; for (let x = -1500 + 118 * 46; x < W + 7000; x += 118) { if (x < W + 1600) continue; ctx.beginPath(); ctx.moveTo(x, -900); ctx.lineTo(x, H + 900); ctx.stroke(); }
      ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(W + 1598, 108, 6000, 26);
    });
    ctx.restore(); }
    E.card(ctx, c, F0, () => { ctx.fillStyle = E.lin(ctx, 0, g - 20, 0, H + 400, [[0, mixHex(P.shade0, P.ind1, .55)], [.25, mixHex(P.shade0, P.night1, .72)], [1, P.night0]]); ctx.fillRect(W + 1198, g - 18, 6000, H + 800); });
  }

  function overlay(ctx, t) {
    if (t < a.backToday + .2) K.scenarioStamp(ctx, t, { u: 1 - expoIn(span(t, a.backToday - .45, a.backToday + .1)), at: 1 + sineIO(span(t, a.year10 + .1, a.year10 + .9)) });
    F.strip(ctx, t, T, t >= a.backToday ? stripO(t) : {});
    // the closing call: one small line, bottom left (no button graphics)
    const su = rise(span(t, a.want + .3, a.want + 1.1)) * (1 - expoIn(span(t, a.subscribeE + 4.2, a.subscribeE + 4.8)));
    if (su > 0) K.capsLine(ctx, 'SO SUPERINTELLIGENCE GOES WELL FOR EVERYBODY', 110, 872, 21, su, { col: P.cream });
  }

  return (ctx, t) => {
    if (t < h3[0]) court.world(ctx, t, K.camAt(court.cam(t), t, 1.6, 11), null);
    else if (t < h3[1]) {   // ONE flight across the world: the courtroom closes into the NZ pin, the Iowa medallion opens onto the kitchen
      const v = F.flight(NZ_IN, IO_IN, K.HOP(span(t, h3[0], h3[1])));
      const rN = K.medHead(v, NZ.lon, NZ.lat, ZR_W).r, rI = K.medHead(v, IOWA_P.lon, IOWA_P.lat, ZR_W).r;
      const lu = rise(span(t, h3[1] - 2.7, h3[1] - 2.0)) * (1 - span(K.openOf(rI), .5, .62));
      K.mapWith(ctx, t, T, v, [
        { ...NZ, zref: ZR_W, scene: (c2, O) => court.world(c2, t, K.camAt(court.inner(t, rN, FAR), t, 1.4, 11), O) },
        { ...IOWA_P, zref: ZR_W, label: [F.PIN.iowa.l1, F.PIN.iowa.l2], lu, scene: (c2, O) => kitchen(c2, t, K.camAt(kitchenInner(t, rI), t, 1.4, 6), O) },
      ]);
    } else if (t < z0) kitchen(ctx, t, K.camAt(camI(t), t, 1.5, 6), null);
    else if (t < a.soon) worldMap(ctx, t);
    else if (t < iz[0]) roomScene(ctx, t, null);
    else if (t < pz[0]) {   // back to today: the night map; the room closes into the strip's TODAY dot
      const v = vToday(t);
      F.map(ctx, t, v, { calls: .45 });
      F.pins(ctx, t, T, v, { labels: {}, labDur: 0 });
      const k = span(t, iz[0], iz[1]);
      if (k < 1) {
        const [dx, dy] = K.stripToday(T, t, stripO(t)), e = K.ZIN(k), r = Math.exp(lerp(Math.log(F.RF), Math.log(5), e));
        const cx = lerp(W / 2, dx, sineIO(span(k, .1, 1))), cy = lerp(H / 2, dy, sineIO(span(k, .1, 1)));
        F.iris(ctx, cx, cy, r, () => roomScene(ctx, t, null));
      }
    } else {   // the zoom into the pig pin: the barn opens, the end
      const v = F.flight(vToday(pz[0]), PIG_IN, K.ZIN(span(t, pz[0], pz[1])));
      const m = { id: 'pigs', lon: PIG.lon, lat: PIG.lat, kind: 'other', zref: ZR_P, scene: (c2, O) => endBarn(c2, t, K.camAt(barnInner(t, K.medHead(v, PIG.lon, PIG.lat, ZR_P).r), t, t > a.endScreen ? .8 : 1.4, 9), O) };
      if (t >= pz[1]) endBarn(ctx, t, K.camAt(camE(t), t, t > a.endScreen ? .8 : 1.4, 9), null);
      else K.mapWith(ctx, t, T, v, [m]);
    }
    overlay(ctx, t);
  };
}
