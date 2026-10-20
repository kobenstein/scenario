// c12 · 12.02–12.04 a roadside in rural western Kenya (red earth, a duka with a rolling shutter, a tailor at a treadle machine,
// a bicycle repair stand), then the tailor's thread, the circle, the 24-hour dial. Owner: c12.
// NATIVE units: the roadside frame at camera scale 1 is 1920 × 1080 with its centre at (960, 540); the world extends far above
// (the sky where the dial hangs and the night falls) and around (the inset vignette on the map shows a circle of radius 1101).
//   roadGround(ctx, t, st)    the ground world (far land, road, buildings, people, machines) under the caller's transform;
//                             draws through an offscreen layer so the time of day tints only the ground. st: { hour, shutter (bar y),
//                             womanArms, k (camera scale, for level of detail), view: [x0, y0, x1, y1] visible native rect }
//   roadSky(ctx, t, st)       the sky (time of day), engraved sky lines, clouds, stars at night
//   SPOOL                     the thread spool on the machine (native), the thread's source
//   prewarmRoad()             build the cached layers (call before ready())
import { W, H, rgba, clamp, lin, mix, prng, sm, eout, eio, canvas } from '../engine.mjs';
import { figure, reachArm, POSES } from './figure.mjs';
import { scribble } from './paper.mjs';
import { once, memo, glowSpr, glowAt, mixC, TAU } from './v2_c12_kit.mjs';

const HZ = 590, FLOOR = 800, RES = 1.5;
const HS = .62, HP = { x: 1034, y: 700 };   // the sewing head is drawn at HS scale about the needle foot HP (a real head is ~45 cm long)
const SPOOL0 = { x: 1101, y: 603 };
const headPt = (x, y) => ({ x: HP.x + (x - HP.x) * HS, y: HP.y + (y - HP.y) * HS });
export const SPOOL = headPt(SPOOL0.x, SPOOL0.y);
const SUN = { x: 2300, y: -400 };          // the sun: high, to the right (late morning); light comes from +x
const INKD = '#2a1a10';

// ---------------------------------------------------------------- helpers
function layerImg(key, x0, y0, x1, y1, res, draw) {
  const img = once(key, () => { const [c, g] = canvas(Math.ceil((x1 - x0) * res), Math.ceil((y1 - y0) * res)); g.scale(res, res); g.translate(-x0, -y0); draw(g); return c; });
  return { img, x0, y0, w: x1 - x0, h: y1 - y0 };
}
const put = (ctx, L) => ctx.drawImage(L.img, L.x0, L.y0, L.w, L.h);
function engr(g, x0, y0, x1, y1, ang, gap, col, a, w = 1, seed = 1) {   // straight engraving lines inside the rect (and the current clip)
  const r = prng(seed), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + 4, ca = Math.cos(ang), sa = Math.sin(ang);
  g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip();
  g.strokeStyle = rgba(col, a); g.lineWidth = w; g.beginPath();
  for (let o = -R; o <= R; o += gap * (.85 + r() * .3)) { const j = (r() - .5) * 1.2; g.moveTo(cx - ca * R - sa * (o + j), cy - sa * R + ca * (o + j)); g.lineTo(cx + ca * R - sa * (o + j), cy + sa * R + ca * (o + j)); }
  g.stroke(); g.restore();
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }

