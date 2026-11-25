// Film 74 · c02 WORK IS OPTIONAL (1.01–2.02): boat shed, motorbike garage, your studio, the week strip, hands → ring, the economists' card,
// the rent slip, the coin over the street, the kerb (your foot steps off; WATCH OUT, CAR! is struck through).
import * as K from '../lib/f74_kit.mjs';
import * as S from '../lib/f74_street.mjs';
import * as PL from '../lib/f74_places.mjs';
import { hourAt } from './hud.mjs';
import { INK } from './c01.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
// a plan sheet on the drawing board: a footbridge in blue lines (your work)
function plan(ctx, t, x, y, w, h, u) {
  ctx.fillStyle = '#f4efe0'; ctx.fillRect(x, y, w, h); ctx.strokeStyle = rgba('#7a8ab8', .35); ctx.lineWidth = 1; for (let gx = x; gx < x + w; gx += 24) { ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke(); }
  K.ink(ctx, K.PAPER.ink, 3); const b = y + h * .72; K.strokeIn(ctx, [[x + 20, b], [x + w - 20, b]], u);
  K.strokeIn(ctx, Array.from({ length: 21 }, (_, i) => [x + 30 + i / 20 * (w - 60), b - Math.sin(Math.PI * i / 20) * h * .45]), clamp(u * 1.3 - .2));
  for (let i = 1; i < 8; i++) { const xx = x + 30 + i / 8 * (w - 60); K.strokeIn(ctx, [[xx, b], [xx, b - Math.sin(Math.PI * i / 8) * h * .45]], clamp(u * 2 - 1)); }
}
export default function c02(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- 1.01 · BOAT SHED
  const S101 = {
    id: '1.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1.2, cam3({ z: -60, x: -80 })], [s.b + .6, cam3({ z: 160, x: 120, y: -20 })]]);
      const pl = (t * .55) % 1, px = lerp(520, 1300, K.sineIO(pl));
      PL.shop(ctx, t, c, L, {
        mid: (g) => { PL.hull(g, t, 520, 660, 820, L, { planed: pl }); PL.shavings(g, t, px, 560, 12); },
        focus: (g) => { K.folk(g, t, 4, px * .74 + 260, 1030, 520, { armR: [1.25 + .12 * Math.sin(t * 3.4), 1.45], armL: [-1.1, -1.3], dir: 1, lean: .12, look: .6 }); },
        lampX: 1500, postX: 1840,
      });
      K.today(ctx, t, s.a + .6, s.b - .1, ['POLAND 2026 · 5,000 WORKERS', 'SAME PAY · 20% FEWER HOURS'], 'SOURCE: GOV.PL (STATE PILOT)');
    },
    out: { k: 'sweep', kind: 'post', dir: -1, lead: .45, dur: .9 },
  };
  // ---------------------------------------------------------------- 1.02 · MOTORBIKE GARAGE
  let wheel = [700, 700, 80];
  const camMoto = (t, s) => camK(t, [[s.a - 1, cam3({ z: -100, x: 100 })], [s.b + .5, aim(2500, 760, 760, 1.25)]]);
  const S102 = {
    id: '1.02',
    draw(ctx, t, s) {
      const L = look(R, t), c = camMoto(t, s);
      PL.shop(ctx, t, c, L, {
        door: [160, 230, 460, 670], winX: 1380, lampX: 1100, postX: -200,
        mid: (g) => { wheel = PL.motorbike(g, t, 980, 960, 1.5, L, { spin: t > s.b - 1.2 ? 2 * span(t, s.b - 1.2, s.b) : 0 }); },
        focus: (g) => {
          K.folk(g, t, 1, 1380, 1040, 520, { pose: 'point', dir: -1, look: .6, armR: [1.9 + .1 * Math.sin(t * 2), 2.0] });
          K.folk(g, t, 2, 560, 1050, 380, { dir: 1, look: .7, lean: .1 }); K.folk(g, t, 5, 700, 1060, 400, { dir: 1, look: .5 + .2 * Math.sin(t * .7), pose: 'hold' });
        },
      });
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camMoto(t, s), 2500, wheel[0], wheel[1]); return [p[0], p[1], wheel[2] * p[2]]; }, lead: .35, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 1.03 · YOUR STUDIO: the thing you were always good at (+1.07–1.08 the economists' card later)
  const studio = (ctx, t, c, L, u, extra) => PL.shop(ctx, t, c, L, {
    door: [1320, 240, 420, 640], winX: 220, lampX: 1180, postX: -260,
    back: (g) => { g.fillStyle = mixHex('#6a4a3a', L.shade, .2); g.fillRect(1100, 330, 140, 12); g.fillStyle = K.lin(g, 1100, 0, 1240, 0, [[0, K.COAT.shade], [.6, K.COAT.base], [1, K.COAT.lit]]); g.beginPath(); g.moveTo(1160, 342); g.quadraticCurveTo(1110, 360, 1118, 420); g.lineTo(1108, 600); g.lineTo(1232, 600); g.lineTo(1222, 420); g.quadraticCurveTo(1230, 360, 1180, 342); g.fill(); },
    mid: (g) => { g.fillStyle = mixHex('#5a3a2a', L.shade, .2); g.fillRect(520, 640, 20, 360); g.fillRect(1000, 640, 20, 360);   // the drawing board, slanted
      g.save(); g.translate(770, 600); g.transform(1, 0, -.25, 1, 0, 0); g.fillStyle = mixHex('#c9a06a', L.light, .2); g.fillRect(-300, -220, 600, 300); plan(g, t, -280, -205, 560, 270, u); g.restore(); if (extra) extra(g); },
    focus: (g) => K.you(g, t, 1260, 1060, 560, { dir: -1, pose: 'point', armR: [1.95 + .08 * Math.sin(t * 2.6), 2.15 + .1 * Math.sin(t * 2.6)], look: .7, lean: .06 }),
  });
  const camStu = (t, s) => camK(t, [[s.a - 1, cam3({ z: -80, x: -60 })], [s.b + .5, aim(2500, 770, 560, 1.35)]]);
  const S103 = {
    id: '1.03',
    draw(ctx, t, s) { studio(ctx, t, camStu(t, s), look(R, t), span(t, s.a, s.b + 1)); },
    out: { k: 'portal', win: (t, s) => { const c = camStu(t, s), a = project(c, 2500, 540, 395), b = project(c, 2500, 1000, 665); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .4, dur: 1.1 },
  };
  // ---------------------------------------------------------------- 1.04–1.06 · THE WEEK STRIP, then the hands → the ring (EXPL)
  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'], dx = (i) => 420 + i * 180;
  const S104 = {
    id: '1.04',
    draw(ctx, t, s) {
      const t5 = s.r('1.05'), t6 = s.r('1.06'), pan = K.quartIO(span(t, t6 - .2, t6 + 1.0));
      K.dusk(ctx, t, { glow: [lerp(960, 1300, pan), 520] });
      K.scr(ctx, (c) => {
        c.translate(-W * .9 * pan, 0);
        // the strip: seven day slots, three work blocks placed by you, the rest of the week stays open (sun)
        for (let i = 0; i < 7; i++) { const u = span(t, s.a - .3 + i * .05, s.a + .3 + i * .05), x = dx(i);
          c.globalAlpha = u; c.strokeStyle = rgba('#cfd8ff', .5); c.lineWidth = 2; c.beginPath(); c.roundRect(x - 76, 330, 152, 420, 12); c.stroke();
          K.glowText(c, DAYS[i], x, 300, { size: 26, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .14 }); c.globalAlpha = 1; }
        const blocks = [[0, 0], [2, 1], [3, 0]];
        blocks.forEach(([d, row], k) => { const t0 = s.a + .5 + k * .35, e = K.expoOut(span(t, t0, t0 + .6)), y = lerp(160, 360 + row * 130, e), x = dx(d);
          if (e > 0) { c.fillStyle = K.rad(c, x, y + 50, 120, [[0, '#fff3c4'], [1, '#e3a63f']]); c.beginPath(); c.roundRect(x - 64, y, 128, 110, 10); c.fill(); K.glowText(c, 'WORK', x, y + 64, { size: 22, weight: 700, align: 'center', col: '#3a2410', glow: false, spacing: .1 }); } });
        for (const d of [1, 4, 5, 6]) { const u = span(t, s.a + 1.6 + d * .08, s.a + 2.2 + d * .08); if (u > 0) { c.globalAlpha = u; c.fillStyle = K.rad(c, dx(d), 560, 46, [[0, '#fff8dc'], [1, rgba('#f6c95c', 0)]]); c.beginPath(); c.arc(dx(d), 560, 46, 0, 7); c.fill(); c.globalAlpha = 1; } }
        // 1.05: one extra block slides in and is pushed back out
        const ex = K.bump(t, t5 + .1, 1.6), xx = lerp(W + 120, dx(4), K.expoOut(clamp(ex * 1.25)));
        if (ex > .01) { c.fillStyle = rgba('#e8eefc', .85); c.beginPath(); c.roundRect(xx - 64, 620, 128, 110, 10); c.fill(); K.glowText(c, '+1 HOUR', xx, 684, { size: 22, weight: 700, align: 'center', col: '#1c2a5c', glow: false });
          if (ex > .85) { c.strokeStyle = '#e0503c'; c.lineWidth = 6; c.beginPath(); c.moveTo(xx - 70, 616); c.lineTo(xx + 70, 736); c.stroke(); } }
        // 1.06: three tasks wander from a human hand to the machine ring
        c.translate(W * .9, 0);
        if (pan > 0) {
          const hx = 520, rx = 1480, cy = 520;
          K.you(c, t, hx - 60, 820, 330, { pose: 'lift', dir: 1, look: .5 });
          K.ring(c, t, rx, cy, 110, span(t, t6 - .1, t6 + .6));
          const items = ['PAPERWORK', 'NIGHT SHIFTS', 'HEAVY LIFTING'];
          items.forEach((name, k) => { const t0 = t6 + .9 + k * .55, u = K.sineIO(span(t, t0, t0 + 1.3)), x = lerp(hx - 60 + (k - 1) * 70, rx, u), y = lerp(440 - k * 10, cy, u) - Math.sin(Math.PI * u) * 180, sc = lerp(1, .35, u * u);
            if (u >= 1) return; c.save(); c.translate(x, y); c.scale(sc, sc);
            c.fillStyle = K.rad(c, 0, 0, 70, [[0, '#fff3c4'], [1, '#e3a63f']]);
            if (k === 0) { for (let j = 0; j < 3; j++) c.fillRect(-36, -30 + j * 14, 72, 10); } else if (k === 1) { c.beginPath(); c.arc(0, 0, 38, 0, 7); c.fill(); c.fillStyle = '#132058'; c.beginPath(); c.arc(16, -10, 34, 0, 7); c.fill(); } else { c.fillRect(-40, -34, 80, 68); c.strokeStyle = '#6e4416'; c.lineWidth = 4; c.strokeRect(-40, -34, 80, 68); c.beginPath(); c.moveTo(-40, -34); c.lineTo(40, 34); c.stroke(); }
            K.glowText(c, name, 0, 78, { size: 24, weight: 700, align: 'center', col: P.cream, glow: false, spacing: .1 }); c.restore(); });
        }
      });
      K.today(ctx, t, t6 + .4, s.b - .1, ['AI MATCHES INDUSTRY EXPERTS', 'ON 8 IN 10 WORK TASKS'], 'OPENAI TEST (GDPVAL), 2026 · COMPANY CLAIM', { y: 110 });
    },
    out: { k: 'iris', c: [1480, 520, 60], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 1.07–1.08 · the economists' card on your desk (MIX)
  const S107 = {
    id: '1.07',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, aim(2500, 900, 600, 1.15)], [s.b + .5, aim(2500, 760, 600, 1.3)]]);
      studio(ctx, t, c, L, 1);
      const u = K.cardU(t, s.a + .2, s.b + .2), t8 = s.r('1.08'), p = project(c, 2500, 770, 560);
      if (u > 0) K.scr(ctx, (g) => { const inner = K.paper(g, t, 470, 200, 980, 470, u, { from: [p[0], p[1]], head: 'BACK IN 2026', lines: ['Most economists expected', 'people would still work in 2050.'], lineSize: 52, src: 'SURVEY OF ECONOMISTS · NBER WORKING PAPER, 2026' });
        const ck = span(t, t8 + .05, t8 + .6); if (ck > 0) { g.save(); g.translate(1290, 560); K.goldLine(g, [[-50, 0], [-10, 44], [70, -60]], K.expoOut(ck), { w: 12, blur: 14, col: '#e3a63f' }); g.restore(); } });
    },
    out: { k: 'portal', win: [470, 200, 980, 470], lead: .35, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 1.09–1.10 · people still work, just not for the rent (EXPL)
  const S109 = {
    id: '1.09',
    draw(ctx, t, s) {
      const t10 = s.r('1.10'); K.dusk(ctx, t, { glow: [900, 520] });
      K.scr(ctx, (c) => {
        const z = 1 + .04 * span(t, s.a, s.b + 1); c.translate(960, 600); c.scale(z, z); c.translate(-960, -600);
        K.you(c, t, 840, 900, 520, { pose: 'hold', armR: [1.25, 1.75], armL: [-1.1, -1.9], dir: 1, look: .4 });
        const bx = 960, by = 560;
        c.fillStyle = K.rad(c, bx, by, 160, [[0, '#fff3c4'], [1, '#e3a63f']]); c.beginPath(); c.roundRect(bx - 90, by - 70, 180, 140, 12); c.fill(); K.halo(c, bx, by, 260, .35);
        K.glowText(c, 'WORK', bx, by + 12, { size: 34, weight: 700, align: 'center', col: '#3a2410', glow: false, spacing: .1 });
        // the RENT slip: tied to the block, comes off and flutters away
        const f = span(t, t10 + .2, s.b + .4), fx = lerp(bx + 60, bx + 760, K.sineIO(f)), fy = lerp(by + 70, by - 380, f) + Math.sin(f * 14) * 30 * f, rot = .2 + Math.sin(f * 9) * .6 * f;
        c.strokeStyle = rgba('#e8eefc', .7 * (1 - f)); c.lineWidth = 2; c.beginPath(); c.moveTo(bx + 60, by + 60); c.lineTo(fx, fy - 30); c.stroke();
        c.save(); c.translate(fx, fy); c.rotate(rot); c.scale(1 - .4 * f, 1 - .25 * Math.abs(Math.sin(f * 9)) * f); c.globalAlpha = 1 - span(f, .8, 1);
        c.fillStyle = K.PAPER.lit; c.beginPath(); c.roundRect(-80, -34, 160, 68, 6); c.fill(); K.glowText(c, 'RENT', 0, 14, { size: 40, weight: 700, align: 'center', col: K.PAPER.red, glow: false, spacing: .12 }); c.restore();
      });
    },
    out: { k: 'iris', c: [960, 560, 90], lead: .35, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 1.11–1.15 · the street: what does everybody live on? the coin (MIX)
  const S111 = {
    id: '1.11',
    draw(ctx, t, s) {
      const L = look(R, t), t12 = s.r('1.12'), t13 = s.r('1.13'), t14 = s.r('1.14'), t15 = s.r('1.15');
      const c = camK(t, [[s.a - 1, cam3({ z: -700, y: -260 })], [t13, cam3({ z: -520, y: -200, x: 30 })], [s.b + .5, cam3({ z: -300, y: -120, x: 0 })]]);
      S.street(ctx, t, c, L, { apples: 1, bayTrees: 1, walkers: 1, fore: false });
      const ring = span(t, t12 - .3, t12 + .3), q = K.cardU(t, s.a + .1, t12 + .3);
      K.scr(ctx, (g) => {
        if (q > 0) K.glowText(g, '?', 960, 420 + (1 - K.expoOut(q)) * 60, { size: 320, serif: true, align: 'center', col: '#ffe7a8', a: q });
        const rx = 960, ry = 190; K.ring(g, t, rx, ry, 56, ring);
        const cu = span(t, t12 + .2, t12 + 1.2), e = K.expoOut(cu), cx = lerp(rx, 960, e) + Math.sin(cu * 3.14) * 140, cy = lerp(ry, 430, e);
        if (cu > 0) {
          const dl = span(t, t13, t13 + .8) * (1 - span(t, t15 + .2, t15 + .8));
          if (dl > 0) { const p = project(c, 2600, 0, 0); for (const [x, y] of [[300, 700], [560, 640], [1360, 640], [1620, 700], [720, 600], [1200, 600]]) { g.strokeStyle = rgba('#ffd982', .5 * dl); g.setLineDash([8, 10]); g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(lerp(cx, x, dl), lerp(cy, y, dl)); g.stroke(); g.setLineDash([]); g.fillStyle = rgba('#fff3c4', .8 * dl); g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); } }
          K.coin(g, cx, cy + 6 * Math.sin(t * 2), 46, t14 < t ? (t - t14) * 2.2 : 0);
        }
      });
    },
    out: { k: 'iris', c: [960, 430, 46], lead: .35, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 1.16–2.02 · THE KERB: your shoes, the old fear, you step off without looking
  const S116 = {
    id: '1.16',
    draw(ctx, t, s) {
      const L = look(R, t), t17 = s.r('1.17'), t21 = s.r('2.01'), t22 = s.r('2.02');
      const c = camK(t, [[s.a - 1, cam3({ z: -60, y: 40 })], [t21 - .3, cam3({ z: 140, y: 20, x: -40 })], [s.b + .6, cam3({ z: 40, y: -60, x: 60 })]]);
      PL.kerb(ctx, t, c, L, { step: K.sineIO(span(t, t21 + .1, t21 + 1.3)), kids: t > t21 - .5, shoeX: 860 });
      // 1.17: the old fear as a blue-ink flashback over the road
      const u = K.cardU(t, t17 + .1, t21 - .1);
      if (u > 0) K.scr(ctx, (g) => K.paper(g, t, 980, 140, 760, 430, u, { from: [960, 760], head: 'BACK IN THE TWENTIES', draw: (q, x, y, w, h) => {
        const v = span(t, t17 + .5, t21 - .4), cx = lerp(x + w * 1.1, x + w * .45, K.expoOut(v * 1.6)); K.ink(q, K.PAPER.ink, 3);
        q.beginPath(); q.moveTo(cx - 240, y + h * .75); q.lineTo(cx - 200, y + h * .45); q.lineTo(cx - 60, y + h * .3); q.lineTo(cx + 260, y + h * .3); q.lineTo(cx + 300, y + h * .75); q.closePath(); q.stroke();
        q.beginPath(); q.arc(cx - 120, y + h * .78, 36, 0, 7); q.arc(cx + 190, y + h * .78, 36, 0, 7); q.stroke();
        q.fillStyle = rgba('#e0443a', .9 * (.6 + .4 * Math.sin(t * 9))); q.fillRect(cx + 240, y + h * .42, 40, 22);
        for (let k = 0; k < 4; k++) { q.beginPath(); q.moveTo(cx + 320 + k * 30, y + h * (.38 + k * .1)); q.lineTo(cx + 420 + k * 30, y + h * (.38 + k * .1)); q.stroke(); }
        q.fillStyle = K.PAPER.ink; q.font = '700 30px Inter'; q.fillText('SCREECH', x + 10, y + 36);
      } }));
      // 2.02: WATCH OUT, CAR! as a speech bubble on paper, struck through
      const b = K.cardU(t, t22 + .05, s.b + .2);
      if (b > 0) K.scr(ctx, (g) => { K.paper(g, t, 640, 150, 640, 220, b, { from: [700, 640], lines: ['"WATCH OUT, CAR!"'], lineSize: 64, serif: false });
        const st = span(t, t22 + 1.2, t22 + 1.7); if (st > 0) { g.strokeStyle = '#c8473a'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(670, 280); g.lineTo(lerp(670, 1250, K.expoOut(st)), lerp(280, 250, st)); g.stroke(); } });
    },
    out: { k: 'sweep', dir: -1, w: 560, lead: .4, dur: 1.0 },
  };
  return [S101, S102, S103, S104, S107, S109, S111, S116];
}
