// Film 55 · THE LINE (the one world of the film) + the kitchen + the room behind the door + the seam plates between the builder groups
// (owned by the lead; builders import, never edit — wishes go in the report).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it. Both
// call it with the same (t, T): the seam is invisible by construction. Plates creep (CREEP 3 %/s push, TRUCK 24 px/s); the receiving side
// continues both. Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet55.mjs <dir>
//
//   Lead → B1 at T.G('At the very front stand') (c01 → c02): plateLine   THE LINE, WIDE. The door right (gap glowing), the five floor marks
//            lit 1…5, the groups on them, you (yellow coat) on 5 looking up, everyone behind you to the horizon. Camera LINE_CAM.
//            B1 (1.01) glides right along the line to mark 1 at the door: the people who built it.
//   B1 → B2  at T.G('Fourth in line stand') (c06 → c07): plateFour   MARK 4 AND THE SIDE DOOR. The defenders (tool cases) on mark 4, the
//            small side door in the wall behind them closed (a thin cream line), mark 4 lit, the big door's glow at the right edge. Camera FOUR_CAM.
//   B2 → B3  at T.G('That call was made inside') (c11 → c12): plateHeld   THE DOOR, CLOSED, AND THE PARCEL. The door three-quarter wide, its gap
//            glowing, a parcel NEXT standing on the threshold stamped HELD BACK (it rolled up and stopped), the line small at the left. Camera HELD_CAM.
//
// THE LINE (thumbnail A; a real pinhole world, see below): a night plain, the city small on the horizon at the left, a colossal wall block at
//   the right with ONE colossal door far away (z 14800). Gold leaks around the door's leaf and falls as a carpet of light over the floor toward
//   you. The line runs from you (front left, last) diagonally to the threshold: groups on the floor marks 5 (you) · 4 DEFENDERS · 3 BIG
//   COMPANIES · 2 GOVERNMENT · 1 THE LAB (at the door). Everyone else stands behind you (off frame at home; revealed in c10). The small side
//   door right of the big door is where the lab lets chosen people in (defenders in B2, outside testers in B3).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f55_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng } = E;
const { GOLD, CHECK, LAMP, INK, STONE, F0 } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
export const CREEP = .03;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 24;
const tr = (k) => TRUCK * (k - 1) / CREEP;

