// c03 · STATION 1 · KNOWLEDGE & ADVICE · the office window again · his own example (the Fed quote) · 10× a year · translators 30 % ·
// cost ≠ price · ≈ 90 % billed by the hour · FALLS FIRST ★ · the dust drifts on to the college ("nearly free, price kept climbing").
// 'Start where a price' → "Education. It's on his list" · B1 (20.11.). Plan: docs/shots.md 2.01–2.09.
// Part of the B1 take: the picture is b1(T).draw from scenes/sc02.mjs (one camera, one world); this file adds the c03 layers
// (camera keys, tag 1, the translator's window, the law firm's tower, the explainers) and its anchors.
//
// | ID    | anchor (phrase)              | picture (one idea)                                                                    | camera / carrier      |
// |-------|------------------------------|---------------------------------------------------------------------------------------|-----------------------|
// | 2.01  | Start where a price          | glide down to station 1: the office tower, the programmer's window; tag 1 lights      | glide down · window   |
// | 2.02  | Knowledge and advice         | the tag's name writes on its face (the clock names it)                                 | creep · the tag       |
// | 2.03  | That programmer's week       | paper quote card: the Fed quote · his estimate                                         | creep · the card      |
// | 2.04  | And by his count             | 10× and gold steps down (one per year); the 10x quote; Epoch AI ≈ 13× (source line)    | creep · the steps     |
// | 2.05  | Across Europe                | a second lit window rises next door: a translator, her paper stacks shrink · 30 %       | truck · the window    |
// | 2.06  | But a falling cost           | two lines: COST falls steeply (cool), PRICE barely moves (gold)                        | creep · the lines     |
// | 2.07  | Law firms have AI too        | a law firm's tower rises: its windows run meters of billed hours (faster on "raised") · ≈ 90 % | truck right · meters |
// | 2.08★ | So that's what gets cheap    | push in: tag 1 drops and crumbles · FALLS FIRST (and on the clock)                     | push in · the dust    |
// | 2.09  | Which explains a strange case| the dust drifts right, over to the college's arched windows                            | glide right · dust    |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
const { P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, mixHex, halo } = E;
const { rise, GOLD, COOL, LAMP, PAPER } = F;

export default async (T, R) => { const { b1 } = await import('./sc02.mjs'); E.prepareEditorial(); return [{ t: R.a, draw: b1(T).draw, print: F.PRINT66 }]; };

export function anchors03(T, a) {
  const G = (p, after) => T.G(p, 0, after);
  a.start1 = G('Start where a price', a.qE); a.notLift = G('Not lifting', a.start1); a.thinking1 = G('Thinking', a.notLift);
  a.know = G('Knowledge and advice', a.start1);
  a.progWeek = G("That programmer's week", a.know); a.ownEx = G("Altman's own example", a.progWeek);
  a.count = G('And by his count', a.ownEx); a.tenTimes = G('ten times cheaper', a.count); a.everyYear = G('every year', a.tenTimes);
  a.europe = G('Across Europe', a.everyYear); a.threeTen = G('three in ten', a.europe); a.costWork = G('cost them work', a.europe);
  a.falling = G('But a falling cost', a.costWork); a.fPrice = G('a falling price', a.falling);
  a.law = G('Law firms have', a.fPrice); a.vast = G('the vast majority', a.law); a.billed = G('billed by the hour', a.law); a.raised = G('even raised their rates', a.law);
  a.cheapFirst = G("So that's what gets cheap first", a.raised); a.pureThinking = G('pure thinking', a.cheapFirst); a.competition = G('as fast as competition', a.cheapFirst);
  a.strange = G('Which explains a strange case', a.competition); a.nearlyFree = G('became nearly free', a.strange); a.climbing = G('kept climbing', a.strange);
}

// land card px (the world: station 1 = the office at x 1180; these two buildings rise out of the ground when the voice needs them)
const TR = { x0: 1330, x1: 1470, top: S.GY - 190, win: { x: 1350, y: 748, w: 100, h: 84 } };   // the translator's building, right of the office
const LAW = { x0: 1505, x1: 1690, top: S.GY - 490 };                                           // the law firm's tower
const ST1 = (dx = 0, s = 1.9) => E.aim(S.Z_LAND, 1180 + dx, 640, s, 1300, 540);
const TAG1 = (s = 2.4, dx = 0) => E.aim(S.Z_LAND, 1180 + dx, 560, s, 960, 520);

