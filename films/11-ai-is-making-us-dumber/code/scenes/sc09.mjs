// c09 · Start with you (09a), in: light (dusk: the lamp's glow) → out: paper (scroll). ONE continuous take in the gym of light, no cut.
// Shot list: /mnt/project-files/scenario/film-klueger/bild/shots.md §4 (9.01–9.08). Anchors are VO words (T.S / T.E on '09a').
//
//  shot  anchor (09a)                          image                                                        the one movement
//  9.01  plate … "One habit, in three moves."  pull back and down out of the pendant lamp above the Go grid: the   the pull-back
//                                              hall in the late warm light; you and the machine at the mirror; the
//                                              rolling board and a lectern by the grid
//  9.02  "First: try before you ask … stuck."  you take the dumbbell from its stand before the machine moves; its   your reach; the stuck half-curl
//                                              hand of light waits behind your back; the half-curl, stuck
//  9.03  "That struggle … That's the lift."    the dumbbell rises slowly, warm, your arm working                  the lift
//  9.04  "Second: ask why … the Go players"    the rolling board: "write this for me" struck through, "why does    chalk
//                                              this work?" beneath; the Go grid behind it
//  9.05  "Then explain it back…"                back to you: your free hand explains, open palm; the machine's      gesture; the rings slow
//                                              rings slow down (listening)
//  9.06  "Third: decide … Let it carry those." the machine rolls back, its forks slide under three crates; each      the forks
//                                              word chalks a crate (mental math · formatting · boring parts); on
//                                              "carry" the forks lift them and set them aside
//  9.07  "And decide what you want to keep…"   it rolls back to you, the hand of light rests on your back, you      the lift
//                                              curl the dumbbell yourself, your arm grows
//  9.08  "If this sounds like an old worry…"    the lectern by the board: an open papyrus; the quote card unrolls on  the card, then the push
//                                              the board; push down into the papyrus → plate paper (scroll)
// New places: the rolling board at (5.9, 18.2) on the grid's front edge, the lectern (3.9, 17.4), the crates (7.0–7.45, z 16.4–16.85), the
// dumbbell's stand (9.42, 15.0), the lamp (5.5, 6.4, 19). Improvement (calm): we leave the pendant lamp above your place instead of a window on
// the far wall (a 180° turn): same warm light plate. Ruhe: one movement at a time (you or the machine), the camera never stops. Print { riso: .25 }.
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, canvas } from '../engine.mjs';
import * as K from '../lib/f11_kit.mjs';
import * as X from '../lib/f11_c05_kit.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';
import { reachArm } from '../lib/figure.mjs';

const PRINT = { riso: .25 };
const DR = 11;
const COOL = '#cfe6f2';

