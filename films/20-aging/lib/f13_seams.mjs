// Film 13 · seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary, drawn in screen space (after the camera, before finish). The handing builder
// steers its last move so the frame converges to the plate and draws the plate over everything for t in [T0 - .5, T0); the
// receiving builder draws the same plate for t in [T0, T0 + .5) and grows its world out of it. Both call it with the same t, so the
// frames on both sides of the cut come from one function: the seam is invisible by construction. Check with tools/seam.mjs.
//   B1 → B2 at T.seg('s10').start (c06 → c07): INSIDE THE GLASS. The push into the hourglass ends in its lower bulb: gold haze, the
//            sand thread falls straight down the middle. B2: the thread becomes the river of Battle Creek seen from above.
//   B2 → B3 at T.seg('s18').start (c10 → c11): THE SHEET, CLOSE. The frame is filled by the sheet of light under a lamp, the second
//            written line just finished. B3: the camera rises, the sheet is the tablecloth of the evening table.
import { W, H, P, rgba, rad, lin, drift, prng, mixHex } from './f10_editorial.mjs';

export const SEAM_HALF = .5;                      // seconds each side draws the plate
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;

const GR = (() => { const r = prng(1307), g = []; for (let i = 0; i < 90; i++) g.push([r(), r() * 2 - 1, .8 + r() * 1.6, r()]); return g; })();

// --- B1 → B2: inside the glass -------------------------------------------------------------------------------------------------
export function plateGlass(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  const cy = 470 + 6 * drift(t, 1, 3);
  // the lit sand fills the bulb with gold that sinks through gold shadow into the night (no grey: never gold over blue at half alpha)
  ctx.fillStyle = rad(ctx, 960, cy, 1150, [[0, P.halo0], [.14, P.halo1], [.3, mixHex(P.shade0, P.ind1, .35)], [.5, P.ind1], [.75, P.ind0], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  // the curved glass wall: one thin cream highlight on the left, a fainter one on the right
  ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(P.core1, .32); ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(960, 640, 760, 760, 0, Math.PI * .78, Math.PI * 1.18); ctx.stroke();
  ctx.strokeStyle = rgba(P.core1, .14); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(960, 640, 760, 760, 0, -Math.PI * .16, Math.PI * .1); ctx.stroke();
  // the thread: glow, body, core, straight down the middle
  const x = 960 + 1.5 * drift(t * .7, 1, 9);
  for (const [w, a, c, b] of [[26, .22, P.halo1, 12], [7, .7, P.halo0, 0], [2.4, 1, P.core0, 0]]) {
    ctx.save(); if (b) ctx.filter = `blur(${b}px)`; ctx.strokeStyle = rgba(c, a); ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x, -20); ctx.lineTo(x, H + 20); ctx.stroke(); ctx.restore();
  }
  // grains falling along the thread (constant mechanical speed is allowed for the stream)
  for (const [u, s, r, ph] of GR) {
    const y = ((u * (H + 80) + t * 420 * (.8 + .4 * ph)) % (H + 80)) - 40;
    ctx.fillStyle = rgba(P.core1, .55 + .4 * ph); ctx.beginPath(); ctx.arc(x + s * 9, y, r, 0, 6.29); ctx.fill();
  }
  ctx.restore();
}

// --- B2 → B3: the sheet, close -------------------------------------------------------------------------------------------------
export function plateSheet(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  const ex = 190 + 4 * drift(t, 1, 5);                                            // the sheet's left edge
  // soft shadow of the sheet on the dark ground, then the sheet lit from above (lamp at top centre)
  ctx.fillStyle = lin(ctx, ex - 70, 0, ex, 0, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .9)]]); ctx.fillRect(ex - 70, 0, 70, H);
  ctx.fillStyle = rad(ctx, 1000, 260, 1300, [[0, P.core1], [.22, P.halo0], [.55, P.halo1], [.85, P.shade0], [1, P.shade1]]); ctx.fillRect(ex, 0, W - ex, H);
  ctx.fillStyle = rad(ctx, 1000, 300, 1250, [[.5, rgba(P.night1, 0)], [1, rgba(P.night1, .55)]]); ctx.fillRect(ex, 0, W - ex, H);   // the lamp's pool ends in the dark
  // paper fibres (seeded, still) so the sheet is a material, not a fill
  const r = prng(77); ctx.strokeStyle = rgba(P.shade0, .1); ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) { const x0 = ex + r() * (W - ex), y0 = r() * H, l = 20 + r() * 60, a = r() * 6.28; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(a) * l, y0 + Math.sin(a) * l); ctx.stroke(); }
  // the two written lines: gold strokes (handwriting reads as a gentle wave), the second one just finished
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [y, x1] of [[330, 1460], [430, 1240]]) {
    ctx.strokeStyle = rgba(P.shade0, .85); ctx.lineWidth = 5; ctx.beginPath();
    for (let x = 380; x <= x1; x += 6) { const yy = y + 7 * Math.sin(x * .045) + 3 * Math.sin(x * .13); x === 380 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.stroke();
  }
  // the lamp's light breathes very slightly
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 1000, 220, 700, [[0, rgba(P.core1, .1 + .03 * Math.sin(t * 1.3))], [1, rgba(P.core1, 0)]]); ctx.fillRect(ex, 0, W - ex, H);
  ctx.restore();
}
