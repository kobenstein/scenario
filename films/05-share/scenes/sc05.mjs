// C5 · §2 objection, §3 Alaska, Norway, humanity · shots 2.24–3.13 · ★ 3.06 (Alaska under the aurora, the same envelope in every mailbox)
//
// | Shot  | t (entry)                  | Hero onset (word)                                        | Carrier → next                                   | Type |
// |-------|----------------------------|----------------------------------------------------------|--------------------------------------------------|------|
// | 2.24  | carry c04>c05 (zoom)       | the AGREE line lands as the signature line; bar shadows  | one huge bar shadow sweeps left over the frame:  | a    |
// |       |                            | slide in, one crosses the signature on "problem"         | its darkness is the night of 3.01 (cut)          |      |
// | 3.01  | "You're probably" −.3, cut | your phone over the shoulder, cursor blinks, the thumb   | the cursor → push-in (zoom)                      | b    |
// |       |                            | hovers and twitches on "thinking"                        |                                                  |      |
// | 3.02  | "The rich" −.3, zoom       | the comment types with the voice; the column of the same | the column scrolls up and away → whipU           | c    |
// |       |                            | sentence by many users scrolls on "never"; send          |                                                  |      |
// | 3.03  | "For what they" −.15, whipU| the villa behind bars; the gate swings shut from "own",   | lateral whip along the bars → whipL              | c    |
// |       |                            | latch ≈ after "right"; bar shadows slice the moonlight   |                                                  |      |
// | 3.04  | "But this fortune" −.2,    | the fence ends, open land at dawn, the paper scaffold    | the lamp → push-in (zoom), its light becomes the | b    |
// |       | whipL                      | far away, nobody's ("no one"); the top lamp on "Yet"     | burin that engraves the rule in 3.05             |      |
// | 3.05  | "And where the" −.1, zoom  | the rule engraved + seal on "rules"; the riches arrive   | the rule unwinds into Alaska's coast (in-draw)   | morph|
// |       |                            | on "riches", split into equal shares; stretch "worked"   |                                                  |      |
// | 3.06★ | (same entry)               | coast laid on "decades"; the coast thread lifts into the | the cabin's envelope → push-in (zoom)            | b    |
// |       |                            | aurora, the land descends; envelopes light on "same"     |                                                  |      |
// | 3.07a | "Every year" −.12, zoom    | seasons turn at the cabin's mailbox, the envelope returns| a gust drives the snow right → whipR             | c    |
// | 3.07b | "Rich or poor" −.12, whipR | two hands pull equal envelopes on "poor"                 | the envelopes drop out of frame → down           | a    |
// | 3.07c | "Child or adult" −.15, down| child + grandmother open the same envelope on "adult"    | the envelope flies right → whipR (the licence)   | a    |
// | 3.08  | "Norway made" −.2, whipR   | STATE STAKE seal presses on "state owned"; push into the | a drop, rings on the water → push-in (zoom)      | b    |
// |       |                            | vignette, it becomes the fjord on "before"               |                                                  |      |
// | 3.09  | "Today its fund" −.2, zoom | the rings become Nvidia's rosette; a 1.3 % foil slice    | the slice → push-in (zoom)                       | b    |
// |       |                            | lifts on "Nvidia"; the rosette grows on "giant"          |                                                  |      |
// | 3.10  | "About eleven" −.15, zoom  | the slice splits into equal strips, one per figure; the  | pull back (out) into Norway on the world map     | b    |
// |       |                            | row runs into depth on "every Norwegian"                 |                                                  |      |
// | 3.12  | "Taken as one" −.25, out   | microtext HUMANITY runs around all land from Norway;     | the bar → plansequenz                            | —    |
// |       |                            | the bar stops just below HIGH INCOME on "almost rich"    |                                                  |      |
// | 3.13  | (same entry)               | the bar splits into unequal bars on "each"; they merge   | the bar thins to a stroke, becomes the pen;      | a    |
// |       |                            | again on "together"                                       | carry c05>c06 takes it right                     |      |
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eout, eio, ein, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { source } from '../lib/kit.mjs';
import { carry } from '../lib/carry.mjs';
import { scribble, pen } from '../lib/paper.mjs';
import { seal, rosette, microPath, microtext, peel, unwind, resample, ring, ripple, foilGlint, gBorder } from '../lib/certificate.mjs';
import { heldPhone } from '../lib/phone.mjs';
import { figureFlat } from '../lib/figure.mjs';
import { scaffold } from '../lib/scaffold.mjs';
import { worldMap, project } from '../lib/map.mjs';
import { stipple, hatch as artHatch, fog as artFog, vnoise, fbm } from '../lib/art.mjs';
import { villaGate, fenceEnd } from '../lib/sc05_villa.mjs';
import { auroraBase, northWide, seasonsMailbox, twoBoxes, porch, mixHex } from '../lib/sc05_north.mjs';
import { alaska, coastLayers, revealAlong, plateBack, plateFront, tipBloom, START } from '../lib/sc05_coast.mjs';
import { licence, fjord, RINGPT } from '../lib/sc05_fjord.mjs';
import { landRings, landMap } from '../lib/sc05_land.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2, CREAM = '#f3efe2', AMB = '#ffb35c', CORE = '#fff1d6';
const poly = (ctx, P, i0 = 0, i1 = P.length - 1) => { ctx.beginPath(); for (let i = i0; i <= i1; i++) i === i0 ? ctx.moveTo(P[i][0], P[i][1]) : ctx.lineTo(P[i][0], P[i][1]); };
const label = (ctx, s, x, y, a, o = {}) => { if (a > 0) text(ctx, s, x, y, { size: o.size ?? 17, weight: o.weight ?? 600, color: rgba(o.col ?? CREAM, (o.alpha ?? .9) * a), spacing: o.spacing ?? 4, align: o.align ?? 'left', font: o.font }); };
const fadeIO = (t, a, b, i = .5, o = .5) => eout(lin(a, a + i, t)) * (1 - lin(b - o, b, t));

export default (T, R) => {
  const S = (seg, p, n) => T.S(seg, p, n), E = (seg, p, n) => T.E(seg, p, n);
  const CIN = carry('c04>c05', T, R), COUT = carry('c05>c06', T, R);
  // ---- anchors (film seconds, from the voice) ----
  const a = {
    problem: S('03a', 'obvious problem'), probably: S('03a', "You're probably"), thinking: S('03a', 'probably thinking') + .24,
    rich: S('03a', 'The rich'), never: S('03a', 'rich never') + .56, own: S('03a', 'already own'), right: E('03a', 'often right'), forWhat: S('03a', 'For what they'),
    fortune: S('03b', 'But this fortune'), noOne: S('03b', 'to no one') + .16, yet: S('03b', 'Yet'), andWhere: S('03b', 'And where the'), rules: S('03b', 'the rules') + .16,
    before: S('03b', 'came before'), riches: S('03b', 'the riches') + .12, sharing: S('03b', 'sharing has'), worked: S('03b', 'has worked') + .16,
    decades: S('03b', 'For decades'), every: S('03b', 'almost every'), same: S('03b', 'the same share') + .28, money: E('03b', 'oil money'),
    year: S('03b', 'Every year'), poor: S('03b', 'or poor') + .24, child: S('03b', 'Child or'), adult: S('03b', 'or adult') + .16,
    norway: S('03b', 'Norway made'), stateOwned: S('03b', 'the state owned') + .16, bigBefore: S('03b', 'oil before') + .52, came: E('03b', 'money came'),
    today: S('03b', 'Today its'), nvidia: S('03b', 'of Nvidia') + .12, giant: S('03b', 'a giant') + .16, about: S('03b', 'About eleven'), everyN: S('03b', 'every Norwegian'),
    taken: S('03b', 'Taken as'), humanity: S('03b', 'country, humanity') + .72, almost: S('03b', 'already almost') + .56, each: S('03b', 'Not each') + .24, together: S('03b', 'us, together') + .48,
  };
  const out = [];
  // ======================= 2.24 · the signed sheet, the shadow of bars =======================
  out.push({
    t: CIN.into.t, tr: CIN.into.tr, x: CIN.into.x, y: CIN.into.y, d: CIN.into.d,
    draw: (ctx, t) => { sheetShot(ctx, t, a, CIN); },
  });
  // ======================= 3.01 · your phone, over the shoulder =======================
  const FLD = [969, 560];   // the comment field's centre after phoneShot's settle (960,560) + B's field offset; B's field is 3.44× as wide
  out.push({ t: a.probably - .3, tr: 'cut', d: .1, draw: (ctx, t) => phoneShot(ctx, t, a) });
  // ======================= 3.02 · "the rich never share", the column =======================
  out.push({ t: a.rich - .3, tr: 'zoom', x: FLD[0], y: FLD[1], depth: 3.44, d: .55, draw: (ctx, t) => commentShot(ctx, t, a, T),
    sound: [{ f: 'phone_tap', t: a.never + .55, v: .3 }] });
  // ======================= 3.03 · the villa behind bars =======================
  out.push({ t: a.forWhat - .15, tr: 'whipU', d: .5, draw: (ctx, t) => villaShot(ctx, t, a),
    sound: [{ f: 'stamp', t: a.right + .08, v: .28 }] });
  // ======================= 3.04 · open land, the scaffold, nobody's — "Yet" =======================
  const LAMP = [1088, 325];
  out.push({ t: a.fortune - .2, tr: 'whipL', d: .45, draw: (ctx, t) => landShot(ctx, t, a),
    sound: [{ f: 'lamp', t: a.yet - .06, v: .45 }] });
  // ======================= 3.05 + 3.06 ★ · the rule, the riches, Alaska =======================
  const ENV = [960, 540];   // the cabin's envelope at the end of 3.06: alaskaShot settles it to the centre before the zoom
  out.push({ t: a.andWhere - .1, tr: 'zoom', x: LAMP[0], y: LAMP[1], depth: 5, d: .6, draw: (ctx, t) => alaskaShot(ctx, t, a) });
  // ======================= 3.07a · every year =======================
  out.push({ t: a.year - .12, tr: 'zoom', x: ENV[0], y: ENV[1], depth: 4, d: .5, draw: (ctx, t, s) => seasonsShot(ctx, t, a),
    sound: [{ f: 'gust', t: a.year + 1.06, v: .3 }] });
  // ======================= 3.07b · rich or poor =======================
  out.push({ t: S('03b', 'Rich or') - .12, tr: 'whipR', d: .35, draw: (ctx, t) => boxesShot(ctx, t, a) });
  // ======================= 3.07c · child or adult =======================
  out.push({ t: a.child - .15, tr: 'down', d: .4, draw: (ctx, t) => porchShot(ctx, t, a) });
  // ======================= 3.08 · Norway's licence → the fjord =======================
  out.push({ t: a.norway - .2, tr: 'whipR', d: .4, draw: (ctx, t) => licenceShot(ctx, t, a),
    sound: [{ f: 'drop', t: a.came + .06, v: .4 }] });
  // ======================= 3.09 · Nvidia's rosette, the fund's slice =======================
  out.push({ t: a.today - .05, tr: 'zoom', x: 960, y: 540, depth: 3, d: .5, draw: (ctx, t) => nvidiaShot(ctx, t, a) });
  // ======================= 3.10 · ≈ $11,000 for every Norwegian =======================
  out.push({ t: a.about - .15, tr: 'zoom', x: SLICE_TIP[0], y: SLICE_TIP[1], depth: 3, d: .5, draw: (ctx, t) => rowShot(ctx, t, a) });
  // ======================= 3.12 + 3.13 · humanity, almost rich; not each of us — all of us =======================
  const NOR = project(MAPCAM, 9.5, 61.5);
  out.push({ t: a.taken - .25, tr: 'out', x: NOR[0], y: NOR[1], depth: 6, d: 1.0, draw: (ctx, t) => worldShot(ctx, t, a, COUT) });
  return out;
};

