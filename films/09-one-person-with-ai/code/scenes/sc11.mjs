// Film 8 · chunk c11 · 10a + END "Put back together" (shots 10.01–E.01, 544.31–616.52 s). Builder: B3.
// World: c01's night valley (lib/f8_c11_world.mjs copies its land so it is the same one), the hero workshop at (1000, 868) d 0 drawn as
// the anatomy plate run backwards; the hierarchies (B1's hierarchy 'stack') stand in the sky over the valley at (600, 640), s .3; a tower
// of cold white light on ridge 2; the knoll at depth −0.3 (crest (1700, 264.5)) is the conductor's place in the end image. ONE camera
// { x, y, dist } for the whole chunk, keys in log dist (camKeys); 'z' segments are pure zooms about their fixed point.
//
// | shot  | VO (accent)                                  | image                                                                      | hero light        | camera                                  | flow on                            | sound            |
// |-------|----------------------------------------------|----------------------------------------------------------------------------|-------------------|-----------------------------------------|------------------------------------|------------------|
// | 10.01 | put it back **together**                     | the gold light of c10 shrinks to a node of the plate's memory; gold threads| the three organs  | pull back out of the node (fixed point) | take (light plate in)              | whoosh_airy,     |
// |       |                                              | fly in from the left, fireflies from above, an amber light from the right  |                   | to the plate framing                    |                                    | shimmer_rings    |
// |       |                                              | brings the figure; on together they lock in with a flash                   |                   |                                         |                                    |                  |
// | 10.02 | a **living** thing with three organs         | leaders and labels MEMORY HANDS WILL; a light runs from the figure through | the running pulse | breathing hold                          | take                               | foil_glint       |
// |       |                                              | the swarm into the network; on living the network pulses                   |                   |                                         |                                    |                  |
// | 10.03 | forgets **nothing**                          | labels wipe out, the side wall lowers; a thread stitches in on nothing     | the stitch        | hold                                    | take                               | pages, chime     |
// | 10.04 | through the **night**                        | the plate frame retracts, the night comes back; the fireflies leave the    | the fireflies     | slight pull back                        | take                               | wings, bulb      |
// |       |                                              | room and circle the roof, the roof lowers; on night they light up          |                   |                                         |                                    |                  |
// | 10.05 | deciding what's **worth** making             | the figure steps back into the door, the front wall lowers; hand raised    | the figure        | settle on the door                      | pull back                          | pages            |
// | 10.06 | that will is **one** person                  | the closed workshop in the valley, the figure alone in the bright door;     | amber pulse       | pull back, then crane up into the sky   | crane (a)                          | tick, whoosh_up  |
// |       |                                              | on one its amber pulses                                                    |                   |                                         |                                    |                  |
// | 10.07 | **two thousand years**, Roelof Botha says    | in the sky an engraving of hierarchies is cut from the bottom up (legion,   | the burin line    | settle wide, push to the legion, travel | take                               | pencil           |
// |       |                                              | masons' lodge, factory, office); whole on two thousand; label ROELOF BOTHA |                   | slowly up through the tiers             |                                    |                  |
// | 10.08 | That's what is **changing** now              | the figures turn into gold nodes from the top down, the tiers fall into a  | the gold nodes    | pull back over the valley               | pull back (a)                      | drop             |
// |       |                                              | flat network; the last on changing                                         |                   |                                         |                                    |                  |
// | 10.09 | a billion-dollar company **alone**           | on ridge 2 one tiny figure; a tower of cold white light grows out of it,   | the tower         | hold, slight push                       | the camera turns away              | swell            |
// |       |                                              | complete on alone                                                          |                   |                                         |                                    |                  |
// | 10.10 | not the question that **matters**            | the camera turns to the dark land, the tower leaves the frame on matters   | –                 | pan right and push                      | take                               | whoosh           |
// | 10.11 | a **few** people … or **millions** do        | two cold towers rise on the left (stand on few); on millions small warm    | the lights        | rise                                    | take                               | shimmer_rings    |
// |       |                                              | lights go on ridge after ridge to the horizon                              |                   |                                         |                                    |                  |
// | 10.12★| a million small **orchestras**               | the valley of lights under the Milky Way, the knoll in front with the       | the orchestras    | pull back to the wide                   | take                               | wings            |
// |       |                                              | conductor from behind; the swarms rise over all roofs; the tower shrinks   |                   |                                         |                                    |                  |
// | 10.13 | what would you **conduct**?                  | a small swarm with a gold thread floats before the lens and waits; the     | the swarm         | push toward the knoll                   | take                               | chime            |
// |       |                                              | conductor turns his head into profile; on conduct the swarm turns to us    |                   |                                         |                                    |                  |
// | 10.14 | Tell me in the **comments**                  | the swarm rises into the Milky Way's core, the camera tilts up and settles | the core          | tilt up, pull back into the wide        | take into E.01                     | whoosh_up        |
// | E.01  | –                                            | the end image: valley of lights, the knoll, the conductor tiny under the   | the core          | still (the film's camera float)         | film end                           |                  |
// |       |                                              | core; end-screen fields left/right stay sky, the button field is the knoll |                   |                                         |                                    |                  |
import { W, H, rgba, clamp, lin, mix, eio, eout } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready, F8, nightLand, landCam, ridgeY, firefly, mistBand, conductor, eoutX, einX, qio } from '../lib/f8_kit.mjs';
import { b3Ready, camKeys, sine } from '../lib/f8_c09_world.mjs';
import { glowFrom, nameLabel } from '../lib/f8_c02_world.mjs';
import { hierarchy } from '../lib/f8_hierarchy.mjs';
import { c01Clouds, c01Village, partsReady } from '../lib/f8_c01_parts.mjs';
import { HERO, P_STAR, CAM_E, landRow, fieldRow, orchestras, knoll, crestConductor, TOWERS, tower, platePart, threadPath, spr, worldWarm } from '../lib/f8_c11_world.mjs';
import { prng } from '../engine.mjs';

