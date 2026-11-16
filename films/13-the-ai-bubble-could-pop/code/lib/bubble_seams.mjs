// Film 13 "The AI Bubble Could Pop" · seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary, drawn in screen space (after the camera, before finish). The handing side steers
// its last move so the frame converges to the plate and draws the plate over everything for t in [T0 − .5, T0); the receiving side
// draws the same plate for t in [T0, T0 + .5) and grows its world out of it (never by a blend). Both call it with the same t, so the
// frames on both sides of the cut come from one function: the seam is invisible by construction. Check with tools/seam.mjs.
//
//   c01 | c02  (Lead → B1)  T0 = T.F('In a Yorkshire parsonage')    plateSlit:  the A1 train's door, 8× close, almost shut: dark
//              panel, the warm window band left and right, one vertical slit of warm light at x 1140. B1: the slit widens into the
//              lit window of the parsonage on the moor (the camera keeps pushing; the leaves become the window frame).
//   c05 | c06  (B1 → B2)    T0 = T.F("You'll hear that")            plateBrick: the verdict's short CHIP bar alone on the time axis,
//              centred (x 760–1160, y 520–600), cold. B2: the bar drops and lands as the first brick of the wall.
//   c08 | c09  (B2 → B3)    T0 = T.F('Public money can come')       plateDoor:  a closed cable-duct door, frontal, centred, padlocked,
//              lit from above. B3: the stamp PUBLIC MONEY lands on it and the lock falls.
// Each plate breathes a little with t (light, dust) so the frames are alive but identical on both sides (plateSlit: slitLife).
import { W, H, P, rgba, rad, lin, drift, prng, mixHex, dust, glowText } from './f10_editorial.mjs';
import * as B from './bubble_kit.mjs';
const { COL } = B;

export const SEAM_HALF = .5;                      // seconds each side draws the plate
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
// Every plate keeps a slow push-in (the camera never stops): zoom = exp(PLATE_PUSH · (t − (T0 − SEAM_HALF))) about the plate's focus,
// so it is exactly 1 at T0 − 0.5 (where the handing side lands) and the receiving side continues the push from the plate's speed
// (d zoom/dt = PLATE_PUSH at T0 − 0.5, ≈ 5 %/s). Pass T0 (the seam time) as the 3rd argument; without it the plate is static.
export const PLATE_PUSH = .05;
export const plateZoom = (t, T0) => T0 == null ? 1 : Math.exp(PLATE_PUSH * (t - (T0 - SEAM_HALF)));
const zoomAbout = (ctx, z, cx, cy) => { ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); };
export const SLIT = { x: 1140, y: 540 };                    // screen point of the door slit at c01|c02 (B1 grows the window from here)
export const BRICK = { x0: 760, x1: 1160, y0: 520, y1: 600, axisY: 640 };
export const DOOR = { x0: 790, x1: 1130, y0: 250, y1: 830 };

