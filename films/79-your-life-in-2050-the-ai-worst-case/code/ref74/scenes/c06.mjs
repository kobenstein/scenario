// Film 74 · c06 DIVIDEND DAY (5.01–5.28): noon on the square, the whole street chimes, the machines' month split into equal circles for every door,
// the end of the month that used to drain you, C4 (Hassabis, Davos) out of the old screen at the fountain, countries vote, Taiwan, the shut gate,
// South Korea's stock dip, the scale TOO MUCH · TOO EARLY, the co-owner slice, DIVIDEND | FREE BASICS, the old kitchen table at night, twelve years of chairs.
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as PL from '../lib/f79_places.mjs';
import { hourAt } from './hud.mjs';
import { clipPlate } from './clips.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, lin, rad, prng } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const poly = (c, pts, x = 0, y = 0, k = 1) => { c.beginPath(); pts.forEach(([a, b], i) => (i ? c.lineTo(x + a * k, y + b * k) : c.moveTo(x + a * k, y + b * k))); c.closePath(); };
// a very rough world (design px of the 1920 frame): continents as soft blobs, Taiwan as a dot off East Asia
const WORLD = {
  NAm: [[170, 250], [330, 190], [520, 210], [600, 300], [540, 380], [470, 470], [380, 520], [300, 470], [230, 380], [160, 330]],
  SAm: [[430, 560], [540, 590], [590, 680], [560, 800], [500, 900], [460, 860], [440, 740], [410, 640]],
  Eur: [[860, 230], [960, 200], [1060, 230], [1050, 300], [980, 340], [900, 330], [860, 290]],
  Afr: [[880, 380], [1020, 370], [1110, 450], [1100, 580], [1040, 720], [980, 760], [940, 640], [880, 520], [850, 440]],
  Asia: [[1060, 200], [1300, 160], [1560, 190], [1700, 260], [1680, 360], [1560, 430], [1460, 470], [1360, 450], [1250, 420], [1140, 380], [1080, 310]],
  Aus: [[1500, 650], [1620, 620], [1700, 680], [1680, 760], [1580, 780], [1500, 730]],
};
const TAIWAN = [1588, 448];
// a school chair seen from the front-left (design units, base at y)
function chair(c, x, y, s, col) { c.fillStyle = col; c.fillRect(x - 40 * s, y - 70 * s, 80 * s, 10 * s); c.fillRect(x - 36 * s, y - 70 * s, 6 * s, 70 * s); c.fillRect(x + 30 * s, y - 70 * s, 6 * s, 70 * s); c.fillRect(x - 40 * s, y - 150 * s, 80 * s, 46 * s); c.fillRect(x - 36 * s, y - 106 * s, 6 * s, 40 * s); c.fillRect(x + 30 * s, y - 106 * s, 6 * s, 40 * s); }
export default function c06(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- 5.01–5.03 · the town square before noon: the camera rises to the clock, the hands meet, the bell
  const camSq = (t) => camK(t, [[RT('5.01') - 1, cam3({ z: -700, y: -20 })], [RT('5.02'), cam3({ z: -300, y: -180 })], [RT('5.03'), aim(5200, 960, 250, 2.6, W / 2, H * .42), 'q'], [RT('5.04') + .6, aim(5200, 960, 230, 2.2, W / 2, H * .4)]], .7);
  const S501 = {
    id: '5.01',
    draw(ctx, t, s) {
      const L = look(R, t), t3 = s.r('5.03'), m = clamp((t - (t3 - 6)) / 6);   // the minute hand creeps up to twelve, lands on 'Noon.'
      const mm = -1.5708 - (1 - K.expoOut(m)) * 0.55, bell = span(t, t3 - .05, t3 + .25);
      PL.square(ctx, t, camSq(t), L, { clock: -1.5708 - (1 - m) * .04, minute: mm, bell, people: 7, tables: 1 });
    },
    out: { k: 'iris', c: [W / 2, H * .42, 150], lead: .25, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.04–5.07 · the whole street chimes at once · DIVIDEND DAY · one pot → equal circles → your door
  const camSt = (t) => camK(t, [[RT('5.04') - 1, cam3({ z: -500, y: -30 })], [RT('5.06'), cam3({ z: -380, y: -40 })], [RT('5.07'), aim(2600, 40, 640, 1.3, W * .42, H * .52), 'q'], [RT('5.08') + .6, aim(2600, 40, 640, 1.42, W * .42, H * .52)]], .7);
  const S504 = {
    id: '5.04',
    draw(ctx, t, s) {
      const L = look(R, t), c = camSt(t), t6 = s.r('5.06'), t7 = s.r('5.07');
      const g = S.street(ctx, t, c, L, { apples: 1, bayTrees: 1, solar: 1, walkers: 1, fore: false, chime: clamp(span(t, s.a, s.a + .25) * 1.2 - span(t, s.a + 2.4, s.a + 3.4) * .8), lanterns: span(t, s.r('5.05') - .2, s.r('5.05') + .8) });
      const pot = [W / 2, 190], pu = span(t, t6 - .3, t6 + .5);
      // the machines' month: a cyan ring in the sky turns into one gold pot, then an equal circle flies to every door
      if (pu > 0) K.scr(ctx, (q) => { K.ring(q, t, pot[0], pot[1], 46, pu * (1 - span(t, t6 + .2, t6 + .9))); const gp = span(t, t6 + .2, t6 + .9); if (gp > 0) { q.globalAlpha = gp; K.coin(q, pot[0], pot[1], 46 + 6 * Math.sin(t * 2), t); q.globalAlpha = 1; } });
      const doors = [];
      if (g.yours?.door) { const [dx, dy, dw, dh] = g.yours.door; doors.push([project(c, 2600, dx + dw / 2, dy + dh * .4), 0]); }
      if (g.across?.door) { const [dx, dy, dw, dh] = g.across.door; doors.push([project(c, 2600, dx + dw / 2, dy + dh * .4), .15]); }
      for (const [k, gm] of (g.mid || []).entries()) doors.push([project(c, 4200, gm.x + gm.w / 2, gm.base - gm.h * .35), .3 + k * .1]);
      K.scr(ctx, (q) => { for (const [[x, y, kk], d] of doors) { const f = span(t, t6 + .9 + d, t6 + 2.2 + d); if (f <= 0) continue; const e = K.sineIO(f), cx = lerp(pot[0], x, e), cy = lerp(pot[1], y, e) - Math.sin(Math.PI * e) * 120, r = lerp(14, 22 * Math.min(1.6, kk), e);
        if (f < 1) { K.goldLine(q, [[pot[0], pot[1]], [lerp(pot[0], x, e * .5), lerp(pot[1], y, e * .5) - 90 * e], [cx, cy]], 1, { w: 2.5, blur: 8 }); } K.coin(q, cx, cy, r * 1.4, t + d * 7); } });
      // you too: your circle flares at your door
      const yu = span(t, t7, t7 + .5); if (yu > 0 && doors[0]) K.scr(ctx, (q) => K.halo(q, doors[0][0][0], doors[0][0][1], 160, .5 * yu * (1 - span(t, t7 + 1.2, t7 + 2.4))));
      const du = K.cardU(t, s.r('5.05') - .05, t6 + 1.0);
      if (du > 0) K.scr(ctx, (q) => { K.scrim(q, 460, 300, 1000, 200, .45 * du); K.words(q, 'Dividend Day', W / 2, 430, 124, du, { align: 'center', col: '#ffe7a8' }); });
      K.caps(ctx, 'WHAT THE MACHINES EARNED THIS MONTH', W / 2, 290, K.cardU(t, t6 + .3, t7 + .2), { size: 28, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: (t, h) => { const c = camSt(t), [x, y] = project(c, 2600, 40, 640); return [x, y, 60]; }, lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.08 · the biggest house and the smallest apartment, the same circle
  const S508 = {
    id: '5.08',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -200, x: -40 })], [s.b + .6, cam3({ z: 120, x: 40 })]]);
      let pts = [];
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 640, clouds: 3, seed: 58 })],
        [6000, () => { K.hills(ctx, 660, 40, null, 4, { grad: [K.hz(L.leafS, 6000, L), K.hz(L.leaf, 5000, L)] }); }],
        [2200, () => {
          K.band(ctx, 860, 1400, mixHex(L.grass, L.walk, .25), L.grass);
          const big = K.house(ctx, 140, 880, 760, 520, L, { col: '#e2c79a', side: 1, rows: 3, cols: 4, t, roofH: 220, door: 'plain' });
          ctx.fillStyle = mixHex('#c8b99a', L.shade, .25); ctx.fillRect(1180, 260, 520, 620); ctx.fillStyle = rgba(L.ink, .15); ctx.fillRect(1180, 260, 520, 20);
          for (let r = 0; r < 7; r++) for (let k = 0; k < 6; k++) { const lit = r === 5 && k === 4; ctx.fillStyle = lit ? mixHex('#ffe7a8', L.light, .2) : mixHex('#5a6a9a', L.shade, .3); ctx.fillRect(1205 + k * 82, 290 + r * 82, 56, 56); }
          for (const x of [1000, 1100]) K.tree(ctx, t, x, 880, .7, L, { apples: 8 });
          pts = [project(c, 2200, big.x + big.w / 2, big.base - big.h * .55), project(c, 2200, 1205 + 4 * 82 + 28, 290 + 5 * 82 + 28)];
        }],
      ]);
      K.scr(ctx, (q) => {
        pts.forEach(([x, y], i) => { const f = span(t, s.a + .2 + i * .5, s.a + 1.2 + i * .5); if (f <= 0) return; const e = K.expoOut(f); K.coin(q, x, lerp(y - 240, y, e), 40, t + i); });
        const u = K.cardU(t, s.a + 1.7, s.b + .3); if (u > 0) { K.caps(q, 'THE BIGGEST HOUSE', pts[0][0], pts[0][1] - 90, u, { size: 24, align: 'center', col: '#ffe7a8' }); K.caps(q, 'THE SMALLEST APARTMENT', pts[1][0], pts[1][1] - 90, u, { size: 24, align: 'center', col: '#ffe7a8' }); K.caps(q, '=', W / 2 + 40, pts[1][1] + 20, u, { size: 64, align: 'center', col: '#ffe7a8' }); }
      });
    },
    out: { k: 'iris', c: (t, h) => [1205 + 4 * 82 + 28 + 40, 730, 40], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.09–5.10 · the month: 2026 the account drains to the 30th; 2050 the same day fills it (EXPL)
  const S509 = {
    id: '5.09',
    draw(ctx, t, s) {
      const t10 = s.r('5.10'); K.dusk(ctx, t, { glow: [960, 520] });
      K.scr(ctx, (g) => {
        const z = 1 + .025 * span(t, s.a, s.b + 1); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        const panel = (x0, lab, cold, u, run, fill) => {
          g.globalAlpha = u; g.fillStyle = cold ? rgba('#1a2350', .9) : rgba('#2a2a50', .9); g.beginPath(); g.roundRect(x0, 220, 700, 600, 18); g.fill(); g.strokeStyle = rgba(cold ? '#8aa0e0' : '#ffe7a8', .5); g.lineWidth = 2; g.stroke();
          K.glowText(g, lab, x0 + 40, 290, { size: 44, serif: true, col: cold ? '#cfd8ff' : '#ffe7a8', glow: false });
          for (let d = 0; d < 30; d++) { const cx = x0 + 60 + (d % 7) * 90, cy = 340 + Math.floor(d / 7) * 62, on = d < run * 30; g.fillStyle = d === 29 ? rgba(cold ? '#e0443a' : '#f6c95c', .9) : rgba(cold ? '#8aa0e0' : '#ffe7a8', on ? .55 : .15); g.beginPath(); g.roundRect(cx, cy, 70, 48, 6); g.fill();
            g.fillStyle = d === 29 ? '#fff' : rgba('#0b1340', .9); g.font = '700 20px Inter'; g.textAlign = 'center'; g.fillText(String(d + 1), cx + 35, cy + 32); }
          g.textAlign = 'left'; g.fillStyle = rgba('#e8eefc', .7); g.font = '600 20px Inter'; g.fillText('ACCOUNT', x0 + 60, 702);
          g.strokeStyle = rgba('#e8eefc', .4); g.strokeRect(x0 + 60, 720, 580, 40); g.fillStyle = cold ? lin(g, x0 + 60, 0, x0 + 640, 0, [[0, '#e0443a'], [1, '#8aa0e0']]) : lin(g, x0 + 60, 0, x0 + 640, 0, [[0, '#f6c95c'], [1, '#fff3c4']]); g.fillRect(x0 + 62, 722, 576 * fill, 36);
          g.globalAlpha = 1;
        };
        const r1 = clamp((t - s.a) / Math.max(1, t10 - s.a)), drain = 1 - .97 * K.sineIO(r1);
        panel(150, '2026', true, span(t, s.a - .2, s.a + .5), r1, drain);
        const u2 = span(t, t10 - .2, t10 + .5), r2 = clamp((t - t10) / 1.6), fill = r2 < .95 ? .1 * (1 - r2) : K.expoOut(span(t, t10 + 1.5, t10 + 2.3));
        if (u2 > 0) panel(1070, '2050', false, u2, r2, Math.max(.03, fill));
        if (r1 > .9) K.caps(g, 'THE MONEY RAN OUT', 500, 880, span(r1, .9, 1) * (1 - u2 * .4), { size: 26, align: 'center', col: '#ff9a8a' });
        if (fill > .5) K.caps(g, 'THE MONEY ARRIVES', 1420, 880, span(fill, .5, 1), { size: 26, align: 'center', col: '#ffe7a8' });
      });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.11–5.13 · C4 · back at the fountain: the paper card, the old screen lights, the clip grows out of it
  const SCRN = [760, 420, 400, 230];
  const camF = (t) => camK(t, [[RT('5.11') - 1, cam3({ z: -500, y: -40 })], [RT('5.12') + .5, aim(1700, 960, 560, 1.35)], [T.clip('C4').start, aim(1700, 960, 540, 1.5)], [T.clip('C4').end + 1, aim(1700, 960, 540, 1.3)]], .7);
  const scrRect = (t) => { const c = camF(t), a = project(c, 1700, SCRN[0], SCRN[1]), b = project(c, 1700, SCRN[0] + SCRN[2], SCRN[1] + SCRN[3]); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; };
  const S511 = {
    id: '5.11',
    draw(ctx, t, s) {
      const L = look(R, t), t12 = s.r('5.12'), t13 = s.r('5.13'), C4 = T.clip('C4'), lit = span(t, t13, t13 + .5);
      PL.square(ctx, t, camF(t), L, { people: 6, tables: 1, focus: (g) => {
        const su = span(t, t12 - .4, t12 + .6); if (su <= 0) return; const [x, y, w, h] = SCRN, e = K.expoOut(su);
        g.save(); g.translate(x + w / 2, y + h + 200); g.scale(e, e); g.rotate(-.04);
        g.fillStyle = '#16182c'; g.fillRect(-w / 2 - 12, -h - 212, w + 24, h + 24); g.fillStyle = lin(g, 0, -h - 200, 0, -200, [[0, mixHex('#2a3460', '#8fb4ff', .5 * lit)], [1, '#121630']]); g.fillRect(-w / 2, -h - 200, w, h);
        g.fillStyle = rgba('#ffffff', .08); g.beginPath(); g.moveTo(-w / 2, -200); g.lineTo(-w / 2 + w * .4, -h - 200); g.lineTo(-w / 2 + w * .55, -h - 200); g.lineTo(-w / 2 + w * .15, -200); g.fill();
        if (lit > 0) K.halo(g, 0, -h / 2 - 200, w * .9, .35 * lit * (.85 + .15 * Math.sin(t * 9)));
        g.fillStyle = '#16182c'; g.fillRect(-50, -200 + 12, 100, 120); g.fillRect(-110, -80, 220, 16); g.restore(); } });
      const pu = K.cardU(t, s.a + .1, t12 + .3);
      if (pu > 0) K.scr(ctx, (g) => K.paper(g, t, 640, 160, 640, 200, pu, { head: 'BACK IN THE TWENTIES', lines: ['the head of an AI lab, on sharing'], lineSize: 40, from: [960, 760] }));
      K.caps(ctx, 'LISTEN', W / 2, 220, K.cardU(t, t13 - .1, C4.start - .1), { size: 30, align: 'center', col: '#ffe7a8' });
      const m = span(t, C4.start - .6, C4.start + .2) - span(t, C4.end - .2, C4.end + .6);
      if (m > 0) clipPlate(ctx, t, T, 'C4', scrRect(t), m);
    },
    out: { k: 'iris', c: (t) => { const [x, y, w, h] = scrRect(t); return [x + w / 2, y + h / 2, h / 2]; }, lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.14–5.17 · I DON'T KNOW tips over and falls into a map; countries vote one by one; Taiwan (EXPL)
  const S514 = {
    id: '5.14',
    draw(ctx, t, s) {
      const t15 = s.r('5.15'), t16 = s.r('5.16'), t17 = s.r('5.17'); K.dusk(ctx, t, { glow: [960, 480] });
      K.scr(ctx, (g) => {
        const fall = K.expoIn(span(t, t15 + .2, t16 + .1)), tip = span(t, s.a + .4, t15 + .3);
        if (fall < 1) { g.save(); g.translate(960, 470 + fall * 700); g.rotate(-.25 * K.sineIO(tip) - fall * .6); g.globalAlpha = 1 - span(fall, .7, 1);
          K.glowText(g, '"I don\'t know"', 0, 0, { size: 120, serif: true, align: 'center', col: P.cream }); g.restore(); }
        const mu = span(t, t16 - .4, t16 + .6); if (mu <= 0) return;
        const z = 1 + .04 * span(t, t16, s.b + 1) + 1.1 * K.quartIO(span(t, t17 - .1, t17 + 1.3)), fx = lerp(960, TAIWAN[0], K.quartIO(span(t, t17 - .1, t17 + 1.3))), fy = lerp(520, TAIWAN[1], K.quartIO(span(t, t17 - .1, t17 + 1.3)));
        g.translate(960, 540); g.scale(z, z); g.translate(-fx, -fy);
        const keys = Object.keys(WORLD), r = prng(7);
        keys.forEach((k, i) => { poly(g, WORLD[k]); g.fillStyle = rgba('#2c3e8a', .85 * mu); g.fill(); g.strokeStyle = rgba('#cfd8ff', .5 * mu); g.lineWidth = 2; g.stroke(); });
        // ballots drop, one country after another (dots inside the blobs light gold)
        const B = [[480, 320], [960, 270], [1000, 560], [1380, 330], [500, 700], [1600, 700], [300, 400], [1200, 400], [920, 300], [1500, 300]];
        B.forEach(([x, y], i) => { const d = span(t, t16 + .3 + i * .35, t16 + .8 + i * .35); if (d <= 0) return; const yy = y - 120 * (1 - K.expoOut(d)); g.fillStyle = rgba('#f6efdc', d); g.fillRect(x - 12, yy - 16, 24, 30); g.fillStyle = K.PAPER.ink; g.fillRect(x - 7, yy - 6, 14, 3);
          if (d >= 1) { g.fillStyle = rad(g, x, y, 60, [[0, rgba('#f6c95c', .55)], [1, rgba('#f6c95c', 0)]]); g.fillRect(x - 60, y - 60, 120, 120); } });
        const tw = span(t, t17, t17 + .6); g.fillStyle = mixHex('#8aa0e0', '#ffe2a0', tw); g.beginPath(); g.ellipse(TAIWAN[0], TAIWAN[1], 8, 16, .3, 0, 7); g.fill();
        if (tw > 0) { g.fillStyle = rad(g, TAIWAN[0], TAIWAN[1], 70, [[0, rgba('#fff3c4', .7 * tw)], [1, rgba('#f6c95c', 0)]]); g.fillRect(TAIWAN[0] - 70, TAIWAN[1] - 70, 140, 140); }
      });
      K.caps(ctx, 'ONE VOTE AT A TIME', W / 2, 160, K.cardU(t, t16 + .4, t17), { size: 30, align: 'center', col: '#ffe7a8' });
      K.today(ctx, t, t17 + .6, s.b + .2, ['TAIWAN PLANS AN "AI DIVIDEND"', 'FOR EVERY CITIZEN'], 'CABINET PLAN, AUG 2026 · FOCUS TAIWAN', { size: 30, x: 90, y: 620 });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.18–5.20 · did the companies hand it over? the gate stays shut (EXPL)
  const S518 = {
    id: '5.18',
    draw(ctx, t, s) {
      const t19 = s.r('5.19'), t20 = s.r('5.20'), c = camK(t, [[s.a - 1, cam3({ z: -120 })], [t20, cam3({ z: 120 })], [s.b + .6, cam3({ z: -300, y: 60 }), 'q']]);
      K.dusk(ctx, t, { glow: [960, 360] });
      K.stage(ctx, c, [
        [5000, () => { ctx.fillStyle = '#1a2250'; ctx.fillRect(360, 160, 1200, 560); for (let r = 0; r < 4; r++) for (let k = 0; k < 8; k++) { ctx.fillStyle = rgba('#8fe6ff', .25 + .2 * Math.sin(t * .7 + r + k)); ctx.fillRect(420 + k * 140, 220 + r * 110, 80, 60); } K.ring(ctx, t, 960, 120, 60, 1); }],
        [1800, () => {
          ctx.fillStyle = '#0e1436'; ctx.fillRect(330, 300, 60, 640); ctx.fillRect(1530, 300, 60, 640);
          const sh = span(t, t19 - .1, t19 + .1), shake = (1 - span(t, t19 + .1, t19 + .5)) * sh * Math.sin(t * 60) * 6;
          ctx.save(); ctx.translate(shake, 0); ctx.strokeStyle = '#2a3468'; ctx.lineWidth = 16; for (let k = 0; k < 15; k++) { const x = 410 + k * 80; ctx.beginPath(); ctx.moveTo(x, 340); ctx.lineTo(x, 940); ctx.stroke(); }
          ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(390, 420); ctx.lineTo(1530, 420); ctx.moveTo(390, 860); ctx.lineTo(1530, 860); ctx.stroke();
          ctx.fillStyle = '#c8a040'; ctx.beginPath(); ctx.roundRect(925, 590, 70, 80, 10); ctx.fill(); ctx.strokeStyle = '#c8a040'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(960, 590, 26, Math.PI, 0); ctx.stroke(); ctx.restore();
          ctx.fillStyle = '#f6efdc'; ctx.fillRect(760, 250, 400, 70); ctx.fillStyle = K.PAPER.ink; ctx.font = '800 36px Inter'; ctx.textAlign = 'center'; ctx.fillText('THE COMPANIES', 960, 298);
          // a single coin offered at the gate goes nowhere
          const k = span(t, t20, t20 + 1.6); if (k > 0) { K.coin(ctx, 960 + 260 * Math.sin(k * 3) * (1 - k) , 1000 - 120 * Math.abs(Math.sin(k * 6)) * (1 - k), 20, t); }
        }],
      ]);
      K.caps(ctx, 'NO.', W / 2, 1000, K.cardU(t, t19, t20 + .3), { size: 40, align: 'center', col: '#ff9a8a' });
      K.caps(ctx, 'NOBODY COUNTED ON KINDNESS', W / 2, 160, K.cardU(t, t20 + .2, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.21 · South Korea: the mere suggestion sent the stock market down (EXPL)
  const S521 = {
    id: '5.21',
    draw(ctx, t, s) {
      K.dusk(ctx, t, { glow: [900, 520] });
      K.scr(ctx, (g) => {
        const z = 1 + .03 * span(t, s.a, s.b + 1); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        const x0 = 220, x1 = 1500, y0 = 360, y1 = 860; g.strokeStyle = rgba('#cfd8ff', .35); g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0, y1); g.lineTo(x1, y1); g.stroke();
        const N = 60, r = prng(21), pts = []; let v = 0; for (let i = 0; i <= N; i++) { v += (r() - .45) * 10; const dip = i > 38 ? -100 * K.expoOut(clamp((i - 38) / 5)) + (i > 48 ? 25 * (i - 48) / 12 : 0) : 0; pts.push([lerp(x0 + 20, x1 - 20, i / N), 560 - v * 1.6 - dip * 2.2]); }
        const u = span(t, s.a, s.a + 2.6); g.strokeStyle = '#8fe6ff'; g.lineWidth = 4; K.strokeIn(g, pts.slice(0, 39), clamp(u * 1.6));
        const d = span(t, s.a + 1.8, s.a + 3.0); if (d > 0) { g.strokeStyle = '#ff7a6a'; g.lineWidth = 5; K.strokeIn(g, pts.slice(38), d); }
        const tag = span(t, s.a + .8, s.a + 1.4); if (tag > 0) { const [px, py] = pts[38]; g.globalAlpha = tag; g.fillStyle = '#f6efdc'; g.beginPath(); g.roundRect(px - 150, py - 150, 300, 70, 8); g.fill(); g.fillStyle = K.PAPER.ink; g.font = '700 24px Inter'; g.textAlign = 'center'; g.fillText('"NATIONAL DIVIDEND"?', px, py - 105); g.strokeStyle = '#f6efdc'; g.lineWidth = 2; g.beginPath(); g.moveTo(px, py - 80); g.lineTo(px, py - 10); g.stroke(); g.globalAlpha = 1; }
        if (d > .6) K.glowText(g, '−5.1 %', pts[44][0] + 40, pts[44][1] + 90, { size: 64, serif: true, col: '#ff9a8a', a: span(d, .6, 1) });
        g.fillStyle = rgba('#cfd8ff', .6); g.font = '600 22px Inter'; g.textAlign = 'left'; g.fillText('KOSPI', x0 + 10, y0 - 16);
      });
      K.today(ctx, t, s.a + .6, s.b + .2, ['SOUTH KOREA, MAY 2026: A "NATIONAL', 'DIVIDEND" IS FLOATED · STOCKS FALL'], 'KOSPI DOWN UP TO 5.1 % · PRESIDENTIAL OFFICE DISTANCES ITSELF', { size: 28, y: 70 });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.22 · the investors had a point: the scale tips, the machines are never finished (EXPL)
  const S522 = {
    id: '5.22',
    draw(ctx, t, s) {
      K.dusk(ctx, t, { glow: [960, 420] });
      const tip = K.sineIO(span(t, s.a + 1.6, s.a + 3.0)) * .32 + .02 * Math.sin(t * 1.4), fade = span(t, s.a + 2.6, s.a + 4.6);
      K.scr(ctx, (g) => {
        const cx = 960, cy = 330, arm = 520; g.fillStyle = '#c9b48e'; g.fillRect(cx - 12, cy, 24, 560); g.beginPath(); g.moveTo(cx - 140, 900); g.lineTo(cx + 140, 900); g.lineTo(cx, 860); g.fill();
        g.save(); g.translate(cx, cy); g.rotate(-tip); g.fillStyle = '#e0cfa8'; g.fillRect(-arm, -8, arm * 2, 16); g.restore();
        const L1 = [cx - Math.cos(tip) * arm, cy + Math.sin(tip) * arm], R1 = [cx + Math.cos(tip) * arm, cy - Math.sin(tip) * arm];
        for (const [px, py, k] of [[...L1, 0], [...R1, 1]]) { g.strokeStyle = '#e0cfa8'; g.lineWidth = 3; g.beginPath(); g.moveTo(px, py); g.lineTo(px - 120, py + 200); g.moveTo(px, py); g.lineTo(px + 120, py + 200); g.stroke(); g.fillStyle = '#e0cfa8'; g.beginPath(); g.ellipse(px, py + 200, 150, 22, 0, 0, Math.PI); g.fill();
          if (k === 0) { const w = span(t, s.a + .5, s.a + 1.5); g.save(); g.translate(px, py + 196 - 70 * (1 - K.expoOut(w))); g.globalAlpha = w; g.fillStyle = '#5a6080'; g.beginPath(); g.moveTo(-90, 0); g.lineTo(90, 0); g.lineTo(70, -120); g.lineTo(-70, -120); g.fill(); g.fillStyle = '#fff'; g.font = '800 22px Inter'; g.textAlign = 'center'; g.fillText('TOO MUCH', 0, -72); g.fillText('TOO EARLY', 0, -42); g.restore(); }
          else { // half-built machines: scaffold rings that stop growing and fade
            for (let i = 0; i < 3; i++) { const x = px - 90 + i * 90, y = py + 120, gr = span(t, s.a + i * .3, s.a + 1.6 + i * .3) * (1 - fade * .9); g.strokeStyle = rgba('#8fe6ff', .9 * (1 - fade * .7)); g.lineWidth = 4; g.setLineDash([10, 8]); g.beginPath(); g.arc(x, y, 40, -1.57, -1.57 + 6.283 * .62 * gr); g.stroke(); g.setLineDash([]); } } }
        K.caps(g, 'AND NOBODY BUILDS THE MACHINES', 960, 1000, span(fade, .3, .8), { size: 30, align: 'center', col: '#ffe7a8' });
      });
    },
    out: { k: 'iris', c: [960, 330, 60], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.23–5.24 · nothing seized: one machine, two owner tags; the COUNTRY tag takes its slice (EXPL)
  const S523 = {
    id: '5.23',
    draw(ctx, t, s) {
      const t24 = s.r('5.24'); K.dusk(ctx, t, { glow: [960, 500] });
      K.scr(ctx, (g) => {
        const z = 1 + .03 * span(t, s.a, s.b + 1); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        K.ring(g, t, 960, 480, 120, span(t, s.a - .3, s.a + .4));
        const tagU = [span(t, s.a + .3, s.a + .9), span(t, s.a + .6, s.a + 1.2)];
        [['COMPANY', 560], ['COUNTRY', 1360]].forEach(([lab, x], i) => { if (tagU[i] <= 0) return; g.globalAlpha = tagU[i]; g.strokeStyle = '#e0cfa8'; g.lineWidth = 2; g.beginPath(); g.moveTo(960 + (i ? 120 : -120), 480); g.lineTo(x, 420 + 20 * Math.sin(t + i)); g.stroke();
          g.fillStyle = '#f6efdc'; g.beginPath(); g.roundRect(x - 130, 380 + 20 * Math.sin(t + i), 260, 76, 10); g.fill(); g.fillStyle = K.PAPER.ink; g.font = '800 30px Inter'; g.textAlign = 'center'; g.fillText(lab, x, 430 + 20 * Math.sin(t + i)); g.globalAlpha = 1; });
        // the output pie under the machine; the COUNTRY slice slides out to its tag
        const pu = span(t, t24 - .4, t24 + .4), sl = K.expoOut(span(t, t24 + .3, t24 + 1.4)); if (pu <= 0) return;
        const px = 960, py = 800, pr = 130; g.globalAlpha = pu; g.fillStyle = K.GOLD.body; g.beginPath(); g.moveTo(px, py); g.arc(px, py, pr, -1.57 + 6.283 * .3, -1.57 + 6.283); g.closePath(); g.fill();
        const ox = lerp(0, 340, sl), oy = lerp(0, -40, sl); g.fillStyle = '#ffe7a8'; g.beginPath(); g.moveTo(px + ox, py + oy); g.arc(px + ox, py + oy, pr, -1.57, -1.57 + 6.283 * .3); g.closePath(); g.fill(); g.globalAlpha = 1;
        if (sl > .6) K.caps(g, 'A SHARE, LIKE ANY CO-OWNER', 960, 1000, span(sl, .6, 1), { size: 28, align: 'center', col: '#ffe7a8' });
      });
      K.caps(ctx, 'NOTHING SEIZED', W / 2, 170, K.cardU(t, s.a + .1, t24), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: [1300, 760, 80], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.25–5.26 · two ways: DIVIDEND (your street drops in) | FREE BASICS (bus, water, power) (EXPL)
  const S525 = {
    id: '5.25',
    draw(ctx, t, s) {
      const t26 = s.r('5.26'); K.dusk(ctx, t, { glow: [960, 520] });
      K.scr(ctx, (g) => {
        const z = 1 + .025 * span(t, s.a, s.b + 1); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        const col = (x, lab, u) => { if (u <= 0) return; g.globalAlpha = u; g.fillStyle = rgba('#1a2350', .9); g.beginPath(); g.roundRect(x - 300, 260, 600, 640, 18); g.fill(); g.strokeStyle = rgba('#ffe7a8', .5); g.lineWidth = 2; g.stroke(); K.glowText(g, lab, x, 330, { size: 40, weight: 700, align: 'center', col: '#ffe7a8', glow: false, spacing: .1 }); g.globalAlpha = 1; };
        col(560, 'DIVIDEND', span(t, s.a - .2, s.a + .5));
        // your street (three little houses, one yellow door) drops into the column, coins rise
        const d = K.expoOut(span(t, s.a + .4, s.a + 1.3)); if (d > 0) { g.save(); g.translate(560, lerp(200, 640, d)); for (let k = -1; k <= 1; k++) { g.fillStyle = ['#d9b58c', '#cfa77e', '#b7c2a8'][k + 1]; g.fillRect(k * 150 - 55, -110, 110, 110); g.beginPath(); g.moveTo(k * 150 - 65, -110); g.lineTo(k * 150, -170); g.lineTo(k * 150 + 65, -110); g.fill(); g.fillStyle = k === -1 ? '#f2c230' : '#5a4a6a'; g.fillRect(k * 150 - 15, -50, 30, 50); } g.restore();
          for (let k = 0; k < 3; k++) { const p = ((t * .6 + k / 3) % 1); K.coin(g, 410 + k * 150, 560 - p * 160, 14, t + k); } }
        const u2 = span(t, t26 - .2, t26 + .5); col(1360, 'FREE BASICS', u2);
        if (u2 > 0) { const icons = [['BUS', 0], ['WATER', 1], ['POWER', 2]]; icons.forEach(([lab, i]) => { const v = span(t, t26 + .3 + i * .3, t26 + .8 + i * .3); if (v <= 0) return; const y = 440 + i * 150; g.globalAlpha = v; g.fillStyle = rgba('#ffe7a8', .15); g.beginPath(); g.roundRect(1100, y - 50, 520, 110, 12); g.fill();
          g.fillStyle = '#ffe7a8'; if (i === 0) { g.fillRect(1140, y - 30, 120, 60); g.fillStyle = '#1a2350'; g.fillRect(1150, y - 22, 30, 22); g.fillRect(1190, y - 22, 30, 22); g.fillRect(1230, y - 22, 22, 22); g.fillStyle = '#ffe7a8'; g.beginPath(); g.arc(1165, y + 34, 10, 0, 7); g.arc(1235, y + 34, 10, 0, 7); g.fill(); }
          else if (i === 1) { g.beginPath(); g.moveTo(1200, y - 36); g.quadraticCurveTo(1236, y + 10, 1200, y + 36); g.quadraticCurveTo(1164, y + 10, 1200, y - 36); g.fill(); }
          else { g.beginPath(); g.moveTo(1210, y - 40); g.lineTo(1176, y + 6); g.lineTo(1204, y + 6); g.lineTo(1190, y + 42); g.lineTo(1230, y - 8); g.lineTo(1204, y - 8); g.closePath(); g.fill(); }
          K.glowText(g, lab, 1320, y + 14, { size: 34, weight: 700, col: P.cream, glow: false }); K.glowText(g, 'FREE', 1580, y + 14, { size: 30, weight: 800, align: 'right', col: '#ffe7a8', glow: false }); g.globalAlpha = 1; }); }
      });
      K.today(ctx, t, t26 + 1.0, s.b + .2, ['LUXEMBOURG · FREE PUBLIC', 'TRANSPORT NATIONWIDE'], 'SINCE 1 MARCH 2020', { size: 26, y: 60, head: 'ALREADY IN YOUR DAY' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.27 · flashback: your old kitchen table at night, columns of figures, a calculator, wiped away (MIX)
  const S527 = {
    id: '5.27',
    draw(ctx, t, s) {
      const L = K.hourLook(22.5), c = camK(t, [[s.a - 1, aim(2400, 960, 700, 1.15)], [s.b + .6, aim(2400, 960, 720, 1.35)]]);
      S.kitchen(ctx, t, c, L, { you: null, girlX: -2000 });
      const u = K.cardU(t, s.a - .1, s.b + .3), wipe = span(t, s.b - 1.2, s.b - .2);
      if (u > 0) K.scr(ctx, (g) => K.paper(g, t, 420, 150, 1080, 700, u, { head: 'BACK IN THE TWENTIES · 2 AM', draw: (q, x, y, w, h) => {
        K.ink(q); q.beginPath(); q.moveTo(x + 40, y + h - 60); q.lineTo(x + w - 40, y + h - 60); q.stroke();   // the table edge
        q.beginPath(); q.arc(x + w - 160, y + 80, 40, 0, 7); q.stroke(); for (let k = 0; k < 4; k++) { q.beginPath(); q.moveTo(x + w - 160, y + 120 + k * 22); q.lineTo(x + w - 160 + Math.sin(k + t) * 4, y + 132 + k * 22); q.stroke(); }   // the lamp
        q.strokeRect(x + 520, y + 220, 140, 200); for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) q.strokeRect(x + 536 + k * 42, y + 300 + r * 28, 30, 20); q.strokeRect(x + 536, y + 236, 108, 46);
        const nums = ['RENT 1,240', 'POWER 186', 'CAR 410', 'FOOD 520', 'LEFT  −92'];
        nums.forEach((n, i) => { const v = span(t, s.a + .3 + i * .35, s.a + .6 + i * .35); if (v <= 0) return; q.fillStyle = i === 4 ? K.PAPER.red : K.PAPER.ink; q.globalAlpha = v * (1 - wipe); q.font = '28px "Instrument Serif"'; q.fillText(n, x + 70, y + 60 + i * 56); q.globalAlpha = 1; });
        if (wipe > 0) { q.fillStyle = K.PAPER.lit; q.fillRect(x + 40, y + 20, (w - 80) * K.sineIO(wipe), h - 90); } } }));
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 5.28 · why spend twelve years in a classroom? twelve rows of school chairs into the depth
  const S528 = {
    id: '5.28',
    draw(ctx, t, s) {
      const L = K.hourLook(9), c = camK(t, [[s.a - 1, cam3({ z: -300, y: -260 })], [s.b + .6, cam3({ z: 700, y: -200 })]]);
      const rows = [];
      for (let r = 0; r < 12; r++) rows.push([1300 + r * 520, () => { const col = mixHex('#3e5a9a', '#9aa6c8', r / 14); for (let k = -3; k <= 3; k++) chair(ctx, 960 + k * 230, 900, 1.5, col);
        const v = span(t, s.a + .2 + r * .22, s.a + .5 + r * .22); if (v > 0) { ctx.fillStyle = rgba('#ffe7a8', v); ctx.font = '700 60px Inter'; ctx.textAlign = 'center'; ctx.fillText(String(r + 1), 960 + 4 * 230, 800); } }]);
      K.stage(ctx, c, [[40000, () => { ctx.fillStyle = lin(ctx, 0, -400, 0, 1400, [[0, '#cfd6e6'], [1, '#e8e1cf']]); ctx.fillRect(-4000, -2000, 9920, 6000); ctx.fillStyle = '#2f3a5a'; ctx.fillRect(560, 160, 800, 260); }],
        [12000, () => { ctx.fillStyle = mixHex('#d8cdb4', L.shade, .1); ctx.fillRect(-3000, 900, 7920, 2000); }], ...rows]);
      const u = K.cardU(t, s.a + 2.4, s.b + .3); if (u > 0) K.scr(ctx, (g) => { K.scrim(g, 610, 160, 700, 200, .5 * u); K.words(g, '12 years', W / 2, 290, 120, u, { align: 'center', col: '#ffe7a8' }); });
    },
    out: { k: 'sweep', dir: -1, w: 560, lead: .4, dur: 1.0, kind: 'post' },
  };
  return [S501, S504, S508, S509, S511, S514, S518, S521, S522, S523, S525, S527, S528];
}
