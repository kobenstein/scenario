// Film 19 · c01 + c02 (picture lead): ONE continuous take from frame 0 (thumbnail A, night blue) to the bubble seam (plateBubble).
// sc01 and sc02 both return this draw function, so the c01 | c02 boundary is identical by construction.
// World = the thumbnail layout (1920×1080 at camera s = 1, centre 960/540). A 2D camera { cx, cy, s } frames it; the HUDs are in screen space.
//   1.01 thumbnail · 1.02 pull back + tilt up: the line is a day chart, NOV 5, −$2 TRILLION · 1.03 CRASH? · 1.04 down to you, HOT TIP
//   1.05 stopwatch + dice slide off · 1.06 the five gores, gore 5 widens over three people · 1.07 the line shatters out, the road, the
//   milestone counter, the umbrella folds into the HUD · 2.01 push to the counter: NOV 5 leaf, flaps rattle, snap to 030 · 2.02 the road
//   tilts up into the S&P line, RECORD HIGH, the dot slides to today · 2.03 the line lies flat: the route map, counter → HUD, four exits
//   2.04 names · 2.05 ≈ 7 WEEKS · 2.06 the gold run, ≈ 2.5 YEARS · 2.07 the bubble swells from today's dot, push into its skin → plateBubble
import { Path2D, createCanvas } from '@napi-rs/canvas';
import { bump } from './f18_kit.mjs';
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
import * as PR from './f19_props.mjs';
import { plateBubble, hallRows, BUBBLE_PLATE, SEAM_HALF } from './f19_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin, prng, drift } = E;

const GY = 935;                                   // ground line (your feet) in world
const YOU = { x: 1387, y: 942, h: 212 };
const MILE = { x: 1600, top: 772, h: 58 };        // the milestone counter (top-left computed from its width)
const CHART = [[-1100, -300], [-880, -240], [-660, -290], [-430, -200], [-210, -250], [20, -170], [250, -220], [480, -140], [700, -180], [880, -110], [960, -90],
  [1060, 0], [1265, 170], [1240, 195], [1495, 495], [1470, 520], [1585, 648]];
const PEAK = [830, 330], TODAY = [1490, 735];
const IMPACT = [1560, 642];

const memo = new WeakMap();
function anchors(T) {
  let A = memo.get(T); if (A) return A;
  const G = (p, n = 0, af = -1) => T.G(p, n, af), GE = (p, n = 0, af = -1) => T.GE(p, n, af);
  A = {
    crash1: G('crash'), nov5: G('November fifth'), trillion: G('two trillion'), single: G('single day'),
    nobody: G('Nobody knows'), crash2: G('crash', 0, G('Nobody knows')), butif: G('But if it is'), protects: G('protects you'), tip: G('stock tip'),
    timing: G('timing'), luck: G('luck'), five: G('Five things'), oneOf: G('one of them'), alone: G('alone'), which: G('So which ones'), already: G('already have'),
    clock: G('If this is the crash, its clock'), started: G('It started at'), record: G('record high'), oct6: G('October sixth'),
    road: G('And the road ahead'), four: G('four exits'), bottom: G('hit bottom'),
    names: [G('tariff crash', 0, G('And the road ahead')), G('rate shock'), G('financial crisis', 0, G('And the road ahead')), G('dot-com bubble')],
    nearest: G('The nearest'), seven: G('seven weeks'), farthest: G('The farthest'), twohalf: G('two and a half years'), longest: G('longest this century'),
    soif: G('So if this is a bubble'), inside: G('inside it'), T0: G('Mostly, data centers'),
  };
  A.nov5b = G('November fifth', 0, A.clock); A.day30 = G('day thirty', 0, A.clock); A.bubble = G('bubble', 0, A.soif);
  memo.set(T, A); return A;
}

// ------------------------------------------------------------------------------------------------------------------------ camera
function camera(t, A) {
  const B = bubbleCam(A);
  const K = [
    [0, 960, 540, 1], [A.nov5 - .7, 960, 540, 1], [A.single + .5, 960, 410, .74],               // 1.02 pull back + tilt up
    [A.butif - .1, 960, 410, .74], [A.protects + .5, 1330, 690, 1.3],                           // 1.04 down to you
    [A.five - .4, 1350, 690, 1.3], [A.five + .9, 1480, 690, 1.55],                              // 1.06 up to the canopy
    [A.already - .2, 1490, 690, 1.55], [A.clock - .25, 960, 540, 1],                             // 1.07 pull back
    [A.clock + .35, 960, 540, 1], [A.nov5b - .5, MILE.x, MILE.top + MILE.h / 2 + 4, 3.1],        // 2.01 push to the counter
    [A.started - .1, MILE.x, MILE.top + MILE.h / 2 + 4, 3.28], [A.record + .5, 960, 540, 1],      // 2.02 pull back
    [A.farthest, 972, 542, 1.025], [A.longest + 1.2, 1000, 530, 1.045],                              // 2.06 a slight truck with the run
    [A.T0, 1000, 530, 1.045],                      // 2.07 push into the skin
  ];
  let k = 0; while (k < K.length - 2 && t >= K[k + 1][0]) k++;
  const [t0, x0, y0, s0] = K[k], [t1, x1, y1, s1] = K[k + 1];
  const last = k + 1 === K.length - 1, u = clamp((t - t0) / Math.max(1e-6, t1 - t0)), e = last ? quartIO(u) : sineIO(u);
  const s = Math.exp(lerp(Math.log(s0), Math.log(s1), e));
  // pan so that the zoom feels like moving towards the target: interpolate the centre in proportion to the log-scale progress
  let cx = lerp(x0, x1, e), cy = lerp(y0, y1, e);
  // the snap to 030: a short shock (3 frames)
  const sh = t >= A.day30 && t < A.day30 + .1 ? 1 - (t - A.day30) / .1 : 0;
  if (sh > 0) { cx += Math.sin(t * 190) * 7 * sh / s; cy += Math.cos(t * 230) * 5 * sh / s; }
  return { cx, cy, s };
}
const BUB_END = { x: 700, y: 440, r: 360 };
function bubbleCam() { const s = BUBBLE_PLATE.r / BUB_END.r; return { s, cx: BUB_END.x - (BUBBLE_PLATE.x - 960) / s, cy: BUB_END.y - (BUBBLE_PLATE.y - 540) / s }; }
const toS = (C, x, y) => [(x - C.cx) * C.s + 960, (y - C.cy) * C.s + 540];

