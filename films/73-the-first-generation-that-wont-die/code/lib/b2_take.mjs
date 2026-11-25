// Film 73 · builder B2 · c06–c09 ('Which brings back' → 'And at the very top') as ONE continuous take (owned by B2).
// The four chunk files (scenes/sc06–sc09.mjs) only cut this take at their phrase boundaries, so the inner seams c06|c07, c07|c08 and
// c08|c09 are the same frame on both sides by construction. Outer seams: starts on S.plateTwoAnswers (B1), ends on S.plateTop (B3).
// Shot tables (one picture per sentence): in the headers of scenes/sc06–sc09.mjs. Stage: THE LIFELINE (X); THE STONE only at M.11.
// No hard cut anywhere: both W of shots.md are built as designed transformations (M.11: the lines sink, the hill rises; 4.01: the camera
// flies into one lit window of the town and the next picture lives inside it).
// Coordinates: sheet units (X.inView). c06–c08 live around x 960 … 4300; c09 is drawn shifted by OX so that plateTop (built at x 960 by
// the lead) is reached without a camera ride: its local x + OX = sheet x. The ground's star layer is shifted by OX slowly during 5.01–5.06.
import * as E from './f10_editorial.mjs';
import * as F from './f73_kit.mjs';
import * as S from './f73_world.mjs';
import * as X from './f73_stage.mjs';
import { createCanvas } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, prng } = E;
const { GOLD, COOL, CREAM, AGE, LAMP, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const CACHE = new WeakMap();

// ------------------------------------------------------------------------------------------------ small helpers
const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));          // a label rises at a, sinks at b
const keyed = (t, K) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t < K[i][0]) return lerp(K[i - 1][1], K[i][1], sineIO(span(t, K[i - 1][0], K[i][0]))); return K[K.length - 1][1]; };
const vel = (t, K) => keyed(t + .04, K) - keyed(t - .04, K);
const walkOf = (t, K, ph = 6.2) => (Math.abs(vel(t, K)) > .6 ? t * ph : undefined);
const dirOf = (t, K, d = 1) => { const v = vel(t, K); return Math.abs(v) > .6 ? Math.sign(v) : d; };
const qpt = (a, c, b, u) => [(1 - u) ** 2 * a[0] + 2 * u * (1 - u) * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * u * (1 - u) * c[1] + u * u * b[1]];
const curve = (a, c, b, n = 40) => Array.from({ length: n + 1 }, (_, i) => qpt(a, c, b, i / n));
// a figure that sinks into its line (k 0 standing … 1 gone): clipped at the line, pushed down
function sunk(ctx, lineY, k, h, fn) {
  if (k >= 1) return; if (k <= 0) { fn(); return; } ctx.save(); ctx.beginPath(); ctx.rect(-1e5, -1e5, 2e5, 1e5 + lineY + 1.5); ctx.clip();
  ctx.translate(0, h * 1.05 * sineIO(clamp(k))); fn(); ctx.restore(); ctx.beginPath();
}
// a gold line along points in the look of X.lifeline (glow · body · core)
function gline(ctx, pts, u, s, o = {}) {
  if (u <= 0) return null; const w = (o.w ?? 5.5) / s, a = o.a ?? 1;
  const col = o.col ?? GOLD.body, hl = o.halo ?? GOLD.halo, core = o.core ?? GOLD.core;
  ctx.save(); ctx.globalAlpha *= a; ctx.globalCompositeOperation = 'lighter'; X.drawPath(ctx, pts, u, { col: rgba(hl, .26 * (o.glow ?? 1)), w: w * 5 }); ctx.restore();
  ctx.save(); ctx.globalAlpha *= a; const hd = X.drawPath(ctx, pts, u, { col, w, dash: o.dash }); if (!o.dash) X.drawPath(ctx, pts, u, { col: rgba(core, .9), w: w * .4 }); ctx.restore();
  if (u < 1 && hd && o.spark !== false) halo(ctx, hd[0], hd[1], 40 / s, .6 * a, hl, core);
  return hd;
}
// an end tick (a death: cream, never a cross); lift 0..1 rises and thins it away
function endTick(ctx, x, y, s, u, lift = 0, col = CREAM) {
  u = clamp(u); lift = clamp(lift); if (u <= 0 || lift >= 1) return;
  const w = 5.5 / s, th = 34 / s, k = expoOut(u);
  ctx.save(); ctx.translate(x, y - expoIn(lift) * 160 / s); ctx.rotate(lift * .5); ctx.globalAlpha *= 1 - lift; ctx.fillStyle = col;
  ctx.fillRect(-w * .7, -th * k, w * 1.4, th * k * 2); ctx.restore();
}
// a dashed hand-off arrow (cream) from a to b, drawn to u; o.head when complete
function handoff(ctx, a, b, u, s, o = {}) {
  if (u <= 0) return; const hd = X.drawPath(ctx, [a, b], u, { col: rgba(CREAM, (o.a ?? 1) * .85), w: 2.6 / s, dash: [12 / s, 9 / s] });
  if (hd && (o.head ?? u >= 1)) { const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 14 / s;
    X.drawPath(ctx, [[hd[0] - Math.cos(ang - .5) * L, hd[1] - Math.sin(ang - .5) * L], hd, [hd[0] - Math.cos(ang + .5) * L, hd[1] - Math.sin(ang + .5) * L]], 1, { col: rgba(CREAM, (o.a ?? 1) * .85), w: 2.6 / s }); }
}
// a dark weight on a thread (what holds an answer back)
function weight(ctx, x, y, len, u, s) {
  u = clamp(u); if (u <= 0) return; const L = len * expoOut(u), sw = Math.sin(performanceT * 1.3) * 3;
  X.drawPath(ctx, [[x, y], [x + sw, y + L]], 1, { col: rgba(CREAM, .6), w: 1.6 / s });
  ctx.save(); ctx.fillStyle = mixHex(P.night0, P.ind1, .45); ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 2 / s;
  ctx.beginPath(); ctx.moveTo(x + sw, y + L - 4); ctx.bezierCurveTo(x + sw + 22, y + L + 10, x + sw + 18, y + L + 40, x + sw, y + L + 40); ctx.bezierCurveTo(x + sw - 18, y + L + 40, x + sw - 22, y + L + 10, x + sw, y + L - 4); ctx.fill(); ctx.stroke(); ctx.restore();
}
let performanceT = 0, OFF = null;
// the parents' house (custom: a big lit window with two silhouettes inside), x = centre, y = base; o.u (rises out of the line), parents, wave
function house2(ctx, t, x, y, s, o = {}) {
  const w = 300, h = 200, roof = 110, wx = x + 40, wy = y - 112, ww = 124, wh = 86;
  ctx.save(); ctx.fillStyle = mixHex(P.night1, P.ind2, .7);
  ctx.beginPath(); ctx.rect(x - w / 2, y - h, w, h); ctx.moveTo(x - w / 2 - 18, y - h); ctx.lineTo(x - 20, y - h - roof); ctx.lineTo(x + w / 2 + 18, y - h); ctx.fill();
  ctx.strokeStyle = rgba(CREAM, .18); ctx.lineWidth = 1.5 / s; ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(x - 100, y - h - 70, 26, 60);   // chimney
  const lit = clamp(o.lit ?? 1);
  halo(ctx, wx, wy, 260, .32 * lit, LAMP.body, LAMP.core);
  ctx.fillStyle = mixHex(mixHex(P.night0, P.ind1, .5), LAMP.body, lit); ctx.fillRect(wx - ww / 2, wy - wh / 2, ww, wh);
  const pa = clamp(o.parents ?? 0);
  if (pa > 0) {   // two silhouettes behind the glass, backlit; the right one waves
    ctx.save(); ctx.beginPath(); ctx.rect(wx - ww / 2, wy - wh / 2, ww, wh); ctx.clip(); ctx.globalAlpha *= pa; ctx.fillStyle = mixHex(P.night1, P.ind2, .5);
    for (const [dx, hh] of [[-28, 0], [26, 6]]) { const bx = wx + dx, by = wy + wh / 2;
      ctx.beginPath(); ctx.ellipse(bx, by - 34 + hh, 13, 15, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx - 26, by + 2); ctx.quadraticCurveTo(bx - 24, by - 18 + hh, bx, by - 20 + hh); ctx.quadraticCurveTo(bx + 24, by - 18 + hh, bx + 26, by + 2); ctx.fill(); }
    const wv = clamp(o.wave ?? 0); if (wv > 0) { const a = -.5 + .35 * Math.sin(t * 7) * wv - (1 - wv) * 1.2, bx = wx + 26 + 18, by = wy + wh / 2 - 14;
      ctx.strokeStyle = mixHex(P.night1, P.ind2, .5); ctx.lineCap = 'round'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(bx - 6, by + 4); ctx.lineTo(bx + Math.sin(a) * 34, by - Math.cos(a) * 34); ctx.stroke(); }
    ctx.restore();
  }
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 4 / s; ctx.strokeRect(wx - ww / 2, wy - wh / 2, ww, wh);
  ctx.beginPath(); ctx.moveTo(wx, wy - wh / 2); ctx.lineTo(wx, wy + wh / 2); ctx.stroke(); ctx.beginPath();
  ctx.restore();
  return { wx, wy };
}

