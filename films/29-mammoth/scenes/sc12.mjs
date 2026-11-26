// c12 · B3 · 'Now take an American animal' → 'Now scale that up'
// 3.01 out of plateIce the ice frosts over and a door draws itself into it: a freezer · Willa (1980s) walks in behind the block, her cells
//      fly into the door · 3.02★ decades later the door opens (a vial of living cells): the clone walks out, then her kits, then theirs:
//      each walks out of its parent along a gold line on the snow (a family tree) · 3.03 GRANDCHILDREN · 3.04 NO LIST. NO GUESSWORK. the
//      freezer door, opened in time. One continuous take with c13–c16 (lib/f29_b3_core.mjs).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f29_kit.mjs';
import * as B from '../lib/f29_b3_core.mjs';
const { rgba, span, sineIO, lerp, halo, clamp } = E;
const { GOLD } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T), K = B.keys(a);
  return [{ t: R.a, draw: scene(a, K), print: F.PRINT29 }];
};

function scene(a, K) {
  return (ctx, t) => {
    const hook = {
      back: (cx, c) => {   // Willa's cells: a few gold motes arc from her into the door
        if (t < a.froze || t > a.froze + 1.8) return;
        const w = B.FAM.willa, p0 = c && B.at2(c, w.x1 + 20, 30, w.z), p1 = c && B.at2(c, B.BLOCK.x + 40, 150, B.BLOCK.z - 2); if (!p0 || !p1) return;
        cx.save(); cx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 6; i++) {
          const u = sineIO(span(t, a.froze + .1 + i * .07, a.froze + 1.2 + i * .07)); if (u <= 0 || u >= 1) continue;
          const x = lerp(p0[0], p1[0], u) + 8 * Math.sin(i * 2.1 + t), y = lerp(p0[1], p1[1], u) - 70 * Math.sin(Math.PI * u) * (.7 + .1 * i);
          halo(cx, x, y, 16, .5 * Math.sin(Math.PI * u), GOLD.halo, GOLD.core); cx.fillStyle = rgba(GOLD.core, .9); cx.fillRect(x - 1.8, y - 1.8, 3.6, 3.6);
        }
        cx.restore();
      },
    };
    const { c } = B.world(ctx, t, a, K, hook);
    if (!c) return;
    // WILLA · 1980s (pinned to her while she stands)
    const w = B.FAM.willa, pw = B.at2(c, w.x1 + 10, 40, w.z);
    const lu = span(t, a.ferretW - .1, a.ferretW + .9) * (1 - span(t, a.decades - .9, a.decades - .3));
    if (pw && lu > 0) F.label(ctx, pw[0], pw[1] - 10, "WILLA", "1980s", lu, { dx: -60, dy: -100, size: 30, col: F.FROST });
    F.source(ctx, t, a.willa + .2, a.own, F.SOURCES.willa, { y: 870 });
    // GRANDCHILDREN · NO LIST. NO GUESSWORK.
    B.line(ctx, t, 'GRANDCHILDREN', 110, 220, a.grand - .05, a.noList - .25, { size: 84 });
    B.line(ctx, t, 'NO LIST.', 110, 200, a.noList, a.scale - .1, { size: 70 });
    B.line(ctx, t, 'NO GUESSWORK.', 110, 282, a.guess, a.scale - .1, { size: 70 });
  };
}
