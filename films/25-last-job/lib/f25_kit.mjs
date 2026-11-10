// Film 25 · "The Last Human Job" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du/person/robot, halo, glowText, the 2.5D card stage cam3/card/aim/camAt/camDrift,
// counter, finish) + lib/f16_kit.mjs (rise, maskLine, measure, rule, quote). World: docs/MOTION.md §2. Shots: docs/shots.md.
//
//   THE ROW (the guiding image, ANCHORS ONLY: hook, the "tasks" turn, No. 1, act 4, ending): tall domino stones on a night plain,
//   receding to the right. Every stone is a TASK and carries a task glyph on the upper half of its face (a domino bar and pips below).
//   The near stone that stays is made of warm light (the hero light). Stones fall far → near (a computed cascade, heavy, accelerating),
//   a falling stone hands its glyph to a cool AGENT bead (the machine takes the task).
//   THE STUDIO (Jakob's thread, every [JAKOB Jn]): Jakob (indigo, headphones, no face) at a standing desk under a warm lamp; behind him
//   the TIMELINE WALL: nine lanes, bottom → top MUSIC … TOPIC, with track headers and a ladder. Hand-made clips are warm; an agent bead
//   sweeps a lane and it turns cool. Each time, Jakob climbs one ledge higher; at the top he conducts the agents, TOPIC stays his.
//   EXPLAINERS (60–70 %): made of film things — slabs (lying stones) as bars, mini stones as counters and grids, light lines, serif numbers.
//   THE RANK RAIL (the countdown, NOT a clock): top left, ten mini stones 10 … 1; on "Number N" stone N tips to how far that job falls.
//
// API (design px = screen px at the home camera; t in seconds; u = 0..1 growth):
//   colours: WARM, COOL, STONE · PRINT25 (finish) · bump(t, t0, d)
//   world:   sky(ctx, c, t, o) · plain(ctx, c, t, o) · HOR (horizon design y) · Z_SKY, Z_HOR
//   GLYPHS (names) · glyphPath(name) · glyph(ctx, name, x, y, s, o { a, lit 0..1 (warm), col 'cool'|'warm'|'cream', glow })
//   stone(ctx, t, x, y, h, o)  one domino, pivot = bottom-left front corner (x, y), height h. o { w, d, fall (rad, + = toppled left),
//        glyph, glyphA, glyphWarm, gold 0..1 (made of light), pips, num, rim 0..1, dark 0..1, a } → { pt(u, v), top, face }
//   row(o) → { stones: [{ i, x, y, h, w, Z, s }], gapAt } a receding row: o { x, y, h, n, k (scale per stone), gap, glyphs, bigGap: [i, px] }
//   cascade(t, row, t0, o) → { a: [angle per stone], hit: [time of landing], start: [time it starts] } far → near; o { stopAt, tau,
//        nudge, rest } (stones with index ≤ stopAt stay standing; a stone resting on a standing one leans at the contact angle)
//   drawRow(ctx, c, t, row, angles, o) draws stones far → near on their own depth cards (+ shadows); o.each(i) → stone options
//   agent(ctx, t, x, y, r, o { a, think 0..1, ring }) the machine: a cool bead with a slow ring (never a robot, never a brain)
//   jakob(ctx, t, x, y, h, o) Jakob: person() + headphones, breathing, idle head; o { work 0..1 (hands at the desk), climb (phase),
//        conduct 0..1, look, dir, view } → hands
//   STUDIO, STUDIO_CAM, LANES, laneTop(i), jakobPos(level) → { x, y, mode, ph } · studio(ctx, c, t, s) the whole studio on cards, see below
//   lowerThird(ctx, t, T, id, o) JAKOB · CREATOR OF THIS CHANNEL (J1 big, later small JAKOB) + a quiet waveform, phrase/slot driven
//   RANKS, rankAt(T, n), rankRail(ctx, t, T, o) the countdown rail · rankTitle(ctx, t, x, y, n, sub, u, o) big "No. 9" + job line
//   chartLines(ctx, t, o) light lines on a quiet axis · slab(ctx, t, x, y, len, th, o) a lying stone as a bar · slabBars(ctx, t, o)
//   stoneGrid(ctx, t, o) mini stones that can be outlined (could) and tipped (did) · dayTiles(ctx, t, o) · bracket(ctx, …) · label(…)
//   CLIP_RECT, CLIPS, clipWin, prepareClipFrames, clipPlate(ctx, t, T, id, o { from: [cx, cy, r] | { x, y, w, h }, morph })
//   QUOTES (amodei, hinton, gates: checked wording, quoted or not) + quote (lib/f16_kit.mjs) for the cards · SOURCES (checked source lines)
//   camPath(t, K) a camera gliding through its keys [[t, cam], …] (use for every move; E.camAt only for dives) · coolPath(ctx, pts, u0, u1, w, a)
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D, PathOp, loadImage } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, quote, rule, maskLine, measure } = K16;
export const { du, person, robot, cam3, card, camAt, camDrift, aim, project, F0, glowText, counter, withOuter, lightFlood } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };

export const PRINT25 = { grain: 14, floor: 4, vig: .5 };
// colour code (docs/MOTION.md §5): WARM = human, what stays, the hero light · COOL = the machine (agents, taken tasks) · STONE = night
export const WARM = { core: P.core0, body: P.halo0, deep: P.shade0, line: mixHex(P.halo0, P.coat, .25), text: P.halo2 };
export const COOL = { core: '#f2f8ff', body: mixHex(P.cream, '#9fc2ee', .55), deep: mixHex(P.blue0, P.blue1, .5), line: mixHex(P.cream, '#9fc2ee', .4), halo: '#7fa6e6', text: mixHex(P.cream, '#9fc2ee', .35) };
export const STONE = { face: mixHex(P.ind1, P.blue1, .18), faceDark: P.night1, side: mixHex(P.night1, P.ind0, .4), top: mixHex(P.blue1, P.blue0, .3), rim: mixHex(P.halo2, P.blue1, .35) };
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const TAU = Math.PI * 2;

// ======================================================================================================================== WORLD
export const Z_SKY = 40000, Z_HOR = 9000, HOR = 800;
// the night sky (screen) + stars on a far card + a soft blue glow behind the row. o { glow: [x, y, r] (design, F0), stars 0..1 }
export function sky(ctx, c, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const hy = (E.project(c, Z_HOR, 0, HOR) || [0, H * .75])[1];
  ctx.fillStyle = lin(ctx, 0, hy - 1100, 0, hy, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue0, .35)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, c, Z_SKY, () => E.stars(ctx, 25, 900, t, [-6000, -5200, 16000, 6200], o.stars ?? 1));
  if (o.glow) E.card(ctx, c, F0 * 2.2, () => halo(ctx, o.glow[0], o.glow[1], o.glow[2], .32, P.blue0, mixHex(P.blue0, P.halo2, .35)));
}
// the plain: ground from the horizon down, a faint blue rim on the horizon. Returns the horizon's screen y.
export function plain(ctx, c, t, o = {}) {
  const hy = (E.project(c, Z_HOR, 0, HOR) || [0, H * .75])[1];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, hy, 0, Math.max(hy + 10, H), [[0, mixHex(P.night1, P.ind0, .5)], [.25, P.night1], [1, P.night0]]); ctx.fillRect(0, hy, W, H - hy + 2);
  ctx.strokeStyle = rgba(P.blue0, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, hy); ctx.lineTo(W, hy); ctx.stroke();
  ctx.fillStyle = lin(ctx, 0, hy - 30, 0, hy + 4, [[0, rgba(P.blue0, 0)], [1, rgba(P.blue0, .22)]]); ctx.fillRect(0, hy - 30, W, 34);
  ctx.restore();
  return hy;
}
// a warm pool of light on the ground (design coords on the current card)
export function pool(ctx, x, y, rx, ry, a = 1, col = WARM) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
  ctx.fillStyle = rad(ctx, 0, 0, rx, [[0, rgba(col.body, .5 * a)], [.35, rgba(col.body, .2 * a)], [1, rgba(col.body, 0)]]); ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
}

// ======================================================================================================================== GLYPHS
// task glyphs: line drawings of light in a unit box (about −.5 … .5), cached as filled Path2D
export const GLYPHS = ['email', 'report', 'translate', 'voice', 'form', 'invoice', 'calendar', 'image', 'note', 'cut', 'code', 'chat', 'draft',
  'scan', 'teach', 'steth', 'wrench', 'care', 'chess', 'topic', 'idea', 'script', 'storyboard', 'shoot', 'sound', 'animation', 'music', 'edit',
  'factory', 'desk', 'analysis', 'person'];
