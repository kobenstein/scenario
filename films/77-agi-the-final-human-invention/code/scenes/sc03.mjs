// c03 · B1 · today: the lecture hall · A.G.I. = ultraintelligent machine · Hassabis + stake · C1 · STEP 1 / STEP 2 · your list ·
// ★ ANCHOR THE BOARD (STILL WAITING, four rows) · the test stamp · row 4 empty · the second half → the mini board.
// 'Because today, people are trying' → 'Start with the one you pay'. Plan: docs/shots.md 1.14–1.26. One entry, one draw function.
// Inner seam c02 → c03: the first frames continue c02's own draw (scene().with) and take its card over: it tips forward, falls as a strip of
// light, the camera tilts down after it, and it lands as the light pool on a lecture-hall stage.
//
// | ID   | anchor (phrase)            | motif                                                                                        | type  | carrier → next        |
// |------|----------------------------|----------------------------------------------------------------------------------------------|-------|-----------------------|
// | 1.14 | Because today              | the card tips, falls into a lecture hall and becomes the stage light; a speaker small at the lectern, rows of seats | SCENE | the projection screen |
// | 1.15 | They call it               | the camera pushes into the projection screen: ULTRAINTELLIGENT MACHINE = A.G.I. (gold flap row)  | EXPL  | the =                 |
// | 1.16 | Demis Hassabis             | the = bars spread into a name card's rules: DEMIS HASSABIS · CO-FOUNDER, GOOGLE DEEPMIND · HAS A STAKE IN THIS | MIX | the card |
// | 1.17 | His plan                   | under the name an empty slot opens (dashed, gold corners): HIS PLAN                           | EXPL  | the slot              |
// | C1   | T.clip('C1')               | the plate grows out of the slot and returns into it                                          | CLIP  | the slot              |
// | 1.18 | Jack Good's promise        | the top rule stretches into Good's band; the slot opens into STEP 1 / STEP 2 rows, a gold ?   | EXPL  | the ?                 |
// | 1.19 | So check it                | you walk in, the ? drops onto a slip in your hand: YOUR OWN LIST                             | MIX   | the slip              |
// | 1.20 | What are you still waiting | ★ the slip grows into THE BOARD (THE FOUR LINES), statuses flap WAITING; you small below it   | EXPL  | the rows              |
// | 1.21 | Energy that costs          | row 1 flaps ENERGY · a dashed plug: ALMOST FREE                                              | EXPL  | row 2                 |
// | 1.22 | Materials for a battery    | row 2 flaps MATERIALS · a dashed battery with seven day ticks: A WEEK                        | EXPL  | row 3                 |
// | 1.23 | Answers to puzzles         | row 3 flaps DISCOVERY · a dashed dot sheet: UNSOLVED FOR GENERATIONS                         | EXPL  | the board             |
// | 1.24 | For each line              | the test stamp drops and hovers over the board: HAS THE INVENTING BEGUN?                     | EXPL  | the stamp             |
// | 1.25 | And leave a fourth         | row 4 stays blank, a cream glow; its flaps twitch and do not turn                            | EXPL  | row 4                 |
// | 1.26 | It belongs to the second   | the band's dashed cover slides over row 4: THE SECOND HALF; the board shrinks to the corner (mini) | EXPL | the mini board, you |
import * as F from '../lib/f77_kit.mjs';
import * as S from '../lib/f77_seams.mjs';
import { seamGlow, seamZ } from '../lib/b1_extra.mjs';
import { scene as scene02, anchors as anchors02 } from './sc02.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER, COOL, EARTH } = F;

