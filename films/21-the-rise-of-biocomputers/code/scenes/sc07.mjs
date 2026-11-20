// c07 · The match: round 1 learning speed (with a catch) · round 2 teamwork (with a catch)
// T.G('Picture it as a match') → T.G('Round three') · builder B2. Plan: docs/shots.md 7.01–7.06 · kit: lib/f19_kit.mjs · shared B2 set,
// the aisle hold and THE SCOREBOARD: lib/f19_b2_world.mjs (c06's last frame = this chunk's first; this chunk's last = c08's first).
// ONE entry, ONE continuous camera: the aisle hold (the alive rack, drawer open, you) → the scoreboard rises over the rack (CELLS : A.I.,
// three lamps) → the camera dives into the dish: the dish field, the board stays at the top →
//   round 1: the dish (cells) vs three cool programs; the same short practice; two rally curves, gold climbs faster → the gold tip
//            becomes a point token and flies to CELLS; CATCH; the programs were older, the practice short; with far more practice the
//            cool bar stretches and its curve climbs past the gold;
//   round 2: the dish shrinks (the camera rises) and clones into fifteen boxes inside a talk's frame (presented), linked into a team; a
//            spark runs into a grid where a little figure steps to a goal; three bars 32 · 40 · 70 (old program, one box, the team);
//            the 70 bar's top flies to CELLS; CATCH; ONE COMPANY · ONE TALK · NO PAPER YET; the old program dims → the round folds back
//            into the one dish (= c08's first frame).
//
// | ID   | anchor (word)                                   | picture (one idea)                                       | 1–2 moves        | layer      |
// |------|-------------------------------------------------|----------------------------------------------------------|------------------|------------|
// | 7.01 | cells against · Three rounds                    | the board rises over the alive rack; dive into the dish  | board · dive     | SCENE>EXPL |
// | 7.02 | Learning speed · three standard · tiny amount   | the dish vs three cool programs; equal short practice    | programs · bars  | EXPL       |
// | 7.03 | longer rallies                                  | two curves: gold climbs faster than cool                 | curves           | EXPL       |
// | 7.04 | with a catch · older · far more practice        | the gold tip flies to CELLS; CATCH; cool bar stretches   | token · catch    | EXPL       |
// | 7.05 | Teamwork · fifteen · 32 · 40 · 70               | 15 boxes link (a talk's frame); figure → goal; 3 bars    | clones · bars    | EXPL       |
// | 7.06 | No published paper · today's best               | token 2, CATCH; ONE COMPANY · ONE TALK · NO PAPER YET    | token · catch    | EXPL       |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import { fieldNight, topCam, fieldOf, tiltCam, aisleHold, aisleDive, AISLE_CAM1, holdCam, AISLE_HOLD, FIELD_DRIFT, FIELD_DISH, FIELD_NET, matchAnchors, board, polyTo, program } from '../lib/f19_b2_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, halo } = E;
const { cam, camAt, camDrift, view, COOL, bump } = F;

export const PRINT = F.PRINT19;

export default async (T, R) => {
  E.prepareEditorial();
  const a = matchAnchors(T);
  return [{ t: R.a, draw: scene(a, T, R), print: PRINT }];
};

