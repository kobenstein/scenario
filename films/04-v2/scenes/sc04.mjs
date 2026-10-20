// Chunk C04 · Film 4 minute 1 · 01b "AI won't end work. … what a human life is for." · shots 4.01–4.04 · ★ 4.04 (the pop-up dawn)
// Builder C04; minute repair m1-c04 (Jakob's comment 4 at 1:12, one continuous animation, no blends). Every accent is anchored to a VO
// word (T.S / T.W); the incoming bridge comes from lib/m1x_bridge.mjs, the outgoing handoff plate from lib/handoff4.mjs.
//
// ONE SHOT: one world (plate I, plate II, the crowd, the pop-up book) and one camera that travels through it. Every former shot change is
// a camera move or something the paper itself does; nothing fades, slides or is laid over another picture.
// | time / word                  | picture                                                              | how it continues                    |
// |------------------------------|----------------------------------------------------------------------|-------------------------------------|
// | 57.10–57.25 (c03 cut 57.10)  | b34: the cream light of your window fills the frame (the bridge)      | c03 draws the same picture to 57.10 |
// | 57.25 "AI" → 58.6            | the light condenses into the eye of plate I's ornament (the lozenge), | camera pull-back k 3 → 1.3 and the  |
// |                              | the camera pulls back out of it: the engraved plate around the light | light's radius shrink, both eased   |
// | "end" / "work"               | THE END OF … WORK pressed into plate I                               |                                     |
// | "It will" (59.4–60.8)        | plate II is lifted off plate I as an identical print (its shadow     | slower, eased peel (no whip)        |
// |                              | grows as it lifts), then its number gets its second I                |                                     |
// | "having to work"             | the burin cuts the rule away, HAVING TO is punched, light through it |                                     |
// | "alike" / "not"              | the plates slide together, then split apart in depth                 | camera moves 1–1.5 s, eased         |
// | "One of them scares …"       | camera follows plate I down-left into cold light; the crowd rises in | crowd comes up from below the frame |
// |                              | from below the frame                                                 |                                     |
// | 66.06 → 67.76 "The other"    | pan right to plate II (warm), a slight lean back mid-move            | smoothstep pan, 1.7 s               |
// | "could change" (67.42–68.22) | plate II is the cover of a pop-up book: the light points gather into | camera tilts down onto the opening  |
// |                              | the sun, the cover falls open toward us, the landscape stands up     | floor page (1.5 s)                  |
// | "human life" … "for"         | people doing what matters: painter, teacher + child, the GARDENER    |                                     |
// |                              | watering seedlings (can + shower of water), boat builder             |                                     |
// | 69.50 → 71.10                | push into the rising sun until its disc fills the frame: it is the   | log zoom about the sun, landing at  |
// |                              | handoff plate c04>c05 (light, dawn) exactly; at rest from 71.10      | rest; plate drawn from 71.10        |
import { W, H, rgba, clamp, lin, mix, eout, eio, sm, sine, drift } from '../engine.mjs';
import { bridgeWin, R_FULL, B34, b34 } from '../lib/m1x_bridge.mjs';
import { condense } from '../lib/m1x_c04_light.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { plateBG, warmPlateBG, ready } from '../lib/m1x_c04_img.mjs';
import { plate, plateShadow, crowd, warmPlates } from '../lib/sc04_m1plate.mjs';
import { popup, bookTimes, sunAt, warmPopup } from '../lib/sc04_m1popup.mjs';
import { R_END, plateCentre } from '../lib/m1x_c04_sun.mjs';