// ------------------------------------------------------------------------------------------------------------------------ world layers
function sky(ctx, t, C) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, mixHex(P.ind0, P.blue1, .3)]]); ctx.fillRect(0, 0, W, H);
  E.stars(ctx, 1907, 120, t, [0, 0, W, H * .75], .8);
}
function hillsWide(ctx) {
  ctx.fillStyle = mixHex(P.ind0, P.blue0, .2);
  ctx.beginPath(); ctx.moveTo(-2600, GY); ctx.lineTo(-2600, 640); ctx.lineTo(-900, 520); ctx.lineTo(-40, 680); ctx.lineTo(380, 395); ctx.lineTo(900, 795); ctx.lineTo(1240, GY); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.ind1, P.blue0, .3);
  ctx.beginPath(); ctx.moveTo(700, GY); ctx.lineTo(1180, 615); ctx.lineTo(1480, 555); ctx.lineTo(1960, 395); ctx.lineTo(2700, 300); ctx.lineTo(4200, 520); ctx.lineTo(4200, GY); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .55);
  ctx.beginPath(); ctx.moveTo(-2600, GY); ctx.lineTo(-2600, 860); ctx.lineTo(-900, 800); ctx.lineTo(260, 875); ctx.lineTo(520, GY); ctx.closePath(); ctx.fill();
  // mist on the left horizon (the road runs into it)
  ctx.fillStyle = lin(ctx, -1400, 0, 700, 0, [[0, rgba(P.blue2, .55)], [1, rgba(P.blue2, 0)]]); ctx.fillRect(-2600, GY - 160, 3300, 200);
}
function plain(ctx) {
  ctx.fillStyle = lin(ctx, 0, GY - 20, 0, GY + 500, [[0, mixHex(P.ind0, P.night1, .3)], [1, P.night0]]); ctx.fillRect(-3000, GY - 20, 8000, 3000);
}
// the red line: the Nov 5 day chart in the sky whose last steps fall onto your umbrella (thumbnail A). keep 0..1 = how much is still whole
function redLine(ctx, t, A, keep) {
  if (keep <= 0) return;
  F.redArrow(ctx, t, CHART, keep, { w: 52 });
  // 1.02: the last drop glows on "single day"
  const g = bump(t, A.single, 1.6);
  if (g > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; F.redArrow(ctx, t, CHART.slice(10), keep < 1 ? 0 : 1, { w: 64, a: .25 * g }); ctx.restore(); }
}
const BURSTS = (A) => [-1.5, -.7, A.crash1, A.crash1 + 1.6, A.nov5 + 1.4, A.trillion + 1.2, A.nobody + .6, A.crash2 + .2, A.protects - .2, A.tip + .6, A.timing + .9, A.five - .3];
function impactShards(ctx, t, A, upto) {
  BURSTS(A).forEach((t0, i) => { if (t0 > upto) return; F.shards(ctx, t, IMPACT[0] + 6 * Math.sin(i), IMPACT[1] + 4 * Math.cos(i), t0, { n: i < 3 ? 18 : 11, seed: 31 + i * 7, dir: .35, spread: 1.7, speed: .9 }); });
}
function title(ctx, t, A) {
  const s1 = sineIO(span(t, A.nov5 - .45, A.nov5 + .45)), s2 = sineIO(span(t, A.nov5 - .25, A.nov5 + .65));
  const line = (txt, y, size, sk) => {
    if (sk >= 1) return;
    ctx.save(); ctx.beginPath(); ctx.rect(-200, -400, 2000, y + 64 + 400); ctx.clip();
    F.titleText(ctx, txt, 90, y + sk * (size * .8 + 64), size, { cond: .64 });
    ctx.restore();
  };
  line('WHAT PROTECTS', 460, 222, s1); line('YOU', 770, 372, s2);
}
// the small counter under the title (1.01–1.03); it sinks into its baseline on "But if it is"
function hookCounter(ctx, t, A) {
  const sk = sineIO(span(t, A.butif - .2, A.butif + .6)); if (sk >= 1) return;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 700, 900, 150); ctx.clip();
  F.flap(ctx, t, 96, 790 + sk * 80, 50, { value: 30, glow: .8 });
  ctx.restore();
}
function nov5Labels(ctx, t, A) {
  const out = sineIO(span(t, A.butif - .3, A.butif + .5));   // everything of 1.02/1.03 sinks away as the camera goes down to you
  if (out >= 1) return;
  const masked = (y, fn) => { ctx.save(); ctx.beginPath(); ctx.rect(-1000, -800, 4000, y + 800 + 8); ctx.clip(); fn(); ctx.restore(); };
  // NOV 5 at the last drop
  const a1 = span(t, A.nov5, A.nov5 + .6);
  if (a1 > 0) masked(70, () => E.glowText(ctx, 'NOV 5', 1135, 70 + (1 - expoOut(a1)) * 50 + out * 70, { size: 54, spacing: .1 }));
  // −$2 TRILLION where the title was
  const a2 = span(t, A.trillion - .25, A.trillion + .6);
  if (a2 > 0) {
    const v = Math.min(2, Math.floor(lerp(0, 2.999, span(t, A.trillion - .15, A.trillion + .55))));
    masked(330, () => E.glowText(ctx, `−$${v} TRILLION`, 96, 330 + (1 - sineIO(a2)) * 70 + out * 160, { size: 150, col: F.RED.hot, glow: false }));
    const a3 = span(t, A.trillion + .4, A.trillion + 1.0);
    masked(412, () => { E.glowText(ctx, 'TECH STOCKS · ONE DAY', 100, 412 + (1 - expoOut(a3)) * 60 + out * 90, { size: 46, spacing: .08, a: a3 > 0 ? 1 : 0 }); });
    masked(470, () => E.glowText(ctx, 'NPR', 100, 470 + (1 - expoOut(a3)) * 40 + out * 60, { size: 24, weight: 500, col: P.halo2, glow: false, spacing: .14, a: a3 > 0 ? 1 : 0 }));
  }
  // CRASH? stamp on the falling steps (1.03): drops and lands; the question mark rocks on "crash"
  const ts = A.nobody + .35;
  if (t >= ts - .22) {
    const drop = expoIn(span(t, ts - .22, ts)), k = 1.25 - .25 * drop, x = 1345, y = 250 - out * 40;
    const lift = out;
    ctx.save(); ctx.translate(x, y - lift * 160); ctx.rotate(-.09); ctx.scale(k, k); ctx.globalAlpha *= (drop < 1 ? .3 + .7 * drop : 1) * (1 - smooth(span(lift, .3, 1)));
    const bw = 330, bh = 120;
    ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 16); ctx.fill();
    ctx.strokeStyle = P.cream; ctx.lineWidth = 7; ctx.stroke(); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(-bw / 2 + 12, -bh / 2 + 12, bw - 24, bh - 24, 10); ctx.stroke();
    E.glowText(ctx, 'CRASH', -22, 24, { size: 64, align: 'center', spacing: .1, glow: false });
    const rock = Math.sin((t - A.crash2) * 6) * Math.exp(-Math.max(0, t - A.crash2) * 1.2) * (t > A.crash2 ? .35 : 0) + .05 * Math.sin(t * 2.1);
    ctx.save(); ctx.translate(112, 22); ctx.rotate(rock); E.glowText(ctx, '?', 0, 0, { size: 64, align: 'center', glow: false }); ctx.restore();
    ctx.restore();
    const hit = span(t, ts, ts + .35); if (hit > 0 && hit < 1) E.dust(ctx, 61, 120, x, y, 200 * (.6 + hit), 60, t, .6 * (1 - hit));
  }
}
// small falling things (1.04 HOT TIP, 1.05 stopwatch + dice) — they fall/blow onto the canopy and slide off; nothing protects like the umbrella
function hotTip(ctx, t, A) {
  const t0 = A.protects + .25, t1 = A.tip + 1.4, u = span(t, t0, t1); if (u <= 0 || u >= 1) return;
  const x = lerp(620, 2150, u), y = 560 + Math.sin(u * 7) * 30 - 60 * Math.sin(u * Math.PI) + (u > .42 && u < .62 ? 34 * Math.sin((u - .42) / .2 * Math.PI) : 0);
  PR.paperCard(ctx, x, y, 200, 96, { tilt: Math.sin(u * 11) * .35, lit: .5 });
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(u * 11) * .35); E.glowText(ctx, 'HOT TIP ↑', 0, 12, { size: 30, align: 'center', col: '#3a3550', glow: false }); ctx.restore();
}
function fallOff(ctx, t, t0, side, draw, sinkAt = 1e9) {
  // falls from the sky onto the canopy (.55 s), slides off its slope (.5 s), drops to the ground; a gold rule strikes through it there
  const land = t0 + .55, off = land + .5, ground = off + .45, k = t - (t0 - .1); if (k < 0) return;
  let x, y, r = 0;
  const cx = 1440 + side * 40;
  if (t < land) { const u = expoIn(span(t, t0 - .1, land)); x = cx; y = lerp(-80, 640, u); r = u * .3 * side; }
  else if (t < off) { const u = sineIO(span(t, land, off)); x = cx + side * lerp(0, 150, u); y = lerp(640, 735, u); r = .3 * side + u * .8 * side; }
  else { const u = expoIn(span(t, off, ground)); x = cx + side * lerp(150, 230, u); y = lerp(735, GY - 26, u); r = 1.1 * side + u * .4 * side; }
  const sk = sineIO(span(t, sinkAt, sinkAt + .7)); if (sk >= 1) return;
  ctx.save(); ctx.beginPath(); ctx.rect(-1000, -1000, 5000, GY + 1000); ctx.clip(); y += sk * 90;
  ctx.save(); ctx.translate(x, y); ctx.rotate(r); draw(); ctx.restore();
  const st = span(t, ground, ground + .35);
  if (st > 0) { ctx.save(); ctx.strokeStyle = P.halo0; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = 14; ctx.beginPath(); ctx.moveTo(x - 48, y + 22); ctx.lineTo(x - 48 + 96 * expoOut(st), y + 22 - 52 * expoOut(st)); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
const stopwatch = (ctx) => { ctx.strokeStyle = P.cream; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.stroke(); ctx.fillStyle = P.cream; ctx.fillRect(-6, -44, 12, 9); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(12, -16); ctx.stroke(); };
const dice = (ctx) => { for (const [dx, dy, a] of [[-22, 0, -.2], [22, -6, .25]]) { ctx.save(); ctx.translate(dx, dy); ctx.rotate(a); ctx.fillStyle = P.cream; ctx.beginPath(); ctx.roundRect(-18, -18, 36, 36, 6); ctx.fill(); ctx.fillStyle = P.night1; for (const [px, py] of [[-8, -8], [8, 8], [0, 0]]) { ctx.beginPath(); ctx.arc(px, py, 3.4, 0, 7); ctx.fill(); } ctx.restore(); } };

// your umbrella in your raised right hand (1.01–1.07); returns the umbrella geometry
function umbrellaState(t, A) {
  const outline = smooth(span(t, A.five - .1, A.five + .5)) * (1 - smooth(span(t, A.already + .6, A.already + 1.1)));
  const dim = smooth(span(t, A.five - .1, A.five + .5)) * (1 - smooth(span(t, A.which - .2, A.which + .5)));
  const g5 = smooth(span(t, A.oneOf, A.oneOf + .5)), w5 = sineIO(span(t, A.alone - .1, A.alone + .9));
  const lit = [0, 1, 2, 3, 4].map((i) => {
    let L = 1 - dim;
    if (i === 4) L = Math.max(L, .4 * g5 + .6 * w5);
    const bl = bump(t, A.already - .15 + i * .16, .35); L = Math.max(L, bl);  // the gores blink once in turn
    return L;
  });
  const glow = 1.35 + .5 * bump(t, A.protects, 1.6);
  const fold = sineIO(span(t, A.already + .55, A.already + 1.25));     // 1.07: it folds …
  return { lit, outline, wide5: w5, glow, r: 150 * (1 + .25 * w5) * (1 + .006 * Math.sin(t * 1.3)), tilt: -.05 + .2 * w5 + .015 * Math.sin(t * .8), open: 1 - fold, fold };
}
const HAND_ARM = [2.35, 2.9];
function you(ctx, t, A, U) {
  const lower = smooth(span(t, A.already + .9, A.already + 1.6));         // the arm comes down when the umbrella has gone to the HUD
  const arm = [lerp(HAND_ARM[0], .25, lower), lerp(HAND_ARM[1], .15, lower)];
  const lean = .008 * Math.sin(t * .9), look = .15 + .1 * Math.sin(t * .37);
  const hands = E.du(ctx, YOU.x, YOU.y, YOU.h, { view: 'back', back: .55, armR: arm, look, lean });
  return hands;
}
function umbrellaOnHand(ctx, t, U, hand, stick = .55) {
  const d = U.r * stick, x = hand[0] + d * Math.sin(U.tilt), y = hand[1] - d * Math.cos(U.tilt);
  return { x, y, geo: F.umbrella(ctx, t, x, y, U.r, { open: Math.max(.001, U.open), lit: U.lit, outline: U.outline, wide5: U.wide5, glow: U.glow, tilt: U.tilt, stick, flare: [] }) };
}
// three people (indigo) step in under gore 5 on "alone"
function people(ctx, t, A) {
  const t0 = A.alone - .4, arr = t0 + 1.6, leave0 = A.already + .4;
  if (t < t0) return;
  [[1585, 0], [1660, .25], [1735, .5]].forEach(([x, d], i) => {
    const u = sineIO(span(t, t0 + d * .4, arr + d * .4)), lv = span(t, leave0 + i * .15, leave0 + 3.2);
    const px = lerp(x + 520, x, u) + lv * 720, walking = (u > 0 && u < 1) || lv > 0;
    E.person(ctx, px, GY + 4, 196 - i * 8, { dir: lv > 0 ? 1 : -1, walk: walking ? t * 5.5 + i : undefined, look: .3, view: walking ? 'side' : undefined, long: i === 1 });
  });
}
// the road (1.07): the ground line becomes a road of light running left into the mist
function roadRibbon(ctx, t, A, morph) {
  const u = expoOut(span(t, A.which + .4, A.already + 1.4)); if (u <= 0 || morph >= 1) return;
  const x1 = YOU.x + 10, x0 = lerp(x1, -1300, u);
  ctx.save();
  ctx.fillStyle = lin(ctx, -1300, 0, x1, 0, [[0, rgba(P.halo1, 0)], [.45, rgba(P.halo1, .28)], [1, rgba(P.halo0, .55)]]);
  ctx.beginPath(); ctx.moveTo(x0, GY - 3); ctx.lineTo(x1, GY - 3); ctx.lineTo(x1 + 40, GY + 14); ctx.lineTo(x0, GY + 14); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.core1, .5); for (let x = x1 - 60; x > x0; x -= 90) ctx.fillRect(x - 34, GY + 4, 34, 3);
  ctx.restore();
}
// the milestone counter (rises from the ground in 1.07; carries the clock in c02; glides to the HUD in 2.03)
function counterValue(t, T, A) {
  if (t < A.nov5b) return 30;
  if (t < A.day30) return 30 + (t - A.nov5b) * 41 % 960;                 // the flaps rattle
  return F.dayAt(t, T);
}
function milestone(ctx, t, T, A) {
  const r = expoOut(span(t, A.already + .2, A.already + 1.3)), sinkPost = sineIO(span(t, A.road + .3, A.road + 1.2));
  if (r <= 0) return null;
  const v = counterValue(t, T, A), size = measureFlap(MILE.h, v), x0 = MILE.x - size.w / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(-500, -2000, 4000, GY + 2000 + 2); ctx.clip();
  const dy = (1 - r) * 260 + sinkPost * 240;
  // post + base
  ctx.fillStyle = mixHex(P.night1, P.blue2, .35); ctx.fillRect(MILE.x - 7, MILE.top + MILE.h + dy, 14, GY - MILE.top - MILE.h);
  ctx.fillStyle = mixHex(P.night1, P.blue2, .25); ctx.fillRect(MILE.x - 30, GY - 10 + dy * .2, 60, 12);
  ctx.restore();
  return { x0, y: MILE.top + (1 - r) * 260, v, w: size.w };
}
const FLAPM = {}, MCTX = createCanvas(8, 8).getContext('2d');
function measureFlap(h, v) {
  const n = v >= 999.5 ? 4 : 3, k = h + ':' + n;
  return FLAPM[k] || (FLAPM[k] = F.flap(MCTX, 0, 0, 0, h, { a: 0, value: v }));
}
// the NOV 5 calendar leaf (2.01): flutters in, sticks on the flaps, peels and falls on "November fifth"
function leaf(ctx, t, A, box) {
  const tin = A.clock + .5, stick = tin + 1.3, peel = A.nov5b; if (t < tin || !box) return;
  const cx = MILE.x, cy = box.y + MILE.h / 2;
  let x, y, rot = 0, pe = 0;
  if (t < stick) { const u = sineIO(span(t, tin, stick)); x = lerp(cx - 420, cx + 30, u); y = lerp(cy - 160, cy + 10, u) + Math.sin(u * 9) * 18 * (1 - u); rot = Math.sin(u * 8) * .5 * (1 - u); }
  else if (t < peel) { x = cx + 30; y = cy + 10; rot = .02 * Math.sin(t * 3); }
  else { const u = t - peel; pe = clamp(u / .35); x = cx + 30 + u * 40; y = cy + 10 + 260 * u * u; rot = pe * .5 + u * .8; if (y > GY + 200) return; }
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); PR.calendarLeaf(ctx, t, 0, 32, 64, { mon: 'NOV', day: 5, peel: 0 }); ctx.restore();
}
// the S&P line (2.02): the road ribbon tilts up into the chart; the part after the record high is red; 2.03: it lies flat on the route
const RUN = (() => {   // run-up (shape only) from the left to the record high, then the fall to today; deterministic
  const r = prng(606), pts = [];
  for (let i = 0; i <= 60; i++) { const u = i / 60, x = lerp(-300, PEAK[0], u); pts.push([x, lerp(830, PEAK[1], u ** 1.15) + (i && i < 60 ? (r() - .5) * 46 + Math.sin(u * 17) * 14 : 0)]); }
  for (let i = 1; i <= 30; i++) { const u = i / 30, x = lerp(PEAK[0], TODAY[0], u); pts.push([x, lerp(PEAK[1], TODAY[1], u ** .85) + (i < 30 ? (r() - .5) * 40 + Math.sin(u * 11) * 18 : 0)]); }
  return pts;
})();
function spLine(ctx, t, T, A) {
  const m = sineIO(span(t, A.started - .1, A.record + .3)), f = sineIO(span(t, A.road - .05, A.road + 1.35));
  if (m <= 0) return;
  const X = (d) => F.ROUTE.X(d);
  const P2 = RUN.map(([x, y], i) => {
    const fy = lerp(GY + 6, y, m);                                         // ribbon (flat) → chart
    const flatX = i <= 60 ? X(0) : X(30 * (x - PEAK[0]) / (TODAY[0] - PEAK[0]));
    return [lerp(x, flatX, f), lerp(fy, F.ROUTE.y, f)];
  });
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const wRun = lerp(14, 4, m), up = new Path2D(); P2.slice(0, 61).forEach(([x, y], i) => (i ? up.lineTo(x, y) : up.moveTo(x, y)));
  ctx.strokeStyle = rgba(mixHex(P.halo1, P.cream, m), lerp(.55, .85, m) * (1 - f)); ctx.lineWidth = wRun; ctx.shadowColor = rgba(P.halo0, .6); ctx.shadowBlur = 10; ctx.stroke(up);
  const dn = new Path2D(); P2.slice(60).forEach(([x, y], i) => (i ? dn.lineTo(x, y) : dn.moveTo(x, y)));
  ctx.strokeStyle = mixHex(P.halo1, F.RED.line, m); ctx.lineWidth = lerp(14, 6, m); ctx.shadowColor = rgba(F.RED.deep, .8); ctx.shadowBlur = 12; ctx.stroke(dn);
  ctx.restore();
  // the record high: gold peak + flag + label (2.02); it becomes DAY 0 of the route
  const pk = P2[60], fl = span(t, A.record - .1, A.record + .5);
  if (fl > 0 && f < 1) {
    halo(ctx, pk[0], pk[1], 110, .6 * (1 - f)); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(pk[0], pk[1], 10, 0, 7); ctx.fill();
    const e = expoOut(fl) * (1 - f), fh = 70 * e;
    ctx.strokeStyle = rgba(P.halo0, e); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(pk[0], pk[1] - 12); ctx.lineTo(pk[0], pk[1] - 12 - fh); ctx.stroke();
    ctx.fillStyle = rgba(P.halo0, e); ctx.beginPath(); ctx.moveTo(pk[0], pk[1] - 12 - fh); ctx.lineTo(pk[0] + 34 * e, pk[1] - 2 - fh); ctx.lineTo(pk[0], pk[1] + 8 - fh); ctx.fill();
    E.glowText(ctx, 'RECORD HIGH · OCT 6, 2026 · DAY 0', pk[0] - 10, pk[1] - 110 + (1 - expoOut(fl)) * 20, { size: 30, align: 'center', spacing: .06, a: e });
    E.glowText(ctx, 'S&P 500', pk[0] - 10, pk[1] - 74 + (1 - expoOut(fl)) * 20, { size: 20, weight: 500, align: 'center', col: P.halo2, glow: false, spacing: .14, a: e });
  }
  // the dot slides from the peak down to today on "October sixth" (with the counter's roll); then sits at today
  const ds = span(t, A.oct6, F.dayAt ? A.oct6 + 1.6 : 0);
  if (ds > 0) {
    const k = 60 + sineIO(ds) * 30, i = Math.min(89, Math.floor(k)), g = k - i, a = P2[i], b = P2[Math.min(90, i + 1)];
    const x = lerp(a[0], b[0], g), y = lerp(a[1], b[1], g);
    halo(ctx, x, y, 60, .55); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.fill();
  }
  return { today: P2[90], f };
}

