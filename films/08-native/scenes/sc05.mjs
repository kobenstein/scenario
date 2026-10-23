// Film 8 · chunk c05 · 04a + Q2 + 04b "IV · One person" (shots 4.01–4.18, Q2; 217.01–287.97 s). Builder: B1.
// Acts (one continuous film, no cut inside the chunk; hand-overs only where one full-frame surface covers the frame):
//   A 217.01–219.75  the c04 stage, tilt down from the sky plate; the ghosts blow away; her amber light blooms over the frame
//   B 219.75–229.9   the anatomy plate (kit) pulls back out of that light; the organs close; the walls lower; the paper slides off in strips
//   C 228.6–246.9    the workshop in a wide landscape (blue hour → night); org chart, ghost office, towers with reflections; the memo
//   E 246.9–260.7    the huge night; the hill edge becomes the Austin skyline (dusk); three people, ≈ $300, twelve fireflies
//   F 260.7–268.96   night, a figure on a hill, the dotted ghost workshop; push into its door light → cream paper
//   G 268.96–275.1   card Q2 in the sky (its paper IS the paper light); the digits lift off, the card frays away
//   H 275.1–287.97   2026 in the night sky; PREDICTION; the burin engraves the workshop solid; a firefly flies into the lens (plate)
//
// | shot | VO (accent)                                  | image                                                                   | hero light       | camera                          | flow into next                    | ★ | sound            |
// |------|----------------------------------------------|-------------------------------------------------------------------------|------------------|---------------------------------|-----------------------------------|---|------------------|
// | in   | (plate c04>c05, night sky)                   | the frame IS the sky; tilt down                                          | stars            | tilt + push 217.01–219.6        | take                              |   |                  |
// | 4.01 | Maybe only **one**.                          | the dotted ghosts blow away like smoke, one by one; she stays in amber  | amber            | (same move)                     | her light blooms over the frame   |   | gust 217.9       |
// | 4.02 | …**together**.                               | the anatomy plate, out of her light; the organs settle into place       | the will glow    | glow contracts 219.75–220.9     | take                              |   | tone 220.6       |
// | 4.03 | …forgets **nothing**.                        | the memory glows as the back layer; a last thread stitches in           | gold             | still                           | take                              |   | foil_glint 223.0 |
// | 4.04 | …**never sleep**.                            | the fireflies draw a path round, it closes into a ring                  | green            | still                           | take                              |   |                  |
// | 4.05 | And one will in **front**.                   | she steps forward, lifts her hand, the ring turns to her                | amber            | still                           | the walls lower                   |   |                  |
// | 4.06 | …a **whole company**.                        | the walls lower in layers, the paper slides off in strips: the workshop | windows          | pull back 229.6–231.8           | take                              | ★ | whoosh_airy 229.7|
// |      |                                              | stands in a wide landscape at blue hour, fireflies round the roof       |                  |                                 |                                   |   |                  |
// | 4.07 | No **departments**. No **layers**.           | an engraved org chart in the sky drops its boxes; a ghost office's      | —                | hold, then push 232.7–234.6     | take                              |   | paper_pop 231.2  |
// |      |                                              | storeys peel off one by one                                             |                  |                                 |                                   |   |                  |
// | 4.08 | …someone who **wants** something.            | close: weave in the windows, fireflies on the roof, she in the door    | the door         | push, hold                      | pull back to the horizon          |   |                  |
// | 4.09 | …already **leaning** this way.               | towers on the horizon: floors go dark, threads glow in their place;    | threads          | pull back 235.9–238.2           | a sheet glides in from above      |   |                  |
// |      |                                              | their reflections lean toward the workshop                             |                  |                                 |                                   |   |                  |
// | 4.10 | …has to **show why**…                        | the memo (paperMemo): typed rule, ink underline, source                | paper            | drift                           | the memo slides away left         |   | pages 239.6      |
// | 4.11 | …is **tiny**.                                | huge night; the workshop is a spark                                     | one light        | pull back 246.0–250.2           | the hill edge becomes a skyline   |   |                  |
// | 4.12 | …**three hundred dollars**.                  | Austin at dusk; three people on a hill, one carries a box; ≈ $300 tag  | dusk             | to the hill 249.9–252.4         | take                              |   | stamp 254.45     |
// | 4.13 | …**twelve agents**.                          | twelve fireflies count in round them; 3 PEOPLE · 12 AGENTS              | green            | slow                            | pan to the empty horizon          |   | tick 256.4       |
// | 4.14 | …would **appear**.                           | night; a figure on a hill from behind; a dotted ghost workshop + tower  | the door light   | pan 259.8–262.4, push 266.9–268.96 | into the door light: the card  |   | card 269.0       |
// |      |                                              | shadow; DARIO AMODEI · runs Anthropic; it flickers on "appear"          |                  |                                 |                                   |   |                  |
// | Q2   | (no VO)                                      | "2026." on the letterpress card; DARIO AMODEI · MAY 2025; the note      | paper            | pull back out of the paper      | the digits lift off               |   |                  |
// | 4.15 | Twenty **twenty-six**.                       | the digits stand in the night sky over the ghost workshop               | the digits       | pull back 274.4–276.8           | take                              |   | swell 275.1      |
// | 4.16 | …**nobody** has done it yet.                 | the ghost workshop stays dotted, wind; PREDICTION; the door is empty    | —                | slow drift                      | take                              |   |                  |
// | 4.17 | …how it could be **possible**.               | a burin of light runs over the dots, the workshop engraves solid;       | the burin        | slow push                       | take                              | ★ | shimmer 284.1    |
// |      |                                              | MEMORY · HANDS · WILL flash once                                        |                  |                                 |                                   |   |                  |
// | 4.18 | So does it actually **work**?                | a firefly lifts off the roof and flies at the camera; its glow fills    | the firefly      | (the firefly comes to us)       | plate c05>c06 (firefly light)     |   | wings 285.3      |
import { W, H, rgba, clamp, mix, sm, eio, prng, text } from '../engine.mjs';
import { handsOf, plate } from '../lib/handoff4.mjs';
import { ready, F8, firefly, weave, workshop, anatomyPlate, plateGround, eoutX, einX, qio } from '../lib/f8_kit.mjs';
import { glowFrom, nameLabel } from '../lib/f8_c02_world.mjs';
import { quoteCard, cardsReady } from '../lib/f8_cards.mjs';
import { paperMemo, memoReady } from '../lib/f8_memo.mjs';
import { S, smallFigure } from '../lib/f8_c03_world.mjs';
import { sine, bump, WV, FIG0, FS, SW, camKeys, drawFig, ghostFig, lightCircle, capsLabel, stageLand } from '../lib/f8_c04_world.mjs';

