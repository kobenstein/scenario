// Film 24 · "AI Can Now Hear What Animals Feel" · shared kit (owned by the lead; builders import, never edit — wishes go in the report).
// Base: lib/f10_editorial.mjs (palette P, easing, du/person, halo, glowText, the 2.5D card stage, finish) + lib/f16_kit.mjs (rise,
// maskLine, measure, rule, quote, stamp, trailSpan). This file adds the ONE world of Film 24 (docs/MOTION.md §2) and its objects:
//
//   THE NIGHT MAP (the guiding image, Jakob 9.11.): a flat night world map. Land is indigo with a faint stipple, the sea is night.
//   Every place where someone listens is a PIN whose head is a round MEDALLION with the animal inside: gold = the Earth Species
//   Project (ESP, the main character), cream = other teams, plain cream dot = a place without a team. Stations change by ZOOMING
//   OUT to the map and ZOOMING IN to the next pin: the medallion opens like an iris into the habitat scene (and closes back).
//   THE HABITATS (scenes): flat 2.5D cards (E.cam3 / E.card) — a barn at night, a savanna, the sea — with animals as living flat
//   silhouettes (breath, blink, ears, tails). ONE warm light per scene.
//   THE EXPLAINERS (60–70 %): night field, graphics made of calls: WAVES (call waveforms), the LISTENER (the gold ear-trumpet
//   = ESP's A.I.; cream = other teams' A.I.), INDEX CARDS (animal + name), the TABLET (seven slots round an empty MEANING),
//   the TRANSLATION BAR ("[translating…]", empty until the scenario), and the 2030 STRIP (top right, a call line running to 2030).
//
// API (all screen space unless a card camera is used; t in seconds; u = 0..1 growth):
//   night(ctx)                               the night ground (full frame)
//   pig / elephant / spermWhale / humpback / dolphin / dog / crow / finch / frog (ctx, t, x, y, h, o)  living silhouettes,
//       feet (or the waterline centre) at (x, y), h = shoulder height (whales: body depth). Common o: { dir ±1, light ±1 (screen side
//       of the light), warm 0..1 (warm light on the lit flank), dark 0..1 (in shadow), seed, a }. Each returns anchor points
//       (e.g. { mouth, eye, head, top }) in screen space. animal(ctx, kind, …) dispatches. icon(ctx, kind, x, y, r, o) = flat mini.
//   CALL_KINDS, wave(ctx, t, x, y, w, h, kind, o)  a call as a waveform of bars (centre line y). o: { u (drawn 0→1), col, a, seed,
//       gap: [a, b] (a hidden piece, greyed), fill (gap refilled 0..1), live (shimmer), head (glow at the drawing head) }
//   idCard(ctx, t, x, y, o)                  the index card (top-left at x, y): o { name, sub, animal, u, col, feel (−1..1),
//       feelU, feelWord, q (a ? in the feel slot), tick } → { w, h }
//   listener(ctx, t, x, y, s, o)             the A.I. as an ear-trumpet: bell (calls go in) left, tip (cards come out) right.
//       o { col: 'gold' | 'cream', u (rises), drink 0..1, blind 0..1 (a band over the bell: it cannot see), dir ±1 } → { bell, tip }
//   transBar(ctx, t, x, y, o)                the translation bar centred at (x, y): o { u, text, typed 0..1, w, stamp ('SCENARIO') }
//   MAP: mapView(lon, lat, z) · mapXY(v, lon, lat) → [x, y] · flight(A, B, u) (smooth zoom-out-pan-in, van Wijk) · map(ctx, t, v, o)
//       o { calls 0..1 (every species: the whole map alive), dim, land } · PINS + pins(ctx, t, T, v, o) (phrase-driven, labels)
//       pin(ctx, t, x, y, o) one pin · iris(ctx, cx, cy, r, fn, o) a scene seen through a medallion (r ≥ RF covers the frame)
//   strip(ctx, t, T, o)                      the 2030 strip, docked top right from "by twenty thirty" (phrase-driven text);
//       o { big 0..1 (morph to the big form at o.at, width o.w), from [x, y] (first flight), hide }
//   TABLET + tablet(ctx, t, T, x, y, s, o)   the meaning tablet: seven slots engrave on their phrases, the middle stays empty
//   barn(ctx, c, t, o) + BARN                the barn at night (c = E.cam3 camera): back wall, the hanging lamp (the hero light),
//       straw floor, fence; pigs and you are drawn by the caller on the F0 card (BARN holds their places)
//   CLIP_RECT, CLIPS, clipWin, prepareClipFrames, clipPlate   ORIGINAL FOOTAGE in a frame that grows out of a medallion
//   questionLine, label (a pinned two-line label), tick (✓ drawn as a light stroke)
// Rules as everywhere: no canvas, pattern or gradient cache per frame; seeded randomness only; nothing fades in from nowhere.
import { Path2D, PathOp, loadImage } from '@napi-rs/canvas';
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as K16 from './f16_kit.mjs';
import { LAND } from './f24_land.mjs';
import { ROOT } from './kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift } = E;
export const { rise, quote, rule, trailSpan, maskLine, measure, stamp, blink } = K16;
export const { du, person, cam3, card, camAt, camDrift, aim, project, F0 } = E;
export { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, rad, lin, prng, drift };

export const PRINT24 = { grain: 14, floor: 4, vig: .5 };
// ONE accent: gold = the Earth Species Project (pin, name, its A.I.) and warm light; cream = other teams and text; yellow = only you
export const GOLD = { core: P.core1, body: mixHex(P.coat, P.halo0, .5), deep: P.shade0, line: mixHex(P.coat, P.halo1, .4) };   // a warmer gold than the halo: ESP and 2030 only
export const CREAM = { core: P.cream, body: mixHex(P.cream, P.halo2, .35), deep: mixHex(P.halo2, P.blue1, .55), line: mixHex(P.cream, P.blue1, .25) };
export const colOf = (c) => (c === 'gold' || c === 'esp' ? GOLD : CREAM);
export const bump = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const TAU = Math.PI * 2;
export function night(ctx) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H); ctx.restore(); }

// ======================================================================================================================== painting
// fill a silhouette with flat light: a horizontal gradient shade → base → lit toward the light, a darker belly, a rim on the lit edge
function rimFill(ctx, path, col, dx, dy) { const sh = new Path2D(); sh.addPath(path, { a: 1, b: 0, c: 0, d: 1, e: dx, f: dy }); ctx.fillStyle = col; ctx.fill(new Path2D(path).op(sh, PathOp.Difference)); }
function tones(base, o) {
  const warm = o.warm ?? .5, dark = o.dark ?? 0;
  const b = mixHex(base, P.night1, dark * .55);
  return { base: b, lit: mixHex(b, mixHex(P.halo1, P.core1, .3), .18 + .32 * warm * (1 - dark)), shade: mixHex(b, P.night0, .55), rim: rgba(mixHex(P.halo0, P.core1, .4), (.55 + .4 * warm) * (1 - .7 * dark)) };
}
function paint(ctx, path, x0, x1, y0, y1, C, L, o = {}) {
  const a = L >= 0 ? [x0, x1] : [x1, x0];
  ctx.fillStyle = lin(ctx, a[0], 0, a[1], 0, [[0, C.shade], [.45, C.base], [1, C.lit]]); ctx.fill(path);
  ctx.save(); ctx.clip(path);
  ctx.fillStyle = lin(ctx, 0, lerp(y0, y1, .45), 0, y1, [[0, rgba(C.shade, 0)], [1, rgba(C.shade, o.belly ?? .55)]]); ctx.fillRect(Math.min(x0, x1) - 1, y0 - 1, Math.abs(x1 - x0) + 2, y1 - y0 + 2);
  ctx.restore();
  if (o.rim !== false) rimFill(ctx, path, C.rim, -(L >= 0 ? 1 : -1) * (o.rw ?? .018), o.rh ?? .014);
}
// local frame: feet at (x, y), units of h, facing dir (+1 right)
function frame(ctx, x, y, h, dir, fn) { ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h); const r = fn(); ctx.restore(); return r; }
const toScr = (x, y, h, dir) => (u, v) => [x + u * h * dir, y + v * h];
// a seeded blink: 0 open … 1 closed, about every 3.5–5.5 s for 0.16 s
export function blinkAt(t, seed = 0) { const per = 3.6 + (seed * 1.37) % 2, ph = ((t + seed * .71) % per + per) % per; return ph < .16 ? Math.sin(Math.PI * ph / .16) : 0; }
function eye(ctx, x, y, r, t, o) {
  const b = o.blink ?? blinkAt(t, o.seed ?? 0);
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(x, y, r * 1.25, Math.max(.0015, r * (1 - .92 * b)), o.tilt ?? 0, 0, TAU); ctx.fill();
  if (b < .5) { ctx.fillStyle = rgba(P.core1, .75 * (1 - 2 * b) * (o.shine ?? 1)); ctx.beginPath(); ctx.arc(x + r * .35, y - r * .3, r * .32, 0, TAU); ctx.fill(); }
}

