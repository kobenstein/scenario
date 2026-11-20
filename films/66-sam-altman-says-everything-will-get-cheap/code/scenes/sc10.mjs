// c10 · B3 · THE DATA AND THE SECOND HALF · Q3 2026: two bars, OUTPUT +3.7 % vs HOURS +0.1 % · the labor share line runs from 1947 and
// ends at its lowest point: 53.0 %, LOWEST SINCE 1947 (preliminary) ★ · no proof: the bars sink, the point stays · the point grows into the
// C4 plate (Acemoglu, centre crop: no Radio Davos / WEF logos) · behind the plate the camera travels back to the promise · the plate goes
// back into the promise's face · "In full": the whole sentence on a quote card, its words light as spoken · "worse off" card · the cards
// sink: the half promise sways, alone in the sky.
// This summer, American businesses → So how does everyone. Plan: docs/shots.md 9.01–9.07. Part of the B3 take (scenes/sc09.mjs: b3()).
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                                  | camera            |
// |-------|---------------------------------|-------------------------------------------------------------------------------------|-------------------|
// | 9.01  | This summer, American businesses| two bars rise from a gold baseline: OUTPUT +3.7 % · HOURS +0.1 % (veil .8)           | glide · EXPL      |
// | 9.02★ | And the share of that income    | the line 1947 → 2026 draws and ends at its lowest point: 53.0 % LOWEST SINCE 1947   | creep · EXPL      |
// | 9.03  | That's no proof                 | the bars sink; the point pulses ("exactly this number") and grows into the plate    | creep · EXPL      |
// | 9.04  | slot:C4                         | C4 Acemoglu (plate out of the data point, back into the promise's face)             | travel (hidden)   |
// | 9.05  | Altman saw it too               | the half promise again; "In full": the whole sentence, words light as spoken        | creep · EXPL      |
// | 9.06  | And if the rules                | quote card: "… most people will end up worse off than they are today."              | creep · EXPL      |
// | 9.07  | Even for him                    | the cards sink; the half promise sways alone in the sky                             | push · SCENE      |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
import { b3, PRINT, CL, CP, panel, caps, big, faceAt } from './sc09.mjs';
const { W, P, rgba, clamp, lerp, span, sineIO, expoOut, smooth, mixHex } = E;
const { rise, GOLD, PAPER, COOL, LAMP } = F;

export default async (T, R) => [{ t: R.a, draw: b3(T).draw, print: PRINT }];
export const firstT = (a) => a.summer;
// the camera at the promise (the half promise top right, the city of thought below it; you are at the house, not on the rooftop)
export const PROM = (k = 1, dx = 0) => CP(1250 + dx, 470, 1.0 * k, 960, 540);

export function anchors(a, G, GE, T) {
  a.summer = G('This summer, American businesses'); a.hours = G('almost the same hours', a.summer); a.share = G('And the share of that income', a.summer);
  a.lowest = G('lowest level on record', a.share); a.proof = G("That's no proof", a.share); a.recently = G('But recently', a.proof);
  a.number = G('pointed to exactly this number', a.recently);
  const c4 = T.clip('C4'); a.c4s = c4.start; a.c4e = c4.end;
  a.saw = G('Altman saw it too', a.c4e - 1); a.second = G('His promise has a second part', a.saw); a.full = G('In full', a.saw);
  a.rules = G("And if the rules don't adapt", a.full); a.essay = G('In the same essay', a.rules); a.most = G('most people will end up', a.essay);
  a.evenHim = G('Even for him', a.most);
}
// the labor share, nonfarm business (BLS), drawn as the shape of its history: high and flat for decades, down since 2000, lowest now
// (illustrative path through approximate values; only the end point is printed: 53.0 %, preliminary)
const LS = [[1947, 65.5], [1952, 64.8], [1957, 65.6], [1961, 64.1], [1966, 63.0], [1970, 65.6], [1975, 62.8], [1980, 64.4], [1985, 62.6], [1990, 63.3],
  [1995, 62.4], [2000, 63.6], [2004, 60.2], [2008, 60.6], [2012, 57.0], [2016, 58.0], [2019, 57.5], [2020, 58.9], [2022, 56.6], [2024, 55.6], [2026, 53.0]];
