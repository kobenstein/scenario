// c06 · B1 · 'Tower or wall' → 'This channel exists for one reason' (seam plate "yes") · shots 4.07–4.16. One entry, one draw function,
// motifs on the voice, carriers between them (never a fade, never a cut).
//
// | ID   | anchor (phrase)            | motif                                                                                          | type | carrier → next       |
// |------|----------------------------|------------------------------------------------------------------------------------------------|------|----------------------|
// | 4.07 | Tower or wall              | DISARM sinks into its rule, the rule stands up as the divider: TOWER | WALL, a height gauge by each | EXPL | the gauges |
// | 4.08 | Which is going up          | both gauge marks hover, a ? on each                                                            | EXPL | the tower gauge      |
// | 4.09 | One lab raised             | a gold column of money pushes up out of the ground under the tower, it shoots up · OPENAI $122 BILLION card | EXPL | the tower |
// | 4.10 | The main drivers now       | the wall slides off, parliament domes rise and shrink beside the tower · §5 (words light as spoken) | MIX | the § card       |
// | 4.11 | The new monopolies         | the § card folds into a gold line to the tower's top: THE NEW MONOPOLIES · §109                 | EXPL | the tower's top tier |
// | 4.12 | A more moral machine       | the camera flies into the top tier: a few people turn dials marked VALUES · §107 · SET BY A FEW | MIX  | a gold wire         |
// | 4.13 | Ask a machine              | down the wire: you at a desk type WHAT IS A GOOD LIFE?; the answer comes back with the tag VALUES SET BY A FEW · OUR EXAMPLE | MIX | the monitor |
// | 4.14 | He also counts             | the monitor becomes a barred vault: patents · algorithms · platforms · data light on their words · §67 | EXPL | the vault door |
// | 4.15 | Shared, not held           | the door swings open, many hands reach in together and leave empty                             | MIX  | the light inside     |
// | 4.16 | A founder of Twitter       | the "yes" card grows out of the vault's light, its word rises on 'yes' → plate (S.plateYes)    | EXPL | the "yes" card (seam) |
// Deviation from the shot list: 4.13 sets you at a desk, not at the kitchen table (docs/MOTION.md keeps the kitchen for c11).
import * as F from '../lib/f63_kit.mjs';
import * as S from '../lib/f63_seams.mjs';
import * as B from '../lib/f63_b1_kit.mjs';
import { createCanvas } from '@napi-rs/canvas';
import { anchorsBabel, drawBabel, babelCam, CAMF, TWR, WAL, DSM, disarmW, CARD } from './sc05.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, GOLD, CREAM, PAPER, lin } = F;
export const PRINT = F.PRINT63;

const TM = [10, 0, .8], WM = [20, 0, .85];        // the split: tower foot → x 480, wall foot centre → x 1440
const DIV = { x: W / 2, y0: 130, y1: 900 };
const GA = { x: 720, y0: 900, y1: 110 }, GB = { x: 1830 };
const LIFT = 300, COLW = 300;
const DOMES = [1160, 1440, 1720];
const Q5 = '“…private, often transnational, parties that are endowed with resources and the capacity to intervene that surpass those of many Governments.”';
const C5 = { x: 1000, y: 90, w: 860, size: 34 };
const Q107 = '“A more moral AI is not enough if that morality is determined by a few.”';
const C107 = { x: 260, y: 70, w: 1400, size: 44 };
const Q67 = '“…new forms of property, such as patents, algorithms, digital platforms, technological infrastructure and data.”';
const C67 = { x: 1080, y: 150, w: 760, size: 36 };
const DY = 1150;                                   // the desk lies this far below the control room (the camera pans down the wire)
const MON = { x: 760, y: 300, w: 540, h: 360 }, VLT = { x: 430, y: 170, w: 560, h: 600 };
const SYM = [['patents', 590, 350], ['algorithms', 830, 350], ['platforms', 590, 590], ['data', 830, 590]];