const GP = new Map();
export function glyphPath(name) {
  if (GP.has(name)) return GP.get(name);
  const SW = .075, U = (a, b) => a.op(b, PathOp.Union);
  let out = new Path2D();
  const st = (p, w = SW) => { out = U(out, p.stroke({ width: w, cap: 1, join: 1 })); };
  const fill = (p) => { out = U(out, p); };
  const L = (pts, w) => { const p = new Path2D(); pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); st(p, w); };
  const R = (x, y, w, h, r = .04, sw) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); st(p, sw); };
  const C = (x, y, r, sw) => { const p = new Path2D(); p.arc(x, y, r, 0, TAU); st(p, sw); };
  const D = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, TAU); fill(p); };
  const A = (x, y, r, a0, a1, sw) => { const p = new Path2D(); p.arc(x, y, r, a0, a1); st(p, sw); };
  const page = () => { L([[-.28, -.42], [.14, -.42], [.3, -.26], [.3, .42], [-.28, .42], [-.28, -.42]]); L([[.14, -.42], [.14, -.26], [.3, -.26]], .05); };
  switch (name) {
    case 'email': R(-.44, -.3, .88, .6); L([[-.44, -.28], [0, .06], [.44, -.28]]); break;
    case 'report': page(); L([[-.16, -.18], [.08, -.18]], .05); L([[-.16, -.06], [.16, -.06]], .05); [[-.14, .12], [-.02, .02], [.1, .08], [.2, -.06]].reduce((a, b) => (L([a, b], .055), b)); L([[-.16, .3], [.18, .3]], .05); break;
    case 'translate': { R(-.46, -.36, .52, .38, .08); L([[-.3, -.08], [-.38, .12]], .05); R(-.04, -.06, .5, .38, .08); L([[.3, .32], [.36, .46]], .05);
      L([[-.32, -.24], [-.2, -.24]], .05); L([[-.26, -.28], [-.26, -.12]], .05); L([[.08, .12], [.32, .12]], .05); L([[.08, .2], [.24, .2]], .05); break; }
    case 'voice': R(-.13, -.44, .26, .5, .13); A(0, -.06, .25, .15, Math.PI - .15); L([[0, .2], [0, .36]]); L([[-.16, .38], [.16, .38]]); break;
    case 'form': page(); for (const y of [-.16, .04, .24]) { R(-.18, y - .06, .12, .12, .02, .045); L([[0, y], [.2, y]], .05); } L([[-.16, -.14], [-.12, -.1], [-.07, -.2]], .045); break;
    case 'invoice': page(); L([[-.16, -.2], [.12, -.2]], .05); L([[-.16, -.08], [.18, -.08]], .05); L([[-.16, .04], [.18, .04]], .05); L([[-.16, .22], [.18, .22]], .09); break;
    case 'calendar': R(-.4, -.32, .8, .72); L([[-.4, -.14], [.4, -.14]]); L([[-.2, -.42], [-.2, -.26]]); L([[.2, -.42], [.2, -.26]]); for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) D(-.26 + k * .17, .02 + r * .18, .035); break;
    case 'image': R(-.44, -.32, .88, .64); L([[-.38, .26], [-.1, -.04], [.06, .12], [.18, 0], [.38, .22]]); D(.2, -.16, .07); break;
    case 'note': case 'music': L([[-.22, .26], [-.22, -.36], [.26, -.44], [.26, .18]]); L([[-.22, -.2], [.26, -.28]]); D(-.31, .28, .1); D(.17, .2, .1); break;
    case 'cut': case 'edit': C(-.2, .26, .14); C(.2, .26, .14); L([[-.12, .14], [.2, -.44]]); L([[.12, .14], [-.2, -.44]]); break;
    case 'code': L([[-.18, -.24], [-.42, 0], [-.18, .24]]); L([[.18, -.24], [.42, 0], [.18, .24]]); L([[.08, -.32], [-.08, .32]]); break;
    case 'chat': R(-.42, -.34, .84, .52, .14); L([[-.18, .18], [-.26, .38], [.02, .18]]); D(-.18, -.08, .05); D(0, -.08, .05); D(.18, -.08, .05); break;
    case 'draft': page(); L([[-.16, -.18], [.1, -.18]], .05); L([[-.16, -.04], [.12, -.04]], .05); L([[-.06, .34], [.36, -.08]], .09); L([[-.06, .34], [-.12, .4]], .05); break;
    case 'scan': R(-.34, -.42, .68, .84, .1); L([[0, -.32], [0, .32]], .05); for (const y of [-.2, -.06, .08, .22]) { A(-.02, y + .3, .32, -2.3, -1.75, .045); A(.02, y + .3, .32, -1.39, -.84, .045); } break;
    case 'teach': R(-.44, -.36, .88, .56, .03); L([[-.3, -.16], [-.18, .02], [-.06, -.16]], .05); L([[.04, -.06], [.28, -.06]], .05); L([[-.2, .2], [-.3, .42]]); L([[.2, .2], [.3, .42]]); break;
    case 'steth': A(-.08, -.16, .22, Math.PI, 0); L([[-.3, -.16], [-.3, -.4]], .06); L([[.14, -.16], [.14, -.4]], .06); A(.03, .02, .17, 0, Math.PI * .5); L([[-.08, .06], [-.08, .2], [.04, .32], [.22, .26]]); C(.3, .14, .1); break;
    case 'wrench': { L([[-.3, .32], [.12, -.1]], .14); const p = new Path2D(); p.arc(.2, -.18, .18, 0, TAU); fill(p); out = out.op((() => { const q = new Path2D(); q.moveTo(.2, -.18); q.lineTo(.5, -.48); q.lineTo(.32, -.5); q.closePath(); const s = new Path2D(); s.arc(.25, -.24, .07, 0, TAU); return U(q, s); })(), PathOp.Difference); break; }
    case 'care': { const p = new Path2D(); p.moveTo(0, .34); p.bezierCurveTo(-.5, 0, -.4, -.42, 0, -.18); p.bezierCurveTo(.4, -.42, .5, 0, 0, .34); st(p); L([[-.44, .3], [-.2, .42], [.22, .42], [.44, .3]], .06); break; }
    case 'chess': { C(0, -.3, .1); const p = new Path2D(); p.moveTo(-.12, -.18); p.lineTo(.12, -.18); p.lineTo(.08, .16); p.lineTo(-.08, .16); p.closePath(); st(p); R(-.22, .16, .44, .1, .03); R(-.3, .3, .6, .1, .03); break; }
    case 'topic': { const p = new Path2D(); for (let k = 0; k < 8; k++) { const r = k % 2 ? .13 : .44, q = -Math.PI / 2 + k * Math.PI / 4; k ? p.lineTo(Math.cos(q) * r, Math.sin(q) * r) : p.moveTo(Math.cos(q) * r, Math.sin(q) * r); } p.closePath(); st(p); D(0, 0, .06); break; }
    case 'idea': A(0, -.1, .26, Math.PI * .78, Math.PI * .22 + TAU); L([[-.15, .1], [-.12, .22], [.12, .22], [.15, .1]]); L([[-.1, .3], [.1, .3]]); L([[-.06, .38], [.06, .38]]); break;
    case 'script': page(); for (const [y, w] of [[-.2, .28], [-.08, .4], [.04, .36], [.16, .4], [.28, .24]]) L([[-.16, y], [-.16 + w, y]], .05); break;
    case 'storyboard': for (let k = 0; k < 3; k++) R(-.46 + k * .32, -.22, .28, .3, .03, .055); L([[-.42, .24], [-.22, .24]], .045); L([[-.1, .24], [.1, .24]], .045); L([[.22, .24], [.42, .24]], .045); break;
    case 'shoot': R(-.42, -.2, .58, .44, .06); L([[.16, -.06], [.42, -.2], [.42, .24], [.16, .1]]); C(-.24, -.34, .1, .055); C(-.02, -.34, .1, .055); break;
    case 'sound': { const p = new Path2D(); p.moveTo(-.4, -.12); p.lineTo(-.22, -.12); p.lineTo(-.02, -.32); p.lineTo(-.02, .32); p.lineTo(-.22, .12); p.lineTo(-.4, .12); p.closePath(); st(p); A(-.02, 0, .2, -.7, .7, .06); A(-.02, 0, .36, -.7, .7, .06); break; }
    case 'animation': C(.3, -.26, .1, .05); C(.04, -.06, .12, .05); D(-.26, .24, .15); L([[-.42, .42], [.42, .42]], .05); break;
    case 'factory': { const p = new Path2D(); p.moveTo(-.46, .4); p.lineTo(-.46, -.02); p.lineTo(-.2, -.2); p.lineTo(-.2, -.02); p.lineTo(.06, -.2); p.lineTo(.06, -.02); p.lineTo(.32, -.2); p.lineTo(.32, -.46); p.lineTo(.44, -.46); p.lineTo(.44, .4); p.closePath(); st(p); R(-.34, .12, .12, .12, .02, .05); R(-.08, .12, .12, .12, .02, .05); break; }
    case 'desk': L([[-.46, .06], [.46, .06]]); L([[-.38, .06], [-.38, .42]]); L([[.38, .06], [.38, .42]]); R(-.2, -.4, .4, .28, .03, .06); L([[0, -.12], [0, .02]]); L([[-.12, .02], [.12, .02]], .05); L([[.32, .06], [.32, -.26], [.42, -.34]], .05); break;
    case 'analysis': L([[-.4, .36], [.4, .36]], .05); R(-.32, .02, .14, .34, .02, .05); R(-.07, -.18, .14, .54, .02, .05); R(.18, -.38, .14, .74, .02, .05); break;
    case 'person': C(0, -.26, .14); A(0, .42, .34, Math.PI * 1.08, Math.PI * 1.92); break;
    default: C(0, 0, .3);
  }
  GP.set(name, out); return out;
}
// draw a glyph centred at (x, y), size s (px of the unit box). o { a, lit 0..1 (0 = engraved cool cream, 1 = warm light), col, glow }
export function glyph(ctx, name, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s <= 1) return;
  const lit = clamp(o.lit ?? 0), col = o.col === 'cool' ? COOL.body : o.col === 'cream' ? P.cream : mixHex(COOL.line, mixHex(P.halo0, P.coat, .7), lit);
  const p = new Path2D(); p.addPath(glyphPath(name), { a: s, b: 0, c: 0, d: s, e: x, f: y });
  if ((o.glow ?? 1) > 0) halo(ctx, x, y, s * (.9 + .5 * lit), (.12 + .3 * lit) * a * (o.glow ?? 1), lit > .5 ? P.halo0 : P.blue0, lit > .5 ? P.core1 : COOL.body);
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fill(p, "evenodd"); ctx.restore();
}

