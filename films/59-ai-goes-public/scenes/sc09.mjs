// c09 · Orders ≈ 6× · AI stocks fell · "the most ridiculous IPO of 2026" · a price is a forecast, not a verdict.  (builder B3)
// ALSO: the B3 stage. B3 (c09–c12, 'Reports say there are' → end) is ONE continuous take: this file owns the anchors, the camera path,
// the world state (you, the shard, the jar, the bell, the room, the city's windows) and the composition; sc10/sc11/sc12 own their
// chunk's explainer layers (overlays10/11/12) and import nothing from here (their default exports load b3() lazily), so every inner
// chunk boundary is the same draw function = a seamless frame pair. Plan: docs/shots.md 8.01–E.01 · world: docs/MOTION.md.
//
// | ID   | anchor (phrase)            | picture (one idea)                                                                   | camera / layer          |
// |------|----------------------------|--------------------------------------------------------------------------------------|-------------------------|
// | 8.01 | Reports say there are      | out of plateSort: the trays part to the sides; a cool line draws, 1 stack of SHARES and 6 stacks of ORDERS rise; ≈ 6× · APPETITE, NOT WORTH | plate creep → slow push · EXPL |
// | 8.02 | And early this month       | the stacks sink into the line; the line dips hard ("fell hard"); the quote card grows out of the low point | creep · EXPL |
// | 8.03 | Who is right               | the card shrinks into the "$ ?" tag under the crystal; veil down; A PRICE IS A FORECAST, / NOT A VERDICT.; the tag soars, sinks | glide to CRY_CAM · MIX |
// carriers: plateSort trays → (part) → the line → the quote card (grows from the dip) → the price tag (the card shrinks into it) → c10 (descent to you)
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
import { overlays10 } from './sc10.mjs';
import { overlays11 } from './sc11.mjs';
import { overlays12 } from './sc12.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, mixHex } = E;
const { rise, GOLD, PAPER, COOL, F0, maskLine } = F;

export const PRINT = F.PRINT59;

