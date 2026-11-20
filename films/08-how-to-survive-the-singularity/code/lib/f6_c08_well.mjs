// Film 6 · c08 · ★ the library of words (8.04–8.05): inside the pane, a square well of shelves rising to the sky, seen straight up its axis:
// nested rectangles, every edge a shelf carrying engraved words (cool glyph runs, half of them warm-tinted lullabies, half cold-tinted
// threats, all the same brightness). The camera rises (S grows): the shelves flow outward past the frame; the far end is a small night sky.
// Everything is drawn in REFERENCE units (300 × 168.75, the hall's display) and scaled to the pane that shows it, so the street's sign panel
// (592 × 333) and the hall's display meet pixel-exact at the cut (both at 2131 screen px wide).
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, canvas, text } from '../engine.mjs';
import { F6, layer, toImg, pending, once, coolText } from './f6_kit.mjs';

const TAU = Math.PI * 2;
export const REF = { w: 300, h: 168.75 };
export const WARM = '#ffcf8a', COLD = '#9fb8d6';
const RATIO = .84;                                     // level k has scale S · RATIO^k
const hex2 = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mixHex = (a, b, u) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(mix(v, B[i], clamp(u))).toString(16).padStart(2, '0')).join(''); };

// ---------------------------------------------------------------- the word strips (cached once, converted to Images): 8 wide ones for the
// top/bottom shelves (aspect w : band), 8 narrow ones for the sides (aspect h : band). Word runs alternate warm and cold at random.
const BAND = .105;                                     // strip height as a fraction of the level's half height b
const STRIP_H = 72;
const STRIPS = { wide: [], narrow: [] };
function paintStrip(g, c, seed, wpx) {
  const r = prng(seed), warmCore = mixHex(WARM, '#ffffff', .55), coldCore = mixHex(COLD, '#ffffff', .55);
  let x = 14, i = 0;
  while (x < wpx - 40) {
    const ww = 70 + r() * 230, warm = r() < .5;
    coolText(g, 100, { x, y: 14, w: Math.min(ww, wpx - x - 10), size: 30, lines: 1, cps: 1e4, seed: seed * 13 + i * 7 + 3, lengths: [1], col: warm ? WARM : COLD, core: warm ? warmCore : coldCore, cursor: false, ripple: false, a: warm ? .88 : 1 });
    x += ww + 22; i++;
  }
}
export function wellPrepare() {
  if (STRIPS.wide.length) return;
  const wide = Math.round(REF.w / (REF.h * BAND) * STRIP_H), narrow = Math.round(REF.h / (REF.h * BAND) * STRIP_H);
  for (let i = 0; i < 8; i++) {
    const cw = layer('c08strip-w' + i, wide, STRIP_H, (g, c) => paintStrip(g, c, 500 + i, wide));
    const cn = layer('c08strip-n' + i, narrow, STRIP_H, (g, c) => paintStrip(g, c, 700 + i, narrow));
    STRIPS.wide.push(cw); STRIPS.narrow.push(cn);
    pending(toImg(cw).then((im) => { STRIPS.wide[i] = im; })); pending(toImg(cn).then((im) => { STRIPS.narrow[i] = im; }));
  }
}
const STARS = once('c08stars', () => { const r = prng(909); return Array.from({ length: 14 }, () => [r(), r(), .4 + r() * .6, r() * TAU]); });

