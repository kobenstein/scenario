// c01 · Hook (00a + 00b, first word → plate c01>c02). Builder: Bild-Lead. ONE continuous take in the gym of light, no cut.
// Shot list: /mnt/project-files/scenario/film-klueger/bild/shots.md §4 (1.01–1.16). Anchors are VO phrases (lib/kit.mjs T.S / T.E).
//
//  shot  anchor (00a / 00b)                      image                                                         the one movement
//  1.01  start … "Superintelligence can make…"   you curl the dumbbell of light at the mirror, the machine's    your curl (arm swells 1.0→1.18);
//                                                hand of light on your back; title upper left                   title masked out at "Or"
//  1.02  "Or it can think for you."              the arm folds, the forks swing out under the dumbbell and      the take-over (brass click)
//                                                lift it out of your hand; your arm drops, thin (.85)
//  1.03  "In Turkey, almost a thousand…"         crane back + up over the exam desks to the board; chalk title,  the crane
//                                                source tag (PNAS 2025)
//  1.04  "Two groups had the same machine…"      the desk machines of A and B light in a wave; "one small         the wave (chime), then B's dots
//                                                difference": B's warm dial dots
//  1.05  "A third group had none."               the crane settles on the overview: group C on the left, bare     camera only
//  1.06  "While practicing, both … flew."        dolly + slow zoom toward the board: practice bars C 1 · A +48 % ·  bars (snappy, chalk tick)
//                                                B +127 %
//  1.07  "Then came the exam, without…"          "exam" chalked; on "without" every desk machine goes dark         the lamps
//  1.08  "One group did worse…"                  exam bars: C = 1 with a dashed line, A falls short (−17 %)         bar A
//  1.09  "The other lost nothing."               B reaches the line                                                 bar B
//  1.10  "What was the difference? Find it…"     crane down to the front-right B desk: the student (alive), the      the descent
//                                                desk machine with its warm dial (not legible)
//  1.11  "In the next ten minutes … notice."     pan right to you at the mirror: the forklift holds your weight,    pan; then the reflection
//                                                your arms thin; on "why we don't notice" your reflection swells
//  1.12  "Then, how to make it the best…"        trainer: the forks bring the dumbbell back to your hand, fold;     the hand-back (brass click)
//                                                the arm of light reaches your back, you curl again
//  1.13  "Here's a first clue. For sixty-six…"   crane up + tilt onto the Go grid behind you: a flat line of light   the line (stone click at "beat")
//                                                from 1950; at "beat" a white stone drops (2016); the line bends
//                                                and climbs into the depth on "humans got better"
//  1.14  "Keep that in mind."                    the black stone on the rising line glows warm                      the glow
//  1.15  00b "You might be thinking: … chatbots" down to the B desk: its small desk machine lights again           the lamp
//  1.16  "That's exactly why … what comes next"  pull back: the small machine and, behind, the big one with you;     pull back, then the push
//                                                then the push into the blank exam sheet → paper plate (c01>c02)
// Ruhe: 0 hard cuts; one main movement at a time; the camera never stops (slow keys, ends eased). Print { riso: .25 } throughout.
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, canvas } from '../engine.mjs';
import * as K from '../lib/f11_kit.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';

const PRINT = { riso: .25 };
const DR = 11;   // dumbbell radius (cm, local)
const COOL = '#cfe6f2';

