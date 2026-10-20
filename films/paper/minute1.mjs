// minute1.mjs · Film 4, first minute in the paper + infographic style (72.5 s).
// One amber line carries every transition: dawn horizon → income line → week baseline → wellbeing chart →
// the wall → stage edge → timeline → the channel to "you" → the window back into the dawn.
// Audio: /mnt/project-files/scenario/stil-papier/minute1/audio (timing.json word times are the anchors below).
import { loadImage } from '@napi-rs/canvas';
import { W, H, canvas, finish, screenGlow, clamp, mix, lin, smoo, prng, rgba, mixHex } from './paper.mjs';
import { build as buildHook } from './hook2.mjs';

export const DUR = 72.5;
const AMBER = '#ffb35c', HOT = '#ffe2b0', CREAM = '#f3efe2', SEC = '#a49fc4', CYAN = '#8fe6ff', CYAND = '#0a6f8c';
const SERIF = '"Instrument Serif"';
const ease = smoo;
const expoO = (x) => x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x));
const expoIO = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x < .5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
const k = (a, b, t, f = ease) => f(lin(a, b, t));
const wob = (t, s = 1) => ({ x: (Math.sin(t * .31) * .6 + Math.sin(t * .73 + 1) * .4) * 4 * s, y: Math.sin(t * .43 + 2) * 3 * s });

// ---------------------------------------------------------------- shared paper helpers (immediate mode)
// a cut-paper card: soft drop shadow (light from the upper right), body, lit top rim
function card(g, path, fill, { sh = .45, blur = 18, dx = -8, dy = 10, rim = '#fff2dc', rimA = .55, rimW = 2.5 } = {}) {
  g.save(); g.shadowColor = rgba('#05040f', sh); g.shadowBlur = blur; g.shadowOffsetX = dx; g.shadowOffsetY = dy;
  path(g); g.fillStyle = fill; g.fill(); g.restore();
  if (rimA) { g.save(); path(g); g.clip(); g.translate(0, rimW); path(g); g.rect(-1e5, -1e5, 2e5, 2e5); g.fillStyle = rgba(rim, rimA); g.fill('evenodd'); g.restore(); }
}
const rr = (x, y, w, h, r = 6) => (g) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
function grad(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); for (const [o, c] of stops) gr.addColorStop(o, c); return gr; }
function label(g, txt, x, y, { size = 26, col = CREAM, a = 1, sp = .32, w = 600, align = 'left' } = {}) {
  g.save(); g.font = `${w} ${size}px Inter`; g.letterSpacing = `${size * sp}px`; g.textAlign = align; g.textBaseline = 'alphabetic'; g.fillStyle = rgba(col, a); g.fillText(txt, x, y); g.restore();
}
// text that wipes up from a baseline mask
function wipeText(g, txt, x, y, kk, opt = {}) {
  if (kk <= 0) return; const size = opt.size ?? 26; g.save(); g.beginPath(); g.rect(x - 2000, y - size * 1.3, 4000, size * 1.6); g.clip();
  label(g, txt, x, y + (1 - kk) * size * 1.4, opt); g.restore();
}
function serif(g, txt, x, y, size, col, a = 1, align = 'center') { g.save(); g.font = `${size}px ${SERIF}`; g.textAlign = align; g.textBaseline = 'alphabetic'; g.fillStyle = rgba(col, a); g.fillText(txt, x, y); g.restore(); }
// glowing amber line (the carrier)
function amberLine(g, pts, { w = 5, glow = 22, a = 1 } = {}) {
  if (pts.length < 2) return;
  const path = () => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); };
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round'; g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba('#ffcf8f', .22 * a); g.lineWidth = glow; path(); g.stroke();
  g.globalCompositeOperation = 'source-over'; g.strokeStyle = rgba(HOT, a); g.lineWidth = w; path(); g.stroke(); g.restore();
}
// camera for the 2D stages: zoom about a focus point, parallax by layer depth (k: 0 = sky, 1 = main, >1 = foreground)
function view(g, cam, kz = 1) {
  const z = 1 + (cam.z - 1) * kz, ox = cam.x * kz, oy = cam.y * kz;
  g.setTransform(z, 0, 0, z, cam.fx - (cam.fx + ox) * z + ox * 0, cam.fy - (cam.fy + oy) * z);
  g.translate(-ox / 1, 0); g.translate(0, 0);
}
function setView(g, cam, kz = 1) {   // screen = F + (p - F - o*kz) * zoom(kz)
  const z = 1 + (cam.z - 1) * kz;
  g.setTransform(z, 0, 0, z, cam.fx * (1 - z) - cam.x * kz * z, cam.fy * (1 - z) - cam.y * kz * z);
}
// the night-blue board sky shared by every chart scene (it is the hook's sky after the hills fell away)
function boardSky(g, t, { sunA = 1, sunX = 1240, sunY = 305, warm = 0 } = {}) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = grad(g, 0, 0, 0, H, [[0, mixHex('#12132c', '#2a2350', warm)], [.35, mixHex('#1f2148', '#4a3a6e', warm)], [.55, mixHex('#2e2c5a', '#b0708a', warm)],
    [.68, mixHex('#433a68', '#eea98a', warm)], [1, mixHex('#4a3e66', '#f5c99a', warm)]]); g.fillRect(0, 0, W, H);
  const r = prng(12); for (let i = 0; i < 7; i++) { const y = 120 + r() * 260, x = ((r() * 2600 + t * (5 + r() * 5)) % 2600) - 300, w = 300 + r() * 500;
    g.fillStyle = rgba(mixHex('#c88fa6', '#ffd2b0', y / 400), (.048 + r() * .042)); g.beginPath(); g.ellipse(x, y, w / 2, 4 + r() * 8, 0, 0, 7); g.fill(); }
  if (sunA > 0) { screenGlow(g, sunX, sunY, 820, '#ffb88a', .2475 * sunA, .55); screenGlow(g, sunX, sunY, 230, '#ffc98a', .5 * sunA);
    g.fillStyle = rgba('#fff1cf', sunA); g.beginPath(); g.arc(sunX, sunY, 40, 0, 7); g.fill(); }
}
function grooves(g, x0, x1, y0, y1, step, a) {   // faint engraved grid on the board
  if (a <= 0) return; g.save(); g.lineWidth = 1.4;
  for (let x = x0; x <= x1; x += step) { g.strokeStyle = rgba('#0b0a20', .35 * a); g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke(); g.strokeStyle = rgba('#ffe4cf', .1 * a); g.beginPath(); g.moveTo(x + 1.4, y0); g.lineTo(x + 1.4, y1); g.stroke(); }
  for (let y = y1; y >= y0; y -= step) { g.strokeStyle = rgba('#0b0a20', .35 * a); g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); g.strokeStyle = rgba('#ffe4cf', .1 * a); g.beginPath(); g.moveTo(x0, y + 1.4); g.lineTo(x1, y + 1.4); g.stroke(); }
  g.restore();
}

