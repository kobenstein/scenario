// c04 · Share → vote → wheel (the ? of c03 becomes the answer: a vote) · buy enough and you steer · not here: a pane in front of the wheel ·
// the vote bar 49.9 | 50.1, seven seats light · the Meta card (text only) · the trust: four seats with no shares appoint most of the board ·
// ★ the seats fly into the tower window: THE ROOM, 7 + 4 at the dinner table · the wheel flies out of the window into the sky: thumbnail C
// (you hold the shard up; the wheel big over the city): A CLAIM ON THE MONEY · NOT A HAND ON THE WHEEL.
// T.G('With most companies') → T.G('Why build a company') · builder B1. Part of the one B1 take (hub: scenes/sc02.mjs).
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                             | camera / layer | carrier → next |
// |-------|---------------------------------|--------------------------------------------------------------------------------|----------------|----------------|
// | 3.01  | With most companies             | the ? glides to the middle; a flow: the shard → (a vote: the ? turns into a tick) → the wheel; BUY A SHARE · GET A VOTE | creep · EXPL | the shards |
// | 3.02  | Buy enough                      | shards pile up on the left; the wheel turns toward them: STEER                  | creep · MIX    | the wheel      |
// | 3.03  | Not here                        | a glass pane slides in front of the wheel; STEER is struck                       | creep · MIX    | the pane       |
// | 3.04  | The shares on sale do carry     | the pile pours into the vote bar: CLASS A fills cool to its dashed cap, MAX 49.9 %; the wheel behind glass sits at the gold end | creep · EXPL | the right half |
// | 3.05  | Just over half stays            | FOUNDERS (CLASS F) FIXED 50.1 %; a row of 7 + 4 seats rises, the seven light gold | creep · EXPL  | the seats      |
// | 3.055 | Founders keeping control        | a night text card slides up out of the bar: FOUNDER CONTROL IS COMMON · META: ZUCKERBERG ≈ 61 % OF VOTES (APRIL 2026) · NEW AT ANTHROPIC: A TRUST WITH NO SHARES (gold); three trustee seats light | creep · EXPL | the trustee seats |
// | 3.06  | And the board                   | the bar sinks; the trustee seats glide left (THE TRUST, 1 seat open); the board's seats rise right; gold threads to a majority; card LONG-TERM BENEFIT TRUST · 4 TRUSTEES (1 SEAT OPEN) · CAN "ELECT AND REMOVE A MAJORITY" OF THE BOARD; tag BEN BERNANKE | glide · EXPL | the seats |
// | 3.07★ | Seven founders                  | the seats fly into the tower window, the veil lifts, the camera pushes into THE ROOM: 7 founders light gold, 4 trustees cream | push in · SCENE | the wheel |
// | 3.08  | So your share would be a claim  | THUMBNAIL C: the wheel flies out of the window and grows over the city; pull back: you hold the shard up · A CLAIM ON THE MONEY · NOT A HAND ON THE WHEEL | pull back · MIX | the wheel |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f59_kit.mjs';
import * as S from '../lib/f59_world.mjs';
import { b1, PRINT, CC, CW, CF, line, gline, panel, chair, rectMix } from './sc02.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, mixHex } = E;
const { rise, GOLD, PAPER, COOL, LAMP } = F;

export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: b1(T), print: PRINT }]; };

