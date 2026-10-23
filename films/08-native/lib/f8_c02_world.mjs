// Film 8 · chunk c02 (01a · the memory) · the world of this chunk, drawn around the shared kit (lib/f8_kit.mjs: weave, stitch, glyph,
// firefly, nightLand, pulse). Owner: c02 builder. Other chunks may import, never edit.
//
// ONE CAMERA for the whole chunk: the plane Z = 0 holds the houses and the great weave (W1 coordinates = screen px at the reference
// camera {x 720, y 470, k 1}); a real perspective floor (Y = FLOOR) runs toward the camera. cam = { x, y, k, h }:
//   x, y = the world point of the Z=0 plane at the screen centre, k = zoom of that plane, h = the camera's 3D height (world Y; a lens
//   shift keeps verticals vertical, so the weave stays a rectangle while the camera cranes up to look down on the floor).
//   P(cam, X, Y, Z) → [sx, sy, scale] | null      plane(ctx, cam, fn) draws fn in plane coords (Z = 0)
//
// What lives here:
//   threadBall(ctx, t, cam, X, Y, o)   the knot of gold threads over a head (a ball of loops; at k ≫ 1 the camera is INSIDE it)
//   meshPatch(ctx, t, pts, o)          a small woven patch from a grid of points (the room's own knowledge; tears and trails)
//   oldHouse(ctx, t, S) / newHouse(ctx, t, S)   the ordinary company (3 storeys, 9 rooms) and the A.I.-native one (one hall + the weave)
//   hallFloor(ctx, t, cam, o)          the dark hall: floor boards in perspective, the light pool under the weave
//   plaque(ctx, t, cam, o)             the brass museum plaque under the weave ("COMPANY BRAIN" / SILICON VALLEY)
//   meetingRing(ctx, t, cam, m, o)     a circle of seated people on the floor (a meeting as a form), its centre light, its thread
//   nameLabel(ctx, t, o)               TOM BLOMFIELD · role line with strike-through and the new line (mask reveals only)
//   glowFrom(ctx, t, plateFn, u, at, o) a handoff plate as a light that shrinks to / grows from a point (no alpha over the scene:
//                                      the plate is the core of an in-world light, its edge is the light's own falloff)
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, canvas, hatch, text } from '../engine.mjs';
import { figure, figureFlat, POSES, walk, life } from './figure.mjs';
import { F8, glyph, qio, eoutX } from './f8_kit.mjs';
import { TSHIFT } from './handoff4.mjs';

const TAU = Math.PI * 2;
export const FCAM = 1500;          // focal length (px) of the one camera
export const FLOOR = 830;          // world Y of every floor / ground
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---------------------------------------------------------------- camera
export function camZ(cam) { return -FCAM / cam.k; }
export function P(cam, X, Y, Z = 0) {
  const d = Z - camZ(cam); if (d < 8) return null;
  const s = FCAM / d, h = cam.h ?? cam.y;
  return [W / 2 + (X - cam.x) * s, H / 2 + (Y - h) * s + cam.k * (h - cam.y), s];
}
export function plane(ctx, cam, fn) { ctx.save(); ctx.translate(W / 2 - cam.x * cam.k, H / 2 - cam.y * cam.k); ctx.scale(cam.k, cam.k); fn(ctx); ctx.restore(); }
// keyframed camera: keys [{ t, x, y, k, h, e }] (e = easing INTO this key: 'qio' (default) | 'sine' | 'lin' | 'eout' | fn); k in log space
const EASE = { qio, sine: (x) => .5 - .5 * Math.cos(Math.PI * clamp(x)), lin: (x) => clamp(x), eout: (x) => eoutX(x), eio: (x) => eio(clamp(x)) };
export function camAt(keys, t) {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i]; if (t > b.t) continue;
    const e = typeof b.e === 'function' ? b.e : EASE[b.e || 'qio'], u = e((t - a.t) / (b.t - a.t));
    const ha = a.h ?? a.y, hb = b.h ?? b.y;
    return { x: mix(a.x, b.x, u), y: mix(a.y, b.y, u), k: Math.exp(mix(Math.log(a.k), Math.log(b.k), u)), h: mix(ha, hb, u) };
  }
  return { ...keys[keys.length - 1] };
}

