// "...found a hole in the ozone layer."
// Earth from space, the south pole turned toward us, wrapped in a thin violet ozone shell. Over Antarctica the shell
// thins and a dark hole opens on "hole", spreading as it slowly swirls. (The globe is reused by s_k8_heal.js.)
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, stamp, out } = L;

const T0 = 517.30, T1 = 519.50;

let PAT = null;
function gf(ctx, pathFn, fill, grain = 0.45, box = null, rule) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill(rule || 'nonzero');
  if (grain > 0) { if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat'); ctx.clip(rule || 'nonzero'); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-300, -300, W + 600, H + 600); }
  ctx.restore();
}

// ---------------------------------------------------------------- rough continents [lat, lon]
const LAND = {
  africa: [[35, -6], [37, 10], [32, 32], [30, 33], [12, 44], [11, 51], [2, 45], [-5, 40], [-12, 40], [-25, 35], [-34, 26], [-34, 18], [-28, 15], [-17, 12], [-6, 12], [4, 9], [5, -2], [5, -8], [10, -15], [15, -17], [21, -17], [28, -13], [33, -9]],
  eurasia: [[36, -9], [43, -9], [44, -1], [48, -4], [51, 2], [54, 8], [58, 7], [63, 8], [70, 20], [71, 28], [69, 40], [68, 55], [73, 70], [73, 80], [76, 100], [73, 115], [72, 130], [70, 160], [66, 180], [62, 175], [60, 163], [55, 160], [52, 156], [58, 140], [54, 137], [48, 140], [42, 132], [39, 128], [35, 129], [38, 121], [31, 122], [25, 119], [22, 114], [21, 108], [16, 108], [10, 106], [9, 105], [13, 100], [7, 100], [2, 103], [1, 104], [8, 98], [16, 97], [22, 91], [22, 88], [16, 82], [10, 80], [8, 77], [13, 74], [20, 73], [24, 68], [25, 62], [26, 57], [24, 56], [22, 59], [17, 55], [13, 45], [17, 42], [28, 34], [31, 32], [36, 36], [37, 28], [41, 29], [41, 41], [45, 37], [42, 28], [40, 24], [38, 22], [40, 19], [45, 13], [44, 12], [40, 18], [38, 16], [42, 12], [44, 8], [43, 3], [40, 0], [37, -2], [36, -6]],
  namerica: [[70, -165], [71, -156], [70, -141], [69, -130], [70, -110], [68, -95], [72, -95], [64, -87], [59, -94], [55, -82], [52, -79], [60, -78], [62, -73], [59, -64], [53, -56], [47, -53], [45, -61], [44, -66], [41, -70], [39, -74], [35, -76], [31, -81], [25, -80], [27, -82], [30, -84], [30, -89], [29, -95], [26, -97], [21, -97], [19, -95], [21, -87], [16, -88], [15, -84], [11, -84], [9, -79], [8, -77], [7, -80], [13, -88], [16, -95], [20, -105], [23, -110], [31, -114], [32, -117], [34, -120], [38, -123], [43, -124], [48, -124], [54, -130], [58, -136], [60, -145], [60, -152], [57, -157], [55, -163], [59, -158], [61, -165], [64, -166], [66, -162], [68, -166]],
  samerica: [[12, -72], [11, -64], [10, -61], [6, -56], [5, -52], [0, -50], [-2, -44], [-5, -36], [-8, -35], [-13, -38], [-18, -39], [-23, -42], [-25, -48], [-29, -49], [-34, -53], [-36, -57], [-39, -62], [-42, -64], [-46, -67], [-50, -69], [-53, -69], [-55, -67], [-54, -72], [-50, -75], [-45, -74], [-40, -73], [-33, -72], [-27, -71], [-18, -70], [-14, -76], [-6, -81], [-2, -81], [1, -79], [4, -77], [8, -77], [9, -76], [11, -74]],
  australia: [[-11, 142], [-17, 141], [-12, 136], [-12, 131], [-15, 129], [-14, 126], [-20, 119], [-22, 114], [-26, 113], [-32, 115], [-35, 117], [-34, 123], [-32, 131], [-35, 136], [-35, 139], [-38, 141], [-39, 146], [-37, 150], [-33, 152], [-28, 153], [-24, 152], [-19, 147], [-15, 145]],
  greenland: [[60, -43], [65, -40], [70, -22], [76, -19], [82, -30], [83, -45], [80, -65], [77, -72], [76, -66], [70, -54], [66, -53], [61, -48]],
  madagascar: [[-12, 49], [-16, 50], [-25, 47], [-25, 44], [-20, 44], [-16, 45]],
  uk: [[50, -5], [51, 1], [53, 0], [55, -2], [58, -3], [58, -6], [55, -6], [54, -3], [52, -4]],
  japan: [[31, 130], [34, 131], [35, 135], [35, 140], [38, 141], [41, 141], [45, 142], [43, 145], [42, 140], [39, 140], [36, 136], [35, 133], [33, 130]],
  sumatra: [[5, 95], [1, 104], [-6, 106], [-3, 101]],
  borneo: [[7, 117], [1, 119], [-4, 116], [-3, 110], [1, 109], [4, 113]],
  guinea: [[-1, 131], [-3, 141], [-8, 147], [-10, 150], [-8, 143], [-9, 141], [-5, 135]],
  nz: [[-35, 173], [-41, 176], [-46, 170], [-44, 168], [-41, 172]],
  antarctica: [[-78, -180], [-76, -160], [-74, -140], [-73, -120], [-72, -100], [-73, -80], [-70, -68], [-65, -62], [-63, -57], [-66, -60], [-72, -62], [-78, -48], [-76, -30], [-71, -12], [-70, 0], [-69, 20], [-68, 40], [-67, 60], [-66, 80], [-66, 100], [-67, 120], [-67, 140], [-70, 160], [-72, 170], [-78, 180]],
};
// densify edges so long sides follow the sphere
function dense(poly, step = 3) {
  const out = [], n = poly.length, closedRing = poly === LAND.antarctica;
  for (let i = 0; i < n; i++) {
    const a = poly[i], b = poly[(i + 1) % n];
    if (closedRing && i === n - 1) { out.push(a); break; }
    const k = Math.max(1, Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / step));
    for (let j = 0; j < k; j++) out.push([lerp(a[0], b[0], j / k), lerp(a[1], b[1], j / k)]);
  }
  return out;
}
const DENSE = Object.fromEntries(Object.entries(LAND).map(([k, v]) => [k, dense(v)]));

