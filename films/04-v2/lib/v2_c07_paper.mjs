// c07 · paper (7.06–7.08): the slip of paper that drifts down in the dawn light is a lottery ticket; on "winners" its numbers light in
// amber foil; then the ticket's paper becomes an engraved map of Sweden (the guilloche rosette unwinds into the coast and the graticule,
// the foil gathers into the amber dots of the winners, the rest of the print is lifted off by the sweep, the ruler YEARS AFTER THE WIN and
// the sources are printed), and the camera dives into one dot until its amber fills the frame: it is the bulb of the workshop lamp
// (lib/v2_c07_shop.mjs, kit.amberFill on both sides).
//   drawTicket(ctx, M, t, K, o)   the ticket in ticket millimetres (origin at its centre, u right, v down) under the screen affine M
//                                 o = { back, lit (0..1), warm (0..1), foil (0..1), glint (0..1) }
//   drawPaperPhase(ctx, M, t, K)  the ticket filling the frame → the map → the dive (t ≥ K.cover)
//   paperM(t, K, M0)              the dive: M0 (the top-down camera's affine) zoomed into the chosen dot
// The paper (fibres, border) is one cached texture (an Image); the print is a second texture, lifted off by the sweep; the rosette, the
// foil, the map and its type are drawn live.
import { W, H, rgba, clamp, mix, prng, canvas } from '../engine.mjs';
import { Path2D } from '@napi-rs/canvas';
import { stipple } from './art.mjs';
import { guilloche, gBorder, microtext, foilGlint, FOIL, unwind } from './certificate.mjs';
import { outlineLocal } from './map.mjs';
import { once, memo, TAU, sstep, cio, mixHex, setT, amberFill } from './v2_c07_kit.mjs';

export const TICKET = { w: 170, h: 80, perf: 52, ros: [-55, 0], rosR: 21, nums: ['07', '12', '19', '23', '31', '38'], numX: 8, numY: 5, numP: 12.6, box: [10.4, 12.6] };
const INK = '#22304a', ROSE = '#35507e', SEC = '#7d93b8', PAPER = ['#f4ead2', '#ecdfbf', '#dfcda4'];
const RES = 12;   // texture px per mm
export const numX = (i) => TICKET.numX + (i - 2.5) * TICKET.numP;

