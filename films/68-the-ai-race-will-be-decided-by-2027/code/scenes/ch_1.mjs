// Film 68 · CHAPTER 1 "So who says 2027?" (f1–f6). Explainer graphics in the editorial-night look; numbers and claims from faktencheck.md.
import * as K from '../lib/f68_kit.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, rise, halo, rgba, mixHex, TAU, US, CN, AI, GOLD, CREAM, MUTED, PAPER } = K;

// the forecast timeline: years → x
const TX = (y, x0 = 240, y0 = 2026, k = 190) => x0 + (y - y0) * k;
function axis(ctx, t, u, y = 640, from = 2026, to = 2033, o = {}) {
  const x0 = TX(from), x1 = TX(to + .02);
  K.lightLine(ctx, [[x0, y], [x1, y]], 0, expoOut(u), { body: P.blue1, line: mixHex(P.blue1, CREAM, .3) }, { w: 2.5 });
  for (let yr = from; yr <= to; yr++) { const e = rise(span(u, (yr - from) / (to - from + 1) * .7, (yr - from) / (to - from + 1) * .7 + .3)); if (e <= 0) continue;
    ctx.save(); ctx.globalAlpha *= e; ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(TX(yr), y - 12); ctx.lineTo(TX(yr), y + 12); ctx.stroke(); ctx.restore();
    K.cap(ctx, String(yr), TX(yr), y + 52, e, { size: 28, align: 'center', col: o.hi === yr ? GOLD.text : MUTED }); }
}
function pin(ctx, x, y, u, label, o = {}) {
  if (u <= 0) return; const h = o.h ?? 170, k = expoOut(clamp(u));
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  K.lightLine(ctx, [[x, y], [x, y - h * k]], 0, 1, o.col ?? GOLD, { w: 2.5 });
  halo(ctx, x, y - h * k, 46, .5, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y - h * k, 11, 0, TAU); ctx.fill();
  ctx.restore();
  if (label) K.cap(ctx, label, x, y - h * k - 30, u, { size: o.size ?? 28, align: 'center', col: GOLD.text });
}