const CH = { x: 900, y: 330, w: 820, h: 470 };   // the chart panel (screen)
const lx = (yr) => CH.x + 50 + (yr - 1947) / 79 * (CH.w - 110), ly = (v) => CH.y + 130 + (66 - v) / 13.5 * 250;
const PT_END = [lx(2026), ly(53.0)];

export function layer(a, T) {
  const barU = (t) => span(t, a.summer - .1, a.summer + .9) * (1 - sineIO(span(t, a.proof - .1, a.proof + 1.1)));
  const lineU = (t) => span(t, a.share - .3, a.share + .6) * (1 - span(t, a.c4s + .6, a.c4s + .9));
  const drawU = (t) => sineIO(span(t, a.share + .2, a.lowest + .7));
  const mIn = (t) => span(t, a.c4s - 1.6, a.c4s + .2), mOut = (t) => span(t, a.c4e - .2, a.c4e + 1.6);
  const q1 = (t) => span(t, a.full - .35, a.full + .6) * (1 - span(t, a.evenHim - .1, a.evenHim + .8));
  const q2 = (t) => span(t, a.rules - .25, a.rules + .7) * (1 - span(t, a.evenHim + .15, a.evenHim + 1.0));
  return {
    keys: [
      [a.summer + .8, CL(5960, 700, 1.05, 960, 560)],
      [a.c4s - .6, CL(6010, 690, 1.12, 960, 560)],
      [a.c4s + 1.4, CL(5800, 680, 1.0, 960, 560)],
      [a.c4e - 1.4, PROM(.98, -30)],
      [a.second + 1.0, PROM(1.0, -10)],
      [a.evenHim, PROM(1.02, 0)],
      [a.evenHim + 3.6, PROM(1.07, 20)],
    ],
    world(t, st) {
      // the promise: a breath of light on "a second part"; it sways alone on "Even for him"
      const sw = span(t, a.evenHim - .2, a.evenHim + 1.5);
      st.promise = { ...S.PROMISE_HALF, glow: 1, swing: .035 * sw * Math.sin((t - a.evenHim) * 1.1) + .012 * F.bump(t, a.second, 1.6) };
    },
    veil(t) {
      if (t < a.summer - .3) return 0;
      if (t < a.c4e) return lerp(.8 * sineIO(span(t, a.summer - .3, a.summer + 1.4)), .94, span(t, a.c4s - 1.6, a.c4s));
      const after = lerp(.94, .3, sineIO(span(t, a.c4e, a.c4e + 2)));
      return Math.max(after, .74 * sineIO(span(t, a.full - .5, a.full + .9))) * (1 - sineIO(span(t, a.evenHim, a.evenHim + 1.8)));
    },
    over(ctx, t, c) {
      F.float(ctx, t, .6);
      // 9.01: Q3 2026, two bars on one gold baseline
      const bu = barU(t);
      if (bu > 0) {
        panel(ctx, t, 200, 330, 560, 470, bu);
        const k = expoOut(bu), oy = (1 - k) * 40;
        ctx.save(); ctx.translate(0, oy); ctx.globalAlpha *= clamp(bu * 3);
        caps(ctx, 'Q3 2026', 240, 384, span(bu, .2, 1), { gold: .8, weight: 700 });
        const base = 690;
        F.goldSpan(ctx, [[240, base], [720, base]], 0, smooth(span(t, a.summer + .1, a.summer + 1.1)), { w: 1.2, spark: false });
        const b1 = expoOut(span(t, a.summer + .7, a.summer + 2.1)), b2 = expoOut(span(t, a.hours - .1, a.hours + .8));
        const bar = (x, h, u, col) => { if (u <= 0) return; ctx.fillStyle = E.lin(ctx, 0, base - h, 0, base, [[0, col], [1, mixHex(col, P.night1, .45)]]); ctx.fillRect(x, base - h * u, 150, h * u); };
        bar(280, 3.7 * 62, b1, COOL.body); bar(520, Math.max(4, .1 * 62), b2, LAMP.body);
        if (b1 > 0) big(ctx, '+3.7 %', 355, base - 3.7 * 62 * b1 - 22, 50, span(b1, .3, 1), { align: 'center', gold: 0, glow: false });
        if (b2 > 0) big(ctx, '+0.1 %', 595, base - 30, 50, span(b2, .2, 1), { align: 'center', gold: 0, glow: false });
        caps(ctx, 'OUTPUT', 355, base + 40, span(t, a.summer + .9, a.summer + 1.6), { align: 'center' });
        caps(ctx, 'HOURS', 595, base + 40, span(t, a.hours, a.hours + .7), { align: 'center' });
        ctx.restore();
      }
      // 9.02 ★: the labor share line, 1947 → 2026, ends at its lowest point
      const lu = lineU(t);
      if (lu > 0) {
        panel(ctx, t, CH.x, CH.y, CH.w, CH.h, lu);
        const oy = (1 - expoOut(lu)) * 40; ctx.save(); ctx.translate(0, oy); ctx.globalAlpha *= clamp(lu * 3);
        caps(ctx, 'LABOR SHARE', CH.x + 40, CH.y + 54, span(lu, .2, 1), { gold: .8, weight: 700 });
        const pts = LS.map(([y, v]) => [lx(y), ly(v)]), du = drawU(t);
        ctx.strokeStyle = rgba(P.cream, .18 * lu); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx(1947), ly(53)); ctx.lineTo(lx(2026), ly(53)); ctx.stroke();   // the floor it reaches
        F.goldSpan(ctx, pts, 0, du, { w: 2.2, spark: du < 1 });
        caps(ctx, '1947', lx(1947), CH.y + CH.h - 26, span(lu, .4, 1), { col: P.halo2 });
        caps(ctx, '2026', lx(2026), CH.y + CH.h - 26, span(t, a.lowest - .2, a.lowest + .5), { col: P.halo2, align: 'right' });
        const hit = span(t, a.lowest + .5, a.lowest + .9), pulse = F.bump(t, a.number + .1, 1.4);
        if (hit > 0) {
          E.halo(ctx, PT_END[0], PT_END[1], 30 + 40 * F.bump(t, a.lowest + .5, 1.2) + 50 * pulse, .9 * hit, GOLD.halo, GOLD.core);
          ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(PT_END[0], PT_END[1], 7, 0, 7); ctx.fill();
        }
        big(ctx, F.SOURCES.laborBig.replace('LABOR SHARE ', ''), CH.x + 50, CH.y + 330, 78, span(t, a.lowest + .4, a.lowest + 1.2), { glow: true });
        caps(ctx, F.SOURCES.laborSub, CH.x + 52, CH.y + 372, span(t, a.lowest + .7, a.lowest + 1.4), { gold: .7, weight: 700 });
        caps(ctx, 'PRELIMINARY', CH.x + 52, CH.y + 406, span(t, a.lowest + 1.0, a.lowest + 1.7), { col: P.halo2 });
        ctx.restore();
      }
      // 9.05 / 9.06: the two quote cards (paper; the spoken words turn gold)
      const u1 = q1(t), u2 = q2(t);
      if (u1 > 0) F.quoteCard(ctx, t, T, { text: F.SOURCES.promiseFull, credit: F.SOURCES.promiseFullCredit, x: 200, y: 250, w: 1120, size: 44, u: u1,
        spoken: ['everything necessary will be cheap', 'be able to afford it'], after: a.full - .1, mode: 'hi' });
      if (u2 > 0) F.quoteCard(ctx, t, T, { text: F.SOURCES.worse, credit: F.SOURCES.worseSrc, x: 240, y: 556, w: 1120, size: 44, u: u2, rot: .004,
        spoken: ['most people will end up', 'than they are today'], after: a.essay, mode: 'hi' });
    },
    top(ctx, t, c) {
      F.source(ctx, t, a.summer + .6, a.c4s - 1.8, F.SOURCES.laborSrc);
      // 9.04: the C4 plate grows out of the data point and goes back into the promise's face
      const mi = mIn(t), mo = mOut(t);
      if (mi > 0 && mo < 1) {
        let from;
        if (mo > 0) { const f = faceAt(c); from = f ? [f[0], f[1], 26 * f[2]] : [W / 2, 300, 20]; }
        else { const fl = E.drift(t * 2, 16 * .6, 11), fd = E.drift(t * 2, 10 * .6, 17); from = [PT_END[0] + fl, PT_END[1] + fd, 12]; }
        F.clipPlate(ctx, t, T, 'C4', { from, morph: mi * (1 - mo), dark: .25 * (1 - mi) + .25 * mo });
      }
    },
  };
}
