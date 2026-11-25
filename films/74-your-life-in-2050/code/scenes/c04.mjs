// Film 74 · c04 BUILD · MEND · DRIVE (3.05–3.18): the weeks of waiting (calendar, bill), the house across the road printed in nine days,
// land vs house, the empty box YOU, the old screen at the garden wall (clip C3), the square far away, the monstrous power bill.
import * as K from '../lib/f74_kit.mjs';
import * as S from '../lib/f74_street.mjs';
import { hourAt } from './hud.mjs';
import { clipPlate } from './clips.mjs';
import { podTop } from './c03.mjs';
import * as PL from '../lib/f74_places.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, lin } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
// the garden wall with an old flat screen leaning against it (the frame the clips grow out of); returns the screen rect (design, card 1700)
export const SCREEN = [700, 520, 520, 300];
export function gardenWall(ctx, t, cam, L, o = {}) {
  K.stage(ctx, cam, [
    [30000, () => K.sky(ctx, t, L, { horizon: 520, clouds: 4, seed: 6 })],
    [9000, () => { K.hills(ctx, 560, 40, null, 7, { grad: [K.hz(L.leafS, 9000, L), K.hz(L.leaf, 7000, L)] }); for (let i = 0; i < 5; i++) K.house(ctx, 100 + i * 380, 640, 300, 220, L, { col: K.hz(['#d8b98a', '#c9a0a0', '#b7c0a0', '#d1b090', '#cfa77e'][i], 7000, L), t }); }],
    [3600, () => { K.band(ctx, 660, 1400, mixHex(L.grass, L.walk, .3), L.grass); for (const x of [180, 1500]) K.tree(ctx, t, x, 760, 1.1, L, { apples: 18 }); if (o.walkers) for (let i = 0; i < 2; i++) K.folk(ctx, t, i + 1, 600 + ((t * 20 + i * 500) % 900), 760, 150, { walk: K.walkPh(t, .4) + i, dir: 1 }); }],
    [1700, () => {
      // the wall: stone blocks, warm on top, a hedge behind
      ctx.fillStyle = mixHex(L.leafS, L.light, .1); for (let x = -600; x < W + 600; x += 120) { ctx.beginPath(); ctx.arc(x, 650, 90, 0, 7); ctx.fill(); }
      ctx.fillStyle = lin(ctx, 0, 650, 0, 1100, [[0, mixHex('#d8c7a4', L.light, .3)], [1, mixHex('#9a8a74', L.shade, .35)]]); ctx.fillRect(-600, 660, W + 1200, 600);
      ctx.strokeStyle = rgba(L.ink, .18); ctx.lineWidth = 3; for (let r = 0; r < 6; r++) { const y = 660 + r * 70; ctx.beginPath(); ctx.moveTo(-600, y); ctx.lineTo(W + 600, y); ctx.stroke(); for (let x = -600 + (r % 2) * 80; x < W + 600; x += 160) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 70); ctx.stroke(); } }
      ctx.fillStyle = rgba('#fffaf0', .25); ctx.fillRect(-600, 656, W + 1200, 10);
      // the old screen leaning (tilt o.tip: 0 leaning, 1 tipped back flat against the wall)
      const [x, y, w, h] = SCREEN, tip = o.tip ?? 0; ctx.save(); ctx.translate(x + w / 2, y + h + 160); ctx.rotate(-.06 + .04 * tip);
      ctx.fillStyle = '#16182c'; ctx.fillRect(-w / 2 - 14, -h - 160 - 14, w + 28, h + 28); ctx.fillStyle = K.lin(ctx, 0, -h - 160, 0, -160, [[0, '#2a3460'], [1, '#121630']]); ctx.fillRect(-w / 2, -h - 160, w, h);
      ctx.fillStyle = rgba('#ffffff', .08); ctx.beginPath(); ctx.moveTo(-w / 2, -160); ctx.lineTo(-w / 2 + w * .4, -h - 160); ctx.lineTo(-w / 2 + w * .55, -h - 160); ctx.lineTo(-w / 2 + w * .15, -160); ctx.fill();
      ctx.fillStyle = '#16182c'; ctx.fillRect(-60, -160 + 14, 120, 40); ctx.fillRect(-120, -100 + 14, 240, 16);
      if (o.onScreen) o.onScreen(ctx, -w / 2, -h - 160, w, h);
      ctx.restore();
      if (o.focus) o.focus(ctx, t);
    }],
  ]);
}
// BUILD · MEND · DRIVE · YOU boxes (screen space), each ticks with its icon; YOU stays empty (?)
function boxes(ctx, t, x, y, ticks, q, k = 1) {
  const lab = ['BUILD', 'MEND', 'DRIVE', 'YOU'];
  for (let i = 0; i < 4; i++) {
    const u = ticks[i] ?? 0, bx = x + i * 190 * k, on = i < 3;
    ctx.strokeStyle = on ? rgba('#ffe7a8', .95) : rgba('#e8eefc', .9); ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(bx, y, 120 * k, 120 * k, 12); ctx.stroke();
    if (on && u > 0) { ctx.fillStyle = rgba('#f6c95c', .25 * u); ctx.fill(); K.goldLine(ctx, [[bx + 26 * k, y + 64 * k], [bx + 52 * k, y + 92 * k], [bx + 98 * k, y + 30 * k]], K.expoOut(u), { w: 8 * k }); }
    if (!on && q > 0) K.glowText(ctx, '?', bx + 60 * k, y + 92 * k, { size: 84 * k, serif: true, align: 'center', col: '#ffe7a8', a: q });
    K.glowText(ctx, lab[i], bx + 60 * k, y + 160 * k, { size: 26 * k, weight: 700, align: 'center', col: P.cream, glow: false, spacing: .12 });
  }
}
export default function c04(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- 3.05–3.06 · BACK THEN: weeks of waiting for a roofer, then the bill (paper, EXPL)
  const S305 = {
    id: '3.05',
    draw(ctx, t, s) {
      const t6 = s.r('3.06'); K.dusk(ctx, t, { glow: [960, 520] });
      K.scr(ctx, (g) => {
        const z = 1 + .03 * span(t, s.a, s.b + 1); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        K.paper(g, t, 330, 150, 1260, 690, clamp(span(t, s.a - .3, s.a + .6)), { head: 'BACK IN THE TWENTIES · WAITING FOR A ROOFER', draw: (q, x, y, w, h) => {
          const cw = w / 7, ch = (h - 40) / 3, n = Math.floor(21 * K.sineIO(span(t, s.a + .5, t6 - .1)));
          ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].forEach((d, i) => { q.fillStyle = K.PAPER.ink2; q.font = '600 20px Inter'; q.textAlign = 'center'; q.fillText(d, x + i * cw + cw / 2, y + 24); });
          for (let k = 0; k < 21; k++) { const cx = x + (k % 7) * cw, cy = y + 40 + Math.floor(k / 7) * ch; K.ink(q, rgba(K.PAPER.ink2, .5), 1.5); q.strokeRect(cx + 4, cy + 4, cw - 8, ch - 8);
            q.fillStyle = K.PAPER.ink; q.font = '500 22px Inter'; q.textAlign = 'left'; q.fillText(String(k + 1), cx + 14, cy + 32);
            if (k < n) { q.strokeStyle = K.PAPER.red; q.lineWidth = 5; q.beginPath(); q.moveTo(cx + 24, cy + 30); q.lineTo(cx + cw - 24, cy + ch - 24); q.moveTo(cx + cw - 24, cy + 30); q.lineTo(cx + 24, cy + ch - 24); q.stroke(); } }
          q.textAlign = 'left';
        } });
        // 3.06 the envelope slides in at the end of the weeks: BILL
        const e = K.expoOut(span(t, t6 + .1, t6 + .9)); if (e > 0) { g.save(); g.translate(lerp(W + 400, 1260, e), 640); g.rotate(-.08 * (1 - e) + .03);
          g.fillStyle = 'rgba(10,16,48,.3)'; g.fillRect(-250, -140, 520, 300); g.fillStyle = '#f6efdc'; g.fillRect(-260, -150, 520, 300); g.strokeStyle = '#cdbf9c'; g.lineWidth = 2; g.beginPath(); g.moveTo(-260, -150); g.lineTo(0, 20); g.lineTo(260, -150); g.stroke();
          g.fillStyle = K.PAPER.red; g.font = '800 70px Inter'; g.textAlign = 'center'; g.fillText('BILL', 0, 110); g.restore(); }
      });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 3.07–3.13 · THE HOUSE ACROSS THE ROAD: nine days, the couple, land vs house, BUILD MEND DRIVE · YOU
  const camAcross = (t) => camK(t, [[RT('3.07') - 1, aim(2600, 1880, 560, 1.15, W * .55, H * .55)], [RT('3.10'), aim(2600, 1860, 600, 1.25, W * .5, H * .55)], [RT('3.12') - .2, aim(2600, 1820, 620, 1.2, W * .5, H * .56)],
    [RT('3.12') + 1.4, cam3({ z: -260, y: -80, x: 80 }), 'q'], [RT('3.14') + .5, cam3({ z: -200, y: -60, x: 40 })]]);
  const S307 = {
    id: '3.07',
    draw(ctx, t, s) {
      const L = look(R, t), t8 = s.r('3.08'), t9 = s.r('3.09'), t10 = s.r('3.10'), t11 = s.r('3.11'), t12 = s.r('3.12'), t13 = s.r('3.13'), c = camAcross(t);
      const ghost = K.bump(t, s.a + 1.2, 2.6), build = span(t, t8 + .4, t9 - .3), printed = t < t8 ? (ghost > .5 ? 0 : 1) : (t < t9 - .3 ? build : 1);
      const couple = span(t, t9, t10 + .3);
      S.street(ctx, t, c, L, { apples: 1, bayTrees: 1, walkers: 1, printed, roofBot: 1, tiles: .1, fore: false, pod: t > t12 ? lerp(1500, 300, span(t, t12, s.b + 1)) : null,
        near: (g) => { if (couple > 0 && couple < 1) { const x = lerp(1420, 1800, K.sineIO(couple)); for (const [i, dx, col] of [[3, 0, '#c9a06a'], [5, 70, '#b8946a']]) { K.folk(g, t, i, x + dx, 806, 200, { walk: K.walkPh(t, .7) + i, dir: 1, armR: [1.45, 2.1], armL: [-1.45, -2.1] }); g.fillStyle = col; g.fillRect(x + dx + 2, 806 - 140, 58, 46); } } } });
      // ghost label DAY 1 / the nine tiles / DAY 10
      if (t < t8 + .2 && ghost > .3) K.caps(ctx, 'DAY 1 · AN EMPTY LOT', 1340, 330, clamp((ghost - .3) * 2), { size: 30, align: 'center', col: '#ffe7a8' });
      const tu = K.cardU(t, t8 + .1, t10 - .1);
      if (tu > 0) K.scr(ctx, (g) => { g.globalAlpha = tu; for (let d = 0; d < 9; d++) { const on = build * 9 > d, x = 760 + d * 104, y = 170;
        g.strokeStyle = on ? '#ffe7a8' : rgba('#e8eefc', .5); g.lineWidth = 3; g.beginPath(); g.roundRect(x, y, 86, 86, 8); g.stroke(); if (on) { g.fillStyle = rgba('#f6c95c', .35); g.fill(); }
        K.glowText(g, 'DAY', x + 43, y + 36, { size: 18, weight: 700, align: 'center', col: P.cream, glow: false, spacing: .1 }); K.glowText(g, String(d + 1), x + 43, y + 74, { size: 36, serif: true, align: 'center', col: on ? '#ffe7a8' : P.cream, glow: false }); }
        if (t > t9) K.caps(g, 'DAY 10 · MOVING IN', 1230, 310, span(t, t9, t9 + .5), { size: 28, align: 'center', col: '#ffe7a8' }); g.globalAlpha = 1; });
      // 3.10–3.11 two tags: LAND stays, HOUSE shrinks
      const tg = K.cardU(t, t10 + .05, t12 + .1);
      if (tg > 0) { const p = project(c, 2600, 1880, 820), q = project(c, 2600, 1900, 480), hk = lerp(1, .32, K.expoOut(span(t, t11 + .1, t11 + 1.2)));
        K.scr(ctx, (g) => { g.globalAlpha = tg; const tag = (x, y, k, txt) => { g.save(); g.translate(x, y); g.scale(k, k); g.rotate(-.06 + .03 * Math.sin(t * 1.4 + x)); g.fillStyle = K.PAPER.lit; g.beginPath(); g.moveTo(-30, -40); g.lineTo(150, -40); g.lineTo(150, 40); g.lineTo(-30, 40); g.lineTo(-62, 0); g.closePath(); g.fill(); g.fillStyle = '#132058'; g.beginPath(); g.arc(-34, 0, 7, 0, 7); g.fill(); g.fillStyle = K.PAPER.ink; g.font = '800 34px Inter'; g.textAlign = 'center'; g.fillText(txt, 54, 12); g.restore(); };
          tag(p[0] - 140, p[1] + 30, 1.1, 'LAND'); tag(q[0] - 40, q[1], 1.1 * hk, 'HOUSE'); g.globalAlpha = 1; }); }
      K.today(ctx, t, t11 + .3, t12 - .05, ['3D-PRINTED HOUSE WALLS', 'ABOUT 40% CHEAPER'], 'COMPANY CLAIM, 2026', { x: 90, y: 230 });
      // 3.12–3.13 BUILD · MEND · DRIVE tick off, the fourth box YOU stays empty
      const bu = K.cardU(t, t12 + .6, s.b + .6);
      if (bu > 0) K.scr(ctx, (g) => { g.globalAlpha = bu; K.scrim(g, 520, 140, 880, 260, .5); boxes(g, t, 590, 160, [0, 1, 2].map((i) => span(t, t12 + 1.0 + i * .45, t12 + 1.4 + i * .45)), span(t, t13 + .1, t13 + .7)); g.globalAlpha = 1; });
    },
    out: { k: 'sweep', dir: 1, w: 560, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 3.14 · C3 · 3.15 · the old screen at the garden wall, the clip grows out of it
  const camWall = (t) => camK(t, [[RT('3.14') - 1, cam3({ z: -150, x: -80 })], [RT('3.14') + 2.5, aim(1700, 960, 640, 1.25)], [RT('3.15'), aim(1700, 960, 640, 1.3)], [RT('3.16') + .5, aim(1700, 960, 660, 1.2)]], .7);
  const scrRect = (t) => { const c = camWall(t), a = project(c, 1700, SCREEN[0], SCREEN[1]), b = project(c, 1700, SCREEN[0] + SCREEN[2], SCREEN[1] + SCREEN[3]); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; };
  const S314 = {
    id: '3.14',
    draw(ctx, t, s) {
      const L = look(R, t), C3 = T.clip('C3'), t15 = s.r('3.15');
      gardenWall(ctx, t, camWall(t), L, { walkers: true, tip: span(t, t15, t15 + .8), onScreen: (g, x, y, w, h) => { if (t > t15 - .2) { g.save(); g.translate(x + w / 2 - 300 * .55, y + 60); boxes(g, t, 0, 0, [1, 1, 1], 1, .55); g.restore(); } } });
      const u4 = K.cardU(t, s.a + .3, C3.start - .2);
      if (u4 > 0) K.caps(ctx, 'BACK IN THE TWENTIES · THE HEAD OF AN AI LAB', W / 2, 200, u4, { size: 28, align: 'center', col: '#ffe7a8' });
      const m = span(t, C3.start - .6, C3.start + .2) - span(t, C3.end - .2, C3.end + .6);
      if (m > 0) clipPlate(ctx, t, T, 'C3', scrRect(t), m);
    },
    out: { k: 'fn', lead: .5, dur: 1.4, fn: (ctx, u, dA, dB) => { // fly along the street to the square: B pushes out of the depth while A falls away
      const e = K.quartIO(u); K.outer({ k: 1 + e * 2.5, e: W / 2 - W / 2 * (1 + e * 2.5), f: H * .45 - H * .45 * (1 + e * 2.5) }, () => dA(ctx));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.beginPath(); const r = lerp(60, 1300, e); ctx.ellipse(W / 2, H * .45, r * 1.2, r, 0, 0, 7); ctx.clip(); dB(ctx); ctx.restore(); } },
  };
  // ---------------------------------------------------------------- 3.16 · far at the end of the street: the square, a price tag turned away
  const S316 = {
    id: '3.16',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1.4, cam3({ z: -900, y: -40 })], [s.a + 2.2, cam3({ z: -400, y: -20, x: 160 })], [s.b + .6, aim(3000, 1580, 720, 1.35, W * .55, H * .5), 'q']], .8);
      PL.square(ctx, t, c, L, { tags: span(t, s.a + 1.2, s.a + 1.8), people: 7 });
      K.caps(ctx, 'THE ONE THING THAT GOT MORE EXPENSIVE', W / 2, 260, K.cardU(t, s.a + 2.0, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: [W * .55, H * .5, 50], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 3.17–3.18 · DAY · NIGHT: the machines never stop; the monstrous power bill (EXPL)
  const S317 = {
    id: '3.17',
    draw(ctx, t, s) {
      const t18 = s.r('3.18'); K.dusk(ctx, t, { glow: [960, 420] });
      K.scr(ctx, (g) => {
        const y = 420, x0 = 200, x1 = 1720, ph = (t - s.a) * .35;
        g.fillStyle = K.lin(g, x0, 0, x1, 0, [[0, '#f6d58a'], [.45, '#f2b632'], [.55, '#1c2a62'], [1, '#0b1236']]); g.beginPath(); g.roundRect(x0, y - 70, x1 - x0, 140, 70); g.fill();
        K.glowText(g, 'DAY', x0 + 60, y + 12, { size: 34, weight: 700, col: '#3a2410', glow: false, spacing: .14 }); K.glowText(g, 'NIGHT', x1 - 60, y + 12, { size: 34, weight: 700, col: '#e8eefc', glow: false, align: 'right', spacing: .14 });
        for (let i = 0; i < 6; i++) { const x = lerp(x0 + 220, x1 - 220, ((i / 6 + ph * .1) % 1)); K.ring(g, t + i, x, y, 40, span(t, s.a - .2 + i * .1, s.a + .3 + i * .1)); }
        const e = K.expoOut(span(t, t18 + .2, s.b + .2)), k = lerp(.3, 1.15, e);
        if (e > 0) { g.save(); g.translate(960, 760 - 120 * e); g.scale(k, k); g.rotate(-.04 + .02 * Math.sin(t * 2.5) * e);
          g.fillStyle = 'rgba(10,16,48,.35)'; g.fillRect(-330, -170, 680, 360); g.fillStyle = '#f6efdc'; g.fillRect(-340, -180, 680, 360); g.strokeStyle = '#cdbf9c'; g.lineWidth = 3; g.beginPath(); g.moveTo(-340, -180); g.lineTo(0, 30); g.lineTo(340, -180); g.stroke();
          g.fillStyle = K.PAPER.red; g.font = '800 64px Inter'; g.textAlign = 'center'; g.fillText('POWER BILL', 0, 120); g.font = '700 40px Inter'; g.fillText('$ ? ? ? ? ? ?', 0, 168); g.restore(); }
      });
    },
    out: { k: 'iris', c: [960, 700, 120], lead: .35, dur: 1.1 },
  };
  return [S305, S307, S314, S316, S317];
}
