// Film 4 v2 · c10 · the family's house and garden (10.01–10.03), one 3D set in metres (X right, Y up, Z into the garden):
// the front window at Z = 0 (the hill's 'family' window), the room Z 0 → 3.2, the open garden door, the garden Z 3.2 → 17,
// the back wall with the gate at Z = 17, beyond it the lane (lib/v2_c10_lane.mjs) and its houses.
//   roomGarden(ctx, C, t, E)   everything of this set seen from camera C (E = light/time state from lib/v2_c10_town.mjs)
//   G                          the set's geometry (shared with the lane and the camera path)
import { W, H, rgba, clamp, mix, prng, mixHex, shade, TAU, poly3, fill3, seg3, line3, hatchQuad, at3, box3, painter, radial, glowImg, glowAt, smr, sm2, hash, eoX, qio, trace, proj3 } from './v2_c10_kit.mjs';
import { person, kid, POSES, reachArm, jointAt, U, castShadow } from './v2_c10_people.mjs';

export const G = {
  win: { x: 0, y: 1.5, w: 1.0, h: 1.5 },
  room: { x0: -2.4, x1: 2.4, y1: 2.6, z1: 3.2 },
  door: { x0: -.8, x1: .8, y1: 2.25 },
  gy: -.3, wallZ: 17, wallH: 2.15, northZ: 23,
  gate: { x0: 2.8, x1: 4.0, y1: 1.62 },
  tree: { x: -3.5, z: 13.4 },
  dad: [-1.3, 11.9], you: [.22, 12.1], mum: [.66, 12.32], rose: [1.25, 12.75], basket: [-.42, 11.6],
};
const GY = G.gy;

// ---------------------------------------------------------------- seasons (s: 0 spring blossom, 1 summer, 2 autumn, 3 winter, 4 spring)
const SEAS = [
  // leaf amount, leaf colour, blossom, ground, apples (0 none, .5 green, 1 red), snow
  { leaf: .55, lc: '#a6c06a', bl: 1, gr: '#7d9a4c', ap: 0, sn: 0 },
  { leaf: 1, lc: '#5d8a3c', bl: 0, gr: '#6e8c3e', ap: .5, sn: 0 },
  { leaf: .75, lc: '#d07a2c', bl: 0, gr: '#8f7d3e', ap: 1, sn: 0 },
  { leaf: 0, lc: '#8a5a2a', bl: 0, gr: '#e6ecf3', ap: 0, sn: 1 },
  { leaf: .55, lc: '#a6c06a', bl: 1, gr: '#7d9a4c', ap: 0, sn: 0 },
];
export function season(s) {
  const i = Math.max(0, Math.min(3, Math.floor(s))), u = sm2(clamp(s - i)), a = SEAS[i], b = SEAS[i + 1];
  // winter's snow comes late and leaves early (it falls, lies, melts), the leaves go before it
  const o = {}; for (const k in a) o[k] = typeof a[k] === 'string' ? mixHex(a[k], b[k], u) : mix(a[k], b[k], u);
  o.s = s; o.fallLeaves = clamp(1 - Math.abs(s - 2.35) / .45); o.fallSnow = clamp(1 - Math.abs(s - 3.0) / .45); o.petals = clamp(1 - s / .7) + clamp((s - 3.5) / .5);
  o.motes = clamp(1 - Math.abs(s - 1.2) / .9);
  return o;
}

