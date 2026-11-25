// Film 74 · c05 FREE POWER (4.01–M.02): the bill turns to dust, she has never seen one, solar roofs, the battery house through the night,
// the fusion plant beyond the hills, lights left on, the meter unscrewed, POWER → WATER · FOOD · HOMES, the sea plant, oranges on old dunes,
// Australia's free hours, the channel's reason (subscribe sign in the street).
import * as K from '../lib/f74_kit.mjs';
import * as S from '../lib/f74_street.mjs';
import * as PL from '../lib/f74_places.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, lin, rad, prng } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
// rough outline of Australia (design px, ~1000 wide) and the three south-eastern regions with free hours
const AUS = [[0, 300], [60, 210], [180, 170], [250, 90], [330, 110], [400, 40], [470, 60], [520, 0], [560, 110], [620, 140], [690, 60], [730, 150], [800, 260], [880, 330], [940, 440], [960, 560], [900, 680], [820, 760], [720, 790], [660, 740], [580, 640], [520, 610], [430, 650], [300, 660], [170, 700], [60, 680], [20, 560], [40, 420]];
const REG = [[[700, 380], [940, 440], [960, 560], [880, 650], [760, 600], [700, 480]], [[730, 150], [800, 260], [880, 330], [940, 440], [700, 380], [700, 220]], [[520, 380], [700, 380], [700, 480], [660, 740], [580, 640], [520, 610]]];
const poly = (c, pts, x, y, k) => { c.beginPath(); pts.forEach(([a, b], i) => (i ? c.lineTo(x + a * k, y + b * k) : c.moveTo(x + a * k, y + b * k))); c.closePath(); };
export default function c05(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- 4.01 · Nobody is: the bill crumbles into gold dust, the dust becomes sunlight
  const S401 = {
    id: '4.01',
    draw(ctx, t, s) {
      K.dusk(ctx, t, { glow: [960, 420] });
      K.scr(ctx, (g) => {
        const cr = span(t, s.a, s.a + 1.2), r = prng(3);
        if (cr < 1) { g.save(); g.globalAlpha = 1 - cr; g.translate(960, 640); g.scale(1.15 * (1 - .3 * cr), 1.15 * (1 - .3 * cr)); g.fillStyle = '#f6efdc'; g.fillRect(-340, -180, 680, 360); g.fillStyle = K.PAPER.red; g.font = '800 64px Inter'; g.textAlign = 'center'; g.fillText('POWER BILL', 0, 120); g.restore(); }
        const sun = K.expoOut(span(t, s.a + .8, s.b + .2));
        for (let i = 0; i < 140; i++) { const x0 = 620 + r() * 680, y0 = 460 + r() * 360, d = clamp(cr * 1.6 - r() * .5), x = lerp(x0, 960 + (r() - .5) * 120 * (1 - sun), K.sineIO(d) * sun + d * .3 * (1 - sun)), y = lerp(y0, 330, K.sineIO(d) * (.4 + .6 * sun)) - d * 60;
          if (d <= 0) continue; g.fillStyle = rgba(i % 3 ? '#ffd982' : '#fff3c4', .9 * (1 - sun * .8)); g.beginPath(); g.arc(x, y, 2.5 + r() * 2, 0, 7); g.fill(); }
        if (sun > 0) { const rr = lerp(10, 110, sun); g.fillStyle = rad(g, 960, 330, rr * 5, [[0, rgba('#ffe7a8', .5 * sun)], [1, rgba('#ffe7a8', 0)]]); g.fillRect(960 - rr * 5, 330 - rr * 5, rr * 10, rr * 10); g.fillStyle = rad(g, 960, 330, rr, [[0, '#fffdf2'], [.7, '#ffe2a0'], [1, '#f6c95c']]); g.beginPath(); g.arc(960, 330, rr, 0, 7); g.fill(); }
      });
    },
    out: { k: 'iris', c: [960, 330, 110], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 4.02 · she turns an old bill over, puzzled
  const S402 = {
    id: '4.02',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, aim(2400, 760, 640, 1.25)], [s.b + .5, aim(2400, 760, 620, 1.5)]]), turn = Math.cos((t - s.a) * 2.2);
      S.kitchen(ctx, t, c, L, { girlX: 700, girlH: 340, girlPose: 'stand', armR: [1.55, 1.75], armL: [-1.45, -1.7], girlLook: .3 + .15 * Math.sin(t * 1.6), you: null,
        clock: (g, tt, hd) => { const [hx, hy] = hd.R; g.save(); g.translate(hx + 10, hy - 50); g.scale(turn, 1); g.rotate(.05 * Math.sin(tt * 2)); g.fillStyle = turn > 0 ? '#f6efdc' : mixHex('#f6efdc', '#b9a688', .3); g.fillRect(-60, -80, 120, 160);
          if (turn > 0) { g.fillStyle = K.PAPER.red; g.font = '800 22px Inter'; g.textAlign = 'center'; g.fillText('POWER', 0, -40); g.fillText('BILL', 0, -14); g.fillStyle = rgba(K.PAPER.ink, .5); for (let k = 0; k < 4; k++) g.fillRect(-40, 10 + k * 16, 80, 5); } g.restore(); } });
      const q = span(t, s.a + 1.2, s.a + 1.8); if (q > 0) { const p = project(c, 2400, 700, 560); K.scr(ctx, (g) => K.glowText(g, '?', p[0] + 40, p[1] - 140, { size: 110, serif: true, col: '#ffe7a8', a: q * (1 - span(t, s.b - .3, s.b)) })); }
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 4.03 · every roof makes electricity: rooftops from above, light runs into the street
  const S403 = {
    id: '4.03',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -150, x: -60 })], [s.b + .6, cam3({ z: 160, x: 60, y: -40 })]]);
      PL.aerial(ctx, t, c, L, { beds: 1, solar: span(t, s.a - .4, s.a + .8), focus: (g) => {
        const u = span(t, s.a + .8, s.b);
        for (let i = -1; i < 6; i++) for (const side of [-1, 1]) { const y = i * 210 + 160, x0 = side < 0 ? 680 : 1240, x1 = 960; K.goldLine(g, [[x0, y], [lerp(x0, x1, .7), y], [x1, y + 60]], clamp(u * 2 - (i + 1) * .08), { w: 4, blur: 10 }); }
        const fl = (t * 120) % 1600; K.goldLine(g, [[960, -300], [960, 1400]], u, { w: 7, blur: 18 }); for (let k = 0; k < 6; k++) { const y = ((fl + k * 270) % 1700) - 300; g.fillStyle = rgba('#fff8dc', u); g.beginPath(); g.arc(960, y, 9, 0, 7); g.fill(); }
      } });
      K.caps(ctx, 'MORE THAN THE TOWN CAN USE', W / 2, 200, K.cardU(t, s.a + 1.8, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: 1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 4.04 · batteries carry it through the night (the battery house, the sky turns, the windows stay lit)
  const S404 = {
    id: '4.04',
    draw(ctx, t, s) {
      const u = K.sineIO(span(t, s.a + .3, s.b - .2)), L = K.hourLook(lerp(11, 21.2, u)), c = camK(t, [[s.a - 1, cam3({ z: 300, y: -20, x: 80 })], [s.b + .6, cam3({ z: 520, y: -40, x: 120 })]]);
      const fill = clamp(1.2 - u * .6);
      S.street(ctx, t, c, L, { apples: 1, bayTrees: 1, solar: 1, fore: false, focus: (g) => {} , near: (g) => {}, hl: () => 0 });
      // the battery house at the end of the street (screen space on the far card)
      const p = project(c, 7000, 1080, 600); K.scr(ctx, (g) => { const k = p[2] * 1.6; g.save(); g.translate(p[0], p[1]); g.scale(k, k);
        g.fillStyle = mixHex('#e8e4d8', L.shade, .35 + .3 * u); g.fillRect(-60, -110, 120, 110); g.fillStyle = mixHex('#2e4a8a', L.shade, .3); g.fillRect(-46, -96, 92, 82);
        g.fillStyle = lin(g, 0, -14, 0, -96, [[0, '#f6c95c'], [1, '#fff3c4']]); g.fillRect(-46, -14 - 82 * fill, 92, 82 * fill); g.fillStyle = mixHex('#3a3a5a', L.shade, .3); g.fillRect(-12, -122, 24, 12);
        g.restore(); K.halo(g, p[0], p[1] - 60 * k, 140 * k, .3 + .4 * u); });
      if (u > .4) K.caps(ctx, 'THE BATTERY HOUSE', W / 2, 200, span(u, .4, .6) * (1 - span(t, s.b - .4, s.b)), { size: 28, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 4.05 · beyond the hills, a fusion plant feeds the machines
  const S405 = {
    id: '4.05',
    draw(ctx, t, s) {
      const L = K.hourLook(11.2), c = camK(t, [[s.a - 1, cam3({ z: -300, y: -30 })], [s.b + .6, cam3({ z: 260, y: -60, x: 100 })]]);
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 560, clouds: 5, seed: 21 })],
        [12000, () => { K.hills(ctx, 600, 60, null, 11, { grad: [K.hz(L.leafS, 12000, L), K.hz(L.leaf, 9000, L)] });
          const x = 1180, y = 590; ctx.fillStyle = lin(ctx, x - 200, 0, x + 200, 0, [[0, mixHex('#e4e6f0', L.light, .3)], [1, mixHex('#a9aec8', L.shade, .3)]]); ctx.beginPath(); ctx.ellipse(x, y, 210, 150, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(x - 320, y - 20, 640, 30);
          K.ring(ctx, t, x, y - 70, 70, 1); ctx.strokeStyle = rgba('#e8fbff', .8); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x, y - 70, 150, 34, 0, 0, 7); ctx.stroke(); }],
        [6000, () => { K.hills(ctx, 700, 70, null, 13, { grad: [mixHex(L.leaf, L.haze, .3), L.leafS] });
          for (let i = 0; i < 4; i++) { const x = 1100 - i * 330, y = 720 + i * 30; ctx.strokeStyle = mixHex('#5a6080', L.shade, .2); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 40, y); ctx.lineTo(x, y - 200); ctx.lineTo(x + 40, y); ctx.moveTo(x - 50, y - 160); ctx.lineTo(x + 50, y - 160); ctx.stroke(); }
          const u = span(t, s.a + .4, s.b), pts = [[1300, 600], [1150, 560], [820, 590], [490, 620], [160, 650], [-200, 760]];
          for (let k = 0; k < 2; k++) K.goldLine(ctx, pts.map(([x, y]) => [x, y + k * 14]), u, { w: 6 - k * 2, blur: 14 });
          for (let k = 0; k < 6; k++) { const p = ((t * .45 + k / 6) % 1) * u, i = Math.min(4, Math.floor(p * 5)), f = p * 5 - i; ctx.fillStyle = '#fff8dc'; ctx.beginPath(); ctx.arc(lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f), 7, 0, 7); ctx.fill(); } }],
        [3000, () => { K.hills(ctx, 820, 50, null, 15, { grad: [L.grass, mixHex(L.leaf, L.shade, .2)] }); K.townLine(ctx, -200, 500, 840, mixHex(L.wallS, L.shade, .2), L, { towerX: 160, seed: 4 }); K.ring(ctx, t, 300, 720, 30, 1); K.ring(ctx, t + 1, 80, 740, 26, 1); }],
      ]);
      K.caps(ctx, 'FUSION', 1180, 250, K.cardU(t, s.a + .6, s.b + .3), { size: 30, align: 'center', col: '#e8fbff' });
    },
    out: { k: 'iris', c: [1180, 520, 70], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 4.06–4.08 · power is like air: lights left on, the meter unscrewed
  let meterAt = [380, 520];
  const camMet = (t) => camK(t, [[RT('4.06') - 1, cam3({ z: -100, x: -40 })], [RT('4.07') + .2, cam3({ z: 0, x: -160 })], [RT('4.08') + .2, aim(4200, 400, 520, 1.6), 'q'], [RT('4.09') + .5, aim(4200, 400, 520, 1.7)]]);
  const S406 = {
    id: '4.06',
    draw(ctx, t, s) {
      const L = look(R, t), t7 = s.r('4.07'), t8 = s.r('4.08'), run = span(t, s.a + .2, t7 + .2), off = K.expoIn(span(t, t8 + .5, s.b + .2));
      PL.shop(ctx, t, camMet(t), L, { door: [1180, 230, 520, 670], winX: 1760, lampX: 760, postX: -300,
        back: (g) => { // three lamps on, the old meter on the wall (disc spinning), unscrewed and lifted away
          for (let k = 0; k < 3; k++) { const x = 640 + k * 180, on = span(t, s.a + k * .25, s.a + .3 + k * .25); g.fillStyle = rad(g, x, 200, 160, [[0, rgba('#fff2c4', .55 * on)], [1, rgba('#fff2c4', 0)]]); g.fillRect(x - 160, 40, 320, 320); g.fillStyle = on > .5 ? '#fff6d8' : '#8a8aa0'; g.beginPath(); g.arc(x, 200, 22, 0, 7); g.fill(); }
          const x = 400, y = lerp(520, 380, off) , rot = off * .6; g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = 1 - span(off, .7, 1);
          g.fillStyle = '#2e3a6a'; g.fillRect(-80, -110, 160, 220); g.fillStyle = '#d8dbe6'; g.beginPath(); g.arc(0, -30, 50, 0, 7); g.fill(); g.fillStyle = '#c8473a'; g.fillRect(-46 * Math.cos(t * 9), -36, 8, 12); g.fillStyle = '#16182c'; g.fillRect(-50, 40, 100, 30);
          g.fillStyle = '#e7d19a'; for (const [a, b] of [[-66, -96], [66, -96], [-66, 96], [66, 96]]) { g.beginPath(); g.arc(a, b, 7, 0, 7); g.fill(); } g.restore();
          if (t > t8 - .2 && off < .1) { g.fillStyle = '#e7d19a'; for (const [a, b] of [[-66, -96], [66, -96]]) { g.beginPath(); g.arc(x + a + 20 * Math.sin(t * 8), 520 + b, 6, 0, 7); g.fill(); } }
          if (off > .3) { g.strokeStyle = rgba('#0b1440', .3); g.lineWidth = 3; g.strokeRect(320, 410, 160, 220); } },
        focus: (g) => { K.girl(g, t, lerp(700, 1500, K.sineIO(run)), 1040, 300, { walk: run > 0 && run < 1 ? K.walkPh(t, 1.6) : undefined, dir: 1, look: .2 });
          if (t > t8 - .3) K.you(g, t, 620, 1080, 600, { pose: 'reach', dir: -1, look: .6, armR: [2.4 + off * .4, 2.6 + off * .3] }); },
      });
    },
    out: { k: 'portal', win: (t) => { const c = camMet(t), a = project(c, 4200, 1180, 230), b = project(c, 4200, 1700, 900); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .4, dur: 1.1 },
  };
  // ---------------------------------------------------------------- 4.09 · POWER → WATER · FOOD · HOMES over the sunny street
  const S409 = {
    id: '4.09',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -100, y: -60 })], [s.b + .6, cam3({ z: -380, y: -120 })]]);
      S.street(ctx, t, c, L, { apples: 1, bayTrees: 1, solar: 1, walkers: 1, fore: false });
      K.scr(ctx, (g) => { K.scrim(g, 360, 180, 1200, 260, .45);
        const items = ['POWER', 'WATER', 'FOOD', 'HOMES'];
        items.forEach((it, i) => { const t0 = s.a + .4 + i * .7, u = span(t, t0, t0 + .5), x = 480 + i * 320, y = 300;
          if (i > 0) K.goldLine(g, [[x - 250, y], [x - 70, y]], span(t, t0 - .3, t0 + .1), { w: 5 });
          g.globalAlpha = u; g.fillStyle = rad(g, x, y, 80, [[0, i ? '#fff3c4' : '#fff8dc'], [1, i ? '#e3a63f' : '#f6c95c']]); g.beginPath(); g.arc(x, y, 60, 0, 7); g.fill(); g.globalAlpha = 1;
          if (u > 0) K.glowText(g, it, x, y + 110, { size: 32, weight: 700, align: 'center', col: P.cream, glow: false, spacing: .1, a: u });
          if (i > 0 && u > 0) K.glowText(g, '≈ FREE', x, y + 14, { size: 26, weight: 800, align: 'center', col: '#3a2410', glow: false, a: span(t, t0 + .3, t0 + .7) }); });
        g.fillStyle = '#3a2410'; g.beginPath(); g.moveTo(492, 262); g.lineTo(458, 306); g.lineTo(482, 306); g.lineTo(468, 340); g.lineTo(504, 292); g.lineTo(480, 292); g.closePath(); g.fill();
      });
    },
    out: { k: 'iris', c: [800, 300, 60], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 4.10 · drinking water straight from the sea
  const S410 = {
    id: '4.10',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -200, x: -100 })], [s.b + .6, cam3({ z: 200, x: 100, y: -30 })]]);
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 540, clouds: 4, seed: 31 })],
        [10000, () => { ctx.fillStyle = lin(ctx, 0, 540, 0, 900, [[0, mixHex('#7fb0d8', L.haze, .4)], [1, '#3a6aa0']]); ctx.fillRect(-1600, 540, W + 3200, 800);
          ctx.strokeStyle = rgba('#e8f4ff', .35); ctx.lineWidth = 2; for (let k = 0; k < 14; k++) { const y = 560 + k * 26, off = (t * (20 + k * 3)) % 140; ctx.beginPath(); for (let x = -1600 - off; x < W + 1600; x += 140) { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 35, y - 6, x + 70, y); } ctx.stroke(); } }],
        [4200, () => { ctx.fillStyle = lin(ctx, 0, 640, 0, 900, [[0, mixHex('#e9d6a8', L.light, .3)], [1, mixHex('#c9b48e', L.shade, .2)]]); ctx.beginPath(); ctx.moveTo(900, 640); ctx.quadraticCurveTo(1300, 600, 2600, 620); ctx.lineTo(2600, 1400); ctx.lineTo(700, 1400); ctx.fill();
          // the plant: white halls, round tanks, intake pipe into the sea
          for (let k = 0; k < 3; k++) { ctx.fillStyle = lin(ctx, 0, 480, 0, 640, [[0, mixHex('#f4f2ea', L.light, .3)], [1, mixHex('#c9cad8', L.shade, .3)]]); ctx.fillRect(1180 + k * 200, 500 + k * 6, 180, 140 - k * 6); ctx.fillStyle = mixHex('#3c5fb0', L.light, .2); ctx.fillRect(1180 + k * 200, 490 + k * 6, 180, 16); }
          for (let k = 0; k < 2; k++) { ctx.fillStyle = mixHex('#e4e6f0', L.light, .2); ctx.beginPath(); ctx.ellipse(1820 + k * 160, 600, 60, 70, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(1760 + k * 160, 600, 120, 40); }
          ctx.strokeStyle = mixHex('#5a6080', L.shade, .2); ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(1180, 620); ctx.lineTo(820, 700); ctx.stroke(); }],
        [2200, () => { ctx.strokeStyle = mixHex('#7a86b0', L.light, .2); ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(2400, 820); ctx.quadraticCurveTo(1500, 900, 600, 1200); ctx.stroke();
          for (let k = 0; k < 6; k++) { const p = (t * .35 + k / 6) % 1, x = lerp(2400, 600, p), y = lerp(820, 1200, p * p) ; ctx.fillStyle = rgba('#bff1ff', .9); ctx.beginPath(); ctx.arc(x, y - 4, 7, 0, 7); ctx.fill(); } }],
      ]);
      // the tap in your kitchen (inset on paper)
      const u = K.cardU(t, s.a + .8, s.b + .3);
      if (u > 0) K.scr(ctx, (g) => K.paper(g, t, 120, 300, 420, 420, u, { head: 'YOUR KITCHEN TAP', draw: (q, x, y, w, h) => {
        q.fillStyle = '#5a6080'; q.fillRect(x + 60, y + 60, 180, 30); q.fillRect(x + 210, y + 60, 30, 90); q.fillRect(x + 40, y + 40, 40, 60);
        for (let k = 0; k < 4; k++) { const p = (t * 1.3 + k / 4) % 1; q.fillStyle = rgba('#3a8ad0', 1 - p * .5); q.beginPath(); q.ellipse(x + 225, y + 160 + p * 160, 8, 12, 0, 0, 7); q.fill(); }
        q.fillStyle = rgba('#3a8ad0', .4); q.fillRect(x + 150, y + h - 30, 150, 24); } }));
      K.today(ctx, t, s.a + 1.2, s.b + .2, ['DUBAI · DRINKING WATER FROM THE SEA', 'UNDER 6 CENTS A BATHTUB'], 'HASSYAN SOLAR DESALINATION · OWN CALCULATION', { size: 28 });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 4.11 · the oranges grew where your old atlas shows a desert
  const S411 = {
    id: '4.11',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -200 })], [s.b + .6, cam3({ z: 260, x: 140, y: -40 })]]);
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 520, clouds: 2, seed: 41 })],
        [12000, () => { ctx.fillStyle = mixHex('#e6c98a', L.haze, .4); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(-200 + k * 520, 600, 380, 90, 0, Math.PI, 0); ctx.fill(); } ctx.fillRect(-1600, 598, W + 3200, 800); }],
        [6000, () => { ctx.fillStyle = mixHex('#e2c07a', L.light, .2); for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(-300 + k * 460, 720, 330, 110, 0, Math.PI, 0); ctx.fill(); } ctx.fillRect(-1600, 718, W + 3200, 800);
          for (let r = 0; r < 4; r++) for (let k = -4; k < 14; k++) K.tree(ctx, t, k * 170 + r * 60, 700 + r * 30, .35 + r * .05, L, { apples: 6, leaf: mixHex('#4f8a3a', L.light, .2) }); }],
        [2600, () => { ctx.fillStyle = mixHex('#d9b878', L.light, .2); ctx.fillRect(-1600, 880, W + 3200, 800);
          for (let k = -2; k < 8; k++) { const x = k * 330 + 60; K.tree(ctx, t, x, 940, 1.0, L, { leaf: mixHex('#4f8a3a', L.light, .2) }); const r = prng(k + 9); for (let j = 0; j < 9; j++) { ctx.fillStyle = '#f39a2a'; ctx.beginPath(); ctx.arc(x + (r() - .5) * 150, 940 - 210 + (r() - .5) * 120, 11, 0, 7); ctx.fill(); } }
          ctx.strokeStyle = rgba('#bff1ff', .5); ctx.lineWidth = 3; for (let k = -2; k < 8; k++) { ctx.beginPath(); ctx.moveTo(k * 330 - 100, 960); ctx.lineTo(k * 330 + 230, 960); ctx.stroke(); } }],
      ]);
      // the old atlas page: the yellow desert patch turns green
      const u = K.cardU(t, s.a + .7, s.b + .3), gr = span(t, s.a + 1.6, s.a + 3.0);
      if (u > 0) K.scr(ctx, (g) => K.paper(g, t, 1320, 250, 470, 400, u, { head: 'YOUR OLD ATLAS', draw: (q, x, y, w, h) => {
        q.fillStyle = '#cfe2ee'; q.fillRect(x, y, w, h); q.fillStyle = '#e8dcc0'; q.beginPath(); q.ellipse(x + w * .5, y + h * .5, w * .42, h * .34, -.2, 0, 7); q.fill();
        q.fillStyle = K.mixHex('#f2d36a', '#7fbf5a', gr); q.beginPath(); q.ellipse(x + w * .48, y + h * .52, w * .26, h * .18, -.2, 0, 7); q.fill();
        q.fillStyle = K.PAPER.ink; q.font = '700 22px Inter'; q.textAlign = 'center'; q.fillText(gr < .5 ? 'DESERT' : 'ORCHARDS', x + w * .48, y + h * .54); } }));
      K.today(ctx, t, s.a + 1.6, s.b + .2, ['CHINA · A 3,000-KM GREEN BELT', 'AROUND A DESERT'], 'COMPLETED NOV 2024 (TAKLAMAKAN)', { size: 28, x: 90, y: 230 });
    },
    out: { k: 'iris', c: [1555, 470, 90], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 4.12 · Australia: three free hours a day (EXPL)
  const S412 = {
    id: '4.12',
    draw(ctx, t, s) {
      K.dusk(ctx, t, { glow: [800, 520] });
      K.scr(ctx, (g) => {
        const z = 1 + .03 * span(t, s.a, s.b + 1); g.translate(800, 540); g.scale(z, z); g.translate(-800, -540);
        const x = 260, y = 200, k = .78, u = span(t, s.a, s.a + .8);
        g.globalAlpha = u; poly(g, AUS, x, y, k); g.fillStyle = rgba('#2c3e8a', .9); g.fill(); g.strokeStyle = rgba('#cfd8ff', .7); g.lineWidth = 3; g.stroke(); g.globalAlpha = 1;
        REG.forEach((rg, i) => { const v = span(t, s.a + 1.6 + i * .4, s.a + 2.2 + i * .4); if (v > 0) { poly(g, rg, x, y, k); g.fillStyle = rgba('#f6c95c', .75 * v); g.fill(); } });
        // the 24-hour dial with three free hours
        const cx = 1420, cy = 520, r = 200, d = span(t, s.a + 3, s.a + 4.4);
        g.strokeStyle = rgba('#cfd8ff', .6); g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
        for (let h = 0; h < 24; h++) { const a = h / 24 * 6.283 - 1.5708; g.beginPath(); g.moveTo(cx + Math.cos(a) * r * .9, cy + Math.sin(a) * r * .9); g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); g.stroke(); }
        if (d > 0) { const a0 = 11 / 24 * 6.283 - 1.5708; g.fillStyle = rgba('#f6c95c', .85); g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, r * .86, a0, a0 + 3 / 24 * 6.283 * K.expoOut(d)); g.closePath(); g.fill(); }
        K.glowText(g, '24 H', cx, cy + 12, { size: 36, weight: 700, align: 'center', col: P.cream, glow: false });
        if (d > .5) K.glowText(g, '3 FREE HOURS', cx, cy + r + 60, { size: 34, weight: 700, align: 'center', col: '#ffe7a8', glow: false, a: span(d, .5, 1), spacing: .08 });
      });
      K.today(ctx, t, s.a + .5, s.b + .1, ['AUSTRALIA · 3 FREE HOURS', 'OF POWER A DAY'], 'NSW · SE QUEENSLAND · SOUTH AUSTRALIA · SINCE 1 JULY 2026', { size: 30, y: 60 });
    },
    out: { k: 'iris', c: [1420, 520, 200], lead: .35, dur: 1.1 },
  };
  // ---------------------------------------------------------------- M.01–M.02 · the channel's reason: your street, rows 1–4 ticked, the subscribe sign
  const SM01 = {
    id: 'M.01',
    draw(ctx, t, s) {
      const L = look(R, t), t2 = s.r('M.02'), c = camK(t, [[s.a - 1, cam3({ z: -600, y: -80 })], [t2, cam3({ z: -300, y: -40, x: 60 })], [s.b + .6, cam3({ z: 0, y: -20 })]]);
      const press = span(t, t2 + .3, t2 + .5) - span(t, t2 + .7, t2 + 1), run = span(t, t2 + .5, s.b);
      S.street(ctx, t, c, L, { apples: 1, bayTrees: 1, solar: 1, walkers: 1, fore: false, roofBot: 0,
        near: (g) => { // the sign hangs from a bracket on your house like a shop sign
          g.fillStyle = '#2a2238'; g.fillRect(200, 430, 260, 10); g.fillRect(450, 430, 10, 40); g.strokeStyle = '#2a2238'; g.lineWidth = 3; g.beginPath(); g.moveTo(260, 440); g.lineTo(260, 470); g.moveTo(420, 440); g.lineTo(420, 470); g.stroke();
          const sw = Math.sin(t * 1.1) * .03; g.save(); g.translate(340, 470); g.rotate(sw); g.translate(0, 8 * press);
          g.fillStyle = mixHex('#d8352a', '#fff', .1 * (1 - press)); g.beginPath(); g.roundRect(-150, 0, 300, 96, 18); g.fill(); g.fillStyle = '#fff'; g.font = '800 34px Inter'; g.textAlign = 'center'; g.fillText('SUBSCRIBE', 0, 60);
          if (run > 0) K.halo(g, 0, 48, 260, .5 * (1 - run)); g.restore(); },
        focus: (g) => { if (run > 0) { const pts = [[400, 900], [700, 820], [960, 760], [1300, 700]]; K.goldLine(g, pts, run, { w: 6, blur: 16 }); } } });
      const bu = K.cardU(t, s.a + .5, t2 + .2);
      if (bu > 0) K.scr(ctx, (g) => { g.globalAlpha = bu; K.scrim(g, 520, 120, 880, 180, .5); for (let i = 0; i < 9; i++) { const x = 548 + i * 100, on = i < 4; g.strokeStyle = on ? '#ffe7a8' : rgba('#e8eefc', .5); g.lineWidth = 3; g.beginPath(); g.roundRect(x, 160, 80, 80, 8); g.stroke(); if (on) { g.fillStyle = rgba('#f6c95c', .3); g.fill(); K.goldLine(g, [[x + 16, x * 0 + 202], [x + 34, 222], [x + 64, 178]], span(t, s.a + .8 + i * .2, s.a + 1.1 + i * .2), { w: 6 }); } } g.globalAlpha = 1; });
      K.caps(ctx, 'SO IT GOES WELL FOR EVERYBODY', W / 2, 300, K.cardU(t, s.a + 2.4, t2), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 560, lead: .4, dur: 1.0 },
  };
  return [S401, S402, S403, S404, S405, S406, S409, S410, S411, S412, SM01];
}