// ================================================================================================================= THE LINE
// A real pinhole world (no cards): camera { x, y, z, f } as everywhere (E.cam3 / E.aim / camDrift), world X right, Y UP from the floor,
// Z away. A world point projects to  sx = W/2 + (X − c.x)·s,  sy = HZ + (EYE − Y − c.y)·s,  s = c.f / (Z − c.z).
// The horizon sits LOW (HZ = 830, a lens shift like thumbnail A) and the home camera's eye is EYE = 130 above the floor (a low camera:
// heads of the near people stand against the sky). One world unit = one design px at Z = F0 (1700).
export const HZ = 830, EYE = 130, Z_REF = 30000;
export const LINE = {
  door: { x: 4090, z: 14800, w: 3520, h: 7050 },               // the opening (world units); its threshold is the far end of the line
  wall: { x0: 1050, h: 10400, back: 5200 },                    // the wall block: front face at the door's z from x0 rightwards, side face back
  side: { x: 8000, w: 560, h: 1150 },                           // the small side door (front face, right of the big door): who the lab lets in
  you: { x: -640, z: 1450, h: 172 },                            // you, last in line (thumbnail A: front left)
  head: { x: 2850, z: 14250 },                                  // the head of the line, at the threshold
  personH: 190,
  marks: [   // p = position along the line (0 = you … 1 = the threshold); n = the number painted on the floor; people = their places in line
    { n: 1, p: .985, name: 'THE LAB', kind: 'lab', from: .74 },
    { n: 2, p: .72, name: 'GOVERNMENT', kind: 'gov', from: .5 },
    { n: 3, p: .48, name: 'BIG COMPANIES', kind: 'suit', from: .2 },
    { n: 4, p: .18, name: 'DEFENDERS', kind: 'tools', from: .035 },
    { n: 5, p: 0, name: 'YOU', kind: 'you', from: 0 },
  ],
};
// a point on the line: p 0 (you) … 1 (the head at the threshold)
export const linePt = (p) => ({ x: lerp(LINE.you.x, LINE.head.x, p), z: lerp(LINE.you.z, LINE.head.z, p) });
// the people in line ahead of you (evenly spaced in depth), each with its station (index into LINE.marks) and a seed
export const QUEUE = (() => { const out = [], r = prng(5521); for (let k = 1; k <= 46; k++) { const p = Math.pow(k / 46.6, 1.15), i = LINE.marks.findIndex((m) => p >= m.from); out.push({ p, ...linePt(p), dx: (r() - .5) * 50, st: i, seed: 700 + k, h: LINE.personH * (.9 + r() * .16) }); } return out; })();
// everyone behind you: the line goes on behind your back to the left and away to the horizon (off frame at home: revealed in c10)
export const TAIL = (() => { const out = [], r = prng(5512); for (let k = 0; k < 80; k++) { const d = k / 79, ang = d * 1.25; out.push({ x: LINE.you.x - 420 - 5200 * Math.sin(ang) * (.4 + d), z: LINE.you.z + 260 + 26000 * d * d + 900 * d, seed: 900 + k, hood: r() < .16, h: LINE.personH * (.9 + r() * .16) }); } return out; })();
export const markPt = (i) => linePt(LINE.marks[i].p);
// projection helpers: proj(c, X, Y, Z) → [sx, sy, s] (s = px per world unit) or null (behind the camera)
export function proj(c, X, Y, Z) { const dz = Z - c.z; if (dz < 20) return null; const s = c.f / dz; return [W / 2 + (X - c.x) * s, (c.hz ?? HZ) + (EYE - Y - c.y) * s, s]; }
// the camera that shows world point (X, Y, Z) at screen (sx, sy) with mag = scale relative to the home view of that depth (1 = home).
// hz = this camera's horizon on screen (lens shift; default HZ 830). The camera must stay ABOVE the floor (c.y < EYE): a point
// shown above the horizon line needs a higher horizon (smaller hz), otherwise the floor flips above the horizon. look() raises the
// horizon by itself when needed (keeps the eye at least 40 units above the floor).
export function look(X, Y, Z, mag = 1, sx = W / 2, sy = H / 2, hz = HZ) {
  const s = mag * F0 / Z, dz = F0 / s; let y = EYE - Y - (sy - hz) / s;
  if (y > EYE - 40) { hz = sy + (Y - 40) * s; y = EYE - 40; }
  return E.cam3({ x: X - (sx - W / 2) / s, y, z: Z - dz, f: F0, hz });
}
export const HOME = E.cam3();
// draw fn in world units at floor point (X, Z) (local y up is negative, as on any canvas): returns false when behind the camera
export function at(ctx, c, X, Z, fn, Y = 0) { const p = proj(c, X, Y, Z); if (!p) return false; ctx.save(); ctx.setTransform(p[2], 0, 0, p[2], p[0], p[1]); fn(p[2]); ctx.restore(); return true; }
// camera path through keys [[t, cam]…] (monotone cubic in x, y and log(Z_REF − z)): safe for deep flights along the line
export function camPath(t, K) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(Z_REF - c.z), c.hz ?? HZ]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 4; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: Z_REF - Math.exp(out[2]), hz: out[3] });
}
// "nothing ever stands still": drift scaled to the distance of what the camera looks at (dist in world units)
export const drift = (c, t, dist = 3000, amt = 1, seed = 0) => { const k = dist / F0 * amt; return { ...c, x: c.x + E.drift(t, 5 * k, seed), y: c.y + E.drift(t, 3 * k, seed + 2), z: c.z + E.drift(t, 12 * k, seed + 4) }; };
// screen rects of the door's opening and of the side door for camera c (for portals and carriers)
export function doorRect(c) { const d = LINE.door, a = proj(c, d.x - d.w / 2, d.h, d.z), b = proj(c, d.x + d.w / 2, 0, d.z); return a && b ? { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] } : null; }
export function gapRect(c, open = 0) { const d = LINE.door, r = doorRect(c); if (!r) return null; const lock = r.x + r.w * (.012 * .35 + (1 - .024 * 1.1) * (1 - .42 * open)); return { x: lock, y: r.y, w: Math.max(3, r.x + r.w - lock), h: r.h }; }
export function sideRect(c) { const s = LINE.side, a = proj(c, s.x - s.w / 2, s.h, LINE.door.z), b = proj(c, s.x + s.w / 2, 0, LINE.door.z); return a && b ? { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] } : null; }
const STARS = (() => { const r = prng(5505), out = []; for (let k = 0; k < 240; k++) out.push([r(), r(), r(), r() * TAU, .4 + r()]); return out; })();
const CITY = (() => { const r = prng(5530), out = []; let x = -1; while (x < .62) { const w = .008 + r() * .02, h = .012 + r() * r() * .07; out.push([x, w, h, r()]); x += w + r() * .006; } return out; })();
const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
// lineWorld(ctx, c, t, st) st (all optional):
//   gap 0..1 (the door's leak, default 1) · open 0..1 (the leaf swings in a little) · sign / signU (a name over the door) · carpet 0..1 (the light on the floor)
//   mark(i) → { lit 0..1, a, sub } (i 0..4 = marks 1..5; default lit .2) · person(k, q) → { a, kind, gold, look, hidden, walk, x, z, view } (q = QUEUE[k])
//   you { x, z, h, o, a } | false · tail { a, n } (everyone behind you) · side { open 0..1, a } · sky 0..1 (stars) · city 0..1 (the skyline)
//   wall(ctx, s) (on the wall's front face, world units, origin = the door's threshold centre) · floor(ctx) (screen space, after the floor) ·
//   extra(ctx) (screen space, after the people) · at(X, Z, fn) helpers: use S.at(ctx, c, X, Z, fn)
export function lineWorld(ctx, c, t, st = {}) {
  const D = LINE.door, WL = LINE.wall, gap = clamp(st.gap ?? 1), open = clamp(st.open ?? 0), g = gap * (1 + .05 * Math.sin(t * .7 + .4));
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the sky (screen space: the horizon never moves on screen), stars that drift with the camera's pan a little
  const hz = c.hz ?? HZ;
  ctx.fillStyle = lin(ctx, 0, 0, 0, hz, [[0, P.night0], [.55, mixHex(P.night1, P.ind1, .55)], [1, mixHex(P.ind1, P.blue0, .55)]]); ctx.fillRect(0, 0, W, hz + 2);
  const sa = .6 * (st.sky ?? 1);
  if (sa > 0) for (const [u, v, s2, ph, f] of STARS) { const x = ((u * 2600 - c.x * .02) % 2600 + 2600) % 2600 - 340, y = v * (hz - 120) - c.y * .02; ctx.globalAlpha = sa * (.55 + .45 * Math.sin(t * f + ph)) * (1 - v * .6); ctx.fillStyle = P.cream; ctx.fillRect(x, y, s2 > .93 ? 2.6 : 1.5, s2 > .93 ? 2.6 : 1.5); }
  ctx.globalAlpha = 1;
  // the city on the horizon (left), tiny lit windows
  const ca = st.city ?? 1;
  if (ca > 0) { const off = -c.x * .015; for (const [x, w, h2, v] of CITY) { const bx = (x + .5) * W + off, bw = w * W, bh = h2 * H; ctx.fillStyle = rgba(mixHex(P.night0, P.ind1, .45), ca); ctx.fillRect(bx, hz - bh, bw, bh + 2); if (v > .55) { ctx.fillStyle = rgba(LAMP.body, .5 * ca); ctx.fillRect(bx + bw * .3, hz - bh * .7, 2, 2); } } }
  // the floor (the plain): lighter at the horizon, dark toward you
  ctx.fillStyle = lin(ctx, 0, hz, 0, H, [[0, mixHex(P.blue0, P.ind1, .45)], [.18, mixHex(P.ind1, P.night1, .35)], [1, P.night0]]); ctx.fillRect(0, hz, W, H - hz);
  ctx.restore();
  // the light carpet: gold light lying on the floor from the threshold toward you along the line, fading with distance from the door
  // (12 depth bands, each a world-space quad; alpha falls linearly from the door to you, so it never shows an edge)
  const cu = clamp(st.carpet ?? 1) * g;
  if (cu > 0) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    // nested trapezoids from the threshold toward you (each narrower; together a soft-edged pool), one screen-space gradient each:
    // bright at the threshold, gone just in front of you. Painted (source-over): additive gold on blue turns grey.
    const zA = D.z, zN = Math.max(c.z + 90, LINE.you.z - 900), pF = proj(c, D.x, 0, Math.max(LINE.you.z + 600, c.z + 90)), p0 = proj(c, D.x, 0, zA);
    if (p0 && pF) {
      const yA = p0[1], yF = Math.max(pF[1], yA + 40);
      for (let j = 0; j < 4; j++) {
        const ws = 1 - j * .2, cxN = lerp(D.x, LINE.you.x + 1500, 1), hN = 3600 * ws, hA = D.w * .5 * (1.02 - j * .06);
        const q = [proj(c, D.x - hA, 0, zA), proj(c, D.x + hA, 0, zA), proj(c, cxN + hN * .55, 0, zN), proj(c, cxN - hN, 0, zN)];
        if (q.some((v) => !v)) continue;
        ctx.fillStyle = lin(ctx, 0, yA, 0, yF, [[0, rgba(mixHex(GOLD.body, GOLD.halo, .5), .3 * cu)], [.18, rgba(GOLD.halo, .17 * cu)], [.55, rgba(mixHex(GOLD.halo, GOLD.deep, .3), .06 * cu)], [1, rgba(mixHex(GOLD.halo, GOLD.deep, .5), 0)]]);
        poly(ctx, q); ctx.fill();
      }
    }
    const pA = proj(c, D.x - D.w * .5, 0, D.z), pB = proj(c, D.x + D.w * .5, 0, D.z);
    if (pA && pB) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, pA[1] - 3, 0, pA[1] + 30, [[0, rgba(GOLD.halo, .45 * cu)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(pA[0] - 60, pA[1] - 3, pB[0] - pA[0] + 120, 33); }
    ctx.restore();
  }
  // the wall block: its side face (receding to the left of the corner), then the front face with the door and the side door
  const s0 = proj(c, WL.x0, 0, D.z), s1 = proj(c, WL.x0, WL.h, D.z), s2 = proj(c, WL.x0, WL.h, WL.back + D.z), s3 = proj(c, WL.x0, 0, WL.back + D.z);
  if (s0 && s1 && s2 && s3 && c.x < WL.x0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lin(ctx, s3[0], 0, s0[0], 0, [[0, mixHex(P.night1, P.ind1, .6)], [1, mixHex(P.ind1, P.blue0, .3)]]); poly(ctx, [s0, s1, s2, s3]); ctx.fill(); ctx.restore(); }
  at(ctx, c, D.x, D.z, (k) => {
    const x0 = WL.x0 - D.x, top = -WL.h;
    ctx.fillStyle = lin(ctx, 0, top, 0, 0, [[0, P.night0], [.7, mixHex(P.night1, P.ind1, .4)], [1, mixHex(P.night1, P.ind1, .7)]]); ctx.fillRect(x0, top, 40000, WL.h);
    ctx.fillStyle = rgba(INK.rim, .3); ctx.fillRect(x0, top, Math.max(2 / k, 14), WL.h);
    // the door's light on the wall around it
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 0, -D.h * .55, D.w * 1.5, [[0, rgba(GOLD.halo, .14 * g)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(-D.w * 1.5, -D.h * 1.4, D.w * 3, D.h * 1.4); ctx.restore();
    // the side door (cream practical light when it opens)
    const so = st.side || {}, sOpen = clamp(so.open ?? 0), sx = LINE.side.x - D.x, sw = LINE.side.w, sh = LINE.side.h;
    ctx.globalAlpha = so.a ?? 1;
    ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.fillRect(sx - sw / 2 - 40, -sh - 40, sw + 80, sh + 40);
    ctx.fillStyle = mixHex(P.night0, mixHex(LAMP.body, P.ind2, .3), .2 + .75 * sOpen); ctx.fillRect(sx - sw / 2, -sh, sw, sh);
    if (sOpen > 0) halo(ctx, sx, -sh * .5, sw * 2.2, .3 * sOpen, LAMP.body, LAMP.core);
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(sx - sw / 2, -sh, sw * (1 - .8 * sOpen), sh);
    ctx.fillStyle = rgba(LAMP.core, .4 * (1 - sOpen)); ctx.fillRect(sx + sw / 2 - 8, -sh, 8, sh);
    ctx.globalAlpha = 1;
    F.door(ctx, t, 0, 0, D.w, D.h, { gap, open, sign: st.sign, signU: st.signU });
    if (st.wall) st.wall(ctx, k);
  });
  F.paper(ctx, t, { x: c.x * .03, y: c.y * .03 });               // the print grain on sky, wall and floor (never over people or text)
  if (st.floor) st.floor(ctx);
  // floor marks (perspective plates with the number painted flat)
  for (let i = 4; i >= 0; i--) {
    const mo = (st.mark && st.mark(i)) || {}, a = mo.a ?? 1; if (a <= 0) continue;
    const m = LINE.marks[i], p = linePt(m.p), lit = clamp(mo.lit ?? .2), mw = 230, md = 150;
    const q = [proj(c, p.x - mw / 2 + 40, 0, p.z - md / 2), proj(c, p.x + mw / 2 + 40, 0, p.z - md / 2), proj(c, p.x + mw / 2 + 40, 0, p.z + md / 2), proj(c, p.x - mw / 2 + 40, 0, p.z + md / 2)];
    if (q.some((v) => !v)) continue;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
    if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2, r = Math.abs(q[1][0] - q[0][0]) * 1.2; ctx.fillStyle = rad(ctx, cx, cy, r, [[0, rgba(GOLD.halo, .26 * lit)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(cx - r, cy - r, r * 2, r * 2); ctx.restore(); }
    ctx.fillStyle = mixHex(mixHex(P.ind1, P.blue1, .4), mixHex(GOLD.line, P.cream, .45), lit * .85); poly(ctx, q); ctx.fill();
    // the number lies on the floor: an affine frame spanned by the plate's projected axes
    const ox = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, oy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4, ax = [(q[1][0] - q[0][0]) / mw, (q[1][1] - q[0][1]) / mw], az = [(q[3][0] - q[0][0]) / md, (q[3][1] - q[0][1]) / md];
    ctx.setTransform(ax[0], ax[1], -az[0], -az[1], ox, oy);
    E.glowText(ctx, String(m.n), 0, 48, { size: 130, serif: true, align: 'center', col: lit > .5 ? P.night1 : mixHex(P.cream, P.blue1, .35), glow: false });
    if (mo.sub) E.glowText(ctx, mo.sub, 0, -86, { size: 26, weight: 600, align: 'center', spacing: .14, col: lit > .5 ? P.night1 : P.cream, glow: false });
    ctx.restore();
  }
  // people, far to near: the queue (ahead of you), the tail (behind you), you; each with a long shadow away from the door
  const ppl = [];
  QUEUE.forEach((q, k) => { const o = (st.person && st.person(k, q)) || {}; if (!o.hidden && (o.a ?? 1) > 0) ppl.push({ z: o.z ?? q.z, x: (o.x ?? q.x) + q.dx, h: q.h, kind: o.kind ?? LINE.marks[q.st].kind, seed: q.seed, a: o.a ?? 1, gold: o.gold ?? (.35 + .6 * q.p), look: o.look, walk: o.walk, view: o.view ?? 'back', dir: o.dir ?? 1 }); });
  const ta = st.tail?.a ?? 1, tn = st.tail?.n ?? TAIL.length;
  if (ta > 0) TAIL.slice(0, tn).forEach((q) => ppl.push({ z: q.z, x: q.x, h: q.h, kind: q.hood ? 'hood' : 'plain', seed: q.seed, a: ta, gold: .1, view: 'back', dir: 1 }));
  if (st.you !== false) { const y = st.you || {}; ppl.push({ you: true, z: y.z ?? LINE.you.z, x: y.x ?? LINE.you.x, h: y.h ?? LINE.you.h, a: y.a ?? 1, o: y.o || {} }); }
  ppl.sort((p, q) => q.z - p.z);
  for (const p of ppl) {
    const f = proj(c, p.x, 0, p.z); if (!f || f[2] * p.h < 2) continue;
    const sx = f[0], sy = f[1], s = f[2], hp = p.h * s;
    if (sx < -hp || sx > W + hp || sy - hp > H || sy < -10) continue;
    // the shadow: a long dark quad on the floor, pointing away from the door (toward the camera, left)
    const dx = p.x - D.x, dz = p.z - D.z, dl = Math.hypot(dx, dz), L = p.h * 3.2, ex = p.x + dx / dl * L, ez = Math.max(c.z + 60, p.z + dz / dl * L);
    const s1 = proj(c, ex - 26, 0, ez), s2 = proj(c, ex + 26, 0, ez), f1 = proj(c, p.x - 30, 0, p.z), f2 = proj(c, p.x + 30, 0, p.z);
    if (s1 && s2 && f1 && f2) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lin(ctx, sx, sy, (s1[0] + s2[0]) / 2, (s1[1] + s2[1]) / 2, [[0, rgba(P.night0, .5 * p.a)], [1, rgba(P.night0, 0)]]); poly(ctx, [f1, f2, s2, s1]); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (p.you) E.du(ctx, sx, sy, hp, { look: .55, light: 1, back: .6, dir: 1, a: p.a, ...p.o });
    else F.queuer(ctx, t, sx, sy, hp, { seed: p.seed, kind: p.kind, gold: p.gold, a: p.a, look: p.look, walk: p.walk, view: p.view, dir: p.dir });
    ctx.restore();
  }
  if (st.extra) st.extra(ctx);
}

// ================================================================================================================= THE ROOM BEHIND THE DOOR
// Local px (w × h, e.g. 1920 × 1080) for a portal from the gap: a warm gold room, long tables, the people who built it (indigo, rimmed
// gold), and in the back the big core (the best machine). o { core 0..1, people 0..1, tables 0..1, glow 0..1, extra(ctx, w, h) }
export function room(ctx, t, w, h, o = {}) {
  const gl = clamp(o.glow ?? 1);
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(P.night1, GOLD.deep, .35 * gl)], [.62, mixHex(P.ind2, GOLD.halo, .3 * gl)], [1, mixHex(P.night1, GOLD.deep, .4)]]); ctx.fillRect(0, 0, w, h);
  const fy = h * .7;
  ctx.fillStyle = lin(ctx, 0, fy, 0, h, [[0, mixHex(P.ind2, GOLD.deep, .45 * gl)], [1, P.night1]]); ctx.fillRect(0, fy, w, h - fy);
  { const m = ctx.getTransform(); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.paper(ctx, t, { x: -m.e, y: -m.f }); ctx.restore(); }
  if ((o.core ?? 1) > 0) F.core(ctx, t, w * .5, h * .4, h * .34, { glow: gl, a: o.core ?? 1 });
  const pu = o.people ?? 1, tb = o.tables ?? 1;
  if (tb > 0) for (const [x0, x1, y] of [[w * .08, w * .4, fy + h * .06], [w * .6, w * .92, fy + h * .06]]) { ctx.globalAlpha = tb; ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x0, y, x1 - x0, h * .025); ctx.fillRect(x0 + 20, y, 14, h * .14); ctx.fillRect(x1 - 34, y, 14, h * .14); ctx.fillStyle = rgba(GOLD.line, .4 * gl); ctx.fillRect(x0, y, x1 - x0, 3); ctx.globalAlpha = 1; }
  if (pu > 0) for (const [x, dir, s] of [[w * .18, 1, 1], [w * .3, 1, .94], [w * .7, -1, .97], [w * .82, -1, 1]]) F.queuer(ctx, t, x, fy + h * .2, h * .36 * s, { seed: Math.round(x), kind: 'lab', dir, gold: 1, a: pu, look: .4 });
  if (o.extra) o.extra(ctx, w, h);
}

