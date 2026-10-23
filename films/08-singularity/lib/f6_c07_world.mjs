// Film 6 · c07 · the world of §3b/§3c: a dim room; a dark wooden table in the lower left with the cards of the maps on it and the one
// desk lamp (the ember) at its right end; beyond the table the tall mirror of the mind standing against the back wall; empty floor before it.
// World space = a 1920×1080 frame at cam z 1 (kit camMap/view); the wall layer extends far beyond it. Everything is a pure function of t.
// Kit copies in this file (BRIEF §9): clipPaneC07 (lib/f6_kit.mjs clipPane with the switch-on ramps of c02, see below); nothing else.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, drift, canvas, text, addGlow, hatch } from '../engine.mjs';
import { stipple, vnoise } from './art.mjs';
import { fibreFill } from './print.mjs';
import { F6, layer, once, pane, coolText, coolLine, ember, reveal, breathe, mirrorOfMind, pending } from './f6_kit.mjs';
import { paperSheet, scribble } from './paper.mjs';
import { clipFrame, ROOT } from './kit.mjs';
import { loadImage } from '@napi-rs/canvas';

const TAU = Math.PI * 2;
export const QUART = (x) => (x = clamp(x)) < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
export const EXPO_OUT = (x) => (x = clamp(x)) >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
export const EXPO_IN = (x) => (x = clamp(x)) <= 0 ? 0 : Math.pow(2, 10 * x - 10);

// ---------------------------------------------------------------- the world's fixed geometry (world coordinates, cam z 1)
export const LAMP = { x: 1215, y: 660, s: 1.45, dir: .5 };
export const MIRROR = { x: 1500, y: 170, w: 520, h: 760 };          // its lower edge (the pulse line) is at y = MIRROR.y + MIRROR.h / 2 = 550
export const EDGE_Y = MIRROR.y + MIRROR.h / 2;
export const FLOOR_Y = 560;
export const TABLE = { x0: -400, x1: 1290, yFar: 600, yNear: 1500, slant: 40 };
export const PLATE_W = 300, PLATE_H = 1080 / (1920 / 300);           // the study page: exactly the paper plate's proportions (168.75)
// the cards: x, y = centre; kind decides face and back; rot = lying angle. C0 is the page we come out of (its face IS the paper plate).
export const CARDS = [
  { id: 'C0', x: 640, y: 1070, w: PLATE_W, h: PLATE_H, rot: 0, kind: 'plate' },
  { id: 'C1', x: 430, y: 630, w: 240, h: 150, rot: -.06, kind: 'science', dim: .1 },
  { id: 'C5', x: 290, y: 880, w: 280, h: 180, rot: .07, kind: 'monk', dim: .18 },
  { id: 'C3', x: 940, y: 690, w: PLATE_W, h: PLATE_H, rot: -.04, kind: 'hinton' },
  { id: 'C2', x: 650, y: 650, w: 230, h: 145, rot: .05, kind: 'chalmers', dim: .06 },
  { id: 'C4', x: 190, y: 640, w: 240, h: 150, rot: -.09, kind: 'bach', dim: .22 },
];
export const SLIP = { x: 330, y: 1002, w: 300, h: 38, rot: -.015, label: 'WARNEKEN & TOMASELLO  ·  SCIENCE  ·  2006' };
const K = 2;   // cached card faces are painted at 2× (the camera zooms to 2.2 on the Hinton card, 1.2 on the others)

