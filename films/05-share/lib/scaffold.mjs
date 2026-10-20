// The giant scaffold without walls in night fog, owner C2 (1.01b, 1.05, 1.06, 1.10a, 1.10b); also used by C5 (3.04, far view at dawn).
// The scaffold is built from pressed paper (1.05 macro: the beams are dense stacks of pages, edges like wood grain).
// Live 3D (pinhole camera, so a crane-up or a slow orbit has real parallax inside the lattice); fog, cones and the plain are cached layers.
//
// scaffold(ctx, t, o) draws the whole frame and returns anchors.
//   o: { view = 'far' | 'mid' | 'macro',
//        cam = { x: 0, y: 0, z: 1 }  (x, y: screen pan in px, z: zoom),
//        lights = 0..1 (work lamps), fog = 0..1, workers = 0..1 (tiny figures at the foot hauling a beam on ropes),
//        mood = 'night' | 'dawn' (dawn: pale first light behind, no lamp cones unless lights > 0),
//        topLight = 0..1 (the single lamp at the crown, e.g. C5's "Yet"), flick = { i, t0 } (lamp i flickers on at t0),
//        crane = 0 (extra camera height in metres: crane up), yaw (orbit, rad), dist (camera distance, m), pitch (rad),
//        hoist = 0..1 (the hauled beam rises to its slot; 1 = set down), glow = 0..1 (the scaffold fills from inside with warm light),
//        crowd = 0..1 (a huge crowd of tiny figures around the foot), sheets = 0..1 (every figure's sheet lights up, a wave from the centre),
//        back = 0..1 (amber back light behind the scaffold, 1.06), glide = 0 (macro: px the camera has travelled along the beam),
//        drawSky = true }
//   → { top: { x, y } (crown), base: { x, y } (foot centre), project(X, Y, Z) → [x, y, depth], lamps: [{ x, y, a, s }],
//       box: { x0, y0, x1, y1 } (screen bbox of the structure), outline(n) → [[x, y] …] (n points on the outline of the finished
//       building around the lattice: corner edges, floor lines, roof: targets for paperSwarm({ shape })),
//       beam: { x, y } (the hauled beam's centre), f (focal px) }
import { W, H, rgba, clamp, lin, mix, eout, eio, sm, prng, drift, canvas } from '../engine.mjs';
import { fog as artFog, cone as artCone, stipple, vnoise, fbm } from './art.mjs';

const CACHE = new Map(); const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, f()); return CACHE.get(k); };
const TAU = Math.PI * 2;

// ---------- the structure (metres): x along the long side, z along the short side, y up; origin = foot centre ----------
const BX = 6, BZ = 3, LV = 10, SX = 6.4, SZ = 6.4, SY = 4.6;
const PX = (i) => (i - BX / 2) * SX, PZ = (k) => (k - BZ / 2) * SZ;
function postTop(i, k) {   // unfinished crown: some posts stop short, a few stick up waiting for the next level
  const r = prng(31 + i * 7 + k * 13)(); if ((i === 0 || i === BX) && k === 0) return LV - 1;
  if (i >= 4 && k >= 2) return LV - 2 + (r < .5 ? 0 : 1); if (r < .18) return LV + 1; return LV;
}
function beams() {
  return once('beams', () => {
    const out = [], add = (a, b, kind, lv) => out.push({ a, b, kind, lv });
    for (let i = 0; i <= BX; i++) for (let k = 0; k <= BZ; k++) add([PX(i), 0, PZ(k)], [PX(i), postTop(i, k) * SY, PZ(k)], 'post', 0);
    for (let l = 1; l <= LV; l++) {
      for (let k = 0; k <= BZ; k++) for (let i = 0; i < BX; i++) if (postTop(i, k) >= l && postTop(i + 1, k) >= l && !(l === LV && (i + k) % 3 === 1)) add([PX(i), l * SY, PZ(k)], [PX(i + 1), l * SY, PZ(k)], 'gx', l);
      for (let i = 0; i <= BX; i++) for (let k = 0; k < BZ; k++) if (postTop(i, k) >= l && postTop(i, k + 1) >= l && !(l === LV && (i + k) % 2 === 0)) add([PX(i), l * SY, PZ(k)], [PX(i), l * SY, PZ(k + 1)], 'gz', l);
    }
    // braces in some bays of the outer faces (X faces and Z faces), alternating like a real scaffold
    for (let l = 0; l < LV - 1; l++) {
      for (const k of [0, BZ]) for (let i = 0; i < BX; i++) if ((i + l) % 3 === 0) add([PX(i), l * SY, PZ(k)], [PX(i + 1), (l + 1) * SY, PZ(k)], 'brace', l);
      for (const i of [0, BX]) for (let k = 0; k < BZ; k++) if ((k + l) % 2 === 0) add([PX(i), l * SY, PZ(k)], [PX(i), (l + 1) * SY, PZ(k + 1)], 'brace', l);
    }
    return out;
  });
}
// lamps on nodes: [x, y, z, aim (screen rad, 0 = down), spread]
const LAMPS = [[PX(1), 3 * SY, PZ(0), .35, .3], [PX(5), 5 * SY, PZ(0), -.45, .28], [PX(3), 7 * SY, PZ(0), .1, .26], [PX(0), 4 * SY, PZ(3), .6, .3], [PX(6), 2 * SY, PZ(1), -.7, .32], [PX(2), 9 * SY, PZ(1), .25, .24], [PX(4), 1 * SY, PZ(0), 0, .34]];
const CROWN = [PX(3), LV * SY + 1.6, PZ(1)];

