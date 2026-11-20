// Film 65 · THE LINE (the one world of the film) + the kitchen behind her window + the seam plates between the builder groups
// (owned by the lead; builders import, never edit — wishes go in the report).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it. Both
// call it with the same (t, T): the seam is invisible by construction. Plates creep (CREEP 3 %/s push, TRUCK 24 px/s); the receiving side
// continues both. Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet65.mjs <dir>
//
//   Lead → B1 at T.G('The first step is the voice')   (c01 → c02): plateLine(ctx, t, T, 1)   pole 1 by her house, its tag 1 lit gold
//   B1 → B2  at T.G('The third step is a face')       (c06 → c07): plateLine(ctx, t, T, 3)   pole 3 half-way down the hill, tag 3 lit
//   B2 → B3  at T.G('Then one step is left')          (c11 → c12): plateLine(ctx, t, T, 5)   pole 5 at the foot of the hill, the bank window
//   Each plate: the line seen from the valley, the camera centred on pole k (left third), the wire running on down to the bank (right),
//   the tags < k already lit gold (steps that were explained), tag k glowing, the kitchen window warm far left (step 1) or out of frame.
//
// THE LINE (thumbnail A, echoed, not copied; a real pinhole world): a sleeping valley town at night. On the far hill left HER HOUSE with one
// warm kitchen window. One telephone line on five wooden poles (tags 1–5 = the five steps the scam must pass) runs from her house down the
// hill to THE BANK at the foot of the hill (a calm lit counter window with a real teller: step 5). Behind: the town (warm windows), the
// river, low hills, the far ridge; behind the far ridge a cold blue glow = where the machine's copies come from (st.source). On the near
// hill right YOU (the yellow coat) with your phone. A voice travels as a ribbon of light (F.voiceWave on arc3): gold = a real voice,
// blue = the copy.
import * as E from './f10_editorial.mjs';
import * as F from './f65_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, halo, lin, rad, prng } = E;
const { GOLD, COPY, LAMP, INK, WOOD, F0 } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
export const CREEP = .03;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 24;
const tr = (k) => TRUCK * (k - 1) / CREEP;

// ================================================================================================================= THE WORLD
// camera { x, y, z, f, hz } (E.cam3), world X right, Y UP from the valley floor, Z away. A world point projects to
//   sx = W/2 + (X − c.x)·s,  sy = hz + (EYE − Y − c.y)·s,  s = c.f / (Z − c.z).   (camera height above the valley floor = EYE − c.y)
export const HZ = 640, EYE = 160, Z_REF = 60000;
export const WORLD = {
  her: { z: 6400 },                                                                          // her hill: the silhouette line at z 6400
  house: { x: -1750, z: 6400, w: 560, h: 300, roof: 210, win: { x: 120, y: 160, w: 150, h: 112 }, door: { x: -150, w: 90, h: 190 } },
  poles: [-1300, -800, -300, 200, 700].map((x, k) => ({ x, z: 6380, h: 430 - k * 6, k: k + 1 })),
  bank: { x: 1500, z: 6500, w: 940, h: 470, win: { x: 150, y: 120, w: 280, h: 190 }, door: { x: -230, w: 130, h: 230 }, attach: { x: -470, y: 400 } },
  you: { x: 1050, z: 2600, h: 172 },                                                         // you on the near hill (right)
  yours: { z: 2600 },
  source: { x: -2100, y: 1150, z: 32000 },                                                   // the cold glow behind the far ridge (the copies)
  river: { z0: 15200, z1: 17400 }, town: { z0: 8200, z1: 14200 }, mid: { z: 22000 }, ridge: { z: 32000 },
};
// her hill: height above the valley floor at x (top near the house, down to the floor at x ≈ 950)
export const herY = (x) => { const u = clamp((x + 2000) / 2950); return x < -2000 ? 430 - 160 * clamp((-2000 - x) / 5000) : 430 * (1 - u * u * (3 - 2 * u)); };
// your hill (z 2600): up from the valley at x 250 to a soft top round x 1200
export const yourY = (x) => { if (x < 250) return 0; const u = clamp((x - 250) / 900); return 240 * u * u * (3 - 2 * u) - 30 * clamp((x - 2200) / 2200); };
export const poleTop = (k) => { const p = WORLD.poles[k - 1]; return [p.x, herY(p.x) + p.h, p.z]; };
const HOUSE_EAVE = () => { const h = WORLD.house; return [h.x + h.w / 2 - 20, herY(h.x) + h.h - 30, h.z - 10]; };
const BANK_ATT = () => { const b = WORLD.bank; return [b.x + b.attach.x, b.attach.y, b.z - 10]; };
// the wire as world points: house eave → poles 1..5 → the bank wall (a slight sag between supports)
export const WIRE = (() => {
  const sup = [HOUSE_EAVE(), ...[1, 2, 3, 4, 5].map(poleTop), BANK_ATT()], out = [];
  for (let i = 0; i < sup.length - 1; i++) {
    const A = sup[i], B = sup[i + 1];
    for (let j = 0; j < 12; j++) { const u = j / 12, sag = 46 * 4 * u * (1 - u); out.push([lerp(A[0], B[0], u), lerp(A[1], B[1], u) - sag, lerp(A[2], B[2], u), i + u]); }
  }
  out.push([...sup[sup.length - 1], sup.length - 1]); return out;
})();
// the town: seeded houses on the valley floor behind the line (windows: lit warm or dark), sorted far → near
export const TOWN = (() => {
  const r = prng(6511), out = [];
  for (let k = 0; k < 46; k++) {
    const z = lerp(WORLD.town.z0, WORLD.town.z1, Math.pow(r(), .8)), x = -2600 + r() * 11000 + (z - 8000) * .1;
    if (Math.abs(x - WORLD.bank.x) < 700 && z < 9000) continue;
    const w = 260 + r() * 300, h = 200 + r() * 200, roof = r() < .6 ? 90 + r() * 90 : 0, nw = 1 + Math.floor(r() * 3), wins = [];
    for (let j = 0; j < nw; j++) wins.push({ x: -w / 2 + (j + .5) * w / nw + (r() - .5) * 20, y: h * (.35 + r() * .35), lit: r() < .5 ? 1 : 0, ph: r() * TAU });
    out.push({ x, z, w, h, roof, wins, tone: r() });
  }
  return out.sort((a, b) => b.z - a.z);
})();
// every lit town window as a world point (for sparks that rise from the town: the money of many families)
export const WINDOWS = TOWN.flatMap((hs) => hs.wins.filter((w) => w.lit).map((w) => ({ x: hs.x + w.x, y: w.y, z: hs.z, ph: w.ph })));
const STARS = (() => { const r = prng(6505), out = []; for (let k = 0; k < 240; k++) out.push([r(), r(), r(), r() * TAU, .4 + r()]); return out; })();
const RIDGE = (() => { const r = prng(6544), out = []; let h = 900; for (let k = 0; k <= 80; k++) { h = clamp(h + (r() - .5) * 260, 520, 1500); out.push(h); } return out; })();
const MID = (() => { const r = prng(6533), out = []; let h = 320; for (let k = 0; k <= 60; k++) { h = clamp(h + (r() - .5) * 120, 120, 520); out.push(h); } return out; })();
const MIDLIGHTS = (() => { const r = prng(6577), out = []; for (let k = 0; k < 26; k++) out.push([r(), r(), r() * TAU]); return out; })();
const GRASS = (() => { const r = prng(6588), out = []; for (let k = 0; k < 70; k++) out.push([r(), r(), r(), r() * TAU]); return out; })();

