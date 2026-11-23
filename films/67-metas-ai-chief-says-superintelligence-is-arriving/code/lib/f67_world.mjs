// Film 67 · THE NIGHT OF THE HEADLINE (the one world of the film) + the seam plates between the builder groups
// (owned by the lead; builders import, never edit — wishes go in the report).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it.
// Plates keep a slow push (CREEP 4 %/s from T0 − .5) and a slow truck right (TRUCK 30 px/s); the receiving side continues both.
//
//   Lead → B1 at T.G('The man is Alexandr Wang') (c01 → c02): plateWang   THUMBNAIL A AGAIN, CALMER. Home camera pushed a little: the
//            headline in the sky, Wang's X post header pinned under it, the paper tower dark behind the chalkboard, you small on the quay,
//            the checklist top right (five empty boxes). B1 slides the portrait print up out of the post header (avatar → portrait).
//   B1 → B2  at T.G("That leaves Wang's boldest") (c04 → c05): plateReferee   THE REFEREE WITH NO READER. The referee on his tall chair by
//            the ribbon, the gold card up; the ribbon runs to the horizon; nobody reads it; checklist: boxes 1–3 gold (2 with '?').
//            B2 (5.01) brings ALIEN MIND (the words of the hook) up behind box 4.
//   B2 → B3  at T.G('Not like a coup') (c07 → c08): plateHandover   HANDOVER. The word HANDOVER in gold hangs alone over your small
//            town; the town hall's windows light; checklist (1–3 gold, 4 OPEN, 5 half). B3 (8.01) glides into the town hall.
//
// THE WORLD (design px per depth card; cam3() = HOME = frame 0 = thumbnail A):
//   sky Z 40000 (night gradient, stars) · far hills Z 12000 · THE HEADLINE Z 6000 (Wang's sentence in giant gold letters, HEAD; the post
//   header pins under it at POST, drawn after the land so the roofs never cut it) · THE LAND Z 3600: ground line GY 840. Left → right: YOUR TOWN (houses, lit windows; the river with
//   THE OLD BRIDGE at x −1300; THE TOWN HALL at x −500) · THE QUAY where you stand (YOU, x 960) · THE CHALKBOARD (BOARD, x 2350: a huge
//   old blackboard full of chalk, one empty spot: RIEMANN HYPOTHESIS · UNSOLVED) · THE PAPER TOWER spot in front of it (TOWER) · THE
//   REFEREE'S CHAIR (CHAIR, x 3500) by THE RIBBON (RIB: from the board down to the ground, right to the horizon) · THE LABS (x 4600 Meta
//   Superintelligence Labs, a billboard frame on its roof; x 5350 the other lab, the file glowing in its window; a fence between) ·
//   the horizon (the ribbon thins out at x 9000). · foreground Z 1150: the quay rail (low, dark), only at home.
// landWorld(ctx, c, t, st) st (all optional):
//   head { …F.headline options } | false · headExtra(ctx, boxes) (on the headline card, after the letters: the post header, the file
//   leaving a letter) · post 0..1 (the X post header unrolled under the headline) · windows 0..1 (your street's windows turn gold, near
//   → far) · board { spot 0..1 (the empty spot's label), chalk 0..1, robot 0..1 (a chalk robot sketch; robotGone 0..1 crumbles it) } ·
//   tower { u, dark, pour, full } · ribbon { u, glow } (the ribbon, from the board's spot) · chair { referee 0..1, card 0..1 } · labs 0..1
//   (their windows) · billboard 0..1 (the headline as an ad over Meta's lab) · otherLab 0..1 (the file glowing in the competitor's window)
//   · hall 0..1 (the town hall's windows) · you { x, h, o } | false · author { x, h, o, laptop } (the mathematician, no name, no face)
//   · land(ctx) (land card, after everything) · fg(ctx) (Z 1150)
import * as E from './f10_editorial.mjs';
import * as F from './f67_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, prng } = E;
const { GOLD, COOL, LAMP, PAPER, CREAM, F0 } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 30;
export const trk = (k) => TRUCK * (k - 1) / CREEP;

