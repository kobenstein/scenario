// Film 7 · c08 · THE ANSWER SIDE of the four cards + the table flip. Builder: c08. (c09–c11: copy this file, as c08 copied the table.)
// Pure functions of t, deterministic. Uses c08's 1:1 copy of the c04 table (lib/f7_c08_table.mjs).
//
// THE BACK (answer side), face px 500 × 700, same paper / deckle family as the kit back (seed 300 + num·17 + 5):
//   top band exactly like the front: the numeral top left and the framed PAPER WINDOW at WIN (so windowCam(ROW[i]) also lands exactly
//   on the paper plate when the card lies BACK UP: c08 leaves card II back up and pushes into its window → c08>c09 paper plate);
//   below the rule an engraved picture in BOX (16:9, 360 × 202.5 face px), the answer word (Inter caps, as the kit), the rule lines
//   (card I only, printed in c08), and "ANSWER I" at the foot (the front says "QUESTION I").
//   Card IV's picture and word are covered by a pinned paper slip with "?" (the number, revealed in c11).
//
//   ANSWERS[i] = { num, word, img(g, t) (draws in 1920×1080 picture px; BOX scales it), slip }
//   backFace(g, t, o)            the whole back in face px (vector). o: { num, plateT, img, word, slip, rule: [u1, u2] (print reveal) }
//   backPrepare(list, t) async   cache backs as Images ([{ num, img, word, slip }], t = time used for the window plate and the picture)
//   backCard(ctx, t, A, o)       the back under face affine A: cached image when small, vector when big (o.vectorAt 1.05, o.forceVector)
//   turnCard(ctx, t, cam, o)     a card on the table turning over in 3D: o = { X, Z, rot, phi 0..π (0 front up, π back up), hop (cm),
//                                bend (cm, paper flutter), front: { num, q, stamp }, back: { num, … as backCard }, plateT }
//                                rotation about the card's long axis through its centre, centre lifted so the low edge never enters the table.
//   faceCam(card, rect)          the top-down camera at which a face px rect (16:9) of a flat card fills the frame exactly (windowCam generalised).
//   boxM(A)                      picture px → screen affine for the BOX under face affine A.
//   RULE                         the two printed lines of the rule (card I).
import { loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, prng, canvas, text } from '../engine.mjs';
import { F7, ease } from './f7_kit.mjs';
import { TB, FACE, WIN, CARDS, paperPlateAt, tablePaperCard, meshImage, shadowQuad, depthSpread, cardFaceM, apply, mulA, paperCardImage } from './f7_c08_table.mjs';

const TAU = Math.PI * 2;
const ROMAN = ['', 'I', 'II', 'III', 'IV'];
export const BOX = { x: 70, y: 204, w: 360, h: 202.5 };
export const RULE = ['Pay for your own clean power.', 'Make room when the city needs it.'];

