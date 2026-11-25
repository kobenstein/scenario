// Film 78 · B1 · c05 'Not blindly' → 'But on that same stage' (183.9–253.1 s). Rows 4.01–4.19 (docs/shots.md):
//   4.01 the ? beside the claim card opens into an eye (not blind)
//   4.02 a small building SAFE SUPERINTELLIGENCE; its value bar $32B (REPORTED · APR 2025) hangs on a thread from the claim: IF HE IS RIGHT
//   4.03–4.07 HIS LIFE LINE draws (S.RECORD), markers 1–4 drop; 1 2 HELD (gold), 3 4 OPEN (cream rings); marker 4 gets ? YEARS
//   4.08–4.12 a lens out of marker 1: the teenager at an old computer (AS HE TELLS IT); CAN A COMPUTER LEARN? on its screen;
//        "everything else would follow" (arrows out of the question); three at a workstation, photos → a network → names (TORONTO · 2012);
//        ★ ERROR RATE 15.3 % vs 26.2 % (IMAGENET 2012); the lens closes back into marker 1 (it flares: HELD)
//   4.13–4.18 a lens out of marker 2: the 2014 slide; it becomes the screen on a stage (NEURIPS · VANCOUVER · DEC 2024, arc 2014 → 2024);
//        C1 grows out of the screen; THE RECIPE (BIG NETWORK + BIG DATA); stems GPT-1 2018 · GPT-2 2019 · GPT-3 2020 · CHATGPT 2022;
//        ILYA · CHIEF SCIENTIST, OPENAI; the lens closes back into marker 2 (flare: HELD)
//   4.19 you (yellow) with a phone, a chat bubble; the recipe glows above marker 2, a thread of light from it to your chat
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
import * as S from './f78_world.mjs';
import * as B from './b1_kit.mjs';
import c04f, { GY4, CLAIM } from './b1_c04.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, INK, mv, rise, measure } = F;
const TAU = Math.PI * 2;
const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });

const R0 = S.RECORD, MX = (f) => R0.x0 + (R0.x1 - R0.x0) * f;
export const M1 = { cx: MX(.17), cy: R0.y, r: 26 }, M2 = { cx: MX(.37), cy: R0.y, r: 26 }, M3 = { cx: MX(.66), cy: R0.y, r: 26 }, M4 = { cx: MX(.86), cy: R0.y, r: 26 };
const BLD = { x: 520, w: 330, h: 230 }, BAR = { x: 1190, y: 420, w: 110, h: 320 };
const DESK = { x: 760, y: 700, w: 520 }, CRT = { x: 870, y: 440, w: 310, h: 260 }, SCRN = { x: 898, y: 466, w: 254, h: 186 };
const SLIDE = { x: 330, y: 190, w: 1260, h: 620 }, SCR = { x: 600, y: 130, w: 720, h: 372 }, RCARD = { x: 560, y: 330, w: 800 }, RCARD2 = { x: 610, y: 600, w: 700 };
const STEMS = [['GPT-1', '2018', [520, 330]], ['GPT-2', '2019', [800, 270]], ['GPT-3', '2020', [1120, 270]], ['CHATGPT', '2022', [1440, 340]]];

