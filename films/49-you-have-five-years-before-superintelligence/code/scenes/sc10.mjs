// Film 49 · c10 · STEP 1 · YOUR SAY (B3). The same take as c09 (shared base in sc09.mjs: b3(T) camera, lights, law table).
//
// | beat  | phrase (VO)                        | picture                                                                                     | camera / kind     |
// |-------|------------------------------------|---------------------------------------------------------------------------------------------|-------------------|
// | 1.01  | One year to go · This step is yours| the step hit lights the top step (F.stepLight); the town square: façade, booth, lamp, the   | pull back · MIX   |
// |       |                                    | law table with the sheet and your tablet; you behind it                                    |                   |
// | 1.02★ | Voters have already … all but one  | night veil left: the U.S. outline draws itself, 10 lamps light (illustrative places);       | glide · EXPL      |
// |       |                                    | 3 NOV 2026; 41 ballots rise out of their lines (41 LOCAL MEASURES); on 'won' 40 tip over    |                   |
// |       |                                    | and turn gold, one stays upright: LIMITS WON 40; source BALLOTPEDIA                        |                   |
// | 1.03  | Those votes were about buildings   | the lines take the ballots back; the upright one flies into the world and stands on the     | pan right · EXPL  |
// |       |                                    | landing; out of it a data centre draws itself (cool outline); WHO GETS WHAT THE MACHINES    |                   |
// |       |                                    | EARN?                                                                                       |                   |
// | 1.04  | On the bigger question … a stake   | the outline runs back into the ballot, it folds into the tread; two people bring a paper   | back · EXPL       |
// |       |                                    | each to the law table (left: up the carved stair; right: down from the landing); TODAY·2026 |                   |
// | 1.05  | Senator Bernie Sanders … slim      | the left paper grows into the bill: AMERICAN A.I. SOVEREIGN WEALTH FUND ACT · 18 JUNE 2026; | hold · EXPL       |
// |       |                                    | a fund line pays out to a row of people; CHANCES: SLIM                                      |                   |
// | 1.06  | But here is his argument · C2      | the plate grows out of the bill (F.clipPlate), C2 plays, shrinks back into the left paper   | CLIP              |
// | 1.07  | Donald Trump has floated           | the right paper grows into the quote card (words light as spoken); back on 'Neither'        | hold · EXPL       |
// | 1.08  | Neither … show up … who gets a share| the papers lie on the table; the two people leave; you walk into the booth; WHO GETS A    | push · MIX        |
// |       |                                    | SHARE?                                                                                      |                   |
// Carriers: the step light · the ballot (grid → world → data centre) · the papers (table → card / plate → table) · you (to the booth).
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
import { b3, SIL, Y3, Y4, YL, LAW, YOU_LAW, BOOTH_X, figure, flipAt, lawTable, slabRect, veilL, grow, paperBox, inkBars } from './sc09.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, P, W, H, halo, prng } = E;
const { GOLD, COOL, PAPER } = F;
const TAU = Math.PI * 2;

export default async (T, R) => {
  const B = b3(T);
  return [{ t: R.a, draw: scene(B, T), print: F.PRINT49 }];
};