function deckle(g, w, h, seed) {   // = kit deckle (same seed → same outline)
  const r = prng(seed), pts = [], step = 10;
  const edge = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(L / step); for (let i = 0; i < n; i++) { const q = i / n, j = (r() - .5) * 2.2; pts.push([mix(x0, x1, q) + (y1 - y0) / L * j, mix(y0, y1, q) - (x1 - x0) / L * j]); } };
  const c = 14; edge(c, 0, w - c, 0); pts.push([w - c * .3, c * .3]); edge(w, c, w, h - c); pts.push([w - c * .3, h - c * .3]); edge(w - c, h, c, h); pts.push([c * .3, h - c * .3]); edge(0, h - c, 0, c); pts.push([c * .3, c * .3]);
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
}
const PW = [1 / 9, 0, 0, 1 / 9, WIN.x, WIN.y];
// fibres are fixed per card: built once as segment lists (cheap to stroke, no prng per frame)
const FIBS = new Map();
function fibres(seed) {
  if (FIBS.has(seed)) return FIBS.get(seed);
  const r = prng(seed), dark = [], light = [];
  for (let i = 0; i < 900; i++) { const x = r() * FACE.w, y = r() * FACE.h, L = 4 + r() * 18, a0 = r() * TAU, d = r() < .5, al = d ? .05 + .07 * r() : .15 + .2 * r(), lw = .6 + r() * .6;
    if (x > WIN.x - 2 && x < WIN.x + WIN.w + 2 && y > WIN.y - 2 && y < WIN.y + WIN.h + 2) continue;
    if (x > BOX.x && x < BOX.x + BOX.w && y > BOX.y && y < BOX.y + BOX.h) continue;
    (d ? dark : light).push([x, y, x + Math.cos(a0) * L, y + Math.sin(a0) * L, al, lw]); }
  const o = { dark, light }; FIBS.set(seed, o); return o;
}
function backPaper(g, t, seed) {
  const w = FACE.w, h = FACE.h;
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f6f0e0'); gr.addColorStop(1, '#e6dbc2'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  const F = fibres(seed); g.lineCap = 'round';
  for (const [arr, col] of [[F.dark, '120,95,60'], [F.light, '255,252,240']]) for (const [x0, y0, x1, y1, al, lw] of arr) { g.strokeStyle = `rgba(${col},${al})`; g.lineWidth = lw; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  const v = g.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, h * .75); v.addColorStop(0, 'rgba(120,90,50,0)'); v.addColorStop(1, 'rgba(120,90,50,.16)'); g.fillStyle = v; g.fillRect(0, 0, w, h);
  // the window: the paper plate at 1/9 (exactly as on the front)
  g.save(); g.beginPath(); g.rect(WIN.x, WIN.y, WIN.w, WIN.h); g.clip(); paperPlateAt(g, t, PW); g.restore();
  g.strokeStyle = rgba(F7.ink, .28); g.lineWidth = .8; g.strokeRect(WIN.x - 4, WIN.y - 4, WIN.w + 8, WIN.h + 8);
}
export function backFace(g, t, o) {
  const w = FACE.w, h = FACE.h, num = o.num || 1, seed = 300 + num * 17 + 5, ink = F7.ink, pt = o.plateT ?? t;
  g.save(); deckle(g, w, h, seed); g.clip();
  backPaper(g, pt, seed);
  g.strokeStyle = rgba(ink, .85); g.lineWidth = 3; g.strokeRect(34, 34, w - 68, h - 68); g.lineWidth = 1.2; g.strokeRect(46, 46, w - 92, h - 92);
  text(g, ROMAN[num], 74, 150, { size: 92, font: 'Instrument Serif', color: ink });
  g.strokeStyle = rgba(ink, .5); g.lineWidth = 1.2; g.beginPath(); g.moveTo(74, 182); g.lineTo(w - 74, 182); g.stroke();
  // the engraved picture
  g.save(); g.beginPath(); g.rect(BOX.x, BOX.y, BOX.w, BOX.h); g.clip(); g.fillStyle = '#efe6cf'; g.fillRect(BOX.x, BOX.y, BOX.w, BOX.h);
  if (o.img) { g.translate(BOX.x, BOX.y); g.scale(BOX.w / W, BOX.w / W); o.img(g, o.imgT ?? t); }
  g.restore();
  g.strokeStyle = rgba(ink, .75); g.lineWidth = 1.6; g.strokeRect(BOX.x, BOX.y, BOX.w, BOX.h);
  g.strokeStyle = rgba(ink, .35); g.lineWidth = .8; g.strokeRect(BOX.x - 6, BOX.y - 6, BOX.w + 12, BOX.h + 12);
  // the word, flanked by two small engraved rules
  if (o.word) {
    text(g, o.word.toUpperCase(), w / 2, 478, { size: 44, weight: 600, color: ink, align: 'center', spacing: 8 });
    g.font = '600 44px "Inter"'; try { g.letterSpacing = '8px'; } catch { } const ww = g.measureText(o.word.toUpperCase()).width; try { g.letterSpacing = '0px'; } catch { }
    g.strokeStyle = rgba(ink, .45); g.lineWidth = 1; g.beginPath(); g.moveTo(74, 463); g.lineTo(w / 2 - ww / 2 - 18, 463); g.moveTo(w / 2 + ww / 2 + 10, 463); g.lineTo(w - 74, 463); g.stroke();
  }
  // the rule (card I): two lines printed word by word (mask reveal)
  if (o.rule) RULE.forEach((ln, i) => { const u = o.rule[i] ?? 0; if (u <= 0) return;
    g.save(); g.font = '31px "Instrument Serif"'; const lw = g.measureText(ln).width; g.beginPath(); g.rect(w / 2 - lw / 2 - 4, 494 + i * 41, (lw + 8) * ease.out(u), 48); g.clip();
    text(g, ln, w / 2, 527 + i * 41, { size: 31, font: 'Instrument Serif', color: rgba(ink, .92), align: 'center' }); g.restore(); });
  // foot: ticks and ANSWER I
  g.strokeStyle = rgba(ink, .32); g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 64; i++) { const x = 64 + (w - 128) * i / 63; g.moveTo(x, h - 58 - 6 * Math.sin(i * .9)); g.lineTo(x + 6, h - 70); } g.stroke();
  text(g, `ANSWER ${ROMAN[num]}`, w / 2, h - 84, { size: 20, weight: 600, color: rgba(ink, .7), align: 'center', spacing: 6 });
  if (o.slip) slipOn(g, t);
  g.restore();
}
// the slip over card IV's picture: a torn cream note, pinned with a strip of tape, a big inked "?"
function slipOn(g, t) {
  g.save(); g.translate(250, 362); g.rotate(-.045);
  const r = prng(4040), pts = [], sw = 340, sh = 272;
  for (let i = 0; i <= 24; i++) pts.push([-sw / 2 + sw * i / 24, -sh / 2 + (r() - .5) * 2]);
  for (let i = 1; i <= 10; i++) pts.push([sw / 2 + (r() - .5) * 2.4, -sh / 2 + sh * i / 10]);
  for (let i = 1; i <= 24; i++) pts.push([sw / 2 - sw * i / 24, sh / 2 + (r() - .5) * 7]);   // the torn edge at the bottom
  for (let i = 1; i < 10; i++) pts.push([-sw / 2 + (r() - .5) * 2.4, sh / 2 - sh * i / 10]);
  g.fillStyle = 'rgba(30,20,10,.22)'; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x + 5, y + 7) : g.moveTo(x + 5, y + 7))); g.closePath(); g.fill();
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
  const gr = g.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2); gr.addColorStop(0, '#fbf5e6'); gr.addColorStop(1, '#ece0c4'); g.fillStyle = gr; g.fill();
  g.strokeStyle = rgba(F7.ink, .18); g.lineWidth = 1; g.stroke();
  // faint ruled lines like a note pad
  g.strokeStyle = 'rgba(120,140,170,.18)'; g.lineWidth = 1; g.beginPath(); for (let y = -sh / 2 + 34; y < sh / 2 - 8; y += 26) { g.moveTo(-sw / 2 + 8, y); g.lineTo(sw / 2 - 8, y); } g.stroke();
  text(g, '?', 0, 76, { size: 210, font: 'Instrument Serif', color: rgba(F7.stamp, .9), align: 'center' });
  // tape
  g.save(); g.translate(0, -sh / 2 - 2); g.rotate(.06); g.fillStyle = 'rgba(236,226,196,.82)'; g.fillRect(-46, -14, 92, 28); g.strokeStyle = 'rgba(160,140,100,.25)'; g.strokeRect(-46, -14, 92, 28); g.restore();
  g.restore();
}