export function layers03(a, T) {
  const veil = (t) => .48 * smooth(span(t, a.progWeek - .4, a.progWeek + .5)) * (1 - smooth(span(t, a.cheapFirst - 1.2, a.cheapFirst + .2)));
  const trU = (t) => span(t, a.europe - .35, a.europe + 1.0), lawU = (t) => span(t, a.law - .35, a.law + 1.1);
  // explainer windows (u in, o out)
  const fedU = (t) => span(t, a.progWeek - .1, a.progWeek + .7), fedO = (t) => span(t, a.count - .1, a.count + .3);
  const tenU = (t) => span(t, a.count + .05, a.count + .8), tenO = (t) => span(t, a.europe - .15, a.europe + .2);
  const stepsU = (t) => span(t, a.tenTimes - .1, a.everyYear + .5);
  const trtU = (t) => span(t, a.threeTen - .15, a.threeTen + .6), trtO = (t) => span(t, a.falling - .2, a.falling + .15);
  const costU = (t) => span(t, a.falling + .05, a.fPrice - .3), priceU = (t) => span(t, a.fPrice - .1, a.fPrice + .9), cpO = (t) => span(t, a.law + .1, a.law + .45);
  const legU = (t) => span(t, a.vast - .15, a.vast + .6), legO = (t) => span(t, a.cheapFirst - 1.0, a.cheapFirst - .65);
  const verdU = (t) => span(t, a.cheapFirst + .35, a.cheapFirst + 1.25) * (1 - span(t, a.strange - .3, a.strange + .4));
  const dustEnv = (t) => span(t, a.strange - .4, a.strange + 1.4) * (1 - span(t, a.edu + .8, a.edu + 3.2));
  const meterRate = (t) => .16 + .22 * smooth(span(t, a.raised - .1, a.raised + 1.2));

  function translator(ctx, t) {
    const u = trU(t); if (u <= 0) return;
    const up = (1 - expoOut(u)) * (S.GY - TR.top + 30);
    ctx.save(); ctx.beginPath(); ctx.rect(TR.x0 - 40, -4000, TR.x1 - TR.x0 + 80, S.GY + 4000); ctx.clip(); ctx.translate(0, up);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .32); ctx.fillRect(TR.x0, TR.top, TR.x1 - TR.x0, S.GY - TR.top + 4);
    const R = TR.win, lit = smooth(span(u, .5, 1));
    halo(ctx, R.x + R.w / 2, R.y + R.h / 2, R.w, .16 * lit, GOLD.halo, LAMP.core);
    ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
    ctx.fillStyle = E.lin(ctx, 0, R.y, 0, R.y + R.h, [[0, mixHex(P.ind1, LAMP.deep, .55 * lit)], [1, mixHex(P.night1, LAMP.deep, .3 * lit)]]); ctx.fillRect(R.x, R.y, R.w, R.h);
    ctx.fillStyle = P.night0; ctx.fillRect(R.x + 8, R.y + R.h - 22, R.w - 16, 5); ctx.fillRect(R.x + 14, R.y + R.h - 17, 4, 17); ctx.fillRect(R.x + R.w - 18, R.y + R.h - 17, 4, 17);
    // the paper stacks (her assignments): they shrink on "cost them work", one after another
    for (let i = 0; i < 3; i++) { const n = Math.round(lerp(6 - i, 1, smooth(span(t, a.costWork - .3 + i * .25, a.costWork + .5 + i * .25)))); for (let j = 0; j < n; j++) { ctx.fillStyle = mixHex(PAPER.body, P.night1, .25 + .1 * (j % 2) + .4 * span(t, a.costWork, a.costWork + 1.5)); ctx.fillRect(R.x + 40 + i * 15, R.y + R.h - 25 - j * 3.2, 13, 2.6); } }
    halo(ctx, R.x + 22, R.y + R.h - 44, 18, .45 * lit, GOLD.halo, LAMP.core);
    E.person(ctx, R.x + R.w - 22, R.y + R.h + 2, 50, { dir: -1, light: .6, lean: .14 + .03 * Math.sin(t * .5), look: -.3 });
    ctx.restore();
    ctx.strokeStyle = mixHex(P.night1, P.blue2, .4); ctx.lineWidth = 3; ctx.strokeRect(R.x, R.y, R.w, R.h);
    ctx.restore();
  }
  function lawTower(ctx, t) {
    const u = lawU(t); if (u <= 0) return;
    const up = (1 - expoOut(u)) * (S.GY - LAW.top + 40);
    ctx.save(); ctx.beginPath(); ctx.rect(LAW.x0 - 40, -4000, LAW.x1 - LAW.x0 + 80, S.GY + 4000); ctx.clip(); ctx.translate(0, up);
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(LAW.x0, LAW.top, LAW.x1 - LAW.x0, S.GY - LAW.top + 4);
    ctx.fillRect(LAW.x0 + 30, LAW.top - 26, LAW.x1 - LAW.x0 - 60, 30); ctx.fillRect((LAW.x0 + LAW.x1) / 2 - 3, LAW.top - 80, 6, 56);
    // the windows: each runs a meter (a warm bar that fills and starts again): billed hours. Faster after "raised their rates".
    const cols = 3, rows = 8, ww = 38, wh = 26, gx = (LAW.x1 - LAW.x0 - cols * ww) / (cols + 1);
    const r = E.prng(902), lit = smooth(span(u, .4, 1)), rate = meterRate(t);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = LAW.x0 + gx + i * (ww + gx), y = LAW.top + 30 + j * 50, q = r();
      ctx.fillStyle = mixHex(P.night1, LAMP.deep, .25 * lit); ctx.fillRect(x, y, ww, wh);
      const ph = ((t - a.law) * rate * (.8 + .4 * q) + q) % 1, f = clamp(ph * 1.15);
      ctx.fillStyle = rgba(LAMP.body, (.55 + .3 * q) * lit); ctx.fillRect(x + 4, y + wh - 9, (ww - 8) * f, 5);
      for (let k = 1; k < 4; k++) { ctx.fillStyle = rgba(P.night0, .6); ctx.fillRect(x + 4 + (ww - 8) * k / 4, y + wh - 10, 1.5, 7); }   // hour ticks
    }
    ctx.restore();
  }
  function dustStream(ctx, t) {   // 2.09: the dust of tag 1 drifts right, over to the college's arched windows
    const env = dustEnv(t); if (env <= 0) return;
    const r = E.prng(3301); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 110; i++) {
      const q = r(), sp = r(), sz = r(), off = (r() - .5) * 80;
      const p = (t * (.06 + .05 * sp) + q) % 1, x0 = 1150, y0 = 600, x1 = 1830 + q * 380, y1 = 760 + sp * 60, cx = 1520, cy = 420;
      const m = 1 - p, x = m * m * x0 + 2 * m * p * cx + p * p * x1, y = m * m * y0 + 2 * m * p * cy + p * p * y1 + off * Math.sin(Math.PI * p);
      const al = env * Math.sin(Math.PI * p) * (.35 + .5 * q);
      ctx.fillStyle = rgba(q > .7 ? GOLD.core : GOLD.body, al); const s = 2 + 4 * sz * sz; ctx.fillRect(x, y, s, s);
    }
    ctx.restore();
  }
  function steps(ctx, t, x, y, u) {   // gold steps down: one step per year, each a tenth (drawn on a log scale: equal drops)
    if (u <= 0) return;
    const sw = 120, sd = 92, pts = [[x, y]]; for (let i = 0; i < 4; i++) { const px = x + i * sw; pts.push([px + sw, y + i * sd], [px + sw, y + (i + 1) * sd]); }
    F.goldSpan(ctx, pts, 0, smooth(u), { w: 4 });
  }

  return {
    camKeys: [
      [a.start1 + 3.4, ST1(0)], [a.progWeek, ST1(8, 1.91)], [a.europe - .4, ST1(16, 1.92)], [a.europe + 2.0, ST1(70, 1.92)],
      [a.law - .1, ST1(84, 1.93)], [a.law + 2.1, ST1(220, 1.9)], [a.cheapFirst - .7, ST1(232, 1.91)],
      [a.cheapFirst + 1.3, TAG1(2.4)], [a.strange - .25, TAG1(2.46, 6)],
      [a.strange + 3.0, E.aim(S.Z_LAND, 1620, 610, 1.72, 1080, 540)],
    ],
    veil,
    tags(tags, t) {
      const g = tags[0]; if (!g) return;
      const lit = span(t, a.start1 + 1.0, a.start1 + 2.6), e = sineIO(span(t, a.cheapFirst - .1, a.cheapFirst + 1.6));
      g.glow = lerp(Math.max(g.glow, lerp(.35, 1, lit)), .55, e);
      g.dy += 70 * e - 10 * F.bump(t, a.cheapFirst + 1.2, .8); g.dust = .6 * e;
      g.swing = (g.swing ?? 0) + .07 * F.bump(t, a.cheapFirst - .05, 1.4) * Math.sin(t * 6);
      g.lines = [['KNOWLEDGE', 15, 0, false], ['& ADVICE', 15, 0, false]];
      g.textU = span(t, a.know - .1, a.know + .6) * (1 - span(t, a.cheapFirst + .05, a.cheapFirst + .35));
    },
    land(ctx, t) { translator(ctx, t); lawTower(ctx, t); dustStream(ctx, t); },
    screen(ctx, t, c) {
      if (t < a.progWeek - .5 || t > a.strange + 1) return;
      ctx.save(); F.float(ctx, t, .6);
      // 2.03 his own example
      const fu = fedU(t) * (1 - fedO(t));
      if (fu > 0) F.quoteCard(ctx, t, T, { u: fu, text: F.SOURCES.fed, x: 110, y: 190, w: 900, size: 46, credit: F.SOURCES.fedSrc });
      // 2.04 ten times cheaper every year
      const tu = tenU(t) * (1 - expoIn(tenO(t)));
      if (tu > 0) {
        F.maskLine(ctx, [[F.SOURCES.tenX, 0]], 120, 250, 34, rise(tu), { serif: true, col: P.cream, glow: false });
        F.goldText(ctx, [['10×', 1]], 120, 470, 150, rise(span(t, a.tenTimes - .2, a.tenTimes + .5)) * (1 - expoIn(tenO(t))), { serif: true, glow: true });
        steps(ctx, t, 440, 330, stepsU(t) * (1 - tenO(t)));
      }
      // 2.05 three in ten translators
      const ru = trtU(t) * (1 - expoIn(trtO(t)));
      if (ru > 0) {
        F.goldText(ctx, [['30 %', 1]], 120, 430, 150, rise(ru), { serif: true, glow: true });
        F.maskLine(ctx, [['REPORT FEWER ASSIGNMENTS', 0]], 126, 500, 28, rise(span(ru, .2, 1)), { serif: false, weight: 700, col: P.cream, glow: false });
        F.maskLine(ctx, [['OR CLIENTS BECAUSE OF AI', 0]], 126, 542, 28, rise(span(ru, .3, 1)), { serif: false, weight: 700, col: P.cream, glow: false });
      }
      // 2.06 cost falls, price barely moves
      const co = cpO(t);
      if (costU(t) > 0 && co < 1) {
        const x0 = 150, x1 = 880, k = 1 - expoIn(co), pc = [[x0, 300], [x0 + 200, 330], [x0 + 380, 430], [x0 + 560, 560], [x1, 650]].map(([x, y]) => [x, y + 60 * (1 - k)]);
        const pp = [[x0, 330], [x0 + 240, 334], [x0 + 480, 328], [x1, 338]].map(([x, y]) => [x, y + 60 * (1 - k)]);
        ctx.save(); ctx.globalAlpha *= k;
        ctx.strokeStyle = rgba(COOL.line, .9); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const cu = smooth(costU(t)); ctx.beginPath(); let L = 0; const tot = pc.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pc[i][0], p[1] - pc[i][1]), 0);
        ctx.moveTo(...pc[0]); for (let i = 1; i < pc.length; i++) { const seg = Math.hypot(pc[i][0] - pc[i - 1][0], pc[i][1] - pc[i - 1][1]); const f = clamp((cu * tot - L) / seg); if (f <= 0) break; ctx.lineTo(lerp(pc[i - 1][0], pc[i][0], f), lerp(pc[i - 1][1], pc[i][1], f)); L += seg; }
        ctx.stroke();
        F.maskLine(ctx, [['COST', 0]], x1 + 20, 664, 34, rise(span(costU(t), .6, 1)), { serif: false, weight: 700, col: COOL.text, glow: false });
        F.goldSpan(ctx, pp, 0, smooth(priceU(t)), { w: 4 });
        F.maskLine(ctx, [['PRICE', 0]], x1 + 20, 350, 34, rise(span(priceU(t), .5, 1)), { serif: false, weight: 700, col: GOLD.text, glow: false });
        ctx.restore();
      }
      // 2.07 billed by the hour
      const lu = legU(t) * (1 - expoIn(legO(t)));
      if (lu > 0) {
        F.goldText(ctx, [['≈ 90 %', 1]], 120, 430, 150, rise(lu), { serif: true, glow: true });
        F.maskLine(ctx, [['OF LEGAL SPEND', 0]], 126, 500, 28, rise(span(lu, .2, 1)), { serif: false, weight: 700, col: P.cream, glow: false });
        F.maskLine(ctx, [['STILL BILLED BY THE HOUR', 0]], 126, 542, 28, rise(span(lu, .3, 1)), { serif: false, weight: 700, col: P.cream, glow: false });
      }
      ctx.restore();
      // 2.08 the verdict beside the falling tag (screen px from the tag's place on the land)
      const vu = verdU(t);
      if (vu > 0) { const p = E.project(c, S.Z_LAND, S.STATIONS[0].x + 100, S.TAG_Y + 210); if (p) F.verdict(ctx, t, p[0], p[1], 'FALLS FIRST', vu, { size: 40, align: 'left' }); }
    },
    sources(ctx, t) {
      F.source(ctx, t, a.count + .3, a.europe - .25, F.SOURCES.tenXSrc);
      F.source(ctx, t, a.threeTen + .1, a.falling - .25, F.SOURCES.translatorsSrc);
      F.source(ctx, t, a.vast + .1, a.cheapFirst - .7, F.SOURCES.legalSrc);
    },
  };
}