// ---------------------------------------------------------------- the house: room and front wall
const WALL = '#e3c9a2', WALLD = '#a9876a', FLOOR = '#7a4e30', CEIL = '#d8bc96';
function room(ctx, C, t, E, L) {
  const R = G.room, D = G.door, lamp = E.lamp ?? 1;
  const lit = (c, k) => mixHex(shade(c, -.25), c, clamp(k));
  // back wall with the open door (even-odd hole), lit by the lamp from the right
  const back = [[R.x0, 0, R.z1], [R.x1, 0, R.z1], [R.x1, R.y1, R.z1], [R.x0, R.y1, R.z1]], hole = [[D.x0, 0, R.z1], [D.x0, D.y1, R.z1], [D.x1, D.y1, R.z1], [D.x1, 0, R.z1]];
  const S1 = proj3(C, back), S2 = proj3(C, hole);
  if (S1) { ctx.beginPath(); trace(ctx, S1); if (S2) trace(ctx, S2); const g = ctx.createLinearGradient(S1[0][0], 0, S1[1][0], 0); g.addColorStop(0, shade(WALL, -.2)); g.addColorStop(.7, WALL); g.addColorStop(1, shade(WALL, -.06)); ctx.fillStyle = g; ctx.fill('evenodd'); }
  // door frame (thick jambs), the two open leaves with their panes catching the garden light
  ctx.fillStyle = '#5a3a26';
  for (const [a, b] of [[D.x0 - .09, D.x0], [D.x1, D.x1 + .09]]) fill3(ctx, C, [[a, 0, R.z1], [b, 0, R.z1], [b, D.y1, R.z1], [a, D.y1, R.z1]], '#6a4630');
  fill3(ctx, C, [[D.x0 - .09, D.y1, R.z1], [D.x1 + .09, D.y1, R.z1], [D.x1 + .09, D.y1 + .1, R.z1], [D.x0 - .09, D.y1 + .1, R.z1]], '#6a4630');
  for (const sd of [-1, 1]) {
    // a leaf hinged at its jamb, swung out into the garden by 110°
    const hx = sd < 0 ? D.x0 : D.x1, th = 1.92, wl = .8, ex = hx - sd * Math.cos(th) * wl * -1 * -1, dirx = sd < 0 ? 1 : -1;
    const qx = hx + dirx * Math.cos(th) * wl, qz = R.z1 + Math.sin(th) * wl;
    const q = [[hx, .02, R.z1], [qx, .02, qz], [qx, D.y1 - .02, qz], [hx, D.y1 - .02, R.z1]];
    const S = fill3(ctx, C, q, '#5c3d28');
    if (S) { // panes: 2 × 4, glowing with the garden light
      for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) { const u0 = .12 + i * .41, u1 = u0 + .33, v0 = .06 + j * .23, v1 = v0 + .19, P = (u, v) => q[0].map((_, k) => mix(mix(q[0][k], q[1][k], u), mix(q[3][k], q[2][k], u), v)); fill3(ctx, C, [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)], rgba('#ffe7bd', .5 + .2 * hash(i, j))); }
    }
  }
  // floor (planks), sunlight patch through the door, rug
  const fl = [[R.x0, 0, 0], [R.x1, 0, 0], [R.x1, 0, R.z1], [R.x0, 0, R.z1]];
  if (fill3(ctx, C, fl, FLOOR)) {
    ctx.strokeStyle = 'rgba(30,14,6,.45)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = R.x0 + .18; x < R.x1; x += .18) seg3(ctx, C, [x, 0, 0], [x, 0, R.z1]); ctx.stroke();
    ctx.beginPath(); for (let i = 0; i < 26; i++) { const x = R.x0 + .18 * Math.floor(hash(i, 3) * 26), z = hash(i, 5) * R.z1; seg3(ctx, C, [x, 0, z], [x + .18, 0, z]); } ctx.stroke();
    const sp = [[D.x0 + .1, .001, R.z1], [D.x1 + .1, .001, R.z1], [D.x1 - .9, .001, R.z1 - 2.2], [D.x0 - 1.0, .001, R.z1 - 2.2]];
    const S = poly3(ctx, C, sp); if (S) { ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = rgba('#ffcf8a', .42 * lamp); ctx.fill(); ctx.restore(); }
    fill3(ctx, C, [[-1.5, .004, .5], [.9, .004, .5], [.9, .004, 2.3], [-1.5, .004, 2.3]], '#8a3a2c');
    const S3 = poly3(ctx, C, [[-1.35, .006, .65], [.75, .006, .65], [.75, .006, 2.15], [-1.35, .006, 2.15]]); if (S3) { ctx.strokeStyle = rgba('#e8b07a', .55); ctx.lineWidth = 1.2; ctx.stroke(); }
  }
  // ceiling, side walls (hatched toward the corners), a beam
  fill3(ctx, C, [[R.x0, R.y1, 0], [R.x0, R.y1, R.z1], [R.x1, R.y1, R.z1], [R.x1, R.y1, 0]], CEIL);
  for (let z = .6; z < R.z1; z += 1.1) box3(ctx, C, R.x0, R.y1 - .14, z, R.x1, R.y1, z + .16, (f) => (f === 'y0' ? '#5a3a26' : '#6a4630'));
  const lw = [[R.x0, 0, 0], [R.x0, 0, R.z1], [R.x0, R.y1, R.z1], [R.x0, R.y1, 0]], rw = [[R.x1, 0, R.z1], [R.x1, 0, 0], [R.x1, R.y1, 0], [R.x1, R.y1, R.z1]];
  if (fill3(ctx, C, lw, shade(WALL, -.12))) { ctx.strokeStyle = rgba(WALLD, .35); ctx.lineWidth = .8; ctx.beginPath(); hatchQuad(ctx, C, lw, 40, .25, prng(4)); ctx.stroke(); }
  if (fill3(ctx, C, rw, shade(WALL, -.05))) { ctx.strokeStyle = rgba(WALLD, .3); ctx.lineWidth = .8; ctx.beginPath(); hatchQuad(ctx, C, rw, 34, -.25, prng(5)); ctx.stroke(); }
  // pictures on the left wall (engraved frames, warm), a shelf with jars
  for (const [z, y, w, h] of [[.9, 1.45, .5, .38], [1.6, 1.55, .32, .42], [2.2, 1.35, .46, .34]]) {
    fill3(ctx, C, [[R.x0 + .01, y, z], [R.x0 + .01, y, z + w], [R.x0 + .01, y + h, z + w], [R.x0 + .01, y + h, z]], '#4a2e1c');
    fill3(ctx, C, [[R.x0 + .015, y + .04, z + .04], [R.x0 + .015, y + .04, z + w - .04], [R.x0 + .015, y + h - .04, z + w - .04], [R.x0 + .015, y + h - .04, z + .04]], '#c8a476');
  }
  // the table on the right with a lamp (the room's own warm light), a bowl of apples
  const P = painter();
  P.add(C.z < 1.6 ? 9 : 1, () => {
    box3(ctx, C, 1.1, .72, .9, 2.2, .77, 2.1, (f) => (f === 'y1' ? '#8a5a36' : '#5a3a22'));
    for (const [x, z] of [[1.15, .95], [2.15, .95], [1.15, 2.05], [2.15, 2.05]]) box3(ctx, C, x - .03, 0, z - .03, x + .03, .72, z + .03, () => '#4a2e1c');
    const b = at3(C, 1.5, .8, 1.4); if (b) { ctx.fillStyle = '#c8b090'; ctx.beginPath(); ctx.ellipse(b.x, b.y, .17 * b.k, .06 * b.k, 0, 0, TAU); ctx.fill(); for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#c03a26' : '#a8b03a'; ctx.beginPath(); ctx.arc(b.x + (i - 1.5) * .07 * b.k, b.y - .05 * b.k, .045 * b.k, 0, TAU); ctx.fill(); } }
    const l = at3(C, 1.95, .77, 1.75), lt = at3(C, 1.95, 1.25, 1.75);
    if (l && lt) { ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = Math.max(1, .02 * l.k); ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(lt.x, lt.y); ctx.stroke();
      ctx.fillStyle = '#f2c27a'; ctx.beginPath(); ctx.moveTo(lt.x - .16 * lt.k, lt.y + .1 * lt.k); ctx.lineTo(lt.x - .09 * lt.k, lt.y - .08 * lt.k); ctx.lineTo(lt.x + .09 * lt.k, lt.y - .08 * lt.k); ctx.lineTo(lt.x + .16 * lt.k, lt.y + .1 * lt.k); ctx.closePath(); ctx.fill();
      radial(ctx, lt.x, lt.y + .08 * lt.k, 1.2 * lt.k, '#ffcf8a', .35 * lamp, 'screen'); }
  });
  // an armchair on the left, a coat on a hook by the door
  P.add(C.z < 1.8 ? 8 : 2, () => {
    box3(ctx, C, -2.25, .0, 1.5, -1.45, .42, 2.3, (f) => (f === 'y1' ? '#3f5a5e' : '#2c4246'));
    box3(ctx, C, -2.25, .42, 1.5, -2.05, 1.05, 2.3, (f) => (f === 'x1' ? '#3a5357' : '#2a3e42'));
    box3(ctx, C, -2.25, .42, 1.5, -1.45, .68, 1.62, () => '#33494d'); box3(ctx, C, -2.25, .42, 2.18, -1.45, .68, 2.3, () => '#33494d');
  });
  P.run();
}
// the front wall around the window (only seen while the camera is still outside, before the window covers the frame)
function frontWall(ctx, C) {
  const w = G.win, x0 = w.x - w.w / 2, x1 = w.x + w.w / 2, y0 = w.y - w.h / 2, y1 = w.y + w.h / 2;
  const outer = proj3(C, [[-4, -1, 0], [4, -1, 0], [4, 4, 0], [-4, 4, 0]]), hole = proj3(C, [[x0, y0, 0], [x0, y1, 0], [x1, y1, 0], [x1, y0, 0]]);
  if (!outer) return; ctx.beginPath(); trace(ctx, outer); if (hole) trace(ctx, hole); ctx.fillStyle = '#1a1634'; ctx.fill('evenodd');
  // window reveal (the wall's thickness) and the sill
  ctx.fillStyle = '#2a2248';
  for (const q of [[[x0, y0, 0], [x0, y0, .3], [x0, y1, .3], [x0, y1, 0]], [[x1, y0, .3], [x1, y0, 0], [x1, y1, 0], [x1, y1, .3]], [[x0, y1, 0], [x1, y1, 0], [x1, y1, .3], [x0, y1, .3]]]) fill3(ctx, C, q, '#2a2248');
  fill3(ctx, C, [[x0 - .06, y0, -.06], [x1 + .06, y0, -.06], [x1 + .06, y0, .3], [x0 - .06, y0, .3]], '#3a3060');
}

