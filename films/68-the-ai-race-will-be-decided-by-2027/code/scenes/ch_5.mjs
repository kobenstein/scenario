// Film 68 · subscribe beat + 5 THE FINISH LINE (m1, p1–p10, C4). Numbers: faktencheck.md K48–K61, ampel-zweitpruefer.md #1, #9.
// METR wording per Muss #1 + second checker: "~80 % of the speed-up: the lab using its own AI · estimate, 'substantial uncertainty'".
import * as K from '../lib/f68_kit.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut, rise, halo, rgba, mixHex, TAU, US, CN, AI, GOLD, CREAM, MUTED } = K;
const NEU = { body: '#d8d2c4', line: '#f3efe2', deep: '#5a5560', text: CREAM };   // "a runner": no country named
const RACE = (t, ph0 = 0, k = 8) => t * k + ph0;

// a paper page with grey text bars (redactable). x,y top-left. o: { u, lines (n), red (0..1 sweep), redMask (which lines get a bar) }
function page(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return; const k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y + (1 - k) * 30);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(8, 12, w, h, 8); ctx.fill();
  ctx.fillStyle = K.PAPER.lit; ctx.beginPath(); ctx.roundRect(0, 0, w, h, 8); ctx.fill();
  if (o.head) K.cap(ctx, o.head, 36, 58, rise(span(u, .2, .8)), { size: 20, col: K.PAPER.faint });
  const n = o.lines ?? 12, y0 = o.head ? 100 : 50, lh = (h - y0 - 40) / n;
  for (let i = 0; i < n; i++) {
    const lw = (w - 72) * (i % 4 === 3 ? .55 : .92 - (i * 37 % 7) * .03), yy = y0 + i * lh;
    ctx.fillStyle = rgba(K.PAPER.faint, .45); ctx.fillRect(36, yy, lw * rise(span(u, .1 + i * .03, .6 + i * .03)), Math.max(6, lh * .32));
    if (o.redMask && o.redMask(i)) { const r = expoOut(clamp((o.red ?? 0) * n * .5 - i * .4)); if (r > 0) { ctx.fillStyle = '#0b0c14'; ctx.fillRect(32, yy - lh * .12, (lw + 8) * r, lh * .58); } }
  }
  ctx.restore();
}
// a finish tape between two posts at x; break (0..1) splits it
function tape(ctx, t, x, y0, y1, u, brk = 0) {
  if (u <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  ctx.fillStyle = rgba(CREAM, .85); ctx.fillRect(x - 4, y0 - 20, 8, y1 - y0 + 40);
  ctx.strokeStyle = GOLD.hot; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const my = (y0 + y1) / 2, b = expoOut(brk);
  if (b <= 0) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.quadraticCurveTo(x - 8 + 6 * Math.sin(t * 3), my, x, y1); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(x, y0); ctx.quadraticCurveTo(x + 60 * b, y0 + 40 + 30 * b, x + 120 * b, my - 40 + 120 * b); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y1); ctx.quadraticCurveTo(x + 60 * b, y1 - 40 - 30 * b, x + 120 * b, my + 40 + 60 * b); ctx.stroke(); }
  ctx.restore();
}

