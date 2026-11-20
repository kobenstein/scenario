// Film 19 · B3 props (c09–c11 + end screen). Owned by builder B3; built on lib/f19_kit.mjs (never edits it).
// Everything is drawn in SHEET design coordinates (inside onSheet / lifted) and is a pure function of its arguments (no state, no
// per-frame canvas or pattern). Seeded randomness only.
//   veil(ctx, a, holes)              the night of a room: dark paper tone over the sheet with lit holes (window, shop window)
//   pool(ctx, x, y, r, a, col)       a soft light pool on the paper (lamp, candle, window)
//   candle(ctx, t, x, y, h, o)       the birthday candle 115 (wax, band, wick, flame; o.lit 0..1 ignites, o.bright)
//   handUp(ctx, x, y, s, ang, o)     a paper-cut forearm + hand reaching (ang 0 = straight up), o.grip 0..1, o.col
//   tick(ctx, x, y, ang, len, col)   one tiny arrow (a family's decision)
//   LIGHTS / lights(ctx, t, u, o)    eight billion points of light (the world at night) spreading from an origin
//   phone / ballotBox / foldSlip     small paper props
//   gadgets(ctx, t, x, y, w, h, o)   the shop window: lit glass, gadget silhouettes, sparkles
//   bigCard(ctx, t, x, y, w, o)      the 1973 card (index card on a pin): handwritten quote written word by word
//   buttons(ctx, t, x, y, w, h, o)   the screen full of identical buttons (cool)
//   gauge(ctx, t, x, y, w, o)        the 1973 card as a vellum gauge: MORE / FEWER, needle, the NO switch
//   tutor / form                      the kid at the tablet with branching paths · the form that fills itself in
//   roadSign(ctx, t, x, y, s, o)     CURVE AHEAD
//   scribbleCard(ctx, t, x, y, w, o) a small answer card filling with handwriting
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f19_kit.mjs';
const { rgba, mixHex, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, lin, rad, prng } = E;
const { PAL, ink, label, ring, partial, measure } = F;

export const WARM = '#ffd79a';
const EO1 = (x) => expoOut(x);