// ------------------------------------------------------------------------------------------------ anchors (phrases only)
export function anchors(T) {
  const G = (p, after = -1) => T.G(p, 0, after), GE = (p, after = -1) => T.GE(p, 0, after), a = {};
  // c09
  a.T0 = G('Reports say there are'); a.six = G('six times', a.T0); a.orders = G('orders', a.T0); a.shares = G('shares', a.orders);
  a.appetite = G('appetite', a.T0); a.notworth = G('not worth', a.T0);
  a.early = G('And early this month'); a.fell = G('fell hard', a.early); a.firm = G('One research firm'); a.calls = G('calls this sale', a.firm);
  a.quote = G('quote', a.calls); a.yearE = GE('of the year', a.firm);
  a.who = G('Who is right'); a.cant = G("This film can't", a.who); a.price = G('a price is a forecast', a.who); a.verdict = G('not a verdict', a.who);
  a.first = G("The first day's", a.who); a.soars = G('soars', a.first); a.sinks = G('sinks', a.first);
  // c10
  a.c10 = G("And one thing doesn't depend"); a.piece1 = G('A piece may reach you', a.c10); a.funds = G("Many funds don't", a.c10);
  a.copy = G('They copy a list', a.funds); a.index = G('an index', a.copy);
  a.bell = G('When the bell rings'); a.rings = G('rings', a.bell); a.clock = G('a second clock', a.bell); a.rule = G('Under a rule', a.bell);
  a.join = G('can join its main list', a.bell); a.fifteen = G('fifteen trading days', a.bell);
  a.other = G('Other big lists'); a.notall = G('Not all', a.other); a.snp = G('the S and P', a.other); a.wait = G('wait at least a year', a.other);
  a.pension = G('Say your pension'); a.fastlists = G('one of the fast lists', a.pension); a.slice = G('a small slice', a.pension);
  a.land = G('land in it', a.pension); a.weeks = G('within weeks', a.pension); a.without = G('Without you pressing', a.pension);
  a.senator = G('A United States senator'); a.letter = G('in a letter', a.senator); a.retire = G('retirement money', a.senator);
  a.that = G('that may have', a.retire); a.whatever = G('whatever the price', a.retire);
  a.buy = G("So buy, or don't"); a.find = G('A piece may find you', a.buy); a.nosay = G('And it comes without a say', a.buy);
  // c11
  a.c11 = G('But look at who else'); a.amazon = G('Even Amazon and Google', a.c11); a.google = G('Google', a.amazon); a.novote = G('with no vote at all', a.c11);
  a.built = G('As this company is built today'); a.nfs = G('not for sale', a.built); a.anyprice = G('At any price', a.built);
  a.hopeful = G("That's the hopeful part", a.built); a.hard = G('The hard part', a.built); a.eleven = G('eleven people', a.hard);
  a.seven = G('Seven founders', a.hard); a.four = G('Four trustees', a.seven); a.same = G('The same dinner table', a.seven);
  a.board = G('But the board they choose'); a.legal = G('legal form', a.board); a.three = G('weigh three things', a.board);
  a.money = G("The shareholders' money", a.board); a.purpose = G("The company's stated purpose", a.board); a.everyone = G('everyone materially affected', a.board);
  // c12
  a.c12 = G('Now recall the warning'); a.risks = G('Risks to humanity', a.c12); a.whois = G('Who is materially affected by that', a.c12);
  a.youare = G('You are', a.whois); a.withshare = G('With a share', a.youare);
  a.buyp = G('You can buy a piece', a.youare); a.say2 = G("You can't buy a say", a.buyp); a.sayW = G('say', a.say2 + .3); a.never = G('But you never needed', a.buyp);
  a.stake = G('a stake', a.never);
  a.voice = G('And a stake has a voice'); a.hers = G('A senator used hers', a.voice); a.his = G("A city's pension watchdog", a.voice);
  a.record = G('a public record', a.voice); a.yours = G('when you use yours', a.voice);
  a.sprice = G('A share has a price'); a.snever = G('A stake never did', a.sprice);
  a.chan = G('This channel exists', a.c12); a.everybody = G('for everybody', a.chan); a.billions = G('the billions', a.chan);
  a.subscribe = G('Then subscribe', a.chan); a.subE = GE('Then subscribe', a.chan);
  a.end = T.duration; a.es = T.duration - 15;            // the 15 s end screen (picture and music continue, no voice)
  a.tYou = a.who + 4.6;                                    // you (and the jar) join the world once the rooftop is out of frame (CRY view)
  a.tLand = a.land + .15;                                  // the slice lands in the jar
  return a;
}

// ------------------------------------------------------------------------------------------------ views (design px of a card → screen)
export const V = {
  sort: (k = 1) => S.SORT_CAM(k, S.trk(k) * .2),
  cry: (k = 1) => S.CRY_CAM(k),
  roof: (s = 1.5) => E.aim(F0, 1500, 850, s),                                   // you + the jar
  jar: (s = 2) => E.aim(F0, 1530, 880, s),                                      // the jar close, you at its left
  bell: (s = 1) => E.aim(S.Z_BELL, S.BELL.x, S.BELL.y + 260, 1.1 * s),
  wide: (s = .5, du = 0, dv = 0) => E.aim(S.Z_CITY, 300 + du, 600 + dv, s),   // the tower window left, the crystal, you small on the ledge
  wheel: (s = 5) => E.aim(S.Z_CITY, S.WIN.x + 150, S.WIN.y + 64, s),           // the wheel behind its glass, the window fills the frame
  win: (k = 1) => S.WIN_CAM(k),
  you: (s = 1) => E.aim(F0, S.YOU.x + 40, S.YOU.y - 120, s, 1180, 640),       // you on the ledge, the crystal above
  end: (k = 1) => (k === 1 ? S.END_CAM : E.aim(S.Z_CRY, S.CRY.x, S.CRY.y, .8 * k, 960, 290)),
};
const GAPD = [1497, 551];   // the crystal's gap (crystal card design px), where tags and threads are tied

