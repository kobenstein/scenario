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
//              rings, flat on a room's back wall (GENIUS_WALL). Draw the voice-light in the world with the same o (talk .25) and t. Lead flies into the voice-light next door; B1 pulls back: it hovers over the kitchen table, 07:30.
//   B1 → B2    "Four o'clock" (c05 → c06)     plateWindow   Dad's lit window (300 × 380, centred) in his dark facade (WINDOW_PLATE).
//              B1 pushes to Dad's window at the end of 5.06; B2 pulls back: the clock is 16:00, you walk over.
//   B2 → B3    'And today you say' (c08 → c09) plateWall    THE KITCHEN at CAM_WALL, 19:30, lamp on, the light wall empty (no scan, no
//              explainer), nobody inside the frame (seated people sit out of this frame or leave it before T0 − .5). This plate is the WORLD
//              itself (K.world at K.CAM_WALL with WALL_STATE), so both sides can simply hold CAM_WALL and the same state around T0.
//   B3 → Lead  'Ten-thirty' (c11 → c12)       plateNotebook THE KITCHEN at CAM_NOTEBOOK, 22:30: the notebook propped open on the table,
//              'Because people kept asking.' in gold handwriting, moon-cool. A world plate (like plateWall). B3 pushes in to it at the end
//              of 11.06; the lead pulls back to the sleeping kid (22:30).
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
const { W, H, P, rgba, rad, lin, mixHex } = E;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
export const SEAM_PHRASE = { genius: 'Seven-thirty', window: "Four o'clock", wall: 'And today you say', notebook: 'Ten-thirty' };
export const seamT = (T, key) => T.G(SEAM_PHRASE[key]);

// ---- Lead → B1: the voice-light close -------------------------------------------------------------------------------------------
export const GENIUS_PLATE = { x: 960, y: 500, r: 150 };
// the background is the back wall of a room at the voice-light's height (room() colours, early morning): both sides' worlds converge on it
export const GENIUS_WALL = mixHex(mixHex(P.night1, P.ind1, .55), mixHex(P.night1, P.ind0, .3), .745);
export function plateGenius(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = GENIUS_WALL; ctx.fillRect(0, 0, W, H);
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

// ---- B3 → Lead: the notebook page (a WORLD plate, like plateWall) -------------------------------------------------------------
// The kid's notebook stands open, propped up on the back half of the kitchen table, facing the camera (NOTEBOOK_WORLD, world units).
// CAM_NOTEBOOK frames it exactly as NOTEBOOK_PLATE (spine centre at (960, 560), both pages 2300 px wide). The plate is the world at
// 22:30 (NOTEBOOK_STATE: lamp low, light wall dark, moon) + the notebook with its two lines. Both sides hold CAM_NOTEBOOK (no drift)
// for t in [T0 − .5, T0 + .5) and draw NOTEBOOK_STATE; other things (the sleeping kid, the pea, the phone) sit out of this frame.
// notebookItem(t, o) → [Z, fn] for kitchen.people, so a scene can draw the same notebook inside its own world state.
export const NOTEBOOK_PLATE = { x: 960, y: 560, w: 2300, line1: 'Why did it go well?', line2: 'Because people kept asking.' };
const KY = K.KITCHEN.floor;
export const NOTEBOOK_WORLD = { X: -1280, Y: KY - 62 - 2300 * .36 / 2 / (2300 / 60) - 1.2, Z: K.ZB - 150, w: 60 };   // spine centre; pages' foot on the table top
export const CAM_NOTEBOOK = K.look(NOTEBOOK_WORLD.X, NOTEBOOK_WORLD.Y, NOTEBOOK_WORLD.Z, NOTEBOOK_PLATE.w / NOTEBOOK_WORLD.w, NOTEBOOK_PLATE.x, NOTEBOOK_PLATE.y);
export const NOTEBOOK_INK = mixHex(P.night0, P.ind1, .45);   // line 1, the kid's pencil (dark, reads on K.NOTEBOOK_MOON_PAGE)
export function notebookItem(t, o = {}) {
  const N = NOTEBOOK_WORLD, k = N.w / NOTEBOOK_PLATE.w, l1 = o.line1 ?? 1, l2 = o.line2 ?? 1;
  return [N.Z, (cx) => {
    K.notebook(cx, N.X, N.Y, N.w, t, { moon: o.moon ?? true });
    if (l1 > 0) K.handwrite(cx, NOTEBOOK_PLATE.line1, N.X + 90 * k, N.Y - 150 * k, 64 * k, l1, { col: NOTEBOOK_INK, glow: false });
    if (l2 > 0) K.handwrite(cx, NOTEBOOK_PLATE.line2, N.X + 90 * k, N.Y + 20 * k, 76 * k, l2, { col: P.halo0 });
  }];
}
export const NOTEBOOK_STATE = { hour: 22.5, you: { hallLamp: .55, kitchen: { lamp: .35, wall: 0, scan: null, phone: null } } };
export function plateNotebook(ctx, t) {
  K.world(ctx, CAM_NOTEBOOK, t, { ...NOTEBOOK_STATE, you: { ...NOTEBOOK_STATE.you, kitchen: { ...NOTEBOOK_STATE.you.kitchen, people: [notebookItem(t)] } } });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);   // the moon's light from the open front (upper right): a cool breath on the page
  ctx.fillStyle = rad(ctx, 1500, 120, 900, [[0, rgba(K.COOL.mid, .12 + .02 * Math.sin(t * .7))], [1, rgba(K.COOL.mid, 0)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
export const PLATES = { genius: plateGenius, window: plateWindow, wall: plateWall, notebook: plateNotebook };