// ---------------------------------------------------------------- the room: wall + floor (one cached layer, parallax .95)
export const WALL = { x: -400, y: -300, w: 3100, h: 1800 };
export function wallLayer() {
  return layer('c07-wall', WALL.w, WALL.h, (g, c) => {
    g.translate(-WALL.x, -WALL.y);
    const bg = g.createLinearGradient(0, -300, 0, FLOOR_Y); bg.addColorStop(0, '#070a18'); bg.addColorStop(.6, '#0e1430'); bg.addColorStop(1, '#121a38'); g.fillStyle = bg; g.fillRect(WALL.x, WALL.y, WALL.w, FLOOR_Y - WALL.y);
    // the lamp's warm wash on the wall, right of the mirror and behind the lamp (static part; the breathing part is live)
    const ww = g.createRadialGradient(LAMP.x - 40, LAMP.y - 240, 0, LAMP.x - 40, LAMP.y - 240, 900); ww.addColorStop(0, rgba('#ffb35c', .16)); ww.addColorStop(.5, rgba('#c4512e', .06)); ww.addColorStop(1, rgba('#c4512e', 0)); g.fillStyle = ww; g.fillRect(WALL.x, WALL.y, WALL.w, FLOOR_Y - WALL.y);
    // plaster: fibre + an engraved hatch in the dark
    g.beginPath(); g.rect(WALL.x, WALL.y, WALL.w, FLOOR_Y - WALL.y); fibreFill(g, .05);
    hatch(g, null, -.85, 7, .04, { box: [WALL.x, WALL.y, WALL.w, FLOOR_Y - WALL.y], col: '#000000', w: .8, wobble: .6 });
    // the floor: a dark stone floor with a faint sheen toward the mirror, a skirting line
    const fg = g.createLinearGradient(0, FLOOR_Y, 0, WALL.y + WALL.h); fg.addColorStop(0, '#0a0d1f'); fg.addColorStop(.5, '#070914'); fg.addColorStop(1, '#04050c'); g.fillStyle = fg; g.fillRect(WALL.x, FLOOR_Y, WALL.w, WALL.y + WALL.h - FLOOR_Y);
    g.fillStyle = 'rgba(120,130,170,.12)'; g.fillRect(WALL.x, FLOOR_Y - 2, WALL.w, 2);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(WALL.x, FLOOR_Y, WALL.w, 14);
    // floor boards: faint long lines in perspective toward the vanishing point
    g.strokeStyle = 'rgba(90,100,140,.07)'; g.lineWidth = 1; for (let i = -14; i <= 24; i++) { const x0 = 960 + i * 150; g.beginPath(); g.moveTo(x0, FLOOR_Y); g.lineTo(960 + (x0 - 960) * 2.6, WALL.y + WALL.h); g.stroke(); }
    hatch(g, null, -.7, 9, .05, { box: [WALL.x, FLOOR_Y, WALL.w, WALL.y + WALL.h - FLOOR_Y], col: '#000000', w: .8, wobble: .8 });
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .18, g: 1, seed: 2, mid: false, boost: 1 });
  });
}

// ---------------------------------------------------------------- the table: dark wood, seen from a little above; its right end is visible
export const TBOX = [TABLE.x0 - 20, TABLE.yFar - 30, TABLE.x1 + 80 - TABLE.x0 + 20, 560];
export function tableLayer() {
  return layer('c07-table', TBOX[2], TBOX[3], (g, c) => {
    g.translate(-TBOX[0], -TBOX[1]);
    const D = TABLE, n = vnoise(5), r = prng(8), yB = TBOX[1] + TBOX[3];
    // the top
    g.save(); g.beginPath(); g.moveTo(D.x0, D.yFar); g.lineTo(D.x1, D.yFar); g.lineTo(D.x1 + D.slant * (yB - D.yFar) / (D.yNear - D.yFar), yB); g.lineTo(D.x0, yB); g.closePath(); g.clip();
    const tg = g.createLinearGradient(0, D.yFar, 0, yB); tg.addColorStop(0, '#231a2a'); tg.addColorStop(1, '#140f1a'); g.fillStyle = tg; g.fillRect(D.x0, D.yFar, D.x1 - D.x0 + 200, yB - D.yFar);
    // light falls from the lamp at the right: the far left of the table stays dark
    const lg = g.createRadialGradient(LAMP.x - 60, LAMP.y + 40, 0, LAMP.x - 60, LAMP.y + 40, 1500); lg.addColorStop(0, 'rgba(255,190,120,.16)'); lg.addColorStop(.4, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = lg; g.fillRect(D.x0, D.yFar, D.x1 - D.x0 + 200, yB - D.yFar);
    g.lineCap = 'round';
    for (let k = 0; k < 220; k++) { const yy = D.yFar + r() * (yB - D.yFar), light = r() < .4; g.strokeStyle = light ? `rgba(150,110,90,${.05 + r() * .1})` : `rgba(10,6,10,${.12 + r() * .2})`; g.lineWidth = .6 + r() * 1.4; g.beginPath(); for (let x = D.x0; x <= D.x1 + 60; x += 30) { const yv = yy + (n(x * .004, yy * .02) - .5) * 14; x === D.x0 ? g.moveTo(x, yv) : g.lineTo(x, yv); } g.stroke(); }
    g.restore();
    // the far edge (a lit rim) and the right end (its thickness, darker)
    g.fillStyle = 'rgba(255,200,150,.1)'; g.fillRect(D.x0, D.yFar, D.x1 - D.x0, 2);
    g.fillStyle = '#0d0912'; g.beginPath(); g.moveTo(D.x1, D.yFar); g.lineTo(D.x1 + 26, D.yFar + 6); g.lineTo(D.x1 + D.slant * (yB - D.yFar) / (D.yNear - D.yFar) + 26, yB); g.lineTo(D.x1 + D.slant * (yB - D.yFar) / (D.yNear - D.yFar), yB); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,200,150,.14)'; g.beginPath(); g.moveTo(D.x1, D.yFar); g.lineTo(D.x1 + 26, D.yFar + 6); g.lineTo(D.x1 + 28, D.yFar + 9); g.lineTo(D.x1 + 2, D.yFar + 3); g.closePath(); g.fill();
    hatch(g, null, -1.2, 5, .3, { box: [D.x1 - 2, D.yFar, 80, yB - D.yFar], col: '#000000', w: .7, wobble: .5 });
    // the table's shadow on the floor at its right end
    const sg = g.createLinearGradient(D.x1 + 26, 0, D.x1 + 160, 0); sg.addColorStop(0, 'rgba(3,3,10,.75)'); sg.addColorStop(1, 'rgba(3,3,10,0)'); g.fillStyle = sg; g.fillRect(D.x1 + 20, D.yFar + 6, 140, yB - D.yFar);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .22, g: 1, seed: 4, mid: false, boost: 1 });
  });
}

