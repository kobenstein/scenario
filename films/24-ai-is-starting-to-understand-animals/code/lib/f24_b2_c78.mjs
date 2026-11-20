// Film 24 · B2 · the stretch that straddles c07 | c08: the subscribe scene (the elephant family at dusk) closes back into its medallion
// over the dimmed night map (the explainer field, on California). Called by BOTH sc07 and sc08 (boundary T.G('But suppose they make it')).
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import * as B from './f24_b2_world.mjs';
import * as Hb from './f24_b2_habitats.mjs';
const { W, H, P, clamp, lerp, span, sineIO, expoOut } = E;

export const CALQ = F.mapView(-104, 35.5, 3.6);   // the field after the Alaska clip: California with the gold ESP pin, left of centre
export const MED_E = [960, 600], MED_R = 74;        // the elephant medallion of 7.15 (its iris is the subscribe scene)
export function duskTimes(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.alaskaOut = G('And the Earth Species Project admits') - .55; a.calq = a.alaskaOut + 2.7;   // the flight Alaska → California ends here
  a.channel = G('This channel exists'); a.subscribeE = GE('Then subscribe');
  a.suppose = G('But suppose they make it');
  a.de0 = a.channel - .55; a.de1 = a.de0 + 2.8;          // the elephant medallion opens to full frame
  a.dc0 = a.subscribeE + .1; a.dc1 = a.dc0 + 2.1;        // … and closes back into it
  return a;
}
export const fieldView = (t, a) => B.crept(CALQ, 1 + .016 * Math.max(0, t - a.calq));
// the elephant medallion: r and centre over time (opens from MED_E to the full frame, closes back)
export function duskMed(t, a) {
  const o = B.ZIN(span(t, a.de0, a.de1)), c = B.ZOUT(span(t, a.dc0, a.dc1)), u = o * (1 - c);
  const lr = Math.exp(lerp(Math.log(MED_R), Math.log(F.RF), u)), k = (lr - MED_R) / (F.RF - MED_R);
  return { cx: lerp(MED_E[0], W / 2, k), cy: lerp(MED_E[1], H / 2, k), r: lr, u };
}
export const DUSK_CLOSED = F.aim(F.F0, 840, 800, 3.2);   // mother and calf fill the small medallion
// the camera inside: close on the calf while small, the family wide when open, a slow push during the subscribe line
export function duskCam(t, a) {
  const K = [[a.de0, DUSK_CLOSED], [a.de1, F.aim(F.F0, 1080, 690, 1.0)], [a.dc0, F.aim(F.F0, 1070, 700, 1.1)], [a.dc1, DUSK_CLOSED]];
  return B.stageCam(t, K, 1.3, 11);
}
export function duskScene(ctx, t, a) { const c = duskCam(t, a); Hb.dusk(ctx, c, t, { cast: () => Hb.elephantFamily(ctx, t, { walk: .15 * Math.max(0, t - a.de0), walkPh: 1.7 * Math.max(0, t - a.de0) }) }); }
// the medallion (small or opening/closing) over the field; full frame when open
export function duskMedallion(ctx, t, a, rScale = 1) {
  const m = duskMed(t, a), r = m.r * rScale;
  if (r <= .5) return m;
  if (m.u >= 1 - 1e-6) { duskScene(ctx, t, a); return m; }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = E.mixHex(P.night0, P.ind1, .55); ctx.beginPath(); ctx.arc(m.cx, m.cy, r, 0, 7); ctx.fill(); ctx.restore();
  B.inMed(ctx, m.cx, m.cy, r - 1, (c) => duskScene(c, t, a));
  B.ring(ctx, m.cx, m.cy, r, 'other');
  return m;
}
// the explainer field of 7.13–8.05: the night map on California (creeping), all pins of the time; dim from o.dim
export const FIELD_DIM = .45;
export function field(ctx, t, T, a, o = {}) {
  const v = fieldView(t, a);
  F.map(ctx, t, v, { calls: o.calls ?? .32, dim: o.dim ?? 0 });
  return { v, hd: F.pins(ctx, t, T, v, { pulse: o.pulse, labels: o.labels, hide: o.hide, grow: o.grow }) };
}
// 7.17 → 8.01 (straddles the chunk boundary): the dusk scene closes back into its medallion over the dimmed field
export function duskClose(ctx, t, T, a) {
  const m = duskMed(t, a);
  if (m.u < 1 - 1e-6) field(ctx, t, T, a, { dim: FIELD_DIM });
  return duskMedallion(ctx, t, a);
}
