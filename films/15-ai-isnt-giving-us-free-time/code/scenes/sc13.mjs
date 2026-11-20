// Film 13 · c13 (s21 + s22, 534.00–582.52) · builder B3 · "The factories came first … trips into nature kept falling."
// Owner direction (binding): flat editorial graphics on ONE line (c12's floor = a time line), the hourglass only as the anchor of
// the turn ("Before the machine hands out the time. Not after."), no flight through a sand world.
//   seam   END of c12: the week on the wall, you on the floor line, years under it (lib/f13_b3_plan.mjs at CAMB) — same call
//   13.01  explainer · time line: a factory rises at 1800; the weekend lifts out of the week and lands as a rule sheet in the 1930s;
//          an envelope rises in the 1990s; the evenings lift out and land in 2017 (RIGHT TO DISCONNECT). Again and again: an arc
//          from each machine to its rule; "the hours were already gone": sand runs out of each gap, through the line
//   13.02  the week folds into its one saved hour ("time never arrives on its own"); you walk to it, take it, and lay it down
//          on the line AHEAD of now ("when we decide, ahead of time"): a slab of gold light
//   13.03★ anchor (hook echo): the hand of light comes down from the upper right with the hourglass under its fingertips —
//          "Before the machine hands out the time" — and sets it on the slab that was there first: "Not after."
//   13.04  explainer · the line is a base line: more time than any machine before it: small bars over a washer, an envelope,
//          a phone; a giant bar of light rises behind the hourglass. "And we need it": you look up
//   13.05  explainer · two falling curves on the same line: TIME WITH FRIENDS (USA, 2003–2023, ATUS) and TRIPS INTO NATURE
//          (USA, 1980s–2000s, Pergams & Zaradic, PNAS 2008); "kept falling": the curves fall into the line
//          → c14: the line is the horizon; you and the hourglass stand on it (END13)
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as K from '../lib/f13_kit.mjs';
import * as B from '../lib/f13_b3_kit.mjs';
import * as PL from '../lib/f13_b3_plan.mjs';
import { SY12 } from './sc11.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, prng } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;

export default async (T, R) => {
  E.prepareEditorial();
  const A = (w, n) => T.S('s21', w, n), Z = (w, n) => T.S('s22', w, n);
  const a = {
    T0: R.a, fact: A('factories'), first: A('first'), weekend: A('weekend'), gen: A('generations'), later: A('later'), email: A('Email'), evenings: A('evenings'),
    years: A('years'), before: A('before'), france: A('France'), sw: A('switch'), again: A('Again'), machine: A('machine'), rule: A('rule'), after: A('after'),
    bythen: A('By then'), gone: A('gone'), never: A('never'), own: A('own'), arrives: A('It arrives'), decide: A('decide'), ahead: A('ahead'), belongs: A('belongs'),
    thistime: A('And this time'), wecan: A('we can'), before2: A('Before the'), hands: A('hands'), notafter: A('Not after'),
    si: Z('Superintelligence'), more: Z('more time'), any: Z('any machine'), it: Z('before it'), need: Z('need'), america: Z('America'), friends: Z('friends'),
    shrinking: Z('shrinking'), twenty: Z('twenty'), decades: Z('decades'), eighties: Z('nineteen'), trips: Z('trips'), nature: Z('nature'), falling: Z('falling'), end: R.b,
  };
  return [{ t: R.a, draw: chunk(a), print: K.PRINT13 }];
};

