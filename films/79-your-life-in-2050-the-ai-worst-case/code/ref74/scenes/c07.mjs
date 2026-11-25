// Film 74 · c07 SCHOOL & BAKERY (6.01–7.03): the old bus stop is a bench under a tree, the silent bell, no rows of desks, the garden table where a ring of
// light teaches your granddaughter at her speed, the same ring at the villa and the flat, BEST vs FREE models, the old school building is a workshop,
// the boat builder and the children, fractions vs losing an argument, the doctor's waiting room is a bakery, the insurance card in the old box.
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as PL from '../lib/f79_places.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, lin, rad, prng } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
// a garden with a table (focus card 1700): table top centre (960, 760); o.house 'villa' | 'flat' | 'cottage' behind
function garden(ctx, t, cam, L, o = {}) {
  K.stage(ctx, cam, [
    [30000, () => K.sky(ctx, t, L, { horizon: 560, clouds: 3, seed: o.seed ?? 61 })],
    [8000, () => K.hills(ctx, 580, 40, null, o.seed ?? 5, { grad: [K.hz(L.leafS, 8000, L), K.hz(L.leaf, 6000, L)] })],
    [3600, () => {
      if (o.house === 'flat') { ctx.fillStyle = mixHex('#c8b99a', L.shade, .25); ctx.fillRect(560, 60, 800, 700); for (let r = 0; r < 8; r++) for (let k = 0; k < 8; k++) { ctx.fillStyle = mixHex('#5a6a9a', L.shade, .3); ctx.fillRect(590 + k * 98, 90 + r * 82, 60, 56); } }
      else if (o.house === 'villa') { K.house(ctx, 260, 760, 1400, 560, L, { col: '#e8d2a8', rows: 2, cols: 7, t, roofH: 220, door: 'plain' }); for (const x of [200, 1720]) K.poplar ? K.poplar(ctx, t, x, 760, 1.4, L) : K.tree(ctx, t, x, 760, 1.2, L); }
      else K.house(ctx, 520, 760, 880, 520, L, { col: '#d9b58c', t, roofH: 220, door: 'yellow' });
      K.band(ctx, 755, 1400, mixHex(L.grass, L.light, .1), L.grass);
      ctx.fillStyle = mixHex(L.leafS, L.light, .1); for (let x = -400; x < W + 400; x += 110) { ctx.beginPath(); ctx.arc(x, 770, 70 + 10 * Math.sin(x), Math.PI, 0); ctx.fill(); }
    }],
    [1700, () => {
      const cx = 960, ty = 760; ctx.fillStyle = mixHex('#8a5a34', L.shade, .2); ctx.fillRect(cx - 230, ty + 10, 20, 210); ctx.fillRect(cx + 210, ty + 10, 20, 210);
      ctx.fillStyle = lin(ctx, 0, ty - 20, 0, ty + 20, [[0, mixHex('#e2c08a', L.light, .3)], [1, mixHex('#a87a4a', L.shade, .2)]]); ctx.beginPath(); ctx.ellipse(cx, ty, 300, 42, 0, 0, 7); ctx.fill();
      if (o.girl !== false) { ctx.fillStyle = mixHex('#8a5a34', L.shade, .2); ctx.fillRect(cx - 420, ty + 90, 170, 16); ctx.fillRect(cx - 410, ty + 106, 12, 120); ctx.fillRect(cx - 272, ty + 106, 12, 120); } if (o.girl !== false) K.girl(ctx, t, cx - 330, ty + 230, 360, { pose: 'sit', dir: 1, look: o.girlLook ?? -.3 + .1 * Math.sin(t * .8), armR: o.armR ?? [1.4 + .1 * Math.sin(t * 1.3), 1.6] });
      if (o.ring) { K.ring(ctx, t, cx + 40, ty - 60, 54, o.ring); }
      if (o.focus) o.focus(ctx, t, cx, ty);
    }],
    [1100, () => { if (o.fore !== false) { ctx.fillStyle = mixHex('#2d5a3a', L.shade, .4); for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(-120 + k * 50, 1040 - k * 14, 120, 60, -.4, 0, 7); ctx.fill(); } } }],
  ]);
}
export default function c07(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- 6.01–6.03 · the old bus stop: a bench under a tree, the empty road, the silent bell with a bird on it
  const camBus = (t) => camK(t, [[RT('6.01') - 1, cam3({ z: -200, x: -60 })], [RT('6.02') + 1, cam3({ z: -60, x: 60 })], [RT('6.03'), aim(2000, 1400, 330, 1.9, W * .62, H * .42), 'q'], [RT('6.04') + .6, aim(2000, 1400, 330, 2.05, W * .62, H * .42)]], .7);
  const S601 = {
    id: '6.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camBus(t), t3 = s.r('6.03'), bird = span(t, t3 - .4, t3 + .5);
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 600, clouds: 3, seed: 71 })],
        [8000, () => { K.hills(ctx, 620, 40, null, 6, { grad: [K.hz(L.leafS, 8000, L), K.hz(L.leaf, 6000, L)] }); for (let i = 0; i < 5; i++) K.house(ctx, -200 + i * 480, 660, 300, 220, L, { col: K.hz(['#d8b98a', '#c9a0a0', '#b7c0a0', '#d1b090', '#cfa77e'][i], 6000, L), t }); }],
        [3200, () => { K.band(ctx, 760, 1400, mixHex(L.walk, L.haze, .1), L.walk); ctx.fillStyle = mixHex('#8d8aa0', L.light, .15); ctx.fillRect(-1400, 820, W + 2800, 200); ctx.strokeStyle = rgba('#fff', .5); ctx.lineWidth = 6; ctx.setLineDash([60, 50]); ctx.beginPath(); ctx.moveTo(-1400, 920); ctx.lineTo(W + 1400, 920); ctx.stroke(); ctx.setLineDash([]);
          // the old bus stop sign, its plate blank, leaning
          ctx.save(); ctx.translate(380, 800); ctx.rotate(-.05); ctx.fillStyle = '#5a5f78'; ctx.fillRect(-6, -300, 12, 300); ctx.fillStyle = mixHex('#e8e1cf', L.shade, .1); ctx.beginPath(); ctx.arc(0, -300, 46, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(L.ink, .2); ctx.lineWidth = 6; ctx.stroke(); ctx.restore(); }],
        [2000, () => {
          K.tree(ctx, t, 1180, 820, 1.4, L, { apples: 14 });
          ctx.fillStyle = mixHex('#7a5030', L.shade, .2); ctx.fillRect(760, 740, 400, 20); ctx.fillRect(780, 760, 14, 60); ctx.fillRect(1126, 760, 14, 60); ctx.fillRect(760, 680, 400, 14);
          K.folk(ctx, t, 2, 900, 820, 230, { pose: 'sit', dir: 1, look: .2 }); K.folk(ctx, t, 4, 1040, 820, 220, { pose: 'sit', dir: -1, look: .1 + .1 * Math.sin(t) });
          // the school bell on its post, still; a bird lands on it
          ctx.fillStyle = '#4a4458'; ctx.fillRect(1394, 320, 12, 500); ctx.fillRect(1340, 300, 120, 12);
          ctx.save(); ctx.translate(1400, 312); ctx.rotate(.01 * Math.sin(t * .7)); ctx.fillStyle = lin(ctx, -30, 0, 30, 0, [[0, '#8a5a24'], [.5, '#ffe2a0'], [1, '#8a5a24']]); ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(10, 0); ctx.quadraticCurveTo(24, 26, 32, 56); ctx.lineTo(-32, 56); ctx.quadraticCurveTo(-24, 26, -10, 0); ctx.fill(); ctx.restore();
          if (bird > 0) { const e = K.expoOut(bird), bx = lerp(1700, 1400, e), by = lerp(80, 292, e) - Math.sin(Math.PI * e) * 60, fl = bird < 1 ? Math.sin(t * 30) : 0;
            ctx.fillStyle = '#2a2a48'; ctx.beginPath(); ctx.ellipse(bx, by, 16, 10, -.2, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(bx - 14, by - 8, 7, 0, 7); ctx.fill();
            ctx.beginPath(); ctx.moveTo(bx - 2, by - 2); ctx.lineTo(bx + 14, by - 18 - 14 * fl); ctx.lineTo(bx + 20, by - 2); ctx.fill(); ctx.fillStyle = '#f2a23a'; ctx.beginPath(); ctx.moveTo(bx - 21, by - 9); ctx.lineTo(bx - 29, by - 7); ctx.lineTo(bx - 21, by - 5); ctx.fill(); }
        }],
        [1150, () => { K.tree(ctx, t, 2050, 1250, 2.2, L, { apples: 10 }); }],
      ]);
      K.caps(ctx, 'NO SCHOOL BUS', W * .3, 220, K.cardU(t, s.r('6.02') + .1, t3), { size: 30, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'NO BELL', W * .62, 160, K.cardU(t, t3 + .1, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: .9 },
  };
  // ---------------------------------------------------------------- 6.04 · no rows of desks facing a board: a blue-ink drawing, struck through (MIX on the street)
  const S604 = {
    id: '6.04',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -400, y: -20 })], [s.b + .6, cam3({ z: -250, y: -20 })]]);
      S.street(ctx, t, c, L, { apples: 1, bayTrees: 1, walkers: 1, kids: true, chalk: 1, fore: false });
      const u = K.cardU(t, s.a - .1, s.b + .3), st = span(t, s.a + 1.2, s.a + 1.8);
      if (u > 0) K.scr(ctx, (g) => K.paper(g, t, 460, 150, 1000, 560, u, { head: 'BACK IN THE TWENTIES', draw: (q, x, y, w, h) => {
        K.ink(q); q.strokeRect(x + w / 2 - 230, y + 20, 460, 140); q.beginPath(); q.moveTo(x + w / 2 - 120, y + 70); q.lineTo(x + w / 2 + 60, y + 70); q.moveTo(x + w / 2 - 120, y + 110); q.lineTo(x + w / 2 + 20, y + 110); q.stroke();
        for (let r = 0; r < 3; r++) for (let k = 0; k < 5; k++) { const dx = x + 120 + k * 160 + r * 10, dy = y + 220 + r * 70; q.strokeRect(dx, dy, 110, 26); q.beginPath(); q.moveTo(dx + 10, dy + 26); q.lineTo(dx + 10, dy + 50); q.moveTo(dx + 100, dy + 26); q.lineTo(dx + 100, dy + 50); q.stroke(); }
        if (st > 0) { K.ink(q, K.PAPER.red, 9); K.strokeIn(q, [[x + 40, y + h - 30], [x + w - 40, y + 20]], st); } } }));
    },
    out: { k: 'iris', c: [960, 640, 80], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 6.05 · the garden table: your granddaughter learns with a ring of light, it waits for her
  const S605 = {
    id: '6.05',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -250, x: -120 })], [s.a + 3.5, aim(1700, 960, 640, 1.3)], [s.b + .6, aim(1700, 940, 640, 1.45)]], .7);
      const wait = span(t, s.w('endlessly patient') - .2, s.w('endlessly patient') + .6), speed = span(t, s.w('moving at') - .2, s.w('moving at') + .5);
      garden(ctx, t, c, L, { ring: span(t, s.a + .4, s.a + 1.4), girlLook: -.2 + .25 * Math.sin(t * .9), armR: [1.3 + .25 * Math.sin(t * 1.7), 1.7],
        focus: (g, tt, cx, ty) => {
          // what the ring shows: shapes she builds; it waits (pulses slowly) while she thinks, then goes at her pace
          const n = 1 + Math.floor((t - s.a) * (.6 + .4 * speed)) % 6; for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283 + t * .2, on = k < n; g.fillStyle = rgba(on ? '#ffe7a8' : '#8fe6ff', on ? .9 : .35); g.beginPath(); g.arc(cx + 40 + Math.cos(a) * 110, ty - 60 + Math.sin(a) * 30, 12, 0, 7); g.fill(); }
          if (wait > 0) { const p = (t * .5) % 1; g.strokeStyle = rgba('#e8fbff', wait * (1 - p) * .6); g.lineWidth = 3; g.beginPath(); g.ellipse(cx + 40, ty - 60, 70 + p * 80, 24 + p * 26, 0, 0, 7); g.stroke(); }
        } });
      K.caps(ctx, 'A TEACHER OF HER OWN', W / 2, 180, K.cardU(t, s.w('a teacher') - .1, s.w('a machine') + .2), { size: 30, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'AT EXACTLY HER SPEED', W / 2, 180, K.cardU(t, s.w('moving at'), s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: (t) => [W / 2 + 40, 560, 60], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 6.06 · the richest child on Earth: villa and flat side by side, the same ring
  const S606 = {
    id: '6.06',
    draw(ctx, t, s) {
      const L = look(R, t);
      K.scr(ctx, (g) => { g.fillStyle = '#0c1236'; g.fillRect(0, 0, W, H); });
      for (const [i, kind] of [[0, 'villa'], [1, 'flat']]) {
        const c = camK(t, [[s.a - 1, cam3({ z: -500, x: (i ? 1 : -1) * 20 })], [s.b + .6, cam3({ z: -380 })]]);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(i * W / 2 + 6, 0, W / 2 - 12, H); ctx.clip(); ctx.translate(i * W / 2 - W / 4, 0);
        garden(ctx, t, c, L, { house: kind, ring: span(t, s.a + .3 + i * .4, s.a + 1.0 + i * .4), girl: true, seed: 61 + i * 7, fore: false, girlLook: -.2 }); ctx.restore();
      }
      K.caps(ctx, 'THE RICHEST CHILD', W / 4, 150, K.cardU(t, s.a + .3, s.b + .3), { size: 26, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'YOUR GRANDDAUGHTER', W * .75, 150, K.cardU(t, s.a + .6, s.b + .3), { size: 26, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'THE SAME TEACHER', W / 2, 1000, K.cardU(t, s.a + 1.4, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: [W * .75, 560, 50], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 6.07 · even in your day: BEST and FREE almost on top of each other (EXPL)
  const S607 = {
    id: '6.07',
    draw(ctx, t, s) {
      K.dusk(ctx, t, { glow: [960, 500] });
      K.scr(ctx, (g) => {
        const z = 1 + .03 * span(t, s.a, s.b + 1); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        const x0 = 260, x1 = 1640, y0 = 860, u = span(t, s.a, s.a + 2.4), lag = 150;
        g.strokeStyle = rgba('#cfd8ff', .35); g.lineWidth = 2; g.beginPath(); g.moveTo(x0, 300); g.lineTo(x0, y0); g.lineTo(x1, y0); g.stroke();
        const f = (x) => y0 - 520 * Math.pow((x - x0) / (x1 - x0), 1.6);
        const best = [], free = []; for (let i = 0; i <= 40; i++) { const x = lerp(x0, x1, i / 40); best.push([x, f(x)]); free.push([x, f(Math.max(x0, x - lag))]); }
        g.strokeStyle = '#ffe7a8'; g.lineWidth = 5; K.strokeIn(g, best, u); g.strokeStyle = '#8fe6ff'; g.lineWidth = 5; K.strokeIn(g, free, span(t, s.a + .3, s.a + 2.7));
        if (u > .9) { K.glowText(g, 'BEST', x1 + 20, f(x1) + 10, { size: 30, weight: 700, col: '#ffe7a8', glow: false }); K.glowText(g, 'FREE', x1 + 20, f(x1 - lag) + 14, { size: 30, weight: 700, col: '#8fe6ff', glow: false }); }
        const gp = span(t, s.a + 2.6, s.a + 3.3); if (gp > 0) { const y = f(x1) - 40; g.globalAlpha = gp; g.strokeStyle = P.cream; g.lineWidth = 3; g.beginPath(); g.moveTo(x1 - lag, y); g.lineTo(x1, y); g.stroke(); K.glowText(g, '≈ 4 MONTHS', x1 - lag / 2, y - 22, { size: 30, weight: 700, align: 'center', col: P.cream, glow: false }); g.globalAlpha = 1; }
      });
      K.today(ctx, t, s.a + .6, s.b + .2, ['FREE, OPEN AI MODELS ARE ABOUT', '4 MONTHS BEHIND THE BEST'], 'EPOCH AI, MAY 2026', { size: 28, x: 560, y: 70 });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 6.08 · every afternoon the children pile into the old school building (its gate open)
  const camSch = (t) => camK(t, [[RT('6.08') - 1, cam3({ z: -400, y: -60 })], [RT('6.09') - .2, aim(2400, 960, 700, 1.6, W / 2, H * .55), 'q']], .7);
  const S608 = {
    id: '6.08',
    draw(ctx, t, s) {
      const L = look(R, t), c = camSch(t);
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 600, clouds: 4, seed: 81 })],
        [8000, () => K.hills(ctx, 620, 40, null, 8, { grad: [K.hz(L.leafS, 8000, L), K.hz(L.leaf, 6000, L)] })],
        [2400, () => {
          K.band(ctx, 860, 1400, mixHex(L.walk, L.light, .1), L.walk);
          ctx.fillStyle = lin(ctx, 300, 0, 1620, 0, [[0, mixHex('#d8a07a', L.shade, .25)], [1, mixHex('#e6b88a', L.light, .2)]]); ctx.fillRect(300, 300, 1320, 560);
          ctx.fillStyle = lin(ctx, 0, 140, 0, 300, [[0, mixHex(L.roof, L.light, .2)], [1, L.roofS]]); ctx.beginPath(); ctx.moveTo(260, 300); ctx.lineTo(960, 140); ctx.lineTo(1660, 300); ctx.fill();
          ctx.fillStyle = '#4a4458'; ctx.fillRect(930, 60, 60, 100); ctx.fillStyle = mixHex('#ffe2a0', L.shade, .2); ctx.beginPath(); ctx.arc(960, 120, 18, Math.PI, 0); ctx.fill();
          for (let k = 0; k < 6; k++) { if (k === 2 || k === 3) continue; ctx.fillStyle = mixHex('#5a6a9a', L.shade, .2); ctx.fillRect(360 + k * 210, 380, 130, 170); ctx.fillRect(360 + k * 210, 620, 130, 170); }
          ctx.fillStyle = rgba(L.ink, .35); ctx.font = '700 48px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.fillText('S C H O O L', 960, 360);
          ctx.fillStyle = mixHex('#2a2238', L.shade, .2); ctx.fillRect(820, 560, 280, 300); ctx.fillStyle = lin(ctx, 0, 560, 0, 860, [[0, rgba('#ffe7a8', .55)], [1, rgba('#ffb35c', .3)]]); ctx.fillRect(840, 580, 240, 280);
          // open gate leaves
          ctx.strokeStyle = '#2a3048'; ctx.lineWidth = 8; for (const sd of [-1, 1]) { const gx = 960 + sd * 190; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(gx + sd * k * 30, 880 - k * 4); ctx.lineTo(gx + sd * k * 30, 700 - k * 10); ctx.stroke(); } }
        }],
        [1800, () => { for (let i = 0; i < 7; i++) { const ph = ((t - s.a) * .22 + i / 7) % 1, x = lerp(i % 2 ? 1900 : 0, 960, K.sineIO(ph)), y = lerp(1040, 870, ph), h = lerp(260, 150, ph); if (ph > .97) continue; K.folk(ctx, t, i, x, y, h, { walk: K.walkPh(t, 1.3) + i, dir: i % 2 ? -1 : 1 }); } }],
      ]);
    },
    out: { k: 'portal', win: (t) => { const c = camSch(t), a = project(c, 2400, 840, 580), b = project(c, 2400, 1080, 860); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .4, dur: 1.1 },
  };
  // ---------------------------------------------------------------- 6.09–6.10 · it's a workshop now: the hull on trestles, the boat builder shows the children the plane
  const S609 = {
    id: '6.09',
    draw(ctx, t, s) {
      const L = look(R, t), t10 = s.r('6.10'), c = camK(t, [[s.a - 1, cam3({ z: -260 })], [t10, cam3({ z: -120, x: 60 })], [s.b + .6, aim(2500, 900, 640, 1.25)]], .7);
      const pl = ((t - t10) * .5) % 1, px = lerp(560, 1280, K.sineIO(clamp(pl)));
      PL.shop(ctx, t, c, L, { winX: 140, lampX: 1500, postX: 1840,
        back: (g) => { g.fillStyle = '#2f3a5a'; g.fillRect(560, 230, 520, 300); g.strokeStyle = rgba('#e8eefc', .7); g.lineWidth = 3; g.beginPath(); g.moveTo(600, 460); g.quadraticCurveTo(820, 540, 1040, 450); g.moveTo(600, 460); g.lineTo(1040, 450); g.stroke(); g.fillStyle = rgba('#e8eefc', .7); g.font = '28px "Instrument Serif"'; g.fillText('a boat that floats', 640, 300); },
        mid: (g) => { PL.hull(g, t, 520, 660, 820, L, { planed: t > t10 ? pl : 0 }); if (t > t10) PL.shavings(g, t, px, 560, 10); },
        focus: (g) => {
          K.folk(g, t, 4, t > t10 ? px * .74 + 260 : 1500, 1030, 520, { armR: [1.25 + .12 * Math.sin(t * 3.4), 1.45], armL: [-1.1, -1.3], dir: -1, lean: .1, look: .5 });
          const kids = [[420, 2], [640, 3], [1280, 5], [1460, 1]]; kids.forEach(([x, i], k) => { const enter = span(t, s.a - .6 + k * .2, s.a + .6 + k * .2), xx = lerp(1500, x, K.expoOut(enter)); K.folk(g, t, i, xx, 1050, 300 + (k % 2) * 30, { dir: x < 960 ? 1 : -1, look: .5 + .2 * Math.sin(t + k), walk: enter < 1 ? K.walkPh(t, 1.2) : undefined, pose: enter >= 1 && k === 1 ? 'point' : undefined }); });
          K.girl(g, t, 820, 1060, 300, { dir: 1, look: .6, pose: 'hold' });
        } });
      K.caps(ctx, 'THE OLD SCHOOL · A WORKSHOP NOW', W / 2, 180, K.cardU(t, s.a + .1, t10 + .5), { size: 28, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: [960, 520, 70], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 6.11–6.12 · fractions from the machine, losing an argument from children (two halves, MIX)
  const S611 = {
    id: '6.11',
    draw(ctx, t, s) {
      const L = look(R, t), t12 = s.r('6.12');
      const c = camK(t, [[s.a - 1, aim(1700, 960, 640, 1.25)], [t12, aim(1700, 960, 640, 1.35)], [s.b + .6, cam3({ z: -300 })]], .7);
      garden(ctx, t, c, L, { ring: 1, girlLook: -.3, focus: (g, tt, cx, ty) => {
        const u = span(t, s.a + .2, s.a + 1.4); if (u <= 0) return; const px = cx + 40, py = ty - 200; g.fillStyle = rgba('#8fe6ff', .25); g.beginPath(); g.arc(px, py, 90, 0, 7); g.fill();
        g.fillStyle = '#ffe7a8'; g.beginPath(); g.moveTo(px, py); g.arc(px, py, 90, -1.57, -1.57 + 6.283 * .75 * K.expoOut(u)); g.closePath(); g.fill(); g.strokeStyle = '#0c1236'; g.lineWidth = 3; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(-1.57 + k * 1.57) * 90, py + Math.sin(-1.57 + k * 1.57) * 90); g.stroke(); }
        K.glowText(g, '¾', px + 130, py + 20, { size: 70, serif: true, col: P.cream, a: u }); } });
      // the argument: an inset card from the workshop (two children over the plan, one gives in, both laugh)
      const u = K.cardU(t, t12 - .2, s.b + .3), give = span(t, t12 + 2.0, t12 + 2.6), laugh = span(t, t12 + 2.8, t12 + 3.4);
      if (u > 0) K.scr(ctx, (g) => K.paper(g, t, 980, 160, 820, 600, u, { head: 'IN THE WORKSHOP', draw: (q, x, y, w, h) => {
        q.fillStyle = rgba(K.PAPER.ink, .08); q.fillRect(x, y, w, h); q.fillStyle = '#f6efdc'; q.fillRect(x + w / 2 - 120, y + h - 120, 240, 60); K.ink(q); q.strokeRect(x + w / 2 - 120, y + h - 120, 240, 60);
        const bob = laugh * Math.abs(Math.sin(t * 9)) * 8;
        K.folk(q, t, 2, x + 180, y + h - 10 - bob, 340, { dir: 1, pose: give > .5 ? 'stand' : 'point', armR: give > .5 ? [.4, .5] : [1.7 + .2 * Math.sin(t * 6), 1.8], look: .2 });
        K.girl(q, t, x + w - 180, y + h - 10 - bob * 1.2, 330, { dir: -1, pose: 'point', armR: [1.6 + .25 * Math.sin(t * 5.3) * (1 - give), 1.7], look: .2 });
        if (laugh > 0) { q.fillStyle = rgba('#c8473a', laugh); q.font = '700 40px "Instrument Serif"'; q.fillText('ha', x + 210, y + 80); q.fillText('ha', x + w - 220, y + 70); } } }));
      K.caps(ctx, 'FRACTIONS · A MACHINE', 520, 1000, K.cardU(t, s.a + .5, s.b + .3), { size: 26, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'LOSING AN ARGUMENT · OTHER CHILDREN', 1390, 830, K.cardU(t, t12 + .5, s.b + .3), { size: 26, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 7.01–7.02 · next door: the doctor's waiting room is a bakery now; people in and out with bread
  const S701 = {
    id: '7.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -200, x: 80 })], [s.b + .6, cam3({ z: 60, x: -60 })]]), paint = span(t, s.a + .6, s.a + 2.2);
      PL.shop(ctx, t, c, L, { winX: 140, lampX: 760, postX: -200,
        back: (g) => { // the sign: WAITING ROOM painted over by BAKERY; shelves of bread where the chairs stood
          g.fillStyle = '#f6efdc'; g.fillRect(580, 240, 480, 90); g.fillStyle = rgba(K.PAPER.ink, 1); g.font = '700 40px Inter'; g.textAlign = 'center'; g.fillText('WAITING ROOM', 820, 300);
          g.fillStyle = '#c8473a'; g.fillRect(580, 240, 480 * K.sineIO(paint), 90); if (paint > .6) { g.fillStyle = rgba('#fff3c4', span(paint, .6, 1)); g.font = '700 46px "Instrument Serif"'; g.fillText('BAKERY', 820, 302); }
          g.fillStyle = '#7a5030'; for (let r = 0; r < 3; r++) { g.fillRect(560, 400 + r * 140, 520, 16); for (let k = 0; k < 7; k++) { g.fillStyle = ['#d89a4a', '#c07a3a', '#e2b070'][(k + r) % 3]; g.beginPath(); g.ellipse(600 + k * 72, 380 + r * 140, 30, 18, 0, 0, 7); g.fill(); } g.fillStyle = '#7a5030'; }
          // the old chair legs still bolted to the floor, now under the shelf
          g.fillStyle = rgba(L.ink, .3); for (let k = 0; k < 4; k++) g.fillRect(620 + k * 120, 820, 50, 60);
        },
        mid: (g) => { g.fillStyle = mixHex('#8a5a34', L.shade, .1); g.fillRect(300, 760, 700, 160); g.fillStyle = '#f4efe0'; g.fillRect(300, 750, 700, 16); for (let k = 0; k < 5; k++) { g.fillStyle = '#d89a4a'; g.beginPath(); g.ellipse(360 + k * 130, 730, 46, 22, 0, 0, 7); g.fill(); } },
        focus: (g) => { K.folk(g, t, 3, 640, 1040, 440, { dir: -1, pose: 'hold', look: .2 });
          for (let i = 0; i < 3; i++) { const ph = ((t - s.a) * .16 + i / 3) % 1, x = lerp(1900, 1250, Math.sin(Math.PI * ph)), dir = ph < .5 ? -1 : 1; K.folk(g, t, i + 4, x, 1060, 470, { walk: K.walkPh(t, .9) + i, dir, pose: ph > .5 ? 'hold' : undefined }); } } });
      K.caps(ctx, 'NEXT DOOR', W / 2, 160, K.cardU(t, s.a, s.r('7.02') + .3), { size: 30, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'RARELY ILL FOR LONG', W / 2, 160, K.cardU(t, s.r('7.02') + .3, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: [W / 2, H / 2, 80], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 7.03 · health insurance: the old box, the insurance card next to the alarm clock (MIX)
  const S703 = {
    id: '7.03',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, aim(2400, 960, 700, 1.25)], [s.b + .6, aim(2400, 1000, 720, 1.45)]]);
      S.kitchen(ctx, t, c, L, { you: null, girlX: 1500, girlH: 330, girlPose: 'look', girlLook: -.4,
        clock: (g, tt, hd) => {} });
      K.scr(ctx, (g) => {
        const u = span(t, s.a - .3, s.a + .6); g.globalAlpha = u; const bx = 620, by = 600;
        g.fillStyle = '#8a6a44'; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + 560, by); g.lineTo(bx + 520, by + 300); g.lineTo(bx + 40, by + 300); g.fill(); g.fillStyle = '#6a4e30'; g.fillRect(bx - 10, by - 20, 580, 30);
        S.alarmClock(g, t, bx + 160, by - 40, .9);
        const lift = K.expoOut(span(t, s.a + .5, s.a + 1.6)); g.save(); g.translate(bx + 400, by - 40 - 160 * lift); g.rotate(-.1 + .1 * lift + .02 * Math.sin(t)); g.fillStyle = '#e8eef8'; g.beginPath(); g.roundRect(-130, -80, 260, 160, 14); g.fill(); g.fillStyle = '#2e5aa8'; g.fillRect(-130, -50, 260, 34);
        g.fillStyle = '#fff'; g.font = '700 20px Inter'; g.textAlign = 'center'; g.fillText('HEALTH INSURANCE', 0, -26); g.fillStyle = '#c8a040'; g.fillRect(-100, 10, 50, 40); g.fillStyle = rgba('#1f3c8a', .6); g.fillRect(-30, 14, 130, 8); g.fillRect(-30, 34, 100, 8); g.restore(); g.globalAlpha = 1;
      });
      K.caps(ctx, 'ONE MORE THING TO EXPLAIN', W / 2, 200, K.cardU(t, s.a + 1.6, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  return [S601, S604, S605, S606, S607, S608, S609, S611, S701, S703];
}
