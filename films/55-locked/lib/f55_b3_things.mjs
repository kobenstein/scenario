// Film 55 · B3 (c12–c16) · local things that the shared kit does not have (kit wishes, see the B3 report):
//   hall(ctx, t, w, h, o)      the hall of seats (1,000 copies of the same small core; dozens for the first machine) — portal inside, local px
//   corridor(ctx, t, w, h, o)  doors behind doors, each a calendar sheet further; the last vanishes in the dark — portal inside, local px
//   stadium(ctx, t, x, y, w, h, o)  a matte arena outline with ~10,000 matte dots (OPENAI SAYS · NOT CONFIRMED) — never glowing, never a ring
//   notice(ctx, t, x, y, w, o)  the lab's notice on the windowless wall: ink rows, a covering band NOT EVERYTHING IS SHOWN
//   miniCore(ctx, x, y, s, a)  a tiny faceted rhomb (the same core, cheap enough for a thousand)
//   mixCam(a, b, w) · plateCam(P0, k) (= the seam plates' creeping camera) · wallAt(ctx, c, X, Y, sRef, fn) (screen px glued to the wall)
import * as E from './f10_editorial.mjs';
import * as F from './f55_kit.mjs';
import * as S from './f55_seams.mjs';
const { P, rgba, mixHex, clamp, lerp, span, prng, lin, rad, expoOut, sineIO } = E;
const { GOLD, CHECK, LAMP, INK, rise } = F;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------------------------- cameras
export const plateCam = (P0, k) => S.look(P0[0] + S.TRUCK * (k - 1) / S.CREEP * P0[2] / E.F0, P0[1], P0[2], P0[3] * k, P0[4], P0[5], P0[6] ?? S.HZ);
export function mixCam(a, b, w) {
  if (w <= 0) return a; if (w >= 1) return b;
  const la = Math.log(S.Z_REF - a.z), lb = Math.log(S.Z_REF - b.z);
  return E.cam3({ x: lerp(a.x, b.x, w), y: lerp(a.y, b.y, w), z: S.Z_REF - Math.exp(lerp(la, lb, w)), hz: lerp(a.hz ?? S.HZ, b.hz ?? S.HZ, w) });
}
// draw fn in screen px around a point on the wall's front face (X, Y at the door's z); 1 px = 1 px when the camera's scale there is sRef
export function wallAt(ctx, c, X, Y, sRef, fn) {
  const p = S.proj(c, X, Y, S.LINE.door.z); if (!p) return;
  const k = p[2] / sRef; ctx.save(); ctx.setTransform(k, 0, 0, k, p[0], p[1]); fn(k); ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- a tiny core
export function miniCore(ctx, x, y, s, a = 1) {
  if (a <= 0 || s < .4) return;
  const hw = s * .36, hh = s * .5;
  ctx.globalAlpha = a;
  ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.moveTo(x, y - hh); ctx.lineTo(x + hw, y); ctx.lineTo(x, y + hh); ctx.lineTo(x - hw, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.moveTo(x, y - hh); ctx.lineTo(x - hw, y); ctx.lineTo(x - hw * .1, y - hh * .08); ctx.closePath(); ctx.fill();
  ctx.fillStyle = GOLD.deep; ctx.beginPath(); ctx.moveTo(x + hw, y); ctx.lineTo(x, y + hh); ctx.lineTo(x - hw * .1, y - hh * .08); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
}

// ---------------------------------------------------------------------------------------------------------------- THE HALL OF SEATS
// local px (w × h). o { n (seats: 1000 | 36 …), lit 0..1 (a wave from the front centre lights a core over every seat), warm 0..1 (the
// room behind the door: gold air), zoom 1.. (an inner push), big 0..1 (one larger core over the stage: "the same machine"), stage 0..1 }
const HALLS = new Map();
function hallSeats(n) {
  if (HALLS.has(n)) return HALLS.get(n);
  const R = n >= 400 ? 20 : Math.max(3, Math.round(Math.sqrt(n / 2.2))), C = Math.ceil(n / R), out = [], r = prng(5577 + n);
  for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) {
    if (out.length >= n) break;
    const v = R === 1 ? 1 : i / (R - 1), u = C === 1 ? 0 : j / (C - 1) - .5;
    out.push({ v, u, d: Math.hypot(u * 1.2, 1 - v) / 1.3, ph: r() * TAU });
  }
  const res = { seats: out, C }; HALLS.set(n, res); return res;
}
export function hall(ctx, t, w, h, o = {}) {
  const n = o.n ?? 1000, lit = clamp(o.lit ?? 0), warm = clamp(o.warm ?? 0), z = o.zoom ?? 1;
  ctx.save();
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.night0, GOLD.deep, .22 * warm)], [.6, mixHex(mixHex(P.night1, P.ind1, .5), GOLD.deep, .25 * warm + .12 * lit)], [1, P.night0]]); ctx.fillRect(0, 0, w, h);
  ctx.translate(w / 2, h * .5); ctx.scale(z, z); ctx.translate(-w / 2, -h * .5);
  { const m = ctx.getTransform(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.paper(ctx, t, { x: -m.e, y: -m.f }); ctx.restore(); }
  // the back wall and the stage (a low lit platform at the back: the same machine, once, larger)
  const sy = h * .26;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .35); ctx.fillRect(w * .22, sy - h * .14, w * .56, h * .14);
  ctx.fillStyle = rgba(mixHex(GOLD.line, P.cream, .3), .25 + .35 * lit); ctx.fillRect(w * .22, sy - 2, w * .56, 3);
  // warm air over the seats as they light (painted, never added on blue)
  if (lit > 0) { ctx.fillStyle = rad(ctx, w / 2, h * .62, w * .62, [[0, rgba(GOLD.halo, .2 * lit)], [.6, rgba(GOLD.halo, .07 * lit)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(0, 0, w, h); }
  if ((o.big ?? 0) > 0) F.core(ctx, t, w / 2, sy - h * .09, h * .11, { glow: o.big, a: o.big });
  // the rows: back (small, high) to front (big, low), a shallow amphitheatre curve
  const { seats, C } = hallSeats(n);
  for (const s of seats) {
    const sc = .38 + .82 * s.v, rowW = w * (.5 + .44 * s.v), x = w / 2 + s.u * rowW, y = h * (.34 + .56 * Math.pow(s.v, 1.15)) - Math.pow(s.u * 2, 2) * h * .035 * (1 - s.v * .3);
    const sw = Math.min(rowW / C * .72, 70 * sc);
    const on = clamp((lit * 1.25 - s.d) / .22);
    ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .55), GOLD.deep, .35 * on + .2 * warm); ctx.beginPath(); ctx.roundRect(x - sw / 2, y - sw * .55, sw, sw * .8, sw * .18); ctx.fill();
    ctx.fillStyle = rgba(INK.rim, .25); ctx.fillRect(x - sw / 2, y - sw * .55, sw, Math.max(1, sw * .06));
    if (on > 0) miniCore(ctx, x, y - sw * (.95 + .04 * Math.sin(t * 1.3 + s.ph)), sw * .62 * (.7 + .3 * on), on);
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- DOORS BEHIND DOORS
// local px. o { push 0..1 (inner camera moves deeper), sheets 0..1 (the calendar sheets hang), fade 0..1 (the last door goes dark),
// months [...] }. Door k is one calendar sheet further than door k-1.
export function corridor(ctx, t, w, h, o = {}) {
  const months = o.months ?? ['NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR'], N = months.length, push = clamp(o.push ?? 0), sh = clamp(o.sheets ?? 1), fd = clamp(o.fade ?? 0);
  ctx.save();
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, P.night0], [.62, mixHex(P.night1, GOLD.deep, .25)], [1, P.night0]]); ctx.fillRect(0, 0, w, h);
  { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.paper(ctx, t, {}); ctx.restore(); }
  const z = 1 + .45 * push, vx = w * .8, vy = h * .5;
  ctx.translate(vx, vy); ctx.scale(z, z); ctx.translate(-vx, -vy);
  // the floor: two gold lines receding to the vanishing point (the doors stand in a row along it, front left → far right)
  ctx.strokeStyle = rgba(GOLD.line, .16); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, h * .96); ctx.lineTo(vx, vy); ctx.moveTo(w * .5, h * 1.1); ctx.lineTo(vx, vy + 3); ctx.stroke();
  for (let k = N - 1; k >= 0; k--) {
    const sc = Math.pow(.68, k), dh = h * .66 * sc, dw = dh * .5, by = lerp(vy, h * .93, sc), x = lerp(vx, w * .17, sc);
    const dark = k === N - 1 ? fd : k === N - 2 ? fd * .4 : 0, a = 1 - dark;
    if (a <= 0) continue;
    F.door(ctx, t, x, by, dw, dh, { gap: (.95 - k * .1) * a, a });
    const su = clamp(sh * N - k * .8);   // the sheets hang one after another (front to back)
    if (su > 0) F.calSheet(ctx, t, x, by - dh * 1.3 - (1 - expoOut(su)) * 40 * sc, dw * .62, months[k], '', { a: a * rise(su), rot: .04 * (k % 2 ? -1 : 1) });
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- THE STADIUM
// (x, y) = centre, w × h. o { u (outline draws), dots 0..1 (the dots fill, staggered), a }. Matte: no glow, blue-grey ink, rounded rect.
const ST = (() => { const r = prng(5588), pts = []; while (pts.length < 10000) { const u = r() * 2 - 1, v = r() * 2 - 1, q = Math.max(Math.abs(u) * .82, Math.abs(v)); if (q > .42 && q < .98) pts.push([u, v, r()]); } return pts; })();
export function stadium(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1, u = clamp(o.u ?? 1), du = clamp(o.dots ?? 1); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const ring = (k, al) => { ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .3), al); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.roundRect(x - w * k / 2, y - h * k / 2, w * k, h * k, h * k * .32); ctx.stroke(); };
  ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2 - 10, y + h / 2 + 10 - (h + 20) * expoOut(u), w + 20, (h + 20) * expoOut(u)); ctx.clip();
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h * .32); ctx.fill();
  ring(1, .8); ring(.42, .55);
  ctx.fillStyle = rgba(mixHex(P.ind1, P.blue0, .4), .55); ctx.beginPath(); ctx.roundRect(x - w * .21, y - h * .21, w * .42, h * .42, h * .13); ctx.fill();
  ctx.restore();
  if (du > 0) {
    ctx.fillStyle = rgba(mixHex(P.blue1, P.cream, .45), .9);
    for (const [pu, pv, s] of ST) { if (s > du) continue; ctx.fillRect(x + pu * w / 2 - 1.1, y + pv * h / 2 - 1.1, 2.2, 2.2); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- THE NOTICE ON THE WALL
// (x, y) = centre, w wide (h = .56 w). o { band 0..1 (the covering band slides over the rows), a }
export function notice(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1, h = w * .56, bu = clamp(o.band ?? 0); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x - w / 2, y - h / 2);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(w * .02, h * .03, w, h);
  ctx.fillStyle = mixHex(mixHex(P.cream, '#ece4c8', .5), P.ind2, .12); ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.fillRect(0, 0, w, h * .12);
  ctx.fillStyle = rgba(GOLD.line, .8); ctx.fillRect(w * .05, h * .045, w * .12, h * .03);
  const r = prng(5561);
  for (let k = 0; k < 7; k++) { ctx.fillStyle = rgba(P.night1, .38); ctx.fillRect(w * .07, h * (.22 + k * .1), w * (.55 + r() * .3), h * .028); }
  if (bu > 0) {
    const e = expoOut(bu), by = h * .38, bh = h * .4;
    ctx.save(); ctx.beginPath(); ctx.rect(-w * .03, by, (w * 1.06) * e, bh); ctx.clip();
    ctx.fillStyle = mixHex(P.ind1, P.night1, .25); ctx.fillRect(-w * .03, by, w * 1.06, bh);
    ctx.fillStyle = rgba(INK.rim, .35); ctx.fillRect(-w * .03, by, w * 1.06, 2); ctx.fillRect(-w * .03, by + bh - 2, w * 1.06, 2);
    E.glowText(ctx, 'NOT EVERYTHING', w / 2, by + bh * .44, { size: w * .072, weight: 600, spacing: .1, align: 'center', col: P.cream, glow: false });
    E.glowText(ctx, 'IS SHOWN', w / 2, by + bh * .8, { size: w * .072, weight: 600, spacing: .1, align: 'center', col: P.cream, glow: false });
    ctx.restore();
  }
  ctx.restore();
}

// a tester's small clipboard at a hand (screen px): cream sheet, a cyan clip
export function smallBoard(ctx, x, y, s, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.cream, '#ece4c8', .5); ctx.fillRect(x - s * .3, y - s * .9, s * .6, s * .8);
  ctx.fillStyle = CHECK.body; ctx.fillRect(x - s * .14, y - s * .96, s * .28, s * .12);
  ctx.restore();
}
export { TAU, sineIO, span };
