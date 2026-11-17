// Film 31 · THE NIGHT FOUNDRY (the one world of the film) + cameras and seam helpers (owned by the lead; builders import, never edit —
// wishes go in the report). Seam plates between builder groups are added in phase 2 together with docs/shots.md (pattern: film 59,
// docs/ref-59/f59_world.mjs: a plate is the EXACT picture at a group boundary; both sides draw it for .5 s; CREEP 4 %/s, TRUCK 30 px/s).
//
// THE WORLD (design px per depth card; cam3() = home = the thumbnail frame):
//   sky Z 40000 (night gradient, stars) · far Z 9000: low foundry halls and chimneys of other labs, a few forge lights ·
//   THE NEXT MACHINE Z 6000 at (1250, 370), r 330, held in THE GANTRY (two towers, a crossbeam, hanging cables): a ring being assembled,
//     its core = the ONE hero light. The builders circle it and weld the next plate. ·
//   THE HALL Z 3800: two cranes, the floor rails with carts that carry plates to the gantry, and at the left on a plinth THE MACHINE YOU
//     USE TODAY (OLD, tone 'cool', smaller, finished). A forge thread runs from it to the builders: it builds its successor. ·
//   THE WORKSHOP F0: the floor (top at y 975), your bench at the left with YOUR LAMP (warm; it goes off in the hook), you at (560, 972)
//     h 185, and THE LADDER (foot (800, 975), h 700, five rungs) that leans toward the machine. · foreground Z 1150: nothing at home.
// foundry(ctx, c, t, st) st (all optional):
//   machine { build 0..1, glow, think, a } · builders { n, work, a } (false = none) · old { a, glow, thread 0..1 } · carts 0..1 (traffic on the
//   rails) · hall 0..1 (how lit the hall windows are) · lamp 0..1 (your lamp: 1 on, 0 off) · you { x, y, h, o } | false ·
//   ladder { …F.ladder options } | false · extra(ctx, hand) (F0 card) · back(ctx) (hall card) · front(ctx) (machine card) · fg (Z 1150 fn)
import * as E from './f10_editorial.mjs';
import * as F from './f31_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng } = E;
const { FORGE, COOL, LAMP, F0 } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 30;
export const trk = (k) => TRUCK * (k - 1) / CREEP;

export const Z_SKY = 40000, Z_FAR = 9000, Z_MACH = 6000, Z_HALL = 3800, Z_FG = 1150, FLOOR = 975;
export const MACH = { x: 1250, y: 370, r: 330 };
export const GANTRY = { x0: 1250 - 520, x1: 1250 + 520, top: -40, w: 64 };
export const OLD = { x: 300, y: 560, r: 118, plinth: 700 };
export const YOU = { x: 560, y: 972, h: 185 };
export const BENCH = { x: 150, w: 260, y: 975, top: 870 };
export const LAMPPOS = { x: 330, y: 870 };
export const LADDERPOS = { x: 800, y: 975, h: 700, w: 120 };

// ------------------------------------------------------------------------------------------------ silhouettes (seeded, cached)
const CACHE = new Map();
function halls(seed, x0, x1, base, hMin, hMax) {
  const key = [seed, x0, x1].join(':'); if (CACHE.has(key)) return CACHE.get(key);
  const r = prng(seed), out = []; let x = x0;
  while (x < x1) { const w = 160 + r() * 340, h = hMin + r() * (hMax - hMin); out.push({ x, w, h, base, roof: r() < .5 ? 'saw' : 'flat', chim: r() < .45 ? r() : -1, lit: r() }); x += w + r() * 60; }
  CACHE.set(key, out); return out;
}
function drawHalls(ctx, t, list, col, o = {}) {
  for (const b of list) {
    ctx.fillStyle = col; ctx.fillRect(b.x, b.base - b.h, b.w, b.h + 600);
    if (b.roof === 'saw') { const n = Math.max(2, Math.round(b.w / 70)); ctx.beginPath(); for (let i = 0; i < n; i++) { const a = b.x + i * b.w / n; ctx.moveTo(a, b.base - b.h); ctx.lineTo(a + b.w / n, b.base - b.h - 34); ctx.lineTo(a + b.w / n, b.base - b.h); } ctx.fill(); }
    if (b.chim >= 0) { const cx = b.x + b.w * (.2 + .6 * b.chim); ctx.fillRect(cx, b.base - b.h - 150, 22, 150); }
    if (b.lit < (o.lit ?? .5)) {   // a band of forge-lit windows
      const fl = .7 + .3 * Math.sin(t * .4 + b.lit * 30);
      ctx.fillStyle = rgba(FORGE.mid, (o.a ?? .35) * fl); ctx.fillRect(b.x + b.w * .12, b.base - b.h * .55, b.w * .76, 8);
    }
  }
}