// ---------------------------------------------------------------- the garden
const R0 = prng(1307);
const TUFTS = Array.from({ length: 900 }, () => [mix(-7.5, 7.5, R0()), mix(3.6, 16.9, Math.pow(R0(), .8)), R0(), R0()]);
const LEAVES = Array.from({ length: 110 }, () => [R0(), R0(), R0(), R0()]);
const BLOBS = (() => { const r = prng(2203), o = []; for (let i = 0; i < 46; i++) { const a = r() * TAU, d = Math.pow(r(), .6); o.push([Math.cos(a) * d * 2.5, Math.sin(a) * d * 1.55 + .1, .55 + r() * .55, r()]); } return o.sort((p, q) => p[1] - q[1]); })();
const DOTS = Array.from({ length: 420 }, () => { const a = R0() * TAU, d = Math.pow(R0(), .55); return [Math.cos(a) * d * 2.7, Math.sin(a) * d * 1.75, R0(), R0()]; });
const BRANCH = (() => { const r = prng(77), o = []; const grow = (x, y, a, len, w, n) => { const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; o.push([x, y, x2, y2, w]); if (n <= 0) return; grow(x2, y2, a - .45 - r() * .3, len * (.62 + r() * .14), w * .62, n - 1); grow(x2, y2, a + .35 + r() * .35, len * (.6 + r() * .14), w * .6, n - 1); if (r() < .4) grow(x2, y2, a + (r() - .5) * .3, len * .55, w * .5, n - 2); }; grow(0, -1.0, -Math.PI / 2 - .12, 1.0, .26, 4); return o; })();
const APPLES = Array.from({ length: 26 }, () => { const a = R0() * TAU, d = Math.pow(R0(), .5); return [Math.cos(a) * d * 2.2, Math.sin(a) * d * 1.3 + .35, R0()]; });

export function sky(ctx, C, t, E) {
  // the horizon line on screen follows the pitch; the gradient is anchored to it
  const hy = C.oy + C.f * Math.tan(C.pitch), [s0, s1, s2] = E.sky;
  const g = ctx.createLinearGradient(0, hy - 1100, 0, hy + 40); g.addColorStop(0, s0); g.addColorStop(.62, s1); g.addColorStop(1, s2); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // slow stratus streaks lit from below (warm), drifting
  ctx.save(); ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 9; i++) {
    const az = -1.1 + i * .27 + t * .004, el = .07 + .045 * hash(i, 9) + .02 * (i % 3), p = C.p(C.x + Math.sin(az) * 1e4, C.y + Math.tan(el) * 1e4, C.z + Math.cos(az) * 1e4); if (!p) continue;
    const w = 260 + 220 * hash(i, 2), h = 7 + 9 * hash(i, 4);
    const gg = ctx.createLinearGradient(0, p[1] - h, 0, p[1] + h); gg.addColorStop(0, rgba(E.cloudTop, .0)); gg.addColorStop(.45, rgba(E.cloudTop, .32)); gg.addColorStop(1, rgba(E.cloudLow, .5));
    ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(p[0], p[1], w, h, 0, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
// the sun: core, warm glow, stipple halo (its screen point, or null when behind the camera)
export function sun(ctx, C, E, a = 1) {
  const S = E.sunDir, p = C.p(C.x + S[0] * 1e4, C.y + S[1] * 1e4, C.z + S[2] * 1e4); if (!p) return null;
  radial(ctx, p[0], p[1], 900, E.sunGlow, .32 * a, 'screen');
  glowAt(ctx, glowImg(E.sunGlow, { R: 160, core: .35 }), p[0], p[1], 340, .55 * a, 'screen');
  ctx.fillStyle = rgba(E.sunCore, .95 * a); ctx.beginPath(); ctx.arc(p[0], p[1], 26, 0, TAU); ctx.fill();
  radial(ctx, p[0], p[1], 70, '#fff6e2', .6 * a, 'screen');
  return p;
}
// houses beyond the back wall: the lane's north row seen from the garden (their fronts face the garden over the lane)
export const NORTH = (() => { const r = prng(4411), o = []; let x = -9; const cols = ['#d9a77a', '#c98a6a', '#e3c08a', '#b9876a', '#d4b48c', '#c47a5a']; while (x < 30) { const w = 3.6 + r() * 2.2, fl = 2 + (r() < .45 ? 1 : 0); o.push({ x0: x, x1: x + w, h: fl * 2.9 + .6, fl, col: cols[o.length % cols.length], sh: r() < .5 ? '#3f6a6a' : '#6a7a3a', seed: Math.floor(r() * 1e5), roof: r() }); x += w + .05; } return o; })();
export const laneY = (x) => GY - (x > 2.5 ? Math.min(1.9, (x - 2.5) * .085) : 0);
export function houseFront(ctx, C, h, z, E, o = {}) {
  // facade plane at Z = z, from X h.x0 → h.x1, base on the lane (sloped), facing −Z (toward the garden / the lane)
  const yb = laneY((h.x0 + h.x1) / 2) - .2, yt = yb + h.h, light = E.facade || 1;
  const col = mixHex(shade(h.col, -.32), h.col, clamp(light)), q = [[h.x0, yb, z], [h.x1, yb, z], [h.x1, yt, z], [h.x0, yt, z]];
  const S = poly3(ctx, C, q); if (!S) return;
  let ya = 1e9, yz = -1e9; for (const p of S) { ya = Math.min(ya, p[1]); yz = Math.max(yz, p[1]); } if (!(yz > ya)) yz = ya + 1;
  const g = ctx.createLinearGradient(0, ya, 0, yz); g.addColorStop(0, mixHex(col, E.rimCol || '#ffcf8a', .18 * light)); g.addColorStop(1, shade(col, -.12)); ctx.fillStyle = g; ctx.fill();
  // roof: tiles (a sloped band) + eaves line + a chimney
  const rt = yt + .9 + .5 * h.roof, rq = [[h.x0 - .15, yt, z - .25], [h.x1 + .15, yt, z - .25], [h.x1 + .15, rt, z + 1.8], [h.x0 - .15, rt, z + 1.8]];
  if (fill3(ctx, C, rq, mixHex('#7a3a2a', '#b8603a', .6 * light))) { ctx.strokeStyle = 'rgba(40,14,8,.4)'; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 1; k < 6; k++) { const v = k / 6; seg3(ctx, C, [h.x0 - .15, mix(yt, rt, v), mix(z - .25, z + 1.8, v)], [h.x1 + .15, mix(yt, rt, v), mix(z - .25, z + 1.8, v)]); } ctx.stroke(); }
  if (h.roof > .45) box3(ctx, C, h.x0 + .6, rt - .4, z + .9, h.x0 + 1.0, rt + .7, z + 1.3, (f) => (f === 'z0' ? shade(h.col, -.1) : shade(h.col, -.3)));
  // windows with shutters per floor, a door on the ground floor
  const n = Math.max(1, Math.round((h.x1 - h.x0) / 1.7)), r = prng(h.seed);
  for (let f = 0; f < h.fl; f++) for (let i = 0; i < n; i++) {
    const cx = mix(h.x0, h.x1, (i + .5) / n), y0 = yb + .9 + f * 2.9, ww = .62, wh = 1.15, lit = (o.lit ? o.lit(h, f, i, r) : 0);
    if (f === 0 && i === Math.floor(n / 2) && !o.noDoor) { fill3(ctx, C, [[cx - .5, yb, z - .01], [cx + .5, yb, z - .01], [cx + .5, yb + 2.2, z - .01], [cx - .5, yb + 2.2, z - .01]], shade(h.sh, -.25)); continue; }
    fill3(ctx, C, [[cx - ww / 2, y0, z - .01], [cx + ww / 2, y0, z - .01], [cx + ww / 2, y0 + wh, z - .01], [cx - ww / 2, y0 + wh, z - .01]], lit > 0 ? mixHex('#1a1630', '#ffcf8a', lit) : '#231d33');
    for (const sd of [-1, 1]) fill3(ctx, C, [[cx + sd * ww / 2, y0, z - .02], [cx + sd * (ww / 2 + .36), y0, z - .05], [cx + sd * (ww / 2 + .36), y0 + wh, z - .05], [cx + sd * ww / 2, y0 + wh, z - .02]], mixHex(shade(h.sh, -.2), h.sh, light));
    fill3(ctx, C, [[cx - ww / 2 - .08, y0 - .08, z - .03], [cx + ww / 2 + .08, y0 - .08, z - .03], [cx + ww / 2 + .08, y0, z - .03], [cx - ww / 2 - .08, y0, z - .03]], shade(h.col, -.18));
    if (f > 0 && r() < .5) { const fp = at3(C, cx, y0 - .02, z - .12); if (fp) { ctx.fillStyle = '#4a6a3a'; ctx.beginPath(); ctx.ellipse(fp.x, fp.y - .12 * fp.k, .42 * fp.k, .16 * fp.k, 0, 0, TAU); ctx.fill(); ctx.fillStyle = r() < .5 ? '#e05a6a' : '#f0a040'; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(fp.x + (k - 2) * .14 * fp.k, fp.y - .2 * fp.k + (k % 2) * .05 * fp.k, .045 * fp.k + .5, 0, TAU); ctx.fill(); } } }
  }
  // engraved courses on the plaster (shadow toward the bottom)
  ctx.strokeStyle = rgba(shade(h.col, -.45), .22); ctx.lineWidth = .7; ctx.beginPath(); hatchQuad(ctx, C, q, Math.round((h.x1 - h.x0) * 7), .18, prng(h.seed + 3), 0, 1); ctx.stroke();
}