export default async (T, R) => {
  await ready(); await partsReady();
  const { in: HI } = handsOf('c11', T);
  const S = (p, n) => T.S('10a', p, n);
  const A = {
    so: S('So now'), together: S('together'), an: S('An A.I.'), living: S('living'), organs: S('organs'), amem: S('A memory'), nothing: S('nothing'),
    hands: S('Hands that'), night: S('night'), andwill: S('And a will'), worth: S('worth'), inits: S('In its'), one: S('one person'),
    for: S('For two'), two: S('two thousand'), roelof: S('Roelof'), way: S('same way'), thats: S("That's what"), changing: S('changing'),
    maybe: S('Maybe'), alone: S('alone'), but: S("But that's"), matters: S('matters'), q: S('The question is'), few: S('few'), millions: S('millions'),
    honestly: S('Honestly'), million: S('million small'), orch: S('orchestras'), giant: S('giant'), soif: S('So if'), yours: S('yours'),
    conduct: S('conduct'), tell: S('Tell me'), comments: S('comments'), end: T.E('10a'),
  };
  A.giantOne = A.giant + .4;
  if (process.env.C11_ANCHORS) console.log(Object.entries(A).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(' · '));
  const TB = HI.b, TEND = T.duration;

  // ================================================================ the camera
  const zPath = (t0, [x0, y0, k0], t1, [x1, y1, k1]) => { const km = Math.sqrt(k0 * k1), px = (x0 * k0 - x1 * k1) / (k0 - k1), py = (y0 * k0 - y1 * k1) / (k0 - k1);
    return [[mix(t0, t1, .5), px + (x0 - px) * k0 / km, py + (y0 - py) * k0 / km, 1 / km, 'z'], [t1, x1, y1, 1 / k1, 'z']]; };
  const C_PL = [1010.6, 841.7, .103];
  const KEYS = [
    [TB, P_STAR[0], P_STAR[1], .03], ...zPath(TB, [P_STAR[0], P_STAR[1], 1 / .03], A.together - .2, [C_PL[0], C_PL[1], 1 / C_PL[2]]),
    [A.an + .3, 1010.5, 841.8, .1015], [A.amem - .2, 1010.3, 842, .098], [A.hands - .1, 1010, 841, .099], [A.night + .5, 1008, 834, .118],
    [A.worth - .6, 1012, 842, .108], [A.worth + .4, 1012, 842.5, .106],
    ...zPath(A.worth + .4, [1012, 842.5, 1 / .106], A.one - .1, [1005, 800, 1 / .35]), [A.one + .15, 1005, 799, .352],
    ...zPath(A.one + .15, [1005, 799, 1 / .352], A.two + .55, [600, 200, 1 / 1.1]),
    ...zPath(A.two + .55, [600, 200, 1 / 1.1], A.roelof + .9, [600, 525, 1 / .55]),
    [A.way, 600, -180, .55], [A.thats - .05, 600, -183, .55],
    ...zPath(A.thats - .05, [600, -183, 1 / .55], A.maybe + .7, [520, 390, 1 / .9]),
    [A.alone + .15, 530, 388, .88], [A.matters, 1450, 380, .95], [A.millions + .4, 1480, 250, 1.02], [A.honestly + 1.9, 1550, 230, 1.1],
    [A.soif - .2, 1560, 228, 1.08], [A.yours + .6, 1700, 218, .72], [A.conduct + .3, 1700, 216, .715], [A.tell + .6, 1700, 60, .95],
    [A.comments + 1.0, CAM_E.x, CAM_E.y, CAM_E.dist], [TEND, CAM_E.x, CAM_E.y - 4, CAM_E.dist * 1.025],
  ];
  const ck = camKeys(KEYS);
  const breath = (t) => 1 + .012 * Math.sin((t - A.an) * TAU / 2.6) * clamp((t - A.an + .2) / .6) * clamp((A.amem - t) / .6);
  const cam = (t) => { const c = ck(t); return { x: c.x, y: c.y, dist: c.d * breath(t) }; };

  // ================================================================ the plate (10.01–10.06)
  const ONE = (t0, t1, t) => clamp((t - t0) / (t1 - t0));
  const HANDS_W = [HERO.x - 4 * HERO.s, HERO.y - 34 * HERO.s], ROOF_C = [HERO.x, HERO.y - 120 * HERO.s];
  const DOOR_W = [HERO.x + 101 * HERO.s, HERO.y - 26 * HERO.s], MEM_W = [HERO.x - 62 * HERO.s, HERO.y - 46 * HERO.s], WILL_HAND = [HERO.x + 109 * HERO.s, HERO.y - 46 * HERO.s];
  // the fireflies (hands): fly in from above/right, orbit the hands, leave the room on "Hands" and circle the roof
  const FLY = Array.from({ length: 16 }, (_, i) => { const r = prng(600 + i * 7); const a = r() < .65;
    return { ph: r() * TAU, sp: .25 + r() * .35, dir: r() < .5 ? 1 : -1, rr: .55 + .45 * r(), rr2: .6 + .4 * r(), sz: .75 + .5 * r(), t0: A.together - 1.55 - r() * .35,
      S: a ? [mix(960, 1130, r()), 772 - r() * 30] : [1125 + r() * 30, mix(800, 880, r())], lag: i * .035 }; });
  const flyPos = (F, t) => {
    const aH = F.ph + t * F.sp * F.dir * 1.4, oH = [HANDS_W[0] + Math.cos(aH) * 16 * F.rr, HANDS_W[1] + Math.sin(aH) * 3.84 * F.rr];
    let p = oH;
    if (t < A.together + .05) { const e = eio(ONE(F.t0, A.together, t)); p = [mix(F.S[0], oH[0], e) - Math.sin(Math.PI * e) * 14, mix(F.S[1], oH[1], e) - Math.sin(Math.PI * e) * 10]; }
    const e2 = eio(ONE(A.hands - .15 + F.lag, A.hands + .95 + F.lag, t));
    if (e2 > 0) { const aR = F.ph * 1.7 + t * F.sp * 1.1, oR = [ROOF_C[0] + Math.cos(aR) * 48 * F.rr2, ROOF_C[1] + Math.sin(aR) * 12.8 * F.rr2]; p = [mix(p[0], oR[0], e2), mix(p[1], oR[1], e2) - Math.sin(Math.PI * e2) * 9]; }
    return p;
  };
  // the memory's threads: from beyond the left edge into the brain network
  const THR = Array.from({ length: 7 }, (_, j) => { const r = prng(700 + j * 11), s = [886 - r() * 20, mix(790, 890, r())], e = [MEM_W[0] + (r() - .5) * 28, MEM_W[1] - 2 + r() * 10];
    const c = [mix(s[0], e[0], .5), Math.min(s[1], e[1]) - 18 - r() * 22], arr = A.together - .18 + j * .025, t0 = arr - 1.15 - r() * .3, pts = [];
    for (let q = 0; q <= 16; q++) { const u = q / 16; pts.push([(1 - u) ** 2 * s[0] + 2 * (1 - u) * u * c[0] + u * u * e[0], (1 - u) ** 2 * s[1] + 2 * (1 - u) * u * c[1] + u * u * e[1]]); }
    return { pts, t0, arr }; });
  const AMB0 = [1128, 812];                                                     // the amber light that brings the figure, from the right
  const ambPos = (t) => { const e = eio(ONE(A.together - 1.25, A.together - .12, t)); return [mix(AMB0[0], DOOR_W[0], e), mix(AMB0[1], DOOR_W[1], e) - Math.sin(Math.PI * e) * 12]; };
  // the pulse 10.02: will → hands → memory, arriving on "living"
  const PULSE0 = A.living - .95, PULSE1 = A.living;
  const pulsePath = [WILL_HAND, HANDS_W, MEM_W];
  const pulseAt = (u) => { const f = u * 2, i = Math.min(1, Math.floor(f)), q = f - i; return [mix(pulsePath[i][0], pulsePath[i + 1][0], q), mix(pulsePath[i][1], pulsePath[i + 1][1], q) - Math.sin(Math.PI * q) * 6]; };

  function plate(ctx, t, c, P0) {
    const k0 = P0.k, hx = P0.X(HERO.x), hy = P0.Y(HERO.y), hs = HERO.s * k0;
    if (hx < -400 || hx > W + 400 || hy < -200 || hy > H + 400) return;
    const lab = (t0) => eoutX(ONE(t0, t0 + .45, t)) * (1 - einX(ONE(A.amem - .6, A.amem - .25, t)));
    const lock = Math.exp(-Math.pow((t - A.together - .08) / .3, 2));
    const pl = platePart(ctx, t, {
      x: hx, y: hy, s: hs, paper: 0, frame: eio(ONE(TB + .5, A.together + .1, t)) * (1 - eio(ONE(A.hands + .05, A.night - .1, t))), plateRect: { x: 110, y: 64, w: W - 220, h: 846 },
      lift: { side: 1 - qio(ONE(A.amem + .1, A.amem + 1.0, t)), roof: 1 - qio(ONE(A.hands + .62, A.hands + 1.42, t)), front: 1 - qio(ONE(A.worth - .95, A.worth - .1, t)) },
      memA: eio(ONE(A.together - .4, A.together + .12, t)), memGlow: 1.2 * lock + 1.1 * Math.exp(-Math.pow((t - A.living - .15) / .4, 2)) + .5 * Math.exp(-Math.pow((t - A.nothing - .2) / .4, 2)),
      stitches: [{ t0: A.nothing - .4, u: .62, v: .42, glyph: 'check', from: [hx - 520, hy - 420], dur: .8 }], pulse: { u: ONE(A.living - .05, A.living + 1.3, t), x: .5, y: .5 },
      leaders: clamp(ONE(A.an - .05, A.an + 1.1, t) - ONE(A.amem - .45, A.amem + .35, t)), labelX: 1330, labelY: 300, labelGap: 150,
      labels: { memory: lab(A.an + .35), hands: lab(A.an + .65), will: lab(A.an + .95) },
      will: eoutX(ONE(A.worth - .1, A.worth + .45, t)), handsGlow: eio(ONE(A.together - .5, A.together, t)),
      fig: t < A.together + .4 ? { a: eoutX(ONE(A.together - .2, A.together + .35, t)), cx: P0.X(DOOR_W[0]), cy: P0.Y(DOOR_W[1] - 8) } : {},
      figGlow: eoutX(ONE(A.worth - .1, A.worth + .45, t)) * .9 + .8 * Math.exp(-Math.pow((t - A.one - .12) / .3, 2)) + .9 * lock,
      willPulse: 1.6 * Math.exp(-Math.pow((t - A.one - .12) / .3, 2)),
      ws: { lit: 1, glowA: 1.2 * (1 + .25 * Math.sin((t - A.an) * TAU / 2.6) * clamp((t - A.an) / .5) * clamp((A.amem - t) / .5)), winDim: 0, thread: 0 },
    });
    // the gold seed where c10's light went in, until the network is there
    { const a = 1 - eio(ONE(A.together - .1, A.together + .5, t)); if (a > 0) spr(ctx, 'gold', P0.X(P_STAR[0]), P0.Y(P_STAR[1]), Math.max(14, 16 * hs), .9 * a); }
    // threads
    for (const th of THR) {
      if (t < th.t0 || t > th.arr + .5) continue;
      const q1 = eio(ONE(th.t0, th.arr, t)), q0 = t < th.arr ? Math.max(0, q1 - .5) : eio(ONE(th.arr, th.arr + .45, t));
      threadPath(ctx, th.pts.map(([x, y]) => [P0.X(x), P0.Y(y)]), q0, q1, { w: Math.max(1.2, .55 * hs), head: t < th.arr ? Math.max(8, 5 * hs) : 0 });
    }
    // fireflies
    if (t > A.together - 1.95) {
      const pu = Math.exp(-Math.pow((t - A.night - .05) / .28, 2)) + .8 * lock;
      FLY.forEach((F, i) => {
        if (t < F.t0) return;
        const P = (tt) => { const w = flyPos(F, Math.max(tt, F.t0)); return [P0.X(w[0]), P0.Y(w[1])]; }, p = P(t), trail = []; for (let q = 6; q >= 0; q--) trail.push(P(t - .4 * q / 6));
        firefly(ctx, t, { x: p[0], y: p[1], trail, s: Math.min(.38 * hs, 2.4) * F.sz, seed: i + 6, pulse: pu, glow: 1 + .6 * Math.exp(-Math.pow((t - A.night - .05) / .4, 2)) });
      });
    }
    // the amber light bringing the figure
    if (t > A.together - 1.3 && t < A.together + .3) { const p = ambPos(t), a = 1 - eio(ONE(A.together - .1, A.together + .3, t)); spr(ctx, 'amber', P0.X(p[0]), P0.Y(p[1]), Math.max(18, 22 * hs), .9 * a); }
    // the lock-in flash at the three organs
    if (lock > .02) { spr(ctx, 'gold', pl.memory[0], pl.memory[1], 90 * hs * .4, .6 * lock); spr(ctx, 'green', pl.hands[0], pl.hands[1], 70 * hs * .4, .5 * lock); spr(ctx, 'amber', pl.will[0], pl.will[1] - 10 * hs, 60 * hs * .4, .6 * lock); }
    // the running pulse (10.02)
    if (t > PULSE0 && t < PULSE1 + .2) {
      const u = eio(ONE(PULSE0, PULSE1, t)), [wx, wy] = pulseAt(u), which = u < .45 ? 'amber' : u < .8 ? 'green' : 'gold';
      const trail = []; for (let q = 0; q <= 8; q++) { const w = pulseAt(Math.max(0, u - .18 * q / 8)); trail.push([P0.X(w[0]), P0.Y(w[1])]); }
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(which === 'amber' ? F8.amber : which === 'green' ? F8.green : F8.gold, .6); ctx.lineWidth = Math.max(1.5, .6 * hs); ctx.lineCap = 'round';
      ctx.beginPath(); trail.forEach(([x, y], q) => (q ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore();
      spr(ctx, which, P0.X(wx), P0.Y(wy), Math.max(12, 9 * hs), .95 * (1 - ONE(PULSE1, PULSE1 + .2, t)));
    }
  }

  // ================================================================ the hierarchies (10.07–10.08)
  const HB = { x: 600, y: 640, s: .3 }, H_TOP = HB.y - 4 * 780 * HB.s;
  const REV0 = A.one + .9, REV1 = A.two + .45, DIS0 = A.thats + .05, DIS1 = A.changing + .3;
  function hier(ctx, t, c, P0) {
    if (t < REV0 || t > A.alone) return;
    const k0 = P0.k, x = P0.X(HB.x), y = P0.Y(HB.y), s = HB.s * k0;
    const ry = mix(HB.y + 20, H_TOP - 40, eio(ONE(REV0, REV1, t))), rys = P0.Y(ry), a = 1 - eio(ONE(A.maybe - .2, A.maybe + 1.3, t));
    if (rys > H + 20 || a <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, Math.max(-10, rys), W, H + 20); ctx.clip();
    hierarchy(ctx, t, { kind: 'stack', x, y, s, a, dissolve: eio(ONE(DIS0, DIS1, t)), flat: { y: P0.Y(mix(-60, 960, eio(ONE(A.changing + .45, A.maybe + .75, t)))), w: 1300 * 1.7 }, light: { x: x + 900, y: y - 1600 * s } });
    ctx.restore();
    // the burin line cutting the engraving from the bottom up
    if (t < REV1 + .15) { const al = 1 - ONE(REV1, REV1 + .15, t), hw = 760 * s; if (rys > -10 && rys < H + 10) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(x - hw, 0, x + hw, 0); g.addColorStop(0, 'rgba(243,217,160,0)'); g.addColorStop(.5, rgba(F8.goldCore, .85 * al)); g.addColorStop(1, 'rgba(243,217,160,0)');
      ctx.fillStyle = g; ctx.fillRect(x - hw, rys - 1, hw * 2, 2.2); ctx.restore(); spr(ctx, 'gold', x + Math.sin(t * 9) * hw * .6, rys, 26, .8 * al); } }
  }

  // ================================================================ the land (10.09–E.01)
  const LIGHTS0 = A.millions - .15, RISE = A.million - .05;
  function towersAt(t) {
    const sh = mix(1, .15, eio(ONE(A.giant - .1, A.giantOne + .35, t)));
    return [{ g: eio(ONE(A.maybe + .45, A.alone, t)), s: sh }, { g: eio(ONE(A.few - 1.1, A.few, t)), s: mix(1, .14, eio(ONE(A.giant, A.giantOne + .4, t))) }, { g: eio(ONE(A.few - .8, A.few + .15, t)), s: mix(1, .16, eio(ONE(A.giant + .05, A.giantOne + .45, t))) }];
  }
  // the sky's core of the Milky Way (rises out of the dark from 10.12 on), at a fixed sky point (depth 40)
  const CORE_REF = [978, 329.5];
  function core(ctx, t, c) {
    const a = .25 + .75 * eio(ONE(A.honestly, A.comments + 1.2, t)), P = landCam(c, 40), x = P.RX(CORE_REF[0]), y = P.RY(CORE_REF[1]);
    if (x < -500 || x > W + 500 || y < -300 || y > H + 300) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.rotate(-.38); ctx.scale(1, .36);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 330); g.addColorStop(0, rgba('#fff3dc', .32 * a)); g.addColorStop(.35, rgba('#d9c9f0', .16 * a)); g.addColorStop(1, 'rgba(120,110,200,0)');
    ctx.fillStyle = g; ctx.fillRect(-330, -330, 660, 660); ctx.restore();
    // a dense cloud of small stars in the core
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = prng(4411);
    for (let i = 0; i < 260; i++) { const u = (r() + r() + r() - 1.5) * 280, v = (r() + r() - 1) * 70, px = x + u * Math.cos(-.38) - v * Math.sin(-.38), py = y + u * Math.sin(-.38) + v * Math.cos(-.38), s = r() < .9 ? 1 : 1.8, tw = .6 + .4 * Math.sin(t * (1 + r() * 2) + i);
      ctx.fillStyle = rgba('#f6f0ff', (.25 + .5 * r()) * a * tw); ctx.fillRect(px, py, s, s); }
    ctx.restore();
  }

  // ================================================================ the swarm before the lens (10.13–10.14), screen space
  const FG = Array.from({ length: 7 }, (_, i) => { const r = prng(900 + i * 13); return { a: r() * TAU, R: 40 + r() * 60, sp: (.3 + r() * .3) * (r() < .5 ? 1 : -1), sz: .8 + r() * .4, dl: r() * .25 }; });
  const FG_IN0 = A.soif - .15, FG_IN1 = A.soif + 1.2, FG_UP0 = A.tell - .1, FG_UP1 = A.comments + 1.1;
  const fgCentre = (t) => { const e = eio(ONE(FG_IN0, FG_IN1, t)), u = eio(ONE(FG_UP0, FG_UP1, t));
    const x = mix(1800, 1400, e) + 12 * Math.sin(t * .7), y = mix(1260, 700, e) + 9 * Math.sin(t * .9 + 1);
    return [mix(x, 962, u), mix(y, 352, u) - Math.sin(Math.PI * u) * 60]; };
  function fgSwarm(ctx, t) {
    if (t < FG_IN0 || t > FG_UP1 + .6) return;
    const turn = eoutX(ONE(A.conduct - .05, A.conduct + .5, t)), up = eio(ONE(FG_UP0, FG_UP1, t)), fade = 1 - ONE(FG_UP1, FG_UP1 + .6, t);
    const sc = mix(1, 1.28, turn) * mix(1, .08, up), pu = Math.exp(-Math.pow((t - A.conduct - .1) / .3, 2));
    const pos = (F, tt) => { const [cx, cy] = fgCentre(tt), aa = F.a + tt * F.sp, R = F.R * mix(1, .75, turn) * mix(1, .1, eio(ONE(FG_UP0, FG_UP1, tt))); return [cx + Math.cos(aa) * R, cy + Math.sin(aa) * R * .5]; };
    // the gold thread one of them carries
    { const p0 = pos(FG[0], t), sw = Math.sin(t * 1.3) * 18, L = 170 * sc; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F8.gold, .75 * fade); ctx.lineWidth = 1.8 * Math.max(.4, sc); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.bezierCurveTo(p0[0] + 30 * sc, p0[1] + L * .35, p0[0] - 20 * sc + sw, p0[1] + L * .7, p0[0] + 10 * sc + sw * 1.4, p0[1] + L); ctx.stroke(); ctx.restore();
      spr(ctx, 'gold', p0[0] + 10 * sc + sw * 1.4, p0[1] + L, 10 * Math.max(.4, sc), .7 * fade); }
    FG.forEach((F, i) => { const p = pos(F, t), trail = []; for (let q = 6; q >= 0; q--) trail.push(pos(F, t - .35 * q / 6));
      const head = mix(Math.atan2(p[1] - trail[5][1], p[0] - trail[5][0]), Math.PI / 2, turn);
      firefly(ctx, t, { x: p[0], y: p[1], trail, s: 3.0 * F.sz * sc, seed: 40 + i, a: fade, pulse: pu, heading: head }); });
  }

  // ================================================================ the frame
  const tInEnd = TB + 2.4;
  function draw(ctx, t) {
    const c = cam(t), P0 = landCam(c, 0), tw = towersAt(t);
    const plateDim = .36 * (1 - eio(ONE(A.hands, A.night + .3, t)));
    const rows = [];
    nightLand(ctx, t, { cam: c, moon: { x: 1540, y: 205, r: 13 }, dim: 0, mist: 0, after: (i) => {
      if (i === 0) core(ctx, t, c);
      TOWERS.forEach((Tw, j) => { if (Tw.ridge === i) tower(ctx, t, c, Tw, tw[j].g, tw[j].s); });
      if (i === 3) { // the one person the tower grows out of
        const Tw = TOWERS[0], P = landCam(c, Tw.d), x = P.RX(Tw.sx) + 18 * P.s, y = P.RY(Tw.sy) + 2 * P.s;
        if (x > -60 && x < W + 60 && y > -40 && y < H + 200) conductor(ctx, t, x, y, .14 * P.s, { view: 'back', seed: 3, glow: 0, rim: .4 + .6 * tw[0].g, light: { x: x - 300, y: y - 400 } });
      }
      fieldRow(ctx, t, c, i, LIGHTS0);
      const r = landRow(ctx, t, c, i, { t0: LIGHTS0, threads: 1 - eio(ONE(A.hands, A.night + 1.5, t)) });
      orchestras(ctx, t, r, { t0: LIGHTS0, rise: RISE, flash: Math.exp(-Math.pow((t - A.conduct - .1) / .35, 2)) * .6 });
      rows.push(...r);
      const dd = [5.3, 2.5, 1.05, .38][i]; if (i > 0) mistBand(ctx, t, c, dd, ridgeY(i, 960) + [40, 46, 60, 70][i], { seed: 3 + i, a: [.6, .62, .62, .5][i], v: 4 + i * 2.5, col: '#5a5896' });
      if (i === 1) c01Clouds(ctx, t, c, { lit: 0, heroX: HERO.x });
      if (i === 3) c01Village(ctx, t, c, { lastOut: 0 });
    } });
    if (plateDim > 0) { ctx.fillStyle = rgba('#05060f', plateDim); ctx.fillRect(0, 0, W, H); }
    plate(ctx, t, c, P0);
    hier(ctx, t, c, P0);
    { const kr = knoll(ctx, t, c, { t0: LIGHTS0 }); if (kr) orchestras(ctx, t, kr, { t0: LIGHTS0, rise: RISE, flash: Math.exp(-Math.pow((t - A.conduct - .1) / .35, 2)) * .6 }); }
    crestConductor(ctx, t, c, { turn: eio(ONE(A.yours - .3, A.yours + .5, t)), glow: .35 + .4 * Math.exp(-Math.pow((t - A.conduct - .1) / .35, 2)) });
    fgSwarm(ctx, t);
    // labels
    { const u = eoutX(ONE(A.roelof - .05, A.roelof + .7, t)) * (1 - einX(ONE(A.way - .1, A.way + .3, t))); if (u > 0) nameLabel(ctx, t, { x: 140, y: 880, name: 'Roelof Botha', role: 'ON X, 31 MAR 2026', u }); }
    if (t < tInEnd) glowFrom(ctx, t, HI.plate, sine(ONE(TB, tInEnd, t)), [P0.X(P_STAR[0]), P0.Y(P_STAR[1])], { kMin: .03, a: .45, easeA: (x) => x });
  }

  worldWarm(); await b3Ready();
  const PR = HI.print;
  const starts = [TB, A.an, A.amem, A.hands, A.andwill, A.inits, A.for, A.thats, A.maybe, A.but, A.q, A.honestly, A.soif, A.tell, A.end];
  const SOUND = {
    [TB]: [{ f: 'whoosh_airy', t: TB + .05, v: .3 }, { f: 'shimmer_rings', t: A.together - .08, v: .35 }],
    [A.an]: [{ f: 'foil_glint', t: A.living, v: .3 }],
    [A.amem]: [{ f: 'pages', t: A.amem + .1, v: .3 }, { f: 'chime', t: A.nothing, v: .25 }],
    [A.hands]: [{ f: 'wings', t: A.hands, v: .3 }, { f: 'bulb', t: A.night, v: .3 }],
    [A.andwill]: [{ f: 'pages', t: A.worth - .9, v: .3 }],
    [A.inits]: [{ f: 'tick', t: A.one + .05, v: .25 }, { f: 'whoosh_up', t: A.one + .25, v: .35 }],
    [A.for]: [{ f: 'pencil', t: REV0 + .1, v: .3 }],
    [A.thats]: [{ f: 'drop', t: A.changing, v: .3 }],
    [A.maybe]: [{ f: 'swell', t: A.maybe + .4, v: .3 }],
    [A.but]: [{ f: 'whoosh', t: A.alone + .3, v: .2 }],
    [A.q]: [{ f: 'shimmer_rings', t: A.millions, v: .35 }],
    [A.honestly]: [{ f: 'wings', t: A.million, v: .3 }],
    [A.soif]: [{ f: 'chime', t: A.conduct, v: .25 }],
    [A.tell]: [{ f: 'whoosh_up', t: A.tell + .05, v: .3 }],
  };
  return starts.map((t0) => ({ t: t0, tr: 'cut', d: .1, print: PR, draw, sound: SOUND[t0] }));
};
const TAU = Math.PI * 2;
