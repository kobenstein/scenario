// c09 · B3 · WHAT EUROPE WINS · 'So suppose all five' → 'Together, they could.' One continuous take on THE PLAN SHEET, no cut:
// out of the B2 → B3 plate (plateFour, drawn exactly for [T0, T0 + .5)), the minds piece flies into its slot ("suppose"), the disc
// shrinks to the left and draws the two race tracks out of its rim, then rides up into the HUD; the camera flies into one workshop's
// window (the satellite maker) and back out; six workshops turn into old works; ★ the push into one old works: its drawings light up
// gold, the internet and a chatbot stop at its wall; the works' interior grows into the C4 plate; under the shrinking plate the
// draw of c10 takes over (8.06–8.07: the plate becomes data box 5, the twelve boxes merge into one block over ENOUGH).
//
// | ID   | anchor (phrase)            | zeigt wörtlich                                                                         | kind | carrier out       |
// |------|----------------------------|----------------------------------------------------------------------------------------|------|-------------------|
// | 8.01 | So suppose all five        | plateFour; the four seated parts turn gold, the minds piece flies into its slot: WHAT DOES EUROPE WIN? | EXPL | the rim |
// | 8.02 | Not the biggest chatbot    | the disc shrinks left, two tracks draw out of its rim: THE MOST COMPUTERS (compute, the big chatbot, it dims) · PUTTING AI TO WORK (ten workshops, AI glints in their windows); the disc → HUD | EXPL | a workshop window |
// | 8.03 | One satellite maker        | fly into the window: an engineer turns a satellite on a screen, the design cycle tightens: SHORTER DESIGN CYCLES + source (KB7 partnership line) | MIX | the window |
// | 8.04 | And more than half         | out again: six of ten workshops turn into old works: OVER 100 YEARS OLD; ★ push into one: decades of drawings light up gold, the internet ends at its wall, a chatbot's beam stops there: ONLY 20% USE AI + sources | MIX | the works interior |
// | 8.05 | That argument comes from   | the interior grows into the (dark) clip plate: PETER KOERTE · A SENIOR SIEMENS EXECUTIVE · SIEMENS SELLS THIS KIND OF AI · SO HE ISN'T NEUTRAL | MIX | the plate |
// | 8.06 | slot:C4                    | C4 · PETER KOERTE (the dark lifts at the clip start)                                    | CLIP | the plate shrinks |
// | 8.07 | No single company          | (sc10 dataStage) the plate becomes one small data box of twelve; they merge into one block over ENOUGH: TOGETHER, ENOUGH DATA | EXPL | the block → c10 |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as S from '../lib/f69_world.mjs';
import * as X from '../lib/f69_explain.mjs';
import * as B from './sc12.mjs';
import * as C10 from './sc10.mjs';
const { W, H, rgba, clamp, lerp, span, sineIO, expoOut, halo } = E;
const { GOLD, COOL, PAPER, CREAM, CREAM2, SOURCES: SRC } = F;
const PR = F.PRINT69;

const memo = new WeakMap();
function anchors09(T) {
  if (memo.has(T)) return memo.get(T);
  const a = T.G('So suppose all five'), G = (p) => T.G(p, 0, a);
  const A = { a, together: G('come together'), what: G('What does Europe win'), not: G('Not the biggest chatbot'), chatE: T.GE('the biggest chatbot', 0, a),
    second: G('But a second race'), putting: G('putting AI to work'), sat: G('One satellite maker'), cut: G('to cut its development'),
    half: G('And more than half'), over: G('over a hundred years'), much: G('Much of what they know'), never: G('has never been on'), internet: G('the internet'),
    noBot: G('No chatbot has read'), arg: G('That argument comes from'), koerte: G('Peter Koerte'), senior: G('a senior Siemens'), sells: G('Siemens sells this'),
    so: G("so he isn't"), listen: G('But listen to his point'), C4: T.clip('C4') };
  memo.set(T, A); return A;
}

