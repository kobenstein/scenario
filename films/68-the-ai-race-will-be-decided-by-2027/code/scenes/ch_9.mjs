// Film 68 · 9 WHO WINS (v1–v6) + END (e1, LEITBILD 4, 15 s end screen with free tile areas). Numbers: faktencheck.md K73–K76.
// End-screen tiles (as #67): left {80,600,640,360}, right {1200,600,640,360}, subscribe circle {960,900,r80} — kept calm from endT.
import * as K from '../lib/f68_kit.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, rise, halo, rgba, mixHex, TAU, US, CN, AI, GOLD, CREAM, MUTED } = K;
const RACE = (t, ph0 = 0, k = 8) => t * k + ph0;
const DIM = (ctx, x, y, w, h, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = P.night0; ctx.fillRect(x, y, w, h); ctx.restore(); };

export default {
  // ---------------------------------------------------------------- v1 who wins? today America; a machine it can't control is no win; the third runner first: everybody loses
  v1(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1300, gy: 520, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 1300, fy: 560 });
    const y0 = 400, pitch = 170, fx = lerp(330, 1800, .86);
    const lose = U('everybody loses', 1.0, -.3), third = span(t, G('third runner gets there first') - .2, G('third runner gets there first') + 1.6);
    K.track(ctx, t, { x0: 330, x1: 1800, y0, pitch, u: IN(.8), finish: 1, fx: .86, lanes: [{ col: US, label: 'AMERICA' }, { col: CN, label: 'CHINA' }, { col: AI, label: 'THE AI', glow: .4 * third }] });
    K.cap(ctx, 'WHO WINS?', 960, 170, IN(.8) * (1 - U('Today, America', .6, .3)), { size: 40, align: 'center', col: GOLD.text, glow: true });
    // the runners approach; America a little ahead today
    const go = span(t, S.a, G('with a machine it') + 1.2), xu = lerp(700, fx - 60, sineIO(go)), xc = xu - 90;
    K.runner(ctx, xu, y0 + 52, 130, RACE(t), { col: US, a: 1 - .6 * lose });
    K.runner(ctx, xc, y0 + pitch + 52, 130, RACE(t, 2), { col: CN, a: 1 - .6 * lose });
    K.tag(ctx, 'TODAY: AHEAD', xu, y0 - 120, U('Today, America', .7, -.2) * (1 - U('with a machine it', .5, 0)), { size: 22, col: US.text, fill: P.night0 });
    // a machine it can't control: the disc slips out of the hands and swells
    const mc = U('with a machine it', 1.6, -.2), nw = U("that's not a win", .7, -.2);
    if (mc > 0) { const r = lerp(16, 120, expoOut(mc)), ox = xu + 30 + 60 * Math.sin(t * 2.3) * mc, oy = y0 - 10 - 120 * expoOut(mc) + 14 * Math.sin(t * 3.1);
      K.orb(ctx, t, ox, oy, r, { rings: 3, pulse: .8, a: 1 - .6 * third });
      K.cap(ctx, "A MACHINE IT CAN'T CONTROL", ox - r - 40, oy - 10, mc * (1 - third), { size: 24, align: 'right', col: AI.text });
      K.cap(ctx, 'NOT A WIN', ox - r - 40, oy + 32, nw * (1 - third), { size: 32, align: 'right', col: GOLD.text }); }
    // the third runner crosses first
    const ox3 = lerp(400, fx + 160, sineIO(third));
    K.orb(ctx, t, ox3, y0 + 2 * pitch, 44, { rings: 3, pulse: .6 + third, a: clamp(IN(.8, .5)), dark: 1 - clamp(third * 2 + .2) });
    // everybody loses: the lanes go dark
    DIM(ctx, 330, y0 - pitch / 2, 1470, pitch * 2, .55 * lose);
    K.cap(ctx, 'EVERYBODY LOSES', 960, 900, lose, { size: 40, align: 'center', col: CREAM, glow: true });
    ctx.restore();
  },
  // ---------------------------------------------------------------- v2 three open roads: agreements, deterrence, a lead with rules — none decided
  v2(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 380, ga: .26 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.04, z1: 1.0, fx: 960, fy: 600 });
    K.cap(ctx, 'THE ROADS TO A REAL WIN', 960, 140, U('still open', .8, -.6), { size: 30, align: 'center', col: GOLD.text });
    const roads = [['AGREEMENTS', 420, 'Agreements, like that channel'], ['DETERRENCE', 960, 'Deterrence, where each'], ['A LEAD WITH RULES', 1500, 'Or a lead that comes']];
    const qu = U('Serious people disagree', 1.0, -.2);
    roads.forEach(([label, ex, ph], i) => {
      const ru = Math.max(IN(1.4, .2 + i * .15) * .55, U(ph, 1.0, -.4)), lit = U(ph, .8, -.2);
      K.lightLine(ctx, [[960, 830], [lerp(960, ex, .5), 650], [ex, 470]], 0, ru, lit > 0 ? GOLD : { body: MUTED, line: MUTED }, { w: 4, head: true, a: .5 + .5 * lit });
      K.cap(ctx, label, ex, 260, lit, { size: 32, align: 'center', col: GOLD.text });
      if (lit > 0) {
        if (i === 0) { K.lightLine(ctx, [[ex - 110, 380], [ex + 110, 380]], 0, lit, GOLD, { w: 3, head: true }); for (const sx of [-1, 1]) { ctx.save(); ctx.globalAlpha *= lit; ctx.fillStyle = sx < 0 ? US.body : CN.body; ctx.beginPath(); ctx.arc(ex + sx * 120, 380, 16, 0, TAU); ctx.fill(); ctx.restore(); } }
        else if (i === 1) { const pushx = 8 * Math.sin(t * 2.4); ctx.save(); ctx.globalAlpha *= lit; ctx.fillStyle = US.body; ctx.beginPath(); ctx.roundRect(ex - 120 + pushx, 350, 110, 60, 14); ctx.fill(); ctx.fillStyle = CN.body; ctx.beginPath(); ctx.roundRect(ex + 10 + pushx, 350, 110, 60, 14); ctx.fill(); ctx.restore(); K.cap(ctx, 'EACH CAN STOP THE OTHER', ex, 450, lit, { size: 20, align: 'center', col: MUTED }); }
        else { ctx.save(); ctx.globalAlpha *= lit; ctx.fillStyle = mixHex(CREAM, GOLD.hot, .15); ctx.beginPath(); ctx.arc(ex, 375, 46, 0, TAU); ctx.fill(); ctx.strokeStyle = mixHex(CN.body, GOLD.mid, .35); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(ex, 375, 41, 0, TAU); ctx.stroke(); ctx.restore(); K.cap(ctx, 'RULES + A SPEED LIMIT', ex, 450, lit, { size: 20, align: 'center', col: MUTED }); }
      }
      K.big(ctx, '?', ex, 600, 90, span(qu, i * .15, i * .15 + .6));
    });
    K.cap(ctx, 'NONE IS DECIDED', 960, 900, U('None is decided', .8, -.2), { size: 40, align: 'center', col: CREAM, glow: true });
    K.src(ctx, t, G('Deterrence, where each'), G('Or a lead that comes') + 2, 'Deterrence: Hendrycks, Schmidt, Wang, Superintelligence Strategy, Mar 2025');
    ctx.restore();
  },
  // ---------------------------------------------------------------- v3 who decides: a handful of labs, two governments, the people — you
  v3(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 520, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 1500, fy: 600 });
    K.cap(ctx, 'THE DECISION SITS WITH', 960, 170, IN(.8), { size: 28, align: 'center', col: MUTED });
    const lu = U('handful of labs', .9, -.3), gu = U('two governments', .9, -.3), pu = U('the people they answer', 1.0, -.3), yu = U('That includes you', 1.0, -.3);
    for (let i = 0; i < 5; i++) K.icon(ctx, 'datacenter', 210 + i * 90, 560, 70, rise(span(lu, i * .1, i * .1 + .5)), { col: { body: mixHex(P.blue2, AI.body, .3), line: AI.line, deep: P.ind1 } });
    K.cap(ctx, 'A HANDFUL OF LABS', 390, 680, lu, { size: 26, align: 'center', col: lu > 0 && gu < 1 ? GOLD.text : CREAM });
    K.icon(ctx, 'capitol', 860, 560, 110, gu, { col: { body: US.body, line: US.line, deep: US.deep } });
    K.icon(ctx, 'gate', 1060, 560, 110, gu, { col: { body: CN.body, line: CN.line, deep: CN.deep } });
    K.cap(ctx, 'TWO GOVERNMENTS', 960, 680, gu, { size: 26, align: 'center', col: gu > 0 && pu < 1 ? GOLD.text : CREAM });
    for (let i = 0; i < 9; i++) { const e = rise(span(pu, i * .06, i * .06 + .5)); if (e > 0) K.folk(ctx, 1320 + (i % 5) * 80 + (i > 4 ? 40 : 0), 600 + (i > 4 ? 40 : 0), 110, { a: e * .9, light: .5, look: .8 }); }
    K.cap(ctx, 'THE PEOPLE THEY ANSWER TO', 1500, 720, pu, { size: 26, align: 'center', col: GOLD.text });
    if (yu > 0) { halo(ctx, 1500, 860, 180, .35 * yu, GOLD.halo, GOLD.core); K.du(ctx, 1520, 890 - 30 * expoOut(yu), 150, { pose: 'look', look: 1 }); }
    K.cap(ctx, 'THAT INCLUDES YOU', 1400, 880, yu, { size: 30, align: 'right', col: GOLD.text, glow: true });
    ctx.restore();
  },
  // ---------------------------------------------------------------- v4 one channel, one sentence: a start, not a finish
  v4(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 400, ga: .26 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1.0, fx: 960, fy: 450 });
    K.cap(ctx, 'SO FAR', 960, 170, IN(.7), { size: 28, align: 'center', col: MUTED });
    K.big(ctx, '1 channel', 640, 330, 96, U('So far, they have one', .8, .2));
    K.big(ctx, '1 sentence', 1280, 330, 96, U('one sentence', .8, -.2));
    const x0 = 260, x1 = 1660, n = 10, su = U('A start', .8, -.2);
    for (let i = 0; i < n; i++) { const x = lerp(x0, x1, i / n) + 6, w = (x1 - x0) / n - 12, lit = i === 0 ? su : 0;
      ctx.save(); ctx.globalAlpha *= IN(.8, .3); ctx.fillStyle = lit > 0 ? mixHex(P.blue1, GOLD.hot, lit) : rgba(P.blue1, .55); ctx.beginPath(); ctx.roundRect(x, 600, w, 40, 8); ctx.fill(); ctx.restore(); if (lit > 0) halo(ctx, x + w / 2, 620, 120, .35 * lit, GOLD.halo, GOLD.core); }
    K.cap(ctx, 'START', x0, 700, IN(.8, .3), { size: 24, col: CREAM });
    K.cap(ctx, 'FINISH', x1, 700, IN(.8, .3), { size: 24, align: 'right', col: MUTED });
    K.cap(ctx, 'A START', 960, 820, su, { size: 36, align: 'center', col: GOLD.text });
    K.cap(ctx, 'NOT A FINISH', 960, 880, U('Not a finish', .7, -.1), { size: 30, align: 'center', col: MUTED });
    ctx.restore();
  },
  // ---------------------------------------------------------------- v5 2027 as twelve months of light: we'll know before it's over
  v5(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 460, ga: .28 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.05, fx: 960, fy: 470 });
    K.cap(ctx, 'IF THE FORECASTERS ARE RIGHT', 960, 200, U('those forecasters', .8, -.4), { size: 28, align: 'center', col: MUTED });
    K.big(ctx, '2027', 960, 400, 170, IN(.9, .2));
    const M = 'JFMAMJJASOND', fill = span(t, S.a + .8, S.b - .3);
    for (let i = 0; i < 12; i++) { const x = 300 + i * 110, e = clamp(fill * 12 - i);
      ctx.save(); ctx.globalAlpha *= IN(.8, .4); ctx.fillStyle = e > 0 ? mixHex(P.blue1, GOLD.hot, e * .8) : rgba(P.blue1, .5); ctx.beginPath(); ctx.roundRect(x, 520, 90, 90, 12); ctx.fill(); ctx.restore();
      if (e > 0) halo(ctx, x + 45, 565, 70, .25 * e, GOLD.halo, GOLD.core);
      K.cap(ctx, M[i], x + 45, 578, IN(.8, .4), { size: 28, align: 'center', col: e > .5 ? P.night0 : CREAM }); }
    K.cap(ctx, "WE'LL KNOW BEFORE IT'S OVER", 960, 760, U("we'll know before", .8, -.2), { size: 36, align: 'center', col: GOLD.text, glow: true });
    ctx.restore();
  },
  // ---------------------------------------------------------------- v6 one way to win: everyone crosses together — or the third runner alone
  v6(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1200, gy: 420, ga: .26, gcol: GOLD.mid });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.05, z1: 1.0, fx: 960, fy: 640 });
    const tg = G('Everyone crosses the line together'), al = U('Or the third runner', 1.0, -.2);
    const fx = 1100, gx = lerp(470, 1380, sineIO(span(t, S.a, tg + 2.2)));
    // the line
    ctx.save(); ctx.globalAlpha *= IN(.7); for (let k = 0; k < 16; k++) { ctx.fillStyle = k % 2 ? rgba(CREAM, .85) : rgba(P.night0, .8); ctx.fillRect(fx - 6, 400 + k * 30, 12, 30); } ctx.restore();
    ctx.fillStyle = rgba(mixHex(P.ind0, '#3a2a40', .25), .55); ctx.fillRect(0, 880, W, 4);
    K.cap(ctx, 'ONE WAY TO WIN', 960, 170, U('only one way to win', .8, -.3), { size: 34, align: 'center', col: GOLD.text, glow: true });
    // the group: both runners and the people, holding the disc between them
    const ga = 1 - .7 * al * (.75 + .25 * Math.sin(t * 9));
    const grp = [[-330, US, 'r'], [-220, null], [-115, null, 'du'], [0, null], [115, CN, 'r'], [220, null], [320, null]];
    grp.forEach(([dx, col, kind], i) => { const x = gx + dx, y = 860;
      if (kind === 'r') K.runner(ctx, x, y - 10, 190, RACE(t, i, 6), { col, a: ga, lean: .06 });
      else if (kind === 'du') { ctx.save(); ctx.globalAlpha *= ga; K.du(ctx, x, y, 190, { pose: 'look', look: .8 }); ctx.restore(); }
      else K.folk(ctx, x, y, 175 + (i * 23 % 3) * 10, { a: .9 * ga, light: .6, look: .9 }); });
    const ox = al > 0 ? lerp(gx, 1680, sineIO(al)) : gx, oy = al > 0 ? lerp(500, 600, al) : 500 + 6 * Math.sin(t * 1.6);
    if (al <= 0) for (const dx of [-220, 0, 220]) { ctx.save(); ctx.globalAlpha *= .5; ctx.strokeStyle = rgba(AI.line, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx + dx, 690); ctx.lineTo(ox, oy + 60); ctx.stroke(); ctx.restore(); }
    K.orb(ctx, t, ox, oy, 84, { rings: 3, pulse: .4 + al });
    K.cap(ctx, 'EVERYONE CROSSES TOGETHER', 960, 240, U('Everyone crosses the line together', .9, -.2) * (1 - clamp(al * 3)), { size: 30, align: 'center', col: CREAM });
    K.cap(ctx, 'OR THE THIRD RUNNER CROSSES ALONE', 960, 240, span(al, .35, 1), { size: 30, align: 'center', col: AI.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- e1 LEITBILD 4 · the end: the board says it; subscribe; then a calm end screen
  e1(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    const endT = S.b - 15, pull = sineIO(span(t, endT - 2.5, endT + .5));
    ctx.save(); ctx.translate(960, 0); ctx.scale(lerp(1.06, .8, pull) - .06 * (1 - sineIO(IN(6))) * 0, lerp(1.06, .8, pull)); ctx.translate(-960, 0);
    ctx.translate(drift(t, 3, 5), drift(t, 2, 9));
    K.stadium(ctx, t, { title: 'AI RACE', score: false, u: 1, third: 1, thirdLit: .55 + .05 * Math.sin(t * .8), thirdLabel: '', duX: 960, duPose: 'look', floods: .9,
      mid(ctx, bx, by, bw, bh) {
        const sw = U('goes well for everybody', 1.0, -.7);
        K.cap(ctx, 'ONE WAY TO WIN', bx + bw / 2, by + 300, IN(1.2) * (1 - sw), { size: 34, align: 'center', col: GOLD.text });
        K.serif(ctx, 'everyone crosses together', bx + bw / 2, by + 410, 76, IN(1.4, .4) * (1 - sw), { align: 'center' });
        K.serif(ctx, 'for everybody', bx + bw / 2, by + 390, 96, sw, { align: 'center' });
        K.cap(ctx, 'NOT JUST FOR WHOEVER RUNS FASTEST', bx + bw / 2, by + 460, U('whoever runs fastest', .8, -.3), { size: 26, align: 'center', col: MUTED });
      } });
    // the disc rests in the lit lane, calm
    K.orb(ctx, t, 960, 654, 26, { rings: 2, pulse: .25 });
    ctx.restore();
    // subscribe (before the end screen; then the YouTube element takes over)
    const su = U('Then subscribe', .8, -.35) * (1 - span(t, endT - 2, endT - .8));
    if (su > 0) { const k = expoOut(su), bw = 360 * k, by = 740;
      halo(ctx, 960, by + 40, 300, .35 * su, GOLD.halo, GOLD.core);
      ctx.save(); ctx.globalAlpha *= clamp(su * 3); ctx.fillStyle = mixHex(GOLD.mid, GOLD.hot, .4 + .1 * Math.sin(t * 2)); ctx.beginPath(); ctx.roundRect(960 - bw / 2, by, bw, 80, 40); ctx.fill(); ctx.restore();
      K.cap(ctx, 'SUBSCRIBE', 960, by + 52, rise(span(su, .3, 1)), { size: 32, align: 'center', col: P.night0 }); }
  },
};
const drift = (t, a, s) => a * Math.sin(t * .23 + s) + a * .5 * Math.sin(t * .37 + s * 2);
