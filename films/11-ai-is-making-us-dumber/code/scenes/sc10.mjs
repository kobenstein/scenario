// c10 · Who has to help, and the answer (09b + 09c + end), in: paper (scroll) → film end. Builder: c07/c08/c10.
// One hall (c01–c09: same light, same props), the city outside its windows (lib/f11_c07_city.mjs). Three clean hard cuts in speech pauses (lead, for calm): before "Remember Harvard", "Pilots", "Go back".
//
//  shot   anchor (09b / 09c)                       image                                                       the one movement
//  10.01  "The worry was real … think for us."     pull out of Plato's papyrus (the lectern, 3.9/17.4); turn west:   pull out; the books rise
//                                                  the window wall fills with books, shelf after shelf
//  10.02  "But you can't set up every machine…"    glide over the exam desks to window 1 and through its middle pane the glide, then the push (zoom)
//                                                  across the lane: a lit window, a child at a desk under a lamp
//  10.03  "The big makers already offer…"          the desk machine holds the child's notebook up on its forks       held (slow push)
//                                                  (it does the homework); the brass switch LEARN stands off
//  10.04  "A tutor for every child … tomorrow."    ★ on "That's a setting." the lever flips: the forks set the       the flip, then the spread
//                                                  notebook down and fold, the child leans in, the hand of light
//                                                  guides; the camera widens: window after window changes the same way
//  10.05  "Schools can choose … guardrails."       back into the hall: group B inside its brass guardrail, behind it  the turn, then along
//                                                  the Harvard steps (the student on the top step, the tutor's hand)
//  10.06  "And where a lot is at stake … way."     the simulator by window 4: a pilot flies by hand (brass yoke);     camera along
//                                                  then a doctor reads an endoscopy image on a light box herself (her
//                                                  desk machine dark beside her)
//  10.07  "Go back to the gym."                    the camera returns to your place at the mirror                    the move
//  10.08  "The machine is standing next to you…"   its hand leaves your back, the forks swing out under your weight   the forks
//  10.09  "Or it can put one hand on your back…"   ★ the forks fold, the hand of light rests on your back, you lift  the shape change
//  10.10  "Superintelligence won't decide…"         you curl; your reflection curls with you (it matches you again)   the curl
//  10.11  "So the next time you ask it…"           the camera pulls back slowly, up and round to the mirror wall     pull back
//  10.12  END IMAGE (641.5–663.3, ~22 s)           the bright hall from above the floor: you and the machine small   breath, dust, glow; a slow drift
//                                                  in the centre at the mirror, the left and right thirds calm (wood,
//                                                  mirror, plaster) for the end cards; no text
// New places (c10): book shelves along the window wall (tall between the windows, low under them); the simulator at (−8.75, 27.5) by
// window 4; the light box at (−9.0, 1.45, 31.0) on the pier between windows 4 and 5. From c05: the exam desks, group B's rail, the
// Harvard steps (x 8.2–9.55, z 27.4) + the class benches. From c09: the lectern, the rolling board (5.9, 18.2) with Plato's card, the
// dumbbell stand, the crates set aside. Ruhe: lib camSmooth keys (monotone, soft), one moving thing at a time. Print { riso: .25 }.
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, canvas } from '../engine.mjs';
import * as Wd from '../lib/f11_c02_world.mjs';
import * as K from '../lib/f11_kit.mjs';
import * as X from '../lib/f11_c05_kit.mjs';
import * as C from '../lib/f11_c07_city.mjs';
import * as P from '../lib/f11_c10_props.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';

const PRINT = { riso: .25 };
const DR = 11;