// ------------------------------------------------------------------------------------------------ the world
export function foundry(ctx, c, t, st = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, mixHex(P.night1, P.ind0, .5)], [1, P.ind1]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, c, Z_SKY, () => { E.stars(ctx, 31, 150, t, [-2400, -900, 9000, 1900], .8); });
  // far: other foundries on the horizon
  E.card(ctx, c, Z_FAR, () => { drawHalls(ctx, t, halls(9, -5000, 9000, 1080, 50, 180), mixHex(P.ind0, P.blue0, .2), { lit: .35, a: .25 }); });
  // THE NEXT MACHINE in THE GANTRY
  let mc = null;
  E.card(ctx, c, Z_MACH, () => {
    const g = GANTRY, tc = mixHex(P.night1, P.ind1, .55), ms = st.machine ?? {};
    halo(ctx, MACH.x, MACH.y + 80, MACH.r * 3.4, .16 * (ms.glow ?? 1), FORGE.halo, FORGE.hot);   // the light the core throws into the night
    ctx.fillStyle = tc;
    for (const x of [g.x0, g.x1 - g.w]) {   // the two towers (lattice: a solid post + cross braces)
      ctx.fillRect(x, g.top, g.w, 1400);
      ctx.strokeStyle = mixHex(P.ind2, P.blue2, .35); ctx.lineWidth = 6; ctx.beginPath();
      for (let y = g.top + 40; y < 1200; y += 120) { ctx.moveTo(x + 8, y); ctx.lineTo(x + g.w - 8, y + 110); ctx.moveTo(x + g.w - 8, y); ctx.lineTo(x + 8, y + 110); }
      ctx.stroke();
      ctx.fillStyle = rgba(FORGE.line, .18); ctx.fillRect(x + (x < MACH.x ? g.w - 6 : 0), g.top, 6, 1400); ctx.fillStyle = tc;   // the inner edge catches the core's light
    }
    ctx.fillRect(g.x0 - 60, g.top - 50, g.x1 - g.x0 + 120, 56);   // the crossbeam
    // cables from the beam to the ring (they tremble a little)
    ctx.strokeStyle = mixHex(P.ind2, P.blue2, .5); ctx.lineWidth = 4;
    for (const dx of [-.62, -.25, .25, .62]) { const ax = MACH.x + dx * MACH.r * 1.2, sw = 2 * Math.sin(t * .7 + dx * 5); ctx.beginPath(); ctx.moveTo(ax, g.top); ctx.quadraticCurveTo(ax + sw, (g.top + MACH.y) / 2, MACH.x + dx * MACH.r * .85, MACH.y - Math.sqrt(1 - dx * dx * .7) * MACH.r * .92); ctx.stroke(); }
    // the cradle under the ring
    ctx.fillStyle = tc; ctx.beginPath(); ctx.moveTo(MACH.x - MACH.r * .7, MACH.y + MACH.r * 1.25); ctx.lineTo(MACH.x - MACH.r * .35, MACH.y + MACH.r * .9); ctx.lineTo(MACH.x + MACH.r * .35, MACH.y + MACH.r * .9); ctx.lineTo(MACH.x + MACH.r * .7, MACH.y + MACH.r * 1.25); ctx.lineTo(MACH.x + MACH.r * .7, 1400); ctx.lineTo(MACH.x - MACH.r * .7, 1400); ctx.closePath(); ctx.fill();
    mc = F.machine(ctx, t, MACH.x, MACH.y, MACH.r, { build: ms.build ?? .72, glow: ms.glow, think: ms.think, a: ms.a });
    if (st.builders !== false) F.builders(ctx, t, MACH.x, MACH.y, MACH.r, { n: 8, build: ms.build ?? .72, ...(st.builders ?? {}) });
    if (st.front) st.front(ctx, mc);
  });
  // THE HALL: cranes, rails, carts, THE MACHINE YOU USE TODAY
  E.card(ctx, c, Z_HALL, () => {
    const hc = mixHex(P.night1, P.ind1, .4), hl = st.hall ?? .5;
    drawHalls(ctx, t, halls(23, -3600, 120, 1000, 220, 520), hc, { lit: .3 + .5 * hl, a: .3 });
    drawHalls(ctx, t, halls(41, 2050, 7000, 1000, 180, 420), hc, { lit: .3 + .5 * hl, a: .3 });
    // two cranes (a mast, a jib, a hook line)
    for (const [mx, jl, dir] of [[-260, 720, 1], [2150, 640, -1]]) {
      ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(mx, 60, 26, 1000); ctx.fillRect(mx - (dir < 0 ? jl : 60), 52, jl + 60, 20);
      ctx.strokeStyle = mixHex(P.ind2, P.blue2, .3); ctx.lineWidth = 2; const hx = mx + dir * jl * .82; ctx.beginPath(); ctx.moveTo(hx, 72); ctx.lineTo(hx + 3 * Math.sin(t * .5 + mx), 430); ctx.stroke();
      ctx.fillStyle = rgba(FORGE.hot, .5 + .3 * Math.sin(t * 1.3 + mx)); ctx.beginPath(); ctx.arc(mx + 13, 50, 5, 0, TAU); ctx.fill();   // the warning light on top
    }
    // the floor and the rails toward the gantry
    ctx.fillStyle = mixHex(P.night0, P.ind0, .5); ctx.fillRect(-4000, 1000, 12000, 800);
    ctx.fillStyle = rgba(P.cream, .1); ctx.fillRect(-4000, 1012, 12000, 3); ctx.fillRect(-4000, 1044, 12000, 3);
    // carts with plates glide right (a steady loop; carts 0..1 = how many)
    const nc = Math.round(5 * (st.carts ?? .6));
    for (let k = 0; k < nc; k++) {
      const x = ((t * 38 + k * 520) % 2600) - 700, y = 1000;
      ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.fillRect(x, y - 26, 120, 26);
      ctx.fillStyle = mixHex(P.ind2, P.blue2, .55); ctx.beginPath(); ctx.arc(x + 60, y - 26, 52, Math.PI * 1.08, Math.PI * 1.92); ctx.arc(x + 60, y - 26, 30, Math.PI * 1.92, Math.PI * 1.08, true); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(FORGE.line, .45); ctx.fillRect(x + 22, y - 54, 76, 2);
      ctx.fillStyle = rgba(FORGE.hot, .7); ctx.beginPath(); ctx.arc(x + 112, y - 13, 3, 0, TAU); ctx.fill();
    }
    // THE MACHINE YOU USE TODAY on its plinth (cool, finished) + the thread to the builders
    const od = st.old ?? {};
    ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(OLD.x - OLD.r * .9, OLD.y + OLD.r * 1.05, OLD.r * 1.8, 1000);
    ctx.fillStyle = rgba(P.cream, .08); ctx.fillRect(OLD.x - OLD.r * .9, OLD.y + OLD.r * 1.05, OLD.r * 1.8, 4);
    F.machine(ctx, t, OLD.x, OLD.y, OLD.r, { tone: 'cool', build: 1, glow: od.glow ?? .6, a: od.a ?? 1 });
    if (st.back) st.back(ctx);
  });
  // the thread from the old machine to the new one (screen space between two projections, so it holds under any camera)
  const th = st.old?.thread ?? .8;
  if (th > 0) {
    const p0 = E.project(c, Z_HALL, OLD.x + OLD.r * .5, OLD.y - OLD.r * .2), p1 = E.project(c, Z_MACH, MACH.x - MACH.r * 1.05, MACH.y + MACH.r * .15);
    if (p0 && p1) {
      const mx = (p0[0] + p1[0]) / 2, my = Math.min(p0[1], p1[1]) - 120 * p0[2], pts = [];
      for (let i = 0; i <= 20; i++) { const s = i / 20; pts.push([(1 - s) ** 2 * p0[0] + 2 * s * (1 - s) * mx + s * s * p1[0], (1 - s) ** 2 * p0[1] + 2 * s * (1 - s) * my + s * s * p1[1]]); }
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = .55 * th;
      F.goldSpan(ctx, pts, 0, clamp(th * 1.2), { w: 1.4 * Math.sqrt(p0[2]), spark: false });
      for (let k = 0; k < 4; k++) { const q = (t * .18 + k / 4) % 1, i = Math.floor(q * 20), f = q * 20 - i, a = pts[i], b = pts[Math.min(20, i + 1)];   // pulses run toward the new machine
        halo(ctx, lerp(a[0], b[0], f), lerp(a[1], b[1], f), 14 * p0[2], .8, FORGE.halo, FORGE.core); }
      ctx.restore();
    }
  }
  // THE WORKSHOP (F0): the floor, your bench and lamp, the ladder, you
  let hand = null, lad = null;
  E.card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, FLOOR, 0, FLOOR + 160, [[0, mixHex(P.ind2, P.blue1, .22)], [.06, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]);
    ctx.fillRect(-6000, FLOOR, 16000, 12000);
    ctx.fillStyle = rgba(FORGE.hot, .08); ctx.fillRect(700, FLOOR, 1400, 3);   // the floor's edge catches the forge light
    // the bench + the lamp
    const lp = clamp(st.lamp ?? 1), b = BENCH;
    if (lp > 0) { halo(ctx, LAMPPOS.x - 20, b.top + 10, 230, .3 * lp, LAMP.body, P.coat); ctx.fillStyle = lin(ctx, 0, b.top, 0, FLOOR, [[0, rgba(P.coat, .16 * lp)], [1, rgba(P.coat, 0)]]); ctx.beginPath(); ctx.moveTo(LAMPPOS.x - 50, b.top - 52); ctx.lineTo(LAMPPOS.x - 10, b.top - 52); ctx.lineTo(b.x + b.w * .9, b.top); ctx.lineTo(b.x - 10, b.top); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = mixHex(P.night1, P.ind1, .55); ctx.fillRect(b.x, b.top, b.w, 14); ctx.fillRect(b.x + 14, b.top + 14, 12, FLOOR - b.top - 14); ctx.fillRect(b.x + b.w - 26, b.top + 14, 12, FLOOR - b.top - 14);
    ctx.fillStyle = rgba(P.cream, .1 + .25 * lp); ctx.fillRect(b.x, b.top, b.w, 3);
    ctx.fillStyle = mixHex(P.ind2, P.blue2, .3); ctx.fillRect(b.x + 40, b.top - 26, 70, 26); ctx.fillStyle = rgba(P.cream, .1 + .4 * lp); ctx.fillRect(b.x + 46, b.top - 21, 58, 3);   // a notebook
    // the desk lamp (arm + shade); the bulb is the warm light that goes off
    ctx.strokeStyle = mixHex(P.night1, P.ind2, .8); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(LAMPPOS.x + 30, b.top); ctx.lineTo(LAMPPOS.x + 50, b.top - 70); ctx.lineTo(LAMPPOS.x - 10, b.top - 100); ctx.stroke();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .8); ctx.beginPath(); ctx.moveTo(LAMPPOS.x - 52, b.top - 54); ctx.lineTo(LAMPPOS.x - 26, b.top - 112); ctx.lineTo(LAMPPOS.x + 4, b.top - 94); ctx.lineTo(LAMPPOS.x - 6, b.top - 50); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.cream, .85 * lp); ctx.beginPath(); ctx.ellipse(LAMPPOS.x - 29, b.top - 52, 24, 5, -.08, 0, TAU); ctx.fill();
    if (lp > 0) halo(ctx, LAMPPOS.x - 29, b.top - 48, 60, .8 * lp, P.coat, P.core0);
    // THE LADDER
    if (st.ladder !== false) {
      const L = st.ladder ?? {};
      lad = F.ladder(ctx, t, L.x ?? LADDERPOS.x, L.y ?? LADDERPOS.y, L.h ?? LADDERPOS.h, { w: LADDERPOS.w, ...L });
    }
    // you
    if (st.you !== false) { const y = st.you ?? {}; hand = E.du(ctx, y.x ?? YOU.x, y.y ?? YOU.y, y.h ?? YOU.h, { light: .8, back: .4, dir: 1, ...(y.o ?? {}) }); }
    if (st.extra) st.extra(ctx, hand, lad);
  });
  if (st.fg) E.card(ctx, c, Z_FG, st.fg);
  return { mc, hand, lad };
}
// screen position of the next machine's core / the old machine for camera c ([x, y, r] or null)
export function machineAt(c) { const p = E.project(c, Z_MACH, MACH.x, MACH.y); return p ? [p[0], p[1], MACH.r * p[2]] : null; }
export function oldAt(c) { const p = E.project(c, Z_HALL, OLD.x, OLD.y); return p ? [p[0], p[1], OLD.r * p[2]] : null; }

