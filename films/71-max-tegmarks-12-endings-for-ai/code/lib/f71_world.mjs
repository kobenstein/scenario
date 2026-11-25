// Film 71 · the LEITBILD (thumbnail A: twelve doors of light in a shallow arc on the night plain, you small in the gold beam), the MORNING
// SETS (the rooms behind a door: kitchen, glass, the empty bedroom) and the SEAM PLATES (the ranked row on the yard) + the END SCREEN.
// Owned by the lead; builders import, never edit (wishes go in the report). Kit: lib/f71_kit.mjs.
//
//   leitbild(ctx, t, st)      the night plain of thumbnail A. st: { v (zoom view, screen coords at v = V0), slots: (i) => door overrides,
//                             beams 0..1, you: {x, y, h, pose, walk, look, a}, title u, titleOut, stars 0..1, which 0..1 (WHICH ENDING?) }.
//                             Slot i (0 = left) holds rank THUMB_ORDER[i]; the gold door is slot 5. thumbSlot(i) = its geometry.
//   rooms(ctx, t, rc, o)      the morning world (room coords: kitchen x 0..1920, bedroom x -2100..-180), seen through view rc.
//                             o: { fed, anyone, glass, dim, you }. A builder's own mornings follow the same recipe (warm wall, one window
//                             = the hero light, you small with a cup), never a copy of this kitchen.
//   roomThroughDoor(...)      draws a room behind a door opening with parallax (the fly-in: the room is farther away than the door).
//   rowScene(ctx, t, T, o)    THE RANKED ROW on the yard (the seam picture): doors 12 → 1, door o.n current (lit), the passed ones dark, a
//                             small switch lever in front of every door, the mini tags, you at the left end, the counter.
//   plateRow(ctx, t, T, n)    the seam plate = rowScene at the view { W/2, 560, creep } (the creep starts SEAM_HALF before the seam).
//   endScreen(ctx, t, T)      the last 15 s: thumbnail A again, calm, the gold door ajar, you in its beam; the lower 45 % stays quiet for
//                             the two YouTube tiles + subscribe (END_TILES).
import * as F from './f71_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, rad, lin, prng, GOLD, CREAM, COOL, LAMP, EMBER, INK } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));

