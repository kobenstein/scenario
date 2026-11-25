// Film 79 · c10 THE WAY OUT (W.01–END, vo-v2) · builder B3.
// PLAN (docs/BRIEF-builders.md §5 gate 1)
//   beats  W.01 the pale 2050 disc (out of c09's lamp) rolls its year back: 2050 → 2026, it turns amber (TODAY) → W.02 iris into the street as a
//          blueprint that draws itself ("hasn't been built yet") → W.03 your door turns real, morning light, someone waits at the kerb →
//          W.04 portal through the door: WORK · TAXES · VOTE, amber lines from you to employer / state / ballot box, they flow back ("still needed")
//          → W.05 the lines fold into a lever: you lift the carmine disc (LEVERAGE), the fulcrum creeps toward you (WHILE IT LASTS) → W.06 people
//          join and push with you → the lever stands up into THE WAY OUT column (four stops) → W.07–W.09 THE FIELDS: parcels sold one by one,
//          KENTUCKY, the family, $26 MILLION for part of their farm, "no": the offer slides away, WON → W.10–W.12 THE SCREEN: a child at a
//          carmine screen, SENATE COMMITTEE 22–0, NOT LAW YET, OPEN → W.13–W.15 THE KITCHEN: the grid plan (cut off big data centres in a
//          shortage), TURNED DOWN by federal regulators in October, LOST → W.16 the column, won and lost → W.17 THE ALLOWANCE grows, a big open
//          ring, the fork AN ALLOWANCE / A SHARE THAT'S YOURS BY RIGHT → W.18 the column runs on as a street with more open stops →
//          W.19–W.20 paper card (TODAY): the economist, the ladder without its bottom rung, his stake, the fork → C4 on the plate → it folds back
//          → W.21 the card flips into the #74 postcard (YOUR LIFE IN 2050 · IF WE GET AI RIGHT), portal into its warm street → W.22–W.24 same
//          street, same machines (cars with people), same clock (the boy, ringing) → W.25–W.27 iris into the warm square: noon dividend day, full
//          in the evening, the #74 card, SUBSCRIBE 2 → W.28–END iris into the bench at night: you wind the clock, set the alarm for tomorrow,
//          pull back: the pair small in the centre, left and right calm night (end screen, no type, no HUD).
//   carriers  in: c09's cold lamp head → iris → the 2050 disc · disc → iris → blueprint · door → portal → EXPL · open ring → iris → card ·
//          card plate (C4) · card flips → postcard → portal into its picture · the boy's clock → iris → square · tower clock → iris → your clock.
//   wow    none (c09 has it); the warm turn at W.21 is the release, the end picture the resolve.
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as PL from '../lib/f79_places.mjs';
import * as B from '../lib/f79_b3.mjs';
import { hourAt } from './hud.mjs';
import { clipPlate, CLIPS } from './clips.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM, AMBER } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));

