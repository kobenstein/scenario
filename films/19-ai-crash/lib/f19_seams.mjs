// Film 19 · seam plates between the builder groups (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary, drawn in SCREEN space (after your cards, before the finish; the film-wide camera
// float and the finish apply on top for both sides alike). The handing side steers its last move so its frame converges to the plate
// and draws the plate over everything for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows
// its world out of it (the plate becomes a thing of the new world, never a blend). Same function, same t: the seam is invisible.
// Check: SECS=cNN,cMM node tools/seam.mjs --at T0, and node tools/seam_plates19.mjs <dir> (stills of the three plates).
//   Lead → B1 at T.G('Mostly, data centers') (c02 → c03): plateBubble  INSIDE THE BUBBLE SKIN: the film fills the frame (cool bands,
//            gold sheen, the red thread), the data-center hall's cool window rows faint behind it.
//            Lead (2.07): push into the bubble over today's dot until the rim lies outside the corners. B1 (3.01): pull back off the skin
//            (the film thins to the frame edges), the hall stands.
//   B1 → B2  at T.G('And if the fall keeps going') (c06 → c07): plateLine  THE PAYSLIP, CLOSE: PAYSLIP card at LINE_PLATE (w 900,
//            tilt −3°), the red line across it left → right, the mailbox light from below.
//   B2 → B3  at T.G('On Black Monday') (c10 → c11): plateNet  UNDER THE ROAD: deck along the top, three pillars (1933 · 1987 centre ·
//            2008), the 1933 net close along the bottom, cold light.
import * as E from './f10_editorial.mjs';
import { RED, COOL, bubble, skinFlood, underRoad, pillar, netSpan } from './f19_kit.mjs';
import { payslip } from './f19_props.mjs';
const { W, H, P, rgba, lin, mixHex, halo } = E;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
const night = (ctx, t) => { ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); ctx.fillRect(0, 0, W, H); E.stars(ctx, 1919, 70, t, [0, 0, W, H], .4); };

// the hall seen through the film: rows of cool windows (also used by sc02 2.07 and B1 3.01 so the hall is the same)
export const HALL = { rows: [430, 520, 610], x0: 120, x1: 1800, step: 64, w: 34, h: 14 };
export function hallRows(ctx, t, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  HALL.rows.forEach((y, r) => { for (let x = HALL.x0, k = 0; x < HALL.x1; x += HALL.step, k++) { const fl = .7 + .3 * Math.sin(t * 1.3 + k * 1.7 + r); ctx.fillStyle = rgba(COOL.mid, .28 * fl); ctx.fillRect(x, y, HALL.w, HALL.h); } });
  ctx.fillStyle = rgba(COOL.edge, .12); ctx.fillRect(0, HALL.rows[2] + 40, W, 3);
  ctx.restore();
}
export const BUBBLE_PLATE = { x: 960, y: 560, r: 1180 };
export function plateBubble(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  night(ctx, t); hallRows(ctx, t, .9);
  bubble(ctx, t, BUBBLE_PLATE.x, BUBBLE_PLATE.y, BUBBLE_PLATE.r, { tremble: .2 });
  skinFlood(ctx, t, .55);
  ctx.restore();
}
export const LINE_PLATE = { x: 960, y: 520, w: 900, tilt: -3 * Math.PI / 180 };
export function plateLine(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  night(ctx, t);
  halo(ctx, 960, 1160, 900, .35);                                    // the mailbox light from below
  payslip(ctx, t, LINE_PLATE.x, LINE_PLATE.y, LINE_PLATE.w, { tilt: LINE_PLATE.tilt, lit: .9, net: .6, red: [0, 1] });
  ctx.restore();
}
export const NET_PLATE = { deckY: 130, pillars: [[330, 'THE GREAT DEPRESSION', '1933'], [960, 'BLACK MONDAY', '1987'], [1590, 'THE FINANCIAL CRISIS', '2008']], netY: 790 };
export function plateNet(ctx, t) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  underRoad(ctx, t, { deckY: NET_PLATE.deckY });
  for (const [x, l, s] of NET_PLATE.pillars) pillar(ctx, t, x, NET_PLATE.deckY, H, x === 960 ? 150 : 110, { label: l, sub: s, lit: x === 960 ? 1 : .4, plateY: 80, size: x === 960 ? 22 : 17 });
  netSpan(ctx, t, [330, 520], [960, 520], { sag: 70, rows: 3, lit: .25, a: .7 });
  netSpan(ctx, t, [960, 520], [1590, 520], { sag: 70, rows: 3, lit: .25, a: .7 });
  netSpan(ctx, t, [-80, NET_PLATE.netY], [2000, NET_PLATE.netY], { sag: 90, rows: 4, lit: .55, depth: 34 });   // the 1933 net, close
  ctx.restore();
}