// ------------------------------------------------------------------------------------------------ the Leitbild (thumbnail A)
export const GOLD_SLOT = 5;
export function thumbSlot(i) { const c = (i - 5.5) / 5.5, c2 = c * c; return { x: 150 + i * 148.4, y: 678 + 20 * c2, w: 64 - 6 * c2, h: 250 - 45 * c2 }; }
export const YOU0 = { x: 900, y: 872, h: 140 };
const STARS = (() => { const r = prng(7101); return Array.from({ length: 110 }, () => [r() * 2400 - 240, r() * 640 - 60, .6 + r() * 1.6, r() * 6.3, .3 + r() * .7]); })();
export function plain(ctx, t, v, o = {}) {
  F.inView(ctx, v, () => {
    const hz = o.hz ?? 662;
    ctx.fillStyle = lin(ctx, 0, -900, 0, hz, [[0, P.night0], [.55, '#0b1446'], [1, '#18286e']]); ctx.fillRect(-3000, -3000, 8000, 3000 + hz);
    ctx.fillStyle = lin(ctx, 0, hz, 0, 1300, [[0, '#101d58'], [.25, '#0c1645'], [1, '#070b26']]); ctx.fillRect(-3000, hz, 8000, 4000);
    ctx.fillStyle = rad(ctx, 900, hz - 40, 1100, [[0, rgba('#2a3c8c', .5)], [1, rgba('#2a3c8c', 0)]]); ctx.fillRect(-3000, -3000, 8000, 6000);
    const sa = o.stars ?? 1;
    if (sa > 0) for (const [x, y, r, ph, b] of STARS) { const tw = .55 + .45 * Math.sin(t * (.6 + b) + ph); ctx.fillStyle = rgba(CREAM, .55 * b * tw * sa); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  });
}
// the long beam of a door on the plain, fanning away from the viewer's axis (x = 900)
export function beam(ctx, x, y, w, col, a) {
  if (a <= 0) return;
  const L = 760, off = (x - 900) * 1.25, sp = w * (2.6 + Math.abs(x - 900) / 900);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, y, 0, y + L, [[0, rgba(col, .30 * a)], [.5, rgba(col, .12 * a)], [1, rgba(col, 0)]]);
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + off + sp, y + L); ctx.lineTo(x + off - sp, y + L); ctx.closePath(); ctx.fill();
  ctx.restore();
}
export function slotDoor(i, o = {}) { const s = thumbSlot(i), gold = i === GOLD_SLOT; return { ...s, col: F.THUMB_COL[i], lit: gold ? 1 : .82, rank: F.THUMB_ORDER[i], ...o }; }
export function leitbild(ctx, t, st = {}) {
  const v = st.v ?? F.V0;
  if (st.bg !== false) plain(ctx, t, v, { stars: st.stars ?? 1 });
  const ds = Array.from({ length: 12 }, (_, i) => ({ ...slotDoor(i), ...(st.slots ? st.slots(i) || {} : {}) }));
  F.inView(ctx, v, () => {
    const bm = st.beams ?? 1;
    for (let i = 0; i < 12; i++) { const d = ds[i]; if ((d.a ?? 1) > 0) beam(ctx, d.x, d.y, d.w, d.col, bm * (d.beamA ?? (i === GOLD_SLOT ? 1.55 : .9)) * (d.a ?? 1) * d.lit); }
    for (let i = 0; i < 12; i++) {
      const d = ds[i]; if ((d.a ?? 1) <= 0) continue;
      F.door(ctx, t, d.x, d.y, d.w, d.h, { col: d.col, lit: d.lit, beam: 0, seed: i, a: d.a, open: d.open, leafA: d.leafA, inner: d.inner, halo: i === GOLD_SLOT ? 1.3 : .8, frame: 0 });
    }
    const y = st.you; if (y && (y.a ?? 1) > 0) {
      ctx.save(); ctx.globalAlpha *= y.a ?? 1;
      ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.moveTo(y.x - y.h * .1, y.y); ctx.lineTo(y.x + y.h * .1, y.y); ctx.lineTo(y.x + y.h * .16, y.y + y.h * .9); ctx.lineTo(y.x - y.h * .04, y.y + y.h * .9); ctx.closePath(); ctx.fill();
      F.du(ctx, y.x, y.y, y.h, { hood: false, view: y.view ?? 'back', pose: y.pose ?? 'stand', walk: y.walk, look: y.look ?? .1, dir: y.dir ?? 1, light: 1, back: y.back ?? .6 });
      ctx.restore();
    }
  });
  if ((st.title ?? 0) > 0) F.title(ctx, t, st.title, { y: 280, out: st.titleOut });
  if ((st.which ?? 0) > 0) F.big(ctx, F.TXT.hook.which, W / 2, 250, 74, st.which, { gold: .25 });
}