// ======================================================================================================================== THE PIG
// o: { dir, light, warm, dark, seed, breath (rate), head (−1 down … 0 … 1 up: lifts the head, rad-ish), open 0..1 (mouth: grunt /
//      squeal), snout 0..1 (snout twitch), ear (extra flick), root 0..1 (head down into the straw), tail, shift (weight sway) }
// returns { mouth, snout, eye, head, top, back } in screen space
export function pig(ctx, t, x, y, h, o = {}) {
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, sd = o.seed ?? 0, C = tones(o.base ?? mixHex('#c09088', P.blue1, .38), o);
  const br = Math.sin(t * (o.breath ?? 1.25) * TAU / 3 + sd), sway = (o.shift ?? 1) * .012 * Math.sin(t * .37 + sd);
  const lift = (o.head ?? 0) * .32 - (o.root ?? 0) * .3 + .025 * Math.sin(t * .53 + sd * 2), op = clamp(o.open ?? 0);
  const ear = .18 * Math.max(0, Math.sin(t * .9 + sd * 3)) ** 8 + (o.ear ?? 0), sn = (o.snout ?? 0) + .25 * Math.max(0, Math.sin(t * 2.3 + sd)) ** 12;
  const SQ = .86, S = (u, v) => [x + u * h * dir * SQ, y + v * h], pv = [.66, -.66], rot = -lift, cr = Math.cos(rot), sr = Math.sin(rot);
  const hp = (u, v) => [pv[0] + (u - pv[0]) * cr - (v - pv[1]) * sr, pv[1] + (u - pv[0]) * sr + (v - pv[1]) * cr];
  const X0 = -1.16, X1 = 1.4;   // one gradient over the whole animal: body and head share their light (no seam at the neck)
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  frame(ctx, x, y, h, dir, () => {
    ctx.scale(SQ, 1);   // a compact barrel, not a sausage
    ctx.translate(sway, 0);
    ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(-.05 - L * .12, 0, 1.12, .045, 0, 0, TAU); ctx.fill();   // contact shadow
    const legCol = (k) => lin(ctx, 0, -.5, 0, 0, [[0, mixHex(C.shade, C.base, .55 * k)], [1, mixHex(C.shade, C.base, .35 * k)]]);
    const hoof = (x0, w) => { ctx.fillStyle = mixHex(P.night0, P.shade0, .2); ctx.beginPath(); ctx.moveTo(x0 - w * .42, -.055); ctx.lineTo(x0 + w * .46, -.055); ctx.lineTo(x0 + w * .55, 0); ctx.lineTo(x0 - w * .5, 0); ctx.closePath(); ctx.fill(); };
    const fleg = (x0, k, step) => {   // front leg: straight, a soft knee, narrow at the pastern
      const p = new Path2D(); p.moveTo(x0 - .085, -.5); p.bezierCurveTo(x0 - .09, -.32, x0 - .07 + step, -.2, x0 - .055 + step, -.06); p.lineTo(x0 + .06 + step, -.06);
      p.bezierCurveTo(x0 + .07 + step, -.2, x0 + .085, -.3, x0 + .09, -.5); p.closePath(); ctx.fillStyle = legCol(k); ctx.fill(p); hoof(x0 + step, .13);
    };
    const hleg = (x0, k) => {   // hind leg: a round ham tapering to the hock (angled back), then the hoof
      const p = new Path2D(); p.moveTo(x0 - .16, -.55); p.bezierCurveTo(x0 - .17, -.36, x0 - .1, -.24, x0 - .07, -.17); p.bezierCurveTo(x0 - .06, -.12, x0 - .05, -.08, x0 - .045, -.06);
      p.lineTo(x0 + .065, -.06); p.bezierCurveTo(x0 + .06, -.12, x0 + .05, -.2, x0 + .07, -.28); p.bezierCurveTo(x0 + .11, -.38, x0 + .14, -.46, x0 + .13, -.56); p.closePath();
      ctx.fillStyle = legCol(k); ctx.fill(p); hoof(x0, .12);
    };
    fleg(.58, .3, 0); hleg(-.52, .3);                         // far legs (darker, behind)
    fleg(.44, 1, .012 * Math.sin(t * .37 + sd)); hleg(-.7, 1);  // near legs (the body overlaps their tops)
    ctx.save(); ctx.translate(0, -.34); ctx.scale(1, 1 + .014 * br); ctx.translate(0, .34);
    const b = new Path2D();
    b.moveTo(.6, -.96); b.bezierCurveTo(.2, -1.05, -.42, -1.05, -.8, -.97); b.bezierCurveTo(-1.1, -.91, -1.17, -.62, -1.04, -.44);
    b.bezierCurveTo(-.96, -.33, -.82, -.29, -.66, -.3); b.bezierCurveTo(-.25, -.24 + .012 * br, .18, -.24 + .012 * br, .48, -.3);
    b.bezierCurveTo(.64, -.33, .74, -.42, .77, -.56); b.bezierCurveTo(.79, -.74, .73, -.9, .6, -.96); b.closePath();
    paint(ctx, b, X0, X1, -1.05, -.24, C, L, { belly: .55 });
    ctx.save(); ctx.clip(b); ctx.fillStyle = rgba(C.lit, .14); ctx.beginPath(); ctx.ellipse(-.72, -.72, .3, .25, 0, 0, TAU); ctx.fill(); ctx.restore();   // the ham catches light
    const tw = .2 * Math.sin(t * 2.1 + sd) * (o.tail ?? 1);   // the tail: a small curl at the rump
    ctx.strokeStyle = mixHex(C.base, C.lit, .3); ctx.lineWidth = .03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-1.1, -.85);
    ctx.bezierCurveTo(-1.2, -.87 + tw * .2, -1.22, -.99 + tw * .2, -1.16, -1.01); ctx.bezierCurveTo(-1.1, -1.02, -1.09, -.94, -1.15, -.93); ctx.stroke();
    ctx.restore();
    // the head, turned about the neck (lift); the lower jaw drops with o.open
    ctx.save(); ctx.translate(pv[0], pv[1]); ctx.rotate(rot); ctx.translate(-pv[0], -pv[1]);
    const jo = op * .08;
    if (op > .02) {   // open mouth: a dark wedge, the jaw below it
      ctx.fillStyle = mixHex(P.night0, P.shade0, .3); ctx.beginPath(); ctx.moveTo(1.31, -.47); ctx.quadraticCurveTo(1.15, -.44 + jo * 1.2, .96, -.43); ctx.lineTo(1.12, -.47); ctx.closePath(); ctx.fill();
      const j = new Path2D(); j.moveTo(1.28, -.455 + jo * .7); j.bezierCurveTo(1.2, -.4 + jo, 1.05, -.37 + jo * .9, .9, -.39 + jo * .4); j.lineTo(.92, -.45); j.bezierCurveTo(1.05, -.46, 1.18, -.47 + jo * .6, 1.28, -.455 + jo * .7); j.closePath();
      ctx.fillStyle = mixHex(C.shade, C.base, .6); ctx.fill(j);
    }
    const hd = new Path2D();
    hd.moveTo(.5, -.97); hd.bezierCurveTo(.72, -1.0, .9, -.96, 1.02, -.86); hd.bezierCurveTo(1.12, -.78, 1.22, -.69, 1.31, -.64 - sn * .01);
    hd.bezierCurveTo(1.37, -.61, 1.39, -.49, 1.34, -.47); hd.bezierCurveTo(1.27, -.45, 1.2, -.46, 1.13, -.46);
    hd.bezierCurveTo(1.0, -.43, .86, -.37, .72, -.38); hd.bezierCurveTo(.6, -.42, .5, -.6, .5, -.97); hd.closePath();
    paint(ctx, hd, X0, X1, -1.05, -.24, C, L, { belly: .4, rw: .016 });
    // the snout disc (a lighter oval) with nostrils; it twitches
    ctx.save(); ctx.translate(1.345 + sn * .008, -.555); ctx.scale(1, 1 + .06 * sn);
    ctx.fillStyle = mixHex(C.lit, '#c09088', .35); ctx.beginPath(); ctx.ellipse(0, 0, .036, .088, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(P.night0, .7); ctx.beginPath(); ctx.ellipse(.004, -.03, .011, .017, 0, 0, TAU); ctx.ellipse(.004, .03, .011, .017, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = rgba(P.night0, .5); ctx.lineWidth = .012; ctx.beginPath(); ctx.moveTo(1.3, -.475); ctx.quadraticCurveTo(1.2, -.46 - jo * .3, 1.1, -.46); ctx.stroke();   // mouth line
    ctx.strokeStyle = rgba(C.shade, .35); ctx.lineWidth = .014; ctx.beginPath(); ctx.moveTo(.95, -.42); ctx.quadraticCurveTo(.86, -.5, .88, -.62); ctx.stroke();   // the cheek line
    eye(ctx, 1.02, -.75, .024, t, { seed: sd + 1, blink: o.blink, tilt: -.25 });
    ctx.strokeStyle = rgba(C.shade, .55); ctx.lineWidth = .014; ctx.beginPath(); ctx.moveTo(.97, -.795); ctx.quadraticCurveTo(1.02, -.812, 1.07, -.785); ctx.stroke();
    // the ear: a broad soft leaf pointing forward and up, its tip drooping; it flicks
    ctx.save(); ctx.translate(.83, -.95); ctx.rotate(.05 - ear * 1.3 + .04 * Math.sin(t * .7 + sd));
    const e = new Path2D(); e.moveTo(-.07, .02); e.bezierCurveTo(-.03, -.13, .12, -.2, .27, -.14); e.bezierCurveTo(.25, -.08, .2, -.02, .12, .03); e.bezierCurveTo(.06, .05, -.02, .05, -.07, .02); e.closePath();
    ctx.fillStyle = lin(ctx, -.07, -.2, .25, .05, [[0, C.lit], [1, mixHex(C.base, C.shade, .3)]]); ctx.fill(e); rimFill(ctx, e, C.rim, -.008, .01);
    ctx.strokeStyle = rgba(C.shade, .5); ctx.lineWidth = .01; ctx.beginPath(); ctx.moveTo(-.02, .0); ctx.quadraticCurveTo(.1, -.08, .22, -.12); ctx.stroke();
    ctx.restore();
    ctx.restore();
  });
  ctx.restore();
  const head = hp(1.0, -.72), mouth = hp(1.36, -.5), snout = hp(1.36, -.55);
  return { mouth: S(...mouth), snout: S(...snout), eye: S(...hp(1.02, -.75)), head: S(...head), top: S(0, -1.05), back: S(-.3, -1.04), front: S(1.38, -.6), rear: S(-1.15, -.6) };
}

// ======================================================================================================================== ELEPHANT
// African elephant, side view. o: { dir, light, warm, dark, seed, walk (phase rad: legs and bob), ears 0..1 (fanned out), trunk
// (−1 down … 1 raised), calf (true: no tusks), open (rumble: a slight trunk lift) }
export function elephant(ctx, t, x, y, h, o = {}) {
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, sd = o.seed ?? 0, C = tones(o.base ?? mixHex(P.blue2, P.shade1, .3), o);
  const ph = o.walk, walking = ph != null, sw = walking ? Math.sin(ph) : 0, bob = walking ? .012 * Math.cos(ph * 2) : 0;
  const ear = (o.ears ?? .2) + .08 * Math.sin(t * .8 + sd), trunk = (o.trunk ?? 0) + .06 * Math.sin(t * .6 + sd * 2) + (o.open ?? 0) * .25;
  const br = Math.sin(t * .9 + sd), S = toScr(x, y, h, dir), X0 = -1.0, X1 = 1.0;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  frame(ctx, x, y, h, dir, () => {
    ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(-.12, 0, 1.0, .05, 0, 0, TAU); ctx.fill();
    ctx.translate(0, bob);
    const leg = (hx, a, w, k) => {   // a column leg swinging about its top: slightly narrower at the knee, a wide round foot
      ctx.save(); ctx.translate(hx, -.56); ctx.rotate(a);
      const p = new Path2D(); p.moveTo(-w * .55, 0); p.bezierCurveTo(-w * .58, .2, -w * .44, .32, -w * .46, .44); p.bezierCurveTo(-w * .48, .5, -w * .56, .53, -w * .58, .56);
      p.lineTo(w * .58, .56); p.bezierCurveTo(w * .56, .52, w * .46, .5, w * .46, .44); p.bezierCurveTo(w * .44, .32, w * .58, .2, w * .55, 0); p.closePath();
      ctx.fillStyle = lin(ctx, 0, 0, 0, .56, [[0, mixHex(C.shade, C.base, .5 * k)], [1, mixHex(C.shade, C.base, .3 * k)]]); ctx.fill(p);
      ctx.fillStyle = rgba(P.night0, .3); ctx.fillRect(-w * .58, .53, w * 1.16, .03); ctx.restore();
    };
    leg(.2, -.22 * sw, .22, .3); leg(-.5, .22 * sw, .23, .3);
    leg(.36, .22 * sw, .23, 1); leg(-.68, -.22 * sw, .24, 1);
    // the body: high shoulder, sloping back, round rump, a belly that sags a little
    const b = new Path2D();
    b.moveTo(.4, -1.02); b.bezierCurveTo(.05, -1.1, -.45, -1.02, -.74, -.9); b.bezierCurveTo(-.98, -.8, -1.02, -.56, -.9, -.44);
    b.bezierCurveTo(-.72, -.36 + .006 * br, -.2, -.32 + .008 * br, .28, -.4); b.bezierCurveTo(.48, -.44, .58, -.6, .6, -.75); b.bezierCurveTo(.6, -.9, .52, -.99, .4, -1.02); b.closePath();
    paint(ctx, b, X0, X1, -1.1, -.32, C, L, { belly: .5 });
    const tw = .08 * Math.sin(t * 1.3 + sd);   // tail with a tuft
    ctx.strokeStyle = C.shade; ctx.lineWidth = .022; ctx.beginPath(); ctx.moveTo(-.93, -.72); ctx.quadraticCurveTo(-1.0 - tw, -.55, -.98 - tw * 1.5, -.42); ctx.stroke();
    ctx.fillStyle = C.shade; ctx.beginPath(); ctx.ellipse(-.98 - tw * 1.5, -.4, .022, .045, 0, 0, TAU); ctx.fill();
    // the head: domed forehead, a thick trunk hanging and curling at the tip
    const tr = trunk, hx = .4;
    const tx = .98 + .1 * tr, ty = -.1 - .3 * Math.max(0, tr);
    const hd = new Path2D();
    hd.moveTo(hx, -1.0); hd.bezierCurveTo(.56, -1.16, .84, -1.1, .9, -.88); hd.bezierCurveTo(.94, -.76, .95, -.66, .95, -.56);
    hd.bezierCurveTo(.96, -.4, .94 + .04 * tr, -.24 - .1 * tr, tx, ty); hd.bezierCurveTo(tx + .03, ty + .04, tx - .03, ty + .07, tx - .07, ty + .02);
    hd.bezierCurveTo(.84 + .03 * tr, -.26 - .1 * tr, .82, -.4, .78, -.48); hd.bezierCurveTo(.7, -.5, .6, -.55, .54, -.64); hd.bezierCurveTo(.46, -.76, .4, -.88, hx, -1.0); hd.closePath();
    paint(ctx, hd, X0, X1, -1.16, -.1, C, L, { belly: .3, rw: .014 });
    ctx.strokeStyle = rgba(C.shade, .45); ctx.lineWidth = .008;   // trunk wrinkles
    for (let k = 0; k < 4; k++) { const yy = -.44 + k * .07; ctx.beginPath(); ctx.moveTo(.84 + .02 * tr, yy); ctx.quadraticCurveTo(.89, yy + .012, .94 + .02 * tr, yy); ctx.stroke(); }
    if (!o.calf) { ctx.strokeStyle = mixHex(P.cream, P.halo2, .4); ctx.lineWidth = .03; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(.8, -.5); ctx.quadraticCurveTo(.9, -.42, 1.0, -.46); ctx.stroke(); }
    eye(ctx, .78, -.82, .017, t, { seed: sd + 2, blink: o.blink });
    // the ear: a big fan lying on the neck and shoulder, hinged at its front edge (behind the eye); it flaps slowly
    ctx.save(); ctx.translate(.64, -.86); ctx.scale(.78 + .3 * ear, 1);
    const e = new Path2D(); e.moveTo(0, -.18); e.bezierCurveTo(-.2, -.3, -.44, -.2, -.44, .04); e.bezierCurveTo(-.44, .26, -.26, .4, -.1, .36); e.bezierCurveTo(-.04, .3, .0, .2, .02, .1); e.bezierCurveTo(.03, .0, .02, -.1, 0, -.18); e.closePath();
    ctx.fillStyle = lin(ctx, -.44, 0, .02, 0, [[0, mixHex(C.shade, C.base, .6)], [1, mixHex(C.base, C.lit, .5)]]); ctx.fill(e); rimFill(ctx, e, C.rim, .012, .012);
    ctx.strokeStyle = rgba(C.shade, .4); ctx.lineWidth = .01; ctx.beginPath(); ctx.moveTo(-.06, -.12); ctx.bezierCurveTo(-.3, -.1, -.34, .14, -.14, .28); ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
  return { head: S(.7, -.98), trunk: S(.98 + .1 * trunk, -.12), eye: S(.78, -.82), top: S(.1, -1.08), back: S(-.4, -1.0), mouth: S(.82, -.5) };
}

// ======================================================================================================================== WHALES, DOLPHIN
// sea animals: (x, y) = body centre, h = body depth; o: { dir, light, warm, dark, seed, swim (stroke rate), tilt (rad) }
function seaBody(ctx, t, x, y, h, o, build) {
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, sd = o.seed ?? 0, C = tones(o.base ?? P.blue1, { warm: .25, ...o });
  const st = Math.sin(t * (o.swim ?? .7) * TAU / 2 + sd);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y + h * .04 * Math.sin(t * .4 + sd)); ctx.rotate((o.tilt ?? 0) * dir + .02 * Math.sin(t * .3 + sd)); ctx.scale(h * dir, h);
  const r = build(C, L, st, sd);
  ctx.restore();
  return r;
}
export function spermWhale(ctx, t, x, y, h, o = {}) {
  return seaBody(ctx, t, x, y, h, o, (C, L, st, sd) => {
    // flukes first (behind the body), stroking up and down
    ctx.save(); ctx.translate(-2.25, -.02); ctx.rotate(.22 * st);
    const f = new Path2D(); f.moveTo(.08, 0); f.bezierCurveTo(-.1, -.06, -.35, -.18, -.55, -.12); f.bezierCurveTo(-.42, -.04, -.4, .0, -.42, .02); f.bezierCurveTo(-.4, .04, -.42, .08, -.55, .14); f.bezierCurveTo(-.35, .2, -.1, .07, .08, 0); f.closePath();
    ctx.fillStyle = C.shade; ctx.fill(f); ctx.restore();
    const b = new Path2D();
    b.moveTo(2.25, -.12); b.bezierCurveTo(2.3, -.45, 2.12, -.55, 1.6, -.56); b.bezierCurveTo(.6, -.57, -.3, -.44, -.75, -.32);
    b.bezierCurveTo(-.85, -.42, -.98, -.44, -1.08, -.27); b.bezierCurveTo(-1.6, -.14 + .03 * st, -2.0, -.08 + .05 * st, -2.28, -.04 + .06 * st);
    b.lineTo(-2.28, .04 + .06 * st); b.bezierCurveTo(-1.7, .16 + .04 * st, -.6, .46, .4, .47); b.bezierCurveTo(1.2, .48, 1.55, .32, 1.8, .26);
    b.bezierCurveTo(1.95, .22, 2.1, .14, 2.22, .06); b.closePath();
    paint(ctx, b, -2.3, 2.3, -.6, .5, C, L, { belly: .45, rw: .02, rh: .02 });
    ctx.strokeStyle = rgba(P.cream, .35); ctx.lineWidth = .02; ctx.beginPath(); ctx.moveTo(2.12, .1); ctx.quadraticCurveTo(1.9, .2, 1.45, .25); ctx.stroke();   // the narrow lower jaw
    ctx.save(); ctx.clip(b); ctx.strokeStyle = rgba(C.shade, .4); ctx.lineWidth = .012;   // wrinkled skin behind the head (three faint lines)
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(.2 - k * .3, -.2); ctx.quadraticCurveTo(.15 - k * .3, .05, .2 - k * .3, .3); ctx.stroke(); }
    ctx.restore();
    const fl = new Path2D(); fl.moveTo(1.0, .32); fl.quadraticCurveTo(.9, .5 + .04 * st, .72, .55); fl.quadraticCurveTo(.8, .42, .86, .3); fl.closePath(); ctx.fillStyle = C.shade; ctx.fill(fl);
    eye(ctx, 1.2, .08, .025, t, { seed: sd + 3, blink: o.blink });
    ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.ellipse(2.0, -.5, .03, .012, 0, 0, TAU); ctx.fill();   // blowhole
    return { head: [x + 2.1 * h * (o.dir ?? 1), y - .2 * h], mouth: [x + 2.2 * h * (o.dir ?? 1), y], tail: [x - 2.5 * h * (o.dir ?? 1), y], top: [x + .5 * h * (o.dir ?? 1), y - .6 * h] };
  });
}
export function humpback(ctx, t, x, y, h, o = {}) {
  return seaBody(ctx, t, x, y, h, o, (C, L, st, sd) => {
    ctx.save(); ctx.translate(-2.0, -.02); ctx.rotate(.25 * st);
    const f = new Path2D(); f.moveTo(.06, 0); f.bezierCurveTo(-.1, -.1, -.38, -.28, -.6, -.2); f.bezierCurveTo(-.5, -.08, -.46, 0, -.5, .0); f.bezierCurveTo(-.46, .02, -.5, .1, -.6, .22); f.bezierCurveTo(-.38, .28, -.1, .1, .06, 0); f.closePath();
    ctx.fillStyle = C.shade; ctx.fill(f); ctx.restore();
    const b = new Path2D();
    b.moveTo(2.2, -.02); b.bezierCurveTo(2.15, -.22, 1.8, -.4, 1.2, -.44); b.bezierCurveTo(.4, -.48, -.4, -.4, -.9, -.26);
    b.bezierCurveTo(-.95, -.36, -1.05, -.38, -1.12, -.22); b.bezierCurveTo(-1.5, -.12 + .03 * st, -1.8, -.06 + .05 * st, -2.03, -.03 + .06 * st);
    b.lineTo(-2.03, .04 + .06 * st); b.bezierCurveTo(-1.4, .2, -.4, .5, .6, .46); b.bezierCurveTo(1.4, .42, 1.95, .26, 2.2, -.02); b.closePath();
    paint(ctx, b, -2.1, 2.2, -.5, .5, C, L, { belly: .35, rw: .02, rh: .02 });
    ctx.save(); ctx.clip(b); ctx.strokeStyle = rgba(P.cream, .16); ctx.lineWidth = .012;   // throat grooves
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(2.0 - k * .02, .1 + k * .05); ctx.quadraticCurveTo(1.2, .3 + k * .05, .5, .35 + k * .03); ctx.stroke(); }
    ctx.fillStyle = rgba(C.shade, .5); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(1.95 - k * .17, -.2 - k * .03, .025, 0, TAU); ctx.fill(); }   // knobs on the head
    ctx.restore();
    // the long pale flipper (the humpback's mark), slowly waving
    ctx.save(); ctx.translate(1.15, .3); ctx.rotate(.55 + .12 * Math.sin(t * .5 + sd));
    const fl = new Path2D(); fl.moveTo(0, -.05); fl.bezierCurveTo(-.3, -.06, -.8, -.02, -1.15, .06); fl.bezierCurveTo(-.8, .12, -.3, .12, 0, .07); fl.closePath();
    ctx.fillStyle = lin(ctx, 0, 0, -1.1, 0, [[0, mixHex(P.cream, C.base, .45)], [1, mixHex(P.cream, C.base, .7)]]); ctx.fill(fl); ctx.restore();
    eye(ctx, 1.45, .08, .022, t, { seed: sd + 4, blink: o.blink });
    return { head: [x + 1.9 * h * (o.dir ?? 1), y - .2 * h], mouth: [x + 2.1 * h * (o.dir ?? 1), y], tail: [x - 2.4 * h * (o.dir ?? 1), y], top: [x + .3 * h * (o.dir ?? 1), y - .5 * h] };
  });
}
export function dolphin(ctx, t, x, y, h, o = {}) {
  return seaBody(ctx, t, x, y, h, { base: mixHex(P.blue1, P.blue0, .35), swim: 1.1, ...o }, (C, L, st, sd) => {
    ctx.save(); ctx.translate(-1.55, -.02); ctx.rotate(.3 * st);
    const f = new Path2D(); f.moveTo(.06, 0); f.bezierCurveTo(-.08, -.08, -.22, -.24, -.36, -.22); f.bezierCurveTo(-.3, -.1, -.28, 0, -.3, 0); f.bezierCurveTo(-.28, .02, -.3, .1, -.36, .22); f.bezierCurveTo(-.22, .24, -.08, .08, .06, 0); f.closePath();
    ctx.fillStyle = C.shade; ctx.fill(f); ctx.restore();
    const b = new Path2D();
    b.moveTo(1.7, .02); b.bezierCurveTo(1.6, -.02, 1.45, -.06, 1.3, -.1); b.bezierCurveTo(1.18, -.3, .9, -.38, .5, -.4);
    b.bezierCurveTo(.25, -.4, .1, -.39, -.05, -.37); b.bezierCurveTo(-.15, -.6, -.3, -.75, -.42, -.78); b.bezierCurveTo(-.36, -.6, -.36, -.45, -.4, -.33);   // dorsal fin
    b.bezierCurveTo(-.9, -.24, -1.3, -.1 + .03 * st, -1.6, -.03 + .05 * st); b.lineTo(-1.6, .04 + .05 * st);
    b.bezierCurveTo(-1.1, .18, -.4, .38, .4, .34); b.bezierCurveTo(.9, .3, 1.3, .14, 1.45, .1); b.bezierCurveTo(1.55, .08, 1.65, .07, 1.7, .02); b.closePath();
    paint(ctx, b, -1.6, 1.7, -.8, .4, C, L, { belly: .1, rw: .02, rh: .02 });
    ctx.save(); ctx.clip(b); ctx.fillStyle = rgba(P.cream, .14); ctx.beginPath(); ctx.ellipse(.6, .3, .9, .14, -.08, 0, TAU); ctx.fill(); ctx.restore();   // pale belly
    const fl = new Path2D(); fl.moveTo(.75, .22); fl.quadraticCurveTo(.6, .45, .4, .5); fl.quadraticCurveTo(.5, .32, .55, .2); fl.closePath(); ctx.fillStyle = C.shade; ctx.fill(fl);
    ctx.strokeStyle = rgba(P.night0, .45); ctx.lineWidth = .014; ctx.beginPath(); ctx.moveTo(1.66, .03); ctx.quadraticCurveTo(1.45, .1, 1.3, .07); ctx.stroke();   // the smile line
    eye(ctx, 1.15, -.04, .028, t, { seed: sd + 5, blink: o.blink });
    return { head: [x + 1.4 * h * (o.dir ?? 1), y - .2 * h], mouth: [x + 1.7 * h * (o.dir ?? 1), y], tail: [x - 1.9 * h * (o.dir ?? 1), y], top: [x - .4 * h * (o.dir ?? 1), y - .8 * h] };
  });
}

