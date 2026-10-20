// c07 · paper (7.06–7.08): the slip of paper that drifts down in the dawn light is a lottery ticket; on "winners" its numbers light in
// amber foil; then the ticket's paper becomes an engraved map of Sweden (the guilloche rosette unwinds into the coast and the graticule,
// the foil numbers break into the amber dots of the winners, the perforation becomes the ruler YEARS AFTER THE WIN), and the camera dives
// into one dot until its amber fills the frame: it is the lamp of the workshop (lib/v2_c07_shop.mjs).
//   drawTicket(ctx, M, t, K, o)   the ticket in ticket millimetres (origin at its centre, u right, v down) under the screen affine M
//                                 [a, b, c, d, e, f]; o = { back (the blank back), lit (0..1 light on the paper), foil (0..1), morph (0..1) }
//   TICKET                        its size and layout (mm)
// The static print is one cached texture (an Image, no Canvas copies per frame); the foil, the glint and the morph are drawn live.
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { stipple } from './art.mjs';
import { guilloche, gBorder, microtext, foilGlint, FOIL } from './certificate.mjs';
import { once, TAU, sstep, mixHex, setT } from './v2_c07_kit.mjs';

export const TICKET = { w: 170, h: 80, perf: 52, ros: [-55, 0], rosR: 21, nums: ['07', '12', '19', '23', '31', '38'], numX: 8, numY: 5, numP: 12.6, box: [10.4, 12.6] };
const INK = '#22304a', ROSE = '#35507e', SEC = '#7d93b8', PAPER = ['#f4ead2', '#ecdfbf', '#dfcda4'];
const RES = 12;   // texture px per mm