// --- c01 | c02: the slit of the closed train door ------------------------------------------------------------------------------
// The A1 train of c01 (B.train, nose at TRAIN.nose, rail top TRAIN.y), seen 8× close on its door, the door almost shut (a slit of warm
// light). c01's camera ends EXACTLY here: aim(F0, TRAIN.doorX, TRAIN.doorY, PLATE_S, SLIT.x, SLIT.y) without drift.
export const TRAIN = { nose: 1700, y: 700, len: 1600, h: 130, doorFromNose: 620, slit: .06 };
TRAIN.doorX = TRAIN.nose - TRAIN.doorFromNose;
TRAIN.doorY = ((TRAIN.y - TRAIN.h * .12 - TRAIN.h) + TRAIN.h * .12 + (TRAIN.y - TRAIN.h * .12 - 2)) / 2;   // middle of the door opening
export const PLATE_S = 8;
export function plateSlit(ctx, t, T0) {
  const s = PLATE_S * plateZoom(t, T0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(s, 0, 0, s, SLIT.x - s * TRAIN.doorX, SLIT.y - s * TRAIN.doorY);
  B.train(ctx, TRAIN.nose, TRAIN.y, TRAIN.len, TRAIN.h, t, { dir: 1, door: TRAIN.slit, doorFromNose: TRAIN.doorFromNose, doorX: TRAIN.doorFromNose });
  ctx.restore();
  slitLife(ctx, SLIT.x, SLIT.y, s / PLATE_S, t, 1);
}
// The life of the slit (screen space): the warm light breathes and a few motes drift up through it. Drawn by plateSlit at full
// strength; c01 ramps it in (k 0 → 1) at the projected door point (sc = projected scale / PLATE_S) so the plate is reached without a
// pop, and B1 keeps drawing it (k 1 → 0 or into the window light) while the slit widens.
export function slitLife(ctx, x, y, sc, t, k = 1) {
  if (k <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  const br = .72 + .28 * Math.sin(t * 2.3) * Math.sin(t * .71 + 1);
  ctx.fillStyle = rad(ctx, x, y, 300 * sc, [[0, rgba(P.halo0, .22 * br * k)], [.35, rgba(P.halo1, .09 * br * k)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(x - 300 * sc, y - 300 * sc, 600 * sc, 600 * sc);
  ctx.globalCompositeOperation = 'source-over';
  dust(ctx, 1140, 26, x, y - 40 * sc, 70 * sc, 260 * sc, t, .8 * k, P.core1);
  ctx.restore();
}

// --- c05 | c06: the chip bar, alone ---------------------------------------------------------------------------------------------
export function plateBrick(ctx, t, T0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); zoomAbout(ctx, plateZoom(t, T0), (BRICK.x0 + BRICK.x1) / 2, BRICK.y0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, P.ind0]]); ctx.fillRect(0, 0, W, H);
  const { x0, x1, y0, y1, axisY } = BRICK, br = .95 + .05 * Math.sin(t * 1.7);
  // the time axis (paper ink line, faint) and the cold chip bar on it
  ctx.strokeStyle = rgba(COL.paper1, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(300, axisY); ctx.lineTo(1620, axisY); ctx.stroke();
  ctx.fillStyle = rad(ctx, (x0 + x1) / 2, y0, 700, [[0, rgba(COL.cool2, .14 * br)], [1, rgba(COL.cool2, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(COL.cool2, COL.loss, .35)], [1, COL.loss]]); ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 6); ctx.fill();
  ctx.strokeStyle = rgba(COL.cool, .55 * br); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + 6, y0 + 1); ctx.lineTo(x1 - 6, y0 + 1); ctx.stroke();
  glowText(ctx, 'CHIPS · 3–6 YEARS', (x0 + x1) / 2, y0 - 34, { size: 30, font: 'Inter', weight: 600, col: P.halo2, glow: false, align: 'center' });
  ctx.restore();
}

// --- c08 | c09: the closed duct door --------------------------------------------------------------------------------------------
const RIV = (() => { const r = prng(1409), a = []; for (let i = 0; i < 16; i++) a.push([r(), r()]); return a; })();
export function plateDoor(ctx, t, T0) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); zoomAbout(ctx, plateZoom(t, T0), (DOOR.x0 + DOOR.x1) / 2, (DOOR.y0 + DOOR.y1) / 2);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.7, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  const { x0, x1, y0, y1 } = DOOR, w = x1 - x0, h = y1 - y0, br = .94 + .06 * Math.sin(t * 1.3);
  // the lamp above the door (hero light), the wall it lights
  ctx.fillStyle = rad(ctx, (x0 + x1) / 2, y0 - 60, 820, [[0, rgba(P.halo1, .4 * br)], [.4, rgba(P.shade0, .16 * br)], [1, rgba(P.night0, 0)]]); ctx.fillRect(0, 0, W, H);
  // frame + door leaf (dark steel, lit edge on top), rivets, a handle and the padlock
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(x0 - 26, y0 - 26, w + 52, h + 40);
  ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.ind1, P.shade1, .25)], [.3, P.ind1], [1, P.ind0]]); ctx.fillRect(x0, y0, w, h);
  ctx.fillStyle = rgba(P.halo1, .5 * br); ctx.fillRect(x0, y0, w, 3);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x0 + 24, y0 + 30, w - 48, 4); ctx.fillRect(x0 + 24, y1 - 40, w - 48, 4);
  for (const [u, v] of RIV) { ctx.fillStyle = rgba(P.halo1, .25); ctx.beginPath(); ctx.arc(x0 + 14 + u * (w - 28), v < .5 ? y0 + 14 : y1 - 14, 3, 0, 6.29); ctx.fill(); }
  const hx = x1 - 70, hy = (y0 + y1) / 2;
  ctx.fillStyle = mixHex(P.shade0, P.ind1, .4); ctx.fillRect(hx - 8, hy - 50, 16, 100);
  ctx.strokeStyle = rgba(P.halo1, .8 * br); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(hx, hy + 52, 22, Math.PI, 0); ctx.stroke();   // shackle
  ctx.fillStyle = lin(ctx, hx - 32, hy + 52, hx + 32, hy + 104, [[0, P.halo0], [1, P.shade0]]); ctx.beginPath(); ctx.roundRect(hx - 32, hy + 52, 64, 54, 8); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .7); ctx.beginPath(); ctx.arc(hx, hy + 74, 6, 0, 6.29); ctx.fill(); ctx.fillRect(hx - 2, hy + 76, 4, 14);
  dust(ctx, 1411, 60, (x0 + x1) / 2, y0 + 120, 320, 160, t * .3, .3, P.halo0);
  ctx.restore();
}
