// c06 · LINK 3 · LAW (builder B2) · 'Law. Rules written' (plateLaw) → 'Truth. The last link'. One continuous take, no cut.
// The camera flies INTO the lit LAW link of plateLaw; everything after lives inside it (lib/b2_kit.mjs: the inner board, same dot
// grid). Every sentence gets its own motif; carriers: the link's hole → the page → its paragraphs file into drawers → the cool dot
// carries one form → it opens into the chat window → its draft unrolls (★) → the SA policy is pulled back, its reference list
// dissolves → the cursor becomes the WRITING line that outruns CHECKING (the LAW crack, HUD) → your hand brings the TRUTH link.
//
// | ID   | anchor (phrase)                 | zeigt wörtlich                                                        | kind  | carrier out           |
// |------|---------------------------------|-----------------------------------------------------------------------|-------|-----------------------|
// | 5.01 | Law. Rules written              | plateLaw: four links, LAW lit (held, creep)                           | EXPL  | the LAW link's hole   |
// | 5.02 | Rules written by people         | fly into LAW: a pen writes paragraphs, a warm reading line follows    | MIX   | the paragraphs        |
// | 5.03 | Harari has a name               | the paragraphs file into a wall of drawers; a cool dot slips in       | EXPL  | the dot               |
// | 5.04 | Bureaucratic natives            | BUREAUCRATIC NATIVES over the drawers · source                        | EXPL  | the dot               |
// | 5.05 | Machines that are at home       | the dot opens, fills and closes drawers without effort, takes a form  | EXPL  | one form              |
// | 5.06 | In Washington                   | the form opens into a chat window writing rule text · DoT / ProPublica | EXPL | the text              |
// | 5.07 | Its top lawyer                  | a bar fills beside the text: 20 MINUTES                               | EXPL  | the draft             |
// | 5.08★| How long would you need         | the draft unrolls far out of frame; your reading line barely started  | EXPL  | the document          |
// | 5.09 | South Africa had to             | a policy is pulled back off the board · SA, WITHDRAWN 26 APR 2026     | EXPL  | its reference list    |
// | 5.10 | Its reference list              | the list's lines dissolve into dust                                   | EXPL  | the cursor            |
// | 5.11 | Likely written by a machine     | a cool cursor wrote it; the checker's chair stays empty · minister    | EXPL  | two lines             |
// | 5.12 | Rules may soon be written       | WRITING (cool) runs away from CHECKING (cream); LAW cracks (HUD)      | EXPL  | your hand             |
// | 5.13 | Still, you would notice         | your hand comes in holding the TRUTH link                             | MIX   | the link              |
// | 5.14 | Wouldn't you                    | the link in your hand, a slow push                                    | MIX   | the link grows → c07  |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f70_kit.mjs';
import * as S from '../lib/f70_world.mjs';
import * as X from '../lib/f70_explain.mjs';
import * as B from '../lib/b2_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, LAMP, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT70;