// ------------------------------------------------------------------------------------------------ light & night
// the night of a room: a dark veil over the sheet (alpha a) with hard-edged lit holes (Path2D list, design coords)
// holes: [{ rect: [x, y, w, h] } | { arch: [x, footY, w, h] }] (plain ctx sub-paths: Path2D.addPath joins sub-paths in napi-canvas)
export function veil(ctx, a, holes = [], box = [-3000, -2600, 5200, 3100]) {
  if (a <= .002) return;
  ctx.save(); ctx.beginPath(); ctx.moveTo(box[0], box[1]); ctx.lineTo(box[2], box[1]); ctx.lineTo(box[2], box[3]); ctx.lineTo(box[0], box[3]); ctx.closePath();
  for (const h of holes) {
    if (h.rect) { const [x, y, w, hh] = h.rect; ctx.moveTo(x, y); ctx.lineTo(x, y + hh); ctx.lineTo(x + w, y + hh); ctx.lineTo(x + w, y); ctx.closePath(); }
    if (h.arch) { const [x, y, w, hh] = h.arch; ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - hh + w / 2); ctx.arc(x, y - hh + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w / 2, y); ctx.closePath(); }
  }
  ctx.fillStyle = rgba(PAL.desk0, a); ctx.fill('evenodd'); ctx.restore();
}
export function pool(ctx, x, y, r, a, col = WARM) {
  if (a <= 0 || r <= 0) return;
  ctx.fillStyle = rad(ctx, x, y, r, [[0, rgba(col, .55 * a)], [.35, rgba(col, .22 * a)], [1, rgba(col, 0)]]); ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
export const arch = (x, y, w, h) => { const p = new Path2D(); p.moveTo(x - w / 2, y); p.lineTo(x - w / 2, y - h + w / 2); p.arc(x, y - h + w / 2, w / 2, Math.PI, 0); p.lineTo(x + w / 2, y); p.closePath(); return p; };
export const rectP = (x, y, w, h, r = 0) => { const p = new Path2D(); if (r) p.roundRect(x, y, w, h, r); else p.rect(x, y, w, h); return p; };

// ------------------------------------------------------------------------------------------------ the candle 115
// x, y = foot of the candle; h = wax height. o: { lit 0..1 (the flame catches), bright (extra), a, num '115' }
export function flame(ctx, t, x, y, s, o = {}) {
  const lit = clamp(o.lit ?? 1); if (lit <= 0) return;
  const fl = 1 + .06 * Math.sin(t * 13.1) + .04 * Math.sin(t * 7.3 + 1) + .03 * Math.sin(t * 21.7), sw = .05 * Math.sin(t * 2.3) + .03 * Math.sin(t * 5.1);
  const g = expoOut(lit), br = 1 + (o.bright ?? 0);
  const hh = s * 2.1 * fl * g, ww = s * .62 * (.6 + .4 * g);
  E.halo(ctx, x, y - hh * .45, s * 7 * g * br, .55 * g * Math.min(1.4, br), WARM, PAL.gold0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw);
  const p = new Path2D(); p.moveTo(0, -hh); p.bezierCurveTo(ww * .9, -hh * .45, ww, -hh * .05, 0, 0); p.bezierCurveTo(-ww, -hh * .05, -ww * .9, -hh * .45, 0, -hh); p.closePath();
  ctx.fillStyle = lin(ctx, 0, -hh, 0, 0, [[0, rgba(PAL.flame, .9)], [.45, PAL.gold1], [.85, PAL.gold0], [1, rgba('#8fb5ff', .8)]]); ctx.fill(p);
  ctx.fillStyle = rgba(PAL.gold0, .9); ctx.beginPath(); ctx.ellipse(0, -hh * .3, ww * .32, hh * .26, 0, 0, 6.29); ctx.fill();
  ctx.restore();
}
export function candle(ctx, t, x, y, h, o = {}) {
  const w = h * .24, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  // wax (lit from the flame side), a drip, the paper band with 115
  const body = new Path2D(); body.roundRect(x - w / 2, y - h, w, h, [w * .25, w * .25, 2, 2]);
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, PAL.cardShade], [.55, PAL.card], [1, mixHex(PAL.card, PAL.cardShade, .5)]]); ctx.fill(body);
  ctx.fillStyle = PAL.card; ctx.beginPath(); ctx.moveTo(x + w * .1, y - h); ctx.quadraticCurveTo(x + w * .32, y - h * .8, x + w * .2, y - h * .66); ctx.quadraticCurveTo(x + w * .1, y - h * .8, x + w * .02, y - h); ctx.fill();
  ctx.fillStyle = PAL.cInk0; ctx.fillRect(x - w / 2, y - h * .46, w, h * .24);
  ctx.save(); ctx.translate(x, y - h * .34); ctx.font = `${h * .17}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = PAL.card; ctx.fillText(o.num ?? '115', 0, h * .01); ctx.restore();
  // wick
  ctx.strokeStyle = PAL.cInk0; ctx.lineWidth = w * .07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.quadraticCurveTo(x + w * .05, y - h - w * .2, x + w * .02, y - h - w * .32); ctx.stroke();
  ctx.restore();
  flame(ctx, t, x + w * .02, y - h - w * .25, w * .55, o);
  return [x, y - h - w * .9];
}

// ------------------------------------------------------------------------------------------------ hands
// a paper-cut forearm + hand, root at (x, y) (the elbow side), reaching along ang (0 = up, + = clockwise) by s (forearm length).
// o.grip 0..1 curls the fingers round a rail; o.col (paper), o.lit (edge light), o.sleeve (a sleeve colour, e.g. PAL.coat for you)
export const HANDCOL = '#d8ccb0';
export function handUp(ctx, x, y, s, ang = 0, o = {}) {
  const col = o.col ?? HANDCOL, g = clamp(o.grip ?? 0), edge = o.edge ?? mixHex(col, PAL.cut0, .45);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  const fw = s * .16;
  // forearm (sleeve if given), slightly tapered toward the wrist
  const arm = new Path2D(); arm.moveTo(-fw * 1.0, 0); arm.quadraticCurveTo(-fw * 1.12, -s * .45, -fw * .78, -s); arm.lineTo(fw * .78, -s); arm.quadraticCurveTo(fw * 1.12, -s * .45, fw * 1.0, 0); arm.closePath();
  ctx.fillStyle = o.sleeve ?? col; ctx.fill(arm);
  if (o.sleeve) { ctx.fillStyle = mixHex(o.sleeve, '#ffffff', .25); ctx.fillRect(-fw * .95, -s - fw * .1, fw * 1.9, fw * .45); }
  // palm
  const py = -s - fw * 1.25;
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-fw * 1.05, py - fw * 1.05, fw * 2.1, fw * 2.3, fw * .7); ctx.fill();
  // fingers: four capsules; grip curls them over (shorter, bent forward toward +x)
  ctx.lineCap = 'round'; ctx.strokeStyle = col;
  for (let i = 0; i < 4; i++) {
    const fx = lerp(-fw * .78, fw * .78, i / 3), L = fw * (i === 1 || i === 2 ? 1.75 : 1.45), b0 = py - fw * .9;
    ctx.lineWidth = fw * .5; ctx.beginPath(); ctx.moveTo(fx, b0);
    const mx = fx + g * fw * .35, my = b0 - L * (1 - .25 * g), tx = fx + g * fw * 1.2, ty = b0 - L * (1 - .85 * g);
    ctx.quadraticCurveTo(mx, my - L * .1 * g, tx, ty); ctx.stroke();
  }
  ctx.lineWidth = fw * .55; ctx.beginPath(); ctx.moveTo(-fw * .9, py + fw * .6); ctx.quadraticCurveTo(-fw * 1.9, py - fw * .1, -fw * (1.75 - .7 * g), py - fw * (1.1 - .3 * g)); ctx.stroke();   // thumb
  if (o.lit) { ctx.strokeStyle = rgba(o.lit, .75); ctx.lineWidth = fw * .22; ctx.beginPath(); ctx.moveTo(fw * 1.12, -s * .05); ctx.lineTo(fw * .86, -s); ctx.stroke(); }
  ctx.strokeStyle = rgba(edge, .55); ctx.lineWidth = fw * .12; ctx.beginPath(); ctx.moveTo(-fw * 1.15, 0); ctx.lineTo(-fw * .82, -s); ctx.stroke();
  ctx.restore();
  return [x + Math.sin(ang) * s * 1.55, y - Math.cos(ang) * s * 1.55];
}
// the hand reach for a grip point: root → (tx, ty); returns { len, ang } for handUp (the fingertips land on the point)
export function reachTo(rx, ry, tx, ty) { const d = Math.hypot(tx - rx, ty - ry); return { len: d / 1.55, ang: Math.atan2(tx - rx, -(ty - ry)) }; }

// one tiny arrow (a decision): centre (x, y), direction ang, length len
export function tick(ctx, x, y, ang, len, col, w = 2.2) {
  const c = Math.cos(ang), s = Math.sin(ang), hx = x + c * len / 2, hy = y + s * len / 2;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - c * len / 2, y - s * len / 2); ctx.lineTo(hx, hy);
  ctx.moveTo(hx - c * len * .38 - s * len * .26, hy - s * len * .38 + c * len * .26); ctx.lineTo(hx, hy); ctx.lineTo(hx - c * len * .38 + s * len * .26, hy - s * len * .38 - c * len * .26); ctx.stroke();
}

// ------------------------------------------------------------------------------------------------ eight billion lights
// a fixed, clustered field of points (towns, cities) around an origin; each has a delay (distance from the origin) so u spreads them as a wave
export function makeLights(seed, ox, oy, n, rx, ry, nc = 46) {
  const r = prng(seed), cl = [];
  for (let i = 0; i < nc; i++) { const a = r() * 6.283, d = Math.sqrt(r()); cl.push([ox + Math.cos(a) * rx * d, oy + Math.sin(a) * ry * d, 30 + r() * 150, .3 + r()]); }
  const pts = [];
  for (let i = 0; i < n; i++) {
    let x, y;
    if (r() < .78) { const c = cl[Math.floor(r() * nc)], a = r() * 6.283, d = c[2] * Math.sqrt(-2 * Math.log(Math.max(1e-6, r()))) * .5; x = c[0] + Math.cos(a) * d; y = c[1] + Math.sin(a) * d * .8; }
    else { const a = r() * 6.283, d = Math.sqrt(r()); x = ox + Math.cos(a) * rx * d; y = oy + Math.sin(a) * ry * d; }
    const dist = Math.hypot((x - ox) / rx, (y - oy) / ry);
    pts.push({ x, y, d: clamp(dist), s: .6 + r() * 1.2, ph: r() * 6.283, b: r() });
  }
  return pts;
}
// u 0..1: the wave front (by distance); size in design px; o: { a, col, tw (twinkle), skip (fn(i) → true to skip a point) }
export function lights(ctx, t, pts, u, size, o = {}) {
  if (u <= 0) return; const a = o.a ?? 1, col = o.col ?? PAL.gold1;
  ctx.save();
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]; if (o.skip && o.skip(i)) continue;
    const k = clamp((u * 1.15 - p.d) * 9); if (k <= 0) continue;
    const tw = 1 + (o.tw ?? .25) * Math.sin(t * 2.1 + p.ph), r = size * p.s * expoOut(k) * tw;
    ctx.globalAlpha = a * (.55 + .45 * p.b); ctx.fillStyle = p.b > .82 ? PAL.gold0 : col;
    ctx.beginPath(); ctx.arc(p.x, p.y, r * .55, 0, 6.29); ctx.fill();
    if (o.glow && p.b > .94) { ctx.globalAlpha = a; E.halo(ctx, p.x, p.y, r * 5, .3 * expoOut(k), PAL.gold1, PAL.gold0); }
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ small props
// a phone lying / held (x, y = centre), lit 0..1 (screen light, cool), face 0..1 (1 = face down: the light goes out)
export function phone(ctx, t, x, y, w, o = {}) {
  const h = w * 1.9, rot = o.rot ?? 0, lit = clamp(o.lit ?? 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (lit > 0) E.halo(ctx, 0, 0, w * 3.2, .5 * lit, PAL.cool1, PAL.cool0);
  ctx.fillStyle = PAL.cInk0; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .16); ctx.fill();
  ctx.fillStyle = mixHex(PAL.cut1, PAL.cool1, lit * .85); ctx.beginPath(); ctx.roundRect(-w * .42, -h * .43, w * .84, h * .86, w * .1); ctx.fill();
  if (lit > .3) { ctx.fillStyle = rgba(PAL.cool0, .7 * lit); for (let i = 0; i < 3; i++) ctx.fillRect(-w * .3, -h * .3 + i * h * .16, w * .6 * (i === 2 ? .6 : 1), h * .07); }
  ctx.restore();
}
export function ballotBox(ctx, x, y, w, o = {}) {   // (x, y) = bottom centre
  const h = w * .8;
  ctx.fillStyle = PAL.cut2; ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.fillStyle = PAL.cutLit; ctx.fillRect(x - w / 2, y - h, w, h * .07);
  ctx.fillStyle = PAL.desk0; ctx.fillRect(x - w * .28, y - h - 1, w * .56, h * .045);
  ctx.strokeStyle = rgba(PAL.ink0, .5); ctx.lineWidth = w * .02; ctx.strokeRect(x - w * .3, y - h * .62, w * .6, h * .32);
  label(ctx, 'VOTE', x, y - h * .38, w * .13, 1, { align: 'center', col: PAL.ink0 });
}
export function foldSlip(ctx, x, y, w, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = PAL.card; ctx.fillRect(-w / 2, -w * .32, w, w * .64);
  ctx.strokeStyle = PAL.cardShade; ctx.lineWidth = w * .04; ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.stroke();
  ctx.restore();
}
// the shop window: lit glass (cool white), gadget silhouettes on shelves, sparkles. (x, y) = top-left of the glass.
// o: { lit 0..1, glit 0..1 (the sparkle burst), seed }
const GAD = (() => { const r = prng(4407), o = []; for (let row = 0; row < 2; row++) for (let i = 0; i < 6; i++) o.push({ row, i, kind: Math.floor(r() * 4), w: .1 + r() * .05, h: .1 + r() * .12, ph: r() * 6.28 }); return o; })();
export function gadgets(ctx, t, x, y, w, h, o = {}) {
  const lit = clamp(o.lit ?? 1); if (lit <= 0) return;
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, mixHex(PAL.paper2, PAL.cool0, .62 * lit)], [.6, mixHex(PAL.paper2, PAL.cool1, .5 * lit)], [1, mixHex(PAL.paper2, PAL.cool2, .45 * lit)]]); ctx.fillRect(x, y, w, h);
  // two shelves, gadgets standing on them (screens, phones, round speakers, headphones)
  for (const s of [.48, .9]) { ctx.fillStyle = PAL.cut1; ctx.fillRect(x, y + h * s, w, h * .025); }
  const up = o.up ?? 1;
  for (const g of GAD) {
    const gx = x + w * (.1 + g.i * .16), base = y + h * (g.row ? .9 : .48), gw = w * g.w * .8, gh = h * g.h * 1.4;
    const gu = EO1(clamp(up * 1.6 - (g.i + g.row * 3) * .06)); if (gu <= 0) continue;
    ctx.save(); ctx.translate(gx, base); ctx.scale(1, gu); ctx.translate(-gx, -base);
    ctx.fillStyle = PAL.cut0;
    if (g.kind === 0) { ctx.fillRect(gx - gw / 2, base - gh, gw, gh * .86); ctx.fillRect(gx - gw * .06, base - gh * .14, gw * .12, gh * .14); ctx.fillStyle = rgba(PAL.cool0, .35 * lit); ctx.fillRect(gx - gw * .42, base - gh * .94, gw * .84, gh * .7); }
    else if (g.kind === 1) { ctx.beginPath(); ctx.roundRect(gx - gw * .25, base - gh * .8, gw * .5, gh * .8, gw * .08); ctx.fill(); }
    else if (g.kind === 2) { ctx.beginPath(); ctx.arc(gx, base - gw * .45, gw * .45, 0, 6.29); ctx.fill(); ctx.fillStyle = rgba(PAL.cool1, .4 * lit); ctx.beginPath(); ctx.arc(gx, base - gw * .45, gw * .2, 0, 6.29); ctx.fill(); }
    else { ctx.lineWidth = gw * .12; ctx.strokeStyle = PAL.cut0; ctx.beginPath(); ctx.arc(gx, base - gw * .3, gw * .4, Math.PI, 0); ctx.stroke(); ctx.fillRect(gx - gw * .5, base - gw * .32, gw * .2, gw * .3); ctx.fillRect(gx + gw * .3, base - gw * .32, gw * .2, gw * .3); }
    ctx.restore();
  }
  ctx.restore();
  // sparkles: four-point glints that wink (o.glit bursts them)
  const gl = o.glit ?? 0, r = prng(97);
  for (let i = 0; i < 14; i++) {
    const sx = x + w * (.06 + r() * .88), sy = y + h * (.08 + r() * .84), ph = r() * 6.28, sp = 1.3 + r() * 2;
    const k = Math.max(0, Math.sin(t * sp + ph)) ** 6 * (.35 + .65 * gl) * lit, s = w * .035 * k;
    if (s < .5) continue;
    ctx.fillStyle = rgba(PAL.cool0, .95); ctx.beginPath(); ctx.moveTo(sx, sy - s); ctx.quadraticCurveTo(sx, sy, sx + s * .9, sy); ctx.quadraticCurveTo(sx, sy, sx, sy + s); ctx.quadraticCurveTo(sx, sy, sx - s * .9, sy); ctx.quadraticCurveTo(sx, sy, sx, sy - s); ctx.fill();
  }
}

// ------------------------------------------------------------------------------------------------ the 1973 card
// The index card (pin at (x, y), width w, height .62 w). The quote is written word by word: o.words = [[word, u 0..1], …] in
// reading order, laid out in lines (o.lines = number of words per line); then the attribution (o.att 0..1).
// Marks: o.under 0..1 (gold underline below 'choices'), o.opt 0..1 ('OPTIONS' pencilled above), o.optX 0..1 (struck), o.cho 0..1 (ring
// round 'choices'), o.au/o.answer as on the question card. o.vellum 0..1 turns the card translucent (the gauge, 10.05).
export const QUOTE = [['Act', 'always', 'so', 'as', 'to'], ['increase', 'the', 'number'], ['of', 'choices.”']];
export function bigCard(ctx, t, x, y, w, o = {}) {
  const h = w * .62, vel = clamp(o.vellum ?? 0), sw = (o.swing ?? 0) + .006 * Math.sin(t * .8);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw); ctx.globalAlpha *= o.a ?? 1;
  const top = w * .04;
  ctx.shadowColor = rgba(PAL.desk0, .32 * (1 - vel * .6)); ctx.shadowBlur = w * .05; ctx.shadowOffsetX = w * .02; ctx.shadowOffsetY = w * .03;
  ctx.fillStyle = vel > 0 ? rgba(mixHex(PAL.card, PAL.cool0, vel * .6), 1 - vel * .78) : PAL.card; ctx.fillRect(-w / 2, top, w, h);
  // the night falls on the card's edges (keeps the big card from flooding the frame; the candle stays the brightest thing)
  if (vel < 1) { const g = ctx.createRadialGradient(0, top + h * .45, w * .12, 0, top + h * .45, w * .78); g.addColorStop(0, rgba(PAL.paper3, .12 * (1 - vel))); g.addColorStop(1, rgba(PAL.paper3, .55 * (1 - vel))); ctx.fillStyle = g; ctx.fillRect(-w / 2, top, w, h); }
  ctx.shadowColor = 'transparent';
  if (vel > 0) { ctx.strokeStyle = rgba(PAL.cool1, .7 * vel); ctx.lineWidth = w * .004; ctx.strokeRect(-w / 2, top, w, h); }
  const lineA = 1 - vel;
  if (lineA > 0) {
    ctx.strokeStyle = rgba(PAL.red0, .55 * lineA); ctx.lineWidth = w * .003; ctx.beginPath(); ctx.moveTo(-w / 2, top + h * .16); ctx.lineTo(w / 2, top + h * .16); ctx.stroke();
    ctx.strokeStyle = rgba(PAL.cardLine, .5 * lineA); for (let i = 1; i < 6; i++) { const yy = top + h * .16 + i * h * .14; ctx.beginPath(); ctx.moveTo(-w / 2, yy); ctx.lineTo(w / 2, yy); ctx.stroke(); }
  }
  // the quote (handwriting = serif italic, indigo ink), word by word
  const fs = w * .072, font = `italic ${fs}px "Instrument Serif Italic"`; ctx.font = font;
  const sp = ctx.measureText(' ').width, words = o.words ?? [];
  let k = 0, choicesBox = null;
  const qa = 1 - smooth(vel);
  QUOTE.forEach((ln, li) => {
    const lw = ln.reduce((s, wd) => s + ctx.measureText(wd).width, 0) + sp * (ln.length - 1) + (li === 0 ? ctx.measureText('“').width : 0);
    let xx = -lw / 2; const yy = top + h * .16 + (li + 1) * h * .14 + h * .015 + (li ? h * .02 * li : 0);
    if (li === 0) { const u0 = words[0]?.[1] ?? 0; if (u0 > 0) { ctx.fillStyle = rgba(PAL.cInk0, qa); ctx.fillText('“', xx, yy); } xx += ctx.measureText('“').width; }
    for (const wd of ln) {
      const u = clamp(words[k]?.[1] ?? 0), ww = ctx.measureText(wd).width;
      if (u > 0) { ctx.save(); ctx.beginPath(); ctx.rect(xx - 4, yy - fs, (ww + 8) * u, fs * 1.4); ctx.clip(); ctx.fillStyle = rgba(PAL.cInk0, qa); ctx.fillText(wd, xx, yy); ctx.restore(); }
      if (wd.startsWith('choices')) choicesBox = [xx, yy, ctx.measureText('choices').width];
      xx += ww + sp; k++;
    }
  });
  if ((o.att ?? 0) > 0 && qa > 0) label(ctx, 'HEINZ VON FOERSTER · 1973', w * .44, top + h * .93, w * .03, o.att, { align: 'right', col: rgba(PAL.cInk1, qa) });
  if (choicesBox) {
    const [cx0, cy, cw] = choicesBox;
    if ((o.under ?? 0) > 0 && qa > 0) ink(ctx, [[cx0 - 4, cy + fs * .22], [cx0 + cw * .5, cy + fs * .27], [cx0 + cw + 6, cy + fs * .2]], o.under, { w: w * .006, head: false, col: PAL.cAccent, a: qa });
    if ((o.cho ?? 0) > 0) ring(ctx, cx0 + cw / 2, cy - fs * .3, cw * .62, fs * .75, o.cho, { w: w * .006 });
    if ((o.opt ?? 0) > 0) {
      const oy = cy - fs * .1, ox = cx0 + cw + fs * 2.6;
      label(ctx, 'OPTIONS', ox, oy, w * .034, o.opt, { align: 'center', col: rgba(PAL.cInk1, qa) });
      if ((o.optX ?? 0) > 0) { const ow = measure('OPTIONS', w * .034) * 1.15; ink(ctx, [[ox - ow / 2 - 6, oy - w * .009], [ox + ow / 2 + 8, oy - w * .015]], o.optX, { w: w * .005, head: false, col: PAL.cInk0, glow: false, a: qa }); }
    }
    o._choices = [cx0 + cw / 2, cy - fs * .3];
  }
  if (o.answer && (o.au ?? 0) > 0) { ctx.save(); ctx.rotate(-.05); ctx.beginPath(); const aw = measure(o.answer, w * .07, true); ctx.rect(-aw / 2 - 10, top + h * .52, (aw + 20) * clamp(o.au), h * .4); ctx.clip(); ctx.font = `italic ${w * .07}px "Instrument Serif Italic"`; ctx.textAlign = 'center'; ctx.fillStyle = PAL.cAccent; ctx.fillText(o.answer, 0, top + h * .8); ctx.restore(); }
  ctx.restore();
  ctx.fillStyle = PAL.red1; ctx.beginPath(); ctx.arc(x, y, w * .016, 0, 6.29); ctx.fill();
  ctx.fillStyle = rgba(PAL.red2, .9); ctx.beginPath(); ctx.arc(x - w * .005, y - w * .005, w * .006, 0, 6.29); ctx.fill();
  return { h: h + top };
}

// ------------------------------------------------------------------------------------------------ the screen of buttons
// (x, y) = top-left; o: { u 0..1 (buttons cloned out from o.from [col,row]), lit 0..1, hover [col,row] (a lit button), a }
export function buttons(ctx, t, x, y, w, h, o = {}) {
  const lit = clamp(o.lit ?? 1), cols = 6, rows = 4, u = o.u ?? 1, fr = o.from ?? [2, 1];
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  E.halo(ctx, x + w / 2, y + h / 2, w * .8, .32 * lit, PAL.cool2, PAL.cool1);
  ctx.fillStyle = PAL.cInk0; ctx.beginPath(); ctx.roundRect(x - w * .03, y - w * .03, w * 1.06, h + w * .06, w * .03); ctx.fill();
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, mixHex(PAL.paper1, PAL.cool2, .55 * lit)], [1, mixHex(PAL.paper2, PAL.cool3, .7 * lit)]]); ctx.fillRect(x, y, w, h);
  const bw = w / cols, bh = h / rows, R = Math.min(bw, bh) * .3;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const d = Math.hypot(i - fr[0], j - fr[1]) / 5, k = expoOut(clamp((u * 1.25 - d) * 4)); if (k <= 0) continue;
    const cx = lerp(x + bw * (fr[0] + .5), x + bw * (i + .5), k), cy = lerp(y + bh * (fr[1] + .5), y + bh * (j + .5), k);
    const hov = o.hover && o.hover[0] === i && o.hover[1] === j ? (o.hoverA ?? 1) : 0;
    ctx.fillStyle = mixHex(PAL.cool3, PAL.cool1, .25 + .5 * hov); ctx.beginPath(); ctx.arc(cx, cy, R * (.6 + .4 * k), 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(PAL.cool0, .7); ctx.lineWidth = R * .14; ctx.stroke();
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the gauge (10.05)
// a vellum dial on the 1973 card: arc from FEWER (left) to MORE (right); needle angle from v (-1 fewer … +1 more); o.u (dial drawn),
// o.no 0..1 (the NO switch lights), o.lab 0..1 labels. (x, y) = centre of the dial's hub; r = radius.
export function gauge(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const a0 = Math.PI * 1.08, a1 = Math.PI * 1.92;
  const pts = []; for (let i = 0; i <= 50; i++) { const a = lerp(a0, a1, i / 50); pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
  // the arc: cool (fewer) → gold (more)
  const pl = partial(pts, u);
  ctx.lineCap = 'round';
  for (let i = 1; i < pl.length; i++) { const f = i / 50; ctx.strokeStyle = mixHex(PAL.cool2, PAL.gold2, f); ctx.lineWidth = r * .07; ctx.beginPath(); ctx.moveTo(...pl[i - 1]); ctx.lineTo(...pl[i]); ctx.stroke(); }
  for (let i = 0; i <= 8; i++) { const a = lerp(a0, a1, i / 8); if (i / 8 > u) break; ctx.strokeStyle = rgba(PAL.cInk0, .8); ctx.lineWidth = r * .018; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * .82, y + Math.sin(a) * r * .82); ctx.lineTo(x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9); ctx.stroke(); }
  const lab = o.lab ?? 1;
  label(ctx, 'FEWER ↓', x - r * 1.02, y + r * .24, r * .13, lab, { align: 'center', col: PAL.cool1 });
  label(ctx, 'MORE ↑', x + r * 1.02, y + r * .24, r * .13, span(lab, .2, 1), { align: 'center', col: PAL.gold1 });
  // needle
  if (u > .6) {
    const v = clamp(o.v ?? 0, -1, 1), a = lerp(a0, a1, (v + 1) / 2) + .02 * Math.sin(t * 3.1) * (o.jit ?? 1), k = expoOut(span(u, .6, 1));
    ctx.strokeStyle = PAL.cInk0; ctx.lineWidth = r * .04; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * .78 * k, y + Math.sin(a) * r * .78 * k); ctx.stroke();
    ctx.fillStyle = PAL.cInk0; ctx.beginPath(); ctx.arc(x, y, r * .07, 0, 6.29); ctx.fill();
  }
  // the NO switch (a small toggle under the hub; it lights gold and stays lit)
  const no = clamp(o.no ?? 0), nsw = o.noU ?? 1;
  if (nsw > 0) {
    const [sx, sy] = o.noAt ?? [x, y + r * .42], sw = r * .36, sh = r * .16;
    ctx.save(); ctx.globalAlpha *= expoOut(nsw);
    if (no > 0) E.halo(ctx, sx, sy, r * .5, .55 * no, WARM, PAL.gold0);
    ctx.fillStyle = mixHex(PAL.cInk1, PAL.gold2, no); ctx.beginPath(); ctx.roundRect(sx - sw / 2, sy - sh / 2, sw, sh, sh / 2); ctx.fill();
    ctx.fillStyle = mixHex(PAL.card, PAL.gold0, no); ctx.beginPath(); ctx.arc(lerp(sx - sw * .28, sx + sw * .28, smooth(no)), sy, sh * .38, 0, 6.29); ctx.fill();
    label(ctx, 'NO', sx, sy + sh * 1.65, r * .12, 1, { align: 'center', col: mixHex(PAL.cInk1, PAL.cAccent, no) });
    ctx.restore();
  }
}

// ------------------------------------------------------------------------------------------------ tutor & form (10.06)
// the kid at a tablet: many small gold paths branch out from the kid (u 0..1), ✓ (ok 0..1). (x, y) = kid's feet.
const BR = (() => { const r = prng(611), o = []; const grow = (x, y, a, l, d) => { if (d > 3) return; const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; o.push([x, y, x2, y2, d]); const n = d < 2 ? 2 + (r() < .5) : 2; for (let i = 0; i < n; i++) grow(x2, y2, a + (r() - .5) * 1.3, l * (.62 + r() * .2), d + 1); }; for (const a of [-2.1, -1.57, -1.0]) grow(0, 0, a, 120, 0); return o; })();
export function tutor(ctx, t, x, y, h, o = {}) {
  const u = clamp(o.u ?? 0);
  // the paths (gold ink, depth-staggered), rooted at the tablet
  const rx = x + h * .32, ry = y - h * .5;
  for (const [x1, y1, x2, y2, d] of BR) { const k = clamp(u * 4.2 - d); if (k <= 0) continue; ink(ctx, [[rx + x1 * h / 260, ry + y1 * h / 260], [rx + x2 * h / 260, ry + y2 * h / 260]], k, { w: Math.max(1.6, h * .016 * (1 - d * .18)), head: k < 1, glow: true }); }
  // a tablet (cool) on a stand, the kid in front of it (cream pencil = a light paper silhouette)
  ctx.fillStyle = PAL.cInk0; ctx.beginPath(); ctx.roundRect(x + h * .2, y - h * .62, h * .26, h * .19, h * .02); ctx.fill();
  ctx.fillStyle = mixHex(PAL.cool2, PAL.cool0, .4); ctx.fillRect(x + h * .215, y - h * .605, h * .23, h * .16);
  ctx.fillStyle = PAL.cInk1; ctx.fillRect(x + h * .31, y - h * .43, h * .04, h * .43);
  E.person(ctx, x, y, h * .62, { dir: 1, pal: { base: mixHex(PAL.ink1, PAL.card, .4), lit: PAL.card, shade: PAL.ink2, deep: PAL.cut2 }, rim: PAL.gold1, armR: [1.5, 1.7], look: .35, shadowCol: rgba(PAL.desk0, .25) });
  if ((o.ok ?? 0) > 0) ink(ctx, o.okPts ?? OKPTS(x, y, h), o.ok, { w: h * .04, head: o.ok < 1, col: PAL.gold1 });
}
export const OKPTS = (x, y, h) => [[x + h * 1.02, y - h * .95], [x + h * 1.16, y - h * .8], [x + h * 1.46, y - h * 1.22]];
// the form: a cream paper whose lines write themselves (u 0..1); ✗ (no 0..1). (x, y) = top-left, width w.
export function form(ctx, t, x, y, w, o = {}) {
  const h = w * 1.3, u = clamp(o.u ?? 0);
  ctx.save(); ctx.shadowColor = rgba(PAL.desk0, .35); ctx.shadowBlur = w * .05; ctx.shadowOffsetX = w * .02; ctx.shadowOffsetY = w * .03;
  ctx.fillStyle = mixHex(PAL.card, PAL.cool1, .12); ctx.fillRect(x, y, w, h); ctx.restore();
  label(ctx, 'FORM', x + w * .08, y + h * .1, w * .07, 1, { col: PAL.cInk1 });
  const r = prng(31);
  for (let i = 0; i < 7; i++) {
    const yy = y + h * (.22 + i * .1), bx = x + w * .08;
    ctx.fillStyle = rgba(PAL.cInk1, .5); ctx.fillRect(bx, yy, w * .22, w * .012);
    ctx.strokeStyle = rgba(PAL.cardLine, .9); ctx.lineWidth = w * .006; ctx.beginPath(); ctx.moveTo(bx + w * .28, yy + w * .02); ctx.lineTo(x + w * .92, yy + w * .02); ctx.stroke();
    // the self-writing: a cool pencil scribble that runs along the line
    const k = clamp(u * 7 - i); if (k <= 0) continue;
    const pts = []; const len = w * (.4 + r() * .22); for (let j = 0; j <= 30; j++) { const f = j / 30; pts.push([bx + w * .3 + f * len, yy + w * .005 - Math.abs(Math.sin(f * 22 + i)) * w * .03]); }
    ink(ctx, pts, k, { w: w * .008, col: PAL.cool3, head: false, glow: false });
  }
  if ((o.no ?? 0) > 0) { const cx = x + w * .5, cy = y + h * .5, s = w * .38; ink(ctx, [[cx - s, cy - s], [cx + s, cy + s]], clamp(o.no * 2), { w: w * .035, col: PAL.ink1, head: false }); ink(ctx, [[cx + s, cy - s], [cx - s, cy + s]], clamp(o.no * 2 - 1), { w: w * .035, col: PAL.ink1, head: false }); }
}

// ------------------------------------------------------------------------------------------------ c11
// CURVE AHEAD: a diamond road sign on a post (paper cut, lifted). (x, y) = foot of the post; s = sign size. o.u 0..1 (rises)
export function roadSign(ctx, t, x, y, s, o = {}) {
  const u = expoOut(clamp(o.u ?? 1)); if (u <= 0) return;
  const h = s * 2.1 * u, sw = .01 * Math.sin(t * .9);
  ctx.save(); ctx.translate(x, y); ctx.rotate(sw);
  ctx.fillStyle = PAL.cut2; ctx.fillRect(-s * .04, -h, s * .08, h);
  const cy = -h - s * .45;
  ctx.save(); ctx.translate(0, cy); ctx.scale(u, u); ctx.rotate(Math.PI / 4);
  ctx.fillStyle = PAL.card; ctx.beginPath(); ctx.roundRect(-s * .5, -s * .5, s, s, s * .07); ctx.fill();
  ctx.strokeStyle = PAL.cInk0; ctx.lineWidth = s * .035; ctx.beginPath(); ctx.roundRect(-s * .44, -s * .44, s * .88, s * .88, s * .05); ctx.stroke();
  ctx.restore();
  // the curved arrow (bends up to the right: the curve ahead)
  ctx.save(); ctx.translate(0, cy); ctx.scale(u, u);
  ctx.strokeStyle = PAL.cInk0; ctx.lineWidth = s * .075; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-s * .26, s * .3); ctx.quadraticCurveTo(s * .12, s * .26, s * .14, -s * .22); ctx.stroke();
  ctx.fillStyle = PAL.cInk0; ctx.beginPath(); ctx.moveTo(s * .14, -s * .38); ctx.lineTo(s * .27, -s * .17); ctx.lineTo(s * .01, -s * .17); ctx.closePath(); ctx.fill();
  ctx.restore();
  ctx.restore();
  if ((o.lab ?? 0) > 0) label(ctx, 'CURVE AHEAD', x, y + s * .5, s * .2, o.lab, { align: 'center', col: PAL.ink0 });
}
// a small answer card that floats down on a swing and fills with handwriting; (x, y) = landing centre; o.land 0..1, o.fill 0..1, o.seed
export function scribbleCard(ctx, t, x, y, w, o = {}) {
  const land = clamp(o.land ?? 1); if (land <= 0) return;
  const k = expoOut(land), fall = (1 - k), r = prng(o.seed ?? 3), ph = r() * 6;
  const cx = x + Math.sin(t * 2.2 + ph) * w * .5 * fall + (o.dx ?? -w * .8) * fall, cy = y - (o.drop ?? 420) * fall, rot = (o.rot ?? (r() - .5) * .3) + Math.sin(t * 2.2 + ph) * .5 * fall;
  const h = w * .62;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.shadowColor = rgba(PAL.desk0, .3); ctx.shadowBlur = w * .06 + fall * w * .2; ctx.shadowOffsetX = w * .02 + fall * w * .08; ctx.shadowOffsetY = w * .03 + fall * w * .12;
  ctx.fillStyle = PAL.card; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = rgba(PAL.red0, .5); ctx.lineWidth = w * .008; ctx.beginPath(); ctx.moveTo(-w / 2, -h * .28); ctx.lineTo(w / 2, -h * .28); ctx.stroke();
  const f = clamp(o.fill ?? 0);
  for (let i = 0; i < 3; i++) {
    const kk = clamp(f * 3 - i); if (kk <= 0) continue;
    const pts = [], len = w * (.75 - i * .12 - r() * .1); for (let j = 0; j <= 26; j++) { const q = j / 26; pts.push([-w * .38 + q * len, -h * .08 + i * h * .22 - Math.abs(Math.sin(q * 17 + i * 2 + ph)) * h * .1]); }
    ink(ctx, pts, kk, { w: w * .016, col: PAL.cInk0, head: false, glow: false });
  }
  ctx.restore();
}
