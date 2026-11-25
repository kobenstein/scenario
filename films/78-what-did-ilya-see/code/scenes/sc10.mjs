// Film 78 · c10 (B2) · 'So what do you do?' (529.55) → end (616.68; END SCREEN from 601.68) · ONE take:
// in the hall (Toronto), into the rising sun behind the lectern, out of the tower's crown light, then along the ground to the LINE.
//   9.01  the hall gets the graduates' caps: TORONTO · JUNE 2025; DON'T LOOK AWAY
//   9.02  push to you in the back row: the chat window rises in front of you: TRY THE BEST ONE TODAY
//   9.03  a small light grows in your hand: INTUITION        9.04 the path ahead of you lights up, to the lectern
//   9.05  quote card "the greatest challenge of humanity ever" · TORONTO, JUNE 2025 (verbatim; the VO paraphrases)
//   9.06  the sun rises behind the lectern on the dawn line: "the greatest reward"; the camera flies into its light …
//   9.07  … and comes out of the tower's crown light: WHAT DID ILYA SEE? over the tower (A3, thumbnail C echo, ≤ 2.5 s)
//   9.08  a block of tower windows flies out into the call grid: the tiles are people   9.09 the threads between them snap
//   9.10  the grid flies back; the camera travels left to the LINE: the day rises on the AFTER side: AI DOES ALL THE THINGS WE CAN DO
//   9.11  its date box stays empty: —        9.12 5–20 YEARS beside it: A MACHINE THAT LEARNS LIKE A HUMAN
//   9.13  three cards fly onto the line: MAGAZINE · OCT 2023 / GRADUATES · JUNE 2025 / PODCAST · NOV 2025
//   9.14 ★ the LINE big across the frame, BEFORE | AFTER     9.15 you left of the line, NOW at your feet
//   9.16  the cards open wide in the light    9.17 sound rings travel from them to you    9.18 you look up; pull back: the man far off
//   A.01  subscribe 2 round you (no QR); the LINE telescopes into the tower; the camera settles on the end screen (S.endScreen, A4)
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f78_kit.mjs';
import * as S from '../lib/f78_world.mjs';
import * as B from '../lib/b2_kit.mjs';
import { hallSeam, HALL } from '../lib/b2_seams.mjs';
import { createCanvas } from '@napi-rs/canvas';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, expoIn, rgba, halo, mixHex } = E;
const { mv, land, rise, GOLD, CREAM, CREAM2, COOL, PAPER, INK } = F;
const TAU = Math.PI * 2;

