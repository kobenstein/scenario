// c11 · No. 3 · the snake: horse-blood antivenom vs designed proteins · mice · single toxins (B3)
// T.G('The snake') → T.G('Everyone knows'). ONE entry, one continuous take: out of plateGrass the shadow in the grass becomes the snake,
// it slithers toward a village (the clinic window with the antivenom vial, the stable with the horse and the sheep); the stable lamp goes
// out; the camera dives into the vial's warm liquid (window fly-in, a nested world, not a W) → the mind space: a gold shape folds, the bead
// designs the protein, it clamps the dark toxin and switches it off · REAL · mice · the caveat · the ribbon loosens into a thread that
// knots by a person's head (→ c12, same world and camera: lib/f28_b3_kit.mjs camMind).
//
// | ID   | anchor                         | picture (one idea)                                                        | camera                 |
// |------|--------------------------------|---------------------------------------------------------------------------|------------------------|
// | 3.01 | The snake                      | plateGrass: the shadow rises into the coiled snake                        | plate creep            |
// | 3.02 | Its bite is still treated      | it uncoils and slithers right; the village: clinic window + vial, stable with horse + sheep | truck right, follows |
// | 3.03 | What if you could skip         | the stable lamp flickers and goes out; dive into the vial: a gold shape starts to fold | push → dive (2.7 s) |
// | 3.04 | A lab asked an A.I.            | the bead (the glass's cool glint) traces the ribbon; it folds into a clamp, grabs the toxin, switches it off · REAL · lamp 3 | push |
// | 3.05 | In mice, they worked           | a light line, ten mice rise from it; most light warm: 80–100 % SURVIVED   | pull back              |
// | 3.06 | So far only in mice            | a bracket MICE ONLY · the small dashed line SINGLE TOXINS · NOT WHOLE VENOM | breathe              |
// | 3.07 | A designed protein can stop    | the pair glows; the toxin falls away; the ribbon loosens into a thread → a knot by a person's head | truck left (follows the thread) |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as S from '../lib/f28_seams.mjs';
import * as B from '../lib/f28_b3_kit.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex } = E;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T);
  return [{ t: R.a, draw: scene(a, T, R), print: F.PRINT28 }];
};

const CV = (u, v, s) => E.aim(B.Z_VIL, u, v, s);

