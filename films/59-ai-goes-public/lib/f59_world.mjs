// Film 59 · THE CITY UNDER THE CRYSTAL (the one world of the film) + the seam plates between the builder groups (owned by the lead;
// builders import, never edit — wishes go in the report).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it.
// Plates keep a slow push (CREEP 4 %/s from T0 − .5) and a slow truck right (TRUCK 30 px/s); the receiving side continues both.
// Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet59.mjs <dir>
//
//   Lead → B1 at T.G('The seller is Anthropic') (c01 → c02): plateWindow   THE ROOM SEEN THROUGH ITS WINDOW. The tower's lit window
//            fills the middle of the frame: the long table, 7 founders + 4 trustees (silhouettes), the wheel of light behind its glass on
//            the back wall. Camera WIN_CAM. B1 (1.01) pulls back out of the window to the city and the crystal.
//   B1 → B2  at T.G('Many doubt it') (c05 → c06): plateCrystal   THE CRYSTAL WITH ITS PRICE TAG. The crystal big in the night sky (right of
//            centre), a paper tag "$ ?" hangs from its lowest point on a gold thread; the city low; the board top left (STEP 1; B2's
//            first frame lights STEP 2 by itself). Camera CRY_CAM.
//   B2 → B3  at T.G('Reports say there are') (c08 → c09): plateSort   KNOWN | FORECAST. Over the veiled city two trays: KNOWN (left,
//            gold edge) holds the two KNOWN cards (REVENUE · NET LOSS), FORECAST (right, cool edge) holds the C3 card "1–2 YEARS · THE
//            SELLER, ON STAGE" above "WITHIN A FEW YEARS · THE DOCUMENT". The board top left (STEP 3). Camera SORT_CAM (the crystal high).
//
// THE WORLD (design px per depth card; cam3() = home = thumbnail A):
//   sky Z 40000 (night gradient, stars) · far skyline Z 9000 (low, few lit windows) · THE CRYSTAL Z 6000 at (1440, 315), r 315 ·
//   THE EXCHANGE + THE BELL Z 5200: facade x 3300–4400 (columns), the bell hangs from a gantry at (3850, 140), height 380 ·
//   the city Z 3800: towers left and right; THE TOWER at x −1000 … −420 with THE WINDOW (WIN, the room) · the rooftop ledge F0: top at
//   y 975 from x 1035 to 14000 (a long parapet), you at (1395, 972) h 185 · foreground Z 1150: nothing at home (clean thumbnail).
// cityWorld(ctx, c, t, st) st (all optional):
//   crystal { a, gap 0..1, crack 0..1, glow } · tag(ctx, r) (drawn on the crystal card; r = crystal box { x, y, r, gap }) ·
//   room { lit, seated, wheel { a, glass }, count { f, tr } } · win { lit 0..1 (the window glow), inside(ctx, w, h) (replaces the room) } ·
//   bell { swing, ring, a } · city 0..1 (how many windows of the city are lit warm: 0 = few, 1 = all — "everybody") ·
//   you { x, y, h, o (E.du options) } | false · shard { x, y, s, rot, a } (on the F0 card) · jar { x, y, s, fill, slice } ·
//   beam 0..1 (a soft light cone from the crystal's gap down to the hand) · extra(ctx) (F0 card) · back(ctx) (city card) · fg (Z 1150 fn)
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f59_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng } = E;
const { GOLD, COOL, LAMP, INK, PAPER, F0 } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 30;
export const trk = (k) => TRUCK * (k - 1) / CREEP;

export const Z_SKY = 40000, Z_FAR = 9000, Z_CRY = 6000, Z_BELL = 5200, Z_CITY = 3800, Z_FG = 1150, FLOOR = 975;
export const CRY = { x: 1440, y: 315, r: 315 };
export const YOU = { x: 1395, y: 972, h: 185 };
export const LEDGE = { x0: 1035, y: 975, x1: 14000 };
export const TOWER = { x0: -1000, x1: -420, top: 230 };
export const WIN = { x: -860, y: 400, w: 300, h: 190 };
export const BELL = { x: 3850, y: 140, s: 380, facade: [3300, 4400] };
export const JAR = { x: 1640, y: 975, s: 120 };