// ---------------------------------------------------------------- the knot over a head: a ball of gold threads
// A ball of N loops (radius r world units at X,Y on the plane) turning slowly. Seen from far it is a small glowing knot; as the camera
// comes within r (k > FCAM / r) we are inside it: the loops sweep past and run into the depth toward the bright core.
const BALLS = new Map();
function ballGeom(seed, n) {
  const key = seed + ':' + n; if (BALLS.has(key)) return BALLS.get(key);
  const r = prng(seed * 31 + 7), L = [];
  for (let i = 0; i < n; i++) {
    // a loop: a tilted circle (normal vector), a radius, a small centre offset, a wobble
    const th = r() * TAU, ph = Math.acos(2 * r() - 1), nx = Math.sin(ph) * Math.cos(th), ny = Math.sin(ph) * Math.sin(th), nz = Math.cos(ph);
    // two unit vectors in the loop plane
    let ax = -ny, ay = nx, az = 0; const al = Math.hypot(ax, ay) || 1; ax /= al; ay /= al;
    const bx = ny * az - nz * ay, by = nz * ax - nx * az, bz = nx * ay - ny * ax;
    L.push({ ax, ay, az, bx, by, bz, rad: .55 + .45 * r(), off: [(r() - .5) * .25, (r() - .5) * .25, (r() - .5) * .25], wob: r() * TAU, wf: 2 + Math.floor(r() * 3), br: .55 + .45 * r(), sp: (r() - .5) * .6 });
  }
  BALLS.set(key, L); return L;
}
export function threadBall(ctx, t, cam, X, Y, o = {}) {
  const r = o.r ?? 16, seed = o.seed ?? 1, n = o.n ?? 11, A = o.a ?? 1, glowA = o.glow ?? 1;
  const c = P(cam, X, Y, 0); if (!c) return null;
  const D = -camZ(cam), sc = c[2];   // distance of the camera to the plane (= to the ball centre)
  if (c[0] < -r * sc * 4 - 200 || c[0] > W + r * sc * 4 + 200 || c[1] < -r * sc * 4 - 200 || c[1] > H + r * sc * 4 + 200) return { x: c[0], y: c[1], s: sc };
  const L = ballGeom(seed, n), rot = t * (o.spin ?? .35) + seed, cr = Math.cos(rot), sr = Math.sin(rot), tilt = .35, ct = Math.cos(tilt), st = Math.sin(tilt);
  const near = Math.max(.6, D * .02);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // the warm core light (the ball glows from inside)
  const insideK = clamp((D / r - .3) / 1.2);   // inside the ball its core light is a point ahead, not a wash over everything
  if (glowA > 0) {
    const coreR = Math.min(2600, r * sc * 2.4) * mix(.12, 1, insideK);
    const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], coreR);
    g.addColorStop(0, rgba(F8.goldCore, .55 * glowA * A)); g.addColorStop(.25, rgba(F8.gold, .22 * glowA * A)); g.addColorStop(1, rgba(F8.goldDeep, 0));
    ctx.fillStyle = g; ctx.fillRect(c[0] - coreR, c[1] - coreR, coreR * 2, coreR * 2);
  }
  const inside = D < r * 1.15, lwk = Math.min(1, sc * .5);
  for (let li = 0; li < L.length; li++) {
    const l = L[li], N = inside ? 120 : 48, rad = r * l.rad, pts = [];
    const sp = rot * (1 + l.sp);
    for (let k = 0; k <= N; k++) {
      const q = k / N * TAU, w = 1 + .08 * Math.sin(q * l.wf + l.wob + t * .8);
      let px = (l.ax * Math.cos(q) + l.bx * Math.sin(q)) * rad * w + l.off[0] * r, py = (l.ay * Math.cos(q) + l.by * Math.sin(q)) * rad * w + l.off[1] * r, pz = (l.az * Math.cos(q) + l.bz * Math.sin(q)) * rad * w + l.off[2] * r;
      // spin about the vertical, then a fixed tilt
      const cs = Math.cos(sp), sn = Math.sin(sp); [px, pz] = [px * cs - pz * sn, px * sn + pz * cs]; [py, pz] = [py * ct - pz * st, py * st + pz * ct];
      const d = D + pz; if (d < near) { pts.push(null); continue; }
      const s = FCAM / d; pts.push([c[0] + px * s, c[1] + py * s, d]);
    }
    const br = l.br * A;
    // three passes: wide glow, gold body, white core (thicker the nearer)
    for (const [wmul, al, col] of [[4.5, .06, F8.gold], [1.7, .34, F8.gold], [.6, .85, F8.goldCore]]) {
      ctx.strokeStyle = rgba(col, al * br);
      let started = false; ctx.beginPath();
      for (let k = 0; k < pts.length; k++) {
        const p = pts[k]; if (!p) { started = false; continue; }
        if (!started) { ctx.moveTo(p[0], p[1]); started = true; } else ctx.lineTo(p[0], p[1]);
      }
      // width by depth: one width per loop (the mean depth), clamped
      const md = pts.reduce((a, p) => (p ? Math.min(a, p[2]) : a), 1e9), w = clamp(FCAM / md * 1.1 * lwk, .7, 34);
      ctx.lineWidth = Math.min(w, 5) * wmul * (inside ? .8 : .8); ctx.stroke();
    }
  }
  ctx.restore();
  return { x: c[0], y: c[1], s: sc };
}

