// "In twenty twenty-four, Anthropic mapped millions of 'features' inside one of its models.
//  Little patterns, each one tied to an idea."
// The black cube's lid slides open, cyan light pours out, the camera falls in: inside is a vast night-sky map
// of tiny points. Then small clusters light up one after another, each drawing its own little line glyph:
// a cup, a note, a tree, a house.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, stamp, out, ease } = L;
const { grainFill } = require('./s_k6_key');

const T0 = 347.75, T1 = 357.65;

// ---------------------------------------------------------------- the map (world coordinates, origin at centre)
const MW = 4000, MH = 2500, S = 1.25;
const R = rng(2024);
const FIL = Array.from({ length: 34 }, () => {   // filaments: gently curving random walks
  let x = (R() - 0.5) * MW * 0.8, y = (R() - 0.5) * MH * 0.75, a = R() * Math.PI * 2; const pts = [];
  for (let k = 0; k < 40; k++) { a += (R() - 0.5) * 0.5; x += Math.cos(a) * 34; y += Math.sin(a) * 34; pts.push([x, y]); }
  return pts;
});
function gauss(r) { return (r() + r() + r() - 1.5) / 1.5; }
let MAP = null, MAPLO = null, MAPMID = null;
function mapCanvas(z = 2) {
  if (!MAP) build();
  return z <= 0.6 ? MAPLO : z <= 1.05 ? MAPMID : MAP;
}
function build() {
  const cv = L.createCanvas(Math.ceil(MW * S), Math.ceil(MH * S)), c = cv.getContext('2d');
  c.scale(S, S); c.translate(MW / 2, MH / 2);
  const r = rng(77);
  // soft nebula clouds under the points
  for (let k = 0; k < 26; k++) {
    const f = FIL[k % FIL.length][Math.floor(r() * 40)], rr = 200 + r() * 420;
    c.fillStyle = rad(c, f[0], f[1], 0, rr, [[0, rgba(r() < 0.7 ? '#1a5a8a' : '#4a3a8a', 0.16)], [1, 'rgba(10,20,60,0)']]);
    c.fillRect(f[0] - rr, f[1] - rr, 2 * rr, 2 * rr);
  }
  // background haze of points: "millions"
  for (let i = 0; i < 26000; i++) {
    const x = gauss(r) * MW * 0.36, y = gauss(r) * MH * 0.36;
    const e = (x * x) / (MW * MW * 0.2) + (y * y) / (MH * MH * 0.2); if (e > 1) continue;
    c.fillStyle = rgba(r() < 0.85 ? C.cyan : C.lav, 0.12 + r() * 0.3); c.fillRect(x, y, 1.1, 1.1);
  }
  // denser points along the filaments, in knots
  for (const f of FIL) for (let k = 0; k < f.length; k++) {
    const knot = r() < 0.18, n = knot ? 70 : 14, sp = knot ? 26 : 40;
    for (let j = 0; j < n; j++) {
      const x = f[k][0] + gauss(r) * sp, y = f[k][1] + gauss(r) * sp, b = r();
      c.fillStyle = rgba(b < 0.1 ? C.cyanW : C.cyan, 0.25 + b * 0.55);
      c.beginPath(); c.arc(x, y, 0.7 + b * 1.3, 0, Math.PI * 2); c.fill();
    }
  }
  MAP = cv;
  const mk = k => { const m = L.createCanvas(Math.ceil(MW * k), Math.ceil(MH * k)); m.getContext('2d').drawImage(cv, 0, 0, m.width, m.height); return m; };
  MAPMID = mk(1.05); MAPLO = mk(0.6);
}
// twinkling live points drawn per frame
const LIVE = Array.from({ length: 420 }, () => { const f = FIL[Math.floor(R() * FIL.length)][Math.floor(R() * 40)]; return [f[0] + gauss(R) * 60, f[1] + gauss(R) * 60, R() * 6.28, 0.6 + R() * 1.4]; });

