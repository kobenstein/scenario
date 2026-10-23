// Film 8 · c01 · the first minute (VO 00a, clip C1, VO 00b; 0 → 70.84 s) as ONE continuous take: one draw function, one camera through
// four places that hand over without a single blend. Binding shot list: /mnt/project-files/scenario/film-singularitaet/m1/bild/shots.md.
//
// shot | VO (accent)                                   | image                                                        | hero light       | camera / carrier
// -----+-----------------------------------------------+--------------------------------------------------------------+------------------+---------------------------------------------
// 1.01 | The SINGULARITY has BEGUN.                    | night sea, Milky Way; a point of light ignites on the horizon,| horizon light    | picture first; push (dolly + zoom) toward it
//      |                                               | the stars bend round it (Einstein ring), glitter path        |                  |
// 1.02 | And the PEOPLE building … say we're ALREADY   | pull back through the glass of a lab on the cliff: four      | horizon light    | pull back through the glass, crane up;
//      | IN IT.                                        | people at the window, backs to us, rim-lit; light pulses     | (rims)           | carrier: the light between two heads
// 1.03 | (pause)                                       | push between the heads; the light flares into one line       | the line         | push 0.95 s, line, the line opens
// 2.01 | C1 Altman (9.46–16.38)                        | footage full frame, punch-in on the jump cut (frame 87)      | footage          | slow push; lower third + ORIGINAL FOOTAGE
// 2.02 | (clip ends)                                   | the footage closes to a line                                 | the line         | the line = the map's edge seen edge-on
// 3.01 | change so FAST that NO ONE CAN SEE …          | crane up: the map opens; a walker on its road; the roll       | lantern          | crane up, follow
//      |                                               | races to the horizon; fog swallows the road                  |                  |
// 3.02 | The CAREER PATH. The FIVE-YEAR PLAN. The      | ladder, planner, note lying on the map, one per beat         | lantern on paper | tilt down, travel along the road
//      | ADVICE you grew up with.                      |                                                              |                  |
// 3.03 | All of it is starting to DISSOLVE.            | ember edges eat the map and the papers, flakes lift          | ember edges      | crane up and back
// 4.01★| So how do you SURVIVE the SINGULARITY?        | the big compass on the dissolving map + the title (thumbnail)| compass needle   | push down onto the compass
// 4.02 | YOU, and ALL OF US?                           | the figure at the rim; pull back: many walkers with lights   | many lamps       | pull back, then tilt up into the sky
// 5.01 | Some will DRIFT through it.                   | (the sky carries the move) a boat turning aimlessly          | starlight        | tilt down onto the sea
// 5.02 | Some will NAVIGATE.                           | a boat on course, a figure sighting a star, lantern          | lantern          | pan right
// 5.03 | The DIFFERENCE comes down to A FEW CHOICES.   | two wakes from one point; three amber marks on the straight  | the marks        | crane up high
// 6.01 | In the next ten minutes: what … REALLY IS,    | the horizon light again, closer: the ring widens             | horizon light    | tilt up along the wake
// 6.02 | the STORMS ahead,                             | a storm front with lightning                                 | lightning        | pan right along the horizon
// 6.03 | and TWO COMPASSES … YOURS,                    | a hand rises with a small glowing compass                    | the needle       | hand carried in
// 6.04 | and OURS.                                     | a rose of light on the sea ringed by boats with lanterns     | the rose         | hand lowers, crane up
// 7.01★| Fifty years ago, a CANOE crossed … OPEN OCEAN.| Hōkūleʻa under the Milky Way, fire box, navigator; route     | fire box         | fly forward over the sea, pull back alongside
// 7.02 | No MAP. No COMPASS. No INSTRUMENTS.           | chart, compass, sextant rise and fall away, one per beat     | deck light       | hold
// 7.03 | And it ARRIVED.                               | dawn and an island on the horizon                            | dawn             | pan ahead
// 7.04 | HOW? That's the COMPASS we're going to BUILD. | the star compass draws itself round the navigator            | fire box + ring  | crane up behind him, slow orbit to the end
import { clamp } from '../engine.mjs';
import { ready, track, trackLog, camera, eoX, eiX, sio, qio, u01, smooth01, pulse, settle } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { lightAt, lensOf, drawLight } from '../lib/s8_light.mjs';
import { drawLab, FLOOR } from '../lib/s8_lab.mjs';
import { drawClip } from '../lib/s8_clip.mjs';
import { drawMapWorld, roadX, CEN, PAPERS } from '../lib/s8_map.mjs';
import { PATHS, TURNS, NAVH, at, boat, wake, marks, storm, handCompass, rose, roseBoats } from '../lib/s8_boats.mjs';
import { skyDir } from '../lib/s8_sky.mjs';
import { canoe, route, island, instruments, starCompass, tag } from '../lib/s8_canoe.mjs';
import { hand } from '../lib/handoff4.mjs';