export default (T, R) => {
  const G = (p, n = 0, a = -1) => T.G(p, n, a);
  const HS = hallSeam(T), tSo = HS.tSo, tE = T.duration - 15;
  const tAdv = G('His advice to those graduates', 0, tSo), tDont = G("don't look away", 0, tAdv);
  const tUse = G('Use AI', 0, tDont), tTold = G('That, he told them', 0, tUse), tWatch = G('yourself, and watch what the best', 0, tUse), tIntu = G('gives you an intuition', 0, tUse);
  const tEnergy = G('And the energy for the challenge'), tSense = G('In some sense, he said'), tChall = G('greatest challenge humanity has ever faced', 0, tSense);
  const tOver = G('And overcoming it', 0, tSense), tReward = G('the greatest reward', 0, tOver);
  const tTitle = G('So, what did Ilya see', 0, tReward), tWeek = G('In that famous week', 0, tTitle), tPeople = G('people', 0, tWeek), tTrust = G('A fight over trust', 0, tWeek);
  const tAhead = G('And ahead of us', 0, tTrust), tDay = G('a day when AI will do all the things', 0, tAhead), tNoDate = G('He put no date on that day', 0, tAhead);
  const tLearn = G('But a machine that learns', 0, tNoDate), tFive = G('Five to twenty years', 0, tLearn);
  const tMag = G('He told a magazine', 0, tLearn), tGrad = G('He told a hall full of graduates', 0, tMag), tPod = G('He told a podcaster', 0, tGrad);
  const tBA = G('There will be a before and an after', 0, tPod), tStill = G('And this is still the before', 0, tBA);
  const tSecret = G('The secret was never hidden', 0, tStill), tListen = G("We just weren't listening", 0, tSecret), tNow = G('Now you are', 0, tListen);
  const tChan = G('This channel exists so that', 0, tNow), tWant = G('Want that too', 0, tChan), tSub = G('Then subscribe', 0, tWant);
  const tsw = tReward + 2.6;   // the flight through the sun's light: hall space → tower space at this instant (the frame is all light)

  // ---------------------------------------------------------------------------------------------- the hall part (HALL space, x 7000)
  const SUN = { x: HALL.x, y: HALL.floor, r: 90 };
  const K3 = HS.K[HS.K.length - 1];
  const KH = [K3, [tUse + 1.2, { x: HALL.x + 130, y: 70, s: 1.45 }], [tIntu + .8, { x: HALL.x + 60, y: 100, s: 1.6 }], [tEnergy + 1.4, { x: HALL.x, y: -90, s: .95 }],
    [tChall + .4, { x: HALL.x, y: -160, s: 1.0 }], [tReward + 1.0, { x: HALL.x, y: -420, s: 1.7 }], [tsw, { x: SUN.x, y: SUN.y - 30, s: 5 }]];
  const camH = (t) => (t < K3[0] ? HS.cam(t) : S.drift2(S.camPath2(t, KH), t, .7 * (1 - span(t, tsw - .8, tsw)), 31));
  // ---------------------------------------------------------------------------------------------- the tower part (Leitbild space)
  const LX = -1300, LY0 = -420, SUNX = LX + 330;
  const KT = [[tsw, { x: S.TOWER.x, y: S.GY - S.TOWER.h - 30, s: 3.2 }], [tTitle + 2.3, { x: 1180, y: 560, s: .92 }], [tPeople + .9, { x: 1230, y: 560, s: .98 }],
    [tDay + .8, { x: -850, y: 420, s: .95 }], [tNoDate + 1, { x: -830, y: 410, s: 1.0 }], [tFive + 1.2, { x: -840, y: 400, s: 1.02 }],
    [tPod + .9, { x: -1060, y: 400, s: .9 }], [tBA + 1.2, { x: LX, y: 240, s: .76 }], [tStill + 1.2, { x: LX - 60, y: 560, s: 1.08 }],
    [tSecret + 1.0, { x: LX - 120, y: 420, s: .9 }], [tNow + 2.6, { x: -200, y: 560, s: .55 }], [tSub + 1.3, { x: -150, y: 580, s: .565 }],
    [tE, { x: 1040, y: 820, s: .5 }]];
  const camT = (t) => S.drift2(S.camPath2(t, KT), t, .7 * span(t, tsw, tsw + .8) * (1 - span(t, tE - 4, tE)), 31);
  const cam = (t) => (t < tsw ? camH(t) : camT(t));
  const flood = (t) => (t < tsw ? sineIO(span(t, tsw - 1.3, tsw)) : 1 - sineIO(span(t, tsw, tsw + 1.3)));
  const dawn = (t) => (t < tsw ? HALL.dawn : lerp(HALL.dawn, .45, sineIO(span(t, tDay - .5, tE))));
  const man = (t) => ({ x: 1060 + (tE - t) * 4, dir: -1, walk: (t - tE) * 2.2, h: 210, shadow: 120 });

  // ---------------------------------------------------------------------------------------------- cards
  const dummy = createCanvas(8, 8).getContext('2d');
  const QC = { text: 'the greatest challenge of humanity ever', head: 'IN HIS WORDS', credit: 'Ilya Sutskever · Toronto, June 2025', x: 260, y: 110, w: 1400, size: 62 };
  const qw = T.GW('the greatest challenge', null, tSense), QCt = [qw[0].s, qw[1].s, qw[2].s, qw[2].e - .05, G('humanity', 0, tSense), G('ever', 0, tSense)];
  const QCh = B.qcard(dummy, 0, { ...QC, u: 1 }).h;
  const CARDS = [['MAGAZINE', 'OCT 2023', tMag], ['GRADUATES', 'JUNE 2025', tGrad], ['PODCAST', 'NOV 2025', tPod]];
  const tileList = () => [{ kind: 'person' }, { kind: 'ilya', label: 'ILYA SUTSKEVER' }, { kind: 'person' }, { kind: 'boss', label: 'THE BOSS' }, { kind: 'person' }, { kind: 'person' }];
  const GRID = { x: 380, y: 150, w: 1160, h: 650 };

  // the LINE (telescopes into the tower at the end), the cards on it, its boxes
  const lineAt = (t) => { const e = sineIO(span(t, tSub + .3, tE - .5)); return { x: lerp(LX, S.TOWER.x, e), y0: lerp(LY0, S.GY - S.TOWER.h + 40, e), k: 1 - e, e }; };
  const smallCard = (ctx, x, y, w, l1, l2, u, open) => {
    if (u <= 0 || w < 3) return;
    const h = w * .38;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); const sc = 1 + .22 * open; ctx.scale(sc, sc); ctx.translate(-w / 2, -h / 2);
    if (open > 0) halo(ctx, w / 2, h / 2, w * .9, .35 * open, GOLD.halo, GOLD.hot);
    ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(6, 8, w, h);
    ctx.fillStyle = mixHex(PAPER.body, PAPER.lit, open); ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = rgba(GOLD.mid, .9); ctx.fillRect(0, 0, w * .03, h);
    E.glowText(ctx, l1, w * .1, h * .46, { size: w * .11, weight: 800, spacing: .08, col: PAPER.ink, glow: false });
    E.glowText(ctx, l2, w * .1, h * .8, { size: w * .08, weight: 700, spacing: .1, col: mixHex(PAPER.ink, GOLD.deep, .5), glow: false });
    ctx.restore();
  };

  const draw = (ctx, t) => {
    const c = cam(t);
    if (t >= tE) { S.endScreen(ctx, t, T); return; }
    if (t < tsw) drawHall(ctx, t, c); else drawTower(ctx, t, c);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const fl = flood(t);
    if (fl > 0) { ctx.fillStyle = rgba(mixHex(GOLD.hot, GOLD.mid, .45), fl); ctx.fillRect(0, 0, W, H); }
  };

  const drawHall = (ctx, t, c) => {
    const st = HS.draw(ctx, t, { cam: c, caps: mv(t, tAdv - .1, 1.8) });
    S.view(ctx, c);
    const Y = st.you, yx = Y ? Y.x : HALL.x, yy = Y ? Y.y : 160, hh = Y ? Y.s : 144;
    // DON'T LOOK AWAY (over the stage, under the dome)
    const dl = rise(span(t, tDont - .05, tDont + .5)) * (1 - span(t, tUse, tUse + .5));
    if (dl > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.goldText(ctx, [["DON'T LOOK AWAY", 1]], W / 2, 190, 78, dl, { serif: false, weight: 800, spacing: .08, align: 'center' }); ctx.restore(); }
    // 9.02 the chat window rises out of you (the hook's window): TRY THE BEST ONE TODAY
    const cw = land(t, tUse - .1, .9) * (1 - sineIO(span(t, tTold - .1, tTold + .8)));
    if (cw > 0) {
      const full = { x: yx + 110, y: -90, w: 560, h: 300 }, from = { x: yx - 20, y: yy - hh * .5, w: 40, h: 24 }, Rr = B.lerpR(from, full, cw);
      F.chatWin(ctx, t, Rr, { q: span(t, tUse + .2, tUse + .8), question: 'What can you do today?', answer: span(t, tWatch, tWatch + 2.4) });
      const lu = rise(span(t, tWatch + .3, tWatch + 1)) * cw;
      if (lu > 0) F.goldText(ctx, [['TRY THE BEST ONE TODAY', .4]], full.x, full.y - 30, 38, lu, { serif: false, weight: 800, spacing: .08 });
    }
    // 9.03 a light grows in your hand: INTUITION
    const iu = mv(t, tIntu - .3, 1.2);
    const hx = yx + hh * .3, hy = yy - hh * .05;
    if (iu > 0) {
      B.warmLight(ctx, hx, hy, 8 + 10 * iu, iu, { t });
      const lu = rise(span(t, tIntu + .1, tIntu + .7)) * (1 - span(t, tSense - .3, tSense + .2));
      if (lu > 0) { F.goldSpan(ctx, [[hx + 20, hy - 10], [hx + 120, hy - 90]], 0, lu, { w: 1.5, spark: false }); F.goldText(ctx, [['INTUITION', 1]], hx + 130, hy - 98, 44, lu, { serif: false, weight: 800, spacing: .1 }); }
    }
    // 9.04 the path ahead of you lights up, up the aisle to the lectern
    const pu = mv(t, tEnergy - .1, 1.8);
    if (pu > 0) {
      const pts = [[hx, hy], [lerp(hx, HALL.x, .6), lerp(hy, HALL.floor, .45) + 20], [HALL.x, HALL.floor + 6]];
      F.goldSpan(ctx, pts, 0, pu, { w: 3, spark: pu < 1 });
      for (let i = 1; i < 7; i++) { const f = i / 7; if (f > pu) break; const x = lerp(hx, HALL.x, f), y = lerp(hy, HALL.floor + 6, f); halo(ctx, x, y, 30, .35, GOLD.halo, GOLD.core); }
    }
    // 9.06 the sun rises behind the lectern on the dawn line: "the greatest reward"
    const su = mv(t, tOver - .2, 1.8);
    if (su > 0) {
      B.sunrise(ctx, SUN.x, SUN.y, SUN.r, su);
      const ru = rise(span(t, tReward - .1, tReward + .6));
      if (ru > 0) F.goldText(ctx, [['“the greatest reward”', 1]], SUN.x, SUN.y - SUN.r - 46, 60, ru, { serif: true, align: 'center' });
    }
    // 9.05 the quote card (screen space), out of the lectern; it leaves upward as the sun rises
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const cu = expoOut(span(t, tSense - .1, tSense + .7)), cout = sineIO(span(t, tOver - .4, tOver + .8));
    if (cu > 0 && cout < 1) {
      const [lx, ly] = S.toScreen(c, HALL.x, HALL.floor - 100), from = { x: lx - 30, y: ly - 14, w: 60, h: 28 };
      const Rr = B.lerpR(from, { x: QC.x, y: QC.y - cout * 700, w: QC.w, h: QCh }, cu);
      ctx.save(); ctx.translate(Rr.x, Rr.y); ctx.scale(Rr.w / QC.w, Rr.h / QCh); ctx.translate(-QC.x, -QC.y); B.qcard(ctx, t, { ...QC, u: 1, times: QCt, inkAll: true }); ctx.restore();
    }
    const tt = rise(span(t, tAdv + .3, tAdv + 1)) * (1 - span(t, tUse - .2, tUse + .2));
    if (tt > 0) F.dateTag(ctx, 110, 150, F.SOURCES.toronto, tt, { size: 26 });
    const t2 = rise(span(t, tChall, tChall + .7)) * (1 - span(t, tOver - .3, tOver + .1));
    if (t2 > 0) F.dateTag(ctx, 110, QC.y + QCh + 60, F.SOURCES.toronto, t2, { size: 26 });
  };

  const drawTower = (ctx, t, c) => {
    S.stage(ctx, t, c, { dawn: dawn(t) }); S.view(ctx, c);
    // the LINE (behind the tower, so it disappears into it at the end)
    const L = lineAt(t), lu = mv(t, tAhead - .1, 1.6);
    if (lu > 0 && L.e < 1) F.goldSpan(ctx, [[L.x, S.GY], [L.x, L.y0]], 0, lu, { w: lerp(3.2, 1.5, L.e) });
    if (lu > 0 && L.e < 1) halo(ctx, L.x, lerp(L.y0, S.GY, .5), 500 * L.k, .1 * lu, GOLD.halo, GOLD.core);
    const g = S.leitbild(ctx, t, { tower: { glow: .9 }, man: man(t) });
    // the AFTER side: the day rises (and sinks again behind the frame edge at the very end)
    const sd = mv(t, tDay - .3, 2.2) * (1 - mv(t, tSub + .5, 3.2));
    if (sd > 0) {
      B.sunrise(ctx, SUNX, S.GY, 70, sd);
      const au = rise(span(t, tDay + .5, tDay + 1.3)) * (1 - span(t, tBA - .6, tBA));
      if (au > 0) F.goldText(ctx, [['AI DOES ALL THE THINGS WE CAN DO', .35]], LX + 40, 120, 42, au, { serif: false, weight: 800, spacing: .06, col: CREAM });
    }
    // 9.11 the empty date box · 9.12 5–20 YEARS beside it
    const bk = L.k, box = (x, y, w, h, txt, cap, u, gold) => {
      if (u <= 0) return; const k = expoOut(u);
      ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(0, (1 - k) * 24);
      ctx.fillStyle = INK.panel; ctx.strokeStyle = rgba(gold ? GOLD.line : CREAM, .85); ctx.lineWidth = 2.5; if (!gold) ctx.setLineDash([9, 7]);
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      F.goldText(ctx, [[txt, gold ? 1 : 0]], x + w / 2, y + h * .68, 40, 1, { serif: true, align: 'center', col: CREAM });
      if (cap) F.goldText(ctx, [[cap, 0]], x, y - 16, 24, 1, { serif: false, weight: 700, spacing: .12, col: CREAM2 });
      ctx.restore();
    };
    const bxU = land(t, tNoDate - .1, .7) * (1 - span(t, tBA - .6, tBA)), fvU = land(t, tFive - .1, .7) * (1 - span(t, tBA - .6, tBA));
    box(LX + 60, 250, 170, 84, '—', 'DATE', bxU, false);
    box(LX + 270, 250, 250, 84, '5–20 YEARS', null, fvU, true);
    if (fvU > 0) F.goldText(ctx, [['A MACHINE THAT LEARNS LIKE A HUMAN', 0]], LX + 60, 390, 28, rise(span(t, tFive + .2, tFive + .9)) * (1 - span(t, tBA - .6, tBA)), { serif: false, weight: 700, spacing: .08, col: CREAM });
    // 9.13 the three cards fly onto the line (BEFORE side), 9.16 open wide, 9.17 sound rings to you
    const YOU = { x: LX - 170, h: 130 };
    const op = mv(t, tSecret - .1, 1.2);
    CARDS.forEach(([l1, l2, t0], i) => {
      const u = span(t, t0 - .1, t0 + .6); if (u <= 0) return;
      const e = expoOut(u), cw = 300 * lerp(1, .06, L.e), x1 = L.x - 30 - cw, y1 = lerp(200 + i * 150, S.GY - S.TOWER.h * .5, L.e);
      const x = lerp(x1 + 1400, x1, e), y = y1 - Math.sin(Math.PI * u) * 80;
      if (L.e < .97) { F.goldSpan(ctx, [[x + cw, y + cw * .19], [L.x, y + cw * .19]], 0, e, { w: 1.2, spark: false, a: .6 }); smallCard(ctx, x, y, cw, l1, l2, 1, op * L.k); }
      // sound rings toward you
      if (t > tListen - .2 && L.e < .5) for (let k = 0; k < 3; k++) {
        const t1 = tListen - .2 + i * .15 + k * .7, p = span(t, t1, t1 + 1.5); if (p <= 0 || p >= 1) continue;
        const cx = x + cw / 2, cy = y + cw * .19, r = lerp(30, Math.hypot(cx - YOU.x, cy - (S.GY - 90)), p), a = Math.atan2(S.GY - 90 - cy, YOU.x - cx);
        ctx.strokeStyle = rgba(CREAM, .7 * (1 - p)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, a - .35, a + .35); ctx.stroke();
      }
    });
    // ★ 9.14 the labels BEFORE | AFTER at the top of the line
    const ba = rise(span(t, tBA - .1, tBA + .6)) * (1 - span(t, tSub, tSub + .5));
    if (ba > 0) { F.goldText(ctx, [['BEFORE', .3]], L.x - 40, LY0 + 90, 64, ba, { serif: false, weight: 800, spacing: .1, align: 'right' }); F.goldText(ctx, [['AFTER', .3]], L.x + 40, LY0 + 90, 64, rise(span(t, tBA + .1, tBA + .8)) * (1 - span(t, tSub, tSub + .5)), { serif: false, weight: 800, spacing: .1, col: CREAM }); }
    // 9.15 you, left of the line; NOW at your feet; 9.18 you look up; A.01 subscribe 2 round you
    const yu = span(t, tStill - 1.4, tStill + .1);
    if (yu > 0) {
      const x = lerp(LX - 700, YOU.x, sineIO(yu)), walking = yu < 1;
      halo(ctx, x, S.GY - YOU.h * .55, YOU.h * 1.3, .3, P.coat, P.core1);
      E.du(ctx, x, S.GY, YOU.h, { light: 1, dir: 1, look: walking ? .3 : lerp(.35, .85, mv(t, tNow - .2, 1.2)), walk: walking ? (t - tStill + 1.4) * 6.2 : undefined });
      const nu = rise(span(t, tStill + .3, tStill + .9)) * (1 - span(t, tSub - .4, tSub));
      if (nu > 0) { ctx.fillStyle = rgba(GOLD.core, .9 * nu); ctx.fillRect(x - 44, S.GY - 2, 88, 4); F.goldText(ctx, [['NOW', 1]], x - 60, S.GY - 12, 34, nu, { serif: false, weight: 800, spacing: .12, align: 'right' }); }
      const su = mv(t, tSub - .15, 1.3) * (1 - mv(t, tSub + 1.9, 1.4));
      if (su > 0) B.subRing(ctx, t, x, S.GY - YOU.h * .55, YOU.h * 1.5, su, { size: 46 });
    }
    // 9.08 / 9.09 the call grid out of a block of tower windows (screen space)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const gOut = sineIO(span(t, tWeek - .2, tWeek + .9)), gBack = sineIO(span(t, tAhead - .3, tAhead + .8));
    if (gOut > 0 && gBack < 1 && g) {
      const a = g.cell(1, 6), b = g.cell(3, 7), blk = S.rectToScreen(c, { x: a.x, y: a.y, w: b.x + b.w - a.x, h: b.y + b.h - a.y });
      const Rr = B.lerpR(blk, GRID, gOut * (1 - gBack));
      const res = F.callGrid(ctx, t, Rr, { chrome: gOut * (1 - gBack), tiles: tileList().map((q, i) => ({ ...q, speak: i === 1 ? span(t, tPeople, tPeople + .4) * (1 - span(t, tTrust, tTrust + .3)) : 0 })) });
      // the threads between the tiles: drawn on 'people', snap on 'A fight over trust'
      const th = span(t, tPeople - .2, tPeople + .6), sn = expoOut(span(t, tTrust + .15, tTrust + .9));
      if (res && th > 0) for (const [i, j] of [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [1, 4], [2, 5]]) {
        const A = res.tiles[i], Bt = res.tiles[j], ax = A.x + A.w / 2, ay = A.y + A.h / 2, bx = Bt.x + Bt.w / 2, by = Bt.y + Bt.h / 2, mx = (ax + bx) / 2, my = (ay + by) / 2;
        const gap = .5 * sn;
        F.goldSpan(ctx, [[ax, ay], [lerp(mx, ax, gap), lerp(my, ay, gap) + 18 * sn]], 0, th, { w: 2.2, spark: false, a: .9 });
        F.goldSpan(ctx, [[bx, by], [lerp(mx, bx, gap), lerp(my, by, gap) + 18 * sn]], 0, th, { w: 2.2, spark: false, a: .9 });
        if (sn > 0 && sn < .6) halo(ctx, mx, my, 40, .5 * (1 - sn / .6), GOLD.halo, GOLD.core);
      }
    }
    // 9.07 the title over the tower (A3, ≤ 2.5 s)
    const tu = span(t, tsw + .45, tsw + 1.5), to = span(t, tWeek - .5, tWeek + .15);
    if (tu > 0 && to < 1) F.title(ctx, t, tu, { out: to > 0 ? to : null });
  };

  return [{ t: R.a, draw, print: F.PRINT78 }, { t: tE, draw: (ctx, t) => S.endScreen(ctx, t, T), print: F.PRINT78 }];
};
