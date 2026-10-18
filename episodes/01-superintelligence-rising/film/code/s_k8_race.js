// "And the hardest one: will the others slow down too? That's the trap in his race ending.
//  Nobody wants to slow down alone, because the others just catch up."
// Night track. Four runners race toward a cold cyan glow; the one in front glances back at the pack.
// On "slow down alone" he eases off, and the others close the gap and draw level on "catch up"; he speeds up again.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out } = L;

const T0 = 490.70, T1 = 502.30;

// ---------------------------------------------------------------- helpers
let PAT = null;
function gf(ctx, pathFn, fill, grain = 0.45, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat');
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-300, -300, W + 600, H + 600);
  }
  ctx.restore();
}
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn, S = 1) {
  if (!CACHE[key]) { const cv = L.createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}
function cap(c, x0, y0, x1, y1, r0, r1) {
  const a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2;
  c.moveTo(x0 + Math.cos(n) * r0, y0 + Math.sin(n) * r0); c.lineTo(x1 + Math.cos(n) * r1, y1 + Math.sin(n) * r1);
  c.arc(x1, y1, r1, n, n - Math.PI, true); c.lineTo(x0 - Math.cos(n) * r0, y0 - Math.sin(n) * r0); c.arc(x0, y0, r0, n + Math.PI, n, true); c.closePath();
}

function mix(a, b, k) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), f = s => Math.round(lerp((A >> s) & 255, (B >> s) & 255, k)); return '#' + ((1 << 24) + (f(16) << 16) + (f(8) << 8) + f(0)).toString(16).slice(1); }