// ---------------------------------------------------------------- the card faces (cached at K×, card-local: origin = top-left of the card)
const INK = '#2a2420';
const caps = (g, s, x, y, size, col, o = {}) => text(g, s, x, y, { size, weight: 600, color: col, spacing: o.spacing ?? 3, align: o.align || 'left' });
// a tiny engraved seated figure (the one sitting very still, 3.07) at x, y = the ground point, s ≈ 1 → 60 px tall
function sitterGlyph(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = rgba(INK, .9); g.fillStyle = rgba(INK, .85); g.lineWidth = 1.6; g.lineJoin = 'round'; g.lineCap = 'round';
  g.beginPath(); g.ellipse(0, -4, 26, 8, 0, 0, TAU); g.fill();                                   // the folded legs
  g.beginPath(); g.moveTo(-16, -6); g.quadraticCurveTo(-18, -34, -8, -44); g.lineTo(8, -44); g.quadraticCurveTo(18, -34, 16, -6); g.closePath(); g.fill();   // torso
  g.beginPath(); g.moveTo(-15, -36); g.quadraticCurveTo(-24, -20, -10, -12); g.moveTo(15, -36); g.quadraticCurveTo(24, -20, 10, -12); g.stroke();   // arms resting
  g.beginPath(); g.arc(0, -54, 9.5, 0, TAU); g.fill();                                           // head
  g.restore();
}
function flameGlyph(g, x, y, s, col = INK) {
  g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = rgba(col, .9); g.lineWidth = 1.5; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-14, -12, -12, -32, 0, -46); g.bezierCurveTo(12, -32, 14, -12, 0, 0); g.stroke();
  g.beginPath(); g.moveTo(0, -6); g.bezierCurveTo(-6, -12, -5, -22, 0, -30); g.bezierCurveTo(5, -22, 6, -12, 0, -6); g.stroke();
  g.strokeStyle = rgba(col, .6); g.lineWidth = 1; g.beginPath(); g.moveTo(-10, 2); g.lineTo(10, 2); g.stroke();
  g.restore();
}
// an engraved pulse line (P-QRS-T) from x0 to x1 at baseline y; returns the x of the spike
export function pulseShape(q) { return -.22 * Math.exp(-Math.pow((q + 1.1) / .3, 2)) + Math.exp(-Math.pow(q / .17, 2)) - .3 * Math.exp(-Math.pow((q - .45) / .22, 2)) + .28 * Math.exp(-Math.pow((q - 1.3) / .4, 2)); }
function pulseGlyph(g, x0, x1, y, xs, amp, col = INK) {
  g.save(); g.strokeStyle = rgba(col, .9); g.lineWidth = 1.6; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
  for (let x = x0; x <= x1; x += 2) { const yy = y - amp * pulseShape((x - xs) / 22); x === x0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); g.restore();
}
function paperFace(g, w, h, o) {
  paperSheet(g, 0, 0, w, h, { tone: o.tone || '#efe4cc', seed: o.seed ?? 3, shadow: false, light: [w * 1.25, -h * .35], lines: 0 });
  if (o.dim) { g.fillStyle = rgba('#1a1420', o.dim); g.fillRect(-2, -2, w + 4, h + 4); }
}
export function cardFace(card) {
  const { w, h, kind } = card;
  return layer('c07-face-' + card.id, Math.ceil(w * K) + 8, Math.ceil(h * K) + 8, (g, c) => {
    g.translate(4, 4); g.scale(K, K);
    if (kind === 'science') {
      paperFace(g, w, h, { seed: 11, dim: card.dim });
      caps(g, 'ANIL SETH · BEING YOU · 2021', 18, 26, 9, rgba(INK, .8), { spacing: 2 });
      g.strokeStyle = rgba(INK, .25); g.lineWidth = 1; g.beginPath(); g.moveTo(18, 34); g.lineTo(w - 18, 34); g.stroke();
      // the body's outline (head and chest, 6.02) and the pulse running through the chest
      g.save(); g.strokeStyle = rgba(INK, .75); g.lineWidth = 1.3; g.lineJoin = 'round';
      g.beginPath(); g.arc(54, 72, 13, 0, TAU); g.stroke();
      g.beginPath(); g.moveTo(32, 132); g.quadraticCurveTo(30, 98, 47, 90); g.lineTo(61, 90); g.quadraticCurveTo(78, 98, 76, 132); g.stroke();
      g.restore();
      pulseGlyph(g, 90, w - 16, 98, card.spikeX = 146, 24);
      scribble(g, 94, 120, w - 110, 6, { seed: 21, ink: rgba(INK, .55), lw: 1 }); scribble(g, 94, 134, w - 140, 6, { seed: 22, ink: rgba(INK, .5), lw: 1 });
      card.ember = [card.spikeX, 98]; card.pulse = { x0: 90, x1: w - 16, y: 98, amp: 24 };
    } else if (kind === 'monk') {
      paperFace(g, w, h, { tone: '#e7d4aa', seed: 13, dim: card.dim });
      caps(g, 'SAMKHYA  ·  VEDANTA', 20, 28, 9.5, rgba(INK, .8));
      g.strokeStyle = rgba(INK, .25); g.lineWidth = 1; g.beginPath(); g.moveTo(20, 36); g.lineTo(w - 20, 36); g.stroke();
      // the oldest map (3.06): the one sitting still, the line, the flame
      sitterGlyph(g, 76, 150, .95);
      g.strokeStyle = rgba(INK, .7); g.lineWidth = 1.2; g.beginPath(); g.moveTo(124, 100); g.lineTo(190, 100); g.stroke();
      g.strokeStyle = rgba(INK, .45); g.setLineDash([2, 4]); g.beginPath(); g.moveTo(124, 126); g.lineTo(250, 126); g.stroke(); g.setLineDash([]);
      flameGlyph(g, 222, 98, .85);
      card.ember = [222, 74];
      // devanagari-like notes (unreadable)
      for (let i = 0; i < 3; i++) { g.strokeStyle = rgba(INK, .55); g.lineWidth = 1; g.beginPath(); g.moveTo(124, 142 + i * 13); g.lineTo(124 + 100 - i * 26, 142 + i * 13); g.stroke(); scribble(g, 124, 145 + i * 13, 100 - i * 26, 5, { seed: 31 + i, ink: rgba(INK, .55), lw: .9 }); }
    } else {   // chalmers · bach · hinton: plain cream cards with notes (they are the ones that turn over)
      paperFace(g, w, h, { seed: 40 + card.id.charCodeAt(1), dim: card.dim });
      for (let i = 0; i < 5; i++) scribble(g, 22, 36 + i * 22, w - 44 - (i % 2) * 50, 6, { seed: 50 + i * 3 + card.id.charCodeAt(1), ink: rgba(INK, .5), lw: 1 });
    }
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .12, g: 1, seed: 9, mid: false, boost: 1 });   // putImageData honours the transform: reset first
  });
}
export function slipLayer() {
  return layer('c07-slip', Math.ceil(SLIP.w * K) + 8, Math.ceil(SLIP.h * K) + 8, (g, c) => {
    g.translate(4, 4); g.scale(K, K);
    paperSheet(g, 0, 0, SLIP.w, SLIP.h, { tone: '#e9dfc6', seed: 17, shadow: false, light: [SLIP.w * 1.2, -SLIP.h] });
    caps(g, SLIP.label, SLIP.w / 2, 24, 9.5, rgba(INK, .8), { align: 'center', spacing: 2 });
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .12, g: 1, seed: 10, mid: false, boost: 1 });
  });
}