// projection helpers: proj(c, X, Y, Z) → [sx, sy, s] (s = px per world unit) or null (behind the camera)
export function proj(c, X, Y, Z) { const dz = Z - c.z; if (dz < 20) return null; const s = c.f / dz; return [W / 2 + (X - c.x) * s, (c.hz ?? HZ) + (EYE - Y - c.y) * s, s]; }
// the camera that shows world point (X, Y, Z) at screen (sx, sy) with mag = scale relative to the home view of that depth (1 = home).
export function look(X, Y, Z, mag = 1, sx = W / 2, sy = H / 2, hz = HZ) {
  const s = mag * F0 / Z, dz = F0 / s, y = EYE - Y - (sy - hz) / s;
  return E.cam3({ x: X - (sx - W / 2) / s, y, z: Z - dz, f: F0, hz });
}
// draw fn in world units at (X, Y, Z) (local y up is negative): returns false when behind the camera
export function at(ctx, c, X, Z, fn, Y = 0) { const p = proj(c, X, Y, Z); if (!p) return false; ctx.save(); ctx.setTransform(p[2], 0, 0, p[2], p[0], p[1]); fn(p[2]); ctx.restore(); return true; }
// camera path through keys [[t, cam]…] (monotone cubic in x, y, log(Z_REF − z) and hz): C1-smooth, no overshoot, safe for deep flights
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
// a 3D arc between two world points (lift = world units at the middle) → screen points, for voices across the valley
export function arc3(c, A, B, lift = 600, n = 40) {
  const out = [];
  for (let i = 0; i <= n; i++) { const u = i / n, p = proj(c, lerp(A[0], B[0], u), lerp(A[1], B[1], u) + lift * 4 * u * (1 - u), lerp(A[2], B[2], u)); if (p) out.push([p[0], p[1]]); }
  return out;
}
// world points of the kitchen window, the bank window and the source, and their screen rects
export const winWorld = () => { const h = WORLD.house; return [h.x + h.win.x, herY(h.x) + h.win.y, h.z - 2]; };
export const bankWinWorld = () => { const b = WORLD.bank; return [b.x + b.win.x, b.win.y, b.z - 2]; };
export function winRect(c) { const h = WORLD.house, w = h.win, y0 = herY(h.x), a = proj(c, h.x + w.x - w.w / 2, y0 + w.y + w.h / 2, h.z), b = proj(c, h.x + w.x + w.w / 2, y0 + w.y - w.h / 2, h.z); return a && b ? { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] } : null; }
export function bankWinRect(c) { const bk = WORLD.bank, w = bk.win, a = proj(c, bk.x + w.x - w.w / 2, w.y + w.h / 2, bk.z), b = proj(c, bk.x + w.x + w.w / 2, w.y - w.h / 2, bk.z); return a && b ? { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] } : null; }
const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
// a hill silhouette at depth z with height profile fy(x): filled from its ridge down to its own foot line (or to the screen bottom)
function hill(ctx, c, z, fy, x0, x1, fill, o = {}) {
  const top = [], step = (x1 - x0) / (o.n ?? 90);
  for (let x = x0; x <= x1 + 1e-6; x += step) { const p = proj(c, x, fy(x), z); if (p) top.push(p); }
  if (top.length < 2) return top;
  ctx.beginPath(); top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  const bot = o.toBottom ? H + 40 : null;
  for (let i = top.length - 1; i >= 0; i -= Math.max(1, (top.length - 1) >> 3)) { const q = proj(c, x0 + i * step, 0, z); ctx.lineTo(top[i][0], bot ?? (q ? q[1] + 4 : H + 40)); }
  ctx.lineTo(top[0][0], bot ?? H + 40); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  if (o.rim) { ctx.strokeStyle = o.rim; ctx.lineWidth = o.rimW ?? 1.5; ctx.beginPath(); let pen = false; top.forEach((p, i) => { if (fy(x0 + i * step) < 2) { pen = false; return; } if (pen) ctx.lineTo(p[0], p[1]); else { ctx.moveTo(p[0], p[1]); pen = true; } }); ctx.stroke(); }
  return top;
}