function lawn(ctx, C, t, E, SN) {
  const q = [[-8, GY, 3.2], [8, GY, 3.2], [8, GY, G.wallZ], [-8, GY, G.wallZ]], S = poly3(ctx, C, q); if (!S) return;
  const near = at3(C, 0, GY, Math.max(C.z + .5, 3.3)), far = at3(C, 0, GY, G.wallZ);
  const g = ctx.createLinearGradient(0, far ? far.y : 400, 0, near ? Math.min(H, near.y) : H);
  g.addColorStop(0, mixHex(SN.gr, E.haze, .35)); g.addColorStop(.35, SN.gr); g.addColorStop(1, shade(SN.gr, -.22)); ctx.fillStyle = g; ctx.fill();
  // tufts (short engraved strokes) and stipple; leaf litter in autumn, blue shadow strokes in snow
  ctx.lineWidth = 1; const snow = SN.sn;
  ctx.strokeStyle = snow > .5 ? rgba('#7d8fb8', .35) : rgba(shade(SN.gr, -.45), .45); ctx.beginPath();
  for (const [x, z, a, b] of TUFTS) { if (z < C.z + .3) continue; const p = at3(C, x, GY, z); if (!p || p.x < -20 || p.x > W + 20 || p.y > H + 10) continue; const h = (.05 + .05 * a) * p.k; if (h < .8) continue; ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + (b - .5) * h * .8, p.y - h); }
  ctx.stroke();
  ctx.strokeStyle = rgba(mixHex(SN.gr, '#ffe2a0', .5), .38 * (1 - snow)); ctx.beginPath();
  for (const [x, z, a, b] of TUFTS) { if (a < .55 || z < C.z + .3) continue; const p = at3(C, x + .02, GY, z); if (!p || p.x < -20 || p.x > W + 20 || p.y > H + 10) continue; const h = (.04 + .04 * b) * p.k; if (h < .8) continue; ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + (a - .5) * h, p.y - h); }
  ctx.stroke();
  // fallen leaves (autumn) lie and stay until the snow covers them
  const litter = clamp((SN.s - 1.9) / .5) * (1 - clamp((SN.s - 2.85) / .25)); if (litter > .01) for (let i = 0; i < LEAVES.length; i++) { const [a, b, c2, d] = LEAVES[i]; if (a > litter) continue; const p = at3(C, mix(-6, 5, b), GY + .001, mix(6, 16, c2)); if (!p) continue; ctx.fillStyle = d < .5 ? '#c8642a' : '#d89a3a'; ctx.beginPath(); ctx.ellipse(p.x, p.y, .06 * p.k + .5, .025 * p.k + .4, d * 3, 0, TAU); ctx.fill(); }
  // the path from the door (flagstones) to the gate
  for (let i = 0; i < 9; i++) { const z = 4.0 + i * 1.45, x = mix(0, 2.2, clamp((z - 9) / 7)), p = at3(C, x, GY + .002, z); if (!p || z < C.z + .2) continue; ctx.fillStyle = mixHex('#b8a48a', SN.gr, .25 + .5 * snow); ctx.beginPath(); ctx.ellipse(p.x, p.y, .34 * p.k, .12 * p.k * (1 + 4 / (z - C.z + 1)) * .5, 0, 0, TAU); ctx.fill(); }
}
function backWall(ctx, C, t, E, SN, gateA) {
  const z = G.wallZ, y0 = GY, y1 = GY + G.wallH, g = G.gate;
  const q = [[-8, y0, z], [8, y0, z], [8, y1, z], [-8, y1, z]], hole = [[g.x0, y0, z], [g.x0, GY + g.y1, z], [g.x1, GY + g.y1, z], [g.x1, y0, z]];
  const S = proj3(C, q), Hh = proj3(C, hole); if (!S) return;
  ctx.beginPath(); trace(ctx, S); if (Hh) trace(ctx, Hh);
  const gr = ctx.createLinearGradient(0, Math.min(...S.map((p) => p[1])), 0, Math.max(...S.map((p) => p[1])) + .01); gr.addColorStop(0, mixHex('#c8a07a', E.key, .35)); gr.addColorStop(1, '#8a6a52'); ctx.fillStyle = gr; ctx.fill('evenodd');
  // stone courses + joints (engraved)
  ctx.save(); ctx.beginPath(); trace(ctx, S); if (Hh) trace(ctx, Hh); ctx.clip('evenodd');
  ctx.strokeStyle = 'rgba(60,36,24,.45)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let k = 1; k < 8; k++) { const y = mix(y0, y1, k / 8); seg3(ctx, C, [-8, y, z - .005], [8, y, z - .005]); for (let i = 0; i < 40; i++) { const x = -8 + (i + (k % 2) * .5) * .42; seg3(ctx, C, [x, y, z - .005], [x, y - G.wallH / 8, z - .005]); } }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(40,24,16,.18)'; ctx.beginPath(); hatchQuad(ctx, C, q, 220, .06, prng(8)); ctx.stroke();
  ctx.restore();
  // coping stones (snow on them in winter), climbing roses / ivy on the right half
  box3(ctx, C, -8, y1, z - .14, 8, y1 + .12, z + .14, (f) => (f === 'y1' ? mixHex('#cdb48e', '#f2f6fa', SN.sn) : '#8f735a'));
  // the arched lintel over the gate
  const lA = at3(C, (g.x0 + g.x1) / 2, GY + g.y1, z - .02); if (lA) { ctx.strokeStyle = '#7a5a44'; ctx.lineWidth = .16 * lA.k; ctx.beginPath(); ctx.arc(lA.x, lA.y, (g.x1 - g.x0) / 2 * lA.k, Math.PI, 0); ctx.stroke(); }
  // the gate leaf: vertical boards, two ledges, a ring latch; swings into the lane (hinge on the right), gateA 0 closed → 1 open
  const ang = gateA * 1.75, hx = g.x1, wl = g.x1 - g.x0, ex = hx - Math.cos(ang) * wl, ez = z + Math.sin(ang) * wl, top = GY + g.y1 - .02;
  const lf = [[ex, GY + .04, ez], [hx, GY + .04, z], [hx, top, z], [ex, top, ez]];
  const SL = poly3(ctx, C, lf); if (SL) {
    ctx.fillStyle = mixHex('#2f5552', '#4d7a72', .5 + .3 * (1 - gateA)); ctx.fill();
    ctx.strokeStyle = 'rgba(10,20,20,.55)'; ctx.lineWidth = 1.2; ctx.beginPath();
    for (let i = 1; i < 7; i++) { const u = i / 7; seg3(ctx, C, [mix(ex, hx, u), GY + .04, mix(ez, z, u)], [mix(ex, hx, u), top, mix(ez, z, u)]); }
    for (const v of [.2, .8]) seg3(ctx, C, [ex, mix(GY, top, v), ez], [hx, mix(GY, top, v), z]);
    ctx.stroke();
    const ring = at3(C, mix(ex, hx, .12), GY + .95, mix(ez, z, .12)); if (ring) { ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = Math.max(1, .02 * ring.k); ctx.beginPath(); ctx.arc(ring.x, ring.y, .05 * ring.k, 0, TAU); ctx.stroke(); }
  }
  // climbing roses on the wall right of the gate (season colour)
  const rr = prng(66); for (let i = 0; i < 60; i++) { const x = mix(3.1, 7.5, rr()), y = GY + mix(.3, G.wallH, Math.pow(rr(), .6)), p = at3(C, x, y, z - .05); if (!p) continue; const lf2 = SN.leaf * (.6 + .4 * rr()); if (lf2 > .1) { ctx.fillStyle = mixHex(SN.lc, '#2f4a24', .5); ctx.beginPath(); ctx.arc(p.x, p.y, .09 * p.k * lf2, 0, TAU); ctx.fill(); } if (SN.s > .7 && SN.s < 2.2 && rr() < .35) { ctx.fillStyle = '#d8485a'; ctx.beginPath(); ctx.arc(p.x, p.y, .05 * p.k, 0, TAU); ctx.fill(); } }
}
// the apple tree (a billboard at its trunk foot), its four seasons
function appleTree(ctx, C, t, E, SN) {
  const T0 = G.tree, base = at3(C, T0.x, GY, T0.z); if (!base) return; const k = base.k, sway = Math.sin(t * .8) * .02 + Math.sin(t * 1.9 + 1) * .008;
  ctx.save(); ctx.translate(base.x, base.y); ctx.scale(k, k);
  // shadow on the lawn (cast toward the left, away from the sun)
  ctx.fillStyle = rgba('#141a10', .28 * (1 - SN.sn * .5)); ctx.beginPath(); ctx.ellipse(-2.2, .05, 3.2, .45, 0, 0, TAU); ctx.fill();
  // trunk + branches (lit on the right)
  ctx.lineCap = 'round';
  for (const [x1, y1, x2, y2, w] of BRANCH) { const sw = sway * (-y2 / 3); ctx.strokeStyle = '#4a3a2e'; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1 + sway * (-y1 / 3), y1); ctx.lineTo(x2 + sw, y2); ctx.stroke(); }
  ctx.strokeStyle = '#2a201a'; ctx.lineWidth = .3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(.08, -.5, -.02, -1.05); ctx.stroke();
  ctx.fillStyle = '#4a3a2e'; ctx.beginPath(); ctx.moveTo(-.2, 0); ctx.quadraticCurveTo(-.14, -.6, -.12, -1.1); ctx.lineTo(.12, -1.1); ctx.quadraticCurveTo(.14, -.6, .24, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(E.key, .55); ctx.lineWidth = .05; ctx.beginPath(); ctx.moveTo(.2, -.05); ctx.quadraticCurveTo(.15, -.6, .13, -1.08); ctx.stroke();
  for (const [x1, y1, x2, y2, w] of BRANCH) { if (w < .08) continue; ctx.strokeStyle = rgba(E.key, .35); ctx.lineWidth = w * .25; ctx.beginPath(); ctx.moveTo(x1 + w * .3, y1); ctx.lineTo(x2 + w * .3 + sway * (-y2 / 3), y2); ctx.stroke(); }
  // snow on the branches (winter)
  if (SN.sn > .02) { ctx.strokeStyle = rgba('#f4f8fc', .9 * SN.sn); for (const [x1, y1, x2, y2, w] of BRANCH) { if (w > .2) continue; ctx.lineWidth = w * .5; ctx.beginPath(); ctx.moveTo(x1, y1 - w * .4); ctx.lineTo(x2 + sway * (-y2 / 3), y2 - w * .4); ctx.stroke(); } }
  // canopy: leaf blobs (season colour, lit on the upper right), then blossom / apples
  const cy = -3.15;
  if (SN.leaf > .02) {
    for (const [x, y, r, q] of BLOBS) {
      const rr = r * (.35 + .65 * SN.leaf) * (q < SN.leaf * 1.3 ? 1 : .6), px = x + sway * 2, py = cy + y;
      ctx.fillStyle = mixHex(shade(SN.lc, -.3), SN.lc, clamp(.5 + .5 * (x / 2.5) - .3 * (y / 1.5))); ctx.beginPath(); ctx.arc(px, py, rr, 0, TAU); ctx.fill();
    }
    // leaf dots: the engraved texture of the canopy (dark under, light top-right)
    ctx.fillStyle = rgba(shade(SN.lc, -.45), .55); for (const [x, y, a] of DOTS) { if (a > SN.leaf) continue; ctx.fillRect(x + sway * 2, cy + y + .1, .07, .07); }
    ctx.fillStyle = rgba(mixHex(SN.lc, '#fff1c0', .5), .7); for (const [x, y, a, b] of DOTS) { if (a > SN.leaf || x + y * -.8 < .4) continue; ctx.fillRect(x + sway * 2, cy + y - .05, .06, .06); }
  }
  if (SN.bl > .02) { for (const [x, y, a, b] of DOTS) { if (b > SN.bl) continue; ctx.fillStyle = a < .5 ? '#fbe8ee' : '#f0b8c8'; ctx.beginPath(); ctx.arc(x + sway * 2, cy + y, .05 + .05 * SN.bl * a, 0, TAU); ctx.fill(); } }
  if (SN.ap > .02 && SN.leaf > .2) { const n = Math.round(APPLES.length * clamp(SN.ap * 2) * (1 - clamp((SN.s - 2.1) / .4))); for (let i = 0; i < n; i++) { const [x, y, q] = APPLES[i]; ctx.fillStyle = mixHex('#8fae3a', '#c8342a', clamp((SN.ap - .45) * 2)); ctx.beginPath(); ctx.arc(x + sway * 2, cy + y, .085, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,240,200,.5)'; ctx.beginPath(); ctx.arc(x + sway * 2 + .03, cy + y - .03, .025, 0, TAU); ctx.fill(); } }
  ctx.restore();
}
function roseBush(ctx, C, t, E, SN) {
  const [x0, z0] = G.rose, b = at3(C, x0, GY, z0); if (!b) return; const k = b.k;
  ctx.save(); ctx.translate(b.x, b.y); ctx.scale(k, k);
  ctx.fillStyle = 'rgba(20,24,12,.3)'; ctx.beginPath(); ctx.ellipse(-.9, .03, 1.4, .2, 0, 0, TAU); ctx.fill();
  const lf = Math.max(.15, SN.leaf), r = prng(5150);
  for (let i = 0; i < 26; i++) { const a = r() * Math.PI, d = .3 + r() * .55, x = Math.cos(a) * d * 1.1, y = -.45 - Math.sin(a) * d * .9, rr = (.16 + r() * .14) * (.4 + .6 * lf); ctx.fillStyle = mixHex(shade(mixHex(SN.lc, '#3a5a2a', .55), -.25), mixHex(SN.lc, '#4f7a34', .55), clamp(.5 + x)); ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill(); }
  const bloom = clamp(1 - Math.abs(SN.s - 1.3) / .9) + clamp(1 - Math.abs(SN.s - .1) / .4) * .4;
  for (let i = 0; i < 16; i++) { const a = r() * Math.PI, d = .35 + r() * .5, x = Math.cos(a) * d * 1.05, y = -.5 - Math.sin(a) * d * .85; if (r() > bloom) continue; ctx.fillStyle = r() < .5 ? '#d8485a' : '#f07a8a'; ctx.beginPath(); ctx.arc(x, y, .07, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(120,20,30,.5)'; ctx.beginPath(); ctx.arc(x - .015, y + .01, .03, 0, TAU); ctx.fill(); }
  if (SN.sn > .02) { ctx.fillStyle = rgba('#f4f8fc', .85 * SN.sn); for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(-.8 + i * .2, -.95 - Math.sin(i * .35) * .3, .16, .05, 0, 0, TAU); ctx.fill(); } }
  ctx.restore();
}
// garden furniture as small engraved 3D boxes / billboards
function armchair(ctx, C, x, z, E) {   // a wicker armchair facing +X (the father faces right)
  const w = '#b08a5a', d = '#7a5a36';
  box3(ctx, C, x - .32, GY + .38, z - .34, x + .3, GY + .46, z + .34, (f) => (f === 'y1' ? w : d));
  box3(ctx, C, x - .4, GY + .38, z - .36, x - .3, GY + 1.12, z + .36, (f) => (f === 'x1' ? w : d));
  for (const sz of [-1, 1]) box3(ctx, C, x - .36, GY + .38, z + sz * .36 - .04, x + .32, GY + .68, z + sz * .36 + .04, () => d);
  for (const [a, b] of [[-.3, -.3], [.28, -.3], [-.3, .3], [.28, .3]]) box3(ctx, C, x + a - .025, GY, z + b - .025, x + a + .025, GY + .38, z + b + .025, () => d);
  const p = at3(C, x - .35, GY + .8, z); if (p) { ctx.strokeStyle = 'rgba(60,40,20,.5)'; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 6; i++) { ctx.moveTo(p.x - .02 * p.k, p.y + (i - 3) * .1 * p.k); ctx.lineTo(p.x + .03 * p.k, p.y + (i - 2.5) * .1 * p.k); } ctx.stroke(); }
}
function chair(ctx, C, x, z, E) {      // a wooden garden chair facing −X (you face left)
  const w = '#6a8a8a', d = '#3f5a5a';
  box3(ctx, C, x - .22, GY + .44, z - .22, x + .24, GY + .49, z + .22, (f) => (f === 'y1' ? w : d));
  box3(ctx, C, x + .2, GY + .44, z - .22, x + .26, GY + 1.0, z + .22, (f) => (f === 'x0' ? w : d));
  for (const [a, b] of [[-.2, -.2], [.22, -.2], [-.2, .2], [.22, .2]]) box3(ctx, C, x + a - .02, GY, z + b - .02, x + a + .02, GY + .44, z + b + .02, () => d);
}
// the family: father in the armchair (book, blanket) facing right, you on the garden chair facing him, your mother standing right
// behind you at the rose bush with a cut rose; on "love" her front hand comes to rest on your shoulder. Seasons: he turns a page,
// you lift the basket of apples onto your lap (autumn) and hold one out to him.
function family(ctx, C, t, E, SN, P) {
  const Lt = E.figLight, rim = E.rim;
  const fig = (X, Y, Z, hs = 1) => { const p = at3(C, X, Y, Z); if (!p) return null; return { x: p.x, y: p.y, s: p.k * U * hs, d: p.d }; };
  const yd = fig(G.you[0], GY + .5, G.you[1]), dd = fig(G.dad[0], GY + .48, G.dad[1], .97), md = fig(G.mum[0], GY + .862 * .96, G.mum[1], .96);
  const youDress = { coat: '#3f6f8f', pants: '#2a2a3a', hair: '#3b2418', skin: '#d9a984', shoes: '#2a1a14' };
  const dadDress = { coat: '#8a6a4a', pants: '#3a3a4a', hair: '#d8d4cc', skin: '#d9b08e', shoes: '#2a1a14' };
  const mumDress = { coat: '#9a4a5a', pants: '#2a2236', hair: '#c8c0b8', skin: '#e3b894', shoes: '#2a1a14', skirt: '#7a3a4a' };
  const lap = E.lap ?? 0, give = E.give ?? 0, love = E.love ?? 0;
  const youPose = { ...POSES.sit, hair: 'short', sh: [mix(.55, .92, lap), mix(.45, .8, lap)], el: [mix(.85, 1.0, lap), mix(.9, 1.05, lap)], kn: [1.45, 1.5], head: .06 };
  if (give > 0) { youPose.sh = [mix(youPose.sh[0], 1.3, give), youPose.sh[1]]; youPose.el = [mix(youPose.el[0], .22, give), youPose.el[1]]; youPose.hands = ['open', 'relaxed']; youPose.lean = .05 * give; }
  // the father: sits facing right, a book in both hands; turns a page now and then
  P.add(dd ? dd.d : 0, () => {
    armchair(ctx, C, G.dad[0], G.dad[1], E);
    if (!dd) return;
    const page = E.page ?? 0;
    const pose = { ...POSES.sit, hair: 'grey', sh: [.62, .55], el: [1.05, 1.15], head: .2 + .1 * clamp(give * 2 - 1) * -1, kn: [1.5, 1.42], lean: .02 };
    const prop = (g, fa, ba) => {   // the open book between the hands
      const x = (fa.hx + ba.hx) / 2 + 3, y = (fa.hy + ba.hy) / 2 - 3;
      g.save(); g.translate(x, y); g.rotate(-.5);
      g.fillStyle = '#7a2a22'; g.fillRect(-9, -1, 18, 2.5);
      g.fillStyle = '#f2ead8'; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-4, -3, -9, -1.6); g.lineTo(-9, .5); g.quadraticCurveTo(-4, -1, 0, 1); g.quadraticCurveTo(4, -1, 9, .5); g.lineTo(9, -1.6); g.quadraticCurveTo(4, -3, 0, 0); g.fill();
      if (page > 0 && page < 1) { const a = Math.PI * page; g.fillStyle = '#fff8ea'; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(Math.cos(a) * 4.5, -Math.sin(a) * 6 - 2, Math.cos(a) * 9, -Math.sin(a) * 4 - 1.6); g.lineTo(Math.cos(a) * 9, -Math.sin(a) * 4 + .4); g.quadraticCurveTo(Math.cos(a) * 4.5, -Math.sin(a) * 5, 0, 1); g.fill(); }
      g.strokeStyle = 'rgba(80,60,40,.5)'; g.lineWidth = .3; g.beginPath(); for (let i = 0; i < 3; i++) { g.moveTo(-7.5, -.6 + i * .5 - 1); g.lineTo(-2, -.2 + i * .5 - 1.2); g.moveTo(2, -.2 + i * .5 - 1.2); g.lineTo(7.5, -.6 + i * .5 - 1); } g.stroke();
      g.restore();
    };
    person(ctx, dd.x, dd.y, dd.s, pose, { t, seed: 31, dress: dadDress, light: Lt, rim, rimSide: 1, prop, turn: .15, smile: .25 + .3 * give });
    // the blanket over his knees (a plaid with a fringe), draped from the lap over the shins
    ctx.save(); ctx.translate(dd.x, dd.y); ctx.scale(dd.s, dd.s);
    ctx.fillStyle = '#5a6a8a'; ctx.beginPath(); ctx.moveTo(-6, -12); ctx.quadraticCurveTo(22, -16, 48, -6); ctx.quadraticCurveTo(54, 20, 50, 44); ctx.lineTo(38, 46); ctx.quadraticCurveTo(40, 18, 30, 6); ctx.quadraticCurveTo(10, 8, -8, 8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(200,120,60,.75)'; ctx.lineWidth = 1.6; ctx.beginPath(); for (const v of [-6, 0, 6]) { ctx.moveTo(-6, v - 2); ctx.quadraticCurveTo(22, v - 6, 48, v + 2); } for (const u of [14, 26, 38]) { ctx.moveTo(u, -12); ctx.quadraticCurveTo(u + 6, 8, u + 2 + (u - 14) * .3, 40); } ctx.stroke();
    ctx.fillStyle = rgba(E.key, .25); ctx.beginPath(); ctx.moveTo(46, -6); ctx.quadraticCurveTo(53, 18, 49, 44); ctx.lineTo(46, 44); ctx.quadraticCurveTo(48, 18, 42, -4); ctx.fill();
    ctx.strokeStyle = '#3a4560'; ctx.lineWidth = .8; ctx.beginPath(); for (let i = 0; i < 7; i++) { ctx.moveTo(38 + i * 2, 45); ctx.lineTo(38 + i * 2, 48); } ctx.stroke();
    ctx.restore();
  });
  // you: seated on the garden chair facing left, toward him; the basket of apples by the chair (on the lap in autumn)
  P.add(yd ? yd.d - .01 : 0, () => {
    chair(ctx, C, G.you[0] + .06, G.you[1], E);
    if (!yd) return;
    const prop = (g, fa, ba) => {
      if (lap > .05) { const x = mix(fa.hx, (fa.hx + ba.hx) / 2 + 2, clamp(1 - give * 2)), y = Math.max(fa.hy, ba.hy) - 2; if (give < .5) basketShape(g, (fa.hx + ba.hx) / 2 + 2, y, 1, 1); else basketShape(g, ba.hx + 4, ba.hy - 2, 1, 1); }
      if (give > .3) { g.fillStyle = '#c8342a'; g.beginPath(); g.arc(fa.hx + Math.sin(fa.ang) * 3.5, fa.hy + Math.cos(fa.ang) * 3.5 - 1, 3, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,236,200,.55)'; g.beginPath(); g.arc(fa.hx + Math.sin(fa.ang) * 3.5 + .9, fa.hy + Math.cos(fa.ang) * 3.5 - 2, .9, 0, TAU); g.fill(); }
    };
    person(ctx, yd.x, yd.y, yd.s, youPose, { t, seed: 7, dress: youDress, light: Lt, rim, rimSide: 1, flip: true, prop, turn: .1, smile: E.smile ?? .2 });
  });
  // the basket on the grass (until it is lifted onto your lap)
  P.add(yd ? yd.d + .3 : 0, () => { if (lap > .05) return; const b = at3(C, G.basket[0], GY, G.basket[1]); if (!b) return; ctx.save(); ctx.translate(b.x, b.y); const k = b.k * U * .97; ctx.scale(k, k); basketShape(ctx, 0, -9, 1, 1); ctx.restore(); });
  // the mother: stands right behind your chair, facing left, at the rose bush; a cut rose in her back hand
  P.add(md ? md.d : 0, () => {
    if (!md || !yd) return;
    const pose = { ...POSES.stand, hair: 'bun', skirt: true, coat: .4, head: .14, sh: [.16, .42], el: [.3, 1.2], hands: ['relaxed', 'fist'] };
    let full = pose;
    if (love > 0) {
      const tgt = jointAt(yd.x, yd.y, yd.s, youPose, { t, seed: 7, flip: true }, 'shoulderTop');
      const lean = .1 * love, p2 = { ...pose, lean }, r = reachArm(md.x, md.y, md.s, p2, 0, true, { t, seed: 12 }, tgt, 1);
      full = { ...p2, sh: [mix(.16, r.sh, love), .42], el: [mix(.3, r.el, love), 1.2], lock: [true, false], head: mix(.14, .32, love), hands: ['open', 'fist'] };
    }
    const prop = (g, fa, ba) => {   // the rose: a stem from the back fist, a bloom and two leaves
      const x = ba.hx + Math.sin(ba.ang) * 3, y = ba.hy + Math.cos(ba.ang) * 3; g.strokeStyle = '#3a5a2a'; g.lineWidth = .9; g.beginPath(); g.moveTo(x, y + 4); g.quadraticCurveTo(x + 2, y - 6, x + 1, y - 14); g.stroke();
      g.fillStyle = '#4a7a34'; g.beginPath(); g.ellipse(x + 2.4, y - 6, 2.2, 1, -.5, 0, TAU); g.fill(); g.fillStyle = '#d8485a'; g.beginPath(); g.arc(x + 1, y - 15.5, 2.6, 0, TAU); g.fill(); g.strokeStyle = 'rgba(110,20,30,.6)'; g.lineWidth = .4; g.beginPath(); g.arc(x + 1, y - 15.5, 1.3, .3, 4.5); g.stroke();
    };
    person(ctx, md.x, md.y, md.s, full, { t, seed: 12, dress: mumDress, light: Lt, rim, rimSide: 1, flip: true, prop, smile: .25 + .25 * love });
  });
}
function basketShape(g, x, y, s, fill = 1, SN = null) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#a8743a'; g.beginPath(); g.moveTo(-13, -6); g.lineTo(13, -6); g.lineTo(10, 8); g.quadraticCurveTo(0, 10, -10, 8); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(70,40,14,.7)'; g.lineWidth = .7; g.beginPath(); for (let i = -12; i <= 12; i += 3) { g.moveTo(i, -6); g.lineTo(i * .8, 8.5); } for (const v of [-2, 2.5, 6]) { g.moveTo(-12.5, v); g.lineTo(12.5, v); } g.stroke();
  g.strokeStyle = '#8a5a2a'; g.lineWidth = 1.6; g.beginPath(); g.ellipse(0, -6, 11, 13, 0, Math.PI * 1.06, Math.PI * 1.94); g.stroke();
  if (fill > 0) { for (let i = 0; i < 7; i++) { const ax = -9 + i * 3, ay = -7 - (i % 2) * 2.4; g.fillStyle = i % 3 === 1 ? '#b8a83a' : '#c8342a'; g.beginPath(); g.arc(ax, ay, 2.7, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,236,200,.5)'; g.beginPath(); g.arc(ax + .8, ay - .9, .8, 0, TAU); g.fill(); } }
  g.restore();
}
// falling things (petals, leaves, snow) and sunlit motes, in world space near the family
function falling(ctx, C, t, E, SN) {
  const r = prng(990), kinds = [['p', SN.petals], ['l', SN.fallLeaves], ['s', SN.fallSnow], ['m', SN.motes * .7]];
  for (const [kind, amt] of kinds) {
    if (amt < .02) continue; const n = Math.round((kind === 's' ? 160 : kind === 'm' ? 70 : 60) * amt);
    for (let i = 0; i < n; i++) {
      const x0 = mix(-6, 6, r()), z = mix(6, 16, r()), sp = kind === 's' ? .45 : kind === 'm' ? .05 : .35, ph = r(), y = GY + 5 - ((t * sp + ph * 6) % 5.6), x = x0 + Math.sin(t * .9 + ph * 9) * .3 + (kind === 'm' ? Math.sin(t * .3 + ph * 4) * .4 : 0);
      if (kind === 'm' && (y < GY + .4 || y > GY + 3)) continue;
      const p = at3(C, x, y, z); if (!p || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) continue;
      if (kind === 'p') { ctx.fillStyle = '#f6d0dc'; ctx.beginPath(); ctx.ellipse(p.x, p.y, .03 * p.k + .6, .018 * p.k + .4, t * 2 + ph * 7, 0, TAU); ctx.fill(); }
      else if (kind === 'l') { ctx.fillStyle = ph < .5 ? '#d0702a' : '#e0a040'; ctx.beginPath(); ctx.ellipse(p.x, p.y, .05 * p.k + .6, .022 * p.k + .4, t * 3 + ph * 7, 0, TAU); ctx.fill(); }
      else if (kind === 's') { ctx.fillStyle = 'rgba(248,250,255,.9)'; ctx.beginPath(); ctx.arc(p.x, p.y, .018 * p.k + .5, 0, TAU); ctx.fill(); }
      else { ctx.fillStyle = rgba('#fff1d0', .55 * amt); ctx.fillRect(p.x, p.y, 1.6, 1.6); }
    }
  }
}
// sun rays through the garden from the right (stippled bands), very slow
function rays(ctx, t, E, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 5; i++) {
    const y0 = 120 + i * 150 + 30 * Math.sin(t * .2 + i), w = 40 + 35 * hash(i, 3), ang = .32;
    const g = ctx.createLinearGradient(W, 0, W * .2, 0); g.addColorStop(0, rgba(E.sunGlow, .16 * a)); g.addColorStop(1, rgba(E.sunGlow, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(W + 40, y0 - w); ctx.lineTo(W * .1, y0 - w + W * .9 * ang); ctx.lineTo(W * .1, y0 + w + W * .9 * ang); ctx.lineTo(W + 40, y0 + w); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  radial(ctx, W + 60, 260, 900, E.sunGlow, .45 * a, 'screen');
}

// ---------------------------------------------------------------- the whole set from one camera
//   E: { sky[3], haze, key, rim, figLight, sunDir, sunCore, sunGlow, cloudTop, cloudLow, lamp, season, gate (0..1), love, page, lap, tend, give, smile, facade, inRoom }
export function roomGarden(ctx, C, t, E, o = {}) {
  const SN = season(E.season ?? 0);
  const inRoom = C.z < G.room.z1 - .02, outside = C.z < 0;
  sky(ctx, C, t, E);
  // beyond the wall: the lane's north houses, their fronts lit low from the right
  if (!o.noFar) { for (const h of NORTH) if (h.x0 < 15) houseFront(ctx, C, h.x1 > 15.5 ? { ...h, x1: 15.5 } : h, G.northZ, E, { lit: E.northLit }); }
  if (o.lane) o.lane(ctx, C);   // the lane seen through the open gate (drawn by the lane module, behind the wall)
  lawn(ctx, C, t, E, SN);
  backWall(ctx, C, t, E, SN, E.gate ?? 0);
  const P = painter();
  P.add(at3(C, G.tree.x, GY, G.tree.z)?.d ?? 0, () => appleTree(ctx, C, t, E, SN));
  P.add(at3(C, ...[G.rose[0], GY, G.rose[1]])?.d ?? 0, () => roseBush(ctx, C, t, E, SN));
  family(ctx, C, t, E, SN, P);
  P.run();
  falling(ctx, C, t, E, SN);
  rays(ctx, t, E, E.rays ?? 1);
  if (inRoom || outside) room(ctx, C, t, E);
  if (outside) frontWall(ctx, C);
}