export const Z_SKY = 40000, Z_FAR = 12000, Z_HEAD = 6000, Z_LAND = 3600, Z_FG = 1150, GY = 840;
export const HEAD = { x: 150, y: 330, w: 1620 };              // the headline on its card (line 1 baseline y; line 2 below)
export const POST = { x: 560, y: 470, w: 800 };               // where the post header pins under the headline (headline card px)
export const YOU = { x: 960, y: GY, h: 66 };
export const BOARD = { x: 2350, y: GY - 80, w: 900, h: 500, spot: { x: 2470, y: GY - 360, w: 250, h: 150 } };   // y = bottom edge of the board
export const TOWER = { x: 2160, w: 170 };
export const CHAIR = { x: 3500, h: 250 };
export const RIB = [[2470, GY - 300], [2620, GY - 60], [2900, GY - 8], [3600, GY + 14], [5000, GY + 4], [7000, GY - 12], [9200, GY - 40]];
export const LABS = { meta: 4600, other: 5350, fence: 4980 };
export const HALL = { x: -500 }, BRIDGE = { x: -1300 };
// cameras (s = magnification against home; 1 = home distance)
export const HOME = () => E.cam3();
export const landCam = (u, v, s = 1, sx = W / 2, sy = H / 2) => E.aim(Z_LAND, u, v, s, sx, sy);
export const BOARD_CAM = (k = 1, tr = 0) => E.aim(Z_LAND, BOARD.x - 40 + tr, GY - 280, 1.6 * k);
export const REFEREE_CAM = (k = 1, tr = 0) => E.aim(Z_LAND, CHAIR.x + 380 + tr, GY - 170, 1.75 * k);
export const LABS_CAM = (k = 1, tr = 0) => E.aim(Z_LAND, (LABS.meta + LABS.other) / 2 + tr, GY - 200, 1.5 * k);
export const TOWN_CAM = (k = 1, tr = 0) => E.aim(Z_LAND, HALL.x + 120 + tr, GY - 190, 1.9 * k);
export const WANG_CAM = (k = 1, tr = 0) => E.aim(Z_HEAD, W / 2 + tr * .3, H / 2 + 20, 1.04 * k);

