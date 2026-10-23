// Film 7 · c02 · "the part that feeds the machines" (01a), from the c01>c02 LINE plate to the c02>c03 SKY plate (night). Builder: c02.
// Two continuous takes joined by one fly-through (the quote card's paper → a plan page); every accent anchored to a word.
//
// | shot | VO words (anchor)                              | image                                                                                     | hero light        | camera                                   | flows on by                                        | ★ / sound                |
// |------|------------------------------------------------|-------------------------------------------------------------------------------------------|-------------------|------------------------------------------|----------------------------------------------------|--------------------------|
// | 2.01 | Four hundred years sounds safe.                | the plate's amber line lies on a calm night plain: an engraved TIMELINE (ticks per 25     | the line          | the plate band closes onto the line, the | take A continues                                   |                          |
// |      |                                                | years, 2025 · 2125 … 2425), a dimension bracket writes "400 YEARS" over it; far away       |                   | world rises around it; slow dolly right  |                                                    |                          |
// | 2.02 | But one part of that curve is growing much     | "faster": a branch peels up out of the line, runs over three pylons into a long low dark   | the DC's curve    | glide back to 2025, push in 2.5× onto    | continuous                                         | whoosh_up (pause)        |
// |      | faster … The part that feeds the machines.    | building; behind it, in the sky over the far ridge, a chart draws itself (engraved axes,  |                   | the data center                          |                                                    | bloom (pause)            |
// |      |                                                | graph grid, its own far parallax plane): the amber curve runs flat, then climbs steeply   |                   |                                          |                                                    |                          |
// |      |                                                | off the top (fix1: it never comes out of the building); "machines": the data center wakes |                   |                                          |                                                    |                          |
// |      |                                                | (vents glow, roof fans spin up, waste heat shimmers)                                       |                   |                                          |                                                    |                          |
// | 2.03 | By twenty thirty … about twice today's         | a second identical hall is built out of the ground panel by panel; on "twice" the power   | power line        | pull back to both halls, slow push       | continuous                                         |                          |
// |      | electricity.                                   | line doubles in width. 2× BY 2030 · IEA · ENERGY AND AI · 2025                            |                   |                                          |                                                    |                          |
// | 2.04 | Now here's the strange part. Every question    | a person on a near rise (from behind) with a glowing phone; each question leaves as a     | the spark         | crane left/down to the rise (parallax)   | continuous                                         |                          |
// |      | … thirty-fold in a single year.               | spark on an arc into the DC; on "thirty-fold" the spark in flight shrinks to a point.     |                   |                                          |                                                    |                          |
// |      |                                                | 33× LESS · GOOGLE · COMPANY FIGURE · 2025                                                 |                   |                                          |                                                    |                          |
// | 2.05 | So the total appetite should shrink. Right?    | the power line and the chart's curve thin and dim for a beat (suspense)                      | line              | pull back 1.2 s                          | continuous                                         |                          |
// | 2.06★| It doesn't. Economists call this the Jevons    | ★ "doesn't": windows light up over the hills and the plain in a wave, phones glint, a     | the curve swells  | a small push, then a slow push           | DOLLY BACK ALONG THE TIMELINE (2000 · 1950 · 1900) | swell (pause)            |
// |      | paradox. When something gets more efficient,   | stream of sparks pours into the DC, the line and the curve swell past their old width     |                   |                                          | to 1865: an engraved steam engine on its coal heap,| whoosh_airy (dolly)      |
// |      | we often end up using more of it. A British    | (burst). Title "The Jevons paradox". "more efficient … more of it": the sparks get tiny     |                   |                                          | the line starts thin at its fire; a small figure    |                          |
// |      | economist … coal and steam engines.            | and many. Then the camera runs back along the line to 1865. 1865 · W. S. JEVONS ·          |                   |                                          | with a book watches it                              |                          |
// |      |                                                | THE COAL QUESTION                                                                          |                   |                                          |                                                    |                          |
// | 2.07 | Microsoft's chief executive … Jevons paradox  | a cream quote card is carried up into the frame beside the engine; the four words light   | the card          | holds, slow push; then FLIES INTO the    | FLY-THROUGH: the card's blank paper fills the frame| card (pause)             |
// |      | strikes again.                                 | with the voice. SATYA NADELLA · MICROSOFT CEO · POST ON X · 27 JAN 2025                    |                   | card's blank corner (0.8 s)              | and is the paper of a plan page (same texture)     | whoosh + pages (pause)   |
// | 2.08 | Now you might say: nobody is promising forever.| pull back out of the paper: a plan page (engraved chart, its curve runs off the top); then | the pages, lit    | pull back, then TILT UP the stack 3.7 s, | the tilt comes to rest in the night sky: it IS the | whoosh_up (pause)        |
// |      | But look at the plans. No ceiling. Just        | the plans: a ladder of pages floating up into the night sky, on and on, no top, dwindling  | from the lit plain| decelerating to rest                      | c02>c03 SKY plate (same stars, offset → 0)         | whoosh_airy (end)        |
// |      | abundance.                                     | into the stars                                                                             |                   |                                          |                                                    |                          |
import { W, H, rgba, clamp, lin, mix, sm, text } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F7, f7Prepare, skyWarm, ease, keys, curve } from '../lib/f7_kit.mjs';
import { c2Prepare, gmap, frameAt, world, watcher, sheet, sheetTex, pageContent, pageImg, PAGE, skyP, FP, foreY, LY, HZ, DC, ENG, YX } from '../lib/f7_c02_world.mjs';