// ------------------------------------------------------------------------------------------------ the skylines (seeded, cached)
const SKY = new Map();
function skyline(seed, x0, x1, base, hMin, hMax, wMin, wMax, litP) {
  const key = [seed, x0, x1].join(':'); if (SKY.has(key)) return SKY.get(key);
  const r = prng(seed), out = []; let x = x0;
  while (x < x1) {
    const w = wMin + r() * (wMax - wMin), h = hMin + r() * (hMax - hMin), wins = [];
    const cols = Math.max(2, Math.floor(w / 26)), rows = Math.max(3, Math.floor(h / 34));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const q = r(); if (q < litP * 3) wins.push([i / cols, j / rows, q < litP ? 1 : 0, r()]); }
    out.push({ x, w, h, base, cols, rows, wins, ant: r() < .2 }); x += w + r() * 18 - 4;
  }
  SKY.set(key, out); return out;
}
function drawSkyline(ctx, t, list, col, winCol, o = {}) {
  ctx.fillStyle = col;
  for (const b of list) { ctx.fillRect(b.x, b.base - b.h, b.w, b.h + 400); if (b.ant) ctx.fillRect(b.x + b.w * .45, b.base - b.h - 40, 4, 40); }
  const city = o.city ?? 0;
  for (const b of list) {
    const cw = b.w / b.cols, rh = b.h / b.rows;
    for (const [u, v, lit, q] of b.wins) {
      const on = lit ? 1 : clamp(city * 1.6 - q * 1.2);   // city 0 → only the few always-lit windows; city 1 → all candidates warm
      if (on <= 0) continue;
      ctx.fillStyle = rgba(winCol, (o.a ?? .8) * on * (.75 + .25 * Math.sin(t * .3 + q * 20)));
      ctx.fillRect(b.x + u * b.w + cw * .3, b.base - b.h + v * b.h + rh * .35, cw * .38, rh * .38);
    }
  }
}