// ---------------------------------------------------------------- S2 · the week (11.4–18.2): "So what do you do? Sleep in. Travel. Finally rest."
// the bars fall away, the income line sinks to become the floor of a week planner; work hours peel off and turn into your own time
const LINE0 = 409, BASE = 830;                        // income line height at the end of the hook; the planner floor
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const COLX = (d) => 470 + d * 150, TW = 118, TH = 30, HOURS = 14;   // 7:00 to 21:00
const tileY = (h) => BASE - 22 - (h + 1) * (TH + 6);
const isWork = (d, h) => d < 5 && h >= 2 && h < 10;   // 9:00–17:00 on weekdays
function sceneWeek(g, t) {
  const cam = { fx: 960, fy: 640, x: wob(t).x, y: wob(t).y - 20 * k(11.4, 18, t), z: 1 + .06 * k(11.4, 18.2, t) };
  boardSky(g, t, { sunA: 1 - k(12.2, 13.4, t) });
  setView(g, cam, .3); grooves(g, 0, W, 60, 1100, 150, .4 * k(12.4, 13.4, t));
  setView(g, cam, 1);
  // the line sinks from the income height to the planner floor and shortens to the week's width
  const ly = mix(LINE0, BASE, k(12.0, 13.0, t, expoIO)), lx0 = mix(-40, 360, k(12.0, 13.0, t, expoIO)), lx1 = mix(1460, 1560, k(12.0, 13.0, t, expoIO));
  // day labels under the floor
  DAYS.forEach((d, i) => wipeText(g, d, COLX(i) + TW / 2, BASE + 52, k(12.5 + i * .05, 13.1 + i * .05, t), { size: 24, col: i > 4 ? CREAM : SEC, align: 'center' }));
  // hour tiles stack up column by column (paper cards, staggered), work hours in slate
  for (let d = 0; d < 7; d++) for (let h = 0; h < HOURS; h++) {
    const st = 12.5 + d * .07 + h * .035, kk = expoO(lin(st, st + .5, t)); if (kk <= 0) continue;
    const x = COLX(d), y = tileY(h) + (1 - kk) * 60;
    let col = '#3b3d6a';                                     // free hour: dusk blue
    if (isWork(d, h)) col = '#6b7290';                       // work hour: grey slate
    // "So what do you do?": the work tiles flip, one by one, to amber (your time now)
    const fl = st + 0.9 + (d * 8 + h) * .018, f = lin(Math.max(fl, 13.0), Math.max(fl, 13.0) + .35, t);
    const flipped = isWork(d, h) && f > .5;
    if (flipped) col = mixHex('#e0913f', AMBER, .4 + .6 * Math.sin(h * 1.7 + d) ** 2);
    // "Sleep in": the early hours become deep sleep blue with a small moon
    const sleep = h < 3 && k(13.5, 14.1, t) > 0 ? k(13.5 + d * .04, 14.0 + d * .04, t) : 0;
    if (sleep) col = mixHex(col, '#1b2350', sleep);
    // "Finally rest": everything settles warm
    const rest = k(15.7 + h * .02, 16.6 + h * .02, t); if (rest > 0 && !sleep) col = mixHex(col, mixHex('#f0a860', '#ffc884', (h % 3) / 3), rest * (isWork(d, h) ? .2 : .55));
    const sy = isWork(d, h) ? Math.abs(Math.cos(clamp(f) * Math.PI)) : 1;   // flip = squash through zero height
    card(g, rr(x, y + TH / 2 * (1 - sy), TW, TH * sy, 5), col, { sh: .35, blur: 10, dx: -4, dy: 6, rimA: .45 });
    if (sleep > .3 && h === 1) { g.save(); g.globalAlpha = sleep; g.fillStyle = '#f3efe2'; g.beginPath(); g.arc(x + TW / 2, y + TH / 2, 8, 0, 7); g.fill(); g.fillStyle = '#1b2350'; g.beginPath(); g.arc(x + TW / 2 + 4, y + TH / 2 - 3, 7, 0, 7); g.fill(); g.restore(); }
  }
  // label above the planner
  wipeText(g, 'YOUR WEEK', 470, tileY(HOURS) - 40, k(12.4, 13.0, t), { size: 30 });
  wipeText(g, 'WORK HOURS: 0', 470, tileY(HOURS) - 2, k(12.9, 13.5, t), { size: 22, col: SEC, w: 500 });
  // "Travel": a paper plane flies a dashed route across the week (the channel's logo motif)
  const tk = k(14.6, 16.0, t);
  if (tk > 0 && t < 18.4) {
    const pts = []; for (let i = 0; i <= 60; i++) { const u = i / 60 * tk; pts.push([mix(380, 1560, u), tileY(7) - Math.sin(u * Math.PI) * 220 + Math.sin(u * 9) * 18]); }
    g.save(); g.setLineDash([10, 12]); g.strokeStyle = rgba(CREAM, .8 * (1 - k(17.2, 18.0, t))); g.lineWidth = 3; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.restore();
    const [px, py] = pts[pts.length - 1], [qx, qy] = pts[pts.length - 2], an = Math.atan2(py - qy, px - qx);
    if (tk < 1) { g.save(); g.translate(px, py); g.rotate(an); card(g, (c) => { c.beginPath(); c.moveTo(22, 0); c.lineTo(-16, -13); c.lineTo(-8, 0); c.lineTo(-16, 13); c.closePath(); }, CREAM, { sh: .4, blur: 8, rimA: 0 }); g.restore(); }
  }
  amberLine(g, [[lx0, ly], [lx1, ly]]);
  return { ly };
}