// ---------------------------------------------------------------- engravings (ink on cream, picture px 1920 × 1080)
const INK = '#2a2420';
function hatchRows(g, x0, x1, y0, y1, gap, a, lw = 1.4) { g.strokeStyle = rgba(INK, a); g.lineWidth = lw; g.beginPath(); for (let y = y0; y < y1; y += gap) { g.moveTo(x0, y); g.lineTo(x1, y); } g.stroke(); }
// II · CEILING: a terraced pit, a curve that climbs and then runs flat under a hand-ruled line
export function ceilingImg(g, t) {
  g.fillStyle = '#efe6cf'; g.fillRect(0, 0, W, H);
  hatchRows(g, 0, W, 40, 300, 22, .1, 2);
  const cy = 330;
  // the ceiling: a thick ruled line with small hand ticks
  g.strokeStyle = rgba(INK, .9); g.lineWidth = 12; g.beginPath(); g.moveTo(120, cy); g.lineTo(1800, cy - 4); g.stroke();
  g.lineWidth = 3; g.beginPath(); g.moveTo(120, cy + 22); g.lineTo(1800, cy + 18); g.stroke();
  g.lineWidth = 3; g.beginPath(); for (let x = 150; x < 1790; x += 46) { g.moveTo(x, cy - 30); g.lineTo(x + 18, cy - 8); } g.stroke();
  // the curve: climbs, bends, runs flat just below the line
  const P = []; for (let i = 0; i <= 120; i++) { const s = i / 120, x = 180 + 1560 * s, y = 900 - 520 * (1 - Math.exp(-5.2 * s)); P.push([x, y]); }
  g.save(); g.beginPath(); g.moveTo(180, 900); P.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(1740, 900); g.closePath(); g.clip();
  g.strokeStyle = rgba(INK, .4); g.lineWidth = 2.2; g.beginPath(); for (let x = -400; x < 2200; x += 26) { g.moveTo(x, 900); g.lineTo(x + 520, 380); } g.stroke(); g.restore();
  g.strokeStyle = rgba(INK, .95); g.lineWidth = 9; g.lineJoin = 'round'; g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
  // the ground and a terraced pit (the mine the curve comes from)
  g.fillStyle = '#e6dbbf'; g.fillRect(0, 900, W, 180); g.strokeStyle = rgba(INK, .9); g.lineWidth = 5; g.beginPath(); g.moveTo(0, 900); g.lineTo(W, 900); g.stroke();
  for (let k = 0; k < 5; k++) { const w = 560 - k * 100, y = 900 + k * 34; g.strokeStyle = rgba(INK, .75); g.lineWidth = 3.5; g.beginPath(); g.moveTo(420 - w / 2, y); g.lineTo(420 + w / 2, y); g.stroke(); hatchRows(g, 420 - w / 2 + 10, 420 + w / 2 - 10, y + 8, y + 32, 8, .25, 1.6); }
  hatchRows(g, 0, W, 912, 1080, 14, .14, 1.6);
}
// III · WATCHMAN: a watch tower on a rocky coast at night, its beam sweeping the sea and the forest
export function watchmanImg(g, t) {
  g.fillStyle = '#efe6cf'; g.fillRect(0, 0, W, H);
  hatchRows(g, 0, W, 0, 720, 9, .3, 2.2);   // the night sky as close engraved lines
  // the beam: a wedge of paper (the hatching knocked out)
  const bx = 640, by = 330, ang = -.12;
  g.save(); g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + Math.cos(ang - .1) * 2000, by + Math.sin(ang - .1) * 2000); g.lineTo(bx + Math.cos(ang + .1) * 2000, by + Math.sin(ang + .1) * 2000); g.closePath();
  g.fillStyle = '#f3ecda'; g.fill(); g.restore();
  // stars
  const r = prng(77); g.fillStyle = '#f6efdc'; for (let i = 0; i < 60; i++) { const x = r() * W, y = r() * 560; if (Math.abs(Math.atan2(y - by, x - bx) - ang) < .12 && x > bx) continue; g.beginPath(); g.arc(x, y, 2 + r() * 3, 0, TAU); g.fill(); }
  // sea
  g.fillStyle = '#e6dbbf'; g.fillRect(0, 720, W, 360); g.strokeStyle = rgba(INK, .55); g.lineWidth = 2.4; g.beginPath();
  for (let y = 740; y < 1080; y += 18 + (y - 720) * .05) for (let x = (y * 7) % 90; x < W; x += 70 + (y % 40)) { g.moveTo(x, y); g.quadraticCurveTo(x + 18, y - 6, x + 36, y); } g.stroke();
  // far forest ridge on the right
  g.fillStyle = rgba(INK, .85); g.beginPath(); g.moveTo(1050, 722); for (let x = 1050; x <= 1920; x += 22) g.lineTo(x, 690 - 30 * Math.sin(x * .004) - (x % 44 ? 0 : 26)); g.lineTo(1920, 722); g.closePath(); g.fill();
  // the rock and the tower
  g.fillStyle = '#d9cdb0'; g.beginPath(); g.moveTo(330, 1080); g.lineTo(420, 820); g.lineTo(560, 760); g.lineTo(760, 790); g.lineTo(900, 1080); g.closePath(); g.fill(); g.strokeStyle = rgba(INK, .9); g.lineWidth = 4; g.stroke();
  g.save(); g.clip(); g.strokeStyle = rgba(INK, .4); g.lineWidth = 2; g.beginPath(); for (let x = 200; x < 1000; x += 18) { g.moveTo(x, 760); g.lineTo(x - 200, 1080); } g.stroke(); g.restore();
  g.fillStyle = '#efe6cf'; g.beginPath(); g.moveTo(600, 780); g.lineTo(612, 400); g.lineTo(668, 400); g.lineTo(680, 780); g.closePath(); g.fill(); g.strokeStyle = rgba(INK, .95); g.lineWidth = 4; g.stroke();
  g.strokeStyle = rgba(INK, .5); g.lineWidth = 2; g.beginPath(); for (let y = 420; y < 780; y += 14) { g.moveTo(668 - (y - 400) * -.03, y); g.lineTo(680 - (780 - y) * .03 - 2, y); } g.stroke();
  g.fillStyle = rgba(INK, .95); g.fillRect(596, 388, 88, 14); g.fillRect(616, 300, 48, 10);
  g.fillStyle = '#fff6dc'; g.fillRect(620, 310, 40, 78); g.strokeStyle = rgba(INK, .95); g.lineWidth = 3; g.strokeRect(620, 310, 40, 78);
  g.fillStyle = rgba(INK, .95); g.beginPath(); g.moveTo(610, 300); g.lineTo(640, 262); g.lineTo(670, 300); g.closePath(); g.fill();
}
// IV · A SHARE (under the slip): a ring of light divided into many equal shares, small figures around it
export function shareImg(g, t) {
  g.fillStyle = '#efe6cf'; g.fillRect(0, 0, W, H); hatchRows(g, 0, W, 0, H, 16, .12, 2);
  g.strokeStyle = rgba(INK, .9); g.lineWidth = 8; g.beginPath(); g.ellipse(960, 560, 520, 300, 0, 0, TAU); g.stroke();
  g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * TAU; g.moveTo(960 + Math.cos(a) * 470, 560 + Math.sin(a) * 260); g.lineTo(960 + Math.cos(a) * 570, 560 + Math.sin(a) * 340); } g.stroke();
}
export const ANSWERS = [
  { num: 1, word: 'Sun', img: null },     // card I's picture is the c08 land in ink (set by the scene: lib/f7_c08_land.mjs landInk)
  { num: 2, word: 'Ceiling', img: ceilingImg },
  { num: 3, word: 'Watchman', img: watchmanImg },
  { num: 4, word: 'A share', img: shareImg, slip: true },
];

