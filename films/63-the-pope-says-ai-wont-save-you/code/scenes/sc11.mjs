// c11 · B3 · 'The night the letter came out' → 'None of this arrives'. Plan: docs/shots.md 8.01–8.19. One entry, one draw function.
// Starts on the last frame of c10 (IS ANY OF IT RIGHT?, drawn by sc10's own scene so the inner seam is exact).
//
// | ID      | anchor (phrase)            | motif                                                                            | type | carrier → next          |
// |---------|----------------------------|----------------------------------------------------------------------------------|------|-------------------------|
// | 8.01–02 | The night the letter       | the gold ? flies down and becomes the avatar of an X post: EDDY LAZZARIN · a16z; "artificial intelligence" lifts out of his sentence, a dashed slot stays | EXPL | the post |
// | 8.03    | Half of that is true       | the post folds into one bar, the bar splits: HALF TRUE                            | EXPL | the halves              |
// | 8.04–05 | The first two chapters     | the halves split into the five chapters (width = paragraphs); I–II classic teaching; every paragraph a tick, gold = names AI (our count) | EXPL | two ticks |
// | 8.06–08 | Two of them we have heard  | §98 and §107 lift out of chapter III as cards (the plant, the dials return small) | EXPL | the two cards           |
// | 8.09–10 | A reviewer                 | the cards fold into a magazine page: IDOLS OF THE VALLEY … WISE BUT FRUSTRATING   | EXPL | the page                |
// | 8.11–12 | Within a week              | the page turns: the poll sheet, the shortened §99 sentence lights as spoken       | EXPL | the sheet               |
// | 8.13–14 | Eighty-three percent       | the sheet becomes the 83 % bar, the other four bars · A POLL PROVES NOTHING       | EXPL | the two gold bars       |
// | 8.15    | But on how these machines  | the gold bars become the Pope's cards; = ; Olah's cards grow out of the =         | EXPL | the pairs               |
// | 8.16    | This is not Rome           | ROME · VS · SILICON VALLEY, the VS breaks, one bridge                             | MIX  | the bridge's keystone   |
// | 8.17    | On the rest, the test      | iris: the kitchen of H.04, you at the table                                       | SCENE | the letter             |
// | 8.18    | The letter carries         | the letter on the table opens with warm light                                     | MIX  | its light               |
// | 8.19    | Technology turned toward   | through the light: the workshop, a machine does the work, two leave early together · §156 | MIX | the door (→ c12) |
import * as F from '../lib/f63_kit.mjs';
import * as X from '../lib/f63_b3_extra.mjs';
import { anchors10, scene10, qMarkPos } from './sc10.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER } = F;
export const PRINT = F.PRINT63;

