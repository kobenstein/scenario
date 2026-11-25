// c10 · B3 · THE SAY · 'The other prize' → 'voters'. One continuous take on THE PLAN SHEET (view V9 throughout, no cut). It starts
// in c09's last picture (the 12 data boxes merged into one gold block over the ENOUGH line, 8.07; c09 hands this draw over under the
// shrinking C4 plate) and ends exactly in c11's first frame: the plan board with the disc on it, pushed onto the verdict moon.
//
// | ID   | anchor (phrase)            | zeigt wörtlich                                                                       | kind | carrier out          |
// |------|----------------------------|--------------------------------------------------------------------------------------|------|----------------------|
// | 9.01 | The other prize            | the data block flies into the machine's windows, the machine rises out of the line; the line is the negotiating table, rule booklets on it: A SAY IN THE RULES | MIX | the machine |
// | 9.02 | A say goes to whoever      | small chip squares round the frame, every chip line converges on the machine (callback 5.09): WHAT OTHERS CAN'T DO WITHOUT; 'Like those chip machines': the beam | EXPL | the booklets |
// | 9.03 | But it only counts         | the booklets slide into one: ONE VOICE; three hands: THE NETHERLANDS (on the machine) · WASHINGTON · CHINA (draws a dashed prototype) + source | EXPL | the table halves |
// | 9.04 | How to get to one voice    | the table sinks, two equal half boards rise (no party colours): MORE SHARED MONEY (coins merge) · FEWER RULES (booklets go) | EXPL | the halves |
// | 9.05 | Who settles it             | the halves close into the plan board; the HUD flies down into its disc; four hands: GOVERNMENTS · PARLIAMENT · INVESTORS · VOTERS, the last lays the ballot | MIX | the plan → c11 |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as X from '../lib/f69_explain.mjs';
import * as B from './sc12.mjs';
import * as C11 from './sc11.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, CREAM2, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT69;
const TAU = Math.PI * 2;

export const V9 = C11.V9;                 // the sheet view of c09's end, all of c10 and c11's start
export const POOL = { lx: 960, ly: 520 };  // the light pool of the sheet (the plan's centre)
const memo = new WeakMap();
export function anchors10(T) {
  if (memo.has(T)) return memo.get(T);
  const a = T.G('The other prize'), G = (p) => T.G(p, 0, a);
  const A = { a, sayR: G('a say in the rules'), whoever: G('A say goes to whoever'), others: G('what others'), chip: G('Like those chip machines'),
    counts: G('But it only counts'), oneV: G('speaks with one voice'), dutch: G('the Dutch government'), wash: G('Washington has a say'), china: G('China is building'),
    how: G('How to get to one voice'), open: G('an open argument'), money: G('more shared money'), fewer: G('or fewer rules'), who: G('Who settles it'),
    gov: G('Governments'), parl: G('The European Parliament'), inv: G('Investors'), next: G('And at the next election'), voters: G('voters') };
  A.end = C11.anchors11(T).a; A.push0 = C11.anchors11(T).push0;
  memo.set(T, A); return A;
}

// ------------------------------------------------------------------------------------------------ geometry (sheet units = screen at V9)
const MC = { x: 860, y: B.DB.base, L: 600 };          // the machine (base on the data baseline = the table top)
const TBL = { x0: 300, x1: 1430, y: B.DB.base };       // the negotiating table
const PROTO = { x: 1680, y: B.DB.base, L: 260 };       // China's own machine: a dashed outline
const BOOKS = [380, 450, 520, 1180, 1250, 1320, 1390]; // rule booklets on the table: many voices
const HALF = { w: C11.PLAN.w / 2, h: C11.PLAN.w * .66 }; // the two half boards of 9.04 (they close into the plan board in 9.05)

