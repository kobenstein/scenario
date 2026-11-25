// c11 · B3 · the machine itself, and who writes line 4 · "Rules work from the outside" → "And if the machine does the inventing".
// Plan: docs/shots.md 5.12–5.23 (+ 6.01, which this world carries until sc12 lifts the DISCOVERY row off the board). One entry.
// It begins inside c10's world function (5.12 pull back), opens the package window as a PORTAL (5.13) and lands on the hall world
// (identity frame), whose camera then glides on phrases. The clip plate C4 grows out of the slot between the tools and returns into it.
//
// | ID   | anchor (phrase)            | motif                                                                                       | type | carrier → next |
// |------|----------------------------|---------------------------------------------------------------------------------------------|------|----------------|
// | 5.12 | Rules work from the outside| (sc10 world) pull back: the package between the gates, both act on its shell only            | EXPL | the package    |
// | 5.13 | And the machine itself     | portal through the package window → the ring inside · AND THE MACHINE ITSELF?                | EXPL | the ring       |
// | 5.14 | Paul Christiano once led   | pull back: the ring hangs on a wall, a lectern, a speaker (indigo), five tools on the wall · labels | MIX | the tools   |
// | 5.15 | This fall, he went through | the lectern steps back; the tools line up: THE METHODS WE HAVE; they part, a slot opens       | EXPL | the slot       |
// | C4   | T.clip('C4')               | the plate grows out of the slot (lower third by the plate) and returns into it               | CLIP | the slot       |
// | 5.16 | All plausible              | the slot closes, each tool lights once: PLAUSIBLE                                           | EXPL | the tools      |
// | 5.17 | But none of them           | the tools become markers on five tracks; none reaches the line PROBABLY WORKS; no ticks      | EXPL | the markers    |
// | 5.18 | But today's researchers    | the markers fly into the hands of researchers: lamps into an opened package (the ring drops into it), patterns light · THE MACHINES THEMSELVES, TO STUDY | MIX | the lamps |
// | 5.19 | So who writes the fourth   | the beams swing up to row 4 of the board (four lines, small): CONTROL · WHO WRITES IT?       | EXPL | row 4          |
// | 5.20 | The labs, which decide     | group 1 rises at a bench (flask), a cream line to row 4: LABS · WHAT GETS BUILT               | MIX  | group 2        |
// | 5.21 | Governments, which decide  | group 2 at a desk: GOVERNMENTS · WHAT GETS TESTED                                           | MIX  | group 3        |
// | 5.22 | And voters, who choose     | group 3 at a ballot box (a paper slips in): VOTERS · WHO WRITES THE RULES                     | MIX  | the ballot box |
// | 5.23 | That last one is you       | you walk in to the voters, the stylus raised: YOU                                           | MIX  | you            |
// | 6.01 | And if the machine does    | (sc12 draws this world) the groups step back, you alone under the board · WHAT ELSE IS LEFT FOR US? | MIX | the DISCOVERY row |
import * as F from '../lib/f77_kit.mjs';
import * as X from '../lib/b3_extra.mjs';
import { build10 } from './sc10.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rise, GOLD, CREAM, COOL } = F;

export const PRINT = F.PRINT77;
export default async (T, R) => [{ t: R.a, draw: build11(T).draw, print: PRINT }];

// ------------------------------------------------------------------------------------------------ the hall (world = screen at cam (960, 540, 1))
const RINGW = [960, 290], RINGR = 140;
const FLOOR = 900;
const TOOLY = 560, TOOLX = [560, 760, 960, 1160, 1360], TS = 44;
const ROWY = 690, ROWX = [330, 520, 1210, 1400, 1590], SLOT = { cx: 865, cy: 690, w: 400, h: 225 };
const LANES = { x0: 470, x1: 1420, y0: 360, dy: 74, fin: 1300 }, REACH = [.56, .71, .47, .79, .63];
const BIG = { x: 960, y: 820, s: 230 };
const RES = [[470, 250, 1], [660, 236, 1], [1260, 240, -1], [1450, 254, -1]];
const MB = { x: 795, y: 60, s: .55 };   // the board, small (the four lines): top centre
const GRP = [{ x: 420, prop: 'bench' }, { x: 960, prop: 'desk' }, { x: 1500, prop: 'ballot' }];
const YOUH = 200;

