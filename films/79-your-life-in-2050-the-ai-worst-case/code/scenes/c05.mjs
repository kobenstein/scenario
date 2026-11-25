// Film 79 · c05 NOON (N.01–N.31, vo-v2, builder B2). PLAN (gates: docs/BRIEF-builders.md §5)
// Beats → pictures (one per sentence), carriers between shots:
//   N.01–02  THE STREET AT NOON (anchor Wende): on "Noon" a carmine chime point lights in every window at once (accent 1), then rings
//            ripple near → far down the street                                         → iris out of one window's chime point
//   N.03     the phone on the table at noon, the houses across chime; the notification lifts off the phone (legible)  → iris out of its dot
//   N.04–07  EXPL the allowance: one company ring sends thin lines to every house, the government pale (N.04) → your line straightens into
//            months that step a little lower, SET BY AN ALGORITHM (N.05) → the notification card unfolds out of the step: WHY? empty (N.06)
//            → TALK TO A HUMAN, locked, EXTRA FEE (N.07)                                 → iris out of the lock
//   N.08–10  EXPL WAGE ✗ RIGHT ✗ (N.08) · OWNER: a share flows to him, DIVIDEND (N.09) · CHILD: a small line handed down (N.10), the
//            child turns into you (the same picture as yours)                            → iris around you
//   N.11–22  EXPL the need mechanism, beat by beat: the ring FIRST / you SECOND (N.11), an empty ballot box (N.12) that drops (N.13);
//            BACK THEN: you in the middle (N.14), WORK → EMPLOYER, TAXES → GOVERNMENT (N.15), they come back as YOUR SEAT AT THE TABLE (N.16),
//            KINDNESS ✗ (N.17), NEED stamped (N.18, accent 2); NOW: the ring takes WORK and TAXES, your lines go dark (N.19), one thin
//            VOTE line stays (N.20), the old arrows as pale ink: THEY LIVED OFF YOU (N.21), the dotted ALLOWANCE feeds you (N.22) → the table grows
//   N.23     MIX the long table: the ring writes the menu at its end, you at the other end without a pen → the menu card becomes the paper card
//   N.24–C1  paper card BACK IN THE TWENTIES · A COMPUTER SCIENTIST (N.24) → his team at an AI company (N.25) → the plate grows out of
//            the card (C1 Duvenaud, 80,000 Hours), folds back; WARNING stamped vs FORECAST struck (N.26) → mask out of the WARNING stamp
//   N.27     MIX your street at noon from the door: the stamp turns CAME TRUE            → lens sweep (a lamp post)
//   N.28–29  EXPL a pale-ink hand that would push you is struck (N.28); your last lines go out one by one, the empty seat (N.29, counter 5)
//                                                                                        → iris around you
//   N.30     MIX the street at noon, you at the kerb with the phone, the chime points fading  → iris out of the phone's glow
//   N.31     EXPL the allowance steps down month after month, NEXT MONTH dotted lower; the next step flies into the counter → iris out of
//            the counter into G.01 (c06)
// Wow: none of its own (c05 is the explainer chunk; the hook and c03 carry the big ones). Accents: the noon chime (N.01), NEED (N.18),
// the strikes are small. Seams: in ← c04 K.12 (B1: the phone portal; N.01 starts on the street at noon, any carrier works);
// out → c06 G.01 (iris out of the HUD counter).
// Anchors: row ids + phrases (T.G after a row), never seconds. Facts: the allowance comes from "the company" (no names), no amounts.
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import * as PL from '../lib/f79_places.mjs';
import * as B from '../lib/f79_b2.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM, AMBER, sineIO, quartIO, expoOut, expoIn } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const { T: TX, SER, arrow, strike, struckWord, stamp, REST, SUB, PALE } = B;
// a 2D drift for explainer stages (nothing ever stands still): scale z around (cx, cy) + a slow float
const float2 = (c, t, z = 1, cx = W / 2, cy = H / 2) => { const dx = K.drift(t * .5, 6, 3.3), dy = K.drift(t * .5, 4, 8.1); c.translate(cx + dx, cy + dy); c.scale(z, z); c.translate(-cx, -cy); };
function employer(c, x, y, s, a = 1, col = '#2a3470') { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.fillStyle = col; c.fillRect(-90, -120, 180, 120); c.fillRect(30, -170, 34, 60);
  c.fillStyle = rgba('#e8eefc', .45); for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) c.fillRect(-72 + k * 40, -104 + r * 34, 22, 18); c.restore(); }
function government(c, x, y, s, a = 1, o = {}) { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s);
  if (o.ink) { K.ink(c, o.ink, 3); c.beginPath(); c.moveTo(-110, -110); c.lineTo(0, -170); c.lineTo(110, -110); c.closePath(); c.stroke(); c.strokeRect(-110, -110, 220, 14); c.strokeRect(-120, -12, 240, 14); for (let k = 0; k < 5; k++) c.strokeRect(-88 + k * 42, -94, 14, 82); c.restore(); return; }
  c.fillStyle = '#2a3470'; c.beginPath(); c.moveTo(-110, -110); c.lineTo(0, -170); c.lineTo(110, -110); c.fill();
  c.fillStyle = '#1a2054'; c.fillRect(-110, -110, 220, 14); c.fillRect(-120, -12, 240, 14); c.fillStyle = rgba('#e8eefc', .5); for (let k = 0; k < 5; k++) c.fillRect(-88 + k * 42, -94, 14, 82); c.restore(); }
// a table from the side and your chair (seat 1 = at the table, 0 = slid away); a
function tableSeat(c, x, y, seat, a = 1, o = {}) {
  if (a <= 0) return; c.save(); c.globalAlpha *= a; c.fillStyle = o.col || '#3a4480'; c.fillRect(x - 140, y - 62, 280, 12); c.fillRect(x - 124, y - 50, 10, 50); c.fillRect(x + 114, y - 50, 10, 50);
  const cx = x - 180 - (1 - seat) * 150, rot = (1 - seat) * -.25; c.translate(cx, y); c.rotate(rot); c.fillStyle = mixHex(AMBER.body, '#3a4480', 1 - seat * .8);
  c.fillRect(-28, -42, 56, 8); c.fillRect(-28, -104, 8, 104); c.fillRect(20, -42, 8, 42); c.restore(); }
// the open padlock / closed padlock (cream body, dark shackle)
function padlock(c, x, y, s, o = {}) { c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = o.shackle || '#9aa2c8'; c.lineWidth = 7; c.beginPath(); c.arc(0, -16, 16, Math.PI, 0); c.lineTo(16, 0); c.moveTo(-16, -16); c.lineTo(-16, 0); c.stroke();
  c.fillStyle = o.body || '#d8d4e4'; c.beginPath(); c.roundRect(-24, -4, 48, 40, 7); c.fill(); c.fillStyle = '#1a1f48'; c.beginPath(); c.arc(0, 12, 5, 0, 7); c.fill(); c.fillRect(-2, 12, 4, 12); c.restore(); }

