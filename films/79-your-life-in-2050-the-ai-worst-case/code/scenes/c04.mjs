// Film 79 · c04 THE KITCHEN GOES DARK ON SCHEDULE (K.01–K.12, vo-v2) · builder B1
// PLAN (docs/BRIEF-builders.md §5 gate 1)
//  beats (one picture per sentence):
//   K.01 SZENE  through the lit kitchen window (c03's portal): the kitchen, the lamp on; you come in from the right and stop.
//               On "dark" the lamp goes out in 3 frames (LIGHT-OUT 1 of 3, the planned accent; a one-frame dip before it = anticipation)
//   K.02 MIX    the camera slides to the meter on the wall: a paper slip hangs under it, SCHEDULED · 10:00–14:00
//   K.03 EXPL   iris out of the slip: the 24-h ring; the tower's ring is full, your house's ring loses 10:00–14:00 on "schedule"
//   K.04 SZENE  iris out of the ring's centre = the tower's band in the window: the dark kitchen pulls back, you at the window, the tower
//               shines on behind the fence (the band steady)
//   K.05 EXPL   the night opens out of the band (seamWipe): earlier supply bars, the 2050 bar grows far past them
//   K.06 EXPL   the bar dissolves into slow flow lines that fill the frame (LIKE AIR)
//   K.07 EXPL   the flow splits: a broad carmine stream into THE MACHINES first, one thin amber thread to YOUR HOUSES; "more": broader/thinner
//   K.08 MIX    a paper card unfolds out of the thread's end: BACK IN THE TWENTIES · the eastern grid drawn node by node (PJM)
//   K.09 EXPL   the card folds into the bill: AMERICA'S BIGGEST GRID, the empty bill fills as the houses pay into it, $63.6 BN
//   K.10 EXPL   the $29.4 BN / 46 % segment turns carmine, ESTIMATE · MARKET MONITOR, the source line
//   K.11 EXPL   iris out of your (dark) window in the row: the dark kitchen; the big counter grows out of the HUD: 4 YOUR KITCHEN, FIRST, "?"
//   K.12 MIX    the counter shrinks into the HUD (11:59); the camera glides to the phone propped on the table → portal through its screen (N.01)
//  wow: none of its own (c03 has the rung, c05 the noon chime); accents: the light-out (K.01), the cut blocks (K.03).
//  Light rules: the kitchen lamp is light-out 1; the tower band never flickers; in frames with you your coat keeps a warm rim (veil lighter
//  on you than on the room).
//  HUD: K.01 10:00 (hour 10.0), K.11 NOT NEEDED 4 · YOUR KITCHEN, FIRST (hidden while the big counter is up), K.12 11:59 AM.
// Facts (faktencheck-imac.md §4): Monitoring Analytics (PJM's independent market monitor) via Utility Dive, 20 July 2026: in PJM's last four
// base capacity auctions data-center-driven capacity charges were $29.4 bn = 46 % of $63.6 bn. An ESTIMATE (with a counter-scenario).
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as B from '../lib/f79_b1.mjs';
import { hourAt } from './hud.mjs';
import { INK } from './c01.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM, AMBER } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const veilOn = (ctx, d) => { if (d <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba('#03051a', .5 * d); ctx.fillRect(0, 0, W, H); ctx.restore(); };   // screen space: stays whole under a carrier's zoom
export default function c04(T, R) {
  // ---------------------------------------------------------------- K.01–K.02 · the kitchen goes dark; the slip on the meter
  const camK1 = (t, s) => camK(t, [[s.a - .6, cam3({ z: -110, x: 85, y: -10 })], [s.w('dark'), cam3({ z: -80, x: 60, y: -10 })],
    [s.r('K.02') + 1.0, aim(5200, 500, 470, 1.14, W * .44, H * .5)], [s.b + .6, aim(5200, 497, 490, 1.17, W * .45, H * .5)]], .3);
  const lampAt = (t, td) => (t < td ? 1 - .3 * K.bump(t, td - .42, .07) : 1 - span(t, td, td + .1));   // out in 3 frames
  const darkAt = (t, td) => (t < td ? 0 : .78 * span(t, td, td + .1) + .22 * K.sineIO(span(t, td + .1, td + 1.2)));
  const K01 = {
    id: 'K.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK1(t, s), td = s.w('dark'), lamp = lampAt(t, td), dark = darkAt(t, td);
      const wk = span(t, s.a - .3, s.a + 1.5), yx = lerp(1880, 1500, K.sineIO(wk));
      S.kitchen(ctx, t, c, L, { lamp, dark, meter: 'GRID', boyX: -4000, pod: .2 + ((t * .09) % 1) * 1.2 });
      K.stage(ctx, c, [
        [5200, () => B.meterSlip(ctx, t, .45 + .55 * span(t, s.r('K.02') - .4, s.r('K.02') + .4))],
        [1500, () => { K.you(ctx, t, yx, 1070, 560, { dir: -1, walk: wk > 0 && wk < 1 ? K.walkPh(t, .9) : undefined, look: t > td ? lerp(-.35, .35, span(t, td + .05, td + .6)) : -.3, back: .45 }); }],
      ]);
      veilOn(ctx, dark * .35 * (1 - span(t, s.r('K.02'), s.r('K.02') + .8)));
    },
    out: { k: 'fn', fn: B.irisSoft((t) => { const a = R['K.01'], s = { a, b: R['K.03'], r: (id) => R[id], w: (ph) => T.G(ph, 0, a - 1.5) }, p = project(camK1(t, s), 5200, B.SLIP.x + B.SLIP.w / 2, B.SLIP.y + B.SLIP.h / 2); return [p[0], p[1], 34 * p[2]]; }, { rim: '#ffd6de' }), lead: .5, dur: 1.5 },
  };
  // ---------------------------------------------------------------- K.03 · the 24-h ring
  const RC = [960, 520, 300];
  const K03 = {
    id: 'K.03',
    draw(ctx, t, s) {
      K.dusk(ctx, t, { glow: [960, 520] });
      const ts = s.w('schedule'), u = span(t, s.a - .35, s.a + .7), cut = span(t, ts, ts + .7);
      const dim = 1 - .65 * K.sineIO(span(t, s.b - .7, s.b + .4));   // the rings dim as the iris opens (less contrast under its rim)
      ctx.save(); ctx.globalAlpha = dim; B.ring24(ctx, t, RC[0], RC[1], RC[2], { u, cut, label: span(t, ts + .4, ts + .9), k: 1 + .03 * span(t, s.a, s.b + .5) }); ctx.restore();
    },
    out: { k: 'fn', fn: B.irisSoft(() => [RC[0], RC[1], 40], { rim: '#ffd6de' }), lead: .5, dur: 1.6 },
  };
  // ---------------------------------------------------------------- K.04 · the dark kitchen, the tower shines on
  const BAND = [1604, 266], FLOWY = B.FLOW.y;   // the tower's band in the kitchen window (card 5200: windowView tower at 1240+.7·520, 170+.78·430)
  const camK4 = (t, s) => camK(t, [[s.a - .6, cam3({ z: -75, x: 150, y: -24 })],
    [s.b - .7, cam3({ z: 10, x: 200, y: -36 })], [s.b + .4, aim(5200, BAND[0], BAND[1], 1.3, W / 2, H * .5), 's']], .3);
  const K04 = {
    id: 'K.04',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK4(t, s);
      S.kitchen(ctx, t, c, L, { lamp: 0, dark: 1, meter: 'GRID', boyX: -4000, pod: .2 + ((t * .09) % 1) * 1.2 });
      K.stage(ctx, c, [[5200, () => B.meterSlip(ctx, t, .3)], [1500, () => K.you(ctx, t, 1560, 1070, 560, { dir: 1, look: .35 + .05 * Math.sin(t * .4), back: .9 })]]);
      veilOn(ctx, .3);
    },
    out: { k: 'fn', fn: (ctx, u, dA, dB, t) => { const p = project(camK4(t, { r: (id) => R[id], a: R['K.04'], b: R['K.05'] }), 5200, BAND[0], BAND[1]); B.seamWipe(p ? p[1] : FLOWY)(ctx, u, dA, dB); }, lead: .5, dur: 1.4 },
  };
  // ---------------------------------------------------------------- K.05–K.07 · power like air; the machines breathe first
  const K05 = {
    id: 'K.05',
    draw(ctx, t, s) {
      K.dusk(ctx, t, { glow: [lerp(960, 1500, span(t, s.r('K.07'), s.b)), 560] });
      const t6 = s.r('K.06'), t7 = s.r('K.07');
      B.powerFlow(ctx, t, {
        bars: span(t, s.a - .3, s.a + 1.2), bar: span(t, s.w('more') - .1, s.w('ever') + .4),
        flow: span(t, t6 - .1, s.w('air') + .3), split: K.sineIO(span(t, s.w('machines') - .25, s.w('breathe') + .35)),
        first: span(t, s.w('breathe') - .1, s.w('first') + .6), thread: span(t, s.w('first') + .3, s.w('and') + .4), more: K.sineIO(span(t, s.w('always'), s.w('use') + 1.0)),
      });
      const ta = span(t, s.w('air') - .1, s.w('air') + .5) * (1 - span(t, t7 - .2, t7 + .3));
      if (ta > 0) K.words(ctx, 'like air', W / 2, 120, 64, ta, { serif: true, align: 'center', glow: false });
    },
    out: null,
  };
  // ---------------------------------------------------------------- K.08–K.10 · BACK IN THE TWENTIES: the eastern grid; the bill; the 46 %
  const CARD = [420, 170, 1080, 640];
  const K08 = {
    id: 'K.08',
    draw(ctx, t, s) {
      const t9 = s.r('K.09'), t10 = s.r('K.10');
      // the split of K.07 stays under the card (the same night), then the bill takes its place
      const hold = 1 - span(t, s.a + .4, s.a + 1.2);
      if (hold > 0) { K.dusk(ctx, t, { glow: [1500, 560] }); B.fadeLayer(ctx, K.sineIO(hold), (g) => B.powerFlow(g, t, { bars: 0, bar: 0, flow: 1, split: 1, first: 1, thread: 1, more: 1 })); }
      else { const gm = K.sineIO(span(t, s.a + 1.2, s.a + 3.2)); K.dusk(ctx, t, { glow: [lerp(1500, W * .4, gm), lerp(560, H * .45, gm)] }); }
      const bu = span(t, t9 + .1, t9 + .9);
      if (bu > 0) B.pjmBill(ctx, t, { u: bu, pay: span(t, s.w('customers'), s.w('ready') + .3), seg: span(t, s.w('data') - .1, s.w('half') + .2), est: span(t, s.w("watchdog's") + .1, s.w('estimate') + .5), you: span(t, t10 + 2.5, t10 + 3.2) });
      const u = B.cardS(t, s.a, t9 + 1.0, .85), from = t < t9 ? B.FLOW.homes : [B.PJM.x0 + 40, B.PJM.y + B.PJM.h / 2];
      if (u > 0) K.scr(ctx, (c) => K.paper(c, t, CARD[0], CARD[1], CARD[2], CARD[3], u, { from, head: 'BACK IN THE TWENTIES', draw: (g, x, y, w, h) => {
        g.fillStyle = K.PAPER.ink; g.font = '60px "Instrument Serif"'; g.fillText('The first sign', x + 10, y + 64);
        g.font = '600 22px Inter'; g.letterSpacing = '0.14em'; g.fillStyle = K.PAPER.ink2; g.fillText('PJM · THE EASTERN U.S. GRID', x + 14, y + 108); g.letterSpacing = '0em';
        B.gridMapInk(g, t, x + w * .3, y + 30, w * .66, h - 40, span(t, s.a, s.a + 2.0), span(t, s.a + 1.4, s.a + 2.2));
      } }));
    },
    out: { k: 'fn', fn: B.irisSoft(() => [B.PJM.x0 + 80 + B.PJM.you * ((B.PJM.x1 - B.PJM.x0 - 160) / (B.PJM.n - 1)), B.PJM.hy - 40, 30], { rim: AMBER.core }), lead: .55, dur: 1.6 },
  };
  // ---------------------------------------------------------------- K.11–K.12 · the dark kitchen; YOUR KITCHEN, FIRST; the phone waits
  const camK11 = (t, s) => camK(t, [[s.a - .5, aim(2400, 960, 560, 1.04, W * .5, H * .5)], [s.r('K.12') - .2, aim(2400, 1000, 600, 1.12, W * .5, H * .52)],
    [s.b + .5, aim(2400, B.PHONE.x + B.PHONE.w / 2, B.PHONE.y + B.PHONE.h / 2, 2.0, W * .5, H * .5), 's']], .3);
  const K11 = {
    id: 'K.11',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK11(t, s), t12 = s.r('K.12'), gl = span(t, s.w('Listen.') - .2, s.b + .6);
      S.kitchen(ctx, t, c, L, { lamp: 0, dark: 1, meter: 'GRID', boyX: -4000, pod: .2 + ((t * .09) % 1) * 1.2, box: (g, tt) => B.phoneStand(g, tt, L, { glow: gl, time: '11:59' }) });
      K.stage(ctx, c, [[1500, () => K.you(ctx, t, 1500, 1070, 560, { dir: 1, look: .3 + .06 * Math.sin(t * .4), back: .9 })]]);
      veilOn(ctx, .15);
      const g = K.expoOut(span(t, s.a + .1, s.a + 1.0)) * (1 - K.sineIO(span(t, t12 - 1.0, t12 - .35)));
      B.bigCounter(ctx, t, g, 4, { 3: 'YOUR KITCHEN, FIRST' }, { fill: span(t, s.w('machines') - .1, s.w('first') + .3), q: span(t, s.w('second?') - .1, s.w('second?') + .5) });
    },
    out: { k: 'fn', fn: B.maskGrow((t) => { const s = { r: (id) => R[id], a: R['K.11'], b: R['N.01'] }, c = camK11(t, s), a = project(c, 2400, B.PHONE.x + 6, B.PHONE.y + 8), b = project(c, 2400, B.PHONE.x + B.PHONE.w - 6, B.PHONE.y + B.PHONE.h - 8); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }), lead: .7, dur: 1.6 },
  };
  return [K01, K03, K04, K05, K08, K11];
}
