// "In 2021, Daniel Kokotajlo, then a young researcher, wrote down what he thought the world would look like in 2026."
// Night, rain and fog in San Francisco. From the street we look up at a Victorian bay window: one warm lamp,
// a young man at his desk writing in a notebook. He pauses, looks out into the rain, writes again, turns the page.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, hash, rng, grainFill, lin, rad, rgba, light, cone, stamp, label, createCanvas, clamp } = L;

const T0 = 21.4, T1 = 30.2;

function roundRect(ctx, x, y, w, h, r) { ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function poly(pts) { return c => { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.closePath(); }; }

// static artwork is painted once into offscreen canvases (at 1.25x so the push-in stays crisp)
const CACHE = {};
function cached(ctx, key, x0, y0, x1, y1, fn) {
  const S = 1.25;
  if (!CACHE[key]) { const cv = createCanvas(Math.ceil((x1 - x0) * S), Math.ceil((y1 - y0) * S)), c = cv.getContext('2d'); c.scale(S, S); c.translate(-x0, -y0); fn(c); CACHE[key] = cv; }
  ctx.drawImage(CACHE[key], x0, y0, x1 - x0, y1 - y0);
}

// ---------- geometry of the bay window (world = screen at z = 1) ----------
const WIN = { x0: 700, x1: 1060, y0: 300, y1: 700, tr: 384 };          // centre pane, transom bar at y = tr
const SIDE_L = [[590, 318], [700, 300], [700, 700], [590, 690]];        // angled side panes (foreshortened)
const SIDE_R = [[1060, 300], [1170, 318], [1170, 690], [1060, 700]];
const LAMP = { x: 738, y: 492 };                                         // bulb under the shade
const DESK_Y = 572;                                                      // desk top (front edge)
const FOCUS = [880, 500];

// ---------- the city behind: sky, neighbouring houses, a fire escape ----------
function backdrop(c) {
  grainFill(c, k => k.rect(-300, -300, W + 600, H + 600), lin(c, 0, -300, 0, H, [[0, '#05071a'], [0.45, '#0e1032'], [0.75, '#1c1946'], [1, '#0c0b26']]), 0.5);
  // distant hills and city glow low in the fog
  grainFill(c, k => { k.moveTo(-300, 560); k.bezierCurveTo(100, 470, 500, 520, 800, 490); k.bezierCurveTo(1200, 450, 1600, 520, W + 300, 480); k.lineTo(W + 300, H + 300); k.lineTo(-300, H + 300); k.closePath(); },
    lin(c, 0, 450, 0, 700, [[0, '#15143a'], [1, '#0b0a22']]), 0.5);
  // left neighbour: tall flat-front building with a fire escape
  grainFill(c, k => k.rect(-300, 90, 790, H + 300), lin(c, 0, 90, 0, H, [[0, '#121032'], [1, '#08081a']]), 0.55);
  c.fillStyle = '#0c0b20'; c.fillRect(-300, 76, 800, 22);
  for (const [x, y] of [[60, 190], [270, 190], [60, 430], [270, 430], [60, 670], [270, 670]]) {
    grainFill(c, k => k.rect(x, y, 120, 170), lin(c, 0, y, 0, y + 170, [[0, '#12112e'], [1, '#1b1a40']]), 0.4);
    c.fillStyle = '#0a0a1c'; c.fillRect(x - 8, y + 168, 136, 10); c.fillRect(x + 58, y, 4, 170);
  }
  // fire escape: platforms, railings, ladders
  c.strokeStyle = '#05050f'; c.fillStyle = '#05050f';
  for (const py of [370, 610, 850]) {
    c.fillRect(20, py, 400, 8);
    c.lineWidth = 3; c.beginPath(); c.moveTo(20, py - 70); c.lineTo(420, py - 70); c.stroke();
    c.lineWidth = 2; for (let x = 20; x <= 420; x += 16) { c.beginPath(); c.moveTo(x, py - 70); c.lineTo(x, py); c.stroke(); }
    for (const bx of [40, 400]) { c.beginPath(); c.moveTo(bx, py + 8); c.lineTo(bx + (bx < 200 ? 30 : -30), py + 50); c.stroke(); }
  }
  c.lineWidth = 4;
  for (const [a, b] of [[370, 610], [610, 850]]) {
    c.beginPath(); c.moveTo(380, a + 8); c.lineTo(200, b); c.moveTo(400, a + 8); c.lineTo(220, b); c.stroke();
    c.lineWidth = 2; for (let k = 1; k < 12; k++) { const u = k / 12; c.beginPath(); c.moveTo(lerp(380, 200, u), lerp(a + 8, b, u)); c.lineTo(lerp(400, 220, u), lerp(a + 8, b, u)); c.stroke(); } c.lineWidth = 4;
  }
  // a faint cool edge where the window light catches the railings
  c.strokeStyle = 'rgba(255,179,92,0.10)'; c.lineWidth = 1.5;
  for (const py of [370, 610]) { c.beginPath(); c.moveTo(300, py - 71); c.lineTo(420, py - 71); c.stroke(); }
  // right neighbour: gabled Victorian, dark, with a little bay of its own
  grainFill(c, k => { k.moveTo(1330, H + 300); k.lineTo(1330, 210); k.lineTo(1660, 40); k.lineTo(1990, 210); k.lineTo(1990, H + 300); k.closePath(); },
    lin(c, 1330, 0, 1990, 0, [[0, '#14123a'], [1, '#0a0a20']]), 0.55);
  c.strokeStyle = '#0a0a1e'; c.lineWidth = 10; c.beginPath(); c.moveTo(1320, 216); c.lineTo(1660, 36); c.lineTo(2000, 216); c.stroke();
  for (const [x, y] of [[1480, 250], [1720, 250]]) {
    grainFill(c, k => roundRect(k, x, y, 110, 180, 4), lin(c, 0, y, 0, y + 180, [[0, '#121130'], [1, '#1a1840']]), 0.4);
    c.fillStyle = '#0a0a1c'; c.fillRect(x - 10, y - 14, 130, 14); c.fillRect(x - 6, y + 180, 122, 8);
  }
  // horizontal siding lines
  c.fillStyle = 'rgba(5,5,18,0.35)'; for (let y = 470; y < H; y += 22) c.fillRect(1330, y, 660, 2);
}

// ---------- the main house facade with the bay window (pane areas left transparent) ----------
function facade(c) {
  const holes = k => { k.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); poly(SIDE_L)(k); poly(SIDE_R)(k); };
  // wall, siding and the bay box
  c.save();
  c.beginPath(); c.rect(470, -100, 880, H + 300); holes(c); c.clip('evenodd');
  grainFill(c, k => k.rect(470, -100, 880, H + 300), lin(c, 0, -100, 0, H, [[0, '#0c0a24'], [0.35, '#16143c'], [0.65, '#1c1948'], [1, '#0c0b22']]), 0.55);
  c.fillStyle = 'rgba(6,6,20,0.32)'; for (let y = 10; y < H + 100; y += 20) c.fillRect(470, y, 880, 2);
  // bay box: panels above and below the windows
  grainFill(c, k => { k.moveTo(560, 230); k.lineTo(1200, 230); k.lineTo(1200, 300); k.lineTo(560, 300); k.closePath(); }, lin(c, 0, 230, 0, 300, [[0, '#262058'], [1, '#1c1844']]), 0.5);
  grainFill(c, k => { k.moveTo(570, 690); k.lineTo(1190, 690); k.lineTo(1180, 810); k.lineTo(580, 810); k.closePath(); }, lin(c, 0, 690, 0, 810, [[0, '#2a2460'], [1, '#141236']]), 0.5);
  for (const [x0, x1] of [[610, 690], [720, 1040], [1070, 1150]]) { c.strokeStyle = 'rgba(8,8,24,0.55)'; c.lineWidth = 3; c.strokeRect(x0, 726, x1 - x0, 60); }
  c.restore();
  // cornice with brackets
  grainFill(c, k => k.rect(540, 196, 680, 36), lin(c, 0, 196, 0, 232, [[0, '#2c2862'], [1, '#1a1742']]), 0.5);
  c.fillStyle = '#121032'; for (let x = 556; x < 1210; x += 46) { c.beginPath(); c.moveTo(x, 232); c.lineTo(x + 18, 232); c.lineTo(x + 12, 254); c.lineTo(x + 4, 254); c.closePath(); c.fill(); }
  c.fillStyle = 'rgba(200,190,255,0.08)'; c.fillRect(540, 196, 680, 3);
  // roof gable of the house, cut by the top of frame
  grainFill(c, k => { k.moveTo(440, 160); k.lineTo(910, -120); k.lineTo(1380, 160); k.lineTo(1380, 176); k.lineTo(440, 176); k.closePath(); }, lin(c, 0, -120, 0, 176, [[0, '#0c0b24'], [1, '#1d1a44']]), 0.55);
  c.strokeStyle = '#0a0a1e'; c.lineWidth = 12; c.beginPath(); c.moveTo(430, 170); c.lineTo(910, -126); c.lineTo(1390, 170); c.stroke();
  // window frames and sashes
  const frame = (pts, w) => { c.strokeStyle = '#342c66'; c.lineWidth = w; c.lineJoin = 'miter'; c.beginPath(); poly(pts)(c); c.stroke(); };
  frame([[WIN.x0, WIN.y0], [WIN.x1, WIN.y0], [WIN.x1, WIN.y1], [WIN.x0, WIN.y1]], 16); frame(SIDE_L, 14); frame(SIDE_R, 14);
  c.fillStyle = '#342c66'; c.fillRect(WIN.x0, WIN.tr - 6, WIN.x1 - WIN.x0, 12);
  c.beginPath(); c.moveTo(590, 384); c.lineTo(700, 378); c.lineTo(700, 388); c.lineTo(590, 394); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(1060, 378); c.lineTo(1170, 384); c.lineTo(1170, 394); c.lineTo(1060, 388); c.closePath(); c.fill();
  // warm edges on the frames facing the lamp
  c.fillStyle = 'rgba(255,179,92,0.30)'; c.fillRect(WIN.x0 + 7, WIN.y0 + 8, 2, WIN.y1 - WIN.y0 - 16); c.fillRect(WIN.x0 + 8, WIN.tr + 6, WIN.x1 - WIN.x0 - 16, 2);
  // sill
  grainFill(c, k => { k.moveTo(560, 700); k.lineTo(1200, 700); k.lineTo(1210, 716); k.lineTo(550, 716); k.closePath(); }, '#4a4282', 0.4);
  c.fillStyle = 'rgba(255,179,92,0.35)'; c.fillRect(600, 700, 560, 2);
  // the entry stairs and a dark street level below
  grainFill(c, k => k.rect(470, 860, 880, 400), lin(c, 0, 860, 0, H, [[0, '#120f30'], [1, '#07071a']]), 0.5);
}