// ------------------------------------------------------------------------------------------------ the town (seeded, cached)
const SKY = new Map();
function skyline(seed, x0, x1, base, hMin, hMax, wMin, wMax, litP) {
  const key = [seed, x0, x1].join(':'); if (SKY.has(key)) return SKY.get(key);
  const r = prng(seed), out = []; let x = x0;
  while (x < x1) {
    const w = wMin + r() * (wMax - wMin), h = hMin + r() * (hMax - hMin), wins = [], roof = r();
    const cols = Math.max(2, Math.floor(w / 26)), rows = Math.max(2, Math.floor(h / 34));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const q = r(); if (q < litP * 3) wins.push([i / cols, j / rows, q < litP ? 1 : 0, r()]); }
    out.push({ x, w, h, base, cols, rows, wins, roof }); x += w + r() * 18 - 4;
  }
  SKY.set(key, out); return out;
}
function drawTown(ctx, t, list, col, o = {}) {
  ctx.fillStyle = col;
  for (const b of list) {
    ctx.fillRect(b.x, b.base - b.h, b.w, b.h + 40);
    if (b.roof > .45) { ctx.beginPath(); ctx.moveTo(b.x - 4, b.base - b.h); ctx.lineTo(b.x + b.w / 2, b.base - b.h - b.w * .38); ctx.lineTo(b.x + b.w + 4, b.base - b.h); ctx.closePath(); ctx.fill(); }
  }
  const gold = o.gold ?? 0, x0 = o.from ?? 960;
  for (const b of list) {
    const cw = b.w / b.cols, rh = b.h / b.rows;
    for (const [u, v, lit, q] of b.wins) {
      const wx = b.x + u * b.w, d = Math.abs(wx - x0) / 2600, g = clamp((gold * 1.3 - d) * 5 + (q - .5) * .4);   // the gold wave runs outward from you
      const on = Math.max(lit ? 1 : 0, g); if (on <= 0) continue;
      ctx.fillStyle = rgba(mixHex(LAMP.body, GOLD.hot, g), (o.a ?? .8) * on * (.78 + .22 * Math.sin(t * .3 + q * 20)));
      ctx.fillRect(wx + cw * .28, b.base - b.h + v * b.h + rh * .3, cw * .44, rh * .42);
    }
  }
}
function hills(ctx, pts, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(pts[0][0], 3000); for (const [x, y] of pts) ctx.lineTo(x, y); ctx.lineTo(pts[pts.length - 1][0], 3000); ctx.closePath(); ctx.fill(); }
const HILL1 = [[-4000, 760], [-2600, 650], [-1500, 700], [-400, 600], [500, 680], [1250, 640], [1800, 560], [2600, 600], [3800, 660], [4600, 590], [5600, 640], [6600, 610], [7800, 660], [9500, 690]];
const HILL2 = [[-4000, 800], [-2000, 740], [-800, 770], [300, 730], [1200, 740], [2000, 690], [2800, 720], [3900, 740], [5200, 700], [6400, 730], [8000, 720], [9500, 740]];
const IND = () => mixHex(P.night1, P.ind1, .45), IND2 = () => mixHex(P.night0, P.ind1, .3);
function win(ctx, x, y, w, h, col, a = .85) { ctx.fillStyle = rgba(col, a); ctx.fillRect(x, y, w, h); }