// ------------------------------------------------------------------------------------------------ the world
export function cityWorld(ctx, c, t, st = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, mixHex(P.night1, P.ind0, .5)], [1, P.ind1]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, c, Z_SKY, () => { E.stars(ctx, 59, 160, t, [-2400, -900, 9000, 1900], .85); });
  // the far skyline (low, cool, few windows)
  E.card(ctx, c, Z_FAR, () => {
    drawSkyline(ctx, t, skyline(7, -4000, 9000, 1140, 60, 230, 70, 170, .05), mixHex(P.ind0, P.blue0, .22), LAMP.body, { city: (st.city ?? 0) * .6, a: .45 });
  });
  // the crystal
  let cr = null;
  E.card(ctx, c, Z_CRY, () => {
    const o = st.crystal ?? {};
    cr = F.crystal(ctx, t, CRY.x, CRY.y, CRY.r, o);
    if (cr) cr = { x: CRY.x, y: CRY.y, r: cr.r, gap: cr.gap };
    if (st.tag && cr) st.tag(ctx, cr);
  });
  // the exchange and the bell (right end of the city)
  E.card(ctx, c, Z_BELL, () => {
    const [f0, f1] = BELL.facade, top = 560, b = st.bell ?? {};
    ctx.fillStyle = mixHex(P.night1, P.ind1, .55); ctx.fillRect(f0, top, f1 - f0, 900);
    ctx.beginPath(); ctx.moveTo(f0 - 40, top); ctx.lineTo((f0 + f1) / 2, top - 150); ctx.lineTo(f1 + 40, top); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .25); for (let k = 0; k < 8; k++) ctx.fillRect(f0 + 70 + k * ((f1 - f0 - 140) / 7) - 22, top + 40, 44, 520);
    ctx.fillStyle = rgba(LAMP.body, .35 + .25 * (st.city ?? 0)); for (let k = 0; k < 7; k++) ctx.fillRect(f0 + 100 + k * ((f1 - f0 - 140) / 7), top + 380, 60, 180);
    // the gantry and the bell above the roof
    ctx.fillStyle = mixHex(P.night1, P.blue2, .3); ctx.fillRect(BELL.x - 330, BELL.y - 70, 660, 24); ctx.fillRect(BELL.x - 320, BELL.y - 70, 22, top - BELL.y - 80); ctx.fillRect(BELL.x + 298, BELL.y - 70, 22, top - BELL.y - 80);
    F.bell(ctx, t, BELL.x, BELL.y, BELL.s, { swing: b.swing ?? .015 * Math.sin(t * .5), ring: b.ring ?? 0, a: b.a ?? 1, clapper: b.clapper ?? 0 });
  });
  // the city (mid) and THE TOWER with THE WINDOW
  E.card(ctx, c, Z_CITY, () => {
    const city = st.city ?? 0;
    drawSkyline(ctx, t, skyline(23, -3600, -1040, 1180, 260, 620, 120, 260, .07), mixHex(P.night1, P.ind1, .45), LAMP.body, { city, a: .7 });
    drawSkyline(ctx, t, skyline(41, -380, 9000, 1180, 120, 330, 110, 240, .07), mixHex(P.night1, P.ind1, .45), LAMP.body, { city, a: .7 });
    // THE TOWER
    ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(TOWER.x0, TOWER.top, TOWER.x1 - TOWER.x0, 1400);
    ctx.fillRect((TOWER.x0 + TOWER.x1) / 2 - 6, TOWER.top - 90, 12, 90);
    ctx.fillStyle = rgba(P.cream, .06); ctx.fillRect(TOWER.x1 - 40, TOWER.top, 40, 1400);
    const r = prng(5); for (let j = 0; j < 22; j++) for (let i = 0; i < 9; i++) { const q = r(); const wy = TOWER.top + 40 + j * 46, wx = TOWER.x0 + 30 + i * 60; if (wy > WIN.y - 30 && wy < WIN.y + WIN.h + 10) continue;
      ctx.fillStyle = q < .06 + .5 * city * (q < .7 ? 1 : 0) ? rgba(mixHex(GOLD.body, GOLD.deep, .5), .38) : rgba(P.night0, .45); ctx.fillRect(wx, wy, 26, 22); }
    const wl = st.win?.lit ?? 1;
    halo(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, WIN.w * 1.1, .18 * wl, GOLD.halo, GOLD.hot);
    ctx.save(); ctx.beginPath(); ctx.rect(WIN.x, WIN.y, WIN.w, WIN.h); ctx.clip(); ctx.translate(WIN.x, WIN.y);
    if (st.win?.inside) st.win.inside(ctx, WIN.w, WIN.h); else F.room(ctx, t, WIN.w, WIN.h, { lit: wl, ...(st.room ?? {}) });
    ctx.restore();
    // the window frame: mullions and a reflection
    ctx.strokeStyle = mixHex(P.night1, P.blue2, .4); ctx.lineWidth = 7; ctx.strokeRect(WIN.x, WIN.y, WIN.w, WIN.h);
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(WIN.x, WIN.y + WIN.h * .12); ctx.lineTo(WIN.x + WIN.w, WIN.y + WIN.h * .12); ctx.stroke();
    ctx.fillStyle = rgba(P.cream, .04); ctx.beginPath(); ctx.moveTo(WIN.x + 20, WIN.y); ctx.lineTo(WIN.x + 70, WIN.y); ctx.lineTo(WIN.x + 10, WIN.y + WIN.h); ctx.lineTo(WIN.x - 40, WIN.y + WIN.h); ctx.closePath(); ctx.fill();
    if (st.back) st.back(ctx);
  });
  // the beam: a soft cone of light from the crystal's gap to the hand (screen space between two projections)
  let hand = null;
  // the rooftop (F0): the ledge, the jar, you
  E.card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, LEDGE.y, 0, LEDGE.y + 140, [[0, mixHex(P.ind2, P.blue1, .25)], [.08, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]);
    ctx.beginPath(); ctx.moveTo(LEDGE.x0, LEDGE.y + 6); ctx.lineTo(LEDGE.x0 + 40, LEDGE.y); ctx.lineTo(LEDGE.x1, LEDGE.y); ctx.lineTo(LEDGE.x1, 12000); ctx.lineTo(LEDGE.x0, 12000); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(GOLD.hot, .1 + .1 * (st.beam ?? 0)); ctx.fillRect(LEDGE.x0 + 40, LEDGE.y, 900, 3);   // the lit edge under the crystal
    if (st.jar) F.jar(ctx, t, st.jar.x ?? JAR.x, st.jar.y ?? JAR.y, st.jar.s ?? JAR.s, st.jar);
    if (st.you !== false) {
      const y = st.you ?? {};
      hand = E.du(ctx, y.x ?? YOU.x, y.y ?? YOU.y, y.h ?? YOU.h, { light: 1, back: .35, dir: 1, ...(y.o ?? {}) });
    }
    if (st.shard) F.shard(ctx, t, st.shard.x, st.shard.y, st.shard.s, st.shard);
    if (st.extra) st.extra(ctx, hand);
  });
  if (st.fg) E.card(ctx, c, Z_FG, st.fg);
  return { cr, hand };
}
// screen rect of THE WINDOW for camera c (null if not in front)
export function winRect(c) { const p = E.project(c, Z_CITY, WIN.x, WIN.y); return p ? { x: p[0], y: p[1], w: WIN.w * p[2], h: WIN.h * p[2], k: p[2] } : null; }
export function crystalAt(c) { const p = E.project(c, Z_CRY, CRY.x, CRY.y); return p ? [p[0], p[1], CRY.r * p[2]] : null; }

// ------------------------------------------------------------------------------------------------ cameras of the plates
export const WIN_CAM = (k = 1, tr = 0) => E.aim(Z_CITY, WIN.x + WIN.w / 2 + tr, WIN.y + WIN.h / 2 + 6, 2.6 * k);
export const CRY_CAM = (k = 1, tr = 0) => E.aim(Z_CRY, CRY.x + 60 + tr, CRY.y + 210, 1.0 * k);
export const SORT_CAM = (k = 1, tr = 0) => E.aim(Z_CRY, CRY.x - 300 + tr, CRY.y + 420, .62 * k);

