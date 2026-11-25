// c02 · B1 · Good's sentence and who wrote it · 'Here is the promise' → 'Because today, people are trying'. Plan: docs/shots.md 1.01–1.13.
// One entry, one draw function, one world camera (F.lookPath keyed on phrases; it follows the carrier, never leads it). The chunk starts
// ON the seam plate S.plateBand (identical frame at R.a) and transforms it: the band's front half lifts off and flips into Good's card.
//
// | ID   | anchor (phrase)            | motif                                                                                        | type | carrier → next          |
// |------|----------------------------|----------------------------------------------------------------------------------------------|------|-------------------------|
// | 1.01 | Here is the promise        | the camera pushes onto the band's front half (PROMISE), the cover rests at the right edge    | EXPL | the front half          |
// | 1.02 | The first ultra-intelligent| the front half lifts off and flips into the quote card (p. 33); words light as spoken         | EXPL | the card                |
// | 1.03 | It's more than sixty       | the card ages to paper tone; a gold time bar 1965 → 2026 draws: MORE THAN 60 YEARS            | EXPL | the bar                 |
// | 1.04 | Jack Good wrote it         | a name tag rises on a stem from the 1965 end: I. J. “JACK” GOOD                               | EXPL | the tag + the bar       |
// | 1.05 | In the Second World War    | the bar runs back to 1941, the camera follows it into a lit hut: Good at a table of code strips | MIX  | the lamp               |
// | 1.06 | His first boss there       | the second figure steps into the lamp light: ALAN TURING · HEAD OF HUT 8 · HIS FIRST BOSS     | MIX  | the lamp → a ring       |
// | 1.07 | The logic                  | the lamp's light becomes the ring; it draws the dashed outline of a bigger ring: SMARTER → DESIGNS A BETTER ONE | EXPL | the second ring |
// | 1.08 | And that one               | each ring draws the next, ever faster, out of frame                                          | EXPL | the last ring           |
// | 1.09 | It sounds like an ending   | the chain runs into a dark edge: THE END?                                                    | EXPL | THE END?                |
// | 1.10 | But our survival           | THE END? is struck; the strike lifts and unrolls Good's card (p. 31), “survival of man” gold  | EXPL | the card                |
// | 1.11 | He even guessed when       | the card flips to p. 78, “within the twentieth century” lights; a calendar leaf 2000 unrolls  | EXPL | the leaf                |
// | 1.12 | About the date             | the leaf tears and falls: WRONG ABOUT THE DATE; the empty last row stays empty               | MIX  | the card, tilted        |
// | 1.13 | So why should you take     | you walk in small under the tilted card: Why take him seriously today?                       | MIX  | the card (→ c03 stage)  |
import * as F from '../lib/f77_kit.mjs';
import * as S from '../lib/f77_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rise, GOLD, CREAM, PAPER, COOL, EARTH } = F;

export const PRINT = F.PRINT77;
export function anchors(T, R) {
  const G = (p, after = R.a - .5) => T.G(p, 0, after), GE = (p, after = R.a - .5) => T.GE(p, 0, after);
  const a = { t0: R.a, end: R.b };
  a.promise = G('the promise'); a.quote = G('The first ultra-intelligent'); a.make = GE('need ever make');
  a.more = G("It's more than"); a.sixty = G('sixty years', a.more);
  a.jack = G('Jack Good wrote');
  a.war = G('In the Second World'); a.breakW = G('helped break', a.war); a.codes = G('naval codes', a.war); a.bletch = G('Bletchley Park', a.war);
  a.boss = G('His first boss'); a.turing = G('Alan Turing', a.boss);
  a.logic = G('The logic'); a.smarter = G('smarter than us', a.logic); a.design = G('design a better', a.logic); a.mach = G('machine', a.design + .3);
  a.that = G('And that one'); a.still = G('better one still', a.that);
  a.ending = G('It sounds like'); a.endW = G('ending', a.ending);
  a.but = G('But our survival'); a.surv = G('survival', a.but);
  a.guess = G('He even guessed'); a.within = G('within the twentieth', a.guess); a.century = G('century', a.within);
  a.date = G('About the date'); a.wrong = G('he was wrong', a.date);
  a.why = G('So why should you'); a.whyW = (() => { try { const ws = T.GW('why should you take him seriously', 'today', a.why - .1); const f = (w) => ws.find((x) => x.w.toLowerCase().replace(/[^a-z]/g, '') === w).s; return [f('why'), f('take'), f('him'), f('seriously'), f('today')]; } catch { return null; } })();
  return a;
}
export default async (T, R) => [{ t: R.a, draw: scene(anchors(T, R), T), print: PRINT }];
export { scene };