// ------------------------------------------------------------------------------------------------ the shared tag with per-line light
// a paper tag on a gold thread (like F.priceTag) whose extra lines unfold one by one: lines [[text, u]] (u 0..1 per line)
export function tagLines(ctx, t, x, y, lines, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 30, len = (o.len ?? 120) * expoOut(u);
  const tw = Math.max(...lines.map(([l]) => F.measure(l, size, false, 600) + size * l.length * .1)), w = tw + size * 2.1;
  const nl = lines.reduce((m, [, lu], i) => (i ? m + expoOut(clamp(lu)) : m + 1), 0), h = size * (1.25 + nl * 1.25);
  const sw = (o.swing ?? 0) + (1 - expoOut(u)) * .6 * Math.cos(u * 9) + .03 * Math.sin(t * 1.1 + x * .01);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw);
  F.goldSpan(ctx, [[0, 0], [0, len]], 0, 1, { w: o.w ?? 1.4, spark: false });
  ctx.translate(0, len); ctx.globalAlpha *= clamp(u * 4);
  const p = new Path2D(); p.moveTo(-w / 2, size * .55); p.lineTo(-size * .45, 0); p.lineTo(size * .45, 0); p.lineTo(w / 2, size * .55); p.lineTo(w / 2, h); p.lineTo(-w / 2, h); p.closePath();
  ctx.fillStyle = E.lin(ctx, 0, 0, 0, h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fill(p);
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.5; ctx.stroke(p);
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(0, size * .42, size * .13, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, 0, w, h); ctx.clip();
  lines.forEach(([l, lu], i) => { const k = i ? rise(clamp(lu)) : rise(span(u, .3, 1)); if (k <= 0) return;
    E.glowText(ctx, l, 0, size * (1.55 + i * 1.25) + size * .3 + (1 - k) * size * .6, { size: size * (i ? .85 : 1), weight: 600, align: 'center', spacing: .1, col: i ? GOLD.deep : PAPER.ink, glow: false, a: k }); });
  ctx.restore(); ctx.restore();
  return { x, y: y + len, w, h };
}

