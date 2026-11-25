// c01 · HOOK (lead, the quality reference) · 'Europe can still win' → 'Those chip machines' (plateMachine).
// A motion-design sequence, not a world ride: every sentence gets its own picture that shows exactly what it says; the pictures hand over
// through carrier objects (the moon → the AI's iris · the desk scene → one window of many · the empty disc → 100 cells · the 5 gold cells
// → the machine's windows · the machine rolls away and uncovers a person · the ground line carries the crowds · the EU crowd → one disc
// → 27 crates · the machine drawing on the plan → the big machine of the plate). Leitbild only in H.01–H.02 (anchor 1 of 4).
//
// | ID    | anchor (phrase)                       | zeigt wörtlich                                                   | kind   | carrier out                    |
// |-------|---------------------------------------|------------------------------------------------------------------|--------|--------------------------------|
// | H.01  | Europe can still win                  | thumbnail A: the puzzle moon, 4 gold parts, you lift the 5th      | ANCHOR | the moon                       |
// | H.02  | Everyone says … Too many rules        | the gold drains; TOO SLOW / TOO SMALL / TOO MANY RULES tiles      | MIX    | the moon (circle) → iris       |
// | H.03  | And whoever builds … treats you       | the AI (iris screen): WHOEVER BUILDS IT · GETS A SAY, its beam on you | MIX | the screen                    |
// | H.04  | Which AI reads your contracts         | your contract slides into the screen, a cool line reads it        | EXPL   | the sheet flips                |
// | H.05  | Sits in on your job interview         | the sheet becomes a CV, the screen sits between you                | EXPL   | the sheet flips                |
// | H.06  | Says yes or no to your loan           | the sheet becomes a loan form, YES / NO flips on the screen        | EXPL   | pull back                      |
// | H.07  | Wherever you live                     | the desk is one window of many, in many different towns           | SCENE  | the skyline sinks              |
// | H.08  | Right now, almost none … European     | above the cool windows the plan disc rises: empty                 | MIX    | the disc                       |
// | H.09  | So how could Europe possibly still win| HOW COULD EUROPE STILL WIN? under the empty disc                  | MIX    | the disc's outline → 100 cells |
// | H.10  | Guess how much … computing power …    | 100 cells = THE WORLD'S AI COMPUTING POWER, pulsing (guess)       | EXPL   | 5 cells stay                   |
// | H.11  | About five percent                    | 95 fall dark, 5 stay gold: ABOUT 5% + source                       | EXPL   | the 5 cells → machine windows  |
// | H.12  | And yet: the only machines … built in Europe. Then shipped away | the machine grows out of the cells: THE ONLY MACHINES FOR TOP CHIPS · BUILT IN EUROPE · it rolls out right: SHIPPED AWAY | MIX | the machine uncovers a person |
// | H.13  | Many of the people … Then hired away  | TRAINED IN EUROPE · the same exit right: HIRED AWAY               | MIX    | the ground line                |
// | H.14  | And the European Union has more people| two crowds rise: EU (45) > US (34), 1 figure = 10 million         | EXPL   | the TOO SMALL tile             |
// | H.15  | So Europe isn't too small             | the TOO SMALL tile drops on the EU crowd and is struck through    | EXPL   | the crowd gathers              |
// | H.16★ | It's in twenty-seven pieces           | the EU crowd gathers into one disc, it bursts into 27 crates: 27  | EXPL   | the crates                     |
// | H.17  | Twenty-seven countries, … rules       | a rule booklet lands on each crate: 27 SETS OF RULES              | EXPL   | the plan slides in             |
// | H.18  | And the plan … on the table           | the plan sheet lands beside the crates, its five outlines draw on | MIX    | the dates                      |
// | H.19  | This winter, the first big decisions  | two date tags pin to the plan; the machine drawing lifts off      | EXPL   | → plateMachine                 |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as S from '../lib/f69_world.mjs';
import * as X from '../lib/f69_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, LAMP, SOURCES: SRC } = F;
const PR = F.PRINT69;

