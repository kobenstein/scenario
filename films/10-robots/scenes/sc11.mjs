// c11 · open hands, three questions, you are a teacher (03e rest, 04a start) · 560.90–612.74 · bright morning → low sun · ★ 11.15 (your hand guides the robot hand)
// Builder B3. Explainers ≈ 64 % (light on night). Starts on the c10 street (same drawing). Holds the film's one planned hard cut (SCHNITT #1, 600.74).
//
// | beat | time | anchor | picture | hero | moves | transition → carrier · position · direction |
// |---|---|---|---|---|---|---|
// | A EXPL | 560.90–564.90 | hands 561.14 · companies 563.94 | the street; over it three huge cool factories rise, cool lines run down into every house | the three | rise · lines | iris out of the middle house's window · centre · in |
// | B EXPL | 564.90–569.06 | Hugging 564.98 · plans 568.18 | a building plan unfolds, the arm draws itself in cream lines; on "plans" its parts lift off as light (`SO-101`) | the plan | unfold · draw · explode | one part drops into a printer · lower left |
// | C EXPL | 569.06–573.14 | print 569.38 · build 569.94 · dollars 572.02 | the part is printed layer by layer, the arm assembles, `from about ~$100` | the arm | print · assemble · counter | the arm steps left, three lamps at its base |
// | D/E EXPL | 573.14–582.34 | three 573.14 · other 577.38 · Earth 578.98 · taught 581.38 | three lamps; each lights and draws a line to a house, the Earth, the hall: three questions | lamps | lamp · line · question | lines draw back into the lamps |
// | F EXPL | 582.34–587.00 | want 583.38 · need 585.38 | all lamps on: the arm lifts a cup gently; a robot without lamps goes back into its box, lid closes | arm / box | lift · lid | world out of the cup: it becomes the sun · centre |
// | G 3D   | 587.00–596.40 | decide 588.78 · owns 591.66 · rules 593.74 | the valley in the morning, a fork: a tower on the left, a village on the right; the robot at the fork; a hand of light writes rules on the board | sun | crane down · threads · chalk | flight into the sun |
// | H 3D   | 596.40–600.74 | teacher 599.78 | out of the light into the hall: the trainer lifts the cup (centre) | window | lift · push to the cup | **SCHNITT #1** match cut on the lifted cup · same position · up |
// | I 3D   | 600.74–604.10 | Neo 601.54 · lives 603.22 | your living room: you lift the same cup at the same spot; the robot beside you mirrors; angle arcs at both arms | the cup | lift · mirror · arcs | world out of the cup · centre · in |
// | J ★ 3D | 604.10–606.66 | teachers 605.62 | close: your hand of light guides the robot hand round the cup; the trace grows warm at your fingers | hands | guide · trace | – |
// | K EXPL | 606.66–612.74 | back 608.34 · share 609.38 · vote 610.34 · switch 611.46 | the trace arcs back onto your hand; out of it: a share, a raised hand, an off switch | three signs | ignite on the words | → c12 (the curve over the valley) |
import * as B from '../lib/f10_c08_b3.mjs';
import sc10 from './sc10.mjs';
import { STREET } from './sc09.mjs';
import * as D1 from '../lib/f10_c01_draw.mjs';
import { Path2D, PathOp } from '@napi-rs/canvas';
const { E, P, M, W, H, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, quartIO, halo, trail, catmull } = B;
const { card, cam3, aim, camAt, camDrift, project, F0 } = E;
const snap = (u) => expoOut(u) * smooth(clamp(u / .25));
const capsule = (a, b, w) => { const p = new Path2D(); p.moveTo(a[0], a[1]); p.lineTo(b[0], b[1]); return p.stroke({ width: w, cap: 1, join: 1 }); };
const circ = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, 6.2832); return p; };