// ======================================================================================================================== DOG
// a medium dog, side view. o: { dir, light, warm, dark, seed, sit (true), lie (true), wag (rate), tilt (head tilt −1..1), look (up),
//     walk (phase) }
export function dog(ctx, t, x, y, h, o = {}) {
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, sd = o.seed ?? 0, C = tones(o.base ?? mixHex(P.shade0, P.blue1, .5), o), S = toScr(x, y, h, dir);
  const wag = Math.sin(t * (o.wag ?? 5) + sd), br = Math.sin(t * 1.6 + sd), tl = (o.tilt ?? 0) * .3 + .04 * Math.sin(t * .5 + sd), lk = (o.look ?? 0) * .25;
  const ph = o.walk, sw = ph != null ? Math.sin(ph) : 0;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  frame(ctx, x, y, h, dir, () => {
    ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(-.1, 0, .85, .045, 0, 0, TAU); ctx.fill();
    const leg = (hx, top, a, col, len = .52) => {   // a tapered leg with a paw
      ctx.save(); ctx.translate(hx, top); ctx.rotate(a);
      const p = new Path2D(); p.moveTo(-.075, 0); p.bezierCurveTo(-.08, len * .4, -.05, len * .7, -.04, len - .03); p.lineTo(.04, len - .03); p.bezierCurveTo(.05, len * .7, .07, len * .4, .075, 0); p.closePath();
      ctx.fillStyle = col; ctx.fill(p); ctx.beginPath(); ctx.ellipse(.03, len - .02, .065, .03, 0, 0, TAU); ctx.fill(); ctx.restore();
    };
    const far = mixHex(C.shade, P.night0, .3);
    let b;
    if (o.sit) {
      leg(.32, -.5, 0, far, .48);
      b = new Path2D(); b.moveTo(.42, -1.0); b.bezierCurveTo(.2, -1.02, .02, -.85, -.12, -.55); b.bezierCurveTo(-.28, -.3, -.4, -.12, -.3, -.03); b.lineTo(.12, -.03);
      b.bezierCurveTo(.2, -.2, .3, -.5, .5, -.7); b.bezierCurveTo(.56, -.82, .54, -.96, .42, -1.0); b.closePath();
    } else if (o.lie) {
      b = new Path2D(); b.moveTo(.45, -.5); b.bezierCurveTo(.1, -.58, -.5, -.55, -.75, -.4); b.bezierCurveTo(-.9, -.3, -.88, -.05, -.7, -.02); b.lineTo(.55, -.02); b.bezierCurveTo(.62, -.15, .6, -.42, .45, -.5); b.closePath();
    } else {
      leg(.36, -.52, -.3 * sw, far); leg(-.5, -.52, .3 * sw, far);
      b = new Path2D(); b.moveTo(.5, -.92); b.bezierCurveTo(.2, -.86, -.3, -.88, -.6, -.86); b.bezierCurveTo(-.74, -.84, -.78, -.66, -.7, -.52);
      b.bezierCurveTo(-.4, -.48, .1, -.46 + .01 * br, .42, -.52); b.bezierCurveTo(.56, -.6, .62, -.8, .5, -.92); b.closePath();
    }
    // tail
    const tb = o.sit ? [-.25, -.06] : o.lie ? [-.8, -.25] : [-.7, -.8];
    ctx.strokeStyle = C.base; ctx.lineWidth = .07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tb[0], tb[1]); ctx.quadraticCurveTo(tb[0] - .2, tb[1] - .2 - .1 * wag, tb[0] - .3 - .05 * wag, tb[1] - .35 + .1 * wag * (o.sit ? -.3 : 1)); ctx.stroke();
    paint(ctx, b, -.8, .62, -1.02, 0, C, L, { belly: .45 });
    if (!o.sit && !o.lie) { leg(.3, -.52, .3 * sw, C.base); leg(-.58, -.52, -.3 * sw, C.base); }
    if (o.sit) { ctx.strokeStyle = C.base; ctx.lineWidth = .1; ctx.beginPath(); ctx.moveTo(.42, -.55); ctx.lineTo(.46, -.04); ctx.stroke(); ctx.fillStyle = C.base; ctx.beginPath(); ctx.ellipse(-.12, -.06, .2, .06, 0, 0, TAU); ctx.fill(); }
    if (o.lie) { ctx.strokeStyle = C.base; ctx.lineWidth = .09; ctx.beginPath(); ctx.moveTo(.4, -.12); ctx.lineTo(.78, -.05); ctx.stroke(); }
    // head
    const hb = o.sit ? [.46, -1.0] : o.lie ? [.5, -.5] : [.5, -.9];
    ctx.save(); ctx.translate(hb[0], hb[1]); ctx.rotate(-lk + tl);
    const hd = new Path2D(); hd.moveTo(-.1, .02); hd.bezierCurveTo(-.12, -.18, .02, -.28, .16, -.26); hd.bezierCurveTo(.26, -.24, .3, -.16, .34, -.1);
    hd.bezierCurveTo(.44, -.08, .5, -.04, .5, .02); hd.bezierCurveTo(.48, .07, .4, .08, .3, .08); hd.bezierCurveTo(.2, .12, .05, .14, -.1, .02); hd.closePath();
    paint(ctx, hd, -.12, .5, -.28, .14, C, L, { belly: .3, rw: .012 });
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(.49, -.005, .028, .022, 0, 0, TAU); ctx.fill();   // nose
    eye(ctx, .22, -.12, .022, t, { seed: sd + 6, blink: o.blink });
    const ea = .15 * Math.sin(t * .9 + sd) + .2 * tl;   // the floppy ear
    ctx.save(); ctx.translate(.06, -.2); ctx.rotate(.3 + ea);
    const e = new Path2D(); e.moveTo(-.04, 0); e.bezierCurveTo(-.1, .1, -.08, .26, .0, .3); e.bezierCurveTo(.06, .24, .08, .1, .05, 0); e.closePath(); ctx.fillStyle = C.shade; ctx.fill(e);
    ctx.restore(); ctx.restore();
  });
  ctx.restore();
  const hb = o.sit ? [.46, -1.0] : o.lie ? [.5, -.5] : [.5, -.9];
  return { head: S(hb[0] + .2, hb[1] - .1), mouth: S(hb[0] + .45, hb[1] + .04), top: S(hb[0] + .1, hb[1] - .3) };
}