// the machine outline only (a dashed prototype): the chip machine's stepped silhouette, stroked
function protoOutline(ctx, t, x, y, L, u) {
  if (u <= 0) return;
  const h = L * .3, x0 = x - L / 2, p = [[x0, y], [x0, y - h * 1.65], [x0 + L * .2, y - h * 1.65], [x0 + L * .22, y - h * 1.05], [x0 + L * .82, y - h * 1.05], [x0 + L * .82, y - h * .78], [x0 + L, y - h * .78], [x0 + L, y], [x0, y]];
  X.lightLine(ctx, p, u, { a: .75, w: 2.4, dash: [10, 8], col: rgba(COOL.line, .8), glowCol: COOL.halo });
}
// a stack of coins (cream rims, shared money), x, y = its foot, n coins, w
function coins(ctx, t, x, y, n, w, a = 1) {
  if (a <= 0 || n <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  for (let k = 0; k < n; k++) {
    const yy = y - k * w * .16;
    ctx.fillStyle = mixHex(PAPER.shade, P.night1, .35); ctx.beginPath(); ctx.ellipse(x, yy + w * .05, w / 2, w * .13, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(PAPER.body, GOLD.mid, .18); ctx.beginPath(); ctx.ellipse(x, yy, w / 2, w * .13, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(PAPER.edge, .8); ctx.lineWidth = 1.2; ctx.stroke();
  }
  ctx.restore();
}

export function makeDraw10(T) {
  const A = anchors10(T), C4 = T.clip('C4');
  const blk = B.dbBlock();

  // ---------------------------------------------------------------- 8.06–8.07 (drawn here, c09 hands over at C4.end − .2)
  // the C4 plate shrinks into data box 5; the 12 boxes rise; ENOUGH; they slide into one block that crosses the line (gold)
  const noSingle = T.G('No single company', 0, C4.start), enough = T.G('has enough data', 0, C4.start), together = T.G('Together, they could', 0, C4.start);
  function dataStage(ctx, t) {
    const morph = 1 - span(t, C4.end - .1, C4.end + 1.0), dark = span(t, C4.end - .25, C4.end + .45);
    const merge = sineIO(span(t, together - .1, together + 1.0)), fly = span(t, A.a + .5, A.a + 1.7);   // 9.01: the block flies into the machine
    const lineU = span(t, enough + .1, enough + .9), cross = span(t, together + .55, together + .95);
    const out = 1 - span(t, A.a - .1, A.a + .5);
    if (lineU > 0 && out > 0) {   // ENOUGH: a dashed line high above every single box
      const col = mixHex(CREAM, GOLD.line, cross);
      X.lightLine(ctx, [[260, B.DB.enough], [1660, B.DB.enough]], lineU, { a: .6 * out, w: 2, dash: [12, 10], col: rgba(col, .7 * out) });
      X.label(ctx, 'ENOUGH', 1660, B.DB.enough - 20, span(t, enough + .4, enough + 1.0) * out, { size: 32, align: 'right', col: cross > .5 ? GOLD.text : CREAM2, gold: .5 * cross });
    }
    for (let k = 0; k < B.DB.n; k++) {
      if (fly >= 1) break;
      const b0 = B.dbBox(k), b1 = B.dbSlot(k), rise = k === B.DB_PLATE ? 1 : expoOut(span(t, C4.end + .15 + Math.abs(k - B.DB_PLATE) * .07, C4.end + .9 + Math.abs(k - B.DB_PLATE) * .07));
      if (rise <= 0) continue;
      const mk = sineIO(clamp(merge * 1.25 - Math.abs(k - 5.5) * .025));
      let b = { x: lerp(b0.x, b1.x, mk), y: lerp(b0.y, b1.y, mk) + (1 - rise) * 80, w: lerp(b0.w, b1.w, mk), h: lerp(b0.h, b1.h, mk) };
      if (fly > 0) {   // each cell flies into one of the machine's seven windows (staggered), shrinking to the window
        const fk = sineIO(clamp(fly * 1.6 - k / B.DB.n * .6)), wi = k % 7, h = MC.L * .3, wx = MC.x - MC.L / 2 + MC.L * (.27 + wi * .075), wy = MC.y - h * .86;
        b = { x: lerp(b.x, wx, fk), y: lerp(b.y, wy, fk) - Math.sin(Math.PI * fk) * 60, w: lerp(b.w, MC.L * .035, fk), h: lerp(b.h, h * .16, fk) };
        if (fk >= 1) continue;
      }
      if (k === B.DB_PLATE && morph > 0) continue;   // the plate is still on its way down into this box
      B.dataBox(ctx, t, b, { gold: cross > .5, seed: k, a: rise < 1 ? clamp(rise * 3) : 1 });
    }
    if (cross > 0 && fly < 1) halo(ctx, blk.x + blk.w / 2, blk.y + blk.h / 2, 380, (.3 + .45 * F.bump(t, together + .55, 1.4)) * cross * (1 - fly), GOLD.halo, GOLD.core);   // ★ the block crosses ENOUGH
    X.label(ctx, 'EACH ALONE: TOO LITTLE', 960, B.DB.base + 64, span(t, noSingle + .2, noSingle + .8) * (1 - span(t, together - .1, together + .4)), { size: 32, spacing: .1, col: CREAM2 });
    // the baseline under the boxes (it becomes the table)
    X.lightLine(ctx, [[B.DB.x0 - 60, B.DB.base], [B.DB.x0 + 11 * B.DB.step + 60, B.DB.base]], span(t, C4.end + .1, C4.end + .9), { a: .5 * (1 - span(t, A.a + .4, A.a + 1.2)), w: 2 });
    X.label(ctx, SRC.together, 960, B.DB.enough - 90, span(t, together + .5, together + 1.2) * (1 - span(t, A.a - .1, A.a + .4)), { size: 44, gold: .6, col: GOLD.text });
    if (morph > 0) F.clipPlate(ctx, t, T, 'C4', { from: B.dbBox(B.DB_PLATE), morph: sineIO(morph), dark });
  }

  // ---------------------------------------------------------------- 9.01–9.03 the machine on the negotiating table
  const sink = (t) => expoIn(span(t, A.how - .2, A.how + 1.0));   // 9.04: the table scene sinks under the rising halves
  function tableStage(ctx, t) {
    const up = expoOut(span(t, A.a, A.a + 1.2)), dy = sink(t) * 520; if (up <= 0 || dy >= 520) return;
    ctx.save(); ctx.translate(0, dy);
    const tb = span(t, A.a + .4, A.a + 1.6);
    B.table(ctx, t, TBL.x0, TBL.x1, TBL.y, tb);
    // the people at the table ends (indigo silhouettes; only you wear yellow, and you are not here)
    const pu = span(t, A.sayR - .2, A.sayR + .6);
    if (pu > 0) { ctx.save(); ctx.globalAlpha *= clamp(pu * 2); E.person(ctx, TBL.x0 - 40 - (1 - expoOut(pu)) * 60, TBL.y + 150, 230, { dir: 1, light: .7, look: .2 + .05 * Math.sin(t * .6) }); E.person(ctx, TBL.x1 + 40 + (1 - expoOut(pu)) * 60, TBL.y + 150, 222, { dir: -1, light: .7, look: .15 + .05 * Math.sin(t * .5 + 1) }); ctx.restore(); }
    // the machine rises out of the table line (clipped at it)
    const conv = span(t, A.whoever + .2, A.whoever + 2.0), beam = span(t, A.chip + .1, A.chip + .8);
    ctx.save(); ctx.beginPath(); ctx.rect(0, -400, W, TBL.y + 400); ctx.clip();
    if (conv > 0 || beam > 0) halo(ctx, MC.x, MC.y - 120, 420, .18 * Math.max(conv, beam) * (.9 + .1 * Math.sin(t * 2)), COOL.halo, COOL.core);
    F.chipMachine(ctx, t, MC.x, MC.y + (1 - up) * MC.L * .55, MC.L, { glow: .5 + .5 * span(t, A.a + .8, A.a + 1.6), beam });
    ctx.restore();
    // rule booklets on the table: many voices (9.01); at 'one voice' they slide together into one (gold edge)
    const bu = span(t, A.sayR + .1, A.sayR + 1.0), one = sineIO(span(t, A.oneV - .1, A.oneV + .9));
    BOOKS.forEach((bx, i) => {
      const x = lerp(bx, 1290, one), u = clamp(bu * 2 - i * .12);
      if (u <= 0 || (one >= 1 && i > 0)) return;
      F.ruleBook(ctx, t, x, TBL.y - 2, 54, { u, rot: lerp((i % 3 - 1) * .08, 0, one), seed: i });
    });
    if (one > 0) { const g = span(t, A.oneV + .5, A.oneV + 1.1); if (g > 0) { halo(ctx, 1290, TBL.y - 24, 90, .5 * g, GOLD.halo, GOLD.core); F.goldSpan(ctx, [[1263, TBL.y - 1], [1317, TBL.y - 1]], 0, sineIO(g), { w: 2.4, spark: g < 1 }); } }
    ctx.restore();
  }
  // 9.02: chip squares round the frame, their lines converge on the machine (screen = sheet at V9)
  const CHIPS = [[120, 180], [380, 90], [1560, 110], [1800, 300], [90, 520], [1830, 640], [240, 860], [1640, 860], [700, 70], [1180, 60]];
  function chipLines(ctx, t) {
    const u = span(t, A.whoever + .1, A.whoever + 1.4), out = span(t, A.counts - .3, A.counts + .6); if (u <= 0 || out >= 1) return;
    const tgt = [MC.x - MC.L * .2, MC.y - MC.L * .3 * 1.2];
    CHIPS.forEach(([x, y], i) => {
      const ci = clamp(u * 2 - i * .08), li = span(t, A.whoever + .5 + i * .07, A.others + .6 + i * .05); if (ci <= 0) return;
      const a = 1 - out, pts = E.catmull([[x, y], [lerp(x, tgt[0], .5) + (i % 2 ? 60 : -60), lerp(y, tgt[1], .5)], tgt], 10).map((p) => [p[0], p[1]]);
      if (li > 0) X.lightLine(ctx, pts, li, { a: .55 * a, w: 2, col: rgba(COOL.line, .55 * a), glowCol: COOL.halo });
      ctx.save(); ctx.globalAlpha *= a * clamp(ci * 2); ctx.translate(x, y); ctx.rotate(.2 * Math.sin(i)); const s = 30 * expoOut(ci);
      ctx.fillStyle = mixHex(P.night1, COOL.deep, .6); ctx.fillRect(-s / 2, -s / 2, s, s); ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = 1.6; ctx.strokeRect(-s / 2, -s / 2, s, s);
      for (let k = -1; k <= 1; k++) { ctx.fillRect(-s / 2 - 6, k * s * .25 - 1, 6, 2); ctx.fillRect(s / 2, k * s * .25 - 1, 6, 2); }
      ctx.restore();
    });
  }
  // 9.03: three hands at the machine, each on its word
  function hands3(ctx, t) {
    const out = span(t, A.how - .5, A.how + .5); if (out >= 1) return;
    const r = 1 - expoIn(out), mt = MC.y - MC.L * .3 * 1.65;
    const nl = span(t, A.dutch, A.dutch + .9) * r, wa = span(t, A.wash - .1, A.wash + .8) * r, ch = span(t, A.china - .1, A.china + .8) * r;
    B.handIn(ctx, t, MC.x - MC.L / 2 + 30, mt + 8, .15, 72, nl, { reach: 800, seed: 1, pose: 'open' });
    B.handIn(ctx, t, MC.x + 70, mt - 22, Math.PI / 2 + .12, 70, wa, { reach: 700, seed: 2, pose: 'point' });
    const dr = span(t, A.china + .3, A.china + 1.9) * r;
    protoOutline(ctx, t, PROTO.x, PROTO.y, PROTO.L, dr);
    if (dr > 0) X.lightLine(ctx, [[PROTO.x - PROTO.L / 2 - 30, PROTO.y], [PROTO.x + PROTO.L / 2 + 30, PROTO.y]], dr, { a: .35 * r, w: 1.6, dash: [6, 8] });
    // the CHINA hand traces the outline (its fingertip rides the drawing front)
    if (ch > 0) { const h = PROTO.L * .3, k = sineIO(dr), px = lerp(PROTO.x + PROTO.L / 2 + 40, PROTO.x - PROTO.L * .2, k), py = PROTO.y - h * (1.1 + .5 * Math.sin(Math.PI * k)); B.handIn(ctx, t, px + 46, py - 26, Math.PI - .5, 66, ch, { reach: 600, seed: 3, pose: 'point' }); }
    X.label(ctx, 'THE NETHERLANDS', 120, 220, span(t, A.dutch + .2, A.dutch + .8) * r, { size: 30, align: 'left' });
    X.label(ctx, 'WASHINGTON', MC.x + 160, 150, span(t, A.wash, A.wash + .6) * r, { size: 30, align: 'left' });
    X.label(ctx, 'CHINA', PROTO.x, PROTO.y + 56, span(t, A.china + .1, A.china + .7) * r, { size: 30 });
  }

  // ---------------------------------------------------------------- 9.04–9.05 the two half boards → the plan board
  const gapOf = (t) => 70 * (1 - sineIO(span(t, A.who - .1, A.who + .8)));
  function halves(ctx, t) {
    const up = expoOut(span(t, A.how - .1, A.how + 1.1)); if (up <= 0) return;
    const close = sineIO(span(t, A.who - .1, A.who + .8)), g = gapOf(t), P0 = C11.PLAN, y0 = P0.y - HALF.h / 2 + (1 - up) * 760;
    if (close >= 1) return;   // closed: the plan layer (C11.planLayer) is the board from here
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? P0.x - HALF.w - g : P0.x + g;
      ctx.save(); ctx.beginPath(); ctx.rect(x0 - 2, y0 - 30, HALF.w + 4, HALF.h + 60); ctx.clip();
      ctx.translate(side < 0 ? -g : g, (1 - up) * 760); B.planBoard(ctx, t, P0.x, P0.y, P0.w); ctx.restore();
      // the edge where the board is cut (cream), it disappears as the halves close
      ctx.fillStyle = rgba(CREAM, .5 * (1 - close)); ctx.fillRect(side < 0 ? x0 + HALF.w - 2 : x0, y0, 2, HALF.h);
    }
    // their content (stays inside each half): left the coins merge into one pile, right the booklets go until two are left
    const cu = 1 - span(t, A.who - .2, A.who + .5), cy = y0 + HALF.h * .72;
    if (cu > 0) {
      const lx = P0.x - HALF.w / 2 - g, mu = sineIO(span(t, A.money, A.money + 1.0));
      [[-150, 3], [-75, 5], [0, 2], [75, 4], [150, 3]].forEach(([dx, n], i) => { const x = lerp(lx + dx, lx, mu); coins(ctx, t, x, cy - (i === 2 ? 0 : 0), mu >= 1 && i ? 0 : (mu >= 1 ? 17 : n), 64, cu * (i && mu > .9 ? 1 - (mu - .9) * 10 : 1)); });
      const rx = P0.x + HALF.w / 2 + g, fu = span(t, A.fewer + .05, A.fewer + 1.1);
      for (let k = 0; k < 7; k++) {
        const go = expoIn(clamp(fu * 1.6 - (6 - k) * .1)), keep = k < 2;
        if (!keep && go >= 1) continue;
        F.ruleBook(ctx, t, rx - 156 + k * 52 + (keep ? 0 : go * 320), cy - (keep ? 0 : go * 80), 58, { u: 1, a: cu * (keep ? 1 : 1 - go), rot: (k % 2 ? .05 : -.05) + (keep ? 0 : go * .6), seed: k });
      }
      const lu = cu * up;
      X.label(ctx, SRC.ways[0], P0.x - HALF.w / 2 - g, y0 - 34, span(t, A.money - .1, A.money + .5) * lu, { size: 32 });
      X.label(ctx, SRC.ways[1], P0.x + HALF.w / 2 + g, y0 - 34, span(t, A.fewer - .1, A.fewer + .5) * lu, { size: 32 });
    }
  }
  // the four deciders' hands on the plan (9.05), and their labels
  const HANDS = [
    { k: 'gov', x: 470, y: 400, ang: .1, lab: [120, 300, 'left'] },
    { k: 'parl', x: 700, y: 236, ang: Math.PI / 2 - .2, lab: [520, 150, 'center'] },
    { k: 'inv', x: 1420, y: 300, ang: Math.PI - .35, lab: [1690, 330, 'center'] },
    { k: 'voters', x: C11.BALLOT.x + 40, y: C11.BALLOT.y + 30, ang: -Math.PI + .5, lab: [1650, 800, 'center'] },
  ];
  function deciders(ctx, t) {
    const out = span(t, A.end - 1.3, A.end - .5), r = 1 - expoIn(out); if (out >= 1) return;
    const at = { gov: A.gov, parl: A.parl, inv: A.inv, voters: A.voters - .25 };
    HANDS.forEach((h, i) => {
      const u = span(t, at[h.k] - .15, at[h.k] + .7) * r; if (u <= 0) return;
      let hx = h.x, hy = h.y;
      if (h.k === 'voters') { const bl = expoOut(span(t, A.voters - .25, A.voters + .55)); hx += (1 - bl) * 160; hy -= (1 - bl) * 60; }
      B.handIn(ctx, t, hx, hy, h.ang, 70, u, { reach: 900, seed: 4 + i, pose: h.k === 'voters' ? 'point' : 'open', curl: h.k === 'voters' ? .3 : 0 });
      X.label(ctx, SRC.deciders[i], h.lab[0], h.lab[1], span(t, at[h.k], at[h.k] + .6) * (1 - span(t, A.end - 1.0, A.end - .5)), { size: 30, align: h.lab[2] });
    });
  }

  function draw(ctx, t) {
    // a breathing camera over the sheet (so no hold freezes); it is zero at the hand-over from c09 and from push0 on (c11's push)
    const v0 = C11.planView(t, T), amp = span(t, C4.end - .2, C4.end + 2.5) * (1 - sineIO(span(t, A.push0 - 2.5, A.push0)));
    const v = { x: v0.x + amp * (26 * Math.sin(t * .37) + 8 * Math.sin(t * .61 + 2)), y: v0.y + amp * 14 * Math.sin(t * .29 + 1), s: v0.s * (1 + amp * .05 * Math.sin(t * .27 + .5)) * (1 + .12 * sineIO(span(t, C4.end + .5, A.a + 2.5)) * (1 - sineIO(span(t, A.a + 2.5, A.a + 6)))) };   // + a push onto the merging block
    if (t < A.who + .8) {
      X.sheet(ctx, t, v, POOL);
      X.inView(ctx, v, () => {
        chipLines(ctx, t);
        tableStage(ctx, t);
        if (t < A.a + 1.8) dataStage(ctx, t);
        if (t > A.dutch - .3) hands3(ctx, t);
        halves(ctx, t);
      });
      F.source(ctx, t, A.dutch + .2, A.how + .2, SRC.exportSrc);
      ctx.save(); X.inView(ctx, v, () => {
      // the labels of 9.01–9.03 (in the free sky above the machine)
      const L1 = span(t, A.sayR, A.sayR + .7) * (1 - span(t, A.whoever + .2, A.whoever + .7));
      X.label(ctx, 'A SAY IN THE RULES', 960, 200, L1, { size: 34, spacing: .14, gold: .5, col: GOLD.text });
      X.label(ctx, "WHAT OTHERS CAN'T DO WITHOUT", 960, 200, span(t, A.others, A.others + .7) * (1 - span(t, A.counts - .1, A.counts + .4)), { size: 34, spacing: .12 });
      X.big(ctx, SRC.oneVoice, 1290, TBL.y - 160, 72, span(t, A.oneV + .2, A.oneV + .9) * (1 - span(t, A.dutch - .3, A.dutch + .2)), { gold: .5 });
      }); ctx.restore();
    } else C11.planLayer(ctx, t, v, 0, { board: 1, ballot: span(t, A.voters - .25, A.voters + .55) });
    // the disc: the HUD flies down into the plan's disc (reverse of discToHud) and stays there; at A.end it is c11's verdict moon
    const hu = span(t, A.who + .2, A.who + 1.4), [dx, dy, dr] = C11.planDiscScreen(v);
    if (hu <= 0) F.kitHud(ctx, t, T);
    else if (hu < 1) B.discToHud(ctx, t, T, { x: dx, y: dy, r: dr, glow: 1, lx: 1.56, ly: .52, rot: .35 }, 1 - hu);
    else B.verdictDisc(ctx, t, F.kitParts(T, t).parts, dx, dy, dr, { glow: 1, loose: B.LOOSE(dx, dy, dr) });
    if (t > A.gov - .5) X.inView(ctx, v, () => deciders(ctx, t));
  }
  return { draw, A, dataStage };
}

export default async (T, R) => {
  const { draw, A } = makeDraw10(T);
  const marks = [R.a, A.whoever, A.counts, A.how, A.who].filter((x) => x >= R.a && x < R.b);
  return marks.map((t) => ({ t, draw, print: PR }));
};