// ------------------------------------------------------------------------------------------------ pieces
function eye(ctx, t, x, y, w, u) {   // an eye shape: two lids part, a gold iris (not blind)
  u = clamp(u); if (u <= 0) return;
  const op = sineIO(u), hh = w * .32 * op;
  halo(ctx, x, y, w * 1.1, .25 * op, GOLD.halo, GOLD.hot);
  ctx.save(); ctx.lineWidth = 4; ctx.strokeStyle = CREAM; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.quadraticCurveTo(x, y - hh * 2, x + w / 2, y); ctx.quadraticCurveTo(x, y + hh * 2, x - w / 2, y); ctx.closePath();
  ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fill(); ctx.stroke(); ctx.clip();
  const ir = w * .2, lx = E.drift(t, w * .04, 3);
  ctx.fillStyle = rad(ctx, x + lx, y, ir, [[0, GOLD.hot], [.55, GOLD.body], [1, GOLD.mid]]); ctx.beginPath(); ctx.arc(x + lx, y, ir, 0, TAU); ctx.fill();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(x + lx, y, ir * .42, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(GOLD.core, .9); ctx.beginPath(); ctx.arc(x + lx + ir * .3, y - ir * .3, ir * .14, 0, TAU); ctx.fill();
  ctx.restore();
  if (u < 1) { ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.globalAlpha = 1 - op; ctx.stroke(); ctx.globalAlpha = 1; }
}
function building(ctx, t, u) {   // a small plain building with its name sign (no logo)
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), x = BLD.x, w = BLD.w, h = BLD.h, y = GY4 - h + (1 - k) * (h + 20);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 200, 0, w + 400, GY4); ctx.clip();
  halo(ctx, x + w / 2, GY4 - h * .5, w * 1.1, .2 * k, GOLD.halo, GOLD.hot);
  ctx.fillStyle = lin(ctx, 0, y, 0, y + h, [[0, mixHex(P.ind1, P.blue1, .4)], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = rgba(CREAM2, .5); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) { ctx.fillStyle = rgba(GOLD.hot, .2 + .25 * ((r * 5 + c) % 3 === 0 ? 1 : 0) + .05 * Math.sin(t + c)); ctx.fillRect(x + 26 + c * 60, y + 86 + r * 54, 34, 30); }
  ctx.fillStyle = rgba(GOLD.hot, .4); ctx.fillRect(x + w / 2 - 22, y + h - 56, 44, 56);
  ctx.restore();
  B.caps(ctx, F.SOURCES.ssi, x + w / 2, y - 22, 26, span(u, .4, 1), { align: 'center', col: CREAM });
}
function crt(ctx, t, o = {}) {   // the old computer on a desk (boxy monitor, keyboard), a warm desk lamp
  const dy = o.dy ?? 0;
  ctx.save(); ctx.translate(0, dy);
  ctx.fillStyle = mixHex(P.night1, GOLD.deep, .25); ctx.fillRect(DESK.x, DESK.y, DESK.w, 22); ctx.fillRect(DESK.x + 30, DESK.y + 22, 18, GY4 - DESK.y - 22); ctx.fillRect(DESK.x + DESK.w - 48, DESK.y + 22, 18, GY4 - DESK.y - 22);
  ctx.fillStyle = mixHex(P.ind1, PAPER.shade, .3); ctx.beginPath(); ctx.roundRect(CRT.x, CRT.y, CRT.w, CRT.h, 18); ctx.fill();
  ctx.fillStyle = mixHex(P.ind1, PAPER.shade, .22); ctx.fillRect(CRT.x + CRT.w / 2 - 50, CRT.y + CRT.h, 100, DESK.y - CRT.y - CRT.h);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.roundRect(SCRN.x, SCRN.y, SCRN.w, SCRN.h, 14); ctx.fill();
  ctx.fillStyle = rgba(COOL.deep, .55); ctx.beginPath(); ctx.roundRect(SCRN.x, SCRN.y, SCRN.w, SCRN.h, 14); ctx.fill(); halo(ctx, SCRN.x + SCRN.w / 2, SCRN.y + SCRN.h / 2, 330, .42 + .03 * Math.sin(t * 9), COOL.halo, COOL.core);
  ctx.fillStyle = rgba(COOL.body, .08); for (let i = 0; i < 12; i++) ctx.fillRect(SCRN.x + 6, SCRN.y + 8 + i * 15, SCRN.w - 12, 2);   // scan lines
  ctx.fillStyle = mixHex(P.ind1, PAPER.shade, .28); ctx.fillRect(DESK.x + 110, DESK.y - 12, 240, 12);   // keyboard
  B.lamp(ctx, DESK.x + DESK.w - 60, DESK.y - 60, 220, 1);
  ctx.restore();
}
function typed(ctx, t, lines, x, y, size, t0, cps, col) {   // the question typing itself on the old screen (with a cursor)
  let n = Math.max(0, Math.floor((t - t0) * cps)), yy = y;
  for (const ln of lines) {
    const s = ln.slice(0, Math.max(0, n)); n -= ln.length;
    if (s) E.glowText(ctx, s, x, yy, { size, weight: 700, spacing: .06, col, glow: false });
    if (n < 0 && t >= t0) { const cw = measure(s, size, false, 700) + s.length * size * .06; if (Math.sin(t * 9) > 0) { ctx.fillStyle = col; ctx.fillRect(x + cw + 4, yy - size * .8, size * .5, size * .9); } break; }
    yy += size * 1.3;
  }
}
export function photo(ctx, kind, x, y, s, a = 1) {   // a small photo card with a simple pictogram (cat / ship / car)
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = PAPER.lit; ctx.fillRect(-s / 2 - 6, -s * .4 - 6, s + 12, s * .8 + 12);
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .5); ctx.fillRect(-s / 2, -s * .4, s, s * .8);
  ctx.fillStyle = CREAM; const k = s / 100;
  if (kind === 'cat') { ctx.beginPath(); ctx.arc(0, 6 * k, 22 * k, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-20 * k, -4 * k); ctx.lineTo(-16 * k, -26 * k); ctx.lineTo(-4 * k, -14 * k); ctx.moveTo(20 * k, -4 * k); ctx.lineTo(16 * k, -26 * k); ctx.lineTo(4 * k, -14 * k); ctx.fill(); }
  else if (kind === 'ship') { ctx.beginPath(); ctx.moveTo(-32 * k, 8 * k); ctx.lineTo(32 * k, 8 * k); ctx.lineTo(22 * k, 24 * k); ctx.lineTo(-22 * k, 24 * k); ctx.closePath(); ctx.fill(); ctx.fillRect(-2 * k, -28 * k, 4 * k, 36 * k); ctx.beginPath(); ctx.moveTo(2 * k, -26 * k); ctx.lineTo(24 * k, 4 * k); ctx.lineTo(2 * k, 4 * k); ctx.fill(); }
  else { ctx.beginPath(); ctx.roundRect(-34 * k, -2 * k, 68 * k, 20 * k, 6 * k); ctx.fill(); ctx.beginPath(); ctx.roundRect(-18 * k, -18 * k, 36 * k, 18 * k, 6 * k); ctx.fill(); ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.beginPath(); ctx.arc(-18 * k, 20 * k, 8 * k, 0, TAU); ctx.arc(18 * k, 20 * k, 8 * k, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function smallNet(ctx, t, cx, cy, s, u, pulse) {   // a small layered network (gold), u grows it; pulse 0..1 runs through it left → right
  const L = [3, 4, 4, 3], nx = (i) => cx + (i - 1.5) * 110 * s, ny = (i, j) => cy + (j - (L[i] - 1) / 2) * 70 * s;
  for (let i = 0; i < 3; i++) for (let j = 0; j < L[i]; j++) for (let k = 0; k < L[i + 1]; k++) { const f = clamp(u * 4 - i); if (f <= 0) continue; ctx.strokeStyle = rgba(GOLD.line, .3 * f); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(nx(i), ny(i, j)); ctx.lineTo(lerp(nx(i), nx(i + 1), f), lerp(ny(i, j), ny(i + 1, k), f)); ctx.stroke(); }
  for (let i = 0; i < 4; i++) for (let j = 0; j < L[i]; j++) { const f = clamp(u * 4 - i + .5); if (f <= 0) continue; const p = Math.exp(-(((pulse * 5 - 1) - i) ** 2) * 2); halo(ctx, nx(i), ny(i, j), 30 * s, .3 * f * (.4 + p), GOLD.halo, GOLD.core); ctx.fillStyle = mixHex(GOLD.mid, GOLD.core, p); ctx.beginPath(); ctx.arc(nx(i), ny(i, j), 11 * s * f, 0, TAU); ctx.fill(); }
  return { inX: nx(0) - 40 * s, outX: nx(3) + 40 * s };
}
export function audience(ctx, t, u) {   // rows of heads seen from behind (a conference hall)
  u = clamp(u); if (u <= 0) return;
  [[1000, 16, .85], [1050, 14, 1.05], [1105, 12, 1.3]].forEach(([y0, n, s], r) => {
    const k = expoOut(clamp(u * 1.4 - r * .2)), y = y0 + (1 - k) * 200, r0 = prng(40 + r);
    for (let i = 0; i < n; i++) { const x = 960 + (i - (n - 1) / 2) * (1800 / n) + (r0() - .5) * 50; ctx.fillStyle = mixHex(P.night0, P.ind1, .22 + r * .03); ctx.beginPath(); ctx.ellipse(x, y + 52 * s, 50 * s, 34 * s, 0, Math.PI, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x, y, 22 * s, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(COOL.line, .25); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 22 * s, -2.6, -.6); ctx.stroke(); }
  });
}
function slideCard(ctx, t, R, words, o = {}) {   // the 2014 slide (dark slide, cream serif), scaled into R
  const s = R.w / SLIDE.w;
  ctx.save(); ctx.translate(R.x, R.y); ctx.scale(s, s);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(12, 16, SLIDE.w, SLIDE.h);
  ctx.fillStyle = lin(ctx, 0, 0, 0, SLIDE.h, [[0, mixHex(P.ind1, P.blue1, .35)], [1, mixHex(P.night1, P.ind1, .6)]]); ctx.fillRect(0, 0, SLIDE.w, SLIDE.h);
  ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 3; ctx.strokeRect(0, 0, SLIDE.w, SLIDE.h);
  F.dateTag(ctx, 70, 70, 'SLIDE · 2014', o.tag ?? 1);
  const L = ['“If you have a very big data set', 'and you train a very very big neural network,', 'then success is guaranteed.”'];
  L.forEach((ln, i) => F.goldText(ctx, [[ln, i === 2 ? .8 : 0]], SLIDE.w / 2, 260 + i * 88, 58, rise(span(o.text ?? 1, i * .2, .6 + i * .2)), { serif: true, align: 'center', col: CREAM }));
  ctx.restore();
}
// you with a phone, a chat window, a thread of light from the recipe above marker 2 (4.19; c06 keeps it in its outer)
const YOU = { x: 1190, y: 960, h: 260 }, CHAT = { x: 1300, y: 730, w: 430, h: 220 };
export function youChat(ctx, t, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const rc = clamp(o.recipe ?? u), th = clamp(o.thread ?? u), ch = clamp(o.chat ?? u);
  // the recipe glowing above marker 2
  if (rc > 0) { halo(ctx, M2.cx, 390, 300, .35 * rc, GOLD.halo, GOLD.hot); F.recipeCard(ctx, t, M2.cx - 170, 300, 340, { u: rc, head: 'THE RECIPE' }); }
  if (th > 0) { const pts = []; for (let i = 0; i <= 24; i++) { const f = i / 24; pts.push([lerp(M2.cx + 170, CHAT.x, f), lerp(390, CHAT.y + 60, f) - Math.sin(f * Math.PI) * 90]); } F.goldSpan(ctx, pts, 0, sineIO(th), { w: 1.6, spark: th < 1, a: .8 }); }
  // you (yellow), a phone glowing in the hand
  const hands = B.figure(ctx, t, YOU.x, YOU.y, YOU.h, { u, du: true, glow: .3, glowCol: { halo: P.coat, core: P.core1 }, fig: { dir: 1, look: .45, armR: [.9, 1.9] } });
  if (hands) { halo(ctx, hands.R[0], hands.R[1] - 10, 60, .5 * u, COOL.halo, COOL.core); ctx.fillStyle = rgba(COOL.core, .95 * u); ctx.save(); ctx.translate(hands.R[0], hands.R[1] - 14); ctx.rotate(-.3); ctx.beginPath(); ctx.roundRect(-9, -16, 18, 30, 3); ctx.fill(); ctx.restore(); }
  if (ch > 0) F.chatWin(ctx, t, { ...CHAT, y: CHAT.y + (1 - expoOut(ch)) * 40 }, { a: clamp(ch * 2), q: span(ch, .2, .6), question: 'How does this work?', answer: o.answer ?? span(ch, .5, 1) });
}

export default function c05(ctxB) {
  const { T, G } = ctxB, P4 = c04f(ctxB);
  const t0 = G('Not blindly'), tToday = G('Today he runs a company'), tRight = G('being right', 0, tToday);
  const tRecord = G('But he has a record'), tFour = G('Look at four of his predictions'), tHeld = G('Two have held up'), tOpen = G('Two are still open');
  const tLast = G('And the last one comes with a number'), tNumber = G('number', 0, tLast);
  const tFirst = G('The first, as he tells it'), tTeen = G('teenager', 0, tFirst), tQ = G('His question', 0, tTeen), tLearn = G('can a computer learn', 0, tQ);
  const tFelt = G('He felt', 0, tLearn), tEvery = G('everything else would follow', 0, tFelt);
  const tGrad = G('In grad school'), tPhoto = G('photo', 0, tGrad), tBeat = G('It beat every rival');
  const tSecond = G('His second prediction'), tSlide = G('single slide', 0, tSecond), tDecade = G('A decade after he first showed it'), tVan = G('Vancouver', 0, tDecade);
  const clip = T.clip('C1') || { start: 224.46, end: 237.36 }, cs = clip.start, ce = clip.end;
  const tBig = G('Big network, big data'), tBigData = G('big data', 0, tBig), tOut = G('Out of that recipe'), tChatGPT = G('ChatGPT', 0, tOut);
  const tWhen = G('When it came out'), tSci = G('chief scientist', 0, tWhen);
  const tYou = G('Every time you ask a chatbot'), tWork = G('recipe at work', 0, tYou);
  const tEnd = G('But on that same stage');
  const st4 = P4.lineState(t0 - 1e-3);

  const LV = { x: 870, y: 590, s: 1.28 };   // the life-line view
  const keys = [
    [t0 + .9, { x: 1010, y: 500, s: 1.05 }], [tToday + 1.3, { x: 960, y: 520, s: 1.0 }], [tRight + .4, { x: 960, y: 540, s: 1.03 }],
    [tRecord + 1.2, LV], [tOpen + .5, { x: 890, y: 580, s: 1.3 }], [tNumber + .5, { x: 930, y: 570, s: 1.33 }],
    [tFirst + 1.5, { x: 960, y: 540, s: 1.0 }], [tTeen + .5, { x: 940, y: 540, s: 1.03 }], [tLearn + .4, { x: 1025, y: 560, s: 1.3 }],
    [tEvery + .9, { x: 1000, y: 540, s: 1.06 }], [tGrad + 1.4, { x: 960, y: 540, s: 1.0 }], [tPhoto + .4, { x: 980, y: 530, s: 1.03 }],
    [tBeat + 1.0, { x: 1180, y: 480, s: 1.17 }], [tSecond + .6, LV], [tSlide + .5, { x: 960, y: 520, s: 1.0 }],
    [tDecade + 1.6, { x: 960, y: 540, s: .98 }], [cs - 1.2, { x: 960, y: 420, s: 1.05 }], [ce + .9, { x: 960, y: 440, s: 1.04 }],
    [tBig + 1.4, { x: 960, y: 560, s: 1.0 }], [tOut + 1.8, { x: 960, y: 520, s: 1.0 }], [tWhen + 1.0, { x: 1080, y: 480, s: 1.06 }],
    [tSci + 1.0, LV], [tYou + 1.2, { x: 920, y: 640, s: 1.1 }], [tWork + .6, { x: 930, y: 630, s: 1.13 }], [tEnd, { x: 925, y: 625, s: 1.14 }],
  ];

  // the life line's state at t (c06 continues from lifeState(tEnd))
  function lifeState(t) {
    const drop = (i) => span(t, tFour + .1 + i * .22, tFour + .7 + i * .22);
    return {
      u: span(t, tRecord - .1, tRecord + 1.3),
      markers: [
        { f: .17, n: 1, state: 'held', drop: drop(0), fill: span(t, tHeld - .1, tHeld + .7) },
        { f: .37, n: 2, state: 'held', drop: drop(1), fill: span(t, tHeld + .1, tHeld + .9) },
        { f: .66, n: 3, state: 'open', drop: drop(2), fill: span(t, tOpen - .1, tOpen + .6) },
        { f: .86, n: 4, state: 'open', drop: drop(3), fill: span(t, tOpen + .1, tOpen + .8), box: '? YEARS', boxU: span(t, tNumber - .3, tNumber + .4) },
      ],
    };
  }
  const flare = (t) => .9 * Math.exp(-(((t - (tSecond - .05)) / .45) ** 2)) + 0 * t;
  const flare2 = (t) => .9 * Math.exp(-(((t - (tSci + .55)) / .45) ** 2));
  function life(ctx, t, o = {}) {
    const st = lifeState(t);
    if (st.u <= 0) return;
    F.lifeLine(ctx, t, R0.x0, R0.x1, R0.y, { u: st.u, years: R0.years, markers: st.markers });
    const f1 = flare(t), f2 = flare2(t);
    if (f1 > .01) halo(ctx, M1.cx, M1.cy, 160, .6 * f1, GOLD.halo, GOLD.core);
    if (f2 > .01) halo(ctx, M2.cx, M2.cy, 160, .6 * f2, GOLD.halo, GOLD.core);
  }

  // ---------------------------------------------------------------------- the lens scenes (inner layouts, 1920 × 1080 design space)
  const qEv = B.words(T.GW('everything else would follow', 'follow', tFelt));
  qEv[0].w = '“' + qEv[0].w; qEv[qEv.length - 1].w = qEv[qEv.length - 1].w.replace(/[.”"]+$/, '') + '”';
  function first(ctx, t) {   // 4.08–4.12
    const grow = mv(t, tGrad - .2, 1.3);
    B.ground(ctx, GY4, 1);
    // the teenager at the old computer (sinks as the three rise: he grows up)
    if (grow < 1) {
      const dy = expoIn(grow) * 900;
      halo(ctx, 700, GY4 - 200 + dy, 420, .3, GOLD.halo, GOLD.hot); B.topLight(ctx, 640, GY4 + dy, 290, .7, GOLD);
      crt(ctx, t, { dy });
      ctx.save(); ctx.beginPath(); ctx.rect(0, -500, W * 2, GY4 + 500); ctx.clip(); ctx.translate(0, dy);
      B.figure(ctx, t, 640, GY4, 290, { u: 1, du: false, glow: .34, glowCol: GOLD, fig: { dir: 1, look: .2, armR: [.9, 1.3], armL: [.5, 1.1], rim: GOLD.line } });
      ctx.restore();
      ctx.save(); ctx.translate(0, dy);
      typed(ctx, t, ['CAN A COMPUTER', 'LEARN?'], SCRN.x + 22, SCRN.y + 62, 26, tQ + .9, 13, COOL.text);
      // "everything else would follow": arrows out of the question in all directions
      const au = span(t, tEvery - .2, tEvery + 1.0) * (1 - span(t, tGrad - .3, tGrad + .3)), c = [SCRN.x + SCRN.w / 2, SCRN.y + SCRN.h / 2];
      if (au > 0) for (let i = 0; i < 10; i++) { const an = -Math.PI + .25 + i * (Math.PI * 1.5 / 9) - .2, L = 260 + 90 * ((i * 7) % 3); const a0 = [c[0] + Math.cos(an) * 150, c[1] + Math.sin(an) * 120]; B.arrow(ctx, [a0, [c[0] + Math.cos(an) * (150 + L), c[1] + Math.sin(an) * (120 + L)]], span(au, i * .04, .6 + i * .04), { w: 2.4, head: 16 }); }
      ctx.restore();
      F.dateTag(ctx, 150, 150, 'AS HE TELLS IT', span(t, tFirst + 1.6, tFirst + 2.3) * (1 - span(t, tQ + .6, tQ + 1.1)));
      B.spokenQuote(ctx, t, qEv, 960, 190, 58, span(t, tEvery - .4, tEvery + .3) * (1 - span(t, tGrad - .3, tGrad + .2)), { align: 'center', maxW: 1500 });
    }
    // three at a workstation (he and two colleagues): photos → a small network → names
    if (grow > 0) {
      const bars = mv(t, tBeat - .25, 1.0);
      ctx.save(); ctx.beginPath(); ctx.rect(0, -500, W * 2, GY4 + 500); ctx.clip();
      [[240, 0], [380, .12], [520, .24]].forEach(([x, d], i) => B.figure(ctx, t, x, GY4, 300 - i * 6, { u: clamp(grow * 1.3 - d), top: .55, glow: .24, glowCol: GOLD, fig: { dir: 1, look: .3, armR: i === 2 ? [1.2, 1.6] : [.4, .9], rim: i === 0 ? GOLD.line : undefined } }));
      ctx.restore();
      ctx.fillStyle = mixHex(P.night1, GOLD.deep, .25); ctx.fillRect(560, 720, 260, 16);   // the workstation desk
      F.dateTag(ctx, 150, 150, 'TORONTO · 2012', span(t, tGrad + .6, tGrad + 1.3) * (1 - span(t, tSecond - .6, tSecond)));
      const na = 1 - span(bars, 0, .25);
      if (na > 0) {
        ctx.save(); ctx.globalAlpha *= na;
        const pulse = ((t - tGrad - 1.2) / 1.4) % 1, net = smallNet(ctx, t, 1090, 470, 1.35, span(t, tGrad + .4, tGrad + 1.6), pulse < 0 ? 0 : pulse);
        const kinds = ['cat', 'ship', 'car'], names = ['CAT', 'SHIP', 'CAR'];
        kinds.forEach((k, i) => {   // each photo flies in, the name comes out
          const ts = tGrad + 1.4 + i * 1.3, f = span(t, ts, ts + 1.1), yy = 470 + (i - 1) * 130;
          if (f > 0 && f < 1) photo(ctx, k, lerp(680, net.inX, sineIO(f)), lerp(yy, 470, sineIO(f)), lerp(130, 34, sineIO(f)), 1 - span(f, .8, 1));
          B.caps(ctx, names[i], net.outX + 50, yy + 12, 38, span(t, ts + 1.0, ts + 1.5), { g: .6 });
          if (t > ts + 1.0) photo(ctx, k, net.outX + 250, yy, 100, span(t, ts + 1.0, ts + 1.4));
        });
        ctx.restore();
      }
      // ★ the bars: ERROR RATE (lower is better) — theirs 15.3 %, the next best 26.2 %
      if (bars > 0) {
        const x0 = 760, k = 34, rows = [['THEIRS', 15.3, '15.3 %', GOLD, 1], ['NEXT BEST', 26.2, '26.2 %', { halo: CREAM2, body: CREAM2, core: CREAM }, 0]];
        B.caps(ctx, 'ERROR RATE · IMAGENET 2012', x0, 300, 32, span(t, tBeat - .3, tBeat + .3), { col: CREAM });
        B.caps(ctx, 'LOWER IS BETTER', x0, 344, 22, span(t, tBeat, tBeat + .6), { col: CREAM2 });
        rows.forEach(([lab, v, txt, col, gold], i) => {
          const y = 430 + i * 150, g = expoOut(span(t, tBeat + .05 + i * .25, tBeat + .85 + i * .25)), w = v * k * g;
          B.caps(ctx, lab, x0, y - 16, 24, span(t, tBeat + i * .2, tBeat + .5 + i * .2), { col: gold ? GOLD.text : CREAM2 });
          if (gold) halo(ctx, x0 + w / 2, y + 30, w * .7 + 40, .3 * g, GOLD.halo, GOLD.hot);
          ctx.fillStyle = gold ? lin(ctx, x0, 0, x0 + w + 1, 0, [[0, GOLD.mid], [1, GOLD.hot]]) : rgba(CREAM2, .55); ctx.fillRect(x0, y, w, 60);
          F.goldText(ctx, [[txt, gold]], x0 + w + 26, y + 50, 58, rise(span(g, .5, 1)), { serif: true, col: CREAM });
        });
      }
    }
  }
  function second(ctx, t) {   // 4.13–4.18
    const toScr = mv(t, tDecade - .1, 1.6), toCard = mv(t, ce + .6, 1.0), stage = toScr * (1 - mv(t, ce + .5, 1.0));
    // the stage (floor, a small figure at a lectern, the audience), the arc 2014 → 2024
    if (stage > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(stage * 1.5);
      ctx.fillStyle = lin(ctx, 0, 760, 0, 1080, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); ctx.fillRect(-400, 760, W + 800, 600);
      F.goldSpan(ctx, [[-400, 760], [W + 400, 760]], 0, 1, { w: 1.2, spark: false, a: .5 });
      F.lectern(ctx, t, 1420, 760, 210, { spot: .8, rings: 0, rise: stage });
      audience(ctx, t, stage);
      const ar = span(t, tDecade + .5, tDecade + 2.2) * (1 - span(t, cs - 1.2, cs - .7));
      if (ar > 0) {
        const pts = []; for (let i = 0; i <= 40; i++) { const f = i / 40; pts.push([lerp(250, 1670, f), 700 - Math.sin(f * Math.PI) * 680]); }
        F.goldSpan(ctx, pts, 0, sineIO(ar), { w: 1.8, a: .8 });
        F.goldText(ctx, [['2014', .4]], 250, 750, 40, rise(span(ar, 0, .3)), { serif: true, align: 'center' });
        F.goldText(ctx, [['2024', 1]], 1670, 750, 40, rise(span(ar, .8, 1)), { serif: true, align: 'center' });
      }
      F.dateTag(ctx, 150, 150, F.SOURCES.neurips, span(t, tVan - .4, tVan + .3) * (1 - span(t, cs - 1.2, cs - .7)));
      ctx.restore();
    }
    // the slide → the stage screen → (C1 is drawn by the caller) → the recipe card
    const sr = lerpR(SLIDE, SCR, toScr);
    if (toCard < 1) { ctx.save(); ctx.globalAlpha *= 1 - span(toCard, .5, 1); if (toScr > .05) halo(ctx, sr.x + sr.w / 2, sr.y + sr.h / 2, sr.w * .8, .2 * toScr, COOL.halo, COOL.core); slideCard(ctx, t, toCard > 0 ? lerpR(sr, { ...RCARD, h: RCARD.w * .56 }, toCard) : sr, null, { tag: span(t, tSecond + .9, tSecond + 1.6), text: span(t, tSecond + 1.1, tSlide + .3) }); ctx.restore(); }
    // THE RECIPE: BIG NETWORK + BIG DATA; stems GPT-1 … CHATGPT; ILYA · CHIEF SCIENTIST, OPENAI
    if (toCard > .3) {
      const dn = mv(t, tOut - .2, 1.3), x = lerp(RCARD.x, RCARD2.x, dn), y = lerp(RCARD.y, RCARD2.y, dn), w = lerp(RCARD.w, RCARD2.w, dn);
      const rc = F.recipeCard(ctx, t, x, y, w, { u: span(toCard, .3, 1), net: span(t, tBig - .1, tBig + .9), data: span(t, tBigData - .1, tBigData + .8) });
      if (rc) STEMS.forEach(([name, yr, end], i) => {
        const ts = tOut + .6 + i * .7 + (i === 3 ? .4 : 0), su = span(t, ts, ts + .8), top = rc.top;
        if (su <= 0) return;
        const pts = []; for (let k = 0; k <= 20; k++) { const f = k / 20; pts.push([lerp(top[0], end[0], sineIO(f)), lerp(top[1], end[1], f)]); }
        F.goldSpan(ctx, pts, 0, sineIO(su), { w: i === 3 ? 3 : 2, spark: su < 1, a: i === 3 ? 1 : .75 });
        halo(ctx, end[0], end[1], 50, .45 * su, GOLD.halo, GOLD.core);
        B.caps(ctx, name, end[0], end[1] - 52, i === 3 ? 38 : 32, span(su, .6, 1), { align: 'center', g: i === 3 ? 1 : .4 });
        B.caps(ctx, yr, end[0], end[1] - 20, 22, span(su, .7, 1), { align: 'center', col: CREAM2 });
      });
      B.caps(ctx, 'ILYA SUTSKEVER', 1400, 440, 28, span(t, tWhen + .3, tWhen + 1.0), { g: 1 }); B.caps(ctx, 'CHIEF SCIENTIST, OPENAI', 1400, 478, 24, span(t, tWhen + .5, tWhen + 1.2), { col: CREAM });
    }
  }

  const draw = (ctx, t, cam) => {
    if (t < t0 || t >= tEnd) return;
    // ============================================================== 4.01–4.02 · the eye on the claim; the company and its value
    const away = mv(t, tToday - .3, 1.5), sinkAll = mv(t, tRecord - .3, 1.3);
    if (sinkAll < 1) {
      const st = { ...st4 };
      st.line = st4.line * (1 - away); st.lab = st4.lab * (1 - away); st.sun = st4.sun * (1 - away); st.dayA = 1 - span(away, 0, .4); st.man = st4.man * (1 - away);
      st.qA = 1 - span(t, t0 - .05, t0 + .4);
      st.cardDy = lerp(0, 120 - CLAIM.y, away) + expoIn(sinkAll) * -700; st.cardS = lerp(1, .62, away); st.ground = 1 - sinkAll;
      P4.lineWorld(ctx, t, st);
      const ex = lerp(1560, 960 + 300, away), ey = lerp(430, 120 + CLAIM.h / 2 - 28, away) - expoIn(sinkAll) * 700;
      eye(ctx, t, ex, ey, lerp(150, 90, away), span(t, t0 - .1, t0 + .6));
      // IF HE IS RIGHT under the card; the value bar hangs from it on a thread
      const cardB = 120 + CLAIM.h / 2 + CLAIM.h * .62 / 2 - expoIn(sinkAll) * 700;
      B.caps(ctx, 'IF HE IS RIGHT', 960, cardB + 46, 30, span(t, tRight - .5, tRight + .2) * (1 - sinkAll), { align: 'center', g: 1 });
      ctx.save(); ctx.translate(0, expoIn(sinkAll) * 900);
      building(ctx, t, span(t, tToday + .2, tToday + 1.3));
      const bu = span(t, tToday + .9, tToday + 2.0);
      if (bu > 0) {
        const top = [BAR.x + BAR.w / 2, BAR.y], sway = .03 * Math.sin(t * 1.1), k = expoOut(bu), drop = (1 - k) * -200;
        F.goldSpan(ctx, [[960, cardB + 66 + expoIn(sinkAll) * -900], [top[0], top[1] + drop]], 0, 1, { w: 1.4, spark: false, col: { halo: CREAM2, body: CREAM, core: CREAM }, a: .8 * k });
        ctx.save(); ctx.translate(top[0], top[1] + drop); ctx.rotate(sway); ctx.globalAlpha *= clamp(bu * 3);
        halo(ctx, 0, BAR.h / 2, BAR.h * .8, .3, GOLD.halo, GOLD.hot);
        ctx.fillStyle = lin(ctx, 0, 0, 0, BAR.h, [[0, GOLD.hot], [1, GOLD.mid]]); ctx.fillRect(-BAR.w / 2, 0, BAR.w, BAR.h);
        F.goldText(ctx, [['$32B', 1]], BAR.w / 2 + 26, BAR.h * .45, 66, rise(span(bu, .3, .9)), { serif: true });
        B.caps(ctx, 'REPORTED VALUE · APR 2025', BAR.w / 2 + 26, BAR.h * .45 + 46, 22, span(bu, .5, 1), { col: CREAM2 });
        ctx.restore();
      }
      ctx.restore();
    }
    // ============================================================== 4.03–4.07 · HIS LIFE LINE; 4.08–4.18 the lenses out of markers 1 and 2
    const in1 = span(t, tFirst - .3, tFirst + 1.9), out1 = span(t, tSecond - 1.5, tSecond - .05);
    const in2 = span(t, tSecond + .1, tSecond + 2.0), out2 = span(t, tSci - .6, tSci + 1.0);
    const outer = (c) => life(c, t);
    if (in1 <= 0 || (out1 >= 1 && in2 <= 0) || out2 >= 1) life(ctx, t);
    else if (out1 < 1) B.fly(ctx, t, cam, M1, out1 > 0 ? 1 - out1 : in1, outer, (c) => first(c, t), { edgeCol: GOLD.line, zoom: false });
    else B.fly(ctx, t, cam, M2, out2 > 0 ? 1 - out2 : in2, outer, (c) => second(c, t), { edgeCol: GOLD.line, zoom: false });
    // C1 grows out of the stage screen and goes back into it
    const m = span(t, cs - 1.8, cs) * (1 - span(t, ce, ce + 1.9));
    if (m > 0) { ctx.save(); ctx.globalAlpha *= sineIO(span(m, 0, .25)); F.clipPlate(ctx, t, T, 'C1', { from: S.rectToScreen(cam, SCR), morph: m, dark: 1 - sineIO(span(m, 0, .55)) }); ctx.restore(); }
    // ============================================================== 4.19 · you, a chat, the recipe at work
    const yu = span(t, tYou - .3, tYou + 1.0);
    if (yu > 0) youChat(ctx, t, yu, { recipe: span(t, tYou - .1, tYou + .9), chat: span(t, tYou + .5, tYou + 1.6), thread: span(t, tWork - .6, tWork + .5) });
  };
  return { keys, draw, life, lifeState, youChat, times: { tEnd, tYou, tWork } };
}
