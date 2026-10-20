// c18 · The open question (08a–08d). ONE continuous take in one world: the night sky → the IF seal rising over the horizon → dawn on your
// roof → the aqueduct's light in one district → the burin draws it on across the land → the gap → you engrave the next stretch → wide.
// (plan table: see below, filled in after the first review round)
import { W, H, clamp, mix } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready, camPath, qio, eoX, eiX, span, sio } from '../lib/v2_c18_kit.mjs';
import { drawSky } from '../lib/v2_c18_sky.mjs';
import { drawFar, drawValley, drawMist } from '../lib/v2_c18_land.mjs';
import { TOWERS, drawTower } from '../lib/v2_c18_city.mjs';
import { aqueductItems, aqueductLights } from '../lib/v2_c18_net.mjs';
import { drawHere } from '../lib/v2_c18_roof.mjs';
import { cs } from '../lib/v2_c18_kit.mjs';

export default async (T, R) => {
  const { in: HI } = handsOf('c18', T);
  const S8 = (p) => T.S('08a', p), E8 = (p) => T.E('08a', p);
  const K = { a: HI.b, that: S8('That'), iF: S8('if from'), still: E8('still there'), day0: S8('The day'), poss: S8('possible'), possE: E8('possible'),
    but: S8('But possible'), shared: S8('shared'), few0: S8('It could come'), few: S8('few'), or: S8('Or it could'), every: S8('every'), earth: S8('Earth'), earthE: E8('Earth'),
    part: S8('That part'), open: S8('open'), openE: E8('open'), morning: T.S('08b', 'And one'), dayB: T.S('08b', 'day'), dont: T.S('08b', 'You don'), dontE: T.E('08b', 'have to'),
    want0: T.S('08c', 'You want'), want: T.S('08c', 'want'), wantE: T.E('08c'), so: T.S('08d', 'So how'), there: T.S('08d', 'there'), end: T.duration };
  const cam0 = { x: .6, y: 3.2, z: 1.2, az: -.02, pitch: .62, f: 1400, oy: 540 };
  const cam = camPath([
    { t: K.a, cam: cam0 },
    { t: K.a + .5, cam: { x: .6, y: 3.6, z: .6, az: -.015, pitch: .5, f: 1400 } },
    { t: K.that + .45, cam: { x: .6, y: 4.6, z: -1.0, az: 0, pitch: .1, f: 1400 } },
    { t: K.still, cam: { x: .65, y: 4.5, z: -1.4, az: .005, pitch: .088, f: 1420 } },
    { t: K.poss, cam: { x: .6, y: 1.52, z: 3.2, az: .03, pitch: .03, f: 1800 } },
    { t: K.end, cam: { x: .6, y: 1.5, z: 3.3, az: .035, pitch: .03, f: 1810 } },
  ]);
  const state = (t) => {
    const L = mix(0, .55, span(t, K.a + .2, K.still, sio)) + mix(0, .45, span(t, K.still, K.but, sio)) + mix(0, .6, span(t, K.or, K.earthE, sio)) + mix(0, .4, span(t, K.morning, K.dayB, sio));
    return { L, wake: span(t, K.day0, K.possE, sio), stars: 1 - span(t, K.a + .6, K.poss, sio), aqLit: 1 };
  };
  const draw = (ctx, t) => {
    if (t < K.a + 1 / 60) { HI.plate(ctx, t); return; }
    const c = cam(t), S = state(t);
    const sealEl = mix(-.09, .075, span(t, K.that - .4, K.still + .2, eoX)) + .0025 * (t - K.a);
    drawSky(ctx, t, c, { L: S.L, stars: S.stars, t0: K.a, cam0, sun: { az: .26, el: mix(-.07, .05, span(t, K.a, K.end, (x) => x)) }, sunA: 1, seal: { az: -.2, el: sealEl, r: .072, pale: .2 + .5 * clamp(S.L - .5), ring: 1, halo: 1 }, sunRing: 1 });
    drawFar(ctx, t, c, S, []);
    const items = aqueductItems(t, c, S);
    for (const T0 of TOWERS) items.push({ z: (T0.z0 + T0.z1) / 2, x: (T0.x0 + T0.x1) / 2, draw: (g) => drawTower(g, t, c, T0, S) });
    items.forEach((it) => { it.d = cs(c, it.x, -10, it.z)[2]; });
    items.sort((p, q) => q.d - p.d);
    for (const it of items) it.draw(ctx);
    aqueductLights(ctx, t, c, S);
    drawValley(ctx, t, c, S);
    drawMist(ctx, t, c, S);
    drawHere(ctx, t, c, S, null);
  };
  await ready();
  return [{ t: HI.b, tr: 'cut', d: .1, print: HI.print, draw }];
};
