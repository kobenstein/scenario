// Film 13 "The AI Bubble Could Pop" · the film's own motifs, drawn in the editorial-night look (lib/f10_editorial.mjs is the base,
// lib/base_kit.mjs adds trailSpan / maskLine / measure / textGrains / sandGrains). Import all three:
//   import * as E from '../lib/f10_editorial.mjs'; import * as K from '../lib/base_kit.mjs'; import * as B from '../lib/bubble_kit.mjs';
// Everything here is flat shapes + gradients + the cached stipple of the base kit. No canvas / pattern is created per frame
// (napi canvas leak); paths that never change are built once and cached. Seeded randomness only. Guide: docs/MOTION.md §7.
//
//   COL                      the film's accent colours (paper, ink, machine-cool, engraving sage) next to the style palette E.P
//   paperFill(ctx, path, …)  lamp-lit paper: one warm gradient + fibre stipple (every sheet, note, certificate, ticket, letter)
//   paperPlate(ctx, t, o)    the frame FULL of paper (screen space): the shared frame of a paper cut (both sides draw it, identical)
//   banknote(ctx, …)         a generic note (no real currency): border, guilloche oval, corner numerals; o.simple for tiny notes
//   bubble(ctx, x, y, r, t)  THE motif: a clear golden soap bubble with a few big banknotes turning inside. thin / tremble / pop /
//                            detach / lum · bubblePoses(…) = where its notes are at t (pick the one that leaves)
//   dataCenter(ctx, …)       a long low hall with rows of cool server lights, rooftop units, fence + gate. lum = how hard it works
//   worker(ctx, …)           a person (indigo, faceless) with a lanyard badge, breathing; look up / turn
//   certificate(ctx, …)      an 1840s railway share certificate with a locomotive stamp
//   loco(ctx, …)             the 1840s steam locomotive in profile: print (ink on paper) → real (indigo body, gold lamp, steam)
//   purse / coin / teacup    the savers' table, seen from above
//   newspaper(ctx, …)        a folded newspaper page with columns (top view)
//   quill(ctx, …)            a writer's hand (indigo sleeve) with a quill whose nib is at (x, y)
//   inkLine(ctx, pts, u, o)  a drawn line in any colour (ink, paper, cool): the hand-drawn cousin of E.trail
//   rail(ctx, x0, x1, y, t)  the track in profile: ink line → iron with a lit rim, sleepers, ballast (RAIL ANCHORS ONLY)
//   train(ctx, …)            a modern train in profile (warm window band, one door that opens / closes)
//   phone(ctx, …)            a phone (cool screen) with a fund statement; screen drawn by a callback if given
//   ticket(ctx, …)           the penny ticket (1844: "1d per mile"; later the basic-access ticket)
//   flip(ctx, u, …)          THE SIGNATURE MOVE: a flat thing turns over (u 0→1) and its back is the next thing
//   mist(ctx, y, h, a)       a soft band of paper-coloured mist on a horizon
import { Path2D, PathOp, GlobalFonts } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, glowFill, halo, dust, lin, rad, prng, drift } = E;

try { GlobalFonts.registerFromPath('/home/user/scenario/style-tests/shared/fonts/InstrumentSerif-400-italic.woff2', 'Instrument Serif Italic'); } catch { /* optional */ }

// ---------- colours (accents of this film; the base palette E.P stays the law) ----------
export const COL = {
  paper0: '#efe5c6', paper1: '#d8caa3', paper2: '#9c8e6c', paper3: '#5f5640',   // lamp-lit paper: light → shadow (notes, shares, letters, tickets)
  ink: '#161b3c', ink2: '#2c3159',                                               // ink on paper (deep indigo, never black)
  sage: '#9db095',                                                               // engraving lines on banknotes only (a hint of money)
  cool: '#cfd8f0', cool2: '#8f9cc8', coolDeep: '#3e4d86',                        // machine light: server windows, capability curve, phone screen
  loss: '#33497a',                                                               // = P.blue1: what falls, what is lost (cold, never red)
};

// ---------- paper ----------
// fill a path with lamp-lit paper. o: { lx, ly (light centre, default the path's upper-left third), r (light radius), lum 0..1, a, fibre (count) }
export function paperFill(ctx, path, o = {}) {
  const [x0, y0, x1, y1] = path.getBounds(), w = x1 - x0, h = y1 - y0, lum = clamp(o.lum ?? 1), a = o.a ?? 1;
  const lx = o.lx ?? x0 + w * .38, ly = o.ly ?? y0 + h * .3, R = o.r ?? Math.hypot(w, h) * .9;
  const k = (c) => mixHex(c, COL.paper3, .8 * (1 - lum));
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rad(ctx, lx, ly, R, [[0, k(COL.paper0)], [.45, k(COL.paper1)], [1, k(COL.paper2)]]); ctx.fill(path);
  if ((o.fibre ?? 1) && w * h > 400) { ctx.clip(path); dust(ctx, o.seed ?? 301, o.fibre > 1 ? o.fibre : Math.min(1400, Math.round(w * h / 900)), (x0 + x1) / 2, (y0 + y1) / 2, w * .45, h * .45, 0, .16 * a * lum, COL.paper3); }
  ctx.restore();
}
// the frame full of paper (screen space, ignores the camera). Both sides of a paper cut call it with the same t: identical frames.
// o.lum dims it, o.cx/o.cy move the lamp light (screen px). Fibres are cached stipple, so it is alive (finish grain on top).
export function paperPlate(ctx, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const lum = clamp(o.lum ?? 1), k = (c) => mixHex(c, COL.paper3, .8 * (1 - lum)), cx = o.cx ?? W * .45, cy = o.cy ?? H * .42;
  ctx.fillStyle = rad(ctx, cx, cy, W * .85, [[0, k(COL.paper0)], [.5, k(COL.paper1)], [1, k(COL.paper2)]]); ctx.fillRect(0, 0, W, H);
  dust(ctx, 307, 5200, W / 2, H / 2, W * .42, H * .42, t * .2, .2 * lum, COL.paper3);
  ctx.restore();
}