export const BAR = { x: 360, y: 430, w: 1200 };
const FLOW = { y: 470, shard: 560, tick: 960, wheel: 1360 };
const ROW = { x: 667, y: 780, s: 40 };                                           // the 7 + 4 seats under the bar
const rowX = (i) => ROW.x + i * ROW.s * 1.25 + (i >= 7 ? ROW.s * .9 : 0);
const TRUST = { x: 380, y: 600, s: 64, dx: 88 }, BOARD = { x: 1090, y: 600, s: 64, dx: 98, n: 5 };
export const WHEEL_C = { x: 1390, y: 420, r: 250 };                            // thumbnail C: the wheel in the sky (screen)
export function part04(T) {
  const A0 = T.G('With most companies'), G = (p) => T.G(p, 0, A0 - .2), GE = (p) => T.GE(p, 0, A0 - .2);
  const a = {
    managed: T.G('Managed by whom'), answer: G("you'd know the answer"), owners: G('The owners'), buy: G('Buy a share'), vote: G('get a vote'),
    enough: G('Buy enough'), steer: G('you steer'), not: G('Not here'), shares: G('The shares on sale'), carry: G('carry votes'), caps: G('caps them'),
    old: G('Old and new together'), just: G('Just over half stays'), seven: G('seven people'), founders: G('the founders.'), enough2: G('Enough, the document'),
    meta: G('Founders keeping control'), atmeta: G('At Meta'), whatsnew: G("What's new is"), who: G('who else gets a seat'), board: G('And the board'),
    most: G('Most of its seats'), trust: G('by a trust'), four: G('four people who'), single: G('a single share'), ben: G('Ben Bernanke'), bank: GE("America's central bank"),
    sev: G('Seven founders'), fourT: G('Four trustees'), table: G('That is the dinner table'), dinner: G('dinner table'),
    so: G('So your share would be'), claim: G('a claim on the money'), hand: G('a hand on the wheel'), next: T.G('Why build a company'),
  };
  const ROOM_CAM = (s, dv = 0) => CW(S.WIN.x + S.WIN.w / 2, S.WIN.y + S.WIN.h / 2 + 6 + dv, s);
  const C_CAM = CF(1395, 880, .8, 380, 900);
  const keys = [
    [a.just, CC(2000, 380, .8, 960, 480)], [a.meta + 4, CC(900, 420, .76, 960, 500)], [a.board + 5, CW(-480, 520, .9, 900, 540)],
    [a.sev - .5, ROOM_CAM(1.25)], [a.table + .8, ROOM_CAM(2.7, 4)], [a.so + .2, ROOM_CAM(2.8, 4)],
    [a.so + 2.6, C_CAM], [a.next + .3, CF(1395, 880, .82, 390, 900)],
  ];
  // ---------------------------------------------------------------- the ? (rises on "Managed by whom?", glides to the middle, becomes a tick)
  const qRise = (t) => span(t, a.managed - .05, a.managed + .7), qGo = (t) => sineIO(span(t, A0 - .1, A0 + 1.9)), tickU = (t) => span(t, a.vote - .1, a.vote + .5);
  function question(ctx, t) {
    const r = qRise(t); if (r <= 0) return;
    const g = qGo(t), x = lerp(1660, FLOW.tick, g), y = lerp(760, FLOW.y + 50, g), size = lerp(220, 150, g), tk = tickU(t);
    const out = span(t, a.shares - .2, a.shares + .4);
    ctx.save(); F.float(ctx, t, 1);
    if (tk < 1) {   // the ? sinks behind its baseline while the tick draws
      ctx.save(); ctx.beginPath(); ctx.rect(x - size, y - size * 1.1, size * 2, size * 1.24); ctx.clip(); ctx.translate(0, expoIn(tk) * size * 1.2);
      gline(ctx, '?', x, y, size, r, { align: 'center' }); ctx.restore();
    }
    if (tk > 0 && out < 1) {
      const q = expoOut(tk), s = 46, x0 = x - s, y0 = FLOW.y + 4;
      ctx.save(); ctx.translate(0, out * 60); ctx.globalAlpha *= 1 - out; ctx.strokeStyle = GOLD.body; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + s * .8 * Math.min(1, q * 2), y0 + s * .8 * Math.min(1, q * 2)); if (q > .5) ctx.lineTo(x0 + s * .8 + s * 1.5 * (q - .5) * 2, y0 + s * .8 - s * 1.7 * (q - .5) * 2); ctx.stroke();
      halo(ctx, x, FLOW.y, 120, .2 * q, GOLD.halo, GOLD.core); ctx.restore();
    }
    ctx.restore();
  }
  // ---------------------------------------------------------------- the flow: shard → vote → wheel; buy enough (a pile) → steer; not here (glass)
  const shardU = (t) => span(t, a.buy - .15, a.buy + .6), wheelU = (t) => span(t, a.vote + .3, a.vote + 1.1);
  const toBar = (t) => sineIO(span(t, a.shares - .1, a.shares + 1.8));
  const flowOut = (t) => span(t, a.shares - .2, a.shares + .5);
  const PILE = [[0, 0], [-46, 22], [44, 24], [-22, 44], [24, 48], [-60, 56], [62, 60], [0, 70]];
  const pileT = (i) => (i ? a.enough + .1 + (i - 1) * .14 : a.buy - .15);
  const spin = (t) => -.7 * expoOut(span(t, a.steer - .1, a.steer + .9));
  const glass = (t) => span(t, a.not - .15, a.not + .7);
  // the wheel's place: flow → beside the gold end of the bar → (3.06) it goes with the bar
  const wheelPos = (t) => { const m = toBar(t); return { x: lerp(FLOW.wheel, BAR.x + BAR.w + 78, m), y: lerp(FLOW.y, BAR.y + 32, m), r: lerp(80, 40, m) }; };
  const barOut = (t) => sineIO(span(t, a.board - .2, a.board + 1.8));
  function flow(ctx, t) {
    if (shardU(t) <= 0) return;
    const bo = barOut(t); if (bo >= 1) return;
    ctx.save(); F.float(ctx, t, 1); ctx.translate(0, bo * 760);
    const fo = flowOut(t), m = toBar(t);
    // header + labels (sink when the bar comes)
    line(ctx, 'THE OWNERS', W / 2, 300, 30, span(t, a.owners - .1, a.owners + .6) * (1 - fo), { align: 'center', col: P.halo2 });
    line(ctx, 'BUY A SHARE', FLOW.shard, 620, 30, span(t, a.buy, a.buy + .7) * (1 - fo), { align: 'center' });
    line(ctx, 'GET A VOTE', FLOW.tick, 620, 30, span(t, a.vote, a.vote + .7) * (1 - fo), { align: 'center' });
    // arrows (gold threads)
    if (fo < 1) {
      F.goldSpan(ctx, [[FLOW.shard + 80, FLOW.y], [FLOW.tick - 90, FLOW.y]], 0, span(t, a.vote - .4, a.vote + .1) * (1 - fo), { w: 2 });
      F.goldSpan(ctx, [[FLOW.tick + 80, FLOW.y], [FLOW.wheel - 120, FLOW.y]], 0, span(t, a.vote + .2, a.vote + .7) * (1 - fo), { w: 2 });
    }
    // the pile: shards drop in; on the bar they pour into CLASS A
    PILE.forEach(([dx, dy], i) => {
      const u = span(t, pileT(i), pileT(i) + .45); if (u <= 0) return;
      const land = expoOut(u), x0 = FLOW.shard + dx * .9, y0 = FLOW.y - 10 + dy * .7 - (i ? (1 - land) * 260 : 0);
      const tx = BAR.x + 40 + (i / 7) * (BAR.w * .499 - 80), ty = BAR.y + 32, k = clamp((m - i * .06) / .5);
      if (k >= 1) return;
      const x = lerp(x0, tx, sineIO(k)), y = lerp(y0, ty, sineIO(k)) - 90 * Math.sin(Math.PI * sineIO(k));
      F.shard(ctx, t, x, y, (i ? 54 : 110 * rise(shardU(t)) - 50 * (1 - span(t, a.enough - .2, a.enough + .4)) * 0) * (1 - .7 * sineIO(k)) * (i ? 1 : lerp(1, .5, span(t, a.enough - .3, a.enough + .3))), { rot: -.1 + i * .37, glow: .6 });
    });
    // STEER (struck on "Not here")
    const su = span(t, a.steer - .1, a.steer + .6) * (1 - fo);
    if (su > 0) {
      const w = gline(ctx, 'STEER', FLOW.wheel, FLOW.y - 150, 44, su, { serif: false, weight: 600, spacing: .16, align: 'center' });
      const k = expoOut(span(t, a.not + .1, a.not + .5)); if (k > 0 && w) { ctx.strokeStyle = rgba(P.cream, .9 * su); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(FLOW.wheel - w.w / 2 - 12, FLOW.y - 165); ctx.lineTo(FLOW.wheel - w.w / 2 - 12 + (w.w + 24) * k, FLOW.y - 165); ctx.stroke(); }
    }
    ctx.restore();
  }
  function wheel(ctx, t) {
    const u = wheelU(t); if (u <= 0) return;
    const bo = barOut(t); if (bo >= 1) return;
    const p = wheelPos(t);
    ctx.save(); F.float(ctx, t, 1); ctx.translate(0, bo * 760);
    F.wheel(ctx, t, p.x, p.y, p.r * rise(u), { glass: glass(t), spin: spin(t), glow: .7 });
    ctx.restore();
  }
  // ---------------------------------------------------------------- the vote bar (3.04–3.05) and the seats row
  const barU = (t) => span(t, a.shares + .2, a.shares + 1.3);
  const fnd = (t) => span(t, a.just + .1, a.just + 1.1);
  const rowU = (t) => span(t, a.seven - .5, a.seven + .2);
  const fLit = (t) => span(t, a.seven, a.founders + .3), trLit = (t) => .75 * span(t, a.who - .1, a.who + 1.0);
  function bar(ctx, t) {
    const u = barU(t); if (u <= 0) return;
    const bo = barOut(t); if (bo >= 1) return;
    ctx.save(); F.float(ctx, t, 1); ctx.translate(0, bo * 760);
    F.voteBar(ctx, t, BAR.x, BAR.y, BAR.w, { u, pub: span(t, a.carry - .3, a.caps - .1), cap: span(t, a.caps, a.caps + .5), fnd: fnd(t),
      labels: span(t, a.old - .1, a.old + .8), fndLab: span(t, a.just + .1, a.just + .9) });
    ctx.restore();
    F.source(ctx, t, a.carry, a.meta - .3, F.SOURCES.votes);
  }
  // the seats (7 + 4): the row rises under the bar; on "And the board" the four trustee seats glide left into THE TRUST, the seven sink with the bar
  const toTrust = (t) => sineIO(span(t, a.board, a.board + 1.9));
  const fly = (t) => sineIO(span(t, a.sev - .5, a.sev + 1.5));    // ★ everything flies into the tower window
  function seatsRow(ctx, t) {
    const u = rowU(t); if (u <= 0) return;
    const bo = barOut(t), mt = toTrust(t), k = expoOut(u);
    ctx.save(); F.float(ctx, t, 1);
    for (let i = 0; i < 11; i++) {
      const fndr = i < 7;
      if (fndr) {
        if (bo >= 1) continue;
        ctx.save(); ctx.translate(0, bo * 760); ctx.beginPath(); ctx.rect(0, 0, W, ROW.y + 4); ctx.clip();
        chair(ctx, rowX(i), ROW.y + (1 - k) * ROW.s * 1.2, ROW.s, { lit: clamp(fLit(t) * 7 - i), col: GOLD.body }); ctx.restore();
      } else if (mt <= 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, ROW.y + 4); ctx.clip();
        chair(ctx, rowX(i), ROW.y + (1 - k) * ROW.s * 1.2, ROW.s, { lit: clamp(trLit(t) * 4 - (i - 7)), col: LAMP.body }); ctx.restore();
      }
    }
    ctx.restore();
  }
  // ---------------------------------------------------------------- the Meta card (text only: no logos, no faces)
  const MC = { x: 590, y: 130, w: 1000, h: 268 };
  const metaU = (t) => sineIO(span(t, a.meta - .2, a.meta + 1.4)) * (1 - sineIO(span(t, a.board - .4, a.board + 1.0)));
  function meta(ctx, t) {
    const u = metaU(t); if (u <= 0) return;
    ctx.save(); F.float(ctx, t, 1); ctx.beginPath(); ctx.rect(0, 0, W, BAR.y - 6); ctx.clip();
    ctx.translate(0, (1 - u) * (BAR.y - MC.y + 10));
    panel(ctx, MC);
    const x = MC.x + 44;
    line(ctx, 'FOUNDER CONTROL IS COMMON', x, MC.y + 62, 28, span(t, a.meta + .3, a.meta + 1.1), { col: GOLD.text });
    line(ctx, 'META: ZUCKERBERG ≈ 61 % OF VOTES (APRIL 2026)', x, MC.y + 140, 44, span(t, a.atmeta - .1, a.atmeta + .7), { serif: true, col: P.cream });
    gline(ctx, 'NEW AT ANTHROPIC: A TRUST WITH NO SHARES', x, MC.y + 222, 32, span(t, a.whatsnew - .1, a.whatsnew + .7), { serif: false, weight: 600, gold: .35 + .65 * span(t, a.who, a.who + .5) });
    ctx.restore();
    F.source(ctx, t, a.meta + .5, a.board - .2, F.SOURCES.meta);
  }
  // ---------------------------------------------------------------- the trust and the board (3.06)
  const trustPos = (k, t) => { const m = toTrust(t); return { x: lerp(rowX(7 + k), TRUST.x + k * TRUST.dx, m), y: lerp(ROW.y, TRUST.y, m), s: lerp(ROW.s, TRUST.s, m) }; };
  const boardU = (j, t) => span(t, a.board + .5 + j * .1, a.board + 1.2 + j * .1);
  const majority = (t) => span(t, a.most - .1, a.most + .7);
  const threads = (j, t) => span(t, a.trust + .1 + j * .2, a.trust + .9 + j * .2);
  const TC = { x: 590, y: 130, w: 1000, h: 236 };
  function trust(ctx, t, c) {
    const mt = toTrust(t); if (mt <= 0) return;
    const fl = fly(t); if (fl >= 1) return;
    const wr = S.winRect(c);
    ctx.save(); F.float(ctx, t, 1 - fl);
    if (fl > 0 && wr) {   // the whole group shrinks into the tower window (its seats become the busts at the table)
      const G0 = { x: 340, y: 300, w: 1240, h: 340 }, k = sineIO(fl), r = rectMix(G0, { x: wr.x + wr.w * .1, y: wr.y + wr.h * .45, w: wr.w * .8, h: wr.h * .3 }, k), s = r.w / G0.w;
      ctx.translate(r.x, r.y); ctx.scale(s, s); ctx.translate(-G0.x, -G0.y);
    }
    // the trust: three seats lit cream, one open; THE TRUST · NO SHARES
    for (let k = 0; k < 4; k++) { const p = trustPos(k, t); chair(ctx, p.x, p.y, p.s, { lit: k < 3 ? clamp(trLit(t) * 4 - k) : 0, col: LAMP.body, open: k === 3 && t > a.four + .2 }); }
    line(ctx, 'THE TRUST · NO SHARES', TRUST.x + TRUST.dx * 1.5 + TRUST.s / 2, TRUST.y + 50, 24, span(t, a.single - .3, a.single + .5) * (1 - fl), { align: 'center', col: LAMP.core });
    // the board's seats rise; a majority (3 of 5) light on "Most of its seats"
    for (let j = 0; j < BOARD.n; j++) {
      const u = boardU(j, t); if (u <= 0) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, BOARD.y + 4); ctx.clip();
      chair(ctx, BOARD.x + j * BOARD.dx, BOARD.y + (1 - expoOut(u)) * BOARD.s * 1.2, BOARD.s, { lit: j < 3 ? majority(t) : 0, col: P.cream });
      ctx.restore();
    }
    line(ctx, 'THE BOARD', BOARD.x + BOARD.dx * 2 + BOARD.s / 2, BOARD.y + 50, 24, span(t, a.board + 1, a.board + 1.7) * (1 - fl), { align: 'center', col: P.halo2 });
    line(ctx, 'CAN “ELECT AND REMOVE A MAJORITY” OF THE BOARD', W / 2, BOARD.y + 130, 26, span(t, a.most + .2, a.most + 1.0) * (1 - fl), { align: 'center', col: P.cream });
    // gold threads from the trust to the majority
    for (let j = 0; j < 3; j++) {
      const u = threads(j, t); if (u <= 0) continue;
      const x0 = TRUST.x + TRUST.dx * 1.5 + TRUST.s / 2, y0 = TRUST.y - TRUST.s - 6, x1 = BOARD.x + j * BOARD.dx + BOARD.s / 2, y1 = BOARD.y - BOARD.s - 6, pts = [];
      for (let q = 0; q <= 20; q++) { const f = q / 20; pts.push([lerp(x0, x1, f), lerp(y0, y1, f) - (110 + 30 * j) * Math.sin(Math.PI * f)]); }
      F.goldSpan(ctx, pts, 0, u, { w: 1.6 });
    }
    // Ben Bernanke: a name tag on one trustee seat (no likeness)
    const bu = span(t, a.ben - .1, a.ben + .8) * (1 - fl);
    if (bu > 0) F.goldLabel(ctx, TRUST.x + TRUST.s * .5, TRUST.y - TRUST.s - 4, 'BEN BERNANKE', 'FORMER FED CHAIR', bu, { dx: 26, dy: -110, size: 28 });
    ctx.restore();
    // the card (grows out of the trust's seats on "a trust"; leaves upward before the fly)
    const cu = sineIO(span(t, a.trust - .3, a.trust + 1.4)) * (1 - sineIO(span(t, a.sev - .9, a.sev + .5)));
    if (cu > 0) {
      const from = { x: TRUST.x, y: TRUST.y - TRUST.s, w: TRUST.dx * 3 + TRUST.s, h: TRUST.s };
      const r = rectMix(from, TC, cu), k = r.w / TC.w;
      ctx.save(); F.float(ctx, t, 1); ctx.translate(r.x, r.y); ctx.scale(k, r.h / TC.h); ctx.translate(-TC.x, -TC.y);
      panel(ctx, TC);
      const x = TC.x + 44;
      line(ctx, 'LONG-TERM BENEFIT TRUST', x, TC.y + 62, 28, span(t, a.trust + .5, a.trust + 1.3), { col: GOLD.text });
      gline(ctx, '4 TRUSTEES (1 SEAT OPEN)', x, TC.y + 162, 72, span(t, a.four - .1, a.four + .7));
      ctx.restore();
    }
    F.source(ctx, t, a.most, a.sev - .4, F.SOURCES.ltbt);
  }
  // ---------------------------------------------------------------- 3.08 thumbnail C: the wheel leaves the window and grows over the city
  const out = (t) => sineIO(span(t, a.so - .1, a.so + 2.3));
  const back = (t) => sineIO(span(t, a.next - .1, a.next + 2.2));   // c05: it shrinks back toward the tower (left), its home
  // the wheel stands in front of the crystal (centred on it, a little larger): the say between you and the AI; its dark lens hides the crystal
  let WC = { x: WHEEL_C.x, y: WHEEL_C.y, r: WHEEL_C.r };
  function skyWheel(ctx, t, c) {
    const f = out(t); if (f <= 0) return;
    const bk = back(t); if (bk >= 1) return;
    const wr = S.winRect(c), cr = S.crystalAt(c); if (!wr || !cr) return;
    WC = { x: cr[0], y: cr[1] + 30, r: cr[2] * .9 };
    const x0 = wr.x + wr.w * .5, y0 = wr.y + wr.h * .27, r0 = wr.h * .12;
    let x = lerp(x0, WC.x, f), y = lerp(y0, WC.y, f) - 40 * Math.sin(Math.PI * f), r = lerp(r0, WC.r, f);
    if (bk > 0) { x = lerp(WC.x, -300, bk); y = lerp(WC.y, 330, bk) - 80 * Math.sin(Math.PI * bk); r = lerp(WC.r, 30, bk); }
    const g = 1 - span(f, 0, .5);
    const ray = span(f, .6, 1) * (1 - span(bk, 0, .4));
    if (ray > 0) {   // light rays down over the city (thumbnail C)
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 5; k++) {
        const an = .25 + k * .14 + .02 * Math.sin(t * .3 + k), x1 = x + Math.cos(Math.PI / 2 + an - .5) * 1100, y1 = y + Math.sin(Math.PI / 2 + an - .5) * 1100;
        ctx.fillStyle = E.lin(ctx, x, y, x1, y1, [[0, rgba(GOLD.halo, .14 * ray)], [1, rgba(GOLD.halo, 0)]]);
        ctx.beginPath(); ctx.moveTo(x - r * .3, y); ctx.lineTo(x + r * .3, y); ctx.lineTo(x1 + 90, y1); ctx.lineTo(x1 - 90, y1); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    // the lens: a night disc inside the rim (it covers the crystal while the wheel is in front of it)
    const lens = span(f, .35, .9) * (1 - span(bk, 0, .35));
    if (lens > 0) { ctx.save(); ctx.fillStyle = E.rad(ctx, x, y - 30 * f, r * 1.16, [[0, rgba(mixHex(P.night1, GOLD.deep, .3), .94)], [.84, rgba(mixHex(P.night1, P.ind1, .5), .96)], [1, rgba(P.night1, 0)]]); ctx.beginPath(); ctx.arc(x, y - 30 * f, r * 1.16 * lens, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    F.wheel(ctx, t, x, y, r, { glass: g, glow: .8 + .4 * f, spin: .08 * (t - a.so) });
  }
  function labelsC(ctx, t, c, o) {
    const u1 = span(t, a.claim - .1, a.claim + .9) * (1 - span(t, a.next + .2, a.next + .9));
    if (u1 > 0 && o.hand?.R) { const p = E.project(c, F.F0, o.hand.R[0] + 4, o.hand.R[1] - 46); if (p) F.goldLabel(ctx, p[0] + 10, p[1] - 14, 'A CLAIM ON THE MONEY', null, u1, { dx: 40, dy: -120, size: 32 }); }
    const u2 = span(t, a.hand - .1, a.hand + .9) * (1 - span(t, a.next, a.next + .7));
    if (u2 > 0) F.goldLabel(ctx, WC.x + WC.r * .8, WC.y + WC.r * .8, 'NOT A HAND ON THE WHEEL', null, u2, { dx: 60, dy: 90, size: 32 });
  }
  // the veil (EXPL from the flow to the trust; lifts into the room)
  const veilA = (t) => .82 * (1 - smooth(span(t, a.sev - .4, a.sev + 1.6)));
  return {
    keys, a,
    world: (t, st) => {
      if (t < A0 - 1) return;
      // ★ the room: the seven light gold, the four trustees cream; the room's wheel leaves on "So your share" (it becomes the sky wheel)
      st.room = { lit: 1, seated: 1, wheel: { a: out(t) > 0 ? 0 : 1, glass: 1 }, count: { f: span(t, a.sev - .1, a.sev + 1.0), tr: span(t, a.fourT - .1, a.fourT + .8) } };
      // thumbnail C: you raise the shard; the crystal steps back (the wheel is the light now)
      const up = sineIO(span(t, a.so + .6, a.so + 1.9)) * (1 - sineIO(span(t, a.next + .4, a.next + 2.2)));
      if (up > 0) { st.you = { o: { armR: [lerp(1.05, 2.78, up), lerp(2.25, 2.98, up)], armL: [-.18, -.12], look: lerp(.3, .9, up) } }; st.shardGlow = .6 + .4 * up; }
      const dim = span(t, a.so + .4, a.so + 2.2) * (1 - span(t, a.next, a.next + 2));
      if (dim > 0) st.crystal = { gap: 1, glow: 1 - .65 * dim };
    },
    veil: (t) => (t > A0 - 1 ? veilA(t) : 0),
    over: (ctx, t, c, o) => { flow(ctx, t); wheel(ctx, t); question(ctx, t); bar(ctx, t); meta(ctx, t); seatsRow(ctx, t); trust(ctx, t, c); skyWheel(ctx, t, c); labelsC(ctx, t, c, o); },
  };
}