function scene(a, T, R) {
  const T0 = a.snake, tP = T0 - S.SEAM_HALF;
  const tz0 = B.mindTz0(a), ts = B.mindTs(a);                 // the dive into the vial: tz0 → ts (2.7 s), then the nested world is the frame
  // ---------------------------------------------------------------- grass camera: the plate's creep line, then a glide to the village
  const creepCam = (t) => E.aim(E.F0, 960 + S.TRUCK * (t - tP), 540, 1 + S.CREEP * (t - tP));
  const tg = a.bite + .25;
  const KG = [[tg, creepCam(tg)], [a.medicine + .6, CV(2050, 560, 1.05)], [a.horses - .2, CV(2640, 520, 1.22)], [a.whatif + .3, CV(2560, 520, 1.3)], [tz0, CV(2450, 520, 1.38)]];
  const camG = (t) => (t < tg ? creepCam(t) : F.camPath(t, KG));
  const camGd = (t) => B.drifted(camG(t), B.Z_VIL, t, 1.6 * span(t, T0 + 1, T0 + 2.5) * (1 - span(t, tz0 - .6, tz0)), 5);
  // ---------------------------------------------------------------- the snake (card 2200, the middle grass layer)
  const sx0 = 600 + 140 * Math.sin(T0 * .4);
  const headX = (t) => sx0 + 40 + 1900 * sineIO(span(t, a.bite + .1, a.horses + .2)) ** 1.15;
  const snakeState = (t) => {
    const g = E.smooth(span(t, T0, T0 + .6)), rise = expoOut(span(t, T0 + .15, T0 + .95)), coil = 1 - sineIO(span(t, a.bite - .05, a.bite + .8));
    return { g, rise, coil, x: headX(t), y: 840 - 26 * rise * coil };
  };
  // ---------------------------------------------------------------- the zoom into the vial (a nested world: E.withOuter)
  const vialAt = (t) => { const c = camGd(t), L = B.VIAL_LIQ(B.VIAL.x, B.VIAL.y + 1, B.VIAL.h), q = B.vsc(L.x + L.w / 2, L.y + L.h / 2), p = E.project(c, B.Z_VIL, q[0], q[1]); return { x: p[0], y: p[1], w: L.w * B.VSC.k * p[2] }; };
  const zoomAt = (t) => {
    const u = span(t, tz0, ts); if (u <= 0) return null;
    const v = vialAt(t), K = W * 1.04 / v.w, k = Math.exp(Math.log(K) * u ** 1.15), q = sineIO(u);
    const qx = lerp(v.x, W / 2, q), qy = lerp(v.y, H / 2, q);
    return { k, e: qx - k * v.x, f: qy - k * v.y };
  };
  // ---------------------------------------------------------------- the mind space
  const camL = (t) => B.drifted(B.camMind(t, a), E.F0, t, 2.2, 7);
  const OUT = (t) => B.outerLerp(B.LAB_IN, { k: 1, e: 0, f: 0 }, expoOut(span(t, ts, ts + 1.8)));
  // the pair (protein + toxin): moves aside for the mice, comes back for "stop a poison"
  const pairAt = (t) => {
    const m = sineIO(span(t, a.mice - .15, a.mice + 1.1)), b = sineIO(span(t, a.protein - .1, a.protein + 1.2));
    const p = [lerp(B.PAIR0[0], B.PAIR1[0], m), lerp(B.PAIR0[1], B.PAIR1[1], m)]; const s = lerp(1.25, .82, m) * lerp(1, 1.18, b);
    return { x: lerp(p[0], 700, b), y: lerp(p[1], 400, b), s };
  };
  const foldAt = (t) => (t < a.lab + 1.2 ? .18 + .12 * Math.sin(t * 1.1) * span(t, tz0, tz0 + 1) : lerp(.18 + .12 * Math.sin((a.lab + 1.2) * 1.1), 1, sineIO(span(t, a.lab + 1.2, a.proteins + .5))));
  const openAt = (t) => sineIO(span(t, a.proteins + .1, a.grab - .4)) * (1 - expoOut(span(t, a.grab - .05, a.grab + .35)));
  const looseAt = (t) => sineIO(span(t, a.butcan + .05, a.mind + .2));
  const knotAt = (t) => span(t, a.mind - .3, R.b - .4);
  const NK = 113;
  function threadPts(t, pr) {
    const pts = B.resample(E.catmull(B.ribbonPts(t, { fold: 1, open: 0, loose: looseAt(t), x: pr.x, y: pr.y, s: pr.s, len: 860 }).map((p) => [p[0], p[1]]), 8), NK);
    const ku = knotAt(t); if (ku <= 0) return pts;
    const [kx, ky, kr] = B.MIND.knot, K = B.knotPts(t, kx, ky, kr, NK);
    return pts.map((p, i) => { const e = sineIO(clamp(ku * 1.7 - (i / (NK - 1)) * .7)); return [lerp(p[0], K[i][0], e), lerp(p[1], K[i][1], e)]; });
  }
  // the bead: a cool speck in the liquid (the glass's glint) → the bead → it hovers right → it goes where the chat window will be
  const beadAt = (t) => {
    const born = expoOut(span(t, a.lab - .15, a.lab + .7)), go = sineIO(span(t, a.lab - .1, a.lab + 1.0));
    let x = lerp(330, 1270, go) + 6 * Math.sin(t * 1.3), y = lerp(250, 300, go) + 5 * Math.sin(t * 1.7);
    const side = sineIO(span(t, a.off + .6, a.mice + 1.2)); x = lerp(x, 1460, side); y = lerp(y, 250, side);
    const home = sineIO(span(t, a.butcan + .3, R.b - .6)); x = lerp(x, B.MIND.bead[0], home); y = lerp(y, B.MIND.bead[1], home);
    return { x, y, r: lerp(3, B.MIND.bead[2], born), think: span(t, a.lab + .5, a.lab + 1) * (1 - span(t, a.grab, a.grab + .6)) };
  };
  const toxAt = (t) => {
    const u = sineIO(span(t, a.proteins + .2, a.grab + .05)), pr = pairAt(t);
    const px = pr.x + 8 * pr.s, py = pr.y + 4 * pr.s;
    let x = lerp(1880, px, u) + 60 * Math.sin(u * Math.PI) * (1 - u), y = lerp(760, py, u) - 120 * Math.sin(u * Math.PI);
    const fall = expoIn(span(t, a.butcan, a.butcan + 1.6)); y += fall * 700;
    return { x, y, r: 34 * pr.s, off: E.smooth(span(t, a.off, a.off + .9)), a: 1 - span(t, a.butcan + 1.0, a.butcan + 1.6) };
  };
  // mice
  const MICE = Array.from({ length: 10 }, (_, k) => ({ x: 650 + k * 92, lit: k === 3 || k === 7 ? 'dash' : 1, d: [0, 5, 2, 8, 4, 9, 1, 6, 3, 7][k] }));
  const miceOut = (t) => expoIn(span(t, a.protein - .2, a.protein + .7));
  function mice(ctx, t) {
    const lineU = sineIO(span(t, a.mice - .1, a.mice + .9)), out = miceOut(t); if (lineU <= 0 || out >= 1) return;
    ctx.save(); ctx.translate(0, out * 420); ctx.globalAlpha *= 1 - out;
    F.rule(ctx, 1110 - 540 * lineU, 712, 1110 + 540 * lineU, 712, 1, { w: 2.2, spark: lineU < 1 });
    for (const m of MICE) {
      const r = expoOut(span(t, a.mice + .3 + m.d * .07, a.mice + 1.0 + m.d * .07)); if (r <= 0) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(m.x - 80, 560, 160, 151); ctx.clip();
      const lit = m.lit === 1 ? E.smooth(span(t, a.survived + m.d * .06, a.survived + .5 + m.d * .06)) : .25 * E.smooth(span(t, a.survived + .5, a.survived + 1));
      B.mouse(ctx, t, m.x, 710 + (1 - r) * 80, 62, { lit, dashed: m.lit === 'dash' && t > a.survived + .4 });
      ctx.restore();
    }
    const lu = F.rise(span(t, a.survived + .45, a.survived + 1.2));
    if (lu > 0) { const w1 = F.maskLine(ctx, [['80–100 %', 0]], 1110, 800, 64, lu, { align: 'center', glow: true }); F.maskLine(ctx, [['SURVIVED', 0]], 1110, 846, 24, F.rise(span(t, a.survived + .7, a.survived + 1.4)), { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false }); }
    const bu = span(t, a.sofar + .3, a.sofar + 1.2);
    if (bu > 0) F.bracket(ctx, 590, 1630, 596, bu, 'MICE ONLY', { size: 28 });
    const cu = span(t, a.single - .2, a.single + .6);
    if (cu > 0) B.caveat(ctx, 1110, 512, ['SINGLE TOXINS · NOT WHOLE VENOM'], cu, { align: 'center', t, size: 22, screen: false });
    ctx.restore();
  }
  // ---------------------------------------------------------------- the mind space content (F0 card)
  function labFront(ctx, t) {
    const pr = pairAt(t), fold = foldAt(t), grow = span(t, tz0 + .3, tz0 + 2.0);
    // the ribbon (protein) → the thread → the knot
    if (looseAt(t) <= 0) {
      const pts = B.ribbonPts(t, { fold, open: openAt(t), x: pr.x, y: pr.y, s: pr.s });
      const hot = span(t, a.off, a.off + .5) * (1 - span(t, a.off + 1.2, a.off + 2.6)) + .5 * F.bump(t, a.blood - .3, 1.4);
      if (hot > 0) halo(ctx, pr.x, pr.y, 260 * pr.s, .35 * hot, P.halo0, P.core1);
      const head = B.ribbon(ctx, t, pts, { w: 15 * pr.s, grow: t < ts ? grow : 1 });
      // THE AIM while it designs: the bead's beam rides the fold front
      const bd = beadAt(t), bu = span(t, a.lab + .5, a.lab + 1.1) * (1 - span(t, a.proteins + .4, a.grab - .3));
      if (bu > 0) { const P2 = E.catmull(pts.map((p) => [p[0], p[1]]), 8), hp = P2[Math.min(P2.length - 1, Math.floor(clamp(fold) * (P2.length - 1)))]; F.beam(ctx, t, bd.x, bd.y, hp[0], hp[1], bu, { w: 2.4, hit: .4 * bu, warm: .2 }); }
    } else {
      const ku = knotAt(t), pts = threadPts(t, pr);
      B.thread(ctx, pts, { w: lerp(5.5, 4, ku), col: 'warm', col2: 'dim', mix: E.smooth(span(ku, .4, 1)) });
    }
    const tx = toxAt(t); if (tx.a > 0 && t > a.proteins) B.toxin(ctx, t, tx.x, tx.y, tx.r, { off: tx.off, a: tx.a });
    if (t > a.off && t < a.off + 1.2) { const k = span(t, a.off, a.off + 1.2); ctx.strokeStyle = rgba(P.halo0, .6 * (1 - k)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(pr.x, pr.y, (40 + 220 * expoOut(k)) * pr.s, 0, Math.PI * 2); ctx.stroke(); }
    mice(ctx, t);
    // the person (revealed as the camera follows the thread left); breathing, head turning a little
    if (t > a.butcan) { const [x, y, h] = B.MIND.person; E.person(ctx, x, y, h, { look: .15 + .05 * Math.sin(t * .6), light: 1, dir: 1, back: .25, lean: .01 * Math.sin(t * .5) }); }
    const bd = beadAt(t); F.agent(ctx, t, bd.x, bd.y, bd.r, { think: bd.think, ring: span(bd.r, 4, 8) });
  }
  function lab(ctx, t, c) {
    const pr = pairAt(t), pg = sineIO(span(t, a.butcan + .2, R.b - .3));
    const glow = [lerp(pr.x, B.MIND.glow[0], pg), lerp(pr.y, B.MIND.glow[1], pg), lerp(560 * pr.s, B.MIND.glow[2], pg), 1];
    B.labWorld(ctx, c, t, { glow, cool: [beadAt(t).x, beadAt(t).y, 260, span(t, a.lab, a.lab + 1)], front: (cx) => labFront(cx, t) });
  }

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t < ts) {
      const c = camGd(t), sn = snakeState(t);
      const st = {
        shadowX: lerp(600 + 140 * Math.sin(t * .4), sn.x - 120, sn.g), shadow: 1 - sn.g, part: lerp(1, .8, sn.g), village: 1, bow: sineIO(span(t, a.horses - .5, a.whatif + 1.5)), sink: 1100 * sineIO(span(t, tz0 - .4, ts - .5)),
        stable: (1 - E.smooth(span(t, a.horse - .1, a.horse + .45))) * (t > a.horse - .5 && t < a.horse - .1 ? .7 + .3 * Math.sin(t * 47) : 1),
        snake: sn.g > 0 ? (cx) => { const pts = B.snakeSpine(t, sn.x, sn.y, 2, { coil: sn.coil, rise: sn.rise, ph: t * 3.4 }); B.snake(cx, t, pts, 2, { a: sn.g }); } : null,
        vialInside: (cx, L) => {   // the mind space seen in the liquid (it grows as the camera dives)
          if (t < tz0 - .5) return;
          const m = cx.getTransform(), r = { x: m.a * L.x + m.e, y: m.d * L.y + m.f, w: m.a * L.w, h: m.d * L.h };
          const k = r.w / B.LAB_W, M = { k, e: r.x + r.w / 2 - k * W / 2, f: r.y + r.h / 2 - k * H / 2 };
          E.withOuter(M, () => lab(cx, t, camL(t)));
        },
      };
      const z = zoomAt(t);
      if (z) E.withOuter(z, () => B.grassVillage(ctx, c, t, st)); else B.grassVillage(ctx, c, t, st);
    } else {
      E.withOuter(OUT(t), () => lab(ctx, t, camL(t)));
    }
    // REAL stamp + source (Baker lab), the lamp rail
    F.realStamp(ctx, t, a.designed + .1, a.grab + .2, 'baker');
    F.source(ctx, t, a.off + .2, a.sofar + 4.2, F.SOURCES.baker);
    // the caveat (single toxins, not whole venom): a small dashed line under the mice
    F.lampRail(ctx, t, T);
  };
}