const C = PL.CAMB, LY = PL.FLOOR_Y * C.s + C.ty;                  // the line (927.8)
const X = (yr) => PL.toS(C, PL.xYear(yr), 0)[0];
const DUH = PL.DU_H * C.s, wDu = (sx) => (sx - C.tx) / C.s;        // you: screen height; screen x → world x for the planner call
const DU0 = PL.toS(C, PL.DU_X, 0)[0], DU1 = 1110, DU2 = 1395;       // you: start (end of c12), after the first step, at the slab
const SLAB = { x: 1585, w: 150, h: 13 };
const HG = { h: 200 };
const HO = { pose: 'open', spread: .2, curl: .12 }, ANG = 2.42, HL = 300;
const hmAt = (wx, wy, sc = 1) => E.handMatrix(wx, wy, ANG, HL * sc, -1);
const TIP = (() => { const m = hmAt(0, 0), p = E.handTip(HO, 1); return E.applyM(m, p[0], p[1]); })();
// screen rectangle of a group of cells (at CAMB)
const cellsBox = (ids) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const i of ids) { const [x, y] = PL.toS(C, ...PL.cellXY(i)); x0 = Math.min(x0, x - PL.PL.w * C.s / 2); x1 = Math.max(x1, x + PL.PL.w * C.s / 2); y0 = Math.min(y0, y - PL.PL.h * C.s / 2); y1 = Math.max(y1, y + PL.PL.h * C.s / 2); } return [x0, y0, x1, y1]; };
const WKB = cellsBox(PL.WEEKEND), EVB = cellsBox(PL.EVENING), HRB = cellsBox([PL.HOUR]);
// the two curves (data on a 0..1 scale of their own panel; honest shapes, no numbers on screen)
const FRIENDS = [[0, .9], [.25, .8], [.5, .68], [.65, .62], [.85, .44], [1, .5]];   // ATUS minutes with friends 2003 → 2023 (~60 → ~33 min/day; the 2020 dip)
const NATURE = [[0, .88], [.2, .9], [.4, .84], [.6, .78], [.8, .73], [1, .69]];      // per-capita nature recreation, peak ~1987 → −18–25 % by 2006
const P1 = { x0: 150, x1: 1250 }, P2 = P1, PTOP = 230;   // one curve at a time, one label each

function flyRect(b0, b1, u, arc = 120) {   // a rectangle that travels on an arc (b = [x0,y0,x1,y1])
  const k = sineIO(u), cx = lerp((b0[0] + b0[2]) / 2, (b1[0] + b1[2]) / 2, k), cy = lerp((b0[1] + b0[3]) / 2, (b1[1] + b1[3]) / 2, k) - arc * Math.sin(Math.PI * k);
  const w = lerp(b0[2] - b0[0], b1[2] - b1[0], k), h = lerp(b0[3] - b0[1], b1[3] - b1[1], k);
  return [cx, cy + h / 2, w, h];   // base middle, w, h
}
function curveOf(data, p, flat) {   // screen points of a curve over panel p; flat 0..1 = fallen into the line
  return E.catmull(data.map(([u, v]) => [lerp(p.x0, p.x1, u), lerp(lerp(LY, PTOP, v), LY - 2, flat), 3.5]), 10);
}