// ======================================================================================================================== THE STONE
// pivot (x, y) = bottom-left FRONT corner; it topples left (toward the nearer stone) about that corner. The side face shows on the right,
// the top face above (the row recedes up-right). Lit from the left (the warm stone), cool sky light on the top.
export function stone(ctx, t, x, y, h, o = {}) {
  const w = o.w ?? h * .29, d = o.d ?? h * .1, ang = o.fall ?? 0, gold = clamp(o.gold ?? 0), dark = clamp(o.dark ?? 0), al = o.a ?? 1;
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const pt = (u, v) => [x + u * ca + v * sa, y - u * sa + v * ca];
  if (al <= 0) return { pt, top: pt(w / 2, -h), face: pt(w / 2, -h * .5) };
  const dx = d * .62, dy = -d * .5;
  ctx.save(); ctx.translate(x, y); ctx.rotate(-ang); ctx.globalAlpha *= al;
  const side = new Path2D(); side.moveTo(w, 0); side.lineTo(w, -h); side.lineTo(w + dx, -h + dy); side.lineTo(w + dx, dy); side.closePath();
  const top = new Path2D(); top.moveTo(0, -h); top.lineTo(w, -h); top.lineTo(w + dx, -h + dy); top.lineTo(dx, -h + dy); top.closePath();
  const face = new Path2D(); face.rect(0, -h, w, h);
  if (gold > 0) {   // the stone made of light (the one that stays): blue bloom, warm halo, gradient body
    halo(ctx, w * .5, -h * .55, h * 1.05, .3 * gold, P.blue0, mixHex(P.blue0, P.halo2, .5));
    halo(ctx, w * .5, -h * .5, h * .62, .32 * gold, P.halo1, P.halo0);
  }
  const fcol = mixHex(STONE.face, P.night0, dark * .6);
  ctx.fillStyle = lin(ctx, 0, 0, w + dx, 0, [[0, mixHex(STONE.side, P.night0, dark * .5)], [1, P.night0]]); ctx.fill(side);
  ctx.fillStyle = lin(ctx, 0, -h + dy, w, -h, [[0, mixHex(STONE.top, P.night1, dark * .5)], [1, mixHex(STONE.top, P.blue0, .4)]]); ctx.fill(top);
  ctx.fillStyle = lin(ctx, 0, -h, w * 1.2, 0, [[0, mixHex(fcol, STONE.rim, .22 * (o.rim ?? 1))], [.35, fcol], [1, mixHex(fcol, P.night0, .45)]]); ctx.fill(face);
  ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, rgba(P.blue1, .1)], [.7, rgba(P.night0, 0)], [1, rgba(P.night0, .35)]]); ctx.fill(face);
  if (gold > 0) {
    ctx.save(); ctx.globalAlpha *= gold;
    ctx.fillStyle = lin(ctx, 0, 0, w + dx, 0, [[0, P.halo1], [1, P.shade0]]); ctx.fill(side);
    ctx.fillStyle = P.core0; ctx.fill(top);
    ctx.fillStyle = rad(ctx, w * .35, -h * .58, h * .75, [[0, P.core0], [.3, P.core1], [.7, P.halo0], [1, P.halo1]]); ctx.fill(face);
    ctx.restore();
  }
  // a thin warm rim on the lit (left) edge, a cool line on the top edge
  ctx.fillStyle = rgba(gold > .5 ? P.core0 : STONE.rim, (.45 + .4 * gold) * (o.rim ?? 1) * (1 - dark * .7)); ctx.fillRect(0, -h, Math.max(1.5, w * .025), h);
  ctx.fillStyle = rgba(P.cream, .35 * (1 - dark)); ctx.fillRect(0, -h, w, Math.max(1, h * .004));
  if (o.face) { ctx.save(); ctx.clip(face); o.face(ctx, w, h); ctx.restore(); }
  // the domino bar and pips (reads as a domino, not a monolith)
  const barA = (gold > .5 ? .25 : .5) * (1 - dark * .5);
  ctx.fillStyle = rgba(gold > .5 ? P.shade0 : P.night0, barA); ctx.fillRect(w * .12, -h * .5 - 1, w * .76, Math.max(1.5, h * .006));
  ctx.fillStyle = rgba(gold > .5 ? P.core0 : P.blue1, barA * .9); ctx.fillRect(w * .12, -h * .5 + Math.max(1.5, h * .006), w * .76, 1);
  const np = o.num != null ? 0 : (o.pips ?? 0);
  for (let k = 0; k < np; k++) { const px = w * (np === 1 ? .5 : .3 + .4 * k / (np - 1)), py = -h * (np === 1 ? .25 : .33 - .16 * k / (np - 1)); ctx.fillStyle = rgba(gold > .5 ? P.shade0 : P.night0, .55); ctx.beginPath(); ctx.arc(px, py, w * .06, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(P.blue1, .35); ctx.beginPath(); ctx.arc(px + w * .01, py - w * .012, w * .035, 0, TAU); ctx.fill(); }
  if (o.num != null) glowText(ctx, String(o.num), w * .5, -h * .17, { size: Math.max(6, w * .5), align: 'center', serif: true, col: gold > .5 ? P.shade0 : P.cream, glow: gold <= .5, a: o.numA ?? .9 });
  if (o.glyph) glyph(ctx, o.glyph, w * .5, -h * .74, w * .62, { a: o.glyphA ?? 1, lit: o.glyphWarm ?? 0, glow: gold > .5 ? 0 : 1, col: gold > .5 ? 'warm' : undefined });
  ctx.restore();
  return { pt, top: pt(w / 2, -h), face: pt(w / 2, -h * .74), w, h };
}

// ======================================================================================================================== THE ROW
// a receding row: stone 0 = the near one at (x, y) height h; stone i has scale s_i = k^i, stands on the ground line that rises toward HOR,
// and lives on its own depth card Z = F0 / s_i (true parallax). o { x, y, h, n, k (.885), gap (pivot gap / h, .17), w (w/h .29),
//   bigGap: [i, px] an extra gap before stone i (the stone that will NOT be reached), glyphs: [names] }
export function row(o = {}) {
  const n = o.n ?? 10, k = o.k ?? .885, x0 = o.x ?? 845, y0 = o.y ?? 878, h0 = o.h ?? 690, wr = o.w ?? .29, hor = o.hor ?? HOR;
  const st = []; let x = x0;
  for (let i = 0; i < n; i++) {
    const s = Math.pow(k, i), h = h0 * s * (i ? (o.hk ?? .92) : 1), w = h * wr, y = hor + (y0 - hor) * s;
    if (i) x += st[i - 1].w + (o.gap ?? .17) * h + (o.bigGap && o.bigGap[0] === i ? o.bigGap[1] * s : 0);
    st.push({ i, x, y, h, w, s, Z: F0 / s, glyph: o.glyphs ? o.glyphs[i] : null });
  }
  return { stones: st, n };
}
// the cascade, far → near. Each stone falls like a slab under gravity (bigger = slower), starting when the farther one hits it;
// it cannot pass the nearer stone (it leans on it) and ends resting at o.rest (lying on the fallen neighbour). Stones with index ≤ stopAt
// stay; the stone right behind them ends leaning on them. A stone with a big gap in front falls flat (π/2) and lands short.
// o { stopAt (−1 = all fall), tau (s for a 690 px stone to fall a quarter turn: 1.1), nudge (s of anticipation wobble on the first), rest }
export function cascade(t, R, t0, o = {}) {
  const S = R.stones, n = S.length, stopAt = o.stopAt ?? 0, rest = o.rest ?? 1.36, tau0 = o.tau ?? 1.1;
  const a = new Array(n).fill(0), start = new Array(n).fill(Infinity), hit = new Array(n).fill(Infinity);
  // contact angle of stone i on stone i−1: its top reaches the near stone's back face
  const contact = (i) => { const g = S[i].x - (S[i - 1].x + S[i - 1].w); return g >= S[i].h * .98 ? Math.PI / 2 : Math.asin(clamp(g / S[i].h, 0, 1)); };
  const alpha = (i) => (Math.PI / 2) * 2 / (tau0 * Math.sqrt(S[i].h / 690)) ** 2;   // angular acceleration so a quarter turn takes tau
  let ts = t0;
  for (let i = n - 1; i > stopAt; i--) {
    start[i] = ts; const th = i > 0 ? contact(i) : Math.PI / 2;
    hit[i] = ts + Math.sqrt(2 * th / alpha(i));
    ts = hit[i];
  }
  for (let i = n - 1; i > stopAt; i--) {
    const free = t > start[i] ? .5 * alpha(i) * (t - start[i]) ** 2 : 0;
    const th = i > 0 ? contact(i) : Math.PI / 2, flat = th >= Math.PI / 2 - 1e-3;
    let v = Math.min(free, flat ? Math.PI / 2 - .015 : rest);
    if (!flat && i - 1 >= 0) v = Math.min(v, a[i - 1] + th);   // rests on the nearer stone (a[i−1] is filled later; fixed below)
    a[i] = v;
  }
  // second pass near → far: a stone leans on its nearer neighbour's current angle
  for (let i = 1; i < n; i++) if (i > stopAt && start[i] < Infinity) { const th = contact(i); if (th < Math.PI / 2 - 1e-3) a[i] = Math.min(a[i], a[i - 1] + th); }
  // landing bounce: a tiny clack when it lands on the neighbour / the ground
  for (let i = stopAt + 1; i < n; i++) if (t > hit[i]) a[i] -= .025 * Math.exp(-(t - hit[i]) * 9) * Math.sin((t - hit[i]) * 30);
  // anticipation: the first stone rocks back a little before it goes
  if (o.nudge && n - 1 > stopAt) { const u = span(t, t0 - o.nudge, t0); if (u > 0 && u < 1) a[n - 1] -= .035 * Math.sin(Math.PI * u); }
  return { a, start, hit };
}
// draw a row far → near on depth cards. angles: array (radians) or null. o.each(i, S) → extra stone options; o.shadow (default on);
// o.light: [x, y] design position of the warm light (shadows point away from it)
export function drawRow(ctx, c, t, R, angles, o = {}) {
  const S = R.stones;
  for (let i = S.length - 1; i >= 0; i--) {
    const s = S[i], ang = angles ? angles[i] || 0 : 0, ex = o.each ? o.each(i, s) || {} : {};
    if (ex.hide) continue;
    E.card(ctx, c, s.Z, () => {
      if (o.shadow !== false && ang < 1.2) {   // a long soft shadow away from the light, on the ground
        const L = o.light || [S[0].x - 300, S[0].y], dirx = s.x - L[0] > 0 ? 1 : -1, len = s.h * (1.1 - ang * .6) * (ex.gold ? 0 : 1);
        if (len > 4) { ctx.fillStyle = lin(ctx, s.x, s.y, s.x + dirx * len, s.y + len * .18, [[0, rgba(P.night0, .55)], [1, rgba(P.night0, 0)]]);
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + s.w, s.y); ctx.lineTo(s.x + s.w + dirx * len, s.y + len * .2); ctx.lineTo(s.x + dirx * len * .9, s.y + len * .26); ctx.closePath(); ctx.fill(); }
      }
      const r = stone(ctx, t, s.x, s.y, s.h, { w: s.w, fall: ang, glyph: s.glyph, rim: 1 - .6 * clamp(ang), ...ex });
      s.last = r;
    });
  }
}

