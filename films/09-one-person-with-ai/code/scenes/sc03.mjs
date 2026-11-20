// Film 8 · chunk c03 · 02a–02b + C1 + Q1 "II · The hands" (shots 2.01–2.13, C1, Q1; 81.42–154.32 s). Builder: B1.
// World and props: lib/f8_c03_world.mjs. Kit: weave (the memory), firefly / swarm / stitch / knot (the hands). Cards: lib/f8_cards.mjs.
// ONE continuous camera (keys below, every move ≥ 1.6 s, dives ≥ 2 s, sine S-curves, zooms about a focus point); no cut inside the chunk.
//
// | shot | VO (accent)                                  | image                                                                  | hero light       | camera                                   | flow into next                     | ★ | sound          |
// |------|----------------------------------------------|------------------------------------------------------------------------|------------------|------------------------------------------|------------------------------------|---|----------------|
// | in   | (plate c02>c03, green light)                 | the frame IS the green plate; the light contracts into the firefly     | the plate        | —                                        | the glow becomes the firefly       |   | wings 81.1     |
// | 2.01 | The **hands**.                               | blue hour; the firefly has landed at the edge of the network; dozens   | fireflies        | slow settle                              | take                               |   |                |
// |      |                                              | lift out of its nodes and swarm out drawing strokes; `II · HANDS`      |                  |                                          |                                    |   |                |
// | 2.02 | …doesn't just **answer**, but **acts**.      | one firefly alone: on "answer" a light ring in place; on "acts" it    | the firefly      | slow push on it                          | it curves back to the network      |   | glint 87.3     |
// |      |                                              | shoots off and seals a passing engraved letter in flight              |                  |                                          |                                    |   |                |
// | 2.03 | They **read** the memory, do the **work**,    | the loop: it dives into the network and pulls a thread, turns the     | green + gold     | pull back 87.2–89.4 (both stations)      | take, the sky darkens              | ★ | chime 91.6     |
// |      | and write…**back** into it.                  | gear one notch, flies back and stitches a new node; ten more join     |                  |                                          |                                    |   |                |
// | 2.04 | And they don't stop at **night**.            | time-lapse: the sky goes from dusk to deep night, the stars turn,      | fireflies        | tilt up to the sky (2 s)                 | the time-lapse runs back into day  |   |                |
// |      |                                              | the fireflies grow brighter                                            |                  |                                          |                                    |   |                |
// | 2.05 | At Y Combinator, one agent answers the team's | pale day: five people in front of the network, ? glyphs rise; one     | the firefly      | down to the team (1.8 s)                 | the sun sinks, night               |   |                |
// |      | data questions **all day**.                  | firefly gathers them, dives in, draws a bar chart; the sun crosses    |                  |                                          |                                    |   |                |
// | 2.06 | …everything that **failed**.                 | night: a second firefly glides low; rust knots light one by one; it   | rust knots       | low drift, then 2.4 s to the print       | it lands on the print's corner     |   | wings 103.2    |
// |      |                                              | flies at the camera and lands on the corner of the clip print         |                  |                                          |                                    |   |                |
// | C1   | (original sound, 14 s)                       | the clip as a print on dark paper, the firefly breathing on its       | the print        | slow drift in                            | the firefly lifts off, back to the |   |                |
// |      |                                              | corner; fog and fireflies behind; lower third + ORIGINAL FOOTAGE       |                  |                                          | network                            |   |                |
// | 2.07 | **Nobody** told it what to fix.              | the network at night, the firefly alone above it; the empty stone in  | the firefly      | one 3.8 s move past the empty stone to   | take                               |   |                |
// |      |                                              | the foreground where the conductor will stand: nobody, no light        |                  | the first knot                           |                                    |   |                |
// | 2.08 | It **found** the problems itself.            | it stops over a rust knot and lights it; its light jumps to two more   | rust             | settle                                   | push in on the knot                |   |                |
// | 2.09 | …proposes its own **repairs**.               | the knot big: a dotted proposal beside it; on "repairs" it turns solid | the knot         | push (2.2 s)                             | pull back                          |   |                |
// |      |                                              | and the knot loosens into gold strands                                 |                  |                                          |                                    |   |                |
// | 2.10 | Every morning, it works a little **better**…  | time-lapse: night, morning, night, morning; each morning the network   | network          | pull back (2.4 s)                        | night again                        |   |                |
// |      |                                              | is denser and brighter, fewer knots                                    |                  |                                          |                                    |   |                |
// | 2.11 | Something that learns in its **sleep**.       | the whole network at night breathes like a sleeper, a slow wave of     | network          | poster, slow drift                       | push in on a fresh gold stitch     | ★ |                |
// |      |                                              | light from bottom to top; fireflies stitch, knots turn gold            |                  |                                          |                                    |   |                |
// | 2.12 | …the part I **can't stop** thinking about.    | very close: a fresh gold node, a spark runs along its strand, again    | the spark        | push (2.2 s)                             | the spark runs out to the left     |   |                |
// | 2.13 | Jack Dorsey…Roelof Botha…**four thousand jobs**| the spark runs along a long strand to a tall office block at night;  | the windows      | follow the spark, pull back (3.3 s)      | push into one of the last lit      |   | whoosh 146.4   |
// |      |                                              | labels; on "four thousand jobs" 4 in 10 windows go out in waves,       |                  | then a 3 s dive into one window          | windows: its light is the card     |   |                |
// |      |                                              | small figures walk out; ≈ 4,000 JOBS CUT · FORTUNE                     |                  |                                          |                                    |   |                |
// | Q1   | (no VO)                                      | the window's light is cream letterpress paper; the quote presses in    | the paper        | slow drift in, then a 2 s dive into      | plate c03>c04 (cream paper)        |   |                |
// |      |                                              | word by word, the attribution                                          |                  | "system." until the paper fills the frame|                                    |   |                |
import { W, H, rgba, clamp, mix, sm, eio, prng } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { ready, F8, glyph, firefly, swarm, weave, knot, stitch, pulse, qio, eoutX } from '../lib/f8_kit.mjs';
import { glowFrom, nameLabel } from '../lib/f8_c02_world.mjs';
import { quoteCard, clipPrint, cardsReady } from '../lib/f8_cards.mjs';
import { S, plane, land, NET, netRect, gear, letter, smallFigure, tower, TOWER, towerWin, FLOOR, FCAM } from '../lib/f8_c03_world.mjs';
import { text } from '../engine.mjs';