export default async (T, R) => {
  const G = (p, n = 0, after) => T.G(p, n, after);
  const A = {
    every: G('Everyone says'), slow: G('Too slow'), small: G('Too small'), rules: G('Too many rules'), who: G('And whoever builds'), say: G('gets a say'),
    contr: G('Which AI reads'), job: G('Sits in on your job'), loan: G('Says yes or no'), where: G('Wherever you live'), none: G('Right now, almost none'),
    q: G('So how could Europe'), guess: G('Guess how much'), five: G('About five percent'), yet: G('And yet'), built: G('built in Europe'),
    ship: G('Then shipped away'), people: G('Many of the people'), trained: G('trained in Europe'), hired: G('Then hired away'), more: G('has more people'),
    small2: G("So Europe isn't too small"), pieces: G("It's in twenty-seven pieces"), countries: G('Twenty-seven countries'), sets: G('twenty-seven sets of rules'),
    plan: G('And the plan to put them together'), table: G('on the table'), winter: G('This winter'), end: R.b,
  };
  A.yes = T.G('yes or no', 0, A.loan); A.no = T.G('no to your loan', 0, A.loan) + .1;
  const tP = A.end - S.SEAM_HALF;

  // ---------------------------------------------------------------- stage L: the Leitbild (thumbnail A), slow push in
  const camL = (t) => E.camDrift(E.cam3({ x: 40 * sineIO(t / A.who), y: -10 * sineIO(t / A.who), z: 260 * sineIO(t / A.who) }), t, .5);
  const mo = (() => { const c = camL(A.who), p = E.project(c, S.Z_MOON, S.MOON.x, S.MOON.y); return [p[0], p[1], S.MOON.r * p[2]]; })();
  function leitbild(ctx, t) {
    const drain = span(t, A.every + .3, A.every + 2.4), piece = 1 - .66 * sineIO(span(t, A.every + .2, A.every + 1.8));
    S.seaWorld(ctx, camL(t), t, { moon: { parts: F.mixParts(F.VISION, F.BLANK, drain), glow: 1 - .4 * drain }, lit: .85, away: .2,
      you: { piece: { u: piece, kind: 'gold', r: 132, glow: 1 - .6 * drain } } });
    F.title(ctx, t, 1, { out: span(t, A.every - .1, A.every + 1.2) });
    const tiles = [[A.slow, 'Too slow', 560, 330, -.05], [A.small, 'Too small', 640, 480, .035], [A.rules, 'Too many rules', 590, 630, -.025]];
    tiles.forEach(([a, s, x, y, r], i) => F.headTile(ctx, t, x, y, 820, s.toUpperCase(), { u: span(t, a - .25, a + .5), rot: r, fall: span(t, A.who - 1.1 + i * .12, A.who - .25 + i * .1) }));
  }

  // ---------------------------------------------------------------- stage D: the desk (sheet coordinates), then the windows
  const D = X.DESK, IRIS = { x: 960, y: D.y - 230 * .66 * .5, r: 230 * .66 * .26 };
  const s0 = mo[2] / IRIS.r, v0 = { x: IRIS.x - (mo[0] - W / 2) / s0, y: IRIS.y - (mo[1] - H / 2) / s0, s: s0 };
  const VD = [[A.who, v0], [A.who + 2.6, { x: 960, y: 580, s: 1.18 }], [A.contr + .3, { x: 960, y: 584, s: 1.22 }], [A.loan + 2, { x: 960, y: 590, s: 1.27 }],
    [A.where + .05, { x: 960, y: 592, s: 1.28 }], [A.where + 1.7, { x: 960, y: 420, s: .2 }], [A.none + .4, { x: 980, y: 380, s: .19 }],
    [A.none + 2.4, { x: 1000, y: -2400, s: .18 }], [A.q + 1.2, { x: 1010, y: -4600, s: .18 }]];
  const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));
  const docAt = (t) => (t < A.job + .12 ? 'contract' : t < A.loan + .12 ? 'cv' : 'form');
  const flipK = (t) => { let k = 1; for (const a of [A.job, A.loan]) { const u = span(t, a - .12, a + .36); if (u > 0 && u < 1) k = Math.abs(Math.cos(Math.PI * u)); } return k; };
  // the town of windows: every window is a cell of 1800 × 900 sheet units, the desk window is cell (0, 0)
  const BLD = [[-8, -8, 3, 'gable'], [-6, -5, 4, 'dome'], [-3, -3, 6, 'flat'], [-1, 1, 3, 'gable'], [3, 3, 7, 'tower'], [5, 6, 3, 'flat'], [8, 8, 5, 'dome'], [10, 11, 2, 'gable']];
  const WIN = (i, j) => ({ x: 140 + i * 1800, y: 330 + j * 900, w: 1640, h: 640 });
  function town(ctx, t, k, v) {
    const base = 330 + 900 + 60;
    for (const [i0, i1, n, roof] of BLD) {
      const x0 = WIN(i0, 0).x - 120, x1 = WIN(i1, 0).x + 1640 + 120, top = WIN(0, -(n - 1)).y - 140;
      ctx.fillStyle = mixHex(P.night0, P.ind1, .45); ctx.fillRect(x0, top, x1 - x0, base - top + 4000);
      ctx.beginPath();
      if (roof === 'gable') { ctx.moveTo(x0 - 60, top); ctx.lineTo((x0 + x1) / 2, top - (x1 - x0) * .32); ctx.lineTo(x1 + 60, top); }
      else if (roof === 'dome') { ctx.moveTo(x0 + 200, top); ctx.ellipse((x0 + x1) / 2, top, (x1 - x0) / 2 - 200, (x1 - x0) * .3, 0, Math.PI, 0); }
      else if (roof === 'tower') { ctx.rect((x0 + x1) / 2 - 300, top - 1400, 600, 1400); ctx.rect((x0 + x1) / 2 - 30, top - 2400, 60, 1000); }
      else { ctx.rect(x0 + 300, top - 300, 500, 300); }
      ctx.fill();
      for (let i = i0; i <= i1; i++) for (let j = 0; j > -n; j--) { if (i === 0 && j === 0) continue; miniDesk(ctx, t, WIN(i, j), (i * 7 + j * 3 + 50) % 5); }
    }
  }
  function miniDesk(ctx, t, w, q) {   // the same desk scene in another window (simplified): a dark room, the cool screen between two people
    ctx.fillStyle = mixHex(P.night1, COOL.deep, .45); ctx.fillRect(w.x, w.y, w.w, w.h);
    const cx = w.x + w.w / 2 + (q - 2) * 60, dy = w.y + w.h * .58;
    halo(ctx, cx, dy - 110, 700, .35, COOL.halo, COOL.core);
    ctx.fillStyle = mixHex(P.night0, P.blue1, .3); ctx.fillRect(cx - 520, dy, 1040, 30);
    ctx.fillStyle = COOL.body; ctx.fillRect(cx - 110, dy - 160, 220, 140);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(cx - 640, dy - 130, 70, 80, 0, 0, Math.PI * 2); ctx.ellipse(cx + 640, dy - 140, 70, 80, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(cx - 720, dy - 60, 160, 300); ctx.fillRect(cx + 560, dy - 70, 160, 300);
  }
  function deskStage(ctx, t) {
    const v = X.viewPath(t, VD);
    X.inView(ctx, v, () => {
      if (v.s < .8) town(ctx, t, v.s, v);
      const w0 = WIN(0, 0), inWin = 1 - span(v.s, .55, .9);
      if (inWin > 0) { ctx.fillStyle = rgba(mixHex(P.night1, COOL.deep, .3), inWin); ctx.fillRect(w0.x, w0.y, w0.w, w0.h); ctx.save(); ctx.beginPath(); ctx.rect(w0.x, w0.y, w0.w, w0.h); ctx.clip(); }
      // the beam: the AI's light on you (it gets a say in how it treats you)
      const beam = span(t, A.say - .2, A.say + .8) * (1 - span(t, A.contr - .2, A.contr + .4));
      if (beam > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const yx = 960 - D.w / 2 - 70, sw = lerp(.5, .2, beam);
        ctx.fillStyle = E.lin(ctx, IRIS.x, IRIS.y, yx, D.y, [[0, rgba(COOL.body, .32 * beam)], [1, rgba(COOL.body, .05 * beam)]]);
        ctx.beginPath(); ctx.moveTo(IRIS.x - 20, IRIS.y); ctx.lineTo(yx - 260 * sw * 2, D.y + 176); ctx.lineTo(yx + 260 * sw * 2, D.y + 176); ctx.lineTo(IRIS.x + 20, IRIS.y); ctx.fill(); ctx.restore(); }
      const lit = .35 + .65 * span(t, A.contr - .6, A.contr + .6);
      X.deskScene(ctx, t, 960, { other: { a: lit, look: t > A.job ? .3 : .1 }, you: { look: beam > .3 ? .7 : .15 }, screen: { a: 1 } });
      // the sheet on the desk: contract → CV → loan form (flips on the words), it slides from you into the screen, a cool line reads it
      const du = span(t, A.contr - .1, A.contr + 1.1), kind = docAt(t), fk = flipK(t);
      if (du > 0) {
        const dx = lerp(960 - D.w / 2 + 110, 960 - 175, sineIO(du)), dy = D.y - 92, scan = (t - A.contr - 1.1) % 2.1 / 1.6;
        ctx.save(); ctx.translate(dx, dy); ctx.scale(Math.max(.02, fk), 1); X.doc(ctx, t, 0, 0, 118, { kind, u: span(t, A.contr - .3, A.contr + .2), scan: du >= 1 ? scan : -1 }); ctx.restore();
      }
      if (inWin > 0) ctx.restore();
    });
    // texts (screen space, above the desk; they leave before the pull back)
    X.label(ctx, 'WHOEVER BUILDS IT', W / 2, 216, lab(t, A.who + .35, A.contr), { size: 34, spacing: .14 });
    X.label(ctx, 'GETS A SAY', W / 2, 270, lab(t, A.say, A.contr), { size: 34, spacing: .14, gold: 1, col: GOLD.text });
    X.label(ctx, SRC.scenes[0], W / 2, 236, lab(t, A.contr + .1, A.job), { size: 34, spacing: .14 });
    X.label(ctx, SRC.scenes[1], W / 2, 236, lab(t, A.job + .1, A.loan), { size: 34, spacing: .14 });
    X.label(ctx, SRC.scenes[2], W / 2, 236, lab(t, A.loan + .1, A.where), { size: 34, spacing: .14 });
    const yn = span(t, A.loan + .1, A.loan + .6) * (1 - span(t, A.where - .3, A.where + .2)), vv = X.toScreen(v, 960, 410);
    if (yn > 0) X.yesNo(ctx, t, vv[0], vv[1], t < A.yes + .05 ? -1 : t < A.no ? lerp(-1, 1, expoOut(span(t, A.yes, A.yes + .3))) : lerp(1, -1, expoOut(span(t, A.no, A.no + .3))), yn);
  }

  // ---------------------------------------------------------------- stage C: the empty disc, the question, the 100 cells (screen space)
  const DISC = { x: 960, y: 330, r: 200 }, CELL = 40, GRID = { x: 960 - (10 * CELL + 9 * CELL * .22) / 2, y: 190 }, KEEP = [63, 64, 65, 66, 67];
  const gridPos = (i) => [GRID.x + (i % 10) * CELL * 1.22, GRID.y + Math.floor(i / 10) * CELL * 1.22];
  function discStage(ctx, t) {
    const rise = expoOut(span(t, A.none + .9, A.none + 3.0)), dy = (1 - rise) * 640, morph = span(t, A.guess - .2, A.guess + 1.6);
    if (morph < 1) {
      const a = 1 - span(morph, .05, .4);
      ctx.save(); ctx.globalAlpha *= Math.max(0, a);
      F.kitDisc(ctx, t, DISC.x, DISC.y + dy, DISC.r, F.BLANK, { glow: .6, stars: 0, loose: false, write: span(t, A.none + 1.0, A.none + 3.2) });
      ctx.restore();
    }
    if (morph > 0) {   // the disc's outline breaks into 100 squares that fly into the grid (the world's compute)
      const field = span(t, A.guess + 1.4, A.guess + 1.6);
      if (field < 1) for (let i = 0; i < 100; i++) {
        const q = (i * 37) % 100 / 100, u = sineIO(clamp(morph * 1.5 - q * .5)), ang = -Math.PI / 2 + i / 100 * Math.PI * 2;
        const [gx, gy] = gridPos(i), x = lerp(DISC.x + Math.cos(ang) * DISC.r, gx + CELL / 2, u), y = lerp(DISC.y + Math.sin(ang) * DISC.r, gy + CELL / 2, u), s = lerp(8, CELL, u);
        ctx.fillStyle = rgba(mixHex(CREAM, COOL.body, u), .9); ctx.beginPath(); ctx.roundRect(x - s / 2, y - s / 2, s, s, s * .18); ctx.fill();
      }
      if (field > 0) cellsAt(ctx, t, 1);
    }
    const qa = span(t, A.q - .1, A.q + .7) * (1 - span(t, A.guess - .4, A.guess + .2));
    X.big(ctx, SRC.question, W / 2, 720 + dy * 0, 66, qa, { gold: .5 });
    X.label(ctx, SRC.computeTitle, W / 2, 140, span(t, A.guess + .8, A.guess + 1.6) * (1 - span(t, A.yet - .2, A.yet + .3)), { size: 28 });
    const fa = span(t, A.five - .05, A.five + .6) * (1 - span(t, A.yet + .1, A.yet + .6));
    X.big(ctx, SRC.five, W / 2, 790, 104, fa, { gold: 1 });
    if (fa > 0) F.source(ctx, t, A.five, A.yet + .4, SRC.fiveSrc);
  }
  const cellsAt = (ctx, t, a) => X.cells(ctx, t, GRID.x, GRID.y, CELL, 10, 10, { keep: KEEP, on: 1, pulse: span(t, A.guess + 1.5, A.guess + 2.5) * (1 - span(t, A.five - .3, A.five)),
    dim: span(t, A.five - .05, A.five + .7), merge: span(t, A.five + .7, A.five + 1.6), drop: span(t, A.yet - .1, A.yet + .9), hideKeep: t >= A.yet });

  // ---------------------------------------------------------------- stage M: the ground line (sheet coordinates locked to the plate view)
  const gv = (t) => { const d = t - tP, s = d >= -4 ? 1 + .04 * d + .005 * d * d : .92, fade = 1 - span(t, tP - 9, tP - 4);
    return { x: 960 + 24 * Math.sin(t * .09) * fade, y: 520 + 14 * Math.sin(t * .07 + 1) * fade, s }; };
  const GY = 700, M = { x: 900, L: 760 }, mh = M.L * .3;
  const winRow = (v) => { const a = X.toScreen(v, M.x - M.L / 2 + M.L * .27, GY - mh * .86), b = X.toScreen(v, M.x - M.L / 2 + M.L * .79, GY - mh * .86 + mh * .16); return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] }; };
  const BLOCK = (() => { const w = 5 * CELL + 4 * CELL * .22; return { x: 960 - w / 2, y: GRID.y + CELL * 1.22 * 4.5 + CELL * .22 / 2, w, h: CELL }; })();
  const CR = { x: 650, y: 420, w: 72 };
  function groundStage(ctx, t) {
    const v = gv(t);
    const fly = sineIO(span(t, A.yet, A.yet + 1.2)), reveal = sineIO(span(t, A.yet + 1.0, A.yet + 2.2)), wr = winRow(v);
    const roll = span(t, A.ship + .1, A.ship + 1.7), out = span(t, tP - 1.6, tP - .1);
    const sink = span(t, tP - 1.9, tP - .5) ** 2 * 900;   // everything but the flying machine drawing leaves downwards at the end
    X.inView(ctx, v, () => {
      ctx.save(); ctx.translate(0, sink);
      X.lightLine(ctx, [[M.x, GY], [M.x - 2400, GY]], span(t, A.yet + 1.1, A.yet + 2.3), { a: .5, w: 2.5 });
      X.lightLine(ctx, [[M.x, GY], [M.x + 2400, GY]], span(t, A.yet + 1.1, A.yet + 2.3), { a: .5, w: 2.5 });
      // the person behind the machine (uncovered as it rolls away), then the same exit right
      const pw = span(t, A.hired + .15, A.hired + 2.3), px = M.x + 60 + expoIn(pw) * 1500;
      if (t > A.ship && pw < 1 && t < A.more + 1) E.person(ctx, px, GY, 360, { dir: 1, light: .8, look: .3 + .2 * Math.sin(t * .8), walk: pw > 0 ? t * 9 : undefined, armR: pw > 0 ? undefined : [.2, .1], rim: mixHex(GOLD.line, P.blue1, .4) });
      if (reveal > 0 && roll < 1) {
        const mx = M.x + expoIn(roll) * 1700;
        ctx.save(); const cl = { x0: lerp(M.x - M.L * .26, M.x - M.L / 2 - 20, reveal), x1: lerp(M.x + M.L * .29, M.x + M.L / 2 + 20, reveal), y0: lerp(GY - mh * .9, GY - mh * 1.75, reveal), y1: lerp(GY - mh * .7, GY + 20, reveal) };
        if (reveal < 1) { ctx.beginPath(); ctx.rect(cl.x0, cl.y0, cl.x1 - cl.x0, cl.y1 - cl.y0); ctx.clip(); }
        F.chipMachine(ctx, t, mx, GY, M.L, { beam: span(t, A.built - .3, A.built + .6), glow: 1, wheels: roll > 0 }); ctx.restore();
      }
      // the crowds rise out of the ground line; the EU crowd gathers into one disc, which bursts into 27 crates
      const cu = span(t, A.more - .1, A.more + 2.4), g = span(t, A.pieces - .1, A.pieces + 1.1), us = span(t, A.pieces - .3, A.pieces + 1.0);
      if (cu > 0 && g < 1) X.crowdRise(ctx, t, 600, GY, 45, 9, 150, { u: cu, seed: 5, gather: [700, 560], g, rim: mixHex(GOLD.line, P.blue1, .35) });
      if (cu > 0 && us < 1) { ctx.save(); ctx.translate(expoIn(us) * 1500, 0); X.crowdRise(ctx, t, 1400, GY, 34, 9, 150, { u: span(t, A.more + .2, A.more + 2.6), seed: 9 }); ctx.restore(); }
      const disc = Math.sin(Math.PI * span(t, A.pieces + .5, A.pieces + 1.6)); if (disc > 0) { halo(ctx, 700, 560, 170 * disc, .7 * disc, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.body, disc); ctx.beginPath(); ctx.arc(700, 560, 70 * disc, 0, Math.PI * 2); ctx.fill(); }
      const cu2 = span(t, A.pieces + 1.0, A.pieces + 2.4);
      if (cu2 > 0) X.crates27(ctx, t, CR.x, CR.y, CR.w, { u: cu2, from: [700, 560], books: span(t, A.sets - .4, A.sets + 1.6), glow: .5 });
      const pl = span(t, A.plan, A.plan + 1.3);
      if (pl > 0) X.planSheet(ctx, t, 1500, 560, 560, { u: pl, write: span(t, A.table - .2, A.table + 1.6), machine: span(t, A.table + .4, A.table + 1.4) * (out > 0 ? 0 : 1) });
      ctx.restore();
      if (out > 0) {   // the machine drawing lifts off the plan and grows into the plate's machine
        const k = sineIO(out), px = 1500 + 560 * .3, py = 560 + 560 * .66 * .12;
        F.chipMachine(ctx, t, lerp(px, 960, k), lerp(py, 700, k), lerp(560 * .24, 1100, k), { glow: lerp(.6, 1, k), beam: lerp(.6, 1, k) });
      }
    });
    // the 5 gold cells fly onto the machine's window row (screen space)
    if (fly > 0 && reveal < 1) {
      const x = lerp(BLOCK.x, wr.x, fly), y = lerp(BLOCK.y, wr.y, fly), w = lerp(BLOCK.w, wr.w, fly), h = lerp(BLOCK.h, wr.h, fly), a = 1 - reveal;
      ctx.save(); ctx.globalAlpha *= a; halo(ctx, x + w / 2, y + h / 2, w * .6, .4, GOLD.halo, GOLD.core);
      ctx.fillStyle = mixHex(GOLD.hot, COOL.body, fly); for (let i = 0; i < 5; i++) { const cw = w / (5 + 4 * .22 * (1 - fly) + 4 * .6 * fly); ctx.beginPath(); ctx.roundRect(x + i * (w - cw) / 4, y, cw, h, 4); ctx.fill(); }
      ctx.restore();
    }
    // texts
    X.label(ctx, 'THE ONLY MACHINES FOR TOP CHIPS', W / 2, 200, lab(t, A.yet + .9, A.ship), { size: 30 });
    X.label(ctx, 'BUILT IN EUROPE', W / 2, 250, lab(t, A.built, A.ship), { size: 30, gold: 1, col: GOLD.text });
    X.label(ctx, SRC.shipped, W / 2, 226, lab(t, A.ship + .05, A.people), { size: 36, spacing: .16 });
    X.label(ctx, 'TRAINED IN EUROPE', W / 2, 226, lab(t, A.trained - .1, A.hired), { size: 36, spacing: .16 });
    X.label(ctx, SRC.hired, W / 2, 226, lab(t, A.hired + .05, A.more), { size: 36, spacing: .16 });
    const cl = lab(t, A.more + .6, A.pieces + .2), cle = cl * (1 - span(t, A.small2 - .4, A.small2)), [ex, ey] = X.toScreen(v, 600, 290), [ux, uy] = X.toScreen(v, 1400, 330);
    X.label(ctx, 'EUROPEAN UNION', ex, ey, cle, { size: 26, gold: .4 }); X.label(ctx, 'UNITED STATES', ux, uy, cl * (1 - span(t, A.pieces, A.pieces + .4)), { size: 26, col: F.CREAM2 });
    if (cl > 0) F.source(ctx, t, A.more + .6, A.pieces + .2, SRC.peopleSrc);
    // TOO SMALL drops on the EU crowd and is struck through
    const ts = span(t, A.small2 - .2, A.small2 + .5), tf = span(t, A.pieces - .3, A.pieces + .4);
    if (ts > 0 && tf < 1) { const [tx, ty] = X.toScreen(v, 600, 250); F.headTile(ctx, t, tx, ty, 540, 'TOO SMALL', { u: ts, rot: -.04, fall: tf });
      const st = span(t, A.small2 + .7, A.small2 + 1.3) * (1 - tf); X.lightLine(ctx, [[tx - 240, ty + 8], [tx + 240, ty - 8]], st, { w: 6, col: rgba(GOLD.hot, .95) }); }
    const n27 = lab(t, A.pieces + 1.2, A.plan - .1);
    X.big(ctx, '27', 1500, 470, 190, n27, { gold: 1 }); X.label(ctx, SRC.piecesWord, 1500, 530, n27 * (1 - span(t, A.sets - .4, A.sets)), { size: 30, spacing: .2 });
    X.label(ctx, 'SETS OF RULES', 1500, 530, lab(t, A.sets - .2, A.plan - .1), { size: 30, spacing: .14 });
    const dt = 1 - span(t, tP - 1.8, tP - 1.1);
    X.dateTag(ctx, SRC.dates[0], 1480, 205, span(t, A.winter + .1, A.winter + .8) * dt);
    X.dateTag(ctx, SRC.dates[1], 1480, 257, span(t, A.winter + .5, A.winter + 1.2) * dt);
  }

  // ---------------------------------------------------------------- the take
  function hook(ctx, t) {
    if (t < A.who) { leitbild(ctx, t); return; }
    X.sheet(ctx, t, gv(t), { lx: 960, ly: 500 });
    if (t >= A.none - .2 && t < A.yet + 2.3) discStage(ctx, t);   // before the town: the disc rises BEHIND the skyline
    if (t < A.q + 1.3) deskStage(ctx, t);
    if (t >= A.yet - .05) groundStage(ctx, t);
  }
  const draw = (ctx, t) => hook(ctx, t);
  const marks = [0, A.every, A.who, A.contr, A.job, A.loan, A.where, A.none, A.q, A.guess, A.five, A.yet, A.people, A.more, A.small2, A.pieces, A.countries, A.plan, A.winter];
  return [...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => S.plateMachine(ctx, t, T), print: PR }];
};
