// Film 78 · the NIGHT STAGE every graphic stands on, the 2D camera, the Leitbild scene (thumbnail C, 4 anchors only), the seam plates
// between the builder groups and the end screen (owned by the lead; builders import, never edit: wishes go in the report).
//
// NOT one world (Jakob 24.11.): every sentence gets its own graphic (docs/shots.md). The stage is only the common ground: indigo night,
// sparse stars, a far city line low on the horizon, a breathing horizon glow. It never cuts and never stands still.
//
//   S.view(ctx, cam)            cam = { x, y, s }: design point (x, y) at the screen centre, magnification s (1 = design px = screen px)
//   S.camPath2(t, K)            K = [[t, { x, y, s }], …] keys on PHRASE times (monotone cubic in x, y and log s: glides, never overshoots)
//   S.drift2(cam, t, amt)       a living hold (tiny drift + breathing zoom)
//   S.stage(ctx, t, cam, o)     the night (screen space, parallax from cam): o { dawn 0..1 (the solution part warms), city 0..1, stars }
//   S.leitbild(ctx, t, st)      THE TOWER + the man + the ground (design space, call after S.view): st { tower {…F.tower opts}, man { x,
//                               walk (phase), dir, look, shadow, a } | false, city 0..1 }. Returns the tower geometry. ANCHORS A1–A4 ONLY.
//   S.plateHook / S.plateRecord the seam plates (draw them for ± SEAM_HALF around the seam phrase, see docs/MOTION.md §8)
//   S.endScreen, S.END_TILES    the last 15 s
//
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its row out of it.
// Plates creep (CREEP 4 %/s push from T0 − .5) and truck right (TRUCK 30 px/s); the receiving side continues both.
//   Lead → B1  at T.G('So what was in those pages') (c01 → c02): plateHook   THE 52 PAGES left, the gold LINE centre, the man at the lectern
//              in his spotlight right (sound rings). B1 (1.01) pushes into the stack: the top page lifts.
//   B1 → B2    at T.G('That is why this channel exists') (c06 → c07): plateRecord   HIS LIFE LINE: markers 1 2 gold (HELD), 3 4 cream
//              (OPEN), the box 5–20 YEARS over 4, the gold knot (the one condition), you at the right end, dawn low right. B2 (M.01) brings
//              the subscribe moment around you.
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, prng } = E;
const { GOLD, CREAM } = F;

export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 30;
export const trk = (k) => TRUCK * (k - 1) / CREEP;

// ------------------------------------------------------------------------------------------------ the 2D camera
export const HOME = () => ({ x: W / 2, y: H / 2, s: 1 });
export function view(ctx, c) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(W / 2, H / 2); ctx.scale(c.s, c.s); ctx.translate(-c.x, -c.y); }
// design → screen and back (for carriers that leave the camera space, e.g. a clip plate growing out of a screen)
export const toScreen = (c, x, y) => [W / 2 + (x - c.x) * c.s, H / 2 + (y - c.y) * c.s];
export const rectToScreen = (c, R) => { const [x, y] = toScreen(c, R.x, R.y); return { x, y, w: R.w * c.s, h: R.h * c.s }; };
export function camPath2(t, K) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(c.s)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return { x: out[0], y: out[1], s: Math.exp(out[2]) };
}
export const drift2 = (c, t, amt = 1, seed = 0) => ({ x: c.x + E.drift(t, 7 * amt, seed) / c.s, y: c.y + E.drift(t, 4 * amt, seed + 2) / c.s, s: c.s * (1 + .006 * amt * Math.sin(t * .23 + seed)) });

