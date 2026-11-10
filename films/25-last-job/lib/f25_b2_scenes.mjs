// Film 25 · builder B2 · the scenes inside the lit windows (inner design 1920×1080, flat layers, one warm light each) + the ridge.
//   radio (reading room: lightbox, scans, chairs, radiologist + surgeon) · classroom (board, desk lamp, teacher + child)
//   bedside (lamp, bed, patient, doctor) · basement (flooded, pipes, plumber with a torch) · factory (clean hall, robot, belt: cool)
//   ridge (subscribe 1: people on a ridge at the horizon pass a light from lamp to lamp; on the rank-row plain, far left)
import * as E from './f10_editorial.mjs';
import * as F from './f25_kit.mjs';
import { lay, ipt, frame } from './f25_b2_lib.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, halo, rad, lin, prng } = E;
const TAU = Math.PI * 2;
const big = (ctx, col) => { ctx.fillStyle = col; ctx.fillRect(-3000, -3000, 9000, 8000); };

// ============================================================================================================ RADIOLOGY
export const LB = { x: 1000, y: 230, w: 640, h: 420 };                    // the lightbox
export const SCAN0 = { x: 1170, y: 254, w: 300, h: 372 };                  // the one big film
export const TILE = (k) => ({ x: 1024 + (k % 4) * 151, y: 254 + Math.floor(k / 4) * 192, w: 139, h: 180 });
export const RFLOOR = 960, CHAIRS = [1150, 1430];
// an x-ray film: dark sheet, bones of light (warm, or cool once a machine has read it)
export function scanImg(ctx, x, y, w, h, seed, cool = 0, a = 1) {
  const r = prng(seed), cx = x + w * (.5 + (r() - .5) * .04), lw = Math.max(1, w * .022);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(mixHex(P.night0, F.COOL.deep, cool * .5), .72); ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(6, w * .03)); ctx.fill();
  ctx.fillStyle = rgba(P.night0, .45);
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * w * .2, y + h * .48, w * .16, h * .3, s * .08, 0, TAU); ctx.fill(); }
  const bone = mixHex(mixHex(P.core1, P.halo0, .35), F.COOL.body, cool);
  ctx.strokeStyle = rgba(bone, .85); ctx.lineCap = 'round'; ctx.lineWidth = lw;
  for (let k = 0; k < 9; k++) { const yy = y + h * (.14 + k * .085); ctx.beginPath(); ctx.moveTo(cx, yy); ctx.lineTo(cx, yy + h * .06); ctx.stroke(); }
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(cx + s * w * .03, y + h * .17); ctx.quadraticCurveTo(cx + s * w * .2, y + h * .12, cx + s * w * .36, y + h * .15); ctx.stroke();
    for (let k = 0; k < 6; k++) { const yy = y + h * (.24 + k * .085 + (r() - .5) * .01); ctx.lineWidth = lw * (.9 - k * .06);
      ctx.beginPath(); ctx.moveTo(cx + s * w * .03, yy); ctx.bezierCurveTo(cx + s * w * .26, yy - h * .05, cx + s * w * .4, yy + h * .02, cx + s * w * .34, yy + h * .09); ctx.stroke(); }
  }
  ctx.fillStyle = rgba(bone, .16); ctx.beginPath(); ctx.ellipse(cx - w * .08, y + h * .64, w * .14, h * .1, -.3, 0, TAU); ctx.fill();
  ctx.restore();
}
function chair(ctx, x, rim) {
  ctx.fillStyle = mixHex(P.night1, P.ind0, .3);
  ctx.fillRect(x - 6, RFLOOR - 150, 12, 150); ctx.fillRect(x - 60, RFLOOR - 6, 120, 8);
  ctx.beginPath(); ctx.roundRect(x - 70, RFLOOR - 170, 140, 26, 8); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x + 40, RFLOOR - 330, 22, 170, 6); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .35 * rim); ctx.fillRect(x - 70, RFLOOR - 170, 140, 3); ctx.fillRect(x + 40, RFLOOR - 330, 3, 170);
}
// st: { split, cool[8], bead [x,y]|null, line, rad {x, walk, armR, look, a}, surg {x, walk, a}, mark, lbA }
export function radio(ctx, t, ic, st = {}) {
  lay(ctx, ic, 0, () => big(ctx, P.night0));
  lay(ctx, ic, .55, () => {
    ctx.fillStyle = lin(ctx, 0, -200, 0, RFLOOR, [[0, P.night0], [.55, mixHex(P.night1, P.ind0, .5)], [1, mixHex(P.ind0, P.night1, .3)]]); ctx.fillRect(-2000, -800, 6000, RFLOOR + 800);
    // a door frame far left, a dim strip of corridor light
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.fillRect(130, 330, 230, RFLOOR - 330);
    ctx.fillStyle = rgba(P.blue0, .18); ctx.fillRect(150, 350, 190, RFLOOR - 350);
  });
  lay(ctx, ic, 1, () => {
    ctx.fillStyle = lin(ctx, 0, RFLOOR, 0, RFLOOR + 400, [[0, mixHex(P.night1, P.ind0, .45)], [1, P.night0]]); ctx.fillRect(-2000, RFLOOR, 6000, 1500);
    ctx.strokeStyle = rgba(P.blue0, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-2000, RFLOOR); ctx.lineTo(4000, RFLOOR); ctx.stroke();
    // the lightbox: the warm hero light of the room
    const br = 1 + .015 * Math.sin(t * 1.3), A = st.lbA ?? 1;
    halo(ctx, LB.x + LB.w / 2, LB.y + LB.h / 2, 1050 * br, .34 * A, P.halo1, P.halo0);
    F.pool(ctx, LB.x + LB.w / 2, RFLOOR + 6, 700, 70, .8 * A);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .3); ctx.beginPath(); ctx.roundRect(LB.x - 16, LB.y - 16, LB.w + 32, LB.h + 32, 10); ctx.fill();
    ctx.fillStyle = rad(ctx, LB.x + LB.w * .45, LB.y + LB.h * .42, LB.w * .7, [[0, P.core0], [.45, P.core1], [1, mixHex(P.halo0, P.halo1, .4)]]); ctx.fillRect(LB.x, LB.y, LB.w, LB.h);
    // the films: one big film that splits into eight tiles (cloning), each read by the machine (cool)
    const sp = clamp(st.split ?? 0);
    for (let k = 7; k >= 0; k--) {
      const e = sineIO(span(sp, k * .06, k * .06 + .58)), T1 = TILE(k);
      if (sp <= 0 && k > 0) continue;
      const q = { x: lerp(SCAN0.x, T1.x, e), y: lerp(SCAN0.y, T1.y, e), w: lerp(SCAN0.w, T1.w, e), h: lerp(SCAN0.h, T1.h, e) };
      scanImg(ctx, q.x, q.y, q.w, q.h, 11 + (sp > 0 ? k : 0) * 7, clamp(st.cool?.[k] ?? 0));
    }
    // mount + a thin cable
    ctx.fillStyle = mixHex(P.night1, P.ind2, .3); ctx.fillRect(LB.x + LB.w / 2 - 8, LB.y + LB.h + 16, 16, 40);
    // the decision mark: a warm ring on one tile (5.08 DECIDE)
    if ((st.mark ?? 0) > 0) { const T5 = TILE(5), m = E.expoOut(st.mark); ctx.strokeStyle = rgba(P.halo0, .95); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(T5.x + T5.w * .55, T5.y + T5.h * .45, 46 * m, -Math.PI / 2, -Math.PI / 2 + TAU * m); ctx.stroke(); }
    // chairs (empty until the radiologist comes)
    for (const x of CHAIRS) chair(ctx, x, .7 + .3 * (st.chairs ?? 1));
    // the people: the radiologist (warm rim from the lightbox) and the surgeon
    const R = st.rad, Sg = st.surg;
    if (Sg && (Sg.a ?? 1) > 0) E.person(ctx, Sg.x, RFLOOR, 450, { dir: -1, light: -1, look: Sg.look ?? .15, walk: Sg.walk ?? undefined, armR: Sg.armR, rim: mixHex(P.blue0, P.halo2, .4), long: true });
    if (R && (R.a ?? 1) > 0) E.person(ctx, R.x, RFLOOR, 440, { dir: R.dir ?? 1, light: 1, look: R.look ?? .2, walk: R.walk ?? undefined, armR: R.armR, armL: R.armL, rim: mixHex(P.halo0, P.core1, .3), long: true });
  });
  // the reading bead
  if (st.bead) lay(ctx, ic, 1, () => F.agent(ctx, t, st.bead[0], st.bead[1], 13, { ring: 1, think: st.bead[2] ?? 0 }));
  // the training-spots line (5.05): a warm line rising to a record, out in the dark wall left of the lightbox
  if ((st.line ?? 0) > 0) lay(ctx, ic, 1, () => {
    const pts = E.catmull(LINE.map((p) => [p[0], p[1], 4.5]), 10);
    const head = E.trail(ctx, pts, st.line, { w: 4.5 });
    if (head) { st._head = head; halo(ctx, head[0], head[1], 70, .5 * span(st.line, .95, 1)); }
  });
}
export const LINE = [[170, 750], [300, 728], [430, 716], [560, 680], [690, 610], [800, 480], [880, 250]];