// a soft shadow under a card (cached per card size: a blurred dark rectangle with a 24 px margin)
export function softShadow(c) {
  const w = Math.ceil(c.w) + 48, h = Math.ceil(c.h) + 48;
  return layer('c07-shadow-' + w + 'x' + h, w, h, (g) => { g.filter = 'blur(9px)'; g.fillStyle = 'rgba(3,3,10,.9)'; g.beginPath(); g.roundRect(22, 22, w - 44, h - 44, 3); g.fill(); g.filter = 'none'; });
}

// ---------------------------------------------------------------- the paper plate as the study page's face (live until tCache, then cached)
export function platePage(HI, tCache) {
  const [pc, pg] = canvas(W, H);
  return (t) => {
    if (t < tCache) { pg.setTransform(1, 0, 0, 1, 0, 0); HI.plate(pg, t); return pc; }
    return layer('c07-plate-cached', W, H, (g) => HI.plate(g, tCache));
  };
}

// ---------------------------------------------------------------- the backs of the turned cards: dark glass panes, the machine's lines
const BACK_LABEL = { chalmers: 'DAVID CHALMERS  ·  2023', bach: 'JOSCHA BACH' };
// card-local (origin = the card's centre, unrotated); tFlip = when the back became visible
export function cardBack(g, t, card, tFlip, T, clipOpts) {
  const { w, h } = card;
  if (card.kind === 'hinton') { clipPaneC07(g, t, T, 'C6', -w / 2, -h / 2, w, h, { frame: 'thin', edge: .8, radius: 4, ...clipOpts }); return; }
  pane(g, t, { x: 0, y: 0, w, h, frame: 'thin', edge: .8, radius: 4, spill: false, seed: card.id.charCodeAt(1), screenA: 1,
    screen: (q, pw, ph) => { coolText(q, t, { x: 18, y: 16, w: pw - 36, size: 9, lines: 5, lineH: 22, t0: tFlip + .35, cps: 26, gap: .3, seed: 70 + card.id.charCodeAt(1), ripple: true, lengths: [.9, .7, .95, .5, .6] }); } });
  const lab = BACK_LABEL[card.kind]; if (!lab) return;
  const u = lin(tFlip + .25, tFlip + .7, t); if (u <= 0) return;
  g.save(); g.font = '600 11px "Inter"'; try { g.letterSpacing = '3px'; } catch { } const tw = g.measureText(lab).width + lab.length * 3; g.restore();
  reveal(g, -w / 2, h / 2 + 6, tw + 6, 24, u, (q) => caps(q, lab, -w / 2 + 2, h / 2 + 22, 11, rgba(F6.cool, .85)));
}

