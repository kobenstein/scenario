// c05 · B1 · 'His picture for that power' → 'Tower or wall' · shots 4.01–4.06. One entry, one draw function, motifs on the voice,
// carriers between them (never a fade, never a cut).
//
// | ID   | anchor (phrase)            | motif                                                                                          | type | carrier → next      |
// |------|----------------------------|------------------------------------------------------------------------------------------------|------|---------------------|
// | 4.01 | His picture for that power | WHO DECIDES? sinks, the card becomes Babel's base tier; the tower grows in one go, one colour, one rhythm · §7 | MIX | the tower |
// | 4.02 | One language               | the §7 phrases light one by one, a spark carries each onto a tier: ONE LANGUAGE · ONE TECHNOLOGY · ONE DIRECTION | EXPL | the tower |
// | 4.03 | Against it he sets         | pull back: a whole people walks in with stones, the wall rises stone by stone, every stone different · §9 | MIX | the gap |
// | 4.04 | This is what disarm        | DISARM is lowered on the hook into the gap and lands; its gold rule draws                     | EXPL | DISARM              |
// | 4.05 | These machines             | gold race arrows climb the tower; on 'out of the race' they are plucked off and fall · §110 (the card refills) | EXPL | the arrows |
// | 4.06 | And out of the hands       | three big hands grip the tower's top, open on 'few' and withdraw · §110 second line            | EXPL | the stage → c06 split |
import * as F from '../lib/f63_kit.mjs';
import * as B from '../lib/f63_b1_kit.mjs';
import { anchorsWho, drawWhoCard, QW } from './sc04.mjs';
import { createCanvas } from '@napi-rs/canvas';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, GOLD, CREAM, lin } = F;
export const PRINT = F.PRINT63;

// ---------------------------------------------------------------- the stage (world coordinates; c06 imports all of it)
export const TWR = { x: 470, base: 900, w: 400, h: 585 };
export const TIER = TWR.h / 9;
export const WAL = { x0: 1060, x1: 1780, base: 900, h: 300, cx: 1420 };
export const DSM = { x: 865, y: 878, size: 88 };
export const PPL = { x: [1110, 1235, 1360, 1485, 1610, 1735], h: 165, walk: 520 };
const TCOL = mixHex(P.blue1, P.cream, .25);
const Z1 = 1.3, CAM1 = [TWR.x - (720 - W / 2) / Z1, TWR.base - (900 - H / 2) / Z1, Z1];
const PLAQ = [[1, 'ONE LANGUAGE'], [3, 'ONE TECHNOLOGY'], [5, 'ONE DIRECTION']];
const Q7 = { x: 1130, y: 430, size: 54, lh: 74, lines: [['“a single ', 'language,'], ['a single ', 'technology,'], ['a single ', 'direction”']] };
export const CARD = { x: 1050, y: 92, w: 790, size: 36 };
const Q9 = '“…between constructing Babel or rebuilding Jerusalem”';
const Q110a = '“Disarming AI means freeing it from the mentality of “armed” competition”';
const Q110b = '“…freeing technology from monopolistic control”';
const nz = (s) => s.toLowerCase().replace(/[^a-z]/g, '');

export function anchorsBabel(T, after) {
  const G = (p, a2) => T.G(p, 0, a2 ?? after);
  const a = { ...anchorsWho(T) };
  a.his = G('His picture for that power'); a.power = G('power', a.his); a.towerW = G('Tower of Babel', a.his); a.babel = G('Babel', a.towerW);
  a.one = [G('One language', a.babel), G('one technology', a.babel), G('one direction', a.babel)];
  a.oneW = [G('language', a.one[0]), G('technology', a.one[1]), G('direction', a.one[2])];
  a.against = G('Against it he sets', a.babel); a.city = G('city wall', a.against); a.rebuilt = G('rebuilt by', a.city); a.whole = G('whole people', a.rebuilt); a.together = G('together', a.whole);
  a.this = G('This is what disarm', a.together); a.disarm = G('disarm means', a.this);
  a.these = G('These machines', a.disarm); a.out = G('out of the race', a.these); a.race = G('race for', a.out); a.dom = G('dominance', a.out);
  a.andOut = G('And out of the hands', a.dom); a.hands = G('hands of a few', a.andOut); a.few = G('few', a.hands);
  return a;
}
// the camera: close on the tower (it fills the left of the frame), a slow push, then the pull-back that reveals the wall site
export function babelCam(t, a) {
  return B.cam(t, [[a.his, ...CAM1], [a.babel + .3, ...CAM1], [a.against - .15, CAM1[0] + 12, CAM1[1] - 8, Z1 * 1.03], [a.city + .45, ...CAMF]]);
}
export const CAMF = [W / 2, 590, 1.08];   // the stage at rest (c06 starts here)
const kv = (t, K, i) => B.keys(t, K.map((k) => [k[0], k[i]]));

