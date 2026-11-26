// c16 · B3 · 'So stand at that fence once more' → end (incl. the quiet walk and the 15 s end screen)
// 6.01 the camera glides back over the fence to the picture of frame 0: you and the child from behind, the poster on the horizon, and
//      behind the fence the elephant in a mammoth's coat (the mother from c14/c15) arrives, turns to you and lifts its head; the small hand
//      rises into yours · 6.02 the gate in the fence: 1 · VOTE (IUCN, OCT 2025), WHO DECIDES? · 6.03 the child grows up beside you; the
//      elephants, the ferrets, the bird and thousands of glints light (still alive) · 6.04 THE POSTER (the gold mammoth) · THE ARK (Willa's
//      door) · A.01 subscribe 2: the picture runs on, one quiet line · A.02 the walk: you and the grown child walk along the fence while the
//      poster's light goes out · E.01 END SCREEN (S.END_CAM, S.END_TILES free): no text, the picture breathes.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f29_kit.mjs';
import * as S from '../lib/f29_seams.mjs';
import * as B from '../lib/f29_b3_core.mjs';
const { P, span, expoIn } = E;
const { rise, maskLine, GOLD } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T), K = B.keys(a);
  return [{ t: R.a, draw: scene(a, K), print: F.PRINT29 }];
};

function scene(a, K) {
  return (ctx, t) => {
    const { c } = B.world(ctx, t, a, K);
    if (!c) return;
    // 6.02 1 · VOTE, the source, WHO DECIDES?
    const vU = rise(span(t, a.single - .1, a.single + .6)) * (1 - expoIn(span(t, a.whatever - .2, a.whatever + .4)));
    if (vU > 0) F.tally(ctx, t, { v: 1, label: 'VOTE', rise: vU });
    F.source(ctx, t, a.pause, a.whatever + .3, F.SOURCES.vote, { x: 1810, align: 'right', y: 870 });
    B.line(ctx, t, 'WHO DECIDES?', 110, 420, a.who - .05, a.prize, { size: 92 });
    // 6.04 THE POSTER · THE ARK (pinned to the gold mammoth and to Willa's door)
    const pp = S.proj(c, S.WORLD.poster.x - 2600, S.WORLD.poster.h * .9, S.WORLD.poster.z), pb = S.proj(c, B.BLOCK.x - 150, B.BLOCK.h * .95, B.BLOCK.z);
    const out = span(t, a.films + .6, a.films + 1.3);
    if (pp) F.label(ctx, pp[0], pp[1], 'THE POSTER', null, span(t, a.isPoster + .1, a.isPoster + 1.1) * (1 - out), { dx: -90, dy: -60, size: 32 });
    if (pb) F.label(ctx, pb[0], pb[1], 'THE ARK', null, span(t, a.ark + .1, a.ark + 1.1) * (1 - out), { dx: -170, dy: -50, size: 32, col: F.FROST });
    // A.01 subscribe 2: one quiet line (as subscribe 1)
    const sU = rise(span(t, a.films + 1.4, a.films + 2.2)) * (1 - expoIn(span(t, a.vend + .4, a.vend + 1.2)));
    if (sU > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [['SUBSCRIBE · THE GOOD TAKEOFF', 0]], 700, 250, 30, sU, { serif: false, weight: 600, align: 'center', col: P.core0, glow: false }); ctx.restore(); }
  };
}