// ---------- the room seen through the glass ----------
function room(c) {
  // back wall in lamp light
  grainFill(c, k => k.rect(560, 280, 640, 440), rad(c, LAMP.x + 30, LAMP.y - 30, 20, 470, [[0, '#c27a40'], [0.3, '#8a4a28'], [0.7, '#43222a'], [1, '#22142a']]), 0.45);
  // bookshelf on the right wall section
  grainFill(c, k => k.rect(1010, 330, 170, 360), '#2a1720', 0.5);
  const r = rng(12);
  for (let sh = 0; sh < 4; sh++) {
    const y = 420 + sh * 80; c.fillStyle = '#1a0e14'; c.fillRect(1010, y, 170, 8);
    let x = 1016; while (x < 1170) { const w = 8 + r() * 14, h = 40 + r() * 26; c.fillStyle = ['#5a2e1c', '#3e2230', '#6e3a20', '#2e1a2a'][Math.floor(r() * 4)]; c.fillRect(x, y - h, w, h); x += w + 2; }
  }
  // a framed picture and a pinned sheet above the desk
  grainFill(c, k => k.rect(840, 340, 86, 64), '#3a2018', 0.4); grainFill(c, k => k.rect(848, 348, 70, 48), lin(c, 0, 348, 0, 396, [[0, '#d39a5a'], [1, '#7a4a2a']]), 0.4);
  grainFill(c, k => { k.moveTo(950, 352); k.lineTo(990, 348); k.lineTo(994, 400); k.lineTo(954, 404); k.closePath(); }, '#e8c08a', 0.3);
  // sheer curtains in the side panes
  grainFill(c, k => { k.moveTo(590, 300); k.lineTo(680, 300); k.bezierCurveTo(660, 450, 690, 600, 670, 700); k.lineTo(590, 700); k.closePath(); }, lin(c, 590, 0, 680, 0, [[0, 'rgba(255,200,140,0.55)'], [1, 'rgba(255,200,140,0.18)']]), 0.3);
  grainFill(c, k => { k.moveTo(1170, 300); k.lineTo(1085, 300); k.bezierCurveTo(1100, 450, 1075, 600, 1092, 700); k.lineTo(1170, 700); k.closePath(); }, lin(c, 1170, 0, 1085, 0, [[0, 'rgba(160,110,90,0.55)'], [1, 'rgba(160,110,90,0.18)']]), 0.3);
  // desk
  grainFill(c, k => { k.moveTo(600, 540); k.lineTo(990, 540); k.lineTo(1000, DESK_Y); k.lineTo(590, DESK_Y); k.closePath(); }, lin(c, 0, 540, 0, DESK_Y, [[0, '#a8622e'], [1, '#6a3518']]), 0.4);
  grainFill(c, k => k.rect(590, DESK_Y, 410, 140), lin(c, 0, DESK_Y, 0, 700, [[0, '#4a2214'], [1, '#22100c']]), 0.5);
  // lamp body: base, arm, shade
  c.fillStyle = '#2a140c'; c.beginPath(); c.ellipse(LAMP.x, 552, 26, 6, 0, 0, 7); c.fill();
  c.strokeStyle = '#2a140c'; c.lineWidth = 5; c.beginPath(); c.moveTo(LAMP.x, 552); c.lineTo(LAMP.x - 8, 470); c.lineTo(LAMP.x + 6, 452); c.stroke();
  grainFill(c, k => { k.moveTo(LAMP.x - 16, 446); k.lineTo(LAMP.x + 30, 446); k.lineTo(LAMP.x + 46, 490); k.lineTo(LAMP.x - 30, 490); k.closePath(); }, lin(c, 0, 446, 0, 490, [[0, '#3a1e10'], [1, '#6a3a18']]), 0.4);
  // stack of books and a mug on the desk
  for (let i = 0; i < 3; i++) grainFill(c, k => k.rect(640 + i * 2, 536 - i * 11, 50 - i * 4, 11), ['#5a2a3a', '#2e2a5a', '#7a4a20'][i], 0.4);
  grainFill(c, k => { k.moveTo(968, 516); k.lineTo(990, 516); k.lineTo(988, 546); k.lineTo(970, 546); k.closePath(); }, lin(c, 968, 0, 990, 0, [[0, '#e0a060'], [1, '#6a3a20']]), 0.4);
  // chair back (behind the figure)
  grainFill(c, k => { k.moveTo(1084, 480); k.lineTo(1100, 480); k.lineTo(1098, 700); k.lineTo(1082, 700); k.closePath(); }, '#1e0e10', 0.4);
}