// ======================================================================================================================== BIRDS, FROG
// crow: o { dir, light, warm, dark, seed, fly (wing phase rad: flying), peck 0..1, tag (true: the tiny recorder on the tail), open }
export function crow(ctx, t, x, y, h, o = {}) {
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, sd = o.seed ?? 0, C = tones(o.base ?? mixHex(P.night1, P.blue1, .45), { warm: .3, ...o }), S = toScr(x, y, h, dir);
  const bobH = .03 * Math.max(0, Math.sin(t * 1.7 + sd)) ** 6, pk = clamp(o.peck ?? 0), fly = o.fly;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  frame(ctx, x, y, h, dir, () => {
    if (fly == null) { ctx.strokeStyle = mixHex(P.night0, P.ind1, .4); ctx.lineWidth = .05; ctx.beginPath(); ctx.moveTo(-.02, -.32); ctx.lineTo(-.06, 0); ctx.moveTo(.08, -.32); ctx.lineTo(.1, 0); ctx.stroke(); }
    ctx.translate(0, fly == null ? 0 : -.5);
    // tail (with the recorder), body, wing
    const tail = new Path2D(); tail.moveTo(-.3, -.5); tail.lineTo(-.78, -.3); tail.lineTo(-.74, -.24); tail.lineTo(-.26, -.38); tail.closePath(); ctx.fillStyle = C.shade; ctx.fill(tail);
    if (o.tag) { ctx.fillStyle = P.halo0; ctx.save(); ctx.translate(-.55, -.34); ctx.rotate(-.38); ctx.fillRect(-.07, -.03, .12, .05); ctx.restore(); halo(ctx, 0, 0, 0, 0); }
    const b = new Path2D(); b.moveTo(.3, -.72); b.bezierCurveTo(.1, -.78, -.2, -.66, -.36, -.48); b.bezierCurveTo(-.3, -.36, -.1, -.3, .1, -.32); b.bezierCurveTo(.3, -.36, .38, -.5, .3, -.72); b.closePath();
    paint(ctx, b, -.36, .36, -.78, -.3, C, L, { belly: .3, rw: .014 });
    ctx.save(); ctx.translate(.12, -.6);
    if (fly != null) ctx.rotate(-.9 * Math.sin(fly));
    const wg = new Path2D(); wg.moveTo(0, 0); wg.bezierCurveTo(-.15, -.05, -.38, .05, -.45, .16); wg.bezierCurveTo(-.3, .14, -.1, .1, .05, .06); wg.closePath();
    ctx.fillStyle = mixHex(C.shade, C.base, .4); ctx.fill(wg); ctx.restore();
    // head + beak
    ctx.save(); ctx.translate(.3, -.74 + bobH); ctx.rotate(pk * .9);
    ctx.fillStyle = C.base; ctx.beginPath(); ctx.ellipse(.02, -.03, .13, .12, 0, 0, TAU); ctx.fill();
    const op = clamp(o.open ?? 0) * .05;
    ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.beginPath(); ctx.moveTo(.1, -.07); ctx.quadraticCurveTo(.26, -.08, .33, -.02); ctx.lineTo(.12, -.01); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(.12, 0); ctx.lineTo(.3, -.01 + op); ctx.lineTo(.11, .03); ctx.closePath(); ctx.fill();
    eye(ctx, .06, -.06, .018, t, { seed: sd + 7, blink: o.blink });
    ctx.restore();
  });
  ctx.restore();
  return { head: S(.32, -.78), mouth: S(.6, -.76), tail: S(-.6, -.36), top: S(.3, -.9) };
}
export function finch(ctx, t, x, y, h, o = {}) {   // a zebra finch on a twig: round, short tail, a pale cheek patch, a stubby beak
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, sd = o.seed ?? 0, C = tones(o.base ?? mixHex(P.blue2, P.shade1, .35), o), S = toScr(x, y, h, dir);
  const hop = .04 * Math.max(0, Math.sin(t * 2.4 + sd)) ** 10;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  frame(ctx, x, y, h, dir, () => {
    ctx.translate(0, -hop);
    ctx.fillStyle = C.shade; ctx.beginPath(); ctx.moveTo(-.3, -.42); ctx.lineTo(-.66, -.36); ctx.lineTo(-.6, -.3); ctx.lineTo(-.26, -.34); ctx.closePath(); ctx.fill();
    const b = new Path2D(); b.ellipse(-.02, -.45, .34, .28, -.2, 0, TAU); paint(ctx, b, -.36, .32, -.73, -.17, C, L, { belly: .2, rw: .016 });
    ctx.fillStyle = C.base; ctx.beginPath(); ctx.arc(.24, -.7, .17, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(P.cream, .5); ctx.beginPath(); ctx.ellipse(.28, -.64, .06, .05, 0, 0, TAU); ctx.fill();   // cheek
    ctx.fillStyle = mixHex(P.halo0, P.shade0, .4); ctx.beginPath(); ctx.moveTo(.36, -.76); ctx.lineTo(.5, -.69); ctx.lineTo(.36, -.63); ctx.closePath(); ctx.fill();
    eye(ctx, .29, -.74, .02, t, { seed: sd + 8, blink: o.blink });
    ctx.strokeStyle = mixHex(P.night0, P.ind1, .4); ctx.lineWidth = .04; ctx.beginPath(); ctx.moveTo(-.02, -.2); ctx.lineTo(-.04, 0); ctx.moveTo(.08, -.2); ctx.lineTo(.09, 0); ctx.stroke();
  });
  ctx.restore();
  return { head: S(.24, -.72), mouth: S(.48, -.7), top: S(.24, -.9) };
}
export function frog(ctx, t, x, y, h, o = {}) {   // a sitting frog; o.open 0..1 inflates the throat sac (a call)
  const dir = o.dir ?? 1, L = (o.light ?? 1) * dir, sd = o.seed ?? 0, C = tones(o.base ?? mixHex(P.blue2, P.shade0, .3), o), S = toScr(x, y, h, dir);
  const sac = clamp(o.open ?? .2 * Math.max(0, Math.sin(t * 1.3 + sd)) ** 4);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  frame(ctx, x, y, h, dir, () => {
    const b = new Path2D(); b.moveTo(.5, -.55); b.bezierCurveTo(.3, -.75, -.3, -.72, -.55, -.35); b.bezierCurveTo(-.65, -.18, -.5, 0, -.2, 0); b.lineTo(.4, 0); b.bezierCurveTo(.62, -.15, .66, -.4, .5, -.55); b.closePath();
    paint(ctx, b, -.65, .66, -.75, 0, C, L, { belly: .4 });
    ctx.fillStyle = rgba(P.cream, .3 + .3 * sac); ctx.beginPath(); ctx.ellipse(.42, -.2, .12 + .1 * sac, .1 + .08 * sac, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = C.base; ctx.beginPath(); ctx.arc(.3, -.66, .1, 0, TAU); ctx.fill();
    eye(ctx, .32, -.68, .04, t, { seed: sd + 9, blink: o.blink });
    ctx.strokeStyle = C.shade; ctx.lineWidth = .08; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-.35, -.2); ctx.quadraticCurveTo(-.1, -.38, .05, -.05); ctx.stroke();
  });
  ctx.restore();
  return { head: S(.32, -.66), mouth: S(.5, -.3), top: S(.3, -.78) };
}
const ANIMAL = { pig, elephant, spermWhale, humpback, dolphin, dog, crow, finch, frog };
export const ANIMALS = Object.keys(ANIMAL);
export function animal(ctx, kind, t, x, y, h, o = {}) { return ANIMAL[kind](ctx, t, x, y, h, o); }
// a flat mini silhouette centred in a circle of radius r (pins, cards): the animal, scaled to fit, in one tone with a lit rim
const FIT = { pig: [.5, .56, -.08], elephant: [.62, .6, -.06], spermWhale: [.27, .0, .02], humpback: [.28, .0, .05], dolphin: [.36, .1, -.05], dog: [.7, .5, -.05], crow: [1.1, .5, -.05], finch: [1.3, .5, -.05], frog: [1.0, .38, -.05], baby: [.6, .5, 0], wave: [1, 0, 0] };
export function icon(ctx, kind, x, y, r, o = {}) {
  const t = o.t ?? 0;
  if (kind === 'wave' || !ANIMAL[kind]) { wave(ctx, t, x, y, r * 1.3, r * .9, 'rumble', { col: o.col ?? 'gold', u: 1, a: o.a ?? 1, bars: 9, seed: 4 }); return; }
  const [s, oy, ox] = FIT[kind] || [.5, .5, 0], h = r * s * 1.5;
  ANIMAL[kind](ctx, t, x + ox * r, y + oy * r * (kind === 'spermWhale' || kind === 'humpback' || kind === 'dolphin' ? 0 : 1), h, { dir: o.dir ?? 1, light: 1, warm: o.warm ?? .6, base: o.base ?? mixHex(colOf(o.col).deep, P.ind1, .35), a: o.a ?? 1, seed: o.seed ?? 1, blink: 0, swim: .2 });
}

// ======================================================================================================================== CALLS (waveforms)
// amplitude envelopes per call kind (0..1, N samples), seeded; drawn as mirrored bars. The look tells the call: calm grunts are few,
// low, round bursts; a squeal is tall, dense and jagged; a rumble is long and low; clicks are sharp spikes in a rhythm …
export const CALL_KINDS = ['grunt', 'squeal', 'rumble', 'click', 'whistle', 'caw', 'murmur', 'song', 'chirp', 'babble', 'mind'];
const CALLC = new Map();
function callAmp(kind, seed = 1, N = 64) {
  const k = kind + ':' + seed + ':' + N; if (CALLC.has(k)) return CALLC.get(k);
  const r = prng(seed * 97 + kind.length * 13), a = new Float32Array(N), g = (x, c, w) => Math.exp(-(((x - c) / w) ** 2));
  for (let i = 0; i < N; i++) {
    const x = i / (N - 1), n = r();
    let v = 0;
    if (kind === 'grunt') v = Math.max(...[.14, .37, .6, .82].map((c, j) => g(x, c + (r() - .5) * .004, .055) * (.42 + .08 * j % 3))) * (.85 + .15 * n);
    else if (kind === 'squeal') v = (g(x, .3, .2) + g(x, .72, .17) * .95) * (.62 + .38 * n) ;
    else if (kind === 'rumble') v = (.32 + .14 * Math.sin(x * 9 + seed) + .06 * n) * Math.min(1, x * 8, (1 - x) * 6);
    else if (kind === 'click') v = [.1, .2, .3, .45, .52].some((c) => Math.abs(x - c) < .7 / N) ? .9 + .1 * n : .03 * n;
    else if (kind === 'whistle') v = (.45 + .3 * Math.sin(x * 14 + seed) ** 2) * Math.min(1, x * 6, (1 - x) * 6) * (.9 + .1 * n);
    else if (kind === 'caw') v = Math.max(g(x, .2, .07), g(x, .48, .07), g(x, .76, .07)) * (.62 + .38 * n);
    else if (kind === 'murmur') v = Math.max(...[.15, .32, .55, .7, .86].map((c) => g(x, c, .04))) * (.14 + .1 * n);
    else if (kind === 'song') v = (.3 + .35 * Math.sin(x * 6 + seed) ** 2 + .15 * Math.sin(x * 23)) * Math.min(1, x * 5, (1 - x) * 5) * (.85 + .15 * n);
    else if (kind === 'chirp') v = (Math.sin(x * 60) > .55 ? .55 + .35 * n : .04) * Math.min(1, x * 6, (1 - x) * 6);
    else if (kind === 'babble') v = Math.max(...[.12, .3, .5, .7, .86].map((c) => g(x, c, .06))) * (.38 + .2 * n);
    else if (kind === 'mind') v = (.3 + .2 * Math.sin(x * 7) * Math.sin(x * 3 + 1)) * Math.min(1, x * 6, (1 - x) * 6);
    a[i] = clamp(v);
  }
  CALLC.set(k, a); return a;
}
export function wave(ctx, t, x, y, w, h, kind, o = {}) {
  const N = o.bars ?? 48, A = callAmp(kind, o.seed ?? 1, N), C = colOf(o.col ?? 'cream'), u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return null;
  const step = w / N, bw = Math.max(1.2, step * (o.thin ?? .52)), x0 = x - w / 2, gap = o.gap, fill = clamp(o.fill ?? 0);
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round'; ctx.lineWidth = bw;
  let head = null;
  for (let i = 0; i < N; i++) {
    const f = (i + .5) / N; if (f > u) break;
    const grow = clamp((u - f) * N / 2.5), live = o.live ? 1 + .07 * Math.sin(t * 7 + i * 1.3) : 1;
    const inGap = gap && f >= gap[0] && f <= gap[1], hh = Math.max(bw * .6, A[i] * h * .5 * grow * live), xx = x0 + (i + .5) * step;
    ctx.strokeStyle = inGap ? (fill > (f - gap[0]) / (gap[1] - gap[0]) ? C.body : rgba(P.blue1, .55)) : (f > u - 3 / N ? C.core : C.body);
    ctx.beginPath(); ctx.moveTo(xx, y - hh); ctx.lineTo(xx, y + hh); ctx.stroke();
    head = [xx, y];
  }
  if (gap) {   // the hidden piece: a dashed frame round the greyed bars
    const gx0 = x0 + gap[0] * w, gx1 = x0 + gap[1] * w; ctx.strokeStyle = rgba(C.line, .55 * (1 - fill)); ctx.lineWidth = 2; ctx.setLineDash([8, 7]);
    ctx.strokeRect(gx0 - 4, y - h * .55, gx1 - gx0 + 8, h * 1.1); ctx.setLineDash([]);
  }
  ctx.restore();
  if (head && o.head !== false && u < 1) halo(ctx, head[0], head[1], h * .9, .35 * a, C.body, C.core);
  return { x0, x1: x0 + w, head };
}

// ======================================================================================================================== INDEX CARD
// the animal's index card: rises from its own baseline (mask), small silhouette left, NAME and sub line; optional feel row.
export function idCard(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const C = colOf(o.col), feel = o.feel != null || o.q || o.feelRow, h = feel ? 150 : 84,
    w = o.w ?? Math.max(270, Math.ceil(84 + Math.max(measure(o.name ?? '', 26, false) * 1.08, measure(o.sub ?? '', 15, false) * 1.16) + 28)), k = expoOut(u), dy = (1 - k) * (h + 16);
  ctx.save(); ctx.beginPath(); ctx.rect(x - 20, y - 40, w + 40, h + 44); ctx.clip(); ctx.translate(0, dy);
  ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .92); ctx.beginPath(); ctx.roundRect(x, y, w, h, 12); ctx.fill();
  ctx.strokeStyle = rgba(C.line, .55); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = rgba(C.body, .9); ctx.fillRect(x + 14, y, 46, 3);   // the card's tab line
  ctx.save(); ctx.beginPath(); ctx.arc(x + 44, y + 42, 26, 0, TAU); ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fill(); ctx.clip();
  if (o.animal) icon(ctx, o.animal, x + 44, y + 44, 24, { col: o.col, t, base: mixHex(C.deep, P.blue1, .3) });
  ctx.restore();
  E.glowText(ctx, o.name ?? '', x + 84, y + 40, { size: 26, weight: 600, col: C.core, glow: false, spacing: .06 });
  if (o.sub) E.glowText(ctx, o.sub, x + 84, y + 64, { size: 15, weight: 600, col: P.halo2, glow: false, spacing: .12 });
  if (feel) {   // FEELS: a short track, a bead slides to −/+ ; the word under it
    const ty = y + 100, tx0 = x + 84, tx1 = x + w - 22;
    E.glowText(ctx, 'FEELS', x + 18, ty + 6, { size: 14, weight: 600, col: P.halo2, glow: false, spacing: .14 });
    ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx0, ty); ctx.lineTo(tx1, ty); ctx.stroke();
    E.glowText(ctx, '–', tx0 - 2, ty - 8, { size: 16, weight: 600, col: P.halo2, glow: false }); E.glowText(ctx, '+', tx1 - 8, ty - 8, { size: 16, weight: 600, col: P.halo2, glow: false });
    if (o.q) { const b = .5 + .5 * Math.sin(t * 4.2); E.glowText(ctx, '?', (tx0 + tx1) / 2 - 7, ty + 9, { size: 30, serif: true, col: rgba(P.cream, .6 + .4 * b), glow: true }); }
    if (o.feel != null) {
      const fu = expoOut(clamp(o.feelU ?? 1)), bx = lerp((tx0 + tx1) / 2, lerp(tx0, tx1, (o.feel + 1) / 2), fu), good = o.feel > 0;
      const bc = good ? GOLD : { core: mixHex(P.blue0, P.cream, .4), body: P.blue0 };
      halo(ctx, bx, ty, 34, .45 * fu * (good ? 1 : .5), bc.body, bc.core);
      ctx.fillStyle = bc.core; ctx.beginPath(); ctx.arc(bx, ty, 8, 0, TAU); ctx.fill();
      if (o.feelWord && fu > .3) maskLine(ctx, [[o.feelWord, good ? 1 : 0]], (tx0 + tx1) / 2, ty + 34, 17, span(fu, .3, 1), { serif: false, weight: 600, align: 'center', col: good ? P.halo0 : mixHex(P.blue0, P.cream, .55), glow: false });
    }
  }
  if (o.tick) tick(ctx, x + w - 34, y + 34, 16, o.tick, o.col);
  ctx.restore();
  return { w, h };
}
// a check mark drawn as a light stroke (u 0..1)
export function tick(ctx, x, y, s, u, col = 'gold') {
  u = clamp(u); if (u <= 0) return;
  const C = colOf(col), pts = [[x - s * .8, y], [x - s * .2, y + s * .6], [x + s, y - s * .7]];
  ctx.save(); ctx.strokeStyle = C.core; ctx.lineWidth = Math.max(2.5, s * .22); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const L1 = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), L2 = Math.hypot(pts[2][0] - pts[1][0], pts[2][1] - pts[1][1]), d = u * (L1 + L2);
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  if (d <= L1) ctx.lineTo(lerp(pts[0][0], pts[1][0], d / L1), lerp(pts[0][1], pts[1][1], d / L1));
  else { ctx.lineTo(...pts[1]); ctx.lineTo(lerp(pts[1][0], pts[2][0], (d - L1) / L2), lerp(pts[1][1], pts[2][1], (d - L1) / L2)); }
  ctx.stroke(); ctx.restore();
  halo(ctx, x, y, s * 3, .25 * u, C.body, C.core);
}