// ---------- banknote (generic, no real currency) ----------
const NOTE = new Map();
function notePaths() {
  if (NOTE.has('n')) return NOTE.get('n');
  const body = new Path2D(); body.roundRect(-1, -.46, 2, .92, .05);
  const border = new Path2D(); border.roundRect(-.9, -.37, 1.8, .74, .03);
  const oval = new Path2D(); oval.ellipse(.28, 0, .3, .27, 0, 0, Math.PI * 2);
  const oval2 = new Path2D(); oval2.ellipse(.28, 0, .22, .2, 0, 0, Math.PI * 2);
  const guil = new Path2D();   // guilloche: a rosette of overlapping ellipses round the oval
  for (let i = 0; i < 9; i++) { const q = i / 9 * Math.PI; guil.ellipse(.28, 0, .27, .1, q, 0, Math.PI * 2); }
  const lines = new Path2D(); for (let i = 0; i < 5; i++) { lines.moveTo(-.78, -.2 + i * .1); lines.lineTo(-.18 - (i % 2) * .12, -.2 + i * .1); }
  const r = { body, border, oval, oval2, guil, lines }; NOTE.set('n', r); return r;
}
// (cx, cy) centre, w width (height = .46 w), rot radians. o: { lum, a, simple (tiny notes: paper + border + oval only), sx (−1..1
// horizontal squash for a flip / sphere foreshortening), glow (backlit: the note itself gives light, 0..1), num ('100') }
export function banknote(ctx, cx, cy, w, rot = 0, o = {}) {
  const n = notePaths(), s = w / 2, sx = o.sx ?? 1, a = o.a ?? 1, lum = clamp(o.lum ?? 1);
  if (Math.abs(sx) < .02 || a <= 0) return;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s * sx, s);
  const k = (c) => mixHex(c, COL.paper3, .75 * (1 - lum));
  ctx.globalAlpha = a;
  if (o.glow) {   // backlit paper: warm gold, a lit edge and a darker gold far side (the notes read as notes, not as white light)
    ctx.fillStyle = lin(ctx, -1, -.46, 1, .46, [[0, mixHex(k(COL.paper0), P.halo0, .55 * o.glow)], [.55, mixHex(k(COL.paper1), P.halo1, .6 * o.glow)], [1, mixHex(k(COL.paper2), P.shade0, .5 * o.glow)]]);
  } else ctx.fillStyle = lin(ctx, -1, -.46, 1, .46, [[0, k(COL.paper0)], [.6, k(COL.paper1)], [1, k(COL.paper2)]]);
  ctx.fill(n.body);
  const line = Math.max(.012, 1.1 / (s * Math.abs(sx) + 1e-3));
  const q = o.simple ? .45 : 1;   // tiny notes (the bubble skin): the print is only a whisper, the paper glows
  ctx.lineWidth = line; ctx.strokeStyle = rgba(mixHex(COL.sage, COL.ink2, .35), .55 * q); ctx.stroke(n.border);
  ctx.fillStyle = rgba(mixHex(COL.sage, COL.paper1, .45), .55 * q); ctx.fill(n.oval);
  ctx.strokeStyle = rgba(COL.ink2, .5 * q); ctx.stroke(n.oval2);
  if (!o.simple) {
    ctx.strokeStyle = rgba(COL.sage, .5); ctx.lineWidth = line * .7; ctx.stroke(n.guil);
    ctx.strokeStyle = rgba(COL.ink2, .35); ctx.lineWidth = line * 1.4; ctx.stroke(n.lines);
    if (s * Math.abs(sx) > 40) {   // numerals only where they can be read
      ctx.fillStyle = rgba(COL.ink2, .65); ctx.font = `.2px "Instrument Serif"`; ctx.textAlign = 'center';
      ctx.save(); ctx.scale(1 / 1, 1); ctx.fillText(o.num ?? '100', -.68, -.2); ctx.fillText(o.num ?? '100', .7, .32); ctx.restore();
    }
  }
  ctx.restore();
}