// ------------------------------------------------------------------------------------------------ the night stage
// far city line (seeded, cached): low buildings with a few lit windows, drawn in screen space with parallax
const CITY = (() => { const r = prng(78), out = []; let x = -900; while (x < W + 900) { const w = 40 + r() * 110, h = 24 + r() * (r() < .15 ? 120 : 60), wins = []; for (let i = 0; i < 6; i++) if (r() < .45) wins.push([r(), r(), r()]); out.push({ x, w, h, wins }); x += w + r() * 10; } return out; })();
export function stage(ctx, t, cam = HOME(), o = {}) {
  const dw = clamp(o.dawn ?? 0), px = (cam.x - W / 2), py = (cam.y - H / 2), ks = Math.log(cam.s);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, '#141a46', dw * .5)], [.6, mixHex(mixHex(P.night1, P.ind0, .5), '#2a2a5e', dw * .6)], [1, mixHex(mixHex(P.ind0, P.blue0, .25), '#6b4a5a', dw * .7)]]);
  ctx.fillRect(0, 0, W, H);
  // stars (slowest layer)
  const sx = -px * .05, sy = -py * .05;
  if ((o.stars ?? 1) > 0) E.stars(ctx, 78, 170, t, [-200 + sx, -150 + sy, W + 400, H * .78], (o.stars ?? 1) * (1 - dw * .6));
  // the horizon glow (breathing), warmer at dawn
  const gx = W * .62 - px * .3, gy = H * 1.02 - py * .3 + ks * 40;
  halo(ctx, gx, gy, W * (.7 + .03 * Math.sin(t * .3)), .2 + .25 * dw, mixHex(P.blue0, GOLD.halo, .15 + .7 * dw), mixHex(P.blue1, GOLD.hot, dw));
  // the far city line (parallax .2, a touch of the camera's zoom)
  const ca = clamp(o.city ?? 1);
  if (ca > 0) {
    const k = 1 + (cam.s - 1) * .12, cx = -px * .2, base = H - 92 - py * .2 + Math.min(60, ks * 30);
    ctx.save(); ctx.translate(W / 2, base); ctx.scale(k, k); ctx.translate(-W / 2 + cx, 0);
    ctx.fillStyle = rgba(mixHex(P.night1, P.ind1, .5), .9 * ca);
    for (const b of CITY) ctx.fillRect(b.x, -b.h, b.w, b.h + 300);
    for (const b of CITY) for (const [u, v, q] of b.wins) { ctx.fillStyle = rgba(mixHex(P.halo2, GOLD.hot, q), ca * (.35 + .25 * Math.sin(t * .4 + q * 30))); ctx.fillRect(b.x + u * (b.w - 6), -b.h + 6 + v * (b.h - 12), 4, 5); }
    ctx.restore();
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the Leitbild scene (thumbnail C)
// design space (call after S.view): ground line GY, THE TOWER at TOWER.x, the man (Ilya, plain silhouette) on the ground.
export const GY = 860;
export const TOWER = { x: 1420, w: 150, h: 700 };
export const MAN = { x: 1250, h: 210 };
export function leitbild(ctx, t, st = {}) {
  const tw = { ...TOWER, ...(st.towerAt ?? {}) };
  // the ground: a dark band with a faint gold line (the light on it) and the tower's pool of light
  ctx.fillStyle = lin(ctx, 0, GY, 0, GY + 400, [[0, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]); ctx.fillRect(-4000, GY, 10000, 1400);
  const tg = clamp(st.tower?.glow ?? 1) * (1 - clamp(st.tower?.dim ?? 0) * .7);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = E.rad(ctx, tw.x, GY, tw.w * 6, [[0, rgba(GOLD.halo, .22 * tg)], [1, rgba(GOLD.halo, 0)]]);
  ctx.beginPath(); ctx.ellipse(tw.x, GY, tw.w * 6, tw.w * .9, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  F.goldSpan(ctx, [[-4000, GY], [6000, GY]], 0, 1, { w: 1, spark: false, a: .25 + .35 * tg });
  const g = st.tower === false ? null : F.tower(ctx, t, tw.x, GY, tw.w, tw.h, st.tower ?? {});
  if (st.man !== false) {
    const m = st.man ?? {};
    F.ilya(ctx, t, m.x ?? MAN.x, m.y ?? GY, m.h ?? MAN.h, { dir: m.dir ?? 1, look: m.look ?? .3, walk: m.walk, view: m.view, armR: m.armR, armL: m.armL, shadow: m.shadow ?? 0, lightX: tw.x, a: m.a ?? 1 });
  }
  if (st.extra) st.extra(ctx, g);
  return g;
}

// ------------------------------------------------------------------------------------------------ the seam plates
// plateHook: THE 52 PAGES left, the gold LINE centre, the man at the lectern right (screen layout at cam HOME, creeping)
export const HOOK = { pages: { x: 230, y: 180, w: 400, h: 500 }, line: { x: 960, y0: 120, y1: 860 }, lectern: { x: 1420, y: 820, h: 300 } };
export function hookPicture(ctx, t, o = {}) {
  const P0 = HOOK;
  F.pages(ctx, t, P0.pages, { n: 52, by: 1, profile: 1, lines: 1, count: o.count ?? 1, dark: o.pagesDark ?? 0 });
  F.divider(ctx, t, P0.line.x, P0.line.y0, P0.line.y1, o.line ?? 1, { glow: 1 });
  F.lectern(ctx, t, P0.lectern.x, P0.lectern.y, P0.lectern.h, { spot: o.spot ?? 1, rings: o.rings ?? .8, rise: o.lecternRise ?? 1 });
  ctx.fillStyle = rgba(GOLD.line, .18); ctx.fillRect(P0.lectern.x - 260, P0.lectern.y, 520, 3);   // the low stage under the lectern
}
export function plateHook(ctx, t, T) {
  const k = creep(t, T, 'So what was in those pages'), c = { x: W / 2 + trk(k) * .5, y: H / 2, s: k };
  stage(ctx, t, c); view(ctx, c); hookPicture(ctx, t);
}
// plateRecord: HIS LIFE LINE with the four markers (no ladder), the box 5–20 YEARS on 4, the knot, you at the right end, dawn
export const RECORD = { x0: 240, x1: 1500, y: 600, years: [[.17, '2012'], [.37, '2014'], [.66, '2024'], [.86, '2025']] };
export const RECORD_MARKERS = (o = {}) => [
  { f: .17, n: 1, state: 'held', fill: 1 }, { f: .37, n: 2, state: 'held', fill: 1 },
  { f: .66, n: 3, state: 'open', fill: 1 }, { f: .86, n: 4, state: 'open', fill: 1, box: '5–20 YEARS', boxU: 1, ...o },
];
export function recordPicture(ctx, t, o = {}) {
  F.lifeLine(ctx, t, RECORD.x0, RECORD.x1, RECORD.y, { u: 1, years: RECORD.years, markers: RECORD_MARKERS(o.m4), knot: o.knot ?? 1, knotF: .95, you: o.you ?? 1, dawn: o.dawn ?? 1 });
}
export function plateRecord(ctx, t, T) {
  const k = creep(t, T, 'That is why this channel exists'), c = { x: W / 2 + trk(k) * .5, y: H / 2, s: k };
  stage(ctx, t, c, { dawn: .35 }); view(ctx, c); recordPicture(ctx, t);
}

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// Leitbild anchor A4: the tower far off (upper half), the man small on the ground line walking very slowly away from it, calm.
// The lower half stays free: END_TILES left (BEST FOR VIEWER) and right (LATEST UPLOAD), the subscribe circle centre.
export const END_TILES = { left: { x: 80, y: 600, w: 640, h: 360 }, right: { x: 1200, y: 600, w: 640, h: 360 }, sub: { x: 960, y: 900, r: 80 } };
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, d = Math.max(0, t - t0), c = { x: 1040 + d * 1.2, y: 820, s: .5 * (1 + .004 * d) };
  stage(ctx, t, c, { dawn: .45 });
  view(ctx, c);
  leitbild(ctx, t, { tower: { glow: .9 }, man: { x: 1060 - d * 4, dir: -1, walk: d * 2.2, h: 210, shadow: 120 } });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
