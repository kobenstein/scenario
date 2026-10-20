// Chunk C05 · Film 4 v2 · "The honeymoon" (02a, 71.78–106.98) · shots 5.01–5.15 · ★ 5.13
// Builder c05. ONE continuous flight through ONE day: your room → the shop → your room → over the city → the coast → grandmother → your
// street → the hill (H1). Entries only split the take for print and sound. Every accent is anchored to a VO word (T.S / T.E).
//
// PLAN — shot · words (accent) · image · light · camera · flows on
// 5.01 "everything" 73.06   dawn plate → the sun in your tall window; curtains billow open, light floods   dawn gold   pull-back (sun pinned)  → room
// 5.02 "wakes" 76.10        bed in the beam, you asleep (back of head), clock hands sweep 7→9; you stretch, sit up   morning   slow drift  → out of window A
// 5.03 "maths" 78.10        swoop down the facade to the corner shop; through its window: till, curling receipt; the dotted sums
//                           above your head drift away as smoke (on "maths": "stop" falls mid-swoop)   morning   push at the glass  → rise
// 5.04 "gone" 82.54         back up and in through window B: the wardrobe, shirt with a tight tie; the knot loosens, the tie falls on the letter
// 5.05 "no" 84.98           the letter lifts to face you, a handwritten "No." inks itself, it folds into a paper plane and flies out
// 5.06 "boss" 86.42         the plane crosses to the office in the tower: empty chair turning, the desk lamp clicks off
// 5.07 "commute" 87.70      down the side street, up over the roofs: the packed lit train rushes left below, the plane rises the other way
// 5.08 "down" 91.10         the factory's hollowed steps, a pair of worn work shoes; the plane's wake lifts their laces; it climbs the wall,
//                           the camera flies into its wing (the frame is paper) → the other side is the coast
// 5.09 "love" 94.06         sea, the town on its hill in afternoon gold, top lost in haze; the plane banks toward a garden on the quay
// 5.10 "Tuesday" 96.46      grandmother knitting in her garden chair, you sit down on the bench beside her; the plane lands at her feet
// 5.11 "because" 98.02      she lays it on your knee; the cat stretches on the wall; both lean back, the light warms
// 5.12 "not just you" 99.06 pull back over the garden wall: the quay street, every door open, neighbours on their steps, children chalk-drawing
// 5.13 ★ "home" 104.14      the pull-back reveals the street is the bottom terrace; dusk; the base terrace lights house by house, its label lights
// 5.14 "have" 105.14        MASLOW'S HIERARCHY OF NEEDS writes in
// 5.15 "anymore" 106.26     the full labelled hill at dusk → VIEW H1 exactly (held from 106.9; the out plate takes over at 107.78)
import { handsOf } from '../lib/handoff4.mjs';
import { ready, clamp, mix, path, spline, camOf, plateCentre, ramp, pulse, qio, cio, sio, smo, eo, mixHex } from '../lib/v2_c05_kit.mjs';
import { sun } from '../lib/v2_c05_city.mjs';
import { drawRoom } from '../lib/v2_c05_room.mjs';
import { shopInterior } from '../lib/v2_c05_shop.mjs';
import { drawLetter, drawDart, oriFrom, wingFill, dartScreen } from '../lib/v2_c05_plane.mjs';
import { drawMid } from '../lib/v2_c05_flight.mjs';
import { hillFrame, SPOT, UPM, GARDEN } from '../lib/v2_c05_hill.mjs';
import { drawHill, VIEWS, toScreen } from '../lib/maslow4.mjs';

