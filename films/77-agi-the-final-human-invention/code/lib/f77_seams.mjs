// Film 77 · seam plates between the builder groups (owned by the lead: import, never edit). At a group seam BOTH sides draw the same
// plate for ±SEAM_HALF s round the phrase, with the same slow creep, so the hard entry cut is invisible (tools/seam.mjs proves it).
// The plate is the CARRIER of that seam: the handing side settles into it, the receiving side transforms it into its first motif.
//   Lead → B1  'Here is the promise'                  plateBand: GOOD'S SENTENCE as a band, front half gold (the promise), back half under
//                                                     the dashed cream cover (the condition); you small under the cover, looking up
//   B1 → B2    "So why isn't it in the power lines"   plateSample: the grey superconductor sample in its measuring holder, four gold probes
//   B2 → B3    "That's the fourth line"               plateTuring: the Turing card, "take control" lit gold
//   end screen (last 15 s, T.duration − 15)          endScreen: THE BOARD left of centre: ENERGY · MATERIALS · DISCOVERY gold (BEGUN),
//                                                     row 4 written: HOW TO STEER IT. The right half and the lower band stay FREE (YouTube end screen)
import * as F from './f77_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, expoOut, rise, GOLD, CREAM, PAPER } = F;
export const SEAM_HALF = .5, CREEP = .02;   // 2 %/s push while a plate holds
export const breathe = (t, a = .8) => a * (1 + .09 * Math.sin(t * 1.3));   // the plate's light breathes (both sides use it: no stillness at the seam)
export const SEAMS = { band: 'Here is the promise', sample: "So why isn't it in the power lines", turing: "That's the fourth line" };
export const seamT = (T, k) => T.G(SEAMS[k]);
// the plate's camera: a slow push about (W/2, H/2 − 20), z = 1 at the seam phrase. Draw in it from the moment your motif settles.
export const creepZ = (t, t0) => 1 + CREEP * (t - t0);
export const creep = (ctx, t, t0, fn) => F.look(ctx, W / 2, H / 2 - 20, creepZ(t, t0), fn);

// ---------------------------------------------------------------- GOOD'S SENTENCE (the band)
export const BAND = { x: W / 2, y: 410, w: 1640, h: 210 }, BAND_YOU = { x: 1290, y: 912, h: 150, walk: Math.PI * 2 };   // you stand side-on, weight on one leg (= the walk pose at phase 2π)
export const bandGlow = (t) => [W / 2, 440, 950, breathe(t, .7)];
export function bandState(ctx, t, o = {}) {   // the band + you, exactly as on the plate (o overrides: type, gold, cover, coverOff, reveal …)
  const b = F.band(ctx, t, BAND.x, BAND.y, BAND.w, BAND.h, { u: 1, type: 1, gold: 1, cover: 1, empty: 0, ...o });
  if (o.you !== false) F.du(ctx, o.youX ?? BAND_YOU.x, BAND_YOU.y, BAND_YOU.h, { dir: -1, look: o.look ?? 1, lean: -.03, walk: o.walk ?? BAND_YOU.walk, armR: [0, .3], armL: [0, .3], ...(o.youO ?? {}) });
  return b;
}
export function plateBand(ctx, t, T) {
  const t0 = seamT(T, 'band');
  F.night(ctx, t, { glow: bandGlow(t) });
  creep(ctx, t, t0, () => bandState(ctx, t));
}
// ---------------------------------------------------------------- THE SAMPLE (superconductor, line 2)
export const SAMPLE = { x: W / 2, y: 500, s: 120 };
export const sampleGlow = (t) => [W / 2, 470, 850, breathe(t, .65)];
export function plateSample(ctx, t, T) {
  const t0 = seamT(T, 'sample');
  F.night(ctx, t, { glow: sampleGlow(t) });
  creep(ctx, t, t0, () => F.sample(ctx, t, SAMPLE.x, SAMPLE.y, SAMPLE.s, { probes: 1, cold: .45 + .1 * Math.sin(t * 1.3) }));
}
// ---------------------------------------------------------------- THE TURING CARD
export const TURING = { text: 'At some stage therefore we should have to expect the machines to take control …', credit: 'Alan Turing, 1951', w: 1180, size: 56, y: 330 };
export function turingCard(ctx, t, o = {}) {
  return F.quoteCard(ctx, t, null, { text: TURING.text, credit: TURING.credit, w: TURING.w, size: TURING.size, y: o.y ?? TURING.y, x: o.x, u: o.u ?? 1, hi: ['take', 'control'], hiU: o.hiU ?? 1, rot: -.006 });
}
export function plateTuring(ctx, t, T) {
  const t0 = seamT(T, 'turing');
  F.night(ctx, t, { glow: [W / 2, 500, 950, breathe(t, .55)] });
  creep(ctx, t, t0, () => turingCard(ctx, t));
}
// ---------------------------------------------------------------- END SCREEN (last 15 s; B3 refines): THE BOARD left, the rest free
export const END = { x: 110, y: 230, w: 660, rowH: 92 };
export const endRows = (u4 = 1) => [
  { text: 'ENERGY', status: 'BEGUN', gold: 1 }, { text: 'MATERIALS', status: 'BEGUN', gold: 1 }, { text: 'DISCOVERY', status: 'BEGUN', gold: 1 },
  { text: 'HOW TO STEER IT', from: '', flip: u4, gold: .85 * u4, lit: .5 * u4 },
];
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15;
  F.night(ctx, t, { glow: [440, 470, 900, breathe(t, .7)] });
  F.look(ctx, W / 2, H / 2, 1 + .004 * (t - t0), () => {   // identity camera: the board stays LEFT, the right half and the lower band stay free
    F.ring(ctx, t, END.x + END.w / 2, END.y + 2 * END.rowH + 40, 330, { u: 1, lit: .35 + .1 * Math.sin(t * 1.1) });
    F.board(ctx, t, END.x, END.y, { w: END.w, rowH: END.rowH, title: 'THE FOUR LINES', cells: 15, rows: endRows(1) });
  });
}