export default {
  // ---------------------------------------------------------------- m1 it lands on all of us · this channel · subscribe
  m1(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 380, ga: .3, gcol: GOLD.mid, stars: 160, seed: 9 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.1, z1: 1.0, fx: 960, fy: 760 });
    // the night world: a planet's curve, thousands of lit windows spreading out from the centre (the board's light)
    const cx = 960, cy = 2350, R = 1600, spread = sineIO(span(t, S.a, G('not just on two countries') + 1.2));
    ctx.fillStyle = lin2(ctx, cy - R, cy - R + 500); ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    halo(ctx, cx, cy - R, 900, .22, GOLD.halo, GOLD.core);
    const r = K.prng(31);
    for (let k = 0; k < 900; k++) {
      const ang = -Math.PI / 2 + (r() - .5) * 1.3, rr = R - 10 - r() * 420, px = cx + Math.cos(ang) * rr, py = cy + Math.sin(ang) * rr, d = Math.abs(ang + Math.PI / 2) / .65;
      const on = clamp((spread * 1.15 - d) * 6); if (on <= 0) continue;
      ctx.fillStyle = rgba(GOLD.hot, on * (.35 + .45 * Math.sin(t * (.3 + r()) + k) ** 2) * (1 - (R - rr) / 520)); ctx.fillRect(px, py, 3 + r() * 3, 4 + r() * 3);
    }
    // the two flags shrink into the crowd: not just on two countries
    const two = U('not just on two countries', .9, -.3);
    K.cap(ctx, 'IT LANDS ON ALL OF US', 960, 250, U('all of us', .8, -.2) * (1 - U('This channel exists', .6, -.3)), { size: 40, align: 'center', col: GOLD.text, glow: true });
    K.cap(ctx, 'NOT JUST ON TWO COUNTRIES', 960, 310, two * (1 - U('This channel exists', .6, -.3)), { size: 26, align: 'center', col: MUTED });
    // people along the horizon, you in the middle
    const pu = U('all of us', 1.4, -.4);
    for (let i = 0; i < 18; i++) { const e = rise(span(pu, Math.abs(i - 8.5) / 9 * .6, Math.abs(i - 8.5) / 9 * .6 + .4)); if (e <= 0 || i === 9) continue; const px = 280 + i * 76, py = 790 + Math.pow((px - cx) / 900, 2) * 120; K.folk(ctx, px, py, 108 + (i * 37 % 5) * 6, { a: e * .9, look: .9, light: .5 }); }
    K.du(ctx, 960 + 38, 800, 150, { pose: 'look', look: 1 });
    // why the channel exists, then the button of light
    const why = U('This channel exists', .9, -.2);
    K.cap(ctx, 'THIS CHANNEL EXISTS FOR ONE REASON', 960, 230, why * (1 - U('Want that too', .5, -.4)), { size: 30, align: 'center', col: CREAM });
    K.serif(ctx, 'so that superintelligence goes well for everybody', 960, 320, 62, U('goes well for everybody', 1.0, -.9) * (1 - U('Want that too', .5, -.4)), { align: 'center' });
    const su = U('Then subscribe', .8, -.35);
    if (su > 0) { const k = expoOut(su), bw = 380 * k, bx = 960 - bw / 2, by = 230;
      halo(ctx, 960, by + 40, 340, .4 * su, GOLD.halo, GOLD.core);
      ctx.save(); ctx.globalAlpha *= clamp(su * 3); ctx.fillStyle = mixHex(GOLD.mid, GOLD.hot, .4 + .1 * Math.sin(t * 2)); ctx.beginPath(); ctx.roundRect(bx, by, bw, 84, 42); ctx.fill(); ctx.restore();
      K.cap(ctx, 'SUBSCRIBE', 960, by + 54, rise(span(su, .3, 1)), { size: 34, align: 'center', col: P.night0 }); }
    K.cap(ctx, 'WANT THAT TOO?', 960, 400, U('Want that too', .7, -.1), { size: 30, align: 'center', col: GOLD.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- p1 the finish line: AI DOES AI RESEARCH; a runner may already be close
  p1(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1400, gy: 420, ga: .28 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.07, fx: 1400, fy: 460 });
    K.track(ctx, t, { x0: 140, x1: 1780, y0: 500, pitch: 170, u: IN(.8), finish: U('finish line', .8, -.3), fx: .82, lanes: [{ col: NEU, label: '' }] });
    const fx = lerp(140, 1780, .82);
    halo(ctx, fx, 500, 260, .3 * U('finish line', .8, -.3), GOLD.halo, GOLD.core);
    K.cap(ctx, 'THE FINISH LINE', fx, 330, U('finish line', .8, -.2), { size: 26, align: 'center', col: GOLD.text });
    K.cap(ctx, 'AI DOES AI RESEARCH', fx, 380, U('decides it', .8, -.2), { size: 34, align: 'center', col: AI.text, glow: true });
    const close = U('already be close', 1.6, -.8), x = lerp(400, fx - 190, sineIO(span(t, S.a, G('already be close') + .6)));
    K.runner(ctx, x, 552, 150, RACE(t), { col: NEU });
    if (close > 0) { ctx.save(); ctx.globalAlpha *= close; ctx.strokeStyle = rgba(GOLD.line, .9); ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(x + 60, 640); ctx.lineTo(fx - 8, 640); ctx.stroke(); ctx.restore();
      K.cap(ctx, 'CLOSE?', (x + fx) / 2, 690, close, { size: 30, align: 'center', col: GOLD.text }); }
    page(ctx, t, 300, 700, 380, 300, { u: U('one new report', .9, -.3), head: 'NEW REPORT · NOV 2026', lines: 6 });
    ctx.restore();
  },
  // ---------------------------------------------------------------- p2 METR: ~2× faster, ~80 % of the speed-up from the lab using its own AI
  p2(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 560, ga: .28 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.03, z1: 1, fy: 560 });
    // the evaluator's card grows from where the report sat
    K.doc(ctx, t, 110, 190, 500, 320, { u: IN(.9), style: 'night', head: 'INDEPENDENT EVALUATOR · NOV 2026', lines: [['METR', 92, 1], ['reported back from inside', 32, 0], ['one leading lab', 32, 0]] });
    // gauge: 1× → ~2× (1.9×, range 1.5–2.8×)
    const gx = 960, gy = 650, gr = 250, gu = U('twice as fast', 1.4, -.6), gIn = U('Its estimate', .9, -.3);
    const A = (v) => Math.PI + (v - 1) / 2.5 * Math.PI;          // 1× left … 3.5× right
    if (gIn > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(gIn * 2); ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(P.blue1, .6); ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(gx, gy, gr, Math.PI, TAU); ctx.stroke();
      const band = rise(span(gu, .5, 1)); if (band > 0) { ctx.strokeStyle = rgba(GOLD.line, .35 * band); ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(gx, gy, gr, A(1.5), A(2.8)); ctx.stroke(); }
      for (const v of [1, 2, 3]) { const a = A(v); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx + Math.cos(a) * (gr - 40), gy + Math.sin(a) * (gr - 40)); ctx.lineTo(gx + Math.cos(a) * (gr - 20), gy + Math.sin(a) * (gr - 20)); ctx.stroke(); }
      ctx.restore();
      for (const v of [1, 2, 3]) { const a = A(v); K.cap(ctx, `${v}×`, gx + Math.cos(a) * (gr + 50), gy + Math.sin(a) * (gr + 50) + 10, gIn, { size: 24, align: 'center', col: MUTED }); }
      const v = lerp(1, 1.9, expoOut(gu)) + .02 * Math.sin(t * 3) * gu, a = A(v);
      ctx.save(); ctx.globalAlpha *= clamp(gIn * 2); ctx.strokeStyle = GOLD.hot; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(a) * (gr - 30), gy + Math.sin(a) * (gr - 30)); ctx.stroke(); ctx.restore();
      halo(ctx, gx, gy, 40, .5 * gIn, GOLD.halo, GOLD.core);
      K.cap(ctx, 'PROGRESS IN THAT LAB', gx, gy - gr - 70, gIn, { size: 24, align: 'center', col: CREAM });
      K.big(ctx, '~2× faster', gx, gy + 110, 84, gu);
      K.cap(ctx, '1.9× · RANGE 1.5–2.8× · VS. MAR 2024–OCT 2025', gx, gy + 170, rise(span(gu, .4, 1)), { size: 22, align: 'center', col: MUTED });
    }
    // ring: ~80 % of the speed-up from the lab using its own AI
    const ru = U('four fifths', 1.3, -.4);
    K.donut(ctx, 1520, 560, 150, .8, ru, AI, { value: '~80 %', vsize: 64 });
    K.cap(ctx, 'OF THE SPEED-UP:', 1520, 790, rise(span(ru, .3, .9)), { size: 24, align: 'center', col: CREAM });
    K.cap(ctx, 'THE LAB USING ITS OWN AI', 1520, 828, U('using its own', .8, -.3), { size: 26, align: 'center', col: AI.text });
    K.tag(ctx, "ESTIMATE · 'SUBSTANTIAL UNCERTAINTY'", 1520, 900, U('using its own', .8, .6), { size: 20, col: MUTED });
    K.src(ctx, t, S.a + 1, S.b + 1, 'METR, independent assessment of one leading lab (Anthropic), 5 Nov 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- p3 one lab, most evidence blacked out — but it moved the forecast
  p3(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 540, ga: .26 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.04, fx: 1500, fy: 560 });
    const red = U('blacked out', 1.4, -.8);
    page(ctx, t, 300, 180, 560, 640, { u: IN(.8), head: 'PUBLIC VERSION', lines: 13, red, redMask: (i) => i % 5 !== 0 });
    K.tag(ctx, 'ONE LAB', 580, 120, U("It's one lab", .7, -.1), { size: 24, col: CREAM });
    K.cap(ctx, 'MOST KEY EVIDENCE BLACKED OUT', 1440, 420, red, { size: 26, align: 'center', col: MUTED });
    // the timeline on the right, the pin moves to 2027
    const tu = U('moved the forecast', 1.0, -.9), TX = (y) => 1100 + (y - 2026) * 170;
    if (tu > 0) {
      ctx.save(); ctx.globalAlpha *= clamp(tu * 2); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(TX(2026), 620); ctx.lineTo(TX(2030), 620); ctx.stroke(); ctx.restore();
      for (let y = 2026; y <= 2030; y++) K.cap(ctx, String(y), TX(y), 680, tu, { size: 24, align: 'center', col: y === 2027 ? GOLD.text : MUTED });
      const mv = sineIO(span(t, G('moved the forecast') + .1, G('moved the forecast') + 1.2)), px = lerp(TX(2028.9), TX(2027.4), mv);
      K.lightLine(ctx, [[860, 520], [1000, 470], [px - 30, 560]], 0, mv, GOLD, { w: 3, arrow: true });
      ctx.save(); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.moveTo(px, 618); ctx.lineTo(px - 14, 590); ctx.lineTo(px + 14, 590); ctx.closePath(); ctx.fill(); ctx.restore(); halo(ctx, px, 600, 50, .5, GOLD.halo, GOLD.core);
      K.cap(ctx, 'THE FORECAST', px, 560, tu, { size: 24, align: 'center', col: GOLD.text });
    }
    K.src(ctx, t, S.a + 1, S.b + 1, 'METR, Nov 2026 (redacted public version) · AI Futures Project update, 10 Nov 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- p4 the runners' logic: cross first, the lead grows by itself
  p4(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 420, ga: .26 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.04, z1: 1, fx: 960, fy: 480 });
    K.track(ctx, t, { x0: 120, x1: 1800, y0: 600, pitch: 150, u: IN(.7), finish: 1, fx: .4, lanes: [{ col: NEU, label: '' }, { col: NEU, label: '' }] });
    const fx = lerp(120, 1800, .4), cr = G('Cross that line first');
    const lead = sineIO(span(t, cr + .3, G('grows by itself') + 1.2));
    const x1 = lerp(420, 1000, sineIO(span(t, S.a, cr + .6))) + lead * 300, x2 = lerp(330, fx - 120, sineIO(span(t, S.a, cr + 1.4)));
    halo(ctx, x1, 560, 160, .35 * span(t, cr, cr + .5), GOLD.halo, GOLD.core);
    K.runner(ctx, x1, 652, 140, RACE(t), { col: { ...NEU, body: mixHex(NEU.body, GOLD.hot, .35 * span(t, cr, cr + .5)) } });
    K.runner(ctx, x2, 802, 140, RACE(t, 2), { col: NEU, a: .8 });
    K.cap(ctx, "THE RUNNERS' LOGIC", 960, 200, IN(.8), { size: 28, align: 'center', col: MUTED });
    K.cap(ctx, 'CROSS FIRST', fx, 470, U('Cross that line first', .7, -.2), { size: 26, align: 'center', col: GOLD.text });
    // the lead gap stretches by itself
    const g = U('grows by itself', .8, -.3);
    if (g > 0) { ctx.save(); ctx.globalAlpha *= g; ctx.strokeStyle = GOLD.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x2 + 50, 870); ctx.lineTo(x1 + 50, 870); ctx.moveTo(x2 + 50, 855); ctx.lineTo(x2 + 50, 885); ctx.moveTo(x1 + 50, 855); ctx.lineTo(x1 + 50, 885); ctx.stroke(); ctx.restore();
      K.cap(ctx, 'THE LEAD GROWS BY ITSELF', (x1 + x2) / 2 + 50, 915, g, { size: 24, align: 'center', col: GOLD.text }); }
    // two branches from the leader
    const e = U('in the economy', 1.0, -.3), m = U('military', 1.0, -.3);
    K.lightLine(ctx, [[x1 + 50, 590], [x1 + 180, 540], [x1 + 300, 520]], 0, e, GOLD, { w: 3, head: true });
    K.cap(ctx, 'ECONOMY', x1 + 240, 500, e, { size: 30, col: GOLD.text });
    K.lightLine(ctx, [[x1 + 30, 570], [x1 + 90, 420], [x1 + 160, 330]], 0, m, GOLD, { w: 3, head: true });
    K.cap(ctx, 'MILITARY', x1 + 120, 300, m, { size: 30, col: GOLD.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- p5 the essay: THE FREE WORLD MUST PREVAIL · June 2024 · today: a fund
  p5(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 900, gy: 480, ga: .28 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.06, fx: 900, fy: 500 });
    K.doc(ctx, t, 330, 150, 760, 700, { u: U('One famous essay', .9, -.3), head: 'ESSAY · JUNE 2024', lines: [['Situational Awareness', 70, 1], ['Leopold Aschenbrenner', 34, 0]] });
    const cu = U('One famous essay', 1.2, .2);
    for (let i = 0; i < 6; i++) { const yy = 450 + i * 62, hi = i === 3, e = rise(span(cu, i * .08, i * .08 + .5)); if (e <= 0) continue;
      if (!hi) { ctx.fillStyle = rgba(K.PAPER.faint, .4 * e); ctx.fillRect(370, yy, (560 - (i * 53 % 4) * 60) * e, 12); } }
    const fw = U('must prevail', .9, -.6);
    if (fw > 0) { halo(ctx, 700, 642, 380, .3 * fw, GOLD.halo, GOLD.core); ctx.save(); ctx.globalAlpha *= fw; ctx.fillStyle = rgba(GOLD.hot, .28); ctx.fillRect(360, 618, 690 * expoOut(fw), 48); ctx.restore(); }
    K.cap(ctx, 'THE FREE WORLD MUST PREVAIL', 380, 655, Math.max(fw, cu * .5), { size: 30, col: fw > 0 ? mixHex(K.PAPER.faint, '#5a3b10', fw) : K.PAPER.faint });
    // 2024 → 2026: he runs an AI investment fund
    const tu = U('Its author wrote that', .8, -.2), fu = U('Today he runs', .9, -.2);
    K.cap(ctx, '2024', 1310, 360, tu, { size: 40, align: 'center', col: GOLD.text });
    K.lightLine(ctx, [[1310, 400], [1310, 560]], 0, fu, GOLD, { w: 3, arrow: true });
    K.cap(ctx, '2026', 1310, 620, fu, { size: 40, align: 'center', col: GOLD.text });
    K.tag(ctx, 'RUNS AN AI INVESTMENT FUND', 1430, 700, U('investment fund', .8, -.4), { size: 26, col: CREAM });
    K.src(ctx, t, S.a + 1, S.b + 1, 'Aschenbrenner, Situational Awareness, June 2024 · CNBC, 16 Nov 2026');
    ctx.restore();
  },
  // ---------------------------------------------------------------- p6 whoever leads gets to write the rules
  p6(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1200, gy: 460, ga: .26 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1, z1: 1.05, fx: 1200, fy: 480 });
    K.cap(ctx, 'THE ARGUMENT HAS WEIGHT', 960, 160, IN(.8), { size: 26, align: 'center', col: MUTED });
    const rw = U('write the rules', 1.4, -.8), arr = sineIO(span(t, S.a, G('write the rules') - .2));
    ctx.save(); ctx.globalAlpha *= IN(.8); ctx.strokeStyle = rgba(CREAM, .25); ctx.lineWidth = 2; for (const yy of [702, 902]) { ctx.beginPath(); ctx.moveTo(120, yy); ctx.lineTo(960, yy); ctx.stroke(); } ctx.restore();
    K.runner(ctx, lerp(260, 820, arr), 700, 160, arr < 1 ? RACE(t) : 1.2, { col: { ...NEU, body: mixHex(NEU.body, GOLD.hot, .35) }, lean: arr < 1 ? .16 : .02 });
    K.runner(ctx, 300, 900, 110, 1.2, { col: NEU, a: .6, lean: .02 });
    K.cap(ctx, 'WATCHES', 300, 770, U('write the rules', .7, .3), { size: 20, align: 'center', col: MUTED });
    K.doc(ctx, t, 1000, 250, 560, 600, { u: IN(1.0, .3), head: 'THE RULES', lines: [] });
    for (let i = 0; i < 7; i++) { const e = expoOut(clamp(rw * 7 - i)); if (e <= 0) continue; ctx.fillStyle = mixHex(GOLD.mid, GOLD.hot, .3); ctx.fillRect(1040, 360 + i * 64, (440 - (i % 3) * 70) * e, 12); }
    K.cap(ctx, 'WHOEVER LEADS WRITES THEM', 1280, 900, rw, { size: 26, align: 'center', col: GOLD.text });
    ctx.restore();
  },
  // ---------------------------------------------------------------- p7 the catch: the winner holds a machine smarter than they are
  p7(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 1000, gy: 400, ga: .22, gcol: AI.deep });
    const grow = U('smarter than they are', 1.8, -.9);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.05, z1: .96, fx: 1000, fy: 640 });
    K.track(ctx, t, { x0: 80, x1: 1840, y0: 820, pitch: 160, u: 1, lanes: [{ col: NEU, label: '' }] });
    const cr = G('Whoever crosses it first'), tx = 1060, x = lerp(200, tx + 60, sineIO(span(t, S.a, cr + .3))) + span(t, cr + .3, cr + 2) * 80;
    tape(ctx, t, tx, 760, 880, IN(.6), span(t, cr + .15, cr + .7));
    K.cap(ctx, 'THE CATCH', 960, 160, U('has a catch', .7, -.1) * (1 - grow), { size: 34, align: 'center', col: GOLD.text });
    K.runner(ctx, x, 872, 140, span(t, cr + .3, cr + 2) < 1 ? RACE(t) : 1.2, { col: NEU, lean: .1 });
    // the disc it holds, growing far taller than the runner
    const r0 = 26, r = lerp(r0, 270, expoOut(grow)), ox = x + 40, oy = lerp(780, 770 - r, expoOut(grow));
    K.orb(ctx, t, ox, oy, r, { rings: 3, pulse: .4 + .4 * grow });
    K.cap(ctx, 'A MACHINE SMARTER THAN THEY ARE', ox, Math.max(150, oy - r - 70), grow, { size: 30, align: 'center', col: AI.text, glow: true });
    ctx.restore();
  },
  // ---------------------------------------------------------------- p8 LEITBILD 3 · WOW: the third lane lights up — the third runner is the AI itself
  p8(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    const lit = U('just lit up', 1.0, -.5), tr = G('The third runner'), rf = G('makes that runner faster');
    const tilt = sineIO(span(t, tr + .4, tr + 1.8));
    ctx.save(); ctx.translate(0, -tilt * 640);
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.06, z1: 1.0, fx: 960, fy: 640 });
    K.stadium(ctx, t, { title: 'AI RACE', us: 2, cn: 2, u: 1, third: 1, thirdLit: lit, thirdLabel: lit > .3 ? 'THE THIRD RUNNER: THE AI ITSELF' : 'THE THIRD LANE', duX: 960, duPose: 'look', floods: 1 - .5 * lit });
    if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .22 * Math.sin(Math.PI * clamp(lit)) ; ctx.fillStyle = AI.halo; ctx.fillRect(0, 0, W, H); ctx.restore(); halo(ctx, 960, 654, 900, .35 * lit, AI.halo, AI.core); }
    ctx.restore();
    // below the stadium: the three lanes; the disc drops from the strip into lane 3 and runs; the two push it faster
    const y0 = 1240, pitch = 150;
    K.track(ctx, t, { x0: 330, x1: 1800, y0, pitch, u: span(t, tr, tr + 1.2), finish: 1, fx: .92, lanes: [{ col: US, label: 'AMERICA' }, { col: CN, label: 'CHINA' }, { col: AI, label: 'THE AI ITSELF', glow: lit }] });
    const run = span(t, tr + 1.2, S.b + 1), push = span(t, rf - .2, rf + 1.4);
    const p1 = 440 + run * 460 + push * 140, ox = 440 + run * 460 + push * push * 700;
    K.runner(ctx, p1 + 30 * Math.sin(t * 1.4), y0 + 52, 130, RACE(t, 0, 9 + 4 * push), { col: US });
    K.runner(ctx, p1 - 20 + 26 * Math.sin(t * 1.1 + 1), y0 + pitch + 52, 130, RACE(t, 2, 9 + 4 * push), { col: CN });
    const drop = span(t, tr + .2, tr + 1.4), oy = lerp(654, y0 + 2 * pitch, expoOut(drop)), oxx = lerp(960, ox, sineIO(drop));
    if (push > 0) for (let k = 1; k <= 5; k++) { ctx.save(); ctx.globalAlpha *= .14 * push; ctx.fillStyle = AI.line; ctx.beginPath(); ctx.arc(oxx - k * 26 * (1 + push), oy, 40 - k * 4, 0, TAU); ctx.fill(); ctx.restore(); }
    if (t > tr) K.orb(ctx, t, oxx, oy, lerp(30, 46, drop), { rings: 3, pulse: .5 + push });
    // energy from the two runners pushes the disc
    if (push > 0) for (const [yy, col] of [[y0 + 10, US], [y0 + pitch + 10, CN]]) K.lightLine(ctx, [[p1 + 40, yy], [lerp(p1 + 40, oxx - 40, .5), (yy + oy) / 2 - 20], [oxx - 50, oy]], span(push, .3, 1), clamp(push * 1.4), col, { w: 2.5, head: true });
    K.cap(ctx, 'THE RACE MAKES IT FASTER', 960, y0 - 200, U('makes that runner faster', .8, -.2), { size: 34, align: 'center', col: AI.text, glow: true });
    ctx.restore();
  },
  // ---------------------------------------------------------------- p9 a half-year lead: safety checks get skipped; corners get cut (Gill, paraphrase)
  p9(ctx, t, S, T) {
    const { G, U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 560, ga: .24 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.02, z1: 1.0, fy: 540 });
    // an oval lane: straight bottom, curve on the right
    const path = []; for (let i = 0; i <= 60; i++) path.push([lerp(240, 1260, i / 60), 760]);
    for (let i = 1; i <= 50; i++) { const a = Math.PI / 2 - i / 50 * Math.PI; path.push([1260 + Math.cos(a) * 240, 520 + Math.sin(a) * 240]); }
    for (let i = 1; i <= 30; i++) path.push([lerp(1260, 920, i / 30), 280]);
    ctx.save(); ctx.globalAlpha *= IN(.8); ctx.strokeStyle = rgba(mixHex(P.ind0, '#3a2a40', .25), .9); ctx.lineWidth = 110; ctx.lineJoin = 'round'; ctx.beginPath(); path.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
    ctx.strokeStyle = rgba(CREAM, .2); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    const L = path.length - 1, at = (f) => path[Math.min(L, Math.max(0, Math.round(f * L)))];
    // the leader and the chaser half a year behind
    const cut = U('corners get cut', 1.4, -.6), mv = span(t, S.a, G('corners get cut') + .2);
    const fL = lerp(.08, .42, sineIO(mv)), fC = fL - .12;
    let [lx, ly] = at(fL);
    if (cut > 0) { const [ax, ay] = at(.42), bx = 980, by = 300; lx = lerp(ax, bx, sineIO(cut)); ly = lerp(ay, by, sineIO(cut)) - Math.sin(Math.PI * cut) * 60;
      ctx.save(); ctx.globalAlpha *= cut; ctx.setLineDash([10, 10]); ctx.strokeStyle = rgba(GOLD.hot, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo((ax + bx) / 2 - 40, (ay + by) / 2 - 60, bx, by); ctx.stroke(); ctx.restore(); }
    const [cx, cy] = at(fC);
    K.runner(ctx, cx, cy + 40, 110, RACE(t, 2), { col: NEU, a: .75 });
    K.runner(ctx, lx, ly + 40, 120, RACE(t), { col: { ...NEU, body: mixHex(NEU.body, GOLD.hot, .3) } });
    const lu = U('half a year', .8, -.3);
    if (lu > 0 && cut <= 0) { ctx.save(); ctx.globalAlpha *= lu; ctx.strokeStyle = GOLD.line; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + 40, 850); ctx.lineTo(lx + 40, 850); ctx.stroke(); ctx.restore(); K.cap(ctx, 'LEAD: ~6 MONTHS', (cx + lx) / 2 + 40, 900, lu, { size: 26, align: 'center', col: GOLD.text }); }
    // safety gates on the straight, skipped one by one as the leader passes
    const sc = U('every safety check', .6, -.2);
    [.18, .28, .38].forEach((f, i) => { const [gx, gy] = at(f), passed = clamp((fL - f) * 30), e = rise(span(sc, i * .15, i * .15 + .5)); if (e <= 0) return;
      K.icon(ctx, 'gate', gx, gy - 6, 70, e, { col: passed > 0 ? { body: MUTED, line: MUTED, deep: P.night1 } : { body: '#9fe3b0', line: '#c8f3d2', deep: '#2b5d3a' }, a: 1 - .5 * passed });
      if (passed > 0) { ctx.save(); ctx.globalAlpha *= passed; ctx.strokeStyle = CN.line; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(gx - 22, gy - 70); ctx.lineTo(gx + 22, gy - 26); ctx.moveTo(gx + 22, gy - 70); ctx.lineTo(gx - 22, gy - 26); ctx.stroke(); ctx.restore(); } });
    K.cap(ctx, 'SAFETY CHECKS', 560, 640, sc * (1 - cut), { size: 24, align: 'center', col: MUTED });
    K.cap(ctx, "FEEL LIKE TIME YOU DON'T HAVE", 520, 330, U("time you don't have", .8, -.3) * (1 - U('This November, the United', .6, -.2)), { size: 28, align: 'center', col: CREAM });
    // the paraphrase card
    const gu = U('This November, the United', .9, -.2);
    K.doc(ctx, t, 130, 220, 620, 250, { u: gu, style: 'night', head: 'UN TECH ENVOY AMANDEEP GILL · 17 NOV 2026', lines: [['warned of a race', 40, 0], ['where corners get cut', 40, 1]] });
    K.cap(ctx, 'PARAPHRASED', 440, 510, gu, { size: 18, align: 'center', col: MUTED });
    K.src(ctx, t, G('This November, the United'), S.b + 1, 'Semafor, 17 Nov 2026 (paraphrase)');
    ctx.restore();
  },
  // ---------------------------------------------------------------- p10 one of the forecast's own authors: the plate grows out of the card
  p10(ctx, t, S, T) {
    const { U, IN } = K.phr(T, S, t);
    K.bg(ctx, t, { gx: 960, gy: 540, ga: .28 });
    ctx.save(); K.shotCam(ctx, t, S, { z0: 1.0, z1: 1.08, fx: 960, fy: 540 });
    K.doc(ctx, t, 660, 300, 600, 380, { u: IN(.8), head: 'THE BEST-KNOWN FORECAST', lines: [['AI 2027', 96, 1], ['AI Futures Project', 40, 0]] });
    K.tag(ctx, 'DANIEL KOKOTAJLO · AI FUTURES PROJECT', 960, 760, U('own authors', .8, -.3), { size: 26, col: GOLD.text, fill: P.night0 });
    K.cap(ctx, 'ONE OF ITS AUTHORS', 960, 240, U("forecast's own", .7, -.3), { size: 26, align: 'center', col: MUTED });
    ctx.restore();
  },
  C4: K.clipShot('C4'),
};

function lin2(ctx, y0, y1) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, mixHex(P.ind1, P.night1, .3)); g.addColorStop(1, P.night0); return g; }