// lineWorld(ctx, c, t, st) → { you: hands, phone: {x, y, h, screen}, win: rect, bankWin: rect, pole(k) → [sx, sy, s] (top), source: [sx, sy] }
// st (all optional):
//   tags: { lit(k) → 0..1, hi: k (the step being told), hiA 0..1 (its glow), a } ·
//   sky 0..1 (stars) · moon { x, y, a } (screen px; a slow moon is the only clock allowed) · source { a, pulse } (the cold glow behind the ridge)
//   town { a (window light), lit(k, w) → 0..1 override } · river 0..1
//   house { win 0..1 (+ boost), a } · bank { win 0..1, glow 0..1 (the calm gold of step 5), teller 0..1 } · tags { lit(k) → 0..1, hi: k, a }
//   ghosts { a, of(k) → 0..1 } (blue copies of poles 1–4: "a machine can fake it") · wire { a, gold 0..1 (lit gold from the house to u), u (0..7) }
//   you { a, look, phone 0..1 (held up), o } | false · grass 0..1 · back(ctx, out) (after the valley, before her hill) · extra(ctx, out) (last)
export function lineWorld(ctx, c, t, st = {}) {
  const hz = c.hz ?? HZ, out = {};
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the sky: night indigo down to a pale cold band at the horizon; stars drift with the pan
  ctx.fillStyle = lin(ctx, 0, Math.min(0, hz - 900), 0, hz + 60, [[0, mixHex(P.night1, P.ind1, .3)], [.5, mixHex(P.ind1, P.blue0, .3)], [1, mixHex(P.blue0, P.blue1, .35)]]); ctx.fillRect(0, 0, W, H);
  const sa = .6 * (st.sky ?? 1);
  if (sa > 0) for (const [u, v, s2, ph, f] of STARS) { const x = ((u * 2600 - c.x * .02) % 2600 + 2600) % 2600 - 340, y = v * (Math.max(hz, 400) - 80) - c.y * .02 - Math.max(0, 400 - hz); if (y > hz - 20) continue; ctx.globalAlpha = sa * (.55 + .45 * Math.sin(t * f + ph)) * (1 - v * .6); ctx.fillStyle = P.cream; ctx.fillRect(x, y, s2 > .93 ? 2.6 : 1.5, s2 > .93 ? 2.6 : 1.5); }
  ctx.globalAlpha = 1;
  if (st.moon && (st.moon.a ?? 1) > 0) { const m = st.moon, ma = m.a ?? 1; halo(ctx, m.x, m.y, 150, .16 * ma, P.halo2, P.cream); ctx.globalAlpha = ma; ctx.fillStyle = mixHex(P.cream, P.halo2, .25); ctx.beginPath(); ctx.arc(m.x, m.y, 26, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(P.ind1, .55); ctx.beginPath(); ctx.arc(m.x + 10, m.y - 5, 23, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
  // the cold glow behind the far ridge (where the copies come from)
  const so = st.source, sw = WORLD.source, sp = proj(c, sw.x, sw.y, sw.z);
  if (sp) out.source = [sp[0], sp[1]];
  if (so && (so.a ?? 1) > 0 && sp) {
    const sa2 = (so.a ?? 1) * (1 + .25 * (so.pulse ?? 0) * Math.sin(t * 2.2));
    ctx.globalCompositeOperation = 'lighter';
    ctx.save(); ctx.translate(sp[0], sp[1] + 30); ctx.scale(1, .5); ctx.fillStyle = rad(ctx, 0, 0, 560, [[0, rgba(COPY.core, .5 * sa2)], [.12, rgba(COPY.body, .38 * sa2)], [.4, rgba(COPY.halo, .16 * sa2)], [1, rgba(COPY.halo, 0)]]); ctx.fillRect(-600, -600, 1200, 1200); ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
  }
  // the far ridge, the mid hills (with a few far farm lights), the valley floor, the river
  const rz = WORLD.ridge.z, rstep = 40000 / 80;
  hill(ctx, c, rz, (x) => { const k = clamp((x + 20000) / rstep, 0, 79.999), i = Math.floor(k), f = k - i; return lerp(RIDGE[i], RIDGE[i + 1], f * f * (3 - 2 * f)); }, -20000, 20000, mixHex(INK.far, P.blue0, .2), { rim: rgba(mixHex(P.blue1, COPY.line, .25 * (so?.a ?? 0)), .35), n: 120 });
  const mz = WORLD.mid.z, mstep = 30000 / 60;
  const midY = (x) => { const k = clamp((x + 15000) / mstep, 0, 59.999), i = Math.floor(k), f = k - i; return lerp(MID[i], MID[i + 1], f * f * (3 - 2 * f)); };
  hill(ctx, c, mz, midY, -15000, 15000, mixHex(INK.far, INK.mid, .5), { n: 90 });
  for (const [u, v, ph] of MIDLIGHTS) { const x = -12000 + u * 24000, p = proj(c, x, midY(x) * v * .8, mz - 50); if (!p || p[0] < -10 || p[0] > W + 10) continue; ctx.fillStyle = rgba(LAMP.body, .45 + .2 * Math.sin(t * .7 + ph)); ctx.fillRect(p[0] - 1, p[1] - 1, 2, 2); }
  const fz = proj(c, 0, 0, WORLD.river.z1), gy0 = fz ? fz[1] : hz;
  const ground = () => lin(ctx, 0, gy0, 0, H + 60, [[0, mixHex(INK.mid, P.blue0, .55)], [.35, mixHex(INK.mid, P.blue0, .3)], [1, mixHex(INK.mid, P.blue0, .1)]]);
  ctx.fillStyle = ground(); ctx.fillRect(0, gy0, W, H - gy0 + 60);
  const ra = st.river ?? 1, r0 = proj(c, 0, 0, WORLD.river.z1), r1 = proj(c, 0, 0, WORLD.river.z0);
  if (ra > 0 && r0 && r1) {
    ctx.fillStyle = lin(ctx, 0, r0[1], 0, r1[1], [[0, rgba(mixHex(P.blue0, P.halo2, .3), .5 * ra)], [1, rgba(mixHex(P.ind1, P.blue0, .4), .55 * ra)]]); ctx.fillRect(0, r0[1], W, r1[1] - r0[1]);
    ctx.globalCompositeOperation = 'lighter';
    for (const hs of TOWN) for (const w of hs.wins) {
      if (!w.lit) continue; const p = proj(c, hs.x + w.x, 0, WORLD.river.z0 + (WORLD.river.z1 - WORLD.river.z0) * .3); if (!p || p[0] < -20 || p[0] > W + 20) continue;
      const yy = lerp(r0[1], r1[1], .35 + .3 * Math.sin(w.ph)), ln = 10 + 8 * Math.sin(t * .8 + w.ph);
      ctx.fillStyle = rgba(LAMP.body, .16 * ra * (st.town?.a ?? 1)); ctx.fillRect(p[0] - ln / 2 + 3 * Math.sin(t * 1.3 + w.ph), yy, ln, 1.6);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.restore();
  F.paper(ctx, t, { x: -c.x * .02, y: 0 });
  // THE TOWN (far → near), then the bank
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const ta = st.town?.a ?? 1;
  TOWN.forEach((hs, k) => {
    const p = proj(c, hs.x, 0, hs.z); if (!p) return; const s = p[2]; if (p[0] + hs.w * s < -20 || p[0] - hs.w * s > W + 20) return;
    const wall = mixHex(INK.mid, INK.near, .3 + .4 * hs.tone);
    at(ctx, c, hs.x, hs.z, () => {
      ctx.fillStyle = wall; ctx.fillRect(-hs.w / 2, -hs.h, hs.w, hs.h);
      if (hs.roof) { ctx.beginPath(); ctx.moveTo(-hs.w / 2 - 14, -hs.h); ctx.lineTo(0, -hs.h - hs.roof); ctx.lineTo(hs.w / 2 + 14, -hs.h); ctx.closePath(); ctx.fillStyle = mixHex(wall, P.night0, .3); ctx.fill(); }
      for (const w of hs.wins) {
        const li = clamp((st.town?.lit ? st.town.lit(k, w) : w.lit) * ta) * (.85 + .15 * Math.sin(t * .4 + w.ph));
        ctx.fillStyle = li > .02 ? mixHex(mixHex(INK.near, P.night0, .2), LAMP.body, li) : mixHex(INK.near, P.night0, .3); ctx.fillRect(w.x - 26, -w.y - 22, 52, 44);
      }
    });
  });
  // THE BANK at the foot of her hill: a pale stone front, a pediment, two pilasters, the door, the big lit counter window with the teller
  const bk = WORLD.bank, bo = st.bank || {}, bwin = bo.win ?? .8, bglow = clamp(bo.glow ?? 0);
  const bp = proj(c, bk.x + bk.win.x, bk.win.y, bk.z);
  if (bp && (bwin > 0 || bglow > 0)) halo(ctx, bp[0], bp[1], 340 * bp[2] * (1 + .5 * bglow), (.18 * bwin + .3 * bglow), bglow > 0 ? GOLD.halo : LAMP.halo, bglow > 0 ? GOLD.core : LAMP.core);
  at(ctx, c, bk.x, bk.z, () => {
    const w = bk.w, h = bk.h, stone = mixHex(INK.mid, P.blue1, .28), stoneL = mixHex(stone, P.halo2, .12);
    ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, stone], [1, stoneL]]); ctx.fillRect(-w / 2, -h, w, h);
    ctx.fillStyle = mixHex(stone, P.night0, .25); ctx.beginPath(); ctx.moveTo(-w / 2 - 30, -h); ctx.lineTo(0, -h - 120); ctx.lineTo(w / 2 + 30, -h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(stoneL, P.cream, .12); ctx.fillRect(-w / 2 - 30, -h - 10, w + 60, 18);
    for (const px of [-w / 2 + 40, -w / 2 + 330, w / 2 - 40]) { ctx.fillStyle = mixHex(stoneL, P.cream, .08); ctx.fillRect(px - 18, -h + 10, 36, h - 10); }
    ctx.fillStyle = mixHex(INK.near, P.night0, .4); ctx.fillRect(bk.door.x - bk.door.w / 2, -bk.door.h, bk.door.w, bk.door.h);
    E.glowText(ctx, 'BANK', 0, -h - 32, { size: 54, weight: 600, align: 'center', col: rgba(P.cream, .8), glow: false, spacing: .3 });
    // the counter window: warm light, the counter, the teller (a real person: step 5)
    const wx = bk.win.x, wy = bk.win.y, ww = bk.win.w, wh = bk.win.h;
    ctx.save(); ctx.beginPath(); ctx.rect(wx - ww / 2, -wy - wh / 2, ww, wh); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, -wy - wh / 2, 0, -wy + wh / 2, [[0, mixHex(LAMP.body, GOLD.core, .3 * bglow)], [1, mixHex(LAMP.halo, GOLD.body, .4 * bglow)]]); ctx.globalAlpha = clamp(bwin + bglow); ctx.fillRect(wx - ww / 2, -wy - wh / 2, ww, wh); ctx.globalAlpha = 1;
    if ((bo.teller ?? 1) > 0) { ctx.globalAlpha = bo.teller ?? 1; E.person(ctx, wx + 30, -wy + wh / 2 + 80, 210, { look: .1 + .05 * Math.sin(t * .5), lean: .04, light: -1 }); ctx.globalAlpha = 1; }
    ctx.fillStyle = mixHex(WOOD.body, LAMP.deep, .4); ctx.fillRect(wx - ww / 2, -wy + wh / 2 - 34, ww, 34);
    ctx.restore();
    ctx.strokeStyle = rgba(P.cream, .4); ctx.lineWidth = 6; ctx.strokeRect(wx - ww / 2, -wy - wh / 2, ww, wh);
  });
  out.bankWin = bankWinRect(c);
  ctx.restore();
  if (st.back) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); st.back(ctx, out); ctx.restore(); }
  // HER HILL, her house, the poles, the wire, the tags
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const hz2 = WORLD.her.z;
  { const fz2 = proj(c, 0, 0, WORLD.river.z1), g0 = fz2 ? fz2[1] : hz; hill(ctx, c, hz2, herY, -9000, 1100, lin(ctx, 0, g0, 0, H + 60, [[0, mixHex(INK.mid, P.blue0, .45)], [.35, mixHex(INK.mid, P.blue0, .22)], [1, mixHex(INK.mid, P.blue0, .05)]]), { rim: rgba(INK.rim, .55), n: 110 }); }
  const ho = WORLD.house, hst = st.house || {}, wl = hst.win ?? 1, hy0 = herY(ho.x);
  const wp = proj(c, ho.x + ho.win.x, hy0 + ho.win.y, ho.z);
  if (wp && wl > 0) { halo(ctx, wp[0], wp[1], 260 * wp[2] * (1 + .25 * Math.max(0, wl - 1)), .3 * Math.min(1.6, wl), LAMP.halo, LAMP.core); }
  at(ctx, c, ho.x, ho.z, () => {
    const w = ho.w, h = ho.h, wall = mixHex(INK.mid, P.blue1, .18), wallL = mixHex(wall, LAMP.deep, .25);
    ctx.fillStyle = mixHex(INK.near, P.night0, .2); ctx.fillRect(-w / 2 + 70, -h - ho.roof + 30, 46, 110);                                  // chimney
    ctx.fillStyle = lin(ctx, -w / 2, 0, w / 2, 0, [[0, wall], [1, wallL]]); ctx.fillRect(-w / 2, -h, w, h);
    ctx.fillStyle = mixHex(wall, P.night0, .35); ctx.beginPath(); ctx.moveTo(-w / 2 - 34, -h + 4); ctx.lineTo(-w * .06, -h - ho.roof); ctx.lineTo(w / 2 + 34, -h + 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(INK.near, P.night0, .35); ctx.fillRect(ho.door.x - ho.door.w / 2, -ho.door.h, ho.door.w, ho.door.h);
    ctx.fillStyle = mixHex(INK.near, LAMP.deep, .2); ctx.fillRect(-w / 2 + 50, -h * .62, 70, 60);                                            // a dark window
    const x0 = ho.win.x - ho.win.w / 2, y0 = -hy0 * 0 - ho.win.y - ho.win.h / 2;
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + ho.win.h, [[0, mixHex(LAMP.core, LAMP.body, .3)], [1, LAMP.halo]]); ctx.globalAlpha = clamp(wl); ctx.fillRect(x0, y0, ho.win.w, ho.win.h); ctx.globalAlpha = 1;
    const two = clamp(hst.two ?? 0);
    if (two > 0) {   // inside, small: her (silver bun) and you (the yellow hood) at the table, the lamp between them
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, ho.win.w, ho.win.h); ctx.clip(); ctx.globalAlpha = two;
      ctx.fillStyle = mixHex(P.ind1, P.night0, .2); ctx.beginPath(); ctx.ellipse(x0 + 38, y0 + ho.win.h + 4, 26, 34, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x0 + 38 + .5 * Math.sin(t * .5), y0 + ho.win.h - 40, 13, 0, TAU); ctx.fill();
      ctx.fillStyle = mixHex(P.halo2, P.blue1, .3); ctx.beginPath(); ctx.arc(x0 + 45, y0 + ho.win.h - 50, 6, 0, TAU); ctx.fill();
      ctx.fillStyle = E.COAT.base; ctx.beginPath(); ctx.ellipse(x0 + ho.win.w - 36, y0 + ho.win.h + 4, 28, 36, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x0 + ho.win.w - 37, y0 + ho.win.h - 41, 15, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = mixHex(INK.near, P.night0, .3); ctx.fillRect(ho.win.x - 3, y0, 6, ho.win.h); ctx.fillRect(x0, y0 + ho.win.h * .45, ho.win.w, 5);
  }, hy0);
  out.win = winRect(c);
  // poles (with ghosts behind them), wire, tags
  const go = st.ghosts, tg = st.tags || {};
  const drawPole = (p, k, ghost) => {
    const y0 = herY(p.x); const pr = proj(c, p.x, y0, p.z); if (!pr || pr[0] < -200 || pr[0] > W + 200) return;
    at(ctx, c, p.x + (ghost ? 70 + 14 * Math.sin(t * .9 + k) : 0), p.z + (ghost ? 30 : 0), () => {
      const h = p.h, col = ghost ? rgba(COPY.body, .72) : null;
      ctx.fillStyle = col ?? lin(ctx, -10, 0, 10, 0, [[0, WOOD.shade], [.6, WOOD.body], [1, WOOD.lit]]);
      ctx.beginPath(); ctx.moveTo(-11, 0); ctx.lineTo(-7, -h); ctx.lineTo(7, -h); ctx.lineTo(11, 0); ctx.closePath(); ctx.fill();
      ctx.fillRect(-58, -h + 26, 116, 12);                                                                       // the cross-arm
      ctx.fillStyle = ghost ? rgba(COPY.core, .6) : rgba(P.halo2, .55); for (const ix of [-46, 46]) ctx.fillRect(ix - 4, -h + 14, 8, 13);
      if (ghost) { ctx.strokeStyle = rgba(COPY.line, .35); ctx.lineWidth = 2; ctx.strokeRect(-12, -h, 24, h); }
    }, y0);
  };
  WORLD.poles.forEach((p, i) => {
    const k = i + 1, ga = go ? clamp((go.a ?? 1) * (go.of ? go.of(k) : (k < 5 ? 1 : 0))) : 0;
    if (ga > 0) { ctx.save(); ctx.globalAlpha = ga * (.75 + .25 * Math.sin(t * 2.3 + k)); drawPole(p, k, true); ctx.restore(); }
    drawPole(p, k, false);
  });
  const wo = st.wire || {}, wa = wo.a ?? 1;
  if (wa > 0) {
    const pts = WIRE.map((q) => [proj(c, q[0], q[1], q[2]), q[3]]).filter((q) => q[0]);
    ctx.strokeStyle = rgba(mixHex(P.halo2, P.blue1, .45), .75 * wa); ctx.lineWidth = Math.max(1.6, 4 * (pts[0]?.[0][2] ?? .3)); ctx.beginPath();
    pts.forEach(([p], i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    const g = clamp(wo.gold ?? 0), gu = wo.u ?? 0;
    if (g > 0 && gu > 0) { const gp = pts.filter((q) => q[1] <= gu).map(([p]) => [p[0], p[1]]); if (gp.length > 1) F.accentSpan(ctx, gp, 0, 1, { col: GOLD, w: 2.4, a: g }); }
  }
  WORLD.poles.forEach((p, i) => {
    const k = i + 1, y0 = herY(p.x), pr = proj(c, p.x, y0 + 250, p.z - 4); if (!pr) return;
    const li = clamp(tg.lit ? tg.lit(k) : 0), hi = tg.hi === k ? clamp(tg.hiA ?? 1) : 0, s = pr[2], ta2 = tg.a ?? 1; if (ta2 <= 0) return;
    const tw = 74 * s, th = 92 * s;
    if (li > 0 || hi) halo(ctx, pr[0], pr[1], 160 * s * (1 + hi * .4), (.35 * li + .25 * hi) * ta2, GOLD.halo, GOLD.core);
    ctx.save(); ctx.globalAlpha = ta2; ctx.fillStyle = li > 0 ? mixHex(mixHex(P.cream, P.halo2, .3), GOLD.body, li) : mixHex(P.cream, P.halo2, .45);
    ctx.beginPath(); ctx.roundRect(pr[0] - tw / 2, pr[1] - th / 2, tw, th, 6 * s); ctx.fill();
    E.glowText(ctx, String(k), pr[0], pr[1] + 22 * s, { size: 62 * s, weight: 600, align: 'center', col: mixHex(P.night1, GOLD.deep, .3 * li), glow: false });
    ctx.restore();
  });
  out.pole = (k) => proj(c, ...poleTop(k));
  out.tag = (k) => { const p = WORLD.poles[k - 1]; return proj(c, p.x, herY(p.x) + 250, p.z - 4); };
  ctx.restore();
  // YOUR HILL and you (from behind, the phone in your hand)
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const yz = WORLD.yours.z;
  hill(ctx, c, yz, yourY, -14000, 9000, lin(ctx, 0, hz, 0, H, [[0, mixHex(INK.mid, P.blue0, .25)], [1, mixHex(INK.mid, INK.near, .4)]]), { rim: rgba(INK.rim, .6), rimW: 2, toBottom: true, n: 160 });
  const ga2 = st.grass ?? 1;
  if (ga2 > 0) {   // a few grass stalks on your hill's crest that sway (the near layer is never frozen)
    ctx.strokeStyle = rgba(INK.rim, .45 * ga2); ctx.lineWidth = 1.6; ctx.beginPath();
    for (const [u, v, hgt, ph] of GRASS) { const x = 300 + u * 4200, p = proj(c, x, yourY(x) - 4, yz - v * 60); if (!p || p[0] < -10 || p[0] > W + 10) continue; const hh = (18 + 30 * hgt) * p[2], sw2 = 6 * p[2] * Math.sin(t * .9 + ph); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(p[0] + sw2 * .4, p[1] - hh * .6, p[0] + sw2, p[1] - hh); }
    ctx.stroke();
  }
  const yo = st.you, Y = WORLD.you;
  if (yo !== false) {
    const yx = yo?.x ?? Y.x, py = proj(c, yx, yourY(yx), Y.z);
    if (py && (yo?.a ?? 1) > 0) {
      const hy = (yo?.h ?? Y.h) * py[2], ph = clamp(yo?.phone ?? 1);
      const tgt = [lerp(.2, .17, ph), lerp(-.3, -.56, ph)], arm = F.reachArm([.098, -.74], tgt, .17, .155, -1);
      out.you = E.du(ctx, py[0], py[1], hy, { view: 'back', back: .55, look: yo?.look ?? .1, armR: arm, armL: [-.12, -.06], a: yo?.a ?? 1, ...(yo?.o || {}) });
      const hx = py[0] + tgt[0] * hy, hy2 = py[1] + tgt[1] * hy, phh = hy * .16;
      if (ph > 0) out.phone = { x: hx - phh * .1, y: hy2 - phh * .35, h: phh, ...(F.phone(ctx, t, hx - phh * .1, hy2 - phh * .35, phh, { screen: yo?.screen ?? 'dark', light: yo?.light ?? .7, a: (yo?.a ?? 1) * clamp(ph * 2), rot: -.1, ring: yo?.ring ?? 0, timer: yo?.timer }) || {}) };
    }
  }
  ctx.restore();
  if (st.extra) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); st.extra(ctx, out); ctx.restore(); }
  return out;
}

// ================================================================================================================= THE KITCHEN (behind her window)
// kitchen(ctx, t, w, h, o) in w × h px (the portal's inside; 1920 × 1080 when full). Warm lamp over the table, the fridge left with the
// agreement notes, her at the table (right of centre), the phone on the table (or in her hand), the dark window right (the valley outside).
//   o.lamp 0..1 · o.notes [{ lines, cover, lit, empty, glowIn, a }…] (up to 5 slots on the fridge door, NOTE_SLOTS) · o.phone { screen, ring,
//   lift 0..1 (from the table to her ear), timer, light, waveCol, tremble } · o.mom { a, look, lean, x } | false · o.you { a, x } | false (at
//   the table opposite her: c16) · o.extra(ctx, out) (kitchen space, last) → { phone: {x, y, h, screen}, mom: hands, fridge: rect, slots: [[x, y, s]…] }
export const NOTE_SLOTS = [[205, 330], [345, 318], [215, 470], [352, 482], [282, 612]];
export const KITCHEN = { table: { x: 560, y: 760, w: 1180, h: 34 }, mom: { x: 1270, y: 1100, h: 660 }, phone: { x: 1000, y: 812, h: 130 }, lamp: { x: 1060, y: 250 }, fridge: { x: 120, y: 200, w: 330, h: 760 } };
export function kitchen(ctx, t, w, h, o = {}) {
  const sx = w / W, sy = h / H, out = {}, la = o.lamp ?? 1, K = KITCHEN;
  ctx.save(); ctx.scale(sx, sy);
  // the back wall (warm near the lamp), the window right (the night valley: a far ridge line and two town lights)
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, LAMP.deep, .14)], [.6, mixHex(P.night1, LAMP.deep, .17)], [1, mixHex(P.night0, LAMP.deep, .08)]]); ctx.fillRect(-900, -200, W + 1800, H + 400);
  ctx.fillStyle = rad(ctx, K.lamp.x, K.lamp.y + 160, 900, [[0, rgba(LAMP.body, .24 * la)], [.5, rgba(LAMP.halo, .07 * la)], [1, rgba(LAMP.halo, 0)]]); ctx.fillRect(-900, -200, W + 1800, H + 400);
  F.paper(ctx, t, { a: .8 });
  ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fillRect(1500, 170, 300, 380);
  ctx.fillStyle = mixHex(P.night1, P.blue0, .35); ctx.beginPath(); ctx.moveTo(1500, 470); for (let x = 0; x <= 300; x += 30) ctx.lineTo(1500 + x, 450 + 18 * Math.sin(x * .03 + 1)); ctx.lineTo(1800, 550); ctx.lineTo(1500, 550); ctx.closePath(); ctx.fill();
  for (const [x, y, ph] of [[1580, 505, 1], [1712, 515, 2], [1650, 498, 3]]) { ctx.fillStyle = rgba(LAMP.body, .6 + .15 * Math.sin(t * .6 + ph)); ctx.fillRect(x, y, 4, 4); }
  if (o.dark) { ctx.fillStyle = rgba(COPY.halo, .12 * o.dark); ctx.fillRect(1500, 170, 300, 380); }
  ctx.strokeStyle = mixHex(WOOD.body, LAMP.deep, .5); ctx.lineWidth = 14; ctx.strokeRect(1500, 170, 300, 380); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(1650, 170); ctx.lineTo(1650, 550); ctx.stroke();
  // the fridge with the notes
  const fr = K.fridge;
  ctx.fillStyle = lin(ctx, fr.x, 0, fr.x + fr.w, 0, [[0, mixHex(P.blue1, P.night1, .72)], [.7, mixHex(P.halo2, LAMP.deep, .86)], [1, mixHex(P.halo2, LAMP.deep, .74)]]); ctx.beginPath(); ctx.roundRect(fr.x, fr.y, fr.w, fr.h, 18); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(fr.x, fr.y + 220, fr.w, 5); ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(fr.x + fr.w - 34, fr.y + 260, 10, 140);
  out.fridge = fr; out.slots = NOTE_SLOTS.map(([x, y]) => [x, y, 112]);
  (o.notes || []).forEach((n, i) => { if (!n || !NOTE_SLOTS[i]) return; const [x, y] = NOTE_SLOTS[i]; F.note(ctx, t, x, y, 112, { tilt: [-.06, .05, .03, -.04, .02][i], ...n }); });
  // the lamp over the table (it sways a little on its cord: the room is never frozen)
  const sway = .012 * Math.sin(t * .9) + .006 * Math.sin(t * 2.1 + 1); ctx.save(); ctx.translate(K.lamp.x, 0); ctx.rotate(sway); ctx.translate(-K.lamp.x, 0);
  ctx.strokeStyle = rgba(P.night0, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(K.lamp.x, 0); ctx.lineTo(K.lamp.x, K.lamp.y - 50); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, LAMP.deep, .4); ctx.beginPath(); ctx.moveTo(K.lamp.x - 110, K.lamp.y + 20); ctx.lineTo(K.lamp.x - 40, K.lamp.y - 50); ctx.lineTo(K.lamp.x + 40, K.lamp.y - 50); ctx.lineTo(K.lamp.x + 110, K.lamp.y + 20); ctx.closePath(); ctx.fill();
  halo(ctx, K.lamp.x, K.lamp.y + 24, 140, .55 * la, LAMP.halo, LAMP.core);
  ctx.fillStyle = rgba(LAMP.core, .9 * la); ctx.beginPath(); ctx.ellipse(K.lamp.x, K.lamp.y + 20, 104, 12, 0, 0, TAU); ctx.fill();
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, K.lamp.y + 20, 0, K.table.y + 20, [[0, rgba(LAMP.body, .1 * la)], [1, rgba(LAMP.body, .015 * la)]]);
  ctx.beginPath(); ctx.moveTo(K.lamp.x - 104, K.lamp.y + 20); ctx.lineTo(K.lamp.x + 104, K.lamp.y + 20); ctx.lineTo(K.lamp.x + 480, K.table.y); ctx.lineTo(K.lamp.x - 480, K.table.y); ctx.closePath(); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
  // you (c16: at the table, opposite her, from behind: left of the lamp)
  const yo = o.you;
  if (yo && (yo.a ?? 1) > 0) out.you = E.du(ctx, yo.x ?? 760, 1130, 650, { view: 'back', back: .4, look: .05, light: 1, hood: false, a: yo.a ?? 1, armR: [.5, 1.1], armL: [-.2, .9] });
  // her, behind the table (right of centre), facing left toward the phone; she reaches for it and lifts it to her ear
  const mo = o.mom, ph = o.phone || {}, lift = clamp(ph.lift ?? 0);
  const M = K.mom, mx = mo?.x ?? M.x;
  let phx = K.phone.x, phy = K.phone.y, rot = 0, flat = 1;
  if (mo !== false && (mo?.a ?? 1) > 0) {
    const reach = clamp(ph.reach ?? lift * 3), e = E.sineIO(lift), ear = [-.005, -.85], hand0 = [(K.phone.x - mx) / M.h, (K.phone.y - M.y) / M.h], rest = [-.16, -.36];
    const tg = lift > 0 ? [lerp(hand0[0], ear[0] - .03, e), lerp(hand0[1], ear[1] + .02, e) - .05 * Math.sin(Math.PI * e)] : [lerp(rest[0], hand0[0], E.sineIO(reach)), lerp(rest[1], hand0[1], E.sineIO(reach))];
    const arm = F.reachArm([.098, -.74], [-tg[0], tg[1]], .17, .155, 1);
    out.mom = F.mom(ctx, mx, M.y, M.h, { dir: -1, look: mo?.look ?? 0, lean: mo?.lean ?? .06, light: -1, back: .3, armR: arm, armL: [.15, .25], a: mo?.a ?? 1 });
    if (lift > 0 || reach >= 1) { phx = mx + tg[0] * M.h + 6; phy = M.y + tg[1] * M.h - 10 * e; rot = lerp(0, -.35, e); flat = 1 - e; }
  }
  // the table (in front of her: top surface seen a little from above, front edge, two legs) and the phone
  const TB = K.table, fx0 = TB.x - TB.w / 2 + 600, fx1 = fx0 + TB.w, ty0 = TB.y, ty1 = TB.y + 96;
  ctx.fillStyle = lin(ctx, 0, ty0, 0, ty1, [[0, mixHex(WOOD.lit, LAMP.body, .22)], [1, mixHex(WOOD.body, LAMP.body, .16)]]);
  ctx.beginPath(); ctx.moveTo(fx0 + 70, ty0); ctx.lineTo(fx1 - 70, ty0); ctx.lineTo(fx1, ty1); ctx.lineTo(fx0, ty1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rad(ctx, K.lamp.x, ty0 + 40, 520, [[0, rgba(LAMP.core, .22 * la)], [1, rgba(LAMP.core, 0)]]); ctx.fill();
  ctx.fillStyle = mixHex(WOOD.body, LAMP.deep, .5); ctx.fillRect(fx0, ty1, TB.w, 30);
  ctx.fillStyle = mixHex(WOOD.shade, LAMP.deep, .3); for (const lx of [fx0 + 40, fx1 - 80]) ctx.fillRect(lx, ty1 + 30, 40, H - ty1);
  const pr = F.phone(ctx, t, phx, phy - (flat > .5 ? 4 : 0), K.phone.h * (lift > 0 ? lerp(1, .78, E.sineIO(lift)) : 1), { screen: ph.screen ?? 'dark', ring: ph.ring ?? 0, flat: flat * .9, rot, light: ph.light ?? 1, timer: ph.timer, waveCol: ph.waveCol, tremble: ph.tremble, seal: ph.seal, a: ph.a ?? 1 });
  out.phone = { x: phx, y: phy, h: K.phone.h, ...(pr || {}) };
  if (o.extra) o.extra(ctx, out);
  ctx.restore();
  return out;
}

