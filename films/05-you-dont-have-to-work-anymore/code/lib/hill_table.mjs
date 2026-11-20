// hill_table.mjs · HILL 2 out, the long table: a night street on the Belonging terrace; neighbours carry their tables
// out of their doors and join them end to end; lanterns light along the joined line (the line that later rings the
// terrace). Camera rises and pulls back; a row of dark foreground roofs rises past the lens. Plate coords = screen px at z 1.
import { C, rgba, clamp, mix, prng, mixHex, shade, roughPoly, roughRect, roughLine, sagLine, hatch, house } from './art.mjs';
import { cv, toImg, fogW, bloomW, poolW, mips, drawLayer, proj, setRegion, fig, q } from './hill_art.mjs';

const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const lin = (a, b, t) => clamp((t - a) / (b - a));
export const TY = 780;                 // table top line
const R0 = { x: -900, y: -500, w: 3720, h: 1900 };
let L = null; const DOORS = [];
function mk(rect, S, paint) { const [c, g] = cv(rect.w * S, rect.h * S); g.setTransform(S, 0, 0, S, -rect.x * S, -rect.y * S); setRegion([rect.x, rect.y, rect.x + rect.w, rect.y + rect.h]); paint(g, S); setRegion(null); return c; }
function paint(ctx, S) {
  const g = ctx.createLinearGradient(0, R0.y, 0, 600); g.addColorStop(0, '#05061a'); g.addColorStop(.5, '#121a40'); g.addColorStop(1, '#2a2a5a'); ctx.fillStyle = g; ctx.fillRect(R0.x, R0.y, R0.w, R0.h);
  const r = prng(4); for (let i = 0; i < 500; i++) { const m = r(); ctx.fillStyle = rgba('#dfe8ff', .1 + .5 * m * m * m); ctx.fillRect(R0.x + r() * R0.w, R0.y + r() * 700, 1.3, 1.3); }
  // upper terraces (small, lit windows), then the street's own houses, big, with doors
  const rr = prng(9); let x = R0.x;
  while (x < R0.x + R0.w) { const w = 60 + rr() * 80, h = 60 + rr() * 70; house(ctx, rr, x + w / 2, 300, w, h, { wall: mixHex('#1c2445', '#2a3256', rr()), lit: (a, b, q2) => q2() < .5 ? .8 : 0, amp: .6, floorH: 26, colW: 24, trim: false, door: false }); x += w + 6; }
  fogW(ctx, S, { x0: R0.x, x1: R0.x + R0.w, y0: 200, y1: 360, col: '#6c7cba', a: .35, seed: 4, cover: .7, soft: .4, k: .25, sx: .004, sy: .03 });
  roughRect(ctx, R0.x, 300, R0.w, 70, '#0e1230', { amp: 1, seed: 3 }); ctx.fillStyle = rgba(C.amberHot, .3); ctx.fillRect(R0.x, 300, R0.w, 1.5);
  x = R0.x + 20; const walls = ['#2b1f2c', '#1d2140', '#2a1e2a', '#30232c', '#232843', '#3a2a3a'];
  while (x < R0.x + R0.w) { const w = 180 + rr() * 160, h = 260 + rr() * 140, wall = walls[Math.floor(rr() * walls.length)];
    const res = house(ctx, rr, x + w / 2, 700, w, h, { wall, lit: (a, b, q2) => { const u = q2(); return u < .6 ? .7 + .3 * q2() : 0; }, amp: 1.2, floorH: 90, colW: 70, wscale: 2.2, side: (rr() - .5) * .2, light: { x: x + w / 2, y: 760, col: C.amber, a: .45, r: h }, roofs: ['gable', 'hip', 'parapet', 'mansard', 'gable'] });
    for (const d of res.win) if (d.door) DOORS.push(d);
    x += w + 8 + rr() * 10; }
  // street: cobbles + a warm wash from the doors
  const sg = ctx.createLinearGradient(0, 700, 0, 1400); sg.addColorStop(0, '#1a1830'); sg.addColorStop(1, '#07071a'); ctx.fillStyle = sg; ctx.fillRect(R0.x, 700, R0.w, 700);
  ctx.save(); ctx.beginPath(); ctx.rect(R0.x, 702, R0.w, 700); ctx.clip(); hatch(ctx, [R0.x, 702, R0.w, 700], { angle: 0, gap: 11, w: 1, col: '#8a86b8', a: .08, seed: 5, broken: .45 }); ctx.restore();
  for (const d of DOORS) poolW(ctx, S, d.x, 712, 120, 30, { a: .35, k: .5, seed: d.x | 0 });
  // string lights zig-zag over the street
  for (let i = 0; i < 9; i++) { const a = [R0.x + 120 + i * 420, 420 + (i % 2) * 30], b = [a[0] + 420, 440 - (i % 2) * 30], pts = sagLine(a, b, 50);
    roughLine(ctx, pts, { w: 1.6, col: '#0a0a18', seed: i }); for (let j = 1; j < pts.length - 1; j += 3) bloomW(ctx, S, pts[j][0], pts[j][1] + 4, 14, { a: .9, k: .1, seed: i * 50 + j }); }
}
export function tableLayers() { if (L) return L; L = { A: { m: mips(mk(R0, 1, paint), 1), ...R0 } }; return L; }
export async function prepareTable() { const l = tableLayers(); await Promise.all(l.A.m.map((m) => m.c.decode())); }

