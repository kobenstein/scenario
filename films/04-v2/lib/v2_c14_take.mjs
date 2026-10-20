// c14 (Film 4 v2) · the one continuous take of the chunk: camera paths and the dispatcher that draws the right world at each t.
//   anchors(T, HI, HO) → A (all times, from the words)
//   take(ctx, t, A)    draws the frame (screen space, full frame)
import { W, H, clamp, mix } from '../engine.mjs';
import { cam, qio, cio, sio, eoX, smo } from './v2_c14_util.mjs';
import { FL, P0, drawSky, drawLand } from './v2_c14_land.mjs';

export function anchors(T, HI, HO) {
  const w = (from, to, k) => T.W('06b', from, to)[k].s;
  const A = {
    hb: HI.b, ha: HO.a,
    now: T.S('06b', 'Now'), mul: T.S('06b', 'multiply'), every: T.S('06b', 'every'), kitchen: T.S('06b', 'kitchen'), table: T.S('06b', 'table'),
    earth: T.S('06b', 'Earth'), earthE: T.E('06b', 'Earth'), and: T.S('06b', 'And'), slowly: T.S('06b', 'slowly'),
    earns: T.S('06b', 'what earns'), respect: T.S('06b', 'respect'), starts: T.S('06b', 'starts'), change: T.S('06b', 'change'), changeE: T.E('06b', 'change'),
    not: T.S('06b', 'Not'), earn: w('you earn', 'you earn', 1), earnE: T.E('06b', 'you earn'),
    what: T.S('06b', 'What you give'), give: w('you give', 'you give', 1), giveE: T.E('06b', 'you give'),
    but: T.S('06b', 'But'), long: T.S('06b', 'long'), run: T.S('06b', 'run'), question: T.S('06b', 'question'), project: T.S('06b', 'project'),
    answer: T.S('06b', 'answer'), answerE: T.E('06b', 'answer'),
  };
  // the camera's schedule (derived from the words)
  A.tiltE = A.mul + .05;                 // the tilt from the sky lands just as "multiply" starts the light
  A.pullA = A.now + .2; A.pullB = A.earth + .3;
  A.waveT0 = A.mul - .02;
  return A;
}

// ---------------------------------------------------------------- 14.01: from the sky down onto the country, the pull back
const C1 = { x: -150, y: 560, z: 1000 }, C2 = { x: -360, y: 1300, z: 2300 };
const PIT1 = -.25, PIT2 = -.31;
export function countryCam(t, A) {
  const e1 = qio((t - A.hb) / (A.tiltE - A.hb)), e2 = cio((t - A.pullA) / (A.pullB - A.pullA));
  const pitch = P0 + (PIT1 - P0) * e1 + (PIT2 - PIT1) * e2;
  const fwd = 60 * sio((t - A.hb) / (A.tiltE + .4 - A.hb));       // a little forward drift while tilting (parallax as the land appears)
  return { x: mix(C1.x, C2.x, e2), y: mix(C1.y, C2.y, e2) - 20 * e1, z: mix(C1.z, C2.z, e2) - fwd, yaw: -.035 * e2, pitch: t <= A.hb ? P0 : pitch, F: FL };
}
const nightOf = (t, A) => .55 * smo((t - A.hb) / (A.earthE + .4 - A.hb));

export function take(ctx, t, A) {
  const o = countryCam(t, A), P = cam(o), n = nightOf(t, A);
  drawSky(ctx, t, P, n);
  if (P.horizon < H + 140) drawLand(ctx, t, P, { n, wave: { t0: A.waveT0 } });
}