// spline with eased ends (a, b = the fractions of the time spent speeding up / slowing down)
const warp = (u, a, b) => {
  u = clamp(u); const I = a / 2 + (1 - a - b) + b / 2; let w;
  if (a > 0 && u <= a) { const U = u / a; w = a * (U ** 3 - U ** 4 / 2); }
  else if (b > 0 && u > 1 - b) { const V = (1 - u) / b; w = a / 2 + (1 - a - b) + b / 2 - b * (V ** 3 - V ** 4 / 2); }
  else w = a / 2 + (u - a);
  return w / I;
};
const fly = (t, pts, a = .2, b = .2) => { const t0 = pts[0][0], t1 = pts[pts.length - 1][0]; return spline(t0 + (t1 - t0) * warp((t - t0) / (t1 - t0), a, b), pts); };
const lerpOri = (p, q, u) => ({ yaw: mix(p.yaw, q.yaw, u), pitch: mix(p.pitch, q.pitch, u), roll: mix(p.roll, q.roll, u) });
const PAPER = { col: '#f6efe0', lit: .5 };
const ORI_CUT = { yaw: 0, pitch: 1.35, roll: 0 };

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c05', T);
  const S = (p, k = 0) => T.S('2', p, k), E = (p, k = 0) => T.E('2', p, k);
  const A = {
    t0: HI.b, everything: S('everything'), hoped: S('hoped'), sleep: S('You sleep'), wakes: S('wakes'), wakesE: E('wakes you'),
    stop: S('You stop'), maths: S('maths'), checkout: S('checkout'), knot: S('knot'), sunday: S('Sunday'), gone: S('gone'), goneE: E('gone'),
    finally: S('Finally'), no: S('say no') + .24, noE: E('say no'), boss: S('boss'), commute: S('commute'), job: S('job'), down: S('down'),
    move: S('You can move'), love: S('love'), grandmother: S('grandmother'), tuesday: S('Tuesday'), because: S('because'),
    notJust: S("And it's not"), street: S('street is'), home: S('home'), have: S("don't have") + .24, anymore: S('anymore'), HOa: HO.a,
  };
  const CUT = A.move + .09;                 // the frame is the plane's wing: city → coast
  const H1T = A.anymore + .64;              // exactly VIEW H1 from here on

  // ------------------------------------------------------------------ time of day (one slow day: morning gold → afternoon → dusk)
  const TOD = [[A.t0, 7.0], [A.wakesE, 7.6], [A.checkout, 8.6], [A.sunday, 9.8], [A.noE, 10.6], [A.down, 13.0]];
  const tod = (t) => { if (t <= TOD[0][0]) return TOD[0][1]; for (let i = 1; i < TOD.length; i++) if (t <= TOD[i][0]) return mix(TOD[i - 1][1], TOD[i][1], sio((t - TOD[i - 1][0]) / (TOD[i][0] - TOD[i - 1][0]))); return TOD[TOD.length - 1][1]; };

  // ------------------------------------------------------------------ 5.01: the pull-back out of the sun (the sun stays pinned on screen)
  const PB0 = HI.b, PB1 = A.hoped + .15, SUN_END = [742, 318];
  const pullBack = (t) => {
    const u = clamp((t - PB0) / (PB1 - PB0)), e = qio(u), ek = qio(clamp(u * 1.08));
    const s = sun(tod(t)), pc = plateCentre(t);
    const x = mix(-2.2, -2.0, e), y = mix(-1.42, -1.75, e), z = mix(1.6, -5.6, e), f = Math.exp(mix(Math.log(6500), Math.log(1150), e));
    const sx = mix(pc[0], SUN_END[0], e), sy = mix(pc[1], SUN_END[1], e);
    const px = sx - f * s.az, py = sy + f * s.el;
    return { cam: { x, y, z, f, lx: (960 - px) / f, ly: (540 - py) / f }, k: Math.exp(mix(0, Math.log(.12), ek)), sunXY: [sx, sy] };
  };
  const KEYS = [
    [PB1, pullBack(PB1).cam],
    [A.sleep + .55, { x: -2.3, y: -1.85, z: -5.75, f: 1150, lx: -.065, ly: .58 }, cio],
    [A.wakes, { x: -2.3, y: -1.88, z: -5.66, f: 1150, lx: -.06, ly: .56 }, sio],
    [A.wakesE + .02, { x: -2.3, y: -2.02, z: -5.4, f: 1150, lx: -.05, ly: .46 }, sio],
  ];
  // 5.03 the swoop out of window A down to the shop window, the push at the glass; 5.04 back up and in through window B
  const tS0 = A.wakesE + .02, tS1 = A.maths, tP1 = A.checkout + .29, tB1 = tP1 + 1.25, tW1 = A.gone - .04;
  const SWOOP = [[tS0, -2.3, -2.02, -5.4], [tS0 + .32, -2.15, -1.55, -1.7], [tS0 + .54, -2.0, -1.45, .7], [tS0 + .78, -1.0, 1.6, 4.0], [tS1, .5, 4.05, 7.0]];
  const SWOOP_L = [[tS0, -.05, .46, 1150], [tS0 + .54, -.02, .3, 1150], [tS1, 0, .12, 1150]];
  const BACK = [[tP1, .45, 4.0, 7.45], [tP1 + .4, .7, .9, 4.4], [tP1 + .7, .85, -1.55, 1.3], [tP1 + .9, .95, -1.65, -.35], [tB1, 1.6, -1.75, -2.3]];
  const BACK_L = [[tP1, 0, .12, 1150], [tP1 + .5, 0, -.08, 1150], [tP1 + .9, .1, 0, 1220], [tB1, .17, .05, 1300]];
  // 5.05 the desk; 5.06–5.08 the flight (camera and plane), the plane's wake on "down"; the wing fills the frame at CUT
  const tD0 = A.gone + .46, tD1 = A.goneE + .6, tL0 = A.finally + .54, tL1 = A.finally + 1.24, tF0 = A.noE + .07;
  const FLY = [[tF0, 1.25, -1.35, -1.5], [86.10, .95, -1.55, -.3], [86.35, .75, -1.85, 2.4], [86.60, .65, -2.15, 6.3], [86.95, .2, -2.1, 6.75],
    [87.25, -2.2, -1.2, 8.0], [87.50, -3.8, .4, 10.8], [87.80, -3.8, 0, 16.8], [88.05, -3.7, -3.0, 21.6], [88.35, -3.2, -5.4, 25.5], [88.80, -2.0, -5.0, 30.0],
    [89.30, -1.0, -2.0, 34.0], [89.75, -.3, -.7, 37.6], [90.25, .1, 5.4, 39.9], [90.70, .25, 9.5, 41.1], [A.down, .25, 10.1, 41.5], [91.50, .3, 9.3, 42.0], [CUT, .35, 6.6, 42.6]];
  const FLY_L = [[tF0, -.1, .2, 1300], [86.15, -.02, .1, 1150], [86.6, 0, .02, 1150], [86.95, 0, .03, 1150], [87.5, .02, .12, 1150], [88.05, 0, .22, 1150], [88.35, 0, .3, 1150],
    [88.8, 0, .33, 1150], [89.3, 0, .45, 1150], [89.75, 0, .55, 1150], [90.25, 0, .56, 1150], [90.7, 0, .56, 1150], [A.down, 0, .56, 1150], [91.5, 0, .2, 1150], [CUT, 0, -.25, 1150]];
  const lens = (t, L) => { const [lx, ly, f] = spline(t, L); return { lx, ly, f }; };
  const camCity = (t) => {
    if (t < PB1) return pullBack(t).cam;
    if (t < tS0) return path(t, KEYS);
    if (t < tS1) { const [x, y, z] = fly(t, SWOOP, .25, .3); return { x, y, z, ...lens(t, SWOOP_L) }; }
    if (t < tP1) { const u = sio((t - tS1) / (tP1 - tS1)); return { x: mix(.5, .45, u), y: mix(4.05, 4.0, u), z: mix(7.0, 7.45, u), f: 1150, lx: 0, ly: .12 }; }
    if (t < tB1) { const [x, y, z] = fly(t, BACK, .3, .3); return { x, y, z, ...lens(t, BACK_L) }; }
    if (t < tW1) { const u = sio((t - tB1) / (tW1 - tB1)); return { x: mix(1.6, 1.72, u), y: mix(-1.75, -1.82, u), z: mix(-2.3, -1.95, u), f: 1300, lx: mix(.17, .2, u), ly: .05 }; }
    if (t < tF0) return path(t, [[tW1, { x: 1.72, y: -1.82, z: -1.95, f: 1300, lx: .2, ly: .05 }], [tW1 + .5, { x: 1.7, y: -1.8, z: -1.92, f: 1300, lx: .19, ly: .07 }, sio],
      [tD1, { x: 1.25, y: -1.35, z: -1.5, f: 1300, lx: 0, ly: .45 }, cio], [tL1, { x: 1.25, y: -1.35, z: -1.5, f: 1300, lx: -.1, ly: .2 }, cio], [tF0, { x: 1.25, y: -1.35, z: -1.5, f: 1300, lx: -.1, ly: .2 }, sio]]);
    const [x, y, z] = fly(t, FLY, .1, 0); return { x, y, z, ...lens(t, FLY_L) };
  };
  // the letter → "No." → the dart
  const letter = (t) => ({ lift: ramp(t, tL0, tL1, cio), ink: ramp(t, A.no, A.no + .47, (x) => x), fold: ramp(t, A.no + .5, tF0, cio) });
  const tieU = (t) => (t < tW1 ? 0 : t < A.gone + .46 ? mix(0, .3, sio((t - tW1) / .5)) : t < A.gone + .71 ? mix(.3, .5, (t - A.gone - .46) / .25) : mix(.5, 1, eo(clamp((t - A.gone - .71) / .6))));
  const PLANE = [[tF0, 1.12, -1.16, -.78], [86.05, .95, -1.45, .4], [86.30, .75, -1.95, 3.6], [86.58, .5, -2.05, 7.5], [86.88, -1.0, -1.75, 8.3],
    [87.18, -3.4, -.4, 10.9], [87.48, -3.75, -.1, 15.2], [87.78, -3.6, -2.0, 21.0], [88.08, -3.2, -4.7, 25.6], [88.38, -2.4, -5.6, 28.9], [88.83, -.4, -5.2, 33.8],
    [89.33, .3, -2.6, 37.6], [89.83, .3, 2.6, 40.6], [90.33, -.3, 7.4, 42.1], [90.78, -.7, 10.4, 43.0], [A.down, .15, 11.05, 43.45], [91.35, .45, 9.9, 43.7], [91.65, .4, 7.6, 43.7], [CUT, .38, 5.6, 43.65]];
  const planeAt = (t) => fly(t, PLANE, .12, 0);
  const W0 = 91.62;
  const planeCity = (ctx, t, cam) => {
    if (t < tF0) return;
    const p = planeAt(t), q = planeAt(t + .02), v = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
    let ori = oriFrom(v, .08 * Math.sin(t * 5.3));
    ori = lerpOri({ yaw: 0, pitch: Math.PI / 2, roll: 0 }, ori, smo(clamp((t - tF0) / .25)));
    ori = lerpOri(ori, ORI_CUT, smo(clamp((t - 91.3) / (W0 - 91.3))));
    if (t < W0) { drawDart(ctx, cam, p, ori, { size: 1.1, ...PAPER }); return; }
    const c = camOf(camCity(W0)), p0 = planeAt(W0), s0 = c.P(...p0);
    wingFill(ctx, smo(clamp((t - W0) / (CUT - .01 - W0))) ** 1.6, s0[0], s0[1], s0[2] * 1.1, ORI_CUT, PAPER);
  };
  const roomState = (t) => {
    const td = tod(t), pb = t < PB1 ? pullBack(t) : null;
    return {
      tod: td,
      out: {
        k: pb ? pb.k : .12, sunXY: pb ? pb.sunXY : null, plate: t <= PB0 + 1 / 60 ? 1 : 0,
        office: { chair: .6 + .5 * (t - 85.9), lamp: t < A.boss + .18 ? 1 : 0 },
        shopInterior: (c, tt, cam, r) => shopInterior(c, tt, cam, r, { sums: ramp(tt, A.maths, A.maths + .85, sio), receipt: ramp(tt, A.checkout - .3, A.checkout + .75, sio) }),
        mid: (c, tt, cam) => drawMid(c, tt, cam, { trainX: 10 - 22 * (tt - 87.9), laces: pulse(tt, A.down - .02, A.down + .12, A.down + .6, A.down + 1.3, sio) }),
      },
      curtain: ramp(t, A.everything - .06, A.everything + .9, cio), gust: pulse(t, A.everything - .15, A.everything + .35, A.hoped + .3, A.hoped + 1.6, sio),
      flood: mix(.28, 1, ramp(t, A.everything, A.everything + .8, cio)), patchA: 1, beamA: 1,
      sleeper: { up: ramp(t, A.wakes, A.wakesE + .1, cio), arms: ramp(t, A.wakes + .3, A.wakesE + .5, sio) },
      clock: { h: mix(7.0, 9.0, ramp(t, A.sleep + .3, A.wakes - .05, qio)) },
      tie: { u: tieU(t) },
      letterDraw: (c, tt, cam, phase) => { const L = letter(tt); if (L.fold >= 1) return; if ((phase === 'air') !== (L.lift > 0)) return; drawLetter(c, tt, cam, L); },
    };
  };
  const city = (ctx, t) => { const cam = camOf(camCity(t)); drawRoom(ctx, t, cam, roomState(t)); planeCity(ctx, t, cam); };

  // ------------------------------------------------------------------ the coast and the hill (lib/maslow4.mjs world)
  const P_ = [SPOT.you + 2.6, GARDEN.ground - 7.5], C = [960, 540];
  const Z0 = { x: 905, y: 712, z: 1.55 }, ZG = 38, tA1 = A.grandmother + .04, tN1 = A.street - .8;
  const sAt = (c, p) => [(p[0] - c.x) * c.z + 960, (p[1] - c.y) * c.z + 540];
  const camFrom = (z, s) => ({ x: P_[0] - (s[0] - C[0]) / z, y: P_[1] - (s[1] - C[1]) / z, z });
  const S0 = sAt(Z0, P_), S2 = [1000, 600], SH = sAt(VIEWS.H1.cam, P_);
  const hillCam = (t) => {
    if (t < tA1) { const u = clamp((t - CUT) / (tA1 - CUT)), e = cio(u), z = Math.exp(mix(Math.log(Z0.z), Math.log(ZG), e)); return camFrom(z, [mix(S0[0], C[0], e), mix(S0[1], C[1], e)]); }
    if (t < A.notJust) return camFrom(ZG * Math.exp(.08 * sio((t - tA1) / (A.notJust - tA1))), C);
    const zA = ZG * Math.exp(.08);
    if (t < tN1) { const e = cio((t - A.notJust) / (tN1 - A.notJust)); return camFrom(Math.exp(mix(Math.log(zA), Math.log(10), e)), [mix(C[0], S2[0], e), mix(C[1], S2[1], e)]); }
    if (t < H1T) { const u = clamp((t - tN1) / (H1T - tN1)), e = 1 - (1 - smo(u)) ** 2; return camFrom(Math.exp(mix(Math.log(10), 0, e)), [mix(S2[0], SH[0], e), mix(S2[1], SH[1], e)]); }
    return { ...VIEWS.H1.cam };
  };
  const GT = { sit0: A.grandmother + .09, sit1: A.grandmother + .89, lap0: A.tuesday + .04, pick0: A.tuesday + .39, pick1: A.tuesday + .84, lay0: A.because - .4, lay1: A.because - .04, because: A.because };
  // the plane over the water and into the garden
  const ORI_FLY = { yaw: 0, pitch: -.35, roll: 0 };
  const SCR = [[CUT, 930, 770], [93.0, 905, 742], [A.love, 872, 712], [A.love + .45, 840, 690]];
  const GPATH = [[A.love + .35, GARDEN.x + 14, GARDEN.ground - 22, 0], [A.love + .85, GARDEN.x + 22, GARDEN.ground - 19, 0], [tA1 - .1, GARDEN.x + 30, GARDEN.ground - 16.5, 0],
    [tA1 + .3, GARDEN.x + 37, GARDEN.ground - 12.5, 0], [A.tuesday - .31, GARDEN.x + 41.5, GARDEN.ground - 8.5, 0], [A.tuesday, SPOT.land[0], GARDEN.ground - 4.25, 0]];
  const planeHill = (t) => (ctx, info) => {
    const cam = hillCam(t), col = mixHex(PAPER.col, '#f6e2c4', ramp(t, 92.4, 94.5)), o = { col, lit: .5 };
    if (t < CUT + .55) { const u = 1 - eo(clamp((t - CUT - .02) / .53)); wingFill(ctx, u, 930, 770, 640, lerpOri(ORI_CUT, ORI_FLY, smo(clamp((t - CUT - .12) / .6))), o); return; }
    const sS = (() => { const [x, y] = spline(t, SCR.map(([a, b, c]) => [a, b, c, 0])); return [x, y]; })();
    const sz = Math.exp(mix(Math.log(640), Math.log(300), sio(clamp((t - CUT - .55) / (A.love - CUT - .55)))));
    let ori = { ...ORI_FLY, roll: .08 * Math.sin(t * 3.1) };
    const bank = smo(clamp((t - A.love) / .45)); ori = lerpOri(ori, { yaw: -.5, pitch: -.2, roll: -.7 }, bank);
    const wW = smo(clamp((t - (A.love + .35)) / .6)), zz = cam.z, sWorld = UPM * zz * 1.1;
    if (t < A.tuesday) {
      const g = fly(t, GPATH, .0, .35), gs = sAt(cam, g), q = fly(t + .02, GPATH, 0, .35);
      const oriW = oriFrom([q[0] - g[0], q[1] - g[1], 0], -.25);
      const x = mix(sS[0], gs[0], wW), y = mix(sS[1], gs[1], wW), s = Math.exp(mix(Math.log(sz), Math.log(sWorld), wW));
      dartScreen(ctx, x, y, s, wW < 1 ? lerpOri(ori, oriW, wW) : oriW, o); return;
    }
    // landed; picked up by her hand; laid on your knee
    if (!info) return;
    const rest = { yaw: Math.PI / 2, pitch: 0, roll: .3 }, land = sAt(cam, [SPOT.land[0], GARDEN.ground - 4.25]);
    let p = land;
    if (t >= GT.pick1 && info.hand) p = [info.hand[0] + 2 * zz * .051, info.hand[1] - 3 * zz * .051];
    if (t >= GT.lay1) p = [info.knee[0], info.knee[1] - .27 * zz];
    dartScreen(ctx, p[0], p[1], sWorld, rest, o);
  };
  const hillState = (t) => {
    const doors = 1 - ramp(t, 102.9, 103.9, sio), chars = doors > .3;
    return {
      night: .3 * ramp(t, 101.5, 105.5, sio), lit0: ramp(t, A.home, A.home + 1.3, (x) => x), labels: ramp(t, 103.4, 104.6, sio), title: ramp(t, A.have, A.have + .8, sio),
      focusU: .35 * ramp(t, A.anymore - .26, A.anymore + .54, sio), doors, people: 1, haze: 1 - ramp(t, tA1 + .2, tA1 + 2.2, sio),
      gold: 1 - ramp(t, tN1 - .2, 104.2, sio), warm: .5 * ramp(t, A.because, A.because + .8, sio) * (1 - ramp(t, tN1 - .2, 104.2, sio)),
      chars, kids: chars, T: GT, catU: t < A.because ? 0 : t < A.because + .9 ? smo((t - A.because) / .9) : 1 + smo(clamp((t - A.because - .9) / .7)),
      plane: chars ? planeHill(t) : null,
    };
  };
  const hill = (ctx, t) => { if (t >= H1T) { drawHill(ctx, t, VIEWS.H1.cam, VIEWS.H1.st); return; } hillFrame(ctx, t, hillCam(t), hillState(t)); };
  const take = (ctx, t) => (t < CUT ? city(ctx, t) : hill(ctx, t));

  await ready();
  const P1 = HI.print, P2 = HO.print;
  const out = [
    { t: HI.b, tr: 'cut', d: .1, print: P1, draw: take, sound: [{ f: 'whoosh_airy', t: A.everything - .2, v: .3 }, { f: 'curtain', t: A.everything - .05, v: .45 }] },
    { t: A.sleep, tr: 'cut', d: .1, print: P1, draw: take, sound: [{ f: 'tick', t: A.sleep + .6, v: .25 }] },
    { t: A.stop - .1, tr: 'cut', d: .1, print: P1, draw: take, sound: [{ f: 'whoosh', t: tS0 + .1, v: .35 }, { f: 'pencil', t: A.maths, v: .3 }] },
    { t: A.knot, tr: 'cut', d: .1, print: P1, draw: take, sound: [{ f: 'whoosh_up', t: tP1 + .05, v: .3 }, { f: 'drop', t: A.gone + .9, v: .3 }] },
    { t: A.finally, tr: 'cut', d: .1, print: P1, draw: take, sound: [{ f: 'pencil_desk', t: A.no, v: .4 }, { f: 'paper_pop', t: A.no + .55, v: .35 }, { f: 'whoosh_airy', t: tF0 + .05, v: .35 }] },
    { t: A.boss - .2, tr: 'cut', d: .1, print: P1, draw: take, sound: [{ f: 'lamp', t: A.boss + .18, v: .45 }] },
    { t: A.commute - .2, tr: 'cut', d: .1, print: P1, draw: take, sound: [{ f: 'whoosh', t: 88.05, v: .4 }] },
    { t: A.job, tr: 'cut', d: .1, print: P1, draw: take, sound: [{ f: 'gust', t: A.down, v: .35 }, { f: 'wings', t: A.down + .5, v: .3 }] },
    { t: CUT, tr: 'cut', d: .1, print: P2, draw: take, sound: [{ f: 'swell', t: A.love - .3, v: .3 }, { f: 'paper_pop', t: A.tuesday, v: .3 }] },
    { t: A.because - .2, tr: 'cut', d: .1, print: P2, draw: take, sound: [{ f: 'bloom', t: A.because, v: .35 }] },
    { t: A.notJust, tr: 'cut', d: .1, print: P2, draw: take, sound: [{ f: 'chalk', t: A.notJust + .5, v: .3 }] },
    { t: A.home - .1, tr: 'cut', d: .1, print: P2, draw: take, sound: [{ f: 'chime', t: A.home, v: .4 }] },
    { t: A.have - .1, tr: 'cut', d: .1, print: HO.print, draw: take, sound: [{ f: 'pencil', t: A.have, v: .3 }] },
  ];
  out.dbg = { camCity, planeAt, hillCam, A, CUT };
  return out;
};