// ---------------------------------------------------------------------------------------------------------------- positions
const PAP_L = LAW.x0 + 16, PAP_R = LAW.x1 - 14;                 // where the two papers lie (lawTable papL / papR = 1)
const BALLOT_W = { x: 1872, y: YL };                            // the ballot on the landing (1.03), in front of the data centre
const DC = { x0: 1985, x1: 2260, y: S.LANDING.top - S.TD, h: 150 };   // the data centre (outline) on the landing
// the persons (1.04 / 1.08): left one up the carved stair of block 4, right one down from the landing
function personL(t, a) {
  const t0 = a.bigger + .6, w1 = span(t, t0, t0 + 2.0), cl = span(t, t0 + 2.0, t0 + 3.2), w2 = span(t, t0 + 3.2, t0 + 3.8);
  const lay = span(t, a.stake - .15, a.stake + .65);
  const l0 = a.neither + .4, b1 = span(t, l0, l0 + .5), dn = span(t, l0 + .5, l0 + 1.7), b2 = span(t, l0 + 1.7, l0 + 3.6);
  const xs = 1466, xe = PAP_L - 34;
  if (t < t0 || t > l0 + 3.6) return null;
  if (w1 < 1) return { x: lerp(1150, 1356, w1), y: Y3, o: { walk: w1 * 9, dir: 1 }, hold: 1 };
  if (cl < 1) { const p = S.climbPos(4, cl); return { x: p.x, y: p.y, o: { walk: cl * 9, dir: 1 }, hold: 1 }; }
  if (w2 < 1) return { x: lerp(xs, xe, sineIO(w2)), y: Y4, o: { walk: w2 * 3, dir: 1 }, hold: 1 };
  if (t < l0) { const r = F.bump(t, a.stake - .15, .8); return { x: xe, y: Y4, o: { dir: 1, lean: .2 * r, armR: [lerp(.75, .7, r), lerp(2.35, 1.0, r)], look: .2 * (1 - r) }, hold: lay < .5 ? 1 : 0 }; }
  if (b1 < 1) return { x: xe, y: Y4, flip: flipAt(t, l0, .5, 1), o: {}, hold: 0 };
  if (dn < 1) { const p = S.climbPos(4, 1 - dn); return { x: lerp(xe, p.x, Math.min(1, dn * 4)), y: p.y, o: { walk: dn * 9, dir: -1 }, hold: 0 }; }
  return { x: lerp(1356, 1120, b2), y: Y3, o: { walk: b2 * 9, dir: -1 }, hold: 0 };
}
function personR(t, a) {
  const t0 = a.bigger + 1.6, w1 = span(t, t0, t0 + 2.3), dn = span(t, t0 + 2.3, t0 + 2.6), w2 = span(t, t0 + 2.6, t0 + 3.2);
  const l0 = a.neither + .7, b1 = span(t, l0, l0 + .5), w3 = span(t, l0 + .5, l0 + 1.0), up = span(t, l0 + 1.0, l0 + 1.3), w4 = span(t, l0 + 1.3, l0 + 3.6);
  const xe = PAP_R + 34;
  if (t < t0 || t > l0 + 3.6) return null;
  if (w1 < 1) return { x: lerp(2090, 1770, w1), y: YL, o: { walk: w1 * 10, dir: -1 }, hold: 1 };
  if (dn < 1) return { x: lerp(1770, 1745, dn), y: lerp(YL, Y4, smooth(dn)), o: { walk: 10 + dn * 1.5, dir: -1 }, hold: 1 };
  if (w2 < 1) return { x: lerp(1745, xe, sineIO(w2)), y: Y4, o: { walk: 11.5 + w2 * 4, dir: -1 }, hold: 1 };
  if (t < l0) { const r = F.bump(t, a.stake + .1, .8); return { x: xe, y: Y4, o: { dir: -1, lean: .2 * r, armR: [lerp(.75, .7, r), lerp(2.35, 1.0, r)], look: .2 * (1 - r) }, hold: t < a.stake + .5 ? 1 : 0 }; }
  if (b1 < 1) return { x: xe, y: Y4, flip: flipAt(t, l0, .5, -1), o: {}, hold: 0 };
  if (w3 < 1) return { x: lerp(xe, 1745, w3), y: Y4, o: { walk: w3 * 4, dir: 1 }, hold: 0 };
  if (up < 1) return { x: lerp(1745, 1770, up), y: lerp(Y4, YL, smooth(up)), o: { walk: 4 + up * 1.5, dir: 1 }, hold: 0 };
  return { x: lerp(1770, 2160, w4), y: YL, o: { walk: 5.5 + w4 * 12, dir: 1 }, hold: 0 };
}
// you: behind the law table, then (show up) into the booth
function you10(t, a) {
  const w = span(t, a.showUp + .25, a.showUp + 1.7);
  const lk = .28 + .2 * smooth(span(t, a.say, a.say + 1.5)) * (1 - smooth(span(t, a.voters, a.voters + 1.5)));
  if (w <= 0) return { x: YOU_LAW, y: Y4, o: { look: lk + .15 * F.bump(t, a.stake, 1.6), back: .35 } };
  if (w < 1) return { x: lerp(YOU_LAW, BOOTH_X, sineIO(w)), y: Y4, o: { walk: w * 6, dir: 1, back: .35 } };
  return { x: BOOTH_X, y: Y4, o: { dir: 1, back: .3, look: .25 + .3 * smooth(span(t, a.ask, a.ask + 1.4)) } };
}

