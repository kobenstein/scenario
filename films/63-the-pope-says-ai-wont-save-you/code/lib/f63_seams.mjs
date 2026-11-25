// Film 63 · seam plates between the builder groups (owned by the lead: import, never edit). At a group seam BOTH sides draw the same
// plate for ±SEAM_HALF s round the phrase, with the same slow creep, so the hard entry cut is invisible (tools/seam.mjs proves it).
// The plate is the CARRIER of that seam: the handing side settles into it, the receiving side transforms it into its first motif.
//   Lead → B1  'In May, in Rome'                     plateDisarmed: DISARMED (gold serif) on the night ground, a gold rule under it
//   B1 → B2    'This channel exists for one reason'  plateYes: the @jack repost card with its one word "yes", centre
//   B2 → B3    'In October the Pope'                 plateStays: the mini scale, left BODY · MONEY · TIME with their tags, right empty,
//                                                    WHAT STAYS YOURS? above it
//   end screen (last 15 s)                          endScreen: the scale at rest, both pans full, nobody wins (B3 refines it)
import * as F from './f63_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, expoOut, rise, GOLD, CREAM, PAPER } = F;
export const SEAM_HALF = .5, CREEP = .02;   // 2 %/s push while a plate holds
export const breathe = (t, a = .8) => a * (1 + .09 * Math.sin(t * 1.3));   // the plate's light breathes (both sides use it: no stillness at the seam)
export const SEAMS = { disarmed: 'In May, in Rome', yes: 'This channel exists for one reason', stays: 'In October the Pope' };
export const seamT = (T, k) => T.G(SEAMS[k]);
const creep = (ctx, t, t0, fn) => { const z = 1 + CREEP * (t - t0); F.look(ctx, W / 2, H / 2 - 20, z, fn); };

// ---------------------------------------------------------------- DISARMED
export const DIS = { x: W / 2, y: 520, size: 196 };   // the word's baseline centre and size at the seam
export function disarmedWord(ctx, t, x, y, size, o = {}) {
  const tw = F.measure('DISARMED', size, true);
  F.glowText(ctx, 'DISARMED', x, y, { size, serif: true, align: 'center', col: GOLD.text, glow: true });
  if ((o.rule ?? 1) > 0) F.goldSpan(ctx, [[x - tw / 2, y + size * .2], [x + tw / 2, y + size * .2]], 0, clamp(o.rule ?? 1), { w: 2.2, spark: false });
  if ((o.rule ?? 1) >= 1) {   // a glint runs along the rule, slow (one pass per 2.6 s): the plate is never still
    const g = (t / 2.6) % 1, gx = x - tw / 2 + tw * F.smooth(g), ga = Math.sin(Math.PI * g);
    F.halo(ctx, gx, y + size * .2, 26 + 8 * ga, .75 * ga, P.halo0, P.core0);
  }
  return { w: tw };
}
export function plateDisarmed(ctx, t, T) {
  const t0 = seamT(T, 'disarmed');
  F.night(ctx, t, { glow: [W / 2, 470, 900, breathe(t, .8)] });
  creep(ctx, t, t0, () => disarmedWord(ctx, t, DIS.x, DIS.y, DIS.size));
}
// ---------------------------------------------------------------- "yes"
export const YES = { x: W / 2, y: 470, w: 520, h: 250 };
export function yesCard(ctx, t, x, y, w, h, o = {}) {
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(x - w / 2 + 8, y - h / 2 + 12, w, h, 22); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .55); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, 22); ctx.fill();
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = 2; ctx.stroke();
  F.glowText(ctx, '@jack', x - w / 2 + 34, y - h / 2 + 52, { size: 24, weight: 600, col: P.halo2, glow: false });
  F.glowText(ctx, 'REPOSTING @Pontifex · 26 MAY 2026', x - w / 2 + 34, y + h / 2 - 30, { size: 22, weight: 600, col: rgba(P.cream, .7), glow: false, spacing: .06 });
  F.glowText(ctx, 'yes', x - w / 2 + 34, y + 34, { size: 96, serif: true, col: o.col ?? GOLD.text, glow: true });
  ctx.restore();
}
export function plateYes(ctx, t, T) {
  const t0 = seamT(T, 'yes');
  F.night(ctx, t, { glow: [W / 2, 470, 800, breathe(t, .6)] });
  creep(ctx, t, t0, () => yesCard(ctx, t, YES.x, YES.y, YES.w, YES.h));
}
// ---------------------------------------------------------------- WHAT STAYS YOURS?
export const STAYS = { x: W / 2, y: 470, s: 300 };
export function staysScale(ctx, t, x, y, s, o = {}) {
  const pans = F.scale(ctx, t, x, y, s, { tilt: o.tilt ?? 1, mini: true, labels: ['WHAT IT GIVES YOU', 'WHAT STAYS YOURS'],
    left: (c, px, py, ss) => { const ws = ss * .2; F.weight(c, px - ws * 1.05, py - 2, ws, 'BODY', 1, { size: 22 }); F.weight(c, px, py - 2, ws, 'MONEY', 1, { size: 22 }); F.weight(c, px + ws * 1.05, py - 2, ws, 'TIME', 1, { size: 22 }); },
    right: o.right });
  return pans;
}
export function plateStays(ctx, t, T) {
  const t0 = seamT(T, 'stays');
  F.night(ctx, t, { glow: [W / 2, 520, 900, breathe(t, .7)] });
  creep(ctx, t, t0, () => { staysScale(ctx, t, STAYS.x, STAYS.y, STAYS.s); F.question(ctx, t, 'WHAT STAYS YOURS?', W / 2, 200, 64, { u: 1 }); });
}
// ---------------------------------------------------------------- END SCREEN (last 15 s; B3 refines: the scale at rest, the wall behind it)
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15;
  F.night(ctx, t, { glow: [W / 2, 420, 1000, .8] });
  F.look(ctx, W / 2, 470, 1 + .004 * (t - t0), () => F.scale(ctx, t, W / 2, 330, 330, { tilt: 0,
    left: (c, px, py, s) => F.weight(c, px, py - 2, s * .22, '', 1), right: (c, px, py, s) => F.weight(c, px, py - 2, s * .22, '', 1) }));
}
