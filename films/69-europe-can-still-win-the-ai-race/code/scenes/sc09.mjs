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
const { GOLD, CREAM, CREAM2, SOURCES: SRC } = F;
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
    const bk = sineIO(span(t, A.arg + 1.7, A.arg + 2.8)); if (bk > 0) v = B.mixView(v, C10.V9, bk);
    return v;
  };
  const poolAt = (t) => ({ lx: 960, ly: lerp(lerp(470, 560, go(t)), 520, span(t, A.arg + 1.7, A.arg + 2.8)) });
  // the disc in sheet units: from the plate's disc to the tracks' start
  const discAt = (t) => { const g = sineIO(span(t, A.not - .2, A.not + 1.2)); return { x: lerp(PD.x, DL.x, g), y: lerp(PD.y, DL.y, g), r: Math.exp(lerp(Math.log(PD.r), Math.log(DL.r), g)), g }; };

  function races(ctx, t, v) {
    const d = discAt(t), hud = span(t, ...T_HUD), uA = span(t, A.not + .1, A.not + 1.0), uB = span(t, A.second + .1, A.second + 1.0);
    const dimA = span(t, A.chatE - .1, A.chatE + .8), fadeA = span(t, A.half + .2, A.half + 1.2);
    X.inView(ctx, v, () => {
      B.leadIns(ctx, t, d.x, d.y, d.r, uA, uB, hud);
      B.lane(ctx, t, B.TR.yA, uA, { a: (1 - .5 * dimA) * (1 - .6 * fadeA) });
      B.lane(ctx, t, B.TR.yB, uB, {});
      B.chatBubble(ctx, t, 600, B.TR.yA - B.TR.half - 96, 200, { u: span(t, A.not + .3, A.not + 1.1), a: (1 - .6 * dimA) * (1 - .6 * fadeA), glow: 1 - .7 * dimA });
      B.computeStacks(ctx, t, span(t, A.not + .4, A.not + 1.5), { dim: Math.max(dimA, fadeA) });
      const satOn = t > A.sat - .6 && t < A.half + 2;
      for (let i = 0; i < 10; i++) {
        const j = B.OLD.indexOf(i), old = j < 0 ? 0 : span(t, A.half + .6 + j * .16, A.half + 1.5 + j * .16);
        const nb = i === B.STAR_SHOP + 1 ? 1 - .7 * span(t, A.much - .2, A.much + .8) : 1;   // ★: the neighbour steps back (the net lies there)
        ctx.save(); ctx.globalAlpha *= nb;
        B.workshop(ctx, t, i, { u: span(t, A.second + .4 + i * .06, A.second + 1.4 + i * .06), lit: .7, old, ai: span(t, A.putting + i * .08, A.putting + .45 + i * .08) * (1 - .7 * old),
          win: i === B.SAT_SHOP && satOn ? (c) => B.satelliteScene(c, t, { shrink: span(t, A.cut, A.cut + 1.3), cyc: span(t, A.sat + .5, A.sat + 1.1), turn: t * .35 }) : undefined });
        ctx.restore();
      }
      // ★ the old works opened
      if (t > A.much - .4) B.worksOpen(ctx, t, { cut: span(t, A.much + .3, A.much + 1.0), data: span(t, A.never - .1, A.never + 1.4), net: span(t, A.internet - .5, A.internet + .7), bot: span(t, A.noBot, A.noBot + .9) });
    });
  }

  function draw(ctx, t) {
    if (t >= C4.end - .2) { D10.draw(ctx, t); return; }
    const v = viewAt(t), morph = sineIO(span(t, A.arg - .05, A.arg + 1.5));
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
    // 8.05: the works interior grows into the C4 plate (dark), the name card on it; the dark lifts at the clip
    if (morph > 0) {
      const ins = { x: B.shopX(B.STAR_SHOP) - B.SHOP.w / 2 + 5, y: B.shopBase() - B.SHOP.h - 6 + 6, w: B.SHOP.w - 10, h: B.SHOP.h + 6 - 8 };
      const p0 = X.toScreen(v, ins.x, ins.y), from = { x: p0[0], y: p0[1], w: ins.w * v.s, h: ins.h * v.s };
      const dark = 1 - span(t, C4.start - .2, C4.start + .6);
      ctx.save(); ctx.globalAlpha *= span(t, A.arg - .05, A.arg + .45); F.clipPlate(ctx, t, T, 'C4', { from, morph, dark }); ctx.restore();   // the dark card fades in over the interior
      if (morph > .5 && dark > 0) {   // a slow light drifts across the dark plate behind the name card (the plate waits for the voice)
        const R = F.CLIP_RECT, k = span(t, A.arg + .8, C4.start + .4);
        ctx.save(); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 14); ctx.clip();
        halo(ctx, lerp(R.x + 200, R.x + R.w - 200, sineIO(k)), R.y + R.h * (.42 + .1 * Math.sin(t * .4)), 760, .16 * dark * span(morph, .5, 1), E.P.blue0, E.P.blue1);
        ctx.restore();
      }
      const o1 = 1 - span(t, A.sells - .4, A.sells);
      X.big(ctx, 'Peter Koerte', W / 2, 500, 96, span(t, A.koerte - .1, A.koerte + .5) * o1, { gold: .3 });
      X.label(ctx, 'A SENIOR SIEMENS EXECUTIVE', W / 2, 580, span(t, A.senior, A.senior + .6) * o1, { size: 30, spacing: .14 });
      const o2 = 1 - span(t, A.listen - .1, A.listen + .5);
      X.label(ctx, 'SIEMENS SELLS THIS KIND OF AI', W / 2, 500, span(t, A.sells, A.sells + .6) * o2, { size: 36, spacing: .12 });
      X.label(ctx, "SO HE ISN'T NEUTRAL", W / 2, 566, span(t, A.so, A.so + .6) * o2, { size: 30, spacing: .14, col: CREAM2 });
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