// ---------------------------------------------------------------- caches
const BC = new Map();
const backKey = (o) => `back:${o.num}`;
export async function backPrepare(list, t) {
  for (const o of list) { const [c, g] = canvas(FACE.w, FACE.h); backFace(g, t, o); BC.set(backKey(o), await loadImage(c.toBuffer('image/png'))); }
}
export const backImage = (num) => BC.get(`back:${num}`);
export function backCard(ctx, t, A, o = {}) {
  const sc = Math.sqrt(Math.abs(A[0] * A[3] - A[1] * A[2])), img = BC.get(backKey(o));
  ctx.save(); apply(ctx, A);
  if (img && !o.forceVector && sc < (o.vectorAt ?? 1.05)) ctx.drawImage(img, 0, 0, FACE.w, FACE.h);
  else backFace(ctx, t, o);
  ctx.restore();
}
export const boxM = (A) => mulA(A, [BOX.w / W, 0, 0, BOX.w / W, BOX.x, BOX.y]);

// ---------------------------------------------------------------- the flip on the table
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
export function turnCard(ctx, t, cam, o) {
  const phi = clamp(o.phi ?? 0, 0, Math.PI), rot = o.rot ?? 0, c0 = Math.cos(rot), s0 = Math.sin(rot);
  const front = { X: o.X, Z: o.Z, rot, ...o.front, stampU: 1, plateT: o.plateT };
  if (phi < 1e-3 && !(o.hop > 0)) return tablePaperCard(ctx, t, cam, front);
  const Ru = [c0, 0, s0], N = [0, 1, 0], Dv = [s0, 0, -c0], cw = TB.cw, ch = TB.ch;
  const sp = Math.sin(phi), cp = Math.cos(phi), hop = o.hop ?? 0;
  const C = [o.X, .03 + cw / 2 * sp + hop, o.Z], Rp = add(Ru.map((v) => v * cp), N, sp), Nn = add(N.map((v) => v * cp), Ru, -sp);
  const back = phi > Math.PI / 2 ? 1 : 0;
  // shadow: the card's footprint on the table shrinks with the turn, the lift softens it
  shadowQuad(ctx, cam, o.X, o.Z, rot, Math.max(.6, cw * Math.abs(cp)), ch, { lift: C[1] - .03, a: 1 });
  if (phi > Math.PI - 1e-3 && hop <= 0 && !(o.bend > 0)) {
    const at = (u, v) => add(add(C, Ru, (u - .5) * cw), Dv, (v - .5) * ch), ds = depthSpread(cam, at);
    if (ds.ratio > .82) { const A = cardFaceM(cam, { X: o.X, Z: o.Z, rot }); if (A) { backCard(ctx, t, A, o.back); return A; } }
    const img = backImage(o.back.num); if (img) meshImage(ctx, cam, img, FACE.w, FACE.h, at, 4, 5);
    return null;
  }
  // which face looks at the camera (the face normal flips with the turn)
  const v = [cam.x - C[0], cam.y - C[1], cam.z - C[2]], fn = Nn[0] * v[0] + Nn[1] * v[1] + Nn[2] * v[2];
  const showBack = fn < 0;
  const S = showBack ? Rp.map((q) => -q) : Rp, bend = o.bend ?? 0;
  const at = (u, v) => { const q = u - .5, curl = bend * (1 - 4 * q * q) * (showBack ? -1 : 1); return add(add(add(C, S, q * cw), Dv, (v - .5) * ch), Nn, curl); };
  const img = showBack ? backImage(o.back.num) : null;
  if (showBack) { if (img) meshImage(ctx, cam, img, FACE.w, FACE.h, at, 5, 5); }
  else frontMesh(ctx, t, cam, front, at);
  // the sheen of the cold light sliding over the turning paper
  const sh = Math.abs(Math.sin(phi * 2)) * .14; if (sh > .01) { const P = cam.poly([at(0, 0), at(1, 0), at(1, 1), at(0, 1)]); if (P.length > 2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(232,238,246,${sh})`; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.restore(); } }
  return null;
}
// the front face (stamped, from the table's cache) on a bent / lifted card
function frontMesh(ctx, t, cam, o, at) { const img = paperCardImage(o); if (img) meshImage(ctx, cam, img, FACE.w, FACE.h, at, 5, 5); }

// ---------------------------------------------------------------- face cameras
// the camera (straight down) at which the face px rect r of a flat card { X, Z, rot, Y } fills the frame (r must be 16:9)
export function faceCam(o, r, f = TB.f) {
  const rot = o.rot ?? 0, c0 = Math.cos(rot), s0 = Math.sin(rot), u = TB.cw / FACE.w;
  const du = (r.x + r.w / 2 - FACE.w / 2) * u, dv = (r.y + r.h / 2 - FACE.h / 2) * u;
  const X = o.X + du * c0 + dv * s0, Z = o.Z + du * s0 - dv * c0, hgt = f * r.w * u / W;
  return { x: X, y: (o.Y ?? 0) + .03 + hgt, z: Z, pitch: -Math.PI / 2, yaw: -rot, f };
}
