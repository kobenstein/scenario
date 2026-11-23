// Film 49 · THE STAIRS OF FIVE YEARS (the one world of the film) + the seam plates between the builder groups
// (owned by the lead; builders import, never edit — wishes go in the report).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its scene out of it.
// Plates keep a slow push (CREEP 5 %/s from T0 − .5) and a slow truck right (TRUCK 45 px/s); the receiving side continues both.
// Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet49.mjs <dir>
//
//   Lead → B1 at T.G('Picture a wedding') (c01 → c02): plateFoot   THE FOOT. You stand on the bottom step (tread 0, x 880) after walking past
//            the laptop (dark now); the stairs rise right (the door out of frame); on the plain at the left the wedding table waits, its string
//            lights UNLIT. B1 (c02) switches the string lights on (they light right → left, the first bulb nearest you) and glides to the table.
//   B1 → B2  at T.G('But you can only do so much') (c05 → c06): plateWork   STEP 4 · WORK. Close on tread 1 (the office stage): you at the desk,
//            the tool (a cool screen) next to the usual work (a warm lamp, papers); the calendar on the riser wall is CLOSED. Countdown: 4 YEARS.
//   B2 → B3  at T.G('That is what the experts know') (c08 → c09): plateMachine   STEP 2 · THE MACHINE. Close on tread 3 (the living room):
//            the big window to the world (city lights), the TV with headline bars, the untouched tablet on the low table, you by the sofa
//            looking at the TV. Countdown: 2 YEARS.
//
// THE WORLD (design px per depth card; cam3() = home = THUMBNAIL B, the first frame of the film):
//   sky Z 40000 (night gradient, brighter blue toward the door, stars) · far clouds Z 14000 (lumpy blue cloud banks, left and right) ·
//   decades path Z 9000 (a light path that runs from behind the landing into the far distance; c02 'DECADES') ·
//   THE LAND Z 3600, ground line GY 960:
//     THE FIVE STEPS (STEPS[k], k 0 = the bottom = "5 years to go" … k 4 = the top = "1 year to go"): giant blocks, lit riser + gold tread
//       band; each tread is a STAGE (STAGES[k]: you · work · family · the machine · your say) whose set pops up out of the tread (st.stage[k]).
//       At the left end of every block a small carved stair (6 little steps) — that is how you climb (climbPos()).
//     THE LANDING above the fifth step (y 322, x 1755 → 3600) with THE DOOR (the hero light, x 1702–1845, rising out of frame, thumbnail C).
//     THE PLAIN (x −1400 → 412): where you stand at home (360, 960); the wedding table waits at x −880 … −380 (string lights on two poles).
//     THE OLD STAIR (x −1400 → −7600): hundreds of flat steps going DOWN to the left into the night (history: generations), with four landings:
//       PLOW (−5900) · ENGINE (−4700) · EARLY COMPUTER (−3500) · THE THINKING WINDOW (−2300). oldY(x) = its surface height.
//   foreground Z 2600: the right cloud bank over the base of the stairs (as in thumbnail B).
// stairsWorld(ctx, c, t, st) st (all optional):
//   lit [5] 0..1 (riser + tread light per step; default all 1 = the thumbnail) · door 0..1 (1 = thumbnail) · doorPulse 0..1 (an extra flare)
//   dust 0..1 (gold dust around the door and along the stairs) · old 0..1 (the old stair's edges catch light; 0 = a dark mass) · hist [4]
//   0..1 (a history landing lights: prop in back light + its word) · histWords 0..1 · until 0..1 (THE SWEEP: the stairs' gold light runs down
//   and over the thinking window; 1 = passed) · nums 0..1 (5 4 3 2 1 on the risers) · stage [5] 0..1 (the stage sets pop up) · wedding
//   { a, lights 0..1, warm 0..1 } · topTable { a, lights } (the same table on the landing, c12) · decades 0..1 · dawn 0..1 (thumbnail A, once,
//   c11) · crowd 0..1 (small figures climb the lower steps, subscribe 1) · laptop { x, on 0..1, a } (on tread 0) · pool 0..1 (the gold light
//   on the ground under your feet) · you { x, y, h, o } | false (default: thumbnail position) · people [{ x, y, h, kind 'person'|'du', o }]
//   · land(ctx) (land card, after everything) · fg(ctx) (Z 2600, after the clouds) · clouds 0..1 (default 1)
import * as E from './f10_editorial.mjs';
import * as F from './f49_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, prng, smooth } = E;
const { GOLD, COOL, LAMP, PAPER } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const CREEP = .05;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 45;
export const trk = (k) => TRUCK * (k - 1) / CREEP;

export const Z_SKY = 40000, Z_FAR = 14000, Z_PATH = 9000, Z_LAND = 3600, Z_FG = 2600, GY = 960;
// the five steps (thumbnail B × 1.5): L = left edge, F = right edge of the lit front, top = the tread line
export const STEPS = [
  { L: 412, F: 1035, top: 810 }, { L: 645, F: 1290, top: 683 }, { L: 922, F: 1537, top: 555 },
  { L: 1185, F: 1747, top: 443 }, { L: 1440, F: 1755, top: 338 },
];
export const SX = 34, TD = 18;                 // the tread band (oblique depth)
export const LANDING = { L: 1755, R: 3600, top: 322 };
export const DOOR = { x0: 1702, x1: 1845, y: 322 };
export const YOU = { x: 360, y: GY, h: 165 };
export const YOU_H = 165;
// the stages: where a figure stands on tread k (feet y) and the free width of the stage
export const STAGES = STEPS.map((s, k) => ({ k, x0: s.L + 30, x1: (k === 4 ? 1690 : s.F) - 30, y: s.top - TD * .45, cx: (s.L + (k === 4 ? 1690 : s.F)) / 2,
  name: ['YOU', 'YOUR WORK', 'YOUR FAMILY', 'THE MACHINE', 'YOUR SAY'][k], years: 5 - k }));