const D2R = Math.PI / 180;
function projector(cx, cy, R, lat0, lon0) {
  const s0 = Math.sin(lat0 * D2R), c0 = Math.cos(lat0 * D2R);
  const P = (lat, lon) => {
    const p = lat * D2R, l = (lon - lon0) * D2R, cp = Math.cos(p);
    let x = cp * Math.sin(l), y = c0 * Math.sin(p) - s0 * cp * Math.cos(l);
    const z = s0 * Math.sin(p) + c0 * cp * Math.cos(l);
    return [cx + x * R, cy - y * R, z, x, y];
  };
  P.cx = cx; P.cy = cy; P.R = R; return P;
}
// clip a polygon to the visible hemisphere: crossings land on the limb and hidden runs follow the limb as an arc
function polyPath(c, pts, P) {
  const Q = pts.map(([la, lo]) => P(la, lo)), n = Q.length;
  let s0 = Q.findIndex(q => q[2] >= 0); if (s0 < 0) return;
  const cross = (a, b) => { const k = a[2] / (a[2] - b[2]); let x = lerp(a[3], b[3], k), y = lerp(a[4], b[4], k); const m = Math.hypot(x, y) || 1; x /= m; y /= m; return [P.cx + x * P.R, P.cy - y * P.R, Math.atan2(-y, x)]; };
  let exitA = null; c.moveTo(Q[s0][0], Q[s0][1]);
  for (let i = 1; i <= n; i++) {
    const a = Q[(s0 + i - 1) % n], b = Q[(s0 + i) % n];
    if (a[2] >= 0 && b[2] >= 0) c.lineTo(b[0], b[1]);
    else if (a[2] >= 0 && b[2] < 0) { const e = cross(a, b); c.lineTo(e[0], e[1]); exitA = e[2]; }
    else if (a[2] < 0 && b[2] >= 0) { const e = cross(a, b); let d = e[2] - exitA; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      c.arc(P.cx, P.cy, P.R, exitA, exitA + d, d < 0); c.lineTo(b[0], b[1]); }
  }
  c.closePath();
}

const STARS = (() => { const r = rng(404), a = []; for (let i = 0; i < 260; i++) a.push([r() * W, r() * H, r(), r() * 6]); return a; })();
function stars(ctx, t, a = 1) {
  for (const [x, y, s, p] of STARS) { const tw = 0.5 + 0.5 * Math.sin(t * (0.8 + s) + p); ctx.fillStyle = rgba(s > 0.9 ? '#ffe2a8' : '#d8d4f4', a * (0.15 + 0.5 * s) * tw); ctx.fillRect(x, y, 1 + s * 1.6, 1 + s * 1.6); }
}

