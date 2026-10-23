// Film 7 · c12 · the answer and the end (07a + the end plate), from the c11>c12 dawn light plate (H.b ≈ 666.27) to the end of the film
// (T.duration ≈ 716.96). Builder: c12. ONE continuous take in c06's orbit world at dawn (kit sky, Earth, ring; the split's cool line and the
// amber line lying in the ring are c06's own objects, copied into lib/f7_c12_end.mjs). Every accent is anchored to a word (T.S / T.E).
//
// | shot  | VO words (anchor)                                | image                                                                              | hero light        | camera                                   | flows on by                                     | ★ / sound             |
// |-------|--------------------------------------------------|------------------------------------------------------------------------------------|-------------------|------------------------------------------|-------------------------------------------------|-----------------------|
// | 12.01 | So, can superintelligence grow forever?          | out of the dawn plate: it is the sun rising on the Earth's limb; the camera pulls  | the sunrise       | pull back out of the sun 2.8 s (expo-out,| out of the plate's light (dawnOut: the plate     |                       |
// |       |                                                  | back and the split curve lies over the Earth: the cool line climbing from the hero |                   | anchor: the sun), then a slow drift      | shrinks into the sun) · take                    |                       |
// |       |                                                  | city into the stars, the amber line lying calm in the ring round the Earth         |                   |                                          |                                                 |                       |
// | 12.02 | In what it knows, maybe. In what it takes, no.   | "knows": a star-glint runs up the cool line, which brightens and stays bright;    | the cool line     | slow drift                               | continuous                                      | shimmer_rings (pause  |
// |       |                                                  | "takes": the amber line breathes once (a last spray of sparks) and settles still  | the amber line    |                                          |                                                 | after maybe.),        |
// |       |                                                  | in the ring; "no.": the ring brightens a breath                                    |                   |                                          |                                                 | flame_breath (no.)    |
// | 12.03★| And that might be the best news of all. The wall | push in to the dome: "wall": the rim light runs along the whole glass, but where   | the dome rim,     | push 2.1 s (quart), slow drift           | continuous                                      | glass_hum (wall),     |
// |       | was never in front of intelligence. Only in      | the cool line passes it stays dark (a gap); "never … intelligence": a star-glint   | then the glint    |                                          |                                                 | chime (the glint      |
// |       | front of appetite.                               | rises up the cool line and passes through the glass like starlight (a soft        |                   |                                          |                                                 | passes, pause)        |
// |       |                                                  | chromatic sparkle, no resistance) on into the stars; "Only … appetite": the rim    |                   |                                          |                                                 |                       |
// |       |                                                  | light withdraws until it burns only above the amber line, warm under the glass     |                   |                                          |                                                 |                       |
// | 12.04 | The furnace or the ring. The technology won't    | "furnace": for half a second the left of the vault glows furnace red with smoke   | furnace / ring    | hold; "choose": dive ×4 to the limb      | continuous (the dive lands on the people:       | whoosh_airy (dive)    |
// |       | choose. We will.                                 | under the glass (c07's furnace), then sinks back; "ring": the ring on the right   | then the dawn     | 1.45 s (quart, anchor: the people)       | they stood on the limb all along)               |                       |
// |       |                                                  | brightens; "choose": the camera dives to the limb: it is a hill crest at dawn; a  |                   |                                          |                                                 |                       |
// |       |                                                  | row of six people seen from behind; "We will": they lift their heads to the ring   |                   |                                          |                                                 |                       |
// | 12.05 | We don't need a bigger planet. We need a wiser   | the camera rises from the people to the whole Earth (×45, anchor: the people):    | the ring          | rise 4.0 s (quart, log zoom)             | continuous                                      | whoosh_up (rise),     |
// |       | way to live on this one. And for the first time, | small, finite, with the ring; "this one": a wave of light runs both ways round the |                   | then a slow drift up                     |                                                 | bloom (ring closes)   |
// |       | we might have the intelligence to find it.       | ring and closes at its far side; "intelligence": a glint climbs the cool line into |                   |                                          |                                                 |                       |
// |       |                                                  | the stars                                                                           |                   |                                          |                                                 |                       |
// | 12.06 | So tell us in the comments. What should          | the Earth drifts up; the question writes itself into the night sky below it, line  | the question      | slow drift                               | continuous; the question wipes out at +3 s      |                       |
// |       | superintelligence make abundant first?           | by line as spoken (Instrument Serif, calm), readable ~3 s after "first?"          |                   |                                          |                                                 |                       |
// | 12.07 | END PLATE (~16.9 s after the last word)          | the Earth with its ring top centre, the sun on its limb, the cool line rising off  | the ring          | very slow drift (+ the global float)     | the film ends on it                             | swell (end)           |
// |       |                                                  | the top; no text, no new elements; stars twinkle, ring sparkles, a slow glint;      |                   |                                          |                                                 |                       |
// |       |                                                  | the end-screen regions (SAFE) left dark and calm                                   |                   |                                          |                                                 |                       |
// Ambience: atmo/nightsky from the start; atmo/dawn (soft) under the hill 12.04–12.05 (from +18.9 s to +24.5 s after the chunk start); nightsky to the end.
// Changes vs shots.md: 12.01 "from above" is c06's orbit view (the film's language for the split) rather than a top-down view; 12.04's hill is the
// Earth's limb itself (the dive lands on a crest where the people already stood, c07's storybook scale), so 12.05's rise is one zoom with no cut;
// 12.06 shows only the question (no "tell us in the comments" label).
import { W, H, rgba, clamp, lin, mix, sm } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F7, EARTH, f7Prepare, skyWarm, sky, camO, curve, ring, ease, glowAt } from '../lib/f7_kit.mjs';
import { bump, saOf, dawnOut, coolPts, coolPath, AMBER, AMB_SA, CROSS, COOL_LEN, qAtLen, RING_R, SUN, sunAt, sunrise, sunriseLimb, dawnSky, earth,
  domeRim, starPass, starGlint, furnaceSide, ringWave, PEOPLE, peoplePrepare, people, crest, question, endShade } from '../lib/f7_c12_end.mjs';