const TAU = Math.PI * 2;
const sine = (x) => .5 - .5 * Math.cos(Math.PI * clamp(x));
const PR = { riso: .2, halftone: .6 };
const bump = (t, c, w) => Math.exp(-Math.pow((t - c) / w, 2));
// zoom-about-a-point camera: between two keys, k moves in log space and the focus (the end centre on a push, the start centre on a
// pull back) travels on a straight screen line, so nothing swings
function camKeys(K, t) {
  if (t <= K[0].t) return { ...K[0] };
  for (let i = 1; i < K.length; i++) {
    const a = K[i - 1], b = K[i]; if (t > b.t) continue;
    const u = (b.e || sine)((t - a.t) / (b.t - a.t)), k = Math.exp(mix(Math.log(a.k), Math.log(b.k), u));
    const F = b.k >= a.k ? [b.x, b.y] : [a.x, a.y];
    const s0 = [W / 2 + (F[0] - a.x) * a.k, H / 2 + (F[1] - a.y) * a.k], s1 = [W / 2 + (F[0] - b.x) * b.k, H / 2 + (F[1] - b.y) * b.k];
    const sp = [mix(s0[0], s1[0], u), mix(s0[1], s1[1], u)];
    return { x: F[0] - (sp[0] - W / 2) / k, y: F[1] - (sp[1] - H / 2) / k, k };
  }
  return { ...K[K.length - 1] };
}
// Catmull-Rom through points (closed loop), parameter s 0..1 mapped on key values
function loopCurve(P, SV) {
  const n = P.length;
  return (s) => {
    s = ((s % 1) + 1) % 1; let j = n - 1; for (let i = 0; i < n; i++) { const s1 = i + 1 < n ? SV[i + 1] : 1; if (s >= SV[i] && s < s1) { j = i; break; } }
    const s0 = SV[j], s1 = j + 1 < n ? SV[j + 1] : 1, q = (s - s0) / (s1 - s0), p0 = P[(j - 1 + n) % n], p1 = P[j], p2 = P[(j + 1) % n], p3 = P[(j + 2) % n];
    const f = (a, b, c, d) => .5 * ((2 * b) + (-a + c) * q + (2 * a - 5 * b + 4 * c - d) * q * q + (-a + 3 * b - 3 * c + d) * q * q * q);
    return [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])];
  };
}
const piece = (pts, t) => { if (t <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [ta, va] = pts[i - 1], [tb, vb] = pts[i]; return mix(va, vb, (pts[i][2] || sine)((t - ta) / (tb - ta))); } return pts[pts.length - 1][1]; };

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c03', T);
  const S2 = (p, n) => T.S('02a', p, n), S3 = (p, n) => T.S('02b', p, n);
  const A = {
    hands: S2('hands'), theyre: S2("They're"), answer: S2('answer'), acts: S2('acts'), read: S2('read'), work: S2('work,'), back: S2('back'),
    night: S2('night.'), andThey: S2('And they'), atY: S2('At Y'), questions: S2('questions'), allDay: S2('all day'), atNight: S2('At night', 1), failed: S2('failed'),
    nobody: S3('Nobody'), found: S3('found'), everyN: S3('Every night'), repairs: S3('repairs'), everyM: S3('Every morning'), better: S3('better'),
    something: S3('Something'), sleep: S3('sleep'), thisIs: S3('This is'), cant: S3("can't"), jack: S3('Jack'), roelof: S3('Roelof'), board: S3('board'), wrote: S3('wrote'), cut: S3('cut'), four: S3('four thousand'), jobs: S3('jobs'),
  };
  const C1 = T.clip('C1'), Q1 = T.clip('Q1');
  const TB = HI.b, TE = HO.a;   // 81.07 … 153.77

  // ---------------------------------------------------------------- places (world, Z = 0 unless said)
  const L0 = [1560, 470];                         // where the plate's firefly lands (right edge of the network)
  const G = { x: 1790, y: 430, r: 56 };            // the gear (2.03)
  const NR = [1330, 390];                          // the read point inside the network
  const KN = [[560, 560], [720, 520], [880, 600], [1040, 540], [1200, 580], [1330, 505]];   // the day's failures (rust knots)
  const K1 = KN[4];
  const PRT = { x: 2350, y: 400, Z: -700, w: 630, h: 354 };   // the clip print hangs nearer to the camera
  const STONE = [1960, 885];                        // the empty stone where the conductor will stand (2.07)
  const STI = [700, 382];                           // the fresh gold stitch of 2.12
  const WIN = (() => { const r = towerWin(7, 15); return { x: r.x + r.w / 2, y: r.y + r.h / 2, w: r.w, h: r.h, i: 7, j: 15 }; })();
  const uv = (X, Y) => [(X - NET.x) / NET.w, (Y - NET.y) / NET.h];

  // the print's on-screen size during the clip: 1120 px wide, centred at (1000, 455)
  const sP = 1120 / PRT.w, kP = FCAM / (FCAM / sP - PRT.Z), camP = { x: PRT.x - (1000 - W / 2) / sP, y: PRT.y - (455 - H / 2) / sP, k: kP };
  const kWin = 1.3 * W / WIN.w;                    // the target window's glass over-fills the frame
  // ---------------------------------------------------------------- the camera
  const tLoop0 = 87.2, tLoop1 = 89.4, tPrint0 = 101.9, tPrint1 = 104.25, tBackP0 = C1.end - .15, tBackP1 = tBackP0 + 3.8;
  const tKnot0 = A.everyN - .7, tKnot1 = tKnot0 + 2.8, tOut0 = A.repairs + .25, tOut1 = tOut0 + 4.1, tSti0 = A.sleep - 1.1, tSti1 = tSti0 + 3.8, tTw0 = A.thisIs + 1.82, tTw1 = tTw0 + 4.3, tDive0 = A.wrote + .55, tDive1 = Q1.start - .02;
  const K = [
    { t: TB, x: 1400, y: 462, k: 1.62 },
    { t: A.theyre + .4, x: 1420, y: 458, k: 1.66 },
    { t: tLoop0, x: 1470, y: 446, k: 1.8 },
    { t: tLoop1, x: 1250, y: 420, k: .98 },
    { t: A.andThey - .1, x: 1210, y: 428, k: .92 },
    { t: A.andThey + 1.9, x: 1100, y: 300, k: .8 },
    { t: A.atY + 1.4, x: 1000, y: 520, k: .86 },
    { t: A.atNight - .3, x: 985, y: 505, k: .85 },
    { t: tPrint0, x: 1000, y: 455, k: .9 },
    { t: tPrint1, ...camP },
    { t: tBackP0, x: camP.x + 8, y: camP.y - 3, k: camP.k * 1.035 },
    { t: tBackP1, x: 1190, y: 545, k: 2.1 },
    { t: tKnot0, x: 1195, y: 548, k: 2.18 },
    { t: tKnot1, x: K1[0] + 14, y: K1[1] - 4, k: 5.2 },
    { t: tOut0, x: K1[0] + 15, y: K1[1] - 5, k: 5.35 },
    { t: tOut1, x: 930, y: 330, k: .72 },
    { t: tSti0, x: 925, y: 318, k: .74 },
    { t: tSti1, x: STI[0], y: STI[1], k: 3.6 },
    { t: tTw0, x: STI[0], y: STI[1], k: 3.6 },
    { t: tTw1, x: TOWER.x + 260, y: 360, k: .6 },
    { t: tDive0, x: TOWER.x + 245, y: 352, k: .7 },
    { t: tDive1, x: WIN.x, y: WIN.y, k: kWin, e: (x) => (1 - Math.cos(Math.PI * Math.pow(clamp(x), 1.8))) / 2 },
  ];
  const cam = (t) => camKeys(K, t);

  // ---------------------------------------------------------------- time of day
  // the dense net softens a little while the camera travels through it fast (keeps the frame-to-frame change calm)
  const moveDim = (t) => 1 - .36 * bump(t, tOut0 + 1.4, 1.2) - .4 * bump(t, tSti0 + 2.55, 1.0) - .12 * bump(t, tTw0 + 1.2, .8);
  const dayAt = (t) => {
    let d = .12 * (1 - sm(clamp((t - 89) / 3))) ;                                      // blue hour that darkens through 2.03
    d = mix(d, 0, sm(clamp((t - A.andThey) / 1.6)));                                     // 2.04: deep night
    d = Math.max(d, sine((t - A.atY + .2) / 1.1) * (1 - sine((t - A.allDay - .85) / 1.0)));   // 2.05: back into pale day, then the sun sinks
    d += .24 * (bump(t, A.everyM + .3, .45) + bump(t, A.everyM + 1.2, .45) + bump(t, A.better, .5));   // 2.10: mornings
    return clamp(d);
  };
  const duskAt = (t) => clamp(.45 * (1 - sm(clamp((t - 88.5) / 3))) * (1 - sm(clamp((t - A.andThey) / 1.4))) + .7 * (bump(t, A.everyM + .3, .45) + bump(t, A.everyM + 1.2, .45) + bump(t, A.better, .54)));
  const starRot = (t) => .3 * sine((t - A.andThey) / 1.9) * (1 - sine((t - A.atY + .1) / 1.1)) + .25 * sine((t - A.everyM) / 2.6);
  const ffGlow = (t) => 1 + .35 * sm(clamp((t - A.andThey) / 1.6)) * (1 - sm(clamp((t - A.atY) / 1))) + .25 * sm(clamp((t - A.atNight) / 1));

  // ---------------------------------------------------------------- the hero firefly (the plate's light), the letter, the loop
  const LOOP = loopCurve([NR, [1450, 300], [1620, 290], [G.x - G.r - 14, G.y - 14], [G.x + 10, G.y + G.r + 22], [1610, 585], [1450, 565], [1372, 505]], [0, .14, .3, .45, .6, .74, .86, .95]);
  const P_LOOP = 3.2;
  const heroS = (t) => piece([[A.acts + .45, -.1], [A.read, 0], [A.work, .45], [A.back, .95], [A.back + .5, 1.05, (x) => x], [A.back + .5 + 30 * P_LOOP, 31.05, (x) => x]], t);
  const LTR = (t) => [mix(2050, 1500, clamp((t - 85.6) / 4)), 330 - 40 * Math.sin((t - 85.6) * .9)];      // the letter drifts across from the right
  const tHit = A.acts + .42;
  const heroW = (t) => {   // world position
    if (t < A.theyre) return [L0[0] + 6 * Math.sin(t * 1.3), L0[1] + 5 * Math.cos(t * 1.1)];
    if (t < A.acts) { const u = sine((t - A.theyre) / 2.4); return [mix(L0[0], 1610, u) + 6 * Math.sin(t * 1.3), mix(L0[1], 445, u) + 5 * Math.cos(t * 1.1)]; }
    const p0 = [1610 + 6 * Math.sin(A.acts * 1.3), 445 + 5 * Math.cos(A.acts * 1.1)];
    if (t < tHit) { const u = eoutX((t - A.acts) / (tHit - A.acts)), L = LTR(tHit); return [mix(p0[0], L[0] - 4, u), mix(p0[1], L[1] - 10, u) - 30 * Math.sin(Math.PI * u)]; }
    if (t < A.read) { const u = sine((t - tHit) / (A.read - tHit)), L = LTR(tHit), c = [1700, 220], a = [L[0] - 4, L[1] - 10];
      return [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * NR[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * NR[1]]; }
    return LOOP(heroS(t));
  };
  // the loopers that join the hero (they come out of the read point)
  const LOOPERS = Array.from({ length: 9 }, (_, j) => ({ t0: A.work + .3 + j * .34, seed: 20 + j }));
  const looperS = (L, t) => (t - L.t0) / P_LOOP;
  // gear notches: every pass of s = .45
  const contacts = (() => { const c = [A.work]; for (const L of LOOPERS) for (let k = 0; k < 6; k++) c.push(L.t0 + (k + .45) * P_LOOP); for (let k = 1; k < 4; k++) c.push(A.work + k * P_LOOP); return c.sort((a, b) => a - b); })();
  const gearAng = (t) => { let a = 0; for (const c of contacts) a += eio(clamp((t - c) / .28)); return a * TAU / 12 + .1; };
  // the stitches written back (weave stitches: u, v, t0)
  const STITCH = (() => {
    const r = prng(9), out = [{ t0: A.back - .1, X: 1372, Y: 505, glyph: 'check' }];
    for (const L of LOOPERS) for (let k = 0; k < 4; k++) out.push({ t0: L.t0 + (k + .95) * P_LOOP, X: 1372 + (r() - .5) * 110, Y: 505 + (r() - .5) * 120, glyph: null });
    for (let k = 1; k < 3; k++) out.push({ t0: A.back + k * P_LOOP, X: 1360 + (r() - .5) * 90, Y: 500 + (r() - .5) * 90 });
    // 2.10: each morning the network grows denser (new nodes all over)
    [A.everyM + .3, A.everyM + 1.1, A.better].forEach((tm, m) => { for (let i = 0; i < 6; i++) out.push({ t0: tm - .25 + i * .12, X: 420 + r() * 1000, Y: 190 + r() * 430 }); });
    out.push({ t0: A.better + .05, X: STI[0], Y: STI[1] });
    return out.filter((s) => s.t0 < 150).map((s) => { const [u, v] = uv(s.X, s.Y); return { t0: s.t0, u, v, glyph: s.glyph || null, from: [s.X + 240, s.Y - 160], dur: .7 }; });
  })();

  // ---------------------------------------------------------------- 2.01: dozens lift out of the network
  const BURST = Array.from({ length: 30 }, (_, i) => { const r = prng(70 + i * 3); const a0 = r() * TAU; return { t0: A.hands + .05 + r() * .9, from: [NET.x + NET.w * (.15 + .8 * r()), NET.y + NET.h * (.15 + .7 * r())], ang: a0, R: 140 + r() * 260, seed: i + 3 }; });
  const burstPos = (b, t) => { const u = eoutX(clamp((t - b.t0) / 1.6)), dr = drift2(t, b.seed); return [b.from[0] + Math.cos(b.ang) * b.R * u + dr[0] * u, b.from[1] + Math.sin(b.ang) * b.R * .6 * u + dr[1] * u]; };
  function drift2(t, sd) { return [30 * Math.sin(t * .5 + sd) + 14 * Math.sin(t * 1.3 + sd * 2), 20 * Math.cos(t * .43 + sd * 1.7) + 10 * Math.sin(t * 1.1 + sd)]; }

  // ---------------------------------------------------------------- 2.05: the YC team, their questions, the chart
  const TEAM = [610, 690, 775, 860, 940].map((x, i) => ({ x, seed: 40 + i, coat: ['#3a4466', '#4a3a52', '#36506a', '#584a3c', '#2f3f5c'][i], dir: i < 2 ? 1 : -1 }));
  const tQ = (i) => A.atY + 1.25 + i * .32;
  const tGather = A.questions - .9;
  const ycPos = (t) => {   // the YC firefly: passes over the heads, dives into the network, draws the chart
    const pts = [[tGather - .6, 1180, 640], [tGather, 600, 700], [tGather + .9, 950, 700], [A.allDay - .4, 860, 560], [A.allDay - .05, 1080, 720]];
    if (t <= pts[0][0]) return [pts[0][1], pts[0][2]];
    for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const u = sine((t - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0])); return [mix(pts[i - 1][1], pts[i][1], u), mix(pts[i - 1][2], pts[i][2], u) - 30 * Math.sin(Math.PI * u)]; }
    const u = clamp((t - pts[pts.length - 1][0]) / 1.2), bars = [[1080, 720], [1080, 660], [1120, 660], [1120, 720], [1120, 630], [1160, 630], [1160, 720], [1160, 600], [1200, 600], [1200, 720]];
    const f = u * (bars.length - 1), i = Math.min(bars.length - 2, Math.floor(f)), q = f - i; return [mix(bars[i][0], bars[i + 1][0], q), mix(bars[i][1], bars[i + 1][1], q)];
  };
  const CHART = [[1080, 720], [1080, 660], [1120, 660], [1120, 720], [1120, 630], [1160, 630], [1160, 720], [1160, 600], [1200, 600], [1200, 720]];

  // ---------------------------------------------------------------- 2.06 → C1 → 2.07–2.09: the night firefly
  const tF2a = A.atNight + .25, tGlowK = (i) => A.failed + .02 + i * .11;
  const f2World = (t) => { const u = sine((t - tF2a) / (A.failed - tF2a + .1)); return [mix(380, 1450, u), 615 - 30 * Math.sin(u * 7) - 40 * u]; };
  const printRect = (c) => { const a = S(c, PRT.x - PRT.w / 2, PRT.y - PRT.h / 2, PRT.Z), b = S(c, PRT.x + PRT.w / 2, PRT.y + PRT.h / 2, PRT.Z); return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] }; };
  const tLand = C1.start - .55, tLift = C1.end - .1;
  const kHover = [K1[0] - 6, K1[1] - 34];
  const f2Screen = (t, c) => {   // returns [x, y, s]
    if (t < A.failed + .1) { const p = f2World(t), q = S(c, p[0], p[1]); return [q[0], q[1], 1.15 * Math.pow(c.k, .5)]; }
    const pr = printRect(c), corner = [pr.x + pr.w - 8, pr.y + 6];
    if (t < tLand) { const a = f2World(A.failed + .1), qa = S(c, a[0], a[1]), u = sine((t - A.failed - .1) / (tLand - A.failed - .1)); return [mix(qa[0], corner[0], u), mix(qa[1], corner[1], u) - 90 * Math.sin(Math.PI * u), mix(1.15 * Math.pow(c.k, .5), 1.7, u)]; }
    if (t < tLift) return [corner[0] + 2 * Math.sin(t * 1.7), corner[1] - 3 + 2 * Math.cos(t * 1.3), 1.7];
    const tA = tBackP1 - .3, hv = S(c, kHover[0], kHover[1]);
    if (t < tA) { const u = sine((t - tLift) / (tA - tLift)); return [mix(corner[0], hv[0], u), mix(corner[1], hv[1], u) - 140 * Math.sin(Math.PI * u), mix(1.7, 1.15 * Math.pow(c.k, .5), u)]; }
    // hover over the knot; on "found" stays; 2.09: lays the proposal beside the knot
    const w = [kHover[0] + 6 * Math.sin(t * 1.1), kHover[1] + 4 * Math.cos(t * 1.4)];
    if (t > tKnot1 - .6) { const u = sine((t - tKnot1 + .6) / 1.6), pp = [mix(w[0], K1[0] + 26, u), mix(w[1], K1[1] - 22, u)]; const q = S(c, pp[0], pp[1]); return [q[0], q[1], 1.15 * Math.pow(c.k, .5)]; }
    const q = S(c, w[0], w[1]); return [q[0], q[1], 1.15 * Math.pow(c.k, .5)];
  };
  // knot states: untie 0..1 per knot
  const untieAt = [A.better + .05, A.better - .4, A.everyM + 1.1, A.everyM + .35, A.repairs + .05, A.everyM + .3];
  const knotUntie = (i, t) => eio(clamp((t - untieAt[i]) / (i === 4 ? .9 : .6)));
  const knotGlow = (i, t) => (t > tGlowK(i) ? eoutX(clamp((t - tGlowK(i)) / .3)) * (.75 + .25 * Math.sin(t * 2.2 + i)) : 0) * (1 - knotUntie(i, t));

  // ---------------------------------------------------------------- 2.13: the long strand to the tower, the waves, the people
  const STR = (q) => { const a = STI, b = [WIN.x, WIN.y], c1 = [300, 120], c2 = [-1000, 60]; const m = 1 - q; return [m * m * m * a[0] + 3 * m * m * q * c1[0] + 3 * m * q * q * c2[0] + q * q * q * b[0], m * m * m * a[1] + 3 * m * m * q * c1[1] + 3 * m * q * q * c2[1] + q * q * q * b[1]]; };
  const tSpark0 = tTw0 - .5, tSpark1 = tTw1 - .2;
  const WR = (() => { const r = prng(808), m = new Map(); for (let j = 0; j < TOWER.rows; j++) for (let i = 0; i < TOWER.cols; i++) { const v = r(), d = r(); const near = Math.abs(i - WIN.i) <= 3 && Math.abs(j - WIN.j) <= 2; m.set(i + ',' + j, { out: (v < .4 || near) && !(i === WIN.i && j === WIN.j), d, near }); } return m; })();
  const winOut = (t) => (i, j) => { const w = WR.get(i + ',' + j); if (!w.out) return 0; const t0 = w.near ? A.cut + .05 + w.d * .3 : A.cut + (j / TOWER.rows) * .85 + w.d * .25; return clamp((t - t0) / .35); };
  // from "wrote it like this" the building goes quiet: every pane but the one where it was written dims, in a ring spreading from it
  const winDim = (t) => (i, j) => { if (i === WIN.i && j === WIN.j) return 1; const d = Math.hypot(i - WIN.i, (j - WIN.j) * .8); return 1 - .88 * sine((t - A.wrote - .1 - d * .05) / 1.1); };
  const LEAVERS = Array.from({ length: 14 }, (_, i) => { const r = prng(500 + i); return { t0: A.four + .5 + i * .09 + r() * .2, dir: i % 2 ? 1 : -1, v: 26 + r() * 18, seed: i, coat: ['#2f3a58', '#3e3448', '#2c4458'][i % 3] }; });

  // ---------------------------------------------------------------- Q1: the card (its paper IS the plate in screen space)
  const tSwitch = tDive1;                   // from here the window's glass is the card
  const sCard0 = WIN.w * kWin / 1240;         // the card's scale at the switch (it over-fills the frame like the glass)
  const QLINES = ['…the intelligence lives', 'in the system.']; const QATTR = 'JACK DORSEY & ROELOF BOTHA · MARCH 2026';   // c04 opens on the same card (same layout, same target)
  const qAt = tSwitch + .55, qPer = .3, tBack1 = tSwitch + 1.7, sRead = 1.18;
  const tPush0 = Q1.end - 1.95, tPush1 = TE, sEnd = 11;
  // the dive target: the paper just right of "system." (no ink in the final frame)
  let TGT = null;
  const card = (t) => {
    const s1 = sRead * 1.03;
    if (t < tBack1) { const u = sine((t - tSwitch) / (tBack1 - tSwitch)); return { x: W / 2, y: H / 2 + 10 * u, s: Math.exp(mix(Math.log(sCard0), Math.log(sRead), u)) }; }
    if (t < tPush0) { const u = clamp((t - tBack1) / (tPush0 - tBack1)); return { x: W / 2, y: H / 2 + 10, s: sRead * Math.exp(Math.log(1.03) * u) }; }
    const u = sine((t - tPush0) / (tPush1 - tPush0 - 1 / 30)), s = Math.exp(mix(Math.log(s1), Math.log(sEnd), u));
    const P0 = [W / 2 + TGT[0] * s1, H / 2 + 10 + TGT[1] * s1], sp = [mix(P0[0], W / 2, u), mix(P0[1], H / 2, u)];
    return { x: sp[0] - TGT[0] * s, y: sp[1] - TGT[1] * s, s };
  };
  function cardFrame(ctx, t) {
    const c = card(t);
    ctx.fillStyle = '#0a0c1e'; ctx.fillRect(0, 0, W, H);
    quoteCard(ctx, t, { x: c.x, y: c.y, s: c.s, breathe: 0, lines: QLINES, quote: QLINES.join(' '), attrib: QATTR, t0: qAt, per: qPer, light: 0, shadow: .8, paper: (g) => HO.plate(g, t) });
  }

  // ---------------------------------------------------------------- drawing the world
  const NETSEED = 5;
  function network(ctx, t, c, o = {}) {
    const R = netRect(c); if (R.x > W + 200 || R.x + R.w < -200 || R.y > H + 200 || R.y + R.h < -200) return;
    const mornings = [A.everyM + .3, A.everyM + 1.1, A.better].reduce((a, tm) => a + sm(clamp((t - tm + .2) / .5)), 0);
    const day = dayAt(t), a = (1 - .45 * day) * (1 + .1 * mornings) * (o.a ?? 1) * moveDim(t);
    weave(ctx, t, { x: R.x, y: R.y, w: R.w, h: R.h, seed: NETSEED, a, shape: 'brain', cols: 34, rows: 20, oldGlow: .15 * mornings, stitches: STITCH.filter((s) => t > s.t0 - .05), pulse: o.pulse });
  }
  function knots(ctx, t, c) {
    if (t < A.atNight - .2) return;
    KN.forEach(([X, Y], i) => {
      const p = S(c, X, Y), r = 8 * Math.pow(c.k, .6); if (p[0] < -100 || p[0] > W + 100 || p[1] < -100 || p[1] > H + 100) return;
      const g = knotGlow(i, t), un = knotUntie(i, t);
      if (g > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const rg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 4.5); rg.addColorStop(0, rgba('#d0603a', .55 * g)); rg.addColorStop(.4, rgba('#7a3b2a', .3 * g)); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(p[0] - r * 4.5, p[1] - r * 4.5, r * 9, r * 9); ctx.restore(); }
      knot(ctx, t, p[0], p[1], { r, untie: un, seed: 11 + i, a: 1 });
    });
  }
  function land2(ctx, t, c) { land(ctx, t, c, { day: dayAt(t), dusk: duskAt(t), rot: starRot(t), sun: { u: clamp((t - A.allDay + .25) / 1.35) } }); }

  function world(ctx, t, c) {
    land2(ctx, t, c);
    // the empty stone (2.07): the place in front where nobody stands yet
    { const p = S(c, STONE[0], STONE[1]), k = c.k; if (p[0] > -300 && p[0] < W + 300 && p[1] < H + 100) { ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(k, k); const day = dayAt(t);
        ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(10, 26, 92, 14, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = day > .5 ? '#4a5068' : '#141733'; ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-68, 22); ctx.quadraticCurveTo(0, 34, 68, 22); ctx.lineTo(70, 0); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .8; ctx.beginPath(); for (let q = -64; q < 66; q += 5) { ctx.moveTo(q, 4 + Math.abs(q) * .02); ctx.lineTo(q + 3, 24 - Math.abs(q) * .05); } ctx.stroke();
        ctx.fillStyle = day > .5 ? '#6a7088' : '#22264a'; ctx.beginPath(); ctx.ellipse(0, 0, 70, 12, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = rgba('#a49ad8', .45); ctx.lineWidth = 1.2 / k; ctx.stroke(); ctx.restore(); } }
    // the tower, far left (2.13)
    if (c.x - W / 2 / c.k < TOWER.x + TOWER.w / 2 + TOWER.side + 200) tower(ctx, t, c, { out: winOut(t), dim: winDim(t), litFrac: 1 - .6 * sm(clamp((t - A.wrote) / 1.6)) });
    if (t > A.four + .4) plane(ctx, c, (g) => { for (const L of LEAVERS) { if (t < L.t0) continue; const d = t - L.t0, x = TOWER.x + L.dir * (40 + d * L.v); smallFigure(g, t, x, FLOOR + 2, 34, { dir: L.dir, seed: L.seed, coat: L.coat, rim: '#f1e4c6' }); } });
    // the long strand from the network to the tower (2.12 → 2.13)
    if (t > A.better) { const fa = sm(clamp((t - A.better) / 1)); plane(ctx, c, (g) => { g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.beginPath(); for (let k = 0; k <= 80; k++) { const p = STR(k / 80); k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.strokeStyle = rgba(F8.gold, .1 * fa); g.lineWidth = 6 / Math.pow(c.k, .5); g.stroke(); g.strokeStyle = rgba(F8.gold, .55 * fa); g.lineWidth = 1.3 / Math.pow(c.k, .6); g.stroke(); g.restore(); }); }
    // the network and its failures
    const br = t > A.something - .3 && t < A.sleep + 1.6 ? { u: clamp((t - A.something + .1) / 3.6), x: .5, y: 1 } : null;
    network(ctx, t, c, { pulse: br });
    if (br) breath(ctx, t, c, br.u);
    knots(ctx, t, c);
    // the gear (2.03 …)
    { const p = S(c, G.x, G.y); if (p[0] > -200 && p[0] < W + 200) { const lastC = contacts.filter((x) => x <= t).pop(); gear(ctx, t, p[0], p[1], G.r * c.k, gearAng(t), 1, { lit: lastC ? Math.exp(-(t - lastC) * 3) : 0 }); } }
    // the clip print (C1)
    if (t > tPrint0 - .5 && t < tBackP1 + .5) { const pr = printRect(c); if (PRT.Z + FCAM / c.k > 60 && pr.w > 4 && pr.x < W + 50 && pr.x + pr.w > -50) clipPrint(ctx, t, T, 'C1', { x: pr.x, y: pr.y, w: pr.w, h: pr.h, mat: 70 * pr.w / 1120, lowerY: 848, lower: t > C1.start ? undefined : 0 }); }
  }
  // the breath of 2.11: a broad soft band of light rising through the network (bottom → top, 3.6 s)
  function breath(ctx, t, c, u) {
    const R = netRect(c), y = R.y + R.h * (1.1 - 1.25 * sine(u)), a = Math.sin(Math.PI * u);
    ctx.save(); ctx.beginPath(); ctx.ellipse(R.x + R.w / 2, R.y + R.h / 2, R.w * .52, R.h * .54, 0, 0, TAU); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(0, y - R.h * .3, 0, y + R.h * .3); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.5, rgba('#c99a52', .22 * a)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(R.x - 50, y - R.h * .3, R.w + 100, R.h * .6); ctx.restore();
  }

  function hands(ctx, t, c) {
    const kf = Math.pow(c.k, .55), gl = ffGlow(t);
    // 2.01: the burst out of the network (they stay as a drifting swarm until the loop takes over)
    if (t > A.hands && t < A.andThey + 1.5) for (const b of BURST) {
      if (t < b.t0) continue; const tr = []; for (let k = 6; k >= 0; k--) { const tt = Math.max(b.t0, t - .3 * k / 6), p = burstPos(b, tt), q = S(c, p[0], p[1]); tr.push([q[0], q[1]]); }
      const p = tr[tr.length - 1], born = clamp((t - b.t0) / .25);
      if (born < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const r0 = 30 * kf * (1 - born) + 4; const rg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r0); rg.addColorStop(0, rgba(F8.goldCore, .7 * (1 - born))); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(p[0] - r0, p[1] - r0, 2 * r0, 2 * r0); ctx.restore(); }
      const away = sm(clamp((t - A.andThey - .3) / 1.2));   // later they rise away into the night (out of frame)
      const pp = [p[0], p[1] - away * 900];
      firefly(ctx, t, { x: pp[0], y: pp[1], s: .7 * kf, seed: b.seed, trail: tr.map((q) => [q[0], q[1] - away * 900]), glow: gl, pulse: bump(t, A.hands + .35, .15) * .8 });
    }
    // 2.02–2.03: the hero
    if (t < tPrint0) {
      const hw = heroW(t), q = S(c, hw[0], hw[1]); const tr = []; for (let k = 8; k >= 0; k--) { const tt = Math.max(TB, t - .35 * k / 8), w2 = heroW(tt), qq = S(cam(tt), w2[0], w2[1]); tr.push([qq[0], qq[1]]); }
      const pu = bump(t, A.answer + .1, .18) + bump(t, A.acts + .05, .12), sz = (t < A.read ? 1.5 : 1.05) * kf;
      if (t > A.answer - .05 && t < A.answer + 1.2) pulse(ctx, t, q[0], q[1], (t - A.answer + .05) / 1.1, { r: 140 * kf, col: 'green', a: .9 });
      // read: the thread pulled out of the network trails behind (s 0 … .4)
      const hs = t > A.read ? heroS(t) : -1;
      if (hs >= 0) threadTrail(ctx, t, c, hs % 1, heroS, 0);
      firefly(ctx, t, { x: q[0], y: q[1], s: sz, seed: 1, trail: t < TB + .6 ? null : tr, glow: gl * (t < TB + 1.2 ? .4 + .6 * sm((t - TB) / 1.2) : 1), pulse: pu });
      // the letter (2.02): drifts in from the right, sealed in flight, flies on and away
      if (t > 85.4 && t < A.read + 1.6) { const away = sine((t - tHit - .3) / 1.8), L = LTR(Math.min(t, tHit + .3)), lw = [L[0] + away * 520, L[1] - away * 300], p = S(c, lw[0], lw[1]); letter(ctx, t, p[0], p[1], 1.25 * kf, clamp((t - tHit) / .25), -.12 + .1 * Math.sin(t * 1.4)); if (t > tHit && t < tHit + .5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const rg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 60 * kf); rg.addColorStop(0, rgba(F8.green, .5 * (1 - (t - tHit) / .5))); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(p[0] - 60 * kf, p[1] - 60 * kf, 120 * kf, 120 * kf); ctx.restore(); } }
      // the loopers
      for (const L of LOOPERS) { if (t < L.t0) continue; const s = looperS(L, t), tr2 = []; for (let k = 6; k >= 0; k--) { const tt = Math.max(L.t0, t - .3 * k / 6), w2 = LOOP(looperS(L, tt)), qq = S(cam(tt), w2[0], w2[1]); tr2.push([qq[0], qq[1]]); }
        threadTrail(ctx, t, c, s % 1, (tt) => looperS(L, tt), L.seed);
        const w = LOOP(s), p = S(c, w[0], w[1]), born = clamp((t - L.t0) / .3); firefly(ctx, t, { x: p[0], y: p[1], s: .9 * kf * (.4 + .6 * born), seed: L.seed, trail: tr2, glow: gl }); }
    }
    // 2.05: the YC firefly and its chart, the questions
    if (t > A.atY && t < A.atNight + .6) yc(ctx, t, c, kf, gl);
    // 2.06 …: the night firefly
    if (t > tF2a - .2 && t < tTw0 + .4) {
      const p = f2Screen(t, c), born = clamp((t - tF2a + .2) / .4), tr = []; for (let k = 8; k >= 0; k--) { const tt = Math.max(tF2a - .2, t - .4 * k / 8), q = f2Screen(tt, cam(tt)); tr.push([q[0], q[1]]); }
      // on "found": its light jumps to two more knots
      if (t > A.found && t < A.found + 1.6) for (const [i, d] of [[3, 0], [5, .18]]) { const u = clamp((t - A.found - d) / .45); if (u <= 0) continue; const kq = S(c, KN[i][0], KN[i][1]), e = eoutX(u), fade = 1 - clamp((t - A.found - d - .9) / .7);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.strokeStyle = rgba(F8.green, .7 * fade); ctx.lineWidth = 1.6; ctx.beginPath(); const mx = (p[0] + kq[0]) / 2, my = Math.min(p[1], kq[1]) - 80 * kf; for (let k2 = 0; k2 <= 20; k2++) { const q = k2 / 20 * e; const x = (1 - q) ** 2 * p[0] + 2 * (1 - q) * q * mx + q * q * kq[0], y = (1 - q) ** 2 * p[1] + 2 * (1 - q) * q * my + q * q * kq[1]; k2 ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        if (u >= 1) { const rg = ctx.createRadialGradient(kq[0], kq[1], 0, kq[0], kq[1], 50 * kf); rg.addColorStop(0, rgba(F8.green, .45 * fade)); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(kq[0] - 50 * kf, kq[1] - 50 * kf, 100 * kf, 100 * kf); } ctx.restore(); }
      if (t > A.nobody + 2 && t < A.found + 1.2) { const kq = S(c, K1[0], K1[1]); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const rg = ctx.createRadialGradient(kq[0], kq[1], 0, kq[0], kq[1], 80 * kf); rg.addColorStop(0, rgba(F8.green, .3 * sm(clamp((t - A.nobody - 2) / .6)))); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(kq[0] - 80 * kf, kq[1] - 80 * kf, 160 * kf, 160 * kf); ctx.restore(); }
      proposal(ctx, t, c);
      firefly(ctx, t, { x: p[0], y: p[1], s: p[2] * (.3 + .7 * born), seed: 7, trail: tr, glow: gl * (.6 + .4 * born), pulse: bump(t, A.failed, .2) + bump(t, A.found + .05, .15) });
    }
    // 2.07 …: a few fireflies drift and weave over the network (it is never empty); 2.11: they stitch
    if (t > A.atNight && t < tTw1) { const R = netRect(c); swarm(ctx, t, { n: 10, mode: 'drift', cx: R.x + R.w * .5, cy: R.y + R.h * .45, rx: R.w * .45, ry: R.h * .35, seed: 31, s: .7 * kf, a: 1 }); }
    // C1: two or three behind the print
    // 2.12: the spark on the fresh stitch, then along the long strand to the tower
    spark(ctx, t, c);
  }
  // a gold thread pulled out of the network while the firefly flies to the gear (s 0 … .42)
  function threadTrail(ctx, t, c, s, sFn, seed) {
    if (s > .44 || s < .01) return; const a = Math.sin(Math.PI * s / .44);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.beginPath();
    for (let k = 0; k <= 14; k++) { const ss = Math.max(0, s - .16 * k / 14), w = LOOP(ss), q = S(c, w[0], w[1]); k ? ctx.lineTo(q[0], q[1] + 3 * Math.sin(k * .9 + t * 3)) : ctx.moveTo(q[0], q[1]); }
    ctx.strokeStyle = rgba(F8.gold, .75 * a); ctx.lineWidth = 1.6 * Math.pow(c.k, .5); ctx.stroke(); ctx.restore();
  }
  function yc(ctx, t, c, kf, gl) {
    const day = dayAt(t);
    plane(ctx, c, (g) => { TEAM.forEach((m, i) => smallFigure(g, t, m.x, FLOOR + 2, 112, { dir: m.dir, seed: m.seed, coat: m.coat, arm: i === 2 ? .5 + .2 * Math.sin(t * 2) : .15, rim: day > .5 ? null : '#c9c0e8' })); });
    // the questions rise from the heads; the firefly gathers them
    TEAM.forEach((m, i) => { const t0 = tQ(i); if (t < t0) return; const rise = eoutX(clamp((t - t0) / .7)); let w = [m.x + 4, FLOOR - 112 - 22 - 50 * rise];
      const tg = tGather + (m.x - 600) / 350 * .9; if (t > tg) { const f = ycPos(t); w = [f[0] + 14, f[1] - 18 - i * 3]; if (t > A.allDay - .45) return; }
      const q = S(c, w[0], w[1]); glyph(ctx, 'question', q[0], q[1], 1.9 * kf, day > .5 ? '#2a2f4a' : F8.greenCore, .9 * clamp((t - t0) / .2)); });
    // the YC firefly
    if (t > tGather - 1.2) { const tr = []; for (let k = 6; k >= 0; k--) { const tt = t - .35 * k / 6, w = ycPos(tt), q = S(cam(tt), w[0], w[1]); tr.push([q[0], q[1]]); } const w = ycPos(t), q = S(c, w[0], w[1]); firefly(ctx, t, { x: q[0], y: q[1], s: 1.1 * kf, seed: 4, trail: tr, glow: gl }); }
    // the chart it draws in the air (strokes of light), stays until night
    const tc = A.allDay - .05; if (t > tc) { const u = clamp((t - tc) / 1.2), n = Math.max(2, Math.floor(u * (CHART.length - 1)) + 2); ctx.save(); ctx.globalCompositeOperation = day > .5 ? 'source-over' : 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); CHART.slice(0, n).forEach((p, k) => { const q = S(c, p[0], p[1]); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.strokeStyle = day > .5 ? rgba('#2c6a50', .9) : rgba(F8.green, .9); ctx.lineWidth = 2.2 * kf; ctx.stroke(); ctx.restore(); }
    // label
    const la = clamp((t - A.atY - .15) / .6) * (1 - clamp((t - A.atNight + .4) / .4)); if (la > 0) { ctx.save(); ctx.beginPath(); ctx.rect(110, 120, 420 * eoutX(la), 70); ctx.clip(); text(ctx, 'Y COMBINATOR', 120, 168, { size: 26, weight: 600, color: rgba('#1d2236', .9 * clamp(day * 2)), spacing: 7 }); text(ctx, 'Y COMBINATOR', 120, 168, { size: 26, weight: 600, color: rgba('#efe4c6', .9 * clamp(1 - day * 2)), spacing: 7 }); ctx.strokeStyle = rgba(day > .5 ? '#1d2236' : '#f3d9a0', .6); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(120, 184); ctx.lineTo(330, 184); ctx.stroke(); ctx.restore(); }
  }
  // 2.09: the proposal: a dotted strand from the knot to a neighbour, then solid gold
  function proposal(ctx, t, c) {
    const t0 = A.everyN + .5; if (t < t0 || t > A.better + 1) return;
    const a = S(c, K1[0], K1[1]), b = S(c, K1[0] + 70, K1[1] - 52), b2 = S(c, K1[0] - 64, K1[1] - 40), u = eoutX(clamp((t - t0) / 1)), solid = eoutX(clamp((t - A.repairs) / .35));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const [q, d] of [[b, 0], [b2, .3]]) { const uu = eoutX(clamp((t - t0 - d) / 1)); if (uu <= 0) continue; const mx = (a[0] + q[0]) / 2 + (q[1] - a[1]) * .25, my = (a[1] + q[1]) / 2 - (q[0] - a[0]) * .25;
      ctx.beginPath(); for (let k = 0; k <= 30; k++) { const s = k / 30 * uu, x = (1 - s) ** 2 * a[0] + 2 * (1 - s) * s * mx + s * s * q[0], y = (1 - s) ** 2 * a[1] + 2 * (1 - s) * s * my + s * s * q[1]; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      if (solid < 1) { ctx.setLineDash([2, 9]); ctx.strokeStyle = rgba(F8.green, .85 * (1 - solid)); ctx.lineWidth = 2.4; ctx.stroke(); ctx.setLineDash([]); }
      if (solid > 0) { ctx.strokeStyle = rgba(F8.gold, .25 * solid); ctx.lineWidth = 10; ctx.stroke(); ctx.strokeStyle = rgba(F8.goldCore, .9 * solid); ctx.lineWidth = 2.2; ctx.stroke(); } }
    ctx.restore();
  }
  // 2.12: the spark on the fresh stitch (runs out along its strand twice), then the long run to the tower
  function spark(ctx, t, c) {
    if (t < A.thisIs - .4 || t > tSpark1 + .6) return;
    const p = S(c, STI[0], STI[1]), k = c.k;
    // the fresh node, close: a bright soma with a halo
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const rg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 26 * k); rg.addColorStop(0, rgba(F8.goldCore, .9)); rg.addColorStop(.2, rgba(F8.gold, .4)); rg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = rg; ctx.fillRect(p[0] - 26 * k, p[1] - 26 * k, 52 * k, 52 * k);
    // runs along the strand toward the right (twice), then the long run along STR
    const runs = [A.thisIs + .3, A.cant - .05];
    for (const r0 of runs) { const u = clamp((t - r0) / 1.0); if (u <= 0 || u >= 1) continue; const q = [STI[0] + 60 * u, STI[1] - 22 * Math.sin(Math.PI * u * .8) + 10 * u], sq = S(c, q[0], q[1]); sparkDot(ctx, sq, k, 1 - u * .5); }
    if (t > tSpark0) { const u = eio(clamp((t - tSpark0) / (tSpark1 - tSpark0))); for (let j = 0; j < 8; j++) { const q = STR(Math.max(0, u - j * .006)), sq = S(c, q[0], q[1]); if (j === 0) sparkDot(ctx, sq, Math.max(1, k * .5), 1); else { ctx.fillStyle = rgba(F8.goldCore, .5 * (1 - j / 8)); ctx.fillRect(sq[0] - 1.5, sq[1] - 1.5, 3, 3); } } }
    ctx.restore();
  }
  function sparkDot(ctx, q, k, a) { const r = 10 * Math.pow(k, .6); const g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], r * 3); g.addColorStop(0, rgba('#ffffff', a)); g.addColorStop(.2, rgba(F8.goldCore, .7 * a)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(q[0] - r * 3, q[1] - r * 3, r * 6, r * 6); }

  // labels of 2.13 and the number
  function blockLabels(ctx, t) {
    const u1 = clamp((t - A.jack - 1.5) / .7) * (1 - clamp((t - A.four + .2) / .4)), u2 = clamp((t - A.roelof - .05) / .7) * (1 - clamp((t - A.four + .2) / .4));
    if (u1 > 0) nameLabel(ctx, t, { x: 1150, y: 360, name: 'Jack Dorsey', role: 'RUNS BLOCK', u: u1 });
    if (u2 > 0) nameLabel(ctx, t, { x: 1150, y: 560, name: 'Roelof Botha', role: 'BLOCK BOARD', u: u2 });
    const u3 = clamp((t - A.four - .1) / .6), o3 = clamp((t - tDive1 + .45) / .3); if (u3 > 0 && o3 < 1) {
      ctx.save(); ctx.beginPath(); ctx.rect(1110 + 600 * eoutX(o3), 370, 600 * eoutX(u3) * (1 - eoutX(o3)) + 1, 290); ctx.clip();
      ctx.fillStyle = 'rgba(8,9,24,.82)'; ctx.fillRect(1110, 370, 560, 270); ctx.strokeStyle = rgba('#b9b0e0', .35); ctx.lineWidth = 1; ctx.strokeRect(1118.5, 378.5, 543, 253);
      text(ctx, '≈', 1150, 516, { size: 84, weight: 400, color: '#f3ecda' }); text(ctx, '4,000', 1212, 520, { size: 120, font: 'Instrument Serif', color: '#f3ecda' }); text(ctx, 'JOBS CUT', 1158, 572, { size: 24, weight: 600, color: rgba('#e9dcc0', .9), spacing: 7 });
      text(ctx, 'FORTUNE · 2 APR 2026', 1158, 612, { size: 15, weight: 500, color: rgba('#cfc6e8', .7), spacing: 3 }); ctx.restore(); }
  }
  // the chapter label
  function chapter(ctx, t) {
    const u = eoutX(clamp((t - A.hands - .1) / .5)), o = eoutX(clamp((t - A.answer + .4) / .45)); if (u <= 0 || o >= 1) return;
    const x = 120, y = 150, wdt = 300; ctx.save(); ctx.beginPath(); ctx.rect(x - 4 + wdt * o, y - 40, wdt * (u - o) + 8, 70); ctx.clip();
    text(ctx, 'II', x, y, { size: 26, font: 'Instrument Serif', color: '#b9f0c8' }); text(ctx, '·  HANDS', x + 30, y - 2, { size: 19, weight: 600, color: '#f3ecda', spacing: 6 });
    ctx.strokeStyle = rgba('#b9f0c8', .7); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.lineTo(x + 200, y + 16); ctx.stroke(); ctx.restore();
  }

  // ---------------------------------------------------------------- the frame
  const tInEnd = TB + 2.1;
  const draw = (ctx, t) => {
    if (t >= tSwitch) { cardFrame(ctx, t); return; }
    const c = cam(t);
    world(ctx, t, c);
    hands(ctx, t, c);
    if (t > A.jack - .2 && t < tDive1) blockLabels(ctx, t);
    // the target window during the dive: its glass is the cream paper (the plate, in screen space)
    if (t > tDive0) { const a = S(c, WIN.x - WIN.w / 2, WIN.y - WIN.h / 2), b = S(c, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2); ctx.save(); ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.clip(); HO.plate(ctx, t); ctx.restore(); }
    chapter(ctx, t);
    if (t < tInEnd) { const hw = heroW(t), q = S(c, hw[0], hw[1]); glowFrom(ctx, t, HI.plate, sine((t - TB) / (tInEnd - TB)), [q[0], q[1]], { kMin: .03, a: .45 }); }
  };

  await ready(); await cardsReady();
  // the dive target on the card: the paper just right of "system." (layout from a dry run)
  { const { canvas } = await import('../engine.mjs'); const [, g] = canvas(8, 8); const r = quoteCard(g, 0, { x: 0, y: 0, s: 1, breathe: 0, lines: QLINES, quote: QLINES.join(' '), attrib: QATTR, u: 0 }); const w = r.words.find((q) => q.w === 'system.'); TGT = [w.x + w.wd + 150, w.y - r.local.size * .3]; }
  // warm the network geometry (2–7 s once)
  { const { canvas } = await import('../engine.mjs'); const [, g] = canvas(64, 64); weave(g, 0, { x: 0, y: 0, w: NET.w, h: NET.h, seed: NETSEED, shape: 'brain', cols: 34, rows: 20 }); await ready(); }

  const SOUND = {
    [TB]: [{ f: 'wings', t: TB + .1, v: .25 }],
    [A.theyre]: [{ f: 'foil_glint', t: A.acts + .42, v: .3 }],
    [A.read - .36]: [{ f: 'chime', t: A.back - .05, v: .22 }],
    [A.atNight]: [{ f: 'wings', t: A.failed + .3, v: .25 }],
    [A.jack]: [{ f: 'whoosh_airy', t: tDive0 + 1.2, v: .3 }],
  };
  const starts = [TB, A.theyre, A.read - .36, A.andThey, A.atY, A.atNight, C1.start, A.nobody, A.found - .28, A.everyN, A.everyM, A.something, A.thisIs, A.jack, tSwitch];
  return starts.map((t0, i) => ({ t: t0, tr: 'cut', d: .1, print: i === 0 ? HI.print : t0 >= tSwitch ? HO.print : PR, draw, sound: SOUND[t0] }));
};