// o: { cx, cy, R, lat0, lon0, hole (deg radius), t, warm (0..1 dawn rim), shell (0..1) }
function drawGlobe(ctx, o) {
  const { cx, cy, R, t } = o, P = projector(cx, cy, R, o.lat0, o.lon0), warm = o.warm || 0, shell = o.shell ?? 1;
  const box = [cx - R - 10, cy - R - 10, 2 * R + 20, 2 * R + 20];
  // atmosphere halo behind the disc
  light(ctx, cx, cy, R * 1.45, '#6a4ec0', 0.22 * shell);
  if (warm > 0) light(ctx, cx - R * 0.55, cy - R * 0.5, R * 1.3, '#ffb35c', 0.32 * warm);
  // ocean
  gf(ctx, c => c.arc(cx, cy, R, 0, 7), rad(ctx, cx - R * 0.35, cy - R * 0.4, R * 0.1, R * 1.1, [[0, '#22307a'], [0.6, '#141c52'], [1, '#080b2a']]), 0.5, box);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
  // land
  for (const [k, pts] of Object.entries(DENSE)) {
    let zmax = -1; for (const [la, lo] of pts) { const z = P(la, lo)[2]; if (z > zmax) zmax = z; }
    if (zmax < 0.03) continue;
    const ice = k === 'antarctica' || k === 'greenland';
    gf(ctx, c => polyPath(c, pts, P), ice ? lin(ctx, cx, cy - R, cx, cy + R, [[0, '#cfcbe8'], [1, '#8f8ab8']]) : lin(ctx, cx - R, cy - R, cx + R, cy + R, [[0, '#8fb39a'], [0.5, '#5f8a7e'], [1, '#2e4f56']]), 0.5, box);
  }
  // cloud wisps drifting
  for (let i = 0; i < 7; i++) {
    const la = -60 + i * 18 + 6 * Math.sin(i * 2.1), lo = o.lon0 - 70 + i * 23 + t * 2.5;
    const [x, y, z] = P(la, lo); if (z < 0.15) continue;
    ctx.save(); ctx.translate(x, y); ctx.rotate(0.3 * Math.sin(i)); ctx.scale(1, 0.25 + 0.3 * z);
    ctx.fillStyle = rad(ctx, 0, 0, 0, R * 0.28, [[0, rgba('#e9e6f6', 0.16 * z)], [1, rgba('#e9e6f6', 0)]]); ctx.fillRect(-R * 0.3, -R * 0.3, R * 0.6, R * 0.6); ctx.restore();
  }
  // the ozone shell: a violet veil with the hole cut out over the pole
  const hole = o.hole || 0;
  const holePts = []; for (let lo = -180; lo <= 180; lo += 6) { const rr = hole * (1 + 0.10 * Math.sin(lo * D2R * 3 + t * 0.9) + 0.06 * Math.sin(lo * D2R * 5 - t * 1.3)); holePts.push([-90 + rr, lo]); }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); if (hole > 0.3) polyPath(ctx, holePts, P);
  ctx.fillStyle = rgba('#8a5ad8', 0.13 * shell); ctx.fill('evenodd');
  ctx.restore();
  if (hole > 0.3) {
    // the hole itself: darker, with a glowing lavender rim
    gf(ctx, c => polyPath(c, holePts, P), 'rgba(6,4,24,0.5)', 0);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const [w, a] of [[16, 0.08], [7, 0.18], [2.5, 0.55]]) { ctx.strokeStyle = rgba('#c9a8ff', a * (o.holeGlow ?? 1)); ctx.lineWidth = w; ctx.beginPath(); polyPath(ctx, holePts, P); ctx.stroke(); }
    ctx.restore();
  }
  // night side shading
  ctx.fillStyle = rad(ctx, cx - R * 0.45, cy - R * 0.45, R * 0.5, R * 1.7, [[0, 'rgba(4,4,16,0)'], [0.6, 'rgba(4,4,16,0.25)'], [1, 'rgba(4,4,16,0.8)']]); ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  ctx.restore();
  // ozone shell rim: thin violet line just outside the disc
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [w, a, rr] of [[26, 0.06, 1.035], [10, 0.16, 1.03], [3, 0.5, 1.028]]) { ctx.strokeStyle = rgba('#a07cf0', a * shell); ctx.lineWidth = w; ctx.beginPath(); ctx.arc(cx, cy, R * rr, 0, 7); ctx.stroke(); }
  if (warm > 0) { ctx.strokeStyle = rgba('#ffc488', 0.6 * warm); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, cy, R * 1.006, Math.PI * 0.95, Math.PI * 1.65); ctx.stroke(); }
  ctx.restore();
  return P;
}

function draw(ctx, t) {
  const k = (t - T0) / (T1 - T0);
  const R = lerp(500, 420, out(k * 1.2)), dx = drift(t, 1, 2) * 5, dy = drift(t, 1, 6) * 4;
  stars(ctx, t);
  light(ctx, 300, 160, 700, '#3b2f6e', 0.25);
  const hole = 26 * out((t - 517.45) / 1.6);
  drawGlobe(ctx, { cx: 1120 + dx, cy: 540 + dy, R, lat0: -58, lon0: -40 + (t - 517) * 4, hole, t, holeGlow: 0.6 + 0.4 * ramp(t, 517.5, 518.2) });
  stamp(ctx, t, 515.15, 519.6, '1985', 'a hole in the ozone layer');
}

module.exports = { T0, T1, draw, drawGlobe, projector, stars, LAND, DENSE, polyPath };