export default async (T, R) => {
  const { in: HI } = handsOf('c10', T);
  await K.studentsPrepare();
  const S = (p, n) => T.S('09b', p, n), Sc = (p, n) => T.S('09c', p, n), Ec = (p, n) => T.E('09c', p, n);
  const A = {
    w1: S('The worry'), w2: S('And writing'), w3: S('Because we'), c1: S('But you'), c2: S('What about'), m1: S('The big'), m2: S('But they'),
    t1: S('A tutor'), t1f: S('or a forklift'), t2: S("That's a"), t3: S('And these'), s1: S('Schools'), s2: S('Remember Harvard'), s3: S('And remember'),
    s4: S('It was a'), p0: S('And where'), p1: S('Pilots'), p2: S('Doctors'), g0: S('Go back'),
    g1: Sc('The machine'), g2: Sc('It could'), g3: Sc('Or it can'), g3l: Sc('and let you'), g4: Sc('Superintelligence'), g5: Sc('You will'), g6: Sc('One question'),
    g7: Sc('So the next'), g8: Sc('Or is it'), vend: Ec('for me'),
    start: HI.b, end: R.b,
  };
  const FLIP = A.t2 + .1;   // the lever flips on "That's a setting."

  // ---------------------------------------------------------------- places
  const LEC = [3.9, 0, 17.4], RB = [5.9, 0, 18.2], RBX0 = RB[0] - X.RB_W / 2, RBY1 = X.RB_Y0 + X.RB_H;
  const STAND = { x0: 9.27, x1: 9.57, z0: 14.85, z1: 15.15, h: .78 };
  const CR = { x0: 6.7, z0: 16.98, w: .45, d: .45, h: .36, n: 3, bat: .2 };
  const BX = K.EXAM.at('B', 1, 2);   // made room for the lectern (c09)
  const STEPS = [0, 1, 2].map((i) => ({ x0: 8.2 + .45 * i, x1: 8.65 + .45 * i, z0: 27.1, z1: 27.7, h: .3 * (i + 1) }));
  const STU = [(STEPS[2].x0 + STEPS[2].x1) / 2 - .04, STEPS[2].h, 27.4], MT = [7.0, 0, 27.85];
  const BENCH = [[2.5, 26.6], [2.5, 28.3]];
  const CLASS = [[1.55, 26.6, 2], [2.45, 26.6, 7], [3.35, 26.6, 4], [1.55, 28.3, 9], [2.45, 28.3, 1], [3.35, 28.3, 10]];
  const SIM = [-8.75, 0, 27.5];
  const LB = { c: [-9.05, 1.45, 31.0], n: [.62, -.78] };
  const DOCP = [-8.3, 0, 31.3];

  // the child's window across the lane (left bank, the house front facing the hall), seen through hall window 1's middle pane
  const HW = K.WINDOWS[1], PANE = { y: HW.y0 + 1.5 * (HW.y1 - HW.y0) / 4, z: HW.z };
  const cand = [];
  for (const h of C.PLAN.left) if (Math.abs(h.x1 + 22) < .05 && h.kind === 'house') for (const w of h.wins) if (w.face === 1 && w.i === 1 && !w.door && !w.round) cand.push(w);
  cand.sort((a, b) => Math.abs(a.h.z0 + a.u - HW.z) - Math.abs(b.h.z0 + b.u - HW.z));
  const HERO = cand[0];
  const heroPt = (u, v) => C.facePt(HERO.h, 1, HERO.u - HERO.w / 2 + u, HERO.y0 + v, .05);
  const TG = heroPt(.62, .32);                                  // the desk, the machine, the switch
  const GL = [K.HALL.x0 + .005, PANE.y, PANE.z];
  const dir = [GL[0] - TG[0], GL[1] - TG[1], GL[2] - TG[2]], dl = Math.hypot(...dir);
  const CW = [GL[0] + dir[0] / dl * .45, GL[1] + dir[1] / dl * .45, GL[2] + dir[2] / dl * .45];   // the camera at the pane
  const DH = Math.hypot(CW[0] - TG[0], CW[1] - TG[1], CW[2] - TG[2]);
  const FAC = [-22, 5.0, HERO.h.z0 + HERO.u + 2.0];          // the facade (wider view)
  // the spread: every desk window on that side of the lane changes after the hero, in order of distance
  const DESKW = new Map();
  for (const h of C.PLAN.left) {
    if (Math.abs(h.x1 + 22) > .05 || h.cz > 60) continue;
    for (const w of h.wins) {
      if (w.face !== 1 || w.door || w.round) continue;
      const p = C.facePt(h, 1, w.u, (w.y0 + w.y1) / 2), hp = heroPt(HERO.w / 2, .7), d = Math.hypot(p[1] - hp[1], p[2] - hp[2]);
      DESKW.set(w, { t0: w === HERO ? FLIP : FLIP + .55 + d / 5.5 + w.seed * .3, lever: w === HERO });
    }
  }

  // ---------------------------------------------------------------- the camera (three settled cuts, otherwise one take)
  const look = (p, L, f) => C.lookAt(p, L, f);
  const SC0 = [LEC[0], mix(1.02, 1.26, .5) + .006, LEC[2]], N = [0, .901, -.433];
  const P1 = { x: SC0[0], y: SC0[1] + N[1] * .27, z: SC0[2] + N[2] * .27, yaw: 0, pitch: -Math.atan2(.901, .433), f: 1600 };   // = c09's last camera
  const atW = (f, L = TG) => look(CW, L, f);
  const E0 = look([2.4, 2.0, 4.6], [9.0, 1.15, 15.2], 1500), E1 = look([2.15, 2.02, 4.3], [9.0, 1.15, 15.2], 1490);
  // calm: three clean hard cuts (lead's decision) in the speech pauses before "Remember Harvard", "Pilots" and "Go back", each landing on a
  // settled framing that only drifts; the moves that tell the story stay (papyrus → shelves → the pane, the lever, the windows).
  // Between the cuts: holds with a slow drift, and turns kept small (the next subject near the current eye line).
  const CUT = [A.s2 - .14, A.p1 - .14, A.g0 - .14];
  const SEGS = [
    [
      [A.start, P1],
      [A.w1 + .6, { ...P1, y: P1.y + .03, z: P1.z - .02 }],                              // 10.01 the papyrus, held (Plato's worry)
      [A.w3 + 3.0, look([3.5, 3.4, 8.0], [-11, 1.9, 16.5], 1450)],                        //       one turn to the wall: the shelves fill
      [A.m1 - .3, atW(1500)],                                                             // 10.02 one move to the pane of window 1
      [A.m1 + 2.2, atW(DH * 1250)],                                                        //       the push (zoom) to the desk
      [A.t1, atW(DH * 1350, heroPt(.74, .3))],                                              // 10.03 held, the switch
      [FLIP - .1, atW(DH * 1200, heroPt(.64, .34))],                                        // 10.04 the flip
      [FLIP + 1.1, atW(DH * 1080, heroPt(.56, .4))],
      [A.s1 - .3, atW(1150, FAC)],                                                        //       window after window
      [A.s1 + 1.4, look([-10.0, 3.5, 9.6], FAC, 1250)],                                  // 10.05 back from the glass, held
      [CUT[0], look([-9.92, 3.49, 9.62], FAC, 1256)],
    ], [
      [CUT[0], look([4.0, 2.55, 6.0], [2.5, .95, 22.4], 1500)],                          // cut 1 → the hall: group B, the rail, the steps
      [CUT[1], look([3.75, 2.52, 6.7], [2.4, .95, 22.4], 1518)],
    ], [
      [CUT[1], look([-4.6, 1.95, 22.0], [-9.3, 1.15, 27.6], 1400)],                      // cut 2 → the pilot (the doctor beside him)
      [A.p2 - 2.2, look([-4.58, 1.95, 22.1], [-9.25, 1.18, 28.0], 1404)],
      [A.p2 + 1.3, look([-4.5, 1.95, 22.6], [-9.05, 1.32, 29.4], 1420)],                    //       an easy pan to the doctor
      [CUT[2], look([-4.48, 1.95, 22.7], [-9.05, 1.32, 29.5], 1424)],
    ], [
      [CUT[2], look([6.6, 1.75, 10.4], [9.0, 1.15, 15.6], 1600)],                         // cut 3 → the gym (10.07)
      [A.g4 - .2, look([6.75, 1.72, 10.7], [9.0, 1.15, 15.6], 1640)],                     // 10.08–10.09
      [A.g5 + .2, look([6.3, 1.95, 10.2], [9.6, 1.3, 16.4], 1600)],                       // 10.10 you and your reflection
      [A.g7, look([6.25, 1.97, 10.1], [9.6, 1.3, 16.4], 1600)],
      [A.vend + .3, E0],                                                                  // 10.11 pull back → 10.12
      [A.end, E1],
    ],
  ];
  const drift = (t) => .03 * sm(lin(A.start + 2, A.start + 5, t)) * (1 - sm(lin(A.m1 - 2, A.m1 - .5, t)) * (1 - sm(lin(A.s1 + 1, A.s1 + 2.5, t))));
  function cam(t) {
    const k = CUT.filter((c) => t >= c).length, c = C.camSmooth(t, SEGS[k]), a = drift(t);
    if (a > 0) { c.x += a * Math.sin(t * .23 + 1.1); c.y += a * .6 * Math.sin(t * .17 + 2.3); c.z += a * Math.sin(t * .19 + .4); }
    return c;
  }
  const glassD = (c) => Math.max(0, c.x - K.HALL.x0);

  // ---------------------------------------------------------------- the city outside the windows (drawn once per frame, shown in each)
  const [scrF, sgF] = canvas(W, H), [scrH, sgH] = canvas(W / 2, H / 2); let scrT = null, scr = scrF, sg = sgF;
  function winC10(w, h, t) {
    const d = DESKW.get(w);
    if (d) return { glow: 1, fig: null };
    if (w.big) return { glow: .9, fig: null };
    return { glow: w.seed < .55 ? .75 : .2, fig: null };
  }
  function interiorC10(ctx, V, w, h, t, info) {
    const d = DESKW.get(w); if (!d || info.px < 36) return false;
    const Q = C.winQuad(V, w); if (Q.some((q) => !(q.z > .1)) || Q.every((q) => q.x < 0) || Q.every((q) => q.x > W) || Q.every((q) => q.y < 0) || Q.every((q) => q.y > H)) return false;
    return P.deskWindow(ctx, t, V, w, { t0: d.t0, lever: d.lever, kid: 1 });
  }
  function winBox(V) {   // the screen boxes of the hall's windows (null: none in view)
    const boxes = [];
    for (const w of K.WINDOWS) {
      const ps = [[w.z - 1.35, w.y0], [w.z + 1.35, w.y0], [w.z - 1.35, w.y1 + w.r], [w.z + 1.35, w.y1 + w.r]].map(([z, y]) => V.P([K.HALL.x0, y, z]));
      if (ps.every((p) => !(p.z > .06))) continue;
      if (ps.some((p) => !(p.z > .06))) return [[0, 0, W, H]];
      const b = [Math.max(0, Math.min(...ps.map((p) => p.x))), Math.max(0, Math.min(...ps.map((p) => p.y))), Math.min(W, Math.max(...ps.map((p) => p.x))), Math.min(H, Math.max(...ps.map((p) => p.y)))];
      if (b[2] > b[0] && b[3] > b[1]) boxes.push(b);
    }
    return boxes.length ? boxes : null;
  }
  function outside(ctx, V, w, t) {
    if (scrT !== t) {
      // from inside the hall (the street pale behind the veil) half resolution is plenty; at the glass the full one
      const half = glassD(V.cam) > 1.2; scr = half ? scrH : scrF; sg = half ? sgH : sgF;
      scrT = t; sg.setTransform(1, 0, 0, 1, 0, 0); sg.clearRect(0, 0, W, H); if (half) sg.setTransform(.5, 0, 0, .5, 0, 0);
      const B = winBox(V);
      if (B) {
        C.cityFrame(sg, t, V, { dusk: .45, noHall: true, skipSky: true, clipBoxes: B, win: winC10, interior: interiorC10, noCross: (ww) => ww === HERO });
        // the bright room's eyes: the street looks pale from inside the hall, clear at the glass
        const vl = .34 * sm(lin(.7, 3.2, glassD(V.cam)));
        if (vl > .005) { sg.fillStyle = rgba('#fff4e2', vl); for (const b of B) sg.fillRect(b[0], b[1], b[2] - b[0], b[3] - b[1]); }
      }
    }
    ctx.drawImage(scr, 0, 0, W, H);
  }

  // ---------------------------------------------------------------- the books: the scroll unrolls into a library (a wave from the lectern)
  const bookGrow = (z, row, sd) => lin(0, .45, t_ - (A.w2 + .1 + Math.abs(z - LEC[2]) / 6.5 + row.y * .07 + sd * .25));
  let t_ = 0;

  // ---------------------------------------------------------------- the gym: you + the machine (c09's end: the hand on your back, slow curls)
  const gt = {
    off0: A.g1 + .2, off1: A.g1 + 1.2, fo0: A.g1 + 1.0, fo1: A.g2 + .4, fold0: A.g3 + .15, fold1: A.g3 + 1.1, back0: A.g3 + .8, back1: A.g3 + 1.9,
    lift0: A.g3l - .1, lift1: A.g3l + 1.3, rest0: A.vend - .6, rest1: A.vend + 1.6,
  };
  function gym(t) {
    const st = { armOut: 1, forkOut: 0, fork: 0, curl: .12, arm: 1.25, glow: .45 };
    // before: slow curls with the hand on your back (as c09 left you)
    const cyc = (t0, per) => .5 - .5 * Math.cos(Math.PI * 2 * (t - t0) / per);
    if (t < gt.off0) st.curl = mix(.12, 1, cyc(A.start - .4, 3.0) * .9);
    else if (t < gt.lift0) st.curl = mix(mix(.12, 1, cyc(A.start - .4, 3.0) * .9), .12, sm(lin(gt.off0 - .4, gt.off0 + .6, t)));
    else if (t < gt.lift1) st.curl = mix(.12, 1, eio(lin(gt.lift0, gt.lift1, t)));
    else if (t < gt.rest0) st.curl = mix(.12, 1, .5 + .5 * Math.cos(Math.PI * 2 * (t - gt.lift1) / 3.3));
    else { const c0 = mix(.12, 1, .5 + .5 * Math.cos(Math.PI * 2 * (gt.rest0 - gt.lift1) / 3.3)); st.curl = mix(c0, .12, eio(lin(gt.rest0, gt.rest1, t))); }
    // the machine: the hand leaves, the forks swing out under the weight, then fold; the hand rests on your back again
    st.armOut = 1 - eio(lin(gt.off0, gt.off1, t)) + eio(lin(gt.back0, gt.back1, t));
    st.forkOut = eio(lin(gt.fo0, gt.fo1, t)) * (1 - eio(lin(gt.fold0, gt.fold1, t)));
    st.under = eio(lin(gt.fo0 + .3, gt.fo1, t)) * (1 - eio(lin(gt.fold0, gt.fold0 + .6, t)));
    st.glow = .3 + .6 * clamp(st.curl) * (t > gt.lift0 ? 1 : .55);
    st.arm = 1.25 + .07 * sm(lin(gt.lift1, A.g7, t));
    return st;
  }
  const [, sg0] = canvas(400, 400);
  const TOP = (() => { const tp = K.athlete(sg0, 200, 200, 1, K.curl(.12), { t: 0, arm: 1.25 }).hand(0); return [tp[0] - 200, tp[1] - 200]; })();
  function drawGym(ctx, t, V, mir) {
    const st = gym(t);
    const mp = (p) => (mir ? K.mirrorPt(p) : p);
    const Y = K.sprite(V, mp(K.YOU)), M = K.sprite(V, mp(K.MACHINE)); if (!Y.vis || !M.vis) return;
    const sgn = mir ? -1 : 1, km = M.k / 100;
    const toL = (p) => [sgn * (p[0] - M.x) / km, (p[1] - M.y) / km], toS = (p) => [M.x + sgn * p[0] * km, M.y + p[1] * km];
    const hipY = Y.y - 88 * Y.s;
    if (!mir) { K.floorShadow(ctx, V, K.MACHINE, .6, .3, .26); K.floorShadow(ctx, V, K.YOU, .4, .28, .3); }
    const backPt = [Y.x - sgn * 24 * Y.s, hipY - 46 * Y.s];
    // the forks: up under your dumbbell (at rest in your hand) while they are out
    const topS = [Y.x + sgn * TOP[0] * Y.s, hipY + TOP[1] * Y.s], topL = toL(topS);
    const fyw = topL[1] + DR + 3, forkUnder = clamp((-fyw - 16) / 134);
    ctx.save(); ctx.translate(M.x, M.y); ctx.scale(sgn * km, km);
    const mo = X.machine2(ctx, t, { reach: toL(backPt), armOut: st.armOut, fork: forkUnder * st.under, forkOut: st.forkOut, core: 1, noHand: true, ringPh: t * .35 });
    ctx.restore();
    const sx = mir ? [2 * K.MIRROR.x - STAND.x1, 2 * K.MIRROR.x - STAND.x0] : [STAND.x0, STAND.x1];
    X.box3(ctx, V, sx[0], sx[1], STAND.z0, STAND.z1, STAND.h, { top: '#c99a66', front: '#a87444', side: '#94643c' });
    if (!X.personAt(V, mp(K.YOU))) return;   // off screen or under the camera: a figure that size would cost seconds
    const hnd = K.athlete(ctx, Y.x, hipY, Y.s, K.curl(st.curl), { t, arm: st.arm, flip: mir, seed: 11 });
    if (st.armOut > .02) { const hp = toS(mo.hand); K.lightHand(ctx, t, hp[0], hp[1], mir ? Math.PI - mo.handAng : mo.handAng, { ...mo.handO, s: mo.handO.s * km }); }
    const h = hnd.hand(0);
    K.dumbbell(ctx, t, h[0], h[1], { r: DR * km, glow: st.glow });
  }

  // ---------------------------------------------------------------- props from c05 / c09
  function drawCrates(ctx, V) {
    const x0 = CR.x0, x1 = CR.x0 + CR.w, z0 = CR.z0, z1 = CR.z0 + CR.d;
    X.box3(ctx, V, x0, x1, z0 + .02, z0 + .1, CR.bat, { top: '#b98250', front: '#9a6a44', side: '#86583a' });
    X.box3(ctx, V, x0, x1, z1 - .1, z1 - .02, CR.bat, { top: '#b98250', front: '#9a6a44', side: '#86583a', noShadow: true });
    K.floorShadow(ctx, V, [(x0 + x1) / 2, 0, (z0 + z1) / 2], .4, .3, .25);
    const LABELS = ['boring parts', 'formatting', 'mental math'];
    for (let i = 0; i < CR.n; i++) X.box3(ctx, V, x0, x1, z0, z1, CR.h - .015, { y0: CR.bat + i * CR.h, slats: 3, top: '#d4a46c', front: '#bd8a56', side: '#a37346', noShadow: true, label: (c, w, hh) => K.chalkText(c, LABELS[i], w / 2, hh * .62, { size: 7.2, align: 'center', u: 1, a: .95 }) });
  }
  function rbContent(ctx) {
    K.chalkText(ctx, 'write this for me', 14, 36, { size: 15, u: 1 });
    K.chalkLine(ctx, [[10, 31], [128, 29.5]], { u: 1, lw: 2.2 });
    K.chalkText(ctx, 'why does this work?', 14, 72, { size: 15, u: 1, col: K.PAL.effortHot });
  }
  const CARD = { x0: RBX0 + 1.36, x1: RBX0 + 2.53, y1: RBY1 - .06, y0: RBY1 - 1.06, z: RB[2] };
  const cardText = (ctx, w, h) => X.quoteText(ctx, w, h, ['“this discovery of yours', 'will create forgetfulness', 'in the learners’ souls”'], 'PLATO  ·  PHAEDRUS  ·  TRANSL. JOWETT', { size: 10.6, x: 8, y: 20 });
  const GAME = [[3, 15, 'b'], [4, 14, 'w'], [3, 13, 'w'], [5, 15, 'b'], [2, 14, 'b'], [15, 15, 'w'], [14, 16, 'b'], [16, 14, 'b'], [15, 3, 'w'], [16, 4, 'b'], [4, 3, 'b'], [11, 7, 'w'], [13, 9, 'b'], [15, 11, 'b'], [13, 13, 'w'], [12, 11, 'w'], [14, 12, 'w'], [13, 12, 'b']];
  const pt = (i, j) => { const p = K.goPt(i, j); return [p[0], p[2]]; };
  const FLAT = [pt(1, 6), pt(11, 6)], BEND = [pt(11, 6), pt(12.4, 6.6), pt(13.4, 8.4), pt(14.2, 11.5), pt(14.8, 15.5), pt(15.2, 19.2)];
  function go(ctx, V) {
    K.floorLine(ctx, V, FLAT, { u: 1, w: .55, a: .8 }); K.floorLine(ctx, V, BEND, { u: 1, w: .55, a: .8 });
    for (const [i, j, cc] of GAME) { const q = K.goPt(i, j); if (V.toCam(q)[2] > 1 && V.toCam([q[0] + .5, 0, q[2]])[2] > 1 && V.toCam([q[0], 0, q[2] + .5])[2] > 1) K.goStone(ctx, V, i, j, { col: cc === 'b' ? 'black' : 'white' }); }
  }
  // Harvard: the student on the top step, the tutor's hand of light on her back; the class on the benches
  function drawSteps(ctx, t, V) {
    STEPS.forEach((s) => X.box3(ctx, V, s.x0, s.x1, s.z0, s.z1, s.h, { hand: true, top: '#dcae74', front: '#c08a56', side: '#a87444' }));
  }
  function drawTutor(ctx, t, V) {
    const Ms = K.sprite(V, MT), Ss = K.sprite(V, STU); if (!Ms.vis || !Ss.vis) return;
    const km = Ms.k / 100, hipY = Ss.y - 88 * Ss.s, back = [(Ss.x - 22 * Ss.s - Ms.x) / km, (hipY - 44 * Ss.s - Ms.y) / km];
    const mm = X.machineAt(ctx, t, V, MT, { noHand: true, forkOut: 0, reach: back.every(Number.isFinite) ? back : [60, -60], armOut: 1, seed: 7, ringPh: t * .35 });
    if (X.personAt(V, STU)) K.athlete(ctx, Ss.x, hipY, Ss.s, { sh: [.22, -.05], el: [.5, .4], head: -.05 + .03 * Math.sin(t * .9), hands: ['relaxed', 'relaxed'], hair: 'long' }, { t, seed: 51, dress: { coat: '#e2b04a', pants: '#2e3448', skin: K.PAL.skin[3], hair: '#5a3a24' }, arm: .95 });
    if (mm) X.handOf(ctx, t, mm, { open: 1 });
  }
  function drawBench(ctx, t, V, [bx, bz]) {
    const Bs = K.sprite(V, [bx, 0, bz]);
    if (Bs.vis) { ctx.save(); ctx.translate(Bs.x, Bs.y); ctx.scale(Bs.k / 100, Bs.k / 100); K.bench(ctx, { L: 270 }); ctx.restore(); }
    for (const [x, z, v] of CLASS.filter((q) => q[1] === bz)) K.student(ctx, V, [x, -.07, z], { v, pose: 'look' });
  }
  // the pilot: hands on the brass yoke, a slow bank (flying by hand); the autopilot (a small machine on the console) dark
  const bank = (t) => .12 * Math.sin((t - A.p1) * .55) * sm(lin(A.p0, A.p1, t)) + .04 * Math.sin(t * .31);
  function drawSim(ctx, t, V) {
    const sim = P.simulator(ctx, t, V, { p: SIM, bank });
    const Sm = K.sprite(V, [SIM[0] - 1.25, 1.02, SIM[2] + .4]);
    if (Sm.vis) { ctx.save(); ctx.translate(Sm.x, Sm.y); ctx.scale(Sm.k / 100, Sm.k / 100); K.deskMachine(ctx, t, { core: 0, seed: 3 }); ctx.restore(); }
    const Pp = K.sprite(V, [SIM[0], .02, SIM[2]]); if (!Pp.vis || !X.personAt(V, [SIM[0], .02, SIM[2]], true)) return;
    const flip = (V.toCam([SIM[0] - 1, 0, SIM[2]])[0] - V.toCam(SIM)[0]) < 0;
    const hipY = Pp.y - 46 * Pp.s, b = bank(t);
    const pose = { hip: [1.42, 1.5], kn: [1.25, 1.35], sh: [1.05 + b * .6, .98 - b * .6], el: [.35, .45], lean: .12, head: .05 + .02 * Math.sin(t * .7), hands: ['fist', 'fist'], hair: 'short' };
    const hn = K.athlete(ctx, Pp.x, hipY, Pp.s, pose, { t, seed: 61, dress: { coat: '#3d4a5e', pants: '#2e3448', shoes: '#2a221c', skin: K.PAL.skin[2], hair: '#2a1a14', sleeve: 'long' }, flip, rimW: Math.max(1, .7 * Pp.s) });
    // the yoke between the hands, its column to the console
    const h0 = hn.hand(0), h1 = hn.hand(1), hm = [(h0[0] + h1[0]) / 2, (h0[1] + h1[1]) / 2];
    const colS = V.P(sim.column); if (!(colS.z > .2)) return;
    const k = colS.k;
    ctx.lineCap = 'round'; ctx.strokeStyle = K.PAL.brassDark; ctx.lineWidth = Math.max(2, k * .045); ctx.beginPath(); ctx.moveTo(colS.x, colS.y); ctx.lineTo(hm[0], hm[1]); ctx.stroke();
    ctx.strokeStyle = K.PAL.brass; ctx.lineWidth = Math.max(1.4, k * .028); ctx.beginPath(); ctx.moveTo(colS.x, colS.y); ctx.lineTo(hm[0], hm[1]); ctx.stroke();
    ctx.save(); ctx.translate(hm[0], hm[1]); ctx.rotate(b * (flip ? -1 : 1));
    const r = k * .16; ctx.strokeStyle = K.PAL.brassDark; ctx.lineWidth = Math.max(2, k * .04); ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * .35, 0, 0, r); ctx.stroke();
    ctx.strokeStyle = K.PAL.brassLit; ctx.lineWidth = Math.max(1, k * .016); ctx.beginPath(); ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * .35, 0, 0, r); ctx.stroke();
    ctx.restore();
    // the hands on top of the yoke
    for (const hh of [h0, h1]) { ctx.fillStyle = K.PAL.skin[2]; ctx.beginPath(); ctx.arc(hh[0], hh[1], Math.max(1.5, k * .028), 0, Math.PI * 2); ctx.fill(); }
  }
  // the doctor at the light box: she rings what she found herself (the machine beside her stays dark)
  function drawDoc(ctx, t, V) {
    const u = sm(lin(A.p2 + .3, A.p2 + 1.6, t));
    const lb = P.lightbox(ctx, t, V, { ...LB, u });
    const D = K.sprite(V, DOCP); if (!D.vis || !X.personAt(V, DOCP) || !lb) return;
    const flip = lb.bump.x < D.x, hipY = D.y - 88 * D.s;
    const reach = sm(lin(A.p2 + .1, A.p2 + .5, t)) * (1 - sm(lin(A.g0 + 1.5, A.g0 + 2.5, t)));
    const pose = { sh: [mix(.15, 1.25, reach), .1], el: [mix(.3, .35, reach), .5], head: mix(-.02, .12, reach), lean: .05, hands: [reach > .5 ? 'open' : 'relaxed', 'relaxed'], hair: 'bun' };
    K.athlete(ctx, D.x, hipY, D.s, pose, { t, seed: 71, dress: X.DOC_DRESS(0), flip, rimW: Math.max(1, .7 * D.s) });
  }

  // ---------------------------------------------------------------- the frame: hall, shelves, then everything far → near
  const SKY = { top: '#fff0d6', low: '#f7d2a2' };   // the hall's light of c09 (late afternoon); the city outside at early dusk
  // the lectern's post gradient degenerates when the camera turns past it edge-on: sanitise the gradient arguments for that one call
  function safeGrad(ctx, fn) {
    const lg = ctx.createLinearGradient;
    ctx.createLinearGradient = (x0, y0, x1, y1) => { if (![x0, y0, x1, y1].every(Number.isFinite)) { x0 = 0; y0 = 0; x1 = 1; y1 = 0; } if (Math.abs(x1 - x0) + Math.abs(y1 - y0) < .5) x1 = x0 + 1; return lg.call(ctx, x0, y0, x1, y1); };
    try { fn(); } finally { ctx.createLinearGradient = lg; }
  }
  const items = [];
  for (const d of K.EXAM.desks) if (d !== BX) items.push({ p: [d.x + .3, d.z], f: (ctx, t, V) => K.examHall(ctx, t, V, { only: (e) => e === d, lamp: { A: 0, B: 1 }, dot: 1, look: () => 'write', after: (cx, e) => { if (e.g === 'B') X.nameplate(cx, V, e, 1); } }) });
  for (let i = 0; i + 1 < X.RAIL_B.length; i++) { const a = X.RAIL_B[i], b = X.RAIL_B[i + 1]; items.push({ p: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], seg: [a, b], f: (ctx, t, V) => X.rail(ctx, V, [a, b], 1) }); }
  items.push({ p: [RB[0], RB[2]], f: (ctx, t, V) => { X.rollingBoard(ctx, t, V, RB, { content: rbContent, seed: 9 }); X.cardOn(ctx, t, V, CARD, { u: 1, text: cardText }); } });
  items.push({ p: [LEC[0], LEC[2]], f: (ctx, t, V) => safeGrad(ctx, () => X.lectern(ctx, t, V, LEC, { fill: (cx) => plate(cx, t, 'paper', { tone: 'scroll' }) })) });
  items.push({ p: [CR.x0 + .22, CR.z0 + .22], f: (ctx, t, V) => drawCrates(ctx, V) });
  items.push({ p: [8.7, 15.2], f: (ctx, t, V) => drawGym(ctx, t, V, false) });
  items.push({ p: [8.9, 27.4], f: drawSteps });
  items.push({ p: [8.0, 27.6], f: drawTutor });
  for (const b of BENCH) items.push({ p: [b[0], b[1]], f: (ctx, t, V) => drawBench(ctx, t, V, b) });
  items.push({ p: [SIM[0] - .5, SIM[2]], f: drawSim });
  items.push({ p: [DOCP[0] - .2, DOCP[2] + .2], f: drawDoc });
  const depth = (V, it) => {
    if (it.seg) { const [a, b] = it.seg; const c = V.cam, ab = [b[0] - a[0], b[1] - a[1]], L2 = ab[0] ** 2 + ab[1] ** 2, u = clamp(((c.x - a[0]) * ab[0] + (c.z - a[1]) * ab[1]) / L2); return V.toCam([a[0] + ab[0] * u, .5, a[1] + ab[1] * u])[2]; }
    return V.toCam([it.p[0], .5, it.p[1]])[2];
  };
  function draw(ctx, t) {
    X.gcTick();
    t_ = t;
    if (t < A.start + 1e-6) { HI.plate(ctx, t); return; }
    // c02's guard against kit near-plane blow-ups (truss struts, lamps, Go stones), in the hall; not at the pane, where the long zoom
    // (f up to ~20000) makes its widened-frustum clip swallow the window wall (the camera there is far from any truss or lamp)
    const c0 = cam(t), V = glassD(c0) < 2 ? K.view3(c0) : Wd.safeView(K.view3(c0));
    K.hall(ctx, t, V, { sky: SKY, warm: .4, go: (cx, VV) => go(cx, VV), mirror: (cx, VV) => drawGym(cx, t, VV, true), outside: (cx, VV, w) => outside(cx, VV, w, t) });

    P.shelves(ctx, t, V, { grow: bookGrow });
    const list = items.map((it) => ({ it, d: depth(V, it) })).filter((e) => e.d > -2).sort((a, b) => b.d - a.d);
    for (const { it } of list) { it.f(ctx, t, V); }
  }

  return [{ t: HI.b, tr: 'cut', d: .1, draw, print: HI.print }, {   // the first frames are the papyrus (the plate): its finish, then ours
    t: HI.b + .2, tr: 'cut', d: .1, draw, print: PRINT,
    sound: [
      { f: 'paper_slide', t: A.start + .3, v: .3 }, { f: 'pages', t: A.w2 + .2, v: .35 }, { f: 'whoosh_airy', t: A.c1 + .3, v: .25 },
      { f: 'lamp', t: A.m1 + .2, v: .2 }, { f: 'lever_switch', t: FLIP, v: .5 }, { f: 'brass_click', t: FLIP + 1.0, v: .3 }, { f: 'chime', t: FLIP + 1.9, v: .3 },
      { f: 'whoosh_airy', t: A.s1 + .3, v: .25 }, { f: 'brass_click', t: A.s3 + .4, v: .25 }, { f: 'dial', t: A.p1 + .3, v: .25 }, { f: 'pencil', t: A.p2 + .4, v: .3 },
      { f: 'whoosh_airy', t: A.g0 + .1, v: .25 }, { f: 'brass_click', t: gt.fo0 + .1, v: .35 }, { f: 'brass_click', t: gt.fold0 + .1, v: .35 },
      { f: 'shimmer_rings', t: gt.lift0 + .6, v: .35 }, { f: 'glass_hum', t: A.vend + .4, v: .2 },
    ],
  }];
};
