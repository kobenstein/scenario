// c11 · B3 · the verdict · 'Superintelligence is arriving. So' → end (subscribe 2 + the end screen)
// The veil lifts on frame 0 again: the giant headline, you small on the quay; the checklist slides to the centre, big (gold · gold ? ·
// gold · OPEN · half); SUPERINTELLIGENCE turns half cream, IS ARRIVING stays gold; ★ box 4 grows out of the checklist big over you:
// DOES ANY HUMAN UNDERSTAND IT? · OPEN, pulsing cream (never a cross, never red); a new, empty headline AI SOLVED ___ (clearly a blank:
// THE NEXT HEADLINE?) and you hold up two cards CAN A HUMAN FOLLOW IT? · WHO SAYS “CORRECT”?; the camera follows the gold ribbon to the
// referee's chair: you sit on it (the referee's place is yours now), the core sentence; subscribe 2: small warm lights come on along the
// far land; the camera settles onto S.endScreen's camera at the end-screen start (same world state), lower half calm for the tiles.
//
// | ID    | anchor                        | picture (one idea)                                                  | camera                  |
// |-------|-------------------------------|---------------------------------------------------------------------|-------------------------|
// | 10.01 | Superintelligence is arriving | frame 0 again; the checklist big in the centre                      | home · EXPL             |
// | 10.02 | Something has arrived         | SUPERINTELLIGENCE half cream, IS ARRIVING gold                      | creep · MIX             |
// | 10.03★| And the box that is still open| box 4 big over you: OPEN, pulsing cream                             | push to you · EXPL      |
// | 10.04 | So when the next headline     | AI SOLVED ___ (THE NEXT HEADLINE?) · your two cards                 | push in · EXPL          |
// | 10.05 | We may never read             | along the ribbon to the chair, you on it; the core sentence         | glide right · SCENE     |
// | A.01  | This channel exists (2nd)     | small warm lights along the far land                                | creep · LAND            |
// | E.01  | end screen                    | S.endScreen's picture (tiles left/right, subscribe circle)          | end-screen cam · LAND   |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f67_kit.mjs';
import * as S from '../lib/f67_world.mjs';
import * as B from '../lib/b3_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, smooth, expoOut, expoIn, halo, prng } = E;
const { GOLD, CREAM, CREAM2, LAMP } = F;
const { GY } = B;

export default async (T, R) => [{ t: R.a, draw: await B.b3(T), print: F.PRINT67 }];

export const part = {
  keys: (A) => [
    [A.isHe + .6, 960, 546, 1.03], [A.box + .2, 960, 560, 1.06], [A.aboutUs + .6, 960, 610, 1.2], [A.nextHead + .6, 965, 640, 1.32],
    [A.follow - .2, 975, GY - 120, 2.1], [A.mayNever + .1, 978, GY - 124, 2.18], [A.mayNever + 3.2, 3280, GY - 250, 1.18],
    [A.channel + .5, 3420, GY - 230, 1.2], [A.endT, ...B.endUVS(A.endT, A)],
  ],
  draw: frame,
};

const DY = 400;
const LIGHTS = (() => { const r = prng(611), a = []; for (let i = 0; i < 70; i++) a.push([2700 + r() * 5200, GY - 20 - r() * 70, r()]); return a.sort((p, q) => p[0] - q[0]); })();
function lights(cx, t, u) {   // subscribe 2: small warm lights come on along the far land, outward from the chair
  if (u <= 0) return;
  for (const [x, y, q] of LIGHTS) { const on = clamp((u * 5600 - Math.abs(x - S.CHAIR.x)) / 300); if (on <= 0) continue;
    cx.fillStyle = rgba(LAMP.body, .85 * on * (.8 + .2 * Math.sin(t * .8 + q * 20))); cx.fillRect(x, y, 5, 7); halo(cx, x + 2, y + 3, 14, .25 * on, GOLD.halo, GOLD.core); }
}
function bigBox(ctx, t, A) {   // ★ box 4 grows out of the big checklist's box 4 into the centre
  const u = sineIO(span(t, A.box - .1, A.box + 1.8)) * (1 - sineIO(span(t, A.nextHead - .3, A.nextHead + 1.3))); if (u <= 0) return;
  const s0 = 44 * 2.3, x0 = W / 2 - 284 * 2.3 / 2 + 3 * 60 * 2.3, y0 = 120 + DY + 16 * 2.3, s1 = 300, x1 = W / 2 - s1 / 2, y1 = 170;
  const s = lerp(s0, s1, u), x = lerp(x0, x1, u), y = lerp(y0, y1, u), pulse = .5 + .5 * Math.sin(t * 2.2);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = rgba(P.night0, .6); ctx.fillRect(x, y, s, s); ctx.fillStyle = rgba(CREAM, .1 + .08 * pulse); ctx.fillRect(x + 6, y + 6, s - 12, s - 12);
  ctx.strokeStyle = rgba(CREAM, .65 + .35 * pulse); ctx.lineWidth = lerp(2, 5, u) + 2 * pulse; ctx.strokeRect(x, y, s, s);
  halo(ctx, x + s / 2, y + s / 2, s * .9, .12 * u * (.6 + .4 * pulse), P.halo2, CREAM);
  F.goldText(ctx, [['OPEN', 0]], x + s / 2, y + s / 2 + s * .08, s * .2, F.rise(span(u, .4, 1)), { serif: false, weight: 700, spacing: .14, align: 'center', col: CREAM });
  F.goldText(ctx, [[F.CHECKS.boxes[3].q, 0]], W / 2, y - 28, 34, F.rise(span(t, A.box + 1.0, A.box + 1.8)) * u, { serif: false, weight: 700, spacing: .06, align: 'center', col: CREAM });
  ctx.restore();
}