// ---------------------------------------------------------------- clipPaneC07: the kit's clipPane (lib/f6_kit.mjs, K0) with c02's switch-on ramps:
// the TV band lines fade in over the first .12 of `on`, the pre-line stays until on > .1, and the pane's full-strength screen haze is held
// dark and let through over the first .3 of `on` (the kit pops both in at full strength). Frames: kit.mjs clipFrame (maxFrame-clamped);
// FIRST/LAST are the clip's first and last frames preloaded in prepare (preloadEnds) so the pre-roll and the switch-off have a real frame.
const ENDS = {};
export function preloadEnds(id, kLast) {
  ENDS[id] = { first: null, last: null };
  pending(loadImage(`${ROOT}clips/${id}/f00001.jpg`).then((im) => { ENDS[id].first = im; }).catch(() => { }));
  pending(loadImage(`${ROOT}clips/${id}/f${String(kLast).padStart(5, '0')}.jpg`).then((im) => { ENDS[id].last = im; }).catch(() => { }));
}
export function clipPaneC07(ctx, t, T, id, x, y, w, h, o = {}) {
  const c = T && T.clip ? T.clip(id) : null, ramp = o.ramp ?? .5;
  const on = o.on ?? (c ? sm(lin(c.start - ramp, c.start, t)) * (1 - sm(lin(c.end, c.end + ramp, t))) : 1);
  const u = c ? clamp((t - c.start) / Math.max(.01, c.end - c.start)) : 0, cx = x + w / 2, cy = y + h / 2, open = eout(on), hv = Math.max(2, h * open);
  const kMax = c ? Math.round((c.end - c.start) * 30) + 1 : 1, k = c ? Math.min(kMax, Math.floor(clamp(t - c.start, 0, c.end - c.start) * 30) + 1) : 1, E = ENDS[id];
  const fr = clipFrame(id, k) || (E && c && t < c.start + .5 ? E.first : E ? E.last : null);
  pane(ctx, t, { x: cx, y: cy, w, h, rot: o.rot ?? 0, yaw: o.yaw ?? 0, radius: o.radius ?? 6, frame: o.frame || 'thin', edge: (o.edge ?? .8) * (1 - .6 * on), spill: false, seed: 61,
    screenA: on > 0 ? 1 : 0, screen: (g, pw, ph) => {
      if (on < .3) { g.fillStyle = rgba(F6.glassBot, 1 - sm(lin(0, .3, on))); g.fillRect(0, 0, pw, ph); }
      g.save(); g.beginPath(); g.rect(0, ph / 2 - hv / 2, pw, hv); g.clip();
      if (fr) { const s = Math.max(pw / fr.width, ph / fr.height), dw = fr.width * s, dh = fr.height * s; g.drawImage(fr, (pw - dw) / 2, (ph - dh) / 2, dw, dh); }
      else { const sg = g.createRadialGradient(pw * .5, ph * .35, 0, pw * .5, ph * .35, pw * .7); sg.addColorStop(0, '#2a3a6a'); sg.addColorStop(1, '#070918'); g.fillStyle = sg; g.fillRect(0, 0, pw, ph); }
      g.globalAlpha = .05; g.fillStyle = '#000'; for (let yy = 0; yy < ph; yy += 4) g.fillRect(0, yy, pw, 1.5); g.globalAlpha = 1;
      const vg = g.createRadialGradient(pw / 2, ph / 2, Math.min(pw, ph) * .35, pw / 2, ph / 2, Math.max(pw, ph) * .72); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, rgba(F6.glassBot, o.vignette ?? .4)); g.fillStyle = vg; g.fillRect(0, 0, pw, ph);
      g.restore();
      if (on > 0 && on < .999) { const k2 = 1 - on, lin0 = sm(lin(0, .12, on)); g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; for (const yy of [ph / 2 - hv / 2, ph / 2 + hv / 2]) { for (const [lw2, al] of [[18, .08], [6, .25], [1.6, .95]]) { g.strokeStyle = rgba(lw2 < 2 ? F6.coolCore : F6.cool, al * (.4 + .6 * k2) * lin0); g.lineWidth = lw2; g.beginPath(); g.moveTo(-pw, yy); g.lineTo(pw * 2, yy); g.stroke(); } } g.restore(); }
    } });
  if (on <= .1) {
    const pre = c ? sm(lin(c.start - ramp - .4, c.start - ramp, t)) * (1 - sm(lin(c.end + ramp, c.end + ramp + .4, t))) : 0;
    if (pre > 0) coolLine(ctx, t, { from: [x + 8, cy], to: [x + w - 8, cy], a: pre * (1 - on / .1), head: false, w: 1.4 });
  }
  if (o.spill !== false && on > 0) addGlow(ctx, cx, cy, Math.max(w, h) * .9, .14 * on, '#cfe0f0', '#eef4ff');
  return { on, u, line: [cy - hv / 2, cy + hv / 2] };
}