const TAU = Math.PI * 2;
const SANG = -.12;   // the Milky Way arcs across the top of the sky (in the end plate it sags behind the Earth, above the end-screen boxes)
// camera keys [t, [x, y, z], ease?] with z interpolated in log space (c06's camK)
function camK(t, K) {
  if (t <= K[0][0]) return K[0][1];
  for (let i = 1; i < K.length; i++) if (t <= K[i][0]) {
    const [t0, a] = K[i - 1], [t1, b, f] = K[i], u = (f || ease.io)(lin(t0, t1, t));
    return [mix(a[0], b[0], u), mix(a[1], b[1], u), Math.exp(mix(Math.log(a[2]), Math.log(b[2]), u))];
  }
  return K[K.length - 1][1];
}
// zoom from camera a so that the world point P lands at screen point sB with zoom zB (u 0..1); P's screen position follows 1/z, so the
// target grows (or shrinks) in place instead of swinging across the frame
function anchorZoom(a, P, sB, zB, u) {
  const sA = [W / 2 + (P[0] - a[0]) * a[2], H / 2 + (P[1] - a[1]) * a[2]];
  const z = Math.exp(mix(Math.log(a[2]), Math.log(zB), u)), dz = 1 / a[2] - 1 / zB, lu = Math.abs(dz) < 1e-9 ? u : (1 / a[2] - 1 / z) / dz;
  const sx = mix(sA[0], sB[0], lu), sy = mix(sA[1], sB[1], lu);
  return [P[0] - (sx - W / 2) / z, P[1] - (sy - H / 2) / z, z];
}

