// c16 · the room inside one of the last weeks: a quiet bedroom at night. A bed by the window, an old person asleep-awake under a
// quilt, a carer on a wooden chair leaning in to listen, a table lamp with a paper drum shade (the hero light). The camera arrives
// through the ring (the room is seen through the hole, with parallax), holds, flies into the lamp's shade until its glowing paper
// fills the frame: the quote cards are printed on that paper (16.07, 16.08); then the same way back out.
//   ROOMK                      layer depths and the lamp geometry
//   roomCam(t, A, portal)      → { cx, cy, D, ox, oy } the room camera (portal: the ring's screen data while seen through the hole)
//   drawRoom(ctx, t, A, cam)   draws the room in screen space (the caller clips it to the ring while it is a portal)
//   roomLabel(ctx, t, A)       BRONNIE WARE · PALLIATIVE CARER · … (screen overlay, mask reveal, above y 900)
//   warmRoom(T, A)             caches + the card words (T.W)
// Base frame = the room as framed at A.ringIn (1920×1080 "base px"); each layer has a depth z (base px behind the bed plane).
import { W, H, rgba, clamp, mix, lin, sm, prng, canvas, text, hatch, rough, poly, drift } from '../engine.mjs';
import { figure, POSES, reachArm, handPos, life, blink, capsule } from './figure.mjs';
import { once, eoX, eiX, qio, cio, sstep, smoother, hash, TAU } from './v2_c16_kit.mjs';

export const D0 = 1500;
const C0 = [W / 2, H / 2];
export const ZL = { sky: 9000, town: 3200, wall: 300, lamp: 190, bed: 120, pat: 112, carer: -70, motes: 30 };
export const LAMP = { x: 468, y: 452, w: 124, h: 96 };            // the shade (centre, size) on the lamp layer
export const PANEL = { w: 2640, h: 2040 };                        // the shade's front in panel px (= screen px at the card framing)
const P2B = LAMP.w / PANEL.w;                                      // panel px → base px
export const CARD = { y1: -505, y2: 520 };                         // card centres on the panel
const AMB = '#ffb35c', CORE = '#fff1d6', CREAM = '#f3efe2';

// ======================================================================= camera
// A camera is { T: [x, y] (base px on the lamp layer that sits at the screen origin), k (scale of the lamp layer), ox, oy }.
function camFromTk(Tx, Ty, k, ox = C0[0], oy = C0[1]) {
  const D = (D0 + ZL.lamp) / k - ZL.lamp, f = (D0 + ZL.lamp) / D0;
  return { cx: (Tx - C0[0]) * f, cy: (Ty - C0[1]) * f, D, ox, oy, k };
}
// zoom about the lamp: the lamp centre travels on a straight screen path while the scale grows exponentially
function lampZoom(a, b, u) {
  const k = Math.exp(mix(Math.log(a.k), Math.log(b.k), u));
  const sa = [C0[0] + (LAMP.x - a.T[0]) * a.k, C0[1] + (LAMP.y - a.T[1]) * a.k], sb = [C0[0] + (LAMP.x - b.T[0]) * b.k, C0[1] + (LAMP.y - b.T[1]) * b.k];
  const sx = mix(sa[0], sb[0], u), sy = mix(sa[1], sb[1], u);
  return { T: [LAMP.x - (sx - C0[0]) / k, LAMP.y - (sy - C0[1]) / k], k };
}
const KS = (() => {
  const kc = 1 / P2B;
  return {
    base: { T: [C0[0], C0[1]], k: 1 },
    hold: { T: [C0[0] - 34, C0[1] - 14], k: (D0 + ZL.lamp) / (.94 * D0 + ZL.lamp) },
    card1: { T: [LAMP.x, LAMP.y + CARD.y1 * P2B], k: kc },
    card1b: { T: [LAMP.x + 3 * P2B, LAMP.y + (CARD.y1 + 10) * P2B], k: kc * 1.022 },
    card2: { T: [LAMP.x - 4 * P2B, LAMP.y + CARD.y2 * P2B], k: kc * 1.022 },
    card2b: { T: [LAMP.x, LAMP.y + (CARD.y2 + 8) * P2B], k: kc * 1.04 },
  };
})();
const tkMix = (a, b, u) => ({ T: [mix(a.T[0], b.T[0], u), mix(a.T[1], b.T[1], u)], k: Math.exp(mix(Math.log(a.k), Math.log(b.k), u)) });
// the exit is one eased pull-back over the room and the ring: the room part is the first `split` of the log-zoom
export const EXIT_SPLIT = .53;
export function exitW(t, A) { return cio(lin(A.back0, A.exitEnd, t)); }

export function roomCam(t, A, portal) {
  if (portal) {
    // seen through the hole: the room lies deeper than the ring, so it grows more slowly than the hole (parallax)
    const r = Math.max(1, portal.size) / A.ringSizeIn, g = .58, kb = Math.pow(r, g);   // kb: scale of the bed plane
    const Dbed = (D0 + ZL.bed) / kb - ZL.bed, k = (D0 + ZL.lamp) / (Dbed + ZL.lamp);
    return camFromTk(C0[0], C0[1], k, portal.cx, portal.cy);
  }
  let s;
  if (t < A.lamp0) s = tkMix(KS.base, KS.hold, sstep(A.ringIn, A.lamp0 + .3, t));
  else if (t < A.lamp1) {
    const h = tkMix(KS.base, KS.hold, sstep(A.ringIn, A.lamp0 + .3, t));
    s = lampZoom(h, KS.card1, qio(lin(A.lamp0, A.lamp1, t)));
  }
  else if (t < A.crane0) s = tkMix(KS.card1, KS.card1b, sm(lin(A.lamp1, A.crane0 + .4, t)));
  else if (t < A.crane1) { const a = tkMix(KS.card1, KS.card1b, sm(lin(A.lamp1, A.crane0 + .4, t))); s = tkMix(a, KS.card2, qio(lin(A.crane0, A.crane1, t))); }
  else if (t < A.back0) s = tkMix(KS.card2, KS.card2b, sm(lin(A.crane1, A.back0 + .5, t)));
  else {
    // out the same way: the lamp recedes, the room returns (ring part handled by the grid camera)
    const a = tkMix(KS.card2, KS.card2b, sm(lin(A.crane1, A.back0 + .5, t))), u = clamp(exitW(t, A) / EXIT_SPLIT);
    s = lampZoom(a, KS.base, u);
  }
  return camFromTk(s.T[0], s.T[1], s.k);
}

// set the transform of a layer at depth z; returns its scale (0 = behind the camera)
function L(ctx, cam, z) {
  const den = cam.D + z; if (den < 14) return 0;
  const k = (D0 + z) / den, q = D0 / den;
  ctx.setTransform(k, 0, 0, k, cam.ox - C0[0] * k - cam.cx * q, cam.oy - C0[1] * k - cam.cy * q);
  return k;
}
// screen point of base point (x, y) on layer z
function S(cam, z, x, y) { const den = Math.max(14, cam.D + z), k = (D0 + z) / den, q = D0 / den; return [cam.ox + (x - C0[0]) * k - cam.cx * q, cam.oy + (y - C0[1]) * k - cam.cy * q, k]; }

// ======================================================================= light
// the lamp breathes slowly; on "regretted" it swells a little, as if the room leaned in too
export function lampI(t, A) { return 1 + .035 * Math.sin(t * TAU / 4.6) + .012 * Math.sin(t * TAU / 1.9 + 1) + .13 * Math.exp(-Math.pow((t - (A.regretted + .5)) / .55, 2)); }