// ---------- notebook, handwriting and the page that turns ----------
const NB = { x: 850, y: 548, w: 82, d: 22 };   // spine centre on the desk, page width, depth (foreshortened)
const LINES = (() => { const r = rng(5); return Array.from({ length: 7 }, (_, i) => ({ y: i, len: 0.55 + r() * 0.4 })); })();
// the notebook lies open with its spine running away from us; DV is the depth direction on screen
const DV = [-26, 22];
const nbP = (u, v) => [NB.x + u - DV[0] * (0.5 - v), NB.y - DV[1] * (0.5 - v)];    // u along the pages, v 0 (back) .. 1 (front)
function notebook(c, t, turn) {
  const { w } = NB;
  const pg = (u0, u1) => poly([nbP(u0, 0), nbP(u1, 0), nbP(u1, 1), nbP(u0, 1)]);
  grainFill(c, pg(-w - 5, w + 5), '#3a1a10', 0.3);                                                         // cover
  grainFill(c, pg(-w, 0), lin(c, NB.x - w, 0, NB.x, 0, [[0, '#f6dfb4'], [1, '#d4b080']]), 0.25);
  grainFill(c, pg(0, w), lin(c, NB.x, 0, NB.x + w, 0, [[0, '#caa676'], [1, '#f3d8aa']]), 0.25);
  // handwriting: the left page is full, the right page fills line by line as he writes
  const wrote = writeProgress(t);
  c.strokeStyle = 'rgba(40,24,30,0.7)'; c.lineWidth = 1.1;
  const page = (u0, n, part) => {
    for (let i = 0; i < n; i++) {
      const v = (i + 0.9) / 7.8, len = LINES[i].len * (w - 18) * (i === n - 1 ? part : 1);
      c.beginPath(); for (let u = 0; u <= len; u += 2.5) { const p = nbP(u0 + 9 + u, v); c.lineTo(p[0], p[1] + Math.sin(u * 0.9 + i) * 0.8); } c.stroke();
    }
  };
  page(-w, 7, 1);
  if (turn < 0.5) { const n = Math.min(7, Math.floor(wrote.lines) + 1); page(0, n, wrote.lines - Math.floor(wrote.lines)); }
  else if (wrote.lines2 > 0) { const n2 = Math.min(7, Math.floor(wrote.lines2) + 1); page(0, n2, wrote.lines2 - Math.floor(wrote.lines2)); }
}
// the turning page: a sheet hinged on the spine that rises, stands, and falls over to the left
function pageTurn(c, turn) {
  if (turn <= 0 || turn >= 1) return;
  const { w } = NB, a = Math.PI * ease(turn), bend = Math.sin(a) * 10;
  const tip = v => { const b = nbP(0, v); return [b[0] + Math.cos(a) * w, b[1] - Math.sin(a) * w * 0.62]; };
  const mid = v => { const b = nbP(0, v); return [b[0] + Math.cos(a) * w * 0.5 + bend, b[1] - Math.sin(a) * w * 0.36 - bend * 0.4]; };
  const s0 = nbP(0, 0), s1 = nbP(0, 1), t0 = tip(0), t1 = tip(1), m0 = mid(0), m1 = mid(1);
  grainFill(c, k => { k.moveTo(s0[0], s0[1]); k.quadraticCurveTo(m0[0], m0[1], t0[0], t0[1]); k.lineTo(t1[0], t1[1]); k.quadraticCurveTo(m1[0], m1[1], s1[0], s1[1]); k.closePath(); },
    lin(c, s0[0], s0[1], t1[0], t1[1], [[0, '#d8b682'], [1, '#fbe8c4']]), 0.2);
  c.strokeStyle = 'rgba(90,50,30,0.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(t0[0], t0[1]); c.lineTo(t1[0], t1[1]); c.stroke();
  light(c, (s0[0] + t1[0]) / 2, (s0[1] + t1[1]) / 2, 70, '#ffe0b0', 0.22 * Math.sin(Math.PI * turn));
}