export function anchors11(T, R) {
  const G = (p, after = R.a - .5) => T.G(p, 0, after), GE = (p, after = R.a - .5) => T.GE(p, 0, after);
  const a = { start: R.a };
  a.night = G('The night the letter came out'); a.vc = G('venture capitalist', a.night); a.answered = G('answered', a.night);
  a.take = G('Take artificial intelligence'); a.ai = G('artificial intelligence', a.take); a.wrote = G('he wrote', a.take); a.notMuch = G('not much would change', a.take);
  a.half = G('Half of that is true'); a.true_ = G('true', a.half);
  a.first = G('The first two chapters'); a.classic = G('classic Church teaching', a.first);
  a.later = G('But the later chapters'); a.passages = G('passages that could', a.later); a.machines = G('about these machines', a.later);
  a.two = G('Two of them we have heard'); a.grown = G('That they are grown'); a.few = G('And that a few people'); a.morals = G('pick their morals', a.few);
  a.reviewer = G('A reviewer put'); a.headline = G('in a headline', a.reviewer); a.wise = G('Wise, but'); a.frus = G('frustrating', a.wise);
  a.week = G('Within a week'); a.shown = G('were shown one sentence', a.week); a.short = G('slightly shortened', a.week);
  a.that = G('That these machines do not feel'); a.resp = GE('responsibility mean', a.that);
  a.e83 = G('Eighty-three'); a.agreed = G('agreed', a.e83); a.poll = G('A poll proves nothing');
  a.but = G('But on how these machines'); a.steers = G('who steers them', a.but); a.builders = G('one of their builders', a.but); a.same = G('much the same', a.but);
  a.rome = G('This is not Rome'); a.sv = G('Silicon Valley', a.rome);
  a.rest = G('On the rest, the test'); a.life = G('your own life', a.rest);
  a.letter = G('The letter carries'); a.hopeful = G('hopeful reading', a.letter);
  a.tech = G('Technology turned toward'); a.freeing = G('freeing human time', a.tech); a.shutting = G('not shutting people out', a.tech);
  a.end = R.b;
  return a;
}
export default async (T, R) => {
  const R10 = { a: T.G('In October the Pope'), b: R.a };
  const prev = scene10(anchors10(T, R10), T);
  return [{ t: R.a, draw: scene11(anchors11(T, R), T, prev), print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ layout
const PC = { x: 330, y: 230, w: 1260, h: 420 }, AV = [PC.x + 70, PC.y + 74], AVR = 36;
const BAR = { x: 360, y: 470, w: 1200, h: 90 }, HALVES = [{ x: 360, y: 470, w: 588, h: 90 }, { x: 972, y: 470, w: 588, h: 90 }];
const CH = [[17, 45, [17]], [46, 89, [46, 67, 71, 72, 76, 80, 85]], [90, 130, [90, 93, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 116, 128, 129, 130]], [131, 181, [131, 132, 137, 140, 141, 145, 150, 153, 155, 156, 163, 164, 171, 173, 174]], [182, 228, [182, 183, 187, 190, 192, 197, 198, 199, 209, 225]]];   // Magnifica humanitas: chapters (§ from–to) and the paragraphs that name AI / algorithms (our full-text count)
const RN = ['I', 'II', 'III', 'IV', 'V'];
const CX0 = 210, CW = 1500, CGAP = 10, CY = 420, CHH = 200;
const chRects = (() => { const n = CH.map(([a0, b0]) => b0 - a0 + 1), tot = n.reduce((p, q) => p + q, 0), avail = CW - CGAP * 4; let x = CX0; return n.map((k) => { const w = avail * k / tot, r = { x, y: CY, w, h: CHH }; x += w + CGAP; return r; }); })();
const tickX = (ci, p) => { const r = chRects[ci], [a0, b0] = CH[ci]; return r.x + 10 + (r.w - 20) * (p - a0 + .5) / (b0 - a0 + 1); };
const C98 = { x: 150, y: 110, w: 780 }, C107 = { x: 990, y: 110, w: 780 };
const MAG = { x: 300, y: 130, w: 1320, h: 720 };
const ROWS = [['THE POPE’S LINE (SHORTENED, §99)', 83, 1], ['SUNDAR PICHAI (GOOGLE)', 65, 0], ['THE POPE’S SECOND LINE (REWORDED, §126)', 61, 1], ['SAM ALTMAN (OPENAI)', 54, 0], ['ELIEZER YUDKOWSKY', 22, 0]];
const BX0 = 420, BFULL = 1060, RY0 = 300, RDY = 112, BH = 40;
const barRect = (i, v = ROWS[i][1]) => ({ x: BX0, y: RY0 + i * RDY, w: BFULL * v / 100, h: BH });
const P1 = { x: 120, y: 200, w: 790 }, O1 = { x: 1010, y: 200, w: 790 }, P2 = { x: 120, y: 540, w: 790 }, O2 = { x: 1010, y: 540, w: 790 };
const QLAZ = 'You could remove the concept of artificial intelligence without changing much about the piece, which could have applied to any major technology shift.';
const Q98 = '… current AI systems are more “cultivated” than “built” …', Q107 = 'A more moral AI is not enough if that morality is determined by a few.';
const QOL1 = 'They are grown, on a structure roughly modeled after the brain …', QOL2 = 'AI development is concentrated in a handful of wealthy nations.';
const QPOLL = 'Artificial intelligence does not feel joy or pain and does not know from within what love, work, friendship or responsibility mean.';
const W_ = (s) => s.split(/\s+/).filter(Boolean);
const card = (ctx, t, r, o) => X.qcard(ctx, t, { x: r.x, y: r.y, w: r.w, ...o });
const cardH = (text, size, w, o = {}) => (o.head ? 66 : 28) + X.layout(W_(text).map((w2) => ({ w: w2 })), size, w - 100 - (o.para ? 90 : 0)).length * size * 1.24 + (o.credit ? 86 : 40);
const dials = (ctx, t, x, y, s, u) => { if (u <= 0) return; for (let i = 0; i < 3; i++) { const cx = x + i * s * 2.4, a0 = -2.2 + i * .9 + .15 * Math.sin(t * .8 + i); ctx.save(); ctx.globalAlpha *= clamp(u * 2); ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, y, s, Math.PI * .8, Math.PI * 2.2); ctx.stroke(); ctx.strokeStyle = GOLD.deep; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx + Math.cos(a0) * s * .85, y + Math.sin(a0) * s * .85); ctx.stroke(); ctx.restore(); } };

export function scene11(a, T, prev) {
  // ---------------------------------------------------------------- 8.01–8.02 · the ? → the avatar → the post
  const fly0 = a.night, fly1 = a.night + .75, unf0 = a.night + .55, unf1 = a.night + 1.45;
  const lazLines = (t) => X.layout(W_(QLAZ).map((w, i) => {
    const isAI = i === 6 || i === 7, lift = isAI ? 70 * expoOut(span(t, a.ai - .05, a.ai + .45)) : 0, gone = isAI ? span(t, a.notMuch - .35, a.notMuch + .4) : 0;
    return { w, lift, gone, slot: isAI ? span(t, a.ai + .2, a.ai + .6) : 0, g: isAI ? 1 : 0 };
  }), 42, PC.w - 140);
  const pcR = (t) => X.lrect({ x: AV[0] - AVR, y: AV[1] - AVR, w: AVR * 2, h: AVR * 2 }, PC, quartIO(span(t, unf0, unf1)));
  const drawPost = (ctx, t, r, o = {}) => {
    const u = span(t, unf0, unf1);
    X.xpost(ctx, t, r, { u });
    if (u >= 1) {
      const bo = span(t, a.half - .6, a.half - .2);
      ctx.save(); if (bo > 0) { ctx.beginPath(); ctx.rect(PC.x, PC.y + 150, PC.w, (PC.h - 150) * (1 - sineIO(bo))); ctx.clip(); }
      X.wordBlock(ctx, t, lazLines(t), PC.x + 70, PC.y + 220, 42, 56, span(t, a.answered - .3, a.answered + .6));
      ctx.restore();
    }
  };
  const avatar = (ctx, t, x, y, r) => { ctx.fillStyle = F.rad(ctx, x - r * .3, y - r * .3, r * 1.4, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill(); F.glowText(ctx, 'EL', x, y + r * .32, { size: r * .85, weight: 700, col: '#3b2410', align: 'center', glow: false }); };
  const drawQmark = (ctx, t) => {   // the gold ? from c10 flies to the avatar spot and turns into the disc
    const q = qMarkPos(), e = sineIO(span(t, fly0, fly1)), x = lerp(q[0], AV[0], e), y = lerp(q[1], AV[1], e) - Math.sin(Math.PI * e) * 60;
    if (e < .7) F.glowText(ctx, '?', x, y + 96 * .35 * (1 - e), { size: lerp(96, 50, e), serif: true, col: GOLD.body, align: 'center', glow: true });
    const d = span(e, .5, 1); if (d > 0) avatar(ctx, t, x, y, AVR * expoOut(d));
  };
  // ---------------------------------------------------------------- 8.03–8.05 · the bar, HALF TRUE, the five chapters, the ticks
  const bar0 = a.half - .45, bar1 = a.half + .3, spl0 = a.true_ - .15, spl1 = a.true_ + .35, chs0 = a.first - .25, chs1 = a.first + .6;
  const cascade = (ci, p) => { const all = CH.flatMap(([, , L], k) => L.map((q) => [k, q])); const idx = all.findIndex(([k, q]) => k === ci && q === p); return a.later + .2 + idx / all.length * 2.2; };
  const lift98 = (t) => sineIO(span(t, a.grown - .35, a.grown + .45)), lift107 = (t) => sineIO(span(t, a.few - .35, a.few + .45));
  const magU = (t) => sineIO(span(t, a.reviewer - .5, a.reviewer + 1.0));
  const drawChapters = (ctx, t) => {
    const cu = sineIO(span(t, chs0, chs1)), dn = sineIO(span(t, a.reviewer - 1.1, a.reviewer + 1.2)) * 1000;
    ctx.save(); ctx.translate(0, dn);
    chRects.forEach((r0, i) => {
      const from = i < 2 ? HALVES[0] : HALVES[1], sub = i < 2 ? [chRects[0].x, chRects[1].x + chRects[1].w] : [chRects[2].x, chRects[4].x + chRects[4].w];
      const fx = from.x + (r0.x - sub[0]) / (sub[1] - sub[0]) * from.w, fw = r0.w / (sub[1] - sub[0]) * from.w;
      const r = X.lrect({ x: fx, y: from.y, w: fw, h: from.h }, r0, cu), classic = i < 2;
      ctx.fillStyle = classic ? F.lin(ctx, 0, r.y, 0, r.y + r.h, [[0, PAPER.lit], [1, PAPER.body]]) : mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 8); ctx.fill();
      if (cu < 1) { ctx.fillStyle = rgba(classic ? GOLD.body : mixHex(P.night0, P.ind0, .55), 1 - cu); ctx.fill(); }   // the halves' colours turn into the chapters'
      ctx.strokeStyle = classic ? rgba(PAPER.edge, .9) : rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.stroke();
      if (cu > .7) {
        const lu = span(cu, .7, 1);
        X.serif(ctx, RN[i], r.x + 22, r.y + 52, 40, lu, { align: 'left', col: classic ? PAPER.ink : CREAM });
        const [a0, b0, L] = CH[i], tu = span(t, a.later - .3, a.later + .4);
        for (let p = a0; p <= b0; p++) {
          const isAI = L.includes(p), x = tickX(i, p), lit = isAI ? span(t, cascade(i, p) - .05, cascade(i, p) + .25) : 0;
          const lifted = (p === 98 && lift98(t) > 0) || (p === 107 && lift107(t) > 0);
          if (lifted) continue;
          ctx.fillStyle = isAI && lit > 0 ? mixHex(classic ? PAPER.shade : P.blue1, GOLD.body, lit) : rgba(classic ? PAPER.shade : P.blue1, .9 * tu);
          const hh = 96 * expoOut(tu); ctx.fillRect(x - 1.6, r.y + r.h - 22 - hh, 3.2, hh);
        }
        const n = L.length, tot = b0 - a0 + 1, cnt = span(t, a.passages - .2, a.passages + .4);
        X.caps(ctx, `${n} OF ${tot}`, r.x + r.w / 2, r.y + r.h + 40, cnt, { size: 22, col: CREAM });
      }
    });
    // I–II: classic Church teaching (brace above), chapter two's title, the legend
    const bu = span(t, a.classic - .3, a.classic + .4);
    if (bu > 0) { const x0 = chRects[0].x, x1 = chRects[1].x + chRects[1].w; F.goldSpan(ctx, [[x0, CY - 18], [x0, CY - 32], [x1, CY - 32], [x1, CY - 18]], 0, smooth(bu), { w: 1.6, spark: false }); X.caps(ctx, 'MOSTLY CLASSIC CHURCH TEACHING', (x0 + x1) / 2, CY - 50, bu, { size: 24, col: CREAM }); }
    X.caps(ctx, 'CHAPTER TWO: “FOUNDATIONS AND PRINCIPLES OF THE SOCIAL DOCTRINE OF THE CHURCH”', chRects[0].x, CY + CHH + 92, span(t, a.classic, a.classic + .6) * (1 - span(t, a.later - .4, a.later)), { size: 22, align: 'left' });
    const lg = span(t, a.later + .1, a.later + .7);
    if (lg > 0) { ctx.fillStyle = GOLD.body; ctx.fillRect(CX0, CY + CHH + 74, 4, 22 * expoOut(lg)); X.caps(ctx, 'EACH TICK = ONE PARAGRAPH · GOLD = IT NAMES AI OR ALGORITHMS (OUR COUNT OF THE TEXT)', CX0 + 16, CY + CHH + 92, lg, { size: 22, align: 'left' }); }
    ctx.restore();
  };
  const drawBarPhase = (ctx, t) => {   // the post → one bar → two halves (+ HALF TRUE)
    const m = quartIO(span(t, bar0, bar1)), sp = sineIO(span(t, spl0, spl1));
    if (t < chs0) {
      const r = X.lrect(PC, BAR, m);
      if (sp <= 0) { ctx.fillStyle = mixHex(mixHex(P.night0, P.ind0, .55), GOLD.mid, span(m, .6, 1) * .0); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, lerp(22, 10, m)); ctx.fill(); ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.stroke(); }
      else for (let i = 0; i < 2; i++) {
        const h = HALVES[i], rr = X.lrect({ x: BAR.x + i * BAR.w / 2, y: BAR.y, w: BAR.w / 2, h: BAR.h }, h, sp);
        ctx.fillStyle = i === 0 ? mixHex(mixHex(P.night0, P.ind0, .55), GOLD.body, sp) : mixHex(P.night0, P.ind0, .55); ctx.beginPath(); ctx.roundRect(rr.x, rr.y, rr.w, rr.h, 10); ctx.fill();
        ctx.strokeStyle = i === 0 ? rgba(GOLD.line, .9) : rgba(CREAM, .7); ctx.lineWidth = 2; if (i === 1) { ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 12; } ctx.stroke(); ctx.setLineDash([]);
      }
    } else drawChapters(ctx, t);
    const hu = X.inout(t, a.half - .1, a.half + .5, a.first - .4, a.first + .1);
    if (hu > 0) F.goldText(ctx, [['HALF ', 1], ['TRUE', 0]], W / 2, 400, 104, hu, { serif: true, glow: true, align: 'center' });
  };
  // ---------------------------------------------------------------- 8.06–8.08 · the two cards lift out of chapter III
  const h98 = cardH(Q98, 40, C98.w, { head: 1, para: 1, credit: 1 }), h107 = cardH(Q107, 40, C107.w, { head: 1, para: 1, credit: 1 });
  const liftCard = (ctx, t, p, C, h, u, words, extra) => {
    if (u <= 0) return;
    const ci = 2, x = tickX(ci, p), from = { x: x - 2, y: CY + CHH - 118, w: 4, h: 96 }, r = X.lrect(from, { x: C.x, y: C.y, w: C.w, h }, u);
    const full = { x: C.x, y: C.y, w: C.w, h };
    const drawC = (c) => card(c, t, C, { size: 40, u: 1, wu: span(u, .55, 1), words, head: 'MAGNIFICA HUMANITAS · 25 MAY 2026', para: p === 98 ? '§98' : '§107', credit: 'Chapter three' });
    if (u < 1) { X.mapRect(ctx, full, r, drawC); const g = 1 - span(u, .15, .8); if (g > 0) { ctx.fillStyle = rgba(GOLD.body, g); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 6); ctx.fill(); } return; }
    const box = drawC(ctx);
    extra?.(box);
  };
  const drawTwoCards = (ctx, t, mu = 0) => { if (mu > 0) return; card98(ctx, t); card107(ctx, t); };
  const card98 = (ctx, t) => liftCard(ctx, t, 98, C98, h98, lift98(t), W_(Q98).map((w) => ({ w, g: /cultivated|built/.test(w) ? span(t, a.grown + .3, a.grown + .8) : 0 })), (b) => X.plant(ctx, t, C98.x + C98.w - 80, C98.y + h98 - 34, 70, span(t, a.grown + .2, a.grown + 1.4)));
  const card107 = (ctx, t) => liftCard(ctx, t, 107, C107, h107, lift107(t), W_(Q107).map((w) => ({ w, g: /determined|few/.test(w) ? span(t, a.morals - .2, a.morals + .3) : 0 })), (b) => dials(ctx, t, C107.x + C107.w - 170, C107.y + h107 - 44, 18, span(t, a.morals - .3, a.morals + .3)));
  // ---------------------------------------------------------------- 8.09–8.10 · the magazine page
  const magPage = (ctx, t, r, o = {}) => {
    ctx.save(); ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(r.x + 8, r.y + 12, r.w, r.h); ctx.fillStyle = F.lin(ctx, r.x, r.y, r.x + r.w, r.y + r.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(r.x, r.y, r.w, r.h); ctx.restore();
    if (o.content === false) return;
    X.mapRect(ctx, MAG, r, (c) => magContent(c, t));
  };
  const magContent = (ctx, t) => {   // writes while the two cards are still folding into the page
    const x0 = MAG.x + 70, u = span(t, a.reviewer - .05, a.headline + .2);
    F.maskLine(ctx, [['THE NEW ATLANTIS', 0]], x0, MAG.y + 76, 30, rise(u), { serif: false, weight: 700, col: PAPER.ink, glow: false });
    F.maskLine(ctx, [['27 MAY 2026 · YUVAL LEVIN', 0]], MAG.x + MAG.w - 70, MAG.y + 76, 22, rise(span(u, .2, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false, align: 'right' });
    ctx.fillStyle = rgba(PAPER.ink, .8); ctx.fillRect(x0, MAG.y + 100, (MAG.w - 140) * expoOut(u), 3);
    F.maskLine(ctx, [['Idols of the Valley:', 0]], x0, MAG.y + 230, 92, rise(span(t, a.headline - .2, a.headline + .5)), { serif: true, col: PAPER.ink, glow: false });
    const l2 = 'Pope Leo’s ', s2 = 66, hy = MAG.y + 330, hu = rise(span(t, a.headline, a.headline + .6));
    F.maskLine(ctx, [['Pope Leo’s Wise But Frustrating', 0]], x0, hy, s2, hu, { serif: true, col: PAPER.ink, glow: false });
    F.maskLine(ctx, [['First Missive on AI', 0]], x0, hy + 80, s2, rise(span(t, a.headline + .1, a.headline + .7)), { serif: true, col: PAPER.ink, glow: false });
    const wx = x0 + F.measure(l2, s2, true), ww = F.measure('Wise', s2, true), fx = x0 + F.measure(l2 + 'Wise But ', s2, true), fw = F.measure('Frustrating', s2, true);
    const wu = span(t, a.wise - .1, a.wise + .35), fu = span(t, a.frus - .1, a.frus + .45);
    if (wu > 0) F.goldSpan(ctx, [[wx, hy + 14], [wx + ww, hy + 14]], 0, smooth(wu), { w: 5, spark: wu < 1 });
    if (fu > 0) { ctx.save(); ctx.strokeStyle = mixHex(PAPER.ink, P.blue1, .3); ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); const n = 28; for (let i = 0; i <= n * fu; i++) { const q = i / n, px = fx + q * fw, py = hy + 16 + Math.sin(q * 30) * 5; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); }
    // body columns
    ctx.fillStyle = rgba(PAPER.faint, .45); for (let c = 0; c < 3; c++) for (let l = 0; l < 7; l++) { const w2 = (MAG.w - 140 - 60) / 3; ctx.fillRect(x0 + c * (w2 + 30), MAG.y + 500 + l * 24, w2 * (l === 6 ? .5 : 1) * expoOut(span(u, .3 + c * .1, 1)), 7); }
  };
  // ---------------------------------------------------------------- 8.11–8.12 · the poll sheet
  const turn0 = a.week - .4, turn1 = a.week + .45;
  const pollWords = W_(QPOLL), pollTimes = X.spokenTimes(T, pollWords.map((w) => ({ w })), 'These machines do not feel', 'responsibility mean', a.that - .2);
  const sheet = (ctx, t, o = {}) => {
    const r = MAG; ctx.save(); ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(r.x + 8, r.y + 12, r.w, r.h); ctx.fillStyle = F.lin(ctx, r.x, r.y, r.x + r.w, r.y + r.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(r.x, r.y, r.w, r.h); ctx.restore();
    const x0 = MAG.x + 70, so = o.sink ?? 0;
    F.maskLine(ctx, [['ECONOMIST/YOUGOV POLL · U.S. ADULTS · 29 MAY–1 JUNE 2026', 0]], x0, MAG.y + 76, 24, rise(span(t, a.week, a.week + .6)) * (1 - so), { serif: false, weight: 700, col: PAPER.ink, glow: false });
    F.maskLine(ctx, [['ONE SENTENCE FROM THE LETTER, SLIGHTLY SHORTENED (FROM §99)', 0]], x0, MAG.y + 122, 22, rise(span(t, a.short - .2, a.short + .4)) * (1 - so), { serif: false, weight: 600, col: PAPER.faint, glow: false });
    const lines = X.layout(pollWords.map((w, i) => { const tt = pollTimes[i]; return { w, g: tt == null ? 0 : span(t, tt - .05, tt + .25) }; }), 52, MAG.w - 140);
    const su = span(t, a.week + .15, a.week + 1.05);   // the sentence writes as the sheet lands
    let k = 0; lines.forEach((ln, li) => { let xx = x0; const yy = MAG.y + 230 + li * 66; for (const wd of ln) { const lit = wd.g; F.maskLine(ctx, [[wd.w, 0]], xx, yy, 52, rise(span(su, li * .1, .6 + li * .1)) * (1 - sineIO(so)), { serif: true, col: mixHex(mixHex(PAPER.faint, PAPER.ink, .55 + .45 * lit), GOLD.deep, lit * .8), glow: false }); xx += wd.mw + 52 * .26; k++; } });
    // the answer boxes
    const bu = span(t, a.resp - .4, a.resp + .3) * (1 - so);
    ['AGREE', 'NOT SURE', 'DISAGREE'].forEach((lb, i) => { const bx = x0 + i * 330, by = MAG.y + MAG.h - 120; if (bu <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(bu * 2); ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 2.5; ctx.strokeRect(bx, by - 30, 36, 36); ctx.restore(); F.maskLine(ctx, [[lb, 0]], bx + 54, by, 26, rise(bu), { serif: false, weight: 700, col: PAPER.ink, glow: false });
      if (i === 0) { const ck = span(t, a.e83 - .25, a.e83 + .1); if (ck > 0) { ctx.save(); ctx.strokeStyle = GOLD.deep; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx + 6, by - 12); ctx.lineTo(bx + 15, by - 2); if (ck > .4) ctx.lineTo(bx + 15 + 20 * span(ck, .4, 1), by - 2 - 30 * span(ck, .4, 1)); ctx.stroke(); ctx.restore(); } } });
  };
  // ---------------------------------------------------------------- 8.13–8.15 · the chart, A POLL PROVES NOTHING, the pairs
  const ch0 = a.e83 + .05, ch1 = a.e83 + 1.0;   // the sheet becomes bar 1
  const back = (t) => sineIO(span(t, a.poll - .15, a.poll + .55)) * (1 - sineIO(span(t, a.but - .3, a.but + .2)));
  const pairsU = (t) => span(t, a.but - .35, a.but + .55);
  const drawChart = (ctx, t) => {
    const m = quartIO(span(t, ch0, ch1)), bk = back(t), pu = pairsU(t), gone = expoIn(span(t, a.but - .3, a.but + .3));
    ctx.save(); ctx.translate(W / 2, 200); ctx.scale(1 - .16 * bk, 1 - .16 * bk); ctx.translate(-W / 2, -200);
    // legend + title
    const tu = span(t, ch1 - .3, ch1 + .3) * (1 - gone);
    X.caps(ctx, 'AGREE WITH THE SENTENCE, % OF U.S. ADULTS', BX0, 214, tu, { size: 24, align: 'left', col: CREAM });
    if (tu > 0) { ctx.save(); ctx.globalAlpha *= tu; ctx.fillStyle = GOLD.body; ctx.fillRect(1210, 196, 18, 18); ctx.fillStyle = rgba(CREAM, .55); ctx.fillRect(1440, 196, 18, 18); ctx.restore(); X.caps(ctx, 'THE LETTER', 1238, 214, tu, { size: 22, align: 'left', col: CREAM }); X.caps(ctx, 'OTHERS', 1468, 214, tu, { size: 22, align: 'left', col: CREAM }); }
    ctx.fillStyle = rgba(P.halo2, .35 * (1 - gone)); ctx.fillRect(BX0 - 2, RY0 - 50, 2, RDY * 5);
    ROWS.forEach(([lab, v, pope], i) => {
      const r = barRect(i), grow = i === 0 ? 1 : expoOut(span(t, a.agreed - .1 + i * .12, a.agreed + .55 + i * .12));
      if (i === 0 && m < 1) return;   // bar 1 is drawn by the morph until it lands
      if (pope && (i === 0 ? p1u(t) : p2u(t)) > 0) return;     // the gold bars become the Pope's cards
      const yo = (pope ? 0 : gone * 700);
      ctx.save(); ctx.translate(0, yo);
      if (grow > 0) { ctx.fillStyle = pope ? GOLD.body : rgba(CREAM, .55); ctx.beginPath(); ctx.roundRect(r.x, r.y, Math.max(4, r.w * grow), r.h, [0, 4, 4, 0]); ctx.fill(); }
      X.caps(ctx, lab, BX0, r.y - 12, span(t, a.agreed - .2 + i * .12, a.agreed + .4 + i * .12) * (i === 0 ? 1 : 1), { size: 22, align: 'left', col: CREAM });
      if (grow > .2) F.maskLine(ctx, [[`${v} %`, 0]], r.x + r.w * grow + 18, r.y + 34, 40, rise(span(grow, .2, 1)), { serif: true, col: pope ? GOLD.text : CREAM, glow: false });
      ctx.restore();
    });
    ctx.restore();
    if (bk > 0) X.serif(ctx, 'A POLL PROVES NOTHING', W / 2, 850, 64, X.inout(t, a.poll - .1, a.poll + .45, a.but - .3, a.but + .1), { col: CREAM });
    F.source(ctx, t, a.agreed, a.poll - .2, 'ECONOMIST/YOUGOV, 29 MAY–1 JUNE 2026 · U.S. ADULTS · SENTENCES SHOWN AS PRINTED IN THE POLL');
  };
  const sheetToBar = (ctx, t) => {   // the sheet (paper) collapses into bar 1 (gold)
    const m = sineIO(span(t, ch0, ch1)), r = X.lrect(MAG, barRect(0), m);
    X.mapRect(ctx, MAG, r, (c) => sheet(c, t, { sink: span(t, ch0 - .1, ch0 + .4) }));
    const g = span(m, .2, .85); if (g > 0) { ctx.fillStyle = rgba(GOLD.body, g); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, lerp(0, 4, m)); ctx.fill(); }
  };
  const hP1 = cardH(Q98, 36, P1.w, { head: 1, para: 1, credit: 1 }), hP2 = cardH(Q107, 36, P2.w, { head: 1, para: 1, credit: 1 });
  const hO1 = cardH(QOL1, 36, O1.w, { head: 1, credit: 1 }), hO2 = cardH(QOL2, 36, O2.w, { head: 1, credit: 1 });
  const p1u = (t) => sineIO(span(t, a.but - .3, a.but + .5)), p2u = (t) => sineIO(span(t, a.steers - .4, a.steers + .4));
  const eqU = (i) => (t) => span(t, a.builders - .2 + i * .3, a.builders + .3 + i * .3), oU = (i) => (t) => sineIO(span(t, a.builders + .1 + i * .3, a.builders + .9 + i * .3));
  const colU = (t) => sineIO(span(t, a.rome - .35, a.rome + .3));
  const pairs = (ctx, t) => {
    const cl = colU(t); if (cl >= 1) return;
    const rows = [[P1, hP1, barRect(0), p1u(t), Q98, '§98', 'cultivated|built', O1, hO1, oU(0)(t), QOL1, eqU(0)(t), 'grown'], [P2, hP2, barRect(2), p2u(t), Q107, '§107', 'few', O2, hO2, oU(1)(t), QOL2, eqU(1)(t), 'handful|wealthy']];
    const ROMEB = { x: 300, y: 470, w: 360, h: 90 }, SVB = { x: 1180, y: 470, w: 520, h: 90 };
    rows.forEach(([Pc, hp, from, u, q, para, hi, Oc, ho, ou, qo, eu, ohi], i) => {
      if (u <= 0) return;
      const tgt = { x: Pc.x, y: Pc.y, w: Pc.w, h: hp }, r0 = X.lrect(from, tgt, u), r = X.lrect(r0, ROMEB, cl);
      if (u < .9 || cl > 0) { ctx.fillStyle = mixHex(GOLD.body, PAPER.lit, span(u, .2, .8)); ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 6); ctx.fill(); }
      else card(ctx, t, Pc, { size: 36, u: 1, wu: span(u, .9, 1), words: W_(q).map((w) => ({ w, g: new RegExp(hi).test(w) ? span(t, a.same - .2, a.same + .4) : 0 })), head: 'POPE LEO XIV · MAGNIFICA HUMANITAS', para, credit: '25 May 2026' });
      X.caps(ctx, i === 0 ? 'HOW THESE MACHINES ARE MADE' : 'WHO STEERS THEM', Pc.x, Pc.y - 22, span(u, .5, 1) * (1 - cl), { size: 22, align: 'left', col: GOLD.text });
      // the = and Olah's card growing out of it
      const ex = (Pc.x + Pc.w + Oc.x) / 2, ey = Pc.y + hp / 2;
      if (eu > 0 && cl < 1) { const eL = 30 * expoOut(eu); F.goldSpan(ctx, [[ex - eL, ey - 9], [ex + eL, ey - 9]], 0, 1, { w: 3.4, spark: false }); F.goldSpan(ctx, [[ex - eL, ey + 9], [ex + eL, ey + 9]], 0, 1, { w: 3.4, spark: false }); }
      if (ou > 0) {
        const or0 = X.lrect({ x: ex + 30, y: ey - 4, w: 8, h: 8 }, { x: Oc.x, y: Oc.y, w: Oc.w, h: ho }, ou), orr = X.lrect(or0, SVB, cl);
        if (ou < .9 || cl > 0) { ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(orr.x, orr.y, orr.w, orr.h, 12); ctx.fill(); ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 2; ctx.stroke(); }
        else card(ctx, t, Oc, { size: 36, u: 1, wu: span(ou, .9, 1), style: 'night', words: W_(qo).map((w) => ({ w, g: new RegExp(ohi).test(w) ? span(t, a.same - .2, a.same + .4) : 0 })), head: 'CHRIS OLAH · CO-FOUNDER, ANTHROPIC', credit: 'Vatican, 25 May 2026' });
      }
    });
  };
  // ---------------------------------------------------------------- 8.16 · ROME · VS · SILICON VALLEY → one bridge
  const KEY = [960, 452];
  const drawBridge = (ctx, t) => {
    const cl = colU(t), wu = span(t, a.rome - .05, a.rome + .45), brk = span(t, a.rome + .25, a.rome + .85), bu = span(t, a.rome + .55, a.sv + .45);
    // the two banks
    const gu = expoOut(span(t, a.rome + .1, a.rome + .8));
    if (gu > 0) for (const [x0, x1] of [[-40, 640], [1280, 1960]]) { ctx.fillStyle = F.lin(ctx, 0, 560, 0, 900, [[0, mixHex(P.ind1, P.blue1, .35)], [1, P.night0]]); ctx.fillRect(x0, 560 + (1 - gu) * 400, x1 - x0, 600); ctx.fillStyle = rgba(P.blue1, .6); ctx.fillRect(x0, 559 + (1 - gu) * 400, x1 - x0, 2); }
    X.serif(ctx, 'ROME', 330, 520, 88, cl > .8 ? wu : 0, { col: CREAM });
    X.serif(ctx, 'SILICON VALLEY', 1600, 520, 88, cl > .8 ? span(t, a.rome + .1, a.rome + .55) : 0, { col: CREAM });
    // VS, then it breaks in two and falls
    const vu = cl > .8 ? span(t, a.rome - .1, a.rome + .3) : 0;
    if (vu > 0 && brk < 1) {
      const e = expoIn(brk);
      for (const [s, dx, dy, rot] of [[-1, -60, 500, -.5], [1, 60, 520, .4]]) {
        ctx.save(); ctx.beginPath(); if (s < 0) { ctx.moveTo(0, 0); ctx.lineTo(968, 0); ctx.lineTo(952, 1080); ctx.lineTo(0, 1080); } else { ctx.moveTo(968, 0); ctx.lineTo(1920, 0); ctx.lineTo(1920, 1080); ctx.lineTo(952, 1080); } ctx.closePath(); ctx.clip();
        ctx.translate(960 + dx * e, 500 + dy * e); ctx.rotate(rot * e); ctx.translate(-960, -500);
        F.goldText(ctx, [['VS', .6]], 960, 520, 110, rise(vu), { serif: true, glow: false, align: 'center' });
        ctx.restore();
      }
    }
    // the bridge: a gold arch from bank to bank, a deck, people crossing both ways
    if (bu > 0) {
      const arch = [], deck = []; for (let i = 0; i <= 40; i++) { const q = i / 40, x = lerp(620, 1300, q); arch.push([x, 560 - Math.sin(Math.PI * q) * 108]); deck.push([x, 540]); }
      F.goldSpan(ctx, arch, 0, smooth(bu), { w: 4, spark: bu < 1 });
      F.goldSpan(ctx, deck, 0, smooth(span(bu, .2, 1)), { w: 2.4, spark: false });
      const pu = span(t, a.sv - .1, a.sv + .6);
      if (pu > 0) for (let k = 0; k < 4; k++) { const dir = k % 2 ? -1 : 1, x = 640 + (((t * 40 * dir + k * 170) % 660) + 660) % 660; F.person(ctx, x, 540, 56, { walk: x / 9, view: 'side', dir, light: 1 }); }
      X.caps(ctx, 'NOT A DUEL', W / 2, 360, span(t, a.sv + .1, a.sv + .7), { size: 26, col: CREAM });
    }
  };
  // ---------------------------------------------------------------- 8.17–8.18 · the kitchen, the letter opens
  const ki0 = a.rest - .35, ki1 = a.rest + .6;
  const LET = { x: 820, y: 700, w: 170, h: 26 };
  const kitCam = (t) => X.camKeys(t, [[ki1, 960, 540, 1], [a.letter - .3, 940, 560, 1.04], [a.letter + 1.2, 905, 650, 1.75], [a.tech - .3, 905, 655, 1.85]], .5);
  const letterOpen = (t) => sineIO(span(t, a.letter + .3, a.hopeful + .4));
  const drawLetter = (ctx, t) => {
    const op = letterOpen(t), cx = LET.x + LET.w / 2, y = LET.y;
    const lit = span(t, a.letter + .5, a.hopeful + .8);
    if (lit > 0) { F.halo(ctx, cx, y - 40, 260 * lit, .9 * lit, X.AMBER.glow, X.AMBER.core); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.lin(ctx, 0, y, 0, y - 260, [[0, rgba(X.AMBER.glow, .45 * lit)], [1, rgba(X.AMBER.glow, 0)]]); ctx.beginPath(); ctx.moveTo(cx - 80, y); ctx.lineTo(cx + 80, y); ctx.lineTo(cx + 170, y - 260); ctx.lineTo(cx - 170, y - 260); ctx.closePath(); ctx.fill(); ctx.restore(); }
    // the lower leaf lies; the upper leaf rotates open about the fold (seen from the front: it rises as a trapezoid)
    ctx.fillStyle = PAPER.body; ctx.beginPath(); ctx.moveTo(LET.x, y); ctx.lineTo(LET.x + LET.w, y); ctx.lineTo(LET.x + LET.w + 14, y + 16); ctx.lineTo(LET.x - 14, y + 16); ctx.closePath(); ctx.fill();
    const hy = lerp(-4, -96, op);
    ctx.fillStyle = mixHex(PAPER.lit, X.AMBER.glow, .3 * lit); ctx.beginPath(); ctx.moveTo(LET.x, y); ctx.lineTo(LET.x + LET.w, y); ctx.lineTo(LET.x + LET.w - 6 * op, y + hy); ctx.lineTo(LET.x + 6 * op, y + hy); ctx.closePath(); ctx.fill();
    if (op > .2) { ctx.fillStyle = rgba(PAPER.ink, .45 * span(op, .2, .7)); for (let l = 0; l < 5; l++) ctx.fillRect(LET.x + 22, y + hy + 16 + l * 14, (LET.w - 44) * (l === 4 ? .5 : 1), 3); }
  };
  const letterWin = (t) => { const [cx, cy, z] = kitCam(t), p = F.lookPt(cx, cy, z, LET.x + 8, LET.y - 92); return { x: p[0], y: p[1], w: (LET.w - 16) * z, h: 88 * z }; };
  const drawKitchen = (ctx, t) => {
    const [cx, cy, z] = kitCam(t);
    F.look(ctx, cx, cy, z, () => {
      F.kitchen(ctx, t, { lamp: 1, you: (c) => { const br = 1 + .006 * Math.sin(t * 2.1); c.save(); c.translate(520, 868); c.scale(1, br); c.translate(-520, -868); F.du(c, 520, 868, 440, { dir: 1, look: -.15 + .05 * Math.sin(t * .5) + .25 * span(t, a.letter + .3, a.hopeful), light: 1, back: .25, armR: [.75, 1.5], armL: [.6, 1.3] }); c.restore(); } });
      drawLetter(ctx, t);
    });
    X.caps(ctx, 'MAGNIFICA HUMANITAS', W / 2, 860, span(t, a.letter + .2, a.letter + .8) * (1 - span(t, a.tech - .7, a.tech - .3)), { size: 24, col: CREAM });
  };
  // ---------------------------------------------------------------- 8.19 · the workshop (through the letter's light)
  const ws0 = a.tech - .9, ws1 = a.tech + 2.1;
  const drawShop = (ctx, t) => {
    const z = 1 + .02 * span(t, ws1, a.end + 1);
    F.look(ctx, W / 2, H / 2, z, () => X.workshop(ctx, t, { leave: span(t, a.freeing - .3, a.shutting + 1.6) }));
    const qu = span(t, a.tech + .3, a.tech + 1.0);
    F.maskLine(ctx, [['“… technology will be oriented toward freeing up human time and capabilities,', 0]], W / 2, 96, 42, rise(qu), { serif: true, col: CREAM, glow: false, align: 'center' });
    F.maskLine(ctx, [['rather than producing exclusion.”', 0]], W / 2, 146, 42, rise(span(qu, .15, 1)), { serif: true, col: CREAM, glow: false, align: 'center' });
    X.caps(ctx, 'MAGNIFICA HUMANITAS · §156', W / 2, 188, span(qu, .4, 1), { size: 22 });
  };

  // ---------------------------------------------------------------- one frame
  const night = (ctx, t, g = .65) => F.night(ctx, t, { glow: [W / 2, 560, 1000, g] });
  return (ctx, t) => {
    if (t < unf0) { prev(ctx, t); drawQmark(ctx, t); return; }
    if (t < bar0) {
      if (t < a.night + 3) prev(ctx, t); else night(ctx, t);
      drawPost(ctx, t, pcR(t));
      if (t < unf1) { const r = pcR(t); avatar(ctx, t, r.x + Math.min(70, r.w / 2), r.y + Math.min(74, r.h / 2), AVR); } else avatar(ctx, t, AV[0], AV[1], AVR);
      F.source(ctx, t, a.wrote + .2, a.half - .5, 'THE SAME DAY: ITIF, “AI IS NOT ANOTHER TOWER OF BABEL”, 25 MAY 2026');
      return;
    }
    night(ctx, t);
    if (t < a.reviewer - .5) { drawBarPhase(ctx, t); if (t > a.grown - .5) drawTwoCards(ctx, t); return; }
    if (t < turn0) {   // the chapters sink, the two cards fold into the magazine page
      drawChapters(ctx, t);
      const m = magU(t);
      if (m < 1) { const r1 = X.lrect({ x: C98.x, y: C98.y, w: C98.w, h: h98 }, MAG, m), r2 = X.lrect({ x: C107.x, y: C107.y, w: C107.w, h: h107 }, MAG, m); if (m <= 0) drawTwoCards(ctx, t); else { magPage(ctx, t, r1, { content: false }); magPage(ctx, t, r2, { content: false });
        const cf = 1 - span(m, 0, .4); if (cf > 0) { ctx.save(); ctx.globalAlpha *= cf; X.mapRect(ctx, { x: C98.x, y: C98.y, w: C98.w, h: h98 }, r1, (c) => card98(c, t)); X.mapRect(ctx, { x: C107.x, y: C107.y, w: C107.w, h: h107 }, r2, (c) => card107(c, t)); ctx.restore(); }
        const bx = Math.min(r1.x, r2.x), by = Math.min(r1.y, r2.y), bb = { x: bx, y: by, w: Math.max(r1.x + r1.w, r2.x + r2.w) - bx, h: Math.max(r1.y + r1.h, r2.y + r2.h) - by }; if (span(m, .3, 1) > 0) X.mapRect(ctx, MAG, bb, (c) => magContent(c, t)); } }
      else magPage(ctx, t, MAG);
      return;
    }
    if (t < turn1) { X.pageTurn(ctx, MAG, span(t, turn0, turn1), (c) => magPage(c, t, MAG), (c) => sheet(c, t)); return; }
    if (t < ch0) { sheet(ctx, t); return; }
    if (t < ch1) { sheetToBar(ctx, t); drawChart(ctx, t); return; }
    if (t < a.rome - .35) { drawChart(ctx, t); pairs(ctx, t); return; }
    if (t < ki0) { pairs(ctx, t); drawBridge(ctx, t); return; }
    if (t < ki1) {   // iris out of the bridge's keystone: the kitchen opens round the lamp
      drawBridge(ctx, t); const e = quartIO(span(t, ki0, ki1)), c = X.lpt(KEY, F.KITCHEN.lamp, e);
      X.irisDot(ctx, c[0], c[1], lerp(6, 2300, e), (cc) => drawKitchen(cc, t), { rim: rgba(P.core1, .75 * (1 - e)) });
      return;
    }
    if (t < ws0) {
      drawKitchen(ctx, t);
      const sv = sineIO(span(t, ws0 - 1.1, ws0));
      if (sv > 0) { const wn = letterWin(t), kb0 = Math.max(wn.w / W, wn.h / H); ctx.save(); ctx.beginPath(); ctx.rect(wn.x, wn.y, wn.w, wn.h); ctx.clip(); ctx.globalAlpha *= sv; ctx.translate(wn.x + wn.w / 2, wn.y + wn.h / 2); ctx.scale(kb0, kb0); ctx.translate(-W / 2, -H / 2); drawShop(ctx, t); ctx.restore(); }
      return;
    }
    if (t < ws1) { const win = letterWin(ws0); F.portal(ctx, span(t, ws0, ws1), win, (c) => drawKitchen(c, ws0 + (t - ws0) * .3), (c) => drawShop(c, t), { ease: (q) => .5 * q + .5 * sineIO(q) }); return; }
    drawShop(ctx, t);
  };
}