// ======================================================================= the words on the shade
let WORDS = null;
const [, MX] = canvas(8, 8);
function layoutWords(words, size, w) {
  MX.font = `${size}px "Instrument Serif"`; const sp = MX.measureText(' ').width, lines = [[]]; let x = 0;
  for (const wd of words) { const ww = MX.measureText(wd.w).width; if (x > 0 && x + ww > w) { lines.push([]); x = 0; } lines[lines.length - 1].push({ ...wd, x, ww }); x += ww + sp; }
  return lines.map((Lw) => ({ words: Lw, width: Lw.length ? Lw[Lw.length - 1].x + Lw[Lw.length - 1].ww : 0 }));
}
export function warmRoom(T, A) {
  const w1 = T.W('07b', "I wish I'd", 'of me'), w2 = T.W('07b', "I wish I hadn't", 'so hard');
  WORDS = {
    c1: { kicker: 'THE MOST COMMON REGRET', lines: layoutWords(w1, 70, 1330), size: 70, hi: 'courage', y: CARD.y1 },
    c2: { kicker: 'REGRET NUMBER TWO', lines: layoutWords(w2, 70, 1330), size: 70, hi: 'hard', y: CARD.y2 },
  };
  wallTex(); floorTex(); quiltTex(); paperTex();
}