export function take(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const G = (p, after) => T.G(p, 0, after), GE = (p, after) => T.GE(p, 0, after);
  const a0 = T.G('Which brings back');
  const A = { which: a0 };
  Object.assign(A, {
    no: G('No', GE('people give', a0)), y13: G('In twenty thirteen', a0), mostSaid: G('Most said', a0), notForMe: G('not for me', a0), yet: G('Yet most believed', a0),
    others: G('other people would', a0), seems: G('It seems everybody', a0), except: G('Except everybody', a0), holds: G('What holds the yes', a0),
    aug: G('This August', a0), turned: G('turned the question', a0), accept: G('Would you accept', a0), shorter: G('shorter life', a0), without: G('without decline', a0),
    body: G('No failing body', a0), mind: G('No fading mind', a0), almost: G('Almost two in three', a0), saidYes: G('said yes', G('Almost two in three', a0)),
    fear: G("So the fear isn't", a0), old: G("It's being old forever", a0),
    channel: G('This channel exists', a0), superint: G('superintelligence', a0), everybody: G('well for everybody', a0), healthyY: G('Healthy years included', a0),
    want: G('Want that too', a0), subscribe: G('Then subscribe', a0), fair: G('So ask it the fair way', a0),
  });
  Object.assign(A, {
    stop: G('If you could stop dying', A.fair), stay: G('and stay healthy', A.fair), would: G('would you', G('and stay healthy', A.fair)),
    even: G('Even then', A.fair), caseNo: G('case for no', A.fair), philo: G('One philosopher', A.fair), boredom: G('ends in boredom', A.fair),
    othersA: G('Others answer', A.fair), pleasures: G('some pleasures', A.fair), suppose: G('But suppose enough', A.fair), sayYes: G('say yes', G('But suppose enough', A.fair)),
    what: G('What happens to a world', A.fair), dying: G('built around dying', A.fair), say: G('Say it works', A.fair),
  });
  Object.assign(A, {
    scen: G('In this scenario', A.say), older: G("you're older than", A.say), promise: G('Take a promise', A.say), till: G('till death do us part', A.say),
    most2: G('For most of history', A.say), thirty: G('less than thirty years', A.say), now: G('Now it has no end date', A.say), more: G('More time with the person', A.say),
    bigger: G('And a much bigger promise', A.say), paid: G('And a life that long', A.say), paidFor: G('paid for', A.say), london: G('A London professor', A.say),
  });
  Object.assign(A, {
    learn: G('learn', A.london), work: G('work', G('learn', A.london)), retire: G('retire', A.london), breaking: G('is breaking', A.london),
    five: G('So you could have five careers', A.london), never: G('And you might never be done', A.london), parents: G('And what your parents', A.london),
    left: G('have left you', A.london), inScen: G('In this scenario', G('And what your parents', A.london)), comes: G('it never comes', A.london),
    stay2: G('Your parents stay', A.london), gain: G("That's the gain", A.london), own: G('What they own', A.london), price: G("That's the price", A.london),
    still: G('Still yes', A.london), inher: G('And an inheritance is only', A.london), small: G('small version', A.london), power: G('Power and ideas', A.london),
    goes: G('when someone goes', A.london), planck: G('Max Planck', A.london), newTruth: G('A new truth', A.london), wins: G('It wins because', A.london),
    die: G('eventually die', A.london), econ: G('Economists later', A.london), star: G('When a star scientist', A.london), died: G('died early', A.london),
    moved: G('outsiders moved in', A.london), strong: G('unusually strong work', A.london), doesnt: G("That doesn't make death good", A.london),
    shows: G('It shows that people', A.london), atTop: G('at the top', G('It shows that people', A.london)), keep: G('keep newcomers out', A.london),
    staying: G('just by staying', A.london), top: G('And at the very top', A.london),
  });
  const clip = T.clip('C4');
  const tPlate = A.top - S.SEAM_HALF, tTwo = A.which + S.SEAM_HALF;

  // ============================================================================================ geometry
  const PT = S.PTWO, ABAR = { x: 960, y: 560, w: 640 };
  // c06 · the 2013 grid and the crowd
  const R6 = prng(7361), GRID = { x: 565, y: 385, g: 30 };
  const CROWD = Array.from({ length: 100 }, (_, i) => { const r = Math.floor(i / 10), c = i % 10, jx = R6() - .5, jt = R6();
    const x = 960 + (c - 4.5) * lerp(62, 106, r / 9) + jx * 34, y = 560 + r * 27, h = lerp(64, 108, r / 9);
    let tg = (i * 53 + 29) % 100; if (tg === i) tg = (tg + 7) % 100; return { i, r, c, x, y, h, jt, tg, gx: GRID.x + c * GRID.g, gy: GRID.y + r * GRID.g, bx: ABAR.x - ABAR.w / 2 + i * ABAR.w / 99 }; });
  const ASKED = 92;   // front row, the one you ask
  const NB = [1, -1, 10, -10, 11, 9, -9, -11];
  const ARROWS = []; { const r = prng(7362); const pick = Array.from({ length: 100 }, (_, i) => i).sort(() => r() - .5).slice(0, 68).sort((a, b) => a - b);
    pick.forEach((i, k) => { let j = -1; for (let q = 0; q < 8; q++) { const c = i + NB[(i * 7 + q) % 8]; if (c >= 0 && c < 100 && Math.abs((c % 10) - (i % 10)) <= 1) { j = c; break; } } if (j >= 0) ARROWS.push([i, j, k]); }); }
  // c06 · the two lines of the survey, the 64 field
  const LA = { y: 560, x0: -400, x1: 1620, age: 1000 }, LB = { y: 720, x0: -400, x1: 1320 }, F64 = { x: 843, y: 300, g: 26 };
  // c07 · everybody's lines (cloned out of yours), the loop
  const R7 = prng(7371), LINES = [320, 400, 480, 640, 800, 880, 960, 1040].map((y, k) => ({ y, d: Math.abs(y - 720) / 80, x1: 1650 + R7() * 650, off: (R7() - .5) * 700, ph: R7() * 6, h: 92 + R7() * 16 }));
  LINES.forEach((L) => { L.age = L.x1 - 480 - R7() * 200; });
  const LOOP = { x: 960, y: 600, rx: 360, ry: 110 }, JOYS = [2.25, .55, -1.95];
  const SMALLA = [[700, 430], [1220, 430], [700, 560], [1220, 560], [700, 690], [1220, 690]].map(([x, y], k) => ({ x, y, p0: (R7() - .5) * .3, k }));
  // c08 · the window we fly into (the same houses as S.stoneWorld's town: prng 7302, layer .75)
  let WIN = null; { const r = prng(7302); let best = 1e9;
    for (let i = 0; i < 60; i++) { const x = -1600 + i * 58 + r() * 30, y = 830 + r() * 40, w = 34 + r() * 30; if (x > 1900) break; const h = w * .7;
      const sc = Math.abs(x - 980) + (i % 7) * 40; if (sc < best) { best = sc; WIN = { x, y: y - h * .5, w: w * .26, h: h * .34, i }; } } }
  const TOWN = { x: 1100, y: 760, s: .6 };
  const LY = 700, J = 1650, E30 = 2350, HX = 4300, AX = 4000, GATE = 4080, YOUG = 4040, THEIR = 430;
  const BL = [[2400, 2650], [2670, 3130], [3150, 3400]];                  // LEARN · WORK · RETIRE
  const PAIRS = Array.from({ length: 7 }, (_, k) => ({ l: [2400 + k * 250, 2460 + k * 250], w: [2470 + k * 250, 2635 + k * 250], k }));
  const OX = AX - 960;   // c09 local → sheet
  const PQ = S.PTOP;
  const R9 = prng(7391), FIELD = Array.from({ length: 72 }, (_, i) => { const a = i * 2.39996 + R9() * .3, rr = 110 + 190 * Math.sqrt((i + .5) / 72); return { a, r: rr, out: rr > 236, k: i, jt: R9() }; });
  const NEWC = PQ.wait.map((x, i) => { let best = 0, bd = 1e9; FIELD.forEach((f, j) => { if (!f.out) return; const d = Math.abs(Math.cos(f.a) * f.r * .55 + 960 - (x - 300)) + j * .01; if (d < bd && !FIELD.used?.includes(j)) { bd = d; best = j; } }); (FIELD.used ||= []).push(best); return best; });

  // ============================================================================================ you (the yellow coat), per act
  const Y6 = [[A.seems + 1.0, 60], [A.except + .5, 600], [A.aug + .2, 600], [A.accept + .6, -160]];
  const Y67 = [[A.fear - 1.0, -60], [A.channel + 5, 1250]];
  const Y8 = [[A.say + .6, -60], [A.promise, 1450], [A.till, J - 20], [A.more + .1, J - 20], [A.paid + .3, 2080], [A.paid + 1.6, 2300], [A.five, 2300], [A.five + 1.0, 2420],
    [A.never + .2, 2440], [A.parents + .2, 3500], [A.parents + 2.4, YOUG]];
  const PART = [[A.promise + .3, 0], [A.till + .2, 1]];                         // the partner's way along their line (0..1)
  const W8 = [[A.more + .1, 0], [A.paid + .3, 1]];   // coupleX: J → 2100                              // the two walk together J → 2080

  // ============================================================================================ the view (one path for the whole take)
  const VD = [
    [A.which - .5, { x: 960, y: 540, s: 1 }], [tTwo, { x: 960, y: 540, s: 1.04 }], [A.no + .6, { x: 960, y: 548, s: 1.12 }], [A.y13 + 1.4, { x: 950, y: 520, s: 1.03 }],
    [A.yet + 2.2, { x: 930, y: 528, s: 1.08 }], [A.seems + 1.3, { x: 960, y: 640, s: 1.16 }], [A.except + 1.0, { x: 800, y: 690, s: 1.32 }], [A.holds + 1.1, { x: 960, y: 570, s: 1.08 }],
    [A.aug + 1.0, { x: 960, y: 450, s: 1.06 }], [A.accept + 1.4, { x: 960, y: 560, s: .98 }], [A.body + .3, { x: 860, y: 590, s: 1.06 }], [A.mind + .6, { x: 990, y: 600, s: 1.06 }],
    [A.almost + 1.0, { x: 1000, y: 530, s: 1.02 }], [A.fear + 1.2, { x: 520, y: 640, s: 1.34 }], [A.old + 1.0, { x: 820, y: 610, s: 1.12 }],
    [A.channel + 3.6, { x: 1020, y: 680, s: .68 }], [A.healthyY + 1.0, { x: 1100, y: 680, s: .72 }], [A.want + 1.0, { x: 1380, y: 690, s: 1.12 }], [A.subscribe + 1.2, { x: 1390, y: 690, s: 1.18 }],
    [A.fair + 2.0, { x: 960, y: 540, s: 1 }], [A.stop + 2.0, { x: 960, y: 520, s: 1.06 }], [A.even + 2.0, { x: 960, y: 535, s: 1.02 }], [A.philo + 1.3, { x: 960, y: 560, s: 1 }],
    [A.pleasures + 1.0, { x: 960, y: 575, s: 1.08 }], [A.suppose + 1.0, { x: 960, y: 565, s: .96 }], [A.what - .1, { x: 1180, y: 580, s: 1.04 }], [A.what + 1.4, { x: 1230, y: 560, s: 1.1 }],
    [A.say - .7, { x: 1112, y: 748, s: .63 }], [A.say - .1, TOWN],
    [A.say + .2, { x: 960, y: 600, s: 1 }], [A.say + 1.6, { x: 960, y: 600, s: 1 }], [A.older + .6, { x: 1080, y: 600, s: 1.1 }], [A.promise + .2, { x: 1380, y: 610, s: 1.12 }],
    [A.till + .6, { x: 1520, y: 600, s: 1.15 }], [A.most2 + 1.8, { x: 1950, y: 620, s: .95 }], [A.now + 2.0, { x: 2300, y: 620, s: .72 }], [A.more + 1.4, { x: 1900, y: 640, s: 1.42 }],
    [A.bigger + 1.6, { x: 2080, y: 610, s: 1.3 }], [A.paid + 1.8, { x: 2300, y: 640, s: 1.22 }], [A.london + 1.2, { x: 2780, y: 610, s: 1.0 }], [A.breaking + .8, { x: 2840, y: 620, s: 1.03 }],
    [clip.end + .4, { x: 2860, y: 620, s: 1.03 }], [A.five + 1.0, { x: 2900, y: 600, s: 1.0 }], [A.never + 1.6, { x: 3150, y: 610, s: 1.08 }], [A.parents + 2.0, { x: 4150, y: 560, s: 1.08 }],
    [A.comes + .6, { x: 4120, y: 545, s: .95 }], [A.stay2 + .9, { x: HX + 50, y: 340, s: 1.6 }], [A.gain + .9, { x: 4170, y: 520, s: 1.0 }], [A.price + .9, { x: 4080, y: 560, s: 1.02 }],
    [A.still + 1.0, { x: AX, y: 560, s: 1.0 }], [A.small + .8, { x: AX, y: 590, s: 1.0 }], [A.goes + .4, { x: AX, y: 560, s: 1.03 }], [A.econ + .8, { x: AX, y: 520, s: 1.0 }],
    [A.died + .4, { x: AX + 20, y: 500, s: 1.08 }], [A.strong + .9, { x: AX, y: 490, s: 1.0 }], [A.doesnt + 1.3, { x: AX, y: 475, s: 1.55 }], [A.shows + 1.5, { x: AX, y: 560, s: 1.0 }],
    [tPlate, { x: 960 + OX, y: 560, s: 1 }],
  ];
  const viewRaw = (t) => X.viewPath(t, VD);
  const view = (t) => { const v = viewRaw(t), b = S.breathe(t); return { x: v.x + b.dx, y: v.y + b.dy, s: v.s }; };
  // the ground's pool of light follows the eye; pinned to the plates at both ends and to the stone at the turn
  function pool(t) {
    const v = viewRaw(t); let p = [v.x, v.y - 30, 1];
    const mixP = (q, k) => { p = p.map((x, j) => lerp(x, q[j], k)); };
    mixP([960, 540, 1], 1 - sineIO(span(t, tTwo, tTwo + 2)));
    mixP([1440, 560, .85], sineIO(span(t, A.what - .4, A.what + .9)) * (1 - sineIO(span(t, A.say + .4, A.say + 1.5))));
    mixP([960 + OX, PQ.ledge - 80, 1], sineIO(span(t, tPlate - 2.5, tPlate)));
    return p;
  }
  const gshift = (t) => OX * sineIO(span(t, A.inher, A.econ));           // the star layer's frame moves to plateTop's frame
  function ground(ctx, t, v) { const [lx, ly, pl] = pool(t), g = gshift(t); X.ground(ctx, t, { x: v.x - g, y: v.y, s: v.s }, { lx: lx - g, ly, pool: pl }); }

  // ============================================================================================ c06 · the question again
  const merge = (t) => quartIO(span(t, tTwo + .1, A.which + 2.4));
  function answers6(ctx, t, s) {
    const mg = merge(t), out = span(t, A.y13 + .15, A.y13 + .9); if (out >= 1) return;
    const pg = lerp(.02 * Math.sin(t * .9), -.8, expoOut(span(t, A.no - .05, A.no + .7))), pc = lerp(-.03 + .02 * Math.sin(t * .8 + 1), pg, mg);
    const tr = lerp(6, 2, span(t, A.no, A.no + .6));
    X.label(ctx, SRC.repair, PT.x, PT.y1 - 62, 1 - span(t, tTwo, tTwo + .8), { size: 26, gold: .7 });
    ctx.save(); ctx.globalAlpha *= 1 - out;
    F.answer(ctx, t, PT.x, lerp(PT.y1, ABAR.y, mg), PT.w, pg, { tremble: tr }); ctx.restore();
    X.label(ctx, SRC.copy, PT.x, PT.y2 - 62, 1 - span(t, tTwo, tTwo + .8), { size: 26, col: COOL.text });
    ctx.save(); ctx.globalAlpha *= 1 - span(mg, .55, 1);
    F.answer(ctx, t, PT.x, lerp(PT.y2, ABAR.y, mg), PT.w, pc, { cool: true, tremble: tr }); ctx.restore();
    if (t > A.no - .1) halo(ctx, ABAR.x - .8 * ABAR.w / 2, ABAR.y, 90, .5 * F.bump(t, A.no + .05, .9), GOLD.halo, GOLD.core);
  }
  // the 100 dots: bar → grid → crowd → bar
  function dots6(ctx, t, s) {
    const t0 = A.y13 + .05; if (t < t0 || t > A.holds + 1.6) return;
    const lit = 56 * expoOut(span(t, A.mostSaid + .25, A.notForMe + .9));
    const cl = span(t, A.seems - .2, A.seems + 1.0) * (1 - span(t, A.holds - .3, A.holds + .6));
    if (cl > 0) halo(ctx, 960, 690, 620, .22 * cl, LAMP.body, LAMP.core);
    for (const d of CROWD) {
      const born = expoOut(span(t, t0 + d.i / 100 * .45, t0 + d.i / 100 * .45 + .35));
      const toGrid = quartIO(span(t, A.y13 + .5 + d.i * .006, A.y13 + 1.7 + d.i * .006));
      const st = quartIO(span(t, A.seems - .3 + d.jt * .25, A.seems + .8 + d.jt * .25)), k = span(st, .45, 1);
      const back = quartIO(span(t, A.holds - .35 + d.jt * .2, A.holds + .65 + d.jt * .2)), kb = k * (1 - span(back, 0, .45));
      const head = [d.x, d.y - d.h * .885 * kb];
      let x = lerp(d.bx, d.gx, toGrid), y = lerp(ABAR.y, d.gy, toGrid);
      x = lerp(x, head[0], span(st, 0, .6)); y = lerp(y, head[1], span(st, 0, .6));
      x = lerp(x, d.bx, span(back, .3, 1)); y = lerp(y, ABAR.y, span(back, .3, 1));
      const r = 7 * born * (1 - kb) * (1 - span(t, A.holds + .85, A.holds + 1.4));
      if (kb > .01) drawCrowdPerson(ctx, t, d, kb, s);
      if (r > .05) { const on = clamp(lit - d.i); ctx.fillStyle = rgba(CREAM, .3 + .7 * on); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    }
    // 3.05: each of 68 dots throws a small arrow at a neighbour (68%: others would)
    const ar = 1 - span(t, A.seems - .2, A.seems + .35);
    if (ar > 0 && t > A.yet) for (const [i, j, k] of ARROWS) {
      const u = span(t, A.yet + .35 + k / 68 * .8, A.yet + .95 + k / 68 * .8) * ar; if (u <= 0) continue;
      const a = CROWD[i], b = CROWD[j], ax = a.gx, ay = a.gy, bx = b.gx, by = b.gy, mx = (ax + bx) / 2 - (by - ay) * .35, my = (ay + by) / 2 + (bx - ax) * .35;
      const pts = curve([ax + (bx - ax) * .22, ay + (by - ay) * .22], [mx, my], [bx - (bx - ax) * .25, by - (by - ay) * .25], 10);
      X.arrow(ctx, pts, u, { col: rgba(CREAM, .62), w: 1.3 / s, head: 5 / s, glow: 0 });
    }
  }
  function drawCrowdPerson(ctx, t, d, k, s) {
    let dir = Math.sign(CROWD[d.tg].x - d.x) || 1, pk = span(t, A.seems + .55 + d.jt * .4, A.seems + 1.05 + d.jt * .4), lean = 0;
    if (d.i === ASKED) {   // 3.07: turns to you, shakes the head, points on
      const turn = span(t, A.except + .35, A.except + .6), on = span(t, A.except + 1.35, A.except + 1.6);
      if (turn > .5 && on < .5) { dir = -1; pk = 0; } else if (on >= .5) { dir = 1; pk = span(t, A.except + 1.35, A.except + 1.8); }
      lean = .08 * Math.sin((t - A.except) * 17) * F.bump(t, A.except + .55, .8);
    }
    ctx.save(); ctx.translate(d.x, d.y); ctx.scale(1, k);
    F.person(ctx, 0, 0, d.h, { pose: 'stand', dir, lean, armR: [lerp(.2, 1.85, pk), lerp(.1, 1.95, pk)] });
    ctx.restore();
  }
  function pew6(ctx, t, s) {
    X.label(ctx, SRC.pew, 960, 300, lab(t, A.y13 + .6, A.seems + .2), { size: 24, spacing: .1 });
    X.label(ctx, SRC.pew56, 905, 488, lab(t, A.mostSaid + .2, A.seems + .3), { size: 36, align: 'left' });
    X.label(ctx, SRC.pew68, 905, 566, lab(t, A.yet + .5, A.seems + .3), { size: 36, align: 'left', gold: .35 });
  }
  // 3.08 · the answer again, a weight under YES
  function answer8(ctx, t, s) {
    const u = span(t, A.holds + .55, A.holds + 1.4), fold = quartIO(span(t, A.aug - .1, A.aug + .7)); if (u <= 0 || fold >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - fold; ctx.translate(0, -fold * 200);
    F.answer(ctx, t, ABAR.x, ABAR.y, ABAR.w, -.28 + .05 * Math.sin(t * 1.4), { u, tremble: 3 });
    weight(ctx, ABAR.x + ABAR.w / 2, ABAR.y + 12, 74, span(t, A.holds + 1.0, A.holds + 1.8), s);
    ctx.restore();
  }
  // 3.09 · the survey card flips: the old question → a shorter life without decline
  function card9(ctx, t, s) {
    const u = span(t, A.aug + .05, A.aug + 1.0) * (1 - span(t, A.almost - .35, A.almost + .35)); if (u <= 0) return;
    const fl = quartIO(span(t, A.turned - .1, A.turned + .9)), sx = Math.abs(Math.cos(Math.PI * fl)), back = fl >= .5, cx = 960, cy = 330, w = 900, h = 168;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.max(.02, sx), 1); ctx.translate(-cx, -cy);
    F.paperCard(ctx, t, cx - w / 2, cy - h / 2, w, h, { u, head: SRC.natgeo, rot: -.006,
      lines: back ? [[SRC.shorter + '?', 40, .35, false]] : [[SRC.question, 44, 0, true]] });
    ctx.restore();
  }
  // 3.10–3.15 · the two lines, body and mind, 64 %, you, old forever
  function lines10(ctx, t, s) {
    const ua = span(t, A.accept + .1, A.accept + 1.7) * (1 - span(t, A.body - .4, A.body + .7));
    if (ua > 0) X.lifeline(ctx, t, LA.x0, LA.x1, LA.y, s, { u: ua, age: LA.age, ageU: 1, end: span(t, A.accept + 1.5, A.accept + 1.9) });
    const ub = span(t, A.shorter - .1, A.shorter + 1.2), lift = span(t, A.fear, A.fear + .8), open = span(t, A.fear + .1, A.fear + 1.8);
    if (ub > 0 && t < A.channel - .3) X.lifeline(ctx, t, LB.x0, LB.x1, LB.y, s, { u: ub, end: span(t, A.shorter + 1.0, A.shorter + 1.4), lift, open, openTo: 2700 });
    const bu = span(t, A.body - .25, A.body + .8) * (1 - span(t, A.almost - .5, A.almost + .3));
    if (bu > 0) F.bodyDrawing(ctx, t, 640, LB.y - 6, 230, { s, u: bu, fix: 1, worn: 0, w: 2.4 });
    X.label(ctx, SRC.declineTags[0], 640, LB.y + 58, lab(t, A.body - .05, A.almost + .2), { size: 26, gold: .6 });
    const hu = span(t, A.mind - .25, A.mind + .8) * (1 - span(t, A.almost - .5, A.almost + .3));
    if (hu > 0) { const hd = F.headProfile(ctx, t, 1040, LB.y - 2, 190, { u: hu, s }); if (hd && hd.mind) halo(ctx, hd.mind[0], hd.mind[1], 56 / s, .75 * span(hu, .6, 1), GOLD.halo, GOLD.core); }
    X.label(ctx, SRC.declineTags[1], 1040, LB.y + 58, lab(t, A.mind - .05, A.almost + .2), { size: 26, gold: .6 });
    // 3.13 the 64 field rises out of the short line and sinks back into it
    const rise = (i) => quartIO(span(t, A.almost + .05 + i * .009, A.almost + .9 + i * .009)) * (1 - quartIO(span(t, A.fear - .3 + (99 - i) * .006, A.fear + .5 + (99 - i) * .006)));
    if (t > A.almost && t < A.fear + 1.2) { const on = 64 * expoOut(span(t, A.saidYes - .2, A.saidYes + .9));
      for (let i = 0; i < 100; i++) { const k = rise(i); if (k <= 0) continue; const gx = F64.x + (i % 10) * F64.g, gy = F64.y + Math.floor(i / 10) * F64.g;
        const x = lerp(gx, gx, k), y = lerp(LB.y, gy, k), lt = clamp(on - i);
        if (lt > 0 && i % 7 === 0) halo(ctx, x, y, 22, .25 * lt, GOLD.halo, GOLD.core);
        ctx.fillStyle = lt > 0 ? mixHex(CREAM, GOLD.body, lt) : rgba(CREAM, .22); ctx.beginPath(); ctx.arc(x, y, 8 * Math.min(1, k * 2), 0, TAU); ctx.fill(); } }
    X.big(ctx, SRC.natgeo64, 1130, 470, 84, lab(t, A.saidYes - .1, A.fear + .1), { align: 'left' });
    // 3.15 the old line above, its grey end running on and on
    const uo = span(t, A.old - .4, A.old + 1.0);
    if (uo > 0) { const x1 = 1500 + 220 * Math.max(0, t - A.old), ageU = 1 - span(t, A.healthyY - .2 + 2 * .12, A.healthyY + .8 + 2 * .12);
      const cv = conv(t); X.lifeline(ctx, t, lerp(-300, ABAR.x - ABAR.w / 2, cv), lerp(Math.min(x1, 3600), ABAR.x + ABAR.w / 2, cv), lerp(LA.y, ABAR.y, cv), s, { u: uo, from: 'centre', age: lerp(220, 1e9, cv), ageU, a: 1 - span(cv, .55, 1) }); }
  }
  // you in c06/c07 (Y6: you ask; Y67: you walk the open line)
  function you67(ctx, t, s) {
    if (t > A.seems + 1.0 && t < A.accept + .8) {
      const x = keyed(t, Y6), walk = walkOf(t, Y6), dir = dirOf(t, Y6, 1);
      const pose = t > A.except + .4 && t < A.except + 1.3 ? 'reach' : t > A.holds ? 'look' : 'stand';
      F.du(ctx, x, 836, 116, { pose: walk != null ? undefined : pose, walk, dir });
    }
    if (t > A.fear - 1.1 && t < A.fair + 1.4) {
      const x = keyed(t, Y67), walk = walkOf(t, Y67, 5.2), sk = span(t, A.fair - .3, A.fair + .7);
      sunk(ctx, LB.y, sk, 110, () => F.du(ctx, x, LB.y - 2, 104, { walk, dir: 1, pose: walk != null ? undefined : 'look' }));
      // the old, bent figure on the grey line (3.15), straightens at M.02
      const ou = span(t, A.old - .2, A.old + .5);
      if (ou > 0) { const lean = .34 * (1 - span(t, A.healthyY + .1, A.healthyY + 1.1));
        sunk(ctx, LA.y, Math.max(1 - ou, sk), 104, () => F.person(ctx, x - 30, LA.y - 2, 98, { walk: walk != null ? t * 3.6 : undefined, dir: 1, lean, long: true })); }
    }
    X.label(ctx, SRC.oldForever, keyed(t, Y67) + 150, LA.y - 52, lab(t, A.old + .3, A.channel + .6), { size: 28, col: AGE.text, align: 'left' });
    X.label(ctx, SRC.healthy, keyed(t, Y67) + 150, LB.y - 30, lab(t, A.old + .5, A.channel + .6), { size: 28, gold: 1, align: 'left' });
  }

  // ============================================================================================ c07 · everybody · subscribe · the fair question · boredom · the turn
  const conv = (t) => sineIO(span(t, A.fair - .8, A.fair + 1.8));
  function lines7(ctx, t, s) {
    if (t < A.channel - .3 || t > A.fair + 1.6) return;
    const cv = conv(t);
    LINES.forEach((L, k) => {
      const sp = quartIO(span(t, A.channel - .2 + L.d * .09, A.channel + 1.7 + L.d * .09)); if (sp <= 0) return;
      const y = lerp(lerp(LB.y, L.y, sp), ABAR.y, cv), x0 = lerp(-620, ABAR.x - ABAR.w / 2, cv), x1 = lerp(L.x1, ABAR.x + ABAR.w / 2, cv);
      const ageU = 1 - span(t, A.healthyY - .2 + L.d * .12, A.healthyY + .8 + L.d * .12), a = span(sp, 0, .35) * (1 - span(cv, .55, 1));
      X.lifeline(ctx, t, x0, x1, y, s, { a, age: lerp(L.age, 1e9, cv), ageU, end: 1 - cv, glow: .7 });
      const px = keyed(t, Y67) + L.off * sp, lean = .3 * ageU;
      ctx.save(); ctx.globalAlpha *= a; sunk(ctx, y, span(cv, 0, .5), L.h, () => F.person(ctx, px, y - 2, L.h, { walk: t * 3.8 + L.ph, dir: 1, lean })); ctx.restore();
    });
    // your line and the old one converge into the answer too
    const yb = lerp(LB.y, ABAR.y, cv);
    X.lifeline(ctx, t, lerp(LB.x0, ABAR.x - ABAR.w / 2, cv), lerp(LB.x1, ABAR.x + ABAR.w / 2, cv), yb, s, { open: 1 - cv, openTo: 2700, a: 1 - span(cv, .8, 1) });
  }
  function tag7(ctx, t, s) {   // M.03–M.04: a SUBSCRIBE tag rises on your line and lights gold (a tag, never a button)
    const u = span(t, A.want - .1, A.want + .7) * (1 - span(t, A.fair - .5, A.fair + .1)); if (u <= 0) return;
    const x = 1490, y0 = LB.y, y1 = 618, g = span(t, A.subscribe + .1, A.subscribe + .6);
    X.drawPath(ctx, [[x, y0], [x, lerp(y0, y1 + 20, expoOut(u))]], 1, { col: rgba(mixHex(CREAM, GOLD.line, g), .8), w: 2 / s });
    X.dateTag(ctx, 'SUBSCRIBE', x, y1, u, {});
    if (g > 0) { ctx.save(); ctx.globalAlpha *= g; X.dateTag(ctx, 'SUBSCRIBE', x, y1, u, { gold: true }); ctx.restore(); halo(ctx, x, y1, 90, .45 * g, GOLD.halo, GOLD.core); }
  }
  function fair7(ctx, t, s) {   // M.05–M.07: THE ANSWER with HEALTHY; the bead goes towards YES, a weight on NO pulls it back
    const u = span(t, A.fair + 1.0, A.fair + 1.9), lp = quartIO(span(t, A.philo - .2, A.philo + 1.2)); if (u <= 0 || lp >= 1) return;
    const p = .58 * expoOut(span(t, A.would - .3, A.would + .9)) - .52 * sineIO(span(t, A.caseNo - .2, A.caseNo + 1.6)) + .03 * Math.sin(t * 1.2);
    ctx.save(); ctx.globalAlpha *= 1 - lp;
    F.answer(ctx, t, ABAR.x, ABAR.y, ABAR.w, p, { u, top: SRC.healthy, topU: span(t, A.fair + 1.4, A.fair + 2.1), tremble: 2 });
    weight(ctx, ABAR.x - ABAR.w / 2, ABAR.y + 12, 74, span(t, A.even + .2, A.even + 1.1), s);
    ctx.restore();
    X.big(ctx, SRC.question, 960, 440, 62, span(t, A.stop - .05, A.stop + .9) * (1 - span(t, A.philo - .4, A.philo + .2)), { gold: .12, glow: false });
  }
  const theta = (t) => Math.PI / 2 - (t - A.philo) * TAU / 2.3;   // the walker on the loop (a lap per 2.3 s)
  function loop7(ctx, t, s) {
    const lp = quartIO(span(t, A.philo - .2, A.philo + 1.2)), un = quartIO(span(t, A.suppose - .25, A.suppose + .9)); if (lp <= 0 || un >= 1) return;
    const N = 120, pts = [];
    for (let i = 0; i < N; i++) { const q = i / (N - 1), th = Math.PI - TAU * q; pts.push([lerp(ABAR.x - ABAR.w / 2 + ABAR.w * q, LOOP.x + LOOP.rx * Math.cos(th), lp), lerp(ABAR.y, LOOP.y + LOOP.ry * Math.sin(th), lp)]); }
    const dim = span(t, A.philo + 1.0, A.othersA) * (1 - span(t, A.othersA + .6, A.pleasures + 1.2));
    gline(ctx, pts, 1 - un, s, { col: mixHex(GOLD.body, AGE.line, .85 * dim), core: mixHex(GOLD.core, AGE.text, dim), glow: 1 - .7 * dim, spark: false });
    // the joys that never wear out (M.09): they light each time the walker passes
    const th = theta(t), ju = span(t, A.othersA + .2, A.othersA + .9) * (1 - un);
    JOYS.forEach((jt) => { if (ju <= 0) return; let d = ((th - jt) % TAU + TAU) % TAU; if (d > Math.PI) d -= TAU;
      const fl = Math.exp(-((d / .35) ** 2)), x = LOOP.x + LOOP.rx * Math.cos(jt), y = LOOP.y + LOOP.ry * Math.sin(jt);
      halo(ctx, x, y, (40 + 50 * fl) / s, (.35 + .55 * fl) * ju, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(x, y, (5 + 3 * fl) / s * ju, 0, TAU); ctx.fill(); });
    // the walker
    const wu = span(t, A.philo + .7, A.philo + 1.4); if (wu > 0) {
      const x = LOOP.x + LOOP.rx * Math.cos(th), y = LOOP.y + LOOP.ry * Math.sin(th), h = 118 * (1 + .16 * Math.sin(th)), dir = Math.sin(th) >= 0 ? 1 : -1;
      sunk(ctx, y, Math.max(1 - wu, span(un, 0, .5)), h, () => F.person(ctx, x, y - 2, h, { walk: t * 4.4, dir, lean: .12 * dim }));
    }
    X.big(ctx, SRC.boredom, 960, 395, 66, lab(t, A.philo + 1.1, A.othersA + .3), { gold: 0, col: AGE.text, glow: false });
  }
  function many7(ctx, t, s) {   // M.10: the loop unrolls into many answers; their beads slide to YES one after another
    const sink = sineIO(span(t, A.what - .45, A.what + .8)); if (t < A.suppose - .3 || sink >= 1) return;
    for (const q of SMALLA) {
      const u = span(t, A.suppose + .15 + q.k * .09, A.suppose + .95 + q.k * .09); if (u <= 0) continue;
      const p = lerp(q.p0 + .04 * Math.sin(t * 1.5 + q.k), .86, expoOut(span(t, A.sayYes - .4 + q.k * .16, A.sayYes + .4 + q.k * .16)));
      ctx.save(); ctx.globalAlpha *= 1 - span(sink, .5, 1); F.answer(ctx, t, q.x, q.y + 300 * sink, 300, p, { u, size: 24 }); ctx.restore();
    }
  }

  // ============================================================================================ c08 · the scenario
  const youX8 = (t) => keyed(t, Y8);
  const sag = (t) => 26 * sineIO(span(t, A.bigger + .1, A.bigger + 1.4)) * (1 - span(t, A.paid + .1, A.paid + 1.0));
  const coupleX = (t) => lerp(J, 2100, sineIO(span(t, W8[0][0], W8[1][0])));
  const sagY = (x, t) => LY + sag(t) * Math.exp(-(((x - coupleX(t)) / 260) ** 2));
  const split = (t) => quartIO(span(t, A.paid - .1, A.paid + 1.3));
  function scenario8(ctx, t, s) {
    const joinK = span(t, A.till - .3, A.till + .6);
    // your line: out of the window, both ways; past J it is replaced by the joined strand
    const u = span(t, A.say + .3, A.say + 2.0), x1 = lerp(5200, J, joinK), segK = span(t, A.paid + .3, A.paid + 1.6), segOut = span(t, A.five - .4, A.five + .5);
    const out9 = span(t, A.inher - .2, A.inher + 1.0); if (out9 >= 1) return;
    if (u > 0) X.lifeline(ctx, t, 200, x1, LY, s, { u, from: 960, open: 1 - joinK, openTo: 6200, a: 1 - out9 });
    X.yearTag(ctx, '1985', 200, LY, span(t, A.say + 1.2, A.say + 2), s, { below: true, size: 34 });
    // 4.02 the oldest alive today
    X.yearTag(ctx, '', 1250, LY, span(t, A.scen, A.scen + .6) * (1 - span(t, A.most2, A.most2 + .6)), s);
    X.label(ctx, SRC.oldest, 1250, LY - 52, lab(t, A.scen + .3, A.promise + .2), { size: 26 });
    // 4.03 the partner's line comes down and joins yours
    const P0 = [-300, 470], C0 = [1350, 470], pc = [[-300, 470], [700, 470], ...curve([700, 470], C0, [J, LY], 30).slice(1)];
    const pu = span(t, A.promise - .1, A.promise + 1.6) * (1 - span(t, A.paid + .4, A.paid + 1.4));
    if (pu > 0) gline(ctx, pc, pu, s, { a: 1 - span(t, A.paid + .4, A.paid + 1.4) });
    // the joined strand: two lines, J → the end tick (≈ 30 years), then open; it bows under the rings; splits into work
    const ju = span(t, A.till - .2, A.most2 + .6), op = sineIO(span(t, A.now + .2, A.now + 2.0)), xe = lerp(E30, 5200, op);
    if (ju > 0) {
      const N = 90, mk = (dy, lift) => Array.from({ length: N + 1 }, (_, i) => { const x = lerp(J, xe, i / N); return [x, sagY(x, t) + dy - lift * span(x, 2120, 2500) * 150]; });
      const sp = split(t);
      gline(ctx, mk(-4.5 - 2 * sp, sp), ju, s, { a: 1 - span(t, A.london - .2, A.london + .8), spark: false });
      { const pts = mk(4.5 * (1 - segOut), 0), gk = segK * (1 - segOut);
        if (gk <= 0) gline(ctx, pts, ju * (1 - out9), s, { spark: false });
        else { // the line breaks into work segments (gaps open from J on) and closes again for the five careers
          for (let x = J; x < xe; x += 230) { const g = 34 * gk, a0 = x + g / 2, a1 = Math.min(xe, x + 230 - g / 2); if (a1 <= a0) continue;
            const seg = pts.filter((p) => p[0] >= a0 && p[0] <= a1); if (seg.length < 2) continue; gline(ctx, seg, 1, s, { spark: false }); }
          const pay = span(t, A.paid + .9, A.paidFor + 1.4) - segOut; X.drawPath(ctx, [[J, LY + 24], [xe, LY + 24]], pay, { col: rgba(CREAM, .55), w: 1.6 / s });
          if (pay > 0) for (let i = 0; i < 14; i++) { const x = J + ((i * 230 + (t - A.paid) * 90) % 3220); if (x > lerp(J, xe, pay)) continue; ctx.fillStyle = rgba(GOLD.line, .8 * pay); ctx.beginPath(); ctx.arc(x, LY + 24, 4 / s, 0, TAU); ctx.fill(); }
        } }
      endTick(ctx, E30, LY, s, span(t, A.most2 + .3, A.most2 + .8), span(t, A.now - .05, A.now + .8));
    }
    // ≈ 30 years: a bracket over the joined stretch
    const bk = lab(t, A.most2 + 1.0, A.now + .7);
    if (bk > 0) { X.drawPath(ctx, [[J, 640], [J, 628], [E30, 628], [E30, 640]], sineIO(bk), { col: rgba(CREAM, .7), w: 1.6 / s });
      X.label(ctx, SRC.y30, (J + E30) / 2, 604, bk, { size: 38 }); }
    X.label(ctx, SRC.offer[1], 2750, 610, lab(t, A.now + .6, A.more + .9), { size: 34, gold: .9 });
    // the rings: where the lines meet; they follow the couple and grow heavy
    const ru = span(t, A.till - .1, A.till + 1.0) * (1 - span(t, A.paid - .1, A.paid + .6));
    if (ru > 0) { const hv = sineIO(span(t, A.bigger, A.bigger + 1.3)); F.rings(ctx, t, coupleX(t), lerp(600, 610, hv), lerp(24, 40, hv), { u: ru, s }); }
    X.label(ctx, SRC.marriage, J, 410, lab(t, A.till - .1, A.most2 + .4), { size: 30, gold: .3 });
    // 4.08 your workbench (a drawing) on a segment
    const bu = span(t, A.paid + .9, A.paid + 1.9) * (1 - span(t, A.london + .2, A.london + 1.0));
    if (bu > 0) { const bx = 2360, by = LY - 4; X.drawPath(ctx, [[bx - 50, by - 46], [bx + 50, by - 46]], bu, { col: rgba(CREAM, .85), w: 2.4 / s });
      X.drawPath(ctx, [[bx - 42, by - 46], [bx - 42, by]], bu, { col: rgba(CREAM, .7), w: 2 / s }); X.drawPath(ctx, [[bx + 42, by - 46], [bx + 42, by]], bu, { col: rgba(CREAM, .7), w: 2 / s });
      X.drawPath(ctx, [[bx - 22, by - 46], [bx - 18, by - 60], [bx + 8, by - 60], [bx + 12, by - 46]], span(bu, .5, 1), { col: rgba(CREAM, .6), w: 1.6 / s }); }
    blocks8(ctx, t, s);
    // the people: you, your partner
    const pp = keyed(t, PART), walkP = Math.abs(vel(t, PART)) > .002 ? t * 6 : undefined;
    const partOut = span(t, A.paid + .2, A.paid + 1.6);
    if (t > A.promise && partOut < 1) {
      let x, y, dir = 1;
      if (t < A.more + .1) { const q = pc, L = q.length - 1, f = pp * L, i = Math.min(L - 1, Math.floor(f)), r = f - i; x = lerp(q[i][0], q[i + 1][0], r) + 34 * span(pp, .9, 1); y = lerp(q[i][1], q[i + 1][1], r); if (pp >= 1) { x = J + 34; y = LY; dir = -1; } }
      else { x = coupleX(t) + 34 + 900 * sineIO(partOut); y = sagY(x, t) - 8 * split(t) - 150 * span(x, 2120, 2500) * split(t); }
      const wk = t < A.more + .1 ? walkP : (t < A.paid + .3 ? t * 6 : (partOut > 0 ? t * 6 : undefined));
      F.person(ctx, x, y - 2, 88, { walk: wk, dir: t < A.more + .1 ? dir : 1, long: true });
    }
    const yx = t < A.more + .1 || t > A.paid + .3 ? youX8(t) : coupleX(t) - 20;
    const yw = t >= A.more + .1 && t <= A.paid + .3 ? t * 6 : walkOf(t, Y8);
    const ydir = t < A.more + .1 ? dirOf(t, Y8, 1) : 1, yy = t < A.parents + .2 && yx > J - 50 && yx < 2300 ? sagY(yx, t) : LY;
    const hold = t > A.paid + 1.6 && t < A.london + .4 && yw == null;
    if (t > A.say + .5 && t < A.inher + 1.4) sunk(ctx, LY, span(t, A.inher - .1, A.inher + .9), 96, () => F.du(ctx, yx, yy - 2, 92, { walk: yw, dir: ydir, pose: yw != null ? undefined : hold ? 'reach' : t > A.parents + 2.2 ? 'look' : 'stand' }));
  }
  // 4.09–4.12: LEARN · WORK · RETIRE → the plate → five careers
  function blocks8(ctx, t, s) {
    const out = span(t, A.five - .3, A.five + .4), br = quartIO(span(t, A.breaking - .05, A.breaking + .7));
    const ws = [A.learn, A.work, A.retire];
    BL.forEach(([a, b], i) => { const u = expoOut(span(t, ws[i] - .25, ws[i] + .35)) * (1 - out); if (u <= 0) return;
      const m = (a + b) / 2, hw = (b - a) / 2 * u, col = [rgba(CREAM, .75), GOLD.body, AGE.line][i];
      for (const sd of [-1, 1]) { ctx.save(); ctx.translate(m + sd * (hw / 2) + sd * 12 * br, LY - 14); ctx.rotate(sd * .05 * br * (i - 1 || 1));
        ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-hw / 2 + (sd < 0 ? 0 : 1), -9, hw - 1, 18, 4); ctx.fill(); ctx.restore(); }
      X.label(ctx, SRC.plan3[i], m, LY - 46, lab(t, ws[i] - .1, A.five + .3), { size: 26, col: i === 1 ? GOLD.text : CREAM }); });
    // the five careers: LEARN-WORK pairs; more keep coming as you walk (never done)
    const pin = (k) => span(t, A.five - .1 + Math.min(k, 4) * .13 + Math.max(0, k - 4) * 0, A.five + .5 + Math.min(k, 4) * .13), more = (k) => k < 5 ? 1 : span(youX8(t) + 700, PAIRS[k].l[0], PAIRS[k].l[0] + 120);
    const pout = (k) => span(t, A.parents - .2 + k * .06, A.parents + .7 + k * .06);
    PAIRS.forEach((q, k) => { const u = expoOut(pin(k) * more(k)) * (1 - pout(k)); if (u <= 0) return;
      for (const [seg, col] of [[q.l, rgba(CREAM, .75)], [q.w, GOLD.body]]) { const m = (seg[0] + seg[1]) / 2, hw = (seg[1] - seg[0]) * u; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(m - hw / 2, LY - 23, hw, 18, 4); ctx.fill(); } });
    X.label(ctx, SRC.plan3[0], 2430, LY - 46, lab(t, A.five + .2, A.never + .4), { size: 22 });
    X.label(ctx, SRC.plan3[1], 2552, LY - 46, lab(t, A.five + .3, A.never + .4), { size: 22, col: GOLD.text });
  }
  // the plate grows out of the WORK block and goes back into it (screen space)
  function clip8(ctx, t, v) {
    if (t < clip.start - .8 || t > clip.end + .6) return;
    const m = span(t, clip.start - .7, clip.start + .45) * (1 - span(t, clip.end - .55, clip.end + .35)); if (m <= 0) return;
    const [x0, y0] = X.toScreen(v, BL[1][0], LY - 23), [x1, y1] = X.toScreen(v, BL[1][1], LY - 5);
    F.clipPlate(ctx, t, T, 'C4', { from: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, morph: m });
  }
  // 4.13–4.19: your parents' house, their line above yours, the hand-off that never fires
  function parents8(ctx, t, s) {
    const hu = span(t, A.parents - .3, A.parents + .9), hr = sineIO(span(t, A.inScen - .35, A.inScen + 1.0)), out = span(t, A.inher - .2, A.inher + 1.0);
    const theirU = span(t, A.inScen + .4, A.inScen + 1.7) * (1 - out);
    if (theirU > 0) X.lifeline(ctx, t, 2700, 6000, THEIR, s, { u: theirU, from: HX, glow: 1 + .4 * F.bump(t, A.gain, 1.4) });
    const baseY = lerp(LY, THEIR, hr);
    if (hu > 0 && out < 1) sunk(ctx, baseY, Math.max(1 - hu, out), 330, () => house2(ctx, t, HX, baseY - 1, s, { lit: span(t, A.parents, A.parents + 1.2), parents: span(t, A.stay2 - .3, A.stay2 + .4), wave: span(t, A.stay2, A.stay2 + .5) * (1 - span(t, A.own + 1, A.price)) }));
    // the gate in front of the house (only while the house stands on your line)
    const gu = span(t, A.parents + .4, A.parents + 1.2) * (1 - span(t, A.inScen - .4, A.inScen + .3));
    for (let i = 0; i < 4; i++) X.drawPath(ctx, [[GATE + i * 16, LY], [GATE + i * 16, LY - 40]], gu, { col: rgba(CREAM, .5), w: 2 / s });
    if (gu > 0) X.drawPath(ctx, [[GATE - 6, LY - 30], [GATE + 54, LY - 30]], gu, { col: rgba(CREAM, .5), w: 2 / s });
    // the hand-off: their line → yours; it never fires (stops halfway, flickers); 4.19 it turns into THE ANSWER
    const hk = span(t, A.inScen + 1.1, A.comes + .6), rot = quartIO(span(t, A.still - .35, A.still + .7)), back = quartIO(span(t, A.inher - .25, A.inher + .7));
    const fl = .55 + .04 * Math.sin(t * 5.3) + .03 * Math.sin(t * 13.1);
    if (hk > 0 && rot < 1) handoff(ctx, [AX, THEIR + 10], [AX, LY - 10], Math.min(hk, fl), s, { a: 1 - span(rot, .6, 1) });
    X.label(ctx, SRC.inherit, AX - 26, 590, lab(t, A.comes - .1, A.stay2 + .2), { size: 28, align: 'right' });
    X.label(ctx, SRC.gain, HX + 330, THEIR - 30, lab(t, A.gain - .05, A.still + .2), { size: 32, gold: 1 });
    X.label(ctx, SRC.price, AX - 26, 640, lab(t, A.price - .05, A.still + .2), { size: 32, align: 'right' });
    // 4.17 what they own: a small gold house token, it stays up at the top of the hand-off
    const tk = span(t, A.own - .1, A.own + .6) * (1 - span(t, A.still - .4, A.still + .2));
    if (tk > 0) { const x = AX, y = THEIR + 46 + 2 * Math.sin(t * 2.2), k = expoOut(tk), w = 26 * k;
      halo(ctx, x, y, 50, .5 * tk, GOLD.halo, GOLD.core);
      X.drawPath(ctx, [[x - w / 2, y + w * .5], [x - w / 2, y - w * .1], [x, y - w * .55], [x + w / 2, y - w * .1], [x + w / 2, y + w * .5], [x - w / 2, y + w * .5]], 1, { col: GOLD.body, w: 2.6 / s }); }
    // 4.19 → 5.01: the hand-off turns into THE ANSWER and back into a small hand-off
    if (rot > 0 && back < 1) {
      const ang = Math.PI / 2 * (1 - rot), len = lerp(270, 600, rot), cy = (THEIR + LY) / 2;
      if (rot < 1) { ctx.save(); ctx.translate(AX, cy); ctx.rotate(ang); X.drawPath(ctx, [[-len / 2, 0], [len / 2, 0]], 1, { col: rgba(mixHex(CREAM, GOLD.body, rot), .85), w: lerp(2.6, 4, rot) / s, dash: rot < .8 ? [12 / s, 9 / s] : null }); ctx.restore(); }
      else if (back <= 0) F.answer(ctx, t, AX, cy, 600, .12 + .3 * Math.sin((t - A.still) * 1.9), { u: span(t, A.still + .55, A.still + 1.3), tremble: 4 });
      else { ctx.save(); ctx.globalAlpha *= 1 - span(back, 0, .3); F.answer(ctx, t, AX, cy, 600, .12 + .3 * Math.sin((t - A.still) * 1.9), { tremble: 4 }); ctx.restore();
        ctx.save(); ctx.translate(lerp(AX, OX + 700, back), lerp(cy, 650, back)); ctx.rotate(Math.PI / 2 * back); const L = lerp(600, 90, back);
        X.drawPath(ctx, [[-L / 2, 0], [L / 2, 0]], 1, { col: rgba(mixHex(GOLD.body, CREAM, back), .85 * (1 - span(back, .85, 1))), w: lerp(4, 2.6, back) / s, dash: back > .2 ? [12 / s, 9 / s] : null }); ctx.restore(); }
    }
  }

  // ============================================================================================ c09 · power and ideas · Planck · the star · the ledge (local x + OX)
  const HO = [{ x: 700, h: 100, word: 'INHERITANCE', t: 0 }, { x: 960, h: 200, word: 'POWER', t: 1 }, { x: 1220, h: 300, word: 'IDEAS', t: 2 }];
  function power9(ctx, t, s) {
    if (t < A.inher - .3 || t > A.econ + 1) return;
    const scene = quartIO(span(t, A.power - .2, A.power + 1.2)), gone = span(t, A.planck - .3, A.planck + .8);
    HO.forEach((q, i) => {
      const u = i === 0 ? span(t, A.inher + .1, A.inher + .9) : span(t, A.small - .1 + i * .3, A.small + .7 + i * .3); if (u <= 0) return;
      const sk = i === 1 ? 0 : scene; if (sk >= 1) return;
      const top = 700 - q.h, k = expoOut(u), a = 1 - sk;
      let ux0 = q.x - 80, ux1 = q.x + 80, uy = top, lx0 = q.x - 80, lx1 = q.x + 80;
      if (i === 1) { ux0 = lerp(ux0, 360, scene); ux1 = lerp(ux1, 960, scene); uy = lerp(uy, 450, scene); lx0 = lerp(lx0, 360, scene); lx1 = lerp(lx1, 1560, scene); }
      const ga = a * (1 - gone);
      if (ga > 0) { X.lifeline(ctx, t, OX + ux0, OX + ux1, uy, s, { u: k, from: 'centre', a: ga, end: i === 1 ? span(t, A.goes - .05, A.goes + .35) : 0 });
        X.lifeline(ctx, t, OX + lx0, OX + lx1, 700, s, { u: k, from: 'centre', a: ga }); }
      if (i !== 1 || scene < .5) handoff(ctx, [OX + q.x, top + 10], [OX + q.x, 690], k * (1 - span(scene, 0, .5)), s, { a: a * (1 - gone) });
      X.label(ctx, q.word, OX + q.x, 744, lab(t, (i === 0 ? A.inher + .4 : A.small + i * .3), A.power + .4) * a, { size: i === 0 ? 22 : 26, gold: i ? .5 : 0 });
    });
    // 5.02: the baton passes only at an end tick
    if (scene > 0 && gone < 1) {
      const ax = OX + lerp(560, 930, sineIO(span(t, A.power + .2, A.goes - .1))), aw = vel(t, [[A.power + .2, 0], [A.goes - .1, 1]]) > .002 ? t * 5 : undefined;
      const pu = span(t, A.power + .3, A.power + 1.0), sinkA = span(t, A.goes + .1, A.goes + .9);
      let hand = null;
      ctx.save(); ctx.globalAlpha *= 1 - gone;
      sunk(ctx, 450, Math.max(1 - pu, sinkA), 134, () => { hand = F.person(ctx, ax, 448, 128, { walk: aw, dir: 1, long: true, armR: aw == null ? [.9, 1.4] : undefined }); });
      const bxB = OX + 1040, bh = F.du(ctx, bxB, 698, 120, { pose: t > A.goes + .7 ? 'reach' : 'look', dir: -1 });
      const drop = expoIn(span(t, A.goes + .15, A.goes + .75)), hs = hand && sinkA < .3 ? hand.R : [OX + 930, 420];
      const bp = drop >= 1 ? bh.R : [lerp(hs[0], OX + 1000, drop), lerp(hs[1], bh.R[1], drop)];
      const pl = t > A.planck - .3 ? quartIO(span(t, A.planck - .3, A.planck + .7)) : 0;
      const bx = lerp(bp[0], 960 + OX, pl), by = lerp(bp[1], 360, pl);
      if (pu > 0) { halo(ctx, bx, by, 40, .55 * pu, GOLD.halo, GOLD.core); ctx.save(); ctx.translate(bx, by); ctx.rotate(-.5 + drop * 2.6); ctx.fillStyle = GOLD.body; ctx.fillRect(-3.5 / s, -22, 7 / s, 44); ctx.restore(); }
      ctx.restore();
      if (drop > 0 && drop < 1) handoff(ctx, [OX + 1000, 462], [OX + 1000, 640], 1, s, { a: .5 * F.bump(t, A.goes + .1, .9) });
    }
  }
  function star9(ctx, t, s) {
    if (t < A.econ - .3) return;
    const fu = span(t, A.econ - .1, A.econ + 1.0), C = [960 + OX, 470];
    const sk = quartIO(span(t, A.shows - .3, A.shows + 1.2));                     // 5.09: everything goes down into the base line
    const lu = span(t, A.econ, A.econ + 1.2) * (1 - span(sk, 0, .6));
    if (lu > 0) X.lifeline(ctx, t, C[0] - 440, C[0], C[1], s, { u: lu, end: span(t, A.died, A.died + .4), glow: 1 - .6 * span(t, A.died, A.died + .8) });
    const moveIn = (f) => quartIO(span(t, A.moved - .25 + f.jt * .5, A.moved + .9 + f.jt * .5)), light = (f) => span(t, A.strong - .3 + f.jt * .6, A.strong + .3 + f.jt * .6);
    FIELD.forEach((f, j) => {
      const b = expoOut(span(t, A.econ + .05 + f.k / 72 * .7, A.econ + .5 + f.k / 72 * .7)); if (b <= 0) return;
      const r = f.out ? lerp(f.r, f.r * .56, moveIn(f)) : f.r, rr = r * b;
      let x = C[0] + Math.cos(f.a) * rr, y = C[1] + Math.sin(f.a) * rr * .82;
      const lt = f.out ? light(f) : 0, nc = NEWC.indexOf(j);
      if (sk > 0) { if (nc >= 0) { x = lerp(x, PQ.wait[nc] + OX, sk); y = lerp(y, PQ.y, sk); } else { y = lerp(y, PQ.y, sk); } }
      const rad = (f.out ? 7 : 6) * (1 - (nc >= 0 ? span(t, A.keep - .1, A.keep + .5) : span(sk, .6, 1)));
      if (rad <= .05) return;
      if (lt > 0 && j % 3 === 0) halo(ctx, x, y, 30, .3 * lt * (1 - sk), GOLD.halo, GOLD.core);
      ctx.fillStyle = mixHex(mixHex(P.night1, CREAM, .4), GOLD.body, lt); ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
    });
    // the star: gold, then cream after it died (5.08: the end tick stays cream, never gold)
    const su = fu * (1 - span(sk, 0, .5)); if (su > 0) { const d = span(t, A.died, A.died + .7);
      halo(ctx, C[0], C[1], 120, .7 * su * (1 - d), GOLD.halo, GOLD.core);
      ctx.fillStyle = mixHex(GOLD.body, mixHex(CREAM, AGE.line, .4), d); ctx.beginPath(); ctx.arc(C[0], C[1], 15 * expoOut(su) * (1 - .35 * d), 0, TAU); ctx.fill(); }
  }
  // 5.09 → plateTop: the base line, the step up into the ledge, the one who stays, the newcomers who wait
  function ledge9(ctx, t, s) {
    const bu = span(t, A.shows - .2, A.shows + 1.3); if (bu <= 0) return;
    const hh = (PQ.y - PQ.ledge) * sineIO(span(t, A.atTop - .1, A.keep + .3)), Q = PQ;
    const pts = [[Q.x0, Q.y], [Q.s0, Q.y], [Q.s0, Q.y - hh], [Q.s1, Q.y - hh], [Q.s1, Q.y], [Q.x1, Q.y]].map(([x, y]) => [x + OX, y]);
    // drawn out from the middle while it comes, then exactly the plate's line
    const g = sineIO(bu); if (g < 1) F.goldSpan(ctx, pts, .5 - .5 * g, .5 + .5 * g, { w: 3.2 / s, spark: false }); else F.goldSpan(ctx, pts, 0, 1, { w: 3.2 / s, spark: false });
    const hu = span(t, A.shows + .5, A.shows + 1.4), ly = Q.y - hh;
    halo(ctx, Q.holder + OX, ly - 70, 260, .5 * sineIO(span(t, A.shows + .5, A.keep + .3)), GOLD.halo, GOLD.core);
    sunk(ctx, ly, 1 - hu, 156, () => F.person(ctx, Q.holder + OX, ly - 2, 150, { pose: 'stand', dir: 1, light: 1 }));
    Q.wait.forEach((x, i) => { const u = span(t, A.keep - .2 + i * .12, A.keep + .55 + i * .12);
      sunk(ctx, Q.y, 1 - u, 124, () => F.person(ctx, x + OX, Q.y - 2, 112 + (i % 2) * 8, { pose: i === 0 ? 'look' : 'stand', dir: -1 })); });
  }
  function planck9(ctx, t) {   // screen space: the quote card, words light as spoken
    const u = span(t, A.planck - .1, A.planck + .9), ex = quartIO(span(t, A.econ - .3, A.econ + .5)); if (u <= 0 || ex >= 1) return;
    const k = 1 - .96 * ex, [cx, cy] = X.toScreen(view(t), 960 + OX, 470);
    ctx.save(); ctx.translate(lerp(W / 2, cx, ex), lerp(330, cy, ex)); ctx.scale(k, k); ctx.translate(-W / 2, -330); ctx.globalAlpha *= 1 - span(ex, .75, 1);
    F.quoteCard(ctx, t, T, { text: SRC.planck.text, credit: SRC.planck.credit, spoken: ['A new truth', 'eventually die'], after: A.planck - .5, u, w: 1340, size: 42, y: 150 }); ctx.restore();
  }

  // ============================================================================================ the stone (M.11) and the flight into a window (4.01)
  const ret = (t) => 1 - sineIO(span(t, A.what - .5, A.what + 1.5));
  function stone(ctx, t, v) {
    const r = ret(t);
    S.stoneWorld(ctx, t, v, { ground: false, crack: .85, crackA: (1 - r) ** 3, retract: r, town: 1, lit: sineIO(span(t, A.what + 1.2, A.say - .2)), you: { a: (1 - r) ** 2 } });
  }
  const pushK = (t) => quartIO(span(t, A.say - .1, A.say + 1.45));
  function outerView(t) {
    const k = pushK(t), b = S.breathe(t), s = TOWN.s * Math.exp(Math.log(3.2) * k), ls = Math.pow(s, .75);
    const p0 = X.toScreen(X.layerView(TOWN, .75), WIN.x, WIN.y), px = lerp(p0[0], W / 2, k), py = lerp(p0[1], H / 2, k);   // the window glides to the centre
    const lx = WIN.x - (px - W / 2) / ls, ly = WIN.y - (py - H / 2) / ls;
    return { x: 960 + (lx - 960) / .75 + b.dx, y: 540 + (ly - 540) / .75 + b.dy, s };
  }
  function windowRect(t, vo) {
    const lv = X.layerView(vo, .75), [cx, cy] = X.toScreen(lv, WIN.x, WIN.y), w = WIN.w * lv.s, h = WIN.h * lv.s;
    const e = quartIO(span(t, A.say + .45, A.say + 1.5));
    return { x: lerp(cx - w / 2, 0, e), y: lerp(cy - h / 2, 0, e), w: lerp(w, W, e), h: lerp(h, H, e), e };
  }

  // ============================================================================================ the take
  function stage(ctx, t, v) {
    ground(ctx, t, v);
    X.inView(ctx, v, (s) => {
      if (t < A.y13 + 1) answers6(ctx, t, s);
      if (t < A.fear + 2) { dots6(ctx, t, s); pew6(ctx, t, s); answer8(ctx, t, s); }
      if (t > A.accept - .2 && t < A.fair + 1.8) lines10(ctx, t, s);
      if (t > A.channel - .5 && t < A.fair + 2) { lines7(ctx, t, s); tag7(ctx, t, s); }
      if (t < A.fair + 1.6) you67(ctx, t, s);
      if (t > A.fair && t < A.what + 1) { fair7(ctx, t, s); loop7(ctx, t, s); many7(ctx, t, s); }
      if (t > A.say) { scenario8(ctx, t, s); parents8(ctx, t, s); }
      if (t > A.inher - .5) { power9(ctx, t, s); star9(ctx, t, s); ledge9(ctx, t, s); }
    });
    if (t > A.aug - .2 && t < A.almost + .6) card9(ctx, t, 1);
    // screen-space texts
    if (t > A.almost && t < A.channel) F.source(ctx, t, A.almost + .4, A.channel - .3, SRC.natgeo);
    if (t > A.philo && t < A.othersA + .2) F.source(ctx, t, A.philo + .5, A.othersA, SRC.williams);
    if (t > A.othersA && t < A.what) F.source(ctx, t, A.othersA + .4, A.suppose + .6, SRC.fischer);
    X.label(ctx, SRC.scenario, W / 2, 168, lab(t, A.say + 1.1, A.promise - .2), { size: 30, spacing: .16 });
    if (t > A.five - .5 && t < A.parents) X.big(ctx, SRC.careers, W / 2, 330, 84, lab(t, A.five + .25, A.never + 1.5), { gold: 1 });
    if (t > A.london && t < clip.start + 1) F.source(ctx, t, A.london + .5, clip.start - .4, SRC.gratton);
    if (t > A.comes && t < A.own) F.source(ctx, t, A.comes + .3, A.gain + .6, SRC.fedea);
    if (t > A.planck - .2 && t < A.econ + .5) planck9(ctx, t);
    X.label(ctx, SRC.azoulay, W / 2, 132, lab(t, A.strong - .3, A.shows + .2), { size: 36, gold: 1 });
    if (t > A.strong - .5 && t < A.shows + .6) F.source(ctx, t, A.strong - .2, A.shows + .2, SRC.azoulaySrc);
    clip8(ctx, t, v);
  }
  function draw(ctx, t) {
    performanceT = t;
    if (t < tTwo) return S.plateTwoAnswers(ctx, t, T);
    if (t >= tPlate) return S.plateTop(ctx, t, T);
    // M.11: the lines sink, the hill rises (no cut); the town lights; 4.01 we fly into one lit window
    if (t > A.what - .6 && t < A.say + 1.5) {
      const vo = t < A.say - .1 ? view(t) : outerView(t);
      ground(ctx, t, vo);
      if (t < A.what + 1.2) X.inView(ctx, vo, (s) => { many7(ctx, t, s); });
      stone(ctx, t, vo);
      if (t > A.say + .45) {   // the window grows into the frame; inside it the next picture
        const R = windowRect(t, vo), k = Math.max(R.w / W, R.h / H);
        if (!OFF || OFF.width !== ctx.canvas.width) OFF = createCanvas(ctx.canvas.width, ctx.canvas.height);
        const oc = OFF.getContext('2d'); oc.setTransform(1, 0, 0, 1, 0, 0); oc.globalAlpha = 1; oc.globalCompositeOperation = 'source-over';
        stage(oc, t, view(t));
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
        ctx.drawImage(OFF, R.x + R.w / 2 - W * k / 2, R.y + R.h / 2 - H * k / 2, W * k, H * k);
        ctx.fillStyle = rgba(LAMP.body, .9 * (1 - span(R.e, 0, .4))); ctx.fillRect(R.x, R.y, R.w, R.h);
        ctx.restore();
        if (R.e < 1) { ctx.save(); ctx.strokeStyle = rgba(LAMP.core, .8 * (1 - R.e)); ctx.lineWidth = 3 + 10 * R.e; ctx.strokeRect(R.x, R.y, R.w, R.h); ctx.restore(); }
      }
      return;
    }
    stage(ctx, t, view(t));
  }
  const out = { A, draw, clip, tPlate, tTwo };
  CACHE.set(T, out);
  return out;
}
// entries for one chunk: the take is one draw function; the renderer cuts only between entries, and all four chunks share it
export function chunk(T, R) {
  const { draw } = take(T);
  return [{ t: R.a, draw, print: F.PRINT73 }];
}