// ---------- camera ----------
const VIEWS = { far: { yaw: -.62, dist: 108, height: 1.7, pitch: .2, f: 1100, cx: 1040, cy: 560 }, mid: { yaw: -.55, dist: 84, height: 2.2, pitch: .24, f: 1050, cx: 960, cy: 600 } };
function makeCam(view, o) {
  const V = { ...VIEWS[view] || VIEWS.far }; const cam = o.cam || {};
  const yaw = o.yaw ?? V.yaw, dist = o.dist ?? V.dist, height = V.height + (o.crane ?? 0), pitch = (o.pitch ?? V.pitch) - (o.crane ?? 0) * .0115, f = V.f * (cam.z ?? 1);
  const cx = V.cx - (cam.x ?? 0), cy = V.cy - (cam.y ?? 0), cyaw = Math.cos(yaw), syaw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const project = (X, Y, Z) => { const x = X * cyaw - Z * syaw, z = X * syaw + Z * cyaw + dist, y = Y - height, y2 = y * cp - z * sp, z2 = y * sp + z * cp; return [cx + f * x / z2, cy - f * y2 / z2, z2]; };
  return { project, f, yaw, dist, height, pitch, cx, cy, horizon: cy + f * Math.tan(pitch) };
}

// ---------- palettes ----------
const MOOD = {
  night: { top: '#090b22', mid: '#121433', hor: '#3b2a30', ground: '#0c0a12', ground2: '#16111a', fog: '#4f4a66', fogA: .26, warm: '#e9a54b', body: '#1c1418', hi: '#ffcf8a', farA: .55, stars: 1 },
  dawn: { top: '#1d2846', mid: '#4b5878', hor: '#f0c49c', ground: '#262635', ground2: '#3a3a4c', fog: '#c9cfe0', fogA: .3, warm: '#ffd9a8', body: '#1d1c2a', hi: '#ffe2b8', farA: .4, stars: 0 },
};
function sky(mood) {
  return once('sky-' + mood, () => {
    const M = MOOD[mood], [c, g] = canvas(W + 400, H + 300), hz = 690;
    const lg = g.createLinearGradient(0, 0, 0, hz + 150); lg.addColorStop(0, M.top); lg.addColorStop(.62, M.mid); lg.addColorStop(1, M.hor); g.fillStyle = lg; g.fillRect(0, 0, c.width, hz + 150);
    const wg = g.createRadialGradient(1100, hz + 100, 0, 1100, hz + 100, 1100); wg.addColorStop(0, rgba(M.warm, mood === 'dawn' ? .55 : .22)); wg.addColorStop(1, rgba(M.warm, 0)); g.fillStyle = wg; g.fillRect(0, 0, c.width, c.height);
    // the plain: dark, a few long furrows of mist-lit ground receding
    const gg = g.createLinearGradient(0, hz + 150, 0, c.height); gg.addColorStop(0, M.hor); gg.addColorStop(.08, mix3(M.hor, M.ground2, .6)); gg.addColorStop(.3, M.ground2); gg.addColorStop(1, M.ground); g.fillStyle = gg; g.fillRect(0, hz + 150, c.width, c.height - hz - 150);
    const hg = g.createLinearGradient(0, hz + 40, 0, hz + 300); hg.addColorStop(0, rgba(M.hor, 0)); hg.addColorStop(.45, rgba(M.hor, mood === 'dawn' ? .55 : .35)); hg.addColorStop(1, rgba(M.hor, 0)); g.fillStyle = hg; g.fillRect(0, hz + 40, c.width, 260);
    const r = prng(5); g.strokeStyle = rgba(M.warm, .05); g.lineWidth = 1;
    for (let i = 0; i < 26; i++) { const y = hz + 150 + Math.pow(i / 26, 1.8) * (c.height - hz - 150); g.globalAlpha = .4 + .6 * i / 26; g.beginPath(); g.moveTo(0, y + r() * 4); for (let x = 0; x <= c.width; x += 60) g.lineTo(x, y + Math.sin(x * .004 + i) * 2 + r() * 2); g.stroke(); }
    g.globalAlpha = 1;
    if (M.stars) { for (let i = 0; i < 220; i++) { const x = r() * c.width, y = Math.pow(r(), 1.5) * 560, m = r(); g.fillStyle = rgba('#e8e2ff', (.12 + .5 * m * m) * (1 - y / 620)); g.fillRect(x, y, m > .95 ? 2 : 1.2, m > .95 ? 2 : 1.2); } }
    stipple(c, { k: .35, g: 1, seed: 9, mid: false, boost: 1 });
    return c;
  });
}
function fogLayer(key, y0, y1, col, a, seed) { return once(key, () => { const [c, g] = canvas(W, H); artFog(g, { y0, y1, col, a, seed, sx: .0022, sy: .011, cover: .62, soft: .35, k: .55 }); return c; }); }
function coneSprite(spread) {
  return once('cone' + spread, () => { const [c, g] = canvas(1000, 1300); artCone(g, 500, 30, { dir: 0, spread, len: 1250, col: '#ffd08f', a: .5, k: .65, seed: 7, soft: .4 }); return c; });
}
function bloomSprite(col, R = 120) {
  return once('bloom' + col + R, () => { const [c, g] = canvas(R * 2, R * 2), rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, rgba('#fff4dc', 1)); rg.addColorStop(.08, rgba(col, .8)); rg.addColorStop(.3, rgba(col, .22)); rg.addColorStop(1, rgba(col, 0)); g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2); stipple(c, { k: .6, g: 1.2, seed: 3 }); return c; });
}
function backGlow(col) {
  return once('backglow' + col, () => { const [c, g] = canvas(1600, 1100), rg = g.createRadialGradient(800, 700, 0, 800, 700, 820); rg.addColorStop(0, rgba('#fff0d2', .85)); rg.addColorStop(.15, rgba(col, .5)); rg.addColorStop(.5, rgba(col, .14)); rg.addColorStop(1, rgba(col, 0)); g.fillStyle = rg; g.fillRect(0, 0, 1600, 1100); stipple(c, { k: .8, g: 1.2, seed: 12 }); return c; });
}