// ---------------------------------------------------------------------------------------------------------------- 1.02 the map + the ballots
// a simplified outline of the lower 48 (normalised box 0..1); the ten lamps are ILLUSTRATIVE places (the states are not named in the film)
const US = [[.02, .05], [.17, .04], [.55, .04], [.55, .02], [.58, .07], [.64, .1], [.7, .12], [.72, .18], [.76, .16], [.8, .22], [.8, .3], [.86, .25],
  [.88, .18], [.93, .13], [.96, .05], [1, .14], [.94, .24], [.93, .3], [.89, .36], [.87, .44], [.89, .5], [.84, .6], [.8, .68], [.81, .8], [.83, .94],
  [.79, .92], [.76, .78], [.72, .74], [.62, .76], [.6, .8], [.55, .77], [.5, .8], [.46, .92], [.42, .9], [.37, .78], [.33, .76], [.28, .7], [.22, .7],
  [.17, .66], [.1, .62], [.06, .52], [.02, .36], [0, .22], [.02, .05]];
const LAMPS = [[.12, .2], [.2, .46], [.34, .34], [.43, .6], [.54, .28], [.62, .5], [.7, .36], [.78, .58], [.86, .34], [.9, .22]];
const MAP = { x: 110, y: 270, w: 500, h: 300 };
const GRID = { x: 690, y: 300, cols: 7, dx: 58, dy: 64, bw: 38, bh: 48 };   // 41 ballots, 7 × 6 (the last row: 6)
const UPRIGHT = 40;                                                           // the one that stays upright (the last one)
const ballotXY = (i) => [GRID.x + (i % GRID.cols) * GRID.dx, GRID.y + Math.floor(i / GRID.cols) * GRID.dy];   // its foot (left)
function ballotShape(ctx, x, y, w, h, gold, rot) {   // a slip with a ticked box; (x, y) = bottom left; rot about the bottom right corner
  ctx.save(); ctx.translate(x + w, y); ctx.rotate(rot); ctx.translate(-w, 0);
  ctx.fillStyle = mixHex(PAPER.lit, GOLD.body, gold); ctx.beginPath(); ctx.roundRect(0, -h, w, h, 3); ctx.fill();
  ctx.fillStyle = rgba(mixHex(PAPER.ink, GOLD.deep, gold), .5); ctx.fillRect(6, -h + 9, w - 12, 3); ctx.fillRect(6, -h + 17, w - 18, 3);
  ctx.strokeStyle = mixHex(PAPER.ink, GOLD.deep, gold); ctx.lineWidth = 2; ctx.strokeRect(8, -h + 26, 12, 12);
  ctx.beginPath(); ctx.moveTo(10, -h + 32); ctx.lineTo(14, -h + 36); ctx.lineTo(21, -h + 25); ctx.stroke();
  ctx.restore();
}
function ballotsCard(ctx, t, a, flyOut) {
  const vis = 1 - span(t, a.buildings + .9, a.buildings + 1.7);
  if (span(t, a.voters + .1, a.voters + 2.1) <= 0 || vis <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the map: the outline draws itself (and runs back on 'buildings')
  const mu = span(t, a.voters + .1, a.voters + 2.1), mOut = span(t, a.buildings - .3, a.buildings + .9);
  const pts = US.map(([u, v]) => [MAP.x + u * MAP.w, MAP.y + v * MAP.h]);
  if (mOut < 1) {
    ctx.fillStyle = rgba(mixHex(P.night1, P.ind2, .6), .55 * smooth(mu) * (1 - mOut)); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.fill();
    F.goldSpan(ctx, pts, sineIO(mOut), sineIO(mu), { w: 2.2, spark: mu < 1 });
  }
  // ten lamps light one by one (November), dim with the outline
  LAMPS.forEach(([u, v], i) => {
    const k = expoOut(span(t, a.november + .2 + i * .09, a.november + .6 + i * .09)) * (1 - span(t, a.buildings - .3 + i * .04, a.buildings + .5 + i * .04)); if (k <= 0) return;
    const x = MAP.x + u * MAP.w, y = MAP.y + v * MAP.h;
    halo(ctx, x, y, 34, .55 * k, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.core, k); ctx.beginPath(); ctx.arc(x, y, 5.5 * k, 0, TAU); ctx.fill();
  });
  const tOut = span(t, a.buildings - .2, a.buildings + .6);
  F.goldText(ctx, [[F.SOURCES.ballotsDate, .9]], MAP.x, MAP.y - 50, 34, F.rise(span(t, a.november - .1, a.november + .7)) * (1 - tOut), { serif: false, weight: 700, spacing: .08 });
  F.goldText(ctx, [['10 STATES', .4]], MAP.x, MAP.y + MAP.h + 64, 30, F.rise(span(t, a.november + .9, a.november + 1.6)) * (1 - tOut), { serif: false, weight: 700, spacing: .08 });
  // the ballots: row lines draw, the slips rise out of them; on 'won' 40 tip over (gold), one stays upright
  const rows = Math.ceil(41 / GRID.cols), lu = span(t, a.ballots - .5, a.ballots + .3), sink = span(t, a.buildings - .2, a.buildings + .8);
  for (let r = 0; r < rows; r++) {
    const y = GRID.y + r * GRID.dy, n = Math.min(GRID.cols, 41 - r * GRID.cols), x1 = GRID.x + (n - 1) * GRID.dx + GRID.bw + 6;
    F.goldSpan(ctx, [[GRID.x - 6, y], [x1, y]], sineIO(span(sink, .4 + r * .05, 1)), sineIO(clamp(lu * 1.4 - r * .08)), { w: 1, spark: false, a: .8 });
  }
  for (let i = 0; i < 41; i++) {
    if (i === UPRIGHT && flyOut > 0) continue;
    const [x, y] = ballotXY(i), up = expoOut(span(t, a.ballots - .2 + i * .016, a.ballots + .5 + i * .016)) * (1 - sineIO(span(sink, i * .008, .6 + i * .008)));
    if (up <= 0) continue;
    const tip = i === UPRIGHT ? 0 : span(t, a.won + .05 + i * .017, a.won + .45 + i * .017), rot = (Math.PI / 2) * (tip < 1 ? expoOut(tip) * 1.06 - .06 * Math.sin(Math.PI * tip) : 1);
    ctx.save(); ctx.beginPath(); ctx.rect(x - 60, y - 120, 200, 120); ctx.clip();
    ballotShape(ctx, x, y + GRID.bh * (1 - up), GRID.bw, GRID.bh, smooth(tip), rot);
    ctx.restore();
  }
  F.goldText(ctx, [['41 LOCAL MEASURES', .5]], GRID.x - 6, GRID.y - GRID.bh - 32, 30, F.rise(span(t, a.ballots, a.ballots + .8)) * (1 - tOut), { serif: false, weight: 700, spacing: .08 });
  F.goldText(ctx, [['LIMITS WON ', .3], ['40', 1]], GRID.x - 6, GRID.y + (rows - 1) * GRID.dy + 92, 52, F.rise(span(t, a.won + .5, a.won + 1.3)) * (1 - tOut), { serif: false, weight: 800, spacing: .04 });
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- 1.03 the data centre
function coolSpan(ctx, pts, u0, u1, w = 2.4, a = 1) {   // the machine line (cool), drawn like goldSpan
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(u0 * L), [ex, ey, i1] = at(u1 * L), sub = [[sx, sy]]; for (let i = i0; i < i1; i++) sub.push(pts[i]); sub.push([ex, ey]);
  for (const [k, al, c, op] of [[4, .22, COOL.halo, 'lighter'], [1.8, .85, COOL.body, 'source-over'], [.8, 1, COOL.core, 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = c; ctx.globalAlpha = al * a; ctx.lineWidth = w * k; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
  }
  if (u1 < 1) halo(ctx, ex, ey, w * 10, .6 * a, COOL.halo, COOL.core);
  return [ex, ey];
}
// the outline as one line: from the ballot along the ground, round the hall (roof units, a row of windows), back to the ground
const DC_PATH = (() => {
  const { x0, x1, y, h } = DC, top = y - h, p = [[BALLOT_W.x + 14, y], [x0, y], [x0, top]];
  for (let i = 0; i < 3; i++) { const ux = x0 + 30 + i * 84; p.push([ux, top], [ux, top - 16], [ux + 46, top - 16], [ux + 46, top]); }
  p.push([x1, top], [x1, y], [x0 + 10, y]);
  return p;
})();
function dataCentre(ctx, t, a) {
  const u = span(t, a.buildings + .9, a.buildings + 2.2), out = span(t, a.bigger + 1.0, a.bigger + 2.0);
  if (u <= 0 || out >= 1) return;
  coolSpan(ctx, DC_PATH, sineIO(out), sineIO(u), 2.2);
  const wk = clamp(u * 1.4 - .4) * (1 - out);   // a row of lit windows and the hum of the racks (cool, steady blink)
  if (wk > 0) for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const on = .55 + .45 * Math.sin(t * 2.3 + i * 1.7 + r * 2.9); ctx.fillStyle = rgba(COOL.core, .7 * wk * on); ctx.fillRect(DC.x0 + 22 + i * 41, DC.y - DC.h + 40 + r * 40, 18, 6); }
  if (wk > 0) halo(ctx, (DC.x0 + DC.x1) / 2, DC.y - DC.h / 2, 260, .14 * wk, COOL.halo, COOL.core);
}
function ballotWorld(ctx, t, a) {   // the upright ballot after its flight: it stands on the landing, folds into the tread on the way out
  const land = span(t, a.buildings - .3, a.buildings + 1.1), fold = span(t, a.bigger + 2.0, a.bigger + 2.6);
  if (land < 1 || fold >= 1) return;
  const k = 1 - sineIO(fold);
  ctx.save(); ctx.translate(0, BALLOT_W.y); ctx.scale(1, k); ctx.translate(0, -BALLOT_W.y);
  ballotShape(ctx, BALLOT_W.x - 7, BALLOT_W.y, 14, 18, 0, 0);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- 1.05 the bill (left paper)
const BILL = { x: 130, y: 150, w: 760, h: 560 };
function billCard(ctx, t, a, e) {
  paperBox(ctx, BILL, -.006);
  if (e < .7) return;
  const v = span(e, .7, 1), { x, y, w, h } = BILL;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(-.006); ctx.translate(-w / 2, -h / 2); ctx.globalAlpha *= v;
  const head = F.rise(span(t, a.sanders + .9, a.sanders + 1.8));
  F.maskLine(ctx, [['AMERICAN A.I. SOVEREIGN', 0]], 44, 96, 44, head, { serif: true, col: PAPER.ink, glow: false });
  F.maskLine(ctx, [['WEALTH FUND ACT', 0]], 44, 150, 44, F.rise(span(t, a.sanders + 1.05, a.sanders + 1.95)), { serif: true, col: PAPER.ink, glow: false });
  F.maskLine(ctx, [['18 JUNE 2026', 0]], 44, 196, 24, F.rise(span(t, a.sanders + 1.4, a.sanders + 2.2)), { serif: false, weight: 600, col: mixHex(PAPER.ink, PAPER.faint, .4), glow: false });
  ctx.fillStyle = rgba(PAPER.faint, .5); ctx.fillRect(44, 222, w - 88, 2);
  // the fund: one gold line out of a pool, branching to a row of people (on 'shares that pays out to every American')
  const fu = span(t, a.fund - .1, a.fund + 1.6), pay = span(t, a.fund + 1.6, a.fund + 3.4), px0 = 90, py = 330, n = 11, gx0 = 230, gx1 = w - 70, gy = 400;
  if (fu > 0) {
    ctx.fillStyle = mixHex(GOLD.mid, GOLD.body, .5); ctx.beginPath(); ctx.ellipse(px0, py, 40 * expoOut(fu), 16 * expoOut(fu), 0, 0, TAU); ctx.fill();
    halo(ctx, px0, py, 80, .3 * fu, GOLD.halo, GOLD.core);
    E.glowText(ctx, 'A.I. SHARES', px0, py + 48, { size: 22, weight: 600, align: 'center', col: mixHex(PAPER.ink, PAPER.faint, .3), glow: false, a: smooth(fu) });
  }
  for (let i = 0; i < n; i++) {
    const gx = lerp(gx0, gx1, i / (n - 1)), k = span(pay, i * .05, .45 + i * .05);
    const fx = expoOut(span(fu, .3 + i * .03, .8 + i * .03)); if (fx <= 0) continue;
    E.person(ctx, gx, gy + 70, 66 * fx, { dir: -1, light: .5, look: .3 * k });   // the row of people (ink silhouettes on paper)
    if (k > 0) F.goldSpan(ctx, [[px0 + 40, py], [lerp(px0 + 40, gx, .5), py - 26], [gx, gy - 6]], 0, sineIO(k), { w: 1.5, spark: k < 1 });
    if (k >= 1) halo(ctx, gx, gy - 4, 16, .4, GOLD.halo, GOLD.core);
  }
  const ch = span(t, a.chances - .05, a.chances + .9);
  if (ch > 0) {   // CHANCES: SLIM in deep ink-gold on the paper, a gold rule draws under it
    F.maskLine(ctx, [[F.SOURCES.fundChances, 0]], 44, h - 50, 40, F.rise(ch), { serif: false, weight: 800, col: GOLD.deep, glow: false });
    F.goldSpan(ctx, [[44, h - 34], [44 + F.measure(F.SOURCES.fundChances, 40, false, 800) + 10, h - 34]], 0, smooth(span(ch, .35, 1)), { w: 1.6, spark: false });
  }
  ctx.restore();
}
// the quote card's rect (wrapped like F.quoteCard: 24 + lines·size·1.22 + 92)
const QUOTE = { x: 100, y: 190, w: 820, size: 48 };
function quoteH() {
  const words = F.SOURCES.trump.split(/\s+/), pad = 54; let n = 1, cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), QUOTE.size, true) > QUOTE.w - pad * 2) { n++; cur = [wd]; } else cur = nx; }
  return 24 + n * QUOTE.size * 1.22 + 92;
}

