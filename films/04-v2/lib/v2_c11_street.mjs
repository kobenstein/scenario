// c11 (Film 4 v2) · the esteem street of the Maslow hill as a cut-away street of workshops (owner c11; c12 returns here at 12.07:
// copy this file + lib/v2_c11_rooms.mjs + lib/v2_c11_people.mjs + lib/v2_c11_kit.mjs, then call drawStreet with your own state).
//
// GEOMETRY. Everything is in hill world units (lib/maslow4.mjs: 1 unit ≈ 0.23 m, y down) plus a depth d behind the facade plane
// (d > 0 into the houses, d < 0 toward the viewer). The six workshops are the hill's own level-2 front-row houses of kind 'workshop'
// (hillHouses(2), sorted left → right); without hillHouses (older hill) a fallback row of six is used at the same place.
//   streetLayout()            → { shops: [{ i, x0, x1, yb, h, storeys, rooms: [{ j, x0, x1, y0, y1, d1, kind }] }], board, … }
//   streetView(cx, cy, D)     → a pinhole camera looking straight at the facades: (cx, cy) the facade point at the frame centre,
//                               D its distance (units). The hill itself is drawn by maslow4 with cam { x: cx, y: cy, z: FOC / D },
//                               so at d = 0 the overlay and the hill agree exactly; V.P(x, y, d) → [sx, sy, q] (q = px per unit).
//   drawStreet(ctx, t, V, st) → the whole frame: maslow4 drawHill + the labels + the opened rooms, the lifting fronts, the passage
//                               and the notice board. st (all optional):
//     hill:   the maslow4 state (night, lit, people, …; labels/title are ignored: this file draws ESTEEM / SELF-ACTUALIZATION itself)
//     labels: { es: 0..1, sa: 0..1 }  write-on of the two labels (they ride with the hill as the camera moves)
//     open:   t of the front lift (fronts lift from the frame centre outward), or null = closed, or 'open' = all open
//     busy:   per-room activity clocks (see rooms.mjs): { potter: t0 (the bowl rises from t0), office: t0 (dissolve), gather: t0, pin: t0 }
//     plate:  (ctx, t) draws the next chunk's paper plate inside the blank notice (screen space)
import * as M4 from './maslow4.mjs';
import { W, H, rgba, clamp, mix, lin, sm, prng, TAU, eoX, eiX, qio, u01, mixHex, shadeHex, hash } from './v2_c11_kit.mjs';
import { drawRoom, drawPoche, drawPassage, ROOMKINDS } from './v2_c11_rooms.mjs';

export const drawHill = M4.drawHill, HILL = M4.HILL, toScreen = M4.toScreen;
export const FOC = 1400;          // focal length of the street camera (px)
export const MPU = .23;           // metres per hill unit
export const SH = 13;             // storey height on level 2 (units)
export const DEPTH = 18;          // depth of the rooms behind the facade (units, ≈ 4.1 m)
export const H3 = { x: 960, y: 452, z: 1.12 };   // the view of the whole hill when the vignette's window fills the frame (c11 11.05)

// ---------------------------------------------------------------- layout
let LAYOUT = null;
export function streetLayout() {
  if (LAYOUT) return LAYOUT;
  let shops = null;
  if (typeof M4.hillHouses === 'function') {
    const hs = M4.hillHouses(2).filter((h) => h.row === 0 && h.kind === 'workshop').sort((a, b) => a.x - b.x);
    if (hs.length >= 5) shops = hs.map((h) => ({ x0: h.x, x1: h.x + h.w, yb: h.yb, h: h.h, col: h.col, seed: h.seed, roof: h.roof, rh: h.rh }));
  }
  if (!shops) {   // fallback: the same street on an older hill (six shops between x 700 and 1000 on the esteem terrace)
    const r = prng(511); shops = []; let x = 700;
    for (let i = 0; i < 6; i++) { const w = i === 5 ? 1000 - x : 42 + r() * 9; shops.push({ x0: x, x1: x + w, yb: 527 - i * .25, h: i % 2 ? 38 : 32, col: '#8d776a', seed: 900 + i, roof: 'eave', rh: 8 }); x += w; }
  }
  shops = shops.slice(0, 6).map((s, i) => {
    const storeys = Math.max(1, Math.round((s.h - 4) / SH)), rooms = [];
    for (let j = 0; j < storeys; j++) {
      const y1 = s.yb - j * SH, y0 = Math.max(s.yb - s.h + 1.6, s.yb - (j + 1) * SH);
      if (y1 - y0 < 7) continue;
      rooms.push({ i, j, x0: s.x0 + .7, x1: s.x1 - .7, y0: y0 + (j < storeys - 1 ? .45 : 0), y1: y1 - (j ? .45 : 0), d1: DEPTH, kind: ROOMKINDS(i, j), seed: s.seed + j * 31 });
    }
    return { i, ...s, storeys, rooms, top: s.yb - s.h };
  });
  LAYOUT = { shops, office: shops[4], potter: shops[0] };
  return LAYOUT;
}