// ---------------------------------------------------------------- S3 · the wall (18.2–25.6): "But a few months in, you might hit a wall. And the reason isn't the one you'd guess."
// the week collapses into one point per week; the points draw how you feel over the months, rising, then running into a paper wall
const WX = 1330;   // the wall's front face
const feel = (u) => u < .35 ? mix(.35, .92, Math.sin(u / .35 * Math.PI / 2)) : u < .62 ? .92 - (u - .35) * .35 : .83 - (u - .62) * 1.25;
function sceneWall(g, t) {
  const cam = { fx: WX, fy: 600, x: wob(t).x, y: wob(t).y, z: 1 + .5 * k(21.6, 25.4, t, (x) => x * x * (3 - 2 * x)) };
  boardSky(g, t, { sunA: 0 });
  setView(g, cam, .3); grooves(g, 0, W, 60, 1100, 150, .7 * k(18.4, 19.4, t));
  setView(g, cam, 1);
  const c = k(18.1, 19.0, t, expoIO);   // collapse
  const X0 = 360, X1 = 1600, top = 300;
  // axis labels
  wipeText(g, 'HOW YOU FEEL', X0, top - 30, k(18.6, 19.2, t), { size: 26 });
  ['MONTH 1', 'MONTH 2', 'MONTH 3', 'MONTH 4'].forEach((m, i) => wipeText(g, m, X0 + i * 300 + 20, BASE + 50, k(18.8 + i * .25, 19.3 + i * .25, t), { size: 20, col: SEC, w: 500 }));
  // the week's tiles fold down into a single row of dots (one per week)
  const N = 16, p = (i) => i / (N - 1);
  const dx = (i) => mix(X0 + 40, X1 - 40, p(i)), dy = (i) => mix(BASE - 60, mix(BASE, top, feel(p(i))), k(18.6 + i * .12, 19.2 + i * .12, t));
  if (c < 1) { g.save(); g.globalAlpha = 1 - c; for (let d = 0; d < 7; d++) card(g, rr(COLX(d), mix(tileY(HOURS - 1), BASE - 40, c), TW, mix(HOURS * (TH + 6), 20, c), 6), mixHex('#3b3d6a', AMBER, .5), { sh: .3, blur: 8, rimA: .4 }); g.restore(); }
  const shown = Math.min(N, Math.floor(k(18.6, 21.0, t, (x) => x) * N + .999));
  const pts = []; for (let i = 0; i < shown; i++) pts.push([dx(i), dy(i)]);
  // the wall slides up out of the floor on "wall"
  const wk = expoO(lin(19.95, 20.55, t)), wallH = 620, wy = BASE - wallH * wk;
  if (wk > 0) {
    card(g, (q) => { q.beginPath(); q.moveTo(WX, BASE); q.lineTo(WX, wy); q.lineTo(WX + 30, wy - 18); q.lineTo(WX + 300, wy - 18); q.lineTo(WX + 300, BASE); q.closePath(); }, '#24234a', { sh: .6, blur: 30, dx: -24, dy: 8, rimA: .7, rimW: 3 });
    g.save(); g.fillStyle = grad(g, WX, 0, WX + 60, 0, [[0, rgba('#ffd2a8', .35)], [1, rgba('#ffd2a8', 0)]]); g.fillRect(WX, wy, 60, BASE - wy); g.restore();   // the lit face
    // paper bricks, cut lines only
    g.save(); g.beginPath(); g.rect(WX, wy, 300, BASE - wy); g.clip(); g.strokeStyle = rgba('#0b0a20', .35); g.lineWidth = 2;
    for (let r = 0; r < 14; r++) { const y = BASE - r * 46; g.beginPath(); g.moveTo(WX, y); g.lineTo(WX + 300, y); g.stroke(); for (let b = 0; b < 4; b++) { const x = WX + (b * 90 + (r % 2) * 45); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 46); g.stroke(); } }
    g.restore();
  }
  // the line through the dots stops at the wall and slumps; the last point pulses (the question)
  const clipX = wk > 0 ? WX - 6 : 1e4;
  const vis = pts.filter(([x]) => x < clipX); if (wk > 0 && pts.length && pts[pts.length - 1][0] >= clipX) { const ly = mix(BASE, top, feel((clipX - X0 - 40) / (X1 - X0 - 80))); vis.push([clipX, ly + 40 * k(20.3, 21.3, t)]); }
  amberLine(g, [[X0 - 40, BASE], [WX, BASE]], { a: 1 });   // the floor = the carrier
  amberLine(g, vis, { w: 4, glow: 16 });
  vis.forEach(([x, y], i) => { if (i < vis.length - 1 || x < clipX) { g.fillStyle = HOT; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); } });
  if (wk > 0 && vis.length) { const [x, y] = vis[vis.length - 1], pu = .5 + .5 * Math.sin(t * 4); screenGlow(g, x, y, 70 + 20 * pu, '#ffcf8f', .5); g.fillStyle = '#fff4dc'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); }
  // "the reason isn't the one you'd guess": a question mark is cut into the wall
  const qk = k(22.0, 22.9, t, expoO); if (qk > 0) serif(g, '?', WX + 150, BASE - 220, 260 * (.8 + .2 * qk), HOT, qk * .9);
}

