// c09 · B3 · THE SEVENTH TAG · out of plateStairs (thumbnail B): the seventh tag comes down, face down, next to you in the house door ·
// NOT FINANCIAL ADVICE (small) · the test question: how much of this price is work? the dollar bar fills to the end: ALL OF IT · the tag
// turns: YOUR WAGE ★ · the dust of tag 1 drifts in and builds the programmer's tag again (< $1), a pay slip slides out from behind it
// ("It was a paycheck") · pull back: everybody's windows get a small wage tag on a thread, they tremble ("work gets cheap").
// So what does that do → This summer, American businesses. Plan: docs/shots.md 8.01–8.05 · world: docs/MOTION.md.
//
// THE B3 TAKE (c09 → c12 is ONE continuous take): this file also owns the group machinery. b3(T) builds one draw function for
// T.G('So what does that do') + .5 → the end: the anchors of all four chunks, ONE camera path (keys from every chunk file), the world state,
// the veil, the overlays and the clock. sc10 / sc11 / sc12 return the same draw function at their R.a, so the inner seams c09|c10, c10|c11,
// c11|c12 are the same frame on both sides by construction (seam.mjs proves it). Each chunk file owns its own layer (anchors, camera keys,
// world, overlays). Before T0 + .5 this file draws S.plateStairs (B2 → B3 seam); the take continues its creep and grows out of it.
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                                  | camera            |
// |-------|---------------------------------|-------------------------------------------------------------------------------------|-------------------|
// | 8.01  | So what does that do            | out of plateStairs: the seventh tag (face down) comes down next to you; NOT FINANCIAL ADVICE (small) | creep → glide · MIX |
// | 8.02  | Run the same test               | HOW MUCH OF THIS PRICE IS WORK? the bar fills to the end: ALL OF IT (veil .5)        | glide · EXPL      |
// | 8.03★ | It's your wage                  | the seventh tag turns: YOUR WAGE, lit                                                | push in · MIX     |
// | 8.04  | Think back to the first         | dust of tag 1 drifts in, builds the programmer's tag (< $1); a pay slip slides out behind it | creep · MIX |
// | 8.05  | By his own argument             | pull back: small wage tags come down over everybody's windows; they tremble          | pull back · MIX   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
import * as L10 from './sc10.mjs';
import * as L11 from './sc11.mjs';
import * as L12 from './sc12.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, mixHex } = E;
const { rise, GOLD, PAPER } = F;

export const PRINT = F.PRINT66;
// ------------------------------------------------------------------------------------------------ shared helpers (used by sc10–sc12)
export const CL = (u, v, s = 1, sx = W / 2, sy = H / 2) => E.aim(S.Z_LAND, u, v, s, sx, sy);        // a camera on the land card
export const CP = (u, v, s = 1, sx = W / 2, sy = H / 2) => E.aim(S.Z_PROMISE, u, v, s, sx, sy);     // a camera on the promise card
export const PL = (c, u, v) => E.project(c, S.Z_LAND, u, v);                                        // land design px → screen
// the seventh tag (land card px): it hangs right of the house-tag, the next step of the row (thumbnail B), next to you in the door
export const SEV = { x: 6060, y: 640, w: 120 };
// the promise's face (promise card px), as in c01
const PR = S.PROMISE, PH = PR.w * 1.42;
export const onPromise = (lx, ly) => [PR.x + lx * Math.cos(PR.rot) - ly * Math.sin(PR.rot), PR.y + lx * Math.sin(PR.rot) + ly * Math.cos(PR.rot)];
export const FACE = onPromise(PR.w * .1, PH * .3);   // a point on the half that is still there (the lower-left half is dust)
export const faceAt = (c) => E.project(c, S.Z_PROMISE, FACE[0], FACE[1]);
// a night panel in screen space (gold edge): rises from 40 px below with its content; returns nothing (draw text on top yourself)
export function panel(ctx, t, x, y, w, h, u, o = {}) { return F.paperCard(ctx, t, x, y, w, h, { u, style: 'night', rot: o.rot ?? 0, head: o.head, headSize: 22 }); }
// a line of small caps that rises behind its mask (≥ 22 px)
export const caps = (ctx, txt, x, y, u, o = {}) => F.goldText(ctx, [[txt, o.gold ?? 0]], x, y, o.size ?? 22, rise(clamp(u)), { serif: false, weight: o.weight ?? 600, spacing: o.spacing ?? .08, align: o.align, col: o.col ?? P.cream });
export const big = (ctx, txt, x, y, size, u, o = {}) => F.goldText(ctx, [[txt, o.gold ?? 1]], x, y, size, rise(clamp(u)), { serif: true, align: o.align, glow: o.glow ?? true, col: o.col });

