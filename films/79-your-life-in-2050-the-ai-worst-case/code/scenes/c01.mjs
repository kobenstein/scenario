// Film 79 · c01 HOOK (H.01–H.27, vo-v2): your street at cold dawn (title A WARNING · IF WE GET IT WRONG), the timeline with
// the two things the worst case is NOT (no war, no robot army, both struck out) and the ring that makes everything work, just not for you;
// bedroom, kitchen + the brass clock + two flashback cards (to work at 6:15 · who needed you), the hallway with the NOT NEEDED counter,
// the door → YOUR STREET (nothing broken, hedges trimmed, you raise your hand, the car reads BALANCE 0 and drives on), the push to the fence and the tower that never
// goes dark (the wow moment), the MONDAY leaf, every door shut. Quality bar for c02–c10 (docs/BRIEF-builders.md).
// Anchors: row ids (docs/shots.md) and phrases (s.w('wrong')), never seconds.
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, CARM } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
export const INK = { base: '#1f3c8a', lit: '#3a5aa8', shade: '#16296a', deep: '#0e1a4a', hem: .44 };
const PALE = '#b8c4f0';   // pale ink on the night ground (signs of what the worst case is NOT)
// carrier: the road line becomes the timeline (B opens in a band out of a cold line at y)
export const lineWipe = (y) => (ctx, u, dA, dB) => {
  const e = K.quartIO(u), h = H * 1.25 * e;
  dA(ctx);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(-10, y - h * (y / H), W + 20, h); ctx.clip(); dB(ctx); ctx.restore();
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1 - span(u, .6, 1); const g = K.expoOut(span(u, 0, .45));
  K.goldLine(ctx, [[W / 2 - W * .55 * g, y], [W / 2 + W * .55 * g, y]], 1, { w: 5, blur: 16, col: '#dfe6ff' }); ctx.restore();
};
// a strike: a carmine stroke drawn across a sign at u (0..1), then the sign drops and crumbles (k 0..1)
function struck(c, t, x, y, w, h, u, k, draw) {
  if (k >= 1) return;
  c.save(); c.globalAlpha *= 1 - K.expoIn(k); c.translate(x, y + 80 * K.expoIn(k)); c.rotate(.12 * k);
  draw(c); c.restore();
  if (u > 0 && k < 1) { c.save(); c.globalAlpha *= 1 - k; c.strokeStyle = CARM.hot; c.lineWidth = 7; c.lineCap = 'round'; c.shadowColor = CARM.hot; c.shadowBlur = 16;
    K.strokeIn(c, [[x - w * .6, y + h * .45], [x + w * .6, y - h * .55]], K.expoOut(u)); c.restore(); }
}
function warSign(c) {   // a roof in flames (pale ink outline)
  K.ink(c, PALE, 3); c.beginPath(); c.moveTo(-90, 40); c.lineTo(-90, -20); c.lineTo(0, -80); c.lineTo(90, -20); c.lineTo(90, 40); c.closePath(); c.stroke();
  for (const [fx, fh] of [[-40, 70], [10, 100], [55, 60]]) { c.beginPath(); c.moveTo(fx - 20, -40); c.quadraticCurveTo(fx - 26, -40 - fh * .6, fx, -40 - fh); c.quadraticCurveTo(fx + 26, -40 - fh * .6, fx + 20, -40); c.stroke(); }
}
function armySign(c, t) {   // a marching row of giant robots (pale ink outline): the cliché the film is not
  K.ink(c, PALE, 2.6);
  for (let i = 0; i < 5; i++) { const x = (i - 2) * 64, ph = t * 4 + i, s = i === 2 ? 1.15 : .9;
    c.save(); c.translate(x, 0); c.scale(s, s); c.strokeRect(-12, -98, 24, 20); c.strokeRect(-18, -76, 36, 40);
    c.beginPath(); c.moveTo(-8, -36); c.lineTo(-8 + 8 * Math.sin(ph), 0); c.moveTo(8, -36); c.lineTo(8 - 8 * Math.sin(ph), 0); c.stroke(); c.restore(); }
}