// WHO GETS A SHARE? (1.08; it sinks at the start of c11, which draws the same call)
export const shareCaption = (ctx, t, a) => F.caption(ctx, t, W / 2, 250, [F.SOURCES.share], span(t, a.whoShare - .1, a.whoShare + .9), { size: 120, align: 'center', out: span(t, a.great - .2, a.great + 1.0) });

// ================================================================================================================ the scene
function scene(B, T) {
  const { a } = B, clip = T.clip('C2'), QH = quoteH();
  const QR = { x: QUOTE.x, y: QUOTE.y, w: QUOTE.w, h: QH };
  return (ctx, t) => {
    const c = B.cam(t), you = you10(t, a), pl = personL(t, a), pr = personR(t, a);
    const papL = span(t, a.stake + .05, a.stake + .55), papR = span(t, a.stake + .35, a.stake + .85);
    // which paper is "up" (a card): the bill (left) · the plate (from the bill, back to the left paper) · the quote (right)
    const billU = span(t, a.sanders + .2, a.sanders + 2.0);
    const plateM = clip ? Math.min(span(t, a.argument, clip.start), 1 - span(t, clip.end, clip.end + 1.8)) : 0;
    const plateOn = clip && t >= a.argument && t < clip.end + 1.8;
    const quoteU = span(t, clip ? clip.end + 1.4 : a.trump, (clip ? clip.end + 1.4 : a.trump) + 1.8) * (1 - span(t, a.neither + .1, a.neither + 1.9));
    const billShown = billU > 0 && !(plateOn && sineIO(plateM) >= .95) && !(clip && t >= clip.start);
    const lifted = { L: (billU > 0 && t < (clip ? clip.end + 1.8 : a.trump)), R: quoteU > 0 };   // the paper is "in the air" (a card) while up
    let flyOut = span(t, a.buildings - .3, a.buildings + 1.1);
    const hands = {};
    const st = {
      lit: B.lit(t), stage: [0, 0, 0, B.stage(t)[3], B.stage(t)[4]], you: false,
      land: (cx) => {
        figure(cx, you);
        lawTable(cx, t, B.lawK(t), { sheet: 1, tablet: 1, papL: lifted.L ? 0 : papL, papR: lifted.R ? 0 : papR });
        for (const [p, k] of [[pl, 'L'], [pr, 'R']]) {
          if (!p) continue;
          hands[k] = figure(cx, p, 'person');
          if (p.hold && hands[k]?.R) { const [hx, hy] = hands[k].R; cx.fillStyle = PAPER.body; cx.save(); cx.translate(hx, hy); cx.rotate(k === 'L' ? -.3 : .3); cx.fillRect(-9, -3, 18, 4); cx.restore(); }
        }
        ballotWorld(cx, t, a);
        dataCentre(cx, t, a);
      },
    };
    S.stairsWorld(ctx, c, t, st);
    // ---- 1.02 ★ the map and the ballots (veil left; the square glides on the right)
    const vA = .66 * smooth(span(t, a.voters - .2, a.voters + 1.4)) * (1 - smooth(span(t, a.buildings + .2, a.buildings + 2.0)));
    veilL(ctx, vA, 1200);
    ballotsCard(ctx, t, a, flyOut);
    F.source(ctx, t, a.ballots, a.buildings + 1.0, F.SOURCES.ballots);
    // the upright ballot flies into the world (screen → its place on the landing)
    if (flyOut > 0 && flyOut < 1) {
      const [bx, by] = ballotXY(UPRIGHT), p = E.project(c, S.Z_LAND, BALLOT_W.x, BALLOT_W.y);
      if (p) {
        const e = sineIO(flyOut), s = lerp(1, p[2] * 14 / GRID.bw, e), x = lerp(bx, p[0] - 7 * p[2], e), y = lerp(by, p[1], e) - 60 * Math.sin(Math.PI * e);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(s, s * lerp(1, 18 / 14 * GRID.bw / GRID.bh, e)); ballotShape(ctx, 0, 0, GRID.bw, GRID.bh, 0, 0); ctx.restore();
      }
    }
    // ---- 1.03 the question
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    { const qu = F.rise(span(t, a.buildings + 1.2, a.buildings + 2.0)) * (1 - span(t, a.bigger + 1.4, a.bigger + 2.1)), q2 = F.rise(span(t, a.buildings + 1.35, a.buildings + 2.15)) * (1 - span(t, a.bigger + 1.4, a.bigger + 2.1));
      F.goldText(ctx, [['WHO GETS WHAT', 0]], 90, 270, 54, qu, { serif: false, weight: 800, spacing: .04 });
      F.goldText(ctx, [['THE ', 0], ['MACHINES EARN?', .9]], 90, 336, 54, q2, { serif: false, weight: 800, spacing: .04 }); }
    ctx.restore();
    // ---- 1.04 TODAY · 2026 (a label from the table)
    const tl = span(t, a.stake + .4, a.stake + 1.1) * (1 - span(t, a.sanders + .3, a.sanders + .9));
    if (tl > 0) { const p = E.project(c, S.Z_LAND, LAW.x0 + 4, LAW.y + 2); if (p) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.goldLabel(ctx, p[0], p[1], 'TODAY · 2026', null, tl, { dx: -190, dy: -90, size: 30 }); ctx.restore(); } }
    // ---- 1.05 the bill grows out of the left paper
    const rL = slabRect(c, PAP_L, 22), rR = slabRect(c, PAP_R, 22);
    if (billShown) grow(ctx, rL, BILL, billU, (cx, e) => billCard(cx, t, a, e));
    // ---- 1.06 C2: the plate grows out of the bill and goes back into the left paper
    if (plateOn) {
      const back = clip && t >= clip.end;
      const from = back ? rL : [BILL.x + BILL.w / 2, BILL.y + BILL.h / 2, 6];
      F.veil(ctx, .6 * sineIO(plateM));   // final: the lit door behind the landscape plate covered the credit line; a night veil keeps the lower third readable
      F.clipPlate(ctx, t, T, 'C2', { from, morph: plateM });
    }
    // ---- 1.07 the quote card grows out of the right paper (and goes back on 'Neither')
    if (quoteU > 0) grow(ctx, rR, QR, quoteU, (cx, e) => F.quoteCard(cx, t, T, { text: F.SOURCES.trump, x: QUOTE.x, y: QUOTE.y, w: QUOTE.w, size: QUOTE.size, spoken: ['the American public', 'companies'], credit: F.SOURCES.trumpSrc, u: 1, a: span(e, .55, .85) > 0 ? 1 : 1 }));
    // ---- 1.08 WHO GETS A SHARE?
    shareCaption(ctx, t, a);
    F.counter(ctx, t, T);
  };
}