// ======================================================================================================================== THE LISTENER (A.I.)
// an ear-trumpet of light: calls go into the bell (left), cards come out of the tip (right). s = bell height in px.
export function listener(ctx, t, x, y, s, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const C = colOf(o.col ?? 'gold'), dir = o.dir ?? 1, dk = clamp(o.drink ?? 0), k = expoOut(u), br = 1 + .012 * Math.sin(t * 1.4) + .05 * dk;
  const bell = [x - s * .9 * dir, y], tip = [x + s * 1.05 * dir, y - s * .05];
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y + (1 - k) * s * .6); ctx.scale(dir * s * br, s * br);
  halo(ctx, -.4, 0, 1.6, .22 * u, C.body, C.core);
  // the horn: from the bell rim (an ellipse) narrowing to the throat, then a tube to the tip
  const hn = new Path2D(); hn.moveTo(-.9, -.6); hn.bezierCurveTo(-.4, -.5, .0, -.18, .4, -.12); hn.bezierCurveTo(.7, -.1, .9, -.12, 1.0, -.16);
  hn.lineTo(1.05, -.02); hn.bezierCurveTo(.9, .06, .7, .09, .4, .1); hn.bezierCurveTo(.0, .16, -.4, .48, -.9, .6); hn.closePath();
  ctx.fillStyle = lin(ctx, 0, -.6, 0, .6, [[0, C.core], [.4, C.body], [1, mixHex(C.deep, P.night1, .3)]]); ctx.fill(hn);
  ctx.strokeStyle = rgba(C.core, .6); ctx.lineWidth = .025; ctx.stroke(hn);
  // the bell mouth: a dark opening with a lit inner rim, glowing deeper when it drinks
  ctx.fillStyle = mixHex(P.night0, C.deep, .25); ctx.beginPath(); ctx.ellipse(-.9, 0, .17, .6, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = rad(ctx, -.88, 0, .55, [[0, rgba(C.core, .25 + .6 * dk)], [1, rgba(C.body, 0)]]); ctx.beginPath(); ctx.ellipse(-.9, 0, .15, .55, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = C.core; ctx.lineWidth = .04; ctx.beginPath(); ctx.ellipse(-.9, 0, .17, .6, 0, 0, TAU); ctx.stroke();
  // the tip flare
  ctx.fillStyle = C.core; ctx.beginPath(); ctx.ellipse(1.06, -.09, .025, .1, 0, 0, TAU); ctx.fill();
  if (o.blind > 0) {   // a soft band across the bell: it cannot see what the calls are about
    const b = expoOut(clamp(o.blind));
    ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.beginPath(); ctx.roundRect(-1.12, -.16, .5 * b + .02, .32, .08); ctx.fill();
  }
  ctx.restore();
  return { bell, tip, x, y, s };
}

// ======================================================================================================================== TRANSLATION BAR
// "[translating…]": a subtitle bar for the animal, empty with a blinking cursor until the scenario fills it (o.text typed by o.typed)
export function transBar(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const w = o.w ?? 520, h = 66, k = expoOut(u), dy = (1 - k) * (h + 12);
  ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2 - 20, y - h / 2 - 20, w + 40, h + 40); ctx.clip(); ctx.translate(0, dy);
  ctx.fillStyle = rgba(P.night0, .78); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
  ctx.strokeStyle = rgba(P.cream, .38); ctx.lineWidth = 2; ctx.stroke();
  const txt = o.text ?? '', n = Math.round(txt.length * clamp(o.typed ?? 1)), shown = txt.slice(0, n);
  let cx = x - w / 2 + 34;
  if (!shown) {   // the cursor waits at the start of the line; the placeholder sits after it, dim
    E.glowText(ctx, '[translating…]', cx + 14, y + 11, { size: 30, serif: true, col: rgba(P.halo2, .5), glow: false });
  } else {
    E.glowText(ctx, shown, cx, y + 13, { size: 38, serif: true, col: P.cream });
    cx += measure(shown, 38, true) + 6;
  }
  const bl = blink(t, 0, 1.06); ctx.fillStyle = rgba(P.cream, .85 * bl); ctx.fillRect(cx, y - 17, 3, 34);
  if (o.stamp) E.glowText(ctx, o.stamp, x + w / 2 - 24, y + 7, { size: 14, weight: 600, col: P.halo0, align: 'right', glow: false, spacing: .18 });
  ctx.restore();
  return { x, y, w, h };
}