export function scene06(T, R) {
  const a0 = T.G('Law. Rules written'), G = (p) => T.G(p, 0, a0);
  const A = {
    rules: G('Rules written by people'), name: G('Harari has a name'), nat: G('Bureaucratic natives'), mach: G('Machines that are at home'),
    wash: G('In Washington'), lawyer: G('Its top lawyer'), twenty: G('twenty minutes'), howlong: G('How long would you need'),
    sa: G('South Africa had to'), withdraw: G('withdraw its draft'), ref: G('Its reference list'), likely: G('Likely written by a machine'),
    soon: G('Rules may soon be written'), still: G('Still, you would notice'), wouldnt: G("Wouldn't you"), truth: G('Truth. The last link'),
  };
  const b = A.truth;
  // ---------------------------------------------------------------- the camera: plate creep → fly into LAW → inner path
  const g0 = A.rules - .25, g1 = g0 + 2.05, S1 = 1.12 * B.K;
  const creep = (t) => S.creep(t, T, 'Law. Rules written');
  const VI = [[g1, { x: 960, y: 560, s: 1.12 }], [A.name - .15, { x: 962, y: 559, s: 1.112 }], [A.name + 1.45, { x: 2000, y: 560, s: 1 }],
    [A.wash - .35, { x: 2008, y: 562, s: 1 }], [A.wash + 1.25, { x: 3200, y: 560, s: 1 }], [A.howlong - .05, { x: 3206, y: 560, s: 1.01 }],
    [A.howlong + 1.55, { x: 3200, y: 900, s: .62 }], [A.sa - .25, { x: 3204, y: 904, s: .625 }], [A.sa + 2.05, { x: 4500, y: 560, s: 1 }],
    [A.soon - .2, { x: 4506, y: 560, s: 1 }], [A.soon + 1.8, { x: 5500, y: 560, s: 1 }], [A.wouldnt - .3, { x: 5500, y: 562, s: 1 }],
    [b + 1.7, { x: 5470, y: 560, s: 1.05 }]];
  function views(t) {   // → { vo (outer), vi (inner) }
    if (t < g0) { const vo = { x: W / 2, y: H / 2, s: creep(t) }; return { vo, vi: B.inner(vo) }; }
    if (t < g1) {
      const u = (t - g0) / (g1 - g0), e = sineIO(u), s = Math.exp((1 - e) * Math.log(creep(t)) + e * Math.log(S1));
      const s0 = creep(t), p0 = [W / 2 + (B.LC.x - W / 2) * s0, H / 2 + (B.LC.y - H / 2) * s0], px = lerp(p0[0], W / 2, e), py = lerp(p0[1], H / 2, e);
      const vo = { x: B.LC.x - (px - W / 2) / s, y: B.LC.y - (py - H / 2) / s, s }; return { vo, vi: B.inner(vo) };
    }
    const vi = X.viewPath(t, VI); return { vo: B.outer(vi), vi };
  }

  // ---------------------------------------------------------------- outer: plateLaw replica (exact at the seam), then the fly-in
  function plate(ctx, t, vo) {
    const s = F.chainState(T, t).links, lit = 1 - span(t, g0 + .2, g0 + 1.5);
    X.inView(ctx, vo, () => {
      for (let i = 0; i < 3; i++) F.chainLink(ctx, t, (S.lawRowX(i) + S.lawRowX(i + 1)) / 2, S.LAWROW.y, S.LAWROW.L * .55, 0, { edge: true });
      for (let i = 0; i < 4; i++) {
        F.chainLink(ctx, t, S.lawRowX(i), S.LAWROW.y, S.LAWROW.L, 0, { crack: i < 2 ? 1 : s[i].crack, lit: i === 2 ? (.75 + .25 * Math.sin(t * 3)) * lit : 0 });
        X.label(ctx, F.CHAIN.names[i], S.lawRowX(i), S.LAWROW.y + S.LAWROW.L * .58 / 2 + 70, 1, { size: 30, spacing: .16, gold: i === 2 ? 1 : 0, col: i === 2 ? GOLD.text : CREAM });
      }
    });
  }

  // ---------------------------------------------------------------- inner stations (inner board units)
  const PG = { x: 960, y: 545, w: 620, h: 330 }, NL = 5, LX = PG.x - PG.w / 2 + 50, LY = PG.y - PG.h / 2 + 70, LW = PG.w - 100;
  const wU = (t) => span(t, A.rules + 1.0, A.name + .1);                       // the pen writes
  const DW = { x0: 1579, y0: 450, w: 200, h: 96, g: 14 }, dPos = (i) => [DW.x0 + (i % 4) * (DW.w + DW.g) + DW.w / 2, DW.y0 + Math.floor(i / 4) * (DW.h + DW.g) + DW.h / 2];
  const FILE = [1, 6, 3, 8, 11];                                                  // the drawer each written line files into
  const flyU = (t, i) => span(t, A.name + .05 + i * .08, A.name + 1.45 + i * .08);
  const VISIT = [[2, A.mach + .05], [5, A.mach + .95], [10, A.mach + 1.85]];      // the dot works three drawers
  const openU = (t, i) => { const v = VISIT.find((q) => q[0] === i); return v ? Math.sin(Math.PI * span(t, v[1] + .15, v[1] + .85)) : 0; };
  const DOT = [[A.name + .9, 2750, 380], [A.name + 2.0, 2330, 553], [A.nat + .2, 1700, 553], [A.nat + 1.6, 1760, 553],
    ...VISIT.flatMap(([i, t0]) => { const [x, y] = dPos(i); return [[t0 + .15, x - 80, y], [t0 + .85, x - 80, y]]; }),
    [A.wash + .0, 2440, 620], [A.wash + .6, 3060, 750]];
  function dotAt(t) {
    if (t <= DOT[0][0]) return [DOT[0][1], DOT[0][2]];
    for (let i = 1; i < DOT.length; i++) if (t <= DOT[i][0]) { const [ta, xa, ya] = DOT[i - 1], [tb, xb, yb] = DOT[i], e = sineIO((t - ta) / (tb - ta)); return [lerp(xa, xb, e), lerp(ya, yb, e) - Math.sin(Math.PI * e) * 26]; }
    return [DOT[DOT.length - 1][1], DOT[DOT.length - 1][2]];
  }
  const CW = { x: 3060, y: 520, w: 760, h: 460 }, BAR = { x: 3510, y: 500, len: 360 };
  const SC = { x0: CW.x - 320, w: 640, y0: CW.y + CW.h / 2 };
  const SA = { x: 4330, y: 470, w: 380, h: 480 }, CH = { x: 4700, y: 790 };
  const pull = (t) => sineIO(span(t, A.withdraw - .1, A.withdraw + 1.2));
  const NR = 10, refY = (i) => SA.y - SA.h / 2 + 96 + i * 34, dustU = (t, i) => span(t, A.ref + .35 + i * .2, A.ref + 1.6 + i * .2);
  const CUR = [SA.x - SA.w / 2 + 40 + (SA.w - 80) * .62, refY(NR - 1)];
  const RACE = { y1: 740, y2: 800 };
  const wHead = (t) => { const u = t - (A.soon + .15); return u <= 0 ? 0 : 1700 * (u < 1 ? u * u / 2 : u - .5); };   // WRITING accelerates away
  const cHead = (t) => 420 * sineIO(span(t, A.soon + .4, A.soon + 4.2)) + 14 * Math.max(0, t - (A.soon + 4.2));
  const HAND = { x: 5250, y: 585 };

  function stationA(ctx, t) {
    if (t > A.wash + 1) return;
    B.sheet(ctx, PG.x, PG.y, PG.w, PG.h, { rot: -.01, a: span(t, g0, g0 + .8) });
    // lines written by the pen; each line leaves for its drawer at 5.03
    const tot = wU(t) * NL;
    for (let i = 0; i < NL; i++) {
      const f = clamp(tot - i); if (f <= 0) break;
      const lw = LW * (i === NL - 1 ? .55 : .9 - (i % 3) * .06), fu = flyU(t, i);
      if (fu <= 0) { ctx.fillStyle = rgba(PAPER.ink, .6); ctx.fillRect(LX, LY + i * 40, lw * f, 7); continue; }
      const [dx, dy] = dPos(FILE[i]), e = sineIO(fu), x = lerp(LX + lw / 2, dx, e), y = lerp(LY + i * 40, dy, e) - Math.sin(Math.PI * e) * 120, w = lerp(lw, 70, e);
      if (fu < 1) { ctx.fillStyle = rgba(mixHex(PAPER.ink, CREAM, e), .6 + .3 * e); ctx.fillRect(x - w / 2, y, w, 7); }
    }
    // the warm reading line follows the writing, one line behind
    const rd = clamp(tot - 1.1);
    if (rd > 0 && flyU(t, 0) <= 0) { const li = Math.min(NL - 1, Math.floor(rd)), f = rd - li; ctx.fillStyle = rgba(LAMP.body, .55); ctx.fillRect(LX, LY + li * 40 + 14, LW * .88 * f, 3); halo(ctx, LX + LW * .88 * f, LY + li * 40 + 14, 26, .5, LAMP.body, LAMP.core); }
    // the pen: a slim warm pen whose tip writes
    const pu = span(t, A.rules + .7, A.rules + 1.1) * (1 - span(t, A.name - .2, A.name + .3));
    if (pu > 0) {
      const li = Math.min(NL - 1, Math.floor(tot)), f = clamp(tot - li), lw = LW * (li === NL - 1 ? .55 : .9 - (li % 3) * .06);
      const px = LX + lw * f + (1 - expoOut(pu)) * 300, py = LY + li * 40 + 4 - Math.abs(Math.sin(t * 22)) * 3 - (1 - expoOut(pu)) * 200;
      ctx.save(); ctx.globalAlpha *= clamp(pu * 2); ctx.translate(px, py); ctx.rotate(-.85);
      ctx.fillStyle = lin2(ctx); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(18, -9); ctx.lineTo(230, -11); ctx.lineTo(236, 0); ctx.lineTo(230, 11); ctx.lineTo(18, 9); ctx.closePath(); ctx.fill();
      ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(18, -9); ctx.lineTo(18, 9); ctx.fill();
      ctx.restore();
    }
    X.label(ctx, 'BY PEOPLE · FOR PEOPLE', PG.x, PG.y - PG.h / 2 - 50, B.lab(t, A.rules + 1.3, A.name + .3), { size: 30, spacing: .16, gold: .3 });
  }
  const lin2 = (ctx) => E.lin(ctx, 0, -11, 0, 11, [[0, mixHex(LAMP.body, P.cream, .4)], [1, mixHex(LAMP.deep, P.night1, .2)]]);

  function stationB(ctx, t) {
    if (t < A.name - .5 || t > A.howlong + 2) return;
    const wu = span(t, A.name - .3, A.name + .9);
    for (let i = 0; i < 12; i++) {
      const [x, y] = dPos(i), u = expoOut(clamp(wu * 1.6 - (i % 4) * .12 - Math.floor(i / 4) * .08)); if (u <= 0) continue;
      const op = openU(t, i) * 34, got = FILE.indexOf(i), filled = got >= 0 && flyU(t, got) >= 1;
      ctx.save(); ctx.globalAlpha *= clamp(u * 2); ctx.translate(0, (1 - u) * 30);
      if (op > 1) { ctx.fillStyle = rgba(COOL.body, .35); ctx.fillRect(x - DW.w / 2, y - DW.h / 2 + 6, op + 6, DW.h - 12); halo(ctx, x - DW.w / 2 + op / 2, y, 60, .35 * op / 34, COOL.halo, COOL.core); }
      ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x - DW.w / 2 + op, y - DW.h / 2, DW.w, DW.h, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rgba(CREAM, .5); ctx.fillRect(x - 30 + op, y + 14, 60, 6);
      ctx.fillStyle = filled ? rgba(PAPER.body, .85) : rgba(CREAM, .18); ctx.fillRect(x - 40 + op, y - 26, 80, 22);
      ctx.restore();
    }
    B.big(ctx, SRC.natives, 2000, 330, 96, B.lab(t, A.nat - .1, A.wash - .3), { gold: .35 });
    // the cool dot (the machine), and the form it carries out at the end of 5.05
    const du = span(t, A.name + .9, A.name + 1.5) * (1 - span(t, A.wash + .6, A.wash + .75));
    if (du > 0) {
      const [x, y] = dotAt(t), pul = 1 + .12 * Math.sin(t * 4);
      halo(ctx, x, y, 46 * pul, .7 * du, COOL.halo, COOL.core); ctx.fillStyle = rgba(COOL.core, du); ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
      const fu = span(t, A.mach + 2.5, A.mach + 2.8) * (1 - span(t, A.wash + .5, A.wash + .7));
      if (fu > 0) X.doc(ctx, t, x + 34, y - 10, 46 * expoOut(fu), { kind: 'form', u: 1, rot: .1 * Math.sin(t * 2) });
    }
  }

  function stationC(ctx, t) {
    if (t < A.wash - .6 || t > A.sa + 2.2) return;
    const wu = span(t, A.wash + .6, A.wash + 1.4);
    // the draft unrolls (★): drawn first, the window sits on top of its top end
    const ru = span(t, A.howlong - .05, A.howlong + 1.35), L = 3200 * expoOut(ru) * (1 - sineIO(span(t, A.sa - .1, A.sa + 1.3)));
    if (L > 4) {
      B.sheet(ctx, SC.x0 + SC.w / 2, SC.y0 + L / 2 - 20, SC.w, L + 40, { edge: false });
      ctx.save(); ctx.beginPath(); ctx.rect(SC.x0, SC.y0, SC.w, L); ctx.clip();
      B.inkLines(ctx, SC.x0 + 40, SC.y0 + 40, SC.w - 80, Math.ceil(L / 30), 1, { gap: 30, h: 6, col: rgba(PAPER.ink, .45), short: 5 });
      ctx.restore();
      const ry = SC.y0 + L;   // the roll at the end
      ctx.fillStyle = E.lin(ctx, 0, ry - 22, 0, ry + 22, [[0, PAPER.lit], [.5, PAPER.body], [1, PAPER.shade]]); ctx.beginPath(); ctx.roundRect(SC.x0 - 14, ry - 22, SC.w + 28, 44, 22); ctx.fill();
      // you, at the top, your reading line has barely started
      const yu = span(t, A.howlong + .3, A.howlong + 1.1) * (1 - span(t, A.sa - .2, A.sa + .4));
      if (yu > 0) {
        const fx = SC.x0 - 130, fy = SC.y0 + 120;
        X.lightLine(ctx, [[fx - 70, fy], [fx + 70, fy]], yu, { w: 2, a: .6 });
        ctx.save(); ctx.beginPath(); ctx.rect(fx - 200, fy - 400, 400, 400); ctx.clip();
        E.du(ctx, fx, fy + (1 - expoOut(yu)) * 160, 150, { dir: 1, look: .2, armR: [1.85, 1.95], light: .9 });
        ctx.restore();
        const rl = 18 + 10 * span(t, A.howlong + .6, A.sa);
        ctx.fillStyle = rgba(P.coat, .9 * yu); ctx.fillRect(SC.x0 + 40, SC.y0 + 52, rl, 5); halo(ctx, SC.x0 + 40 + rl, SC.y0 + 54, 22, .6 * yu, GOLD.halo, GOLD.core);
      }
    }
    const box = B.chatWin(ctx, t, CW.x, CW.y, CW.w, CW.h, { u: wu, title: 'CHATBOT' });
    if (box && wu > .6) {
      B.option(ctx, box.x0 + box.w - 190, box.y0 + 26, 360, 52, 'DRAFT FEDERAL RULES', { u: span(t, A.wash + 1.0, A.wash + 1.5), size: 22 });
      const tu = span(t, A.wash + 1.7, A.lawyer + 2.8);
      ctx.save(); ctx.globalAlpha *= clamp(tu * 8);
      B.gold(ctx, [['§', 0]], box.x0, box.y0 + 106, 34, clamp(tu * 6), { serif: true, col: COOL.core });
      ctx.restore();
      B.inkLines(ctx, box.x0 + 40, box.y0 + 86, box.w - 60, 8, tu, { gap: 30, h: 6, col: rgba(COOL.core, .55) });
      if (tu > 0 && tu < 1 && Math.sin(t * 14) > 0) { const n = tu * 8, li = Math.floor(n); ctx.fillStyle = COOL.core; ctx.fillRect(box.x0 + 40 + (box.w - 60) * .9 * (n - li), box.y0 + 80 + li * 30, 4, 18); }
    }
    X.label(ctx, 'FEDERAL RULES · DRAFTED BY CHATBOT', CW.x, CW.y - CW.h / 2 - 40, B.lab(t, A.wash + .9, A.howlong - .1), { size: 30, spacing: .12, col: COOL.text });
    // 5.07: the bar beside the text
    const bu = span(t, A.lawyer + .1, A.lawyer + .7) * (1 - span(t, A.sa + .2, A.sa + .9));
    if (bu > 0) {
      B.bar(ctx, BAR.x, BAR.y, BAR.len, 30, sineIO(span(t, A.lawyer + .5, A.twenty + .35)), { track: bu, col: COOL.body, a: clamp(bu * 2) });
      B.big(ctx, SRC.twenty, BAR.x + BAR.len / 2, BAR.y - 44, 72, B.lab(t, A.twenty - .05, A.sa + .4), { gold: .2, col: COOL.core });
    }
  }

  function stationD(ctx, t) {
    if (t < A.sa - .5 || t > b + 6.5) return;
    const inU = expoOut(span(t, A.sa + .25, A.sa + 1.35)), pu = pull(t);
    // the reference list (under the policy until it is pulled back)
    if (pu > 0) {
      B.sheet(ctx, SA.x, SA.y, SA.w, SA.h, { rot: .004 });
      B.gold(ctx, [['REFERENCES', 0]], SA.x - SA.w / 2 + 40, SA.y - SA.h / 2 + 56, 22, 1, { serif: false, weight: 700, spacing: .12, col: mixHex(PAPER.ink, PAPER.faint, .3) });
      for (let i = 0; i < NR; i++) {
        const d = dustU(t, i), w = (SA.w - 80) * (i === NR - 1 ? .62 : .84 - ((i * 29) % 11) / 60);
        if (d <= 0) { ctx.fillStyle = rgba(PAPER.ink, .5); ctx.fillRect(SA.x - SA.w / 2 + 40, refY(i), w, 6); }
        else B.dustLine(ctx, SA.x - SA.w / 2 + 40, refY(i), w, 6, d, 31 + i, rgba(PAPER.ink, .55));
      }
      // 5.11: the cool cursor that wrote it, still blinking at the end
      const cu = span(t, A.likely - .15, A.likely + .3);
      if (cu > 0) { const bl = .55 + .45 * Math.sign(Math.sin(t * 6.5)); const [cx, cy] = curAt(t); halo(ctx, cx, cy, 40, .5 * cu, COOL.halo, COOL.core); ctx.fillStyle = rgba(COOL.body, cu * bl); ctx.fillRect(cx, cy - 22, 5, 30); }
    }
    // the policy, pulled back (up and away to the right, smaller)
    const px = lerp(lerp(5200, SA.x, inU), 4880, pu), py = lerp(SA.y, 420, pu), sc = lerp(1, .5, pu);
    ctx.save(); ctx.translate(px, py); ctx.rotate(.1 * pu + (1 - inU) * .05); ctx.scale(sc, sc);
    if (inU > 0) {
      B.sheet(ctx, 0, 0, SA.w, SA.h);
      ctx.fillStyle = rgba(PAPER.ink, .75); ctx.fillRect(-SA.w / 2 + 40, -SA.h / 2 + 40, SA.w * .55, 12);
      B.inkLines(ctx, -SA.w / 2 + 40, -SA.h / 2 + 90, SA.w - 80, 11, 1, { gap: 32, h: 6 });
    }
    ctx.restore();
    // the empty chair of the checker (with its lamp off)
    const chu = expoOut(span(t, A.likely + .5, A.likely + 1.3));
    if (chu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(CH.x - 200, CH.y - 400, 400, 400); ctx.clip(); ctx.translate(0, (1 - chu) * 220); chair(ctx, CH.x, CH.y); ctx.restore(); }
    const L1 = B.lab(t, A.sa + 1.5, A.ref - .1), L2 = B.lab(t, A.ref + .1, A.likely - .1), L3 = B.lab(t, A.likely + .1, A.soon + .4);
    X.label(ctx, SRC.southAfrica, 4500, 190, L1, { size: 30, spacing: .1 });
    X.label(ctx, 'SOURCES THAT DO NOT EXIST', 4500, 190, L2, { size: 30, spacing: .14 });
    X.label(ctx, SRC.minister, 4500, 190, L3, { size: 30, spacing: .1 });
  }
  function curAt(t) { const w = expoOut(span(t, A.soon + .05, A.soon + .4)); return [lerp(CUR[0], CUR[0] + 60, w), lerp(CUR[1], RACE.y1, w)]; }
  function chair(ctx, x, y) {
    ctx.fillStyle = mixHex(P.night1, P.blue1, .45);
    ctx.fillRect(x - 70, y - 120, 140, 14); ctx.fillRect(x + 52, y - 260, 16, 154); ctx.fillRect(x - 64, y - 106, 12, 106); ctx.fillRect(x + 52, y - 106, 12, 106);
    ctx.fillStyle = rgba(CREAM, .35); ctx.fillRect(x - 70, y - 120, 140, 2);
    B.deskLamp(ctx, x - 150, y, 150, 0);
  }

  function race(ctx, t) {
    if (t < A.soon - .1 || t > b + 6.5) return;
    const [cx, cy] = curAt(t), wh = wHead(t);
    if (wh > 0) {   // WRITING: a cool segment that runs away to the right
      const sx = cx, head = sx + wh, tail = Math.max(sx, head - 1100);
      X.lightLine(ctx, [[tail, RACE.y1], [head, RACE.y1]], 1, { w: 4, col: rgba(COOL.body, .95), glowCol: COOL.halo });
      halo(ctx, head, RACE.y1, 40, .6, COOL.halo, COOL.core);
    }
    X.label(ctx, 'WRITING', 5900, RACE.y1 - 22, B.lab(t, A.soon + .9, b + 1.2) * clamp((cx + wh - 5900) / 200), { size: 26, spacing: .16, col: COOL.text });
    const ch = cHead(t);
    if (t > A.soon + .3) {   // CHECKING: from the empty chair, slow
      const x0 = CH.x + 80, hx = x0 + ch;
      X.lightLine(ctx, [[x0, RACE.y2], [hx, RACE.y2]], 1, { w: 3, a: .85 });
      halo(ctx, hx, RACE.y2, 26, .45, LAMP.body, LAMP.core);
      X.label(ctx, 'CHECKING', hx - 10, RACE.y2 - 20, span(t, A.soon + .9, A.soon + 1.5), { size: 26, spacing: .16, align: 'right' });
    }
  }
  // the hand with the TRUTH link (shared with c07 through handPose)
  function handPose(t) {
    const inn = span(t, A.still - .15, A.still + 1.15), turn = sineIO(span(t, A.still + 1.2, A.still + 2.6));
    return { inn, ang: lerp(-.16, -.06, turn), lAng: lerp(-.55, -.25, turn), lit: .25 + .15 * turn };
  }
  function hand(ctx, t, o = {}) {
    if (t < A.still - .2) return null;
    const p = handPose(t), [hx, hy] = B.handLink(ctx, t, HAND.x, HAND.y, { in: p.inn, out: o.out, ang: p.ang });
    const lx = hx + 70, ly = hy - 22;
    if (!o.noLink) F.chainLink(ctx, t, lx, ly, 150, p.lAng + .02 * Math.sin(t * .9), { lit: p.lit });
    return { lx, ly, L: 150, ang: p.lAng + .02 * Math.sin(t * .9), lit: p.lit };
  }

  // ---------------------------------------------------------------- the take
  function base(ctx, t, o = {}) {
    const { vo, vi } = o.vi ? { vo: B.outer(o.vi), vi: o.vi } : views(t);
    const inside = vo.s > S1 * .98 || t >= g1;
    ground(ctx, t, vo, vi, inside);
    if (!inside) plate(ctx, t, vo);
    X.inView(ctx, vi, () => { stationA(ctx, t); stationB(ctx, t); stationC(ctx, t); stationD(ctx, t); race(ctx, t); });
    return { vo, vi };
  }
  function ground(ctx, t, vo, vi, inside) {
    // the light pool: on LAW during the plate, then on the current station (inner units)
    const k = sineIO(span(t, g0, g1));
    X.board(ctx, t, vo, { lx: lerp(B.LC.x, vo.x, k), ly: lerp(B.LC.y, vo.y - 60 / vo.s, k), grid: 0 });
    B.grid(ctx, inside ? vi : vo, 1);
  }
  function draw(ctx, t) {
    const { vi } = base(ctx, t);
    X.inView(ctx, vi, () => hand(ctx, t));
    B.hud(ctx, t, T, { a: span(t, g0 + 1.0, g1 + .1) });
    F.source(ctx, t, A.nat - .1, A.mach + 2.6, SRC.nativesSrc);
    F.source(ctx, t, A.wash + .3, A.howlong + .3, SRC.dot);
    F.source(ctx, t, A.sa + 1.6, A.soon - .1, SRC.southAfrica);
  }
  return { A, draw, base, hand, views, b, VI };
}

export default async (T, R) => {
  const sc = scene06(T, R);
  return [{ t: R.a, draw: sc.draw, print: PR }];
};