// ============================================================================================================ CLASSROOM
export const BOARD = { x: 200, y: 190, w: 860, h: 440 };
export const CFLOOR = 960;
const ROWS = 5;
// the writing on the board: five rows, five different "scripts" (abstract strokes, no letters), deterministic
const SCRIPT = (() => {
  const out = [];
  for (let r = 0; r < ROWS; r++) {
    const y = BOARD.y + 80 + r * 74, pts = [], rr = prng(300 + r * 17); let x = BOARD.x + 50;
    const x1 = BOARD.x + BOARD.w - 70 - rr() * 120;
    while (x < x1) {
      if (r === 0) { for (let k = 0; k <= 10; k++) { const a = k / 10 * TAU; pts.push([x + k * 4.2 + Math.sin(a) * 10, y - 12 + Math.cos(a) * -14]); } x += 46; }
      else if (r === 1) { pts.push([x, y - 22], [x + 18, y - 22], [x + 9, y - 22], [x + 9, y + 4], [x + 22, y - 6], [x + 34, y - 6]); x += 46; }
      else if (r === 2) { pts.push([x, y], [x + 22, y], [x + 28, y - 16], [x + 30, y], [x + 46, y], [x + 50, y + 10], [x + 56, y]); x += 58; }
      else if (r === 3) { pts.push([x, y - 26], [x + 30, y - 26], [x + 22, y - 26], [x + 22, y + 4], [x + 12, y - 4], [x + 30, y - 26]); x += 34; }
      else { pts.push([x, y - 10], [x + 16, y - 10], [x + 8, y - 18], [x + 8, y - 2], [x + 26, y - 12], [x + 40, y - 12], [x + 33, y - 4]); x += 52; }
      if (rr() < .25) x += 22;
    }
    out.push(pts);
  }
  return out;
})();
function partial(ctx, pts, u) {
  const n = Math.floor(pts.length * clamp(u)); if (n < 2) return pts[0];
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); return pts[n - 1];
}
export const DESK = { x0: 1180, x1: 1580, top: 770 }, LAMP = [1500, 610];
// st: { write 0..1 (all rows), bead: bool, reach 0..1 (teacher's hand to the child), look (child), stones: { u, fallE } , lampA }
export function classroom(ctx, t, ic, st = {}) {
  lay(ctx, ic, 0, () => big(ctx, P.night0));
  lay(ctx, ic, .5, () => {
    ctx.fillStyle = lin(ctx, 0, -300, 0, 840, [[0, P.night0], [.6, mixHex(P.night1, P.ind0, .55)], [1, mixHex(P.ind0, P.shade0, .12)]]); ctx.fillRect(-2000, -800, 6000, 1640);
    // a dusk window, far right
    ctx.fillStyle = lin(ctx, 0, 150, 0, 520, [[0, mixHex(P.night1, P.ind1, .5)], [.7, mixHex(P.ind1, P.blue0, .4)], [1, mixHex(P.blue0, P.shade0, .45)]]); ctx.fillRect(1660, 150, 360, 370);
    ctx.fillStyle = mixHex(P.night1, P.ind0, .2); ctx.fillRect(1834, 150, 10, 370); ctx.fillRect(1660, 330, 360, 10);
  });
  lay(ctx, ic, 1, () => {
    ctx.fillStyle = lin(ctx, 0, 840, 0, 1300, [[0, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]); ctx.fillRect(-2000, 840, 6000, 1500);
    ctx.strokeStyle = rgba(P.blue0, .4); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-2000, 840); ctx.lineTo(4000, 840); ctx.stroke();
    // the board
    ctx.fillStyle = mixHex(P.night1, P.ind2, .35); ctx.beginPath(); ctx.roundRect(BOARD.x - 18, BOARD.y - 18, BOARD.w + 36, BOARD.h + 36, 8); ctx.fill();
    ctx.fillStyle = lin(ctx, BOARD.x, BOARD.y, BOARD.x + BOARD.w, BOARD.y + BOARD.h, [[0, mixHex('#173238', P.night1, .3)], [1, mixHex('#10242c', P.night0, .3)]]); ctx.fillRect(BOARD.x, BOARD.y, BOARD.w, BOARD.h);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(BOARD.x - 10, BOARD.y + BOARD.h + 14, BOARD.w + 20, 12);
    // the writing (cool: the machine explains)
    ctx.save(); ctx.strokeStyle = rgba(F.COOL.line, .85); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const w = clamp(st.write ?? 0) * ROWS; let head = null;
    for (let r = 0; r < ROWS; r++) { const u = clamp(w - r); if (u <= 0) break; head = partial(ctx, SCRIPT[r], u); }
    ctx.restore();
    if (st.bead && head && (st.write ?? 0) < 1.02) F.agent(ctx, t, head[0] + 10, head[1] - 8, 12, { ring: 1 });
    st._head = head;
    // the desk lamp: the warm hero light
    const lA = st.lampA ?? 1, br = 1 + .02 * Math.sin(t * 1.6);
    halo(ctx, LAMP[0] - 20, LAMP[1] + 20, 620 * br, .38 * lA, P.halo1, P.halo0);
    F.pool(ctx, 1380, 950, 460, 50, .7 * lA);
    // teacher + child
    const reach = clamp(st.reach ?? 0);
    E.person(ctx, 1150, CFLOOR, 460, { dir: 1, light: 1, lean: .16 + .06 * reach, look: .1 + .1 * reach, armR: [lerp(.3, 1.75, reach), lerp(.2, 1.95, reach)], rim: mixHex(P.halo0, P.core1, .3), long: true });
    E.person(ctx, 1395, CFLOOR - 40, 300, { dir: -1, light: -1, look: (st.look ?? .1) + .04 * Math.sin(t * .9), armR: [1.1, 1.6], armL: [.9, 1.4], rim: mixHex(P.halo0, P.core1, .3) });
    // the desk in front of the child + the lamp
    ctx.fillStyle = mixHex(P.ind2, P.night1, .4); ctx.fillRect(DESK.x0 + 20, DESK.top, 14, CFLOOR - DESK.top); ctx.fillRect(DESK.x1 - 34, DESK.top, 14, CFLOOR - DESK.top);
    ctx.fillStyle = lin(ctx, 0, DESK.top - 6, 0, DESK.top + 22, [[0, mixHex(P.halo1, P.shade0, .4)], [1, P.night1]]); ctx.beginPath(); ctx.roundRect(DESK.x0, DESK.top - 6, DESK.x1 - DESK.x0, 26, 4); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind0, .4); ctx.fillRect(DESK.x0 + 10, DESK.top + 20, DESK.x1 - DESK.x0 - 20, 70);
    const [lx, ly] = LAMP;
    ctx.strokeStyle = mixHex(P.ind2, P.night1, .3); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(lx + 30, DESK.top - 6); ctx.lineTo(lx + 40, ly - 50); ctx.lineTo(lx + 6, ly - 12); ctx.stroke();
    ctx.fillStyle = mixHex(P.ind2, P.night1, .2); ctx.beginPath(); ctx.moveTo(lx - 38, ly + 10); ctx.quadraticCurveTo(lx - 10, ly - 40, lx + 24, ly - 18); ctx.lineTo(lx + 16, ly + 14); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, ly, 0, DESK.top, [[0, rgba(P.halo0, .4 * lA)], [1, rgba(P.halo1, .06 * lA)]]);
    ctx.beginPath(); ctx.moveTo(lx - 30, ly + 8); ctx.lineTo(lx + 14, ly + 12); ctx.lineTo(lx + 70, DESK.top - 6); ctx.lineTo(lx - 200, DESK.top - 6); ctx.closePath(); ctx.fill(); ctx.restore();
    halo(ctx, lx - 10, ly + 8, 70, .95 * lA, P.halo0, P.core0);
    // the two mini stones (7.04): EXPLAINING falls (cool), BELIEVING stays (warm)
    const sd = st.stones;
    if (sd && sd.u > 0) for (const [k, x] of [[0, 560], [1, 830]]) {
      const e = F.rise(span(sd.u, k * .2, k * .2 + .8)); if (e <= 0) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(x - 400, 0, 800, 902); ctx.clip(); ctx.translate(0, (1 - e) * 230);
      F.stone(ctx, t, x, 900, 210, { w: 64, fall: k === 0 ? sd.fallE ?? 0 : 0, glyph: k === 0 ? 'teach' : 'person', glyphWarm: k === 1 ? 1 : 0, dark: k === 0 ? .2 * clamp((sd.fallE ?? 0) / 1.4) : 0, gold: k === 1 ? .0 : 0 });
      ctx.restore();
      if (k === 1) halo(ctx, x + 32, 760, 220, .18 * e, P.halo1, P.halo0);
    }
  });
}