// ------------------------------------------------------------------------------------------------ c09 explainers
const BASE = { y: 690, x0: 380, x1: 1540 };
const SHARE = { x: 470, w: 140, h: 300 };
const ORD = { x: 800, step: 120, w: 96 };
const QC = { x: 380, y: 196, w: 1160, size: 64 };
function overlays09(T, a) {
  const tA = a.T0 + S.SEAM_HALF;
  const part = (t) => sineIO(span(t, tA, tA + 2.0));                                     // the trays part to the sides (2 s)
  const lineU = (t) => sineIO(span(t, tA + 1.0, tA + 2.4));                               // the cool line draws from the middle out
  const sink = (t) => sineIO(span(t, a.early - .15, a.early + .85));                      // the stacks sink back into the line
  const wav = (t) => sineIO(span(t, a.early + .45, a.early + 1.9));                       // the line comes alive (a ticker)
  const dip = (t) => expoOut(span(t, a.fell - .08, a.fell + .75));                        // "fell hard"
  const grow = (t) => sineIO(span(t, a.calls - .1, a.calls + 1.7));                       // the quote card grows out of the low point
  const toTag = (t) => sineIO(span(t, a.who - .1, a.who + 1.75));                          // … and shrinks into the price tag
  const retract = (t) => sineIO(span(t, a.who - .1, a.who + 1.3));                        // the line pulls into its low point
  const veil = (t) => (t < a.who - .2 ? .72 : .72 * (1 - sineIO(span(t, a.who - .2, a.who + 2.0))));
  const lineY = (f, t) => {                                                                // f 0..1 along the line
    const w = wav(t), d = dip(t);
    return BASE.y - w * (26 * Math.sin(f * 9 + t * .35) * .5 + 24 * Math.sin(f * 23 + 1.3) * .25 + 70 * f) + d * 200 * smooth(span(f, .58, 1));
  };
  const LOW = (t) => [BASE.x1, lineY(1, t)];
  function trays(ctx, t) {
    const o = part(t); if (o >= 1) return;
    for (const [sd, c0, c1, anc] of [[-1, 0, 960, 230], [1, 960, W, 1690]]) {
      ctx.save(); F.float(ctx, t, 1);
      const sc = lerp(1, .7, o); ctx.translate(anc + sd * 780 * o, 530 + 50 * o); ctx.scale(sc, sc); ctx.translate(-anc, -530);
      ctx.beginPath(); ctx.rect(c0, -200, c1 - c0, H + 400); ctx.clip();
      S.sortTrays(ctx, t, 1);
      ctx.restore();
    }
  }
  function stack(ctx, x, w, h, u, col, edge, n) {               // paper slips rising from the line (a mask wipe up)
    const hh = h * sineIO(u); if (hh <= .5) return;
    ctx.save(); ctx.beginPath(); ctx.rect(x - 10, BASE.y - hh, w + 20, hh); ctx.clip();
    const sh = h / n;
    for (let k = 0; k < n; k++) { const y = BASE.y - (k + 1) * sh, jit = Math.sin(k * 2.7 + x) * 3;
      ctx.fillStyle = k % 2 ? col : mixHex(col, P.cream, .12); ctx.fillRect(x + jit, y + 2, w, sh - 4);
      ctx.fillStyle = rgba(edge, .55); ctx.fillRect(x + jit, y + 2, w, 1.5); }
    ctx.restore();
  }
  function stacks(ctx, t) {
    const sk = sink(t); if (sk >= 1 || t < tA) return;
    const ln = lineU(t);
    ctx.save(); F.float(ctx, t, 1);
    // the line (draws from the middle out; later the ticker)
    if (ln > 0) {
      const m = (BASE.x0 + BASE.x1) / 2, hw = (BASE.x1 - BASE.x0) / 2 * ln;
      ctx.strokeStyle = rgba(COOL.line, .85); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(m - hw, BASE.y); ctx.lineTo(m + hw, BASE.y); ctx.stroke();
    }
    const k1 = 1 - sk;
    stack(ctx, SHARE.x, SHARE.w, SHARE.h * k1, span(t, a.six + .2, a.six + .95), mixHex(GOLD.body, PAPER.lit, .25), GOLD.deep, 14);
    for (let i = 0; i < 6; i++) stack(ctx, ORD.x + i * ORD.step, ORD.w, SHARE.h * k1, span(t, a.orders - .3 + i * .08, a.orders + .45 + i * .08), mixHex(COOL.body, P.night1, .25), P.night0, 14);
    const lu = rise(span(t, a.orders + .2, a.orders + .9)) * (1 - sk);
    maskLine(ctx, [['SHARES', 0]], SHARE.x + SHARE.w / 2, BASE.y + 44, 24, rise(span(t, a.six + .5, a.six + 1.2)) * (1 - sk), { serif: false, weight: 600, col: GOLD.text, glow: false, align: 'center' });
    maskLine(ctx, [['ORDERS', 0]], ORD.x + 2.5 * ORD.step + ORD.w / 2, BASE.y + 44, 24, lu, { serif: false, weight: 600, col: COOL.text, glow: false, align: 'center' });
    // the vo-v3 card line and the number
    maskLine(ctx, [['ORDERS FOR ABOUT 6× THE SHARES ON OFFER', 0]], W / 2, 246, 28, rise(span(t, a.orders + .5, a.orders + 1.2)) * (1 - sk), { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
    F.goldText(ctx, [['≈ 6×', 1]], ORD.x + 2.5 * ORD.step + ORD.w / 2, BASE.y - SHARE.h - 22, 84, rise(span(t, a.shares - .05, a.shares + .6)) * (1 - sk), { serif: true, align: 'center' });
    F.goldText(ctx, [['APPETITE,', 1], [' NOT WORTH', 0]], W / 2, 812, 50, rise(span(t, a.appetite - .1, a.appetite + .6)) * (1 - sk), { serif: true, align: 'center' });
    ctx.restore();
  }
  function line(ctx, t) {
    if (t < a.early - .2) return;
    const r0 = retract(t); if (r0 >= 1) return;
    ctx.save(); F.float(ctx, t, 1);
    const pts = []; for (let i = 0; i <= 60; i++) { const f = i / 60; pts.push([lerp(BASE.x0, BASE.x1, f), lineY(f, t)]); }
    const n0 = Math.floor(r0 * 60), sub = pts.slice(n0);
    ctx.strokeStyle = rgba(COOL.line, .9); ctx.lineWidth = 3.2; ctx.lineJoin = 'round'; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
    const [lx, ly] = LOW(t), d = dip(t);
    if (d > 0) { ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(lx, ly, 6 + 3 * d, 0, Math.PI * 2); ctx.fill(); halo(ctx, lx, ly, 50, .25 * d, COOL.halo, COOL.core); }
    ctx.restore();
  }
  let QH = 200;
  function quote(ctx, t, g) {
    const gu = grow(t); if (gu <= 0) return;
    const tt = toTag(t); if (tt >= 1) return;
    const [lx, ly] = LOW(t), full = { x: QC.x, y: QC.y, w: QC.w, h: QH };
    const from = { x: lx - 30, y: ly - 18, w: 60, h: 36 }, to = g.tagBox ?? { x: 1500, y: 700, w: 120, h: 80 };
    let r = { x: lerp(from.x, full.x, gu), y: lerp(from.y, full.y, gu), w: lerp(from.w, full.w, gu), h: lerp(from.h, full.h, gu) };
    if (tt > 0) r = { x: lerp(full.x, to.x, tt), y: lerp(full.y, to.y, tt), w: lerp(full.w, to.w, tt), h: lerp(full.h, to.h, tt) };
    const k = r.w / QC.w, ky = r.h / QH;
    ctx.save(); F.float(ctx, t, 1); ctx.globalAlpha *= 1 - span(tt, .82, 1);
    ctx.translate(r.x, r.y); ctx.scale(k, ky); ctx.translate(-QC.x, -QC.y);
    const box = F.quoteCard(ctx, t, T, { text: '“the most ridiculous IPO of 2026”', mode: 'hi', x: QC.x, y: QC.y, w: QC.w, size: QC.size,
      credit: F.SOURCES.ridiculous, spoken: ['the most', 'year'], after: a.firm, u: span(gu, .4, 1), rot: -.004 });
    if (box) QH = box.h;
    ctx.restore();
  }
  // A PRICE IS A FORECAST, / NOT A VERDICT.  (left of the crystal)
  function verdict(ctx, t) {
    const out = sineIO(span(t, a.c10 - .4, a.c10 + .6));
    const u1 = rise(span(t, a.price - .05, a.price + .7)) * (1 - out), u2 = rise(span(t, a.verdict - .05, a.verdict + .7)) * (1 - out);
    if (u1 <= 0) return;
    ctx.save(); F.float(ctx, t, .6);
    F.goldText(ctx, [['A price is a ', 0], ['forecast,', 1]], 120, 560, 58, u1, { serif: true });
    F.goldText(ctx, [['not a verdict.', 0]], 120, 632, 58, u2, { serif: true });
    ctx.restore();
  }
  // the "$ ?" tag under the crystal (crystal card): it drops while the card shrinks into it; soars, sinks; goes when we go down to you
  const tagU = (t) => span(t, a.who + 1.15, a.who + 2.1) * (1 - span(t, a.c10 + .2, a.c10 + 1.3));
  const tagLen = (t) => 120 - 70 * sineIO(span(t, a.soars - .1, a.soars + .45)) + 130 * sineIO(span(t, a.sinks - .1, a.sinks + .5)) - 60 * sineIO(span(t, a.sinks + 1.1, a.sinks + 2.6));
  function tag(ctx, t, r) {
    const u = tagU(t); if (u <= 0) return;
    F.priceTag(ctx, t, r.x + r.r * .48, r.y + r.r * .9, '$ ?', u, { len: tagLen(t), size: 34, swing: .05 * Math.sin(t * .7) });
  }
  // the tag's screen box (where the card goes), from the camera (the crystal card)
  function tagBox(c, t) {
    const br = 315 * (1 + .012 * Math.sin(t * .8)), x = S.CRY.x + br * .48, y = S.CRY.y + br * .9 + 120, w = F.measure('$ ?', 34, false, 600) + 34 * .3 + 34 * 2.1, h = 34 * 2.5;
    const p0 = E.project(c, S.Z_CRY, x - w / 2, y), p1 = E.project(c, S.Z_CRY, x + w / 2, y + h);
    return p0 && p1 ? { x: p0[0], y: p0[1], w: p1[0] - p0[0], h: p1[1] - p0[1] } : null;
  }
  function over(ctx, t, g) {
    trays(ctx, t); stacks(ctx, t); line(ctx, t); quote(ctx, t, g); verdict(ctx, t);
    F.source(ctx, t, a.T0 + .8, a.early - .1, F.SOURCES.orders);
  }
  return { veil, over, tag, tagBox };
}

// ------------------------------------------------------------------------------------------------ the stage (all of B3)
let MEMO = null;
export function b3(T) { if (MEMO?.T === T) return MEMO.draw; const draw = build(T); MEMO = { T, draw }; return draw; }
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b3(T), print: PRINT }]; };