// ======================================================================================================================== THE AGENT
// the machine: a cool bead of light with a slow dashed ring (machine = circle). o { a, think 0..1 (rings pulse inward), ring 0..1 }
export function agent(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= .3) return;
  halo(ctx, x, y, r * 6, .28 * a, COOL.halo, COOL.body);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rad(ctx, x - r * .25, y - r * .3, r * 1.2, [[0, COOL.core], [.55, COOL.body], [1, COOL.deep]]); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  const ring = o.ring ?? 1;
  if (ring > 0) {
    ctx.strokeStyle = rgba(COOL.line, .7 * ring); ctx.lineWidth = Math.max(1, r * .14); ctx.setLineDash([r * .9, r * .5]); ctx.lineDashOffset = -t * r * 2.2;
    ctx.beginPath(); ctx.arc(x, y, r * 1.75, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  }
  if (o.think) for (let k = 0; k < 2; k++) { const u = ((t * .8 + k * .5) % 1); ctx.strokeStyle = rgba(COOL.line, .5 * o.think * u); ctx.lineWidth = Math.max(1, r * .1); ctx.beginPath(); ctx.arc(x, y, r * (1.2 + 1.8 * (1 - u)), 0, TAU); ctx.stroke(); }
  ctx.restore();
}

// ======================================================================================================================== JAKOB
// Jakob: an indigo silhouette (no face, never yellow) with headphones; he breathes, his head moves a little, his hands work.
// o { work 0..1 (typing at the desk), climb (phase, radians: hand over hand on the ladder), conduct 0..1 (arms up, slow beats),
//     look, dir, view, walk (phase), light } → hands { R, L }
export function jakob(ctx, t, x, y, h, o = {}) {
  const br = 1 + .008 * Math.sin(t * 1.9 + (o.seed ?? 0));
  const look = (o.look ?? .1) + .06 * Math.sin(t * .53 + 1) + .03 * Math.sin(t * 1.31);
  const q = { headset: true, dir: o.dir ?? 1, light: o.light ?? -1, look, view: o.view };
  if (o.walk != null) { q.pose = 'walk'; q.walk = o.walk; }
  else if (o.climb != null) {
    const p = o.climb; q.view = 'back'; q.look = .5;
    q.armR = [2.7 + .25 * Math.sin(p), 2.9 + .2 * Math.sin(p)]; q.armL = [-2.7 + .25 * Math.sin(p + Math.PI), -2.9 + .2 * Math.sin(p + Math.PI)];
  } else if ((o.conduct ?? 0) > 0) {
    const c = clamp(o.conduct), b = Math.sin(t * 1.7), b2 = Math.sin(t * 1.7 + .8);
    q.armR = [lerp(.2, 2.2 + .28 * b, c), lerp(.1, 2.6 + .35 * b2, c)]; q.armL = [lerp(-.2, -1.9 - .22 * b2, c), lerp(-.1, -2.3 - .3 * b, c)]; q.look = lerp(look, .3, c);
  } else if ((o.work ?? 0) > 0) {
    const w = clamp(o.work), k1 = Math.sin(t * 7.3) * .07, k2 = Math.sin(t * 6.1 + 1.3) * .07;
    q.armR = [lerp(.2, 1.05 + k1, w), lerp(.1, 1.7 + k1, w)]; q.armL = [lerp(-.2, .8 + k2, w), lerp(-.1, 1.55 + k2, w)]; q.lean = .06 * w; q.look = lerp(look, -.15, w);
  }
  if (o.armR) q.armR = o.armR; if (o.armL) q.armL = o.armL;
  ctx.save(); ctx.translate(x, y); ctx.scale(1, br); ctx.translate(-x, -y);
  const hands = person(ctx, x, y, h, q);
  ctx.restore();
  return hands;
}

// ======================================================================================================================== THE STUDIO
// Jakob's workbench (design px at the home camera = the whole room): a standing desk under a warm lamp (left), the TIMELINE WALL (right):
// nine lanes, bottom → top, with track headers; a ladder between headers and lanes; ledges at lanes 5, 7 and 8 (where Jakob stands later).
export const LANES = ['MUSIC', 'SOUND', 'ANIMATION', 'EDIT', 'SHOOT', 'STORYBOARD', 'SCRIPT', 'IDEA', 'TOPIC'];
export const LANE_GLYPH = ['music', 'sound', 'animation', 'edit', 'shoot', 'storyboard', 'script', 'idea', 'topic'];
export const STUDIO = {
  floor: 950, desk: { x0: 400, x1: 700, top: 800 }, lamp: [622, 640], monitor: [470, 655, 200, 128],
  head: { x0: 880, x1: 1062 }, lanes: { x0: 1150, x1: 1880, y0: 870, lh: 74, pitch: 86 }, ladder: 1100,
  jakobH: 210, floorX: 330, ledges: [null, 5, 7, 8], ruler: { y: 52 },
};
// camera presets for the studio (E.aim on F0): home = the whole room · desk = Jakob under the lamp · wall = the lanes · top = pulled back
// and up so Jakob on the top ledge (level 3) is in frame · lamp(s) = into the lamp (the light-flood door to and from the row world)
export const STUDIO_CAM = { home: E.cam3(), desk: E.aim(F0, 560, 760, 1.9), wall: E.aim(F0, 1420, 480, 1.18), top: E.aim(F0, 1180, 380, .8),
  lamp: (s = 14) => E.aim(F0, STUDIO.lamp[0] - 10, STUDIO.lamp[1] + 8, s) };