export const stageY = (k) => STAGES[k].y;
// a camera on stage k: s = magnification (2–2.6 = the stage fills the frame), du/dv shift the look point
export const stageCam = (k, s = 2.3, du = 0, dv = 0, sx = W / 2, sy = H * .56) => E.aim(Z_LAND, STAGES[k].cx + du, STAGES[k].y - 70 + dv, s, sx, sy);
export const HOME = () => E.cam3();
// the small carved stair at the left end of block k: 6 steps from the level below (GY or the tread below) up to tread k
export function climbPos(k, u) {
  const s = STEPS[k], y0 = k ? STEPS[k - 1].top - TD * .45 : GY, y1 = s.top - TD * .45, n = 6, x0 = s.L - 84, x1 = s.L + 26;
  const f = clamp(u) * n, i = Math.min(n - 1, Math.floor(f)), fr = f - i;
  const yStep = (j) => lerp(y0, y1, (j + 1) / n);
  const y = fr < .5 ? (i ? yStep(i - 1) : y0) : yStep(i), x = lerp(x0, x1, clamp(u));   // feet land on whole steps
  return { x, y: lerp(i ? yStep(i - 1) : y0, yStep(i), smooth(clamp((fr - .2) / .6))), dy: y };
}
// THE OLD STAIR: surface height at x (x ≤ −1400); flat landings
export const OLD_LANDINGS = [
  { x: -5900, w: 560, name: 'HANDS', prop: 'plow' }, { x: -4700, w: 560, name: 'MUSCLES', prop: 'engine' },
  { x: -3500, w: 560, name: 'MEMORY', prop: 'computer' }, { x: -2300, w: 620, name: 'THINKING', prop: 'window' },
];
export const OLD_RUN = 32, OLD_RISE = 5, OLD_X0 = -1400, OLD_X1 = -7600;
const OLD = (() => {   // [x, y] corners of the old stair's surface from the plain edge going left
  const pts = [[OLD_X0, GY]]; let x = OLD_X0, y = GY;
  const inL = (xx) => OLD_LANDINGS.some((l) => xx <= l.x + l.w / 2 && xx > l.x - l.w / 2);
  while (x > OLD_X1) { const nx = x - OLD_RUN; if (inL(nx + OLD_RUN / 2)) { pts.push([nx, y]); } else { pts.push([x, y + OLD_RISE]); y += OLD_RISE; pts.push([nx, y]); } x = nx; }
  return pts;
})();
export function oldY(x) {
  if (x >= OLD_X0) return GY;
  for (let i = 1; i < OLD.length; i++) if (OLD[i][0] <= x) return OLD[i][1];
  return OLD[OLD.length - 1][1];
}
export const landingY = (i) => oldY(OLD_LANDINGS[i].x);
export const WEDDING = { x0: -880, x1: -380, top: GY - 74, card: { x: -560, y: GY - 74 }, seat: { x: -560, y: GY } };

// ------------------------------------------------------------------------------------------------ small drawing helpers
const IND = () => mixHex(P.night1, P.ind1, .45), IND2 = () => mixHex(P.night0, P.ind1, .3);
function softGlow(ctx, x, y, rx, ry, col) {   // an elliptical radial glow without edges
  ctx.save(); ctx.translate(x, y); ctx.scale(rx / ry, 1);
  ctx.fillStyle = E.rad(ctx, 0, 0, ry, [[0, col], [1, col.replace(/[\d.]+\)$/, '0)')]]); ctx.beginPath(); ctx.arc(0, 0, ry, 0, TAU); ctx.fill(); ctx.restore();
}
const SPECK = new Map();
function specks(ctx, seed, n, x, y, w, h, col, a) {   // fine stipple (grain ≤ 2 px) on a face
  const key = seed + ':' + n; if (!SPECK.has(key)) { const r = prng(seed), s = []; for (let i = 0; i < n; i++) s.push([r(), r(), r()]); SPECK.set(key, s); }
  ctx.fillStyle = col; for (const [u, v, q] of SPECK.get(key)) { ctx.globalAlpha = a * (.4 + .6 * q); ctx.fillRect(x + u * w, y + v * h, 1.6, 1.6); }
  ctx.globalAlpha = 1;
}
function cloudBank(ctx, lumps, col, rim) {
  ctx.fillStyle = col; ctx.beginPath();
  for (const [x, y, r] of lumps) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); }
  ctx.fill();
  if (rim) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rim; ctx.lineWidth = 2; ctx.beginPath(); for (const [x, y, r] of lumps) { ctx.moveTo(x + r * Math.cos(-2.2), y + r * Math.sin(-2.2)); ctx.arc(x, y, r, -2.2, -1.0); } ctx.stroke(); ctx.restore(); }
}
const CL_LEFT = [[-1500, 900, 260], [-1180, 820, 230], [-880, 760, 250], [-560, 700, 210], [-280, 690, 190], [20, 640, 180], [250, 720, 170], [-60, 860, 300], [-700, 960, 320], [380, 860, 200]];
const CL_LEFT2 = [[-1300, 1010, 300], [-700, 1040, 330], [-100, 980, 260], [300, 1010, 220], [620, 1080, 200]];
const CL_RIGHT = [[1580, 1010, 120], [1720, 940, 140], [1880, 880, 150], [2040, 860, 170], [2240, 900, 190], [2480, 960, 210], [1660, 1060, 150], [2000, 1040, 220]];
const CL_FAR_R = [[2600, 820, 260], [3000, 760, 300], [3500, 820, 320], [4000, 900, 360], [2300, 960, 260]];

