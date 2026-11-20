// Film 15 · B2 · c09 (271.60 – 306.24, and on into c10 until the camera is back inside the room) · Station 6, anchor 3, the turn.
//   9.01  the morning stroke (STROKE plate) is the slash of a tally; four strokes grow under it; the camera pulls back and the night
//         sky fills with tallies (a wave of writing that keeps just ahead of the frame), a planet's curved horizon below.
//         3.5 MILLION · CASES A YEAR · 1986 · THE CARTER CENTER on "million"
//   9.02  on "twenty-five" the strokes crumble to chalk dust row by row and fall to the ground, until ten remain (two groups);
//         10 · CASES · 2025; on "planet" a pull back: ten small strokes above the curve of the whole planet
//   9.03  a thin trickle of chalk dust falls from the warm slash; the camera follows it down to a village at night: it falls into a
//         woman's pot, water pours through a cloth filter into a jug ("filters"), a teacher chalks on a board ("Teaching"), a
//         woman counts in a notebook under a lamp ("counted … year after year")
//   9.04  the notebook, close: tallies on the left page, SMALLPOX struck through, GUINEA WORM struck only halfway ("over");
//         pull back, a dog runs past the well towards the last hut ("Dogs")
//   9.05★ on "Progress" the camera flies into the hut's window: a still room, an empty bed under a window of moonlight, dust in the
//         light. After "bed" the camera pulls back out of the window, and the window is compartment 1 of THE BOX (top view, as in
//         the hook); INFECTIONS glows, the room's light turns to morning: because something stopped.
// Everything stands on the focus card F0 (one big design space: the tally sky above y 1300, the planet / village below it).
import { Path2D } from '@napi-rs/canvas';
import { createCanvas } from '@napi-rs/canvas';
import * as C from './f15_b2_common.mjs';
import { STROKE } from './f15_b2_c08.mjs';
const { E, F } = C;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, aim, camDrift, F0, prng } = E;

// ------------------------------------------------------------------------------------------------ camera: views with log zoom
// a view: design point (u, v) of F0 at screen (sx, sy), magnified s, roll. A segment glides the NEXT view's target from where it
// sits under the previous camera to its own screen point while the scale changes in log space (a constant-speed push).
export function V(u, v, s, o = {}) { return { u, v, s, sx: o.sx ?? W / 2, sy: o.sy ?? H / 2, roll: o.roll ?? 0, e: o.e ?? 's' }; }
const EASE = { s: sineIO, q: quartIO, o: expoOut, l: (u) => u, so: (u) => 1 - (1 - u) ** 2.2, si: (u) => u ** 1.8 };
const CHECKED = new WeakSet();
export function viewCam(t, K) {
  if (!CHECKED.has(K)) { CHECKED.add(K); K.forEach((k, i) => { if (i && k[0] < K[i - 1][0]) console.warn(`viewCam: key ${i} at ${k[0].toFixed(2)} before key ${i - 1} at ${K[i - 1][0].toFixed(2)}`); }); }
  if (t <= K[0][0]) return toCam(K[0][1]);
  if (t >= K[K.length - 1][0]) return toCam(K[K.length - 1][1]);
  let i = 0; while (t > K[i + 1][0]) i++;
  const A = K[i][1], B = K[i + 1][1], e = EASE[B.e](span(t, K[i][0], K[i + 1][0]));
  // where B's target sits under view A (F0: screen = s (p − u) + sx)
  // the anchor is the target of the closer view: a push glides B's target in, a pull back keeps A's target and lets it settle
  const s = Math.exp(lerp(Math.log(A.s), Math.log(B.s), e)), roll = lerp(A.roll, B.roll, e);
  if (B.s < A.s) {
    const p1x = B.sx + (A.u - B.u) * B.s, p1y = B.sy + (A.v - B.v) * B.s;
    return toCam({ u: A.u, v: A.v, s, sx: lerp(A.sx, p1x, e), sy: lerp(A.sy, p1y, e), roll });
  }
  const p0x = A.sx + (B.u - A.u) * A.s, p0y = A.sy + (B.v - A.v) * A.s;
  return toCam({ u: B.u, v: B.v, s, sx: lerp(p0x, B.sx, e), sy: lerp(p0y, B.sy, e), roll });
}
const toCam = (v) => ({ ...aim(F0, v.u, v.v, v.s, v.sx, v.sy, Math.max(F0, 80 * v.s)), roll: v.roll || 0 });

// ------------------------------------------------------------------------------------------------ geometry
const HZ = 1300, RP = 20000, PCX = 1100;                    // the planet: horizon top at y HZ (x PCX), radius RP
export const planetY = (x) => HZ + RP - Math.sqrt(Math.max(0, RP * RP - (x - PCX) ** 2));
const G0 = { x: STROKE.x, y: STROKE.y };                    // tally group 0: its slash IS the plate's stroke
const SL = -.32, ROLL0 = STROKE.ang - SL;                   // the slash's design angle; the camera starts rolled so it reads at STROKE.ang
const D = 90, HV = 262, PX = 560, PY = 440;                 // stroke spacing, stroke height, grid pitch
const ROWS = 13, COLS = 15;                                 // rows above group 0 (i = -ROWS..0), columns ±COLS
// the village (ground y per element)
const GY = 1650;
const WELL = { x: 2620, y: 1660 }, FIL = { x: 1060, y: GY }, BOARD = { x: 1560, y: 1380, w: 230, h: 150 }, TEACH = { x: 1850, y: 1640 };
const DESK = { x: 2280, y: GY, top: 1560 }, LAMP = { x: 2352, y: 1560 }, NB = { x: 2268, y: 1558, w: 104, h: 68 };
const HUT = { x: 3000, y: 1700, w: 330, h: 300 }, WIN = { x: 3000 - 30, y: 1478, w: 60 };   // the room's window (h set from the box cell)

// ------------------------------------------------------------------------------------------------ the box (anchor 3, top view)
export const BOX = { x: 960, w: 1240 }; BOX.y = 540 + .22 * BOX.w;
export const LABELS = ['INFECTIONS', 'CANCER', "ALZHEIMER'S", 'MENTAL ILLNESS', 'LIFESPAN ×2', 'POORER COUNTRIES'];
const scratch = createCanvas(8, 8).getContext('2d');
export const BOXG = F.box10(scratch, BOX.x, BOX.y, BOX.w, 0, { beta: 1, lid: .56 });
export const CELL0 = BOXG.cells[0];
WIN.h = WIN.w * CELL0.h / CELL0.w;