// ================================================================================================================= THE PLATES
// A plate camera = look(X, Y, Z, mag, sx, sy, hz); while it creeps, mag × k and X + TRUCK·(k − 1)/CREEP (world units at that depth).
export const plateCam = (P0, k) => look(P0[0] + tr(k) * P0[2] / F0, P0[1], P0[2], P0[3] * k, P0[4], P0[5], P0[6] ?? HZ);   // P0 = [X, Y, Z, mag, sx, sy, hz]
// the line plates: pole k at the left third, a little below the middle; the wire runs on to the right (toward the bank)
export const LINE_P = {
  1: [WORLD.poles[0].x, herY(WORLD.poles[0].x) + 220, WORLD.poles[0].z, 2.3, 640, 560, 520],
  3: [WORLD.poles[2].x, herY(WORLD.poles[2].x) + 220, WORLD.poles[2].z, 2.3, 640, 560, 520],
  5: [WORLD.poles[4].x, herY(WORLD.poles[4].x) + 220, WORLD.poles[4].z, 2.0, 560, 560, 520],
};
export const LINE_PHRASE = { 1: 'The first step is the voice', 3: 'The third step is a face', 5: 'Then one step is left' };
export const lineCam = (k, kk = 1) => plateCam(LINE_P[k], kk);
// the world state on plate k: tags < k lit gold, tag k high, the source dim, the wire lit gold up to pole k (from her house)
export const lineState = (k) => ({ tags: { lit: (j) => (j < k ? 1 : 0), hi: k }, source: { a: .55 }, bank: { win: .8, glow: k === 5 ? .35 : 0 }, wire: { gold: 1, u: k }, house: { win: 1 } });
export function plateLine(ctx, t, T, k) { return lineWorld(ctx, lineCam(k, creep(t, T, LINE_PHRASE[k])), t, lineState(k)); }