// ---------------------------------------------------------------- S4 · daydream → stage (25.6–32.4): "It sounds like a daydream. But the people building AI are now saying it on stage."
const STAGE_Y = 760;
function cloud(g, x, y, s, col, a) { g.save(); g.globalAlpha = a; card(g, (q) => { q.beginPath(); q.ellipse(x, y, 120 * s, 40 * s, 0, 0, 7); q.ellipse(x - 70 * s, y + 8 * s, 70 * s, 32 * s, 0, 0, 7); q.ellipse(x + 60 * s, y - 20 * s, 80 * s, 48 * s, 0, 0, 7); }, col, { sh: .25, blur: 20, dx: -6, dy: 10, rimA: 0 }); g.restore(); }
function sceneStage(g, t, clipImg) {
  // 25.6: we are pressed against the wall face (its lit brick colour); it pales into a pastel daydream sky with paper clouds
  const dd = k(25.4, 26.9, t), open = k(28.0, 30.4, t, expoIO);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = grad(g, 0, 0, 0, H, [[0, mixHex('#24234a', '#9db0d9', dd)], [.6, mixHex('#2c2a55', '#f2c3c0', dd)], [1, mixHex('#24234a', '#ffe0c0', dd)]]); g.fillRect(0, 0, W, H);
  // stage world behind the clouds (revealed as they part): dark hall, spotlight, screen, audience rows
  const cam = { fx: 960, fy: 520, x: wob(t).x, y: wob(t).y, z: mix(1.35, 1.0, open) + .04 * k(30, 32.4, t) };
  if (open > 0) {
    g.save(); g.globalAlpha = open;
    g.fillStyle = grad(g, 0, 0, 0, H, [[0, '#0d0d22'], [.7, '#1b1a3a'], [1, '#151430']]); g.fillRect(0, 0, W, H);
    setView(g, cam, .6);
    // spotlight cone from above onto the speaker's place
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = grad(g, 0, 0, 0, STAGE_Y, [[0, rgba('#fff0d0', 0.02)], [1, rgba('#ffd9a8', .22)]]);
    g.beginPath(); g.moveTo(900, -40); g.lineTo(1020, -40); g.lineTo(1160, STAGE_Y); g.lineTo(760, STAGE_Y); g.closePath(); g.fill(); g.restore();
    setView(g, cam, 1);
    // the big stage screen (portrait, it will carry the clip)
    card(g, rr(820, 150, 280, 497, 8), '#0b0b1c', { sh: .6, blur: 26, rimA: .5 });
    if (clipImg) { g.save(); g.globalAlpha = open * .9; g.drawImage(clipImg, 830, 160, 260, 477); g.restore(); }
    // stage block
    card(g, (q) => { q.beginPath(); q.rect(140, STAGE_Y, 1640, 160); }, '#262448', { sh: .5, blur: 20, rimA: .6 });
    g.save(); g.fillStyle = grad(g, 760, 0, 1160, 0, [[0, rgba('#ffd9a8', 0)], [.5, rgba('#ffd9a8', .25)], [1, rgba('#ffd9a8', 0)]]); g.fillRect(760, STAGE_Y, 400, 160); g.restore();
    // lectern
    card(g, (q) => { q.beginPath(); q.moveTo(1160, STAGE_Y); q.lineTo(1175, 640); q.lineTo(1265, 640); q.lineTo(1280, STAGE_Y); q.closePath(); }, '#3a3866', { sh: .5, blur: 14, rimA: .5 });
    card(g, rr(1160, 628, 120, 16, 3), '#4b4878', { sh: .3, blur: 8, rimA: .6 });
    // audience: three rows of heads from behind, nearer rows larger and darker (foreground parallax)
    for (let row = 0; row < 3; row++) {
      setView(g, cam, 1.15 + row * .2);
      const y = 940 + row * 70, r = 34 + row * 9, col = mixHex('#1a1834', '#07060f', row / 2), rn = prng(5 + row);
      for (let x = -60 + row * 30; x < W + 80; x += r * 2.3) { const hx = x + rn() * 18, bob = Math.sin(t * 1.1 + x * .03) * 1.5;
        card(g, (q) => { q.beginPath(); q.ellipse(hx, y + bob, r * .8, r, 0, 0, 7); q.moveTo(hx - r * 1.4, y + r * 3); q.quadraticCurveTo(hx - r * 1.3, y + r * .9, hx, y + r * .85); q.quadraticCurveTo(hx + r * 1.3, y + r * .9, hx + r * 1.4, y + r * 3); q.closePath(); }, col, { sh: .5, blur: 16, rimA: 0 }); }
    }
    g.restore();
  }
  // the clouds part sideways (left ones left, right ones right)
  setView(g, { fx: 960, fy: 540, x: 0, y: 0, z: 1 + .15 * open }, 1);
  const cl = [[300, 300, 1.3], [760, 200, 1.0], [1250, 330, 1.5], [1650, 220, 1.1], [500, 640, 1.6], [1400, 700, 1.7], [960, 520, 2.2], [150, 860, 1.8], [1800, 820, 1.6]];
  cl.forEach(([x, y, s], i) => { const side = x < 960 ? -1 : 1, drift = Math.sin(t * .3 + i) * 10 + t * 4 * side;
    cloud(g, x + drift + side * 1500 * open * (1 + (i % 3) * .2), y, s, mixHex('#ffe9df', '#ffd2c2', (i % 3) / 3), dd * (1 - open * .2)); });
  // "on stage": the carrier line is the stage's front edge
  if (open > 0) { setView(g, cam, 1); amberLine(g, [[140, STAGE_Y], [1780, STAGE_Y]], { a: open }); }
  return cam;
}

