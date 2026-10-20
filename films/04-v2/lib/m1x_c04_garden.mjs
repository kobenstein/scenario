// Film 4 v2 · the minute, chunk c04 · the gardener of the pop-up dawn (Jakob, 1:12: "soll das ein golfschläger sein? sieht nicht so aus").
// Owner: c04 (minute repair). A paper-cut silhouette (like every figure of the pop-up) watering a row of seedlings with a classic
// watering can: barrel body, one long handle over the top and down the back, a long spout with a rose; one hand on the top handle, the
// other on the back handle (two hands, as a full can is carried and tipped), the can tipped forward and a shower of water arcing from
// the rose onto the seedlings, which bob when the drops hit them. He stands bent from the hips with soft knees, a straw hat on,
// breathes, shifts his weight and glances about (figure.mjs life), and sweeps the can slowly along the row.
//   gardener(ctx, t, o)   piece coordinates (plate units); o: { x (between the feet), y (the ground), s (figure scale), live 0..1,
//                          pour0 (time the can tips), seed, col, rim, rimSide (+1 light from +x, −1 from −x) }
//                          The gardener faces −x (toward the sun of the pop-up).
import { rgba, clamp, mix, sm, lin } from '../engine.mjs';
import { figureFlat, reachArm, life } from './figure.mjs';