const VS = { x: 960, y: 560, s: 1 };       // the races (as in c11)
const VW = { x: 1180, y: 600, s: 1.15 };   // the workshops (8.04)
const VST1 = { x: 1270, y: 636, s: 7 };    // ★ inside the old works
const VST2 = { x: 1292, y: 628, s: 6 };    //   … with the chatbot outside its wall
const VK = { x: 1640, y: 630, s: 1.75 }, VK2 = { x: 1660, y: 640, s: 1.9 };   // 8.05: the row and the seller
const DL = { x: 250, y: 570, r: 100 };     // the disc at the tracks' start (as in c11)
const PD = S.PLATE_DISC;
const WIN = (() => { const w = B.shopWin(B.SAT_SHOP); return [w.x + w.w / 2, w.y + w.h / 2]; })();
const ALL_GOLD = [0, 1, 2, 3].map(() => ({ kind: 'gold', u: 1, lit: 0 })).concat([{ kind: 'open', u: 1, lit: 0 }]);

function makeDraw09(T) {
  const A = anchors09(T), C4 = A.C4, D10 = C10.makeDraw10(T);
  const T_HUD = [A.putting - .2, A.putting + 1.1];
  const go = (t) => sineIO(span(t, A.not - .4, A.not + 1.1));
  const viewAt = (t) => {
    const pv = { x: W / 2, y: H / 2, s: S.creep(t, T, 'So suppose all five') };
    let v = B.mixView(pv, VS, go(t));
    const zin = sineIO(span(t, A.sat - .35, A.sat + 1.45)), zout = sineIO(span(t, A.half - .25, A.half + 1.65)), e = zin * (1 - zout);
    v = B.zoomView(B.mixView(VS, VW, zout), WIN, 80, e);
    if (t < A.sat - .35) v = B.mixView(pv, VS, go(t));
    const s1 = sineIO(span(t, A.much - .3, A.much + 1.1)), s2 = sineIO(span(t, A.noBot - 1.5, A.noBot + .6));
    if (s1 > 0) v = B.mixView(v, VST1, s1);
    if (s2 > 0) v = B.mixView(v, VST2, s2);
    const k1 = sineIO(span(t, A.arg - .6, A.arg + 1.8)), k2 = sineIO(span(t, A.arg + 1.8, A.listen + .2));   // 8.05: back out to the seller
    if (k1 > 0) v = B.mixView(v, B.mixView(VK, VK2, k2), k1);
    const bk = sineIO(span(t, C4.start + .2, C4.start + 1.2)); if (bk > 0) v = B.mixView(v, C10.V9, bk);
    return v;
  };
  const poolAt = (t) => ({ lx: lerp(960, 1700, span(t, A.arg, A.arg + 1.5)) * (1 - span(t, C4.start + .2, C4.start + 1.2)) + 960 * span(t, C4.start + .2, C4.start + 1.2), ly: lerp(lerp(470, 560, go(t)), 520, span(t, C4.start + .2, C4.start + 1.2)) });
  // the disc in sheet units: from the plate's disc to the tracks' start
  const discAt = (t) => { const g = sineIO(span(t, A.not - .2, A.not + 1.2)); return { x: lerp(PD.x, DL.x, g), y: lerp(PD.y, DL.y, g), r: Math.exp(lerp(Math.log(PD.r), Math.log(DL.r), g)), g }; };

  // 8.05 (sheet units): the seller next to the old works. Peter Koerte (an indigo silhouette, no face) stands at the end of the row; the
  // argument runs as a line from the works' gold drawings to him; beside him the box of AI that Siemens sells, a price tag on it; its
  // lines go out to the old works (sells); a hairline ties him to the box: NOT NEUTRAL.
  const KX = 1900, GY = B.TR.yB + B.TR.half, BOX = { x: 1990, y: GY - 70, w: 100, h: 70 };
  const ART = [B.shopX(B.STAR_SHOP), B.shopBase() - 40];
  function seller(ctx, t) {
    const g = span(t, A.arg - .2, A.arg + .8), out = 1 - span(t, C4.start - .2, C4.start + .2); if (g <= 0 || out <= 0) return;
    X.lightLine(ctx, [[B.TR.x1 + 20, GY], [2200, GY]], g, { a: .5, w: 2.2 });   // the ground runs on past the row
    const arg = span(t, A.arg + .2, A.koerte + .3);
    if (arg > 0) X.lightLine(ctx, E.catmull([ART, [1620, 520], [KX - 10, GY - 150]], 12).map((p) => [p[0], p[1]]), arg, { a: .7 * out, w: 2.4, col: rgba(GOLD.line, .7 * out) });
    const pu = span(t, A.arg + .3, A.koerte + .2);
    if (pu > 0) { ctx.save(); ctx.globalAlpha *= clamp(pu * 2); const walk = 1 - pu; E.person(ctx, KX + walk * 120, GY, 126, { dir: -1, light: .75, view: walk > .02 ? 'side' : undefined, walk: walk > .02 ? t * 10 : undefined, look: .1 + .05 * Math.sin(t * .7), rim: CREAM }); ctx.restore(); }
    // the box of AI (cool), with a price tag (no figure on it)
    const bu = span(t, A.sells - .1, A.sells + .7);
    if (bu > 0) {
      const k = expoOut(bu), b = { x: BOX.x, y: BOX.y + (1 - k) * 60, w: BOX.w, h: BOX.h };
      ctx.save(); ctx.beginPath(); ctx.rect(b.x - 60, GY - 220, b.w + 140, 220); ctx.clip();
      halo(ctx, b.x + b.w / 2, b.y + b.h / 2, 130, .35 * k, COOL.halo, COOL.core);
      ctx.fillStyle = E.mixHex(E.P.night1, COOL.deep, .7); ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 6); ctx.fill();
      ctx.strokeStyle = rgba(COOL.line, .85); ctx.lineWidth = 2; ctx.stroke();
      E.glowText(ctx, 'AI', b.x + b.w / 2, b.y + b.h * .64, { size: 30, weight: 700, align: 'center', col: COOL.core, glow: false, spacing: .1 });
      const sw = Math.sin(t * 1.6) * .12, tx = b.x + b.w + 4, ty = b.y + 6;   // the price tag on a string
      ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(b.x + b.w - 8, b.y + 4); ctx.lineTo(tx + 10, ty + 12); ctx.stroke();
      ctx.save(); ctx.translate(tx + 10, ty + 12); ctx.rotate(.5 + sw); ctx.fillStyle = PAPER.lit;
      ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(30, -9); ctx.lineTo(30, 9); ctx.lineTo(0, 9); ctx.lineTo(-9, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = E.P.night1; ctx.beginPath(); ctx.arc(-1, 0, 2.4, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = rgba(PAPER.faint, .8); ctx.fillRect(8, -3, 16, 2); ctx.fillRect(8, 2, 11, 2);
      ctx.restore(); ctx.restore();
    }
    // sells: lines from the box out to the old works (arrow heads at the roofs)
    [B.STAR_SHOP, 6, 8].forEach((i, n) => {
      const u = span(t, A.sells + .5 + n * .2, A.sells + 1.5 + n * .2) * out; if (u <= 0) return;
      const p0 = [BOX.x + BOX.w / 2, BOX.y - 6], p1 = [B.shopX(i), B.shopBase() - B.SHOP.h - 30], mid = [lerp(p0[0], p1[0], .5), Math.min(p0[1], p1[1]) - 110 + n * 20];
      const pts = E.catmull([p0, mid, p1], 14).map((p) => [p[0], p[1]]);
      X.lightLine(ctx, pts, u, { a: .75, w: 2.2, dash: [9, 7], col: rgba(COOL.line, .8 * out), glowCol: COOL.halo });
      if (u >= 1) { const a = pts[pts.length - 2], z = pts[pts.length - 1], ang = Math.atan2(z[1] - a[1], z[0] - a[0]); ctx.save(); ctx.translate(z[0], z[1]); ctx.rotate(ang); ctx.fillStyle = rgba(COOL.core, .9 * out); ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-10, -6); ctx.lineTo(-10, 6); ctx.closePath(); ctx.fill(); ctx.restore(); }
    });
    // he is on the seller's side: a hairline from him to the box
    const tie = span(t, A.so - .1, A.so + .6) * out;
    if (tie > 0) X.lightLine(ctx, [[KX + 18, GY - 90], [BOX.x - 4, BOX.y + 20]], tie, { a: .8, w: 2, col: rgba(CREAM, .8) });
  }

  function races(ctx, t, v) {
    const d = discAt(t), hud = span(t, ...T_HUD), uA = span(t, A.not + .1, A.not + 1.0), uB = span(t, A.second + .1, A.second + 1.0);
    const dimA = span(t, A.chatE - .1, A.chatE + .8), fadeA = span(t, A.half + .2, A.half + 1.2), goneA = 1 - span(t, A.arg - .5, A.arg + .8);
    X.inView(ctx, v, () => {
      B.leadIns(ctx, t, d.x, d.y, d.r, uA, uB, hud);
      B.lane(ctx, t, B.TR.yA, uA, { a: (1 - .5 * dimA) * (1 - .6 * fadeA) * goneA });
      B.lane(ctx, t, B.TR.yB, uB, {});
      B.chatBubble(ctx, t, 600, B.TR.yA - B.TR.half - 96, 200, { u: span(t, A.not + .3, A.not + 1.1), a: (1 - .6 * dimA) * (1 - .6 * fadeA) * goneA, glow: 1 - .7 * dimA });
      if (goneA > 0) { ctx.save(); ctx.globalAlpha *= goneA; B.computeStacks(ctx, t, span(t, A.not + .4, A.not + 1.5), { dim: Math.max(dimA, fadeA) }); ctx.restore(); }
      const satOn = t > A.sat - .6 && t < A.half + 2;
      for (let i = 0; i < 10; i++) {
        const j = B.OLD.indexOf(i), old = j < 0 ? 0 : span(t, A.half + .6 + j * .16, A.half + 1.5 + j * .16);
        const nb = i === B.STAR_SHOP + 1 ? 1 - .7 * span(t, A.much - .2, A.much + .8) * (1 - span(t, A.arg, A.arg + 1.2)) : 1;   // ★: the neighbour steps back (the net lies there)
        ctx.save(); ctx.globalAlpha *= nb;
        B.workshop(ctx, t, i, { u: span(t, A.second + .4 + i * .06, A.second + 1.4 + i * .06), lit: .7, old, ai: span(t, A.putting + i * .08, A.putting + .45 + i * .08) * (1 - .7 * old),
          win: i === B.SAT_SHOP && satOn ? (c) => B.satelliteScene(c, t, { shrink: span(t, A.cut, A.cut + 1.3), cyc: span(t, A.sat + .5, A.sat + 1.1), turn: t * .35 }) : undefined });
        ctx.restore();
      }
      // ★ the old works opened
      if (t > A.much - .4) B.worksOpen(ctx, t, { cut: span(t, A.much + .3, A.much + 1.0), data: span(t, A.never - .1, A.never + 1.4), net: span(t, A.internet - .5, A.internet + .7), bot: span(t, A.noBot, A.noBot + .9) });
      if (t > A.arg - .3) seller(ctx, t);
    });
  }

  function draw(ctx, t) {
    if (t >= C4.end - .2) { D10.draw(ctx, t); return; }
    const v = viewAt(t), morph = sineIO(span(t, A.listen + .2, C4.start + .15));
    X.sheet(ctx, t, v, poolAt(t));
    if (morph < 1) races(ctx, t, v);
    // the disc (8.01–8.02): "suppose": the four turn gold and the minds piece flies into its slot; then the disc shrinks left; → HUD
    const d = discAt(t), [cx, cy] = X.toScreen(v, d.x, d.y), r = d.r * v.s;
    const sup = span(t, A.together - .4, A.together + .6) * (1 - span(t, A.not - .3, A.not + .6)), seat = sineIO(span(t, A.together - .3, A.together + .7)) * (1 - sineIO(span(t, A.not - .3, A.not + .7)));
    const lx = lerp(1.32, 1.56, d.g), ly = lerp(1.06, .52, d.g);
    if (t < T_HUD[0]) {
      if (sup > 0) halo(ctx, cx, cy, r * 2.2, .25 * sup, GOLD.halo, GOLD.core);
      F.kitDisc(ctx, t, cx, cy, r, F.kitParts(T, t).parts, { glow: .8 + .2 * sup, stars: 0, loose: false });
      if (sup > 0) F.kitDisc(ctx, t, cx, cy, r, ALL_GOLD, { a: sineIO(sup), glow: 0, stars: 0, loose: false });   // "suppose": the gold lies over the honest state
      const [sx, sy] = F.pieceCentre(4, cx, cy, r), px = lerp(cx + r * lx, sx, seat), py = lerp(cy + r * ly, sy, seat) - Math.sin(Math.PI * seat) * r * .25, rot = lerp(.35, 0, seat);
      if (sup < 1) F.loosePiece(ctx, t, 4, px, py, r, { kind: 'blank', lit: .6, rot, glow: 0, a: 1 - sup });
      if (sup > 0) F.loosePiece(ctx, t, 4, px, py, r, { kind: 'gold', rot, glow: 0, a: sup });
    } else if (t < T_HUD[1]) B.discToHud(ctx, t, T, { x: cx, y: cy, r, glow: .8, lx, ly, rot: .35 }, span(t, ...T_HUD));
    // texts
    X.big(ctx, 'WHAT DOES EUROPE WIN?', W / 2, 860, 56, span(t, A.what - .05, A.what + .6) * (1 - span(t, A.not - .1, A.not + .4)), { gold: .45 });
    const lo = 1 - span(t, A.sat - .5, A.sat - .1);
    const [lx0, lyA] = X.toScreen(v, B.TR.x0, B.TR.yA + B.TR.half + 50), [, lyB] = X.toScreen(v, B.TR.x0, B.TR.yB + B.TR.half + 50);
    X.label(ctx, SRC.firstRace, lx0, lyA, span(t, A.not + .6, A.not + 1.2) * lo, { align: 'left', size: 30, spacing: .1, col: CREAM2 });
    X.label(ctx, SRC.secondRace, lx0, lyB, span(t, A.putting - .1, A.putting + .5) * lo, { align: 'left', size: 32, spacing: .1, gold: .6, col: GOLD.text });
    X.label(ctx, 'SHORTER DESIGN CYCLES', 330, 660, span(t, A.cut, A.cut + .6) * (1 - span(t, A.half - .2, A.half + .3)), { size: 30, spacing: .12 });
    F.source(ctx, t, A.sat + .6, A.half + .2, SRC.weeksHoursSrc);
    X.label(ctx, SRC.old100, 1180, 800, span(t, A.over, A.over + .6) * (1 - span(t, A.much - .2, A.much + .3)), { size: 34, spacing: .12 });
    F.source(ctx, t, A.over + .2, A.noBot - .2, SRC.old100Src);
    X.label(ctx, SRC.only20, 120, 170, span(t, A.noBot + .3, A.noBot + .9) * (1 - span(t, A.arg - .1, A.arg + .4)), { size: 40, spacing: .1, align: 'left' });
    F.source(ctx, t, A.noBot + .4, A.arg + .6, SRC.only20Src);
    // 8.05 labels (screen, at the seller): his name small, the seller, NOT NEUTRAL
    const lo5 = 1 - span(t, A.listen + .3, A.listen + .8);
    const [kx, ky] = X.toScreen(v, KX, GY - 126 - 34), [bx, by] = X.toScreen(v, BOX.x + BOX.w / 2, BOX.y - 44), [, gy] = X.toScreen(v, KX, GY);
    X.label(ctx, 'PETER KOERTE', kx + 30, gy + 52, span(t, A.koerte - .1, A.koerte + .5) * lo5, { size: 30, spacing: .1, align: 'right' });
    X.label(ctx, 'SENIOR EXECUTIVE, SIEMENS', kx + 30, gy + 88, span(t, A.senior - .1, A.senior + .5) * lo5, { size: 28, spacing: .1, col: CREAM2, align: 'right' });
    X.label(ctx, 'SIEMENS SELLS THIS AI', W - 40, gy + 52, span(t, A.sells, A.sells + .6) * lo5, { size: 30, spacing: .1, col: COOL.text, align: 'right' });
    X.dateTag(ctx, 'NOT NEUTRAL', kx - 110, gy + 140, span(t, A.so + .2, A.so + .8) * lo5);
    X.label(ctx, 'OLD WORKS', X.toScreen(v, B.shopX(B.STAR_SHOP), 0)[0], gy + 64, span(t, A.arg + .4, A.arg + 1.0) * lo5, { size: 28, spacing: .14, col: CREAM2 });
    // 'But listen to his point': the plate grows out of him (dark), the dark lifts at the clip
    if (morph > 0) {
      const p0 = X.toScreen(v, KX - 45, GY - 140), from = { x: p0[0], y: p0[1], w: 90 * v.s, h: 140 * v.s };
      const dark = 1 - span(t, C4.start - 1.0, C4.start);
      F.clipPlate(ctx, t, T, 'C4', { from, morph, dark });
    }
    if (t >= T_HUD[1]) F.kitHud(ctx, t, T);   // the HUD over everything (also over the plate's corner)
  }
  return { draw, A };
}

export default async (T, R) => {
  const { draw, A } = makeDraw09(T);
  const marks = [R.a, A.not, A.sat, A.half, A.much, A.arg, A.C4.start, A.C4.end - .2].filter((x) => x >= R.a && x < R.b);
  return marks.map((t) => ({ t, draw, print: PR }));
};
