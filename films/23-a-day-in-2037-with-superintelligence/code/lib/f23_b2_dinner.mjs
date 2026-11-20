// Film 23 · B2 · the dinner table (c07, c08; imported by B3 for c09–c11 so the pair stays identical across the plateWall seam).
// dinnerPeople(t, c, o) → [[Z, fn]] for K.world(…, { you: { kitchen: { people } } }): the KID kneels (sits on her heels) on the LEFT stool
// facing right, YOU sit on the RIGHT stool facing left. Pure function of t (fixed seeds, no state): both sides of a seam can call it.
// Both are drawn on their own plane (Z = ZB − 170, the stools) but sorted AFTER the table, so arms rest on the table top.
//   c      the camera of the frame (needed to draw on the right plane)
//   o.kid / o.you: overrides passed straight to K.kid / K.you (pose, armR, armL = [shoulder, elbow] angles from straight down, + = toward
//          the table; look 0..1.2 (head up), lean (rad, + toward the table), dir, eyes, seed) + at: [X, Z] (default the stool), hide: true,
//          rise 0..1 (kid only: 0 sits on her heels, 1 kneels upright, a little taller)
//   o.out  if given, hands are written to o.out.kid / o.out.you = { R, L } in SCREEN px, plus o.out.kidW / o.out.youW in world [X, Y, Z]
// Rest poses (no override): the kid's forearms on the table, you with one hand on the table, the other in your lap; both alive (kit).
import { createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
const { W, H, P, mixHex, rgba, clamp, lerp, span, quartIO, expoOut } = E;
const { KITCHEN, ZB } = K;
const KY = KITCHEN.floor, SEAT = KITCHEN.seatY, TOP = KITCHEN.table.top;
export const KID_AT = [-1478, ZB - 170], YOU_AT = [-1078, ZB - 170];
export const KID_H = 100, YOU_H = 140;
export const KID_REST = { armR: [.35, 1.55], armL: [.25, 1.45], look: .15, lean: .12 };
export const YOU_REST = { armR: [.8, 1.75], armL: [.25, .9], look: .1, lean: .1 };
const PANTS_YOU = P.ind1, PANTS_KID = mixHex(P.blue1, P.night1, .35);

// a stroke limb (two segments) with round caps, in world units
function limb(ctx, pts, w0, w1, col) {
  ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 0; i < pts.length - 1; i++) { ctx.lineWidth = lerp(w0, w1, i / Math.max(1, pts.length - 2)); ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[i + 1]); ctx.stroke(); }
}
// draw one seated figure: the kit figure clipped at the seat line (its coat hem sits on the stool), then folded legs.
// kind 'sit' (thighs forward, shins down) or 'heels' (kneeling, sitting on her heels: thighs forward on the seat, shins back on the stool)
function seated(ctx, kind, X, h, t, q, drawFig) {
  const dir = q.dir ?? 1, rise = clamp(q.rise ?? 0);
  const hipY = kind === 'sit' ? SEAT - h * .02 : SEAT - h * (.1 + .12 * rise);
  const feetY = hipY + h * .47;            // the figure's "feet" line (its hip sits .47 h above it)
  // legs first (behind the coat)
  const pants = kind === 'sit' ? PANTS_YOU : PANTS_KID, lit = mixHex(pants, P.blue1, .45);
  const t1 = h * .075, t2 = h * .062;
  if (kind === 'sit') {
    const knee = [X + dir * h * .21, hipY + h * .015], foot = [knee[0] + dir * h * .02, KY - h * .02];
    limb(ctx, [[X, hipY], knee, foot], t1, t2, lit);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(foot[0] + dir * h * .03, KY - h * .018, h * .055, h * .022, 0, 0, 6.29); ctx.fill();
  } else {
    const knee = [X + dir * h * .17, SEAT - h * .03], heel = [X - dir * h * .04, SEAT - h * .035];
    limb(ctx, [[X, hipY], knee], t1, t1 * .95, lit); limb(ctx, [knee, heel], t2, t2 * .9, pants);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(heel[0] - dir * h * .02, heel[1] - h * .01, h * .04, h * .022, 0, 0, 6.29); ctx.fill();
  }
  ctx.save(); ctx.beginPath(); ctx.rect(X - h, hipY - h * 2, h * 2, h * 2 + h * .035); ctx.clip();
  const hands = drawFig(ctx, X, feetY, h, t, { view: 'side', ...q, dir });
  ctx.restore();
  return { hands, hipY };
}
const toScreen = (c, Z, p) => { if (!p) return null; const s = c.f / (Z - c.z); return [W / 2 + (p[0] - c.x) * s, H / 2 + (p[1] - c.y) * s]; };
export function dinnerPeople(t, c, o = {}) {
  const ko = { ...KID_REST, seed: 2, ...(o.kid || {}) }, yo = { ...YOU_REST, seed: 1, ...(o.you || {}) };
  const out = o.out, TZ = KITCHEN.table.z0 - 1;     // sorted after the table (it is nearer), drawn on the stools' plane
  const items = [];
  if (!ko.hide) {
    const [X, Z] = ko.at || KID_AT;
    items.push([TZ, (ctx) => K.atZ(ctx, c, Z, () => {
      const r = seated(ctx, 'heels', X, KID_H, t, { dir: 1, ...ko }, (cx, x, y, h, tt, q) => K.kid(cx, x, y, h, tt, q));
      if (out) { out.kid = { R: toScreen(c, Z, r.hands.R), L: toScreen(c, Z, r.hands.L) }; out.kidW = { R: r.hands.R && [...r.hands.R, Z], L: r.hands.L && [...r.hands.L, Z] }; }
    })]);
  }
  if (!yo.hide) {
    const [X, Z] = yo.at || YOU_AT;
    items.push([TZ - .5, (ctx) => K.atZ(ctx, c, Z, () => {
      const r = seated(ctx, 'sit', X, YOU_H, t, { dir: -1, ...yo }, (cx, x, y, h, tt, q) => K.you(cx, x, y, h, tt, q));
      if (out) { out.you = { R: toScreen(c, Z, r.hands.R), L: toScreen(c, Z, r.hands.L) }; out.youW = { R: r.hands.R && [...r.hands.R, Z], L: r.hands.L && [...r.hands.L, Z] }; }
    })]);
  }
  return items;
}
// arm keys with overlapping action: keys [[t, [s1, s2]], …] (quart in-out between keys); the forearm (s2) lags the upper arm by lag s
// and settles last. Use for natural two-segment arm moves on words: armAt(t, [[t0, REST], [t1, LIFT], …]).
export function armAt(t, keys, lag = .075) {
  const at = (tt, k) => {
    if (tt <= keys[0][0]) return keys[0][1][k];
    for (let i = 1; i < keys.length; i++) if (tt <= keys[i][0]) { const u = quartIO((tt - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])); return lerp(keys[i - 1][1][k], keys[i][1][k], u); }
    return keys[keys.length - 1][1][k];
  };
  return [at(t, 0), at(t - lag, 1)];
}
// a scalar with the same key logic (look, lean, rise)
export function valAt(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], quartIO((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
  return keys[keys.length - 1][1];
}
// the dinner light state shared by c07/c08 (and WALL_STATE-compatible): lamp on, the wall's own glow
export const DINNER_HOUR = (t, T0 = 305.88, T1 = 411.13) => lerp(19, 19.5, clamp((t - T0) / (T1 - T0)));

// the hands of the pair for frame (t, c) without drawing them (one tiny scratch canvas, made once): { kid: {R, L}, you: {R, L} } in screen px
let SCRATCH = null;
export function dinnerHands(t, c, o = {}) {
  if (!SCRATCH) SCRATCH = createCanvas(4, 4).getContext('2d');
  const out = {};
  for (const [, fn] of dinnerPeople(t, c, { ...o, out })) { SCRATCH.save(); fn(SCRATCH); SCRATCH.restore(); }
  return out;
}
// a screen point → the light wall's plane (world units on ZB), for lines that start at a hand and run on the wall
export function toWall(c, p, Z = ZB) { const s = c.f / (Z - c.z); return [c.x + (p[0] - W / 2) / s, c.y + (p[1] - H / 2) / s]; }