// ---------- THE BUBBLE: a golden soap bubble with banknotes floating inside (the thumbnail motif) ----------
// A clear gold sphere: thin glowing rim, a soap-film sheen, a window highlight. Inside, a few LARGE notes turn slowly on an inner
// orbit (front ones bright and sharp, back ones dim through the film). Like the thumbnail: few, big, readable notes, not confetti.
// o: { thin 0..1 (the film thins: rim flickers, fill fades, notes pale), tremble 0..1 (the shape wobbles + motion arcs outside),
//      lum (1), a, pop 0..1 (bursts: the film rips from the upper left, notes fly out and fall), detach: Set of note ids not drawn,
//      spin (rad/s, default .12), n (notes, default 7) } → { notes: [{id, x, y, w, rot, sx, z}] (all drawn notes, front last),
//      R, rx, ry } so a scene can pick a note and carry it away.
const BUB = new Map();
function bubbleNotes(n = 7) {
  if (BUB.has(n)) return BUB.get(n);
  const r = prng(1307), out = [];
  for (let i = 0; i < n; i++) {   // an even spread over the inner sphere, each with its own tilt and wobble
    const y = .82 - (i + .5) / n * 1.64, lon = i * 2.39996 + (r() - .5) * .4;
    out.push({ id: i, lat: Math.asin(y) * .9, lon, rot: (r() - .5) * 1.4, ph: r() * 6.28, sz: .9 + r() * .25, tw: .3 + r() * .5 });
  }
  BUB.set(n, out); return out;
}
// the notes' poses inside a bubble at time t (no pop): [{ id, x, y, w, rot, sx, z }] sorted back → front. Same maths as bubble(), so a
// scene can pick the note that will leave (e.g. the front-most one at the moment of "It's happened before") before it draws.
export function bubblePoses(x, y, r, t, o = {}) {
  const tr = clamp(o.tremble ?? 0), wob = tr * (.02 * Math.sin(t * 9.3) + .011 * Math.sin(t * 15.7 + 1)), br = 1 + .012 * Math.sin(t * .9);
  const rx = r * br * (1 + wob), ry = r * br * (1 - wob * .8), spin = (o.spin ?? .12) * t;
  return bubbleNotes(o.n ?? 7).map((nt) => {
    const lon = nt.lon + spin * (1 + nt.tw * .3), lat = nt.lat + .08 * Math.sin(t * .4 + nt.ph);
    const cl = Math.cos(lat), z = cl * Math.cos(lon), px = cl * Math.sin(lon), py = Math.sin(lat);
    let sx = Math.cos(lon * 1.0 + nt.ph * .2); sx = Math.sign(sx || 1) * (.42 + .58 * Math.abs(sx));
    return { id: nt.id, nt, x: x + px * rx * .56, y: y + py * ry * .56, w: r * .74 * nt.sz * (1 + .12 * z), rot: nt.rot + .25 * Math.sin(t * .5 + nt.ph) + Math.sin(lon) * .3, sx, z, px, py };
  }).sort((p, q) => p.z - q.z);
}
export function bubble(ctx, x, y, r, t, o = {}) {
  const a = o.a ?? 1, thin = clamp(o.thin ?? 0), tr = clamp(o.tremble ?? 0), lum = clamp(o.lum ?? 1, 0, 1.4), pop = clamp(o.pop ?? 0);
  const wob = tr * (.02 * Math.sin(t * 9.3) + .011 * Math.sin(t * 15.7 + 1)), br = 1 + .012 * Math.sin(t * .9);
  const rx = r * br * (1 + wob), ry = r * br * (1 - wob * .8), out = [];
  const skin = new Path2D(); skin.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  const film = (1 - smooth(span(pop, 0, .22))) * (1 - .45 * thin * (.55 + .45 * Math.sin(t * 4.2))), k0 = film * lum;
  ctx.save(); ctx.globalAlpha = a;
  // 1 · the light the bubble gives the night (THE light of the hook) and the film itself: clear in the middle, gold to the rim
  if (k0 > 0) {
    halo(ctx, x, y, r * 2.3, .09 * k0, P.halo1, P.halo2);
    glowFill(ctx, skin, r * .2, .5 * k0, P.halo1);
    ctx.fillStyle = rad(ctx, x - rx * .2, y - ry * .25, r * 1.2, [[0, rgba(P.blue0, .03 * k0)], [.55, rgba(P.blue0, .05 * k0)], [.82, rgba(P.halo1, .16 * k0)], [.95, rgba(P.halo0, .42 * k0)], [1, rgba(P.core1, .6 * k0)]]);
    ctx.fill(skin);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, y + ry * .2, r, [[0, rgba(P.halo1, .05 * k0)], [1, rgba(P.halo1, 0)]]); ctx.fill(skin); ctx.restore();
  }
  // 2 · the notes inside: on an inner orbit (0.56 r), sorted back to front; back notes dim and soft through the film
  for (const q of bubblePoses(x, y, r, t, o)) {
    const { nt, z, px, py } = q;
    if (o.detach && o.detach.has(nt.id)) continue;
    let { x: nx, y: ny, w, rot, sx } = q;
    let alpha = (z < 0 ? .42 + .3 * (1 + z) : .86 + .14 * z) * (1 - .4 * thin * (.5 + .5 * Math.sin(t * 3.1 + nt.ph * 3)));
    if (pop > 0) {   // burst: notes fly outward from the rip (upper left), tumble, then fall and drift
      const d = clamp(pop * 1.5 - (1 - (px * .5 - py * .5 + 1) / 2) * .4), fly = expoOut(d) * r * (.9 + nt.sz * .6), fall = d * d * r * 1.4;
      nx += px * fly + Math.sin(nt.ph + t * 1.3) * 26 * d; ny += py * fly * .8 + fall; rot += d * (nt.ph - 3) * 1.2; sx *= Math.cos(d * (nt.ph + 1) * 2.2);
      alpha = Math.max(alpha, .85) * (1 - smooth(span(pop, .7, 1)));
    }
    if (alpha <= .01 || Math.abs(sx) < .03) continue;
    banknote(ctx, nx, ny, w, rot, { a: alpha * a, sx, simple: z < 0, glow: z < 0 ? 1 : .75 + .25 * lum * (1 - thin * .5), lum: z < 0 ? .5 : .78 + .22 * z });
    out.push({ id: nt.id, x: nx, y: ny, w, rot, sx, z });
  }
  // 3 · the film over the notes: rim (gold, brightest upper left + lower right), soap-film sheen, window highlight
  if (film > .01) {
    ctx.save();
    ctx.lineWidth = Math.max(2, r * .02);
    ctx.strokeStyle = rgba(P.halo0, .8 * film); ctx.stroke(skin);
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    ctx.filter = `blur(${r * .045}px)`; ctx.strokeStyle = rgba(P.halo1, .55 * film * lum); ctx.lineWidth = r * .07; ctx.stroke(skin);   // the gold rim glow
    ctx.filter = `blur(${r * .012}px)`;
    ctx.strokeStyle = rgba(P.core1, .8 * film); ctx.lineWidth = r * .03;
    ctx.beginPath(); ctx.ellipse(x, y, rx * .985, ry * .985, 0, Math.PI * 1.02, Math.PI * 1.55); ctx.stroke();
    ctx.strokeStyle = rgba(P.halo0, .5 * film); ctx.lineWidth = r * .022;
    ctx.beginPath(); ctx.ellipse(x, y, rx * .985, ry * .985, 0, Math.PI * .02, Math.PI * .5); ctx.stroke();
    ctx.strokeStyle = rgba(mixHex(P.blue0, P.cream, .35), .32 * film); ctx.lineWidth = r * .05; ctx.filter = `blur(${r * .025}px)`;   // the film's cool sheen
    ctx.beginPath(); ctx.ellipse(x, y, rx * .9, ry * .9, 0, Math.PI * .12, Math.PI * .42); ctx.stroke();
    ctx.strokeStyle = rgba(P.cream, .7 * film); ctx.lineWidth = r * .03; ctx.filter = `blur(${r * .006}px)`;   // window highlight
    ctx.beginPath(); ctx.ellipse(x, y, rx * .82, ry * .82, 0, Math.PI * 1.14, Math.PI * 1.36); ctx.stroke();
    ctx.lineWidth = r * .02; ctx.beginPath(); ctx.ellipse(x, y, rx * .82, ry * .82, 0, Math.PI * 1.4, Math.PI * 1.46); ctx.stroke();
    ctx.filter = 'none'; ctx.restore();
    dust(ctx, 1311, 120, x, y, rx * .7, ry * .7, t * .3, .25 * film * lum, P.halo0);   // gold motes in the film
  }
  // 4 · tremble: short motion arcs just outside the rim (like the thumbnail), they shiver with the wobble
  if (tr > .02 && film > .01) {
    ctx.save(); ctx.strokeStyle = rgba(P.halo0, .7 * tr * film); ctx.lineCap = 'round';
    for (const [c, s0, s1, dd] of [[1, 1.08, 1.2, .1], [1, 1.25, 1.33, .16], [-1, .02, .14, .1], [-1, .18, .26, .16], [1, .78, .86, .13], [-1, 1.7, 1.8, .12]]) {
      const j = 1 + dd + .015 * Math.sin(t * 11 + s0 * 5);
      ctx.lineWidth = r * .012; ctx.beginPath(); ctx.ellipse(x, y, rx * j, ry * j, 0, Math.PI * s0, Math.PI * s1); ctx.stroke();
    }
    ctx.restore();
  }
  // 5 · pop: the film's last trace, a ring of gold droplets flying out from the rim
  if (pop > 0 && pop < 1) {
    const d = expoOut(clamp(pop * 1.4)), fa = 1 - smooth(span(pop, .35, .9));
    ctx.save(); ctx.fillStyle = rgba(P.halo0, .8 * fa);
    for (let i = 0; i < 48; i++) { const q = i / 48 * Math.PI * 2 + Math.sin(i * 7.1) * .05, s = 1 + d * (.25 + .2 * Math.abs(Math.sin(i * 3.3))); ctx.beginPath(); ctx.arc(x + Math.cos(q) * rx * s, y + Math.sin(q) * ry * s + d * d * r * .3, Math.max(1, r * .012 * (1 - d * .5)), 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  ctx.restore();
  return { notes: out, R: r * br, rx, ry };
}

// ---------- the data center ----------
// (x, y) = left end of the ground line, w × h the hall. o: { lum 0..1.5 (how bright the server lights burn), gate (x of the gate in
// the fence, design px; null = no fence), rim (warm light from above 0..1), seed }
const DC = new Map();
export function dataCenter(ctx, x, y, w, h, t, o = {}) {
  const lum = o.lum ?? .6, key = `${w}|${h}|${o.seed ?? 3}`;
  if (!DC.has(key)) {   // the light grid: rows of small windows, seeded (positions only; brightness per frame)
    const r = prng(o.seed ?? 3), cells = [], rows = 4, cols = Math.round(w / 26);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (r() > .18) cells.push([i / cols, .3 + j * .14, r() * 6.3, .3 + r() * 1.6, r()]);
    const units = []; for (let i = 0; i < Math.round(w / 140); i++) units.push([.05 + i / Math.round(w / 140) * .9 + r() * .02, .5 + r() * .5]);
    DC.set(key, { cells, units });
  }
  const { cells, units } = DC.get(key);
  // the hall (dark, flat), roof units, a warm rim on the roof edge from the light above
  ctx.save();
  const body = new Path2D(); body.rect(x, y - h, w, h);
  for (const [u, s] of units) body.rect(x + u * w - 22, y - h - 26 * s, 44, 26 * s + 1);
  ctx.fillStyle = lin(ctx, 0, y - h - 30, 0, y, [[0, mixHex(P.ind2, P.blue1, .25)], [.25, P.ind2], [1, P.night1]]); ctx.fill(body);
  if (o.rim ?? 1) { ctx.fillStyle = rgba(P.halo1, .55 * (o.rim ?? 1)); ctx.fillRect(x, y - h, w, 2.5); for (const [u, s] of units) ctx.fillRect(x + u * w - 22, y - h - 26 * s, 44, 2); }
  // vertical seams between halls
  ctx.fillStyle = rgba(P.night0, .55); for (let i = 1; i < 4; i++) ctx.fillRect(x + w * i / 4 - 2, y - h, 4, h);
  // the server lights: cool, blinking (each its own rhythm), brighter with lum
  const cw = Math.max(5, w / cells.length * 3.2), chh = Math.max(3, h * .07);
  for (const [u, v, ph, f, q] of cells) {
    const b = clamp(lum * (.45 + .55 * (.5 + .5 * Math.sin(t * f * 2.2 + ph))) * (q > .12 ? 1 : .3), 0, 1.5);
    ctx.fillStyle = mixHex(COL.coolDeep, COL.cool, Math.min(1, b)); ctx.globalAlpha = .35 + .65 * Math.min(1, b);
    ctx.fillRect(x + u * w + 6, y - h + v * h, Math.min(cw, 14), chh);
  }
  ctx.globalAlpha = 1;
  if (lum > .2) {   // the light the windows throw on the ground in front
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, y, 0, y + h * .5, [[0, rgba(COL.cool2, .18 * Math.min(1.3, lum))], [1, rgba(COL.cool2, 0)]]); ctx.fillRect(x - 40, y, w + 80, h * .5);
    ctx.restore();
  }
  // fence + gate
  if (o.gate != null) {
    const fy = y + (o.fenceDy ?? 46), fh = h * .38;
    ctx.strokeStyle = rgba(P.blue1, .7); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 60, fy - fh); ctx.lineTo(o.gate - 70, fy - fh); ctx.moveTo(o.gate + 70, fy - fh); ctx.lineTo(x + w + 60, fy - fh); ctx.stroke();
    ctx.lineWidth = 1.4; ctx.beginPath();
    for (let xx = x - 60; xx < x + w + 60; xx += 18) { if (Math.abs(xx - o.gate) < 70) continue; ctx.moveTo(xx, fy - fh); ctx.lineTo(xx, fy); }
    ctx.stroke();
    ctx.fillStyle = P.ind2; ctx.fillRect(o.gate - 76, fy - fh * 1.25, 10, fh * 1.25); ctx.fillRect(o.gate + 66, fy - fh * 1.25, 10, fh * 1.25);   // gate posts
    ctx.fillStyle = rgba(COL.cool, .85); ctx.fillRect(o.gate - 74, fy - fh * 1.25 - 6, 6, 4);   // a small light on the post
  }
  ctx.restore();
}

