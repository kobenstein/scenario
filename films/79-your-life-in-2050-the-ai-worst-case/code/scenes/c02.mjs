// Film 79 · c02 THE BOAT, YOUR WORK, THE ROAD (B.01–B.13, vo-v2) · builder B1
// PLAN (docs/BRIEF-builders.md §5 gate 1)
//  beats (one picture per sentence):
//   B.01 SZENE  the street of c01 goes on without a cut; the camera glides right to the neighbour's garage (annex of the house across),
//               the door rolls up: the hull under a sheet, his amber work lamp, he sits on a crate
//   B.02 EXPL   iris out of his lamp onto the night ground: the hull in pale ink, he sits beside it; a pale-ink FIRED notice drops and is
//               struck out in carmine, it crumbles (nothing happened to him)
//   B.03 EXPL   he and his hull slide into the corner; HIS ORDER BOOK 2046–2050 builds as monthly amber bars that thin out to nothing
//   B.04 EXPL   a paper card unfolds out of the last, empty month: BACK THEN · YOUR WORK, you at the drawing board, the plan draws itself
//   B.05 EXPL   the card folds into the start of a bar: THE SAME JOB · YOU · A DAY (amber) vs A MACHINE · A FEW SECONDS (a carmine sliver)
//   B.06 EXPL   the sliver flies into the big NOT NEEDED counter (out of the HUD corner): box 2 YOUR WORK turns carmine, a "?"
//   B.07 EXPL   the counter shrinks back into the HUD (8:40 AM); the day dial grows: the hands at 8:40, a pale arc ahead to the NOON mark
//   B.08 MIX    iris out of the dial: the street, you on the pavement, the phone in your hand glows: tag BALANCE 0; you put it away, walk
//   B.09 SZENE  a lamp post sweeps the lens: low on your kerb, looking across; your shoe steps into the road without looking; a car
//               comes and brakes for you (carmine brake light) and stops
//   B.10 MIX    in the far lane the cars brake around you in a soft wave and glide on (tags PASSENGERS ?)
//   B.11 SZENE  the camera pushes to the stopped car's side glass
//   B.12 MIX    portal through the glass: inside, crates and spare parts belted to the seats, tags FROM: MACHINE · TO: MACHINE
//   B.13 EXPL   iris out of the gear: your street from above as a map, hundreds of carmine trip lines, your door amber: YOUR ERRANDS 0;
//               the lines bend across the road into the plot of the data centre (→ c03 D.01, iris out of the plot)
//  carriers: c01 street (same camera, no cut) → glide · lamp (iris) · the hull/strike/last bar/card/sliver/counter on one night stage ·
//            the dial (iris) · lamp post (sweep) · the side glass (portal) · the gear (iris) · the plot (iris, into c03)
//  wow: none here (c02 is the quiet slide; the chunk's accents: the strike on FIRED, the sliver landing in box 2)
//  HUD: 8:40 AM at B.07, 9:00 AM at B.09; NOT NEEDED 2 · YOUR WORK at B.06 (hidden B.06–B.07 while the big counter is out)
// Anchors: row ids and phrases only.
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as B from '../lib/f79_b1.mjs';
import { hourAt } from './hud.mjs';
import { INK } from './c01.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM, AMBER } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const YOUINK = { ...INK, base: '#c79a2a', lit: '#e8b84a', shade: '#8a6418' };
// the parcel and the bicycle at your door (as in c01 H.17: the street must match frame for frame at the seam)
function doorProps(g, out, L) {
  const y0 = out.yours; if (!y0 || !y0.door) return; const [dx, dy, dw, dh] = y0.door;
  g.fillStyle = mixHex('#8a7058', L.shade, .3); g.fillRect(dx + dw + 20, dy + dh - 60, 78, 60); g.fillStyle = rgba('#e8eefc', .25); g.fillRect(dx + dw + 20, dy + dh - 60, 78, 6); g.fillRect(dx + dw + 55, dy + dh - 60, 6, 60);
  g.strokeStyle = mixHex('#2a3270', L.light, .1); g.lineWidth = 6; for (const wx of [dx - 330, dx - 200]) { g.beginPath(); g.arc(wx, dy + dh - 44, 42, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(dx - 330, dy + dh - 44); g.lineTo(dx - 270, dy + dh - 110); g.lineTo(dx - 200, dy + dh - 44); g.lineTo(dx - 280, dy + dh - 44); g.closePath(); g.stroke();
}
// a pale-ink notice sheet (what did NOT happen)
function notice(c) {
  K.ink(c, B.PALE, 3); c.strokeRect(-150, -190, 300, 380); c.lineWidth = 2;
  c.font = '600 24px Inter'; c.letterSpacing = '0.2em'; c.textAlign = 'center'; c.fillText('NOTICE', 0, -140); c.letterSpacing = '0em';
  c.font = '84px "Instrument Serif"'; c.fillText('FIRED', 0, -20);
  for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(-110, 40 + k * 26); c.lineTo(k === 4 ? 20 : 110, 40 + k * 26); c.stroke(); }
}
// the hull in pale ink (the carrier out of the garage)
function inkHull(c, x, y, w) {
  K.ink(c, B.PALE, 3); const h = w * .22;
  c.beginPath(); c.moveTo(x, y - h * .6); c.quadraticCurveTo(x + w * .5, y + h * .55, x + w, y - h * .45); c.lineTo(x + w + 18, y - h * .7); c.lineTo(x - 8, y - h * .75); c.closePath(); c.stroke();
  for (const tx of [x + w * .2, x + w * .78]) { c.beginPath(); c.moveTo(tx - 30, y + h * 1.1); c.lineTo(tx, y); c.lineTo(tx + 30, y + h * 1.1); c.stroke(); }
}
// the order book: 60 months 2046–2050, amber bars that thin out to nothing (fiction of the scenario: no data claim, no source line)
const MONTHS = (() => { const r = K.prng(46), a = []; for (let i = 0; i < 60; i++) { const d = clamp(1 - i / 43); a.push(d <= 0 ? 0 : Math.pow(d, 1.25) * (.62 + .38 * r())); } return a; })();
export default function c02(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- B.01 · the street goes on: the neighbour's garage door rolls up
  const C0 = cam3({ z: -440, y: -70, x: 20 });   // = the last camera key of c01 (H.27): no cut at the seam
  const camG = (t, s) => camK(t, [[s.a, C0], [s.r('B.02') - .4, aim(2600, 2420, 690, .98, W * .7, H * .55)]], .3);
  const B01 = {
    id: 'B.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camG(t, s), open = span(t, s.a + .45, s.a + 1.5);
      S.street(ctx, t, c, L, { hedges: 1, lit: .45, farPod: 920, near: (g, tt, out) => { doorProps(g, out, L); B.garageAnnex(g, t, L, open, { lamp: 1 }); } });
      // c01's blank day-leaves over the doors finish fading (they were at 1/3 on the seam)
      const bl = 1 - span(t, s.a - .4, s.a + .2);
      if (bl > 0) { const pts = [[2600, 40, 520], [2600, 1700, 520], [4200, 380, 470], [4200, 1380, 470], [7000, 510, 520], [7000, 1220, 520]];
        pts.forEach(([Z, u, v], i) => { const pp = project(c, Z, u, v); if (!pp) return; const a = span(bl, i * .1, .5 + i * .1); if (a <= 0) return;
          K.scr(ctx, (g) => { const w = Math.max(26, 70 * pp[2]), h = w * .62; g.globalAlpha = a * .9; g.fillStyle = K.PAPER.lit; g.fillRect(pp[0] - w / 2, pp[1] - h, w, h); g.fillStyle = K.PAPER.red; g.fillRect(pp[0] - w / 2, pp[1] - h, w, h * .22); g.globalAlpha = 1; }); }); }
    },
    out: { k: 'fn', fn: B.irisSoft((t) => { const s = { r: RT, a: R['B.01'] }, p = project(camG(t, s), 2600, B.GARAGE.lamp[0], B.GARAGE.lamp[1] + 2); return [p[0], p[1], 9 * p[2]]; }, { rim: AMBER.core }), lead: .45, dur: 1.3 },
  };
  // ---------------------------------------------------------------- B.02–B.07 · one night stage: FIRED struck · the order book · YOUR WORK card ·
  // THE SAME JOB · the counter · the day dial
  const B02 = {
    id: 'B.02',
    draw(ctx, t, s) {
      const t3 = s.r('B.03'), t4 = s.r('B.04'), t5 = s.r('B.05'), t6 = s.r('B.06'), t7 = s.r('B.07'), tf = s.w('fired');
      const corner = K.quartIO(span(t, t3 - .2, t3 + .9)), gone = K.expoIn(span(t, t4 - .1, t4 + .45));
      K.dusk(ctx, t, { glow: [lerp(960, 1200, corner), 520] });
      K.scr(ctx, (c) => {
        // the neighbour beside his hull: the centre of the iris, then a small vignette bottom left; drops out under the card
        if (gone < 1) { c.save(); c.globalAlpha = 1 - gone; const k = lerp(1, .5, corner); c.translate(lerp(0, -470, corner), lerp(0, 220, corner) + 160 * gone); c.translate(960, 760); c.scale(k, k); c.translate(-960, -760);
          inkHull(c, 760, 720, 400); c.fillStyle = mixHex('#6a5040', '#0b1238', .3); c.fillRect(1240, 800, 90, 66);
          K.folk(c, t, 4, 1285, 806, 260, { dir: -1, lean: .28, armR: [.9, 2.1], armL: [-.9, -2.1], look: -.1 + .06 * Math.sin(t * .5) + .5 * K.bump(t, tf + .3, 1.6) });
          c.restore(); }
        // B.02: the notice drops toward him, is struck (carmine) and crumbles
        const nIn = K.expoOut(span(t, s.a - .3, s.a + .45)), st = span(t, tf + .1, tf + .45), k = span(t, t3 - .35, t3 + .35);
        if (nIn > 0 && k < 1) { c.save(); c.globalAlpha = nIn * (1 - K.expoIn(k)); c.translate(960, 360 - 120 * (1 - nIn) + 90 * K.expoIn(k)); c.rotate(-.05 + .14 * k); c.scale(1, 1 - .5 * K.expoIn(k)); notice(c); c.restore();
          if (st > 0) { c.save(); c.globalAlpha = 1 - k; c.strokeStyle = CARM.hot; c.lineWidth = 8; c.lineCap = 'round'; K.strokeIn(c, [[960 - 190, 360 + 210], [960 + 190, 360 - 220]], K.expoOut(st)); c.restore(); } }
        // B.03: his order book, 2046–2050: monthly bars that thin out, the last pages blank
        const x0 = 700, x1 = 1700, y0 = 740, step = (x1 - x0) / 60, bu = span(t, t3 + .05, t3 + 1.05), chartOut = span(t, t4 + .2, t4 + .5);
        if (bu > 0 && chartOut < 1) { c.save(); c.globalAlpha = 1 - chartOut;
          B.T(c, 'HIS ORDER BOOK', x0, 280, { size: 30, spacing: .18, a: span(bu, 0, .2) }); B.T(c, 'BOATS ORDERED PER MONTH', x0, 318, { size: 22, col: B.TXT.sub, a: span(bu, .05, .25) });
          c.fillStyle = rgba(P.cream, .5); c.fillRect(x0, y0, (x1 - x0) * K.expoOut(span(bu, 0, .4)), 2);
          for (let i = 0; i < 60; i++) { const x = x0 + i * step, g = K.expoOut(span(bu, .08 + i * .012, .3 + i * .012)); if (g <= 0) continue;
            const hh = MONTHS[i] * 360 * g;
            if (MONTHS[i] > 0) { c.fillStyle = lin2(c, y0 - hh, y0); c.beginPath(); c.roundRect(x + 2, y0 - hh - 2, step - 4, hh, [4, 4, 0, 0]); c.fill(); }
            else { c.strokeStyle = rgba(B.PALE, .35 * g); c.lineWidth = 1.5; c.setLineDash([4, 5]); c.strokeRect(x + 3, y0 - 60, step - 6, 56); c.setLineDash([]); } }
          for (let yv = 0; yv < 5; yv++) { const a = span(bu, .2 + yv * .05, .4 + yv * .05); B.T(c, String(2046 + yv), x0 + yv * 12 * step + 6, y0 + 40, { size: 22, col: B.TXT.sub, a }); }
          c.restore(); }
        // B.04: the card out of the last empty month: BACK THEN · YOUR WORK, you at the drawing board
        const cu = B.cardS(t, t4 - .15, t5 + .55, .95, 1.4);
        if (cu > 0) K.paper(c, t, 300, 150, 1320, 640, cu, { from: [lerp(x1 - step / 2, 300, K.sineIO(span(t, t4 + .3, t5))), lerp(y0 - 30, 520, K.sineIO(span(t, t4 + .3, t5)))], head: 'BACK THEN · YOUR WORK', draw: (g, x, y, w, h) => {
          const pu = span(t, t4 + .4, t5 - .1), bx = x + w * .62, by = y + h * .5;
          g.save(); g.translate(bx, by); g.rotate(-.08); K.ink(g, K.PAPER.ink2, 3); g.strokeRect(-w * .3, -h * .38, w * .6, h * .72);
          g.beginPath(); g.moveTo(-w * .18, h * .34); g.lineTo(-w * .24, h * .62); g.moveTo(w * .18, h * .34); g.lineTo(w * .24, h * .62); g.stroke();
          K.ink(g, K.PAPER.ink, 3.2); const pl = [[-w * .22, h * .2], [w * .22, h * .2], [w * .22, -h * .06], [0, -h * .26], [-w * .22, -h * .06], [-w * .22, h * .2]];
          K.strokeIn(g, pl, K.sineIO(pu)); K.strokeIn(g, [[-w * .06, h * .2], [-w * .06, h * .04], [w * .04, h * .04], [w * .04, h * .2]], span(pu, .7, 1));
          for (let k = 0; k < 3; k++) K.strokeIn(g, [[w * .1 + k * 0, -h * .02 + k * 0], [w * .17, -h * .02]], span(pu, .8, 1));
          g.restore();
          K.figureRaw(g, x + w * .2, y + h * .98, h * .82, { dir: 1, pose: 'point', armR: [1.75 + .08 * Math.sin(t * 3.1), 1.95 + .1 * Math.sin(t * 3.1)], look: .35, lean: .08 }, YOUINK, false);
        } });
        // B.05: THE SAME JOB · YOU · A DAY vs A MACHINE · A FEW SECONDS (no amounts, no money)
        const bx0 = 300, bx1 = 1600, e5 = span(t, t5 + .05, t5 + .3), out6 = K.expoIn(span(t, t6 - .35, t6 + .25));
        if (e5 > 0 && out6 < 1) { c.save(); c.globalAlpha = e5 * (1 - out6); c.translate(0, 260 * out6);
          B.T(c, 'THE SAME JOB', bx0, 330, { size: 30, spacing: .18 });
          const yu = K.expoOut(span(t, t5 + .2, t5 + 1.3)), wy = 470;
          B.T(c, 'YOU · A DAY', bx0, wy - 22, { size: 24, col: AMBER.core });
          c.fillStyle = K.lin(c, bx0, 0, bx1, 0, [[0, AMBER.deep], [1, AMBER.body]]); c.beginPath(); c.roundRect(bx0, wy, Math.max(4, (bx1 - bx0) * yu), 64, 4); c.fill();
          const tm = s.w('machine'), mu = span(t, tm - .05, tm + .35), my = 660;
          B.T(c, 'A MACHINE · A FEW SECONDS', bx0, my - 22, { size: 24, col: '#ffd6de', a: mu });
          if (mu > 0 && t < t6 + .2) { c.fillStyle = CARM.body; c.fillRect(bx0, my, 6, 64); K.ring(c, t, bx0 + 40, my + 32, 18, mu * .8); }
          c.restore(); }
        // B.06: the sliver flies into box 2 of the counter (the counter grows out of the HUD corner); B.07: back into the HUD
        const g6 = K.expoOut(span(t, t6, t6 + .8)) * (1 - K.quartIO(span(t, t7 - .1, t7 + .55)));
        const fl = span(t, t6 + .1, t6 + .85);
        if (fl > 0 && fl < 1) { const k6 = lerp(.32, 1, g6), cx = lerp(150, W / 2, g6), cy = lerp(150, 330, g6), tx = cx + (-312) * k6, ty = cy; const e = K.sineIO(fl), x = lerp(bx0 + 3, tx, e), y = lerp(692 + 120 * out6, ty, e) - Math.sin(Math.PI * e) * 160;
          c.save(); c.translate(x, y); c.rotate(e * 1.2); c.fillStyle = CARM.hot; c.fillRect(-3, -32 * (1 - e) - 8, 6, 64 * (1 - e) + 16); c.restore(); K.carmGlow(c, x, y, 70, .25); }
        B.bigCounter(c, t, g6, 2, { 0: 'THE ALARM CLOCK', 1: 'YOUR WORK' }, { fill: span(t, t6 + .8, t6 + 1.15), q: span(t, s.w('live') - .1, s.w('live') + .5) });
        // B.07: the day dial: 8:40, a pale arc ahead to NOON
        const ds = span(t, t7 + .05, t7 + .9);
        if (ds > 0) { B.dayDial(c, t, 960, 500, 230, 8 + 40 / 60 + (t - t7) * .004, 12, ds, { arc: span(t, t7 + .5, s.w('noon') + .3), mark: span(t, s.w('noon') - .2, s.w('noon') + .3) });
          B.T(c, '8:40 AM', 960, 820, { align: 'center', size: 26, a: span(t, t7 + .4, t7 + .9) }); }
      });
    },
    out: { k: 'fn', fn: B.irisSoft(() => [960, 500, 70], { rim: '#dfe6ff' }), lead: .5, dur: 1.3 },
  };
  // ---------------------------------------------------------------- B.08 · the street: the phone in your hand reads BALANCE 0; you put it away and walk
  const camPh = (t, s) => camK(t, [[s.a - .5, cam3({ z: 470, y: 130, x: -320 })], [s.b + .8, cam3({ z: 500, y: 128, x: -120 })]], .3);
  const B08 = {
    id: 'B.08',
    draw(ctx, t, s) {
      const L = look(R, t), c = camPh(t, s), tw = s.w('walk'), tput = tw - 1.1, put = K.sineIO(span(t, tput, tput + .8)), walk = span(t, tw - .2, s.b + 1.2);
      const yx = lerp(250, 640, K.sineIO(walk)), hand = 1 - put;
      let ph = null;
      S.street(ctx, t, c, L, { hedges: 1, lit: .3, fore: false, pods: [{ x: 2400 - ((t - s.a) * 150), y: 1000, s: .9, dir: -1 }],
        focus: (g) => { const hd = K.you(g, t, yx, 1012, 320, { dir: 1, walk: walk > 0 && walk < 1 ? K.walkPh(t, .8) : undefined, look: lerp(-.45, .05, put), armR: [lerp(.2, 1.35, hand), lerp(.1, 2.55, hand)] });
          if (hand > .05 && hd && hd.R) { const [hx, hy] = hd.R; ph = [hx, hy]; g.save(); g.translate(hx + 4, hy - 10); g.rotate(-.25); g.fillStyle = '#05061a'; g.beginPath(); g.roundRect(-11, -20, 22, 38, 4); g.fill();
            g.fillStyle = rgba(CARM.hot, .85 * hand); g.fillRect(-8, -16, 16, 30); g.restore(); K.carmGlow(g, hx, hy - 10, 90, .25 * hand); } } });
      // the tag: BALANCE 0, rising out of the phone
      const tu = K.cardU(t, s.a + .5, tput + .5);
      if (tu > 0 && ph) { const p = project(c, 1700, ph[0], ph[1]); if (p) { K.scr(ctx, (g) => { g.globalAlpha = tu; g.strokeStyle = rgba('#ffd6de', .7); g.lineWidth = 2; g.beginPath(); g.moveTo(p[0] + 14, p[1] - 30); g.lineTo(p[0] + 90, p[1] - 140); g.lineTo(p[0] + 150, p[1] - 140); g.stroke(); });
        K.caps(ctx, 'BALANCE', p[0] + 160, p[1] - 250, tu, { size: 30, col: '#ffd6de' }); K.words(ctx, '0', p[0] + 160, p[1] - 108, 150, tu, { serif: true, glow: false, col: '#ffd6de' }); } }
    },
    out: { k: 'sweep', kind: 'post', dir: -1, w: 200, col: '#0b0f2e', lead: .4, dur: .8 },
  };
  // ---------------------------------------------------------------- B.09–B.11 · the kerb across the road: you step off without looking, the cars brake
  const camKb = (t, s) => { const t10 = s.r('B.10'), t11 = s.r('B.11'), gl = B.podGlass(1060, 1000, 1.6, -1);
    return camK(t, [[s.a - 1.2, cam3({ z: -160, x: -60, y: 30 })], [t10, cam3({ z: -150, x: -40, y: 28 })], [t11 + .6, cam3({ z: -125, x: -5, y: 21 })],
      [s.b + .2, aim(2200, gl[0] + gl[2] / 2, gl[1] + gl[3] / 2, 1.6, W * .5, H * .76), 's']], .3); };
  const B09 = {
    id: 'B.09',
    draw(ctx, t, s) {
      const L = look(R, t), c = camKb(t, s), t10 = s.r('B.10'), tb = s.w('brake'), step = span(t, s.a + .5, s.a + 1.7);
      // car A: the near lane, comes from the right, brakes for you and stops beside your foot
      const aT0 = tb - 1.6, aStop = tb + .9, ax = t < aT0 ? 3200 : t < aStop ? lerp(3200, 1060, 1 - Math.pow(1 - span(t, aT0, aStop), 2.2)) : 1060;
      const brakeA = span(t, tb - .1, tb + .05) * (1 - span(t, aStop + .4, aStop + 1.4)) * .9 + .25 * (t > aStop ? 1 : 0);
      // the far lane: three cars from the left, each brakes softly as it passes you (a wave) and glides on
      const far = [0, 1].map((i) => { const t0 = t10 - 2.1 + i * .9, u = t - t0, x = -500 + u * 480 - 170 * Math.max(0, Math.sin(Math.PI * clamp((u - 1.0) / 1.4))); return { x, lane: 'far', y: 905, s: .95, dir: 1, brake: Math.max(0, Math.sin(Math.PI * clamp((u - 1.0) / 1.4))), u }; }).filter((p) => p.u > -.2 && p.x < 2600);
      B.kerb79(ctx, t, c, L, { step, legX: 330, cars: [...far, { x: ax, lane: 'near', y: 1000, s: 1.6, dir: -1, brake: brakeA }],
        focus: (g) => { const tq = K.cardU(t, t10 + .3, s.r('B.11') + .2); if (tq > 0) for (const p of far) { if (p.x < 300 || p.x > 1900) continue; g.save(); g.globalAlpha = tq * clamp(1 - Math.abs(p.x - 1000) / 900); g.translate(p.x, 760); B.T(g, 'PASSENGERS ?', 0, 0, { align: 'center', size: 22, col: '#dfe6ff' }); g.restore(); } } });
    },
    out: { k: 'fn', fn: B.maskGrow((t) => { const s = { r: (id) => R[id], a: R['B.09'], b: R['B.12'] }, c = camKb(t, s), gl = B.podGlass(1060, 1000, 1.6, -1), a = project(c, 2200, gl[0], gl[1]), b = project(c, 2200, gl[0] + gl[2], gl[1] + gl[3]); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }), lead: .6, dur: 1.35 },
  };
  // ---------------------------------------------------------------- B.12 · inside the car: crates and spare parts, FROM: MACHINE · TO: MACHINE
  const camCab = (t, s) => camK(t, [[s.a - .6, cam3({ z: -80, x: -20 })], [s.b + .6, cam3({ z: -30, x: 20, y: -4 })]], .3);
  let gear = [1130, 690, 62];
  const B12 = {
    id: 'B.12',
    draw(ctx, t, s) {
      const L = look(R, t), c = camCab(t, s);
      const o = B.cabin(ctx, t, c, L, { tag: span(t, s.w('riding') - .2, s.w('next') + .2), v: 80 }); if (o.gear) gear = o.gear;
    },
    out: { k: 'fn', fn: B.irisSoft((t) => { const s = { r: RT, a: R['B.12'], b: R['B.13'] }, p = project(camCab(t, s), 1900, gear[0], gear[1]); return [p[0], p[1], gear[2] * .34 * p[2]]; }, { rim: '#dfe6ff' }), lead: .45, dur: 1.35 },
  };
  // ---------------------------------------------------------------- B.13 · the street as a map: hundreds of trips, none of them yours
  const B13 = {
    id: 'B.13',
    draw(ctx, t, s) {
      const te = s.w('errand'), z = 1 + .05 * K.sineIO(span(t, s.a, s.b + 1));
      B.tripMap(ctx, t, { u: span(t, s.a - .4, s.a + 2.6), bend: K.sineIO(span(t, s.b - .6, s.b + .2)), ring: span(t, te - .3, te + .4), z });
      const eu = K.cardU(t, te - .2, s.b - .4);
      if (eu > 0) { K.caps(ctx, 'YOUR ERRANDS', 300, 430, eu, { size: 26, align: 'center' }); K.words(ctx, '0', 300, 600, 170, span(t, te, te + .6), { serif: true, align: 'center', glow: false }); }
    },
    out: { k: 'fn', fn: B.irisSoft((t) => { const z = 1 + .05 * K.sineIO(span(t, R['B.13'], R['D.01'] + 1)); return [W / 2 + (B.MAP.plot[0] - W / 2) * z, H / 2 + (B.MAP.plot[1] - H / 2) * z, 120 * z]; }, { rim: '#ffd6de' }), lead: .4, dur: 1.3 },
  };
  return [B01, B02, B08, B09, B12, B13];
}
const lin2 = (c, y0, y1) => K.lin(c, 0, y0, 0, y1, [[0, AMBER.body], [1, AMBER.deep]]);