export default async (T, R) => {
  await K.studentsPrepare();
  const { in: HI, out: HO } = handsOf('c09', T);
  const S = (p, n) => T.S('09a', p, n), E = (p, n) => T.E('09a', p, n);
  const A = {
    s1: S('Start'), s1e: E('three moves'), s2: S('First'), s2t: S('try'), s2g: S('Make a'), s2w: S('Write the'), s2s: S('Get a'), s2e: E('little stuck'),
    s3: S('That struggle'), s3l: S('That\'s the'), s3e: E('the lift'), s4: S('Second'), s4i: S('Instead'), s4w: S('write this'), s4m: E('for me'), s4y: S('ask why does'), s4y2: S('why does'), s4e: E('Go players did'),
    s5: S('Then explain'), s5e: E('got it yet'), s6: S('Third'), s6h: S('hand over'), s6m: S('Mental'), s6f: S('Formatting'), s6b: S('The boring'), s6c: S('Let it'), s6e: E('carry those'),
    s7: S('And decide'), s7j: S('Your judgment'), s7t: S('The thing'), s7l: S('Those', 1), s7e: E('lift yourself'), s8: S('If this'), s8p: S('In Plato'), s8e: E('souls'), end: HO.a,
  };

  // ---------------------------------------------------------------- places
  const RB = [5.9, 0, 18.2], RBX0 = RB[0] - X.RB_W / 2, RBY1 = X.RB_Y0 + X.RB_H;
  const LEC = [3.9, 0, 17.4];
  const BX = K.EXAM.at('B', 1, 2);
  const STAND = { x0: 9.27, x1: 9.57, z0: 14.85, z1: 15.15, h: .78 };
  const CR = { x0: 7.0, x1: 7.45, z0: 16.4, z1: 16.85, h: .36, n: 3, bat: .2 };
  const M0 = K.MACHINE, MB = [6.55, 0, 15.45], MU = [6.55, 0, 16.62], MS = [6.25, 0, 17.2];   // home · backed off · under the crates · aside

  // ---------------------------------------------------------------- the machine's path and shape
  const mt = {
    fold: A.s6 + .1, back0: A.s6 + .4, back1: A.s6h + .1, under1: A.s6m - .1, lift0: A.s6c, lift1: A.s6c + .9, aside1: A.s7 + .3,
    down1: A.s7 + 1.1, out1: A.s7j + .2, home1: A.s7t - .2, reach1: A.s7t + .8,
  };
  function machineState(t) {
    let p = M0, fork = 0, forkOut = 0, armOut = .55, rest = 0, carry = 0;
    const lerpP = (a, b, u) => [mix(a[0], b[0], u), 0, mix(a[2], b[2], u)];
    if (t < mt.fold) armOut = .55;
    else if (t < mt.reach1) armOut = .55 * (1 - sm(lin(mt.fold, mt.fold + .7, t))) + sm(lin(mt.home1, mt.reach1, t));
    else { armOut = 1; rest = 1; }
    if (t >= mt.back0 && t < mt.home1) {
      if (t < mt.back1) p = lerpP(M0, MB, eio(lin(mt.back0, mt.back1, t)));
      else if (t < mt.under1) p = lerpP(MB, MU, eio(lin(mt.back1 + .1, mt.under1, t)));
      else if (t < mt.lift1) p = MU;
      else if (t < mt.aside1) p = lerpP(MU, MS, eio(lin(mt.lift1, mt.aside1, t)));
      else if (t < mt.down1) p = MS;
      else if (t < mt.out1) p = lerpP(MS, [MS[0], 0, MS[2] - .75], eio(lin(mt.down1, mt.out1, t)));
      else p = lerpP([MS[0], 0, MS[2] - .75], M0, eio(lin(mt.out1, mt.home1, t)));
    }
    forkOut = sm(lin(mt.back0 + .2, mt.back1 - .3, t)) * (1 - sm(lin(mt.out1 - .1, mt.out1 + .6, t)));
    fork = .26 * eio(lin(mt.lift0, mt.lift1, t)) * (1 - eio(lin(mt.aside1, mt.down1, t)));
    carry = t >= mt.lift0 && t < mt.down1 + .01 ? 1 : 0;
    return { p, fork, forkOut, armOut, rest, carry };
  }
  // the crates: static until lifted, then they ride on the tines; set down aside (they stay there)
  function crateBase(t, ms) {
    const lifted = (mix(16, 150, ms.fork) - 16) / 100;
    if (t < mt.lift0) return { x0: CR.x0, z0: CR.z0, y: 0 };
    const dx = CR.x0 - MU[0], dz = CR.z0 - MU[2];
    if (t >= mt.down1) return { x0: MS[0] + dx, z0: MS[2] + dz, y: 0 };   // set aside: they stay there (c10 finds them at 6.7, 16.98)
    return { x0: ms.p[0] + dx, z0: ms.p[2] + dz, y: lifted };
  }
  // the rings: slow while you explain (listening): the phase is the integral of the speed
  const ringRate = (t) => .35 - .28 * sm(lin(A.s5 + .2, A.s5 + 1.4, t)) * (1 - sm(lin(A.s5e + .2, A.s5e + 1.4, t)));
  const ringPh = (t) => { let ph = 0; const t0 = HI.b - 1, n = Math.ceil((t - t0) / .05), h = (t - t0) / n; for (let i = 0; i < n; i++) ph += ringRate(t0 + (i + .5) * h) * h; return ph; };

  // ---------------------------------------------------------------- you
  const [, sg0] = canvas(400, 400);
  const top = K.athlete(sg0, 200, 200, 1, K.curl(1), { t: 0, arm: 1 }).hand(0), TOP = [top[0] - 200, top[1] - 200];
  const g0 = A.s2t, g1 = A.s2t + 1.0, g2 = A.s2t + 1.9;
  function you(t) {
    const st = { curl: 0, arm: .9, glow: .25, held: t >= g1, reach: 0, back: 0, lean: 0 };
    st.reach = t < g1 ? sm(lin(g0, g1, t)) : 1 - sm(lin(g1, g2, t));
    let c = 0;
    if (t > g2) c = .42 * sm(lin(A.s2g, A.s2e - .4, t));
    if (t > A.s2s) c += .025 * Math.sin((t - A.s2s) * 11) * (1 - sm(lin(A.s3, A.s3 + .6, t)));   // stuck: the arm trembles
    if (t > A.s3) c = mix(c, 1, sm(lin(A.s3 + .2, A.s3e + .2, t)));
    if (t > A.s3e + .3) c = mix(c, .12, sm(lin(A.s3e + .3, A.s3e + 1.7, t)));
    if (t > A.s7l) { const cy = .5 - .5 * Math.cos(Math.PI * 2 * (t - A.s7l - .2) / 2.9); c = mix(.12, cy, sm(lin(A.s7l, A.s7l + 1, t))); }
    st.curl = c;
    st.glow = t < g1 ? .25 : .3 + .55 * clamp(c) * (t > A.s3 ? 1 : .6);
    st.arm = mix(.9, 1.05, sm(lin(A.s3, A.s3e + 1, t))) + .2 * sm(lin(A.s7l + .5, A.end - 1, t));
    st.back = sm(lin(A.s5 + .1, A.s5 + .9, t)) * (1 - sm(lin(A.s5e - .2, A.s5e + .8, t)));   // the free hand explains
    return st;
  }
  function youPose(st, Y, hipY, t, mir) {
    let P = K.curl(st.curl);
    if (st.reach > 0) {   // reach down for the dumbbell on its stand
      const ds = dumbbellRest(Y.V), ra = reachArm(Y.x, hipY, Y.s, { ...K.GYM.idle, lean: .22 }, 0, mir, { t, seed: 11 }, ds, 1);
      const w = st.reach; P = { ...P, sh: [mix(P.sh[0], ra.sh, w), P.sh[1]], el: [mix(P.el[0], ra.el, w), P.el[1]], lean: .22 * w, head: .25 * w, hands: [w > .6 ? 'open' : 'fist', 'relaxed'] };
    }
    if (st.back > 0) P = { ...P, sh: [P.sh[0], mix(P.sh[1], 1.05, st.back)], el: [P.el[0], mix(P.el[1], .85, st.back)], hands: [P.hands ? P.hands[0] : 'fist', st.back > .4 ? 'open' : 'relaxed'], head: -.04 * st.back };
    return P;
  }
  let _V = null;
  const dumbbellRest = (V) => { const p = V.P([(STAND.x0 + STAND.x1) / 2, STAND.h + DR / 100 + .005, (STAND.z0 + STAND.z1) / 2]); return [p.x, p.y]; };

  // you + the machine (+ crates between them in depth), or the reflection
  function drawGym(ctx, t, V, mir) {
    const ms = machineState(t), st = you(t);
    const mp = (p) => (mir ? K.mirrorPt(p) : p);
    const Y = K.sprite(V, mp(K.YOU)), M = K.sprite(V, mp(ms.p)); if (!Y.vis || !M.vis) return;
    if (!X.personAt(V, mp(K.YOU), false) && !X.personAt(V, mp(ms.p), false)) return;   // both off screen (or too close): skip
    Y.V = V;
    const sg = mir ? -1 : 1, km = M.k / 100;
    const toL = (p) => [sg * (p[0] - M.x) / km, (p[1] - M.y) / km], toS = (p) => [M.x + sg * p[0] * km, M.y + p[1] * km];
    const hipY = Y.y - 88 * Y.s;
    if (!mir) { X.safeShadow(ctx, V, ms.p, .6, .3, .26); X.safeShadow(ctx, V, K.YOU, .4, .28, .3); }
    // the hand of light: waits a hand's breadth behind your back, then rests on it
    const backPt = [Y.x - sg * 24 * Y.s, hipY - 46 * Y.s], wait = [backPt[0] - sg * 16 * Y.s, backPt[1] - 6 * Y.s];
    const reach = toL(ms.rest ? backPt : (t > mt.home1 ? [mix(wait[0], backPt[0], sm(lin(mt.home1, mt.reach1, t))), mix(wait[1], backPt[1], sm(lin(mt.home1, mt.reach1, t)))] : wait));
    // the crates: behind the machine (in depth) they are drawn first, in front of it after it
    const cb = crateBase(t, ms), crBehind = !mir && V.toCam([cb.x0 + .22, .3, cb.z0 + .22])[2] > V.toCam([ms.p[0], .8, ms.p[2]])[2];
    if (crBehind) drawCrates(ctx, V, t, ms);
    ctx.save(); ctx.translate(M.x, M.y); ctx.scale(sg * km, km);
    const mo = X.machine2(ctx, t, { reach, armOut: ms.armOut, fork: ms.fork, forkOut: ms.forkOut, core: 1, noHand: true, ringPh: ringPh(t) });
    ctx.restore();
    if (!mir && !crBehind) drawCrates(ctx, V, t, ms);
    // the stand + the dumbbell resting on it (until you take it)
    const sx = mir ? [2 * K.MIRROR.x - STAND.x1, 2 * K.MIRROR.x - STAND.x0] : [STAND.x0, STAND.x1];
    X.box3(ctx, V, sx[0], sx[1], STAND.z0, STAND.z1, STAND.h, { top: '#c99a66', front: '#a87444', side: '#94643c' });
    const hnd = K.athlete(ctx, Y.x, hipY, Y.s, youPose(st, Y, hipY, t, mir), { t, arm: st.arm, flip: mir, seed: 11 });
    const hp = toS(mo.hand); K.lightHand(ctx, t, hp[0], hp[1], mir ? Math.PI - mo.handAng : mo.handAng, { ...mo.handO, a: mo.handO.a * (ms.rest ? 1 : .8), s: mo.handO.s * km });
    const h = st.held ? hnd.hand(0) : dumbbellRest(V);
    K.dumbbell(ctx, t, h[0], h[1], { r: DR * km, glow: st.glow });
  }
  const LABELS = [['mental math', A.s6m], ['formatting', A.s6f], ['boring parts', A.s6b]];
  function drawCrates(ctx, V, t, ms) {
    const b = crateBase(t, ms), x0 = b.x0, x1 = b.x0 + (CR.x1 - CR.x0), z0 = b.z0, z1 = b.z0 + (CR.z1 - CR.z0);
    // the pallet battens (the tines slide between them), then the stack
    X.box3(ctx, V, x0, x1, z0 + .02, z0 + .1, CR.bat, { y0: b.y, top: '#b98250', front: '#9a6a44', side: '#86583a', noShadow: b.y > .01 });
    X.box3(ctx, V, x0, x1, z1 - .1, z1 - .02, CR.bat, { y0: b.y, top: '#b98250', front: '#9a6a44', side: '#86583a', noShadow: true });
    if (b.y < .01) X.safeShadow(ctx, V, [(x0 + x1) / 2, 0, (z0 + z1) / 2], .4, .3, .25);
    for (let i = 0; i < CR.n; i++) {
      const [s, ta] = LABELS[CR.n - 1 - i];
      X.box3(ctx, V, x0, x1, z0, z1, CR.h - .015, { y0: b.y + CR.bat + i * CR.h, slats: 3, top: '#d4a46c', front: '#bd8a56', side: '#a37346', noShadow: true,
        label: (c, w, hh) => K.chalkText(c, s, w / 2, hh * .62, { size: 7.2, align: 'center', u: lin(ta + .05, ta + .55, t), a: .95 }) });
    }
  }

  // ---------------------------------------------------------------- the rolling board (why, not what) + Plato's card
  function rbContent(ctx, B, t) {
    K.chalkText(ctx, 'write this for me', 140, 36, { size: 15, u: lin(A.s4w, A.s4m + .1, t) });
    K.chalkLine(ctx, [[136, 31], [254, 29.5]], { u: lin(A.s4m + .25, A.s4m + .6, t), lw: 2.2 });
    K.chalkText(ctx, 'why does this work?', 140, 72, { size: 15, u: lin(A.s4y2, A.s4e - 1.2, t), col: K.PAL.effortHot });
  }
  const CARD = { x0: RBX0 + .07, x1: RBX0 + 1.24, y1: RBY1 - .06, y0: RBY1 - 1.06, z: RB[2] };
  const cardU = (t) => eout(lin(A.s8p - .1, A.s8p + .6, t));
  const cardText = (ctx, w, h) => X.quoteText(ctx, w, h, ['“this discovery of yours', 'will create forgetfulness', 'in the learners’ souls”'], 'PLATO  ·  PHAEDRUS  ·  TRANSL. JOWETT', { size: 10.6, x: 8, y: 20 });

  // ---------------------------------------------------------------- the camera (one take)
  const look = (p, q) => ({ yaw: Math.atan2(q[0] - p[0], q[2] - p[2]), pitch: Math.atan2(q[1] - p[1], Math.hypot(q[0] - p[0], q[2] - p[2])) });
  const c = (x, y, z, yaw, pitch, f) => ({ x, y, z, yaw, pitch, f });
  const at = (p, q, f) => { const L = look(p, q); return c(p[0], p[1], p[2], L.yaw, L.pitch, f); };
  const YP = [8.7, 1.2, 15.2], MID = [7.2, 1.15, 16.4], RBL = [RB[0] + .65, 1.5, RB[2]], CRV = [7.6, 1.0, 16.0], PL = [4.65, 1.35, 17.8], PL2 = [4.6, 1.3, 17.8];
  const LAMP = [5.5, 19], GLOBE = [LAMP[0], 6.4 - .078, LAMP[1]];
  // RUHE (calm.py): few framings, long holds. 9.01–9.03 one frame closing in on you very slowly; 9.04 the board; 9.05 you; 9.06–9.07 one
  // wide frame (you, the machine, the crates); 9.08 the card and the lectern, then the push.
  const CAM = [
    [HI.b, c(GLOBE[0], GLOBE[1], GLOBE[2] - .23, 0, 0, 1600)],
    [HI.b + 1.0, c(5.5, 6.05, 17.95, .02, -.1, 1600)],
    [HI.b + 3.5, c(5.45, 4.2, 14.4, .15, -.3, 1550)],
    [A.s2 + 2.2, at([5.6, 1.88, 9.85], [7.5, 1.18, 16.1], 1530)],                       // 9.01–9.03 you, the machine, the board
    [A.s3 + .2, at([5.6, 1.88, 9.85], [7.5, 1.18, 16.1], 1545)],
    [A.s3e + .1, at([5.6, 1.88, 9.85], [7.5, 1.18, 16.1], 1560)],
    [A.s4w - .2, at([5.6, 1.8, 11.9], RBL, 2050)],                    // 9.04 the board
    [A.s4e - 1.3, at([5.6, 1.8, 11.9], RBL, 2070)],  //  the grid glimpsed below it
    [A.s5 + 3.2, at([5.9, 2.0, 12.0], CRV, 1420)],                      // 9.05–9.07 one wide frame: you explain, the crates, the lift
    [A.s5e + .8, at([5.9, 2.0, 12.0], CRV, 1425)],
    [A.s6h + .3, at([5.9, 2.0, 12.0], CRV, 1420)],                      // (held)
    [A.s7, at([5.9, 2.0, 12.0], CRV, 1430)],
    [A.s7e - 1.2, at([5.9, 2.0, 12.0], CRV, 1420)],
    [A.s8p + .45, at([4.3, 2.35, 15.4], PL2, 1380)],                      // 9.08 the card, the lectern
    [A.s8p + .85, at([4.3, 2.35, 15.4], PL2, 1385)],
  ];
  // the push down into the papyrus (normal of the slanted top: (0, .901, −.433))
  const SC = [LEC[0], mix(1.02, 1.26, .5) + .006, LEC[2]], N = [0, .901, -.433], DD = .27;
  // the last view looks down onto the sheet at 46° (not along its 64° normal): a smaller turn during the push; close enough that the sheet
  // still covers the whole frame
  const PA = .8, PD = [0, Math.sin(PA), -Math.cos(PA)];
  const P0 = CAM[CAM.length - 1], P1 = c(SC[0], SC[1] + PD[1] * DD, SC[2] + PD[2] * DD, 0, -PA, 1600), PC = { x: 4.2, y: 1.9, z: 15.6 };
  // a trapezoid speed profile (ease in over the first 30 %, out over the last 30 %): the peak speed is 1.4× the mean, not 1.5× (smoothstep)
  const trap = (l, e = .3) => { const vm = 1 / (1 - e); if (l < e) return vm * l * l / (2 * e); if (l > 1 - e) return 1 - vm * (1 - l) * (1 - l) / (2 * e); return vm * (l - e / 2); };
  const DRP = DD / Math.hypot(P0[1].x - P1.x, P0[1].y - P1.y, P0[1].z - P1.z);   // the remaining distance shrinks partly exponentially
  function push(t) {
    const v = trap(lin(P0[0], A.end - 1 / 30, t)), u = .75 * v + .25 * (1 - Math.pow(DRP, v)) / (1 - DRP), a = P0[1], q = (k) => (1 - u) * (1 - u) * a[k] + 2 * u * (1 - u) * PC[k] + u * u * P1[k];
    const x = q('x'), y = q('y'), z = q('z'), L = look([x, y, z], SC), w = sm(lin(0, .8, v)), k = sm(lin(.7, 1, v));
    return { x, y, z, yaw: mix(mix(a.yaw, L.yaw, w), P1.yaw, k), pitch: mix(mix(a.pitch, L.pitch, w), P1.pitch, k), f: mix(a.f, P1.f, u) };
  }
  const drA = (t) => .02 * sm(lin(HI.b + 2, HI.b + 4.5, t));
  const cam = (t) => (t > P0[0] ? push(t) : X.glide(t, CAM, { drift: drA(t) }));

  // the Go grid (as the film left it: the line, the stones)
  const GAME = [[3, 15, 'b'], [4, 14, 'w'], [3, 13, 'w'], [5, 15, 'b'], [2, 14, 'b'], [15, 15, 'w'], [14, 16, 'b'], [16, 14, 'b'], [15, 3, 'w'], [16, 4, 'b'], [4, 3, 'b'], [11, 7, 'w'], [13, 9, 'b'], [15, 11, 'b'], [13, 13, 'w'], [12, 11, 'w'], [14, 12, 'w'], [13, 12, 'b']];
  const pt = (i, j) => { const p = K.goPt(i, j); return [p[0], p[2]]; };
  const FLAT = [pt(1, 6), pt(11, 6)], BEND = [pt(11, 6), pt(12.4, 6.6), pt(13.4, 8.4), pt(14.2, 11.5), pt(14.8, 15.5), pt(15.2, 19.2)];
  // stones behind or right at the camera plane would project to NaN (skia aborts): skip them
  const stoneOk = (V, i, j) => { const p = K.goPt(i, j), q = V.P([p[0], 0, p[2]]); return q.z > 1.2 && Number.isFinite(q.x) && Number.isFinite(q.y); };
  function go(ctx, V, G, t) {
    K.floorLine(ctx, V, FLAT, { u: 1, w: .55, a: .8 }); K.floorLine(ctx, V, BEND, { u: 1, w: .55, a: .8 });
    for (const [i, j, cc] of GAME) if (stoneOk(V, i, j)) K.goStone(ctx, V, i, j, { col: cc === 'b' ? 'black' : 'white', glow: i === 13 && j === 12 ? .6 * sm(lin(A.s4e - 2, A.s4e - .8, t)) * (1 - sm(lin(A.s5 + 1, A.s5 + 2, t))) : 0 });
  }

  // ---------------------------------------------------------------- the frame
  const SKY = { top: '#fff0d6', low: '#f7d2a2' };   // late afternoon (the city outside is at dusk; inside the hall stays bright)
  function draw(ctx, t) {
    X.gcTick();
    const V = X.safeV(K.view3(cam(t)), LAMP);
    X.hall(ctx, t, V, { sky: SKY, warm: .4, go: (cx, VV, G) => go(cx, VV, G, t), mirror: (cx, VV) => drawGym(cx, t, VV, true) });
    // far → near: the board + card, the lectern (+ papyrus = the scroll plate), the machine + crates, you
    // the exam desks as c05 left them (group B lit, its plates up, the rail round it); B(1,2) has made room for the lectern
    const ex = (only) => K.examHall(ctx, t, V, { only: (d) => d !== BX && only(d), lamp: { A: 0, B: 1 }, dot: 1, look: () => 'write', after: (cx, d) => { if (d.g === 'B') X.nameplate(cx, V, d, 1); } });
    ex((d) => d.row >= 2);
    X.rail(ctx, V, X.RAIL_B, 1);
    X.rollingBoard(ctx, t, V, RB, { content: rbContent, seed: 9 });
    X.cardOn(ctx, t, V, CARD, { u: cardU(t), text: cardText });
    ex((d) => d.row === 1);
    X.lectern(ctx, t, V, LEC, { fill: (cx) => plate(cx, t, 'paper', { tone: 'scroll' }) });
    drawGym(ctx, t, V, false);
    ex((d) => d.row === 0);
    // the lamp we came out of: its globe is the warm light plate
    const G = X.lampGlobe(V, LAMP[0], LAMP[1]);
    if (G) { ctx.save(); ctx.beginPath(); ctx.arc(G.x, G.y, G.r, 0, Math.PI * 2); ctx.clip(); HI.plate(ctx, t); ctx.restore(); }
  }

  return [{ t: HI.b, tr: 'cut', d: .1, draw, print: HI.print }, {   // the first frames are inside the globe (the plate): its finish, then ours
    t: HI.b + .2, tr: 'cut', d: .1, draw, print: PRINT,
    sound: [
      { f: 'lamp', t: HI.b + .3, v: .25 }, { f: 'clink', t: g1, v: .35 }, { f: 'chalk', t: A.s4w, v: .4 }, { f: 'chalk', t: A.s4y2, v: .4 },
      { f: 'brass_click', t: mt.back0 + .3, v: .4 }, { f: 'chalk', t: A.s6m + .05, v: .3 }, { f: 'brass_click', t: mt.reach1, v: .45 }, { f: 'paper_slide', t: A.end - .5, v: .35 },
    ],
  }];
};
