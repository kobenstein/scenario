// Film 23 · B3 · c09–c11 (411.13 → 552.38): the dinner at the light wall, ONE plan sequence for all three chunks.
// sc09/sc10/sc11 each return one entry that calls the same draw(ctx, t) built here, so the chunk seams c09|c10 and c10|c11 are
// identical frames by construction. The group seams: plateWall (B2 → B3, 'And today you say') and plateNotebook (B3 → Lead, 'Ten-thirty').
//
// WALL PX: every explainer is light on the kitchen's light wall, authored in "wall px" = the screen px of K.CAM_WALL (the light area spans
// x 453–1467, y 60–840; 1 wall px = 1/1.95 world unit on the plane ZB). onWall() maps them onto the wall inside kitchen.wallFn, so the
// graphics stay on the wall while the camera travels. Card zone rule (MOTION §9): while an evidence card is open the screen zone
// x 60–820, y 40–430 (pairs: down to ≈ 730) stays calm: the graphics live in the wall's right part then (x > 840 wall px).
//
// Shots (docs/shots.md): 9.01 the agent and the two bars · 9.02 ★ helpers' threads cut and re-tied · 9.03 three pairs · K3 · 9.05 the
// keys, one sentence, the box · 10.01 ★ shop window → library · 10.02 the flow · 10.03 two roads · 10.04 two-shot · 10.05 the exam bars,
// the ladder · K4 · 11.01 the school · 11.02 two-shot · 11.03 three symbols · 11.04 ★ millions · 11.05 the notebook · 11.06 the push.
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
import { oldScreen } from './f23_hud.mjs';
import { WALL_STATE, plateNotebook, NOTEBOOK_STATE, CAM_NOTEBOOK, NOTEBOOK_WORLD, NOTEBOOK_PLATE, NOTEBOOK_INK } from './f23_seams.mjs';
import { dinnerPeople, armAt, valAt, KID_REST, YOU_REST } from './f23_b2_dinner.mjs';
const { W, H, P, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rgba, mixHex, lin, rad, halo, camAt, camDrift, prng } = E;
const { COOL, WARM, ZB, LIGHTWALL: LW, KITCHEN } = K;
const KY = KITCHEN.floor, TBL = KITCHEN.table;
const S0 = 1.95;

// ================================================================================================ wall px ↔ world ↔ screen
export const WPX = (px) => LW.cx + (px - 960) / S0, WPY = (py) => LW.y + (py - 60) / S0;
export const lookPx = (px, py, s, sx = 960, sy = 450) => K.look(WPX(px), WPY(py), ZB, s, sx, sy);
export const fromWall = (c, px, py) => K.wp(c, WPX(px), WPY(py), ZB);
export const toWall = (c, sx, sy) => { const s = c.f / (ZB - c.z), X = c.x + (sx - W / 2) / s, Y = c.y + (sy - H / 2) / s; return [960 + (X - LW.cx) * S0, 60 + (Y - LW.y) * S0]; };
function onWall(ctx, fn) { ctx.save(); ctx.translate(LW.cx - 960 / S0, LW.y - 60 / S0); ctx.scale(1 / S0, 1 / S0); fn(ctx); ctx.restore(); }
const WALL_BOX = [453, 60, 1014, 780];
const clipWall = (ctx) => { ctx.beginPath(); ctx.rect(...WALL_BOX); ctx.clip(); };

