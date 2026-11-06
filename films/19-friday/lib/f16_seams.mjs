// Film 16 · seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary, drawn in SCREEN space (after the cards, before the finish; the film-wide camera
// float and the finish apply on top for both sides alike). The handing side steers its last move so its frame converges to the plate
// and draws the plate over everything for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows
// its world out of it (the plate becomes a thing of the new world, never a blend). Both call it with the same t: the seam is invisible
// by construction. Check: tools/seam.mjs at T0 with both chunks (SECS=c01,c02 …), and node tools/seam_plates16.mjs <dir>.
//   Lead → B1 at T.G('A letter from your landlord') (c01 → c02): plateChat   INSIDE THE CHAT BOX. The laptop screen fills the frame:
//            the conversation has scrolled away, only Claude's empty reply field with the blinking cursor. Badge LEVEL 1.
//            B1: pull back, the glass becomes your phone screen in the dark hallway (the box shrinks into the phone), badge 1 → 2.
//   B1 → B2  at T.G("You're still at Anthropic") (c04 → c05): plateButton   THE PAUSE BUTTON, CLOSE. A big round brass button with the
//            two pause bars of warm light fills the centre (r 360) on a dark brass panel. Badge LEVEL 4.
//            B1 (4.07): the one round token of light ("One thing") is pushed into until it is this button. B2: pull back into the control room.
//   B2 → B3  at T.G('Last level') (c08 → c09): plateNib   THE NIB, CLOSE. Lamp-lit paper fills the frame; the fountain pen of light comes in
//            from the upper right, its nib at (930, 600), a fresh line of ink-light runs from x 260 to the nib. Badge LEVEL 6.
//            B2 (8.10): the pen rises out of the training stack, push to the nib. B3: pull back, the pen writes at the lectern (badge 6 → 7).
import { W, H, P, rgba, rad, lin, drift, prng, mixHex, glowFill, halo } from './f10_editorial.mjs';
import { chatUI, level, pen } from './f16_kit.mjs';

export const SEAM_HALF = .5;                      // seconds each side draws the plate
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
// the screen rect of the chat box in plateChat: the handing side must map its chat box exactly here (x, y, w; h = w * .5625)
export const CHAT_PLATE = { x: -24, y: -13.5, w: 1968 };
const badgeOnly = (ctx, t, n) => level(ctx, t, { n, t0: -1e9 });
// a plate is never frozen: a faint, slow light sweep (screen space, a pure function of t, so both sides still match exactly)
const sweep = (ctx, t, col, a = .16) => { ctx.save(); ctx.globalCompositeOperation = 'lighter'; halo(ctx, 960 + 560 * Math.sin(t * .9), 470 + 120 * Math.sin(t * .53), 620, a, col, col); ctx.restore(); };   // a reflection gliding over the glass

// --- Lead → B1: inside the chat box -----------------------------------------------------------------------------------------------
export function plateChat(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  chatUI(ctx, t, CHAT_PLATE.x, CHAT_PLATE.y, CHAT_PLATE.w, { bubbles: [], reply: { a: 1, cursor: 1 }, scroll: 1, t0: 0 });
  sweep(ctx, t, P.blue1);
  badgeOnly(ctx, t, 1);
  ctx.restore();
}