export const laneTop = (i) => STUDIO.lanes.y0 - i * STUDIO.lanes.pitch - STUDIO.lanes.lh;
export const laneMid = (i) => laneTop(i) + STUDIO.lanes.lh / 2;
const ledgeY = (lv) => (lv === 0 ? STUDIO.floor : laneTop(STUDIO.ledges[lv]) + STUDIO.lanes.lh + 8);
// where Jakob is at a (float) level: 0 = at the desk, 1 = ledge of lane 5 (STORYBOARD), 2 = lane 7 (IDEA), 3 = the top ledge (TOPIC).
// Between levels he walks to the ladder (0 → 1 only) and climbs hand over hand. → { x, y, mode: 'desk'|'walk'|'climb'|'ledge', ph }
export function jakobPos(level) {
  const lv = clamp(level, 0, 3), k = Math.min(2, Math.floor(lv)), u = lv - k;
  const LX = STUDIO.ladder - 10, ledgeX = STUDIO.ladder + 70;
  if (lv <= 1e-4) return { x: STUDIO.floorX, y: STUDIO.floor, mode: 'desk', ph: 0 };
  if (lv >= 3 - 1e-4) return { x: ledgeX, y: ledgeY(3), mode: 'ledge', ph: 0 };
  if (u <= 1e-4) return { x: ledgeX, y: ledgeY(k), mode: 'ledge', ph: 0 };
  if (k === 0) {
    if (u < .32) { const v = sineIO(u / .32); return { x: lerp(STUDIO.floorX, LX, v), y: STUDIO.floor, mode: 'walk', ph: v * 9.5 }; }
    const v = (u - .32) / .68, y = lerp(STUDIO.floor, ledgeY(1), sineIO(v));
    return { x: v > .9 ? lerp(LX, ledgeX, sineIO((v - .9) / .1)) : LX, y, mode: v > .9 ? 'ledge' : 'climb', ph: v * 14 };
  }
  const y = lerp(ledgeY(k), ledgeY(k + 1), sineIO(u)), back = Math.sin(Math.PI * u);
  return { x: lerp(ledgeX, LX, smooth(clamp(back * 2.2))), y, mode: back > .25 ? 'climb' : 'ledge', ph: u * 10 };
}
// hand-made clips per lane (seeded): [x0, x1] in 0..1 of the lane length
const HAND = LANES.map((_, i) => { const r = prng(70 + i * 13), out = []; let x = r() * .04; while (x < .97) { const L = .05 + r() * .13; out.push([x, Math.min(.995, x + L), r()]); x += L + .008 + r() * .03; } return out; });
// s (all optional): {
//   hand: [u per lane] how much of the lane Jakob has filled by hand (default 1) · taken: [u per lane] 0 = his, 1 = an agent runs it
//   (the bead's first sweep converts the clips) · part: [u per lane] only the first part converted (J2: images in ANIMATION)
//   lit: [0..1 per lane] the header glows (J1: he names it) · level (float, jakobPos) · work 0..1 · conduct 0..1 · lampA (desk lamp)
//   ruler: { u, hot } the year ruler 2011 … 2026 over the wall (hot 0..1 stretches + cools the last four years)
//   playhead: true (drifts) | false | 0..1 (position along the lanes, e.g. synced with hand[] while the years pass)
//   jakob: false to hide him · beads 0..1 (agent beads visible) · dim 0..1 (the wall steps back) }
// Draws the room on cards: back wall 4200, wall + desk + Jakob on F0, a foreground lamp glow. Returns { jakob: pos, hands, laneBead: [x per lane] }
export function studio(ctx, c, t, s = {}) {
  const LN = STUDIO.lanes, nL = LANES.length, out = { laneBead: [] };
  // room
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.7, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H); ctx.restore();
  E.card(ctx, c, 4200, () => {
    ctx.fillStyle = rad(ctx, 1380, 420, 1500, [[0, rgba(P.ind1, .55)], [1, rgba(P.night0, 0)]]); ctx.fillRect(-2000, -2000, 6000, 5000);
    E.stars(ctx, 31, 140, t, [-1500, -2600, 5200, 2600], .35);
  });
  const pos = jakobPos(s.level ?? 0), desk = STUDIO.desk, lampA = s.lampA ?? clamp(1 - (s.level ?? 0) * 1.4, .25, 1);
  E.card(ctx, c, F0, () => {
    // floor + the lamp's pool
    ctx.fillStyle = lin(ctx, 0, STUDIO.floor, 0, STUDIO.floor + 500, [[0, mixHex(P.night1, P.ind0, .4)], [1, P.night0]]); ctx.fillRect(-2000, STUDIO.floor, 6000, 2500);
    ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-2000, STUDIO.floor); ctx.lineTo(4000, STUDIO.floor); ctx.stroke();
    pool(ctx, 560, STUDIO.floor + 8, 420, 60, lampA);
    // the wall: headers + lanes
    const dim = 1 - .45 * clamp(s.dim ?? 0);
    for (let i = 0; i < nL; i++) {
      const y = laneTop(i), taken = clamp(s.taken?.[i] ?? 0), part = clamp(s.part?.[i] ?? 0), hand = clamp(s.hand?.[i] ?? 1), lit = clamp(s.lit?.[i] ?? 0);
      const L = LN.x1 - LN.x0, sweep = LN.x0 + L * sineIO(taken), human = taken < .02 && part < .02;
      // header: a slab with the lane's glyph and name
      ctx.fillStyle = lin(ctx, STUDIO.head.x0, 0, STUDIO.head.x1, 0, [[0, mixHex(P.night1, P.ind0, .3)], [1, mixHex(P.ind0, P.night1, .4)]]); ctx.beginPath(); ctx.roundRect(STUDIO.head.x0, y, STUDIO.head.x1 - STUDIO.head.x0, LN.lh, 6); ctx.fill();
      const own = taken < .5;
      glyph(ctx, LANE_GLYPH[i], STUDIO.head.x0 + 34, y + LN.lh / 2, 30, { lit: own ? .55 + .45 * lit : 0, col: own ? undefined : 'cool', glow: .4 + lit, a: dim });
      glowText(ctx, LANES[i], STUDIO.head.x0 + 64, y + LN.lh / 2 + 8, { size: 22, spacing: .14, col: own ? mixHex(WARM.text, P.core0, lit) : COOL.text, glow: lit > .05, a: (.62 + .38 * lit) * dim });
      // lane body
      ctx.fillStyle = mixHex(P.night1, P.night0, .3); ctx.beginPath(); ctx.roundRect(LN.x0, y, L, LN.lh, 5); ctx.fill();
      ctx.strokeStyle = rgba(P.blue0, .5 * dim); ctx.lineWidth = 1.5; ctx.stroke();
      // clips: warm hand-made ones up to `hand`, cool where the agent has swept (taken) or the part (J2)
      for (const [u0, u1, rr] of HAND[i]) {
        if (u0 > hand) break;
        const xa = LN.x0 + u0 * L, xb = LN.x0 + Math.min(u1, hand) * L, cool = xb <= sweep + 1 || u1 <= part;
        const yy = y + 9 + rr * 6, hh = LN.lh - 18 - rr * 8;
        if (cool) { ctx.fillStyle = lin(ctx, 0, yy, 0, yy + hh, [[0, mixHex(COOL.body, P.cream, .25)], [1, COOL.deep]]); ctx.globalAlpha = .82 * dim; ctx.beginPath(); ctx.roundRect(xa + 2, y + 10, xb - xa - 4, LN.lh - 20, 6); ctx.fill(); ctx.globalAlpha = 1; }
        else { ctx.fillStyle = lin(ctx, 0, yy, 0, yy + hh, [[0, mixHex(P.halo1, P.shade0, .25)], [1, mixHex(P.shade0, P.night1, .45)]]); ctx.globalAlpha = (.9 - .3 * rr) * dim; ctx.beginPath(); ctx.roundRect(xa + 2, yy, xb - xa - 4, hh, 3); ctx.fill(); ctx.globalAlpha = 1;
          ctx.fillStyle = rgba(P.core1, .25 * dim); ctx.fillRect(xa + 4, yy + 3, xb - xa - 8, 2); }
      }
      // the agent bead: sweeps once (taken 0 → 1), then keeps running the lane (loops)
      if (taken > 0 && (s.beads ?? 1) > 0) {
        const per = 5.5 + i * .63, loop = taken >= 1 ? ((t / per + i * .37) % 1) : sineIO(taken), bx = LN.x0 + 16 + (L - 32) * loop;
        agent(ctx, t, bx, y + LN.lh / 2, 9, { a: (s.beads ?? 1) * Math.min(1, taken * 4) * (taken >= 1 ? Math.min(1, Math.sin(Math.PI * loop) * 6) : 1), ring: .8 });
        out.laneBead[i] = [bx, y + LN.lh / 2];
      }
      if (human && hand >= 1 && lit > 0) halo(ctx, LN.x0 + 40, y + LN.lh / 2, 140, .12 * lit, P.halo1, P.halo0);
    }
    // the playhead: a thin line drifting over the lanes (the timeline plays)
    if (s.playhead !== false) { const px = LN.x0 + (LN.x1 - LN.x0) * (typeof s.playhead === 'number' ? clamp(s.playhead) : (t * .045 + .2) % 1); ctx.fillStyle = rgba(P.cream, .28); ctx.fillRect(px, laneTop(nL - 1) - 6, 2, LN.y0 - laneTop(nL - 1) + 6); ctx.fillStyle = rgba(P.cream, .55); ctx.beginPath(); ctx.moveTo(px - 7, laneTop(nL - 1) - 14); ctx.lineTo(px + 9, laneTop(nL - 1) - 14); ctx.lineTo(px + 1, laneTop(nL - 1) - 4); ctx.closePath(); ctx.fill(); }
    // the year ruler 2011 … 2026 (fifteen years; the last four stretch and turn cool)
    if (s.ruler && s.ruler.u > 0) {
      const ru = clamp(s.ruler.u), hot = clamp(s.ruler.hot ?? 0), y = STUDIO.ruler.y, xa = LN.x0, xb = LN.x1;
      const wts = Array.from({ length: 15 }, (_, k) => (k >= 11 ? 1 + 1.6 * hot : 1)), tot = wts.reduce((a, b) => a + b, 0);
      let x = xa; const xs = [xa]; for (const wv of wts) { x += (xb - xa) * wv / tot; xs.push(x); }
      const shown = xa + (xb - xa) * expoOut(ru);
      ctx.save(); ctx.beginPath(); ctx.rect(xa - 40, y - 60, shown - xa + 80, 120); ctx.clip();
      ctx.fillStyle = rgba(WARM.line, .6); ctx.fillRect(xa, y, xs[11] - xa, 2);
      ctx.fillStyle = rgba(mixHex(WARM.line, COOL.body, hot), .6 + .4 * hot); ctx.fillRect(xs[11], y - hot, xb - xs[11], 2 + hot * 2);
      xs.forEach((xx, k) => { const yr = 2011 + k, big = k === 0 || k === 15 || k === 11, cool = k >= 11 && hot > .3;
        ctx.fillStyle = rgba(cool ? COOL.body : WARM.line, big ? .9 : .5); ctx.fillRect(xx - 1, y - (big ? 14 : 8), 2, big ? 14 : 8);
        if (big) glowText(ctx, String(yr), xx, y - 22, { size: 24, align: 'center', col: cool ? COOL.text : WARM.text, glow: false }); });
      if (hot > 0) { glowText(ctx, '4 YEARS', (xs[11] + xb) / 2, y + 36, { size: 22, align: 'center', spacing: .16, col: COOL.text, glow: false, a: hot }); glowText(ctx, '15 YEARS', (xa + xs[11]) / 2, y + 36, { size: 22, align: 'center', spacing: .16, col: WARM.text, glow: false, a: ru * (.5 + .5 * (1 - hot)) }); }
      else glowText(ctx, '15 YEARS', (xa + xb) / 2, y + 36, { size: 22, align: 'center', spacing: .16, col: WARM.text, glow: false, a: ru });
      ctx.restore();
    }
    // ladder (between headers and lanes) and the ledges
    const lx = STUDIO.ladder;
    ctx.strokeStyle = mixHex(P.ind2, P.blue1, .35); ctx.lineWidth = 6;
    for (const xx of [lx - 22, lx + 22]) { ctx.beginPath(); ctx.moveTo(xx, STUDIO.floor); ctx.lineTo(xx, laneTop(nL - 1) - 30); ctx.stroke(); }
    ctx.lineWidth = 4; for (let yy = STUDIO.floor - 30; yy > laneTop(nL - 1) - 20; yy -= 34) { ctx.beginPath(); ctx.moveTo(lx - 22, yy); ctx.lineTo(lx + 22, yy); ctx.stroke(); }
    for (let k = 1; k <= 3; k++) { const y = ledgeY(k); ctx.fillStyle = lin(ctx, 0, y, 0, y + 14, [[0, STONE.top], [1, P.night1]]); ctx.beginPath(); ctx.roundRect(lx - 30, y, 210, 13, 3); ctx.fill(); }
    // the desk: a standing desk, monitor with a tiny timeline, keyboard, the lamp (the hero light at level 0)
    ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.fillRect(desk.x0 + 30, desk.top, 12, STUDIO.floor - desk.top); ctx.fillRect(desk.x1 - 42, desk.top, 12, STUDIO.floor - desk.top);
    ctx.fillStyle = lin(ctx, 0, desk.top - 4, 0, desk.top + 16, [[0, mixHex(P.blue1, P.halo2, .25 * lampA)], [1, P.night1]]); ctx.beginPath(); ctx.roundRect(desk.x0, desk.top - 4, desk.x1 - desk.x0, 18, 4); ctx.fill();
    const [mx, my, mw, mh] = STUDIO.monitor;
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(mx, my, mw, mh, 5); ctx.fill(); ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(mx + mw / 2 - 6, my + mh, 12, desk.top - my - mh - 4);
    for (let i = 0; i < 6; i++) { const taken = clamp(s.taken?.[i] ?? 0); ctx.fillStyle = taken > .5 ? rgba(COOL.body, .7) : rgba(P.halo1, .55); ctx.fillRect(mx + 12, my + mh - 18 - i * 17, mw - 24 - (i * 13) % 50, 8); }
    ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(mx + 12 + ((t * .045 + .2) % 1) * (mw - 24), my + 8, 1.5, mh - 16);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.beginPath(); ctx.roundRect(mx + 10, desk.top - 14, 150, 10, 3); ctx.fill();
    const [lpx, lpy] = STUDIO.lamp;
    ctx.strokeStyle = mixHex(P.ind2, P.night1, .3); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(desk.x1 - 20, desk.top - 4); ctx.lineTo(desk.x1 - 6, lpy - 70); ctx.lineTo(lpx + 18, lpy - 18); ctx.stroke();
    ctx.fillStyle = lin(ctx, lpx - 40, 0, lpx + 40, 0, [[0, P.night1], [1, mixHex(P.ind2, P.blue1, .3)]]); ctx.beginPath(); ctx.moveTo(lpx - 44, lpy + 8); ctx.quadraticCurveTo(lpx - 10, lpy - 46, lpx + 30, lpy - 20); ctx.lineTo(lpx + 22, lpy + 12); ctx.closePath(); ctx.fill();
    if (lampA > 0) {   // the light cone onto the desk + the bulb
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, lpy, 0, desk.top + 10, [[0, rgba(P.halo0, .35 * lampA)], [1, rgba(P.halo1, .05 * lampA)]]);
      ctx.beginPath(); ctx.moveTo(lpx - 36, lpy + 6); ctx.lineTo(lpx + 18, lpy + 10); ctx.lineTo(lpx + 120, desk.top); ctx.lineTo(lpx - 210, desk.top); ctx.closePath(); ctx.fill(); ctx.restore();
      halo(ctx, lpx - 10, lpy + 8, 260, .55 * lampA, P.halo1, P.core0); halo(ctx, lpx - 10, lpy + 6, 60, .9 * lampA, P.halo0, P.core0);
    }
    // Jakob
    if (s.jakob !== false) {
      const jh = STUDIO.jakobH, lightSide = pos.x < lpx ? 1 : -1;
      let hands;
      if (pos.mode === 'desk') hands = jakob(ctx, t, pos.x, pos.y, jh, { work: s.work ?? .8, dir: 1, light: lightSide });
      else if (pos.mode === 'walk') hands = jakob(ctx, t, pos.x, pos.y, jh, { walk: pos.ph, dir: 1, light: -1 });
      else if (pos.mode === 'climb') hands = jakob(ctx, t, pos.x, pos.y, jh, { climb: pos.ph, dir: 1, light: -1 });
      else { const cu = clamp(s.conduct ?? 0); hands = jakob(ctx, t, pos.x, pos.y, jh, { conduct: cu, look: .25, dir: 1, light: -1 });
        halo(ctx, pos.x + 20, pos.y - jh * .5, 300, .22 * (s.ledgeLight ?? 1), P.halo1, P.halo0); }   // his own small warm light on the ledge
      out.hands = hands;
    }
  });
  out.jakob = pos;
  return out;
}