// THE THUMBNAIL CAMERA (frame 0 of the film): her house far left, the line down to the bank, you on the near hill right with the phone
export const THUMB_CAM = E.cam3({ x: 623, y: -300, z: 1500, f: F0, hz: 600 });

// ================================================================================================================= THE END SCREEN (last 15 s)
// Her house on its hill, seen from the valley, the kitchen window warm; inside the window, small, two figures at the table (her and you:
// the agreements made). The line runs down out of frame right; all five tags lit gold; the moon low right. No text, no QR.
// Free areas for the YouTube tiles: left and right in the sky (END_TILES), the subscribe circle between them.
export const END_P = [WORLD.house.x + 120, herY(WORLD.house.x) + 150, WORLD.house.z, 2.4, 960, 760, 560];
export const END_CAM = plateCam(END_P, 1);
export const END_TILES = { left: { x: 100, y: 120, w: 720, h: 405 }, right: { x: 1100, y: 120, w: 720, h: 405 }, subscribe: { x: 960, y: 380, r: 90 } };
export const endState = () => ({ tags: { lit: () => 1 }, source: { a: 0 }, bank: { win: .7, glow: .3 }, wire: { gold: .8, u: 7 }, house: { win: 1.15 }, you: false, moon: { x: 960, y: 150, a: .8 }, house: { win: 1.15, two: 1 } });