export default async (T, R) => {
  await K.studentsPrepare();
  const OUT = handsOf('c01', T).out;   // paper exam plate
  const S = (p, n) => T.S('00a', p, n), E = (p, n) => T.E('00a', p, n), Sb = (p) => T.S('00b', p), Eb = (p) => T.E('00b', p);
  const A = {
    s1: S('Superintelligence'), s1e: E('before you'), s2: S('Or it can'), s2e: E('think for you'), s3: S('In Turkey'), s3e: E('math experiment'),
    s4: S('Two groups'), s4m: S('same machine'), s4d: S('one small difference'), s5: S('A third'), s6: S('While practicing'), s6f: S('flew'),
    s7: S('Then came'), s7w: S('without the'), s8: S('One group'), s9: S('The other'), s10: S('What was'), s11: S('Find it'), s11e: E('becoming'),
    s12: S('In the next'), s13: S('what it'), s13n: S('and why'), s13e: E('notice'), s14: S('Then how'), s14e: E('ever had'),
    s15: S('Here'), s16: S('For sixty'), s16e: E('barely got better'), s17: S('Then a machine'), s17b: S('beat'), s18: S('And suddenly'), s18h: S('humans got'),
    s19: S('Keep that'), s19e: E('in mind'),
    b20: Sb('You might'), b21: Sb('these are'), b21c: Sb('today'), b22: Sb('That'), b23: Sb('How you use'), b23n: Sb('what comes next'), b23e: Eb('what comes next'),
    end: OUT.a,
  };

  // your hand at the top of a curl, in figure units relative to the hip (view independent: the figure is a billboard)
  const [, sg] = canvas(400, 400);
  const top = K.athlete(sg, 200, 200, 1, K.curl(1), { t: 0, arm: 1 }).hand(0), TOP = [top[0] - 200, top[1] - 200];

  // ---------------------------------------------------------------- the camera (one take)
  const B = K.EXAM.at('B', 0, 2);   // the front-right B desk: the student we come back to, the sheet we fly into
  const SHEET = [B.x + .62 - .02, .742, B.z - .12];
  // RUHE: move – hold – move (K.camEase: every key a soft stop). Holds carry the sentences, moves are short and land before the accent.
  const CAM = [
    [0, { x: 7.35, y: 1.38, z: 9.7, yaw: .12, pitch: -.03, f: 1800 }],                       // 1.01–1.02 hook (hold, slow push)
    [A.s3 - .2, { x: 7.42, y: 1.4, z: 9.95, yaw: .12, pitch: -.03, f: 1830 }],
    [A.s3 + 4.6, { x: 5.6, y: 3.6, z: 7.2, yaw: -.62, pitch: -.18, f: 1300 }],                // 1.03 crane to the overview
    [A.s6, { x: 5.5, y: 3.55, z: 7.4, yaw: -.6, pitch: -.17, f: 1320 }],                     // 1.04–1.05 hold: the wave, group C
    [A.s6 + 2.2, { x: 4.6, y: 3.3, z: 9.6, yaw: -.29, pitch: -.06, f: 2300 }],                // 1.06 to the board
    [A.s10, { x: 4.62, y: 3.26, z: 9.85, yaw: -.29, pitch: -.06, f: 2340 }],                 // 1.06–1.09 hold: the bars
    [A.s10 + 2.8, { x: 4.75, y: 1.5, z: 12.15, yaw: -.16, pitch: -.19, f: 1650 }],           // 1.10 down to the B desk
    [A.s12, { x: 4.74, y: 1.49, z: 12.3, yaw: -.16, pitch: -.19, f: 1690 }],                 //      hold: the student
    [A.s13n - .3, { x: 6.2, y: 2.0, z: 10.2, yaw: .52, pitch: -.1, f: 1600 }],                // 1.11 pan to you
    [A.s15 - 1.0, { x: 6.3, y: 2.0, z: 10.45, yaw: .52, pitch: -.1, f: 1630 }],               // 1.11–1.12 hold: reflection, the hand-back
    [A.s16 + 1.2, { x: 5.0, y: 4.4, z: 13.4, yaw: .05, pitch: -.56, f: 1300 }],                // 1.13 crane onto the Go grid
    [A.s19e, { x: 4.98, y: 4.32, z: 13.6, yaw: .05, pitch: -.55, f: 1320 }],                 // 1.13–1.14 hold: the line, the stones
    [A.b21c + .4, { x: 5.0, y: 1.5, z: 12.0, yaw: -.1, pitch: -.2, f: 1600 }],                // 1.15 down to the B desk
    [A.b22, { x: 4.98, y: 1.51, z: 12.1, yaw: -.1, pitch: -.2, f: 1620 }],                   //      hold: the lamp
    [A.b22 + 1.7, { x: 4.9, y: 1.7, z: 11.0, yaw: .3, pitch: -.12, f: 1250 }],                // 1.16 pull back: both machines
    [A.b23 + 1.6, { x: 4.88, y: 1.69, z: 11.1, yaw: .29, pitch: -.13, f: 1260 }],            //      hold
  ];
  // the push into the sheet: one eased curve over the desk front down onto the paper, the view locked on the sheet, landing at rest on the plate
  const P0 = CAM[CAM.length - 1], P1 = { x: SHEET[0] - .04, y: SHEET[1] + .075, z: SHEET[2] - .01, yaw: -.31, pitch: -1.5, f: 1500 };
  const PC = { x: SHEET[0] + .35, y: 1.45, z: SHEET[2] - .9 };
  const look = (x, y, z) => ({ yaw: Math.atan2(SHEET[0] - x, SHEET[2] - z), pitch: -Math.atan2(y - SHEET[1], Math.hypot(SHEET[0] - x, SHEET[2] - z)) });
  function push(t) {
    const u = sm(lin(P0[0], A.end, t)), a = P0[1], q = (k) => (1 - u) * (1 - u) * a[k] + 2 * u * (1 - u) * PC[k] + u * u * P1[k];
    const x = q('x'), y = q('y'), z = q('z'), L = look(x, y, z), w = sm(lin(0, .45, u)), k = sm(lin(.7, 1, u));
    return { x, y, z, yaw: mix(mix(a.yaw, L.yaw, w), P1.yaw, k), pitch: mix(mix(a.pitch, L.pitch, w), P1.pitch, k), f: mix(a.f, P1.f, u) };
  }
  const cam = (t) => (t > P0[0] ? push(t) : K.camEase(t, CAM));

  // ---------------------------------------------------------------- you and the machine: the state of the take
  const P = A.s2 / 2;   // curl period of the hook: the dumbbell is up at t = 0 (the thumbnail) and again at "Or"
  const cycle = (t, t0, per = 2.9) => .5 + .5 * Math.cos(Math.PI * 2 * (t - t0) / per);
  const tk = A.s2, tb = A.s14;   // take-over / hand-back
  function gym(t) {
    const st = { curl: 0, arm: .85, armOut: 0, forkOut: 0, lift: 10, onFork: 1, glow: .2, refl: .85 };
    if (t < tk) { st.curl = cycle(t, 0, P); st.arm = mix(1, 1.18, sm(lin(A.s1, A.s1e, t))); st.armOut = 1; st.lift = -8; st.onFork = 0; st.glow = .5 + .4 * st.curl; }
    else if (t < tb) {
      st.curl = 1 - eio(lin(tk + 1.7, tk + 2.7, t));
      st.armOut = 1 - eio(lin(tk, tk + .8, t));
      st.forkOut = eio(lin(tk + .5, tk + 1.2, t));
      st.lift = t < tk + 1.2 ? -8 : mix(-8, 10, eio(lin(tk + 1.2, tk + 1.9, t)));
      st.onFork = st.lift >= 0 ? 1 : 0;
      st.glow = mix(.9, .2, sm(lin(tk + 1.5, tk + 2.6, t)));
      st.arm = mix(1.18, .85, sm(lin(tk + 1.8, tk + 3.6, t)));
    } else {
      // curl with the trainer through "the best teacher", rest (dumbbell down, hand on your back) while the Go clue plays, curl again in 00b
      const c0 = tb + 2.6, cEnd = A.s15 + .2, c1 = A.b22 + .3;
      st.curl = t < c0 ? eio(lin(tb, tb + 1, t)) : t < c1 ? cycle(t, c0) * (1 - sm(lin(cEnd, cEnd + .9, t))) : .5 - .5 * Math.cos(Math.PI * 2 * (t - c1) / 2.9);
      st.lift = mix(10, 0, eio(lin(tb + .5, tb + 1.1, t))) - 8 * eio(lin(tb + 1.15, tb + 1.9, t));
      st.onFork = t < tb + 1.1 ? 1 : 0;
      st.forkOut = 1 - eio(lin(tb + 1.2, tb + 1.9, t));
      st.armOut = eio(lin(tb + 1.7, tb + 2.6, t));
      st.glow = t < tb + 1.1 ? .2 : mix(.2, .5 + .4 * st.curl, sm(lin(tb + 2.3, tb + 3.6, t)));
      st.arm = mix(.85, .95, sm(lin(tb + 2.6, A.end, t)));
    }
    st.refl = t < A.s13n ? st.arm : mix(Math.max(st.arm, .85), 1.35, eio(lin(A.s13n + .1, A.s13n + 1.8, t)));
    return st;
  }
  // draws you + the machine (+ the dumbbell) at their places, or their reflection in the mirror (mir)
  function drawGym(ctx, t, V, st, mir) {
    const pY = mir ? K.mirrorPt(K.YOU) : K.YOU, pM = mir ? K.mirrorPt(K.MACHINE) : K.MACHINE;
    const Y = K.sprite(V, pY), M = K.sprite(V, pM); if (!Y.vis || !M.vis) return;
    const sg = mir ? -1 : 1, km = M.k / 100;
    const toL = (p) => [sg * (p[0] - M.x) / km, (p[1] - M.y) / km], toS = (p) => [M.x + sg * p[0] * km, M.y + p[1] * km];
    const hipY = Y.y - 88 * Y.s;
    const topS = [Y.x + sg * TOP[0] * Y.s, hipY + TOP[1] * Y.s], topL = toL(topS);
    const fy = topL[1] + DR + 3 - st.lift, fork = clamp((-fy - 16) / 134);
    if (!mir) { K.floorShadow(ctx, V, K.MACHINE, .6, .3, .26); K.floorShadow(ctx, V, K.YOU, .4, .28, .3); }
    // the machine stands just behind you (deeper): it is drawn first, its hand of light rests on your upper back, its forks pass behind you
    const reach = toL([Y.x - sg * 24 * Y.s, hipY - 46 * Y.s]);
    ctx.save(); ctx.translate(M.x, M.y); ctx.scale(sg * km, km);
    const mo = K.machine(ctx, t, { reach, armOut: st.armOut, fork, forkOut: st.forkOut, core: 1, noHand: true });
    ctx.restore();
    const hnd = K.athlete(ctx, Y.x, hipY, Y.s, { ...K.curl(st.curl), bulk: mir ? 1 + (st.refl - st.arm) * .3 : 1 }, { t, arm: mir ? st.refl : st.arm, flip: mir, seed: 11 });
    // the hand of light on top of you (it rests on your back: light, so it reads in front of the shirt)
    const hp = toS(mo.hand); K.lightHand(ctx, t, hp[0], hp[1], mir ? Math.PI - mo.handAng : mo.handAng, { ...mo.handO, s: mo.handO.s * km });
    const h = st.onFork ? toS([topL[0], -mix(16, 150, fork) - 3 - DR]) : hnd.hand(0);
    K.dumbbell(ctx, t, h[0], h[1], { r: DR * km, glow: st.glow });
  }

  // ---------------------------------------------------------------- the exam (desks, lamps, board)
  const lampOf = (d) => {
    if (d.g === 'C') return 0;
    const t0 = A.s4m + .05 + d.row * .14 + d.col * .06 + (d.g === 'B' ? .3 : 0);
    return (t) => {
      let L = eout(lin(t0, t0 + .45, t)) * (1 - eio(lin(A.s7w + .05, A.s7w + .4, t)));
      if (d === B) L = Math.max(L, eout(lin(A.b21c, A.b21c + .5, t)));
      return L;
    };
  };
  const LAMP = new Map(K.EXAM.desks.map((d) => [d, lampOf(d)]));
  const dotOf = (d) => (t) => eout(lin(A.s4d + .1 + d.row * .08 + d.col * .04, A.s4d + .5 + d.row * .08 + d.col * .04, t));
  const DOT = new Map(K.EXAM.desks.filter((d) => d.g === 'B').map((d) => [d, dotOf(d)]));

  const U = 85;   // board units per 1.0 (the result of group C)
  function board(ctx, Bd, t) {
    K.chalkText(ctx, 'Turkey  ·  almost 1,000 students  ·  math', 40, 58, { size: 34, u: lin(A.s3 + .3, A.s3e - .2, t) });
    const base = 296, xs = { p: [110, 190, 270], e: [500, 580, 660] }, w = 56;
    const cols = ['#efe9da', COOL, COOL];
    // practice
    if (t > A.s6) {
      K.chalkText(ctx, 'practice', 218, 352, { size: 26, align: 'center', u: lin(A.s6 + 1.6, A.s6 + 2.2, t) });
      K.chalkLine(ctx, [[80, base], [356, base]], { u: lin(A.s6 + 1.4, A.s6 + 1.9, t), lw: 2.4 });
      K.chalkBar(ctx, xs.p[0], base, w, U * 1, { u: eout(lin(A.s6 + 1.9, A.s6 + 2.5, t)), col: cols[0], seed: 1 });
      K.chalkBar(ctx, xs.p[1], base, w, U * 1.48, { u: eout(lin(A.s6f, A.s6f + .55, t)), col: cols[1], seed: 2 });
      K.chalkBar(ctx, xs.p[2], base, w, U * 2.27, { u: eout(lin(A.s6f + .15, A.s6f + .75, t)), col: cols[2], seed: 3 });
      K.chalkText(ctx, '+48 %', xs.p[1] + w / 2, base - U * 1.48 - 12, { size: 22, align: 'center', u: lin(A.s6f + .6, A.s6f + 1.0, t), col: COOL });
      K.chalkText(ctx, '+127 %', xs.p[2] + w / 2, base - U * 2.27 - 12, { size: 22, align: 'center', u: lin(A.s6f + .8, A.s6f + 1.2, t), col: COOL });
      for (const [i, s] of [[0, 'none'], [1, 'machine'], [2, 'machine']]) K.chalkText(ctx, s, xs.p[i] + w / 2, base + 24, { size: 17, align: 'center', u: lin(A.s6 + 1.8 + i * .1, A.s6 + 2.3 + i * .1, t), a: .75 });
      dotB(ctx, xs.p[2] + w / 2 + 34, base + 18, lin(A.s6 + 2.3, A.s6 + 2.5, t));
    }
    // exam
    if (t > A.s7) {
      K.chalkText(ctx, 'exam', 608, 352, { size: 26, align: 'center', u: lin(A.s7 + .1, A.s7 + .6, t) });
      K.chalkLine(ctx, [[470, base], [746, base]], { u: lin(A.s7, A.s7 + .5, t), lw: 2.4 });
      K.chalkBar(ctx, xs.e[0], base, w, U, { u: eout(lin(A.s8, A.s8 + .6, t)), col: cols[0], seed: 4 });
      K.chalkLine(ctx, [[xs.e[0] - 14, base - U], [xs.e[2] + w + 18, base - U]], { u: lin(A.s8 + .5, A.s8 + 1.2, t), dash: [10, 9], lw: 2, a: .7 });
      K.chalkBar(ctx, xs.e[1], base, w, U * .83, { u: eout(lin(A.s8 + 1.3, A.s8 + 1.9, t)), col: cols[1], seed: 5 });
      K.chalkText(ctx, '−17 %', xs.e[1] + w / 2, base - U * .83 + 26, { size: 22, align: 'center', u: lin(A.s8 + 1.9, A.s8 + 2.3, t), col: COOL });
      K.chalkBar(ctx, xs.e[2], base, w, U, { u: eout(lin(A.s9 + .2, A.s9 + .8, t)), col: cols[2], seed: 6 });
      for (const [i, s] of [[0, 'none'], [1, 'machine'], [2, 'machine']]) K.chalkText(ctx, s, xs.e[i] + w / 2, base + 24, { size: 17, align: 'center', u: lin(A.s7 + .3 + i * .1, A.s7 + .8 + i * .1, t), a: .75 });
      dotB(ctx, xs.e[2] + w / 2 + 34, base + 18, lin(A.s7 + 1, A.s7 + 1.2, t));
    }
  }
  // the warm dot of group B (chalked in effort colour): the small difference, never explained here
  function dotB(ctx, x, y, u) { if (u <= 0) return; ctx.fillStyle = rgba(K.PAL.effort, .9); ctx.beginPath(); ctx.arc(x, y, 5 * eout(u), 0, Math.PI * 2); ctx.fill(); }

  // ---------------------------------------------------------------- the Go grid: a quiet game, the line of 66 years, the stones
  const GAME = [[3, 15, 'b'], [4, 14, 'w'], [3, 13, 'w'], [5, 15, 'b'], [2, 14, 'b'], [15, 15, 'w'], [14, 16, 'b'], [16, 14, 'b'], [15, 3, 'w'], [16, 4, 'b'], [4, 3, 'b']];
  const pt = (i, j) => { const p = K.goPt(i, j); return [p[0], p[2]]; };
  const FLAT = [pt(1, 6), pt(11, 6)], BEND = [pt(11, 6), pt(12.4, 6.6), pt(13.4, 8.4), pt(14.2, 11.5), pt(14.8, 15.5), pt(15.2, 19.2)];
  function go(ctx, V, G, t) {
    for (const [i, j, c] of GAME) K.goStone(ctx, V, i, j, { col: c === 'b' ? 'black' : 'white' });
    K.floorLine(ctx, V, FLAT, { u: eio(lin(A.s16 + 1.0, A.s16e + .2, t)), w: .55 });
    K.floorLine(ctx, V, BEND, { u: eio(lin(A.s18 + .1, A.s18 + 2.4, t)), w: .55 });
    // the machine's stone (white) drops on "beat"; a human's black stone lands on the rising line on "humans got better", it glows at "Keep that in mind"
    const d1 = lin(A.s17b - .05, A.s17b + .35, t); if (d1 > 0) K.goStone(ctx, V, 11, 7, { col: 'white', lift: 1.3 * (1 - ein(d1)) });
    const d2 = lin(A.s18h + .3, A.s18h + .65, t); if (d2 > 0) K.goStone(ctx, V, 13, 9, { col: 'black', lift: 1.0 * (1 - ein(d2)), glow: sm(lin(A.s19, A.s19 + .9, t)) });
  }
  function goTags(ctx, V, t) {
    const lab = (s, p, u) => { const q = V.P([p[0], .01, p[1]]); if (q.z > .3) K.tag(ctx, s, q.x - 30, q.y - 26, { u, size: 16 }); };
    const vis = 1 - lin(A.s19e + .3, A.s19e + .7, t);   // masked away before the camera leaves
    if (vis > 0 && t > A.s16) { lab('1950', FLAT[0], Math.min(vis, lin(A.s16 + 1.0, A.s16 + 1.5, t))); lab('2016', pt(11, 5.4), Math.min(vis, lin(A.s17b + .3, A.s17b + .8, t))); }
  }

  // the printed questions on B's sheet (its far half, toward +x): the camera lands on the blank half, which is the paper plate
  const SA = .12, SW = .105, SL = .15;
  const onSheet = (u, v) => [SHEET[0] + u * Math.cos(SA) - v * Math.sin(SA), SHEET[1] + .0005, SHEET[2] + u * Math.sin(SA) + v * Math.cos(SA)];
  function sheetPrint(ctx, V) {
    ctx.fillStyle = rgba(K.PAL.inkSoft, .38);
    const L = [[.088, .2], [.078, .17], [.068, .21], [.058, .09], [.046, .19], [.036, .14]], r = (k) => ((Math.sin(k * 12.9898) * 43758.5453) % 1 + 1) % 1;
    L.forEach(([u, len], i) => {   // a line of printed words: short dark dashes with gaps
      let v = -.115; const end = -.115 + len;
      for (let k = 0; v < end; k++) { const w = Math.min(end, v + .012 + .03 * r(i * 31 + k)); if (V.poly(ctx, [onSheet(u - .0022, v), onSheet(u + .0022, v), onSheet(u + .0022, w), onSheet(u - .0022, w)])) ctx.fill(); v = w + .006; }
    });
  }

  // ---------------------------------------------------------------- the frame
  const titleOn = (t) => 1 - eio(lin(A.s2 - .15, A.s2 + .35, t));
  function draw(ctx, t) {
    const V = K.view3(cam(t)), st = gym(t);
    K.hall(ctx, t, V, {
      board: (c, Bd) => board(c, Bd, t),
      mirror: (c, VV) => drawGym(c, t, VV, st, true),
      go: (c, VV, G) => go(c, VV, G, t),
    });
    K.examHall(ctx, t, V, {
      lampOf: (d) => (LAMP.get(d) ? LAMP.get(d)(t) : 0), dotOf: (d) => (DOT.get(d) ? DOT.get(d)(t) : 0),
      live: [B], sheetOf: (d) => (d === B ? (c) => { plate(c, t, 'paper', { tone: 'exam' }); sheetPrint(c, V); } : null),
    });
    drawGym(ctx, t, V, st, false);
    goTags(ctx, V, t);
    // screen layer: title (hook), the source tag (Turkey)
    const tu = titleOn(t);
    if (tu > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 90 + 760 * tu, 340); ctx.clip();
      ctx.font = '86px "Instrument Serif"'; ctx.fillStyle = '#3a2a22'; ctx.fillText('How Superintelligence', 88, 164); ctx.fillText('Will Make You Smarter', 88, 258);
      ctx.restore();
    }
    const su = Math.min(lin(A.s3 + .5, A.s3 + 1.1, t), 1 - lin(A.s10, A.s10 + .4, t));
    if (su > 0) K.tag(ctx, 'FIELD EXPERIMENT  ·  TURKEY  ·  BASTANI ET AL., PNAS 2025', 72, 96, { u: su });
  }

  return [{
    t: 0, tr: 'cut', d: .1, draw, print: PRINT,
    // sound hooks (BRIEF-builders §8): f = sfx-bibliothek/akzent/<f>.mp3; 'stone_click' is new (a Go stone set on wood). Ambience: atmo/hall.
    sound: [
      { f: 'brass_click', t: A.s2 + 1.45, v: .5 }, { f: 'chime', t: A.s4m + .1, v: .35 }, { f: 'chalk', t: A.s6f, v: .4 },
      { f: 'powerdown', t: A.s7w + .05, v: .3 }, { f: 'brass_click', t: A.s14 + 1.1, v: .45 }, { f: 'stone_click', t: A.s17b + .35, v: .55 },
      { f: 'stone_click', t: A.s18h + .65, v: .4 }, { f: 'paper_slide', t: A.end - .5, v: .35 },
    ],
  }];
};
