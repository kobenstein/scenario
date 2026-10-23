// Film 8 · c01 · Hook (00a, 0.00–34.34 s, shots 0.01–0.12). ONE continuous world and ONE camera for the whole chunk: a night valley
// (lib/f8_kit nightLand) with many small workshops; the hero workshop stands at world (1000, 868), scale .32 (240 local units → 77 px
// at the reference camera {960, 540, dist 1}). The camera = { x, y, dist }: dist in log space through monotone keys, the focus follows the
// zoom (no sideways swish when close). The anatomy plate (0.07–0.11) is the SAME hero workshop (anatomyPlate draws it all chunk long), so
// nothing is ever swapped: the night dims, a plate mark is engraved round it, its walls lift.
//
// | shot | VO (accent)                                   | image                                                                 | hero light       | camera                                  | flow on                                  | sound          |
// |------|-----------------------------------------------|-----------------------------------------------------------------------|------------------|-----------------------------------------|------------------------------------------|----------------|
// | 0.01 | A.I.-native companies are **rising**          | wide night valley, Milky Way; lit workshops rise out of the mist one  | workshop windows | slow crane down toward the hero         | take: the crane continues                | whoosh_up 3.85 |
// |      |                                               | after another, each roof sends a thread of light up; on rising the    | (gold-amber)     |                                         |                                          |                |
// |      |                                               | hero rises, its thread shoots up, fireflies follow. Title word-mask   |                  |                                         |                                          |                |
// | 0.02 | almost **no employees**                       | the hero's 11 windows from close: no one inside, only weave threads;  | windows          | glide along the window row to the door  | push into a window (b)                   |                |
// |      |                                               | at the end the open door with one figure from behind                  |                  |                                         |                                          |                |
// | 0.03 | never **forget** anything                     | behind the glass the weave in depth; a thread stitches in; on forget  | weave gold       | push through the glass, hold            | pull back out through the window (b rev) | chime 7.4      |
// |      |                                               | the old (dim) parts flare: all still there                            |                  |                                         |                                          |                |
// | 0.04 | keep working while everyone **sleeps**        | the sleeping village round the workshop, thin moon; fireflies fly out | workshop         | pull back to the village total          | take: the camera rises                   | tick 10.4      |
// |      |                                               | and return with threads; on sleeps the last village window goes out   |                  |                                         |                                          |                |
// | 0.05 | worth a billion … a **single person**         | higher: low clouds over the valley lit by the workshop; its shadow on | the lit clouds   | crane up, then down into the door       | a firefly leaves the roof (a)            |                |
// |      |                                               | them is a tower; then the camera finds the one figure in the door     |                  |                                         |                                          |                |
// | 0.06 | How is that even **possible**?                | one firefly hovers big before the lens, its trail draws an open loop; | the firefly      | slight pull back                        | it flies back onto the roof (a), the     | wings 17.1     |
// |      |                                               | on possible it pulses, the windows behind dim 10 %                    | (green)          |                                         | camera follows into the plate framing    |                |
// | 0.07★| take one **apart**                            | THE PLATE (thumbnail): the night dims to dark paper, a plate mark is  | 3 lights: gold,  | framing settles, slow push 8 %          | take                                     | pages 20.95    |
// |      |                                               | engraved round the workshop; roof, front wall, side wall lift as      | green, amber     |                                         |                                          | (plate_lift)   |
// |      |                                               | paper layers (quart in-out, 80 ms stagger): weave, fireflies, figure  |                  |                                         |                                          |                |
// | 0.08 | **Organ** by organ                            | three leader lines draw to the margin; the first sets its end point   | —                | take                                    | take                                     |                |
// | 0.09 | Its **memory**                                | the weave brightens, a thread stitches in, MEMORY (mask)              | weave            | take                                    | take                                     | foil_glint     |
// | 0.10 | Its **hands**                                 | the fireflies run a loop and draw a bright stroke, HANDS              | fireflies        | take                                    | take                                     | shimmer_rings  |
// | 0.11 | Its **will**                                  | the figure raises its hand, amber rim, WILL; the swarm turns to it    | the figure       | take                                    | pull back                                |                |
// | 0.12 | … **who gets** to have one                    | pull back: the open plate is one of hundreds of workshops in the      | few lit ones     | pull back to the wide land, then a dive | c01>c02: a firefly flies from the hands  | bulb 30.9,     |
// |      |                                               | valley, most dark; on who gets two more light up and stay             |                  | after the firefly into the weave        | into the weave; its stitch glow grows    | whoosh_airy    |
// |      |                                               |                                                                       |                  |                                         | until it IS the gold light plate at H.a  | 32.7           |
import { W, H, rgba, clamp, lin, mix, eio, eout, prng, drift, text } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { F8, nightLand, landCam, ridgeY, anatomyPlate, instances, weave, firefly, swarm, mistBand, qio, eoutX, einX, ready } from '../lib/f8_kit.mjs';
import { plate as drawPlate } from '../lib/handoff4.mjs';
import { c01Clouds, c01Village, c01Title, partsReady } from '../lib/f8_c01_parts.mjs';