// ---------------------------------------------------------------- the lamp (the ember of this world) and its pool on the table
export function lamp(g, t, a = 1) {
  // the pool of light on the table and the cards (lighter), breathing with the bulb
  const br = breathe(t, 60, 0);
  g.save(); g.globalCompositeOperation = 'lighter'; g.translate(LAMP.x - 150, LAMP.y + 60); g.scale(1, .42);
  const pg = g.createRadialGradient(0, 0, 0, 0, 0, 640 * br); pg.addColorStop(0, rgba(F6.amber, .3 * a)); pg.addColorStop(.5, rgba(F6.amber, .1 * a)); pg.addColorStop(1, rgba(F6.amber, 0)); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, 640, 0, TAU); g.fill(); g.restore();
  return ember(g, t, { x: LAMP.x, y: LAMP.y, kind: 'lamp', s: LAMP.s, dir: LAMP.dir, a, cone: .85, r: 240 });
}
// the lamp's breathing wash on the wall (live part)
export function wallWash(g, t) {
  const br = breathe(t, 60, 0); g.save(); g.globalCompositeOperation = 'lighter';
  const wg = g.createRadialGradient(LAMP.x - 40, LAMP.y - 240, 0, LAMP.x - 40, LAMP.y - 240, 760 * br); wg.addColorStop(0, rgba(F6.amber, .1)); wg.addColorStop(.5, rgba(F6.amberDeep, .035)); wg.addColorStop(1, rgba(F6.amberDeep, 0)); g.fillStyle = wg; g.fillRect(LAMP.x - 900, LAMP.y - 1100, 1800, 1200); g.restore();
}
// dust motes in the lamp's light (near plane)
export function motes(g, t) {
  const r = prng(77); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 50; i++) { const x0 = LAMP.x - 520 + r() * 560, y0 = LAMP.y - 260 + r() * 360, sp = .3 + r(), x = x0 + Math.sin(t * .5 * sp + i) * 14, y = y0 + Math.cos(t * .33 * sp + i * 1.7) * 10 - (t * 4 * sp) % 60; const d = Math.hypot(x - LAMP.x + 150, y - LAMP.y + 120) / 480, al = (1 - clamp(d)) * (.15 + .4 * r()); if (al <= .01) continue; g.fillStyle = rgba('#ffd9a8', al); g.fillRect(x, y, 1.4, 1.4); }
  g.restore();
}