// ============================================================================================================ BEDSIDE
export const BLAMP = [470, 600];
// st: { lean 0..1, reach 0..1, lampA }
export function bedside(ctx, t, ic, st = {}) {
  lay(ctx, ic, 0, () => big(ctx, P.night0));
  lay(ctx, ic, .5, () => {
    ctx.fillStyle = lin(ctx, 0, -300, 0, 860, [[0, P.night0], [.65, mixHex(P.night1, P.ind0, .5)], [1, mixHex(P.ind0, P.night1, .2)]]); ctx.fillRect(-2000, -800, 6000, 1660);
    ctx.fillStyle = lin(ctx, 0, 170, 0, 520, [[0, P.night0], [1, mixHex(P.night1, P.blue0, .25)]]); ctx.fillRect(1250, 170, 420, 350);
    ctx.fillStyle = mixHex(P.night1, P.ind0, .25); ctx.fillRect(1454, 170, 10, 350);
    E.stars(ctx, 61, 14, t, [1260, 180, 400, 300], .6);
  });
  lay(ctx, ic, 1, () => {
    ctx.fillStyle = lin(ctx, 0, 860, 0, 1300, [[0, mixHex(P.night1, P.ind0, .45)], [1, P.night0]]); ctx.fillRect(-2000, 860, 6000, 1500);
    const lA = st.lampA ?? 1, br = 1 + .02 * Math.sin(t * 1.4);
    halo(ctx, BLAMP[0], BLAMP[1] + 30, 700 * br, .36 * lA, P.halo1, P.halo0);
    F.pool(ctx, 700, 960, 600, 60, .6 * lA);
    // the doctor, seated on the far side of the bed (the bed hides the legs)
    const ln = clamp(st.lean ?? 0), rc = clamp(st.reach ?? 0);
    E.person(ctx, 1560, 960, 470, { dir: -1, light: -1, lean: .2 + .12 * ln, look: -.05 + .05 * Math.sin(t * .7), armR: [lerp(.5, 1.45, rc), lerp(.6, 1.9, rc)], rim: mixHex(P.halo0, P.core1, .3), long: true });
    // the bed: pillow, the patient under a blanket, the frame
    ctx.fillStyle = mixHex(P.ind2, P.night1, .45); ctx.fillRect(560, 700, 20, 260); ctx.fillRect(1440, 760, 20, 200);
    ctx.fillStyle = lin(ctx, 0, 720, 0, 860, [[0, mixHex(P.ind1, P.halo2, .12)], [1, P.night1]]); ctx.beginPath(); ctx.roundRect(580, 730, 880, 120, 10); ctx.fill();
    ctx.fillStyle = mixHex(P.cream, P.ind1, .55); ctx.beginPath(); ctx.roundRect(600, 690, 170, 50, 18); ctx.fill();
    ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.beginPath(); ctx.arc(700, 690, 36, 0, TAU); ctx.fill();
    const breath = 1 + .03 * Math.sin(t * 1.3);
    ctx.fillStyle = lin(ctx, 0, 640, 0, 760, [[0, mixHex(P.ind1, P.halo2, .22)], [1, mixHex(P.ind1, P.night1, .4)]]);
    ctx.beginPath(); ctx.moveTo(740, 745); ctx.bezierCurveTo(800, 690 - 10 * breath, 960, 660 - 14 * breath, 1100, 690); ctx.bezierCurveTo(1250, 700, 1380, 690, 1450, 735); ctx.lineTo(1450, 760); ctx.lineTo(740, 760); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.halo1, .25 * lA); ctx.beginPath(); ctx.moveTo(740, 745); ctx.bezierCurveTo(800, 690 - 10 * breath, 960, 660 - 14 * breath, 1100, 690); ctx.lineTo(1100, 696); ctx.bezierCurveTo(960, 668, 800, 698, 744, 750); ctx.closePath(); ctx.fill();
    // the bedside lamp: table + shade + bulb
    ctx.fillStyle = mixHex(P.ind2, P.night1, .45); ctx.fillRect(380, 720, 180, 16); ctx.fillRect(400, 736, 14, 224); ctx.fillRect(526, 736, 14, 224);
    ctx.fillRect(BLAMP[0] - 5, BLAMP[1] + 30, 10, 90);
    ctx.fillStyle = lin(ctx, 0, BLAMP[1] - 40, 0, BLAMP[1] + 30, [[0, mixHex(P.halo0, P.core1, .4)], [1, P.halo1]]);
    ctx.beginPath(); ctx.moveTo(BLAMP[0] - 34, BLAMP[1] - 36); ctx.lineTo(BLAMP[0] + 34, BLAMP[1] - 36); ctx.lineTo(BLAMP[0] + 56, BLAMP[1] + 30); ctx.lineTo(BLAMP[0] - 56, BLAMP[1] + 30); ctx.closePath(); ctx.fill();
    halo(ctx, BLAMP[0], BLAMP[1], 110, .9 * lA, P.halo0, P.core0);
  });
}

