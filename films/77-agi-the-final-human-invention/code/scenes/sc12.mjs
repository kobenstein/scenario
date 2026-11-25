// c12 · B3 · what stays with us · the harvest · subscribe 2 · END SCREEN. "And if the machine does the inventing" → the end (T.duration).
// Plan: docs/shots.md 6.01–6.23, A.01–A.04, E.01. One entry. It starts inside sc11's hall (6.01: you under the small board, the question)
// and continues its world to the right under one camera (F.lookPath on phrases): the DISCOVERY row lifts off as the #1196 card → past a
// professor → into Liam Price's window → into his laptop → the sheet over two desks → the title page → three signs → your compass → the
// needle points up the frame to THE BOARD big (anchor 6.16) → ★ 6.22 it grows into the frame-0 list HUMAN INVENTIONS, the last row glows
// → a hand writes HOW TO STEER IT → many hands, many figures → subscribe on the board's frame → the quiet walk → the END SCREEN (the
// board left, the ring behind it, right half and lower band FREE for the YouTube elements: the same layout as S.endScreen).
//
// | ID   | anchor (phrase)             | motif                                                                                   | type | carrier → next |
// |------|-----------------------------|-----------------------------------------------------------------------------------------|------|----------------|
// | 6.01 | And if the machine does     | (sc11) you alone under the small board · WHAT ELSE IS LEFT FOR US?                       | MIX  | the DISCOVERY row |
// | 6.02 | This spring, another        | the row lifts off and flips into a card: ERDŐS PROBLEM #1196 · OPEN ABOUT 60 YEARS · SOLVED APRIL 2026 | EXPL | the card |
// | 6.03 | Not to a professor          | the card passes a professor (gown, cap): NOT A PROFESSOR                                 | MIX  | the card       |
// | 6.04 | To Liam Price               | a house at night, a window: a young man at a laptop · LIAM PRICE, 23 · NO ADVANCED TRAINING IN MATHEMATICS | SCENE | the laptop |
// | 6.05 | He typed a single question  | into the screen: one line in the input field, a gold ?, it posts · MODEL: GPT-5.4 PRO   | MIX  | the sheet      |
// | 6.06 | Then two mathematicians     | the sheet travels over two desks and gets shorter · CHECKED AND SHORTENED BY JARED LICHTMAN AND TERENCE TAO | MIX | the sheet |
// | 6.07 | One of them was Terence Tao | TAO lights on the second desk                                                           | EXPL | the sheet      |
// | 6.08 | Today, Price is his         | a title page, eight names, three light: TAO · LICHTMAN · PRICE · 8 AUTHORS · CO-AUTHOR  | EXPL | the page       |
// | 6.09 | The machine found the way   | the page folds into three signs; the middle (a path, cool) lights first                 | EXPL | the path       |
// | 6.10 | A person chose the question | left sign: a ? held up by a person                                                       | MIX  | the ?          |
// | 6.11 | And people checked          | right sign: a tick held up by people                                                     | MIX  | the ?          |
// | 6.12 | Maybe that is what stays    | you walk in; the ? flies into your hands and becomes a compass: WHAT STAYS WITH US      | MIX  | the compass    |
// | 6.13 | Not the answers             | ANSWERS drift off the compass                                                            | MIX  | the ?          |
// | 6.14 | The questions               | the ? stays lit in its centre: THE QUESTIONS                                             | MIX  | the needle     |
// | 6.15 | And the direction           | the needle swings and settles, pointing up: THE DIRECTION                                | MIX  | the needle → the board |
// | 6.16 | So what will A.G.I. invent  | ANCHOR: the camera climbs the needle's line to THE BOARD big, the ring behind; the hook's question over it | EXPL | the rows (A) |
// | 6.17 | Three lines on your list    | the three gold rows pulse: THREE LINES                                                   | EXPL | the rows       |
// | 6.18 | Not in your home yet        | a small dashed house beside them: NOT IN YOUR HOME YET                                   | EXPL | the house      |
// | 6.19 | But begun                   | three gold ticks: BEGUN                                                                  | EXPL | row 4          |
// | 6.20 | The fourth line is still    | row 4 flaps empty (cream), the stylus lies in front of it                                | EXPL | the stylus     |
// | 6.21 | And it is ours to write     | OURS TO WRITE                                                                            | EXPL | the board      |
// | 6.22 | The final human invention   | ★ the board grows up into the frame-0 list HUMAN INVENTIONS, the last row glows gold, the ring grows; pull back · THE ONE THAT INVENTS EVERYTHING ELSE | EXPL | the last row |
// | 6.23 | And the last thing          | a human hand takes the stylus and writes HOW TO STEER IT into the row in gold            | EXPL | the written row|
// | A.01 | That line needs many hands  | many hands with lights rise to the row                                                    | SCENE| the hands      |
// | A.02 | This channel exists         | the lights pass into many small figures before the board                                 | SCENE| the figures    |
// | A.03 | Want that too?              | you look up                                                                              | SCENE| you            |
// | A.04 | Then subscribe              | a lit SUBSCRIBE button on the board's frame, pressed once                                | MIX  | the board      |
// | —    | (quiet walk, no voice)      | the list folds back to THE FOUR LINES, the figures step back, you walk off; the camera settles left | WELT | the board |
// | E.01 | T.duration − 15             | END SCREEN: board left (three gold rows, HOW TO STEER IT), the ring breathes behind it; right half + lower band free, no text but the board | WELT | — |
import * as F from '../lib/f77_kit.mjs';
import * as S from '../lib/f77_seams.mjs';
import * as X from '../lib/b3_extra.mjs';
import { build11 } from './sc11.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rise, GOLD, CREAM, COOL, PAPER } = F;

export const PRINT = F.PRINT77;
export default async (T, R) => [{ t: R.a, draw: build12(T).draw, print: PRINT }];

