// c02 · What we unlearn (01a), plate paper (exam) → plate mirror. ONE continuous take in the gym of light, no cut.
// Shot list: /mnt/project-files/scenario/film-klueger/bild/shots.md §4 (2.01–2.12). Anchors are VO phrases (T.S / T.E on '01a').
//
//  shot  anchor (01a)                              image                                                          the one movement
//  2.01  start … "Follow the blue dot…"            pull out of the paper: the blank margin of the city map pinned     the pull-out, then the dot
//                                                  on the back wall; a small cool blue dot walks its streets
//  2.02  "and the map in your head…fade"           the streets fade behind the dot (a paper band follows it: a mask)  the fade
//  2.03  "At least, that's what one small study"   held drift on the map; tag DAHMANI & BOHBOT · McGILL · SCI REP 2020 camera only
//  2.04  "But that's just streets. What about…"    the camera sinks and backs away from the map: under it the long     the move
//                                                  table of the doctors (by the mirror wall, behind the Go grid)
//  2.05  "In Poland, nineteen … cancer."           nineteen doctors in white coats, each at a slanted stand with an    the desk machines light in a
//                                                  engraved exam image; on "assistant" the desk machines light, on     wave; then the cool squares
//                                                  "marks" a cool light square marks a spot on each image; tag POLAND
//  2.06  "These weren't beginners… two thousand"  beside each image a stack of exam folders grows; slate: 2,000+      the stacks (a wave)
//  2.07  "Then researchers … without the machine." the desk machines go dark; the doctors lean in, alone               the lamps
//  2.08  "Before it arrived … twenty-eight…"       dolly to the mobile slate by the table: bar 28 % (before)            bar
//  2.09  "A few months after … twenty-two."        bar 22 % (after)                                                     bar
//  2.10  "It's a signal, not proof. … simple one." chalk underline; the camera drifts back                              drift
//  2.11  "What you stop doing, you start to lose"  back along the Go grid to the mirror wall: the dumbbell rack, one     the camera finds it
//                                                  dumbbell dust-grey; you (thin arms) and the machine (forklift) at the rack
//  2.12  "But surely you'd notice… Right?"         you step to the mirror and look up; the camera flies into the       your step, the fly-into
//                                                  reflection of a window in the glass → plate mirror (c02>c03)
// Ruhe: one take, glide camera (monotone cubic: holds keep drifting, moves peak at 1.5× their mean speed), one movement at a time.
// New places: the doctors' table (lib/f11_c02_world DTABLE, x 6.7…7.6, z 26…37.6), the mobile slate SLATE_P (7.4, 24.6), the rack (kit RACK).
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein } from '../engine.mjs';
import * as K from '../lib/f11_kit.mjs';
import * as Wd from '../lib/f11_c02_world.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';
import { walk } from '../lib/figure.mjs';

const PRINT = { riso: .25 };
export const SLATE_P = [8.2, 0, 24.6];
export const YOU_DZ = 2.2;   // in c02/c03 you train at the near end of the rack (YOU + 2.2 m in z), the machine behind you