// ------------------------------------------------------------------------------------------------ the old stair and its landings
function plow(ctx, t, x, y, L) {
  ctx.fillStyle = P.night0; ctx.strokeStyle = P.night0; ctx.lineCap = 'round';
  ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x - 120, y - 22); ctx.lineTo(x + 130, y - 76); ctx.stroke();           // the beam
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x - 70, y - 30); ctx.lineTo(x - 170, y - 128); ctx.moveTo(x - 40, y - 30); ctx.lineTo(x - 128, y - 132); ctx.stroke();   // handles
  ctx.beginPath(); ctx.moveTo(x - 20, y - 34); ctx.lineTo(x + 60, y - 2); ctx.lineTo(x + 6, y - 2); ctx.closePath(); ctx.fill();                  // the share
  ctx.beginPath(); ctx.arc(x + 122, y - 30, 30, 0, TAU); ctx.lineWidth = 6; ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 122, y - 76); ctx.lineTo(x + 122, y - 30); ctx.stroke();
  for (let i = 0; i < 7; i++) { ctx.fillStyle = mixHex(P.night1, P.ind1, .3); ctx.fillRect(x - 260 + i * 22, y - 6, 14, 6); }   // furrows
}
function engine(ctx, t, x, y, L) {
  const run = .4 + .6 * L, ang = .13 * Math.sin(t * 1.4 * run), wa = t * 1.4 * run;
  ctx.fillStyle = P.night0; ctx.strokeStyle = P.night0;
  ctx.fillRect(x - 150, y - 50, 230, 50);                                    // base
  ctx.fillRect(x - 130, y - 190, 50, 140);                                   // the cylinder
  ctx.fillRect(x - 32, y - 230, 20, 180);                                    // the column
  ctx.save(); ctx.translate(x - 22, y - 232); ctx.rotate(ang); ctx.fillRect(-150, -9, 300, 18); ctx.restore();   // the rocking beam
  const bx = x - 22 + Math.cos(ang) * 148, by = y - 232 + Math.sin(ang) * 148, wx = x + 150, wy = y - 100, cr = 34;
  const kx = wx + Math.cos(wa) * cr, ky = wy + Math.sin(wa) * cr;
  ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(kx, ky); ctx.stroke();   // connecting rod
  ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(wx, wy, 92, 0, TAU); ctx.stroke();                                         // the flywheel
  ctx.lineWidth = 6; for (let i = 0; i < 6; i++) { const a = wa + i * TAU / 6; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + Math.cos(a) * 90, wy + Math.sin(a) * 90); ctx.stroke(); }
  for (let i = 0; i < 4; i++) { const ph = (t * .08 + i / 4) % 1; ctx.fillStyle = rgba(P.blue1, .25 * (1 - ph) * L); ctx.beginPath(); ctx.ellipse(x - 105 + ph * 40, y - 210 - ph * 120, 16 + ph * 30, 10 + ph * 16, 0, 0, TAU); ctx.fill(); }
}
function computer(ctx, t, x, y, L) {
  ctx.fillStyle = P.night0;
  for (const cx of [x - 190, x - 100]) {
    ctx.fillRect(cx, y - 210, 80, 210);
    for (const ry of [y - 175, y - 120]) { const a = t * (1.1 + (cx & 3) * .2); ctx.strokeStyle = rgba(GOLD.line, .25 + .35 * L); ctx.lineWidth = 3; for (const dx of [20, 58]) { ctx.beginPath(); ctx.arc(cx + dx, ry, 15, a, a + 4.6); ctx.stroke(); } }
  }
  ctx.fillStyle = P.night0; ctx.fillRect(x, y - 92, 190, 92); ctx.fillRect(x + 20, y - 150, 150, 60);   // console + its panel
  const r = prng(71); for (let i = 0; i < 18; i++) { const on = .5 + .5 * Math.sin(t * (1.5 + r() * 2) + i * 2.1); ctx.fillStyle = rgba(GOLD.hot, (.2 + .6 * on) * (.35 + .65 * L)); ctx.fillRect(x + 32 + (i % 9) * 15, y - 138 + Math.floor(i / 9) * 22, 7, 7); }
}
function thinkingWindow(ctx, t, x, y, L, until) {
  ctx.fillStyle = mixHex(P.night0, P.ind1, .25); ctx.fillRect(x - 200, y - 300, 400, 300);                 // the house wall
  ctx.beginPath(); ctx.moveTo(x - 226, y - 300); ctx.lineTo(x, y - 410); ctx.lineTo(x + 226, y - 300); ctx.closePath(); ctx.fill();
  const wx = x - 100, wy = y - 236, ww = 190, wh = 140, warm = mixHex(LAMP.body, GOLD.hot, .3), lamp = .45 + .55 * L;
  halo(ctx, wx + ww / 2, wy + wh / 2, 240, .22 * lamp, GOLD.halo, LAMP.core);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(P.ind1, warm, .7 * lamp)], [1, mixHex(P.night1, LAMP.deep, .6 * lamp)]]); ctx.fillRect(wx, wy, ww, wh);
  ctx.fillStyle = P.night0; ctx.fillRect(wx + 20, wy + wh - 34, ww - 40, 7); ctx.fillRect(wx + 30, wy + wh - 27, 6, 27); ctx.fillRect(wx + ww - 36, wy + wh - 27, 6, 27);   // the table
  E.person(ctx, wx + 92, wy + wh + 2, 104, { dir: 1, light: .7, lean: .2, armR: [2.75, 3.0], look: -.35 });   // head in hand: thinking
  ctx.fillStyle = rgba(PAPER.lit, .8 * lamp); ctx.fillRect(wx + 118, wy + wh - 38, 34, 4);   // paper on the table
  const k = span(until, .84, 1);   // the wave arrives: a gold band crosses the window right → left, then the window stays gold (outshone)
  if (k > 0 && k < 1) { const sx = lerp(wx + ww + 60, wx - 60, k); ctx.fillStyle = lin(ctx, sx - 70, 0, sx + 70, 0, [[0, rgba(GOLD.core, 0)], [.5, rgba(GOLD.core, .85)], [1, rgba(GOLD.core, 0)]]); ctx.fillRect(wx, wy, ww, wh); }
  if (k > 0) { ctx.fillStyle = rgba(GOLD.hot, .28 * smooth(k)); ctx.fillRect(wx, wy, ww, wh); }
  ctx.restore();
  if (k > 0) halo(ctx, wx + ww / 2, wy + wh / 2, 380, .5 * Math.sin(Math.PI * Math.min(1, k * 1.4)) + .12 * k, GOLD.halo, GOLD.core);
  ctx.strokeStyle = P.night0; ctx.lineWidth = 8; ctx.strokeRect(wx, wy, ww, wh); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh * .45); ctx.stroke();
}
function oldStair(ctx, t, st) {
  const oa = clamp(st.old ?? 0), hist = st.hist ?? [0, 0, 0, 0];
  // the body: from the surface down into the night
  ctx.beginPath(); ctx.moveTo(OLD[0][0], OLD[0][1]); for (const [x, y] of OLD) ctx.lineTo(x, y); ctx.lineTo(OLD_X1 - 200, 6000); ctx.lineTo(OLD_X0, 6000); ctx.closePath();
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .18); ctx.fill();
  for (const [dy, al] of [[70, .35], [220, .45], [520, .6]]) {   // the body darkens with depth under the surface (bands that follow the slope)
    ctx.beginPath(); ctx.moveTo(OLD[0][0], OLD[0][1] + dy); for (const [x, y] of OLD) ctx.lineTo(x, y + dy); ctx.lineTo(OLD_X1 - 200, 6000); ctx.lineTo(OLD_X0, 6000); ctx.closePath();
    ctx.fillStyle = rgba(P.night0, al); ctx.fill();
  }
  // the edges catch the light: one fine line on every tread nose (fainter far left)
  if (oa > 0) {
    ctx.fillStyle = rgba(mixHex(P.blue2, GOLD.line, .35), .8 * oa);
    for (let i = 1; i < OLD.length; i++) { const [x, y] = OLD[i], [px, py] = OLD[i - 1]; if (py === y && px - x === OLD_RUN) ctx.fillRect(x, y - 1.5, OLD_RUN, 3); else if (px === x) ctx.fillRect(x - 1, py, 2, y - py); }
    ctx.fillStyle = lin(ctx, OLD_X1, 0, OLD_X0, 0, [[0, rgba(P.night0, .9)], [.5, rgba(P.night0, .35)], [1, rgba(P.night0, 0)]]); ctx.fillRect(OLD_X1, GY - 20, OLD_X0 - OLD_X1, 1000);
  }
  OLD_LANDINGS.forEach((l, i) => {
    const y = oldY(l.x), L = clamp(hist[i] ?? 0);
    if (L > 0) { halo(ctx, l.x - 20, y - 150, 560, .36 * L, GOLD.halo, LAMP.core); softGlow(ctx, l.x, y, l.w * .7, 40, rgba(GOLD.hot, .28 * L)); ctx.fillStyle = rgba(GOLD.hot, .3 * L); ctx.fillRect(l.x - l.w / 2, y - 2, l.w, 3); }   // back light (Gegenlicht) + a pool on the landing
    ({ plow, engine, computer })[l.prop]?.(ctx, t, l.x, y, L);
    if (l.prop === 'window') thinkingWindow(ctx, t, l.x, y, L, clamp(st.until ?? 0));   // st.until stays 1 after the sweep: the window stays gold
    const wu = clamp((st.histWords ?? 1) * L * 1.4 - .2);
    if (wu > 0 && l.prop !== 'window') F.goldText(ctx, [[l.name, .85]], l.x, y + 74, 46, F.rise(wu), { serif: false, weight: 700, spacing: .12, align: 'center' });
  });
}

