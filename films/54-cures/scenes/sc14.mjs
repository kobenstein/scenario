// c14 · the ending: built for something else · the gallery · it was the aim · the tree in full light · subscribe 2 · 15 s end screen (B3).
// T.G('Satellites built to watch fields and forests', 2nd) → the end of the film.
// ONE entry, one continuous take on THE TREE: out of the flood of W 1.08 (from the crown's core), the rail's twelve lamps come down onto
// the lantern limb with their tools (the gallery), the camera walks the limb tag by tag, the thread and the ? return and the ? becomes the
// bead; one bead, two beams (cool → the laptop's email, warm → the crown); the bead goes into your raised phone, its warm beam lights the
// crown; the land's lights wake; the camera settles on the end-screen composition (tree in the left third, quiet sky right).
//
// | ID   | anchor                          | picture (one idea)                                                                     | camera                |
// |------|---------------------------------|----------------------------------------------------------------------------------------|-----------------------|
// | E.01 | Satellites built … (2nd)        | the rail's lamps land on the limb (the gallery); on each named tool its tag: satellite, radio, GPS, chatbot, newspaper | out of the core · truck along the limb |
// | E.02 | None of it was built for this   | the tags let go; a warm wave lights every tool 12 → 1                                   | pull back             |
// | E.03 | That's what these tools have    | the gold thread runs through all twelve; the ? returns and its dot becomes the bead     | breathe               |
// | E.04★| The difference between          | one bead, two beams: cool → the laptop's email · warm → the crown: NOT THE TOOL · THE AIM | settle               |
// | E.05 | The tool is already here        | you raise your phone, the bead goes into it; its warm beam reaches the crown: full gold | pull back to the thumbnail view |
// | E.06 | That's why this channel exists  | subscribe 2: the small lights of the land wake, left to right                           | glide to the end screen |
// | E.07 | END (15 s)                      | the tree in full light in the left third, the right two thirds a quiet sky; no text    | creep                 |
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as S from '../lib/f28_seams.mjs';
import * as B from '../lib/f28_b3_kit.mjs';
const { W, H, P, rgba, clamp, lerp, span, smooth, sineIO, expoOut, expoIn } = E;

export default async (T, R) => {
  E.prepareEditorial();
  const a = B.anchors(T);
  return [{ t: R.a, draw: scene(a, T, R), print: F.PRINT28 }];
};

const C = (u, v, s, sx, sy) => E.aim(E.F0, u, v, s, sx, sy);
const CORE = F.TREE.core;
const DU_DX = 150, DU = [F.TREE.du.x + DU_DX, F.TREE.du.y, F.TREE.du.h];          // you stand in front of the trunk (the tools hang where you stood)
const LAP = { x: 1300, y: 926, s: 72 };
const ENDCAM = C(1500, 500, .46, 520, 600);                                          // the end screen: the tree in the left third
const SCR = createCanvas(4, 4).getContext('2d');
const NAMED = [[8, 'sat'], [6, 'radio'], [5, 'gps'], [2, 'chatbot'], [1, 'oldnews']];
const TAGLEN = { 8: 16, 6: 16, 5: 16, 2: 16, 1: 16 };