// ---------------------------------------------------------------- runner rig (side view, facing +x)
// g: gait, 1 = full run, 0 = walk. p: leg phase. gl: head glance (0 profile, +1 toward camera, -1 away).
const TH = 88, SH = 86, UA = 58, FA = 54, TOR = 128;
function legPose(p, g) {
  const amp = lerp(0.40, 0.66, g);
  const th = amp * Math.sin(p);
  const knee = lerp(0.08, 0.22, g) + lerp(1.0, 1.85, g) * Math.pow(Math.max(0, Math.cos(p + lerp(0.45, 0.2, g))), 2);
  const kx = Math.sin(th) * TH, ky = Math.cos(th) * TH;
  const ph = th - knee, ax = kx + Math.sin(ph) * SH, ay = ky + Math.cos(ph) * SH;
  const fa = clamp(-ph * 0.6 - 0.05, -0.6, 0.9);
  return { kx, ky, ax, ay, fa };
}
const KITS = [
  { shirt: ['#ffc27c', '#c96f30'], shorts: ['#4a2210', '#2a1208'], skin: ['#e0904a', '#8a451c'], shoe: '#f3efe2', hair: 'pony', hairC: '#3a1a0c', long: false },
  { shirt: ['#e8964e', '#9a4a22'], shorts: ['#2e1a3c', '#170c22'], skin: ['#c9702e', '#6a3214'], shoe: '#d8c8a8', hair: 'short', hairC: '#24100a', long: true },
  { shirt: ['#f0a25a', '#a85424'], shorts: ['#5a2a12', '#2e1408'], skin: ['#d27a34', '#7a3b17'], shoe: '#e9dcc0', hair: 'bun', hairC: '#1c0a05', long: false },
  { shirt: ['#ffb35c', '#b8622a'], shorts: ['#3a1a0c', '#1c0c06'], skin: ['#e8964e', '#8a451c'], shoe: '#f3efe2', hair: 'curly', hairC: '#2a1208', long: false },
];
// draws one runner with hips at local (0,0) relative to ground y=0
function runner(ctx, t, p, g, gl, kit, rim, rimA) {
  const A = legPose(p, g), B = legPose(p + Math.PI, g);
  const lift = g * 10 * Math.abs(Math.sin(p));
  const hipY = -Math.max(A.ay, B.ay) - 12 - lift;
  const lean = lerp(0.05, 0.17, g) + 0.015 * Math.sin(2 * p);
  const sx = Math.sin(lean) * TOR, sy = hipY - Math.cos(lean) * TOR;
  const armAmp = lerp(0.32, 0.8, g), bend = lerp(0.3, 1.5, g);
  const box = [-260, hipY - 260, 520, 460];
  const G = rim ? 0 : 1, R = rim ? rgba(rim, rimA) : null;
  const col = (a, b, y0 = sy, y1 = 0) => R || lin(ctx, 0, y0, 0, y1, [[0, a], [1, b]]);
  const leg = (P, near) => {
    const kx = P.kx, ky = hipY + P.ky, ax = P.ax, ay = hipY + P.ay;
    const sk = near ? col(kit.skin[0], kit.skin[1], hipY, 0) : col(kit.skin[1], '#3a1a0c', hipY, 0);
    gf(ctx, c => { cap(c, 0, hipY, kx, ky, 18, 13.5); cap(c, kx, ky, ax, ay, 13.5, 8.5); }, sk, 0.4 * G, box);
    // shorts over the upper thigh (or long tights)
    const f = kit.long ? 1 : 0.55, mx = lerp(0, kx, f), my = lerp(hipY, ky, f);
    gf(ctx, c => { cap(c, 0, hipY - 4, mx, my, 21, kit.long ? 14.5 : 18.5); if (kit.long) cap(c, kx, ky, lerp(kx, ax, 0.85), lerp(ky, ay, 0.85), 14.5, 9.5); }, near ? col(kit.shorts[0], kit.shorts[1], hipY - 20, ay) : col(kit.shorts[1], '#0c0608', hipY - 20, ay), 0.45 * G, box);
    // shoe
    gf(ctx, c => { c.save(); c.translate(ax, ay); c.rotate(P.fa); c.moveTo(-12, -9); c.lineTo(20, -7); c.quadraticCurveTo(36, -3, 33, 9); c.lineTo(-14, 9); c.closePath(); c.restore(); }, R || (near ? kit.shoe : '#8a7c66'), 0.25 * G, box);
    if (!rim) { ctx.save(); ctx.translate(ax, ay); ctx.rotate(P.fa); ctx.fillStyle = rgba('#7a3b17', 0.8); ctx.fillRect(-14, 5, 48, 4); ctx.restore(); }
  };
  const arm = (ph, near) => {
    const a = -armAmp * Math.sin(ph) + 0.15 * g, ex = sx + Math.sin(a) * UA, ey = sy + 10 + Math.cos(a) * UA;
    const b = a + bend + 0.18 * g * Math.cos(ph), hx = ex + Math.sin(b) * FA, hy = ey + Math.cos(b) * FA;
    const sk = near ? col(kit.skin[0], kit.skin[1]) : col(kit.skin[1], '#3a1a0c');
    gf(ctx, c => { cap(c, sx, sy + 10, ex, ey, 13, 10.5); cap(c, ex, ey, hx, hy, 10.5, 8); c.ellipse(hx + Math.sin(b) * 5, hy + Math.cos(b) * 5, 9, 8, -b, 0, 7); }, sk, 0.4 * G, box);
    // sleeve
    gf(ctx, c => cap(c, sx, sy + 8, lerp(sx, ex, 0.5), lerp(sy + 10, ey, 0.5), 16, 13.5), near ? col(kit.shirt[0], kit.shirt[1]) : col(kit.shirt[1], '#5a2a12'), 0.4 * G, box);
  };
  arm(p, false);          // far arm swings with the near leg
  leg(B, false);
  // ponytail behind everything near the head
  const hc = [sx + Math.sin(lean) * 34 + 6, sy - 38];
  if (kit.hair === 'pony') {
    const sw = Math.sin(2 * p + 1.2) * 0.35 * g + 0.1 * Math.sin(t * 2), a0 = -0.35 - g * 0.5 + sw;
    const bx = hc[0] - 18, by = hc[1] - 10;
    gf(ctx, c => { c.moveTo(bx + 4, by - 12); c.quadraticCurveTo(bx - 30, by - 8 - g * 6, bx - 44 - g * 10, by + 34 + a0 * 22); c.quadraticCurveTo(bx - 14, by + 18, bx + 4, by + 12); c.closePath(); }, R || kit.hairC, 0.3 * G, box);
  }
  // torso: shirt, chest forward, a fold at the back
  gf(ctx, c => {
    c.moveTo(-22, hipY + 8);
    c.bezierCurveTo(-28, hipY - 50, -32 + sx * 0.5, sy + 60, -24 + sx, sy + 10);
    c.bezierCurveTo(-18 + sx, sy - 6, -4 + sx, sy - 10, 8 + sx, sy - 10);
    c.bezierCurveTo(24 + sx, sy - 6, 30 + sx, sy + 22, 28 + sx, sy + 52);
    c.bezierCurveTo(26 + sx * 0.5, sy + 92, 24, hipY - 30, 24, hipY + 8); c.closePath();
  }, col(kit.shirt[0], kit.shirt[1]), 0.42 * G, box);
  if (!rim) { ctx.strokeStyle = rgba('#5a2a12', 0.45); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx - 14, sy + 8); ctx.quadraticCurveTo(sx * 0.4 - 20, sy + 70, -16, hipY - 8); ctx.stroke(); }
  gf(ctx, c => c.ellipse(2, hipY - 4, 27, 22, 0, 0, 7), col(kit.shorts[0], kit.shorts[1], hipY - 20, hipY + 20), 0.45 * G, box);
  leg(A, true);
  // head and neck; the hair mass moves as the head turns
  gf(ctx, c => cap(c, sx + 2, sy - 2, hc[0] - 3, hc[1] + 10, 9, 8.5), R || kit.skin[1], 0, box);
  const hr = 23;
  const head = c => c.ellipse(hc[0], hc[1], hr * 0.94, hr * 1.1, lean * 0.5, 0, 7);
  gf(ctx, head, R || lin(ctx, hc[0] + 20, hc[1] - 20, hc[0] - 20, hc[1] + 20, [[0, kit.skin[0]], [1, kit.skin[1]]]), 0.3 * G, box);
  if (!rim) {
    const pr = [-0.55, -0.28], fr = [0.0, -0.66], aw = [0.0, 0.05];
    const k = gl >= 0 ? gl : -gl, tgt = gl >= 0 ? fr : aw;
    const ox = lerp(pr[0], tgt[0], k) * hr, oy = lerp(pr[1], tgt[1], k) * hr;
    ctx.save(); ctx.beginPath(); ctx.ellipse(hc[0], hc[1], hr * 1.0, hr * 1.16, lean * 0.5, 0, 7); ctx.clip();
    const hairR = kit.hair === 'curly' ? 1.1 : 1.0;
    gf(ctx, c => c.ellipse(hc[0] + ox, hc[1] + oy, hr * 1.02 * hairR, hr * 1.02 * hairR, 0, 0, 7), kit.hairC, 0.35, box);
    ctx.restore();
    if (kit.hair === 'curly') for (let i = 0; i < 7; i++) { const a = -2.9 + i * 0.42 + gl * 0.6; gf(ctx, c => c.arc(hc[0] + ox * 0.3 + Math.cos(a) * hr * 0.95, hc[1] + oy * 0.4 + Math.sin(a) * hr * 1.0, 8, 0, 7), kit.hairC, 0, box); }
    if (kit.hair === 'bun') gf(ctx, c => c.arc(hc[0] + ox * 1.2 - 4, hc[1] - hr * 0.9, 11, 0, 7), kit.hairC, 0.3, box);
    // ear, slides with the turn
    if (gl > -0.6) gf(ctx, c => c.ellipse(hc[0] + ox * 0.1 - 4 + (gl > 0 ? -gl * 12 : 0), hc[1] + 2, 4.5, 7.5, 0, 0, 7), kit.skin[1], 0, box);
    // the far side of the face in shade
    ctx.save(); ctx.beginPath(); head(ctx); ctx.clip();
    ctx.fillStyle = rgba('#3a1608', 0.18); ctx.beginPath(); ctx.ellipse(hc[0] + 10 - gl * 10, hc[1] + 8, hr * 0.6, hr, 0, 0, 7); ctx.fill(); ctx.restore();
  } else {
    gf(ctx, c => c.ellipse(hc[0] - 6, hc[1] - 8, hr, hr, 0, 0, 7), R, 0, box);
  }
  arm(p + Math.PI, true);
}