// ------------------------------------------------------------------------------------------------ the morning sets
// kitchen (x 0..1920): warm wall, ONE window = the hero light (sun low, the houses across), a table with a cup, the empty BILLS pocket,
// you with a cup at the window. o.fed (a full bowl), o.anyone (the windows across light up one by one: "For anyone"), o.glass (a cool pane
// slides in from the left: "behind glass"). Bedroom (x -2100..-180): dark, the made bed, nobody, a window that never gets light.
const HOUSES = (() => { const r = prng(7111); return Array.from({ length: 6 }, (_, i) => ({ x: 1050 + i * 100 + r() * 20, w: 80 + r() * 30, h: 90 + r() * 70, win: Array.from({ length: 4 }, () => [r(), r()]) })); })();
export function rooms(ctx, t, rc, o = {}) {
  F.inView(ctx, rc, () => {
    // kitchen wall + floor
    ctx.fillStyle = lin(ctx, 0, 0, 1920, 0, [[0, mixHex(GOLD.shade, P.night1, .45)], [.55, mixHex(GOLD.mid, GOLD.shade, .35)], [1, mixHex(GOLD.body, GOLD.mid, .4)]]); ctx.fillRect(0, -400, 2400, 1300);
    ctx.fillStyle = lin(ctx, 0, 900, 0, 1500, [[0, mixHex(GOLD.deep, P.night1, .25)], [1, mixHex(GOLD.deep, P.night0, .6)]]); ctx.fillRect(0, 900, 2400, 700);
    // the window (hero light): sky, low sun, the houses across with their windows
    const wx = 1080, wy = 170, ww = 520, wh = 450;
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(GOLD.hot, '#9fc2ee', .25)], [.6, GOLD.hot], [1, GOLD.body]]); ctx.fillRect(wx, wy, ww, wh);
    halo(ctx, 1420, 470, 260, .9, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(1420, 470, 54 + 2 * Math.sin(t * .8), 0, TAU); ctx.fill();
    HOUSES.forEach((hs, i) => {
      const by = wy + wh; ctx.fillStyle = mixHex(P.ind2, GOLD.shade, .35); ctx.fillRect(hs.x, by - hs.h, hs.w, hs.h);
      ctx.beginPath(); ctx.moveTo(hs.x - 6, by - hs.h); ctx.lineTo(hs.x + hs.w / 2, by - hs.h - 34); ctx.lineTo(hs.x + hs.w + 6, by - hs.h); ctx.fill();
      hs.win.forEach(([a, b], j) => { const on = clamp((o.anyone ?? 1) * 7 - (i * 4 + j) * .25); ctx.fillStyle = mixHex(mixHex(P.ind1, GOLD.shade, .3), LAMP.core, on); ctx.fillRect(hs.x + 10 + a * (hs.w - 34), by - hs.h + 16 + b * (hs.h - 46), 14, 18); });
    });
    ctx.restore();
    ctx.strokeStyle = mixHex(GOLD.deep, P.night0, .3); ctx.lineWidth = 16; ctx.strokeRect(wx, wy, ww, wh); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.moveTo(wx, wy + wh * .45); ctx.lineTo(wx + ww, wy + wh * .45); ctx.stroke();
    // the sun patch on the wall and floor (light falls as a shape, not a blur)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(GOLD.hot, .16 + .02 * Math.sin(t * .5));
    ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx + ww - 380, 1080); ctx.lineTo(wx - 520, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
    // BILLS: the wall pocket, empty
    ctx.fillStyle = mixHex(GOLD.deep, P.night1, .2); ctx.beginPath(); ctx.roundRect(360, 380, 220, 120, 10); ctx.fill();
    ctx.fillStyle = mixHex(GOLD.shade, P.night1, .5); ctx.fillRect(372, 392, 196, 20);
    F.glowText(ctx, 'BILLS', 470, 362, { size: 26, weight: 700, align: 'center', col: mixHex(CREAM, GOLD.deep, .25), glow: false, spacing: .2 });
    // the table, the cup (steam), the bowl
    ctx.fillStyle = mixHex(GOLD.deep, P.night0, .35); ctx.fillRect(220, 700, 800, 30); ctx.fillRect(260, 730, 26, 230); ctx.fillRect(954, 730, 26, 230);
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.roundRect(700, 650, 50, 52, 8); ctx.fill(); ctx.strokeStyle = CREAM; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(752, 676, 13, -1.2, 1.2); ctx.stroke();
    ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 3; for (let k = 0; k < 2; k++) { ctx.beginPath(); for (let s = 0; s <= 1; s += .1) { const y = 640 - s * 70, x = 715 + k * 20 + 7 * Math.sin(s * 7 + t * 2.2 + k); s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    const fed = clamp(o.fed ?? 0);
    if (fed > 0) {
      const k = expoOut(fed); ctx.save(); ctx.translate(470, 700); ctx.scale(k, k);
      [[-36, -26, GOLD.mid], [0, -38, EMBER.halo], [34, -24, mixHex(GOLD.body, '#8fd27a', .5)], [-12, -14, GOLD.body]].forEach(([x, y, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 24, 0, TAU); ctx.fill(); });
      ctx.fillStyle = mixHex(CREAM, GOLD.shade, .3); ctx.beginPath(); ctx.arc(0, -16, 78, 0, Math.PI); ctx.fill(); ctx.restore();
    }
    // you at the window with a cup
    const yu = o.you ?? 1;
    if (yu > 0) { ctx.save(); ctx.globalAlpha *= yu; F.du(ctx, 900, 980 + Math.sin(t * 1.3) * 1.5, 400, { hood: false, pose: 'hold', dir: 1, light: 1, look: .2 + .05 * Math.sin(t * .4), back: .15 }); ctx.restore(); }
    // the glass pane (cool): slides in from the left, its bright edge leads; after it, the morning is behind glass
    const g = clamp(o.glass ?? 0);
    if (g > 0) {
      const ex = lerp(-60, 1990, sineIO(g));
      ctx.fillStyle = rgba(COOL.deep, .32); ctx.fillRect(-60, -400, ex + 60, 1800);
      ctx.save(); ctx.beginPath(); ctx.rect(-60, -400, ex + 60, 1800); ctx.clip(); ctx.strokeStyle = rgba(COOL.core, .16); ctx.lineWidth = 26;
      for (let k = -2; k < 7; k++) { const x = k * 380 + 60 * Math.sin(t * .2); ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x + 700, 1400); ctx.stroke(); }
      ctx.strokeStyle = rgba(COOL.line, .6); ctx.lineWidth = 8; for (const x of [640, 1280]) if (x < ex) { ctx.beginPath(); ctx.moveTo(x, -400); ctx.lineTo(x, 1400); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle = COOL.line; ctx.fillRect(ex - 7, -400, 14, 1800); halo(ctx, ex, 540, 340, .25, COOL.halo, COOL.core);
    }
    // the wall between, the bedroom
    ctx.fillStyle = P.night1; ctx.fillRect(-180, -400, 180, 1800);
    ctx.fillStyle = lin(ctx, 0, 0, 0, 900, [[0, mixHex(P.ind2, P.night0, .3)], [1, mixHex(P.ind1, P.night1, .5)]]); ctx.fillRect(-2600, -400, 2420, 1300);
    ctx.fillStyle = mixHex(P.night1, P.night0, .4); ctx.fillRect(-2600, 900, 2420, 700);
    ctx.fillStyle = lin(ctx, 0, 220, 0, 560, [[0, '#0b1446'], [1, '#1a2a66']]); ctx.fillRect(-960, 220, 380, 340);
    ctx.strokeStyle = P.night0; ctx.lineWidth = 14; ctx.strokeRect(-960, 220, 380, 340); ctx.beginPath(); ctx.moveTo(-770, 220); ctx.lineTo(-770, 560); ctx.stroke();
    ctx.fillStyle = rgba(CREAM, .5); ctx.beginPath(); ctx.arc(-660, 300, 3, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(P.ind2, P.night0, .4); ctx.fillRect(-1760, 560, 40, 360); ctx.beginPath(); ctx.roundRect(-1760, 560, 160, 300, 18); ctx.fill();
    ctx.fillStyle = mixHex(CREAM, P.ind2, .62); ctx.beginPath(); ctx.roundRect(-1720, 760, 720, 90, 10); ctx.fill();
    ctx.fillStyle = mixHex(CREAM, P.ind2, .5); ctx.beginPath(); ctx.roundRect(-1690, 726, 170, 46, 20); ctx.fill();
    ctx.fillStyle = mixHex(CREAM, P.ind1, .7); ctx.fillRect(-1500, 752, 500, 24);
    ctx.fillStyle = mixHex(P.ind2, P.night0, .3); ctx.fillRect(-1720, 850, 720, 60); ctx.fillRect(-1020, 760, 30, 160);
    ctx.fillStyle = mixHex(P.ind2, P.night0, .2); ctx.fillRect(-900, 760, 90, 140); ctx.fillStyle = mixHex(CREAM, P.ind2, .75); ctx.beginPath(); ctx.moveTo(-880, 700); ctx.lineTo(-830, 700); ctx.lineTo(-820, 750); ctx.lineTo(-890, 750); ctx.closePath(); ctx.fill();
  });
  const dm = clamp(o.dim ?? 0); if (dm > 0) { ctx.fillStyle = rgba(P.night0, .6 * dm); ctx.fillRect(0, 0, W, H); }
}
// the room behind a door opening, with parallax: the room is FARTHER than the door, so it scales slower than the door (fly-in / pull-out).
// box = the opening on screen, Z = the door zoom (1 = thumbnail), ZEND = where the opening fills the frame, rc = the room view at full size.
export const ZEND = 34;
export function roomThroughDoor(ctx, t, box, Z, rc, o = {}) {
  const rs = rc.s * Math.pow(clamp(Z / ZEND, 1e-3, 1), .5), cx = box.x0 + box.w / 2, cy = box.y0 + box.h / 2;
  const f = clamp(Math.log(Z) / Math.log(ZEND));
  const v = { x: rc.x - (cx - W / 2) * (1 - f) / rs, y: rc.y - (cy - H / 2) * (1 - f) / rs, s: rs };
  rooms(ctx, t, v, o);
}

// ------------------------------------------------------------------------------------------------ the ranked row (seam plates)
export const ROW_YOU = { x: 104, y: 660, h: 60 };
export const LEVER_Y = 742;
export function rowLever(ctx, t, x, ang, a = 1, knob = 0) {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 46, LEVER_Y + 14); ctx.lineTo(x + 46, LEVER_Y + 14); ctx.stroke();
  F.lever(ctx, t, x, LEVER_Y + 8, ang, 34, { knob });
  ctx.restore();
}
// o: { n (current rank), v (view), yard (false: the caller drew the ground), lit / a / col / scale / beam / open / inner / doorOpts: (m) => …, pos: (m) =>
//      {x, y, w, h} (a door in flight: no lever, no tag), tags / levers: number or (m) => 0..1, leverAng / knob: (m) => …, you 0..1,
//      youAt { x, y, h, pose, walk, dir, view }, hud 0..1, parked }
const fnv = (f, m, d) => (typeof f === 'function' ? f(m) : f ?? d);
export function rowScene(ctx, t, T, o = {}) {
  const n = o.n ?? 12, v = o.v ?? { x: W / 2, y: 560, s: 1 };
  if (o.yard !== false) F.yard(ctx, t, v, { lx: F.rowX(n), ly: 560, pool: .8, rails: 1 });
  F.inView(ctx, v, () => {
    for (const e of F.ENDINGS) {
      const m = e.n, a = o.a ? o.a(m) : 1; if (a <= 0) continue;
      const cur = m === n, x = F.rowX(m), p = o.pos ? o.pos(m) : null;
      const lit = o.lit ? o.lit(m) : cur ? 1 : m > n ? .22 : .6;
      const s = o.scale ? o.scale(m) : cur ? 1.06 : 1, w = p?.w ?? F.ROW.w * s, h = p?.h ?? F.ROW.h * s, dx = p?.x ?? x, dy = p?.y ?? F.ROW.y;
      F.door(ctx, t, dx, dy, w, h, { col: o.col ? o.col(m) : e.col, lit, beam: o.beam ? o.beam(m) : cur ? .8 : .3, seed: m, a, open: o.open ? o.open(m) : undefined, inner: o.inner ? o.inner(m) : undefined, ...(o.doorOpts ? o.doorOpts(m) : {}) });
      const lv = fnv(o.levers, m, 1) * a; if (lv > 0 && !p) rowLever(ctx, t, x, o.leverAng ? o.leverAng(m) : .45, lv, o.knob ? o.knob(m) : 0);
      const tg = fnv(o.tags, m, 1) * a; if (tg > 0 && !p) F.miniTag(ctx, x, F.ROW.y - h - 26, tg, m);
    }
    const yu = o.you ?? 1; if (yu > 0) { const y = o.youAt ?? ROW_YOU; ctx.save(); ctx.globalAlpha *= yu; F.du(ctx, y.x, y.y, y.h, { hood: false, pose: y.pose ?? 'stand', walk: y.walk, view: y.view, dir: y.dir ?? 1, look: .2 + .04 * Math.sin(t * .5), light: 1 }); ctx.restore(); }
  });
  if ((o.hud ?? 1) > 0) F.counterHud(ctx, t, T, { a: o.hud ?? 1, parked: o.parked });
}
// the seam plate at a group boundary (B1 → B2 at n = 6, B2 → B3 at n = 1, lead → B1 at n = 11): identical on both sides of the seam
export const SEAM = { 11: 'The next ending has no morning', 6: 'And if nobody can be trusted', 1: 'Egalitarian Utopia' };
export const plateView = (t, T, n) => ({ x: W / 2, y: 560, s: creep(t, T, SEAM[n]) });
export function plateRow(ctx, t, T, n) { rowScene(ctx, t, T, { n, v: plateView(t, T, n) }); }

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// thumbnail A again (frame 0 = the last frame's promise): the doors in their thumbnail order high in the frame, the gold door ajar, you in
// its beam; a slow pull-back. The lower 45 % (y > 600) stays dark and calm for the two tiles (END_TILES) + the subscribe circle.
export const END_TILES = { left: { x: 80, y: 600, w: 640, h: 360 }, right: { x: 1200, y: 600, w: 640, h: 360 }, sub: { x: 960, y: 900, r: 80 } };
// the end-screen camera and the gold slot (c13 glides into exactly these: S.endView / S.endGoldSlot; final pass: more drift, a readable slit)
export const endView = (t, T) => { const q = t - (T.duration - 15); return { x: 900 + 12 * Math.sin(q * .29), y: 600 + 4 * q + 6 * Math.sin(q * .21 + 1), s: (.9 - .004 * q) * (1 + .008 * Math.sin(q * .17)) }; };
export const endGoldSlot = (t) => ({ open: .5 + .04 * Math.sin(t * .6), leafA: .55, inner: (c, box) => { c.fillStyle = GOLD.core; c.fillRect(box.x0, box.y0, box.w, box.h); } });
export function endScreen(ctx, t, T) {
  const v = endView(t, T);
  leitbild(ctx, t, { v, beams: .75 + .08 * Math.sin(t * .7), stars: 1, slots: (i) => (i === GOLD_SLOT ? endGoldSlot(t) : { lit: .7 + .05 * Math.sin(t * .5 + i) }),
    you: { x: 895, y: 742, h: 92, look: .35 } });
  ctx.fillStyle = lin(ctx, 0, 560, 0, H, [[0, rgba(P.night0, 0)], [.35, rgba(P.night0, .55)], [1, rgba(P.night0, .8)]]); ctx.fillRect(0, 560, W, H - 560);
}