// ======================================================================================================================== LOWER THIRD
// JAKOB · CREATOR OF THIS CHANNEL (big at J1, small JAKOB after), bottom left above the subtitles, with a quiet waveform of his voice.
// Rises from its baseline .3 s into the slot, sinks .4 s before the end. o { big, x, y }
export function lowerThird(ctx, t, T, id, o = {}) {
  const c = T.clip && T.clip(id); if (!c) return;
  const u = rise(span(t, c.start + .25, c.start + 1.05)) * (1 - expoIn(span(t, c.end - .5, c.end + .1)));
  if (u <= 0) return;
  const big = o.big ?? id === 'J1', x = o.x ?? 110, y = o.y ?? (big ? 850 : 862);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sz = big ? 46 : 30, nw = measure('JAKOB', sz, false, 600) + sz * .3;
  ctx.fillStyle = rgba(WARM.line, .9 * u); ctx.fillRect(x - 22, y - sz * .95, 3, sz * (big ? 1.75 : 1.05));
  maskLine(ctx, [['JAKOB', 1]], x, y, sz, u, { serif: false, weight: 600, glow: true });
  if (big) maskLine(ctx, [['CREATOR OF THIS CHANNEL', 0]], x, y + 38, 22, rise(span(t, c.start + .55, c.start + 1.35)) * (1 - expoIn(span(t, c.end - .5, c.end + .1))), { serif: false, weight: 600, col: WARM.text, glow: false });
  // the waveform: 26 bars that follow a seeded "voice" envelope while the slot runs
  const wx = x + nw + 22, wy = y - sz * .36, n = 26, on = span(t, c.start, c.start + .3) * (1 - span(t, c.end - .3, c.end));
  for (let k = 0; k < n; k++) {
    const env = .35 + .65 * Math.abs(Math.sin(t * 3.1 + k * .55) * Math.sin(t * 1.7 + k * .23 + 1.1)), hh = (4 + 22 * env * on) * (big ? 1 : .7) * u;
    ctx.fillStyle = rgba(WARM.line, (.35 + .45 * env) * u); ctx.fillRect(wx + k * 7, wy - hh / 2, 3, hh);
  }
  ctx.restore();
}

// ======================================================================================================================== RANK RAIL
// the countdown: ten mini stones (10 … 1, left → right), top left. On "Number N" stone N tips to how far that job falls (FALL);
// No. 1 stays upright and turns to warm light. NOT a clock: no dial, no ring, no ticking digits.
export const RANKS = [
  { n: 10, at: 'Number ten. The first', name: 'THE FIRST JOB AT THE DESK', fall: 1.42 },
  { n: 9, at: 'Number nine', name: 'THE VOICE', fall: 1.42 },
  { n: 8, at: 'Number eight', name: 'THE OFFICE ROUTINE', fall: 1.3 },
  { n: 7, at: 'Number seven', name: 'CREATIVE HANDWORK', fall: 1.42 },
  { n: 6, at: 'Number six', name: 'ANALYSIS · RESEARCH · SOFTWARE', fall: 1.05 },
  { n: 5, at: 'Number five', name: 'TEACHERS', fall: .72 },
  { n: 4, at: 'Number four', name: 'DOCTORS', fall: .62 },
  { n: 3, at: 'Number three. The trades', name: 'THE TRADES', fall: .34 },
  { n: 2, at: 'Number two', name: 'CARE', fall: .12 },
  { n: 1, at: "Number one isn't", name: 'WHERE WE WANT A HUMAN', fall: 0 },
];
export const rankAt = (T, n) => T.G(RANKS.find((r) => r.n === n).at);
// o { x, y, s (scale), a, from: 'Ten kinds of work' (the rail rises on this phrase) }
export function rankRail(ctx, t, T, o = {}) {
  const t0 = T.G(o.from ?? 'Ten kinds of work'), a0 = (o.a ?? 1) * rise(span(t, t0, t0 + .9)); if (a0 <= 0) return;
  const x0 = o.x ?? 96, y0 = o.y ?? 112, s = o.s ?? 1, h = 44 * s, w = 13 * s, gap = 27 * s;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  let cur = null;
  RANKS.forEach((r, k) => {
    const ta = rankAt(T, r.n), u = span(t, ta + .1, ta + 1.1), on = t >= ta;
    if (on) cur = r;
    const ang = r.fall * (u * u * (3 - 2 * u)), x = x0 + k * gap, gold = r.n === 1 ? smooth(span(t, ta, ta + 1.4)) : 0;
    const e = rise(span(t, t0 + k * .05, t0 + k * .05 + .7)) * a0;
    ctx.save(); ctx.translate(0, (1 - e) * 16); ctx.globalAlpha = e;
    stone(ctx, t, x, y0, h, { w, d: 4 * s, fall: ang, gold, rim: .6 });
    ctx.restore();
  });
  if (cur) {   // the current number beside the rail, small serif: No. 9
    const ta = rankAt(T, cur.n), u = rise(span(t, ta + .3, ta + 1.1)) * a0;
    maskLine(ctx, [[`No. ${cur.n}`, cur.n === 1 ? 1 : 0]], x0 + 10 * gap + 14 * s, y0 - 6 * s, 40 * s, u, {});
  }
  ctx.restore();
}
// the big title of a rank inside a scene: "No. 9" (serif) and the job line under it (Inter caps). u 0..1 (rise), the caller sinks it.
export function rankTitle(ctx, t, x, y, n, sub, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [['No. ', 0], [String(n), n === 1 ? 1 : .3]], x, y, o.size ?? 150, u, { align: o.align });
  if (sub) maskLine(ctx, [[sub, 0]], x + (o.align === 'center' ? 0 : 8), y + 62, 30, rise(span(u, .25, 1)), { serif: false, weight: 600, col: WARM.text, glow: false, align: o.align });
  ctx.restore();
}