// ------------------------------------------------------------------------------------------------ the room (portal content)
// design space 1920 wide, drawn by its own camera (the window / the cell maps its width to W). Floor at 860.
export const ROOM = { floor: 860, win: { x: 790, y: 150, w: 340, h: 360 }, bed: { x0: 560, x1: 1240, top: 690 }, table: { x: 1330, w: 120, top: 742 }, wallX: 2060 };
export function drawRoom(ctx, t, c, o = {}) {
  const warm = clamp(o.warm ?? 0), a = 1;
  card(ctx, c, F0, (k) => {
    const R = ROOM;
    // wall and floor
    // outside the room (to the right of its wall): the open night, where the floor runs on (c10)
    ctx.fillStyle = E.lin(ctx, 0, -900, 0, R.floor, [[0, P.night0], [.6, P.ind0], [1, mixHex(P.ind1, P.ind0, .3)]]); ctx.fillRect(R.wallX, -900, 6000, R.floor + 900);
    ctx.fillStyle = E.lin(ctx, 0, -700, 0, R.floor, [[0, P.night0], [.45, P.ind0], [1, mixHex(P.ind1, P.ind0, .4)]]); ctx.fillRect(-1600, -900, R.wallX + 1600, R.floor + 900);
    ctx.fillStyle = rgba(P.blue0, .7); ctx.fillRect(R.wallX - 3, -900, 3, R.floor + 900);
    ctx.fillStyle = E.lin(ctx, 0, R.floor, 0, 1900, [[0, P.night1], [1, P.night0]]); ctx.fillRect(-1600, R.floor, 9000, 1400);
    ctx.fillStyle = rgba(P.blue0, .55); ctx.fillRect(-1600, R.floor - 1, 9000, 2);
    // the window light on the wall round the window (a soft bloom) and the light falling to the floor (shaft + patch)
    const wn = R.win, wcx = wn.x + wn.w / 2, col = mixHex(F.COOL, P.halo1, warm);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, wcx, wn.y + wn.h * .5, 900, [[0, rgba(mixHex(P.blue0, P.halo1, warm), .4)], [.5, rgba(P.blue0, .12)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-1000, -800, 4000, 2700);
    const sh = new Path2D(); sh.moveTo(wn.x, wn.y + wn.h); sh.lineTo(wn.x + wn.w, wn.y + wn.h); sh.lineTo(wn.x + wn.w + 330, R.floor + 150); sh.lineTo(wn.x + 190, R.floor + 150); sh.closePath();
    ctx.fillStyle = E.lin(ctx, 0, wn.y + wn.h, 0, R.floor + 150, [[0, rgba(col, .16)], [1, rgba(col, .03)]]); ctx.fill(sh);
    ctx.restore();
    // the window itself: the hero light (cool moon → warm morning), cross mullions, a deep sill
    const wp = new Path2D(); wp.rect(wn.x, wn.y, wn.w, wn.h);
    C.lightBody(ctx, wp, t, { g: { x: wcx - 40, y: wn.y + wn.h * .35, R: wn.w * .95 }, lit: warm, glow: .9, blurR: wn.w * .8 });
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(wcx - 7, wn.y, 14, wn.h); ctx.fillRect(wn.x, wn.y + wn.h * .45 - 7, wn.w, 14);
    ctx.fillStyle = P.night1; ctx.fillRect(wn.x - 22, wn.y + wn.h, wn.w + 44, 18); ctx.fillStyle = rgba(col, .6); ctx.fillRect(wn.x - 22, wn.y + wn.h, wn.w + 44, 2);
    // a thin curtain on the left of the window, moving a little in the night air
    { const cx0 = wn.x - 30, sway = Math.sin(t * .7) * 10 + Math.sin(t * 1.3) * 4, cp = new Path2D(); cp.moveTo(cx0, wn.y - 30); cp.lineTo(cx0 + 90, wn.y - 30);
      cp.bezierCurveTo(cx0 + 80 + sway * .3, wn.y + 120, cx0 + 60 + sway, wn.y + 260, cx0 + 70 + sway * 1.2, wn.y + wn.h + 40); cp.lineTo(cx0 - 10 + sway * .6, wn.y + wn.h + 50); cp.closePath();
      ctx.fillStyle = E.lin(ctx, cx0, 0, cx0 + 90, 0, [[0, rgba(mixHex(P.ind2, P.blue1, .5), .95)], [1, rgba(mixHex(F.COOL, P.halo2, warm), .5)]]); ctx.fill(cp);
      ctx.fillStyle = P.night1; ctx.fillRect(wn.x - 50, wn.y - 36, wn.w + 100, 8); }
    E.dust(ctx, 905, 900, wcx + 120, R.floor - 210, 260, 260, t, .55, mixHex(F.COOL_HI, P.core1, warm));
    // the bed: frame, mattress with a smooth sheet (lit from the window), a pillow, the blanket folded at the foot. Empty.
    const b = R.bed, lit = (y0, y1) => E.lin(ctx, 0, y0, 0, y1, [[0, mixHex(mixHex(P.cream, F.COOL, .45), P.core1, warm)], [1, mixHex(mixHex(F.COOL, P.blue2, .5), P.halo1, warm * .8)]]);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(b.x0 - 30, b.top - 150, 26, R.floor - b.top + 150); ctx.fillRect(b.x1 + 4, b.top - 40, 22, R.floor - b.top + 40);
    ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(b.x0 - 30, b.top - 150, 26, 3); ctx.fillRect(b.x1 + 4, b.top - 40, 22, 3);
    ctx.fillStyle = P.night1; ctx.fillRect(b.x0, b.top + 62, b.x1 - b.x0, 26);
    ctx.fillStyle = rgba(P.night0, .7); ctx.beginPath(); ctx.ellipse((b.x0 + b.x1) / 2, R.floor + 4, (b.x1 - b.x0) * .58, 14, 0, 0, 6.29); ctx.fill();
    for (const lx of [b.x0 + 10, b.x1 - 30]) { ctx.fillStyle = P.night1; ctx.fillRect(lx, b.top + 80, 20, R.floor - b.top - 80); }
    const mat = new Path2D(); mat.roundRect(b.x0, b.top, b.x1 - b.x0, 66, 14);
    ctx.fillStyle = lit(b.top, b.top + 66); ctx.fill(mat);
    ctx.fillStyle = rgba(P.night1, .35); ctx.fillRect(b.x0 + 6, b.top + 52, b.x1 - b.x0 - 12, 14);
    const pil = new Path2D(); pil.roundRect(b.x0 + 18, b.top - 30, 150, 44, 20); ctx.fillStyle = lit(b.top - 30, b.top + 14); ctx.fill(pil);
    ctx.fillStyle = rgba(P.night1, .25); ctx.fillRect(b.x0 + 30, b.top + 4, 130, 6);
    const bl = new Path2D(); bl.roundRect(b.x1 - 200, b.top - 18, 180, 40, 10); ctx.fillStyle = E.lin(ctx, 0, b.top - 18, 0, b.top + 22, [[0, mixHex(mixHex(P.halo2, F.COOL, .5), P.halo0, warm)], [1, mixHex(P.blue2, P.halo1, warm)]]); ctx.fill(bl);
    ctx.fillStyle = rgba(P.night1, .3); ctx.fillRect(b.x1 - 200, b.top + 1, 180, 3);
    // the window's light falls across the sheet (a warm/cool sheen)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.clip(mat);
    ctx.fillStyle = E.rad(ctx, wcx + 60, b.top + 10, 360, [[0, rgba(col, .35)], [1, rgba(col, 0)]]); ctx.fillRect(b.x0, b.top - 40, b.x1 - b.x0, 120); ctx.restore();
    // the bedside table (the pack lies on it: c10)
    const tb = R.table; ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(tb.x, tb.top, tb.w, R.floor - tb.top);
    ctx.fillStyle = rgba(P.blue0, .8); ctx.fillRect(tb.x, tb.top, tb.w, 3); ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(tb.x + 10, tb.top + 34, tb.w - 20, 3);
    if (o.extra) o.extra(ctx, k);
  });
}

// ------------------------------------------------------------------------------------------------ small drawings (village)
function tukul(ctx, x, yb, w, h, o = {}) {            // a round hut: mud wall, conical thatch roof; rim from the upper left
  const bh = h * .5, rw = w * .62;
  ctx.fillStyle = E.lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.ind2, P.blue1, .35)], [.45, P.ind1], [1, P.night1]]);
  ctx.beginPath(); ctx.moveTo(x - w / 2, yb); ctx.lineTo(x - w / 2, yb - bh); ctx.lineTo(x + w / 2, yb - bh); ctx.lineTo(x + w / 2, yb); ctx.closePath(); ctx.fill();
  const roof = new Path2D(); roof.moveTo(x - rw, yb - bh + h * .04); roof.quadraticCurveTo(x - rw * .45, yb - h * .82, x, yb - h); roof.quadraticCurveTo(x + rw * .45, yb - h * .82, x + rw, yb - bh + h * .04); roof.closePath();
  ctx.fillStyle = E.lin(ctx, x - rw, 0, x + rw, 0, [[0, mixHex(P.ind2, P.blue1, .5)], [.5, P.ind1], [1, P.night0]]); ctx.fill(roof);
  ctx.strokeStyle = rgba(P.blue0, .85); ctx.lineWidth = Math.max(1.5, w * .012); ctx.beginPath(); ctx.moveTo(x - rw, yb - bh + h * .04); ctx.quadraticCurveTo(x - rw * .45, yb - h * .82, x, yb - h); ctx.stroke();
  ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - w / 2, yb - bh + h * .04, w, h * .05);
  if (o.door) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(x + w * .1, yb - bh * .72, w * .2, bh * .72, [w * .1, w * .1, 0, 0]); ctx.fill(); }
  if (o.win) { const ww = w * .12, wy = yb - bh * .62; ctx.fillStyle = rgba(P.core1, o.win); ctx.fillRect(x - w * .28, wy, ww, ww * 1.1); E.halo(ctx, x - w * .28 + ww / 2, wy + ww * .55, ww * 3, .25 * o.win, P.halo1, P.core1); }
}
function well(ctx, x, y) {                              // stone ring with two posts, crossbar, rope and bucket
  const w = 150, h = 62;
  ctx.fillStyle = P.night1; ctx.fillRect(x - w * .42, y - h - 120, 12, 124); ctx.fillRect(x + w * .42 - 12, y - h - 120, 12, 124);
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.fillRect(x - w * .48, y - h - 126, w * .96, 12);
  ctx.strokeStyle = rgba(P.blue2, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - h - 114); ctx.lineTo(x, y - h - 40); ctx.stroke();
  ctx.fillStyle = P.ind1; ctx.beginPath(); ctx.moveTo(x - 14, y - h - 42); ctx.lineTo(x + 14, y - h - 42); ctx.lineTo(x + 11, y - h - 18); ctx.lineTo(x - 11, y - h - 18); ctx.closePath(); ctx.fill();
  ctx.fillStyle = E.lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.ind2, P.blue1, .4)], [.5, P.ind1], [1, P.night1]]); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(x, y - h, w / 2, 16, 0, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, y - h, w / 2, 16, 0, Math.PI, 2 * Math.PI); ctx.stroke();
  ctx.strokeStyle = rgba(P.night0, .45); ctx.lineWidth = 2; for (const k of [.33, .66]) { ctx.beginPath(); ctx.moveTo(x - w / 2, y - h * k); ctx.lineTo(x + w / 2, y - h * k); ctx.stroke(); }
}
function jug(ctx, x, y, h) {                            // a clay jug, (x, y) bottom centre; returns the mouth [x, y, r]
  const w = h * .8, p = new Path2D();
  p.moveTo(x - w * .22, y); p.bezierCurveTo(x - w * .62, y - h * .1, x - w * .6, y - h * .62, x - w * .22, y - h * .8); p.lineTo(x - w * .25, y - h);
  p.lineTo(x + w * .25, y - h); p.lineTo(x + w * .22, y - h * .8); p.bezierCurveTo(x + w * .6, y - h * .62, x + w * .62, y - h * .1, x + w * .22, y); p.closePath();
  ctx.fillStyle = E.lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.ind2, P.blue1, .45)], [.5, P.ind1], [1, P.night1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2; ctx.stroke(p);
  return [x, y - h, w * .25];
}
function dog(ctx, x, y, h, ph, dir = 1) {               // a running dog, side view, (x, y) between the paws; h = height at the back
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * h / 100, h / 100);
  const bob = 3 * Math.sin(ph * 2), body = new Path2D();
  body.ellipse(0, -62 + bob, 52, 17, -.04, 0, 6.29);
  body.ellipse(52, -84 + bob, 15, 13, 0, 0, 6.29); body.moveTo(60, -90 + bob); body.lineTo(84, -80 + bob); body.lineTo(62, -74 + bob); body.closePath();
  body.moveTo(44, -96 + bob); body.lineTo(48, -114 + bob); body.lineTo(56, -96 + bob); body.closePath();
  body.moveTo(36, -74 + bob); body.lineTo(48, -90 + bob); body.lineTo(58, -70 + bob); body.closePath();
  ctx.fillStyle = E.lin(ctx, 0, -110, 0, -40, [[0, mixHex(P.ind2, P.blue1, .4)], [1, P.night1]]); ctx.fill(body);
  ctx.strokeStyle = mixHex(P.ind2, P.night1, .3); ctx.lineCap = 'round';
  const leg = (bx, by, sw) => { ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(bx, by + bob); const kx = bx + 16 * Math.sin(sw), ky = by + 26 + bob; ctx.lineTo(kx, ky); ctx.lineTo(kx + 10 * Math.sin(sw + .9), -2); ctx.stroke(); };
  leg(36, -56, ph); leg(28, -56, ph + 2.6); leg(-38, -56, ph + 1.4); leg(-44, -56, ph + 4);
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-50, -66 + bob); ctx.quadraticCurveTo(-74, -84 + bob + 6 * Math.sin(ph * 2), -86, -78 + bob); ctx.stroke();
  ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(0, -62 + bob, 52, 17, -.04, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the set
export function setW(T) {
  const S9 = (w, n) => T.S('s09', w, n);
  const a = {
    T9: T.seg('s09').start, eighty: S9('eighty-six'), guinea: S9('Guinea'), million: S9('million'), In: S9('In twenty'), tf: S9('twenty-five'),
    ten: S9('Ten'), planet: S9('planet'), nodrug: S9('No drug'), vaccine: S9('vaccine'), water: S9('Water'), filters: S9('filters'),
    teaching: S9('Teaching'), counted: S9('counted'), onebyone: S9('one by one'), yearafter: S9('year after'), could: S9('It could'),
    second: S9('second'), smallpox: S9('smallpox'), over: S9('over'), dogs: S9('Dogs'), worm: S9('worm.'), progress: S9('Progress'),
    headline: S9('headline'), empty: S9('empty'), bed: S9('bed'), T10: T.seg('s10').start,
    machine: T.S('s10', 'machine'), then: T.S('s10', 'Then'), already: T.S('s10', 'already'),
  };
  const DRIFT = 1.4;

  // -------------------------------------------------------------------------------------------- tally groups (built once)
  // group: centre, rotation, four vertical strokes (dx, len, tilt) and the slash; write time tw, fall time tf (row by row)
  const r = prng(909), groups = [];
  for (let i = -ROWS; i <= 0; i++) for (let j = -COLS; j <= COLS; j++) {
    const hero = i === 0 && (j === 0 || j === 1);
    const g = { i, j, hero, x: G0.x + j * PX + (hero ? 0 : (r() - .5) * 60), y: G0.y + i * PY + (hero ? 0 : (r() - .5) * 50) + (j === 1 && i === 0 ? 6 : 0),
      rot: hero ? (j ? .03 : 0) : (r() - .5) * .1, v: [], slash: SL + (hero ? (j ? -.02 : 0) : (r() - .5) * .08), sl: hero && !j ? STROKE.len : 400 + r() * 40 };
    for (let q = 0; q < 4; q++) g.v.push({ dx: (q - 1.5) * D + (r() - .5) * 10, len: HV * (.93 + r() * .1), tilt: (r() - .5) * .07, dy: (r() - .5) * 14 });
    g.dist = Math.hypot(g.x - G0.x, g.y - G0.y); g.rr = r();
    groups.push(g);
  }
  const g0 = groups.find((g) => g.hero && g.j === 0), g1 = groups.find((g) => g.hero && g.j === 1);
  const others = groups.filter((g) => !g.hero);

  // -------------------------------------------------------------------------------------------- camera keys
  const tPull0 = a.T9 + .3, tWide = a.million + 1.0;
  const KT = [
    [a.T9, V(G0.x, G0.y, 1, { roll: ROLL0 })],
    [tPull0, V(G0.x, G0.y, .985, { roll: ROLL0 * .97 })],
    [tWide, V(1100, 550, .2, { e: 's' })],
    [a.ten - .15, V(1120, 540, .194)],
    [a.ten + 1.5, V(1240, 560, .3, { sy: 470 })],
    [a.planet + .55, V(1240, 700, .1, { sy: 420 })],
    [a.filters - .1, V(1110, 1520, 1.7, { e: 's' })],
    [a.filters + .3, V(1140, 1518, 1.72)],
    [a.teaching + 1.3, V(1690, 1515, 1.6)],
    [a.counted + 1.9, V(2240, 1515, 1.85)],                   // (keys must stay in time order: teaching+1.3 is after counted-.9)
    [a.could - .4, V(2250, 1512, 1.95)],
    [a.second + .45, V(NB.x, NB.y - NB.h * .5, 8.2, { e: 's' })],
    [a.over + .35, V(NB.x, NB.y - NB.h * .5, 8.9)],
    [a.dogs + 1.6, V(2560, 1500, 1.0)],
    [a.progress - .2, V(2600, 1500, .98)],
  ];
  // the window: fly in on "Progress" until it covers the frame, a slow push inside, then the pull back (outside = the box)
  const tIn = [a.progress - .2, a.progress + 1.55], tInside = a.bed + .35, tOut = [tInside, a.T10 + .75];
  const sFull = 1.04 * Math.max(W / WIN.w, H / WIN.h), wcx = WIN.x + WIN.w / 2, wcy = WIN.y + WIN.h / 2;
  // screen rect of the portal (centre + width) during the inside part
  const portal = (t) => {
    if (t < tIn[1]) return null;
    const u = span(t, tIn[1], tOut[0]), sw = WIN.w * sFull * Math.exp(Math.log(1.1) * sineIO(u));
    return { sw, sx: W / 2, sy: H / 2 };
  };
  const tBox = tInside;          // from here the outside of the portal is the box
  const sBox0 = WIN.w * sFull * 1.1 / CELL0.w;
  const KB = [[tOut[0], V(CELL0.cx, CELL0.cy, sBox0)], [tOut[1], V(960, 540, 1.2, { e: 's' })], [a.already + 0.0, V(960, 540, 1.17, { e: 's' })]];
  const camW = (t) => {
    let c;
    if (t < tIn[0]) c = viewCam(t, KT);
    else if (t < tBox) {
      const K = [[tIn[0], KT[KT.length - 1][1]], [tIn[1], V(wcx, wcy, sFull, { e: 'si' })], [tOut[0], V(wcx, wcy, sFull * 1.1, { e: 's' })]];
      c = viewCam(t, K);
    } else c = viewCam(t, KB);
    const dk = t < tBox ? smooth(span(t, a.T9, a.T9 + 1.6)) * (1 - smooth(span(t, tIn[0], tIn[1]))) : smooth(span(t, tBox, tBox + 1.6));
    return camDrift(c, t, DRIFT * dk);
  };

  // -------------------------------------------------------------------------------------------- tally timing
  // write: a wave from group 0 outwards that keeps just ahead of the frame edge as the camera pulls back
  const sAt = (t) => viewCam(t, KT);
  for (const g of groups) {
    if (g === g0) { g.tw = a.T9 - 10; continue; }
    if (g === g1) { g.tw = a.T9 + .38; continue; }
    let tw = a.T9 + .5 + g.dist / 1600;
    for (let t = a.T9; t < tWide + 1; t += .05) { const c = sAt(t), k = F0 / (F0 - c.z) * 1; if (g.dist < 1150 / k * 1.02) { tw = Math.max(tw, t - .25); break; } }
    g.tw = tw + g.rr * .12;
    g.tf = a.In + .1 + ((g.i + ROWS) / ROWS) * 1.05 + g.rr * .12;
  }
  const g0V = [a.T9 + .05, a.T9 + .15, a.T9 + .25, a.T9 + .35];   // group 0's verticals grow under the slash

  // stroke endpoints (design) for group g: vertical q at write share u (top → bottom), slash at share u (left → right)
  const vEnds = (g, q) => { const v = g.v[q], c = Math.cos(g.rot), s = Math.sin(g.rot), lx = v.dx, t0 = -v.len / 2 + v.dy, t1 = v.len / 2 + v.dy;
    const P0 = [lx + Math.sin(v.tilt) * t0, t0], P1 = [lx + Math.sin(v.tilt) * t1, t1];
    return [[g.x + P0[0] * c - P0[1] * s, g.y + P0[0] * s + P0[1] * c], [g.x + P1[0] * c - P1[1] * s, g.y + P1[0] * s + P1[1] * c]]; };
  const sEnds = (g) => { const an = g.slash + g.rot, L = g.sl / 2; return [[g.x - Math.cos(an) * L, g.y - Math.sin(an) * L], [g.x + Math.cos(an) * L, g.y + Math.sin(an) * L]]; };
  for (const g of groups) { g.V = [0, 1, 2, 3].map((q) => vEnds(g, q)); g.S = sEnds(g); }
  const pt = (A, B, u) => [lerp(A[0], B[0], u), lerp(A[1], B[1], u)];
  const DUR = .16, wv = (g, q) => [g.tw + q * .07, g.tw + q * .07 + DUR], ws = (g) => [g.tw + .3, g.tw + .3 + DUR * 1.2];

  // -------------------------------------------------------------------------------------------- draw: the tally sky + the planet
  const TRK = { x: (g0.S[1][0]), y: g0.S[1][1] }, tTr = [a.planet - .1, a.filters - .4];       // the trickle from the warm slash
  const POT = { x: TRK.x, y: 1474 };
  function tally(ctx, t, k) {
    const lw = Math.max(13, 2.4 / k);
    // others, batched in one path: written share, then crumbling (top → bottom) when their row falls
    const path = new Path2D(), dustPts = [];
    for (const g of others) {
      if (t < g.tw) continue;
      const tf = g.tf, fk = t >= tf ? span(t, tf, tf + .32) : 0;
      if (fk >= 1 && t > tf + 1.5) continue;
      const strokes = [];
      g.V.forEach(([A, B], q) => { const u = span(t, ...wv(g, q)); if (u > 0) strokes.push([A, B, u]); });
      const us = span(t, ...ws(g)); if (us > 0) strokes.push([g.S[0], g.S[1], us]);
      for (const [A, B, u] of strokes) {
        if (fk < 1) { const P0 = pt(A, B, fk * u), P1 = pt(A, B, u); path.moveTo(P0[0], P0[1]); path.lineTo(P1[0], P1[1]); }
        if (t >= tf) dustPts.push([A, B, u, tf, g.rr]);
      }
    }
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = rgba(P.blue0, .2); ctx.lineWidth = lw * 2.6; ctx.stroke(path);
    ctx.strokeStyle = rgba(mixHex(P.cream, F.COOL, .3), .5); ctx.lineWidth = lw; ctx.stroke(path);
    ctx.restore();
    // chalk dust: each stroke breaks into crumbs from the top; the crumbs fall (gravity), shrink, and rest on the ground
    if (dustPts.length) {
      ctx.fillStyle = rgba(mixHex(P.cream, F.COOL, .3), .85);
      for (const [A, B, u, tf, rr] of dustPts) for (let n = 0; n < 6; n++) {
        const f = n / 5 * u, t0 = tf + .32 * (f / Math.max(u, .01)), tau = t - t0; if (tau <= 0 || tau > 1.1) continue;
        const [x0, y0] = pt(A, B, f), sx = Math.sin(n * 12.9 + rr * 40) * 40, y = Math.min(planetY(x0) - 6, y0 + 2400 * tau * tau + 80 * tau), sz = Math.max(1.2 / k, 24 * (1 - tau / 1.1));
        ctx.fillRect(x0 + sx * tau - sz / 2, y - sz / 2, sz, sz);
      }
    }
    // the two groups that remain (and group 0's slash = the plate's stroke): real chalk with glow
    for (const g of [g0, g1]) {
      g.V.forEach(([A, B], q) => { const u = g === g0 ? span(t, g0V[q], g0V[q] + .22) : span(t, ...wv(g, q)); if (u > 0) C.chalk(ctx, A, pt(A, B, u), 14, 1, { warm: 0, glow: 1, grain: false }); });
      const us = g === g0 ? 1 : span(t, ...ws(g));
      if (us > 0) C.chalk(ctx, g.S[0], pt(g.S[0], g.S[1], us), g === g0 ? STROKE.w * (1 + .03 * Math.sin(t * 1.7)) : 14, 1, { warm: g === g0 ? .55 : 0, glow: 1, grain: false });
    }
    // the trickle: chalk dust pouring from the warm slash's end straight down into the pot (the carrier into the village)
    if (t > tTr[0] && t < tTr[1] + 1.2) {
      ctx.fillStyle = rgba(mixHex(P.cream, P.halo0, .4), .9);
      for (let n = 0; n < 90; n++) {
        const t0 = tTr[0] + n * (tTr[1] - tTr[0]) / 90, tau = t - t0; if (tau < 0) continue;
        const y = TRK.y + 10 + 1150 * tau * tau + 120 * tau; if (y > POT.y - 6) continue;
        const sz = Math.max(1.1 / k, 7 + 3 * Math.sin(n * 7.1));
        ctx.fillRect(TRK.x + 5 * Math.sin(n * 3.7) - sz / 2, y - sz / 2, sz, sz);
      }
    }
  }
  function planet(ctx, t, k, cam) {
    // the night ground of the whole planet: a huge disc, lit rim (where the dust settles), faint atmosphere above
    const x0 = (0 - (cam.x + W / 2 * 0)) , view = 1 / k;
    const atm = smooth(span(t, a.T9 + .1, a.T9 + 1.8));     // the atmosphere comes up after the stroke plate (which has none)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, PCX, HZ + RP, RP + 1400, [[RP / (RP + 1400), rgba(P.blue0, .22 * atm)], [1, rgba(P.blue0, 0)]]); ctx.beginPath(); ctx.arc(PCX, HZ + RP, RP + 1400, 0, 6.29); ctx.fill();
    ctx.restore();
    ctx.fillStyle = E.rad(ctx, PCX, HZ + RP, RP, [[.93, P.night0], [.985, P.night1], [.997, mixHex(P.ind2, P.night1, .4)], [1, P.ind2]]);
    ctx.beginPath(); ctx.arc(PCX, HZ + RP, RP, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = Math.max(3, 1.6 / k); ctx.beginPath(); ctx.arc(PCX, HZ + RP, RP, Math.PI * 1.25, Math.PI * 1.75); ctx.stroke();
    // the chalk dust that has landed: a fine pale line on the rim, growing while the rows fall
    const landed = smooth(span(t, a.In + .6, a.ten + .9));
    if (landed > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(mixHex(P.cream, F.COOL, .3), .55 * landed); ctx.lineWidth = Math.max(5, 2.2 / k); ctx.beginPath(); ctx.arc(PCX, HZ + RP - 4, RP, Math.PI * 1.5 - .45, Math.PI * 1.5 + .45); ctx.stroke(); ctx.restore(); }
  }

  // -------------------------------------------------------------------------------------------- draw: the village
  const HUTS = []; { const rh = prng(919); for (let x = -900; x < 4200; x += 150 + rh() * 170) { const s = .7 + rh() * .6; HUTS.push([x, 120 * s, 110 * s, rh() < .3 ? .55 + rh() * .4 : 0]); } }
  const TUFTS = []; { const rt = prng(929); for (let x = 300; x < 3600; x += 120 + rt() * 220) TUFTS.push([x, 1790 + rt() * 90, .8 + rt() * .8]); }
  const TREES = [[420, 1.2], [1330, .9], [2060, 1.1], [3060, 1.3], [-300, 1]];
  const hands = (o) => E.person(scratch, 0, 0, 1, o);
  const WOMAN = { x: FIL.x - 150, h: 262, pose: { dir: 1, armR: [1.45, .55], armL: [1.15, .95], lean: .06, look: .15 } };
  const POTH = hands(WOMAN.pose).R;
  WOMAN.x = POT.x - 46 - POTH[0] * WOMAN.h;                 // she holds the pot right under the trickle
  const JUG = { x: POT.x + 70, y: GY + 6, h: 110 };
  const COUNTER = { x: DESK.x - 112, h: 258 };
  function village(ctx, t, k) {
    const inV = t > a.planet - 1;
    if (!inV) return;
    // far huts and trees on the horizon (on the planet's rim), tiny warm windows
    for (const [x, w, h, wn] of HUTS) tukul(ctx, x, planetY(x) + 4, w, h, { win: wn });
    for (const [x, s] of TREES) { const y = planetY(x) + 2; ctx.fillStyle = P.night1; ctx.fillRect(x - 5 * s, y - 120 * s, 10 * s, 120 * s); ctx.fillStyle = E.lin(ctx, x - 90 * s, 0, x + 90 * s, 0, [[0, mixHex(P.ind2, P.blue1, .4)], [1, P.night1]]); ctx.beginPath(); ctx.ellipse(x, y - 140 * s, 95 * s, 34 * s, 0, 0, 6.29); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y - 140 * s, 95 * s, 34 * s, 0, Math.PI * 1.05, Math.PI * 1.7); ctx.stroke(); }
    // the well
    well(ctx, WELL.x, WELL.y);
    // near ground: tufts of grass and stones (dark, a blue rim), so the frame has a foreground
    for (const [x, y, sc] of TUFTS) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(x - 40 * sc, y); for (let n = 0; n < 7; n++) { const bx = x + (n - 3) * 11 * sc, sw = Math.sin(t * .9 + x * .01 + n) * 3 * sc; ctx.lineTo(bx + sw, y - (30 + 26 * Math.sin(n * 2.3 + x) ** 2) * sc); ctx.lineTo(bx + 6 * sc, y - 4 * sc); } ctx.lineTo(x + 40 * sc, y); ctx.closePath(); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 1.5; ctx.stroke(); }
    // the woman with the pot, the cloth filter over the jug, water pouring
    const breath = Math.sin(t * 1.3) * .015;
    const hd = E.person(ctx, WOMAN.x, GY, WOMAN.h, { ...WOMAN.pose, armR: [WOMAN.pose.armR[0] + breath, WOMAN.pose.armR[1]], long: true });
    const [mx, my, mr] = jug(ctx, JUG.x, JUG.y, JUG.h);
    const pour = smooth(span(t, a.vaccine, a.water + .1));
    // pot (tilts to pour)
    ctx.save(); ctx.translate(hd.R[0] + 30, hd.R[1] - 8); ctx.rotate(.15 + .5 * pour);
    const pot = new Path2D(); pot.ellipse(0, 0, 34, 28, 0, 0, 6.29); pot.rect(-16, -36, 32, 14);
    ctx.fillStyle = E.lin(ctx, -34, 0, 34, 0, [[0, mixHex(P.ind2, P.blue1, .5)], [1, P.night1]]); ctx.fill(pot); ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2; ctx.stroke(pot);
    const lip = [26, -30]; ctx.restore();
    const ang = .15 + .5 * pour, lx = hd.R[0] + 30 + lip[0] * Math.cos(ang) - lip[1] * Math.sin(ang), ly = hd.R[1] - 8 + lip[0] * Math.sin(ang) + lip[1] * Math.cos(ang);
    // the cloth over the mouth (sags with the water)
    const sag = 6 + 8 * pour + 1.5 * Math.sin(t * 3);
    const cl = new Path2D(); cl.moveTo(mx - mr - 16, my + 4); cl.quadraticCurveTo(mx, my + sag * 2.2, mx + mr + 16, my + 4); cl.lineTo(mx + mr + 12, my + 22); cl.lineTo(mx + mr * .4, my + 12); cl.lineTo(mx - mr * .5, my + 20); cl.lineTo(mx - mr - 12, my + 14); cl.closePath();
    ctx.fillStyle = E.lin(ctx, 0, my, 0, my + 24, [[0, mixHex(P.cream, F.COOL, .4)], [1, mixHex(F.COOL, P.blue2, .5)]]); ctx.fill(cl);
    if (pour > 0) {
      const ex = mx + 4, ey = my + sag;
      ctx.save(); ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(P.blue0, .5 * pour); ctx.lineWidth = 16; ctx.filter = 'blur(6px)'; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.quadraticCurveTo(lx + 22, ly + 10, ex, ey); ctx.stroke(); ctx.filter = 'none';
      ctx.strokeStyle = rgba(mixHex(P.cream, F.COOL, .5), .9); ctx.lineWidth = 5 * pour; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.quadraticCurveTo(lx + 22, ly + 10, ex, ey); ctx.stroke();
      ctx.setLineDash([6, 18]); ctx.lineDashOffset = -t * 160; ctx.strokeStyle = rgba(P.core0, .9); ctx.lineWidth = 2.4 * pour; ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      for (let n = 0; n < 5; n++) { const ph = (t * 1.6 + n / 5) % 1; ctx.fillStyle = rgba(mixHex(P.cream, F.COOL, .5), .8 * (1 - ph) * pour); ctx.beginPath(); ctx.arc(ex + (n - 2) * 9 * ph, ey + 4 - 8 * ph, 2.2, 0, 6.29); ctx.fill(); }
    }
    // the board: a teacher chalks a jug, a cloth and a crossed-out worm (on "Teaching")
    const bd = BOARD; ctx.fillStyle = P.night1; ctx.fillRect(bd.x + 20, bd.y + bd.h, 10, GY - 10 - bd.y - bd.h); ctx.fillRect(bd.x + bd.w - 30, bd.y + bd.h, 10, GY - 10 - bd.y - bd.h);
    ctx.fillStyle = E.lin(ctx, 0, bd.y, 0, bd.y + bd.h, [[0, mixHex(P.night0, P.ind0, .6)], [1, P.night0]]); ctx.fillRect(bd.x, bd.y, bd.w, bd.h);
    ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 3; ctx.strokeRect(bd.x, bd.y, bd.w, bd.h);
    const wr = (i) => span(t, a.teaching - .2 + i * .32, a.teaching + .1 + i * .32);
    const ch = (A, B, i) => C.chalk(ctx, A, B, 3.2, wr(i), { warm: 0, glow: .6, grain: false });
    const X = bd.x, Y = bd.y;
    ch([X + 40, Y + 52], [X + 52, Y + 120], 0); ch([X + 52, Y + 120], [X + 92, Y + 120], 1); ch([X + 92, Y + 120], [X + 104, Y + 52], 2); ch([X + 32, Y + 50], [X + 112, Y + 50], 3);
    for (let n = 0; n < 3; n++) ch([X + 72 + (n - 1) * 14, Y + 22], [X + 72 + (n - 1) * 14, Y + 40], 3 + n * .3);
    const wpts = [[X + 140, Y + 90], [X + 152, Y + 76], [X + 164, Y + 92], [X + 176, Y + 78], [X + 188, Y + 94], [X + 200, Y + 80]];
    for (let n = 0; n < wpts.length - 1; n++) ch(wpts[n], wpts[n + 1], 4.5 + n * .15);
    ch([X + 136, Y + 60], [X + 206, Y + 112], 6); ch([X + 206, Y + 60], [X + 136, Y + 112], 6.4);
    const reach = Math.sin(Math.PI * clamp(span(t, a.teaching - .4, a.teaching + 2.8)));
    E.person(ctx, TEACH.x, TEACH.y, 250, { dir: -1, armR: [lerp(.3, 2.15, reach) + .06 * Math.sin(t * 6) * reach, lerp(.3, 2.0, reach)], look: .3, long: true });
    E.person(ctx, BOARD.x + 40, GY + 30, 150, { dir: 1, look: .5 + .1 * Math.sin(t * .8) }); E.person(ctx, BOARD.x + 128, GY + 38, 136, { dir: 1, look: .45 });
    // the desk, the lamp (warm: the hero light of this corner), the woman who counts; the notebook (beta: it tilts up to us)
    const lampA = 1 + .04 * Math.sin(t * 5.3) + .03 * Math.sin(t * 8.1);
    E.halo(ctx, LAMP.x, LAMP.y - 30, 260 * lampA, .32, P.halo1, P.core1);
    ctx.fillStyle = P.night1; ctx.fillRect(DESK.x - 95, DESK.top, 200, 12); ctx.fillRect(DESK.x - 85, DESK.top + 12, 10, GY - DESK.top - 12); ctx.fillRect(DESK.x + 85, DESK.top + 12, 10, GY - DESK.top - 12);
    ctx.fillStyle = rgba(P.halo1, .7); ctx.fillRect(DESK.x - 95, DESK.top, 200, 2.5);
    const write = span(t, a.counted - .3, a.could + .2), pen = write > 0 && write < 1 ? Math.sin(t * 9) : 0, rest = smooth(span(t, a.could, a.could + .8));
    E.person(ctx, COUNTER.x, GY, COUNTER.h, { dir: 1, lean: .16, armR: [lerp(1.05 + .05 * pen, .3, rest), lerp(.75, .3, rest)], armL: [lerp(.85, .25, rest), lerp(1.1, .3, rest)], look: 0, light: 1, long: true, rim: mixHex(P.blue0, P.halo1, .6) });
    notebook(ctx, t, k);
    // the lamp
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.beginPath(); ctx.ellipse(LAMP.x, LAMP.y - 8, 16, 9, 0, 0, 6.29); ctx.fill();
    const fl = new Path2D(); fl.ellipse(LAMP.x + 10, LAMP.y - 24, 4.5 * lampA, 10 * lampA, .1, 0, 6.29);
    C.lightBody(ctx, fl, t, { g: { x: LAMP.x + 10, y: LAMP.y - 22, R: 12 }, lit: 1, glow: 1, blurR: 30 });
    // the hut with the window (the room inside), the dog running past the well towards it
    hut(ctx, t, k);
    const dr = span(t, a.dogs - .2, a.progress + .2);
    if (dr > 0 && dr < 1) dog(ctx, lerp(DESK.x - 500, HUT.x - 220, sineIO(dr) * .7 + dr * .3), GY + 60, 80, t * 13, 1);
  }
  function notebook(ctx, t, k) {
    const beta = lerp(.36, 1, smooth(span(t, a.could - .1, a.second + .2))), w = NB.w, h = NB.h * beta, x0 = NB.x - w / 2, y1 = NB.y, y0 = y1 - h;
    ctx.save();
    ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x0 + 3, y0 + 3, w, h);
    const pg = E.lin(ctx, 0, y0, 0, y1, [[0, mixHex(P.core1, P.cream, .4)], [1, mixHex(P.halo2, P.halo1, .45)]]);
    ctx.fillStyle = pg; ctx.fillRect(x0, y0, w, h);
    ctx.fillStyle = rgba(P.shade0, .35); ctx.fillRect(NB.x - .6, y0, 1.2, h);
    ctx.fillStyle = rgba(P.halo1, .2); ctx.fillRect(x0 + w * .55, y0, w * .45, h);
    ctx.translate(0, y0); ctx.scale(1, beta);                        // page space: (x0 … x0 + w) × (0 … NB.h)
    // left page: tallies, rows of five, the newest being written
    const written = span(t, a.counted - .3, a.could) * 26 + 28;
    ctx.strokeStyle = rgba(F.INK, .85); ctx.lineWidth = .9; ctx.lineCap = 'round';
    for (let n = 0; n < Math.floor(written); n++) {
      const grp = Math.floor(n / 5), q = n % 5, row = Math.floor(grp / 4), col = grp % 4, gx = x0 + 6 + col * 11, gy = 8 + row * 9;
      if (gy > NB.h - 6) break;
      ctx.beginPath(); if (q < 4) { ctx.moveTo(gx + q * 2, gy); ctx.lineTo(gx + q * 2 + .3, gy + 6); } else { ctx.moveTo(gx - 1.2, gy + 4.8); ctx.lineTo(gx + 7.5, gy + 1); } ctx.stroke();
    }
    // right page: the list
    const rx = NB.x + 4.5;
    ctx.font = '600 4.4px Inter'; ctx.letterSpacing = '0.04em'; ctx.fillStyle = F.INK; ctx.textBaseline = 'alphabetic';
    ctx.fillText('1', rx, 20); ctx.fillText('SMALLPOX', rx + 6, 20);
    const gw = span(t, a.second - .15, a.second + .7);
    if (gw > 0) { ctx.save(); ctx.beginPath(); ctx.rect(rx, 24, 50 * gw, 10); ctx.clip(); ctx.fillText('2', rx, 32); ctx.fillText('GUINEA WORM', rx + 6, 32); ctx.restore(); }
    const sw1 = ctx.measureText('SMALLPOX').width, sw2 = ctx.measureText('GUINEA WORM').width;
    // SMALLPOX is struck through (done); on "smallpox" a gold light runs along the strike
    ctx.strokeStyle = rgba(F.INK, .9); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(rx + 4.5, 18.4); ctx.lineTo(rx + 7.5 + sw1, 17.9); ctx.stroke();
    const gl = Math.sin(Math.PI * clamp(span(t, a.smallpox - .1, a.smallpox + 1.4)));
    if (gl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo0, .8 * gl); ctx.lineWidth = 1.6; ctx.filter = 'blur(.6px)'; ctx.stroke(); ctx.restore(); }
    // GUINEA WORM: the strike runs to the middle and stops ("It isn't over yet")
    const st = span(t, a.over - .2, a.over + .35);
    if (st > 0) { ctx.strokeStyle = rgba(F.INK, .9); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(rx + 4.5, 30.5); ctx.lineTo(rx + 4.5 + (sw2 * .55) * expoOut(st), 30.2); ctx.stroke();
      ctx.fillStyle = F.INK; ctx.beginPath(); ctx.arc(rx + 4.5 + sw2 * .55 * expoOut(st), 30.2, .55 * st, 0, 6.29); ctx.fill(); }
    ctx.restore();
  }
  // the hut with the window; the room inside (portal)
  function hut(ctx, t, k) {
    tukul(ctx, HUT.x, HUT.y, HUT.w, HUT.h * 1.25, {});
    const wx = WIN.x, wy = WIN.y;
    ctx.fillStyle = P.night0; ctx.fillRect(wx - 6, wy - 6, WIN.w + 12, WIN.h + 12);
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, WIN.w, WIN.h); ctx.clip();
    const m = ctx.getTransform(), sw = m.a * WIN.w, sx = m.a * (wx + WIN.w / 2) + m.e, sy = m.d * (wy + WIN.h / 2) + m.f;
    if (sw > 2) { ctx.save(); drawRoom(ctx, t, { ...aim(F0, W / 2, ROOM.floor - 300, sw / W, sx, sy) }, { warm: 0, extra: extras.room && ((cx, k) => extras.room(cx, t, k)) }); ctx.restore(); }
    ctx.restore();
    ctx.strokeStyle = rgba(F.COOL, .55); ctx.lineWidth = 1.5; ctx.strokeRect(wx, wy, WIN.w, WIN.h);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.fillRect(wx - 8, wy + WIN.h + 2, WIN.w + 16, 6);
  }

  // -------------------------------------------------------------------------------------------- draw
  function world(ctx, t, c) {
    C.nightBg(ctx);
    card(ctx, c, F0, (k) => { planet(ctx, t, k, c); tally(ctx, t, k); village(ctx, t, k); });
  }
  // the room seen through the portal (the window rect covers the frame)
  const roomWarm = (t) => smooth(span(t, a.bed + .6, a.T10 + .4));
  const roomCam = (p) => aim(F0, W / 2, ROOM.floor - 300, p.sw / W, p.sx, p.sy);
  function draw(ctx, t) {
    const c = camW(t);
    if (t < tBox) {
      const m = E.cardM(c, F0), p = { sw: m.k * WIN.w, sx: m.e + m.k * wcx, sy: m.f + m.k * wcy };
      if (p.sw > W * 1.02 && p.sw * WIN.h / WIN.w > H * 1.02) drawRoom(ctx, t, roomCam(p), { warm: 0, extra: extras.room && ((cx, k) => extras.room(cx, t, k)) });
      else world(ctx, t, c);
      text(ctx, t);
      return;
    }
    boxWorld(ctx, t, c);
  }
  // the box in top view on the night ground; compartment 1 holds the room; INFECTIONS glows
  function boxWorld(ctx, t, c, o = {}) {
    const glow = smooth(span(t, a.bed + .7, a.T10 + .3)) * (o.litK ?? 1), warm = roomWarm(t);
    C.nightBg(ctx);
    card(ctx, c, F0, (k) => {
      ctx.fillStyle = E.rad(ctx, 960, 560, 1500, [[0, mixHex(P.ind1, P.ind2, .3)], [.55, P.ind0], [1, P.night0]]); ctx.fillRect(-3000, -2000, 8000, 5000);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, CELL0.cx, CELL0.cy, 900, [[0, rgba(P.halo1, .3 * glow)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(-1000, -1000, 4000, 3000); ctx.restore();
      ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.roundRect(BOX.x - BOX.w / 2 + 18, BOX.y - BOX.w * .44 + 24, BOX.w, BOX.w * .44, 14); ctx.fill();
      F.box10(ctx, BOX.x, BOX.y, BOX.w, t, {
        beta: 1, lid: .56, lit: [.16 * glow], labels: LABELS.map((s, i) => ({ s, u: 1 })),
        inside: (i, cell) => {
          if (i !== 0) return;
          const m = ctx.getTransform(), sw = m.a * cell.w, sx = m.a * (cell.x + cell.w / 2) + m.e, sy = m.d * (cell.y + cell.h / 2) + m.f;
          if (sw > 2) drawRoom(ctx, t, aim(F0, W / 2, ROOM.floor - 300, sw / W, sx, sy), { warm, extra: extras.room && ((cx, k) => extras.room(cx, t, k)) });
        },
      });
    });
  }
  const extras = {};
  // screen-space numbers
  function text(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const out1 = span(t, a.In - .1, a.In + .35);
    const u1 = smooth(span(t, a.million - .3, a.million + .9)) * (1 - expoIn(out1));
    if (u1 > 0) F.numberBlock(ctx, { x: 150, y: 850, num: '3.5 million', label: 'cases a year · 1986', src: 'The Carter Center', u: u1 });
    const out2 = span(t, a.nodrug - .1, a.nodrug + .4);
    const u2 = smooth(span(t, a.ten - .2, a.ten + .9)) * (1 - expoIn(out2));
    if (u2 > 0) F.numberBlock(ctx, { x: 150, y: 850, num: '10', label: 'cases · 2025', src: 'The Carter Center', u: u2, warm: 1 });
    ctx.restore();
  }

  return { draw, a, tEnd: Infinity, extras, camW, boxWorld, roomWarm, BOX, CELL0, drawRoom };
}