export default function c01(T, R) {
  const r = (id) => R[id];
  // ---------------------------------------------------------------- H.01–H.02 · YOUR STREET 2050 at cold dawn, the title
  const camH01 = (t, s) => camK(t, [[0, cam3({ z: -560, y: -40 })], [s.b + .6, cam3({ z: 200, y: -10, x: 20 })]]);
  const H01 = {
    id: 'H.01',
    draw(ctx, t, s) {
      const L = K.hourLook(7.6), c = camH01(t, s), tw = s.w('wrong');
      S.street(ctx, t, c, L, { youNear: [150, 800, 200], towerWake: K.bump(t, tw - .25, .35), pods: [{ x: 1900 - (t * 140) % 2600, y: 1000, s: .9, dir: -1 }] });
      K.scrim(ctx, 560, 200, 800, 300, .4);
      K.words(ctx, '2050', W / 2, 330, 170, span(t, .35, 1.3), { align: 'center' });
      const u2 = span(t, tw - .12, tw + .6), x0 = W / 2 - K.measure('AI WENT WRONG', 50, false, 600) / 2, xw = x0 + K.measure('AI WENT ', 50, false, 600);
      K.words(ctx, 'AI WENT', x0, 412, 50, span(t, s.w('get') - .1, s.w('get') + .6), { serif: false, weight: 600 });
      K.words(ctx, 'WRONG', xw, 412, 50, u2, { serif: false, weight: 600, col: CARM.hot, glow: false });
      K.caps(ctx, 'A WARNING · IF WE GET IT WRONG', W / 2, 478, span(t, .05, .6) * (1 - span(t, s.b - .5, s.b)), { size: 28, align: 'center', col: '#ffd6de' });
    },
    out: { k: 'fn', fn: lineWipe(600), lead: .45, dur: 1.0 },
  };
  // ---------------------------------------------------------------- H.03–H.07 · TIMELINE 2026 → 2050 (EXPL): not war, not robots; the ring; everything works, not for you
  const x0 = 300, x1 = 1640, ty = 600, yr = (Y) => lerp(x0, x1, (Y - 2026) / 24), XR = yr(2032);
  const H03 = {
    id: 'H.03',
    draw(ctx, t, s) {
      const t4 = s.r('H.04'), t5 = s.r('H.05'), t6 = s.r('H.06'), t7 = s.r('H.07'), tW = s.w('works'), z = 1 + .05 * K.sineIO(span(t, s.a, s.b + 1));
      K.dusk(ctx, t, { glow: [lerp(W / 2, x1, span(t, tW, s.b)), ty] });
      K.scr(ctx, (c) => {
        c.translate(lerp(W / 2, x1, .25), ty); c.scale(z, z); c.translate(-lerp(W / 2, x1, .25), -ty);
        c.strokeStyle = rgba('#a9b8f0', .55); c.lineWidth = 3; c.lineCap = 'round'; K.strokeIn(c, [[x0, ty], [x1, ty]], K.expoOut(span(t, s.a - .4, s.a + .6)));
        for (const [Y, lab] of [[2026, '2026 · TODAY'], [2030, '2030'], [2040, '2040'], [2050, '2050']]) {
          const u = span(t, s.a + (Y - 2026) * .03, s.a + .5 + (Y - 2026) * .03); if (u <= 0) continue;
          c.fillStyle = rgba('#cfd8ff', .7 * u); c.fillRect(yr(Y) - 1.5, ty - 12, 3, 24);
          K.glowText(c, lab, yr(Y), ty + 64, { size: Y === 2050 ? 40 : 28, weight: 600, align: 'center', col: P.cream, a: u, glow: false, spacing: .12 });
        }
        const wc = span(t, s.a + .1, s.a + .7); if (wc > 0) K.glowText(c, 'THE WORST CASE', x1, ty + 108, { size: 24, weight: 600, align: 'center', col: CARM.hot, a: wc, glow: false, spacing: .2 });
        // what it is NOT: a war sign, then a robot army sign, each drops toward the line and is struck out
        struck(c, t, yr(2041), ty - 190, 200, 180, span(t, t4 + .25, t4 + .55), span(t, t5 - .2, t5 + .5), (g) => { g.globalAlpha *= span(t, t4 - .25, t4 + .1); g.translate(0, -60 * (1 - K.expoOut(span(t, t4 - .25, t4 + .3)))); warSign(g); });
        struck(c, t, yr(2041), ty - 190, 330, 120, span(t, t5 + .45, t5 + .75), span(t, t6 - .25, t6 + .45), (g) => { g.globalAlpha *= span(t, t5 - .1, t5 + .25); g.translate(0, 40 - 60 * (1 - K.expoOut(span(t, t5 - .1, t5 + .45)))); armySign(g, t); });
        // the bright, even line after the ring ("everything works"): lifts off your path on "Just not for you"
        const lift = K.quartIO(span(t, t7 - .05, t7 + 1.0)) * 250;   // the bright line rises over your head
        if (t > tW - .1) { c.save(); c.shadowColor = '#cfe0ff'; c.shadowBlur = 18; c.strokeStyle = '#eef3ff'; c.lineWidth = 6; c.lineCap = 'round';
          K.strokeIn(c, [[XR, ty], [XR + 70, ty - lift], [x1, ty - lift]], K.sineIO(span(t, tW, tW + 1.2))); c.restore(); }
        // the 2050 end: a pale cold disc that becomes the bedroom window
        const sw = K.expoOut(span(t, t7 + .6, s.b + .3)), rS = lerp(9, 56, sw), ey = ty - lift;   // the end of the bright line: 2050, out of your reach
        c.fillStyle = K.rad(c, x1, ey, rS * 4, [[0, rgba('#dfe8ff', .35 * (.4 + sw))], [1, rgba('#dfe8ff', 0)]]); c.fillRect(x1 - rS * 4, ey - rS * 4, rS * 8, rS * 8);
        c.fillStyle = K.rad(c, x1, ey, rS, [[0, '#ffffff'], [.7, '#dfe6f6'], [1, '#a9b8e0']]); c.beginPath(); c.arc(x1, ey, rS, 0, 7); c.fill();
        // the ring lands on the line (early 2030s)
        const d = span(t, t6 - .35, t6 + .25), yy = lerp(ty - 420, ty, K.expoIn(d)), sq = 1 - .25 * K.bump(t, t6 + .2, .5);
        if (d > 0) { c.save(); c.translate(XR, yy); c.scale(1 / sq, sq); K.ring(c, t, 0, 0, 44, span(t, t6 - .35, t6 - .1)); c.restore(); }
        const lu = span(t, t6 + .2, t6 + .9) * (1 - span(t, t7 + .2, t7 + .7));
        if (lu > 0) { K.glowText(c, 'SUPERINTELLIGENCE', XR, ty - 290, { size: 40, weight: 600, align: 'center', col: '#ffe3ea', a: lu, glow: false, spacing: .14 });
          K.glowText(c, 'EARLY 2030s · A SCENARIO ASSUMPTION', XR, ty - 248, { size: 24, weight: 600, align: 'center', col: '#d8a8b8', a: lu, glow: false, spacing: .12 }); }
        // you walk along the old line; when the bright line lifts away you slow down and stop below it
        const walkU = 5.2 * K.sineIO(span(t, s.a, t6)) + 13 * span(t, t6 + .4, t7 + .6) + 1.2 * K.expoOut(span(t, t7 + .6, s.b)), Y = 2026 + walkU;
        const walking = t < t7 + 1.2;
        K.you(c, t, yr(Y) - 40, ty + 8, 200, { walk: walking ? K.walkPh(t, .8) : undefined, dir: 1, lean: .05, look: walking ? 0 : -.6 * span(t, t7 + .9, t7 + 1.6) });
      });
    },
    out: { k: 'iris', c: (t, s) => [x1 + (x1 - lerp(W / 2, x1, .25)) * .05, ty - 250 * 1.05, 56], lead: .4, dur: 1.5, pushA: .8, rim: '#dfe6ff' },
  };
  // ---------------------------------------------------------------- H.08–H.09 · BEDROOM at cold dawn: you wake up, nothing woke you
  const camBed = (t, s) => camK(t, [[s.a - .6, cam3({ z: -260, x: 80 })], [s.r('H.09') - .2, cam3({ z: -60, x: 40 })], [s.b + .4, aim(1700, 1240, 735, 1.9), 'q']], .3);
  const H08 = {
    id: 'H.08',
    draw(ctx, t, s) { S.bedroom(ctx, t, camBed(t, s), look(R, t), { up: K.expoOut(span(t, s.a - .2, s.a + 1.2)) * .95 + .05, youLook: .2 + .4 * span(t, s.r('H.09'), s.r('H.09') + 1) }); },
    out: { k: 'iris', c: (t, s) => { const p = project(camBed(t, s), 1700, 1240, 754); return [p[0], p[1], 34 * p[2]]; }, lead: .5, dur: 1.4, rim: '#dfe6ff' },
  };
  // ---------------------------------------------------------------- H.10–H.14 · KITCHEN: the grandson and the clock, two flashback cards
  let clockAt = [960, 600];
  const camKit = (t, s) => camK(t, [[s.a - .5, cam3({ z: -120, x: 90 })], [s.a + 1.1, cam3({ z: -55, x: 82 }), 's'], [s.r('H.11') - .1, cam3({ z: -40, x: 80 })], [s.r('H.11') + 1.2, aim(2400, 930, 600, 1.18, W * .44, H * .52), 's'],
    [s.r('H.13'), aim(2400, 930, 600, 1.16, W * .44, H * .52)], [s.r('H.14') + .2, aim(2400, 930, 600, 1.18, W * .43, H * .53)], [s.b + .8, cam3({ z: 0, x: -40, y: -10 }), 's']], .3);
  const H10 = {
    id: 'H.10',
    draw(ctx, t, s) {
      const L = look(R, t), t11 = s.r('H.11'), t12 = s.r('H.12'), t13 = s.r('H.13'), t14 = s.r('H.14'), c = camKit(t, s);
      const up = K.expoOut(span(t, s.a + .2, s.a + 1.8)), out = K.sineIO(span(t, t11 - .2, t11 + .8)), turn = K.sineIO(span(t, t14 + .3, t14 + 1.5));
      const a1 = lerp(lerp(1.25, 2.25, up), 1.62, out) - .35 * turn, a2 = lerp(lerp(1.45, 2.55, up), 1.52, out) - .2 * turn;
      S.kitchen(ctx, t, c, L, {
        boyX: 690, boyH: 330, boyPose: 'stand', armR: [a1, a2], armL: [-a1 + .15, -a2 + .1], boyLook: lerp(.6, .1, out) + .5 * turn, boyLean: .03 * turn,
        you: [1480, 1070, 560], youDir: -1, youLook: -.35, youBack: .45, lamp: 0, pod: .2 + ((t * .09) % 1) * 1.2,
        clock: (cx, tt, hd) => { const [hx, hy] = hd.R; clockAt = [hx + 20, hy - 30]; S.alarmClock(cx, tt, hx + 20, hy - 30, .62, { ring: 0, rot: -.1 + .05 * Math.sin(tt * .9) + .5 * turn }); },
      });
      const p = project(c, 2400, ...clockAt);
      // card 1 · BACK IN THE TWENTIES: the bells shake at 6:15, a figure hurries out of the door TO WORK; folds back into the clock as H.13 begins
      const u1 = K.cardU(t, t12 - .25, t13 + .05);
      if (u1 > 0) K.scr(ctx, (cx) => K.paper(cx, t, 1010, 120, 800, 600, u1, { from: [p[0], p[1]], head: 'BACK IN THE TWENTIES', draw: (g, x, y, w, h) => {
        const ring = span(t, t12, t12 + .25) * (1 - span(t, t12 + 1.6, t12 + 2.1));
        inkClock(g, t, x + w * .24, y + h * .42, 92, ring);
        K.ink(g, K.PAPER.ink2, 3); g.strokeRect(x + w * .54, y + h * .12, w * .16, h * .66); g.fillStyle = rgba(K.PAPER.ink2, .25); g.fillRect(x + w * .54, y + h * .12, w * .16 * (1 - .7 * span(t, t12 + .5, t12 + .9)), h * .66);
        const run = span(t, t12 + .6, t13 - .2), fx = lerp(x + w * .62, x + w * .98, K.sineIO(run));
        if (run > 0) { K.figureRaw(g, fx, y + h * .8, h * .5, { walk: t * 11, dir: 1, lean: .16, look: .1 }, INK, false);
          K.ink(g, K.PAPER.ink2, 2.2); for (let k = 0; k < 3; k++) { const yy = y + h * (.45 + k * .1); g.beginPath(); g.moveTo(fx - 70 - k * 12, yy); g.lineTo(fx - 30 - k * 12, yy); g.stroke(); } }
        g.fillStyle = K.PAPER.ink; g.font = '600 24px Inter'; g.textAlign = 'center'; g.fillText('6:15 · TO WORK', x + w * .76, y + h * .96);
      } }));
      // card 2 · WHO NEEDED YOU (H.13): you in the middle, lines to the people who waited for you; the lines go slack one by one
      const tc = t13 + .35, u2 = K.cardU(t, t13 + .15, t14 + .45);
      if (u2 > 0) K.scr(ctx, (cx) => K.paper(cx, t, 980, 110, 840, 620, u2, { from: [p[0], p[1]], head: 'BACK IN THE TWENTIES', draw: (g, x, y, w, h) => {
        const mx = x + w * .5, my = y + h * .56, who = [[x + w * .14, y + h * .34, 'BOSS', 'desk'], [x + w * .86, y + h * .3, 'CUSTOMERS', 'counter'], [x + w * .2, y + h * .9, 'COLLEAGUES', 'pair'], [x + w * .82, y + h * .9, 'YOUR KIDS', 'gate']];
        who.forEach(([px, py, lab, kind], i) => {
          const on = span(t, tc + .1 + i * .1, tc + .35 + i * .1), slack = K.sineIO(span(t, tc + .7 + i * .2, tc + 1.2 + i * .2));
          if (on <= 0) return;
          K.ink(g, K.PAPER.ink2, 2.4); g.globalAlpha = on * (1 - .55 * slack);
          const sag = 10 + 90 * slack; g.beginPath(); g.moveTo(mx, my - 40); g.quadraticCurveTo((mx + px) / 2, (my - 40 + py) / 2 + sag, px, py - 30); g.stroke();
          g.globalAlpha = on; K.figureRaw(g, px, py + 34, 90, { look: (mx - px) > 0 ? .6 : -.6, dir: px < mx ? 1 : -1, pose: kind === 'desk' ? 'hold' : 'stand' }, INK, false);
          g.fillStyle = K.PAPER.ink; g.font = '600 18px Inter'; g.textAlign = 'center'; g.fillText(lab, px, py + 64); g.globalAlpha = 1;
        });
        K.figureRaw(g, mx, my + 60, 150, { look: .2 * Math.sin(t * .6), dir: 1 }, { ...INK, base: '#c79a2a', lit: '#e8b84a', shade: '#8a6418' }, false);
        g.fillStyle = K.PAPER.ink; g.font = '600 20px Inter'; g.textAlign = 'center'; g.fillText('YOU', mx, my + 92);
      } }));
    },
    out: { k: 'sweep', kind: 'post', dir: -1, w: 200, col: '#0b0f2e', lead: .4, dur: .9 },
  };
  // ---------------------------------------------------------------- H.15–H.16 · HALLWAY: the NOT NEEDED counter grows big, the front door opens
  const camHall = (t, s) => camK(t, [[s.a - .8, cam3({ z: -160, x: -60 })], [s.a + 1.0, cam3({ z: -60, x: -10 }), 's'], [s.r('H.16'), cam3({ z: -40 })], [s.b + .6, aim(3000, 960, 570, 1.22), 'q']], .3);
  const H15 = {
    id: 'H.15',
    draw(ctx, t, s) {
      const L = look(R, t), t16 = s.r('H.16');
      S.hallway(ctx, t, camHall(t, s), L, K.quartIO(span(t, t16 - .1, t16 + 1.4)), { boy: true });
      // the open door floods with cold light just before the push (the street of H.17 resolves out of that light: no content pop)
      const bl = .94 * K.sineIO(span(t, RT('H.17') - .75, RT('H.17') - .2));
      if (bl > 0) { const c = camHall(t, s), a = project(c, 3000, 760, 190), b = project(c, 3000, 1160, 950);
        K.scr(ctx, (g) => { g.globalAlpha = bl; g.fillStyle = '#e4eaff'; g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); g.globalAlpha = bl * .25; for (const e of [18, 40]) g.fillRect(a[0] - e, a[1] - e, b[0] - a[0] + 2 * e, b[1] - a[1] + 2 * e); }); }
      const g = K.expoOut(span(t, s.a + .1, s.a + 1.1)) * (1 - K.quartIO(span(t, t16 - .7, t16 + .1)));
      if (g > .01) K.scr(ctx, (c) => {
        const cx = lerp(150, W / 2, g), cy = lerp(150, 250, g), k = lerp(.32, 1, g);
        c.translate(cx, cy); c.scale(k, k);
        c.fillStyle = K.rad(c, 0, 0, 760, [[0, rgba('#060a24', .7)], [1, rgba('#060a24', 0)]]); c.fillRect(-900, -400, 1800, 800);
        K.glowText(c, 'NOT NEEDED IN 2050', 0, -90, { size: 34, weight: 600, align: 'center', col: '#c9b8d6', spacing: .24, glow: false });
        for (let i = 0; i < 9; i++) {
          const x = (i - 4) * 104, u = span(t, s.a + .4 + i * .06, s.a + .9 + i * .06), fill = i === 0;
          c.globalAlpha = u; c.strokeStyle = fill ? CARM.hot : rgba('#e8eefc', .45); c.lineWidth = 3; c.beginPath(); c.roundRect(x - 42, -42, 84, 84, 8); c.stroke();
          if (fill) { c.fillStyle = K.rad(c, x, 0, 60, [[0, CARM.hot], [1, CARM.mid]]); c.beginPath(); c.roundRect(x - 36, -36, 72, 72, 6); c.fill(); }
          K.glowText(c, String(i + 1), x, 16, { size: 46, serif: true, align: 'center', col: fill ? CARM.core : rgba('#e8eefc', .45), glow: false });
          c.globalAlpha = 1;
        }
        K.glowText(c, 'THE ALARM CLOCK', -416, 84, { size: 20, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .08 });
        const q = span(t, s.a + 1.6, s.a + 2.3); if (q > 0) K.glowText(c, '?', 470, 18, { size: 80, serif: true, col: '#e8eefc', a: q });
      });
    },
    out: { k: 'portal', win: (t, s) => { const c = camHall(t, s), a = project(c, 3000, 760, 190), b = project(c, 3000, 1160, 950); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .2, dur: 1.2 },
  };
  // ---------------------------------------------------------------- H.17–H.27 · YOUR STREET (leitbild): a new view per sentence, the push to the fence, the tower
  const RT = (id) => R[id];
  const camSt = (t) => camK(t, [
    // one slow glide H.17–H.19, then ONE wide frame for H.20/H.21 (the across house AND your door in view: no whip pan between them)
    [RT('H.17') - 1, cam3({ z: -120, y: -10 })], [RT('H.17') + 1.2, cam3({ z: 100, x: 30, y: -10 }), 's'], [RT('H.19') + .9, cam3({ z: 140, x: 40, y: -10 })],
    [RT('H.20') + .5, aim(2600, 1240, 600, 1.04, W * .5, H * .5)], [RT('H.20') + 1.1, aim(2600, 1100, 610, 1.05, W * .5, H * .5)],
    [RT('H.21') + .1, aim(2600, 1080, 612, 1.05, W * .5, H * .5)], [RT('H.21') + 1.5, cam3({ z: 400, y: 140, x: -240 }), 's'], [RT('H.22') + .4, cam3({ z: 420, y: 135, x: -225 })],
    [RT('H.23') + 1.4, cam3({ z: 440, y: 120, x: -190 }), 's'], [RT('H.23') + 3.6, cam3({ z: 420, y: 90, x: -120 }), 's'], [RT('H.24') + .9, cam3({ z: 500, y: 50, x: -20 }), 's'], [RT('H.24') + 3.1, aim(16000, 960, 520, 1.12, W / 2, H * .62), 's'],
    [RT('H.25') + .6, aim(16000, 960, 505, 1.13, W / 2, H * .61)], [RT('H.25') + 2.4, aim(16000, 960, 150, 1.3, W / 2, H * .44), 's'], [RT('H.26') + .2, aim(16000, 962, 146, 1.34, W / 2, H * .44)],
    [RT('H.27') + 1.0, aim(16000, 960, 240, 1.28, W / 2, H * .48), 's'], [RT('B.01'), cam3({ z: -440, y: -70, x: 20 }), 's'],   // ends ON the seam: c02 takes over this exact key (no near-hold)
  ], .3);
  const H17 = {
    id: 'H.17',
    draw(ctx, t, s) {
      const L = look(R, t), c = camSt(t), t18 = RT('H.18'), t19 = RT('H.19'), t20 = RT('H.20'), t21 = RT('H.21'), t22 = RT('H.22'), t23 = RT('H.23'), t24 = RT('H.24'), t25 = RT('H.25'), t26 = RT('H.26'), t27 = RT('H.27');
      const hl = (i) => (i < 4 ? K.bump(t, t19 + .1 + (i % 2) * .15, 1.1) : 0) + (i >= 4 ? K.bump(t, t18 + (i % 2) * .35 + (i < 6 ? .3 : 0), 1.0) : 0);
      // v2: the car comes down the street, slows for your raised hand, reads you (BALANCE 0) and drives on
      const pa = span(t, t22 + .2, t23 + 1.0), pb = span(t, t23 + 1.0, t23 + 2.4), pc = span(t, t23 + 2.4, t23 + 4.6);
      const podX = pc > 0 ? lerp(640, -2400, pc * pc) : pb > 0 ? lerp(700, 640, pb) : lerp(2600, 700, 1 - (1 - pa) * (1 - pa));
      const yw = span(t, t21 + .3, t22 + .1), youX = lerp(170, 440, K.sineIO(yw));
      const hand = K.sineIO(span(t, t22 + .1, t22 + .8)) * (1 - K.sineIO(span(t, t23 + 2.6, t23 + 3.4)));
      const o = {
        hl, hedges: 1, towerWake: K.bump(t, t25 - .35, .3) + K.bump(t, t25 - .1, .15), youNear: t < t21 + .3 ? [95, 800, 200] : null, lit: .45 * span(t, t27 + .8, t27 + 2.4),
        you: t > t21 + .3 && t < t24 + 2 ? [youX, 1012, 300] : null, youWalk: yw > 0 && yw < 1 ? t * 6 : undefined, youArmR: [lerp(.15, 2.6, hand), lerp(.1, 2.9, hand)], youLook: t > t23 ? .55 * K.bump(t, t23 + 1.2, 2.2) : -.2, youDir: 1,
        pods: t > t22 && t < t24 + 1.5 ? [{ x: podX, y: 1000, s: 1.05, dir: -1 }] : [],
        ghostFields: span(t, t24 + 1.6, t24 + 2.1) * (1 - span(t, t24 + 3.1, t24 + 3.8)), farPod: t > t24 + 2 ? lerp(700, 920, span(t, t24 + 2, t25 + 2.4)) : null,
        near: (g, tt, out) => {   // the parcel and the bicycle at your door (untouched); the ink ghost of what did NOT happen (H.20)
          const y0 = out.yours; if (!y0 || !y0.door) return; const [dx, dy, dw, dh] = y0.door;
          g.fillStyle = mixHex('#8a7058', L.shade, .3); g.fillRect(dx + dw + 20, dy + dh - 60, 78, 60); g.fillStyle = rgba('#e8eefc', .25); g.fillRect(dx + dw + 20, dy + dh - 60, 78, 6); g.fillRect(dx + dw + 55, dy + dh - 60, 6, 60);
          g.strokeStyle = mixHex('#2a3270', L.light, .1); g.lineWidth = 6; for (const wx of [dx - 330, dx - 200]) { g.beginPath(); g.arc(wx, dy + dh - 44, 42, 0, 7); g.stroke(); } g.beginPath(); g.moveTo(dx - 330, dy + dh - 44); g.lineTo(dx - 270, dy + dh - 110); g.lineTo(dx - 200, dy + dh - 44); g.lineTo(dx - 280, dy + dh - 44); g.closePath(); g.stroke();
          const across = out.across; const gb = span(t, t20 + .1, t20 + .45) * (1 - span(t, t20 + 1.0, t20 + 1.25));
          if (gb > 0 && across && across.win) { g.save(); g.globalAlpha = gb; g.beginPath(); g.rect(across.x - 40 + (across.w + 80) * span(t, t20 + .95, t20 + 1.25), across.base - across.h - 220, across.w + 120, across.h + 240); g.clip(); K.ink(g, '#eef2ff', 3);
            for (const [wx, wy, ww, wh] of across.win) { const cx0 = wx + ww * .45, cy0 = wy + wh * .4; for (let k = 0; k < 6; k++) { const a = k * 1.05 + .3; g.beginPath(); g.moveTo(cx0, cy0); g.lineTo(cx0 + Math.cos(a) * ww * .7, cy0 + Math.sin(a) * wh * .7); g.stroke(); } }
            g.beginPath(); g.moveTo(across.x + across.w * .3, across.base - across.h); g.lineTo(across.x + across.w * .4, across.base - across.h * .6); g.lineTo(across.x + across.w * .33, across.base - across.h * .3); g.stroke(); g.restore(); }
        },
        focus: (g, tt) => {   // H.27: every front door, no appointment: a blank day-leaf over each door, in a row (near → far)
          const bl = span(t, t27 + .6, t27 + 1.2); if (bl <= 0) return;
        },
      };
      S.street(ctx, t, c, L, o);
      const fl = .94 * (1 - K.sineIO(span(t, RT('H.17') - .2, RT('H.17') + .6)));   // out of the door's cold light
      if (fl > 0) K.scr(ctx, (g) => { g.globalAlpha = fl; g.fillStyle = '#e4eaff'; g.fillRect(0, 0, W, H); });
      const sc = span(t, t23 + 1.0, t23 + 2.3);
      if (sc > 0 && sc < 1 && o.you) { const py = project(c, 1700, o.you[0], o.you[1]), pp = project(c, 1700, podX, 1000);
        if (py && pp) K.scr(ctx, (g) => { const h = 300 * py[2], yy = py[1] - h * K.sineIO(sc); g.globalAlpha = Math.sin(Math.PI * sc) * .9;
          g.strokeStyle = CARM.hot; g.lineWidth = 3; g.shadowColor = CARM.hot; g.shadowBlur = 12; g.beginPath(); g.moveTo(py[0] - 70 * py[2], yy); g.lineTo(py[0] + 70 * py[2], yy); g.stroke(); }); }
      const bz = K.cardU(t, t23 + 1.7, t23 + 3.2);
      if (bz > 0) { const pp = project(c, 1700, podX, 1000); if (pp) K.caps(ctx, 'BALANCE 0', pp[0], pp[1] - 150 * pp[2], bz, { size: 24, align: 'center', col: '#ffd6de' }); }
      const tg = K.cardU(t, s.a + .3, t18 + .1);
      K.caps(ctx, 'YOUR STREET · 2050', W / 2, 190, tg, { size: 26, align: 'center', col: '#dfe6ff' });
      const tf = K.cardU(t, t24 + 2.0, t25 + .2); if (tf > 0) K.caps(ctx, 'WHERE THE FIELDS BEGAN', W / 2, 870, tf, { size: 24, align: 'center', col: '#dfe6ff' });
      const tt = K.cardU(t, t25 + 1.4, t26 - .1); if (tt > 0) K.caps(ctx, 'LIT DAY AND NIGHT', W / 2 + 330, 300, tt, { size: 24, col: '#ffd6de' });
      // the MONDAY leaf of a tear-off calendar drops into the street
      const lf = span(t, t26 - .1, t26 + 1.6), lfOut = span(t, t27 + .2, t27 + .8);
      if (lf > 0 && lfOut < 1) K.scr(ctx, (cx) => {
        const e = K.sineIO(lf), x = 1120 + 140 * Math.sin(lf * 5.2) * (1 - e), y = lerp(-180, 610, e), rot = .5 * Math.sin(lf * 6) * (1 - e) - .06;
        cx.translate(x, y); cx.rotate(rot); cx.scale(1 - .3 * lfOut, (1 - lfOut) * (1 - .4 * Math.abs(Math.sin(lf * 6)) * (1 - e)));
        K.paper(cx, t, -160, -90, 320, 180, 1, { head: 'NOVEMBER 2050', headCol: K.PAPER.red, lines: ['MONDAY'], lineSize: 64, serif: false });
      });
      // H.27: over the front doors, blank leaves (no appointment anywhere), near → far
      const bl = span(t, t27 + 1.4, t27 + 2.2) * (1 - span(t, s.b - .4, s.b + .2));
      if (bl > 0) { const pts = [[2600, 40, 520], [2600, 1700, 520], [4200, 380, 470], [4200, 1380, 470], [7000, 510, 520], [7000, 1220, 520]];
        pts.forEach(([Z, u, v], i) => { const pp = project(c, Z, u, v); if (!pp) return; const a = span(bl, i * .1, .5 + i * .1); if (a <= 0) return;
          K.scr(ctx, (g) => { const w = Math.max(26, 70 * pp[2]), h = w * .62; g.globalAlpha = a * .9; g.fillStyle = K.PAPER.lit; g.fillRect(pp[0] - w / 2, pp[1] - h, w, h); g.fillStyle = K.PAPER.red; g.fillRect(pp[0] - w / 2, pp[1] - h, w, h * .22); g.globalAlpha = 1; }); }); }
    },
    out: { k: 'cut' },
  };
  return [H01, H03, H08, H10, H15, H17];
}
// the brass alarm clock in blue ink (inside the flashback card)
function inkClock(ctx, t, x, y, r, ring) {
  const sh = ring * Math.sin(t * 60) * .08; ctx.save(); ctx.translate(x, y); ctx.rotate(sh); K.ink(ctx, K.PAPER.ink, 3);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * r * .62, -r * .95, r * .4, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s * r * .5, r * .85); ctx.lineTo(s * r * .75, r * 1.2); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r * .7); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(1.57 + .13) * r * .45, Math.sin(1.57 + .13) * r * .45); ctx.stroke();
  ctx.font = `600 ${Math.round(r * .34)}px Inter`; ctx.textAlign = 'center'; ctx.fillText('6:15', 0, r * .52);
  if (ring > 0) for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { ctx.globalAlpha = ring * (1 - k * .28); ctx.beginPath(); ctx.arc(s * r * .62, -r * .95, r * (.62 + k * .2), s < 0 ? 3.5 : 5, s < 0 ? 4.4 : 5.9); ctx.stroke(); }
  ctx.restore();
}