export default function c10(T, R) {
  const r = (id) => R[id];
  const wd = (ph, id, nth = 0) => T.G(ph, nth, R[id] - .05);   // a word, searched from its row
  const cap = (c, s, x, y, u, o = {}) => { if (u > 0) K.maskLine(c, [[s, 0]], x, y, o.size ?? 24, K.rise(clamp(u)), { serif: false, weight: 600, col: o.col ?? P.cream, glow: false, align: o.align ?? 'left' }); };
  const num = (c, s, x, y, u, o = {}) => { if (u > 0) K.maskLine(c, [[s, 0]], x, y, o.size ?? 96, K.rise(clamp(u)), { serif: true, col: o.col ?? P.cream, glow: false, align: o.align ?? 'left' }); };

  // ---------------------------------------------------------------- W.01 · the 2050 disc rolls its year back to 2026
  const DY = 500;
  const W01 = {
    id: 'W.01',
    draw(ctx, t, s) {
      const tI = wd("isn't", 'W.01'), tF = wd('fifty', 'W.01');
      const roll = K.quartIO(span(t, tI - .15, tF + .6)), warm = K.sineIO(span(t, tF + .1, tF + .9)), z = lerp(1.08, 1.0, K.sineIO(span(t, s.a - 1.2, s.b + .6)));
      K.dusk(ctx, t, { glow: [W / 2, DY] });
      K.scr(ctx, (c) => {
        c.translate(W / 2, DY); c.scale(z, z); c.translate(-W / 2, -DY);
        // the timeline through the disc: ticks drift right while the years go back
        c.strokeStyle = rgba('#a9b8f0', .4); c.lineWidth = 3; c.beginPath(); c.moveTo(180, DY); c.lineTo(W - 180, DY); c.stroke();
        const off = 340 * roll + 6 * t;
        for (let k = -12; k < 14; k++) { const x = W / 2 + ((k * 90 + off) % 2340 + 2340) % 2340 - 1170; if (Math.abs(x - W / 2) < 80) continue; const a = clamp(1 - Math.abs(x - W / 2) / 800) * .7;
          c.fillStyle = rgba('#cfd8ff', a); c.fillRect(x - 1.5, DY - (k % 5 ? 9 : 16), 3, k % 5 ? 18 : 32); }
        // the disc: pale and cold (2050, out of reach) → amber (today, where you stand)
        const col = mixHex('#dfe6f6', '#ffb35c', warm), c0 = mixHex('#f6f8ff', '#ffe6bc', warm), c2 = mixHex('#a9b8e0', '#c9783a', warm), rr = 56 * (1 + .03 * Math.sin(t * 1.4));
        c.fillStyle = K.rad(c, W / 2, DY, rr * 4.5, [[0, rgba(col, .32)], [1, rgba(col, 0)]]); c.fillRect(W / 2 - rr * 4.5, DY - rr * 4.5, rr * 9, rr * 9);
        c.fillStyle = K.rad(c, W / 2 - rr * .25, DY - rr * .3, rr * 1.3, [[0, c0], [.7, col], [1, c2]]); c.beginPath(); c.arc(W / 2, DY, rr, 0, 7); c.fill();
        // the year: 20 + two rolling digits (odometer)
        const v = lerp(50, 26, roll), size = 132, yy = DY + 210;
        c.save(); c.beginPath(); c.rect(W / 2 - 300, yy - size * .74, 600, size * .8); c.clip();
        const tw = K.measure('2050', size, true), x0 = W / 2 - tw / 2, d0 = K.measure('20', size, true);
        K.glowText(c, '20', x0, yy, { size, serif: true, col: P.cream, glow: false });
        for (const m of [Math.floor(v), Math.floor(v) + 1]) { const dy = (m - v) * size * 1.05; if (Math.abs(dy) > size * 1.1) continue; K.glowText(c, String(m), x0 + d0, yy - dy, { size, serif: true, col: P.cream, glow: false }); }
        c.restore();
        cap(c, '2050 · NOT YET', W / 2, yy + 64, span(t, s.a - .6, s.a) * (1 - span(t, tF - .1, tF + .2)), { align: 'center', col: '#c9d2f4' });
        cap(c, 'TODAY', W / 2, yy + 64, span(t, tF + .35, tF + .9), { align: 'center', col: '#ffd9a0' });
      });
    },
    out: { k: 'iris', c: (t, s) => [W / 2, DY, 56], lead: .35, dur: 1.5, pushA: .5, rim: '#ffe2b0' },
  };

  // ---------------------------------------------------------------- W.02–W.03 · the blueprint street, your door, morning, someone waits
  const DOOR = [-330 + 560 * .66, 800 - 470 * .34, 560 * .2, 470 * .34];   // the door rect on the 2600 card (blueprint: bpHouse doorCol 1)
  const camW2 = (t, s) => camK(t, [[s.a - .7, cam3({ z: -260, y: -40 })], [r('W.03') - .1, cam3({ z: -120, y: -20 })], [s.b + .45, aim(2600, DOOR[0] + 90, 760, 1.55, W * .5, H * .54), 's']], .5);
  const W02 = {
    id: 'W.02',
    draw(ctx, t, s) {
      const tb = wd('built', 'W.02'), tT = r('W.03'), tm = wd('morning', 'W.03'), ts = wd('somebody', 'W.03');
      B.blueprint(ctx, t, camW2(t, s), { u: K.sineIO(span(t, s.a - .5, tb + .6)), tower: span(t, wd('yet', 'W.02') - .1, wd('yet', 'W.02') + .6),
        door: span(t, tT - .1, tT + .4), light: K.sineIO(span(t, tm - .1, s.b)), morning: span(t, tm - .2, tm + 1.2), wait: span(t, ts - .25, ts + .5) });
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camW2(t, s), 2600, DOOR[0] + DOOR[2] / 2, DOOR[1] + DOOR[3] * .45); return [p[0], p[1], DOOR[2] * .45 * p[2]]; }, lead: .6, dur: 1.9, pushA: .3, rim: '#ffd98a' },
  };

  // ---------------------------------------------------------------- W.04–W.18 · one EXPL stage: needed → lever → THE WAY OUT column → stops → fork → street
  const YOU = [900, 880], CHEST = [900, 735];
  const INST = [[380, 600, 'WORK'], [900, 455, 'TAXES'], [1420, 600, 'VOTE']];
  const COLX = 300, COLW = 560, STOPS = [[340, 'THE FIELDS', 'WON'], [470, 'THE SCREEN', 'OPEN'], [600, 'THE KITCHEN', 'LOST'], [730, 'THE ALLOWANCE', 'OPEN']];
  const MARKX = COLX + COLW - 40;
  const KEYS = () => [
    [r('W.04') - .6, 920, 600, 1.08], [r('W.05') - .2, 900, 590, 1.0], [r('W.06'), 1060, 620, 1.0], [r('W.07') - .4, 1060, 590, .98], [r('W.07') + .7, 1040, 560, 1.0],
    [r('W.10') - .6, 1060, 560, 1.03], [r('W.10') + .4, 1040, 560, 1.0], [r('W.13') - .6, 1060, 560, 1.03], [r('W.13') + .4, 1040, 560, 1.0], [r('W.16') - .3, 1060, 560, 1.03],
    [r('W.17') - .2, 720, 540, 1.12], [r('W.17') + 1.6, 900, 640, 1.06], [r('W.18') - .2, 1000, 660, 1.0], [r('W.19') + .8, 1000, 660, .9],
  ];
  const KK = KEYS();
  const panelA = (t, a, b) => span(t, a - .3, a + .5) * (1 - span(t, b - .55, b - .05));
  // the lever (W.05–W.06): fulcrum x (creeps toward you), angle (people push)
  const lever = (t) => {
    const tl = wd('while', 'W.05'), tp = wd('people', 'W.06');
    const fx = lerp(1400, 1310, K.sineIO(span(t, tl, tp + .2))) + 40 * K.sineIO(span(t, tp + .4, tp + 1.6));
    const th = lerp(-.1, .08, K.expoOut(span(t, wd('leverage', 'W.05') - .1, wd('leverage', 'W.05') + 1.2))) - .07 * K.sineIO(span(t, tl, tp)) + .12 * K.expoOut(span(t, tp + .5, tp + 1.6)) + .006 * Math.sin(t * 1.3);
    const fy = 800, Lx = fx - Math.cos(th) * (fx - 760), Ly = fy + Math.sin(th) * (fx - 760), Rx = fx + Math.cos(th) * 230, Ry = fy - Math.sin(th) * 230;
    return { fx, fy, th, L: [Lx, Ly], R: [Rx, Ry] };
  };
  const W04 = {
    id: 'W.04',
    draw(ctx, t, s) {
      const tw = wd('work', 'W.04'), tt = wd('taxes', 'W.04'), tv = wd('vote', 'W.04'), tn = wd('needed', 'W.04'), tL = wd('leverage', 'W.05'), tl = wd('while', 'W.05');
      const tp = wd('people', 'W.06'), tU = wd('using', 'W.06'), t7 = r('W.07'), t10 = r('W.10'), t13 = r('W.13'), t16 = r('W.16'), t17 = r('W.17'), t18 = r('W.18');
      const m = K.quartIO(span(t, tL - .55, tL + .5));              // lines → lever
      const col = K.quartIO(span(t, tU - .1, t7 + .15));            // lever → column
      const hiA = (i) => [span(t, t7 - .2, t7 + .4) * (1 - span(t, t10 - .4, t10)), span(t, t10 - .2, t10 + .4) * (1 - span(t, t13 - .4, t13)), span(t, t13 - .2, t13 + .4) * (1 - span(t, t16 - .4, t16)), span(t, t17 - .2, t17 + .5)][i];
      B.explK(ctx, t, KK, (c) => {
        // ---- W.04: you, the three institutions, the amber lines (out, then back: still needed)
        const ia = 1 - span(t, tL - .6, tL + .2);
        if (ia > 0) {
          B.employer(c, INST[0][0], INST[0][1], .9, ia * span(t, s.a - .4, tw + .1)); B.government(c, INST[1][0], INST[1][1], .9, ia * span(t, tt - .5, tt + .1)); B.ballot(c, t, INST[2][0], INST[2][1], .95, ia * span(t, tv - .5, tv + .1), span(t, tv - .1, tv + .7));
          [tw, tt, tv].forEach((t0, i) => { const [x, y, lab] = INST[i]; cap(c, lab, x, y - (i === 1 ? 200 : i === 0 ? 170 : 150), span(t, t0 - .05, t0 + .5) * ia, { size: 28, align: 'center' }); });
        }
        const yc = col > 0 ? 1 - col : 1;
        const lv = lever(t);
        // the lines (W.04) morph into the beam (W.05); the beam stands up into the column (W.06 → W.07)
        [tw, tt, tv].forEach((t0, i) => {
          const u = K.expoOut(span(t, t0 - .1, t0 + .55)); if (u <= 0) return;
          const tx = INST[i][0], ty = INST[i][1] + (i === 1 ? -10 : -20);
          let p0 = [lerp(CHEST[0], lv.L[0], m), lerp(CHEST[1], lv.L[1], m)], p1 = [lerp(tx, lv.R[0], m), lerp(ty, lv.R[1], m)];
          if (col > 0) { p0 = [lerp(p0[0], COLX, col), lerp(p0[1], STOPS[3][0] - 8, col)]; p1 = [lerp(p1[0], COLX, col), lerp(p1[1], STOPS[0][0] - 8, col)]; }
          c.save(); c.strokeStyle = col > .5 ? mixHex(AMBER.body, '#dfe6ff', span(col, .5, 1) * .75) : AMBER.body; c.lineWidth = lerp(5, 14, m) * (1 - .55 * col); c.lineCap = 'round'; c.shadowColor = rgba(AMBER.body, .6 * (1 - col)); c.shadowBlur = 14;
          K.strokeIn(c, [p0, p1], u); c.restore();
          // still needed: light flows back along the lines to you
          const back = span(t, tn - .3, tn + .2) * (1 - m);
          if (back > 0) for (let q = 0; q < 4; q++) { const ph = ((t * .7 + q / 4 + i * .13) % 1); const x = lerp(p1[0], p0[0], ph), y = lerp(p1[1], p0[1], ph);
            c.fillStyle = rgba('#ffe2a8', back * Math.sin(Math.PI * ph)); c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); }
        });
        // the lever: fulcrum, the carmine disc it lifts, the people pushing
        const la = m * (1 - col);
        if (la > 0) {
          c.save(); c.globalAlpha *= la;
          c.fillStyle = '#2a3470'; c.beginPath(); c.moveTo(lv.fx, lv.fy + 6); c.lineTo(lv.fx - 56, YOU[1]); c.lineTo(lv.fx + 56, YOU[1]); c.closePath(); c.fill();
          c.fillStyle = rgba('#8a96c8', .25); c.fillRect(380, YOU[1], 1300, 3);
          const dx = lv.R[0] - 10, dy = lv.R[1] - 104; K.carmGlow(c, dx, dy, 260, .18); c.fillStyle = K.rad(c, dx - 30, dy - 30, 130, [[0, CARM.core], [.5, CARM.hot], [1, CARM.body]]); c.beginPath(); c.arc(dx, dy, 96, 0, 7); c.fill();
          cap(c, 'LEVERAGE', 1080, 600, span(t, tL - .05, tL + .5), { size: 34, align: 'center' });
          cap(c, 'WHILE IT LASTS', 1080, 646, span(t, tl - .05, tl + .5), { size: 22, align: 'center', col: B.PALE });
          c.restore();
        }
        // you (and the people who join, W.06)
        const ya = 1 - span(t, tU, t7 - .1);
        if (ya > 0) {
          c.save(); c.globalAlpha *= ya;
          const push = m > .5, yx = lerp(YOU[0], lv.L[0] + 150, K.sineIO(span(t, tL - .4, tL + .6)));
          K.halo(c, yx, YOU[1] - 110, 150, .16 + .12 * span(t, tn - .2, tn + .6) * (1 - m));
          for (let k = 0; k < 3; k++) { const ju = K.sineIO(span(t, tp - .2 + k * .18, tp + 1.1 + k * .18)); if (ju <= 0) continue;
            const x = lerp(380 - k * 90, lv.L[0] + 70 - k * 52, ju); B.inkFig(c, t + k, x, YOU[1], 170 - (k % 2) * 16, { pose: ju < 1 ? 'walk' : 'reach', walk: ju < 1 ? t * 4.6 + k : undefined, view: ju < 1 ? 'side' : undefined, dir: 1, look: -.2 }, B.AMBP); }
          K.you(c, t, yx, YOU[1], 200, { pose: push ? 'reach' : 'stand', dir: 1, look: push ? -.25 : .35 + .1 * Math.sin(t * .6) });
          c.restore();
        }
        // ---- THE WAY OUT: the column of stops
        if (col > 0) {
          cap(c, 'THE WAY OUT', COLX - 10, 250, span(t, tU + .2, tU + .9), { size: 30, col: '#dfe6ff' });
          c.save(); c.strokeStyle = rgba('#dfe6ff', .6); c.lineWidth = 6; c.lineCap = 'round'; K.strokeIn(c, [[COLX, STOPS[0][0] - 8], [COLX, STOPS[3][0] - 8]], col); c.restore();
          STOPS.forEach(([y, lab, kind], i) => {
            const a = span(t, tU + .3 + i * .12, tU + .9 + i * .12); if (a <= 0) return;
            const tm = [wd('no', 'W.09'), wd('yet', 'W.12'), wd('down', 'W.15'), wd('open', 'W.17')][i] + .05;
            const big = i === 3 ? K.expoOut(span(t, wd('biggest', 'W.17') - .1, wd('biggest', 'W.17') + .6)) : 0;
            const pulse = (i === 0 ? K.bump(t, wd('won', 'W.16') - .1, .9) : 0) + (i === 2 ? K.bump(t, wd('lost', 'W.16') - .1, .9) : 0);
            B.stopRow(c, t, COLX, y, COLW, lab, i === 3 ? null : kind, span(t, tm, tm + .6), { a, hi: Math.max(hiA(i), pulse), size: 26 + 8 * big });
            if (i === 3) { const u = span(t, tm, tm + .9); if (u > 0) { B.markOpen(c, t, MARKX, y - 8, 2.2, u); cap(c, 'OPEN', MARKX + 60, y + 4, span(u, .3, 1), { size: 24, col: rgba(P.cream, .9) }); } }
          });
        }
        // ---- THE FIELDS (W.07–W.09)
        const fa = panelA(t, t7, t10);
        if (fa > 0) {
          c.save(); c.globalAlpha *= fa;
          const gx = 1020, gy = 300, cw = 118, ch = 62, sold = [3, 9, 14, 20, 7, 16, 22, 4], farm = [12, 13, 18, 19], part = 13, tS = wd('sold', 'W.07');
          const tK = wd('kentucky', 'W.08'), tWo = wd('woman', 'W.08'), tFa = wd('family', 'W.08'), t26 = wd('twenty-six', 'W.08'), tPa = wd('part', 'W.08'), tNo = wd('no', 'W.09');
          const fu = span(t, tK - .3, tK + .5), no = K.expoOut(span(t, tNo - .05, tNo + .7));
          for (let k = 0; k < 24; k++) { const x = gx + (k % 6) * (cw + 8), y = gy + Math.floor(k / 6) * (ch + 8), a = span(t, t7 + (k % 6) * .04 + Math.floor(k / 6) * .03 - .2, t7 + .4 + (k % 6) * .04);
            if (a <= 0) continue; c.save(); c.globalAlpha *= a;
            const si = sold.indexOf(k), sd = si < 0 ? 0 : K.expoOut(span(t, tS + .1 + si * .2, tS + .4 + si * .2));
            c.fillStyle = mixHex(mixHex('#24305e', '#2c3a5a', (k * 7 % 5) / 5), CARM.body, sd * .85); c.fillRect(x, y, cw, ch);
            c.strokeStyle = rgba('#8a96c8', .18 * (1 - sd)); c.lineWidth = 1.5; for (let q = 1; q < 5; q++) { c.beginPath(); c.moveTo(x + 6, y + q * ch / 5); c.lineTo(x + cw - 6, y + q * ch / 5); c.stroke(); }
            if (farm.includes(k) && fu > 0) { c.strokeStyle = rgba(AMBER.body, .9 * fu); c.lineWidth = 3; c.strokeRect(x + 2, y + 2, cw - 4, ch - 4); }
            if (k === part && fu > 0) { const pu = span(t, tPa - .1, tPa + .5); c.fillStyle = rgba(AMBER.body, .18 * pu + .5 * no); c.fillRect(x + 2, y + 2, cw - 4, ch - 4);
              if (pu > 0) { c.save(); c.strokeStyle = rgba('#ffe2a8', pu); c.lineWidth = 3; c.setLineDash([8, 7]); c.lineDashOffset = -t * 10; c.strokeRect(x - 6, y - 6, cw + 12, ch + 12); c.restore(); } }
            c.restore(); }
          cap(c, 'KENTUCKY', gx, gy - 26, fu, { size: 30 });
          // the woman in her eighties and her family
          const wa = span(t, tWo - .3, tWo + .5);
          if (wa > 0) { c.save(); c.globalAlpha *= wa; B.inkFig(c, t, 1050, 820, 150, { pose: 'stand', dir: 1, lean: .12, look: .35 }, B.AMBP); c.restore(); }
          [[1108, 168, 1], [1162, 150, 4], [1206, 108, 0]].forEach(([x, h, pi], k) => { const a = span(t, tFa - .2 + k * .1, tFa + .4 + k * .1); if (a <= 0) return; c.save(); c.globalAlpha *= a; B.inkFig(c, t + k * 2, x, 820, h, { pose: 'stand', dir: 1, look: .3 }, B.AMBP); c.restore(); });
          // the offer, and "no"
          c.save(); c.globalAlpha *= 1 - span(no, .2, 1); c.translate(90 * no, 0);
          num(c, '$26 MILLION', 1770, 770, span(t, t26 - .1, t26 + .5), { size: 92, align: 'right' });
          cap(c, 'FOR PART OF THEIR FARM', 1770, 818, span(t, tPa - .05, tPa + .5), { size: 22, align: 'right' });
          c.restore();
          cap(c, 'THEY SAID NO', 1770, 770, span(t, tNo + .15, tNo + .7), { size: 34, align: 'right', col: '#ffd9a0' });
          cap(c, 'SOURCE: TECHCRUNCH · 24 MAR 2026', gx, 900, span(t, tK, tK + .6) * .8, { size: 18, col: B.SUB });
          c.restore();
        }
        // ---- THE SCREEN (W.10–W.12)
        const sa = panelA(t, t10, t13);
        if (sa > 0) {
          c.save(); c.globalAlpha *= sa;
          const tSe = wd('senate', 'W.11'), tVo = wd('voted', 'W.11'), t22 = wd('twenty-two', 'W.11'), tNo = wd('nothing', 'W.11'), tBa = wd('ban', 'W.11'), tCh = wd('children', 'W.11'), tLa = wd('law', 'W.12');
          const sx = 1020, sy = 400, sw = 280, sh = 180;
          c.fillStyle = '#0a0e2a'; c.fillRect(sx - 10, sy - 10, sw + 20, sh + 20); c.fillRect(sx + sw / 2 - 8, sy + sh + 10, 16, 70);
          c.fillStyle = K.lin(c, sx, sy, sx + sw, sy + sh, [[0, '#ffd6e4'], [.4, CARM.hot], [1, CARM.body]]); c.fillRect(sx, sy, sw, sh); K.carmGlow(c, sx + sw / 2, sy + sh / 2, 380, .22 + .02 * Math.sin(t * 1.6));
          S.boy(c, t, sx + sw / 2 + 10, 860, 220, { back: .8, dir: -1, look: -.15 });
          cap(c, 'SENATE COMMITTEE', 1400, 330, span(t, tSe - .05, tSe + .5), { size: 28 });
          for (let k = 0; k < 22; k++) { const u = span(t, tVo + k * .03, tVo + .25 + k * .03); if (u <= 0) continue; const x = 1414 + (k % 11) * 32, y = 392 + Math.floor(k / 11) * 34;
            c.fillStyle = rgba(AMBER.body, u); c.beginPath(); c.arc(x, y, 10 * K.expoOut(u), 0, 7); c.fill(); }
          num(c, '22', 1400, 590, span(t, t22 - .1, t22 + .45), { size: 128 });
          num(c, '–', 1540, 590, span(t, tNo - .25, tNo + .2), { size: 128, col: B.SUB });
          num(c, '0', 1610, 590, span(t, tNo - .1, tNo + .4), { size: 128 });
          cap(c, 'FOR A BAN ON AI COMPANIONS', 1400, 660, span(t, tBa - .1, tBa + .5), { size: 24 });
          cap(c, 'FOR CHILDREN', 1400, 698, span(t, tCh - .1, tCh + .5), { size: 24 });
          const lu = span(t, tLa - .1, tLa + .5); cap(c, 'NOT LAW YET', 1400, 790, lu, { size: 30 }); B.markOpen(c, t, 1700, 779, 1.4, lu);
          cap(c, 'SOURCE: ROLL CALL · 30 APR 2026', 1020, 900, span(t, tSe, tSe + .6) * .8, { size: 18, col: B.SUB });
          c.restore();
        }
        // ---- THE KITCHEN (W.13–W.15): the grid plan, turned down
        const ka = panelA(t, t13, t16);
        if (ka > 0) {
          c.save(); c.globalAlpha *= ka;
          const tKi = wd('kitchen', 'W.13'), tGr = wd('grid', 'W.14'), tPl = wd('plan', 'W.14'), tSh = wd('shortages', 'W.14'), tCu = wd('cut', 'W.14'), tBl = wd('blackouts', 'W.14'), tOc = wd('october', 'W.15'), tTu = wd('turned', 'W.15');
          const P0 = [1060, 560], J = [1300, 560], DC = [1640, 420], HS = [[1520, 760], [1640, 760], [1760, 760]];
          const build = K.expoOut(span(t, tGr - .2, tGr + .8)), cut = K.expoOut(span(t, tCu - .05, tCu + .5)) * (1 - K.expoOut(span(t, tTu - .05, tTu + .6)));
          const keep = span(t, tBl - .3, tBl + .5) * (1 - span(t, tTu, tTu + .8));
          // the houses (one of them is your kitchen: dark)
          HS.forEach(([x, y], k) => { const a = span(t, tKi - .4 + k * .08, tKi + .2 + k * .08); if (a <= 0) return; c.save(); c.globalAlpha *= a;
            c.fillStyle = '#2a3470'; c.fillRect(x - 44, y - 70, 88, 70); c.beginPath(); c.moveTo(x - 54, y - 70); c.lineTo(x, y - 112); c.lineTo(x + 54, y - 70); c.fill();
            c.fillStyle = k === 1 ? '#0a0e2a' : rgba('#ffcf7a', .85); c.fillRect(x - 26, y - 52, 22, 22); c.fillStyle = rgba('#ffcf7a', k === 1 ? .0 : .7); c.fillRect(x + 6, y - 52, 22, 22);
            if (k === 1) { c.strokeStyle = rgba(B.PALE, .7); c.lineWidth = 2; c.strokeRect(x - 26, y - 52, 22, 22); } c.restore(); });
          if (keep > 0) { c.save(); c.strokeStyle = rgba(AMBER.body, .85 * keep); c.lineWidth = 3; c.setLineDash([10, 8]); c.lineDashOffset = -t * 12; c.beginPath(); c.roundRect(1450, 620, 380, 170, 20); c.stroke(); c.restore();
            cap(c, 'TO PREVENT BLACKOUTS', 1640, 850, keep, { size: 20, align: 'center', col: '#ffd9a0' }); }
          if (build > 0) {
            // the plant, the line, the junction; the data centre (carmine) on its own branch
            c.fillStyle = '#2a3470'; c.fillRect(P0[0] - 50, P0[1] - 60, 70, 60); c.fillRect(P0[0] + 26, P0[1] - 110, 18, 110); c.fillStyle = rgba('#dfe6ff', .25 + .1 * Math.sin(t * 2)); c.beginPath(); c.arc(P0[0] + 35, P0[1] - 128, 10, 0, 7); c.fill();
            c.save(); c.strokeStyle = rgba('#dfe6ff', .8); c.lineWidth = 4; c.lineCap = 'round';
            K.strokeIn(c, [P0, J], build); K.strokeIn(c, [J, [1460, 690], [HS[0][0], 690], [HS[2][0], 690]], span(build, .3, 1));
            const g = 40 * cut, dcp = [[J[0], J[1]], [1450, DC[1] + 40], [DC[0] - 100, DC[1] + 40]];
            if (cut <= 0) K.strokeIn(c, dcp, span(build, .3, 1)); else { c.beginPath(); c.moveTo(...dcp[0]); c.lineTo(1450 - g, DC[1] + 40 + g * .35); c.stroke(); c.beginPath(); c.moveTo(1450 + g, DC[1] + 40); c.lineTo(...dcp[2]); c.stroke();
              c.strokeStyle = rgba(CARM.hot, cut); c.lineWidth = 3; for (const sgn of [-1, 1]) { c.beginPath(); c.moveTo(1450 - 14, DC[1] + 40 - 14 * sgn); c.lineTo(1450 + 14, DC[1] + 40 + 14 * sgn); c.stroke(); } }
            for (const [x] of HS) { c.beginPath(); c.moveTo(x, 690); c.lineTo(x, 702); c.stroke(); }
            c.restore();
            const da = span(build, .4, 1), dim = 1 - .55 * cut; c.save(); c.globalAlpha *= da;
            c.fillStyle = '#1a2054'; c.fillRect(DC[0] - 100, DC[1] - 30, 200, 130); K.carmGlow(c, DC[0], DC[1] + 30, 240, .2 * dim);
            c.fillStyle = rgba(CARM.hot, .85 * dim); for (let k = 0; k < 6; k++) c.fillRect(DC[0] - 80 + k * 28, DC[1], 14, 64); c.restore();
            cap(c, 'DATA CENTRES', DC[0], DC[1] - 50, da, { size: 20, align: 'center', col: '#ffc4d2' });
          }
          cap(c, "AMERICA'S BIGGEST GRID (PJM)", 1020, 300, span(t, tGr - .2, tGr + .5), { size: 28 });
          cap(c, 'THE PLAN · IN A SHORTAGE:', 1020, 346, span(t, tPl - .1, tPl + .5), { size: 22, col: B.PALE });
          cap(c, 'CUT OFF BIG DATA CENTRES', 1020, 384, span(t, tCu - .1, tCu + .5), { size: 22 });
          const tu = span(t, tTu - .1, tTu + .45);
          if (tu > 0) { c.save(); c.globalAlpha *= tu; c.translate(1160, 780); c.rotate(-.04); c.scale(lerp(1.25, 1, K.expoOut(tu)), lerp(1.25, 1, K.expoOut(tu)));
            c.strokeStyle = CARM.hot; c.lineWidth = 4; c.strokeRect(-150, -46, 300, 66); c.restore();
            cap(c, 'TURNED DOWN', 1160, 794, tu, { size: 32, align: 'center', col: '#ffc4d2' }); }
          cap(c, 'FEDERAL REGULATORS · OCTOBER 2026', 1160, 850, span(t, tOc, tOc + .6) * span(t, tTu - .2, tTu + .4), { size: 18, align: 'center', col: P.cream });
          cap(c, 'SOURCE: FERC DECISION, 9 OCT 2026 (TRADE PRESS)', 1020, 900, span(t, tGr, tGr + .6) * .8, { size: 18, col: B.SUB });
          c.restore();
        }
        // ---- W.17: the fork from the biggest stop · W.18: the column runs on as a street of open stops
        const tAl = wd('allowance', 'W.17'), tSh = wd('share', 'W.17'), tRi = wd('right', 'W.17');
        const y4 = STOPS[3][0] - 8, fk = [MARKX + 70, y4];
        const fa1 = K.expoOut(span(t, tAl - .5, tAl + .4)), fa2 = K.expoOut(span(t, tSh - .5, tSh + .4));
        if (fa1 > 0) { c.save(); c.strokeStyle = rgba(B.PALE, .7); c.lineWidth = 4; c.setLineDash([12, 10]); c.lineCap = 'round'; K.strokeIn(c, [fk, [fk[0] + 120, y4 - 90], [1300, y4 - 90]], fa1); c.restore();
          cap(c, 'AN ALLOWANCE', 1320, y4 - 80, span(t, tAl - .05, tAl + .5), { size: 26, col: B.PALE }); }
        if (fa2 > 0) { c.save(); c.strokeStyle = AMBER.body; c.lineWidth = 6; c.lineCap = 'round'; c.shadowColor = rgba(AMBER.body, .6); c.shadowBlur = 12; K.strokeIn(c, [fk, [fk[0] + 120, y4 + 90], [1300, y4 + 90]], fa2); c.restore();
          cap(c, "A SHARE THAT'S YOURS", 1320, y4 + 100, span(t, tSh - .05, tSh + .5), { size: 26, col: '#ffd9a0' }); cap(c, 'BY RIGHT', 1320, y4 + 138, span(t, tRi - .05, tRi + .5), { size: 26, col: '#ffd9a0' }); }
        const st = span(t, t18 - .3, t18 + 2.4);
        if (st > 0) { c.save(); c.strokeStyle = rgba('#dfe6ff', .6); c.lineWidth = 6; c.lineCap = 'round';
          const path = [[COLX, y4], [COLX, 860], [COLX + 80, 940], [1800, 940]]; K.strokeIn(c, path, K.sineIO(st)); c.restore();
          for (let k = 0; k < 6; k++) { const x = 560 + k * 230, a = span(st, .25 + k * .1, .45 + k * .1); if (a <= 0) continue; c.fillStyle = rgba(P.cream, .9 * a); c.beginPath(); c.arc(x, 940, 8, 0, 7); c.fill(); B.markOpen(c, t + k, x, 900, .9, a); } }
      }, { glow: [W * .45, H * .55] });
    },
    out: { k: 'iris', c: (t, s) => { const p = B.explKP(t, KK, MARKX, STOPS[3][0] - 8); return [p[0], p[1], 44 * p[2]]; }, lead: .5, dur: 1.5, pushA: .5, rim: '#dfe6ff' },
  };

  // ---------------------------------------------------------------- W.19–W.21 · the paper card: the economist, his stake; C4; the card flips into the #74 postcard
  const CARD = [560, 140, 800, 600], FRAME = [700, 300, 520, 292], PIC = [CARD[0] + 18, CARD[1] + 18, CARD[2] - 36, CARD[3] - 36 - 96];
  const oW19 = (s) => ({ z0: 1.0, z1: 1.05, cy0: 470, cy1: 450 });
  const W19 = {
    id: 'W.19',
    draw(ctx, t, s) {
      const c4 = T.clip('C4'), tEc = wd('economist', 'W.19'), tCr = wd('crack', 'W.19'), tSt = wd('stake', 'W.19'), tBe = wd('bet', 'W.20'), tWh = wd('which', 'W.20'), tTh = wd('this', 'W.20'), t21 = r('W.21');
      const lift = span(t, c4.end + .85, c4.end + 2.2), lq = K.sineIO(lift), pb = K.expoOut(span(t, t21 - .3, t21 + .6));
      B.expl(ctx, t, s.a - .5, s.b + 1, (c) => {
        const u = span(t, s.a - .45, s.a + .5), dawn = K.sineIO(span(t, t21 - .2, t21 + 1.6));
        if (dawn > 0) { c.save(); c.globalAlpha *= dawn; c.fillStyle = K.lin(c, 0, -400, 0, 1500, [[0, rgba('#c9a0b0', .55)], [.5, rgba('#efc08e', .62)], [1, rgba('#f2d0a0', .66)]]); c.fillRect(-1000, -800, W + 2000, H + 1600); c.restore(); }   // W.21: the other 2050's light comes up behind the card
        // W.21: the #74 postcard lies under the paper card; the card is lifted away to the upper left
        if (pb > 0) { const k = lerp(.94, 1, pb), cx = CARD[0] + CARD[2] / 2, cy = CARD[1] + CARD[3] / 2; c.save(); c.globalAlpha *= clamp(pb * 3); c.translate(cx, cy); c.scale(k, k); c.translate(-cx, -cy);
          B.postcard(c, t, ...CARD, (g) => warmStreet(g, t)); c.restore(); }
        c.save(); const ccx = CARD[0] + CARD[2] / 2, ccy = CARD[1] + CARD[3] / 2; c.translate(ccx - 1180 * lq, ccy - 330 * lq); c.rotate(-.3 * lq); c.scale(1 - .12 * lq, 1 - .12 * lq); c.translate(-ccx, -ccy);
        if (lift < 1) K.paper(c, t, ...CARD, u, { from: [CARD[0] + CARD[2] / 2, CARD[1] + CARD[3] / 2], head: 'TODAY', headCol: K.PAPER.red, draw: (g, x, y, w, h) => {
          const inkA = 1 - span(t, tTh - .3, tTh + .3);
          if (inkA > 0) { g.save(); g.globalAlpha *= inkA;
            // the ladder: its bottom rung is the first one to break (entry-level jobs)
            K.ink(g, K.PAPER.ink, 3); const lx = x + 70, ly = y + h - 70, lu = span(t, s.a - .3, s.a + 1.2);
            K.strokeIn(g, [[lx, ly], [lx, ly - 380]], lu); K.strokeIn(g, [[lx + 90, ly], [lx + 90, ly - 380]], lu);
            for (let k = 1; k < 7; k++) { const a = span(lu, k / 8, k / 8 + .2); if (a <= 0) continue; K.strokeIn(g, [[lx, ly - 20 - k * 52], [lx + 90, ly - 20 - k * 52]], a); }
            const cr = span(t, tCr - .2, tCr + .5); if (cr > 0) { g.save(); g.strokeStyle = K.PAPER.red; g.lineWidth = 3; g.setLineDash([6, 8]); K.strokeIn(g, [[lx, ly - 20], [lx + 90, ly - 20]], 1); g.setLineDash([]);
              K.strokeIn(g, [[lx + 30, ly - 34], [lx + 44, ly - 18], [lx + 38, ly - 10], [lx + 56, ly + 6]], cr); g.restore(); }
            B.inkFig(g, t, lx + 170, ly + 2, 150, { pose: 'look', dir: -1, look: .3 }, B.INKP);
            // his stake
            const sk = span(t, tSt - .15, tSt + .5); if (sk > 0) { g.fillStyle = K.PAPER.ink; g.globalAlpha *= sk; g.font = '600 24px Inter'; g.fillText('CO-FOUNDER OF AN AI FIRM', x + 300, y + 90); g.fillRect(x + 300, y + 102, 380 * K.expoOut(sk), 2.5); g.globalAlpha /= Math.max(.001, sk); }
            // which way it goes: a fork
            const fu = span(t, tBe - .2, tWh + .5); if (fu > 0) { K.ink(g, K.PAPER.ink, 3); K.strokeIn(g, [[x + 300, y + 300], [x + 460, y + 300]], span(fu, 0, .4));
              K.strokeIn(g, [[x + 460, y + 300], [x + 640, y + 190]], span(fu, .35, 1)); K.strokeIn(g, [[x + 460, y + 300], [x + 640, y + 410]], span(fu, .45, 1));
              g.globalAlpha *= span(fu, .7, 1); g.font = '48px "Instrument Serif"'; g.fillText('?', x + 640, y + 320); }
            g.restore(); }
          g.fillStyle = K.PAPER.ink; g.font = '600 22px Inter'; g.fillText('AN ECONOMIST · STANFORD', x + 10, y + h - 14);
          const fr = span(t, tTh - .2, tTh + .8);
          if (fr > 0) { K.ink(g, K.PAPER.ink, 3); const fx = FRAME[0] - CARD[0], fy = FRAME[1] - CARD[1]; K.strokeIn(g, [[fx, fy], [fx + FRAME[2], fy], [fx + FRAME[2], fy + FRAME[3]], [fx, fy + FRAME[3]], [fx, fy]], fr); }
        } });
        c.restore();
      }, oW19(s));
      // C4 on the plate: grows out of the inked screen, folds back into it
      const m = span(t, c4.start - .35, c4.start + .85) * (1 - span(t, c4.end - .3, c4.end + .9));
      if (m > 0) { const a = B.explAt(t, s.a - .5, s.b + 1, oW19(s), FRAME[0], FRAME[1]), b = B.explAt(t, s.a - .5, s.b + 1, oW19(s), FRAME[0] + FRAME[2], FRAME[1] + FRAME[3]);
        clipPlate(ctx, t, T, 'C4', [a[0], a[1], b[0] - a[0], b[1] - a[1]], m);
        const fo = Math.max(1 - span(t, c4.start - .35, c4.start + .1), span(t, c4.end + .5, c4.end + .85)); if (fo > 0) K.scr(ctx, (g) => { g.fillStyle = rgba(K.PAPER.body, fo); g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); }); }
    },
    out: { k: 'fn', fn: B.portalSoft((t) => { const s = { a: r('W.19'), b: r('W.22') }, a = B.explAt(t, s.a - .5, s.b + 1, oW19(s), PIC[0], PIC[1]), b = B.explAt(t, s.a - .5, s.b + 1, oW19(s), PIC[0] + PIC[2], PIC[1] + PIC[3]); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }), lead: 1.0, dur: 2.6 },
  };

  // ---------------------------------------------------------------- W.22–W.24 · the other 2050: same street, same machines (with people), same clock (ringing)
  const BOY = [600, 1012, 220];
  const camW22 = (t) => camK(t, [[r('W.21'), cam3({ z: -160, y: -24 })], [r('W.25') + .5, cam3({ z: 160, y: 30, x: -150 })]], .5);
  const boyClock = (t) => { const tc = wd('clock', 'W.24'), up = K.expoOut(span(t, tc - .5, tc + .2)); return [BOY[0] + 34, BOY[1] - BOY[2] * .62 - 40 * up, up]; };
  function warmStreet(ctx, t) {
    const L = B.warmLook(lerp(10.5, 12, span(t, r('W.21'), r('W.25')))), tm = wd('machines', 'W.23'), tc = wd('clock', 'W.24');
    S.street(ctx, t, camW22(t), L, { tower: 0, fence: 0, hedges: 0, lamps: false, lit: 0, fore: false,
      near: (g, tt) => { for (const [x, s2] of [[420, 1.08], [1530, 1.08]]) B.appleTree(g, tt, x, 862, s2, L); },
      focus: (g, tt) => {
        const p1 = K.expoOut(span(tt, tm - .8, tm + 1.0)), p2 = K.expoOut(span(tt, tm - .3, tm + 1.6));
        if (p2 > 0) B.podWarm(g, tt, lerp(2600, 1900, p2), 975, .8, L, -1, 2);
        if (p1 > 0) B.podWarm(g, tt, lerp(2300, 1300, p1), 1005, .95, L, -1, 3);
        const [cx, cy, up] = boyClock(tt);
        S.boy(g, tt, BOY[0], BOY[1], BOY[2], { dir: 1, look: lerp(.1, .5, up), armR: up > .1 ? [2.6, 2.9] : undefined });
        if (up > 0) { S.alarmClock(g, tt, cx, cy, .3, { ring: span(tt, tc - .1, tc + .2) }); K.halo(g, cx, cy, 70, .3 * up); }
      } });
    K.scr(ctx, (c) => B.warmUp(c, .35));
  }
  const W22 = {
    id: 'W.22',
    draw(ctx, t, s) { warmStreet(ctx, t); },
    out: { k: 'fn', fn: B.irisSoft((t) => { const [x, y] = boyClock(t), p = project(camW22(t), 1700, x, y); return [p[0], p[1], 62 * .3 * p[2]]; }, { pushA: .2 }), lead: .9, dur: 2.6 },
  };

  // ---------------------------------------------------------------- W.25–W.27 · the warm square: noon dividend day, full in the evening; the #74 card; SUBSCRIBE 2
  const camW25 = (t, s) => camK(t, [[s.a - .7, cam3({ z: -320, y: -60 })], [r('W.26'), cam3({ z: -180, y: -50, x: 30 })], [r('W.27') + 1.6, cam3({ z: -120, y: -90 })], [s.b + .5, aim(5200, PL.TOWER.face[0], PL.TOWER.face[1], 2.4, W / 2, H / 2), 's']], .5);
  const W25 = {
    id: 'W.25',
    draw(ctx, t, s) {
      const tNo = wd('noon', 'W.25'), tDi = wd('dividend', 'W.25'), tFu = wd('full', 'W.25'), tEv = wd('evening', 'W.25'), tHe = wd('help', 'W.27'), tSu = wd('subscribe', 'W.27');
      const h = lerp(12, 19.2, K.sineIO(span(t, tDi + .4, tEv + 1.2))) + .5 * span(t, r('W.26'), s.b), L = B.warmLook(h), eve = span(h, 16.5, 19);
      PL.square(ctx, t, camW25(t, s), L, { chill: 0, people: Math.round(lerp(7, 14, span(t, tFu - .6, tEv))), lanterns: eve, tables: true, dry: false, shut: false, lit: .85 * eve, tags: 1, tagText: '', bell: 0 });
      K.scr(ctx, (c) => B.warmUp(c, .3));
      K.caps(ctx, 'NOON · DIVIDEND DAY', W / 2, 200, span(t, tDi - .1, tDi + .5) * (1 - span(t, tEv - .6, tEv - .2)), { size: 30, align: 'center' });
      K.caps(ctx, 'EVERY EVENING · FULL', W / 2, 200, span(t, tEv - .05, tEv + .5) * (1 - span(t, r('W.26') + 1.2, r('W.26') + 1.7)), { size: 30, align: 'center' });
      // the #74 card: the street this channel works for
      const ca = span(t, r('W.26') - .2, r('W.26') + .6) * (1 - span(t, tSu + .5, tSu + 1.1));
      if (ca > 0) K.scr(ctx, (c) => { const e = K.expoOut(ca), x = 1430, y = 120 + (1 - e) * 30; c.save(); c.globalAlpha *= ca; c.translate(x + 200, y + 150); c.rotate(.02 * Math.sin(t * .5)); c.translate(-(x + 200), -(y + 150));
        B.postcard(c, t, x, y, 400, 300, (g) => warmStreet(g, r('W.24') + .4 + .2 * Math.sin(t * .3)), { size: 18, strip: 62, tag: 'FILM #74' }); c.restore(); });
      const nf = K.sineIO(span(t, tSu + .2, s.b + .8)); if (nf > 0) K.scr(ctx, (c) => { c.fillStyle = rgba('#0b1238', .5 * nf); c.fillRect(-200, -200, W + 400, H + 400); });   // night falls before the bench
      K.scr(ctx, (c) => B.subscribe(c, t, W / 2, 930, span(t, tHe - .2, tHe + .5) * (1 - span(t, tSu + .6, tSu + 1.1)), span(t, tSu - .05, tSu + .4)));
    },
    out: { k: 'fn', fn: B.irisSoft((t) => { const p = project(camW25(t, { a: r('W.25'), b: r('W.28') }), 5200, PL.TOWER.face[0], PL.TOWER.face[1]); return [p[0], p[1], PL.TOWER.face[2] * p[2]]; }, { pushA: .25 }), lead: .8, dur: 2.4 },
  };

  // ---------------------------------------------------------------- W.28–END · the bench at night: you wind the clock, set it for tomorrow; the end picture
  const BXC = [890, 778];   // the clock in your hands (2000 card, design coords)
  const camW28 = (t, s) => { const tS = wd('set', 'W.29'), t30 = r('W.30');
    return camK(t, [[s.a - .7, aim(2000, BXC[0], BXC[1] - 6, 3.1, W / 2, H / 2)], [tS - .5, aim(2000, 930, 740, 2.0, W * .5, H * .56)], [tS + .9, aim(2000, BXC[0], BXC[1] - 4, 3.2, W / 2, H / 2)],
      [t30 + .4, aim(2000, BXC[0], BXC[1] - 4, 3.0, W / 2, H / 2)], [r('END') - .2, cam3({ z: -760, y: -110, x: 0 }), 's'], [s.b, cam3({ z: -840, y: -116, x: 0 })]], .5); };
  const W28 = {
    id: 'W.28',
    draw(ctx, t, s) {
      const tJ = wd('job', 'W.28'), tA = wd('alarm', 'W.28'), tS = wd('set', 'W.29'), tTo = wd('tomorrow', 'W.29');
      const wind = .25 + .75 * span(t, tA - .3, tA + .3) * (1 - span(t, tS - .4, tS)) + .4 * span(t, r('W.30'), r('W.30') + 2) * 0;
      const al = lerp(-2.4, 1.7, K.quartIO(span(t, tS + .05, tTo + .55)));
      B.bench2(ctx, t, camW28(t, s), look(R, t), { holder: 'you', clock: 0, tower: 1130, towerH: 420, home: 0, fore: false, lean: .1, youLook: .2 + .06 * Math.sin(t * .35), boyLook: -.3 - .1 * span(t, tS, tTo + 1),
        focus2: (g, tt) => { const y = BXC[1] - 3 * Math.sin(tt * .6); K.halo(g, BXC[0], y, 90, .24 + .03 * Math.sin(tt * 1.1));
          B.clock2(g, tt, BXC[0], y, .38, { hh: Math.PI - .05, mm: -1.5708 + .2 + .01 * tt % 1, alarm: al, key: tt * 1.6 * wind, rot: .01 * Math.sin(tt * 4) * wind }); } });
    },
    out: { k: 'cut' },
  };
  return [W01, W02, W04, W19, W22, W25, W28];
}