// ------------------------------------------------------------------------------------------------ cameras
export const HOME = E.cam3();
export const WIDE_CAM = (k = 1, tr = 0) => E.aim(Z_HALL, 960 + tr, 430, .7 * k);                         // the whole foundry, you tiny
export const MACH_CAM = (k = 1, tr = 0) => E.aim(Z_MACH, MACH.x + tr, MACH.y + 40, 1.25 * k);              // the machine big (wow frames)
export const LADDER_CAM = (k = 1, tr = 0) => E.aim(F0, LADDERPOS.x + 360 + tr, LADDERPOS.y - LADDERPOS.h * .5, 1.05 * k);   // the ladder full height + labels
export const BENCH_CAM = (k = 1, tr = 0) => E.aim(F0, BENCH.x + 260 + tr, BENCH.top - 40, 2.0 * k);         // your lamp (the light goes off)
export const OLD_CAM = (k = 1, tr = 0) => E.aim(Z_HALL, OLD.x + 380 + tr, OLD.y, 1.5 * k);                  // the machine you use + the thread

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// The next machine big and calm top centre; you small on the floor at the left; the dark floor carries the two YouTube tiles and the
// subscribe circle (clean, low-detail background). No text. The picture keeps breathing.
export const END_CAM = E.aim(Z_MACH, MACH.x, MACH.y + 30, .85, 960, 300);
export const END_TILES = { left: { x: 80, y: 620, w: 640, h: 360 }, right: { x: 1200, y: 620, w: 640, h: 360 }, sub: { x: 960, y: 930, r: 80 } };
