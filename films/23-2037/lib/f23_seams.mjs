// Film 23 · seam plates between the builder groups (owned by the lead; builders import, never edit). docs/MOTION.md §10.
// A plate is the EXACT picture at a group boundary T0. The handing side steers its last move so its frame converges onto the plate and
// draws the plate over everything for t in [T0 − SEAM_HALF, T0); the receiving side draws the same plate for t in [T0, T0 + SEAM_HALF)
// and grows its world out of it (the plate becomes a thing of the new world, never a blend). Both call it with the same t, so the seam
// is invisible by construction. The film draws the HUD (clock, cards) over the plates, unchanged across the seam.
// Check: SECS=cNN,cMM node tools/seam.mjs --at T0 (both chunks), and the contact frames at T0 ± .5.
//
//   T0 = seamT(T, 'genius' | 'window' | 'wall' | 'notebook')     the seam time from the phrase (robust T.G)
//   seamWindow(t, T0) → true while the plate is drawn (both sides)
//
//   Lead → B1  'Seven-thirty' (c02 → c03)     plateGenius   the tutor's voice-light close: cool sphere r 150 at (960, 500), three slow
//              rings, the dark kid's room. Lead flies into the voice-light next door; B1 pulls back: it hovers over the kitchen table, 07:30.
//   B1 → B2    "Four o'clock" (c05 → c06)     plateWindow   Dad's lit window (300 × 380, centred) in his dark facade (WINDOW_PLATE).
//              B1 pushes to Dad's window at the end of 5.06; B2 pulls back: the clock is 16:00, you walk over.
//   B2 → B3    'And today you say' (c08 → c09) plateWall    THE KITCHEN at CAM_WALL, 19:30, lamp on, the light wall empty (no scan, no
//              explainer), nobody inside the frame (seated people sit out of this frame or leave it before T0 − .5). This plate is the WORLD
//              itself (K.world at K.CAM_WALL with WALL_STATE), so both sides can simply hold CAM_WALL and the same state around T0.
//   B3 → Lead  'Ten-thirty' (c11 → c12)       plateNotebook the notebook page close, 'Because people kept asking.' in gold handwriting,
//              moon-cool light. B3 ends 11.05 on it; the lead pulls back to the sleeping kid (22:30).
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
const { W, H, P, rgba, rad, lin, mixHex } = E;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
export const SEAM_PHRASE = { genius: 'Seven-thirty', window: "Four o'clock", wall: 'And today you say', notebook: 'Ten-thirty' };
export const seamT = (T, key) => T.G(SEAM_PHRASE[key]);

// ---- Lead → B1: the voice-light close -------------------------------------------------------------------------------------------
export const GENIUS_PLATE = { x: 960, y: 500, r: 150 };
export function plateGenius(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, mixHex(P.night1, P.ind1, .4)], [1, P.night1]]); ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rad(ctx, 960, 980, 900, [[0, rgba(K.COOL.deep, .35)], [1, rgba(K.COOL.deep, 0)]]); ctx.fillRect(0, 0, W, H);   // its light on the table below
  K.voiceLight(ctx, GENIUS_PLATE.x, GENIUS_PLATE.y, GENIUS_PLATE.r, t, { talk: .25 });
  ctx.restore();
}

// ---- B1 → B2: Dad's window ------------------------------------------------------------------------------------------------------
export const WINDOW_PLATE = { x: 960, y: 520, w: 300, h: 380 };
export function plateWindow(ctx, t) {
  const Wp = WINDOW_PLATE, x0 = Wp.x - Wp.w / 2, y0 = Wp.y - Wp.h / 2;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.ind2, P.blue0, .25)], [1, mixHex(P.night1, P.ind1, .3)]]); ctx.fillRect(0, 0, W, H);   // the facade
  ctx.fillStyle = rgba(P.night0, .35); for (const [x, y] of [[300, 120], [1620, 120], [300, 760], [1620, 760]]) ctx.fillRect(x - 110, y, 220, 280);   // dark neighbours' windows
  ctx.fillStyle = rad(ctx, Wp.x, Wp.y, Wp.h * 1.1, [[0, rgba(K.WARM.mid, .45)], [1, rgba(K.WARM.deep, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + Wp.h, [[0, K.WARM.hi], [1, K.WARM.mid]]); ctx.fillRect(x0, y0, Wp.w, Wp.h);
  ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(Wp.x - 5, y0, 10, Wp.h); ctx.fillRect(x0, y0 + Wp.h * .42, Wp.w, 10); ctx.fillRect(x0 - 16, y0 + Wp.h, Wp.w + 32, 16);
  ctx.fillStyle = rgba(K.WARM.deep, .55); ctx.beginPath(); ctx.ellipse(x0 + 60, y0 + Wp.h - 40, 40, 70, 0, 0, 6.29); ctx.fill();   // a plant on the sill (inside)
  ctx.restore();
}

// ---- B2 → B3: the empty light wall (the world itself) -----------------------------------------------------------------------------
export const WALL_STATE = { hour: 19.5, you: { hallLamp: 1, kitchen: { lamp: 1, wall: .35, scan: null, phone: null } } };
export function plateWall(ctx, t) { K.world(ctx, K.CAM_WALL, t, WALL_STATE); }

// ---- B3 → Lead: the notebook page --------------------------------------------------------------------------------------------------
export const NOTEBOOK_PLATE = { x: 960, y: 560, w: 2300, line1: 'Why did it go well?', line2: 'Because people kept asking.' };
export function plateNotebook(ctx, t) {
  const N = NOTEBOOK_PLATE;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  K.notebook(ctx, N.x, N.y, N.w, t, { moon: true });
  K.handwrite(ctx, N.line1, N.x + 90, N.y - 150, 64, 1, { col: mixHex(P.shade0, P.ind1, .3), glow: false });
  K.handwrite(ctx, N.line2, N.x + 90, N.y + 20, 76, 1, { col: P.halo0 });
  ctx.fillStyle = rad(ctx, 1500, 120, 900, [[0, rgba(K.COOL.mid, .14)], [1, rgba(K.COOL.mid, 0)]]); ctx.fillRect(0, 0, W, H);   // the moon's light
  ctx.restore();
}
export const PLATES = { genius: plateGenius, window: plateWindow, wall: plateWall, notebook: plateNotebook };