// ======================================================================================================================== THE NIGHT MAP
// equirectangular, flat. A view is { lon, lat, z }: z = 1 shows the whole width (360°) on 1920 px.
export const mapView = (lon, lat, z) => ({ lon, lat, z });
export const kOf = (v) => v.z * W / 360;
export function mapXY(v, lon, lat) { const k = kOf(v); return [W / 2 + (lon - v.lon) * k, H / 2 - (lat - v.lat) * k]; }
export function mapLL(v, x, y) { const k = kOf(v); return [v.lon + (x - W / 2) / k, v.lat - (y - H / 2) / k]; }
// smooth zoom-out → pan → zoom-in between two views (van Wijk & Nuij 2003, rho 1.35); u 0..1 (ease it yourself)
export function flight(A, B, u, rho = 1.35) {
  const w0 = 360 / A.z, w1 = 360 / B.z, dx = B.lon - A.lon, dy = B.lat - A.lat, d = Math.hypot(dx, dy);
  if (d < 1e-6) { const z = Math.exp(lerp(Math.log(A.z), Math.log(B.z), u)); return { lon: A.lon, lat: A.lat, z }; }
  const r2 = rho * rho, bb = (i) => (w1 * w1 - w0 * w0 + (i ? -1 : 1) * r2 * r2 * d * d) / (2 * (i ? w1 : w0) * r2 * d);
  const r = (i) => Math.log(-bb(i) + Math.sqrt(bb(i) ** 2 + 1)), r0 = r(0), r1 = r(1), S = (r1 - r0) / rho, s = u * S;
  const us = w0 / r2 * Math.cosh(r0) * Math.tanh(rho * s + r0) - w0 / r2 * Math.sinh(r0), ws = w0 * Math.cosh(r0) / Math.cosh(rho * s + r0);
  return { lon: A.lon + dx * us / d, lat: A.lat + dy * us / d, z: 360 / ws };
}
export const flightLen = (A, B, rho = 1.35) => {   // the path length S (in log-zoom units): use it to size the flight's duration
  const w0 = 360 / A.z, w1 = 360 / B.z, d = Math.hypot(B.lon - A.lon, B.lat - A.lat); if (d < 1e-6) return Math.abs(Math.log(w1 / w0)) / rho;
  const r2 = rho * rho, bb = (i) => (w1 * w1 - w0 * w0 + (i ? -1 : 1) * r2 * r2 * d * d) / (2 * (i ? w1 : w0) * r2 * d), r = (i) => Math.log(-bb(i) + Math.sqrt(bb(i) ** 2 + 1));
  return (r(1) - r(0)) / rho;
};
const LANDPATH = (() => {   // the coastlines as soft Catmull-Rom curves through the polygon points (no hard corners at close zoom)
  const p = new Path2D(), k = .3;
  for (const poly of LAND) {
    const n = poly.length, q = (i) => { const v = poly[((i % n) + n) % n]; return [v[0], -v[1]]; };
    p.moveTo(...q(0));
    for (let i = 0; i < n; i++) {
      const p0 = q(i - 1), p1 = q(i), p2 = q(i + 1), p3 = q(i + 2);
      p.bezierCurveTo(p1[0] + (p2[0] - p0[0]) * k / 1.5, p1[1] + (p2[1] - p0[1]) * k / 1.5, p2[0] - (p3[0] - p1[0]) * k / 1.5, p2[1] - (p3[1] - p1[1]) * k / 1.5, p2[0], p2[1]);
    }
    p.closePath();
  }
  return p;
})();
// stipple: seeded points on land (inside test once at load), drawn as tiny squares; and the ambient calls (every species)
function inPoly(poly, x, y) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
const onLand = (lo, la) => LAND.some((p) => p.length > 3 && inPoly(p, lo, la));
const STIPPLE = (() => { const r = prng(2401), s = []; for (let la = -56; la < 80; la += 1.6) for (let lo = -180; lo < 180; lo += 1.6) { const a = lo + (r() - .5) * 1.2, b = la + (r() - .5) * 1.2; if (onLand(a, b)) s.push([a, b, r()]); } return s; })();
const CALLPTS = (() => { const r = prng(2402), s = []; while (s.length < 320) { const lo = -170 + r() * 340, la = -50 + r() * 120, land = onLand(lo, la); if (!land && r() < .55) continue;
  s.push({ lo, la, kind: CALL_KINDS[Math.floor(r() * 9)], ph: r() * 9, per: 4 + r() * 5, gold: r() < .06, d: Math.hypot(lo + 122, la - 38) }); } return s; })();
export function map(ctx, t, v, o = {}) {
  const k = kOf(v);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, mixHex(P.night1, P.night0, .3)], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.setTransform(k, 0, 0, k, W / 2 - v.lon * k, H / 2 + v.lat * k);
  const dim = 1 - (o.dim ?? 0);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .62 * dim); ctx.fill(LANDPATH);
  ctx.strokeStyle = rgba(P.blue1, .55 * dim); ctx.lineWidth = 1.6 / k; ctx.lineJoin = 'round'; ctx.stroke(LANDPATH);
  ctx.restore();
  // stipple (fades out of the picture only by size: specks stay specks; skipped when zoomed far in)
  if (v.z < 9) {
    const [lo0, la1] = mapLL(v, -10, -10), [lo1, la0] = mapLL(v, W + 10, H + 10), s = clamp(1.1 + .25 * Math.log2(v.z), 1, 2.2);
    ctx.fillStyle = rgba(P.blue1, .5 * dim * clamp((9 - v.z) / 3));   // fades in by scale while zooming out (no pop at z 9)
    for (const [lo, la, q] of STIPPLE) { if (lo < lo0 || lo > lo1 || la < la0 || la > la1) continue; const [x, y] = mapXY(v, lo, la); ctx.fillRect(x - s / 2, y - s / 2, s * (.8 + .4 * q), s * (.8 + .4 * q)); }
  }
  // every species: tiny calls flicker everywhere (grow as bars from their baseline, sink again), spreading out from California
  const ca = clamp(o.calls ?? 0);
  if (ca > 0) {
    const sz = clamp(13 + 4 * Math.log2(v.z), 10, 22);
    for (const c of CALLPTS) {
      const on = clamp(ca * 220 - c.d * 1.1 / (o.spread ?? 1)); if (on <= 0) continue;   // spreads out from California as ca grows
      const ph = ((t + c.ph) % c.per) / c.per, life = Math.sin(Math.PI * clamp(ph / .55)) * on;
      if (life <= .02) continue;
      const [x, y] = mapXY(v, c.lo, c.la); if (x < -30 || x > W + 30 || y < -30 || y > H + 30) continue;
      wave(ctx, t, x, y, sz * 1.6, sz * life, c.kind, { col: c.gold ? 'gold' : 'cream', u: 1, a: .75 * (o.callA ?? 1), bars: 7, seed: Math.round(c.ph * 10), head: false });
    }
  }
  ctx.restore();
}
// PINS (phrase-driven): grow from their map point on `on`, label from `lab` for labDur s (or until o.labels says otherwise)
export const PINS = [
  { id: 'esp', lon: -122.27, lat: 37.87, kind: 'esp', animal: 'wave', on: ['California'], lab: ["They're called the Earth Species Project"], l1: 'EARTH SPECIES PROJECT', l2: 'NONPROFIT · CALIFORNIA' },
  { id: 'pigs', lon: 8.54, lat: 47.37, kind: 'other', animal: 'pig', on: ['Scientists are trying'], lab: ['That was another team, also in Europe'], l1: 'OTHER TEAM · EUROPE', l2: 'COPENHAGEN · ETH ZURICH · INRAE' },
  { id: 'kenya', lon: 37.6, lat: .9, lean: -1, kind: 'other', animal: 'elephant', on: ['Start in Kenya'], lab: ['Start in Kenya'], l1: 'OTHER TEAM · KENYA', l2: 'SAMBURU · AMBOSELI' },
  { id: 'amboseli', lon: 37.26, lat: -2.65, lean: .6, kind: 'esp', animal: 'elephant', on: ['Also in Kenya, the Earth Species'], lab: ['Also in Kenya, the Earth Species'], l1: 'EARTH SPECIES PROJECT', l2: 'AMBOSELI · KENYA' },
  { id: 'leon', lon: -5.57, lat: 42.6, kind: 'esp', animal: 'crow', on: ['Now north, to Spain'], lab: ['Now north, to Spain'], l1: 'EARTH SPECIES PROJECT + UNIVERSITY OF LEÓN', l2: 'SPAIN' },
  { id: 'dominica', lon: -61.37, lat: 15.41, kind: 'other', animal: 'spermWhale', on: ['In the Caribbean'], lab: ['In the Caribbean'], l1: 'OTHER TEAM · DOMINICA', l2: 'PROJECT CETI' },
  { id: 'bahamas', lon: -79.25, lat: 25.72, kind: 'other', animal: 'dolphin', on: ['in the Bahamas'], lab: ['in the Bahamas'], l1: 'GOOGLE + WILD DOLPHIN PROJECT', l2: 'BAHAMAS' },
  { id: 'berkeley', lon: -121.3, lat: 37.0, kind: 'other', animal: 'finch', on: ['Back in California, another'], lab: ['Back in California, another'], l1: 'OTHER TEAM · BERKELEY', l2: 'ZEBRA FINCHES' },
  { id: 'telaviv', lon: 34.78, lat: 32.08, kind: 'other', animal: 'baby', on: ['Researchers tested A.I. on recordings of toddlers'], lab: ['Researchers tested A.I. on recordings of toddlers'], l1: 'TEL AVIV UNIVERSITY', l2: '2026' },
  { id: 'alaska', lon: -134.4, lat: 57.1, kind: 'other', animal: 'humpback', on: ['Off Alaska'], lab: ['Off Alaska'], l1: 'OTHER TEAM · ALASKA', l2: 'WHALESETI' },
  { id: 'germany', lon: 10.4, lat: 51.2, kind: 'place', on: ['In Germany, about nine'], lab: ['In Germany, about nine'], l1: 'GERMANY', l2: '2025' },
  { id: 'iceland', lon: -21.9, lat: 64.1, kind: 'place', on: ['Iceland hunted fin whales'], lab: ['Iceland hunted fin whales'], l1: 'ICELAND', l2: 'FIN WHALES · 2026' },
  { id: 'nz', lon: 174.8, lat: -41.3, kind: 'place', on: ['A courtroom in New Zealand'], lab: ['A courtroom in New Zealand'], l1: 'NEW ZEALAND', l2: 'YEAR 1 · SCENARIO' },
  { id: 'iowa', lon: -93.6, lat: 42.0, kind: 'place', on: ['A farm kitchen in Iowa'], lab: ['A farm kitchen in Iowa'], l1: 'IOWA', l2: 'YEAR 10 · SCENARIO' },
];
export const PIN = Object.fromEntries(PINS.map((p) => [p.id, p]));
const PINT = new WeakMap();
function pinTimes(T) {
  if (PINT.has(T)) return PINT.get(T);
  const first = (arr) => { for (const ph of arr || []) if (T.gHas(ph)) return T.G(ph); return null; };
  const m = Object.fromEntries(PINS.map((p) => [p.id, { on: p.id === 'pigs' ? 0 : first(p.on), lab: first(p.lab) }]));
  PINT.set(T, m); return m;
}
export const pinOn = (T, id) => pinTimes(T)[id].on;
export const PIN_R = 17, STALK = 32;
// one pin: map point (x, y). o { kind, animal, grow 0..1, r (head radius), label [l1, l2], lu 0..1, pulse 0..1, t, inner(ctx, cx, cy, r) }
// returns the head centre [cx, cy, r]
export function pin(ctx, t, x, y, o = {}) {
  const g = clamp(o.grow ?? 1); if (g <= 0) return null;
  const C = colOf(o.kind === 'esp' ? 'gold' : 'cream'), r = (o.r ?? PIN_R) * (o.kind === 'place' ? .45 : o.kind === 'esp' ? 1.25 : 1), st = (o.stalk ?? STALK) * expoOut(clamp(g * 1.6));
  const hr = r * expoOut(clamp(g * 1.6 - .6)), ln = (o.lean ?? 0) * .9;
  const cx = o.head ? o.head[0] : x + ln * (st + hr), cy = o.head ? o.head[1] : y - (st + hr * (o.kind === 'place' ? 0 : 1)) * (1 - .25 * Math.abs(ln));   // lean: neighbouring pins splay apart
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x, y + 1, 6, 2.4, 0, 0, TAU); ctx.fill();
  if (o.kind !== 'place') { ctx.strokeStyle = rgba(C.line, .85); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(lerp(x, cx, st / (st + hr + 1e-6)), lerp(y, cy, st / (st + hr + 1e-6))); ctx.stroke(); }
  ctx.fillStyle = C.core; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, TAU); ctx.fill();
  if (hr > .5) {
    const pu = o.pulse ?? 0;
    if (hr < 120) halo(ctx, cx, cy, hr * (o.kind === 'esp' ? 4.2 : 2.6) * (1 + .5 * pu), clamp((120 - hr) / 70) * (o.kind === 'esp' ? .4 : .18) * (1 + pu) * (.9 + .1 * Math.sin(t * 1.7)), C.body, C.core);
    if (o.kind === 'place') { ctx.fillStyle = C.core; ctx.beginPath(); ctx.arc(cx, cy, hr, 0, TAU); ctx.fill(); }
    else {
      ctx.fillStyle = mixHex(P.night0, P.ind1, .55); ctx.beginPath(); ctx.arc(cx, cy, hr, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, hr - 1, 0, TAU); ctx.clip();
      if (o.inner) o.inner(ctx, cx, cy, hr); else if (o.animal) icon(ctx, o.animal, cx, cy + hr * .05, hr * .95, { col: o.kind === 'esp' ? 'gold' : 'cream', t, base: mixHex(C.body, P.blue1, .35) });
      ctx.restore();
      ctx.strokeStyle = o.kind === 'esp' ? C.body : C.core; ctx.lineWidth = clamp(hr * .12, 2, 3.2); ctx.beginPath(); ctx.arc(cx, cy, hr, 0, TAU); ctx.stroke();
    }
  }
  const lu = clamp(o.lu ?? 0);
  if (lu > 0 && o.label) {
    const lx = cx + hr + 16, ly = cy + 2, sz = o.labelSize ?? 22;
    ctx.strokeStyle = rgba(C.line, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx + hr + 4, cy); ctx.lineTo(cx + hr + 4 + 10 * expoOut(lu), cy); ctx.stroke();
    maskLine(ctx, [[o.label[0], o.kind === 'esp' ? 1 : 0]], lx, ly, sz, lu, { serif: false, weight: 600, col: o.kind === 'esp' ? P.halo0 : P.cream, glow: o.kind === 'esp' });
    if (o.label[1]) maskLine(ctx, [[o.label[1], 0]], lx, ly + sz * 1.1, sz * .68, rise(span(lu, .2, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  }
  ctx.restore();
  return [cx, cy, hr];
}
// all pins of the film at time t (phrase-driven). o { only: [ids], hide: [ids], labels: { id: lu } (override), pulse: { id: 0..1 },
//   inner: { id: fn }, grow: { id: 0..1 } (override), labDur (s, default 6) }. Returns { id: [cx, cy, r] } of the drawn heads.
// the medallion of the Europe pig pin is the live barn of the hook (a tiny window, both pigs; the B2 zoom opens it again)
export const BARN_MED = aim(F0, 965, 640, 1.5);
export function barnMedallion(ctx, cx, cy, r, t, c = BARN_MED) {
  const s = r / RF; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  E.withOuter({ k: s, e: cx - W / 2 * s, f: cy - H / 2 * s }, () => barnCast(ctx, c, t, { you: false }));
  ctx.restore();
}
let MED_T = 0;
const DEFAULT_INNER = { pigs: (ctx, cx, cy, r) => barnMedallion(ctx, cx, cy, r, MED_T) };
export function pins(ctx, t, T, v, o = {}) {
  MED_T = t;
  const tm = pinTimes(T), out = {};
  for (const p of PINS) {
    if (o.only && !o.only.includes(p.id)) continue; if (o.hide && o.hide.includes(p.id)) continue;
    const on = tm[p.id].on; if (on == null && !(o.grow && o.grow[p.id] != null)) continue;
    const g = o.grow && o.grow[p.id] != null ? o.grow[p.id] : span(t, on - .1, on + .7);
    if (g <= 0) continue;
    const [x, y] = mapXY(v, p.lon, p.lat); if (x < -300 || x > W + 300 || y < -200 || y > H + 300) continue;
    const lt = tm[p.id].lab, ld = o.labDur ?? 6;
    const lu = o.labels && o.labels[p.id] != null ? o.labels[p.id] : lt == null ? 0 : rise(span(t, lt, lt + .8)) * (1 - expoIn(span(t, lt + ld, lt + ld + .5)));
    out[p.id] = pin(ctx, t, x, y, { kind: p.kind, animal: p.animal, lean: p.lean, grow: g, head: o.head && o.head[p.id], r: o.r && o.r[p.id], label: [p.l1, p.l2], lu, pulse: o.pulse && o.pulse[p.id], inner: (o.inner && o.inner[p.id]) || DEFAULT_INNER[p.id] });
  }
  return out;
}
// a scene seen through a medallion: fn() draws a full 1920×1080 frame; it is shown scaled into the circle (r = RF fills the frame)
export const RF = Math.hypot(W, H) / 2;
export function iris(ctx, cx, cy, r, fn, o = {}) {
  if (r <= .5) return;
  const s = r / RF;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2); E.withOuter({ k: s, e: cx - W / 2 * s, f: cy - H / 2 * s }, () => fn(s)); ctx.restore();
  if (r < RF * 1.02) {
    const C = colOf(o.col ?? 'cream');
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = C.core; ctx.lineWidth = clamp(r * .12, 2, 3.2) * (o.ring ?? 1);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); ctx.restore();
  }
}

