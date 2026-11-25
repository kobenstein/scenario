// Film 74 · c03 THE CARS (2.03–3.04): the round car glides past, your street from above (one car, five doors, elevator, beds, road deaths),
// the freeway flashback (stamp, lanes earned back), then the camera tilts up the house fronts to your roof: the robot, the gap, within the hour.
import * as K from '../lib/f74_kit.mjs';
import * as S from '../lib/f74_street.mjs';
import * as PL from '../lib/f74_places.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
// the round car seen from above
export function podTop(ctx, x, y, rot, s = 1, L) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = rgba(L.ink, .3); ctx.beginPath(); ctx.roundRect(-30, -54, 70, 112, 30); ctx.fill();
  ctx.fillStyle = K.lin(ctx, -34, 0, 34, 0, [[0, mixHex('#d9d6cc', L.shade, .2)], [1, '#fbf8ee']]); ctx.beginPath(); ctx.roundRect(-34, -58, 68, 116, 30); ctx.fill();
  ctx.fillStyle = K.lin(ctx, 0, -40, 0, 30, [[0, '#2c4f99'], [1, '#16245a']]); ctx.beginPath(); ctx.roundRect(-24, -30, 48, 62, 20); ctx.fill();
  ctx.fillStyle = '#bff1ff'; ctx.beginPath(); ctx.arc(-18, -54, 4, 0, 7); ctx.arc(18, -54, 4, 0, 7); ctx.fill();
  ctx.restore();
}
// freeway schema in blue ink on a paper card: three lanes, taxis, a work zone; o: stopU (taxis stop), offU (taxis leave), backU (lanes light up)
function freeway(q, t, x, y, w, h, o) {
  const lanes = [y + h * .3, y + h * .5, y + h * .7]; K.ink(q, K.PAPER.ink, 3);
  q.beginPath(); q.moveTo(x, y + h * .2); q.lineTo(x + w, y + h * .2); q.moveTo(x, y + h * .8); q.lineTo(x + w, y + h * .8); q.stroke();
  q.setLineDash([22, 18]); q.lineWidth = 2; for (const ly of [y + h * .4, y + h * .6]) { q.beginPath(); q.moveTo(x, ly); q.lineTo(x + w, ly); q.stroke(); } q.setLineDash([]);
  // the lanes earned back, section by section (gold)
  if (o.backU > 0) for (let k = 0; k < 6; k++) { const u = clamp(o.backU * 6 - k); if (u > 0) { q.fillStyle = rgba('#f2b632', .35 * u); q.fillRect(x + k * w / 6, y + h * .2, w / 6 - 4, h * .6); } }
  // work zone: cones on the middle lane
  q.fillStyle = '#e0703a'; for (let k = 0; k < 4; k++) { const cx = x + w * .62 + k * 34; q.beginPath(); q.moveTo(cx, lanes[1] + 18); q.lineTo(cx + 10, lanes[1] - 14); q.lineTo(cx + 20, lanes[1] + 18); q.fill(); }
  // taxis (small round cars in ink): drive, stop before the zone, then leave the lanes (off), then come back
  for (let i = 0; i < 5; i++) {
    const lane = lanes[i % 3], base = ((t * 60 + i * 230) % (w + 200)) - 100, stopX = x + w * .55 - (i % 3 === 1 ? 0 : 400) - i * 30;
    let px = x + base; if (o.stopU > 0 && o.backU <= 0) px = Math.min(px, stopX);
    let py = lane; const off = o.offU * (1 - o.backU); py = lerp(lane, i % 2 ? y + h * .08 : y + h * .94, K.sineIO(off));
    q.save(); q.globalAlpha = 1 - .6 * off; q.strokeStyle = K.PAPER.ink; q.lineWidth = 3.5; q.beginPath(); q.roundRect(px - 46, py - 24, 92, 48, 22); q.stroke();
    q.fillStyle = rgba(K.PAPER.ink, .3); q.fillRect(px - 14, py - 14, 34, 28); q.restore();
  }
}
export default function c03(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- 2.03 · the cars still exist: one glides along the street
  let podX = 1500;
  const camPod = (t, s) => camK(t, [[s.a - 1.2, cam3({ z: 120, y: 30, x: 60 })], [s.b + .5, cam3({ z: 320, y: 20, x: -120 })]]);
  const S203 = {
    id: '2.03',
    draw(ctx, t, s) {
      const L = look(R, t), u = span(t, s.a - 1.2, s.b + .9); podX = lerp(1750, 520, K.sineIO(u));
      S.street(ctx, t, camPod(t, s), L, { apples: 1, bayTrees: 1, walkers: 1, kids: true, chalk: 1, pod: podX, podDir: -1 });
    },
    out: { k: 'iris', c: (t, s) => { const p = project(camPod(t, s), 1700, podX, 925); return [p[0], p[1], 80 * p[2]]; }, lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 2.04–2.07 · YOUR STREET FROM ABOVE (EXPL/MIX)
  const stops = [[870, 210], [1050, 330], [870, 470], [1050, 600], [870, 760]];
  const S204 = {
    id: '2.04',
    draw(ctx, t, s) {
      const L = look(R, t), t5 = s.r('2.05'), t6 = s.r('2.06'), t7 = s.r('2.07');
      const c = camK(t, [[s.a - 1, cam3({ z: -300 })], [t6, cam3({ z: -120, x: 30 })], [s.b + .6, cam3({ z: 60, y: -40 })]]);
      PL.aerial(ctx, t, c, L, { beds: span(t, t6 - .1, t6 + 1.8), solar: 0, focus: (g) => {
        // one car serves five front doors in turn
        const u = clamp((t - s.a - .2) / Math.max(1, t5 - s.a + 1.2)) * stops.length, k = Math.min(stops.length - 1, Math.floor(u)), f = u - k;
        const a = stops[k], b = stops[Math.min(stops.length - 1, k + 1)], e = K.sineIO(clamp(f * 1.6 - .3));
        const x = lerp(a[0], b[0], e), y = lerp(a[1], b[1], e) + (k >= stops.length - 1 ? (t - s.a) * 12 : 0);
        for (let i = 0; i <= k; i++) { const [dx, dy] = stops[i]; g.fillStyle = rgba('#f2b632', .8); g.beginPath(); g.arc(dx < 960 ? 700 : 1220, dy, 10, 0, 7); g.fill(); }
        podTop(g, x, y, (b[0] - a[0]) * .002 * Math.sin(Math.PI * e), 1, L);
        if (f < .35) { const p = f / .35; g.strokeStyle = rgba('#fff3c4', 1 - p); g.lineWidth = 3; g.beginPath(); g.arc(a[0], a[1], 30 + p * 50, 0, 7); g.stroke(); }
      } });
      // 2026 beside it: five cars in front of five houses (paper)
      const u4 = K.cardU(t, s.a + 1.4, t5 + .2);
      if (u4 > 0) K.scr(ctx, (g) => K.paper(g, t, 70, 250, 520, 420, u4, { head: '2026: FIVE HOUSES, FIVE CARS', draw: (q, x, y, w, h) => { for (let i = 0; i < 5; i++) { K.ink(q, K.PAPER.ink2, 2.5); q.strokeRect(x + 10 + i * 92, y + 20, 70, 80); K.inkCar(q, x + 45 + i * 92, y + 190, .3, 1, K.PAPER.ink); } } }));
      K.today(ctx, t, s.a + .5, t5 - .1, ['ROBOTAXIS · HUNDREDS OF THOUSANDS', 'OF DRIVERLESS RIDES A WEEK'], 'WAYMO, 2026 · COMPANY FIGURE');
      // 2.05 the elevator: called · ridden · gone
      const ue = K.cardU(t, t5 + .1, t6 + .1);
      if (ue > 0) K.scr(ctx, (g) => K.paper(g, t, 1300, 240, 520, 470, ue, { head: 'LIKE AN ELEVATOR', draw: (q, x, y, w, h) => {
        K.ink(q, K.PAPER.ink, 3); q.strokeRect(x + 20, y + 20, 150, 250); const op = K.bump(t, t5 + 1.3, 1.4); q.strokeRect(x + 20 + 75 * (1 - op) * 0, y + 20, 75 * (1 - op), 250); q.strokeRect(x + 95 + 75 * op, y + 20, 75 * (1 - op), 250);
        ['CALLED', 'RIDDEN', 'GONE'].forEach((wd, i) => { const on = span(t, t5 + .6 + i * .9, t5 + .9 + i * .9); q.fillStyle = on > 0 ? K.PAPER.ink : rgba(K.PAPER.ink2, .4); q.font = '700 34px Inter'; q.fillText(wd, x + 210, y + 80 + i * 80); if (on > 0) { q.fillStyle = '#e3a63f'; q.beginPath(); q.arc(x + 195, y + 68 + i * 80, 8 * on, 0, 7); q.fill(); } }); } }));
      K.today(ctx, t, t6 + .2, t7 - .05, ['PARIS VOTED TO TURN 500 MORE', 'STREETS GREEN AND CAR-FREE (2025)'], 'PARIS REFERENDUM, 23 MARCH 2025');
      // 2.07 road deaths run down
      const ud = K.cardU(t, t7 + .1, s.b + .3);
      if (ud > 0) { K.scrim(ctx, 560, 400, 800, 200, .6 * ud);
        K.words(ctx, '1,160,000', W / 2, 520, 120, ud, { align: 'center' });
        K.caps(ctx, 'ROAD DEATHS A YEAR · TODAY (WHO, 2025)', W / 2, 580, ud, { size: 28, align: 'center', col: '#ffe7a8' });
        const st = span(t, t7 + 1.6, t7 + 2.2); if (st > 0) K.scr(ctx, (g) => K.goldLine(g, [[640, 486], [lerp(640, 1280, K.expoOut(st)), 470]], 1, { w: 8 })); }
    },
    out: { k: 'iris', c: [W / 2, 480, 70], lead: .35, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 2.08–2.11 · BACK IN THE TWENTIES: the freeway (paper flashback, EXPL)
  const S208 = {
    id: '2.08',
    draw(ctx, t, s) {
      const t9 = s.r('2.09'), t10 = s.r('2.10'), t11 = s.r('2.11');
      K.dusk(ctx, t, { glow: [960, 520] });
      K.scr(ctx, (g) => {
        const z = 1 + .03 * span(t, s.a, s.b + 1); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        K.paper(g, t, 110, 210, 1130, 640, clamp(span(t, s.a - .3, s.a + .6) - span(t, s.b - .2, s.b + .4)), { head: 'BACK IN THE TWENTIES · THE FREEWAY', draw: (q, x, y, w, h) => {
          freeway(q, t, x, y + 20, w, h - 40, { stopU: span(t, t9 + .6, t9 + 1.2), offU: K.expoOut(span(t, t10 + .3, t10 + 1.2)), backU: span(t, t11 + .1, s.b - .1) });
          const st = span(t, t10, t10 + .25); if (st > 0) { q.save(); q.translate(x + w * .5, y + h * .5); q.rotate(-.12); const k = lerp(1.8, 1, K.expoOut(st)); q.scale(k, k); q.globalAlpha = Math.min(1, st * 3) * (1 - span(t, t11 + .1, t11 + .6));
            q.strokeStyle = '#c8473a'; q.lineWidth = 8; q.strokeRect(-280, -60, 560, 120); q.fillStyle = '#c8473a'; q.font = '800 64px Inter'; q.textAlign = 'center'; q.fillText('OFF THE FREEWAYS', 0, 22); q.restore(); }
        } });
      });
      K.today(ctx, t, t9 + .3, t11 - .1, ['NOV 2026 · CALIFORNIA\'S REGULATOR', 'ORDERS WAYMO\'S ROBOTAXIS', 'OFF THE FREEWAYS'], 'CALIFORNIA DMV ORDER, 11 NOV 2026', { y: 300, x: 1290, size: 28 });
    },
    out: { k: 'sweep', dir: -1, w: 600, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 2.12–3.04 · back on the street, tilt up to your roof: the robot, the gap, within the hour
  const camRoof = (t) => camK(t, [[RT('2.12') - 1, cam3({ z: 200, y: 80, x: -200 })], [RT('2.13'), cam3({ z: 300, y: -40, x: -420 })], [RT('3.01') - .1, aim(2600, -20, 420, 1.3, W * .5, H * .62), 'q'],
    [RT('3.02') - .1, aim(2600, -20, 420, 1.4, W * .5, H * .6)], [RT('3.02') + 1.2, aim(2600, 40, 520, 2.1, W * .45, H * .5), 'q'], [RT('3.03') + 1, aim(2600, 20, 500, 1.9, W * .4, H * .52)], [RT('3.05') + .5, aim(2600, 0, 480, 1.7, W * .4, H * .52)]]);
  const S212 = {
    id: '2.12',
    draw(ctx, t, s) {
      const L = look(R, t), t1 = RT('3.01'), t2 = RT('3.02'), t3 = RT('3.03'), t4 = RT('3.04'), c = camRoof(t);
      S.street(ctx, t, c, L, { apples: 1, bayTrees: 1, walkers: 1, roofBot: t > RT('2.13') - .5 ? 1 : 0, tiles: 1 - .8 * span(t, t1, s.b + 2),
        fore: false, you: t > t1 - .5 ? [470, 1070, 330] : null, youPose: 'hold', youLook: 1, youDir: -1,
        focus: (g) => { if (t > t2 - .5) { g.fillStyle = '#5a2f2a'; for (let k = 0; k < 5; k++) g.fillRect(170 + k * 40, 700 + (k % 2) * 8, 30, 12); g.strokeStyle = mixHex('#4a3428', L.shade, .2); g.lineWidth = 8; g.beginPath(); g.moveTo(80, 760); g.lineTo(330, 690); g.moveTo(200, 726); g.lineTo(230, 660); g.stroke(); } } });
      // 3.03–3.04 a small time line on the scene: BREAKFAST 8:20 → ROBOT 9:05, WITHIN THE HOUR
      const u = K.cardU(t, t3 + .05, s.b + .3);
      if (u > 0) K.scr(ctx, (g) => {
        const x0 = 1000, x1 = 1640, y = 760; g.globalAlpha = u;
        K.scrim(g, 960, 690, 760, 140, .5);
        g.strokeStyle = rgba('#e8eefc', .8); g.lineWidth = 3; K.strokeIn(g, [[x0, y], [x1, y]], span(t, t3, t3 + .6));
        K.glowText(g, 'BREAKFAST · 8:20', x0, y + 44, { size: 24, weight: 600, col: P.cream, glow: false, spacing: .08 });
        const a = span(t, t4 - .2, t4 + .4); if (a > 0) { K.goldLine(g, [[x0, y - 10], [lerp(x0, x1, K.expoOut(a)), y - 10]], 1, { w: 6 }); K.glowText(g, 'ROBOT · 9:05', x1, y + 44, { size: 24, weight: 600, col: '#ffe7a8', glow: false, align: 'right', spacing: .08 });
          K.glowText(g, 'WITHIN THE HOUR', (x0 + x1) / 2, y - 40, { size: 40, weight: 700, col: '#ffe7a8', align: 'center', a: span(t, t4 + .2, t4 + .6), spacing: .06 }); }
        g.globalAlpha = 1;
      });
    },
    out: { k: 'portal', win: [980, 620, 700, 230], lead: .35, dur: 1.0 },
  };
  return [S203, S204, S208, S212];
}