// ------------------------------------------------------------------------------------------------------------------------ the route map (screen = world at s 1)
function route(ctx, t, A, f) {
  if (f <= 0) return;
  const u = lerp(.03, 1, sineIO(span(t, A.road + .2, A.road + 1.9)));
  const stops = [0, 1, 2, 3].map((i) => span(t, A.four + i * .22 - .1, A.four + i * .22 + .5));
  const names = A.names.map((tn) => span(t, tn - .1, tn + .5));
  const lit = [0, 1, 2, 3].map((i) => Math.max(bump(t, A.bottom + i * .18, .7) * .9, i === 0 ? smooth(span(t, A.nearest, A.nearest + .4)) * (1 - smooth(span(t, A.farthest, A.farthest + .5))) : 0, i === 3 ? smooth(span(t, A.twohalf - .2, A.twohalf + .4)) : 0));
  const end = smooth(span(t, A.farthest + .3, A.twohalf + .3));
  // today's dot: at 30; glides to 48 and back on "seven weeks"
  const g = span(t, A.seven - .35, A.seven + 1.5), dd = g < .5 ? sineIO(g * 2) : 1 - sineIO((g - .5) * 2), dot = 30 + 18 * dd;
  F.routeMap(ctx, t, { u, stops, names, lit, end, a: 1 });
  const X = F.ROUTE.X, y = F.ROUTE.y;
  // the red first 30 days (this fall so far)
  ctx.save(); ctx.strokeStyle = F.RED.line; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.shadowColor = rgba(F.RED.deep, .8); ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(X(0), y); ctx.lineTo(X(30), y); ctx.stroke(); ctx.restore();
  // the gold run to 929 (2.06)
  const run = sineIO(span(t, A.farthest + .1, A.twohalf + .6));
  if (run > 0) { ctx.save(); ctx.strokeStyle = P.halo0; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.shadowColor = rgba(P.halo0, .85); ctx.shadowBlur = 16; ctx.beginPath(); ctx.moveTo(X(30), y); ctx.lineTo(X(lerp(30, 929, run)), y); ctx.stroke(); ctx.restore(); halo(ctx, X(lerp(30, 929, run)), y, 50, .5 * (1 - smooth(span(run, .95, 1)) * .5)); }
  // labels above the measured stretch
  const w7 = span(t, A.seven - .1, A.seven + .5) * (1 - span(t, A.farthest - .3, A.farthest + .2)), gone = span(t, A.soif + .2, A.soif + .9);
  if (w7 > 0) { E.glowText(ctx, '≈ 7 WEEKS', X(39), 330 + (1 - expoOut(w7)) * 20, { size: 34, align: 'center', a: w7 > 0 ? Math.min(1, w7 * 3) : 0 }); bracket(ctx, X(30), X(48), 352, w7); }
  const w25 = span(t, A.twohalf - .1, A.twohalf + .5) * (1 - gone), wl = span(t, A.longest - .1, A.longest + .5) * (1 - gone);
  if (w25 > 0) { E.glowText(ctx, '≈ 2.5 YEARS', (X(30) + X(929)) / 2, 300 + (1 - expoOut(w25)) * 20, { size: 40, align: 'center', a: Math.min(1, w25 * 3) }); bracket(ctx, X(30), X(929), 352, w25); }
  if (wl > 0) E.glowText(ctx, 'LONGEST FALL THIS CENTURY · S&P 500', (X(30) + X(929)) / 2, 338 + (1 - expoOut(wl)) * 14, { size: 22, align: 'center', col: P.halo2, spacing: .1, a: Math.min(1, wl * 3), glow: false });
  // today's dot (+ label until the bubble takes it)
  const bub = span(t, A.bubble - .2, A.bubble + .4);
  halo(ctx, X(dot), y, 60, .6); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(X(dot), y, 11, 0, 7); ctx.fill();
  const tl = span(t, A.road + 1.2, A.road + 1.8) * (1 - bub);
  if (tl > 0) E.glowText(ctx, 'TODAY · DAY 30', X(30) - 20, y + 140, { size: 22, align: 'left', a: Math.min(1, tl * 2), spacing: .08 });
}
function bracket(ctx, x0, x1, y, a) {
  const e = expoOut(a); if (e <= 0) return;
  ctx.save(); ctx.strokeStyle = rgba(P.halo0, .7); ctx.lineWidth = 2; const xm = (x0 + x1) / 2, hw = (x1 - x0) / 2 * e;
  ctx.beginPath(); ctx.moveTo(xm - hw, y + 14); ctx.lineTo(xm - hw, y); ctx.lineTo(xm + hw, y); ctx.lineTo(xm + hw, y + 14); ctx.stroke(); ctx.restore();
}
// 2.07: the bubble swells from today's dot (world), the hall inside it
function bubbleState(t, A) {
  const g = span(t, A.bubble - .2, A.bubble + 1.3); if (g <= 0) return null;
  const e = expoOut(g), p = sineIO(span(t, A.inside - .1, A.T0 - SEAM_HALF));
  // the push: the bubble swells over the whole frame (the camera stays, so nothing behind it is magnified) and lands exactly on plateBubble
  const q = quartIO(span(t, A.inside - .1, A.T0 - SEAM_HALF)), S = 1.045, ex = 1000 + (BUBBLE_PLATE.x - 960) / S, ey = 530 + (BUBBLE_PLATE.y - 540) / S, er = BUBBLE_PLATE.r / S;
  const x0 = lerp(F.ROUTE.X(30), BUB_END.x, sineIO(g)), y0 = lerp(F.ROUTE.y, BUB_END.y, sineIO(g)), r0 = lerp(4, 300, e);
  return { x: lerp(x0, ex, q), y: lerp(y0, ey, q), r: lerp(r0, er, q), p };
}