// --- B1 → B2: the pause button ----------------------------------------------------------------------------------------------------
export const BUTTON_PLATE = { x: 960, y: 540, r: 360 };
export function buttonFace(ctx, t, x, y, r, o = {}) {   // also usable in the scenes (the same button at any size)
  const press = o.press ?? 0;
  // the brass ring: warm metal gradient, a lit upper-left edge
  ctx.save();
  ctx.fillStyle = rad(ctx, x - r * .35, y - r * .4, r * 1.6, [[0, P.halo2], [.35, P.halo1], [.7, P.shade0], [1, mixHex(P.shade0, P.night1, .6)]]);
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.core1, .55); ctx.lineWidth = r * .012; ctx.beginPath(); ctx.arc(x, y, r * .985, Math.PI * .95, Math.PI * 1.6); ctx.stroke();
  // the face: dark indigo, slightly sunk
  const fr = r * (.8 - .015 * press);
  ctx.fillStyle = rad(ctx, x - fr * .2, y - fr * .25, fr * 1.3, [[0, mixHex(P.ind2, P.blue1, .35)], [.6, P.ind2], [1, P.night1]]);
  ctx.beginPath(); ctx.arc(x, y, fr, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.night0, .8); ctx.lineWidth = r * .025; ctx.stroke();
  // the two pause bars: warm light (the hero), breathing slightly
  const br = .92 + .08 * Math.sin(t * 1.7), bw = fr * .17, bh = fr * .78;
  for (const sx of [-1, 1]) {
    ctx.beginPath(); ctx.roundRect(x + sx * fr * .24 - bw / 2, y - bh / 2, bw, bh, bw * .3);
    ctx.save(); ctx.shadowColor = rgba(P.halo0, .9 * br); ctx.shadowBlur = fr * .25;
    ctx.fillStyle = lin(ctx, 0, y - bh / 2, 0, y + bh / 2, [[0, P.core0], [.5, P.core1], [1, P.halo0]]); ctx.fill(); ctx.restore();
  }
  ctx.restore();
  halo(ctx, x, y, r * .9, .18 * (o.glow ?? 1), P.halo0, P.core1);
}
export function plateButton(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, W, H, [[0, mixHex(P.night1, P.shade0, .12)], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  // the panel: brushed dark brass with a warm pool from the lamp above
  ctx.fillStyle = rad(ctx, 960, 300, 1300, [[0, rgba(P.shade0, .32)], [.5, rgba(P.shade0, .12)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(0, 0, W, H);
  const r = prng(16); ctx.strokeStyle = rgba(P.halo1, .05); ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) { const y = r() * H; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + (r() - .5) * 8); ctx.stroke(); }
  buttonFace(ctx, t, BUTTON_PLATE.x + 1.5 * drift(t, 1, 3), BUTTON_PLATE.y, BUTTON_PLATE.r);
  badgeOnly(ctx, t, 4);
  ctx.restore();
}

// --- B2 → B3: the nib -------------------------------------------------------------------------------------------------------------
export const NIB_PLATE = { x: 930, y: 600, ang: -.62, L: 980, line0: 260 };
export function plateNib(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  // paper under a lamp: gold-lit fibre, falling to gold shadow at the corners (never grey)
  ctx.fillStyle = rad(ctx, 900, 520, 1250, [[0, P.core1], [.25, P.halo0], [.55, P.halo1], [.85, P.shade0], [1, mixHex(P.shade0, P.night1, .5)]]); ctx.fillRect(0, 0, W, H);
  const r = prng(77); ctx.strokeStyle = rgba(P.shade0, .1); ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) { const x0 = r() * W, y0 = r() * H, l = 20 + r() * 60, a = r() * 6.28; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + Math.cos(a) * l, y0 + Math.sin(a) * l); ctx.stroke(); }
  // the line written so far (ink-light: dark gold stroke with a warm core near the nib)
  const N = NIB_PLATE; ctx.lineCap = 'round';
  ctx.strokeStyle = lin(ctx, N.line0, 0, N.x, 0, [[0, rgba(P.shade0, .8)], [.85, rgba(mixHex(P.shade0, P.ind2, .3), .9)], [1, P.halo0]]); ctx.lineWidth = 5; ctx.beginPath();
  for (let x = N.line0; x <= N.x; x += 6) { const y = N.y + 6 * Math.sin(x * .043) + 2.5 * Math.sin(x * .13); x === N.line0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.stroke();
  pen(ctx, N.x, N.y + 6 * Math.sin(N.x * .043) + 2.5 * Math.sin(N.x * .13), N.ang, N.L, t, { glow: .8 });
  sweep(ctx, t, P.halo0, .05);
  badgeOnly(ctx, t, 6);
  ctx.restore();
}