// ------------------------------------------------------------------------------------------------ the plain, the wedding table, the laptop
function plain(ctx, t, st) {
  const x0 = OLD_X0, x1 = LANDING.R + 400;
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .18); ctx.fillRect(x0, GY, x1 - x0, 5000);   // the same ground as the old stair's body, banded the same way
  for (const [dy, al] of [[70, .35], [220, .45], [520, .6]]) { ctx.fillStyle = rgba(P.night0, al); ctx.fillRect(x0, GY + dy, x1 - x0, 5000); }
  ctx.fillStyle = rgba(mixHex(P.blue2, GOLD.line, .2), .35); ctx.fillRect(x0, GY, x1 - x0, 2);   // the ground's rim
  // the light of the stairs on the ground: a long pool from the bottom step to the left (under you)
  const pool = .55 + .45 * clamp(st.lit?.[0] ?? 1);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = E.rad(ctx, STEPS[0].L + 60, GY, 520, [[0, rgba(GOLD.hot, .28 * pool)], [.5, rgba(GOLD.halo, .08 * pool)], [1, rgba(GOLD.halo, 0)]]);
  ctx.beginPath(); ctx.ellipse(STEPS[0].L + 60, GY + 8, 620, 70, 0, 0, TAU); ctx.fill();
  const pu = clamp(st.pool ?? 0); if (pu > 0) { const px = st.poolX ?? 700, py = st.poolY ?? STAGES[0].y; ctx.fillStyle = E.rad(ctx, px, py, 260, [[0, rgba(GOLD.core, .45 * pu)], [1, rgba(GOLD.halo, 0)]]); ctx.beginPath(); ctx.ellipse(px, py + 2, 300 * expoOut(pu), 26, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
}
function stringLights(ctx, t, x0, x1, y, sag, n, lit, seed) {
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo((x0 + x1) / 2, y + sag * 2, x1, y); ctx.stroke();
  const r = prng(seed);
  for (let i = 1; i < n; i++) {
    const f = i / n, bx = lerp(x0, x1, f), by = (1 - f) * (1 - f) * y + 2 * f * (1 - f) * (y + sag * 2) + f * f * y + 7, on = clamp(lit * (n + 3) - (n - i)) * (.85 + .15 * Math.sin(t * 2 + r() * 9));
    ctx.fillStyle = on > .05 ? mixHex(P.night1, LAMP.core, on) : P.night1; ctx.fillRect(bx - 3, by - 3, 6, 7);
    if (on > .05) halo(ctx, bx, by, 34, .3 * on, GOLD.halo, LAMP.core);
  }
}
export function weddingTable(ctx, t, x0, x1, y, o = {}) {   // the long table (cloth, chairs behind, candles), string lights above on two poles
  const a = clamp(o.a ?? 1); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const lights = clamp(o.lights ?? 0), warm = clamp(o.warm ?? lights);
  ctx.fillStyle = P.night0; ctx.fillRect(x0 - 90, y - 330 + 74, 7, 330); ctx.fillRect(x1 + 80, y - 330 + 74, 7, 330);   // poles (y = table top)
  for (const [ya, sag] of [[y - 252, 22], [y - 236, 30]]) stringLights(ctx, t, x0 - 86, x1 + 84, ya, sag, 15, lights, 3 + sag);
  if (warm > 0) halo(ctx, (x0 + x1) / 2, y - 60, (x1 - x0) * .8, .12 * warm, GOLD.halo, LAMP.core);
  const nC = Math.round((x1 - x0) / 90);
  for (let i = 0; i < nC; i++) { const cx = x0 + 40 + i * ((x1 - x0 - 80) / (nC - 1)); ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(cx - 16, y - 60, 32, 60 + 74 - 30); ctx.fillRect(cx - 18, y - 64, 36, 8); }   // chair backs
  ctx.fillStyle = lin(ctx, 0, y, 0, y + 60, [[0, mixHex(mixHex(P.ind2, PAPER.shade, .22), LAMP.body, .25 * warm)], [1, mixHex(P.night1, PAPER.shade, .1)]]);   // the cloth
  ctx.beginPath(); ctx.moveTo(x0 - 16, y); ctx.lineTo(x1 + 16, y); ctx.lineTo(x1 + 22, y + 58); ctx.lineTo(x0 - 22, y + 58); ctx.closePath(); ctx.fill();
  ctx.fillStyle = P.night0; ctx.fillRect(x0, y + 58, 8, 74 - 58); ctx.fillRect(x1 - 8, y + 58, 8, 74 - 58);
  for (let i = 0; i < 4; i++) { const cx = lerp(x0 + 60, x1 - 60, i / 3); ctx.fillStyle = rgba(PAPER.lit, .6); ctx.fillRect(cx - 2, y - 22, 4, 22); if (warm > 0) { ctx.fillStyle = rgba(GOLD.core, warm); ctx.fillRect(cx - 2, y - 30, 4, 7); halo(ctx, cx, y - 28, 40, .3 * warm * (.85 + .15 * Math.sin(t * 5 + i)), GOLD.halo, LAMP.core); } }
  ctx.restore();
}
export function laptop(ctx, t, x, y, s, o = {}) {   // an open laptop standing on a tread (x, y = its foot), screen COOL when on
  const a = clamp(o.a ?? 1); if (a <= 0) return null;
  const open = clamp(o.open ?? 1), on = clamp(o.on ?? 1) * clamp((open - .5) * 2);   // open: the lid rises on its hinge (0 = shut)
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(x - s * .5, y); ctx.lineTo(x + s * .5, y); ctx.lineTo(x + s * .42, y - s * .06); ctx.lineTo(x - s * .42, y - s * .06); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.translate(x - s * .4, y - s * .06); ctx.transform(1, 0, -.12 * open, Math.max(.04, sineIO(open)), 0, 0);
  ctx.fillStyle = P.night0; ctx.fillRect(0, -s * .58, s * .8, s * .58);
  ctx.fillStyle = mixHex(P.night1, COOL.body, .85 * on); ctx.fillRect(s * .04, -s * .54, s * .72, s * .5);
  if (on > 0) { ctx.fillStyle = rgba(COOL.core, .5 * on); for (let i = 0; i < 4; i++) ctx.fillRect(s * .1, -s * .46 + i * s * .09, s * (.5 - i * .07), s * .025); }
  ctx.restore();
  if (on > 0) halo(ctx, x - s * .05, y - s * .32, s * 1.4, .28 * on, COOL.halo, COOL.core);
  ctx.restore();
  return { x, y, s };
}

// ------------------------------------------------------------------------------------------------ the five steps, the landing, the door
function doorLight(ctx, t, st) {
  const d = clamp(st.door ?? 1), pu = clamp(st.doorPulse ?? 0), b = d * (1 + .5 * pu) * (.97 + .03 * Math.sin(t * .9));
  const { x0, x1, y } = DOOR, top = y - 2600;
  // the open doorway: warm cream core, gold edges (never white)
  ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, mixHex(P.ind2, GOLD.body, d)], [.16, mixHex(P.ind2, GOLD.hot, d)], [.5, mixHex(P.ind2, '#fff1c2', d)], [.84, mixHex(P.ind2, GOLD.hot, d)], [1, mixHex(P.ind2, GOLD.mid, d)]]);
  ctx.fillRect(x0, top, x1 - x0, y - top);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  softGlow(ctx, x0 - 60, y - 420, 520, 900, rgba(GOLD.halo, .3 * b));        // the glow spills left into the sky (a tall soft ellipse, no edges)
  softGlow(ctx, (x0 + x1) / 2, y - 20, 760, 260, rgba(GOLD.hot, .22 * b));   // and down over the top steps
  halo(ctx, (x0 + x1) / 2, y - 60, 480 * (1 + .25 * pu), .26 * b, GOLD.halo, GOLD.core);
  ctx.restore();
  // the dark pillar right of the door
  ctx.fillStyle = mixHex(P.night1, P.ind1, .35); ctx.fillRect(x1, top, 115, y - top);
  ctx.fillStyle = rgba(GOLD.hot, .35 * d); ctx.fillRect(x1, top, 3, y - top);
}
function landing(ctx, t, st) {
  const { L, R, top } = LANDING;
  ctx.fillStyle = lin(ctx, 0, top, 0, GY, [[0, mixHex(P.ind1, P.blue1, .2)], [.3, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); ctx.fillRect(L - 300, top, R - L + 300, GY - top);
  ctx.fillStyle = lin(ctx, 0, top - TD, 0, top, [[0, mixHex(GOLD.body, GOLD.hot, .5)], [1, GOLD.mid]]); ctx.fillRect(L - 300, top - TD + 2, R - L + 300, TD - 2);
}
function block(ctx, t, k, lit) {
  const s = STEPS[k], below = k ? STEPS[k - 1].top : GY, rise = below - s.top, L = clamp(lit);
  // the side face (dark, receding right)
  ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.moveTo(s.F, s.top); ctx.lineTo(s.F + SX, s.top - TD); ctx.lineTo(s.F + SX, GY); ctx.lineTo(s.F, GY); ctx.closePath(); ctx.fill();
  // the riser (front face): lit at the top (light from the tread and the door), dark below the step under it
  const c0 = mixHex(mixHex(P.blue0, P.ind2, .55), mixHex(GOLD.mid, GOLD.hot, .35), .78 * L ** 1.4), c1 = mixHex(mixHex(P.ind1, P.blue1, .4), GOLD.shade, .5 * L), c2 = mixHex(P.night1, P.ind1, .55);
  ctx.fillStyle = lin(ctx, 0, s.top, 0, s.top + rise * 1.15, [[0, c0], [.55, c1], [.95, c2], [1, c2]]); ctx.fillRect(s.L, s.top, s.F - s.L, GY - s.top);
  ctx.fillStyle = lin(ctx, s.L, 0, s.F, 0, [[0, rgba(P.night0, .22)], [.4, rgba(P.night0, 0)], [1, rgba(GOLD.hot, .08 * L)]]); ctx.fillRect(s.L, s.top, s.F - s.L, rise);
  specks(ctx, 300 + k, 520, s.L, s.top, s.F - s.L, rise, mixHex(GOLD.core, P.cream, .5), .16 * L);
  // the tread band (the gold light)
  ctx.fillStyle = lin(ctx, 0, s.top - TD, 0, s.top, [[0, mixHex(mixHex(P.blue1, P.ind2, .4), GOLD.core, L)], [.6, mixHex(mixHex(P.blue1, P.ind2, .3), GOLD.hot, L)], [1, mixHex(P.blue1, GOLD.body, L)]]);
  ctx.beginPath(); ctx.moveTo(s.L, s.top); ctx.lineTo(s.F, s.top); ctx.lineTo(s.F + SX, s.top - TD); ctx.lineTo(s.L + SX, s.top - TD); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(GOLD.core, .9 * L); ctx.fillRect(s.L, s.top - 1.5, s.F - s.L, 3);   // the nose catches the light
  // the carved little stair at the left end (6 steps, in shadow)
  const n = 6, y0 = k ? STEPS[k - 1].top : GY, x0 = s.L - 84;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .55);
  for (let i = 0; i < n; i++) { const yy = lerp(y0, s.top, (i + 1) / n), xx = lerp(x0, s.L, i / n); ctx.fillRect(xx, yy, s.L - xx + 2, y0 - yy + 1); }
  ctx.fillStyle = rgba(GOLD.line, .25 + .35 * L); for (let i = 0; i < n; i++) { const yy = lerp(y0, s.top, (i + 1) / n), xx = lerp(x0, s.L, i / n); ctx.fillRect(xx, yy, (s.L - x0) / n + 2, 1.5); }
}
function treadGlow(ctx, t, k, lit) {   // the haze of light above a lit tread (additive)
  const s = STEPS[k], L = clamp(lit); if (L <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, s.top - 120, 0, s.top, [[0, rgba(GOLD.halo, 0)], [1, rgba(GOLD.halo, .2 * L)]]); ctx.fillRect(s.L, s.top - 120, s.F - s.L + SX, 120);
  ctx.restore();
}
function numbers(ctx, t, u) {
  STEPS.forEach((s, k) => {
    const uk = clamp(u * 1.5 - k * .12); if (uk <= 0) return;
    const below = k ? STEPS[k - 1].top - TD : GY, y = (s.top + below) / 2 + 30;
    F.goldText(ctx, [[String(5 - k), .2]], s.L + 70, y, 92, F.rise(uk), { serif: true, align: 'center', col: mixHex(GOLD.deep, P.night1, .2) });
  });
}

// ------------------------------------------------------------------------------------------------ the stage sets (pop-up silhouettes)
// each set rises out of its tread (the pop-up book): elements unfold upward, 80 ms apart, from the tread line. u 0..1.
function popUp(ctx, u, i, y, fn) { const k = expoOut(clamp(u * 1.6 - i * .12)); if (k <= 0) return; ctx.save(); ctx.translate(0, y); ctx.scale(1, k); ctx.translate(0, -y); fn(); ctx.restore(); }
const SIL = () => mixHex(P.night0, P.ind1, .22);
export const SETS = [
  (ctx, t, u, S) => {},   // k 0 · YOU: nearly empty on purpose (only you and, small at the edge, the place card: the builder draws it)
  (ctx, t, u, S) => {     // k 1 · WORK: an open office: three desks with cool screens, a lamp, a coat rack, the wall calendar on the riser above
    const y = S.y;
    [[S.x0 + 70, 0], [S.x0 + 250, 1], [S.x0 + 430, 2]].forEach(([dx, i]) => popUp(ctx, u, i, y, () => {
      ctx.fillStyle = SIL(); ctx.fillRect(dx - 50, y - 46, 100, 8); ctx.fillRect(dx - 44, y - 40, 6, 40); ctx.fillRect(dx + 38, y - 40, 6, 40);
      ctx.fillStyle = P.night0; ctx.fillRect(dx - 18, y - 84, 40, 30); ctx.fillRect(dx, y - 56, 5, 10); ctx.fillStyle = rgba(COOL.body, .7); ctx.fillRect(dx - 15, y - 81, 34, 24); halo(ctx, dx + 2, y - 70, 40, .2, COOL.halo, COOL.core);
    }));
    popUp(ctx, u, 3, y, () => { ctx.fillStyle = SIL(); ctx.fillRect(S.x1 - 40, y - 140, 6, 140); ctx.fillRect(S.x1 - 58, y - 140, 42, 5); });
  },
  (ctx, t, u, S) => {     // k 2 · FAMILY: a home in section: a wall with a window, a bed with a blanket, a screen glowing under it
    const y = S.y;
    popUp(ctx, u, 0, y, () => { ctx.fillStyle = SIL(); ctx.fillRect(S.x0 + 40, y - 150, 14, 150); ctx.fillStyle = rgba(LAMP.body, .5); ctx.fillRect(S.x0 + 70, y - 136, 70, 56); ctx.fillStyle = SIL(); ctx.fillRect(S.x0 + 103, y - 136, 4, 56); });
    popUp(ctx, u, 1, y, () => {
      const bx = S.x0 + 250; ctx.fillStyle = SIL(); ctx.fillRect(bx, y - 40, 230, 16); ctx.fillRect(bx, y - 74, 12, 74); ctx.fillRect(bx + 222, y - 50, 10, 50);
      ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.moveTo(bx + 30, y - 40); ctx.bezierCurveTo(bx + 60, y - 70, bx + 170, y - 66, bx + 222, y - 42); ctx.closePath(); ctx.fill();
      const g = .6 + .4 * Math.sin(t * 1.7); halo(ctx, bx + 120, y - 50, 70, .32 * g * u, COOL.halo, COOL.core); ctx.fillStyle = rgba(COOL.core, .35 * g * u); ctx.fillRect(bx + 100, y - 58, 40, 6);
    });
  },
  (ctx, t, u, S) => {     // k 3 · THE MACHINE: the living room: a big window to the world, the TV with headline bars, the sofa, the low table + tablet
    const y = S.y;
    popUp(ctx, u, 0, y, () => {
      const wx = S.x0 + 20, wy = y - 170; ctx.fillStyle = mixHex(P.ind0, P.blue0, .35); ctx.fillRect(wx, wy, 170, 120);
      const r = prng(33); for (let i = 0; i < 26; i++) { ctx.fillStyle = rgba(LAMP.body, .4 + .4 * r()); ctx.fillRect(wx + 8 + r() * 154, wy + 60 + r() * 52, 3, 3); }
      ctx.strokeStyle = SIL(); ctx.lineWidth = 8; ctx.strokeRect(wx, wy, 170, 120); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(wx + 85, wy); ctx.lineTo(wx + 85, wy + 120); ctx.stroke();
    });
    popUp(ctx, u, 1, y, () => {
      const tx = S.x0 + 250, ty = y - 120; ctx.fillStyle = P.night0; ctx.fillRect(tx, ty, 120, 72); ctx.fillRect(tx + 50, ty + 72, 20, 48);
      ctx.fillStyle = mixHex(P.night1, COOL.body, .7); ctx.fillRect(tx + 6, ty + 6, 108, 60); halo(ctx, tx + 60, ty + 36, 120, .25, COOL.halo, COOL.core);
      for (let i = 0; i < 3; i++) { const run = ((t * 18 + i * 50) % 140) - 20; ctx.fillStyle = rgba(COOL.core, .8); ctx.fillRect(tx + 12, ty + 14 + i * 16, Math.min(96, 50 + run * .3), 6); }
    });
    popUp(ctx, u, 2, y, () => {
      const sx = S.x0 + 40; ctx.fillStyle = SIL(); ctx.beginPath(); ctx.roundRect(sx, y - 56, 170, 40, 10); ctx.fill(); ctx.fillRect(sx - 6, y - 76, 26, 76); ctx.fillRect(sx + 160, y - 76, 26, 76); ctx.fillRect(sx + 6, y - 16, 160, 16);
      ctx.fillRect(S.x0 + 230, y - 30, 120, 8); ctx.fillRect(S.x0 + 240, y - 22, 6, 22); ctx.fillRect(S.x0 + 338, y - 22, 6, 22);
      ctx.fillStyle = mixHex(P.night1, COOL.deep, .5); ctx.fillRect(S.x0 + 268, y - 34, 40, 4);   // the untouched tablet (dark)
    });
  },
  (ctx, t, u, S) => {     // k 4 · YOUR SAY: a town square: a façade with columns, a lamp post, the voting booth with the curtain half open
    const y = S.y;
    popUp(ctx, u, 0, y, () => { ctx.fillStyle = SIL(); ctx.fillRect(S.x0 + 6, y - 150, 120, 150); ctx.fillRect(S.x0, y - 162, 132, 14); for (let i = 0; i < 4; i++) { ctx.fillStyle = rgba(LAMP.body, .35); ctx.fillRect(S.x0 + 16 + i * 28, y - 132, 14, 104); } });
    popUp(ctx, u, 1, y, () => { const bx = S.x0 + 170; ctx.fillStyle = SIL(); ctx.fillRect(bx, y - 120, 76, 8); ctx.fillRect(bx, y - 112, 4, 112); ctx.fillRect(bx + 72, y - 112, 4, 112); ctx.fillStyle = mixHex(P.ind2, GOLD.shade, .25); ctx.fillRect(bx + 4, y - 112, 30, 92); });
    popUp(ctx, u, 2, y, () => { ctx.fillStyle = SIL(); ctx.fillRect(S.x1 - 20, y - 170, 5, 170); ctx.fillRect(S.x1 - 30, y - 176, 24, 10); halo(ctx, S.x1 - 18, y - 166, 50, .3 * u, GOLD.halo, LAMP.core); });
  },
];

// ------------------------------------------------------------------------------------------------ the crowd (subscribe 1)
function crowd(ctx, t, u) {
  const r = prng(77);
  for (let i = 0; i < 16; i++) {
    const k = i < 9 ? 0 : 1, S = STAGES[k], x = lerp(S.x0 + 20, S.x1 - 20, r()), ph = r() * 6, h = 150 + r() * 20, a = clamp(u * 2 - i / 16);
    if (a <= 0) continue; ctx.save(); ctx.globalAlpha *= a; E.person(ctx, x + Math.sin(t * .3 + ph) * 6, S.y, h, { walk: t * 3.2 + ph, dir: 1, light: .5 }); ctx.restore();
  }
}

// ------------------------------------------------------------------------------------------------ the world
export function stairsWorld(ctx, c, t, st = {}) {
  const lit = st.lit ?? [1, 1, 1, 1, 1], d = clamp(st.door ?? 1);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, P.ind0, .35)], [.55, mixHex(P.ind0, P.blue0, .32)], [1, mixHex(P.ind1, P.blue0, .5)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, c, Z_SKY, () => {
    ctx.fillStyle = E.rad(ctx, 2000, 300, 2600, [[0, rgba(P.blue0, .55)], [.6, rgba(P.blue0, .16)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-6000, -4000, 14000, 9000);   // the sky brightens toward the door
    const dw = clamp(st.dawn ?? 0);
    if (dw > 0) {   // thumbnail A, once (c11): a warm band low in the sky and the top of a rising disc (restrained; never a second sun)
      ctx.fillStyle = lin(ctx, 0, 300, 0, 1300, [[0, rgba(GOLD.halo, 0)], [.7, rgba(GOLD.mid, .35 * dw)], [1, rgba(GOLD.hot, .55 * dw)]]); ctx.fillRect(-6000, 300, 14000, 1400);
      const ry = lerp(1500, 1050, sineIO(dw)); ctx.fillStyle = rgba(GOLD.hot, .8 * dw); ctx.beginPath(); ctx.arc(2700, ry, 520, Math.PI, 0); ctx.fill(); halo(ctx, 2700, ry - 120, 1400, .3 * dw, GOLD.halo, GOLD.core);
    }
    E.stars(ctx, 49, 230, t, [-4000, -1600, 12000, 2400], .85 * (1 - .5 * dw));
  });
  const cl = st.clouds ?? 1;
  if (cl > 0) E.card(ctx, c, Z_FAR, () => {
    ctx.globalAlpha = cl;
    cloudBank(ctx, CL_LEFT, mixHex(P.ind1, P.blue0, .55), rgba(P.blue0, .5)); cloudBank(ctx, CL_LEFT2, mixHex(P.ind1, P.blue0, .3), null);
    cloudBank(ctx, CL_FAR_R, mixHex(P.ind1, P.blue0, .45), rgba(P.blue0, .4));
    cloudBank(ctx, CL_LEFT.map(([x, y, r]) => [x - 4200, y + 120, r * 1.1]), mixHex(P.ind1, P.blue0, .4), null);   // more banks far left (the old stair's sky)
    cloudBank(ctx, CL_LEFT2.map(([x, y, r]) => [x - 2600, y + 200, r]), mixHex(P.ind1, P.blue0, .28), null);
  });
  const dc = clamp(st.decades ?? 0);
  if (dc > 0) E.card(ctx, c, Z_PATH, () => {   // the light path into the far distance (c02 DECADES): a narrowing band from behind the landing
    const k = expoOut(dc), x0 = 2050, x1 = lerp(2050, 5200, k), y = 300;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, rgba(GOLD.hot, .5)], [1, rgba(GOLD.hot, .05)]]); ctx.beginPath(); ctx.moveTo(x0, y - 4); ctx.lineTo(x1, y - 22); ctx.lineTo(x1, y - 18); ctx.lineTo(x0, y + 26); ctx.closePath(); ctx.fill();
    if (dc < 1) halo(ctx, x1, y - 20, 60, .5, GOLD.halo, GOLD.core);
    ctx.restore();
  });
  let hands = null;
  E.card(ctx, c, Z_LAND, () => {
    oldStair(ctx, t, st);
    plain(ctx, t, st);
    weddingTable(ctx, t, WEDDING.x0, WEDDING.x1, WEDDING.top, st.wedding ?? { a: 1, lights: 0 });
    doorLight(ctx, t, st);
    landing(ctx, t, st);
    if (st.topTable) weddingTable(ctx, t, 2000, 2440, LANDING.top - TD - 74 + 74 - 74, st.topTable);
    for (let k = 4; k >= 0; k--) block(ctx, t, k, lit[k]);
    for (let k = 0; k < 5; k++) treadGlow(ctx, t, k, lit[k]);
    if (st.nums) numbers(ctx, t, st.nums);
    (st.stage ?? []).forEach((u, k) => { if (u > 0) SETS[k](ctx, t, u, STAGES[k]); });
    if (st.crowd) crowd(ctx, t, st.crowd);
    if (st.laptop) laptop(ctx, t, st.laptop.x ?? 640, STAGES[0].y, st.laptop.s ?? 62, st.laptop);
    // the gold dust: around the door and down along the stairs
    const du = clamp(st.dust ?? 1) * d;
    if (du > 0) { E.dust(ctx, 491, 260, 1560, 300, 300, 200, t, .75 * du, GOLD.line); E.dust(ctx, 492, 200, 1180, 470, 340, 170, t, .5 * du, GOLD.hot); E.dust(ctx, 493, 120, 860, 640, 300, 140, t, .32 * du, GOLD.hot); }
    if (st.until > 0 && st.until < 1) untilSweep(ctx, t, st.until);
    for (const p of st.people ?? []) (p.kind === 'du' ? E.du : E.person)(ctx, p.x, p.y ?? GY, p.h ?? YOU_H, { light: 1, dir: 1, ...(p.o ?? {}) });
    if (st.you !== false) { const y = st.you ?? {}; hands = E.du(ctx, y.x ?? YOU.x, y.y ?? YOU.y, y.h ?? YOU.h, { light: 1, back: .35, dir: 1, look: .8, ...(y.o ?? {}) }); }
    if (st.land) st.land(ctx, hands);
  });
  if (cl > 0) E.card(ctx, c, Z_FG, () => { ctx.globalAlpha = cl; cloudBank(ctx, CL_RIGHT, mixHex(P.ind1, P.blue0, .38), rgba(P.blue0, .6)); ctx.globalAlpha = 1; if (st.fg) st.fg(ctx); });
  else if (st.fg) E.card(ctx, c, Z_FG, st.fg);
  return { hands };
}
// "Until now": the gold of the stairs runs down the five steps, across the plain and over the thinking window (land card, additive). u 0..1
export const UNTIL_PATH = [[1770, 330], [1450, 450], [1200, 560], [930, 690], [660, 815], [420, 940], [-400, 960], [-1400, 960], [-2300, 1000]];
function untilSweep(ctx, t, u) {
  const p = E.catmull ? UNTIL_PATH : UNTIL_PATH;
  F.goldSpan(ctx, p, Math.max(0, u - .5), u, { w: 60, spark: false, a: .14 });   // the broad glow of the wave
  F.goldSpan(ctx, p, Math.max(0, u - .35), u, { w: 14, spark: true });
  const i = Math.min(p.length - 2, Math.floor(u * (p.length - 1))), f = u * (p.length - 1) - i, x = lerp(p[i][0], p[i + 1][0], f), y = lerp(p[i][1], p[i + 1][1], f);
  halo(ctx, x, y - 30, 760, .55 * Math.sin(Math.PI * u), GOLD.halo, GOLD.core);
}
// screen helpers for carriers
export function stepPt(c, k, u = .5, dy = 0) { const s = STEPS[k], p = E.project(c, Z_LAND, lerp(s.L, s.F, u), s.top + dy); return p ? { x: p[0], y: p[1], k: p[2] } : null; }
export function doorPt(c) { const p = E.project(c, Z_LAND, (DOOR.x0 + DOOR.x1) / 2, DOOR.y - 200); return p ? { x: p[0], y: p[1], k: p[2] } : null; }