// ---------------------------------------------------------------- a woven patch from a grid of points
// pts[j][i] (rows × cols) in the current coordinate system; o: { a, seed, t, glints, lw (line width), cut: (i,j) → true to skip a node }
export function meshPatch(ctx, t, pts, o = {}) {
  const A = o.a ?? 1, rows = pts.length, cols = pts[0].length, lw = o.lw ?? 1, seed = o.seed ?? 1;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => {
    ctx.beginPath();
    for (let j = 0; j < rows; j++) { for (let i = 0; i < cols; i++) { const p = pts[j][i]; i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } }
    for (let i = 0; i < cols; i++) { for (let j = 0; j < rows; j++) { const p = pts[j][i]; j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } }
  };
  path();
  ctx.strokeStyle = rgba(F8.gold, .1 * A); ctx.lineWidth = 5 * lw; ctx.stroke();
  ctx.strokeStyle = rgba(F8.gold, .5 * A); ctx.lineWidth = 1.3 * lw; ctx.stroke();
  ctx.strokeStyle = rgba(F8.goldCore, .55 * A); ctx.lineWidth = .55 * lw; ctx.stroke();
  // glints and tiny glyphs on a few crossings
  if (o.glyphs !== false) {
    const kinds = ['meeting', 'envelope', 'check', 'cross'];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const hsh = hash(seed * 17.3 + i * 3.1 + j * 7.7); if (hsh > .22) continue;
      const p = pts[j][i], tw = .55 + .45 * Math.sin(t * (1.1 + hsh * 3) + hsh * 40);
      glyph(ctx, kinds[Math.floor(hsh * 18) % 4], p[0], p[1], .42 * lw, F8.goldCore, .75 * A * tw);
    }
  }
  ctx.restore();
}
export function gridRect(x, y, w, h, cols, rows, seed = 1, t = 0, amp = 1.2) {
  const out = [];
  for (let j = 0; j < rows; j++) { const row = []; for (let i = 0; i < cols; i++) { const hx = hash(seed + i * 1.7 + j * 5.3), hy = hash(seed * 2 + i * 4.1 + j * 2.9);
    row.push([x + w * i / (cols - 1) + (hx - .5) * 4 + amp * Math.sin(t * .9 + hx * 9), y + h * j / (rows - 1) + (hy - .5) * 4 + amp * Math.sin(t * .7 + hy * 9)]); } out.push(row); }
  return out;
}

// ---------------------------------------------------------------- houses (plane coords, Z = 0)
// engraved structure: a slab or wall piece = dark fill + pale engraved edge + hatch
const INK = '#07081a', WALL = '#141634', EDGE = '#8b84c4';
function slab(ctx, x, y, w, h, o = {}) {
  ctx.fillStyle = o.fill || WALL; ctx.fillRect(x, y, w, h);
  hatch(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], -.9, 4.2, .35, { col: '#000000', w: .8, wobble: .3, seed: Math.round(x * 3 + y) });
  ctx.strokeStyle = rgba(o.edge || EDGE, o.edgeA ?? .55); ctx.lineWidth = 1.1; ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
}
// a room's back wall: deep warm-violet, lit by its own light (the knot) from (lx, ly) with strength a
function roomWall(ctx, x, y, w, h, lx, ly, a, seed) {
  ctx.fillStyle = '#0d0c22'; ctx.fillRect(x, y, w, h);
  if (a > 0) {
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * .85);
    g.addColorStop(0, rgba('#6e5a36', .55 * a)); g.addColorStop(.45, rgba('#3a2e3e', .35 * a)); g.addColorStop(1, 'rgba(13,12,34,0)');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  }
  // plaster: fine engraved hatch, denser in the corners (shadow)
  hatch(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], -.86, 6, .22, { col: '#000000', w: .7, wobble: .5, seed });
  // the floor line and a skirting board
  ctx.fillStyle = '#0a0918'; ctx.fillRect(x, y + h - 6, w, 6);
  ctx.strokeStyle = rgba('#6f6aa8', .25); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + h - 6.5); ctx.lineTo(x + w, y + h - 6.5); ctx.stroke();
}
// the open archway in a side wall (a passage, no door leaf)
function arch(ctx, x, w, yTop, yBot) {
  ctx.fillStyle = '#05060f'; ctx.beginPath(); ctx.moveTo(x, yBot); ctx.lineTo(x, yTop + w * .5); ctx.quadraticCurveTo(x + w / 2, yTop - w * .2, x + w, yTop + w * .5); ctx.lineTo(x + w, yBot); ctx.closePath(); ctx.fill();
}
function roof(ctx, x0, x1, yBase, apex, t, seed) {
  const cx = (x0 + x1) / 2, pts = [[x0 - 26, yBase], [cx, apex], [x1 + 26, yBase]];
  ctx.fillStyle = '#10112c'; ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...pts[2]); ctx.closePath(); ctx.fill();
  // tiles: engraved rows
  ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#000000', .45); ctx.lineWidth = .9;
  ctx.beginPath(); for (let y = apex + 8; y < yBase; y += 9) { ctx.moveTo(x0 - 30, y); ctx.lineTo(x1 + 30, y); } ctx.stroke();
  ctx.strokeStyle = rgba('#000000', .3); ctx.beginPath(); for (let y = apex + 8, r = 0; y < yBase; y += 9, r++) for (let x = x0 - 30 + (r % 2) * 9; x < x1 + 30; x += 18) { ctx.moveTo(x, y); ctx.lineTo(x, y + 9); } ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = rgba(EDGE, .6); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...pts[2]); ctx.stroke();
  // the cut edge of the roof (cross-section): a pale engraved line under the eaves
  ctx.strokeStyle = rgba('#c9b98f', .25); ctx.beginPath(); ctx.moveTo(x0 - 20, yBase - 2); ctx.lineTo(x1 + 20, yBase - 2); ctx.stroke();
}
// the ground: dark earth from the house out into the night, engraved grass ticks
export function ground(ctx, t, x0, x1) {
  const y = FLOOR;
  const g = ctx.createLinearGradient(0, y, 0, y + 260); g.addColorStop(0, '#0d0f2a'); g.addColorStop(1, '#05060f');
  ctx.fillStyle = g; ctx.fillRect(x0, y, x1 - x0, 400);
  ctx.strokeStyle = rgba('#7a74b8', .35); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x0, y + .5); ctx.lineTo(x1, y + .5); ctx.stroke();
  const r = prng(61); ctx.strokeStyle = rgba('#6f6aa8', .22); ctx.lineWidth = 1; ctx.beginPath();
  for (let i = 0; i < 260; i++) { const x = x0 + r() * (x1 - x0), yy = y + 4 + r() * r() * 120, L = 3 + r() * 6, sw = Math.sin(t * .8 + i) * 1.2; ctx.moveTo(x, yy); ctx.lineTo(x + sw + 1, yy - L); } ctx.stroke();
}