export default function c05(T, R) {
  const RT = (id) => R[id];
  const G = (ph, after, nth = 0) => T.G(ph, nth, after - .05);   // a word after a row (phrases repeat in this chunk: "work", "taxes", "allowance")
  // ---------------------------------------------------------------- N.01–N.02 · THE STREET AT NOON: every window chimes at once
  const camN01 = (t, s) => camK(t, [[s.a - 1.2, cam3({ z: -640, y: -150, x: 40 })], [s.b + 1.4, cam3({ z: -300, y: -95, x: 10 })]], .5);
  const N01 = {
    id: 'N.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camN01(t, s), t2 = s.r('N.02');
      const out = S.street(ctx, t, c, L, { lamps: true });
      const wins = B.streetWindows(out);
      B.chimes(ctx, t, c, wins, () => span(t, s.a - .03, s.a + .07) * (1 - .3 * span(t, t2 + 1.2, s.b + .6)),
        (w, i) => { const d = t2 + (1 - w[3]) * 1.0 + (i % 3) * .05; return span(t, d, d + 1.2); });
      K.caps(ctx, 'EVERY HOUSE · THE SAME SECOND', 1130, 250, K.cardU(t, t2 + .2, s.b + .3) * (t < s.b ? 1 : 0), { size: 24, col: '#ffd6de' });
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camN01(t, s), 4200, 1394, 520); return [p[0], p[1], 56]; }, lead: .7, dur: 2.5, pushA: .15, rim: '#ffd6de' },
  };
  // ---------------------------------------------------------------- N.03 · the phone at noon: the notification lifts off the phone
  const camN03 = (t, s) => camK(t, [[s.a - 1.1, cam3({ z: -180, y: -40, x: -40 })], [s.a + 1.6, aim(1500, 1180, 940, 1.45, W * .6, H * .66), 's'], [s.b + 1, aim(1500, 1180, 940, 1.52, W * .6, H * .64)]], .5);
  const N03ban = (t, s) => { const tm = s.w('message'), u = expoOut(span(t, tm + .05, tm + .9)), p = project(camN03(t, s), 1500, 1180, 930);
    return { u, x: lerp(p[0] - 40, W / 2 - 400, u), y: lerp(p[1] - 30, 250, u), w: lerp(90, 800, u), h: lerp(30, 150, u) }; };
  const N03 = {
    id: 'N.03',
    draw(ctx, t, s) {
      const L = look(R, t), c = camN03(t, s), tm = s.w('message');
      PL.phoneNoon(ctx, t, c, L, { u: span(t, tm - .5, tm + .2), chime: 1 - .45 * span(t, s.a, s.b) });
      const b = N03ban(t, s);
      if (b.u > 0) K.scr(ctx, (g) => {
        g.globalAlpha = clamp(b.u * 3); g.fillStyle = rgba('#060a24', .35); g.beginPath(); g.roundRect(b.x + 8, b.y + 14, b.w, b.h, 24); g.fill();
        g.fillStyle = '#f4f0f8'; g.beginPath(); g.roundRect(b.x, b.y, b.w, b.h, 24 * b.u + 4); g.fill();
        if (b.u > .6) { const a = span(b.u, .6, 1); g.globalAlpha = a; g.fillStyle = CARM.body; g.beginPath(); g.arc(b.x + 62, b.y + 58, 16, 0, 7); g.fill();
          g.fillStyle = '#3a3a5a'; g.font = '600 22px Inter'; g.letterSpacing = '0.12em'; g.fillText('12:00 · EVERY PHONE ON THE STREET', b.x + 100, b.y + 52); g.letterSpacing = '0em';
          g.fillStyle = '#14163a'; g.font = '600 36px Inter'; g.fillText('Your monthly allowance has arrived.', b.x + 100, b.y + 104); }
      });
    },
    out: { k: 'iris', c: (t, s) => { const b = N03ban(t, s); return [b.x + 62, b.y + 58, 16]; }, lead: .35, dur: 1.0, rim: '#ffd6de' },
  };
  // ---------------------------------------------------------------- N.04–N.07 · EXPL the allowance: the company, the step, WHY?, a human costs extra
  const ring0 = [960, 250], HX = (i) => 420 + i * 180, HY = 770, YOU = 2;
  const N04 = {
    id: 'N.04',
    draw(ctx, t, s) {
      const t5 = s.r('N.05'), t6 = s.r('N.06'), t7 = s.r('N.07'), tc = s.w('company'), tg = G('government', s.a), tl = G('lower', t5), th = G('human', t7), tx = G('extra', t7);
      const p2 = quartIO(span(t, t5 - .1, t5 + 1.1)), p3 = expoOut(span(t, t6 - .15, t6 + .6)), p4 = quartIO(span(t, t7 - .1, t7 + .9));
      K.dusk(ctx, t, { glow: [lerp(960, 1300, p2), 470] });
      K.scr(ctx, (c) => {
        float2(c, t, 1 + .025 * sineIO(span(t, s.a - .5, s.b + .5)));
        // the company ring (moves to the top left as the months take over)
        const rx = lerp(ring0[0], 300, p2), ry = lerp(ring0[1], 300, p2), rr = lerp(58, 44, p2);
        K.ring(c, t, rx, ry, rr * expoOut(span(t, s.a - .6, s.a + .3)), 1);
        TX(c, 'THE COMPANY', rx + 90, ry - 6, { size: 30, a: span(t, tc - .1, tc + .4) });
        TX(c, 'ITS MACHINES DO EVERYTHING', rx + 90, ry + 30, { size: 20, col: SUB, a: span(t, tc + .3, tc + .8) * (1 - p2) });
        TX(c, 'SETS THE AMOUNT BY ALGORITHM', rx + 90, ry + 30, { size: 20, col: SUB, a: span(t, G('algorithm', t5) - .1, G('algorithm', t5) + .4) });
        // the houses and their thin lines (each from the ring); all but yours fall away for the months
        for (let i = 0; i < 7; i++) {
          const mine = i === YOU, d = Math.abs(i - 3), u = span(t, tc - .2 + d * .08, tc + .5 + d * .08), drop = mine ? 0 : expoIn(span(t, t5 - .1 + d * .04, t5 + .6 + d * .04));
          let hx = HX(i), hy = HY + 260 * drop; if (mine) { hx = lerp(hx, 1640, p2); hy = lerp(HY, 600, p2); }
          const ha = span(t, s.a - .4 + d * .05, s.a + .2 + d * .05) * (1 - drop);
          if (ha <= 0) continue;
          if (!mine || p2 < .02) B.arrow(c, [rx, ry + rr], [hx, hy - 130], -40 + (hx - rx) * .05, u * (1 - drop) * (1 - p2), { col: CARM.hot, w: 2.5, head: false, under: true });
          B.houseIcon(c, hx, hy, 1.3, { a: ha, door: mine ? 'you' : null, lit: mine ? .2 : 0 });
          if (mine) TX(c, 'YOU', hx, hy + 44, { align: 'center', size: 22, a: ha * span(t, tc + .4, tc + .9) * (1 - p3 * .7) });
        }
        // the government, pale: no line comes from it
        const ga = span(t, tg - .3, tg + .3) * (1 - expoIn(span(t, t5 - .1, t5 + .5)));
        government(c, 1650, 560, .9, ga * .55, { ink: rgba(PALE, .8) });
        TX(c, 'NOT THE GOVERNMENT', 1650, 610, { align: 'center', size: 22, col: SUB, a: ga });
        // N.05: your line becomes the months: flat, then this month a little lower (no amounts)
        if (p2 > 0) {
          const lv = [.75, .75, .75, .75, .75, lerp(.75, .5, quartIO(span(t, tl - .1, tl + .6)))], x0 = 380, x1 = 1500, yT = 330, yB = 640;
          const su = span(t, t5 + .2, t5 + 1.6), st = B.stepLine(c, x0, x1, yT, yB, lv, su, { col: CARM.hot, w: 4 });
          c.save(); c.globalAlpha = .22 * su * (1 - p3 * .5); c.fillStyle = REST; c.beginPath(); c.moveTo(x0, yB + 20); st.pts.forEach((q) => c.lineTo(...q)); c.lineTo(x1, yB + 20); c.closePath(); c.fill(); c.restore();
          arrow(c, [rx + rr * .7, ry + rr * .7], [x0, st.pts[0][1]], 10, span(t, t5 + .1, t5 + .5), { col: CARM.hot, w: 2.5, head: false, dash: [5, 9], dashOff: -t * 30 });
          const ma = span(t, t5 + .5, t5 + 1.2) * (1 - p3 * .6);
          ['JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV'].forEach((m, i) => TX(c, m, x0 + (i + .5) * st.dx, 700, { align: 'center', size: 22, col: i === 5 ? P.cream : SUB, a: ma }));
          const ly = st.pts[11][1], lx = (st.pts[10][0] + st.pts[11][0]) / 2;
          TX(c, 'THIS MONTH · A LITTLE LOWER', lx + 40, ly + 52, { align: 'right', size: 22, a: span(t, tl + .2, tl + .7) * (1 - p3) });
          arrow(c, [st.pts[11][0], ly], [1640, 600 - 130], -10, span(t, t5 + 1.3, t5 + 1.7), { col: CARM.hot, w: 2.5, head: false });
          // N.06–N.07: the notification card unfolds out of the step: WHY? (empty) · TALK TO A HUMAN (locked) · EXTRA FEE
          if (p3 > 0) {
            const cw = lerp(40, 820, p3), chh = lerp(20, lerp(330, 520, p4), p3), cx = lerp(lx, 960, p3) - cw / 2, cy = lerp(ly, 230, p3);
            c.fillStyle = rgba('#060a24', .45); c.beginPath(); c.roundRect(cx + 10, cy + 16, cw, chh, 26); c.fill();
            c.fillStyle = '#f4f0f8'; c.beginPath(); c.roundRect(cx, cy, cw, chh, 26); c.fill();
            if (p3 > .7) {
              c.save(); c.globalAlpha = span(p3, .7, 1); c.beginPath(); c.roundRect(cx, cy, cw, chh, 26); c.clip();
              c.fillStyle = CARM.body; c.beginPath(); c.arc(cx + 56, cy + 54, 14, 0, 7); c.fill();
              c.fillStyle = '#3a3a5a'; c.font = '600 22px Inter'; c.letterSpacing = '0.12em'; c.fillText('YOUR ALLOWANCE · NOVEMBER', cx + 90, cy + 62); c.letterSpacing = '0em';
              c.fillStyle = '#14163a'; c.font = '64px "Instrument Serif"'; c.fillText('Why?', cx + 50, cy + 160);
              c.fillStyle = '#e2deec'; c.beginPath(); c.roundRect(cx + 50, cy + 192, cw - 100, 90, 12); c.fill();
              c.fillStyle = '#8a88a6'; c.font = '600 22px Inter'; c.letterSpacing = '0.12em'; c.fillText('REASON', cx + 70, cy + 226); c.letterSpacing = '0em';
              if (Math.floor(t * 2.2) % 2 === 0) { c.fillStyle = '#14163a'; c.fillRect(cx + 72, cy + 240, 3, 30); }   // the caret blinks in an empty field
              if (p4 > 0) {   // the button below, locked; the fee tag pins itself on "extra"
                const by = cy + 320, ba = span(p4, .3, 1);
                c.globalAlpha = ba; c.fillStyle = '#1a1f48'; c.beginPath(); c.roundRect(cx + 50, by, cw - 100, 96, 48); c.fill();
                c.fillStyle = '#f4f0f8'; c.font = '600 30px Inter'; c.letterSpacing = '0.06em'; c.fillText('TALK TO A HUMAN', cx + 150, by + 60); c.letterSpacing = '0em';
                padlock(c, cx + 100, by + 40, .9 + .1 * expoOut(span(t, th, th + .4)), { body: '#d8d4e4' });
                c.globalAlpha = 1;
              }
              c.restore();
              if (p4 > 0) { const fu = span(t, tx - .1, tx + .35), fx = cx + cw - 70, fy = cy + 360;
                if (fu > 0) { c.save(); c.translate(fx, fy); c.rotate(.08 - .1 * (1 - expoOut(fu))); c.scale(lerp(1.4, 1, expoOut(fu)), lerp(1.4, 1, expoOut(fu))); c.globalAlpha = clamp(fu * 3);
                  c.fillStyle = CARM.body; c.beginPath(); c.roundRect(-110, -30, 220, 60, 10); c.fill(); c.fillStyle = '#fff4f6'; c.font = '700 26px Inter'; c.textAlign = 'center'; c.letterSpacing = '0.1em'; c.fillText('EXTRA FEE', 4, 10); c.restore(); } }
            }
          }
        }
      });
    },
    out: { k: 'iris', c: [960 - 410 + 100, 230 + 320 + 40, 28], lead: .35, dur: 1.1, rim: '#f4f0f8' },
  };
  // ---------------------------------------------------------------- N.08–N.10 · WAGE ✗ RIGHT ✗ · the owner's dividend · the child's allowance (and you in its place)
  const N08 = {
    id: 'N.08',
    draw(ctx, t, s) {
      const t9 = s.r('N.09'), t10 = s.r('N.10'), tw = s.w('wage'), tr = G('right', s.a), td = G('dividend', t9), ta = G('allowance', t10);
      const hd = quartIO(span(t, t9 - .2, t9 + .8)), pan = lerp(0, 180, quartIO(span(t, t9 - .2, t9 + .9))) - 360 * quartIO(span(t, t10 - .25, t10 + 1.0));
      K.dusk(ctx, t, { glow: [960 + pan, 520] });
      K.scr(ctx, (c) => {
        float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b)));
        // the header words (big on N.08, then a row on top)
        const wy = lerp(380, 170, hd), ws = lerp(130, 60, hd);
        struckWord(c, 'WAGE', lerp(700, 760, hd), wy, ws, span(t, s.a - .3, s.a + .3), span(t, tw + .15, tw + .45), { align: 'center' });
        struckWord(c, 'RIGHT', lerp(1220, 1160, hd), wy, ws, span(t, tr - .5, tr + .1), span(t, tr + .15, tr + .45), { align: 'center' });
        c.translate(pan, 0);
        // N.08: what it IS: a thin dotted line from above to you
        const a8 = 1 - span(t, t9 - .2, t9 + .4);
        if (a8 > 0) { c.save(); c.globalAlpha = a8; arrow(c, [960, 470], [960, 610], 0, span(t, s.a + .2, s.a + 1), { col: CARM.hot, w: 3, dash: [4, 10], dashOff: -t * 30, head: false }); K.you(c, t, 960, 830, 200, { dir: 1, look: -.4 }); c.restore(); }
        // N.09: OWNER: a slice of the machine's ring is his; a thick share flows TO him
        const a9 = span(t, t9 - .3, t9 + .3);
        if (a9 > 0) { c.save(); c.globalAlpha = a9; const ox = 720, oy = 800, rx = 420, ry = 380;
          K.ring(c, t, rx, ry, 52, 1); c.strokeStyle = CARM.hot; c.lineWidth = 14; c.beginPath(); c.arc(rx, ry, 92, -1.9, -1.9 + 1.4 * expoOut(span(t, t9, t9 + .6))); c.stroke();
          arrow(c, [rx + 70, ry + 60], [ox - 30, oy - 250], 40, span(t, td - .4, td + .3), { col: CARM.hot, w: 10, under: true, hs: 28 });
          for (let k = 0; k < 4; k++) { const q = ((t * .6 + k / 4) % 1); if (span(t, td, td + .3) <= 0) break; const p = B.along([rx + 70, ry + 60], [ox - 30, oy - 250], 40, q); c.fillStyle = rgba(CARM.core, .9 * Math.sin(Math.PI * q)); c.beginPath(); c.arc(p[0], p[1], 7, 0, 7); c.fill(); }
          K.folk(c, t, 1, ox, oy, 270, { dir: 1, look: -.5 });
          TX(c, 'OWNER', ox + 120, oy - 200, { size: 30, a: span(t, t9, t9 + .4) }); TX(c, 'DIVIDEND · A SHARE', ox + 120, oy - 164, { size: 22, col: SUB, a: span(t, td, td + .4) });
          c.restore(); }
        // N.10: CHILD: an adult hands a small line down; then the child is you
        const a10 = span(t, t10 - .4, t10 + .2);
        if (a10 > 0) { c.save(); c.globalAlpha = a10; const ax = 1290, cx = 1470, by = 800, sw = quartIO(span(t, ta + .9, ta + 1.5));
          K.folk(c, t, 3, ax, by, 290, { dir: 1, look: .5, armR: [1.2, 1.9] });
          arrow(c, [ax + 70, by - 150], [cx - 20, by - 120], 30, span(t, ta - .3, ta + .2), { col: rgba(CARM.hot, .9), w: 3, dash: [4, 9], dashOff: -t * 24, hs: 14 });
          c.save(); c.translate(cx, by); c.scale(Math.max(.02, Math.abs(1 - 2 * sw)), 1); if (sw < .5) S.boy(c, t, 0, 0, 160, { dir: -1, look: -.6 }); else K.you(c, t, 0, 0, 160, { dir: -1, look: -.5 }); c.restore();
          TX(c, 'CHILD', cx + 70, by - 130, { size: 30, a: span(t, t10, t10 + .4) * (1 - sw) }); TX(c, 'YOU', cx + 70, by - 130, { size: 30, a: sw });
          TX(c, 'ALLOWANCE', cx + 70, by - 94, { size: 22, col: SUB, a: span(t, ta, ta + .4) });
          c.restore(); }
      });
    },
    out: { k: 'iris', c: (t, s) => [1470 - 180, 720, 70], lead: .3, dur: 1.1, rim: '#ffe7a8' },
  };
  // ---------------------------------------------------------------- N.11–N.22 · EXPL the need mechanism (then → now), one beat per sentence
  const YO = [430, 800], EMP = [1500, 380], GOV = [1500, 720], TAB = [900, 800], RN = [960, 520], R0 = [960, 270];
  const N11 = {
    id: 'N.11',
    draw(ctx, t, s) {
      const r = (id) => s.r(id), t12 = r('N.12'), t13 = r('N.13'), t14 = r('N.14'), t15 = r('N.15'), t16 = r('N.16'), t17 = r('N.17'), t18 = r('N.18'), t19 = r('N.19'), t20 = r('N.20'), t21 = r('N.21'), t22 = r('N.22');
      const wW = G('work', t15), wT = G('taxes', t15), nW = G('work', t19), nT = G('taxes', t19), tV = G('vote', t20);
      const then = span(t, t14 - .3, t14 + .6) * (1 - span(t, t19 - .3, t19 + .3)), now = span(t, t19 - .3, t19 + .5);
      K.dusk(ctx, t, { glow: [lerp(820, 1100, now), 540] });
      K.scr(ctx, (c) => {
        float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b)) + .03 * then, YO[0] + 300, YO[1] - 200);
        // header tag of the phase
        TX(c, 'BACK THEN', W / 2, 190, { align: 'center', size: 26, col: '#ffe7a8', spacing: .24, a: then });
        TX(c, 'NOW', W / 2, 190, { align: 'center', size: 26, col: '#ffd6de', spacing: .24, a: now * (1 - span(t, t21 - .2, t21 + .2)) + span(t, t22 - .1, t22 + .3) * 0 });
        // the machine ring: FIRST (N.11); leaves for BACK THEN, comes back NOW in the middle
        const out1 = quartIO(span(t, t14 - .3, t14 + .7)), back = quartIO(span(t, t19 - .3, t19 + .8));
        const rx = back > 0 ? lerp(R0[0], RN[0], back) : R0[0], ry = back > 0 ? lerp(-160, RN[1], back) : lerp(R0[1], -160, out1);
        K.ring(c, t, rx, ry, 60 * expoOut(span(t, s.a - .5, s.a + .4)), 1);
        const fs = span(t, s.a + .3, s.a + .8) * (1 - out1);
        TX(c, 'FIRST', rx + 100, ry + 10, { size: 30, a: fs }); TX(c, 'SECOND', YO[0] + 110, YO[1] - 200, { size: 30, a: fs });
        // you (the subject of every beat)
        K.you(c, t, YO[0], YO[1], 270, { dir: 1, look: now > .5 ? -.5 : (then > .5 ? .3 : -.6), back: 0 });
        // N.12–N.13: the ballot box stays empty, then drops away
        const bb = span(t, t12 - .3, t12 + .3), bd = expoIn(span(t, t13 + .1, t13 + .9));
        if (bb > 0 && bd < 1) { c.save(); c.globalAlpha = bb * (1 - bd); c.translate(960, 640 + 300 * bd); K.ink(c, rgba('#e8eefc', .85), 3); c.strokeRect(-110, -80, 220, 160); c.fillStyle = rgba('#e8eefc', .05); c.fillRect(-110, -80, 220, 160);
          c.fillStyle = rgba('#e8eefc', .85); c.fillRect(-60, -86, 120, 10); const hov = 4 * Math.sin(t * 2.2);
          c.fillStyle = K.PAPER.lit; c.save(); c.translate(0, -150 + hov); c.rotate(-.05); c.fillRect(-46, -34, 92, 60); c.fillStyle = rgba(K.PAPER.ink, .6); c.fillRect(-30, -16, 50, 4); c.fillRect(-30, -2, 36, 4); c.strokeStyle = K.PAPER.ink; c.lineWidth = 3; c.strokeRect(14, 4, 16, 14); c.restore();
          TX(c, 'NOBODY VOTED', 0, 130, { align: 'center', size: 22, col: SUB }); c.restore(); }
        // BACK THEN: employer + government; your WORK and TAXES (amber), they come back as YOUR SEAT AT THE TABLE
        const ea = Math.max(span(t, t15 - .3, t15 + .3), now);
        employer(c, EMP[0], EMP[1], 1, ea); government(c, GOV[0], GOV[1], .9, ea);
        TX(c, 'EMPLOYER', EMP[0], EMP[1] + 40, { align: 'center', a: ea }); TX(c, 'GOVERNMENT', GOV[0], GOV[1] + 40, { align: 'center', a: ea });
        const dark = span(t, nW - .2, nT + .6), yc = mixHex(AMBER.body, '#3a4078', dark), live = 1 - .75 * dark;
        const hand = [YO[0] + 60, YO[1] - 190];
        arrow(c, hand, [EMP[0] - 120, EMP[1] - 60], 140, span(t, wW - .35, wW + .35), { col: yc, w: 5, under: dark < .5, a: live });
        arrow(c, [hand[0], hand[1] + 40], [GOV[0] - 140, GOV[1] - 50], 30, span(t, wT - .35, wT + .35), { col: yc, w: 5, under: dark < .5, a: live * (1 - span(t, tV - .5, tV - .1)) });
        TX(c, 'WORK', 880, 330, { a: span(t, wW - .1, wW + .3) * (1 - dark), col: AMBER.core, size: 30 }); TX(c, 'TAXES', 980, 600, { a: span(t, wT - .1, wT + .3) * (1 - dark), col: AMBER.core, size: 30 });
        // the return: dashed lines to the table + your seat
        const ret = span(t, t16 - .3, t16 + .6), slide = quartIO(span(t, t22 + .2, t22 + 1.2));
        arrow(c, [EMP[0] - 40, EMP[1] + 70], [TAB[0] + 100, TAB[1] - 90], -60, ret * (1 - now), { col: rgba(P.cream, .75), w: 2.5, dash: [8, 10] });
        arrow(c, [GOV[0] - 80, GOV[1] + 40], [TAB[0] + 150, TAB[1] - 70], -10, ret * (1 - now), { col: rgba(P.cream, .75), w: 2.5, dash: [8, 10] });
        tableSeat(c, TAB[0], TAB[1], 1 - slide, span(t, t16 - .2, t16 + .4));
        TX(c, 'YOUR SEAT AT THE TABLE', TAB[0], TAB[1] + 46, { align: 'center', size: 22, a: span(t, t16 + .2, t16 + .7) * (1 - now) });
        // N.17 KINDNESS struck · N.18 NEED stamped
        const ka = span(t, t17 - .3, t17 + .1) * (1 - span(t, t19 - .4, t19));
        const kd = expoIn(span(t, t18 - .05, t18 + .35)); if (kd < 1) { c.save(); c.translate(0, 120 * kd); c.globalAlpha = 1 - kd; struckWord(c, 'KINDNESS', 900, 560, 50, ka, span(t, t17 + .25, t17 + .5), { align: 'center' }); c.restore(); }
        if (t > t18 - .1 && t < t19 + .2) stamp(c, 'NEED', 900, 545, span(t, t18 - .02, t18 + .4) * (1 - span(t, t19 - .2, t19 + .2)), { size: 58, col: AMBER.body });
        // NOW: the ring takes WORK and TAXES
        if (now > 0) {
          arrow(c, [RN[0] + 60, RN[1] - 40], [EMP[0] - 120, EMP[1] - 20], 70, span(t, nW - .3, nW + .4), { col: CARM.hot, w: 5, under: true });
          arrow(c, [RN[0] + 60, RN[1] + 40], [GOV[0] - 140, GOV[1] - 40], -30, span(t, nT - .3, nT + .4), { col: CARM.hot, w: 5, under: true });
          TX(c, 'WORK', 1170, 380, { a: span(t, nW, nW + .4), size: 30 }); TX(c, 'TAXES', 1160, 690, { a: span(t, nT, nT + .4), size: 30 });
        }
        // N.20: one thin VOTE line stays (you → government)
        const va = span(t, tV - .3, tV + .3);
        if (va > 0) { arrow(c, [hand[0], hand[1] + 50], [GOV[0] - 140, GOV[1] - 30], 0, va, { col: AMBER.body, w: 2, head: false }); TX(c, 'VOTE', 640, 640, { size: 24, col: AMBER.core, a: va }); }
        // N.21: in your old life they lived off you: the old lines come back as pale ink
        const gh = span(t, t21 - .1, t21 + .5) * (1 - span(t, t22 - .2, t22 + .2));
        if (gh > 0) { arrow(c, hand, [EMP[0] - 120, EMP[1] - 60], 140, 1, { col: PALE, w: 3, dash: [3, 8], a: gh }); arrow(c, [hand[0], hand[1] + 40], [GOV[0] - 140, GOV[1] - 50], 30, 1, { col: PALE, w: 3, dash: [3, 8], a: gh });
          TX(c, 'THEY LIVED OFF YOU', W / 2, 190, { align: 'center', size: 26, col: PALE, spacing: .2, a: gh }); }
        // N.22: here you live off them: the dotted ALLOWANCE line feeds you from the ring; the chair slides away
        const fa = span(t, t22 - .2, t22 + .5);
        if (fa > 0) { arrow(c, [RN[0] - 50, RN[1] + 40], [YO[0] + 70, YO[1] - 240], -60, fa, { col: CARM.hot, w: 3, dash: [4, 10], dashOff: -t * 34, hs: 16 });
          TX(c, 'ALLOWANCE', 690, 470, { size: 24, a: fa }); TX(c, 'YOU LIVE OFF THEM', W / 2, 190, { align: 'center', size: 26, col: '#ffd6de', spacing: .2, a: fa }); }
      });
    },
    out: { k: 'fn', fn: B.maskGrow([TAB[0] - 150, TAB[1] - 70, 300, 80], { r: 6 }), lead: .35, dur: 1.1 },
  };
  // ---------------------------------------------------------------- N.23 · MIX the long table: the ring writes the menu, you without a pen
  const camN23 = (t) => camK(t, [[RT('N.23') - 1.2, cam3({ z: -160, x: -140, y: 10 })], [RT('N.24') + 1, cam3({ z: 120, x: 160, y: -20 })]], .5);
  let menuRect = [1460, 420, 230, 300];
  const N23 = {
    id: 'N.23',
    draw(ctx, t, s) {
      const c = camN23(t), tm = s.w('menu');
      K.stage(ctx, c, [
        [12000, () => { ctx.fillStyle = K.lin(ctx, 0, -600, 0, 1600, [[0, '#060a24'], [.6, '#0b1238'], [1, '#121a4c']]); ctx.fillRect(-4000, -3000, W + 8000, H + 6000); K.carmGlow(ctx, 1500, 300, 1400, .1); }],
        [5000, () => { ctx.fillStyle = '#0d1440'; ctx.fillRect(-1400, 120, W + 2800, 660); ctx.fillStyle = rgba('#e8eefc', .05); for (let x = -1400; x < W + 1400; x += 220) ctx.fillRect(x, 120, 3, 660); }],
        [2600, () => {   // the long table, plates down its length
          ctx.fillStyle = K.lin(ctx, 0, 720, 0, 760, [[0, '#4a4680'], [1, '#2a2a5a']]); ctx.fillRect(140, 720, 1560, 26); ctx.fillStyle = '#1c1c44'; for (const x of [200, 900, 1620]) ctx.fillRect(x, 746, 16, 200);
          for (let i = 0; i < 6; i++) { const x = 330 + i * 200; ctx.fillStyle = rgba('#e8eefc', .5); ctx.beginPath(); ctx.ellipse(x, 718, 48, 9, 0, 0, 7); ctx.fill(); }
        }],
        [1700, () => {
          K.you(ctx, t, 180, 960, 380, { dir: 1, look: .2 + .05 * Math.sin(t * .5), armR: [.15, .1], armL: [-.15, -.1] });
          // the ring at the far end writes the menu card with a thin beam
          const rx = 1640, ry = 300; K.ring(ctx, t, rx, ry, 46, 1);
          const [mx, my, mw, mh] = [1460, 420, 230, 300]; menuRect = [mx, my, mw, mh];
          ctx.fillStyle = rgba('#060a24', .4); ctx.fillRect(mx + 8, my + 12, mw, mh); ctx.fillStyle = K.PAPER.lit; ctx.fillRect(mx, my, mw, mh);
          ctx.fillStyle = K.PAPER.ink; ctx.font = '600 26px Inter'; ctx.letterSpacing = '0.2em'; ctx.textAlign = 'center'; ctx.fillText('MENU', mx + mw / 2, my + 50); ctx.letterSpacing = '0em'; ctx.textAlign = 'left';
          const wr = span(t, s.a - .2, s.b - .2), n = 7; let px = mx + 30, py = my + 90;
          for (let k = 0; k < n; k++) { const u = clamp(wr * n - k); if (u <= 0) break; const yy = my + 90 + k * 28, len = (mw - 60) * (.5 + .4 * ((k * 37) % 10) / 10);
            ctx.strokeStyle = CARM.body; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx + 30, yy); for (let q = 0; q <= 20 * u; q++) ctx.lineTo(mx + 30 + len * q / 20, yy + 3 * Math.sin(q * 1.7 + k)); ctx.stroke(); px = mx + 30 + len * u; py = yy; }
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(CARM.hot, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx - 20, ry + 30); ctx.lineTo(px, py); ctx.stroke(); ctx.restore();
          ctx.fillStyle = CARM.core; ctx.beginPath(); ctx.arc(px, py, 4, 0, 7); ctx.fill();
        }],
              ]);
      K.caps(ctx, 'NO PEN AT YOUR END', 420, 300, K.cardU(t, tm - .2, s.b + .2) * (t < s.b ? 1 : 0), { size: 24, col: '#ffe7a8' });
    },
    out: { k: 'fn', fn: B.maskGrow((t) => { const c = camN23(t), a = project(c, 1700, menuRect[0], menuRect[1]), b = project(c, 1700, menuRect[0] + menuRect[2], menuRect[1] + menuRect[3]); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, { r: 2, rim: '#fbf5e4' }), lead: .45, dur: 1.6 },
  };
  // ---------------------------------------------------------------- N.24–N.26 (+C1) · paper card: the computer scientist, his team, the plate; WARNING vs FORECAST
  const CARD = [440, 180, 1040, 620];
  const N24 = {
    id: 'N.24',
    draw(ctx, t, s) {
      const t25 = s.r('N.25'), clip = T.clip('C1'), cs = clip.start, ce = clip.end, t26 = s.r('N.26'), tw = G('warning', t26), tf = G('forecast', t26);
      const u = clamp(span(t, s.a - .5, s.a + .4) - span(t, t26 - .6, t26 - .1));
      K.dusk(ctx, t, { warm: true, glow: [960, 480] });
      if (u > 0) K.scr(ctx, (c) => { float2(c, t, 1 + .015 * sineIO(span(t, s.a, ce)));
        K.paper(c, t, ...CARD, u, { from: [960, 540], head: 'BACK IN THE TWENTIES', draw: (g, x, y, w, h) => {
          const team = quartIO(span(t, t25 - .2, t25 + .9));
          // N.24 the computer scientist at his desk, a warning sign above him
          const fx = lerp(x + w * .3, x + w * .5, team), fy = lerp(y + h * .86, y + h * .42, team), fh = lerp(h * .62, h * .3, team);
          if (team < 1) { g.save(); g.globalAlpha = 1 - team; K.ink(g, K.PAPER.ink2, 3); g.strokeRect(x + w * .38, y + h * .62, w * .3, 10); g.beginPath(); g.moveTo(x + w * .42, y + h * .62); g.lineTo(x + w * .44, y + h * .42); g.lineTo(x + w * .58, y + h * .42); g.lineTo(x + w * .56, y + h * .62); g.stroke(); g.restore(); }
          B.inkFig(g, fx, fy, fh, { dir: 1, look: .2, armR: team > .5 ? undefined : [1.1, 1.7] });
          const wu = span(t, s.a + .5, s.a + 1.1); if (wu > 0) { const tx = lerp(x + w * .3, x + w * .5, team) + w * .02, ty = lerp(y + h * .1, y + h * .02, team); g.save(); g.globalAlpha = wu; g.translate(tx, ty + 40); g.scale(lerp(1, .7, team), lerp(1, .7, team));
            g.strokeStyle = K.PAPER.red; g.lineWidth = 4; g.lineJoin = 'round'; g.beginPath(); g.moveTo(0, -36); g.lineTo(36, 28); g.lineTo(-36, 28); g.closePath(); g.stroke(); g.fillStyle = K.PAPER.red; g.fillRect(-3, -14, 6, 24); g.fillRect(-3, 16, 6, 6); g.restore(); }
          g.fillStyle = K.PAPER.ink; g.font = '600 30px Inter'; g.textAlign = 'left';
          g.globalAlpha = 1 - team; g.fillText('A COMPUTER SCIENTIST', x + w * .58, y + h * .5); g.font = '500 24px Inter'; g.fillStyle = K.PAPER.ink2; g.fillText('WARNED OF EXACTLY THIS', x + w * .58, y + h * .5 + 40);
          // N.25 his team at an AI company
          if (team > 0) { g.globalAlpha = team; K.ink(g, K.PAPER.ink2, 3); g.beginPath(); g.roundRect(x + w * .08, y + h * .06, w * .84, h * .9, 14); g.stroke();
            g.fillStyle = K.PAPER.ink2; g.font = '600 22px Inter'; g.textAlign = 'left'; g.letterSpacing = '0.16em'; g.fillText('AN AI COMPANY', x + w * .11, y + h * .14); g.letterSpacing = '0em';
            for (let k = 0; k < 4; k++) { const mx = x + w * (.26 + k * .16), my = y + h * .86, d = span(t, t25 + .2 + k * .1, t25 + .6 + k * .1); if (d <= 0) continue; g.globalAlpha = team * d;
              K.ink(g, K.PAPER.ink2, 2.5); g.beginPath(); g.moveTo(fx, y + h * .46); g.lineTo(mx, my - h * .22); g.stroke(); B.inkFig(g, mx, my, h * .22, { dir: k < 2 ? 1 : -1, look: .4 }); }
            g.globalAlpha = team; g.fillStyle = K.PAPER.ink; g.font = '600 26px Inter'; g.textAlign = 'center'; g.fillText('HE LED A TEAM HERE', fx, y + h * .52 + 30); g.textAlign = 'left'; }
          g.globalAlpha = 1;
        } }); });
      // the plate grows out of the card and folds back into it
      const m = clamp(span(t, cs - .7, cs + .25) - span(t, ce - .5, ce + .9));
      if (m > 0) B.plate(ctx, t, T, 'C1', [CARD[0] + 28, CARD[1] + 82, CARD[2] - 56, CARD[3] - 110], m, B.DUVENAUD);
      // N.26 WARNING (stamped) vs FORECAST (struck) on the night ground
      if (t > t26 - .4) K.scr(ctx, (c) => { float2(c, t, 1 + .02 * sineIO(span(t, t26, s.b)));
        stamp(c, 'WARNING', 700, 480, span(t, tw - .05, tw + .45), { size: 70, col: AMBER.body });
        struckWord(c, 'forecast', 1300, 512, 110, span(t, tw + .2, tw + .7), span(t, tf + .2, tf + .5), { align: 'center' });
        TX(c, 'NOT A PREDICTION · A WARNING', W / 2, 760, { align: 'center', size: 22, col: SUB, a: span(t, tf + .5, tf + 1) });
      });
    },
    out: { k: 'fn', fn: B.maskGrow([700 - 230, 480 - 52, 460, 104], { r: 10, rim: '#ffd486' }), lead: .3, dur: 1.2 },
  };
  // ---------------------------------------------------------------- N.27 · MIX your street at noon from the door: the stamp turns CAME TRUE
  const camN27 = (t, s) => camK(t, [[s.a - 1.2, cam3({ z: -120, x: -180, y: -40 })], [s.b + 1, cam3({ z: 160, x: -90, y: -30 })]], .5);
  const N27 = {
    id: 'N.27',
    draw(ctx, t, s) {
      const L = look(R, t), c = camN27(t, s), tc = s.w('came');
      const out = S.street(ctx, t, c, L, { lamps: true });
      B.chimes(ctx, t, c, B.streetWindows(out), () => .55, null);
      K.scr(ctx, (g) => { K.scrim(g, 360, 330, 1200, 300, .45);
        const mv = quartIO(span(t, s.a + .1, s.a + 1.1)), x = lerp(700, 960, mv), y = lerp(480, 470, mv), fl = span(t, tc - .15, tc + .25);
        g.save(); g.translate(x, y); g.scale(Math.max(.02, Math.abs(Math.cos(Math.PI * fl))), 1); g.translate(-x, -y);
        if (fl < .5) stamp(g, 'WARNING', x, y, 1, { size: 70, col: AMBER.body }); else stamp(g, 'CAME TRUE', x, y, 1, { size: 70, col: '#f3efe2', rot: -.04 });
        g.restore();
        TX(g, 'IN THIS VERSION OF 2050', W / 2, 590, { align: 'center', size: 24, col: '#dfe6ff', a: span(t, s.a + .4, s.a + 1) });
      });
    },
    out: { k: 'sweep', kind: 'post', dir: -1, w: 200, col: '#0b0f2e', lead: .35, dur: .95 },
  };
  // ---------------------------------------------------------------- N.28–N.29 · nobody pushed you (a pale hand struck); your last lines go out, the empty seat
  const YU = [700, 820];
  const N28 = {
    id: 'N.28',
    draw(ctx, t, s) {
      const t29 = s.r('N.29'), tp = s.w('push'), tn = G('needing', t29), to = G('only', t29), ts = G('stop', t29);
      K.dusk(ctx, t, { glow: [900, 560] });
      K.scr(ctx, (c) => { float2(c, t, 1 + .02 * sineIO(span(t, s.a, s.b)));
        const step = quartIO(span(t, tn + .1, tn + 1.0));
        tableSeat(c, 1040, 820, 1, 1);
        K.you(c, t, lerp(YU[0] + 90, YU[0] - 60, step), YU[1], 270, { dir: 1, look: lerp(.1, -.5, span(t, t29, t29 + 1)), lean: -.02 });
        // N.28 a pale-ink hand comes in to push and is struck before it arrives
        const hi = expoOut(span(t, s.a - .4, s.a + .9)), hk = span(t, tp + .1, tp + .4), hf = expoIn(span(t, tp + .6, tp + 1.3));
        if (hf < 1) { c.save(); c.globalAlpha = (1 - hf) * span(t, s.a - .4, s.a); const hx = lerp(1700, 1260, hi), hy = 520 + 260 * hf;
          c.translate(hx, hy); c.rotate(-.15 + .4 * hf); K.ink(c, PALE, 4);
          c.beginPath(); c.moveTo(160, 40); c.lineTo(40, 40); c.quadraticCurveTo(0, 40, -6, 0); c.lineTo(-10, -90); c.quadraticCurveTo(-8, -108, 8, -108); c.quadraticCurveTo(22, -108, 24, -90); c.lineTo(28, -40);
          for (const [fx, fl] of [[28, 130], [62, 150], [96, 140], [128, 112]]) { c.lineTo(fx, -fl + 14); c.quadraticCurveTo(fx + 16, -fl - 6, fx + 32, -fl + 14); c.lineTo(fx + 32, -40); }
          c.lineTo(160, -40); c.stroke(); c.restore();
          strike(c, 1180, 380, 1480, 620, hk, { w: 8, a: 1 - hf }); }
        // N.29 your last lines (to the things that needed you) go out one by one
        const ends = [[1380, 300, 'EMPLOYER'], [1520, 470, 'GOVERNMENT'], [1460, 650, 'THE TABLE']], hand = [YU[0] + 40, YU[1] - 190];
        ends.forEach(([x, y, lab], i) => { const on = span(t, t29 - .3 + i * .1, t29 + .1 + i * .1), off = span(t, [to, ts, tn][i] - .05, [to, ts, tn][i] + .35); if (on <= 0) return;
          arrow(c, hand, [x - 40, y], 60 - i * 40, on, { col: mixHex(AMBER.body, '#3a4078', off), w: 3, head: false, a: 1 - .8 * off });
          TX(c, lab, x, y + 8, { size: 22, col: off > .5 ? SUB : AMBER.core, a: on * (1 - .55 * off) }); });
        TX(c, 'THE EMPTY SEAT', 860, 870, { align: 'center', size: 22, col: SUB, a: span(t, tn + .7, tn + 1.2) });
      });
    },
    out: { k: 'iris', c: (t, s) => [YU[0] - 60, YU[1] - 150, 110], lead: .3, dur: 1.1, rim: '#ffe7a8' },
  };
  // ---------------------------------------------------------------- N.30 · MIX the street at noon: you at the kerb with the phone, the chime points fade
  const camN30 = (t, s) => camK(t, [[s.a - 1.2, aim(1700, 760, 760, 1.5, W * .42, H * .56)], [s.b + 1, aim(1700, 780, 750, 1.36, W * .45, H * .55)]], .5);
  let phoneAt = [760, 700];
  const N30 = {
    id: 'N.30',
    draw(ctx, t, s) {
      const L = look(R, t), c = camN30(t, s);
      const out = S.street(ctx, t, c, L, { lamps: true, focus: (g) => {
        const hd = K.you(g, t, 760, 1000, 330, { dir: 1, pose: 'hold', look: .55 + .05 * Math.sin(t * .6), back: .3 });
        phoneAt = [hd.R[0] + 8, hd.R[1] - 10]; g.save(); g.translate(...phoneAt); g.rotate(-.2); S.screenGlow(g, t, -16, -24, 32, 46, { a: .9 }); g.restore();
      } });
      B.chimes(ctx, t, c, B.streetWindows(out), (w, i) => .55 * (1 - span(t, s.a + .3 + (i % 5) * .25, s.a + 1.2 + (i % 5) * .25)), null);
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camN30(t, s), 1700, ...phoneAt); return [p[0], p[1], 24]; }, lead: .35, dur: 1.1, rim: '#ffd6de' },
  };
  // ---------------------------------------------------------------- N.31 · EXPL the allowance steps down, NEXT MONTH dotted lower; the next step flies into the counter
  const N31 = {
    id: 'N.31',
    draw(ctx, t, s) {
      const tt = s.w('this'), tn = G('next', s.a), tl = G('still', s.a);
      K.dusk(ctx, t, { glow: [1000, 520] });
      const fly = span(t, s.b - 1.55, s.b - .5);
      K.scr(ctx, (c) => { float2(c, t, 1 + .06 * sineIO(span(t, s.a - .5, s.b + .8)), 760, 560);
        const x0 = 300, x1 = 1560, yT = 340, yB = 700, nx = lerp(0, 1, span(t, tn - .2, tn + .5));
        const lv = [.95, .9, .84, .78, .7, .6, lerp(.6, .42, nx)], su = span(t, s.a - .2, tt + .8);
        const st = B.stepLine(c, x0, x1, yT, yB, lv, su * (6 / 7) + nx / 7, { col: CARM.hot, w: 4, dashFrom: 6, dashOff: -t * 20 });
        c.save(); c.globalAlpha = .2 * su * (1 - fly); c.fillStyle = REST; c.beginPath(); c.moveTo(x0, yB + 40); st.pts.slice(0, 12).forEach((q) => c.lineTo(...q)); c.lineTo(st.pts[11][0], yB + 40); c.closePath(); c.fill(); c.restore();
        ['JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].forEach((m, i) => TX(c, m, x0 + (i + .5) * st.dx, yB + 80, { align: 'center', size: 22, col: i === 5 ? P.cream : SUB, a: span(t, s.a + .2 + i * .05, s.a + .6 + i * .05) * (i === 6 ? span(t, tn, tn + .4) : 1) }));
        TX(c, 'YOUR ALLOWANCE', x0, 230, { size: 28, a: span(t, s.a, s.a + .5) }); TX(c, 'SET BY AN ALGORITHM · NO REASON GIVEN · NO AMOUNTS SHOWN', x0, 266, { size: 20, col: SUB, a: span(t, s.a + .3, s.a + .8) });
        const p5 = [(st.pts[10][0] + st.pts[11][0]) / 2, st.pts[11][1]], p6 = [(st.pts[12][0] + st.pts[13][0]) / 2, st.pts[13][1]];
        TX(c, 'THIS MONTH', p5[0], p5[1] + 50, { align: 'center', size: 22, a: span(t, tt, tt + .4) });
        TX(c, 'NEXT MONTH', p6[0], p6[1] + 50, { align: 'center', size: 22, col: SUB, a: span(t, tn + .2, tn + .6) * (1 - fly) });
        const lo = span(t, tl - .2, tl + .4);   // "lower still": the dotted line keeps going down past the frame edge
        if (lo > 0) { c.save(); c.strokeStyle = rgba(CARM.hot, .7 * (1 - fly)); c.lineWidth = 3; c.setLineDash([4, 12]); c.lineDashOffset = -t * 20; K.strokeIn(c, [[st.pts[13][0], p6[1]], [st.pts[13][0] + 40, p6[1] + 60], [st.pts[13][0] + 60, p6[1] + 140]], lo); c.restore(); }
        if (fly < 1) { c.fillStyle = CARM.core; c.beginPath(); c.arc(p6[0], p6[1], 8 * span(t, tn + .2, tn + .5), 0, 7); c.fill(); }
      });
      // the next step flies into the HUD counter (top left): "the step down becomes the counter"
      if (fly > 0) K.scr(ctx, (c) => { const e = quartIO(fly), sx = lerp(1470, 285, e), sy = lerp(640, 128, e) - 180 * Math.sin(Math.PI * e); K.carmGlow(c, sx, sy, 60, .35); c.fillStyle = CARM.core; c.beginPath(); c.arc(sx, sy, 8, 0, 7); c.fill(); });
    },
    out: { k: 'iris', c: [285, 128, 36], lead: .55, dur: 1.9, pushA: .2, rim: '#ffd6de' },
  };
  return B.calmShots([N01, N03, N04, N08, N11, N23, N24, N27, N28, N30, N31], R);
}