// ============================================================================================================ BASEMENT
export const WATER = 740, RUST = [1390, 382];
export const PLUMBER = { x: 600, y: 1030, h: 480 };
// torch hand (inner design) for the plumber's pose below
export const TORCH_HAND = [PLUMBER.x + PLUMBER.h * .423 * .98, PLUMBER.y - PLUMBER.h * (.74 + .17 * Math.sin(.25) * 0 + .06)];
function pipes(ctx, lit) {
  const c1 = lit ? mixHex(P.halo2, P.shade0, .4) : mixHex(P.night1, P.ind2, .3), c2 = lit ? mixHex(P.core1, P.halo1, .4) : mixHex(P.ind1, P.blue0, .2);
  for (const [y, x0, x1, th] of [[300, -400, 2400, 34], [382, 260, 2400, 26], [470, 900, 2400, 18]]) {
    ctx.fillStyle = lin(ctx, 0, y - th / 2, 0, y + th / 2, [[0, c2], [1, c1]]); ctx.fillRect(x0, y - th / 2, x1 - x0, th);
    for (let x = x0 + 120; x < x1; x += 260) { ctx.fillStyle = c1; ctx.fillRect(x, y - th / 2 - 5, 18, th + 10); }
  }
  ctx.fillStyle = lin(ctx, 1600, 0, 1640, 0, [[0, c2], [1, c1]]); ctx.fillRect(1600, 120, 34, WATER - 120);
}
// st: { beam [x, y] (the torch circle on the wall, inner design), r, findU 0..1 (the rust is found), circleA }
export function basement(ctx, t, ic, st = {}) {
  lay(ctx, ic, 0, () => big(ctx, P.night0));
  const C = st.beam ?? [1100, 330], R = st.r ?? 120;
  lay(ctx, ic, 1, () => {
    // the old wall + pipes (dark), then the same wall lit inside the torch circle
    ctx.fillStyle = lin(ctx, 0, -200, 0, WATER, [[0, P.night0], [1, mixHex(P.night1, '#24303e', .5)]]); ctx.fillRect(-2000, -800, 6000, WATER + 800);
    ctx.strokeStyle = rgba(P.blue0, .12); ctx.lineWidth = 2;
    for (let y = 120; y < WATER; y += 54) { ctx.beginPath(); ctx.moveTo(-2000, y); ctx.lineTo(4000, y); ctx.stroke(); }
    for (let y = 120, r = 0; y < WATER; y += 54, r++) for (let x = (r % 2) * 70 - 2000; x < 4000; x += 140) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 54); ctx.stroke(); }
    ctx.fillStyle = mixHex(P.night1, P.night0, .4); ctx.fillRect(-2000, -800, 6000, 880);   // the ceiling beam zone
    for (let x = -200; x < 2400; x += 320) { ctx.fillStyle = mixHex(P.night1, P.ind0, .3); ctx.fillRect(x, 40, 60, 60); }
    pipes(ctx, false);
    // torch circle: warm light on the wall
    const ca = st.circleA ?? 1;
    if (ca > 0) {
      const R2 = R * 1.25; ctx.save(); ctx.beginPath(); ctx.arc(C[0], C[1], R2, 0, TAU); ctx.clip();
      ctx.fillStyle = rad(ctx, C[0], C[1], R2, [[0, rgba(mixHex(P.halo1, P.core1, .3), .82)], [.5, rgba(mixHex(P.halo1, P.shade0, .35), .62)], [.8, rgba(P.shade0, .3)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(C[0] - R2, C[1] - R2, 2 * R2, 2 * R2);
      ctx.strokeStyle = rgba(P.shade0, .28); ctx.lineWidth = 2;   // the brick joints, lit
      for (let y = 120, r = 0; y < WATER; y += 54, r++) { ctx.beginPath(); ctx.moveTo(C[0] - R2, y); ctx.lineTo(C[0] + R2, y); ctx.stroke();
        for (let x = (r % 2) * 70 - 2000; x < 4000; x += 140) if (Math.abs(x - C[0]) < R2) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 54); ctx.stroke(); } }
      pipes(ctx, true);
      // the rusted spot (found)
      const f = clamp(st.findU ?? 0);
      ctx.fillStyle = rgba(mixHex('#8a3e1c', P.shade0, .3), .55 + .35 * f); ctx.beginPath(); ctx.ellipse(RUST[0], RUST[1], 34, 15, .1, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba('#6b2c12', .7); ctx.beginPath(); ctx.ellipse(RUST[0] + 8, RUST[1] + 4, 14, 8, 0, 0, TAU); ctx.fill();
      const dp = (t * .7) % 1; ctx.fillStyle = rgba(P.core1, .8 * f); ctx.beginPath(); ctx.arc(RUST[0] + 10, RUST[1] + 16 + dp * 110, 4, 0, TAU); ctx.fill();
      ctx.restore();
      halo(ctx, C[0], C[1], R * 2.6, .3 * ca, P.halo1, P.halo0);
    }
    // the plumber, holding the torch
    const hand = E.person(ctx, PLUMBER.x, PLUMBER.y, PLUMBER.h, { dir: 1, light: 1, look: .25 + .04 * Math.sin(t * .8), armR: [1.62, 1.42], armL: [.5, .9], rim: mixHex(P.halo0, P.core1, .3), long: true }).R;
    st._hand = hand;
    if (ca > 0) {   // the beam: a soft warm cone from the torch to the circle
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const dx = C[0] - hand[0], dy = C[1] - hand[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      ctx.fillStyle = lin(ctx, hand[0], hand[1], C[0], C[1], [[0, rgba(P.halo0, .32 * ca)], [1, rgba(P.halo1, .07 * ca)]]);
      ctx.beginPath(); ctx.moveTo(hand[0] + nx * 6, hand[1] + ny * 6); ctx.lineTo(C[0] + nx * R * .9, C[1] + ny * R * .9); ctx.lineTo(C[0] - nx * R * .9, C[1] - ny * R * .9); ctx.lineTo(hand[0] - nx * 6, hand[1] - ny * 6); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.save(); ctx.translate(hand[0], hand[1]); ctx.rotate(Math.atan2(dy, dx)); ctx.fillRect(-14, -9, 40, 18); ctx.restore();
      halo(ctx, hand[0] + dx / L * 26, hand[1] + dy / L * 26, 60, .9 * ca, P.halo0, P.core0);
    }
    // the flood: dark water over the legs, ripples, the torch's reflection
    ctx.fillStyle = lin(ctx, 0, WATER, 0, 1300, [[0, rgba(mixHex(P.night1, P.blue0, .2), .94)], [1, rgba(P.night0, .98)]]); ctx.fillRect(-2000, WATER, 6000, 1500);
    ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-2000, WATER); ctx.lineTo(4000, WATER); ctx.stroke();
    for (let k = 0; k < 9; k++) { const y = WATER + 30 + k * 36, ph = t * (1.1 + k * .13) + k; ctx.strokeStyle = rgba(P.blue0, .22 - k * .015); ctx.beginPath();
      for (let x = -400; x <= 2400; x += 40) { const yy = y + Math.sin(x * .012 + ph) * 3; x === -400 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); }
    if (ca > 0) for (let k = 0; k < 6; k++) { const y = WATER + 40 + k * 26, w = R * (1.1 - k * .12); ctx.fillStyle = rgba(P.halo1, (.2 - k * .03) * ca); ctx.fillRect(C[0] - w / 2 + Math.sin(t * 2 + k) * 8, y, w, 3); }
    ctx.fillStyle = rgba(P.halo0, .25); ctx.fillRect(PLUMBER.x - 60, WATER - 2, 120, 4);
  });
}