// tiny figure for crowds and the haulers (cheap: capsules, one fill colour + a warm rim)
function tiny(ctx, x, y, s, o = {}) {
  const lean = o.lean ?? 0, arm = o.arm ?? .3, col = o.col || '#120d12';
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(-3.2, -9, 2.2, 9.5, .04, 0, TAU); ctx.ellipse(3.2, -9, 2.2, 9.5, -.04, 0, TAU); ctx.fill();   // legs
  ctx.rotate(lean); ctx.beginPath(); ctx.ellipse(0, -26, 6.4, 10.5, 0, 0, TAU); ctx.fill();                                    // body, round shoulders
  ctx.beginPath(); ctx.arc(0, -41, 4.6, 0, TAU); ctx.fill();                                                                   // head
  ctx.save(); ctx.translate(4, -32); ctx.rotate(-arm); ctx.beginPath(); ctx.ellipse(0, 7, 2, 7.5, 0, 0, TAU); ctx.fill(); ctx.restore();   // front arm (forward)
  if (o.rim) { ctx.strokeStyle = o.rim; ctx.lineWidth = 1.1 / s * Math.max(1, s * .7); ctx.globalAlpha = o.rimA ?? .7; ctx.beginPath(); ctx.arc(0, -41, 4.6, -1.6, .2); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, -26, 6.4, 10.5, 0, -1.4, .3); ctx.stroke(); }
  ctx.restore();
}