// ---------------------------------------------------------------- the stadium
const TILE = 2600;
function standsArt(c) {
  const r = rng(61);
  // roof and tiers
  gf(c, cc => cc.rect(0, 120, TILE, 60), lin(c, 0, 120, 0, 180, [[0, '#0b0b24'], [1, '#121232']]), 0.5);
  for (let i = 0; i < 6; i++) {
    const y = 190 + i * 52;
    gf(c, cc => cc.rect(0, y, TILE, 50), lin(c, 0, y, 0, y + 50, [[0, i % 2 ? '#151538' : '#18183e'], [1, '#0e0e2a']]), 0.55);
    // crowd heads: dark bumps, a few phone lights
    for (let x = 6; x < TILE; x += 13 + r() * 9) {
      if (r() < 0.12) continue;
      c.fillStyle = r() < 0.5 ? '#0a0a20' : '#0d0c26'; c.beginPath(); c.ellipse(x, y + 26 - r() * 6, 6, 8, 0, 0, 7); c.fill(); c.fillRect(x - 8, y + 30, 16, 20);
      if (r() < 0.035) { c.fillStyle = rgba(r() < 0.5 ? '#ffb35c' : '#d8f7ff', 0.5 + r() * 0.4); c.fillRect(x - 2, y + 18, 4, 5); }
    }
  }
  // barrier wall in front of the stands
  gf(c, cc => cc.rect(0, 500, TILE, 52), lin(c, 0, 500, 0, 552, [[0, '#24204e'], [1, '#141236']]), 0.5);
  c.fillStyle = 'rgba(164,159,196,0.22)'; c.fillRect(0, 500, TILE, 3);
  for (let x = 40; x < TILE; x += 340) { c.fillStyle = 'rgba(143,230,255,0.10)'; c.fillRect(x, 512, 220, 26); }
  // floodlight masts
  for (const mx of [500, 1800]) {
    gf(c, cc => { cc.moveTo(mx - 10, 500); cc.lineTo(mx - 4, 40); cc.lineTo(mx + 4, 40); cc.lineTo(mx + 10, 500); cc.closePath(); }, '#0a0a20', 0.3);
    gf(c, cc => cc.rect(mx - 60, 6, 120, 44), '#0d0d26', 0.3);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { c.fillStyle = '#e8f4ff'; c.fillRect(mx - 52 + i * 27, 12 + j * 20, 20, 13); }
  }
}
const MASTS = [500, 1800];

