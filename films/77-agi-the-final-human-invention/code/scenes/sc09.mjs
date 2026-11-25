// c09 · builder B2 · "Terence Tao is one" → "That's the fourth line" (line 3 and the condition). Rows: docs/shots.md 4.16–4.32 + C3.
// One entry, one draw function. Starts inside B.stacksAct (shared with c08: identical frame at the seam), ends on S.plateTuring.
//
// | ID   | anchor (phrase)            | motif                                                                                   | type  | carrier → next        |
// |------|----------------------------|-----------------------------------------------------------------------------------------|-------|-----------------------|
// | 4.16 | Terence Tao is one         | pan past the checkers: a mathematician (indigo) before a paper full of working; stacks  | SCENE | the stacks            |
// |      |                            | grow beside him                                                                         |       |                       |
// | 4.17 | He has watched all         | the stacks close in round him; a slot opens in the middle stack                         | MIX   | the slot              |
// | C3   | T.clip('C3')               | the plate grows out of the slot and returns into it (TERENCE TAO · FIELDS MEDALIST)      | CLIP  | the slot              |
// | 4.18 | Too many proofs            | tilt up: the sheets fly off the stacks into a funnel, it overflows · TOO MANY · NOT TOO FEW | EXPL | the spout            |
// | 4.19 | Tao calls it               | a card unfolds out of the spout: “proof indigestion” — TERENCE TAO · NATURE, WORLD VIEW  | EXPL  | the card              |
// | 4.20 | In September, he and       | the card shrinks into one medal; 24 more ripple out (5 × 5 unit chart); they sign one   | EXPL  | the letter            |
// |      |                            | letter · 25 FIELDS MEDALISTS · 11 SEPT 2026                                             |       |                       |
// | 4.21 | Not against A.I. itself    | a line of the letter lifts off: AI can “enhance and accelerate …” · NOT AGAINST A.I.    | EXPL  | the line → card       |
// | 4.22 | Their point                | it opens into the card “… severely misaligned” (gold) — MATHANDAI.ORG; two arrows part: | EXPL  | the arrows            |
// |      |                            | COMPANIES · MATHEMATICIANS                                                              |       |                       |
// | 4.23 | So the third line          | tilt up off the desk; the mini board grows out of its corner: DISCOVERY flaps BEGUN     | EXPL  | row 3                 |
// | 4.24 | It's moving faster         | sheets spill out of row 3 · MOVING FASTER THAN PEOPLE CAN FOLLOW                         | EXPL  | the sheets            |
// | 4.25 | And that raises            | they fall past the empty fourth row (it pulses) · Who decides what it works on?         | EXPL  | row 4                 |
// | 4.26 | Your list, or someone      | you hold your slip; beside you a long list unrolls from unseen hands · YOUR LIST ·      | MIX   | the lists → the band  |
// |      |                            | SOMEONE ELSE'S                                                                          |       |                       |
// | 4.27 | This is where the second   | the lists fly up into row 4; row 4 stretches into Good's band, its cover twitches       | EXPL  | the band              |
// | 4.28 | Here is all of it          | the band comes big, THE BOARD big behind it (anchor) · HERE IS ALL OF IT                 | EXPL  | the cover             |
// | 4.29 | "The first ultra-…"        | ★ ANCHOR: the cover falls on "provided", the second half lights · — I. J. GOOD, 1965, P. 33 | EXPL | the second half     |
// | 4.30 | There's the condition      | "provided that" underlined in cream · THE CONDITION                                     | EXPL  | the word docile       |
// | 4.31 | Docile: willing            | "docile" lifts out of the band and grows, the board and band sink · WILLING TO BE GUIDED | EXPL  | its underline         |
// | 4.32 | Years earlier              | the underline becomes the edge of Turing's card, it unfolds; a figure from the hut      | EXPL  | S.plateTuring         |
// |      |                            | beside it walks off; "take control" warms gold → plate                                  |       |                       |
import * as F from '../lib/f77_kit.mjs';
import * as S from '../lib/f77_seams.mjs';
import * as B from '../lib/b2_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, prng, halo, GOLD, CREAM, PAPER, COOL } = F;

