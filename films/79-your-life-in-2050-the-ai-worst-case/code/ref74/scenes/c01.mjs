// Film 74 · c01 HOOK (H.01–H.25): your street at 0:00 (title), the timeline, bedroom, kitchen + the alarm clock + the flashback card,
// the street through the kitchen window, the hallway with the GONE counter, the door → YOUR STREET (one long shot, a new view per sentence).
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
export const INK = { base: '#1f3c8a', lit: '#3a5aa8', shade: '#16296a', deep: '#0e1a4a', hem: .44 };
// carrier: the road line becomes the timeline (B opens in a band out of a gold line at y)
export const lineWipe = (y) => (ctx, u, dA, dB) => {
  const e = K.quartIO(u), h = H * 1.25 * e;
  dA(ctx);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(-10, y - h * (y / H), W + 20, h); ctx.clip(); dB(ctx); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - span(u, .6, 1); const g = K.expoOut(span(u, 0, .45));
  K.goldLine(ctx, [[W / 2 - W * .55 * g, y], [W / 2 + W * .55 * g, y]], 1, { w: 5, blur: 16 }); ctx.restore();
};
// the brass alarm clock in blue ink (inside the flashback card)
function inkClock(ctx, t, x, y, r, ring) {
  const sh = ring * Math.sin(t * 60) * .08; ctx.save(); ctx.translate(x, y); ctx.rotate(sh); K.ink(ctx, K.PAPER.ink, 3);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * r * .62, -r * .95, r * .4, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s * r * .5, r * .85); ctx.lineTo(s * r * .75, r * 1.2); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * .7); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(1.57 + .13) * r * .45, Math.sin(1.57 + .13) * r * .45); ctx.stroke();   // 6:15 (minute up-ish, hour down)
  ctx.font = `600 ${Math.round(r * .34)}px Inter`; ctx.textAlign = 'center'; ctx.fillText('6:15', 0, r * .52);
  if (ring > 0) for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { ctx.globalAlpha = ring * (1 - k * .28); ctx.beginPath(); ctx.arc(s * r * .62, -r * .95, r * (.62 + k * .2), s < 0 ? 3.5 : 5, s < 0 ? 4.4 : 5.9); ctx.stroke(); }
  ctx.restore();
}

