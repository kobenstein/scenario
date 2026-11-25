// Film 68 · HOOK (h1–h8). Draws keyed by shot id (scenes/plan.mjs). Skills: scenario-motion, world-class-motion-design, fluid-motion-design,
// motion-director-gates, dataviz. One motif per sentence; every shot grows from S.in (the baton's landing point).
import * as K from '../lib/f68_kit.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, rise, halo, rgba, mixHex, TAU, US, CN, AI, GOLD, CREAM, MUTED } = K;

const RACE = (t, ph0 = 0, k = 7) => t * k + ph0;

export default {
  // ---------------------------------------------------------------- h1 LEITBILD 1: the stadium, 2027 rolls in
  h1(ctx, t, S, T) {
    const { G, U } = K.phr(T, S, t);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.07, fx: 960, fy: 330 });
    K.stadium(ctx, t, {
      title: 'AI RACE', score: false, u: clamp(t / 1.4), duX: 960, third: 0,
      mid(ctx, bx, by, bw, bh) {
        const u27 = U('twenty twenty-seven', 1.1, -.15);
        K.cap(ctx, 'DECIDED BY', bx + bw / 2, by + 270, U('decided', .7, -.1), { size: 30, align: 'center', col: GOLD.text });
        if (u27 > 0) K.counter(ctx, t, bx + bw / 2, by + 420, 150, 2019, 2027, u27, (v) => String(Math.round(v)), { serif: false, col: '#fff6d8' });
        const un = U('new forecast', .7, -.1);
        if (un > 0) { ctx.save(); ctx.globalAlpha *= clamp(un * 3); ctx.strokeStyle = rgba(GOLD.line, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(bx + bw / 2 - 210, by + 448, 420 * expoOut(un), 40, 20); ctx.stroke(); ctx.restore();
          K.cap(ctx, 'NEW FORECAST · NOV 2026', bx + bw / 2, by + 477, un, { size: 22, align: 'center', col: GOLD.text }); }
        const uy = U('Next year', .7, -.1);
        if (uy > 0) { halo(ctx, bx + bw / 2, by + 370, 360 * uy, .25 * uy, GOLD.halo, GOLD.core); K.cap(ctx, 'NEXT YEAR', bx + bw - 150, by + 400, uy, { size: 30, align: 'center', col: '#fff6d8', glow: true }); K.cap(ctx, '', 0, 0, 0); }
      },
    });
    ctx.restore();
  },
  // ---------------------------------------------------------------- h2 the prize: medal → a machine that out-thinks every one of us
  h2(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 380, ga: .3 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: .98, fy: 500 });
    const flip = U("It's a machine", 1.0, -.1), grow = sineIO(U('out-thinks', 2.2, -.2));
    const y = lerp(420, 300, grow), r = lerp(100, 210, grow) * expoOut(IN(.8));
    // the medal on its ribbon (before the flip)
    const sx = Math.cos(Math.PI * Math.min(1, flip));   // 1 → -1: the face turns over
    if (flip < .5) {
      ctx.save(); ctx.globalAlpha *= 1 - clamp((flip - .4) * 10);
      ctx.fillStyle = mixHex(US.deep, P.night1, .3); ctx.beginPath(); ctx.moveTo(900, 120); ctx.lineTo(960, y - r * .8); ctx.lineTo(1020, 120); ctx.lineTo(990, 120); ctx.lineTo(960, y - r * 1.2); ctx.lineTo(930, 120); ctx.closePath(); ctx.fill();
      ctx.translate(960, y); ctx.scale(Math.max(.02, Math.abs(sx)), 1);
      halo(ctx, 0, 0, r * 2.4, .3, GOLD.halo, GOLD.core);
      ctx.fillStyle = K.rad(ctx, -r * .3, -r * .3, r * 1.2, [[0, GOLD.hot], [.6, GOLD.body], [1, GOLD.shade]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.deep, .5); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, r * .78, 0, TAU); ctx.stroke();
      ctx.restore();
      K.cap(ctx, 'NOT A MEDAL', 960, y + r + 90, U('medal', .7, -.2) * (1 - clamp(flip * 3)), { size: 30, align: 'center', col: GOLD.text });
    } else {
      ctx.save(); ctx.translate(960, y); ctx.scale(Math.max(.02, Math.abs(sx)), 1); K.orb(ctx, t, 0, 0, r, { rings: 3 }); ctx.restore();
    }
    // a long row of people, the disc rises above all of them
    const pu = U('every one of us', 1.6, -.4);
    for (let i = 0; i < 22; i++) { const e = rise(span(pu, i / 22 * .6, i / 22 * .6 + .4)); if (e <= 0) continue; K.folk(ctx, 170 + i * 75 + (i % 2) * 10, 930 + (1 - e) * 30, 120 + (i * 37 % 5) * 6, { a: e, look: .8, light: .5 }); }
    K.cap(ctx, 'OUT-THINKS EVERY ONE OF US', 960, 560, U('every one of us', .8, 0), { size: 28, align: 'center', col: AI.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- h3 you live with the winner: phone, bank, hospital
  h3(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 330, ga: .3 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.05, fy: 700 });
    K.orb(ctx, t, 960, lerp(330, 250, sineIO(IN(2))), lerp(210, 120, sineIO(IN(1.6))), {});
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = K.rad(ctx, 960, 960, 300, [[0, rgba(GOLD.hot, .25)], [1, rgba(GOLD.hot, 0)]]); ctx.fillRect(600, 760, 720, 320); ctx.restore();
    const items = [['phone', 'In your phone', 520, 640, 'PHONE'], ['bank', 'In your bank', 960, 520, 'BANK'], ['hospital', 'In your hospital', 1400, 640, 'HOSPITAL']];
    for (const [k, p, x, y, lab] of items) {
      const u = U(p, .8, -.15); if (u <= 0) continue;
      K.lightLine(ctx, [[960, 300], [x, y]], 0, sineIO(clamp(u * 1.3)), AI, { w: 1.5, a: .5 });
      K.icon(ctx, k, x, y, 120, u, { col: { body: mixHex(P.blue1, CREAM, .25), line: CREAM, deep: P.night1 } });
      K.orb(ctx, t, x, y - 4, 18 * rise(span(u, .4, 1)), { rings: 2 });
      K.cap(ctx, lab, x, y + 110, u, { size: 26, align: 'center' });
    }
    K.cap(ctx, 'THE WINNER', 960, 420, U('live with the winner', .8, 0) * (1 - U('In your bank', .4, -.6)), { size: 30, align: 'center', col: AI.text });
    const E = (K.du); E(ctx, 960, 960, 230, { pose: 'look', look: 1 });
    ctx.restore();
  },
  // ---------------------------------------------------------------- h4 who wins? two lanes
  h4(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1300, gy: 500, ga: .22 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1, fx: 1300 });
    K.track(ctx, t, { x0: 300, x1: 1800, y0: 440, pitch: 190, u: IN(.9), lanes: [{ col: US, label: 'AMERICA', glow: U('America', .6) }, { col: CN, label: 'CHINA', glow: U('China', .6) }] });
    K.cap(ctx, 'AMERICA', 360, 380, U('America', .6, -.1), { size: 30, col: US.text });
    K.cap(ctx, 'CHINA', 360, 570, U('China', .6, -.1), { size: 30, col: CN.text });
    const x = 520 + (t - S.a) * 40;
    K.runner(ctx, x, 510, 150, RACE(t, 0, 6), { col: US, a: IN(.7) });
    K.runner(ctx, x + 6, 700, 150, RACE(t, 1.6, 6), { col: CN, a: IN(.7, .1) });
    K.big(ctx, '?', 1500, 640, 260, IN(.8, .05));
    ctx.restore();
  },
  // ---------------------------------------------------------------- h5 the scorecard: best chips, most computing power, not a blowout
  h5(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 300, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.03, fy: 400 });
    const r1 = U('best chips', .9, -.2), r2 = U('computing power', .9, -.2);
    K.scorecard(ctx, t, { y: 170, u: IN(.9), head: 'THE SCOREBOARD', rows: [
      { label: 'THE BEST CHIPS', u: r1, win: 'US', wu: U('best chips', .8, .4) },
      { label: 'MOST OF THE COMPUTING POWER', u: r2, win: 'US', wu: U('computing power', .8, .4) }] });
    // not a blowout: the balance needle barely leans to America
    const nb = U('not a blowout', .9, -.3);
    if (nb > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(nb * 3);
      ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(560, 800); ctx.lineTo(1360, 800); ctx.stroke();
      ctx.fillStyle = US.body; ctx.fillRect(560, 794, 10, 12); ctx.fillStyle = CN.body; ctx.fillRect(1350, 794, 10, 12);
      const nx = lerp(960, 900, sineIO(nb)); K.halo(ctx, nx, 800, 50, .5, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(nx, 800, 12, 0, TAU); ctx.fill();
      ctx.restore();
      K.cap(ctx, 'NOT A BLOWOUT', 960, 870, nb, { size: 34, align: 'center', col: GOLD.text });
    }
    ctx.restore();
  },
  // ---------------------------------------------------------------- h6 round by round: 2 : 2, dead even
  h6(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 300, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.01, z1: 1.04, fy: 300 });
    const t0 = G('round by round') + .1, ds = .42;
    const rows = [['ROUND 1 · THE MACHINES', 'US'], ['ROUND 2 · THE CHIPS', 'US'], ['ROUND 3 · POWER', 'CN'], ['ROUND 4 · BUILDERS AND BODIES', 'CN']].map(([l, w], i) => ({ label: l, win: w, u: span(t, t0 + i * ds - .2, t0 + i * ds + .4), wu: span(t, t0 + i * ds + .3, t0 + i * ds + .9) }));
    const us = rows.filter((r) => r.win === 'US' && r.wu > .9).length, cn = rows.filter((r) => r.win === 'CN' && r.wu > .9).length;
    K.scorecard(ctx, t, { y: 90, u: IN(.6), us, cn, rows, rh: 80 });
    const de = U('Dead even', .8, -.15);
    if (de > 0) { K.halo(ctx, 960, 770, 300, .25 * de, GOLD.halo, GOLD.core); K.big(ctx, 'DEAD EVEN', 960, 810, 90, de, { serif: true }); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- h7 a tie gets settled at the finish line
  h7(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1500, gy: 540, ga: .25, stars: 60 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.08, fx: 1500, fy: 560 });
    K.track(ctx, t, { x0: 120, x1: 1800, y0: 470, pitch: 190, u: IN(.8), finish: U('finish line', .8, -.4), fx: .84, lanes: [{ col: US, label: '' }, { col: CN, label: '' }] });
    const p = span(t, S.a, S.b + .5), x = lerp(260, 1330, p);
    K.runner(ctx, x, 540, 160, RACE(t, 0, 8.5), { col: US });
    K.runner(ctx, x + 10 * Math.sin(t * 1.3), 730, 160, RACE(t, 2, 8.5), { col: CN });
    // the tape
    const fu = U('finish line', .8, -.4); if (fu > 0) { ctx.save(); ctx.globalAlpha *= fu; ctx.strokeStyle = CREAM; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1530, 360); ctx.quadraticCurveTo(1520 + 6 * Math.sin(t * 3), 560, 1530, 760); ctx.stroke(); ctx.restore(); K.cap(ctx, 'THE FINISH LINE', 1530, 330, fu, { size: 28, align: 'center', col: GOLD.text }); }
    ctx.restore();
  },
  // ---------------------------------------------------------------- h8 another lane: no flag, no country, could beat them both
  h8(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1500, gy: 700, ga: .2, gcol: AI.deep, stars: 60 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.06, z1: 1.0, fx: 1200, fy: 560 });
    const lane3 = U('another lane', 1.0, -.3), beat = U('beat them both', 1.6, -.5);
    K.track(ctx, t, { x0: 120, x1: 1800, y0: 360, pitch: 170, u: 1, finish: 1, fx: .84, lanes: [{ col: US, label: '' }, { col: CN, label: '' }, { col: AI, label: '', glow: .3 * lane3 + .7 * beat, a: lane3 }] });
    if (lane3 < 1) { ctx.save(); ctx.fillStyle = P.night0; ctx.fillRect(120 + 1680 * expoOut(lane3), 615, 1700, 170); ctx.restore(); }
    const x = 1230 + (t - S.a) * 12;
    K.runner(ctx, x, 420, 140, RACE(t, 0, 8), { col: US });
    K.runner(ctx, x - 14, 590, 140, RACE(t, 2, 8), { col: CN });
    // the empty flag slot and the blank label of the third lane
    const nf = U('No flag', .7, -.1), nc = U('No country', .7, -.1);
    if (nf > 0) { ctx.save(); ctx.globalAlpha *= nf; ctx.strokeStyle = rgba(MUTED, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(250, 760); ctx.lineTo(250, 640); ctx.stroke(); ctx.setLineDash([8, 8]); ctx.strokeRect(254, 640, 120 * expoOut(nf), 70); ctx.restore(); K.cap(ctx, 'NO FLAG', 314, 740, nf, { size: 22, align: 'center', col: MUTED }); }
    if (nc > 0) { ctx.save(); ctx.globalAlpha *= nc; ctx.strokeStyle = rgba(MUTED, .8); ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.strokeRect(420, 668, 260 * expoOut(nc), 50); ctx.restore(); K.cap(ctx, 'NO COUNTRY', 550, 702, nc, { size: 22, align: 'center', col: MUTED }); }
    // the third runner: a disc of light that rolls past both
    const ox = lerp(120, 1560, sineIO(beat)) , oa = clamp(U('another lane', .8, .3) * 1);
    if (oa > 0) K.orb(ctx, t, beat > 0 ? ox : 160, 700, 46, { a: oa, dark: 1 - clamp(beat * 1.5), pulse: .6 });
    K.cap(ctx, 'COULD BEAT THEM BOTH', 1500, 860, U('beat them both', .8, .2), { size: 28, align: 'center', col: AI.text });
    ctx.restore();
  },
};