// lanes: feet y, scale (far to near)
const LANES = [{ y: 636, s: 0.74 }, { y: 716, s: 0.9 }, { y: 810, s: 1.08 }, { y: 922, s: 1.3 }];
const LINES = [598, 664, 748, 848, 980];
function trackArt(c) {
  gf(c, cc => cc.rect(-50, 552, W + 100, 600), lin(c, 0, 552, 0, H, [[0, '#2a2052'], [0.4, '#21194a'], [1, '#100c28']]), 0.55);
  c.fillStyle = 'rgba(8,6,24,0.35)'; c.fillRect(-50, 552, W + 100, 46);   // infield edge
}

// integrate gait schedules: returns { p, d } for each runner at time t (deterministic, from the scene start)
const vOf = g => lerp(250, 720, g), fOf = g => lerp(0.95, 1.42, g);
function integrate(sched, tStart, t, cache) {
  const dt = 1 / 240;
  if (!cache.st || cache.t > t) { cache.st = sched.map(() => ({ p: 0, d: 0 })); cache.t = tStart; }
  while (cache.t < t - 1e-9) {
    const h = Math.min(dt, t - cache.t), tm = cache.t + h / 2;
    sched.forEach((s, i) => { const g = s.g(tm); cache.st[i].p += 2 * Math.PI * fOf(g) * h; cache.st[i].d += vOf(g) * h; });
    cache.t += h;
  }
  return cache.st;
}