function scene(a, T, R) {
  const t0 = a.sat, tq0 = a.sat + .6;                                               // the flood's peak · the rail starts to come down
  const NEXT = { sat: a.radio, radio: a.gps, gps: a.chatbot, chatbot: a.oldnews, oldnews: a.none };
  const BEAD = [B.G_1.x + 112, B.G_1.y - 84];
  // ---------------------------------------------------------------- camera
  const K = [
    [t0 + 1.6, C(980, 640, 1.3)], [t0 + 3.0, C(930, 770, 1.7)], [a.radio + .9, C(1110, 775, 1.72)], [a.gps + .9, C(1190, 778, 1.72)],
    [a.chatbot + .9, C(1420, 772, 1.66)], [a.oldnews + .9, C(1470, 780, 1.64)], [a.none + 1.2, C(1000, 690, 1.12)], [a.thats + 1.3, C(1080, 660, 1.16)],
    [a.diff + .6, C(1370, 600, 1.1)], [a.itwas + .8, C(1360, 596, 1.15)], [a.already + .6, C(1340, 610, 1.1)], [a.point + 1.0, C(960, 540, 1.0)],
    [a.channel + .8, C(960, 545, .98)], [a.endS, ENDCAM], [a.endS + 15, C(1500, 505, .475, 520, 600)],
  ];
  const camRaw = (t) => (t < t0 + 1.6 ? E.camAt(t, [[t0, C(CORE[0], CORE[1] + 40, 24)], [t0 + 1.6, K[0][1], 'o']]) : F.camPath(t, K));
  const cam = (t) => B.drifted(camRaw(t), E.F0, t, 2.6, 17);
  // ---------------------------------------------------------------- the rail comes down onto the limb (lampRail morph, per lamp)
  const mOf = (n) => (t) => 1 - sineIO(span(t, tq0 + (12 - n) * .07, tq0 + 1.1 + (12 - n) * .07));
  const landed = (n, t) => mOf(n)(t) <= 0;
  // ---------------------------------------------------------------- you, the phone (raised from "The tool is already here")
  const raise = (t) => sineIO(span(t, a.already + .1, a.already + 1.3));
  const duO = (t) => { const r = raise(t); return { look: lerp(.55, .85, r), armR: [lerp(.2, 2.55, r), lerp(.1, 2.7, r)], light: 1, back: .35 }; };
  const handAt = (t) => E.du(SCR, DU[0], DU[1], DU[2], { hood: true, ...duO(t) }).R;
  // ---------------------------------------------------------------- the bead: born from the ?'s dot, then into the phone
  const beadAt = (t) => { const h = handAt(t), u = sineIO(span(t, a.already + .5, a.already + 1.7)); return [lerp(BEAD[0], h[0], u) + 2.5 * Math.sin(t * 1.3) * (1 - u), lerp(BEAD[1], h[1] - 6, u) + 2 * Math.sin(t * 1.7) * (1 - u)]; };
  const glowAt = (t) => lerp(lerp(lerp(.55, .8, span(t, a.saving + .6, a.nevertool)), 1, smooth(span(t, a.point - .2, a.point + 1.2))), 1, 0);
  // ---------------------------------------------------------------- the gallery on the tree (tools, tags, the warm wave)
  function gallery(ctx, t) {
    for (let n = 12; n >= 1; n--) {
      if (!landed(n, t)) continue;
      const g = B.galleryTool(n), L = F.lamp(n), named = NAMED.find((x) => x[0] === n), ta = named ? a[named[1]] : null;
      const wave = smooth(span(t, a.none + .1 + (12 - n) * .09, a.none + .7 + (12 - n) * .09));
      const lit = Math.max(named ? .7 * span(t, ta + .1, ta + .6) : 0, wave);
      ctx.strokeStyle = rgba(F.INK.rim, .5); ctx.lineWidth = Math.max(1, g.q); ctx.beginPath(); ctx.moveTo(g.x, g.y0); ctx.lineTo(g.x, g.y1); ctx.stroke();
      F.tool(ctx, L.tool, g.x, g.y, g.s * (1 + .12 * F.bump(t, a.none + .1 + (12 - n) * .09, .8)), { lit: F.lampOn(T, n, t) > .4 ? Math.max(.6, lit) : lit });
      if (named) { const u = F.rise(span(t, ta + .25, ta + .95)) * (1 - expoIn(span(t, NEXT[named[1]] - .1, NEXT[named[1]] + .35))); if (u > 0) F.tag(ctx, t, g.x, g.y + g.s * .5, L.tag, u, { size: 15, len: TAGLEN[n] }); }
    }
  }
  // the laptop, the two beams, the bead
  function foot(ctx, t) {
    const em = span(t, a.writing + .6, a.writing + 1.2);
    const scr = F.laptop(ctx, t, LAP.x, LAP.y, LAP.s, { open: 1, glow: .3 + .5 * em * (1 - .6 * span(t, a.already, a.already + 1.5)) });
    if (em > 0) F.tool(ctx, 'email', scr.x + scr.w / 2, scr.y + scr.h / 2, 26 * expoOut(em), { col: 'cool', glow: .6 });
    const born = expoOut(span(t, a.diff - .5, a.diff + .3)); if (born <= 0) return;
    const [bx, by] = beadAt(t), h = handAt(t), inP = span(t, a.already + 1.4, a.already + 1.8);
    // cool: the bead → the laptop (writing your emails); it lets go when the bead goes into the phone
    const cu = sineIO(span(t, a.writing - .1, a.writing + .7)) * (1 - span(t, a.already + .2, a.already + .9));
    if (cu > 0) F.beam(ctx, t, bx, by, scr.x + scr.w / 2, scr.y + scr.h * .4, cu, { w: 2.6, a: cu > 0 ? 1 - span(t, a.already + .2, a.already + .9) : 0 });
    // warm: the bead (later the phone) → the core of the crown (saving a life); it stays to the end
    const wu = sineIO(span(t, a.saving - .1, a.saving + .9));
    if (wu > 0) { const o = inP > 0 ? [lerp(bx, h[0], inP), lerp(by, h[1] - 6, inP)] : [bx, by]; F.beam(ctx, t, o[0], o[1], CORE[0], CORE[1] + 30, wu, { w: 3, warm: .85, hit: span(t, a.saving + .7, a.saving + 1.3), hitR: 150 }); }
    F.agent(ctx, t, bx, by, 7.5 * born * (1 - inP), { think: .4 * (1 - span(t, a.diff, a.diff + 1)), a: 1 - inP });
    // the phone in your raised hand: its light is warm (someone acting)
    const r = raise(t); if (r > 0) { const pw = 7, ph = 12.6; E.halo(ctx, h[0], h[1] - 6, 26 + 30 * inP, .5 * r, P.halo0, P.core0); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(h[0] - pw / 2 - 1, h[1] - 6 - ph / 2 - 1.5, pw + 2, ph + 3, 1.6); ctx.fill(); ctx.fillStyle = E.mixHex(F.COOL.body, P.core1, inP); ctx.fillRect(h[0] - pw / 2, h[1] - 6 - ph / 2, pw, ph); }
  }
  // ---------------------------------------------------------------- texts (E.04 ★)
  function texts(ctx, t) {
    const k = 1 - span(t, a.already + .4, a.already + 1.0); if (k <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = k;
    const u1 = F.rise(span(t, a.nevertool + .1, a.nevertool + .8)), u2 = F.rise(span(t, a.itwas + .05, a.itwas + .75));
    if (u1 > 0) F.maskLine(ctx, [['NOT THE TOOL', 0]], 470, 330, 34, u1, { serif: false, weight: 600, col: P.cream, glow: false, align: 'center' });
    if (u2 > 0) F.maskLine(ctx, [['THE AIM', 1]], 470, 430, 88, u2, { serif: true, glow: true, align: 'center' });
    ctx.restore();
  }
  // ---------------------------------------------------------------- one frame
  const THREADU = (t) => sineIO(span(t, a.thats - .1, a.thats + 1.4));
  return (ctx, t) => {
    const c = cam(t), T_ = T;
    B.treeWorldWide(ctx, c, t, {
      glow: glowAt(t), du: { dx: DU_DX, look: duO(t).look, o: { armR: duO(t).armR } },
      lantern: (n) => (landed(n, t) ? { lit: F.lampOn(T_, n, t), num: n, numA: 1 - .6 * span(t, a.none, a.none + 1.5), s: 46 * (1 + .1 * F.bump(t, a.none + .3 + (12 - n) * .09, .8)) } : null),
      lights: (k, x) => .3 + .7 * smooth(span(t, a.channel + .4 + (x + 300) / 1500 * 3.2, a.channel + 1.6 + (x + 300) / 1500 * 3.2)),
      extra: (cx) => {
        foot(cx, t); gallery(cx, t);
        const u = THREADU(t); if (u > 0) { cx.save(); cx.globalAlpha *= 1 - span(t, a.already, a.already + 1.2); E.trail(cx, B.THREAD_Q, u, { w: 2.6 }); cx.restore(); }
      },
    });
    // the ? returns at the end of the thread; its dot becomes the bead
    const p = E.project(c, E.F0, B.G_1.x + 112, B.G_1.y - 92), qu = span(t, a.thats + 1.1, a.thats + 1.7) * (1 - span(t, a.diff - .5, a.diff + .1));
    if (p && qu > 0) F.questionMark(ctx, t, p[0], p[1], 64 * p[2], qu);
    texts(ctx, t);
    // the rail comes down onto the limb (each lamp lands on its tree lantern, its tool under it)
    F.lampRail(ctx, t, T, {
      mOf: (n) => mOf(n)(t), m: 1 - span(t, tq0 + .3, tq0 + 1.2),
      from: (n) => { const L = F.treeLantern(n), q = E.project(c, E.F0, L.x, L.y); return [q[0], q[1], L.s * q[2], L.len * q[2]]; },
    });
    E.lightFlood(ctx, 1 - smooth(span(t, t0, t0 + 1.4)));
  };
}
