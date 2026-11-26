// c14 · B3 · 'Even the mammoth depends' → 'So here is what the evidence'
// 3.09 the camera turns to the field station: the elephant mother and two calves come out from behind the hut into the window light:
//      ASIAN ELEPHANT · ENDANGERED · 3.10 a virus (cream, never red) draws itself beside a calf: LEADING KILLER OF ZOO CALVES ·
//      3.11 a drop of the lab's light leaves the window and splits onto both calves; the virus reaches them and breaks; the calves stay lit ·
//      3.12 A FIRST SIGN, NOT PROOF; the mother walks the calves away from the hut · 3.13 high and wide: the snow lights gold to the horizon,
//      one glint per species: ~50,000 THREATENED SPECIES.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f29_kit.mjs';
import * as S from '../lib/f29_seams.mjs';
import * as B from '../lib/f29_b3_core.mjs';
const { rgba, span, sineIO, lerp, halo, clamp, expoIn } = E;
const { rise, GOLD, LAMP, bump } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T), K = B.keys(a);
  return [{ t: R.a, draw: scene(a, K), print: F.PRINT29 }];
};

function scene(a, K) {
  return (ctx, t) => {
    const pos = [];
    const { c } = B.world(ctx, t, a, K, { ele: (cx, e, p) => { pos[e.k] = { x: p[0], y: p[1], h: e.h * p[2] }; } });
    if (!c || t < a.depends) return;
    const [m, c1, c2] = pos;
    // ASIAN ELEPHANT · ENDANGERED (pinned over the mother's back)
    const lu = span(t, a.asian, a.asian + 1.1) * (1 - span(t, a.zoos - .7, a.zoos - .1));
    if (m && lu > 0) F.label(ctx, m.x - m.h * .05, m.y - m.h * 1.18, 'ASIAN ELEPHANT', t > a.endangered - .1 ? 'ENDANGERED' : null, lu, { dx: 70, dy: -80, size: 30 });
    // the virus: draws itself beside the first calf, reaches both on "caught", breaks on "came through"
    const vIn = span(t, a.calves - .3, a.calves + 1.0), reach = sineIO(span(t, a.caught - .2, a.caught + .9)), brk = span(t, a.through, a.through + 1.0);
    if (c1 && c2 && vIn > 0 && brk < 1) {
      const vs = [[c1, 0], [c2, .25]];
      for (const [q, dl] of vs) {
        const u = q === c1 ? vIn : span(t, a.virus + .6, a.virus + 1.6); if (u <= 0) continue;
        const hx = q.x + q.h * .95, hy = q.y - q.h * 1.55, tx = q.x + q.h * .35, ty = q.y - q.h * .75;
        const x = lerp(hx, tx, reach) + 5 * Math.sin(t * .9 + dl * 9), y = lerp(hy, ty, reach) + 4 * Math.sin(t * 1.1 + dl * 7);
        const r = Math.max(6, q.h * .16) * (1 - .5 * reach);
        B.virus(ctx, t, x, y + 30 * brk * brk, r, u * (1 - brk), { a: 1 - brk });
      }
    }
    const ku = span(t, a.killer, a.killer + 1.0) * (1 - span(t, a.summer - .6, a.summer));
    if (c1 && ku > 0) F.label(ctx, c1.x + c1.h * 1.25, c1.y - c1.h * 1.75, 'LEADING KILLER OF ZOO CALVES', null, ku, { dx: 40, dy: -190, size: 28 });
    // the vaccine: a drop of the lab's light from the window, splitting onto both calves
    const win = S.winRect(c);
    if (win && c1 && c2 && t > a.vaccine - .2 && t < a.two + 1.5) {
      const w0 = [win.x + win.w / 2, win.y + win.h * .6];
      for (const [q, k] of [[c1, 0], [c2, 1]]) {
        const u = sineIO(span(t, a.vaccine - .1 + k * .15, a.vaccine + 1.5 + k * .15)), arrive = bump(t, a.vaccine + 1.5 + k * .15, 1.4);
        const tx = q.x + q.h * .1, ty = q.y - q.h * .8;
        if (u > 0 && u < 1) { const x = lerp(w0[0], tx, u), y = lerp(w0[1], ty, u) - 90 * Math.sin(Math.PI * u); halo(ctx, x, y, 22, .7, LAMP.halo, LAMP.core); ctx.fillStyle = rgba(LAMP.core, .95); ctx.beginPath(); ctx.arc(x, y, 3.6, 0, 7); ctx.fill(); }
        if (arrive > 0) { ctx.save(); ctx.strokeStyle = rgba(LAMP.core, .55 * arrive); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(tx, ty, q.h * (.5 + .5 * (1 - arrive)), q.h * (.4 + .4 * (1 - arrive)), 0, 0, 7); ctx.stroke(); ctx.restore(); }
      }
    }
    F.source(ctx, t, a.summer + .3, a.sign + 1.2, F.SOURCES.vaccine, { y: 870 });
    // A FIRST SIGN, NOT PROOF (a calm bracket over the two calves)
    if (c1 && c2) {
      const bu = span(t, a.firstSign - .2, a.firstSign + .8) * (1 - span(t, a.road + .6, a.road + 1.2));
      const x0 = Math.min(c1.x, c2.x) - c2.h * .9, x1 = Math.max(c1.x, c2.x) + c1.h * 1.0, by = Math.min(c1.y - c1.h * 1.45, c2.y - c2.h * 1.45);
      if (bu > 0) F.bracket(ctx, x0, x1, by, bu, 'A FIRST SIGN, NOT PROOF', { size: 28 });
    }
    // ~50,000 THREATENED SPECIES
    const tU = rise(span(t, a.redList - .3, a.redList + .4)) * (1 - expoIn(span(t, a.threat + 1.0, a.evidence - .1)));
    if (tU > 0) F.tally(ctx, t, { v: 50000, from: 2300, pre: '~', u: span(t, a.redList, a.fifty + .9), label: 'THREATENED SPECIES', rise: tU });
    F.source(ctx, t, a.redList + .4, a.evidence - .1, F.SOURCES.redList, { y: 870 });
  };
}