export default async function (T, R) {
  const S = (p, n) => T.S('0', p, n), E = (p, n) => T.E('0', p, n), clip = T.clip('C1');
  const K = {
    sing: S('singularity'), begun: S('begun'), and: S('And the people'), people: S('people'), already: S('already'), inIt: E('already in it'),
    c0: clip.start, c1: clip.end,
    means: S('It means'), fast: S('fast'), noOne: S('no one'), coming: E("what's coming"),
    career: S('career'), plan: S('five-year'), advice: S('advice'), all: S('All of it'), dissolve: S('dissolve'),
    so: S('So how'), survive: S('survive'), sing2: S('singularity', 1), you: S('You and all'), allUs: S('all of us'),
    drift: S('drift'), some2: S('Some will navigate'), navigate: S('navigate'), diff: S('The difference'), few: S('a few choices'),
    next: S('In the next'), really: S('really'), storms: S('storms'), two: S('two compasses'), yours: S('Yours'), ours: S('ours'),
    fifty: S('Fifty'), canoe: S('canoe'), open: S('open ocean'), noMap: S('No map'), noComp: S('No compass'), noInst: S('No instruments'),
    arrived: S('And it arrived'), how: S('How', 1), thats: S("That's the compass"), compass: S('compass we'), build: S('going to build'), end: R.b,
  };
  // ---------------------------------------------------------------- take A: the night sea and the lab (0 → the line)
  K.flare = K.c0 - .56; K.open0 = K.c0 - .3; K.open1 = K.c0 + .04;
  const aZ = track([[0, .35, .8], [K.begun + .9, 2.3], [K.and - .35, 2.42], [K.people, .1], [K.people + .9, -3.4], [K.already - .5, -5.7], [K.inIt - .2, -6.0], [K.flare + .08, -.55]]);
  const aY = track([[0, FLOOR + 1.65], [K.and - .35, FLOOR + 1.65], [K.already - .5, FLOOR + 1.98], [K.inIt - .2, FLOOR + 2.0], [K.flare + .08, FLOOR + 1.62]]);
  const aYaw = track([[0, -.185, .06], [K.begun + .9, -.15], [K.and - .35, -.15], [K.already - .5, -.012], [K.flare + .08, 0]]);
  const aPitch = track([[0, .045], [K.and - .35, .04], [K.already - .5, .075], [K.inIt - .2, .072], [K.flare + .08, .035]]);
  const aF = trackLog([[0, 1340, 0], [K.begun + .9, 1720], [K.and - .35, 1760], [K.already - .5, 1260], [K.inIt - .2, 1240], [K.flare + .08, 1480]]);
  const camA = (t) => camera({ x: .02, y: aY(t), z: aZ(t), yaw: aYaw(t), pitch: aPitch(t), F: aF(t) });
  const LIGHT = { az: .035, el: .0022 };
  const lightState = (t) => ({
    ...LIGHT, pre: u01(t, K.sing - .35, K.sing - .02) * (t < K.sing ? 1 : 0), ign: eoX((t - K.sing) / .45),
    ring: eoX((t - K.begun - .02) / .5) * (1 + .06 * pulse(t, K.begun + .2, K.begun + .9)), pulse: .6 * pulse(t, K.already, K.already + 1.0) + 2.2 * eiX(u01(t, K.flare - .1, K.flare + .3)),
  });
  function takeA(ctx, t) {
    const C = camA(t), Ls = lightState(t), L = lightAt(C, Ls), lens = lensOf(C, Ls, L);
    drawSky(ctx, t, C, { lens: lens && Ls.ign > 0 ? lens : null });
    drawSea(ctx, t, C, { glints: L && Ls.ign > 0 ? [{ x: L.x, y: L.y, col: '#bfefff', a: Math.min(1, Ls.ign * (1 + .5 * Ls.pulse)), w: 3, spread: .2 }] : [] });
    drawLight(ctx, t, C, Ls, L);
    if (C.z < .4) drawLab(ctx, t, C, { L: L ? { ...L } : null, lightA: Ls.ign, pulse: Ls.pulse, turn: sio(u01(t, K.already + .12, K.already + .7)) * (1 - sio(u01(t, K.inIt + .1, K.inIt + .8))) });
    // 1.03 the flare becomes one line across the frame
    const ln = u01(t, K.flare, K.open0);
    if (ln > 0 && L) lineAcross(ctx, L.y, eoX(ln));
    return L;
  }
  function lineAcross(ctx, y, u, al = 1) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    const x0 = 960 - 1000 * u, x1 = 960 + 1000 * u;
    for (const [lw, a] of [[30, .06], [8, .22], [2, .95]]) { ctx.strokeStyle = lw < 3 ? `rgba(238,252,255,${a * al})` : `rgba(143,230,255,${a * al})`; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); }
    ctx.restore();
  }
  const yOpen = (() => { const C = camA(K.open0), L = lightAt(C, LIGHT); return L ? L.y : 540; })();
  K.close0 = K.c1 + .02; K.close1 = K.c1 + .3;

  // ---------------------------------------------------------------- take B: the map world (the line → 3.01 … 4.02 → tilt up into the sky)
  const B0 = K.close1;
  const wZ = (t) => { const v = 1.28, z = 5 + v * Math.max(0, t - (B0 + .3)), stop = 23.7; if (z < stop - 1.2) return z; const tS = (B0 + .3) + (stop - 1.2 - 5) / v, a = t - tS, D = 2.4; return a >= D ? stop : stop - 1.2 + v * (a - a * a / (2 * D)); };
  const walker = (t) => { const z = wZ(t); return { x: roadX(z), z, phase: z / 1.5 * Math.PI * 2 }; };
  const P1 = PAPERS[0], P2 = PAPERS[1], P3 = PAPERS[2];
  K.tiltUp = K.allUs + .34; K.sw = K.drift - .22;    // the switch to the sea happens with only sky on screen
  const bX = track([[B0, 0], [B0 + 1.2, .25], [K.career - .7, roadX(wZ(K.career - .7)) * .6], [K.career + .1, P1.x + .5], [K.plan + .1, P2.x - .4], [K.advice + .1, P3.x + .45], [K.all + .2, P3.x + .3], [K.dissolve + .4, 0], [K.so - .3, 0], [K.survive + .8, -.1], [K.you + .25, roadX(23.7) * .5], [K.tiltUp, 0], [K.sw, 0]]);
  const bY = track([[B0, .003], [B0 + 1.25, 2.35], [K.career - .7, 2.45], [K.career + .1, 3.4], [K.advice + .1, 3.5], [K.all + .2, 3.6], [K.dissolve + .4, 9], [K.so - .3, 11], [K.survive + .8, 8.6], [K.you + .25, 7.6], [K.tiltUp, 15], [K.sw, 17]]);
  const bZ = track([[B0, 0], [B0 + 1.25, .9], [K.career - .7, wZ(K.career - .7) - 4.6], [K.career + .1, P1.z - 3.3], [K.plan + .1, P2.z - 3.4], [K.advice + .1, P3.z - 3.4], [K.all + .2, P3.z - 2.8], [K.dissolve + .4, 9.5], [K.so - .3, 13.5], [K.survive + .8, 22.6], [K.you + .25, 20.4], [K.tiltUp, 9], [K.sw, 6.5]]);
  const bPitch = track([[B0, 0], [B0 + 1.25, .12], [K.career - .7, .13], [K.career + .1, .8], [K.advice + .1, .8], [K.all + .2, .82], [K.dissolve + .4, .95], [K.so - .3, .96], [K.survive + .8, 1.0], [K.you + .25, .9], [K.tiltUp, .5], [K.sw, -.6]]);
  const camB = (t) => camera({ x: bX(t), y: bY(t), z: bZ(t), yaw: 0, pitch: bPitch(t), F: 1400 });
  const roll = (t) => { if (t < K.fast) return 14 + 1.35 * Math.max(0, t - K.means); const u = (t - K.fast) / 1.5; return 14 + 1.35 * (K.fast - K.means) + 520 * u * u * u; };
  const fogZ = (t) => { if (t < K.noOne - .15) return 999; const u = clamp((t - K.noOne + .15) / 1.5); const z = 300 - (300 - 22.8) * eoX(u); const r = sio(u01(t, K.so - .35, K.survive + .6)); return z + r * 16; };
  const stateB = (t) => {
    const W = walker(t), burnT0 = K.all + .12;
    return {
      walker: W, lantern: [W.x + .28, .86, W.z + .35], lanternA: 1, roll: roll(t), fogZ: fogZ(t), fogA: 1, zFar: 60,
      edgeA: 1 - u01(t, B0 + .5, B0 + 1.5),
      ladder: sio(u01(t, K.career - .05, K.career + .9)), plan: u01(t, K.plan - .1, K.plan + 1.0), note: u01(t, K.advice - .1, K.advice + .8),
      burn: { t0: burnT0 }, compass: t > K.dissolve ? { glow: eoX((t - K.so + .05) / .9), needle: 1.9 * (1 - (t < K.so ? 0 : Math.min(1.05, 1 - Math.pow(2, -7 * (t - K.so) / 1.4) * Math.cos((t - K.so) / 1.4 * 7.2)))) + .03 * Math.sin(t * 1.3) } : null,
      crowdT0: t > K.you - .4 ? K.you - 8 : null, crowdLamp: u01(t, K.you - .1, K.allUs + .45),
    };
  };
  PAPERS[0].delay = 0; PAPERS[1].delay = .25; PAPERS[2].delay = .45;
  function takeB(ctx, t) {
    const C = camB(t);
    drawSky(ctx, t, C, {});
    drawMapWorld(ctx, t, C, stateB(t));
    { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const vg = ctx.createRadialGradient(960, 600, 380, 960, 560, 1250); vg.addColorStop(0, 'rgba(6,6,18,0)'); vg.addColorStop(.6, 'rgba(6,6,18,.28)'); vg.addColorStop(1, 'rgba(6,6,18,.7)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }
    const dark = 1 - u01(t, B0 + .05, B0 + .8);   // the night rises out of the dark round the line
    if (dark > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(2,2,8,${dark})`; ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); }
    if (t < B0 + .75) lineAcross(ctx, C.hy, 1, 1 - u01(t, B0 + .2, B0 + .7));
  }

  // ---------------------------------------------------------------- take C: the open sea (5.01 drift … 6.04 ours); one camera from the sky
  const sN = (t) => 25 + 1.5 * (t - 36.6), sD = (t) => 42 + .5 * (t - 34.5);
  const NP = (t) => at(PATHS.nav, sN(t)), DP = (t) => at(PATHS.drift, sD(t));
  const DIR = (a) => [Math.sin(a), Math.cos(a)];
  const behind = (t, d, side = 2.6) => { const n = NP(t), [dx, dz] = DIR(NAVH); return [n.x - dx * d - dz * side, n.z - dz * d + dx * side]; };
  K.cr0 = K.diff + .1; K.cr1 = K.few - .15; K.up0 = K.next - .1; K.up1 = K.next + 1.45; K.pan0 = K.really + .55; K.pan1 = K.storms + .2;
  K.hd0 = K.two - .55; K.hd1 = K.two + 1.0; K.ours0 = K.ours - .25; K.ours1 = K.ours + 1.15;
  const B1 = behind(K.up1, 11), B2 = behind(K.pan0, 9.8), B3 = behind(K.pan1, 9.6), B4 = behind(K.hd1, 9.2);
  const RZ = { x: B4[0] + 42 * Math.sin(1.2), z: B4[1] + 42 * Math.cos(1.2), R: 14 };
  const CR = [RZ.x - 34 * Math.sin(1.2), RZ.z - 34 * Math.cos(1.2)];
  const cXc = track([[K.sw, 1.0], [K.drift + .7, 1.3], [K.some2, 1.6], [K.navigate + .2, 6.0], [K.cr0, 6.3], [K.cr1, 7.2], [K.up0, 7.6], [K.up1, B1[0]], [K.pan0, B2[0]], [K.pan1, B3[0]], [K.hd1, B4[0]], [K.ours0, B4[0] + .3], [K.ours1, CR[0], 3.2]]);
  const cZc = track([[K.sw, 9.5], [K.drift + .7, 10.0], [K.some2, 10.3], [K.navigate + .2, 12.0], [K.cr0, 12.3], [K.cr1, 15.2], [K.up0, 15.6], [K.up1, B1[1]], [K.pan0, B2[1]], [K.pan1, B3[1]], [K.hd1, B4[1]], [K.ours0, B4[1] + .3], [K.ours1, CR[1], 3.4]]);
  const cYc = track([[K.sw, 2.3], [K.drift + .7, 2.2], [K.some2, 2.2], [K.navigate + .2, 2.35], [K.cr0, 2.5], [K.cr1, 39], [K.up0, 33], [K.up1, 3.1], [K.pan0, 3.0], [K.pan1, 3.1], [K.hd1, 3.6], [K.ours0, 3.7], [K.ours1, 24]]);
  const cYawc = track([[K.sw, 0], [K.drift + .7, .02], [K.some2, .04], [K.navigate + .2, .5], [K.cr0, .56], [K.cr1, NAVH - .3], [K.up0, NAVH - .06], [K.up1, NAVH - .03], [K.pan0, NAVH + .04], [K.pan1, 1.58], [K.hd0, 1.63], [K.hd1, 1.2], [K.ours0, 1.12], [K.ours1, 1.2]]);
  const cPitchc = track([[K.sw, -.6], [K.drift + .55, .07], [K.some2, .075], [K.navigate + .2, .07], [K.cr0, .07], [K.cr1, 1.5], [K.up0, 1.5], [K.up1, .03], [K.pan0, .035], [K.pan1, .03], [K.hd0, .03], [K.hd1, .1], [K.ours0, .11], [K.ours1, .62]]);
  const cFc = trackLog([[K.sw, 1400], [K.drift + .7, 1400], [K.cr0, 1400], [K.cr1, 1150], [K.up0, 1150], [K.up1, 1400], [K.ours1, 1400]]);
  // take D (the canoe): the flight over the rose, then the camera rides with the canoe (canoe-relative keys)
  K.fl0 = K.ours1; K.T0 = K.canoe + .25; K.cv = 2.2; const CH = 1.5, D1 = .05;
  const PF = [RZ.x + 110 * Math.sin(.75), RZ.z + 110 * Math.cos(.75)], K0 = [PF[0] + 27 * Math.sin(D1), PF[1] + 27 * Math.cos(D1)];
  const KC = (t) => ({ x: K0[0] + K.cv * (t - K.T0) * Math.sin(CH), z: K0[1] + K.cv * (t - K.T0) * Math.cos(CH), head: CH });
  const flX = track([[K.fl0, CR[0], 3.2], [K.T0, PF[0]]]), flZ = track([[K.fl0, CR[1], 3.4], [K.T0, PF[1]]]);
  const flY = track([[K.fl0, 24], [K.fl0 + .5, 24.6], [K.T0, 3.4]]), flYaw = track([[K.fl0, 1.2], [K.T0, D1]]), flP = track([[K.fl0, .62], [K.T0, .025]]);
  // canoe-relative: [t, distance from the canoe centre, azimuth from the camera to the canoe, height, yaw, pitch, F]
  K.pan0 = K.arrived - .5; K.pan1 = K.arrived + 1.5; K.up0b = K.how - .1; K.up1b = K.compass + .1;
  // the closing orbit (7.04) runs until just before the last word ends, then (c01>c02 handoff, shots.md §9) the camera cranes up and tilts
  // into the Milky Way: at H.a its view IS the sky plate (handoff4 skyCam: yaw .3, pitch −.58, F 1100); film.mjs draws the plate from H.a on.
  const HO = hand('c01>c02', T); K.tail0 = E('going to build') - .2; K.sky = HO.a;
  const RK = [[K.T0, 27, D1, 3.0, D1, .02, 1400], [K.noMap - .3, 29, -.14, 3.4, -.15, .025, 1400], [K.pan0, 28, -.26, 3.0, -.24, .025, 1400], [K.pan1, 25, .55, 3.5, .95, .03, 1400], [K.up0b, 24.5, .62, 3.6, 1.0, .035, 1400], [K.up1b, 24, .88, 9, 1.02, .26, 1200],
    [K.tail0, 23.3, .93, 8.6, 1.06, .245, 1205], [K.sky, 21, 1.1, 13, HO.o.yaw, HO.o.pitch, HO.o.F]];
  const ENDS = { 1: -.45, 2: .065 };   // the orbit keeps its speed into the crane-up (yaw turns back toward the sky view)
  const rk = [1, 2, 3, 4, 5, 6].map((i) => track(RK.map((k, j) => (j === RK.length - 2 && ENDS[i] != null ? [k[0], k[i], ENDS[i]] : [k[0], k[i]]))));
  const camC = (t) => {
    if (t < K.fl0) return camera({ x: cXc(t), y: cYc(t), z: cZc(t), yaw: cYawc(t), pitch: cPitchc(t), F: cFc(t) });
    if (t < K.T0) return camera({ x: flX(t), y: flY(t), z: flZ(t), yaw: flYaw(t), pitch: flP(t), F: 1400 });
    const k = KC(t), d = rk[0](t), az = rk[1](t);
    return camera({ x: k.x - d * Math.sin(az), y: rk[2](t), z: k.z - d * Math.cos(az), yaw: rk[3](t), pitch: rk[4](t), F: rk[5](t) });
  };
  const LIGHT2 = { az: NAVH + .02, el: .0025 }, STAR = [.62, .19], STORMAZ = 1.72;
  const flash = (t) => { let f = 0; for (const [a, d] of [[K.storms + .02, .067], [K.storms + .3, .067], [K.storms + .42, .034]]) if (t >= a && t < a + d) f = 1; return f + .25 * pulse(t, K.storms - .1, K.storms + .9); };
  const ROSEB = roseBoats(RZ.R);
  K.fly0 = K.fifty - .2;
  function takeC(ctx, t) {
    const C = camC(t), Ls = { ...LIGHT2, ign: .55 + .45 * u01(t, K.next - .2, K.next + 1.2), ring: .35 + .65 * eoX(u01(t, K.really - .05, K.really + .9)), pulse: .4 * pulse(t, K.really - .05, K.really + 1.2), size: 1.5 };
    const lightOn = t < K.ours + .95, L = lightOn ? lightAt(C, Ls) : null, lens = lensOf(C, Ls, L), dawn = .62 * sio(u01(t, K.arrived - .3, K.arrived + 1.6)) * (1 - sio(u01(t, K.tail0, K.sky - .15)));   // looking up, away from the dawn: the night sky of the plate
    drawSky(ctx, t, C, { lens: lens && L.x > -300 && L.x < 2220 ? lens : null, dawn, dawnAz: 1.3 });
    if (t > K.fl0) island(ctx, t, C, { az: 1.4, w: .2, dawn: dawn / .62 });
    // the boats and their lights
    const n = NP(t), d = DP(t), lanN = u01(t, K.some2 - .1, K.navigate - .1);
    const sp = C.D(...skyDir(...STAR));
    const glints = [];
    if (L && L.x > -200 && L.x < 2120 && C.pitch < .45) glints.push({ x: L.x, y: L.y, col: '#bfefff', a: Ls.ign, w: 3, spread: .2 });
    const lanP = C.P(n.x - .5 * Math.cos(n.head), 1.3, n.z + .5 * Math.sin(n.head));
    if (lanP && lanN > 0 && C.pitch < .45) glints.push({ x: lanP[0], y: C.hy + 2, col: '#ffb35c', a: .8 * lanN, w: 2, spread: .12, fade: 260 });
    const rA = eoX(u01(t, K.ours - .05, K.ours + .9)), lamps = (b) => clamp((u01(t, K.ours + .05, K.ours + .9) * 1.6 - b.ign * .6) / .3);
    if (rA > 0) for (const b of ROSEB) { const p = C.P(RZ.x + Math.sin(b.th) * b.rr, 1.2, RZ.z + Math.cos(b.th) * b.rr); if (p && p[0] > -50 && p[0] < 1970) glints.push({ x: p[0], y: p[1] + p[2] * 1.2, col: '#ffb35c', a: .6 * lamps(b), w: 1, spread: .05, fade: 50 + p[2] * 3 }); }
    const KK = KC(t), fireG = t > K.fl0 ? C.P(KK.x + .35 * Math.cos(CH) + 1.2 * Math.sin(CH), 1.6, KK.z - .35 * Math.sin(CH) + 1.2 * Math.cos(CH)) : null;
    if (fireG && fireG[0] > -100 && fireG[0] < 2020 && C.pitch < .45) glints.push({ x: fireG[0], y: C.hy + 2, col: '#ffb35c', a: .9, w: 3, spread: .14, fade: 340 });
    if (dawn > .02 && C.pitch < .45) { const dp = C.D(...skyDir(1.3, .004)); if (dp && dp[0] > -400 && dp[0] < 2320) glints.push({ x: dp[0], y: dp[1], col: '#ffb88a', a: dawn * 1.1, w: 60, spread: .6 }); }   // the dawn's glitter path
    drawSea(ctx, t, C, { glints, dawn: dawn * .8 });
    drawLight(ctx, t, C, Ls, L);
    if (t > K.pan0 - .4 && lightOn) storm(ctx, t, C, { az: STORMAZ, w: .32, flash: flash(t), fx: -.2, bolt: Math.floor((t - K.storms) * 3) + 11 });
    // rose (lies on the water, dark until "ours")
    rose(ctx, t, C, { x: RZ.x, z: RZ.z, R: RZ.R, a: rA });
    // wakes from the one point, the marks
    const top = clamp((C.pitch - .5) / .6), wA = (.55 + .6 * top) * (1 - .4 * u01(t, K.up1, K.up1 + 1)), mAge = top > .2 ? 999 : 22;
    wake(ctx, t, C, PATHS.drift, sD(t), { a: .8 * wA, life: 30, min: .3, maxAge: mAge });
    wake(ctx, t, C, PATHS.nav, sN(t), { a: wA, life: 40, min: .35, maxAge: mAge });
    const mk = [u01(t, K.few - .05, K.few + .5), u01(t, K.few + .25, K.few + .8), u01(t, K.few + .55, K.few + 1.1)];
    marks(ctx, t, C, TURNS, mk);
    // boats far → near
    const list = [
      { x: d.x, z: d.z, head: d.head + .35 * Math.sin(t * .4), roll: .1 * Math.sin(t * .7), sail: 'slack', lantern: 0, light: L ? [L.x, L.y] : null },
      { x: n.x, z: n.z, head: n.head, roll: -.06, sail: 'full', sailSide: -.45, fig: 'sight', lantern: lanN, light: sp, star: sp },
    ];
    if (rA > 0 || t > K.hd0) for (const b of ROSEB) list.push({ x: RZ.x + Math.sin(b.th) * b.rr, z: RZ.z + Math.cos(b.th) * b.rr, head: b.head, sail: 'none', lantern: lamps(b), scale: b.sc * .8 });
    list.sort((a, b) => C.depth(b.x, 0, b.z) - C.depth(a.x, 0, a.z));
    for (const B of list) {
      const r = boat(ctx, t, C, B);
      if (B.fig && r && r.hand && sp && t < K.cr1) {   // the sighting line from the hand to the star
        const u = u01(t, K.navigate - .1, K.navigate + .5) * (1 - u01(t, K.cr0 + .3, K.cr0 + .8));
        if (u > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(216,247,255,.55)'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 7]); ctx.beginPath(); ctx.moveTo(r.hand[0], r.hand[1]); ctx.lineTo(r.hand[0] + (sp[0] - r.hand[0]) * eoX(u), r.hand[1] + (sp[1] - r.hand[1]) * eoX(u)); ctx.stroke(); ctx.restore(); }
      }
    }
    // the sighted star (always in the sky; it brightens when the figure points at it)
    if (sp && t < K.sky - .2) { const b = (.55 + .45 * u01(t, K.navigate - .1, K.navigate + .4)) * (1 - sio(u01(t, K.tail0 + .2, K.sky - .25))); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sp[0], sp[1], 0, sp[0], sp[1], 26); g.addColorStop(0, `rgba(240,250,255,${.9 * b})`); g.addColorStop(.2, `rgba(180,220,255,${.3 * b})`); g.addColorStop(1, 'rgba(120,160,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sp[0], sp[1], 26, 0, 7); ctx.fill(); ctx.strokeStyle = `rgba(230,245,255,${.5 * b})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sp[0] - 18, sp[1]); ctx.lineTo(sp[0] + 18, sp[1]); ctx.moveTo(sp[0], sp[1] - 18); ctx.lineTo(sp[0], sp[1] + 18); ctx.stroke(); ctx.restore(); }
    // 7.01 … 7.04 the canoe, its route, its label, the instruments, the star compass
    if (t > K.fl0) {
      route(ctx, t, C, KK, u01(t, K.T0 - .6, K.open + .6));
      starCompass(ctx, t, C, KK, { u: u01(t, K.compass - .12, K.compass + 1.3), lab: u01(t, K.compass + .7, K.compass + 1.4), stars: u01(t, K.compass + .4, K.build + 1.0), R: 15 });
      const cn = canoe(ctx, t, C, KK);
      const tu = u01(t, K.T0 + .15, K.T0 + 1.1) - u01(t, K.noMap - .7, K.noMap - .25);
      if (cn.tagP && tu > 0) tag(ctx, t, cn.tagP[0], cn.tagP[1], tu, 'HŌKŪLEʻA · 1976', 'HAWAIʻI → TAHITI', { dx: 70, len: 80 });
      const iu = (w0, w1) => u01(t, w0 - .18, w0 + .32) + u01(t, w1 - .2, w1 + .25);
      instruments(ctx, t, { u: [iu(K.noMap, K.noComp), iu(K.noComp, K.noInst), iu(K.noInst, K.arrived)], spin: [sio(u01(t, K.noMap + .1, K.noComp - .1)), sio(u01(t, K.noComp + .1, K.noInst - .1)), sio(u01(t, K.noInst + .1, K.arrived - .1))] });
    }
    // 6.03 the hand with the small compass (carried in from below, lowered out on "ours")
    const hu = eoX(u01(t, K.hd0 + .2, K.hd0 + .95)) - eiX(u01(t, K.ours - .3, K.ours + .3));
    if (hu > 0.001) {
      const ns = u01(t, K.hd0 + .5, K.yours + .2);
      const needle = 2.2 * (1 - settle(ns)) + .04 * Math.sin(t * 1.7);
      handCompass(ctx, t, { x: 1330, y: 1520 - 760 * hu, s: 3.0, glow: eoX(u01(t, K.yours - .05, K.yours + .6)), needle });
    }
  }
  // 4.01 the title (screen space): two lines rise out of their own masks on 'survive' and on 'singularity', glow cream on amber, leave upward
  const TITLE = [['HOW TO SURVIVE', K.survive - .08, 236], ['THE SINGULARITY', K.sing2 - .06, 396]];
  function titleCard(ctx, t) {
    if (t < K.survive - .1 || t > K.you + .5) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.font = '400 150px Anton'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    const capH = 150 * .86;
    TITLE.forEach(([txt, t0, y], i) => {
      const inU = eoX(u01(t, t0, t0 + .6)), outU = eiX(u01(t, K.you - .12 + i * .07, K.you + .28 + i * .07));
      if (inU <= 0 || outU >= 1) return;
      const dy = (1 - inU) * capH * 1.15 - outU * capH * 1.2, drift = (t - t0) * 3;   // keeps rising a few px while it stands
      ctx.save(); ctx.beginPath(); ctx.rect(0, y - capH - 18, 1920, capH + 34); ctx.clip();
      ctx.shadowColor = 'rgba(255,170,80,.6)'; ctx.shadowBlur = 38; ctx.fillStyle = 'rgba(243,239,226,.95)'; ctx.fillText(txt, 960, y + dy - drift);
      ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,200,130,.5)'; ctx.fillStyle = '#f3efe2'; ctx.fillText(txt, 960, y + dy - drift);
      ctx.restore();
    });
    ctx.restore();
  }
  prepareSky();
  await ready();

  const frame = (ctx, t) => {
    if (t < K.open0) { takeA(ctx, t); return; }
    if (t < K.close1 + .02) { drawClip(ctx, t, T, { open: [K.open0, K.open1], close: [K.close0, K.close1], yOpen, yClose: 540, cutFrame: 87 }); return; }
    if (t < K.sw) { takeB(ctx, t); titleCard(ctx, t); return; }
    takeC(ctx, t);
  };
  const SND = (f, t, v = .6) => ({ f, t, v });
  return [
    { t: 0, tr: 'cut', d: .1, draw: frame, print: { riso: .35 } },
    { t: K.open0, tr: 'cut', d: .1, draw: frame, print: { riso: .15, halftone: .4, hatch: .3 } },
    { t: K.close1 + .02, tr: 'cut', d: .1, draw: frame, print: { riso: .35 } },
  ];
}