// ------------------------------------------------------------------------------------------------ layout (world = the hall's coordinates)
const FLOOR = 900;
const CARD = { cx: 2200, cy: 440, w: 640, h: 340 };
const PROF = { x: 2880, h: 330 };
const HOUSE = { cx: 3720, win: { x: 3440, y: 380, w: 560, h: 380 } };
const LAP = { x: 3800, y: 690, s: 150 };
const LIAM = { x: 3640, floor: 860, h: 300 };
const DESK = [{ x: 4400, name: 'LICHTMAN' }, { x: 4950, name: 'TAO' }];
const PAGE = { cx: 5450, cy: 470, w: 560, h: 420 };
const SIGNS = [[5150, 450, '?'], [5450, 450, 'path'], [5750, 450, 'tick']], SR = 86;
const YOU = { x: 5450, h: 240 };
const BB = { x: 5120, y: 60, w: 660, rowH: 92, head: 112 };   // THE BOARD (four rows; the end-screen board in world space)
const ROW4Y = BB.y + BB.head + 3 * BB.rowH;
const RINGE = [BB.x + BB.w / 2, BB.y + 2 * BB.rowH + 40], RINGR = 330;   // = S.endScreen's ring
const ENDCAM = [BB.x - S.END.x + W / 2, BB.y - S.END.y + H / 2];       // the camera that puts the board at S.END (identity scale)
const AUTHORS = ['ALEXEEV', 'BARRETO', 'LI', 'LICHTMAN', 'PRICE', 'SHAH', 'TANG', 'TAO'], LIT3 = ['LICHTMAN', 'PRICE', 'TAO'];
const CROWD = [[4700, 196], [4830, 182], [4960, 204], [5090, 186], [5220, 176], [5680, 190], [5810, 178], [5940, 200], [6070, 184], [6200, 172], [4580, 168], [6330, 166]];

export function build12(T) {
  const s11 = build11(T);
  const G = (p, after) => T.G(p, 0, after), GE = (p, after) => T.GE(p, 0, after);
  const a = { ...s11.a };
  a.fell = G('problems fell', a.spring); a.sixty = G('sixty years', a.spring);
  a.prof = G('Not to a professor', a.spring);
  a.liam = G('To Liam Price', a.prof); a.noadv = G('no advanced training', a.liam);
  a.typed = G('He typed a single', a.liam); a.chat = G('into ChatGPT', a.typed); a.posted = G('posted the answer', a.typed);
  a.two = G('Then two mathematicians', a.typed); a.shorter = G('made it shorter', a.two);
  a.tao = G('One of them was', a.two); a.coauth = G('Today, Price is', a.tao); a.co = G('co-author', a.coauth);
  a.way = G('The machine found the way', a.coauth); a.person = G('A person chose', a.way); a.checked = G('And people checked', a.way);
  a.stays = G('Maybe that is what stays', a.checked); a.answers = G('Not the answers', a.stays); a.questions = G('The questions', a.answers); a.direction = G('And the direction', a.questions);
  a.what = G('So what will A.G.I.', a.direction); a.whatW = F.wordTimes(T, 'So what will A.G.I. invent for you', null, a.what - .1);
  a.three = G('Three lines on your list', a.what); a.home = G('Not in your home yet', a.three); a.begun = G('But begun', a.home);
  a.fourth = G('The fourth line is still', a.begun); a.ours = G('And it is ours to write', a.fourth);
  a.final = G('The final human invention is the one', a.ours); a.finalW = F.wordTimes(T, 'the one that invents everything else', null, a.final);
  a.last = G('And the last thing we have', a.final); a.steer = G('how to steer it', a.last); a.steerE = GE('how to steer it', a.last);
  a.hands = G('That line needs many hands', a.last); a.channel = G('This channel exists', a.hands); a.well = G('goes well for everybody', a.channel);
  a.want = G('Want that too', a.channel); a.sub = G('Then subscribe', a.want); a.subE = GE('Then subscribe', a.want);
  a.end0 = T.duration - 15;
  return scene(a, T, s11);
}