const PRINT = { riso: .25 };
const bump = (t, a, b, c, d) => sm(lin(a, b, t)) * (1 - sm(lin(c, d, t)));
// monotone cubic (Fritsch–Carlson) through timed keys [[t, [..]]]: smooth velocity, no overshoot; ends at rest
function pchip(t, K) {
  if (t <= K[0][0]) return K[0][1].slice(); const n = K.length; if (t >= K[n - 1][0]) return K[n - 1][1].slice();
  let i = 0; while (t > K[i + 1][0]) i++;
  return K[i][1].map((_, j) => {
    const d = (a) => (K[a + 1][1][j] - K[a][1][j]) / (K[a + 1][0] - K[a][0]), h = (a) => K[a + 1][0] - K[a][0];
    const m = (a) => { if (a === 0 || a === n - 1) return 0; const d0 = d(a - 1), d1 = d(a); if (d0 * d1 <= 0) return 0; const w1 = 2 * h(a) + h(a - 1), w2 = h(a) + 2 * h(a - 1); return (w1 + w2) / (w1 / d0 + w2 / d1); };
    const hh = h(i), u = (t - K[i][0]) / hh, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * K[i][1][j] + (u3 - 2 * u2 + u) * hh * m(i) + (-2 * u3 + 3 * u2) * K[i + 1][1][j] + (u3 - u2) * hh * m(i + 1);
  });
}
const camK = (c) => [c.x, c.y, Math.log(c.z)];
const unK = (v) => ({ x: v[0], y: v[1], z: Math.exp(v[2]) });

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c02', T);
  const S = (p, n) => T.S('01a', p, n), E = (p, n) => T.E('01a', p, n);
  const A = {
    four: S('Four hundred'), safe: S('safe'), safeE: E('safe'), but: S('But one'), faster: S('faster'), rest: E('rest'), thePart: S('The part that'), machines: S('machines'), machinesE: E('machines'),
    by: S('By twenty'), iea: S('International'), twice: S('twice'), elecE: E('electricity'), now: S("Now here's"), every: S('Every question'), question: S('question'), cheaper: S('cheaper'),
    google: S('Google'), prompt: S('prompt'), thirty: S('thirty-fold'), yearE: E('single year'), so: S('So the total'), shrink: S('shrink'), right: S('Right'), rightE: E('Right'),
    it: S("It doesn't"), doesnt: S("doesn't"), doesntE: E("It doesn't"), economists: S('Economists'), jevons: S('Jevons paradox'), when: S('When something'), itE: E('of it'),
    british: S('A British'), coal: S('coal'), enginesE: E('steam engines'), microsoft: S("Microsoft's"), satya: S('Satya'), wordsE: E('four words'), jev2: S('Jevons paradox strikes'), againE: E('strikes again'),
    nowYou: S('Now you'), nobody: S('nobody'), foreverE: E('promising forever'), look: S('But look'), plansE: E('the plans'), noC: S('No ceiling'), ceilingE: E('No ceiling'), just: S('Just abundance'), abundanceE: E('Just abundance'),
  };
  const tb = HI.b, ta = HO.a;
  const tm = Math.round((A.nowYou - .06) * 30) / 30;   // the fly-through frame (paper fills the frame): card → plan page
  const tp0 = tm - .8;                                   // the push into the card starts

  // ============================================================== take A: the plain, the timeline, the data center, the engine, the card
  const C0 = { x: 1200, y: LY - 20 / .7, z: .7 };          // the line at screen y 560, like the plate
  const C4 = frameAt(352, 585, 1380, 600, 1.45);            // the person's view (2.04)
  const ENGC = frameAt(ENG.x - 10, 600, 400, 650, 2.6);     // the engine (2.06 tail, 2.07)
  const KA = [
    [tb, C0], [A.safeE + .5, { x: 1330, y: C0.y - 5, z: .72 }],
    [A.faster - .1, frameAt(185, 580, 470, 650, 1.0)], [A.rest + .4, { x: 505, y: 472, z: 1.06 }],
    [A.machinesE + .45, frameAt(185, 580, 900, 640, 2.5)], [A.by + .4, { x: 214, y: 540, z: 2.58 }],
    [A.iea + .9, frameAt(352, 585, 1000, 640, 1.9)], [A.elecE + .5, { x: 337, y: 532, z: 2.0 }],
    [A.every - .2, C4], [A.yearE, { x: C4.x + 6, y: C4.y + 1.5, z: 1.55 }],
    [A.rightE + .25, { x: C4.x + 10, y: 541, z: 1.24 }], [A.doesnt + .55, { x: C4.x + 14, y: 538, z: 1.32 }], [A.itE + .25, { x: C4.x + 24, y: 540, z: 1.4 }],
    [A.british + 1.75, ENGC], [A.againE, { x: ENGC.x + 10, y: ENGC.y, z: 2.72 }],
  ].map(([t, c]) => [t, camK(c)]);
  const camA = (t) => {
    const c = unK(pchip(t, KA));
    // the plate's line breathes ±2 px: hold the line on it while the world opens, then let go
    const f = 1 - sm(lin(tb, tb + 1.6, t)); c.y -= 2 * Math.sin(t * .9) * f / c.z;
    // the push into the card: the world (far behind the card) comes only a little closer
    const u = lin(tp0, tm, t); if (u > 0) c.z *= mix(1, 1.35, ease.io(u));
    return c;
  };
  // the person on the near rise: feet at screen (430, 850) in the 2.04 view
  const m4 = gmap(C4, FP), PX = m4.Xi(330), PY0 = m4.Yi(850);
  await f7Prepare(); await c2Prepare({ x: PX, y: PY0 });
  const PY = foreY(PX) + 2;
  const sparks = [
    { t0: A.question - .15, dur: 1.7, r0: 14 }, { t0: A.cheaper - .05, dur: 1.7, r0: 12.5 }, { t0: A.google + .25, dur: 1.7, r0: 11 },
    { t0: A.thirty - .75, dur: 2.1, r0: 11, ts: A.thirty, r1: 1.1 }, { t0: A.thirty + .55, dur: 1.4, r0: .9 }, { t0: A.yearE - .4, dur: 1.4, r0: .9 }, { t0: A.so + .2, dur: 1.4, r0: .9 },
  ];
  const stA = (t) => {
    const twice = ease.out(lin(A.twice, A.twice + .5, t)), dip = bump(t, A.shrink - .25, A.shrink + .5, A.doesnt - .12, A.doesnt + .08), swell = ease.out(lin(A.doesnt, A.doesnt + .7, t));
    const write = ease.io(lin(A.four - .2, A.safe + .2, t)), wipe = ease.inn(lin(A.but + .9, A.faster - .2, t));
    return {
      ticksA: sm(lin(tb + .2, A.four + .6, t)) * (1 - sm(lin(A.but + 1.2, A.faster - .1, t))), bracket: write * (1 - wipe),
      ticksR: sm(lin(A.itE + .3, A.british + 1.6, t)),
      feedU: ease.out(lin(A.faster - .2, A.faster + .5, t)), chartAx: lin(A.faster - .35, A.faster + .55, t), climbU: lin(A.faster, A.faster + 1.6, t) ** 2,   // accelerating: the visible rise takes ~.7 s, the tip leaves the top fast
      feedW: (1 + .7 * twice) * (1 - .3 * dip) * (1 + .3 * swell), feedBr: (1 + .2 * twice) * (1 - .3 * dip) * (1 + .25 * swell),
      climbW: (1 + .35 * twice) * (1 - .25 * dip) * (1 + .55 * swell), climbBr: (1 + .15 * twice) * (1 - .35 * dip) * (1 + .3 * swell), climbSparks: 3 + 6 * swell, burst: t > A.doesnt ? A.doesnt + .03 : null,
      lineW: (1 - .15 * dip) * (1 + .4 * swell), lineBr: (1 - .25 * dip) * (1 + .2 * swell),
      dcOn: sm(lin(A.machines - .35, A.machines + .5, t)), hall2: lin(A.iea - .3, A.iea + 2.3, t),
      lights: lin(A.doesnt - .05, A.doesnt + 1.7, t), stream: ease.out(lin(A.doesnt + .05, A.doesnt + 1.4, t)) * mix(.45, 1, sm(lin(A.when, A.itE, t))), streamTiny: sm(lin(A.when, A.itE, t)), streamT0: A.doesnt,
      person: { x: PX, y: PY, s: .87, sparks },
    };
  };
  function label(ctx, t, big, small, x, y, t0, t1, size = 76) {
    const a = ease.out(lin(t0, t0 + .6, t)), b = ease.io(lin(t1 - .45, t1, t)); if (a <= 0 || b >= 1) return; // exit: quart in-out wipe (expo-in left a tail that popped off on the last frame)
    const sm2 = Array.isArray(small) ? small : [small];
    ctx.save(); ctx.font = `${size}px "Instrument Serif"`; const bw = ctx.measureText(big).width; ctx.font = '600 18px Inter'; const sw = sm2.map((s) => ctx.measureText(s).width + s.length * 4); ctx.restore();
    const wv = Math.max(bw, ...sw) * 1.1 + 60, hh = size * .9 + 40 + sm2.length * 30;
    const xl = x - 10 + wv * b, xr = a < 1 ? x - 10 + wv * a : W + 10; // exit wipe runs off to the frame edge, so no tail can remain
    ctx.save(); ctx.beginPath(); ctx.rect(xl, y - size * 1.05, xr - xl, hh + 30); ctx.clip();
    text(ctx, big, x, y, { size, font: 'Instrument Serif', color: '#f6efdc' });
    sm2.forEach((s, i) => text(ctx, s, x + 2, y + 44 + i * 28, { size: 18, weight: 600, color: rgba('#cfd6ee', .9), spacing: 4 }));
    ctx.restore();
    ctx.fillStyle = rgba(F7.amber, .9); ctx.fillRect(x - 24, y - size * .82, 3, (size * .82 + 30 + sm2.length * 28) * (a - b));
  }
  // ---- the quote card (paper units = px at k 1): 1040 × 520, its blank focus at (900, 430) is where the camera flies in
  const QC = { w: 1040, h: 520, fx: 900, fy: 430 };
  const qWords = T.W('01a', 'Jevons paradox strikes', 'again');
  const cardIn = (t) => { const x = lin(A.microsoft - .6, A.microsoft + .6, t); return 1 - Math.pow(1 - x, 3); };
  function cardM(t) {
    const u = cardIn(t), up = lin(tp0, tm, t), e = ease.io(up) * .7 + .3 * up * up;
    const rot0 = mix(-.085, -.016, ease.out(lin(A.microsoft - .45, A.microsoft + .75, t))) + .003 * Math.sin(t * .7), cx = 1310, cy = 455 + (1 - u) * 900 + 2 * Math.sin(t * .9);
    const rot = mix(rot0, 0, ease.io(up));
    // the display focus point (card at k = 1), then the push: k 1 → 9, the focus glides to the frame centre
    const fx0 = cx + Math.cos(rot) * (QC.fx - QC.w / 2) - Math.sin(rot) * (QC.fy - QC.h / 2), fy0 = cy + Math.sin(rot) * (QC.fx - QC.w / 2) + Math.cos(rot) * (QC.fy - QC.h / 2);
    const k = Math.exp(Math.log(9) * e), g = (k - 1) / 8;
    return { cx: mix(fx0, W / 2, g), cy: mix(fy0, H / 2, g), k, rot };
  }
  function quoteContent(ctx, t) {
    return (g) => {
      text(g, '“', 58, 200, { size: 170, font: 'Instrument Serif', color: rgba('#b8661f', .85) });
      g.font = '68px "Instrument Serif"'; let x = 132; const y = 214, sp = g.measureText(' ').width;
      for (const wd0 of qWords) { const wd = /^again/i.test(wd0.w) ? { ...wd0, w: 'again!' } : wd0, lit = sm(lin(wd.s - .06, wd.s + .2, t)), ww = g.measureText(wd.w).width; text(g, wd.w, x, y, { size: 68, font: 'Instrument Serif', color: rgba('#2a2420', mix(.32, 1, lit)) }); g.font = '68px "Instrument Serif"'; x += ww + sp; }
      g.strokeStyle = 'rgba(42,36,32,.45)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(136, 262); g.lineTo(420, 262); g.stroke();
      text(g, 'Satya Nadella', 134, 330, { size: 42, font: 'Instrument Serif', color: '#2a2420' });
      text(g, 'MICROSOFT CEO · POST ON X · 27 JAN 2025', 136, 372, { size: 17, weight: 600, color: 'rgba(42,36,32,.72)', spacing: 3 });
    };
  }
  const covers = (M, w, h, fx, fy, pad = 12) => {
    const c = Math.cos(-(M.rot || 0)), s = Math.sin(-(M.rot || 0));
    for (const [X, Y] of [[0, 0], [W, 0], [0, H], [W, H]]) { const dx = (X - M.cx) / M.k, dy = (Y - M.cy) / M.k, px = dx * c - dy * s + fx, py = dx * s + dy * c + fy; if (px < pad || px > w - pad || py < pad || py > h - pad) return false; }
    return true;
  };
  function takeA(ctx, t) {
    const M = t > A.microsoft - .6 ? cardM(t) : null;
    if (!(M && covers(M, QC.w, QC.h, QC.fx, QC.fy))) {
      const cam = camA(t), st = stA(t), out = world(ctx, t, cam, st);
      if (t > A.british && t < tm) watcher(ctx, t, out.m);
      // the plate-in: the world rises around the line (the plate band closes onto it, the night lifts)
      if (t < tb + 1.6) {
        const dk = 1 - sm(lin(tb + .25, tb + 1.5, t));
        if (dk > 0) { ctx.fillStyle = rgba('#0a0c22', .8 * dk); ctx.fillRect(0, 0, W, H); }
        const e = ease.out(lin(tb, tb + .75, t));
        if (e < 1) {
          const yl = 560 + 2 * Math.sin(t * .9), up = mix(yl + 4, 2, e), dn = mix(H - yl + 4, 2, e);
          ctx.save(); ctx.beginPath(); ctx.rect(-2, yl - up, W + 4, up + dn); ctx.clip(); HI.plate(ctx, t); ctx.restore();
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const yy of [yl - up, yl + dn]) for (const [lw, al] of [[14, .05], [2, .3]]) { ctx.strokeStyle = rgba('#a89cf0', al * e * (1 - e) * 4); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke(); } ctx.restore();
        }
      }
      label(ctx, t, '2× by 2030', 'DATA CENTER ELECTRICITY · IEA · ENERGY AND AI · 2025', 150, 300, A.iea - .25, A.now);
      label(ctx, t, '33× less', ['ENERGY PER TYPICAL TEXT PROMPT · IN ONE YEAR', 'GOOGLE · COMPANY FIGURE · 2025'], 150, 300, A.thirty - .15, A.right - .1);
      label(ctx, t, 'The Jevons paradox', [], 150, 300, A.jevons - .1, A.british - .1, 92);
      label(ctx, t, '1865', 'W. S. JEVONS · THE COAL QUESTION', 150, 300, A.british + 1.45, A.satya - .2);
    }
    if (M) sheet(ctx, t, M, { w: QC.w, h: QC.h, fx: QC.fx, fy: QC.fy, seed: 21, lift: 30, content: quoteContent(ctx, t) });
  }

  // ============================================================== take B: out of a plan page, the ladder of plans, tilt into the night
  const SX = 2250, SB = 628, NS = 64;
  const SH = (() => { const o = []; let y = 0; for (let i = 0; i < NS; i++) { const s = Math.pow(.955, i), ws = 130 * s, hs = 178 * s; if (i === 0) y = SB - hs / 2 - 6; else y -= .72 * (hs + o[i - 1].hs) / 2; o.push({ i, s, ws, hs, x: SX + (i % 2 ? 1 : -1) * 22 * s + 6 * Math.sin(i * 1.9) * s, y, rot: (i % 2 ? .035 : -.03) + .012 * Math.sin(i * 2.1), seed: (i % 4) + 1 }); } return o; })();
  const VP = SH[NS - 1].y;
  const LADS = [[SX - 760, .62, 7], [SX + 640, .74, 3], [SX - 1350, .48, 11], [SX + 1250, .55, 5]].map(([x0, sc, sd]) => SH.map((P) => ({ ...P, i: P.i + sd * 7, x: x0 + (P.x - SX) * sc, y: SB - (SB - P.y) * sc, ws: P.ws * sc, hs: P.hs * sc, s: P.s * sc, seed: ((P.seed + sd) % 4) + 1 })));
  const J = 1, KM = 9;                                     // the page we fly out of; screen px per paper unit at the fly-through
  const pose = (P, t) => {
    const settle = P.i === J ? ease.out(lin(tm, tm + 1.7, t)) : 1, bob = 2.2 * P.s * Math.sin(t * .8 + P.i * 1.3) * settle;
    return { x: P.x, y: P.y + bob, rot: (P.rot + .012 * Math.sin(t * .6 + P.i * 1.7)) * settle };
  };
  const pageM = (P, cam, t) => {
    const p = pose(P, t), m = gmap(cam, 1), sc = P.ws / PAGE.w, c = Math.cos(p.rot), s = Math.sin(p.rot), dx = (PAGE.fx - PAGE.w / 2) * sc, dy = (PAGE.fy - PAGE.h / 2) * sc;
    return { cx: m.X(p.x + dx * c - dy * s), cy: m.Y(p.y + dx * s + dy * c), k: sc * m.k, rot: p.rot };
  };
  const FJ = (() => { const p = pose(SH[J], tm), sc = SH[J].ws / PAGE.w; return { x: p.x + (PAGE.fx - PAGE.w / 2) * sc, y: p.y + (PAGE.fy - PAGE.h / 2) * sc }; })();
  const zm = KM * PAGE.w / SH[J].ws;
  const tEnd = ta - 1 / 30, yEnd = VP - 1050;
  const KB = [
    [tm, { x: FJ.x, y: FJ.y, z: zm }], [tm + 2.5, { x: SH[J].x + 2, y: SH[J].y + 4, z: 5.2 }], [A.look - .15, { x: SH[J].x + 4, y: SH[J].y - 8, z: 4.4 }],
    [A.noC - .1, { x: SX + 10, y: 250, z: 1.4 }], [A.just + .2, { x: SX + 5, y: -800, z: .9 }], [tEnd, { x: SX, y: yEnd, z: .62 }],
  ].map(([t, c]) => [t, camK(c)]);
  const camB = (t) => unK(pchip(t, KB));
  const skyOy = (cam) => -(cam.y - yEnd) * cam.z * .32;
  const stB = { lights: 1, dcOn: 1, feedU: 1, hall2: 1, climbU: 0, feedW: 1.9, lineW: 1.3, engine: 0, skyFn: (ctx, t, cam) => skyP(ctx, t, skyOy(cam)) };
  function takeB(ctx, t) {
    const cam = camB(Math.min(t, tEnd)), MJ = pageM(SH[J], cam, t);
    const coveredJ = covers(MJ, PAGE.w, PAGE.h, PAGE.fx, PAGE.fy);
    if (!coveredJ) world(ctx, t, cam, stB);
    else { skyP(ctx, t, skyOy(cam)); }
    const m = gmap(cam, 1);
    // the other plans: more ladders farther away (small, cached faces)
    if (!coveredJ) for (const LD of LADS) for (let i = NS - 1; i >= 0; i--) {
      const P = LD[i], p = pose(P, t), sw = P.ws * m.k; if (sw < 1.2) continue;
      const X = m.X(p.x), Y = m.Y(p.y); if (X < -sw * 2 || X > W + sw * 2 || Y < -sw * 3 || Y > H + sw * 3) continue;
      const dim = clamp(1.25 - P.s * 1.4) * .9 + .12;
      ctx.save(); ctx.translate(X, Y); ctx.rotate(p.rot); const hw = sw / 2, hh = P.hs * m.k / 2;
      ctx.drawImage(pageImg(P.seed), -hw, -hh, 2 * hw, 2 * hh);
      const gl = ctx.createLinearGradient(0, hh, 0, -hh); gl.addColorStop(0, rgba('#ffb35c', .1)); gl.addColorStop(1, rgba('#1a1840', clamp(.2 + dim))); ctx.fillStyle = gl; ctx.fillRect(-hw, -hh, 2 * hw, 2 * hh);
      ctx.restore();
    }
    // the ladder of plans, far to near
    for (const i of [...Array(NS).keys()].reverse().filter((k) => k !== J).concat([J])) {
      const P = SH[i], p = pose(P, t), sw = P.ws * m.k; if (sw < 1.2) continue;
      const X = m.X(p.x), Y = m.Y(p.y); if (X < -sw * 2 || X > W + sw * 2 || Y < -sw * 3 || Y > H + sw * 3) continue;
      if (coveredJ && i !== J) continue;
      const dim = clamp(1.25 - P.s * 1.4) * .9;
      if (sw > 420 || i === J && t < tm + .2) {
        const M = i === J ? MJ : pageM(P, cam, t);
        sheet(ctx, t, M, { w: PAGE.w, h: PAGE.h, fx: PAGE.fx, fy: PAGE.fy, seed: 40 + i, shadow: false, content: (g, w, h) => pageContent(g, w, h, P.seed),
          light: (g) => { const lt = i === J ? sm(lin(tm, tm + 1.4, t)) : 1; if (lt <= 0) return; const gl = g.createLinearGradient(0, Y + P.hs * m.k * .6, 0, Y - P.hs * m.k * .6); gl.addColorStop(0, rgba('#ffb35c', .14 * lt)); gl.addColorStop(1, rgba('#1a1840', (.1 + dim) * lt)); g.fillStyle = gl; g.fillRect(0, 0, W, H); } });
      } else {
        ctx.save(); ctx.translate(X, Y); ctx.rotate(p.rot); const hw = sw / 2, hh = P.hs * m.k / 2;
        ctx.drawImage(pageImg(P.seed), -hw, -hh, 2 * hw, 2 * hh);
        const gl = ctx.createLinearGradient(0, hh, 0, -hh); gl.addColorStop(0, rgba('#ffb35c', .14)); gl.addColorStop(1, rgba('#1a1840', .1 + dim)); ctx.fillStyle = gl; ctx.fillRect(-hw, -hh, 2 * hw, 2 * hh);
        ctx.strokeStyle = rgba('#ffcf96', .25 * (1 - dim)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-hw, hh); ctx.lineTo(hw, hh); ctx.stroke();
        ctx.restore();
      }
    }
  }

  // pre-build the rotated sky for every offset take A uses (sky() then only translates an image)
  { const off = []; for (let f = Math.ceil(tb * 30); f / 30 < tm; f++) { const c = camA(f / 30); off.push([-(c.x) * .05 + 600, -(c.y - 540) * .06 - 260]); } await skyWarm(-.62, off); }

  const draw = (ctx, t) => (t < tm ? takeA(ctx, t) : takeB(ctx, t));
  return [
    { t: tb, tr: 'cut', d: .1, draw, print: HI.print },
    { t: A.but, draw, print: PRINT, sound: [{ f: 'whoosh_up', t: A.rest + .05, v: .35 }, { f: 'bloom', t: A.machinesE + .05, v: .35 }, ...sparks.slice(0, 4).map((k) => ({ f: 'spark_tick', t: k.t0 + .15, v: .18 }))] },
    { t: A.now, draw, print: PRINT },
    { t: A.right, draw, print: PRINT, sound: [{ f: 'swell', t: A.doesntE + .05, v: .45 }, { f: 'whoosh_airy', t: A.itE + .05, v: .3 }, { f: 'steam_hiss', t: A.british + 1.25, v: .22 }] },
    { t: A.enginesE, draw, print: PRINT, sound: [{ f: 'card', t: A.microsoft - .3, v: .35 }, { f: 'whoosh', t: tm - .55, v: .3 }, { f: 'pages', t: tm - .12, v: .25 }] },
    { t: A.look, draw, print: HO.print, sound: [{ f: 'whoosh_up', t: A.ceilingE + .05, v: .35 }, { f: 'whoosh_airy', t: A.abundanceE + .1, v: .25 }] },
  ];
};