export default async (T, R) => {
  await K.studentsPrepare(); await Wd.doctorsPrepare();
  const { in: HI, out: HO } = handsOf('c02', T);
  const S = (p, n) => T.S('01a', p, n), E = (p, n) => T.E('01a', p, n);
  const A = {
    start: HI.b, s1: S('Follow'), dot: S('blue dot'), fade: S('and the map'), fadeE: E('to fade'), s2: S('At least'), s3: S('But that'), s4: S('What about'),
    s5: S('In Poland'), nine: S('nineteen'), asst: S('assistant'), marks: S('marks'), s5e: E('into cancer'), s6: S('These weren'), s7: S('Each of'), two: S('two thousand'),
    s8: S('Then researchers'), without: S('without the'), s9: S('Before it'), found: S('found a'), p28: S('twenty-eight'), s10: S('A few months'), p22: S('twenty-two'),
    s11: S('It\'s a signal'), s12: S('But it\'s a simple'), s12e: E('simple one'), s13: S('What you stop'), s14: S('Even as'), s15: S('But surely'), notice: S('notice'), right: S('Right'),
    end: HO.a,
  };

  // ---------------------------------------------------------------- the camera
  const M = K.MAP, MZ = M.z - .012;
  const C0 = { x: 4.3, y: 2.47, z: MZ - .34, yaw: 0, pitch: 0, f: 1700 };       // on the blank lower margin of the map: the plate
  const C1 = { x: 5.0, y: 3.15, z: 27.6, yaw: .02, pitch: .045, f: 1900 };       // the whole map
  const tPull = A.start + 6.6;
  const KEYS = [
    [tPull, C1],
    [A.s3 + .1, { x: 4.92, y: 3.08, z: 27.2, yaw: .03, pitch: .04, f: 1880 }],      // 2.02–2.03 hold (drift)
    [A.s5 + 2.6, { x: 4.45, y: 2.05, z: 22.7, yaw: .36, pitch: -.1, f: 1450 }],       // 2.04 down and back: the table under the map
    [A.without + .35, { x: 4.6, y: 2.0, z: 23.05, yaw: .38, pitch: -.095, f: 1500 }],      // 2.05–2.07 hold: doctors, machines, stacks
    [A.found - .2, { x: 7.1, y: 1.86, z: 20.1, yaw: .2, pitch: -.03, f: 1560 }],        // 2.08 to the slate
    [A.s11 + .3, { x: 7.12, y: 1.84, z: 19.75, yaw: .2, pitch: -.03, f: 1540 }],       // 2.08–2.10 hold: bars
    [A.s13 + 2.4, { x: 6.55, y: 1.68, z: 14.45, yaw: .6, pitch: -.05, f: 1450 }],     // 2.11 back to the rack and you
    [A.s15 + .8, { x: 6.6, y: 1.68, z: 14.3, yaw: .62, pitch: -.045, f: 1470 }],      //      hold
  ];
  // the fly-into: the reflection of a window in the mirror (the plate). Pick the reflected window seen best from the last key.
  const L = KEYS[KEYS.length - 1][1];
  const WIN = K.WINDOWS[5];   // z 33.5 → seen in the glass at z ≈ 17.5, above the rack, in front of you and the machine
  const TG = [Wd.MX, (WIN.y0 + WIN.y1) / 2 + .2, WIN.z];
  const tFly0 = KEYS[KEYS.length - 1][0], tFly1 = A.end - .05;
  const dir = Wd.lookAt(L, TG);
  const LEND = (() => { const u = .62; return { x: mix(L.x, 10.6, u), y: mix(L.y, L.y + (TG[1] - L.y) * (10.6 - L.x) / (TG[0] - L.x), u), z: mix(L.z, L.z + (TG[2] - L.z) * (10.6 - L.x) / (TG[0] - L.x), u) }; })();
  const dEnd = Math.hypot(TG[0] - LEND.x, TG[1] - LEND.y, TG[2] - LEND.z);
  const fEnd = 1.45 * 960 / (WIN.w / 2 / dEnd);   // the window's half width fills half the frame (+18 %)
  const CE = { ...LEND, yaw: dir.yaw, pitch: Wd.lookAt(LEND, TG).pitch, f: fEnd };
  function cam(t) {
    if (t < tPull) { const u = sm(lin(A.start, tPull, t)); return Wd.flyCam(u, C0, C1, [C0.x, C0.y, MZ]); }
    if (t < tFly0) return Wd.glide(t, KEYS);
    const u = lin(tFly0, tFly1, t), e = u * u * (3 - 2 * u);
    const c = Wd.flyCam(e, L, CE, TG);
    const lk = Wd.lookAt(c, TG), w = sm(lin(0, .55, u));
    return { ...c, yaw: mix(L.yaw, lk.yaw, w), pitch: mix(L.pitch, lk.pitch, w) };
  }

  // ---------------------------------------------------------------- the map: the dot walks, the streets fade behind it
  const route = (t) => (t < A.dot - .3 ? -1 : eio(lin(A.dot - .3, A.s3 - .2, t)));
  const fade = (t) => clamp(Math.min(route(t) - .06, sm(lin(A.fade - .2, A.s3 - .2, t))));

  // ---------------------------------------------------------------- the doctors
  const D = Wd.DOCTORS;
  const lampOn = (d) => A.asst + .05 + d.i * .07;
  const lamp = (d) => (t) => eout(lin(lampOn(d), lampOn(d) + .4, t)) * (1 - eio(lin(A.without + .05 + d.i * .025, A.without + .4 + d.i * .025, t)));
  const mark = (d) => (t) => eout(lin(A.marks + .1 + d.i * .08, A.marks + .45 + d.i * .08, t)) * (1 - eio(lin(A.without + .05 + d.i * .025, A.without + .35 + d.i * .025, t)));
  const stack = (d) => (t) => eout(lin(A.s6 + .2 + d.i * .09, A.s6 + 1.4 + d.i * .09, t));
  const lean = (t) => eio(lin(A.without + .3, A.without + 1.5, t));
  const LIVE = new Set([0, 1, 2, 3]);

  // ---------------------------------------------------------------- the slate: 19 doctors · 2,000+ exams each · 28 % → 22 %
  const COOL = '#cfe6f2';
  function chalk(ctx, Sl, t) {
    K.chalkText(ctx, '19 doctors', 14, 30, { size: 21, });
    K.chalkText(ctx, '2,000+ exams each', 14, 54, { size: 15, });
    const base = 112, U = 2.3, xs = [134, 186], w = 32;
    if (t > A.found - .3) {
      K.chalkText(ctx, 'growth found', 172, 22, { size: 14, align: 'center', u: lin(A.found, A.found + .7, t), a: .8 });
      K.chalkLine(ctx, [[120, base], [232, base]], { u: lin(A.found + .1, A.found + .6, t), lw: 1.6 });
      K.chalkText(ctx, 'before', xs[0] + w / 2, base + 13, { size: 11, align: 'center', u: lin(A.found + .5, A.found + .9, t), a: .75 });
      K.chalkBar(ctx, xs[0], base, w, U * 28, { u: eout(lin(A.p28, A.p28 + .55, t)), seed: 7, lw: 2.2 });
      K.chalkText(ctx, '28 %', xs[0] + w / 2, base - U * 28 - 7, { size: 17, align: 'center', u: lin(A.p28 + .45, A.p28 + .85, t) });
    }
    if (t > A.s10 - .3) {
      K.chalkText(ctx, 'after', xs[1] + w / 2, base + 13, { size: 11, align: 'center', u: lin(A.s10 + .2, A.s10 + .6, t), a: .75 });
      K.chalkBar(ctx, xs[1], base, w, U * 22, { u: eout(lin(A.p22, A.p22 + .55, t)), col: COOL, seed: 8, lw: 2.2 });
      K.chalkText(ctx, '22 %', xs[1] + w / 2, base - U * 22 - 7, { size: 17, align: 'center', u: lin(A.p22 + .45, A.p22 + .85, t), col: COOL });
      K.chalkLine(ctx, [[xs[1] - 6, base - U * 22 - 27], [xs[1] + w + 6, base - U * 22 - 28.5]], { u: lin(A.s12 + .4, A.s12 + 1.0, t), lw: 1.8, col: COOL });
    }
  }

  // ---------------------------------------------------------------- you and the machine (forklift: your arms thin, the forks hold your weight)
  const tStep = A.notice - .2;
  function gym(t) {
    const st = { ...Wd.FORK, dz: YOU_DZ };
    const u = lin(tStep, tStep + 1.1, t);
    st.dx = -.36 + .36 * sm(u);
    if (u > 0 && u < 1) { const w = walk(Math.PI * 2 * .5 * u); st.pose = { ...w, sh: [.08, .06], el: [.12, .2] }; }
    else st.pose = { ...K.GYM.idle, head: -.08 * sm(lin(tStep + .8, tStep + 1.6, t)) };
    return st;
  }

  // ---------------------------------------------------------------- the frame
  const B0 = K.EXAM.at('B', 0, 2);
  function draw(ctx, t) {
    const V = Wd.safeView(K.view3(cam(t))), st = gym(t);
    if (V.f > 6000) {   // deep in the fly-into: only the glass is in view (drawing the room at this focal length would explode the paths)
      ctx.fillStyle = K.PAL.mirror; ctx.fillRect(0, 0, W, H); Wd.mirrorOverlay(ctx, t, V, {}); return;
    }
    K.hall(ctx, t, V, { board: (c, Bd) => Wd.board01(c, Bd), go: (c, VV) => Wd.go01(c, VV, t) });
    Wd.mapC02(ctx, t, V, { paper: (c) => plate(c, t, 'paper', { tone: 'exam' }), route: route(t), fade: fade(t) });
    Wd.mirrorOverlay(ctx, t, V, { actors: (c, VV) => { Wd.drawGym(c, t, VV, st, true); } });
    Wd.doctorsRow(ctx, t, V, { lamp: (d) => lamp(d)(t), mark: (d) => mark(d)(t), stack: (d) => stack(d)(t), lean: () => lean(t), live: LIVE });
    Wd.slate(ctx, t, V, SLATE_P, { chalk });
    K.examHall(ctx, t, V, { lampOf: (d) => (d === B0 ? 1 : 0), dotOf: (d) => (d.g === 'B' ? 1 : 0), only: (d) => V.toCam([d.x + .3, .74, d.z])[2] > 1.2 });   // a desk at the camera plane would blow up to a frame-sized ellipse
    Wd.rack(ctx, t, V, { dust: 2 });
    Wd.drawGym(ctx, t, V, st, false);
    // tags (upper left)
    const u1 = Math.min(lin(A.s2 + .3, A.s2 + .9, t), 1 - lin(A.s4, A.s4 + .4, t));
    if (u1 > 0) K.tag(ctx, 'DAHMANI & BOHBOT  ·  McGILL  ·  SCIENTIFIC REPORTS 2020', 72, 96, { u: u1 });
    const u2 = Math.min(lin(A.s5 + .5, A.s5 + 1.1, t), 1 - lin(A.s6 + 1.2, A.s6 + 1.6, t));
    if (u2 > 0) K.tag(ctx, 'POLAND  ·  4 CLINICS  ·  LANCET GASTROENTEROLOGY & HEPATOLOGY 2025', 72, 96, { u: u2 });
  }

  return [{
    t: HI.b, tr: 'cut', d: .1, draw, print: PRINT,
    sound: [
      { f: 'paper_slide', t: A.start + .2, v: .3 }, { f: 'chime', t: A.asst + .1, v: .3 }, { f: 'pages', t: A.s6 + .3, v: .35 },
      { f: 'powerdown', t: A.without + .05, v: .3 }, { f: 'chalk', t: A.p28, v: .4 }, { f: 'chalk', t: A.p22, v: .35 },
      { f: 'whoosh_airy', t: A.end - 1.2, v: .25 },
    ],
  }];
};
