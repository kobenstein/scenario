// c05 · the letter and the paper plane (5.05 → 5.09): the letter rises from the desk to face you, a big handwritten "No." inks itself,
// the sheet folds into a paper dart, the dart flies (the channel's sign; never named).
//   drawLetter(ctx, t, cam, L)   L = { lift 0..1, ink 0..1, fold 0..1 } (fold > 0: the sheet's outline folds into the dart)
//   drawDart(ctx, cam, pos, ori, o)  a paper dart in 3D: pos [x, y, z], ori { yaw, pitch, roll } (radians), o { size, light, col }
//   dartScreen(ctx, x, y, s, ori, o) the same dart drawn around a screen point with a scale (px per metre) (for the hill world)
import { rgba, clamp, mix, prng, TAU, smo, mixHex, shade } from './v2_c05_kit.mjs';
import { LETTER, DESK, letterTex, LETTER_PX } from './v2_c05_room.mjs';

// ---------------------------------------------------------------- the letter
const UP = { x: 1.12, y: -1.16, z: -.78 };   // where the letter faces you, upright
// the handwritten "No.": strokes in letter-texture pixels (520 × 720), drawn in order, revealed by length
const NO = (() => {
  const S = [], r = prng(88), wob = (a) => a + (r() - .5) * 3;
  const line = (pts) => S.push(pts.map(([x, y]) => [wob(x), wob(y)]));
  const curve = (p0, c, p1, n = 12) => { const o = []; for (let i = 0; i <= n; i++) { const u = i / n; o.push([(1 - u) * (1 - u) * p0[0] + 2 * u * (1 - u) * c[0] + u * u * p1[0], (1 - u) * (1 - u) * p0[1] + 2 * u * (1 - u) * c[1] + u * u * p1[1]]); } return o; };
  line([...curve([92, 650], [88, 560], [104, 466]), ...curve([104, 466], [150, 560], [206, 642]).slice(1), ...curve([206, 642], [208, 550], [224, 462]).slice(1)]);
  const o = []; for (let i = 0; i <= 26; i++) { const a = -Math.PI / 2 - i / 26 * TAU * 1.04; o.push([300 + Math.cos(a) * 52, 588 + Math.sin(a) * 58]); } line(o);
  line([[392, 632], [396, 636], [392, 640], [388, 634], [394, 632]]);
  // a firm underline
  line(curve([80, 690], [250, 676], [420, 686], 14));
  return S;
})();
const NO_LEN = NO.map((s) => s.reduce((a, p, i) => a + (i ? Math.hypot(p[0] - s[i - 1][0], p[1] - s[i - 1][1]) : 0), 0));
function inkNo(g, u) {
  const tot = NO_LEN.reduce((a, b) => a + b, 0); let left = u * tot;
  g.save(); g.strokeStyle = '#1e1b3c'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 17;
  for (let i = 0; i < NO.length && left > 0; i++) {
    const s = NO[i]; g.beginPath(); g.moveTo(s[0][0], s[0][1]); let L = 0;
    for (let j = 1; j < s.length; j++) { const d = Math.hypot(s[j][0] - s[j - 1][0], s[j][1] - s[j - 1][1]); if (L + d > left) { const q = (left - L) / d; g.lineTo(mix(s[j - 1][0], s[j][0], q), mix(s[j - 1][1], s[j][1], q)); L = left; break; } g.lineTo(s[j][0], s[j][1]); L += d; }
    g.stroke(); left -= NO_LEN[i];
  }
  g.restore();
}
// the sheet's corners in 3D (lift: flat on the desk → upright facing the camera)
function sheet(L) {
  const e = smo(clamp(L.lift ?? 0)), a = e * Math.PI / 2, w = LETTER.w, h = LETTER.h;
  const flat = { x: LETTER.x, y: DESK.top - .003, z: LETTER.z }, c = { x: mix(flat.x, UP.x, e), y: mix(flat.y, UP.y, e) - Math.sin(e * Math.PI) * .12, z: mix(flat.z, UP.z, e) };
  const yaw = LETTER.yaw * (1 - e), along = [Math.sin(yaw) * Math.cos(a), -Math.sin(a), Math.cos(yaw) * Math.cos(a)], across = [Math.cos(yaw), 0, -Math.sin(yaw)];
  const P = (i, j) => [c.x + across[0] * i * w / 2 + along[0] * j * h / 2, c.y + along[1] * j * h / 2, c.z + across[2] * i * w / 2 + along[2] * j * h / 2];
  return { tl: P(-1, 1), tr: P(1, 1), bl: P(-1, -1), br: P(1, -1), c };
}
// the outline of the folding sheet (letter-local metres, x right, y up) from the rectangle to the dart seen from behind
const RECT = [[-.13, .18], [0, .18], [.13, .18], [.13, -.18], [0, -.18], [-.13, -.18]];
const HOUSE = [[-.13, .05], [0, .18], [.13, .05], [.13, -.18], [0, -.18], [-.13, -.18]];
const DART = [[-.1375, -.165], [0, .165], [.1375, -.165], [.05, -.165], [0, -.165], [-.05, -.165]];   // = the 3D dart (size 1.1) seen from above, nose up
function foldShape(u) {
  const a = smo(clamp(u / .45)), b = smo(clamp((u - .4) / .5));
  return RECT.map((p, i) => [mix(mix(p[0], HOUSE[i][0], a), DART[i][0], b), mix(mix(p[1], HOUSE[i][1], a), DART[i][1], b)]);
}
let INKC = null;
export function drawLetter(ctx, t, cam, L) {
  const S = sheet(L), A = cam.P(...S.tl), B = cam.P(...S.tr), C = cam.P(...S.bl); if (!A || !B || !C) return;
  const fold = clamp(L.fold ?? 0);
  if (fold <= 0) {
    // the paper with its ink (cached letter + the "No." drawn into a small reused canvas only while it writes)
    const [pw, ph] = LETTER_PX, ink = clamp(L.ink ?? 0);
    ctx.save(); ctx.transform((B[0] - A[0]) / pw, (B[1] - A[1]) / pw, (C[0] - A[0]) / ph, (C[1] - A[1]) / ph, A[0], A[1]);
    ctx.shadowColor = 'rgba(20,10,20,.35)'; ctx.shadowBlur = 18 * (L.lift ?? 0); ctx.shadowOffsetY = 10 * (L.lift ?? 0);
    ctx.drawImage(letterTex(), 0, 0, pw, ph); ctx.shadowColor = 'transparent';
    if (ink > 0) inkNo(ctx, ink);
    // the light of the window on the paper (warm, from the top right)
    const g = ctx.createLinearGradient(pw, 0, 0, ph); g.addColorStop(0, rgba('#ffe2b8', .28)); g.addColorStop(1, rgba('#ffe2b8', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, pw, ph);
    ctx.restore();
    return;
  }
  // folding: the outline morphs from the sheet to the dart (frontal plane at the sheet's centre); the ink stays on the paper's face
  const c = cam.P(S.c.x, S.c.y, S.c.z); if (!c) return; const k = c[2], shp = foldShape(fold);
  const pts = shp.map(([x, y]) => [c[0] + x * k, c[1] - y * k]);
  ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
  const g = ctx.createLinearGradient(c[0], c[1] - .18 * k, c[0], c[1] + .18 * k); g.addColorStop(0, '#fbf4e4'); g.addColorStop(1, '#e2d4b8'); ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = rgba('#7a6a50', .6); ctx.lineWidth = Math.max(1, .004 * k); ctx.stroke();
  // fold lines and the ink of the "No." squeezed with the paper
  ctx.clip(); ctx.strokeStyle = rgba('#8a7a60', .55); ctx.lineWidth = Math.max(1, .003 * k); ctx.beginPath(); ctx.moveTo(c[0], c[1] - .18 * k); ctx.lineTo(c[0], c[1] + .18 * k);
  const b = smo(clamp((fold - .4) / .5)); ctx.moveTo(c[0], c[1] - .16 * k); ctx.lineTo(c[0] - mix(.13, .02, b) * k, c[1] + mix(-.05, .04, b) * k); ctx.moveTo(c[0], c[1] - .16 * k); ctx.lineTo(c[0] + mix(.13, .02, b) * k, c[1] + mix(-.05, .04, b) * k); ctx.stroke();
  const sq = 1 - b * .7; ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(sq, 1); ctx.strokeStyle = rgba('#1e1b3c', .9 * (1 - b * .5)); ctx.lineWidth = .012 * k; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-.09 * k, .09 * k); ctx.lineTo(-.085 * k, -.01 * k); ctx.lineTo(-.03 * k, .085 * k); ctx.lineTo(-.025 * k, -.015 * k); ctx.stroke(); ctx.beginPath(); ctx.ellipse(.03 * k, .05 * k, .028 * k, .032 * k, 0, 0, TAU); ctx.stroke(); ctx.restore();
  ctx.restore();
}
export const LETTER_UP = UP;