// ------------------------------------------------------------------------------------------------ cameras of the plates
export const FOOT_CAM = (k = 1, tr = 0) => E.aim(Z_LAND, 150 + tr * .3, 760, 1.0 * k, 960, 540);
export const WORK_CAM = (k = 1, tr = 0) => stageCam(1, 2.4 * k, tr * .2, 0);
export const MACHINE_CAM = (k = 1, tr = 0) => stageCam(3, 2.5 * k, tr * .2, 0);
export const LIT = (cur) => [0, 1, 2, 3, 4].map((i) => (i === cur ? 1 : i < cur ? .6 : .3));   // lit state while year `cur` runs
export const PLATE_FOOT = { youX: 880, laptopX: 640 };
// Lead → B1: the foot (you on tread 0 past the dark laptop, the wedding table waiting at the left)
export function plateFoot(ctx, t, T) {
  const k = creep(t, T, 'Picture a wedding'), c = FOOT_CAM(k, trk(k));
  stairsWorld(ctx, c, t, { old: .6, you: { x: PLATE_FOOT.youX, y: STAGES[0].y, o: { look: .3, back: .2, dir: 1 } }, laptop: { x: PLATE_FOOT.laptopX, on: 0 }, wedding: { a: 1, lights: 0 } });
}
// B1 → B2: step 4 · work (you at the desk with the tool; the calendar on the riser wall closed)
export const WORK_DESK = { x: 1010 };
export function plateWork(ctx, t, T) {
  const k = creep(t, T, 'But you can only do so much'), c = WORK_CAM(k, trk(k));
  stairsWorld(ctx, c, t, { lit: LIT(1), stage: [0, 1, 0, 0, 0], you: { x: WORK_DESK.x - 52, y: STAGES[1].y, o: { pose: 'hold', look: .1, back: .2 } }, land: (cx) => workDesk(cx, t) });
  F.counter(ctx, t, T);
}
export function workDesk(ctx, t, o = {}) {   // the desk at the work stage: the usual work (warm lamp, papers) + the tool (a cool screen); the wall calendar (closed)
  const x = o.x ?? WORK_DESK.x, y = STAGES[1].y;
  ctx.fillStyle = P.night0; ctx.fillRect(x - 70, y - 62, 160, 8); ctx.fillRect(x - 62, y - 54, 6, 54); ctx.fillRect(x + 78, y - 54, 6, 54);
  ctx.fillStyle = rgba(PAPER.lit, .75); ctx.fillRect(x - 54, y - 66, 40, 4); ctx.fillRect(x - 48, y - 70, 36, 4);
  ctx.strokeStyle = P.night0; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 6, y - 62); ctx.lineTo(x + 4, y - 96); ctx.lineTo(x + 18, y - 100); ctx.stroke(); halo(ctx, x + 18, y - 96, 50, .4, GOLD.halo, LAMP.core);
  laptop(ctx, t, x + 52, y - 62, 44, { on: o.toolOn ?? 1 });
  const cx = x + 40, cy = STEPS[2].top + 40, open = clamp(o.calendar ?? 0);   // the wall calendar on riser 2 (above the desk)
  ctx.fillStyle = PAPER.body; ctx.fillRect(cx - 34, cy, 68, 60); ctx.fillStyle = mixHex(GOLD.deep, P.night1, .3); ctx.fillRect(cx - 34, cy, 68, 12);
  if (open > 0) { ctx.fillStyle = rgba(PAPER.ink, .6); for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) ctx.fillRect(cx - 28 + j * 12, cy + 18 + i * 10, 7, 5); }
}
// B2 → B3: step 2 · the machine (the living room, the TV running, the tablet untouched)
export function plateMachine(ctx, t, T) {
  const k = creep(t, T, 'That is what the experts know'), c = MACHINE_CAM(k, trk(k));
  stairsWorld(ctx, c, t, { lit: LIT(3), stage: [0, 0, 0, 1, 0], you: { x: STAGES[3].x0 + 400, y: STAGES[3].y, o: { look: .2, back: .45, dir: -1 } } });
  F.counter(ctx, t, T);
}

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// The whole stairs at dawn-less night from a little below, every stage lit, the door open; you small on the landing at the table; the
// lower third calm and dark for the two YouTube tiles and the subscribe circle (END_TILES). No text. Slow push (never still). B3 owns c12 and may
// refine it (keep the lower half calm).
export const END_CAM = E.aim(Z_LAND, 1250, 640, .72, 960, 430);
export const END_TILES = { left: { x: 80, y: 640, w: 640, h: 360 }, right: { x: 1200, y: 640, w: 640, h: 360 }, sub: { x: 960, y: 930, r: 80 } };
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, k = 1 + .005 * Math.max(0, t - t0), c = E.aim(Z_LAND, 1250 + 5 * Math.max(0, t - t0), 640, .72 * k, 960, 430);
  stairsWorld(ctx, c, t, { lit: [1, 1, 1, 1, 1], stage: [1, 1, 1, 1, 1], old: .5, you: { x: 1980, y: LANDING.top - TD * .45, h: YOU_H, o: { look: .5, back: .3 } }, topTable: { a: 1, lights: 1 } });
}
