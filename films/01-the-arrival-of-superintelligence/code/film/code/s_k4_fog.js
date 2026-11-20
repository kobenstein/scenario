// "There's an old rule for driving in fog: never go faster than you can see. You don't have to stop the car.
// You just can't outrun your headlights."
// KEY IMAGE (comes back at the end of the episode): a car from behind on a night road in thick fog. Its headlights
// reach only so far into the fog. The car keeps moving (road markings, posts and trees stream past), and on
// "outrun your headlights" it eases off until its speed matches what the light can show.
// Exports road() so the two endings can reuse the same road (cold and warm).
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out } = L;
const { grainFill, blob, pat } = require('./s_k4_gap');

const T0 = 222.70, T1 = 233.00;

const F = 1150, CAMH = 2.8, VPX = 960, HY0 = 380;
const hex = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mixHex = (a, b, k) => { const A = hex(a), B = hex(b); return '#' + [0, 1, 2].map(i => Math.round(lerp(A[i], B[i], k)).toString(16).padStart(2, '0')).join(''); };
const mix = (a, b, k, al = 1) => { const A = hex(a), B = hex(b); return `rgba(${Math.round(lerp(A[0], B[0], k))},${Math.round(lerp(A[1], B[1], k))},${Math.round(lerp(A[2], B[2], k))},${al})`; };

const PALS = {
  night: { sky0: '#070920', sky1: '#1c2052', fog: '#2a2d62', ground: '#0d0e26', road: '#16173a', tree: '#080920', beam: '#fff1d6', glow: '#d8e4ff', tail: '#ff6a3a', body: ['#2a2350', '#120f2a'], line: '#c9c4e0' },
  cold: { sky0: '#040a18', sky1: '#0c2238', fog: '#16384e', ground: '#06101e', road: '#0c1a2c', tree: '#040a16', beam: '#d8f7ff', glow: '#8fe6ff', tail: '#ff6a3a', body: ['#1a2a40', '#08101e'], line: '#9fc8d8' },
  warm: { sky0: '#140c22', sky1: '#4a2a44', fog: '#7a4a52', ground: '#1a1020', road: '#2a1a30', tree: '#120a1a', beam: '#ffe6b8', glow: '#ffcf8a', tail: '#ff5a2a', body: ['#3a2440', '#140c1c'], line: '#f3d9b8' },
};

const RT = rng(4242);
const TREES = Array.from({ length: 40 }, (_, i) => { const side = i % 2 ? 1 : -1; return { side, x: side * (8 + RT() * 12), z0: RT() * 140, h: 6 + RT() * 5, w: 0.32 + RT() * 0.12, k: RT() }; });
const MOTES = Array.from({ length: 140 }, () => [(RT() - 0.5) * 3.2, 0.1 + RT() * 1.9, RT() * 50, RT()]);
const BANKS = Array.from({ length: 14 }, () => ({ x: (RT() - 0.5) * 16, z0: RT() * 90, y: 0.5 + RT() * 2.2, r: 4 + RT() * 6, k: RT() }));

function P(x, y, z, cam) { return [VPX + F * (x - cam.x) / z, cam.hy + F * (cam.h - y) / z]; }

