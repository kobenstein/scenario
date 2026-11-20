// c03 · Pong 2022: sense and move zones · the trick: order or noise
// T.G('The answer came') → T.G('After about five minutes') · builder B1. Plan: docs/shots.md 3.01–3.04 · B1 module lib/f19_b1_world.mjs
// ONE entry, the dish field (2D field camera) straight on from c02's last frame.
//
// | ID   | anchor (word)                              | picture (one idea)                                                          | 1–2 moves           |
// |------|--------------------------------------------|-----------------------------------------------------------------------------|---------------------|
// | 3.01 | four years ago · old video game · Pong      | the Pong court draws itself in cool lines over the chip; the ball leaves the far wall; PONG · 2022 | court · ball |
// | 3.02 | human cells · mice · never saw a screen · one patch … ball · another patch … paddle | two cells lift out (a head, a mouse beside them); a screen, struck; then the SENSE patch lights where the ball is, the MOVE bands push the paddle | icons · zones |
// | 3.03 | Hit the ball · tidy signal · Same every time · Miss · four seconds · static | a hit: four regular pulses over all electrodes, carried out to the ORDER strip as gold ticks; again; the miss: the ball bursts into 4 s of cool static that pours into the NOISE strip | pulses · static |
// | 3.04 | No reward · Just order · or chaos           | the court folds away; ORDER (gold ticks) and NOISE (cool static) side by side | strips glow |
// Deviation from shots.md 3.04: no pull back into the aisle here; MOTION.md §6 carries c03 → c04 on the ORDER strip (the rally counter
// grows out of it), and the aisle comes at 4.03 anyway (one aisle passage instead of two).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as B from '../lib/f19_b1_world.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo } = E;
const { COOL, NET, bump } = F;
const TAU = Math.PI * 2;

export const PRINT = F.PRINT19;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T);
  a.T0 = R.a; a.end = R.b;
  return [{ t: R.a, draw: scene(a, T), print: PRINT }];
};

const COURT = { u: .62, v: .47, pu: -.56, ph: .11, bl: -.53, br: .58 };    // walls, paddle x / half length, ball turn points
const C_PONG = B.cam2(1030, 540, .95);