// a full scene: cfg = { T0, T1, runners: [{lane, x0, g(t), gl(t), kit, ph}], cam(t) speed factor, warm(t), pulse(t) }
function scene(ctx, t, cfg) {
  const st = integrate(cfg.runners, cfg.T0, t, cfg.cache);
  const camS = integrate([{ g: cfg.camG }], cfg.T0, t, cfg.camCache)[0];
  const Dc = camS.d;
  const k = (t - cfg.T0) / (cfg.T1 - cfg.T0);
  const z = lerp(1.14, (cfg.zoom ?? 1.06) + 0.14, sm(k)), dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 5) * 4;
  const warm = cfg.warm ? cfg.warm(t) : 0, pulse = cfg.pulse ? cfg.pulse(t) : 0;
  const glowC = mix(C.cyan, '#ffb35c', warm);
  const breathe = 0.93 + 0.07 * Math.sin(t * 1.3);
  ctx.save(); ctx.translate(W / 2, H * 0.72); ctx.scale(z, z); ctx.translate(-W / 2 + dx, -H * 0.72 + dy);
  // night sky
  gf(ctx, c => c.rect(-60, -60, W + 120, 640), lin(ctx, 0, 0, 0, 560, [[0, '#070820'], [0.7, '#161540'], [1, '#2a2058']]), 0.55, [-60, -60, W + 120, 640]);
  // the glow ahead (where the race goes): cyan, warming toward dawn in the second scene
  // stands scroll slowly
  const so = ((Dc * 0.22) % TILE + TILE) % TILE;
  for (const ox of [-so, TILE - so]) { if (ox > W + 100) continue; ctx.save(); ctx.translate(ox, 0); cached(ctx, 'stands', 0, 0, TILE, 560, standsArt); ctx.restore(); }
  // floodlights
  for (const ox of [-so, TILE - so]) for (const m of MASTS) { const x = m + ox; if (x < -300 || x > W + 300) continue; light(ctx, x, 28, 340, '#d8f7ff', 0.20 * breathe); light(ctx, x, 28, 70, '#ffffff', 0.45); }
  // haze between stands and track
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, 380, 0, 600, [[0, 'rgba(90,74,138,0)'], [0.7, 'rgba(90,74,138,0.20)'], [1, 'rgba(90,74,138,0)']]); ctx.fillRect(-60, 380, W + 120, 220); ctx.restore();
  cached(ctx, 'track', -50, 552, W + 50, 1130, trackArt);
  light(ctx, 1980, 520, 1150, C.cyan, (0.42 + 0.12 * pulse) * (1 - warm) * breathe);
  light(ctx, 1980, 520, 1150, '#ffb35c', 0.62 * warm * breathe);
  light(ctx, 1960, 500, 380, mix(C.cyanW, '#ffe2a8', warm), (0.22 + 0.15 * pulse) * breathe);
  // glow spilling along the track from the right
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 600, 0, W + 60, 0, [[0, rgba(glowC, 0)], [1, rgba(glowC, 0.20 * breathe)]]); ctx.fillRect(-60, 552, W + 120, 560);
  ctx.restore();
  // lane lines with a travelling pulse, and lane ticks that scroll with the camera
  LINES.forEach((y, i) => {
    const s = 0.5 + 0.5 * (y - 598) / 382;
    ctx.fillStyle = rgba('#e6e0f4', 0.34 + 0.1 * s); ctx.fillRect(-60, y - 1.2 * s, W + 120, 2.6 * s);
    if (pulse > 0) { const px = lerp(-400, W + 400, (t * 0.9 + i * 0.07) % 1); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, px - 300, 0, px + 300, 0, [[0, rgba(C.cyan, 0)], [0.5, rgba(C.cyanW, 0.75 * pulse)], [1, rgba(C.cyan, 0)]]); ctx.fillRect(px - 300, y - 3 * s, 600, 6 * s); ctx.restore(); }
    const sp = 360 * s, off = ((Dc * s) % sp + sp) % sp;
    ctx.fillStyle = rgba('#e6e0f4', 0.26);
    for (let x = -off; x < W + 60; x += sp) ctx.fillRect(x, y - 1, 6 * s + 2, 26 * s);
  });
  // runners, far lanes first
  const order = cfg.runners.map((r, i) => i).sort((a, b) => cfg.runners[a].lane - cfg.runners[b].lane);
  for (const i of order) {
    const r = cfg.runners[i], ln = LANES[r.lane], s = ln.s;
    const x = r.x0 + s * (st[i].d - Dc) + 14 * s * drift(t, 0.8, i * 3.1);
    const g = r.g(t), gl = r.gl ? r.gl(t) : 0, p = st[i].p + r.ph;
    ctx.save(); ctx.translate(x, ln.y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(4,4,16,0.45)'; ctx.beginPath(); ctx.ellipse(6, 4, 70, 9, 0, 0, 7); ctx.fill();
    ctx.save(); ctx.translate(4, -2); runner(ctx, t, p, g, gl, r.kit, glowC, 0.75); ctx.restore();
    runner(ctx, t, p, g, gl, r.kit, null);
    ctx.restore();
  }
  // warm light rises over the runners as they slow together
  if (warm > 0) { light(ctx, 1100, 760, 900, '#ffb35c', 0.12 * warm); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, 0, 0, 560, [[0, 'rgba(255,179,92,0)'], [1, rgba('#c9702e', 0.16 * warm)]]); ctx.fillRect(-60, 0, W + 120, 560); ctx.restore(); }
  ctx.restore();
}