// ---------------------------------------------------------------- S5 · the clip (32.4–35.2): push into the stage screen; Musk, "work will be optional"
function sceneClip(g, t, clipImg, stageImg) {
  const p = k(31.6, 32.6, t, expoIO), out = k(34.7, 35.5, t, expoIO);
  const s = mix(1, 2.05, p) * mix(1, .48, out);   // the screen grows to fill the frame height, then shrinks away into the timeline
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = '#0d0d22'; g.fillRect(0, 0, W, H);
  const cx = 960, cy = mix(398, 540, p), w = 280 * s, h = 497 * s;
  card(g, rr(cx - w / 2, cy - h / 2, w, h, 10), '#0b0b1c', { sh: .6, blur: 30, rimA: .4 });
  if (clipImg) g.drawImage(clipImg, cx - w / 2 + 10 * s / 2, cy - h / 2 + 10 * s / 2, w - 10 * s, h - 10 * s);
  // lower third and the quote, set beside the portrait clip
  const lk = k(32.5, 33.1, t) * (1 - out);
  wipeText(g, 'ELON MUSK', 1300, 640, lk, { size: 34 });
  wipeText(g, 'CEO, TESLA · U.S.–SAUDI INVESTMENT FORUM 2025', 1300, 680, lk, { size: 16, col: SEC, w: 500, sp: .2 });
}