// ---------------------------------------------------------------- the two embers of 7.04, drawn in card-local coordinates (origin = the card's centre)
// the flame on the old map lights from within (u 0..1 = the light growing), the pulse on the science card runs amber; both beat as a heart
export function cardEmber(g, t, c, u, alive) {
  if (u <= 0) return; const e = eout(u), br = breathe(t, 60, 0, 'heart', .03 + .05 * alive), k = (br - 1) / .08 + .5;   // k ≈ 0..1 with the beat
  g.save(); g.translate(-c.w / 2, -c.h / 2); g.globalCompositeOperation = 'lighter';
  if (c.kind === 'monk') {
    const [fx, fy] = c.ember, base = fy + 24, fh = 40 * (.92 + .16 * k) * .85;
    const fg = g.createRadialGradient(fx, base - fh * .45, 0, fx, base - fh * .45, fh); fg.addColorStop(0, rgba(F6.amberCore, .95 * e)); fg.addColorStop(.4, rgba(F6.amber, .75 * e)); fg.addColorStop(1, rgba(F6.amberDeep, 0));
    g.fillStyle = fg; g.beginPath(); g.moveTo(fx, base); g.bezierCurveTo(fx - 12, base - 10, fx - 10, base - 28, fx, base - fh); g.bezierCurveTo(fx + 10, base - 28, fx + 12, base - 10, fx, base); g.fill();
    g.fillStyle = rgba('#ffffff', .8 * e); g.beginPath(); g.ellipse(fx, base - 11, 2.4, 6 * (.9 + .2 * k), 0, 0, TAU); g.fill();
    ember(g, t, { x: fx, y: base - fh * .5, kind: 'glow', r: (54 + 22 * alive) * e, a: .9 * e, bpm: 60 });
  } else if (c.pulse) {
    const P = c.pulse, amp = P.amp * (.85 + .45 * k);
    const trace = () => { g.beginPath(); for (let x = P.x0; x <= P.x1; x += 2) { const yy = P.y - amp * pulseShape((x - c.spikeX) / 22); x === P.x0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } };
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const [lw, al, col] of [[12, .07, F6.amber], [4.5, .28, F6.amber], [1.5, .95, F6.amberCore]]) { g.strokeStyle = rgba(col, al * e); g.lineWidth = lw; trace(); g.stroke(); }
    ember(g, t, { x: c.spikeX, y: P.y - amp * .6, kind: 'glow', r: (46 + 20 * alive) * e, a: .85 * e, bpm: 60 });
  }
  g.restore();
}