const LOZ = [0, -6];   // the eye of plate I's ornament rule (plate units): c03's window light condenses into it
function vignette(ctx, a, col = '#05040c') {   // = lib/sc02_kit.mjs vignette (copied: no dependency on another chunk's kit)
  if (a <= 0) return;
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

export default async (T, R) => {
  warmPlates(); warmPopup(); warmPlateBG(); await ready();
  const B = bridgeWin('c03>c04', T), HO = handsOf('c04', T).out;
  const wd = (phrase, k = 0) => { const ws = T.W('01b', phrase, phrase); return ws[k < 0 ? ws.length + k : k]; };
  const K = {
    ai: R.first, end1: wd("won't end work", 1).s, work1: wd("won't end work", 2).s, workE1: wd("won't end work", 2).e,
    it: T.S('01b', 'It will'), having: wd('having to work', 0).s, to: wd('having to work', 1).s, work2: wd('having to work', 2).s,
    those: T.S('01b', 'Those sound'), alike: wd('sound alike', 1).s, alikeE: wd('sound alike', 1).e, theyre: T.S('01b', "They're not"), not: wd("They're not", 1).s, notE: wd("They're not", 1).e,
    one: T.S('01b', 'One of them'), scares: wd('them scares', 1).s, everyoneE: T.E('01b', 'almost everyone'),
    other: T.S('01b', 'The other'), change: wd('could change', 1).s, human: wd('a human life', 1).s, life: wd('a human life', 2).s, for: wd('is for', 1).s, forE: wd('is for', 1).e,
  };
  K.pull1 = B.b + 1.5;                           // the pull-back out of the light lands on plate I
  K.lit1 = B.b + 1.8;                            // the light has condensed into the lozenge (radius → 0)
  K.pushA = K.for + .36; K.pushB = HO.a - .05;   // the push into the sun; at rest in the handoff plate from pushB
  K.end = K.pushB;                               // (was T.duration)
  const KB = bookTimes({ change: K.change, human: K.human, for: K.for, end: K.pushB });
  const PAN = (t) => sm(lin(K.other - .6, K.other + 1.1, t));   // 4.03 → 4.04: the pan to plate II

  // ---------------------------------------------------------------- the two plates in world units (plate units at s = 1)
  const P1 = (t) => {
    const u1 = sm(lin(K.it - .2, K.it + 1.2, t)), u2 = eio(lin(K.those, K.alikeE, t)), u3 = eio(lin(K.not - .08, K.not + .75, t)), u4 = eio(lin(K.one, K.one + 1.3, t));
    let x = mix(0, -560, u1), y = mix(-10, 10, u1); x = mix(x, 0, u2); y = mix(y, 0, u2); x = mix(x, -600, u3); y = mix(y, 40, u3);
    const shiver = t > K.scares ? Math.max(0, Math.sin((t - K.scares) * 9) * Math.exp(-(t - K.scares) * 2)) : 0;
    return { x, y, s: mix(1, .7, u3), rot: -.05 * u4 + .004 * Math.sin(t * .6), sy: mix(1, .84, u4), lift: .2 + .3 * u3 * (1 - u4), cold: u4 * (1 - .25 * shiver) };
  };
  const P2 = (t) => {
    const u1 = sm(lin(K.it - .2, K.it + 1.2, t)), u2 = eio(lin(K.those, K.alikeE, t)), u3 = eio(lin(K.not - .08, K.not + .75, t));
    let x = mix(0, 560, u1), y = -10; x = mix(x, 0, u2); y = mix(y, 0, u2); x = mix(x, 430, u3); y = mix(y, -30, u3);
    const lift = Math.sin(Math.PI * u1) * .9 + .25 + Math.sin(Math.PI * u2) * .6 + .4 * u3;
    const u4 = eio(lin(K.one - .1, K.one + 1.4, t)); x += 260 * u4 * (1 - PAN(t));
    // until the print has left plate I it wobbles with it (identical pose: plate II is born invisible, exactly on top of plate I)
    const sep = sm(lin(K.it - .2, K.it + .5, t));
    return { x, y: y - 14 * Math.sin(Math.PI * u1), s: 1, rot: mix(.004 * Math.sin(t * .6), .003 * Math.sin(t * .5 + 1), sep) + .02 * Math.sin(Math.PI * u1) - .012 * Math.sin(Math.PI * u2),
      lift: clamp(lift), sh: sm(lin(K.it - .2, K.it + .3, t)) };
  };
  const onPlate = (p, [px, py]) => { const c = Math.cos(p.rot), s = Math.sin(p.rot), vx = px * p.s, vy = py * p.s * (p.sy ?? 1); return [p.x + c * vx - s * vy, p.y + s * vx + c * vy]; };
  const L0 = onPlate(P1(B.b), LOZ);   // where the camera starts: centred on the lozenge
  const sunW = (t, p2 = P2(t)) => { const S = sunAt(t, KB), [x, y] = onPlate(p2, [S.x, S.y]); return { S, x, y }; };

  // ---------------------------------------------------------------- the camera (world → screen: (W/2, H/2) + k · (p − (x, y)))
  const cam0 = (t) => {
    const e0 = sine(lin(B.b, K.pull1, t));
    let x = mix(L0[0], 0, e0), y = mix(L0[1], 0, e0), k = Math.exp(mix(Math.log(3), Math.log(1.3), e0)) * (1 + .046 * sm(lin(K.pull1, K.it, t)));
    const u1 = sm(lin(K.it - .2, K.it + 1.3, t)), u2 = eio(lin(K.those, K.alikeE + .1, t)), u3 = eio(lin(K.not - .08, K.not + .8, t));
    const u4 = eio(lin(K.one - .1, K.one + 1.4, t)), u6 = PAN(t);
    k = mix(k, .78, u1); k = mix(k, .92, u2); k = mix(k, .82, u3); x = mix(x, -10, u3);
    k = mix(k, 1.2, u4) + .07 * sm(lin(K.one + 1.4, K.other, t)); x = mix(x, -640, u4); y = mix(y, 165, u4);
    k = mix(k, 1.22, u6); x = mix(x, 430, u6); y = mix(y, -10, u6);
    k *= 1 - .04 * Math.sin(Math.PI * u6);   // a slight lean back mid-pan
    // the book opens toward us: the camera tilts down onto the floor page and comes a little closer (the people)
    const u7 = sine(lin(KB.fold0 + .1, KB.fold0 + 1.6, t)); k = mix(k, 1.6, u7); x = mix(x, 480, u7); y = mix(y, 170, u7);
    const dr = sm(lin(B.b, B.b + 1, t));   // the hand-held drift fades in out of the bridge
    return { x: x + drift(t, 6, 3) * dr, y: y + drift(t, 4, 5) * dr, k };
  };
  const toScreen = (c, x, y) => [W / 2 + (x - c.x) * c.k, H / 2 + (y - c.y) * c.k];
  const cam = (t) => {
    const c = cam0(t); if (t <= K.pushA) return c;
    // the push: a log zoom about the sun while the sun glides to the handoff plate's centre; its disc grows to R_END (the frame)
    const u = lin(K.pushA, K.pushB, t), eK = Math.pow(sm(u), 1.6), eP = sm(u);
    const { S, x: wx, y: wy } = sunW(t), k1 = R_END / S.r, s0 = toScreen(c, wx, wy), pc = plateCentre(t);
    const k = Math.exp(mix(Math.log(c.k), Math.log(k1), eK)), sx = mix(s0[0], pc[0], eP), sy = mix(s0[1], pc[1], eP);
    return { x: wx - (sx - W / 2) / k, y: wy - (sy - H / 2) / k, k };
  };
  // c03's window light: R_FULL at the frame centre at B.b (= b34), condensing into the lozenge; its opaque core softens into a glow
  const lightR = (t) => { const e = sine(lin(B.b, K.lit1, t)); return e <= 0 ? R_FULL : Math.exp(mix(Math.log(R_FULL), Math.log(.4), e)); };
  const lightSoft = (t) => sine(lin(B.b, B.b + .45, t));

  const draw = (ctx, t) => {
    if (t < B.b) { b34(ctx, t); return; }               // the bridge picture (c03 cuts to it at B.cut)
    if (t >= K.pushB) { HO.plate(ctx, t); return; }      // at rest in the handoff plate (film.mjs draws the same from HO.a)
    const c = cam(t), p1 = P1(t), p2 = P2(t), u4 = eio(lin(K.one - .1, K.one + 1.4, t)), u6 = PAN(t), push = sm(lin(K.pushA, K.pushB, t));
    plateBG(ctx, t, { warm: Math.min(1.2, mix(1, .25, u4) + .9 * u6), cool: u4 * (1 - u6), dx: -c.x * .06, dy: -c.y * .06 });
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(c.k, c.k); ctx.translate(-c.x, -c.y);

    // cold wash behind plate I (4.03): the light that scares
    if (u4 > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(p1.x, p1.y - 60, 0, p1.x, p1.y - 60, 900); g.addColorStop(0, rgba('#7f9fd8', .22 * u4)); g.addColorStop(1, rgba('#7f9fd8', 0)); ctx.fillStyle = g; ctx.fillRect(p1.x - 900, p1.y - 960, 1800, 1800); ctx.restore(); }

    // ---- plate I
    const ink = (t0) => eout(lin(t0 - .06, t0 + .28, t));
    const ink1 = [ink(K.end1 - .12), ink(K.end1), ink(K.end1 + .14), ink(K.work1)];
    const cut = lin(K.having - .05, K.work2 + .1, t);
    const dim = sm(lin(K.alike - .1, K.alikeE, t)) * (1 - sm(lin(K.not, K.not + .35, t))), glow = (cut > 0 ? 1 : 0) * (1 - .82 * dim);
    ctx.save(); ctx.translate(p1.x, p1.y); ctx.rotate(p1.rot); ctx.scale(p1.s, p1.s * p1.sy);
    plateShadow(ctx, p1.lift, 1); plate(ctx, t, { kind: 1, ink: ink1, cold: p1.cold });
    ctx.restore();
    // ---- plate II: a print lifted off plate I, numbered, cut and punched; in 4.04 the cover of the pop-up book
    if (t > K.it - .2) {
      const warm2 = sm(lin(K.other - .3, K.change, t)), g2 = Math.min(1.25, glow + .4 * warm2);
      const W2 = sunW(t, p2), sc = toScreen(c, W2.x, W2.y);
      const sun = { x: sc[0], y: sc[1], r: W2.S.r * c.k, R: W2.S.halo * c.k, m: sm(lin(K.pushA + .4, K.pushB, t)) };
      ctx.save(); ctx.translate(p2.x, p2.y); ctx.rotate(p2.rot); ctx.scale(p2.s, p2.s);
      plateShadow(ctx, p2.lift, p2.sh);
      popup(ctx, t, KB, { cover: { kind: 2, ink: [1, 1, 1, 1], cut, glow: t < KB.gather ? g2 : 0, warm: warm2 * .8, num2: lin(K.it + .35, K.it + .6, t) }, glow: g2, sun });
      ctx.restore();
    }
    // ---- the crowd below plate I (4.03), seen from behind, rising into frame from below as the camera comes down
    const cu = eout(lin(K.one - .3, K.one + 1.1, t));
    if (cu > 0 && u6 < 1) crowd(ctx, t, { x: p1.x + 40, y: 300 + 820 * (1 - cu), w: 1500, hunch: sm(lin(K.scares, K.scares + .5, t)) * (1 - .4 * sm(lin(K.everyoneE, K.everyoneE + 1, t))), light: p1.cold });
    ctx.restore();

    // screen-space light: the warm spill of the dawn in 4.04 (gone as the camera enters the sun)
    if (t > K.other && push < 1) {
      const [sx, sy] = toScreen(c, p2.x + 70, p2.y + 60), a = sm(lin(K.change, K.for, t)) * (1 - push);
      if (a > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 1300); g.addColorStop(0, rgba('#ffb35c', .07 * a)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    }
    // 4.03: plate II waits off the right edge, its warm light leaking in (the carrier of the pan)
    if (u4 > 0 && u6 < 1) { const [sx, sy] = toScreen(c, p2.x, p2.y); const a = u4 * (1 - u6) * (.6 + .4 * sm(lin(K.everyoneE - .5, K.other, t)));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 900); g.addColorStop(0, rgba('#ffb35c', .3 * a)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    vignette(ctx, mix(.45, .3, sm(lin(K.change, K.for, t))) * (1 - push));
    // c03's window light condensing into the lozenge of plate I (on top: at B.b it covers the frame and is exactly b34)
    if (t < K.lit1) { const [lx, ly] = toScreen(c, ...onPlate(p1, LOZ)); condense(ctx, t, lx, ly, lightR(t), { ...B34, soft: lightSoft(t) }); }
  };

  return [
    { t: B.cut, tr: 'cut', d: .04, draw, print: { riso: .3 },
      sound: [
        { f: 'bloom', t: B.b - .05, v: .2 },
        { f: 'stamp', t: K.work1 + .02, v: .16 },
        { f: 'card', t: K.it - .2, v: .22 },
        { f: 'stamp', t: K.it + .38, v: .09 },
        { f: 'foil_glint', t: K.having + .05, v: .18 },
        { f: 'whoosh_airy', t: K.those - .15, v: .14 },
        { f: 'card', t: K.alikeE + .02, v: .2 },
        { f: 'whoosh', t: K.not - .12, v: .18 },
        { f: 'boom_soft', t: K.one - .25, v: .18 },
        { f: 'swell', t: K.other - .6, v: .22 },
        { f: 'pages', t: K.change + .15, v: .2 },
        { f: 'chime', t: K.forE + .05, v: .18 },
      ] },
    // the last moments are the sun's light: the print turns into the handoff plate's (riso .3 → .2 moves the red plate by one px)
    { t: K.pushB - .25, tr: 'cut', d: .04, draw, print: HO.print },
  ];
};
