// Film 79 · c07 THE SEARCH, PART 2 (L.01–L.13, vo-v2, builder B2). PLAN (gates: docs/BRIEF-builders.md §5)
//   L.01     EXPL the search drawing again: your house ticked CONTENT (the children), the ring moves on to the neighbour's window → portal
//   L.02–03  MIX the neighbour at his upstairs window across the road, old work boots on the sill; a pale-ink ghost of him walks to work
//            and is gone (L.02); the search ring rests on him (L.03)                                    → iris out of the ring
//   L.04     EXPL a DECADES bar folds down to EVERY WEEK (carmine); parcels drop out of it on a beat and slide to your house,
//            PICKED OUT FOR YOU                                                                          → post sweep
//   L.05     MIX doorsteps at 2 PM: parcels at every door, a car with crates delivers, SENT BACK 0       → iris into the street's end
//   L.06–07  EXPL the ring runs to the end of the drawn street (the fence) and opens into a field map: parcels flip from field to
//            carmine one by one                                                                          → post sweep
//   L.08     2.5D the end of the street, 4 PM: you small at the fence, the tower behind it              → post sweep (+1)
//   L.09–10  2.5D PL.land: a pale-ink cornfield over the land is wiped on "fence begins" (L.09); the camera rises over the fence and
//            the panel rows run out to the hills (L.10, counter 7 THE FIELDS)                             → portal into a fence bay
//   L.11     2.5D the gate, close: latch and hinges on the far side, a blank plate on yours              → iris out of the latch
//   L.12–13  EXPL the map again: STOLEN struck, SOLD tags only (L.12); offer slips land one parcel at a time (L.13) → iris out of the
//            last slip (B3's Q.01 opens on the same sold parcels with the ring at 1430,720)
// Wow: none. Accents: the DECADES fold, the cornfield wipe.
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as PL from '../lib/f79_places.mjs';
import * as B from '../lib/f79_b2.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM, AMBER, sineIO, quartIO, expoOut, expoIn } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const { T: TX, SER, struckWord, stamp, tick, REST, SUB, PALE } = B;
const float2 = (c, t, z = 1, cx = W / 2, cy = H / 2) => { const dx = K.drift(t * .5, 6, 5.3), dy = K.drift(t * .5, 4, 2.1); c.translate(cx + dx, cy + dy); c.scale(z, z); c.translate(-cx, -cy); };
const ghostPal = { base: '#9aa6d8', lit: '#c8d2f4', shade: '#6a76a8', deep: '#4a5488', hem: .3 };
// the field map of c07 (L.06–07 and L.12–13): 8 × 4 parcels; MAP.order = the order they are sold (the last one sits where B3's ring starts)
const MAP = { x0: 250, y0: 250, cols: 8, rows: 4, cw: 182, ch: 128 };
const QSTART = [1430, 720];
export default function c07(T, R) {
  const G = (ph, after, nth = 0) => T.G(ph, nth, after - .05);
  // sale order: by distance from the far corner, the parcel nearest QSTART last
  const cells = []; for (let j = 0; j < MAP.rows; j++) for (let i = 0; i < MAP.cols; i++) cells.push([j * MAP.cols + i, MAP.x0 + i * MAP.cw + MAP.cw / 2, MAP.y0 + j * MAP.ch + MAP.ch / 2]);
  const ORDER = cells.map(([k, x, y]) => [k, Math.hypot(x - QSTART[0], y - QSTART[1])]).sort((a, b) => b[1] - a[1]).map((e) => e[0]);
  const RANK = []; ORDER.forEach((k, r) => { RANK[k] = r; });
  const N = ORDER.length;
  // ---------------------------------------------------------------- L.01 · EXPL the search: your house ticked CONTENT, the ring moves on
  const { x0: SX, gap: SG, base: SB, w: SW, h: SH } = B.SEARCH;
  const winRect = (i, q = 0) => { const uv = [[.18, .2], [.62, .2], [.62, .58]][q]; return [SX + i * SG + SW * uv[0], SB - SH + SH * uv[1], SW * .2, SH * .22]; };
  const NB = winRect(3, 0), MY = winRect(2, 1);
  const L01 = {
    id: 'L.01',
    draw(ctx, t, s) {
      const tc = s.w('content');
      K.dusk(ctx, t, { glow: [900, 560] });
      K.scr(ctx, (c) => { float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b + 1)));
        B.searchStreet(c, t, { build: 1, hi: t < tc + .4 ? 2 : 3 });
        // the children: content (a cream tick over your house)
        const hx = SX + 2 * SG + SW / 2; tick(c, hx, SB - SH - 90, 46, span(t, tc - .2, tc + .25), P.cream, 6);
        TX(c, 'CONTENT', hx, SB + 50, { align: 'center', size: 24, col: '#ffe7a8', a: span(t, tc - .1, tc + .3) });
        // the ring: rests on your window, then moves on to the neighbour's
        const mv = sineIO(span(t, tc + .3, s.b - .25)), p0 = [MY[0] + MY[2] / 2, MY[1] + MY[3] / 2], p1 = [NB[0] + NB[2] / 2, NB[1] + NB[3] / 2];
        B.searchRing(c, t, lerp(p0[0], p1[0], mv), lerp(p0[1], p1[1], mv) - 30 * Math.sin(Math.PI * mv), 46, 1);
        B.counterTag(c, 'ANGRY FACES', 0, 1800, 240, 1);
      });
    },
    out: { k: 'fn', fn: B.maskGrow(NB, { r: 4, rim: '#f3efe2' }), lead: .4, dur: 1.3 },
  };
  // ---------------------------------------------------------------- L.02–L.03 · the neighbour at his window, boots on the sill
  const AW = [1740.8, 430.4, 112, 88];   // the across house's upper-left window (K.house layout on card 2600)
  const camL02 = (t, s) => camK(t, [[s.a - 1.1, aim(2600, 1880, 610, 1.7, W * .5, H * .5)], [s.b + 1, aim(2600, 1860, 590, 1.85, W * .5, H * .48)]], .4);
  const L02 = {
    id: 'L.02',
    draw(ctx, t, s) {
      const L = look(R, t), c = camL02(t, s), t3 = s.r('L.03'), ta = s.w('another'), tw = s.w('work');
      S.street(ctx, t, c, L, { lamps: true, fore: false, near: (g) => {
        const [x, y, w, h] = AW;
        g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
        g.fillStyle = K.lin(g, 0, y, 0, y + h, [[0, mixHex('#c9b48a', L.light, .1)], [1, '#7a6450']]); g.fillRect(x, y, w, h);   // a warm room behind him
        K.folk(g, t, 4, x + w * .5, y + h * 1.5, h * 1.45, { dir: -1, look: -.3 + .1 * Math.sin(t * .4) });
        g.restore();
        g.fillStyle = rgba(L.ink, .5); g.fillRect(x - 6, y + h, w + 12, 7);   // the sill
        for (const [bx, d] of [[x + 22, 0], [x + 52, 1]]) {   // the old work boots, laced, on the sill
          g.fillStyle = mixHex('#5a3e2c', L.shade, .25); g.beginPath(); g.moveTo(bx, y + h); g.lineTo(bx, y + h - 22); g.lineTo(bx + 12, y + h - 22); g.lineTo(bx + 13, y + h - 9); g.lineTo(bx + 26, y + h - 6); g.lineTo(bx + 26, y + h); g.closePath(); g.fill();
          g.fillStyle = rgba('#e8d8b8', .5); g.fillRect(bx + 2, y + h - 18 + d, 9, 1.5); g.fillRect(bx + 2, y + h - 13 + d, 9, 1.5);
        }
        // the life he remembers: a pale-ink ghost of him leaves by his door for work, and is gone after "work"
        const ga = span(t, ta - .3, ta + .3) * (1 - span(t, tw + .5, tw + 1.1));
        if (ga > 0) { g.save(); g.globalAlpha = .55 * ga; const gx = lerp(2060, 1480, sineIO(span(t, ta - .3, tw + 1.1)));
          K.figureRaw(g, gx, 804, 190, { hood: false, dir: -1, walk: K.walkPh(t, 1), look: 0 }, ghostPal, false);
          g.fillStyle = ghostPal.lit; g.fillRect(gx - 40, 724, 22, 17); g.restore(); }   // the lunch box
      } });
      // L.03 · the search ring settles on him
      const wc = project(c, 2600, AW[0] + AW[2] / 2, AW[1] + AW[3] * .55), ru = expoOut(span(t, t3 - .3, t3 + .4));
      if (ru > 0 && wc) K.scr(ctx, (g) => B.searchRing(g, t, wc[0], wc[1], lerp(220, 120, ru), ru));
      if (wc) ringL02 = [wc[0], wc[1], 120];
      K.scr(ctx, (g) => { g.fillStyle = K.rad(g, W * .5, H * .45, 1150, [[0, rgba('#0b1238', .12)], [1, rgba('#0b1238', .55)]]); g.fillRect(0, 0, W, H); });   // afternoon shade on the house front (keeps the cut into the dark drawing soft)
    },
    out: { k: 'iris', c: () => ringL02, lead: .5, dur: 1.6, rim: '#f3efe2' },
  };
  let ringL02 = [W / 2, H / 2, 150];
  // ---------------------------------------------------------------- L.04 · EXPL DECADES folds to EVERY WEEK; parcels, picked out for you
  const HOUSE = [1620, 800];
  const L04 = {
    id: 'L.04',
    draw(ctx, t, s) {
      const td = s.w('decades'), tn = s.w('now'), tw = s.w('week'), tp = s.w('picked');
      K.dusk(ctx, t, { glow: [960, 480] });
      K.scr(ctx, (c) => { float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b + 1)));
        // the bar: 12 segments; folds like a paper strip into one carmine block
        const f = quartIO(span(t, tn - .15, tw + .1)), n = 12, seg = lerp(116, 9, f), bw = seg * n, x0 = lerp(260, 900, f), y = 380, hh = 70;
        const grow = span(t, s.a - .5, td + .1);
        TX(c, 'DECADES', 260, 340, { size: 26, col: SUB, a: span(t, td - .3, td + .2) * (1 - span(t, tn, tn + .4)) });
        for (let k = 0; k < n; k++) { if (k / n > grow) break; const x = x0 + k * seg, sk = 18 * f * (k % 2 ? -1 : 1);
          c.fillStyle = mixHex(REST, CARM.body, f) ; if (k % 2) c.fillStyle = mixHex(mixHex(REST, '#3a4278', .3), CARM.mid, f);
          c.beginPath(); c.moveTo(x, y + (k % 2 ? sk : 0)); c.lineTo(x + seg + .5, y + (k % 2 ? 0 : sk)); c.lineTo(x + seg + .5, y + hh + (k % 2 ? 0 : sk)); c.lineTo(x, y + hh + (k % 2 ? sk : 0)); c.closePath(); c.fill();
          if (f < .3) { c.fillStyle = rgba('#e8eefc', .35 * (1 - f / .3)); c.fillRect(x, y + hh + 12, 2, 12); } }
        const bx = x0 + bw / 2;
        if (f > .6) K.carmGlow(c, bx, y + hh / 2, 220, .25 * (f - .6) / .4);
        TX(c, 'EVERY WEEK', bx, y - 40, { align: 'center', size: 26, col: '#ffd6de', a: span(t, tw - .2, tw + .3) });
        // your house (amber door) at the end of a delivery line
        B.houseIcon(c, HOUSE[0], HOUSE[1], 1.6, { door: 'you', lit: .6, col: '#2a3470' });
        c.strokeStyle = rgba(PALE, .35); c.lineWidth = 2; c.beginPath(); c.moveTo(bx - 40, 800); c.lineTo(HOUSE[0] - 120, 800); c.stroke();
        // parcels drop out of the block every .42 s and slide to your door, stacking up
        for (let k = 0; k < 9; k++) { const t0 = tw + .1 + k * .42; if (t < t0) break;
          const fall = expoIn(span(t, t0, t0 + .35)), sl = sineIO(span(t, t0 + .35, t0 + 1.25)), px = lerp(bx, HOUSE[0] - 170 - (k % 3) * 64, sl), py = lerp(y + hh + 50, 800, fall) - Math.floor(k / 3) * 50 * sl;
          B.parcel(c, px, py, .95, { rot: (1 - fall) * .2 * (k % 2 ? 1 : -1) }); }
        TX(c, 'PICKED OUT FOR YOU', HOUSE[0] - 160, 900, { align: 'center', size: 26, col: '#ffe7a8', a: span(t, tp - .2, tp + .3) });
      });
    },
    out: { k: 'sweep', kind: 'post', dir: -1, w: 200, col: '#0b0f2e', lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- L.05 · doorsteps: a parcel at every door, nobody sends one back
  const camL05 = (t, s) => camK(t, [[s.a - 1.1, cam3({ z: -140, x: -60, y: -30 })], [s.b + 1, cam3({ z: 60, x: 0, y: -20 })]], .5);
  const L05 = {
    id: 'L.05',
    draw(ctx, t, s) {
      const L = look(R, t), c = camL05(t, s), tb = s.w('back');
      const out = S.street(ctx, t, c, L, { lamps: true, pods: [{ x: 2300 - (t - s.a + 1) * 240, y: 1010, s: .9, dir: -1 }], near: (g, tt, o) => {
        for (const hz of [o.yours, o.across]) if (hz && hz.door) { const [dx, dy, dw, dh] = hz.door; B.parcel(g, dx + dw * .3, dy + dh + 4, 1.5); B.parcel(g, dx + dw * .9, dy + dh + 4, 1.2, { rot: .06 }); }
      } });
      K.scr(ctx, (g) => { for (const m of out.mid || []) if (m.door) { const p = project(c, 4200, m.door[0] + m.door[2] / 2, m.door[1] + m.door[3]); if (p) B.parcel(g, p[0], p[1] + 2, .9 * p[2]); } });
      K.caps(ctx, 'SENT BACK', W / 2, 250, K.cardU(t, tb - .3, s.b + .3) * (t < s.b ? 1 : 0), { size: 26, align: 'center', col: '#dfe6ff' });
      const nu = K.cardU(t, tb - .1, s.b + .3) * (t < s.b ? 1 : 0); if (nu > 0) K.scr(ctx, (g) => SER(g, '0', W / 2, 370, { align: 'center', size: 110, a: clamp(nu * 2) }));
      endL05 = project(c, 16000, 960, 560) || endL05;
      K.scr(ctx, (g) => { g.fillStyle = K.rad(g, W * .5, H * .5, 1150, [[0, rgba('#0b1238', .05)], [1, rgba('#0b1238', .45)]]); g.fillRect(0, 0, W, H); });
    },
    out: { k: 'iris', c: () => [endL05[0], endL05[1], 50], lead: .45, dur: 1.5, rim: '#dfe6ff' },
  };
  let endL05 = [W / 2, 560];
  // ---------------------------------------------------------------- L.06–L.07 · EXPL the ring runs to the street's end and opens into the field map
  const L06 = {
    id: 'L.06',
    draw(ctx, t, s) {
      const t7 = s.r('L.07'), tl = s.w('lost'), tland = s.w('land');
      K.dusk(ctx, t, { glow: [1500, 560] });
      const st0 = { end: [SX + 7 * SG + 70, SB - 100] };
      const mv = sineIO(span(t, s.a, t7 - .1)), rx = lerp(W / 2, st0.end[0], mv), ry = lerp(560, st0.end[1], mv);
      const op = expoIn(span(t, t7 - .15, t7 + .55)), rr = lerp(56, 2300, op);
      K.scr(ctx, (c) => { float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b + 1)));
        B.searchStreet(c, t, { build: 1, a: 1 - .5 * op });
        TX(c, 'THE FARMERS', st0.end[0] - 20, 300, { align: 'right', size: 26, col: '#dfe6ff', a: span(t, s.r('L.06') + .1, s.r('L.06') + .5) * (1 - op) });
        if (op > 0) { c.save(); c.beginPath(); c.arc(rx, ry, rr, 0, 7); c.clip(); c.fillStyle = '#0d1640'; c.fillRect(-100, -100, W + 200, H + 200);
          B.fieldMap(c, t, MAP.x0, MAP.y0, MAP.cols, MAP.rows, MAP.cw, MAP.ch, { flip: (k) => span(t, tl - .2 + (RANK[k] / N) * (tland - tl + .9), tl + (RANK[k] / N) * (tland - tl + .9)) });
          TX(c, 'FARMLAND', MAP.x0, MAP.y0 - 30, { size: 24, col: SUB, a: span(t, t7 + .2, t7 + .6) });
          c.restore(); }
        B.searchRing(c, t, rx, ry, lerp(56, 120, op), 1 - op);
      });
    },
    out: { k: 'sweep', kind: 'post', dir: -1, w: 200, col: '#0b0f2e', lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- L.08 · the end of the street, 4 PM: you small at the fence
  const camL08 = (t, s) => camK(t, [[s.a - 1.1, cam3({ z: -260, x: -160, y: -20 })], [s.b + 1, cam3({ z: -60, x: -60, y: -40 })]], .5);
  const L08 = {
    id: 'L.08',
    draw(ctx, t, s) { PL.towerPlace(ctx, t, camL08(t, s), look(R, t), { you: [520, 1090, 330] }); },
    out: { k: 'sweep', kind: 'post', dir: 1, w: 200, col: '#0b0f2e', lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- L.09–L.10 · the land: the cornfield ghost is wiped, the rows run to the hills
  const camL09 = (t, s) => { const t10 = s.r('L.10');
    return camK(t, [[s.a - 1.1, cam3({ z: -120, x: 0, y: 60 })], [t10 - .2, cam3({ z: -40, x: 20, y: 40 })], [t10 + 2.2, cam3({ z: 120, x: 40, y: -260 }), 'q'], [s.b + 1, cam3({ z: 200, x: 60, y: -300 })]], .5); };
  const L09 = {
    id: 'L.09',
    draw(ctx, t, s) {
      const L = look(R, t), c = camL09(t, s), tc = s.w('cornfields'), tf = s.w('fence'), tr = s.w('run'), th = s.w('hills');
      const reach = lerp(.3, 1, sineIO(span(t, tr - .6, th + .4)));
      PL.land(ctx, t, c, L, { reach, you: [700, 1150, 300] });
      // the cornfields that ran to the horizon: pale-ink stalks on the land (card 5000), wiped right to left on "fence begins"
      const ga = span(t, tc - .4, tc + .3), wipe = sineIO(span(t, tf - .1, tf + 1.0));
      if (ga > 0 && wipe < 1) K.scr(ctx, (g) => { const ft = project(c, 2200, 960, 700); g.save(); g.beginPath(); g.rect(-50, 0, lerp(W + 100, 0, wipe), ft ? ft[1] : H); g.clip(); g.strokeStyle = rgba('#eef2ff', .55 * ga); g.lineWidth = 2; g.lineCap = 'round';
        const r = K.prng(17);
        for (let row = 0; row < 9; row++) { const v = 540 + Math.pow(row / 8, 1.6) * 520; for (let k = 0; k < 40; k++) { const u = -600 + k * 80 + r() * 30 + (row % 2) * 40;
          const a = project(c, 5000, u, v), b = project(c, 5000, u + 4, v - 70 - r() * 20); if (!a || !b) continue; const sw = 3 * Math.sin(t * 1.2 + k + row);
          g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0] + sw, b[1]); g.moveTo(lerp(a[0], b[0], .6), lerp(a[1], b[1], .6)); g.lineTo(lerp(a[0], b[0], .6) + 12 * a[2], lerp(a[1], b[1], .6) - 8 * a[2]); g.stroke(); } }
        g.restore(); });
      bayL09 = (() => { const a = project(c, 2200, 943, 720), b = project(c, 2200, 977, 1020); return a && b ? [a[0], a[1], b[0] - a[0], b[1] - a[1]] : bayL09; })();
    },
    out: { k: 'fn', fn: B.maskGrow(() => bayL09, { r: 4, rim: '#dfe6ff' }), lead: .4, dur: 1.3 },
  };
  let bayL09 = [900, 500, 60, 300];
  // ---------------------------------------------------------------- L.11 · the gate, close: latch and hinges on the far side
  const camL11 = (t, s) => camK(t, [[s.a - 1.1, cam3({ z: 220, x: 60, y: -300 })], [s.b + 1, cam3({ z: 320, x: 60, y: -320 })]], .3);
  const LATCH = [1345, 560];
  const L11 = {
    id: 'L.11',
    draw(ctx, t, s) {
      const L = look(R, t), c = camL11(t, s), tg = s.w('gate'), to = s.w('other');
      PL.land(ctx, t, c, L, { reach: 1 });
      K.scr(ctx, (g) => { float2(g, t, 1 + .03 * sineIO(span(t, s.a, s.b + 1)));
        g.fillStyle = rgba('#060a24', .35); g.fillRect(0, 0, W, H);
        const x0 = 520, x1 = 1400 + 30, y0 = 150, y1 = 1080, bar = mixHex('#141a46', L.shade, .2), lit = mixHex('#3a4280', L.light, .15);
        // far side first: hinges on the left post, the latch box on the right, both behind the bars
        for (const hy of [300, 880]) { g.fillStyle = mixHex('#2a3060', L.light, .15); g.beginPath(); g.roundRect(x0 + 10, hy - 40, 34, 80, 10); g.fill(); g.fillRect(x0 + 44, hy - 10, 60, 20); g.fillStyle = rgba('#e8eefc', .25); g.fillRect(x0 + 12, hy - 40, 3, 80); }
        const lg = span(t, to - .3, to + .3);
        g.fillStyle = mixHex('#2e3670', L.light, .15); g.beginPath(); g.roundRect(LATCH[0] - 46, LATCH[1] - 46, 92, 92, 8); g.fill(); g.fillStyle = mixHex('#4a5498', '#dfe6ff', .3 * lg); g.beginPath(); g.roundRect(LATCH[0] - 10, LATCH[1] - 12, 150, 24, 12); g.fill();
        g.fillStyle = mixHex('#4a5498', '#dfe6ff', .3 * lg); g.beginPath(); g.arc(LATCH[0] + 30, LATCH[1] - 30, 12, 0, 7); g.fill(); g.fillStyle = rgba('#e8eefc', .25 + .35 * lg); g.fillRect(LATCH[0] - 46, LATCH[1] - 46, 92, 3);
        // the bars and the frame (your side)
        g.fillStyle = bar; for (let x = x0; x <= x1 + 1; x += 110) g.fillRect(x - 10, y0, 20, y1 - y0);
        g.fillRect(x0 - 16, y0, x1 - x0 + 32, 22); g.fillRect(x0 - 16, 700, x1 - x0 + 32, 18);
        g.fillStyle = lit; g.fillRect(x0 - 16, y0, x1 - x0 + 32, 3); for (let x = x0; x <= x1 + 1; x += 110) g.fillRect(x - 10, y0, 3, y1 - y0);
        // your side: a blank plate where a handle would be
        g.fillStyle = mixHex('#1e2558', L.light, .1); g.beginPath(); g.roundRect(x1 - 30, 520, 60, 110, 6); g.fill(); g.strokeStyle = rgba('#e8eefc', .18); g.lineWidth = 2; g.stroke();
        TX(g, 'LATCH', LATCH[0], LATCH[1] - 80, { align: 'center', size: 26, col: '#dfe6ff', a: lg });
        TX(g, 'NO HANDLE', x1 + 56, 580, { size: 26, col: '#ffe7a8', a: span(t, tg + .1, tg + .5) }); TX(g, 'ON YOUR SIDE', x1 + 56, 616, { size: 26, col: '#ffe7a8', a: span(t, tg + .2, tg + .6) });
      });
    },
    out: { k: 'iris', c: [LATCH[0] + 15, LATCH[1], 60], lead: .4, dur: 1.4, rim: '#dfe6ff' },
  };
  // ---------------------------------------------------------------- L.12–L.13 · EXPL the map again: no break-in, only SOLD; one offer at a time
  const slipAt = (r, ts, te) => ts + (te - ts) * Math.pow(r / (N - 1), .72);
  const L12 = {
    id: 'L.12',
    draw(ctx, t, s) {
      const t13 = s.r('L.13'), tst = s.w('stole'), tfl = s.w('fields'), ts0 = t13 + .15, ts1 = s.b - .6;
      K.dusk(ctx, t, { glow: [QSTART[0], 560] });
      K.scr(ctx, (c) => { float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b + 1)) + .06 * sineIO(span(t, s.b - 2.2, s.b + .8)), QSTART[0] + 20, QSTART[1] + 30);
        const cs = B.fieldMap(c, t, MAP.x0, MAP.y0, MAP.cols, MAP.rows, MAP.cw, MAP.ch, { flip: () => 1 });
        TX(c, 'FARMLAND', MAP.x0, MAP.y0 - 30, { size: 24, col: SUB });
        // no break-in: STOLEN, struck
        struckWord(c, 'STOLEN', 1180, 160, 64, span(t, tst - .3, tst + .1), span(t, tst + .3, tst + .7), { align: 'center' });
        // SOLD tags on every parcel (L.12); the offer slips land on them one at a time (L.13)
        for (const [k, x, y] of cells) { const r = RANK[k], su = span(t, tfl - .4 + r * .02, tfl - .1 + r * .02); if (su <= 0) continue;
          c.save(); c.globalAlpha *= su; c.fillStyle = rgba('#0b0f2e', .55); c.beginPath(); c.roundRect(x - 40, y - 22, 80, 34, 4); c.fill(); c.fillStyle = '#ffe3ea'; c.font = '700 22px Inter'; c.textAlign = 'center'; c.fillText('SOLD', x, y + 3); c.restore(); }
        for (const [k, x, y] of cells) { const r = RANK[k], tl = slipAt(r, ts0, ts1); B.slip(c, x + 20, y + 30, span(t, tl - .35, tl), { rot: -.08 + .05 * ((k * 7) % 3 - 1) }); }
        const dm = .4 * sineIO(span(t, s.b - 1.4, s.b + .2)); if (dm > 0) { c.fillStyle = rgba('#0b1238', dm); c.fillRect(MAP.x0 - 30, MAP.y0 - 30, MAP.cols * MAP.cw + 60, MAP.rows * MAP.ch + 60); }   // the map settles into B3's muted small map
        TX(c, 'ONE OFFER AT A TIME', MAP.x0, 860, { size: 24, col: '#ffe7a8', a: span(t, s.w('offer') - .2, s.w('offer') + .3) });
      });
    },
    out: { k: 'iris', c: [QSTART[0] + 20, QSTART[1] + 30, 40], lead: .3, dur: 1.0, pushA: .12, rim: '#f3efe2' },
  };
  return B.calmShots([L01, L02, L04, L05, L06, L08, L09, L11, L12], R);
}
