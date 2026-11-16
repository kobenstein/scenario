// Film 25 · seam plates between the builder groups + the row world they share (owned by the lead; builders import, never edit).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and
// draws the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it
// (the plate becomes a thing of the new world, never a blend). Both call it with the same (t, T): the seam is invisible by construction.
// Plates keep a slow push (creep, CREEP = 4 %/s from T0 − .5) and a slow truck right (TRUCK 30 px/s); the receiving side continues both.
// Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet25.mjs <dir>
//
//   Lead → B1 at T.G('Ten kinds of work') (c01 → c02): plateJakobRow   JAKOB'S ROW, FALLEN. The night plain; Jakob's nine task stones
//            (MUSIC far … IDEA) lie in a chain, leaning on TOPIC, the one stone of light that stands; Jakob (indigo, headphones) stands
//            beside it in its light, looking at it. Camera JR_CAM (row-world coordinates). Lead (1.19): the camera settles here.
//            B1 (2.01): "Ten kinds of work": rise out of this picture to the RANK ROW (pull back / tilt), the rail is born from it.
//   B1 → B2  at T.G("So here's the puzzle") (c04 → c05): plateStudio   THE STUDIO AFTER J3b. MUSIC … SHOOT run by agents (cool, beads
//            looping), STORYBOARD … TOPIC still his (warm), Jakob on the first ledge (level 1), the lamp low, no ruler.
//            Camera STUDIO_CAM.home. B1 (4.x): J3 climb, J3b the EDIT bead finishes, settle here. B2 (5.01): the puzzle grows out of it.
//   B2 → B3  at T.G('Number two') (c07 → c08): plateRankRow   THE RANK ROW AT No. 3. Ten numbered stones on the plain (No. 10 far …
//            No. 1 near, made of light), No. 10 … 4 lie flat, No. 3 stands but trembles ("holds for years, not forever"),
//            No. 2 and No. 1 stand. The rank rail (top left) shows No. 3. Camera RR_CAM.
import * as E from './f10_editorial.mjs';
import * as F from './f25_kit.mjs';
const { P, clamp, span, sineIO } = E;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
// plates also truck sideways a little (TRUCK design px per second of creep), so dark plates never read as a still
export const TRUCK = 30;
const tr = (k) => TRUCK * (k - 1) / CREEP;

// ================================================================================================================= THE ROW WORLD
// one night plain, two rows. Coordinates: row-world design px (camera cam3() = the thumbnail view of ROW1).
//   ROW1 = the hook's row (14 task stones; stone 0 = the stone of light, "the last human job"); the viewer (du) stands left of it.
//   ROW2 = Jakob's row, JR_DX further right (a rigid shift: drawn with camera x − JR_DX): TOPIC (light) near, then IDEA … MUSIC.
//   Two receding rows on one plain would interleave, so only one is drawn at a time (st.rows: 1 | 2); switch while the camera
//   is up in the sky (both rows below the frame), e.g. during the hook's Stanford field.
export const ROW1_GLYPHS = [null, 'email', 'report', 'translate', 'code', 'chat', 'form', 'invoice', 'calendar', 'image', 'draft', 'analysis', 'voice', 'scan'];
export const ROW1 = F.row({ n: 14, glyphs: ROW1_GLYPHS });
export const ROW2_GLYPHS = ['topic', 'idea', 'script', 'storyboard', 'shoot', 'edit', 'animation', 'sound', 'music'];
export const ROW2 = F.row({ n: 9, glyphs: ROW2_GLYPHS });
export const JR_DX = 2600;
export const DU1 = { x: 700, y: 878, h: 150 };          // the viewer at ROW1 (row-world)
export const JAKOB2 = { x: 650, y: 878, h: 196 };       // Jakob at ROW2 (ROW2-local, i.e. + JR_DX in the row world)
export const SKY_GLOW = [1300, 520, 900];
const FALLEN = (R) => F.cascade(1e4, R, 0, { stopAt: 0 }).a;
export const ROW1_FALLEN = FALLEN(ROW1), ROW2_FALLEN = FALLEN(ROW2);
export const shift = (c, dx) => ({ ...c, x: c.x - dx });

