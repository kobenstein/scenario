// "That gap is exactly where Kokotajlo's story splits. Both endings start the same way."
// The camera cranes up from behind the car. The fog ahead thins and shows the road splitting in two:
// left into cold cyan fog, right toward a warm amber glow (the same colours as the fork in minute one).
// On "both endings start the same way" one thread of light runs up the shared road and only then divides.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease } = L;
const { grainFill, blob } = require('./s_k4_gap');
const { road, mix, mixHex, F } = require('./s_k4_fog');

const T0 = 232.70, T1 = 240.00;
const V = 11;
const ZF = 95;                     // fork, world metres ahead of where the scene starts
const T_CR = [233.2, 236.0], T_SPLIT = 236.25, T_RUN = 237.4;
const branch = (side, d) => d <= 0 ? 0 : side * (0.0035 * d * d + 0.16 * d);
const vel = t => lerp(11, 6, sm((t - 233.4) / 2.2));
function dist(t) { const n = 60, h = (t - T0) / n; let s = 0; for (let i = 0; i < n; i++) s += vel(T0 + (i + 0.5) * h) * h; return s; }       // lateral offset of a branch, d metres past the fork
const BL = 170;

function draw(ctx, t) {
  const cr = ease(clamp((t - T_CR[0]) / (T_CR[1] - T_CR[0])));
  const camH = lerp(2.8, 15, cr), hy = lerp(380, 250, cr), carZ = lerp(6.8, 30, cr);
  const s = dist(t);                                    // distance driven
  const forkRel = ZF - s + (carZ - 6.8);                    // the fork in camera-relative depth
  const clear = ramp(t, 235.4, 236.6);
  const split = out((t - (T_SPLIT - 0.2)) / 1.1);
  const dx = drift(t, 0.8, 21) * 6, dy = drift(t, 0.8, 22) * 4;
  ctx.save(); ctx.translate(dx, dy);
  road(ctx, t, { v: vel(t), s, carZ, carX: 1.6, camX: 1.0 + 0.6 * cr, camH, hy, pal: 'night', fog: lerp(42, 150, clear), reach: 30, bounce: 0.6, roadEnd: forkRel,
    groundHook: (ctx, P, cam, fk, pal) => {
      // horizon glows: cold on the left, warm on the right, rising as the road splits
      const hz = cam.hy;
      blob(ctx, 360, hz + 10, 900, 220, C.cyanD, 0.55 * split, true);
      blob(ctx, 300, hz + 30, 500, 120, C.cyan, 0.18 * split, true);
      blob(ctx, 1600, hz + 10, 900, 240, '#c9702e', 0.55 * split, true);
      blob(ctx, 1640, hz - 10, 420, 140, '#ffcf8a', 0.30 * split, true);
      // the two branches, drawn outward from the fork
      for (const side of [-1, 1]) {
        const len = BL * split; if (len < 1) continue;
        const N = 26, pts = [];
        for (let i = 0; i <= N; i++) { const d = -8 + (len + 8) * i / N, z = forkRel + d * 0.95; if (z < 1.5) continue; pts.push([branch(side, d), z, d]); }
        if (pts.length < 2) continue;
        const tint = side < 0 ? '#4aa6c4' : '#ffb35c';
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, z0, d0] = pts[i], [x1, z1] = pts[i + 1], w0 = 3.4, w1 = 3.4;
          const a = P(x0 - w0, 0, z0, cam), b = P(x0 + w0, 0, z0, cam), c = P(x1 + w1, 0, z1, cam), d = P(x1 - w1, 0, z1, cam);
          const k = fk(z0), u = d0 / BL;
          ctx.fillStyle = mix(mixHex('#3a3a6e', tint, 0.25 + 0.4 * u), pal.fog, k * 0.6);
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.fill();
        }
        // centre dashes on each branch
        for (let dd = 4; dd < len; dd += 12) { const p0 = P(branch(side, dd), 0, forkRel + dd * 0.95, cam), p1 = P(branch(side, dd + 4), 0, forkRel + (dd + 4) * 0.95, cam);
          ctx.strokeStyle = rgba(pal.line, 0.35 * (1 - fk(forkRel + dd))); ctx.lineWidth = Math.max(1, 0.15 * F / (forkRel + dd)); ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke(); }
      }
      // the wedge of land between the branches, a darker field with a few cold or warm lights
      // one thread of light up the shared road, dividing at the fork
      const run = (t - T_RUN) / 1.6;
      if (run > 0) {
        const trunkU = clamp(run * 1.6), brU = clamp((run - 0.55) / 0.9);
        const z0 = carZ + 4.6, z1 = lerp(z0, forkRel, ease(trunkU));
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
        const seg = (pts, col, a, wd) => { ctx.beginPath(); pts.forEach((p, i) => { const q = P(p[0], 0.05, p[1], cam); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
          ctx.strokeStyle = rgba(col, a * 0.35); ctx.lineWidth = wd * 4; ctx.stroke(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = wd; ctx.stroke(); };
        const tr = []; for (let i = 0; i <= 20; i++) tr.push([0.0, lerp(z0, z1, i / 20)]);
        seg(tr, '#fff1d6', 0.85, 3);
        const head = P(0, 0.05, z1, cam); light(ctx, head[0], head[1], 50, '#fff1d6', trunkU < 1 ? 0.8 : 0.3);
        if (brU > 0) for (const side of [-1, 1]) {
          const bp = []; for (let i = 0; i <= 30; i++) { const d = BL * ease(brU) * i / 30; bp.push([branch(side, d), forkRel + d * 0.95]); }
          seg(bp, side < 0 ? C.cyan : C.amber, 0.9, 3);
          const e = bp[bp.length - 1], q = P(e[0], 0.05, e[1], cam); light(ctx, q[0], q[1], 60, side < 0 ? C.cyan : C.amber, 0.7 * (1 - 0.5 * brU));
        }
        ctx.restore();
      }
      light(ctx, ...P(0, 0.1, forkRel, cam), 120, '#fff1d6', 0.25 * split);
    } });
  ctx.restore();
}

module.exports = { T0, T1, draw };