export default async (T, R) => {
  const G = (p, after = R.a - .3) => T.G(p, 0, after);
  const a = { start: R.a, end: R.b, ...anchorsBabel(T, R.a - 25) };
  a.tow = G('Tower or wall'); a.wallW = G('wall', a.tow); a.which = G('Which is going up'); a.up = G('up', a.which);
  a.lab = G('One lab raised'); a.hundred = G('hundred and', a.lab); a.twenty = G('twenty-two', a.lab); a.billion = G('billion dollars', a.lab); a.single = G('single round', a.lab);
  a.drivers = G('The main drivers'); a.private = G('private parties', a.drivers); a.beyond = G('beyond many', a.drivers); a.govs = G('governments', a.beyond);
  a.mono = G('The new monopolies'); a.monoW = G('monopolies', a.mono);
  a.moral = G('A more moral machine'); a.fewP = G('few people', a.moral); a.morals = G('pick the morals', a.moral);
  a.ask = G('Ask a machine'); a.question = G('hard question', a.ask); a.youGet = G('you get', a.ask); a.somebody = G("somebody's", a.ask); a.values = G('values with', a.ask); a.answer = G('answer', a.values);
  a.counts = G('He also counts'); a.algo = G('algorithms', a.counts); a.plat = G('platforms', a.counts); a.data = G('data among', a.counts); a.everyone = G('everyone', a.data);
  a.shared = G('Shared, not held'); a.notH = G('not held', a.shared); a.few2 = G('few', a.notH);
  a.founder = G('A founder of Twitter'); a.twitter = G('Twitter', a.founder); a.yes = G('yes', a.twitter);
  a.seam = S.seamT(T, 'yes'); a.plate = R.b - S.SEAM_HALF;
  const draw = scene(a, T);
  return [{ t: R.a, draw: (ctx, t) => (t >= a.plate ? S.plateYes(ctx, t, T) : draw(ctx, t)), print: PRINT }];
};

function along(pts, f) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = clamp(f) * L[L.length - 1]; let i = 1; while (i < pts.length - 1 && L[i] < d) i++;
  const q = clamp((d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)];
}
const lerpRect = (A, Bq, u) => ({ x: lerp(A.x, Bq.x, u), y: lerp(A.y, Bq.y, u), w: lerp(A.w, Bq.w, u), h: lerp(A.h, Bq.h, u) });

