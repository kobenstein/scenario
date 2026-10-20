// Chunk C04 · Film 4 minute 1 · 01b → film end (72.5) · shots 4.01–4.04 · ★ 4.04 (the pop-up dawn)
// Builder C04. Every accent is anchored to a VO word (T.S / T.W); the chunk range comes from R. Model: Film 5's "PROMISE" cards (sc02 0.05).
//
// PLAN (MOTION.md gate 1) — hero onset (word) · carrier into the next shot · transition · accent
// | shot | words                                         | hero onset                                                     | carrier → next                     | type      | acc |
// |------|-----------------------------------------------|----------------------------------------------------------------|------------------------------------|-----------|-----|
// | 4.01 | AI won't end work. It will end having to work.| c03's window light (iris) grows into plate I; THE END OF inks  | plate II peels off plate I         | (b) iris  | ▲   |
// |      |                                               | on "end", WORK pressed on "work"; on "It will" plate II peels  |                                    |           |     |
// |      |                                               | off it (a print); on "having to" the ornament rule is cut away |                                    |           |     |
// |      |                                               | by a burin and HAVING TO is punched in, light through the holes|                                    |           |     |
// | 4.02 | Those sound alike. They're not.               | the plates slide together and land exactly on "alike" (the     | plate I sinks back                 | (a) take  |     |
// |      |                                               | light dims: alike); on "not" they split apart in depth         |                                    |           |     |
// | 4.03 | One of them scares almost everyone.           | camera follows plate I down-left: it tilts back into cold blue;| plate II's warm light at the right | (a) take  |     |
// |      |                                               | below it a crowd seen from behind; cold flicker on "scares"    | edge → camera pans right           | (c) right |     |
// | 4.04 | The other could change what a human life is   | plate II warms; its paper becomes the dawn sky (from HAVING    | — (holds and drifts to 72.5)       |           | ★   |
// |      | for.                                          | TO's light), the pinholes gather into the sun; on "change" the |                                    |           |     |
// |      |                                               | floor page folds down and the paper landscape stands up, back  |                                    |           |     |
// |      |                                               | to front; on "human life" tiny flat figures paint, teach a     |                                    |           |     |
// |      |                                               | child, garden, build a boat; the sun clears the hills on "for" |                                    |           |     |
// One continuous world (both plates live in it, the camera travels): 4.01–4.04 are camera beats of one shot, so every boundary is carried
// by the plates themselves. Incoming: tr 'iris' at the screen centre (960, 540) = c03's lit window (the plate is born as that light).
import { W, H, rgba, clamp, lin, mix, eout, eio, ein, sm, drift, canvas } from '../engine.mjs';
import { plateBG, vignette } from '../lib/sc02_kit.mjs';
import { plate, plateShadow, crowd, glowSprite, PW, PH } from '../lib/sc04_m1plate.mjs';
import { popup } from '../lib/sc04_m1popup.mjs';

const quart = (x) => x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2;

