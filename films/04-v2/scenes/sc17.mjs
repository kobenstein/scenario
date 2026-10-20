// c17 · The older question (VO 07d) · out of the firelight → a horizon through time → the wheeling sky → you on the hill → the noise stops
//
// shot  | VO words (07d)                                   | image                                                                | hero light          | camera / flow
// ------+--------------------------------------------------+----------------------------------------------------------------------+---------------------+-----------------------------------------------
// 17.01 | And maybe, underneath that, there's an even      | the fire-light plate IS the fire's light: it condenses into the      | the fire (amber)    | from H.b: pull back out of the light (log dolly),
//       | OLDER question.                                  | flames of a fire on an ancient plateau; four people wrapped in       |                     | the people slide in from the frame edges; on
//       |                                                  | blankets sit around it, sparks rise; standing stones, mountains      |                     | "older" pull back + crane up: the land opens
// 17.02★| The one people have asked in SILENCE, in PRAYER,  | one continuous dolly right along the horizon: the fire circle →      | fire / starlight /  | truck right, crane down to eye level (the
//       | under the NIGHT SKY, for as long as there have   | someone sitting in silence on a boulder (back view) → two figures    | candles / phone +   | stations on the skyline); on "night sky" tilt +
//       | been PEOPLE.                                     | kneeling before a candle-lit niche in an old wall → a person on a    | window              | crane up into the Milky Way; on "people" the
//       |                                                  | rooftop today looking up; the Milky Way; the stars begin to wheel    | the Milky Way       | stars begin to wheel (trails ∝ speed, no strobe)
// 17.03 | What is this life FOR?                           | the huge wheeling sky; you, tiny on a hill, looking up               | starlight           | (sky only: the ground below changes) tilt + crane
//       |                                                  |                                                                      |                     | down onto the hill
// 17.04 | Who am I, underneath everything I DO?            | ghost lines of the things you do (badge, tools, boat, violin, net)   | starlight rim on you| closer: dolly in, low behind you
//       |                                                  | orbit you and unwind away, the silhouette stays, rim-lit by stars    |                     |
// 17.05 | No job can ANSWER that for you.                  | the badge, last, drifts off into the dark and smokes away            |                     | slow drift
// 17.06 | Not this film EITHER.                            | the film's own guilloche border (as 4.04) is engraved at the picture | cream engraving     | (the border is the picture's own edge)
//       |                                                  | edges, then its threads unwind into the stars                        |                     |
// 17.07 | It's a question you only hear when the noise     | pull back: the city on the horizon, its glow and moving lights;      | sodium glow → none  | pull back, hold
//       | STOPS.                                           | on "stops" its lights go out, the wheel comes to rest                |                     |
// 17.08 | Soon, the noise might STOP.                      | tilt + crane up into the open sky, held; only the stars drift        | starlight           | until the frame IS the deep sky plate (H.a − 1/30)
//
// The sky is ONE sky for the whole chunk (lib/v2_c17_sky.mjs): the plate's own stars, its band and gradient, plus the Milky Way that sets
// below the final frame; at pan = dl = φ = 0 it is the c17>c18 plate. Ambience: nightsky (fire plateau, dolly), roof (rooftop),
// hill + city_night_hill (the hill, faded out on "stops").
import { handsOf } from '../lib/handoff4.mjs';
import { W, H, clamp, mix } from '../engine.mjs';
import { ready, track, camera, sio } from '../lib/v2_c17_kit.mjs';
import { drawSky, prepareSky } from '../lib/v2_c17_sky.mjs';
import { worldA, prepareA } from '../lib/v2_c17_landA.mjs';
import { worldB, prepareB } from '../lib/v2_c17_hill.mjs';

