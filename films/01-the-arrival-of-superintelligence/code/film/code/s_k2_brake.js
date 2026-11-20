// "And the brakes still work."  /  "Hold on to that."
// Close on the airliner's big wheel, spinning fast (blurred hub). In front, a heavy brake lever with a cable
// running to the brake on the wheel. On "brakes" an amber hand pulls the lever back: the cable snaps taut,
// the brake ring glows, sparks fly and settle, and the wheel slows to a stop. Then the hand stays on the
// lever while the camera slowly pulls back and the sky behind begins to warm. Calm hold.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, clamp } = L;
const { grainFill, roundRect, poly, cap, cached, motes } = require('./s_k2_studio');

const T0 = 140.65, T1 = 144.96;
const T_PULL = 140.98, T_STOP = 142.3, T_HOLD = 142.88;
const WL = { x: 1290, y: 520, r: 330 };
const PIV = [540, 960], LEN = 560;
const A_FWD = 0.42, A_BACK = -0.32;
const CAL = (() => { const a = Math.PI * 1.08, rr = WL.r * 0.6; return [WL.x + Math.cos(a) * rr, WL.y + Math.sin(a) * rr]; })();

const pullK = t => ease(ramp(t, T_PULL, T_PULL + 0.42));
// wheel angle: fast spin, braking from T_PULL + 0.15 to a stop at T_STOP (integrated closed form)
const W0 = 9.0;
function wheelAng(t) {
  const tb = T_PULL + 0.15, D = T_STOP - tb;
  if (t < tb) return W0 * (t - T0);
  const u = Math.min(t, T_STOP) - tb;
  return W0 * (tb - T0) + W0 * (u - u * u / (2 * D));                 // omega falls linearly to zero
}
const omega = t => t < T_PULL + 0.15 ? W0 : Math.max(0, W0 * (1 - (t - T_PULL - 0.15) / (T_STOP - T_PULL - 0.15)));

const SPARKS = (() => { const r = rng(4141); return Array.from({ length: 70 }, () => ({ tb: T_PULL + 0.2 + r() * 0.75, vx: -260 - r() * 520, vy: -380 + r() * 420, life: 0.35 + r() * 0.5, s: 1 + r() * 2 })); })();

function bgArt(c) {
  grainFill(c, k => k.rect(-300, -300, W + 600, 1100), lin(c, 0, -300, 0, 800, [[0, '#05061a'], [0.55, '#121236'], [0.85, '#3a2a5e'], [1, '#7a4a62']]), 0.5);
  const r = rng(91); for (let i = 0; i < 40; i++) { c.fillStyle = rgba(r() < 0.6 ? C.amber : C.cyan, 0.5); c.fillRect(-300 + r() * (W + 600), 770 + r() * 20, 3, 3); }
  grainFill(c, k => k.rect(-300, 790, W + 600, 700), lin(c, 0, 790, 0, 1300, [[0, '#2a2250'], [0.3, '#16143a'], [1, '#07071a']]), 0.55);
  c.fillStyle = 'rgba(255,210,150,0.3)'; for (let x = -300; x < W + 300; x += 300) c.fillRect(x, 1010, 170, 6);
  // the belly and strut above the wheel
  grainFill(c, k => { k.moveTo(-300, -300); k.lineTo(W + 300, -300); k.lineTo(W + 300, 40); k.bezierCurveTo(1400, 90, 600, 100, -300, 60); k.closePath(); }, lin(c, 0, -300, 0, 100, [[0, '#0a0a24'], [1, '#26245a']]), 0.55);
  grainFill(c, k => k.rect(1270, 40, 40, 300), lin(c, 1270, 0, 1310, 0, [[0, '#4a4a88'], [1, '#14143a']]), 0.4);
}
function tyreArt(c) {
  const { x, y, r } = WL;
  grainFill(c, k => k.arc(x, y, r, 0, Math.PI * 2), rad(c, x - 80, y - 90, 30, r, [[0, '#2c2a52'], [1, '#08081a']]), 0.55);
  c.strokeStyle = 'rgba(80,76,140,0.35)'; c.lineWidth = 4; for (const rr of [r - 22, r - 48]) { c.beginPath(); c.arc(x, y, rr, 0, Math.PI * 2); c.stroke(); }
  // brake ring (rotor stack) between tyre and hub
  grainFill(c, k => { k.arc(x, y, r * 0.7, 0, Math.PI * 2); k.arc(x, y, r * 0.5, 0, Math.PI * 2, true); }, lin(c, x - r, y - r, x + r, y + r, [[0, '#4a4878'], [1, '#1a1838']]), 0.5);
}