// ============================================================================================================ FACTORY (cool)
// st: { } · a clean hall, a belt, a robot repeating one task (pick → place), period 1.8 s
export function factory(ctx, t, ic, st = {}) {
  lay(ctx, ic, 0, () => big(ctx, P.night1));
  lay(ctx, ic, .5, () => {
    ctx.fillStyle = lin(ctx, 0, -200, 0, 760, [[0, mixHex(P.ind0, P.night1, .3)], [1, mixHex(P.blue0, F.COOL.body, .25)]]); ctx.fillRect(-2000, -800, 6000, 1560);
    for (let k = 0; k < 7; k++) { const x = 120 + k * 270; ctx.fillStyle = lin(ctx, 0, 120, 0, 600, [[0, rgba(F.COOL.body, .5)], [1, rgba(F.COOL.body, .12)]]); ctx.fillRect(x, 120, 170, 480);
      ctx.fillStyle = rgba(P.night1, .5); ctx.fillRect(x + 82, 120, 6, 480); ctx.fillRect(x, 350, 170, 6); }
  });
  lay(ctx, ic, 1, () => {
    ctx.fillStyle = lin(ctx, 0, 760, 0, 1200, [[0, mixHex(P.blue0, F.COOL.body, .35)], [1, mixHex(P.ind0, P.blue0, .3)]]); ctx.fillRect(-2000, 760, 6000, 1500);
    ctx.strokeStyle = rgba(F.COOL.line, .25); ctx.lineWidth = 2;
    for (let k = -8; k <= 8; k++) { ctx.beginPath(); ctx.moveTo(960 + k * 60, 760); ctx.lineTo(960 + k * 260, 1200); ctx.stroke(); }
    halo(ctx, 960, 420, 900, .18, F.COOL.halo, F.COOL.body);
    // robot behind the belt
    const per = 1.8, ph = ((t % per) + per) % per / per, dn = Math.sin(Math.PI * clamp(ph / .5)), sw = sineIO(clamp((ph - .3) / .5));
    E.robot(ctx, 960, 900, 420, { dir: 1, light: -1, hand: 'gripper', rim: F.COOL.line, body: mixHex(P.ind0, P.blue0, .2), armR: [lerp(.9, 1.7, sw) + .3 * dn, lerp(1.6, 2.0, sw) + .4 * dn], armL: [-.4, -.3] });
    // the belt + boxes moving right (constant, the same task again and again)
    ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(200, 780, 1520, 34); ctx.fillStyle = rgba(F.COOL.line, .4); ctx.fillRect(200, 780, 1520, 3);
    for (let x = 220; x < 1720; x += 60) { ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.arc(x, 820, 8, 0, TAU); ctx.fill(); }
    const v = 1 / per;
    for (let k = -1; k < 8; k++) { const x = 200 + ((k + t * v) % 8) * 190; if (x < 200 || x > 1680) continue;
      ctx.fillStyle = lin(ctx, 0, 730, 0, 780, [[0, mixHex(F.COOL.body, P.cream, .4)], [1, F.COOL.deep]]); ctx.beginPath(); ctx.roundRect(x, 734, 70, 46, 4); ctx.fill(); }
  });
}

