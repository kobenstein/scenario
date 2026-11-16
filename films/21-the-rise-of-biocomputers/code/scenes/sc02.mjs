// c02 · Blood → stem cell → neuron → the chip (wiring up) · electrodes + code · the box · imitation vs original
// T.G('In a lab') → T.G('The answer came') · builder B1. Plan: docs/shots.md 2.01–2.07 · kit lib/f19_kit.mjs · B1 module lib/f19_b1_world.mjs
// ONE entry, ONE camera on the dish field (2D field camera, lib/f19_b1_world.mjs): it grows out of plateClock (the cell's clock).
//
// | ID   | anchor (word)                         | picture (one idea)                                                       | 1–2 moves              |
// |------|---------------------------------------|--------------------------------------------------------------------------|------------------------|
// | 2.01 | turned back · stem cells · almost anything · Nobel · no embryos | the clock keeps turning back, the blood cell warms into a gold stem cell; the ring sends out a fan of faint futures; NOBEL PRIZE 2012 · NO EMBRYOS | cell warms · fan |
// | 2.02 | clock runs forward · grow into neurons · Brain cells | the hands turn forward, the fan folds into its one neuron branch, the cell sprouts dendrites | hands · sprout |
// | 2.03 | Spread them on a chip · reach out · wiring up | the neuron settles onto the chip and copies of it spread to 34 places; the net grows | spread · net grows |
// | 2.04 | send them signals · their answers · Ordinary code | electrode pulses sweep (cool) → the somas fire; answers run back (gold); a line of code types along the rim | pulses · answers |
// | 2.05 | That's the computer · living neurons · life support · Cortical Labs | pull back: a ring of light runs out of the dish rim and reveals THE BOX around it; pump; CORTICAL LABS · MELBOURNE | pull back · pump |
// | 2.06 | imitates neurons with math · the real thing | the box to the right; a cool copy of the net leaves the window and stiffens into a layered graph; the real net fires | copy → graph · net fires |
// | 2.07 | So how do you teach it … without a reward? (ladder rung 2) | the graph flows back into the window; the camera pushes into the window, the box retracts into the dish rim | graph back · push in |
// Seams: in = plateClock (lib/f19_seams.mjs) for t < T0 + .5; out = the dish field at the canonical camera (FIELD_DISH, full net), c03 starts there.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import { plateClock, CLOCK_PLATE, SEAM_HALF } from '../lib/f19_seams.mjs';
import * as B from '../lib/f19_b1_world.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, prng } = E;
const { COOL, NET, bump } = F;
const TAU = Math.PI * 2;

export const PRINT = F.PRINT19;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T);
  a.T0 = R.a; a.end = R.b;
  return [{ t: R.a, draw: scene(a, T), print: PRINT }];
};

// the box framings (2D camera): centred (box 820 px wide), then to the right for the split
const BOXW = 820 / (B.boxFromWindow(F.fieldMap(960, 540, 470)).w);
const C_BOX = (() => { const g = B.boxFromWindow(F.fieldMap(960, 540, 470)); return B.cam2(g.x, g.y - g.h / 2, BOXW); })();
const C_SPLIT = (() => { const g = B.boxFromWindow(F.fieldMap(960, 540, 470)), z = .33; return B.cam2(g.x - (1330 - 960) / z, g.y - g.h / 2 - (560 - 540) / z, z); })();
const FUT = ['muscle', 'heart', 'neuron', 'skin', 'bone'];               // the fan of futures (left → right); the neuron is the middle one
const FUT_ANG = [-150, -120, -90, -60, -30].map((d) => d * Math.PI / 180);
const LAYERS = [3, 4, 4, 2], LX = [300, 470, 640, 800];                  // the cool graph (screen)
const CODE = 'stim(14) · read(33) · stim(07) · read(51) · stim(22) · read(40) · stim(09)';