function chunk(a) {
  const tWk0 = a.weekend - .25, tWk1 = a.gen + .5, tEv0 = a.france - .1, tEv1 = a.sw + .3;
  const tCol0 = tEv1 + .15, tCol1 = tCol0 + 1.6;   // the week folds into its saved hour once both rules have left it: the upper frame is free for the gaps
  const tHr0 = a.arrives, tHr1 = a.decide + .3, tLay0 = a.ahead - .05, tLay1 = a.belongs + .1;
  const tHand0 = a.before2 - 1.4, tHand1 = a.notafter + .15, tHandOut0 = a.si + .1, tHandOut1 = a.more + .4;
  const out1 = (d = 0) => 1 - expoIn(span(t_, a.never - .9 + d, a.never - .2 + d));   // the past sinks into the line
  let t_ = 0;
  const grains = (() => { const r = prng(61), g = []; for (let i = 0; i < 160; i++) g.push([r(), r(), r(), r()]); return g; })();

  return (ctx, t) => {
    t_ = t;
    B.bgNight(ctx, t, { dawn: .15 + .25 * sineIO(span(t, a.si, a.end)), stars: .6, sy: SY12 });
    B.setView(t); B.applyView(ctx);
    // ---- you ----
    const walk1 = span(t, a.T0 + .25, a.first + .9), walk2 = span(t, tHr0 - .1, tHr1 + .2);
    let duX = DU0, walkPh = null;
    if (walk1 > 0 && walk1 < 1) { duX = lerp(DU0, DU1, sineIO(walk1)); walkPh = (DU0 - duX) / 26; }
    else if (walk1 >= 1) duX = DU1;
    if (walk2 > 0) { duX = lerp(DU1, DU2, sineIO(walk2)); if (walk2 < 1) walkPh = (duX - DU1) / 26; }
    const duDir = walk1 > 0 && walk1 < 1 ? -1 : 1;
    const lay = span(t, tLay0, tLay1), hold = span(t, tHr1 - .6, tHr1) * (1 - span(t, tLay1 - .2, tLay1 + .4));
    const duO = walkPh != null ? { walk: walkPh, dir: duDir, view: 'side' } : { dir: 1 };
    if (hold > 0) Object.assign(duO, { armR: [lerp(.15, 1.2, sineIO(hold)) + .4 * sineIO(lay), lerp(.1, 1.5, sineIO(hold))], armL: [lerp(-.15, .9, sineIO(hold)), lerp(-.08, 1.3, sineIO(hold))] });
    const look = (1 - sineIO(span(t, a.T0 + .1, a.T0 + .9))) + sineIO(span(t, a.thistime - .2, a.wecan)) * (1 - .6 * sineIO(span(t, a.notafter + .2, a.si + .5))) + sineIO(span(t, a.need - .4, a.need + .3)) * (1 - sineIO(span(t, a.friends, a.friends + 1)));

    // ---- the week, the floor line, the years (the planner keeps drawing until it has folded away) ----
    const empty = new Float32Array(PL.N_CELLS); empty[PL.HOUR] = 1;
    const wkLift = smooth(span(t, tWk0 + .1, tWk0 + 1.1)), evLift = smooth(span(t, tEv0 + .1, tEv0 + 1.1));   // the week refills behind the lifted rule
    for (const i of PL.WEEKEND) empty[i] = 1 - wkLift;
    for (const i of PL.EVENING) empty[i] = 1 - evLift;
    const collapse = span(t, tCol0, tCol1);
    PL.planner(ctx, t, {
      cam: C, coinUp: 1, cellU: 1, gold: [0, 0], empty, chips: [], guard: 0, glow: 0, collapse, hourOff: t >= tCol1,
      duX: wDu(duX), duOff: true, floorU: 1, ticksU: 1, ticksOut: expoIn(span(t, a.never - .9, a.never - .1)),
    });
    // the floor line stays the hero line to the end (the planner draws it; under the slab a pool of warm light later)

    // ===== 13.01 · the time line (large: each thing owns the upper frame) =====
    if (t < a.never + .2) {
      const clipUp = () => { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, LY - 1); ctx.clip(); };
      // "Again and again": the GAP from each machine to its rule rises from the line as a bar of light (the hours it cost),
      // its length written in it; "the hours were already gone": it drains as sand through the line
      const gu = span(t, a.bythen - .1, a.gone + 1.0);
      const GAPS = [[X(1800) + 30, X(1938), 0, 'GENERATIONS', 110], [X(1995) - 80, X(2017) + 80, 1, 'YEARS', 110]];
      const gapH = GAPS.map(([x0, x1, j]) => 360 * expoOut(span(t, a.again + j * .7, a.again + 1.1 + j * .7)) * out1(.3 + j * .05) * (1 - smooth(span(gu, .05 + j * .1, .85 + j * .1))));
      GAPS.forEach(([x0, x1, j], k) => {
        const hgt = gapH[k]; if (hgt <= 1) return;
        const bp = new Path2D(); bp.roundRect(x0, LY - 2 - hgt, x1 - x0, hgt, [12, 12, 0, 0]);
        clipUp(); E.lightShape(ctx, bp, t, { lit: 1, seed: 70 + j, glow: .45, dust: 0, cy: -.45 }); ctx.restore();
      });
      // factory (the machine) at 1800, rises from the line
      const fu = rise(span(t, a.fact - .15, a.first + .1)) * out1(0);
      if (fu > 0) { clipUp(); E.icon(ctx, 'factory', X(1800) + 30, LY - 150 + (1 - fu) * 320, 300, t, { lit: 0, seed: 71 }); ctx.restore(); }
      // envelope at the 1990s
      const eu = rise(span(t, a.email - .2, a.email + .55)) * out1(.08);
      if (eu > 0) { clipUp(); B.machine(ctx, 'envelope', X(1995) - 30, LY - 6 + (1 - eu) * 260, 210, t, { seed: 72 }); ctx.restore(); }
      // the weekend and the evenings lift out of the week and land as rule sheets on their years
      for (const [b0, yr, t0, t1, d] of [[WKB, 1938, tWk0, tWk1, .16], [EVB, 2017, tEv0, tEv1, .24]]) {
        const u = span(t, t0, t1); if (u <= 0) continue;
        const sw = 150, sh = 210, b1 = [X(yr) - sw / 2, LY - sh - 2, X(yr) + sw / 2, LY - 2];
        const [x, y, w, h] = flyRect(b0, b1, u, yr === 1938 ? 160 : 40), o = out1(d);
        if (o <= 0) continue;
        clipUp();
        B.ruleSheet(ctx, x, y + (1 - o) * (h + 6), w, h, t, { lines: smooth(span(u, .6, 1)), seed: yr, a: smooth(span(u, 0, .3)), glow: .7 * smooth(span(u, 0, .5)) });
        ctx.restore();
        if (u >= 1 && t - t1 < .5) halo(ctx, x, LY, 150 * (1 - (t - t1) * 2), .5, P.halo1, P.halo0);
      }
      // one label at a time, over the thing just named (phone-readable)
      const Lb = (s, x, y, t0, t1, col) => B.label(ctx, s, x, y, rise(span(t, t0, t0 + .7)) * (1 - smooth(span(t, t1 - .3, t1 + .2))), { col });
      Lb('FACTORIES', X(1800) + 30, LY - 360, a.fact + .1, a.weekend - .3); Lb('WEEKEND', X(1938), LY - 270, tWk1 - .3, a.email - .2, P.halo0);
      Lb('EMAIL', X(1995) - 30, LY - 238, a.email + .2, a.france - .2); Lb('RIGHT TO DISCONNECT', X(2017) - 160, LY - 238, tEv1 - .3, a.again + .1, P.halo0);
      // the gap lengths, written in the light (dark on light), and the pulses: the machine first (cool), the rule after (warm)
      GAPS.forEach(([x0, x1, j, txt, sz], k) => {
        const hgt = gapH[k]; if (hgt <= 1) return;
        const nu = rise(span(t, a.again + .35 + j * .7, a.again + 1.05 + j * .7)) * (1 - smooth(span(t, a.bythen - .3, a.bythen + .3)));
        B.label(ctx, txt, (x0 + x1) / 2 + (j ? 0 : 60), LY - hgt + 112, nu, { serif: true, size: sz, col: P.night0, glow: false });
        const pm = Math.sin(Math.PI * span(t, a.machine - .1, a.machine + .7)), pr = Math.sin(Math.PI * span(t, a.rule - .1, a.rule + .7));
        if (pm > 0) halo(ctx, j ? X(1995) - 30 : X(1800) + 30, LY - 130, 230, .5 * pm, P.blue0, B.COOL);
        if (pr > 0) halo(ctx, j ? X(2017) : X(1938), LY - 110, 230, .55 * pr, P.halo1, P.halo0);
        // the hours already gone: sand rains out of the draining bar, through the line, down out of the frame
        if (gu > 0 && gu < 1) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          for (const [r0, r1, r2, r3] of grains) {
            const st0 = r2 * .55, q = (gu - st0) / .45; if (q <= 0 || q >= 1) continue;
            const gx = lerp(x0 + 14, x1 - 14, (r0 + r3 * .37) % 1), gy = LY - hgt * r1 + q * q * 560;
            ctx.fillStyle = r1 > .4 ? P.core1 : P.halo0; ctx.globalAlpha = .9 * (1 - q * .4); ctx.fillRect(gx - 1.6, gy - 1.6, 3.2, 4.2);
          }
          ctx.restore();
        }
      });
    }

    // ===== 13.02 · the saved hour: you take it and lay it down ahead of now =====
    if (t >= tCol1 - .02) {
      const hu = sineIO(span(t, tHr0 + .2, tHr1)), lu = sineIO(lay);
      const hb0 = HRB, hand = [duX + 30, LY - DUH * .5], hb1 = [hand[0] - 30, hand[1] - 14, hand[0] + 30, hand[1] + 14];
      let x, y, w, h;
      if (lu <= 0) { [x, y, w, h] = flyRect(hb0, hb1, hu, 60); }
      else { [x, y, w, h] = flyRect(hb1, [SLAB.x - SLAB.w / 2, LY - SLAB.h, SLAB.x + SLAB.w / 2, LY], lu, 70); }
      const p = new Path2D(); p.roundRect(x - w / 2, y - h, w, h, Math.min(w, h) * .25);
      E.lightShape(ctx, p, t, { lit: 1, dust: 0, glow: .7, seed: 81 });
      halo(ctx, x, y - h / 2, 70 + 40 * lu, .35 + .25 * Math.sin(Math.PI * span(t, a.belongs - .1, a.belongs + .9)), P.halo1, P.halo0);
      if (lu >= 1) {   // a pool of warm light on the line round the slab
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(SLAB.x, LY + 2); ctx.scale(1, .12);
        const pool = smooth(span(t, tLay1, tLay1 + .8));
        ctx.fillStyle = E.rad(ctx, 0, 0, 420, [[0, rgba(P.halo1, .45 * pool)], [.5, rgba(P.halo1, .12 * pool)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 420, 0, 6.29); ctx.fill(); ctx.restore();
      }
    }
    // you (over the line, under the hand)
    const lk = clamp(look);   // same call as the planner's at the seam (look 1 at the end of c12)
    E.du(ctx, duX, LY, DUH, { dir: 1, look: .25 + .75 * lk, lean: -.03 * lk, light: 1, back: .25, armR: [.15, .1], armL: [-.15, -.08], ...duO });

    // ===== 13.03 · the hand of light sets the hourglass on the slab =====
    const hIn = span(t, tHand0, tHand1), hOut = span(t, tHandOut0, tHandOut1);
    const base = [SLAB.x, LY - SLAB.h];
    const flowU = smooth(span(t, a.si - .2, a.si + .8));
    const sandTop = lerp(.72, .42, smooth(span(t, a.si, a.end))), sandBot = lerp(.22, .52, smooth(span(t, a.si, a.end)));
    if (hIn > 0) {
      // the glide: an arc from beyond the upper right to the slab; contact at "Not after"
      const k = hIn < 1 ? 1 - (1 - hIn) ** 2.2 : 1, P0 = [W + 260, -200], C1 = [1900, 260];
      const hx = (1 - k) ** 2 * P0[0] + 2 * (1 - k) * k * C1[0] + k * k * base[0], hy = (1 - k) ** 2 * P0[1] + 2 * (1 - k) * k * C1[1] + k * k * base[1];
      const settle = hIn >= 1 ? 0 : 0, hgB = [hx, hy + settle];
      // the hand: holds the glass just above its top; lets go after contact, then rises back out
      const away = sineIO(hOut), lift = 26 * sineIO(span(t, a.notafter + .1, a.notafter + .9));
      const wx = hgB[0] - 30 - TIP[0] + 340 * away, wy = hgB[1] - HG.h - 34 - TIP[1] - lift - 520 * away * away;
      if (hOut < 1) E.lightHand(ctx, hmAt(wx, wy), t, { ...HO, spread: .2 + .25 * smooth(span(t, a.notafter, a.notafter + .7)), lum: .78, dust: 3000 });
      const contact = Math.sin(Math.PI * span(t, a.notafter - .05, a.notafter + .55));
      if (contact > 0) { halo(ctx, base[0], base[1], 220 * contact, .45 * contact, P.halo1, P.core1); E.dust(ctx, 91, 200, base[0], base[1] - 8, 120 * contact + 20, 12, t, .8 * contact); }
      // the giant bar of "more time" rises behind the hourglass (from the slab)
      const bu = expoOut(span(t, a.more - .25, a.more + 1.0)) * (1 - expoIn(span(t, a.america - .3, a.america + .6)));
      if (bu > 0) { const bh = 760 * bu, bp = new Path2D(); bp.roundRect(base[0] - 70, base[1] - bh, 140, bh, [14, 14, 0, 0]); ctx.save(); ctx.beginPath(); ctx.rect(0, -400, W, base[1] + 400); ctx.clip(); E.lightShape(ctx, bp, t, { lit: 1, seed: 82, glow: .5, cy: -.45 }); ctx.restore(); }
      K.hourglass(ctx, hgB[0], hgB[1], HG.h, t, { top: sandTop, bot: sandBot, flow: flowU, light: 1, glow: 1 + .15 * flowU });
    }

    // ===== 13.04 · more time than any machine before it =====
    const MS = [['washer', 320, 330], ['envelope', 640, 230], ['phone', 960, 160]];
    MS.forEach(([nm, x, bh], i) => {
      const u = rise(span(t, a.any - .1 + i * .18, a.any + .6 + i * .18)) * (1 - expoIn(span(t, a.america - .4 + i * .06, a.america + .3 + i * .06)));
      if (u <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(0, -10, W, LY - 1); ctx.clip();
      const bp = new Path2D(); bp.roundRect(x - 75, LY - bh * u - 2, 150, bh * u, [12, 12, 0, 0]); E.lightShape(ctx, bp, t, { lit: 1, seed: 83 + i, glow: .5, dust: 0 });
      B.machine(ctx, nm, x, LY - bh * u - 24 + (1 - u) * 170, 124, t, { seed: 90 + i });   // the machine rides on top of its bar
      ctx.restore();
    });

    // ===== 13.05 · two curves fall into the line =====
    // one curve at a time: friends (falls into the line on "decades"), then nature ("kept falling": falls into the line at the end)
    for (const [data, p, t0, lab, tf0, tf1, tg0, tg1] of [[FRIENDS, P1, a.friends - .6, 'TIME WITH FRIENDS', a.decades - .7, a.decades + .2, a.decades, a.decades + .7],
                                                             [NATURE, P2, a.decades + .5, 'TRIPS INTO NATURE', a.falling - .1, a.end - 1.0, a.end - 1.05, a.end - .12]]) {
      const u = sineIO(span(t, t0, t0 + 2.2)); if (u <= 0) continue;
      const flat = sineIO(span(t, tf0, tf1)), gone2 = sineIO(span(t, tg0, tg1)); if (gone2 >= 1) continue;
      const pts = curveOf(data, p, flat);
      // the light pooled under the curve (clipped to the drawn part)
      const n = Math.max(1, Math.floor(u * (pts.length - 1)));
      if (flat < .98) { const ar = new Path2D(); ar.moveTo(pts[0][0], LY); for (let i = 0; i <= n; i++) ar.lineTo(pts[i][0], pts[i][1]); ar.lineTo(pts[n][0], LY); ar.closePath();
        ctx.save(); ctx.fillStyle = E.lin(ctx, 0, PTOP, 0, LY, [[0, rgba(P.halo0, .4 * (1 - flat))], [.6, rgba(P.halo1, .14 * (1 - flat))], [1, rgba(P.blue0, .04)]]); ctx.fill(ar); ctx.restore(); }
      if (gone2 < 1) K.trailSpan(ctx, pts, gone2, u, { w: 3.5, spark: u < 1 });
      const lu = rise(span(t, t0 + .1, t0 + .9)) * (1 - smooth(span(t, tf0 - .2, tf0 + .5)));
      B.label(ctx, lab, p.x0, PTOP - 60, lu, { align: 'left' });
      const [y0, y1] = data === FRIENDS ? ['2003', '2023'] : ['1980s', '2000s'];   // the two ends, so the drop reads without the voice
      B.label(ctx, y0, p.x0, LY + 98, lu, { align: 'left', serif: true, size: 100 });
      B.label(ctx, y1, p.x1, LY + 98, lu * smooth(span(u, .8, 1)), { align: 'right', serif: true, size: 100 });
    }
  };
}