// ---------------------------------------------------------------- the camera
export function streetView(cx, cy, D) {
  const P = (x, y, d) => { const q = FOC / Math.max(.05, D + d); return [W / 2 + (x - cx) * q, H / 2 + (y - cy) * q, q]; };
  return { x: cx, y: cy, D, z: FOC / D, P, cam: { x: cx, y: cy, z: FOC / D } };
}
// a person's scale (lib/v2_c11_people.mjs person(): s = px per metre / 105.7) at depth d
export const figS = (V, d) => FOC / Math.max(.05, V.D + d) / MPU / 105.7;

// ---------------------------------------------------------------- the labels (the hill's label style, after lib/v2_hill_dev.mjs labels(), 2026-10-20:
// anchor dot on the terrace, a leader, Instrument Serif; restricted to ESTEEM (the level of this chunk: lit, larger, amber leader) and
// SELF-ACTUALIZATION (the next one up). Screen-placed like the hill's own; written on and off by a clip, never a fade.
function labels(ctx, t, V, la) {
  for (const [lv, u] of [[2, la.es ?? 0], [3, la.sa ?? 0]]) {
    if (u <= .01) continue;
    const L = HILL.levels[lv], ym = mix(L.y0, L.y1, .45), hw = mix(L.hw0, L.hw1, (L.y0 - ym) / (L.y0 - L.y1));
    const [ax, ay] = toScreen(V.cam, HILL.cx + hw - 22, ym), focus = lv === 2, size = focus ? 46 : 36;
    const lx = 1470, ly = ay + size * .3, ex = lx - 16, ey = ly - size * .3;
    const lu = clamp(u / .35), tu = clamp((u - .25) / .75);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = rgba(focus ? '#ffb35c' : '#a49fc4', .75); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(mix(ax, ex, lu), mix(ay, ey, lu)); ctx.stroke();
    ctx.fillStyle = rgba(focus ? '#ffb35c' : '#a49fc4', .95); ctx.beginPath(); ctx.arc(ax, ay, 2.6, 0, TAU); ctx.fill();
    if (tu > 0) {
      ctx.font = `400 ${size}px "Instrument Serif"`; const tw = ctx.measureText(L.label).width;
      ctx.beginPath(); ctx.rect(lx - 6, ly - size, (tw + 12) * tu, size * 1.4); ctx.clip();
      ctx.shadowColor = 'rgba(6,6,20,.85)'; ctx.shadowBlur = 14;
      ctx.fillStyle = focus ? '#f3efe2' : '#a49fc4'; ctx.textBaseline = 'alphabetic'; ctx.fillText(L.label, lx, ly);
    }
    ctx.restore();
  }
}

// ---------------------------------------------------------------- the fronts
// lift progress of shop i at t (0 closed … 1 gone): from the frame centre outward, 70 ms apart, expo-in up and away
export function liftU(st, i, t, V) {
  if (st.open === 'open') return 1; if (st.open == null) return 0;
  return clamp((t - st.open - i * .085) / .62);   // the potter's first, then the wave runs right along the street
}
const LIFT = 150;   // units the front travels (out of frame at the widest view of the lift)
function front(ctx, t, V, S, u, hillSt) {
  const L = LIFT * eiX(u) + 3 * u; if (u <= 0) return; if (u >= 1) return;
  const a = V.P(S.x0, S.top - L, 0), b = V.P(S.x1, S.yb - L, 0);
  if (b[1] < -4 || a[0] > W || b[0] < 0) return;
  ctx.save(); ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.clip();
  drawHill(ctx, t, { x: V.x, y: V.y + L, z: V.z }, hillSt);
  // the cut edge along the bottom of the lifting wall (a dark engraved band)
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#211a2a'; ctx.fillRect(a[0], b[1] - Math.max(1.5, V.z * .55), b[0] - a[0], Math.max(1.5, V.z * .55));
  ctx.restore();
}

// ---------------------------------------------------------------- the frame
export function drawStreet(ctx, t, V, st = {}) {
  const LY = streetLayout(), hillSt = { ...(st.hill || {}), labels: 0, title: 0 };
  const inside = st.inside || 0;   // 1: the camera is inside the passage (the hill is out of frame)
  if (!inside) drawHill(ctx, t, V.cam, hillSt);
  else { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#1a1424'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  if (st.labels && !inside) labels(ctx, t, V, st.labels);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (const S of LY.shops) {
    const u = liftU(st, S.i, t, V); if (u <= 0) continue;
    const A = V.P(S.x0, S.top, 0), B = V.P(S.x1, S.yb, 0); if (B[0] < -20 || A[0] > W + 20 || B[1] < -20 || A[1] > H + 20) continue;
    // the rooms behind the facade, clipped to the opening
    ctx.save(); ctx.beginPath(); ctx.rect(A[0], A[1], B[0] - A[0], B[1] - A[1]); ctx.clip();
    if (S.i === 4 && st.busy && st.busy.office != null && t > st.busy.office) drawPassage(ctx, t, V, S, st);
    for (const R of S.rooms) drawRoom(ctx, t, V, S, R, st);
    ctx.restore();
    drawPoche(ctx, t, V, S, st);
  }
  for (const S of LY.shops) front(ctx, t, V, S, liftU(st, S.i, t, V), hillSt);
  ctx.restore();
}