// ------------------------------------------------------------------------------------------------ layout (world px; band space = the plate)
const B = S.BAND, NF = { x: B.x - B.w / 2, y: B.y - B.h / 2, w: B.w / 2, h: B.h };          // the band's front half (the promise)
const Q1 = { text: '“… the first ultraintelligent machine is the last invention that man need ever make …”', x: 340, y: -700, w: 1240, size: 60 };
const Q2 = { text: '“The survival of man depends on the early construction of an ultraintelligent machine.”', x: 260, y: 140, w: 1400, size: 58 };
const Q3 = { text: '“It is more probable than not that, within the twentieth century, an ultraintelligent machine will be built …”', x: 180, y: 150, w: 1240, size: 56 };
const BAR = { y: -150, x0: 420, x1: 1500, y0: 1965, y1: 2026 };                              // the time bar (world): 1965 → 2026, linear
const yrX = (yr) => BAR.x0 + (yr - BAR.y0) * (BAR.x1 - BAR.x0) / (BAR.y1 - BAR.y0);
const HUT = { x: yrX(1941), floor: BAR.y, s: .25 };                                          // the hut: local design space 1920 × 1080, floor at local y 900
const hutW = (lx, ly) => [HUT.x + (lx - 960) * HUT.s, HUT.floor + (ly - 900) * HUT.s];
const LAMP = [960, 432], LAMPW = hutW(...LAMP), HUTCAM = hutW(960, 560);
const NR = 7, R0 = 15, RK = 1.6, RY = -440, RX0 = 330;                                       // the ring chain (world)
const RR = [...Array(NR)].map((_, k) => R0 * RK ** k), RX = [RX0]; for (let k = 1; k < NR; k++) RX.push(RX[k - 1] + 1.2 * (RR[k - 1] + RR[k]));
const EDGE = RX[5] + 1.25 * RR[5];
const LEAF = { x: 1650, y: 196, w: 220, h: 262 };
const ROW = { x: 1450, y: 600, w: 400, h: 64 };
const YOU = { feet: 868, h: 170, x: 560 };

function cardH(q) {
  const pad = 54, ws = q.text.split(/\s+/); let n = 0, cur = [];
  for (const wd of ws) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), q.size, true) > q.w - pad * 2) { n++; cur = [wd]; } else cur = nx; }
  if (cur.length) n++;
  return 24 + n * q.size * 1.22 + 40;
}
Q1.h = cardH(Q1); Q2.h = cardH(Q2); Q3.h = cardH(Q3);
// draw fn (which draws inside native rect N) mapped into the current rect C, x-scaled by fx (a flip: fx = cos θ)
function faceMap(ctx, N, C, fx, fn) {
  ctx.save(); ctx.translate(C.x + C.w / 2, C.y + C.h / 2); ctx.scale(C.w / N.w * fx, C.h / N.h); ctx.translate(-(N.x + N.w / 2), -(N.y + N.h / 2)); fn(ctx); ctx.restore();
}
const lerpRect = (A, Bq, e) => ({ x: lerp(A.x, Bq.x, e), y: lerp(A.y, Bq.y, e), w: lerp(A.w, Bq.w, e), h: lerp(A.h, Bq.h, e) });
const bez = (p0, c, p1, e) => [(1 - e) ** 2 * p0[0] + 2 * (1 - e) * e * c[0] + e * e * p1[0], (1 - e) ** 2 * p0[1] + 2 * (1 - e) * e * c[1] + e * e * p1[1]];