// ======================================================================================================================== THE 2030 STRIP
// docked top right from "by twenty thirty": a pill with a short call line running up to 2030 (gold, the ESP colour). Its word
// changes with the story (phrase-driven); big moments (2:29, 6:07, 6:28, 7:52, 9:32) morph it with o.big into the big form at o.at.
export const STRIP_DOCK = { x: 1660, y: 92, w: 236, h: 58 };
const STRIPT = new WeakMap();
function stripTimes(T) {
  if (STRIPT.has(T)) return STRIPT.get(T);
  const g = (p, f = 'G') => (T.gHas(p) ? T[f](p) : null);
  const m = { born: g('breakthroughs by twenty thirty', 'GE'), q: g('So will they make twenty'), what: g('But suppose they make it'), hit: g('Twenty thirty. Day one'), today: g('Back to today') };
  STRIPT.set(T, m); return m;
}
export function stripWord(t, T) {
  const m = stripTimes(T);
  if (m.today != null && t >= m.today) return ['2030', ''];
  if (m.hit != null && t >= m.hit) return ['2030', 'TARGET HIT · SCENARIO'];
  if (m.what != null && t >= m.what) return ['2030', 'WHAT CHANGES?'];
  if (m.q != null && t >= m.q) return ['2030?', ''];
  return ['2030', ''];
}
export function strip(ctx, t, T, o = {}) {
  const m = stripTimes(T); if (m.born == null || o.hide) return null;
  const b0 = m.born + .15, fly = o.from ? sineIO(span(t, b0 + .6, b0 + 2.0)) : 1;
  const u = rise(span(t, b0 - .1, b0 + .6)); if (u <= 0) return null;
  const D = STRIP_DOCK, big = clamp(o.big ?? 0), eb = sineIO(big);
  let x = D.x, y = D.y, w = D.w, s = 1;
  if (o.from && fly < 1) { x = lerp(o.from[0], D.x, fly); y = lerp(o.from[1], D.y, fly) - 40 * Math.sin(Math.PI * fly); s = lerp(1.25, 1, fly); }
  if (eb > 0) { const A = o.at ?? [W / 2, H / 2]; x = lerp(x, A[0], eb); y = lerp(y, A[1], eb); w = lerp(D.w, o.w ?? 1100, eb); s = lerp(s, o.s ?? 1.9, eb); }
  const [word, sub] = o.word ?? stripWord(t, T), h = D.h;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(s, s); const ww = w / s;
  ctx.save(); ctx.beginPath(); ctx.rect(-ww / 2 - 30, -h / 2 - 30, ww + 60, h + 60 + 40); ctx.clip(); ctx.translate(0, (1 - expoOut(u)) * (h + 20));
  ctx.fillStyle = rgba(P.night0, .82); ctx.beginPath(); ctx.roundRect(-ww / 2, -h / 2, ww, h, h / 2); ctx.fill();
  ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 2 / s * 1.2; ctx.stroke();
  // the call line: from the left end (TODAY) to the word, the last stretch dashed (not yet)
  const lx0 = -ww / 2 + 22, lx1 = ww / 2 - 22 - measure(word, 34, true) - 14, today = lerp(lx0, lx1, o.today ?? .62);
  wave(ctx, t, (lx0 + today) / 2, 0, today - lx0, h * .55, 'rumble', { col: 'gold', u: 1, bars: Math.max(6, Math.round((today - lx0) / 9)), seed: 30, head: false, a: .95 });
  ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.moveTo(today + 6, 0); ctx.lineTo(lx1, 0); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(today, 0, 4.5, 0, TAU); ctx.fill();
  E.glowText(ctx, word, ww / 2 - 22, 12, { size: 34, serif: true, align: 'right', col: P.halo0 });
  if (o.todayLabel && eb > .3) maskLine(ctx, [[o.todayLabel, 0]], lx0, -h / 2 - 14, 15, span(eb, .3, 1), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
  if (sub) maskLine(ctx, [[sub, 1]], ww / 2 - 22 - measure(sub, 15, false), h / 2 + 24, 15, rise(span(t, (sub === 'WHAT CHANGES?' ? m.what : m.hit) + .2, (sub === 'WHAT CHANGES?' ? m.what : m.hit) + 1)), { serif: false, weight: 600, col: P.halo0, glow: false });
  ctx.restore();
  return { x, y, w, h: h * s };
}

// ======================================================================================================================== THE TABLET
// the meaning tablet (a Rosetta-like slab with seven slots round an empty middle): each station engraves one slot on its phrase.
export const TABLET = [
  { id: 'names', text: 'NAMES', col: 'cream', at: ['If elephants have names'] },
  { id: 'room', text: "WHAT'S GOING ON", col: 'gold', at: ['A first step from patterns'] },
  { id: 'context', text: 'CONTEXT', col: 'gold', at: ["That's the baby's trick"] },
  { id: 'feel', text: 'FEELINGS', col: 'cream', at: ['So one piece is already in place'] },
  { id: 'parts', text: 'PARTS', col: 'cream', at: ['parts can be learned'] },
  { id: 'next', text: 'NEXT SOUND', col: 'cream', at: ["Google's model is built for dolphins"] },
  { id: 'there', text: "IT'S THERE", col: 'cream', at: ['So the meaning is there'] },
];
const SLOTS = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-.5, 1], [.5, 1]];   // grid places (col, row); the middle (0, 0) is MEANING
export function tablet(ctx, t, T, x, y, s, o = {}) {   // a stone slab: lit top edge, recessed dark slots, words engraved in light
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), cw = 262, ch = 70, gx = 286, gy = 92;
  ctx.save(); ctx.translate(x, y + (1 - k) * 40 * s); ctx.scale(s, s);
  const slab = (dx, dy) => { const p = new Path2D(); p.moveTo(-436 + dx, -146 + dy); p.lineTo(-300 + dx, -168 + dy); p.lineTo(424 + dx, -160 + dy); p.lineTo(446 + dx, 30 + dy); p.lineTo(430 + dx, 168 + dy); p.lineTo(-412 + dx, 176 + dy); p.lineTo(-446 + dx, 26 + dy); p.closePath(); return p; };
  ctx.fillStyle = rgba(P.night0, .55); ctx.fill(slab(10, 16));                                           // the shadow under it
  const sl = slab(0, 10);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.fill(sl);                                             // the thick front edge
  const top = slab(0, 0);
  ctx.fillStyle = lin(ctx, -300, -170, 200, 180, [[0, mixHex(P.blue2, P.shade1, .22)], [.55, mixHex(P.ind2, P.blue2, .55)], [1, mixHex(P.ind2, P.night1, .4)]]); ctx.fill(top);
  ctx.save(); ctx.clip(top); ctx.strokeStyle = rgba(P.halo2, .35); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-436, -146); ctx.lineTo(-300, -168); ctx.lineTo(424, -160); ctx.stroke(); ctx.restore();   // the lit upper rim
  const slot = (cx, cy, w, h) => {   // a recess: dark floor, shadow along its top, a faint lit lip at the bottom
    ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 6); ctx.fill();
    ctx.fillStyle = rgba(P.night0, .8); ctx.fillRect(cx - w / 2 + 4, cy - h / 2, w - 8, 5);
    ctx.strokeStyle = rgba(P.blue1, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - w / 2 + 6, cy + h / 2); ctx.lineTo(cx + w / 2 - 6, cy + h / 2); ctx.stroke();
  };
  TABLET.forEach((sp, i) => {
    const [c, r] = SLOTS[i], cx = c * gx, cy = r * gy, at = o.at && o.at[sp.id] != null ? o.at[sp.id] : (() => { for (const ph of sp.at) if (T.gHas(ph)) return T.G(ph); return null; })();
    const e = at == null ? 0 : (o.filled && o.filled.includes(sp.id) ? 1 : span(t, at, at + .9)), C = colOf(sp.col);
    slot(cx, cy, cw, ch);
    if (e > 0) {   // engraved: light runs along the recess from the left, the word rises out of it
      ctx.save(); ctx.beginPath(); ctx.roundRect(cx - cw / 2, cy - ch / 2, cw * expoOut(e), ch, 6); ctx.clip();
      ctx.fillStyle = rgba(C.body, .2); ctx.fillRect(cx - cw / 2, cy - ch / 2, cw, ch); ctx.restore();
      maskLine(ctx, [[sp.text, sp.col === 'gold' ? 1 : 0]], cx, cy + 10, 28, rise(span(e, .25, 1)), { serif: false, weight: 700, align: 'center', col: C.core, glow: sp.col === 'gold' });
      if (e < 1) halo(ctx, cx - cw / 2 + cw * expoOut(e), cy, 70, .45 * (1 - e), C.body, C.core);
    }
  });
  // the empty middle: deeper, framed in dim gold, waiting
  slot(0, 0, cw, ch); const br = .5 + .5 * Math.sin(t * 1.3);
  ctx.strokeStyle = rgba(P.halo1, .55 + .2 * br); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.roundRect(-cw / 2 - 6, -ch / 2 - 6, cw + 12, ch + 12, 9); ctx.stroke();
  E.glowText(ctx, 'MEANING', 0, 10, { size: 28, weight: 700, align: 'center', col: rgba(P.halo1, .6), glow: false, spacing: .16 });
  ctx.restore();
  return { x, y, s, mid: [x, y + (1 - k) * 40 * s] };
}