// ---------------------------------------------------------------- the paper dart
// local model (metres): forward +z, right +x, up −y. size 1 → a 30 cm dart
const DM = { N: [0, 0, .15], L: [-.125, -.012, -.15], R: [.125, -.012, -.15], C: [0, 0, -.15], K: [0, .045, -.15], KF: [0, .012, .03] };
function rot(p, o) {
  let [x, y, z] = p; const { yaw = 0, pitch = 0, roll = 0 } = o;
  let c = Math.cos(roll), s = Math.sin(roll); [x, y] = [x * c - y * s, x * s + y * c];          // roll about z
  c = Math.cos(pitch); s = Math.sin(pitch); [y, z] = [y * c - z * s, y * s + z * c];            // pitch about x (nose up = negative y)
  c = Math.cos(yaw); s = Math.sin(yaw); [x, z] = [x * c + z * s, -x * s + z * c];               // yaw about y
  return [x, y, z];
}
function dartFaces(P, o) {
  const col = o.col || '#f6efe0', lit = o.lit ?? .5;
  const top = mixHex(shade(col, -.06), '#fff8ec', lit), under = shade(col, -.2), keel = shade(col, -.12);
  return [[['L', 'N', 'C'], top], [['R', 'N', 'C'], mixHex(top, under, .25)], [['N', 'C', 'K'], keel], [['KF', 'N', 'K'], keel]];
}
function drawFaces(ctx, S, faces, lw) {
  // painter's order: the faces farther from the viewer first (by mean depth k: smaller k = farther)
  const list = faces.map(([ids, col]) => { const pts = ids.map((i) => S[i]); return { pts, col, d: pts.reduce((a, p) => a + p[2], 0) }; }).sort((a, b) => a.d - b.d);
  for (const f of list) { ctx.beginPath(); f.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fillStyle = f.col; ctx.fill(); ctx.strokeStyle = rgba('#7a6a50', .55); ctx.lineWidth = lw; ctx.stroke(); }
}
export function drawDart(ctx, cam, pos, ori, o = {}) {
  const sz = o.size ?? 1, S = {};
  for (const [k, p] of Object.entries(DM)) { const q = rot(p.map((v) => v * sz), ori), s = cam.P(pos[0] + q[0], pos[1] + q[1], pos[2] + q[2]); if (!s) return null; S[k] = s; }
  const k = S.N[2]; drawFaces(ctx, S, dartFaces(S, o), Math.max(.8, .004 * k * sz));
  if (o.glow) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffe8c8', o.glow); ctx.beginPath(); ctx.arc(S.N[0], S.N[1], .02 * k, 0, TAU); ctx.fill(); ctx.restore(); }
  return S;
}
// orthographic screen version (hill world): s = px per metre; depth only orders the faces
export function dartScreen(ctx, x, y, s, ori, o = {}) {
  const S = {};
  for (const [k, p] of Object.entries(DM)) { const q = rot(p, ori); S[k] = [x + q[0] * s, y + q[1] * s, -q[2]]; }
  drawFaces(ctx, S, dartFaces(S, o), o.lw ?? Math.max(.7, .004 * s));
  return S;
}
// orientation from a velocity (and a roll from the turn)
export function oriFrom(v, roll = 0) { const h = Math.hypot(v[0], v[2]) || 1e-6; return { yaw: Math.atan2(v[0], v[2]), pitch: Math.atan2(-v[1], h), roll }; }