// ================================================================================================================= THE KITCHEN
// Local px (w × h = 1920 × 1080 recommended). Night, your kitchen: a pendant lamp (cream), the table, the letter from the bank, you standing
// at the table with your phone, the window on the right (the car in the driveway under a street lamp). o:
//   lamp 0..1 · you { a, look, lean, hold 0..1 (the phone up), o } · phone { lit 0..1, screen(ctx, w, h), core 0..1 } · letter 0..1
//   window { a, season 0..1 (0 = winter night, 1 = summer dusk: the light outside changes for the finale) } · devices { laptop, router, old,
//   switches [0..1 ×3] } (the tips, B2) · zoom { x, y, s } (an inner camera: push to the phone without leaving the room) · extra(ctx, w, h)
// Returns { phone: screen rect in local px (before zoom), hand }.
export function kitchen(ctx, t, w, h, o = {}) {
  const z = o.zoom || { x: w / 2, y: h / 2, s: 1 };
  ctx.save(); ctx.translate(w / 2, h / 2); ctx.scale(z.s, z.s); ctx.translate(-z.x, -z.y);
  const lamp = clamp(o.lamp ?? 1), ty = h * .66;
  // the room
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, P.night0], [.55, mixHex(P.night1, P.ind2, .65)], [1, P.night1]]); ctx.fillRect(-w, -h, w * 3, h * 3);
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(-w, ty + h * .14, w * 3, 2);
  // the window (right): the night outside, the driveway, the car under a street lamp
  const wo = o.window || {}, wa = wo.a ?? 1, wx = w * .64, wy = h * .14, ww = w * .27, wh = h * .38, se = clamp(wo.season ?? 0);
  if (wa > 0) {
    ctx.save(); ctx.globalAlpha *= wa; ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(P.night0, P.ind1, .6 + .3 * se)], [1, mixHex(P.ind1, mixHex(P.blue0, GOLD.deep, se), .4 + .3 * se)]]); ctx.fillRect(wx, wy, ww, wh);
    E.stars(ctx, 5531, 40, t, [wx, wy, ww, wh * .5], .5 * (1 - se * .7));
    const gy = wy + wh * .8; ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(wx, gy, ww, wh * .2);
    const sl = [wx + ww * .8, wy + wh * .38]; ctx.fillStyle = mixHex(P.night0, P.ind2, .3); ctx.fillRect(sl[0] - 2, sl[1], 4, gy - sl[1]); halo(ctx, sl[0], sl[1], ww * .3, .35, LAMP.body, LAMP.core);
    // the car (a plain silhouette, side view)
    const cx = wx + ww * .42, cy = gy + wh * .02, cl = ww * .46; ctx.fillStyle = mixHex(P.night0, P.ind1, .55);
    ctx.beginPath(); ctx.moveTo(cx - cl / 2, cy); ctx.lineTo(cx - cl / 2, cy - cl * .14); ctx.lineTo(cx - cl * .28, cy - cl * .16); ctx.lineTo(cx - cl * .15, cy - cl * .3); ctx.lineTo(cx + cl * .2, cy - cl * .3); ctx.lineTo(cx + cl * .34, cy - cl * .16); ctx.lineTo(cx + cl / 2, cy - cl * .13); ctx.lineTo(cx + cl / 2, cy); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(LAMP.body, .25); ctx.fillRect(cx - cl * .12, cy - cl * .27, cl * .28, cl * .1);
    ctx.fillStyle = P.night0; for (const k of [-.3, .3]) { ctx.beginPath(); ctx.arc(cx + cl * k, cy, cl * .07, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = mixHex(P.night0, P.ind2, .3); ctx.lineWidth = 16; ctx.strokeRect(wx, wy, ww, wh); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
  }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.paper(ctx, t, { x: z.x * z.s, y: z.y * z.s }); ctx.restore();
  // the pendant lamp (cream practical light), its pool on the table
  const lx = w * .4, ly = h * .2;
  ctx.strokeStyle = mixHex(P.night0, P.ind2, .4); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(lx, -h); ctx.lineTo(lx, ly - 30); ctx.stroke();
  ctx.fillStyle = mixHex(P.night0, P.ind2, .55); ctx.beginPath(); ctx.moveTo(lx - 30, ly - 30); ctx.lineTo(lx + 30, ly - 30); ctx.lineTo(lx + 80, ly + 30); ctx.lineTo(lx - 80, ly + 30); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(LAMP.core, .9 * lamp); ctx.beginPath(); ctx.ellipse(lx, ly + 30, 78, 9, 0, 0, TAU); ctx.fill();
  halo(ctx, lx, ly + 200, w * .42, .3 * lamp, LAMP.body, LAMP.core);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, ly + 30, 0, ty, [[0, rgba(LAMP.body, .12 * lamp)], [1, rgba(LAMP.body, .03 * lamp)]]);
  ctx.beginPath(); ctx.moveTo(lx - 80, ly + 30); ctx.lineTo(lx + 80, ly + 30); ctx.lineTo(lx + 420, ty); ctx.lineTo(lx - 420, ty); ctx.closePath(); ctx.fill(); ctx.restore();
  // you, standing behind the table, the phone in the right hand (drawn first: the table hides the legs)
  const yo = o.you || {}, hold = clamp(yo.hold ?? 1), yx = w * .33, yh = h * .62;
  let hand = null;
  if ((yo.a ?? 1) > 0) hand = E.du(ctx, yx, ty + yh * .3, yh, { look: yo.look ?? .05, lean: yo.lean ?? .04, dir: 1, light: 1, back: .25, a: yo.a, armR: [lerp(.2, .62, hold), lerp(.1, 2.35, hold)], armL: [-.15, -.1], ...(yo.o || {}) }).R;
  // the table
  ctx.fillStyle = lin(ctx, 0, ty, 0, ty + 18, [[0, mixHex(P.ind2, LAMP.deep, .45 * lamp)], [1, mixHex(P.night1, P.ind2, .5)]]); ctx.fillRect(w * .08, ty, w * .62, 18);
  ctx.fillStyle = lin(ctx, 0, ty + 18, 0, h, [[0, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]); ctx.fillRect(w * .1, ty + 18, w * .58, h - ty);
  // the letter from the bank, flat on the table
  const lu = clamp(o.letter ?? 1);
  if (lu > 0) { ctx.save(); ctx.globalAlpha *= lu; ctx.translate(w * .5, ty + 6); ctx.transform(1, 0, -.9, .28, 0, 0);
    ctx.fillStyle = mixHex(P.cream, LAMP.body, .3); ctx.fillRect(-90, -80, 180, 120); ctx.fillStyle = rgba(P.night1, .6); ctx.fillRect(-70, -64, 70, 14);
    for (let k = 0; k < 4; k++) { ctx.fillStyle = rgba(P.night1, .3); ctx.fillRect(-70, -34 + k * 18, 120 - (k % 2) * 30, 6); } ctx.restore();
    E.glowText(ctx, 'BANK', w * .5 - 22, ty + 2, { size: 13, weight: 600, spacing: .2, col: rgba(P.night1, .7 * lu), glow: false }); }
  // devices for the tips (B2): laptop, router, an old dusty router; three AUTO-UPDATE switches
  const dv = o.devices;
  if (dv) {
    const la = dv.laptop ?? 0; if (la > 0) { ctx.globalAlpha = la; ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(w * .54, ty - 110, 170, 108); ctx.fillStyle = mixHex(P.ind1, LAMP.body, .4); ctx.fillRect(w * .54 + 10, ty - 100, 150, 88); ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.fillRect(w * .54 - 20, ty - 4, 210, 6); ctx.globalAlpha = 1; }
    const ra = dv.router ?? 0; if (ra > 0) { ctx.globalAlpha = ra; ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(w * .2, ty - 34, 120, 34); for (const k of [0, 1, 2]) { ctx.fillStyle = rgba(CHECK.body, .8); ctx.fillRect(w * .2 + 16 + k * 18, ty - 18, 6, 4); } ctx.fillRect(w * .2 + 20, ty - 84, 4, 50); ctx.fillRect(w * .2 + 96, ty - 84, 4, 50); ctx.globalAlpha = 1; }
    const oa = dv.old ?? 0; if (oa > 0) { ctx.globalAlpha = oa; ctx.fillStyle = mixHex(P.ind2, P.shade1, .25); ctx.fillRect(w * .12, ty - 28, 90, 28); ctx.fillStyle = rgba(P.halo2, .25); ctx.fillRect(w * .12, ty - 28, 90, 3); ctx.globalAlpha = 1; }
  }
  // the phone in your hand (or on the table)
  let pr = null;
  const po = o.phone || {}, ph = h * .14;
  const px = hand ? hand[0] + 4 : w * .42, py = hand ? hand[1] - ph * .32 : ty - 4;
  pr = F.phone(ctx, t, px, py, ph, { lit: po.lit ?? 1, screen: po.screen, core: po.core ?? 0, rot: hand ? -.12 : 0, a: po.a ?? 1 });
  if (o.extra) o.extra(ctx, w, h);
  ctx.restore();
  return { phone: pr, hand, zoom: z };
}

