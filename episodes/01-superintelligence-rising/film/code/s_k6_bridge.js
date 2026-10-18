// "One of them was the Golden Gate Bridge. They turned it up, and the model got, as they put it,
//  'effectively obsessed with the bridge.'"
// The camera glides to one dim cluster; its points fly into the outline of the Golden Gate Bridge, glowing orange.
// A dial beside it turns up; the bridge flares, and bridges start popping up everywhere in the map, even where
// the cup and the note were. Quote card.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, label, out, ease } = L;
const { mapView, cluster, glyph, toScreen, sky, CL, BRIDGE, GLYPH, camAt } = require('./s_k6_map');
const { grainFill } = require('./s_k6_key');

const T0 = 357.35, T1 = 366.30;
const ORANGE = '#ff8a4c', ORW = '#ffd2a8';

// sample points along the bridge glyph, one per cluster point, in the 0..100 box
function samplePts(name, n) {
  const G = GLYPH[name], segs = [];
  for (const p of G) for (let i = 1; i < p.length; i++) segs.push([p[i - 1], p[i], Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])]);
  const tot = segs.reduce((s, q) => s + q[2], 0), out = [];
  for (let k = 0; k < n; k++) {
    let d = (k + 0.5) / n * tot;
    for (const [a, b, l] of segs) { if (d <= l) { out.push([lerp(a[0], b[0], d / l), lerp(a[1], b[1], d / l)]); break; } d -= l; }
  }
  return out;
}
const BS = 300;                                         // world size of the main bridge
const TARGET = samplePts('bridge', BRIDGE.pts.length).map(([x, y]) => [(x - 50) * BS / 100, (y - 50) * BS / 100]);

// copies of the bridge that pop up all over the map once the feature is turned up
const R = rng(1937);
const COPIES = [
  ...CL.map((c, i) => ({ x: c.x, y: c.y - 70, s: 150, t: 361.75 + i * 0.32, rot: 0 })),
  ...Array.from({ length: 22 }, (_, i) => { const a = R() * 6.28, d = 380 + R() * 1150; return { x: BRIDGE.x * 0.4 + Math.cos(a) * d * 1.3, y: Math.sin(a) * d * 0.7, s: 70 + R() * 130, t: 362.0 + R() * 2.6, rot: (R() - 0.5) * 0.25 }; }),
];

function cam(t) {
  const c0 = camAt(t);
  const k = ease((t - 357.6) / 1.4);                    // glide to the bridge cluster
  const k2 = ease((t - 361.5) / 2.6);                   // pull back to see the bridges everywhere
  let x = lerp(c0.x, BRIDGE.x + 40, k), y = lerp(c0.y, BRIDGE.y + 10, k), z = lerp(c0.z, 1.75, k);
  x = lerp(x, 250, k2); y = lerp(y, -40, k2); z = lerp(z, 0.62, k2);
  return { x: x + drift(t, 0.6, 3) * 8 / z, y: y + drift(t, 0.6, 4) * 6 / z, z };
}

function dial(ctx, x, y, r, v, t, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  const a0 = -Math.PI * 1.25, a1 = Math.PI * 0.25;
  for (let k = 0; k <= 12; k++) {
    const u = k / 12, an = lerp(a0, a1, u), on = u <= v + 1e-3;
    ctx.strokeStyle = on ? rgba(ORANGE, 0.95) : rgba(C.lav, 0.35); ctx.lineWidth = on ? r * 0.07 : r * 0.05; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(Math.cos(an) * r * 1.18, Math.sin(an) * r * 1.18); ctx.lineTo(Math.cos(an) * r * (1.32 + (k % 3 === 0 ? 0.08 : 0)), Math.sin(an) * r * (1.32 + (k % 3 === 0 ? 0.08 : 0))); ctx.stroke();
  }
  grainFill(ctx, c => c.arc(0, 0, r, 0, Math.PI * 2), lin(ctx, -r, -r, r, r, [[0, '#3a3270'], [1, '#0e0c26']]), 0.5, [-r * 1.2, -r * 1.2, r * 2.4, r * 2.4]);
  ctx.strokeStyle = rgba(C.cyan, 0.25); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2); ctx.stroke();
  for (let k = 0; k < 18; k++) { const an = k / 18 * Math.PI * 2; ctx.fillStyle = 'rgba(4,4,16,0.4)'; ctx.beginPath(); ctx.arc(Math.cos(an) * r * 0.9, Math.sin(an) * r * 0.9, r * 0.05, 0, Math.PI * 2); ctx.fill(); }
  const an = lerp(a0, a1, v);
  ctx.strokeStyle = ORW; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.moveTo(Math.cos(an) * r * 0.25, Math.sin(an) * r * 0.25); ctx.lineTo(Math.cos(an) * r * 0.8, Math.sin(an) * r * 0.8); ctx.stroke();
  ctx.restore();
  light(ctx, x + Math.cos(an) * r * 0.8, y + Math.sin(an) * r * 0.8, r * 0.8, ORANGE, 0.4 * a * v);
}