function scene(a, T) {
  const tPlate = a.T0 + SEAM_HALF;
  // the minute hand: −1.6 rad/s (plateClock), turning FORWARD (+1.6) from "the clock runs forward" (integrated, no jump)
  const tA = a.fwd - .25, tB = a.fwd + .55;
  const hand = (t) => { const x = span(t, tA, tB); const I = t < tA ? 0 : t < tB ? (tB - tA) * (x ** 3 - x ** 4 / 2) : (tB - tA) * .5 + (t - tB); return -1.6 * t + 3.2 * I; };
  const K = [
    [a.T0, B.CANON], [a.T0 + .5, B.CANON], [a.almost - .6, B.cam2(960, 545, 1.03)], [a.almost + 1.8, B.cam2(960, 520, .93)], [a.fwd + .6, B.cam2(960, 525, .95)], [a.brain + .2, B.cam2(960, 560, 1.1)],
    [a.spread - .1, B.cam2(960, 560, 1.1)], [a.reach + .7, B.cam2(960, 540, 1)], [a.tiny - .2, B.cam2(960, 540, 1)], [a.signals + 1.4, B.cam2(960, 555, 1.05)],
    [a.computer + .15, B.cam2(960, 555, 1.05)], [a.living + .9, C_BOX], [a.ai, C_BOX], [a.imitates - .1, C_SPLIT], [a.how + 1.6, C_SPLIT],
    [a.end - .3, B.CANON],
  ];
  const camAt = (t) => B.cam2Drift(B.cam2At(t, K), t, .6 * smooth(span(t, tPlate, tPlate + 1.6)) * (1 - smooth(span(t, a.end - 1.2, a.end - .3))));
  const HERO = NET.centre;
  // clones: one per soma, leaving the hero in order of distance
  const dist = NET.somas.map((s) => Math.hypot(s[0] - NET.somas[HERO][0], s[1] - NET.somas[HERO][1]));
  const cloneT = NET.somas.map((s, i) => a.spread + .75 + dist[i] * .45);
  // electrodes: nearest pad per soma; the signal sweep; the answers' order (seeded)
  const nearPad = NET.somas.map((s) => { let best = null, bd = 9; for (const [i, j] of B.ePads) { const [u, v] = B.eUV(i, j), d = Math.hypot(u - s[0], v - s[1]); if (d < bd) { bd = d; best = [i, j]; } } return best; });
  const tSig = (i, j) => a.signals + (i + (7 - j)) * .075;
  const rr = prng(1902), ansRank = NET.somas.map((_, i) => [i, rr()]).sort((p, q) => p[1] - q[1]).map((p) => p[0]);
  const tAns = new Array(NET.somas.length); ansRank.forEach((i, k) => { tAns[i] = a.answers + k * .045; });
  const gauss = (x) => Math.exp(-x * x);
  // the graph nodes: 13 somas (centre outward), their layer slots
  const GN = []; { let k = 0; LAYERS.forEach((n, L) => { for (let q = 0; q < n; q++) GN.push({ soma: NET.order[k++], L, x: LX[L], y: 430 + (q - (n - 1) / 2) * 100, k: GN.length }); }); }
  const EDGES = []; for (const A of GN) for (const Bn of GN) if (Bn.L === A.L + 1) EDGES.push([A, Bn]);

  return (ctx, t) => {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t < tPlate) { plateClock(ctx, t); ctx.restore(); F.ladder(ctx, t, T); return; }
    const c = camAt(t), m = B.mapOf(c), z = c.z;
    B.night(ctx);
    // ---- the box around the dish (2.05–2.07): the iris runs out of the rim, and back in
    const g = B.boxFromWindow(m), cover = B.boxCover(g);
    const iris = 1 + (cover - 1) * sineIO(span(t, a.computer + .4, a.living + 1.1)) * (1 - sineIO(span(t, a.how + 2.0, a.end - .5)));
    const pump = smooth(span(t, a.life - .2, a.life + .7));
    if (iris > 1) B.box(ctx, t, g, { iris, pump, tube: bump(t, a.life - .1, 1.8) * .8, status: bump(t, a.box - .1, 1.2) });
    // ---- the dish (+ the net from 2.03)
    const gN = sineIO(span(t, a.reach - .1, a.own + .2));
    const chipU = smooth(span(t, a.chip - .2, a.chip + .6)), eTiny = smooth(span(t, a.tiny - .1, a.tiny + .7)) * (1 - smooth(span(t, a.codeE, a.codeE + 1)));
    const dishO = { glow: lerp(.55, .6, chipU), chip: lerp(.5, .7, chipU), electrodes: lerp(.25, .45, chipU) + .4 * eTiny, rim: lerp(.7, .8, chipU) };
    dishO.ePulse = (i, j) => {
      let p = 0; const ts = tSig(i, j); if (t > ts - .3 && t < ts + .4) p = gauss((t - ts) / .1);
      return p;
    };
    const fire = (i) => {
      const [pi, pj] = nearPad[i], ts = tSig(pi, pj) + .12; let f = t > ts - .3 && t < ts + .4 ? gauss((t - ts) / .1) : 0;
      if (t > tAns[i] - .3 && t < tAns[i] + .4) f = Math.max(f, gauss((t - tAns[i]) / .09));
      const dl = Math.hypot(NET.somas[i][0], NET.somas[i][1]);           // "living neurons": a wave from the centre; "the real thing": again
      for (const t0 of [a.living + .05, a.real + .1]) { const kk = (t - t0 - dl * .7) / .1; if (kk > -3 && kk < 3) f = Math.max(f, gauss(kk)); }
      return f;
    };
    const netO = gN > 0 ? { grow: gN, lit: 1 - .35 * smooth(span(t, a.signals - .7, a.signals - .1)) * (1 - smooth(span(t, a.code, a.code + .7))), ambient: smooth(span(t, a.own - .3, a.own + .8)), fire, w: 1 } : false;
    F.dish(ctx, t, m, { ...dishO, net: netO });
    // ---- answers: a gold bead from the soma down to its pad, the pad glows warm
    for (let i = 0; i < NET.somas.length; i++) {
      const u = span(t, tAns[i] + .04, tAns[i] + .34); if (u <= 0 || t > tAns[i] + .9) continue;
      const [pi, pj] = nearPad[i], [eu, ev] = B.eUV(pi, pj), s = NET.somas[i];
      if (u < 1) { const q = m(lerp(s[0], eu, sineIO(u)), lerp(s[1], ev, sineIO(u))); halo(ctx, q[0], q[1], 14 * z, .8, P.halo0, P.core0); }
      const gl = bump(t, tAns[i] + .3, .6); if (gl > 0) { const q = m(eu, ev); halo(ctx, q[0], q[1], 26 * z, .7 * gl, P.halo0, P.core1); }
    }
    // ---- the cell and its clock, the fan of futures, the neuron, the spread (2.01–2.03)
    hero(ctx, t, m, z, gN);
    // ---- the code along the rim (2.04)
    code(ctx, t, m, z);
    // ---- NOBEL PRIZE 2012 · NO EMBRYOS (under the clock)
    const nu = F.rise(span(t, a.nobel - .2, a.nobel + .6)) * (1 - expoIn(span(t, a.fwd + .3, a.fwd + .85)));
    const eu = F.rise(span(t, a.embryos - .2, a.embryos + .6)) * (1 - expoIn(span(t, a.fwd + .4, a.fwd + .95)));
    B.word(ctx, 'NOBEL PRIZE 2012', m.c[0], m.c[1] + 375 * z, 30, nu, { align: 'center' });
    B.word(ctx, 'NO EMBRYOS', m.c[0], m.c[1] + 420 * z, 22, eu, { align: 'center', col: P.halo2 });
    if (iris > 1) B.boxFront(ctx, t, g, { iris });
    // ---- CORTICAL LABS · MELBOURNE (from the box's top-right corner)
    const lu = F.rise(span(t, a.cortical - .2, a.cortical + .6)) * (1 - expoIn(span(t, a.ai - .4, a.ai + .1)));
    if (lu > 0) B.tag(ctx, g.x + g.w * .5 - 8, g.y - g.h + 8, lu, 'CORTICAL LABS', 'MELBOURNE', { dx: 60, dy: -64 });
    // ---- the cool graph (2.06–2.07)
    graph(ctx, t, m, z);
    ctx.restore();
    F.ladder(ctx, t, T);
  };

  // the hero cell: blood (warm .3, the plate) → stem (gold) → neuron; then it settles on its soma and its copies spread
  function hero(ctx, t, m, z, gN) {
    const warm = lerp(CLOCK_PLATE.warm, 1, sineIO(span(t, a.turned, a.stem + .45)));
    const r0 = CLOCK_PLATE.cellR * lerp(1, 1.09, sineIO(span(t, a.turned, a.stem + .45)));
    const sprout = sineIO(span(t, a.grow - .05, a.grow + 1.4));
    const mv = sineIO(span(t, a.spread - .05, a.spread + 1.3));       // to its soma, shrinking to a soma
    const [sx, sy] = F.somaAt(m, HERO), [cx, cy] = m(0, 0);
    const somaR = Math.max(1.6, m.r * .016);
    const x = lerp(cx, sx, mv), y = lerp(cy, sy, mv), r = lerp(r0 * z, somaR * 1.15, mv);
    const ck = 1 - span(t, a.brain - 1.0, a.brain + .4);
    const cellA = 1 - smooth(span(gN, .22, .34));
    // the fan of futures (behind the cell)
    fan(ctx, t, x, y, r0 * z * CLOCK_PLATE.clockR, z, mv);
    if (cellA > 0) {
      if (t < a.spread + 1.4) halo(ctx, x, y, r * 2.4, .18 * bump(t, a.brain - .2, 1.6) + .06, P.halo1, P.core1);
      F.cell(ctx, t, x, y, r, { kind: warm < .999 ? 'blood' : 'neuron', warm, sprout: sprout * (1 - mv), clock: ck > 0 ? ck : 0, clockR: CLOCK_PLATE.clockR * (1 + 0 * mv), hand: hand(t), a: cellA });
    }
    // the copies
    if (t > a.spread + .7) for (let i = 0; i < NET.somas.length; i++) {
      if (i === HERO) continue;
      const u = span(t, cloneT[i], cloneT[i] + .95); if (u <= 0) continue;
      const [tx, ty] = F.somaAt(m, i), e = sineIO(u), nx = -(ty - sy), ny = tx - sx, bow = .12 * Math.sin(Math.PI * e);
      const px = lerp(sx, tx, e) + nx * bow, py = lerp(sy, ty, e) + ny * bow;
      F.cell(ctx, t, px, py, somaR * 1.15 * lerp(.6, 1, smooth(clamp(u * 3))), { kind: 'neuron', warm: 1, seed: i, a: cellA });
    }
  }
  function fan(ctx, t, x, y, R, z, mv) {
    if (t < a.almost - .3 || t > a.fwd + 2.4) return;
    FUT.forEach((kind, i) => {
      const grow = expoOut(span(t, a.almost - .15 + i * .1, a.almost + .85 + i * .1));
      const isN = kind === 'neuron';
      const fold = isN ? sineIO(span(t, a.fwd + .9, a.grow + .1)) : expoIn(span(t, a.fwd + .2 + Math.abs(i - 2) * .12, a.fwd + 1.0 + Math.abs(i - 2) * .12));
      const L = 95 * z * grow, ang = FUT_ANG[i] + .02 * Math.sin(t * .6 + i);
      if (grow <= 0 || fold >= 1) return;
      const r0 = R + 4 * z, tipD = isN ? lerp(r0 + L, 0, fold) : r0 + L * (1 - fold), baseD = isN ? Math.min(r0, tipD) : r0;
      const bx = x + Math.cos(ang) * baseD, by = y + Math.sin(ang) * baseD, ex = x + Math.cos(ang) * tipD, ey = y + Math.sin(ang) * tipD;
      if (tipD > baseD + 2) { ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = Math.max(1.4, 2.4 * z); ctx.setLineDash([6 * z, 8 * z]); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]); }
      const s = 46 * z * grow * (isN ? 1 : 1 - fold * .5) * (isN ? lerp(1, .55, fold) : 1);
      future(ctx, t, kind, ex + Math.cos(ang) * s * 1.1, ey + Math.sin(ang) * s * 1.1, s, ang, isN ? .9 : .75);
    });
  }
  function code(ctx, t, m, z) {
    const n = Math.floor((t - a.code + .1) * 32), e0 = Math.floor((t - a.codeE - .1) * 45);
    if (n <= 0 || e0 >= CODE.length) return;
    const [cx, cy] = m.c, R = m.r * .935, size = 20 * z;
    ctx.save(); ctx.font = `500 ${size}px Inter`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    let ang = Math.PI / 2 + .62;                                     // from the bottom-left along the rim, left → right
    for (let k = 0; k < CODE.length; k++) {
      const ch = CODE[k], wch = ctx.measureText(ch).width;
      const da = (wch + size * .08) / R; ang -= da / 2;
      if (k < n && k >= Math.max(0, e0)) {
        ctx.save(); ctx.translate(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R); ctx.rotate(ang - Math.PI / 2);
        ctx.fillStyle = rgba(COOL.mid, k === n - 1 ? 1 : .75); ctx.fillText(ch, 0, 0); ctx.restore();
      }
      ang -= da / 2;
    }
    ctx.restore();
  }
  function graph(ctx, t, m, z) {
    const out = span(t, a.how + .2, a.how + 1.6);
    if (t < a.imitates - .2 || out >= 1) return;
    // edges: grow layer by layer on "with math", retract right → left on "So how do you teach it"
    for (const [A, Bn] of EDGES) {
      const gu = sineIO(span(t, a.math - .35 + A.L * .22, a.math + .25 + A.L * .22)) * (1 - sineIO(span(t, a.how + (2 - A.L) * .15, a.how + .45 + (2 - A.L) * .15)));
      if (gu <= 0) continue;
      ctx.strokeStyle = rgba(COOL.mid, .5); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(lerp(A.x, Bn.x, gu), lerp(A.y, Bn.y, gu)); ctx.stroke();
    }
    for (const N of GN) {
      const go = sineIO(span(t, a.imitates - .1 + N.k * .045, a.imitates + .8 + N.k * .045)), back = sineIO(span(t, a.how + .7 + N.k * .03, a.how + 1.5 + N.k * .03));
      if (go <= 0 || back >= 1) continue;
      const [sx, sy] = F.somaAt(m, N.soma), e = go * (1 - back);
      const x = lerp(sx, N.x, e), y = lerp(sy, N.y, e) - Math.sin(Math.PI * e) * 60, r = lerp(m.r * .016, 13, e);
      halo(ctx, x, y, r * 4, .35, COOL.edge, COOL.core);
      ctx.fillStyle = E.rad(ctx, x - r * .3, y - r * .3, r * 1.3, [[0, COOL.core], [.6, COOL.mid], [1, COOL.edge]]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
  }
}

// the faint futures (screen, s = size): small cell kinds in faint gold
function future(ctx, t, kind, x, y, s, ang, al) {
  if (s <= .5) return;
  if (kind === 'neuron') { F.cell(ctx, t, x, y, s * .55, { kind: 'neuron', sprout: 1, warm: 1, a: al }); return; }
  ctx.save(); ctx.globalAlpha *= al; ctx.translate(x, y);
  const fill = rgba(P.core1, .55), edge = rgba(P.halo0, .9);
  ctx.fillStyle = fill; ctx.strokeStyle = edge; ctx.lineWidth = Math.max(1, s * .06);
  ctx.beginPath();
  if (kind === 'muscle') { ctx.rotate(ang + Math.PI / 2); ctx.ellipse(0, 0, s * 1.15, s * .32, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.strokeStyle = rgba(P.halo1, .6); for (const k of [-.5, 0, .5]) { ctx.beginPath(); ctx.moveTo(k * s, -s * .25); ctx.lineTo(k * s, s * .25); ctx.stroke(); } }
  else if (kind === 'heart') { ctx.roundRect(-s * .8, -s * .45, s * 1.6, s * .9, s * .2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s * .8, 0); ctx.lineTo(s * 1.1, -s * .3); ctx.stroke(); ctx.fillStyle = rgba(P.shade0, .6); ctx.beginPath(); ctx.arc(-s * .2, 0, s * .18, 0, TAU); ctx.arc(s * .3, 0, s * .18, 0, TAU); ctx.fill(); }
  else if (kind === 'skin') { for (let k = 0; k < 6; k++) { const an = k / 6 * TAU + .3; k ? ctx.lineTo(Math.cos(an) * s * .7, Math.sin(an) * s * .7) : ctx.moveTo(Math.cos(an) * s * .7, Math.sin(an) * s * .7); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
  else if (kind === 'bone') { ctx.arc(0, 0, s * .38, 0, TAU); ctx.fill(); ctx.stroke(); ctx.lineCap = 'round'; for (let k = 0; k < 7; k++) { const an = k / 7 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(an) * s * .38, Math.sin(an) * s * .38); ctx.lineTo(Math.cos(an + .3) * s * .8, Math.sin(an + .3) * s * .8); ctx.stroke(); } }
  ctx.restore();
}