// o: { s: distance driven (m), carZ, carX, pal, fog (visibility in m), reach (m), brake 0..1, lamps 0..1, camX }
function road(ctx, t, o) {
  const pal = PALS[o.pal || 'night'], cam = { x: o.camX ?? 1.0, h: o.camH ?? CAMH, hy: o.hy ?? HY0 }, HY = cam.hy, rEnd = o.roadEnd ?? 400, s = o.s, carZ = o.carZ, carX = o.carX ?? 1.6;
  const vis = o.fog ?? 45, reach = o.reach ?? 30, lamps = o.lamps ?? 1;
  const fk = z => 1 - Math.exp(-z / vis);
  const frontZ = carZ + 4.4;
  // sky and fog wall
  ctx.fillStyle = lin(ctx, 0, -200, 0, HY + 80, [[0, pal.sky0], [1, pal.sky1]]); ctx.fillRect(-400, -400, W + 800, HY + 480);
  ctx.fillStyle = lin(ctx, 0, HY - 120, 0, HY + 60, [[0, rgba(pal.fog, 0)], [1, rgba(pal.fog, 1)]]); ctx.fillRect(-400, HY - 120, W + 800, 180);
  // ground
  ctx.fillStyle = lin(ctx, 0, HY, 0, H + 200, [[0, pal.fog], [0.12, mix(pal.ground, pal.fog, 0.6)], [0.5, pal.ground], [1, pal.ground]]); ctx.fillRect(-400, HY, W + 800, H + 600);
  // road surface
  const rp = (zA, zB, xa, xb) => { const a = P(xa, 0, zA, cam), b = P(xb, 0, zA, cam), c = P(xb, 0, zB, cam), d = P(xa, 0, zB, cam); return k => { k.moveTo(a[0], a[1]); k.lineTo(b[0], b[1]); k.lineTo(c[0], c[1]); k.lineTo(d[0], d[1]); k.closePath(); }; };
  grainFill(ctx, rp(rEnd, 1.2, -3.6, 3.6), lin(ctx, 0, HY, 0, H, [[0, pal.fog], [0.1, mix(pal.road, pal.fog, 0.5)], [0.45, pal.road], [1, pal.road]]), 0.45);
  // headlight pool on the road (behind the car, reaching ahead)
  if (lamps > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const zEnd = frontZ + reach;
    const a = P(carX - 0.9, 0, frontZ, cam), b = P(carX + 0.9, 0, frontZ, cam), c = P(carX + 3.6, 0, zEnd, cam), d = P(carX - 3.4, 0, zEnd, cam);
    for (const [wd, al] of [[1.25, 0.14], [1, 0.18], [0.7, 0.2]]) {
      const a = P(carX - 0.9 * wd, 0, frontZ, cam), b = P(carX + 0.9 * wd, 0, frontZ, cam), c = P(carX + 3.6 * wd, 0, zEnd, cam), d = P(carX - 3.4 * wd, 0, zEnd, cam);
      ctx.fillStyle = lin(ctx, 0, a[1], 0, c[1], [[0, rgba(pal.beam, al * lamps)], [0.55, rgba(pal.beam, al * 0.5 * lamps)], [1, rgba(pal.beam, 0)]]);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  // markings: edge lines and centre dashes streaming toward us
  const line = (x0, x1, zA, zB, al) => { const a = P(x0, 0, zA, cam), b = P(x1, 0, zA, cam), c = P(x1, 0, zB, cam), d = P(x0, 0, zB, cam); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.closePath(); ctx.fillStyle = al; ctx.fill(); };
  const lit = z => lamps * clamp((frontZ + reach - z) / (reach * 0.6)) * (z > frontZ - 1 ? 1 : 0.35);
  for (const ex of [-3.35, 3.35]) for (let z = 1.5; z < Math.min(140, rEnd); z *= 1.18) { const z2 = Math.min(rEnd, z * 1.18), zm = (z + z2) / 2, k = fk(zm); line(ex - 0.08, ex + 0.08, z, z2, mix(pal.line, pal.fog, k, (0.30 + 0.5 * lit(zm)) * (1 - k * 0.9))); }
  const per = 12, ph = ((s % per) + per) % per;
  for (let i = 0; i < 16; i++) { const zA = 1.2 + i * per - ph, zB = Math.min(rEnd, zA + 4); if (zB < 1.2 || zA > rEnd) continue; const zm = Math.max(1.3, (zA + zB) / 2), k = fk(zm);
    line(-0.09, 0.09, Math.max(1.2, zA), zB, mix(pal.line, pal.fog, k, (0.35 + 0.6 * lit(zm)) * (1 - k * 0.92))); }
  if (o.groundHook) o.groundHook(ctx, P, cam, fk, pal);
  // trees and posts, far to near
  const items = [];
  for (const tr of TREES) { const z = ((tr.z0 - s) % 140 + 140) % 140 + 3; items.push(['tree', z, tr]); }
  for (let i = 0; i < 9; i++) for (const side of [-1, 1]) { const z = ((i * 16 + (side > 0 ? 8 : 0) - s) % 144 + 144) % 144 + 2; items.push(['post', z, side]); }
  items.sort((a, b) => b[1] - a[1]);
  for (const [kind, z, d] of items) {
    if (z > 150 || z > rEnd - 4) continue;
    const k = fk(z), al = clamp(1.25 - k * 1.3) * clamp((z - 2) / 2);
    if (al <= 0.01) continue;
    if (kind === 'tree') {
      const base = P(d.x, 0, z, cam), top = P(d.x, d.h, z, cam), hp = base[1] - top[1], wp = hp * d.w;
      const sway = Math.sin(t * 0.6 + d.k * 9) * 0.01;
      ctx.save(); ctx.globalAlpha = al; ctx.translate(base[0], base[1]); ctx.rotate(sway);
      const col = mix(pal.tree, pal.fog, k * 0.95);
      grainFill(ctx, c => { c.moveTo(0, -hp); for (let j = 0; j < 4; j++) { const yy = -hp + (j + 1) * hp * 0.22, w = wp * (0.35 + j * 0.22); c.lineTo(w, yy); c.lineTo(w * 0.45, yy - hp * 0.03); } c.lineTo(wp * 0.08, 0); c.lineTo(-wp * 0.08, 0);
        for (let j = 3; j >= 0; j--) { const yy = -hp + (j + 1) * hp * 0.22, w = wp * (0.35 + j * 0.22); c.lineTo(-w * 0.45, yy - hp * 0.03); c.lineTo(-w, yy); } c.closePath(); }, col, z < 30 ? 0.4 : 0);
      ctx.restore();
    } else {
      const x = d * 4.7, b = P(x, 0, z, cam), tp = P(x, 1.0, z, cam), wpx = Math.max(1.5, 0.12 * F / z);
      ctx.globalAlpha = al; ctx.fillStyle = mix('#0a0a1e', pal.fog, k * 0.95); ctx.fillRect(b[0] - wpx / 2, tp[1], wpx, b[1] - tp[1]);
      const rl = lit(z);
      const rf = P(x, 0.85, z, cam);
      ctx.fillStyle = rgba(d < 0 ? '#ffb35c' : '#f3efe2', 0.25 + 0.75 * rl); ctx.fillRect(rf[0] - wpx * 0.45, rf[1] - wpx * 0.4, wpx * 0.9, wpx * 0.8);
      ctx.globalAlpha = 1;
      if (rl > 0.05) light(ctx, rf[0], rf[1], wpx * 5, d < 0 ? C.amber : pal.beam, 0.35 * rl);
    }
    ctx.globalAlpha = 1;
  }
  // volumetric light: the beams fill the fog ahead and end in a soft wall
  if (lamps > 0) {
    const mid = P(carX, 0.8, frontZ + reach * 0.45, cam), end = P(carX, 1.0, frontZ + reach, cam), near = P(carX, 0.7, frontZ + 2, cam);
    const fl = lamps * (0.95 + 0.05 * Math.sin(t * 7.3) * Math.sin(t * 2.1));
    const zE = frontZ + reach, zM = frontZ + reach * 0.45, zN = frontZ + 2;
    blob(ctx, end[0], end[1], 20 * F / zE, 6 * F / zE, pal.glow, 0.26 * fl, true);
    blob(ctx, mid[0], mid[1] + 10, 9 * F / zM, 2.6 * F / zM, pal.beam, 0.22 * fl, true);
    blob(ctx, near[0], near[1], 4.6 * F / zN, 1.7 * F / zN, pal.beam, 0.36 * fl, true);
    // the beams as a soft tunnel of lit fog over the road ahead
    const n0 = P(carX - 1.0, 1.4, frontZ, cam), n1 = P(carX + 1.0, 1.4, frontZ, cam), f0 = P(carX - 3.0, 2.4, frontZ + reach, cam), f1 = P(carX + 3.2, 2.4, frontZ + reach, cam), g0 = P(carX - 3.4, 0, frontZ + reach, cam);
    for (let i = 0; i < 8; i++) { const u = i / 7, zz = frontZ + 1 + reach * u, c = P(carX + 0.1, 0.9 + u * 0.4, zz, cam), wpx = (2.2 + u * 3.5) * F / zz;
      blob(ctx, c[0], c[1], wpx * 1.1, wpx * 0.42, pal.beam, 0.10 * fl * (1 - u * 0.75), true); }
    // droplets in the beams, streaking past as the car moves
    const v = o.v ?? 20;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const [mx, my, mz, mk] of MOTES) {
      const z = ((mz - s) % 50 + 50) % 50 + frontZ - 2; if (z < frontZ - 1) continue;
      const lx = carX + mx * (1 + (z - frontZ) * 0.08), inb = clamp((frontZ + reach - z) / (reach * 0.5)) * clamp((z - frontZ + 1) / 3);
      if (inb <= 0) continue;
      const a = P(lx, my, z, cam), b = P(lx, my, z + 0.02 + v * 0.025, cam);
      ctx.strokeStyle = rgba(pal.beam, 0.5 * inb * lamps * (0.4 + 0.6 * mk)); ctx.lineWidth = 1 + 1.5 * mk;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    ctx.restore();
  }
  // fog banks drifting at us out of the dark, lit where the beams are
  for (const b of BANKS) {
    const z = ((b.z0 - s * 0.9 - t * 1.5) % 90 + 90) % 90 + 4;
    const p = P(b.x + Math.sin(t * 0.2 + b.k * 7) * 1.5, b.y, z, cam), r = b.r * F / z * 0.5;
    const inB = lamps * clamp(1 - Math.abs(b.x - carX) / 6) * clamp((frontZ + reach - z) / 10) * (z > frontZ ? 1 : 0.2);
    const a = (0.05 + 0.10 * inB) * clamp((z - 4) / 6) * clamp((90 - z) / 20);
    blob(ctx, p[0], p[1], r * 2.2, r * 0.7, inB > 0.1 ? pal.beam : pal.fog, a, true);
  }
  // the car
  ctx.save(); ctx.globalAlpha = clamp(1 - fk(carZ) * 0.97 + (fk(6.8) * 0.97)); car(ctx, t, P, cam, carX, carZ, pal, o.brake ?? 0, lamps, o.bounce ?? 1); ctx.restore();
  // low fog veil across the near ground
  ctx.fillStyle = lin(ctx, 0, HY - 40, 0, HY + 140, [[0, rgba(pal.fog, 0)], [0.5, rgba(pal.fog, 0.55)], [1, rgba(pal.fog, 0)]]); ctx.fillRect(-400, HY - 40, W + 800, 180);
  for (let k = 0; k < 6; k++) { const x = ((k * 420 + t * (20 + k * 6) + s * 6) % 2600) - 340; blob(ctx, x, HY + 30 + k * 18, 520, 60, pal.fog, 0.35); }
}

function car(ctx, t, P, cam, cx, cz, pal, brake, lamps, bounce) {
  const k = F / cz, o = P(cx, 0, cz, cam), bb = Math.sin(t * 9.1) * 0.6 * bounce + Math.sin(t * 3.3) * 0.8 * bounce;
  const X = x => o[0] + x * k, Y = y => o[1] - y * k + (y > 0.3 ? bb : 0);
  // shadow and the tail-light reflection streaks on the wet road
  ctx.fillStyle = 'rgba(3,3,12,0.55)'; ctx.beginPath(); ctx.ellipse(X(0), Y(0) + 2, 1.05 * k, 0.07 * k, 0, 0, Math.PI * 2); ctx.fill();
  const tl = 0.55 + 0.45 * brake;
  for (const sx of [-0.72, 0.72]) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, Y(0), 0, Y(0) + 0.9 * k, [[0, rgba(pal.tail, 0.30 * tl)], [1, rgba(pal.tail, 0)]]); ctx.fillRect(X(sx) - 0.12 * k, Y(0), 0.24 * k, 0.9 * k); ctx.restore(); }
  // wheels
  for (const sx of [-0.74, 0.74]) grainFill(ctx, c => L_rr(c, X(sx) - 0.15 * k, Y(0.6), 0.3 * k, 0.6 * k, 0.08 * k), '#05050f', 0.3);
  // body and cabin, with a rim of the light ahead
  const body = c => { c.moveTo(X(-0.92), Y(0.22)); c.lineTo(X(-0.95), Y(0.62)); c.quadraticCurveTo(X(-0.95), Y(0.92), X(-0.80), Y(0.95)); c.lineTo(X(0.80), Y(0.95)); c.quadraticCurveTo(X(0.95), Y(0.92), X(0.95), Y(0.62)); c.lineTo(X(0.92), Y(0.22)); c.quadraticCurveTo(X(0.9), Y(0.16), X(0.8), Y(0.16)); c.lineTo(X(-0.8), Y(0.16)); c.quadraticCurveTo(X(-0.9), Y(0.16), X(-0.92), Y(0.22)); c.closePath(); };
  const cabin = c => { c.moveTo(X(-0.82), Y(0.93)); c.lineTo(X(-0.62), Y(1.38)); c.quadraticCurveTo(X(-0.58), Y(1.45), X(-0.48), Y(1.45)); c.lineTo(X(0.48), Y(1.45)); c.quadraticCurveTo(X(0.58), Y(1.45), X(0.62), Y(1.38)); c.lineTo(X(0.82), Y(0.93)); c.closePath(); };
  ctx.save(); ctx.translate(0, -2.5); grainFill(ctx, cabin, rgba(pal.beam, 0.55 * lamps), 0); grainFill(ctx, body, rgba(pal.beam, 0.25 * lamps), 0); ctx.restore();
  grainFill(ctx, cabin, lin(ctx, 0, Y(1.45), 0, Y(0.93), [[0, pal.body[0]], [1, pal.body[1]]]), 0.5);
  grainFill(ctx, body, lin(ctx, 0, Y(0.95), 0, Y(0.16), [[0, pal.body[0]], [0.5, pal.body[1]], [1, '#05050f']]), 0.5);
  // rear window: you see the lit fog through it
  const win = c => { c.moveTo(X(-0.70), Y(0.99)); c.lineTo(X(-0.54), Y(1.36)); c.lineTo(X(0.54), Y(1.36)); c.lineTo(X(0.70), Y(0.99)); c.closePath(); };
  grainFill(ctx, win, lin(ctx, 0, Y(1.36), 0, Y(0.99), [[0, mix(pal.fog, pal.beam, 0.25 * lamps)], [1, mix(pal.fog, pal.beam, 0.75 * lamps)]]), 0.3);
  // two headrests in silhouette and the driver's shoulders
  ctx.fillStyle = 'rgba(6,6,18,0.85)';
  // the driver: head, neck and shoulders seen through the glass (left seat), leaning a touch with the road
  const lean = Math.sin(t * 0.7) * 0.012 * k;
  ctx.beginPath(); ctx.moveTo(X(-0.66), Y(0.99)); ctx.bezierCurveTo(X(-0.64), Y(1.08), X(-0.52), Y(1.11), X(-0.42), Y(1.12));
  ctx.lineTo(X(-0.40) + lean, Y(1.17)); ctx.bezierCurveTo(X(-0.47) + lean, Y(1.20), X(-0.47) + lean, Y(1.33), X(-0.33) + lean, Y(1.34));
  ctx.bezierCurveTo(X(-0.19) + lean, Y(1.33), X(-0.19) + lean, Y(1.20), X(-0.26) + lean, Y(1.17)); ctx.lineTo(X(-0.24), Y(1.12));
  ctx.bezierCurveTo(X(-0.14), Y(1.11), X(-0.04), Y(1.08), X(-0.02), Y(0.99)); ctx.closePath(); ctx.fill();
  // trunk line and bumper
  ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = Math.max(1, 0.02 * k);
  ctx.beginPath(); ctx.moveTo(X(-0.86), Y(0.70)); ctx.lineTo(X(0.86), Y(0.70)); ctx.stroke();
  grainFill(ctx, c => L_rr(c, X(-0.94), Y(0.36), 1.88 * k, 0.16 * k, 0.05 * k), '#07060f', 0.3);
  // plate
  ctx.fillStyle = rgba('#d8d0c0', 0.35); L_rrFill(ctx, X(-0.2), Y(0.58), 0.4 * k, 0.12 * k, 0.02 * k);
  // tail lights: a warm band across the back
  for (const sx of [-1, 1]) {
    const tl0 = c => { c.moveTo(X(sx * 0.93), Y(0.88)); c.lineTo(X(sx * 0.50), Y(0.88)); c.lineTo(X(sx * 0.50), Y(0.78)); c.lineTo(X(sx * 0.94), Y(0.76)); c.closePath(); };
    grainFill(ctx, tl0, lin(ctx, X(sx * 0.5), 0, X(sx * 0.94), 0, [[0, mix(pal.tail, '#ffd9a0', 0.2 * brake, 0.85)], [1, '#ffcf8a']]), 0);
    light(ctx, X(sx * 0.74), Y(0.82), 0.7 * k, pal.tail, 0.45 * tl);
    light(ctx, X(sx * 0.74), Y(0.82), 0.25 * k, '#ffd9a0', 0.35 * tl);
  }
  ctx.fillStyle = rgba(pal.tail, 0.5 + 0.4 * brake); ctx.fillRect(X(-0.5), Y(0.84), 1.0 * k, 0.025 * k);
  if (brake > 0) { ctx.fillStyle = rgba('#ff8a5a', brake); ctx.fillRect(X(-0.2), Y(1.42), 0.4 * k, 0.03 * k); light(ctx, X(0), Y(1.42), 0.6 * k, pal.tail, 0.4 * brake); }
}
function L_rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function L_rrFill(ctx, x, y, w, h, r) { ctx.beginPath(); L_rr(ctx, x, y, w, h, r); ctx.fill(); }