const TAU = Math.PI * 2;
const hash = (x) => { const v = Math.sin(x * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

// ---------------------------------------------------------------- the watering can, in can units (origin = the top grip, +x = forward
// toward the spout, +y = down). Real proportions: body ≈ 30 cm long, spout ≈ 30 cm, rose ≈ 8 cm (1 can unit ≈ 1.9 cm at s = .5).
const GRIP = [0, -1], REAR = [-10.2, 9.5];
const SPOUT0 = [9.6, 12.4], SPOUT1 = [22.5, -.5];
const SU = (() => { const dx = SPOUT1[0] - SPOUT0[0], dy = SPOUT1[1] - SPOUT0[1], L = Math.hypot(dx, dy); return [dx / L, dy / L]; })();
const ROSE = [SPOUT1[0] + SU[0] * 2.6, SPOUT1[1] + SU[1] * 2.6];   // the face of the rose (where the water leaves)
function canShape(g) {
  // body: a barrel with a domed shoulder
  g.beginPath();
  g.moveTo(-6.8, 8.5); g.quadraticCurveTo(-7.4, 16.4, -3.6, 16.8); g.lineTo(8.4, 16.8); g.quadraticCurveTo(11.6, 16.4, 11, 8.2);
  g.quadraticCurveTo(10.4, 4.6, 6.4, 4.2); g.lineTo(-3.4, 4.2); g.quadraticCurveTo(-6.4, 4.6, -6.8, 8.5); g.closePath(); g.fill();
  // the filler cap on the shoulder
  g.beginPath(); g.ellipse(-1.5, 4.1, 3.4, 1.5, 0, Math.PI, TAU); g.fill();
  // the handle: from the front of the shoulder over the top, down the back into the body (one continuous loop, a hand on top and at the back)
  g.lineWidth = 1.9; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = g.fillStyle;
  g.beginPath(); g.moveTo(5.4, 4.6); g.bezierCurveTo(5.2, .4, 3, -1, 0, -1); g.lineTo(-4.6, -1); g.bezierCurveTo(-9, -1, -10.4, 2.4, -10.3, 6.2);
  g.lineTo(-10.1, 11.6); g.quadraticCurveTo(-9.8, 14.2, -6.9, 14.3); g.stroke();
  // the spout: a long tapered tube from the bottom of the body
  const nx = -SU[1], ny = SU[0];
  g.beginPath(); g.moveTo(SPOUT0[0] - nx * 1.5, SPOUT0[1] - ny * 1.5 - 1.2); g.lineTo(SPOUT1[0] - nx * .75, SPOUT1[1] - ny * .75);
  g.lineTo(SPOUT1[0] + nx * .75, SPOUT1[1] + ny * .75); g.lineTo(SPOUT0[0] + nx * 1.5, SPOUT0[1] + ny * 1.5 + .6); g.closePath(); g.fill();
  // the rose: a flared head across the spout
  g.beginPath(); g.moveTo(SPOUT1[0] - nx * .9, SPOUT1[1] - ny * .9); g.lineTo(ROSE[0] - nx * 2.9, ROSE[1] - ny * 2.9);
  g.quadraticCurveTo(ROSE[0] + SU[0] * .7, ROSE[1] + SU[1] * .7, ROSE[0] + nx * 2.9, ROSE[1] + ny * 2.9); g.lineTo(SPOUT1[0] + nx * .9, SPOUT1[1] + ny * .9); g.closePath(); g.fill();
}

// ---------------------------------------------------------------- seedlings in a bed
function seedling(ctx, x, y, h, ang, i, col, rim, rimSide) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  // rim light on the sun side, then the plant
  for (const pass of [0, 1]) {
    ctx.save(); if (!pass) ctx.translate(rimSide * .55, -.25);
    ctx.fillStyle = ctx.strokeStyle = pass ? col : rim; ctx.lineWidth = .9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(.8, -h * .5, 0, -h); ctx.stroke();
    const lw = 2.6 + .4 * (i % 2);
    ctx.beginPath(); ctx.ellipse(-lw * .8, -h - .4, lw, lw * .42, -.45, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(lw * .8, -h - .6, lw, lw * .42, .45, 0, TAU); ctx.fill();
    if (i % 3 !== 1) { ctx.beginPath(); ctx.ellipse(.6, -h * .55, lw * .7, lw * .32, -.8 + (i % 2) * 1.6, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the gardener
export function gardener(ctx, t, o) {
  const s = o.s ?? .5, sf = s / .5, seed = o.seed ?? 8, col = o.col || '#22172c', rim = o.rim || '#ffbf80', rimSide = o.rimSide ?? -1;
  const live = clamp(o.live ?? 1), x0 = o.x, gy = o.y;
  const Lf = life(t, seed), b = Lf.b, w = Lf.w;
  // the can tips forward to pour (pour0 → +.7 s) and rocks gently; it sweeps slowly along the row
  const pour = sm(lin(o.pour0, o.pour0 + .7, t)) * live;
  const tilt = mix(.18, .98, pour) + .07 * Math.sin(t * 1.9 + .4) * pour;
  const sweep = 4.5 * Math.sin(t * .85 + 1.2) * pour, lift = 1.6 * Math.sin(t * .85 + 2.6) * pour;
  // pose: bent from the hips, knees soft, head down to the plants (feet planted: the hip height follows the bent legs)
  const base = { lean: mix(.16, .4, pour) + .015 * Math.sin(t * 1.9 + .4) * pour, head: mix(.12, .34, pour), hip: [.3, -.14], kn: [.24, .14], sh: [.8, .5], el: [.3, .6], hair: 'short' };
  const hipR = [base.hip[0] + w * .05, base.hip[1] - w * .05], knR = [...base.kn]; knR[w > 0 ? 1 : 0] += Math.abs(w) * .1;
  const ext = Math.max(...[0, 1].map((i) => Math.cos(hipR[i]) * 45 + Math.cos(hipR[i] - knR[i]) * 43));
  const hx = x0 + 6 * sf, hy = gy - ext * s;
  // the can: its top grip in front of the body at thigh height (forward = −x)
  const G = [hx - (38 + sweep) * s, hy - (16 + lift) * s], cs = 1.18 * sf;
  const ca = Math.cos(tilt), sa = Math.sin(tilt);
  const toW = ([u, v]) => { const ru = (u - GRIP[0]) * ca - (v - GRIP[1]) * sa, rv = (u - GRIP[0]) * sa + (v - GRIP[1]) * ca; return [G[0] - ru * cs, G[1] + rv * cs]; };
  const rear = toW(REAR), rose = toW(ROSE);
  const dirL = [SU[0] * ca - SU[1] * sa, SU[0] * sa + SU[1] * ca], dir = [-dirL[0], dirL[1]];
  // arms: both hands on the handle (reachArm), locked against the idle sway
  const fo = { t, seed }, pose = { ...base };
  const a0 = reachArm(hx, hy, s, pose, 0, true, fo, G, 1), a1 = reachArm(hx, hy, s, pose, 1, true, fo, rear, 1);
  pose.sh = [a0.sh, a1.sh]; pose.el = [a0.el, a1.el]; pose.lock = [1, 1];
  const headAng = base.head + b * .015 + Lf.turn * .17 + Lf.nod * .07, sY = -64 - .9 * b;
  const hat = (g, A, B, c) => {   // a straw sun hat (brim + crown), tilted with the head
    g.save(); g.translate(1, sY - 2); g.rotate(headAng); g.fillStyle = c;
    g.beginPath(); g.ellipse(3, -21.5, 19, 3.1, .1, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(2.4, -23, 10.6, 8.6, .1, Math.PI * 1.02, Math.PI * 1.98); g.closePath(); g.fill();
    g.restore();
  };

  // ---- the seedling bed in front of him (where the water lands)
  const g0 = 516 * sf, v0 = 66 * sf, bed = [];
  { // where the central stream lands at full tilt with no sweep: the row is planted there
    const caf = Math.cos(.98), saf = Math.sin(.98), Gf = [hx - 38 * s, hy - 16 * s];
    const rf = [Gf[0] - ((ROSE[0] - GRIP[0]) * caf - (ROSE[1] - GRIP[1]) * saf) * cs, Gf[1] + ((ROSE[0] - GRIP[0]) * saf + (ROSE[1] - GRIP[1]) * caf) * cs];
    const df = [-(SU[0] * caf - SU[1] * saf), SU[0] * saf + SU[1] * caf], vy = df[1] * v0, hgt = gy - rf[1], th = (-vy + Math.sqrt(vy * vy + 2 * g0 * hgt)) / g0;
    const xi = rf[0] + df[0] * v0 * th;
    for (let i = 0; i < 6; i++) bed.push(xi + (i - 2.6) * 7.2 * sf);
  }
  // soil: a low dark ridge with a thin lit crest
  ctx.save(); ctx.fillStyle = '#170f1c'; ctx.beginPath(); ctx.ellipse((bed[0] + bed[5]) / 2, gy + .6, (bed[5] - bed[0]) / 2 + 6 * sf, 2.4 * sf, 0, Math.PI, TAU); ctx.fill();
  ctx.strokeStyle = rgba(rim, .45); ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse((bed[0] + bed[5]) / 2, gy + .6, (bed[5] - bed[0]) / 2 + 6 * sf, 2.4 * sf, 0, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke(); ctx.restore();

  // ---- the water: a shower of drops from the rose (5 jets fanned by the rose), in flight on real arcs under gravity
  const flow0 = o.pour0 + .38, drops = [], hits = [];
  if (t > flow0) {
    const RATE = 16, JETS = [[-.3, .9], [-.15, .97], [0, 1.03], [.15, .98], [.3, .92]];
    for (let j = 0; j < JETS.length; j++) {
      const [da, kv] = JETS[j], c = Math.cos(da), sn = Math.sin(da), d = [dir[0] * c - dir[1] * sn, dir[0] * sn + dir[1] * c], vx = d[0] * v0 * kv, vy = d[1] * v0 * kv;
      const hgt = gy - rose[1], th = (-vy + Math.sqrt(Math.max(0, vy * vy + 2 * g0 * hgt))) / g0;
      const n0 = Math.floor(t * RATE + j * .37);
      for (let n = n0; n > n0 - 14; n--) {
        const te = (n - j * .37) / RATE, a = t - te; if (te < flow0 + j * .05) break; if (a < 0) continue;
        const jit = (hash(n * 7.3 + j) - .5) * .05, A = a * (1 + jit);
        if (A <= th) drops.push([rose[0] + vx * A, rose[1] + vy * A + .5 * g0 * A * A, vx, vy + g0 * A, hash(n * 3.1 + j * 9.7)]);
        else if (A - th < .09) hits.push([rose[0] + vx * th, gy - 1.2 * sf, (A - th) / .09, hash(n * 1.7 + j)]);
      }
    }
  }
  const wet = (bx) => { let k = 0; for (const h of hits) k = Math.max(k, (1 - h[2]) * Math.exp(-Math.pow((h[0] - bx) / (3.2 * sf), 2))); return k; };
  const grow = 1 + .07 * sm(lin(flow0, flow0 + 2.5, t));
  bed.forEach((bx, i) => seedling(ctx, bx, gy - .4, (6.4 + 2.2 * hash(i * 5.3)) * sf * grow, .05 * Math.sin(t * 1.3 + i * 1.7) + .12 * wet(bx) * Math.sin(t * 40 + i), i, '#4f7d47', '#ffd9a0', rimSide));

  // ---- the gardener (paper-cut silhouette with the dawn rim), then the can in his hands
  figureFlat(ctx, hx, hy, s, pose, { t, seed, col, rim, rimSide, flip: true, fast: true, shadow: false, prop: hat });
  const off = Math.max(1.4, 1.3 * s);   // the rim: the same world offset figureFlat uses for the body
  for (const [dx, dy, c] of [[rimSide * off, -off * .35, rim], [0, 0, col]]) {
    ctx.save(); ctx.translate(G[0] + dx, G[1] + dy); ctx.scale(-cs, cs); ctx.rotate(tilt); ctx.translate(-GRIP[0], -GRIP[1]);
    ctx.fillStyle = c; canShape(ctx); ctx.restore();
  }

  // the drops: short bright streaks along their flight (water catching the low sun), a few sparkle; splashes where they land
  ctx.save(); ctx.lineCap = 'round';
  for (const [x, y, vx, vy, hsh] of drops) {
    const sp = Math.hypot(vx, vy), L = Math.min(3.4 * sf, sp * .03);
    ctx.strokeStyle = hsh < .2 ? 'rgba(255,246,228,.95)' : 'rgba(226,236,250,.82)'; ctx.lineWidth = (hsh < .2 ? 1.05 : .8) * sf;
    ctx.beginPath(); ctx.moveTo(x - vx / sp * L, y - vy / sp * L); ctx.lineTo(x, y); ctx.stroke();
  }
  ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, , , hsh] of drops) if (hsh < .2) { ctx.fillStyle = 'rgba(255,214,160,.5)'; ctx.beginPath(); ctx.arc(x, y, 1.7 * sf, 0, TAU); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
  for (const [x, y, u, hsh] of hits) {   // tiny splash: two droplets kicked up and falling back
    ctx.fillStyle = `rgba(232,240,250,${.75 * (1 - u)})`;
    for (const sx of [-1, 1]) { const px = x + sx * (1.2 + 2.2 * u) * sf * (.7 + hsh * .6), py = y - (3.2 * u - 3.6 * u * u) * sf; ctx.fillRect(px - .45 * sf, py - .45 * sf, .9 * sf, .9 * sf); }
  }
  ctx.restore();
  return { rose, grip: G };
}