// ---------- people (not you): indigo, faceless, with a lanyard; they breathe and turn their heads ----------
// o: { dir, look 0..1, lanyard (true), seed, armR, armL, rim } → hands
export function worker(ctx, x, y, h, t, o = {}) {
  const sd = o.seed ?? 1, br = Math.sin(t * 1.6 + sd) * .5 + .5;
  const hands = E.person(ctx, x, y, h, {
    dir: o.dir ?? 1, look: clamp((o.look ?? 0) + .04 * Math.sin(t * .7 + sd * 2)), lean: o.lean ?? .006 * Math.sin(t * .5 + sd),
    armR: o.armR ?? [.16 + .03 * br, .08 + .03 * br], armL: o.armL ?? [-.16 - .02 * br, -.08], rim: o.rim, light: o.light ?? 1, long: o.long,
  });
  if (o.lanyard !== false) {   // the badge on the chest: a tiny cream card on a strap (the people who build it)
    const dir = o.dir ?? 1, bx = x + dir * h * .03, by = y - h * .62;
    ctx.save(); ctx.strokeStyle = rgba(COL.cool2, .8); ctx.lineWidth = Math.max(1, h * .012);
    ctx.beginPath(); ctx.moveTo(bx - h * .045, y - h * .79); ctx.lineTo(bx, by); ctx.lineTo(bx + h * .045, y - h * .79); ctx.stroke();
    ctx.fillStyle = COL.cool; ctx.fillRect(bx - h * .025, by, h * .05, h * .065); ctx.restore();
  }
  return hands;
}