function scene(a, T) {
  // ---------------------------------------------------------------- times
  const tLift = a.promise + .32, tFlip0 = tLift + .3, tFlip1 = Math.max(tFlip0 + .8, a.quote + .2);   // the front half lifts, then flips
  const tBarL0 = a.war + .02, tBarL1 = a.war + .75;                                                       // the bar runs back to 1941
  const lampOn = a.war + 1.05;
  const tRing = a.logic - .05, tRingGo = a.logic + .4, tRingAt = a.logic + 1.3;                          // the lamp's light → ring 0 → P0
  // ring k: outline drawn [d0, d1], lit from d1
  const D0 = [tRing], D1 = [tRing + .5];
  D0[1] = a.design - .06; D1[1] = Math.min(a.mach + .05, a.design + .9);
  D0[2] = a.that + .1; D1[2] = D0[2] + .6;
  const durs = [0, 0, 0, .46, .38, .32, .3];
  for (let k = 3; k < NR; k++) { D0[k] = k === 3 ? Math.max(D1[2] + .05, a.still - .05) : D1[k - 1] + .02; D1[k] = D0[k] + durs[k]; }
  const tStrike = a.but - .02, tPeel0 = a.but + .3, tPeel1 = a.but + .75, tUnroll1 = a.but + 1.35;
  const tFlip2 = a.guess + .02, tFlip3 = a.guess + .95;
  const tLeaf0 = a.century - .35, tLeaf1 = a.century + .3, tTear = a.wrong + .02;
  const tRow0 = a.date + .35, tRow1 = a.date + .95;
  const ring0At = (t) => { const e = sineIO(span(t, tRingGo, tRingAt)); return bez(LAMPW, [LAMPW[0] + 60, RY - 60], [RX0, RY], e); };
  // ---------------------------------------------------------------- the world camera (keys on phrases)
  const fit = (k0, k1, fr = .66) => { const xa = RX[k0] - RR[k0] * 1.3, xb = RX[k1] + RR[k1] * 1.3, z = Math.min(W * fr / (xb - xa), H * .6 / (RR[k1] * 2.5)); return [(xa + xb) / 2, RY + RR[k1] * .28, z]; };
  const FIN = (() => { const xa = RX[3] - RR[3] * 1.2, xb = EDGE + 150, z = W * .95 / (xb - xa); return [(xa + xb) / 2, -380, z]; })();
  const K = [
    [a.t0, W / 2, H / 2 - 20, 1], [tLift - .05, 585, 430, 1.42], [tFlip0, 583, 424, 1.43],
    [tFlip1, 960, -330, 1], [tBarL0, 956, -342, 1.08],
    [tBarL0 + .6, 330, -260, 1.12], [lampOn + .25, HUTCAM[0], HUTCAM[1], 4], [a.logic - .45, HUTCAM[0] + 6, HUTCAM[1] - 4, 4.3],
    [tRingGo, LAMPW[0], LAMPW[1] - 2, 6.6],
    ...[.3, .6, 1].map((f) => { const tt = lerp(tRingGo, tRingAt, f), p = ring0At(tt - .1); return [tt + (f === 1 ? .15 : 0), p[0], p[1] + 10 * f, lerp(6.6, 9.2, sineIO(f))]; }),
    [D0[1] - .15, ...fit(0, 1)], [a.that, ...fit(0, 1, .7)], [D1[2] + .1, ...fit(0, 2)], [D1[4] + .05, ...fit(1, 4, .8)],
    [a.endW + .1, ...FIN], [a.but - .05, FIN[0] + 4, FIN[1], FIN[2] * 1.015], [a.end + .5, FIN[0] + 14, FIN[1] - 4, FIN[2] * 1.07],
  ];
  // during the flip the camera rides with the card on the same ease (the card keeps its size and glides on screen; no lurch)
  const camF0 = F.lookPath(tFlip0, K), camF1 = F.lookPath(tFlip1, K);
  const cam = (t) => {
    if (t <= tFlip0 || t >= tFlip1) return F.lookPath(t, K);
    const e = quartIO(span(t, tFlip0, tFlip1));
    return { cx: lerp(camF0.cx, camF1.cx, e), cy: lerp(camF0.cy, camF1.cy, e), z: Math.exp(lerp(Math.log(camF0.z), Math.log(camF1.z), e)) };
  };
  const c0 = F.lookPath(a.t0, K);
  // ---------------------------------------------------------------- 1.01–1.02 the band, the lifted front half, the flip into card 1
  const lifted = (t) => {   // the front half's rect (world) while it lifts, or null
    if (t < tLift) return null;
    const l = sineIO(span(t, tLift, tFlip0)), s = 1 + .04 * l;
    return { x: NF.x - NF.w * (s - 1) / 2, y: NF.y - 34 * l - NF.h * (s - 1) / 2, w: NF.w * s, h: NF.h * s, l };
  };
  const frontFace = (t) => (ctx) => { ctx.save(); ctx.beginPath(); ctx.roundRect(NF.x, NF.y, NF.w, NF.h, [14, 0, 0, 14]); ctx.clip(); F.band(ctx, t, B.x, B.y, B.w, B.h, { u: 1, type: 1, gold: 1, cover: 0, empty: 0 }); ctx.restore(); };
  const card1Face = (t) => (ctx) => F.quoteCard(ctx, t, T, { text: Q1.text, x: Q1.x, y: Q1.y, w: Q1.w, size: Q1.size, spoken: ['The first ultra-intelligent', 'ever make'], after: a.t0, rot: -.006 });
  const age = (t) => smooth(span(t, a.more, a.sixty + .6));
  const drawBand = (ctx, t) => {
    if (t > tFlip1 + .6) return;
    const L = lifted(t), g = 1 - smooth(span(t, tLift, tFlip1));
    S.bandState(ctx, t, { gold: g });
    if (L) {   // the socket left behind: the band's empty front half
      ctx.save(); ctx.beginPath(); ctx.roundRect(NF.x, NF.y, NF.w, NF.h, [14, 0, 0, 14]);
      ctx.fillStyle = F.lin(ctx, 0, NF.y, 0, NF.y + NF.h, [[0, mixHex(P.night1, P.ind1, .6)], [1, mixHex(P.night0, P.night1, .6)]]); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, .45); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    }
    F.capsLabel(ctx, 'PROMISE', NF.x + NF.w / 2, NF.y + NF.h + 58, span(t, a.promise - .05, a.promise + .45) * (1 - span(t, tLift - .05, tLift + .3)), { size: 28, col: GOLD.text });
  };
  const drawFlip = (ctx, t) => {
    const L = lifted(t); if (!L || t > tFlip1 + .02) return;
    const e = quartIO(span(t, tFlip0, tFlip1)), th = Math.PI * e, fx = Math.cos(th);
    const C1 = { x: Q1.x, y: Q1.y, w: Q1.w, h: Q1.h }, r = lerpRect(L, C1, e);
    const c = bez([L.x + L.w / 2, L.y + L.h / 2], [520, -300], [C1.x + C1.w / 2, C1.y + C1.h / 2], e); r.x = c[0] - r.w / 2; r.y = c[1] - r.h / 2;
    // the shadow it casts on the night while it is lifted / turning
    ctx.save(); ctx.fillStyle = rgba(P.night0, .35 * L.l * (1 - e)); ctx.beginPath(); ctx.roundRect(r.x + 10 + 20 * L.l, r.y + 16 + 26 * L.l, r.w * Math.max(.05, Math.abs(fx)), r.h, 14); ctx.fill(); ctx.restore();
    if (fx > 0) faceMap(ctx, NF, r, Math.max(.002, fx), frontFace(t));
    else faceMap(ctx, C1, r, Math.max(.002, -fx), card1Face(t));
  };
  const drawCard1 = (ctx, t) => {
    if (t < tFlip1 || t > tBarL0 + 1.1) return;
    const away = F.expoIn(span(t, tBarL0 - .05, tBarL0 + 1)) * 1300;
    ctx.save(); ctx.translate(0, -away);
    card1Face(t)(ctx);
    const ag = age(t);
    if (ag > 0) {   // paper tone: the sheet yellows (multiply), its edge darkens a little
      ctx.save(); ctx.translate(Q1.x + Q1.w / 2, Q1.y + Q1.h / 2); ctx.rotate(-.006);
      ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#c89a5a', .26 * ag); ctx.beginPath(); ctx.roundRect(-Q1.w / 2, -Q1.h / 2, Q1.w, Q1.h, 6); ctx.fill();
      ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = rgba('#8a6a3c', .5 * ag); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    }
    const cu = span(t, tFlip1 + .25, tFlip1 + .95);
    F.capsLabel(ctx, 'I. J. GOOD, 1965', Q1.x + 4, Q1.y + Q1.h + 50, cu, { size: 26, col: GOLD.text, align: 'left' });
    F.capsLabel(ctx, '“SPECULATIONS CONCERNING THE FIRST ULTRAINTELLIGENT MACHINE” · ADVANCES IN COMPUTERS 6, P. 33', Q1.x + 4, Q1.y + Q1.h + 84, span(cu, .15, 1), { size: 22, align: 'left' });
    ctx.restore();
  };
  // ---------------------------------------------------------------- 1.03–1.05 the time bar (world line, screen type)
  const barU = (t) => smooth(span(t, a.sixty - .12, a.sixty + .75));
  const barL = (t) => sineIO(span(t, tBarL0, tBarL1));
  const drawBar = (ctx, t, z) => {
    if (t < a.sixty - .15 || t > a.logic + .5) return;
    const u = barU(t); if (u > 0 && t < tBarL0 + 1.6) F.goldSpan(ctx, [[BAR.x0, BAR.y], [BAR.x1, BAR.y]], 0, u, { w: 2.6 / z });
    for (let yr = 1970; yr <= 2020; yr += 10) { const x = yrX(yr), k = smooth(span(u, (x - BAR.x0) / (BAR.x1 - BAR.x0) - .02, (x - BAR.x0) / (BAR.x1 - BAR.x0) + .08)); if (k > 0 && t < tBarL0 + 1.6) { ctx.fillStyle = rgba(CREAM, .55 * k); ctx.fillRect(x - 1 / z, BAR.y - 9 / z, 2 / z, 18 / z * k); } }
    const l = barL(t);   // back to 1941 (it becomes the hut's floor line)
    if (l > 0) F.goldSpan(ctx, [[BAR.x0, BAR.y], [HUT.x, BAR.y]], 0, l, { w: 2.6 / z });
    if (l > 0) F.goldSpan(ctx, [[HUT.x, BAR.y], [HUT.x - 1300, BAR.y]], 0, smooth(span(t, tBarL1 - .05, tBarL1 + .8)), { w: 2.6 / z, spark: false, a: .7 });
  };
  const drawBarType = (ctx, t, sp) => {
    if (t < a.sixty - .1 || t > tBarL0 + 1.4) return;
    const u = barU(t), out = 1 - span(t, tBarL0 + .25, tBarL0 + .6);
    const [x0, y0] = sp(BAR.x0, BAR.y), [x1] = sp(BAR.x1, BAR.y);
    F.maskLine(ctx, [['1965', 0]], x0, y0 + 58, 38, rise(span(t, a.sixty - .1, a.sixty + .4) * out), { serif: true, col: CREAM, glow: false, align: 'center' });
    F.maskLine(ctx, [['2026', 1]], x1, y0 + 58, 38, rise(span(u, .85, 1) * out), { serif: true, col: GOLD.text, glow: false, align: 'center' });
    const vu = span(t, a.sixty + .25, a.sixty + .85) * (1 - span(t, tBarL0, tBarL0 + .35));
    if (vu > 0) F.verdict(ctx, t, (x0 + x1) / 2 + 200, y0 - 64, 'MORE THAN 60 YEARS', vu, { size: 34 });
    const l = barL(t); if (l > .6) { const [hx, hy] = sp(HUT.x, BAR.y); F.maskLine(ctx, [['1941', 0]], hx, hy + 58, 38, rise(span(l, .6, 1) * (1 - span(t, lampOn - .4, lampOn))), { serif: true, col: CREAM, glow: false, align: 'center' }); }
  };
  // the name tag: rises on a stem from the 1965 end, rides the bar back to 1941 and settles over Good's head in the hut
  const TAG0 = [BAR.x0, BAR.y - 112], TAG1 = hutW(700, 500);
  const drawTag = (ctx, t, sp, z) => {
    const u = span(t, a.jack - .08, a.jack + .55); if (u <= 0 || t > a.logic + .2) return;
    const m = sineIO(span(t, tBarL0, lampOn + .2)), wp = [lerp(TAG0[0], TAG1[0], m), lerp(TAG0[1], TAG1[1], m)];
    const stem = smooth(span(t, a.jack - .12, a.jack + .25)) * (1 - span(t, tBarL0, tBarL0 + .3));
    if (stem > 0) { const [bx, by] = sp(BAR.x0, BAR.y), [tx, ty] = sp(...TAG0); F.goldSpan(ctx, [[bx, by - 4], [tx, ty + 14]], 0, stem, { w: 1.6, spark: stem < 1 }); }
    const [x, y] = sp(...wp), out = span(t, a.logic - .4, a.logic + .1);
    F.maskLine(ctx, [['I. J. “JACK” GOOD', 0]], x, y, 40, rise(Math.min(u, 1 - out)), { serif: true, col: CREAM, glow: true, align: 'center' });
  };
  // ---------------------------------------------------------------- 1.05–1.06 the hut (local design space, floor at y 900)
  const lampL = (t) => { const on = span(t, lampOn - .15, lampOn + .2), fl = on > 0 && on < 1 ? .55 + .45 * Math.sin(t * 83) : 1; return (.12 + .88 * on * fl) * (1 - sineIO(span(t, tRing, tRing + .5))); };
  const turIn = (t) => sineIO(span(t, a.turing - .45, a.turing + .45));
  const STRIPS = (() => { const r = F.prng(41), s = []; for (let i = 0; i < 5; i++) s.push({ x: 600 + r() * 120 + (i % 2) * 260, y: 694 + i * 8.5, w: 330 + r() * 90, rot: (r() - .5) * .05, g: [...Array(9)].map(() => r()) }); return s; })();
  const drawHut = (ctx, t) => {
    if (t < tBarL0 + .2 || t > tRingAt + .4) return;
    const L = lampL(t), ti = turIn(t);
    ctx.save(); ctx.translate(HUT.x, HUT.floor); ctx.scale(HUT.s, HUT.s); ctx.translate(-960, -900);
    // the hut as a cutaway box in the night: gable roof, walls, floor slab (it grows up out of the bar line as the camera arrives)
    const gu = expoOut(span(t, tBarL1 - .25, tBarL1 + .55));
    ctx.save(); ctx.beginPath(); ctx.rect(-200, 900 - 900 * gu - 10, 2320, 900 * gu + 400); ctx.clip();
    ctx.fillStyle = mixHex(EARTH.deep, P.night0, .45); F.poly(ctx, [[20, 236], [960, 40], [1900, 236]]); ctx.fill();
    ctx.fillStyle = rgba(EARTH.line, .35); ctx.fillRect(20, 230, 1880, 6);
    ctx.fillStyle = F.lin(ctx, 0, 236, 0, 900, [[0, mixHex(EARTH.deep, P.night1, .55)], [1, mixHex(EARTH.body, P.ind1, .55)]]); ctx.fillRect(60, 236, 1800, 664);
    ctx.fillStyle = rgba(P.night0, .35); for (let y = 290; y < 900; y += 58) ctx.fillRect(60, y, 1800, 3);                 // planks
    ctx.fillStyle = mixHex(EARTH.deep, P.night0, .3); ctx.fillRect(30, 236, 30, 664); ctx.fillRect(1860, 236, 30, 664);   // wall ends
    // the blacked-out window
    ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.fillRect(1480, 360, 250, 200); ctx.strokeStyle = mixHex(EARTH.line, P.night1, .4); ctx.lineWidth = 10; ctx.strokeRect(1480, 360, 250, 200); ctx.beginPath(); ctx.moveTo(1605, 360); ctx.lineTo(1605, 560); ctx.moveTo(1480, 460); ctx.lineTo(1730, 460); ctx.stroke();
    ctx.fillStyle = mixHex(EARTH.deep, P.night0, .6); ctx.fillRect(10, 900, 1900, 70);                                    // the floor slab
    // the two men (indigo, never yellow): Good leans over the strips; Turing steps into the light
    F.person(ctx, 690, 900, 360, { dir: 1, lean: .2 + .015 * Math.sin(t * 1.1), look: -.25, armR: [1.3, 1.75], armL: [1.1, 1.5], light: .3 + .7 * L });
    const tx = lerp(1420, 1255, ti), tw = Math.PI * 2 * (1 + ti);
    F.person(ctx, tx, 900, 372, { dir: -1, lean: lerp(.0, .2, ti) + .01 * Math.sin(t * .9 + 1), look: lerp(.05, -.2, ti), walk: ti > 0 && ti < 1 ? tw : undefined, armR: [lerp(.15, 1.2, ti), lerp(.1, 1.6, ti)], armL: [lerp(-.1, .9, ti), lerp(-.1, 1.3, ti)], light: -(.15 + .75 * ti) * L, long: true });
    // the table and its paper strips (cipher groups; on 'break' a gold reading light runs along them)
    ctx.fillStyle = mixHex(EARTH.body, P.ind2, .35); F.poly(ctx, [[560, 690], [1360, 690], [1410, 740], [510, 740]]); ctx.fill();
    ctx.fillStyle = mixHex(EARTH.deep, P.night0, .2); ctx.fillRect(510, 740, 900, 18); ctx.fillRect(540, 758, 22, 142); ctx.fillRect(1358, 758, 22, 142);
    const br = span(t, a.breakW - .05, a.codes + .5);
    for (const s of STRIPS) {
      ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot);
      ctx.fillStyle = mixHex(PAPER.shade, PAPER.lit, .4); ctx.fillRect(0, -7, s.w, 14);
      s.g.forEach((v, i) => { const gx = 12 + i * (s.w - 24) / 9, lit = smooth(span(br, (gx / s.w) * .8, (gx / s.w) * .8 + .2)); ctx.fillStyle = mixHex(PAPER.ink, GOLD.mid, lit); ctx.fillRect(gx, -3, (s.w - 24) / 9 - 8 * v - 4, 6); });
      ctx.restore();
    }
    // darkness: lit only by its lamp
    ctx.save(); ctx.beginPath(); ctx.rect(60, 236, 1800, 664); ctx.clip();
    ctx.fillStyle = F.rad(ctx, 960, 620, 1150, [[0, rgba(P.night0, .06 + .84 * (1 - L))], [.38, rgba(P.night0, .3 + .62 * (1 - L))], [1, rgba(P.night0, .93)]]); ctx.fillRect(60, 236, 1800, 664);
    ctx.restore();
    if (br > 0 && br < 1.2 && L > .3) for (const s of STRIPS) F.halo(ctx, s.x + s.w * Math.min(1, br * 1.05), s.y, 60, .35 * (1 - span(br, .9, 1)), GOLD.halo, GOLD.core);
    // the lamp: cord, shade, the bulb's light and its cone on the table
    ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(960, 236); ctx.lineTo(960, 392); ctx.stroke();
    ctx.fillStyle = mixHex(P.blue1, EARTH.deep, .45); F.poly(ctx, [[918, 392], [1002, 392], [1048, 436], [872, 436]]); ctx.fill();
    if (L > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = F.lin(ctx, 0, 436, 0, 760, [[0, rgba(GOLD.hot, .2 * L)], [1, rgba(GOLD.body, .03 * L)]]); F.poly(ctx, [[880, 436], [1040, 436], [1330, 748], [590, 748]]); ctx.fill();
      ctx.restore();
      F.halo(ctx, LAMP[0], LAMP[1] + 6, 70 + 230 * L, .9 * L, GOLD.halo, GOLD.core);
    }
    ctx.restore();
    ctx.restore();
  };
  // ---------------------------------------------------------------- 1.07–1.09 the ring chain (world)
  const drawChain = (ctx, t, z) => {
    if (t < tRing) return;
    for (let k = NR - 1; k >= 0; k--) {
      const x = k ? RX[k] : ring0At(t)[0], y = k ? RY : ring0At(t)[1], r = RR[k];
      if (k > 0) {
        const d = span(t, D0[k], D1[k]); if (d <= 0) continue;
        const pts = F.circlePts(x, y, r * 1.08, Math.PI, Math.PI + Math.PI * 2 * sineIO(d), 64);
        F.outline(ctx, [pts], 1, { dashed: true, t, w: 2.4 / z, a: .9 });
        if (d < 1) {   // the parent's beam and the drawing point (the machine designs the next one)
          const tip = pts[pts.length - 1], px = RX[k - 1], py = RY;
          ctx.save(); ctx.strokeStyle = rgba(COOL.line, .55); ctx.lineWidth = 1.6 / z; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tip[0], tip[1]); ctx.stroke(); ctx.restore();
          F.halo(ctx, tip[0], tip[1], 34 / z, .9, COOL.halo, COOL.core);
        }
      }
      if (k === NR - 1) continue;   // the last one is born in the dark: only its outline
      const lu = k ? span(t, D1[k] - .05, D1[k] + .5) : span(t, tRing, tRing + .55); if (lu <= 0) continue;
      const newest = k >= NR - 2 ? 1 : 1 - smooth(span(t, D1[k + 1] - .1, D1[k + 1] + .5));
      const dim = 1 - .55 * smooth(span(t, a.but + .2, a.but + 1.4));
      F.ring(ctx, t, x, y, r, { u: lu, lit: (.45 + .45 * newest) * dim, think: 0, a: lerp(1, .7, 1 - dim) });
    }
    // the dark edge the chain runs into
    ctx.save(); ctx.fillStyle = F.lin(ctx, EDGE - 18, 0, EDGE + 70, 0, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .94)]]); ctx.fillRect(EDGE - 18, RY - 3000, 9000, 6000); ctx.restore();
    const eu = smooth(span(t, a.ending - .05, a.endW + .4)); if (eu > 0) F.outline(ctx, [[[EDGE + 6, RY - 900], [EDGE + 6, RY + 900]]], eu, { dashed: true, t, w: 2 / z, a: .55 });
  };
  // ---------------------------------------------------------------- 1.10–1.13 cards 2 and 3 (screen), the leaf, the row, you
  const theEnd = (sp) => { const [ex] = sp(EDGE, RY), size = 84, w = F.measure('THE END?', size, true); return { x: ex - 46 - w, y: 836, w, size }; };
  const card2Face = (t) => (ctx) => {
    const b = F.quoteCard(ctx, t, null, { text: Q2.text, x: Q2.x, y: Q2.y, w: Q2.w, size: Q2.size, hi: ['survival', 'man'], hiU: span(t, a.surv - .05, a.surv + .3), rot: 0 });
    // a gold underline under "survival of man" (the words Good stakes everything on)
    const pad = 54, y = Q2.y + 24 + Q2.size * 1.22 + 14, x0 = Q2.x + pad + F.measure('“The', Q2.size, true) + Q2.size * .26, x1 = x0 + F.measure('survival', Q2.size, true) + F.measure('of', Q2.size, true) + F.measure('man', Q2.size, true) + Q2.size * .52;
    const u = smooth(span(t, a.surv + .1, a.surv + .7)); if (u > 0) F.goldSpan(ctx, [[x0, y], [x1, y]], 0, u, { w: 2.2, spark: u < 1 });
    return b;
  };
  const card3Face = (t) => (ctx) => F.quoteCard(ctx, t, T, { text: Q3.text, x: Q3.x, y: Q3.y, w: Q3.w, size: Q3.size, spoken: ['within the twentieth', 'century'], after: a.guess, mode: 'hi', rot: 0 });
  const tilt = (t) => { const k = t - tTear; return -.022 * smooth(span(t, tTear - .05, tTear + .35)) + (k > 0 ? .01 * Math.exp(-k * 4) * Math.sin(k * 13) : 0) - .016 * sineIO(span(t, a.why, a.why + 1.6)) - .004 * Math.max(0, t - a.why - 1.6); };
  const drawCards = (ctx, t, sp, o = {}) => {
    if (t < tStrike) return;
    // THE END? (from the ending) and its strike
    const E_ = theEnd(sp), qo = span(t, a.guess - .3, a.guess + .2);
    if (t < a.guess + .3) {
      const s = E_.y - E_.size * .3;
      F.strike(ctx, E_.x, s, E_.x + E_.w, span(t, tStrike, tStrike + .4) * (1 - qo), { w: 6 });
    }
    // the strike's copy peels off, rises and stretches into the card's top edge; the card unrolls downward from it
    const pe = quartIO(span(t, tPeel0, tPeel1)), ur = expoOut(span(t, tPeel1 - .05, tUnroll1));
    if (t < tFlip2 + .05) {
      if (pe > 0 && ur < 1) { const y = lerp(E_.y - E_.size * .3, Q2.y, pe), x0 = lerp(E_.x, Q2.x, pe), x1 = lerp(E_.x + E_.w, Q2.x + Q2.w, pe); F.trailCream(ctx, [[x0, y], [x1, y]], 0, 1, { w: 4 }); }
      if (ur > 0) {
        const hh = Q2.h * ur;
        ctx.save(); ctx.beginPath(); ctx.rect(Q2.x - 20, Q2.y - 20, Q2.w + 60, hh + 26); ctx.clip(); if (t < tFlip2) card2Face(t)(ctx); ctx.restore();
        if (ur < 1) F.trailCream(ctx, [[Q2.x, Q2.y + hh], [Q2.x + Q2.w, Q2.y + hh]], 0, 1, { w: 3 });
      }
      const cu = span(t, tUnroll1 - .2, tUnroll1 + .5) * (1 - span(t, tFlip2 - .25, tFlip2 + .05));
      F.capsLabel(ctx, 'I. J. GOOD, 1965 · “SPECULATIONS CONCERNING THE FIRST ULTRAINTELLIGENT MACHINE”, P. 31', Q2.x + 4, Q2.y + Q2.h + 48, cu, { size: 22, align: 'left' });
    }
    // card 2 flips into card 3
    if (t >= tFlip2 && t < tFlip3) {
      const e = quartIO(span(t, tFlip2, tFlip3)), fx = Math.cos(Math.PI * e), r = lerpRect(Q2, Q3, e);
      ctx.save(); ctx.fillStyle = rgba(P.night0, .3); ctx.beginPath(); ctx.roundRect(r.x + r.w * (1 - Math.abs(fx)) / 2 + 12, r.y + 18, r.w * Math.abs(fx), r.h, 8); ctx.fill(); ctx.restore();
      if (fx > 0) faceMap(ctx, Q2, r, Math.max(.002, fx), card2Face(t)); else faceMap(ctx, Q3, r, Math.max(.002, -fx), card3Face(t));
    }
    if (t >= tFlip3 && !o.noCard3) {
      const piv = [Q3.x, Q3.y + Q3.h], th = tilt(t);
      ctx.save(); ctx.translate(...piv); ctx.rotate(th); ctx.translate(-piv[0], -piv[1]);
      card3Face(t)(ctx);
      const cu = span(t, tFlip3 + .1, tFlip3 + .8);
      F.capsLabel(ctx, 'I. J. GOOD, 1965 · “SPECULATIONS CONCERNING THE FIRST ULTRAINTELLIGENT MACHINE”, P. 78', Q3.x + 4, Q3.y + Q3.h + 48, cu, { size: 22, align: 'left' });
      ctx.restore();
      drawLeaf(ctx, t, piv, th);
    }
  };
  const drawLeaf = (ctx, t, piv, th) => {
    if (t < tLeaf0) return;
    const hook = [Q3.x + Q3.w, Q3.y + 70], hx = piv[0] + (hook[0] - piv[0]) * Math.cos(th) - (hook[1] - piv[1]) * Math.sin(th), hy = piv[1] + (hook[0] - piv[0]) * Math.sin(th) + (hook[1] - piv[1]) * Math.cos(th);
    const top = [LEAF.x, LEAF.y], fall = t - tTear;
    // the thread from the card's edge to the leaf (it snaps back when the leaf tears)
    const thr = smooth(span(t, tLeaf0, tLeaf0 + .35)) * (1 - smooth(span(t, tTear, tTear + .25)));
    if (thr > 0) F.goldSpan(ctx, [[hx, hy], [top[0], top[1] - 6]], 0, thr, { w: 1.4, spark: thr < 1 });
    if (fall > 1.4) return;
    const un = expoOut(span(t, tLeaf0 + .2, tLeaf1)), sw = .025 * Math.sin(t * 1.4) + (t > a.date && t < tTear ? .05 * Math.sin((t - a.date) * 9) * Math.exp(-(t - a.date) * 1.5) : 0);
    ctx.save(); ctx.translate(top[0], top[1]);
    if (fall > 0) { ctx.translate(90 * fall + 30 * Math.sin(fall * 5), 900 * fall * fall + 60 * fall); ctx.rotate(1.3 * fall * fall + .4 * Math.sin(fall * 6)); }
    ctx.rotate(sw);
    ctx.beginPath(); ctx.rect(-LEAF.w / 2 - 20, -10, LEAF.w + 40, LEAF.h * un + 20); ctx.clip();
    ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(-LEAF.w / 2 + 8, 12, LEAF.w, LEAF.h, 6); ctx.fill();
    ctx.fillStyle = F.lin(ctx, 0, 0, 0, LEAF.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-LEAF.w / 2, 0, LEAF.w, LEAF.h, 6); ctx.fill();
    ctx.fillStyle = mixHex(P.ind1, P.night1, .3); ctx.beginPath(); ctx.roundRect(-LEAF.w / 2, 0, LEAF.w, 56, [6, 6, 0, 0]); ctx.fill();
    for (const hx2 of [-46, 46]) { ctx.fillStyle = PAPER.body; ctx.beginPath(); ctx.arc(hx2, 22, 7, 0, 6.29); ctx.fill(); }
    F.maskLine(ctx, [['YEAR', 0]], 0, 47, 18, 1, { serif: false, weight: 600, col: P.halo2, glow: false, align: 'center' });
    F.maskLine(ctx, [['2000', 0]], 0, 190, 96, 1, { serif: true, col: PAPER.ink, glow: false, align: 'center' });
    ctx.restore();
  };
  const drawRowYou = (ctx, t) => {
    // the empty last row (signature): a gold line widens into the glowing slot, and stays empty
    const ru = span(t, tRow0, tRow1); if (ru > 0) {
      const wu = expoOut(span(ru, 0, .55)), hu = expoOut(span(ru, .35, 1)), w = ROW.w * wu, h = lerp(4, ROW.h, hu);
      ctx.save(); ctx.beginPath(); ctx.rect(ROW.x + ROW.w / 2 - w / 2 - 30, ROW.y + ROW.h / 2 - h / 2 - 30, w + 60, h + 60); ctx.clip();
      F.boardRow(ctx, t, ROW.x + ROW.w / 2 - w / 2, ROW.y + ROW.h / 2 - Math.max(h, 8) / 2, w, Math.max(h, 8), { empty: true }); ctx.restore();
    }
    const wu = span(t, tTear + .25, tTear + .8) * (1 - span(t, a.why + .1, a.why + .5));
    F.capsLabel(ctx, 'WRONG ABOUT THE DATE', LEAF.x, LEAF.y + 150, wu, { size: 30, col: CREAM });
    // you walk in from the left and look up at the card
    const in0 = a.why - .15, in1 = a.why + 1.35; if (t < in0) return;
    const p = F.powOut(span(t, in0, in1), 1.6), travel = 640, M = Math.round(travel / 130), ph = Math.PI * 2 * M * (1 - p) + Math.PI * 2, sw = Math.sin(ph);
    F.du(ctx, YOU.x - travel * (1 - p), YOU.feet, YOU.h, { dir: 1, walk: ph, look: lerp(.2, .9, smooth(span(t, in1 - .5, in1 + .5))) + .03 * Math.sin(t * .8), armR: [-.42 * sw, -.42 * sw + .3], armL: [.42 * sw, .42 * sw + .3], light: .7 });
  };
  // ---------------------------------------------------------------- the night's light
  const glowAt = (t, c) => {
    const band = S.bandGlow(t), card = [960, 320, 1050, .6], hut = [960, 520, 900, .45], ringG = [...F.lookPt(c.cx, c.cy, c.z, ...ring0At(Math.max(t, tRing))), 900, .55], cards = [960, 300, 1000, .55];
    const k1 = smooth(span(t, tLift, tFlip1 + .3)), k2 = smooth(span(t, tBarL0, lampOn + .3)), k3 = smooth(span(t, tRing, tRingAt)), k4 = smooth(span(t, a.ending, a.but + .8));
    return band.map((v, i) => lerp(lerp(lerp(lerp(v, card[i], k1), hut[i], k2), ringG[i], k3), cards[i], k4));
  };

  // ======================================================================================================================== draw
  // o (only c03 uses it, to hand over): { noCard3 (it draws the tipping card itself), qOut 0..1 (the question sinks) }
  const draw = (ctx, t, o = {}) => {
    const c = cam(t), z = c.z;
    F.night(ctx, t, { glow: glowAt(t, c), ox: -(c.cx - c0.cx) * .05, oy: -(c.cy - c0.cy) * .05 });
    F.look(ctx, c.cx, c.cy, z, () => {
      drawBand(ctx, t);
      drawBar(ctx, t, z);
      drawHut(ctx, t);
      drawCard1(ctx, t);
      drawChain(ctx, t, z);
      drawFlip(ctx, t);
    });
    const sp = (x, y) => F.lookPt(c.cx, c.cy, z, x, y);
    drawBarType(ctx, t, sp);
    drawTag(ctx, t, sp, z);
    // hut labels (screen type anchored to the hut)
    { const out = span(t, a.logic - .45, a.logic - .05), [x, y] = sp(...hutW(150, 150));
      F.capsLabel(ctx, 'GERMAN NAVAL CODES', x, y + 40, span(t, a.codes - .1, a.codes + .5) * (1 - out), { size: 24, align: 'left' });
      F.capsLabel(ctx, 'HUT 8, BLETCHLEY PARK · 1941–42', x, y, span(t, a.bletch - .1, a.bletch + .5) * (1 - out), { size: 28, col: CREAM, align: 'left' });
      const [tx, ty] = sp(...hutW(1255, 470)), tu = span(t, a.turing - .05, a.turing + .5) * (1 - out);
      F.maskLine(ctx, [['ALAN TURING', 0]], tx, ty, 40, rise(tu), { serif: true, col: CREAM, glow: true, align: 'center' });
      F.capsLabel(ctx, 'HEAD OF HUT 8 · HIS FIRST BOSS', tx, ty + 38, span(tu, .25, 1), { size: 22, align: 'center' }); }
    // the chain's labels
    { const out = span(t, a.that - .1, a.that + .3), [x0, y0] = sp(RX[0], RY + RR[0] * 1.3), [x1, y1] = sp(RX[1], RY + RR[1] * 1.3);
      F.capsLabel(ctx, 'SMARTER', x0, y0 + 46, span(t, a.smarter - .05, a.smarter + .5) * (1 - out), { size: 26, col: CREAM });
      const du = span(t, a.design - .05, a.design + .55) * (1 - out);
      if (du > 0) { F.capsLabel(ctx, 'DESIGNS A BETTER ONE', x1 + 30, y1 + 46, du, { size: 26, col: COOL.text, align: 'left' }); F.capsLabel(ctx, '→', x1, y1 + 46, du, { size: 26, col: CREAM }); } }
    // THE END?
    { const E_ = theEnd(sp), u = span(t, a.endW - .05, a.endW + .5) * (1 - span(t, a.guess - .3, a.guess + .2));
      if (u > 0) F.question(ctx, t, 'THE END?', E_.x, E_.y, E_.size, { u, align: 'left' }); }
    drawCards(ctx, t, sp, o);
    if (t > tRow0 - .1) drawRowYou(ctx, t);
    if (a.whyW && t > a.why - .1) F.question(ctx, t, 'Why take him seriously today?', 700, 700, 60, { ts: a.whyW, align: 'left', out: o.qOut ?? 0 });
  };
  const out = (ctx, t) => draw(ctx, t);
  out.with = draw;
  out.card3 = { face: card3Face, Q3, tilt };
  return out;
}