// ---------------------------------------------------------------- S6 · timeline + the condition (35.2–50.6)
// "He gives it ten, maybe twenty years. And he adds a condition. If AI and robots keep getting better. He thinks they will.
//  But that's not the hard part. The hard part is whether what it earns reaches you."
const TL_Y = 760, YR = (y) => 260 + (y - 2025) * 52;   // 2025 → 260 px, 2050 → 1560 px
function sceneTimeline(g, t) {
  const tilt = k(46.6, 49.4, t, expoIO);   // the camera tilts up to the money above the curves
  const cam = { fx: 960, fy: 540, x: wob(t).x + 160 * tilt, y: wob(t).y - 560 * tilt, z: 1 + .05 * k(35.2, 46, t) - .12 * tilt };
  boardSky(g, t, { sunA: 0 });
  setView(g, cam, .3); grooves(g, -400, W + 400, -900, 1200, 150, .7);
  setView(g, cam, 1);
  // the axis draws itself from the shrinking clip's floor
  const ax = k(35.0, 36.0, t, expoIO);
  amberLine(g, [[mix(960, 160, ax), TL_Y], [mix(960, 1700, ax), TL_Y]]);
  for (let y = 2025; y <= 2050; y += 5) { const kk = k(35.4 + (y - 2025) * .02, 35.9 + (y - 2025) * .02, t); if (kk <= 0) continue;
    g.fillStyle = rgba(CREAM, .8 * kk); g.fillRect(YR(y) - 1.5, TL_Y + 6, 3, 18 * kk); if (y === 2025 || y === 2035 || y === 2045) serif(g, String(y), YR(y), TL_Y + 70, 44, y === 2025 ? HOT : CREAM, kk * (y === 2025 ? 1 : .8)); }
  wipeText(g, 'TODAY', YR(2025), TL_Y + 108, k(35.6, 36.1, t), { size: 16, col: SEC, align: 'center', w: 500 });
  // "ten, maybe twenty years": an amber paper range band 2035–2045, which first lands on 2035 then stretches
  const b1 = k(36.0, 36.6, t, expoO), b2 = k(37.2, 37.9, t, expoIO);
  if (b1 > 0) { const x0 = YR(2035) - 4, x1 = mix(YR(2035) + 8, YR(2045) + 4, b2), y = TL_Y - 54;
    card(g, rr(x0, y + (1 - b1) * 40, x1 - x0, 36, 6), AMBER, { sh: .45, blur: 12, rimA: .7 });
    wipeText(g, b2 > .5 ? 'WORK OPTIONAL: 10–20 YEARS' : 'WORK OPTIONAL', x0, y - 18, b1, { size: 20 }); }
  // "a condition": a paper tag swings down from the band on a thread; "If" is stamped on it
  const tg = k(38.6, 39.6, t, expoO);
  if (tg > 0) { const ax2 = YR(2040), ay = TL_Y - 18, sw = Math.sin((t - 38.6) * 3.2) * .25 * Math.exp(-(t - 38.6) * 1.2);
    g.save(); g.translate(ax2, ay); g.rotate(sw); g.strokeStyle = rgba(CREAM, .8); g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 70 * tg); g.stroke();
    card(g, rr(-62, 70 * tg, 124, 74, 8), '#f3e6cf', { sh: .5, blur: 14, rimA: .6 });
    const st = k(40.4, 40.6, t, expoO); if (st > 0) serif(g, 'If', 0, 70 * tg + 58, 58 * (1.6 - .6 * st), '#c0522a', st);
    g.restore(); }
  // "If AI and robots keep getting better": two capability curves rise from today (cyan = machine)
  const cv = k(40.8, 44.8, t, (x) => x);
  if (cv > 0) {
    const curve = (lift, off) => { const pts = []; for (let i = 0; i <= 80 * cv; i++) { const u = i / 80; pts.push([mix(YR(2025), YR(2050), u), TL_Y - 100 - lift * (Math.exp(u * 3.1) - 1) / (Math.exp(3.1) - 1) - off * u]); } return pts; };
    const dim = 1 - .55 * k(45.1, 45.9, t) - .3 * k(47, 48.5, t);
    for (const [pts, lab, c, dly] of [[curve(560, 40), 'AI', CYAN, 0], [curve(420, 10), 'ROBOTS', '#c8f2ff', .2]]) {
      g.save(); g.globalAlpha = dim; g.lineCap = 'round'; g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba(c, .2); g.lineWidth = 16; g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke();
      g.globalCompositeOperation = 'source-over'; g.strokeStyle = c; g.lineWidth = 4; g.stroke(); g.restore();
      const [ex, ey] = pts[pts.length - 1]; wipeText(g, lab, ex + 18, ey + 8, k(41.0 + dly, 41.6 + dly, t) * dim, { size: 20, col: c }); }
    // "He thinks they will": a small check of agreement at the curves' heads
  }
  // "The hard part: whether what it earns reaches you": above the curves sits what AI earns, a tall stack of amber paper;
  // a channel runs from it down past the timeline to a small "you"
  const mk = k(46.9, 48.2, t, expoO);
  if (mk > 0) {
    const sx = 1500, sy = -120;
    for (let i = 0; i < 12; i++) { const kk = expoO(lin(46.9 + i * .05, 47.5 + i * .05, t)); if (kk <= 0) continue;
      card(g, rr(sx - 150 + Math.sin(i * 2.1) * 8, sy - i * 22 - (1 - kk) * 120, 300, 18, 4), mixHex('#e08a3a', '#ffc477', (i % 4) / 4), { sh: .4, blur: 10, rimA: .6 }); }
    wipeText(g, 'WHAT AI EARNS', sx - 150, sy - 300, mk, { size: 24 });
    // the channel (a groove cut in the board) with the line running inside it, and the gate
    const ch = k(48.3, 49.4, t, (x) => x);
    const path = [[sx, sy + 20], [sx, 80], [1100, 80], [1100, 300]];
    g.save(); g.strokeStyle = rgba('#07061a', .55); g.lineWidth = 34; g.lineJoin = 'round'; g.beginPath(); path.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.globalAlpha = ch; g.stroke(); g.restore();
    // "you": a small paper person-mark at the end of the channel
    const yk = k(49.3, 50.0, t, expoO);
    if (yk > 0) { g.save(); g.translate(1100, 370); g.scale(yk, yk);
      card(g, (q) => { q.beginPath(); q.arc(0, -28, 16, 0, 7); q.moveTo(-30, 40); q.quadraticCurveTo(-30, -6, 0, -6); q.quadraticCurveTo(30, -6, 30, 40); q.closePath(); }, AMBER, { sh: .5, blur: 12, rimA: .7 });
      g.restore(); wipeText(g, 'YOU', 1150, 400, yk, { size: 24 }); }
  }
  return cam;
}