export const PRINT = F.PRINT77;
export default async (T, R) => {
  const a = B.anchorsB2(T);
  return [{ t: R.a, draw: scene(a, T, R), print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ layout (world px, c08's world continues)
const FUN = { x: B.SLOT.x, top: 560, w: 640, neck: 900, nw: 70, spout: 1000 };
const QC = { x: FUN.x, y: 1150, w: 760, h: 230 };                          // the "proof indigestion" card
const MED = { x: 6350, y: 900, step: 120, r: 44 };                         // 5 × 5 medals
const LET = { x: 6830, y: 620, w: 440, h: 560 };                           // the letter
const SIGS = Array.from({ length: 25 }, (_, i) => [LET.x + 50 + (i % 5) * 76, LET.y + 392 + Math.floor(i / 5) * 30]);
const medXY = (i) => [MED.x + ((i % 5) - 2) * MED.step, MED.y + (Math.floor(i / 5) - 2) * MED.step];
const SHEETS = (() => { const r = prng(3690), s = []; for (let i = 0; i < 48; i++) s.push({ src: [B.STK.left + 110, B.SLOT.x, B.STK.right - 120][i % 3] + (r() - .5) * 160, sy: 1250 + r() * 120, tx: (r() - .5) * 2 * 240, rot: (r() - .5) * 2, side: r() < .5 ? -1 : 1, vx: 120 + r() * 220, d: r() }); return s; })();
const SPILL = (() => { const r = prng(390), s = []; for (let i = 0; i < 34; i++) s.push({ vx: 240 + r() * 520, vy: 120 + r() * 380, rot: (r() - .5) * 6, d: r(), x2: 560 + r() * 800 }); return s; })();
// Good's band in board space (unscaled geometry: S.BAND size; centre BAND_C), the words we underline / lift
const BAND_C = [W / 2, 450], BS = 40, BLH = 50;
function wrap(s, size, maxW) { const ws = s.split(' '), lines = []; let cur = ''; for (const wd of ws) { const nx = cur ? cur + ' ' + wd : wd; if (cur && F.measure(nx, size, true) > maxW) { lines.push(cur); cur = wd; } else cur = nx; } if (cur) lines.push(cur); return lines; }
const BACK = wrap(F.GOOD_BACK, BS, S.BAND.w / 2 - 88);
const backWord = (word) => {   // [x, y (baseline), w] of a word of the back half, band centred at BAND_C
  const x0 = BAND_C[0] - S.BAND.w / 2 + S.BAND.w / 2 + 44, y0 = BAND_C[1] - (BACK.length - 1) * BLH / 2 + BS * .32;
  for (const [li, ln] of BACK.entries()) { let xx = x0; for (const wd of ln.split(' ')) { const ww = F.measure(wd, BS, true); if (wd.replace(/[^a-z]/gi, '') === word) return [xx, y0 + li * BLH, ww]; xx += ww + F.measure(' ', BS, true); } }
  return [x0, y0, 100];
};

function scene(a, T, R) {
  const C3 = a.C3, tC = C3.end + .8, t0 = R.b, tPlate = R.b - S.SEAM_HALF;
  const tTilt0 = a.diff + .6, tTilt1 = a.third + 1.9;
  const K9 = [[tC, B.SLOT.x - 40, B.SLOT.y - 10, 1.38], [a.calls - .05, FUN.x, 942, .825], [a.calls + .9, FUN.x, 1010, .9], [a.sept - .05, FUN.x + 20, 1010, .91],
    [a.sept + 2.4, 6620, 900, 1], [a.notAg - .15, 6640, 900, 1.01], [a.notAg + 1.4, LET.x + LET.w / 2 - 80, 560, 1.0], [tTilt0, LET.x + LET.w / 2 - 70, 520, 1.01], [tTilt1, LET.x + LET.w / 2 - 70, -480, 1.01]];
  const cam = (t) => (t < tC ? B.camStacks(t, a) : F.lookPath(t, K9));
  const camT = F.lookPath(tTilt1, K9);
  const starsAt = (t) => { const c = cam(Math.min(t, tTilt1)), k = 1 - sineIO(span(t, a.docile - .1, a.docile + 1.2)); return [(B.STARS_B[0] - (c.cx - 960) * .02) * k, (B.STARS_B[1] - (c.cy - 540) * .03) * k]; };
  const glowAt = (t) => { const w = [1100, 470, 1000, .5], b = B.boardGlow(t), e = [W / 2, 500, 950, S.breathe(t, .55)];
    const k1 = smooth(span(t, tTilt0, tTilt1)), k2 = smooth(span(t, a.docile, a.years + .8)); return w.map((v, i) => lerp(lerp(v, b[i], k1), e[i], k2)); };
  const io = (t, i0, o0, d = .45) => span(t, i0, i0 + .55) * (1 - span(t, o0, o0 + d));

  // ---------------------------------------------------------------- 4.18 the funnel and the flying sheets
  const sheet = (ctx, x, y, rot, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = PAPER.body; ctx.fillRect(-24 * s, -16 * s, 48 * s, 32 * s); ctx.fillStyle = rgba(PAPER.edge, .9); ctx.fillRect(-24 * s, 15 * s, 48 * s, 1.5); ctx.fillStyle = rgba(PAPER.ink, .35); ctx.fillRect(-16 * s, -6 * s, 30 * s, 2); ctx.fillRect(-16 * s, 2 * s, 22 * s, 2); ctx.restore(); };
  const drawFunnel = (ctx, t) => {
    if (t < C3.end - .2 || t > a.sept + 2.2) return;
    const u = span(t, C3.end + .1, C3.end + 1.1), out = sineIO(span(t, a.sept + .2, a.sept + 1.4)), F0 = FUN;
    ctx.save(); ctx.translate(0, -out * 900);
    const pts = [[F0.x - F0.w / 2, F0.top], [F0.x - F0.nw / 2, F0.neck], [F0.x - F0.nw / 2, F0.spout]], pts2 = pts.map(([x, y]) => [2 * F0.x - x, y]);
    ctx.fillStyle = rgba(P.night0, .5 * smooth(u)); ctx.beginPath(); [...pts, ...pts2.slice().reverse()].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
    F.outline(ctx, [pts, pts2, [[F0.x - F0.w / 2, F0.top], [F0.x + F0.w / 2, F0.top]]], u, { w: 3.5 });
    // the sheets: off the stacks, into the mouth; the pile grows over the rim and spills down both sides
    SHEETS.forEach((s, i) => {
      const ti = C3.end + .5 + i * .085, q = span(t, ti, ti + .7); if (q <= 0) return;
      const pileH = Math.min(i, 26) * 7, tx = F0.x + s.tx * (1 - i / 60), ty = F0.top + 30 - pileH, e = sineIO(q);
      let x = lerp(s.src, tx, e), y = lerp(s.sy, ty, e) - Math.sin(Math.PI * e) * 320, rot = s.rot * (1 - e) + (s.d - .5) * .4;
      if (i >= 24 && q >= 1) { const k = t - ti - .7, f = Math.min(k, 2.2); x = tx + s.side * (Math.min(1, f * 1.4) * (F0.w / 2 + 40 - Math.abs(tx - F0.x)) + Math.max(0, f - .7) * s.vx * .4); y = ty + Math.max(0, f - .3) ** 2 * 420; rot += f * s.side * 1.4; }
      sheet(ctx, x, y, rot, 1.4);
    });
    ctx.restore();
  };
  // ---------------------------------------------------------------- 4.19 the card from the spout · 4.20 the medals and the letter
  const cardK = (t) => expoOut(span(t, a.calls - .15, a.calls + .65)), cardToMed = (t) => quartIO(span(t, a.sept - .05, a.sept + 1.2));
  const drawQuoteCard = (ctx, t) => {
    const u = cardK(t), m = cardToMed(t); if (u <= 0 || m >= 1) return;
    const [mx, my] = medXY(12), cx = lerp(QC.x, mx, m), cy = lerp(lerp(FUN.spout, QC.y + QC.h / 2, u), my, m), w = lerp(lerp(30, QC.w, u), MED.r * 2, m), h = lerp(lerp(10, QC.h, u), MED.r * 2, m), rr = lerp(8, MED.r, m);
    ctx.save(); ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(cx - w / 2 + 8, cy - h / 2 + 12, w, h, rr); ctx.fill();
    ctx.fillStyle = F.lin(ctx, cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, [[0, PAPER.lit], [1, mixHex(PAPER.body, PAPER.shade, m)]]); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, rr); ctx.fill(); ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    const tu = span(u, .4, 1) * (1 - span(t, a.sept - .3, a.sept)); if (tu > 0) {
      const g1 = span(t, a.indig - .3, a.indig), g2 = span(t, a.indig + .05, a.indig + .4);
      const s1 = '“proof ', s2 = 'indigestion”', ww = F.measure(s1 + s2, 74, true), x0 = cx - ww / 2;
      F.maskLine(ctx, [[s1, 0]], x0, cy + 10, 74, F.rise(tu), { serif: true, col: mixHex(PAPER.ink, GOLD.deep, .9 * g1), glow: false });
      F.maskLine(ctx, [[s2, 0]], x0 + F.measure(s1, 74, true) + 18, cy + 10, 74, F.rise(tu), { serif: true, col: mixHex(PAPER.ink, GOLD.deep, .9 * g2), glow: false });
      F.capsLabel(ctx, 'TERENCE TAO · NATURE, WORLD VIEW, 22 OCT 2026', cx, cy + h / 2 + 46, tu, { size: 24, col: CREAM });
    }
  };
  const drawMedals = (ctx, t) => {
    if (t < a.sept || t > tTilt1 + .2) return;
    for (let i = 0; i < 25; i++) {
      const [x, y] = medXY(i), d = Math.hypot(x - MED.x, y - MED.y) / MED.step, k = i === 12 ? span(t, a.sept + 1.1, a.sept + 1.2) : expoOut(span(t, a.tf - .1 + d * .16, a.tf + .6 + d * .16)); if (k <= 0) continue;
      const r = MED.r * (i === 12 ? 1 : k), tao = i === 12;
      halo(ctx, x, y, r * 2.2, (tao ? .5 : .18) * k, GOLD.halo, GOLD.core);
      ctx.fillStyle = F.lin(ctx, x - r, y - r, x + r, y + r, [[0, mixHex(PAPER.shade, GOLD.hot, .35)], [1, mixHex(PAPER.edge, GOLD.shade, .5)]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
      ctx.strokeStyle = rgba(P.night0, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * .72, 0, 6.29); ctx.stroke();
      ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.arc(x - r * .1, y - r * .05, r * .3, Math.PI * .8, Math.PI * 2.1); ctx.fill();   // a head in relief (a medal, no likeness)
      if (tao) { ctx.strokeStyle = GOLD.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r + 8, 0, 6.29); ctx.stroke(); }
      // they sign: a thread from each medal to its signature on the letter
      const ts = a.signed - .5 + d * .1, su = span(t, ts, ts + .45), sg = span(t, ts + .35, ts + .7), fade = span(t, a.signed + 1.4, a.signed + 2.1);
      if (su > 0 && fade < 1) F.trailCream(ctx, [[x + r, y], [lerp(x, SIGS[i][0], .6), y - 40], SIGS[i]], fade, su, { w: 1.2, a: .6 });
      if (sg > 0) { const [sx, sy] = SIGS[i], pts = []; for (let q = 0; q <= 14; q++) pts.push([sx + q * 4, sy + Math.sin(q * 1.3 + i) * 5 - q * .6]); ctx.save(); ctx.strokeStyle = PAPER.ink; ctx.lineWidth = 1.8; ctx.globalAlpha = .8; ctx.beginPath(); F.subPoly(pts, 0, sg).forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); }
    }
    // the letter (it unfolds out of a line beside the grid)
    const lu = expoOut(span(t, a.tf + .3, a.tf + 1.2)); if (lu > 0) {
      const hh = LET.h * lu; ctx.save(); ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(LET.x + 8, LET.y + 12, LET.w, hh);
      ctx.fillStyle = F.lin(ctx, LET.x, LET.y, LET.x + LET.w, LET.y + LET.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(LET.x, LET.y, LET.w, hh); ctx.beginPath(); ctx.rect(LET.x, LET.y, LET.w, hh); ctx.clip();
      ctx.fillStyle = rgba(PAPER.ink, .3); for (let k = 0; k < 9; k++) ctx.fillRect(LET.x + 50, LET.y + 60 + k * 34, (LET.w - 100) * (k === 8 ? .5 : .92 - (k % 3) * .06), 3);
      const hl = span(t, a.notAg - .3, a.notAg + .2) * (1 - span(t, a.point + .4, a.point + 1)); if (hl > 0) { ctx.fillStyle = rgba(GOLD.body, .45 * hl); ctx.fillRect(LET.x + 40, LET.y + 60 + 4 * 34 - 14, LET.w - 80, 26); }
      ctx.restore();
    }
  };
  // ---------------------------------------------------------------- 4.21 the line of the letter · 4.22 the misaligned card (screen space)
  const drawLetterQuote = (ctx, t, sp) => {
    const u = span(t, a.notAg - .1, a.notAg + .6), o = span(t, a.point - .35, a.point); if (u <= 0 || o >= 1) return;
    const [lx, ly] = sp(LET.x + LET.w / 2, LET.y + 60 + 4 * 34), k = expoOut(u), y = lerp(ly, 250, k);
    F.maskLine(ctx, [['AI can “enhance and accelerate genuine', 0]], W / 2, y - 30, 46, F.rise(u) * (1 - o), { serif: true, col: CREAM, glow: false, align: 'center' });
    F.maskLine(ctx, [['mathematical study and understanding”', 0]], W / 2, y + 28, 46, F.rise(span(u, .15, 1)) * (1 - o), { serif: true, col: CREAM, glow: false, align: 'center' });
    F.capsLabel(ctx, 'FROM THE SAME LETTER', W / 2, y + 78, span(u, .3, 1) * (1 - o), { size: 22 });
  };
  const QT = '“the goals of the AI companies and the goals of the mathematical community are severely misaligned”';
  const drawMisaligned = (ctx, t, dy) => {
    const u = span(t, a.point - .1, a.point + .6); if (u <= 0 || dy > H) return;
    ctx.save(); ctx.translate(0, dy);
    const box = F.quoteCard(ctx, t, T, { text: QT, w: 1180, size: 50, y: 150, u, hi: ['severely', 'misaligned'], hiU: span(t, a.diff - .1, a.diff + .4) });
    const by = box ? box.y + box.h : 420;
    F.capsLabel(ctx, 'OPEN LETTER · MATHANDAI.ORG · 11 SEPT 2026', W / 2, by + 44, span(u, .4, 1), { size: 22 });
    // two arrows part (4.22): one origin, two directions
    const au = span(t, a.companies - .1, a.companies + .7), O = [W / 2, by + 110];
    for (const [s, lab, tt] of [[-1, 'COMPANIES', a.companies], [1, 'MATHEMATICIANS', a.companies + .6]]) {
      const E = [W / 2 + s * 420, by + 220], q = span(t, tt - .1, tt + .55); if (q <= 0) continue;
      F.outline(ctx, [[O, [W / 2 + s * 120, by + 130], E]], smooth(q), { w: 3.5 });
      if (q > .85) { const ang = Math.atan2(E[1] - (by + 160), E[0] - (W / 2 + s * 200)); ctx.save(); ctx.translate(E[0], E[1]); ctx.rotate(ang); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-18, -10); ctx.lineTo(-18, 10); ctx.closePath(); ctx.fill(); ctx.restore(); }
      F.capsLabel(ctx, lab, E[0] + s * 30, E[1] + 10, span(q, .5, 1), { size: 26, col: CREAM, align: s < 0 ? 'right' : 'left' });
    }
    ctx.restore();
  };

  // ---------------------------------------------------------------- 4.23–4.31 board space (screen): the board, the spill, the lists, the band
  const boardPose = (t) => {
    const g = quartIO(span(t, a.third - .15, a.third + .85)), big = quartIO(span(t, a.hereAll - .3, a.hereAll + .9)), sink = sineIO(span(t, a.docile - .1, a.docile + 1.2)) * 1000;
    const M = B.BOARD_MID, Bg = { x: 660, y: 26, s: 1 };
    return { x: lerp(lerp(B.BOARD_CORNER.x, M.x, g), Bg.x, big), y: lerp(lerp(B.BOARD_CORNER.y, M.y, g), Bg.y, big) + sink, s: lerp(lerp(B.BOARD_CORNER.s, M.s, g), Bg.s, big), sink };
  };
  const bandState = (t) => {   // the band: stretches out of row 4 (4.27), comes big (4.28); scale k of S.BAND, centre
    const bp = boardPose(t), r4 = B.boardRowRect(bp.x, bp.y, bp.s, 3), grow = expoOut(span(t, a.secondHalf + .4, a.goodS + .6)), big = quartIO(span(t, a.hereAll - .3, a.hereAll + .9));
    const k0 = r4.w / S.BAND.w, k1 = lerp(.74, 1, big), kx = lerp(k0, k1, grow), ky = lerp(r4.h / S.BAND.h, k1, grow);
    return { cx: W / 2, cy: lerp(r4.y + r4.h / 2, lerp(580, 600, big), grow) + bp.sink, kx, ky, u: grow };
  };
  const drawBoardSpace = (ctx, t) => {
    if (t < a.third - .3) return;
    const bp = boardPose(t);
    const st = { e: 1, m: 1, grain: 1, tick: 1, d: span(t, a.waiting - .2, a.waiting + .5), dPulse: .6 * Math.max(0, Math.sin((t - a.moving) * 6)) * span(t, a.moving - .3, a.moving) * (1 - span(t, a.raises - .3, a.raises)), cPulse: .8 * Math.max(0, Math.sin((t - a.who) * 4)) * span(t, a.who - .3, a.who) * (1 - span(t, a.your - .3, a.your)) };
    if (bp.sink < 1000) B.fourLines(ctx, t, bp.x, bp.y, bp.s, st);
    // 4.24–4.25 the sheets spill out of row 3 and fall past row 4
    const r3 = B.boardRowRect(bp.x, bp.y, bp.s, 2);
    SPILL.forEach((s, i) => {
      const ti = a.moving - .1 + i * .12, k = t - ti; if (k <= 0 || k > 3.2) return;
      const x0 = r3.x + r3.w - 10, y0 = r3.y + r3.h / 2, x = x0 + s.vx * Math.min(k, 1.6) * (i % 2 ? 1 : -.9) * .8, y = y0 - s.vy * k + 620 * k * k;
      if (y > H + 60) return; sheet(ctx, x, y, s.rot * k, 1.15);
    });
    // 4.26 you and your slip; the long list unrolls beside you (held out of frame); 4.27 both fly up into row 4
    const yu = expoOut(span(t, a.your - .4, a.your + .4)), fly = quartIO(span(t, a.secondHalf - .1, a.secondHalf + .8));
    if (yu > 0 && t < a.goodS + 1) {
      const YX = 760, YY = 905, YH = 180, r4 = B.boardRowRect(bp.x, bp.y, bp.s, 3);
      ctx.save(); ctx.beginPath(); ctx.rect(YX - 200, YY - 280, 400, 281); ctx.clip(); const hd = F.du(ctx, YX, YY + (1 - yu) * 230 + fly * 260, YH, { dir: 1, look: .55, armR: [1.2, 1.5], light: .8 }); ctx.restore();
      const hp = hd?.R ?? [YX + 50, YY - 110], sx = lerp(hp[0] + 12, r4.x + 60, fly), sy = lerp(hp[1] - 46, r4.y + r4.h / 2, fly), sk = lerp(1, .4, fly);
      if (fly < 1) { ctx.save(); ctx.translate(sx, sy); ctx.scale(sk, sk); ctx.rotate(-.08 * (1 - fly)); ctx.fillStyle = PAPER.lit; ctx.fillRect(-34, -48, 68, 96); ctx.fillStyle = rgba(PAPER.ink, .6); for (let q = 0; q < 3; q++) ctx.fillRect(-22, -28 + q * 22, 40 - q * 6, 3); ctx.restore(); }
      // the long list: from above the frame down to the ground, many lines; it unrolls on "someone else's" and is pulled up into row 4
      const lu = sineIO(span(t, a.else - .2, a.else + .9)), LX = 1240, top = -60, len = lerp(0, 940, lu) * (1 - fly), LW = 150;
      if (len > 2) { ctx.save(); ctx.fillStyle = F.lin(ctx, LX, 0, LX + LW, 0, [[0, PAPER.body], [1, PAPER.shade]]); ctx.fillRect(LX, top, LW, len); ctx.beginPath(); ctx.rect(LX, top, LW, len); ctx.clip(); ctx.fillStyle = rgba(PAPER.ink, .45); for (let q = 0; q < 40; q++) ctx.fillRect(LX + 18, top + 30 + q * 24, LW - 36 - (q * 37 % 40), 3); ctx.restore(); ctx.fillStyle = PAPER.edge; ctx.fillRect(LX - 8, top + len - 6, LW + 16, 10); }
      const lab = (1 - span(t, a.secondHalf - .3, a.secondHalf + .1));
      F.capsLabel(ctx, 'YOUR LIST', YX - 110, YY - 160, span(t, a.your, a.your + .5) * lab, { size: 26, col: GOLD.text, align: 'right' });
      F.capsLabel(ctx, 'SOMEONE ELSE’S', LX + LW + 26, 640, span(t, a.else + .2, a.else + .7) * lab, { size: 26, col: CREAM, align: 'left' });
    }
    // 4.27–4.31 Good's band: out of row 4, big; the cover twitches, then falls on "provided"; the back half lights
    if (t > a.secondHalf + .3) {
      const b = bandState(t), off = span(t, a.provided - .1, a.provided + .75), twitch = .05 * Math.sin(Math.PI * span(t, a.secondHalf + 1.2, a.secondHalf + 2)) + .03 * Math.sin(Math.PI * span(t, a.hereAll + .2, a.hereAll + .8));
      const flash = Math.sin(Math.PI * span(t, a.provided + .2, a.provided + 1.6));
      ctx.save(); ctx.translate(b.cx, b.cy); ctx.scale(b.kx, b.ky); ctx.translate(-BAND_C[0], -BAND_C[1]);
      if (flash > 0) halo(ctx, BAND_C[0] + S.BAND.w / 4, BAND_C[1], 900, .45 * flash, GOLD.halo, GOLD.core);
      F.band(ctx, t, BAND_C[0], BAND_C[1], S.BAND.w, S.BAND.h, { u: b.u < 1 ? b.u : 1, w0: S.BAND.w, h0: S.BAND.h, type: 1, gold: 1, cover: 1 - twitch, coverOff: off, reveal: span(t, a.provided + .05, a.provided + .6), hiBack: .8 * span(t, a.underC - .1, a.underC + .5), empty: 1 - smooth(span(t, a.secondHalf + .4, a.secondHalf + 1.2)) });
      // 4.30 "provided that" underlined in cream; 4.31 "docile" lifts away (its slot in the band stays dark)
      const [px, py] = backWord('provided'), [, , tw] = backWord('that'), [tx0] = backWord('that');
      const ul = span(t, a.cond - .1, a.cond + .5); if (ul > 0) F.trailCream(ctx, [[px - 4, py + 12], [tx0 + tw + 4, py + 10]], 0, smooth(ul), { w: 3.5 });
      ctx.restore();
      const ou = io(t, a.quote + .4, a.docile - .2); if (ou > 0) F.capsLabel(ctx, '— I. J. GOOD, 1965, P. 33', W / 2, b.cy + S.BAND.h * b.ky / 2 + 52, ou, { size: 24, col: CREAM });
      const cu = io(t, a.cond + .2, a.docile - .1); if (cu > 0) F.capsLabel(ctx, 'THE CONDITION', W / 2 + S.BAND.w * b.kx / 4, b.cy + S.BAND.h * b.ky / 2 + 52, cu, { size: 28, col: CREAM });
      const hu = io(t, a.hereAll + .05, a.quote - .1); if (hu > 0) F.capsLabel(ctx, 'HERE IS ALL OF IT', W / 2, b.cy + S.BAND.h * b.ky / 2 + 56, hu, { size: 28, col: CREAM });
    }
  };
  // 4.31 DOCILE lifts out of the band · 4.32 its underline becomes the edge of Turing's card
  const docile = (t) => {   // screen geometry of the lifted word
    const b = bandState(Math.min(t, a.docile - .1)), [wx, wy, ww] = backWord('docile'), sx = b.cx + (wx - BAND_C[0]) * b.kx, sy = b.cy + (wy - BAND_C[1]) * b.ky;
    const k = quartIO(span(t, a.docile - .1, a.docile + .9)); return { x: lerp(sx + ww * b.kx / 2, W / 2, k), y: lerp(sy, 500, k), size: lerp(BS * b.kx, 150, k), k };
  };
  const drawDocile = (ctx, t) => {
    if (t < a.docile - .1 || t > a.years + 1.6) return;
    const d = docile(t), out = span(t, a.years + .35, a.years + 1.05);
    F.maskLine(ctx, [['docile', 0]], d.x, d.y, d.size, 1 - out, { serif: true, col: mixHex(CREAM, GOLD.text, .1), glow: false, align: 'center' });
    F.capsLabel(ctx, 'WILLING TO BE GUIDED', W / 2, 600, span(t, a.willing - .05, a.willing + .55) * (1 - span(t, a.years, a.years + .4)), { size: 32, col: CREAM });
  };
  const cardH = (() => { const words = S.TURING.text.split(/\s+/); let n = 1, cur = []; for (const wd of words) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), S.TURING.size, true) > S.TURING.w - 108) { n++; cur = [wd]; } else cur = nx; } return 24 + n * S.TURING.size * 1.22 + 92; })();
  const drawTuring = (ctx, t) => {
    if (t < a.years - .2) return;
    const z = S.creepZ(t, t0), toS = (x, y) => [W / 2 + (x - W / 2) * z, H / 2 + (y - (H / 2 - 20)) * z];
    const cx0 = (W - S.TURING.w) / 2, cy0 = S.TURING.y, [l0x, l0y] = toS(cx0, cy0), [l1x] = toS(cx0 + S.TURING.w, cy0);
    // the underline of "docile" (screen) → the card's top edge
    const d = docile(t), ul = span(t, a.docile + .5, a.docile + 1.1), mv = quartIO(span(t, a.years - .1, a.years + .6)), un = sineIO(span(t, a.years + .5, a.years + 1.5));
    const uw = F.measure('docile', d.size, true), ux0 = lerp(d.x - uw / 2, l0x, mv), ux1 = lerp(d.x + uw / 2, l1x, mv), uy = lerp(d.y + 24, l0y, mv);
    // the card unfolds downward from that edge (in the plate's creep space: it is the plate's card)
    if (un > 0) S.creep(ctx, t, t0, () => { ctx.save(); ctx.beginPath(); ctx.rect(cx0 - 40, cy0 - 30, S.TURING.w + 80, 30 + (cardH + 40) * un); ctx.clip(); S.turingCard(ctx, t, { hiU: span(t, a.take - .05, a.take + .4) }); ctx.restore(); });
    const lineA = ul * (1 - span(t, a.years + 1.3, a.years + 1.6));
    if (lineA > 0) { const yy = lerp(uy, l0y + cardH * z, un * 0); F.trailCream(ctx, [[ux0, uy + (un > 0 ? (cardH * z) * un : 0)], [ux1, uy + (un > 0 ? (cardH * z) * un : 0)]], 0, smooth(ul), { w: 3, a: lineA }); void yy; }
    // the second figure from the hut: it rises beside the card, then walks off before the plate
    const fk = expoOut(span(t, a.turing - .1, a.turing + .8)), walk = span(t, a.take - 1.6, tPlate - .1);
    if (fk > 0 && walk < 1) S.creep(ctx, t, t0, () => {
      const x = lerp(230, -260, F.powOut(walk, 1.3)), ph = walk > 0 ? walk * Math.PI * 2 * 4 : null;
      ctx.save(); ctx.beginPath(); ctx.rect(-600, 0, 1200, 1010); ctx.clip(); F.person(ctx, x, 1000 + (1 - fk) * 300, 250, { dir: walk > 0 ? -1 : 1, look: .2, walk: ph, light: .45, long: true }); ctx.restore();
    });
  };

  // ======================================================================================================================== draw
  return (ctx, t) => {
    if (t >= tPlate) { S.plateTuring(ctx, t, T); return; }
    const c = cam(Math.min(t, tTilt1)), sp = (x, y) => F.lookPt(c.cx, c.cy, c.z, x, y), [ox, oy] = starsAt(t);
    F.night(ctx, t, { glow: glowAt(t), ox, oy });
    if (t < tTilt1 + .1) F.look(ctx, c.cx, c.cy, c.z, () => {
      B.stacksAct(ctx, t, a);
      drawFunnel(ctx, t);
      drawMedals(ctx, t);
      drawQuoteCard(ctx, t);
    });
    // ---------------- C3: the plate grows out of the slot and goes back into it
    if (t > C3.start - .65 && t < C3.end + .8) {
      const [x0, y0] = sp(B.SLOT.x - B.SLOT.w / 2, B.SLOT.y - B.SLOT.h / 2), [x1, y1] = sp(B.SLOT.x + B.SLOT.w / 2, B.SLOT.y + B.SLOT.h / 2);
      const m = span(t, C3.start - .6, C3.start + .7) * (1 - span(t, C3.end - .5, C3.end + .75));   // single ease (clipPlate eases m itself; the double ease LURCHed)
      if (m > 0) F.clipPlate(ctx, t, T, 'C3', { from: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, morph: m });
    }
    // ---------------- screen type of the world part
    F.capsLabel(ctx, 'TOO MANY', 1310, 330, io(t, a.many + .1, a.calls - .3), { size: 44, col: CREAM, align: 'left' });
    F.capsLabel(ctx, 'NOT TOO FEW', 1310, 380, io(t, a.few, a.calls - .25), { size: 26, align: 'left' });
    { const u = io(t, a.tf + .4, a.notAg - .3); F.capsLabel(ctx, '25 FIELDS MEDALISTS', W / 2, 96, u, { size: 32, col: CREAM }); F.capsLabel(ctx, '11 SEPT 2026', W / 2, 136, u, { size: 24 });
      const [mx, my] = sp(...medXY(12)); F.goldLabel(ctx, mx - MED.r * c.z - 6, my, 'TERENCE TAO', null, io(t, a.sept + 1.25, a.notAg - .3), { dx: -90, dy: -90, size: 26 }); }
    drawLetterQuote(ctx, t, sp);
    F.capsLabel(ctx, 'NOT AGAINST A.I.', W / 2, 400, io(t, a.notAg + .2, a.point - .3), { size: 34, col: GOLD.text });
    drawMisaligned(ctx, t, (c.cy - cam(Math.min(t, tTilt0)).cy) * -c.z);
    // ---------------- board space (screen)
    drawBoardSpace(ctx, t);
    F.capsLabel(ctx, 'MOVING FASTER THAN PEOPLE CAN FOLLOW', W / 2, 600, io(t, a.moving + .3, a.raises - .1), { size: 30, col: CREAM });
    if (t > a.who - .3 && t < a.your + .4) { const ws = F.wordTimes(T, 'who decides what these machines work on', null, a.raises); F.question(ctx, t, 'Who decides what it works on?', W / 2, 640, 56, { ts: ws ? [ws[0], ws[1], ws[2], ws[4], ws[5], ws[6]] : null, u: 1, out: span(t, a.your - .2, a.your + .3) }); }
    drawDocile(ctx, t);
    drawTuring(ctx, t);
  };
}