// the ticket's guilloche rosette (the source of the coast and the graticule in 7.08): 12 lines, cached as point lists
export const rosLines = () => memo('c07ros', () => {
  const G = guilloche({ R: TICKET.rosR * .74, A: TICKET.rosR * .17, B: TICKET.rosR * .07, n: 14, m: 5, lines: 12, steps: 540 });
  const out = []; for (let k = 0; k < G.lines; k++) out.push(G.line(k).map(([x, y]) => [x + TICKET.ros[0], y + TICKET.ros[1]]));
  return out;
});
const strokeL = (g, L) => { g.beginPath(); L.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); };
// part: 'paper' (stock, fibres, border, edge) | 'print' (everything printed except the rosette) | 'back'
function ticketCanvas(part) {
  const { w, h } = TICKET, [c, g] = canvas(w * RES, h * RES), r = prng(part === 'back' ? 23 : 21);
  g.scale(RES, RES); g.translate(w / 2, h / 2);
  if (part !== 'print') {
    const pg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); pg.addColorStop(0, PAPER[0]); pg.addColorStop(.55, PAPER[1]); pg.addColorStop(1, PAPER[2]);
    g.fillStyle = pg; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 2.2); g.fill();
    g.save(); g.clip(); g.lineCap = 'round';
    for (let i = 0; i < 900; i++) { const x = (r() - .5) * w, y = (r() - .5) * h, a = (r() - .5) * 2.4, L = .6 + r() * 2.4, k = r(); g.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .08 + .08 * k); g.lineWidth = .06 + k * .06; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); }
    if (part === 'back') {
      g.save(); g.scale(-1, 1); g.globalAlpha = .1; g.strokeStyle = ROSE; g.lineWidth = .12; for (const L of rosLines()) strokeL(g, L); g.restore(); g.globalAlpha = 1;
      for (let k = 0; k < 9; k++) microtext(g, -60, -18 + k * 4.4, 104, 'KEEP THIS TICKET · PRIZES ARE PAID ON PRESENTATION OF THE TICKET · ', { size: 1.5, col: INK, a: .35, spacing: .12 });
    } else { g.save(); g.translate(-w / 2 + 2, -h / 2 + 2); gBorder(g, 0, 0, w - 4, h - 4, { band: 5, lines: 5, waves: 90, col: ROSE, w: .14, a: .7, radius: 2.5 }); g.restore(); }
    g.restore();
    g.strokeStyle = 'rgba(90,70,40,.4)'; g.lineWidth = .25; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 2.2); g.stroke();
    g.setTransform(1, 0, 0, 1, 0, 0);   // putImageData follows the transform in this canvas: stipple in pixels
    stipple(c, { k: .14, g: 1, seed: part === 'back' ? 9 : 8, mid: false, boost: 1 });
    return c;
  }
  // the print: security lines, title, draw line, number boxes, microtext, stub, perforation
  g.beginPath(); g.roundRect(-w / 2 + 7.5, -h / 2 + 7.5, w - 15, h - 15, 1.5); g.clip();
  g.strokeStyle = rgba(SEC, .22); g.lineWidth = .09;
  for (let k = 0; k < 46; k++) { const y0 = -h / 2 + 1 + k * 1.72; g.beginPath(); for (let x = -w / 2; x <= w / 2; x += .8) { const y = y0 + .55 * Math.sin(x * .32 + k * .7) + .3 * Math.sin(x * .11 - k); x === -w / 2 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  g.strokeStyle = rgba(ROSE, .7); g.lineWidth = .18; for (const rr of [5.2, 5.9]) { g.beginPath(); g.arc(TICKET.ros[0], TICKET.ros[1], rr, 0, TAU); g.stroke(); }
  g.fillStyle = INK; g.font = '600 3.2px "Inter"'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Nº 6', TICKET.ros[0], TICKET.ros[1] + .2);
  g.font = '10px "Instrument Serif"'; g.textBaseline = 'alphabetic';
  const title = 'LOTTERY', sp = 1.3; let tw = 0; for (const ch of title) tw += g.measureText(ch).width + sp; tw -= sp;
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
  g.fillStyle = 'rgba(40,32,22,.16)'; g.fillRect(TICKET.perf - .15, -h / 2, .3, h);
  const sx = (TICKET.perf + w / 2) / 2;
  g.save(); g.translate(sx + 7.5, 0); g.rotate(-Math.PI / 2); g.fillStyle = INK; g.font = '600 3.6px "Inter"'; g.textAlign = 'center'; g.fillText('Nº 041 907', 0, 0); g.restore();
  const G2 = guilloche({ R: 4.6, A: 1.1, B: .45, n: 11, m: 4, lines: 8, steps: 300 }); g.strokeStyle = ROSE; g.lineWidth = .1;
  for (let k = 0; k < G2.lines; k++) strokeL(g, G2.line(k).map(([px, py]) => [px + sx - 3, py - 18]));
  const rb = prng(5); g.fillStyle = INK; for (let yy = 8; yy < 30;) { const bw = .25 + rb() * .7; g.fillRect(sx - 9, yy, 12, bw); yy += bw + .3 + rb() * .5; }
  g.fillStyle = '#1b2033'; for (let y = -h / 2 + 8.4; y < h / 2 - 8; y += 1.8) { g.beginPath(); g.arc(TICKET.perf, y, .42, 0, TAU); g.fill(); }
  return c;
}
const paperTex = () => once('c07tkP', () => ticketCanvas('paper'));
const printTex = () => once('c07tkI', () => ticketCanvas('print'));
const backTex = () => once('c07tkB', () => ticketCanvas('back'));
export function paperWarm() { paperTex(); printTex(); backTex(); }

// ---------------------------------------------------------------- the map (7.08), in ticket mm
const MAPB = { x: -29.5, y: -31.5, w: 23, h: 47 };
// winners: lon, lat (towns weighted roughly by population; schematic)
const WIN = [[18.07, 59.33], [18.3, 59.4], [17.9, 59.25], [18.15, 59.55], [17.64, 59.86], [11.97, 57.71], [12.1, 57.8], [11.9, 57.6], [13.0, 55.6], [13.2, 55.72], [12.7, 56.05], [16.54, 59.61],
  [15.21, 59.27], [15.62, 58.41], [16.19, 58.59], [14.16, 57.78], [14.81, 56.88], [16.36, 56.66], [12.86, 56.67], [13.5, 59.38], [15.63, 60.6], [17.14, 60.67], [17.31, 62.39], [14.64, 63.18],
  [20.26, 63.83], [20.95, 64.75], [22.15, 65.58], [20.23, 67.86], [18.29, 57.64], [12.94, 57.72], [16.92, 58.75], [15.59, 56.16], [13.83, 55.43], [17.6, 61.73], [18.71, 63.29], [16.32, 62.02],
  [13.12, 61.0], [19.2, 66.6], [12.4, 59.0], [14.3, 60.1], [15.1, 58.0], [16.0, 57.2]];
export const DIVE = 22;   // Sundsvall: the camera dives into this dot
const MAP = memo('c07map', () => {
  const o = outlineLocal('SWE', { detail: '50m', n: 3 }), b = o.box, k = Math.min(MAPB.w / b[2], MAPB.h / b[3]);
  const ox = MAPB.x + (MAPB.w - b[2] * k) / 2 - b[0] * k, oy = MAPB.y + (MAPB.h - b[3] * k) / 2 - b[1] * k, cl = Math.cos(o.lat0 * Math.PI / 180);
  const at = (lon, lat) => [ox + (lon - o.lon0) * cl * k, oy - (lat - o.lat0) * k];
  const rings = o.rings.map((r) => r.map(([x, y]) => [ox + x * k, oy + y * k]));
  const grat = [];
  for (let lat = 56; lat <= 68; lat += 2) grat.push([at(10.6, lat), at(24.6, lat)]);
  for (const lon of [12, 16, 20, 24]) grat.push([at(lon, 54.9), at(lon, 69.6)]);
  const lines = grat.map(([a, b2]) => { const out = []; for (let i = 0; i <= 40; i++) out.push([mix(a[0], b2[0], i / 40), mix(a[1], b2[1], i / 40)]); return out; });
  const coast = rings[0].concat([rings[0][0]]);
  return { rings, coast, lines, dots: WIN.map(([lon, lat]) => at(lon, lat)) };
});
const RULER = { u0: -46, u1: 26, v: 20.6 }, rx = (y) => RULER.u0 + y / 22 * (RULER.u1 - RULER.u0);
const SRC = ['CESARINI, LINDQVIST, NOTOWIDIGDO & ÖSTLING (2017), AMERICAN ECONOMIC REVIEW', 'LINDQVIST, ÖSTLING & CESARINI (2020), REVIEW OF ECONOMIC STUDIES'];

// the six numbers in amber foil (leaf pressed into the box from its centre outward: it grows, it does not fade); k0 → the foil gathers
// into the winners' dots during the morph (the boxes shrink while the dots fly)
function foilNumbers(ctx, t, K, f, gather = 0) {
  if (f <= 0) return;
  const [bw, bh] = TICKET.box;
  for (let i = 0; i < 6; i++) {
    const cx = numX(i), cy = TICKET.numY, k = sstep(i * .07, i * .07 + .3, f) * (1 - sstep(i * .06, i * .06 + .55, gather));
    if (k <= .002) continue;
    const rw = bw / 2 * k, rh = bh / 2 * k, box = new Path2D(); box.roundRect(cx - rw, cy - rh, 2 * rw, 2 * rh, 1.2 * k);
    const gr = ctx.createLinearGradient(cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2); FOIL.forEach((c, j) => gr.addColorStop(j / (FOIL.length - 1), c));
    ctx.fillStyle = gr; ctx.fill(box);
    ctx.save(); ctx.clip(box); ctx.font = '600 7.2px "Inter"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#4a2208'; ctx.fillText(TICKET.nums[i], cx + .18, cy + .58); ctx.fillStyle = '#fff1d6'; ctx.fillText(TICKET.nums[i], cx - .1, cy + .3); ctx.fillStyle = '#c87a2c'; ctx.fillText(TICKET.nums[i], cx, cy + .4);
    ctx.restore();
    ctx.strokeStyle = rgba('#7a3b17', .8 * k); ctx.lineWidth = .2; ctx.stroke(box);
    foilGlint(ctx, box, t + i * .05, { x: cx - 14, y: cy, span: 30, width: 4, speed: .55, angle: -.9, a: .9 * k });
  }
  ctx.textBaseline = 'alphabetic';
}
function foilBloom(ctx, M, f) {
  if (f <= .002) return;
  const c = [M[0] * TICKET.numX + M[2] * TICKET.numY + M[4], M[1] * TICKET.numX + M[3] * TICKET.numY + M[5]], r = 52 * Math.hypot(M[0], M[1]);
  const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], r); g.addColorStop(0, rgba('#ffd9a0', .2 * f)); g.addColorStop(.4, rgba('#ffb35c', .09 * f)); g.addColorStop(1, rgba('#ffb35c', 0));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(c[0] - r, c[1] - r, 2 * r, 2 * r); ctx.restore();
}
// the light on the paper as a multiply over the ticket outline
function paperLight(ctx, o) {
  const { w, h } = TICKET, lit = o.lit ?? 1, warm = o.warm ?? 0, edge = new Path2D(); edge.roundRect(-w / 2, -h / 2, w, h, 2.2);
  if (lit < .999) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = mixHex('#2a3150', '#ffffff', lit); ctx.fill(edge); }
  if (warm > .001) { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = mixHex('#ffffff', '#ffd9a8', warm); ctx.fill(edge); }
  if ((o.glint ?? 0) > .001) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#fff1d6', .5 * o.glint); ctx.fill(edge); }
  ctx.globalCompositeOperation = 'source-over';
}
export function drawTicket(ctx, M, t, K, o = {}) {
  const { w, h } = TICKET;
  ctx.save(); setT(ctx, M);
  if (o.back) { ctx.drawImage(backTex(), -w / 2, -h / 2, w, h); paperLight(ctx, o); ctx.restore(); return; }
  ctx.drawImage(paperTex(), -w / 2, -h / 2, w, h);
  ctx.strokeStyle = ROSE; ctx.lineWidth = .13; ctx.globalAlpha = .85; for (const L of rosLines()) strokeL(ctx, L); ctx.globalAlpha = 1;
  ctx.drawImage(printTex(), -w / 2, -h / 2, w, h);
  foilNumbers(ctx, t, K, o.foil ?? 0);
  paperLight(ctx, o);
  ctx.restore();
  foilBloom(ctx, M, (o.foil ?? 0) * (o.lit ?? 1));
}