function frame(ctx, t, A, c) {
  const T = A.T;
  if (t >= A.endT) { endScreen(ctx, t, A, c); return; }
  const qp = S.landPt(c, S.YOU.x, GY), onChair = !qp || qp[0] < -160;   // you change place only while the quay is off screen
  const cardsU = [span(t, A.follow - .2, A.follow + .6), span(t, A.whoSays - .2, A.whoSays + .6)].map((u) => u * (1 - span(t, A.mayNever - .1, A.mayNever + .7)));
  const raise = sineIO(span(t, A.follow - .5, A.follow + .2)) * (1 - sineIO(span(t, A.mayNever - .1, A.mayNever + .8)));
  let hands = null;
  S.landWorld(ctx, c, t, {
    head: { dim: .35 * span(t, A.mayNever + 1, A.mayNever + 3) + .5 * (1 - span(t, A.si, A.si + 1.6)) + .45 * sineIO(span(t, A.box - .2, A.box + 1.2)) * (1 - span(t, A.nextHead, A.nextHead + 1)) + .8 * span(t, A.nextHead, A.nextHead + 1.2) * (1 - span(t, A.mayNever, A.mayNever + 2)), cream: [.5 * smooth(span(t, A.something, A.something + 2)), 0] }, head2: 0,
    hall: 1, windows: lerp(.3, 1, span(t, A.channel, A.channel + 4)), ribbon: { u: 1 }, chair: { referee: 0 },
    you: onChair ? { x: S.CHAIR.x - 6, y: GY - S.CHAIR.h + 4, h: 70, o: { look: .5 } } : { o: { look: .9 - .3 * span(t, A.aboutUs, A.aboutUs + .8), armR: [lerp(.2, 2.5, raise), lerp(.1, 2.7, raise)], armL: [lerp(-.2, -2.5, raise), lerp(-.1, -2.7, raise)] } },
    land: (cx) => { B.yesWindows(cx, t, 1, 1 - span(t, A.channel, A.channel + 3)); lights(cx, t, span(t, A.channel, A.want + 2));
      if (!onChair) hands = { R: [S.YOU.x + 66 * .3 * Math.sin(lerp(.2, 2.5, raise)), GY - 66 * .9], L: [S.YOU.x - 66 * .3, GY - 66 * .9] }; },
  });
  // 10.04: the empty next headline (a blank, never a claim) and your two questions
  const nh = span(t, A.nextHead - .1, A.nextHead + 1.0);
  if (nh > 0) {
    const out = span(t, A.mayNever - .2, A.mayNever + 1.2);
    F.title(ctx, t, nh, { x: 600, y: 250, lines: [F.SOURCES.aiSolved], maxW: 720, out: out > 0 ? out : undefined, sub: 'THE NEXT HEADLINE?', subY: 300, subSize: 26 });
    const p = S.landPt(c, S.YOU.x, GY - 66 * .95);
    for (const [i, txt] of F.SOURCES.twoQ.entries()) {
      const u = cardsU[i]; if (u <= 0) continue;
      const w = 600, h = 118, x = i ? W / 2 + 40 : W / 2 - 40 - w, y = 400;
      if (p) F.goldSpan(ctx, [[p[0] + (i ? 24 : -24), p[1] - 30], [x + w / 2, y + h]], 0, smooth(clamp(u * 1.4)), { w: 1.4, spark: false });
      F.paperCard(ctx, t, x, y, w, h, { u, rot: i ? .012 : -.012, lines: [[txt, 46, 0, true]] });
    }
  }
  // 10.05 the core sentence
  const c1 = span(t, A.mayNever - .05, A.mayNever + .8), c2 = span(t, A.whoGets - .05, A.whoGets + .8), cx0 = span(t, A.channel - .6, A.channel + .3);
  if (c1 > 0) F.goldText(ctx, [[F.SOURCES.core[0], 0]], 110, 230, 52, F.rise(c1 * (1 - cx0)), { serif: true, col: CREAM });
  if (c2 > 0) F.goldText(ctx, [[F.SOURCES.core[1], .9]], 110, 300, 52, F.rise(c2 * (1 - cx0)), { serif: true, glow: true });
  F.veil(ctx, .64 * (1 - sineIO(span(t, A.si - 1.0, A.si + .6))));
  bigBox(ctx, t, A);
  const bg = span(t, A.isHe - .3, A.isHe + 1.6) * (1 - span(t, A.nextHead - .4, A.nextHead + 1.5));
  F.checklist(ctx, t, T, { big: bg, dy: DY * sineIO(bg), lit: t > A.box && t < A.nextHead ? 3 : undefined });
}
// the end screen (S.endScreen's camera and world) + the warm lights of subscribe 2 that keep glowing
function endScreen(ctx, t, A, c) {
  S.landWorld(ctx, c, t, { head: { dim: .35 }, ribbon: { u: 1 }, chair: { referee: 0 }, you: { x: S.CHAIR.x - 6, y: GY - S.CHAIR.h + 4, h: 70, o: { look: .5 } }, windows: 1, hall: 1,
    land: (cx) => { B.yesWindows(cx, t, 1, 0); lights(cx, t, 1); } });
  F.checklist(ctx, t, A.T);
}