export default {
  // ---------------------------------------------------------------- f1 who says 2027: the forecast's authors, a nonprofit
  f1(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1300, gy: 450, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.04, fx: 1100, fy: 500 });
    const q = IN(.9), lift = sineIO(U('The authors', 1.0, -.2));
    K.big(ctx, '2027?', lerp(960, 560, lift), lerp(560, 470, lift), lerp(240, 190, lift), q);
    const cu = U('best-known forecast', .9, -.6);
    K.doc(ctx, t, 1030, 230, 600, 440, { u: cu, head: 'THE BEST-KNOWN FORECAST IN THIS FIELD', lines: [['AI 2027', 96, 1], ['AI Futures Project', 40, 0], ['a scenario forecast, first published 2025', 26, 0, false]], src: 'blog.aifutures.org · update 10 Nov 2026' });
    const ns = U("don't sell", .7, -.1), np = U('nonprofit', .8, -.1);
    if (ns > 0) { ctx.save(); ctx.globalAlpha *= ns; ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(1030, 720, 380 * expoOut(ns), 52, 26); ctx.stroke(); ctx.restore(); K.cap(ctx, 'NO PRODUCT TO SELL', 1220, 756, ns, { size: 26, align: 'center' }); }
    if (np > 0) { ctx.save(); ctx.globalAlpha *= np; ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(1030, 800, 460 * expoOut(np), 52, 26); ctx.stroke(); ctx.restore(); K.cap(ctx, 'NONPROFIT RESEARCH GROUP', 1260, 836, np, { size: 26, align: 'center', col: GOLD.text });
      for (let i = 0; i < 6; i++) { const e = rise(span(np, i * .08, i * .08 + .5)); if (e > 0) K.folk(ctx, 420 + i * 70, 880, 130, { a: e, light: .5 }); } }
    ctx.restore();
  },
  // ---------------------------------------------------------------- f2 the moment AI does AI research by itself: the loop
  f2(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 520, ga: .3, gcol: AI.deep });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1, fy: 520 });
    const cx = 960, cy = 520, R = 250;
    K.cap(ctx, 'ONE MOMENT', 960, 150, U('one moment', .7, -.2), { size: 34, align: 'center', col: GOLD.text });
    const nodes = [[-90, 'AI', 'The moment A.I.'], [30, 'AI RESEARCH', 'starts doing'], [150, 'BETTER AI', 'research by itself']];
    const loop = U('starts doing', 1.4, 0), self = U('by itself', 1.2, -.2);
    // the arrows of the loop (arcs)
    for (let i = 0; i < 3; i++) { const a0 = (nodes[i][0] + 18) * Math.PI / 180, a1 = (nodes[(i + 1) % 3][0] - 18 + (i === 2 ? 360 : 0)) * Math.PI / 180;
      const pts = []; for (let k = 0; k <= 30; k++) { const a = lerp(a0, a1, k / 30); pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
      const u = span(i < 2 ? loop : self, i < 2 ? i * .45 : 0, i < 2 ? i * .45 + .55 : .8); K.lightLine(ctx, pts, 0, sineIO(u), AI, { w: 3, arrow: true, head: true }); }
    // spinning light points once it runs by itself
    if (self > .7) for (let k = 0; k < 3; k++) { const a = (t - S.t0) * 1.6 + k * TAU / 3; halo(ctx, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 40, .4 * (self - .7) / .3, AI.halo, AI.core); }
    nodes.forEach(([deg, lab, p], i) => { const u = U(p, .7, -.1); if (u <= 0) return; const a = deg * Math.PI / 180, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      K.orb(ctx, t, x, y, 44 * expoOut(u), { rings: 2, a: u }); K.cap(ctx, lab, x, y + (deg < 0 ? -80 : 100), u, { size: 30, align: 'center', col: AI.text }); });
    // the human hand leaves the loop
    const hu = IN(.8), hx = cx + 30 * self;
    K.folk(ctx, cx - 520 - self * 380, 900, 150, { a: hu * (1 - .7 * self), look: .6 });
    K.cap(ctx, 'BY ITSELF', cx, cy + 12, self, { size: 40, align: 'center', col: '#fff6d8', glow: true });
    ctx.restore();
  },
  // ---------------------------------------------------------------- f3 the timeline: the moment moved to 2027
  f3(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 700, gy: 560, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.04, fx: 700, fy: 560 });
    axis(ctx, t, IN(1.0), 640, 2026, 2033, { hi: 2027 });
    const mv = sineIO(U('moved that moment', 1.6, .1)), x = lerp(TX(2028.95), TX(2027.45), mv);
    if (mv < 1) { ctx.save(); ctx.globalAlpha *= .5 * IN(.8); ctx.setLineDash([6, 8]); ctx.strokeStyle = rgba(GOLD.line, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(TX(2028.95), 640); ctx.lineTo(TX(2028.95), 470); ctx.stroke(); ctx.restore(); }
    K.cap(ctx, 'AUG 2026 FORECAST: DEC 2028', TX(2028.95), 440, IN(.8, .3) * (1 - .55 * mv), { size: 22, align: 'center', col: MUTED });
    pin(ctx, x, 640, IN(.8, .2), 'AI DOES AI RESEARCH', { h: 300 });
    const tz = U('To twenty twenty-seven', .8, -.1); if (tz > 0) { halo(ctx, TX(2027.45), 640, 120, .35 * tz, GOLD.halo, GOLD.core); K.big(ctx, '2027', TX(2027.45), 250, 110, tz); }
    const tf = U("That's their forecast", .8, -.1);
    if (tf > 0) { ctx.save(); ctx.globalAlpha *= tf; ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(TX(2027.45) + 70, 760, 520 * expoOut(tf), 52, 26); ctx.stroke(); ctx.restore(); K.cap(ctx, 'THEIR FORECAST · UPDATE 10 NOV 2026', TX(2027.45) + 330, 796, tf, { size: 24, align: 'center', col: GOLD.text }); }
    K.src(ctx, t, S.a + 1, S.b + 1, 'AI Futures Project, Q3.5 timelines update, 10 Nov 2026 (median of the authors)');
    ctx.restore();
  },
  // ---------------------------------------------------------------- f4 forecast vs this film's reading; the lead that feeds itself
  f4(ctx, t, S, T) {
    const { U, IN, G } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 400, ga: .25 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1, fy: 420 });
    const r = U('this film', .8, -.2), story = U('In the race story', .8, -.2);
    // two tags, clearly separated
    const ty = lerp(380, 150, sineIO(story));
    K.cap(ctx, 'THEIR FORECAST: AI DOES AI RESEARCH · 2027', 960, ty - 50, IN(.6), { size: 30, align: 'center', col: GOLD.text });
    const pa = IN(.8) * (1 - clamp(story * 2));
    if (pa > 0) { ctx.save(); ctx.globalAlpha *= pa; pin(ctx, 960, 820, 1, '', { h: 300 }); K.big(ctx, '2027', 960, 900, 70, 1); ctx.restore(); }
    K.cap(ctx, 'THE RACE IS DECIDED?', 960, 560, U('race is decided', .7, -.1) * (1 - clamp(story * 2)), { size: 40, align: 'center', col: CREAM, glow: true });
    if (r > 0) { ctx.save(); ctx.globalAlpha *= r; ctx.setLineDash([10, 8]); ctx.strokeStyle = rgba(CREAM, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(960 - 380 * expoOut(r), ty - 6, 760 * expoOut(r), 60, 30); ctx.stroke(); ctx.restore();
      K.cap(ctx, "THIS FILM'S READING: THE RACE IS DECIDED THERE", 960, ty + 34, r, { size: 26, align: 'center' }); }
    // the lead chart: gap melts until the moment, then feeds itself
    if (story > 0) {
      const x0 = 300, x1 = 1640, xm = 1060, y0 = 760;
      const lead = (x) => x < xm ? lerp(150, 40, sineIO((x - x0) / (xm - x0))) : 40 + Math.pow((x - xm) / (x1 - xm), 2.2) * 330;
      const draw = sineIO(U('keeps a lead', 3.2, -.6));
      const usP = K.curvePts((x) => y0 - 140 - lead(x) / 2 - (x - x0) * .12, x0, x1), cnP = K.curvePts((x) => y0 - 140 + lead(x) / 2 - (x - x0) * .12, x0, x1);
      K.lightLine(ctx, usP, 0, Math.max(.05, draw), US, { w: 3.5, head: true }); K.lightLine(ctx, cnP, 0, Math.max(.05, draw), CN, { w: 3.5, head: true });
      const mu = clamp(story * 2); ctx.save(); ctx.globalAlpha *= mu; ctx.setLineDash([6, 8]); ctx.strokeStyle = rgba(GOLD.line, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xm, 380); ctx.lineTo(xm, 860); ctx.stroke(); ctx.restore();
      K.cap(ctx, 'THE MOMENT', xm, 900, mu, { size: 24, align: 'center', col: GOLD.text });
      K.cap(ctx, 'THE LEAD MELTS', 620, 870, U('stops melting', .8, -.6), { size: 26, align: 'center', col: MUTED });
      K.cap(ctx, 'THE LEAD FEEDS ITSELF', 1420, 330, U('feeding itself', .8, -.3), { size: 28, align: 'center', col: US.text });
      K.cap(ctx, 'AMERICA', x0 - 20, usP[0][1] + 8, story, { size: 22, align: 'right', col: US.text }); K.cap(ctx, 'CHINA', x0 - 20, cnP[0][1] + 8, story, { size: 22, align: 'right', col: CN.text });
    }
    ctx.restore();
  },
  // ---------------------------------------------------------------- f5 is it certain? no: moved before, the 2030s, no deliberate slowdown
  f5(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1400, gy: 500, ga: .22 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.03, fx: 1100, fy: 560 });
    const TX2 = (y) => 220 + (y - 2026) * 150;
    K.cap(ctx, 'IS IT CERTAIN?', 960, 150, IN(.6), { size: 34, align: 'center', col: CREAM });
    const no = U('No.', .6, -.1); if (no > 0) K.big(ctx, 'NO.', 960, 290, 120, no);
    // axis to 2035
    const au = U("They've moved", .9, -.3);
    K.lightLine(ctx, [[TX2(2026), 640], [TX2(2036), 640]], 0, expoOut(au), { body: P.blue1, line: mixHex(P.blue1, CREAM, .3) }, { w: 2.5 });
    for (let yr = 2026; yr <= 2035; yr++) K.cap(ctx, String(yr), TX2(yr), 692, au * .9, { size: 24, align: 'center', col: yr === 2027 ? GOLD.text : MUTED });
    // the marker's past moves: a zigzag of ghost pins
    const zz = [2027.3, 2029.2, 2028.0, 2028.95, 2027.45], zu = U('moved this date before', 2.0, -.2);
    const pts = zz.map((y, i) => [TX2(y), 560 - i * 34]);
    K.lightLine(ctx, pts, 0, sineIO(zu), GOLD, { w: 2, head: true, a: .8 });
    pts.forEach(([x, y], i) => { const e = span(zu, i / 5, i / 5 + .2); if (e > 0) { ctx.save(); ctx.globalAlpha *= e * (i === 4 ? 1 : .55); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y, i === 4 ? 12 : 8, 0, TAU); ctx.fill(); ctx.restore(); } });
    K.cap(ctx, 'MOVED BEFORE', TX2(2028.2), 400, zu, { size: 24, align: 'center', col: GOLD.text });
    // other forecasts: the 2030s
    const ob = U('twenty thirties', 1.0, -.6);
    if (ob > 0) { ctx.save(); ctx.globalAlpha *= ob * .8; ctx.fillStyle = K.lin(ctx, TX2(2030), 0, TX2(2036), 0, [[0, rgba(CREAM, .05)], [.4, rgba(CREAM, .2)], [1, rgba(CREAM, .05)]]); ctx.fillRect(TX2(2030), 600 - 120 * expoOut(ob), TX2(2036) - TX2(2030), 120 * expoOut(ob)); ctx.restore();
      K.cap(ctx, 'MANY OTHER FORECASTS: THE 2030s', TX2(2033), 450, ob, { size: 26, align: 'center' }); }
    const as = U('slow down on purpose', .8, -.6);
    if (as > 0) { ctx.save(); ctx.globalAlpha *= as; ctx.setLineDash([10, 8]); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(1000, 770, 640 * expoOut(as), 56, 28); ctx.stroke(); ctx.restore(); K.cap(ctx, 'ASSUMES: NO DELIBERATE SLOWDOWN', 1320, 808, as, { size: 24, align: 'center' }); }
    K.src(ctx, t, S.a + 2, S.b + 1, 'AI Futures Project · Metaculus community via 80,000 Hours (Feb 2026)');
    ctx.restore();
  },
  // ---------------------------------------------------------------- f6 those closest to the finish line say: next year
  f6(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1300, gy: 600, ga: .3, gcol: P.blue0, stars: 160 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.06, fx: 1300, fy: 640 });
    // ground and the finish line, seen from the side at night
    ctx.fillStyle = K.lin(ctx, 0, 760, 0, H, [[0, mixHex(P.ind0, P.night1, .3)], [1, P.night0]]); ctx.fillRect(0, 760, W, H - 760);
    const fx = 1350, fu = IN(.9);
    for (let k = 0; k < 14; k++) { if (k / 14 > fu) break; ctx.fillStyle = k % 2 ? rgba(CREAM, .9) : rgba(P.night0, .9); ctx.fillRect(fx - 7, 760 - 46 * 7 + k * 23, 14, 23); }
    halo(ctx, fx, 600, 400, .2, GOLD.halo, GOLD.core);
    const pu = U('closest to the finish line', 1.4, -.4);
    [[1210, 150, 1], [1270, 135, 1], [1440, 155, -1], [1505, 140, -1], [1560, 128, -1]].forEach(([x, h, d], i) => { const e = rise(span(pu, i * .12, i * .12 + .5)); if (e > 0) K.folk(ctx, x, 800, h, { a: e, dir: d, look: .9, light: .7 }); });
    const ny = U('next year', .8, -.1);
    if (ny > 0) { halo(ctx, fx, 330, 360, .25 * ny, GOLD.halo, GOLD.core); K.big(ctx, 'NEXT YEAR', fx, 360, 120, ny); }
    K.cap(ctx, 'SOME OF THE PEOPLE CLOSEST TO IT', fx, 470, U('some of the people', .8, -.1) * (1 - .3 * ny), { size: 26, align: 'center', col: CREAM });
    ctx.restore();
  },
};