function scene(a, T, s11) {
  const tH = a.spring - .15;                     // from here sc12 draws (its camera starts where sc11's camera is)
  const cH = s11.cam(tH), cE11 = F.lookPath(s11.K[s11.K.length - 1][0], s11.K);
  const K = [
    [tH, cH.cx, cH.cy, cH.z], [a.spring + 1.5, 2180, 460, 1.0], [a.sixty + .5, 2220, 465, 1.03], [a.prof, 2300, 470, 1.0], [a.prof + 1.1, 2840, 560, .88],
    [a.liam + .1, 3250, 560, .98], [a.liam + 1.0, 3720, 565, 1.22], [a.typed - .1, 3740, 575, 1.3], [a.typed + 1.3, LAP.x, LAP.y - 62, 6.2], [a.posted + .3, LAP.x, LAP.y - 66, 6.6],
    [a.two + .2, 3950, 640, 2.6], [a.two + 1.4, 4420, 650, .98], [a.shorter + .3, 4680, 650, .98], [a.tao + .6, 4900, 645, 1.02], [a.coauth + .7, PAGE.cx, 500, 1.0],
    [a.way - .05, PAGE.cx, 505, 1.0], [a.way + .7, PAGE.cx, 560, .9], [a.checked + .9, PAGE.cx + 20, 570, .9], [a.stays + 1.1, YOU.x, 720, 1.45], [a.direction + .15, YOU.x, 715, 1.5],
    [a.what + .45, YOU.x, 470, .92], [a.three + .5, 5490, 470, .93], [a.begun + .5, 5520, 475, .95], [a.fourth + .6, 5470, 482, .98], [a.ours + 1, 5470, 486, 1.0],
    [a.final + 1.7, 4741, 192, .55], [a.finalW ? a.finalW[a.finalW.length - 1] + .5 : a.final + 3.3, 4760, 200, .56], [a.last + 1.4, 5450, 490, 1.05], [a.steerE + .6, 5450, 505, 1.08],
    [a.hands + 1.2, 5450, 590, .95], [a.channel + 1.8, 5450, 460, .62], [a.want + .4, 5440, 480, .64], [a.subE + .3, 5560, 420, .7], [a.end0, ENDCAM[0], ENDCAM[1], 1],
  ];
  const cam = (t) => (t >= a.end0 ? { cx: ENDCAM[0], cy: ENDCAM[1], z: 1 + .004 * (t - a.end0) } : F.lookPath(t, K));
  const io = (t, i0, o0, d = .45) => span(t, i0, i0 + .6) * (1 - span(t, o0, o0 + d));
  const glowAt = (t) => { const g0 = [960, 420, 1000, .5 + .05 * Math.sin(t * 1.3)], g1 = [440, 470, 900, S.breathe(t, .7)], k = smooth(span(t, a.subE, a.end0)); return g0.map((v, i) => lerp(v, g1[i], k)); };

  // ---------------------------------------------------------------- 6.02 the card (out of the DISCOVERY row), 6.03 past the professor, into the laptop
  const MB = s11.MB, rowR = { x: MB.x + 20 * MB.s, y: MB.y + (112 + 2 * 78) * MB.s, w: 560 * MB.s, h: 78 * MB.s };
  const lapScr = { x: LAP.x - LAP.s / 2, y: LAP.y - LAP.s * .64 - 8, w: LAP.s, h: LAP.s * .64 };
  const cardRect = (t) => {   // { cx, cy, w, h, flip (-1..1 scaleX), front } or null
    if (t < a.spring) return null;
    const p = quartIO(span(t, a.spring, a.spring + 1.3)), fl = Math.PI * smooth(span(p, .15, .85));
    let cx = lerp(rowR.x + rowR.w / 2, CARD.cx, p), cy = lerp(rowR.y + rowR.h / 2, CARD.cy, p) - Math.sin(Math.PI * p) * 120, w = lerp(rowR.w, CARD.w, p), h = lerp(rowR.h, CARD.h, p);
    // 6.03: it shrinks and slides right past the professor's head; 6.04: into the laptop screen
    const q = sineIO(span(t, a.prof - .1, a.prof + 1.2)), r = quartIO(span(t, a.liam - .15, a.liam + 1.1));
    cx = lerp(cx, 3150, q); cy = lerp(cy, 470, q) - Math.sin(Math.PI * q) * 60; w = lerp(w, 300, q); h = lerp(h, 160, q);
    cx = lerp(cx, lapScr.x + lapScr.w / 2, r); cy = lerp(cy, lapScr.y + lapScr.h / 2, r); w = lerp(w, lapScr.w, r); h = lerp(h, lapScr.h, r);
    return { cx, cy, w, h, sx: Math.cos(fl), into: r };
  };
  const drawCard = (ctx, t) => {
    const c = cardRect(t); if (!c || c.into >= 1) return;
    const sx = Math.max(.02, Math.abs(c.sx)), front = c.sx < 0;
    ctx.save(); ctx.translate(c.cx, c.cy); ctx.scale(sx, 1); ctx.translate(-c.w / 2, -c.h / 2);
    if (!front) {   // the back: still the gold DISCOVERY row
      F.boardRow(ctx, t, 0, 0, c.w, c.h, { text: 'DISCOVERY', status: 'BEGUN', gold: 1, lit: .6 }, { cells: 14 });
    } else {
      const k = c.w / CARD.w;
      ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(8, 12, c.w, c.h, 12 * k); ctx.fill();
      ctx.fillStyle = F.lin(ctx, 0, 0, c.w, c.h, [[0, mixHex(P.night1, P.ind2, .65)], [1, mixHex(P.night0, P.ind1, .5)]]); ctx.beginPath(); ctx.roundRect(0, 0, c.w, c.h, 12 * k); ctx.fill();
      ctx.strokeStyle = mixHex(GOLD.line, CREAM, .2); ctx.lineWidth = 2.5; ctx.stroke();
      const fade = 1 - span(c.into, .1, .6); if (fade > 0) {
        ctx.save(); ctx.globalAlpha *= fade; ctx.scale(k, k);
        F.capsLabel(ctx, 'ERDŐS PROBLEM', 44, 70, span(t, a.spring + .55, a.spring + 1.1), { size: 24, align: 'left', col: GOLD.text });
        F.goldText(ctx, [['#1196', 1]], 40, 176, 104, rise(span(t, a.spring + .65, a.spring + 1.3)), { serif: true });
        // the time bar: dashed cream (open) … the gold dot at its end (solved)
        const bu = smooth(span(t, a.sixty - .5, a.sixty + .5)), y = 248;
        ctx.save(); ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 3; ctx.setLineDash([12, 9]); ctx.beginPath(); ctx.moveTo(44, y); ctx.lineTo(44 + 470 * bu, y); ctx.stroke(); ctx.restore();
        F.capsLabel(ctx, 'OPEN ABOUT 60 YEARS', 44, y + 44, span(t, a.sixty - .2, a.sixty + .5), { size: 22, align: 'left', col: CREAM });
        const gu = expoOut(span(t, a.sixty + .5, a.sixty + 1)); if (gu > 0) { F.halo(ctx, 530, y, 60, .8 * gu, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.arc(530, y, 11 * gu, 0, 6.29); ctx.fill(); }
        F.capsLabel(ctx, 'SOLVED APRIL 2026', 596, y + 44, span(t, a.sixty + .6, a.sixty + 1.2), { size: 22, align: 'right', col: GOLD.text });
        ctx.restore();
      }
    }
    ctx.restore();
  };
  const drawProf = (ctx, t) => {
    if (t < a.prof - 1 || t > a.liam + 2) return;
    const u = expoOut(span(t, a.prof - .5, a.prof + .3)) * (1 - sineIO(span(t, a.liam + .3, a.liam + 1.3)));
    ctx.save(); ctx.beginPath(); ctx.rect(PROF.x - 400, FLOOR - 600, 800, 602); ctx.clip(); ctx.translate(0, (1 - u) * PROF.h * 1.1);
    X.professor(ctx, t, PROF.x, FLOOR, PROF.h, { dir: -1, look: lerp(.2, .9, Math.sin(Math.PI * span(t, a.prof - .1, a.prof + 1.2))) });
    ctx.restore();
  };
  const drawHouse = (ctx, t) => {
    if (t < a.prof || t > a.two + 2.5) return;
    const u = smooth(span(t, a.prof + .3, a.liam + .4)), Wn = HOUSE.win;
    ctx.save(); ctx.globalAlpha *= u;
    // the facade (a house at night), a roof line
    ctx.fillStyle = F.lin(ctx, 0, 160, 0, FLOOR, [[0, mixHex(P.ind1, P.blue1, .25)], [1, mixHex(P.night1, P.ind1, .4)]]); ctx.fillRect(HOUSE.cx - 460, 200, 920, FLOOR - 200);
    F.outline(ctx, [[[HOUSE.cx - 520, 210], [HOUSE.cx, -40], [HOUSE.cx + 520, 210]]], u, { w: 3, a: .8 });
    ctx.restore();
    // the window: inside, the room lit only by the laptop
    ctx.save(); ctx.beginPath(); ctx.roundRect(Wn.x, Wn.y, Wn.w, Wn.h, 6); ctx.clip();
    ctx.fillStyle = mixHex(P.night0, P.ind0, .35); ctx.fillRect(Wn.x, Wn.y, Wn.w, Wn.h);
    const on = smooth(span(t, a.liam - .2, a.liam + .9));
    F.person(ctx, LIAM.x, LIAM.floor, LIAM.h, { dir: 1, lean: .12, look: -.25, armR: [1.05, 1.5], armL: [.85, 1.35], light: .4 + .6 * on, rim: mixHex(P.blue0, COOL.line, on) });
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .45); ctx.fillRect(LAP.x - 190, LAP.y, 330, 12); ctx.fillRect(LAP.x + 100, LAP.y, 10, 200);
    X.laptop(ctx, t, LAP.x, LAP.y, LAP.s, { screen: on });
    drawScreenUI(ctx, t);
    ctx.restore();
    ctx.save(); ctx.globalAlpha *= u; ctx.strokeStyle = mixHex(P.blue1, P.cream, .35); ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(Wn.x, Wn.y, Wn.w, Wn.h, 6); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(Wn.x + Wn.w / 2, Wn.y); ctx.lineTo(Wn.x + Wn.w / 2, Wn.y + Wn.h * .18); ctx.stroke(); ctx.restore();
  };
  // 6.05 inside the screen: one line, a ?, it posts (world units inside the laptop screen; the camera is at ~6×)
  const drawScreenUI = (ctx, t) => {
    if (t < a.typed - .4) return; const s = lapScr, u = smooth(span(t, a.typed - .3, a.typed + .4));
    ctx.save(); ctx.beginPath(); ctx.rect(s.x, s.y, s.w, s.h); ctx.clip(); ctx.globalAlpha *= u;
    const fx = s.x + 12, fy = s.y + s.h - 26, fw = s.w - 24, fh = 15;
    ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.roundRect(fx, fy, fw, fh, 7); ctx.fill(); ctx.strokeStyle = rgba(COOL.core, .8); ctx.lineWidth = .6; ctx.stroke();
    const ty = span(t, a.typed + .25, a.chat + .2), posted = span(t, a.posted - .1, a.posted + .5), n = 9;
    for (let i = 0; i < n; i++) { const k = span(ty, i / n, (i + 1) / n); if (k <= 0) continue; ctx.fillStyle = rgba(CREAM, .85 * (1 - posted)); ctx.fillRect(fx + 5 + i * 10.5, fy + 5, 8.5 * k, 5); }
    if (ty >= 1) F.glowText(ctx, '?', fx + 5 + n * 10.5 + 1, fy + 11.5, { size: 11, serif: true, col: GOLD.body, glow: true, a: 1 - posted });
    // the caret blinks until it posts
    if (ty < 1 && Math.sin(t * 12) > 0) { ctx.fillStyle = CREAM; ctx.fillRect(fx + 5 + n * 10.5 * ty, fy + 3.5, .8, 8); }
    ctx.restore();
  };
  // ---------------------------------------------------------------- 6.05–6.08 the sheet: posts, over two desks (shorter), the title page
  const sheetAt = (t) => {
    const t0 = a.posted - .05; if (t < t0) return null;
    const p0 = [lapScr.x + lapScr.w / 2, lapScr.y + lapScr.h / 2 - 6], d1 = [DESK[0].x, 640], d2 = [DESK[1].x, 640];
    const e = smooth(span(t, t0, a.posted + .9)), up = [p0[0], p0[1] - 34 * e];
    let x = up[0], y = up[1], w = lerp(22, 30, e), h = lerp(0, 40, e);
    const f1 = quartIO(span(t, a.two - .1, a.two + 1.2)); x = lerp(x, d1[0], f1); y = lerp(y, d1[1], f1) - Math.sin(Math.PI * f1) * 120; w = lerp(w, 120, f1); h = lerp(h, 160, f1);
    const s1 = sineIO(span(t, a.two + 1.3, a.two + 2.1)); h = lerp(h, 118, s1);
    const f2 = quartIO(span(t, a.shorter - .05, a.shorter + .9)); x = lerp(x, d2[0], f2); y -= Math.sin(Math.PI * f2) * 80;
    const s2 = sineIO(span(t, a.shorter + .9, a.tao + .2)); h = lerp(h, 82, s2);
    const f3 = quartIO(span(t, a.coauth - .25, a.coauth + .75)); x = lerp(x, PAGE.cx, f3); y = lerp(y, PAGE.cy, f3); w = lerp(w, PAGE.w, f3); h = lerp(h, PAGE.h, f3);
    return { x, y, w, h, page: f3, lines: Math.round(lerp(lerp(lerp(9, 6, s1), 4, s2), 0, f3)) };
  };
  const pageGone = (t) => quartIO(span(t, a.way - .1, a.way + .7));
  const drawSheet = (ctx, t) => {
    const s = sheetAt(t); if (!s || pageGone(t) >= 1) return;
    const g = pageGone(t), w = lerp(s.w, SR * 2, g), h = lerp(s.h, SR * 2, g), cx = s.x, cy = s.y;
    ctx.save(); ctx.globalAlpha *= 1 - span(g, .7, 1);
    ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(cx - w / 2 + 6, cy - h / 2 + 8, w, h, lerp(4, SR, g)); ctx.fill();
    ctx.fillStyle = F.lin(ctx, cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, lerp(4, SR, g)); ctx.fill();
    ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 1.5; ctx.stroke();
    // the proof's lines (they go when it gets shorter); a gold tick after the second desk
    const L = s.lines; ctx.fillStyle = rgba(PAPER.faint, .8); for (let i = 0; i < L; i++) ctx.fillRect(cx - w / 2 + w * .12, cy - h / 2 + 14 + i * (h - 26) / Math.max(1, L), w * (.62 + .2 * ((i * 7) % 3) / 2), Math.max(1.5, h * .02));
    const tk = smooth(span(t, a.tao - .3, a.tao + .4)) * (1 - s.page); if (tk > 0) F.goldSpan(ctx, [[cx + w * .18, cy + h * .22], [cx + w * .26, cy + h * .32], [cx + w * .42, cy + h * .08]], 0, tk, { w: 3, spark: false });
    ctx.restore();
    if (s.page > .5 && g < .6) drawTitlePage(ctx, t, cx, cy, w, h, span(s.page, .5, 1) * (1 - span(g, 0, .3)));
  };
  const drawTitlePage = (ctx, t, cx, cy, w, h, u) => {
    if (u <= 0) return; const x0 = cx - w / 2, y0 = cy - h / 2;
    ctx.save(); ctx.globalAlpha *= u;
    ctx.fillStyle = rgba(PAPER.ink, .75); ctx.fillRect(cx - w * .34, y0 + h * .1, w * .68, 14); ctx.fillRect(cx - w * .26, y0 + h * .1 + 26, w * .52, 14);   // the title (bars)
    ctx.restore();
    AUTHORS.forEach((nm, i) => {
      const col = i % 2, row = Math.floor(i / 2), x = cx + (col ? w * .22 : -w * .22), y = y0 + h * .4 + row * h * .13;
      const lit = LIT3.includes(nm) ? smooth(span(t, a.co - .3 + LIT3.indexOf(nm) * .12, a.co + .2 + LIT3.indexOf(nm) * .12)) : 0;
      if (lit > 0) F.halo(ctx, x, y - 8, 90, .5 * lit, GOLD.halo, GOLD.core);
      F.maskLine(ctx, [[nm, 0]], x, y, 26, rise(span(u, .2 + i * .05, .7 + i * .05)), { serif: false, weight: 700, col: mixHex(PAPER.ink, GOLD.deep, lit), glow: false, align: 'center' });
    });
  };
  const drawDesks = (ctx, t) => {
    if (t < a.two - .6 || t > a.way + 1.2) return;
    const out = sineIO(span(t, a.coauth + .3, a.coauth + 1.4));
    ctx.save(); ctx.beginPath(); ctx.rect(4000, 0, 1400, FLOOR + 2); ctx.clip();
    DESK.forEach((d, i) => {
      const u = expoOut(span(t, a.two - .4 + i * .3, a.two + .5 + i * .3)), sk = (1 - u) + out; if (sk >= 1) return;
      ctx.save(); ctx.translate(0, sk * 360);
      const lamp = i === 1 ? smooth(span(t, a.tao - .1, a.tao + .4)) : 0;
      F.person(ctx, d.x - 80, FLOOR, 250, { dir: 1, lean: .1, look: -.3, armR: [1.2, 1.6], armL: [.9, 1.4], light: .5 + .5 * lamp, rim: mixHex(P.blue0, GOLD.line, lamp) });
      X.desk(ctx, d.x, FLOOR, 240, 92);
      if (lamp > 0) F.halo(ctx, d.x + 60, FLOOR - 140, 200, .6 * lamp, GOLD.halo, GOLD.core);
      ctx.restore();
    });
    ctx.restore();
  };
  // ---------------------------------------------------------------- 6.09–6.15 three signs; you and the compass
  const signU = (i, t) => (i === 1 ? expoOut(span(t, a.way + .1, a.way + .7)) : expoOut(span(t, a.way + .35, a.way + .95)));
  const signsOut = (t) => sineIO(span(t, a.stays + .1, a.stays + 1.2));
  const holdP = (i, t) => { if (i === 0) return expoOut(span(t, a.person - .2, a.person + .5)); if (i === 2) return expoOut(span(t, a.checked - .2, a.checked + .5)); return 0; };
  const qFly = (t) => quartIO(span(t, a.stays + .2, a.stays + 1.3));
  const compassAt = (t) => { const hy = FLOOR - YOU.h * .5; return [YOU.x + 52, hy - 12]; };
  const drawSigns = (ctx, t) => {
    if (t < a.way || t > a.answers + 1) return;
    const out = signsOut(t);
    ctx.save(); ctx.beginPath(); ctx.rect(4600, -400, 1700, FLOOR + 402); ctx.clip();
    SIGNS.forEach(([x, y, kind], i) => {
      const u = signU(i, t); if (u <= 0) return; const hp = holdP(i, t);
      // holders rise under the side signs and lift them a little
      const lift = 40 * hp;
      if (i !== 1 && hp > 0) { const xs = i === 0 ? [x] : [x - 46, x + 50]; xs.forEach((px, k) => { ctx.save(); ctx.translate(0, (1 - hp) * 300 + out * 360); F.person(ctx, px, FLOOR, 250 - k * 14, { dir: i === 0 ? 1 : -1, look: .6, armR: [2.75, 2.95], armL: [-.2, -.1], light: .6 }); ctx.restore(); }); }
      if (i === 0 && qFly(t) > 0) return;   // the ? has flown into your hands
      const lit = i === 1 ? smooth(span(t, a.way + .35, a.way + .9)) : smooth(span(t, i === 0 ? a.person : a.checked, (i === 0 ? a.person : a.checked) + .5));
      X.sign(ctx, t, kind, x, y - lift + out * 400, SR, { u, lit });
    });
    ctx.restore();
    // the ? flies from the left sign into your hands (it becomes the compass's centre)
    const q = qFly(t); if (q > 0 && q < 1) { const [cx, cy] = compassAt(t), s0 = [SIGNS[0][0], SIGNS[0][1] - 40]; const x = lerp(s0[0], cx, q), y = lerp(s0[1], cy, q) - Math.sin(Math.PI * q) * 140; F.glowText(ctx, '?', x, y + lerp(SR * .3, 10, q), { size: lerp(SR * 1.05, 34, q), serif: true, align: 'center', col: GOLD.body, glow: true }); }
  };
  const youWalk = (t) => {   // [x, dir, walk phase] or null
    const i0 = a.stays - .4, i1 = a.stays + 1.0, o0 = a.subE + .5, o1 = a.end0 - .2; if (t < i0) return null;
    if (t < i1) { const p = F.powOut(span(t, i0, i1), 1.6); return [lerp(YOU.x - 520, YOU.x, p), 1, Math.PI * 2 * 4 * (1 - p) + Math.PI * 2]; }
    if (t < o0) return [YOU.x, 1, null];
    const p = span(t, o0, o1); if (p >= 1) return null; const e = p * p * (3 - 2 * p) * .4 + p * .6; return [YOU.x + 1300 * e, 1, Math.PI * 2 * 9 * e + Math.PI * 2];
  };
  const needleAng = (t) => {   // radians from up, clockwise; it swings on "direction" and settles up (0)
    const k = t - a.direction - .05; if (k < 0) return .9 + .25 * Math.sin(t * 1.7);
    return (.9 + .25 * Math.sin((a.direction + .05) * 1.7)) * Math.exp(-k * 2.6) * Math.cos(k * 7.5);
  };
  const drawYou = (ctx, t) => {
    const w = youWalk(t); if (!w) return;
    const hold = smooth(span(t, a.stays + .6, a.stays + 1.3));
    const look = lerp(.3, -.15, hold) + smooth(span(t, a.direction + .2, a.what)) * .9 + smooth(span(t, a.want - .1, a.want + .6)) * .3;
    const hd = F.du(ctx, w[0], FLOOR, YOU.h, { dir: w[1], walk: w[2] ?? undefined, look: Math.min(1, look), armR: [lerp(.2, 1.25, hold), lerp(.1, 1.95, hold)], armL: [lerp(-.2, .9, hold), lerp(-.1, 1.7, hold)], light: .95 });
    // the compass in your hands (outline, a gold ? in its centre, the needle)
    const cu = smooth(span(t, a.stays + 1.0, a.stays + 1.5)) * (1 - smooth(span(t, a.subE + .4, a.subE + 1)));
    if (cu > 0 && hd?.R) { const cx = (hd.R[0] + hd.L[0]) / 2 + 12, cy = (hd.R[1] + hd.L[1]) / 2 - 22, r = 30;
      F.halo(ctx, cx, cy, 70, .5 * cu, GOLD.halo, GOLD.core);
      ctx.save(); ctx.globalAlpha *= cu; ctx.fillStyle = rgba(P.night0, .85); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.29); ctx.fill(); ctx.restore();
      F.outline(ctx, [F.circlePts(cx, cy, r, 0, 6.29, 36)], cu, { w: 2, gold: true });
      const an = needleAng(t), nx = Math.sin(an), ny = -Math.cos(an);
      F.goldSpan(ctx, [[cx - nx * r * .75, cy - ny * r * .75], [cx + nx * r * .85, cy + ny * r * .85]], 0, cu, { w: 1.8, spark: false });
      const qk = smooth(span(t, a.stays + 1.2, a.stays + 1.6)) * (1 - smooth(span(t, a.direction - .1, a.direction + .3)) * .6);
      if (qk > 0) F.glowText(ctx, '?', cx, cy + 9, { size: 26, serif: true, align: 'center', col: GOLD.core, glow: true, a: qk });
      return { cx, cy, nx, ny };
    }
  };
  // 6.13 ANSWERS drift off the compass (small ticks rising away, leaving the frame)
  const drawAnswers = (ctx, t) => {
    if (t < a.answers - .1 || t > a.questions + 2.5) return;
    const [cx, cy] = compassAt(t);
    for (let i = 0; i < 7; i++) { const p = span(t, a.answers - .05 + i * .07, a.answers + 2.2 + i * .07); if (p <= 0 || p >= 1) continue;
      const ang = -Math.PI / 2 + (i - 3) * .32, d = 30 + 360 * sineIO(p), x = cx + Math.cos(ang) * d * 1.3, y = cy + Math.sin(ang) * d - p * 60;
      ctx.save(); ctx.globalAlpha *= 1 - span(p, .55, 1); F.goldSpan(ctx, [[x - 9, y], [x - 3, y + 6], [x + 9, y - 7]], 0, 1, { w: 1.8, spark: false }); ctx.restore(); }
  };

  // ---------------------------------------------------------------- 6.16–E.01 THE BOARD (big), the ring, the harvest, hands, figures
  const boardU = (t) => smooth(span(t, a.direction + .35, a.what + .25));
  const growK = (i, t) => {   // the eight invention rows above (i = 0 top … 7 bottom): grow bottom-up on ★, fold top-down in the quiet walk
    const g = span(t, a.final + .15 + (7 - i) * .11, a.final + .75 + (7 - i) * .11), f = span(t, a.subE + .3 + i * .1, a.subE + .9 + i * .1);
    return g * (1 - f);
  };
  const writeU = (t) => span(t, a.steer - .05, a.steerE + .5);
  const row4 = (t) => {
    if (t < a.fourth) return { text: 'CONTROL', dashed: true, lit: .2 };
    if (t < a.final + .2) return { text: '', from: 'CONTROL', flip: span(t, a.fourth + .1, a.fourth + .7), dashed: true, lit: .25 * Math.sin(Math.PI * span(t, a.ours, a.ours + 1.4)) };
    const wu = writeU(t), sl = smooth(span(t, a.final + .2, a.final + .9));
    return { text: 'HOW TO STEER IT', from: '', flip: wu, gold: lerp(.45 * sl, .85, smooth(wu)), lit: lerp(.9 * sl, .5, smooth(span(t, a.steerE, a.steerE + 1.5))) };
  };
  const emptyGlow = (t) => smooth(span(t, a.final + .2, a.final + .9)) * (1 - smooth(span(t, a.steer, a.steerE + 1.2)));
  const drawBig = (ctx, t) => {
    const u = boardU(t); if (u <= 0) return;
    // the ring behind: rises with the board, grows on ★, settles to the end-screen ring
    const st = smooth(span(t, a.final + .1, a.final + 1.7)) * (1 - smooth(span(t, a.subE + .2, a.end0 - .5)));
    const rr = lerp(RINGR, 600, st), ry = lerp(RINGE[1], RINGE[1] - 330, st);
    const lit = t >= a.end0 ? .35 + .1 * Math.sin(t * 1.1) : lerp(.35 + .1 * Math.sin(t * 1.1), .9, st);
    X.ringS(ctx, t, RINGE[0], ry, rr, { u: expoOut(span(t, a.direction + .5, a.what + .8)), lit, think: (.2 + .3 * st) * (1 - smooth(span(t, a.subE, a.end0))) });
    const pulse = (i) => .55 * Math.sin(Math.PI * span(t, a.three + i * .12, a.three + .9 + i * .12));
    const rows = [...['ENERGY', 'MATERIALS', 'DISCOVERY'].map((s, i) => ({ text: s, status: 'BEGUN', gold: 1, lit: pulse(i) })), row4(t)];
    const above = F.INVENTIONS.map((s, i) => { const k = growK(i, t); return { text: s, from: '', flip: span(k, .3, 1), k, a: 1 }; });
    const tk = smooth(span(t, a.final + .2, a.final + .8)) * (1 - smooth(span(t, a.subE + .9, a.subE + 1.6)));
    const b = X.tallBoard(ctx, t, BB.x, BB.y, { w: BB.w, rowH: BB.rowH, head: BB.head, title: 'THE FOUR LINES', titleB: 'HUMAN INVENTIONS', titleK: tk, rows, above, cells: 15, u });
    // the empty last row glows gold (the frame-0 slot) until it is written
    const eg = emptyGlow(t), r4 = b.rows[3];
    if (eg > 0 && r4) { const br = .82 + .18 * Math.sin(t * 1.4); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha *= eg; ctx.fillStyle = F.lin(ctx, r4.x, 0, r4.x + r4.w, 0, [[0, rgba(GOLD.halo, .34 * br)], [.5, rgba(GOLD.body, .5 * br)], [1, rgba(GOLD.halo, .34 * br)]]); ctx.beginPath(); ctx.roundRect(r4.x, r4.y + 3, r4.w, r4.h - 6, 6); ctx.fill(); ctx.restore(); F.halo(ctx, r4.x + r4.w / 2, r4.y + r4.h / 2, r4.w * .55, .3 * eg, GOLD.halo, GOLD.core); ctx.strokeStyle = rgba(GOLD.line, eg); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(r4.x, r4.y + 3, r4.w, r4.h - 6, 6); ctx.stroke(); }
    // 6.19 ticks; 6.18 the house (dashed: imagined)
    const tu = io(t, a.begun - .1, a.fourth + .2);
    if (tu > 0) for (let i = 0; i < 3; i++) { const y = BB.y + BB.head + i * BB.rowH + BB.rowH / 2, x = BB.x + BB.w + 34; F.goldSpan(ctx, [[x, y], [x + 10, y + 10], [x + 30, y - 12]], 0, smooth(span(tu, i * .15, .5 + i * .15)), { w: 3.2, spark: false }); }
    const hu = io(t, a.home - .1, a.fourth + .2); if (hu > 0) F.lineIcon(ctx, 'house', BB.x + BB.w + 210, BB.y + BB.head + 1.5 * BB.rowH, 70, { u: hu, dashed: true, t, w: 3 });
    return b;
  };
  // the stylus: lies in front of row 4 (6.20), the writing hand takes it (6.23)
  const STY = [BB.x + BB.w / 2 + 40, ROW4Y + BB.rowH + 18];
  const handTip = (t) => {   // the tip of the writing hand's stylus
    const tx0 = BB.x + 20 + BB.rowH * .34, tx1 = tx0 + F.flapW(15, BB.rowH * .4), y = ROW4Y + BB.rowH / 2 + 8;
    const inn = quartIO(span(t, a.last + .3, a.steer - .1)), wu = writeU(t), out = sineIO(span(t, a.steerE + .6, a.hands + .4));
    const x = lerp(lerp(STY[0] + 520, tx0, inn), tx1, wu), yy = lerp(STY[1] + 200, y, inn) + Math.sin(wu * 40) * 3 * (wu > 0 && wu < 1 ? 1 : 0);
    return [lerp(x, x + 700, out), lerp(yy, yy + 600, out), inn, out];
  };
  const drawStylusHand = (ctx, t) => {
    if (t < a.fourth || t > a.hands + .6) return;
    const [hx, hy, inn, out] = handTip(t), take = smooth(span(t, a.last + .45, Math.min(a.last + 1.15, a.steer - .2)));
    const su = smooth(span(t, a.fourth + .3, a.fourth + 1));
    if (take < 1) F.stylus(ctx, t, lerp(STY[0] - 60, hx, take), lerp(STY[1], hy, take), lerp(Math.PI, -2.75 + Math.PI, take) - Math.PI * take, lerp(120, 110, take), { w: 4, a: su });
    if (inn > 0 && out < 1) { ctx.save(); ctx.globalAlpha *= span(inn, 0, .3); F.writingHand(ctx, t, hx, hy, { s: 85, ang: -2.75 }); ctx.restore(); }
  };
  const drawHands = (ctx, t) => {
    const u = span(t, a.hands - .2, a.hands + 1.4) * (1 - span(t, a.channel + 1.4, a.channel + 2.8)); if (u <= 0) return;
    F.hands(ctx, t, { n: 9, x0: BB.x - 60, x1: BB.x + BB.w + 60, y: ROW4Y + 560, s: 135, u, light: .4 + .6 * smooth(span(t, a.channel - .3, a.channel + .6)), from: BB.x + BB.w / 2, seed: 23 });
  };
  const drawCrowd = (ctx, t) => {
    if (t < a.channel + .5 || t > a.end0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(4000, -2000, 3000, FLOOR + 2002); ctx.clip();
    CROWD.forEach(([x, h], i) => {
      const d = Math.abs(x - YOU.x) / 900, u = smooth(span(t, a.channel + 1.1 + d * .8, a.channel + 2.1 + d * .8)) * (1 - sineIO(span(t, a.subE + .2 + d * .3, a.subE + 1.4 + d * .3)));
      if (u <= 0) return;
      ctx.save(); ctx.translate(0, (1 - u) * h * 1.15);
      X.lightPerson(ctx, t, x, FLOOR, h, { dir: x < YOU.x ? 1 : -1, look: .85, armR: [2.6 + .08 * Math.sin(t * .9 + i), 2.85], light: span(u, .4, 1) });
      ctx.restore();
    });
    ctx.restore();
  };
  const floorU = (t) => smooth(span(t, a.way + .2, a.way + 1.2)) * (1 - smooth(span(t, a.subE + 1, a.end0 - .3)));

  // ======================================================================================================================== draw
  const qLeft = (ctx, t) => { if (a.leftW && t < a.spring + .6) F.question(ctx, t, 'What else is left for us?', W / 2 + 40, 520, 58, { ts: a.leftW, out: span(t, a.spring - .2, a.spring + .5) }); };
  const draw = (ctx, t) => {
    if (t < tH) { s11.draw(ctx, t); return; }
    const c = cam(t);
    F.night(ctx, t, { glow: glowAt(t), ox: -(c.cx - cE11.cx) * .05, oy: -(c.cy - cE11.cy) * .05 });
    F.look(ctx, c.cx, c.cy, c.z, () => {
      if (t < a.prof + 2) s11.drawWorld(ctx, t, { row3: t < a.spring + .05 ? 1 : 0, floorTo: 2600 });
      { const u = smooth(span(t, a.spring + .3, a.prof + .5)) * (1 - smooth(span(t, a.liam + .5, a.liam + 1.5))); if (u > 0) F.outline(ctx, [[[2400, FLOOR], [3300, FLOOR]]], u, { w: 1.6, a: .5 }); }
      { const u = floorU(t); if (u > 0) F.outline(ctx, [[[YOU.x, FLOOR], [4500, FLOOR]], [[YOU.x, FLOOR], [6500, FLOOR]]], u, { w: 1.6, a: .5 }); }
      drawProf(ctx, t);
      drawHouse(ctx, t);
      drawDesks(ctx, t);
      drawBig(ctx, t);
      drawSigns(ctx, t);
      drawSheet(ctx, t);
      drawCrowd(ctx, t);
      drawYou(ctx, t);
      drawAnswers(ctx, t);
      drawHands(ctx, t);
      drawStylusHand(ctx, t);
      drawCard(ctx, t);
    });
    const sp = (x, y) => F.lookPt(c.cx, c.cy, c.z, x, y);
    qLeft(ctx, t);
    if (t >= a.end0) return;   // the end screen: the board, the ring, nothing else
    // 6.03 / 6.04
    { const u = io(t, a.prof + .1, a.liam + .1); if (u > 0) { const [x, y] = sp(PROF.x, FLOOR + 40); X.creamWord(ctx, t, x, Math.min(y, 840), 'NOT A PROFESSOR', u, { size: 30 }); } }
    { const u = io(t, a.liam + .3, a.typed + .6); if (u > 0) { const [x, y] = sp(HOUSE.win.x + HOUSE.win.w + 50, HOUSE.win.y + 90); F.maskLine(ctx, [['Liam Price, 23', 0]], Math.min(x, W - 520), y, 54, rise(u), { glow: true }); F.capsLabel(ctx, 'NO ADVANCED TRAINING', Math.min(x, W - 520), y + 50, io(t, a.noadv - .2, a.typed + .7), { size: 24, align: 'left', col: CREAM }); F.capsLabel(ctx, 'IN MATHEMATICS', Math.min(x, W - 520), y + 84, io(t, a.noadv, a.typed + .75), { size: 24, align: 'left', col: CREAM }); } }
    { const u = io(t, a.chat - .1, a.two - .3); if (u > 0) F.capsLabel(ctx, 'MODEL: GPT-5.4 PRO', W / 2, 150, u, { size: 26, col: COOL.text }); }
    { const u = io(t, a.posted, a.two - .1, .35); if (u > 0) F.capsLabel(ctx, 'POSTED ONLINE', W / 2, 830, u, { size: 24, col: CREAM }); }
    // 6.06–6.08
    { const u = io(t, a.two + .5, a.coauth + .1); if (u > 0) { F.capsLabel(ctx, 'CHECKED AND SHORTENED BY', W / 2, 160, u, { size: 24, col: CREAM }); F.verdict(ctx, t, W / 2, 210, 'JARED LICHTMAN AND TERENCE TAO', io(t, a.two + .8, a.coauth + .1), { size: 30 }); } }
    DESK.forEach((d, i) => { const lit = i === 1 ? smooth(span(t, a.tao - .1, a.tao + .4)) : 0, u = io(t, a.two + .2 + i * .3, a.coauth + .3); if (u > 0) { const [x, y] = sp(d.x + 40, FLOOR + 44); F.capsLabel(ctx, d.name, x, Math.min(y, 850), u, { size: lerp(24, 30, lit), col: mixHex(P.halo2, GOLD.text, lit) }); } });
    { const u = io(t, a.coauth + .6, a.way - .1, .35); if (u > 0) { const [x, y] = sp(PAGE.cx, PAGE.cy + PAGE.h / 2 + 50); F.capsLabel(ctx, '8 AUTHORS', x, y, u, { size: 24, col: CREAM }); } }
    { const u = io(t, a.co - .1, a.way - .1, .35); if (u > 0) { const [x, y] = sp(PAGE.cx, PAGE.cy - PAGE.h / 2 - 40); F.verdict(ctx, t, x, Math.max(130, y), 'CO-AUTHOR', u, { size: 32 }); } }
    // 6.09–6.11 the signs' captions
    { const u = io(t, a.way + .2, a.stays); if (u > 0) { const [x, y] = sp(SIGNS[1][0], SIGNS[1][1] - SR - 60); F.capsLabel(ctx, 'THE MACHINE FOUND THE WAY', x, Math.max(120, y), u, { size: 26, col: COOL.text }); } }
    { const u = io(t, a.person + .1, a.stays); if (u > 0) { const [x, y] = sp(SIGNS[0][0], FLOOR + 50); F.capsLabel(ctx, 'A PERSON CHOSE THE QUESTION', x, Math.min(y, 850), u, { size: 24, col: GOLD.text }); } }
    { const u = io(t, a.checked + .1, a.stays); if (u > 0) { const [x, y] = sp(SIGNS[2][0], FLOOR + 50); F.capsLabel(ctx, 'PEOPLE CHECKED THE ANSWER', x, Math.min(y, 850), u, { size: 24, col: GOLD.text }); } }
    // 6.12–6.15 the compass
    { const u = io(t, a.stays + .6, a.answers - .4, .3); if (u > 0) F.verdict(ctx, t, W / 2, 230, 'WHAT STAYS WITH US', u, { size: 34 }); }
    { const u = io(t, a.answers - .05, a.questions - .35, .3); if (u > 0) X.creamWord(ctx, t, W / 2, 230, 'NOT THE ANSWERS', u, { size: 32 }); }
    { const u = io(t, a.questions - .02, a.direction - .05, .3); if (u > 0) F.verdict(ctx, t, W / 2, 230, 'THE QUESTIONS', u, { size: 34 }); }
    { const u = io(t, a.direction, a.what + .2, .4); if (u > 0) { const [x, y] = sp(YOU.x + 250, FLOOR - YOU.h * .5); F.verdict(ctx, t, x, y, 'THE DIRECTION', u, { size: 34 }); } }
    // 6.16–6.21 at the board
    if (a.whatW && t > a.what - .2 && t < a.three + .4) F.question(ctx, t, 'So what will A.G.I. invent for you?', W / 2, 150, 58, { ts: a.whatW, out: span(t, a.three - .2, a.three + .4) });
    const right = (row) => sp(BB.x + BB.w + 80, BB.y + BB.head + row * BB.rowH + BB.rowH / 2 + 10);
    { const u = io(t, a.three + .1, a.home - .1, .35); if (u > 0) { const [x, y] = right(1); F.verdict(ctx, t, x, y, 'THREE LINES', u, { size: 34, align: 'left' }); } }
    { const u = io(t, a.home + .2, a.begun - .05, .3); if (u > 0) { const [x, y] = sp(BB.x + BB.w + 210, BB.y + BB.head + 3 * BB.rowH - 4); X.creamWord(ctx, t, x, y, 'NOT IN YOUR HOME YET', u, { size: 26 }); } }
    { const u = io(t, a.begun, a.fourth + .1, .35); if (u > 0) { const [x, y] = sp(BB.x + BB.w + 210, BB.y + BB.head + 3 * BB.rowH - 4); F.verdict(ctx, t, x, y, 'BEGUN', u, { size: 34 }); } }
    { const u = io(t, a.ours, a.final + .1, .4); if (u > 0) { const [x, y] = right(3); X.creamWord(ctx, t, x, y, 'OURS TO WRITE', u, { size: 32, align: 'left' }); } }
    // 6.22 ★ the frame-0 type, left, word by word
    if (a.finalW && t > a.final && t < a.steer + .5) {
      const ws = ['THE ONE THAT', 'INVENTS', 'EVERYTHING ELSE'], ix = [0, 3, 4], out = span(t, a.last + .1, a.last + .8);
      F.titleWords(ctx, ws.map((w, i) => [{ w, u: span(t, a.finalW[ix[i]] - .08, a.finalW[ix[i]] + .5) }]), 82, 400, { size: 132, cond: .62, lead: 140, out });
    }
    // A.04 subscribe: a lit button on the board's frame (screen size ≥ 22 px), pressed once on "subscribe"
    { const u = io(t, a.sub - .35, a.subE + 1.4, .5); if (u > 0) {
      const [x, y] = sp(BB.x + BB.w, ROW4Y - 30), k = expoOut(u), press = 1 - .08 * Math.sin(Math.PI * span(t, a.sub + .35, a.sub + .65)), bw = 240, bh = 60;
      ctx.save(); ctx.translate(x + 30 + bw / 2, y); ctx.scale(k * press, k * press);
      F.halo(ctx, 0, 0, 200, .7 * u, GOLD.halo, GOLD.core);
      ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, bh / 2); ctx.fill(); ctx.strokeStyle = GOLD.core; ctx.lineWidth = 2; ctx.stroke();
      F.glowText(ctx, 'SUBSCRIBE', 0, 9, { size: 26, weight: 700, align: 'center', col: GOLD.deep, glow: false, spacing: .1 });
      ctx.restore(); } }
  };
  return { draw, a };
}
