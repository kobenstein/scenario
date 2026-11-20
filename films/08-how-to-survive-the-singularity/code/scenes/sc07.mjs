// Film 8 · c07 · the storms (VO 04a, clip C5, 04b) · builder B2 · shots.md §8 c07.01–c07.21.
// ONE world, one camera: your room (s8_desk) sits in a house on the hill above a harbour town; beyond the breakwater lies the open sea and on
// its horizon stand the three storm fronts (s8_storms). The camera starts out at sea, pulls back through your window, pushes back out over the
// town, flies on to the squall, the cutter and the barge, and ends on Hōkūleʻa pushing into its fire box. Every change of place is a
// continuous camera move through the glass or over the water; the clip C5 grows out of the book's engraved plate and shrinks back into it.
//
// shot  | VO (accent)                                        | image                                                     | camera / carrier
// 07.01 | You can steer YOUR OWN life.                       | (sky dusk plate) grey-blue sea, the small navigator boat  | tilt down out of the sky
// 07.02 | But some storms are BIGGER than any one of us.     | three fronts rise and tower over the tiny boat            | pan + crane up, wide
// 07.03 | The FIRST:                                         | the left front                                            | push toward it
// 07.04 | POWER, gathering in very FEW HANDS.               | the whirl: lanterns pulled into three dark ships           | push, crane up
// 07.05 | DARON ACEMOGLU … a whole BOOK …                    | pull back through your window: the book, the mill plate   | log dolly through the glass; tilt down
// 07.06 | clip C5                                            | the plate grows to the footage and shrinks back           | frame carrier
// 07.07 | The SECOND:                                        | the page turns; the camera lifts to the window            | tilt up
// 07.08 | TRUST.                                             | sea fog rolls into the town; every lantern doubles        | push to the glass
// 07.09 | Imagine a CALL.                                    | the phone buzzes face up on the table                     | tilt down
// 07.10 | It's your BROTHER'S VOICE, asking for HELP.        | a hand lifts it: the paper-cut avatar, the voice wave     | follow
// 07.11 | Except it ISN'T HIM.                               | the avatar flips: blank back; the wave splits             | hold, breathe
// 07.12 | When any voice can be FAKED, "WHO do we believe?"  | through the window: the fog town, phones in every window  | push out through the glass
// 07.13 | becomes EVERYONE'S question.                      | crane up: hundreds of cool phone lights                   | crane up
// 07.14 | The THIRD: SPEED.                                  | a squall line races across the sea at us                  | fly out to sea
// 07.15 | Software changes in MONTHS.                        | a fast cutter with a cool light races past                 | whip-pan follow
// 07.16 | Schools, laws and training change in YEARS.        | a heavy barge with three lit decks creeps by               | pan back
// 07.17 | That GAP is where people FALL THROUGH.             | the gangplank stretches, slips; a lantern drops            | pull back
// 07.18 | Those storms are REAL.                             | all three storms; lightning (2 × 2 frames) ★              | crane up wide
// 07.19 | I won't PRETEND otherwise.                         | the storms                                                | slow push
// 07.20 | But storms aren't the END of a voyage.             | Hōkūleʻa rises over a big swell, bow into the storm       | down to the water
// 07.21 | They're the REASON NAVIGATORS exist.               | the navigator at the stern, the star compass flashes      | push into the fire box (plate light fire)
import { clamp } from '../engine.mjs';
import { ready, camera, track, trackLog, eoX, eiX, sio, qio, u01, pulse, TAU, hash } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky, skyDir } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { boat } from '../lib/s8_boats.mjs';
import { canoe, canoeFrame, starCompass } from '../lib/s8_canoe.mjs';
import { stormTone, front, flashAt, whirl, bigShip, lightFlight, fogBank, squall } from '../lib/s8_storms.mjs';
import { makeTown, drawTown, breakwater, lanterns } from '../lib/s8_harbour.mjs';
import { scatterLayout, drawFleet } from '../lib/s8_fleet.mjs';
import { phoneOnTable, phoneInHand, phoneGlow } from '../lib/s8_phone.mjs';
import { cutter, barge, plank, swellRidge } from '../lib/s8_c07_ships.mjs';
import { room, sheet, DESK, lampLevel } from '../lib/s8_desk.mjs';
import { clip, label } from '../lib/s8_card.mjs';
import { hand } from '../lib/hand.mjs';
import { hand as handoff, skyCam, skyOpts } from '../lib/handoff4.mjs';
import { growPlate, keys, vign } from '../lib/s8_b2kit.mjs';
import { engravedMill, bookSpread } from '../lib/s8_c07_book.mjs';

