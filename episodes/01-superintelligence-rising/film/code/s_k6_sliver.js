// "It showed you can read some of what's in there, and even change it. But they can only see a sliver of it so far.
//  And Neel Nanda at Google DeepMind has warned that this alone won't reliably catch an AI that's trying to deceive us.
//  AI is starting to help here, too."
// The copies fade; a reading lens passes over the bridge feature (read), the dial twists it (change). Then the camera
// pulls back and down: a small person on a dark hill shines a torch into the vast map; only a thin wedge is lit.
// A dark shape drifts in the unlit part; when the beam swings toward it, it slides away, always just outside.
// Then a small cyan helper light floats down beside the person and adds a second beam.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, label, out, ease } = L;
const { mapView, cluster, glyph, toScreen, sky, CL, BRIDGE } = require('./s_k6_map');
const { cam: bridgeCam, COPIES, ORANGE, ORW, BS, dial } = require('./s_k6_bridge');
const { grainFill, poly } = require('./s_k6_key');
const { coated } = require('./s_k6_box');

const T0 = 366.0, T1 = 383.9;

const PULL = [370.3, 372.4];                     // pull back on "But they can only see a sliver"
function cam(t) {
  const c0 = bridgeCam(Math.min(t, 366.3));
  const k1 = ease((t - 366.1) / 1.3);                 // back in on the bridge
  const k2 = ease((t - PULL[0]) / (PULL[1] - PULL[0]));
  let x = lerp(c0.x, BRIDGE.x + 40, k1), y = lerp(c0.y, BRIDGE.y + 10, k1), z = lerp(c0.z, 1.25, k1);
  x = lerp(x, 330, k2); y = lerp(y, 60, k2); z = lerp(z, 0.5, k2);
  z *= 1 + 0.035 * ramp(t, 372.4, T1);              // slow creep forward afterwards
  return { x: x + drift(t, 0.5, 3) * 8 / z, y: y + drift(t, 0.5, 4) * 6 / z, z };
}

const HAND = [520, 716];
const HALF = 0.075;                                  // the beam's half angle: a sliver
function beamAngle(t) {
  const base = Math.atan2(330 - HAND[1], 1210 - HAND[0]);
  // a slow search, then a quick swing toward the shape on "reliably catch"
  return base + 0.03 * Math.sin(t * 0.6) + 0.17 * ease((t - 377.55) / 0.9) - 0.06 * ease((t - 379.4) / 1.2);
}
// the hidden shape: stays just outside the beam on its upper side
function shapeAngle(t) {
  const a = beamAngle(t), free = a + HALF + 0.24 + 0.04 * Math.sin(t * 0.7);
  const flee = a + HALF + 0.115 + 0.01 * Math.sin(t * 2.0);
  return lerp(free, flee, ramp(t, 376.6, 377.6));
}

const R = rng(373);
const SHAPE = Array.from({ length: 70 }, () => [R() * Math.PI * 2, 0.85 + R() * 0.25, R()]);

function hill(ctx, t, rise) {
  const y0 = lerp(1240, 900, rise);
  grainFill(ctx, c => { c.moveTo(-50, y0 + 40); c.bezierCurveTo(300, y0 - 40, 700, y0 - 20, 1000, y0 + 30); c.bezierCurveTo(1300, y0 + 70, 1700, y0 + 10, W + 50, y0 + 50); c.lineTo(W + 50, H + 60); c.lineTo(-50, H + 60); c.closePath(); },
    lin(ctx, 0, y0 - 40, 0, H, [[0, '#14123a'], [1, '#05050f']]), 0.6, [-60, y0 - 80, W + 120, H - y0 + 160]);
  return y0;
}

function torchBeam(ctx, t, ox, oy, ang, half, len, col, a, mapFn) {
  const p1 = [ox + Math.cos(ang - half) * len, oy + Math.sin(ang - half) * len], p2 = [ox + Math.cos(ang + half) * len, oy + Math.sin(ang + half) * len];
  ctx.save(); ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.closePath(); ctx.clip();
  ctx.globalAlpha = a; mapFn();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, ox, oy, 0, len, [[0, rgba(col, 0.32 * a)], [0.3, rgba(col, 0.12 * a)], [1, rgba(col, 0.02 * a)]]);
  ctx.fillRect(Math.min(ox, p1[0], p2[0]) - 10, Math.min(oy, p1[1], p2[1]) - 10, Math.abs(Math.max(ox, p1[0], p2[0]) - Math.min(ox, p1[0], p2[0])) + 20, Math.abs(Math.max(oy, p1[1], p2[1]) - Math.min(oy, p1[1], p2[1])) + 20);
  ctx.restore();
  // soft edges of the beam
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 2;
  for (const p of [p1, p2]) { ctx.strokeStyle = lin(ctx, ox, oy, p[0], p[1], [[0, rgba(col, 0.35 * a)], [1, rgba(col, 0)]]); ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(p[0], p[1]); ctx.stroke(); }
  ctx.restore();
}