// draw the row world with camera c. st (all optional):
//   a1 / a2: angles per stone (null = standing) · cool1 / cool2: [0..1] the stone's task glyph has been taken (cool) · lit1 / lit2:
//   [0..1] warm glyph · gold1, gold2 (stone 0 made of light, default 1) · du: { a, look } or false · jakob: { a, look } or false ·
//   glyphA1/2 · each1 / each2 (i, s) → extra stone options
export function rowWorld(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: SKY_GLOW }); F.plain(ctx, c, t);
  const opt = (cool, lit, gold, each) => (i, s) => (i === 0 ? { gold, glyph: gold > .5 ? null : s.glyph, ...(each ? each(i, s) : {}) }
    : { glyphWarm: clamp(lit?.[i] ?? 0) * (1 - clamp(cool?.[i] ?? 0)), dark: .25 * clamp(cool?.[i] ?? 0), ...(each ? each(i, s) : {}) });
  if ((st.rows ?? 1) === 1) {
    F.drawRow(ctx, c, t, ROW1, st.a1 ?? null, { each: opt(st.cool1, st.lit1, st.gold1 ?? 1, st.each1) });
    if (st.du !== false) E.card(ctx, c, E.F0, () => E.du(ctx, DU1.x, DU1.y, DU1.h, { look: st.du?.look ?? .3, light: 1 }));
    return;
  }
  const c2 = shift(c, JR_DX);
  if (st.jakob) E.card(ctx, c2, E.F0, () => F.pool(ctx, JAKOB2.x + 120, JAKOB2.y + 4, 330, 46, st.jakob.a ?? 1));
  F.drawRow(ctx, c2, t, ROW2, st.a2 ?? null, { each: opt(st.cool2, st.lit2 ?? ROW2.stones.map(() => 1), st.gold2 ?? 1, st.each2) });
  if (st.jakob) E.card(ctx, c2, E.F0 * 1.01, () => F.jakob(ctx, t, JAKOB2.x, JAKOB2.y, JAKOB2.h, { look: st.jakob.look ?? .15, dir: 1, light: 1, seed: 2 }));
}
// the camera on Jakob's row at the seam (row-world coordinates): Jakob + TOPIC left of centre, the fallen chain receding right
export const JR_CAM = E.aim(E.F0, JR_DX + 1010, 560, 1.06);
export const JR_STATE = { rows: 2, a1: ROW1_FALLEN, a2: ROW2_FALLEN, cool1: ROW1.stones.map(() => 1), cool2: ROW2.stones.map((s) => (s.i ? 1 : 0)), du: false, jakob: { look: .12 } };
export function plateJakobRow(ctx, t, T) {
  const k = creep(t, T, 'Ten kinds of work');
  rowWorld(ctx, E.aim(E.F0, JR_DX + 1010 + tr(k), 560, 1.06 * k), t, JR_STATE);
}

// ================================================================================================================= THE STUDIO
export const STUDIO_AFTER_J3B = { taken: [1, 1, 1, 1, 1, 0, 0, 0, 0], level: 1, beads: 1, lampA: .35, conduct: 0 };
export function plateStudio(ctx, t, T) {
  const k = creep(t, T, "So here's the puzzle");
  F.studio(ctx, E.aim(E.F0, 960 + tr(k), 540, k), t, STUDIO_AFTER_J3B);
}

// ================================================================================================================= THE RANK ROW
// ten numbered stones, No. 10 far … No. 1 near (gold). Wide gaps: a falling stone lies flat without touching its neighbour.
export const RANK_GLYPHS = ['person', 'care', 'wrench', 'steth', 'teach', 'analysis', 'image', 'form', 'voice', 'desk'];   // No. 1 … No. 10
export const RANKROW = F.row({ n: 10, x: 520, y: 905, h: 520, gap: .9, k: .72, glyphs: RANK_GLYPHS });
// angle of stone No. n at time t (u = 0..1 how far its fall has run): ranks ≥ 4 lie flat once fallen, 3 trembles, 2 / 1 stand
export const rankLie = (n) => (n >= 4 ? Math.PI / 2 - .015 : 0);
export const RR_CAM = E.aim(E.F0, 1350, 620, .66);
export function rankRow(ctx, c, t, o = {}) {
  // o.fall(n) → angle (default: rankLie) · o.num (numbers on the faces, default on) · o.gold (No. 1, default 1)
  F.sky(ctx, c, t, { glow: SKY_GLOW }); F.plain(ctx, c, t);
  F.drawRow(ctx, c, t, RANKROW, RANKROW.stones.map((s) => (o.fall ? o.fall(s.i + 1) : rankLie(s.i + 1))), {
    each: (i) => (i === 0 ? { gold: o.gold ?? 1, glyph: null, num: 1 } : { num: o.num === false ? null : i + 1, dark: (o.fall ? o.fall(i + 1) : rankLie(i + 1)) > 1 ? .3 : 0 }),
  });
}
export function plateRankRow(ctx, t, T) {
  const k = creep(t, T, 'Number two');
  rankRow(ctx, E.aim(E.F0, 1350 + tr(k), 620, .66 * k), t, { fall: (n) => (n === 3 ? .035 + .012 * Math.sin(t * 2.3) : rankLie(n)) });
  F.rankRail(ctx, t, T);
}