// ---------------------------------------------------------------- the far land (hills, acacias, a few distant huts)
function farLayer() {
  return layerImg('road_far', -260, 360, 2300, 830, RES, (g) => {
    const r = prng(31);
    // two hill bands in haze (violet-blue far, olive near)
    for (const [base, amp, col, k] of [[HZ - 34, 46, '#b9a6b8', 0], [HZ - 6, 26, '#9a8a78', 1]]) {
      g.fillStyle = col; g.beginPath(); g.moveTo(-260, HZ + 40);
      for (let x = -260; x <= 2300; x += 20) g.lineTo(x, base - amp * (.5 + .5 * Math.sin(x * .0035 + k * 2.1) * Math.sin(x * .0011 + 1.3 + k)));
      g.lineTo(2300, HZ + 40); g.closePath(); g.fill();
      g.save(); g.clip(); engr(g, -260, base - amp, 2300, HZ + 40, 0, 5 + k * 2, '#5a4a5a', .16 + k * .06, .9, 3 + k); g.restore();
    }
    // the plain: dry grass from the horizon to the road's far edge
    const pg = g.createLinearGradient(0, HZ, 0, 830); pg.addColorStop(0, '#c9a46e'); pg.addColorStop(1, '#b8844e'); g.fillStyle = pg; g.fillRect(-260, HZ - 2, 2560, 840 - HZ);
    g.save(); g.beginPath(); g.rect(-260, HZ - 2, 2560, 840 - HZ); g.clip(); engr(g, -260, HZ, 2300, 830, -.02, 4.2, '#6a4a2a', .2, .8, 5); g.restore();
    // grass tufts
    g.strokeStyle = rgba('#5a4220', .45); g.lineWidth = 1.1;
    for (let i = 0; i < 380; i++) { const x = -260 + r() * 2560, y = HZ + 6 + Math.pow(r(), 1.6) * 220, h = 3 + (y - HZ) * .05 + r() * 4; g.beginPath(); for (let k = -2; k <= 2; k++) { g.moveTo(x + k * 1.3, y); g.lineTo(x + k * 2.2 + (r() - .5) * 2, y - h); } g.stroke(); }
    // acacias (flat umbrella crowns), the big one right, small ones on the horizon
    const acacia = (x, y, s) => {
      g.fillStyle = '#4a3a2c'; g.beginPath(); g.moveTo(x - 4 * s, y); g.quadraticCurveTo(x - 2 * s, y - 60 * s, x - 26 * s, y - 92 * s); g.lineTo(x - 20 * s, y - 95 * s); g.quadraticCurveTo(x + 2 * s, y - 70 * s, x + 4 * s, y - 64 * s); g.quadraticCurveTo(x + 10 * s, y - 80 * s, x + 30 * s, y - 96 * s); g.lineTo(x + 34 * s, y - 92 * s); g.quadraticCurveTo(x + 10 * s, y - 60 * s, x + 6 * s, y); g.closePath(); g.fill();
      for (const [cx, cy, rw, rh, col] of [[0, -104, 96, 18, '#4f5a2e'], [-34, -98, 50, 12, '#5a6634'], [36, -100, 54, 13, '#56622f'], [0, -112, 70, 10, '#66733a']]) { g.fillStyle = col; g.beginPath(); g.ellipse(x + cx * s, y + cy * s, rw * s, rh * s, 0, 0, TAU); g.fill(); }
      g.save(); g.beginPath(); g.ellipse(x, y - 104 * s, 96 * s, 18 * s, 0, 0, TAU); g.clip(); engr(g, x - 100 * s, y - 124 * s, x + 100 * s, y - 86 * s, .25, 3.2 * s, '#1f2410', .35, .8 * s, 9); g.restore();
    };
    acacia(1720, HZ + 46, 2.2); acacia(-120, HZ + 8, .9); acacia(1980, HZ + 2, .7); acacia(460, HZ - 2, .5);
    // distant huts (round, thatched) and a footpath to the horizon on the right
    for (const [x, y, s] of [[1460, HZ + 10, .55], [1530, HZ + 6, .42], [80, HZ + 12, .5]]) {
      g.fillStyle = '#a86a40'; g.fillRect(x - 22 * s, y - 26 * s, 44 * s, 26 * s);
      g.fillStyle = '#7a5a34'; g.beginPath(); g.moveTo(x - 30 * s, y - 24 * s); g.lineTo(x, y - 56 * s); g.lineTo(x + 30 * s, y - 24 * s); g.closePath(); g.fill();
      g.fillStyle = '#3a2416'; g.fillRect(x - 5 * s, y - 16 * s, 10 * s, 16 * s);
    }
    g.fillStyle = '#d8a56c'; g.beginPath(); g.moveTo(1290, 830); g.quadraticCurveTo(1420, 700, 1560, HZ + 4); g.lineTo(1580, HZ + 4); g.quadraticCurveTo(1470, 700, 1420, 830); g.closePath(); g.fill();
  });
}
// ---------------------------------------------------------------- a mango tree behind the shop (shade, and it fills the sky's left half)
function treeLayer() {
  return layerImg('road_tree', -260, 90, 720, 800, RES, (g) => {
    const r = prng(71);
    // trunk: visible left of the shop, curving up behind the roof
    g.fillStyle = '#3a2a1c'; g.beginPath(); g.moveTo(40, 800); g.bezierCurveTo(52, 640, 70, 520, 160, 400); g.lineTo(196, 410); g.bezierCurveTo(118, 520, 96, 650, 92, 800); g.closePath(); g.fill();
    g.save(); g.clip(); engr(g, 30, 380, 210, 800, 1.35, 4, '#120a06', .45, 1, 72); g.restore();
    g.strokeStyle = '#3a2a1c'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(150, 420); g.quadraticCurveTo(120, 340, 40, 300); g.moveTo(170, 410); g.quadraticCurveTo(280, 350, 380, 330); g.stroke();
    // the crown: overlapping leaf masses, shadowed below-left, lit above-right (the sun is high right)
    const blobs = []; for (let i = 0; i < 46; i++) { const a = r() * TAU, d = Math.sqrt(r()); blobs.push([250 + Math.cos(a) * d * 330, 290 + Math.sin(a) * d * 130 - (1 - d) * 20, 44 + r() * 46]); }
    blobs.sort((p, q) => p[1] - q[1]);
    for (const [x, y, R] of blobs) {
      const gr = g.createRadialGradient(x + R * .35, y - R * .45, R * .1, x, y, R * 1.05); gr.addColorStop(0, '#6e8034'); gr.addColorStop(.45, '#4a5c26'); gr.addColorStop(1, '#26341a');
      g.fillStyle = gr; g.beginPath();
      for (let k = 0; k <= 48; k++) { const q = k / 48 * TAU, rr2 = R * (.9 + .07 * Math.sin(q * 5 + x) + .04 * Math.sin(q * 13 + y)); g.lineTo(x + Math.cos(q) * rr2, y + Math.sin(q) * rr2 * .8); }
      g.closePath(); g.fill();
      g.save(); g.clip(); engr(g, x - R, y - R, x + R, y + R, -.5, 3.6, '#101a08', .28, .8, (x * 7 + y) | 0); g.restore();
    }
    // leaf flicks along every mass's rim (pointed mango leaves): they give the crown a leafy edge; lit ones on the sunny side
    for (const [x, y, R] of blobs) for (let i = 0; i < 16; i++) {
      const a = r() * TAU, d = .82 + r() * .2, lx = x + Math.cos(a) * R * d, ly = y + Math.sin(a) * R * d * .8, L = 8 + r() * 8, ang = a + (r() - .5) * 1.2;
      const lit = Math.cos(a + .8);
      g.fillStyle = lit > .35 ? '#7a8c3a' : lit < -.35 ? '#223018' : '#46582a'; g.save(); g.translate(lx, ly); g.rotate(ang); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(L * .5, -L * .22, L, 0); g.quadraticCurveTo(L * .5, L * .22, 0, 0); g.fill(); g.restore();
    }
  });
}
// ---------------------------------------------------------------- the road (red earth)
function roadLayer() {
  return layerImg('road_road', -260, 790, 2300, 1720, 1.25, (g) => {
    const r = prng(41);
    const rg = g.createLinearGradient(0, 790, 0, 1720); rg.addColorStop(0, '#c07a48'); rg.addColorStop(.25, '#c9763c'); rg.addColorStop(1, '#9a5226'); g.fillStyle = rg; g.fillRect(-260, 790, 2560, 930);
    // the far edge: a grass verge
    g.fillStyle = '#a8864e'; g.beginPath(); g.moveTo(-260, 790); for (let x = -260; x <= 2300; x += 30) g.lineTo(x, 806 + Math.sin(x * .03) * 3 + r() * 3); g.lineTo(2300, 790); g.closePath(); g.fill();
    // ruts (two pairs of wheel tracks, slightly curving), engraved
    for (const [y0, amp] of [[880, 6], [935, 8], [1060, 10], [1150, 12]]) { g.strokeStyle = rgba('#6a3416', .35); g.lineWidth = 7 + (y0 - 800) * .02; g.beginPath(); for (let x = -260; x <= 2300; x += 20) { const y = y0 + Math.sin(x * .002 + y0) * amp; x === -260 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); g.strokeStyle = rgba('#e6a46c', .25); g.lineWidth = 2; g.stroke(); }
    // engraving of the earth: short horizontal strokes, denser near
    g.strokeStyle = rgba('#5a2a10', .22); g.lineWidth = 1;
    g.beginPath(); for (let i = 0; i < 2600; i++) { const y = 800 + Math.pow(r(), .8) * 920, x = -260 + r() * 2560, l = 6 + (y - 800) * .05 + r() * 10; g.moveTo(x, y); g.lineTo(x + l, y + (r() - .5)); } g.stroke();
    // pebbles
    for (let i = 0; i < 260; i++) { const y = 815 + r() * 900, x = -260 + r() * 2560, s = 1.5 + (y - 800) * .008 + r() * 2; g.fillStyle = rgba('#5a3018', .5); g.beginPath(); g.ellipse(x + 1, y + 1, s * 1.3, s * .8, 0, 0, TAU); g.fill(); g.fillStyle = rgba('#e8b888', .6); g.beginPath(); g.ellipse(x, y, s * 1.2, s * .7, 0, 0, TAU); g.fill(); }
    // tufts on the verges
    g.strokeStyle = rgba('#4a5a24', .7); g.lineWidth = 1.6;
    for (let i = 0; i < 90; i++) { const x = -260 + r() * 2560, y = 806 + r() * 14, h = 8 + r() * 12; g.beginPath(); for (let k = -2; k <= 2; k++) { g.moveTo(x + k * 2, y); g.lineTo(x + k * 3.5 + (r() - .5) * 3, y - h); } g.stroke(); }
  });
}
// ---------------------------------------------------------------- the buildings (duka + tailor's kiosk), the shop interior
const SHOP = { x0: 160, x1: 880, top: 470, op: { x0: 300, x1: 700, y0: 518, y1: FLOOR }, drum: { y0: 490, y1: 520 } };
const KIOSK = { x0: 880, x1: 1270 };
function buildLayer() {
  return layerImg('road_bld', 90, 400, 1320, 812, RES, (g) => {
    const r = prng(51);
    // --- shop walls: cream above, teal below; plaster texture and engraving
    g.fillStyle = '#ecdcb8'; g.fillRect(SHOP.x0, SHOP.top, SHOP.x1 - SHOP.x0, FLOOR - SHOP.top);
    g.fillStyle = '#2f7a70'; g.fillRect(SHOP.x0, 655, SHOP.x1 - SHOP.x0, FLOOR - 655);
    g.fillStyle = '#245f57'; g.fillRect(SHOP.x0, 651, SHOP.x1 - SHOP.x0, 6);
    g.save(); g.beginPath(); g.rect(SHOP.x0, SHOP.top, SHOP.x1 - SHOP.x0, FLOOR - SHOP.top); g.clip();
    for (let i = 0; i < 70; i++) { const x = SHOP.x0 + r() * 720, y = SHOP.top + r() * 330, R = 8 + r() * 40, gr = g.createRadialGradient(x, y, 0, x, y, R); gr.addColorStop(0, rgba(r() < .5 ? '#8a6a4a' : '#ffffff', .08)); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - R, y - R, 2 * R, 2 * R); }
    engr(g, SHOP.x0, SHOP.top, SHOP.x1, FLOOR, -.9, 7, '#3a2a1a', .07, .8, 7);
    // rain streaks under the eaves
    g.strokeStyle = rgba('#6a5034', .12); g.lineWidth = 2; for (let i = 0; i < 40; i++) { const x = SHOP.x0 + r() * 720; g.beginPath(); g.moveTo(x, SHOP.top); g.lineTo(x + (r() - .5) * 4, SHOP.top + 30 + r() * 90); g.stroke(); }
    g.restore();
    // --- the opening: the shop inside (dim, warm), shelves of goods, the counter
    const O = SHOP.op;
    g.fillStyle = '#3b2a1e'; g.fillRect(O.x0, O.y0, O.x1 - O.x0, O.y1 - O.y0);
    const ig = g.createRadialGradient(500, 560, 10, 500, 600, 330); ig.addColorStop(0, 'rgba(255,214,150,.22)'); ig.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = ig; g.fillRect(O.x0, O.y0, 400, 282);
    for (const y of [590, 660, 728]) { g.fillStyle = '#7a5032'; g.fillRect(O.x0 + 6, y, 388, 8); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(O.x0 + 6, y + 8, 388, 5); }
    // top shelf: a red crate of bottles, tins with coloured bands, bars of soap
    g.fillStyle = '#b8322a'; g.fillRect(312, 560, 104, 30); g.fillStyle = '#8a2018'; g.fillRect(312, 572, 104, 4);
    for (let i = 0; i < 8; i++) { const x = 318 + i * 12.5; g.fillStyle = i % 2 ? '#3a5a2a' : '#5a3418'; rr(g, x, 532, 9, 30, 3); g.fill(); g.fillRect(x + 2.5, 524, 4, 9); g.fillStyle = '#d8d0c0'; g.fillRect(x + 2, 522, 5, 3); }
    for (let i = 0; i < 6; i++) { const x = 432 + i * 20; for (let j = 0; j < 2; j++) { const y = 562 - j * 26; g.fillStyle = '#b8b0a0'; g.fillRect(x, y, 17, 26); g.fillStyle = ['#c43a2a', '#e8b030', '#2a5a9a'][(i + j) % 3]; g.fillRect(x, y + 7, 17, 11); g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x + 2, y + 1, 3, 24); } }
    for (let i = 0; i < 5; i++) { g.fillStyle = i % 2 ? '#2a7aa8' : '#3a9a5a'; rr(g, 568 + i * 24, 570, 21, 20, 3); g.fill(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(570 + i * 24, 572, 17, 3); }
    // middle shelf: red tea boxes, yellow oil bottles, match boxes
    for (let i = 0; i < 5; i++) { g.fillStyle = '#b03028'; g.fillRect(314 + i * 22, 622, 19, 38); g.fillStyle = '#f0d8a0'; g.fillRect(317 + i * 22, 632, 13, 8); }
    for (let i = 0; i < 6; i++) { const x = 440 + i * 19; g.fillStyle = '#e8c048'; rr(g, x, 618, 15, 42, 4); g.fill(); g.fillStyle = '#b88a20'; g.fillRect(x + 4, 610, 7, 9); g.fillStyle = '#2a6a3a'; g.fillRect(x, 634, 15, 10); }
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { g.fillStyle = j % 2 ? '#3a5aa8' : '#d8b048'; g.fillRect(570 + i * 28, 648 - j * 10, 25, 9); }
    // lower shelf: maize flour sacks (white, a coloured band, scribble print), sugar packets
    for (let i = 0; i < 3; i++) { const x = 312 + i * 40; g.fillStyle = '#efe8da'; g.beginPath(); g.moveTo(x, 728); g.lineTo(x + 2, 686); g.quadraticCurveTo(x + 18, 678, x + 34, 686); g.lineTo(x + 36, 728); g.closePath(); g.fill(); g.fillStyle = '#2a7a3a'; g.fillRect(x + 4, 704, 28, 7); scribble(g, x + 6, 698, 22, 4, { seed: i + 3, ink: '#c43a2a', lw: 1.2 }); }
    for (let i = 0; i < 7; i++) { g.fillStyle = '#f4f0e6'; g.fillRect(440 + i * 17, 700, 14, 28); g.fillStyle = '#2a4a9a'; g.fillRect(440 + i * 17, 708, 14, 6); }
    // hanging sachet strips and a bunch of bananas
    for (const x of [338, 384, 652, 680]) for (let k = 0; k < 7; k++) { g.fillStyle = ['#e04a2a', '#e8c030', '#2a8ad8', '#ffffff', '#3aa85a'][(k + x) % 5]; g.fillRect(x, 522 + k * 9, 14, 8); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x, 529 + k * 9, 14, 1); }
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(520, 518); g.lineTo(520, 530); g.stroke();
    for (let k = 0; k < 9; k++) { const a = -.9 + k * .22; g.fillStyle = k % 2 ? '#d8c03a' : '#c8b030'; g.save(); g.translate(520, 534); g.rotate(a); rr(g, -4, 0, 8, 34, 4); g.fill(); g.restore(); }
    // the counter (wooden front), a red pan scale, a glass jar of sweets
    g.fillStyle = '#6a4228'; g.fillRect(O.x0 + 4, 742, 392, 58); engr(g, O.x0 + 4, 742, O.x1 - 4, 800, Math.PI / 2, 9, '#2a160a', .4, 1.4, 11);
    g.fillStyle = '#8a5a34'; g.fillRect(O.x0, 736, 400, 8);
    g.fillStyle = '#c43a2a'; g.fillRect(598, 712, 34, 24); g.beginPath(); g.ellipse(615, 708, 26, 6, 0, 0, TAU); g.fill(); g.fillStyle = '#e8e0d0'; g.beginPath(); g.arc(615, 724, 7, 0, TAU); g.fill();
    g.fillStyle = 'rgba(220,235,240,.5)'; rr(g, 392, 700, 34, 36, 6); g.fill(); for (let k = 0; k < 10; k++) { g.fillStyle = ['#e04a6a', '#f0c030', '#3ab0e0'][k % 3]; g.beginPath(); g.arc(398 + (k % 4) * 7, 728 - Math.floor(k / 4) * 7, 3, 0, TAU); g.fill(); }
    // inner shadow of the opening (depth)
    const sg = g.createLinearGradient(O.x0, 0, O.x0 + 40, 0); sg.addColorStop(0, 'rgba(10,6,4,.6)'); sg.addColorStop(1, 'rgba(10,6,4,0)'); g.fillStyle = sg; g.fillRect(O.x0, O.y0, 40, 282);
    // the frame of the opening (steel angle), the shutter guides
    g.fillStyle = '#4a5450'; g.fillRect(O.x0 - 8, O.y0, 8, O.y1 - O.y0); g.fillRect(O.x1, O.y0, 8, O.y1 - O.y0);
    // --- right of the opening: a barred window, yellow jerrycans, a red crate
    g.fillStyle = '#2a2018'; g.fillRect(748, 560, 96, 96); g.fillStyle = 'rgba(255,214,150,.12)'; g.fillRect(752, 564, 88, 88);
    g.fillStyle = '#5a6460'; for (let k = 0; k < 6; k++) g.fillRect(752 + k * 17, 560, 3, 96); g.fillRect(748, 606, 96, 3);
    g.strokeStyle = '#d8c8a0'; g.lineWidth = 4; g.strokeRect(746, 558, 100, 100);
    const can = (x, y, s) => { g.fillStyle = '#e8b82a'; rr(g, x, y - 46 * s, 34 * s, 46 * s, 4 * s); g.fill(); g.fillStyle = '#c8961a'; g.fillRect(x + 4 * s, y - 52 * s, 9 * s, 7 * s); g.fillStyle = '#b8861a'; g.fillRect(x + 20 * s, y - 50 * s, 10 * s, 5 * s); g.strokeStyle = 'rgba(120,80,10,.6)'; g.lineWidth = 1.2; g.strokeRect(x + 3 * s, y - 40 * s, 28 * s, 30 * s); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 3 * s, y - 44 * s, 4 * s, 40 * s); };
    can(740, 800, 1); can(776, 800, 1); can(812, 800, 1); can(756, 754, 1); can(794, 754, 1);
    g.fillStyle = '#c4322a'; g.fillRect(846, 766, 30, 34); for (let k = 0; k < 3; k++) { g.fillStyle = '#4a2a14'; rr(g, 849 + k * 9, 748, 7, 22, 2); g.fill(); }
    // --- left: a bench with a sack
    g.fillStyle = '#6a4a2c'; g.fillRect(176, 738, 112, 9); g.fillRect(182, 747, 6, 53); g.fillRect(276, 747, 6, 53);
    g.fillStyle = '#efe6d4'; g.beginPath(); g.moveTo(196, 738); g.quadraticCurveTo(190, 700, 214, 692); g.lineTo(254, 692); g.quadraticCurveTo(272, 704, 266, 738); g.closePath(); g.fill(); g.fillStyle = '#3a6ab0'; g.fillRect(200, 712, 62, 7);
    // --- the tailor's kiosk: wooden planks, a washing line of finished garments, a dress form
    g.fillStyle = '#7a5236'; g.fillRect(KIOSK.x0, 476, KIOSK.x1 - KIOSK.x0, FLOOR - 476);
    for (let x = KIOSK.x0; x < KIOSK.x1; x += 26 + r() * 6) { g.fillStyle = 'rgba(30,16,8,.55)'; g.fillRect(x, 476, 2.5, FLOOR - 476); g.fillStyle = 'rgba(255,220,170,.08)'; g.fillRect(x + 3, 476, 5, FLOOR - 476); }
    engr(g, KIOSK.x0, 476, KIOSK.x1, FLOOR, Math.PI / 2 + .02, 4, '#2a160a', .18, .8, 13);
    const sh = g.createLinearGradient(0, 476, 0, 560); sh.addColorStop(0, 'rgba(10,6,4,.45)'); sh.addColorStop(1, 'rgba(10,6,4,0)'); g.fillStyle = sh; g.fillRect(KIOSK.x0, 476, KIOSK.x1 - KIOSK.x0, 84);
    g.strokeStyle = '#2a1a10'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(KIOSK.x0 + 10, 548); g.quadraticCurveTo(1075, 560, KIOSK.x1 - 10, 548); g.stroke();
    const garment = (x, col, kind, pat) => {
      const y = 552 + Math.sin((x - 880) / 390 * Math.PI) * 8; g.fillStyle = col; g.beginPath();
      if (kind === 'shirt') { g.moveTo(x - 18, y); g.lineTo(x - 34, y + 22); g.lineTo(x - 26, y + 30); g.lineTo(x - 18, y + 22); g.lineTo(x - 18, y + 70); g.lineTo(x + 18, y + 70); g.lineTo(x + 18, y + 22); g.lineTo(x + 26, y + 30); g.lineTo(x + 34, y + 22); g.lineTo(x + 18, y); g.closePath(); }
      else { g.moveTo(x - 14, y); g.lineTo(x - 18, y + 26); g.lineTo(x - 34, y + 96); g.lineTo(x + 34, y + 96); g.lineTo(x + 18, y + 26); g.lineTo(x + 14, y); g.closePath(); }
      g.fill(); g.save(); g.clip(); for (let k = 0; k < 14; k++) { g.fillStyle = pat; g.beginPath(); g.arc(x - 30 + (k % 4) * 20, y + 10 + Math.floor(k / 4) * 22, 5, 0, TAU); g.fill(); } engr(g, x - 40, y, x + 40, y + 100, Math.PI / 2, 5, '#000000', .12, .8, x); g.restore();
      g.fillStyle = '#d8c8a0'; g.fillRect(x - 8, y - 3, 4, 7); g.fillRect(x + 4, y - 3, 4, 7);
    };
    garment(930, '#d8742a', 'shirt', '#2a4a8a'); garment(1010, '#2a7a8a', 'dress', '#f0c040'); garment(1100, '#efe6d2', 'shirt', '#c43a2a'); garment(1180, '#8a2a5a', 'dress', '#f6d070');
    // dress form with a half-finished dress
    g.fillStyle = '#2a1a10'; g.fillRect(1238, 690, 5, 104); g.fillRect(1222, 794, 37, 5);
    g.fillStyle = '#c8b090'; g.beginPath(); g.moveTo(1222, 610); g.quadraticCurveTo(1240, 596, 1258, 610); g.lineTo(1262, 652); g.quadraticCurveTo(1240, 660, 1218, 652); g.closePath(); g.fill();
    g.fillStyle = '#e0642a'; g.beginPath(); g.moveTo(1220, 628); g.lineTo(1260, 628); g.lineTo(1270, 700); g.quadraticCurveTo(1240, 708, 1210, 700); g.closePath(); g.fill();
    g.save(); g.clip(); for (let k = 0; k < 9; k++) { g.fillStyle = '#1f4a8a'; g.beginPath(); g.arc(1216 + (k % 3) * 22, 640 + Math.floor(k / 3) * 22, 5, 0, TAU); g.fill(); } g.restore();
    g.strokeStyle = '#efe6d2'; g.lineWidth = 1; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(1214, 690); g.lineTo(1268, 690); g.stroke(); g.setLineDash([]);
    // --- the awning: posts, corrugated roof edge, the painted fascia (scribbled lettering, no readable name)
    for (const x of [134, 876, 1268]) { g.fillStyle = '#5a3a20'; g.fillRect(x - 6, 470, 12, FLOOR - 470); g.fillStyle = 'rgba(255,220,170,.25)'; g.fillRect(x + 2, 470, 3, FLOOR - 470); }
    g.fillStyle = '#8a8a86'; g.beginPath(); g.moveTo(110, 452); g.lineTo(130, 424); g.lineTo(1290, 424); g.lineTo(1300, 452); g.closePath(); g.fill();
    for (let x = 116; x < 1300; x += 12) { g.fillStyle = 'rgba(40,40,40,.35)'; g.fillRect(x, 426, 3, 26); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 4, 426, 3, 26); }
    for (let i = 0; i < 18; i++) { const x = 140 + r() * 1140; g.fillStyle = rgba('#8a4a20', .3 + r() * .3); g.fillRect(x, 430 + r() * 12, 12 + r() * 30, 3 + r() * 8); }
    g.fillStyle = '#e3b347'; g.fillRect(150, 452, 730, 26); g.fillStyle = '#2f6aa0'; g.fillRect(880, 452, 410, 26);
    g.fillStyle = '#b8322a'; g.fillRect(150, 452, 730, 3); g.fillRect(150, 475, 730, 3);
    scribble(g, 230, 470, 260, 11, { seed: 12, ink: '#b8322a', lw: 4 }); scribble(g, 560, 470, 200, 11, { seed: 14, ink: '#1f3a7a', lw: 4 });
    g.fillStyle = '#b8322a'; g.beginPath(); g.ellipse(520, 465, 11, 9, 0, 0, TAU); g.fill();   // a painted dot between the words
    scribble(g, 960, 470, 230, 10, { seed: 17, ink: '#f3efe2', lw: 3.6 });
    // a little painted needle-and-thread sign on the kiosk fascia (reads "tailor" without words)
    g.strokeStyle = '#f3efe2'; g.lineWidth = 3; g.beginPath(); g.moveTo(1222, 470); g.lineTo(1262, 458); g.stroke(); g.beginPath(); g.ellipse(1258, 459, 4, 2.4, -.3, 0, TAU); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.moveTo(1259, 459); g.bezierCurveTo(1275, 448, 1280, 472, 1262, 474); g.stroke();
    // the awning's shadow on the walls
    const aw = g.createLinearGradient(0, 478, 0, 600); aw.addColorStop(0, 'rgba(30,16,8,.42)'); aw.addColorStop(1, 'rgba(30,16,8,0)'); g.fillStyle = aw; g.fillRect(SHOP.x0, 478, KIOSK.x1 - SHOP.x0, 122);
    // floor of the veranda (packed earth, darker) and the kiosk floorboards
    g.fillStyle = '#9a5a30'; g.fillRect(120, FLOOR - 4, 1170, 10);
    // tin can lamp holder on the post (lit at night: see roadGround)
  });
}

