// c13 · B3 · 'So is yours the first' → the end (ANCHOR 3/4 punchline, the plain question, ★ ANCHOR 4/4 the Kernsatz, subscribe 2, the
// 4 s quiet walk and S.endScreen for the last 15 s). Starts with the one planned hard cut of the group (W E.01): the bead of THE ANSWER
// (c12, screen centre) → the blank after the dash on the stone at the same spot.
//
// | ID   | anchor (phrase)                  | zeigt wörtlich                                                      | layer  | carrier out         |
// |------|----------------------------------|---------------------------------------------------------------------|--------|---------------------|
// | E.01 | So is yours the first            | ANCHOR 3: the stone; in the blank after the dash: 2032 … 2459         | ANCHOR | the blank (W in)    |
// | E.02 | The honest answer is a range     | the two years pull apart into a range bar on the stone              | MIX    | the range           |
// | E.03 | The estimates run                | the world sinks; the range lands on the lifeline: THE NEXT DECADE … FOUR CENTURIES | EXPL | the line   |
// | E.04 | And neither the repair           | REPAIR and COPY grow out of the line, you between: IN A HUMAN: NOT YET | MIX  | the end tick        |
// | E.05 | But something has already changed| the AI ring rises, its beam on the end tick                         | MIX    | the end tick        |
// | E.06 | With A.I., death has moved       | the end tick lifts out of WE ACCEPT and slides into WE WORK ON      | EXPL   | the columns         |
// | E.07 | And what we work on              | a new line grows; you walk ahead of its head and look back          | MIX    | the line's head     |
// | E.08–E.10 | Do we want this · What does it do to a life · Who gets it | the three questions, one after another | EXPL | the answer   |
// | E.11 | If you could stop dying          | THE ANSWER, plain, lifts out of the line; the bead rests in the middle | EXPL | the bar → the dash |
// | E.12★| Every generation before us       | ANCHOR 4: the world rises again, the bar becomes the dash, the bead the crack's light; the old stones light one by one | ANCHOR | the stones |
// | E.13 | We are the first                 | your stone "1985 –", the blank open, the crack wide; you look up    | ANCHOR | the stone           |
// | A.01 | That's what this channel is for  | subscribe 2: the camera pulls back slowly, the town lights below    | ANCHOR | the hill            |
// | A.02 | Want that too · Then subscribe   | a cream SUBSCRIBE tag rises on the hill; 4 s quiet                  | ANCHOR | the end screen      |
// | E.14 | (end screen)                     | S.endScreen (lead)                                                  | ANCHOR |                     |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f73_kit.mjs';
import * as S from '../lib/f73_world.mjs';
import * as X from '../lib/f73_stage.mjs';
import * as B from '../lib/b3_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, SOURCES: SRC } = F;
const PR = F.PRINT73, EG = S.ENGRAVE, ST = S.STONE, LY = 700;
const BLANK = [(EG.blank[0] + EG.blank[1]) / 2, EG.y - 20];
const YRS = [SRC.y2032, SRC.y2459];
const CARVED = mixHex(P.night0, P.ind1, .4);

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .5);
  const A = {
    so: R.a, honest: G('The honest answer'), est: G('The estimates run'), decade: G('the next decade'), cent: G('four centuries'),
    neither: G('And neither the repair'), human: G('single human being'), but: G('But something has already changed'), moved: G('death has moved'),
    accept: G('the things we accept'), workon: G('the things we work on'), and: G('And what we work on'), before: G('before it works'),
    q1: G('Do we want this'), q2: G('What does it do to a life'), q3: G('Who gets it'), stop: G('If you could stop dying'), every: G('Every generation before us'),
    given: G('was given the answer'), first: G('We are the first'), asked: G('to be asked the question'), chan: G("That's what this channel is for"),
    yours: G('the answer stays yours'), want: G('Want that too'), sub: G('Then subscribe'),
  };
  const tEnd = T.duration - 15;
  const EV = S.END_VIEW;
  const VK = [
    [R.a, { x: BLANK[0], y: 546, s: 1.15 }], [A.honest + .3, { x: 1480, y: 560, s: 1.2 }], [A.est + 1.8, { x: 960, y: 600, s: 1.0 }],
    [A.neither + 1, { x: 980, y: 580, s: .98 }], [A.but + 1, { x: 1060, y: 560, s: .96 }], [A.moved + 1, { x: 960, y: 540, s: 1.0 }],
    [A.and + 1.5, { x: 1000, y: 560, s: 1.0 }], [A.q2, { x: 1180, y: 560, s: 1.02 }], [A.stop + .6, { x: 1410, y: 545, s: 1.04 }],
    [A.every + 1.9, { x: 1160, y: 610, s: .8 }], [A.first + 1.6, { x: 1320, y: 575, s: 1.0 }], [A.chan + 1, { x: 1330, y: 590, s: .95 }],
    [tEnd, EV], [tEnd + 1, { ...EV, s: EV.s * (1 - .0045) }],
  ];
  const view = (t) => B.viewOf(t, VK, false);
  const PK = [[A.est, [1440, 560, .85]], [A.est + 1.8, [960, 560, .8]], [A.but, [1200, 520, .8]], [A.moved, [960, 480, .8]], [A.and + 1, [1100, 600, .8]], [A.stop, [1350, 560, .8]], [A.every - .3, [1440, 560, .55]], [A.every + 1.2, [1440, 560, .85]]];
  const pool = (t) => { let i = 0; while (i < PK.length - 2 && t > PK[i + 1][0]) i++; const [t0, a] = PK[i], [t1, b] = PK[i + 1], u = sineIO(span(t, t0, t1)); return a.map((x, j) => lerp(x, b[j], u)); };

  const ret1 = (t) => B.ease(t, A.est, A.est + 1.8);                   // E.03: the world sinks
  const ret2 = (t) => 1 - B.ease(t, A.every - .3, A.every + 1.2);            // E.12: the world rises again
  const stoneRot = (c) => { c.translate(ST.x, ST.base); c.rotate(ST.rot); c.translate(-ST.x, -ST.base); };

  // E.01–E.03: the two years: ghosts in the blank → a range bar on the stone → the ends of a stretch of the lifeline
  const RB = [[1262, 676], [1540, 676]], RL = [[560, LY], [1460, LY]];
  function years(c, t, s, ret) {
    const pa = B.ease(t, A.honest - .1, A.honest + 1.3, quartIO), dr = B.ease(t, A.est - .1, A.est + 1.5, quartIO);
    const gh = [[BLANK[0], EG.y - 46], [BLANK[0], EG.y + 42]];
    for (let i = 0; i < 2 && t >= A.honest - .05; i++) {
      const p0 = gh[i], p1 = RB[i], p2 = [RL[i][0], RL[i][1] + 16 + 34 * 1.05], q = [lerp(p0[0], p1[0], pa), lerp(p0[1], p1[1], pa)];
      const p = B.quad(q, [lerp(q[0], p2[0], .5), Math.min(q[1], p2[1]) - 120], p2, dr), size = lerp(lerp(54, 44, pa), 34, dr);
      const out = span(t, A.neither - .2, A.neither + .5);
      c.save(); if (dr < 1) { c.translate(ST.x, ST.base); c.rotate(ST.rot * (1 - dr)); c.translate(-ST.x, -ST.base); }
      F.goldText(c, [[YRS[i], lerp(.7, .4, dr)]], p[0], p[1], size, F.rise(1 - out), { serif: true, align: 'center', glow: dr < .5 });
      c.restore();
    }
    // the range bar: grows from the middle on the stone, then drops onto the line and stretches
    const bu = span(t, A.honest + .4, A.honest + 1.4); if (bu <= 0) return;
    const x0 = lerp(lerp(RB[0][0] + 40, RB[1][0] - 40, .5), RB[0][0] + 40, sineIO(bu)), x1 = lerp(lerp(RB[0][0] + 40, RB[1][0] - 40, .5), RB[1][0] - 40, sineIO(bu));
    const a0 = [lerp(x0, RL[0][0], dr), lerp(RB[0][1] - 40, LY, dr)], a1 = [lerp(x1, RL[1][0], dr), lerp(RB[1][1] - 40, LY, dr)], out = B.ease(t, A.neither - .3, A.neither + .8);
    if (out < 1) { c.save(); if (dr < 1) { c.translate(ST.x, ST.base); c.rotate(ST.rot * (1 - dr)); c.translate(-ST.x, -ST.base); }
      F.goldSpan(c, [a0, a1], 0, 1, { w: (5 + 3 * dr * (1 - out)) / s, a: 1 - out, spark: false }); c.restore(); }
    X.label(c, SRC.range[0], RL[0][0], LY - 50, B.lab(t, A.decade - .05, A.neither + .2), { size: 28, gold: .4 });
    X.label(c, SRC.range[1], RL[1][0], LY - 50, B.lab(t, A.cent - .05, A.neither + .2), { size: 28, gold: .4 });
  }
  // the stage (E.03 → E.11)
  function stage(c, t, s) {
    const lineU = span(t, A.est + .5, A.est + 1.8), lineOut = B.ease(t, A.moved + .5, A.moved + 1.4, quartIO);
    if (lineU > 0 && lineOut < 1) { c.save(); c.translate(0, lineOut * 120); X.lifeline(c, t, 160, 1760, LY, s, { u: lineU, from: 1010, end: span(t, A.est + 1.6, A.est + 2.2) * (t < A.moved ? 1 : 0), a: 1 - lineOut, spark: false }); c.restore(); }
    // E.04 REPAIR + COPY out of the line
    const ou = span(t, A.neither + .2, A.neither + 1.6), oo = B.ease(t, A.moved - .3, A.moved + .8, quartIO);
    if (ou > 0 && oo < 1) {
      c.save(); c.beginPath(); c.rect(-3000, -3000, 9000, LY - 1 + 3000); c.clip(); c.translate(0, oo * 360);
      F.bodyDrawing(c, t, 520, LY - 6, 300, { s, u: ou, worn: 1, fix: 0, w: 2.4 });
      F.computer(c, t, 1500, LY - 4, 280, { s, u: span(t, A.neither + .6, A.neither + 1.8), on: .45 });
      c.restore();
      X.label(c, SRC.repair, 520, LY + 58, B.lab(t, A.neither + .6, A.moved), { size: 26, gold: .6 });
      X.label(c, SRC.copy, 1500, LY + 58, B.lab(t, A.neither + .9, A.moved), { size: 26, col: COOL.text });
    }
    // E.05 the AI ring + its beam on the end tick
    const ru = expoOut(span(t, A.but - .3, A.but + 1.0)), rd = quartIO(span(t, A.moved - .2, A.moved + .8));
    if (ru > 0 && rd < 1) { const ry = lerp(LY, 300, ru * (1 - rd)); F.beam(c, 1640, ry, 1760, LY, span(t, A.but + .5, A.but + 1.1) * (1 - rd), { s, w: 46 }); F.aiRing(c, t, 1640, ry, 46, { u: ru * (1 - rd), think: 1.2, s }); X.label(c, SRC.ai, 1640 + 90, ry + 10, ru * (1 - rd), { size: 26, col: COOL.text }); }
    // E.06 the two columns; the end tick travels from the line into WE ACCEPT, then into WE WORK ON
    const cu = span(t, A.moved - .1, A.moved + .9), co = B.ease(t, A.and - .2, A.and + .8, quartIO);
    if (cu > 0 && co < 1) {
      c.save(); c.translate(0, -co * 0);
      for (const [i, x] of [[0, 640], [1, 1280]]) {
        const k = expoOut(span(cu, i * .15, .7 + i * .15)) * (1 - co); if (k <= 0) continue;
        c.strokeStyle = rgba(i ? GOLD.line : CREAM, .35 * k); c.lineWidth = 1.6 / s; c.beginPath(); c.roundRect(x - 200, 300, 400, 270 * k, 14); c.stroke(); c.beginPath();
        X.label(c, [SRC.accept, SRC.workOn][i], x, 262, span(cu, .2 + i * .15, .8 + i * .15) * (1 - span(t, A.and - .3, A.and + .3)), { size: 36, gold: i ? .7 * span(t, A.workon, A.workon + .6) : 0 });
      }
      c.restore();
    }
    const m1 = B.ease(t, A.moved, A.accept + .3, quartIO), m2 = B.ease(t, A.workon - .3, A.workon + 1.1, quartIO), tOut = B.ease(t, A.and - .2, A.and + .6, quartIO);
    if (m1 > 0 && tOut < 1) {
      const p0 = [1760, LY], p1 = [640, 440], p2 = [1280, 440], p = m2 > 0 ? B.quad(p1, [960, 380], p2, m2) : B.quad(p0, [1300, 300], p1, m1), hgt = lerp(34, 60, m1);
      c.save(); c.globalAlpha *= 1 - tOut; halo(c, p[0], p[1], 90 / s, .35 + .3 * m2, m2 > .5 ? GOLD.halo : CREAM, GOLD.core);
      c.fillStyle = mixHex(CREAM, GOLD.line, m2); c.fillRect(p[0] - 4 / s, p[1] - hgt, 8 / s, hgt * 2); c.restore();
    }
    // E.07 a new line grows from the left; you walk ahead of its head and look back · E.11 THE ANSWER lifts out of it
    const nl = span(t, A.and + .3, A.before + .8), head = lerp(160, 1050, sineIO(nl)), nlo = B.ease(t, A.every - .3, A.every + .9, quartIO);
    if (nl > 0 && nlo < 1) { c.save(); c.translate(0, nlo * 220); X.lifeline(c, t, 160, head, LY, s, { u: 1, a: 1 - nlo, spark: nl < 1 }); c.restore(); }
  }
  // you: from the stone's foot onto the line (E.03), stand there (E.04–E.06), walk ahead (E.07), back to the foot of the stone (E.12)
  function youState(t) {
    const r1 = ret1(t), w1 = span(t, A.and + .2, A.and + 2.4), back = B.ease(t, A.every - .1, A.every + 2.0);
    const x = lerp(lerp(S.YOU.x, 1300, sineIO(w1)), S.YOU.x, back), yl = LY - 2;
    const y = t < A.every - .1 ? lerp(S.hillY(S.YOU.x) + 2, yl, sineIO(r1)) : lerp(yl, S.hillY(x) + 2, sineIO(span(back, 0, .8)));
    const walking = (w1 > 0 && w1 < 1) || (back > 0 && back < 1);
    const dir = back > 0 && back < 1 ? -1 : w1 >= 1 && back <= 0 ? -1 : 1;
    return { x, y, h: lerp(S.YOU.h, 104, sineIO(r1) * (1 - back)), dir, walk: walking ? t * 6.2 : undefined, pose: walking ? undefined : 'look', look: w1 >= 1 && back <= 0 ? .1 : undefined };
  }
  // THE ANSWER (E.11), then the bar → the dash, the bead → the blank / the crack (E.12)
  const AN = { x: 1410, y: 520, w: 520 };
  function answer(c, t, s) {
    const au = span(t, A.stop - .2, A.stop + .9), k = quartIO(span(t, A.every - .1, A.every + 1.5)); if (au <= 0 || k >= 1) return;
    const rise = expoOut(au), cx = lerp(1050, AN.x, rise), cy = lerp(LY, AN.y, rise);
    if (k <= 0) { F.answer(c, t, cx, cy, AN.w, .015 * Math.sin(t * 1.1), { u: au, plain: true, tremble: 2 }); return; }
    // the bar shrinks into the dash and darkens into the carving
    const x0 = lerp(cx - AN.w / 2, EG.dash[0], k), x1 = lerp(cx + AN.w / 2, EG.dash[1], k), y = lerp(cy, EG.y - 23 + 2.5, k), col = mixHex(GOLD.body, CARVED, span(k, .6, 1));
    c.save(); stoneRotK(c, k); c.fillStyle = col; c.fillRect(x0, y - lerp(2, 2.5, k), x1 - x0, lerp(4, 5, k));
    if (k < .7) halo(c, (x0 + x1) / 2, y, 80 * (1 - k), .3 * (1 - k), GOLD.halo, GOLD.core);
    const bead = B.quad([cx + .015 * Math.sin(t * 1.1) * AN.w / 2, cy], [1480, 430], BLANK, sineIO(span(k, 0, .7))), br = 13 * (1 - span(k, .6, 1));
    if (br > 0) { halo(c, bead[0], bead[1], 60, .55, GOLD.halo, GOLD.core); c.fillStyle = GOLD.body; c.beginPath(); c.arc(bead[0], bead[1], br, 0, Math.PI * 2); c.fill(); }
    c.restore();
  }
  const stoneRotK = (c, k) => { c.translate(ST.x, ST.base); c.rotate(ST.rot * k); c.translate(-ST.x, -ST.base); };

  function draw(ctx, t) {
    const v = view(t), r1 = ret1(t), r2 = t >= A.every - .3 ? ret2(t) : 1, ret = t < A.est ? 0 : t < A.every - .3 ? r1 : r2;
    const world = ret < 1;
    const kDash = quartIO(span(t, A.every - .1, A.every + 1.5));
    const crack = t < A.every ? .3 * (1 - span(t, A.est, A.est + 1)) + .12 : lerp(.15, .55, span(kDash, .6, 1)) + .45 * expoOut(span(t, A.first - .1, A.first + 1.2)) - .15 * span(t, A.chan, tEnd - 1);
    const y = youState(t);
    if (world) {
      // the ground with the pool where the stone world wants it, then the lines under the rising hills, then the world
      if (t >= A.est) { const pl = pool(t); B.ground(ctx, t, v, { lx: pl[0], ly: pl[1], pool: pl[2] }); X.inView(ctx, v, (s) => { stage(ctx, t, s); }); }
      S.stoneWorld(ctx, t, v, {
        ground: t < A.est, crack, retract: ret, dash: t < A.every - .3 || kDash >= 1, old: 1, town: B.ease(t, A.chan - .5, A.want + 1.5), lit: 1,
        you: { x: y.x, y: y.y, h: y.h, dir: y.dir, walk: y.walk, pose: y.pose, look: y.look },
        ghost: t < A.honest - .05 ? YRS.map((txt, i) => ({ txt, a: span(t, R.a + .4 + i * .6, R.a + 1.3 + i * .6), gold: .7, dy: [-46, 42][i], size: 54 })) : [],
      });
      // ★ E.12: the old stones light one by one; they settle back for the end screen
      const ol = (i) => span(t, A.every + .5 + i * .32, A.every + 1.1 + i * .32) * (1 - .4 * span(t, A.first, A.chan)) * (1 - span(t, A.want, tEnd - .6));
      if (t > A.every) B.lightOldStones(ctx, t, v, ol);
      X.inView(ctx, v, (s) => {
        if (t < A.neither + 1) years(ctx, t, s, ret);
        answer(ctx, t, s);
        // A.02: the SUBSCRIBE tag on the hill
        const su = span(t, A.sub - .15, A.sub + .9) * (1 - span(t, tEnd - 1.4, tEnd - .25));
        if (su > 0) B.subscribeTag(ctx, t, 860, S.hillY(860) + 4, s, su);
      });
    } else {
      const pl = pool(t);
      B.ground(ctx, t, v, { lx: pl[0], ly: pl[1], pool: pl[2] });
      X.inView(ctx, v, (s) => {
        stage(ctx, t, s);
        if (t < A.neither + 1) years(ctx, t, s, 1);
        ctx.save(); F.du(ctx, y.x, y.y, y.h, { pose: y.pose, dir: y.dir, walk: y.walk, look: y.look }); ctx.restore();
        answer(ctx, t, s);
      });
    }
    // screen texts
    X.label(ctx, SRC.notYet, W / 2, 230, B.lab(t, A.human - .3, A.but + .2), { size: 36, spacing: .14, gold: .2 });
    for (const [i, a, b] of [[0, A.q1, A.q2], [1, A.q2, A.q3], [2, A.q3, A.stop]]) X.big(ctx, SRC.qs[i], W / 2, 250, 66, B.lab(t, a - .05, b + .05, .55, .35), { gold: .2 });
  }
  const marks = [R.a, A.est, A.and, A.every, A.chan];
  return [...marks.map((t) => ({ t, draw, print: PR })), { t: tEnd, draw: (ctx, t) => S.endScreen(ctx, t, T), print: PR }];
};