// the card heights (dry run, no drawing)
let DRY = null;
function cardDims() {
  if (DRY) return DRY;
  const g = createCanvas(8, 8).getContext('2d'), o = { x: CARD.x, y: CARD.y, w: CARD.w, size: CARD.size, u: 1 };
  const h9 = B.qcard(g, 0, null, { ...o, text: Q9, head: 'x' }).h, hA = B.qcard(g, 0, null, { ...o, text: Q110a, head: 'x' }).h, hB = B.qcard(g, 0, null, { ...o, text: Q110b }).h;
  const nA = Math.round((hA - 66 - 40) / (CARD.size * 1.22)), nB = Math.round((hB - 26 - 40) / (CARD.size * 1.22));
  const yB = CARD.y + 66 + nA * CARD.size * 1.22 + 16 - 26;
  DRY = { h9, hA, yB, hAB: yB - CARD.y + 26 + nB * CARD.size * 1.22 + 40 };
  return DRY;
}

// ---------------------------------------------------------------- pieces (exported: c06 transforms them)
export function drawTower(ctx, t, a, u, lit) {
  F.tower(ctx, t, TWR.x, TWR.base, TWR.w, TWR.h, { u, col: TCOL, lit });
}
export function drawPlaques(ctx, t, a, o = {}) {
  PLAQ.forEach(([i, label], k) => {
    const open = expoOut(span(t, a.oneW[k] - .05, a.oneW[k] + .35)) * (1 - expoIn(clamp(o.out ?? 0))); if (open <= 0) return;
    const y = TWR.base - (i + .5) * TIER, pw = TWR.w * (1 - .085 * i) * .9 * open, ph = 38;
    ctx.save(); ctx.fillStyle = rgba(P.night0, .86); ctx.beginPath(); ctx.roundRect(TWR.x - pw / 2, y - ph / 2, pw, ph, 6); ctx.fill();
    ctx.strokeStyle = rgba(GOLD.line, .8); ctx.lineWidth = 1.6; ctx.stroke();
    ctx.beginPath(); ctx.rect(TWR.x - pw / 2, y - ph / 2, pw, ph); ctx.clip();
    F.capsLabel(ctx, label, TWR.x, y + 8, span(open, .45, 1), { size: 22, col: GOLD.text });
    ctx.restore();
  });
}
const plaqueEnd = (k) => { const i = PLAQ[k][0]; return [TWR.x + TWR.w * (1 - .085 * i) * .45, TWR.base - (i + .5) * TIER]; };
export function drawPeople(ctx, t, a, o = {}) {
  PPL.x.forEach((px, i) => {
    const t0 = a.against + .05 + i * .2, p = span(t, t0, t0 + 1.7), s = 1 - (1 - p) ** 2, x = px + PPL.walk * (1 - s);
    const hue = (i * .37) % 1, scol = mixHex(mixHex(P.shade0, P.blue1, hue), P.cream, .16);
    let hands;
    if (p < 1) hands = F.person(ctx, x, WAL.base, PPL.h, { pose: 'walk', walk: PPL.walk * s / (PPL.h * .2), dir: -1, armR: [.8, 2.3], armL: [.7, 2.2], light: 1 });
    else {
      const lift = expoOut(span(t, t0 + 1.7, t0 + 2.15)), cyc = Math.sin((t - t0) * 4.1 + i * 1.3);
      const A1 = lerp(.8, 2.7, lift) + .1 * cyc * lift, A2 = lerp(2.3, 3.0, lift);
      hands = F.person(ctx, x, WAL.base, PPL.h, { view: 'back', armR: [A1, A2], armL: [-A1, -A2], look: .7, light: 1 });
    }
    const hx = p < 1 ? hands.R[0] : (hands.R[0] + hands.L[0]) / 2, hy = (p < 1 ? hands.R[1] : (hands.R[1] + hands.L[1]) / 2) - 12;
    if (o.stones !== false) { ctx.fillStyle = scol; ctx.beginPath(); ctx.roundRect(hx - 22, hy - 12, 44, 24, 4); ctx.fill(); ctx.fillStyle = rgba(P.core1, .3); ctx.fillRect(hx - 20, hy - 10, 40, 2); }
  });
}
export function disarmW() { return F.measure('DISARM', DSM.size, true); }
export function drawDisarm(ctx, t, a, o = {}) {
  const t0 = a.this - .45, p = span(t, t0, a.disarm); if (p <= 0) return;
  const y = lerp(-160, DSM.y, 1 - (1 - p) ** 3), rot = .06 * Math.sin((t - t0) * 4.2) * (1 - p) ** 1.5, sq = F.bump(t, a.disarm, .28), tw = disarmW();
  // the hook: comes down with the word, lets go after the landing and rises out of frame
  const up = expoIn(span(t, a.disarm + .35, a.disarm + 1.0)) * 1300, hy = y - DSM.size * .8 - up;
  if (up < 1250) {
    ctx.save(); ctx.strokeStyle = rgba(GOLD.line, .85); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(DSM.x, -700); ctx.lineTo(DSM.x, hy - 26); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(DSM.x - 9, hy - 8, 11, -Math.PI * .5, Math.PI * .9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(DSM.x, hy - 26); ctx.lineTo(DSM.x, hy - 19); ctx.stroke(); ctx.restore();
  }
  const out = clamp(o.out ?? 0);
  ctx.save(); ctx.translate(DSM.x, y); ctx.rotate(rot); ctx.scale(1 + .05 * sq, 1 - .07 * sq);
  if (out > 0) { ctx.beginPath(); ctx.rect(-tw, -DSM.size * 1.1, tw * 2, DSM.size * 1.12); ctx.clip(); ctx.translate(0, expoIn(out) * DSM.size * 1.1); }
  F.glowText(ctx, 'DISARM', 0, 0, { size: DSM.size, serif: true, align: 'center', col: GOLD.text, glow: true });
  ctx.restore();
  if (o.rule !== false) {
    const ru = sineIO(span(t, a.disarm + .2, a.disarm + .7)), ry = DSM.y + 16;
    if (ru > 0) F.goldSpan(ctx, [[DSM.x - tw / 2, ry], [DSM.x + tw / 2, ry]], 0, ru, { w: 2.2, spark: true });
    if (ru >= 1) { const g = ((t - a.disarm) / 2.6) % 1, ga = Math.sin(Math.PI * g); F.halo(ctx, DSM.x - tw / 2 + tw * F.smooth(g), ry, 24 + 8 * ga, .7 * ga, P.halo0, P.core0); }
  }
}
function chevron(ctx, x, y, s, rot, a1 = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a1;
  F.halo(ctx, 0, 0, s * 1.6, .35, GOLD.halo, GOLD.core);
  ctx.strokeStyle = GOLD.body; ctx.lineWidth = s * .28; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-s, s * .55); ctx.lineTo(0, -s * .45); ctx.lineTo(s, s * .55); ctx.stroke();
  ctx.strokeStyle = GOLD.core; ctx.lineWidth = s * .09; ctx.stroke(); ctx.restore();
}
function drawArrows(ctx, t, a) {
  const t0 = a.these + .1;
  if (t < t0 || t > a.out + 1.6) return;
  ctx.save(); ctx.beginPath(); ctx.rect(-W, -H, W * 3, TWR.base + H); ctx.clip();
  for (const sd of [-1, 1]) for (let k = 0; k < 4; k++) {
    const tb = t0 + k * .2 + (sd > 0 ? .1 : 0); if (t < tb) continue;
    const tp = a.out + .05 + k * .06 + (sd > 0 ? .03 : 0), tc = Math.min(t, tp);
    const s = ((tc - tb) * .62) % 1, y = lerp(TWR.base - 20, TWR.base - TWR.h + 14, s ** 1.15);
    const i = clamp(Math.floor((TWR.base - y) / TIER), 0, 8), hw = TWR.w / 2 * (1 - .085 * i), x = TWR.x + sd * (hw + 28);
    const sc = Math.min(1, s * 7, (1 - s) * 7);
    if (t < tp) { chevron(ctx, x, y, 20 * sc, 0); continue; }
    const pull = expoOut(span(t, tp, tp + .3)), g = expoIn(span(t, tp + .18, tp + .95)), rot = sd * Math.PI / 2 * sineIO(span(t, tp + .12, tp + .7));
    chevron(ctx, x + sd * 110 * pull, lerp(y, TWR.base + 40, g), 20 * Math.max(sc, .6), rot);
  }
  ctx.restore();
}
const HANDS = [[.95, 418, 352], [Math.PI / 2, 470, 334], [Math.PI - .95, 522, 352]];   // [angle, fingertip x, y] on the top tiers
function drawHands(ctx, t, a) {
  HANDS.forEach(([ang, fx, fy], i) => {
    const d = [Math.cos(ang), Math.sin(ang)], S = 100, wx = fx - d[0] * S * 1.85, wy = fy - d[1] * S * 1.85;
    const e = expoOut(span(t, a.andOut - .15 + i * .09, a.andOut + .5 + i * .09)), w = expoIn(span(t, a.few + .3 + i * .06, a.few + 1.0 + i * .06));
    if (e <= 0 || w >= 1) return;
    const grip = sineIO(span(t, a.andOut + .35 + i * .09, a.andOut + .65 + i * .09)), open = sineIO(span(t, a.few - .05, a.few + .25));
    const curl = lerp(lerp(.1, .72, grip), 0, open), back = 720 * (1 - e) + 950 * w;
    B.bigHand(ctx, wx - d[0] * back, wy - d[1] * back, S, ang, { curl, spread: lerp(.25, .6, open), flip: i === 2 ? -1 : 1 });
  });
}