function build(T) {
  E.prepareEditorial();
  const a = anchors(T), tA = a.T0 + S.SEAM_HALF;
  const L = [overlays09(T, a), overlays10(T, a, { tagLines }), overlays11(T, a, { tagLines }), overlays12(T, a, { tagLines, GAPD })];
  const [o09, o10, o11, o12] = L;
  // ---------------------------------------------------------------- the camera (one take, keys on phrases)
  const creepCam = (t) => { const k = 1 + S.CREEP * (t - (a.T0 - S.SEAM_HALF)); return V.sort(k); };
  const K = [
    [tA, creepCam(tA)], [a.early, V.sort(1.1)], [a.who + 1.4, V.sort(1.14)],                       // 8.01–8.02: the plate's push slows to a creep
    [a.who + 4.3, V.cry(1)], [a.c10 - .3, V.cry(1.06)],                                               // 8.03: glide to the crystal and its tag
    [a.c10 + 2.5, V.roof(1.5)], [a.funds + .5, V.roof(1.58)],                                         // 9.01: down to you and the jar
    [a.bell - .45, V.bell(1)], [a.clock + .5, V.bell(1.04)], [a.other + .6, V.bell(1.1)],             // 9.02–9.03: behind the veil to the bell
    [a.pension - .45, V.jar(2)], [a.senator, V.jar(2.12)], [a.buy + .2, V.jar(2.18)],                  // 9.04–9.06: behind the veil back to the jar
    [a.buy + 3.6, V.wide(.5)], [a.c11 + .3, V.wide(.52, -150)], [a.built - .3, V.wide(.54, -260)],              // 9.07–10.01: wide: you, the jar, the far window
    [a.nfs + .35, V.wheel(5)], [a.hard - .15, V.wheel(5.25)],                                          // 10.02: into the window, the wheel
    [a.hard + 2.3, V.win(1.04)], [a.same - .1, V.win(1.09)], [a.board + .5, V.win(1.24)],              // 10.03–10.04: the room, the table ★
    [a.c12 - .6, V.cry(.95)], [a.whois - .2, V.cry(1)],                                               // 10.05–11.01: behind the veil to the crystal
    [a.youare - .1, V.wide(.5)], [a.withshare + .4, V.you(.95)], [a.buyp + .2, V.you(1)],                                 // 11.01–11.02: pull back over the city; to you
    [a.sayW + .3, V.wide(.5, 40)], [a.stake + 1.5, V.wide(.49, 20)], [a.chan + .5, V.wide(.5, 30)],   // 11.03–11.05: the stake
    [a.subE + .9, V.end()], [a.end, V.end(1.012)],                                                    // A.01–E.01: settle into END_CAM
  ];
  const drift = (t) => (t < a.es ? 1 : .55) * smooth(span(t, tA, tA + 2));
  const cam = (t) => {
    let c = F.camPath(t, K);
    if (t < tA + 3) { const w = sineIO(span(t, tA, tA + 3)), p = creepCam(t); c = E.cam3({ x: lerp(p.x, c.x, w), y: lerp(p.y, c.y, w), z: lerp(p.z, c.z, w), f: c.f }); }
    const s = F.REF / (F.REF - c.z);
    return E.camDrift(c, t, 6 / Math.max(.4, s) * drift(t), 5);   // wide shots drift more: far layers barely move otherwise
  };
  // ---------------------------------------------------------------- you, the shard, the jar, the bell, the room, the city
  const pose = (t) => {
    const up = sineIO(span(t, a.snever - .1, a.snever + 1.8));                                     // ★ you hold the shard up to the crystal
    const look = lerp(.5 + .08 * Math.sin(t * .31), .85, sineIO(span(t, a.youare - .3, a.youare + 1)));
    return { armR: [lerp(1.05, 2.72, up), lerp(2.25, 2.95, up)], armL: [-.18 - .03 * Math.sin(t * .4), -.12], look: lerp(look, .9, up) };
  };
  const bellSt = (t) => {
    const tr = a.rings, pre = sineIO(span(t, tr - .55, tr - .02)), hit = t >= tr ? t - tr : -1;
    let sw = .015 * Math.sin(t * .5) - .13 * pre * (hit < 0 ? 1 : 0);
    if (hit >= 0) sw += -.13 * Math.exp(-hit * 6) + .2 * Math.exp(-hit * .55) * Math.sin(hit * 3.1 + .35);
    return { swing: sw, ring: hit >= 0 ? clamp(hit / 3.2) : 0, clapper: hit >= 0 ? -.25 * Math.exp(-hit * 1.5) * Math.cos(hit * 4) : .08 * pre };
  };
  const city = (t) => Math.max(.28 * sineIO(span(t, a.whois - .2, a.whois + 2.2)) + .2 * sineIO(span(t, a.stake, a.stake + 2.5)), sineIO(span(t, a.snever - .2, a.snever + 2.4)));
  const glow = (t) => 1 + .22 * Math.sin(Math.PI * span(t, a.snever - .2, a.snever + 3.5)) + .1 * sineIO(span(t, a.snever, a.chan)) + .12 * Math.sin(Math.PI * span(t, a.subscribe - .2, a.subscribe + 2.2));
  let HAND = [S.YOU.x + 60, S.YOU.y - 110], TAGB = null;
  const shardAt = () => [HAND[0] + 4, HAND[1] - 24];
  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t < tA) { S.plateSort(ctx, t, T); return; }
    const c = cam(t), youOn = t >= a.tYou;
    const st = {
      crystal: { gap: 1, glow: glow(t) },
      you: youOn ? { o: pose(t) } : false,
      jar: youOn ? { fill: .42, slice: t >= a.tLand ? 1 : 0 } : undefined,
      bell: bellSt(t), city: city(t),
      room: { lit: 1, seated: 1, wheel: { a: 1, glass: 1 }, count: { f: span(t, a.seven - .1, a.seven + .75), tr: span(t, a.four - .1, a.four + .55) } },
      tag: (cx, r) => { o09.tag(cx, t, r); o12.tag?.(cx, t, r); },
      back: (cx) => o12.back?.(cx, t, c),
      extra: (cx, hands) => {
        if (hands?.R) HAND = hands.R;
        if (!youOn) return;
        const [sx, sy] = shardAt();
        F.shard(cx, t, sx, sy, 64, { rot: -.12 + .04 * Math.sin(t * .7), glow: .55 + .25 * Math.sin(Math.PI * span(t, a.withshare - .1, a.withshare + 1.4)) + .5 * span(t, a.snever, a.snever + 2) });
        o12.extra?.(cx, t, c, [sx, sy]);
      },
    };
    S.cityWorld(ctx, c, t, st);
    // geometry for the explainers (screen px)
    const sh = shardAt(), g = { c, hand: E.project(c, F0, sh[0], sh[1]), jar: E.project(c, F0, S.JAR.x, S.JAR.y), win: S.winRect(c), gap: E.project(c, S.Z_CRY, ...GAPD),
      wheel: E.project(c, S.Z_CITY, S.WIN.x + S.WIN.w * .5, S.WIN.y + S.WIN.h * .27), tagBox: o09.tagBox(c, t) };
    F.veil(ctx, Math.max(...L.map((o) => o.veil(t))));
    for (const o of L) o.over(ctx, t, g);
    F.board(ctx, t, T, { big: o10.big(t) });
  };
}