// segments: each neighbour carries one table from a door to its slot in the line
const RIM = '#ffd9a8';
const DRS = [{ coat: '#6a3a2e', pants: '#24182a', skin: '#e2b48e', hair: '#2a1a14' }, { coat: '#3e3550', pants: '#1a1626', skin: '#c99a76', hair: '#151018' }, { coat: '#7a5a3a', pants: '#2a2230', skin: '#efc39d', hair: '#3a2214' }, { coat: '#4a4658', pants: '#24222e', skin: '#dcb291', hair: '#cfc8bc' }];
export function drawTable(ctx, t, cam, t0, tJoin) {
  const Ly = tableLayers(), M = proj(cam, 1), k = M.k;
  ctx.fillStyle = '#05061a'; ctx.fillRect(0, 0, 1920, 1080);
  drawLayer(ctx, Ly.A, M);
  const slotW = 150, n = 13, x0 = 960 - n * slotW / 2;
  const r = prng(7);
  for (let i = 0; i < n; i++) {
    const sx = x0 + i * slotW, door = DOORS.reduce((b, d) => Math.abs(d.x - sx) < Math.abs(b.x - sx) ? d : b, DOORS[0] || { x: sx });
    const st = t0 - .6 + Math.abs(i - n / 2) * .09 + r() * .15, u = sm(lin(st, st + .9, t));
    const tx = mix(door.x - 40, sx, u), ty = mix(735, TY, u), joined = u >= .999;
    // the table (top + legs), drawn in plate coords
    ctx.fillStyle = '#3a2430'; ctx.fillRect(M.X(tx + 6), M.Y(ty + 8), 6 * k, 50 * k); ctx.fillRect(M.X(tx + slotW - 12), M.Y(ty + 8), 6 * k, 50 * k);
    ctx.fillStyle = '#e8d6b4'; ctx.fillRect(M.X(tx), M.Y(ty), (slotW + .5) * k, 9 * k);    // tablecloth
    ctx.fillStyle = rgba('#000', .25); ctx.fillRect(M.X(tx), M.Y(ty + 9), slotW * k, 3 * k);
    // the neighbour carrying it (walk), then sitting/standing at it
    const ph = q(((t - st) * 1.4) % 1, 10), s2 = Math.sin(ph * 6.283), carrying = u > 0 && u < 1;
    const pose = carrying ? { lean: .05, head: 0, sh: [1.25, 1.1], el: [.25, .3], hip: [.32 * s2, -.32 * s2], kn: [.05 + .3 * Math.max(0, -s2), .05 + .3 * Math.max(0, s2)], hair: i % 2 ? 'bun' : 'short' } : { lean: .02, head: -.1 + .1 * Math.sin(t + i), sh: [.4, .2], el: [.8, .6], hip: [.05, -.05], kn: [0, .05], hair: i % 2 ? 'bun' : 'short' };
    if (i % 2 === 0 || carrying) { const s = .62, sR = s * 1.6, sc = s * k / sR; fig(ctx, 'tb' + (i % 4) + (carrying ? 'c' + ph : 's' + q(Math.sin(t + i) * .5 + .5, 4)), M.X(tx + slotW * .5), M.Y(ty + 58) - 88 * s * k, sR, pose, { dress: DRS[i % 4], rim: RIM, rimSide: i % 2 ? 1 : -1, rimW: 2 }, { t, ph: i, sc }); }
    // lantern on the joined table
    const lj = sm(lin(tJoin - .9 + Math.abs(i - n / 2) * .06, tJoin - .6 + Math.abs(i - n / 2) * .06, t));
    if (lj > 0) { const X = M.X(sx + slotW / 2), Y = M.Y(TY - 8); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(X, Y, 0, X, Y, 70 * k); g.addColorStop(0, rgba(C.amberHot, .7 * lj)); g.addColorStop(.25, rgba(C.amber, .25 * lj)); g.addColorStop(1, rgba(C.amber, 0)); ctx.fillStyle = g; ctx.fillRect(X - 70 * k, Y - 70 * k, 140 * k, 140 * k); ctx.restore(); ctx.fillStyle = rgba('#fff1d0', lj); ctx.fillRect(X - 3 * k, Y - 6 * k, 6 * k, 8 * k); }
  }
  // the continuous amber line (tablecloth edge lit) once joined
  const line = sm(lin(tJoin - 1, tJoin, t));
  if (line > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.amber, .5 * line); ctx.lineWidth = 6 * k; ctx.beginPath(); ctx.moveTo(M.X(x0), M.Y(TY + 1)); ctx.lineTo(M.X(x0 + n * slotW), M.Y(TY + 1)); ctx.stroke(); ctx.strokeStyle = rgba('#ffe2b0', .8 * line); ctx.lineWidth = 1.6 * k; ctx.stroke(); ctx.restore(); }
  // foreground roofs rising past the lens as the camera lifts
  const Mf = proj(cam, 1.7); ctx.fillStyle = '#05050f'; const rr = prng(12);
  let x = -900; while (x < 2800) { const w = 200 + rr() * 220, h = 60 + rr() * 90, gy = 1300; ctx.beginPath(); ctx.moveTo(Mf.X(x), Mf.Y(gy + 400)); ctx.lineTo(Mf.X(x), Mf.Y(gy - h)); ctx.lineTo(Mf.X(x + w / 2), Mf.Y(gy - h - w * .3)); ctx.lineTo(Mf.X(x + w), Mf.Y(gy - h)); ctx.lineTo(Mf.X(x + w), Mf.Y(gy + 400)); ctx.fill(); x += w - 4; }
  return M;
}