// ================================================================================================ primitives (wall px)
const GOLD = { glow: P.halo0, core: P.core1 }, COLD = { glow: COOL.edge, core: COOL.core };
// a polyline of light, drawn from u0 to u1 of its length
function lightPath(ctx, pts, u1, o = {}) {
  const u0 = o.u0 ?? 0; if (u1 <= u0 + 1e-4 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], a0 = L * u0, a1 = L * u1, at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = (d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], clamp(f)), lerp(pts[i - 1][1], pts[i][1], clamp(f))]; };
  const sub = [at(a0)]; for (let i = 1; i < pts.length - 1; i++) if (len[i] > a0 && len[i] < a1) sub.push(pts[i]); sub.push(at(a1));
  const C = o.cool ? COLD : GOLD, w = o.w ?? 3, a = o.a ?? 1;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.strokeStyle = rgba(C.glow, .28 * a); ctx.lineWidth = w * 4; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
  ctx.strokeStyle = rgba(o.col || C.core, a); ctx.lineWidth = w; ctx.stroke();
  ctx.restore();
  const head = sub[sub.length - 1];
  if (o.spark && u1 < 1) halo(ctx, head[0], head[1], w * 7, .8 * a, o.cool ? COOL.mid : P.halo0, o.cool ? COOL.core : P.core0);
  return head;
}
const bez = (a, b, lift, n = 28) => K.arcPts(a, b, lift, n);
const sag = (a, b, s, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const v = i / n; o.push([lerp(a[0], b[0], v), lerp(a[1], b[1], v) + Math.sin(Math.PI * v) * s]); } return o; };
// reveal fn as if rising out of the line y = yb (u 0..1); sinking = u going back to 0
function rise(ctx, yb, u, hgt, fn) {
  if (u <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(-5000, -5000, 12000, yb + 5000 + 1); ctx.clip(); ctx.translate(0, (1 - u) * hgt); fn(ctx); ctx.restore();
}
// a bar of light standing on yb (h > 0 up, h < 0 down)
function bar(ctx, x, yb, w, h, o = {}) {
  if (Math.abs(h) < .5) return;
  const cool = o.cool, y0 = h > 0 ? yb - h : yb, hh = Math.abs(h), a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rad(ctx, x, y0 + hh / 2, Math.max(w, hh) * .9, [[0, rgba(cool ? COOL.edge : P.halo0, .22)], [1, rgba(cool ? COOL.deep : P.halo0, 0)]]);
  ctx.fillRect(x - Math.max(w, hh), y0 - w, Math.max(w, hh) * 2, hh + 2 * w);
  ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + hh, h > 0 ? [[0, cool ? COOL.core : P.core0], [.25, cool ? COOL.mid : P.core1], [1, cool ? COOL.edge : P.halo1]] : [[0, cool ? COOL.edge : P.halo1], [.75, cool ? COOL.mid : P.core1], [1, cool ? COOL.core : P.core0]]);
  ctx.beginPath(); ctx.roundRect(x - w / 2, y0, w, hh, Math.min(6, w / 4)); ctx.fill();
  ctx.restore();
}
// the agent's light (kit agentLight + dull 0..1: cheating → a dull grey that flickers)
function agent(ctx, x, y, r, t, o = {}) {
  const wm = o.warm ?? 1, dl = clamp(o.dull ?? 0), a = (o.a ?? 1) * (1 - .35 * dl * (.5 + .5 * Math.sin(t * 23) * Math.sin(t * 7.3)));
  if (r <= .3) return;
  const bob = Math.sin(t * 1.6) * r * .08; y += bob;
  const GR = '#6d7388', c1 = mixHex(mixHex(COOL.mid, P.core1, wm), GR, dl), c2 = mixHex(mixHex(COOL.edge, P.halo0, wm), mixHex(GR, P.night1, .4), dl), core = mixHex(P.core0, '#b9bccb', dl);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rad(ctx, x, y, r * 3.5, [[0, rgba(mixHex(mixHex(COOL.mid, P.halo0, wm), GR, dl), .4 * (1 - .6 * dl))], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - r * 3.5, y - r * 3.5, r * 7, r * 7);
  ctx.beginPath(); ctx.moveTo(x, y - r * 1.35); ctx.bezierCurveTo(x + r * .9, y - r * .5, x + r, y + r * .4, x, y + r); ctx.bezierCurveTo(x - r, y + r * .4, x - r * .9, y - r * .5, x, y - r * 1.35); ctx.closePath();
  ctx.fillStyle = rad(ctx, x - r * .2, y - r * .1, r * 1.3, [[0, core], [.5, c1], [1, c2]]); ctx.fill();
  ctx.restore();
  return [x, y];
}
// a ring of keys hanging at (x, y) (top of the ring), s = ring radius
function keyRing(ctx, x, y, s, t, a = 1, sway = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = P.halo0; ctx.lineWidth = Math.max(1.2, s * .16);
  const ky = y + s; ctx.beginPath(); ctx.arc(x, ky, s, 0, 6.29); ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const an = Math.PI * (.3 + i * .2) + Math.sin(t * 1.2 + i) * .06 + sway, ex = x + Math.cos(an) * s, ey = ky + Math.sin(an) * s, L = s * 1.7;
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.cos(an) * L, ey + Math.sin(an) * L); ctx.stroke();
    ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(ex + Math.cos(an) * L, ey + Math.sin(an) * L, s * .28, 0, 6.29); ctx.fill();
  }
  ctx.restore();
}
// a coin (cool = the makers' money, gold = what comes back), spinning on its axis
function coin(ctx, x, y, r, t, o = {}) {
  const g = clamp(o.gold ?? 0), sp = Math.abs(Math.cos(t * 5 + (o.ph ?? 0))) * .75 + .25, a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, r * 2.4, .5, mixHex(COOL.mid, P.halo0, g), mixHex(COOL.core, P.core0, g));
  ctx.fillStyle = lin(ctx, x - r, y, x + r, y, [[0, mixHex(COOL.edge, P.halo1, g)], [.5, mixHex(COOL.core, P.core0, g)], [1, mixHex(COOL.mid, P.halo0, g)]]);
  ctx.beginPath(); ctx.ellipse(x, y, r * sp, r, 0, 0, 6.29); ctx.fill(); ctx.restore();
}
// a maker's tower (the skyline's night-shift tower in small): a slab with cool windows; glow 0..1
function towerGlyph(ctx, x, yb, w, h, t, glow = 1) {
  ctx.fillStyle = mixHex(P.ind1, COOL.deep, .35); ctx.fillRect(x - w / 2, yb - h, w, h);
  ctx.fillStyle = rgba(COOL.edge, .9); ctx.fillRect(x - w / 2, yb - h, w, 3);
  ctx.fillRect(x - 1.5, yb - h - h * .12, 3, h * .12);
  const cols = 3, rows = Math.max(3, Math.floor(h / 26)), cw = w / (cols + 1);
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const fl = .75 + .25 * Math.sin(t * 1.3 + r * 1.7 + k * 2.9);
    ctx.fillStyle = rgba(mixHex(COOL.mid, COOL.core, .4), glow * fl * (((r * 3 + k * 5) % 7) ? 1 : .35)); ctx.fillRect(x - w / 2 + cw * (k + .65), yb - h + 14 + r * 26, cw * .7, 12);
  }
  if (glow > 0) halo(ctx, x, yb - h * .6, w * 1.4, .25 * glow, COOL.mid, COOL.core);
}
// the old rule: a seal of light (a ring with the scales of justice)
function seal(ctx, x, y, r, u, t) {
  if (u <= 0) return; const k = expoOut(u), rr = r * (.6 + .4 * k);
  ctx.save(); halo(ctx, x, y, rr * 2.2, .55 * k);
  ctx.strokeStyle = rgba(P.core1, k); ctx.lineWidth = rr * .07; ctx.beginPath(); ctx.arc(x, y, rr, -Math.PI / 2, -Math.PI / 2 + 6.283 * k); ctx.stroke();
  ctx.lineWidth = rr * .03; ctx.strokeStyle = rgba(P.halo0, .8 * k); ctx.beginPath(); ctx.arc(x, y, rr * .84, 0, 6.29); ctx.stroke();
  const sw = Math.sin(t * .9) * .05, sa = clamp((u - .35) / .65);
  if (sa > 0) {   // the scales
    ctx.globalAlpha = sa; ctx.strokeStyle = P.core1; ctx.fillStyle = P.core1; ctx.lineWidth = rr * .05; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y - rr * .5); ctx.lineTo(x, y + rr * .42); ctx.moveTo(x - rr * .3, y + rr * .42); ctx.lineTo(x + rr * .3, y + rr * .42); ctx.stroke();
    ctx.save(); ctx.translate(x, y - rr * .38); ctx.rotate(sw);
    ctx.beginPath(); ctx.moveTo(-rr * .5, 0); ctx.lineTo(rr * .5, 0); ctx.stroke();
    for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(d * rr * .5, 0); ctx.lineTo(d * rr * .5 - rr * .14, rr * .3); ctx.moveTo(d * rr * .5, 0); ctx.lineTo(d * rr * .5 + rr * .14, rr * .3); ctx.stroke(); ctx.beginPath(); ctx.ellipse(d * rr * .5, rr * .32, rr * .17, rr * .06, 0, 0, Math.PI); ctx.fill(); }
    ctx.restore();
  }
  ctx.restore();
}
// a small person of light on the wall: a warm disc behind an indigo silhouette (only you in yellow)
function wallPerson(ctx, x, yb, h, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rad(ctx, x, yb - h * .5, h * .75, [[0, rgba(o.coolDisc ? COOL.edge : P.halo0, .42)], [.6, rgba(o.coolDisc ? COOL.deep : P.shade0, .16)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(x - h, yb - h * 1.3, 2 * h, 1.4 * h);
  ctx.fillStyle = rgba(P.halo0, .55); ctx.fillRect(x - h * .32, yb - 1, h * .64, 2);
  const q = { seed: o.seed ?? 7, dir: o.dir ?? 1, pose: o.pose, armR: o.armR, armL: o.armL, look: o.look, lean: o.lean, long: o.long, rim: P.halo0 };
  const hands = o.you ? K.you(ctx, x, yb, h, t, q) : o.kid ? K.kid(ctx, x, yb, h, t, q) : K.other(ctx, x, yb, h, t, q);
  if (o.case) { const hd = hands.L || hands.R; ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.fillRect(hd[0] - h * .09, hd[1], h * .18, h * .13); ctx.fillStyle = rgba(P.halo0, .8); ctx.fillRect(hd[0] - h * .09, hd[1], h * .18, 2); }
  if (o.steth) { ctx.strokeStyle = rgba(P.core1, .9); ctx.lineWidth = Math.max(1.2, h * .018); ctx.beginPath(); ctx.arc(x + (o.dir ?? 1) * h * .01, yb - h * .69, h * .07, .2, Math.PI - .2); ctx.stroke(); ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(x + (o.dir ?? 1) * h * .06, yb - h * .6, h * .022, 0, 6.29); ctx.fill(); }
  ctx.restore();
  return hands;
}
// a little house with a warm lamp in its window (the testers' house; the town)
function house(ctx, x, yb, w, t, o = {}) {
  const h = w * .72, lamp = o.lamp ?? 1, win = o.win ?? lamp;
  ctx.fillStyle = mixHex(P.ind1, P.blue0, .35); ctx.fillRect(x - w / 2, yb - h, w, h);
  ctx.beginPath(); ctx.moveTo(x - w * .6, yb - h); ctx.lineTo(x, yb - h - w * .42); ctx.lineTo(x + w * .6, yb - h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.halo0, .8); ctx.fillRect(x - w * .6, yb - h - 1.5, w * 1.2, 3);
  const ww = w * .34, wh = h * .42, wx = x - ww / 2, wy = yb - h * .72;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(wx, wy, ww, wh);
  if (win > 0) { ctx.fillStyle = rgba(mixHex(WARM.mid, P.core0, .4 * win), win); ctx.fillRect(wx, wy, ww, wh); halo(ctx, x, wy + wh / 2, w * .7, .5 * win); }
  return [x, wy + wh / 2];
}
// a window frame of light (the three ordinary days, the school's windows); fn draws its inside (clipped)
function frameWin(ctx, x, y, w, h, u, fn) {
  if (u <= 0) return; const k = expoOut(u), hh = h * k;
  ctx.save(); ctx.fillStyle = rgba(P.night1, .9); ctx.fillRect(x - w / 2, y - hh / 2, w, hh);
  ctx.beginPath(); ctx.rect(x - w / 2, y - hh / 2, w, hh); ctx.clip(); if (fn) fn(ctx); ctx.restore();
  ctx.save(); ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = 3; ctx.strokeRect(x - w / 2, y - hh / 2, w, hh);
  ctx.strokeStyle = rgba(P.halo0, .25); ctx.lineWidth = 12; ctx.strokeRect(x - w / 2, y - hh / 2, w, hh); ctx.restore();
}
// the kit's notebook with a float moon 0..1 (moon 1 == K.notebook(…, { moon: true }) exactly), + flip (0 lying flat → 1 propped up)
function notebookF(ctx, x, y, w, t, m) {
  const h = w * .36, k = mixHex(P.halo2, COOL.mid, m);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x, y + h * .55, w * .58, h * .14, 0, 0, 6.29); ctx.fill();
  for (const d of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(x, y - h * .48); ctx.quadraticCurveTo(x + d * w * .25, y - h * .56, x + d * w * .5, y - h * .5); ctx.lineTo(x + d * w * .5, y + h * .48); ctx.quadraticCurveTo(x + d * w * .25, y + h * .42, x, y + h * .5); ctx.closePath();
    const pg = mixHex(P.cream, K.NOTEBOOK_MOON_PAGE, m); ctx.fillStyle = lin(ctx, x, 0, x + d * w * .5, 0, [[0, mixHex(pg, P.night1, .4)], [.15, mixHex(pg, k, .15)], [1, pg]]); ctx.fill();
    ctx.strokeStyle = rgba(P.blue1, .35); ctx.lineWidth = w * .0016; for (let i = 1; i < 8; i++) { const yy = y - h * .45 + i * h * .115; ctx.beginPath(); ctx.moveTo(x + d * w * .04, yy); ctx.lineTo(x + d * w * .47, yy); ctx.stroke(); }
  }
}
function notebookItemF(t, o) {
  const N = NOTEBOOK_WORLD, k = N.w / NOTEBOOK_PLATE.w, fl = o.flip ?? 1, dy = o.dy ?? 0;
  return [N.Z, (cx) => {
    const h = N.w * .36, yb = N.Y + h * .55 + dy;
    cx.save(); cx.translate(0, yb); cx.scale(1, Math.max(.03, fl)); cx.translate(0, -yb + dy);
    notebookF(cx, N.X, N.Y, N.w, t, o.moon);
    if (o.l1 > 0) K.handwrite(cx, NOTEBOOK_PLATE.line1, N.X + 90 * k, N.Y - 150 * k, 64 * k, o.l1, { col: NOTEBOOK_INK, glow: false });
    if (o.l2 > 0) o.nib = K.handwrite(cx, NOTEBOOK_PLATE.line2, N.X + 90 * k, N.Y + 20 * k, 76 * k, o.l2, { col: P.halo0 });
    cx.restore();
  }];
}

// ================================================================================================ the map of millions (11.04), built once
const MAP = (() => {
  const r = prng(2337), pts = [];
  const city = (cx, cy, n, R) => { for (let i = 0; i < n; i++) { const a = r() * 6.283, d = R * Math.pow(r(), .62); pts.push([cx + Math.cos(a) * d * 1.3, cy + Math.sin(a) * d * .8, .5 + r() * .5]); } };
  city(0, 0, 700, 2600);                                     // our city (the three windows sit in its middle)
  for (let i = 0; i < 46; i++) { const a = r() * 6.283, d = 5000 + Math.pow(r(), .7) * 26000; city(Math.cos(a) * d * 1.35, Math.sin(a) * d * .85, 40 + Math.floor(r() * 110), 500 + r() * 1300); }
  for (let i = 0; i < 900; i++) pts.push([(r() - .5) * 70000, (r() - .5) * 46000, .3 + r() * .3]);   // the countryside
  return pts.filter((p) => Math.abs(p[0]) > 420 || Math.abs(p[1]) > 140);   // keep the three windows' strip clear
})();

// ================================================================================================ the master timeline
export function buildB3(T) {
  const g = (p, after) => T.G(p, 0, after), ge = (p, after) => T.GE(p, 0, after);
  const T0 = g('And today you say', 400), TN = g('Ten-thirty', T0);
  const t = {};   // anchors
  t.cheaper = g('cheaper insurance', T0); t.makers = g('makers lose money', T0); t.why = g('Why would it do that', T0);
  t.because = g('Because back then', T0); t.helpers = g('digital helpers', T0); t.whoever = g('whoever built them', T0);
  t.rule = g('very old rule', T0); t.act = g('act for someone', T0); t.owe = g('owe them loyalty', T0);
  t.doctors = g('Doctors', T0); t.lawyers = g('Lawyers', T0); t.politicians = g('first time politicians', T0);
  const K3 = T.clip('K3'), K4 = T.clip('K4');
  t.cheats = g('cheats', K3.end); t.keys = g('loses its keys', K3.end); t.sentence = g('One sentence', K3.end); t.ground = g('grounding it', K3.end); t.exactly = g('Exactly like', K3.end);
  t.earbuds = g("Grandpa's earbuds", T0); t.story = g('Same story', t.earbuds); t.luxury = g('luxury', t.earbuds); t.towns = g('towns and countries', t.earbuds); t.libraries = g('built libraries', t.earbuds);
  t.paid = g('Who paid', t.earbuds); t.earned = g('machines earned', t.paid); t.allofus = g('all of us', t.earned);
  t.easy = g('Was it easy', t.paid); t.close = g('It was close', t.easy); t.longer = g('years longer', t.easy);
  t.tell = g('just tell me things', t.easy); t.noticed = g('noticed something', t.tell); t.kids = g('Kids who got', t.noticed);
  t.better = g('better with it', t.kids); t.worse = g('worse without it', t.kids); t.ask = g('built to ask', t.kids); t.yours = g('Like yours', t.kids); t.dad = g('dad asking', t.kids);
  t.practiced = g('practiced', K4.end); t.leaning = g('without leaning on it', K4.end); t.teachers = g('Teachers first', K4.end); t.rest = g('rest of us', K4.end); t.everybody = g('Everybody did', K4.end);
  t.thinks = g('thinks about that', K4.end); t.whatdid = g('what did you do', t.thinks); t.moment = g('takes you a moment', t.thinks);
  t.asked = g('Asked questions', t.moment); t.who = g('Who checked this', t.asked); t.whose = g('Whose side', t.asked); t.does = g('Does everyone get it', t.asked);
  t.work = g('At work', t.does); t.friends = g('With friends', t.does); t.vote = g('every vote', t.does); t.millions = g('Millions', t.does);
  t.writes = g('writes it down', t.millions); t.biggest = g('biggest letters', t.writes); t.bpka = g('Because people kept asking', t.writes);
  t.w2 = g('people', t.bpka); t.w3 = g('kept', t.bpka); t.w4 = g('asking', t.bpka + .3); t.w4e = ge('asking', t.bpka + .3);
  t.one = g('One person', t.bpka); t.know = g("doesn't know", t.one);
  const HOLD_END = TN - .5;

  // ---------------------------------------------------------------------------------------------- cameras
  const WALL = K.CAM_WALL, WALL_IN = lookPx(960, 450, 2.03, 960, 448);
  const TWO = K.look(LW.cx + 40, LW.y + 200, ZB, 1.42, 960, 400), TWO_IN = K.look(LW.cx + 36, LW.y + 205, ZB, 1.5, 960, 402);
  const WALL_R = lookPx(1150, 450, 1.95, 1250, 452), WALL_R2 = lookPx(1150, 450, 2.02, 1252, 455);
  const CLOSE = K.look(-1278, KY - 95, ZB - 170, 3.6, 960, 560), CLOSE_IN = K.look(-1276, KY - 98, ZB - 170, 3.85, 960, 565);   // both of you whole, with air at the frame edges
  const MAPC = lookPx(960, 470, 2.45, 960, 520);
  const NB = NOTEBOOK_WORLD, NB_MED = K.look(NB.X + 12, NB.Y - 1.6, NB.Z, 27, 960, 520), NB_MED2 = K.look(NB.X + 11.5, NB.Y - 1.2, NB.Z, 29, 960, 525);
  const SCREEN = K.CAM_SCREEN;
  const WALL_IN2 = lookPx(960, 470, 2.1, 960, 452), WALL_IN3 = lookPx(980, 480, 2.0, 965, 455);
  const KA = [   // ref ZB (the wall); the pair at the table stays in the frame's lower edge at the wall framings
    [T0 + .5, WALL], [t.why + 1.2, WALL_IN, 'l'],
    [t.owe + .4, WALL_IN2, 'l'], [t.politicians + .6, WALL_IN3, 'l'],
    [K3.start, SCREEN],                                      // CLIP IN push (≈ 1.8 s), lands as the slot starts
    [K3.end + .1, SCREEN], [t.keys + .4, WALL],              // CLIP OUT: pull back to the wall and the table (the keys fly to your hand)
    [t.exactly + .2, WALL, 'l'], [t.earbuds + .1, WALL_IN], // the pause before 'earbuds': a 3 s push onto the box (an 8 s trapIO read as a still)
    [t.story + 1.2, WALL_R], // 10.01: into the shop window
    [t.earned - .3, WALL_R2, 'l'], [t.allofus + .6, WALL, 'l'],
    [t.longer + 1.6, WALL_IN, 'l'], [t.tell - .2, CLOSE],    // 10.03 → 10.04: back to the table
    [t.noticed + .2, CLOSE_IN, 'l'], [t.kids + 1.6, WALL],   // the pilot light rises to the wall
    [t.dad + 1.2, WALL_IN, 'l'], [K4.start, SCREEN],
    [K4.end + .1, SCREEN], [t.practiced + 1.3, WALL_R],      // CLIP OUT → the school
    [t.everybody + .4, WALL_R2, 'l'], [t.thinks + 1.3, CLOSE],
    [t.moment, CLOSE, 'l'], [t.asked - 1.1, CLOSE_IN, 'l'], [t.asked + 1.3, WALL],
    [t.work - .3, WALL_IN, 'l'], [t.vote, MAPC],
    [t.millions + 1.6, MAPC],
  ];
  const KB = [   // ref = the notebook's plane
    [t.millions + 1.6, MAPC], [t.biggest + 1.1, NB_MED], [t.know, NB_MED2, 'l'], [HOLD_END, CAM_NOTEBOOK],
  ];
  // the dolly from the map down to the notebook covers a 10x scale change: z runs in log space (camAt), and x / y follow the
  // camera's distance (a straight 3D line), so the sideways screen speed does not explode in the last metres (it did: 11.7 diff)
  const dolly = (tt) => {
    const A = KB[0][1], B = KB[1][1], c = camAt(tt, KB, NB.Z), da = NB.Z - A.z, db = NB.Z - B.z, w = clamp((da - (NB.Z - c.z)) / (da - db));
    return { ...c, x: lerp(A.x, B.x, w), y: lerp(A.y, B.y, w) };
  };

  // drift: none on the plates, none during the clips, none at the end (dz 44 at the notebook)
  const driftAmt = (tt) => {
    let a = .5 * smooth(span(tt, T0 + .5, T0 + 2));
    for (const k of [K3, K4]) a *= 1 - smooth(span(tt, k.start - 1.8, k.start - .2)) * (1 - smooth(span(tt, k.end + .2, k.end + 1.8)));
    a *= 1 - smooth(span(tt, t.know, HOLD_END - .3));
    return a;
  };
  const camOf = (tt) => { const base = tt < KB[0][0] ? camAt(tt, KA, ZB) : tt < KB[1][0] ? dolly(tt) : camAt(tt, KB, NB.Z); const a = driftAmt(tt); return a > 0 ? camDrift(base, tt, a, 5) : base; };

  // ---------------------------------------------------------------------------------------------- the people's poses
  const KID_POINT = [2.35, 2.55], KID_CHIN_R = [.45, 2.75], KID_CHIN_L = [.35, 2.7];
  const kidPose = (tt) => {
    const o = {};
    o.armR = armAt(tt, [[0, KID_REST.armR], [t.why - .15, KID_REST.armR], [t.why + .3, KID_POINT], [t.because - .1, KID_POINT], [t.because + .5, KID_REST.armR],
      [t.tell - .4, KID_REST.armR], [t.tell + .3, KID_CHIN_R], [t.noticed + .6, KID_CHIN_R], [t.noticed + 1.3, KID_REST.armR],
      [t.thinks - .3, KID_REST.armR], [t.thinks + .4, KID_CHIN_R], [t.moment + 1.4, KID_CHIN_R], [t.moment + 2.1, KID_REST.armR]]);
    o.armL = armAt(tt, [[0, KID_REST.armL], [t.tell - .3, KID_REST.armL], [t.tell + .45, KID_CHIN_L], [t.noticed + .7, KID_CHIN_L], [t.noticed + 1.4, KID_REST.armL],
      [t.thinks - .2, KID_REST.armL], [t.thinks + .55, KID_CHIN_L], [t.moment + 1.5, KID_CHIN_L], [t.moment + 2.2, KID_REST.armL]]);
    o.rise = valAt(tt, [[0, 0], [t.why - .2, 0], [t.why + .3, .85], [t.because - .1, .85], [t.because + .6, 0]]);
    const laugh = Math.sin(Math.PI * span(tt, t.ground + .5, t.ground + 1.7));
    o.lean = KID_REST.lean + .07 * laugh * Math.abs(Math.sin((tt - t.ground) * 17));
    o.look = valAt(tt, [[0, KID_REST.look], [t.why - .2, KID_REST.look], [t.why + .3, .7], [t.because, .7], [t.because + .7, KID_REST.look],
      [t.ground + .4, KID_REST.look], [t.ground + .8, .35], [t.ground + 1.8, KID_REST.look],
      [t.thinks, KID_REST.look], [t.thinks + 1.2, .45], [t.whatdid - .4, .3], [t.whatdid + .2, .2], [t.moment + 2, .2], [t.moment + 2.6, KID_REST.look]]);
    return o;
  };
  const YOU_LIFT = [2.15, 2.45], YOU_FINGER = [1.75, 2.85], YOU_FLAT_R = [.85, 1.55], YOU_FLAT_L = [.75, 1.5];
  const youPose = (tt) => {
    const o = {};
    o.armR = armAt(tt, [[0, YOU_REST.armR], [t.politicians - .25, YOU_REST.armR], [t.politicians + .3, YOU_LIFT], [K3.start - .4, YOU_LIFT], [K3.start + .6, YOU_REST.armR],
      [t.sentence - .2, YOU_REST.armR], [t.sentence + .3, YOU_FINGER], [t.ground - .2, YOU_FINGER], [t.ground + .4, YOU_REST.armR],
      [t.moment - .1, YOU_REST.armR], [t.moment + .5, YOU_FLAT_R], [t.asked - 1.3, YOU_FLAT_R], [t.asked - .5, YOU_REST.armR]]);
    o.armL = armAt(tt, [[0, YOU_REST.armL], [t.moment, YOU_REST.armL], [t.moment + .6, YOU_FLAT_L], [t.asked - 1.2, YOU_FLAT_L], [t.asked - .4, YOU_REST.armL]]);
    const nod = Math.sin(Math.PI * span(tt, t.exactly + .05, t.exactly + .75));
    o.look = valAt(tt, [[0, YOU_REST.look], [t.politicians - .3, YOU_REST.look], [t.politicians + .2, .6], [K3.start, .6], [K3.start + .8, YOU_REST.look],
      [t.moment - .1, YOU_REST.look], [t.moment + .6, 0], [t.asked - 1.3, 0], [t.asked - .6, .75], [t.asked + 1.5, .5], [t.asked + 3, YOU_REST.look]]) - .1 * nod;
    o.lean = valAt(tt, [[0, YOU_REST.lean], [t.noticed - .2, YOU_REST.lean], [t.noticed + .4, .24], [t.kids + .4, .24], [t.kids + 1.2, YOU_REST.lean],
      [t.moment - .1, YOU_REST.lean], [t.moment + .7, .2], [t.asked - 1.3, .2], [t.asked - .5, YOU_REST.lean]]) + .07 * nod;
    return o;
  };

  // ---------------------------------------------------------------------------------------------- light state (→ NOTEBOOK_STATE at the end)
  const endU = (tt) => sineIO(span(tt, t.one + .2, HOLD_END - .2));
  const stateAt = (tt) => {
    // the evening goes on: from the seam plate (WALL_STATE) the pendant, the wall glow and the hall lamp sink slowly over 14 s
    // (keeps the mean luma near 55 instead of 64), then the last seconds lerp to NOTEBOOK_STATE.
    const u = endU(tt), dim = sineIO(span(tt, T0 + 2, T0 + 16)), KS = NOTEBOOK_STATE.you.kitchen, WS = WALL_STATE.you.kitchen;
    const lamp0 = lerp(WS.lamp, .68, dim), wall0 = lerp(WS.wall, .27, dim), hall0 = lerp(WALL_STATE.you.hallLamp, .75, dim);
    return { hour: lerp(WALL_STATE.hour, NOTEBOOK_STATE.hour, u), hallLamp: lerp(hall0, NOTEBOOK_STATE.you.hallLamp, u), lamp: lerp(lamp0, KS.lamp, u), wall: lerp(wall0, KS.wall, u) };
  };

  // ============================================================================================== WALL GRAPHICS (wall px)
  const A_TOP = [1150, 290];        // the agent's place in 9.01
  const ROW_Y = 530, ROW = [700, 820, 940, 1060, 1180, 1300, 1420], BASE = 790;
  const TOWERS = [[1120, 330], [1270, 330], [1420, 330]];
  const SEAL = [960, 300];
  const SC = [960, 450];            // the old screen's centre (its point after the collapse)
  // the agent's position over 9.01 → 9.02
  const agentPos = (tt) => {
    const d = expoOut(span(tt, T0 + .6, T0 + 2.6)), y0 = lerp(-60, A_TOP[1], sineIO(d));
    let p = [A_TOP[0], y0];
    p = [lerp(p[0], 1150, 0), lerp(p[1], 445, quartIO(span(tt, t.cheaper + .5, t.cheaper + 1.5)))];   // settles over the gold bar
    const m = quartIO(span(tt, t.because + .1, t.because + 1.2)); p = [lerp(p[0], ROW[3], m), lerp(p[1], ROW_Y, m)];   // into the row
    return p;
  };
  // 9.01 the two bars + the makers' tower; the coin that drops away
  function g901(ctx, tt) {
    const bl = 700, sink = expoIn(span(tt, t.because, t.because + .6)), up = 1 - sink;
    if (tt < t.cheaper || sink >= 1) return;
    const ap = agentPos(tt);
    const drop = expoOut(span(tt, t.cheaper, t.cheaper + .3)), sp = expoOut(span(tt, t.cheaper + .25, t.cheaper + .65));
    if (drop < 1) lightPath(ctx, [[ap[0], ap[1] + 30], [ap[0], bl]], drop, { w: 2.5, spark: true });
    rise(ctx, bl + 2, up, 420, (c) => {
      if (sp > 0) lightPath(c, [[1150 - 210 * sp, bl], [1150 + 260 * sp, bl]], 1, { w: 2.5, a: .9 });
      bar(c, 1010, bl, 64, 360 * expoOut(span(tt, t.cheaper + .55, t.cheaper + 1.25)), { cool: true });
      bar(c, 1150, bl, 64, 190 * expoOut(span(tt, t.cheaper + .63, t.cheaper + 1.33)));
      const tw = expoOut(span(tt, t.cheaper + .8, t.cheaper + 1.6));
      if (tw > 0) rise(c, bl, tw, 340, (cc) => towerGlyph(cc, 1340, bl, 66, 330, tt, .9));
    });
    // the coin: drops away on the makers' side and falls out of the wall's light (behind the table)
    const cf = span(tt, t.makers, t.makers + 1.0);
    if (cf > 0 && cf < 1) { const y = lerp(470, 1000, cf * cf), x = 1340 + 26 * cf; coin(ctx, x, y, 14, tt, { gold: 0 }); }
    if (tt > t.makers - .1 && tt < t.makers + .4) halo(ctx, 1340, 470, 40, Math.sin(Math.PI * span(tt, t.makers - .1, t.makers + .4)) * .6, COOL.mid, COOL.core);
  }
  // 9.02 ★ helpers, towers, the cut, the re-tie
  const pairX = (i, tt) => {   // 9.03: the outer pairs leave, the middle three spread out
    const s = quartIO(span(tt, t.doctors - .4, t.doctors + .5)); if (i === 2) return lerp(ROW[2], 740, s); if (i === 4) return lerp(ROW[4], 1380, s); return ROW[i];
  };
  function g902(ctx, tt) {
    if (tt < t.helpers - .1) return;
    const out = expoIn(span(tt, K3.start - 1.5, K3.start - .85));   // everything sinks while the old screen's line runs
    if (out >= 1) return;
    const cut = span(tt, t.act, t.act + .5), retie = span(tt, t.owe, t.owe + .9);
    const outer = expoIn(span(tt, t.doctors - .55, t.doctors + .05));   // the four outer pairs sink into the floor line
    // towers: rise where the cool threads converge; dim after the cut; sink before 'Doctors'
    const tw = expoOut(span(tt, t.whoever + .45, t.whoever + 1.2)) * (1 - expoIn(span(tt, t.doctors - .9, t.doctors - .3)));
    TOWERS.forEach(([x, yb], j) => { if (tw > 0) rise(ctx, yb, tw, 240, (c) => towerGlyph(c, x, yb, 54, 230, tt, lerp(1, .35, cut))); });
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 3000, BASE + 1); ctx.clip();
    for (let i = 0; i < 7; i++) {
      const d = Math.abs(i - 3), o0 = t.helpers + d * .07, sp = expoOut(span(tt, o0, o0 + .65));
      if (sp <= 0) continue;
      const isOuter = i !== 2 && i !== 3 && i !== 4, ex = isOuter ? outer : 0;
      const x = lerp(ROW[3], pairX(i, tt), sp), y = ROW_Y + ex * 260;
      // the cool thread up to its maker (drawn on 'whoever'), cut on 'act for someone': the loose end falls back into the helper
      const [tx, ty] = TOWERS[i % 3], th = expoOut(span(tt, t.whoever + d * .05, t.whoever + .7 + d * .05));
      if (th > 0 && cut < 1 && !ex) {
        const fall = expoIn(cut), end = [lerp(tx, x + (tx - x) * .15, fall), lerp(ty, y + 60, fall)];
        lightPath(ctx, sag([x, y - 18], end, 18 + 50 * fall), th * (1 - fall * .9), { cool: true, w: 2, a: .9 });
        if (tt > t.act + i * .04 && tt < t.act + .35 + i * .04) halo(ctx, tx, ty, 26, .9 * Math.sin(Math.PI * span(tt, t.act + i * .04, t.act + .35 + i * .04)), COOL.mid, COOL.core);
      }
      // the person it now works for: stands up from the floor line; the gold thread ties them together
      const pu = expoOut(span(tt, t.owe - .25 + d * .05, t.owe + .35 + d * .05));
      const role = i === 2 ? 'doctor' : i === 4 ? 'lawyer' : i === 3 ? 'you' : null;
      const px = x - 30;
      if (pu > 0) rise(ctx, BASE, pu * (1 - ex), 170, (c) => wallPerson(c, px, BASE, 150, tt, { seed: 20 + i, you: i === 3, dir: 1, armR: armAt(tt, [[0, [.2, .1]], [t.owe + .2 + d * .06, [.2, .1]], [t.owe + .8 + d * .06, [2.1, 2.5]]]) }));
      const ru = expoOut(span(tt, t.owe + d * .06, t.owe + .7 + d * .06)) * (1 - ex);
      const pay = (1 - ex);
      // in 9.03 the helper of the doctor's / the lawyer's pair turns into the doctor / the lawyer
      const role3 = role === 'doctor' ? span(tt, t.doctors, t.doctors + .7) : role === 'lawyer' ? span(tt, t.lawyers, t.lawyers + .7) : 0;
      const ay = lerp(y, BASE, quartIO(role3)), ax = lerp(x, x + (role === 'doctor' ? -64 : 64), quartIO(role3));
      if (role3 > 0) rise(ctx, BASE, expoOut(clamp(role3 * 1.6 - .5)) * pay, 180, (c) => wallPerson(c, x + (role === 'doctor' ? -70 : 70), BASE, 156, tt, { seed: 40 + i, long: role === 'doctor', steth: role === 'doctor', case: role === 'lawyer', dir: role === 'doctor' ? 1 : -1 }));
      if (ru > 0 && role3 < .55) lightPath(ctx, sag([ax, ay + 22], [px + 26, BASE - 128], 8), ru, { w: 2.4, a: pay * (1 - clamp(role3 * 2)) });
      if (role3 > .4) lightPath(ctx, sag([x + (role === 'doctor' ? -50 : 50), BASE - 80], [px + (role === 'doctor' ? 12 : -12), BASE - 80], 12), expoOut(span(tt, (role === 'doctor' ? t.doctors : t.lawyers) + .35, (role === 'doctor' ? t.doctors : t.lawyers) + .9)), { w: 2.4, a: pay });
      if (role3 < 1) agent(ctx, ax, ay, 24 * (1 - role3), tt, { warm: Math.max(clamp(1 - span(tt, t.helpers, t.helpers + .5)) * (i === 3 ? 1 : 0), ru), a: pay });
    }
    ctx.restore();
    // the seal of the very old rule (from the lamp's warm light)
    const su = span(tt, t.rule + .55, t.rule + 1.4);
    if (su > 0) { ctx.save(); ctx.globalAlpha *= 1 - out; seal(ctx, SEAL[0], SEAL[1], 62, su, tt); ctx.restore(); if (tt > t.owe && tt < t.owe + .6) halo(ctx, SEAL[0], SEAL[1], 140, .5 * Math.sin(Math.PI * span(tt, t.owe, t.owe + .6))); }
  }
  // 9.01's agent (+ its thread is drawn in screen space) until it becomes the centre helper
  function gAgent(ctx, tt) {
    if (tt < T0 + .55 || tt >= t.helpers) return;
    const p = agentPos(tt);
    agent(ctx, p[0], p[1], 30, tt, { warm: 1 - span(tt, t.because + .6, t.helpers) });
  }
  // the seal's spark from the lamp (screen space start → wall)
  // 9.05: the agent with the keys (from the K3 point), cheats, loses its keys, one sentence → the box; 10.01 the box → the shop window
  const BOX = [1000, 560];
  function g905(ctx, tt, c) {
    if (tt < K3.end + .4) return;
    const bloom = expoOut(span(tt, K3.end + .42, K3.end + .9));
    const toBox = quartIO(span(tt, t.ground, t.ground + .9));
    const x = lerp(SC[0], BOX[0], toBox), y = lerp(SC[1], BOX[1], toBox);
    const r = 32 * bloom * lerp(1, .62, toBox) * (1 - quartIO(span(tt, t.earbuds + .3, t.earbuds + 1.1)));
    const dull = Math.sin(Math.PI * span(tt, t.cheats, t.keys + .9)) * .95 + (tt > t.keys + .9 && tt < t.ground ? .0 : 0);
    if (r > .5) agent(ctx, x, y, r, tt, { warm: 1, dull: clamp(dull) });
    const kr = expoOut(span(tt, K3.end + .7, K3.end + 1.2));
    if (kr > 0 && tt < t.keys + .15) keyRing(ctx, x, y + r * 1.3, 16, tt, kr);
    // one sentence: a single line of light under it, which folds up into the little box round it
    const lu = expoOut(span(tt, t.sentence + .25, t.sentence + 1.0)), f = quartIO(span(tt, t.ground, t.ground + .9));
    if (lu > 0) {
      const N = 40, pts = [], side = lerp(0, 92, f);
      for (let k = 0; k <= N; k++) {
        const v = k / N, lx = lerp(760, 1160, v), ly = 640;
        const per = v * 4, sgm = Math.min(3, Math.floor(per)), w2 = per - sgm, hs = side / 2;   // perimeter of the box (from the bottom-left corner)
        const bx = [[-hs + w2 * 2 * hs, hs], [hs, hs - w2 * 2 * hs], [hs - w2 * 2 * hs, -hs], [-hs, -hs + w2 * 2 * hs]][sgm];
        pts.push([lerp(lx, BOX[0] + bx[0], f), lerp(ly, BOX[1] + bx[1], f)]);
      }
      const grow = expoOut(span(tt, t.earbuds + .1, t.earbuds + 1.1));   // 10.01: the box becomes the shop window (wider, taller, glass)
      const gw = lerp(1, 260 / 92, grow), gh = lerp(1, 210 / 92, grow), gy = lerp(0, -10, grow);
      const P2 = pts.map(([px, py]) => [BOX[0] + (px - BOX[0]) * (f >= 1 ? gw : 1), BOX[1] + gy + (py - BOX[1]) * (f >= 1 ? gh : 1)]);
      const openU = expoIn(span(tt, t.towns + .1, t.towns + .8));   // 10.01: the glass opens: it sinks into the floor line of the window
      if (openU < 1) {
        ctx.save(); if (openU > 0) { ctx.beginPath(); ctx.rect(0, 0, 3000, BOX[1] + 105 * gh / (210 / 92) * (210 / 92) - 0 + 1); ctx.clip(); ctx.translate(0, openU * 230); }
        if (grow > 0) { ctx.fillStyle = rgba(COOL.deep, .25 * grow); ctx.fillRect(BOX[0] - 130 * grow - 46 * (1 - grow), BOX[1] - 115 * grow, 260 * grow, 210 * grow); ctx.fillStyle = rgba(COOL.core, .12 * grow); ctx.beginPath(); ctx.moveTo(BOX[0] - 110, BOX[1] - 100); ctx.lineTo(BOX[0] - 70, BOX[1] - 100); ctx.lineTo(BOX[0] - 130, BOX[1] + 80); ctx.lineTo(BOX[0] - 130, BOX[1] + 20); ctx.closePath(); ctx.fill(); }
        lightPath(ctx, P2, lu, { w: lerp(3, 2.5, f), cool: grow > .5, col: grow > 0 ? mixHex(P.core1, COOL.core, grow) : undefined });
        ctx.restore();
      }
    }
  }
  // 10.01 earbuds in the window → the library → the town; 10.02 the tower, coins, the flow
  const LIB = [990, 790], TOWN = [[1200, 82], [1300, 70], [1400, 88]];
  function g1001(ctx, tt) {
    if (tt < t.earbuds) return;
    const gone = expoIn(span(tt, t.easy + .1, t.easy + .7));   // 10.03: the town and the library sink
    if (gone >= 1) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 3000, BASE + 1); ctx.clip(); ctx.translate(0, gone * 300);
    const eb = expoOut(span(tt, t.earbuds + .45, t.earbuds + 1.15)), dy = quartIO(span(tt, t.libraries - .1, t.libraries + .7));
    const ex = BOX[0], ey = lerp(BOX[1] + 30, LIB[1] - 70, dy);
    // the stand under the earbuds (the shop's), the tag
    if (eb > 0 && tt < t.towns + .8) { ctx.fillStyle = rgba(COOL.edge, .7 * eb * (1 - span(tt, t.towns, t.towns + .5))); ctx.fillRect(ex - 34, BOX[1] + 52, 68, 4); }
    const tagU = expoOut(span(tt, t.story + .1, t.story + .6)), tagS = lerp(30, 44, expoOut(span(tt, t.luxury + .05, t.luxury + .6)));
    const tagFall = span(tt, t.towns + .1, t.towns + .9);
    if (tagU > 0 && tagFall < 1) K.priceTag(ctx, BOX[0] + 82 + 10 * tagFall, BOX[1] - 104 + 600 * tagFall * tagFall, tagS, tagU);
    if (eb > 0) K.earbuds(ctx, ex, ey, 20 * eb, tt, { a: eb });
    // the library stands up round the earbuds; from its door the light reaches every window of the town
    const lu = sineIO(span(tt, t.libraries - .35, t.libraries + .65));   // sine: the 300 px library must not jump on its first frame (POP 4.4)
    if (lu > 0) K.library(ctx, LIB[0], LIB[1], 300, tt, { u: lu });
    TOWN.forEach(([x, w], i) => {
      const hu = expoOut(span(tt, t.libraries + .1 + i * .07, t.libraries + .7 + i * .07));
      if (hu <= 0) return;
      const lit = expoOut(span(tt, t.libraries + .7 + i * .12, t.libraries + 1.1 + i * .12));
      const flow = 1 + .5 * Math.sin(Math.PI * span(tt, t.allofus + i * .1, t.allofus + .7 + i * .1));
      let wp; rise(ctx, BASE, hu, 120, (c) => { wp = house(c, x, BASE, w, tt, { lamp: lit * Math.min(1, flow), win: lit }); });
      if (wp && lit > 0) {
        const pts = bez([LIB[0] + 20, LIB[1] - 70], wp, .25, 20);
        lightPath(ctx, pts, expoOut(span(tt, t.libraries + .45 + i * .12, t.libraries + 1.0 + i * .12)), { w: 1.8, a: .75, cool: false });
        if (tt > t.allofus - .1) { const v = span(tt, t.allofus + i * .1, t.allofus + .9 + i * .1); if (v > 0 && v < 1) { const k = Math.floor(v * 20); halo(ctx, pts[k][0], pts[k][1], 16, .9); } }
      }
    });
    ctx.restore();
  }
  // 10.02: the makers' tower, the coins that turn gold on their way back to everyone
  const TW2 = [620, 520];
  const coinArc = bez([TW2[0] + 10, TW2[1] - 380], [LIB[0] - 20, LIB[1] - 200], .32, 40);
  function g1002(ctx, tt) {
    if (tt < t.earned - .4) return;
    const gone = expoIn(span(tt, t.easy + .1, t.easy + .7));
    const tu = expoOut(span(tt, t.earned - .35, t.earned + .4));
    if (gone < 1) rise(ctx, TW2[1], tu * (1 - gone), 400, (c) => towerGlyph(c, TW2[0], TW2[1], 80, 380, tt, 1));
    // the coins along the arc (cool → gold past the middle), into the library's roof
    for (let k = 0; k < 6; k++) {
      const v = span(tt, t.earned + .15 + k * .22, t.earned + 1.35 + k * .22); if (v <= 0 || v >= 1) continue;
      const q = coinArc[Math.min(40, Math.floor(sineIO(v) * 40))];
      coin(ctx, q[0], q[1], 11, tt, { gold: smooth(span(v, .35, .7)), ph: k, a: 1 - gone });
    }
    // the arc itself (the loop): faint, drawn by the first coin; later it straightens into the gold road (10.03)
    const au = expoOut(span(tt, t.earned + .15, t.earned + 1.4));
    const st = quartIO(span(tt, t.easy + .2, t.easy + 1.1));   // the loop opens into the two roads
    const road = coinArc.map(([x, y], i) => { const v = i / 40; return [lerp(x, lerp(520, 1420, v), st), lerp(y, ROADY(v, tt), st)]; });
    if (au > 0 && !(tt > t.tell - .4 && span(tt, t.longer + 1.6, t.tell - .4) >= 1)) {
      const ret = expoIn(span(tt, t.longer + 1.9, t.tell - .2));
      lightPath(ctx, road, au, { u0: ret, w: lerp(2, 4, st), a: lerp(.55, 1, st) });
      // 10.03: the cool road splits off the gold one; on 'It was close' they nearly touch
      const cu = expoOut(span(tt, t.easy + .7, t.easy + 1.6));
      if (cu > 0) { const croad = road.map(([x, y], i) => [x, y + COOLGAP(i / 40, tt)]); lightPath(ctx, croad, cu, { u0: ret, cool: true, w: 3.5 }); }
      // the expected tick and the arrival mark that slides past it
      const tk = expoOut(span(tt, t.longer - .5, t.longer)), ret2 = 1 - ret;
      if (tk > 0 && ret2 > 0) {
        lightPath(ctx, [[1120, 520], [1120, 650]], tk * ret2, { w: 2, dash: [6, 9], a: .85 });
        const mv = quartIO(span(tt, t.longer + .05, t.longer + 1.6)), mx = lerp(1080, 1400, mv), my = ROADY((mx - 520) / 900, tt);
        ctx.save(); ctx.globalAlpha *= ret2; halo(ctx, mx, my, 28, .9); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(mx, my, 8, 0, 6.29); ctx.fill();
        ctx.strokeStyle = P.core1; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, my - 46); ctx.stroke(); ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.moveTo(mx, my - 46); ctx.lineTo(mx + 24, my - 38); ctx.lineTo(mx, my - 30); ctx.closePath(); ctx.fill(); ctx.restore();
      }
    }
  }
  const ROADY = (v, tt) => 585 - 12 * Math.sin(v * Math.PI * 1.3);
  const COOLGAP = (v, tt) => { const close = quartIO(span(tt, t.close - .1, t.close + .9)); const near = Math.exp(-Math.pow((v - .5) / .16, 2)); return lerp(110, 110 - 92 * near, close) * expoOut(span(tt, t.easy + .7, t.easy + 1.6)); };
  // 10.04 → 10.05: the tutor's pilot light, the chart, the ladder
  const PIL = [-1418, KY - 62 - 26, ZB - 175];   // on the table, beside her
  const CH = { line: 560, A: 920, B: 1150, lad: 1300 };
  const PIL_W = [CH.B, 330];
  function g1005(ctx, tt) {
    if (tt < t.kids - .3) return;
    const out = expoIn(span(tt, K4.start - 1.6, K4.start - .95)); if (out >= 1) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 3000, 900); ctx.clip();
    const lu = expoOut(span(tt, t.kids - .2, t.kids + .6));
    // the landed pilot light (the tutor) drops a line of light; it spreads into the level line of the chart
    K.voiceLight(ctx, PIL_W[0], PIL_W[1] - 40 * out, 22 * (1 - out), tt, { talk: .15 });
    const dr = expoOut(span(tt, t.kids - .15, t.kids + .3));
    if (dr < 1) lightPath(ctx, [[PIL_W[0], PIL_W[1] + 26], [PIL_W[0], CH.line]], dr, { w: 2, spark: true });
    lightPath(ctx, [[PIL_W[0], CH.line], [CH.A - 70, CH.line]], expoOut(span(tt, t.kids + .25, t.kids + .9)), { w: 2, a: .8 * (1 - out) });
    lightPath(ctx, [[PIL_W[0], CH.line], [CH.lad + 150, CH.line]], expoOut(span(tt, t.kids + .25, t.kids + .9)), { w: 2, a: .8 * (1 - out) });
    ctx.save(); ctx.translate(0, out * 300);
    // pair A (plain chatbot: answers handed out): with it ↑, without it ↓ −17 %
    const cube = expoOut(span(tt, t.kids + .6, t.kids + 1.3));
    if (cube > 0) K.answerCube(ctx, CH.A + 40, 360, 46 * cube, tt, { open: 1, seal: 0, a: cube });
    bar(ctx, CH.A, CH.line - 2, 50, 170 * expoOut(span(tt, t.better, t.better + .7)), { cool: true });
    const dn = expoOut(span(tt, t.worse, t.worse + .8));
    bar(ctx, CH.A + 80, CH.line + 2, 50, -118 * dn, { cool: true });
    if (dn > 0) rise(ctx, 830, expoOut(span(tt, t.worse + .5, t.worse + 1.2)), 140, (c) => E.glowText(c, '−17 %', CH.A + 40, 812, { size: 120, serif: true, align: 'center', col: P.cream }));
    // pair B (the tutor built to ask): level, gold
    const bu = expoOut(span(tt, t.worse + 1.0, t.worse + 1.7));
    bar(ctx, CH.B - 34, CH.line - 2, 50, 150 * bu); bar(ctx, CH.B + 34, CH.line - 2, 50, 150 * expoOut(span(tt, t.worse + 1.1, t.worse + 1.8)));
    // the ladder of questions climbs beside it
    for (let k = 0; k < 4; k++) {
      const u = span(tt, t.ask + k * .16, t.ask + .55 + k * .16), x = CH.lad + k * 48, y = CH.line - 30 - k * 62;
      const lit = k === 3 ? expoOut(span(tt, t.yours, t.yours + .5)) : 0;
      if (u > 0) { lightPath(ctx, [[x - 18, y + 30], [x - 18, y - 32 + 30]], 1, { w: 1.6, a: .5 }); K.qStep(ctx, x, y, 54, tt, { u, lit }); }
    }
    ctx.restore(); ctx.restore();
  }
  // 11.01 the school: 156 windows, 154 light; teachers first, then the rest; 11.02 the rings contract into the lamp pool
  const SCH = { cols: 13, rows: 12, cell: 30, x0: 960 - 2 * 30 - 15, y0: 450 - 6 * 30 - 15 };
  const DARK = new Set([17, 131]);
  const schoolOrder = (() => { const o = []; for (let r = 0; r < SCH.rows; r++) for (let k = 0; k < SCH.cols; k++) o.push([r, k, Math.hypot(k - 2, (r - 6) * 1.1)]); return o.sort((a, b) => a[2] - b[2]); })();
  const SCC = [SCH.x0 + SCH.cols * SCH.cell / 2, SCH.y0 + SCH.rows * SCH.cell / 2];
  function g1101(ctx, tt) {
    if (tt < K4.end + .35) return;
    const out = quartIO(span(tt, t.everybody + .9, t.thinks + .4)); if (out >= 1) return;
    const fr = expoOut(span(tt, K4.end + .5, K4.end + 1.3));
    ctx.save(); ctx.translate(SCC[0], SCC[1]); ctx.scale(1 - out, 1 - out); ctx.translate(-SCC[0], -SCC[1]);
    const x0 = SCH.x0 - 16, y0 = SCH.y0 - 16, w = SCH.cols * SCH.cell + 32, h = SCH.rows * SCH.cell + 32;
    // the building drawn out of its first window (two lines run round the outline)
    const per = [[960, y0 + h], [x0, y0 + h], [x0, y0], [SCC[0], y0 - 40], [x0 + w, y0], [x0 + w, y0 + h], [960, y0 + h]];
    ctx.fillStyle = rgba(P.ind1, .55 * fr); ctx.fillRect(x0, y0, w, h);
    lightPath(ctx, per, fr, { w: 2.4, a: .85 });
    const n = schoolOrder.length, t1 = t.practiced + .1, t2 = t.leaning + 1.2;
    schoolOrder.forEach(([r, k], i) => {
      const idx = r * SCH.cols + k, x = SCH.x0 + k * SCH.cell + 6, y = SCH.y0 + r * SCH.cell + 8;
      const on = i === 0 ? expoOut(span(tt, K4.end + .4, K4.end + .7)) : DARK.has(idx) ? 0 : expoOut(span(tt, lerp(t1, t2, i / n), lerp(t1, t2, i / n) + .2));
      ctx.fillStyle = on > 0 ? rgba(mixHex(P.halo0, P.core0, on), .25 + .75 * on) : rgba(P.blue1, .45); ctx.fillRect(x, y, 18, 14);
    });
    // a small figure upright beside a cool light (not leaning on it)
    const fu = expoOut(span(tt, t.leaning - .1, t.leaning + .5)), st = quartIO(span(tt, t.leaning + .5, t.leaning + 1.2));
    if (fu > 0) { lightPath(ctx, [[x0 + w + 20, BASE - 90], [x0 + w + 160, BASE - 90]], fu, { w: 2, a: .7 }); K.coolPoint(ctx, x0 + w + 130, BASE - 150, 14 * fu, fu); rise(ctx, BASE - 90, fu, 110, (c) => wallPerson(c, x0 + w + 72, BASE - 90, 96, tt, { seed: 61, dir: 1, lean: lerp(.32, 0, st) })); }
    // the rings: teachers first, then the rest of us; they breathe on 'Everybody did'
    const br = 1 + .035 * Math.sin(Math.PI * 2 * span(tt, t.everybody, t.everybody + 1.4));
    for (const [tt0, rx, ry] of [[t.teachers, 230, 250], [t.rest, 300, 330]]) {
      const u = expoOut(span(tt, tt0, tt0 + 1.1)); if (u <= 0) continue;
      ctx.save(); ctx.strokeStyle = rgba(P.core1, .9); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(SCC[0], SCC[1], rx * u * br, ry * u * br, 0, 0, 6.29); ctx.stroke();
      ctx.strokeStyle = rgba(P.halo0, .22); ctx.lineWidth = 12; ctx.stroke(); ctx.restore();
    }
    ctx.restore();
  }
  // 11.03 the three questions → 11.04 the three ordinary days → millions of points
  const SYM = [625, 960, 1295], SYM_Y = 500, SS = 1.36;
  function g1103(ctx, tt) {
    if (tt < t.asked - .2) return;
    const zoom = tt < t.millions ? 1 : Math.exp(lerp(0, Math.log(.028), sineIO(span(tt, t.millions, t.millions + 2.4))));
    const fallU = span(tt, t.writes - .5, t.writes + 1.9);
    if (fallU >= 1) return;
    ctx.save(); clipWall(ctx);
    const mc = [960, 515];
    // the map: points come into view as it zooms out; at the end they fall (into the lamp pool below)
    if (tt > t.millions - .1) {
      const lit = expoOut(span(tt, t.millions - .05, t.millions + .5));
      for (let i = 0; i < MAP.length; i++) {
        const p = MAP[i], x = mc[0] + p[0] * zoom, y0 = mc[1] + p[1] * zoom;
        if (x < 440 || x > 1480 || y0 < 50 || y0 > 860) continue;
        const fl = clamp(fallU * 1.6 - (1 - (y0 - 60) / 780) * .6), y = y0 + 900 * fl * fl;
        const tw = .75 + .25 * Math.sin(tt * 2.1 + i * 1.7);
        ctx.fillStyle = rgba(i % 9 ? P.halo0 : P.core0, lit * tw * (.55 + .45 * p[2])); const s = 1.6 + p[2] * 1.4; ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }
    // the three: a '?' → its symbol → a window of an ordinary day; then shrink to three points of the map
    const q3 = [t.who, t.whose, t.does], days = [t.work, t.friends, t.vote];
    SYM.forEach((x0, i) => {
      const qu = expoOut(span(tt, t.asked + i * .1, t.asked + .55 + i * .1)), qs = expoIn(span(tt, q3[i] - .05, q3[i] + .3));
      const x = mc[0] + (x0 - mc[0]) * zoom, y = mc[1] + (SYM_Y - mc[1]) * zoom;
      const fl = clamp(fallU * 1.6 - .3), yF = y + 900 * fl * fl;
      if (zoom < .2) { ctx.fillStyle = rgba(P.core0, 1); ctx.fillRect(x - 2.5, yF - 2.5, 5, 5); halo(ctx, x, yF, 14, .7); return; }
      if (qu > 0 && qs < 1) K.qStep(ctx, x, y + 34 * SS * zoom, 96 * zoom, tt, { u: qu * (1 - qs), lit: 0 });
      const su = expoOut(span(tt, q3[i] + .2, q3[i] + .8)), wu = span(tt, days[i] - .05, days[i] + .5);
      ctx.save(); ctx.translate(x, y); ctx.scale(zoom * SS, zoom * SS);
      if (su > 0 && wu < 1) rise(ctx, 50, su * (1 - expoIn(wu)), 140, (c) => symbol(c, i, tt));
      if (wu > 0) frameWin(ctx, 0, 0, 220, 170, wu, (c) => day(c, i, tt));
      ctx.restore();
    });
    ctx.restore();
  }
  function symbol(ctx, i, tt) {   // local coords: centre (0, 0), baseline y 50
    if (i === 0) { house(ctx, 0, 50, 96, tt, { lamp: 1 }); }
    if (i === 1) { agent(ctx, -30, -40, 20, tt, { warm: 1 }); lightPath(ctx, sag([-30, -18], [36, 26], 10), 1, { w: 2.4 }); ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.beginPath(); ctx.ellipse(46, 34, 22, 11, -.4, 0, 6.29); ctx.fill(); ctx.fillRect(40, 30, 40, 16); ctx.fillStyle = rgba(P.halo0, .9); ctx.fillRect(30, 22, 8, 22); }
    if (i === 2) { for (let k = 0; k < 5; k++) { const x = -88 + k * 44; ctx.fillStyle = mixHex(P.ind1, P.blue0, .4); ctx.fillRect(x - 18, -20, 36, 60); ctx.fillStyle = rgba(mixHex(WARM.mid, P.core0, .4), 1); ctx.fillRect(x - 11, -10, 22, 22); halo(ctx, x, 0, 26, .4); } }
  }
  function day(ctx, i, tt) {   // inside a 220 × 170 window, centre (0, 0)
    ctx.fillStyle = lin(ctx, 0, -85, 0, 85, [[0, mixHex(P.night1, P.ind1, .6)], [1, P.night1]]); ctx.fillRect(-110, -85, 220, 170);
    if (i === 0) {   // you at a desk, a '?' over your screen
      ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(-80, 34, 160, 8); ctx.fillRect(-70, 42, 8, 43);
      ctx.fillStyle = rgba(COOL.mid, .9); ctx.fillRect(10, -6, 54, 36); halo(ctx, 37, 12, 40, .3, COOL.mid, COOL.core);
      K.you(ctx, -30, 85, 100, tt, { seed: 71, dir: 1, view: 'side', armR: [1.3, 1.7], look: .2 });
      E.glowText(ctx, '?', 37, -18, { size: 34, serif: true, align: 'center', col: P.core1 });
    }
    if (i === 1) {   // a table of friends, a '?' between them
      ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fillRect(-60, 42, 120, 7);
      halo(ctx, 0, 30, 60, .35);
      K.other(ctx, -64, 85, 92, tt, { seed: 72, dir: 1 }); K.other(ctx, 64, 85, 96, tt, { seed: 73, dir: -1 }); K.other(ctx, 0, 85, 72, tt, { seed: 74, dir: 1, view: 'back' });
      E.glowText(ctx, '?', 0, -22, { size: 34, serif: true, align: 'center', col: P.core1 });
    }
    if (i === 2) {   // a ballot box, a '?' above it
      ctx.fillStyle = mixHex(P.ind1, P.blue0, .55); ctx.fillRect(-36, 10, 72, 60); ctx.fillStyle = P.night1; ctx.fillRect(-18, 10, 36, 5);
      ctx.fillStyle = P.cream; ctx.fillRect(-10, -6 + 6 * Math.sin(tt * 1.3), 20, 14);
      K.other(ctx, -72, 85, 90, tt, { seed: 75, dir: 1, armR: [1.4, 1.6] });
      E.glowText(ctx, '?', 0, -30, { size: 34, serif: true, align: 'center', col: P.core1 });
    }
  }

  // ---------------------------------------------------------------------------------------------- the wall function
  function wallFn(ctx, c, tt) {
    // the old screens (world units on the wall plane): K3 from the agent-and-you pair's thread, K4 from the top '?'
    if (tt > K3.start - 2 && tt < K3.end + .5) oldScreen(ctx, tt, { ...K.SCREEN, clip: K3, line: [WPX(ROW[3] - 4), WPY(BASE - 128)] });
    if (tt > K4.start - 2 && tt < K4.end + .5) oldScreen(ctx, tt, { ...K.SCREEN, clip: K4, line: [WPX(CH.lad + 144), WPY(CH.line - 30 - 186 - 30)] });
    onWall(ctx, (w) => {
      g901(w, tt); gAgent(w, tt); g902(w, tt); g905(w, tt, c); g1001(w, tt); g1002(w, tt); g1005(w, tt); g1101(w, tt); g1103(w, tt);
    });
  }

  // ---------------------------------------------------------------------------------------------- screen-space carriers (after the world)
  function overlay(ctx, c, tt, out) {
    // 9.01: the agent's gold thread to your wrist (you, at the right end of the table)
    if (tt > T0 + .7 && tt < t.helpers + .6 && out.you?.R) {
      const ap = agentPos(tt), a = fromWall(c, ap[0], ap[1] + 26); const hu = expoOut(span(tt, T0 + 1.2, T0 + 2.6)), ret = expoIn(span(tt, t.because + .7, t.helpers + .5));
      if (a) K.thread(ctx, a, out.you.R, tt, { u: hu, sag: 40, w: 2.2, a: 1 - ret });
    }
    // 9.02: the old rule's light comes from the lamp (a warm spark arcs onto the wall)
    if (tt > t.rule - .05 && tt < t.rule + .8) {
      const lp = K.wp(c, KITCHEN.lamp.x, KITCHEN.lamp.y + 8, KITCHEN.lamp.z), s = fromWall(c, SEAL[0], SEAL[1]);
      if (lp && s) { const u = expoOut(span(tt, t.rule, t.rule + .7)); K.goldLine(ctx, lp, s, u, { u0: expoIn(span(tt, t.rule + .35, t.rule + .8)), lift: .25, w: 2.4 }); }
    }
    // 9.05: the keys lift off the ring and fly back into your hand; they stay in it
    if (tt > t.keys && out.you?.R && tt < t.earbuds + 2) {
      const a = fromWall(c, SC[0], SC[1] + 32 * 1.3 + 16), h = out.you.R, u = quartIO(span(tt, t.keys + .1, t.keys + 1.0));
      if (a) { const p = K.arcPts(a, [h[0] - 4, h[1] - 6], .3, 30)[Math.round(u * 30)]; const sc = a[2] ? 1 : 1; keyRing(ctx, p[0], p[1], lerp(16 * (c.f / (ZB - c.z)) / S0, 10, u), tt, 1, -.4 * Math.sin(Math.PI * u)); }
    }
    // 10.04: the tutor's pilot light (comes in from the kid's room on the right, waits beside her, then rises to the wall)
    if (tt > t.tell - 1.4 && tt < t.kids - .14) {
      const base = K.wp(c, PIL[0], PIL[1], PIL[2]), rs = quartIO(span(tt, t.noticed + .3, t.kids - .15)), wall = fromWall(c, PIL_W[0], PIL_W[1]);
      const inn = quartIO(span(tt, t.tell - 1.4, t.tell + .2));
      if (base && wall) {
        const startP = [W + 80, base[1] - 120], p0 = [lerp(startP[0], base[0], inn), lerp(startP[1], base[1], inn) - 30 * Math.sin(Math.PI * inn)];
        const p = [lerp(p0[0], wall[0], rs), lerp(p0[1], wall[1], rs) - 60 * Math.sin(Math.PI * rs)];
        K.voiceLight(ctx, p[0], p[1], lerp(10 * base[2], 22 * wall[2] / S0, rs), tt, { talk: tt > t.tell && tt < t.tell + 1.2 ? .6 : .1 });
      }
    }
    // 11.01 → 11.02: the rings contract to a point that drops into the lamp pool on the table
    if (tt > t.everybody + .9 && tt < t.thinks + 1.6) {
      const a = fromWall(c, SCC[0], SCC[1]), b = K.wp(c, KITCHEN.lamp.x - 130, TBL.top - 2, (TBL.z0 + TBL.z1) / 2), u = sineIO(span(tt, t.thinks + .2, t.thinks + 1.3));
      if (a && b && tt > t.thinks + .2) { const x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u * u); halo(ctx, x, y, 26 * (1 - .5 * u), .9 * (1 - span(tt, t.thinks + 1.25, t.thinks + 1.6))); }
    }
    // 11.05: her hand with a pencil at the nib (enters from the left), leaves after the last word
    if (out.nib && tt > t.biggest - .4 && tt < t.one + .6) {
      const nb = out.nib, inn = quartIO(span(tt, t.biggest - .4, t.biggest + .5)), lv = quartIO(span(tt, t.w4e + .5, t.one + .5));
      const k = c.f / (NB.Z - c.z), x = nb[0] + lerp(0, 760, lv) + lerp(760, 0, inn), y = nb[1] + lerp(0, 620, lv) + lerp(620, 0, inn) + 3 * Math.sin(tt * 19) * (tt < t.w4e && tt > t.bpka ? 1 : 0);
      pencilHand(ctx, x, y, k);
    }
    // the moon on the page (rises to the plate's value)
    const mu = endU(tt);
    if (mu > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rad(ctx, 1500, 120, 900, [[0, rgba(COOL.mid, (.12 + .02 * Math.sin(tt * .7)) * mu)], [1, rgba(COOL.mid, 0)]]); ctx.fillRect(0, 0, W, H); ctx.restore(); }
  }
  function pencilHand(ctx, x, y, k) {   // screen px: her right hand writes; the forearm comes in from the lower right, so the written words (left of the nib) stay free
    const base = P.blue1, lit = mixHex(P.blue1, COOL.mid, .45), shade = mixHex(P.blue1, P.night1, .45), hand = mixHex(P.blue2, P.cream, .3);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // the forearm: a tapered sleeve from the wrist (x+150, y+90) to beyond the frame's lower right
    const wx = x + 150, wy = y + 92, fx = x + 820, fy = y + 640, ang = Math.atan2(fy - wy, fx - wx), nx = -Math.sin(ang), ny = Math.cos(ang);
    const sleeve = (w0, w1, col, off = 0) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(wx + nx * (w0 + off), wy + ny * (w0 + off)); ctx.quadraticCurveTo((wx + fx) / 2 + nx * (w1 * .9 + off) + 30, (wy + fy) / 2 + ny * (w1 * .9 + off) - 20, fx + nx * (w1 + off), fy + ny * (w1 + off)); ctx.lineTo(fx - nx * w1, fy - ny * w1); ctx.quadraticCurveTo((wx + fx) / 2 - nx * w1 * .9 + 30, (wy + fy) / 2 - ny * w1 * .9 - 20, wx - nx * w0, wy - ny * w0); ctx.closePath(); ctx.fill(); };
    sleeve(54, 104, shade); sleeve(46, 92, base); sleeve(46, 92, rgba(lit, .55), 0); sleeve(30, 70, base);   // body + the lamp's edge along its upper side
    ctx.strokeStyle = mixHex(base, P.cream, .16); ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(wx + nx * 50, wy + ny * 50); ctx.lineTo(wx - nx * 50, wy - ny * 50); ctx.stroke();   // the cuff
    // the pencil: tip exactly at the nib, its end up and to the right (towards her shoulder)
    const pa = Math.atan2(-150, 250), L = 300, ex = x + L * Math.cos(pa), ey = y + L * Math.sin(pa), px = -Math.sin(pa) * 9, py = Math.cos(pa) * 9;
    const cx0 = x + 38 * Math.cos(pa), cy0 = y + 38 * Math.sin(pa);
    ctx.fillStyle = mixHex(P.halo0, P.shade0, .35); ctx.beginPath(); ctx.moveTo(ex + px, ey + py); ctx.lineTo(cx0 + px, cy0 + py); ctx.lineTo(cx0 - px, cy0 - py); ctx.lineTo(ex - px, ey - py); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.shade0, P.night1, .3); ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(cx0, cy0); ctx.lineTo(cx0 + px, cy0 + py); ctx.lineTo(ex + px, ey + py); ctx.closePath(); ctx.fill();   // the shaded facet
    ctx.fillStyle = P.halo1; ctx.beginPath(); ctx.moveTo(cx0 + px, cy0 + py); ctx.lineTo(x + 10 * Math.cos(pa) + px * .3, y + 10 * Math.sin(pa) + py * .3); ctx.lineTo(x + 10 * Math.cos(pa) - px * .3, y + 10 * Math.sin(pa) - py * .3); ctx.lineTo(cx0 - px, cy0 - py); ctx.closePath(); ctx.fill();   // sharpened wood
    ctx.fillStyle = P.night1; ctx.beginPath(); ctx.moveTo(x + 12 * Math.cos(pa) + px * .35, y + 12 * Math.sin(pa) + py * .35); ctx.lineTo(x, y); ctx.lineTo(x + 12 * Math.cos(pa) - px * .35, y + 12 * Math.sin(pa) - py * .35); ctx.closePath(); ctx.fill();   // graphite
    ctx.fillStyle = mixHex(P.shade1, P.night1, .25); ctx.beginPath(); ctx.arc(ex, ey, 9, 0, 6.29); ctx.fill();   // the end
    // the hand: a closed fist on the pencil, fingertips towards the nib
    ctx.fillStyle = mixHex(hand, P.night1, .28); ctx.beginPath(); ctx.ellipse(x + 112, y + 70, 66, 48, .45, 0, 6.29); ctx.fill();
    ctx.fillStyle = hand; ctx.beginPath(); ctx.ellipse(x + 104, y + 58, 62, 44, .45, 0, 6.29); ctx.fill();
    ctx.fillStyle = hand; ctx.beginPath(); ctx.ellipse(x + 50, y + 22, 30, 17, .55, 0, 6.29); ctx.fill();    // index and middle finger along the pencil
    ctx.fillStyle = mixHex(hand, P.cream, .22); ctx.beginPath(); ctx.ellipse(x + 78, y - 6, 26, 15, -.5, 0, 6.29); ctx.fill();   // the thumb over it
    ctx.restore();
  }

  // ---------------------------------------------------------------------------------------------- the frame
  const lineU = (tt) => {   // 'Because people kept asking.' word by word
    const s = NOTEBOOK_PLATE.line2, f = (w) => s.indexOf(w) / s.length;
    return clamp(valAtLin(tt, [[t.bpka - .05, 0], [t.w2, f('people')], [t.w3, f('kept')], [t.w4, f('asking')], [t.w4e + .1, 1]]));
  };
  function draw(ctx, tt) {
    if (tt < T0 + .5) {   // plateWall (B2 → B3): the world at CAM_WALL with the pair at rest, no drift
      K.world(ctx, K.CAM_WALL, tt, { ...WALL_STATE, you: { ...WALL_STATE.you, kitchen: { ...WALL_STATE.you.kitchen, people: dinnerPeople(tt, K.CAM_WALL) } } });
      return;
    }
    if (tt >= HOLD_END) { plateNotebook(ctx, tt); return; }
    const c = camOf(tt), st = stateAt(tt), out = {};
    const people = dinnerPeople(tt, c, { kid: { ...kidPose(tt), hide: tt > t.one + 2 }, you: { ...youPose(tt), hide: tt > t.one + 2 }, out });
    // the notebook: rises from her lap and stands propped on the table at 'writes it down'
    if (tt > t.writes - .2) {
      const up = expoOut(span(tt, t.writes + .45, t.writes + 1.25)), m = lerp(.55, 1, endU(tt));
      const it = notebookItemF(tt, { flip: lerp(.15, 1, up), dy: lerp(26, 0, up), moon: m, l1: 1, l2: lineU(tt) });
      const fn = it[1]; people.push([it[0], (cx) => { fn(cx); }]);
      out.nibItem = it;
    }
    // your phone, dark, beside the notebook (11.06)
    if (tt > t.writes) people.push([NB.Z - 6, (cx) => K.phone(cx, NB.X + 52, TBL.top - 1, 16, tt, { on: 0 })]);
    K.world(ctx, c, tt, { hour: st.hour, you: { hallLamp: st.hallLamp, kitchen: { lamp: st.lamp, wall: st.wall, scan: null, phone: null, people, wallFn: (cx) => wallFn(cx, c, tt) } } });
    if (tt > t.biggest - .4 && tt < t.one + .6) {   // the nib position (screen) for the pencil
      const N = NOTEBOOK_WORLD, k = N.w / NOTEBOOK_PLATE.w, u = lineU(tt);
      const ctx2 = ctx; ctx2.save(); ctx2.font = `italic ${76 * k}px "Instrument Serif"`; const wdt = ctx2.measureText(NOTEBOOK_PLATE.line2).width; ctx2.restore();
      out.nib = K.wp(c, N.X + 90 * k + wdt * u, N.Y + 20 * k - 76 * k * .15, N.Z);
    }
    overlay(ctx, c, tt, out);
  }
  return { draw, T0, TN, anchors: t };
}
function valAtLin(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0]));
  return keys[keys.length - 1][1];
}
// one cached build per timing object (the three scene files share it)
const CACHE = new WeakMap();
export function b3(T) { if (!CACHE.has(T)) CACHE.set(T, buildB3(T)); return CACHE.get(T); }