// ---------------------------------------------------------------- feature clusters with line glyphs
// glyph strokes in a 100 x 100 box (centre 50,50): arrays of polylines
function arcPts(cx, cy, r, a0, a1, n = 14) { const p = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; }
const GLYPH = {
  cup: [[[22, 38], [28, 84], [66, 84], [72, 38], [22, 38]], arcPts(74, 56, 12, -1.4, 1.4), [[36, 30], [32, 22], [38, 14], [34, 6]], [[52, 30], [48, 22], [54, 14], [50, 6]], [[14, 90], [80, 90]]],
  note: [arcPts(32, 76, 12, 0, Math.PI * 2, 18), [[44, 74], [44, 14], [72, 26], [72, 40], [44, 30]], arcPts(68, 66, 9, 0, Math.PI * 2, 14).map(([x, y]) => [x + 8, y - 4])],
  tree: [[[46, 92], [46, 62]], [[54, 92], [54, 62]], arcPts(50, 40, 26, Math.PI * 0.75, Math.PI * 2.25, 20), arcPts(34, 54, 14, Math.PI * 0.5, Math.PI * 1.4, 8), arcPts(66, 54, 14, -0.4, Math.PI * 0.5, 8), [[30, 92], [70, 92]]],
  house: [[[20, 50], [50, 18], [80, 50]], [[28, 44], [28, 88], [72, 88], [72, 44]], [[44, 88], [44, 64], [56, 64], [56, 88]], [[60, 30], [60, 18], [68, 18], [68, 38]]],
  bridge: [[[0, 72], [100, 72]], [[27, 84], [27, 18]], [[33, 84], [33, 18]], [[27, 30], [33, 30]], [[27, 46], [33, 46]], [[67, 84], [67, 18]], [[73, 84], [73, 18]], [[67, 30], [73, 30]], [[67, 46], [73, 46]],
    [[0, 62], [10, 50], [20, 34], [30, 18]], Array.from({ length: 13 }, (_, i) => { const u = i / 12; return [lerp(30, 70, u), 18 + 46 * (1 - Math.pow(2 * u - 1, 2))]; }), [[70, 18], [80, 34], [90, 50], [100, 62]],
    ...[40, 46, 52, 58, 62].flatMap(x => [[[x, 18 + 46 * (1 - Math.pow(2 * (x - 30) / 40 - 1, 2))], [x, 72]], [[100 - x, 18 + 46 * (1 - Math.pow(2 * (70 - x) / 40 - 1, 2))], [100 - x, 72]]])],
  sun: [arcPts(50, 50, 16, 0, Math.PI * 2, 18), ...Array.from({ length: 8 }, (_, k) => { const a = k * Math.PI / 4; return [[50 + Math.cos(a) * 26, 50 + Math.sin(a) * 26], [50 + Math.cos(a) * 38, 50 + Math.sin(a) * 38]]; })],
};
const plen = p => { let s = 0; for (let i = 1; i < p.length; i++) s += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return s; };
for (const k in GLYPH) GLYPH[k].len = GLYPH[k].reduce((s, p) => s + plen(p), 0);

// draw a glyph progressively (0..1 of its total stroke length), sx = size in px
function glyph(ctx, name, x, y, sx, prog, a, col = C.cyanW, glow = C.cyan) {
  if (prog <= 0 || a <= 0) return;
  const G = GLYPH[name], k = sx / 100; let budget = prog * G.len;
  ctx.save(); ctx.translate(x - 50 * k, y - 50 * k); ctx.scale(k, k);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [w, al, c] of [[9, 0.14, glow], [3.2, 0.95, col]]) {
    let b = budget; ctx.strokeStyle = rgba(c, al * a); ctx.lineWidth = w / Math.max(0.6, k * 1.4) * 1.4;
    for (const p of G) {
      if (b <= 0) break; ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length; i++) { const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); if (b >= d) { ctx.lineTo(p[i][0], p[i][1]); b -= d; } else { const u = b / d; ctx.lineTo(lerp(p[i - 1][0], p[i][0], u), lerp(p[i - 1][1], p[i][1], u)); b = 0; break; } }
      ctx.stroke();
    }
  }
  ctx.restore();
}

// clusters: world position, glyph, time the cluster lights up
const CL = [
  { x: -260, y: -230, g: 'cup', t: 354.55 },
  { x: 200, y: -60, g: 'note', t: 355.45 },
  { x: -120, y: 190, g: 'tree', t: 356.05 },
  { x: 380, y: 250, g: 'house', t: 356.6 },
  { x: -520, y: 60, g: 'sun', t: 356.95 },
];
const BRIDGE = { x: 760, y: -280 };      // the Golden Gate cluster (lit in the next scene)
function clusterPts(seed, n = 46, sp = 34) { const r = rng(seed); return Array.from({ length: n }, () => [gauss(r) * sp, gauss(r) * sp * 0.8, r(), r() * 6.28]); }
CL.forEach((c, i) => { c.pts = clusterPts(100 + i); });
BRIDGE.pts = clusterPts(99, 60, 40);

