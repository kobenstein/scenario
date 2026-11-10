// Film 25 · builder B1 · the c02 → c03 cut on action (2.15 → 3.01, a W shot): the ANIMATION header slab of the studio stands up
// (rotating about its bottom-right corner, which becomes the bottom-left corner of the standing slab) and leans left like a domino.
// At the cut ('Number nine') the rank stone No. 9 takes over in the same screen place, at the same lean, falling on with gravity.
// Both chunks import this, so the two sides of the cut are computed from one source.
import * as E from './f10_editorial.mjs';
import * as F from './f25_kit.mjs';
import * as B from './f25_b1_lib.mjs';
const { span, sineIO } = E;

export function headerCut(T) {
  const next = T.G('But the next domino'), tc = T.G('Number nine', 0, next);
  const t0 = next + 1.1, s0 = 1.85;
  const hd = F.STUDIO.head, lh = F.STUDIO.lanes.lh, pivot = [hd.x1, F.laneTop(2) + lh];
  const base = (t) => E.aim(E.F0, 1060, 600, s0 * (1 + .03 * (t - t0)));
  const cam = (t) => base(t);
  const tL = next + 1.75;
  const stand = (t) => { const u = span(t, next + .35, next + 1.5); return sineIO(u) + .04 * Math.sin(Math.PI * span(t, next + 1.3, next + 1.75)); };
  const lean = (t) => B.leanAngle(t, tL, tc);
  // where the pivot and the standing slab are on screen at the cut (the studio camera has camDrift(…, .6, 7))
  const cc = E.camDrift(cam(tc), tc, .6, 7), p = E.project(cc, E.F0, pivot[0], pivot[1]);
  const slabH = (hd.x1 - hd.x0) * p[2];
  return { t0, cam0: cam(t0), cam, stand, lean, pivot, tc, tL, screen: [p[0], p[1]], slabH };
}

// the c03 → c04 boundary (one continuous take): the camera arrives on No. 7 at 'Number seven' and c04 dives from there into the
// light of its image glyph. Both chunks draw No. 7 with these glyphs and this fall.
const F7 = B.field(7);
export const n7 = (T) => T.G('Number seven', 0, T.G('Surely the creative'));
export const n7Cam = () => B.fieldCam(F7, 70, -255, .9);
// a slow push (5 %/s) through the boundary, so the take never stops on No. 7: c03 blends into it, c04 starts on it
export const n7Creep = (t, T) => B.fieldCam(F7, 70, -255, .9 * (1 + .05 * (t - n7(T))));
export const n7Fall = (t, T) => B.fallAngle(t, n7(T) + .12);
export const N7_GLYPHS = [['image', .8], ['music', .56], ['cut', .32]];
export const n7GlyphPt = (ang, k) => B.facePt(ang, B.STONE_W / 2, -B.STONE_H * N7_GLYPHS[k][1]);
export function no7Face(ctx, t, T, ang) {
  const s0 = T.G('Surely the creative');
  B.faceGlyphs(ctx, t, ang, N7_GLYPHS.map(([g, al], k) => [g, al, E.smooth(span(t, s0 + .2 + k * .35, s0 + .6 + k * .35)), undefined, 1]), { size: 76 });
  // the image glyph breathes (it is the light door into the studio): a slow warm pulse once it is lit
  const lit0 = E.smooth(span(t, s0 + .2, s0 + .6)), q = n7GlyphPt(ang, 0);
  if (lit0 > 0) E.halo(ctx, q[0], q[1], 150, (.18 + .14 * Math.sin((t - s0) * 2.6)) * lit0, E.P.halo1, E.P.core0);
}