// ------------------------------------------------------------------------------------------------ the B3 take
const MEMO = new WeakMap();
export function b3(T) {
  if (MEMO.has(T)) return MEMO.get(T);
  E.prepareEditorial();
  const A = {}, G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  anchors(A, G, GE, T); L10.anchors(A, G, GE, T); L11.anchors(A, G, GE, T); L12.anchors(A, G, GE, T);
  const layers = [layer(A, T), L10.layer(A, T), L11.layer(A, T), L12.layer(A, T)];
  // ONE camera path: the creep out of the plate, then the keys of all four chunks
  const t0 = A.so, tP = t0 + S.SEAM_HALF;
  const creepCam = (t) => { const k = 1 + S.CREEP * (t - (t0 - S.SEAM_HALF)); return S.STAIRS_CAM(k, S.trk(k) * .3); };
  const K = [[tP, creepCam(tP)], [tP + .9, creepCam(tP + .9)], ...layers.flatMap((l) => l.keys ?? [])].sort((p, q) => p[0] - q[0]);
  const camRaw = (t) => (t < tP + .9 ? creepCam(t) : F.camPath(t, K));
  const driftAmp = (t) => 4 * smooth(span(t, tP, tP + 2.5)) * (1 - .7 * smooth(span(t, A.endT - 4, A.endT)));
  const cam = (t) => E.camDrift(camRaw(t), t, driftAmp(t), 9);
  const base = () => ({ you: false, stairs: 1, houseTag: 1, youLand: { x: S.STAIRS.house.x, h: 70, o: { look: .5 } }, power: .3, cool: 1, promise: S.PROMISE_HALF, tags: [] });
  const draw = (ctx, t) => {
    const c = cam(t), st = base(), lands = [];
    for (const l of layers) if (l.world) l.world(t, st, c);
    for (const l of layers) if (l.land) lands.push(l.land);
    st.land = (cx) => { for (const f of lands) f(cx, t, c); };
    S.landWorld(ctx, c, t, st);
    for (const l of layers) if (l.under) l.under(ctx, t, c);            // world-attached screen things (drawn under the veil)
    F.veil(ctx, Math.max(0, ...layers.map((l) => (l.veil ? l.veil(t) : 0))));
    for (const l of layers) if (l.over) { ctx.save(); l.over(ctx, t, c); ctx.restore(); }
    const bo = layers.reduce((m, l) => ({ ...m, ...(l.board ? l.board(t) : {}) }), {});
    const bc = layers.reduce((m, l) => (l.boardClip ? l.boardClip(t) ?? m : m), null);
    if (bc != null) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(0, bc, 680, 320 - bc); ctx.clip('evenodd'); F.board(ctx, t, T, bo); ctx.restore(); }
    else F.board(ctx, t, T, bo);
    for (const l of layers) if (l.top) { ctx.save(); l.top(ctx, t, c); ctx.restore(); }   // sources, clip plates (above the clock)
  };
  const r = { A, draw, cam }; MEMO.set(T, r); return r;
}

