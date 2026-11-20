// Chapter 01 · "The biggest if" (VO 01a + 01b), from the end of CLIP M to the harbour street of chapter 02.
//
// CARRIER CHAIN (shot → carrier → next shot, type)
//  in   CLIP M (ch.00) → the footage frame exits right, re-enters here from the left still playing,
//       shrinks and lands as the lit front window of the night train (a)
//  1.01 "He gives it ten, maybe twenty years." Night train on a viaduct in perspective; the arches light one by one
//       (10 by "ten", 20 by "twenty"), labelled 10 / 20 YEARS → the train races off right, its tail lantern (c)
//  1.02 "And he adds a condition." The tail rushes out right, the lantern slides off its light trail, slows (speed ramp)
//       and hangs on a light thread → push into the lantern (b)
//  1.03 G1 "If AI and robots keep getting better." The lantern light shrinks into the dot of a light-thread "if",
//       which writes itself on "If"; the camera tilts down out of the sky: the work frieze slides in below (a);
//       cyan points take over the tasks (ward monitor, train cab, harvest rows, parcels), people lift their heads,
//       brighter on "better"; continuous truck right → the cyan wave runs on right (c)
//  1.04 "He thinks they will." Aerial night country in perspective; the cyan wave floods fields and roads to the
//       horizon on "will" → the wave pours on right into the diagram (c)
//  1.05 G1 flow "But that's not the hard part. / The hard part is whether what it earns reaches you. /
//       That's the biggest "if" in this film. / For the next few minutes, let's say it does."
//       cyan points make amber value; a fork bends most of it into one narrow channel ("whether"); the camera follows
//       one dot down the thin branch into a waiting hand ("reaches you"); pull back as the "if" grows to fill the sky
//       ("biggest"); on "does" the channel opens and the flow reaches every station evenly; the "if" rises like a
//       released balloon (a, up) and the daylight frieze slides in from below
//  1.06 "AI won't end work. / It will end having to work." Daylight frieze: close on the nurse sitting with the
//       patient, her hand on his; pull back to the whole frieze; ★ on "having" the whole frieze exhales
//       (shoulders drop, the train slows, pickers straighten, warm light floods along the line) → the exhale becomes
//       a gust in the wheat (c)
//  1.07 "Those sound alike. / They're not." The gust carries on into two paper strips on a line over the wheat,
//       "the end of work" / "the end of having to work", fluttering in sync on "alike"; on "not" both tear loose:
//       one falls grey, one lifts warm; each folds into a paper bird (a)
//  1.08 "One of them scares almost everyone." The grey bird flies into a cold empty office at night; a lone
//       figure with a box at the window; through the glass the warm bird passes → push through the window (b)
//  1.09 "The other could change what a human life is for." The bird flies out over the bay at first light;
//       on "for" the morning stripe on the water widens → (ch.02) the stripe carries into the harbour street (b)
import { W, H, C, rgba, clamp, mix, lin, sm, eio, eout, ein, drift, text } from '../engine.mjs';
import { printFinish } from '../lib/art.mjs';
import { drawTrain, drawLantern, LANTERN_END } from '../lib/s01_train.mjs';
import { frieze, nearFG, FW, GY } from '../lib/s01_frieze.mjs';
import { drawIf, spot, keys } from '../lib/s01_kit.mjs';
import { drawLand } from '../lib/s01_land.mjs';
import { drawFlow } from '../lib/s01_flow.mjs';
import { drawStrips, drawOffice, drawBay, OFFICE_WIN } from '../lib/s01_end.mjs';