// =====================================================================================================================
// 2.24 · the signed sheet at the stake; the light turns, the shadow of tall bars falls over the signature
// =====================================================================================================================
function fieldBack() {
  return once('fieldback', () => {
    const [c, g] = canvas(W + 200, H + 100);
    const sg = g.createLinearGradient(0, 0, 0, c.height); sg.addColorStop(0, '#e9d3ad'); sg.addColorStop(.42, '#d6b98e'); sg.addColorStop(.48, '#8a6a4a'); sg.addColorStop(1, '#4a3426'); g.fillStyle = sg; g.fillRect(0, 0, c.width, c.height);
    g.strokeStyle = 'rgba(40,26,16,.35)'; g.lineWidth = 3; for (let i = -40; i < 60; i++) { g.beginPath(); g.moveTo(1100 + i * 18, 520); g.lineTo(1100 + i * 140, c.height); g.stroke(); }
    artFog(g, { y0: 300, y1: 700, col: '#f6ead2', a: .7, seed: 3, sx: .0015, sy: .01, cover: .5, soft: .5, k: .6, x1: c.width });
    const [b, bg] = canvas(W + 200, H + 100); bg.filter = 'blur(9px)'; bg.drawImage(c, 0, 0); bg.filter = 'none';
    stipple(b, { k: .5, g: 1, seed: 4, mid: false, boost: 1.2 }); return b;
  });
}
const SH = { x: 470, y: 90, w: 980, h: 1110, line: [726, 1194, 640] };
function sheetLayer() {
  return once('sheet224', () => {
    const [c, g] = canvas(W, H + 200);
    // the stake behind the sheet
    const sx = 905, sw = 110, wg = g.createLinearGradient(sx, 0, sx + sw, 0); wg.addColorStop(0, '#3b2a1c'); wg.addColorStop(.4, '#6b4f36'); wg.addColorStop(1, '#2a1c12'); g.fillStyle = wg; g.fillRect(sx, -20, sw, 200);
    g.strokeStyle = 'rgba(20,12,6,.45)'; g.lineWidth = 1.2; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(sx + 8 + i * 11, -20); g.bezierCurveTo(sx + 4 + i * 12, 60, sx + 14 + i * 11, 120, sx + 6 + i * 12, 200); g.stroke(); }
    // the sheet
    g.save(); g.shadowColor = 'rgba(30,18,8,.5)'; g.shadowBlur = 30; g.shadowOffsetX = 14; g.shadowOffsetY = 18; g.fillStyle = '#efe6cf'; g.fillRect(SH.x, SH.y, SH.w, SH.h); g.restore();
    const pg = g.createRadialGradient(1300, 200, 0, 1000, 600, 1100); pg.addColorStop(0, '#fbf3e1'); pg.addColorStop(.6, '#efe4cc'); pg.addColorStop(1, '#c9b693'); g.fillStyle = pg; g.fillRect(SH.x, SH.y, SH.w, SH.h);
    // nail
    g.fillStyle = '#5b5550'; g.beginPath(); g.arc(960, 122, 9, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.arc(957, 119, 3, 0, TAU); g.fill();
    text(g, 'AGREEMENT', 960, 240, { size: 62, font: 'Instrument Serif', color: '#2a2030', align: 'center', spacing: 4 });
    text(g, 'HOW THE FORTUNE WILL BE SHARED', 960, 282, { size: 16, weight: 600, color: 'rgba(42,32,48,.7)', align: 'center', spacing: 5 });
    const r = prng(7); g.fillStyle = 'rgba(42,32,48,.22)'; for (let i = 0; i < 8; i++) { const y = 345 + i * 30; let x = 600; while (x < 1320) { const w = 30 + r() * 90; if (x + w > 1320) break; g.fillRect(x, y, w, 4); x += w + 12; } }
    g.strokeStyle = 'rgba(42,32,48,.55)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(SH.line[0] - 18, SH.line[2] - 24); g.lineTo(SH.line[0] - 6, SH.line[2] - 12); g.moveTo(SH.line[0] - 6, SH.line[2] - 24); g.lineTo(SH.line[0] - 18, SH.line[2] - 12); g.stroke();
    text(g, 'SIGNATURE', SH.line[0], SH.line[2] + 30, { size: 14, weight: 600, color: 'rgba(42,32,48,.55)', spacing: 4 });
    signature(g, 772, SH.line[2] - 14, 5);
    stipple(c, { k: .35, g: 1, seed: 9, mid: false, boost: 1 });
    return c;
  });
}
function signature(g, x, y, seed) {   // unreadable cursive: a tall opening loop, a run of small loops, an underline flourish
  const r = prng(seed); g.save(); g.strokeStyle = '#1b2a6b'; g.lineWidth = 3.4; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(x, y);
  g.bezierCurveTo(x + 6, y - 74, x + 44, y - 92, x + 34, y - 26); g.bezierCurveTo(x + 28, y + 12, x + 2, y + 2, x + 22, y - 12);
  let cx = x + 40; for (let i = 0; i < 10; i++) { const h = 16 + r() * 26, ww = 20 + r() * 16, lp = r() < .3; g.bezierCurveTo(cx + ww * .25, y - h, cx + ww * (lp ? 1.1 : .8), y - h * (lp ? 1.3 : 1), cx + ww * .55, y - 3); g.bezierCurveTo(cx + ww * .45, y + 8, cx + ww * .9, y + 6, cx + ww, y - 5); cx += ww; }
  g.bezierCurveTo(cx + 50, y - 40, cx + 20, y + 26, x + 50, y + 16); g.bezierCurveTo(x + 140, y + 10, x + 240, y + 6, cx - 30, y + 2); g.stroke();
  g.lineWidth = 1.2; g.globalAlpha = .5; g.stroke(); g.restore();
}
function hatchFull() { return once('hatchfull', () => { const [c, g] = canvas(W, H); artHatch(g, [0, 0, W, H], { angle: -.85, gap: 6, w: 1.2, col: '#0a0c22', a: .5, wobble: .8, seed: 13, broken: .15 }); return c; }); }
function sheetShot(ctx, t, a, C) {
  const t0 = C.t, z = 1 + .05 * eio(lin(t0, a.problem + .7, t)), dx = drift(t, 6, 1), dy = drift(t, 4, 2);
  ctx.save(); ctx.translate(960, 640); ctx.scale(z, z); ctx.translate(-960 + dx, -640 + dy);
  ctx.drawImage(fieldBack(), -100 - dx * .5, -50 - dy * .5);
  ctx.drawImage(sheetLayer(), 0, 0);
  // the signature line: the carried AGREE light settles into an engraved amber line
  const settle = sm(lin(t0 + .5, t0 + 1.3, t)), [x0, x1, ly] = SH.line;
  ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = mixHex('#ffb35c', '#a8641e', settle); ctx.lineWidth = 2.6; ctx.globalAlpha = settle; ctx.beginPath(); ctx.moveTo(x0, ly); ctx.lineTo(x1, ly); ctx.stroke(); ctx.restore();
  { const p = new Path2D(); p.rect(x0 - 4, ly - 3, x1 - x0 + 8, 6); foilGlint(ctx, p, t, { x: x0 - 200, y: ly, span: 900, width: 90, speed: .35, a: settle }); }
  seal(ctx, 1318, 610, 62, t, { foil: true, rot: -.2 });
  ctx.restore();
  // the light turns: the shadows of tall bars slide in from the right, rotating; one crosses the signature on "problem"
  const ent = eio(lin(t0 + .6, a.problem + .25, t)), ang = mix(.42, .16, ent), X0 = mix(2350, 520, ent), gap = 230;
  const sweep = ein(lin(a.problem + .32, a.probably - .32, t));            // the last, huge bar shadow wipes the frame to the left
  const dxA = Math.tan(ang) * (H + 80), nx = Math.cos(ang), ny = Math.sin(ang);
  const stripe = (x, w, al, hatchIt) => {   // a soft-edged bar shadow: gradient across, constant along
    const x0 = x, y0 = -40, x1 = x - dxA, y1 = H + 40, g = ctx.createLinearGradient(x0 - nx * w, y0 - ny * w, x0 + nx * w, y0 + ny * w);
    g.addColorStop(0, 'rgba(10,12,34,0)'); g.addColorStop(.28, `rgba(10,12,34,${al})`); g.addColorStop(.72, `rgba(10,12,34,${al})`); g.addColorStop(1, 'rgba(10,12,34,0)');
    const p = new Path2D(); p.moveTo(x0 - nx * w, y0 - ny * w); p.lineTo(x0 + nx * w, y0 + ny * w); p.lineTo(x1 + nx * w, y1 + ny * w); p.lineTo(x1 - nx * w, y1 - ny * w); p.closePath();
    ctx.fillStyle = g; ctx.fill(p);
    if (hatchIt) { const q = new Path2D(); const w2 = w * .45; q.moveTo(x0 - nx * w2, y0 - ny * w2); q.lineTo(x0 + nx * w2, y0 + ny * w2); q.lineTo(x1 + nx * w2, y1 + ny * w2); q.lineTo(x1 - nx * w2, y1 - ny * w2); q.closePath(); ctx.save(); ctx.clip(q); ctx.globalAlpha = .35 * al / .55; ctx.drawImage(hatchFull(), 0, 0); ctx.restore(); }
  };
  const cool = sm(lin(t0 + .8, a.problem + .3, t));
  ctx.save(); ctx.fillStyle = `rgba(20,26,60,${.2 * cool})`; ctx.fillRect(0, 0, W, H); ctx.restore();
  // the bars arrive one after another (the light turning), each slightly blurrier the farther its bar
  for (let k = 0; k < 8; k++) { const on = sm(lin(t0 + .5 + k * .12, t0 + 1.0 + k * .12, t)); if (on > 0) stripe(X0 + k * gap, 62 + k * 4, .55 * on, true); }
  if (sweep > 0) stripe(mix(2500, -500, sweep) + 600, 260 + 2400 * sweep, .96, false);
  // the incoming AGREE light, fading as it becomes the signature line
  const ca = 1 - sm(lin(t0 + .45, t0 + 1.25, t)); if (ca > 0) C.draw(ctx, t, { a: ca });
  if (sweep > .55) { ctx.fillStyle = `rgba(7,9,24,${sm(lin(.55, 1, sweep))})`; ctx.fillRect(0, 0, W, H); }
}