export default (T, R) => {
  const wd = (phrase, k = 0) => { const ws = T.W('01b', phrase, phrase); return ws[k < 0 ? ws.length + k : k]; };
  const K = {
    ai: R.first, end1: wd("won't end work", 1).s, work1: wd("won't end work", 2).s, workE1: wd("won't end work", 2).e,
    it: T.S('01b', 'It will'), having: wd('having to work', 0).s, to: wd('having to work', 1).s, work2: wd('having to work', 2).s,
    those: T.S('01b', 'Those sound'), alike: wd('sound alike', 1).s, alikeE: wd('sound alike', 1).e, theyre: T.S('01b', "They're not"), not: wd("They're not", 1).s, notE: wd("They're not", 1).e,
    one: T.S('01b', 'One of them'), scares: wd('them scares', 1).s, everyoneE: T.E('01b', 'almost everyone'),
    other: T.S('01b', 'The other'), change: wd('could change', 1).s, human: wd('a human life', 1).s, life: wd('a human life', 2).s, for: wd('is for', 1).s, forE: wd('is for', 1).e,
    end: T.duration,
  };
  // ---------------------------------------------------------------- the two plates in world units (plate units at s = 1)
  const P1 = (t) => {
    const born = eout(lin(K.ai - .45, K.ai + .75, t)), u1 = eio(lin(K.it - .05, K.it + .9, t)), u2 = eio(lin(K.those, K.alikeE, t)), u3 = eio(lin(K.not - .08, K.not + .75, t)), u4 = eio(lin(K.one, K.one + 1.3, t));
    let x = mix(0, -560, u1), y = mix(-10, 10, u1); x = mix(x, 0, u2); y = mix(y, 0, u2); x = mix(x, -600, u3); y = mix(y, 40, u3);
    return { x, y, s: mix(.1, 1, born) * mix(1, .7, u3), rot: -.05 * u4 + .004 * Math.sin(t * .6), sy: mix(1, .84, u4), lift: .2 + .3 * u3 * (1 - u4), cold: u4 * (1 - .25 * Math.max(0, Math.sin((t - K.scares) * 9) * Math.exp(-(t - K.scares) * 2)) * (t > K.scares)), born };
  };
  const P2 = (t) => {
    const u1 = eio(lin(K.it - .05, K.it + .9, t)), u2 = eio(lin(K.those, K.alikeE, t)), u3 = eio(lin(K.not - .08, K.not + .75, t));
    let x = mix(0, 560, u1), y = mix(-10, -10, u1); x = mix(x, 0, u2); y = mix(y, 0, u2); x = mix(x, 430, u3); y = mix(y, -30, u3);
    const lift = Math.sin(Math.PI * u1) * .9 + .25 + Math.sin(Math.PI * u2) * .6 + .4 * u3;
    const u4 = eio(lin(K.one - .1, K.one + 1.4, t)), u6 = quart(lin(K.other - .12, K.other + .95, t)); x += 260 * u4 * (1 - u6);
    return { x, y: y - 14 * Math.sin(Math.PI * u1), s: 1, rot: .02 * Math.sin(Math.PI * u1) - .012 * Math.sin(Math.PI * u2) + .003 * Math.sin(t * .5 + 1), lift: clamp(lift) };
  };
  const cam = (t) => {
    let x = 0, y = 0, k = mix(1.28, 1.36, sm(lin(K.ai, K.it, t)));
    const u1 = eio(lin(K.it - .05, K.it + 1.0, t)), u2 = eio(lin(K.those, K.alikeE + .1, t)), u3 = eio(lin(K.not - .08, K.not + .8, t));
    const u4 = eio(lin(K.one - .1, K.one + 1.4, t)), u6 = quart(lin(K.other - .12, K.other + .95, t)), u7 = eio(lin(K.change - .2, K.end, t));
    k = mix(k, .78, u1); k = mix(k, .92, u2); k = mix(k, .82, u3); x = mix(x, -10, u3);
    k = mix(k, 1.2, u4) + .07 * sm(lin(K.one + 1.4, K.other, t)); x = mix(x, -640, u4); y = mix(y, 165, u4);
    k = mix(k, 1.22, u6); x = mix(x, 430, u6); y = mix(y, -10, u6);
    k = mix(k, 1.85, u7); y = mix(y, 145, u7);
    // the pan to plate II leans like a whip: a little extra pull-back mid-move
    k *= 1 - .1 * Math.sin(Math.PI * u6);
    return { x: x + drift(t, 6, 3), y: y + drift(t, 4, 5), k };
  };
  const toScreen = (c, x, y) => [960 + (x - c.x) * c.k, 540 + (y - c.y) * c.k];

  const draw = (ctx, t) => {
    const c = cam(t), p1 = P1(t), p2 = P2(t), u4 = eio(lin(K.one - .1, K.one + 1.4, t)), u6 = quart(lin(K.other - .12, K.other + .95, t));
    const warmBG = mix(1, .25, u4) + .9 * u6;
    plateBG(ctx, t, { warm: Math.min(1.2, warmBG), cool: u4 * (1 - u6), dx: -c.x * .06, dy: -c.y * .06 });
    // the window light the plate is born from (the iris carrier)
    const born = p1.born;
    ctx.save(); ctx.translate(960, 540); ctx.scale(c.k, c.k); ctx.translate(-c.x, -c.y);
    if (born < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const s = glowSprite('#ffb35c', 260); ctx.globalAlpha = 1 - born; ctx.drawImage(s, p1.x - 260 * (1 + born * 2), p1.y - 260 * (1 + born * 2), 520 * (1 + born * 2), 520 * (1 + born * 2)); ctx.restore(); }

    // cold wash behind plate I (4.03): the light that scares
    if (u4 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(p1.x, p1.y - 60, 0, p1.x, p1.y - 60, 900); g.addColorStop(0, rgba('#7f9fd8', .22 * u4)); g.addColorStop(1, rgba('#7f9fd8', 0)); ctx.fillStyle = g; ctx.fillRect(p1.x - 900, p1.y - 960, 1800, 1800); ctx.restore(); }

    // ---- plate I
    const ink = (t0) => eout(lin(t0 - .06, t0 + .28, t));
    const ink1 = [ink(K.end1 - .12), ink(K.end1), ink(K.end1 + .14), ink(K.work1)];
    const cut = lin(K.having - .05, K.work2 + .1, t);
    const dim = sm(lin(K.alike - .1, K.alikeE, t)) * (1 - sm(lin(K.not, K.not + .35, t))), glow = (cut > 0 ? 1 : 0) * (1 - .82 * dim);
    const drawP1 = () => {
      ctx.save(); ctx.translate(p1.x, p1.y); ctx.rotate(p1.rot); ctx.scale(p1.s, p1.s * p1.sy);
      plateShadow(ctx, p1.lift, p1.born); plate(ctx, t, { kind: 1, ink: ink1, cold: p1.cold });
      if (born < 1) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffcf8a', .9 * (1 - born) ** 1.5); ctx.fillRect(-PW / 2, -PH / 2, PW, PH); }
      ctx.restore();
    };
    // ---- plate II (a print lifted off plate I)
    const has2 = t > K.it - .05;
    const warm2 = sm(lin(K.other - .3, K.change, t));
    const drawP2 = () => {
      if (!has2) return;
      ctx.save(); ctx.translate(p2.x, p2.y); ctx.rotate(p2.rot); ctx.scale(p2.s, p2.s);
      plateShadow(ctx, p2.lift, 1);
      const reveal = lin(K.other + .55, K.change + .5, t);
      plate(ctx, t, { kind: 2, ink: [1, 1, 1, 1], cut, glow: Math.min(1.25, glow + .4 * warm2), warm: warm2 * .8, fade: sm(lin(K.other + .45, K.change + .1, t)), holesOff: t > K.other + .7 });
      if (t > K.other) popup(ctx, t, { reveal: K.other + .55, gather: K.other + .7, fold: K.change - .05, rise: K.change + .2, human: K.human - .1, sunUp: K.for - .4, end: K.end });
      ctx.restore();
    };
    // plate II lies on top until it splits back in depth; after "not" plate I is behind
    drawP1(); drawP2();

    // ---- the crowd below plate I (4.03), seen from behind, rising into frame as the camera comes down
    const cu = eout(lin(K.one - .3, K.one + 1.1, t));
    if (cu > 0 && u6 < 1) crowd(ctx, t, { x: p1.x + 40, y: 300 + 420 * (1 - cu), w: 1500, hunch: sm(lin(K.scares, K.scares + .5, t)) * (1 - .4 * sm(lin(K.everyoneE, K.everyoneE + 1, t))), light: p1.cold });
    ctx.restore();

    // screen-space light: the warm spill of the dawn in 4.04
    if (t > K.other) {
      const [sx, sy] = toScreen(c, p2.x + 70, p2.y + 60), a = sm(lin(K.change, K.for, t));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 1300); g.addColorStop(0, rgba('#ffb35c', .07 * a)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
    }
    // 4.03: plate II waits off the right edge, its warm light leaking in (the carrier into 4.04)
    if (u4 > 0 && u6 < 1) { const [sx, sy] = toScreen(c, p2.x, p2.y); const a = u4 * (1 - u6) * (.6 + .4 * sm(lin(K.everyoneE - .5, K.other, t)));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 900); g.addColorStop(0, rgba('#ffb35c', .3 * a)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    vignette(ctx, mix(.45, .3, sm(lin(K.change, K.for, t))));
  };

  return [
    { t: K.ai - .2, tr: 'iris', x: 960, y: 540, r: 40, d: .9, draw, print: { riso: .3 },
      sound: [
        { f: 'bloom', t: K.ai - .35, v: .22 },
        { f: 'stamp', t: K.work1 + .02, v: .16 },
        { f: 'card', t: K.it - .08, v: .22 },
        { f: 'foil_glint', t: K.having + .05, v: .18 },
        { f: 'whoosh_airy', t: K.those - .15, v: .14 },
        { f: 'card', t: K.alikeE + .02, v: .2 },
        { f: 'whoosh', t: K.not - .12, v: .18 },
        { f: 'boom_soft', t: K.one - .25, v: .18 },
        { f: 'swell', t: K.other - .3, v: .22 },
        { f: 'pages', t: K.change + .15, v: .2 },
        { f: 'chime', t: K.forE + .05, v: .18 },
      ] },
  ];
};