// ============================================================================================================ THE RIDGE (subscribe 1)
// on the rank-row plain, far left of the row, at the horizon (card RZ, design coords). The crest tapers into the flat horizon at x ≈ −300.
export const RZ = 9000;
export const crestH = (x) => {
  const env = smooth(span(x, -5600, -4500)) * (1 - smooth(span(x, -1700, -250)));
  return env * (330 + 34 * Math.sin(x / 290) + 22 * Math.sin(x / 140 + 1));
};
export const crest = (x) => F.HOR - crestH(x);
export const PEOPLE = (() => { const r = prng(77), out = []; for (let x = -5000; x < -900; x += 96 + r() * 26) out.push({ x, h: 74 + r() * 10, ph: r() * 6 }); return out.filter((p) => crestH(p.x) > 70); })();
export const I0 = PEOPLE.findIndex((p) => p.x > -2600);
export const lampOf = (p) => [p.x + .314 * p.h, crest(p.x) - .542 * p.h + 9];   // a lantern hanging from the right hand (armR [.4, 1.3])
// st: { lit(i) → 0..1, spark: [[from i, to i, u]], sink 0..1 }
export function ridge(ctx, c, t, st) {
  E.card(ctx, c, RZ, () => {
    ctx.fillStyle = lin(ctx, 0, F.HOR - 380, 0, F.HOR + 4, [[0, mixHex(P.night1, P.ind0, .25)], [1, P.night1]]);
    ctx.beginPath(); ctx.moveTo(-6200, F.HOR + 4);
    for (let x = -6200; x <= 200; x += 25) ctx.lineTo(x, crest(x)); ctx.lineTo(200, F.HOR + 4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = 2; ctx.beginPath(); for (let x = -6200; x <= 200; x += 25) (x === -6200 ? ctx.moveTo(x, crest(x)) : ctx.lineTo(x, crest(x))); ctx.stroke();
    PEOPLE.forEach((p, i) => {
      const y = crest(p.x), L = st.lit(i);
      ctx.save(); ctx.translate(p.x, y); ctx.scale(1, 1 + .01 * Math.sin(t * 1.7 + p.ph)); ctx.translate(-p.x, -y);
      E.person(ctx, p.x, y, p.h, { dir: 1, light: 1, look: .1 + .1 * Math.sin(t * .5 + p.ph), armR: [.4 + .02 * Math.sin(t * 1.3 + p.ph), 1.3 + .03 * Math.sin(t * 1.1 + p.ph)], rim: L > .3 ? mixHex(P.halo0, P.core1, .3) : P.blue0 });
      ctx.restore();
      const [lx, ly] = lampOf(p);
      ctx.strokeStyle = mixHex(P.night1, P.ind2, .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(lx, ly - 9); ctx.lineTo(lx, ly - 4); ctx.stroke();
      ctx.fillStyle = mixHex(P.night1, P.ind2, .3); ctx.beginPath(); ctx.roundRect(lx - 4, ly - 4, 8, 10, 2); ctx.fill();
      if (L > 0) { halo(ctx, lx, ly + 4, 90 * (.6 + .4 * L), .55 * L, P.halo1, P.halo0); halo(ctx, lx, ly + 4, 16, .95 * L, P.halo0, P.core0); }
    });
    for (const [a, b, u] of st.spark || []) {
      const A = lampOf(PEOPLE[a]), B = lampOf(PEOPLE[b]), e = sineIO(u), x = lerp(A[0], B[0], e), y = lerp(A[1], B[1], e) - 22 * Math.sin(Math.PI * e);
      halo(ctx, x, y, 26, .9, P.halo0, P.core0);
    }
  });
}