// ---------- 1840s: the share certificate, the locomotive, the savers' table ----------
const LOCO = new Map();
// the locomotive in profile, local units: rails at y = 0, length ≈ 2 (x −1 … 1), facing +x. Built once.
function locoPaths() {
  if (LOCO.has('l')) return LOCO.get('l');
  const U = (a, b) => a.op(b, PathOp.Union), D = (a, b) => a.op(b, PathOp.Difference);
  let b = new Path2D(); b.roundRect(-.55, -.62, 1.25, .34, .16);                        // the boiler
  const smoke = new Path2D(); smoke.moveTo(.47, -.6); smoke.lineTo(.5, -.92); smoke.lineTo(.42, -1.02); smoke.lineTo(.74, -1.02); smoke.lineTo(.66, -.92); smoke.lineTo(.62, -.6); smoke.closePath(); b = U(b, smoke);   // flared chimney
  const dome = new Path2D(); dome.ellipse(.05, -.66, .1, .1, 0, Math.PI, 0); dome.closePath(); b = U(b, dome);
  const cab = new Path2D(); cab.moveTo(-.95, -.28); cab.lineTo(-.95, -.88); cab.lineTo(-.5, -.92); cab.lineTo(-.5, -.28); cab.closePath(); b = U(b, cab);
  const win = new Path2D(); win.roundRect(-.86, -.8, .24, .2, .04); b = D(b, win);
  const frame = new Path2D(); frame.rect(-1, -.3, 1.82, .1); b = U(b, frame);
  const buffer = new Path2D(); buffer.rect(.82, -.26, .12, .05); b = U(b, buffer);
  const wheels = []; for (const [wx, wr] of [[-.62, .2], [.02, .3], [.55, .2]]) { const c = new Path2D(); c.arc(wx, -wr, wr, 0, Math.PI * 2); wheels.push([wx, wr, c]); }
  const r = { body: b, win, wheels }; LOCO.set('l', r); return r;
}
// (x, y) = the point between the front and back wheels on the rail; h = height of the chimney top above the rail.
// o: { ink 0..1 (1 = printed on paper: flat ink, no light; 0 = real: indigo body, gold rim light, burning lamp), lamp 0..1, steam 0..1,
//      speed (wheel turn rad/s), dir ±1, a } → returns the lamp position [x, y] (the hero light of the locomotive)
export function loco(ctx, x, y, h, t, o = {}) {
  const L = locoPaths(), s = h, ink = clamp(o.ink ?? 0), a = o.a ?? 1, dir = o.dir ?? 1, rot = (o.spin ?? 0);
  const lampP = [x + dir * .9 * s, y - .45 * s];
  ctx.save(); ctx.globalAlpha = a;
  if (ink < 1 && (o.steam ?? 0) > 0) {   // steam from the chimney: stipple clouds trailing back
    const st = o.steam;
    for (let i = 0; i < 6; i++) {
      const k = (i + (t * .9) % 1) / 6, cx = x + dir * (.58 - k * 2.2) * s, cy = y - (1.05 + k * .55) * s - Math.sin(k * 3) * .1 * s;
      ctx.fillStyle = rgba(mixHex(P.cream, P.blue2, .4), .16 * st * (1 - k)); ctx.beginPath(); ctx.arc(cx, cy, (.12 + k * .4) * s, 0, Math.PI * 2); ctx.fill();
      dust(ctx, 611 + i, 260, cx, cy, (.1 + k * .3) * s, (.08 + k * .2) * s, t, .5 * st * (1 - k), P.cream);
    }
  }
  ctx.translate(x, y); ctx.scale(s * dir, s);
  const inkCol = COL.ink, body = mixHex(P.ind2, inkCol, ink);
  ctx.fillStyle = ink > .5 ? rgba(inkCol, .9) : lin(ctx, 0, -1, 0, 0, [[0, mixHex(body, P.blue1, .35 * (1 - ink))], [.6, body], [1, mixHex(body, P.night0, .4)]]);
  ctx.fill(L.body);
  for (const [wx, wr, c] of L.wheels) {
    ctx.fill(c);
    if (ink < 1) { ctx.save(); ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo1, .5), .9 * (1 - ink)); ctx.lineWidth = .025; ctx.stroke(c); ctx.restore(); }
    ctx.save(); ctx.strokeStyle = ink > .5 ? rgba(COL.paper1, .8) : rgba(mixHex(P.blue1, P.halo1, .4), .8); ctx.lineWidth = .018;
    for (let k = 0; k < 6; k++) { const q = rot / wr * .08 + k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(wx, -wr); ctx.lineTo(wx + Math.cos(q) * wr * .8, -wr + Math.sin(q) * wr * .8); ctx.stroke(); }
    ctx.restore();
  }
  if (ink < 1) {   // rim light from above (gold) on the boiler top and chimney, and the window glows
    const k = 1 - ink;
    ctx.save(); ctx.clip(L.body); ctx.fillStyle = rgba(P.halo1, .55 * k); ctx.fillRect(-1, -1.05, 2, .05); ctx.fillRect(-.55, -.63, 1.25, .03); ctx.restore();
    ctx.save(); ctx.strokeStyle = rgba(P.blue0, .9 * k); ctx.lineWidth = .02; ctx.stroke(L.body); ctx.restore();   // blue rim: the silhouette reads on the night
    ctx.fillStyle = rgba(P.halo0, .7 * k * (o.lamp ?? 1)); ctx.fill(L.win);
  }
  ctx.restore();
  const lp = o.lamp ?? (1 - ink);
  if (lp > 0) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = mixHex(P.halo0, P.core0, lp); ctx.beginPath(); ctx.arc(lampP[0], lampP[1], .07 * s, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    halo(ctx, lampP[0], lampP[1], s * (.4 + .9 * lp), .6 * lp * a, P.halo1, P.core0);
    if (o.beam) {   // the lamp's beam forward (a soft wedge)
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, lampP[0], 0, lampP[0] + dir * s * 3, 0, [[0, rgba(P.halo0, .3 * lp * o.beam)], [1, rgba(P.halo0, 0)]]);
      ctx.beginPath(); ctx.moveTo(lampP[0], lampP[1] - .05 * s); ctx.lineTo(lampP[0] + dir * s * 3, lampP[1] - .5 * s); ctx.lineTo(lampP[0] + dir * s * 3, lampP[1] + .45 * s); ctx.closePath(); ctx.fill(); ctx.restore();
    }
  }
  return lampP;
}
// a share certificate, top view. (cx, cy) centre, w width (height .66 w), rot. o: { lum, a, stamp (locomotive print 0..1),
// title ('RAILWAY SHARE'), glow (the stamp glows: the machine promises, 0..1), sx (flip squash), torn (0..1: hidden while it bursts) }
export function certificate(ctx, cx, cy, w, rot = 0, o = {}) {
  const h = w * .66, sx = o.sx ?? 1; if (Math.abs(sx) < .02) return null;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sx, 1);
  const body = new Path2D(); body.rect(-w / 2, -h / 2, w, h);
  paperFill(ctx, body, { lum: o.lum ?? 1, a: o.a ?? 1, seed: 331 });
  const a = o.a ?? 1;
  ctx.strokeStyle = rgba(COL.ink2, .55 * a); ctx.lineWidth = Math.max(1, w * .004); ctx.strokeRect(-w * .45, -h * .43, w * .9, h * .86);
  ctx.strokeStyle = rgba(COL.ink2, .3 * a); ctx.strokeRect(-w * .43, -h * .4, w * .86, h * .8);
  // title + small print lines
  ctx.fillStyle = rgba(COL.ink, .8 * a); ctx.font = `${Math.round(w * .07)}px "Instrument Serif"`; ctx.textAlign = 'center';
  ctx.fillText(o.title ?? 'RAILWAY SHARE', 0, -h * .26);
  ctx.fillStyle = rgba(COL.ink2, .35 * a); for (let i = 0; i < 3; i++) ctx.fillRect(-w * .3, h * .18 + i * h * .07, w * (.6 - i * .12), Math.max(1, h * .012));
  ctx.font = `${Math.round(w * .045)}px "Instrument Serif"`; ctx.fillStyle = rgba(COL.ink2, .6 * a); ctx.fillText(o.year ?? '1845', w * .32, h * .36);
  ctx.restore();
  // the locomotive stamp (a print in an oval), returns its centre for carriers
  const st = o.stamp ?? 1, sp = [cx + Math.cos(rot) * 0 - Math.sin(rot) * (-h * .02), cy + Math.sin(rot) * 0 + Math.cos(rot) * (-h * .02)];
  if (st > 0) {
    ctx.save(); ctx.translate(sp[0], sp[1]); ctx.rotate(rot); ctx.scale(sx, 1); ctx.globalAlpha = a * st;
    ctx.strokeStyle = rgba(COL.ink2, .6); ctx.lineWidth = Math.max(1, w * .004); ctx.beginPath(); ctx.ellipse(0, -h * .02, w * .17, h * .17, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    if (o.glow) halo(ctx, sp[0], sp[1], w * .3, .35 * o.glow * a, P.halo1, P.halo0);
    if (!o.noLoco) loco(ctx, sp[0], sp[1] + h * .1, w * .1, 0, { ink: 1, a: a * st, lamp: o.glow ? o.glow : 0 });
  }
  return { stamp: sp, h };
}
// coin (top view): gold disc with a rim. a lit coin is a small light (o.lit)
export function coin(ctx, x, y, r, o = {}) {
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  ctx.fillStyle = rad(ctx, x - r * .3, y - r * .35, r * 1.4, [[0, P.core1], [.4, P.halo0], [1, P.shade0]]); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = Math.max(1, r * .12); ctx.beginPath(); ctx.arc(x, y, r * .72, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  if (o.lit) halo(ctx, x, y, r * 5, .25 * o.lit, P.halo1, P.halo0);
}
// a cloth drawstring purse, top view: full (round, plump, coins push the cloth) → empty (flat, creased, collapsed). (x, y) centre
// of the body, s size. o: { full 0..1, open 0..1 (the mouth loosens), rot, a }
export function purse(ctx, x, y, s, o = {}) {
  const f = clamp(o.full ?? 1), op = clamp(o.open ?? 0), a = o.a ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.globalAlpha = a;
  const CL = mixHex(P.shade0, P.ind2, .3), cloth = () => CL;
  // the body: a plump circle when full, a flat irregular blob when empty
  const body = new Path2D(), R = s * .5, n = 14;
  for (let i = 0; i <= n; i++) {
    const q = i / n * Math.PI * 2, wob = 1 + (1 - f) * (.16 * Math.sin(q * 3 + 1) + .08 * Math.sin(q * 5)), rr = R * lerp(1.12, 1, f) * wob, yy = Math.sin(q) * rr * lerp(.72, 1, f);
    i ? body.lineTo(Math.cos(q) * rr, yy) : body.moveTo(Math.cos(q) * rr, yy);
  }
  body.closePath();
  ctx.fillStyle = rad(ctx, -R * .35, -R * .4, R * 1.6, [[0, mixHex(cloth(), P.halo1, .45 * f + .1)], [.55, cloth()], [1, mixHex(cloth(), P.night1, .6)]]); ctx.fill(body);
  // the gathered neck and the frill toward +x, the string loop
  const nx = R * .95;
  ctx.fillStyle = mixHex(cloth(), P.night1, .3); ctx.beginPath(); ctx.ellipse(nx, 0, R * .16, R * (.22 + .12 * op), 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = mixHex(cloth(), P.halo1, .2); ctx.beginPath(); ctx.moveTo(nx, -R * .1); ctx.quadraticCurveTo(nx + R * .55, -R * (.42 + .2 * op), nx + R * .62, 0); ctx.quadraticCurveTo(nx + R * .55, R * (.42 + .2 * op), nx, R * .1); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = Math.max(1.2, s * .025); ctx.beginPath(); ctx.moveTo(nx, 0); ctx.bezierCurveTo(nx + R * .3, R * .5, nx - R * .1, R * .9, nx - R * .4, R * .75); ctx.stroke();
  // creases: when empty, the cloth folds (darker lines); when full, one soft highlight
  if (f < .9) { ctx.strokeStyle = rgba(P.night1, .55 * (1 - f)); ctx.lineWidth = Math.max(1, s * .02); for (const [a0, a1] of [[-.6, .3], [.1, .9], [-.2, -.9]]) { ctx.beginPath(); ctx.moveTo(-R * .6, R * a0 * .5); ctx.quadraticCurveTo(0, R * a1 * .4, R * .7, R * a0 * .3); ctx.stroke(); } }
  if (f > .1) { ctx.fillStyle = rgba(P.core1, .22 * f); ctx.beginPath(); ctx.ellipse(-R * .3, -R * .35, R * .32, R * .16, -.5, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
// teacup + saucer (top view), ripple 0..1 (the rumble of the machine)
export function teacup(ctx, x, y, r, t, o = {}) {
  const rip = clamp(o.ripple ?? 0);
  ctx.save(); ctx.globalAlpha = o.a ?? 1;
  ctx.fillStyle = rad(ctx, x - r * .4, y - r * .5, r * 2.2, [[0, COL.paper1], [1, COL.paper3]]); ctx.beginPath(); ctx.arc(x, y, r * 1.45, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = rad(ctx, x - r * .3, y - r * .4, r * 1.6, [[0, COL.paper0], [1, COL.paper2]]); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + r * .95, y - r * .2); ctx.quadraticCurveTo(x + r * 1.5, y, x + r * .95, y + r * .2); ctx.strokeStyle = COL.paper2; ctx.lineWidth = r * .14; ctx.stroke();
  ctx.fillStyle = rad(ctx, x, y, r * .8, [[0, '#6b4a2a'], [1, '#3a2716']]); ctx.beginPath(); ctx.arc(x, y, r * .8, 0, Math.PI * 2); ctx.fill();   // tea
  if (rip > 0) { ctx.strokeStyle = rgba(P.halo0, .45 * rip); ctx.lineWidth = 1.2; for (let i = 0; i < 3; i++) { const k = ((t * 2.4 + i / 3) % 1); ctx.globalAlpha = (o.a ?? 1) * (1 - k) * rip; ctx.beginPath(); ctx.arc(x, y, r * .78 * k, 0, Math.PI * 2); ctx.stroke(); } }
  ctx.restore();
}
// a newspaper page, top view. (x, y) top-left, w × h. o: { lum, cols (3), mast (masthead text), lines (true), date }
export function newspaper(ctx, x, y, w, h, o = {}) {
  const p = new Path2D(); p.rect(x, y, w, h);
  paperFill(ctx, p, { lum: o.lum ?? 1, seed: 341, lx: o.lx, ly: o.ly });
  const a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rgba(COL.ink, .85); ctx.font = `${Math.round(w * .07)}px "Instrument Serif"`; ctx.textAlign = 'center';
  if (o.mast !== false) ctx.fillText(o.mast ?? 'THE MORNING HERALD', x + w / 2, y + h * .085);
  ctx.fillStyle = rgba(COL.ink2, .5); ctx.fillRect(x + w * .05, y + h * .11, w * .9, Math.max(1, h * .003)); ctx.fillRect(x + w * .05, y + h * .123, w * .9, Math.max(1, h * .0015));
  if (o.date) { ctx.font = `600 ${Math.round(w * .02)}px Inter`; ctx.fillStyle = rgba(COL.ink2, .7); ctx.fillText(o.date, x + w / 2, y + h * .148); }
  if (o.lines !== false) {   // the columns: grey bars of type (the column we write in is left open: o.open = [x0, y0, x1, y1] in page share)
    const cols = o.cols ?? 3, gw = w * .9 / cols, r = prng(17);
    for (let c = 0; c < cols; c++) for (let yy = y + h * (o.date ? .175 : .16); yy < y + h * .95; yy += h * .022) {
      const xx = x + w * .05 + c * gw;
      if (o.open && xx >= x + o.open[0] * w - 2 && xx <= x + o.open[2] * w && yy >= y + o.open[1] * h && yy <= y + o.open[3] * h) continue;
      ctx.fillStyle = rgba(COL.ink2, .2 + .08 * r()); ctx.fillRect(xx + gw * .04, yy, gw * (.86 - (r() < .12 ? .3 : 0)), Math.max(1, h * .008));
    }
  }
  ctx.restore();
}
// the writer's hand with a quill, the nib at (x, y); the sleeve comes from the upper right. o: { a, lift 0..1 (pen up), s (size) }
export function quill(ctx, x, y, t, o = {}) {
  const s = o.s ?? 140, lift = clamp(o.lift ?? 0), a = o.a ?? 1, ny = y - lift * s * .08;
  ctx.save(); ctx.globalAlpha = a;
  // the quill: a long feather from the nib up-right
  const fx = x + s * 1.25, fy = ny - s * 1.05;
  const f = new Path2D(); f.moveTo(x, ny); f.quadraticCurveTo(x + s * .5, ny - s * .3, fx, fy); f.quadraticCurveTo(x + s * .7, ny - s * .62, x + s * .05, ny - s * .04); f.closePath();
  ctx.fillStyle = lin(ctx, x, ny, fx, fy, [[0, COL.paper1], [.5, P.cream], [1, rgba(P.cream, .5)]]); ctx.fill(f);
  ctx.strokeStyle = rgba(COL.paper2, .8); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, ny); ctx.quadraticCurveTo(x + s * .55, ny - s * .45, fx, fy); ctx.stroke();
  // the hand (dark, flat) holding it, and the sleeve out of frame to the upper right
  const hx = x + s * .28, hy = ny - s * .2;
  ctx.fillStyle = mixHex(P.shade0, P.night1, .55); ctx.beginPath(); ctx.ellipse(hx + s * .1, hy - s * .02, s * .2, s * .12, -.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx - s * .05, hy + s * .08, s * .09, s * .045, -.4, 0, Math.PI * 2); ctx.fill();   // the fingers on the shaft
  ctx.fillStyle = lin(ctx, hx, hy, hx + s * 2, hy - s * 1.6, [[0, P.ind2], [1, P.night1]]);
  ctx.beginPath(); ctx.moveTo(hx + s * .12, hy - s * .2); ctx.lineTo(hx + s * 2.6, hy - s * 1.9); ctx.lineTo(hx + s * 2.9, hy - s * 1.3); ctx.lineTo(hx + s * .28, hy + s * .1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.cream, .5); ctx.beginPath(); ctx.ellipse(hx + s * .22, hy - s * .05, s * .06, s * .13, -.65, 0, Math.PI * 2); ctx.fill();   // a cuff
  ctx.restore();
  return [x, ny];
}

// ---------- lines ----------
// a drawn line in one colour (ink on paper, the money line, the machine line). pts [[x, y], …] (catmull them first for curves),
// u 0..1 drawn share (or o.u0 … u for a span), o: { col, w, glow (0..1: soft light round it), a, head (a dot of light at the head) }
export function inkLine(ctx, pts, u = 1, o = {}) {
  if (u <= 0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const T = len[len.length - 1], d0 = T * clamp(o.u0 ?? 0), d1 = T * clamp(u);
  const at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(d0), [ex, ey, i1] = at(d1), sub = [[sx, sy]];
  for (let i = i0; i < i1; i++) sub.push(pts[i]);
  sub.push([ex, ey]);
  const path = new Path2D(); sub.forEach((p, i) => (i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1])));
  const col = o.col ?? COL.ink, w = o.w ?? 3, a = o.a ?? 1;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.glow) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(col, .35 * o.glow * a); ctx.lineWidth = w * 5; ctx.filter = `blur(${w * 2}px)`; ctx.stroke(path); ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over'; }
  ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w; ctx.stroke(path);
  ctx.restore();
  if (o.head && u < 1) halo(ctx, ex, ey, w * 10, .7 * a * o.head, o.headCol ?? P.halo1, o.headCore ?? P.core0);
  return [ex, ey];
}

// ---------- RAIL (anchors A1–A4 only) ----------
// the track in profile from x0 to x1 on the line y (rail top). o: { ink 0..1 (1 = just an ink line on paper), sleepers 0..1 (grown),
// ballast 0..1, rim (warm light on the iron 0..1), w (rail height) }
export function rail(ctx, x0, x1, y, t, o = {}) {
  const ink = clamp(o.ink ?? 0), sl = clamp(o.sleepers ?? 1), bl = clamp(o.ballast ?? 1), rw = o.w ?? 7, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha = a;
  if (bl > 0) {   // ballast: a low mound under the track, dark with a cool top edge
    ctx.fillStyle = lin(ctx, 0, y, 0, y + 60 * bl, [[0, mixHex(P.ind2, P.blue1, .2)], [1, P.night1]]);
    ctx.beginPath(); ctx.moveTo(x0, y + 100 * bl); ctx.lineTo(x0, y + 22 * bl); ctx.lineTo(x1, y + 22 * bl); ctx.lineTo(x1, y + 100 * bl); ctx.closePath(); ctx.fill();   // grows with bl (no 40 px block at bl → 0)
  }
  if (sl > 0) {   // sleepers: short dark blocks under the rail, grown from the line (left → right by sl)
    const step = o.step ?? 46;
    for (let xx = x0 + step / 2; xx < x1; xx += step) {
      const k = clamp((sl * (x1 - x0 + 200) - (xx - x0)) / 200); if (k <= 0) continue;
      ctx.fillStyle = mixHex(P.night1, COL.ink, ink); ctx.fillRect(xx - 13, y + rw * .9, 26, 13 * k);
      ctx.fillStyle = rgba(P.blue1, .5 * (1 - ink)); ctx.fillRect(xx - 13, y + rw * .9, 26, 1.5 * k);
    }
  }
  // the rail: ink (flat dark line) → iron (dark body with a lit top edge)
  ctx.fillStyle = mixHex(mixHex(P.ind2, P.night1, .3), COL.ink, ink); ctx.fillRect(x0, y, x1 - x0, rw);
  const rim = (o.rim ?? 1) * (1 - ink);
  if (rim > 0) {
    ctx.fillStyle = lin(ctx, x0, 0, x1, 0, o.rimStops || [[0, rgba(P.blue0, .5 * rim)], [.5, rgba(P.halo0, .95 * rim)], [1, rgba(P.blue0, .5 * rim)]]);
    ctx.fillRect(x0, y - 1, x1 - x0, 2.6);
  }
  ctx.restore();
}

// ---------- modern train in profile ----------
// (x, y): x = nose tip, y = rail top; len, h (body height). o: { door 0..1 (open share), doorX (from the nose, in px), lit 0..1 (window
// band warm), dir (+1 = nose to the right), speed (blur streaks 0..1) } → { door: [x0, y0, x1, y1] the door light rect }
export function train(ctx, x, y, len, h, t, o = {}) {
  const dir = o.dir ?? 1, lit = clamp(o.lit ?? 1), dr = clamp(o.door ?? 0), a = o.a ?? 1;
  const x0 = dir > 0 ? x - len : x, x1 = dir > 0 ? x : x + len, yb = y - h * .12, yt = yb - h;
  ctx.save(); ctx.globalAlpha = a;
  const body = new Path2D();
  if (dir > 0) { body.moveTo(x0, yb); body.lineTo(x0, yt); body.lineTo(x1 - h * 1.1, yt); body.bezierCurveTo(x1 - h * .35, yt, x1, yb - h * .45, x1, yb); body.closePath(); }
  else { body.moveTo(x1, yb); body.lineTo(x1, yt); body.lineTo(x0 + h * 1.1, yt); body.bezierCurveTo(x0 + h * .35, yt, x0, yb - h * .45, x0, yb); body.closePath(); }
  ctx.fillStyle = lin(ctx, 0, yt, 0, yb, [[0, mixHex(P.ind2, P.blue1, .4)], [.15, P.ind2], [1, P.night1]]); ctx.fill(body);
  ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(x0, yt, x1 - x0 - h * .9, 2);   // rim from above
  ctx.fillStyle = P.night0; ctx.fillRect(x0, yb, x1 - x0 - h * .2, h * .12);        // underframe / skirt
  // window band (warm, interrupted by pillars), the light of people inside
  const wy = yt + h * .22, wh = h * .3;
  ctx.save(); ctx.clip(body);
  ctx.fillStyle = mixHex(P.night1, P.halo1, .25 + .55 * lit); ctx.fillRect(x0 + 20, wy, x1 - x0 - h * 1.4, wh);
  ctx.fillStyle = P.ind2; for (let xx = x0 + 120; xx < x1 - h * 1.4; xx += 150) ctx.fillRect(xx, wy, 10, wh);
  ctx.restore();
  // the door
  const dx = dir > 0 ? x1 - (o.doorX ?? len * .4) : x0 + (o.doorX ?? len * .4), dw = h * .42, dyT = yt + h * .12, dyB = yb - 2;
  ctx.fillStyle = P.night1; ctx.fillRect(dx - dw / 2 - 3, dyT - 3, dw + 6, dyB - dyT + 3);
  let door = null;
  if (dr > 0) {
    const ow = dw * dr;
    ctx.fillStyle = lin(ctx, 0, dyT, 0, dyB, [[0, P.core1], [.5, P.halo0], [1, P.halo1]]); ctx.fillRect(dx - ow / 2, dyT, ow, dyB - dyT);
    halo(ctx, dx, (dyT + dyB) / 2, h * 1.4 * Math.sqrt(dr), .35 * dr * a, P.halo1, P.core1);
    door = [dx - ow / 2, dyT, dx + ow / 2, dyB];
  }
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.fillRect(dx - dw / 2, dyT, dw / 2 * (1 - dr), dyB - dyT); ctx.fillRect(dx + dw / 2 * dr, dyT, dw / 2 * (1 - dr), dyB - dyT);   // the two leaves
  // the head light
  const hx = dir > 0 ? x1 - h * .18 : x0 + h * .18; halo(ctx, hx, yb - h * .25, h * .9, .5 * a, P.halo1, P.core0);
  if (o.speed > 0) {   // speed streaks along the window band (a fast pass)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, .25 * o.speed); ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) { const yy = wy + wh * (i + .5) / 5, l = len * (.3 + .2 * Math.sin(i * 7)); ctx.beginPath(); ctx.moveTo(x0 - l * dir * 0, yy); ctx.lineTo(x0 - dir * l, yy); ctx.stroke(); }
    ctx.restore();
  }
  ctx.restore();
  return { door, doorX: dx, top: yt, bottom: yb };
}

// ---------- phone ----------
// (x, y) centre, h height, rot. o: { lum (screen), screen(ctx, w, h) draws the content in screen-local coords (0..w, 0..h), a }
export function phone(ctx, x, y, h, rot = 0, t = 0, o = {}) {
  const w = h * .5, a = o.a ?? 1, lum = clamp(o.lum ?? 1);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a;
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, w * .14); ctx.fill();
  const sw = w * .88, sh = h * .92;
  ctx.fillStyle = lin(ctx, 0, -sh / 2, 0, sh / 2, [[0, mixHex(COL.coolDeep, COL.cool, .35 * lum)], [1, mixHex(P.night1, COL.coolDeep, .7 * lum)]]);
  ctx.beginPath(); ctx.roundRect(-sw / 2, -sh / 2, sw, sh, w * .1); ctx.fill();
  if (o.screen) { ctx.save(); ctx.beginPath(); ctx.roundRect(-sw / 2, -sh / 2, sw, sh, w * .1); ctx.clip(); ctx.translate(-sw / 2, -sh / 2); o.screen(ctx, sw, sh); ctx.restore(); }
  ctx.restore();
  halo(ctx, x, y, h * .9, .22 * lum * a, COL.cool2, COL.cool);
}
// a fund statement on a phone screen (cool): a line that climbs, a big number, a label. u 0..1 (drawn)
export function fundScreen(u = 1, o = {}) {
  return (ctx, w, h) => {
    ctx.fillStyle = rgba(COL.cool, .9); ctx.font = `600 ${Math.round(w * .085)}px Inter`; ctx.textAlign = 'left';
    ctx.fillText(o.label ?? 'PENSION FUND', w * .1, h * .14);
    ctx.font = `${Math.round(w * .2)}px "Instrument Serif"`; ctx.fillStyle = P.cream; ctx.fillText(o.value ?? '+12.4%', w * .1, h * .3);
    const pts = []; for (let i = 0; i <= 24; i++) { const k = i / 24; pts.push([w * (.1 + .8 * k), h * (.75 - .38 * k * k - .03 * Math.sin(i * 1.7))]); }
    inkLine(ctx, pts, u, { col: COL.cool, w: Math.max(1.5, w * .02) });
    ctx.fillStyle = rgba(COL.cool2, .35); for (let i = 0; i < 3; i++) ctx.fillRect(w * .1, h * (.82 + i * .05), w * (.8 - i * .2), Math.max(1, h * .012));
  };
}

// ---------- the penny ticket (1844) / the basic-access ticket (the proposal) ----------
// (cx, cy) centre, w (height .45 w), rot. o: { lines: [big, small] (default ['1d', 'PER MILE · THIRD CLASS']), lum, glow (0..1 the
// ticket gives light: it is a seat), sx (flip), a }
export function ticket(ctx, cx, cy, w, rot = 0, o = {}) {
  const h = w * .45, sx = o.sx ?? 1; if (Math.abs(sx) < .02) return;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sx, 1);
  const p = new Path2D(); p.roundRect(-w / 2, -h / 2, w, h, w * .03);
  const nb = new Path2D(); nb.arc(-w / 2, 0, h * .12, 0, Math.PI * 2); nb.arc(w / 2, 0, h * .12, 0, Math.PI * 2);
  const body = p.op(nb, PathOp.Difference);
  if (o.glow) glowFill(ctx, body, w * .25, .5 * o.glow, P.halo1);
  paperFill(ctx, body, { lum: o.lum ?? 1, a: o.a ?? 1, seed: 351 });
  if (o.glow) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo1, .25 * o.glow); ctx.fill(body); ctx.restore(); }
  const a = o.a ?? 1, [big, small] = o.lines ?? ['1d', 'PER MILE · THIRD CLASS'];
  ctx.strokeStyle = rgba(COL.ink2, .5 * a); ctx.lineWidth = Math.max(1, w * .006); ctx.setLineDash([w * .015, w * .015]);
  ctx.beginPath(); ctx.moveTo(w * .22, -h * .42); ctx.lineTo(w * .22, h * .42); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = rgba(COL.ink, .85 * a); ctx.textAlign = 'center'; ctx.font = `${Math.round(h * .5)}px "Instrument Serif"`; ctx.fillText(big, -w * .12, h * .14);
  ctx.font = `600 ${Math.round(h * .09)}px Inter`; ctx.fillStyle = rgba(COL.ink2, .8 * a); ctx.fillText(small, -w * .12, h * .34);
  ctx.restore();
}

