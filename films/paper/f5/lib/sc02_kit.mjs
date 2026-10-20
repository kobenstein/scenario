// C2 kit: grounds, sheets, medallions and the coin for chunk c02 (§0 caveats, §1 inheritance up to Paine). Owner C2.
// Everything static is cached once; the live parts (light, glint, motion) are drawn per frame.
//   plateBG(ctx, t, { warm, cool, dx, dy })          §0 engraving plate (indigo) with a raking light
//   umberBG(ctx, t, { lx, ly, r, warm, night, dx, dy })  §1 dark umber / night ground with a light pool
//   anthSheet(ctx, t, x, y, s, rot)                   Anthropic's announcement as our typeset card (torn corner from H.06)
//   muskSheet(ctx, t, x, y, s, rot, words)            Musk's quote card (quoteCard2, fully lit), same look as C1's 0.04
//   emptySeal(ctx, x, y, r, t, { a, col })            an empty, unembossed seal ring (dotted ghost scallops)
//   medal(ctx, x, y, R, t, o)                          an engraved rosette medallion (0.10/0.11), foil wedge optional
//   coin(ctx, x, y, R, t, o)                           "your share": foil disc, guilloche rim, ring text, share light
import { W, H, rgba, clamp, lin, mix, eout, eio, sm, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { stipple, fog as artFog } from './art.mjs';
import { guilloche, gBorder, microRing, microtext, FOIL } from './certificate.mjs';
import { quoteCard2 } from './quote2.mjs';
import { paperSheet } from './paper.mjs';
import { shareLight } from './share.mjs';
import { perforation } from './perforate.mjs';
import { ghostLine } from './ghost.mjs';

export const TAU = Math.PI * 2;
export const PAL0 = { plate: '#141433', plate2: '#1d1d46', paper: '#efe4cc', ink: '#1f1a26', foil: '#ffb35c', cream: '#f3efe2' };
export const PAL1 = { umber: '#2a1c18', honey: '#e9a54b', old: '#e8d7b0', night: '#10123a', ochre: '#c8843a' };
const CACHE = new Map();
export function once(key, f) { if (!CACHE.has(key)) CACHE.set(key, f()); return CACHE.get(key); }

// ---------- grounds ----------
function plateLayer() {
  return once('plate', () => {
    const w = W + 240, h = H + 240, [c, g] = canvas(w, h);
    const bg = g.createRadialGradient(w * .45, h * .42, 0, w * .5, h * .5, w * .7); bg.addColorStop(0, '#20204a'); bg.addColorStop(.6, PAL0.plate); bg.addColorStop(1, '#0b0b22');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    // the plate's own engraving: very faint long guilloche sweeps and a fine diagonal ruling
    g.save(); g.globalAlpha = .05; g.strokeStyle = PAL0.cream; g.lineWidth = .8;
    for (let y = -h; y < h * 2; y += 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + w * .36); g.stroke(); }
    g.restore();
    const G = guilloche({ R: 900, A: 120, B: 40, n: 9, m: 4, lines: 22 }); g.save(); g.translate(w * .5, h * 1.25); g.strokeStyle = rgba(PAL0.cream, .045); g.lineWidth = 1;
    for (let k = 0; k < G.lines; k++) { const P = G.line(k); g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); } g.restore();
    stipple(c, { k: .5, g: 1, seed: 21, mid: false, boost: 1.4 });
    return c;
  });
}
export function plateBG(ctx, t, o = {}) {
  const dx = (o.dx ?? 0) + drift(t, 5, 3), dy = (o.dy ?? 0) + drift(t, 3, 4);
  ctx.fillStyle = PAL0.plate; ctx.fillRect(0, 0, W, H);
  ctx.drawImage(plateLayer(), -120 + dx, -120 + dy);
  const warm = o.warm ?? 1, cool = o.cool ?? 0;
  if (warm > 0) { const lx = 380 + 40 * Math.sin(t * .13), ly = -120, g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1500); g.addColorStop(0, rgba('#ffb35c', .2 * warm)); g.addColorStop(.45, rgba('#e9a54b', .07 * warm)); g.addColorStop(1, rgba('#e9a54b', 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  if (cool > 0) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgba('#9fb6cf', .08 * cool)); g.addColorStop(1, rgba('#9fb6cf', 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
function umberLayer(night) {
  return once('umber' + night, () => {
    const w = W + 240, h = H + 240, [c, g] = canvas(w, h);
    const top = night ? '#0d0f2c' : '#22160f', mid = night ? PAL1.night : PAL1.umber, low = night ? '#07081a' : '#120b08';
    const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, top); bg.addColorStop(.55, mid); bg.addColorStop(1, low); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    // a soft mottled wall texture (no table, no room): large low-contrast patches
    const r = prng(night ? 41 : 43);
    for (let i = 0; i < 60; i++) { const x = r() * w, y = r() * h, R = 80 + r() * 260, gg = g.createRadialGradient(x, y, 0, x, y, R); gg.addColorStop(0, rgba(night ? '#2b2f66' : '#4a3020', .08 + r() * .06)); gg.addColorStop(1, rgba('#000000', 0)); g.fillStyle = gg; g.fillRect(x - R, y - R, R * 2, R * 2); }
    stipple(c, { k: .55, g: 1, seed: night ? 7 : 8, mid: false, boost: 1.6 });
    return c;
  });
}
export function umberBG(ctx, t, o = {}) {
  const night = !!o.night, dx = (o.dx ?? 0) + drift(t, 5, 7), dy = (o.dy ?? 0) + drift(t, 3, 8);
  ctx.fillStyle = night ? PAL1.night : PAL1.umber; ctx.fillRect(0, 0, W, H);
  ctx.drawImage(umberLayer(night), -120 + dx, -120 + dy);
  const lx = o.lx ?? 960, ly = o.ly ?? 420, R = o.r ?? 900, warm = o.warm ?? 1;
  if (warm > 0) { const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, R); const col = o.col || (night ? '#7f8fd8' : PAL1.honey); g.addColorStop(0, rgba(col, .22 * warm)); g.addColorStop(.5, rgba(col, .07 * warm)); g.addColorStop(1, rgba(col, 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
// a vignette that darkens the frame edges (in addition to the print finish)
export function vignette(ctx, a = .5, col = '#05040c') {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ---------- the two sheets of 0.05 ----------
export const ANTH = { w: 820, h: 540 };
function anthLayer() {
  return once('anth', () => {
    const { w, h } = ANTH, pad = 60, [c, g] = canvas(w + pad * 2, h + pad * 2); g.translate(pad, pad);
    // the corner torn off in H.06 (top right): the sheet outline skips it, perforation holes remain on the edge
    const cut = 92, outline = [[0, 0], [w - cut, 0], [w, cut], [w, h], [0, h]];
    g.save(); g.shadowColor = 'rgba(2,2,10,.6)'; g.shadowBlur = 26; g.shadowOffsetX = 10; g.shadowOffsetY = 18; g.fillStyle = 'rgba(2,2,10,.55)'; g.beginPath(); outline.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); g.restore();
    g.save(); g.beginPath(); outline.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.clip();
    paperSheet(g, 0, 0, w, h, { seed: 31, shadow: false, light: [w * .25, -h * .3] });
    g.restore();
    gBorder(g, 18, 18, w - 36, h - 36, { band: 22, lines: 7, waves: 140, col: '#2a3550', a: .55, w: .7, radius: 10 });
    // a paper patch where the corner was: re-clip so the border stops at the tear
    g.save(); g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.moveTo(w - cut - 4, -4); g.lineTo(w + 4, -4); g.lineTo(w + 4, cut + 4); g.closePath(); g.fill(); g.restore();
    perforation(g, [[w - cut, 0], [w, cut]], { pitch: 7, hole: 1.5, tear: 1, col: '#3a2c20', a: .85 });
    const ink = '#1f2a3a';
    text(g, 'ANTHROPIC', 70, 92, { size: 19, weight: 700, color: rgba(ink, .85), spacing: 7 });
    text(g, '18 OCT 2026', 70, 122, { size: 14, weight: 600, color: rgba(ink, .55), spacing: 4 });
    text(g, 'Investing in the', 70, 210, { size: 58, font: 'Instrument Serif', color: ink });
    text(g, 'public benefit', 70, 268, { size: 58, font: 'Instrument Serif', color: ink });
    // body: set type as word blocks (not readable, our own typesetting, no copy of the website)
    const r = prng(5); g.fillStyle = rgba(ink, .32);
    for (let i = 0; i < 6; i++) { let x = 72; const y = 318 + i * 21, end = i === 5 ? 380 : 470 - r() * 30; while (x < end) { const ww = 14 + r() * 46; g.fillRect(x, y, Math.min(ww, end - x), 6); x += ww + 8; } }
    // the pledge rosette with its foil slice (0.03), small, at the right
    const G = guilloche({ R: 92, A: 16, B: 7, n: 14, m: 6, lines: 22 }); g.save(); g.translate(640, 300); g.strokeStyle = rgba(ink, .6); g.lineWidth = .7;
    for (let k = 0; k < G.lines; k++) { const P = G.line(k); g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 118, -.62, -.28); g.closePath(); const fg = g.createLinearGradient(40, -80, 120, 0); FOIL.forEach((cc, i) => fg.addColorStop(i / (FOIL.length - 1), cc)); g.fillStyle = fg; g.globalAlpha = .9; g.fill(); g.restore();
    return c;
  });
}
export function anthSheet(ctx, t, x, y, s = 1, rot = 0, o = {}) {
  const L = anthLayer(), pad = 60, { w, h } = ANTH;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.globalAlpha = o.a ?? 1; ctx.drawImage(L, -w / 2 - pad, -h / 2 - pad);
  ctx.restore();
}
// Musk's card: the same quoteCard2 C1 uses (fully spoken), rendered once at scale 1 around (0, 0)
const MUSK = { name: 'Elon Musk', role: 'CEO, SpaceX and Tesla', source: 'post on X', date: '19 Oct 2026' };
export function muskLayer(words) {
  return once('musk', () => {
    const [c, g] = canvas(1400, 700); const ws = words.map((w) => ({ ...w, s: -10, e: -10 }));
    g.translate(700, 350); quoteCard2(g, 0, { words: ws, ...MUSK, x: 0, y: 0, t0: -100, t1: 1e6, hi: ['many'], seed: 13 });
    return c;
  });
}
export function muskSheet(ctx, t, x, y, s, rot, words) {
  const L = muskLayer(words); ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.scale(s, s); ctx.drawImage(L, -700, -350); ctx.restore();
}
// an empty seal ring: scalloped dotted ghost circle with an inner ring, nothing embossed
export function emptySeal(ctx, x, y, r, t, o = {}) {
  const pts = [], pts2 = []; for (let i = 0; i <= 140; i++) { const a = i / 140 * TAU, q = r * (1 + .035 * Math.cos(36 * a)); pts.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); pts2.push([x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72]); }
  ghostLine(ctx, pts, { ghost: 1, col: o.col || PAL0.cream, w: 1.3, a: (o.a ?? 1) * .8, dot: 5, t });
  ghostLine(ctx, pts2, { ghost: 1, col: o.col || PAL0.cream, w: 1, a: (o.a ?? 1) * .5, dot: 6, t });
}
// a dotted signature line on the plate (cream engraving): x .. x + w at y, label below
export function plateSigLine(ctx, x, y, w, t, o = {}) {
  const a = o.a ?? 1, col = o.col || PAL0.cream;
  ghostLine(ctx, [[x, y], [x + w, y]], { ghost: 1, col, w: 1.6, a: a * .9, dot: 7, t });
  ctx.save(); ctx.globalAlpha = a * .7; ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 4, y - 18); ctx.lineTo(x + 7, y - 7); ctx.moveTo(x + 7, y - 18); ctx.lineTo(x - 4, y - 7); ctx.stroke(); ctx.restore();
  text(ctx, 'SIGNATURE', x, y + 26, { size: o.size ?? 14, weight: 600, color: rgba(col, .55 * a), spacing: 4 });
}

// ---------- medallions (0.10) and the coin (0.11) ----------
// cached medallion face: a disc of dark plate with cream guilloche, two rims and a ring of microtext; v = design 0..3
const MED = [
  { n: 18, m: 7, A: .16, B: .06, lines: 30 }, { n: 12, m: 5, A: .2, B: .08, lines: 26 }, { n: 24, m: 9, A: .12, B: .05, lines: 34 }, { n: 15, m: 4, A: .18, B: .1, lines: 28 },
];
const MR = 200; // face radius in the cache
export function medalFace(v) {
  return once('medal' + v, () => {
    const D = MED[v % MED.length], S = MR * 2 + 40, [c, g] = canvas(S, S); g.translate(S / 2, S / 2);
    const bg = g.createRadialGradient(-60, -70, 0, 0, 0, MR); bg.addColorStop(0, '#2a2a5c'); bg.addColorStop(.8, '#16163a'); bg.addColorStop(1, '#0e0e28');
    g.fillStyle = bg; g.beginPath(); g.arc(0, 0, MR, 0, TAU); g.fill();
    const G = guilloche({ R: MR * .52, A: MR * D.A, B: MR * D.B, n: D.n, m: D.m, lines: D.lines }); g.strokeStyle = rgba(PAL0.cream, .62); g.lineWidth = .9;
    for (let k = 0; k < G.lines; k++) { const P = G.line(k); g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
    const G2 = guilloche({ R: MR * .2, A: MR * .05, B: MR * .02, n: 8, m: 3, lines: 14 }); g.strokeStyle = rgba(PAL0.cream, .5); g.lineWidth = .7;
    for (let k = 0; k < G2.lines; k++) { const P = G2.line(k); g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
    g.strokeStyle = rgba(PAL0.cream, .75); g.lineWidth = 2.2; g.beginPath(); g.arc(0, 0, MR - 3, 0, TAU); g.stroke();
    g.lineWidth = 1; g.beginPath(); g.arc(0, 0, MR * .8, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, MR * .93, 0, TAU); g.stroke();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .35, g: 1, seed: 3 + v, mid: false, boost: 1.2 });
    return c;
  });
}
// the ring of microtext between the two outer rims (rotates on its own)
export function medalRing(v) {
  return once('medring' + v, () => { const S = MR * 2 + 40, [c, g] = canvas(S, S); microRing(g, S / 2, S / 2, MR * .865, 'VALUE · SHARE · VALUE · SHARE', { size: 13, col: PAL0.cream, a: .7 }); return c; });
}
// the foil wedge of a medallion (the pledge slice): angular span a0..a1 in the cache's frame
export const WEDGE = [-.95, -.55];
export function medalWedge(v) {
  return once('medwedge' + v, () => {
    const S = MR * 2 + 40, [c, g] = canvas(S, S); g.translate(S / 2, S / 2);
    g.save(); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, MR - 2, WEDGE[0], WEDGE[1]); g.closePath(); g.clip();
    const fg = g.createLinearGradient(-MR, -MR, MR, MR); FOIL.forEach((cc, i) => fg.addColorStop(i / (FOIL.length - 1), cc)); g.fillStyle = fg; g.fillRect(-MR, -MR, MR * 2, MR * 2);
    const D = MED[v % MED.length], G = guilloche({ R: MR * .52, A: MR * D.A, B: MR * D.B, n: D.n, m: D.m, lines: D.lines }); g.strokeStyle = 'rgba(90,40,10,.55)'; g.lineWidth = .9;
    for (let k = 0; k < G.lines; k++) { const P = G.line(k); g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
    g.restore();
    g.strokeStyle = 'rgba(255,240,205,.9)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, MR - 2, WEDGE[0], WEDGE[1]); g.closePath(); g.stroke();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .5, g: 1.2, seed: 9 + v, mid: false, boost: 1.3 });
    return c;
  });
}
const wedgeClip = (ctx, R) => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, WEDGE[0], WEDGE[1]); ctx.closePath(); };
// medal: draws the medallion at (x, y) with screen radius R, seen at yaw (rad, squash), spinning rot; the wedge can leave (o.out 0..1 → offset)
//   o: { v, rot, ring (ring rotation), yaw, a, out (0..1 wedge pulled out), fall ([dx, dy, drot] extra wedge offset), glint (0..1 position of a
//        foil glint band across the face), edge (rim thickness px), light (0..1 rim light) }
export function medal(ctx, x, y, R, t, o = {}) {
  const v = o.v ?? 0, k = R / MR, yaw = o.yaw ?? 0, sq = Math.max(.08, Math.cos(yaw)), a = o.a ?? 1, S = MR * 2 + 40;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  // the rim (thickness) toward the turned-away side
  const ed = (o.edge ?? 10) * k * Math.sin(Math.abs(yaw)) * 3 * Math.sign(yaw || 1);
  ctx.save(); ctx.translate(ed, 0); ctx.scale(sq, 1); ctx.fillStyle = '#0a0a1c'; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.restore();
  ctx.save(); ctx.translate(ed * .5, 0); ctx.scale(sq, 1); ctx.strokeStyle = rgba('#c9a26a', .5); ctx.lineWidth = Math.max(1, R * .03); ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.stroke(); ctx.restore();
  ctx.scale(sq, 1); ctx.rotate(o.rot ?? 0); ctx.scale(k, k);
  ctx.drawImage(medalFace(v), -S / 2, -S / 2);
  ctx.save(); ctx.rotate(o.ring ?? 0); ctx.drawImage(medalRing(v), -S / 2, -S / 2); ctx.restore();
  const out = o.out ?? 0;
  if (out <= 0) { ctx.drawImage(medalWedge(v), -S / 2, -S / 2); }
  else { // the gap left behind, then the wedge travelling out
    ctx.save(); ctx.fillStyle = 'rgba(5,5,16,.85)'; wedgeClip(ctx, MR - 2); ctx.fill(); ctx.restore();
  }
  if ((o.glint ?? -1) >= 0 && out <= 0) { ctx.save(); wedgeClip(ctx, MR); ctx.clip(); const gx = mix(-MR * 1.2, MR * 1.2, o.glint), g = ctx.createLinearGradient(gx - 60, -40, gx + 60, 40); g.addColorStop(0, 'rgba(255,220,160,0)'); g.addColorStop(.5, 'rgba(255,250,235,.85)'); g.addColorStop(1, 'rgba(255,220,160,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(-MR, -MR, MR * 2, MR * 2); ctx.restore(); }
  ctx.restore();
  // the rim light on the lit side
  if ((o.light ?? 0) > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, y); ctx.scale(sq, 1); ctx.strokeStyle = rgba('#ffd59a', .35 * o.light * a); ctx.lineWidth = Math.max(1.5, R * .025); ctx.beginPath(); ctx.arc(0, 0, R * 1.005, -2.6, -.9); ctx.stroke(); ctx.restore(); }
}
// a free foil wedge (after it left its medallion): centre of the wedge's tip at (x, y)
export function wedge(ctx, x, y, R, rot, t, o = {}) {
  const v = o.v ?? 0, k = R / MR, S = MR * 2 + 40, sq = o.sq ?? 1;
  ctx.save(); ctx.globalAlpha = o.a ?? 1; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k * sq, k);
  const mid = (WEDGE[0] + WEDGE[1]) / 2; ctx.translate(-Math.cos(mid) * MR * .5, -Math.sin(mid) * MR * .5);   // pivot at the wedge's middle
  ctx.drawImage(medalWedge(v), -S / 2, -S / 2);
  if ((o.glint ?? -1) >= 0) { ctx.save(); wedgeClip(ctx, MR); ctx.clip(); const gx = mix(-MR * .2, MR * 1.1, o.glint), g = ctx.createLinearGradient(gx - 70, -50, gx + 70, 50); g.addColorStop(0, 'rgba(255,220,160,0)'); g.addColorStop(.5, 'rgba(255,238,196,.62)'); g.addColorStop(1, 'rgba(255,220,160,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(-MR, -MR, MR * 2, MR * 2); ctx.restore(); }
  ctx.restore();
}
// the wedge's centre point relative to the medallion centre (screen px, before yaw squash)
export function wedgeCentre(R, rot) { const mid = (WEDGE[0] + WEDGE[1]) / 2 + rot; return [Math.cos(mid) * R * .5, Math.sin(mid) * R * .5]; }

// the coin "your share" (M2)
function coinFace() {
  return once('coin', () => {
    const R = 200, S = R * 2 + 60, [c, g] = canvas(S, S); g.translate(S / 2, S / 2);
    const fg = g.createRadialGradient(-R * .35, -R * .4, 0, 0, 0, R * 1.05); fg.addColorStop(0, '#ffeccb'); fg.addColorStop(.45, '#f0b867'); fg.addColorStop(.85, '#c37a2e'); fg.addColorStop(1, '#7a3b17');
    g.fillStyle = fg; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.fill();
    const G = guilloche({ R: R * .8, A: R * .05, B: R * .025, n: 60, m: 13, lines: 10 }); g.strokeStyle = 'rgba(110,50,12,.6)'; g.lineWidth = 1;
    for (let k = 0; k < G.lines; k++) { const P = G.line(k); g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
    g.strokeStyle = 'rgba(110,50,12,.75)'; g.lineWidth = 2; for (const q of [.97, .9, .62]) { g.beginPath(); g.arc(0, 0, R * q, 0, TAU); g.stroke(); }
    microRing(g, 0, 0, R * .69, 'YOUR SHARE', { size: 15, col: '#5a2a08', a: .85 });
    const G2 = guilloche({ R: R * .32, A: R * .1, B: R * .04, n: 16, m: 6, lines: 16 }); g.strokeStyle = 'rgba(110,50,12,.45)'; g.lineWidth = .8;
    for (let k = 0; k < G2.lines; k++) { const P = G2.line(k); g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .6, g: 1.3, seed: 12, mid: false, boost: 1.3 });
    return c;
  });
}
// coin(ctx, x, y, R, t, { a, glint (0..1 band position, <0 none), rot, tilt (0..1 squash), light (share light inside, 1) })
export function coin(ctx, x, y, R, t, o = {}) {
  const a = o.a ?? 1, S = 460, k = R / 200, sq = 1 - (o.tilt ?? 0) * .7; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  // thickness edge
  ctx.save(); ctx.translate(0, R * .07 * (o.tilt ?? 0) + R * .03); ctx.scale(1, sq); ctx.fillStyle = '#5a2a0c'; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.restore();
  ctx.save(); ctx.scale(1, sq); ctx.rotate(o.rot ?? 0); ctx.scale(k, k); ctx.drawImage(coinFace(), -S / 2, -S / 2);
  if ((o.glint ?? -1) >= 0) { ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 200, 0, TAU); ctx.clip(); const gx = mix(-280, 280, o.glint), g = ctx.createLinearGradient(gx - 80, -60, gx + 80, 60); g.addColorStop(0, 'rgba(255,220,160,0)'); g.addColorStop(.5, 'rgba(255,250,235,.8)'); g.addColorStop(1, 'rgba(255,220,160,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(-220, -220, 440, 440); ctx.restore(); }
  ctx.restore();
  ctx.restore();
  if ((o.light ?? 1) > 0) shareLight(ctx, x, y, R * .2, t, { a: a * (o.light ?? 1) });
}
