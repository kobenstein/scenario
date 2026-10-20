// c11 (Film 4 v2) · your business card on the long table and its back.
//   front: cream card, engraved double rule + a small rosette, your name as an illegible pen line, the readable job title
//          (SENIOR ACCOUNT MANAGER) — on "title" its letters lift off the paper as dotted smoke, only the name stays.
//   back:  an engraved vignette (card units: millimetres): you at a workbench building a small wooden boat, a hanging lamp
//          (hand-coloured amber), and a big workshop window whose night IS the night over the Maslow hill (drawn by maslow4 inside the
//          window, in screen space): the camera pushes into that window until the hill fills the frame (H3).
//   drawCard(ctx, t, C, A, o)   the card as a 3D object for camera C (front or back, whichever faces the camera), in its brass holder
//   cardWindowRect(C)           the window's quad on screen (for the push-in) and its centre in world space
import { W, H, rgba, clamp, mix, lin, sm, prng, TAU, eoX, eiX, qio, u01, putGlow, mixHex, shadeHex, hash, once, canvas, text } from './v2_c11_kit.mjs';
import { person } from './v2_c11_people.mjs';
import { drawHill } from './maslow4.mjs';
import { CARD } from './v2_c11_table.mjs';

const INKC = '#2a2346', PAPER = '#f1e8d2';
const HW = CARD.w * 500, HH = CARD.h * 500;                     // half size in mm (42.5 × 27.5)
// card axes in world space: u = across (seen from the front, +u is screen right = -Z), v = down the face (leans back by tilt)
const ct = Math.cos(CARD.tilt), st = Math.sin(CARD.tilt);
const UAX = [0, 0, -1], VAX = [st, -ct, 0], NRM = [ct, st, 0];
export const cardPt = (u, v) => [CARD.x + (u * UAX[0] + v * VAX[0]) / 1000, CARD.y + (u * UAX[1] + v * VAX[1]) / 1000, CARD.z + (u * UAX[2] + v * VAX[2]) / 1000];
// the window in the vignette (back side, mm in BACK coordinates: u_b = -u)
export const WIN = { x0: -14, x1: 20, y0: -21, y1: 2 };
const backPt = (ub, v) => cardPt(-ub, v);
export const WIN_C3 = backPt((WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2);   // world centre of the window (aim point of the push)

// affine screen transform for card mm coordinates (centre Jacobian), front or back
function affine(C, back) {
  const s = back ? -1 : 1, P0 = C.P(...cardPt(0, 0)), Pu = C.P(...cardPt(s, 0)), Pv = C.P(...cardPt(0, 1));
  return [Pu[0] - P0[0], Pu[1] - P0[1], Pv[0] - P0[0], Pv[1] - P0[1], P0[0], P0[1], P0[2]];
}
export function facing(C) { const o = C.o, d = [o.x - CARD.x, o.y - CARD.y, o.z - CARD.z]; return d[0] * NRM[0] + d[1] * NRM[1] + d[2] * NRM[2] >= 0 ? 'front' : 'back'; }

// ---------------------------------------------------------------- the front
const TITLE = 'SENIOR ACCOUNT MANAGER', TITLE_MM = 3.2, TITLE_Y = 7.5, TITLE_SP = .55;
function nameLine(g) {   // an illegible signature-like pen line (deterministic), in mm
  const r = prng(611); g.beginPath(); let x = -27, y = -6.5; g.moveTo(x, y);
  for (let i = 0; i < 26; i++) { const nx = x + 1.6 + r() * 1.3, up = (i % 3 === 0 ? -4.2 : -1.8) * (.6 + r() * .6), dn = 1.2 + r(); g.bezierCurveTo(x + .5, y + up, nx - .8, y + up * .8, nx - .2, y + dn * .3); x = nx; y = -6.5 + (r() - .5) * .8; g.quadraticCurveTo(x + .3, y + dn, x + .7, y); }
  g.stroke();
}
function frontStatic(g) {   // in mm, origin at the card centre
  g.strokeStyle = rgba(INKC, .8); g.lineWidth = .22; g.strokeRect(-HW + 2.4, -HH + 2.4, HW * 2 - 4.8, HH * 2 - 4.8);
  g.lineWidth = .1; g.strokeRect(-HW + 3.1, -HH + 3.1, HW * 2 - 6.2, HH * 2 - 6.2);
  // a small rosette top left (guilloche of the Film 5 language)
  g.save(); g.translate(-33, -16.5); g.strokeStyle = rgba(INKC, .55); g.lineWidth = .08;
  for (let k = 0; k < 14; k++) { g.beginPath(); for (let i = 0; i <= 160; i++) { const a = i / 160 * TAU, rr = 3.4 + .7 * Math.sin(9 * a + k * .45) + .3 * Math.sin(4 * a - k); i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.stroke(); }
  g.restore();
  // the name (an illegible pen line, ink) and its rule
  g.strokeStyle = rgba('#1b2246', .92); g.lineWidth = .42; g.lineCap = 'round'; g.lineJoin = 'round'; nameLine(g);
  g.strokeStyle = rgba(INKC, .5); g.lineWidth = .12; g.beginPath(); g.moveTo(-27, .5); g.lineTo(30, .5); g.stroke();
  // contact lines: tiny, unreadable (dots and dashes)
  g.fillStyle = rgba(INKC, .45); const r = prng(17);
  for (const yy of [15.5, 18.4]) { let x = -27; while (x < 8 + r() * 10) { const w = .4 + r() * 1.6; g.fillRect(x, yy, w, .55); x += w + .45; } }
}
// title glyph dots (mm), sampled once from a raster of the title; each dot knows its letter
const TDOTS = (() => {
  const S = 24, w = 70 * S, h = 6 * S, [c, g] = canvas(w, h);
  g.fillStyle = '#000'; g.font = `600 ${TITLE_MM * S * 1.37}px Inter`; g.textBaseline = 'alphabetic'; try { g.letterSpacing = TITLE_SP * S + 'px'; } catch { }
  const tw = g.measureText(TITLE).width; g.fillText(TITLE, 0, h * .78);
  // letter boundaries (x of each glyph start)
  const xs = []; let acc = ''; for (const ch of TITLE) { xs.push(g.measureText(acc).width); acc += ch; } xs.push(tw);
  const d = g.getImageData(0, 0, w, h).data, out = [], step = 3, r = prng(23);
  for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (d[(y * w + x) * 4 + 3] > 120) {
    let li = 0; while (li < TITLE.length - 1 && x >= xs[li + 1]) li++;
    out.push([x / S, y / S - h * .78 / S, li, r(), r(), r()]);
  }
  return { dots: out, width: tw / S };
})();
function titleText(g, a = 1) {
  g.save(); g.fillStyle = rgba('#232a4a', a); g.font = `600 ${TITLE_MM * 1.37}px Inter`; try { g.letterSpacing = TITLE_SP + 'px'; } catch { } g.textBaseline = 'alphabetic';
  g.fillText(TITLE, -TDOTS.width / 2 + 1.5, TITLE_Y); g.restore();
}
// the title smoke: letters left→right lift, thin into dots, rise and drift as smoke (u per letter)
function titleSmoke(g, t, t0) {
  const x0 = -TDOTS.width / 2 + 1.5;
  for (const [x, y, li, r1, r2, r3] of TDOTS.dots) {
    const u = clamp((t - t0 - li * .026) / .75); if (u <= 0) continue;
    if (r1 < u * .9) { if (u > .7 + .3 * r2) continue; }
    const rise = eiX(clamp(u * 1.2)) * (6 + 10 * r2) + u * 2, sw = Math.sin((t - t0) * 3.2 + r3 * 9 + y) * u * (1.2 + 2.2 * r1);
    const a = (1 - sm(u)) * (u < .12 ? 1 : .85), s = mix(.13, .07 + .1 * r3, sm(u));
    g.fillStyle = rgba('#232a4a', a); g.fillRect(x0 + x + sw - s / 2, TITLE_Y + y - rise - s / 2, s, s);
  }
}
// ---------------------------------------------------------------- the back: the workshop vignette (mm, BACK coordinates)
function hatchRect(g, x0, y0, x1, y1, gap, ang, a, lw = .07) {
  g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip(); g.strokeStyle = rgba(INKC, a); g.lineWidth = lw; g.beginPath();
  const dx = Math.cos(ang), dy = Math.sin(ang), L = (x1 - x0) + (y1 - y0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  for (let k = -L; k <= L; k += gap) { g.moveTo(cx + k * -dy - dx * L, cy + k * dx - dy * L); g.lineTo(cx + k * -dy + dx * L, cy + k * dx + dy * L); }
  g.stroke(); g.restore();
}
function vignette(g, t, o) {
  const IX0 = -HW + 3.8, IY0 = -HH + 3.8, IX1 = HW - 3.8, IY1 = HH - 3.8;
  g.save(); g.beginPath(); g.roundRect(IX0, IY0, IX1 - IX0, IY1 - IY0, 1.6); g.clip();
  // back wall: warm plaster, engraved horizontal tone that darkens toward the corners
  g.fillStyle = '#e6dbc2'; g.fillRect(IX0, IY0, IX1 - IX0, IY1 - IY0);
  hatchRect(g, IX0, IY0, IX1, IY1, .55, 0, .22);
  hatchRect(g, IX0, IY0, -18, IY1, .5, -.9, .12); hatchRect(g, 26, IY0, IX1, IY1, .5, .9, .14);
  // window: frame, sill, the pane is cut out (o.pane draws the night behind it, in screen space, before this)
  g.fillStyle = '#5a4632'; g.fillRect(WIN.x0 - 1.4, WIN.y0 - 1.4, WIN.x1 - WIN.x0 + 2.8, WIN.y1 - WIN.y0 + 2.8);
  g.fillStyle = '#7a6040'; g.fillRect(WIN.x0 - 2.2, WIN.y1 + .9, WIN.x1 - WIN.x0 + 4.4, 1.1);
  g.strokeStyle = rgba(INKC, .7); g.lineWidth = .12; g.strokeRect(WIN.x0 - 1.4, WIN.y0 - 1.4, WIN.x1 - WIN.x0 + 2.8, WIN.y1 - WIN.y0 + 2.8);
  g.restore();
  // the pane (screen-space night) is drawn by the caller between the wall and the rest
}
function vignetteFront(g, t, o) {   // everything in front of the window pane
  const IX0 = -HW + 3.8, IY0 = -HH + 3.8, IX1 = HW - 3.8, IY1 = HH - 3.8;
  g.save(); g.beginPath(); g.roundRect(IX0, IY0, IX1 - IX0, IY1 - IY0, 1.6); g.clip();
  // window frame inner edge + a thin glazing bar near the bottom (does not block the view)
  g.strokeStyle = '#3a2c20'; g.lineWidth = .5; g.strokeRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
  // tool rack on the left wall: a board, a saw, a plane, chisels
  g.fillStyle = '#8a6a48'; g.fillRect(-38.2, -17.5, 14, 1.2); g.strokeStyle = rgba(INKC, .75); g.lineWidth = .1; g.strokeRect(-38.2, -17.5, 14, 1.2);
  g.fillStyle = '#c9c2b4'; g.beginPath(); g.moveTo(-37, -16); g.lineTo(-30.5, -16); g.lineTo(-31.5, -8.5); g.lineTo(-37, -9.5); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); for (let i = 0; i < 14; i++) { const x = -37 + i * .42; g.moveTo(x, -9.4 + i * .07); g.lineTo(x + .2, -9 + i * .07); } g.stroke();
  g.fillStyle = '#6a4a2e'; g.beginPath(); g.ellipse(-30.7, -15.4, 1.3, 1.1, 0, 0, TAU); g.fill();
  for (let i = 0; i < 4; i++) { const x = -28.6 + i * 1.1; g.fillStyle = '#7a5a3a'; g.fillRect(x, -16.2, .5, 3); g.fillStyle = '#b8b4ac'; g.fillRect(x + .1, -13.2, .3, 2.4); }
  // the lamp: cord, shade, warm light (hand-coloured)
  const sw = Math.sin(t * 1.3) * .5, lx = -20 + sw, ly = -15.5;
  g.strokeStyle = rgba(INKC, .8); g.lineWidth = .12; g.beginPath(); g.moveTo(-20, IY0); g.lineTo(lx, ly - 2.6); g.stroke();
  g.fillStyle = '#2f3a3a'; g.beginPath(); g.moveTo(lx - 1, ly - 2.8); g.lineTo(lx + 1, ly - 2.8); g.lineTo(lx + 3.6, ly); g.lineTo(lx - 3.6, ly); g.closePath(); g.fill();
  // the bench: top, apron, legs, a vice at the left end, wood grain
  g.fillStyle = '#b08a5c'; g.fillRect(-40, 8, 80, 1.7); g.fillStyle = '#8a6844'; g.fillRect(-40, 9.7, 80, 2.6);
  g.fillStyle = '#6a4e32'; for (const x of [-36, 24]) g.fillRect(x, 12.3, 2.2, 20);
  g.strokeStyle = rgba(INKC, .6); g.lineWidth = .08; g.beginPath(); for (let i = 0; i < 9; i++) { const y = 10 + i * .26; g.moveTo(-40, y); g.bezierCurveTo(-20, y + .3, 0, y - .3, 40, y + .1); } g.stroke();
  g.strokeStyle = rgba(INKC, .75); g.lineWidth = .12; g.strokeRect(-40, 8, 80, 4.3);
  g.fillStyle = '#5a5a5a'; g.fillRect(-39, 5.6, 3.4, 2.4); g.fillRect(-38.4, 9.7, 1.2, 3.6);
  // the boat on two cradles: a planked hull (side view), its little mast lying beside it
  g.fillStyle = '#6a4e32'; g.fillRect(-1.5, 6.3, 1.4, 1.7); g.fillRect(10.5, 6.3, 1.4, 1.7);
  g.fillStyle = '#c79a62'; g.beginPath(); g.moveTo(-6.5, 1.8); g.quadraticCurveTo(5, 3.2, 17.5, .6); g.quadraticCurveTo(15.5, 4.8, 11, 6.6); g.quadraticCurveTo(3, 7.6, -4.2, 6.6); g.quadraticCurveTo(-6.4, 5, -6.5, 1.8); g.closePath(); g.fill();
  g.strokeStyle = rgba('#3a2412', .7); g.lineWidth = .1; g.stroke();
  g.beginPath(); for (let i = 1; i < 4; i++) { const q = i / 4; g.moveTo(-6.3 + q * 1.3, mix(1.8, 6.4, q)); g.quadraticCurveTo(5, mix(3.2, 7.4, q), mix(17.5, 11.5, q), mix(.6, 6.4, q)); } g.stroke();
  hatchRect(g, -6, 4.6, 16, 7.2, .32, -.25, .2, .06);
  g.strokeStyle = '#7a5434'; g.lineWidth = .35; g.beginPath(); g.moveTo(19, 7.6); g.lineTo(31, 6.6); g.stroke();
  // shavings on the bench
  g.strokeStyle = rgba('#d8b07a', .9); g.lineWidth = .14; for (let i = 0; i < 5; i++) { const x = -10 + i * 2.3, y = 7.6; g.beginPath(); g.arc(x, y - .5, .5 + .1 * i, 0, 5); g.stroke(); }
  g.restore();
}
// you at the bench (in front of everything, a hand-coloured engraving: muted ink tones + the ochre scarf), a plane stroking the gunwale
function vignetteYou(g, t, o) {
  const stroke = Math.sin(t * 2.4) * .5 + .5;   // the plane goes along the gunwale and back
  const s = 22 / 1000 * 1.75 / 188 * 1000 / 1.75 * 1.0;   // figure units → mm (1.75 m = 38.5 mm)
  const fs = 38.5 / 188;
  const target = [mix(-4, 6, stroke), 2.4];
  const pose = { lean: .62, head: .28, sh: [1.2, 1.0], el: [.25, .35], hip: [.1, -.06], kn: [.1, .05], hair: 'short', hands: ['closed', 'closed'] };
  g.save();
  person(g, -17.5 + stroke * .8, 9.4, fs, pose, { t, seed: 3, dress: { coat: '#39405e', pants: '#2a2840', shoes: '#1a1824', skin: '#b98262', hair: '#1c1418', scarf: '#c8843a' }, rim: '#ffcf8a', rimW: .35, shadow: false,
    light: { x: -20, y: -15, col: '#ffcf8a', a: .55 },
    prop: (gg, fa) => { gg.save(); gg.translate(fa.hx, fa.hy); gg.fillStyle = '#8a6440'; gg.fillRect(-2, -1.2, 9, 3.2); gg.fillStyle = '#5a5a60'; gg.fillRect(1.5, -2.6, 2.4, 1.6); gg.restore(); } });
  g.restore();
  // the ochre scarf is part of the dress via pose? (person() draws P.scarf when set) — drawn by the figure when pose.scarf
}
// ---------------------------------------------------------------- the card in 3D
export function drawCard(ctx, t, C, A, o = {}) {
  const side = facing(C);
  const corners = [cardPt(-HW, -HH), cardPt(HW, -HH), cardPt(HW, HH), cardPt(-HW, HH)];
  const S = C.S(corners); if (!S) return;
  let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9; for (const [x, y] of S) { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); }
  if (bx1 < -50 || bx0 > W + 50 || by1 < -50 || by0 > H + 50) return;
  // the brass holder (a small foot with a slot) under the card
  holder(ctx, C);
  // paper (exact perspective quad), warm light from the lantern above
  ctx.save(); ctx.beginPath(); S.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
  const g0 = ctx.createLinearGradient(0, by0, 0, by1); g0.addColorStop(0, side === 'front' ? '#f6efdc' : '#efe6cf'); g0.addColorStop(1, side === 'front' ? '#e2d6b8' : '#d9cdb0');
  ctx.fillStyle = g0; ctx.fill(); ctx.clip();
  const [a, b, c, d, e, f, z] = affine(C, side === 'back'), px = Math.hypot(a, b);   // px per mm
  if (px > .4) {
    ctx.setTransform(a, b, c, d, e, f);
    if (side === 'front') {
      if (px > 1.2) frontStatic(ctx); else { ctx.fillStyle = rgba(INKC, .3); ctx.fillRect(-27, -9, 50, 3); }
      const t0 = A.title - .02;
      if (t < t0) titleText(ctx, 1); else if (px > 1.2) titleSmoke(ctx, t, t0);
    } else {
      vignette(ctx, t, o);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (o.pane) o.pane(ctx, t, C);
      ctx.setTransform(a, b, c, d, e, f);
      vignetteFront(ctx, t, o);
      vignetteYou(ctx, t, o);
      // the vignette's border rules
      ctx.strokeStyle = rgba(INKC, .8); ctx.lineWidth = .22; ctx.strokeRect(-HW + 2.4, -HH + 2.4, HW * 2 - 4.8, HH * 2 - 4.8);
      ctx.lineWidth = .14; ctx.beginPath(); ctx.roundRect(-HW + 3.8, -HH + 3.8, HW * 2 - 7.6, HH * 2 - 7.6, 1.6); ctx.stroke();
    }
  }
  ctx.restore();
  // a soft warm sheen moving over the paper (lantern light), and the paper edge
  ctx.save(); ctx.strokeStyle = 'rgba(120,96,64,.5)'; ctx.lineWidth = 1; ctx.beginPath(); S.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke(); ctx.restore();
}
function holder(ctx, C) {
  const y0 = .76, pts = []; for (let i = 0; i < 14; i++) { const q = i / 14 * TAU; pts.push([CARD.x + Math.cos(q) * .018, y0 + .002, CARD.z + Math.sin(q) * .026]); }
  const S = C.S(pts); if (!S) return; ctx.fillStyle = '#7a5a2a'; ctx.beginPath(); S.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c8a050'; const S2 = C.S([[CARD.x + .006, y0 + .012, CARD.z - .02], [CARD.x - .006, y0 + .012, CARD.z - .02], [CARD.x - .006, y0 + .012, CARD.z + .02], [CARD.x + .006, y0 + .012, CARD.z + .02]]);
  if (S2) { ctx.beginPath(); S2.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); }
}
// the window pane's quad on screen (back side), for the hill inside and for the push
export function windowQuad(C) { return C.S([backPt(WIN.x0, WIN.y0), backPt(WIN.x1, WIN.y0), backPt(WIN.x1, WIN.y1), backPt(WIN.x0, WIN.y1)]); }
// the night through the window: the Maslow hill (H3 view when the window fills the frame), clipped to the pane
export function paneHill(H3, st) {
  return (ctx, t, C) => {
    const Q = windowQuad(C); if (!Q) return;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of Q) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    if (x1 < 0 || x0 > W || y1 < 0 || y0 > H) return;
    const ww = x1 - x0, wx = (x0 + x1) / 2, wy = (y0 + y1) / 2, f = Math.pow(Math.min(1, ww / W), .85), z = H3.z * f;
    const cam = { x: H3.x - (wx - W / 2) / z, y: H3.y - (wy - H / 2) / z, z };
    ctx.save(); ctx.beginPath(); Q.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip();
    drawHill(ctx, t, cam, st);
    ctx.restore();
  };
}