function river(ctx, t) {   // the river in front of the town (left), with the old stone bridge (arches) over it
  const x0 = -2600, x1 = 640;
  ctx.fillStyle = lin(ctx, 0, GY, 0, GY + 70, [[0, mixHex(P.ind0, P.blue1, .35)], [1, P.night0]]); ctx.fillRect(x0, GY + 2, x1 - x0, 90);
  for (let i = 0; i < 18; i++) { const x = x0 + ((i * 197 + t * 22) % (x1 - x0)); ctx.fillStyle = rgba(LAMP.body, .12); ctx.fillRect(x, GY + 14 + (i % 4) * 12, 40 + (i % 3) * 20, 2); }
  const b = BRIDGE.x, bw = 760; ctx.fillStyle = mixHex(P.night1, P.blue1, .28);
  ctx.fillRect(b - bw / 2, GY - 46, bw, 22);
  for (let i = 0; i < 4; i++) { const ax = b - bw / 2 + i * bw / 4; ctx.beginPath(); ctx.moveTo(ax, GY - 26); ctx.lineTo(ax + bw / 4, GY - 26); ctx.lineTo(ax + bw / 4, GY + 60); ctx.arc(ax + bw / 8, GY + 60, bw / 8 - 14, 0, Math.PI, true); ctx.lineTo(ax, GY + 60); ctx.closePath(); ctx.fill(); }
  for (let i = 0; i <= 8; i++) ctx.fillRect(b - bw / 2 + i * bw / 8 - 3, GY - 66, 6, 22);
  for (let i = 0; i < 3; i++) { const lx = b - bw / 3 + i * bw / 3; ctx.fillRect(lx - 2, GY - 110, 4, 66); halo(ctx, lx, GY - 112, 26, .4, GOLD.halo, LAMP.core); }
}
function townHall(ctx, t, st) {   // small town hall: a gable, tall lit windows (no bell, no flags, no clock)
  const x = HALL.x, a = clamp(st.hall ?? .35);
  ctx.fillStyle = IND(); ctx.fillRect(x - 200, GY - 190, 400, 200);
  ctx.beginPath(); ctx.moveTo(x - 220, GY - 188); ctx.lineTo(x, GY - 300); ctx.lineTo(x + 220, GY - 188); ctx.closePath(); ctx.fill();
  for (let i = 0; i < 5; i++) { const on = clamp(a * 1.6 - i * .15), wx = x - 168 + i * 72; win(ctx, wx, GY - 160, 40, 100, mixHex(LAMP.deep, LAMP.body, on * .8), .3 + .4 * on); ctx.fillStyle = IND(); ctx.fillRect(wx + 18, GY - 160, 4, 100); ctx.fillRect(wx, GY - 118, 40, 4); }
  halo(ctx, x, GY - 110, 260, .18 * a, GOLD.halo, LAMP.core);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .2); for (let i = 0; i < 3; i++) ctx.fillRect(x - 210 - i * 14, GY - 12 + i * 4, 420 + i * 28, 5);
}
function quay(ctx, t) { ctx.fillStyle = mixHex(P.night1, P.blue2, .22); ctx.fillRect(560, GY - 4, 900, 10); for (let i = 0; i < 12; i++) ctx.fillRect(580 + i * 74, GY - 34, 4, 30); ctx.fillRect(570, GY - 36, 880, 4); }
// THE CHALKBOARD: a huge old blackboard on two legs, full of chalk; one empty spot in the middle (the Riemann hypothesis)
const CHALK = (() => { const r = prng(59), a = []; for (let i = 0; i < 120; i++) a.push([r(), r(), .3 + r() * .7, r()]); return a; })();
function board(ctx, t, st) {
  const B = BOARD, o = st.board ?? {}, x0 = B.x - B.w / 2, y0 = B.y - B.h;
  ctx.fillStyle = mixHex(P.night0, '#1c2a26', .55); ctx.fillRect(x0 - 26, y0 - 26, B.w + 52, B.h + 52);   // frame (dark wood)
  ctx.fillRect(x0 + 60, B.y, 18, GY - B.y); ctx.fillRect(x0 + B.w - 78, B.y, 18, GY - B.y);             // legs
  ctx.fillStyle = lin(ctx, x0, y0, x0 + B.w, B.y, [[0, '#1d302b'], [.6, '#16241f'], [1, '#101b18']]); ctx.fillRect(x0, y0, B.w, B.h);
  const S = B.spot, ch = clamp(o.chalk ?? 1);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, B.w, B.h); ctx.rect(S.x - S.w / 2 - 30, S.y - S.h / 2 - 20, S.w + 60, S.h + 40); ctx.clip('evenodd');
  for (const [u, v, l, q] of CHALK) {   // chalk lines: formulas as short strokes, a few curly signs
    const x = x0 + 30 + u * (B.w - 120), y = y0 + 40 + v * (B.h - 80), len = 40 + l * 120;
    ctx.strokeStyle = rgba(CREAM, .2 + .16 * q * ch); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y);
    for (let k = 1; k <= 6; k++) ctx.lineTo(x + len * k / 6, y + Math.sin(k * 2.1 + q * 9) * 5); ctx.stroke();
    if (q > .8) { ctx.beginPath(); ctx.arc(x - 12, y, 7, 0, TAU * .8); ctx.stroke(); }
  }
  ctx.restore();
  ctx.strokeStyle = rgba(CREAM, .22); ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.strokeRect(S.x - S.w / 2, S.y - S.h / 2, S.w, S.h); ctx.setLineDash([]);
  const lu = clamp(o.spot ?? 0);
  if (lu > 0) { F.goldText(ctx, [['RIEMANN HYPOTHESIS', 0]], S.x, S.y + S.h / 2 + 46, 26, F.rise(lu), { serif: false, weight: 700, spacing: .06, align: 'center', col: CREAM });
    F.goldText(ctx, [['UNSOLVED', 0]], S.x, S.y + S.h / 2 + 80, 22, F.rise(span(lu, .25, 1)), { serif: false, weight: 600, spacing: .12, align: 'center', col: F.CREAM2 }); }
  const rb = clamp(o.robot ?? 0), gone = clamp(o.robotGone ?? 0);   // the film robot of our fears: a pale chalk outline, wiped to dust
  if (rb > 0 && gone < 1) chalkRobot(ctx, t, x0 + 170, B.y - 40, 300, rb, gone);
}
function chalkRobot(ctx, t, x, y, h, u, gone) {
  const pts = [[-.12, -1], [.12, -1], [.12, -.82], [.28, -.78], [.3, -.42], [.18, -.42], [.16, -.7], [.12, -.7], [.14, -.4], [.08, 0], [-.08, 0], [-.14, -.4], [-.12, -.7], [-.16, -.7], [-.18, -.42], [-.3, -.42], [-.28, -.78], [-.12, -.82]];
  const r = prng(77);
  ctx.save(); ctx.strokeStyle = rgba(CREAM, .5 * (1 - gone)); ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); const n = Math.max(2, Math.round(pts.length * clamp(u * 1.2)));
  pts.slice(0, n).forEach(([a, b], i) => { const px = x + a * h, py = y + b * h; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); if (n === pts.length) ctx.closePath(); ctx.stroke();
  ctx.fillStyle = rgba(CREAM, .5 * (1 - gone)); ctx.fillRect(x - .07 * h, y - .93 * h, .04 * h, .03 * h); ctx.fillRect(x + .03 * h, y - .93 * h, .04 * h, .03 * h);
  if (gone > 0) for (let i = 0; i < 90; i++) { const [a, b] = pts[i % pts.length], ph = clamp(gone * 1.4 - r() * .4); ctx.fillStyle = rgba(CREAM, .4 * (1 - ph)); ctx.fillRect(x + a * h + (r() - .5) * 30, y + b * h + ph * ph * 260 + r() * 10, 3, 3); }
  ctx.restore();
}
function chair(ctx, t, st) {   // the referee's tall chair (an umpire's chair: two long legs, a seat, a small ladder-less frame)
  const c = CHAIR, o = st.chair ?? {};
  ctx.strokeStyle = mixHex(P.night1, P.blue2, .5); ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(c.x - 60, GY); ctx.lineTo(c.x - 20, GY - c.h); ctx.moveTo(c.x + 60, GY); ctx.lineTo(c.x + 20, GY - c.h); ctx.moveTo(c.x - 44, GY - c.h * .45); ctx.lineTo(c.x + 44, GY - c.h * .45); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.blue2, .5); ctx.fillRect(c.x - 40, GY - c.h - 8, 80, 12); ctx.fillRect(c.x + 26, GY - c.h - 60, 8, 56);
  const ru = clamp(o.referee ?? 1);
  if (ru > 0) F.referee(ctx, t, c.x - 6, GY - c.h + 4, 86, { card: o.card ?? 0, look: o.look ?? .1, dir: -1 });
}
function labs(ctx, t, st) {   // Meta Superintelligence Labs (billboard frame on the roof) · a fence · the other lab (the file in its window)
  const a = clamp(st.labs ?? .5);
  for (const [x, w, h] of [[LABS.meta, 520, 260], [LABS.other, 440, 230]]) {
    ctx.fillStyle = IND2(); ctx.fillRect(x - w / 2, GY - h, w, h + 10);
    for (let j = 0; j < 4; j++) for (let i = 0; i < Math.floor(w / 60); i++) win(ctx, x - w / 2 + 24 + i * 60, GY - h + 30 + j * 52, 34, 24, COOL.body, (.25 + .4 * a) * (.7 + .3 * Math.sin(t * .4 + i + j * 3)));
    halo(ctx, x, GY - h / 2, w * .7, .08 * a, COOL.halo, COOL.core);
  }
  ctx.fillStyle = mixHex(P.night1, P.blue2, .3); ctx.fillRect(LABS.meta - 240, GY - 360, 8, 100); ctx.fillRect(LABS.meta + 232, GY - 360, 8, 100);   // the billboard frame
  ctx.strokeStyle = rgba(mixHex(P.blue2, P.cream, .2), .6); ctx.lineWidth = 3; ctx.strokeRect(LABS.meta - 240, GY - 420, 480, 70);
  const bb = clamp(st.billboard ?? 0); if (bb > 0) { ctx.save(); ctx.beginPath(); ctx.rect(LABS.meta - 236, GY - 416, 472, 62); ctx.clip(); F.headline(ctx, t, { x: LABS.meta - 220, y: GY - 382, w: 440, u: bb, glow: .7 }); ctx.restore(); }
  ctx.fillStyle = mixHex(P.night1, P.blue2, .35); for (let i = 0; i < 14; i++) ctx.fillRect(LABS.fence - 10 + (i - 7) * 14, GY - 70, 3, 70); ctx.fillRect(LABS.fence - 110, GY - 62, 220, 3); ctx.fillRect(LABS.fence - 110, GY - 30, 220, 3);
  const ol = clamp(st.otherLab ?? 0); if (ol > 0) { win(ctx, LABS.other - 40, GY - 150, 80, 60, GOLD.mid, .3 * ol); F.file(ctx, t, LABS.other, GY - 120, 30, { glow: ol, a: ol }); }
}
function ground(ctx) {
  ctx.fillStyle = lin(ctx, 0, GY, 0, GY + 500, [[0, mixHex(P.night1, P.ind1, .35)], [.2, P.night1], [1, P.night0]]); ctx.fillRect(640, GY, 9000, 900);
  ctx.fillStyle = rgba(GOLD.line, .06); ctx.fillRect(640, GY, 9000, 3);
}