// ---------- macro: along one beam of pressed pages (1.05) ----------
// The beam recedes from the near lower left to the far upper right (strong perspective = macro). Its side face is thousands of
// page edges (wavy like wood grain), now and then a page sticks out with a line of handwriting; the top face is the top page,
// lit by the work lamp. glide = metres the camera has travelled along the beam (the texture is a function of world position).
function quadH(p0, p1, p2, p3) {   // unit square → quad (projective): (0,0)=p0, (1,0)=p1, (1,1)=p2, (0,1)=p3
  const [x0, y0] = p0, [x1, y1] = p1, [x2, y2] = p2, [x3, y3] = p3, dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1, g = (dx3 * dy2 - dx2 * dy3) / den, h = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  return (u, v) => { const w = g * u + h * v + 1; return [(a * u + b * v + x0) / w, (d * u + e * v + y0) / w]; };
}
function macroBack() {
  return once('macroback', () => {
    const [c, g] = canvas(W + 600, H + 200), r = prng(41);
    const bg = g.createRadialGradient(500, 200, 0, 700, 400, 1600); bg.addColorStop(0, '#2a1c18'); bg.addColorStop(.5, '#16101a'); bg.addColorStop(1, '#0a0810'); g.fillStyle = bg; g.fillRect(0, 0, c.width, c.height);
    g.filter = 'blur(9px)';
    for (let i = 0; i < 7; i++) { const x = 120 + i * 360 + r() * 120; g.fillStyle = `rgba(10,7,10,${.5 + r() * .3})`; g.fillRect(x, -20, 26 + r() * 30, c.height + 40); g.fillRect(x - 200, 300 + r() * 500, 460, 18 + r() * 14); }
    for (let i = 0; i < 16; i++) { const x = r() * c.width, y = r() * c.height * .8, rr = 20 + r() * 70, a = .05 + r() * .12; const rg = g.createRadialGradient(x, y, 0, x, y, rr); rg.addColorStop(0, `rgba(255,190,120,${a})`); rg.addColorStop(.75, `rgba(255,170,100,${a * .8})`); rg.addColorStop(1, 'rgba(255,170,100,0)'); g.fillStyle = rg; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill(); }
    g.filter = 'none'; stipple(c, { k: .3, g: 1, seed: 4, mid: false, boost: 1 });
    return c;
  });
}
function macro(ctx, t, o) {
  const cam = o.cam || {}, glide = o.glide ?? 0, lit = o.lights ?? 1, cx = cam.x ?? 0, cy = cam.y ?? 0;
  ctx.drawImage(macroBack(), -300 - glide * 12 % 300 - cx * .3 + drift(t, 8, 1), -100 - cy * .3 + drift(t, 5, 2));
  // geometry: side face (u along the beam 0 near → 1 far, v 0 top edge → 1 bottom edge) and the top face above it
  const k = (x, y) => [x - cx, y - cy];
  const S = quadH(k(-260, 560), k(2050, 200), k(2050, 318), k(-260, 1330)), Tp = quadH(k(-200, 330), k(2060, 150), k(2050, 200), k(-260, 560));
  const S_LEN = 14, n = vnoise(17), seg = 44;
  // body fills
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.75)'; ctx.shadowBlur = 70; ctx.shadowOffsetY = 50;
  ctx.beginPath(); for (const [u, v] of [[0, 0], [1, 0], [1, 1], [0, 1]]) ctx.lineTo(...S(u, v)); ctx.closePath();
  const sg = ctx.createLinearGradient(0, 300, 0, 1200); sg.addColorStop(0, '#c9b088'); sg.addColorStop(1, '#6e5638'); ctx.fillStyle = sg; ctx.fill(); ctx.restore();
  ctx.beginPath(); for (const [u, v] of [[0, 0], [1, 0], [1, 1], [0, 1]]) ctx.lineTo(...Tp(u, v)); ctx.closePath();
  const tg = ctx.createLinearGradient(0, 150, 0, 560); tg.addColorStop(0, '#d8c39a'); tg.addColorStop(1, '#f2e6c8'); ctx.fillStyle = tg; ctx.fill();
  // page edges on the side face: wavy lines along the beam, texture fixed in world position (glide)
  ctx.save(); ctx.beginPath(); for (const [u, v] of [[0, 0], [1, 0], [1, 1], [0, 1]]) ctx.lineTo(...S(u, v)); ctx.closePath(); ctx.clip();
  const r = prng(23), NL = 170;
  for (let i = 0; i < NL; i++) {
    const v0 = (i + r() * .7) / NL, dark = r() < .55, a0 = dark ? .14 + r() * .3 : .12 + r() * .3, w0 = .5 + r() * 1.2;
    ctx.strokeStyle = dark ? `rgba(60,40,22,${a0})` : `rgba(255,246,226,${a0})`; ctx.lineWidth = w0; ctx.beginPath();
    for (let j = 0; j <= seg; j++) { const u = j / seg, sw = u * S_LEN + glide, v = v0 + (fbm(n, sw * .55, v0 * 9, 3) - .5) * .022 + Math.sin(sw * .9 + i * .7) * .003; const [x, y] = S(u, v); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke();
  }
  // pressed seams between bundles (world positions every ~1.6 m)
  for (let sw = Math.floor(glide / 1.6) * 1.6; sw < glide + S_LEN; sw += 1.6) { const u = (sw - glide) / S_LEN; if (u < 0) continue; const [xa, ya] = S(u, 0), [xb, yb] = S(u, 1), wpx = Math.max(1, 26 * (1 - u * .85)); const gr = ctx.createLinearGradient(xa - wpx, 0, xa + wpx, 0); gr.addColorStop(0, 'rgba(40,26,16,0)'); gr.addColorStop(.5, 'rgba(40,26,16,.3)'); gr.addColorStop(1, 'rgba(40,26,16,0)'); ctx.strokeStyle = gr; ctx.lineWidth = wpx * 2; ctx.beginPath(); ctx.moveTo(xa, ya); ctx.lineTo(xb, yb); ctx.stroke(); }
  // pages sticking out, a line of handwriting on each (world positions, so they slide by)
  const q = prng(61);
  for (let m = 0; m < 40; m++) {
    const sw = q() * 60, v0 = .08 + q() * .84, len = .6 + q() * 1.2, th = .012 + q() * .014, ss = ((sw - glide) % 60 + 60) % 60; if (ss > S_LEN) continue;
    const u0 = ss / S_LEN, u1 = Math.min(1, (ss + len) / S_LEN), A = S(u0, v0), B = S(u1, v0), C2 = S(u1, v0 + th), D = S(u0, v0 + th);
    ctx.fillStyle = 'rgba(250,242,222,.95)'; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.lineTo(...C2); ctx.lineTo(...D); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(30,22,40,.6)'; ctx.lineWidth = Math.max(.6, 1.4 * (1 - u0)); ctx.beginPath(); let uu = u0 + .01, j = 0;
    while (uu < u1 - .01) { const st = (.04 + q() * .05) * (u1 - u0); const [x1, y1] = S(uu, v0 + th * (.55 + (q() - .5) * .3)), [xc, yc] = S(uu + st * .5, v0 + th * (.1 + q() * .25)); if (!j++) ctx.moveTo(x1, y1); ctx.quadraticCurveTo(xc, yc, ...S(uu + st, v0 + th * (.5 + (q() - .5) * .3))); uu += st; }
    ctx.stroke(); ctx.fillStyle = 'rgba(40,26,14,.4)'; ctx.beginPath(); ctx.moveTo(...D); ctx.lineTo(...C2); ctx.lineTo(...S(u1, v0 + th * 1.6)); ctx.lineTo(...S(u0, v0 + th * 1.6)); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  // top face: the top page, a line of handwriting now and then, page tops as fine lines near the edge
  ctx.save(); ctx.beginPath(); for (const [u, v] of [[0, 0], [1, 0], [1, 1], [0, 1]]) ctx.lineTo(...Tp(u, v)); ctx.closePath(); ctx.clip();
  ctx.strokeStyle = 'rgba(120,96,64,.25)'; ctx.lineWidth = .8; for (let i = 0; i < 9; i++) { const v = .82 + i * .02; ctx.beginPath(); for (let j = 0; j <= 20; j++) { const [x, y] = Tp(j / 20, v); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  const q2 = prng(83); ctx.strokeStyle = 'rgba(28,20,44,.55)'; ctx.lineCap = 'round';
  for (let m = 0; m < 26; m++) { const sw = q2() * 50, v0 = .15 + q2() * .55, len = 1 + q2() * 1.6, ss = ((sw - glide) % 50 + 50) % 50; if (ss > S_LEN) continue; const u0 = ss / S_LEN, u1 = Math.min(1, (ss + len) / S_LEN); ctx.lineWidth = Math.max(.5, 1.6 * (1 - u0 * .9)); ctx.beginPath(); let uu = u0, j = 0; while (uu < u1) { const st = (.03 + q2() * .04) * (u1 - u0) + .002; const p1 = Tp(uu, v0 + (q2() - .5) * .03), pc = Tp(uu + st * .5, v0 - .06 - q2() * .05), p2 = Tp(uu + st, v0 + (q2() - .5) * .03); if (!j++) ctx.moveTo(...p1); ctx.quadraticCurveTo(...pc, ...p2); uu += st; } ctx.stroke(); }
  ctx.restore();
  // light: the lamp rakes from the upper left; far end into haze, bottom edge into shadow
  ctx.save(); ctx.beginPath(); for (const [u, v] of [[0, 0], [1, 0], [1, 1], [0, 1]]) ctx.lineTo(...S(u, v)); for (const [u, v] of [[0, 0], [1, 0], [1, 1], [0, 1]]) ctx.lineTo(...Tp(u, v)); ctx.clip();
  const hz = ctx.createLinearGradient(...k(200, 0), ...k(2000, 0)); hz.addColorStop(0, 'rgba(20,12,16,0)'); hz.addColorStop(.6, 'rgba(26,16,20,.35)'); hz.addColorStop(1, 'rgba(18,12,18,.9)'); ctx.fillStyle = hz; ctx.fillRect(0, 0, W, H);
  const sh = ctx.createLinearGradient(0, 700, 0, 1300); sh.addColorStop(0, 'rgba(14,8,10,0)'); sh.addColorStop(1, 'rgba(14,8,10,.7)'); ctx.fillStyle = sh; ctx.fillRect(0, 0, W, H);
  const L = ctx.createRadialGradient(...k(300, 200), 0, ...k(300, 200), 1400); L.addColorStop(0, rgba('#ffd08f', .32 * lit)); L.addColorStop(1, 'rgba(255,200,140,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = L; ctx.fillRect(0, 0, W, H);
  ctx.restore();
  ctx.save(); ctx.strokeStyle = rgba('#fff0d0', .7 * lit); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...S(0, 0)); ctx.lineTo(...S(1, 0)); ctx.stroke(); ctx.restore();
  // dust in the lamp light
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const d = prng(77);
  for (let i = 0; i < 140; i++) { const x = ((d() * 2200 - glide * 60 * (.4 + d()) + t * 10) % 2200 + 2200) % 2200 - 140, y = d() * H + Math.sin(t * .6 + i) * 10 - t * 4; const a = (.08 + .32 * d()) * lit * clamp(1 - Math.hypot(x - 400, y - 250) / 1500); ctx.fillStyle = `rgba(255,224,180,${a})`; const z = d() < .85 ? 1.3 : 2.6; ctx.fillRect(x, ((y % H) + H) % H, z, z); }
  ctx.restore();
  return { top: { x: W / 2, y: 0 }, base: { x: W / 2, y: H }, project: (X, Y) => [X, Y, 1], lamps: [], box: { x0: 0, y0: 150, x1: W, y1: H }, outline: () => [], beam: { x: S(.35, .3)[0], y: S(.35, .3)[1] }, side: S, topFace: Tp, f: 1 };
}

// ---------- far / mid view ----------
export function scaffold(ctx, t, o = {}) {
  const view = o.view || 'far'; if (view === 'macro') return macro(ctx, t, o);
  const mood = o.mood === 'dawn' ? 'dawn' : 'night', M = MOOD[mood], C = makeCam(view, o), P = C.project, cam = o.cam || {};
  const lights = clamp(o.lights ?? 1), fogA = clamp(o.fog ?? .6), glow = clamp(o.glow ?? 0), back = clamp(o.back ?? 0);
  const par = (k) => [-(cam.x ?? 0) * k + (C.yaw - VIEWS[view].yaw) * 900 * k, -(cam.y ?? 0) * k + (o.crane ?? 0) * 9 * k];
  const hy = C.horizon, hk = hy - 806;
  if (o.drawSky !== false) { ctx.fillStyle = M.top; ctx.fillRect(0, 0, W, H); const [dx] = par(.15); ctx.drawImage(sky(mood), -200 + dx + drift(t, 6, 1), hy - 840 + drift(t, 3, 2)); }
  const fogX = (k, sp) => -110 + 100 * Math.sin(t * sp + k) + par(k)[0] * .3;
  const base = P(0, 0, 0), top = P(...CROWN);
  // back light (1.06: amber through the paper; dawn: the low sun behind)
  if (back > 0) { const Bg = backGlow(M.warm); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = back; const [bx, by] = P(0, LV * SY * .45, PZ(BZ) + 30); ctx.drawImage(Bg, bx - 800, by - 700); ctx.restore(); }
  // far fog band behind the structure
  { const [dx, dy] = par(.3); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = fogA * 1.1; ctx.drawImage(fogLayer('sf-far-' + mood, 420, 860, M.fog, M.fogA, 3), fogX(.3, .03), hk, W * 1.12, H); ctx.restore(); }
  // the lattice: beams sorted by depth into bins; far bins lighter (fog), near bins darker with a warm top edge
  const BM = beams(), segs = [];
  const hoist = o.hoist; let beamPos = null;
  for (const b of BM) { const A = P(...b.a), Bp = P(...b.b); if (A[2] < 1 || Bp[2] < 1) continue; segs.push([A, Bp, b]); }
  const zs = segs.map((s) => (s[0][2] + s[1][2]) / 2), zmin = Math.min(...zs), zmax = Math.max(...zs), NB = 8, bins = Array.from({ length: NB }, () => []);
  segs.forEach((s, i) => bins[Math.min(NB - 1, Math.floor((zs[i] - zmin) / (zmax - zmin + 1e-6) * NB))].push(s));
  ctx.save(); ctx.lineCap = 'round';
  // the inner glow (1.10a): the scaffold fills with warm light from the bottom up, behind the near beams
  if (glow > 0) {
    const Bs = bloomSprite(M.warm, 160); ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let l = 0; l <= LV; l++) { const q = clamp(glow * (LV + 2) - l); if (q <= 0) continue; for (let i = 0; i < BX; i += 2) for (let k = 0; k < BZ; k += 2) { const [x, y, z] = P(PX(i) + SX, (l + .5) * SY, PZ(k) + SZ * .5), s = C.f / z * 13; ctx.globalAlpha = .2 * q; ctx.drawImage(Bs, x - s, y - s * .8, s * 2, s * 1.6); } }
    ctx.restore();
  }
  for (let bi = NB - 1; bi >= 0; bi--) {
    const far = bi / (NB - 1), list = bins[bi]; if (!list.length) continue;
    const zMid = mix(zmin, zmax, (bi + .5) / NB), wpx = Math.max(.8, C.f * .58 / zMid);
    const body = mix(1, 0, far) * .0 + 0; void body;
    ctx.strokeStyle = rgba(mix3(M.body, M.fog, far * M.farA + (1 - lights) * 0), mix(.95, .7, far)); ctx.lineWidth = wpx;
    ctx.beginPath(); for (const [A, B] of list) { ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); } ctx.stroke();
    // paper colour where lamps and glow touch: a warm thin line on the upper/right edge
    const warm = clamp(lights * .7 + glow) * mix(1, .35, far);
    if (warm > .02) { ctx.strokeStyle = rgba(M.hi, .55 * warm); ctx.lineWidth = Math.max(.6, wpx * .32); ctx.beginPath(); for (const [A, B] of list) { const ox = wpx * .3, oy = -wpx * .3; ctx.moveTo(A[0] + ox, A[1] + oy); ctx.lineTo(B[0] + ox, B[1] + oy); } ctx.stroke(); }
    if (glow > 0) { ctx.strokeStyle = rgba('#ffd08f', .35 * glow * (1 - far * .5)); ctx.lineWidth = Math.max(.5, wpx * .55); ctx.beginPath(); for (const [A, B, b] of list) { if (b.kind !== 'post' && clamp(glow * (LV + 2) - b.lv) <= 0) continue; ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); } ctx.stroke(); }
  }
  ctx.restore();
  // the hauled beam (1.01b) on two ropes from a pulley at level 6, the haulers at the foot
  if (hoist != null) {
    const slot = 6, u = eio(clamp(hoist)), yb = mix(.8, slot * SY - .6, u), x0 = PX(2), x1 = PX(3), z0 = PZ(0) - .6;
    const A = P(x0 + .3, yb, z0), B = P(x1 - .3, yb, z0), pul = P((x0 + x1) / 2, slot * SY + 1.6, z0), wpx = Math.max(1.4, C.f * .5 / A[2]);
    beamPos = { x: (A[0] + B[0]) / 2, y: (A[1] + B[1]) / 2 };
    ctx.save(); ctx.strokeStyle = 'rgba(210,190,150,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(pul[0], pul[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
    const foot = P((x0 + x1) / 2 + 9, 0, z0 - 6); ctx.beginPath(); ctx.moveTo(pul[0], pul[1]); ctx.lineTo(foot[0] - 4, foot[1] - 28 * C.f / foot[2] * .05); ctx.stroke();
    ctx.lineCap = 'round'; ctx.strokeStyle = M.body; ctx.lineWidth = wpx; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
    ctx.strokeStyle = rgba(M.hi, .7 * lights); ctx.lineWidth = Math.max(.7, wpx * .3); ctx.beginPath(); ctx.moveTo(A[0], A[1] - wpx * .3); ctx.lineTo(B[0], B[1] - wpx * .3); ctx.stroke();
    ctx.restore();
  }
  // haulers: a short line of tiny figures leaning back on the rope, pulling in rhythm
  const workers = clamp(o.workers ?? 0);
  if (workers > 0) {
    ctx.save(); ctx.globalAlpha = workers;
    for (let k = 0; k < 6; k++) { const [x, y, z] = P(PX(2) + 10 + k * 1.3, 0, PZ(0) - 6 - k * .5), s = C.f / z * .042, pull = Math.sin(t * 3.1 - k * .5); tiny(ctx, x, y, s, { lean: -.32 - .1 * pull, arm: 1.3 + .25 * pull, rim: '#ffcf8a', rimA: .6 * lights }); }
    ctx.restore();
  }
  // lamps: housing, bright point, cone into the fog
  const lamps = [], flick = o.flick;
  for (let i = 0; i < LAMPS.length; i++) {
    const [X, Y, Z, aim, sp] = LAMPS[i]; let a = lights;
    if (flick && flick.i === i) { const d = t - flick.t0; a *= d < 0 ? 0 : d > .45 ? 1 : (Math.sin(d * 70) > .1 ? .9 : .15) * clamp(d * 3); }
    const [x, y, z] = P(X, Y, Z), s = C.f / z; lamps.push({ x, y, a, s }); if (a <= .01) continue;
    const S = coneSprite(sp), k = s * .055; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = (.26 + .14 * Math.sin(i * 2.3)) * a * (mood === 'dawn' ? .5 : 1); ctx.translate(x, y); ctx.rotate(aim); ctx.scale(k, k); ctx.drawImage(S, -500, -30); ctx.restore();
    const Bs = bloomSprite('#ffb35c', 120), bs = Math.max(10, s * 1.6); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(Bs, x - bs, y - bs, bs * 2, bs * 2); ctx.restore();
  }
  if ((o.topLight ?? 0) > 0) { const [x, y, z] = P(...CROWN), s = C.f / z, a = clamp(o.topLight); const S = coneSprite(.22); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .6 * a; ctx.translate(x, y); ctx.rotate(Math.PI - .25); ctx.scale(s * .06, s * .07); ctx.drawImage(S, -500, -30); ctx.restore(); const Bs = bloomSprite('#ffb35c', 120), bs = Math.max(14, s * 2.2); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(Bs, x - bs, y - bs, bs * 2, bs * 2); ctx.restore(); lamps.push({ x, y, a, s, top: true }); }
  // the crowd (1.10b): rings of tiny figures on the plain around the foot, each holding a sheet that lights up
  const crowd = clamp(o.crowd ?? 0);
  if (crowd > 0) {
    const r = prng(91), N = o.crowdN ?? 520, sheets = clamp(o.sheets ?? 0), list = [];
    for (let i = 0; i < N; i++) { const ring = 26 + Math.pow(r(), .8) * 120, a = r() * TAU, X = Math.cos(a) * ring * 1.15, Z = Math.sin(a) * ring * .9, p = P(X, 0, Z); if (p[2] < 4) { r(); r(); continue; } list.push([p, ring, r(), r()]); }
    list.sort((p, q) => q[0][2] - p[0][2]);
    const Bs = bloomSprite('#ffb35c', 60);
    for (const [[x, y, z], ring, q1, q2] of list) {
      if (x < -40 || x > W + 40 || y < -20 || y > H + 80) continue; const s = C.f / z * .045, vis = clamp(crowd * 1.6 - q1 * .6); if (vis <= 0) continue;
      ctx.globalAlpha = vis; tiny(ctx, x, y, s, { lean: .02 * Math.sin(t * .8 + q2 * 9), arm: 1.0, col: mix3('#120d12', M.fog, clamp((z - 60) / 260) * .6), rim: '#ffcf8a', rimA: .35 });
      const lit = sm(clamp(sheets * 1.8 - ring / 150 * .8 - q2 * .15)), hx = x + 6 * s, hy = y - 30 * s;
      ctx.fillStyle = lit > .05 ? rgba('#fff1d6', .5 + .5 * lit) : 'rgba(220,205,170,.55)'; ctx.fillRect(hx - 2.2 * s, hy - 3 * s, 4.4 * s + .6, 5.5 * s + .6);
      if (lit > .02) { const bs = Math.max(4, s * 16); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = vis * lit * .8; ctx.drawImage(Bs, hx - bs, hy - bs, bs * 2, bs * 2); ctx.restore(); }
    }
    ctx.globalAlpha = 1;
  }
  // near fog over the foot and ground mist
  { const [dx, dy] = par(.7); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = fogA; ctx.drawImage(fogLayer('sf-low-' + mood, 700, 1080, M.fog, M.fogA * 1.2, 8), fogX(.7, .05), hk * .6, W * 1.12, H); ctx.restore(); }
  const xs = segs.flatMap((s) => [s[0][0], s[1][0]]), ys = segs.flatMap((s) => [s[0][1], s[1][1]]);
  const box = { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
  return { top: { x: top[0], y: top[1] }, base: { x: base[0], y: base[1] }, project: P, lamps, box, outline: (n) => outline(P, n), beam: beamPos, f: C.f };
}
// points on the outline of the finished building (the envelope of the lattice + a roof ridge): corner edges, floor lines, roof
function outline(P, n = 600) {
  const x0 = PX(0) - .8, x1 = PX(BX) + .8, z0 = PZ(0) - .8, z1 = PZ(BZ) + .8, h = LV * SY + .5, ridge = h + 9;
  const edges = [];
  for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) edges.push([[x, 0, z], [x, h, z]]);
  for (const y of [0, h * .34, h * .67, h]) { edges.push([[x0, y, z0], [x1, y, z0]], [[x1, y, z0], [x1, y, z1]], [[x0, y, z1], [x1, y, z1]], [[x0, y, z0], [x0, y, z1]]); }
  edges.push([[x0, h, (z0 + z1) / 2], [x1, h, (z0 + z1) / 2]].map((p) => [p[0], ridge, p[2]]));
  for (const x of [x0, x1]) edges.push([[x, h, z0], [x, ridge, (z0 + z1) / 2]], [[x, ridge, (z0 + z1) / 2], [x, h, z1]]);
  const L = edges.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])), tot = L.reduce((s, v) => s + v, 0), out = [], r = prng(5);
  for (let i = 0; i < n; i++) { let s = r() * tot, e = 0; while (s > L[e]) { s -= L[e]; e++; } const [a, b] = edges[e], q = s / L[e], p = P(mix(a[0], b[0], q), mix(a[1], b[1], q), mix(a[2], b[2], q)); out.push([p[0], p[1]]); }
  return out;
}
function mix3(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