// speed profile for this scene: steady, then easing off on "outrun your headlights"
const V0 = 24, V1 = 11, TV = [230.6, 231.9];
const vel = t => lerp(V0, V1, sm((t - TV[0]) / (TV[1] - TV[0])));
function dist(t) { const n = 120, a = T0; let s = 0; const h = (t - a) / n; for (let i = 0; i < n; i++) s += vel(a + (i + 0.5) * h) * h; return s; }

function draw(ctx, t) {
  const z = lerp(1.0, 1.06, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 0.9, 13) * 8, dy = drift(t, 0.9, 14) * 5;
  const v = vel(t), shake = (v / V0);
  ctx.save(); ctx.translate(W / 2, H * 0.6); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H * 0.6 + dy + Math.sin(t * 13) * 0.8 * shake);
  // the car drifts a touch closer when it eases off (it drops back toward us as it slows)
  const carZ = lerp(6.8, 6.2, sm((t - TV[0]) / (TV[1] - TV[0] + 0.6)));
  road(ctx, t, { v, s: dist(t), carZ, carX: 1.6, camX: 1.0 + drift(t, 0.5, 3) * 0.05, pal: 'night', fog: 42, reach: 30, bounce: 0.6 + 0.4 * shake, brake: 0.6 * Math.sin(Math.PI * clamp((t - TV[0]) / 0.9)) });
  ctx.restore();
  L.label(ctx, t, 223.74, T1 + 1, 'The fog rule', null, 110, 110, { color: C.amber });
}

module.exports = { T0, T1, draw, road, PALS, mix, mixHex, F };