// layout of the ordinary house: 3 storeys × 3 rooms
export const OLD = (() => {
  const x0 = 300, x1 = 1140, wt = 16, iw = 10, sh = 200, slabT = 14, floors = [FLOOR, FLOOR - sh, FLOOR - 2 * sh];
  const rw = (x1 - x0 - 2 * wt - 2 * iw) / 3, rooms = [];
  for (let f = 0; f < 3; f++) for (let r = 0; r < 3; r++) { const rx = x0 + wt + r * (rw + iw); rooms.push({ f, r, x: rx, w: rw, y: floors[f] - sh + slabT, h: sh - slabT, floor: floors[f] }); }
  return { x0, x1, wt, sh, slabT, floors, rooms, top: FLOOR - 3 * sh, apex: FLOOR - 3 * sh - 120, arch: { x: x1 - wt, w: wt, top: FLOOR - 128 } };
})();
// the A.I.-native house: one tall hall, the great weave on its back wall
export const NEW = { x0: 420, x1: 1020, wt: 16, top: 460, slabT: 14, apex: 360, inner: { x: 436, y: 474, w: 568, h: FLOOR - 474 }, arch: { x: 1004, w: 16, top: FLOOR - 128 } };
// the great weave (kit weave rect, plane coords). Inside the new house we see its lower middle; pulled back it is a tapestry of light.
export const TAP = { x: -700, y: -400, w: 2840, h: 1160, cols: 64, rows: 26, depth: 3, seed: 8 };   // bottom edge y 760, centre x 720

export function oldHouseShell(ctx, t, S) {
  const H0 = OLD;
  roof(ctx, H0.x0, H0.x1, H0.top, H0.apex, t, 3);
  // back walls of the rooms, lit by their knots
  for (const rm of H0.rooms) { const L = S.roomLight(rm); roomWall(ctx, rm.x, rm.y, rm.w, rm.h, L.x, L.y, L.a, rm.f * 3 + rm.r + 1); }
}
export function oldHouseFront(ctx, t, S) {
  const H0 = OLD;
  // slabs (floors, ceilings) and walls as engraved cross-sections, drawn after the rooms' contents so they frame them
  for (let f = 0; f < 3; f++) slab(ctx, H0.x0, H0.floors[f] - H0.sh, H0.x1 - H0.x0, H0.slabT);
  slab(ctx, H0.x0 - 6, FLOOR, H0.x1 - H0.x0 + 12, 12, { fill: '#0b0c22' });
  slab(ctx, H0.x0, H0.top, H0.wt, FLOOR - H0.top); slab(ctx, H0.x1 - H0.wt, H0.top, H0.wt, FLOOR - H0.top);
  for (let f = 0; f < 3; f++) for (let r = 1; r < 3; r++) { const rm = H0.rooms[f * 3 + r]; slab(ctx, rm.x - 10, rm.y, 10, rm.h); }
  arch(ctx, H0.arch.x, H0.arch.w, H0.arch.top, FLOOR);
}
export function newHouseShell(ctx, t) {
  const N = NEW; roof(ctx, N.x0, N.x1, N.top, N.apex, t, 5);
  ctx.fillStyle = '#0b0c22'; ctx.fillRect(N.inner.x, N.inner.y, N.inner.w, N.inner.h);
}
export function newHouseFront(ctx, t) {
  const N = NEW;
  slab(ctx, N.x0, N.top, N.x1 - N.x0, N.slabT); slab(ctx, N.x0 - 6, FLOOR, N.x1 - N.x0 + 12, 12, { fill: '#0b0c22' });
  slab(ctx, N.x0, N.top, N.wt, FLOOR - N.top); slab(ctx, N.x1 - N.wt, N.top, N.wt, FLOOR - N.top);
  arch(ctx, N.arch.x, N.arch.w, N.arch.top, FLOOR);
}