// ---------------------------------------------------------------- the whole picture at time t (c06 draws it with o.* overrides)
// o: { cam [cx, cy, z], towerM [dx, dy, s] (about the tower's foot), wallM [dx, dy, s] (about the wall's foot centre), cardOut 0..1,
//      labOut 0..1, plaqOut 0..1, disarm { out, rule }, noDisarm, peopleOut 0..1, towerLift (px), lit (+), extraWorld(ctx) }
export function drawBabel(ctx, t, a, T, o = {}) {
  const [cx, cy, z] = o.cam ?? babelCam(t, a);
  const mor0 = a.his + .25, mor1 = a.power + .1, grow0 = mor1, grow1 = a.babel + .25;
  const GL = [[a.his, W / 2, 470, 1000, .6], [mor1, 720, 560, 950, .75], [a.against - .15, 720, 560, 950, .75], [a.city + .45, W / 2, 560, 1150, .65]];
  F.night(ctx, t, { glow: [kv(t, GL, 1), kv(t, GL, 2), kv(t, GL, 3), kv(t, GL, 4)] });

  // ------------------------------------------------ the world
  const lu = sineIO(span(t, mor0, mor1)), lit = .22 + .55 * span(t, a.these, a.these + .6) - .45 * span(t, a.out + .3, a.out + 1.0) + .3 * span(t, a.andOut + .4, a.andOut + .8) - .3 * span(t, a.few, a.few + .6) + (o.lit ?? 0);
  F.look(ctx, cx, cy, z, () => {
    if (lu > 0) F.land(ctx, TWR.base + (1 - lu) * 520);
    if (o.extraBack) o.extraBack(ctx);
    // the wall, its builders
    const wm = o.wallM ?? [0, 0, 1];
    ctx.save(); ctx.translate(WAL.cx + wm[0], WAL.base + wm[1]); ctx.scale(wm[2], wm[2]); ctx.translate(-WAL.cx, -WAL.base);
    const wu = span(t, a.city - .05, a.together + .3);
    if (wu > 0) F.wall(ctx, t, WAL.x0, WAL.x1, WAL.base, WAL.h, { u: wu });
    F.capsLabel(ctx, 'THE WALL OF JERUSALEM', WAL.cx, WAL.base - WAL.h - 34, span(t, a.city + .3, a.city + .8) * (1 - clamp(o.labOut ?? 0)), { size: 24 });
    if ((o.peopleOut ?? 0) < 1) { ctx.save(); ctx.beginPath(); ctx.rect(WAL.x0 - 400, -H, WAL.x1 - WAL.x0 + 2000, WAL.base + H); ctx.clip(); ctx.translate(0, expoIn(clamp(o.peopleOut ?? 0)) * PPL.h * 1.15); drawPeople(ctx, t, a); ctx.restore(); }
    ctx.restore();
    // the tower
    const tm = o.towerM ?? [0, 0, 1];
    ctx.save(); ctx.translate(TWR.x + tm[0], TWR.base + tm[1]); ctx.scale(tm[2], tm[2]); ctx.translate(-TWR.x, -TWR.base);
    if (o.underTower) o.underTower(ctx);
    if (t >= grow0) {   // the arches come in on the card-become-tier over .3 s (no pop)
      const ar = span(t, grow0, grow0 + .3);
      if (ar < 1) { const c0 = mixHex(TCOL, P.night1, .55); ctx.fillStyle = lin(ctx, TWR.x - TWR.w / 2, 0, TWR.x + TWR.w / 2, 0, [[0, c0], [.6, TCOL], [1, mixHex(TCOL, P.night1, .3)]]); ctx.fillRect(TWR.x - TWR.w / 2, TWR.base - TIER, TWR.w, TIER); }
      ctx.save(); ctx.globalAlpha *= ar; drawTower(ctx, t, a, lerp(1 / 9, 1, span(t, grow0, grow1)), clamp(lit)); ctx.restore();
      if (ar < 1) { ctx.save(); ctx.globalAlpha *= 1 - ar; ctx.fillStyle = lin(ctx, TWR.x - TWR.w / 2, 0, TWR.x + TWR.w / 2, 0, [[0, mixHex(TCOL, P.night1, .55)], [.6, TCOL], [1, mixHex(TCOL, P.night1, .3)]]); ctx.fillRect(TWR.x - TWR.w / 2, TWR.base - TIER * .995, TWR.w, TIER * .995); ctx.restore(); }
    }
    drawPlaques(ctx, t, a, { out: o.plaqOut });
    F.capsLabel(ctx, 'THE TOWER OF BABEL', TWR.x, TWR.base - TWR.h - 34, span(t, a.babel - .05, a.babel + .4) * (1 - clamp(o.labOut ?? 0)), { size: 24 });
    drawArrows(ctx, t, a);
    drawHands(ctx, t, a);
    if (o.onTower) o.onTower(ctx);
    ctx.restore();
    if (!o.noDisarm) drawDisarm(ctx, t, a, o.disarm);
    if (o.extraWorld) o.extraWorld(ctx);
  });

  // ------------------------------------------------ the screen layer: WHO DECIDES? → the base tier
  if (t < mor1) {
    const m = sineIO(span(t, mor0, mor1)), out = span(t, a.his + .05, a.his + .5);
    if (m <= 0) drawWhoCard(ctx, t, a, { out });
    else {
      const p0 = F.lookPt(cx, cy, z, TWR.x - TWR.w / 2, TWR.base - TIER), p1 = F.lookPt(cx, cy, z, TWR.x + TWR.w / 2, TWR.base);
      const r = { x: lerp(QW.x, (p0[0] + p1[0]) / 2, m), y: lerp(QW.y, (p0[1] + p1[1]) / 2, m), w: lerp(QW.w, p1[0] - p0[0], m), h: lerp(QW.h, p1[1] - p0[1], m) };
      const c0 = mixHex(P.night1, P.ind2, .55), shade = mixHex(TCOL, P.night1, .55);
      r.col = lin(ctx, r.x - r.w / 2, 0, r.x + r.w / 2, 0, [[0, mixHex(c0, shade, m)], [.6, mixHex(c0, TCOL, m)], [1, mixHex(c0, mixHex(TCOL, P.night1, .3), m)]]);
      r.r = lerp(16, 0, m); r.edge = .75 * (1 - m); r.shadow = 1 - m;
      drawWhoCard(ctx, t, a, { rect: r, out, live: 1 - m });
    }
  }
  // §7: three phrases, each lights and sends a spark onto its tier
  const q7out = span(t, a.against - .35, a.against + .15);
  if (t > a.babel && q7out < 1) {
    F.capsLabel(ctx, 'MAGNIFICA HUMANITAS · §7', Q7.x, Q7.y - 84, span(t, a.babel + .05, a.babel + .55) * (1 - q7out), { size: 22, align: 'left' });
    Q7.lines.forEach(([pre, wd], k) => {
      const u = span(t, a.babel + .15 + k * .12, a.babel + .85 + k * .12) * (1 - q7out), m = span(t, a.oneW[k] - .1, a.oneW[k] + .25);
      if (u > 0) F.goldText(ctx, [[pre, 0], [wd, m]], Q7.x, Q7.y + k * Q7.lh, Q7.size, u, { serif: true, glow: m > .5 });
    });
  }
  for (let k = 0; k < 3; k++) {
    const s0 = a.one[k] - .02, s1 = a.oneW[k] + .02, u1 = sineIO(span(t, s0, s1)), u0 = sineIO(span(t, s0 + .14, s1 + .14));
    if (u1 <= 0 || u0 >= 1) continue;
    const A = [Q7.x - 18, Q7.y + k * Q7.lh - 18], Bp = F.lookPt(cx, cy, z, ...plaqueEnd(k)), M = [(A[0] + Bp[0]) / 2, Math.min(A[1], Bp[1]) - 70], pts = [];
    for (let i = 0; i <= 20; i++) { const q = i / 20; pts.push([(1 - q) ** 2 * A[0] + 2 * (1 - q) * q * M[0] + q * q * Bp[0], (1 - q) ** 2 * A[1] + 2 * (1 - q) * q * M[1] + q * q * Bp[1]]); }
    F.goldSpan(ctx, pts, u0, u1, { w: 2.4, spark: true });
  }
  // the § card: §9 → refills with §110 → grows with the second §110 line
  drawCard(ctx, t, a, T, o);
}
function drawCard(ctx, t, a, T, o) {
  const fu = span(t, a.rebuilt + .05, a.rebuilt + .7); if (fu <= 0) return;
  const D = cardDims(), co = expoIn(clamp(o.cardOut ?? 0)); if (co >= 1) return;
  const h = lerp(lerp(D.h9, D.hA, sineIO(span(t, a.these - .1, a.these + .4))), D.hAB, sineIO(span(t, a.andOut - .1, a.andOut + .4)));
  ctx.save(); ctx.translate(0, -co * (CARD.y + D.hAB + 60));
  F.paperCard(ctx, t, CARD.x, CARD.y, CARD.w, h, { u: fu, rot: -.004 });
  const k9 = span(t, a.these - .25, a.these + .1), k110 = span(t, a.these + .1, a.these + .5);
  const head = (s, u) => { if (u > 0) F.maskLine(ctx, [[s, 0]], CARD.x + 34, CARD.y + 50, 22, F.rise(u), { serif: false, weight: 600, col: F.PAPER.faint, glow: false }); };
  head('MAGNIFICA HUMANITAS · §9', span(fu, .2, .8) * (1 - k9)); head('MAGNIFICA HUMANITAS · §110', k110);
  const base = { x: CARD.x, y: CARD.y, w: CARD.w, size: CARD.size, noCard: true };
  if (k9 < 1) B.qcard(ctx, t, T, { ...base, text: Q9, head: ' ', u: fu, out: k9, litAt: (k, wd) => (nz(wd) === 'rebuilding' ? a.rebuilt + .2 : nz(wd) === 'jerusalem' ? a.whole + .1 : null) });
  const uA = span(t, a.these + .05, a.these + .75);
  if (uA > 0) B.qcard(ctx, t, T, { ...base, text: Q110a, head: ' ', u: uA, litAt: (k, wd) => (nz(wd) === 'armed' ? a.race : nz(wd) === 'competition' ? a.dom : null) });
  const uB = span(t, a.andOut, a.andOut + .7);
  if (uB > 0) B.qcard(ctx, t, T, { ...base, y: D.yB, text: Q110b, u: uB, litAt: (k, wd) => (nz(wd) === 'monopolistic' ? a.few : nz(wd) === 'control' ? a.few + .15 : null) });
  ctx.restore();
}

export default async (T, R) => {
  const a = { start: R.a, end: R.b, ...anchorsBabel(T, R.a - .3) };
  return [{ t: R.a, draw: (ctx, t) => drawBabel(ctx, t, a, T), print: PRINT }];
};