// ===================================================================================================== the field layout (screen)
export const R1 = [480, 740, 190];                        // the dish as the cells' player (rounds 1 and 3)
const TEAM = [560, 652, 44];                              // the dish small: the first of fifteen boxes (round 2)
const R1C = topCam(...R1), TEAMC = topCam(...TEAM);
const PROG = [[1330, 740], [1480, 740], [1630, 740]];     // the three programs
const PLOT = { x0: 772, x1: 1150, y0: 900, gTop: 566, cTop: 800, cWin: 520 };
const PRAC = { y: 990, g: 390, c: 1272, short: 130, long: 610 };
const GRID = []; for (let j = -1; j <= 1; j++) for (let i = -2; i <= 2; i++) GRID.push([i, j]);   // fifteen boxes, (0, 0) = the dish
const GSTEP = 96;                                         // px between boxes at the TEAM zoom
const TG = { x0: 1190, y0: 560, dx: 75, dy: 70, nx: 7, ny: 4 };
const PATH = [[0, 3], [1, 3], [2, 3], [2, 2], [3, 2], [4, 2], [4, 1], [5, 1], [6, 1], [6, 0]];
const BARS = { base: 900, x: [1240, 1420, 1600], w: 84, v: [32, 40, 70], per: 370 / 70 };
const SLIDE = { x: 296, y: 470, w: 1408, h: 552 };       // the talk's frame round the team, the test and the results
const BEST = 6;                                           // the best single box (index in GRID)