// ---------------------------------------------------------------- the hall (after the push into the weave): back wall + floor
// the back wall is the same dark as the new house's inner wall, so the house can be gone while the weave fills the frame
export function hallWall(ctx, cam) {
  ctx.fillStyle = '#0b0c22'; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, H * .38, 0, W / 2, H * .38, W * .8); g.addColorStop(0, 'rgba(60,48,40,.28)'); g.addColorStop(1, 'rgba(5,6,15,.35)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
export function hallFloor(ctx, t, cam, o = {}) {
  const A = o.a ?? 1, zFar = 0, zNear = camZ(cam) + 60;
  const f0 = P(cam, cam.x, FLOOR, zFar); if (!f0) return;
  const yH = f0[1]; if (yH > H) return;
  // floor fill
  const g = ctx.createLinearGradient(0, yH, 0, H); g.addColorStop(0, '#120f26'); g.addColorStop(1, '#05050e');
  ctx.fillStyle = g; ctx.fillRect(0, yH, W, H - yH);
  // the light pool of the weave on the floor (an ellipse in perspective)
  const pc = P(cam, 720, FLOOR, -260);
  if (pc) { const rx = 1500 * pc[2], ry = 300 * pc[2]; ctx.save(); ctx.translate(pc[0], pc[1]); ctx.scale(1, ry / rx); const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    lg.addColorStop(0, rgba('#8a6a34', .36 * A * (o.pool ?? 1))); lg.addColorStop(.5, rgba('#5a4430', .14 * A * (o.pool ?? 1))); lg.addColorStop(1, 'rgba(20,16,30,0)'); ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore(); }
  // boards: lines running toward the weave (along Z), and joints across
  ctx.save(); ctx.beginPath(); ctx.rect(0, yH, W, H - yH); ctx.clip(); ctx.lineCap = 'round';
  ctx.strokeStyle = rgba('#8b84c4', .13 * A); ctx.lineWidth = 1; ctx.beginPath();
  for (let X = -3000; X <= 4400; X += 110) { const a = P(cam, X, FLOOR, zFar), b = P(cam, X, FLOOR, Math.max(zNear, -6000)); if (!a || !b) continue; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();
  ctx.strokeStyle = rgba('#000000', .45); ctx.beginPath();
  for (let Z = -40; Z > Math.max(zNear, -6000); Z -= 160) { const a = P(cam, -3000, FLOOR, Z), b = P(cam, 4400, FLOOR, Z); if (!a || !b) continue; ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
  ctx.stroke();
  // a sheen of the weave light on the near boards (stippled)
  if (pc) { const r = prng(5); ctx.fillStyle = rgba('#f3d9a0', .09 * A * (o.pool ?? 1)); for (let i = 0; i < 700; i++) { const u = (r() - .5) * 2, v = r(); const X = 720 + u * 1700, Z = -60 - v * 1800, p = P(cam, X, FLOOR, Z); if (!p) continue; if (r() > (1 - Math.abs(u)) * (1 - v) * 1.4) continue; ctx.fillRect(p[0], p[1], 1.4, 1.4); } }
  ctx.restore();
  // the edge where floor meets the back wall
  ctx.strokeStyle = rgba('#8b84c4', .25 * A); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, yH); ctx.lineTo(W, yH); ctx.stroke();
}
// two rows of plain pillars along the hall (left and right of the weave), so the hall reads as a room
export function hallPillars(ctx, t, cam, o = {}) {
  const A = o.a ?? 1, list = [];
  for (const X of [-1150, 2590]) for (let Z = 0; Z > -4200; Z -= 700) list.push([X, Z]);
  list.sort((a, b) => b[1] - a[1]);
  for (const [X, Z] of list) {
    const b = P(cam, X, FLOOR, Z), top = P(cam, X, -900, Z); if (!b || !top) continue;
    const w = 90 * b[2]; if (b[0] + w < -10 || b[0] - w > W + 10) continue;
    const side = X < 720 ? 1 : -1;
    ctx.fillStyle = '#0a0b1e'; ctx.fillRect(b[0] - w / 2, top[1], w, b[1] - top[1]);
    hatch(ctx, [[b[0] - w / 2, top[1]], [b[0] + w / 2, top[1]], [b[0] + w / 2, b[1]], [b[0] - w / 2, b[1]]], -.9, Math.max(2.5, 5 * b[2]), .4, { col: '#000000', w: .8, seed: Math.round(Z) });
    // the edge toward the weave catches its light
    ctx.strokeStyle = rgba('#d9b880', .22 * A); ctx.lineWidth = Math.max(1, 1.6 * b[2]); ctx.beginPath(); ctx.moveTo(b[0] + side * w / 2, top[1]); ctx.lineTo(b[0] + side * w / 2, b[1]); ctx.stroke();
  }
}

// ---------------------------------------------------------------- the plaque under the weave
export function plaque(ctx, t, cam, o = {}) {
  const X = 720, Z = -300, Yc = 724, pw = 440, ph = 124;
  const c = P(cam, X, Yc, Z), foot = P(cam, X, FLOOR, Z); if (!c || !foot) return null;
  const s = c[2], w = pw * s, h = ph * s, x = c[0] - w / 2, y = c[1] - h / 2;
  // the post
  ctx.fillStyle = '#0c0b1c'; ctx.fillRect(c[0] - 14 * s, y + h, 28 * s, foot[1] - y - h);
  ctx.strokeStyle = rgba('#d9b880', .25); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(c[0] - 14 * s, y + h); ctx.lineTo(c[0] - 14 * s, foot[1]); ctx.stroke();
  // brass plate with bevel, engraved border, catching the weave's light from above
  const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#a88a50'); g.addColorStop(.5, '#7a6034'); g.addColorStop(1, '#4e3a1e');
  ctx.fillStyle = '#3a2a14'; ctx.fillRect(x - 3 * s, y - 3 * s, w + 6 * s, h + 6 * s);
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  hatch(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], -.3, Math.max(2, 3.2 * s), .12, { col: '#3a2a14', w: .6, seed: 3 });
  ctx.strokeStyle = rgba('#2e200e', .7); ctx.lineWidth = Math.max(1, 2 * s); ctx.strokeRect(x + 10 * s, y + 10 * s, w - 20 * s, h - 20 * s);
  ctx.strokeStyle = rgba('#fff1cc', .45); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + .5); ctx.lineTo(x + w, y + .5); ctx.stroke();
  // a slow glint wandering across the brass
  const gx = x + w * ((t * .12) % 1.6 - .3); const gl = ctx.createLinearGradient(gx - 60 * s, 0, gx + 60 * s, 0); gl.addColorStop(0, 'rgba(255,240,200,0)'); gl.addColorStop(.5, 'rgba(255,240,200,.18)'); gl.addColorStop(1, 'rgba(255,240,200,0)');
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = gl; ctx.fillRect(x, y, w, h); ctx.restore();
  // the engraving: pressed in letter by letter (a mask from the left), dark cut + light lower edge
  const u = clamp(o.u ?? 1);
  if (u > 0) {
    const fs = 40 * s, fs2 = 25 * s;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * u, h); ctx.clip();
    for (const [dy, col] of [[1.4, 'rgba(255,236,190,.55)'], [0, '#2a1c0a']]) {
      text(ctx, '“COMPANY BRAIN”', c[0], c[1] - h * .06 + dy * s, { size: fs, font: 'Inter', weight: 600, color: col, align: 'center', spacing: 5 * s });
    }
    ctx.restore();
    const u2 = clamp(o.u2 ?? u);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w * u2, h); ctx.clip();
    for (const [dy, col] of [[1.1, 'rgba(255,236,190,.5)'], [0, '#3a2a12']]) text(ctx, 'SILICON VALLEY', c[0], c[1] + h * .3 + dy * s, { size: fs2, font: 'Inter', weight: 600, color: col, align: 'center', spacing: 6 * s });
    ctx.restore();
  }
  return { x, y, w, h, s };
}