// ================================================================================================================= A PARCEL (the next machine, held back)
// (x, y) = bottom centre, s = width. o { label (NEXT), stamp (HELD BACK), stampU 0..1, a, roll (wheels turn: px moved) }
export function parcel(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const h = s * .78;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x, y + 2, s * .6, s * .05, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = lin(ctx, x - s / 2, 0, x + s / 2, 0, [[0, mixHex(P.ind2, P.night1, .3)], [1, mixHex(P.ind2, GOLD.deep, .35)]]); ctx.fillRect(x - s / 2, y - h, s, h);
  ctx.fillStyle = mixHex(P.ind2, GOLD.deep, .2); ctx.beginPath(); ctx.moveTo(x - s / 2, y - h); ctx.lineTo(x - s / 2 + s * .14, y - h - s * .12); ctx.lineTo(x + s / 2 + s * .14, y - h - s * .12); ctx.lineTo(x + s / 2, y - h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.moveTo(x + s / 2, y - h); ctx.lineTo(x + s / 2 + s * .14, y - h - s * .12); ctx.lineTo(x + s / 2 + s * .14, y - s * .12); ctx.lineTo(x + s / 2, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(GOLD.line, .45); ctx.fillRect(x - s * .04, y - h, s * .08, h);
  if (o.label) E.glowText(ctx, o.label, x, y - h * .42, { size: s * .2, weight: 600, spacing: .14, align: 'center', col: P.cream, glow: false });
  if (o.stamp) F.stamp(ctx, t, o.stamp, x - s * .42, y - h * .14, { t0: o.stampT0 ?? -1, size: s * .13, rot: -.12, ink: P.cream });
  ctx.restore();
}

// ================================================================================================================= THE PLATES
// A plate camera = look(X, Y, Z, mag, sx, sy); while it creeps, mag × k and X + TRUCK·(k − 1)/CREEP (world units at that depth).
const plateCam = (P0, k) => look(P0[0] + tr(k) * P0[2] / F0, P0[1], P0[2], P0[3] * k, P0[4], P0[5], P0[6] ?? HZ);   // P0 = [X, Y, Z, mag, sx, sy, hz]
// 1 · Lead → B1: THE LINE, WIDE (door right, marks 1–5 lit, you on 5 looking up toward the door)
export const LINE_P = [1400, 0, 7000, .62, 960, 700, 520];   // the whole line from a raised camera behind you: you bottom left, the door top right
export const LINE_CAM = plateCam(LINE_P, 1);
export const LINE_ST = { mark: () => ({ lit: 1 }), you: { o: { look: .85 } } };
export function plateLine(ctx, t, T) { lineWorld(ctx, plateCam(LINE_P, creep(t, T, 'At the very front stand')), t, LINE_ST); }
// 2 · B1 → B2: mark 4 (the defenders with their tool cases), the door far behind them, mark 4 lit
export const FOUR_P = [-230, 140, 3100, 2.0, 1010, 640, 520];
export const FOUR_CAM = plateCam(FOUR_P, 1);
export const FOUR_ST = { mark: (i) => ({ lit: i === 3 ? 1 : .3 }), person: (k, q) => (q.st === 3 ? { look: .35 } : {}) };
export function plateFour(ctx, t, T) { lineWorld(ctx, plateCam(FOUR_P, creep(t, T, 'Fourth in line stand')), t, FOUR_ST); }
// 3 · B2 → B3: the door, closed; on its threshold the parcel NEXT stamped HELD BACK; the head of the line small at the left
export const HELD_P = [LINE.door.x - 500, 1800, LINE.door.z, 1.9, 960, 430, 600];
export const HELD_CAM = plateCam(HELD_P, 1);
export const HELD_PARCEL = { x: LINE.door.x - 300, z: LINE.door.z - 700, s: 900 };
export const heldParcel = (ctx, c, t, o = {}) => at(ctx, c, HELD_PARCEL.x, HELD_PARCEL.z, () => parcel(ctx, t, 0, 0, HELD_PARCEL.s, { label: 'ASTRA 6.1', stamp: 'HELD BACK', ...o }));
export const HELD_ST = { mark: () => ({ lit: .3 }) };
export function plateHeld(ctx, t, T) { const c = plateCam(HELD_P, creep(t, T, 'That call was made inside')); lineWorld(ctx, c, t, { ...HELD_ST, extra: (cx) => heldParcel(cx, c, t) }); }

// ================================================================================================================= THE END SCREEN (last 15 s)
// The door centred and calm between the two free areas for the YouTube tiles (sky left, wall right); the line below; you ONE PLACE FURTHER
// FORWARD than in frame 0 (st.you = { x, z } of QUEUE[0]'s place: the line moved up). The subscribe circle sits on the door's lower half
// (its leak still glows around it). Nothing moves there but drift, breath, the dust in the leak, the stars. No text, no QR.
export const END_P = [LINE.door.x, LINE.door.h * .52, LINE.door.z, .62, 960, 560, 700];   // own horizon (hz 700) so the door stands higher
export const END_CAM = plateCam(END_P, 1);
export const END_TILES = { left: { x: 100, y: 130, w: 720, h: 405 }, right: { x: 1100, y: 130, w: 720, h: 405 }, subscribe: { x: 960, y: 935, r: 90 } };
export function motes(ctx, t, x, y, w, h, a = 1, col = GOLD.core) {
  const r = prng(5544);
  for (let k = 0; k < 60; k++) { const u = r(), v = r(), s = r(), ph = r() * TAU; const px = x + ((u + t * .006 * (s - .5)) % 1 + 1) % 1 * w, py = y + ((v - t * .01 * (.4 + s)) % 1 + 1) % 1 * h, al = a * (.25 + .5 * s) * (.6 + .4 * Math.sin(t * .8 + ph));
    ctx.fillStyle = rgba(col, al); ctx.fillRect(px, py, 1.6 + s * 1.6, 1.6 + s * 1.6); }
}