export default function c01(T, R) {
  const r = (id) => R[id];
  // ---------------------------------------------------------------- H.01–H.02 · YOUR STREET 2050, the title
  const camH01 = (t, s) => camK(t, [[0, cam3({ z: -520, y: -30 })], [s.b + .6, cam3({ z: 240, y: 6, x: 30 })]]);
  const H01 = {
    id: 'H.01',
    draw(ctx, t, s) {
      const L = K.hourLook(8.2), c = camH01(t, s);
      S.street(ctx, t, c, L, { apples: 1, bayTrees: 1, chalk: 1, kids: 1, ladder: 1, youNear: [150, 800, 200], walkers: 1 });
      const tg = s.w('get');
      K.scrim(ctx, 600, 240, 720, 240, .3);
      K.words(ctx, '2050', W / 2, 360, 170, span(t, .35, 1.3), { align: 'center' });
      K.words(ctx, [['AI WENT RIGHT', .6]], W / 2, 440, 50, span(t, tg - .1, tg + .7), { align: 'center', serif: false, weight: 600 });
      K.caps(ctx, 'A UTOPIA · IF WE GET IT RIGHT', W / 2, 500, span(t, .05, .6) * (1 - span(t, s.b - .5, s.b)), { size: 24, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'fn', fn: lineWipe(600), lead: .45, dur: 1.0 },
  };
  // ---------------------------------------------------------------- H.03–H.05 · TIMELINE 2026 → 2050 (EXPL)
  const x0 = 300, x1 = 1640, ty = 600, yr = (Y) => lerp(x0, x1, (Y - 2026) / 24), XR = yr(2032);
  const H03 = {
    id: 'H.03',
    draw(ctx, t, s) {
      const tR = s.r('H.04'), tG = s.r('H.05'), z = 1 + .05 * K.sineIO(span(t, s.a, s.b + 1));
      K.dusk(ctx, t, { glow: [lerp(W / 2, x1, span(t, tG, s.b)), ty] });
      K.scr(ctx, (c) => {
        c.translate(lerp(W / 2, x1, .25), ty); c.scale(z, z); c.translate(-lerp(W / 2, x1, .25), -ty);
        c.strokeStyle = rgba('#a9b8f0', .55); c.lineWidth = 3; c.lineCap = 'round'; K.strokeIn(c, [[x0, ty], [x1, ty]], K.expoOut(span(t, s.a - .4, s.a + .6)));
        for (const [Y, lab] of [[2026, '2026 · TODAY'], [2030, '2030'], [2040, '2040'], [2050, '2050']]) {
          const u = span(t, s.a + (Y - 2026) * .03, s.a + .5 + (Y - 2026) * .03); if (u <= 0) continue;
          c.fillStyle = rgba('#cfd8ff', .7 * u); c.fillRect(yr(Y) - 1.5, ty - 12, 3, 24);
          K.glowText(c, lab, yr(Y), ty + 64, { size: Y === 2050 ? 40 : 28, weight: 600, align: 'center', col: Y === 2050 ? '#ffe7a8' : P.cream, a: u, glow: false, spacing: .12 });
        }
        // the gold after the ring
        if (t > tG - .1) K.goldLine(c, [[XR, ty], [x1, ty]], K.sineIO(span(t, tG, tG + 1.3)), { w: 6, blur: 18 });
        // the 2050 dot swells into the morning sun
        const sw = K.expoOut(span(t, tG + .7, s.b + .3)), rS = lerp(9, 64, sw);
        c.fillStyle = K.rad(c, x1, ty, rS * 4, [[0, rgba('#ffe7a8', .5 * (.4 + sw))], [1, rgba('#ffe7a8', 0)]]); c.fillRect(x1 - rS * 4, ty - rS * 4, rS * 8, rS * 8);
        c.fillStyle = K.rad(c, x1, ty, rS, [[0, '#fffdf2'], [.7, '#ffe2a0'], [1, '#f6c95c']]); c.beginPath(); c.arc(x1, ty, rS, 0, 7); c.fill();
        // the ring lands on the line (early 2030s)
        const d = span(t, tR - .35, tR + .25), yy = lerp(ty - 420, ty, K.expoIn(d)), sq = 1 - .25 * K.bump(t, tR + .2, .5);
        if (d > 0) { c.save(); c.translate(XR, yy); c.scale(1 / sq, sq); K.ring(c, t, 0, 0, 44, span(t, tR - .35, tR - .1)); c.restore(); }
        const lu = span(t, tR + .2, tR + .9);
        if (lu > 0) { K.glowText(c, 'SUPERINTELLIGENCE', XR, ty - 290, { size: 40, weight: 600, align: 'center', col: '#e8fbff', a: lu, glow: false, spacing: .14 });
          K.glowText(c, 'EARLY 2030s · A SCENARIO ASSUMPTION', XR, ty - 248, { size: 24, weight: 600, align: 'center', col: '#a9c8e8', a: lu, glow: false, spacing: .12 }); }
        // you walk along it (the coat stays yellow, you stoop a little with the years)
        const Y = 2026 + 5.2 * K.sineIO(span(t, s.a, tR)) + 18 * span(t, tR + .4, s.b + .8), age = (Y - 2026) / 24;
        K.you(c, t, yr(Y) - 40, ty + 8, 200, { walk: K.walkPh(t, .8), dir: 1, lean: .04 + .08 * age, hood: false });
      });
    },
    out: { k: 'iris', c: (t) => [x1 + (x1 - lerp(W / 2, x1, .25)) * .05, ty, 64], lead: .3, dur: 1.1, pushA: .8 },
  };
  // ---------------------------------------------------------------- H.06–H.07 · BEDROOM: you wake up, nothing woke you
  const camBed = (t, s) => camK(t, [[s.a - .6, cam3({ z: -260, x: 80 })], [s.r('H.07') - .2, cam3({ z: -60, x: 40 })], [s.b + .4, aim(1700, 1240, 735, 1.9), 'q']], .8);
  const H06 = {
    id: 'H.06',
    draw(ctx, t, s) { S.bedroom(ctx, t, camBed(t, s), look(R, t), { up: K.expoOut(span(t, s.a - .2, s.a + 1.2)) * .95 + .05, youLook: .2 + .4 * span(t, s.r('H.07'), s.r('H.07') + 1) }); },
    out: { k: 'iris', c: (t, s) => { const p = project(camBed(t, s), 1700, 1240, 754); return [p[0], p[1], 34 * p[2]]; }, lead: .35, dur: 1.0 },
  };
  // ---------------------------------------------------------------- H.08–H.12 · KITCHEN: the alarm clock, the flashback card, she laughs
  let clockAt = [960, 600];
  const camKit = (t, s) => camK(t, [[s.a - .5, cam3({ z: -120, x: 90 })], [s.r('H.09') - .1, cam3({ z: -40, x: 80 })], [s.r('H.09') + 1.1, aim(2400, 930, 600, 1.45, W * .42, H * .52), 'q'],
    [s.r('H.12'), aim(2400, 930, 600, 1.35, W * .42, H * .52)], [s.r('H.12') + 1.4, cam3({ z: 60, x: 260, y: -30 })]], .8);
  const H08 = {
    id: 'H.08',
    draw(ctx, t, s) {
      const L = look(R, t), t9 = s.r('H.09'), t10 = s.r('H.10'), t11 = s.r('H.11'), t12 = s.r('H.12'), c = camKit(t, s);
      const up = K.expoOut(span(t, s.a + .2, s.a + 1.8)), out = K.sineIO(span(t, t9 - .2, t9 + .8)), laugh = K.bump(t, t12 + .1, .45) + .6 * K.bump(t, t12 + .5, .4);
      const a1 = lerp(lerp(1.25, 2.25, up), 1.62, out), a2 = lerp(lerp(1.45, 2.55, up), 1.52, out);
      S.kitchen(ctx, t, c, L, {
        girlX: 690, girlH: 340, girlPose: 'stand', armR: [a1, a2], armL: [-a1 + .15, -a2 + .1], girlLook: lerp(.6, .1, out) + .5 * span(t, t12, t12 + .4), girlHop: laugh * 14, girlLean: -.06 * laugh,
        you: [1480, 1070, 560], youDir: -1, youLook: -.35, youBack: .45,
        clock: (cx, tt, hd) => { const [hx, hy] = hd.R; clockAt = [hx + 20, hy - 30]; S.alarmClock(cx, tt, hx + 20, hy - 30, .62, { ring: 0, rot: -.1 + .05 * Math.sin(tt * .9) }); },
      });
      // the flashback card unfolds out of the clock face (screen space), folds back when she laughs
      const p = project(c, 2400, ...clockAt), u = K.cardU(t, t10, t12 + .55);
      if (u > 0) K.scr(ctx, (cx) => K.paper(cx, t, 1010, 120, 800, 600, u, { from: [p[0], p[1]], head: 'BACK IN THE TWENTIES', draw: (g, x, y, w, h) => {
        const ring = span(t, t11 - .1, t11 + .2) * (1 - span(t, t11 + 2.2, t11 + 2.8));
        inkClock(g, t, x + w * .24, y + h * .42, 92, ring);
        // the door and the figure rushing out of it (to work)
        K.ink(g, K.PAPER.ink2, 3); g.strokeRect(x + w * .54, y + h * .12, w * .16, h * .66); g.fillStyle = rgba(K.PAPER.ink2, .25); g.fillRect(x + w * .54, y + h * .12, w * .16 * (1 - .7 * span(t, t11 + .3, t11 + .8)), h * .66);
        const run = span(t, t11 + .5, t12 - .2), fx = lerp(x + w * .62, x + w * .98, K.sineIO(run));
        if (run > 0) { K.figureRaw(g, fx, y + h * .8, h * .5, { walk: t * 11, dir: 1, lean: .16, look: .1 }, INK, false);
          K.ink(g, K.PAPER.ink2, 2.2); for (let k = 0; k < 3; k++) { const yy = y + h * (.45 + k * .1); g.beginPath(); g.moveTo(fx - 70 - k * 12, yy); g.lineTo(fx - 30 - k * 12, yy); g.stroke(); } }
        g.fillStyle = K.PAPER.ink; g.font = '600 24px Inter'; g.textAlign = 'center'; g.fillText('LATE FOR WORK', x + w * .76, y + h * .96 * Math.min(1, .9 + run));
      } }));
    },
    out: { k: 'portal', win: (t, s) => { const c = camKit(t, s), a = project(c, 5200, 1242, 172), b = project(c, 5200, 1758, 598); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .5, dur: 1.2 },
  };
  // ---------------------------------------------------------------- H.13 · the street through the kitchen window: nobody hurries
  const H13 = {
    id: 'H.13',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -80, x: -60 })], [s.b + .6, cam3({ z: 120, x: 140 })]]);
      K.stage(ctx, c, [
        [40000, () => K.sky(ctx, t, L, { horizon: 520, sunAt: [1500, 170], clouds: 4, seed: 8 })],
        [9000, () => { K.hills(ctx, 520, 30, null, 6, { grad: [K.hz(L.leafS, 9000, L), K.hz(L.leaf, 9000, L)] }); }],
        [5200, () => { for (let i = -3; i < 10; i++) K.house(ctx, i * 250 - 60, 620, 250, 260 + (i % 3) * 30, L, { col: K.hz(['#d8b98a', '#c9a0a0', '#b7c0a0', '#d1b090', '#cfa77e'][(i + 5) % 5], 5200, L), roof: i % 2 ? 'gable' : 'flat', roofH: 70, t }); K.band(ctx, 620, 700, L.walk, mixHex(L.walk, L.shade, .15)); }],
        [3000, () => { K.band(ctx, 690, 1300, mixHex(L.road, L.walk, .4), L.road); for (const x of [180, 1140, 2050]) K.tree(ctx, t, x, 760, .9, L, { apples: 14 });
          for (let i = 0; i < 6; i++) { const v = (i % 2 ? -1 : 1) * (26 + i * 3), x = ((i * 410 + t * v) % 2600 + 2600) % 2600 - 400; K.folk(ctx, t, i, x, 800 + (i % 3) * 14, 230, { walk: K.walkPh(t, .38) + i, dir: Math.sign(v), look: .2 * Math.sin(t * .4 + i) }); } }],
        [1700, () => { // a pair stops to chat; a dog-free, car-free road
          K.folk(ctx, t, 3, 1240, 1000, 330, { pose: 'look', dir: -1, look: .5 }); K.folk(ctx, t, 1, 1090, 1004, 320, { pose: 'hold', dir: 1, look: .3 + .2 * Math.sin(t * 1.3) }); }],
        [1150, () => { const R0 = mixHex('#e7d6b8', L.shade, .5); ctx.fillStyle = R0; ctx.fillRect(-400, 950, W + 800, 300); ctx.fillStyle = rgba('#fffaf0', .25); ctx.fillRect(-400, 950, W + 800, 6);   // the kitchen window sill
          ctx.fillStyle = mixHex('#c4583a', L.shade, .2); ctx.fillRect(1480, 880, 90, 72); ctx.fillStyle = mixHex(L.leaf, L.light, .2); for (const [x, y, r] of [[1500, 860, 30], [1545, 850, 36], [1525, 820, 28]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); } }],   // a herb pot
      ]);
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .45, dur: 1.0 },
  };
  // ---------------------------------------------------------------- H.14–H.15 · HALLWAY: the counter grows big, the front door opens
  const camHall = (t, s) => camK(t, [[s.a - .8, cam3({ z: -160, x: -60 })], [s.r('H.15'), cam3({ z: -40 })], [s.b + .6, aim(3000, 960, 570, 1.22), 'q']], .8);
  const H14 = {
    id: 'H.14',
    draw(ctx, t, s) {
      const L = look(R, t), t15 = s.r('H.15');
      S.hallway(ctx, t, camHall(t, s), L, K.quartIO(span(t, t15 - .1, t15 + 1.4)), { girl: true });
      // the GONE counter, grown out of the corner: nine boxes, one filled
      const g = K.expoOut(span(t, s.a + .1, s.a + 1.1)) * (1 - K.quartIO(span(t, t15 - .7, t15 + .1)));
      if (g > .01) K.scr(ctx, (c) => {
        const cx = lerp(150, W / 2, g), cy = lerp(150, 250, g), k = lerp(.32, 1, g);
        c.translate(cx, cy); c.scale(k, k);
        c.fillStyle = K.rad(c, 0, 0, 760, [[0, rgba('#0b1440', .6)], [1, rgba('#0b1440', 0)]]); c.fillRect(-900, -400, 1800, 800);
        K.glowText(c, 'GONE BY 2050', 0, -90, { size: 34, weight: 600, align: 'center', col: '#e7d19a', spacing: .24, glow: false });
        for (let i = 0; i < 9; i++) {
          const x = (i - 4) * 104, u = span(t, s.a + .4 + i * .06, s.a + .9 + i * .06), fill = i === 0;
          c.globalAlpha = u; c.strokeStyle = fill ? '#ffe7a8' : rgba('#e8eefc', .55); c.lineWidth = 3; c.beginPath(); c.roundRect(x - 42, -42, 84, 84, 8); c.stroke();
          if (fill) { c.fillStyle = K.rad(c, x, 0, 60, [[0, '#fff3c4'], [1, '#e3a63f']]); c.beginPath(); c.roundRect(x - 36, -36, 72, 72, 6); c.fill(); }
          K.glowText(c, String(i + 1), x, 16, { size: 46, serif: true, align: 'center', col: fill ? '#3a2410' : rgba('#e8eefc', .5), glow: false });
          c.globalAlpha = 1;
        }
        K.glowText(c, 'THE ALARM CLOCK', -416, 84, { size: 20, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .08 });
        const q = span(t, s.a + 1.6, s.a + 2.3); if (q > 0) K.glowText(c, '?', 470, 18, { size: 80, serif: true, col: '#ffe7a8', a: q });
      });
    },
    out: { k: 'portal', win: (t, s) => { const c = camHall(t, s), a = project(c, 3000, 760, 190), b = project(c, 3000, 1160, 950); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .2, dur: 1.2 },
  };
  // ---------------------------------------------------------------- H.16–H.25 · YOUR STREET (leitbild): one place, a new view per sentence
  const RT = (id) => R[id];
  const camSt = (t) => camK(t, [
    [RT('H.16') - 1, cam3({ z: -200, y: -10 })], [RT('H.17'), cam3({ z: -80, x: -60 })], [RT('H.18'), cam3({ z: 120, x: 90 })], [RT('H.18') + 1.1, cam3({ z: 820, y: -20, x: 0 })],
    [RT('H.19') + .5, cam3({ z: 260, y: 60, x: -40 })], [RT('H.20') + .2, cam3({ z: 380, y: 50, x: -60 })], [RT('H.21') - .1, cam3({ z: 480, y: 30, x: -420 })],
    [RT('H.21') + .8, aim(1700, 760, 880, 1.5)], [RT('H.22') - .2, aim(1700, 820, 870, 1.55)], [RT('H.22') + 1.1, aim(1700, 1260, 780, 1.4)], [RT('H.23') - .1, aim(1700, 1240, 760, 1.32)],
    [RT('H.23') + 1.2, cam3({ z: -120, y: -20, x: 80 })], [RT('H.24') + 1.6, cam3({ z: -420, y: -70, x: 20 })], [RT('H.25') + .2, cam3({ z: -380, y: -60, x: -60 })], [RT('H.25') + 2.6, aim(2600, 1797, 700, 1.45, W * .5, H * .54), 'q'],
  ]);
  const H16 = {
    id: 'H.16',
    draw(ctx, t, s) {
      const L = look(R, t), c = camSt(t), t17 = RT('H.17'), t18 = RT('H.18'), t19 = RT('H.19'), t20 = RT('H.20'), t21 = RT('H.21'), t22 = RT('H.22'), t23 = RT('H.23'), t24 = RT('H.24'), t25 = RT('H.25');
      const order = [2, 3, 1, 0, 1, 2, 0, 0];   // near → mid → far, left side first (same houses)
      const hl = (i) => (i < 4 ? K.bump(t, t18 + .1 + (i % 2) * .15, 1.1) : 0) + (i >= 4 ? K.bump(t, t17 + (i % 2) * .35 + (i < 6 ? .3 : 0), 1.0) : 0) * (order[i] >= 0 ? 1 : 0);
      const ghost = span(t, t19 + .25, t19 + .6) * (1 - span(t, t19 + 2.1, t19 + 2.4));
      const o = {
        hl, ghostCars: ghost, ghostWipe: 1 - span(t, t19 + 1.6, t19 + 2.4) * 1.4, bayTrees: span(t, t20 - .1, t20 + 1.8), apples: t > t20,
        chalk: span(t, t21, t21 + 2.2) + (t > t21 + 2.2 ? 1 : 0) * 0, kids: t > t21 - 1.2, kidsLook: t > t22 + .5 && t < t23 + 1, ladder: t > t21 - .5 && t < t25 + 1.2 ? (t > t22 + .2 ? 2 : 1) : 0,
        walkers: t > t23 - .3, garage: K.expoOut(span(t, t25 - .2, t25 + 1.3)), workers: t > t25,
        you: t < t20 ? [260 - 30 * span(t, s.a, t20), 1040, 300] : null, youLook: .3, girlAt: t < t20 ? [400, 1046, 196] : null, girlPose: 'look',
      };
      S.street(ctx, t, c, L, o);
      // tags and the MIX on the street
      const tg = K.cardU(t, s.a + .3, t17 + .1);
      K.caps(ctx, 'YOUR STREET · 2050', W / 2, 190, tg, { size: 26, align: 'center', col: '#ffe7a8' });
      // the MONDAY leaf of a tear-off calendar drops into the street
      const lf = span(t, t23 - .1, t23 + 1.6), lfOut = span(t, t24 + .2, t24 + .8);
      if (lf > 0 && lfOut < 1) K.scr(ctx, (cx) => {
        const e = K.sineIO(lf), x = 1120 + 140 * Math.sin(lf * 5.2) * (1 - e), y = lerp(-180, 610, e), rot = .5 * Math.sin(lf * 6) * (1 - e) - .06;
        cx.translate(x, y); cx.rotate(rot); cx.scale(1 - .3 * lfOut, (1 - lfOut) * (1 - .4 * Math.abs(Math.sin(lf * 6)) * (1 - e)));
        K.paper(cx, t, -160, -90, 320, 180, 1, { head: 'NOVEMBER 2050', headCol: K.PAPER.red, lines: ['MONDAY'], lineSize: 64, serif: false });
      });
      const wu = K.cardU(t, t24 + .05, t25 + .5);
      if (wu > 0) { K.scrim(ctx, 560, 250, 800, 150, .4 * wu); K.words(ctx, [['WORK IS ', 0], ['OPTIONAL', .8]], W / 2, 350, 92, wu, { align: 'center', serif: false, weight: 700 }); }

    },
    out: { k: 'portal', win: (t) => { const c = camSt(t), a = project(c, 2600, 1674, 624), b = project(c, 2600, 1920, 800); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .5, dur: 1.2 },
  };
  return [H01, H03, H06, H08, H13, H14, H16];
}