// ---------------------------------------------------------------- 7.08: the ticket becomes the map; then the dive into one dot
export const sweepAt = (t, K) => mix(-92, 92, cio(clamp((t - K.morph0) / .7)));
export function drawPaperPhase(ctx, M, t, K, o = {}) {
  const { w, h } = TICKET, m0 = K.morph0, sw = sweepAt(t, K), map = MAP;
  ctx.save(); setT(ctx, M);
  ctx.drawImage(paperTex(), -w / 2, -h / 2, w, h);
  // the rosette unwinds into the coast (line 0) and the graticule (lines 1–11), each a little after the one before
  const R = rosLines();
  for (let k = 0; k < R.length; k++) {
    const u = clamp((t - m0 - .04 * k) / .8);
    const L = u <= 0 ? R[k] : unwind(R[k], k === 0 ? map.coast : map.lines[k - 1], u, { n: k === 0 ? 900 : 260, sweep: .55 });
    ctx.strokeStyle = k === 0 ? mixHex(ROSE, INK, u) : ROSE; ctx.lineWidth = k === 0 ? mix(.13, .2, u) : mix(.13, .07, u); ctx.globalAlpha = k === 0 ? mix(.85, .95, u) : mix(.85, .5, u);
    strokeL(ctx, L);
  }
  ctx.globalAlpha = 1;
  // the islands are engraved after the coast (the line grows)
  const ui = clamp((t - m0 - .75) / .35);
  if (ui > 0) for (const r of map.rings.slice(1)) { const n = Math.max(2, Math.round(r.length * ui)); ctx.strokeStyle = INK; ctx.lineWidth = .16; strokeL(ctx, r.slice(0, n).concat(ui >= 1 ? [r[0]] : [])); }
  // the rest of the print is lifted off by the sweep (it goes where the sweep has passed)
  if (sw < w / 2 + 2) { ctx.save(); ctx.beginPath(); ctx.rect(sw, -h, w * 2, h * 2); ctx.clip(); ctx.drawImage(printTex(), -w / 2, -h / 2, w, h); ctx.restore(); }
  // the foil gathers into the winners' dots: each box sends out its dots, which fly to their towns
  const gather = clamp((t - m0 - .1) / .5);
  foilNumbers(ctx, t, K, 1, gather);
  winners(ctx, t, K, M);
  rulerAndType(ctx, t, K);
  paperLight(ctx, { lit: o.lit ?? 1, warm: o.warm ?? 0 });
  ctx.restore();
  if (gather < 1) foilBloom(ctx, M, (1 - gather) * (o.lit ?? 1));
}
function winners(ctx, t, K, M) {
  const map = MAP, n = map.dots.length, m0 = K.morph0;
  for (let j = 0; j < n; j++) {
    const b = j % 6, t0 = m0 + .12 + .018 * j, u = clamp((t - t0) / .55); if (u <= 0) continue;
    const from = [numX(b) + ((j * 7) % 5 - 2) * 1.2, TICKET.numY + ((j * 3) % 5 - 2) * 1.6], to = map.dots[j], e = cio(u);
    const c = [mix(from[0], to[0], .5) - 6, Math.min(from[1], to[1]) - 9], x = (1 - e) ** 2 * from[0] + 2 * (1 - e) * e * c[0] + e * e * to[0], y = (1 - e) ** 2 * from[1] + 2 * (1 - e) * e * c[1] + e * e * to[1];
    const r = j === DIVE ? .62 : .5, gl = 1 + .25 * Math.sin(t * 2.3 + j);
    ctx.fillStyle = rgba('#ffb35c', .16 * gl); ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, TAU); ctx.fill();
    amberFillMM(ctx, x, y, r);
    ctx.strokeStyle = rgba('#7a3b17', .85); ctx.lineWidth = .1; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  }
}
// an amber dot in mm (the same gradient as kit.amberFill, which the dive hands to the workshop bulb)
function amberFillMM(ctx, x, y, r) { amberFill(ctx, x, y, r); }
function typeIn(ctx, str, x, y, u, o = {}) {   // printed letter by letter (no fade): u 0..1
  if (u <= 0) return;
  ctx.font = o.font; ctx.fillStyle = o.col || INK; ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
  try { ctx.letterSpacing = (o.sp ?? 0) + 'px'; } catch { }
  const n = Math.ceil(str.length * clamp(u)), full = ctx.measureText(str).width, x0 = o.align === 'center' ? x - full / 2 : o.align === 'right' ? x - full : x;
  ctx.textAlign = 'left'; ctx.fillText(str.slice(0, n), x0, y);
  try { ctx.letterSpacing = '0px'; } catch { }
}
function rulerAndType(ctx, t, K) {
  const m0 = K.morph0, ur = clamp((t - m0 - .55) / .45), v = RULER.v;
  if (ur > 0) {
    const xe = mix(RULER.u0, RULER.u1, cio(ur));
    ctx.strokeStyle = INK; ctx.lineWidth = .16; ctx.beginPath(); ctx.moveTo(RULER.u0, v); ctx.lineTo(xe, v); ctx.stroke();
    ctx.lineWidth = .1; ctx.beginPath(); for (let y = 0; y <= 22; y++) { const x = rx(y); if (x > xe) break; const L = y % 5 === 0 ? 1.4 : .7; ctx.moveTo(x, v - L); ctx.lineTo(x, v); } ctx.stroke();
    ctx.font = '600 1.9px "Inter"'; ctx.fillStyle = INK; ctx.textAlign = 'center';
    for (const y of [5, 10, 15, 20]) if (rx(y) < xe) ctx.fillText(String(y), rx(y), v + 2.6);
    typeIn(ctx, 'YEARS AFTER THE WIN', RULER.u0, v - 2.3, (t - m0 - .7) / .45, { font: '600 1.75px "Inter"', sp: .25 });
    // the years go by: a small amber marker travels along the ruler while "followed them for years"
    const um = clamp((t - K.follow0) / (K.follow1 - K.follow0)), xm = rx(22 * cio(um));
    if (t > K.follow0 - .3) { ctx.fillStyle = '#c87a2c'; ctx.beginPath(); ctx.moveTo(xm, v - .25); ctx.lineTo(xm - .9, v - 1.9); ctx.lineTo(xm + .9, v - 1.9); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#ffb35c'; ctx.lineWidth = .22; ctx.beginPath(); ctx.moveTo(RULER.u0, v); ctx.lineTo(xm, v); ctx.stroke(); }
  }
  typeIn(ctx, 'SWEDEN', -2.5, -11.5, (t - m0 - .6) / .35, { font: '4.2px "Instrument Serif"', sp: .9 });
  const ul = (t - m0 - .8) / .4;
  if (ul > 0) { amberFill(ctx, 6.2, -24.6, .5); typeIn(ctx, 'LOTTERY WINNERS', 7.6, -23.9, ul, { font: '600 1.8px "Inter"', sp: .2 }); }
  typeIn(ctx, SRC[0], -8, 25.0, (t - m0 - .85) / .5, { font: '600 1.4px "Inter"', align: 'center', col: rgba(INK, .9), sp: .08 });
  typeIn(ctx, SRC[1], -8, 26.8, (t - m0 - 1.05) / .45, { font: '600 1.4px "Inter"', align: 'center', col: rgba(INK, .9), sp: .08 });
  ctx.textAlign = 'left';
}
// the dive: from the top-down camera's affine M0 into the dot (it moves to the frame centre while the zoom runs away)
export function paperM(t, K, M0) {
  if (t <= K.dive0) return M0;
  const d = MAP.dots[DIVE], s0 = [M0[0] * d[0] + M0[4], M0[3] * d[1] + M0[5]], u = clamp((t - K.dive0) / (K.shop0 - K.dive0));
  const e = cio(u), q = M0[0] * Math.exp(Math.log(K.qEnd / M0[0]) * e), c = cio(clamp(u / .7));
  const sx = mix(s0[0], W / 2, c), sy = mix(s0[1], H / 2, c);
  return [q, 0, 0, q, sx - q * d[0], sy - q * d[1]];
}
export const diveR = (K) => (DIVE_R * K.qEnd);   // the dot's radius on screen at the end of the dive (= the bulb's at the start of 7.09)
const DIVE_R = .62;
