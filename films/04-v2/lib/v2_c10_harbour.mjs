// Film 4 v2 · c10 · the harbour at the end of the lane (10.05 → 10.07), one 3D set in the town's metres (X along the lane, Y up, Z):
// the lane runs out onto the harbour wall (the mole, Z 18.6–21.4) that goes out to sea along +X; the basin lies south of it (−Z),
// a stone bridge with three arches crosses the basin from the mole to the south quay (X 24–26.6); the sun sets over the sea (+X).
// Two old friends sit on the mole's south edge, legs over the basin, a bag of cherries between them (10.06). The camera tilts down to
// their reflection; a slow swell flattens it into two dark streaks that open out into two small boats (10.07), which drift apart;
// one is pulled through the first arch — and beyond the bridge lies the other city (lib/v2_c10_city.mjs, drawn through the arch).
//   harbour(ctx, C, t, E, K, o)   o.beyond(ctx, C): draws World 2 inside the arch exit (from K.swap on); o.fromLane: seen down the lane
//   boats(t, K)                   the two boats' state (position, heading, morph), shared with World 2
//   QY, WY, HBR                    the mole top, the water level, the geometry
import { W, H, rgba, clamp, mix, prng, mixHex, shade, TAU, poly3, fill3, seg3, hatchQuad, at3, box3, radial, glowImg, glowAt, sm2, smr, hash, eoX, eiX, qio, trace, proj3, canvas } from './v2_c10_kit.mjs';
import { person, POSES, U, reachArm } from './v2_c10_people.mjs';
import { laneY, sun, sky } from './v2_c10_garden.mjs';