// the ticket's guilloche rosette (also the source of the coast in 7.08): 12 lines
export const rosLines = () => {
  const G = guilloche({ R: TICKET.rosR * .74, A: TICKET.rosR * .17, B: TICKET.rosR * .07, n: 14, m: 5, lines: 12, steps: 540 });
  const out = []; for (let k = 0; k < G.lines; k++) out.push(G.line(k).map(([x, y]) => [x + TICKET.ros[0], y + TICKET.ros[1]]));
  return out;
};
function ticketCanvas(back) {
  const { w, h } = TICKET, [c, g] = canvas(w * RES, h * RES), r = prng(back ? 23 : 21);
  g.scale(RES, RES); g.translate(w / 2, h / 2);
  // paper: warm stock, light from the upper left, fibres
  const pg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); pg.addColorStop(0, PAPER[0]); pg.addColorStop(.55, PAPER[1]); pg.addColorStop(1, PAPER[2]);
  g.fillStyle = pg; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 2.2); g.fill();
  g.save(); g.clip();
  g.lineCap = 'round';
  for (let i = 0; i < 900; i++) { const x = (r() - .5) * w, y = (r() - .5) * h, a = (r() - .5) * 2.4, L = .6 + r() * 2.4, k = r(); g.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .08 + .08 * k); g.lineWidth = .06 + k * .06; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
  if (back) {
    // the back: print showing through faintly (mirrored), a few lines of terms in microtext
    g.save(); g.scale(-1, 1); g.globalAlpha = .1; g.strokeStyle = ROSE; g.lineWidth = .12; for (const L of rosLines()) { g.beginPath(); L.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); } g.restore();
    g.globalAlpha = 1;
    for (let k = 0; k < 9; k++) microtext(g, -60, -18 + k * 4.4, 104, 'KEEP THIS TICKET · PRIZES ARE PAID ON PRESENTATION OF THE TICKET · ', { size: 1.5, col: INK, a: .35, spacing: .12 });
    g.restore();
    g.strokeStyle = 'rgba(90,70,40,.35)'; g.lineWidth = .25; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 2.2); g.stroke();
    return c;
  }
  // security print: fine wavy lines across the whole ticket
  g.strokeStyle = rgba(SEC, .22); g.lineWidth = .09;
  for (let k = 0; k < 46; k++) { const y0 = -h / 2 + 1 + k * 1.72; g.beginPath(); for (let x = -w / 2; x <= w / 2; x += .8) { const y = y0 + .55 * Math.sin(x * .32 + k * .7) + .3 * Math.sin(x * .11 - k); x === -w / 2 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  // woven guilloche border band
  g.save(); g.translate(-w / 2 + 2, -h / 2 + 2); gBorder(g, 0, 0, w - 4, h - 4, { band: 5, lines: 5, waves: 90, col: ROSE, w: .14, a: .7, radius: 2.5 }); g.restore();
  // the rosette (left)
  g.strokeStyle = ROSE; g.lineWidth = .13; g.globalAlpha = .85;
  for (const L of rosLines()) { g.beginPath(); L.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); }
  g.globalAlpha = 1;
  g.strokeStyle = rgba(ROSE, .7); g.lineWidth = .18; for (const rr of [5.2, 5.9]) { g.beginPath(); g.arc(TICKET.ros[0], TICKET.ros[1], rr, 0, TAU); g.stroke(); }
  g.fillStyle = INK; g.font = '600 3.2px "Inter"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Nº 6', TICKET.ros[0], TICKET.ros[1] + .2);
  // title, draw line, the six numbers in their boxes (ink; the foil comes live on "winners")
  g.fillStyle = INK; g.font = '10px "Instrument Serif"'; g.textBaseline = 'alphabetic';
  const title = 'LOTTERY'; let tw = 0; const sp = 1.3; for (const ch of title) tw += g.measureText(ch).width + sp; tw -= sp;
  let x = TICKET.numX - tw / 2; for (const ch of title) { g.fillText(ch, x + g.measureText(ch).width / 2, -18.5); x += g.measureText(ch).width + sp; }
  g.strokeStyle = rgba(INK, .6); g.lineWidth = .16; g.beginPath(); g.moveTo(TICKET.numX - 36, -15); g.lineTo(TICKET.numX + 36, -15); g.moveTo(TICKET.numX - 36, -14.3); g.lineTo(TICKET.numX + 36, -14.3); g.stroke();
  g.font = '600 2.1px "Inter"'; g.fillStyle = rgba(INK, .85); g.fillText('DRAW 1904  ·  SIX NUMBERS  ·  ONE TICKET', TICKET.numX, -10.6);
  for (let i = 0; i < 6; i++) {
    const cx = numX(i), cy = TICKET.numY, [bw, bh] = TICKET.box;
    g.strokeStyle = rgba(INK, .75); g.lineWidth = .22; g.beginPath(); g.roundRect(cx - bw / 2, cy - bh / 2, bw, bh, 1.2); g.stroke();
    g.strokeStyle = rgba(ROSE, .35); g.lineWidth = .08; g.beginPath(); g.roundRect(cx - bw / 2 + .7, cy - bh / 2 + .7, bw - 1.4, bh - 1.4, .8); g.stroke();
    g.fillStyle = INK; g.font = '600 7.2px "Inter"'; g.textBaseline = 'middle'; g.fillText(TICKET.nums[i], cx, cy + .4);
  }
  g.textBaseline = 'alphabetic';
  microtext(g, TICKET.numX - 38, 17.5, 76, 'VALID FOR ONE DRAW · ', { size: 1.5, col: INK, a: .55, spacing: .12 });
  microtext(g, TICKET.numX - 38, 20.4, 76, '1904 · 1904 · 1904 · ', { size: 1.5, col: ROSE, a: .45, spacing: .12 });
  // perforation and stub (serial number, a small medallion, bars)
  g.fillStyle = 'rgba(40,32,22,.16)'; g.fillRect(TICKET.perf - .15, -h / 2, .3, h);
  const sx = (TICKET.perf + w / 2) / 2;
  g.save(); g.translate(sx + 7.5, 0); g.rotate(-Math.PI / 2); g.fillStyle = INK; g.font = '600 3.6px "Inter"'; g.textAlign = 'center'; g.fillText('Nº 041 907', 0, 0); g.restore();
  const G2 = guilloche({ R: 4.6, A: 1.1, B: .45, n: 11, m: 4, lines: 8, steps: 300 }); g.strokeStyle = ROSE; g.lineWidth = .1;
  for (let k = 0; k < G2.lines; k++) { g.beginPath(); G2.line(k).forEach(([px, py], i) => (i ? g.lineTo(px + sx - 3, py - 18) : g.moveTo(px + sx - 3, py - 18))); g.stroke(); }
  const rb = prng(5); g.fillStyle = INK; for (let yy = 8; yy < 34; ) { const bw = .25 + rb() * .7; g.fillRect(sx - 9, yy, 12, bw); yy += bw + .3 + rb() * .5; }
  g.restore();
  // the holes of the perforation (the deck shows through), the paper edge
  g.fillStyle = '#1b2033'; for (let y = -h / 2 + 1.1; y < h / 2 - .5; y += 1.8) { g.beginPath(); g.arc(TICKET.perf, y, .42, 0, TAU); g.fill(); }
  g.strokeStyle = 'rgba(90,70,40,.4)'; g.lineWidth = .25; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 2.2); g.stroke();
  stipple(c, { k: .14, g: 1, seed: 8, mid: false, boost: 1 });
  return c;
}
export const numX = (i) => TICKET.numX + (i - 2.5) * TICKET.numP;
const frontTex = () => once('c07ticketF', () => ticketCanvas(false));
const backTex = () => once('c07ticketB', () => ticketCanvas(true));
export function paperWarm() { frontTex(); backTex(); }