// ---------------------------------------------------------------- the mirror of the mind, standing beyond the table; what it gives back
// in the glass: the room as the mirror sees it: the table's end with the lamp from behind and the cards' small lights, the floor, and above
// them the dark where someone looking in would be. Nobody. Pane-local coords (origin = centre), mirrored by pane().
function reflection(q, t, o) {
  const w = MIRROR.w, h = MIRROR.h;
  const bg = q.createLinearGradient(0, -h / 2, 0, h / 2); bg.addColorStop(0, '#0c1022'); bg.addColorStop(.45, '#121830'); bg.addColorStop(.62, '#0c1020'); bg.addColorStop(1, '#06070e'); q.fillStyle = bg; q.fillRect(-w / 2, -h / 2, w, h);
  // the floor's edge far back in the glass: one faint line
  q.fillStyle = 'rgba(120,130,170,.07)'; q.fillRect(-w / 2, 90, w, 1.5);
  // the table's end (drawn at +x so it appears on the left after the mirroring), receding toward the viewer's side
  q.fillStyle = '#1a1420'; q.beginPath(); q.moveTo(w / 2, 300); q.lineTo(40, 316); q.lineTo(-10, h / 2); q.lineTo(w / 2, h / 2); q.closePath(); q.fill();
  q.fillStyle = 'rgba(255,200,150,.08)'; q.beginPath(); q.moveTo(w / 2, 300); q.lineTo(40, 316); q.lineTo(44, 320); q.lineTo(w / 2, 304); q.closePath(); q.fill();
  // the cards' lights on the slab, small and far: the two embers of 7.04 as warm glows, the glass as cool ones
  for (const [x, y, em, cool] of [[190, 336, o.emberMonk, 0], [230, 352, o.emberSci, 0], [150, 346, 0, 1], [215, 370, 0, 1]]) { if (em > 0) addGlow(q, x, y, 34, .28 * em, F6.amber, F6.amberCore); if (cool) addGlow(q, x, y, 26, .08, F6.cool, F6.coolCore); }
  ember(q, t, { x: 110, y: 302, kind: 'lamp', s: .5, dir: -.5, a: .85, r: 180 });
}
// the mirror with its reflection and, from tLine on, the pulse line along its lower edge (drawn by pulseEdge in the scene, world space)
export function mirror(g, t, o = {}) {
  return mirrorOfMind(g, t, { x: MIRROR.x, y: MIRROR.y, w: MIRROR.w, h: MIRROR.h, clouds: null, dim: .2, floor: true, edge: .9, reflectA: 1, reflect: (q) => reflection(q, t, o) });
}
// the pulse line along the mirror's lower edge: amber, one heartbeat travelling along it per second (amp), straightening and going cream
// (cream 0..1) and growing beyond the mirror's edges (ext 0..1) until it spans the whole frame: then it is the cream line plate's line.
// The strokes copy lib/handoff4.mjs linePlate (widths, alphas, wobble, ticks) so the squeeze ends in the identical line.
export function pulseEdge(g, t, o) {
  const amp = o.amp ?? 0, cream = clamp(o.cream ?? 0), ext = clamp(o.ext ?? 0), a = o.a ?? 1; if (a <= 0) return;
  const grow = eout(clamp(o.grow ?? 1)), xl = MIRROR.x - MIRROR.w / 2, xr = MIRROR.x + MIRROR.w / 2;
  const x0 = mix(xl, -2200, eout(ext)), x1 = mix(mix(xl, xr, grow), 5200, eout(ext)), y = EDGE_Y + 2 * Math.sin(t * .9) * cream;
  const col = [mixCol(F6.amber, '#e9dcc0', cream), mixCol(F6.amberCore, '#fffaf0', cream)], br = .9 + .1 * Math.sin(t * 2.1);
  const xs = MIRROR.x - MIRROR.w / 2 + ((t - (o.t0 ?? 0)) % 1 + 1) % 1 * MIRROR.w;   // the beat runs along the edge once per second
  const pts = []; for (let x = x0; x <= x1; x += 3) pts.push([x, y - amp * pulseShape((x - xs) / 34)]);
  const trace = () => { g.beginPath(); pts.forEach(([x, yy], i) => (i ? g.lineTo(x, yy) : g.moveTo(x, yy))); };
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
  for (const [w, al, c] of [[26, .05, col[0]], [10, .14, col[0]], [3.2, .55 * br, col[0]], [1.4, .95, col[1]]]) { g.strokeStyle = rgba(c, al * a); g.lineWidth = w; trace(); g.stroke(); }
  g.strokeStyle = rgba(col[1], .35 * a); g.lineWidth = 1; g.beginPath(); for (let x = x0; x < x1; x += 9) { const hh = 2 + 1.5 * Math.sin((x - MIRROR.x) * .07 + t), yy = y - amp * pulseShape((x - xs) / 34); g.moveTo(x, yy - hh); g.lineTo(x + 3, yy + hh); } g.stroke();
  // the beat's own light runs with the spike
  if (amp > 0) addGlow(g, xs, y - amp * .7, 60 + amp * 2, .35 * a * (1 - cream), F6.amber, F6.amberCore);
  g.restore();
}
const hex2 = (hx) => { const n = parseInt(hx.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const mixCol = (a, b, u) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(mix(v, B[i], u)).toString(16).padStart(2, '0')).join(''); };

// ---------------------------------------------------------------- the switch-off: the whole picture collapses into the line at y (old TV),
// over the plate already drawn beneath. k = the picture's remaining height (1 → 0); the band's edges carry the cream line.
export function collapse(ctx, pic, k, y, col = ['#e9dcc0', '#fffaf0']) {
  if (k * H < .5) return;
  ctx.save(); ctx.translate(0, y); ctx.scale(1, k); ctx.translate(0, -y); ctx.drawImage(pic, 0, 0); ctx.restore();
  const k2 = 1 - k; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const yy of [y - y * k, y + (H - y) * k]) for (const [lw, al, c] of [[18, .07, col[0]], [6, .22, col[0]], [1.5, .9, col[1]]]) { ctx.strokeStyle = rgba(c, al * (.35 + .65 * k2)); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-10, yy); ctx.lineTo(W + 10, yy); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- the caption (screen space): written by the cool line, taken back by it
export function caption(ctx, t, str, u) {
  if (u <= 0) return;
  coolLine(ctx, t, { write: { text: str, x: 110, y: 150, size: 21, font: 'Inter', weight: 600, spacing: 4, lead: 120, lag: 36, fill: .92 }, u, w: 1.2, glow: .6 });
}
