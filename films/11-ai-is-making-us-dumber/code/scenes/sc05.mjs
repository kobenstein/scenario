// c05 · Who does the thinking (04a), in: light (core) → out: paper (cream). ONE continuous take in the gym of light, no cut.
// Shot list: /mnt/project-files/scenario/film-klueger/bild/shots.md §4 (5.01–5.10). Anchors are VO words (T.S / T.E on '04a').
//
//  shot  anchor (04a)                          image                                                         the one movement
//  5.01  plate … "They studied it."            pull out of the glass core of a machine on the Go grid: the Go  the pull-out (long, eased)
//                                              player bends over the board, his finger on the machine's white
//                                              stone; the machine's hand of light points at the same stone
//  5.02  "The doctors did … the looking."      same frame as 5.01 (the pull-out ends wide enough for both):     drift; the cool square scans
//                                              the doctors' table on the grid's front edge:
//                                              two doctors lean back, arms folded; a cool light square scans
//                                              the sheet between them (their desk machine does the looking)
//  5.03  "So is that … Who does the thinking?" the camera rests between them: the warm stone (left of the       drift; the stone glows
//                                              Go player's finger) and the cool square
//  5.04  "A physics class at Harvard…"          glide over the doctors' heads to the grid's left edge: a class      the glide; the sketch is chalked
//                                              benches, the rolling board with a physics sketch; source tag
//  5.05  "Researchers built a tutor … step"     the tutor (trainer shape) guides a student: its hand of light     one step at a time: a box rises,
//                                              on her back, then it points; wooden steps rise one by one, she    the student climbs it
//                                              climbs one step at a time
//  5.06  "Against a very good class … less"     the rolling board: bars class 1 · tutor about 2×, two chalk        bars, then the clocks
//                                              clocks (the tutor's arc shorter)
//  5.07  "The teachers built the tutor…"        two teachers adjust the brass machine (one at the ring, one at    the hands
//                                              the arm joint)
//  5.08  "And now you know … Turkey."           the lens closes (slow zoom, small turn) on group B's back-right    the zoom; the plate flips up
//                                              desk beside the camera: its
//                                              warm dial and a small brass plate that flips up: HINTS, NOT ANSWERS
//  5.09  "The group that lost … Never answers." the lens opens again over B's back row: its machines light in a   the lamps (chime)
//                                              wave, the
//                                              students write themselves; every B plate flips up
//  5.10  "Their study's title … learning."      a brass guardrail rises around group B; the quote card unrolls    the rail, then the push
//                                              on the rolling board; push into its blank lower half → plate paper (cream)
// New places: the doctors' table on the Go grid's front-left (5.4, 19.3); the Go player at (7.5, 21.25) with a machine (8.85, 21.6, facing −x);
// the class + tutor at the back, behind group B and the grid (benches x 2.2, z 26.6 / 28.3; student 7.75, 27.4; steps x 8.2–9.1; tutor 7.0, 27.85); 5.04–5.10 are seen from one
// place (4.85, 1.8, 22.4) on the grid's left edge;
// the rolling board (5.6, 30.0) facing the camera. Ruhe: one main movement at a time; the camera never stops (glide). Print { riso: .25 }.
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, canvas } from '../engine.mjs';
import * as K from '../lib/f11_kit.mjs';
import * as X from '../lib/f11_c05_kit.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';
import { reachArm } from '../lib/figure.mjs';

const PRINT = { riso: .25 };
const COOL = '#cfe6f2';