// ======================================================================================================================== EXPLAINER BLOCKS
// light lines on a quiet axis. o { x, y, w, h, xr: [a, b], yr: [a, b], series: [{ data: [[x, y]…], col: 'warm'|'cool', u, w, label, labelU }],
//   base: y value of a dashed reference line, xTicks: [[v, text]], a }  → { map(x, y) → [px, py], heads: [[x, y]] }
export function chartLines(ctx, t, o) {
  const [x, y, w, h] = [o.x, o.y, o.w, o.h], [xa, xb] = o.xr, [ya, yb] = o.yr, a = o.a ?? 1;
  const map = (px, py) => [x + (px - xa) / (xb - xa) * w, y + h - (py - ya) / (yb - ya) * h];
  ctx.save(); ctx.globalAlpha *= a;
  const au = expoOut(clamp(o.axisU ?? 1));
  ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w * au, y + h); ctx.stroke();
  if (o.base != null) { const [, by] = map(xa, o.base); ctx.setLineDash([3, 10]); ctx.strokeStyle = rgba(P.cream, .3); ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x + w * au, by); ctx.stroke(); ctx.setLineDash([]); }
  for (const [v, s] of o.xTicks || []) glowText(ctx, s, map(v, ya)[0], y + h + 40, { size: 24, align: 'center', glow: false, col: WARM.text, spacing: .1, a: au });
  const heads = [];
  for (const S of o.series) {
    const pts = E.catmull(S.data.map((p) => [...map(p[0], p[1]), S.w ?? 5]), 10), u = clamp(S.u ?? 1);
    if (u <= 0) { heads.push(null); continue; }
    let head;
    if (S.col === 'cool') {
      const n = Math.max(2, Math.floor(pts.length * u)); ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = rgba(COOL.halo, .25); ctx.lineWidth = (S.w ?? 5) * 4; ctx.beginPath(); pts.slice(0, n).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      ctx.strokeStyle = COOL.body; ctx.lineWidth = S.w ?? 5; ctx.stroke(); ctx.restore(); head = pts[n - 1];
      if (u < 1) agent(ctx, t, head[0], head[1], 7, { ring: 0 });
    } else head = E.trail(ctx, pts, u, { w: S.w ?? 5, spark: u < 1 });
    heads.push(head);
    if (S.label && head) glowText(ctx, S.label, head[0] + 18, head[1] + 9 + (S.labelDy ?? 0), { size: 26, spacing: .1, col: S.col === 'cool' ? COOL.text : WARM.text, glow: false, a: rise(clamp(S.labelU ?? span(u, .85, 1))) });
  }
  ctx.restore();
  return { map, heads };
}
// a lying stone as a bar (length grows with u): (x, y) = left end, centre line y. o { col 'cool'|'warm'|'stone', u, a, label (left), value (right) }
export function slab(ctx, t, x, y, len, th, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)), L = Math.max(2, len * u), a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const d = th * .5, top = new Path2D(); top.moveTo(x, y - th / 2); top.lineTo(x + L, y - th / 2); top.lineTo(x + L + d * .6, y - th / 2 - d * .5); top.lineTo(x + d * .6, y - th / 2 - d * .5); top.closePath();
  const end = new Path2D(); end.moveTo(x + L, y - th / 2); end.lineTo(x + L + d * .6, y - th / 2 - d * .5); end.lineTo(x + L + d * .6, y + th / 2 - d * .5); end.lineTo(x + L, y + th / 2); end.closePath();
  const col = o.col ?? 'stone';
  const face = col === 'cool' ? [mixHex(COOL.body, P.cream, .2), COOL.deep] : col === 'warm' ? [P.halo0, P.shade0] : [STONE.face, P.night1];
  if (col === 'warm') halo(ctx, x + L * .5, y, Math.max(L * .6, th * 2), .18, P.halo1, P.halo0);
  if (col === 'cool') halo(ctx, x + L, y, th * 2.2, .2, COOL.halo, COOL.body);
  ctx.fillStyle = col === 'cool' ? mixHex(COOL.body, P.cream, .5) : col === 'warm' ? P.core1 : STONE.top; ctx.fill(top);
  ctx.fillStyle = col === 'cool' ? COOL.deep : col === 'warm' ? P.shade0 : P.night0; ctx.fill(end);
  ctx.fillStyle = lin(ctx, 0, y - th / 2, 0, y + th / 2, [[0, face[0]], [1, face[1]]]); ctx.fillRect(x, y - th / 2, L, th);
  ctx.restore();
  if (o.label) glowText(ctx, o.label, x - 22, y + 9, { size: o.size ?? 24, align: 'right', spacing: .08, glow: false, col: col === 'warm' ? WARM.text : col === 'cool' ? COOL.text : P.cream, a: a * rise(span(o.u ?? 1, 0, .4)) });
  if (o.value) glowText(ctx, o.value, x + L + d + 16, y + 10, { size: o.vsize ?? 28, serif: true, col: P.cream, a: a * rise(span(o.u ?? 1, .6, 1)) });
}
// rows of slabs. o { x, y, w (max length), pitch, th, rows: [{ label, v (0..1), col, value }], u, stagger }
export function slabBars(ctx, t, o) {
  o.rows.forEach((r, k) => slab(ctx, t, o.x, o.y + k * (o.pitch ?? 64), (o.w ?? 800) * r.v, o.th ?? 30, { col: r.col, label: r.label, value: r.value, u: span(o.u ?? 1, k * (o.stagger ?? .08), k * (o.stagger ?? .08) + .6), a: r.a ?? 1, size: o.size }));
}
// a grid / line of mini stones: o { x, y, h, n, cols, gap, could: [0..1 per stone] (cool outline: a machine COULD do it), fall: [angle], gold: [0..1], u }
export function stoneGrid(ctx, t, o) {
  const n = o.n ?? 10, cols = o.cols ?? n, h = o.h ?? 120, w = h * .3, gx = o.gap ?? w * 1.9, gy = h * 1.35;
  for (let k = 0; k < n; k++) {
    const cx = o.x + (k % cols) * gx, cy = o.y + Math.floor(k / cols) * gy, e = rise(span(o.u ?? 1, k / n * .5, k / n * .5 + .5)); if (e <= 0) continue;
    const could = clamp(o.could?.[k] ?? 0);
    if (could > 0) { ctx.save(); ctx.strokeStyle = rgba(COOL.body, .85 * could); ctx.lineWidth = 3; ctx.setLineDash([7, 6]); ctx.lineDashOffset = -t * 8; ctx.beginPath(); ctx.roundRect(cx - 8, cy - h - 8, w + 16, h + 16, 6); ctx.stroke(); ctx.restore(); halo(ctx, cx + w / 2, cy - h / 2, h * .8, .1 * could, COOL.halo, COOL.body); }
    ctx.save(); ctx.translate(0, (1 - e) * 20); ctx.globalAlpha = e;
    stone(ctx, t, cx, cy, h, { w, d: h * .1, fall: o.fall?.[k] ?? 0, gold: o.gold?.[k] ?? 0, glyph: o.glyph, glyphA: .8 });
    ctx.restore();
  }
}
// n tiles in a row (days): o { x, y, size, n, gap, u, col: 'warm'|'cool', label }
export function dayTiles(ctx, t, o) {
  const n = o.n, s = o.size ?? 48, g = o.gap ?? 10;
  for (let k = 0; k < n; k++) {
    const e = expoOut(span(o.u ?? 1, k / n * .7, k / n * .7 + .3)); if (e <= 0) continue;
    const x = o.x + k * (s + g), c = o.col === 'cool';
    ctx.save(); ctx.globalAlpha = e; ctx.translate(x + s / 2, o.y + s / 2); ctx.scale(e, e);
    ctx.fillStyle = lin(ctx, 0, -s / 2, 0, s / 2, c ? [[0, mixHex(COOL.body, P.cream, .3)], [1, COOL.deep]] : [[0, P.halo0], [1, P.shade0]]); ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, 6); ctx.fill();
    ctx.restore();
  }
  if (o.label) glowText(ctx, o.label, o.x, o.y + s + 44, { size: 26, spacing: .12, glow: false, col: o.col === 'cool' ? COOL.text : WARM.text, a: rise(span(o.u ?? 1, .5, 1)) });
}
// a thin light bracket over a span with a label: (x0 … x1) at y, opening downward; u grows it from the middle
export function bracket(ctx, x0, x1, y, u, text, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const m = (x0 + x1) / 2, hw = (x1 - x0) / 2 * expoOut(u), col = o.col === 'cool' ? COOL.line : WARM.line;
  ctx.save(); ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(m - hw, y + 16); ctx.lineTo(m - hw, y); ctx.lineTo(m + hw, y); ctx.lineTo(m + hw, y + 16); ctx.stroke(); ctx.restore();
  if (text) maskLine(ctx, [[text, o.warm ?? 0]], m, y - 18, o.size ?? 30, rise(span(u, .3, 1)), { serif: false, weight: 600, align: 'center', col: o.col === 'cool' ? COOL.text : P.cream, glow: false });
}
// a pinned label: a line from the anchor up-right, then TEXT / sub (wipe in from below). u 0..1
export function label(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 50, dy = o.dy ?? -50, x1 = x + dx, y1 = y + dy, col = o.col === 'cool' ? COOL : WARM;
  rule(ctx, x, y, x1, y1, smooth(clamp(u * 1.6)), { w: 2 });
  maskLine(ctx, [[l1, o.warm ?? 0]], x1 + (dx < 0 ? -measure(l1, o.size ?? 26, false) - 6 : 6), y1 - 10, o.size ?? 26, u, { serif: false, weight: 600, col: o.col === 'cool' ? COOL.text : P.cream, glow: false });
  if (l2) maskLine(ctx, [[l2, 0]], x1 + (dx < 0 ? -measure(l2, (o.size ?? 26) * .72, false) - 6 : 6), y1 + 24, (o.size ?? 26) * .72, rise(span(u, .2, 1)), { serif: false, weight: 600, col: col.text, glow: false });
}
// a small source line (bottom left, above the subtitles), rises and sinks
export function source(ctx, t, t0, t1, s, o = {}) {
  const u = rise(span(t, t0, t0 + .7)) * (1 - expoIn(span(t, t1 - .5, t1))); if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [[s.toUpperCase(), 0]], o.x ?? 110, o.y ?? 880, 20, u, { serif: false, weight: 600, col: P.halo2, glow: false }); ctx.restore();
}

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The frame grows out of a thing in the scene (o.from = [cx, cy, r] circle, or { x, y, w, h } rectangle: a stone face, a monitor) and
// shrinks back after the clip. Footage: <F25CLIPS or ROOT/clips>/<id>/f00001.jpg… (30 fps); metadata (offset, fit, name, role, year)
// from audio/clips.json when the audio agent writes it. Until then a placeholder (never ship it).
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
// lower-third lines from zitatkarten.md (fact check 10.11.): name · role/source · year; len = clip length (clips.json)
const CLIPS0 = {
  K1: { name: 'Erik Brynjolfsson', role: 'Stanford Digital Economy Lab / Hoover Institution', year: 'Mar 2026', len: 13.2 },
  K2: { name: 'Geoffrey Hinton', role: 'Nobel Prize in Physics 2024 / The Diary of a CEO', year: 'June 2025', len: 9.7 },
  K3: { name: 'Bill Gates', role: 'Original footage, date to check', year: 'Aug 2026', len: 12 },   // open: may become quote card QUOTES.gates
};
// metadata written by the audio/clip agent: <ROOT>clips.json ({ clips: [{ id, offset?, fit? … }] }) or audio/clips.json (keyed by id).
// Only offset and fit are taken from it; the on-screen lines stay the checked ones above.
const CLIPS_JSON = [process.env.F25CLIPSJSON, ROOT + 'clips.json', ROOT + 'audio/clips.json'].find((f) => f && fs.existsSync(f));
const RAWMETA = CLIPS_JSON ? JSON.parse(fs.readFileSync(CLIPS_JSON, 'utf8')) : {};
export const CLIPMETA = Array.isArray(RAWMETA.clips) ? Object.fromEntries(RAWMETA.clips.map((c) => [c.id, c])) : RAWMETA;
export const CLIPS = Object.fromEntries(Object.entries(CLIPS0).map(([id, c]) => { const m = CLIPMETA[id] || {}; return [id, { ...c, ...(m.fit ? { fit: m.fit } : {}) }]; }));
const CLIPDIR = (process.env.F25CLIPS || ROOT + 'clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; const off = (CLIPMETA[id] || {}).offset || 0; return Math.max(1, Math.min(n, Math.floor((t - win.start - off) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
const CLIP_LEAD = 7;
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    const win = clipWin(T, id); if (!win || t < win.start - CLIP_LEAD || t > win.end + .8) continue;   // the plate grows over the lead-in sentence (3.4-5.8 s before the slot) and shows frame 1 meanwhile
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
function clipFrameAt(id, t, win) { const k = frameAt(id, t, win); return k ? frameCache.get(framePath(id, k)) || null : null; }
export function clipWin(T, id) { const c = T.clip && T.clip(id); return c ? { start: c.start, end: c.end } : null; }
// o: { from, morph 0..1 (0 = the source shape, 1 = CLIP_RECT), dark 0..1, credits (false = none), label 0..1 }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], m = sineIO(clamp(o.morph ?? 1)), dark = clamp(o.dark ?? 0);
  const f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const fr0 = Array.isArray(f) ? { cx: f[0], cy: f[1], w: f[2] * 2, h: f[2] * 2, r: f[2] } : { cx: f.x + f.w / 2, cy: f.y + f.h / 2, w: f.w, h: f.h, r: Math.min(8, f.w / 2) };
  const cx = lerp(fr0.cx, R.x + R.w / 2, m), cy = lerp(fr0.cy, R.y + R.h / 2, m), w = lerp(fr0.w, R.w, m), h = lerp(fr0.h, R.h, m), rr = lerp(fr0.r, 14, m);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const fr = clipFrameAt(id, t, win);
  if (fr) { const s = (info.fit === 'contain' ? Math.min : Math.max)(R.w / fr.width, R.h / fr.height) * (w / R.w), dw = fr.width * s, dh = fr.height * s; ctx.globalAlpha = 1 - dark; ctx.drawImage(fr, cx - dw / 2, cy - dh / 2, dw, dh); ctx.globalAlpha = 1; }
  else {   // PLACEHOLDER (no footage yet): soft light, slow scan band, the slot id and a progress line. Never ship this.
    const u = clamp((t - win.start) / (win.end - win.start));
    ctx.fillStyle = rad(ctx, cx, cy - h * .05, w * .7, [[0, rgba(P.blue0, .5 * (1 - dark))], [1, rgba(P.night0, 0)]]); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    const by = cy - h / 2 + ((t * .18) % 1) * h; ctx.fillStyle = rgba(P.cream, .04 * (1 - dark)); ctx.fillRect(cx - w / 2, by - 40, w, 80);
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {
    const by = R.y - 26;
    const nw = maskLine(ctx, [[info.name, 0]], R.x, by, 40, rise(lu), { glow: true });
    maskLine(ctx, [[`${info.role.toUpperCase()} · ${info.year}`, 0]], R.x + nw.w + 22, by - 2, 20, rise(lu), { serif: false, col: P.halo2, glow: false });
    maskLine(ctx, [['ORIGINAL FOOTAGE', 0]], R.x + R.w - measure('ORIGINAL FOOTAGE', 20, false), by - 2, 20, rise(lu), { serif: false, col: P.halo0, glow: false });
  }
  ctx.restore();
  return { cx, cy, w, h };
}
// on-screen texts, wording from zitatkarten.md (fact check 10.11.2026). quoted: true = verbatim (curly quotes), false = paraphrase (no quotes)
export const QUOTES = {
  amodei: { lines: ['A.I. could wipe out half of all entry-level white-collar jobs', 'in the next one to five years.'], quoted: false,
    attr: 'DARIO AMODEI · CEO, ANTHROPIC · TO AXIOS, MAY 2025', gold: 'half of all entry-level' },
  hinton: { lines: ['People should stop training radiologists now.'], quoted: true, attr: 'GEOFFREY HINTON · TORONTO, 2016', gold: 'stop training radiologists' },
  gates: { lines: ['Even under the best circumstances, the transition to this new AI era', 'will be one of the most turbulent times in human history.'], quoted: true,
    attr: 'BILL GATES · GATESNOTES, AUG 2026', gold: 'most turbulent times' },   // only if K3 is dropped
};
export const SOURCES = {   // source lines (screen bottom left, F.source), in film order
  stanford: 'STANFORD DIGITAL ECONOMY LAB · AUG 2026',
  microsoft: 'MICROSOFT RESEARCH · “WORKING WITH AI” · 2025',
  anthropic: 'ANTHROPIC · LABOR MARKET IMPACTS OF AI · MAR 2026',
  challenger: 'CHALLENGER, GRAY & CHRISTMAS · JOB CUTS CITING AI: 121,401 (JAN–OCT 2026) VS. 54,836 (ALL OF 2025)',
  hinton: 'GEOFFREY HINTON · TORONTO, 2016',
  radiology: 'RECORD: 1,241 RADIOLOGY RESIDENCY SPOTS · US MATCH 2026',
  kasparov: 'DEEP BLUE BEATS KASPAROV · 1997',
  chess: '≈10 MILLION DAILY ACTIVE USERS · CHESS.COM, 2026 (COMPANY FIGURE)',
};
// the hook's question line (and its callbacks): big serif, rises on t0, sinks from t1
export function questionLine(ctx, t, t0, t1, o = {}) {
  const u = rise(span(t, t0 - .15, t0 + .7)) * (t1 != null ? 1 - expoIn(span(t, t1, t1 + .5)) : 1);
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [[o.text ?? '', o.warm ?? 0]], o.x ?? 960, o.y ?? 150, o.size ?? 64, u, { align: o.align ?? 'center' });
  ctx.restore();
}
// the title of the film as on thumbnail A: two lines, Inter 600 caps, cream with a warm glow, slightly condensed. u rises, out sinks.
export function title(ctx, t, x, y, u, o = {}) {
  if (u <= 0) return;
  const size = o.size ?? 172, lines = o.lines ?? ['THE LAST', 'HUMAN JOB'];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(.9, 1.08);
  lines.forEach((ln, i) => {
    const ui = rise(span(u, i * .18, .82 + i * .18)) * (o.out != null ? 1 - expoIn(clamp(o.out * (1 + .12 * (lines.length - 1)) - i * .12)) : 1);
    if (ui > 0) maskLine(ctx, [[ln, 0]], 0, i * size * .98, size, ui, { serif: false, weight: 600, col: P.core0, glow: true });
  });
  ctx.restore();
}