export default async function (T, R) {
  const A = (p, n) => T.S('04a', p, n), B = (p, n) => T.S('04b', p, n), BE = (p, n) => T.E('04b', p, n), C5 = T.clip('C5');
  const HI = handoff('c06>c07', T), HO = handoff('c07>c08', T);
  const K = {
    in: HI.b, you: A('You can'), own: A('own'), but: A('But some'), bigger: A('bigger'), first: A('The first'), power: A('power'), gather: A('gathering'), hands: A('hands'),
    daron: A('Daron'), nobel: A('Nobel'), book: A('book'), tech: A('technology'), c0: C5.start, c1: C5.end,
    second: B('The second'), trust: B('trust'), imagine: B('Imagine'), call: B('call'), its: B("It's your"), help: B('help'), except: B('Except'), isnt: B("isn't"),
    when: B('When any'), faked: B('faked'), who: B('who do'), becomes: B('becomes'), third: B('The third'), speed: B('speed'), soft: B('Software'), months: B('months'),
    schools: B('Schools'), years: B('years'), gap: B('That gap'), fall: B('fall'), those: B('Those storms'), storms: B('storms are'), real: B('real'),
    pretend: B('pretend'), butS: B('But storms'), end: B('end of'), reason: B("They're the"), navs: B('navigators'), exist: B('exist'), out: HO.a,
  };
  // ---------------------------------------------------------------- the world
  const Y0 = 32.9, WZ = -DESK.wallZ;   // your room: s8_desk coordinates + (0, Y0, WZ); the window opening sits at z = 0, y ≈ 34.4
  const a0 = -.04, LINE = (d, lat = 0) => [Math.sin(a0) * d + Math.cos(a0) * lat, Math.cos(a0) * d - Math.sin(a0) * lat];
  const WH = LINE(1350), FRONTS = [{ kind: 'power', az: a0, w: .17, h: .46, seed: 3 }, { kind: 'trust', az: .32, w: .2, h: .1, seed: 5 }, { kind: 'speed', az: .7, w: .26, h: .12, seed: 7 }];
  const TOWN = makeTown({ x: 0, z: 150, face: 1, w: 260, depth: 92, rise: 16, n: 150, seed: 11, gap: [-6, 6] });
  const BW = [[[-130, 152], [-112, 186], [-72, 212], [-22, 222]], [[130, 152], [110, 186], [70, 210], [22, 220]]];
  const SHIPS = [0, 1, 2].map((i) => { const th = i / 3 * TAU + .4; return { x: WH[0] + Math.sin(th) * 34, z: WH[1] + Math.cos(th) * 34, head: th + Math.PI / 2, L: 46 }; });
  const SMALL = scatterLayout(30, WH[0], WH[1], 150, 21).filter((b) => Math.hypot(b.x - WH[0], b.z - WH[1]) > 70);
  SMALL.forEach((b, i) => { b.ship = i % 3; b.go = K.gather - .2 + (i / SMALL.length) * 1.9 + hash(i) * .3; b.fly = 1.1 + hash(i * 2) * .4; });
  const navBoat = (t) => { const p = LINE(888 + 1.0 * (t - K.in), 7.5); return { x: p[0], z: p[1], head: a0 + .05 * Math.sin(t * .3), roll: -.05, sail: 'full', sailSide: -.4, fig: 'sight', lantern: 1 }; };
  // the canoe (07.20–21): heading into the centre storm
  const CNH = .32, CN0 = [40, 560], canoeK = (t) => ({ x: CN0[0] + Math.sin(CNH) * 1.6 * (t - K.butS), z: CN0[1] + Math.cos(CNH) * 1.6 * (t - K.butS), head: CNH });
  const heave = (t) => -3.2 + 4.0 * sio(u01(t, K.butS + .3, K.end + .2)) + .25 * Math.sin(t * 1.3);
  // the cutter and the barge (07.15–17)
  const BG = (t) => ({ x: -70 + 2.2 * (t - K.schools), z: 470, head: Math.PI / 2, L: 46 });
  const CUT = (t) => {   // races past (months), waits off the barge's bow, then pulls away (the gap)
    const race = u01(t, K.soft - .2, K.months + .7), park = [BG(t).x + 36, 471];
    if (t < K.gap) { const x = -260 + (park[0] + 30 + 260) * (1 - Math.pow(1 - race, 2.2)); return { x: Math.min(x, park[0] + 30) - 30 * sio(u01(t, K.months + .2, K.years)), z: 471 - 30 * (1 - race), head: Math.PI / 2, speed: 60 * (1 - race) + 2 }; }
    const g = u01(t, K.gap + .1, K.fall + 1.2), acc = 14 * g * g;
    return { x: park[0] + acc, z: 471 + 2 * g, head: Math.PI / 2 - .05 * g, speed: 30 * g };
  };
  // ---------------------------------------------------------------- the camera (one take)
  const P0 = LINE(860), P1 = LINE(850, -4), P2 = LINE(940), P3 = LINE(1190);
  const sea = keys([
    [K.in, { x: P0[0], y: 2.6, z: P0[1], yaw: HI.o.yaw, pitch: HI.o.pitch, F: HI.o.F }],
    [K.in + .45, { x: P0[0] + .1, z: P0[1] + .3, yaw: .28, pitch: -.36, F: 1180 }],
    [K.you + 1.7, { x: P0[0] + .6, z: P0[1] + 1.5, yaw: .21, pitch: .03, F: 1400 }],
    [K.but, { x: P0[0] + .9, z: P0[1] + 2.4, yaw: .2, pitch: .03 }],
    [K.bigger + 1.0, { x: P1[0], y: 9, z: P1[1], yaw: .3, pitch: -.035, F: 950 }],
    [K.first, { x: P1[0] + 1.5, y: 11, z: P1[1] + 7, yaw: .24, pitch: -.025, F: 1000 }],
    [K.power + .2, { x: P2[0], y: 15, z: P2[1], yaw: a0, pitch: .02, F: 1400 }],
    [K.hands + .7, { x: P3[0], y: 22, z: P3[1], yaw: a0, pitch: .1, F: 1400 }],
  ]);
  // the pull back through the window: distance along the line, log
  K.pb0 = K.hands + .75; K.pb1 = K.daron + 1.0;
  const pbD = trackLog([[K.pb0, 1190 + 3], [K.pb1, -1.15 + 3]]), pbY = track([[K.pb0, 22], [K.pb0 + .9, 33.6], [K.pb1, 34.3]]), pbP = track([[K.pb0, .1], [K.pb1, .1]]), pbF = trackLog([[K.pb0, 1400], [K.pb1, 1150]]);
  const camPB = (t) => { const p = LINE(pbD(t) - 3); return camera({ x: p[0], y: pbY(t), z: p[1], yaw: a0 * clamp((pbD(t) - 3) / 60), pitch: pbP(t), F: pbF(t) }); };
  // in the room (desk coordinates + offset): the book, the plate, the window, the phone
  const BOOK = { x: .1, z: .02, w: .5, rot: .06 };
  const plateRect = [.58, .2, .36, .5];    // the engraved plate on the right-hand page (fractions of the spread's plate space)
  const DC = (x, y, z) => [x, y + Y0, z + WZ];
  const room0 = { x: Math.sin(a0) * -1.15, y: 34.3, z: Math.cos(a0) * -1.15, yaw: 0, pitch: .1, F: 1150 };
  const bookTop = DC(BOOK.x, DESK.top, BOOK.z);
  K.tb = K.nobel - .2; K.pl0 = K.tech - .6;
  const desk1 = keys([
    [K.pb1, room0],
    [K.tb + .6, { x: bookTop[0] - .02, y: 34.05, z: bookTop[2] - .5, yaw: 0, pitch: .78, F: 1250 }],
    [K.book + .3, { x: bookTop[0] + .02, y: 33.98, z: bookTop[2] - .44, pitch: .86, F: 1300 }],
    [K.pl0, { x: bookTop[0] + .05, y: 33.96, z: bookTop[2] - .4, pitch: .9, F: 1350 }],
    [K.c0, { x: bookTop[0] + .1, y: 33.86, z: bookTop[2] - .24, pitch: 1.05, F: 1500 }],
  ]);
  const desk2 = keys([
    [K.c1, { x: bookTop[0] + .1, y: 33.86, z: bookTop[2] - .24, yaw: 0, pitch: 1.05, F: 1500 }],
    [K.second + .5, { x: bookTop[0] + .05, y: 33.98, z: bookTop[2] - .42, pitch: .86, F: 1300 }],
    [K.trust - .1, { x: 0, y: 34.35, z: -.95, yaw: 0, pitch: .08, F: 1150 }],
    [K.imagine - .2, { x: 0, y: 34.35, z: -.8, pitch: .1, F: 1200 }],
    [K.call + .1, { x: -.17, y: 34.12, z: -1.02, yaw: -.03, pitch: 1.12, F: 1300 }],
    [K.help, { x: -.15, y: 34.07, z: -.99, yaw: -.07, pitch: 1.17, F: 1420 }],
    [K.when - .2, { x: -.19, y: 34.1, z: -.97, yaw: -.01, pitch: 1.12, F: 1380 }],
    [K.when + .6, { x: 0, y: 34.4, z: -.7, yaw: 0, pitch: .12, F: 1150 }],
    [K.faked + .2, { x: 0, y: 34.6, z: .8, pitch: .2, F: 1150 }],
    [K.becomes - .1, { x: 0, y: 45, z: 60, pitch: .45, F: 1150 }],
    [K.becomes + 1.3, { x: 0, y: 95, z: 52, pitch: .78, F: 1050 }],
  ]);
  const PHONE = DC(-.16, DESK.top + .006, -.12);
  // out to sea, the squall, the cutter, the barge, the gap, the storms, the canoe
  const cutTrack = (t) => { const c = CUT(t); return Math.atan2(c.x - 0, c.z - 430); };
  const sea2 = keys([
    [K.becomes + 1.4, { x: 0, y: 95, z: 52, yaw: 0, pitch: .78, F: 1050 }],
    [K.speed - .25, { x: 0, y: 7, z: 380, yaw: .2, pitch: .0, F: 1250 }],
    [K.soft - .1, { x: 0, y: 4.5, z: 420, yaw: .15, pitch: .01, F: 1300 }],
  ]);
  const yawWhip = track([[K.soft - .1, .15], [K.soft + .3, -1.0], [K.months + .1, .5], [K.months + .8, .95], [K.schools - .3, .9], [K.schools + .5, -.55], [K.years + .2, -.4], [K.gap - .1, -.42], [K.gap + .8, -.06], [K.fall + .6, -.04]]);
  const sea3 = keys([
    [K.soft - .1, { x: 0, y: 4.5, z: 420, pitch: .01, F: 1300 }],
    [K.schools + .5, { x: -8, y: 5, z: 428, pitch: .02, F: 1250 }],
    [K.gap + .8, { x: -32, y: 8, z: 392, pitch: .07, F: 1250 }],
    [K.fall + .6, { x: -31, y: 8.5, z: 394, pitch: .08, F: 1300 }],
  ]);
  const CK0 = canoeK(K.reason + .2), CP0 = canoeFrame(CK0, K.reason + .2)(-14, 4.2, -10);
  const cu = track([[K.reason + .2, -14], [K.navs + .6, -9], [K.out - .45, -2.2], [K.out, -1.1]]), cv = track([[K.reason + .2, 4.2], [K.navs + .6, 3.6], [K.out - .45, 2.3], [K.out, 1.9]]);
  const cw = track([[K.reason + .2, -10], [K.navs + .6, -5], [K.out - .45, .6], [K.out, 1.1]]), cF = trackLog([[K.reason + .2, 1250], [K.out - .45, 1350], [K.out, 1500]]);
  const sea4 = keys([
    [K.fall + .6, { x: -31, y: 8.5, z: 394, yaw: -.04, pitch: .08, F: 1300 }],
    [K.storms - .2, { x: 10, y: 14, z: 430, yaw: .3, pitch: -.03, F: 950 }],
    [K.pretend + 1.4, { x: 26, y: 6.5, z: 500, yaw: .37, pitch: -.02, F: 1180 }],
    [K.butS + .6, { x: CN0[0] - 12, y: 1.7, z: CN0[1] - 22, yaw: .5, pitch: -.03, F: 1250 }],
    [K.end + .4, { x: CN0[0] - 10, y: 1.6, z: CN0[1] - 19, yaw: .52, pitch: -.06, F: 1250 }],
    [K.reason + .2, { x: CP0[0], y: CP0[1] + heave(K.reason + .2), z: CP0[2], yaw: .75, pitch: .1, F: 1250 }],
  ]);
  const camAt = (t) => {
    if (t < K.pb0) return sea(t);
    if (t < K.pb1) return camPB(t);
    if (t < K.c1) return desk1(t);
    if (t < K.becomes + 1.4) return desk2(t);
    if (t < K.soft - .1) return sea2(t);
    if (t < K.fall + .6) { const c = sea3(t); return camera({ x: c.x, y: c.y, z: c.z, yaw: yawWhip(t), pitch: c.pitch, F: c.F }); }
    if (t < K.reason + .2) return sea4(t);
    // round the canoe to its beam, then push over the rail into the fire box (canoe-local keys; the fire sits at u .35, v 1.35, w 1.2)
    const Kc = canoeK(t), F = canoeFrame(Kc, t), lu = cu(t), lv = cv(t), lw = cw(t), p = F(lu, lv, lw), f = F(.35, 1.45 + heave(t), 1.2);
    const dx = f[0] - p[0], dy = f[1] - p[1], dz = f[2] - p[2], yaw = Math.atan2(dx, dz), pitch = Math.atan2(-dy, Math.hypot(dx, dz));
    const s0 = sea4(K.reason + .2), bl = sio(u01(t, K.reason + .2, K.reason + 1.2));
    return camera({ x: p[0], y: p[1] + heave(t), z: p[2], yaw: s0.yaw + (yaw - s0.yaw) * bl, pitch: s0.pitch + (pitch - s0.pitch) * bl, F: cF(t) });
  };
  // ---------------------------------------------------------------- light and weather over time
  const tone = (t) => .9 * sio(u01(t, K.in + .1, K.you + 1.6));
  const dawn = (t) => .55 * (1 - sio(u01(t, K.in + .05, K.you + 1.2)));
  const rise = (t) => .35 + .65 * eoX(u01(t, K.but + .1, K.bigger + .9));
  const fogZ = (t) => 420 - 330 * sio(u01(t, K.second, K.trust + 1.6)) - 6 * (t - K.trust);
  const twin = (t) => u01(t, K.trust + .1, K.trust + 1.0);
  const phones = (t) => sio(u01(t, K.when + .3, K.who + .6)) * (1 - u01(t, K.speed - .5, K.speed));
  const flashes = [K.storms + .02, K.real + .02];
  const flash = (t) => flashAt(t, flashes);
  const sqZ = (t) => 2400 - 1880 * eoX(u01(t, K.third - .2, K.soft + .4)) - 62 * Math.max(0, t - K.soft - .4);

  function world(ctx, t, C, o = {}) {
    const k = tone(t), dw = dawn(t), fl = flash(t);
    drawSky(ctx, t, C, { dawn: dw, dawnAz: HI.o.yaw, stars: 1 - .85 * k, mw: 1 - .95 * k });
    // the glints: lanterns of the near boats, the canoe's fire
    const gl = [];
    drawSea(ctx, t, C, { glints: gl, calm: .1 });
    stormTone(ctx, C, k, { kind: t > K.third - .5 && t < K.those ? 'slate' : 'storm' });
    for (const F of FRONTS) front(ctx, t, C, { ...F, a: rise(t), flash: F.kind === 'power' ? fl : 0, fx: -.15, bolt: fl ? 11 + Math.round(t) : 0, glow: F.kind === 'power' ? .6 * u01(t, K.gather, K.hands + .8) : 0 });
    if (fl) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(150,180,230,.08)'; ctx.fillRect(0, C.hy, 1920, 1080); ctx.restore(); }
    // the town, the breakwater (always there; behind the camera when out at sea)
    if (C.z < 260 && C.pitch > -.2) {
      const fog = t > K.second - .5 && t < K.speed;
      const tw = drawTown(ctx, t, C, TOWN, { tone: 'storm', lit: .62, phones: phones(t), twin: twin(t), lightsLater: fog, fogK: fog ? .35 * u01(t, K.trust, K.trust + 1.5) : 0 });
      const bws = BW.map((pts) => breakwater(ctx, t, C, { pts, h: 2.4, lampEvery: 16, twin: fog ? twin(t) : 0, lamps: fog ? 0 : 1 }));
      if (fog) {
        fogBank(ctx, t, C, { x0: -260, x1: 260, z0: fogZ(t), z1: fogZ(t) + 260, h: 12, a: .6 * u01(t, K.second, K.trust + .5), drift: .8 });
        lanterns(ctx, t, tw.lights, 1, twin(t));
        // the breakwater lamps after the fog too (doubled)
        for (const pts of BW) breakwater(ctx, t, C, { pts, h: 2.4, lampEvery: 16, twin: twin(t), lamps: 1, col: 'rgba(0,0,0,0)', top: 'rgba(0,0,0,0)' });
      }
    }
    // the navigator boat (07.01–03)
    if (t < K.pb1) { const nb = navBoat(t); if (C.depth(nb.x, 1, nb.z) > 2) boat(ctx, t, C, nb); }
    // power: the whirl, the ships, the small boats whose lights are taken
    if (t < K.c0 + .1 && t > K.first - 1) {
      const wa = u01(t, K.power - .4, K.power + .8);
      whirl(ctx, t, C, { x: WH[0], z: WH[1], R: 90, a: wa, spin: .3 });
      const got = [0, 0, 0];
      SMALL.forEach((b) => { if (t > b.go + b.fly) got[b.ship]++; });
      const list = [...SHIPS.map((S, i) => ({ d: C.depth(S.x, 4, S.z), f: () => bigShip(ctx, t, C, { ...S, glow: clamp(got[i] / 6) }) })),
        { d: C.depth(WH[0], 0, WH[1] + 120), f: () => drawFleet(ctx, t, C, SMALL, { lantern: (b) => (t < b.go ? 1 : 0), sail: 'slack' }) }];
      list.sort((a, b) => b.d - a.d).forEach((x) => x.f());
      const holds = SHIPS.map((S) => { const L = S.L, h = S.head; return [S.x + Math.sin(h) * L * .03, L * .12 + .3, S.z + Math.cos(h) * L * .03]; });
      SMALL.forEach((b) => { const u = (t - b.go) / b.fly; if (u > 0 && u < 1) lightFlight(ctx, t, C, [b.x, 1.4, b.z], holds[b.ship], u, { curl: 1.3 }); });
    }
    // speed: the squall, the cutter, the barge, the plank
    if (t > K.third - .6 && t < K.those + 1) {
      if (sqZ(t) + 170 > C.z) squall(ctx, t, C, { z: sqZ(t), x0: -900, x1: 900, base: 16, top: 70, depth: 160, a: 1 });
      const bg = BG(t), ct = CUT(t);
      const items = [{ d: C.depth(bg.x, 3, bg.z), f: () => barge(ctx, t, C, bg) }, { d: C.depth(ct.x, 1, ct.z), f: () => cutter(ctx, t, C, ct) }];
      items.sort((a, b) => b.d - a.d);
      for (const it of items) it.f();
      if (t > K.gap - .4) {
        const bf = bargeBow(bg), cs = [ct.x - 7, 1.3, ct.z];
        const slip = u01(t, K.fall - .05, K.fall + .45), stretch = u01(t, K.gap + .2, K.fall);
        plank(ctx, t, C, bf, cs, { slip, stretch, figs: [{ u: .3 - .2 * stretch, stumble: stretch }, { u: .55 - .35 * stretch, stumble: stretch }], lantern: { u: .5, drop: u01(t, K.fall + .1, K.fall + .75), age: Math.max(0, t - K.fall - .75) } });
      }
      // labels
      const cp = C.P(ct.x, 4.5, ct.z), bp = C.P(bg.x + 10, 10, bg.z);
      if (cp) label(ctx, t, cp[0], cp[1], u01(t, K.months - .1, K.months + .4) * (1 - u01(t, K.schools - .3, K.schools)), 'MONTHS', '', { len: 90 });
      if (bp) label(ctx, t, bp[0], bp[1], u01(t, K.years - .1, K.years + .4) * (1 - u01(t, K.gap - .2, K.gap + .2)), 'YEARS', '', { len: 90 });
    }
    // Hōkūleʻa (07.20–21)
    if (t > K.pretend) {
      const Kc = canoeK(t), hv = heave(t);
      const Cb = camera({ x: C.x, y: C.y - hv, z: C.z, yaw: C.yaw, pitch: C.pitch, F: C.F });
      const flashR = pulse(t, K.navs - .05, K.navs + .9);
      starCompass(ctx, t, Cb, Kc, { u: flashR > 0 ? 1 : 0, lab: 0, stars: 0, R: 15 * (1 + .2 * eoX(u01(t, K.navs - .05, K.navs + .9))) });
      if (flashR > 0) { ctx.save(); ctx.globalAlpha = 1; ctx.restore(); }
      const cn = canoe(ctx, t, Cb, Kc);
      swellRidge(ctx, t, C, { z: Kc.z - 12 + 2 * Math.sin(t * .4), x0: Kc.x - 90, x1: Kc.x + 90, h: Math.max(0, 1.4 - hv * .3) });
      o.fire = cn && cn.fire;
    }
    return o;
  }
  const bargeBow = (bg) => [bg.x + 20, 1.6 + .2, bg.z + .5];

  // ---------------------------------------------------------------- the room
  const bookItem = (t) => ({ ...BOOK, aspect: 1.45, draw: (g, tt, PW, PH) => bookSpread(g, tt, PW, PH, { plate: plateRect, turn: u01(tt, K.c1 + .2, K.second + .4), mill: (gg, w, h) => engravedMill(gg, tt, w, h) }) });
  const phoneItem = () => ({ x: -.16, z: -.12, drawItem: (ctx, t, C) => {
    const p = C.P(...[-.16, DESK.top + .006, -.12]); if (!p) return;
    const lift = sio(u01(t, K.its - .2, K.its + .6)) * (1 - eiX(u01(t, K.when - .3, K.when + .25)));
    const s = p[2] * .00052 * (1 + .22 * lift), y = p[1] + 10 * lift + 7 * lift * Math.sin(t * 2.1), x = p[0] + 20 * lift + 5 * lift * Math.sin(t * 1.6 + 1);
    const po = { lit: u01(t, K.call - .1, K.call + .15), ring: 1 - u01(t, K.its, K.its + .5), flip: u01(t, K.except + .15, K.isnt + .05), split: u01(t, K.isnt, K.isnt + .6), wave: u01(t, K.its - .1, K.its + .3) };
    if (lift > .02) { phoneInHand(ctx, t, x, y + 90 * (1 - lift) * s, s * (.9 + .1 * lift), { ...po, ang: -.08 + .05 * Math.sin(t * .9), pitch: .2 * (1 - lift) + .12, rim: '#ffb066' }); return; }
    phoneOnTable(ctx, t, x, y, s, { ang: -.1 + .1 * lift, buzz: [K.call - .05, K.call + .9], lit: u01(t, K.call - .1, K.call + .15), ring: 1 - u01(t, K.its, K.its + .5), flip: u01(t, K.except + .15, K.isnt + .05), split: u01(t, K.isnt, K.isnt + .6), wave: u01(t, K.its - .1, K.its + .3) });
  } });
  function inRoom(ctx, t, C) {
    const Cd = camera({ x: C.x, y: C.y - Y0, z: C.z - WZ, yaw: C.yaw, pitch: C.pitch, F: C.F });
    const items = [bookItem(t)]; if (t > K.second) items.push(phoneItem());
    const r = room(ctx, t, Cd, { items, person: null, outside: 1, wind: .3 * pulse(t, K.trust, K.trust + 1.2), outsideDraw: (cx, tt) => world(cx, tt, C) });
    return r;
  }

  prepareSky();
  await ready();
  const frame = (ctx, t) => {
    const C = camAt(t);
    // the clip window: the plate on the page grows to the footage and back
    if (t >= K.c0 && t < K.c1) {
      if (t < K.c0 + .4 || t > K.c1 - .4) inRoom(ctx, t, C);
      clip(ctx, t, T, 'C5', { carrier: 'frame', from: plateScreen(t), to: plateScreen(t), info: { name: 'Daron Acemoglu', role: 'Economist · MIT', source: '', date: '' } });
      return;
    }
    // inside the room: from the moment the camera passes the glass (z < 0) until it leaves again
    const inside = C.z < -.02;
    if (inside) { inRoom(ctx, t, C); }
    else {
      const o = world(ctx, t, C);
      if (t > K.reason) { const fp = o.fire; if (fp) growPlate(ctx, t, 'light', HO.o, fp[0], fp[1], eiX(u01(t, K.out - .55, K.out - .04))); }
      vign(ctx, .45);
    }
    // labels in the room
    if (inside && t < K.c0) {
      const bp = C.P(bookTop[0] + .1, bookTop[1], bookTop[2] + .08);
      if (bp) { label(ctx, t, bp[0], bp[1], u01(t, K.daron + .5, K.daron + 1.1) * (1 - u01(t, K.book - .5, K.book - .2)), 'DARON ACEMOGLU', 'NOBEL PRIZE IN ECONOMICS 2024', { len: 160, dx: 80 });
        label(ctx, t, bp[0], bp[1], u01(t, K.book - .1, K.book + .4) * (1 - u01(t, K.pl0 + .2, K.pl0 + .5)), 'POWER AND PROGRESS', '2023', { len: 160, dx: 80 }); }
    }
  };
  // the plate's screen rect at time t (the frame carrier's start / end)
  function plateScreen(t) {
    const C = camAt(t), Cd = camera({ x: C.x, y: C.y - Y0, z: C.z - WZ, yaw: C.yaw, pitch: C.pitch, F: C.F });
    const w = BOOK.w, h = w / 1.45, r = BOOK.rot, u = [Math.cos(r), 0, -Math.sin(r)], v = [-Math.sin(r), 0, -Math.cos(r)];
    const P = (a, b) => { const X = BOOK.x + u[0] * (a - .5) * w + v[0] * (b - .5) * h, Z = BOOK.z + u[2] * (a - .5) * w + v[2] * (b - .5) * h; return Cd.P(X, DESK.top + .002, Z); };
    const [px, py, pw, ph] = plateRect, pts = [P(px, py), P(px + pw, py), P(px + pw, py + ph), P(px, py + ph)].filter(Boolean);
    if (pts.length < 4) return [760, 430, 400, 225];
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
  }
  const PR = { riso: .35 };
  return [
    { t: K.in, tr: 'cut', d: .1, draw: frame, print: HI.print },
    { t: K.c0, tr: 'cut', d: .1, draw: frame, print: { riso: .15, halftone: .4, hatch: .3 } },
    { t: K.c1, tr: 'cut', d: .1, draw: frame, print: PR },
    { t: K.out - .1, tr: 'cut', d: .1, draw: frame, print: HO.print },
  ];
}