// ---------------------------------------------------------------- a meeting on the floor: people sitting in a circle
// m = { X, Z, n, r, seed }; o = { lit 0..1 (the circle lights), thread 0..1 (its thread rises), to [X,Y,Z] (where the thread goes), t }
const DRESS = ['#2c3450', '#3a3046', '#28384a', '#40364a', '#2a2e44', '#3a3a50'];
export function meetingRing(ctx, t, cam, m, o = {}) {
  const c = P(cam, m.X, FLOOR, m.Z); if (!c) return;
  const lit = clamp(o.lit ?? 0), R = m.r ?? 120, thA = o.threadA ?? 1;
  // the ring on the floor (an ellipse in perspective): engraved, then lit
  const e = []; for (let k = 0; k <= 48; k++) { const q = k / 48 * TAU, p = P(cam, m.X + Math.cos(q) * R, FLOOR, m.Z + Math.sin(q) * R); if (p) e.push(p); }
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = rgba('#8b84c4', .25); ctx.lineWidth = Math.max(.8, 1.4 * c[2]); ctx.beginPath(); e.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  // the centre light: a small warm point that the meeting gathers around; lit → it flares gold
  const cr = 120 * c[2] * (1 + 1.4 * lit);
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], cr); g.addColorStop(0, rgba(F8.goldCore, .25 + .6 * lit)); g.addColorStop(.3, rgba(F8.gold, .1 + .25 * lit)); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(1, .55); ctx.translate(-c[0], -c[1]); ctx.fillStyle = g; ctx.fillRect(c[0] - cr, c[1] - cr, cr * 2, cr * 2); ctx.restore();
  if (lit > 0) { ctx.strokeStyle = rgba(F8.gold, .55 * lit); ctx.lineWidth = Math.max(1, 2 * c[2]); ctx.beginPath(); e.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
  ctx.restore();
  // the people: seated, in profile, facing the centre (far ones first)
  const n = m.n ?? 5, seats = [];
  for (let i = 0; i < n; i++) { const q = (i / n) * TAU + (m.seed || 0) * .7 + .3; seats.push({ q, X: m.X + Math.cos(q) * R * .92, Z: m.Z + Math.sin(q) * R * .92, i }); }
  seats.sort((a, b) => b.Z - a.Z);
  for (const st of seats) {
    const p = P(cam, st.X, FLOOR, st.Z); if (!p) continue;
    const s = .68 * p[2], hipY = p[1] - 48 * s, flip = Math.cos(st.q) > 0;   // on the right of the circle: face left
    figureFlat(ctx, p[0], hipY, s, POSES.sit, { t, seed: (m.seed || 1) * 10 + st.i, col: '#0e0f26', rim: lit > .05 ? '#f3d9a0' : '#5a5490', shade: 1 - .5 * (o.dark ?? 0), rimSide: flip ? -1 : 1, flip, accent: DRESS[(st.i + (m.seed || 0)) % 6], accentPart: 'sweater', fast: true, shadow: false });
    // the stool (a small dark block)
    ctx.fillStyle = '#08081a'; ctx.fillRect(p[0] - 9 * s, hipY + 4 * s, 18 * s, 44 * s);
  }
  // the thread rising from the centre into the weave (a 3D curve, drawn up to its head)
  const th = clamp(o.thread ?? 0);
  if (th > 0 && o.to) {
    const [tx, ty, tz] = o.to, N = 40, pts = [];
    for (let k = 0; k <= N; k++) {
      const q = k / N * th, X = mix(m.X, tx, sm(clamp((q - .35) / .65))), Y = mix(FLOOR - 10, ty, q < .6 ? q / .6 * .8 : .8 + .2 * (q - .6) / .4), Z = mix(m.Z, tz, sm(clamp((q - .25) / .75)));
      const pp = P(cam, X, Y, Z); if (pp) pts.push(pp);
    }
    if (pts.length > 1) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (const [w, a, col] of [[7, .08, F8.gold], [2.4, .4, F8.gold], [1, .9, F8.goldCore]]) { ctx.strokeStyle = rgba(col, a * thA); ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
      const hd = pts[pts.length - 1]; if (th < 1) { const hg = ctx.createRadialGradient(hd[0], hd[1], 0, hd[0], hd[1], 22); hg.addColorStop(0, rgba(F8.goldCore, .9)); hg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = hg; ctx.fillRect(hd[0] - 22, hd[1] - 22, 44, 44); }
      ctx.restore();
    }
  }
}