export default async function (T) {
  const S = (p, n) => T.S('01a', p, n), E = (p, n) => T.E('01a', p, n), S2 = (p, n) => T.S('01b', p, n);
  const t0 = T.seg('01a').start - 1.2, tEnd = T.seg('02a').start - 1.2;
  const shots = [];

  // 1.01 train on the viaduct
  shots.push({ t: t0, tr: 'match', d: .5, draw: drawTrain(T) });
  // 1.02 the lantern (motion match on the train's speed)
  const tL = S('And') - .26;
  shots.push({ t: tL, tr: 'match', d: .24, draw: drawLantern(T) });

  // 1.03 G1 "if" → tilt down into the night frieze, cyan points take over
  const tIf = S('If'), tRise = S('AI') - .1, tBetter = S('better');
  const tIfShot = tIf - .2;
  shots.push({ t: tIfShot, tr: 'match', d: .24, draw: (ctx, t) => {
    const e = eio(lin(tRise, tRise + 1.0, t));
    const camX = mix(760, 1950, sm(lin(tRise + .3, S('will') + .2, t))) + drift(t, 10, 1);
    const cam = { x: camX, y: mix(-560, 600, e) + drift(t, 5, 2), z: 1.0 + .02 * Math.sin(t * .4) };
    const lift = (x) => sm(lin(tBetter - .5 + x / FW * .9, tBetter + .3 + x / FW * .9, t));
    frieze(ctx, { mode: 'night', cam, t, cyan: sm(lin(tRise + .5, tBetter + .1, t)) * (1 + .25 * Math.exp(-Math.max(0, t - tBetter) * 3) * (t > tBetter ? 1 : 0)), lift, sweep: lin(tRise + .6, S('will') + .3, t) });
    nearFG(ctx, cam, 'night', t);
    // the "if" hangs in the sky; the lantern light shrinks into its dot
    const sc = mix(560, 240, e), cx = mix(1000, 960, e) + drift(t, 4, 3), cy = mix(560, 190, e) + drift(t, 3, 4);
    const dotP = [cx - .33 * sc, cy - .52 * sc], g = eio(lin(tIfShot - .1, tIf + .1, t));
    const u = eio(lin(tIf, tIf + .75, t));
    drawIf(ctx, cx, cy, sc, u, 1, { t, dotA: sm(lin(.85, 1, g)), glowK: 1 - .4 * e });
    if (g < 1) { const x = mix(LANTERN_END[0], dotP[0], g), y = mix(LANTERN_END[1], dotP[1], g); spot(ctx, x, y, mix(800, 70, g), mix(.9, .6, g), C.amber, '#fff6e2'); ctx.fillStyle = 'rgba(255,246,226,.95)'; ctx.beginPath(); ctx.arc(x, y, mix(40, 6, g), 0, 7); ctx.fill(); }
    printFinish(ctx, { grain: .07, vig: .42 });
  } });

  // 1.04 the cyan wave floods the country (motion match, wave keeps running right)
  shots.push({ t: S('thinks') - .25, tr: 'match', d: .4, draw: drawLand(T) });
  // 1.05 G1 flow diagram (the wave pours on right into it)
  shots.push({ t: S('But') - .1, tr: 'match', d: .45, draw: drawFlow(T) });
  // 1.06 daylight frieze: the nurse sits with the patient → pull back → ★ the whole frieze exhales on "having"
  const tAI = S2('AI'), tHaving = S2('having'), tWork2 = S2('work', 1), tThose = S2('Those');
  shots.push({ t: tAI - .45, tr: 'down', d: 1.0, draw: (ctx, t) => {
    const [x, y, z] = keys(t, [[tAI - 1, [585, 625, 2.05]], [S2('It') - .25, [545, 620, 2.0]], [tHaving - .25, [1790, 420, .58]], [tThose + .3, [1900, 470, .68]]]);
    const cam = { x: x + drift(t, 8, 1) / z, y: y + drift(t, 4, 2) / z, z };
    const ex = (wx) => sm(lin(tHaving - .15 + wx / FW * .45, tHaving + .8 + wx / FW * .45, t));
    const tx = (tt) => 1000 + 75 * (Math.min(tt, tHaving) - (tAI - 1)) + (tt > tHaving ? 75 * .7 * (1 - Math.exp(-(tt - tHaving) / .7)) : 0);
    frieze(ctx, { mode: 'day', cam, t, ex, nurseSit: true, hiA: true, blendLo: clamp((1.6 - z) / .35), trainX: tx(t), dayCyan: 1, wind: mix(1700, 3100, lin(tWork2 - .2, tThose + .3, t)) });
    nearFG(ctx, cam, 'day', t);
    // ★ the warm flood that rides the exhale along the line: the sky turns gold, light runs left to right
    { const f = lin(tHaving - .2, tHaving + 1.4, t); if (f > 0) { const e = eio(f), fx = mix(-600, W + 900, e);
      const g = ctx.createLinearGradient(fx - 900, 0, fx, 0); g.addColorStop(0, rgba('#ffb86a', .32)); g.addColorStop(.85, rgba('#ffd28a', .42)); g.addColorStop(1, rgba('#ffd28a', 0));
      ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = g; ctx.fillRect(0, 0, Math.max(0, fx), H);
      ctx.globalCompositeOperation = 'screen'; const s2 = ctx.createLinearGradient(0, 0, 0, H * .75); s2.addColorStop(0, rgba('#ff9a6a', 0)); s2.addColorStop(.6, rgba('#ffb070', .22 * e)); s2.addColorStop(1, rgba('#ffd9a0', .38 * e)); ctx.fillStyle = s2; ctx.fillRect(0, 0, W, H * .75);
      ctx.restore(); spot(ctx, W * .82, H * .62, 700, .25 * e, '#ffb070', '#fff1cf', { sy: .5 }); } }
    printFinish(ctx, { grain: .07, vig: .36, vigCol: '#1a1030' });
  } });
  // 1.07 the gust carries on into two paper strips (motion match)
  shots.push({ t: tThose - .14, tr: 'match', d: .4, draw: drawStrips(T) });
  // 1.08 the grey bird into the cold office
  shots.push({ t: S2('One') - .1, tr: 'match', d: .3, draw: drawOffice(T) });
  // 1.09 push through the window: the bay at first light, the stripe widens on "for" (hand-over to ch.02)
  shots.push({ t: S2('The other') - .15, tr: 'zoom', d: .9, x: OFFICE_WIN[0] - 470, y: OFFICE_WIN[1], depth: 5, draw: drawBay(T) });
  return shots;
}