// ------------------------------------------------------------------------------------------------ the world
export function landWorld(ctx, c, t, st = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, mixHex(P.night1, P.ind0, .6)], [1, mixHex(P.ind1, P.blue0, .3)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, c, Z_SKY, () => { E.stars(ctx, 67, 200, t, [-3000, -1200, 12000, 1900], .85); });
  E.card(ctx, c, Z_FAR, () => { hills(ctx, HILL1, mixHex(P.ind0, P.blue0, .16)); hills(ctx, HILL2, mixHex(P.night1, P.ind0, .45)); });
  let hboxes = null, post = null;
  E.card(ctx, c, Z_HEAD, () => {
    if (st.head !== false) { const h = st.head ?? {}; hboxes = F.headline(ctx, t, { ...HEAD, ...h }); }
    if (st.headExtra) st.headExtra(ctx, hboxes);
  });
  E.card(ctx, c, Z_LAND, () => {
    drawTown(ctx, t, skyline(31, -2600, 700, GY - 6, 70, 230, 60, 150, .1), mixHex(P.night1, P.ind1, .4), { gold: st.windows ?? 0, from: YOU.x });
    drawTown(ctx, t, skyline(47, 700, 9600, GY - 70, 20, 90, 60, 160, .03), mixHex(P.night1, P.ind0, .55), { a: .45 });
    ground(ctx); river(ctx, t); townHall(ctx, t, st); quay(ctx, t); labs(ctx, t, st); board(ctx, t, st); chair(ctx, t, st);
    if (st.tower) F.paperTower(ctx, t, TOWER.x, GY, TOWER.w, st.tower.h ?? 2600, { seed: 4, ...st.tower });
    if (st.ribbon) F.ribbon(ctx, t, RIB, { w0: 38, w1: 3, seed: 3, ...st.ribbon });
    if (st.author) { const a = st.author; const hh = E.person(ctx, a.x ?? 1800, GY, a.h ?? 70, { dir: 1, light: .7, look: .6, armR: [1.2, 1.9], ...(a.o ?? {}) });
      if (a.laptop !== false && hh?.R) { ctx.fillStyle = mixHex(P.night0, P.blue2, .3); ctx.fillRect(hh.R[0] - 16, hh.R[1] - 4, 26, 4); ctx.fillStyle = rgba(COOL.body, .8); ctx.fillRect(hh.R[0] - 14, hh.R[1] - 20, 22, 15); } }
    if (st.you !== false) { const y = st.you ?? {}; E.du(ctx, y.x ?? YOU.x, y.y ?? GY, y.h ?? YOU.h, { light: 1, back: .3, dir: 1, look: .9, ...(y.o ?? {}) }); }
    if (st.land) st.land(ctx);
  });
  // the post header hangs on the headline card but is drawn after the land (a pinned print in front of the town's roofs)
  if ((st.post ?? 0) > 0) E.card(ctx, c, Z_HEAD, () => { post = F.xPost(ctx, t, POST.x, POST.y, POST.w, { u: st.post, a: st.postA ?? 1 }); });
  if (st.fg) E.card(ctx, c, Z_FG, st.fg);
  return { head: hboxes, post };
}
// screen helpers for carriers
export const headPt = (c, u, v) => E.project(c, Z_HEAD, u, v);
export const landPt = (c, u, v) => E.project(c, Z_LAND, u, v);
export function postRect(c, u = 1) { const p = E.project(c, Z_HEAD, POST.x, POST.y); return p ? { x: p[0], y: p[1], w: POST.w * p[2], h: POST.w / 4.2 * p[2] * u, k: p[2] } : null; }