function scene(a, T) {
  const K = [[a.T0, B.CANON], [a.pong - .4, C_PONG], [a.trick - .15, C_PONG], [a.hit + .4, B.C_STRIPS], ...B.k34(a)];
  const camAt = (t) => B.cam2Drift(B.cam2At(t, K), t, .6);
  // the ball: left contacts (paddle) — hits before the trick, then hit · hit · MISS on their words; right contacts half-way between
  const H2 = B.hit2(a), P0 = 2.6;
  const LC = []; for (let k = -6; k < 0; k++) LC.push(a.hit + k * P0 * ((a.hit - (a.pong + 1.3)) / (6 * P0)));
  LC.push(a.hit, H2, a.miss);
  const tLaunch = LC[0] - (LC[1] - LC[0]) / 2;
  const tri = (x) => 2 * Math.abs(2 * (x - Math.floor(x)) - 1) - 1;
  const ballV = (t) => .4 * tri((t - tLaunch) / 3.7 + .3);
  const tBurst = B.staticT(a);
  function ballU(t) {
    if (t < tLaunch) return null;
    const pts = [[tLaunch, COURT.br]];
    for (let k = 0; k < LC.length; k++) { pts.push([LC[k], COURT.bl]); if (k + 1 < LC.length) pts.push([(LC[k] + LC[k + 1]) / 2, COURT.br]); }
    if (t > LC[LC.length - 1]) { const sp = (COURT.br - COURT.bl) / ((LC[LC.length - 1] - LC[LC.length - 2]) / 2); return COURT.bl - sp * (t - LC[LC.length - 1]); }
    for (let k = 1; k < pts.length; k++) if (t <= pts[k][0]) return lerp(pts[k - 1][1], pts[k][1], (t - pts[k - 1][0]) / (pts[k][0] - pts[k - 1][0]));
    return COURT.bl;
  }
  const VC = LC.map((tc, k) => { const v = ballV(tc); return k === LC.length - 1 ? clamp(v + (v > 0 ? -.3 : .3), -.34, .34) : clamp(v, -.36, .36); });
  function paddleV(t) {
    if (t < LC[0] - 1.1) return lerp(0, VC[0], sineIO(span(t, tLaunch, LC[0] - .25)));
    for (let k = 0; k < LC.length; k++) if (t < LC[k] + .25 || k === LC.length - 1) { if (k === 0) return lerp(0, VC[0], sineIO(span(t, tLaunch, LC[0] - .25))); return lerp(VC[k - 1], VC[k], sineIO(span(t, LC[k - 1] + .25, LC[k] - .25))); }
    return VC[VC.length - 1];
  }
  const paddleVel = (t) => (paddleV(t + .05) - paddleV(t - .05)) / .1;
  const ticks = B.tickTimes(a), gauss = (x) => Math.exp(-x * x);
  const hits = [a.hit, H2];
  const rightSoma = NET.somas.map((s, i) => [i, s[0] - Math.abs(s[1]) * .5]).sort((p, q) => q[1] - p[1]).slice(0, 2).map((p) => p[0]);

  return (ctx, t) => {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const c = camAt(t), m = B.mapOf(c), z = c.z;
    B.night(ctx);
    const court = sineIO(span(t, a.four + .2, a.pong - .1)) * (1 - sineIO(span(t, a.noRew - .1, a.noRew + 1.1)));
    const pongOn = smooth(span(t, a.four, a.four + 1)) * (1 - smooth(span(t, a.noRew, a.order)));
    const bu = ballU(t), bv = ballV(t);
    const zonesOn = smooth(span(t, a.patch, a.patch + .6)) * (1 - smooth(span(t, a.miss - .3, a.miss + .2)));
    const senseOn = zonesOn, moveOn = smooth(span(t, a.activity - .2, a.activity + .5)) * (1 - smooth(span(t, a.miss - .3, a.miss + .2)));
    const statK = smooth(span(t, tBurst - .05, tBurst + .15)) * (1 - smooth(span(t, tBurst + 3.8, tBurst + 4.05)));
    const pv = paddleVel(t);
    // electrodes: sense (ball position), move (paddle motion), tidy pulses (hits), static (miss)
    const si = bu == null ? -1 : 2 + Math.round(clamp((bu - COURT.bl) / (COURT.br - COURT.bl)) * 3), sj = 2 + Math.round(clamp((bv + .4) / .8) * 3);
    const ePulse = (i, j) => {
      let p = 0;
      if (senseOn > 0 && i === si && j === sj) p = senseOn * (.55 + .45 * Math.cos(t * TAU * 6));
      if (moveOn > 0 && i >= 1 && i <= 6) { if (pv > .05 && j >= 6) p = Math.max(p, moveOn * clamp(pv * 1.4) * B.staticPulse(t, i, j, 1.3)); if (pv < -.05 && j <= 1) p = Math.max(p, moveOn * clamp(-pv * 1.4) * B.staticPulse(t, i, j, 1.3)); }
      for (const tk of ticks) if (t > tk - .15 && t < tk + .15) p = Math.max(p, gauss((t - tk) / .045));
      if (statK > 0) p = Math.max(p, B.staticPulse(t, i, j, statK));
      return p;
    };
    const fire = (i) => {
      let f = 0; const s = NET.somas[i];
      if (moveOn > 0 && ((pv > .05 && s[1] > .3) || (pv < -.05 && s[1] < -.3))) f = moveOn * clamp(Math.abs(pv) * 1.2) * B.staticFire(t, i, 1);
      for (const h of hits) { const k = (t - h - .1 - Math.hypot(s[0], s[1]) * .25) / .09; if (k > -3 && k < 3) f = Math.max(f, gauss(k) * .8); }
      if (statK > 0) f = Math.max(f, B.staticFire(t, i, statK));
      return f;
    };
    F.dish(ctx, t, m, { ...B.FIELD_DISH, ePulse, net: { lit: 1 - .62 * pongOn, ambient: 1 - .55 * pongOn, fire, w: 1 } });
    B.staticSpecks(ctx, t, m, statK * .9);
    zones(ctx, t, m, z, senseOn, moveOn, si, sj);
    drawCourt(ctx, t, m, z, court, bu, bv);
    // the tidy pulses leave the dish along the ORDER feed line (one spark per tick); the static pours along the NOISE feed line
    for (const tk of ticks) { const u = span(t, tk, tk + .35); if (u <= 0 || u >= 1) continue; const A = B.S(c, ...B.STRIP.feedO), Bp = B.S(c, B.STRIP.x0 - 14, B.STRIP.yO), e = expoOut(u); halo(ctx, lerp(A[0], Bp[0], e), lerp(A[1], Bp[1], e), 22 * z, .8, P.halo0, P.core0); }
    if (statK > 0) for (let q = 0; q < 6; q++) { const u = ((t - tBurst) * 1.6 + q / 6) % 1, A = B.S(c, ...B.STRIP.feedN), Bp = B.S(c, B.STRIP.x0 - 14, B.STRIP.yN); halo(ctx, lerp(A[0], Bp[0], u) + 4 * Math.sin(t * 40 + q), lerp(A[1], Bp[1], u) + 4 * Math.cos(t * 37 + q), 12 * z, .5 * statK, COOL.edge, COOL.core); }
    B.stripsDraw(ctx, t, c, a);
    icons(ctx, t, m, z);
    // PONG · 2022 from the court's top-right corner
    const lu = F.rise(span(t, a.pong - .15, a.pong + .6)) * (1 - expoIn(span(t, a.human - .7, a.human - .2)));
    if (lu > 0) { const [x, y] = m(COURT.u, COURT.v); B.tag(ctx, x + 4, y - 4, lu, 'PONG · 2022', null, { dx: 60, dy: -60 }); }
    ctx.restore();
    F.ladder(ctx, t, T);
  };

  // the court: top wall → far wall → bottom wall, one cool line drawing itself; the paddle; the ball
  function drawCourt(ctx, t, m, z, u, bu, bv) {
    if (u <= 0) return;
    const pts = [[-COURT.u, COURT.v], [COURT.u, COURT.v], [COURT.u, -COURT.v], [-COURT.u, -COURT.v]].map(([x, y]) => m(x, y));
    const seg = [0]; for (let k = 1; k < pts.length; k++) seg.push(seg[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    const L = seg[seg.length - 1] * u;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < pts.length; k++) { if (seg[k] <= L) ctx.lineTo(pts[k][0], pts[k][1]); else { const f = (L - seg[k - 1]) / (seg[k] - seg[k - 1]); ctx.lineTo(lerp(pts[k - 1][0], pts[k][0], f), lerp(pts[k - 1][1], pts[k][1], f)); break; } }
    ctx.strokeStyle = rgba(COOL.edge, .35); ctx.lineWidth = 12 * z; ctx.stroke();
    ctx.strokeStyle = rgba(mixHex(COOL.mid, COOL.core, .5), .95); ctx.lineWidth = Math.max(2, 4.5 * z); ctx.stroke();
    // the paddle (grows from its middle after the court), follows the cells
    const pu = expoOut(span(t, a.pong - .5, a.pong + .2)) * u;
    if (pu > 0) {
      const v = paddleV(t), [x0, y0] = m(COURT.pu, v - COURT.ph * pu), [x1, y1] = m(COURT.pu, v + COURT.ph * pu);
      ctx.strokeStyle = rgba(COOL.edge, .35); ctx.lineWidth = 22 * z; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = COOL.core; ctx.lineWidth = 10 * z; ctx.stroke();
    }
    // the ball (leaves the far wall on "Pong"; after the miss it flies on and bursts into the static)
    if (bu != null && t < tBurst + .1) {
      const grow = expoOut(span(t, tLaunch - .25, tLaunch + .15)), burst = span(t, tBurst - .08, tBurst + .1);
      const [x, y] = m(bu, bv), r = 11 * z * grow * (1 + 1.5 * burst);
      for (const h of [...hits, ...LC.slice(0, 6)]) { const hk = bump(t, h - .02, .35); if (hk > 0) halo(ctx, m(COURT.bl, ballV(h))[0], m(COURT.bl, ballV(h))[1], 50 * z, .6 * hk, hits.includes(h) ? P.halo0 : COOL.edge, COOL.core); }
      halo(ctx, x, y, r * 5, .55 * (1 - burst), COOL.edge, COOL.core);
      ctx.fillStyle = rgba(COOL.core, 1 - burst); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  // SENSE: the centre 4 × 4 patch (the electrode under the ball blinks); MOVE: the top and bottom bands (they push the paddle)
  function zones(ctx, t, m, z, so, mo, si, sj) {
    if (so <= 0 && mo <= 0) return;
    const rect = (i0, i1, j0, j1, col, u) => {
      const [x0, y0] = m(-.44 + i0 * .1257 - .055, -.44 + j1 * .1257 + .055), [x1, y1] = m(-.44 + i1 * .1257 + .055, -.44 + j0 * .1257 - .055);
      ctx.save(); ctx.setLineDash([7 * z, 7 * z]); ctx.strokeStyle = rgba(col, .9 * u); ctx.lineWidth = Math.max(1.5, 2.6 * z);
      ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 10 * z); ctx.stroke(); ctx.restore();
      return [x0, y0, x1, y1];
    };
    const lab = (s, x, y, u, col) => B.word(ctx, s, x, y, Math.round(28 * z), u, { col });
    const su = F.rise(span(t, a.where - .4, a.where + .4)) * (1 - expoIn(span(t, a.trick - .3, a.trick + .2)));
    if (so > 0) { const r = rect(2, 5, 2, 5, COOL.mid, so); lab('SENSE', r[2] + 12 * z, r[1] + 20 * z, su, COOL.core); }
    const mu = F.rise(span(t, a.moved - .3, a.moved + .5)) * (1 - expoIn(span(t, a.trick - .3, a.trick + .2)));
    if (mo > 0) { const r1 = rect(1, 6, 6, 7, P.halo0, mo); rect(1, 6, 0, 1, P.halo0, mo); lab('MOVE', r1[2] + 12 * z, r1[1] + 20 * z, mu, P.halo0); }
  }
  // two cells lift out of the dish (human, mouse) with their silhouettes; a screen, struck
  function icons(ctx, t, m, z) {
    const back = sineIO(span(t, a.patch - .5, a.patch + .4));
    [['head', a.human, 330, 150], ['mouse', a.mice, 590, 112]].forEach(([kind, t0, y, h], k) => {
      const go = sineIO(span(t, t0 - .5, t0 + .4)); if (go <= 0 || back >= 1) return;
      const [sx, sy] = F.somaAt(m, rightSoma[k]), tx = 1530, e = go * (1 - back);
      const x = lerp(sx, tx, e), yy = lerp(sy, y, e) - Math.sin(Math.PI * e) * 50, r = lerp(m.r * .016, 34, e);
      halo(ctx, x, yy, r * 3, .3 * e, P.halo1, P.core1);
      F.cell(ctx, t, x, yy, r, { kind: 'neuron', warm: 1, seed: k + 3 });
      // the silhouette rises from its baseline beside the cell (masked)
      const cu = expoOut(span(t, t0 - .1, t0 + .7)) * (1 - expoIn(span(t, a.patch - .5, a.patch + .1))), base = y + h * .45;
      if (cu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(1590, base - h * 1.4, 330, h * 1.4); ctx.clip(); F.creature(ctx, kind, 1710, base + (1 - cu) * h * 1.1, h, { fill: kind === 'head' ? .0 : 0 }); ctx.restore(); }
    });
    // the screen icon: rises, struck on "saw a screen"
    const su = expoOut(span(t, a.screen - .25, a.screen + .45)) * (1 - expoIn(span(t, a.patch - .5, a.patch + .1)));
    if (su > 0) {
      const base = 900, x = 1620, w = 200, h = 122;
      ctx.save(); ctx.beginPath(); ctx.rect(x - 150, base - 200, 300, 202); ctx.clip(); ctx.translate(0, (1 - su) * 200);
      ctx.fillStyle = mixHex(P.night1, COOL.deep, .5); ctx.strokeStyle = rgba(COOL.mid, .85); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(x - w / 2, base - 26 - h, w, h, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rgba(COOL.mid, .7); ctx.fillRect(x - 6, base - 26, 12, 18); ctx.fillRect(x - 34, base - 9, 68, 7);
      ctx.restore();
      const st = expoOut(span(t, a.saw + .1, a.saw + .45)) * (1 - expoIn(span(t, a.patch - .5, a.patch + .1)));
      if (st > 0) { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(COOL.core, .95); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - 120, base + 4); ctx.lineTo(x - 120 + 240 * st, base + 4 - 190 * st); ctx.stroke(); ctx.restore(); }
    }
  }
}