export function build11(T) {
  const s10 = build10(T);
  const G = (p, after) => T.G(p, 0, after);
  const a = { ...s10.a };
  a.paul = G('Paul Christiano', a.rules); a.openai = G('at OpenAI', a.paul); a.board = G('board of its', a.paul);
  a.fall = G('This fall', a.rules); a.methods = G('the methods we have', a.fall);
  const C4 = T.clip('C4'); a.c4s = C4.start; a.c4e = C4.end;
  a.plaus = G('All plausible', a.c4s - 2); a.none = G('But none of them', a.plaus); a.probably = G('probably work', a.none);
  a.today = G("But today's researchers", a.plaus); a.never = G('never had', a.today); a.themselves = G('the machines themselves', a.today);
  a.who = G('So who writes the fourth', a.today);
  a.labs = G('The labs, which', a.who); a.built = G('what gets built', a.labs);
  a.govs = G('Governments, which', a.who); a.tested = G('what gets tested', a.govs);
  a.voters = G('And voters, who', a.who); a.rulesW = G('writes the rules', a.voters);
  a.you = G('That last one is you', a.who);
  a.left = G('And if the machine does the inventing', a.who); a.leftW = F.wordTimes(T, 'what else is left for us', null, a.left);
  a.spring = G('This spring', a.left);
  return scene(a, T, s10);
}

// lead 25.11.: the package window opens as an IRIS instead of a 20x fly-through (F.portal zoomed A and B by ~25x in 1.85 s: 11 LURCH frames).
// A (sc10's road) pushes in only half the way (zEnd^0.5); the window's rect grows to the full frame (the hole opens); B (the hall) lives in
// the window and scales from 0.38 to exactly 1, so at u = 1 the frame IS drawHall (identity, no jump). The window rim (cool) rides the edge.
function irisPortal(ctx, u, win, drawA, drawB) {
  const e = sineIO(clamp(u)), cx = win.x + win.w / 2, cy = win.y + win.h / 2;
  const zEnd = Math.max(W / win.w, H / win.h) * 1.02, zA = Math.pow(zEnd, .5 * e);
  const ox = lerp(cx, W / 2, e), oy = lerp(cy, H / 2, e);
  ctx.save(); ctx.translate(ox, oy); ctx.scale(zA, zA); ctx.translate(-cx, -cy); drawA(ctx); ctx.restore();
  // the opening: from the window (as A shows it) to the frame plus a margin, log-eased so it grows like the push
  const g = e, ww = win.w * zA, wh = win.h * zA, fw = W + 80, fh = H + 80;
  const mw = Math.exp(lerp(Math.log(ww), Math.log(fw), g)), mh = Math.exp(lerp(Math.log(wh), Math.log(fh), g));
  const mx = lerp(ox, W / 2, g) - mw / 2, my = lerp(oy, H / 2, g) - mh / 2;
  const kb = Math.exp(lerp(Math.log(.38), 0, e));
  ctx.save(); ctx.beginPath(); ctx.rect(mx, my, mw, mh); ctx.clip();
  ctx.translate(mx + mw / 2, my + mh / 2); ctx.scale(kb, kb); ctx.translate(-W / 2, -H / 2); drawB(ctx); ctx.restore();
  const ra = 1 - span(e, .7, 1); if (ra > 0) { ctx.save(); ctx.strokeStyle = rgba(COOL.line, .8 * ra); ctx.lineWidth = lerp(2, 4, e); ctx.strokeRect(mx, my, mw, mh); ctx.restore(); }
}