// ---------------------------------------------------------------- the name label (lower third, above y 900; mask reveals only)
// o = { x, y (name baseline), name, role, u (0..1 reveal), strike 0..1, nu 0..1 (new line), newRole, source, su 0..1 }
export function nameLabel(ctx, t, o = {}) {
  const x = o.x ?? 120, y = o.y ?? 800, u = clamp(o.u ?? 1); if (u <= 0) return;
  ctx.save(); ctx.font = '46px "Instrument Serif"'; const nw = ctx.measureText(o.name).width; ctx.font = '600 19px "Inter"'; const rw = ctx.measureText(o.role).width + o.role.length * 4.2; ctx.restore();
  const wmax = Math.max(nw, rw) + 30;
  // the engraved rule under the name, drawn by a gold point
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F8.gold, .75); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y + 14); ctx.lineTo(x + wmax * eoutX(u), y + 14); ctx.stroke();
  if (u < 1) { const hx = x + wmax * eoutX(u), g = ctx.createRadialGradient(hx, y + 14, 0, hx, y + 14, 16); g.addColorStop(0, rgba(F8.goldCore, .9)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(hx - 16, y - 2, 32, 32); }
  ctx.restore();
  const tu = clamp((u - .2) / .8);
  // the label is printed on a small dark card (it sits over the lit floor): revealed by the same mask as its text
  { const cw = wmax + 60, ch = 104 + 74 * eoutX(clamp((o.nu ?? 0) * 1.4)); ctx.save(); ctx.beginPath(); ctx.rect(x - 30, y - 62, cw * eoutX(u), ch + 20); ctx.clip();
    ctx.fillStyle = '#080918'; ctx.fillRect(x - 30, y - 62, cw, ch + 20); hatch(ctx, [[x - 30, y - 62], [x - 30 + cw, y - 62], [x - 30 + cw, y - 42 + ch], [x - 30, y - 42 + ch]], -.9, 5, .25, { col: '#000000', w: .7, seed: 9 });
    ctx.strokeStyle = rgba('#8b84c4', .3); ctx.lineWidth = 1; ctx.strokeRect(x - 29.5, y - 61.5, cw - 1, ch + 19); ctx.restore(); }
  ctx.save(); ctx.beginPath(); ctx.rect(x - 6, y - 50, (wmax + 12) * tu, 130); ctx.clip();
  text(ctx, o.name, x, y, { size: 46, font: 'Instrument Serif', color: '#f3ecda' });
  text(ctx, o.role, x, y + 44, { size: 19, weight: 600, color: rgba('#e9dcc0', .9), spacing: 4.2 });
  ctx.restore();
  // strike-through the old role (a fine engraved line drawn from the left)
  const sk = clamp(o.strike ?? 0);
  if (sk > 0) { ctx.save(); ctx.strokeStyle = rgba('#f3d9a0', .95); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 4, y + 37); ctx.lineTo(x - 4 + (rw + 8) * eoutX(sk), y + 37); ctx.stroke(); ctx.restore(); }
  const nu = clamp(o.nu ?? 0);
  if (nu > 0 && o.newRole) {
    ctx.save(); ctx.font = '600 22px "Inter"'; const nw2 = ctx.measureText(o.newRole).width + o.newRole.length * 4.5; ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(x - 6, y + 50, (nw2 + 12) * eoutX(nu), 48); ctx.clip();
    text(ctx, o.newRole, x, y + 82, { size: 22, weight: 600, color: '#f3ecda', spacing: 4.5 }); ctx.restore();
  }
  const su = clamp(o.su ?? 0);
  if (su > 0 && o.source) { ctx.save(); ctx.beginPath(); ctx.rect(x - 6, y + 92, 900 * eoutX(su), 30); ctx.clip(); text(ctx, o.source, x, y + 110, { size: 14, weight: 500, color: rgba('#cfc6e8', .7), spacing: 3 }); ctx.restore(); }
}