export default async (T, R) => {
  const B = b3(T);
  return [{ t: R.a, draw: (ctx, t) => S.plateStairs(ctx, t, T), print: PRINT }, { t: R.a + S.SEAM_HALF, draw: B.draw, print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ c09
function anchors(a, G, GE) {
  a.so = G('So what does that do'); a.notAdv = G("This isn't financial advice", a.so); a.seventh = G("It's the seventh price tag", a.so);
  a.name = G('The one with your name', a.so); a.test = G('Run the same test', a.so); a.how = G('How much of this price', a.test);
  a.allOf = G('All of it', a.test); a.wage = G("It's your wage", a.allOf); a.think = G('Think back to the first', a.wage);
  a.dollar = G('less than a dollar', a.think); a.bargain = G("That wasn't only a bargain", a.think); a.paycheck = G('It was a paycheck', a.think);
  a.argument = G('By his own argument', a.think); a.workCheap = G('because work gets cheap', a.argument); a.sell = G('And work is what most of us sell', a.argument);
}
// the programmer's tag again (land px): high in the sky left of the house-tag; its dust drifts in from the office side (the left)
const PT = { x: 5560, y: 470, w: 92 };
// small wage tags over everybody's windows (land px: eyelet x, y): the barn, the far roofs, the town hall's six windows
const WT = [[4990, 660], [5190, 700], [5560, 690], [6380, 640], [6452, 652], [6524, 640], [6596, 652], [6668, 640], [6740, 652], [6930, 700], [7120, 690]];
function layer(a, T) {
  const sevenDown = (t) => span(t, a.so + .6, a.so + 3.0);
  const back = (t) => 1 - sineIO(span(t, a.wage - .15, a.wage + .9));
  const testU = (t) => span(t, a.test - .1, a.test + .8) * (1 - span(t, a.wage - .3, a.wage + .3));
  const dust0 = (t) => 1 - .45 * sineIO(span(t, a.think + 1.0, a.think + 2.8));
  const ptOut = (t) => expoIn(span(t, a.sell + 1.2, L10.firstT(a) + .6));
  const wtDown = (i, t) => span(t, a.argument + .3 + i * .09, a.argument + 1.5 + i * .09);
  const wtUp = (i, t) => expoIn(span(t, L10.firstT(a) - .2 + i * .04, L10.firstT(a) + 1.2 + i * .04));
  return {
    keys: [
      [a.seventh + 1.6, CL(5930, 690, 1.42, 960, 560)],
      [a.wage - .3, CL(5965, 690, 1.5, 960, 560)],
      [a.wage + 1.1, CL(6040, 700, 1.95, 1010, 560)],
      [a.think + 2.6, CL(5830, 620, 1.75, 960, 540)],
      [a.paycheck + .8, CL(5826, 626, 1.73, 960, 540)],
      [a.argument + 3.6, CL(5900, 700, 1.0, 960, 560)],
      [a.sell + 3.0, CL(5925, 700, 1.03, 960, 560)],
    ],
    world(t, st) {
      const d = sevenDown(t); if (d <= 0) return;
      const fall = -980 * (1 - expoOut(d)) + 10 * F.bump(t, a.so + 2.4, .9);
      const shiver = .06 * F.bump(t, a.name, 1.3) * Math.sin(t * 7) + .05 * F.bump(t, a.wage + .2, 1.6) * Math.sin(t * 5);
      st.tags[6] = { ...(st.tags[6] ?? {}), x: SEV.x, y: SEV.y, w: SEV.w, dy: fall, back: back(t), swing: shiver,
        glow: lerp(.4, 1, sineIO(span(t, a.wage - .1, a.wage + .8))) - .2 * span(t, a.think, a.think + 2),
        lines: [['YOUR', 26, 0, false], ['WAGE', 26, 0, false]], textU: span(t, a.wage + .25, a.wage + 1.0) };
      st.youLand.o = { look: lerp(.5, .9, smooth(span(t, a.so + 1.5, a.so + 3))) };
    },
    land(ctx, t, c) {
      // 8.04: the dust of tag 1 drifts in from the left and builds the programmer's tag again; < $1; a pay slip slides out behind it
      const out = ptOut(t); if (t < a.think || out >= 1) return;
      const r = E.prng(661);
      for (let i = 0; i < 46; i++) {
        const sx = 4200 + r() * 700, sy = 260 + r() * 420, d0 = r() * 1.1, p = sineIO(span(t, a.think + d0, a.think + 1.4 + d0));
        if (p <= 0 || p >= 1) continue;
        const x = lerp(sx, PT.x + (r() - .5) * 60, p), y = lerp(sy, PT.y + 60 + (r() - .5) * 80, p) - 60 * Math.sin(Math.PI * p);
        E.halo(ctx, x, y, 7, .7 * Math.sin(Math.PI * p), GOLD.halo, GOLD.core);
      }
      const dy = -900 * out, slip = sineIO(span(t, a.paycheck - .1, a.paycheck + .9)) * (1 - sineIO(span(t, a.sell + .4, a.sell + 1.2)));
      if (slip > 0) F.paySlip(ctx, t, PT.x + 80 * slip, PT.y + 70 + 26 * slip + dy, 74, { glow: .6 * slip, rot: -.1 - .1 * slip, label: 'PAYCHECK', a: clamp(slip * 4) });
      F.tag(ctx, t, PT.x, PT.y + dy, PT.w, { dust: dust0(t), glow: .55, seed: 7, swing: .03 * Math.sin(t * .9),
        lines: [['A TOP', 13, 0, false], ['PROGRAMMER’S', 13, 0, false], ['WEEK', 13, 0, false]] });
      const pu = span(t, a.dollar - .1, a.dollar + .8) * (1 - span(t, a.argument - .2, a.argument + .6));
      if (pu > 0) F.goldText(ctx, [[F.SOURCES.programmerPrice, 1]], PT.x - 120, PT.y + 80, 44, rise(pu), { serif: true, align: 'right', glow: true });
      // 8.05: small wage tags come down on threads over everybody's windows; they tremble on "work gets cheap"
      WT.forEach(([x, y], i) => {
        const dn = wtDown(i, t), up = wtUp(i, t); if (dn <= 0 || up >= 1) return;
        const tr = F.bump(t, a.workCheap + i * .05, 2.2), yy = y - 700 * (1 - expoOut(dn)) - 900 * up;
        F.tag(ctx, t, x, yy, 30, { glow: .45 + .25 * tr, seed: 200 + i, swing: .16 * tr * Math.sin(t * 11 + i * 1.7) + (1 - dn) * .2 });
      });
    },
    veil: (t) => .5 * sineIO(testU(t)),
    over(ctx, t) {
      F.float(ctx, t, .5);
      // NOT FINANCIAL ADVICE (small, cream), under the clock
      const na = span(t, a.notAdv - .1, a.notAdv + .5) * (1 - span(t, a.test - .6, a.test - .1));
      if (na > 0) caps(ctx, F.SOURCES.notAdvice, 70, 300, na, { spacing: .14, col: P.halo2 });
      // 8.02: the test question; the bar fills to the end on "All of it"
      const u = testU(t);
      if (u > 0) F.dollarBar(ctx, t, 1250, 330, 580, { u, h: 64, title: F.SOURCES.testQ,
        segs: [{ label: 'WORK', share: 1, col: mixHex(PAPER.body, GOLD.body, .35), u: span(t, a.allOf - .15, a.allOf + .9), big: 'ALL OF IT', gold: 1 }] });
    },
  };
}