export default async function (T, R) {
  const { in: HI, out: HO } = handsOf('c17', T);
  const S = (p, n) => T.S('07d', p, n), E = (p, n) => T.E('07d', p, n);
  const K = {
    hb: HI.b, and: S('And maybe'), older: S('older'), question: E('older question'), one: S('The one'),
    silence: S('silence'), prayer: S('prayer'), night: S('night sky'), sky: E('night sky'), long: S('for as long'), people: S('people', 1),
    what: S('What is'), for: S('life for') + .32, who: S('Who am'), do: S('everything I do') + .64, no: S('No job'), answer: S('answer'),
    not: S('Not this'), either: S('either'), its: S("It's a"), noise: S('the noise'), stops: S('stops'), soon: S('Soon'),
    stop: S('stop', 1), end: E('might stop'), ha: HO.a,
  };
  K.sw = K.people + .14;                   // the world switch (sky only on screen)
  const LAST = K.ha - 1 / 30;

  // ---------------------------------------------------------------- world A camera: out of the fire, the dolly, the tilt into the sky
  const AX = track([[K.hb, 0], [K.older - 1.1, .45], [K.older - .05, .62], [K.one - .2, 2.0], [K.silence + .3, 6.6], [K.prayer + .35, 12.3], [K.night + .15, 18.0], [K.sky + .55, 21.3], [K.sw + .4, 22.0]]);
  const AY = track([[K.hb, .35], [K.older - 1.1, 1.15], [K.older - .05, 1.2], [K.one - .1, 3.0], [K.silence - .2, 1.15], [K.night, 1.0], [K.sky + .55, 6.5], [K.sw + .4, 7.0]]);
  const AD = track([[K.hb, Math.log(.45)], [K.older - 1.1, Math.log(5.2)], [K.older - .05, Math.log(5.6)], [K.one - .1, Math.log(13.5)], [K.sw + .4, Math.log(13.6)]]);
  const ADL = track([[K.hb, 760], [K.older - 1.1, 900], [K.older - .05, 912], [K.one - .1, 740], [K.silence - .2, 660], [K.night + .05, 660], [K.sky + .55, 0], [K.sw + .4, 0]]);
  const camA = (t) => camera(AX(t), AY(t), -Math.exp(AD(t)), ADL(t));

  // ---------------------------------------------------------------- world B camera: down onto the hill, closer, back, up into the sky
  const BX = track([[K.sw - .4, -9], [K.what + .9, -7], [K.who - .05, -6.6], [K.do - .35, -.6], [K.not + .2, .2], [K.its + .1, .5], [K.stops - 1.2, -4], [K.stops + .3, -4.3], [K.end - .1, -4.6], [LAST, -4.6]]);
  const BY = track([[K.sw - .4, 14], [K.what + .9, 1.8], [K.who - .05, 1.9], [K.do - .35, 6.3], [K.not + .2, 6.45], [K.its + .1, 6.5], [K.stops - 1.2, 3.4], [K.stops + .3, 3.4], [K.end - .1, 9.5], [LAST, 9.6]]);
  const BZ = track([[K.sw - .4, -56], [K.what + .9, -52], [K.who - .05, -49], [K.do - .35, -10.8], [K.not + .2, -10.4], [K.its + .1, -10.2], [K.stops - 1.2, -32], [K.stops + .3, -33], [K.end - .1, -34], [LAST, -34]]);
  const BDL = track([[K.sw - .4, 0], [K.sw + .5, 0], [K.what + .9, 410], [K.who - .05, 400], [K.do - .35, 300], [K.its + .1, 300], [K.stops - 1.2, 400], [K.stops + .3, 400], [K.end - .1, 0], [LAST, 0]]);
  const camB = (t) => camera(BX(t), BY(t), BZ(t), BDL(t));

  // ---------------------------------------------------------------- the star wheel: rests at φ0, turns from "people" to "stops"
  const PHI0 = .61, w0 = K.people, w1 = K.people + 1.9, w2 = K.stops - 1.3, w3 = K.stops + .32;
  const omegaN = (t) => (t <= w0 || t >= w3 ? 0 : t < w1 ? sio((t - w0) / (w1 - w0)) : t < w2 ? 1 : 1 - sio((t - w2) / (w3 - w2)));
  const AREA = (w1 - w0) / 2 + (w2 - w1) + (w3 - w2) / 2, WMAX = PHI0 / AREA;
  const swept = (t) => {   // ∫ω from w0 to t (closed form of the sine ramps)
    const ramp = (u, d) => d * (u - Math.sin(Math.PI * u) / Math.PI) / 2;
    if (t <= w0) return 0; if (t < w1) return WMAX * ramp((t - w0) / (w1 - w0), w1 - w0);
    const a1 = WMAX * (w1 - w0) / 2; if (t < w2) return a1 + WMAX * (t - w1);
    const a2 = a1 + WMAX * (w2 - w1); if (t < w3) { const d = w3 - w2, u = (t - w2) / d; return a2 + WMAX * (d * u - ramp(u, d)); }
    return PHI0;
  };
  const skyCam = (C, t) => ({ pan: C.pan, dl: C.dl, phi: Math.max(0, PHI0 - swept(t)), omega: -WMAX * omegaN(t), tau: 5.6 });

  prepareSky(); prepareA(); prepareB();
  await ready();

  const frame = (ctx, t) => {
    if (t <= K.hb + 1e-6) { HI.plate(ctx, t); return; }
    if (t >= LAST - .2) { HO.plate(ctx, t); return; }   // the camera has been at the plate's view since K.end; the plate itself takes over
    if (t < K.sw) { const C = camA(t); drawSky(ctx, t, skyCam(C, t)); worldA(ctx, t, C, K, HI); return; }
    const C = camB(t); drawSky(ctx, t, skyCam(C, t)); worldB(ctx, t, C, K);
  };
  const SND = (f, t, v = .7) => ({ f, t, v });
  return [
    { t: K.hb, tr: 'cut', d: .1, print: HI.print, draw: frame, sound: [SND('swell', K.hb + .05, .45)] },
    { t: K.question + .1, tr: 'cut', d: .1, print: HI.print, draw: frame, sound: [SND('whoosh_airy', K.question + .12, .35)] },
    { t: K.sw, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [SND('shimmer_rings', E('been people') + .05, .4)] },
    { t: K.answer + .3, tr: 'cut', d: .1, print: HO.print, draw: frame },
    { t: K.either - .9, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [SND('foil_glint', E('this film either') + .02, .45)] },
    { t: K.stops - .3, tr: 'cut', d: .1, print: HO.print, draw: frame, sound: [SND('powerdown', E('noise stops') + .04, .3)] },
    { t: K.soon, tr: 'cut', d: .1, print: HO.print, draw: frame },
  ];
}