export default async (T, R) => {
  await K.studentsPrepare();
  const { in: HI, out: HO } = handsOf('c05', T);
  const S = (p, n) => T.S('04a', p, n), E = (p, n) => T.E('04a', p, n);
  const A = {
    s1: S('It seems'), s2: S('They studied'), s2e: E('studied it'), s3: S('The doctors'), s4: S('They let'), s4e: E('the looking'),
    s5: S('So is that'), s6: S('Who does'), s6e: E('the thinking'), s7: S('A physics'), s7h: S('Harvard'), s7e: E('the test'),
    s8: S('Researchers'), s8g: S('good teaching'), s9: S('It didn'), s9e: E('out answers'), s10: S('It asked'), s10a: S('and led'), s10o: S('one step'), s10e: E('a time'),
    s11: S('Against'), s11c: S('class with'), s11t: S('twice'), s11e: E('as much'), s12: S('In less'), s12e: E('less time'),
    s13: S('The teachers'), s13e: E('tutor themselves'), s14: S('One strong'), s14e: E('last word'),
    s15: S('And now'), s15d: S('small difference'), s15e: E('in Turkey'), s16: S('The group that'), s16i: S('same idea'), s17: S('Hints'), s18: S('Never answers'), s18e: E('Never answers'),
    s19: S('Their study'), s19w: S('without guardrails'), s19e: E('harm learning'), end: HO.a,
  };

  // ---------------------------------------------------------------- places (metres)
  const GOP = [7.5, 0, 21.25], MGO = [8.85, 0, 21.6], STONE = [14, 12];   // the Go player, his machine (faces −x), the machine's white stone
  const DT = [5.4, 0, 19.3], DOC = [[4.78, 0, 19.3], [6.02, 0, 19.3]];      // doctors' table + the two doctors (the second faces −x)
  const RB = [5.6, 0, 30.0];                                                 // the rolling board
  const STU = [7.75, 0, 27.4], MT = [7.0, 0, 27.85];                         // the tutor's student, the tutor machine
  const STEPS = [0, 1, 2].map((i) => ({ x0: 8.2 + .45 * i, x1: 8.65 + .45 * i, z0: 27.1, z1: 27.7, h: .3 * (i + 1) }));
  const TEACH = [[7.7, 0, 28.65], [8.25, 0, 29.05]];                        // the two teachers, behind the steps (both face −x)
  const BENCH = [[2.2, 26.6], [2.2, 28.3]];
  const CLASS = [[1.25, 26.6, 2], [2.15, 26.6, 7], [3.05, 26.6, 4], [1.25, 28.3, 9], [2.15, 28.3, 1], [3.05, 28.3, 10]];
  const BD = K.EXAM.at('B', 4, 2);                                           // group B's back-right desk: the dial we push to
  const BM = [BD.x + .72, .74, BD.z + .3];                                   // its desk machine
  // the card on the rolling board (right half of the slate), its blank lower half is the plate
  const RBX0 = RB[0] - X.RB_W / 2, RBY1 = X.RB_Y0 + X.RB_H;
  const CARD = { x0: RBX0 + .08, x1: RBX0 + 1.22, y1: RBY1 - .08, y0: RBY1 - 1.22, z: RB[2] };
  const CARDC = [(CARD.x0 + CARD.x1) / 2, .93 + .23, RB[2]];

  // ---------------------------------------------------------------- the camera (one take, glide = no dead stops)
  const look = (p, q) => ({ yaw: Math.atan2(q[0] - p[0], q[2] - p[2]), pitch: Math.atan2(q[1] - p[1], Math.hypot(q[0] - p[0], q[2] - p[2])) });
  const c = (x, y, z, yaw, pitch, f) => ({ x, y, z, yaw, pitch, f });
  // RUHE (calm.py): few framings, long holds. 5.01–5.03 share one frame (both pairs); 5.04–5.07 share one frame (class, board, steps,
  // teachers) that closes in very slowly; the moves: pull-out, glide to the back, the dial, up over B, the push.
  // 5.04–5.10 one place on the grid's left edge, beside group B's back-right desk: the class, the board, the tutor and the teachers
  // ahead; on "small difference" the lens closes on the dial (a slow zoom, a small turn), then opens over B's back row for the wave
  // and the rail; then the push to the card straight ahead.
  const C2 = [4.85, 1.8, 22.4], C2l = look(C2, [4.95, 1.1, 28]), C2d = look(C2, [BM[0] + .1, .8, BM[2]]), C2w = look(C2, [3.75, .95, 28]);
  const CAM = [
    [HI.b, c(MGO[0], 1.28, MGO[2] - .22, 0, 0, 1700)],                       // inside the core
    [HI.b + 1.3, c(MGO[0] - .05, 1.3, MGO[2] - .95, -.005, -.01, 1700)],
    [HI.b + 3.4, c(8.55, 1.75, 18.4, -.06, -.08, 1640)],
    [A.s2 + 2.9, c(6.65, 2.0, 15.35, -.02, -.13, 1560)],                     // 5.01–5.03: the Go player, the doctors
    [A.s7 - 1.6, c(6.65, 2.0, 15.35, -.02, -.13, 1575)],
    [A.s7 + 1.4, c(5.6, 2.45, 18.7, .05, -.14, 1440)],                       // 5.04 over the doctors' heads …
    [A.s8 + .7, c(C2[0], C2[1], C2[2] - .15, C2l.yaw, C2l.pitch, 1080)],    // … to the back: the class, the board, the tutor
    [A.s12e, c(C2[0], C2[1], C2[2] - .15, C2l.yaw, C2l.pitch, 1095)],
    [A.s14 - .1, c(C2[0], C2[1], C2[2] - .15, C2l.yaw, C2l.pitch, 1105)],   // 5.07 the teachers
    [A.s15d + .3, c(C2[0], C2[1] - .03, C2[2] + .04, C2d.yaw, C2d.pitch, 2350)],  // 5.08 the lens closes on the dial
    [A.s16 + .05, c(C2[0], C2[1] - .03, C2[2] + .04, C2d.yaw, C2d.pitch, 2330)],
    [A.s16i + .45, c(C2[0], C2[1] + .02, C2[2] + .02, C2w.yaw, C2w.pitch, 1200)],     // 5.09 opens again: the wave over B's back row
    [A.s18e - 2.1, c(C2[0], C2[1] + .02, C2[2] + .02, C2w.yaw, C2w.pitch, 1190)],   // the rail rises
  ];
  const P0 = CAM[CAM.length - 1], P1 = c(CARDC[0], CARDC[1], CARD.z - .72, 0, 0, 1700), PC = { x: 5.0, y: 1.75, z: 25.6 };
  // the push: the remaining distance to the card shrinks exponentially, so the image grows at an even rate (no rush at the end)
  const DR = .72 / Math.hypot(P0[1].x - P1.x, P0[1].y - P1.y, P0[1].z - P1.z);
  function push(t) {
    const v = sm(lin(P0[0], A.end - 1 / 30, t)), u = .5 * v + .5 * (1 - Math.pow(DR, v)) / (1 - DR), a = P0[1], q = (k) => (1 - u) * (1 - u) * a[k] + 2 * u * (1 - u) * PC[k] + u * u * P1[k];
    const x = q('x'), y = q('y'), z = q('z'), L = look([x, y, z], CARDC), w = sm(lin(0, .7, v)), k = sm(lin(.7, 1, v));
    return { x, y, z, yaw: mix(mix(a.yaw, L.yaw, w), 0, k), pitch: mix(mix(a.pitch, L.pitch, w), 0, k), f: mix(a.f, P1.f, sm(u)) };
  }
  const drA = (t) => .02 * sm(lin(HI.b + 1.5, HI.b + 4, t));
  const cam = (t) => (t > P0[0] ? push(t) : X.glide(t, CAM, { drift: drA(t) }));

  // ---------------------------------------------------------------- the Go grid: the game, the line of 66 years (as c01 left it), the stones
  const GAME = [[3, 15, 'b'], [4, 14, 'w'], [3, 13, 'w'], [5, 15, 'b'], [2, 14, 'b'], [15, 15, 'w'], [14, 16, 'b'], [16, 14, 'b'], [15, 3, 'w'], [16, 4, 'b'], [4, 3, 'b'], [11, 7, 'w'], [13, 9, 'b'], [15, 11, 'b'], [13, 13, 'w'], [12, 11, 'w']];
  const pt = (i, j) => { const p = K.goPt(i, j); return [p[0], p[2]]; };
  const FLAT = [pt(1, 6), pt(11, 6)], BEND = [pt(11, 6), pt(12.4, 6.6), pt(13.4, 8.4), pt(14.2, 11.5), pt(14.8, 15.5), pt(15.2, 19.2)];
  const warmStone = (t) => sm(lin(A.s5 + .2, A.s5 + 1.2, t));
  // stones behind or right at the camera plane would project to NaN (skia aborts): skip them
  const stoneOk = (V, i, j) => { const p = K.goPt(i, j), q = V.P([p[0], 0, p[2]]); return q.z > 1.2 && Number.isFinite(q.x) && Number.isFinite(q.y); };
  function go(ctx, V, G, t) {
    K.floorLine(ctx, V, FLAT, { u: 1, w: .55, a: .8 }); K.floorLine(ctx, V, BEND, { u: 1, w: .55, a: .8 });
    for (const [i, j, cc] of GAME) if (stoneOk(V, i, j)) K.goStone(ctx, V, i, j, { col: cc === 'b' ? 'black' : 'white' });
    if (stoneOk(V, STONE[0], STONE[1])) K.goStone(ctx, V, STONE[0], STONE[1], { col: 'white' });                                    // the machine's move
    if (stoneOk(V, STONE[0] - 1, STONE[1])) K.goStone(ctx, V, STONE[0] - 1, STONE[1], { col: 'black', glow: warmStone(t) * (1 - .3 * sm(lin(A.s7, A.s7 + 2, t))) });   // the player's answer
  }

  // ---------------------------------------------------------------- people + machines
  const goPose = (t) => {   // bent over the board, the finger traces from the machine's stone to his own
    const tr = .5 + .5 * Math.sin((t - A.s2) * 1.1);
    return { lean: .5, head: .42, sh: [.62 + .08 * tr * sm(lin(A.s2 - .5, A.s2 + .5, t)), .18], el: [.12, .45], hip: [.12, -.12], kn: [.12, .02], hands: ['open', 'relaxed'] };
  };
  // the core of the Go machine is the light plate (c04 pushed into it, we pull out of it)
  const coreFill = (t) => (ctx, cx, cy, R) => {
    HI.plate(ctx, t);
  };
  function goMachine(ctx, t, V) {
    // draw the machine with its arm reaching to the stone (so we need the reach in local units first: a dry run is not needed, the
    // machine's sprite and toL depend only on V)
    const M = K.sprite(V, MGO); if (!M.vis) return null;
    const km = M.k / 100, sp = K.goPt(STONE[0], STONE[1]), tS = V.P([sp[0] + .06, .25, sp[2]]);
    const reach = tS.z > .3 ? [-(tS.x - M.x) / km, (tS.y - M.y) / km] : [70, -30];
    const arm = sm(lin(A.s2 - .3, A.s2 + .8, t)) * (1 - .25 * sm(lin(A.s7, A.s7 + 2, t)));
    return X.machineAt(ctx, t, V, MGO, { flip: true, noHand: true, forkOut: 0, reach, armOut: arm, bend: -1, coreFill: coreFill(t), seed: 0, ringPh: 7.854 + (t - HI.b) * .35 });
  }
  function drawGoPair(ctx, t, V) {
    const mm = goMachine(ctx, t, V);
    const P = X.personAt(V, GOP);
    if (P) { X.safeShadow(ctx, V, GOP, .4, .28, .3); K.athlete(ctx, P.x, P.hipY, P.s, goPose(t), { t, seed: 23, dress: { coat: '#8a5560', pants: '#3a3430' }, arm: 1 }); }
    X.handOf(ctx, t, mm);
  }
  // the doctors: they lean back, their desk machine scans the sheet with a cool square of light
  function drawDoctors(ctx, t, V) {
    K.stool(ctx, V, DOC[0]); K.stool(ctx, V, DOC[1]);
    const order = [0, 1].map((i) => ({ i, z: V.toCam(DOC[i])[2] })).sort((a, b) => b.z - a.z);
    const drawDoc = (i) => {
      const P = X.personAt(V, DOC[i], true); if (!P) return;
      K.athlete(ctx, P.x, P.hipY, P.s, { ...X.LEANBACK, coat: 1, hair: i ? 'short' : 'bun' }, { t, seed: 31 + i, dress: X.DOC_DRESS(i), flip: i === 1, arm: .95 });
    };
    // far doctor, table, near doctor
    drawDoc(order[0].i);
    const sh = K.desk3(ctx, V, DT, { sheet: 1, sheetFill: (cx, Sp) => scanSheet(cx, V, t) });
    const dm = K.sprite(V, [DT[0] + .12, .74, DT[2] + .38]);
    if (dm.vis) { ctx.save(); ctx.translate(dm.x, dm.y); ctx.scale(dm.k / 100, dm.k / 100); K.deskMachine(ctx, t, { core: 1, seed: 5 }); ctx.restore(); }
    drawDoc(order[1].i);
  }
  const SH = { x: DT[0] - .02, z: DT[2] - .12, a: .12, w: .105, l: .15, y: .742 };
  const onS = (u, v) => [SH.x + u * Math.cos(SH.a) - v * Math.sin(SH.a), SH.y + .0006, SH.z + u * Math.sin(SH.a) + v * Math.cos(SH.a)];
  function scanSheet(ctx, V, t) {
    ctx.fillStyle = K.PAL.paper; ctx.fillRect(0, 0, W, H);
    // the image on the sheet: a grey-blue scan (soft blobs), and the cool square that scans it in rows
    ctx.fillStyle = rgba('#8c9aa0', .35); if (V.poly(ctx, [onS(-.08, -.12), onS(.08, -.12), onS(.08, .1), onS(-.08, .1)])) ctx.fill();
    const run = (t - (A.s3 - 1)) / 1.6, row = Math.floor(run) % 4, u = run - Math.floor(run), sq = .04;
    const cu = -.07 + row * .045, cv = -.11 + .2 * (row % 2 ? 1 - u : u);
    if (V.poly(ctx, [onS(cu - sq / 2, cv - sq / 2), onS(cu + sq / 2, cv - sq / 2), onS(cu + sq / 2, cv + sq / 2), onS(cu - sq / 2, cv + sq / 2)])) {
      ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = rgba(COOL, .95); ctx.fill(); ctx.restore();
      ctx.strokeStyle = rgba('#f6fcff', .9); ctx.lineWidth = 1.2; ctx.stroke();
    }
  }
  // the tutor scene: steps rise, the student climbs, the machine guides; the class on benches; the teachers
  const boxUp = STEPS.map((s, i) => [A.s8g - .2, A.s10 + .3, A.s10o - .35][i]);
  const climbAt = [A.s9 + .5, A.s10o, A.s10e + .2];   // each climb takes 1.1 s
  const CL = 1.1;
  function climbState(t) {
    // where the student stands: level 0 = floor, i+1 = on box i
    let lvl = 0, u = 0;
    for (let i = 0; i < 3; i++) { if (t >= climbAt[i] + CL) lvl = i + 1; else if (t >= climbAt[i]) { lvl = i; u = (t - climbAt[i]) / CL; break; } else break; }
    const foot = (l) => (l === 0 ? [STU[0], 0] : [(STEPS[l - 1].x0 + STEPS[l - 1].x1) / 2 - .04, STEPS[l - 1].h]);
    const p0 = foot(lvl), p1 = lvl < 3 ? foot(lvl + 1) : p0;
    const a = sm(lin(0, .38, u)), b = sm(lin(.3, .82, u)), cc = lin(.55, 1, u);
    const x = mix(p0[0], p1[0], b), y = mix(p0[1], p1[1], b);
    const pose = {
      hip: [.05 + .95 * a * (1 - b), -.05 - .35 * b * (1 - cc) + (cc > 0 ? .4 * Math.sin(Math.PI * cc) : 0)],
      kn: [1.35 * a * (1 - b), u > 0 ? (cc > 0 ? 1.1 * Math.sin(Math.PI * cc) : .15 * b) : 0],
      lean: .05 + .2 * Math.sin(Math.PI * b), sh: [.2 + .25 * Math.sin(Math.PI * b), -.05], el: [.5, .4], head: .12 - .1 * lvl / 3,
      hands: ['relaxed', 'relaxed'], hair: 'long',
    };
    return { x, y, pose, lvl, u };
  }
  function drawTutor(ctx, t, V) {
    const st = climbState(t);
    // the tutor machine: hand of light on her back (5.05 start), then it points to the next step, then it folds while the teachers work on it
    const Ms = K.sprite(V, MT); if (!Ms.vis) return;
    const km = Ms.k / 100, Ss = K.sprite(V, [st.x, st.y, STU[2]]), hipY = Ss.y - 88 * Ss.s;
    const back = [(Ss.x - 22 * Ss.s - Ms.x) / km, (hipY - 44 * Ss.s - Ms.y) / km];
    const nxt = Math.min(2, st.lvl), bx = STEPS[nxt], tp = V.P([(bx.x0 + bx.x1) / 2, bx.h + .25, STU[2]]), point = [(tp.x - Ms.x) / km, (tp.y - Ms.y) / km];
    const pointW = sm(lin(A.s9, A.s9 + .9, t)), fold = .45 * sm(lin(A.s11, A.s11 + 1.4, t));
    let reach = [mix(back[0], point[0], pointW), mix(back[1], point[1], pointW)];
    if (!Ss.vis || !(tp.z > .3) || !reach.every(Number.isFinite)) reach = [60, -60];
    const armOut = sm(lin(A.s8 - .2, A.s8 + .8, t)) * (1 - fold);
    // teachers work at the machine (5.07): the far one first
    const teachW = sm(lin(A.s13 + .1, A.s13 + 1.1, t)) * (1 - sm(lin(A.s15 + .6, A.s15 + 1.8, t)));
    const drawTeacher = (i) => {
      const P = X.personAt(V, TEACH[i]); if (!P) return;
      const tgt = i === 0 ? [Ms.x + 26 * km, Ms.y - 128 * km] : [Ms.x + 60 * km, Ms.y - 92 * km];
      const base = { sh: [.12, .06], el: [.3, .2], head: .05, hands: ['open', 'relaxed'], hair: i ? 'short' : 'curly' };
      let pose = base;
      if (teachW > 0) {
        const ra = reachArm(P.x, P.hipY, P.s, base, 0, true, { t, seed: 41 + i }, tgt);
        const wob = .04 * Math.sin(t * 2.1 + i);
        pose = { ...base, sh: [mix(base.sh[0], ra.sh + wob, teachW), base.sh[1]], el: [mix(base.el[0], ra.el, teachW), base.el[1]], head: mix(.05, -.12, teachW) };
      }
      X.safeShadow(ctx, V, TEACH[i], .38, .26, .28);
      K.athlete(ctx, P.x, P.hipY, P.s, pose, { t, seed: 41 + i, dress: X.TEACH_DRESS(i), flip: true });
    };
    drawTeacher(1); drawTeacher(0);
    const mm = X.machineAt(ctx, t, V, MT, { noHand: true, forkOut: 0, reach, armOut, seed: 7, ringPh: t * .35 });
    // the steps (they rise out of the floor, ≤ .5 s each), then the student
    STEPS.forEach((s, i) => X.box3(ctx, V, s.x0, s.x1, s.z0, s.z1, s.h * eout(lin(boxUp[i], boxUp[i] + .5, t)), { hand: true, top: '#dcae74', front: '#c08a56', side: '#a87444' }));
    if (X.personAt(V, [st.x, st.y, STU[2]])) {
      if (st.y < .01) X.safeShadow(ctx, V, [st.x, 0, STU[2]], .35, .25, .3);
      K.athlete(ctx, Ss.x, hipY, Ss.s, st.pose, { t, seed: 51, dress: { coat: '#e2b04a', pants: '#2e3448', skin: K.PAL.skin[3], hair: '#5a3a24' }, arm: .95 });
    }
    if (mm && armOut > .02) X.handOf(ctx, t, mm, { open: mix(1, .6, pointW) });
  }
  function drawClass(ctx, t, V) {
    for (const [bx, bz] of [...BENCH].sort((a, b) => b[1] - a[1])) {
      const Bs = K.sprite(V, [bx, 0, bz]);
      if (Bs.vis) { ctx.save(); ctx.translate(Bs.x, Bs.y); ctx.scale(Bs.k / 100, Bs.k / 100); K.bench(ctx, { L: 270 }); ctx.restore(); }
      for (const [x, z, v] of CLASS.filter((q) => q[1] === bz)) K.student(ctx, V, [x, -.07, z], { v, pose: 'look' });
    }
  }

  // ---------------------------------------------------------------- the rolling board: physics sketch, bars, clocks; the card
  function rbContent(ctx, B, t) {
    const sk = (a, b) => lin(A.s7 + a, A.s7 + b, t);
    // the physics sketch: an incline, a block on it, two force arrows
    K.chalkLine(ctx, [[14, 50], [104, 50], [104, 12], [14, 50]], { u: sk(.2, 1.2), lw: 1.8 });
    const bxp = [[52, 34], [64, 29], [68.5, 39.5], [56.5, 44.5]]; K.chalkLine(ctx, [...bxp, bxp[0]], { u: sk(1.1, 1.6), lw: 1.6 });
    K.chalkLine(ctx, [[60, 37], [60, 58]], { u: sk(1.6, 1.9), lw: 1.5 }); K.chalkLine(ctx, [[57, 54], [60, 58], [63, 54]], { u: sk(1.85, 2.0), lw: 1.5 });
    K.chalkLine(ctx, [[60, 37], [80, 28.5]], { u: sk(1.95, 2.2), lw: 1.5 }); K.chalkLine(ctx, [[75, 27.5], [80, 28.5], [77, 32.5]], { u: sk(2.15, 2.3), lw: 1.5 });
    K.chalkText(ctx, 'physics', 108, 22, { size: 9, u: sk(2.2, 2.7), a: .8 });
    // the bars (class = 1, tutor ≈ 2)
    if (t > A.s11) {
      const base = 116, o = 132;
      K.chalkLine(ctx, [[o + 4, base], [o + 88, base]], { u: lin(A.s11, A.s11 + .5, t), lw: 1.8 });
      K.chalkBar(ctx, o + 14, base, 24, 27, { u: eout(lin(A.s11c, A.s11c + .6, t)), lw: 1.8, seed: 3 });
      K.chalkBar(ctx, o + 54, base, 24, 54, { u: eout(lin(A.s11t - .1, A.s11t + .7, t)), lw: 1.8, col: COOL, seed: 4 });
      K.chalkText(ctx, 'class', o + 26, base + 10, { size: 8.5, align: 'center', u: lin(A.s11c, A.s11c + .4, t), a: .8 });
      K.chalkText(ctx, 'tutor', o + 66, base + 10, { size: 8.5, align: 'center', u: lin(A.s11t, A.s11t + .4, t), a: .8 });
      K.chalkText(ctx, 'about 2×', o + 66, base - 60, { size: 12, align: 'center', u: lin(A.s11e - .1, A.s11e + .5, t), col: COOL });
    }
    if (t > A.s12) {   // time: the class's full hour, the tutor's shorter arc
      const clock = (cx, cy, sweep, u, col) => {
        K.chalkLine(ctx, Array.from({ length: 33 }, (_, i) => [cx + 11 * Math.sin(i / 32 * Math.PI * 2), cy - 11 * Math.cos(i / 32 * Math.PI * 2)]), { u: lin(0, .5, u), lw: 1.5 });
        const n = 24, arc = [[cx, cy]]; for (let i = 0; i <= n; i++) { const a = sweep * i / n; arc.push([cx + 8 * Math.sin(a), cy - 8 * Math.cos(a)]); } arc.push([cx, cy]);
        K.chalkLine(ctx, arc, { u: lin(.4, 1, u), lw: 1.5, col });
      };
      clock(240, 64, Math.PI * 2 * .985, lin(A.s12, A.s12 + .7, t));
      clock(240, 96, Math.PI * 2 * .82, lin(A.s12 + .3, A.s12e + .4, t), COOL);
    }
  }
  const cardU = (t) => eout(lin(A.s19 + .15, A.s19 + .75, t));
  function cardText(ctx, w, h) {
    X.quoteText(ctx, w, h, ['“Generative AI', 'without guardrails', 'can harm learning”'], 'BASTANI ET AL.  ·  PNAS 2025', { size: 12.4, x: 9, y: 17 });
  }

  // ---------------------------------------------------------------- group B: the plates (HINTS, NOT ANSWERS), the lamps, the rail
  const bWave = (d) => A.s16 + .4 + (4 - d.row) * .16 + (2 - d.col) * .07;
  const plateOf = (d, t) => (d === BD ? eout(lin(A.s15d + .1, A.s15d + .55, t)) : eout(lin(bWave(d) + .25, bWave(d) + .7, t)));
  const lampOf = (d, t) => (d.g === 'B' ? eout(lin(bWave(d), bWave(d) + .45, t)) : 0);
  const nameplate = (ctx, V, d, t) => X.nameplate(ctx, V, d, plateOf(d, t));
  const RAIL = X.RAIL_B;
  const railU = (t) => sm(lin(A.s17 - .3, A.s18e + .2, t));   // the guardrail rises on "Hints. Never answers."

  // ---------------------------------------------------------------- the frame
  function draw(ctx, t) {
    X.gcTick();
    const V = X.safeV(K.view3(cam(t)), null, [MGO]);   // the Go machine we pull out of keeps its raw sprite (its foot is under the camera)
    X.hall(ctx, t, V, { go: (cx, VV, G) => go(cx, VV, G, t) });
    // far → near (camera looks +z): the board, the class, the tutor scene, the exam rows 3–4, the Go pair, row 2, the doctors, rows 0–1
    X.rollingBoard(ctx, t, V, RB, { content: rbContent, seed: 12 });
    X.cardOn(ctx, t, V, CARD, { u: cardU(t), fill: (cx) => plate(cx, t, 'paper', { tone: 'cream' }), text: cardText });
    drawClass(ctx, t, V);
    drawTutor(ctx, t, V);
    const ex = (only) => K.examHall(ctx, t, V, { only, lampOf: (d) => lampOf(d, t), dot: 1, look: (d) => 'write', after: (cx, d) => { if (d.g === 'B') nameplate(cx, V, d, t); } });
    X.rail(ctx, V, RAIL, railU(t));
    ex((d) => d.row >= 3);
    drawGoPair(ctx, t, V);
    ex((d) => d.row === 2);
    drawDoctors(ctx, t, V);
    ex((d) => d.row <= 1);
    // screen layer: the source tag (Harvard)
    const su = Math.min(lin(A.s7h, A.s7h + .6, t), 1 - lin(A.s9e, A.s9e + .4, t));
    if (su > 0) K.tag(ctx, 'HARVARD  ·  PHYSICS  ·  KESTIN, MILLER ET AL.  ·  SCIENTIFIC REPORTS 2025', 72, 96, { u: su });
  }

  return [{ t: HI.b, tr: 'cut', d: .1, draw, print: HI.print }, {   // the first frames are inside the core (the plate): its finish, then ours
    t: HI.b + .2, tr: 'cut', d: .1, draw, print: PRINT,
    // sound hooks (BRIEF-builders §8): f = sfx-bibliothek/akzent/<f>.mp3. Ambience: atmo/hall.
    sound: [
      { f: 'glass_hum', t: HI.b + .2, v: .3 }, { f: 'stone_click', t: A.s5 + .2, v: .35 }, { f: 'chalk', t: A.s7 + .3, v: .35 },
      { f: 'brass_click', t: boxUp[0], v: .35 }, { f: 'brass_click', t: boxUp[2], v: .3 }, { f: 'chalk', t: A.s11t, v: .4 },
      { f: 'brass_click', t: A.s15d + .5, v: .45 }, { f: 'chime', t: A.s16 + .4, v: .35 }, { f: 'brass_click', t: A.s17, v: .35 }, { f: 'paper_slide', t: A.end - .5, v: .35 },
    ],
  }];
};
