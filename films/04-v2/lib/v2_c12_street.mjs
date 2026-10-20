// c12 (Film 4 v2) · 12.07–12.08 · the esteem street of the Maslow hill, cut away, every room busy (builder c12).
// The hill is drawn ONLY by lib/maslow4.mjs (drawHill with st.cutaway = 1: the six workshop fronts are off; st.room calls this file for
// every opened room). The same street as c11's: ground floors potter, dancer, violin, joiner, the notice board in the office's gap, painter;
// upstairs drying room, sewing, piano, models, supper, kitchen; attics loom, writer, reader.
// CAMERA (as c11's street): a pinhole looking straight at the facades; (cx, cy) = the facade point at the frame centre, D = its distance:
//   P(x, y, d) = [960 + (x − cx)·q, 540 + (y − cy)·q, q], q = FOC / (D + d), d ≥ 0 into the house. The hill: cam { cx, cy, z: FOC / D }.
//   D < 0: the camera is inside the potter's room (12.07 starts at the bulb of her lamp); what is nearer than the camera is not drawn.
//   view(cx, cy, D) · drawStreet(ctx, t, V, st) (st.hill = the maslow4 state; st.split = { y, hill } a second hill state above world y)
//   LAMP0 = the potter's bulb { x, y, d, r } · drawRoom(ctx, t, V, R) · ROOMS
import { W, H, rgba, clamp, mix, sm, prng } from '../engine.mjs';
import { drawHill, hillRooms } from './maslow4.mjs';
import { figure, figureKid, reachArm, POSES } from './figure.mjs';
import { TAU, mixC, memo } from './v2_c12_kit.mjs';

export const FOC = 1400, DEPTH = 18, NEAR = .06, DH = 3.4, FIG = .04;
const LIGHT = '#fff4e0';
export function view(cx, cy, D) {
  const P = (x, y, d) => { const q = FOC / Math.max(NEAR, D + d); return [W / 2 + (x - cx) * q, H / 2 + (y - cy) * q, q]; };
  return { cx, cy, D, P, dn: NEAR - D, cam: { x: cx, y: cy, z: FOC / Math.max(D, 1e-3) } };
}