// ---------- timeline of what he does ----------
const PAUSE = [24.0, 25.45];       // stops writing, sits up, looks out at the rain
const TURN = [26.55, 27.45];       // turns the page
function writing(t) {             // 0..1: how much the hand is writing (vs resting)
  return (1 - ramp(t, PAUSE[0], PAUSE[0] + 0.35) * (1 - ramp(t, PAUSE[1] - 0.2, PAUSE[1] + 0.2))) * (1 - ramp(t, TURN[0] - 0.25, TURN[0]) * (1 - ramp(t, TURN[1], TURN[1] + 0.3)));
}
function writeProgress(t) {
  // integrate writing speed (piecewise: cheap closed form via sampled sum, deterministic)
  let s = 0; for (let u = T0 - 0.6; u < Math.min(t, TURN[0]); u += 0.05) s += 0.05 * writing(u);
  let s2 = 0; for (let u = TURN[1]; u < t; u += 0.05) s2 += 0.05 * writing(u);
  return { lines: 1.6 + s * 0.85, lines2: s2 * 0.9 };
}
const look = t => ramp(t, PAUSE[0] + 0.15, PAUSE[0] + 0.9) * (1 - ramp(t, PAUSE[1] - 0.45, PAUSE[1] + 0.2));

// two-bone IK: elbow position for shoulder S, hand Hd, bones a and b, bending toward side s
function ik(S, Hd, a, b, s = 1) {
  const dx = Hd[0] - S[0], dy = Hd[1] - S[1], d = clamp(Math.hypot(dx, dy), 1, a + b - 0.01);
  const ang = Math.atan2(dy, dx), cosA = (a * a + d * d - b * b) / (2 * a * d), A = Math.acos(clamp(cosA, -1, 1));
  return [S[0] + Math.cos(ang + s * A) * a, S[1] + Math.sin(ang + s * A) * a];
}
function limb(c, p0, p1, w0, w1, fill) {
  const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]), nx = -Math.sin(ang), ny = Math.cos(ang);
  c.fillStyle = fill; c.beginPath();
  c.moveTo(p0[0] + nx * w0, p0[1] + ny * w0); c.lineTo(p1[0] + nx * w1, p1[1] + ny * w1);
  c.arc(p1[0], p1[1], w1, ang + Math.PI / 2, ang - Math.PI / 2, true);
  c.lineTo(p0[0] - nx * w0, p0[1] - ny * w0); c.arc(p0[0], p0[1], w0, ang - Math.PI / 2, ang + Math.PI / 2, true); c.closePath(); c.fill();
}