// =====================================================================================================================
// 3.01 · over the shoulder: your phone, the comment field, the cursor blinks, the thumb hovers
// =====================================================================================================================
function roomBack() {
  return once('room301', () => {
    const [c, g] = canvas(W, H), bg = g.createRadialGradient(1100, 520, 0, 1000, 560, 1300); bg.addColorStop(0, '#1a1d3a'); bg.addColorStop(.6, '#0b0d22'); bg.addColorStop(1, '#05060f'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.filter = 'blur(14px)'; const r = prng(17);
    for (let i = 0; i < 26; i++) { const x = 1250 + r() * 700, y = 80 + r() * 520, rr = 14 + r() * 40, warm = r() < .6; g.fillStyle = warm ? `rgba(255,${170 + r() * 50 | 0},110,${.12 + r() * .18})` : `rgba(140,170,255,${.08 + r() * .12})`; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill(); }
    g.filter = 'none'; stipple(c, { k: .5, g: 1, seed: 6, mid: false, boost: 1.2 }); return c;
  });
}
function shoulder() {
  return once('shoulder301', () => {
    const [c, g] = canvas(W, H); g.filter = 'blur(10px)';
    g.fillStyle = '#05050c'; g.beginPath(); g.moveTo(-60, H + 40); g.bezierCurveTo(-40, 820, 160, 700, 420, 690); g.bezierCurveTo(560, 690, 640, 760, 660, 860); g.lineTo(700, H + 40); g.closePath(); g.fill();
    g.beginPath(); g.ellipse(250, 520, 210, 250, -.15, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(255,200,150,.22)'; g.lineWidth = 6; g.beginPath(); g.ellipse(250, 520, 208, 248, -.15, -.9, .5); g.stroke();
    g.beginPath(); g.moveTo(430, 700); g.bezierCurveTo(560, 700, 640, 770, 655, 860); g.stroke();
    g.filter = 'none'; return c;
  });
}
function phoneScreen(g, w, h, t, o = {}) {
  g.fillStyle = '#0d0f18'; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(220,226,240,.75)'; g.font = '600 6px "Inter"'; g.fillText('23:41', 9, 9);
  // the video: the signed sheet with the bar shadows (the shot before)
  const vy = 14, vh = w * 9 / 16; g.fillStyle = '#c9b48e'; g.fillRect(0, vy, w, vh);
  g.fillStyle = '#efe6cf'; g.fillRect(w * .26, vy + 4, w * .48, vh - 4); g.fillStyle = '#a8641e'; g.fillRect(w * .34, vy + vh * .62, w * .32, 1.2);
  g.fillStyle = 'rgba(12,14,36,.6)'; for (let k = 0; k < 5; k++) { const x = w * .1 + k * 26; g.beginPath(); g.moveTo(x, vy); g.lineTo(x + 7, vy); g.lineTo(x + 3, vy + vh); g.lineTo(x - 4, vy + vh); g.closePath(); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,.15)'; g.fillRect(0, vy + vh, w, 1.5); g.fillStyle = AMB; g.fillRect(0, vy + vh, w * .62, 1.5);
  g.fillStyle = 'rgba(230,234,245,.85)'; g.fillRect(6, vy + vh + 8, w * .7, 3.2); g.fillStyle = 'rgba(230,234,245,.4)'; g.fillRect(6, vy + vh + 14, w * .45, 2.2);
  g.fillStyle = 'rgba(230,234,245,.75)'; g.font = '600 5.5px "Inter"'; g.fillText('Comments', 6, vy + vh + 28);
  for (let i = 0; i < 2; i++) { const y = vy + vh + 38 + i * 20; g.fillStyle = ['#6a5a8a', '#4a7a6a'][i]; g.beginPath(); g.arc(11, y, 4.5, 0, TAU); g.fill(); g.fillStyle = 'rgba(230,234,245,.35)'; g.fillRect(20, y - 4, 26, 2); g.fillStyle = 'rgba(230,234,245,.6)'; g.fillRect(20, y + 1, w * (.55 - i * .12), 2.4); }
  // the comment field with the blinking cursor
  const fy = h * .6 + (1 - (o.kb ?? 1)) * h * .3; g.fillStyle = '#1b1e2c'; g.beginPath(); g.roundRect(6, fy, w - 12, 16, 8); g.fill(); g.strokeStyle = rgba(AMB, .45); g.lineWidth = .7; g.stroke();
  g.fillStyle = 'rgba(200,206,222,.4)'; g.font = '500 5.5px "Inter"'; g.fillText('Add a comment…', 17, fy + 10);
  const kb = o.kb ?? 1; if (kb > .5 && Math.sin((t - 217) * Math.PI * 2 * 1.1) > -.2) { g.fillStyle = AMB; g.fillRect(14, fy + 4, 1.1, 8); }
  // keyboard
  const ky = h * .7 + (1 - kb) * h * .32; g.fillStyle = '#151824'; g.fillRect(0, ky, w, h - ky);
  for (let row = 0; row < 3; row++) { const n = [10, 9, 7][row], kw = (w - 8) / 10, off = (w - n * kw) / 2; for (let i = 0; i < n; i++) { g.fillStyle = '#2a2e40'; g.beginPath(); g.roundRect(off + i * kw + .8, ky + 5 + row * 17, kw - 1.6, 14, 2); g.fill(); } }
  g.fillStyle = '#2a2e40'; g.beginPath(); g.roundRect(w * .25, ky + 57, w * .5, 13, 2); g.fill();
  if (o.press) { const k = o.press; g.fillStyle = rgba(AMB, .35 * k); g.beginPath(); g.roundRect(w * .44, ky + 5 + 17, (w - 8) / 10 - 1.6, 14, 2); g.fill(); }
}
function thumb(ctx, x, y, s, ang) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const g = ctx.createLinearGradient(0, -30, 0, 30); g.addColorStop(0, '#c08a64'); g.addColorStop(.5, '#9a6644'); g.addColorStop(1, '#5a3622'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, -27); ctx.bezierCurveTo(60, -34, 260, -48, 420, -60); ctx.lineTo(420, 70); ctx.bezierCurveTo(260, 52, 60, 34, 0, 27); ctx.bezierCurveTo(-30, 24, -34, -24, 0, -27); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,220,190,.35)'; ctx.beginPath(); ctx.ellipse(18, -6, 22, 14, 0, 0, TAU); ctx.fill();   // nail
  ctx.strokeStyle = 'rgba(255,214,170,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-6, -24); ctx.bezierCurveTo(60, -32, 200, -42, 320, -52); ctx.stroke();   // display light on the top edge
  ctx.restore();
}
function phoneShot(ctx, t, a) {
  const t0 = a.probably - .3, z = 1 + .035 * eio(lin(t0, a.rich, t)), dx = drift(t, 5, 3), dy = drift(t, 4, 4);
  ctx.drawImage(roomBack(), 0, 0);
  // once the field has focus the camera settles onto it: the field's centre comes to the middle of the frame (the zoom lands there)
  const fc = eio(lin(a.thinking + .2, a.rich - .56, t)), z2 = 1 + .25 * fc, FZ = [1113, 697];
  ctx.save(); ctx.translate((960 - FZ[0]) * fc, (560 - FZ[1]) * fc); ctx.translate(FZ[0], FZ[1]); ctx.scale(z2, z2); ctx.translate(-FZ[0], -FZ[1]);
  ctx.translate(1000, 560); ctx.scale(z, z); ctx.translate(-1000 + dx, -560 + dy);
  // display light on the room (warm-cool spill)
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(1060, 560, 0, 1060, 560, 700); g.addColorStop(0, 'rgba(170,190,255,.14)'); g.addColorStop(1, 'rgba(170,190,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const kb = eout(lin(a.thinking - .3, a.thinking + .15, t));   // on "thinking" the field takes focus: the keyboard slides up, the cursor starts blinking
  const P = heldPhone(ctx, 1100, 590, 2.85, { t, ang: -.07, pitch: .2, lit: 1, rim: '#9fb6ff', rimA: .35, screen: (g, w, h, tt) => phoneScreen(g, w, h, tt, { kb }) });
  ctx.restore(); ctx.restore();
  ctx.drawImage(shoulder(), -40 + dx * 1.6 + (960 - FZ[0]) * fc * 1.4, 20 + dy * 1.6 + (560 - FZ[1]) * fc * 1.4);
  // fade up from the dark of the bar shadow
  const up = sm(lin(t0, t0 + .45, t)); if (up < 1) { ctx.fillStyle = `rgba(7,9,24,${1 - up})`; ctx.fillRect(0, 0, W, H); }
}

// =====================================================================================================================
// 3.02 · the comment types itself with the voice; the column of the same sentence by many users scrolls; send
// =====================================================================================================================
const SENT = 'the rich never share';
function typed(t, T) {
  const ws = T.W('03a', 'The rich', 'share.'); let n = 0, acc = 0; const parts = SENT.split(' ');
  for (let i = 0; i < parts.length; i++) { const w = ws[i]; const len = parts[i].length + (i ? 1 : 0); if (!w) break; const q = clamp((t - w.s + .06) / Math.max(.1, (w.e - w.s) * .5)); n = acc + Math.round(len * q); acc += len; if (q < 1) break; }
  return SENT.slice(0, n);
}
const AV = ['#7a5a8a', '#4a7a6a', '#8a6a3a', '#5a6a9a', '#9a4a4a', '#3a6a8a', '#6a8a4a', '#8a4a6a'];
function commentRow(ctx, x, y, i, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || y < -80 || y > H + 80) return;
  ctx.save(); ctx.globalAlpha = a;
  if (o.mine) { ctx.fillStyle = rgba(AMB, .08); ctx.strokeStyle = rgba(AMB, .55); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x - 26, y - 52, 1012, 104, 18); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = o.mine ? '#c8843a' : AV[i % AV.length]; ctx.beginPath(); ctx.arc(x + 30, y, 28, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(x + 30, y - 6, 10, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + 30, y + 18, 17, 10, 0, Math.PI, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(200,206,222,.4)'; ctx.fillRect(x + 82, y - 30, 90 + (i * 37) % 80, 7); ctx.fillStyle = 'rgba(200,206,222,.22)'; ctx.fillRect(x + 190 + (i * 37) % 80, y - 30, 40, 7);
  text(ctx, SENT, x + 82, y + 20, { size: 38, weight: 500, color: '#eef0f6' });
  ctx.strokeStyle = 'rgba(200,206,222,.45)'; ctx.lineWidth = 2; const hx = x + 900, hy = y + 2; ctx.beginPath(); ctx.moveTo(hx, hy + 9); ctx.bezierCurveTo(hx - 16, hy - 2, hx - 9, hy - 14, hx, hy - 5); ctx.bezierCurveTo(hx + 9, hy - 14, hx + 16, hy - 2, hx, hy + 9); ctx.stroke();
  ctx.fillStyle = 'rgba(200,206,222,.3)'; ctx.fillRect(hx - 8, hy + 18, 16 + (i * 13) % 20, 5);
  ctx.restore();
}
function commentShot(ctx, t, a, T) {
  const t0 = a.rich - .3, X = 460, rowH = 128;
  ctx.fillStyle = '#0b0d16'; ctx.fillRect(0, 0, W, H);
  { const g = ctx.createRadialGradient(960, 420, 0, 960, 540, 1100); g.addColorStop(0, 'rgba(60,70,120,.18)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  // camera: starts close on the field (as the cursor zoom lands), pulls back to show the column
  const pb = eio(lin(t0 + .3, a.never - .05, t)), z = mix(1.55, 1, pb), fx = 960, fy = mix(540, 820, pb);
  const FIELD_Y = 820, scrAt = (tt) => 46 * (tt - t0) + 2300 * eio(lin(a.never - .05, a.never + .62, tt)), scr = scrAt(t);
  const rot = -.07 * (1 - eio(lin(t0 - .25, t0 + .35, t)));   // the phone's tilt, straightened as the zoom lands
  ctx.save(); ctx.translate(fx, fy); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-960, -FIELD_Y);
  // the column of the same sentence (rows above the field, scrolling up)
  const sent = a.never + .6, mine = eout(lin(sent, sent + .3, t));
  ctx.save(); ctx.beginPath(); ctx.rect(0, -2000, W, FIELD_Y - 70 + 2000); ctx.clip();
  const shift = rowH * mine;
  for (let k = -24; k < 12; k++) { const y = FIELD_Y - 150 - k * rowH - scr - shift; if (y > FIELD_Y - 80 || y < -300 || (mine > 0 && y > FIELD_Y - 150 - rowH * .6 - (scr - scrAt(sent)))) continue; const fade = clamp((FIELD_Y - 70 - y) / 120) * (1 - clamp((260 - y) / 900) * .45); commentRow(ctx, X, y, k + 3, { a: .82 * fade }); }
  ctx.restore();
  // your comment leaves the field and joins the column, riding up with it
  if (mine > 0) commentRow(ctx, X, mix(FIELD_Y, FIELD_Y - 150, mine) - (scr - scrAt(sent)), 0, { a: 1, mine: true });
  // the comment field: the text types with the voice
  const s = typed(t, T), fa = 1 - sm(lin(sent, sent + .2, t));
  ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = '#171a28'; ctx.beginPath(); ctx.roundRect(X - 26, FIELD_Y - 48, 1012, 96, 48); ctx.fill(); ctx.strokeStyle = rgba(AMB, .6); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#c8843a'; ctx.beginPath(); ctx.arc(X + 30, FIELD_Y, 26, 0, TAU); ctx.fill();
  if (fa > 0) { ctx.globalAlpha = fa; if (!s.length) text(ctx, 'Add a comment…', X + 82, FIELD_Y + 13, { size: 36, weight: 500, color: 'rgba(200,206,222,.45)' }); else text(ctx, s, X + 82, FIELD_Y + 13, { size: 38, weight: 500, color: '#eef0f6' }); ctx.globalAlpha = 1; }
  ctx.font = '500 38px "Inter"'; const cw = s.length && fa > 0 ? ctx.measureText(s).width : 0;
  if (Math.sin(t * TAU * 1.2) > -.3 && t < sent) { ctx.fillStyle = AMB; ctx.fillRect(X + 84 + cw, FIELD_Y - 22, 3, 44); }
  // send button: pulses as it sends
  const pr = Math.exp(-Math.pow((t - sent) / .1, 2)); ctx.fillStyle = mixHex('#3a3020', AMB, s.length >= SENT.length ? 1 : .2); ctx.beginPath(); ctx.arc(X + 930, FIELD_Y, 30 * (1 + .18 * pr), 0, TAU); ctx.fill();
  ctx.fillStyle = '#1a1208'; ctx.beginPath(); ctx.moveTo(X + 918, FIELD_Y - 14); ctx.lineTo(X + 946, FIELD_Y); ctx.lineTo(X + 918, FIELD_Y + 14); ctx.lineTo(X + 922, FIELD_Y); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.restore();
  // speed: a faint vertical streak while the column races
  const sp = Math.sin(Math.PI * lin(a.never, a.never + .62, t)); if (sp > 0) { ctx.fillStyle = `rgba(200,206,222,${.035 * sp})`; ctx.fillRect(0, 0, W, H); }
}

// =====================================================================================================================
// 3.03 · the villa behind bars; on "own" the gate swings shut
// =====================================================================================================================
function villaShot(ctx, t, a) {
  const t0 = a.forWhat - .15, cl = a.own, latch = a.right - .12;
  let close = eio(lin(cl, latch, t)); close += .035 * Math.sin(clamp((t - latch) / .35) * Math.PI) * Math.exp(-(t - latch) * 4) * (t > latch ? 1 : 0);
  const shake = t > latch && t < latch + .25 ? Math.sin((t - latch) * 90) * 2.2 * (1 - (t - latch) / .25) : 0;
  ctx.save(); ctx.translate(0, shake);
  villaGate(ctx, t, { close, push: eio(lin(t0, a.fortune, t)), pan: 0 });
  ctx.restore();
  // the window light breathes (a living room), mist drifts low
  { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const f = .75 + .25 * Math.sin(t * 1.7) * Math.sin(t * .6 + 1); const g = ctx.createRadialGradient(1000, 470, 0, 1000, 470, 260); g.addColorStop(0, `rgba(255,180,100,${.10 * f})`); g.addColorStop(1, 'rgba(255,180,100,0)'); ctx.fillStyle = g; ctx.fillRect(700, 250, 600, 450); ctx.restore(); }
}

// =====================================================================================================================
// 3.04 · past the end of the fence: open land at dawn, the paper scaffold far away; "Yet": the top lamp
// =====================================================================================================================
function landShot(ctx, t, a) {
  const t0 = a.fortune - .2, pan = eout(lin(t0 - .2, t0 + 1.6, t)), slow = (t - t0) * 14;
  const push = ein(lin(a.yet + .45, a.andWhere + .25, t));
  const z = 1 + 1.4 * push;
  ctx.save(); ctx.translate(LAMPP[0], LAMPP[1]); ctx.scale(z, z); ctx.translate(-LAMPP[0], -LAMPP[1]);
  const A = scaffold(ctx, t, { view: 'far', mood: 'dawn', cam: { x: -60 * pan - slow * .15, y: 0, z: 1 }, fog: mix(.85, .7, sm(lin(a.noOne - .3, a.noOne + .6, t))), lights: 0, topLight: sm(lin(a.yet, a.yet + .12, t)), workers: 0 });
  const on = sm(lin(a.yet, a.yet + .1, t)); if (on > 0) beam(ctx, LAMPP[0], LAMPP[1], on * (.85 + .15 * Math.sin(t * 9) * Math.sin(t * 4.3)));
  ctx.restore();
  // the fence ends: the last bars and the end pillar slide out to the left (the pan, decelerating)
  fenceEnd(ctx, t, { x: mix(1450, -700, pan) - slow, base: 940, s: 1.75 });
  // flying into the lamp: its light fills the frame (3.05 starts inside that same light and clears to night)
  const tz = a.andWhere - .1, fl = sm(lin(tz - .42, tz - .08, t));
  if (fl > 0) {
    ctx.save(); ctx.fillStyle = rgba('#b3b7bb', fl); ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; const r = mix(240, 120, fl), rg = ctx.createRadialGradient(LAMPP[0], LAMPP[1], 0, LAMPP[0], LAMPP[1], r);
    rg.addColorStop(0, rgba('#fff1d6', .9 * fl)); rg.addColorStop(.22, rgba('#ffd9a0', .4 * fl)); rg.addColorStop(1, rgba('#ffd9a0', 0)); ctx.fillStyle = rg; ctx.fillRect(LAMPP[0] - r, LAMPP[1] - r, 2 * r, 2 * r);
    ctx.restore();
  }
}
const LAMPP = [1088, 325];
function beam(ctx, x, y, a) {   // the lamp's straight beam through the fog, to the left: it will become the rule in 3.05
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [w, al] of [[150, .05], [46, .12], [12, .35], [2.4, .95]]) { const g = ctx.createLinearGradient(x, 0, -200, 0); g.addColorStop(0, `rgba(255,230,190,${al * a})`); g.addColorStop(.5, `rgba(255,214,160,${al * a * .55})`); g.addColorStop(1, 'rgba(255,214,160,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y - w * .15); ctx.lineTo(-200, y - w / 2 + 30); ctx.lineTo(-200, y + w / 2 + 30); ctx.lineTo(x, y + w * .15); ctx.closePath(); ctx.fill(); }
  addGlow(ctx, x, y, 90, .8 * a, AMB, CORE);
  ctx.restore();
}

// =====================================================================================================================
// 3.05 + 3.06 ★ · the rule and the riches → Alaska's coast → the aurora over three houses
// =====================================================================================================================
const RULE = { x0: 300, x1: 1620, y: 540 }, NSH = 8;
function ruleBand(ctx, t, x0, x1, y, amp, u, o = {}) {
  const L = 7, xe = mix(x0, x1, u); if (xe <= x0 + 1) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < L; k++) {
    const ph = k / L * TAU; ctx.strokeStyle = rgba(k % 2 ? '#f3efe2' : '#ffd9a0', (o.a ?? 1) * .7); ctx.lineWidth = .9; ctx.beginPath();
    for (let x = x0; x <= xe; x += 4) { const yy = y + amp * (Math.sin((x - x0) * .045 + ph) * .7 + Math.sin((x - x0) * .011 - ph * 1.3) * .3); x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.stroke();
  }
  ctx.strokeStyle = rgba(CORE, (o.a ?? 1) * .95); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe, y); ctx.stroke();
  ctx.strokeStyle = rgba(AMB, (o.a ?? 1) * .16); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(xe, y); ctx.stroke();
  ctx.restore();
  return xe;
}
const SHX = (i) => mix(RULE.x0 + 150, RULE.x1 - 40, (i + .5) / NSH);
function shareMark(ctx, x, y, f, t, i) {   // one equal share: a foil lozenge on the line
  if (f <= 0) return; const w = 54 * f, h = 15 * f;
  ctx.save(); ctx.translate(x, y); const g = ctx.createLinearGradient(-w, -h, w, h); g.addColorStop(0, '#7a3b17'); g.addColorStop(.35, '#c87a2c'); g.addColorStop(.5, '#ffe2a8'); g.addColorStop(.65, '#ffb35c'); g.addColorStop(1, '#7a3b17');
  const p = new Path2D(); p.moveTo(-w, 0); p.lineTo(0, -h); p.lineTo(w, 0); p.lineTo(0, h); p.closePath(); ctx.fillStyle = g; ctx.fill(p);
  ctx.strokeStyle = 'rgba(255,240,210,.6)'; ctx.lineWidth = 1; ctx.stroke(p); foilGlint(ctx, p, t, { x: -w * 2, y: 0, span: w * 4, width: w * .6, speed: .7, phase: i * .13 });
  ctx.restore();
  addGlow(ctx, x, y, 60 * f, .25 * f, AMB, CORE);
}
const NSC = []; function northScratch() { if (!NSC.length) NSC.push(canvas(W, H)); return NSC[0]; }
function alaskaShot(ctx, t, a) {
  const t0 = a.andWhere - .1;
  // phases
  const draw = eout(lin(t0 + .22, a.rules + .25, t)), sealIn = lin(a.rules - .04, a.rules + .3, t);
  const stream = lin(a.before - .1, a.sharing + .15, t), fill = eio(lin(a.riches - .05, a.sharing + .05, t));
  const conv = eio(lin(a.worked - .1, a.worked + .4, t)), u = eio(lin(a.worked + .15, a.decades + .95, t));
  const lift = sm(lin(a.every - .6, a.every + .1, t)), fan = sm(lin(a.every - .3, a.every + .9, t)), tiltD = eio(lin(a.every - .05, a.every + 1.3, t));
  const mph = eio(lin(a.every - .75, a.every + .15, t));
  const same = eout(lin(a.same - .05, a.same + .45, t));
  // camera: map phase drifts; the tilt lifts; then a slow push toward the cabin
  const cam = { x: drift(t, 10, 1) - u * 40, y: drift(t, 6, 2) };
  const dropMap = lift * 160;
  if (lift < 1) {
    plateBack(ctx, t, cam, { dy: dropMap, warm: null });
    // flying into the lamp: the frame starts as its light and the dawn fog of 3.04 and clears to night as the zoom lands
    const fogIn = 1 - sm(lin(t0 + .05, t0 + .55, t));
    if (fogIn > 0) {
      ctx.save(); ctx.fillStyle = rgba('#b3b7bb', fogIn); ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter'; const rg = ctx.createRadialGradient(960, 540, 0, 960, 540, 520); rg.addColorStop(0, rgba('#fff1d6', .85 * fogIn)); rg.addColorStop(.22, rgba('#ffd9a0', .35 * fogIn)); rg.addColorStop(1, rgba('#ffd9a0', 0)); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    ctx.save(); ctx.translate(cam.x, cam.y + dropMap);
    // ---- the rule and the shares (3.05) ----
    const A = alaska(), N = A.pts.length, z = .06;
    const xEnd = mix(RULE.x1, START[0], conv);
    const amp = 7 * (1 - conv);
    const preUnwind = u <= 0, bm = 1 - sm(lin(t0 + .25, a.rules + .3, t));
    if (bm > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [w, al] of [[90, .05], [26, .14], [6, .4], [1.8, .9]]) { const hg = ctx.createLinearGradient(-cam.x, 0, W - cam.x, 0), e0 = al * bm * (1 - fogIn); hg.addColorStop(0, rgba(CORE, e0)); hg.addColorStop(.3, rgba(CORE, al * bm)); hg.addColorStop(.7, rgba(CORE, al * bm)); hg.addColorStop(1, rgba(CORE, e0)); ctx.fillStyle = hg; ctx.fillRect(-200, RULE.y - w / 2, W + 400, w); } ctx.restore(); }
    if (preUnwind) {
      const xe = ruleBand(ctx, t, RULE.x0, xEnd, RULE.y, amp, draw);
      // the burin light at the drawing head
      if (draw < 1 || t < a.rules + .35) { const B = tipBloom(), hx = xe ?? RULE.x0; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .9 * (1 - lin(a.rules + .1, a.rules + .4, t)) + (t < t0 + .3 ? 1 : 0); ctx.drawImage(B, hx - B.width / 2, RULE.y - B.height / 2); ctx.restore(); }
    }
    // the rule's seal at its left end
    if (sealIn > 0) { const k = mix(1.5, 1, eout(sealIn)); ctx.save(); ctx.globalAlpha = clamp(sealIn * 3) * (1 - lin(a.worked, a.worked + .5, t)); ctx.translate(RULE.x0 - 10, RULE.y); ctx.scale(k, k); ctx.beginPath(); ctx.arc(0, 0, 54 * 1.1, 0, TAU); ctx.clip(); seal(ctx, 0, 0, 54, t, { foil: true, label: 'THE RULE · FIRST', glintPhase: .2 }); ctx.restore();
      const f = Math.exp(-Math.pow((t - a.rules - .12) / .09, 2)); if (f > .02) addGlow(ctx, RULE.x0 - 10, RULE.y, 220, .6 * f, AMB, CORE); }
    // labels (each readable for > 1 s)
    label(ctx, '1 · THE RULE', RULE.x0 - 52, RULE.y + 98, fadeIO(t, a.rules + .1, a.worked + .3), { col: CREAM });
    label(ctx, '2 · THE RICHES', 1500, 300, fadeIO(t, a.before + .1, a.worked + .3), { col: '#ffd9a0', align: 'right' });
    // the stream of foil particles (the riches) arriving from the right, dividing into equal shares along the line
    if (stream > 0 && stream < 1 && u <= 0) {
      const r = prng(5), M = 520; ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < M; i++) {
        const ts = a.before - .1 + (i / M) * 1.05 + r() * .12, q = clamp((t - ts) / .85); const sh = i % NSH, tx = SHX(sh) + (r() - .5) * 60, ty = RULE.y + (r() - .5) * 18, oy = r();
        if (q <= 0 || q >= 1) continue;
        const e = eio(q), P0 = [W + 60 + r() * 200, 160 + oy * 220], P1 = [RULE.x1 + 120, RULE.y - 40], P2 = [tx, ty];
        const bx = (1 - e) * (1 - e) * P0[0] + 2 * (1 - e) * e * P1[0] + e * e * P2[0], by = (1 - e) * (1 - e) * P0[1] + 2 * (1 - e) * e * P1[1] + e * e * P2[1];
        const al = Math.sin(Math.PI * q) * (.5 + .5 * r()); ctx.fillStyle = r() < .3 ? `rgba(255,241,214,${al})` : `rgba(255,179,92,${al * .9})`; const s = 1.2 + r() * 2.2; ctx.fillRect(bx, by, s, s);
      }
      ctx.restore();
    }
    // the equal shares on the line (tick marks divide it into NSH equal parts)
    if (u <= 0) {
      const ta = clamp(fill * 2) * (1 - conv); ctx.save(); ctx.strokeStyle = rgba(CREAM, .5 * ta); ctx.lineWidth = 1; for (let i = 0; i <= NSH; i++) { const x = mix(RULE.x0 + 150, RULE.x1 - 40, i / NSH); ctx.beginPath(); ctx.moveTo(x, RULE.y - 22); ctx.lineTo(x, RULE.y + 22); ctx.stroke(); } ctx.restore();
    }
    // shares: on the line; after "worked" they lift off and become the lights of the towns along the coast
    const towns = [80, 200, 330, 470, 610, 760, 900, 1040].map((k) => A.pts[Math.min(N - 1, k)]);
    for (let i = 0; i < NSH; i++) {
      const f = clamp(fill * 1.15 - i * .015), fly = eio(lin(a.worked + .05 + i * .06, a.decades + .6 + i * .06, t));
      const x = mix(SHX(i) * (1 - conv) + mix(RULE.x0, START[0], i / NSH) * conv, towns[i][0], fly), y = mix(RULE.y, towns[i][1], fly) - Math.sin(Math.PI * fly) * 90;
      if (fly < 1) shareMark(ctx, x, y, f * (1 - fly * .7), t, i); else { const p = .8 + .2 * Math.sin(t * 3 + i); addGlow(ctx, x, y, 26, .55 * p, AMB, CORE); ctx.fillStyle = CORE; ctx.fillRect(x - 1.5, y - 1.5, 3, 3); }
    }
    // ---- the unwind: the rule's thread is laid along Alaska's coast (K0 unwindFrame look) ----
    if (u > 0 || conv > 0) {
      const lineSrc = [[xEnd, RULE.y], [RULE.x0, RULE.y]];
      const pts = peel(lineSrc, A.pts, u, { n: N, zone: z }), laid = Math.max(0, Math.min(N - 1, Math.floor((u * (1 + z) - z) * (N - 1)))), tip = pts[laid];
      const mapA = sm(lin(.86, 1, u)), [WL, LL] = coastLayers();
      if (u > 0) {
        const pg = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 420); pg.addColorStop(0, `rgba(255,170,100,${.16 * (1 - lift)})`); pg.addColorStop(1, 'rgba(255,170,100,0)'); ctx.fillStyle = pg; ctx.fillRect(tip[0] - 420, tip[1] - 420, 840, 840);
        ctx.save(); ctx.setLineDash([1.4, 5.5]); ctx.strokeStyle = `rgba(243,239,226,${.42 * (1 - mapA)})`; ctx.lineWidth = 1.2; poly(ctx, A.pts, Math.max(0, laid - 2), N - 1); ctx.stroke(); ctx.restore();
        if (mapA > 0) { ctx.save(); ctx.fillStyle = rgba('#e9dfc6', .12 * mapA); ctx.fill(A.path); ctx.restore(); }
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        revealAlong(ctx, WL, A.pts, laid, Math.round(N * .05), 190);
        revealAlong(ctx, LL, A.pts, Math.max(0, laid - Math.round(N * .015)), Math.round(N * .06), 150);
        ctx.restore();
      }
      // the thread itself (until the lift takes it)
      if (mph <= 0) {
        ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
        const hot = Math.max(0, laid - Math.round(N * .04));
        for (const [w, al] of [[16, .05], [6, .15]]) { ctx.strokeStyle = rgba(AMB, al); ctx.lineWidth = w; poly(ctx, pts, hot, N - 1); ctx.stroke(); }
        ctx.strokeStyle = rgba(CORE, .95); ctx.lineWidth = 1.7; poly(ctx, pts, hot, N - 1); ctx.stroke();
        ctx.strokeStyle = rgba(CREAM, .82); ctx.lineWidth = 1.25; poly(ctx, pts, 0, Math.min(N - 1, hot + 2)); ctx.stroke();
        ctx.restore();
        if (u > 0 && u < 1) { const B = tipBloom(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(B, tip[0] - B.width / 2, tip[1] - B.height / 2); ctx.restore(); }
      }
      label(ctx, 'ALASKA', 1500, 250, fadeIO(t, a.decades + .2, a.every + .2, .6, .4), { size: 64, font: 'Instrument Serif', spacing: 6, weight: 400 });
    }
    ctx.restore();
    plateFront(ctx, t, cam, { dy: dropMap * 1.3, a: 1 - lift });
  }
  // ---- 3.06: the coast thread rises into the sky and becomes the aurora's lowest line; the camera tilts down to the houses ----
  const pz = eio(lin(a.same - .6, a.money + .5, t)), ncam = { x: mix(40, -30, pz) + drift(t, 8, 3), y: 760 * (1 - tiltD) + drift(t, 5, 4), z: mix(1, 1.09, pz) };
  // the camera settles onto the cabin's envelope (to the centre of the frame) before the zoom into "every year"
  const fcE = eio(lin(a.year - 1.2, a.year - .37, t)), envS = [W / 2 + (700 + ncam.x * .86 + 30.45 - W / 2) * ncam.z, H / 2 + (868 + ncam.y * .86 - 83.475 - H / 2) * ncam.z];
  const settle = (c) => { if (fcE <= 0) return; const z2 = 1 + .35 * fcE; c.translate((960 - envS[0]) * fcE, (540 - envS[1]) * fcE); c.translate(envS[0], envS[1]); c.scale(z2, z2); c.translate(-envS[0], -envS[1]); };
  let NW = null;
  ctx.save(); settle(ctx);
  if (lift > 0) {
    if (lift < 1) { const [c, g] = northScratch(); g.clearRect(0, 0, W, H); NW = northWide(g, t, { cam: ncam, tilt: 1, same, fan, auroraA: sm(lin(a.every - .5, a.every + .3, t)) }); ctx.save(); ctx.globalAlpha = lift; ctx.drawImage(c, 0, 0); ctx.restore(); }
    else NW = northWide(ctx, t, { cam: ncam, tilt: 1, same, fan, auroraA: 1 });
  }
  ctx.restore();
  // the thread: the laid coast → the aurora's base line (in the north camera)
  if (mph > 0 && mph < 1) {
    const A = alaska(), ab = auroraBase(t, { dx: ncam.x, dy: ncam.y }).map(([x, y]) => [W / 2 + (x - W / 2) * ncam.z, H / 2 + (y - H / 2) * ncam.z]);
    const coast = A.pts.map(([x, y]) => [x + cam.x, y + cam.y + dropMap]);
    const th = unwind(coast, ab, mph, { n: 700, sweep: .5 }), fadeT = 1 - sm(lin(.7, 1, mph));
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter';
    const col = mixHex('#fff1d6', '#b8ffe0', mph);
    for (const [w, al] of [[18, .06], [6, .18]]) { ctx.strokeStyle = rgba(mixHex(AMB, '#5fe0a8', mph), al * fadeT); ctx.lineWidth = w; poly(ctx, th); ctx.stroke(); }
    ctx.strokeStyle = rgba(col, .95 * fadeT); ctx.lineWidth = 1.7; poly(ctx, th); ctx.stroke(); ctx.restore();
  }
  if (lift > 0) {
    // on-screen text, readable from the moment the land settles
    const ta = fadeIO(t, a.every + .7, a.money + .55, .6, .35);
    if (ta > 0) {
      const g = ctx.createLinearGradient(0, 0, 0, 260); g.addColorStop(0, `rgba(4,8,23,${.55 * ta})`); g.addColorStop(1, 'rgba(4,8,23,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 260);
      // a soft shadow pool behind the title block so the curtains' rays don't cut through the type
      ctx.save(); ctx.translate(440, 158); ctx.scale(1, .26); const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, 620); rg.addColorStop(0, `rgba(4,8,23,${.62 * ta})`); rg.addColorStop(.6, `rgba(4,8,23,${.4 * ta})`); rg.addColorStop(1, 'rgba(4,8,23,0)'); ctx.fillStyle = rg; ctx.fillRect(-620, -620, 1240, 1240); ctx.restore();
      text(ctx, 'Alaska Permanent Fund Dividend', 110, 128, { size: 54, font: 'Instrument Serif', color: rgba(CREAM, .95 * ta) });
      label(ctx, 'ELIGIBLE RESIDENTS · EVERY YEAR · SINCE 1982', 112, 170, ta, { col: '#b8ffe0', size: 18, spacing: 5 });
    }
    // "the same": every mailbox lights up with the same envelope, a ring of light around each (stagger 70 ms)
    ctx.save(); settle(ctx);
    if (NW && t > a.same - .1) NW.boxes.forEach(([bx, by], i) => {
      const X = W / 2 + (bx - W / 2) * ncam.z, Y = H / 2 + (by - H / 2) * ncam.z, q = lin(a.same - .05 + i * .07, a.same + .9 + i * .07, t), k = [.5, .62, 1.05][i] * ncam.z;
      if (q > 0) { addGlow(ctx, X, Y, 120 * k, .5 * Math.min(1, q * 4), AMB, CORE); if (q < 1) ring(ctx, X, Y, mix(20, 160, eout(q)) * k, mix(20, 160, eout(q)) * k * .55, { lines: 5, band: 8, wave: 18, col: CORE, glow: AMB, a: 1 - q, lw: 1 }); }
    });
    ctx.restore();
    source(ctx, t, a.every + .9, a.money + .55, 'Source: Alaska Dept. of Revenue, PFD Division', { x: 112, y: 204 });
    return NW;
  }
}

// =====================================================================================================================
// 3.07a/b/c · every year · rich or poor · child or adult
// =====================================================================================================================
function seasonsShot(ctx, t, a) {
  const t0 = a.year - .12, u = lin(t0, a.year + 1.1, t);
  // starts close on the envelope (where the zoom lands, frame centre) and eases back to show the seasons turning around it
  const k = mix(1.7, 1.1, eio(lin(t0 + .2, t0 + 1.1, t))), Q = [1359.3, 1107.8];
  ctx.save(); ctx.translate(Q[0], Q[1]); ctx.scale(k, k); ctx.translate(-Q[0], -Q[1]);
  seasonsMailbox(ctx, t, { u: eio(u) * .98 + .01, years: 2 });
  ctx.restore();
  // the gust at the end: snow driven hard to the right
  const g = lin(a.year + .7, a.year + 1.25, t); if (g > 0) { const r = prng(21); ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 220; i++) { const y = r() * H, x0 = r() * W, sp = 900 + r() * 1400, x = (x0 + g * sp * 1.4) % (W + 300) - 150, l = 20 + g * 80 * r(); ctx.fillStyle = `rgba(235,242,255,${(.25 + .5 * r()) * g})`; ctx.fillRect(x, y, l, 1.6); } ctx.restore(); }
}
function boxesShot(ctx, t, a) {
  const t0 = a.poor - 1.0, pull = eio(lin(a.poor - .38, a.poor + .02, t)), drop = ein(lin(a.poor + .45, a.child - .05, t));
  ctx.save(); ctx.translate(0, 0);
  twoBoxes(ctx, t, { pull: clamp(pull), cam: { x: mix(-20, 20, lin(t0, a.child, t)), y: 0 }, drop });
  ctx.restore();
}
function porchShot(ctx, t, a) {
  const t0 = a.child - .15, open = eio(lin(a.adult - .42, a.adult + .02, t));
  porch(ctx, t, { open, cam: { x: mix(-14, 14, lin(t0, a.norway, t)), y: 0, z: mix(1.0, 1.04, lin(t0, a.norway, t)) } });
}

// =====================================================================================================================
// 3.08 · the licence; STATE STAKE; into the vignette → the fjord; a drop, rings
// =====================================================================================================================
function deskBack() {
  return once('desk308', () => {
    const [c, g] = canvas(W, H), bg = g.createRadialGradient(900, 420, 0, 960, 540, 1300); bg.addColorStop(0, '#29404a'); bg.addColorStop(.6, '#16252e'); bg.addColorStop(1, '#0a1218'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    rosette(g, 1500, 900, { R: 700, A: 50, B: 22, n: 40, m: 11, lines: 60, col: '#9fb8c0', w: .6, a: .06 });
    stipple(c, { k: .5, g: 1, seed: 33, mid: false, boost: 1.2 }); return c;
  });
}
function licenceShot(ctx, t, a) {
  const t0 = a.norway - .2, inU = eout(lin(t0 - .1, t0 + .7, t)), push = eio(lin(a.bigBefore - .75, a.bigBefore + .15, t)), xf = sm(lin(a.bigBefore - .35, a.bigBefore + .1, t));
  if (xf < 1) {
    ctx.drawImage(deskBack(), 0, 0);
    const lx = mix(760, 960, inU), ly = 446, rot = mix(-.06, -.015, inU), s = .86;
    // the camera pushes into the vignette until it fills the frame
    const V = LIC_V(lx, ly, rot, s), zk = Math.pow(W / V.w * 1.04, push), cx = mix(W / 2, V.x, sm(push)), cy = mix(H / 2, V.y, sm(push));
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zk, zk); ctx.translate(-cx, -cy);
    licence(ctx, t, { x: lx, y: ly, rot, s, seal: lin(a.stateOwned - .08, a.stateOwned + .25, t), sealT: a.stateOwned });
    ctx.restore();
    label(ctx, 'NORWAY · STATE STAKE, FROM 1972', 960, 870, fadeIO(t, a.stateOwned + .3, a.bigBefore - .55, .5, .35) * (1 - push), { size: 22, spacing: 5, align: 'center' });
    if (push < .05) source(ctx, t, a.stateOwned + .4, a.bigBefore - .55, 'Source: Meld. St. 28 (2010–2011), Norwegian petroleum policy', { x: 552, y: 902 });
  }
  if (xf > 0) { ctx.save(); ctx.globalAlpha = xf; fjordA(ctx, t, a); ctx.restore(); }
}
// the fjord as 3.08 shows it: after "came" the camera follows the drop down onto its rings (they arrive at the frame centre, where
// the zoom into 3.09 is anchored); 3.09 redraws exactly this, magnified, while the zoom runs, so the two frames are one
function fjordA(ctx, t, a) {
  const fz = mix(1.08, 1, eout(lin(a.bigBefore - .35, a.bigBefore + 1.2, t))) * (1 + .025 * lin(a.bigBefore, a.today, t));
  const fc = eio(lin(a.came - .75, a.came + .05, t)), R = [RINGPT[0], RINGPT[1] - 70 + 70 * fz], z2 = 1 + fc;
  ctx.save(); ctx.translate((960 - R[0]) * fc, (540 - R[1]) * fc); ctx.translate(R[0], R[1]); ctx.scale(z2, z2); ctx.translate(-R[0], -R[1]);
  fjord(ctx, t, { z: fz, drop: a.came + .06 });
  ctx.restore();
}
function LIC_V(x, y, rot, s) { const V = { x: 30, y: -250, w: 520, h: 292 }, cx = (V.x + V.w / 2) * s, cy = (V.y + V.h / 2) * s, c = Math.cos(rot), sn = Math.sin(rot); return { x: x + cx * c - cy * sn, y: y + cx * sn + cy * c, w: V.w * s, h: V.h * s }; }

// =====================================================================================================================
// 3.09 · the rings arrange into Nvidia's rosette; the fund's 1.3 % slice lifts out in foil
// =====================================================================================================================
const RC = [960, 520], RR = 330, SL_A = -.62, SL_W = TAU * .013;
const SLICE_TIP = [RC[0] + Math.cos(SL_A + SL_W / 2) * (RR + 60) + 40, RC[1] + Math.sin(SL_A + SL_W / 2) * (RR + 60) - 60];
function nvBack() {
  return once('nvback', () => { const [c, g] = canvas(W, H), bg = g.createRadialGradient(960, 520, 0, 960, 540, 1200); bg.addColorStop(0, '#173a44'); bg.addColorStop(.55, '#0e2028'); bg.addColorStop(1, '#060d12'); g.fillStyle = bg; g.fillRect(0, 0, W, H); stipple(c, { k: .5, g: 1, seed: 52, mid: false, boost: 1.2 }); return c; });
}
function slicePath(r0, r1, a0, a1) { const p = new Path2D(); p.moveTo(Math.cos(a0) * r0, Math.sin(a0) * r0); for (let i = 0; i <= 12; i++) { const q = mix(a0, a1, i / 12); p.lineTo(Math.cos(q) * r1, Math.sin(q) * r1); } p.lineTo(Math.cos(a1) * r0, Math.sin(a1) * r0); p.closePath(); return p; }
function nvidiaShot(ctx, t, a) {
  const t0 = a.today - .05, form = eio(lin(t0 + .2, a.today + 1.1, t)), lift = eout(lin(a.nvidia - .2, a.nvidia + .4, t)), giant = eio(lin(a.giant - .2, a.giant + .9, t));
  ctx.drawImage(nvBack(), 0, 0);
  // while the zoom runs (t0 ± .25) this frame is the fjord of 3.08 magnified exactly as the engine needs it; then the water clears
  const fo = 1 - sm(lin(t0 + .15, t0 + .75, t));
  if (fo > 0) { const e = eio(lin(t0 - .25, t0 + .25, t)), m = Math.pow(3, e) / mix(1 / 3, 1, e); ctx.save(); ctx.globalAlpha = fo; ctx.translate(960, 540); ctx.scale(m, m); ctx.translate(-960, -540); fjordA(ctx, t, a); ctx.restore(); }
  const sc = mix(1, 1.55, giant), rot = t * .03;
  // the rings (from the water) tilt up to face the camera and contract/expand into the rosette's radius
  const sy = mix(.3, 1, eio(lin(t0 + .05, t0 + .85, t))), ra = sm(lin(t0 + .05, t0 + .45, t));
  if (form < 1) for (let k = 0; k < 4; k++) { const r0 = 40 + k * 150, r = mix(r0, RR * (.55 + k * .15), form); ring(ctx, RC[0], mix(540, RC[1], sy), r, r * sy, { lines: 6, band: 10, wave: 26, col: '#f3f6f0', glow: '#cfe3e0', a: (1 - form) * .8 * ra, lw: 1 }); }
  ctx.save(); ctx.translate(RC[0], RC[1]); ctx.scale(sc, sc);
  ctx.globalCompositeOperation = 'lighter';
  rosette(ctx, 0, 0, { R: RR * .78, A: 52, B: 20, n: 26, m: 9, lines: 46, col: '#cfe3e0', w: .7, a: .55, u: form, rot, cache: form >= 1 });
  if (giant > 0) rosette(ctx, 0, 0, { R: RR * 1.25, A: 40, B: 18, n: 40, m: 13, lines: 40, col: '#9fb8c0', w: .6, a: .35, u: giant, rot: -rot, cache: giant >= 1 });
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
  // NVIDIA, engraved caps in the centre
  label(ctx, 'NVIDIA', RC[0], RC[1] + 16, sm(lin(a.today + .4, a.today + 1.0, t)) * (1 - giant * .25), { size: 46 * sc, spacing: 12, weight: 700, align: 'center', col: '#e9f2ee' });
  // the fund's slice: a 1.3 % sector in foil, lifting out along its bisector
  const mid = SL_A + SL_W / 2, dist = 70 * lift + 20 * giant, lx = RC[0] + Math.cos(mid) * dist, ly = RC[1] + Math.sin(mid) * dist - 30 * lift;
  ctx.save(); ctx.translate(lx, ly); ctx.scale(sc, sc);
  const p = slicePath(26, RR * .9, SL_A, SL_A + SL_W); const g = ctx.createLinearGradient(-RR, -RR, RR, RR); ['#7a3b17', '#c87a2c', '#ffb35c', '#ffe2a8', '#c87a2c'].forEach((c, i) => g.addColorStop(i / 4, c));
  ctx.globalAlpha = sm(lin(a.today + .3, a.today + .8, t)); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20 * lift; ctx.shadowOffsetY = 14 * lift; ctx.fillStyle = g; ctx.fill(p); ctx.shadowColor = 'transparent';
  foilGlint(ctx, p, t, { x: -RR, y: -RR * .6, span: RR * 2, width: 60, speed: .5, phase: .3, a: .6 + .4 * Math.exp(-Math.pow((t - a.nvidia - .25) / .2, 2)) * 2 });
  ctx.restore();
  addGlow(ctx, lx + Math.cos(mid) * RR * .6 * sc, ly + Math.sin(mid) * RR * .6 * sc, 120, .35 * lift, AMB, CORE);
  label(ctx, "NORWAY'S OIL FUND", lx + Math.cos(mid) * RR * .95 * sc + 24, ly + Math.sin(mid) * RR * .95 * sc - 18, sm(lin(a.nvidia, a.nvidia + .4, t)), { col: '#ffd9a0', size: 18 });
  const ta = fadeIO(t, a.nvidia + .15, a.about - .05, .5, .3);
  label(ctx, "NORWAY'S OIL FUND OWNS ≈ 1.3 % OF NVIDIA (30 JUN 2026)", 110, 860, ta, { size: 20, spacing: 4 });
  source(ctx, t, a.nvidia + .3, a.about - .05, 'Source: NBIM holdings, via Reuters', { x: 110, y: 892 });
}

// =====================================================================================================================
// 3.10 · the slice splits into a long row of equal strips, one per person; the row runs into depth
// =====================================================================================================================
function rowBack() {
  return once('rowback', () => {
    const [c, g] = canvas(W, H), bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0d2129'); bg.addColorStop(.48, '#1c3a44'); bg.addColorStop(.52, '#163038'); bg.addColorStop(1, '#09141a'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(159,184,192,.10)'; g.lineWidth = 1; const vp = [1560, 470]; for (let i = -30; i < 30; i++) { g.beginPath(); g.moveTo(vp[0], vp[1]); g.lineTo(vp[0] + i * 160, H + 40); g.stroke(); }
    for (let j = 1; j < 14; j++) { const y = vp[1] + Math.pow(j / 14, 2.2) * (H - vp[1] + 40); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    artFog(g, { y0: 360, y1: 600, col: '#9fb8c0', a: .25, seed: 61, sx: .002, sy: .02, cover: .5, soft: .5, k: .6 });
    stipple(c, { k: .45, g: 1, seed: 63, mid: false, boost: 1.1 }); return c;
  });
}
const NROW = 46, ROW = (i) => { const q = i / (NROW - 1), d = Math.pow(q, .62); return { x: mix(330, 1540, d), y: mix(930, 482, d), s: mix(1.15, .1, Math.pow(q, .42)) }; };
function strip(ctx, x, y, s, t, i, a = 1) {
  if (a <= 0) return; const w = 9 * s, h = 34 * s; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  const g = ctx.createLinearGradient(-w, -h, w, h); g.addColorStop(0, '#9a5420'); g.addColorStop(.45, '#ffcf8a'); g.addColorStop(.55, '#ffb35c'); g.addColorStop(1, '#8a4a1a'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h, w, h);
  const gl = Math.max(0, Math.sin(t * 2.4 - i * .35)); if (gl > .85) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,241,214,${(gl - .85) * 4})`; ctx.fillRect(-w / 2, -h, w, h); }
  ctx.restore();
}
function rowShot(ctx, t, a) {
  const t0 = a.about - .15;
  ctx.drawImage(rowBack(), 0, 0);
  const cam = { x: drift(t, 8, 2) - 30 * lin(t0, a.taken, t), y: drift(t, 5, 5) };
  ctx.save(); ctx.translate(cam.x, cam.y);
  // the slice arrives in the centre (from the zoom) and splits into strips that fly to the figures, near ones first
  const split = lin(t0 + .2, t0 + .5, t);
  if (split < 1) { ctx.save(); ctx.globalAlpha = 1 - split; const p = slicePath(10, 300, -.55, -.55 + SL_W * 1.6); ctx.translate(840, 640); const g = ctx.createLinearGradient(-300, -300, 300, 300); ['#7a3b17', '#c87a2c', '#ffb35c', '#ffe2a8', '#c87a2c'].forEach((c, i) => g.addColorStop(i / 4, c)); ctx.fillStyle = g; ctx.fill(p); ctx.restore(); }
  const far = sm(lin(a.everyN - .4, a.everyN + .9, t));
  for (let i = NROW - 1; i >= 0; i--) {
    const P = ROW(i), fa = i < 16 ? 1 : far, ts = t0 + .3 + i * .045, fly = eio(lin(ts, ts + .55, t));
    if (fa <= 0 && fly <= 0) continue;
    figureFlat(ctx, P.x, P.y, P.s, {}, { t, seed: i * 7 + 1, col: mixHex('#1c2a33', '#6d8590', clamp(1 - i / NROW)), rim: '#ffd9a0', rimSide: -1, fast: true, shadow: i < 20, accent: i % 5 === 0 ? '#c8843a' : null, accentPart: 'scarf' });
    // its strip: flies from the slice to stand in front of the figure
    const tx = P.x + 26 * P.s, ty = P.y + 40 * P.s, sx = mix(840 + 160, tx, fly), sy = mix(560, ty, fly) - Math.sin(Math.PI * fly) * 140 * P.s;
    if (fly > 0) strip(ctx, sx, sy, P.s * 1.4, t, i, i < 16 ? 1 : Math.max(far, fly));
  }
  // beyond the last figure: the row goes on as fine light into the fog (every Norwegian)
  if (far > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 90; k++) { const q = k / 90, x = mix(1540, 1640, q), y = mix(482, 466, q), al = far * (1 - q) * .6 * (.6 + .4 * Math.sin(t * 3 + k)); ctx.fillStyle = `rgba(255,214,150,${al})`; ctx.fillRect(x, y - 2, 1.4, 4); } ctx.restore(); }
  ctx.restore();
  const ta = fadeIO(t, a.about + .4, a.taken - .1, .5, .35);
  if (ta > 0) { text(ctx, '≈', 110, 168, { size: 76, weight: 300, color: rgba('#ffd9a0', ta) }); text(ctx, '$11,000', 168, 170, { size: 92, font: 'Instrument Serif', color: rgba('#ffd9a0', ta) }); label(ctx, 'PER NORWEGIAN · THE FUND’S NVIDIA SLICE', 116, 214, ta, { size: 18, spacing: 5 }); }
  source(ctx, t, a.about + .6, a.taken - .1, 'NBIM, 30 Jun 2026 · ≈ 5.6 M Norwegians', { x: 116, y: 250 });
}

// =====================================================================================================================
// 3.12 + 3.13 · the world map: one microtext border "HUMANITY" around all land; the bar stops just below "high income";
//               the bar splits into unequal bars (each of us), merges again (together), thins and becomes the pen
// =====================================================================================================================
const MAPCAM = { cx: -.05, cy: .08, z: .76, rot: 0, tilt: 0, x: 760, y: 520 };
function mapLayer() {
  return once('map312', () => { const [c, g] = canvas(W, H); g.fillStyle = '#0c1a26'; g.fillRect(0, 0, W, H); landMap(g, (lo, la) => { const p = project(MAPCAM, lo, la); return [p[0], p[1]]; }); stipple(c, { k: .35, g: 1, seed: 71, mid: false, boost: 1 }); return c; });
}
function mapNight() {
  return once('map312n', () => { const [c, g] = canvas(W, H); g.fillStyle = '#0a1620'; g.fillRect(0, 0, W, H); landMap(g, (lo, la) => { const p = project(MAPCAM, lo, la); return [p[0], p[1]]; }, { night: true }); stipple(c, { k: .4, g: 1, seed: 72, mid: false, boost: 1.1 }); return c; });
}
const barCanvas = () => once('bars313', () => canvas(W, H));
function humanityRings() {
  return once('hrings', () => {
    const rings = landRings('110m').filter((r) => r.length > 30 && r.reduce((m, p) => m + p[1], 0) / r.length > -58);
    const nor = project(MAPCAM, 9.5, 61.5), out = [];
    for (const r of rings) {
      const pts = r.map(([lo, la]) => { const p = project(MAPCAM, lo, la); return [p[0], p[1]]; });
      let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      let best = 0, bd = 1e18; pts.forEach(([x, y], i) => { const d = (x - nor[0]) ** 2 + (y - nor[1]) ** 2; if (d < bd) { bd = d; best = i; } });
      const rot = pts.slice(best).concat(pts.slice(0, best + 1)); out.push({ pts: rot, len, d: Math.sqrt(bd) });
    }
    out.sort((p, q) => p.d - q.d); return out;
  });
}
const BAR = { x: 1640, w: 110, base: 840, top: 300 }, THR = 14375, HUM = 14244;
const barH = (v) => (BAR.base - BAR.top) * v / THR;
const PEOPLE = (() => { const r = prng(99), v = []; for (let i = 0; i < 44; i++) { const n = Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(TAU * r()); v.push(Math.exp(n * 1.25)); } const m = v.reduce((p, q) => p + q, 0) / v.length; return v.map((x) => x / m); })();   // lognormal σ 1.25: most far below the mean, a few far above
function worldShot(ctx, t, a, C) {
  const t0 = a.taken - .25, u = eio(lin(t0 + .45, a.humanity + .6, t)), rise = eout(lin(a.humanity - .1, a.almost + .02, t));
  const split = eio(lin(a.each - .3, a.each + .35, t)), merge = eio(lin(a.together - .35, a.together + .3, t));
  const thin = eio(lin(a.together + .55, C.t - .9, t)), toPen = sm(lin(C.t - 1.0, C.t - .8, t));
  const dim = sm(lin(a.each - .5, a.each + .2, t));
  const dz = 1 + .02 * lin(t0, a.each, t);
  ctx.save(); ctx.translate(760, 520); ctx.scale(dz, dz); ctx.translate(-760, -520);
  ctx.drawImage(mapLayer(), 0, 0);
  if (dim > 0) { ctx.save(); ctx.globalAlpha = dim; ctx.drawImage(mapNight(), 0, 0); ctx.restore(); }
  // the one border of humanity: microtext along every coast, starting from Norway
  const HR = humanityRings();
  HR.forEach((r, k) => { const uk = clamp(u * 1.25 - k * .02); if (uk > 0) microPath(ctx, r.pts, 'HUMANITY', { size: 10.5, u: uk, col: mixHex('#7a3b17', '#ffd9a0', dim), a: (1 - dim * .4), glint: (t * .25 + k * .17) % 1, offset: -(t - 255) * 18, side: 7, weight: 700 }); });
  ctx.restore();
  // the chart on the right: the high-income line and humanity's bar
  const ca = sm(lin(a.humanity - .4, a.humanity + .2, t));
  if (ca > 0) {
    ctx.save(); ctx.globalAlpha = ca;
    const pg = ctx.createLinearGradient(1480, 0, W, 0); pg.addColorStop(0, 'rgba(8,14,22,0)'); pg.addColorStop(.25, 'rgba(8,14,22,.55)'); pg.addColorStop(1, 'rgba(8,14,22,.7)'); ctx.fillStyle = pg; ctx.fillRect(1440, 0, W - 1440, H);
    ctx.restore();
  }
  const lineX0 = mix(1540, 300, dim), lineX1 = 1860;
  ctx.save(); ctx.globalAlpha = ca; ctx.setLineDash([10, 7]); ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lineX0, BAR.top); ctx.lineTo(lineX1, BAR.top); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  label(ctx, 'HIGH INCOME · $14,375', 1860, BAR.top - 18, ca, { align: 'right', size: 18 });
  ctx.save(); ctx.globalAlpha = ca; ctx.strokeStyle = rgba(CREAM, .4); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lineX0, BAR.base); ctx.lineTo(lineX1, BAR.base); ctx.stroke(); ctx.restore();
  // bars: one (3.12) → many unequal (each of us) → one again (together) → a stroke → the pen
  const n = PEOPLE.length, span = 1240, bw = span / n * .62, hum = barH(HUM);
  const mergedX = mix(BAR.x, 960, split), gx = (i) => mix(300 + span * (i + .5) / n, 960, merge);
  const drawBar = (c, x, w, h, al) => { if (h <= 0 || al <= 0) return; c.save(); c.globalAlpha = al; const g = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0); g.addColorStop(0, '#8a4a1a'); g.addColorStop(.45, '#ffcf8a'); g.addColorStop(.6, '#ffb35c'); g.addColorStop(1, '#7a3b17'); c.fillStyle = g; c.fillRect(x - w / 2, BAR.base - h, w, h); c.restore(); };
  if (thin <= 0) {
    if (split <= 0) { drawBar(ctx, BAR.x, BAR.w, hum * rise, ca); const p = new Path2D(); p.rect(BAR.x - BAR.w / 2, BAR.base - hum * rise, BAR.w, hum * rise); foilGlint(ctx, p, t, { x: BAR.x - 200, y: BAR.base - hum, span: 400, width: 70, speed: .4, a: .6 }); }
    else {
      // each of us: unequal bars; the richest run off the chart and dissolve upward instead of ending on a hard edge
      const [bc, bg] = barCanvas(); bg.setTransform(1, 0, 0, 1, 0, 0); bg.clearRect(0, 0, W, H);
      for (let i = 0; i < n; i++) {
        const xi = mix(BAR.x, gx(i), split), hi = mix(hum, barH(HUM * PEOPLE[i]), split * (1 - merge)), wi = mix(mix(BAR.w, bw, split), BAR.w, merge);
        drawBar(bg, xi, wi, Math.min(hi, BAR.base - 30), ca * (merge > 0 ? mix(1, .35, merge) + (i === 0 ? .65 * merge : 0) : 1));
      }
      bg.globalCompositeOperation = 'destination-out'; const fg = bg.createLinearGradient(0, 30, 0, 250); fg.addColorStop(0, 'rgba(0,0,0,1)'); fg.addColorStop(1, 'rgba(0,0,0,0)'); bg.fillStyle = fg; bg.fillRect(0, 0, W, 250); bg.globalCompositeOperation = 'source-over';
      ctx.drawImage(bc, 0, 0);
    }
  }
  label(ctx, 'HUMANITY · $14,244', BAR.x - BAR.w / 2 - 14, BAR.top + 36, ca * rise * (1 - sm(clamp(split * 3))), { align: 'right', size: 18, col: '#ffd9a0' });
  label(ctx, 'HUMANITY · $14,244', 960 + BAR.w / 2 + 16, BAR.top + 36, sm(lin(.7, 1, merge)) * (1 - thin), { size: 18, col: '#ffd9a0' });
  label(ctx, 'EACH OF US', 960, BAR.base + 40, fadeIO(t, a.each + .2, a.together - .1, .4, .3), { align: 'center', size: 18 });
  label(ctx, 'ALL OF US, TOGETHER', 960, BAR.base + 40, fadeIO(t, a.together + .1, C.t - 1.1, .4, .3), { align: 'center', size: 18, col: '#ffd9a0' });
  source(ctx, t, a.humanity + .2, a.each - .3, 'World Bank FY27 threshold · GNI per person 2025 (Atlas)', { x: 110, y: 892 });
  // the merged bar thins to a stroke and becomes the pen (carry c05>c06)
  if (thin > 0 && t < C.t + .2) {
    const P = C.pos(Math.max(t, C.t - .8)), ang = P.r, L = 230 * P.s;
    const A0 = [960, BAR.base], B0 = [960, BAR.base - hum], A1 = [P.x, P.y], B1 = [P.x + Math.cos(ang) * L, P.y + Math.sin(ang) * L];
    const pa = [mix(A0[0], A1[0], thin), mix(A0[1], A1[1], thin)], pb = [mix(B0[0], B1[0], thin), mix(B0[1], B1[1], thin)], w = mix(BAR.w, 16 * P.s, Math.pow(thin, .6));
    const ddx = pb[0] - pa[0], ddy = pb[1] - pa[1], dl = Math.hypot(ddx, ddy) || 1, nx = -ddy / dl, ny = ddx / dl, mx = (pa[0] + pb[0]) / 2, my = (pa[1] + pb[1]) / 2;
    const sg = ctx.createLinearGradient(mx - nx * w / 2, my - ny * w / 2, mx + nx * w / 2, my + ny * w / 2); sg.addColorStop(0, '#8a4a1a'); sg.addColorStop(.45, '#ffcf8a'); sg.addColorStop(.6, '#ffb35c'); sg.addColorStop(1, '#7a3b17');
    if (toPen < 1) { ctx.save(); ctx.globalAlpha = 1 - toPen; ctx.lineCap = thin > .5 ? 'round' : 'butt'; ctx.strokeStyle = sg; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke(); ctx.restore(); addGlow(ctx, pa[0], pa[1], 80, .4 * thin * (1 - toPen), AMB, CORE); }
    if (toPen > 0) { const P2 = C.pos(t); addGlow(ctx, P2.x, P2.y, 140, .45 * toPen * (1 - lin(C.t - .3, C.t + .1, t)), AMB, CORE); C.draw(ctx, t, { a: toPen }); }
  }
}