// ---------------------------------------------------------------- live parts
// the corrugated shutter rolled down to bar y yb (drum at the top)
function shutter(ctx, yb, t) {
  const O = SHOP.op, x0 = O.x0, x1 = O.x1;
  if (yb > O.y0 + 2) {
    ctx.save(); ctx.beginPath(); ctx.rect(x0, O.y0, x1 - x0, yb - O.y0); ctx.clip();
    ctx.fillStyle = '#6f8a86'; ctx.fillRect(x0, O.y0, x1 - x0, yb - O.y0);
    // ribs move with the rolling shutter (the pattern is fixed to the bar)
    for (let y = yb - 4; y > O.y0 - 12; y -= 11) { ctx.fillStyle = 'rgba(20,30,30,.32)'; ctx.fillRect(x0, y - 2, x1 - x0, 3); ctx.fillStyle = 'rgba(235,245,240,.28)'; ctx.fillRect(x0, y - 6, x1 - x0, 2); }
    // rust streaks and sun on the metal
    const r = prng(61); for (let i = 0; i < 14; i++) { const x = x0 + r() * 400, y = yb - r() * 260; ctx.fillStyle = rgba('#8a4a20', .18 + r() * .2); ctx.fillRect(x, y, 4 + r() * 6, 10 + r() * 40); }
    const sg = ctx.createLinearGradient(x0, 0, x1, 0); sg.addColorStop(0, 'rgba(10,10,10,.25)'); sg.addColorStop(.7, 'rgba(255,240,210,.08)'); sg.addColorStop(1, 'rgba(255,240,210,.18)'); ctx.fillStyle = sg; ctx.fillRect(x0, O.y0, x1 - x0, yb - O.y0);
    ctx.restore();
    // the bottom bar with two handles
    ctx.fillStyle = '#3a4644'; ctx.fillRect(x0 - 2, yb - 7, x1 - x0 + 4, 9); ctx.fillStyle = '#9aa8a4'; ctx.fillRect(x0 - 2, yb - 7, x1 - x0 + 4, 2);
    for (const hx of [372, 628]) { ctx.strokeStyle = '#2a3230'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hx - 12, yb - 4); ctx.lineTo(hx - 12, yb + 6); ctx.lineTo(hx + 12, yb + 6); ctx.lineTo(hx + 12, yb - 4); ctx.stroke(); }
  }
  // the drum box
  ctx.fillStyle = '#4a5654'; ctx.fillRect(x0 - 12, SHOP.drum.y0, x1 - x0 + 24, SHOP.drum.y1 - SHOP.drum.y0);
  ctx.fillStyle = 'rgba(255,240,210,.22)'; ctx.fillRect(x0 - 12, SHOP.drum.y0, x1 - x0 + 24, 4); ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(x0 - 12, SHOP.drum.y1 - 4, x1 - x0 + 24, 4);
}
// the treadle sewing machine (cast iron stand, flywheel, belt, black head with gold decoration, spool), phase th (flywheel angle)
const MACH = { x0: 990, x1: 1170, top: 700, fly: { x: 1146, y: 752, r: 34 }, head: { nx: 1034 }, hand: { x: 1166, y: 640, r: 19 } };
function machine(ctx, t, th, needle) {
  const M = MACH;
  // stand: two ornate side frames, treadle
  ctx.strokeStyle = '#141414'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (const x of [1004, 1156]) { ctx.beginPath(); ctx.moveTo(x - 14, FLOOR); ctx.quadraticCurveTo(x - 4, 760, x, 712); ctx.quadraticCurveTo(x + 4, 760, x + 14, FLOOR); ctx.stroke(); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, 748, 9, 0, TAU); ctx.stroke(); ctx.lineWidth = 5; }
  ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(1004, 772); ctx.lineTo(1156, 772); ctx.stroke();
  // treadle plate: rocks with the flywheel (pitman rod to the crank)
  const rock = Math.sin(th) * .1, tc = [1080, 790];
  ctx.save(); ctx.translate(tc[0], tc[1]); ctx.rotate(rock); ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-62, -4, 124, 8); ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 1; for (let k = -54; k < 60; k += 9) { ctx.beginPath(); ctx.moveTo(k, -3); ctx.lineTo(k + 4, 3); ctx.stroke(); } ctx.restore();
  const crank = [M.fly.x + Math.cos(th) * 12, M.fly.y + Math.sin(th) * 12], tp = [tc[0] + Math.cos(rock) * 58, tc[1] + Math.sin(rock) * 58];
  ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tp[0], tp[1]); ctx.lineTo(crank[0], crank[1]); ctx.stroke();
  // flywheel with spokes (slow enough not to strobe)
  ctx.strokeStyle = '#151515'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(M.fly.x, M.fly.y, M.fly.r, 0, TAU); ctx.stroke();
  ctx.lineWidth = 2.2; for (let k = 0; k < 6; k++) { const a = th + k * TAU / 6; ctx.beginPath(); ctx.moveTo(M.fly.x, M.fly.y); ctx.quadraticCurveTo(M.fly.x + Math.cos(a + .3) * 18, M.fly.y + Math.sin(a + .3) * 18, M.fly.x + Math.cos(a) * M.fly.r, M.fly.y + Math.sin(a) * M.fly.r); ctx.stroke(); }
  ctx.fillStyle = '#c8a050'; ctx.beginPath(); ctx.arc(M.fly.x, M.fly.y, 3.5, 0, TAU); ctx.fill();
  // belt from the flywheel up through the table to the hand wheel (the head is drawn smaller: see HS)
  const hw = headPt(M.hand.x, M.hand.y), hr = M.hand.r * HS;
  ctx.strokeStyle = 'rgba(80,50,30,.9)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(M.fly.x + M.fly.r, M.fly.y); ctx.lineTo(hw.x + hr * .8, hw.y + 4); ctx.moveTo(M.fly.x - M.fly.r + 4, M.fly.y - 10); ctx.lineTo(hw.x - hr * .5, hw.y + 6); ctx.stroke();
  // table top (wood) with a drawer
  ctx.fillStyle = '#8a5a30'; ctx.fillRect(M.x0, M.top, M.x1 - M.x0, 13); ctx.fillStyle = '#b07a44'; ctx.fillRect(M.x0, M.top, M.x1 - M.x0, 3); ctx.fillStyle = '#5a3418'; ctx.fillRect(M.x0 + 20, M.top + 13, 110, 14);
  ctx.fillStyle = '#c8a050'; ctx.beginPath(); ctx.arc(M.x0 + 75, M.top + 20, 2.2, 0, TAU); ctx.fill();
  // the head (bed, pillar, arm, needle head: black japanning with gold scrolls), drawn at HS about the needle foot
  ctx.save(); ctx.translate(HP.x, HP.y); ctx.scale(HS, HS); ctx.translate(-HP.x, -HP.y);
  ctx.fillStyle = '#121212';
  ctx.fillRect(1012, 688, 150, 12);
  ctx.beginPath(); ctx.moveTo(1132, 688); ctx.lineTo(1136, 626); ctx.quadraticCurveTo(1138, 614, 1124, 612); ctx.lineTo(1042, 614); ctx.quadraticCurveTo(1026, 616, 1024, 630); ctx.lineTo(1024, 662); ctx.lineTo(1048, 662); ctx.lineTo(1048, 636); ctx.lineTo(1112, 634); ctx.lineTo(1114, 688); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#d8b060'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(1052, 620); ctx.bezierCurveTo(1066, 614, 1078, 628, 1092, 620); ctx.bezierCurveTo(1100, 616, 1108, 624, 1116, 619); ctx.moveTo(1120, 640); ctx.bezierCurveTo(1126, 650, 1118, 660, 1126, 672); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(1044, 614, 70, 3); ctx.fillRect(1131, 626, 3, 56);
  // hand wheel
  ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(M.hand.x, M.hand.y, M.hand.r, 0, TAU); ctx.fill(); ctx.strokeStyle = '#c8a050'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(M.hand.x, M.hand.y, M.hand.r - 4, 0, TAU); ctx.stroke();
  ctx.strokeStyle = '#555'; ctx.lineWidth = 3; for (let k = 0; k < 4; k++) { const a = th * 1.8 + k * TAU / 4; ctx.beginPath(); ctx.moveTo(M.hand.x, M.hand.y); ctx.lineTo(M.hand.x + Math.cos(a) * (M.hand.r - 3), M.hand.y + Math.sin(a) * (M.hand.r - 3)); ctx.stroke(); }
  // needle bar (moves with the hand wheel) and the presser foot
  const ny = 666 + needle * 14; ctx.fillStyle = '#9a9a96'; ctx.fillRect(1031, 660, 6, ny - 660); ctx.fillStyle = '#e8e8e0'; ctx.fillRect(1033, ny, 2.5, 12); ctx.fillStyle = '#6a6a6a'; ctx.fillRect(1024, 682, 22, 6);
  // spool pin, spool of amber thread, the thread through the guides to the needle
  const S0 = SPOOL0; ctx.fillStyle = '#5a3418'; ctx.fillRect(S0.x - 9, S0.y - 12, 18, 5); ctx.fillRect(S0.x - 9, S0.y + 8, 18, 5);
  ctx.fillStyle = '#e8a040'; ctx.fillRect(S0.x - 8, S0.y - 8, 16, 16); ctx.fillStyle = 'rgba(255,240,200,.6)'; ctx.fillRect(S0.x - 6, S0.y - 7, 3, 14);
  ctx.fillStyle = '#9a9a96'; ctx.fillRect(S0.x - 1.5, S0.y + 13, 3, 6);
  ctx.strokeStyle = 'rgba(255,200,120,.9)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(S0.x - 8, S0.y); ctx.quadraticCurveTo(1060, 606, 1040, 626); ctx.lineTo(1034, ny + 4); ctx.stroke();
  ctx.restore();
}
// the fabric under the needle: a kitenge print that is fed slowly toward the tailor and falls over the table's left edge
function fabric(ctx, t, feed) {
  ctx.save();
  ctx.beginPath(); ctx.moveTo(1050, 690); ctx.lineTo(990, 690); ctx.quadraticCurveTo(972, 694, 970, 712); ctx.lineTo(966, 770); ctx.quadraticCurveTo(978, 776, 992, 770); ctx.lineTo(996, 712); ctx.lineTo(1050, 703); ctx.closePath();
  ctx.fillStyle = '#e06a28'; ctx.fill(); ctx.clip();
  const off = (feed * 40) % 24;
  for (let i = -2; i < 7; i++) for (let j = -1; j < 8; j++) { const x = 966 + i * 24 - off, y = 686 + j * 14 + (i % 2) * 7; ctx.fillStyle = '#1f4a8a'; ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill(); ctx.fillStyle = '#f6d070'; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill(); }
  const sg = ctx.createLinearGradient(966, 0, 1000, 0); sg.addColorStop(0, 'rgba(20,8,4,.35)'); sg.addColorStop(1, 'rgba(20,8,4,0)'); ctx.fillStyle = sg; ctx.fillRect(960, 690, 50, 90);
  ctx.restore();
}
// an upside-down bicycle on saddle and handlebars (ground y G, rear axle at x0), crank angle ph; returns the pedal position
function bicycle(ctx, x0, G, ph, wheelA, s = BIKE_S) {
  ctx.save(); ctx.translate(x0, G - 165 * s); ctx.scale(s, -s);
  // in normal bike coordinates (y up negative): rear axle (0,-57), front axle (175,-57), BB (70,-46)
  const RA = [0, -57], FA = [175, -57], BB = [70, -46], SC = [42, -134], HT = [162, -128], HB = [168, -100];
  const wheel = (c, a) => {
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(c[0], c[1], 54, 0, TAU); ctx.stroke();
    ctx.strokeStyle = '#8a8a86'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(c[0], c[1], 48, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(170,170,165,.75)'; ctx.lineWidth = .8; ctx.beginPath(); for (let k = 0; k < 24; k++) { const q = a + k * TAU / 24, q2 = q + (k % 2 ? .35 : -.35); ctx.moveTo(c[0] + Math.cos(q) * 4, c[1] + Math.sin(q) * 4); ctx.lineTo(c[0] + Math.cos(q2) * 47, c[1] + Math.sin(q2) * 47); } ctx.stroke();
    ctx.fillStyle = '#9a9a96'; ctx.beginPath(); ctx.arc(c[0], c[1], 5, 0, TAU); ctx.fill();
  };
  wheel(RA, .7); wheel(FA, wheelA);
  // frame (black roadster), mudguards
  ctx.strokeStyle = '#1c1c22'; ctx.lineWidth = 5.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(RA[0], RA[1]); ctx.lineTo(BB[0], BB[1]); ctx.lineTo(SC[0], SC[1]); ctx.lineTo(RA[0], RA[1]); ctx.moveTo(SC[0], SC[1]); ctx.lineTo(HT[0], HT[1]); ctx.lineTo(HB[0], HB[1]); ctx.lineTo(BB[0], BB[1]); ctx.moveTo(HB[0], HB[1]); ctx.lineTo(FA[0], FA[1]); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = '#2a2a30'; ctx.beginPath(); ctx.arc(RA[0], RA[1], 62, -2.6, -.5); ctx.stroke(); ctx.beginPath(); ctx.arc(FA[0], FA[1], 62, -2.4, -.6); ctx.stroke();
  // seat post + saddle (on the ground), stem + handlebar (on the ground)
  ctx.lineWidth = 4; ctx.strokeStyle = '#9a9a96'; ctx.beginPath(); ctx.moveTo(SC[0], SC[1]); ctx.lineTo(36, -156); ctx.moveTo(HT[0], HT[1]); ctx.lineTo(158, -152); ctx.stroke();
  ctx.fillStyle = '#3a2418'; ctx.beginPath(); ctx.moveTo(14, -160); ctx.quadraticCurveTo(36, -170, 58, -162); ctx.lineTo(54, -156); ctx.quadraticCurveTo(34, -160, 16, -155); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#9a9a96'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(130, -158); ctx.quadraticCurveTo(158, -166, 186, -158); ctx.stroke(); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(126, -162, 10, 6); ctx.fillRect(182, -162, 10, 6);
  // chain ring, chain, crank and pedals
  ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(BB[0], BB[1], 15, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(BB[0], BB[1] - 15); ctx.lineTo(RA[0], RA[1] - 6); ctx.moveTo(BB[0], BB[1] + 15); ctx.lineTo(RA[0], RA[1] + 6); ctx.stroke();
  const cr = 30, p1 = [BB[0] + Math.cos(ph) * cr, BB[1] + Math.sin(ph) * cr], p2 = [BB[0] - Math.cos(ph) * cr, BB[1] - Math.sin(ph) * cr];
  ctx.strokeStyle = '#7a7a76'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(p2[0], p2[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
  ctx.fillStyle = '#2a2a2a'; for (const p of [p1, p2]) ctx.fillRect(p[0] - 7, p[1] - 3, 14, 6);
  ctx.restore();
  return [x0 + p1[0] * s, G - 165 * s - p1[1] * s];
}
const BIKE_S = 1.05, BX = 1400, BG = 930;   // the roadster: a 28-inch wheel is ~57 px at the mechanic's scale
const bikeFA = () => [BX + 175 * BIKE_S, BG - 108 * BIKE_S];
function chicken(ctx, x, y, s, t, ph, col, flip) {
  const peck = Math.max(0, Math.sin(t * 2.4 + ph)) ** 3, f = flip ? -1 : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
  ctx.strokeStyle = '#c88a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-3, -10); ctx.lineTo(-4, 0); ctx.moveTo(3, -10); ctx.lineTo(4, 0); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(0, -18, 15, 10, -.15, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-12, -22); ctx.quadraticCurveTo(-24, -36, -18, -40); ctx.quadraticCurveTo(-12, -30, -8, -24); ctx.fill();
  const hx = 13 + peck * 6, hy = -26 + peck * 20; ctx.beginPath(); ctx.moveTo(8, -22); ctx.quadraticCurveTo(hx, hy - 4, hx + 1, hy); ctx.lineTo(hx - 4, hy + 2); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(hx, hy, 5, 0, TAU); ctx.fill();
  ctx.fillStyle = '#c4322a'; ctx.beginPath(); ctx.arc(hx - 1, hy - 5, 2.6, 0, TAU); ctx.fill(); ctx.fillStyle = '#d8962a'; ctx.beginPath(); ctx.moveTo(hx + 4, hy - 1); ctx.lineTo(hx + 9, hy + 1); ctx.lineTo(hx + 4, hy + 2); ctx.fill();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(hx + 1.5, hy - 1, 1.1, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-10 + k * 4, -24); ctx.quadraticCurveTo(-4 + k * 4, -16, -8 + k * 4, -10); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- the people
const DRESS = {
  woman: { coat: '#c4482a', pants: '#3a2a4a', shoes: '#2a1a14', skin: '#6a4430', hair: '#1a1010', skirt: '#2a5a8a' },
  tailor: { coat: '#e8e2d2', pants: '#3a3a4a', shoes: '#1a1414', skin: '#5a3a28', hair: '#151010' },
  mech: { coat: '#2c4a7a', pants: '#24385e', shoes: '#1a1414', skin: '#6a4430', hair: '#151010' },
};
const LIGHT = (x, y) => ({ x: SUN.x, y: SUN.y, col: '#ffe2b0', a: .42 });
// the shop woman lifts the shutter bar at height yb; after tLet she lets go and lowers her arms
function shopWoman(ctx, t, yb, letGo) {
  const x = 330, s = 1.42, base = { skirt: true, hair: 'bun', lean: 0, head: 0 };
  // lean forward when the bar is low, back a little when pushing it overhead
  const low = clamp((yb - 600) / 100), high = clamp((600 - yb) / 80);
  const pose = { ...base, lean: .2 * low - .06 * high, head: -.25 * high + .1 * low, hip: [.05 + .1 * low, -.05], kn: [.12 * low, .05 * low] };
  const o = { t, seed: 21, dress: DRESS.woman, light: LIGHT(), rim: '#ffd9a0', rimSide: 1 };
  const yHip = FLOOR - 90 * s + 8 * low * s;
  const lockS = [], lockE = [];
  for (const i of [0, 1]) {
    const tgt = [i ? 386 : 404, yb + 2];
    const a = reachArm(x, yHip, s, pose, i, false, o, tgt);
    const rest = i ? { sh: .14, el: .3 } : { sh: .2, el: .34 };
    const k = clamp(letGo); lockS[i] = mix(a.sh, rest.sh, sm(k)); lockE[i] = mix(a.el, rest.el, sm(k));
  }
  pose.sh = lockS; pose.el = lockE; pose.lock = [1, 1];
  figure(ctx, x, yHip, s, pose, o);
}
function tailor(ctx, t, th) {
  const x = 946, s = 1.26, yHip = 726, rock = Math.sin(th) * .1;
  const pose = { ...POSES.sit, hip: [1.42, 1.36], kn: [1.18 + rock * 1.3, 1.1 - rock * 1.3], lean: .16, head: .26, hair: 'short' };
  const o = { t, seed: 33, dress: DRESS.tailor, light: LIGHT(), rim: '#ffd9a0' };
  const a0 = reachArm(x, yHip, s, pose, 0, false, o, [1018 + Math.sin(t * 1.3) * 3, 697]), a1 = reachArm(x, yHip, s, pose, 1, false, o, [996, 699 + Math.sin(t * 1.1 + 1) * 2]);
  pose.sh = [a0.sh, a1.sh]; pose.el = [a0.el, a1.el]; pose.lock = [1, 1];
  // the stool
  ctx.fillStyle = '#6a4228'; ctx.fillRect(916, 730, 60, 7); ctx.fillRect(922, 737, 5, 63); ctx.fillRect(965, 737, 5, 63); ctx.fillRect(926, 770, 40, 3);
  figure(ctx, x, yHip, s, pose, o);
  // the measuring tape round the tailor's neck (yellow, readable as a tape)
  const nx = x + 6 * s, ny = yHip - 66 * s; ctx.strokeStyle = '#f0c840'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(nx - 4, ny); ctx.quadraticCurveTo(nx + 6, ny + 18, nx + 4, ny + 44); ctx.moveTo(nx + 3, ny); ctx.quadraticCurveTo(nx + 12, ny + 14, nx + 13, ny + 36); ctx.stroke();
}
// the mechanic kneels at the front wheel of the upside-down roadster (facing left) and spins it by the rim, truing it
function mechanic(ctx, t, rimA, rimB) {
  const x = 1726, s = 1.5, G = BG;
  const pose = { hip: [1.5, .2], kn: [1.62, 1.72], lean: .32, head: .18, hair: 'short' };
  // back knee and front foot both on the ground: hip height from the leg geometry (knee radius 6.5, sole 4.6)
  const yHip = G - (Math.cos(.2) * 45 + 6.5) * s;
  const o = { t, seed: 45, dress: DRESS.mech, light: { ...LIGHT(), x: -2000 }, rim: '#ffd9a0', rimSide: -1, flip: true };
  const a0 = reachArm(x, yHip, s, pose, 0, true, o, rimA), a1 = reachArm(x, yHip, s, pose, 1, true, o, rimB);
  pose.sh = [a0.sh, a1.sh]; pose.el = [a0.el, a1.el]; pose.lock = [1, 1];
  figure(ctx, x, yHip, s, pose, o);
}

// ---------------------------------------------------------------- the ground world
let GL = null;
function groundCanvas() { if (!GL) GL = canvas(W, H); return GL; }
export function prewarmRoad() { farLayer(); treeLayer(); roadLayer(); buildLayer(); }
// hour → light: [multiply tint of the ground, amount of warm night lights]
export function groundTint(h) {
  const K = [[9, '#ffffff', 0], [15, '#fff1d6', .05], [17, '#ffb070', .12], [18.5, '#c0605a', .22], [19.5, '#3a3a7a', .42], [21, '#141a48', .62], [24, '#0b0f2a', .7]];
  let a = K[0], b = K[K.length - 1]; for (let i = 0; i < K.length - 1; i++) if (h >= K[i][0] && h <= K[i + 1][0]) { a = K[i]; b = K[i + 1]; break; }
  const u = clamp((h - a[0]) / ((b[0] - a[0]) || 1));
  return [mixC(a[1], b[1], u), mix(a[2], b[2], u), clamp((h - 18.2) / 1.6)];
}
// st: { hour, yb (shutter bar), letGo, feed, xf (the full world transform as a DOMMatrix-like [a,b,c,d,e,f]) }
export function roadGround(ctx, t, st) {
  const [gc, g] = groundCanvas();
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
  const m = ctx.getTransform(); g.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
  put(g, farLayer()); put(g, treeLayer()); put(g, roadLayer()); put(g, buildLayer());
  const th = t * 2 * Math.PI * 1.6;                  // treadle: 1.6 turns per second
  // the shop's bulb inside (on at night), the shutter, the woman
  shutter(g, st.yb ?? SHOP.op.y0, t);
  shopWoman(g, t, Math.max(st.yb ?? 520, 522), st.letGo ?? 1);
  // the tailor at the machine
  fabric(g, t, t * .5);
  tailor(g, t, th);
  machine(g, t, th, (Math.cos(th * 1.8) + 1) / 2);
  // the bicycle repair stand: pump, basin, the upside-down roadster, the mechanic turning the pedal slowly
  const wa = t * 2.2;
  g.fillStyle = '#c8c2b8'; g.beginPath(); g.ellipse(1236, 934, 40, 9, 0, 0, TAU); g.fill(); g.fillStyle = '#5a7a8a'; g.beginPath(); g.ellipse(1236, 931, 34, 6, 0, 0, TAU); g.fill();
  g.fillStyle = 'rgba(220,240,250,.6)'; g.beginPath(); g.ellipse(1230 + Math.sin(t * 1.7) * 4, 930, 6, 1.5, 0, 0, TAU); g.fill();
  // the floor pump (blue barrel, T handle, hose)
  g.fillStyle = '#2a4a8a'; g.fillRect(1872, 820, 10, 104); g.fillRect(1856, 816, 42, 6); g.fillRect(1862, 922, 30, 8); g.strokeStyle = '#1a1a1a'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(1877, 900); g.quadraticCurveTo(1850, 924, 1830, 900); g.stroke();
  bicycle(g, BX, BG, 2.2, wa);
  // a spare inner tube hung on a nail on the kiosk's corner post
  g.fillStyle = '#9a9a96'; g.fillRect(1272, 646, 6, 3); g.strokeStyle = '#151515'; g.lineWidth = 5; g.beginPath(); g.ellipse(1282, 690, 15, 42, -.12, 0, TAU); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(1282, 690, 13, 40, -.12, -1.2, .4); g.stroke();
  g.fillStyle = '#7a7a76'; g.save(); g.translate(1470, 938); g.rotate(-.2); g.fillRect(-24, -3, 48, 6); g.beginPath(); g.arc(26, 0, 7, 0, TAU); g.fill(); g.restore();   // a spanner
  // a small wooden tool box
  g.fillStyle = '#7a4a28'; g.fillRect(1196, 900, 64, 32); g.fillStyle = '#5a3418'; g.fillRect(1196, 900, 64, 5); g.strokeStyle = '#3a2010'; g.lineWidth = 3; g.beginPath(); g.moveTo(1214, 900); g.quadraticCurveTo(1228, 884, 1242, 900); g.stroke();
  const [fx, fy] = bikeFA(), rr0 = 54 * BIKE_S, q = .06 * Math.sin(t * 1.3);
  mechanic(g, t, [fx + Math.cos(.28 + q) * rr0, fy + Math.sin(.28 + q) * rr0 + Math.sin(t * 2.2) * 2], [fx + Math.cos(-.55) * rr0, fy + Math.sin(-.55) * rr0]);
  // chickens and a passer-by far down the path
  chicken(g, 96, 852, 1.15, t, 0, '#efe6d6', false); chicken(g, 236, 874, 1.05, t, 2.1, '#a8502a', true);
  { const u = ((t * .045) % 1 + 1) % 1, px = mix(1420, 1548, u), py = mix(770, HZ + 8, u), ps = mix(.42, .16, u);
    figure(g, px, py - 90 * ps, ps, { hair: 'bun', skirt: true }, { t, seed: 61, dress: { coat: '#2a6a8a', skirt: '#c43a2a', skin: '#5a3a28', pants: '#2a2a3a' } });
    g.fillStyle = '#c89a4a'; g.beginPath(); g.ellipse(px + 3 * ps, py - 192 * ps, 22 * ps, 8 * ps, 0, 0, TAU); g.fill(); }
  // the time of day: tint the ground only (source-atop), then the warm lights of the evening on top
  const [tint, ta, nl] = groundTint(st.hour ?? 10);
  if (ta > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = rgba(tint, ta); g.fillRect(0, 0, W, H); g.restore(); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(gc, 0, 0); ctx.restore();
  if (nl > 0) {
    // the bulb in the shop, the kiosk lamp, a lantern on the post, light spilling onto the road
    glowAt(ctx, 500, 560, 160, .6 * nl); glowAt(ctx, 1080, 600, 130, .5 * nl); glowAt(ctx, 876, 500, 60, .7 * nl, '#ffcf8a');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffb35c', .16 * nl); ctx.beginPath(); ctx.moveTo(300, 800); ctx.lineTo(700, 800); ctx.lineTo(840, 1000); ctx.lineTo(160, 1000); ctx.closePath(); ctx.fill(); ctx.restore();
  }
}
// ---------------------------------------------------------------- the sky (time of day)
const SKYK = [
  [9, ['#e9cf9e', '#f1dcb2', '#f7e8c8']], [15, ['#e6c690', '#f0d6a4', '#f6e2bc']], [17, ['#d9a870', '#ecbf86', '#f6d6a0']],
  [18.5, ['#6a5a8e', '#d9876a', '#f2b070']], [19.5, ['#2c2c62', '#6a4f88', '#c98872']], [21, ['#0d1132', '#1a1d4a', '#3a2f62']], [24, ['#070918', '#0b0f2a', '#1d1a4a']],
];
export function skyCols(h) {
  let a = SKYK[0], b = SKYK[SKYK.length - 1]; for (let i = 0; i < SKYK.length - 1; i++) if (h >= SKYK[i][0] && h <= SKYK[i + 1][0]) { a = SKYK[i]; b = SKYK[i + 1]; break; }
  const u = clamp((h - a[0]) / ((b[0] - a[0]) || 1)); return a[1].map((c, i) => mixC(c, b[1][i], u));
}
const STARS = (() => { const r = prng(808), s = []; for (let i = 0; i < 700; i++) { const m = r(); s.push([-1400 + r() * 4800, -3200 + r() * 3900, m < .92 ? .7 + r() * 1.1 : 1.6 + r() * 1.8, r() * TAU, .5 + r() * 1.5]); } return s; })();
// the sky in world (native) units: from y0 (top) to the horizon; st: { hour, view: [x0, y0, x1, y1] }
export function roadSky(ctx, t, st) {
  const h = st.hour ?? 10, [c0, c1, c2] = skyCols(h), V = st.view || [-600, -3400, 2600, HZ + 60];
  const g = ctx.createLinearGradient(0, -1400, 0, HZ); g.addColorStop(0, c0); g.addColorStop(.62, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(V[0] - 10, V[1] - 10, V[2] - V[0] + 20, Math.max(0, HZ + 60 - V[1]) + 20);
  { const d = 1 - clamp((h - 16.5) / 2.5), sg = ctx.createRadialGradient(2150, -300, 0, 2150, -300, 1700); sg.addColorStop(0, rgba('#fff8e6', .55 * d)); sg.addColorStop(.5, rgba('#fff2d0', .18 * d)); sg.addColorStop(1, 'rgba(255,240,210,0)'); ctx.fillStyle = sg; ctx.fillRect(V[0] - 10, V[1] - 10, V[2] - V[0] + 20, Math.max(0, HZ + 60 - V[1]) + 20); }
  // engraved sky: fine horizontal lines, denser toward the top, wavy
  const day = 1 - clamp((h - 18) / 2.5);
  ctx.strokeStyle = rgba(h < 18.5 ? '#a8865a' : '#8a86c0', .13 * (.5 + .5 * day)); ctx.lineWidth = 1.1; ctx.beginPath();
  for (let y = HZ - 30; y > Math.max(V[1], -3400); y -= 6 + Math.max(0, (y + 200) * .012)) { if (y > V[3] + 20) continue; for (let x = V[0] - 20; x < V[2] + 20; x += 40) { const yy = y + Math.sin(x * .004 + y * .02) * 2.4; x === V[0] - 20 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } }
  ctx.stroke();
  // cloud strata (cream in the day, rose at sunset, grey-violet at night)
  const cc = h < 17 ? '#fbf0d8' : h < 19 ? mixC('#fbf0d8', '#f2a888', (h - 17) / 2) : mixC('#f2a888', '#2a2a58', clamp((h - 19) / 1.5));
  for (const [cx, cy, w, hh, sp] of [[300, 120, 520, 26, 5], [1500, 40, 680, 30, 3.5], [900, -260, 760, 34, 2.5], [-100, -520, 600, 30, 2], [1900, -700, 700, 36, 1.6]]) {
    const x = cx + (t - 328) * sp; if (x + w < V[0] || x - w > V[2] || cy < V[1] - 60 || cy > V[3] + 60) continue;
    ctx.fillStyle = rgba(cc, .5); ctx.beginPath(); ctx.ellipse(x, cy, w * .5, hh, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(cc, .35); ctx.beginPath(); ctx.ellipse(x - w * .18, cy - hh * .6, w * .3, hh * .8, 0, 0, TAU); ctx.fill();
  }
  // two black kites circling high on the warm air, drifting left (they leave before the evening)
  for (const [cx, cy, R, w, ph] of [[640, 150, 70, .32, 0], [420, 90, 48, -.27, 2]]) {
    const x0 = cx - (t - 328) * 55; if (x0 < V[0] - 200 || x0 > V[2] + 200) continue;
    const a = t * w + ph, x = x0 + Math.cos(a) * R, y = cy + Math.sin(a) * R * .35, fl = Math.sin(t * 1.7 + ph) * .12, dir = Math.sign(-Math.sin(a) * w) || 1;
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = h < 18.5 ? '#3a2c22' : '#1a1830';
    ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-30, -8 - fl * 30, -46, -4 - fl * 40); ctx.quadraticCurveTo(-28, -2, -10, 4); ctx.lineTo(10, 4); ctx.quadraticCurveTo(28, -2, 46, -4 - fl * 40); ctx.quadraticCurveTo(30, -8 - fl * 30, 14, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 1, 13, 4, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(-12, 1); ctx.lineTo(-24, -2); ctx.lineTo(-22, 2); ctx.lineTo(-24, 6); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // stars come out as the sky darkens (never pop: each fades in with the night, twinkling slowly)
  const n = clamp((h - 19.2) / 1.6);
  if (n > 0) for (const [x, y, s, ph, f] of STARS) {
    if (x < V[0] - 5 || x > V[2] + 5 || y < V[1] - 5 || y > Math.min(V[3], HZ - 40)) continue;
    const a = n * (.45 + .4 * Math.sin(t * f * .8 + ph)) * clamp((HZ - 60 - y) / 300); if (a <= .02) continue;
    ctx.fillStyle = `rgba(243,239,226,${a})`; ctx.beginPath(); ctx.arc(x, y, s * (st.starScale || 1), 0, TAU); ctx.fill();
  }
}
export const ROAD = { HZ, FLOOR, SHOP, KIOSK, MACH };