// ---------------------------------------------------------------- 3D helpers (near-plane clipped)
function path3(ctx, V, pts) {
  let p = pts;
  if (p.some((a) => a[2] < V.dn)) {
    const o = [];
    for (let i = 0; i < p.length; i++) {
      const a = p[i], b = p[(i + 1) % p.length], ia = a[2] >= V.dn, ib = b[2] >= V.dn;
      if (ia) o.push(a);
      if (ia !== ib) { const u = (V.dn - a[2]) / (b[2] - a[2]); o.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, V.dn]); }
    }
    if (o.length < 3) return false; p = o;
  }
  ctx.beginPath(); for (let i = 0; i < p.length; i++) { const s = V.P(p[i][0], p[i][1], p[i][2]); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); } ctx.closePath();
  return true;
}
const fill3 = (ctx, V, pts, col) => { if (path3(ctx, V, pts)) { ctx.fillStyle = col; ctx.fill(); } };
function seg3(ctx, V, a, b) {
  let A = a, B = b; if (A[2] < V.dn && B[2] < V.dn) return;
  if (A[2] < V.dn) { const u = (V.dn - A[2]) / (B[2] - A[2]); A = [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, V.dn]; }
  else if (B[2] < V.dn) { const u = (V.dn - B[2]) / (A[2] - B[2]); B = [B[0] + (A[0] - B[0]) * u, B[1] + (A[1] - B[1]) * u, V.dn]; }
  const p = V.P(A[0], A[1], A[2]), q = V.P(B[0], B[1], B[2]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
}
// an axis-aligned box; c: { front, top, side }
function box3(ctx, V, x0, y0, x1, y1, d0, d1, c) {
  if (d1 < V.dn) return;
  if (V.cy < y0) fill3(ctx, V, [[x0, y0, d0], [x1, y0, d0], [x1, y0, d1], [x0, y0, d1]], c.top || c.front);
  if (V.cx < x0) fill3(ctx, V, [[x0, y0, d0], [x0, y0, d1], [x0, y1, d1], [x0, y1, d0]], c.side || c.front);
  if (V.cx > x1) fill3(ctx, V, [[x1, y0, d0], [x1, y0, d1], [x1, y1, d1], [x1, y1, d0]], c.side || c.front);
  fill3(ctx, V, [[x0, y0, d0], [x1, y0, d0], [x1, y1, d0], [x0, y1, d0]], c.front);
}
function disc3(ctx, V, x, y, d, r, n = 28) { const p = []; for (let i = 0; i < n; i++) { const a = i / n * TAU; p.push([x + r * Math.cos(a), y, d + r * Math.sin(a)]); } return path3(ctx, V, p); }
// a vertical cylinder (or a bowl side) from y0 (top) to y1 (bottom): the front half of both rims joined
function cyl3(ctx, V, x, y0, y1, d, r0, r1, col) {
  const n = 18, p = [];
  for (let i = 0; i <= n; i++) { const a = Math.PI * i / n; p.push([x + r1 * Math.cos(a), y1, d - r1 * Math.sin(a)]); }
  for (let i = n; i >= 0; i--) { const a = Math.PI * i / n; p.push([x + r0 * Math.cos(a), y0, d - r0 * Math.sin(a)]); }
  fill3(ctx, V, p, col);
}
const lwq = (q, u) => Math.max(.5, Math.min(3, q * u));

// ---------------------------------------------------------------- the rooms
const K0 = ['potter', 'dancer', 'violin', 'joiner', 'board', 'painter'], K1 = ['drying', 'sewing', 'piano', 'models', 'supper', 'kitchen'], K2 = { 1: 'loom', 3: 'writer', 5: 'reader' };
const WALLS = ['#dcc6a2', '#d3b895', '#d8c09a', '#cdb08c', '#dfcba8', '#d2bc9a', '#d6c4a4'];
export const ROOMS = new Proxy({}, { get: (_, k) => rooms()[k] });
function rooms() {
  return memo('c12-rooms', () => {
    const out = {};
    for (const rm of hillRooms(2)) {
      const i = rm.house.workshop, j = rm.floor, kind = j === 0 ? K0[i] : j === 1 ? K1[i] : K2[i] || 'reader';
      const R = { id: rm.id, i, j, kind, x0: rm.x, x1: rm.x + rm.w, y0: rm.y, y1: rm.y + rm.h, w: rm.w, h: rm.h, seed: 700 + rm.id * 37, wall: WALLS[(i * 3 + j) % WALLS.length] };
      R.xc = (R.x0 + R.x1) / 2;
      R.lamp = kind === 'potter' ? LAMP0 : { x: R.x0 + R.w * (.38 + .24 * ((i + j) % 2)), y: R.y0 + 2.3, d: 6.5, r: .22 };
      out[rm.id] = R; out[kind] = R;
    }
    return out;
  });
}
export const LAMP0 = { x: 717.0, y: 519.25, d: 5.5, r: .3 };       // the potter's bulb (12.07 starts inside its light)

function shell(ctx, t, V, R, lod) {
  const { x0, x1, y0, y1 } = R, d1 = DEPTH, wc = R.wall;
  fill3(ctx, V, [[x0, y0, d1], [x1, y0, d1], [x1, y1, d1], [x0, y1, d1]], wc);
  fill3(ctx, V, [[x0, y0, 0], [x0, y0, d1], [x0, y1, d1], [x0, y1, 0]], mixC(wc, '#3a2618', .3));
  fill3(ctx, V, [[x1, y0, 0], [x1, y0, d1], [x1, y1, d1], [x1, y1, 0]], mixC(wc, '#3a2618', .36));
  fill3(ctx, V, [[x0, y1, 0], [x1, y1, 0], [x1, y1, d1], [x0, y1, d1]], R.j === 0 ? '#6a4c36' : '#7a5a40');
  fill3(ctx, V, [[x0, y0, 0], [x1, y0, 0], [x1, y0, d1], [x0, y0, d1]], '#4e3a2e');
  if (lod < 1) return;
  const qb = V.P(R.xc, y1, d1)[2];
  // planks converge to the back, beams cross the ceiling, a sparse plaster hatch on the back wall, a skirting board
  ctx.strokeStyle = rgba('#2a1a10', .34); ctx.lineWidth = lwq(qb, .05); ctx.beginPath();
  for (let x = x0 + 1.1; x < x1; x += 1.1) seg3(ctx, V, [x, y1, 0], [x, y1, d1]);
  ctx.stroke();
  for (let d = 2.5; d < d1 - .5; d += 3.6) fill3(ctx, V, [[x0, y0, d], [x1, y0, d], [x1, y0 + .45, d], [x0, y0 + .45, d]], '#2e2018');
  const r = prng(R.seed); ctx.strokeStyle = rgba(mixC(wc, '#3a2618', .6), .22); ctx.lineWidth = lwq(qb, .04); ctx.beginPath();
  for (let y = y0 + .8; y < y1 - .4; y += .6) { const a = x0 + r() * (x1 - x0) * .7, b = Math.min(x1, a + 2 + r() * 8); seg3(ctx, V, [a, y, d1 - .01], [b, y, d1 - .01]); }
  ctx.stroke();
  fill3(ctx, V, [[x0, y1 - .5, d1 - .02], [x1, y1 - .5, d1 - .02], [x1, y1, d1 - .02], [x0, y1, d1 - .02]], mixC(wc, '#3a2618', .45));
}
// the room's light: dark corners away from the lamp, a warm pool under it
function falloff(ctx, V, R) {
  const L = R.lamp, c = V.P(L.x, L.y + 3, L.d + 2), q = V.P(R.xc, R.y1, 9)[2], rad = Math.max(8, R.w * .78 * q);
  const g = ctx.createRadialGradient(c[0], c[1], rad * .06, c[0], c[1], rad);
  g.addColorStop(0, 'rgba(255,206,140,.12)'); g.addColorStop(.42, 'rgba(30,18,30,0)'); g.addColorStop(1, 'rgba(18,10,26,.58)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// a pendant lamp: cord, enamel shade, bulb, halo (the halo first: nothing adds onto the bulb's own white)
function lamp(ctx, t, V, R, lod) {
  const L = R.lamp; if (L.d < V.dn + .02) return;
  const [bx, by, q] = V.P(L.x, L.y, L.d), r = L.r * q;
  if (bx + r * 14 < 0 || bx - r * 14 > W || by + r * 14 < 0 || by - r * 14 > H) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const hr = r * 9 + 6, g = ctx.createRadialGradient(bx, by, r * .5, bx, by, hr);
  g.addColorStop(0, 'rgba(255,214,150,.55)'); g.addColorStop(.25, 'rgba(255,180,100,.16)'); g.addColorStop(1, 'rgba(255,170,90,0)');
  ctx.fillStyle = g; ctx.fillRect(bx - hr, by - hr, hr * 2, hr * 2); ctx.restore();
  // cord and shade
  const sh = L.r * 3.6, top = L.y - L.r * .9 - sh * .75;
  ctx.strokeStyle = '#1a1414'; ctx.lineWidth = Math.max(.6, q * .05); ctx.beginPath(); seg3(ctx, V, [L.x, R.y0, L.d], [L.x, top, L.d]); ctx.stroke();
  fill3(ctx, V, [[L.x - sh * .2, top, L.d], [L.x + sh * .2, top, L.d], [L.x + sh, L.y - L.r * .7, L.d], [L.x - sh, L.y - L.r * .7, L.d]], '#24403a');
  if (V.cy > L.y - L.r * .7 && disc3(ctx, V, L.x, L.y - L.r * .7, L.d, sh, 24)) { ctx.fillStyle = '#f2e6cc'; ctx.fill(); }
  if (lod > 0) { ctx.strokeStyle = rgba('#d8e8dc', .35); ctx.lineWidth = Math.max(.5, q * .03); ctx.beginPath(); seg3(ctx, V, [L.x - sh * .55, L.y - L.r * .7 - sh * .32, L.d - .01], [L.x - sh * .15, top + .05, L.d - .01]); ctx.stroke(); }
  // the bulb: opaque light with a soft rim
  const g2 = ctx.createRadialGradient(bx, by, r * .9, bx, by, r * 1.06); g2.addColorStop(0, LIGHT); g2.addColorStop(1, rgba(LIGHT, 0));
  ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(bx, by, r * 1.06, 0, TAU); ctx.fill();
}
// a person: hip at (x, yHip, d); arms [[i, tx, ty], …] reach world points (same depth); parts: 'all' | 'body' | 'front'
function who(ctx, t, V, R, x, yHip, d, pose, o, arms, part) {
  if (d < V.dn + .4) return null;
  const [sx, sy, q] = V.P(x, yHip, d), s = q * FIG;
  if (sx + 120 * s < 0 || sx - 120 * s > W || sy + 110 * s < 0 || sy - 130 * s > H) return null;
  const P = { ...pose }, L = R.lamp, lp = V.P(L.x, L.y, L.d);
  const oo = { t, light: { x: lp[0], y: lp[1], col: '#ffcf8a', a: .5 }, rim: '#ffd59a', rimSide: lp[0] < sx ? -1 : 1, ...o, part };
  if (arms) {
    const sh = [...(P.sh || POSES.stand.sh || [.18, .08])], el = [...(P.el || [.32, .26])];
    for (const [i, tx, ty] of arms) { const p = V.P(tx, ty, d), a = reachArm(sx, sy, s, P, i, !!o.flip, oo, [p[0], p[1]]); sh[i] = a.sh; el[i] = a.el; }
    P.sh = sh; P.el = el; P.lock = [1, 1];
  }
  return (o.kid ? figureKid : figure)(ctx, sx, sy, s, P, oo);
}
const D_ = {
  potter: { coat: '#8a4e3a', pants: '#3a3240', shoes: '#2a1a14', skin: '#c08a68', hair: '#2a1a14' },
  appr: { coat: '#3e5a6a', pants: '#2c2a38', shoes: '#1a1414', skin: '#6a4430', hair: '#151010' },
  a: { coat: '#6a3a4a', pants: '#2a2a3a', shoes: '#1a1414', skin: '#d9b08e', hair: '#2a1c14' },
  b: { coat: '#2f5a4e', pants: '#24243a', shoes: '#141018', skin: '#8d5f40', hair: '#151010' },
  c: { coat: '#b0703a', pants: '#2a2a3a', shoes: '#1a1414', skin: '#e9c3a0', hair: '#5a3a24' },
  d: { coat: '#34406a', pants: '#1e1e30', shoes: '#141018', skin: '#b98762', hair: '#1a1210' },
  old: { coat: '#5a4a3a', pants: '#2a2630', shoes: '#1a1414', skin: '#d9b08e', hair: '#d8d4cc' },
  dancer: { coat: '#c8504a', pants: '#2a2234', shoes: '#c8a090', skin: '#8d5f40', hair: '#151010' },
};
const yS = (R) => R.y1 - 3.52;                // hip height of someone standing on the room's floor
const yC = (R) => R.y1 - 2.0;                 // hip height of someone sitting on a chair

// ---------------------------------------------------------------- what happens in each room
const POTS = ['#9a8f84', '#d9a27c', '#3e6a7a', '#7a8a52', '#b8862e', '#c9b9a4', '#8a5a4a'];
function shelfPots(ctx, V, x0, x1, y, d, seed, lod, small = 1) {
  box3(ctx, V, x0, y, x1, y + .22, d - .8, d, { front: '#5a3e2a', top: '#7a5a3e' });
  if (lod < 1) { fill3(ctx, V, [[x0 + .3, y - 1.1 * small, d - .4], [x1 - .3, y - 1.1 * small, d - .4], [x1 - .3, y, d - .4], [x0 + .3, y, d - .4]], rgba('#9a8070', .8)); return; }
  const r = prng(seed); let x = x0 + .5;
  while (x < x1 - .8) {
    const w = (.5 + r() * .7) * small, h = (.7 + r() * 1.0) * small, col = POTS[Math.floor(r() * POTS.length)], neck = r() < .5;
    const p = [[x, y, d - .4], [x - .05 * w, y - h * .5, d - .4], [x + (neck ? .2 : 0) * w, y - h, d - .4], [x + w * (neck ? .8 : 1), y - h, d - .4], [x + w * 1.05, y - h * .5, d - .4], [x + w, y, d - .4]];
    fill3(ctx, V, p, col);
    fill3(ctx, V, [[x + w * .62, y - h * .9, d - .41], [x + w * .82, y - h * .9, d - .41], [x + w * .88, y - h * .2, d - .41], [x + w * .7, y - h * .2, d - .41]], rgba('#fff4e0', .18));
    x += w + .25 + r() * .5;
  }
}
// the potter's pot: a vase rising on the wheel (height grows), wet clay, the throwing rings turning
function pot(ctx, t, V, x, yb, d, lod) {
  const h = 1.15 + .55 * sm(clamp((t - 344.4) / 3.4)), k = Math.sqrt(1.15 / h);
  const prof = [[0, .66], [.32, .78], [.62, .62], [.84, .46], [1, .55]].map(([v, r]) => [yb - v * h, r * k]);
  const L = []; for (const [y, r] of prof) L.push([x - r, y, d]); for (let i = prof.length - 1; i >= 0; i--) L.push([x + prof[i][1], prof[i][0], d]);
  if (!path3(ctx, V, L)) return;
  const a = V.P(x - .8, yb, d), b = V.P(x + .8, yb, d), g = ctx.createLinearGradient(a[0], 0, b[0], 0);
  g.addColorStop(0, '#6a3a26'); g.addColorStop(.38, '#b8724a'); g.addColorStop(.62, '#a8623e'); g.addColorStop(1, '#4a2818');
  ctx.fillStyle = g; ctx.fill();
  // the mouth (we look down into it) and a wet highlight
  const top = prof[prof.length - 1]; if (V.cy < top[0] && disc3(ctx, V, x, top[0], d, top[1], 22)) { ctx.fillStyle = '#3a2016'; ctx.fill(); ctx.strokeStyle = '#c8865a'; ctx.lineWidth = Math.max(.6, a[2] * .05); ctx.stroke(); }
  if (lod < 1) return;
  ctx.save(); path3(ctx, V, L); ctx.clip();
  const ph = t * TAU * 2.1; ctx.strokeStyle = rgba('#e8b088', .45); ctx.lineWidth = Math.max(.6, a[2] * .03); ctx.beginPath();
  for (let i = 1; i < 9; i++) { const v = i / 9, y = yb - v * h, s = Math.sin(ph + i * 1.7) * .5 + .5; seg3(ctx, V, [x - .7 + s * .5, y, d - .9], [x + .2 + s * .4, y + .02, d - .9]); }
  ctx.stroke(); ctx.restore();
}
function potter(ctx, t, V, R, lod) {
  const yF = R.y1, W0 = { x: 717.0, d: 7.0, head: 524.25 };
  // back wall shelves with pots, clay sacks, the apprentice's wedging table
  shelfPots(ctx, V, 703.2, 713.6, 519.7, 17.9, 11, lod); shelfPots(ctx, V, 703.2, 713.6, 522.5, 17.9, 12, lod);
  shelfPots(ctx, V, 722.4, 739.0, 519.4, 17.9, 13, lod); shelfPots(ctx, V, 722.4, 739.0, 522.2, 17.9, 14, lod);
  for (const [sx, sd] of [[705.2, 15.2], [707.6, 14.4]]) fill3(ctx, V, [[sx - 1.1, yF, sd], [sx - 1.2, yF - 1.6, sd], [sx - .6, yF - 2.3, sd], [sx + .7, yF - 2.2, sd], [sx + 1.2, yF - 1.4, sd], [sx + 1.1, yF, sd]], '#b8a688');
  box3(ctx, V, 726.8, 523.35, 734.4, 523.75, 10.2, 12.6, { front: '#6a4a30', top: '#8a6a48', side: '#5a3e28' });
  for (const lx of [727.2, 733.8]) box3(ctx, V, lx, 523.75, lx + .35, yF, 10.4, 10.8, { front: '#4a3220' });
  const rock = .5 + .5 * Math.sin(t * TAU / 1.5), lump = [730.4 + .25 * rock, 523.35];
  fill3(ctx, V, [[lump[0] - 1.1, lump[1], 11.2], [lump[0] - .8, lump[1] - .55 - .1 * rock, 11.2], [lump[0] + .6, lump[1] - .62 + .1 * rock, 11.2], [lump[0] + 1.1, lump[1], 11.2]], '#9a6a4e');
  who(ctx, t, V, R, 735.9, yS(R) + .05, 11.4, { lean: .22 + .16 * rock, head: .3, hair: 'short' }, { seed: 72, dress: D_.appr, flip: true }, [[0, lump[0] + .6, lump[1] - .45], [1, lump[0] + .2, lump[1] - .5]]);
  // a bucket of slip, the kick wheel: flywheel, shaft, splash pan, wheel head
  cyl3(ctx, V, 713.3, yF - 1.1, yF, 8.6, .55, .48, '#7a6a5e'); if (V.cy < yF - 1.1 && disc3(ctx, V, 713.3, yF - 1.1, 8.6, .55, 18)) { ctx.fillStyle = '#5a3e30'; ctx.fill(); }
  const sitX = 720.9, sitD = 7.7, Pp = { ...POSES.sit, hip: [1.45, 1.52], kn: [1.36, 1.46], lean: .4 + .03 * Math.sin(t * 1.1), head: .34, hair: 'bun' };
  const potTopY = W0.head - (1.15 + .55 * sm(clamp((t - 344.4) / 3.4)));
  const arms = [[0, W0.x + .78, W0.head - (W0.head - potTopY) * .5], [1, W0.x + .2, potTopY + .35]];
  const oP = { seed: 71, dress: D_.potter, flip: true, accent: '#c8843a', accentPart: 'scarf' };
  // stool, then her body, then the wheel and the pot in front of her knees, then her front arm on the clay
  box3(ctx, V, sitX - .9, yF - 2.05, sitX + .9, yF - 1.8, sitD - .6, sitD + .6, { front: '#5a3e28', top: '#7a5a3e' });
  for (const lx of [sitX - .8, sitX + .55]) box3(ctx, V, lx, yF - 1.8, lx + .25, yF, sitD - .4, sitD - .15, { front: '#3a2618' });
  who(ctx, t, V, R, sitX, yF - 2.05, sitD, Pp, oP, arms, 'body');
  cyl3(ctx, V, W0.x, yF - .7, yF - .35, W0.d, 2.0, 2.0, '#4a3a30'); box3(ctx, V, W0.x - .12, W0.head, W0.x + .12, yF - .7, W0.d - .1, W0.d + .1, { front: '#2a2020' });
  cyl3(ctx, V, W0.x, W0.head - .2, W0.head + .9, W0.d, 1.85, 1.6, '#6a5a50');
  if (V.cy < W0.head - .2 && disc3(ctx, V, W0.x, W0.head - .2, W0.d, 1.85, 30)) { ctx.fillStyle = '#3a2a22'; ctx.fill(); }
  if (V.cy < W0.head && disc3(ctx, V, W0.x, W0.head, W0.d, 1.15, 30)) { ctx.fillStyle = '#5a3a2c'; ctx.fill(); }
  pot(ctx, t, V, W0.x, W0.head, W0.d, lod);
  who(ctx, t, V, R, sitX, yF - 2.05, sitD, Pp, oP, arms, 'front');
}
function drying(ctx, t, V, R, lod) {
  for (let k = 0; k < 3; k++) shelfPots(ctx, V, R.x0 + 1.2, R.x1 - 1.2, R.y0 + 3.4 + k * 2.6, 17.9, R.seed + k, lod, .75);
  const u = .5 + .5 * Math.sin(t * .9);
  who(ctx, t, V, R, R.x0 + R.w * .62, yS(R), 13.2, { head: -.2, hair: 'long' }, { seed: 81, dress: D_.c }, [[0, R.x0 + R.w * .62 - 1.6 - .3 * u, R.y0 + 3.0 + .4 * u], [1, R.x0 + R.w * .62 - 1.2, R.y0 + 3.4]]);
}
function dancer(ctx, t, V, R, lod) {
  // the mirror and the barre on the back wall, the dancer's slow port de bras on half-toe (her reflection in the glass)
  const mx0 = R.x0 + 4, mx1 = R.x1 - 4;
  fill3(ctx, V, [[mx0, R.y0 + 1.2, 17.95], [mx1, R.y0 + 1.2, 17.95], [mx1, R.y1 - .7, 17.95], [mx0, R.y1 - .7, 17.95]], '#8a8c96');
  fill3(ctx, V, [[mx0 + 2, R.y0 + 1.2, 17.94], [mx0 + 7, R.y0 + 1.2, 17.94], [mx0 + 3, R.y1 - .7, 17.94], [mx0 - 2 + 2, R.y1 - .7, 17.94]], rgba('#d8dce8', .22));
  box3(ctx, V, R.x0 + 2, R.y1 - 4.4, R.x1 - 2, R.y1 - 4.15, 16.8, 17.1, { front: '#7a5a3e' });
  const u = .5 - .5 * Math.cos(t * TAU / 4.8), x = R.xc + 1.5;
  const pose = { sh: [mix(.5, 2.75, u), mix(.35, 2.6, u)], el: [mix(.5, .2, u), mix(.5, .25, u)], hip: [.05, -.55 * u], kn: [0, .5 * u], head: -.12 * u, lean: -.04, hair: 'bun', skirt: true, lock: [1, 1] };
  who(ctx, t, V, R, x - 3, yS(R) - .3, 17.2, pose, { seed: 91, dress: { ...D_.dancer, coat: '#8a5050' }, shadeA: .35 });
  who(ctx, t, V, R, x, yS(R) - .3, 9, pose, { seed: 91, dress: D_.dancer, flip: true });
}
function sewing(ctx, t, V, R, lod) {
  const tx = R.xc - 4;
  box3(ctx, V, tx - 3, R.y1 - 3.3, tx + 3, R.y1 - 3.0, 9, 11.5, { front: '#5a3e28', top: '#7a5a3e' });
  fill3(ctx, V, [[tx - 1.6, R.y1 - 3.3, 10], [tx - 1.6, R.y1 - 4.6, 10], [tx + 1.1, R.y1 - 4.6, 10], [tx + 1.4, R.y1 - 4.0, 10], [tx + .9, R.y1 - 3.3, 10]], '#1a1618');
  fill3(ctx, V, [[tx - 2.8, R.y1 - 3.3, 9.9], [tx + 2.6, R.y1 - 3.3, 9.9], [tx + 2.9, R.y1 - 3.0, 9.9], [tx - 2.6, R.y1 - 3.0, 9.9]], '#c4482a');
  fill3(ctx, V, [[R.x1 - 5, R.y1 - 7.2, 14], [R.x1 - 3.4, R.y1 - 7.2, 14], [R.x1 - 3.1, R.y1 - 4.4, 14], [R.x1 - 5.3, R.y1 - 4.4, 14]], '#2a6a8a');
  const s = Math.sin(t * 7);
  who(ctx, t, V, R, tx + 4.2, yC(R), 10.2, { ...POSES.sit, lean: .25, head: .3, hair: 'bun' }, { seed: 93, dress: D_.a, flip: true }, [[0, tx + .6 + .15 * s, R.y1 - 3.45], [1, tx - .5, R.y1 - 3.5]]);
}
function loom(ctx, t, V, R, lod) {
  const lx = R.xc - 5, d = 11;
  for (const px of [lx - 3, lx + 3]) box3(ctx, V, px, R.y0 + 2.2, px + .35, R.y1, d, d + .4, { front: '#4a3220' });
  box3(ctx, V, lx - 3, R.y0 + 2.2, lx + 3.35, R.y0 + 2.6, d, d + .4, { front: '#5a3e28' });
  fill3(ctx, V, [[lx - 2.6, R.y0 + 2.6, d + .2], [lx + 2.9, R.y0 + 2.6, d + .2], [lx + 2.9, R.y1 - 3, d + .2], [lx - 2.6, R.y1 - 3, d + .2]], '#c9a070');
  const u = .5 + .5 * Math.sin(t * 2.2);
  who(ctx, t, V, R, lx + 5, yC(R), 9.5, { ...POSES.sit, lean: .12, head: .1, hair: 'short' }, { seed: 95, dress: D_.b, flip: true }, [[0, lx + 1.5 - 2 * u, R.y1 - 4], [1, lx + 1, R.y1 - 4.2]]);
}
function violin(ctx, t, V, R, lod) {
  const x = R.xc + 2, d = 9.5, bow = Math.sin(t * TAU / 1.9);
  box3(ctx, V, x - 4.6, R.y1 - 3.8, x - 2.6, R.y1 - 2.6, 8.6, 8.7, { front: '#e8dcc0' });
  box3(ctx, V, x - 3.65, R.y1 - 2.6, x - 3.5, R.y1, 8.6, 8.7, { front: '#2a2020' });
  const r = who(ctx, t, V, R, x, yS(R), d, { head: .18, hair: 'short' }, { seed: 97, dress: D_.d, flip: true }, [[1, x - 2.0, R.y1 - 6.0], [0, x - .6 + 1.3 * bow, R.y1 - 5.0]]);
  if (!r) return;
  const a = V.P(x - .2, R.y1 - 5.9, d - .2), b = V.P(x - 2.0, R.y1 - 6.0, d - .2), h = r.hand(0);
  ctx.strokeStyle = '#7a3a1a'; ctx.lineWidth = Math.max(1, a[2] * .32); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  ctx.strokeStyle = '#d8c8a0'; ctx.lineWidth = Math.max(.5, a[2] * .05); ctx.beginPath(); ctx.moveTo(h[0] - a[2] * 1.6, h[1] - a[2] * .5); ctx.lineTo(h[0] + a[2] * 1.4, h[1] + a[2] * .45); ctx.stroke();
}
function piano(ctx, t, V, R, lod) {
  const px = R.x0 + 6, d = 15;
  box3(ctx, V, px, R.y1 - 5.6, px + 6.4, R.y1, d, d + 2.4, { front: '#2a1a14', top: '#3a2418', side: '#1e140e' });
  fill3(ctx, V, [[px + .3, R.y1 - 3.3, d - .02], [px + 6.1, R.y1 - 3.3, d - .02], [px + 6.1, R.y1 - 2.9, d - .02], [px + .3, R.y1 - 2.9, d - .02]], '#efe6d2');
  const k = Math.sin(t * 3.1);
  who(ctx, t, V, R, px + 3.4, yC(R), d - 2.6, { ...POSES.sit, lean: .1, head: .15, hair: 'long' }, { seed: 99, dress: D_.c }, [[0, px + 3.6 + .4 * k, R.y1 - 3.3], [1, px + 2.2, R.y1 - 3.3]]);
  who(ctx, t, V, R, px + 9.4, R.y1 - 2.55, d - 1.5, { head: .1 }, { seed: 98, dress: D_.b, kid: true, flip: true });
}
function joiner(ctx, t, V, R, lod) {
  const bx = R.xc - 3, d = 9.5, u = .5 - .5 * Math.cos(t * TAU / 1.7);
  for (let i = 0; i < 5; i++) box3(ctx, V, R.x0 + 3 + i * 1.6, R.y0 + 2.4, R.x0 + 3.3 + i * 1.6, R.y0 + 5.4 + (i % 2), 17.6, 17.9, { front: '#3a3030' });
  box3(ctx, V, bx - 5, R.y1 - 3.7, bx + 5, R.y1 - 3.2, d - 1, d + 1.4, { front: '#8a6a48', top: '#a88660', side: '#6a4a30' });
  for (const lx of [bx - 4.7, bx + 4.3]) box3(ctx, V, lx, R.y1 - 3.2, lx + .4, R.y1, d - .8, d - .4, { front: '#5a3e28' });
  const plane = bx - 1.5 + 2.6 * u;
  box3(ctx, V, plane - .7, R.y1 - 4.25, plane + .7, R.y1 - 3.7, d, d + .5, { front: '#6a4a2a', top: '#8a6a48' });
  if (lod > 0) { ctx.strokeStyle = '#e8c890'; ctx.lineWidth = Math.max(.6, V.P(bx, 0, d)[2] * .06); ctx.beginPath(); for (let i = 0; i < 3; i++) { const c = V.P(plane + .9 + i * .35, R.y1 - 4.3 - i * .2, d), rr = V.P(0, 0, d)[2] * (.25 + .08 * i); ctx.moveTo(c[0] + rr, c[1]); ctx.arc(c[0], c[1], rr, 0, 4.5); } ctx.stroke(); }
  who(ctx, t, V, R, bx + 6.6, yS(R), d + .4, { lean: .3, head: .3 }, { seed: 101, dress: D_.old, flip: true }, [[0, plane + .4, R.y1 - 4.2], [1, plane - .3, R.y1 - 4.3]]);
  who(ctx, t, V, R, bx - 6.6, R.y1 - 2.55, d + .6, { head: .2 }, { seed: 102, dress: D_.c, kid: true }, [[0, plane - .9, R.y1 - 4.0]]);
}
function models(ctx, t, V, R, lod) {
  const tx = R.xc - 2, d = 10;
  box3(ctx, V, tx - 4, R.y1 - 3.4, tx + 4, R.y1 - 3.1, d - 1, d + 1.5, { front: '#6a4a30', top: '#8a6a48' });
  fill3(ctx, V, [[tx - 2.2, R.y1 - 3.5, d], [tx + 2.4, R.y1 - 3.5, d], [tx + 1.8, R.y1 - 4.2, d], [tx - 1.8, R.y1 - 4.2, d]], '#5a3a2a');
  box3(ctx, V, tx - .05, R.y1 - 7.3, tx + .1, R.y1 - 4.2, d, d + .1, { front: '#3a2a20' });
  fill3(ctx, V, [[tx + .1, R.y1 - 7.1, d], [tx + 1.9, R.y1 - 5.0, d], [tx + .1, R.y1 - 4.5, d]], '#efe6d2');
  const sw = Math.sin(t * .7) * .3; fill3(ctx, V, [[R.x1 - 9 + sw, R.y0 + 2.6, 8], [R.x1 - 5 + sw, R.y0 + 2.4, 8], [R.x1 - 4.6 + sw, R.y0 + 2.9, 8], [R.x1 - 9.4 + sw, R.y0 + 3.0, 8]], '#c8c0b0');
  who(ctx, t, V, R, tx + 5.2, yS(R), d + .2, { lean: .38, head: .35 }, { seed: 103, dress: D_.a, flip: true }, [[0, tx + 1.5, R.y1 - 4.4], [1, tx + .8, R.y1 - 4.6]]);
}
function writer(ctx, t, V, R, lod) {
  const dx = R.xc + 3, d = 11;
  for (let k = 0; k < 3; k++) shelfPots(ctx, V, R.x0 + 1.5, R.x0 + 12, R.y0 + 3 + k * 2.4, 17.9, R.seed + 5 + k, lod, .6);
  box3(ctx, V, dx - 3.5, R.y1 - 3.2, dx + 3.5, R.y1 - 2.9, d - 1, d + 1.5, { front: '#5a3e28', top: '#7a5a3e' });
  fill3(ctx, V, [[dx - 1.5, R.y1 - 3.22, d], [dx + .5, R.y1 - 3.22, d], [dx + .5, R.y1 - 3.3, d], [dx - 1.5, R.y1 - 3.3, d]], '#efe6d2');
  const w = Math.sin(t * 5) * .15;
  who(ctx, t, V, R, dx + 4, yC(R), d, { ...POSES.sit, lean: .3, head: .35, hair: 'short' }, { seed: 105, dress: D_.d, flip: true }, [[0, dx - .4 + w, R.y1 - 3.35], [1, dx - 1.2, R.y1 - 3.3]]);
}
function board(ctx, t, V, R, lod) {
  // the passage where the office was: the lane behind opens through an arch, a lantern; the notice board, people reading
  const ax0 = R.xc - 6, ax1 = R.xc + 6;
  fill3(ctx, V, [[ax0, R.y1, 17.96], [ax0, R.y0 + 3, 17.96], [R.xc, R.y0 + 1, 17.96], [ax1, R.y0 + 3, 17.96], [ax1, R.y1, 17.96]], '#2a2440');
  const lan = V.P(R.xc + 3, R.y0 + 4, 18); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(lan[0], lan[1], 0, lan[0], lan[1], lan[2] * 4); g.addColorStop(0, 'rgba(255,190,110,.55)'); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.fillRect(lan[0] - lan[2] * 4, lan[1] - lan[2] * 4, lan[2] * 8, lan[2] * 8); ctx.restore();
  const bx = R.xc - 4, d = 10;
  for (const px of [bx - 3.3, bx + 3]) box3(ctx, V, px, R.y0 + 3.2, px + .3, R.y1, d, d + .3, { front: '#3a2a20' });
  box3(ctx, V, bx - 3.5, R.y0 + 3.4, bx + 3.5, R.y1 - 4.6, d - .1, d, { front: '#6a4a30' });
  const r = prng(R.seed);
  for (let i = 0; i < 7; i++) { const x = bx - 3 + (i % 4) * 1.65 + r() * .2, y = R.y0 + 3.8 + Math.floor(i / 4) * 2.4 + r() * .3; fill3(ctx, V, [[x, y, d - .12], [x + 1.3, y, d - .12], [x + 1.3, y + 1.9, d - .12], [x, y + 1.9, d - .12]], i === 5 ? '#fbf3e0' : '#e8dcc4'); }
  who(ctx, t, V, R, bx + 1.5, yS(R), d - 2.4, { head: -.1 }, { seed: 107, dress: D_.b });
  who(ctx, t, V, R, bx - 2.4, yS(R), d - 3, { head: -.15, hair: 'long', skirt: true }, { seed: 108, dress: D_.c });
  who(ctx, t, V, R, bx + 5.6, yS(R), d - 1.6, { head: -.05 }, { seed: 109, dress: D_.a, flip: true }, [[0, bx + 2.6, R.y0 + 5.6]]);
}
function supper(ctx, t, V, R, lod) {
  const tx = R.xc, d = 10;
  box3(ctx, V, tx - 5, R.y1 - 3.3, tx + 5, R.y1 - 3.0, d - 1.4, d + 1.4, { front: '#e8dcc4', top: '#f2e8d4' });
  for (const lx of [tx - 4.6, tx + 4.2]) box3(ctx, V, lx, R.y1 - 3.0, lx + .35, R.y1, d - 1.2, d - .9, { front: '#4a3220' });
  who(ctx, t, V, R, tx - 6.3, yC(R), d + .5, { ...POSES.sit, lean: .1, hair: 'long' }, { seed: 111, dress: D_.c }, [[0, tx - 3.6, R.y1 - 3.5]]);
  who(ctx, t, V, R, tx + 6.3, yC(R), d + .5, { ...POSES.sit, lean: .14 }, { seed: 112, dress: D_.d, flip: true }, [[0, tx + 3.4, R.y1 - 3.5]]);
  who(ctx, t, V, R, tx + .5, R.y1 - 2.55, d + 2.4, { head: .1 }, { seed: 113, dress: D_.b, kid: true });
  who(ctx, t, V, R, tx - 1.5, yS(R), d + 3.4, { head: .25 }, { seed: 114, dress: D_.a }, [[0, tx - .2, R.y1 - 4.4 + .2 * Math.sin(t * 1.3)]]);
}
function painter(ctx, t, V, R, lod) {
  const ex = R.xc - 6, d = 9;
  for (let i = 0; i < 3; i++) fill3(ctx, V, [[R.x0 + 2 + i * 2.6, R.y1, 17 - i * .5], [R.x0 + 2.4 + i * 2.6, R.y1 - 5 + i, 17 - i * .5], [R.x0 + 4.4 + i * 2.6, R.y1 - 5 + i, 17 - i * .5], [R.x0 + 4.2 + i * 2.6, R.y1, 17 - i * .5]], ['#c8b090', '#a89878', '#d8c8a8'][i]);
  // the easel and the painting (a hill at dusk in a few strokes of colour)
  box3(ctx, V, ex - .15, R.y1 - 9.6, ex + .15, R.y1, d + .4, d + .6, { front: '#5a3e28' });
  const cv = [[ex - 3.2, R.y1 - 9.2, d], [ex + 3.2, R.y1 - 9.2, d], [ex + 3.2, R.y1 - 4.6, d], [ex - 3.2, R.y1 - 4.6, d]];
  fill3(ctx, V, cv, '#efe6d2');
  fill3(ctx, V, [[ex - 3, R.y1 - 6.4, d - .02], [ex - 1, R.y1 - 8.0, d - .02], [ex + 1.2, R.y1 - 7.1, d - .02], [ex + 3, R.y1 - 7.6, d - .02], [ex + 3, R.y1 - 4.8, d - .02], [ex - 3, R.y1 - 4.8, d - .02]], '#6a5a8a');
  fill3(ctx, V, [[ex - 3, R.y1 - 9.0, d - .02], [ex + 3, R.y1 - 9.0, d - .02], [ex + 3, R.y1 - 7.9, d - .02], [ex - 3, R.y1 - 8.3, d - .02]], '#e8a060');
  const b = Math.sin(t * 2.4);
  who(ctx, t, V, R, ex + 5.4, yS(R), d + .4, { head: .05, hair: 'curly' }, { seed: 115, dress: D_.b, flip: true }, [[0, ex + 1.4 + .5 * b, R.y1 - 7.2 + .4 * b], [1, ex + 4.4, R.y1 - 5.6]]);
  box3(ctx, V, R.x1 - 12, R.y1 - 3.0, R.x1 - 7, R.y1 - 2.7, 12, 14, { front: '#6a4a30', top: '#8a6a48' });
  fill3(ctx, V, [[R.x1 - 10.2, R.y1 - 3.0, 13], [R.x1 - 10.4, R.y1 - 4.6, 13], [R.x1 - 9.2, R.y1 - 4.6, 13], [R.x1 - 9.4, R.y1 - 3.0, 13]], '#3e6a7a');
  who(ctx, t, V, R, R.x1 - 4.5, yC(R), 13.5, { ...POSES.sit, lean: .05, head: -.05, hair: 'long' }, { seed: 116, dress: D_.c, flip: true });
}
function kitchen(ctx, t, V, R, lod) {
  const sx = R.x0 + 8, d = 15;
  box3(ctx, V, sx - 3, R.y1 - 3.4, sx + 3, R.y1, d, d + 2.4, { front: '#2a2a30', top: '#3a3a40' });
  cyl3(ctx, V, sx - .8, R.y1 - 4.6, R.y1 - 3.4, d + 1, .9, .9, '#6a6a70');
  if (lod > 0) { ctx.strokeStyle = rgba('#f2ece0', .25); ctx.lineWidth = Math.max(1, V.P(sx, 0, d)[2] * .25); ctx.beginPath(); for (let i = 0; i < 2; i++) { const p = V.P(sx - .8 + .4 * Math.sin(t * 1.2 + i * 2), R.y1 - 5.2 - i * 1.4, d + 1); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + p[2] * .3 * Math.sin(t + i), p[1] - p[2] * 1.1); } ctx.stroke(); }
  who(ctx, t, V, R, sx + 4.6, yS(R), d - 1.6, { lean: .12, head: .25, hair: 'bun' }, { seed: 117, dress: D_.c, flip: true }, [[0, sx - .4 + .3 * Math.sin(t * 2.6), R.y1 - 4.7]]);
  const cx = R.x1 - 14; box3(ctx, V, cx - 3, R.y1 - 3.4, cx + 3, R.y1 - 3.1, 10, 12, { front: '#6a4a30', top: '#8a6a48' });
  for (const lx of [cx - 2.8, cx + 2.4]) box3(ctx, V, lx, R.y1 - 3.1, lx + .35, R.y1, 10.2, 10.5, { front: '#4a3220' });
  const c = Math.abs(Math.sin(t * 4.2));
  who(ctx, t, V, R, cx + 4.2, yS(R), 11.2, { lean: .3, head: .35 }, { seed: 118, dress: D_.d, flip: true }, [[0, cx + 1, R.y1 - 3.6 - .5 * c], [1, cx, R.y1 - 3.5]]);
}
function reader(ctx, t, V, R, lod) {
  const ax = R.xc - 2, d = 12;
  box3(ctx, V, ax - 2.4, R.y1 - 2.2, ax + 2.4, R.y1, d - 1, d + 1.5, { front: '#6a2a2a', top: '#7a3a34' });
  box3(ctx, V, ax + 1.6, R.y1 - 5, ax + 2.6, R.y1 - 2.2, d - .8, d + 1.5, { front: '#5a2424' });
  box3(ctx, V, ax - 6, R.y1 - 7.5, ax - 5.8, R.y1, d + 1, d + 1.2, { front: '#2a2020' });
  who(ctx, t, V, R, ax, R.y1 - 2.1, d, { ...POSES.sit, ...POSES.hold, hip: [1.42, 1.5], kn: [1.42, 1.5], lean: -.05, hair: 'short' }, { seed: 119, dress: D_.a, flip: true });
}
const KIND = { potter, drying, dancer, sewing, loom, violin, piano, joiner, models, writer, board, supper, painter, kitchen, reader };

// one room in perspective (screen space; the caller clips to its opening)
export function drawRoom(ctx, t, V, R) {
  const q = V.P(R.xc, R.y1, 9)[2], lod = q * R.w > 900 ? 2 : q * R.w > 60 ? 1 : 0;
  ctx.save(); ctx.lineCap = 'butt';
  shell(ctx, t, V, R, lod);
  if (q * R.w > 14) KIND[R.kind](ctx, t, V, R, lod);
  falloff(ctx, V, R);
  lamp(ctx, t, V, R, lod);
  ctx.restore();
}

// ---------------------------------------------------------------- the frame
let CUR = null;
const roomCB = (ctx, rm, sx, sy, sw, sh, t) => { const R = rooms()[rm.id]; if (R && CUR) drawRoom(ctx, t, CUR, R); };
export function drawStreet(ctx, t, V, st = {}) {
  CUR = V;
  if (V.D <= DH) {   // inside (or right at) the potter's room: the room is the frame
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#1a1220'; ctx.fillRect(0, 0, W, H); drawRoom(ctx, t, V, rooms().potter); ctx.restore();
    return;
  }
  const hs = { ...(st.hill || {}), cutaway: 1, room: roomCB };
  if (!st.split) { drawHill(ctx, t, V.cam, hs); return; }
  // ★ the sweep: ESTEEM, then SELF-ACTUALIZATION: the hill drawn twice, split along the self-actualization terrace wall (world y)
  const ys = (st.split.y - V.cam.y) * V.cam.z + H / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(0, ys, W, H - ys); ctx.clip(); drawHill(ctx, t, V.cam, hs); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, ys); ctx.clip(); drawHill(ctx, t, V.cam, { ...hs, ...st.split.hill, room: null }); ctx.restore();
}