// the young researcher in profile, facing the lamp (left); built from joints
function person(c, t) {
  const br = Math.sin(t * 1.6), lk = look(t), wr = writing(t), tp = clamp((t - TURN[0]) / (TURN[1] - TURN[0]));
  const hip = [1046, 646];
  const lean = lerp(0.42, 0.22, lk) + 0.015 * br;                       // leans over the notebook, sits up to look out
  const tl = 150 + br * 1.5;
  const sh = [hip[0] - Math.sin(lean) * tl, hip[1] - Math.cos(lean) * tl];
  const neck = [sh[0] - 8, sh[1] - 14];
  // head: bowed toward the page, then lifted and turned toward the window (the viewer)
  const hb = lerp(-0.38, 0.04, lk) + 0.03 * Math.sin(t * 0.7);
  const head = [neck[0] - 18 - 16 * (1 - lk), neck[1] - 38 + 12 * (1 - lk)];
  // writing hand: tiny fast loops while writing, slow travel along the line, lifts in the pause
  const wig = wr * (Math.sin(t * 31) * 2.2 + Math.sin(t * 17.3) * 1.4);
  const along = wr * (((t * 0.55) % 1) * 22 - 11);
  const hand = [NB.x + 40 + along + wig + 34 * lk, NB.y - 4 + wr * Math.cos(t * 29) * 1.3 - 10 * lk - 6 * (1 - wr) * (1 - lk)];
  // far hand: holds the notebook, lifts the page during the turn
  const farHand = tp > 0 && tp < 1
    ? [NB.x + Math.cos(Math.PI * ease(tp)) * NB.w * 0.9 - 6, NB.y - Math.sin(Math.PI * ease(tp)) * NB.w * 0.56]
    : [NB.x + 4 + 3 * Math.sin(t * 0.5) + 30 * lk, NB.y - 1 + 4 * lk];
  // the arms hang from the shoulder joint a little below the top of the shoulder (not from the base of the neck)
  const ash = [sh[0] + Math.sin(lean) * 18 - Math.cos(lean) * 4, sh[1] + Math.cos(lean) * 18 + Math.sin(lean) * 4];
  const shoulderFar = [ash[0] - 14, ash[1] + 4];
  const skin = '#c9773a', shirt = lin(c, sh[0] - 70, 0, hip[0] + 30, 0, [[0, '#d98a44'], [0.35, '#8a4422'], [1, '#2a1418']]);

  // far arm (behind the body), darker
  const elF = ik(shoulderFar, farHand, 74, 70, -1);
  limb(c, shoulderFar, elF, 13, 11, '#3a1810'); limb(c, elF, farHand, 11, 8, '#3a1810');
  c.fillStyle = '#9a4c22'; c.beginPath(); c.ellipse(farHand[0], farHand[1], 9, 6, 0, 0, 7); c.fill();
  // torso, drawn in the spine's own frame (y up the spine) and leaned toward the desk
  const body = k => {
    k.moveTo(40, 40); k.bezierCurveTo(46, -30, 44, -100, 30, -tl + 12);            // lower and upper back
    k.bezierCurveTo(24, -tl - 6, 8, -tl - 14, -8, -tl - 12);                        // round of the shoulder to the collar
    k.bezierCurveTo(-22, -tl - 8, -34, -tl + 20, -34, -tl + 50);                    // chest
    k.bezierCurveTo(-34, -60, -30, -10, -40, 40); k.closePath();                    // belly to lap
  };
  c.save(); c.translate(hip[0], hip[1]); c.rotate(-lean);
  c.save(); c.translate(-6, -2); grainFill(c, body, '#ffc078', 0); c.restore();     // warm rim from the lamp along his front
  grainFill(c, body, lin(c, -36, 0, 46, 0, [[0, '#8a4222'], [0.3, '#4a2018'], [1, '#1a0a12']]), 0.4);
  c.strokeStyle = 'rgba(30,10,10,0.45)'; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath(); c.moveTo(18, -tl + 30); c.bezierCurveTo(26, -90, 30, -40, 26, 20); c.stroke();               // fold along the back
  c.restore();
  // neck and head
  limb(c, [sh[0] + 2, sh[1] - 6], [neck[0] - 6, neck[1] - 14], 11, 10, '#5a2614');
  c.save(); c.translate(head[0], head[1]); c.rotate(hb);
  const hd = k => { k.moveTo(-28, -10); k.bezierCurveTo(-30, -38, -6, -46, 10, -42); k.bezierCurveTo(30, -36, 34, -10, 30, 10);
    k.bezierCurveTo(26, 30, 12, 40, -6, 40); k.bezierCurveTo(-20, 40, -28, 30, -30, 14); k.lineTo(-32, 4); k.closePath(); };
  c.save(); c.translate(-4, -1); grainFill(c, hd, '#ffc078', 0); c.restore();
  grainFill(c, hd, lin(c, -32, 0, 32, 0, [[0, '#c26a30'], [0.4, '#6a3018'], [1, '#2a100a']]), 0.4);
  // hair: a full dark cap over the crown and the back of the head with a short fringe; it slides back as he turns to us
  const hx = lerp(0, 14, lk);
  grainFill(c, k => { k.moveTo(-24 + hx, -24); k.bezierCurveTo(-26 + hx, -44, 2, -54, 18, -46); k.bezierCurveTo(36, -38, 40, -8, 34, 14);
    k.bezierCurveTo(32, 26, 24, 34, 16, 36); k.bezierCurveTo(20, 18, 16, 0, 6, -10); k.bezierCurveTo(-4, -18, -14, -16, -24 + hx, -24); k.closePath(); },
    lin(c, -20, -50, 36, 30, [[0, '#3e1c10'], [1, '#140806']]), 0.5);
  grainFill(c, k => k.ellipse(lerp(8, 18, lk), 6, 4.5, 8, 0.2, 0, 7), '#7a3a1c', 0.3);   // ear
  // when he looks out, the cool night through the glass catches his face
  if (lk > 0) { c.save(); c.beginPath(); hd(c); c.clip(); light(c, -18, 6, 40, C.lav, 0.35 * lk); c.restore(); }
  c.restore();
  // writing arm (near side): upper arm, forearm, hand with pen
  const el = ik(ash, hand, 72, 74, -1);
  limb(c, ash, el, 18.5, 13, lin(c, ash[0], ash[1], el[0], el[1], [[0, '#5a2818'], [1, '#3a1810']]));
  c.strokeStyle = 'rgba(255,192,120,0.55)'; c.lineWidth = 2; c.beginPath(); c.moveTo(ash[0] - 13, ash[1] + 6); c.lineTo(el[0] - 10, el[1] - 4); c.stroke();
  limb(c, el, hand, 13, 9, lin(c, el[0], 0, hand[0], 0, [[0, '#4a2014'], [1, '#a85628']]));
  c.fillStyle = skin; c.beginPath(); c.ellipse(hand[0] - 2, hand[1] - 2, 10, 7, -0.3, 0, 7); c.fill();
  c.strokeStyle = '#1a0c0a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(hand[0] - 6, hand[1] + 4); c.lineTo(hand[0] + 12, hand[1] - 18); c.stroke();
}