function draw(ctx, t) {
  const cm = cam(t), pull = ease((t - PULL[0]) / (PULL[1] - PULL[0]));
  const [bx, by] = toScreen(cm, BRIDGE.x, BRIDGE.y), z = cm.z;
  sky(ctx);
  // outside the beam, the map sinks into darkness as we pull back
  const dimA = lerp(1, 0.13, ramp(t, 370.6, 372.2));
  mapView(ctx, t, cm, { alpha: dimA });
  // the earlier clusters, faint
  for (const c of CL) cluster(ctx, t, cm, c, 0.2, dimA);
  // bridge copies sink back into points
  for (const c of COPIES) {
    const a = 1 - ramp(t, 366.0, 366.7 + (c.x % 7 + 7) % 7 * 0.05); if (a <= 0) continue;
    const [x, y] = toScreen(cm, c.x, c.y); glyph(ctx, 'bridge', x, y, c.s * z, 1, a, ORW, ORANGE);
  }
  // the bridge feature: read (lens passes over it), then changed (the dial twists it)
  const v = 0.55 + 0.45 * Math.sin(clamp((t - 369.2) / 1.0) * Math.PI) * (t > 369.2 ? 1 : 0) - 0.3 * Math.sin(clamp((t - 369.2) / 1.0) * Math.PI * 2) * 0.5;
  const bA = dimA * 0.4 + 0.6;
  light(ctx, bx, by, 360 * z, ORANGE, 0.3 * v * bA);
  glyph(ctx, 'bridge', bx, by, BS * z, 1, (0.55 + 0.45 * v) * bA, ORW, ORANGE);
  // reading lens glides in and rests over the bridge
  const lensIn = ease((t - 366.6) / 0.8), lensOut = ramp(t, 370.0, 370.6);
  if (lensIn > 0 && lensOut < 1) {
    const lx = lerp(bx - 520 * z, bx - 10 * z, lensIn) + Math.sin(t * 1.2) * 6, ly = by + Math.sin(t * 0.9) * 5, lr = 200 * z;
    ctx.save(); ctx.globalAlpha = 1 - lensOut;
    ctx.save(); ctx.beginPath(); ctx.arc(lx, ly, lr, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = 'rgba(255,200,140,0.06)'; ctx.fillRect(lx - lr, ly - lr, 2 * lr, 2 * lr);
    ctx.save(); ctx.translate(lx, ly); ctx.scale(1.25, 1.25); ctx.translate(-lx, -ly); glyph(ctx, 'bridge', bx, by, BS * z, 1, 1, '#fff2e0', ORANGE); ctx.restore();
    light(ctx, lx - lr * 0.3, ly - lr * 0.3, lr, '#fff2e0', 0.12);
    ctx.restore();
    ctx.strokeStyle = ORW; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(lx, ly, lr, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#7a3b17'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(lx, ly, lr + 5, 0, Math.PI * 2); ctx.stroke();
    ctx.lineCap = 'round'; ctx.strokeStyle = '#c9702e'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(lx + lr * 0.72, ly + lr * 0.72); ctx.lineTo(lx + lr * 1.25, ly + lr * 1.25); ctx.stroke();
    ctx.restore();
  }
  // the dial twists on "change it"
  const dA = ramp(t, 368.7, 369.1) * (1 - ramp(t, 370.3, 370.8));
  dial(ctx, bx + BS * 0.8 * z, by + BS * 0.42 * z, 56, clamp(0.35 + 0.6 * Math.sin(clamp((t - 369.25) / 0.9) * Math.PI * 0.5 + 0.0) ), t, dA);

  // ---- the pull back: a person on a dark hill with a torch, the beam lights only a sliver
  const rise = ease((t - 370.5) / 1.7);
  if (rise > 0) {
    const ang = beamAngle(t), len = 2300, yOff = lerp(1240, 900, rise) - 900;
    const b = Math.sin(t * 1.6), hx = HAND[0], hy = HAND[1] + yOff + b;
    const aBeam = ramp(t, 370.9, 371.75);
    torchBeam(ctx, t, hx + Math.cos(ang) * 34, hy + Math.sin(ang) * 34, ang, HALF * (0.6 + 0.4 * aBeam), len, '#ffd9a0', aBeam, () => {
      mapView(ctx, t, cm); for (const c of CL) cluster(ctx, t, cm, c, 0.6, 1);
      glyph(ctx, 'bridge', bx, by, BS * z, 1, 1, ORW, ORANGE);
    });
    // the hidden shape: dark, only its edge catches a few points of light, sliding away from the beam
    const sa = ramp(t, 373.3, 374.2);
    if (sa > 0) {
      const ah = shapeAngle(t), d = 880, sx = hx + Math.cos(ah) * d, sy = hy + Math.sin(ah) * d;
      const vel = shapeAngle(t + 0.05) - shapeAngle(t - 0.05), stretch = 1 + clamp(Math.abs(vel) * 40, 0, 0.5);
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(ah + Math.PI / 2); ctx.scale(stretch, 1 / stretch);
      const rr = 78;
      ctx.globalAlpha = sa;
      ctx.fillStyle = rad(ctx, 0, 0, rr * 0.3, rr * 1.2, [[0, 'rgba(4,4,14,0.9)'], [0.7, 'rgba(4,4,14,0.75)'], [1, 'rgba(4,4,14,0)']]);
      ctx.beginPath(); for (let k = 0; k <= 40; k++) { const a = k / 40 * Math.PI * 2, r = rr * (1 + 0.12 * Math.sin(a * 3 + t * 1.3) + 0.06 * Math.sin(a * 5 - t)); k ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.8) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r * 0.8); } ctx.closePath(); ctx.fill();
      // edge points: barely there, brighter on the side facing the beam
      ctx.globalCompositeOperation = 'lighter';
      for (const [a, r, b] of SHAPE) {
        const side = 0.5 + 0.5 * Math.cos(a - Math.PI / 2 * 0 + Math.PI);
        ctx.fillStyle = rgba(C.cyan, sa * (0.08 + 0.3 * side * b) * (0.7 + 0.3 * Math.sin(t * 2 + a * 5)));
        ctx.beginPath(); ctx.arc(Math.cos(a + t * 0.05) * rr * r, Math.sin(a + t * 0.05) * rr * r * 0.8, 1.2 + b * 1.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    // the hill and the person
    const y0 = hill(ctx, t, rise);
    const hipY = y0 - 118;
    light(ctx, hx + 30, hy - 18, 160, '#ffd9a0', 0.55 * aBeam);
    coated(ctx, { x: 470, y: hipY + b * 0.8, s: 0.82, len: 0.98, facing: 'back', br: b, lean: 0.03, turn: 0.35 + 0.08 * Math.sin(t * 0.5) + 0.2 * ramp(t, 381.8, 382.6), tilt: -0.2, lx: -1,
      rim: '#ffd9a0', rimA: 0.35, rimDx: 2, rimDy: -2, pal: ['#e8964e', '#a85424', '#401a0a'], hem: 1.05,
      arms: [{ tx: 440, ty: hipY + 26, bend: 1, behind: true }, { tx: hx, ty: hy, bend: -1 }],
      legs: [{ a1: 1.66, a2: 1.6 }, { a1: 1.45, a2: 1.52 }] });
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(beamAngle(t));
    grainFill(ctx, c => { c.moveTo(-6, -7); c.lineTo(34, -9); c.lineTo(34, 9); c.lineTo(-6, 7); c.closePath(); }, lin(ctx, 0, -9, 0, 9, [[0, '#3a3270'], [1, '#0e0c26']]), 0.4, [-10, -12, 50, 24]);
    ctx.restore();
    light(ctx, hx + Math.cos(beamAngle(t)) * 34, hy + Math.sin(beamAngle(t)) * 34, 40, '#fff2e0', 0.9 * aBeam);

    // ---- AI is starting to help: a small cyan light floats down and adds its own beam
    const help = ease((t - 381.5) / 1.0);
    if (help > 0) {
      const ox = lerp(980, 630, help) + Math.sin(t * 1.4) * 8, oy = lerp(-60, 600, help) + Math.sin(t * 2.1) * 6;
      const hb = ramp(t, 382.55, 383.2), ang2 = beamAngle(t) - 0.24 + 0.04 * Math.sin(t * 0.8);
      if (hb > 0) torchBeam(ctx, t, ox, oy, ang2, HALF * 1.1 * hb, 2200, C.cyan, hb, () => { mapView(ctx, t, cm); for (const c of CL) cluster(ctx, t, cm, c, 0.6, 1); });
      // trail
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let k = 1; k < 12; k++) { const tt = t - k * 0.04, h2 = ease((tt - 381.5) / 1.0); const px = lerp(980, 630, h2) + Math.sin(tt * 1.4) * 8, py = lerp(-60, 600, h2) + Math.sin(tt * 2.1) * 6; ctx.fillStyle = rgba(C.cyan, 0.25 * (1 - k / 12) * (1 - hb * 0.7)); ctx.beginPath(); ctx.arc(px, py, 9 * (1 - k / 14), 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
      light(ctx, ox, oy, 150, C.cyan, 0.5);
      grainFill(ctx, c => c.arc(ox, oy, 16, 0, Math.PI * 2), rad(ctx, ox - 4, oy - 5, 1, 18, [[0, '#ffffff'], [0.4, C.cyanW], [1, C.cyanD]]), 0, null);
      ctx.strokeStyle = rgba(C.cyan, 0.5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(ox, oy, 28, 9, Math.sin(t) * 0.3, 0, Math.PI * 2); ctx.stroke();
    }
  }
  label(ctx, t, 373.85, 380.9, 'Neel Nanda', 'Google DeepMind', 110, 120);
}

module.exports = { T0, T1, draw };