// ---------------------------------------------------------------- S7 · the biggest if (50.6–57.4): "That's the biggest 'if' in this film. For the next few minutes, let's say it does."
function sceneIf(g, t, prevCam) {
  const cam = { fx: 960, fy: 540, x: 160 + wob(t).x, y: -560 + wob(t).y, z: .93 + .06 * k(50.6, 57.4, t) };
  boardSky(g, t, { sunA: 0 });
  setView(g, cam, .3); grooves(g, -400, W + 400, -900, 1200, 150, .7);
  setView(g, cam, 1);
  const sx = 1500, sy = -120;
  for (let i = 0; i < 12; i++) card(g, rr(sx - 150 + Math.sin(i * 2.1) * 8, sy - i * 22, 300, 18, 4), mixHex('#e08a3a', '#ffc477', (i % 4) / 4), { sh: .4, blur: 10, rimA: .6 });
  label(g, 'WHAT AI EARNS', sx - 150, sy - 300, { size: 24 });
  const path = [[sx, sy + 20], [sx, 80], [1100, 80], [1100, 300]];
  g.save(); g.strokeStyle = rgba('#07061a', .55); g.lineWidth = 34; g.lineJoin = 'round'; g.beginPath(); path.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.restore();
  // the gate across the channel: a paper slab with "IF" cut into it (stamped big on "biggest")
  const gk = k(51.6, 52.1, t, expoO), op = k(55.6, 56.5, t, expoIO);
  const gx = 1300, gy = 80;
  const gin = k(50.7, 51.4, t, expoO); g.save(); g.globalAlpha = gin; g.translate(gx, gy - op * 150 + (1 - gin) * 120);
  card(g, rr(-70, -110, 140, 220, 10), '#f3e6cf', { sh: .55, blur: 22, rimA: .7 });
  serif(g, 'IF', 0, 46, 130 * mix(1.5, 1, gk), '#c0522a', gk);
  g.restore();
  // "let's say it does": the gate lifts, amber flows along the channel to you
  const fl = k(55.9, 57.3, t, (x) => x);
  const flow = []; const L = [[sx, sy + 20], [sx, 80], [1100, 80], [1100, 300]];
  const segs = [L[1][1] - L[0][1], L[1][0] - L[2][0], L[3][1] - L[2][1]], tot = segs.reduce((a, b) => a + b);
  let rem = (gk > 0 ? .45 : .45) * tot * (fl > 0 ? 1 : 1);   // the flow first stands still behind the gate (up to the gate)
  const upto = mix(segs[0] + (sx - gx) - 70, tot, fl);
  rem = upto; flow.push(L[0]);
  for (let i = 0; i < 3 && rem > 0; i++) { const d = Math.min(rem, segs[i]), a = L[i], b = L[i + 1], u = d / segs[i]; flow.push([mix(a[0], b[0], u), mix(a[1], b[1], u)]); rem -= d; }
  amberLine(g, flow, { w: 10, glow: 34 });
  // you
  const glow = k(56.8, 57.4, t);
  g.save(); g.translate(1100, 370);
  card(g, (q) => { q.beginPath(); q.arc(0, -28, 16, 0, 7); q.moveTo(-30, 40); q.quadraticCurveTo(-30, -6, 0, -6); q.quadraticCurveTo(30, -6, 30, 40); q.closePath(); }, mixHex(AMBER, '#ffe6b8', glow), { sh: .5, blur: 12, rimA: .7 });
  g.restore(); label(g, 'YOU', 1150, 400, { size: 24 });
  if (glow > 0) screenGlow(g, 1100, 360, 160, '#ffcf8f', .6 * glow);
  // the timeline stays below, dimmed
  g.globalAlpha = .5; amberLine(g, [[160, TL_Y], [1700, TL_Y]]); g.globalAlpha = 1;
}