const HERO = { x: 1000, y: 868, s: .32 };                     // world (d = 0)
const DOOR = [HERO.x + 101 * HERO.s, HERO.y - 20 * HERO.s];
const winX = (i) => HERO.x + (-112 + i * 18.2 + 5.75) * HERO.s, WIN_Y = HERO.y - 38 * HERO.s;
const ROOF = [HERO.x - 20 * HERO.s, HERO.y - 100 * HERO.s];
const WEAVE_D = .004;                                           // the interior weave hangs this far behind the glass (world dist units)

export default async (T, R) => {
  await ready(); await partsReady();
  const S = (p, n) => T.S('00a', p, n);
  const A = {
    rising: S('rising'), no: S('They have'), emp: S('employees'), never: S('They never'), forget: S('forget'), keep: S('And they keep'), sleeps: S('sleeps'),
    some: S('Some say'), single: S('single'), how: S('How is'), possible: S('possible'), to: S('To understand'), apart: S('apart'),
    organ: S('Organ by'), organ2: S('organ', 1), mem: S('Its memory'), memory: S('memory'), hand0: S('Its hands'), hands: S('hands'), will0: S('Its will'), will: S('will', 1),
    and: S('And then'), who: S('who gets'), end: T.E('00a'),
  };
  const HO = handsOf('c01', T).out;                               // c01>c02: gold light plate (tone 'weave')
  const HA = HO.a;

  // ---------------------------------------------------------------- camera keys: [t, x, y, dist]
  const KEYS = [
    [0, 965, 610, .9], [2.0, 975, 665, .74], [A.rising + .2, 990, 770, .42], [A.no + .25, winX(0) - 2, WIN_Y + 1, .085],
    [A.emp + .6, DOOR[0] - 2, WIN_Y + 4, .062], [A.never - .35, winX(9), WIN_Y, .05], [A.never + .65, winX(9) + .4, WIN_Y + .6, .0005],
    [A.keep - .75, winX(9) + .2, WIN_Y + .3, .00042], [A.keep + .55, 1008, 848, .3], [A.keep + 1.4, 1000, 808, 1.05], [A.some - .1, 1000, 776, 1.15],
    [A.some + 1.5, 1000, 668, 1.45], [A.single - .9, 1004, 690, 1.35], [A.single + .1, DOOR[0], DOOR[1] - 3, .048], [A.how - .2, DOOR[0] - .4, DOOR[1] - 3.2, .042],
    [A.how + .5, 1022, 850, .2], [A.to - .8, 1017, 848, .2], [A.to + .4, 1010.7, 841.3, .107], [A.and, 1010.5, 842, .099],
    [A.who + .4, 1000, 700, 1.7], [A.end - .3, 998, 690, 1.8],
  ];
  const ld = KEYS.map((k) => Math.log(k[3]));
  // monotone cubic (Fritsch–Carlson) on log dist
  const n = KEYS.length, del = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) del.push((ld[i + 1] - ld[i]) / (KEYS[i + 1][0] - KEYS[i][0]));
  for (let i = 1; i < n - 1; i++) m[i] = del[i - 1] * del[i] <= 0 ? 0 : 3 * (KEYS[i + 1][0] - KEYS[i - 1][0]) / ((2 * KEYS[i + 1][0] - KEYS[i][0] - KEYS[i - 1][0]) / del[i - 1] + (KEYS[i + 1][0] + KEYS[i][0] - 2 * KEYS[i - 1][0]) / del[i]);
  const DIVE_T = A.end - .3, P_STAR = [986, 853.5];                    // the dive target: a point of the interior weave
  function cam(t) {
    if (t >= DIVE_T) {
      const u = lin(DIVE_T, HA, t), d0 = KEYS[n - 1][3], d1 = .0048, lg = mix(Math.log(d0), Math.log(d1), qio(u)), d = Math.exp(lg), f = (d0 - d) / (d0 - d1);
      return { x: mix(KEYS[n - 1][1], P_STAR[0], f), y: mix(KEYS[n - 1][2], P_STAR[1], f), dist: d };
    }
    let i = 0; while (i < n - 2 && t > KEYS[i + 1][0]) i++;
    const [ta, xa, ya, da] = KEYS[i], [tb, xb, yb, db] = KEYS[i + 1], h = tb - ta, q = clamp((t - ta) / h);
    const h00 = 2 * q ** 3 - 3 * q * q + 1, h10 = q ** 3 - 2 * q * q + q, h01 = -2 * q ** 3 + 3 * q * q, h11 = q ** 3 - q * q;
    const lg = h00 * ld[i] + h10 * h * m[i] + h01 * ld[i + 1] + h11 * h * m[i + 1], d = Math.exp(lg);
    // the focus follows the zoom progress when the zoom changes a lot, else eased time
    const zf = Math.abs(Math.log(da / db)) > .25 ? clamp((d - da) / (db - da)) : eio(q);
    const k = 1 / d, dr = Math.min(1, .5 / k);                     // tiny drift, smaller when close
    return { x: mix(xa, xb, zf) + drift(t, 3 * dr, 1), y: mix(ya, yb, zf) + drift(t, 2 * dr, 4), dist: d };
  }

  // ---------------------------------------------------------------- the land: workshops standing on the ridges (reference-screen positions)
  const LAND = [];
  { const r = prng(81), per = [70, 60, 46, 22];
    for (let i = 0; i < 4; i++) for (let j = 0; j < per[i]; j++) {
      const sx = 40 + r() * (W - 80); if (i === 3 && Math.abs(sx - 1000) < 260) continue;
      const d = [5.4, 2.6, 1.15, .42][i] + r() * .2, sy = ridgeY(i, sx) + 8 + r() * [26, 30, 40, 60][i] * (1 / (1 + i * .2));
      LAND.push({ ridge: i, sx, sy, d, f: .8 + r() * .35, lit: 0 });
    }
  }
  // the ones that rise lit in 0.01 (staggered), and the two that light up on "who gets"
  const RISE = [[3, 1420, -.45], [2, 330, .25], [3, 620, .8], [1, 760, 1.25], [2, 1650, 1.75], [3, 1320, 2.25], [2, 880, 2.7]];
  const riser = RISE.map(([ri, sx, t0], k) => { let best = null, bd = 1e9; for (const L of LAND) if (L.ridge === ri && Math.abs(L.sx - sx) < bd) { bd = Math.abs(L.sx - sx); best = L; } best.rise = t0; best.lit = 1; best.k = k; best.f = ri === 3 ? 1.25 : 1.6; return best; });
  const lateLit = [LAND.find((L) => L.ridge === 2 && L.sx > 1150 && L.sx < 1350 && !L.lit), LAND.find((L) => L.ridge === 1 && L.sx > 380 && L.sx < 700 && !L.lit)];
  lateLit.forEach((L, k) => { if (L) L.late = A.who + .05 + k * .32; });
  const HERO_RISE = A.rising - .55;                                 // the hero lifts over the mist edge on "rising"

  // a fine thread of light rising from a roof: bright at the roof, thinning into the sky, a bright head while it climbs
  function roofThread(ctx, x, y, len, th) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, y, 0, y - len); g.addColorStop(0, rgba(F8.goldCore, .8)); g.addColorStop(.7, rgba(F8.gold, .35)); g.addColorStop(1, rgba(F8.gold, 0));
    ctx.strokeStyle = g; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - len); ctx.stroke(); ctx.restore();
    if (th < .995) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const hg = ctx.createRadialGradient(x, y - len, 0, x, y - len, 16); hg.addColorStop(0, rgba(F8.goldCore, .9)); hg.addColorStop(1, rgba(F8.gold, 0)); ctx.fillStyle = hg; ctx.fillRect(x - 16, y - len - 16, 32, 32); ctx.restore(); }
  }
  const litOf = (L, t) => (L.rise != null ? clamp((t - L.rise + .1) / .5) : 0) + (L.late != null ? eoutX(clamp((t - L.late) / .35)) : 0);
  const riseOf = (L, t) => (L.rise != null ? 1 - eoutX(clamp((t - L.rise) / 1.1)) : 0);
  function landRow(ctx, t, c, ridge) {
    for (const L of LAND) {
      if (L.ridge !== ridge) continue;
      const P = landCam(c, L.d), x = P.RX(L.sx), y0 = P.RY(L.sy), k = P.k * HERO.s * L.f; if (x < -100 || x > W + 100 || y0 < -50 || y0 > H + 300) continue;
      const rise = riseOf(L, t), y = y0 + rise * 120 * k, lit = clamp(litOf(L, t));
      const th = L.rise != null ? eout(clamp((t - L.rise - .45) / 1.4)) : 0;
      if (rise > 0) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, y0 + 1); ctx.clip(); }
      instances(ctx, t, { list: [{ x, y, s: k, lit }], threads: 0 });
      if (rise > 0) ctx.restore();
      if (th > 0) roofThread(ctx, x - 92 * k, y - 104 * k, th * 520 * Math.min(1.4, .45 + k * 3), th);
    }
    // the mist these rows rise out of (in front of their base)
    const dd = [5.3, 2.5, 1.05, .38][ridge]; if (ridge > 0) mistBand(ctx, t, c, dd, ridgeY(ridge, 960) + [40, 46, 60, 70][ridge], { seed: 3 + ridge, a: [.6, .62, .62, .5][ridge], v: 4 + ridge * 2.5, col: '#5a5896' });
  }

  // ---------------------------------------------------------------- the interior weave behind the hero's glass (0.02–0.04) and in the plate
  const weaveRect = (c) => { const P = landCam(c, WEAVE_D); return { x: P.X(HERO.x - 116 * HERO.s), y: P.Y(HERO.y - 67 * HERO.s), w: 232 * HERO.s * P.k, h: 62 * HERO.s * P.k }; };
  const glassStitch = { t0: A.never + .2, u: .62, v: .46, glyph: 'check', from: [-300, 220], dur: .75 };

  // ---------------------------------------------------------------- fireflies of 0.04: out of the roof into the night, back with a thread
  const LOOPS = [0, 1, 2, 3, 4].map((i) => { const r = prng(300 + i); return { t0: A.keep - .2 + i * .55, dur: 2.6 + r() * .8, far: [HERO.x + (r() - .5) * 360, HERO.y - 90 - r() * 120] }; });
  const loopPos = (L, t) => {
    const u = clamp((t - L.t0) / L.dur), [fx, fy] = L.far, [rx, ry] = ROOF;
    if (u < .45) { const e = eio(u / .45); return [mix(rx, fx, e) + Math.sin(e * Math.PI) * 30, mix(ry, fy, e) - Math.sin(e * Math.PI) * 40]; }
    if (u < .55) { const q = (u - .45) / .1; return [fx + Math.sin(q * Math.PI * 2) * 6, fy - Math.sin(q * Math.PI) * 8]; }
    const e = eio((u - .55) / .45); return [mix(fx, rx, e) - Math.sin(e * Math.PI) * 24, mix(fy, ry, e) - Math.sin(e * Math.PI) * 30];
  };

  // ---------------------------------------------------------------- 0.06: the firefly before the lens (screen space), back to the roof
  const FF = { t0: A.how - .12, near: A.how + .75, loop: A.possible + .55, back: A.to - .55, home: A.to + .45 };
  function lensFly(ctx, t, c) {
    const P0 = landCam(c, 0), roof = [P0.X(ROOF[0]), P0.Y(ROOF[1])], NEAR = [1180, 420];
    let p, s;
    const loopP = (tt) => { const q = clamp((tt - FF.near) / (FF.back - FF.near)), a = -1.9 + q * 4.6; return [NEAR[0] + Math.cos(a) * 70 * q + 30 * q, NEAR[1] + Math.sin(a) * 46 * q]; };
    const pathAt = (tt) => {
      if (tt < FF.t0) return [roof, .5];
      if (tt < FF.near) { const e = eoutX((tt - FF.t0) / (FF.near - FF.t0)); return [[mix(roof[0], NEAR[0], e) + Math.sin(e * 3) * 40, mix(roof[1], NEAR[1], e)], mix(.5, 10, e)]; }
      if (tt < FF.back) return [loopP(tt), 10];
      const e = eio(clamp((tt - FF.back) / (FF.home - FF.back))), L = loopP(FF.back); return [[mix(L[0], roof[0], e) - Math.sin(e * Math.PI) * 120, mix(L[1], roof[1], e) - Math.sin(e * Math.PI) * 60], mix(10, .45, e)];
    };
    if (t < FF.t0 || t > FF.home) return;
    [p, s] = pathAt(t);
    const trail = []; for (let k = 12; k >= 0; k--) trail.push(pathAt(t - k * (t > FF.near && t < FF.back ? .07 : .03))[0]);
    // the trail of the hover draws the open loop (longer, slower)
    const pu = Math.exp(-Math.pow((t - A.possible - .08) / .18, 2));
    firefly(ctx, t, { x: p[0], y: p[1], s, trail, seed: 7, pulse: pu });
  }

  // ---------------------------------------------------------------- the whole frame
  const spotR = (t, k0) => { const t1 = A.end + .25; if (t < t1 - .05) return 0; return (.25 + 7.2 * Math.pow(clamp((t - t1) / (HA - t1)), 1.6) + .3 * eoutX(clamp((t - t1 + .05) / 1.0))) * k0; };
  function world(ctx, t) {
    const c = cam(t), P0 = landCam(c, 0), k0 = P0.k;
    { const r = spotR(t, k0), sx = P0.X(P_STAR[0]), sy = P0.Y(P_STAR[1]); if (t >= HA - 1 / 30 - 1e-4 && r > Math.hypot(Math.max(sx, W - sx), Math.max(sy, H - sy)) + 60) { drawPlate(ctx, t, 'light', HO.o); return; } }
    // light state of the night: dims to the plate's dark paper in 0.07–0.11, lifts again in the pull-back
    const plateDim = .36 * eio(lin(A.to - .2, A.to + .9, t)) * (1 - eio(lin(A.and + .2, A.who + .4, t)));
    // when the hero's wall covers the whole frame (window push, 0.02–0.03) the night behind it is never seen: skip it (perf)
    const wallCovers = (() => { const hs0 = HERO.s * k0, hx0 = P0.X(HERO.x), hy0 = P0.Y(HERO.y); return hx0 - 116 * hs0 < -20 && hx0 + 116 * hs0 > W + 20 && hy0 - 64 * hs0 < -20 && hy0 > H + 20; })();
    if (wallCovers) { ctx.fillStyle = '#0b1030'; ctx.fillRect(0, 0, W, H); }
    else nightLand(ctx, t, { cam: c, moon: { x: 1540, y: 205, r: 13 }, dim: 0, mist: 0, after: (i) => {
      landRow(ctx, t, c, i);
      if (i === 1) c01Clouds(ctx, t, c, { lit: clamp(eio(lin(A.some + .2, A.some + 1.6, t)) - eio(lin(A.how + .6, A.to + .6, t))), heroX: HERO.x });
      if (i === 3) c01Village(ctx, t, c, { lastOut: A.sleeps + .02 });
    } });
    if (plateDim > 0) { ctx.fillStyle = rgba('#05060f', plateDim); ctx.fillRect(0, 0, W, H); }

    // the hero: rising (0.01), glass with the weave behind (0.02–0.04), the plate (0.07–0.12)
    const rise = 1 - eoutX(clamp((t - HERO_RISE) / 1.2)), hy = P0.Y(HERO.y) + rise * 140 * HERO.s * k0;
    const heroLit = clamp((t - HERO_RISE - .2) / .45), close = c.dist < .32;
    const winPulse = 1 + .35 * Math.exp(-Math.pow((t - A.sleeps - .5) / .35, 2));
    const winDim = .1 * Math.exp(-Math.pow((t - A.possible - .25) / .4, 2));
    const hx = P0.X(HERO.x), hs = HERO.s * k0;
    if (close && heroLit > 0) {
      // behind the glass: amber glow + the weave in depth, clipped to the windows (drawn before the workshop, which has clear glass)
      ctx.save(); ctx.beginPath(); for (let i = 0; i < 11; i++) { const x0 = hx + (-112 + i * 18.2) * hs, y0 = hy - 54 * hs; ctx.rect(x0, y0, 11.5 * hs, 32 * hs); } ctx.clip();
      const wr = weaveRect(c), gl = ctx.createLinearGradient(0, wr.y, 0, wr.y + wr.h); gl.addColorStop(0, '#2a1d14'); gl.addColorStop(.5, '#4a3018'); gl.addColorStop(1, '#22160f');
      ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
      weave(ctx, t, { ...wr, depth: 3, cols: 40, rows: 12, a: .95 * heroLit * (2 - winPulse * 0 - 1), glyphs: .4, seed: 5, old: .38, oldGlow: 1.3 * Math.exp(-Math.pow((t - A.forget - .45) / .45, 2)), persp: .35, stitches: [glassStitch], shimmer: 1 });
      ctx.restore();
    }
    const fr = eio(lin(A.to - .1, A.to + 1.1, t)) * (1 - eio(lin(A.and + .1, A.and + 1.2, t)));
    const lab = (t0) => eoutX(lin(t0, t0 + .45, t)) * (1 - einX(lin(A.and, A.and + .35, t)));
    const plateO = {
      x: hx, y: hy, s: hs, paper: 0, frame: fr, plateRect: { x: 110, y: 64, w: W - 220, h: 846 }, openAt: A.apart - .3,
      leaders: lin(A.organ - .15, A.organ2 + .55, t) * (1 - einX(lin(A.and, A.and + .5, t))), labelX: 1330, labelY: 300, labelGap: 150,
      labels: { memory: lab(A.memory - .1), hands: lab(A.hands - .1), will: lab(A.will - .1) },
      memGlow: Math.exp(-Math.pow((t - A.memory - .3) / .5, 2)), stitches: [{ t0: A.mem - .25, u: .3, v: .45, glyph: 'envelope', from: [hx - 600, hy - 500], dur: .6 }],
      handsLoop: lin(A.hands - .2, A.hands + .9, t), will: eoutX(lin(A.will - .15, A.will + .45, t)) * (1 - eio(lin(A.who + .4, A.end, t)) * .6),
      turn: { x: hx + 112 * hs, y: hy - 48 * hs, t0: A.will + .1, delay: .1 },
      ws: { lit: heroLit, clearGlass: close, glowA: 1.2 * winPulse, winDim, threadLen: 900 * Math.min(1, .6 + k0 * .25), thread: eout(clamp((t - A.rising + .05) / .7)) * (1 - eio(lin(A.no - .4, A.no + .2, t))) },
    };
    const riseClip = rise > 0; if (riseClip) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, P0.Y(HERO.y) + 1); ctx.clip(); }
    const pl = anatomyPlate(ctx, t, plateO);
    if (riseClip) { ctx.restore(); mistBand(ctx, t, c, -.02, HERO.y + 6, { seed: 4, a: .7 * (.4 + .6 * rise), v: 7, col: '#5a5896', h: .6 }); }
    // the swarm that follows the hero's thread on "rising"
    if (t > A.rising - .1 && t < A.no + .6) swarm(ctx, t, { n: 12, mode: 'drift', cx: hx - 92 * hs + 10, cy: hy - 104 * hs - 420 * eout(clamp((t - A.rising) / 1.3)), rx: 30 + 60 * clamp(t - A.rising), ry: 140, seed: 3, s: .5 });

    // 0.04: fireflies going out and coming back with threads
    if (t > A.keep - .3 && t < A.single + .5) for (const L of LOOPS) {
      if (t < L.t0 || t > L.t0 + L.dur + .3) continue;
      const pos = (tt) => { const w = loopPos(L, tt); return [P0.X(w[0]), P0.Y(w[1])]; }, u = (t - L.t0) / L.dur;
      const trail = []; for (let q = 8; q >= 0; q--) trail.push(pos(t - q * .04));
      if (u > .55 && u < 1.05) { const th = []; for (let q = 0; q <= 16; q++) th.push(pos(Math.max(L.t0 + L.dur * .5, t - q * .06))); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F8.gold, .55); ctx.lineWidth = 1.1; ctx.beginPath(); th.forEach(([x, y], q) => (q ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore(); }
      if (u <= 1) firefly(ctx, t, { ...{ x: pos(t)[0], y: pos(t)[1] }, trail, s: Math.max(.4, .55 * Math.min(2, k0)), seed: L.t0 * 10 });
    }
    lensFly(ctx, t, c);

    // c01>c02: a firefly flies from the hands into the weave; its stitch glow grows (and the camera dives) until it IS the light plate
    if (t > A.who + .2) {
      const t0 = A.end - .55, t1 = A.end + .25, Pw = (wx, wy) => [P0.X(wx), P0.Y(wy)];
      const from = [HERO.x - 4 * HERO.s, HERO.y - 34 * HERO.s];
      if (t >= t0 && t <= t1 + .1) {
        const pos = (tt) => { const u = eio(clamp((tt - t0) / (t1 - t0))), x = mix(from[0], P_STAR[0], u) + Math.sin(u * Math.PI) * 9, y = mix(from[1], P_STAR[1], u) - Math.sin(u * Math.PI) * 7; return Pw(x, y); };
        const trail = []; for (let q = 8; q >= 0; q--) trail.push(pos(t - q * .035));
        firefly(ctx, t, { x: pos(t)[0], y: pos(t)[1], trail, s: clamp(.18 * hs, .5, 3), seed: 21 });
      }
      if (t > t1 - .05) {
        const [sx, sy] = Pw(P_STAR[0], P_STAR[1]), r = spotR(t, k0);
        // the glow halo (light, not a second picture) and the light itself: the plate drawn inside the growing glow
        ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.clip(); drawPlate(ctx, t, 'light', HO.o); ctx.restore();
        // a feathered edge: the light thins out over the threads in four narrow rings (bloom), never a hard disc
        for (let q = 1; q <= 4; q++) { ctx.save(); ctx.beginPath(); ctx.arc(sx, sy, r * (1 + .07 * q), 0, Math.PI * 2); ctx.arc(sx, sy, r * (1 + .07 * (q - 1)), 0, Math.PI * 2, true); ctx.clip(); ctx.globalAlpha = 1 - q / 5; drawPlate(ctx, t, 'light', HO.o); ctx.restore(); }
        // the rim of the glow: light spilling outward over the threads (soft, additive), so the edge is a falloff, never a disc
        const ra = 1 - eio(lin(HA - .4, HA - 1 / 30, t)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = ra; const hg = ctx.createRadialGradient(sx, sy, r * .8, sx, sy, r * 2.2);
        hg.addColorStop(0, rgba('#fff3d6', 0)); hg.addColorStop(.2, rgba('#f6e2b4', .22)); hg.addColorStop(.35, rgba(F8.gold, .14)); hg.addColorStop(.6, rgba(F8.gold, .07)); hg.addColorStop(1, rgba(F8.gold, 0));
        ctx.fillStyle = hg; ctx.fillRect(0, 0, W, H); ctx.restore();
      }
    }
    // the title (0.01): "The Rise of the AI-Native Company", word masks, upper third left (line 1 staggered 80 ms, AI-Native / Company on the spoken words)
    { const a0 = S('A.I.-native') - .05; c01Title(ctx, t, { at: [a0, a0 + .08, a0 + .16, a0 + .24, a0 + .42, S('companies')], out: A.no + .1 }); }   // title: The Rise of the / AI-Native Company
  }

  const draw = (ctx, t) => world(ctx, t);
  return [
    { t: 0, tr: 'cut', d: .1, draw, print: { riso: .35 }, sound: [{ f: 'whoosh_up', t: A.rising + .42, v: .45 }] },
    { t: A.never, tr: 'cut', d: .1, draw, print: { riso: .3, halftone: .9 }, sound: [{ f: 'chime', t: glassStitch.t0 + glassStitch.dur, v: .3 }] },
    { t: A.keep, tr: 'cut', d: .1, draw, print: { riso: .35 }, sound: [{ f: 'tick', t: A.sleeps + .05, v: .2 }] },
    { t: A.how, tr: 'cut', d: .1, draw, print: { riso: .3 }, sound: [{ f: 'wings', t: A.how - .1, v: .3 }] },
    { t: A.to, tr: 'cut', d: .1, draw, print: { riso: .3, hatch: 1.2 }, sound: [{ f: 'pages', t: A.apart - .15, v: .5 }, { f: 'foil_glint', t: A.memory + .1, v: .35 }, { f: 'shimmer_rings', t: A.hands + .1, v: .3 }] },
    { t: A.and, tr: 'cut', d: .1, draw, print: { riso: .3 }, sound: [{ f: 'bulb', t: A.who + .1, v: .3 }] },
    { t: A.end, tr: 'cut', d: .1, draw, print: HO.print, sound: [{ f: 'whoosh_airy', t: A.end + .5, v: .45 }] },
  ];
};