// ---------- weather: rain streaks, drops on the glass, fog ----------
const RAIN = (() => { const r = rng(21); return Array.from({ length: 260 }, () => ({ x: r() * 2400 - 240, ph: r(), sp: 0.9 + r() * 0.6, len: 18 + r() * 34, near: r() < 0.3 })); })();
const DROPS = (() => { const r = rng(44); return Array.from({ length: 16 }, () => ({ x: WIN.x0 + 10 + r() * (WIN.x1 - WIN.x0 - 20), y0: WIN.y0 + r() * 300, sp: 6 + r() * 30, ph: r() * 10, s: 1.5 + r() * 2 })); })();
const FOG = (() => { const r = rng(8); return Array.from({ length: 7 }, () => ({ x: r() * 2200 - 140, y: 520 + r() * 480, rx: 380 + r() * 400, sp: 8 + r() * 14 })); })();

function rain(c, t, near) {
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (const d of RAIN) {
    if (d.near !== near) continue;
    const fall = 1300 * d.sp * (near ? 1.4 : 1);
    const y = ((d.ph * 1400 + t * fall) % 1400) - 160, x = d.x - (y + 160) * 0.18;
    const dw = Math.hypot((x - FOCUS[0]) / 1.4, y - FOCUS[1]), warm = Math.exp(-(dw * dw) / (2 * 300 * 300));
    const a = (near ? 0.12 : 0.07) + 0.4 * warm;
    c.strokeStyle = warm > 0.25 ? rgba('#ffd0a0', a) : rgba('#b9b4e8', a);
    c.lineWidth = near ? 2 : 1.2; const ln = d.len * (near ? 1.6 : 1);
    c.beginPath(); c.moveTo(x, y); c.lineTo(x - ln * 0.18, y + ln); c.stroke();
  }
  c.restore();
}
function glass(c, t) {
  // drops sliding down the centre pane, catching the lamp
  c.save(); c.beginPath(); c.rect(WIN.x0 + 8, WIN.y0 + 8, WIN.x1 - WIN.x0 - 16, WIN.y1 - WIN.y0 - 16); c.clip();
  for (const d of DROPS) {
    const run = (Math.sin(t * 0.8 + d.ph) > 0.6 ? 1 : 0.15);
    const y = WIN.y0 + ((d.y0 - WIN.y0 + t * d.sp * run) % (WIN.y1 - WIN.y0));
    c.fillStyle = rgba('#ffe6c4', 0.26); c.beginPath(); c.ellipse(d.x, y, d.s, d.s * 1.3, 0, 0, 7); c.fill();
    c.strokeStyle = rgba('#ffe6c4', 0.12); c.lineWidth = d.s * 0.8; c.beginPath(); c.moveTo(d.x, y - 2); c.lineTo(d.x + Math.sin(d.ph) * 2, y - 40 * run - 6); c.stroke();
  }
  // a cool sheen sweeping the glass (reflected sky)
  c.fillStyle = lin(c, WIN.x0, WIN.y0, WIN.x1, WIN.y1, [[0, 'rgba(164,159,196,0.10)'], [0.4, 'rgba(164,159,196,0)'], [0.75, 'rgba(164,159,196,0.05)'], [1, 'rgba(164,159,196,0)']]);
  c.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
  c.restore();
}