// ---------------------------------------------------------------- this scene's choreography
const SLOW0 = 498.82, SLOW1 = 499.5, BACK0 = 501.55, BACK1 = 502.2;
const leaderG = t => 1 - 0.55 * ramp(t, SLOW0, SLOW1) + 0.55 * ramp(t, BACK0, BACK1);
const glance = (a, b) => t => sm((t - a) / 0.3) * (1 - sm((t - b) / 0.35));
const CFG = {
  T0, T1, cache: {}, camCache: {}, camG: () => 1, zoom: 1.05,
  pulse: t => ramp(t, 495.9, 496.4) * (1 - ramp(t, 497.4, 498.2)),
  runners: [
    { lane: 0, x0: 720, g: () => 1, gl: t => glance(493.3, 494.4)(t) * 0.9 + glance(500.3, 501.0)(t) * 0.8, kit: KITS[1], ph: 1.3 },
    { lane: 1, x0: 900, g: () => 1, gl: t => -glance(493.5, 494.5)(t) * 0.8 + glance(500.6, 501.4)(t) * 0.9, kit: KITS[2], ph: 3.9 },
    { lane: 2, x0: 760, g: () => 1, gl: t => glance(493.7, 494.6)(t) * 0.9 - glance(500.9, 501.6)(t) * 0.7, kit: KITS[3], ph: 0.4 },
    // the leader, nearest lane, well ahead until he eases off
    { lane: 3, x0: 1330, g: leaderG, gl: t => glance(493.45, 494.5)(t) + glance(500.4, 501.7)(t) * 0.9, kit: KITS[0], ph: 2.2 },
  ],
};

function draw(ctx, t) { scene(ctx, t, CFG); }

module.exports = { T0, T1, draw, scene, runner, KITS, LANES, mix };