// ---------------------------------------------------------------- a handoff plate as an in-world light
// u = 0: the frame IS the plate (identity). u → 1: the light shrinks into the point `at` (screen) and its edge falls off inside the
// plate's own colours, so what remains is the glow of an object (the knot's core, the firefly). o.r1: radius of the opaque core at u=1.
const PLC = { c: null, g: null };
export function glowFrom(ctx, t, plateFn, u, at, o = {}) {
  u = clamp(u); if (!PLC.c) [PLC.c, PLC.g] = canvas(W, H);
  const c = PLC.c, g = PLC.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, W, H);
  plateFn(g, t);
  const tt = t + TSHIFT, pcx = W / 2 + 18 * drift(tt, 1, 3), pcy = H / 2 + 12 * drift(tt, 1, 7);
  // phase A (u 0…a): the light's edge contracts inside the plate (no transform) until the whole lit disc sits inside the canvas;
  // phase B (u a…1): the disc shrinks and travels to `at` (the object whose glow it is)
  const a = o.a ?? .38, uA = sm(clamp(u / a)), uB = clamp((u - a) / (1 - a));
  if (u > 0) {
    const R1 = mix(1180, o.core ?? 260, uA), R2 = mix(1210, o.edge ?? 520, uA);
    g.globalCompositeOperation = 'destination-in';
    const rg = g.createRadialGradient(pcx, pcy, 0, pcx, pcy, R2); rg.addColorStop(0, 'rgba(0,0,0,1)'); rg.addColorStop(R1 / R2, 'rgba(0,0,0,1)');
    rg.addColorStop(R1 / R2 + (1 - R1 / R2) * .4, 'rgba(0,0,0,.4)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
  }
  const eB = .5 - .5 * Math.cos(Math.PI * uB), k = Math.exp(mix(0, Math.log(o.kMin ?? .06), eB)), tx = mix(pcx, at[0], eB), ty = mix(pcy, at[1], eB);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (u === 0) ctx.drawImage(c, 0, 0);
  else { ctx.translate(tx, ty); ctx.scale(k, k); ctx.translate(-pcx, -pcy); ctx.drawImage(c, 0, 0); }
  ctx.restore();
  return { k, x: tx, y: ty };
}