function quote(ctx, t, t0, t1, text, who, x, y) {
  const a = ramp(t, t0, t0 + 0.5) * (1 - ramp(t, t1 - 0.4, t1)); if (a <= 0) return;
  const rise = (1 - out((t - t0) / 0.8)) * 16;
  ctx.save(); ctx.globalAlpha = a; ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(5,6,18,0.78)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x - 36, y - 30 + rise, 900, 190, 14) : ctx.rect(x - 36, y - 30 + rise, 900, 190); ctx.fill();
  ctx.fillStyle = ORANGE; ctx.fillRect(x - 36, y - 30 + rise, 4, 190);
  ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 18;
  ctx.fillStyle = C.cream; ctx.font = '68px "Instrument Serif"'; ctx.fillText(text, x, y + rise);
  ctx.fillStyle = C.lav; ctx.font = '24px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.fillText(who.toUpperCase(), x + 2, y + 100 + rise);
  ctx.restore();
}

function draw(ctx, t) {
  const cm = cam(t);
  sky(ctx);
  // the rest of the map dims slightly while we look at the bridge
  mapView(ctx, t, cm, { alpha: 1 - 0.35 * ramp(t, 358.0, 359.0) * (1 - ramp(t, 361.6, 362.8)) });
  // the earlier clusters keep their glyphs, until bridges take over their places
  for (let i = 0; i < CL.length; i++) {
    const c = CL[i], take = ramp(t, COPIES[i].t - 0.2, COPIES[i].t + 0.2);
    const [sx, sy] = cluster(ctx, t, cm, c, 1 - 0.5 * ramp(t, 357.6, 358.5), 1);
    glyph(ctx, c.g, sx + 4, sy - 104 * cm.z, 130 * cm.z, 1, (1 - 0.5 * ramp(t, 357.6, 358.5)) * (1 - take));
  }
  // the bridge feature: its points fly into the shape of the bridge on "Golden Gate"
  const v = lerp(0.22, 1, ease((t - 360.6) / 0.65));          // the dial
  const form = ease((t - 358.75) / 0.9), on = ramp(t, 358.0, 358.8);
  const [bx, by] = toScreen(cm, BRIDGE.x, BRIDGE.y), z = cm.z;
  const boost = 0.5 + 0.5 * v + 0.15 * Math.sin(t * 6) * ramp(t, 361.0, 361.4);
  light(ctx, bx, by, 380 * z, ORANGE, (0.08 + 0.32 * form) * boost);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  BRIDGE.pts.forEach(([px, py, b, ph], i) => {
    const [tx, ty] = TARGET[i], u = clamp(form * 1.25 - (i % 7) * 0.035);
    const k = ease(u), x = bx + lerp(px, tx, k) * z, y = by + lerp(py, ty, k) * z - Math.sin(k * Math.PI) * 30 * z;
    const col = k > 0.5 ? ORW : C.cyanW;
    ctx.fillStyle = rgba(col, (0.35 + 0.65 * on) * (0.7 + 0.3 * Math.sin(t * 2 + ph))); ctx.beginPath(); ctx.arc(x, y, (1.4 + b * 1.6) * Math.max(0.8, z * 0.8), 0, Math.PI * 2); ctx.fill();
  });
  ctx.restore();
  glyph(ctx, 'bridge', bx, by, BS * z, ease((t - 359.1) / 0.9), clamp(0.6 + 0.4 * v) * ramp(t, 359.05, 359.4), ORW, ORANGE);
  // water shimmer under the bridge
  if (form > 0.5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let k = 0; k < 7; k++) { const yy = by + (BS * 0.27 + 10 + k * 9) * z, ww = (BS * 0.9 - k * 22) * z * (0.8 + 0.2 * Math.sin(t * 1.5 + k)); ctx.strokeStyle = rgba(ORANGE, 0.16 * (1 - k / 7) * boost); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx - ww / 2 + Math.sin(t + k) * 10 * z, yy); ctx.lineTo(bx + ww / 2 + Math.sin(t + k) * 10 * z, yy); ctx.stroke(); } ctx.restore(); }
  // the dial appears beside it and turns up on "turned it up"
  const da = ramp(t, 359.9, 360.4) * (1 - ramp(t, 363.4, 364.0));
  dial(ctx, bx + BS * 0.78 * z, by + BS * 0.05 * z, 56 * Math.max(0.75, z * 0.8), v, t, da);
  label(ctx, t, 359.2, 361.9, 'Golden Gate Bridge', 'one feature', bx - BS * 0.5 * z, by + BS * 0.38 * z);
  // and then the bridge is everywhere
  for (const c of COPIES) {
    const k = t - c.t; if (k <= 0) continue;
    const pop = 1 + 0.35 * Math.exp(-k * 6) * Math.sin(k * 18);
    const [x, y] = toScreen(cm, c.x, c.y), s = c.s * cm.z * pop * clamp(k / 0.25);
    const a = clamp(k / 0.15) * (x < 1060 && y < 330 ? 1 - 0.85 * ramp(t, 363.6, 364.1) : 1);
    if (x < -200 || x > W + 200 || y < -200 || y > H + 200) continue;
    light(ctx, x, y, s * 0.9, ORANGE, 0.22 * a);
    ctx.save(); ctx.translate(x, y); ctx.rotate(c.rot + Math.sin(t * 0.8 + c.x) * 0.03); glyph(ctx, 'bridge', 0, 0, s, 1, a, ORW, ORANGE); ctx.restore();
    if (k < 0.3) light(ctx, x, y, s * 0.6, ORW, 0.5 * (1 - k / 0.3));
  }
  quote(ctx, t, 363.75, T1 + 0.3, '“effectively obsessed with the bridge”', 'Anthropic researchers, 2024', 110, 96);
}

module.exports = { T0, T1, draw, cam, COPIES, ORANGE, ORW, BS, TARGET, dial };