let C5H = null;
const c5H = () => C5H ?? (C5H = B.qcard(createCanvas(8, 8).getContext('2d'), 0, null, { text: Q5, ...C5, head: 'x', u: 1 }).h);
function scene(a, T) {
  const sp0 = a.tow + .2, sp1 = a.tow + 1.05;                 // the split
  const lift = (t) => 55 * sineIO(span(t, a.lab + .3, a.billion)) + (LIFT - 55) * expoOut(span(t, a.billion - .1, a.billion + .7));
  const wallOut = (t) => expoIn(span(t, a.drivers - .3, a.drivers + .6)) * 1000;
  const fold0 = a.mono - .35, fold1 = a.mono + .1;
  const por0 = a.monoW + .9, por1 = por0 + 1.4;   // the top tier's window opens over the frame (an iris from the tier: the room behind it)
  const pan0 = a.ask - .45, pan1 = a.ask + .55;
  const vm0 = a.counts - .45, vm1 = a.counts + .35;
  const door0 = a.shared - .7, door1 = a.shared + .6;
  const vOut0 = a.founder - .3, vOut1 = a.founder + .6;
  const yesG0 = a.founder - .15, yesG1 = a.twitter + .45;

  // ------------------------------------------------ the tower | wall stage (world = screen after the split)
  const camAt = (t) => { const u = sineIO(span(t, sp0, sp1)), c = babelCam(t, a); return [lerp(c[0], W / 2, u), lerp(c[1], H / 2, u), lerp(c[2], 1, u)]; };
  const towerTop = (t) => [TWR.x + TM[0], TWR.base - lift(t) - TWR.h * TM[2]];
  const gaugeLevelA = (t) => (GA.y0 - towerTop(t)[1]) / (GA.y0 - GA.y1);
  const gaugeLevelB = (WAL.h * WM[2]) / (GA.y0 - GA.y1);
  const drawColumn = (ctx, t) => {
    const L = lift(t); if (L <= .5) return;
    const x = TWR.x + TM[0], top = TWR.base - L, n = Math.ceil(L / 24) + 1;
    ctx.save(); ctx.beginPath(); ctx.rect(x - COLW, -H, COLW * 2, TWR.base + H); ctx.clip();
    for (let k = 0; k < n; k++) {
      const y1 = TWR.base - L + k * 24 + 24, y0 = y1 - 24, wob = (k % 3 - 1) * 5;
      ctx.fillStyle = lin(ctx, x - COLW / 2, 0, x + COLW / 2, 0, [[0, GOLD.shade], [.45, GOLD.body], [.7, GOLD.hot], [1, GOLD.mid]]);
      ctx.fillRect(x - COLW / 2 + wob, y0 + 1, COLW, 22);
      ctx.fillStyle = rgba(GOLD.core, .7); ctx.fillRect(x - COLW / 2 + wob, y0 + 1, COLW, 2);
    }
    ctx.restore();
    F.halo(ctx, x, top + 4, 220, .35 * span(L, 0, 80), GOLD.halo, GOLD.core);
  };
  const drawGauges = (ctx, t) => {
    const ret = expoIn(span(t, a.drivers - .2, a.drivers + .5));
    const hov = span(t, a.which - .05, a.which + .3) * (1 - span(t, a.lab - .2, a.lab + .3)), q = hov;
    const ua = span(t, a.tow + .6, a.tow + 1.3) * (1 - ret), ub = span(t, a.wallW + .05, a.wallW + .75) * (1 - ret);
    if (ua > 0) B.gauge(ctx, t, GA.x, GA.y0, GA.y1, clamp(gaugeLevelA(t) + .025 * Math.sin((t - a.which) * 6.5) * hov, 0, 1), { u: ua, q });
    if (ub > 0) B.gauge(ctx, t, GB.x + WM[0] + wallOut(t), GA.y0, GA.y1, gaugeLevelB + .025 * Math.sin((t - a.which) * 6.5 + 1.7) * hov, { u: ub, q });
  };
  const drawRule = (ctx, t) => {   // DISARM's rule → the divider
    const tw = disarmW(), ry = DSM.y + 16, k = sineIO(span(t, a.tow + .3, a.tow + 1.0));
    const p0 = [lerp(DSM.x - tw / 2, DIV.x, k), lerp(ry, DIV.y1, k)], p1 = [lerp(DSM.x + tw / 2, DIV.x, k), lerp(ry, DIV.y0, k)];
    F.goldSpan(ctx, [p0, p1], 0, 1, { w: 2.2, spark: false });
    const g = ((t - a.disarm) / 2.6) % 1, ga = Math.sin(Math.PI * g);
    F.halo(ctx, lerp(p0[0], p1[0], F.smooth(g)), lerp(p0[1], p1[1], F.smooth(g)), 24 + 8 * ga, .7 * ga, P.halo0, P.core0);
  };
  const drawDomes = (ctx, t) => {
    const sh = sineIO(span(t, a.beyond - .05, a.govs + .35));
    DOMES.forEach((x, i) => {
      const u = span(t, a.drivers + .25 + i * .15, a.drivers + 1.15 + i * .15); if (u <= 0) return;
      B.dome(ctx, t, lerp(x, lerp(1440, x, .62), sh), TWR.base, lerp(260, 150, sh), { u });
    });
    const s = lerp(260, 150, sh);
    F.capsLabel(ctx, 'MANY GOVERNMENTS', 1440, TWR.base - s * .64 - 40, span(t, a.govs - .1, a.govs + .4), { size: 24 });
  };
  const stageLabels = (ctx, t) => {
    const out = span(t, a.lab - .2, a.lab + .2);
    if (out >= 1) return;
    F.maskLine(ctx, [['TOWER', 0]], 480, 200, 72, F.rise(span(t, a.tow + .05, a.tow + .5) * (1 - out)), { serif: true, col: CREAM, glow: false, align: 'center' });
    F.maskLine(ctx, [['WALL', 0]], 1440, 200, 72, F.rise(span(t, a.wallW - .05, a.wallW + .4) * (1 - out)), { serif: true, col: CREAM, glow: false, align: 'center' });
  };
  const drawStage = (ctx, t) => {
    const k = sineIO(span(t, sp0, sp1)), L = lift(t);
    drawBabel(ctx, t, a, T, {
      cam: camAt(t),
      towerM: [TM[0] * k, -L, lerp(1, TM[2], k)], wallM: [WM[0] * k + wallOut(t), 0, lerp(1, WM[2], k)],
      cardOut: span(t, a.tow, a.tow + .6), labOut: span(t, a.tow, a.tow + .35), plaqOut: span(t, a.tow + .05, a.tow + .5),
      noDisarm: t >= a.tow + .3, disarm: { out: span(t, a.tow + .05, a.tow + .4) },
      lit: .35 * span(t, a.billion - .1, a.billion + .5),
      extraBack: (c) => drawColumn(c, t),
      extraWorld: (c) => { if (t >= a.tow + .3) drawRule(c, t); drawGauges(c, t); drawDomes(c, t); stageLabels(c, t); },
    });
  };
  // the screen layer of the stage: the OpenAI card, §5, THE NEW MONOPOLIES
  const drawStageText = (ctx, t) => {
    // OpenAI: one round
    const cu = span(t, a.lab + .15, a.lab + .8), cout = expoIn(span(t, a.drivers - .35, a.drivers + .25));
    if (cu > 0 && cout < 1) {
      const x = 1010, y = 150 - cout * 520, w = 760, h = 236, tt = towerTop(t), cx0 = TWR.x + TM[0] + COLW / 2, cy0 = TWR.base - lift(t) + 30;
      if (cout <= 0) F.goldSpan(ctx, [[cx0, cy0], [x - 40, cy0], [x, y + h - 30]], 0, sineIO(span(t, a.lab + .3, a.lab + .9)), { w: 1.6, spark: false });
      void tt;
      F.paperCard(ctx, t, x, y, w, h, { u: cu, style: 'night' });
      ctx.save(); ctx.globalAlpha *= clamp(cu * 3); ctx.translate(x, y + (1 - expoOut(cu)) * 40);
      F.maskLine(ctx, [['OPENAI · ONE ROUND · 31 MARCH 2026', 0]], 34, 52, 22, F.rise(span(cu, .2, .8)), { serif: false, weight: 600, col: GOLD.text, glow: false });
      const n = Math.round(122 * sineIO(span(t, a.hundred - .1, a.billion + .45)));
      F.goldText(ctx, [[`$${n} BILLION`, 1]], 32, 150, 84, F.rise(span(cu, .3, .9)), { serif: true, glow: true });
      F.maskLine(ctx, [['RAISED AT AN $852 BILLION VALUATION', 0]], 34, 202, 24, F.rise(span(cu, .45, 1)), { serif: false, weight: 600, col: CREAM, glow: false });
      ctx.restore();
    }
    // §5 → folds into the gold line of THE NEW MONOPOLIES
    const u5 = span(t, a.drivers + .15, a.drivers + .8), fold = sineIO(span(t, fold0, fold1));
    let box = null;
    if (u5 > 0 && fold < 1) {
      ctx.save();
      const cy = C5.y + c5H() / 2;
      if (fold > 0) { ctx.translate(0, cy); ctx.scale(1, 1 - fold); ctx.translate(0, -cy); }
      box = B.qcard(ctx, t, T, { text: Q5, ...C5, head: 'MAGNIFICA HUMANITAS · §5', u: u5, spoken: ['private parties', 'many governments'], after: a.drivers, out: span(t, a.mono - .6, a.mono - .3) });
      ctx.restore();
    }
    if (fold > 0 && t < por1) {
      const ly = lerp(C5.y + c5H() / 2, 362, sineIO(span(t, fold1 - .1, fold1 + .4))), tt = towerTop(t), sw = sineIO(span(t, a.mono + .15, a.mono + .8));
      const pL = [lerp(C5.x, 1100, sw), ly], pts = sw > 0 ? [[lerp(1100, tt[0] + 60, sw), lerp(ly, tt[1] + 30, sw)], [1100, ly], [C5.x + C5.w - 120, ly]] : [pL, [C5.x + C5.w, ly]];
      F.goldSpan(ctx, pts, 0, 1, { w: 2.2, spark: false });
      F.goldText(ctx, [['THE NEW MONOPOLIES', 1]], 1430, 336, 76, span(t, a.monoW - .2, a.monoW + .35), { serif: true, glow: true, align: 'center' });
      F.maskLine(ctx, [['“…naming the new monopolies of AI” · §109', 0]], 1430, 420, 32, F.rise(span(t, a.monoW - .05, a.monoW + .45)), { serif: true, col: CREAM, glow: false, align: 'center' });
    }
    void box;
  };
  const drawOutside = (ctx, t) => { drawStage(ctx, t); drawStageText(ctx, t); };

  // ------------------------------------------------ the control room inside the top tier (B of the portal), y offset oy
  const SCR = createCanvas(8, 8).getContext('2d');
  const armOf = (t, i) => { const sw = .06 * Math.sin(t * 1.1 + i * 2.1); return { dir: 1, armR: [1.72 + sw, 1.85 + sw], look: .15, light: 1 }; };
  const dialPos = (t, i) => { const h = F.person(SCR, 470 + i * 360, 860, 300, armOf(t, i)); return [h.R[0] + 56, h.R[1] - 6]; };
  const drawRoom = (ctx, t, oy = 0, o = {}) => {
    ctx.save(); ctx.translate(0, oy); ctx.beginPath(); ctx.rect(-W, -60, W * 3, H + 120); ctx.clip();
    // the back wall: the tier's arches seen from inside
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night1, P.ind1, .4)], [1, mixHex(P.night1, P.ind0, .6)]]); ctx.fillRect(-W, -60, W * 3, H + 120);
    for (let k = 0; k < 6; k++) { const ax = 120 + k * 336; ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.roundRect(ax, 140, 180, 520, [90, 90, 0, 0]); ctx.fill(); ctx.fillStyle = rgba(P.blue1, .12); ctx.fillRect(ax, 140, 180, 3); }
    F.land(ctx, 860);
    F.halo(ctx, 960, 560, 520, .25, GOLD.halo, GOLD.core);
    for (let i = 0; i < 3; i++) {
      const hands = F.person(ctx, 470 + i * 360, 860, 300, armOf(t, i));
      const dx = hands.R[0] + 56, dy = hands.R[1] - 6;
      B.dial(ctx, t, dx, dy, 56, i * .9 - .6 + .55 * Math.sin(t * .9 + i * 2), 'VALUES', { u: 1 });
    }
    F.goldText(ctx, [['SET BY A FEW', 1]], 960, 430, 34, span(t, a.fewP - .1, a.fewP + .4), { serif: false, weight: 700, glow: true, align: 'center', spacing: .08 });
    if (o.card !== false) B.qcard(ctx, t, T, { text: Q107, ...C107, head: 'MAGNIFICA HUMANITAS · §107', u: span(t, a.moral + .05, a.moral + .7), spoken: ['A more moral', 'pick the morals'], after: a.moral - .2 });
    ctx.restore();
  };
  // ------------------------------------------------ the desk (OUR EXAMPLE), y offset oy; mon = the monitor rect (it becomes the vault)
  const drawDesk = (ctx, t, oy = 0, o = {}) => {
    const down = o.down ?? 0;
    ctx.save(); ctx.translate(0, oy);
    if (down < 1) {
      ctx.save(); ctx.translate(0, expoIn(down) * 700);
      F.land(ctx, 860);
      ctx.fillStyle = mixHex(P.ind2, P.blue1, .35); ctx.fillRect(640, 700, 760, 18); ctx.fillRect(670, 718, 16, 142); ctx.fillRect(1354, 718, 16, 142);
      ctx.fillStyle = rgba(P.cream, .45); ctx.fillRect(640, 700, 760, 2);
      ctx.fillStyle = mixHex(P.ind1, P.night1, .2); ctx.fillRect(1010, 660, 40, 40); ctx.fillRect(960, 692, 140, 8);
      ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.beginPath(); ctx.roundRect(700, 688, 190, 12, 3); ctx.fill();
      F.halo(ctx, 1030, 480, 420, .3, P.halo1, P.core1);
      F.du(ctx, 590, 860, 320, { dir: 1, armR: [1.2 + .04 * Math.sin(t * 7), 1.5], armL: [1.0, 1.3], look: .42 + .03 * Math.sin(t * .6), light: 1, back: .25, lean: .05 });
      F.capsLabel(ctx, 'OUR EXAMPLE', 140, 120, span(t, a.ask + .4, a.ask + .9) * (1 - span(t, vm0, vm0 + .3)), { size: 22, align: 'left' });
      ctx.restore();
    }
    ctx.restore();
  };
  const drawMonitor = (ctx, t, r, oy, o = {}) => {
    const m = o.morph ?? 0;
    ctx.save(); ctx.translate(0, oy);
    ctx.fillStyle = lin(ctx, 0, r.y, 0, r.y + r.h, [[0, mixHex(P.night0, P.ind1, .5)], [1, P.night0]]); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, lerp(10, 30, m)); ctx.fill();
    ctx.strokeStyle = mixHex(P.blue1, '#7b86a8', m); ctx.lineWidth = lerp(6, 26, m); ctx.stroke();
    if (m <= 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
      // the question, typed
      const Qs = 'WHAT IS A GOOD LIFE?', qn = Math.floor(Qs.length * span(t, a.ask + .2, a.question + .45)), qw = F.measure(Qs, 26, false, 600) + 40, qx = r.x + r.w - 26 - qw;
      const bu = expoOut(span(t, a.ask, a.ask + .3));
      if (bu > 0) { ctx.fillStyle = mixHex(P.ind2, P.blue1, .35); ctx.beginPath(); ctx.roundRect(qx + qw * (1 - bu), r.y + 30, qw * bu, 54, 14); ctx.fill(); }
      if (qn > 0) F.glowText(ctx, Qs.slice(0, qn) + ((t * 2.5) % 1 < .5 && qn < Qs.length ? '|' : ''), qx + 20, r.y + 66, { size: 26, weight: 600, col: CREAM, glow: false });
      // the answer, with somebody's values
      const au = expoOut(span(t, a.youGet - .1, a.youGet + .4));
      if (au > 0) {
        const ah = 150 * au; ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.beginPath(); ctx.roundRect(r.x + 26, r.y + 104, 400, ah, 14); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.rect(r.x + 26, r.y + 104, 400, ah); ctx.clip();
        B.greek(ctx, r.x + 50, r.y + 134, 350, 4, 28, 67, rgba(P.cream, .55));
        ctx.restore();
      }
      ctx.restore();
    }
    ctx.restore();
  };
  // the wire from the middle dial down to the monitor, and the tag that travels it
  const wirePts = (t) => { const d = dialPos(t, 1); return [[d[0], d[1] + 56], [d[0], d[1] + 330], [MON.x + MON.w - 120, DY + 160], [MON.x + MON.w - 120, DY + MON.y]]; };
  const TAG = [MON.x + 26 + 400 - 150, DY + MON.y + 104 + 150];   // the tag's place: on the answer bubble's lower edge
  const drawTag = (ctx, t, o = {}) => {
    const f = span(t, a.somebody - .9, a.values); if (f <= 0) return;
    const pts = [...wirePts(t).slice(0, 3), [TAG[0], TAG[1] - 90], TAG], p = o.at ?? along(pts, sineIO(f)), tw = F.measure('VALUES SET BY A FEW', 22, false, 600) + 30;
    const sq = F.bump(t, a.values, .3);
    ctx.save(); ctx.translate(p[0], p[1]); ctx.scale((o.s ?? 1) * (1 + .06 * sq), (o.s ?? 1) * (1 - .08 * sq));
    F.halo(ctx, 0, 0, 90, .45, GOLD.halo, GOLD.core);
    ctx.fillStyle = mixHex(GOLD.deep, P.night0, .3); ctx.strokeStyle = GOLD.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-tw / 2, -20, tw, 40, 20); ctx.fill(); ctx.stroke();
    F.glowText(ctx, 'VALUES SET BY A FEW', 0, 8, { size: 22, weight: 600, col: GOLD.text, glow: false, align: 'center' });
    ctx.restore();
  };

  // ------------------------------------------------ the vault
  const drawVault = (ctx, t, r, o = {}) => {
    const door = o.door ?? 0, cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    ctx.save(); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 30); ctx.clip();
    F.halo(ctx, cx, cy, r.w * .8, .3 + .5 * (o.glow ?? 0), GOLD.halo, GOLD.core);
    const lit = o.lit ?? [];
    SYM.forEach(([k, x, y], i) => B.symbol(ctx, k, x, y, 150, o.symU ?? 1, { lit: lit[i] ?? 0 }));
    // the barred door, hinged on the left; it swings toward us (width = cos)
    const c = Math.cos(door * 1.45), dw = r.w * c;
    if (c > .02) {
      ctx.save(); ctx.translate(r.x, 0); ctx.scale(c, 1);
      const bars = 7; ctx.fillStyle = lin(ctx, 0, 0, r.w, 0, [[0, '#5d6787'], [.5, '#8e98b8'], [1, '#4b5373']]);
      for (let k = 0; k < bars; k++) ctx.fillRect((k + .5) * r.w / bars - 8, r.y, 16, r.h);
      ctx.fillRect(0, cy - 12, r.w, 24); ctx.fillRect(0, r.y + 60, r.w, 14); ctx.fillRect(0, r.y + r.h - 74, r.w, 14);
      ctx.fillStyle = '#9aa4c4'; ctx.beginPath(); ctx.arc(r.w - 70, cy, 34, 0, B.TAU); ctx.fill(); ctx.strokeStyle = '#3e4562'; ctx.lineWidth = 6; ctx.stroke();
      ctx.restore();
      void dw;
    }
    ctx.restore();
    ctx.strokeStyle = '#7b86a8'; ctx.lineWidth = 26; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 30); ctx.stroke();
    ctx.strokeStyle = rgba(P.cream, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(r.x - 13, r.y - 13, r.w + 26, r.h + 26, 36); ctx.stroke();
  };
  const REACH = [[-.25, 590, 360], [-Math.PI / 2 + .3, 590, 600], [-Math.PI / 2 - .2, 830, 600], [Math.PI + .25, 830, 360], [-1.05, 712, 480]];
  const drawReach = (ctx, t) => {
    REACH.forEach(([ang, fx, fy], i) => {
      const d = [Math.cos(ang), Math.sin(ang)], S0 = 78, wx = fx - d[0] * S0 * 1.9, wy = fy - d[1] * S0 * 1.9;
      const e = sineIO(span(t, a.shared - .5 + i * .12, a.shared + .95 + i * .12)), w = sineIO(span(t, a.few2 - .4 + i * .06, a.few2 + .8 + i * .06));
      if (e <= 0 || w >= 1) return;
      const ex = (v, p, lim) => (v > 1e-3 ? (lim - p) / v : v < -1e-3 ? -p / v : 1e9), off = Math.min(ex(-d[0], fx, W), ex(-d[1], fy, H)) + 60, back = off * (1 - e) + off * w, touch = F.bump(t, a.notH - .1 + i * .06, .5);
      B.bigHand(ctx, wx - d[0] * back, wy - d[1] * back, S0, ang, { curl: .15 + .2 * touch, spread: .5, col: mixHex(P.ind2, P.blue1, .4 + .1 * (i % 2)) });
    });
  };

  // ------------------------------------------------ one frame
  const glowAt = (t) => {
    const K = [[a.tow, W / 2, 560, 1150, .65], [sp1, W / 2, 520, 1100, .65], [por0, W / 2, 520, 1100, .65], [por1, 960, 560, 1000, .7], [vm0, 960, 560, 1000, .7], [vm1, 710, 470, 900, .75], [yesG0, 710, 470, 900, .75], [yesG1 + .5, W / 2, 470, 800, .6]];
    const g = [1, 2, 3, 4].map((i) => B.keys(t, K.map((k) => [k[0], k[i]])));
    g[3] = lerp(g[3], S.breathe(t, .6), span(t, yesG0, yesG1 + .5));
    return g;
  };
  return (ctx, t) => {
    if (t < por0) { drawOutside(ctx, t); return; }
    if (t < por1) {   // the top tier's window grows over the frame; the room lies behind it (B does not scale: no lurch)
      const tt = towerTop(t), tw = TWR.w * TM[2] * (1 - .085 * 8), th = TWR.h * TM[2] / 9, e = sineIO(span(t, por0, por1));
      const x0 = lerp(tt[0] - tw / 2 + 6, -40, e), y0 = lerp(tt[1] + 4, -40, e), x1 = lerp(tt[0] + tw / 2 - 6, W + 40, e), y1 = lerp(tt[1] + th - 2, H + 40, e);
      drawOutside(ctx, t);
      F.iris(ctx, (c) => c.roundRect(x0, y0, x1 - x0, y1 - y0, lerp(6, 24, e)), (c) => { c.save(); c.translate(W / 2, H / 2); c.scale(1.08 - .08 * e, 1.08 - .08 * e); c.translate(-W / 2, -H / 2); drawRoom(c, t, 0); c.restore(); }, { rim: rgba(GOLD.line, .85), rimW: 3 });
      return;
    }
    F.night(ctx, t, { glow: glowAt(t) });
    if (t < vm0) {
      const pan = sineIO(span(t, pan0, pan1)), oy = -pan * DY;
      if (pan < 1) drawRoom(ctx, t, oy);
      const wu = sineIO(span(t, pan0 - .1, pan1 + .1));
      if (wu > 0) { ctx.save(); ctx.translate(0, oy); F.goldSpan(ctx, wirePts(t), 0, wu, { w: 2, spark: wu < 1 }); ctx.restore(); }
      if (pan > 0) { drawDesk(ctx, t, oy + DY); drawMonitor(ctx, t, MON, oy + DY); }
      ctx.save(); ctx.translate(0, oy); drawTag(ctx, t); ctx.restore();
      return;
    }
    // the monitor becomes the vault (the desk and you sink away), then the "yes" card grows out of its light
    const m = sineIO(span(t, vm0, vm1)), vout = expoIn(span(t, vOut0, vOut1));
    drawDesk(ctx, t, 0, { down: span(t, vm0, vm1 + .2) });
    const wireA = 1 - span(t, vm0, vm0 + .4);
    if (wireA > 0) { ctx.save(); ctx.translate(0, -DY); ctx.globalAlpha *= 1; F.goldSpan(ctx, wirePts(t), 1 - wireA, 1, { w: 2, spark: false }); ctx.restore(); }
    if (vout < 1) {
      ctx.save(); ctx.translate(0, vout * 900);
      const r = lerpRect(MON, VLT, m);
      if (m <= 0) drawMonitor(ctx, t, r, 0);
      else {
        drawMonitor(ctx, t, r, 0, { morph: m });
        if (m > .5) {
          const lit = [a.counts + .3, a.algo, a.plat, a.data].map((s) => span(t, s - .05, s + .3) * (1 - .4 * span(t, a.everyone + .3, a.everyone + 1)) + .6 * F.bump(t, a.notH - .1, 1.2));
          ctx.save(); ctx.globalAlpha *= 1; drawVault(ctx, t, r, { door: sineIO(span(t, door0, door1)), symU: span(m, .5, 1), lit, glow: span(t, a.shared, a.shared + .6) + span(t, yesG0, yesG1) });
          ctx.restore();
        }
      }
      if (m < 1) drawTag(ctx, t, { at: [r.x + (TAG[0] - MON.x) / MON.w * r.w, r.y + (TAG[1] - DY - MON.y) / MON.h * r.h], s: 1 - m });
      drawReach(ctx, t);
      F.capsLabel(ctx, 'MEANT FOR EVERYONE', VLT.x + VLT.w / 2, VLT.y - 40, span(t, a.everyone - .1, a.everyone + .4) * (1 - span(t, a.shared - .3, a.shared)), { size: 26, col: GOLD.text });
      ctx.restore();
    }
    // §67 → Shared, not held by a few
    const c67u = span(t, a.counts - .1, a.counts + .5), c67o = sineIO(span(t, a.shared - .9, a.shared + .25));
    if (c67u > 0 && c67o < 1) { ctx.save(); ctx.translate(C67.x + C67.w / 2, 320 - c67o * 760); ctx.scale(1 - .35 * c67o, 1 - .35 * c67o); ctx.translate(-C67.x - C67.w / 2, -320); B.qcard(ctx, t, T, { text: Q67, ...C67, head: 'MAGNIFICA HUMANITAS · §67', u: c67u, spoken: ['algorithms', 'data'], after: a.counts }); ctx.restore(); }
    const shOut = span(t, a.founder - .2, a.founder + .2);
    if (shOut < 1) {
      F.goldText(ctx, [['Shared,', 1]], 1400, 450, 112, span(t, a.shared - .1, a.shared + .35) * (1 - shOut), { serif: true, glow: true, align: 'center' });
      F.maskLine(ctx, [['not held by a few', 0]], 1400, 540, 54, F.rise(span(t, a.notH - .1, a.notH + .35) * (1 - shOut)), { serif: true, col: CREAM, glow: false, align: 'center' });
    }
    // the "yes" card: out of the vault's light, onto the plate's place, under the plate's creep
    const yu = span(t, yesG0, yesG1);
    if (yu > 0) {
      const e = sineIO(yu), k = lerp(.2, 1, e), cx = lerp(VLT.x + VLT.w / 2, S.YES.x, e), cy = lerp(VLT.y + VLT.h / 2 + vout * 900, S.YES.y, e);
      F.look(ctx, W / 2, H / 2 - 20, 1 + S.CREEP * (t - a.seam), () => {
        ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k);
        B.yesCardB(ctx, t, 0, 0, S.YES.w, S.YES.h, { yesU: span(t, a.yes - .05, a.yes + .35) });
        ctx.restore();
      });
      F.capsLabel(ctx, 'JACK DORSEY · CO-FOUNDER OF TWITTER', W / 2, 660, span(t, a.twitter - .1, a.twitter + .4) * (1 - span(t, a.plate - .55, a.plate - .15)), { size: 24, col: CREAM });
    }
  };
}