export default async (T, R) => {
  await f7Prepare(); await peoplePrepare();
  const { in: HI } = handsOf('c12', T);
  const S = (ph, n) => T.S('07a', ph, n), E = (ph, n) => T.E('07a', ph, n);
  const A = {
    so: S('So'), foreverE: E('grow forever'), knows: S('knows'), knowsE: E('knows'), maybeE: E('maybe'), takes: S('takes'), takesE: E('takes'), noE: E('takes no'),
    and: S('And that might'), allE: E('of all'), wall: S('wall'), never: S('never'), intel: S('intelligence'), intelE: E('intelligence'), only: S('Only'),
    appetite: S('appetite'), appetiteE: E('appetite'), furnace: S('furnace'), ring: S('the ring'), ringE: E('the ring'), tech: S('The technology'),
    choose: S('choose'), chooseE: E('choose'), we: S('We will'), willE: E('We will'), dont: S("We don't"), planetE: E('bigger planet'), wiser: S('wiser'),
    thisOne: S('this one'), oneE: E('this one'), first: S('for the first'), intel2: S('intelligence', 1), findE: E('find it'),
    tell: S('So tell'), commentsE: E('comments'), what: S('What should'), firstE: E('abundant first'),
  };
  A.no = T.W('07a').find((w) => w.s > A.takesE - .01 && /^no\b/i.test(w.w)).s;
  const T0 = HI.b, TE = T.duration;
  const fr = (x) => Math.round(x * 30) / 30;

  // ============================================================== the camera (one take)
  const SUN_H = (t) => 34 + 26 * lin(T0, TE, t);                       // the sun climbs slowly the whole chunk
  const SUNW = sunAt(T0, SUN_H(T0));
  const F1 = [300, -3200, .52], F2 = [282, -3226, .556], F3 = [200, -3420, .78], F3b = [184, -3405, .80];
  const PC = [494, -2961];                                              // the people (centre of the row, on the limb)
  const tP1 = T0 + 2.8, tD0 = fr(A.choose - .3), tD1 = fr(A.we + .15), tR0 = fr(A.willE + .1), tR1 = fr(A.oneE - .15), tEP = fr(A.firstE + .45);
  const ZP = 3.0, EP = { cy: 360, z: 185 / EARTH.R }, E1 = { cy: 540, z: .1 };
  const F1s = [W / 2 + (SUNW[0] - F1[0]) * F1[2], H / 2 + (SUNW[1] - F1[1]) * F1[2]];
  const KB = [[tP1, F1], [fr(A.and - .1), F2, ease.sine], [fr(A.allE + .25), F3], [tD0, F3b, ease.sine]];
  const camAt = (t) => {
    if (t < tP1) return anchorZoom([SUNW[0], SUNW[1], 4.2], SUNW, F1s, F1[2], ease.out(lin(T0, tP1, t)));
    if (t < tD0) return camK(t, KB);
    if (t < tD1) return anchorZoom(camK(tD0, KB), PC, [960, 800], ZP, ease.io(lin(tD0, tD1, t)));
    const hold = (tt) => { const u = ease.sine(lin(tD1, tR0, tt)); return anchorZoom([PC[0], PC[1] - 260 / ZP, ZP], PC, [960 - 6 * u, 800 + 4 * u], ZP * (1 + .025 * u), 1); };
    if (t < tR0) return hold(t);
    if (t < tR1) return anchorZoom(hold(tR0), PC, [960 + PC[0] * E1.z, E1.cy + PC[1] * E1.z], E1.z, ease.io(lin(tR0, tR1, t)));
    const e1 = [0, (H / 2 - E1.cy) / E1.z, E1.z];
    if (t < tEP) return anchorZoom(e1, [0, 0], [960, EP.cy], EP.z, ease.sine(lin(tR1, tEP, t)));
    const tau = t - tEP;   // the end plate: a very slow drift (starts at rest)
    return anchorZoom([0, (H / 2 - EP.cy) / EP.z, EP.z], [0, 0], [960 - 9 * (1 - Math.cos(tau * .21)), EP.cy - 6 * (1 - Math.cos(tau * .27))], EP.z * (1 + .011 * (1 - Math.cos(tau * .17))), 1);
  };
  const skyO = (c) => ({ ox: 1450 - c[0] * .03, oy: -680 - (c[1] - 2918) * .02, ang: SANG });

  // ============================================================== states
  const dawnK = (t) => 1 - ease.sine(lin(T0, T0 + 1.7, t));
  // the cool line: brighter from "knows" on
  const coolBr = (t) => 1.05 + .45 * bump(t, A.knows - .05, A.knows + .35, A.maybeE, A.maybeE + .8) + .15 * sm(lin(A.knows, A.maybeE + .8, t));
  // glints along the cool line: [t0, t1, L0, L1] (arclength), plus the ★ glint passing the dome at "intelligence"
  const LTOP = COOL_LEN(2.37), LC = COOL_LEN(CROSS.q);
  const glints = (t) => {
    const out = [];
    const run = (t0, t1, L1, a, ef = ease.io) => { if (t > t0 && t < t1) { const u = lin(t0, t1, t); out.push([qAtLen(L1 * ef(u)), a * Math.sin(Math.PI * Math.min(1, u * 1.15)) ** .5]); } };
    run(A.knows - .12, A.knows + 1.45, LTOP, 1);
    // ★: rises from the city, reaches the glass on "intelligence", passes on into the stars
    const t0 = A.never - .3, tc = A.intel + .04, t1 = tc + .75;
    if (t > t0 && t < t1) { const L = t < tc ? LC * ease.inn(lin(t0, tc, t)) ** .55 : LC + (COOL_LEN(1.9) - LC) * ease.out(lin(tc, t1, t)); out.push([qAtLen(L), 1.15 * sm(clamp((t - t0) / .25)) * (1 - sm(lin(t1 - .25, t1, t)))]); }
    run(A.intel2 - .3, A.intel2 + 1.5, LTOP, 1);
    if (t > tEP + 1) { const per = 6.4, ph = (t - tEP - 1) % per; if (ph < 2.6) out.push([qAtLen(LTOP * ease.io(ph / 2.6)), .55 * Math.sin(Math.PI * ph / 2.6)]); }
    return out;
  };
  // the amber line: one last breath on "takes", then calm; the ring brightens on "no." and on "the ring"
  const ambBr = (t) => 1 + .35 * bump(t, A.takes - .05, A.takes + .3, A.takesE, A.noE + .2) + .25 * bump(t, A.ring - .05, A.ring + .2, A.ringE + .2, A.ringE + 1);
  const ringA = (t) => .55 + .2 * clamp((.3 - camAt(t)[2]) / .2) + .2 * bump(t, A.no - .05, A.no + .3, A.noE + .1, A.noE + .9) + .3 * bump(t, A.ring - .05, A.ring + .25, A.ringE + .3, A.ringE + 1.2) + .2 * sm(lin(A.thisOne, A.oneE + 1.3, t));
  // the dome (★): the whole rim on "wall" (never where the cool line passes), then only above the amber
  const rimRev = (t) => ease.out(lin(A.wall - .05, A.wall + 1.1, t));
  const rimOnly = (t) => ease.io(lin(A.only - .05, A.appetite + .15, t));
  const rimOut = (t) => 1 - ease.io(lin(tD0 + .2, tR0 + 1.2, t));
  const secW = (sa) => { const a = AMB_SA[0] - .02, b = AMB_SA[1] + .03, d = sa < a ? a - sa : sa > b ? sa - b : 0; return Math.exp(-((d / .045) ** 2)); };
  const rimA = (t) => {
    const rv = rimRev(t), on = rimOnly(t), ap = sm(lin(A.appetite - .1, A.appetite + .45, t)), out = rimOut(t);
    if (rv <= 0 || out <= 0) return null;
    const ext = rv * Math.PI;
    return (sa) => {
      const dd = Math.abs(saOf(Math.cos(sa - CROSS.sa), Math.sin(sa - CROSS.sa)));
      let whole = 0; if (dd < ext) whole = (.62 + .7 * (rv < 1 ? Math.max(0, 1 - (ext - dd) / .22) : 0)) * (1 - .4 * dd / Math.PI);
      const gap = 1 - Math.exp(-((dd / .04) ** 2));
      return (whole * (1 - on) * gap + secW(sa) * on * (.5 + .45 * ap)) * out;
    };
  };
  const warmA = (t) => { const k = sm(lin(A.appetite - .1, A.appetite + .45, t)) * rimOut(t); return k > 0 ? (sa) => secW(sa) * k : null; };
  const passU = (t) => lin(A.intel - .02, A.intel + .7, t);
  const furnI = (t) => bump(t, A.furnace - .12, A.furnace + .1, A.furnace + .42, A.furnace + .95);
  const lookF = (p) => (t) => ease.io(lin(A.we + .1 + p.d, A.we + .75 + p.d, t));
  const waveU = (t) => (t - (A.thisOne - .25)) / (A.oneE + .55 - (A.thisOne - .25));

  // ============================================================== the frame
  const W12 = T.W('07a').filter((w) => w.s >= A.what - .01);
  const QL = [W12.slice(0, 3), W12.slice(3)];
  const qOut = A.firstE + 2.9;
  function world(ctx, t) {
    const c = camAt(t), cam = { x: c[0], y: c[1], z: c[2] }, m = camO(cam), k = m.k;
    sky(ctx, t, skyO(c));
    const sh = SUN_H(t), sw = sunAt(t, sh), sS = [m.X(sw[0]), m.Y(sw[1])];
    const gk = .55 * Math.max(1, Math.pow(.3 / k, .6));
    dawnSky(ctx, t, m, 1, sS);
    sunrise(ctx, t, m, { h: sh, k: gk, br: 1 });
    furnaceSide(ctx, t, m, furnI(t), m.X(AMBER[30][0]) - 30);
    earth(ctx, t, cam, {});
    sunriseLimb(ctx, t, m, { u: 1, br: .9 });
    crest(ctx, t, m, sm(lin(1.0, 1.9, k)));
    // the ring (c06's: same radius, same band) and the amber lying in it
    const w = 30 * k + 8 + 16 * clamp((.3 - k) / .2);
    ring(ctx, t, { cx: m.X(0), cy: m.Y(0), r: RING_R * k - w * .35, w, a: ringA(t), seed: 6 });
    ringWave(ctx, t, m, waveU(t), (AMB_SA[0] + AMB_SA[1]) / 2, w);
    const ab = ambBr(t);
    curve(ctx, t, AMBER.map(([x, y, ww]) => [m.X(x), m.Y(y), ww]), { w: clamp(.38 + .9 * k, .42, 1.15), br: ab, sparks: .5 + 6 * bump(t, A.takes - .05, A.takes + .2, A.takesE - .1, A.noE), burst: t > A.takes && t < A.takes + 1.6 ? A.takes + .05 : null, tipA: .4, seed: 1 });
    people(ctx, t, m, { look: (p) => lookF(p)(t) });
    // the dome: invisible until "wall"; the rim never where the cool line passes; at the end only above the amber
    const ra = rimA(t); if (ra) domeRim(ctx, t, m, ra, { warm: warmA(t) });
    // the cool line (c06's, q 0 … 2.37) and its glints
    const cw = clamp(.45 + .85 * k, .5, 1.1), pts = coolPts(0, 2.37, 240).map(([x, y]) => [m.X(x), m.Y(y), 1]);
    curve(ctx, t, pts, { tone: 'cool', w: cw, br: coolBr(t), glint: 0, seed: 4, tip: true });
    for (const [q, a] of glints(t)) { const p = coolPath(q), X = m.X(p[0]), Y = m.Y(p[1]); if (X > -60 && X < W + 60 && Y > -60 && Y < H + 60) starGlint(ctx, X, Y, 64 * Math.max(.6, cw), a); }
    const pu = passU(t); if (pu > 0 && pu < 1) starPass(ctx, t, m.X(CROSS.x), m.Y(CROSS.y), pu, Math.max(.7, k * 1.3));
    // the question, then the end plate keeps the end-screen regions calm
    if (t > A.what - .2 && t < qOut + 1) question(ctx, t, QL, { size: 74, y0: 760, gap: 92, out0: qOut });
    endShade(ctx, sm(lin(A.firstE + 1, qOut + 1.2, t)));
    // out of the plate: the dawn light shrinks into the sun
    const dk = dawnK(t); if (dk > 0) dawnOut(ctx, t, dk, sS[0], sS[1]);
  }

  // ============================================================== warm the sky caches for every frame
  { const o = []; for (let f = Math.floor(T0 * 30); f / 30 < TE + .1; f++) { const s = skyO(camAt(f / 30)); o.push([s.ox, s.oy]); } await skyWarm(SANG, o); }

  const PO = { riso: .3 };
  return [
    { t: T0, tr: 'cut', d: .1, draw: world, print: HI.print },
    { t: fr(T0 + 2), draw: world, print: PO, sound: [{ f: 'shimmer_rings', t: A.maybeE + .05, v: .3 }, { f: 'flame_breath', t: A.noE + .05, v: .25 }] },
    { t: fr(A.and - .2), draw: world, print: PO, sound: [{ f: 'glass_hum', t: A.allE + .1, v: .35 }, { f: 'chime', t: A.intelE + .02, v: .35 }] },
    { t: fr(A.furnace - .4), draw: world, print: PO, sound: [{ f: 'whoosh_airy', t: tD1 - .45, v: .3 }, { f: 'whoosh_up', t: tR0 - .1, v: .3 }] },
    { t: fr(A.wiser - .2), draw: world, print: PO, sound: [{ f: 'bloom', t: A.oneE + .04, v: .3 }] },
    { t: fr(A.firstE + .2), draw: world, print: PO, sound: [{ f: 'swell', t: A.firstE + .15, v: .3 }] },
  ];
};