// ======================================================================================================================== CAMERA PATH
// camPath(t, K): a camera that glides THROUGH its keys [[t, cam], …] (monotone cubic in x, y and log distance to F0), instead of
// stopping at each key like E.camAt. The first and last keys are arrivals (speed eases to 0 there). Use E.camAt for the single
// expo-in/expo-out dives into a light (the flood doors), camPath for everything else.
export function camPath(t, K) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(F0 - c.z)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: F0 - Math.exp(out[2]) });
}
// a cool light path (the machine's trail) along screen/design points, drawn from fraction u0 to u1 of its length
export function coolPath(ctx, pts, u0, u1, w = 5, a = 1) {
  if (u1 <= u0 || a <= 0) return null;
  const n = pts.length, i0 = Math.floor(clamp(u0) * (n - 1)), i1 = Math.max(i0 + 1, Math.floor(clamp(u1) * (n - 1)));
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha *= a; ctx.beginPath();
  for (let k = i0; k <= i1; k++) (k === i0 ? ctx.moveTo(pts[k][0], pts[k][1]) : ctx.lineTo(pts[k][0], pts[k][1]));
  ctx.strokeStyle = rgba(COOL.halo, .25); ctx.lineWidth = w * 4; ctx.stroke(); ctx.strokeStyle = COOL.body; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
  return pts[i1];
}