// ---------------------------------------------------------------- S8 · two endings of work (57.4–72.5)
// "AI won't end work. It will end having to work. Those sound alike. They're not. One of them scares almost everyone.
//  The other could change what a human life is for."  → the right card opens like a window onto the dawn
function sceneWords(g, t, dawn) {
  const sp = k(63.4, 64.4, t, expoIO), win = k(67.2, 71.5, t, (x) => x * x * (3 - 2 * x));
  const cam = { fx: 1380, fy: 520, x: wob(t).x, y: wob(t).y, z: 1 + .03 * k(57.4, 67, t) + 4.3 * win * win };
  boardSky(g, t, { sunA: 0 });
  setView(g, cam, .3); grooves(g, -400, W + 400, -200, 1300, 150, .7 * (1 - k(57.4, 58.4, t)));
  // the amber flow from "you" becomes a horizontal rule under the words
  setView(g, cam, 1);
  const enter = k(57.4, 58.4, t, expoO);
  // left card: "work" (its end scares) · right card: "having to work" (its end frees)
  const L = { x: mix(560, 400, sp), y: 330 }, R = { x: mix(560, 1060, sp), y: 330 };
  const cw = 460, chh = 360;
  // right card (drawn first when merged, it carries "having to")
  const ht = k(60.6, 61.2, t, expoO);
  if (sp > 0 || ht > 0) {
    g.save(); g.globalAlpha = sp > 0 ? 1 : 0;
    const scare = 0;
    card(g, rr(R.x, R.y, cw, chh, 10), '#f3e6cf', { sh: .55, blur: 26, rimA: .7 });
    if (win > 0 && dawn) {   // the window: the dawn landscape (hook frame) seen through a hole cut in the card
      g.save(); g.beginPath(); g.roundRect(R.x + 30, R.y + 30, cw - 60, chh - 60, 6); g.clip();
      g.globalAlpha = k(67.2, 68.4, t); const dz = 1 + .04 * k(67, 72.5, t, (x) => x); g.drawImage(dawn, R.x + 30 - (dz - 1) * 200, R.y + 30 - (dz - 1) * 150, (cw - 60) * dz, (chh - 60) * dz); g.restore();
    }
    const ta = 1 - k(67.2, 68.0, t);
    if (ta > 0) { serif(g, 'having to', R.x + cw / 2, R.y + 150, 64, '#c0522a', ta); serif(g, 'work', R.x + cw / 2, R.y + 250, 110, '#1d1b3a', ta); }
    g.restore();
  }
  // left card
  const lc = enter * (1 - .55 * k(64.6, 65.6, t));   // "scares almost everyone": it cools and dims
  g.save(); g.globalAlpha = enter * (1 - win);
  card(g, rr(L.x, L.y + (1 - enter) * 60, cw, chh, 10), mixHex('#f3e6cf', '#6c7290', k(64.6, 65.6, t)), { sh: .55, blur: 26, rimA: .7 });
  if (sp <= 0 && ht > 0) serif(g, 'having to', L.x + cw / 2, L.y + 150 - (1 - ht) * 30, 64, '#c0522a', ht);
  serif(g, 'work', L.x + cw / 2, L.y + 250 + (1 - enter) * 60, 110, mixHex('#1d1b3a', '#2b2d48', k(64.6, 65.6, t)), lc / Math.max(.01, enter) || 0);
  g.restore();
  // captions under the cards
  wipeText(g, 'AI ENDS IT? SCARY', L.x, L.y + chh + 56, k(64.7, 65.3, t) * (1 - win), { size: 20, col: SEC, w: 500 });
  wipeText(g, 'AI ENDS IT? FREEDOM', R.x, R.y + chh + 56, k(67.3, 67.9, t) * (1 - win * 1.5), { size: 20, col: HOT, w: 500 });
  // "AI won't end work": a stroke crosses the word for a moment, then lifts away
  const x1 = k(58.5, 58.9, t, expoO), x2 = k(59.6, 60.0, t, expoIO);
  if (x1 > 0 && x2 < 1) { const yy = L.y + 220; amberLine(g, [[L.x + 90 + 280 * x2, yy], [L.x + 90 + 280 * x1, yy]], { w: 6, a: 1 - x2 }); }
  // the rule (carrier) under both cards
  amberLine(g, [[mix(1100, 300, enter), 780], [mix(1100, 1620, enter), 780]], { a: 1 - win });
}

// ---------------------------------------------------------------- assembly
export async function build() {
  const hook = await buildHook();
  const clipFrames = await Promise.all(Array.from({ length: 75 }, (_, i) => loadImage(`/mnt/project-files/scenario/stil-papier/minute1/clips/M/f${String(i + 1).padStart(5, '0')}.jpg`)));
  // the dawn seen through the final window: a still of the hook's paper hills at 2 s, kept warm
  const [dawn, dg] = canvas(W, H); dg.drawImage(hook.frame(2.0), 0, 0);
  const [c, g] = canvas(W, H);
  const clipAt = (t) => clipFrames[clamp(Math.floor((t - 32.32) * 30), 0, 74)];
  return {
    duration: DUR,
    frame(t) {
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      if (t < 12.0) { const f = hook.frame(t); g.drawImage(f, 0, 0); return c; }
      if (t < 18.15) sceneWeek(g, t);
      else if (t < 25.5) sceneWall(g, t);
      else if (t < 32.0) sceneStage(g, t, clipAt(32.32));
      else if (t < 35.3) sceneClip(g, t, clipAt(t));
      else if (t < 50.6) sceneTimeline(g, t);
      else if (t < 57.4) sceneIf(g, t);
      else sceneWords(g, t, dawn);
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      finish(g, t, { vig: .38 });
      return c;
    },
  };
}