export const PRINT = F.PRINT77;
export function anchors(T, R) {
  const G = (p, after = R.a - .3) => T.G(p, 0, after);
  const a = { t0: R.a, end: R.b };
  a.build = G('build that machine'); a.call = G('They call it'); a.agi = G('A.G.I.', a.call);
  a.demis = G('Demis Hassabis'); a.cof = G('co-founded', a.demis); a.stake = G('a stake', a.demis);
  a.plan = G('His plan'); const c = T.clip('C1'); a.c1 = { start: c.start, end: c.end };
  a.jack = G("Jack Good's promise"); a.builder = G("builder's words", a.jack);
  a.check = G('So check it'); a.list = G('own list', a.check);
  a.what = G('What are you still'); a.waiting = G('waiting for', a.what);
  a.energy = G('Energy that costs'); a.almost = G('almost nothing', a.energy);
  a.mat = G('Materials for a battery'); a.week = G('lasts a week', a.mat);
  a.answers = G('Answers to puzzles'); a.gen = G('for generations', a.answers);
  a.each = G('For each line'); a.test = G('one test', a.each); a.has = G('has the inventing begun', a.each);
  a.leave = G('And leave a fourth'); a.empty = G('line empty', a.leave);
  a.belongs = G('It belongs to the second'); a.second = G('second half', a.belongs); a.sent = G('sentence', a.second);
  return a;
}
export default async (T, R) => {
  const R2 = { a: T.G('Here is the promise'), b: R.a };
  const c02 = scene02(anchors02(T, R2), T);
  return [{ t: R.a, draw: scene(anchors(T, R), T, c02), print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ layout (screen px)
const SCR = { x: 580, y: 66, w: 760, h: 428 };                 // the projection screen in the hall (the portal window)
const POOL = [1180, 626];                                        // the stage's light pool (the card lands here), the lectern above it
const NAME = { top: 300, bot: 600, x0: 510, x1: 1410 };          // the name card's rules
const SLOT = { x: 960, y: 760, w: 560, h: 150 };
const STEPS = { x: 470, w: 980, h: 78, y: [500, 590] };
const BANDP = { x: 960, y: 290, s: .62 };                        // Good's band beside the steps (scaled)
const BIG = { x: 400, y: 130, s: 1.5 }, MINI = { x: 1585, y: 64, s: .42 };   // THE BOARD big (the anchor) and in the corner (B2's mini position)
const BRD = { w: 600, rowH: 78, head: 112, cells: 14, title: 'THE FOUR LINES' };
const YOU = { x: 250, feet: 868, h: 200 };
const rowRect = (i, b) => ({ x: b.x + 20 * b.s, y: b.y + (BRD.head + i * BRD.rowH) * b.s, w: (BRD.w - 40) * b.s, h: BRD.rowH * b.s });

function scene(a, T, c02) {
  const t0 = a.t0, C3 = c02.card3, Q3 = C3.Q3;
  // ---------------------------------------------------------------- times
  const tTip1 = t0 + .55, tLand = t0 + 1.95, tCam1 = t0 + 2.2;
  const D = (t) => H * sineIO(span(t, t0 + .2, tCam1));        // the camera tilts down after the falling card
  const tCone0 = tLand - .05, tCone1 = tLand + .6;
  const tPush0 = a.call - .15, tPush1 = a.call + .95;            // portal: into the projection screen
  const tEq = a.call + .55, tSpread0 = a.demis - .3, tSpread1 = a.demis + .4;
  const tSlot = a.plan - .05, W1 = a.c1;
  const tPlateIn = W1.start - .35, tPlateOut = W1.end - .95;   // long, single-eased morphs (clipPlate eases m itself)
  const tStep = a.jack - .1, tQ = a.builder + .1;
  const tYou0 = a.check - .25, tYou1 = a.check + .95, tDrop0 = a.check + .35, tDrop1 = a.check + .95;
  const tGrow0 = a.what - .15, tGrow1 = a.what + .7;             // the slip grows into the board
  const tStamp = a.test - .1, tStampOut = a.leave - .25;
  const tCover0 = a.belongs + .05, tCover1 = a.belongs + .75, tMini0 = a.sent + .05, tMini1 = Math.min(a.end - .25, a.sent + 1.45);
  // ---------------------------------------------------------------- 1.14 the hall (identity screen space)
  const coneL = (t) => expoOut(span(t, tCone0, tCone1)) * (.93 + .07 * Math.sin(t * 2.3) * Math.sin(t * .7));
  const MOTES = (() => { const r = F.prng(5), m = []; for (let i = 0; i < 34; i++) m.push([r(), r(), .3 + r() * .7, r() * 6]); return m; })();
  const SEATS = (() => { const r = F.prng(14), rows = []; for (let k = 0; k < 5; k++) { const y = 724 + k * 82, n = 9 + k * 2, s = []; for (let i = 0; i < n; i++) s.push({ f: (i + .5) / n + (r() - .5) * .02, head: r() < .72, hh: .85 + r() * .3, ph: r() * 6 }); rows.push({ y, s, sc: .55 + k * .2 }); } return rows; })();
  const drawHall = (ctx, t, o = {}) => {
    const L = coneL(t), scrL = o.scr ?? 0;
    ctx.fillStyle = F.lin(ctx, 0, -40, 0, H, [[0, mixHex(P.night0, P.ind0, .2)], [.6, mixHex(P.night1, P.ind1, .45)], [1, P.night0]]); ctx.fillRect(-40, -40, W + 80, H + 80);
    ctx.fillStyle = rgba(P.blue1, .14); for (let x = 90; x < W; x += 230) ctx.fillRect(x, 0, 3, 640);                         // wall panels
    ctx.fillStyle = mixHex(P.night0, P.ind2, .3); ctx.fillRect(-40, -40, W + 80, 26);                                         // the ceiling beam
    // the projection screen: dark glass with a cool rim (B lives in it)
    ctx.fillStyle = rgba(P.night0, .9); ctx.fillRect(SCR.x, SCR.y, SCR.w, SCR.h);
    ctx.strokeStyle = rgba(COOL.line, .45 + .45 * scrL); ctx.lineWidth = 3; ctx.strokeRect(SCR.x, SCR.y, SCR.w, SCR.h);
    if (scrL > 0) F.halo(ctx, SCR.x + SCR.w / 2, SCR.y + SCR.h / 2, SCR.w * .75, .25 * scrL, COOL.halo, COOL.core);
    // the stage
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .28); F.poly(ctx, [[400, 598], [1520, 598], [1640, 646], [280, 646]]); ctx.fill();
    ctx.fillStyle = mixHex(P.night0, P.ind2, .55); ctx.fillRect(280, 646, 1360, 56);
    ctx.fillStyle = rgba(GOLD.line, .25 + .35 * L); ctx.fillRect(280, 645, 1360, 2);
    if (L > 0) {   // the spot: a cone from above onto the lectern, its pool on the stage (the card's light)
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = F.lin(ctx, 0, -40, 0, POOL[1], [[0, rgba(GOLD.core, .02 * L)], [1, rgba(GOLD.hot, .2 * L)]]);
      const top = lerp(POOL[1], -40, L); F.poly(ctx, [[POOL[0] - 40 * L, top], [POOL[0] + 40 * L, top], [POOL[0] + 150, POOL[1]], [POOL[0] - 150, POOL[1]]]); ctx.fill();
      ctx.restore();
    }
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.rad(ctx, POOL[0], POOL[1], 170, [[0, rgba(GOLD.hot, .55)], [.6, rgba(GOLD.body, .2)], [1, rgba(GOLD.body, 0)]]);
    ctx.save(); ctx.translate(POOL[0], POOL[1]); ctx.scale(1, .16); ctx.translate(-POOL[0], -POOL[1]); ctx.fillRect(POOL[0] - 170, POOL[1] - 170, 340, 340); ctx.restore(); ctx.restore();
    if (L > 0) for (const [u, v, sp, ph] of MOTES) {   // dust in the spot (it drifts up slowly: the hall breathes)
      const q = (v + t * .035 * sp) % 1, y = lerp(POOL[1] - 10, 0, q), x = POOL[0] + (u - .5) * lerp(280, 60, q) + 6 * Math.sin(t * .6 + ph);
      ctx.fillStyle = rgba(GOLD.core, .5 * L * Math.sin(Math.PI * q)); ctx.fillRect(x, y, 2.2, 2.2);
    }
    if (!o.noSpeaker) drawSpeaker(ctx, t, L);
    // the seats: curved tiers, heads in indigo, their top edges catch the stage light
    for (const row of SEATS) {
      for (const st of row.s) {
        const x = lerp(-80, W + 80, st.f), y = row.y + 26 * Math.pow((st.f - .5) * 2, 2) * row.sc, s = 36 * row.sc;
        ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.beginPath(); ctx.roundRect(x - s * .9, y - s * .55, s * 1.8, s * 1.6, s * .3); ctx.fill();
        ctx.fillStyle = rgba(mixHex(P.blue1, GOLD.line, .4 * L), .5); ctx.fillRect(x - s * .8, y - s * .55, s * 1.6, 2);
        if (st.head) { ctx.fillStyle = mixHex(P.ind1, P.blue0, .3); ctx.beginPath(); ctx.arc(x + Math.sin(t * .7 + st.ph) * 3.5, y - s * .8 * st.hh + Math.sin(t * .5 + st.ph * 2) * 1.5, s * .42, 0, 6.29); ctx.fill(); ctx.fillRect(x - s * .5, y - s * .6, s, s * .4); }
      }
    }
  };
  const drawSpeaker = (ctx, t, L) => {
    F.person(ctx, POOL[0] + 8, 612, 172, { dir: -1, lean: .03 + .02 * Math.sin(t * .9), look: .1, armR: [.6 + .18 * Math.sin(t * 1.3) * Math.sin(t * .45), 1.1 + .25 * Math.sin(t * 1.1)], armL: [.2, .3], light: -(.2 + .7 * L) });
    ctx.fillStyle = mixHex(P.blue1, P.ind2, .35); F.poly(ctx, [[POOL[0] - 52, 520], [POOL[0] + 52, 520], [POOL[0] + 40, 628], [POOL[0] - 40, 628]]); ctx.fill();
    ctx.fillStyle = rgba(GOLD.line, .3 + .4 * L); ctx.fillRect(POOL[0] - 52, 519, 104, 3);
  };
  // the card from c02: it tips forward about its bottom edge, becomes a strip of light, falls (the camera after it) and lands as the pool
  const drawCardFall = (ctx, t) => {
    if (t > tLand + .02) return;
    const piv = [Q3.x, Q3.y + Q3.h], th0 = C3.tilt(t), tp = span(t, t0, tTip1), phi = Math.PI / 2 * tp * tp;
    if (tp < 1) {
      ctx.save(); ctx.translate(...piv); ctx.rotate(th0); ctx.scale(1, Math.max(.01, Math.cos(phi))); ctx.translate(-piv[0], -piv[1]);
      C3.face(t)(ctx);
      F.capsLabel(ctx, 'I. J. GOOD, 1965 · “SPECULATIONS CONCERNING THE FIRST ULTRAINTELLIGENT MACHINE”, P. 78', Q3.x + 4, Q3.y + Q3.h + 48, 1 - span(t, t0, t0 + .25), { size: 22, align: 'left' });
      ctx.restore();
      return;
    }
    const f = span(t, tTip1, tLand), e = sineIO(f), g = f * f;
    const cx0 = Q3.x + Q3.w / 2, cy0 = piv[1] + Math.sin(th0) * Q3.w / 2;
    const cx = lerp(cx0, POOL[0], e), cy = lerp(cy0, POOL[1] + H, g), w = lerp(Q3.w, 300, e), h = lerp(8, 12, e);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(th0 * (1 - e));
    F.halo(ctx, 0, 0, w * .5, .5 * e, GOLD.halo, GOLD.core);
    ctx.fillStyle = F.lin(ctx, -w / 2, 0, w / 2, 0, [[0, rgba(mixHex(PAPER.lit, GOLD.body, e), .6)], [.5, mixHex(PAPER.lit, GOLD.hot, e)], [1, rgba(mixHex(PAPER.lit, GOLD.body, e), .6)]]);
    ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.restore();
  };
  // ---------------------------------------------------------------- B: the content behind the projection screen (identity space, night)
  const agiRow = { x: 1130, y: 452, w: 400, h: 92 };
  const eqAt = (t) => {   // the two bars of '=': centre, half length, the gap (they spread into the name card's rules)
    const s = quartIO(span(t, tSpread0, tSpread1));
    return { y1: lerp(486, NAME.top, s), y2: lerp(514, NAME.bot, s), x0: lerp(924, NAME.x0, s), x1: lerp(996, NAME.x1, s), s };
  };
  const drawB = (ctx, t) => {
    F.night(ctx, t, seamGlow(t, a.end, .5 + .1 * Math.sin(t * .9)));   // the light swells into the seam (lib/b1_extra)
    // 1.15 ULTRAINTELLIGENT MACHINE = A.G.I.
    const sinkL = span(t, tSpread0 - .25, tSpread0 + .1);
    F.maskLine(ctx, [['ultraintelligent machine', 0]], 520, 512, 66, rise(span(t, a.call - .25, a.call + .35) * (1 - sinkL)), { serif: true, col: CREAM, glow: false, align: 'center' });
    F.capsLabel(ctx, 'I. J. GOOD, 1965', 520, 568, span(t, a.call + .1, a.call + .6) * (1 - sinkL), { size: 24 });
    const ag = span(t, a.agi - .1, a.agi + .55);
    if (t > a.agi - .3 && t < tSpread0 + .2) {
      ctx.save(); ctx.beginPath(); ctx.rect(agiRow.x - 10, agiRow.y - 10, (agiRow.w + 20) * (1 - sinkL), agiRow.h + 20); ctx.clip();
      F.boardRow(ctx, t, agiRow.x, agiRow.y, agiRow.w, agiRow.h, { text: 'A.G.I.', from: '', flip: ag, gold: smooth(ag), lit: .6 * (1 - span(t, a.agi + .3, a.agi + 1.2)) }, { cells: 7 });
      ctx.restore();
    }
    F.capsLabel(ctx, 'THEY CALL IT A.G.I.', 960, 700, span(t, a.agi + .1, a.agi + .7) * (1 - sinkL), { size: 26, col: CREAM });
    // the '=' (gold): it appears between the two, then its bars spread into the name card's rules
    const eu = expoOut(span(t, tEq, tEq + .45)), q = eqAt(t), out = sineIO(span(t, a.jack - .45, a.jack + .1));
    if (eu > 0 && out < 1) {
      const cx = (q.x0 + q.x1) / 2, hw = (q.x1 - q.x0) / 2 * eu * (1 - out);
      for (const y of [q.y1, q.y2]) F.goldSpan(ctx, [[cx - hw, y], [cx + hw, y]], 0, 1, { w: lerp(5, 1.6, q.s), spark: false });
    }
    // 1.16 the name card between the rules
    const nu = span(t, a.demis - .05, a.demis + .55) * (1 - span(t, a.jack - .5, a.jack - .1));
    F.maskLine(ctx, [['Demis Hassabis', 0]], 960, 432, 88, rise(nu), { serif: true, col: CREAM, glow: true, align: 'center' });
    F.capsLabel(ctx, 'CO-FOUNDER, GOOGLE DEEPMIND', 960, 492, span(t, a.cof - .05, a.cof + .5) * (1 - span(t, a.jack - .5, a.jack - .1)), { size: 28, col: CREAM });
    const su = span(t, a.stake - .05, a.stake + .5) * (1 - span(t, a.jack - .5, a.jack - .1));
    if (su > 0) F.verdict(ctx, t, 960, 560, 'HAS A STAKE IN THIS', su, { size: 30 });
    // 1.17 the slot (and C1 grows out of it, 1.18 it opens into the two steps)
    const slotU = expoOut(span(t, tSlot, tSlot + .5)) * (1 - span(t, tStep, tStep + .35));
    if (slotU > 0) F.slot(ctx, t, SLOT.x, SLOT.y, SLOT.w, SLOT.h, { u: slotU });
    F.capsLabel(ctx, 'HIS PLAN', 960, 660, span(t, a.plan, a.plan + .5) * (1 - span(t, tPlateIn - .3, tPlateIn)), { size: 26, col: CREAM });
    // 1.18 Good's band grows out of the top rule; the two steps flap in out of the slot; a gold ? after EVERYTHING ELSE
    const bu = span(t, tStep, tStep + .9), bOut = span(t, a.check - .1, a.check + .6);
    if (bu > 0 && bOut < 1) {
      ctx.save(); ctx.translate(BANDP.x, BANDP.y); ctx.scale(BANDP.s, BANDP.s);
      F.band(ctx, t, 0, 0, S.BAND.w, S.BAND.h, { u: bu * (1 - bOut), w0: (NAME.x1 - NAME.x0) / BANDP.s, h0: 6, type: 1, gold: smooth(span(t, tStep + .5, tStep + 1.1)), cover: 1, empty: 0 });
      ctx.restore();
    }
    const qx = STEPS.x + STEPS.w + 34, qy = STEPS.y[1] + STEPS.h / 2 + 22;
    STEPS.y.forEach((y, i) => {
      const op = expoOut(span(t, tStep + i * .12, tStep + .55 + i * .12)), cl = 1 - sineIO(span(t, a.check + i * .08, a.check + .6 + i * .08)); if (op <= 0 || cl <= 0) return;
      const cy = lerp(SLOT.y, y + STEPS.h / 2, op), w = lerp(SLOT.w, STEPS.w, op) * cl;
      ctx.save(); ctx.beginPath(); ctx.rect(SLOT.x - w / 2, cy - STEPS.h / 2 - 4, w, STEPS.h + 8); ctx.clip();
      F.boardRow(ctx, t, STEPS.x, cy - STEPS.h / 2, STEPS.w, STEPS.h, { text: i ? 'STEP 2 · SOLVE EVERYTHING ELSE' : 'STEP 1 · SOLVE INTELLIGENCE', from: '', flip: span(t, tStep + .25 + i * .55, tStep + 1.25 + i * .55), gold: i ? .25 : 0 }, { cells: 30, size: 30 });
      ctx.restore();
    });
    // 1.19 you walk in; the ? drops onto the slip in your hand
    const zc = seamZ(t, a.end); ctx.save(); if (zc !== 1) { ctx.translate(W / 2, H / 2); ctx.scale(zc, zc); ctx.translate(-W / 2, -H / 2); }   // the creep on you (= c04's camera)
    const you = drawYou(ctx, t); ctx.restore();
    if (t > tQ - .2 && t < tGrow0 + .1) {
      const hand = you ? you.slip : [YOU.x + 60, YOU.feet - 120], d = span(t, tDrop0, tDrop1), e = d * d;
      const x = lerp(qx, hand[0], sineIO(d)), y = lerp(qy, hand[1] - 18, e) - Math.sin(Math.PI * d) * 120, s = lerp(66, 30, d);
      const qu = span(t, tQ, tQ + .4) * (1 - span(t, tDrop1, tDrop1 + .15));
      if (qu > 0) F.maskLine(ctx, [['?', 1]], x, y, s, d > 0 ? 1 : rise(qu), { serif: true, col: GOLD.body, glow: true, align: 'center' });
    }
    F.capsLabel(ctx, 'YOUR OWN LIST', YOU.x + 150, YOU.feet - 150, span(t, a.list - .1, a.list + .45) * (1 - span(t, tGrow0, tGrow0 + .3)), { size: 26, col: CREAM, align: 'left' });
    drawBoard(ctx, t, you);
  };
  // you (bottom left), the slip of paper in your right hand
  const drawYou = (ctx, t) => {
    if (t < tYou0) return null;
    const p = F.powOut(span(t, tYou0, tYou1), 1.6), travel = 520, M = Math.round(travel / 120), ph = Math.PI * 2 * M * (1 - p) + Math.PI * 2, sw = Math.sin(ph);
    const raise = smooth(span(t, tYou1 - .35, tYou1 + .15)), lk = lerp(.2, .95, smooth(span(t, tGrow0, tGrow1))) + .03 * Math.sin(t * .8);
    const armR = [lerp(-.42 * sw, 1.25, raise), lerp(-.42 * sw + .3, 1.75, raise)];
    const hd = F.du(ctx, YOU.x - travel * (1 - p), YOU.feet, YOU.h, { dir: 1, walk: ph, look: lk, armR, armL: [.42 * sw * (1 - raise), (.42 * sw + .3) * (1 - raise) + .1], light: .75 });
    const hp = hd?.R ?? [YOU.x + 50, YOU.feet - 120], sl = [hp[0] + 16, hp[1] - 22];
    const slipU = smooth(span(t, tYou1 - .3, tYou1 + .1));
    if (slipU > 0 && t < tGrow0 + .02) drawSlip(ctx, sl[0], sl[1], 64 * slipU, 46 * slipU, -.12);
    return { slip: sl };
  };
  const drawSlip = (ctx, x, y, w, h, rot) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = F.lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 3); ctx.fill();
    ctx.fillStyle = rgba(PAPER.ink, .45); for (let i = 0; i < 4; i++) ctx.fillRect(-w / 2 + 8, -h / 2 + 9 + i * h * .2, w * (i === 3 ? .35 : .7), 2);
    ctx.restore();
  };
  // ---------------------------------------------------------------- 1.20–1.26 THE BOARD (★): grows out of the slip, then goes to the corner
  const boardPose = (t) => { const m = quartIO(span(t, tMini0, tMini1)), arc = Math.sin(Math.PI * m) * -60; return { x: lerp(BIG.x, MINI.x, m), y: lerp(BIG.y, MINI.y, m) + arc, s: Math.exp(lerp(Math.log(BIG.s), Math.log(MINI.s), m)), m }; };
  const rowsAt = (t, u = 1) => {
    const st = (i) => span(t, a.waiting - .1 + i * .12, a.waiting + .5 + i * .12);
    const txt = [[a.energy, 'ENERGY'], [a.mat, 'MATERIALS'], [a.answers, 'DISCOVERY']];
    const rows = txt.map(([ta, s], i) => ({ text: t > ta - .15 ? s : '', from: '', flip: span(t, ta - .12, ta + .55), status: 'WAITING', statusFrom: '', statusFlip: st(i), lit: .8 * Math.sin(Math.PI * span(t, ta - .1, ta + .7)) }));
    const glow = Math.sin(Math.PI * span(t, a.leave, a.empty + 1.1));
    rows.push({ dashed: true, lit: glow, a: smooth(span(u, .62, 1)) });
    return rows;
  };
  const drawBoard = (ctx, t, you) => {
    if (t < tGrow0) return;
    const g = span(t, tGrow0, tGrow1), e = quartIO(g), P0 = boardPose(t), bw = BRD.w * P0.s, bh = (BRD.head + 4 * BRD.rowH + 30) * P0.s;
    if (g < 1) {   // the slip lifts out of your hand and grows into the board's panel (paper cools into the board's indigo)
      const sl = you?.slip ?? [YOU.x + 66, YOU.feet - 150], c = [lerp(sl[0], P0.x + bw / 2, e), lerp(sl[1], P0.y + bh / 2, e) - Math.sin(Math.PI * e) * 80];
      const w = lerp(64, bw, e), h = lerp(46, bh, e);
      ctx.save(); ctx.translate(...c); ctx.rotate(-.12 * (1 - e));
      ctx.fillStyle = mixHex(PAPER.lit, mixHex(P.night1, P.ind1, .55), smooth(span(e, .2, .9))); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, lerp(3, 14 * P0.s, e)); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, .6 * e); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    }
    const u = span(t, tGrow0 + .55, tGrow1 + .75); if (u <= 0) return;
    const glow = 1 - P0.m;
    const b = F.board(ctx, t, P0.x, P0.y, { w: BRD.w, rowH: BRD.rowH, head: BRD.head, title: BRD.title, cells: BRD.cells, rows: rowsAt(t, u), u, s: P0.s, glow, mini: P0.m >= 1 });
    // dashed icons beside rows 1–3 (imagined), with their small labels; they leave before the board goes to the corner
    const iconOut = span(t, a.leave - .3, a.leave + .2);
    const IC = [['plug', a.energy + .25, a.almost, 'ALMOST FREE'], ['battery', a.mat + .3, a.week, 'A WEEK'], ['sheet', a.answers + .3, a.gen, 'UNSOLVED FOR GENERATIONS']];
    IC.forEach(([k, ti, tl, lab], i) => {
      const r = rowRect(i, BIG), x = BIG.x + BRD.w * BIG.s + 70, y = r.y + r.h / 2, iu = smooth(span(t, ti, ti + .7)) * (1 - iconOut);
      if (iu <= 0 || P0.m > 0) return;
      if (k === 'sheet') {
        F.outline(ctx, [F.rectPts(x - 34, y - 26, 68, 52, 6)], iu, { dashed: true, t, w: 2.2 });
        const r2 = F.prng(9); for (let d = 0; d < 9; d++) { const px = x - 24 + r2() * 48, py = y - 16 + r2() * 32; ctx.fillStyle = rgba(CREAM, .8 * iu); ctx.beginPath(); ctx.arc(px, py, 2.6, 0, 6.29); ctx.fill(); }
      } else F.lineIcon(ctx, k, x, y, 40, { u: iu, dashed: true, t, w: 2.4 });
      if (k === 'battery') for (let d = 0; d < 7; d++) { const k2 = span(iu, .3 + d * .08, .45 + d * .08); if (k2 > 0) { ctx.fillStyle = rgba(CREAM, .85 * k2); ctx.fillRect(x - 24 + d * 6.4, y - 9, 3.4, 18 * k2); } }
      F.capsLabel(ctx, lab, x + 62, y + 9, span(t, tl - .1, tl + .45) * (1 - iconOut), { size: 24, col: CREAM, align: 'left' });
    });
    // 1.24 the test stamp drops and hovers over the board's top right; it rises away before the fourth line
    const su = span(t, tStamp, tStamp + .5), sOut = expoIn(span(t, tStampOut, tStampOut + .6));
    if (su > 0 && sOut < 1) F.testStamp(ctx, t, BIG.x + BRD.w * BIG.s - 10, BIG.y + 70 + 6 * Math.sin(t * 1.6) - sOut * 500, 118, { u: su, rot: -.12 + .03 * Math.sin(t * .9) });
    // 1.25 row 4's flaps twitch and fall back (they do not turn)
    // 1.26 the band's dashed cover slides over row 4 (it travels with the board into the corner)
    const cv = quartIO(span(t, tCover0, tCover1));
    if (cv > 0) {
      ctx.save(); ctx.translate(P0.x, P0.y); ctx.scale(P0.s, P0.s);
      const rx = 20, ry = BRD.head + 3 * BRD.rowH + 3, rw = BRD.w - 40, rh = BRD.rowH - 6, dx = (1 - cv) * (W / P0.s);
      ctx.translate(rx + rw / 2 + dx, ry + rh / 2);
      ctx.fillStyle = mixHex(P.night0, P.ind0, .45); ctx.beginPath(); ctx.roundRect(-rw / 2, -rh / 2, rw, rh, 6); ctx.fill();
      ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(CREAM, .09); ctx.lineWidth = 2; for (let q = -rw; q < rw; q += 22) { ctx.beginPath(); ctx.moveTo(q, -rh / 2); ctx.lineTo(q + rh, rh / 2); ctx.stroke(); } ctx.restore();
      ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.2; ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 12; ctx.beginPath(); ctx.roundRect(-rw / 2, -rh / 2, rw, rh, 6); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
    }
    const r4 = rowRect(3, BIG);
    F.capsLabel(ctx, 'THE SECOND HALF', r4.x + r4.w + 48, r4.y + r4.h / 2 + 10, span(t, a.second - .05, a.second + .45) * (1 - span(t, tMini0 - .3, tMini0 + .1)), { size: 28, col: CREAM, align: 'left' });
    return b;
  };

  // ======================================================================================================================== draw
  return (ctx, t) => {
    const d = D(t);
    if (t < tCam1 + .02) {   // the hand-over: c02 goes on (it scrolls up with the tilt), the card falls, the hall rises into frame
      ctx.save(); ctx.translate(0, -d);
      if (d < H) c02.with(ctx, t, { noCard3: true, qOut: span(t, t0, t0 + .45) });
      ctx.translate(0, H); F.portal(ctx, 0, SCR, (c) => drawHall(c, t, { noSpeaker: true }), (c) => drawB(c, t), { over: (c) => drawSpeaker(c, t, coneL(t)) }); ctx.translate(0, -H);
      drawCardFall(ctx, t);
      ctx.restore();
      return;
    }
    if (t < tPush1) {   // the hall; the projection screen shows B; the camera pushes into it (it ends exactly on B's identity frame)
      const u = span(t, tPush0, tPush1), scr = smooth(span(t, a.call - .6, a.call));
      F.portal(ctx, u, SCR, (c) => drawHall(c, t, { scr, noSpeaker: true }), (c) => drawB(c, t), { over: (c) => drawSpeaker(c, t, coneL(t)) });
      return;
    }
    // B breathes: one slow push and back between the portal and the mini board (z = 1 exactly at both ends)
    const zb = 1 + .016 * Math.sin(Math.PI * span(t, tPush1, tMini0)) ** 1.5;
    F.look(ctx, W / 2, H / 2, zb, () => drawB(ctx, t));
    // C1: the plate grows out of the slot and returns into it (anchored only on T.clip)
    if (t > tPlateIn - .02 && t < W1.end + .2) {
      const m = span(t, tPlateIn, tPlateIn + 1.2) * (1 - span(t, tPlateOut, W1.end + .15));
      const [sx, sy] = F.lookPt(W / 2, H / 2, zb, SLOT.x - SLOT.w / 2, SLOT.y - SLOT.h / 2);
      if (m > 0) F.clipPlate(ctx, t, T, 'C1', { from: { x: sx, y: sy, w: SLOT.w * zb, h: SLOT.h * zb }, morph: m });
    }
  };
}
export { scene };