export default async (T, R) => {
  E.prepareEditorial();
  const w = B.wordAt(T);
  const A = {
    t0: R.a, hands: w('hands', 561.14), few: w('few', 563.46), companies: w('companies', 563.94), hugging: w('hugging', 564.98), arm: w('arm', 566.9), plans: w('plans', 568.18),
    print: w('print', 569.38), build: w('build', 569.94), yourself: w('yourself', 570.26), hundred: w('hundred', 571.7), dollars: w('dollars', 572.02),
    three: w('three', 573.14), robot: w('robot', 574.5), does1: w('does', 575.46), other: w('other', 577.38), does2: w('does', 578.1), earth: w('earth', 578.98), does3: w('does', 579.86), taught: w('taught', 581.38),
    if1: w('if', 582.34), want: w('want', 583.38), if2: w('if', 584.26), need: w('need', 585.38),
    but: w('but', 587.9), decide: w('decide', 588.78), robots: w('robots', 589.98), owns: w('owns', 591.66), writes: w('writes', 593.26), rules: w('rules', 593.74),
    and: w('and', 595.46), miss: w('miss', 596.86), trainer: w('trainer', 597.94), teacher: w('teacher', 599.78), cut: w('a', 600.74), neo: w('neo', 601.54), lives: w('lives', 603.22),
    that: w('that', 604.26), teachers: w('teachers', 605.62), ask: w('ask', 607.54), back: w('back', 608.34), share: w('share', 609.38), vote: w('vote', 610.34), off: w('off', 611.3), switch: w('switch', 611.46), b: R.b,
  };
  // c10 draws the street on (its words leave), A adds the factories over it
  const R10 = { a: w('built', 507.52), b: R.a };
  const c10 = (await sc10(T, R10))[0].draw;

  // ================= A / B / C / D-F: one explainer space (design = screen at s 1) =================
  const KW = [STREET.xs[3] + .21 * 150, STREET.y + .11 * 150];
  const FACT = [[520, 300, 250], [960, 250, 300], [1400, 300, 250]];
  const T_IB0 = A.companies + .55, T_IB1 = T_IB0 + .95;
  const SHEET = { x: 360, y: 190, w: 1200, h: 640 };
  // the arm (SO-101-like), by joint angles: base B0, shoulder, upper arm, forearm, wrist, gripper
  const B0 = [720, 760];
  const armAt = (a1, a2, a3, grip) => {
    const S = [B0[0], B0[1] - 96], El = [S[0] + Math.cos(a1) * 300, S[1] + Math.sin(a1) * 300], Wr = [El[0] + Math.cos(a2) * 260, El[1] + Math.sin(a2) * 260];
    const g = [Wr[0] + Math.cos(a3) * 92, Wr[1] + Math.sin(a3) * 92];
    const j1 = [g[0] + Math.cos(a3 - .5 - grip) * 18, g[1] + Math.sin(a3 - .5 - grip) * 18], j2 = [g[0] + Math.cos(a3 + .5 + grip) * 18, g[1] + Math.sin(a3 + .5 + grip) * 18];
    return { S, El, Wr, g, j1, j2, a3 };
  };
  const POSE0 = [-.95, .3, .55, .25], POSE_LIFT = [-1.25, -.25, .05, .05];
  // parts: [name, path fn(J), explode offset]
  const PARTS = [
    ['base', (J) => { const p = new Path2D(); p.roundRect(B0[0] - 120, B0[1] - 30, 240, 30, 8); return p; }, [0, 70]],
    ['turn', (J) => { const p = new Path2D(); p.roundRect(B0[0] - 62, B0[1] - 70, 124, 40, 10); return p; }, [0, 30]],
    ['upper', (J) => capsule(J.S, J.El, 54), [-40, -50]],
    ['fore', (J) => capsule(J.El, J.Wr, 44), [50, -80]],
    ['grip', (J) => { const a = capsule(J.Wr, J.g, 30), b = capsule(J.g, [J.g[0] + Math.cos(J.a3 - .35) * 70, J.g[1] + Math.sin(J.a3 - .35) * 70], 14), c = capsule(J.g, [J.g[0] + Math.cos(J.a3 + .35) * 70, J.g[1] + Math.sin(J.a3 + .35) * 70], 14); return a.op(b, PathOp.Union).op(c, PathOp.Union); }, [110, -40]],
  ];
  const JOINTS = (J) => [[J.S, 32], [J.El, 27], [J.Wr, 21]];
  const PRINTER = [470, 720];   // the 3D printer (bed centre)
  const T_SHEETOUT = A.print - .45;
  const LAMPS = [-70, 0, 70], QY = [330, 505, 680], QX = 1060;
  const QUEST = [[A.does1, A.other, 'house', 'good for people?'], [A.does2, A.earth, 'earth', 'good for the earth?'], [A.does3, A.taught, 'hall', 'fair to those who taught it?']];
  const ARMSHIFT = (t) => quartIO(span(t, A.three - .3, A.three + .7));   // the arm steps left for the questions
  const ARM_T = (t) => { const k = ARMSHIFT(t); return { dx: lerp(0, -260, k), s: lerp(1, .82, k) }; };
  const liftK = (t) => sineIO(span(t, A.want - .7, A.want + .5));
  const BOX = [1500, 760];
  // the arm's cup (F) as the carrier into G
  const cupF = (t) => { const k = liftK(t), J = armPose(t), tr = ARM_T(t); const x = B0[0] + (J.g[0] + Math.cos(J.a3) * 30 - B0[0]) * tr.s + tr.dx, y = B0[1] + (J.g[1] + Math.sin(J.a3) * 30 + 24 - B0[1]) * tr.s; return [x, y]; };
  function armPose(t) {
    const k = liftK(t), p = POSE0.map((v, i) => lerp(v, POSE_LIFT[i], k));
    return armAt(p[0] + Math.sin(t * .7) * .015, p[1] + Math.sin(t * .9 + 1) * .02, p[2], p[3]);
  }
  // ================= G: the fork =================
  const SUN = { Z: 9000, u: 960, v: 606, r: 110 }, BOARD = [1150, 905];
  const T_IG0 = A.need + .75, T_IG1 = T_IG0 + 1.1;
  const KG = [[T_IG0, cam3({ x: 0, y: -420, z: -500 })], [A.decide + .2, cam3({ x: 0, y: -300, z: -380 })], [A.robots - .1, cam3({ x: 0, y: -260, z: -340 })],
    [A.owns + .3, cam3({ x: 20, y: 0, z: 120 }), 'q'], [A.writes - .2, cam3({ x: 60, y: 10, z: 200 })], [A.rules + .7, cam3({ x: 150, y: 20, z: 330 }), 's'],
    [A.miss - .3, cam3({ x: 60, y: -20, z: 360 })], [A.miss + .6, aim(SUN.Z, SUN.u, SUN.v, 55), 'i']];
  const camG = (t) => camDrift(camAt(t, KG, SUN.Z), t, .5, 211);
  // ================= H: the hall (the trainer, not you) =================
  const T_HF = A.miss + .6;
  const WINC = [B.HALL.win.x + B.HALL.win.w / 2, 470];
  const liftH = (t) => sineIO(span(t, A.teacher - .35, A.cut + .9));
  const TR = B.HALL.du;
  const armOf = (lf) => [lerp(.18, 1.35, lf), lerp(.1, 2.55, lf)];
  const cupOfFig = (x, y, h, lf) => { const [s1, s2] = armOf(lf), el = [.098 + Math.sin(s1) * .17, -.74 + Math.cos(s1) * .17], hd = [el[0] + Math.sin(s2) * .155, el[1] + Math.cos(s2) * .155]; return [x + h * hd[0], y + h * (hd[1] - .04)]; };
  const CUT_SCREEN = [960, 500];
  const KH = [[T_HF, aim(F0, WINC[0], WINC[1], 52)], [T_HF + 1.6, cam3({ x: -40, y: 10, z: 90 }), 's'], [A.teacher - .2, cam3({ x: -60, y: 0, z: 170 })],
    [A.cut, aim(F0, ...cupOfFig(TR[0], TR[1], TR[2], liftH(A.cut)), 1.7, ...CUT_SCREEN), 'q']];
  const camH = (t) => camAt(t, KH);
  // ================= I: your living room =================
  const WALL = 2600, WIN = { x: 1250, y: 170, w: 400, h: 560 }, LDU = [820, 940, 330], LBOT = [1130, 905, 390];
  const liftI = (t) => t < A.lives - .4 ? liftH(t) : lerp(1, .35, sineIO(span(t, A.lives - .4, A.that - .05)));
  const robLift = (t) => liftI(t - .45) * smooth(span(t, A.cut + .2, A.cut + .9));
  const KI = [[A.cut, aim(F0, ...cupOfFig(LDU[0], LDU[1], LDU[2], liftI(A.cut)), 1.7, ...CUT_SCREEN)], [A.neo + .6, cam3({ x: 20, y: -30, z: 160 }), 's'], [A.that - .1, cam3({ x: 10, y: -10, z: 260 })]];
  const camI = (t) => camAt(t, KI);
  // ================= J ★ / K: the hands =================
  const T_IJ0 = A.that - .25, T_IJ1 = T_IJ0 + .85;
  const CUPC = [1054, 795], CUPS = 260;   // the close-up cup (base centre, height)
  const cupScreenI = (t) => { const c = camI(t), [x, y] = cupOfFig(LDU[0], LDU[1], LDU[2], liftI(t)); return project(c, F0, x, y); };
  const CJ0 = cupScreenI(T_IJ0 + .1);
  const KJ = [[T_IJ0, B.viewPut(CUPC[0], CUPC[1] - CUPS * .5, CJ0[0], CJ0[1], .3)], [T_IJ1 + .4, { s: 1, x: 960, y: 540 }, 'q', [CUPC[0], CUPC[1] - CUPS * .5]], [A.b + 1, { s: 1.06, x: 975, y: 530 }]];
  const vJ = (t) => B.vDrift(B.viewAt(t, KJ), t, .5, 231);
  const guide = (t) => sineIO(span(t, A.that + .2, A.teachers + .7));          // the cup's arc under your guiding hand
  const T_IK0 = A.share - .55, T_IK1 = T_IK0 + .9;

  const draw = (ctx, t) => {
    if (t < T_IB0) { c10(ctx, t); factories(ctx, t); return; }
    if (t < T_IB1) { c10(ctx, t); factories(ctx, t); B.iris(ctx, KW[0], KW[1], B.irisR(span(t, T_IB0, T_IB1), 12, KW[0], KW[1]), () => explB(ctx, t), { t }); return; }
    if (t < T_IG0) { B.fieldFill(ctx, { t }); explB(ctx, t); return; }
    if (t < T_IG1 + .2) {
      const c = camG(t), [qx, qy] = project(c, SUN.Z, SUN.u, SUN.v), [cx, cy] = cupF(t), m = smooth(span(t, T_IG0, T_IG1)), sx = lerp(cx, qx, m), sy = lerp(cy, qy, m);
      B.irisWorld(ctx, sx, sy, B.irisR(span(t, T_IG0, T_IG1), 8, sx, sy), () => fork(ctx, t, c), () => explB(ctx, t), { t }); return;
    }
    if (t < T_HF) { const c = camG(t); fork(ctx, t, c); E.lightFlood(ctx, smooth(span(t, T_HF - .9, T_HF))); return; }
    if (t < A.cut) { const c = camH(t); hall(ctx, t, c); E.lightFlood(ctx, 1 - smooth(span(t, T_HF, T_HF + .9))); return; }
    if (t < T_IJ0) { living(ctx, t, camI(t)); return; }
    if (t < T_IJ1 + .2) { const c = camI(t), [x, y] = cupScreenI(t); B.irisWorld(ctx, x, y, B.irisR(span(t, T_IJ0, T_IJ1), 20, x, y), () => hands(ctx, t), () => living(ctx, t, c), { t, c0: P.night1 }); return; }
    if (t < T_IK0) { hands(ctx, t); return; }
    if (t < T_IK1 + .2) { const [hx, hy] = backOfHand(t); hands(ctx, t); B.iris(ctx, hx, hy, B.irisR(span(t, T_IK0, T_IK1), 16, hx, hy), () => signs(ctx, t), { t }); return; }
    B.fieldFill(ctx, { t }); signs(ctx, t);
  };

  // ---------- A: three big cool factories over the street ----------
  function factories(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    FACT.forEach(([x, y, s], i) => {
      const k = snap(span(t, A.few - .45 + i * .12, A.companies + .3 + i * .12)), out = smooth(span(t, T_IB0 + .2, T_IB1)); if (k <= 0) return;
      E.icon(ctx, 'factory', x, y + (1 - k) * 120, s, t, { lit: 0, a: k * (1 - out * .6), dust: 0, seed: 200 + i });
      // cool lines down into every house: the hands come from here
      const lk = sineIO(span(t, A.companies - .2 + i * .1, A.companies + .5 + i * .1));
      if (lk > 0) STREET.xs.forEach((hx, j) => { if ((j + i) % 3) return; const pts = []; for (let q = 0; q <= 20; q++) { const f = q / 20; pts.push([lerp(x, hx, f), lerp(y + s * .45, STREET.y - 70, f) - Math.sin(Math.PI * f) * 30]); } B.coolLine(ctx, pts, lk, .55 * (1 - out)); });
    });
    ctx.restore();
  }
  // ---------- B / C / D-F: the plan, the print, the questions, the box ----------
  function sheetPath(u) {   // the plan unfolds from a strip: three panels
    const fw = SHEET.w * (.34 + .66 * u), x0 = SHEET.x + (SHEET.w - fw) / 2, p = new Path2D(); p.rect(x0, SHEET.y, fw, SHEET.h); return { p, x0, fw };
  }
  function explB(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const v = B.vDrift({ s: 1, x: 960, y: 540 }, t, .35, 221); B.applyView(ctx, v);
    // the sheet: unfolds on "Hugging Face", folds away before the print
    const un = quartIO(span(t, T_IB0 + .35, T_IB1 + .55)), gone = quartIO(span(t, T_SHEETOUT - .3, T_SHEETOUT + .45)), su = un * (1 - gone);
    if (su > 0) {
      const { p, x0, fw } = sheetPath(su);
      ctx.save(); ctx.globalAlpha = smooth(clamp(su * 3)); ctx.fillStyle = rgba(P.blue0, .55); ctx.fill(p);
      ctx.strokeStyle = rgba(P.cream, .5); ctx.lineWidth = 2; ctx.stroke(p);
      ctx.clip(p); ctx.strokeStyle = rgba(P.blue2, .55); ctx.lineWidth = 1;
      for (let x = SHEET.x; x < SHEET.x + SHEET.w; x += 40) { ctx.beginPath(); ctx.moveTo(x, SHEET.y); ctx.lineTo(x, SHEET.y + SHEET.h); ctx.stroke(); }
      for (let y = SHEET.y; y < SHEET.y + SHEET.h; y += 40) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + fw, y); ctx.stroke(); }
      ctx.strokeStyle = rgba(P.cream, .3); ctx.lineWidth = 2; for (const f of [1 / 3, 2 / 3]) { ctx.beginPath(); ctx.moveTo(x0 + fw * f, SHEET.y); ctx.lineTo(x0 + fw * f, SHEET.y + SHEET.h); ctx.stroke(); }
      ctx.restore();
    }
    // the arm: first cream lines drawn on the plan, then parts of light (exploded on "plans", printed, assembled)
    const drawU = span(t, T_IB1 + .2, A.plans - .2), ex = quartIO(span(t, A.plans - .15, A.plans + .7)) * (1 - quartIO(span(t, A.build - .1, A.yourself + .9)));
    const lightU = smooth(span(t, A.plans - .25, A.plans + .2));
    const tr = ARM_T(t), J = armPose(t);
    ctx.save(); ctx.translate(B0[0], B0[1]); ctx.scale(tr.s, tr.s); ctx.translate(-B0[0] + tr.dx / tr.s, -B0[1]);
    // the printed part: the forearm travels into the printer, prints, flies back
    const toPrinter = quartIO(span(t, A.print - .4, A.print + .15)), printed = span(t, A.print + .1, A.build + .45), back = quartIO(span(t, A.build + .2, A.yourself + .8));
    PARTS.forEach(([name, fn, off], i) => {
      let dx = off[0] * ex, dy = off[1] * ex;
      const path0 = fn(J);
      if (lightU < 1 && drawU > 0) { ctx.save(); ctx.strokeStyle = rgba(P.cream, .9 * (1 - lightU)); ctx.lineWidth = 2.4; ctx.setLineDash([2400 * clamp(drawU * 1.4 - i * .1), 1e5]); ctx.stroke(path0); ctx.restore(); }
      if (lightU <= 0) return;
      if (name === 'fore' && toPrinter > 0) {   // into the printer and back to its place
        const c0 = [(J.El[0] + J.Wr[0]) / 2 + dx, (J.El[1] + J.Wr[1]) / 2 + dy], pc = [PRINTER[0] - tr.dx / tr.s, PRINTER[1] - 60], k = toPrinter * (1 - back);
        const mx = lerp(c0[0], pc[0], k), my = lerp(c0[1], pc[1], k), rot = -Math.atan2(J.Wr[1] - J.El[1], J.Wr[0] - J.El[0]) * k;
        const p = new Path2D(); p.addPath(path0, rotM(rot, (J.El[0] + J.Wr[0]) / 2, (J.El[1] + J.Wr[1]) / 2, mx, my));
        if (printed < 1 && toPrinter >= 1 && back <= 0) E.fillWithLight(ctx, p, printed, t, { seed: 230 }); else E.lightShape(ctx, p, t, { lit: 1, a: lightU, dust: 0, seed: 230 });
        return;
      }
      const p = new Path2D(); p.addPath(path0, { a: 1, b: 0, c: 0, d: 1, e: dx, f: dy });
      E.lightShape(ctx, p, t, { lit: 1, a: lightU, dust: 0, seed: 231 + i });
    });
    // warm joint points
    if (lightU > 0) for (const [[jx, jy], r] of JOINTS(J)) { halo(ctx, jx, jy, r * 2.2, .5 * lightU, P.halo1, P.core0); ctx.fillStyle = rgba(P.core0, lightU); ctx.beginPath(); ctx.arc(jx, jy, r * .38, 0, 6.29); ctx.fill(); }
    // three lamps on the base (D–F)
    const la = smooth(span(t, A.three - .1, A.three + .5));
    if (la > 0) LAMPS.forEach((lx, i) => {
      const on = smooth(span(t, QUEST[i][0] - .1, QUEST[i][0] + .15)), x = B0[0] + lx, y = B0[1] - 15;
      if (on > 0) halo(ctx, x, y, 46, .8 * on, P.halo1, P.core0);
      ctx.fillStyle = mixHex(P.ind0, P.core1, on); ctx.globalAlpha = la; ctx.beginPath(); ctx.arc(x, y, 11, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1;
    });
    // F: the cup the arm lifts gently
    const ca = smooth(span(t, A.if1 - .3, A.if1 + .2));
    if (ca > 0) { const cx = J.g[0] + Math.cos(J.a3) * 30, cy = J.g[1] + Math.sin(J.a3) * 30 + 54; D1.cup(ctx, cx, cy, 60, { lit: liftK(t), a: ca }); }
    ctx.restore();
    // the printer (C)
    const pa = smooth(span(t, A.print - .55, A.print - .2)) * (1 - smooth(span(t, A.yourself + .6, A.yourself + 1.1)));
    if (pa > 0) printer(ctx, t, pa, printed, toPrinter >= 1 && back <= 0);
    // the counter (C)
    const cu = span(t, A.hundred - .6, A.dollars + .1), co = 1 - smooth(span(t, A.three - .4, A.three));
    if (cu > 0 && co > 0) {
      ctx.save(); ctx.globalAlpha = co;
      B.write(ctx, 'from about', 1420, 400, span(t, A.hundred - .7, A.hundred - .1), { size: B.SZ.small, col: P.halo2, glow: false });
      E.counter(ctx, t, { x: 1420, y: 540, to: 100, u: cu, pre: '$', size: 150 });
      ctx.restore();
    }
    // the questions (D–E): a line from each lamp to its picture, then the words
    const qOut = smooth(span(t, A.want + .2, A.if2 + .1));
    QUEST.forEach(([on, at, kind, q], i) => {
      const lk = sineIO(span(t, on + .05, on + .75)) * (1 - quartIO(span(t, A.if1 - .05, A.if1 + .55))), ia = smooth(span(t, on + .5, on + .9)) * (1 - qOut);
      const lamp = [B0[0] + (LAMPS[i]) * tr.s + tr.dx, B0[1] - 15 * tr.s], ic = [QX - 90, QY[i]];
      if (lk > 0) trail(ctx, catmull([[lamp[0], lamp[1], 3], [lerp(lamp[0], ic[0], .45), lerp(lamp[1], ic[1], .2) - 40, 3], [ic[0] - 70, ic[1], 3]], 14), lk, { w: 3 });
      if (ia > 0) {
        const lit = smooth(span(t, at - .3, at + .2));
        if (kind === 'house') E.icon(ctx, 'house', ic[0], ic[1], 104, t, { lit, a: ia, dust: 0, seed: 241 });
        if (kind === 'earth') earth(ctx, ic[0], ic[1], 96, t, lit, ia);
        if (kind === 'hall') { E.icon(ctx, 'factory', ic[0], ic[1], 104, t, { lit: .2 + .8 * lit, a: ia, dust: 0, seed: 243 }); for (let k = 0; k < 3; k++) { const hk = smooth(span(t, at - .2 + k * .1, at + .3 + k * .1)) * ia; if (hk > 0) E.icon(ctx, 'hand', ic[0] - 30 + k * 30, ic[1] + 70, 34, t, { lit: 1, a: hk, dust: 0, seed: 250 + k }); } }
        B.write(ctx, String(i + 1), QX, QY[i] + 22, span(t, on + .55, on + 1), { serif: true, size: 76, align: 'center', a: 1 - qOut });
        B.write(ctx, q, QX + 50, QY[i] + 18, span(t, at - .55, at + .1), { serif: true, size: 58, align: 'left', a: 1 - qOut });
      }
    });
    // F: a robot without lamps goes back into its box; the lid closes on "need"
    const ba = smooth(span(t, A.if2 - .5, A.if2)) * (1 - smooth(span(t, T_IG0 + .3, T_IG0 + .8)));
    if (ba > 0) {
      const down = sineIO(span(t, A.if2 + .1, A.need - .1)), lid = snap(span(t, A.need - .1, A.need + .35));
      ctx.save(); ctx.globalAlpha = ba;
      ctx.save(); const clipR = new Path2D(); clipR.rect(BOX[0] - 300, 0, 600, BOX[1] - 4); ctx.clip(clipR);
      E.icon(ctx, 'robot', BOX[0], BOX[1] - 120 + down * 190, 220, t, { lit: .3, dust: 0, seed: 260, a: 1 }); ctx.restore();
      const box = new Path2D(); box.moveTo(BOX[0] - 120, BOX[1] - 10); box.lineTo(BOX[0] - 110, BOX[1] + 110); box.lineTo(BOX[0] + 110, BOX[1] + 110); box.lineTo(BOX[0] + 120, BOX[1] - 10);
      ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke(box);
      ctx.translate(BOX[0] + 122, BOX[1] - 10); ctx.rotate(-(1 - lid) * 1.9); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-244, 0); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    // header (B)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const ha = smooth(span(t, T_IB1 - .2, T_IB1 + .3)) * (1 - smooth(span(t, A.three - .5, A.three)));
    if (ha > 0) {
      B.write(ctx, 'so-101', 150, 150, span(t, A.hugging - .1, A.hugging + .5), { size: 52, align: 'left', spacing: .2, a: ha });
      B.write(ctx, 'open plans · hugging face', 153, 200, span(t, A.arm - .3, A.arm + .3), { size: B.SZ.small, align: 'left', col: P.halo2, glow: false, a: ha });
    }
    ctx.restore();
  }
  function rotM(r, cx, cy, tx, ty) { const c = Math.cos(r), s = Math.sin(r); return { a: c, b: s, c: -s, d: c, e: tx - (c * cx - s * cy), f: ty - (s * cx + c * cy) }; }
  function printer(ctx, t, a, printed, printing) {
    const [x, y] = PRINTER, w = 300, h = 300;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - w / 2, y + 20); ctx.lineTo(x - w / 2, y - h); ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y + 20); ctx.moveTo(x - w / 2 - 20, y + 20); ctx.lineTo(x + w / 2 + 20, y + 20); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - w / 2 + 30, y - 4); ctx.lineTo(x + w / 2 - 30, y - 4); ctx.stroke();   // the bed
    // the head runs left/right over the layer it prints
    const hy = lerp(y - 20, y - 110, printing ? printed : 0), hx = x + Math.sin(t * 9) * 110 * (printing ? 1 : .2);
    ctx.beginPath(); ctx.moveTo(x - w / 2, hy - 30); ctx.lineTo(x + w / 2, hy - 30); ctx.stroke();
    const head = new Path2D(); head.moveTo(hx - 22, hy - 44); head.lineTo(hx + 22, hy - 44); head.lineTo(hx + 8, hy - 16); head.lineTo(hx, hy - 8); head.lineTo(hx - 8, hy - 16); head.closePath();
    E.lightShape(ctx, head, t, { lit: 1, dust: 0, seed: 270 });
    if (printing && printed > 0 && printed < 1) halo(ctx, hx, hy - 6, 18, .8, P.halo1, P.core0);
    ctx.restore();
  }
  function earth(ctx, x, y, s, t, lit, a) {
    const p = circ(x, y, s * .45), lf = new Path2D(); lf.moveTo(x, y - s * .44); lf.quadraticCurveTo(x + s * .3, y - s * .82, x + s * .36, y - s * .52); lf.quadraticCurveTo(x + s * .12, y - s * .42, x, y - s * .44);
    E.lightShape(ctx, p.op(lf, PathOp.Union), t, { lit: .2 + .8 * lit, a, dust: 0, seed: 242 });
    if (lit > 0) { ctx.save(); ctx.globalAlpha = a * lit; ctx.strokeStyle = M.leafLit; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, s * .45 + 4, Math.PI * .1, Math.PI * .9); ctx.stroke(); ctx.fillStyle = M.leafLit; ctx.fill(lf); ctx.restore(); }
  }
  // ---------- G: the fork in the morning valley ----------
  function fork(ctx, t, c) {
    card(ctx, c, 40000, () => B.morningSky(ctx, 1, 640, { t }));
    card(ctx, c, SUN.Z, () => {
      B.sun(ctx, SUN.u, SUN.v, SUN.r, t, { rays: true, dust: 2500 });
      B.hill(ctx, [[-900, 646], [200, 632], [960, 642], [1700, 628], [2900, 640]], { c0: mixHex(B.M.leaf0, P.ind0, .4), c1: P.ind0, rim: rgba(P.halo1, .5) });
      // the tower (left): tall, closed, cold slits
      ctx.fillStyle = lin(ctx, 330, 0, 500, 0, [[0, P.night1], [1, mixHex(P.ind0, P.blue1, .3)]]); ctx.fillRect(340, 170, 150, 470);
      ctx.fillStyle = rgba(P.halo1, .6); ctx.fillRect(488, 170, 2, 470);
      for (let i = 0; i < 9; i++) { ctx.fillStyle = rgba(M.cyan, .55 + .25 * Math.sin(t * .8 + i)); ctx.fillRect(372, 210 + i * 46, 86, 5); }
      // the village (right): houses with warm windows
      [[1330, 640, 90, 70], [1440, 642, 110, 84], [1560, 638, 80, 64], [1650, 641, 120, 78], [1770, 640, 84, 60]].forEach(([x, y, ww, hh], i) => B.house(ctx, x, y, ww, hh, { win: .9, wx: (i % 2 ? -.12 : .12), light: 1, c0: P.night1, c1: mixHex(P.ind0, P.blue1, .25) }));
    });
    card(ctx, c, 4000, () => B.hill(ctx, [[-900, 700], [300, 688], [960, 700], [1700, 684], [2900, 696]], { c0: mixHex(B.M.leaf1, P.ind1, .45), c1: P.night1, rim: rgba(B.M.leafLit, .55) }));
    card(ctx, c, F0, () => {
      B.hill(ctx, [[-700, 790], [400, 776], [960, 786], [1600, 772], [2700, 786]], { c0: mixHex(B.M.leaf1, P.ind1, .35), c1: P.night0, rim: rgba(B.M.leafLit, .7), rimW: 3 });
      // the path: from the front up to the fork, then left (tower) and right (village)
      const path = new Path2D();
      path.moveTo(840, 1200); path.quadraticCurveTo(930, 950, 950, 870); path.quadraticCurveTo(760, 820, 520, 790); path.lineTo(560, 788); path.quadraticCurveTo(800, 812, 960, 852);
      path.quadraticCurveTo(1150, 812, 1380, 786); path.lineTo(1420, 788); path.quadraticCurveTo(1180, 826, 990, 872); path.quadraticCurveTo(1010, 960, 1090, 1200); path.closePath();
      ctx.fillStyle = lin(ctx, 0, 790, 0, 1200, [[0, rgba(P.halo1, .5)], [.4, rgba(P.halo2, .28)], [1, rgba(P.shade0, .2)]]); ctx.fill(path);
      // the robot at the fork
      const rb = [975, 905, 300];
      E.castShadow(ctx, rb[0], rb[1], 60, 220, 1.75, .5);
      E.robot(ctx, rb[0], rb[1], rb[2], { dir: 1, light: 1, rim: P.halo0, body: P.night1, hand: 'hand' });
      // "whoever owns them": two threads from the robot, a cool one to the tower and a warm one to the village
      const ow = sineIO(span(t, A.owns - .5, A.owns + .6));
      if (ow > 0) {
        const from = [rb[0], rb[1] - rb[2] * .7];
        B.coolLine(ctx, catmull([[from[0] - 20, from[1], 2], [700, 560, 2], [470, 420, 2]], 16), ow, .8);
        trail(ctx, catmull([[from[0] + 20, from[1], 2.5], [1250, 600, 2.5], [1500, 560, 2.5]], 16), ow, { w: 2.5 });
      }
      // the board, and a hand of light writes the rules on it (chalk scribble)
      ctx.fillStyle = mixHex(P.night1, P.ind0, .4); ctx.fillRect(BOARD[0] + 70, BOARD[1] - 170, 10, 170);
      const bd = new Path2D(); bd.roundRect(BOARD[0] - 10, BOARD[1] - 290, 170, 120, 8); ctx.fillStyle = mixHex(P.night1, P.ind0, .6); ctx.fill(bd);
      ctx.save(); ctx.clip(bd); ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 3; ctx.translate(-2, 2); ctx.stroke(bd); ctx.restore();
      const wr = span(t, A.writes - .1, A.rules + .9);
      if (wr > 0) {
        const pts = []; for (let i = 0; i <= 90; i++) { const f = i / 90, line = Math.floor(f * 3), lf = f * 3 - line; pts.push([BOARD[0] + 14 + lf * 126 + Math.sin(lf * 40 + line) * 4, BOARD[1] - 262 + line * 34 + Math.sin(lf * 23 + line * 2) * 6, 2.2]); }
        const n = Math.max(2, Math.floor(wr * pts.length));
        ctx.save(); ctx.strokeStyle = rgba(P.cream, .9); ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i < n; i++) { const [x, y] = pts[i], br = i % 30 === 0; br ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
        const [hx, hy] = pts[n - 1], ha = smooth(span(wr, 0, .15)) * (1 - smooth(span(wr, .85, 1)));
        if (ha > 0) { const ht = E.handTip({ pose: 'point' }, 0), m0 = E.handMatrix(0, 0, -2.2, 120, 1), [ox, oy] = E.applyM(m0, ...ht); E.lightHand(ctx, E.handMatrix(hx - ox, hy - oy, -2.2, 120, 1), t, { pose: 'point', a: ha, dust: 1500 }); }
      }
    });
    card(ctx, c, 1100, () => { ctx.save(); ctx.filter = 'blur(8px)'; ctx.fillStyle = rgba(P.night0, .85); for (let i = 0; i < 8; i++) { const x = 1700 + i * 40; ctx.beginPath(); ctx.moveTo(x, 1250); ctx.quadraticCurveTo(x - 30, 1000, x - 60 + Math.sin(t * .6 + i) * 6, 880 - (i % 3) * 50); ctx.lineTo(x + 30, 1250); ctx.fill(); } ctx.restore(); });
  }
  // ---------- H: the hall: the trainer lifts the cup ----------
  function hall(ctx, t, c) {
    const lf = liftH(t);
    B.hallScene(ctx, c, t, {
      du: false, rob: liftH(t - .35), robCup: true,
      extra: (x) => { E.person(x, TR[0], TR[1], TR[2], { dir: 1, light: 1, rim: rgba(P.halo1, .85), headset: true, cup: 'R', armR: armOf(lf), armL: [-.1, -.04], look: .2 + .4 * lf }); },
    });
  }
  // ---------- I: your living room: you lift the same cup ----------
  function living(ctx, t, c) {
    card(ctx, c, 40000, () => { ctx.fillStyle = P.night1; ctx.fillRect(-W, -H, 3 * W, 3 * H); });
    card(ctx, c, WALL, () => {
      ctx.fillStyle = lin(ctx, 0, -200, 0, 780, [[0, P.night1], [.6, P.ind0], [1, P.ind1]]); ctx.fillRect(-W, -H, 3 * W, H + 781);
      ctx.fillStyle = rad(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h * .6, 1100, [[0, rgba(P.blue0, .95)], [.45, rgba(P.blue0, .4)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-W, -H, 3 * W, H + 780);
      E.lightForm(ctx, 'window', WIN.x, WIN.y, WIN.w, WIN.h, t, { mullions: [2, 3], dust: 3000, seed: 33, breath: .01 });
      ctx.fillStyle = mixHex(P.night1, P.ind0, .3); ctx.fillRect(250, 430, 260, 12); ctx.fillRect(300, 380, 40, 50); ctx.fillRect(360, 400, 28, 30);
    });
    card(ctx, c, F0, () => {
      ctx.fillStyle = lin(ctx, 0, 780, 0, H, [[0, P.ind1], [.25, P.ind0], [1, P.night0]]); ctx.fillRect(-W, 780, 3 * W, H * 2);
      E.lightPool(ctx, WIN.x + 20, WIN.x + WIN.w - 20, 784, 220, 340, .85);
      const sofa = new Path2D(); sofa.roundRect(90, 700, 420, 140, 34); const seat = new Path2D(); seat.roundRect(70, 790, 460, 90, 26); const sp = sofa.op(seat, PathOp.Union);
      ctx.fillStyle = lin(ctx, 70, 0, 530, 0, [[0, P.night1], [1, mixHex(P.ind1, P.blue1, .4)]]); ctx.fill(sp);
      ctx.save(); ctx.clip(sp); ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 4; ctx.translate(-3, 2); ctx.stroke(sp); ctx.restore();
      const lf = liftI(t), rl = robLift(t);
      E.castShadow(ctx, LBOT[0], LBOT[1], 70, 260, 2.5, .5);
      const rh = E.robot(ctx, LBOT[0], LBOT[1], LBOT[2], { dir: -1, light: -1, rim: P.halo0, body: P.night1, hand: 'hand', armR: [lerp(.2, 1.35, rl), lerp(.1, 2.55, rl)], armL: [-.08, -.03] });
      E.du(ctx, LDU[0], LDU[1], LDU[2], { dir: 1, light: 1, back: .2, cup: 'R', armR: armOf(lf), armL: [-.1, -.04], look: .2 + .3 * lf });
      // angle arcs at both arms ("learns from the home it lives in")
      const ar = smooth(span(t, A.lives - .5, A.lives + .2)) * (1 - smooth(span(t, T_IJ0, T_IJ0 + .4)));
      if (ar > 0) {
        const arc = (x, y, r, a0, a1) => { ctx.save(); ctx.strokeStyle = rgba(P.core1, .9 * ar); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, r, a0, a1, a1 < a0); ctx.stroke(); ctx.restore(); halo(ctx, x, y, r * .6, .3 * ar, P.halo1, P.core0); };
        const [s1] = armOf(lf), sh = [LDU[0] + .098 * LDU[2], LDU[1] - .74 * LDU[2]];
        arc(sh[0], sh[1], 34, Math.PI / 2, Math.PI / 2 - s1);
        const rs = [LBOT[0] - .175 * LBOT[2], LBOT[1] - .79 * LBOT[2]], r1 = lerp(.2, 1.35, rl);
        arc(rs[0], rs[1], 44, Math.PI / 2, Math.PI / 2 + r1);
      }
    });
  }
  // ---------- J ★ / K: your hand of light guides the robot hand round the cup; the trace ----------
  // the close-up (design ≈ screen): the robot hand grips the cup from the left; your hand of light comes from the upper right,
  // its index fingertip rests on the back of the robot hand and guides it: the cup travels a small arc
  const HO = { pose: 'point' }, HT = E.handTip(HO, 0), HL = 175, RS = 300;
  const handState = (t) => {
    const g = guide(t), wr = [700 + g * 220 + Math.sin(g * Math.PI) * 30, 650 - Math.sin(g * Math.PI * .5) * 140 + Math.sin(t * .9) * 2], ang = lerp(-.04, -.16, g);
    const R = (u, v) => [wr[0] + Math.cos(ang) * u * RS - Math.sin(ang) * v * RS, wr[1] + Math.sin(ang) * u * RS + Math.cos(ang) * v * RS];
    const grip = R(.62, .05), cupX = grip[0] + 168, cupY = grip[1] + 130, touch = R(.42, -.25);
    const a = 1.0 - g * .1, m0 = E.handMatrix(0, 0, a, HL, 1), [ox, oy] = E.applyM(m0, ...HT);
    const hm = E.handMatrix(touch[0] - ox, touch[1] - oy, a, HL, 1);
    return { g, ang, cupX, cupY, wr, touch, hm, back: E.applyM(hm, .5, 0) };
  };
  function backOfHand(t) { const s = handState(t); return B.viewToScreen(vJ(t), s.back[0], s.back[1]); }
  function hands(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    E.nightSky(ctx, [[0, P.night0], [.5, P.night1], [1, P.ind0]]);
    ctx.fillStyle = rad(ctx, 1380, 360, 1300, [[0, rgba(P.blue0, 1)], [.4, rgba(P.blue0, .5)], [.8, rgba(P.ind1, .2)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(0, 0, W, H);
    E.stars(ctx, 5, 90, t, [0, 0, W, H * .8], .5);
    const v = vJ(t); B.applyView(ctx, v);
    const s = handState(t), warm = smooth(span(t, A.teachers - .5, A.teachers + .3));
    D1.cup(ctx, s.cupX, s.cupY, CUPS, { lit: warm });
    D1.robotHand(ctx, s.wr[0], s.wr[1], RS, s.ang, { curl: .3, spread: .12, thumb: .55, forearm: 380, body: mixHex(P.ind1, P.blue1, .35), rim: mixHex(P.halo1, P.core1, warm), light: 1 });
    // the trace: warm, it grows where your fingertip touches, along the guided arc
    const pts = []; for (let i = 0; i <= 40; i++) { const q = handState(lerp(A.that + .15, Math.min(t, A.teachers + .9), i / 40)); pts.push([q.touch[0], q.touch[1], 3.5]); }
    if (t > A.that + .3) trail(ctx, pts, 1, { w: 3.5, spark: t < A.teachers + .9 });
    // "something back": the trace arcs back onto the back of your hand
    const back = span(t, A.ask - .3, A.back + .1);
    if (back > 0) { const tip = pts[pts.length - 1], hb = s.back; trail(ctx, catmull([[tip[0], tip[1], 3.5], [lerp(tip[0], hb[0], .3) + 120, Math.min(tip[1], hb[1]) - 120, 3.5], [hb[0], hb[1], 3.5]], 20), sineIO(back), { w: 3.5 }); }
    E.lightHand(ctx, s.hm, t, { ...HO, a: 1, dust: 6000 });
    const tk = smooth(span(t, A.that - .1, A.that + .3)); halo(ctx, s.touch[0], s.touch[1], 60 * tk, .9 * tk, P.halo1, P.core0);
    if (back >= 1) halo(ctx, s.back[0], s.back[1], 90, .8, P.halo1, P.core0);
    ctx.restore();
  }
  // ---------- K: a share · a vote · an off switch ----------
  function signs(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const v = B.vDrift({ s: 1, x: 960, y: 540 }, t, .3, 241); B.applyView(ctx, v);
    const X = [520, 960, 1400], at = [A.share, A.vote, A.switch];
    X.forEach((x, i) => {
      const ex = expoIn(span(t, A.b + .1 + i * .08, A.b + .8 + i * .08));   // c12: they shrink into points and leave downward
      const g = snap(span(t, T_IK1 - .4 + i * .12, T_IK1 + .3 + i * .12)) * (1 - ex), on = smooth(span(t, at[i] - .2, at[i] + .2)); if (g <= .01) return;
      const Y = 480 + expoIn(span(t, A.b + .1 + i * .08, A.b + .8 + i * .08)) * 260;
      if (i === 0) B.shares(ctx, x, Y, 110 * g, t, { n: 13, u: g, hi: 12, hk: on, a: .45 + .55 * Math.max(on, .3), dust: 0 });
      if (i === 1) E.icon(ctx, 'hand', x, Y - 20 * on, 230 * g, t, { lit: on, a: .5 + .5 * g, dust: 0, seed: 280 });
      if (i === 2) toggle(ctx, x, Y, 150 * g, t, on);
      B.write(ctx, ['a share', 'a vote', 'an off switch'][i], x, Y + 230 + ex * 200, span(t, at[i] - .25, at[i] + .3), { size: B.SZ.label, a: 1 - smooth(clamp(ex * 2)) });
    });
    ctx.restore();
  }
  function toggle(ctx, x, y, s, t, on) {   // an off switch: a rounded track, the knob slides under your thumb
    const tr = new Path2D(); tr.roundRect(x - s, y - s * .42, s * 2, s * .84, s * .42);
    E.lightShape(ctx, tr.stroke({ width: s * .08, cap: 1, join: 1 }), t, { lit: on, dust: 0, seed: 290 });
    const kx = lerp(x + s * .55, x - s * .55, sineIO(on)), kb = circ(kx, y, s * .3);
    E.lightShape(ctx, kb, t, { lit: 1, dust: 0, seed: 291 });
  }

  return [{ t: R.a, draw, print: { editorial: true }, sound: [
    { f: 'paper_slide', t: T_IB1 - .2, v: .2 }, { f: 'spark_tick', t: A.plans, v: .15 }, { f: 'tick', t: A.does1, v: .15 }, { f: 'tick', t: A.does2, v: .15 }, { f: 'tick', t: A.does3, v: .15 },
    { f: 'door', t: A.need, v: .15 }, { f: 'chalk', t: A.writes, v: .2 }, { f: 'whoosh_up', t: A.miss - .2, v: .15 }, { f: 'clink', t: A.teacher + .1, v: .15 }, { f: 'shimmer_rings', t: A.teachers - .3, v: .2 }, { f: 'lever_switch', t: A.switch, v: .18 },
  ] }];
};