// ======================================================================= cached textures (Images)
function wallTex() {
  return once('c16wall', () => {
    const [c, x] = canvas(2600, 1500), r = prng(1611);
    // plaster: dark indigo-grey, a faint vertical paper stripe and a small engraved sprig pattern, darker toward the corners
    const g = x.createLinearGradient(0, 0, 0, 1500); g.addColorStop(0, '#141832'); g.addColorStop(.6, '#1b2040'); g.addColorStop(1, '#161a33'); x.fillStyle = g; x.fillRect(0, 0, 2600, 1500);
    for (let i = 0; i < 2600; i += 22) { x.fillStyle = 'rgba(160,170,220,.035)'; x.fillRect(i, 0, 2, 1500); x.fillStyle = 'rgba(0,0,10,.05)'; x.fillRect(i + 11, 0, 1, 1500); }
    x.strokeStyle = 'rgba(190,196,236,.07)'; x.lineWidth = 1; x.lineCap = 'round';
    for (let yy = 30, row = 0; yy < 1500; yy += 64, row++) for (let xx = (row % 2) * 33; xx < 2600; xx += 66) {
      x.beginPath(); x.moveTo(xx, yy + 8); x.quadraticCurveTo(xx - 5, yy, xx, yy - 9); x.moveTo(xx, yy - 2); x.quadraticCurveTo(xx + 6, yy - 6, xx + 7, yy - 11); x.moveTo(xx, yy + 2); x.quadraticCurveTo(xx - 7, yy - 1, xx - 8, yy - 6); x.stroke();
    }
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${r() < .5 ? '0,0,0' : '200,200,240'},${.03 + r() * .04})`; x.fillRect(r() * 2600, r() * 1500, 1 + r() * 2, 1); }
    return c;
  });
}
function floorTex() {
  return once('c16floor', () => {
    const [c, x] = canvas(2600, 520), r = prng(1612);
    x.fillStyle = '#120f1e'; x.fillRect(0, 0, 2600, 520);
    // boards parallel to the wall, widening toward the camera; seams + grain
    let y = 0, w = 16, row = 0;
    while (y < 520) {
      const off = r() * 300;
      x.fillStyle = `rgba(${70 + r() * 20},${46 + r() * 12},${34 + r() * 10},${.16 + r() * .08})`; x.fillRect(0, y, 2600, w);
      x.strokeStyle = 'rgba(4,3,8,.75)'; x.lineWidth = 1.3; x.beginPath(); x.moveTo(0, y); x.lineTo(2600, y); x.stroke();
      for (let j = off; j < 2600; j += 380 + r() * 260) { x.beginPath(); x.moveTo(j, y); x.lineTo(j, y + w); x.stroke(); }
      x.strokeStyle = 'rgba(120,90,70,.09)'; x.lineWidth = .8; for (let k = 0; k < 3; k++) { const yy = y + w * (.25 + .25 * k) + (r() - .5) * 2; x.beginPath(); x.moveTo(0, yy); for (let xx = 0; xx <= 2600; xx += 130) x.lineTo(xx, yy + Math.sin(xx * .01 + row) * 1.2); x.stroke(); }
      y += w; w *= 1.13; row++;
    }
    return c;
  });
}
function quiltTex() {
  return once('c16quilt', () => {
    const [c, x] = canvas(1100, 260);
    // a quilt: cream-rose cloth, stitched in diamonds, a small rosette in each (the film's guilloche, sewn)
    x.fillStyle = '#b9a39a'; x.fillRect(0, 0, 1100, 260);
    x.strokeStyle = 'rgba(70,45,50,.32)'; x.lineWidth = 1.1; x.setLineDash([3, 3]);
    for (let i = -300; i < 1400; i += 46) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 260, 260); x.stroke(); x.beginPath(); x.moveTo(i + 260, 0); x.lineTo(i, 260); x.stroke(); }
    x.setLineDash([]); x.strokeStyle = 'rgba(150,70,60,.35)'; x.lineWidth = .9;
    for (let yy = 23, rw = 0; yy < 270; yy += 46, rw++) for (let xx = (rw % 2) * 23; xx < 1120; xx += 46) { x.beginPath(); for (let q = 0; q <= 40; q++) { const a = q / 40 * TAU, rr = 5 + 2.2 * Math.sin(a * 6); q ? x.lineTo(xx + Math.cos(a) * rr, yy + Math.sin(a) * rr) : x.moveTo(xx + Math.cos(a) * rr, yy + Math.sin(a) * rr); } x.stroke(); }
    return c;
  });
}
function paperTex() {
  return once('c16paper', () => {
    // backlit paper: long soft fibres, a few denser clouds (the light shows the paper's structure)
    const [c, x] = canvas(1320, 1020), r = prng(1613);
    x.clearRect(0, 0, 1320, 1020);
    for (let i = 0; i < 70; i++) { const px = r() * 1320, py = r() * 1020, R = 40 + r() * 160, g = x.createRadialGradient(px, py, 0, px, py, R); g.addColorStop(0, `rgba(150,80,30,${.05 + r() * .05})`); g.addColorStop(1, 'rgba(150,80,30,0)'); x.fillStyle = g; x.fillRect(px - R, py - R, 2 * R, 2 * R); }
    x.lineCap = 'round';
    for (let i = 0; i < 2600; i++) {
      const px = r() * 1320, py = r() * 1020, Lf = 8 + r() * 46, a0 = r() * TAU, bend = (r() - .5) * 1.2;
      x.strokeStyle = r() < .6 ? `rgba(140,72,28,${.07 + r() * .12})` : `rgba(255,248,230,${.12 + r() * .2})`; x.lineWidth = .5 + r() * 1.1;
      x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a0) * Lf * .5, py + Math.sin(a0) * Lf * .5, px + Math.cos(a0 + bend) * Lf, py + Math.sin(a0 + bend) * Lf); x.stroke();
    }
    return c;
  });
}

// ======================================================================= the room
export function drawRoom(ctx, t, A, cam) {
  const I = lampI(t, A);
  ctx.save();
  sky(ctx, t, cam);
  wall(ctx, t, A, cam, I);
  lamp(ctx, t, A, cam, I);
  bed(ctx, t, A, cam, I);
  carer(ctx, t, A, cam, I);
  motes(ctx, t, cam, I);
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}

// ---- the window: frame on the wall, glass panes showing the night (stars, a pale moon, roofs of the town with two lit windows)
const WIN = { x0: 1092, x1: 1556, y0: 168, y1: 566 };
function windowPath(ctx) { const { x0, x1, y0, y1 } = WIN; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.lineTo(x0, y0 + 60); ctx.quadraticCurveTo(x0, y0, x0 + 60, y0); ctx.lineTo(x1 - 60, y0); ctx.quadraticCurveTo(x1, y0, x1, y0 + 60); ctx.lineTo(x1, y1); ctx.closePath(); }
const SKYS = (() => { const r = prng(1614), s = []; for (let i = 0; i < 160; i++) s.push([r() * 900 + 870, r() * 560 + 60, .5 + r() * (r() < .9 ? .9 : 2), r() * TAU, .5 + r() * 1.5]); return s; })();
function sky(ctx, t, cam) {
  if (!L(ctx, cam, ZL.wall)) return;
  ctx.save(); windowPath(ctx); ctx.clip();
  L(ctx, cam, ZL.sky);
  const g = ctx.createLinearGradient(0, 60, 0, 700); g.addColorStop(0, '#05061a'); g.addColorStop(.6, '#0d1233'); g.addColorStop(1, '#1d2148'); ctx.fillStyle = g; ctx.fillRect(700, -200, 1300, 1100);
  // the moon: a pale disc, a soft halo (cool, secondary to the lamp)
  const mx = 1410, my = 250; const hg = ctx.createRadialGradient(mx, my, 0, mx, my, 140); hg.addColorStop(0, 'rgba(220,228,255,.22)'); hg.addColorStop(1, 'rgba(220,228,255,0)'); ctx.fillStyle = hg; ctx.fillRect(mx - 140, my - 140, 280, 280);
  ctx.fillStyle = '#e8ecf6'; ctx.beginPath(); ctx.arc(mx, my, 24, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(150,160,200,.35)'; for (const [a, b, rr] of [[-7, -5, 6], [6, 7, 4.5], [8, -9, 3], [-3, 10, 3.2]]) { ctx.beginPath(); ctx.arc(mx + a, my + b, rr, 0, TAU); ctx.fill(); }
  for (const [x, y, s, ph, f] of SKYS) { const tw = .6 + .4 * Math.sin(t * f + ph); ctx.fillStyle = `rgba(243,239,226,${.35 + .55 * tw})`; ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill(); }
  // the town far below the window: roofs, a chimney, two lit windows (life goes on out there)
  L(ctx, cam, ZL.town);
  ctx.fillStyle = '#0a0b1c'; ctx.beginPath(); ctx.moveTo(1000, 640);
  const roofs = [[1000, 548], [1060, 548], [1100, 510], [1150, 548], [1210, 540], [1210, 520], [1222, 520], [1222, 540], [1290, 540], [1330, 500], [1380, 540], [1450, 552], [1500, 530], [1560, 530], [1610, 556], [1700, 556]];
  for (const [x, y] of roofs) ctx.lineTo(x, y); ctx.lineTo(1700, 640); ctx.closePath(); ctx.fill();
  for (const [x, y, a] of [[1128, 556, .9], [1342, 548, .75], [1516, 560, .6]]) { ctx.fillStyle = rgba('#ffcf8a', a); ctx.fillRect(x, y, 6, 8); ctx.fillStyle = rgba(AMB, .12 * a); ctx.beginPath(); ctx.arc(x + 3, y + 4, 14, 0, TAU); ctx.fill(); }
  ctx.restore();
}

// ---- the back wall, the window frame, curtains, the light of the lamp on the wall, the carer's shadow
function wall(ctx, t, A, cam, I) {
  const k = L(ctx, cam, ZL.wall); if (!k) return;
  // the wall around the window (even-odd: the glass stays)
  ctx.save(); ctx.beginPath(); ctx.rect(-1200, -900, 4400, 1676); windowPath(ctx); ctx.clip('evenodd');
  ctx.drawImage(wallTex(), -400, -500, 2900, 1276);
  // wainscot: a chair rail and darker panelling below
  ctx.fillStyle = 'rgba(8,8,22,.42)'; ctx.fillRect(-1200, 600, 4400, 176);
  ctx.fillStyle = 'rgba(190,190,230,.09)'; ctx.fillRect(-1200, 596, 4400, 4); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-1200, 600, 4400, 3);
  ctx.strokeStyle = 'rgba(180,180,230,.06)'; ctx.lineWidth = 1.5; for (let x = -1180; x < 3200; x += 150) { ctx.strokeRect(x + 14, 618, 122, 136); }
  ctx.restore();
  // skirting board + the floor
  ctx.fillStyle = '#0d0c1a'; ctx.fillRect(-1200, 760, 4400, 16);
  ctx.drawImage(floorTex(), -1200, 776, 4400, 520);
  // window: reveal, frame, mullions, sill (cream paint, engraved shading), moonlight on the reveal
  ctx.save(); windowPath(ctx); ctx.lineWidth = 22; ctx.strokeStyle = '#3a3a52'; ctx.stroke(); ctx.lineWidth = 10; ctx.strokeStyle = '#5a5a76'; ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#4c4c68'; const mx = (WIN.x0 + WIN.x1) / 2; ctx.fillRect(mx - 5, WIN.y0, 10, WIN.y1 - WIN.y0); ctx.fillRect(WIN.x0, 360, WIN.x1 - WIN.x0, 9);
  ctx.fillStyle = 'rgba(210,220,255,.16)'; ctx.fillRect(mx - 5, WIN.y0, 2, WIN.y1 - WIN.y0); ctx.fillRect(WIN.x0, 360, WIN.x1 - WIN.x0, 2);
  ctx.fillStyle = '#56566f'; ctx.fillRect(WIN.x0 - 26, WIN.y1, WIN.x1 - WIN.x0 + 52, 14); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(WIN.x0 - 26, WIN.y1 + 14, WIN.x1 - WIN.x0 + 52, 7);
  ctx.fillStyle = 'rgba(220,228,255,.18)'; ctx.fillRect(WIN.x0 - 26, WIN.y1, WIN.x1 - WIN.x0 + 52, 2);
  // the moonlight falling through the window onto the floor (a pale skewed pane)
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(150,165,230,.05)';
  ctx.beginPath(); ctx.moveTo(1120, 790); ctx.lineTo(1540, 790); ctx.lineTo(1700, 960); ctx.lineTo(1200, 960); ctx.closePath(); ctx.fill(); ctx.restore();
  // curtains: two heavy panels gathered at the sides, folds as soft vertical bands + hatching, a rod with rings
  const sway = Math.sin(t * .7) * 1.6 + Math.sin(t * 1.9 + 1) * .5;
  curtain(ctx, 1020, 1132, 132, 742, 1, sway); curtain(ctx, 1516, 1640, 132, 742, -1, -sway * .8);
  ctx.fillStyle = '#2a2436'; ctx.fillRect(990, 122, 680, 8); ctx.fillStyle = 'rgba(255,220,180,.18)'; ctx.fillRect(990, 122, 680, 2);
  for (let x = 1004; x < 1660; x += 26) { if (x > 1140 && x < 1508) continue; ctx.strokeStyle = '#3c3448'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, 128, 6, 0, TAU); ctx.stroke(); }
  // the lamp's light on the wall: a warm pool, brighter cones above and below the shade
  const lx = LAMP.x, ly = LAMP.y;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  let g = ctx.createRadialGradient(lx, ly, 20, lx, ly, 820); g.addColorStop(0, rgba('#ffcf8a', .34 * I)); g.addColorStop(.35, rgba('#e8955a', .12 * I)); g.addColorStop(1, 'rgba(200,110,60,0)'); ctx.fillStyle = g; ctx.fillRect(lx - 820, ly - 820, 1640, 1640);
  // the upward cone (a parabola of light on the wall above the shade)
  ctx.save(); ctx.beginPath(); ctx.moveTo(lx - 56, ly - 46); ctx.quadraticCurveTo(lx - 200, ly - 300, lx - 330, ly - 700); ctx.lineTo(lx + 330, ly - 700); ctx.quadraticCurveTo(lx + 200, ly - 300, lx + 56, ly - 46); ctx.closePath(); ctx.clip();
  g = ctx.createRadialGradient(lx, ly - 40, 0, lx, ly - 40, 520); g.addColorStop(0, rgba('#ffe2b0', .3 * I)); g.addColorStop(.5, rgba('#ffcf8a', .1 * I)); g.addColorStop(1, 'rgba(255,207,138,0)'); ctx.fillStyle = g; ctx.fillRect(lx - 600, ly - 700, 1200, 700); ctx.restore();
  ctx.restore();
  // the carer's shadow on the wall (cast by the lamp, to her right, bigger and softer; it leans with her)
  const lean = carerLean(t, A);
  ctx.save(); ctx.globalAlpha = .3; ctx.translate(1010, 610); ctx.scale(1.55, 1.42); ctx.rotate(-.04);
  shadowCarer(ctx, lean); ctx.restore();
}
function curtain(ctx, x0, x1, y0, y1, side, sway) {
  const n = 7, w = x1 - x0;
  ctx.save();
  const path = () => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.bezierCurveTo(x1 + sway * .3, y0 + 200, x1 - side * 18 + sway, y1 - 220, x1 - side * 10 + sway, y1); ctx.lineTo(x0 + sway * .5, y1); ctx.bezierCurveTo(x0 + sway * .2, y1 - 200, x0, y0 + 220, x0, y0); ctx.closePath(); };
  path(); const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#2b2a4a'); g.addColorStop(1, '#232241'); ctx.fillStyle = g; ctx.fill();
  path(); ctx.clip();
  for (let i = 0; i < n; i++) {   // folds: light ridge + shadow valley
    const u = (i + .5) / n, x = x0 + w * u, wob = Math.sin(i * 2.3) * 4 + sway * (u * .6);
    const gg = ctx.createLinearGradient(x - w / n / 2, 0, x + w / n / 2, 0); gg.addColorStop(0, 'rgba(0,0,10,.32)'); gg.addColorStop(.45, 'rgba(150,150,210,.1)'); gg.addColorStop(1, 'rgba(0,0,10,.25)');
    ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(x - w / n / 2, y0); ctx.lineTo(x + w / n / 2, y0); ctx.lineTo(x + w / n / 2 + wob, y1); ctx.lineTo(x - w / n / 2 + wob, y1); ctx.closePath(); ctx.fill();
  }
  hatch(ctx, null, 1.45, 4.2, .2, { box: [x0 - 20, y0, w + 40, y1 - y0], col: '#05060f', w: .8, wobble: .6, seed: Math.round(x0) });
  ctx.restore();
  // the hem, a moonlit edge toward the window
  ctx.strokeStyle = 'rgba(200,210,255,.14)'; ctx.lineWidth = 1.4; ctx.beginPath(); const ex = side > 0 ? x1 : x0; ctx.moveTo(ex, y0); ctx.bezierCurveTo(ex + sway * .3, y0 + 200, ex - side * 18 + sway, y1 - 220, ex - side * 10 + sway, y1); ctx.stroke();
}

// ---- the lamp: a small night table (drawer, knob), a book and a glass of water, a turned ceramic base, the drum shade (hero)
function lamp(ctx, t, A, cam, I) {
  const k = L(ctx, cam, ZL.lamp); if (!k) return;
  const lx = LAMP.x, ly = LAMP.y, top = ly - LAMP.h / 2, bot = ly + LAMP.h / 2, hw = LAMP.w / 2;
  // only the shade's panel is on screen at the card framing: skip the rest when it is far out of frame
  const sc = S(cam, ZL.lamp, lx, ly), big = sc[2] > 6;
  if (!big) {
    // table: top slab, drawer, legs; lit from above by the lamp
    ctx.fillStyle = '#2a1c18'; ctx.fillRect(372, 604, 196, 12);
    let g = ctx.createLinearGradient(372, 0, 568, 0); g.addColorStop(0, '#3a2620'); g.addColorStop(.5, '#5a3a2a'); g.addColorStop(1, '#2a1a16');
    ctx.fillStyle = g; ctx.fillRect(380, 616, 180, 70); ctx.strokeStyle = 'rgba(0,0,0,.5)'; ctx.lineWidth = 1.5; ctx.strokeRect(390, 626, 160, 50);
    ctx.fillStyle = '#c9a45a'; ctx.beginPath(); ctx.arc(470, 651, 4, 0, TAU); ctx.fill();
    ctx.fillStyle = '#24161a'; ctx.fillRect(386, 686, 9, 90); ctx.fillRect(546, 686, 9, 90); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(395, 686, 151, 6);
    hatch(ctx, [[380, 616], [560, 616], [560, 686], [380, 686]], -.9, 3.6, .16, { col: '#000000', w: .7, seed: 3 });
    ctx.fillStyle = rgba('#ffcf8a', .28 * I); ctx.fillRect(372, 603, 196, 3);
    // a book (cloth cover, page edges) and a glass of water catching the lamp
    ctx.fillStyle = '#5b2f33'; ctx.fillRect(392, 590, 62, 14); ctx.fillStyle = '#e8dcc4'; ctx.fillRect(395, 593, 56, 8); ctx.fillStyle = '#4a2528'; ctx.fillRect(392, 590, 62, 3);
    ctx.strokeStyle = 'rgba(120,90,70,.5)'; ctx.lineWidth = .6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(396, 595 + i * 1.8); ctx.lineTo(450, 595 + i * 1.8); ctx.stroke(); }
    ctx.fillStyle = 'rgba(190,210,230,.22)'; ctx.beginPath(); ctx.moveTo(516, 572); ctx.lineTo(538, 572); ctx.lineTo(535, 604); ctx.lineTo(519, 604); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(160,190,220,.25)'; ctx.fillRect(519, 584, 17, 19); ctx.strokeStyle = 'rgba(255,240,215,.6)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(518, 574); ctx.lineTo(521, 602); ctx.stroke();
    ctx.fillStyle = rgba('#fff1d6', .7); ctx.fillRect(520, 584, 15, 1.5);
    // base: a turned ceramic vase shape with a glaze highlight, a brass neck and the harp hidden by the shade
    ctx.fillStyle = '#6b5a4a'; ctx.beginPath(); ctx.ellipse(lx, 603, 30, 5, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(lx - 22, 602); ctx.bezierCurveTo(lx - 40, 580, lx - 38, 548, lx - 12, 528); ctx.lineTo(lx + 12, 528); ctx.bezierCurveTo(lx + 38, 548, lx + 40, 580, lx + 22, 602); ctx.closePath();
    g = ctx.createLinearGradient(lx - 36, 0, lx + 36, 0); g.addColorStop(0, '#d7c6a8'); g.addColorStop(.35, '#b9a58a'); g.addColorStop(1, '#4a3c34'); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(255,240,210,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx - 24, 590); ctx.bezierCurveTo(lx - 33, 572, lx - 30, 552, lx - 12, 536); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,30,20,.35)'; ctx.lineWidth = .8; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(lx, 548 + i * 12, 30 - Math.abs(i - 1.5) * 3, 3, 0, 0, Math.PI); ctx.stroke(); }
    ctx.fillStyle = '#a07a3e'; ctx.fillRect(lx - 4, bot - 2, 8, 528 - bot + 2); ctx.fillStyle = '#d9b26a'; ctx.fillRect(lx - 4, bot - 2, 2, 528 - bot + 2);
    // light falling from the shade's bottom opening onto the table
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    g = ctx.createRadialGradient(lx, 604, 0, lx, 604, 150); g.addColorStop(0, rgba('#ffd9a0', .42 * I)); g.addColorStop(1, 'rgba(255,217,160,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(lx, 606, 150, 16, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // the shade: a drum of paper, light from inside (brighter where the bulb is), darker toward the curving sides
  ctx.save(); ctx.translate(lx, ly); ctx.scale(P2B, P2B);
  shade(ctx, t, A, I, sc[2] * P2B);
  ctx.restore();
  if (!big) {
    // glow round the shade (the paper is brighter than anything else in the room)
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(lx, ly + 4, 40, lx, ly + 4, 210); g.addColorStop(0, rgba('#ffcf8a', .3 * I)); g.addColorStop(1, 'rgba(255,207,138,0)'); ctx.fillStyle = g; ctx.fillRect(lx - 210, ly - 206, 420, 420);
    ctx.restore();
  }
}
// the shade in panel px (origin = shade centre). ps = screen px per panel px (for level of detail)
function shade(ctx, t, A, I, ps) {
  const hw = PANEL.w / 2, hh = PANEL.h / 2, ell = 120;   // the rims are seen as flat ellipses (we look slightly down)
  // the panel outline: straight sides, the top rim an ellipse (back half hidden), the bottom rim's front half
  const outline = () => { ctx.beginPath(); ctx.moveTo(-hw, -hh); ctx.ellipse(0, -hh, hw, ell, 0, Math.PI, 0, true); ctx.lineTo(hw, hh); ctx.ellipse(0, hh, hw, ell, 0, 0, Math.PI, false); ctx.closePath(); };
  // inside of the top opening (seen from above): the lit inner surface and the bulb's glare
  ctx.fillStyle = '#f6d6a0'; ctx.beginPath(); ctx.ellipse(0, -hh, hw, ell, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = 'rgba(255,250,235,.9)'; ctx.beginPath(); ctx.ellipse(0, -hh + 20, hw * .5, ell * .45, 0, 0, TAU); ctx.fill();
  outline();
  const g = ctx.createRadialGradient(0, 260, 60, 0, 260, 1750); g.addColorStop(0, '#fff6e2'); g.addColorStop(.35, '#ffe6b6'); g.addColorStop(.7, '#f7c785'); g.addColorStop(1, '#e09a52');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); outline(); ctx.clip();
  // the light breathes in the paper
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#fff4dc', clamp((I - 1) * 1.4, 0, .3)); ctx.fillRect(-hw, -hh - ell, PANEL.w, PANEL.h + 2 * ell);
  ctx.globalCompositeOperation = 'source-over';
  // curvature: the sides turn away from the light
  const gs = ctx.createLinearGradient(-hw, 0, hw, 0); gs.addColorStop(0, 'rgba(150,60,20,.5)'); gs.addColorStop(.18, 'rgba(150,60,20,.12)'); gs.addColorStop(.5, 'rgba(150,60,20,0)'); gs.addColorStop(.82, 'rgba(150,60,20,.12)'); gs.addColorStop(1, 'rgba(150,60,20,.55)');
  ctx.fillStyle = gs; ctx.fillRect(-hw, -hh - ell, PANEL.w, PANEL.h + 2 * ell);
  if (ps > .04) { ctx.globalAlpha = clamp((ps - .04) * 4, 0, 1) * .9; ctx.drawImage(paperTex(), -hw, -hh - ell, PANEL.w, PANEL.h + 2 * ell); ctx.globalAlpha = 1; }
  // the seam where the paper overlaps, slightly darker; the inner wire spokes as faint shadows near the rims
  ctx.fillStyle = 'rgba(140,70,30,.16)'; ctx.fillRect(hw * .7, -hh - ell, 26, PANEL.h + 2 * ell); ctx.fillStyle = 'rgba(140,70,30,.1)'; ctx.fillRect(hw * .7 + 26, -hh - ell, 8, PANEL.h + 2 * ell);
  // the words (16.07, 16.08)
  if (WORDS && ps > .05) { const vis = clamp((ps - .05) / .25); cardText(ctx, t, WORDS.c1, vis); cardText(ctx, t, WORDS.c2, vis); }
  ctx.restore();
  // rims: the paper rolled over a brass wire, top and bottom
  ctx.lineWidth = 22; ctx.strokeStyle = 'rgba(150,70,25,.55)'; ctx.beginPath(); ctx.ellipse(0, -hh, hw, ell, 0, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, hh, hw, ell, 0, 0, Math.PI); ctx.stroke();
  ctx.lineWidth = 8; ctx.strokeStyle = '#6b4220'; ctx.beginPath(); ctx.ellipse(0, -hh, hw, ell, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, hh, hw, ell, 0, 0, Math.PI); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,226,170,.7)'; ctx.beginPath(); ctx.ellipse(0, -hh - 5, hw, ell, 0, .2, Math.PI - .2); ctx.stroke();
}
// one card on the shade: kicker, the amber quote mark, the words lit with the voice, rule, attribution
function cardText(ctx, t, c, vis) {
  const ink = '#2b1a12', amber = '#a4521a', size = c.size, lh = size * 1.2, lines = c.lines, x0 = -665;
  const blockH = 44 + lines.length * lh + 150, y0 = c.y - blockH / 2;
  ctx.save(); ctx.globalAlpha = vis;
  text(ctx, c.kicker, x0, y0 + 14, { size: 19, weight: 600, color: rgba(amber, .9), spacing: 5 });
  text(ctx, '“', x0 - 86, y0 + 44 + size * 1.05, { size: size * 2.5, font: 'Instrument Serif', color: rgba(amber, .82) });
  lines.forEach((Lw, li) => {
    const yy = y0 + 44 + size + li * lh;
    for (const wd of Lw.words) {
      const lit = sm(lin(wd.s - .06, wd.s + .22, t)), isHi = wd.w.toLowerCase().replace(/[^a-z]/g, '') === c.hi;
      text(ctx, wd.w, x0 + wd.x, yy, { size, font: 'Instrument Serif', color: rgba(isHi ? amber : ink, mix(.13, 1, lit)) });
      if (isHi && lit > 0) { ctx.strokeStyle = rgba(amber, .8 * lit); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x0 + wd.x, yy + 12); ctx.lineTo(x0 + wd.x + wd.ww * lit, yy + 12); ctx.stroke(); }
    }
  });
  const my = y0 + 44 + lines.length * lh + 62;
  ctx.strokeStyle = rgba(amber, .75); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, my - 26); ctx.lineTo(x0 + 54, my - 26); ctx.stroke();
  text(ctx, 'As recorded by Bronnie Ware', x0, my + 12, { size: 36, font: 'Instrument Serif', color: rgba(ink, .95) });
  text(ctx, 'PALLIATIVE CARER  ·  THE TOP FIVE REGRETS OF THE DYING  ·  2011', x0, my + 46, { size: 16, weight: 600, color: rgba(ink, .66), spacing: 2.6 });
  ctx.restore();
}

// ---- the bed: headboard, mattress, the patient under the quilt (breathing), the near arm on the quilt
const BED = { x0: 590, x1: 1560, top: 700, near: 728, floor: 808 };
function patBreath(t) { return Math.sin(t * TAU / 5.2 + .8); }
function bed(ctx, t, A, cam, I) {
  const k = L(ctx, cam, ZL.bed); if (!k) return;
  const b = patBreath(t), { x0, x1, top, near, floor } = BED;
  // shadow under the bed
  ctx.fillStyle = 'rgba(3,3,10,.6)'; ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, floor + 2, (x1 - x0) / 2 + 30, 14, 0, 0, TAU); ctx.fill();
  // footboard (back), mattress block, valance
  ctx.fillStyle = '#2c1d1a'; ctx.beginPath(); ctx.moveTo(x1 - 34, floor); ctx.lineTo(x1 - 34, 632); ctx.quadraticCurveTo(x1 - 16, 618, x1 + 2, 632); ctx.lineTo(x1 + 2, floor); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,207,138,.07)'; ctx.fillRect(x1 - 34, 632, 4, floor - 632);
  ctx.fillStyle = '#d9cfc0'; ctx.fillRect(x0 + 20, top - 6, x1 - x0 - 50, near - top + 26);
  // legs
  ctx.fillStyle = '#24171a'; ctx.fillRect(x0 + 6, floor - 30, 12, 30); ctx.fillRect(x1 - 30, floor - 30, 12, 30);
  // the pillow (behind the head), the patient, the quilt
  pillow(ctx, t, I, 0);
  patient(ctx, t, A, I, b);
  pillow(ctx, t, I, 1);
  quilt(ctx, t, A, I, b);
  // headboard (in front of the pillow's end): turned posts, a rounded panel; lamp-lit on its left face
  const hx = x0 - 4;
  ctx.fillStyle = '#33221d'; ctx.beginPath(); ctx.moveTo(hx, floor); ctx.lineTo(hx, 560); ctx.quadraticCurveTo(hx + 20, 530, hx + 40, 560); ctx.lineTo(hx + 40, floor); ctx.closePath(); ctx.fill();
  const g = ctx.createLinearGradient(hx, 0, hx + 40, 0); g.addColorStop(0, rgba('#ffcf8a', .38 * I)); g.addColorStop(.5, rgba('#ffcf8a', .06)); g.addColorStop(1, 'rgba(0,0,0,.2)'); ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(hx, floor); ctx.lineTo(hx, 560); ctx.quadraticCurveTo(hx + 20, 530, hx + 40, 560); ctx.lineTo(hx + 40, floor); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#4a3026'; ctx.beginPath(); ctx.arc(hx + 20, 546, 9, 0, TAU); ctx.fill(); ctx.fillStyle = rgba('#ffd9a0', .5 * I); ctx.beginPath(); ctx.arc(hx + 17, 543, 3, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(hx + 8 + i * 6, 572); ctx.lineTo(hx + 8 + i * 6, floor - 6); ctx.stroke(); }
}
function pillow(ctx, t, I, front) {
  const x0 = 612, x1 = 790, y0 = 662, y1 = 716;
  if (!front) {
    ctx.fillStyle = '#e9e1d2'; ctx.beginPath(); ctx.moveTo(x0, y1); ctx.bezierCurveTo(x0 - 8, y0 + 10, x0 + 10, y0 - 4, x0 + 50, y0 - 2); ctx.bezierCurveTo(x0 + 110, y0 + 2, x1 - 10, y0 - 2, x1, y0 + 14); ctx.bezierCurveTo(x1 + 10, y1 - 14, x1, y1, x1 - 20, y1 + 2); ctx.closePath(); ctx.fill();
    const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, rgba('#ffcf8a', .35 * I)); g.addColorStop(1, 'rgba(40,40,80,.3)'); ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(80,70,90,.4)'; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(x0 + 30, y0 + 8); ctx.quadraticCurveTo(x0 + 70, y0 + 20, x0 + 82, y0 + 4); ctx.stroke();
  } else {
    // the near bulge of the pillow in front of the back of the head
    ctx.fillStyle = '#ddd4c4'; ctx.beginPath(); ctx.moveTo(x0 + 4, y1 + 2); ctx.bezierCurveTo(x0 + 40, y1 - 14, x0 + 120, y1 - 16, x1 - 18, y1 + 2); ctx.closePath(); ctx.fill();
    const g = ctx.createLinearGradient(0, y1 - 16, 0, y1 + 2); g.addColorStop(0, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(30,30,60,.25)'); ctx.fillStyle = g; ctx.fill();
  }
}
// the head lies on the pillow, the face to the ceiling; local frame = art's upright head turned −90° (top of the skull to the left)
const PAT = { hx: 676, hy: 690, s: 1.32 };
function headPathP(g) {
  g.beginPath(); g.moveTo(-4.2, -7.5);
  g.bezierCurveTo(-8.6, -10, -9.3, -19, -7.3, -23.6); g.bezierCurveTo(-5.1, -28.3, 1.4, -30, 6.2, -28.4); g.bezierCurveTo(10, -26.9, 11.7, -23.2, 11.5, -19.9);
  g.quadraticCurveTo(12, -18.9, 11.2, -17.7); g.quadraticCurveTo(12.6, -15.3, 14.2, -12.8); g.quadraticCurveTo(14.8, -11.7, 13.4, -11.2); g.lineTo(12.2, -11.0);
  g.quadraticCurveTo(12.9, -10.2, 12.6, -9.3); g.quadraticCurveTo(12.0, -8.9, 12.3, -8.4); g.quadraticCurveTo(12.6, -7.6, 11.8, -6.9); g.quadraticCurveTo(10.9, -6.5, 11.4, -5.1);
  g.quadraticCurveTo(11.4, -3.7, 9.8, -3.3); g.quadraticCurveTo(6.8, -2.7, 4.4, -4.1); g.quadraticCurveTo(1.0, -5.6, -4.2, -7.5); g.closePath();
}
function patEyes(t, A) {
  // mostly resting; she opens her eyes toward the carer while the carer listens, blinks slowly
  const open = sm(lin(A.listened - .4, A.listened + .5, t)) * (1 - sm(lin(A.lamp0 + .6, A.lamp0 + 1.4, t))) * .85 + .1;
  const bl = blink(t * .8, 7);
  return clamp(open * (1 - bl));
}
function patient(ctx, t, A, I, b) {
  const { hx, hy, s } = PAT, skin = '#e3c3ab', hair = '#d8d3cc';
  const tilt = .07 * sm(lin(A.listened - .5, A.listened + .9, t)) * (1 - sm(lin(A.lamp0 + .8, A.lamp0 + 1.8, t))) + .012 * b;
  // shoulder + upper chest in a pale nightgown (under the quilt's edge)
  ctx.fillStyle = '#9fa9c4'; ctx.beginPath(); ctx.moveTo(hx + 18, hy + 4); ctx.bezierCurveTo(hx + 40, hy - 14 - b * 1.2, hx + 90, hy - 18 - b * 2.2, hx + 120, hy - 10 - b * 2); ctx.lineTo(hx + 126, hy + 26); ctx.lineTo(hx + 10, hy + 26); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba('#ffcf8a', .18 * I); ctx.beginPath(); ctx.moveTo(hx + 18, hy + 4); ctx.bezierCurveTo(hx + 40, hy - 14 - b * 1.2, hx + 70, hy - 17 - b * 2, hx + 86, hy - 16 - b * 2); ctx.lineTo(hx + 80, hy - 8); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(-Math.PI / 2 - tilt); ctx.scale(s, s);
  // neck into the gown
  ctx.fillStyle = '#d2ae96'; capsule(ctx, 0, 2, 5.4, 1.6, -6, 5);
  ctx.fillStyle = skin; headPathP(ctx); ctx.fill();
  // the lamp warms the brow and cheek (the lamp is above-left of her face: in the head frame that is toward −y, +x)
  ctx.save(); headPathP(ctx); ctx.clip();
  let g = ctx.createLinearGradient(-6, -28, 10, -6); g.addColorStop(0, rgba('#ffcf8a', .45 * I)); g.addColorStop(.6, rgba('#ffcf8a', .08)); g.addColorStop(1, 'rgba(40,30,60,.3)'); ctx.fillStyle = g; ctx.fillRect(-15, -32, 32, 32);
  ctx.fillStyle = 'rgba(160,80,70,.12)'; ctx.beginPath(); ctx.ellipse(7.6, -12, 3.2, 2.2, 0, 0, TAU); ctx.fill();
  ctx.restore();
  // ear, eye (open toward the carer or closed), brow, nostril, mouth, the lines of age
  ctx.fillStyle = '#d0aa92'; ctx.beginPath(); ctx.ellipse(.5, -14.4, 2.4, 3.9, .16, 0, TAU); ctx.fill();
  const op = patEyes(t, A), ex = 9, ey = -16.4;
  ctx.fillStyle = 'rgba(150,100,90,.45)'; ctx.beginPath(); ctx.ellipse(ex - .4, ey - 1.3, 2.6, 1.6, 0, 0, TAU); ctx.fill();
  if (op > .08) { ctx.save(); ctx.beginPath(); ctx.moveTo(ex - 1.7, ey); ctx.quadraticCurveTo(ex - .2, ey - 2.2 * op, ex + 1.3, ey); ctx.quadraticCurveTo(ex - .1, ey + 1.1 * op, ex - 1.7, ey); ctx.closePath(); ctx.fillStyle = '#efe6dc'; ctx.fill(); ctx.clip(); ctx.fillStyle = '#2a1e1c'; ctx.beginPath(); ctx.arc(ex + .6, ey - .1, 1.0, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.strokeStyle = '#7a5648'; ctx.lineWidth = .6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - 1.9, ey); ctx.quadraticCurveTo(ex - .2, ey - 2.3 * op - .1 + (1 - op) * 1.1, ex + 1.4, ey + .1); ctx.stroke();
  ctx.strokeStyle = '#bdb6ae'; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(ex - 2.6, ey - 2.6); ctx.quadraticCurveTo(ex - .2, ey - 3.7, ex + 2, ey - 3); ctx.stroke();
  ctx.strokeStyle = 'rgba(110,70,60,.75)'; ctx.lineWidth = .5; ctx.beginPath(); ctx.arc(12.1, -11.9, .55, -.4, 2.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12.1, -8.5); ctx.quadraticCurveTo(11.1, -8.3, 10.2, -8.6); ctx.stroke();
  ctx.strokeStyle = 'rgba(120,80,70,.35)'; ctx.lineWidth = .4; ctx.beginPath(); ctx.moveTo(11.6, -11.2); ctx.quadraticCurveTo(10.6, -10, 10.8, -8.9); ctx.moveTo(6.6, -15.8); ctx.lineTo(5.2, -15.3); ctx.moveTo(4.8, -9.8); ctx.quadraticCurveTo(6.6, -6.8, 9.2, -5.2); ctx.stroke();
  // thin white hair, spread a little on the pillow
  ctx.fillStyle = hair; ctx.beginPath(); ctx.moveTo(8.6, -26.4); ctx.bezierCurveTo(7.4, -30.6, 1.6, -31.8, -3.6, -30.8); ctx.bezierCurveTo(-9.6, -29.4, -12.4, -23.8, -11.6, -16.4); ctx.bezierCurveTo(-11.2, -12.0, -9.4, -9.4, -6.4, -8.2); ctx.lineTo(-3.3, -10.6); ctx.bezierCurveTo(-2.4, -13, -1.9, -16.6, -1.2, -18.4); ctx.quadraticCurveTo(1.6, -18.8, 2.9, -15.4); ctx.lineTo(3.8, -15.8); ctx.bezierCurveTo(4.0, -20.0, 5.0, -24.2, 8.6, -26.4); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,240,220,.5)'; ctx.lineWidth = .45; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-9 + i * 1.6, -11 - i * .6); ctx.quadraticCurveTo(-11 - i * .4, -20, -4 + i * 1.8, -29.5 + i * .2); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(216,211,204,.55)'; ctx.lineWidth = .4; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-11, -14 - i * 3); ctx.quadraticCurveTo(-14 - i * .5, -16 - i * 3, -15.5 - i * .3, -12 - i * 3.6); ctx.stroke(); }
  ctx.restore();
}
// the quilt over the body: the ridge (chest breathing, hips, knees, the feet), draping over the near edge; the near arm lies on it
function quiltShape(ctx, b) {
  const y = BED.top, n = BED.near + 70;
  ctx.beginPath(); ctx.moveTo(744, n);
  ctx.lineTo(744, y + 4 - b * 2.6);
  ctx.bezierCurveTo(770, y - 12 - b * 3.6, 836, y - 16 - b * 3.4, 880, y - 6 - b * 1.6);
  ctx.bezierCurveTo(920, y - 2, 950, y - 8, 1010, y - 10);
  ctx.bezierCurveTo(1060, y - 12, 1100, y - 2, 1190, y - 4);
  ctx.bezierCurveTo(1290, y - 6, 1370, y - 2, 1420, y - 8);
  ctx.bezierCurveTo(1440, y - 24, 1462, y - 26, 1476, y - 10);
  ctx.bezierCurveTo(1492, y - 2, 1512, y + 4, 1522, y + 16);
  ctx.lineTo(1528, n); ctx.closePath();
}
function quilt(ctx, t, A, I, b) {
  // the folded-back sheet at the chest, then the quilt
  ctx.save(); quiltShape(ctx, b); ctx.clip();
  ctx.drawImage(quiltTex(), 740, BED.top - 40, 800, 190);
  // form: the top surface catches the lamp from the left, the drape falls into shadow
  let g = ctx.createLinearGradient(0, BED.top - 30, 0, BED.near + 70); g.addColorStop(0, 'rgba(255,230,200,.1)'); g.addColorStop(.32, 'rgba(0,0,0,0)'); g.addColorStop(.42, 'rgba(10,8,24,.35)'); g.addColorStop(1, 'rgba(6,5,16,.62)');
  ctx.fillStyle = g; ctx.fillRect(740, BED.top - 40, 800, 200);
  g = ctx.createLinearGradient(740, 0, 1530, 0); g.addColorStop(0, rgba('#ffcf8a', .3 * I)); g.addColorStop(.45, rgba('#ffcf8a', .06 * I)); g.addColorStop(1, 'rgba(10,10,40,.3)'); ctx.fillStyle = g; ctx.fillRect(740, BED.top - 40, 800, 200);
  // folds of the drape
  ctx.strokeStyle = 'rgba(20,10,20,.38)'; ctx.lineWidth = 2;
  for (const [x, w] of [[812, 10], [905, 14], [1046, 8], [1180, 12], [1310, 9], [1440, 12]]) { ctx.beginPath(); ctx.moveTo(x, BED.near + 4); ctx.quadraticCurveTo(x + w * .6, BED.near + 36, x - w * .3, BED.near + 70); ctx.stroke(); }
  hatch(ctx, null, -1.2, 4, .2, { box: [740, BED.near + 10, 800, 70], col: '#000000', w: .8, seed: 9 });
  ctx.restore();
  // the sheet folded over the quilt's top edge at the chest
  ctx.fillStyle = '#ece5d8'; ctx.beginPath(); ctx.moveTo(742, BED.top + 6 - b * 2.4); ctx.bezierCurveTo(752, BED.top - 4 - b * 3, 770, BED.top - 6 - b * 3.4, 786, BED.top - 6 - b * 3.4); ctx.lineTo(796, BED.near + 70); ctx.lineTo(742, BED.near + 70); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba('#ffcf8a', .25 * I); ctx.fillRect(742, BED.top - 6, 20, 40);
  ctx.fillStyle = 'rgba(10,10,30,.3)'; ctx.fillRect(742, BED.near + 10, 54, 60);
  // the near arm on the quilt: sleeve from the shoulder, the forearm across, the hand resting near the edge (the carer's hand comes to it)
  const sh = [760, BED.top + 2 - b * 2.2], el = [810, BED.top + 14 - b * .8], hd = [860, BED.top + 12];
  ctx.fillStyle = '#a3adc6'; capsule(ctx, sh[0], sh[1], 8.4, el[0], el[1], 6.6); capsule(ctx, el[0], el[1], 6.4, hd[0] - 8, hd[1], 5.4);
  ctx.fillStyle = rgba('#ffcf8a', .2 * I); capsule(ctx, sh[0], sh[1] - 4, 4, el[0], el[1] - 4, 3);
  ctx.strokeStyle = 'rgba(40,40,70,.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(el[0] - 6, el[1] + 3); ctx.quadraticCurveTo(el[0] + 4, el[1] + 7, el[0] + 12, el[1] + 4); ctx.stroke();
  ctx.fillStyle = '#dcb8a2'; ctx.beginPath(); ctx.ellipse(hd[0], hd[1] + 1, 8.6, 5.4, .1, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(120,80,70,.5)'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(hd[0] + 2, hd[1] - 2); ctx.lineTo(hd[0] + 8, hd[1] - 1); ctx.moveTo(hd[0] + 2, hd[1] + 1); ctx.lineTo(hd[0] + 8.5, hd[1] + 2); ctx.stroke();
}

// ---- the carer: a woman on a wooden chair in front of the bed, facing the patient; she leans closer on "listened"
export function carerLean(t, A) { return .2 + .17 * smoother(lin(A.listened - .15, A.listened + 1.05, t)) - .03 * smoother(lin(A.lamp0 + .9, A.lamp0 + 2.2, t)); }
const CAR = { x: 1000, y: 776, s: 1.34, seed: 16 };
function carerPose(t, A) {
  const lean = carerLean(t, A);
  return { ...POSES.sit, lean, head: .16 + .12 * smoother(lin(A.listened - .1, A.listened + 1.1, t)), hair: 'bun', hip: [1.36, 1.46], kn: [1.48, 1.56], sh: [.62, .5], el: [.75, 1.05] };
}
function chair(ctx, front) {
  const x = CAR.x, y = CAR.y;
  if (!front) {
    // the back legs and the back rest (behind her, at the right since she faces left)
    ctx.fillStyle = '#2a1a16'; ctx.fillRect(x + 22, y - 150, 9, 222); ctx.fillRect(x + 2, y + 4, 8, 68);
    ctx.fillStyle = '#3a2620'; ctx.fillRect(x + 20, y - 132, 13, 8); ctx.fillRect(x + 20, y - 96, 13, 8); ctx.fillRect(x + 20, y - 60, 13, 8);
    ctx.fillStyle = rgba('#ffcf8a', .12); ctx.fillRect(x + 22, y - 150, 2, 222);
  } else {
    // seat edge + the front legs
    ctx.fillStyle = '#4a3026'; ctx.fillRect(x - 58, y + 4, 92, 10); ctx.fillStyle = rgba('#ffcf8a', .22); ctx.fillRect(x - 58, y + 4, 92, 2);
    ctx.fillStyle = '#2e1e19'; ctx.fillRect(x - 54, y + 14, 8, 62); ctx.fillRect(x + 20, y + 14, 8, 62);
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(x - 46, y + 44, 66, 4);
  }
}
function carer(ctx, t, A, cam, I) {
  const k = L(ctx, cam, ZL.carer); if (!k) return;
  const P = carerPose(t, A), o = { t, seed: CAR.seed, flip: true, dress: { coat: '#3e4c63', pants: '#22202e', shoes: '#120f14', skin: '#d6a98a', hair: '#4a3328' },
    light: { x: LAMP.x, y: LAMP.y, col: '#ffcf8a', a: .62 * I }, rim: '#ffd6a0', rimSide: -1, shadow: false };
  // the front hand reaches the patient's hand on the quilt (from "listened" on); before, it rests on her knee
  const target = [866, BED.top + 6], reach = smoother(lin(A.listened + .1, A.listened + 1.3, t)) * (1 - smoother(lin(A.lamp0 + 1.0, A.lamp0 + 2.2, t)));
  if (reach > 0) {
    // reachArm works in screen px with the figure's own transform: compute it in base px (layer transform applied by the canvas)
    const r = reachArm(CAR.x, CAR.y, CAR.s, P, 0, true, { t, seed: CAR.seed }, target, 1);
    P.sh = [mix(P.sh[0], r.sh, reach), P.sh[1]]; P.el = [mix(P.el[0], r.el, reach), P.el[1]]; P.lock = [true, false];
  }
  // floor shadow under the chair
  ctx.fillStyle = 'rgba(3,3,10,.5)'; ctx.beginPath(); ctx.ellipse(CAR.x - 12, CAR.y + 76, 90, 10, 0, 0, TAU); ctx.fill();
  chair(ctx, false);
  figure(ctx, CAR.x, CAR.y, CAR.s, P, o);
  chair(ctx, true);
}
// her shadow on the wall: a soft dark silhouette (head, shoulders, the leaning back), drawn in shadow units
function shadowCarer(ctx, lean) {
  ctx.fillStyle = '#05050f';
  ctx.save(); ctx.rotate(-lean * .9);
  ctx.beginPath(); ctx.moveTo(-34, 60); ctx.bezierCurveTo(-40, 10, -30, -40, -18, -64); ctx.bezierCurveTo(-10, -76, 14, -78, 22, -66); ctx.bezierCurveTo(32, -40, 36, 10, 30, 60); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-6, -92, 14, 16, -.2, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(8, -100, 7, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---- dust in the lamp light (a few warm specks drifting, the room breathes)
const MOTES = (() => { const r = prng(1615), m = []; for (let i = 0; i < 46; i++) m.push([r() * 520 + 220, r() * 420 + 260, r() * TAU, .3 + r() * .7, .6 + r() * 1.4]); return m; })();
function motes(ctx, t, cam, I) {
  const k = L(ctx, cam, ZL.motes); if (!k || k > 5) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, ph, sp, s] of MOTES) {
    const X = x + Math.sin(t * .23 * sp + ph) * 24 + Math.sin(t * .061 * sp + ph * 2.1) * 30, Y = y + Math.cos(t * .17 * sp + ph * 1.3) * 18 + Math.sin(t * .047 * sp + ph * .7) * 34;
    const d = Math.hypot(X - LAMP.x, Y - LAMP.y), a = clamp(1 - d / 380) * .55 * I * (.6 + .4 * Math.sin(t * 1.3 + ph));
    if (a <= .01) continue; ctx.fillStyle = rgba('#ffe2b0', a); ctx.beginPath(); ctx.arc(X, Y, s, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ======================================================================= the label (screen space, above the subtitle zone)
export function roomLabel(ctx, t, A) {
  const t0 = A.bronnie + .15, t1 = A.lamp0 - .1;
  if (t < t0 || t > t1 + .7) return;
  const x = 118, y = 806, inn = (k) => eoX(lin(t0 + .08 * k, t0 + .65 + .08 * k, t)), out = (k) => eiX(lin(t1 + .05 * k, t1 + .45 + .05 * k, t));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const bar = eoX(lin(t0, t0 + .55, t)) * (1 - eiX(lin(t1 + .1, t1 + .5, t)));
  ctx.fillStyle = AMB; ctx.fillRect(x, y - 40, 3, 112 * bar);
  ctx.beginPath(); ctx.rect(x + 14, y - 52, 760, 142); ctx.clip();
  const row = (s, yy, k, o) => { const dy = (1 - inn(k)) * 46 + out(k) * 60; text(ctx, s, x + 21, yy + dy, o); };
  row('Bronnie Ware', y, 0, { size: 46, font: 'Instrument Serif', weight: 400, color: CREAM });
  row('PALLIATIVE CARER', y + 32, 1, { size: 17, weight: 600, color: rgba(CREAM, .88), spacing: 4 });
  row('THE TOP FIVE REGRETS OF THE DYING  (2011)', y + 58, 2, { size: 16, weight: 600, color: rgba('#c9c3dc', .85), spacing: 3 });
  ctx.restore();
}