function scene(a, T, R) {
  const tDive0 = a.three + .4, tDive1 = a.three + 3.4;
  const FK = [[tDive1, R1C], [a.lastMonth - .3, R1C], [a.presented + .2, TEAMC], [a.todays + .05, TEAMC], [a.todays + 1.9, R1C]];
  const fieldCam = (t) => camDrift(camAt(t, FK), t, FIELD_DRIFT * smooth(span(t, tDive1, tDive1 + 1.5)));
  const fieldLand = fieldOf(R1C);

  return (ctx, t) => {
    if (t < tDive0) aisleHold(ctx, t, view(camDrift(holdCam(t, T), t, AISLE_HOLD.drift)), {});
    else if (t < tDive1) { const u = span(t, tDive0, tDive1); aisleDive(ctx, t, view(camDrift(tiltCam(u, AISLE_CAM1, R1C), t, AISLE_HOLD.drift * (1 - smooth(span(u, .2, .8))))), u); }
    else field(ctx, t, fieldOf(fieldCam(t)));
    board(ctx, t, a);
    F.ladder(ctx, t, T);
  };

  function field(ctx, t, FM) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    fieldNight(ctx);
    round2(ctx, t, FM, 'back');
    F.dish(ctx, t, FM, { ...FIELD_DISH, net: FIELD_NET });
    round1(ctx, t, FM);
    round2(ctx, t, FM, 'front');
    ctx.restore();
  }

  // ---------------------------------------------------------------------------------------------------------------- round 1
  function round1(ctx, t, FM) {
    const clr = span(t, a.r2 - .2, a.r2 + 1.1);                 // the round clears (everything withdraws to where it came from)
    if (clr >= 1 || t < a.pong - .5) return;
    const back = 1 - expoIn(clr);
    // Pong again ("the Pong team"): a paddle rises at the dish's edge and a ball rallies across to the programs' side; the ball goes
    // back into the paddle and the paddle sinks before the rally curves take the middle
    const pg = expoOut(span(t, a.pong - .2, a.pong + .6)) * (1 - expoIn(span(t, a.learned - .6, a.learned - .1)));
    if (pg > 0) {
      const px = FM.c[0] + FM.r * 1.22, py = FM.c[1] + 20 * Math.sin(t * 1.4);
      const rally = span(t, a.pong + .5, a.learned - .7), ballA = smooth(clamp(rally * 12)) * (1 - smooth(span(rally, .94, 1)));
      if (ballA > 0) {
        const per = 1.6, ph = ((t - a.pong - .5) / per) % 1, tri = 1 - Math.abs(ph * 2 - 1);      // out to the programs and back
        const bx = lerp(px + 20, 1250, sineIO(tri) * (1 - smooth(span(rally, .9, 1)))), by = FM.c[1] + 90 * Math.sin((t - a.pong) * 2.3);
        halo(ctx, bx, by, 34, .5 * ballA, P.halo0, P.core0); ctx.fillStyle = rgba(P.cream, ballA); ctx.beginPath(); ctx.arc(bx, by, 9, 0, 6.2832); ctx.fill();
      }
      F.glyph(ctx, 'paddle', px, py, 90 * pg, {});
    }
    if (t < a.threeStd - .5) return;
    // the three programs draw themselves, one by one; older → greyer
    const dim = smooth(span(t, a.older + .4, a.older + 1.2));
    PROG.forEach(([x, y], i) => program(ctx, t, x, y, 104, span(t, a.threeStd - .1 + i * .16, a.threeStd + .7 + i * .16), { dim, scale: back }));
    // the practice: the same short bar under each side; "far more practice" stretches the cool one
    const pu = expoOut(span(t, a.tiny - .1, a.tiny + .6)) * back, far = expoOut(span(t, a.farMore + .1, a.farMore + 1.5));
    const pulse = 1 + .6 * bump(t, a.short - .1, 1.0);
    if (pu > 0) {
      ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(P.core1, .9); ctx.lineWidth = 9 * pulse; ctx.beginPath(); ctx.moveTo(PRAC.g, PRAC.y); ctx.lineTo(PRAC.g + PRAC.short * pu, PRAC.y); ctx.stroke();
      halo(ctx, PRAC.g + PRAC.short * pu, PRAC.y, 40, .35, P.halo0, P.core0);
      const cl = (PRAC.short + (PRAC.long - PRAC.short) * far) * pu;
      ctx.strokeStyle = rgba(COOL.mid, .9); ctx.lineWidth = 9 * pulse; ctx.beginPath(); ctx.moveTo(PRAC.c, PRAC.y); ctx.lineTo(PRAC.c + cl, PRAC.y); ctx.stroke();
      halo(ctx, PRAC.c + cl, PRAC.y, 40, .35, COOL.edge, COOL.core);
      const su = F.rise(span(t, a.tiny, a.tiny + .7)) * (1 - expoIn(span(t, a.farMore - .2, a.farMore + .3)));
      if (su > 0) F.maskLine(ctx, [['SAME PRACTICE', 0]], 960, PRAC.y + 10, 26, su, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
      const mu = F.rise(span(t, a.farMore + .2, a.farMore + .9)) * back;
      if (mu > 0) F.maskLine(ctx, [['FAR MORE PRACTICE', 0]], PRAC.c + 10, PRAC.y - 26, 24, mu, { serif: false, weight: 600, col: COOL.mid, glow: false });
    }
    // the rally curves: a faint baseline, gold climbs fast, cool slowly; later (far more practice) the cool one climbs past the gold
    const cu = span(t, a.learned - .1, a.rallies + .5);
    if (cu > 0) {
      const undo = expoIn(clr), win = sineIO(span(t, a.farMore + .8, a.beats + .6));
      const n = 40, gold = [], cool = [];
      for (let k = 0; k <= n; k++) {
        const x = k / n, X = lerp(PLOT.x0, PLOT.x1, x);
        gold.push([X, PLOT.y0 - (PLOT.y0 - PLOT.gTop) * (1 - Math.exp(-3.2 * x)) / (1 - Math.exp(-3.2))]);
        cool.push([X, PLOT.y0 - lerp((PLOT.y0 - PLOT.cTop) * x ** 1.3, (PLOT.y0 - PLOT.cWin) * x ** 1.15, win)]);
      }
      ctx.strokeStyle = rgba(P.halo2, .3); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(PLOT.x0, PLOT.y0); ctx.lineTo(lerp(PLOT.x0, PLOT.x1 + 20, smooth(clamp(cu * 3)) * (1 - undo)), PLOT.y0); ctx.stroke();
      const gu = smooth(span(t, a.learned, a.rallies + .2)) * (1 - undo), cc = smooth(span(t, a.learned + .15, a.rallies + .5)) * (1 - undo);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = rgba(COOL.mid, .95); ctx.lineWidth = 6; polyTo(ctx, cool, cc);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, .25); ctx.lineWidth = 18; polyTo(ctx, gold, gu); ctx.restore();
      ctx.strokeStyle = rgba(P.core1, 1); ctx.lineWidth = 6; polyTo(ctx, gold, gu);
      if (cc > 0) { const e = cool[Math.round(cc * n)]; halo(ctx, e[0], e[1], 30, .4, COOL.edge, COOL.core); }
      const ru = F.rise(span(t, a.rallies - .3, a.rallies + .4)) * (1 - expoIn(clr));
      if (ru > 0) F.maskLine(ctx, [['RALLIES', 0]], (PLOT.x0 + PLOT.x1) / 2, PLOT.y0 + 38, 24, ru, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
    }
  }

  // ---------------------------------------------------------------------------------------------------------------- round 2
  function round2(ctx, t, FM, layer) {
    if (t < a.presented - .6 || t > a.r3 + .2) return;
    const s = FM.r / TEAM[2], [cx, cy] = FM.c;                       // the boxes ride with the camera (zoom and drift)
    const fold = sineIO(span(t, a.todays + .1, a.todays + 1.2));    // the team folds back into the one dish
    const posOf = (k) => { const g = GRID[k], d = Math.hypot(g[0], g[1] * 1.2), out = expoOut(span(t, a.fifteen - .1 + d * .09, a.fifteen + .75 + d * .09)) * (1 - fold);
      return [cx + g[0] * GSTEP * s * out, cy + g[1] * GSTEP * s * out, out]; };
    if (layer === 'back') {
      // the talk's frame (presented) draws round the stage
      const fu = smooth(span(t, a.presented - .2, a.presented + 1.0)) * (1 - smooth(span(t, a.todays, a.todays + .8)));
      if (fu > 0) { const pts = [[SLIDE.x, SLIDE.y], [SLIDE.x + SLIDE.w, SLIDE.y], [SLIDE.x + SLIDE.w, SLIDE.y + SLIDE.h], [SLIDE.x, SLIDE.y + SLIDE.h], [SLIDE.x, SLIDE.y]];
        ctx.strokeStyle = rgba(P.halo2, .28); ctx.lineWidth = 2; polyTo(ctx, pts, fu); }
      // the links (linked into a team): gold lines between neighbours; they glow on "Linked boxes, working together"
      const lu = smooth(span(t, a.linked - .1, a.linked + .8)) * (1 - smooth(span(t, a.todays, a.todays + .5)));
      if (lu > 0) {
        const glow = .55 + .45 * smooth(span(t, a.linkedB - .1, a.linkedB + .6)) * (1 - smooth(span(t, a.n70 + 1.5, a.n70 + 3)));
        ctx.lineCap = 'round';
        for (let k = 0; k < GRID.length; k++) for (const nb of [k + 1, k + 5]) {
          if (nb >= GRID.length || (nb === k + 1 && GRID[k][0] === 2)) continue;
          const p = posOf(k), q = posOf(nb);
          ctx.strokeStyle = rgba(P.halo0, .65 * glow); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], q[0], lu), lerp(p[1], q[1], lu)); ctx.stroke();
          if (glow > .6 && lu >= 1) { const u = (t * .9 + k * .37) % 1; halo(ctx, lerp(p[0], q[0], u), lerp(p[1], q[1], u), 14, .5 * (glow - .55) * 2, P.halo0, P.core0); }
        }
      }
      // the clones (behind the original dish, which is drawn next)
      for (let k = 0; k < GRID.length; k++) {
        const [x, y, out] = posOf(k); if (k === 7 || out <= .01) continue;
        const r = FM.r * (.55 + .45 * smooth(clamp(out * 2)));
        F.dish(ctx, t, F.fieldMap(x, y, r), { ...FIELD_DISH, net: { lit: .95, ambient: .6, w: 1, nSparks: 3 } });
        if (k === BEST) { const b = bump(t, a.best - .1, 2.2); if (b > 0) halo(ctx, x, y, r * 3, .55 * b, P.halo0, P.core0); }
      }
      return;
    }
    // ---- front: the label, the test, the bars, the catch text
    const lb = F.rise(span(t, a.fifteen, a.fifteen + .7)) * (1 - expoIn(span(t, a.todays, a.todays + .5)));
    if (lb > 0) F.maskLine(ctx, [['15 BOXES', 0]], cx, cy - GSTEP * s * 1.5 - 28, 30, lb, { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
    // the test: a spark runs from the team into a grid; the grid grows from that corner; a little figure steps to the goal
    const sp = span(t, a.test - .1, a.test + .5), start = [TG.x0, TG.y0 + 3 * TG.dy];
    if (sp > 0 && sp < 1) { const e = sineIO(sp), x0 = cx + 2.6 * GSTEP * s, y0 = cy; const x = lerp(x0, start[0], e), y = lerp(y0, start[1], e) - Math.sin(Math.PI * e) * 60; halo(ctx, x, y, 34, .8, P.halo0, P.core0); }
    const gone = (i, j) => expoIn(span(t, a.older2 - .5 + (Math.hypot(6 - i, j) * .05), a.older2 + .1 + (Math.hypot(6 - i, j) * .05)));
    if (t > a.test + .3 && t < a.older2 + 1) {
      for (let i = 0; i < TG.nx; i++) for (let j = 0; j < TG.ny; j++) {
        const d = Math.hypot(i, 3 - j), g = expoOut(span(t, a.test + .35 + d * .07, a.test + .8 + d * .07)) * (1 - gone(i, j));
        if (g <= 0) continue;
        const x = TG.x0 + i * TG.dx, y = TG.y0 + j * TG.dy;
        ctx.fillStyle = rgba(COOL.mid, .55); ctx.beginPath(); ctx.arc(x, y, 6 * g, 0, 6.2832); ctx.fill();
      }
      const gs = expoOut(span(t, a.test + .7, a.test + 1.4)) * (1 - gone(6, 0));
      if (gs > 0) { halo(ctx, TG.x0 + 6 * TG.dx, TG.y0, 60 * gs, .4, P.halo0, P.core0); F.glyph(ctx, 'star', TG.x0 + 6 * TG.dx, TG.y0, 40 * gs, {}); }
      // the figure: born from the spark at the start, hops along the path (an arc per step)
      const born = expoOut(span(t, a.test + .4, a.test + .8)) * (1 - gone(6, 0));
      if (born > 0) {
        const hop = span(t, a.steer + .25, a.goal + .15) * (PATH.length - 1), k = Math.min(PATH.length - 2, Math.floor(hop)), f = sineIO(hop - k);
        const [i0, j0] = PATH[k], [i1, j1] = PATH[k + 1];
        const x = TG.x0 + lerp(i0, i1, f) * TG.dx, y = TG.y0 + lerp(j0, j1, f) * TG.dy - Math.sin(Math.PI * f) * 16;
        halo(ctx, x, y - 12, 44, .45 * born, P.halo0, P.core0);
        ctx.save(); ctx.translate(x, y); ctx.scale(born, born); ctx.fillStyle = P.core1;
        ctx.beginPath(); ctx.arc(0, -26, 9, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.moveTo(-11, 0); ctx.quadraticCurveTo(-9, -18, 0, -18); ctx.quadraticCurveTo(9, -18, 11, 0); ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
    // the results: a baseline, three bars rising on their numbers (old program cool, one box gold, the team brighter gold)
    const clr = expoIn(span(t, a.todays + .1, a.todays + .8));
    const bl = smooth(span(t, a.older2 - .1, a.older2 + .7)) * (1 - clr);
    if (bl > 0) { ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(BARS.x[0] - 90, BARS.base + 1); ctx.lineTo(BARS.x[0] - 90 + (BARS.x[2] - BARS.x[0] + 180) * bl, BARS.base + 1); ctx.stroke(); }
    const tk = [a.n32, a.n40, a.n70], dimOld = 1 - .55 * smooth(span(t, a.again + .3, a.todays + .2));
    for (let k = 0; k < 3; k++) {
      const g = expoOut(span(t, tk[k] - .25, tk[k] + .7)) * (1 - clr); if (g <= 0) continue;
      const h = BARS.v[k] * BARS.per * g, x = BARS.x[k] - BARS.w / 2, cool = k === 0;
      ctx.save(); ctx.globalAlpha = cool ? dimOld : 1;
      ctx.fillStyle = cool ? lin(ctx, 0, BARS.base - h, 0, BARS.base, [[0, COOL.core], [.5, COOL.mid], [1, COOL.edge]]) : E.rad(ctx, BARS.x[k], BARS.base - h * .3, Math.max(h, 1), [[0, P.core0], [.45, P.core1], [1, P.halo0]]);
      ctx.beginPath(); ctx.roundRect(x, BARS.base - h, BARS.w, h, [8, 8, 0, 0]); ctx.fill();
      halo(ctx, BARS.x[k], BARS.base - h * .5, h * .8, cool ? .14 : (k === 2 ? .3 : .2), cool ? COOL.edge : P.halo0, cool ? COOL.mid : P.core1);
      F.maskLine(ctx, [[`${BARS.v[k]}`, 0]], BARS.x[k], BARS.base - h - 24, 72, F.rise(span(t, tk[k], tk[k] + .7)) * (1 - clr), { align: 'center', col: cool ? COOL.core : P.cream, glow: !cool });
      // its source under the baseline: an old program · one box · the team
      const iu = expoOut(span(t, tk[k] - .5, tk[k] + .3)) * (1 - clr), iy = BARS.base + 52;
      if (k === 0) program(ctx, t, BARS.x[k], iy, 52, iu, { dim: .6 * (1 - dimOld) / .55 + .3 });
      else if (k === 1) F.dish(ctx, t, F.fieldMap(BARS.x[k], iy, 24 * iu), { ...FIELD_DISH, chip: 0, net: { lit: 1, ambient: .5, w: .8, nSparks: 2 } });
      else { ctx.fillStyle = rgba(P.core1, .9); for (const [gi, gj] of GRID) { ctx.beginPath(); ctx.arc(BARS.x[k] + gi * 15, iy + gj * 15, 4.5 * iu, 0, 6.2832); ctx.fill(); } halo(ctx, BARS.x[k], iy, 50 * iu, .3, P.halo0, P.core1); }
      ctx.restore();
    }
    // sparks feed the gold bars: from the best single box to bar 2, from the whole team to bar 3
    for (const [k, t0, from] of [[1, a.n40 - .9, BEST], [2, a.n70 - .9, 7]]) {
      const u = span(t, t0, t0 + .75); if (u <= 0 || u >= 1) continue;
      const [x0, y0] = posOf(from), e = sineIO(u), x = lerp(x0, BARS.x[k], e), y = lerp(y0, BARS.base, e) - Math.sin(Math.PI * e) * 120;
      halo(ctx, x, y, 34, .8, P.halo0, P.core0);
    }
    // the second catch, spelled out: ONE COMPANY · ONE TALK · NO PAPER YET (rising one per phrase, centre of the stage)
    const lines = [['ONE COMPANY', a.oneCo], ['ONE TALK', a.oneTalk], ['NO PAPER YET', a.paper]];
    lines.forEach(([txt, t0], i) => {
      const u = F.rise(span(t, t0 - .1, t0 + .6)) * (1 - expoIn(span(t, a.todays + .1 + i * .06, a.todays + .6 + i * .06)));
      if (u > 0) F.maskLine(ctx, [[txt, 0]], 975, 640 + i * 52, 30, u, { serif: false, weight: 600, align: 'center', col: i === 2 ? P.cream : P.halo2, glow: false });
    });
  }
}