function scene(a, T, s10) {
  const tP0 = s10.tPortal, tP1 = Math.min(tP0 + 1.85, a.paul - .2);
  // ---------------------------------------------------------------- the hall camera (identity frame at the portal's end)
  const K = [
    [tP1, 960, RINGW[1], 1.85], [a.paul + .3, 960, RINGW[1] + 12, 1.78], [a.paul + 1.7, 960, 545, 1], [a.board, 975, 548, 1.02],
    [a.fall + .2, 965, 545, 1.03], [a.fall + 1.4, 930, 560, 1.0], [a.c4s, 920, 565, 1.0], [a.c4e, 930, 560, 1.0], [a.plaus + .6, 945, 555, 1.01],
    [a.none + .9, 960, 520, 1.0], [a.probably + .3, 975, 515, 1.02], [a.today + 1.1, 960, 590, .98], [a.themselves + .6, 960, 600, 1.02],
    [a.who + 1.2, 960, 520, 1], [a.labs + .5, 900, 530, 1.01], [a.govs + .5, 960, 535, 1.01], [a.voters + .5, 1060, 540, 1.01], [a.you + .7, 1130, 535, 1.03],
    [a.left + .2, 1060, 520, 1.03], [a.left + 2, 980, 470, 1.18], [a.spring + .2, 970, 450, 1.24],
  ];
  const cam = (t) => F.lookPath(Math.max(t, tP1), K), cEnd = F.lookPath(K[K.length - 1][0], K);
  const io = (t, i0, o0, d = .45) => span(t, i0, i0 + .6) * (1 - span(t, o0, o0 + d));

  // ---------------------------------------------------------------- the ring on the wall → into the package (5.18)
  const ringAt = (t) => {
    const d = sineIO(span(t, a.today - .1, a.today + 1.4)), up = sineIO(span(t, a.fall + .2, a.fall + 1.4)) * (1 - d);
    const x = RINGW[0], y = lerp(RINGW[1] - 70 * up, BIG.y - BIG.s + BIG.s * .48, d), r = lerp(lerp(RINGR, 100, up), BIG.s * .6 * .36, d);
    return { x, y, r, lit: lerp(1, .45, smooth(span(t, a.fall, a.fall + 1))) * (1 - d) + d, gone: t > a.today + 1.4 };
  };
  const drawRing = (ctx, t) => { const R = ringAt(t); if (R.gone || t > a.who + .5) return; X.ringS(ctx, t, R.x, R.y, R.r, { lit: R.lit, think: .5 }); if (t < a.paul + 2.5) { const k = smooth(span(t, a.paul, a.paul + 1.6)); if (k > 0) F.outline(ctx, [F.circlePts(R.x, R.y, R.r * 1.45, 0, 6.29, 48)], k, { w: 1.5, a: .35 }); } };
  // ---------------------------------------------------------------- 5.14 lectern + speaker; 5.15 they step back
  const drawLectern = (ctx, t) => {
    const out = sineIO(span(t, a.fall + .1, a.fall + 1.1)); if (out >= 1 || t < tP1 - .1) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, FLOOR + 2); ctx.clip(); ctx.translate(0, out * 420);
    F.person(ctx, 960, FLOOR, 330, { dir: 1, look: .1, armR: [.55, .9], armL: [-.5, -.9], light: .6, long: true });
    X.lectern(ctx, 960, FLOOR, 230);
    ctx.restore();
  };
  // ---------------------------------------------------------------- the tools: wall row → the line with the slot → markers → lamps
  const toolPos = (i, t) => {
    const l = quartIO(span(t, a.fall + .3 + i * .05, a.methods + .5 + i * .05));
    let x = lerp(TOOLX[i], ROWX[i], l), y = lerp(TOOLY, ROWY, l) - Math.sin(Math.PI * l) * 40, s = TS;
    // closing in after the plate (5.16): the slot shuts, the row tightens
    const cl = sineIO(span(t, a.c4e + .1, a.plaus + .5)); x = lerp(x, 560 + i * 200, cl); y = lerp(y, ROWY, cl);
    // 5.17: to the start of their lane, then along it
    const tr = quartIO(span(t, a.none - .05 + i * .05, a.none + .7 + i * .05)), adv = sineIO(span(t, a.none + .6 + i * .12, a.probably + .3 + i * .12));
    if (tr > 0) { const lx = lerp(LANES.x0, LANES.x0 + (LANES.fin - LANES.x0) * REACH[i], adv), ly = LANES.y0 + i * LANES.dy; x = lerp(x, lx, tr); y = lerp(y, ly, tr); s = lerp(TS, 12, tr); }
    // 5.18: the markers fly to the researchers' lamps
    const fl = quartIO(span(t, a.today - .15 + i * .07, a.today + .85 + i * .07));
    if (fl > 0 && i < 4) { const hd = resHand(i, t); x = lerp(x, hd[0], fl); y = lerp(y, hd[1], fl) - Math.sin(Math.PI * fl) * 60; }
    return { x, y, s, tr, fl: i < 4 ? fl : fl };
  };
  const drawTools = (ctx, t) => {
    if (t < tP1 - .1 || t > a.today + 1.2) return;
    const wall = smooth(span(t, a.paul + .6, a.paul + 1.8));
    for (let i = 0; i < 5; i++) {
      const p = toolPos(i, t); if (i === 4 && p.fl >= 1) continue;
      const lit = Math.sin(Math.PI * span(t, a.plaus - .05 + i * .1, a.plaus + .45 + i * .1));
      if (lit > 0) F.halo(ctx, p.x, p.y, 90, .7 * lit, GOLD.halo, GOLD.core);
      if (p.tr < .6) X.tool(ctx, X.TOOLS[i], p.x, p.y, p.s, { u: wall, w: 3, col: mixHex(CREAM, GOLD.line, lit), a: 1 - span(p.tr, .3, .6) });
      if (p.tr > .3) { const k = span(p.tr, .3, .7), al = 1 - span(p.fl, .8, 1) * (i === 4 ? 1 : 0); F.halo(ctx, p.x, p.y, 34, .55 * k * al, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(CREAM, k * al); ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, 6.29); ctx.fill(); }
    }
  };
  const slotU = (t) => expoOut(span(t, a.methods + .1, a.methods + .8)) * (1 - sineIO(span(t, a.c4e + .05, a.plaus + .3)));
  const drawSlot = (ctx, t) => { const u = slotU(t); if (u > 0) F.slot(ctx, t, SLOT.cx, SLOT.cy, SLOT.w, SLOT.h, { u }); };
  // 5.17 the tracks
  const drawTracks = (ctx, t) => {
    const u = smooth(span(t, a.none + .1, a.none + .8)) * (1 - smooth(span(t, a.today - .2, a.today + .6))); if (u <= 0) return;
    for (let i = 0; i < 5; i++) { const y = LANES.y0 + i * LANES.dy; F.outline(ctx, [[[LANES.x0, y], [LANES.x1, y]]], u, { w: 1.6, a: .45 }); X.tool(ctx, X.TOOLS[i], LANES.x0 - 60, y, 20, { u, w: 2, a: .8 }); }
    ctx.save(); ctx.globalAlpha *= u; ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.5; ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 10;
    ctx.beginPath(); ctx.moveTo(LANES.fin, LANES.y0 - 40); ctx.lineTo(LANES.fin, LANES.y0 + 4 * LANES.dy + 40); ctx.stroke(); ctx.restore();
  };
  // 5.18 researchers, the big opened package, beams; 5.19 the beams swing up to row 4
  const resU = (t) => expoOut(span(t, a.today + .05, a.today + .9)) * (1 - sineIO(span(t, a.labs - .5, a.labs + .4)));
  const resHand = (i, t) => { const [x, h, dir] = RES[i], k = resU(t); return [x + dir * h * .3, FLOOR - h * .62 + (1 - k) * h * 1.1]; };
  const bigU = (t) => expoOut(span(t, a.today + .5, a.today + 1.4)) * (1 - sineIO(span(t, a.who + .6, a.labs)));
  const row4 = () => { const s = MB.s; return [MB.x + (20 + 280) * s, MB.y + (112 + 3 * 78 + 39) * s]; };
  const drawLab = (ctx, t) => {
    const bu = bigU(t), ru = resU(t); if (bu <= 0 && ru <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, FLOOR + 2); ctx.clip();
    if (bu > 0) { ctx.save(); ctx.translate(0, (1 - bu) * BIG.s * 1.3); X.pkg(ctx, t, BIG.x, BIG.y, BIG.s, { lid: span(t, a.today + .9, a.today + 1.8), glow: 1, inner: span(t, a.never, a.themselves + .8), ring: 1 }); ctx.restore(); }
    // the beams: from each lamp into the opening; on "who writes" they swing up to row 4
    const up = sineIO(span(t, a.who - .2, a.who + .9)), [rx, ry] = row4();
    const bk = smooth(span(t, a.today + 1.2, a.never + .2)) * (1 - smooth(span(t, a.labs - .6, a.labs + .1)));
    for (let i = 0; i < 4; i++) {
      const hd = resHand(i, t), tgt = [lerp(BIG.x + (i - 1.5) * 50, rx - 120 + i * 80, up), lerp(BIG.y - BIG.s - 4, ry, up)];
      if (bk > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= bk; const ang = Math.atan2(tgt[1] - hd[1], tgt[0] - hd[0]), L = Math.hypot(tgt[0] - hd[0], tgt[1] - hd[1]), wd = 34;
        ctx.translate(hd[0], hd[1]); ctx.rotate(ang); ctx.fillStyle = F.lin(ctx, 0, 0, L, 0, [[0, rgba(GOLD.hot, .38)], [1, rgba(GOLD.body, .04)]]); ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(L, -wd); ctx.lineTo(L, wd); ctx.lineTo(0, 5); ctx.closePath(); ctx.fill(); ctx.restore(); }
    }
    RES.forEach(([x, h, dir], i) => { if (ru <= 0) return; ctx.save(); ctx.translate(0, (1 - ru) * h * 1.1); X.lightPerson(ctx, t, x, FLOOR, h, { dir, look: lerp(-.2, .8, up), armR: [lerp(1.75, 2.6, up), lerp(1.75, 2.7, up)], light: span(t, a.today + .7, a.today + 1) }); ctx.restore(); });
    ctx.restore();
  };
  // ---------------------------------------------------------------- 5.19–5.23 the board (small), the three groups, you
  const mbU = (t) => smooth(span(t, a.who - .3, a.who + .7));
  const drawMB = (ctx, t, o = {}) => {
    const u = mbU(t); if (u <= 0) return;
    const r3 = o.row3 ?? 1;   // sc12: the DISCOVERY row lifts off (its slot stays, dashed, until it is set back)
    const lit = .6 * Math.sin(Math.PI * span(t, a.who + .2, a.who + 1.6)) + .3 * smooth(span(t, a.labs, a.you + 1));
    ctx.save(); ctx.translate(0, (1 - expoOut(u)) * -260);
    F.board(ctx, t, MB.x, MB.y, { w: 600, mini: true, s: MB.s, title: 'THE FOUR LINES', cells: 14, rows: [...['ENERGY', 'MATERIALS', 'DISCOVERY'].map((s, i) => (i === 2 && r3 < 1 ? { dashed: true, a: 1 } : { text: s, status: 'BEGUN', gold: 1 })), { text: 'CONTROL', dashed: true, lit }] });
    ctx.restore();
  };
  const grpU = (i, t) => { const t0 = [a.labs, a.govs, a.voters][i]; return expoOut(span(t, t0 - .25, t0 + .55)) * (1 - sineIO(span(t, a.left + .2 + i * .12, a.left + 1.3 + i * .12))); };
  const drawGroups = (ctx, t) => {
    if (t < a.labs - .4) return;
    const [rx, ry] = row4();
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, FLOOR + 2); ctx.clip();
    GRP.forEach((g, i) => {
      const u = grpU(i, t); if (u <= 0) return;
      ctx.save(); ctx.translate(0, (1 - u) * 280);
      if (g.prop === 'bench') { X.table(ctx, g.x + 120, FLOOR, 150, 90); F.lineIcon(ctx, 'flask', g.x + 120, FLOOR - 128, 34, { w: 2.5, a: .9 }); }
      else if (g.prop === 'desk') X.desk(ctx, g.x + 130, FLOOR, 180, 84);
      else X.ballotBox(ctx, t, g.x + 120, FLOOR, 100, { paper: span(t, a.rulesW - .2, a.rulesW + .7) });
      let hand = null;
      [[-70, 176, 1], [0, 190, 1], [-140, 166, 1]].forEach(([dx, h, dir], k) => { const lead = k === 1; const hd = F.person(ctx, g.x + dx, FLOOR, h, { dir, look: lead ? .75 : .45, armR: lead ? [2.45, 2.7] : [.2, .1], light: .6 }); if (lead) hand = hd.R; });
      ctx.restore();
      if (hand) { const hy = hand[1] + (1 - u) * 280; F.halo(ctx, hand[0], hy, 50, .7 * u, GOLD.halo, GOLD.core);
        const lu = span(t, [a.labs, a.govs, a.voters][i] + .3, [a.labs, a.govs, a.voters][i] + 1.3) * (1 - span(t, a.left, a.left + .6));
        if (lu > 0) F.trailCream(ctx, [[hand[0], hy - 10], [lerp(hand[0], rx, .5), lerp(hy, ry, .5) - 40], [rx - 150 + i * 150, ry + 30]], 0, smooth(lu), { w: 2, a: .7 }); }
    });
    ctx.restore();
  };
  // you: walk in from the right to the voters (5.23), then to the board's foot (6.01)
  const youAt = (t) => {
    const i0 = a.you - .5, i1 = a.you + .9, m0 = a.left + .5, m1 = a.left + 2.6; if (t < i0) return null;
    if (t < i1) { const p = F.powOut(span(t, i0, i1), 1.6); return [lerp(2200, 1700, p), -1, Math.PI * 2 * 5 * (1 - p) + Math.PI * 2]; }
    if (t < m0) return [1700, -1, null];
    if (t < m1) { const p = sineIO(span(t, m0, m1)); return [lerp(1700, 1190, p), -1, Math.PI * 2 * 5 * p + Math.PI * 2]; }
    return [1190, -1, null];
  };
  const drawYou = (ctx, t) => {
    const w = youAt(t); if (!w) return;
    const raise = smooth(span(t, a.you + .5, a.you + 1.1)) * (1 - smooth(span(t, a.left + .3, a.left + .9)));
    const hd = F.du(ctx, w[0], FLOOR, YOUH, { dir: w[1], walk: w[2] ?? undefined, look: lerp(.3, .85, smooth(span(t, a.left + 2.4, a.left + 3.2))), armR: [lerp(.5, 2.5, raise), lerp(.3, 2.7, raise)], light: .9 });
    if (hd?.R) F.stylus(ctx, t, hd.R[0] - 4, hd.R[1] - 8 - 40 * raise, lerp(-1.2, -Math.PI / 2 - .2, raise), 96, { w: 3.6 });
  };

  // ---------------------------------------------------------------- the hall (B of the portal; then the frame)
  const drawHall = (ctx, t) => {
    const c = cam(t);
    F.night(ctx, t, { glow: [960, 420, 1000, .5 + .05 * Math.sin(t * 1.3)], ox: -(c.cx - cEnd.cx) * .05, oy: -(c.cy - cEnd.cy) * .05 });
    F.look(ctx, c.cx, c.cy, c.z, () => drawObjs(ctx, t));
    return c;
  };
  // the hall's objects in world space (sc12 draws them under its own camera while it lifts the DISCOVERY row off the board)
  const drawObjs = (ctx, t, o = {}) => {
    { const u = smooth(span(t, a.paul + .4, a.paul + 1.6)); if (u > 0) F.outline(ctx, [[[960, FLOOR], [-200, FLOOR]], [[960, FLOOR], [o.floorTo ?? 2200, FLOOR]]], u, { w: 1.6, a: .5 }); }
    drawRing(ctx, t);
    drawLectern(ctx, t);
    drawSlot(ctx, t);
    drawTracks(ctx, t);
    drawLab(ctx, t);
    drawTools(ctx, t);
    drawMB(ctx, t, o);
    drawGroups(ctx, t);
    if (o.you !== false) drawYou(ctx, t);
  };
  const drawWorld = drawObjs;

  // ======================================================================================================================== draw
  const draw = (ctx, t) => {
    if (t < tP0) { s10.draw(ctx, t); return; }
    if (t < tP1) { irisPortal(ctx, span(t, tP0, tP1), s10.pkgScreenWin(t), (c) => s10.draw(c, t), (c) => drawHall(c, t)); questionQ(ctx, t); return; }
    const c = drawHall(ctx, t);
    const sp = (x, y) => F.lookPt(c.cx, c.cy, c.z, x, y);
    questionQ(ctx, t);
    // 5.14 who he is (≥ 22 px)
    { const u = io(t, a.paul + .1, a.fall + .2); if (u > 0) { const x = 1240, y = 640;
      F.maskLine(ctx, [['Paul Christiano', 0]], x, y, 50, rise(u), { glow: true });
      F.capsLabel(ctx, 'FOUNDER, ALIGNMENT RESEARCH CENTER', x, y + 46, span(u, .15, 1), { size: 22, align: 'left', col: CREAM });
      F.capsLabel(ctx, 'ONCE LED THAT RESEARCH AT OPENAI', x, y + 84, io(t, a.openai - .25, a.fall + .25), { size: 22, align: 'left' });
      F.capsLabel(ctx, 'BOARD, OPENAI FOUNDATION', x, y + 118, io(t, a.board - .2, a.fall + .3), { size: 22, align: 'left' }); } }
    { const u = io(t, a.methods - .3, a.c4s - .5, .35); if (u > 0) { const [x, y] = sp(SLOT.cx, SLOT.cy - SLOT.h / 2 - 50); F.capsLabel(ctx, 'THE METHODS WE HAVE', x, y, u, { size: 28, col: CREAM }); } }
    // C4: the plate out of the slot and back (screen rect of the slot in canvas pixels: the plate draws untransformed)
    { const tin = a.c4s - .35, tout = a.c4e - .45;
      if (t > tin && t < a.c4e + .4) {
        const m = sineIO(span(t, tin, a.c4s + .5)) * (1 - sineIO(span(t, tout, a.c4e + .35)));
        const [x0, y0] = sp(SLOT.cx - SLOT.w / 2, SLOT.cy - SLOT.h / 2), [x1, y1] = sp(SLOT.cx + SLOT.w / 2, SLOT.cy + SLOT.h / 2), M = ctx.getTransform(), k = ctx.canvas.width / W;
        const p0 = M.transformPoint({ x: x0, y: y0 }), p1 = M.transformPoint({ x: x1, y: y1 });
        F.clipPlate(ctx, t, T, 'C4', { from: { x: p0.x / k, y: p0.y / k, w: (p1.x - p0.x) / k, h: (p1.y - p0.y) / k }, morph: m, dark: 1 - smooth(span(t, tin, tin + .45)) * (1 - smooth(span(t, a.c4e + .05, a.c4e + .38))) });
      } }
    { const u = io(t, a.plaus - .05, a.none + .2, .35); if (u > 0) F.verdict(ctx, t, W / 2, 470, 'PLAUSIBLE', u, { size: 36 }); }
    { const u = io(t, a.none + .5, a.today - .1); if (u > 0) { const [x, y] = sp(LANES.fin, LANES.y0 - 62); X.creamWord(ctx, t, x, y, 'PROBABLY WORKS', u, { size: 26 }); } }
    { const u = io(t, a.probably - .1, a.today - .1); if (u > 0) { const [x, y] = sp((LANES.x0 + LANES.fin) / 2, LANES.y0 + 5 * LANES.dy + 20); F.capsLabel(ctx, 'NONE ON TRACK TO PROBABLY WORK', x, y, u, { size: 24, col: CREAM }); } }
    { const u = io(t, a.themselves - .15, a.who - .8); if (u > 0) F.verdict(ctx, t, W / 2, 200, 'THE MACHINES THEMSELVES, TO STUDY', u, { size: 32 }); }
    { const u = io(t, a.never - .2, a.who - .8); if (u > 0) F.capsLabel(ctx, 'WHAT JACK GOOD NEVER HAD', W / 2, 250, u, { size: 22 }); }
    // 5.19 the question at row 4
    { const u = io(t, a.who + .3, a.left - .2); if (u > 0) { const [x, y] = sp(MB.x + 600 * MB.s + 26, MB.y + (112 + 3 * 78 + 50) * MB.s); X.creamWord(ctx, t, x, y, 'WHO WRITES IT?', u, { size: 28, align: 'left' }); } }
    // 5.20–5.22 the groups
    GRP.forEach((g, i) => { const t0 = [a.labs, a.govs, a.voters][i], t1 = [a.built, a.tested, a.rulesW][i], o = a.left - .1 + i * .1;
      const [x, y] = sp(g.x, FLOOR + 50); F.capsLabel(ctx, ['LABS', 'GOVERNMENTS', 'VOTERS'][i], x, Math.min(y, 860), io(t, t0 + .1, o), { size: 26, col: GOLD.text });
      const [x2, y2] = sp(g.x, FLOOR - 260); F.capsLabel(ctx, ['WHAT GETS BUILT', 'WHAT GETS TESTED', 'WHO WRITES THE RULES'][i], x2, y2, io(t, t1 - .1, o), { size: 22, col: CREAM }); });
    { const u = io(t, a.you + .4, a.left + .2); if (u > 0) { const [x, y] = sp(1700, FLOOR - YOUH - 150); F.verdict(ctx, t, x, y, 'YOU', u, { size: 38 }); } }
    // 6.01 the question
    if (a.leftW && t > a.leftW[0] - .2) F.question(ctx, t, 'What else is left for us?', W / 2 + 40, 520, 58, { ts: a.leftW, out: span(t, a.spring - .2, a.spring + .5) });
  };
  // "AND THE MACHINE ITSELF?" over the portal and the ring (screen)
  const qW = F.wordTimes(T, 'And the machine itself', null, a.itself - .1);
  const questionQ = (ctx, t) => { if (qW && t > a.itself - .2 && t < a.paul + .8) F.question(ctx, t, 'And the machine itself?', W / 2, 830, 54, { ts: qW, out: span(t, a.paul - .3, a.paul + .4) }); };
  return { draw, a, cam, drawWorld, drawYou, MB, YOUX: 1190, FLOOR, YOUH, K };
}