// the six numbers in amber foil (embossed leaf with a moving glint), over the printed ink
function foilNumbers(ctx, t, K, f) {
  if (f <= 0) return;
  const [bw, bh] = TICKET.box;
  for (let i = 0; i < 6; i++) {
    const cx = numX(i), cy = TICKET.numY, k = sstep(i * .07, i * .07 + .3, f);   // they light one after another, left to right
    if (k <= 0) continue;
    // the leaf is pressed into the box from its centre outward (it grows, it does not fade)
    const rw = bw / 2 * k, rh = bh / 2 * k;
    const box = new Path2D(); box.roundRect(cx - rw, cy - rh, 2 * rw, 2 * rh, 1.2 * k);
    const gr = ctx.createLinearGradient(cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2); FOIL.forEach((c, j) => gr.addColorStop(j / (FOIL.length - 1), c));
    ctx.fillStyle = gr; ctx.fill(box);
    ctx.save(); ctx.clip(box);
    ctx.fillStyle = '#4a2208'; ctx.font = '600 7.2px "Inter"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(TICKET.nums[i], cx + .18, cy + .58); ctx.fillStyle = '#fff1d6'; ctx.fillText(TICKET.nums[i], cx - .1, cy + .3);
    ctx.fillStyle = '#c87a2c'; ctx.fillText(TICKET.nums[i], cx, cy + .4);
    ctx.restore();
    ctx.strokeStyle = rgba('#7a3b17', .8 * k); ctx.lineWidth = .2; ctx.stroke(box);
    foilGlint(ctx, box, t + i * .05, { x: cx - 14, y: cy, span: 30, width: 4, speed: .55, angle: -.9, a: .9 * k });
  }
  ctx.textBaseline = 'alphabetic';
}
// the light of the foil in the air (screen space, additive), for the moment the numbers light up
export function foilBloom(ctx, M, t, f) {
  if (f <= 0) return;
  const p = (u, v) => [M[0] * u + M[2] * v + M[4], M[1] * u + M[3] * v + M[5]], c = p(TICKET.numX, TICKET.numY), sc = Math.hypot(M[0], M[1]);
  const pulse = f;
  const r = 52 * sc, g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r);
  g.addColorStop(0, rgba('#ffd9a0', .22 * pulse)); g.addColorStop(.4, rgba('#ffb35c', .1 * pulse)); g.addColorStop(1, rgba('#ffb35c', 0));
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r); ctx.restore();
}
// o = { back, lit (0..1), warm (0..1 dawn tint), foil (0..1), shade (0..1 a shadow across it) }
export function drawTicket(ctx, M, t, K, o = {}) {
  const { w, h } = TICKET;
  ctx.save(); setT(ctx, M);
  ctx.drawImage(o.back ? backTex() : frontTex(), -w / 2, -h / 2, w, h);
  if (!o.back) foilNumbers(ctx, t, K, o.foil ?? 0);
  // light: the paper takes the colour of the light it lies in (dark before the dawn, warm in the beam)
  const lit = o.lit ?? 1, warm = o.warm ?? 0;
  const edge = new Path2D(); edge.roundRect(-w / 2, -h / 2, w, h, 2.2);
  if (lit < .999) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = mixHex('#2a3150', '#ffffff', lit); ctx.fill(edge); }
  if (warm > .001) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = mixHex('#ffffff', '#ffd9a8', warm); ctx.fill(edge); }
  if (o.glint > .001) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#fff1d6', .5 * o.glint); ctx.fill(edge); }
  ctx.restore();
}