// ======================================================================================================================== THE BARN
// the barn at night (hook, 3:53, 6:50, 9:40, end screen). Draw with an E.cam3 camera c; the caller draws pigs and you on the F0 card
// at BARN places (barnCast does both with default life). Cards: wall 7000 · lamp 3600 · floor/fence/pigs/you F0.
export const BARN = { ground: 790, lamp: [965, 250], pig1: { x: 640, h: 205, dir: 1 }, pig2: { x: 1300, h: 205, dir: -1 }, you: { x: 175, h: 360 }, fence: 318 };
const STRAW = (() => { const r = prng(2403), s = []; for (let i = 0; i < 520; i++) { const x = -300 + r() * 2520, y = BARN.ground - 8 + r() ** 1.6 * 320; s.push([x, y, (r() - .5) * 1.1, 10 + r() * 22, r()]); } return s; })();
const MOTES = (() => { const r = prng(2404), m = []; for (let i = 0; i < 90; i++) m.push([(r() - .5) * 1.8, r(), .012 + r() * .02, r() * 6.3, 1.6 + r() * 2.2]); return m; })();
export function barn(ctx, c, t, o = {}) {
  const [lx, ly] = BARN.lamp, lit = (o.lamp ?? 1) * (1 + .02 * Math.sin(t * 2.1) + .012 * Math.sin(t * 5.3));
  card(ctx, c, 7000, () => {   // the back wall: boards barely seen, the lamp's glow on it
    ctx.fillStyle = lin(ctx, 0, -600, 0, H + 600, [[0, P.night0], [.5, mixHex(P.night1, P.ind0, .4)], [1, P.night1]]); ctx.fillRect(-1600, -900, W + 3200, H + 1800);
    ctx.fillStyle = rad(ctx, lx, ly + 260, 900, [[0, rgba(P.shade0, .28 * lit)], [.5, rgba(P.blue0, .08 * lit)], [1, rgba(P.night1, 0)]]); ctx.fillRect(-1600, -900, W + 3200, H + 1800);
    ctx.strokeStyle = rgba(P.night0, .35); ctx.lineWidth = 3; for (let x = -1500; x < W + 1500; x += 118) { ctx.beginPath(); ctx.moveTo(x, -900); ctx.lineTo(x, H + 900); ctx.stroke(); }
    ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(-1600, 108, W + 3200, 26);   // a beam
  });
  card(ctx, c, 3600, () => {   // the hanging lamp: cord, a dark shade, the warm bulb (the hero light) and its soft cone
    const x = lx, y = ly;   // a card maps 1:1 at the home camera
    ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, -900); ctx.lineTo(x, y - 60); ctx.stroke();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, y, 0, y + 1500, [[0, rgba(P.halo1, .2 * lit)], [1, rgba(P.halo1, 0)]]);
    ctx.beginPath(); ctx.moveTo(x - 70, y + 6); ctx.lineTo(x + 70, y + 6); ctx.lineTo(x + 900, y + 1500); ctx.lineTo(x - 900, y + 1500); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';   // dust drifting in the lamp's cone (secondary action: the air is alive)
    for (const [u0, v0, sp, ph, r] of MOTES) {
      const v = ((v0 + t * sp) % 1 + 1) % 1, yy = y + 40 + v * 1250, half = 60 + v * 760, xx = x + (u0 + .08 * Math.sin(t * .4 + ph)) * half;
      const a = .35 * Math.sin(Math.PI * v) * (.55 + .45 * Math.sin(t * 1.7 + ph * 3)) * lit;
      ctx.fillStyle = rgba(P.core1, a); ctx.beginPath(); ctx.arc(xx, yy, r, 0, TAU); ctx.fill();
    }
    ctx.restore();
    halo(ctx, x, y + 14, 720 * lit, .55 * lit, P.halo1, P.core1);
    ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.beginPath(); ctx.moveTo(x - 30, y - 64); ctx.lineTo(x + 30, y - 64); ctx.lineTo(x + 92, y + 6); ctx.lineTo(x - 92, y + 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(x - 92, y + 3, 184, 4);
    ctx.fillStyle = rad(ctx, x, y + 10, 34, [[0, P.core0], [.6, P.core1], [1, rgba(P.halo0, 0)]]); ctx.beginPath(); ctx.arc(x, y + 12, 26, 0, TAU); ctx.fill();
  });
  card(ctx, c, F0, () => {   // the straw floor with the light pool and straws
    const g = BARN.ground;
    ctx.fillStyle = lin(ctx, 0, g - 20, 0, H + 400, [[0, mixHex(P.shade0, P.ind1, .55)], [.25, mixHex(P.shade0, P.night1, .72)], [1, P.night0]]); ctx.fillRect(-1200, g - 18, W + 2400, H + 800);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, lx, g + 40, 760, [[0, rgba(P.halo1, .3 * lit)], [.55, rgba(P.shade0, .1 * lit)], [1, rgba(P.shade0, 0)]]); ctx.save(); ctx.translate(lx, g + 40); ctx.scale(1, .28); ctx.translate(-lx, -(g + 40)); ctx.fillRect(lx - 800, g - 800, 1600, 1700); ctx.restore();
    ctx.restore();
    ctx.lineCap = 'round';
    for (const [x, y, a, len, q] of STRAW) {   // straws: warm where the light falls, a slow sway
      const d = Math.hypot((x - lx) / 1.5, (y - g) * 2.4), w = clamp(1 - d / 820);
      ctx.strokeStyle = rgba(mixHex(P.shade0, P.halo1, w), (.18 + .5 * w) * (.6 + .4 * q)); ctx.lineWidth = 2 + 1.5 * q;
      const aa = a + .03 * Math.sin(t * .6 + q * 9); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(aa) * len, y + Math.sin(aa) * len * .35 - len * .1); ctx.stroke();
    }
  });
}
// the fence at the left (a post and two rails; you lean on the upper rail): draw it on the F0 card after you
export function fence(ctx) {
  const fx = BARN.fence, g = BARN.ground;
  ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(fx - 14, g - 300, 28, 312); ctx.fillRect(-400, g - 232, fx + 420, 20); ctx.fillRect(-400, g - 130, fx + 420, 18);
  ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(fx + 10, g - 300, 4, 312); ctx.fillRect(-400, g - 232, fx + 414, 3); ctx.fillRect(-400, g - 130, fx + 414, 3);
}
// the barn with its cast at default life: pig 1 calm (roots slowly in the straw), pig 2 restless; o.p1 / o.p2 override pig options,
// o.you = du() options (or false). Returns { p1, p2, you, P: (u, v) → screen } (pig anchors are in F0 design units; map with P).
export function barnCast(ctx, c, t, o = {}) {
  barn(ctx, c, t, o);
  const out = { P: (u, v) => project(c, F0, u, v) };
  card(ctx, c, F0, () => {
    const B = BARN;
    out.p1 = pig(ctx, t, B.pig1.x, B.ground, B.pig1.h, { dir: 1, light: 1, warm: .85, seed: 1, root: .3 + .3 * Math.sin(t * .29), breath: 1.1, ...o.p1 });
    out.p2 = pig(ctx, t, B.pig2.x, B.ground, B.pig2.h, { dir: -1, light: -1, warm: .7, seed: 3, breath: 1.5, ear: .12 * Math.max(0, Math.sin(t * 1.3)) ** 6, ...o.p2 });
    if (o.you) out.you = du(ctx, B.you.x, B.ground + 26, B.you.h, { dir: 1, view: 'side', light: 1, armR: [1.45, 1.95], armL: [1.3, 1.9], ...o.you });
    if (o.fence !== false) fence(ctx);
  });
  return out;
}

// ======================================================================================================================== CLIPS (ORIGINAL FOOTAGE)
// The frame grows out of a medallion (o.from = [cx, cy, r], o.morph 0..1: circle → CLIP_RECT) and shrinks back after the clip.
// Footage: <F24CLIPS or ROOT/clips>/<id>/f00001.jpg… (30 fps), metadata (offset, fit, name, role, year) from audio/clips.json.
export const CLIP_RECT = { x: 120, y: 112, w: 1680, h: 945 };
const CLIPS0 = {
  C1: { name: 'Aza Raskin', role: 'Co-founder, Earth Species Project · StarTalk', year: '2026', len: 10, col: 'gold', after: 'Here he is' },
  C2: { name: 'Elephant playback', role: 'Colorado State University', year: '2024', len: 9, col: 'cream', after: 'They caught it on camera' },
  C3: { name: 'Denise Herzing', role: 'Wild Dolphin Project · Google', year: '2025', len: 8, col: 'cream', after: "Here's what she hopes for" },
  C4: { name: 'Twain, a humpback whale', role: 'WhaleSETI', year: '2024', len: 9, col: 'cream', after: 'for twenty minutes' },
  C5: { name: 'Aza Raskin', role: 'Earth Species Project · StarTalk', year: '2026', len: 10, col: 'gold', after: 'a warning about that' },
};
const CLIPS_JSON = [process.env.F24CLIPSJSON, new URL('../audio/clips.json', import.meta.url).pathname, ROOT + 'audio/clips.json'].find((f) => f && fs.existsSync(f));
export const CLIPMETA = CLIPS_JSON ? JSON.parse(fs.readFileSync(CLIPS_JSON, 'utf8')) : {};
export const CLIPS = Object.fromEntries(Object.entries(CLIPS0).map(([id, c]) => { const m = CLIPMETA[id] || {}; return [id, { ...c, ...Object.fromEntries(['name', 'role', 'year', 'fit'].filter((k) => m[k]).map((k) => [k, m[k]])) }]; }));
const CLIPDIR = (process.env.F24CLIPS || ROOT + 'clips/').replace(/\/?$/, '/');
const nFrames = new Map();
function frameCount(id) { if (!nFrames.has(id)) { let n = 0; try { n = fs.readdirSync(CLIPDIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nFrames.set(id, n); } return nFrames.get(id); }
function frameAt(id, t, win) { const n = frameCount(id); if (!n) return 0; const off = (CLIPMETA[id] || {}).offset || 0; return Math.max(1, Math.min(n, Math.floor((t - win.start - off) * 30) + 1)); }
const framePath = (id, k) => `${CLIPDIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const frameCache = new Map();
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    const win = clipWin(T, id); if (!win || t < win.start - .8 || t > win.end + .8) continue;
    const k = frameAt(id, t, win); if (!k) continue;
    const f = framePath(id, k); if (frameCache.has(f)) continue;
    if (frameCache.size > 48) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
function clipFrameAt(id, t, win) { const k = frameAt(id, t, win); return k ? frameCache.get(framePath(id, k)) || null : null; }
export function clipWin(T, id) {
  const c = T.clip && T.clip(id); if (c) return { start: c.start, end: c.end };
  const ph = CLIPS[id] && CLIPS[id].after; if (ph && T.gHas(ph)) { const s = T.GE(ph) + .7; return { start: s, end: s + CLIPS[id].len }; }
  return null;
}
// o: { from: [cx, cy, r] (the medallion it grows out of), morph 0..1 (0 = the circle, 1 = CLIP_RECT), dark 0..1, credits }
export function clipPlate(ctx, t, T, id, o = {}) {
  const R = CLIP_RECT, win = clipWin(T, id) || { start: t, end: t + 1 }, info = CLIPS[id], C = colOf(info.col), m = sineIO(clamp(o.morph ?? 1)), dark = clamp(o.dark ?? 0);
  const f = o.from ?? [R.x + R.w / 2, R.y + R.h / 2, 20];
  const cx = lerp(f[0], R.x + R.w / 2, m), cy = lerp(f[1], R.y + R.h / 2, m), w = lerp(f[2] * 2, R.w, m), h = lerp(f[2] * 2, R.h, m), rr = lerp(f[2], 14, m);
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
    if (m > .6) { ctx.globalAlpha = (1 - dark) * .8 * span(m, .6, 1); E.glowText(ctx, `${id} · ${info.name.toUpperCase()} · FOOTAGE GOES HERE`, cx, cy + 10, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(cx - w * .4, cy + h * .12, w * .8 * u, 3); ctx.globalAlpha = 1; }
  }
  if (dark > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .4), dark); ctx.fillRect(cx - w / 2, cy - h / 2, w, h); }
  ctx.restore();
  ctx.strokeStyle = C.core; ctx.lineWidth = lerp(Math.max(2, f[2] * .12), 3, m); shape(); ctx.stroke();
  const lu = (o.credits === false ? 0 : 1) * (o.label ?? (span(t, win.start + .2, win.start + 1.1) * (1 - span(t, win.end - .5, win.end + .1)))) * span(m, .85, 1);
  if (lu > 0) {
    const by = R.y - 26;
    const nw = maskLine(ctx, [[info.name, info.col === 'gold' ? 1 : 0]], R.x, by, 40, rise(lu), { glow: true });
    maskLine(ctx, [[`${info.role.toUpperCase()} · ${info.year}`, 0]], R.x + nw.w + 22, by - 2, 20, rise(lu), { serif: false, col: P.halo2, glow: false });
    maskLine(ctx, [['ORIGINAL FOOTAGE', 0]], R.x + R.w - measure('ORIGINAL FOOTAGE', 20, false), by - 2, 20, rise(lu), { serif: false, col: P.halo0, glow: false });
  }
  ctx.restore();
  return { cx, cy, w, h };
}

// ======================================================================================================================== TEXT HELPERS
// the hook's question line (and its callbacks): big serif, rises on t0, sinks from t1
export function questionLine(ctx, t, t0, t1, o = {}) {
  const u = rise(span(t, t0 - .15, t0 + .7)) * (t1 != null ? 1 - expoIn(span(t, t1, t1 + .5)) : 1);
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [[o.text ?? '', o.warm ?? 0]], o.x ?? 960, o.y ?? 150, o.size ?? 64, u, { align: o.align ?? 'center' });
  ctx.restore();
}
// a pinned label: a thin line from the anchor (x, y) up-right, then NAME / sub (wipe in from below). u 0..1
export function label(ctx, x, y, l1, l2, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const dx = o.dx ?? 60, dy = o.dy ?? -60, x1 = x + dx, y1 = y + dy, C = colOf(o.col);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  rule(ctx, x, y, x1, y1, smooth(clamp(u * 1.6)), { w: 2 });
  ctx.strokeStyle = rgba(C.line, .6 * u); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + (o.w ?? 220) * expoOut(u), y1); ctx.stroke();
  maskLine(ctx, [[l1, o.col === 'gold' ? 1 : 0]], x1 + 4, y1 - 12, o.size ?? 28, u, { serif: false, weight: 600, col: C.core, glow: false });
  if (l2) maskLine(ctx, [[l2, 0]], x1 + 4, y1 + 28, (o.size ?? 28) * .62, rise(span(u, .2, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
}