// ------------------------------------------------------------------------------------------------ the seam plates
export function plateWang(ctx, t, T) {
  const k = creep(t, T, 'The man is Alexandr Wang'), c = WANG_CAM(k, trk(k));
  landWorld(ctx, c, t, { post: 1, windows: 1, tower: { u: 1, dark: .68, pour: .3, from: [BOARD.spot.x, BOARD.spot.y] }, board: { chalk: 1, spot: 1 },
    author: { x: 1905, o: { look: .9, armR: [1.2, 1.9] } }, you: { x: 1760, o: { armR: [.2, .1], look: .9 } },
    land: (cx) => F.file(cx, t, BOARD.spot.x, BOARD.spot.y, 40, { glow: 1, seed: 5 }) });
  F.checklist(ctx, t, T);
}
export function plateReferee(ctx, t, T) {
  const k = creep(t, T, "That leaves Wang's boldest"), c = REFEREE_CAM(k, trk(k) * .3);
  landWorld(ctx, c, t, { head: { dim: .5 }, ribbon: { u: 1 }, chair: { referee: 1, card: 1 }, tower: { u: 1, dark: .8 }, you: false });
  F.checklist(ctx, t, T);
}
export function plateHandover(ctx, t, T) {
  const k = creep(t, T, 'Not like a coup'), c = TOWN_CAM(k, trk(k) * .3);
  landWorld(ctx, c, t, { head: { dim: .85 }, hall: 1, windows: .3, you: false,
    land: (cx) => F.goldText(cx, [['HANDOVER', 1]], HALL.x + 60, GY - 330, 74, 1, { serif: true, align: 'center', glow: true }) });
  F.checklist(ctx, t, T);
}

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// The final picture (text-v2 ENDBILD): the ribbon runs unreadable to the horizon, you at the referee's chair (the whistle is yours now),
// the checklist with the open box 4 at the top right. Lower half calm for the two YouTube tiles + the subscribe circle. Slow pull-back.
export const END_TILES = { left: { x: 80, y: 600, w: 640, h: 360 }, right: { x: 1200, y: 600, w: 640, h: 360 }, sub: { x: 960, y: 900, r: 80 } };
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, k = 1 - .008 * Math.max(0, t - t0), c = E.aim(Z_LAND, CHAIR.x + 300 + 4 * Math.max(0, t - t0), GY - 260, 1.25 * k, 960, 420);
  landWorld(ctx, c, t, { head: { dim: .35 }, ribbon: { u: 1 }, chair: { referee: 0 }, you: { x: CHAIR.x - 6, y: GY - CHAIR.h + 4, h: 70, o: { look: .5 } }, windows: 1, hall: 1 });
  F.checklist(ctx, t, T);
}