// Lead → B1: the room through its window
export function plateWindow(ctx, t, T) {
  const k = creep(t, T, 'The seller is Anthropic'), c = WIN_CAM(k, trk(k) / 2.6 * .2);
  cityWorld(ctx, c, t, { room: { lit: 1, seated: 1, wheel: { a: 1, glass: 1 } }, crystal: { gap: 1 } });
}
// B1 → B2: the crystal with its price tag
export function plateCrystal(ctx, t, T) {
  const k = creep(t, T, 'Many doubt it'), c = CRY_CAM(k, trk(k) * .3);
  cityWorld(ctx, c, t, { crystal: { gap: 1 }, tag: (cx, r) => crystalTag(cx, t, r, 1), you: false });
  F.board(ctx, t, T);
}
// the "$ ?" price tag that hangs from the crystal's lowest point (crystal card coordinates)
export function crystalTag(ctx, t, r, u, text = '$ ?') {
  return F.priceTag(ctx, t, r.x + r.r * .48, r.y + r.r * .9, text, u, { len: 150, size: 34 });
}
// B2 → B3: KNOWN | FORECAST over the veiled city
export const SORT = { known: { x: 230, y: 250, w: 700, h: 560 }, fore: { x: 990, y: 250, w: 700, h: 560 } };
export function sortTrays(ctx, t, u = 1, o = {}) {
  for (const [key, kind, col] of [['known', 'KNOWN', GOLD.line], ['fore', 'FORECAST', COOL.line]]) {
    const b = SORT[key], uu = clamp(u * 1.2 - (key === 'fore' ? .2 : 0)); if (uu <= 0) continue;
    ctx.save(); ctx.globalAlpha *= clamp(uu * 3);
    ctx.strokeStyle = rgba(col, .7); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w * expoOut(uu), b.h, 16); ctx.stroke();
    ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .55); ctx.fill();
    E.glowText(ctx, kind, b.x + 30, b.y + 52, { size: 26, weight: 600, spacing: .2, col, glow: false, a: F.rise(span(uu, .3, 1)) });
    ctx.restore();
  }
  if (o.cards === false) return;
  const k = SORT.known, f = SORT.fore;
  F.dataCard(ctx, t, k.x + 30, k.y + 80, k.w - 60, { u: o.c1 ?? 1, kind: '', title: 'REVENUE', big: '$41M → $17.0B', bigSize: 58, small: '2023 (YEAR) → Q3 2026 (QUARTER)', h: 220 });
  F.dataCard(ctx, t, k.x + 30, k.y + 316, k.w - 60, { u: o.c2 ?? 1, kind: '', title: 'NET LOSS, JAN–SEP 2026', big: '≈ $104B', bigSize: 58, small: '$94.3B NON-CASH · OPERATING LOSS $1.3B', h: 220 });
  F.dataCard(ctx, t, f.x + 30, f.y + 80, f.w - 60, { u: o.c3 ?? 1, kind: '', title: 'THE SELLER, ON STAGE', big: '1–2 YEARS', bigSize: 58, small: '"A COUNTRY OF GENIUSES"', h: 220 });
  F.dataCard(ctx, t, f.x + 30, f.y + 316, f.w - 60, { u: o.c4 ?? 1, kind: '', title: 'THE DOCUMENT', big: 'WITHIN A FEW YEARS', bigSize: 46, small: 'WHERE EVERY WORD CARRIES LEGAL WEIGHT', h: 220 });
}
export function plateSort(ctx, t, T) {
  const k = creep(t, T, 'Reports say there are'), c = SORT_CAM(k, trk(k) * .2);
  cityWorld(ctx, c, t, { crystal: { gap: 1 }, you: false });
  F.veil(ctx, .72);
  ctx.save(); F.float(ctx, t, 1); sortTrays(ctx, t, 1); ctx.restore();
  F.board(ctx, t, T);
}

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// The crystal big and calm at the top centre over the night; you small on the ledge at the left, holding the shard; the dark rooftop below
// carries the two YouTube tiles and the subscribe circle (clean, low-detail background). No text. The picture keeps breathing.
// (A far pull-back does not work in this world: the ledge rises to the horizon and the crystal seems to sit on the roof.)
export const END_CAM = E.aim(Z_CRY, CRY.x, CRY.y, .8, 960, 290);
export const END_TILES = { left: { x: 80, y: 620, w: 640, h: 360 }, right: { x: 1200, y: 620, w: 640, h: 360 }, sub: { x: 960, y: 930, r: 80 } };