// ---------- THE SIGNATURE MOVE: the flip ----------
// a flat thing turns over around its vertical axis (u 0 → 1): front(ctx, sx) is drawn while it faces us, back(ctx, sx) after the
// edge. sx (−1..1) is the horizontal squash to pass on to the thing's own draw (banknote/certificate/ticket take o.sx). A light
// glint runs across at the edge (u ≈ .5). Ease the u yourself (expoOut for a snap, sineIO for a slow turn of a falling sheet).
export function flip(ctx, u, cx, cy, w, h, front, back, o = {}) {
  const c = Math.cos(Math.PI * clamp(u)), sx = Math.abs(c) < .02 ? .02 : Math.abs(c);
  if (c >= 0) front(ctx, sx); else back(ctx, sx);
  const g = Math.max(0, 1 - Math.abs(c) * 4);
  if (g > 0 && (o.glint ?? 1)) halo(ctx, cx, cy, Math.max(w, h) * .55 * g, .45 * g * (o.glint ?? 1), P.halo0, P.core0);
}

// ---------- mist: a soft paper-coloured band on a horizon (the light of "today" on the A1/A4 rail) ----------
export function mist(ctx, y, h, a = 1, col = COL.paper1) {
  ctx.save(); ctx.fillStyle = lin(ctx, 0, y - h, 0, y + h, [[0, rgba(col, 0)], [.5, rgba(col, .55 * a)], [1, rgba(col, 0)]]); ctx.fillRect(-W, y - h, W * 3, h * 2); ctx.restore();
}