// the wing filling the frame (the flight's change of place): from the dart at (x0, y0, s0 px/m) to its top-left face covering the frame
export const faceTop = (o = {}) => mixHex(shade(o.col || '#f6efe0', -.06), '#fff8ec', o.lit ?? .5);
function faceIn(ori) {
  const L = rot(DM.L, ori), N = rot(DM.N, ori), C = rot(DM.C, ori);
  const a = Math.hypot(N[0] - C[0], N[1] - C[1]), b = Math.hypot(L[0] - C[0], L[1] - C[1]), c = Math.hypot(L[0] - N[0], L[1] - N[1]), p = a + b + c || 1;
  return [(a * L[0] + b * N[0] + c * C[0]) / p, (a * L[1] + b * N[1] + c * C[1]) / p];
}
export function wingFill(ctx, u, x0, y0, s0, ori, o = {}) {
  const e = clamp(u);
  if (e >= .999) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = faceTop(o); ctx.fillRect(0, 0, 1920, 1080); ctx.restore(); return null; }
  const s = Math.exp(mix(Math.log(s0), Math.log(90000), e)), [ix, iy] = faceIn(ori), w = Math.pow(e, .35);
  return dartScreen(ctx, mix(x0, 960 - ix * s, w), mix(y0, 540 - iy * s, w), s, ori, { ...o, lw: Math.min(6, Math.max(.8, .004 * s)) });
}