function draw(ctx, t) {
  const pull = pullK(t), hold = ease(ramp(t, T_HOLD - 0.3, T1));
  const z = lerp(lerp(1.06, 1.0, sm((t - T0) / (T_HOLD - T0))), 0.86, hold);
  const shake = Math.sin(t * 60) * 3 * ramp(t, T_PULL + 0.1, T_PULL + 0.25) * (1 - ramp(t, T_PULL + 0.4, T_PULL + 1.0));
  const dx = drift(t, 1, 17) * 6 + shake, dy = drift(t, 1, 18) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H * 0.55); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H * 0.55 + dy * par); fn(); ctx.restore(); };
  const glow = ramp(t, T_PULL + 0.1, T_PULL + 0.45) * (1 - ramp(t, T_STOP - 0.3, T_STOP + 1.4));

  layer(0.4, () => {
    cached(ctx, 'k2bbg', -300, -300, W + 300, H + 250, bgArt, 1);
    // dawn: the horizon warms during the hold
    light(ctx, 960, 790, 1100, '#ff9a5a', 0.06 + 0.16 * hold);
  });
  layer(0.8, () => {
    cached(ctx, 'k2tyre', WL.x - WL.r - 4, WL.y - WL.r - 4, WL.x + WL.r + 4, WL.y + WL.r + 4, tyreArt, 1);
    // hot brake ring
    if (glow > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const [w, al] of [[WL.r * 0.2, 0.22], [WL.r * 0.1, 0.25], [6, 0.6]]) { ctx.strokeStyle = rgba('#ff9a4a', al * glow); ctx.lineWidth = w; ctx.beginPath(); ctx.arc(WL.x, WL.y, WL.r * 0.6, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore();
      light(ctx, CAL[0], CAL[1], 260, C.amber, 0.6 * glow);
    }
    // hub: bolts and spokes, smeared into arcs while it spins fast
    const a = wheelAng(t), om = omega(t), smear = Math.min(1.2, om * 0.06);
    grainFill(ctx, c => c.arc(WL.x, WL.y, WL.r * 0.5, 0, Math.PI * 2), lin(ctx, WL.x - 120, WL.y - 120, WL.x + 120, WL.y + 120, [[0, '#7a78b0'], [1, '#26245a']]), 0.45);
    ctx.lineCap = 'round';
    for (let i = 0; i < 10; i++) {
      const b = a + i / 10 * Math.PI * 2, rr = WL.r * 0.34;
      if (smear > 0.05) { ctx.strokeStyle = rgba('#0c0c22', 0.55); ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(WL.x, WL.y, rr, b - smear, b); ctx.stroke(); }
      ctx.fillStyle = '#0c0c22'; ctx.beginPath(); ctx.arc(WL.x + Math.cos(b) * rr, WL.y + Math.sin(b) * rr, 9, 0, Math.PI * 2); ctx.fill();
    }
    // a white index stripe on the tyre wall makes the spin readable
    { const b = a * 1.0 + 0.6; ctx.strokeStyle = rgba(C.cream, 0.7); ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(WL.x, WL.y, WL.r * 0.84, b - 0.12 - smear * 0.8, b + 0.12); ctx.stroke(); }
    grainFill(ctx, c => c.arc(WL.x, WL.y, WL.r * 0.13, 0, Math.PI * 2), '#3a3870', 0.3);
    light(ctx, WL.x - 60, WL.y - 70, 260, C.cyanD, 0.12);
    // the caliper clamps the ring
    ctx.save(); ctx.translate(CAL[0], CAL[1]); ctx.rotate(Math.PI * 0.08);
    const cl = 6 * (1 - pull);
    grainFill(ctx, c => roundRect(c, -58 - cl, -40, 40, 80, 8), lin(ctx, -60, -40, -20, 40, [[0, '#6a68a8'], [1, '#22204a']]), 0.4);
    grainFill(ctx, c => roundRect(c, 18 + cl, -40, 40, 80, 8), lin(ctx, 20, -40, 60, 40, [[0, '#6a68a8'], [1, '#22204a']]), 0.4);
    grainFill(ctx, c => roundRect(c, -58, -52, 116, 20, 8), '#2e2c62', 0.4);
    ctx.restore();
    // sparks from the caliper, settling under gravity
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    for (const s of SPARKS) {
      const u = t - s.tb; if (u < 0 || u > s.life) continue;
      const x = CAL[0] + s.vx * u, y = CAL[1] + s.vy * u + 900 * u * u, x2 = x - s.vx * 0.025, y2 = y - (s.vy + 1800 * u) * 0.025, f = 1 - u / s.life;
      ctx.strokeStyle = rgba('#ffd28a', 0.9 * f); ctx.lineWidth = s.s; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    }
    ctx.restore();
  });

  // the lever, cable and hand, closest to camera
  layer(1.25, () => {
    const ang = lerp(A_FWD, A_BACK, pull) + 0.01 * Math.sin(t * 1.6) * ramp(t, T_STOP, T_STOP + 0.5);
    const kx = PIV[0] + Math.sin(ang) * LEN, ky = PIV[1] - Math.cos(ang) * LEN;
    const cx = PIV[0] + Math.sin(ang) * 140, cy = PIV[1] - Math.cos(ang) * 140;
    // cable: slack before, taut after the pull
    const sag = lerp(120, 8, pull);
    ctx.strokeStyle = '#05050f'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo((cx + CAL[0]) / 2, Math.max(cy, CAL[1]) + sag, CAL[0] - 60, CAL[1] + 6); ctx.stroke();
    ctx.strokeStyle = rgba(C.cyanW, 0.25 + 0.25 * pull); ctx.lineWidth = 2; ctx.stroke();
    // quadrant plate with notches
    grainFill(ctx, c => { c.moveTo(PIV[0], PIV[1]); c.arc(PIV[0], PIV[1], 300, -Math.PI / 2 - 0.55, -Math.PI / 2 + 0.6); c.closePath(); }, lin(ctx, PIV[0] - 300, PIV[1] - 300, PIV[0] + 300, PIV[1], [[0, '#2a2858'], [1, '#0e0e28']]), 0.5);
    ctx.fillStyle = '#07071a'; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 - 0.5 + i * 0.11; ctx.save(); ctx.translate(PIV[0] + Math.cos(a) * 292, PIV[1] + Math.sin(a) * 292); ctx.rotate(a); ctx.fillRect(-10, -5, 20, 10); ctx.restore(); }
    ctx.strokeStyle = rgba(C.amber, 0.25); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(PIV[0], PIV[1], 300, -Math.PI / 2 - 0.55, -Math.PI / 2 + 0.6); ctx.stroke();
    // lever arm
    grainFill(ctx, c => cap(c, PIV[0], PIV[1], kx, ky, 26, 18), lin(ctx, PIV[0] - 30, 0, PIV[0] + 30, 0, [[0, '#6a68a8'], [0.5, '#3a3876'], [1, '#18163e']]), 0.45);
    ctx.save(); ctx.strokeStyle = rgba(C.cyanW, 0.3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(PIV[0] - 20 * Math.cos(ang), PIV[1] - 20 * Math.sin(ang)); ctx.lineTo(kx - 14 * Math.cos(ang), ky - 14 * Math.sin(ang)); ctx.stroke(); ctx.restore();
    grainFill(ctx, c => c.arc(PIV[0], PIV[1], 48, 0, Math.PI * 2), '#22204e', 0.4);
    grainFill(ctx, c => c.arc(PIV[0], PIV[1], 16, 0, Math.PI * 2), '#4a4888', 0.3);
    // the grip: a rubber handle along the top of the lever with a ball end
    const reach = out(ramp(t, T0, T_PULL - 0.05));
    ctx.save(); ctx.translate(kx, ky); ctx.rotate(ang);
    grainFill(ctx, c => cap(c, 0, 40, 0, -96, 24, 24), lin(ctx, -24, 0, 24, 0, [[0, '#5a4a7a'], [0.4, '#2e2650'], [1, '#120e26']]), 0.4);
    grainFill(ctx, c => c.arc(0, -112, 30, 0, Math.PI * 2), rad(ctx, -10, -122, 4, 30, [[0, '#ffd08a'], [0.6, '#c9702e'], [1, '#6a3010']]), 0.35);
    ctx.restore();
    // the hand reaches in and closes round the grip, then stays
    const hx = kx + lerp(-240, 0, reach), hy = ky + lerp(220, 0, reach), close = ramp(t, T_PULL - 0.2, T_PULL + 0.05);
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang);
    // coat sleeve and cuff, coming in from the lower left
    const sx = -560, sy = 640 + 10 * Math.sin(t * 1.2);
    grainFill(ctx, c => { c.moveTo(sx - 90, sy + 60); c.bezierCurveTo(-300, 300, -170, 120, -96, 30); c.lineTo(-46, 74); c.bezierCurveTo(-120, 170, -240, 360, sx + 80, sy + 160); c.closePath(); },
      lin(ctx, -300, 200, -200, 330, [[0, '#ffb35c'], [0.5, '#c9702e'], [1, '#6a3010']]), 0.42);
    grainFill(ctx, c => { c.moveTo(-112, 18); c.lineTo(-40, 84); c.lineTo(-58, 104); c.lineTo(-130, 40); c.closePath(); }, '#7a3b17', 0.4);
    // back of the hand / palm, wrapping the grip from the left
    grainFill(ctx, c => { c.moveTo(-96, 40); c.bezierCurveTo(-100, -10, -70, -62, -26, -66); c.bezierCurveTo(4, -68, 18, -54, 20, -36); c.lineTo(22, 24); c.bezierCurveTo(10, 50, -20, 70, -50, 72); c.bezierCurveTo(-74, 72, -92, 60, -96, 40); c.closePath(); },
      lin(ctx, -100, -60, 20, 70, [[0, '#ffd29a'], [0.45, '#e0904a'], [1, '#9a4c1c']]), 0.35);
    // four fingers curled round the front of the grip
    for (let i = 0; i < 4; i++) { const fy = -52 + i * 21, fx = lerp(48, 30, close) + 0.6 * Math.sin(t * 2 + i);
      grainFill(ctx, c => cap(c, 4, fy, fx, fy + 4, 12, 10.5), lin(ctx, 0, fy - 10, fx, fy + 10, [[0, '#f0a25a'], [1, '#b0602a']]), 0.35); }
    ctx.strokeStyle = 'rgba(90,40,16,0.45)'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) { const fy = -52 + i * 21; ctx.beginPath(); ctx.moveTo(18, fy - 9); ctx.lineTo(20, fy + 9); ctx.stroke(); }
    // thumb over the top of the fingers
    grainFill(ctx, c => cap(c, -40, -58, 6, -70, 15, 11), lin(ctx, -40, -70, 6, -56, [[0, '#ffc488'], [1, '#c36a2b']]), 0.35);
    ctx.restore();
    light(ctx, hx - 20, hy - 30, 160, C.amber, 0.12 + 0.1 * glow);
  });
  layer(0.6, () => motes(ctx, t, MOTES, 0, 0, W, 900, '#ffe2b8', 0.22));
}
const MOTES = (() => { const r = rng(1717); return Array.from({ length: 34 }, () => [r(), r(), r()]); })();

module.exports = { T0, T1, draw };