const TAU = Math.PI * 2;
const lerpHex = (a, b, u) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), f = (s) => Math.round(mix((pa >> s) & 255, (pb >> s) & 255, clamp(u))); return `rgb(${f(16)},${f(8)},${f(0)})`; };
const hex3 = (n, b, d, wb, wd) => { const x = lerpHex(n, b, wb); const m = x.match(/\d+/g).map(Number), pd = parseInt(d.slice(1), 16), dd = [(pd >> 16) & 255, (pd >> 8) & 255, pd & 255]; return `rgb(${m.map((v, i) => Math.round(mix(v, dd[i], clamp(wd)))).join(',')})`; };

export default async (T) => {
  const { in: HI, out: HO } = handsOf('c05', T);
  const S4 = (p, n) => T.S('04a', p, n), S5 = (p, n) => T.S('04b', p, n);
  const A = {
    maybe: S4('Maybe'), one: S4('one.'), put: S4('Put'), together: S4('together.'), aMem: S4('A memory'), nothing: S4('nothing.'), handsT: S4('Hands'), never: S4('never sleep'),
    andOne: S4('And one'), front: S4('front.'), inP: S4('In principle'), whole: S4('whole company'), noD: S4('No departments'), dep: S4('departments.'), layers: S4('layers.'),
    aMem2: S4('A memory,'), wants: S4('wants'), big: S4('Big'), leaning: S4('leaning'), atS: S4('At Shopify'), show: S4('show why'), but: S4('But the purest'), tiny: S4('tiny.'),
    inA: S4('In Austin'), austin: S4('Austin,'), three: S4('three hundred'), spring: S4('This spring'), twelve: S4('twelve agents'), andD: S4('And Dario'), dario: S4('Dario'), appear: S4('appear.'),
    twenty: S5('Twenty'), t26: S5('twenty-six.'), its: S5("It's"), pred: S5('prediction,'), nobody: S5('nobody'), butNow: S5('But now'), possible: S5('possible.'), so: S5('So does'), work: S5('work?'),
  };
  const Q2 = T.clip('Q2');
  const TB = HI.b, TE = HO.a;   // 217.01 … 287.97

  // ================================================================ places
  const WSW = [1010, 830], WSK = 1;                              // the workshop (acts B/C)
  const TOW = [[1660, 120, 520], [1850, 160, 760], [2060, 140, 640], [2290, 180, 880], [2510, 130, 560]];   // towers: x, w, h (Z 2400)
  const TZ = 2400, SHORE = 700;
  const HILL_A = 4000, HILL_D = 5600;                            // Austin's hill, Dario's hill
  const GWS = [5660, 612], GWK = 1.6;                            // the ghost workshop
  const CARD2 = [5640, 300], CS2 = .5;                           // the card Q2 in the sky
  const hillY = (x) => 830 - 150 * Math.exp(-Math.pow((x - HILL_A) / 430, 2)) - 160 * Math.exp(-Math.pow((x - HILL_D) / 470, 2));

  // ================================================================ act timing
  const tBloom0 = 218.05, tB = 219.75, tGlowIn1 = 221.5, tPeel0 = A.inP + .15, tClose0 = A.inP, tWide0 = A.whole - .1;
  const tMemoIn0 = 239.45, tMemoIn1 = 240.65, tMemoOut0 = 245.55, tMemoOut1 = 246.9;
  const tDoor0 = 266.9, tSwitch2 = Q2.start, tReadK = tSwitch2 + 2.6, tPull0 = 274.4, tPull1 = 276.8;
  const tBurin0 = A.butNow + .1, tBurin1 = A.possible - .1, tFly0 = A.so + .1, tFly1 = TE - 1 / 30;

  // ================================================================ cameras
  let KEYS = null, TGT2 = null, DIG = null;
  const doorW = (() => { const k = GWK; return { x: GWS[0] + 92 * k, y: GWS[1] - 46 * k, w: 18 * k, h: 46 * k }; })();
  const kDoor = 1.25 * W / doorW.w;
  const K = () => [
    // act A: the c04 stage (same world as c04)
    { t: TB, x: 1010, y: -905, k: .63 },
    { t: 219.55, x: 1010, y: 735, k: 3.0 },
    // act B/C: the workshop (WSW at screen (960, 780) at k 2.6)
    { t: 219.56, x: 1010, y: 830 - 240 / 2.6, k: 2.6 },
    { t: tWide0, x: 1010, y: 830 - 238 / 2.6, k: 2.62 },
    { t: tWide0 + 2.2, x: 1060, y: 560, k: .72 },               // 4.06 ★ wide
    { t: 232.7, x: 1066, y: 562, k: .73 },
    { t: 234.6, x: 1010, y: 790, k: 3.0 },                      // 4.08 close
    { t: 235.9, x: 1012, y: 788, k: 3.05 },
    { t: 238.2, x: 1700, y: 600, k: .62 },                      // 4.09 the horizon
    { t: 245.9, x: 1660, y: 610, k: .66 },
    { t: 248.3, x: 1100, y: 620, k: .14 },                      // 4.11 huge
    { t: 250.0, x: 1500, y: 640, k: .07 },                      // tiny: a spark
    { t: 252.4, x: HILL_A, y: 640, k: .9 },                     // 4.12 Austin (the far ridge became the skyline)
    { t: 259.8, x: HILL_A + 20, y: 636, k: .95 },
    { t: 262.4, x: HILL_D + 40, y: 560, k: .95 },               // 4.14 the empty horizon
    { t: tDoor0, x: HILL_D + 50, y: 552, k: 1.02 },
    { t: tSwitch2 - .001, x: doorW.x + doorW.w / 2, y: doorW.y + doorW.h * .42, k: kDoor, e: (x) => (1 - Math.cos(Math.PI * Math.pow(clamp(x), 1.3))) / 2 },
    // act G: the card (CARD2) — the frame is the paper here, so the camera may stand anywhere on it
    { t: tSwitch2, x: CARD2[0] + TGT2[0] * CS2, y: CARD2[1] + TGT2[1] * CS2, k: kDoor },
    { t: tReadK, x: CARD2[0], y: CARD2[1] + 10, k: 2.05, e: (x) => 1 - Math.pow(1 - clamp(x), 2.4) },
    { t: tPull0, x: CARD2[0], y: CARD2[1] + 12, k: 2.1 },
    { t: tPull1, x: HILL_D + 40, y: 470, k: .8 },               // 4.15 the digits in the sky, the ghost workshop below
    { t: 281.6, x: HILL_D + 52, y: 478, k: .84 },
    { t: 285.0, x: GWS[0] + 10, y: 540, k: 1.25 },              // 4.17 ★ slow push
    { t: TE, x: GWS[0] + 12, y: 536, k: 1.32 },
  ];
  const cam = (t) => camKeys(KEYS, t);
  const kf = (c) => Math.pow(c.k, .5);

  // ================================================================ act A: the c04 stage (it must look as c04 left it)
  const R = Array.from({ length: 26 }, (_, i) => { const r = prng(400 + i * 13); return [r(), r(), r(), r(), r(), r()]; });
  const lanePos = (i, t) => { const j = i % 3, col = Math.floor(i / 3), u = (col + .5) / 9 - .5, wob = (1 - .7 * .6) * 7; return [SW[0] + u * 760 + wob * Math.sin(t * 1.7 + i), SW[1] + 70 - j * 72 + u * u * 230 + wob * Math.cos(t * 1.3 + i * 2)]; };
  const GHO = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8, -8];
  const amber = (g, tt) => plate(g, tt, 'light', { tone: 'lamp' });
  function actA(ctx, t, c) {
    HI.plate(ctx, t);
    stageLand(ctx, t, c);
    const a0 = S(c, WV.x, WV.y);
    weave(ctx, t, { x: a0[0], y: a0[1], w: WV.w * c.k, h: WV.h * c.k, seed: 8, shape: 'brain', cols: 36, rows: 20, a: .48 * (1 - .42 * bump(t, 218.75, .55)), old: .45, oldGlow: 0 });
    { const p = S(c, FIG0[0], FIG0[1] - 60), r = 260 * c.k, g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); g.addColorStop(0, rgba('#c9b98e', .2)); g.addColorStop(1, 'rgba(201,185,142,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r); ctx.restore(); }
    { const p = S(c, FIG0[0], FIG0[1] + 4); lightCircle(ctx, p[0], p[1], 120 * c.k, 1.6); }
    // the ghosts blow away like smoke, the farthest first, one after another
    GHO.forEach((j, n) => { const order = 15 - n, tb = A.maybe + .4 + order * .036, u = 1 - clamp((t - tb) / .75); if (u <= 0) return; const p = S(c, FIG0[0] + j * 118, FIG0[1]); ghostFig(ctx, t, p[0], p[1], 115 * c.k, { a: .85, u, seed: 10 + n, flicker: .6, wind: [1, -.4] }); });
    // the orchestra in its lanes
    for (let i = 0; i < 25; i++) { const pos = (tt) => lanePos(i, tt), p = pos(t), q = S(c, p[0], p[1]); if (q[0] < -60 || q[0] > W + 60 || q[1] < -60 || q[1] > H + 60) continue;
      const tr = []; for (let k = 6; k >= 0; k--) { const tt = t - .28 * k / 6, pp = pos(tt), cc = cam(tt), qq = S(cc, pp[0], pp[1]); tr.push([qq[0], qq[1]]); }
      firefly(ctx, t, { x: q[0], y: q[1], s: 1.18 * kf(c) * (.8 + .4 * R[i][2]), seed: i + 3, trail: tr }); }
    const fr = drawFig(ctx, t, c, { x: FIG0[0], y: FIG0[1] + 8, sc: 1.05, view: 'back', pose: 'stand', rim: 1 + .4 * bump(t, A.one + .1, .4), glow: 1 + .6 * bump(t, A.one + .1, .4) });
    if (t > tBloom0 && fr) { const at = [fr.head[0], fr.head[1] + 60 * c.k * FS]; glowFrom(ctx, t, amber, 1 - clamp((t - tBloom0) / (tB - tBloom0)), at, { kMin: .03, a: .45 }); }
  }

  // ================================================================ act B: the anatomy plate
  function paperStrips(ctx, t) {
    const n = 7, hS = H / n, fr = clamp((t - tB) / 1.1);
    for (let j = n - 1; j >= 0; j--) {
      const u = t < tPeel0 ? 0 : einX(clamp((t - tPeel0 - (n - 1 - j) * .09) / .85)), dy = u * (H - j * hS + 40) * 1.02; if (dy > H) continue;
      ctx.save(); ctx.translate(0, dy); ctx.beginPath(); ctx.rect(0, j * hS - .5, W, hS + 1); ctx.clip(); plateGround(ctx, t, 1, fr, 1); ctx.restore();
      if (u > 0) { ctx.save(); ctx.fillStyle = `rgba(0,0,0,${.35 * Math.sin(Math.PI * u)})`; ctx.fillRect(0, j * hS + dy + hS, W, 10); ctx.strokeStyle = rgba('#b9b0e0', .3); ctx.beginPath(); ctx.moveTo(0, j * hS + dy + .5); ctx.lineTo(W, j * hS + dy + .5); ctx.stroke(); ctx.restore(); }
    }
  }
  function plateState(t) {
    const open = mix(.8, 1, eoutX((t - A.together + .05) / .35)), close = qio(clamp((t - tClose0) / 1.0));
    const will = eoutX(clamp((t - A.front + .1) / .5)) * (1 - sine((t - tWide0 + .2) / .9)) + .5 * bump(t, A.wants + .3, .5);
    const lead = clamp((t - A.together - .2) / .8) * (1 - clamp((t - tClose0 + .1) / .5));
    return { open, close, will,
      memGlow: bump(t, A.aMem + .4, .6) + .8 * bump(t, A.nothing + .2, .4), stitches: [{ t0: A.nothing - .1, u: .62, v: .45 }],
      handsLoop: t > A.handsT - .1 && t < A.never + .5 ? clamp((t - A.handsT + .1) / (A.never - A.handsT + .5)) : 0,
      turn: t > A.front ? { x: 0, y: 0, t0: A.front, delay: .1 } : null, leaders: lead,
      labels: { memory: clamp((t - A.aMem) / .5), hands: clamp((t - A.handsT) / .5), will: clamp((t - A.andOne) / .5) } };
  }
  function workshopAt(ctx, t, c, o = {}) {
    const p = S(c, WSW[0], WSW[1]), st = plateState(t);
    if (st.turn) { const k = c.k * WSK; st.turn = { x: p[0] + 101 * k, y: p[1] - 46 * k, t0: A.front, delay: .1 }; }
    return anatomyPlate(ctx, t, { x: p[0], y: p[1], s: c.k * WSK, paper: 0, frame: 0, seed: 1, labelX: p[0] + 170 * c.k, ...st, ws: { fireflies: t > tPeel0 ? 9 : 0, ...(o.ws || {}) } });
  }

  // ================================================================ the landscape (acts C … H)
  // time of day: weights for blue hour and dusk over night
  const blueW = (t) => sine((t - 228.5) / 1.2) * (1 - sine((t - 240.2) / 4.5));
  const duskW = (t) => sine((t - 249.6) / 1.6) * (1 - sine((t - 260.0) / 2.2));
  const rn = (x, s) => .5 * Math.sin(x * .004 + s) + .3 * Math.sin(x * .011 + s * 2.1) + .15 * Math.sin(x * .027 + s * 3.3) + .05 * Math.sin(x * .07 + s);
  // the Austin skyline (replaces the far ridge round HILL_A when it morphs)
  const SKY = (() => { const r = prng(512), b = []; let x = HILL_A - 1100; while (x < HILL_A + 1100) { const w = 40 + r() * 90, h = 60 + r() * r() * 420 * Math.exp(-Math.pow((x - HILL_A - 80) / 700, 2)) + 40; b.push([x, w, h, r()]); x += w + 6 + r() * 20; } return b; })();
  const skyH = (x) => { for (const [bx, w, h] of SKY) if (x >= bx && x < bx + w) return h; return 30; };
  const morphU = (t) => sine((t - 249.0) / 1.8);
  const FZ = 2200;
  const farY = (x, t) => { const base = 612 + 70 * rn(x * .6, 1.3), m = morphU(t) * Math.exp(-Math.pow((x - HILL_A) / 900, 4)); return m > 0 ? mix(base, 690 - skyH(x), m) : base; };
  function land5(ctx, t, c) {
    const bw = blueW(t), dw = duskW(t);
    const g = ctx.createLinearGradient(0, 0, 0, H); const sh = clamp((c.y - 600) * c.k / 1200 * -.3, -.3, .3);
    g.addColorStop(0, hex3('#04060f', '#0c1428', '#1a1b3c', bw, dw)); g.addColorStop(.55 + sh * .2, hex3('#0b1230', '#1b2a4a', '#5a3a5a', bw, dw)); g.addColorStop(1, hex3('#1a1a46', '#33466e', '#e7a96b', bw, dw));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // stars
    const sa = (1 - bw) * (1 - dw); if (sa > .02) { const r = prng(77); for (let i = 0; i < 380; i++) { const x = r() * W, y = r() * H * .8, s = .6 + r() * 1.3, tw = .55 + .45 * Math.sin(t * (.5 + r() * 1.5) + i); ctx.fillStyle = `rgba(243,239,226,${(.25 + .55 * tw) * sa})`; ctx.fillRect(x, y, s, s); } }
    // far ridge (morphs into the skyline), Z = FZ
    const step = morphU(t) > 0 ? 3 : 10, pts = []; for (let sx = -20; sx <= W + 20; sx += step) { const s = 1500 / (FZ + 1500 / c.k), X = c.x + (sx - W / 2) / s, Y = farY(X, t), q = S(c, X, Y, FZ); pts.push([sx, q[1]]); }
    ctx.beginPath(); ctx.moveTo(-20, H + 10); for (const [x, y] of pts) ctx.lineTo(x, y); ctx.lineTo(W + 20, H + 10); ctx.closePath();
    ctx.fillStyle = hex3('#141436', '#26345a', '#3a2a40', bw, dw); ctx.fill();
    ctx.strokeStyle = rgba(dw > .3 ? '#ffcf9a' : '#8a7fd0', .35 + .3 * dw); ctx.lineWidth = 1.3; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    // skyline windows (Austin at dusk)
    const mu = morphU(t); if (mu > .3) { const s = 1500 / (FZ + 1500 / c.k), r = prng(9); ctx.fillStyle = rgba('#ffd9a0', .5 * (mu - .3) / .7 * (.4 + .6 * dw + .4 * (1 - dw))); for (const [bx, w, h, q] of SKY) { if (Math.abs(bx - HILL_A) > 900) continue; for (let yy = 690 - h + 12; yy < 680; yy += 16) for (let xx = bx + 6; xx < bx + w - 6; xx += 12) { if (r() < .55) continue; const p = S(c, xx, yy, FZ); if (p[0] < -5 || p[0] > W + 5) continue; ctx.fillRect(p[0], p[1], Math.max(1, 4 * s), Math.max(1, 5 * s)); } } }
    // towers on the far shore + the lake with their reflections (4.09)
    if (t < 252) towers(ctx, t, c);
    // near ridge, Z 600
    { const NZ = 600, pts2 = []; for (let sx = -20; sx <= W + 20; sx += step) { const s = 1500 / (NZ + 1500 / c.k), X = c.x + (sx - W / 2) / s, q = S(c, X, 752 + 40 * rn(X, 4.1), NZ); pts2.push([sx, q[1]]); }
      ctx.beginPath(); ctx.moveTo(-20, H + 10); for (const [x, y] of pts2) ctx.lineTo(x, y); ctx.lineTo(W + 20, H + 10); ctx.closePath(); ctx.fillStyle = hex3('#0f1130', '#1d2848', '#2a1e30', bw, dw); ctx.fill();
      ctx.strokeStyle = rgba('#7a70c0', .3); ctx.beginPath(); pts2.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
    // ground with the two hills, Z 0
    { const pts3 = []; for (let sx = -20; sx <= W + 20; sx += 6) { const X = c.x + (sx - W / 2) / c.k, q = S(c, X, hillY(X)); pts3.push([sx, q[1]]); }
      ctx.beginPath(); ctx.moveTo(-20, H + 10); for (const [x, y] of pts3) ctx.lineTo(x, y); ctx.lineTo(W + 20, H + 10); ctx.closePath(); const top = Math.min(...pts3.map((p) => p[1]));
      const gg = ctx.createLinearGradient(0, top, 0, top + 300 * c.k + 200); gg.addColorStop(0, hex3('#0e1226', '#1a2440', '#2a1c26', bw, dw)); gg.addColorStop(1, '#05060f'); ctx.fillStyle = gg; ctx.fill();
      ctx.strokeStyle = rgba(dw > .3 ? '#e7a96b' : '#7a74b8', .35); ctx.lineWidth = 1.2; ctx.beginPath(); pts3.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
  }
  function towers(ctx, t, c) {
    const s = 1500 / (TZ + 1500 / c.k), lean = sine((t - A.leaning + .1) / .8), sY = S(c, 0, SHORE, TZ)[1], lakeB = S(c, 0, SHORE + 26, 1300)[1];
    // the lake
    if (sY < H) { const g = ctx.createLinearGradient(0, sY, 0, lakeB); g.addColorStop(0, rgba('#2a3a62', .55)); g.addColorStop(1, rgba('#0e1430', .2)); ctx.fillStyle = g; ctx.fillRect(0, sY, W, Math.max(0, lakeB - sY)); }
    const dark = (ti, j, rows) => { const tt = A.big + .3 + ti * .22 + (j / rows) * 1.3; return clamp((t - tt) / .2); };
    TOW.forEach(([x, w, h], ti) => {
      const a = S(c, x - w / 2, SHORE - h, TZ), b = S(c, x + w / 2, SHORE, TZ); if (b[0] < -40 || a[0] > W + 40) return;
      const cols = Math.max(3, Math.round(w / 26)), rows = Math.round(h / 24);
      for (const refl of [0, 1]) {
        ctx.save();
        if (refl) { ctx.beginPath(); ctx.rect(0, sY, W, Math.max(0, lakeB - sY)); ctx.clip(); ctx.translate(0, 2 * sY); ctx.scale(1, -1); ctx.globalAlpha = .38; const sk = -.22 * lean; ctx.translate(0, sY); ctx.transform(1, 0, sk, 1, 0, 0); ctx.translate(0, -sY); }
        ctx.fillStyle = '#10142e'; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.strokeStyle = rgba('#8f86d8', .45); ctx.lineWidth = 1; ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
        const cw = (b[0] - a[0]) / cols, rh = (b[1] - a[1]) / rows;
        for (let j = 0; j < rows; j++) { const d = dark(ti, rows - 1 - j, rows); for (let i = 0; i < cols; i++) { const on = (1 - d) * (((i * 7 + j * 3 + ti) % 5) ? 1 : .4); if (on < .03) continue; ctx.fillStyle = rgba('#f1e4c6', .85 * on); ctx.fillRect(a[0] + i * cw + cw * .2, a[1] + j * rh + rh * .25, Math.max(.8, cw * .6), Math.max(.8, rh * .45)); } }
        // threads glow in place of the dark floors
        const th = clamp((t - A.big - .6 - ti * .22) / 1.4); if (th > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F8.goldCore, .55 * th); ctx.lineWidth = 1; ctx.beginPath(); const r = prng(30 + ti);
          for (let k = 0; k < 9; k++) { const y0 = a[1] + (b[1] - a[1]) * (1 - th * r()), y1 = a[1] + (b[1] - a[1]) * (1 - th * r()); ctx.moveTo(a[0] + (b[0] - a[0]) * r(), y0); ctx.quadraticCurveTo(a[0] + (b[0] - a[0]) * r(), (y0 + y1) / 2 + 10 * Math.sin(t + k), a[0] + (b[0] - a[0]) * r(), y1); } ctx.stroke(); ctx.restore(); }
        ctx.restore();
      }
      // fireflies circling the tops (not in the reflection)
      const th = clamp((t - A.big - .9 - ti * .22) / 1); if (th > 0) for (let k = 0; k < 3; k++) { const an = t * (.9 + .2 * k) + k * 2.1 + ti, cx = (a[0] + b[0]) / 2, cy = a[1] + 6; firefly(ctx, t, { x: cx + Math.cos(an) * (b[0] - a[0]) * .7, y: cy + Math.sin(an) * 8, s: .45, seed: ti * 5 + k, a: th }); }
    });
  }

  // ================================================================ 4.07: the org chart, the ghost office
  const BOXES = (() => { const out = [[1010, 250, -1]]; [760, 1010, 1260].forEach((x, i) => out.push([x, 360, 0])); [640, 760, 880, 1010, 1140, 1260, 1380].forEach((x, i) => out.push([x, 470, 1 + Math.min(2, Math.floor(i / 2.4))])); return out; })();
  function orgChart(ctx, t, c) {
    const ap = sine((t - A.noD + .35) / .5); if (ap <= 0 || t > A.layers + 2) return; const r = prng(3);
    ctx.save(); ctx.lineCap = 'round';
    const pos = BOXES.map(([x, y], i) => { const t0 = A.dep - .02 + i * .045, u = clamp((t - t0) / 1.6), q = r(), q2 = r(); return [x + u * u * (380 + 300 * q) + 30 * Math.sin(u * 6 + i), y + 240 * u * u + 80 * u - 60 * Math.sin(Math.PI * u) * q2, u * (q - .5) * 3, u]; });
    // the lines first (they snap when a box leaves)
    ctx.strokeStyle = rgba('#b9b0e0', .55 * ap); ctx.lineWidth = 1.2; ctx.beginPath();
    BOXES.forEach(([x, y, p], i) => { if (p < 0) return; const P = p + 0, a = pos[i], b = pos[P === -1 ? 0 : P]; if (a[3] > .02 || b[3] > .02) return; const A1 = S(c, a[0], a[1] - 22), B1 = S(c, b[0], b[1] + 22), my = (A1[1] + B1[1]) / 2; ctx.moveTo(A1[0], A1[1]); ctx.lineTo(A1[0], my); ctx.lineTo(B1[0], my); ctx.lineTo(B1[0], B1[1]); }); ctx.stroke();
    pos.forEach(([x, y, rot, u], i) => { const p = S(c, x, y), k = c.k, al = ap * (1 - clamp((u - .6) / .4)); if (al <= 0) return;
      ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(rot); ctx.globalAlpha = al; ctx.fillStyle = '#151838'; ctx.fillRect(-36 * k, -21 * k, 72 * k, 42 * k); ctx.strokeStyle = rgba('#d9d0f6', .8); ctx.lineWidth = 1.2; ctx.strokeRect(-36 * k, -21 * k, 72 * k, 42 * k);
      ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = .8; ctx.beginPath(); for (let q = -36; q < 36; q += 5) { ctx.moveTo(q * k, 21 * k); ctx.lineTo((q + 12) * k, -21 * k); } ctx.stroke(); ctx.restore(); });
    ctx.restore();
  }
  function ghostOffice(ctx, t, c) {
    const ap = sine((t - A.noD + .2) / .6); if (ap <= 0 || t > A.layers + 2.4) return; const n = 8, x0 = 1440, wd = 230, sh = 58, r = prng(81);
    ctx.save(); ctx.fillStyle = '#cfc8f0';
    for (let s = 0; s < n; s++) { const top = n - 1 - s, tb = A.layers - .05 + top * .1, u = clamp((t - tb) / .9), y0 = 830 - (s + 1) * sh;
      const edges = [[x0, y0, x0 + wd, y0], [x0, y0, x0, y0 + sh], [x0 + wd, y0, x0 + wd, y0 + sh]]; for (let i = 0; i < 5; i++) edges.push([x0 + 20 + i * 44, y0 + 14, x0 + 44 + i * 44, y0 + 14], [x0 + 20 + i * 44, y0 + 40, x0 + 44 + i * 44, y0 + 40]);
      for (const [ax, ay, bx, by] of edges) { const L = Math.hypot(bx - ax, by - ay), m = Math.max(1, Math.round(L / 9)); for (let q = 0; q < m; q++) { const rq = r(), d = clamp((u - rq * .35) / .65), X = mix(ax, bx, q / m) + d * (120 + 160 * rq), Y = mix(ay, by, q / m) - d * (90 + 120 * r()), al = ap * (1 - d) * .8; if (al < .02) continue; const p = S(c, X, Y); ctx.globalAlpha = al; const z = Math.max(1, 2 * kf(c)); ctx.fillRect(p[0] - z / 2, p[1] - z / 2, z, z); } } }
    ctx.restore();
  }

  // ================================================================ 4.12–4.13: Austin
  function austin(ctx, t, c) {
    if (t < 249.2 || t > 263.5) return;
    const xs = [HILL_A - 52, HILL_A, HILL_A + 50], cols = ['#3a4466', '#584a3c', '#2f3f5c'];
    xs.forEach((x, i) => { const p = S(c, x, hillY(x) + 2); smallFigure(ctx, t, p[0], p[1], 112 * c.k, { dir: i === 2 ? -1 : 1, seed: 60 + i, coat: cols[i], arm: i === 1 ? .9 : .15, rim: duskW(t) > .3 ? '#ffcf9a' : '#c9c0e8' }); });
    // the box (carried by the middle one) and its price tag
    const bx = S(c, HILL_A + 14, hillY(HILL_A) - 58), k = c.k;
    ctx.save(); ctx.translate(bx[0], bx[1]); ctx.fillStyle = '#7a5a3a'; ctx.fillRect(-14 * k, -12 * k, 28 * k, 22 * k); ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 1; ctx.strokeRect(-14 * k, -12 * k, 28 * k, 22 * k); ctx.beginPath(); ctx.moveTo(-14 * k, -4 * k); ctx.lineTo(14 * k, -4 * k); ctx.stroke();
    const tg = clamp((t - A.three - .05) / .35); if (tg > 0) { const sw = Math.sin(t * 2.2) * .12 * (1 - .5 * tg), st = 1 + .25 * bump(t, A.three + .2, .1);
      ctx.strokeStyle = '#c9b98e'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(12 * k, 8 * k); ctx.lineTo(30 * k, 30 * k); ctx.stroke();
      ctx.translate(30 * k, 30 * k); ctx.rotate(sw); ctx.scale(st * eoutX(tg), st * eoutX(tg)); ctx.fillStyle = '#efe4c6'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(46 * k, 0); ctx.lineTo(54 * k, 11 * k); ctx.lineTo(46 * k, 22 * k); ctx.lineTo(0, 22 * k); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#8a7350'; ctx.stroke();
      ctx.fillStyle = '#b23a2a'; ctx.font = `600 ${Math.round(12 * k)}px "Inter"`; ctx.textBaseline = 'middle'; ctx.fillText('≈ $300', 4 * k, 11.5 * k); }
    ctx.restore();
    // twelve fireflies count in, one per beat
    for (let i = 0; i < 12; i++) { const t0 = A.spring + .35 + i * .24; if (t < t0) continue; const an = -Math.PI / 2 + i / 12 * TAU, born = eoutX(clamp((t - t0) / .4)), X = HILL_A + Math.cos(an + t * .25) * 210 * born, Y = hillY(HILL_A) - 70 + Math.sin(an + t * .25) * 80 * born, p = S(c, X, Y);
      firefly(ctx, t, { x: p[0], y: p[1], s: .8 * kf(c), seed: 90 + i, pulse: bump(t, t0 + .05, .12) }); }
  }

  // ================================================================ 4.14–4.18: the ghost workshop, the card, 2026
  function ghostWorkshop(ctx, t, c) {
    if (t < 258) return null;
    const p = S(c, GWS[0], GWS[1]), k = GWK * c.k, fl = t > A.appear - .05 && t < A.appear + .35 ? .35 + .65 * Math.abs(Math.sin((t - A.appear) * 26)) : 1;
    // the tower shadow behind it
    // (a dotted outline of an office tower standing behind it, faint: the company it would replace)
    { const a = S(c, GWS[0] + 40 * GWK, GWS[1] - 380 * GWK), b = S(c, GWS[0] + 130 * GWK, GWS[1] - 20 * GWK), ta = .4 * (1 - clamp((t - tBurin1) / .8));
      if (ta > .01) { ctx.save(); 
        ctx.setLineDash([2, 6]); ctx.strokeStyle = rgba('#a49ad8', ta); ctx.lineWidth = 1.2; ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
        ctx.strokeStyle = rgba('#a49ad8', ta * .6); ctx.beginPath(); const fl = 14; for (let q = 1; q < fl; q++) { const y = mix(a[1], b[1], q / fl); ctx.moveTo(a[0] + 6, y); ctx.lineTo(b[0] - 6, y); } ctx.stroke(); ctx.restore(); } }
    const eng = engraveX(t), wind = 1 - clamp((t - tBurin1) / .6);
    // dotted ghost (wind moves the dashes a little)
    ctx.save(); if (eng > 0) { ctx.beginPath(); ctx.rect(eng, 0, W - eng, H); ctx.clip(); }
    ctx.globalAlpha = fl * (.85 + .15 * Math.sin(t * 3)); ctx.translate(Math.sin(t * 1.7) * 1.2 * wind, 0);
    workshop(ctx, t, p[0], p[1], k, { state: 'ghost', seed: 4 }); ctx.globalCompositeOperation = 'lighter'; workshop(ctx, t, p[0], p[1], k, { state: 'ghost', seed: 4 }); ctx.globalAlpha *= .5; workshop(ctx, t, p[0], p[1], k, { state: 'ghost', seed: 4 }); ctx.restore();
    // the door light (cream paper) that grows as the camera comes
    const dl = sine((t - 264.5) / 2), dw = S(c, doorW.x, doorW.y), dw2 = S(c, doorW.x + doorW.w, doorW.y + doorW.h);
    if (dl > 0 && t < tSwitch2 + .1 && eng <= 0) { ctx.save(); ctx.beginPath(); ctx.rect(dw[0], dw[1], dw2[0] - dw[0], dw2[1] - dw[1]); ctx.clip(); plate(ctx, t, 'paper', { tone: 'cream' }); if (dl < 1) { ctx.fillStyle = `rgba(8,9,24,${1 - dl})`; ctx.fillRect(dw[0], dw[1], dw2[0] - dw[0], dw2[1] - dw[1]); } ctx.restore(); }
    // 4.16: on "nobody" the empty door is outlined once
    { const b = bump(t, A.nobody + .25, .4); if (b > .03) { ctx.save(); ctx.strokeStyle = rgba('#f3ecda', .8 * b); ctx.lineWidth = 1.6; ctx.strokeRect(dw[0], dw[1], dw2[0] - dw[0], dw2[1] - dw[1]); ctx.restore(); } }
    // the engraved, lit workshop behind the burin
    if (eng > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, eng, H); ctx.clip(); const lit = .55 + .45 * sine((t - A.possible + .1) / .5);
      workshop(ctx, t, p[0], p[1], k, { state: 'lit', lit, seed: 4, fireflies: t > tBurin1 ? 8 : 0, figure: { pose: 'stand', rim: .9 }, door: 1 }); ctx.restore(); }
    return { p, k };
  }
  const engraveX = (t) => { if (t < tBurin0) return 0; const c = cam(t), a = S(c, GWS[0] - 140 * GWK, 0)[0], b = S(c, GWS[0] + 140 * GWK, 0)[0]; return t > tBurin1 + .05 ? W + 10 : mix(a, b, eio(clamp((t - tBurin0) / (tBurin1 - tBurin0)))); };
  function burin(ctx, t, c) {
    if (t < tBurin0 - .05 || t > tBurin1 + .1) return; const x = engraveX(t), u = clamp((t - tBurin0) / (tBurin1 - tBurin0)), p = S(c, GWS[0], GWS[1]), y = p[1] - (60 + 40 * Math.sin(u * TAU * 3)) * GWK * c.k;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, 40); g.addColorStop(0, 'rgba(255,250,235,.95)'); g.addColorStop(.25, rgba(F8.goldCore, .5)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - 40, y - 40, 80, 80);
    ctx.strokeStyle = rgba('#fff8e6', .7); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 26, y - 60); ctx.stroke(); ctx.restore();
  }
  // the three leader lines flash once (4.17)
  function leaders3(ctx, t, c, gw) {
    const u = clamp((t - A.butNow - .9) / .5) * (1 - clamp((t - A.possible + .15) / .45)); if (u <= 0 || !gw) return; const { p, k } = gw;
    const org = [['MEMORY', [p[0] - 62 * k, p[1] - 46 * k], '#f3d9a0'], ['HANDS', [p[0] - 4 * k, p[1] - 118 * k], '#b9f0c8'], ['WILL', [p[0] + 101 * k, p[1] - 26 * k], F8.amber]], LX = p[0] + 250 * k;
    org.forEach(([lab, q, col], i) => { const ty = p[1] - 170 * k + i * 48, e = eoutX(clamp(u * 1.4 - i * .15)); ctx.save(); ctx.strokeStyle = rgba('#d9cfb0', .85 * e); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(mix(q[0], LX, e), mix(q[1], ty, e)); ctx.stroke(); ctx.fillStyle = rgba(col, e); ctx.beginPath(); ctx.arc(q[0], q[1], 3, 0, TAU); ctx.fill(); ctx.restore();
      capsLabel(ctx, lab, LX + 14, ty + 8, e, 0, { size: 20, ruleCol: col }); });
  }
  // card Q2
  const QOPT = { lines: ['2026.'], quote: '2026.', size: 250, attrib: 'DARIO AMODEI · MAY 2025', note: 'asked when the first one-person billion-dollar company would appear', breathe: 0, light: 0, shadow: .8 };
  const cardOn = (t) => t >= tSwitch2 && t < 276.4;
  const frayQ = (t) => sine((t - 274.7) / 1.5);
  const liftU = (t) => sine((t - 274.5) / 1.3);
  function card2(ctx, t, c) {
    const sc = S(c, CARD2[0], CARD2[1]), s = CS2 * c.k, f = frayQ(t);
    ctx.save();
    if (f > 0) { const R0 = 760 * s, rad = R0 * (1 - f); ctx.beginPath(); for (let i = 0; i <= 64; i++) { const a = i / 64 * TAU, n = 1 + .12 * Math.sin(a * 5 + 1) + .08 * Math.sin(a * 11 + t * 2); const x = sc[0] + Math.cos(a) * rad * n * 1.5, y = sc[1] + 120 * s + Math.sin(a) * rad * n * .8; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.clip(); }
    quoteCard(ctx, t, { ...QOPT, x: sc[0], y: sc[1], s, t0: tSwitch2 + 1.5, per: .3, attribAt: tSwitch2 + 2.2, paper: (g) => plate(g, t, 'paper', { tone: 'cream' }), wordStyle: () => ({ alpha: t > 274.5 ? 0 : 1 }) });
    ctx.restore();
    if (f > 0 && f < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r = prng(5), rad = 760 * s * (1 - f); for (let i = 0; i < 70; i++) { const a = i / 70 * TAU, n = 1 + .12 * Math.sin(a * 5 + 1) + .08 * Math.sin(a * 11 + t * 2), x = sc[0] + Math.cos(a) * rad * n * 1.5, y = sc[1] + 120 * s + Math.sin(a) * rad * n * .8, L = 20 + 30 * r(), b = a + (r() - .5);
      ctx.strokeStyle = rgba(F8.goldCore, .5 * Math.sin(Math.PI * f)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(b) * L, y + Math.sin(b) * L); ctx.stroke(); } ctx.restore(); }
  }
  // the digits: from the card's ink (pressed) to light in the sky; they lock in on "twenty-six"
  function digits(ctx, t, c) {
    if (t < 274.5 || t > A.butNow + .9) return; const u = liftU(t), lock = bump(t, A.t26 + .08, .12), fade = 1 - sine((t - A.butNow + .1) / .9);
    const w = DIG, wx = CARD2[0] + (w.x + w.wd / 2) * CS2, wy = CARD2[1] + (w.y - w.size * .35) * CS2 - 170 * u, sc = CS2 * (1 + 1.1 * u) * (1 + .04 * lock) * c.k, p = S(c, wx, wy);
    ctx.save(); ctx.globalAlpha = fade; ctx.translate(p[0], p[1]); ctx.scale(sc, sc); ctx.font = `${w.size}px "Instrument Serif"`; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center';
    const ox = 0, oy = w.size * .35, col = lerpHex('#2a2420', '#f6e7c9', clamp(u * 1.4));
    if (u > .2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = rgba('#f3d9a0', .6 * clamp((u - .2) * 2)); ctx.shadowBlur = 40; ctx.fillStyle = rgba('#f3d9a0', .25 * clamp((u - .2) * 2)); ctx.fillText('2026.', ox, oy); ctx.restore(); }
    ctx.fillStyle = rgba('#ffffff', .35 * (1 - u)); ctx.fillText('2026.', ox - .9, oy - .9); ctx.fillStyle = col; ctx.fillText('2026.', ox, oy);
    ctx.restore();
  }

  // ================================================================ labels
  function labels(ctx, t) {
    const src = (txt, t0, t1, x = 120, y = 880) => capsLabel(ctx, txt, x, y, clamp((t - t0) / .6), clamp((t - t1) / .5), { size: 16, col: '#cfc6e8', rule: false, spacing: 4 });
    capsLabel(ctx, 'AUSTIN, TEXAS', 120, 170, clamp((t - A.austin + .05) / .6), clamp((t - 259.6) / .5), { size: 24, ruleCol: '#e7a96b' });
    src('Fortune, 18 Apr 2026', A.three + .3, 259.6);
    capsLabel(ctx, '3 PEOPLE · 12 AGENTS', 1180, 300, clamp((t - A.twelve - .05) / .6), clamp((t - 259.9) / .5), { size: 30, ruleCol: '#b9f0c8', w: 640 });
    { const u = clamp((t - A.dario - .05) / .7) * (1 - clamp((t - A.appear + .5) / .5)); if (u > 0) nameLabel(ctx, t, { x: 1220, y: 360, name: 'Dario Amodei', role: 'RUNS ANTHROPIC', u }); }
    src('Dario Amodei, May 2025', A.t26 + .1, A.nobody - .2);
    capsLabel(ctx, 'PREDICTION', 120, 170, clamp((t - A.pred) / .6), clamp((t - A.butNow) / .5), { size: 26, ruleCol: '#b9b0e0' });
  }

  // ================================================================ the frame
  const draw = (ctx, t) => {
    const c = cam(t);
    if (t < tB) { actA(ctx, t, c); return; }
    {
      // the world (acts B…H): sky, land, workshop
      const plateUp = t < tPeel0 + 1.6;
      if (!(t < tPeel0)) land5(ctx, t, c);
      if (t < 252) { orgChart(ctx, t, c); ghostOffice(ctx, t, c); }
      if (plateUp) paperStrips(ctx, t);
      if (t < 252) { workshopAt(ctx, t, c); if (c.k < .3) { const p = S(c, WSW[0], WSW[1] - 40), r = 60 + 30 * Math.sin(t * 1.3); const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); g.addColorStop(0, rgba('#fff1d6', .9 * (1 - c.k / .3))); g.addColorStop(.15, rgba(F8.amber, .4 * (1 - c.k / .3))); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r); ctx.restore(); } }
      austin(ctx, t, c);
      const gw = ghostWorkshop(ctx, t, c);
      burin(ctx, t, c);
      leaders3(ctx, t, c, gw);
      // the hill figure of 4.14 (from behind; she watches the empty horizon)
      if (t > 259) { const x = HILL_D - 40; drawFig(ctx, t, c, { x, y: hillY(x) + 2, view: 'back', pose: 'stand', rim: .5, glow: 0 }); }
      if (t < tGlowIn1) { const st = workshopAt; const p = S(c, WSW[0], WSW[1]), k = c.k * WSK; glowFrom(ctx, t, amber, clamp((t - tB) / (tGlowIn1 - tB)), [p[0] + 101 * k, p[1] - 30 * k], { kMin: .03, a: .45 }); }
      if (cardOn(t)) card2(ctx, t, c);
      digits(ctx, t, c);
      labels(ctx, t);
      // the memo (4.10)
      if (t > tMemoIn0 && t < tMemoOut1 + .05) { const ui = sine((t - tMemoIn0) / (tMemoIn1 - tMemoIn0)), uo = sine((t - tMemoOut0) / (tMemoOut1 - tMemoOut0));
        paperMemo(ctx, t, { x: mix(W / 2, -500, uo), y: mix(-720, H / 2 + 6, ui), s: mix(.86, .85, uo), rot: mix(mix(-.06, .012, ui), -.03, uo), typeAt: tMemoIn1 - .25, cps: 32, underline: clamp((t - A.show - .05) / .7), source: clamp((t - A.show - .9) / .6), lift: 1 - ui * .7 }); }
      // 4.18: a firefly from the roof flies at the camera; its glow fills the frame
      if (t > tFly0 && gw) { const p = gw.p, k = gw.k, u = clamp((t - tFly0) / (A.work - tFly0)), e = einX(u * .9 + .1 * u), r0 = [p[0] - 40 * k, p[1] - 110 * k], to = [W / 2 + 40, H / 2 - 10];
        const x = mix(r0[0], to[0], sine(u)), y = mix(r0[1], to[1], sine(u)) - 60 * Math.sin(Math.PI * u), s = .8 * kf(c) * Math.exp(1.7 * Math.pow(u, 1.6)), tG0 = A.work - .95, fa = 1 - sine((t - tG0 - .25) / .8);
        if (fa > 0) firefly(ctx, t, { x, y, s, seed: 21, a: fa, pulse: bump(t, A.work, .2) });
        if (t > tG0) glowFrom(ctx, t, HO.plate, 1 - sine((t - tG0) / (tFly1 - tG0)), [x, y], { kMin: .03, a: .45 }); }
    }
  };

  await ready(); await cardsReady(); await memoReady();
  { const { canvas } = await import('../engine.mjs'); const [, g] = canvas(8, 8); const r = quoteCard(g, 0, { ...QOPT, x: 0, y: 0, s: 1, u: 0 }); const w = r.words[0];
    TGT2 = [w.x + w.wd / 2, (w.y - r.local.size * .75 - 330) / 2]; DIG = { ...w, size: r.local.size }; KEYS = K(); }
  { const { canvas } = await import('../engine.mjs'); const [, g] = canvas(64, 64); weave(g, 0, { x: 0, y: 0, w: WV.w, h: WV.h, seed: 8, shape: 'brain', cols: 36, rows: 20 }); await ready(); }

  const SOUND = {
    [TB]: [{ f: 'gust', t: A.maybe + .45, v: .22 }],
    [A.put]: [{ f: 'tone', t: A.together + .02, v: .25 }, { f: 'foil_glint', t: A.nothing, v: .22 }],
    [A.inP]: [{ f: 'whoosh_airy', t: A.whole, v: .22 }, { f: 'paper_pop', t: A.dep + .05, v: .2 }],
    [A.atS]: [{ f: 'pages', t: tMemoIn0 + .2, v: .25 }, { f: 'pencil', t: A.show + .05, v: .22 }],
    [A.inA]: [{ f: 'stamp', t: A.three + .1, v: .3 }],
    [A.spring]: [{ f: 'tick', t: A.spring + .4, v: .18 }],
    [A.andD]: [{ f: 'card', t: tSwitch2 + .05, v: .2 }],
    [A.twenty]: [{ f: 'swell', t: A.twenty + .05, v: .22 }, { f: 'shimmer_rings', t: A.possible, v: .25 }],
    [A.so]: [{ f: 'wings', t: tFly0 + .2, v: .22 }],
  };
  const starts = [TB, A.put, A.inP, A.atS, A.but, A.inA, A.spring, A.andD, tSwitch2, A.twenty, A.so, A.work + .45];
  return starts.map((t0, i) => ({ t: t0, tr: 'cut', d: .1, print: i === 0 ? HI.print : i === starts.length - 1 ? HO.print : { riso: .3 }, draw, sound: SOUND[t0] }));
};