// ---------------------------------------------------------------- the well itself
//   wellDraw(g, w, h, t, { S (camera: level scale multiplier, 1 = the mouth at the pane), a (light 0..1), accent: { k, edge: 'top'|'bottom', warm: 0..1, glint: 0..1 } })
//   drawn with origin at the pane's top-left in pane units (w × h), like a pane() screen callback. Returns the screen-space-agnostic level list
//   [{ k, s, a, b }] in reference units (centre origin) for labels.
export function wellDraw(g, w, h, t, o = {}) {
  const S = o.S ?? 1, a0 = o.a ?? 1, k0 = w / REF.w, fade = clamp(o.fade ?? 1);   // fade: the whole well over the pane's own haze (its first frames)
  if (fade <= 0) return [];
  g.save(); g.translate(w / 2, h / 2); g.scale(k0, k0); g.globalAlpha = fade;
  const hw = REF.w / 2, hh = REF.h / 2;
  // the levels we can see: scale from ~2.4 (just outside the frame) down to .018
  const levels = [];
  for (let k = -6; k < 60; k++) { const s = S * Math.pow(RATIO, k); if (s > 2.4) continue; if (s < .018) break; levels.push({ k, s, a: s * hw, b: s * hh }); }
  if (!levels.length) { g.restore(); return []; }
  // the wall beyond the nearest level (fills the pane), then far → near
  g.fillStyle = mixHex('#0b1030', '#07091c', .3); g.fillRect(-hw * 3, -hh * 3, hw * 6, hh * 6);
  const far = levels[levels.length - 1];
  // the sky at the far end, its light spilling up the shaft
  { const sa = far.a, sb = far.b; g.save(); g.globalCompositeOperation = 'lighter'; const gl = g.createRadialGradient(0, 0, 0, 0, 0, Math.max(sa, sb) * 7); gl.addColorStop(0, rgba('#6f86c4', .55 * a0)); gl.addColorStop(.35, rgba('#3a4a86', .22 * a0)); gl.addColorStop(1, rgba('#3a4a86', 0)); g.fillStyle = gl; g.fillRect(-sa * 8, -sb * 8, sa * 16, sb * 16); g.restore(); }
  for (let i = levels.length - 1; i >= 0; i--) {
    const L = levels[i], nx = levels[i + 1], depth = clamp(1 - L.s / 1.6);   // depth 0 near … 1 far
    const a = L.a, b = L.b, a2 = nx ? nx.a : a * RATIO, b2 = nx ? nx.b : b * RATIO;
    // the four walls between this level and the next: dark indigo, darker toward the far end, a little lighter on the lit (top) side
    const wallCol = (side) => mixHex(mixHex('#182250', '#0b1030', depth * .9), '#05070f', side === 'bottom' ? .35 : side === 'top' ? .0 : .18);
    const quads = { top: [[-a, -b], [a, -b], [a2, -b2], [-a2, -b2]], bottom: [[-a, b], [a, b], [a2, b2], [-a2, b2]], left: [[-a, -b], [-a2, -b2], [-a2, b2], [-a, b]], right: [[a, -b], [a2, -b2], [a2, b2], [a, b]] };
    for (const side of ['top', 'bottom', 'left', 'right']) { const q = quads[side]; g.fillStyle = wallCol(side); g.beginPath(); q.forEach(([x, y], j) => (j ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); }
    // the shelf boards: a thin lit edge along this level's rectangle (the near edge of the band)
    g.strokeStyle = rgba('#8fa4d8', (.42 - .3 * depth) * a0); g.lineWidth = Math.max(.35, .9 * L.s); g.strokeRect(-a, -b, 2 * a, 2 * b);
    // the words on the four shelves (the strips sit just inside the edge)
    const sh = BAND * b, wideI = STRIPS.wide[(((L.k * 3 + 100) % 8) + 8) % 8], narI = STRIPS.narrow[(((L.k * 5 + 101) % 8) + 8) % 8];
    if (!wideI || !narI) continue;
    const al = a0 * (1 - .55 * depth);
    g.globalAlpha = al * fade;
    g.drawImage(wideI, -a + sh * .4, -b + sh * .25, 2 * a - sh * .8, sh);                          // top shelf
    g.save(); g.scale(1, -1); g.drawImage(wideI, -a + sh * .4, -b + sh * .25, 2 * a - sh * .8, sh); g.restore();   // bottom shelf (mirrored up: the words stand on it)
    g.save(); g.rotate(Math.PI / 2); g.drawImage(narI, -b + sh * .4, -a + sh * .25, 2 * b - sh * .8, sh); g.restore();      // right wall (rotated)
    g.save(); g.rotate(-Math.PI / 2); g.drawImage(narI, -b + sh * .4, -a + sh * .25, 2 * b - sh * .8, sh); g.restore();     // left wall
    g.globalAlpha = fade;
    // the accents: a lullaby line glows warm, a threat line glints cold
    if (o.accent) for (const A of o.accent) {
      if (A.k !== L.k || A.v <= 0) continue;
      const yEdge = A.edge === 'top' ? -b : b, y0 = A.edge === 'top' ? -b + sh * .25 : b - sh * 1.25;
      g.save(); g.globalCompositeOperation = 'lighter';
      if (A.kind === 'warm') {
        const wg = g.createLinearGradient(0, yEdge - sh * 1.6, 0, yEdge + sh * 1.6); wg.addColorStop(0, rgba(F6.amber, 0)); wg.addColorStop(.5, rgba(F6.amber, .38 * A.v)); wg.addColorStop(1, rgba(F6.amber, 0));
        g.fillStyle = wg; g.fillRect(-a - sh, yEdge - sh * 1.6, 2 * a + 2 * sh, sh * 3.2);
        g.globalAlpha = .9 * A.v * fade; if (A.edge === 'top') g.drawImage(wideI, -a + sh * .4, y0, 2 * a - sh * .8, sh); else { g.save(); g.scale(1, -1); g.drawImage(wideI, -a + sh * .4, -b + sh * .25, 2 * a - sh * .8, sh); g.restore(); }
      } else {
        // a cold glint runs along the line once, sharp and fast; the line itself brightens a little
        const gx = -a + (2 * a + sh * 2) * A.v - sh, gw = sh * 2.2;
        const cg = g.createLinearGradient(gx - gw, 0, gx + gw, 0); cg.addColorStop(0, rgba(F6.coolCore, 0)); cg.addColorStop(.5, rgba(F6.coolCore, .85)); cg.addColorStop(1, rgba(F6.coolCore, 0));
        g.fillStyle = cg; g.fillRect(gx - gw, y0 - sh * .15, gw * 2, sh * 1.3);
        g.globalAlpha = .5 * Math.sin(Math.PI * A.v) * fade; if (A.edge === 'top') g.drawImage(wideI, -a + sh * .4, y0, 2 * a - sh * .8, sh); else { g.save(); g.scale(1, -1); g.drawImage(wideI, -a + sh * .4, -b + sh * .25, 2 * a - sh * .8, sh); g.restore(); }
      }
      g.restore();
    }
  }
  // the far end: the night sky in the small opening (drawn last: it is in front of nothing, the walls end there)
  { const sa = far.a * RATIO, sb = far.b * RATIO; const sg = g.createLinearGradient(0, -sb, 0, sb); sg.addColorStop(0, '#3a4e8c'); sg.addColorStop(1, '#1a2450'); g.fillStyle = sg; g.fillRect(-sa, -sb, 2 * sa, 2 * sb);
    g.fillStyle = 'rgba(243,239,226,.9)'; for (const [sx, sy, ss, ph] of STARS) { const tw = .5 + .5 * Math.sin(t * 1.3 + ph); g.globalAlpha = tw * fade; g.beginPath(); g.arc(-sa + sx * 2 * sa, -sb + sy * 2 * sb, ss * sa * .06, 0, TAU); g.fill(); } g.globalAlpha = fade; }
  g.restore();
  return levels;
}
// the strip's label position (reference units, centre origin) for a level and edge: the left end of the shelf, outside the strip
export function wellLevelRect(S, k) { const s = S * Math.pow(RATIO, k); return { s, a: s * REF.w / 2, b: s * REF.h / 2 }; }
export const wellS = (c) => Math.pow(RATIO, -c);        // c = levels passed by the camera → S