export const QY = laneY(15.5), WY = QY - 1.25;
export const HBR = {
  mole: { x0: 15.5, x1: 64, z0: 18.6, z1: 21.4 },
  bridge: { x0: 23.1, x1: 25.7, z0: 4, z1: 18.6, top: QY + .55 },
  arches: [[14.8, 17.8], [11.0, 14.0], [7.2, 10.2]],
  friends: [
    { x: 21.2, seed: 61, h: 1.0, hair: 'grey', dress: { coat: '#4a5a7a', pants: '#2a2a36', hair: '#cfc8bc', skin: '#e3b894', shoes: '#2a1a14' } },
    { x: 22.05, seed: 62, h: .97, hair: 'short', dress: { coat: '#c8963a', pants: '#3a3040', hair: '#3a2a22', skin: '#c99872', shoes: '#1a1210' } },
  ],
  bag: 21.63,
};
const B = HBR.bridge, M = HBR.mole;
// arch opening at the face plane X = xf: the circle above the water, from the +Z springing over the crown to the −Z springing
const ARCH_DY = -.1;
function archPts(a, xf, n = 20) {
  const zc = (a[0] + a[1]) / 2, r = (a[1] - a[0]) / 2, yc = WY + ARCH_DY, th0 = Math.asin(-ARCH_DY / r), P = [];
  for (let i = 0; i <= n; i++) { const th = mix(th0, Math.PI - th0, i / n); P.push([xf, yc + r * Math.sin(th), zc + r * Math.cos(th)]); }
  return P;
}
// ---------------------------------------------------------------- the boats: reflections → streaks → boats → drifting apart
//   K.swap: the reflections are flat streaks; K.boatA0 / K.boatB0: the water points under the reflections at that moment (set by town)
const bez = (a, b, c, u) => [mix(mix(a[0], b[0], u), mix(b[0], c[0], u), u), mix(mix(a[1], b[1], u), mix(b[1], c[1], u), u)];
export function boats(t, K) {
  const m = t < K.swap ? sm2((t - (K.swap - .5)) / .5) : 1;                          // the reflections flatten (0 → 1)
  const n = t < K.swap ? -1 : sm2((t - K.swap) / .55);                               // the boats open out (0 → 1); −1: not yet
  const A0 = K.boatA0, B0 = K.boatB0, d = Math.max(0, t - K.swap - .15);
  // B: pulled toward the first arch, faster through the bridge (the current), then on along the canal beyond
  const zc = (HBR.arches[0][0] + HBR.arches[0][1]) / 2, P1 = [B.x0 - 1.0, zc], Cn = [B0[0] + .5, B0[1] - 1.3];
  const ramp = (v, tau) => v * (d - tau * (1 - Math.exp(-d / tau)));                // eases in, then a steady drift
  const sB = ramp(2.5, .5), L1 = Math.hypot(P1[0] - B0[0], P1[1] - B0[1]) * 1.04; let xb, zb, hb;
  if (sB < L1) { const u = sB / L1, p = bez(B0, Cn, P1, u), q = bez(B0, Cn, P1, Math.min(1, u + .01)); [xb, zb] = p; hb = Math.atan2(q[1] - p[1], q[0] - p[0]); }
  else { xb = P1[0] + (sB - L1); zb = zc; hb = 0; }
  if (d <= 0) hb = -Math.PI / 2;
  // A: drifts back along the wall, turning slowly away
  const sA = ramp(.75, .6), xa = A0[0] - sA * .88, za = A0[1] - sA * .48, ha = -Math.PI / 2 - 1.05 * sm2(d / 2.2);
  const bob = (ph) => .015 * Math.sin(t * 1.7 + ph) + .01 * Math.sin(t * 2.9 + ph * 2);
  return { m, n, A: { x: xa, z: za, h: ha, y: WY + bob(1), roll: .03 * Math.sin(t * 1.3), seed: 61 }, B: { x: xb, z: zb, h: hb, y: WY + bob(2.4), roll: .03 * Math.sin(t * 1.1 + 1), seed: 62 }, d };
}
// a small wooden rowing boat (double-ended), seen from any side: hull, interior, thwarts, gunwale, oars, a lantern on a pole
const BL = 1.7, BW = .74;
function hullAt(b, u, v, w) { const c = Math.cos(b.h), s = Math.sin(b.h); return [b.x + u * c - v * s, b.y + w + v * b.roll, b.z + u * s + v * c]; }
export function boat(ctx, C, b, t, E, o = {}) {
  const N = 12, gun = [], chi = [];
  for (let i = 0; i <= N; i++) { const u = -BL / 2 + BL * i / N, q = 2 * u / BL, hw = BW / 2 * Math.pow(Math.max(0, 1 - q * q), .55); gun.push([u, hw, .3 + .09 * q * q]); chi.push([u, hw * .42, -.1 + .16 * Math.pow(Math.abs(q), 3)]); }
  const night = o.night ?? 0, wood = mixHex('#7a4a2a', '#3a2a3a', night * .6), paint = mixHex(o.col || '#2f5a6a', '#1c2238', night * .55);
  // the outer side facing the camera
  for (const sd of [1, -1]) {
    const mid = hullAt(b, 0, sd * BW / 2, .1), nrm = [-Math.sin(b.h) * sd, 0, Math.cos(b.h) * sd], v = [C.x - mid[0], C.y - mid[1], C.z - mid[2]];
    if (nrm[0] * v[0] + nrm[2] * v[2] < 0) continue;
    const pts = []; for (let i = 0; i <= N; i++) pts.push(hullAt(b, gun[i][0], sd * gun[i][1], gun[i][2])); for (let i = N; i >= 0; i--) pts.push(hullAt(b, chi[i][0], sd * chi[i][1], chi[i][2]));
    const S = poly3(ctx, C, pts); if (S) { ctx.fillStyle = paint; ctx.fill(); ctx.strokeStyle = rgba('#0a0c18', .5); ctx.lineWidth = 1; ctx.beginPath(); for (const w of [.12, -.0]) { for (let i = 0; i < N; i++) seg3(ctx, C, hullAt(b, mix(gun[i][0], chi[i][0], .3), sd * mix(gun[i][1], chi[i][1], .3 + w), mix(gun[i][2], chi[i][2], .3 + w)), hullAt(b, mix(gun[i + 1][0], chi[i + 1][0], .3), sd * mix(gun[i + 1][1], chi[i + 1][1], .3 + w), mix(gun[i + 1][2], chi[i + 1][2], .3 + w))); } ctx.stroke(); }
  }
  // the interior (seen from above): the gunwale outline filled dark, thwarts, the floorboards
  if (C.y > b.y + .25) {
    const top = []; for (let i = 0; i <= N; i++) top.push(hullAt(b, gun[i][0], gun[i][1], gun[i][2] - .02)); for (let i = N; i >= 0; i--) top.push(hullAt(b, gun[i][0], -gun[i][1], gun[i][2] - .02));
    const S = poly3(ctx, C, top); if (S) { ctx.fillStyle = shade(wood, -.35); ctx.fill(); ctx.strokeStyle = rgba(shade(wood, -.6), .7); ctx.lineWidth = 1; ctx.beginPath(); for (const v of [-.18, -.06, .06, .18]) seg3(ctx, C, hullAt(b, -BL * .38, v, .02), hullAt(b, BL * .38, v, .02)); ctx.stroke(); }
    for (const u of [-.45, .1, .55]) { const hw = BW / 2 * Math.pow(1 - (2 * u / BL) ** 2, .55) * .96; fill3(ctx, C, [hullAt(b, u - .09, -hw, .22), hullAt(b, u + .09, -hw, .22), hullAt(b, u + .09, hw, .22), hullAt(b, u - .09, hw, .22)], mixHex('#b07a4a', '#4a3a4a', night * .6)); }
  }
  // the gunwale rail
  ctx.strokeStyle = mixHex('#e0b880', '#6a5a6a', night * .6); ctx.lineWidth = Math.max(1, (at3(C, b.x, b.y, b.z)?.k ?? 100) * .035); ctx.lineCap = 'round'; ctx.beginPath();
  for (const sd of [1, -1]) for (let i = 0; i < N; i++) seg3(ctx, C, hullAt(b, gun[i][0], sd * gun[i][1], gun[i][2]), hullAt(b, gun[i + 1][0], sd * gun[i + 1][1], gun[i + 1][2]));
  ctx.stroke();
  // the oars shipped along the thwarts (blades over the stern)
  ctx.strokeStyle = mixHex('#c89a62', '#5a4a5a', night * .6); ctx.lineWidth = Math.max(1, (at3(C, b.x, b.y, b.z)?.k ?? 100) * .03); ctx.beginPath();
  for (const sd of [1, -1]) seg3(ctx, C, hullAt(b, .75, sd * .2, .36), hullAt(b, -1.15, sd * .28, .38)); ctx.stroke();
  // the lantern on a short pole at the bow: its flame grows from a spark (no fade)
  const lit = o.lamp ?? 0;
  const p0 = at3(C, ...hullAt(b, BL / 2 - .22, 0, .32)), p1 = at3(C, ...hullAt(b, BL / 2 - .22, 0, .95));
  if (p0 && p1) {
    ctx.strokeStyle = '#1a1420'; ctx.lineWidth = Math.max(1, p1.k * .025); ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
    const r = .07 * p1.k; ctx.fillStyle = '#1a1420'; ctx.fillRect(p1.x - r, p1.y, r * 2, r * 2.4);
    ctx.fillStyle = mixHex('#3a3040', '#ffd9a0', lit); ctx.fillRect(p1.x - r * .7, p1.y + r * .3, r * 1.4, r * 1.8);
    if (lit > .01) { const fl = lit * (.9 + .1 * Math.sin(t * 11 + b.seed)); ctx.fillStyle = '#fff1d6'; ctx.beginPath(); ctx.ellipse(p1.x, p1.y + r * 1.2, r * .3 * fl, r * .6 * fl, 0, 0, TAU); ctx.fill(); }
    o.lights?.push([p1.x, p1.y + .07 * 1.2 * p1.k, p1.k, lit]);
  }
}
// ---------------------------------------------------------------- pieces of the set
const STONE = '#b49274';
function stoneCol(E, nightK, base = STONE) { return mixHex(mixHex(base, E.key, .18), '#3a3150', nightK * .65); }
function mole(ctx, C, t, E, nightK, x0, x1) {
  const top = QY;
  // south face (to the basin), top, north parapet
  box3(ctx, C, x0, WY - .5, M.z0, x1, top, M.z1, (f) => (f === 'y1' ? stoneCol(E, nightK, '#c8a888') : f === 'z0' ? shade(stoneCol(E, nightK), -.12) : f === 'x0' ? shade(stoneCol(E, nightK), -.2) : f === 'x1' ? shade(stoneCol(E, nightK), -.05) : null));
  // the face: courses, joints, the wet band at the water, iron rings
  if (C.z < M.z0) {
    const q = [[x0, WY - .05, M.z0 - .004], [x1, WY - .05, M.z0 - .004], [x1, top, M.z0 - .004], [x0, top, M.z0 - .004]];
    const wet = [[x0, WY - .05, M.z0 - .006], [x1, WY - .05, M.z0 - .006], [x1, WY + .32, M.z0 - .006], [x0, WY + .32, M.z0 - .006]];
    fill3(ctx, C, wet, rgba(mixHex('#2a3a2a', '#141428', nightK), .55));
    ctx.strokeStyle = rgba('#2a1a1a', .38); ctx.lineWidth = 1; ctx.beginPath();
    const cx0 = Math.max(x0, C.x - 4);
    for (let k = 1; k < 4; k++) { const y = mix(WY, top, k / 4); seg3(ctx, C, [cx0, y, M.z0 - .005], [x1, y, M.z0 - .005]); for (let x = x0 + (k % 2) * .45; x < x1; x += .9) if (x > cx0) seg3(ctx, C, [x, y, M.z0 - .005], [x, y - (top - WY) / 4, M.z0 - .005]); }
    ctx.stroke();
    ctx.strokeStyle = rgba('#1a1010', .16); ctx.beginPath(); hatchQuad(ctx, C, q, Math.round((x1 - x0) * 6), .05, prng(31)); ctx.stroke();
    for (const rx of [17.6, 19.9, 23.1, 30, 36, 42]) { if (rx < x0 || rx > x1) continue; const p = at3(C, rx, top - .35, M.z0 - .03); if (p) { ctx.strokeStyle = '#2a2022'; ctx.lineWidth = Math.max(1, .025 * p.k); ctx.beginPath(); ctx.arc(p.x, p.y + .07 * p.k, .07 * p.k, 0, TAU); ctx.stroke(); } }
  }
  // the cap stones along the edge (a lighter band), the low parapet on the sea side
  box3(ctx, C, x0, top - .02, M.z0, x1, top + .04, M.z0 + .35, (f) => (f === 'y1' ? mixHex(stoneCol(E, nightK, '#dcc0a0'), E.key, .15) : f === 'z0' ? shade(stoneCol(E, nightK, '#dcc0a0'), -.1) : null));
  box3(ctx, C, x0, top, M.z1 - .4, x1, top + .45, M.z1, (f) => (f === 'y1' ? stoneCol(E, nightK, '#d0b090') : f === 'z0' ? shade(stoneCol(E, nightK), -.18) : null));
  // paving joints on the top (seen from the lane)
  if (C.y > top + .3) { ctx.strokeStyle = rgba('#5a4434', .3); ctx.lineWidth = 1; ctx.beginPath(); for (let x = Math.max(x0, Math.ceil(C.x)); x < x1; x += .8) seg3(ctx, C, [x, top + .005, M.z0 + .35], [x, top + .005, M.z1 - .4]); ctx.stroke(); }
}
// the chapel at the end of the mole: a stone tower with a spire, a clock toward the town (lit at dusk), the bell rings nine on "nine"
const TW = { x0: 61.5, x1: 64, z0: 18.75, z1: 21.25, h: 10.5 };
function chapel(ctx, C, t, E, K, nightK) {
  const top = QY + TW.h, col = stoneCol(E, nightK, '#d8b896'), zc = (TW.z0 + TW.z1) / 2;
  box3(ctx, C, TW.x0, QY, TW.z0, TW.x1, top, TW.z1, (f) => (f === 'x0' ? shade(col, -.22) : f === 'z0' ? shade(col, -.08) : f === 'z1' ? shade(col, -.3) : null));
  // the spire: the faces turned to the camera
  const ap = [(TW.x0 + TW.x1) / 2, top + 4.2, zc], q = [[TW.x0 - .1, top, TW.z0 - .1], [TW.x0 - .1, top, TW.z1 + .1], [TW.x1 + .1, top, TW.z1 + .1], [TW.x1 + .1, top, TW.z0 - .1]];
  for (let i = 0; i < 4; i++) { const a = q[i], b = q[(i + 1) % 4], m = [(a[0] + b[0]) / 2, top, (a[2] + b[2]) / 2], n = [m[0] - ap[0], 0, m[2] - ap[2]]; if (n[0] * (C.x - m[0]) + n[2] * (C.z - m[2]) <= 0) continue; fill3(ctx, C, [a, b, ap], mixHex(i === 0 ? '#6a4a52' : '#4a3442', '#241c34', nightK * .6)); }
  const c = at3(C, TW.x0 - .02, QY + 7.2, zc); if (!c || C.x > TW.x0) return;
  // belfry: two dark arched openings, the bell's two rings on nine
  for (const dz of [-.55, .55]) { const p = at3(C, TW.x0 - .02, QY + 9.1, zc + dz); if (p) { ctx.fillStyle = '#1a1424'; ctx.beginPath(); ctx.ellipse(p.x, p.y, .26 * p.k, .62 * p.k, 0, 0, TAU); ctx.fill(); } }
  const R = .95 * c.k, lit = clamp(nightK * 1.6);
  ctx.fillStyle = mixHex('#efe2c4', '#ffe2a8', lit); ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, TAU); ctx.fill();
  if (lit > .02) radial(ctx, c.x, c.y, R * 3.2, '#ffcf8a', .3 * lit, 'screen');
  ctx.strokeStyle = '#2a2030'; ctx.lineWidth = Math.max(1, R * .1); ctx.beginPath(); ctx.arc(c.x, c.y, R, 0, TAU); ctx.stroke();
  ctx.lineWidth = Math.max(.8, R * .06); ctx.beginPath(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.moveTo(c.x + Math.sin(a) * R * .72, c.y - Math.cos(a) * R * .72); ctx.lineTo(c.x + Math.sin(a) * R * .88, c.y - Math.cos(a) * R * .88); } ctx.stroke();
  // 8:58 while the lane sits down, the minute hand reaches twelve exactly on "nine", then on
  const mins = 58 + 2 * sm2((t - (K.nine - 1.4)) / 1.4) + Math.max(0, t - K.nine) / 60, hr = 8 + mins / 60, am = mins / 60 * TAU, ah = hr / 12 * TAU;
  ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.4, R * .12); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.sin(ah) * R * .48, c.y - Math.cos(ah) * R * .48); ctx.stroke();
  ctx.lineWidth = Math.max(1, R * .07); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + Math.sin(am) * R * .76, c.y - Math.cos(am) * R * .76); ctx.stroke();
  const d = t - K.nine; if (d > 0 && d < 2.2) { const bp = at3(C, TW.x0 - .02, QY + 9.1, zc); if (bp) for (let k = 0; k < 3; k++) { const u = clamp(d / 1.6 - k * .22); if (u <= 0 || u >= 1) continue; ctx.strokeStyle = rgba('#ffe8c0', .55 * (1 - u)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(bp.x, bp.y, (.8 + u * 5) * bp.k, (.9 + u * 5) * bp.k, 0, 0, TAU); ctx.stroke(); } }
  // the chapel's door and a lit window at dusk
  const dp = at3(C, TW.x0 - .02, QY + 1.1, zc); if (dp) { ctx.fillStyle = mixHex('#3a2a2a', '#ffcf8a', lit * .7); ctx.beginPath(); ctx.roundRect(dp.x - .45 * dp.k, dp.y - 1.1 * dp.k, .9 * dp.k, 2.2 * dp.k, [.45 * dp.k, .45 * dp.k, 0, 0]); ctx.fill(); }
}
// the far coast: low hills on the horizon left and right of the sun's sea, a few lights at dusk
const COAST = (() => { const o = []; for (const [a0, a1, hgt] of [[38, 77, 70], [104, 150, 55]]) { const seg = []; for (let a = a0; a <= a1; a += 1) { const u = (a - a0) / (a1 - a0), env = Math.pow(Math.sin(Math.PI * u), .6); seg.push([a, hgt * env * (.55 + .25 * Math.sin(a * .21) + .15 * Math.sin(a * .53 + 1) + .05 * Math.sin(a * 1.7))]); } o.push(seg); } return o; })();
function coast(ctx, C, E, nightK) {
  const D = 2600, col = mixHex(mixHex(E.haze, '#4a4a7a', .35), '#1a1a3a', nightK * .6);
  for (const seg of COAST) {
    const pts = []; for (const [a, h] of seg) { const r = a * Math.PI / 180, p = C.p(C.x + Math.sin(r) * D, WY + h, C.z + Math.cos(r) * D); if (p) pts.push(p); }
    if (pts.length < 2) continue; const hy = (C.p(C.x + Math.sin(seg[0][0] * Math.PI / 180) * D, WY, C.z + Math.cos(seg[0][0] * Math.PI / 180) * D) || [0, 0])[1];
    const hy2 = (C.p(C.x + Math.sin(seg[seg.length - 1][0] * Math.PI / 180) * D, WY, C.z + Math.cos(seg[seg.length - 1][0] * Math.PI / 180) * D) || [0, hy])[1];
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(pts[0][0], hy + 1); for (const p of pts) ctx.lineTo(p[0], p[1]); ctx.lineTo(pts[pts.length - 1][0], hy2 + 1); ctx.closePath(); ctx.fill();
    if (nightK > .05) { const r = prng(91); ctx.fillStyle = rgba('#ffcf8a', .8 * clamp(nightK * 2)); for (let i = 0; i < pts.length; i += 3) { if (r() < .5) continue; const p = pts[i]; ctx.fillRect(p[0], mix(p[1], hy, .6 + .35 * r()), 1.5, 1.5); } }
  }
}
// the south quay's houses (fronts face +Z, toward the basin)
const SOUTHQ = (() => { const r = prng(7313), o = []; let x = 16.6; const cols = ['#d9a77a', '#c47a5a', '#e3c08a', '#9ab0a8', '#d4b48c', '#c98a6a', '#b9876a']; while (x < 49) { const w = 3.2 + r() * 2.4, fl = 2 + (r() < .5 ? 1 : 0) + (r() < .2 ? 1 : 0); o.push({ x0: x, x1: x + w, h: fl * 2.9 + .6, fl, col: cols[o.length % cols.length], sh: r() < .5 ? '#3f6a6a' : '#6a4a3a', seed: Math.floor(r() * 1e5) }); x += w + .05; } return o; })();
function southHouse(ctx, C, h, E, nightK, t) {
  const z = 2.0, yb = QY, yt = yb + h.h, col = mixHex(mixHex(h.col, E.key, .12), '#4a3a5a', nightK * .6);
  const S = fill3(ctx, C, [[h.x1, yb, z], [h.x0, yb, z], [h.x0, yt, z], [h.x1, yt, z]], col); if (!S) return;
  const rt = yt + 1.3; fill3(ctx, C, [[h.x1 + .15, yt, z + .3], [h.x0 - .15, yt, z + .3], [h.x0 - .15, rt, z - 2], [h.x1 + .15, rt, z - 2]], mixHex('#9a4a32', '#3a2230', nightK * .6));
  const n = Math.max(1, Math.round((h.x1 - h.x0) / 1.6)), r = prng(h.seed);
  for (let f = 0; f < h.fl; f++) for (let i = 0; i < n; i++) {
    const cx = mix(h.x0, h.x1, (i + .5) / n), y0 = yb + .9 + f * 2.9, on = r() < .45 ? clamp(nightK * 2.4 - r() * 1.2) : 0;
    fill3(ctx, C, [[cx + .3, y0, z + .01], [cx - .3, y0, z + .01], [cx - .3, y0 + 1.1, z + .01], [cx + .3, y0 + 1.1, z + .01]], on > 0 ? mixHex('#231d33', '#ffcf8a', on) : '#2a2238');
  }
}
// the bridge: three arches on piers, voussoirs, a cornice, the deck with a low curb; the vaults (intrados) seen through the arches
function bridge(ctx, C, t, E, nightK, o) {
  const xf = B.x0, top = B.top, col = stoneCol(E, nightK, '#bc9a7a');
  // the vaults first (the arch openings show them), and beyond the exits: World 1's sea, or World 2 (o.beyond)
  for (const a of HBR.arches) {
    const P0 = archPts(a, B.x0), P1 = archPts(a, B.x1);
    const zA = P0[P0.length - 1][2], zB = P0[0][2];
    // the water in the vault is in the bridge's shadow
    fill3(ctx, C, [[B.x0, WY + .003, zA], [B.x1, WY + .003, zA], [B.x1, WY + .003, zB], [B.x0, WY + .003, zB]], rgba('#08061a', .55 + .2 * nightK));
    if (o.beyond && C.x < B.x1) { const S = proj3(C, P1); if (S) { ctx.save(); ctx.beginPath(); trace(ctx, S); ctx.clip(); o.beyond(ctx, C); ctx.restore(); } }
    // the intrados strips facing the camera, far to near
    const strips = [];
    for (let i = 0; i < P0.length - 1; i++) {
      const a0 = P0[i], a1 = P0[i + 1], mid = [(B.x0 + B.x1) / 2, (a0[1] + a1[1]) / 2, (a0[2] + a1[2]) / 2], zc = (a[0] + a[1]) / 2, yc = WY + ARCH_DY;
      const nrm = [0, yc - mid[1], zc - mid[2]], v = [C.x - mid[0], C.y - mid[1], C.z - mid[2]];
      if (nrm[1] * v[1] + nrm[2] * v[2] <= 0 && !(C.x > B.x0 && C.x < B.x1)) continue;
      const c = C.c(...mid); strips.push([c[2], [[B.x0, a0[1], a0[2]], [B.x1, a0[1], a0[2]], [B.x1, a1[1], a1[2]], [B.x0, a1[1], a1[2]]], i]);
    }
    strips.sort((p, q) => q[0] - p[0]);
    for (const [, q, i] of strips) { const sh = .15 + .2 * Math.sin(Math.PI * i / (P0.length - 1)); if (fill3(ctx, C, q, mixHex(shade(col, -.32), '#2a2440', sh + .25 * nightK))) { ctx.strokeStyle = rgba('#1a1222', .3); ctx.lineWidth = 1; ctx.beginPath(); seg3(ctx, C, q[0], q[1]); for (let x = B.x0 + (i % 2) * .3; x < B.x1; x += .6) seg3(ctx, C, [x, q[0][1], q[0][2]], [x, q[3][1], q[3][2]]); ctx.stroke(); } }
    // the boat that is inside the vault (drawn here so the face covers it)
    if (o.inVault) o.inVault(a);
  }
  // the west face with the three arch holes
  const outer = [[xf, WY - .2, B.z1], [xf, top, B.z1], [xf, top, B.z0], [xf, WY - .2, B.z0]];
  const S = proj3(C, outer); if (!S || C.x > xf) return;
  const holes = HBR.arches.map((a) => proj3(C, archPts(a, xf))).filter(Boolean);
  ctx.beginPath(); trace(ctx, S); for (const h of holes) trace(ctx, h);
  const gr = ctx.createLinearGradient(0, Math.min(...S.map((p) => p[1])), 0, Math.max(...S.map((p) => p[1]))); gr.addColorStop(0, mixHex(col, E.rim, .12)); gr.addColorStop(1, shade(col, -.3));
  ctx.fillStyle = gr; ctx.fill('evenodd');
  ctx.save(); ctx.beginPath(); trace(ctx, S); for (const h of holes) trace(ctx, h); ctx.clip('evenodd');
  // courses on the spandrels, voussoirs around each arch, a wet band
  ctx.strokeStyle = rgba('#2a1a1a', .35); ctx.lineWidth = 1; ctx.beginPath();
  for (let y = WY + .3; y < top - .1; y += .3) seg3(ctx, C, [xf - .004, y, B.z1], [xf - .004, y, B.z0]);
  for (const a of HBR.arches) { const zc = (a[0] + a[1]) / 2, r = (a[1] - a[0]) / 2, yc = WY + ARCH_DY; for (let th = .2; th < Math.PI; th += .2) seg3(ctx, C, [xf - .005, yc + r * Math.sin(th), zc + r * Math.cos(th)], [xf - .005, yc + (r + .42) * Math.sin(th), zc + (r + .42) * Math.cos(th)]); const ex = []; for (let th = .15; th <= Math.PI - .15; th += .1) ex.push([xf - .005, yc + (r + .42) * Math.sin(th), zc + (r + .42) * Math.cos(th)]); for (let i = 0; i < ex.length - 1; i++) seg3(ctx, C, ex[i], ex[i + 1]); }
  ctx.stroke();
  ctx.strokeStyle = rgba('#1a1010', .14); ctx.beginPath(); hatchQuad(ctx, C, [[xf - .003, WY, B.z1], [xf - .003, WY, B.z0], [xf - .003, top, B.z0], [xf - .003, top, B.z1]], 120, .04, prng(17)); ctx.stroke();
  fill3(ctx, C, [[xf - .006, WY - .05, B.z1], [xf - .006, WY - .05, B.z0], [xf - .006, WY + .3, B.z0], [xf - .006, WY + .3, B.z1]], rgba(mixHex('#22302a', '#141428', nightK), .45));
  ctx.restore();
  // the cornice and the curb
  box3(ctx, C, xf - .12, top - .16, B.z0, B.x1 + .12, top, B.z1, (f) => (f === 'x0' ? shade(col, -.08) : f === 'y1' ? mixHex(col, '#e8d0b0', .3) : null));
  box3(ctx, C, xf - .05, top, B.z0, xf + .3, top + .26, B.z1, (f) => (f === 'x0' ? shade(col, -.15) : f === 'y1' ? mixHex(col, '#e8d0b0', .25) : null));
}
// the two friends on the wall edge (perched, legs over the basin), the bag of cherries between them; mirror: drawn as their reflection
function friends(ctx, C, t, E, K, o = {}) {
  const out = [];
  for (let i = 0; i < 2; i++) {
    const F = HBR.friends[i], hipY = QY + .1, hipZ = M.z0 + .17, hp = at3(C, F.x, hipY, hipZ); if (!hp) continue; hp.i = i;
    const fwd = at3(C, F.x, hipY, hipZ - .6); const flip = fwd ? fwd.x < hp.x : false;
    const s = hp.k * U * F.h;
    let pose = { ...POSES.perch, hair: F.hair, lean: .1, head: .08 };
    // A eats cherries from the bag (reaches into it, lifts one to the mouth); B laughs, swings a foot, holds a cherry by the stem
    if (i === 0) {
      const cyc = (u) => { const p = ((u % 4.6) + 4.6) % 4.6; return [sm2(p / .6) * (1 - sm2((p - 1.1) / .5)), sm2((p - 1.2) / .5) * (1 - sm2((p - 2.5) / .6))]; };
      const [reach, eat] = cyc(t - K.friend + .4);
      pose = { ...pose, sh: [mix(mix(.5, .25, reach), 2.2, eat), .42], el: [mix(mix(.9, .25, reach), 2.45, eat), .95], head: mix(.08, -.05, eat), lean: mix(.1, .16, reach) };
    } else {
      const l = sm2((t - K.friend - 1.1) / .4) * (1 - sm2((t - K.friend - 2.6) / .6));
      pose = { ...pose, sh: [mix(.9, 1.2, l), .42], el: [mix(1.6, 1.9, l), .95], head: mix(.04, -.28, l), lean: mix(.08, -.04, l), kn: [POSES.perch.kn[0] + .18 * Math.sin(t * 1.6), POSES.perch.kn[1]] };
    }
    const prop = (g, fa) => { const x = fa.hx + Math.sin(fa.ang) * 3.5, y = fa.hy + Math.cos(fa.ang) * 3.5; g.strokeStyle = '#4a3a1a'; g.lineWidth = .7; g.beginPath(); g.moveTo(x, y); g.lineTo(x + .8, y - 4); g.stroke(); g.fillStyle = '#a8102a'; g.beginPath(); g.arc(x, y + 1.2, 2.1, 0, TAU); g.fill(); };
    const draw = () => person(ctx, hp.x, hp.y, s, pose, { t, seed: F.seed, dress: F.dress, flip, light: o.mirror ? null : { x: W + 300, y: hp.y - 300, col: E.key, a: .5 }, rim: o.mirror ? null : E.rim, rimSide: flip ? -1 : 1, prop: i === 0 || o.mirror ? prop : prop, smile: .45, shadow: false, fog: o.mirror ? { col: '#14182c', a: .35 } : null });
    out.push({ hp, s, flip, draw });
  }
  return out;
}
function cherryBag(ctx, C, E, nightK, mirror) {
  const p = at3(C, HBR.bag, QY + .02, M.z0 + .12); if (!p) return; const k = p.k;
  if (mirror) { ctx.save(); ctx.translate(p.x, p.y); ctx.scale(1, -1); ctx.translate(-p.x, -p.y); }
  ctx.fillStyle = mixHex('#c8a070', '#5a4a5a', nightK * .6); ctx.beginPath(); ctx.moveTo(p.x - .1 * k, p.y); ctx.lineTo(p.x - .085 * k, p.y - .2 * k); ctx.lineTo(p.x + .085 * k, p.y - .2 * k); ctx.lineTo(p.x + .1 * k, p.y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#9a0c24'; for (const [dx, dy] of [[-.04, -.21], [.01, -.23], [.05, -.2], [-.01, -.19]]) { ctx.beginPath(); ctx.arc(p.x + dx * k, p.y + dy * k, .022 * k, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = rgba('#5a3a1a', .5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x - .085 * k, p.y - .2 * k); ctx.lineTo(p.x - .06 * k, p.y - .16 * k); ctx.lineTo(p.x + .085 * k, p.y - .2 * k); ctx.stroke();
  if (mirror) ctx.restore();
}
// ---------------------------------------------------------------- the water: the mirrored world, rippled (half resolution)
let WL = null; const WLW = 960, WLH = 540;
function mirrorCam(C) { return { ...C, c: (X, Y, Z) => C.c(X, 2 * WY - Y, Z), p: (X, Y, Z) => C.p(X, 2 * WY - Y, Z), y: 2 * WY - C.y, mirror: true }; }
function waterSky(g, C, t, E, hy) {
  const [s0, s1, s2] = E.sky, deep = mixHex('#2a2848', E.sky[1], .22);
  const gr = g.createLinearGradient(0, hy - 30, 0, hy + 1100);
  gr.addColorStop(0, mixHex(s2, deep, .18)); gr.addColorStop(.38, mixHex(s1, deep, .38)); gr.addColorStop(1, mixHex(s0, deep, .55));
  g.fillStyle = gr; g.fillRect(0, Math.max(0, hy - 30), W, H);
  // the clouds, mirrored
  for (let i = 0; i < 9; i++) {
    const az = -1.1 + i * .27 + t * .004, el = .07 + .045 * hash(i, 9) + .02 * (i % 3), p = C.p(C.x + Math.sin(az) * 1e4, C.y - Math.tan(el) * 1e4, C.z + Math.cos(az) * 1e4); if (!p) continue;
    const w = 260 + 220 * hash(i, 2), h = 7 + 9 * hash(i, 4);
    const gg = g.createLinearGradient(0, p[1] - h, 0, p[1] + h); gg.addColorStop(0, rgba(mixHex(E.cloudLow, deep, .3), .45)); gg.addColorStop(.55, rgba(mixHex(E.cloudTop, deep, .3), .25)); gg.addColorStop(1, rgba(E.cloudTop, 0));
    g.fillStyle = gg; g.beginPath(); g.ellipse(p[0], p[1], w, h, 0, 0, TAU); g.fill();
  }
}
function water(ctx, C, t, E, K, o, scene) {
  const hy = C.oy + C.f * Math.tan(C.pitch); if (hy >= H - 2) return;
  if (!WL) { WL = [canvas(WLW, WLH), canvas(WLW, WLH)]; }
  const [[c1, g], [c2, g2]] = WL, Cm = mirrorCam(C);
  g.setTransform(.5, 0, 0, .5, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  waterSky(g, C, t, E, hy);
  if (E.sunA > 0) sun(g, Cm, E, E.sunA * .85);
  scene(g, Cm, true);
  // the water's own colour over the reflections (darker toward the camera: less reflection looking down)
  const dk = g.createLinearGradient(0, hy, 0, H); dk.addColorStop(0, rgba('#141433', .1)); dk.addColorStop(1, rgba('#141433', .3)); g.fillStyle = dk; g.fillRect(0, Math.max(0, hy), W, H);
  g.setTransform(1, 0, 0, 1, 0, 0);
  // the ripple: every row shifts sideways (bigger toward the camera); the swell of 10.07 adds a slow strong wave
  const y0 = Math.max(0, Math.floor(hy / 2)), rows = WLH - y0; if (rows <= 0) return;
  const id = g.getImageData(0, y0, WLW, rows), src = id.data, out = g2.createImageData(WLW, rows), D = out.data, sw = o.swell || 0;
  for (let y = 0; y < rows; y++) {
    const u = (y + 1) / (WLH - Math.floor(hy / 2) + 1), A = (.6 + 1.6 * u) + sw * (2 + 16 * u);
    const dx = Math.round(A * (Math.sin(y * (.55 - .4 * u) + t * 2.3) * .7 + Math.sin(y * (1.3 - .9 * u) - t * 3.1 + 1.3) * .3)), r = y * WLW * 4;
    if (dx >= 0) { D.set(src.subarray(r, r + (WLW - dx) * 4), r + dx * 4); if (dx) D.set(src.subarray(r, r + dx * 4), r); }
    else { D.set(src.subarray(r - dx * 4, r + WLW * 4), r); D.set(src.subarray(r + (WLW + dx) * 4, r + WLW * 4), r + (WLW + dx) * 4); }
  }
  g2.putImageData(out, 0, y0);
  ctx.drawImage(c2, 0, y0, WLW, rows, 0, y0 * 2, W, rows * 2);
  // engraved ripple lines (sky-coloured crests) and the sun's glitter path
  const r = prng(4401), sp = C.p(C.x + E.sunDir[0] * 1e4, C.y + E.sunDir[1] * 1e4, C.z + E.sunDir[2] * 1e4);
  ctx.lineCap = 'round';
  for (let i = 0; i < 420; i++) {
    const yt = Math.max(hy, -2), v = Math.pow(r(), 1.5), y = yt + 3 + v * (H - yt), dep = clamp((y - hy) / 900), x = ((r() * W * 1.2 + t * (6 + 20 * dep) * (r() < .5 ? 1 : -1)) % (W * 1.2) + W * 1.2) % (W * 1.2) - W * .1, L = 6 + 70 * dep * (.5 + r());
    ctx.strokeStyle = rgba(r() < .7 ? E.sky[2] : E.sky[1], .12 + .16 * (1 - dep) + .08 * dep); ctx.lineWidth = .8 + 1.4 * dep; ctx.beginPath(); ctx.moveTo(x - L / 2, y); ctx.lineTo(x + L / 2, y); ctx.stroke();
  }
  if (sp && E.sunA > .02) {
    const sx = sp[0];
    for (let i = 0; i < 240; i++) {
      const v = Math.pow(r(), 2.2), y = hy + 2 + v * (H - hy) * .9, spread = 26 + 520 * v, x = sx + (r() + r() - 1) * spread, tw = .5 + .5 * Math.sin(t * (3 + 5 * r()) + r() * 9);
      if (tw < .35) continue; const L = (3 + 26 * v) * tw;
      ctx.strokeStyle = rgba('#fff1d6', E.sunA * (.75 - .5 * v) * tw); ctx.lineWidth = 1 + 1.6 * v; ctx.beginPath(); ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.stroke();
    }
  }
}
// ---------------------------------------------------------------- the whole harbour
export function harbour(ctx, C, t, E, K, o = {}) {
  const nightK = clamp((t - K.nine) / 10), bs = boats(t, K), lights = [];
  const swell = sm2((t - K.swap + .55) / .4) * (1 - sm2((t - K.swap - .1) / .55));
  const showBoats = t >= K.swap, showFriendsRefl = t < K.swap;
  const nightB = clamp((t - K.swap) / 2);
  // draw one boat with its open-out (n) about its waterline, or nothing before the swap
  const drawBoat = (g, CC, b, mirror) => {
    const c = at3(CC, b.x, b.y, b.z); if (!c) return;
    const n = bs.n; if (n < 0) return; const sq = mix(.1, 1, n), st = 1 + 1.3 * (1 - n);
    g.save(); g.translate(c.x, c.y); g.scale(st, mirror ? sq : sq); g.translate(-c.x, -c.y);
    boat(g, CC, b, t, E, { night: nightB, lamp: sm2((t - K.swap - .55) / .5), lights: mirror ? null : lights, col: b === bs.A ? HBR.friends[0].dress.coat : HBR.friends[1].dress.coat });
    g.restore();
  };
  const scene = (g, CC, mirror) => {
    coast(g, CC, E, nightK);
    chapel(g, CC, t, E, K, nightK);
    for (const h of SOUTHQ) southHouse(g, CC, h, E, nightK, t);
    box3(g, CC, 16, WY - .5, -40, 50, QY, 2.6, (f) => (f === 'z1' ? shade(stoneCol(E, nightK), -.15) : f === 'y1' ? stoneCol(E, nightK, '#c8a888') : null));
    mole(g, CC, t, E, nightK, B.x0, M.x1);
    const inVault = (a) => { if (showBoats && bs.B.x > B.x0 - .6 && bs.B.z > a[0] && bs.B.z < a[1]) drawBoat(g, CC, bs.B, mirror); };
    bridge(g, CC, t, E, nightK, { beyond: !mirror && t >= K.swap ? o.beyond : null, inVault: mirror ? null : inVault });
    mole(g, CC, t, E, nightK, M.x0, B.x0);
    box3(g, CC, 4, WY - .5, -40, 16, QY, M.z0, (f) => (f === 'x1' ? shade(stoneCol(E, nightK), -.1) : f === 'y1' ? stoneCol(E, nightK, '#c8a888') : null));
    if (!mirror || showFriendsRefl) {
      const fr = friends(g, CC, t, E, K, { mirror }).sort((p, q) => q.hp.d - p.hp.d);
      for (const f of fr) {
        if (f === fr[fr.length - 1]) cherryBag(g, CC, E, nightK, mirror);
        g.save();
        if (mirror) {
          // the reflection flattens into a streak as the swell comes (about the torso's mirrored centre)
          const ay = f.hp.y + 34 * f.s, m = bs.m, sq = mix(1, .1, m), st = 1 + 1.6 * m;
          g.translate(f.hp.x, ay); g.scale(st, sq); g.translate(-f.hp.x, -ay);
          g.translate(f.hp.x, f.hp.y); g.scale(1, -1); g.translate(-f.hp.x, -f.hp.y);
        }
        f.draw(); g.restore();
      }
    }
    if (showBoats) { for (const b of [bs.A, bs.B]) if (!(b === bs.B && b.x > B.x0 - .6)) drawBoat(g, CC, b, mirror); }
  };
  // 1. sky and sun, 2. the water with the mirrored world, 3. the world
  sky(ctx, C, t, E);
  if (E.sunA > 0) sun(ctx, C, E, E.sunA);
  water(ctx, C, t, E, K, { swell }, scene);
  scene(ctx, C, false);
  for (const [x, y, k, lit] of lights) if (lit > .01) glowAt(ctx, glowImg('#ffb35c', { R: 64, core: .5, dots: 0 }), x, y, .45 * k * lit, .9, 'screen');
}
export const harbourFar = (ctx, C, t, E, K, o = {}) => harbour(ctx, C, t, E, K, { ...o, far: true });