// draw the map seen by camera cam = {x, y, z} (world point at screen centre)
function mapView(ctx, t, cam, opt = {}) {
  const M = mapCanvas(cam.z), a = opt.alpha ?? 1;
  ctx.save(); ctx.globalAlpha = a;
  ctx.translate(W / 2, H / 2); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);
  ctx.drawImage(M, -MW / 2, -MH / 2, MW, MH);
  ctx.restore();
  // live twinkles
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, ph, s] of LIVE) {
    const sx = W / 2 + (x - cam.x) * cam.z, sy = H / 2 + (y - cam.y) * cam.z; if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
    const tw = Math.pow(0.5 + 0.5 * Math.sin(t * (1.1 + s) + ph), 3);
    ctx.fillStyle = rgba(C.cyanW, a * 0.8 * tw); ctx.beginPath(); ctx.arc(sx, sy, s * Math.max(0.8, cam.z * 0.8), 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
const toScreen = (cam, x, y) => [W / 2 + (x - cam.x) * cam.z, H / 2 + (y - cam.y) * cam.z];

// a feature cluster: its points brighten, faint links connect them, glow; returns screen centre
function cluster(ctx, t, cam, c, on, a = 1, col = C.cyanW) {
  const [cx, cy] = toScreen(cam, c.x, c.y), z = cam.z;
  if (cx < -300 || cx > W + 300 || cy < -300 || cy > H + 300) return [cx, cy];
  light(ctx, cx, cy, 170 * z, col === C.cyanW ? C.cyan : col, (0.08 + 0.4 * on) * a);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  if (on > 0) {
    ctx.strokeStyle = rgba(col, 0.22 * on * a); ctx.lineWidth = 1;
    ctx.beginPath(); for (let i = 1; i < c.pts.length; i += 2) { const p = c.pts[i], q = c.pts[i - 1]; ctx.moveTo(cx + p[0] * z, cy + p[1] * z); ctx.lineTo(cx + q[0] * z, cy + q[1] * z); } ctx.stroke();
  }
  for (const [px, py, b, ph] of c.pts) {
    const tw = 0.6 + 0.4 * Math.sin(t * 2 + ph);
    ctx.fillStyle = rgba(col, (0.25 + 0.75 * on) * tw * a); ctx.beginPath(); ctx.arc(cx + px * z, cy + py * z, (1 + b * 1.6) * Math.max(0.7, z * 0.7) * (1 + on * 0.5), 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  return [cx, cy];
}

// the cube's silhouette as a faint outline around the whole map ("inside one of its models")
function ghostCube(ctx, cam, a) {
  if (a <= 0) return;
  const s = 2150, P = (x, y) => toScreen(cam, x, y);
  const pts = [P(0, -s * 0.78), P(s, -s * 0.3), P(s, s * 0.42), P(0, s * 0.9), P(-s, s * 0.42), P(-s, -s * 0.3)];
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineJoin = 'round';
  for (const [w, al] of [[8, 0.06], [2, 0.3]]) {
    ctx.strokeStyle = rgba(C.cyan, al * a); ctx.lineWidth = w;
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.stroke();
    const c = P(0, s * 0.06); ctx.beginPath(); ctx.moveTo(pts[1][0], pts[1][1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(pts[5][0], pts[5][1]); ctx.moveTo(c[0], c[1]); ctx.lineTo(pts[3][0], pts[3][1]); ctx.stroke();
  }
  ctx.restore();
}

function sky(ctx) {
  ctx.fillStyle = rad(ctx, W / 2, H / 2, 100, 1300, [[0, '#0e1236'], [1, '#05060f']]); ctx.fillRect(0, 0, W, H);
}

// camera path for the map part of this scene
function camAt(t) {
  const k1 = ease((t - 349.0) / 2.8);                 // fall in, then pull back to see "millions"
  const k2 = ease((t - 353.9) / 1.6);                 // move in on the little patterns
  let z = lerp(3.2, 0.42, k1); z = lerp(z, 1.35, k2);
  const x = lerp(lerp(60, 0, k1), 20, k2) + drift(t, 0.6, 1) * 10 / z, y = lerp(lerp(-40, 40, k1), 0, k2) + drift(t, 0.6, 2) * 8 / z;
  return { x, y, z: z * (1 + 0.02 * Math.sin(t * 0.4)) };
}

function draw(ctx, t) {
  const { boxShot } = require('./s_k6_box');
  const open = ease((t - 348.3) / 0.9), fall = ease((t - 348.7) / 0.9);
  if (t < 349.6) {
    // the lid slides open and the camera falls toward the light
    ctx.save(); ctx.translate(760, 330); ctx.scale(1 + fall * 2.2, 1 + fall * 2.2); ctx.translate(-760, -330 + fall * 40);
    boxShot(ctx, Math.min(t, 348.05), { open: open > 0.02 ? 1 : 0 });
    // the lid: two panels sliding apart, light pouring out
    if (open > 0) {
      const s = 330 * 1.08, cx = 760, cy = 330, dy = s * 0.5;
      light(ctx, cx, cy, 500 + 600 * open, C.cyan, 0.5 * open);
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, cy, 0, cy - 700, [[0, rgba(C.cyanW, 0.35 * open)], [1, rgba(C.cyan, 0)]]);
      ctx.beginPath(); ctx.moveTo(cx - s, cy); ctx.lineTo(cx, cy - dy); ctx.lineTo(cx + s, cy); ctx.lineTo(cx + s * 1.4, cy - 800); ctx.lineTo(cx - s * 1.4, cy - 800); ctx.closePath(); ctx.fill();
      ctx.restore();
      // inside: the first points visible through the opening
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx - s * 0.93, cy); ctx.lineTo(cx, cy - dy * 0.93); ctx.lineTo(cx + s * 0.93, cy); ctx.lineTo(cx, cy + dy * 0.93); ctx.closePath(); ctx.clip();
      ctx.fillStyle = '#0b1640'; ctx.fillRect(cx - s, cy - dy, 2 * s, 2 * dy);
      mapView(ctx, t, { x: 0, y: 0, z: 0.36 }, { alpha: open });
      ctx.restore();
      for (const sd of [-1, 1]) {
        const off = open * 300 * sd;
        grainFill(ctx, c => { c.moveTo(cx + off * 1.1, cy - dy - off * 0.25 - 30 * open); c.lineTo(cx + sd * s * 0.5 + off * 1.1, cy - dy * 0.5 - off * 0.25 - 30 * open); c.lineTo(cx + off * 1.1, cy - off * 0.25 - 30 * open); c.lineTo(cx - sd * s * 0.5 + off * 1.1, cy - dy * 0.5 - off * 0.25 - 30 * open); c.closePath(); },
          '#1c1c44', 0.5, [cx - 900, cy - 700, 1800, 1000]);
      }
    }
    ctx.restore();
    // flash into the map
    const fl = ramp(t, 349.0, 349.45);
    if (fl > 0) { ctx.save(); ctx.globalAlpha = fl; drawMap(ctx, t); ctx.restore(); }
    return;
  }
  drawMap(ctx, t);
}

function drawMap(ctx, t) {
  const cam = camAt(t);
  sky(ctx);
  mapView(ctx, t, cam);
  ghostCube(ctx, cam, ramp(t, 351.6, 352.5) * (1 - ramp(t, 354.0, 354.8)));
  BRIDGE && cluster(ctx, t, cam, BRIDGE, 0, 0.8);
  for (const c of CL) {
    const on = ramp(t, c.t - 0.1, c.t + 0.35);
    const [sx, sy] = cluster(ctx, t, cam, c, on);
    if (on > 0) {
      light(ctx, sx, sy, 60, C.cyanW, 0.5 * Math.exp(-Math.max(0, t - c.t) * 3));
      glyph(ctx, c.g, sx + 4, sy - 104 * cam.z, 130 * cam.z, out((t - c.t) / 0.7), on);
    }
  }
  stamp(ctx, t, 348.6, 354.2, '2024', 'Anthropic maps millions of features', { size: 120 });
}

module.exports = { T0, T1, draw, mapView, cluster, glyph, toScreen, sky, CL, BRIDGE, GLYPH, ghostCube, camAt };