// ------------------------------------------------------------------------------------------------------------------------ the frame
export function makeLead(T) {
  const A = anchors(T);
  return function draw(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t >= A.T0 - SEAM_HALF) { plateBubble(ctx, t); ctx.restore(); hud(ctx, t, T, A); return; }
    const C = camera(t, A);
    sky(ctx, t, C);
    ctx.setTransform(C.s, 0, 0, C.s, 960 - C.cx * C.s, 540 - C.cy * C.s);
    hillsWide(ctx); plain(ctx);
    // the warm light under the umbrella on the ground (the hero's light pool)
    const U = umbrellaState(t, A), stillUmb = U.fold < 1;
    if (stillUmb) { const L = U.lit.reduce((p, q) => p + q, 0) / 5; E.lightPool(ctx, YOU.x - 150, YOU.x + 170, GY - 4, 90, 60, .55 * L * (1 - U.fold)); halo(ctx, YOU.x + 30, GY - 110, 360, .25 * L * (1 - U.fold)); }
    // c02 layers behind you
    const morph = sineIO(span(t, A.started - .1, A.record + .3));
    roadRibbon(ctx, t, A, morph);
    const box = milestone(ctx, t, T, A);
    const sp = spLine(ctx, t, T, A);
    route(ctx, t, A, sp ? sp.f : 0);
    // c01 layers
    if (t < A.butif + 1) { title(ctx, t, A); hookCounter(ctx, t, A); }
    people(ctx, t, A);
    const hands = you(ctx, t, A, U);
    impactShards(ctx, t, A, A.which);
    const keep = 1 - sineIO(span(t, A.which + .05, A.already + .45));
    redLine(ctx, t, A, keep);
    if (keep < 1 && keep > 0) { const k = Math.floor((1 - keep) * 9); for (let i = 0; i <= k; i++) { const q = alongArrow(1 - i / 9); F.shards(ctx, t, q[0], q[1], A.which + .05 + i * .1, { n: 7, seed: 300 + i * 11, dir: 1.2, spread: 2.2, speed: .7 }); } }
    let umb = null;
    if (stillUmb && hands && hands.R) umb = umbrellaOnHand(ctx, t, U, hands.R);
    // the impact flare where the arrow's head meets the canopy
    if (keep > .98 && stillUmb) for (const t0 of BURSTS(A)) { const dt = t - t0; if (dt >= 0 && dt < .7) halo(ctx, IMPACT[0], IMPACT[1], dt < .1 ? 140 : 110 * (1 + dt), dt < .1 ? .85 : .4 * (1 - dt / .7), P.halo0, P.core0); }
    hotTip(ctx, t, A);
    fallOff(ctx, t, A.timing - .45, -1, () => stopwatch(ctx), A.oneOf);
    fallOff(ctx, t, A.luck - .45, 1, () => dice(ctx), A.oneOf + .2);
    nov5Labels(ctx, t, A);
    // the counter on the milestone (world) until it glides to the HUD
    const glide = sineIO(span(t, A.road + .15, A.road + 1.5));
    if (box && glide < 1) {
      if (glide <= 0) { F.flap(ctx, t, box.x0, box.y, MILE.h, { value: box.v, glow: 1 }); leaf(ctx, t, A, box); }
    }
    bubbleLayer(ctx, t, A, C);
    ctx.restore();
    // screen-space: the counter gliding to the HUD, the folding umbrella flying to the HUD, the HUDs
    if (box && glide > 0 && glide < 1) {
      const [sx, sy] = toS(C, box.x0, box.y), hw = measureFlap(F.HUD_DAY.h, box.v).w, tx = F.HUD_DAY.x - hw;
      const h = lerp(MILE.h * C.s, F.HUD_DAY.h, glide);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.flap(ctx, t, lerp(sx, tx, glide), lerp(sy, F.HUD_DAY.y, glide), h, { value: F.dayAt(t, T), glow: 1 - .2 * glide }); ctx.restore();
    }
    flyUmbrella(ctx, t, A, C, U, hands);
    hud(ctx, t, T, A);
  };
}
function alongArrow(u) {
  let tot = 0; const seg = []; for (let i = 1; i < CHART.length; i++) { const l = Math.hypot(CHART[i][0] - CHART[i - 1][0], CHART[i][1] - CHART[i - 1][1]); seg.push(l); tot += l; }
  let left = clamp(u) * tot; for (let i = 1; i < CHART.length; i++) { if (left <= seg[i - 1]) { const f = left / seg[i - 1]; return [lerp(CHART[i - 1][0], CHART[i][0], f), lerp(CHART[i - 1][1], CHART[i][1], f)]; } left -= seg[i - 1]; }
  return CHART[CHART.length - 1];
}
// 1.07: the folded umbrella leaves your hand and flies to the HUD corner, where it opens small (five empty gores)
function flyUmbrella(ctx, t, A, C, U, hands) {
  const t0 = A.already + 1.25, t1 = t0 + 1.1; if (t < t0) return;
  const H0 = F.HUD_UMB;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < t1) {
    const u = quartIO(span(t, t0, t1)), from = toS(C, YOU.x + 40, YOU.y - YOU.h * .95), r0 = 150 * C.s;
    const x = lerp(from[0], H0.x, u), y = lerp(from[1], H0.y, u) - Math.sin(u * Math.PI) * 120, r = lerp(r0, H0.r, u);
    const op = smooth(span(u, .7, 1));
    F.umbrella(ctx, t, x, y, r, { open: Math.max(.001, op), lit: [0, 0, 0, 0, 0], outline: .55 * op + .3, glow: .7, tilt: (1 - u) * -.6 });
  }
  ctx.restore();
}
function hud(ctx, t, T, A) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t >= A.already + 2.35) F.hudUmbrella(ctx, t, T);
  if (t >= A.road + 1.5) F.hudDay(ctx, t, T);
  ctx.restore();
}
function bubbleLayer(ctx, t, A, C) {
  const B = bubbleState(t, A); if (!B) return;
  // screen-space circle of the bubble; its inside is the hall (night + cool window rows), seen through the film
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const [sx, sy] = toS(C, B.x, B.y), sr = B.r * C.s;
  const path = F.bubble(ctx, t, sx, sy, sr, { tremble: .2, a: 0 });
  const inner = smooth(span(t, A.bubble + .3, A.inside + .6));
  if (inner > 0) {
    ctx.save(); ctx.clip(path); ctx.globalAlpha = inner;
    ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); ctx.fillRect(0, 0, W, H);
    E.stars(ctx, 1919, 70, t, [0, 0, W, H], .4); hallRows(ctx, t, .9);
    ctx.restore();
  }
  F.bubble(ctx, t, sx, sy, sr, { tremble: .2 });
  const fl = .55 * sineIO(span(t, A.inside, A.T0 - SEAM_HALF));
  if (fl > 0) { ctx.save(); ctx.clip(path); F.skinFlood(ctx, t, fl); ctx.restore(); }
  ctx.restore();
}