function draw(ctx, t) {
  const k = sm((t - T0) / (T1 - T0));
  const z = lerp(1.0, 1.17, k);
  const dx = drift(t, 1, 4) * 6, dy = drift(t, 1, 7) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(FOCUS[0], FOCUS[1]); ctx.scale(lerp(1, z, par), lerp(1, z, par)); ctx.translate(-FOCUS[0] + dx * par, -FOCUS[1] + dy * par); fn(); ctx.restore(); };
  const lampA = 0.95 + 0.05 * Math.sin(t * 2.1) + 0.02 * Math.sin(t * 7.3);

  // sky, hills and the neighbours (behind, they move less)
  layer(0.6, () => {
    cached(ctx, 'back', -200, -160, W + 200, H + 160, backdrop);
    // a neighbour's screen flickering faintly behind a curtain
    light(ctx, 1535, 360, 90, C.cyan, 0.05 + 0.025 * Math.sin(t * 5.1) * Math.sin(t * 1.7) + 0.02 * (hash('tv', Math.floor(t * 4)) > 0.7));
    for (const f of FOG) { const x = ((f.x + t * f.sp) % 2400) - 240; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, f.y, 0, f.rx, [[0, 'rgba(120,110,190,0.10)'], [1, 'rgba(120,110,190,0)']]); ctx.fillRect(x - f.rx, f.y - f.rx, 2 * f.rx, 2 * f.rx); ctx.restore(); }
    rain(ctx, t, false);
  });
  // the house: the room inside first, then the facade with transparent panes on top
  layer(1, () => {
    ctx.save(); ctx.beginPath(); ctx.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); poly(SIDE_L)(ctx); poly(SIDE_R)(ctx); ctx.clip();
    cached(ctx, 'room', 560, 280, 1200, 720, room);
    // lamp light in the room
    light(ctx, LAMP.x + 20, LAMP.y + 10, 420, C.amber, 0.22 * lampA);
    cone(ctx, LAMP.x + 8, 490, 70, 260, 70, '#ffd9a0', 0.22 * lampA);
    const tp = clamp((t - TURN[0]) / (TURN[1] - TURN[0]));
    ctx.save(); notebook(ctx, t, tp); ctx.restore();
    light(ctx, NB.x, NB.y, 110, '#ffe6c0', 0.18 * lampA);
    const lk = look(t); ctx.save(); ctx.fillStyle = rad(ctx, 1080 - 20 * lk, 430, 0, 150, [[0, 'rgba(20,8,12,0.45)'], [1, 'rgba(20,8,12,0)']]); ctx.fillRect(900, 260, 360, 360); ctx.restore();   // his shadow on the wall
    person(ctx, t);
    pageTurn(ctx, tp);
    light(ctx, LAMP.x + 8, LAMP.y, 60, '#fff0d0', 0.9 * lampA);                  // the bulb: hero light
    light(ctx, LAMP.x + 8, LAMP.y + 6, 160, C.amber, 0.35 * lampA);
    ctx.restore();
    cached(ctx, 'facade', 420, -140, 1400, H + 160, facade);
    glass(ctx, t);
    // warm spill on the facade and sill, glow through the rain
    light(ctx, 880, 700, 360, C.amber, 0.12 * lampA);
    light(ctx, 880, 500, 560, C.amber, 0.05 * lampA);
  });
  // near rain and a low fog bank, strongest parallax
  layer(1.5, () => {
    rain(ctx, t, true);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, 0, 760, 0, H + 60, [[0, 'rgba(110,100,180,0)'], [1, `rgba(110,100,180,${0.16 + 0.03 * Math.sin(t * 0.6)})`]]); ctx.fillRect(-300, 760, W + 600, 400);
    ctx.restore();
  });
  // text: the year, then his name beside the window (never over him)
  stamp(ctx, t, 21.9, 30.0, '2021', 'Daniel Kokotajlo writes down 2026');
  label(ctx, t, 25.2, 30.0, 'Daniel Kokotajlo', 'forecaster · later at OpenAI', 1310, 560);
}

module.exports = { T0, T1, draw };
