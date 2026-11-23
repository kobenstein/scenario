// Film 49 · c09 · STEP 2 · THE MACHINE, second half (B3). Out of plateMachine at 'That is what the experts know', one continuous take up
// to the top step ('One year to go' is c10, the same take). This file ALSO holds the shared base of the B3 group (c09–c12): b3(T) = the
// phrase anchors, the ONE camera path from the plate to S.END_CAM, the light/stage states of the stairs, the law table on tread 4, the top
// table on the landing (place card, pen) and the figure helper. sc10–sc12 import it, so the inner seams c09|c10|c11|c12 are one take.
//
// | beat  | phrase (VO)                          | picture                                                                                  | camera / kind      |
// |-------|--------------------------------------|------------------------------------------------------------------------------------------|--------------------|
// | 2.09  | That is what the experts know        | out of plateMachine (the plate creep continues); you by the TV; a night veil on the left: | pull back · EXPL   |
// |       | Among Americans over sixty-five      | AMERICANS OVER 65 · bars 35 % EXPECT A NEGATIVE EFFECT (cool, on 'expect') · 23 % EVER    |                    |
// |       |                                      | USED A CHATBOT (gold, on 'tried'); source PEW                                             |                    |
// | 2.10  | The fear arrived before the exper…   | the bars sink back into their line; push in: headlines run on the TV, the tablet untouched | push · MIX         |
// | 2.11★ | So get the experience · one afternoon| you walk to the table, take the tablet, walk to the window; the window runs through ONE    | glide · MIX        |
// |       | a task you have done for years       | AFTERNOON (night → warm afternoon → evening, lamps on); the tablet's screen grows out of   |                    |
// |       | where it shines · where it is wrong  | your hand: your old timetable slides in, the machine's rows, gold ticks, one red ?         |                    |
// | 2.12  | That protects you … pitch … shrug    | the screen goes back into the tablet; push to the window: in the left pane a billboard     | push · EXPL        |
// |       |                                      | SOON!, in the right pane a figure shrugs NOT IN OUR LIFETIME; you between them, your result|                    |
// | 2.13  | The last step needs that judgment    | you turn, climb the carved stair onto tread 4 (the camera rises with you); the square pops | rise · MIX         |
// |       | Because the rules … written right now| up (façade with columns, booth, lamp) with a table; you lay your tablet on it; the law     |                    |
// |       |                                      | sheet grows out of the table: its lines write themselves                                   |                    |
// | 2.14  | And the biggest one is still blank   | the top line stays blank: a gold glint runs along it; the sheet goes back onto the table   | push · MIX         |
// |       | who gets what the machines earn?     | → c10 'One year to go' (the top step lights on the step hit, same take)                    |                    |
// Carriers: the plate creep · the bars' base line · the tablet (hand → screen → hand) · the window · you (the climb) · the law sheet.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, P, W, H, halo, lin, prng } = E;
const { GOLD, COOL, PAPER, LAMP } = F;
export const A = (u, v, s, sx = W / 2, sy = H / 2) => E.aim(S.Z_LAND, u, v, s, sx, sy);
export const SIL = () => mixHex(P.night0, P.ind1, .22);
export const RED = '#e2694f';   // the one red question mark (2.11): a muted coral, used nowhere else
const TAU = Math.PI * 2;

// ================================================================================================================ the B3 base (shared)
export const Y3 = S.STAGES[3].y, Y4 = S.STAGES[4].y, YL = S.LANDING.top - S.TD * .45;   // feet on tread 3 / tread 4 / the landing
export const LAW = { x0: 1516, x1: 1604, y: 298, dx: 12, dy: -7, cx: 1560 };           // the table of the square (tread 4)
export const BOOTH_X = 1679, YOU_LAW = 1560, YOU_TOP = 1980;                             // you: in the booth · behind the law table · on the landing
export const TOP = { x0: 2000, x1: 2440, y: S.LANDING.top - S.TD - 74, card: 2030 };    // the top table (= endScreen's topTable)
const CACHE = new WeakMap();
export function b3(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const T0 = T.G('That is what the experts know'), g = (p, d = 0, after = T0) => T.G(p, 0, after) + d;
  const a = {
    T0, a0: T0 + S.SEAM_HALF, endT: T.duration - 15,
    // c09
    andYou: g('And you'), among: g('Among Americans over'), expect: g('more people expect'), tried: g('ever tried a chatbot'), fear: g('The fear arrived'),
    soGet: g('So get the experience'), give: g('Give the machine one'), afternoon: g('one afternoon'), task: g('and a task you have'),
    there: g('There, you see at once'), shines: g('where it shines'), wrong: g('where it is wrong'), protects: g('That protects you'),
    pitch: g('the sales pitch'), shrug: g('and the shrug'), vague: g('It turns a vague'), last: g('The last step needs'), rules: g('Because the rules'),
    written: g('being written right now'), biggest: g('And the biggest one is still'), blank: g('still blank'), who: g('who gets what the machines'),
    // c10
    oneYear: g('One year to go'), say: g('This step is your say'), voters: g('Voters have already'), november: g('This November, limits'),
    ballots: g('on local ballots'), won: g('They won all but one'), buildings: g('Those votes were about'), bigger: g('On the bigger question'),
    ends: g('both ends of American'), stake: g('give the public a stake'), sanders: g('Senator Bernie Sanders'), fund: g('a public fund of'),
    chances: g("The bill's chances"), argument: g('But here is his argument'), trump: g('Donald Trump has floated'), quote: g('the American public essentially'),
    neither: g('Neither version is law'), showUp: g('So when this reaches'), ask: g('And ask everyone who'), whoShare: g('who gets a share'),
    otherwise: g('Otherwise, others divide'),
    // c11
    great: g('And there may be a great'), inside: g('Inside one'), nine: g('nine in ten'), stakeThat: g('They have a stake in that'),
    even: g('But if even part'), suppose: g('So suppose all of it works'), leaves: g('That leaves the hardest'),
    // c12
    five: g('Five years from now'), stranger: g('a stranger asks what'), whoWant: g('Who do you want to be'), loss: g('It can sound like a loss'),
    listen: g('But listen again'), children: g('the question we ask children'),
  };
  a.whatWant = g('What do you want to be', 0, a.listen); a.history = g('For most of history'); a.leftTo = g('was left to the children');
  a.yours = g('This one is yours'); a.wWarning = g('warning', 0, a.yours); a.wWork = g('work', 0, a.wWarning); a.wWonder = g('wonder', 0, a.wWork);
  a.noNext = g('There is no next generation to wait'); a.core = g('This time, the next generation is you', 0, a.noNext);
  a.coreNext = g('next generation is you', 0, a.core); a.call = g('This channel exists so that', 0, a.core); a.subscribe = g('Then subscribe', 0, a.core);
  a.voEnd = T.GE('Then subscribe', 0, a.core);
  const base = { a, T };
  base.plateCam = (t) => { const k = S.creep(t, T, 'That is what the experts know'); return S.MACHINE_CAM(k, S.trk(k)); };
  // S.endScreen's camera, continued BACKWARDS before its start (same push and truck): the take arrives in the end screen moving
  base.endCam = (t) => { const d = t - a.endT; return A(1250 + 5 * d, 640, .72 * (1 + .005 * d), 960, 430); };
  base.K = keys(a, base);
  base.cam = (t) => camAt(t, base);
  base.lit = (t) => litAt(t, a, T);
  base.stage = (t) => stageAt(t, a);
  base.dawn = (t) => .9 * smooth(span(t, a.great - .4, a.great + 5.6)) * (1 - smooth(span(t, a.suppose + 1.2, a.leaves + 2.4)));
  base.lawK = (t) => expoOut(span(t, a.last + .9, a.last + 2.0)) * (1 - sineIO(span(t, a.great + 1.4, a.great + 2.6)));
  CACHE.set(T, base);
  return base;
}
// THE camera of B3: [time, cam] keys on phrases (F.camPath glides through them). Plate creep blended in at the start, END_CAM creep at the end.
function keys(a, B) {
  return [
    [a.a0, B.plateCam(a.a0)],
    // c09
    [a.among + 1.2, A(1530, 365, 1.9, 1260, 610)], [a.fear - .2, A(1518, 368, 1.84, 1250, 610)], [a.fear + 1.7, A(1500, 378, 2.8, 980, 570)],
    [a.give, A(1452, 366, 2.74, 960, 570)], [a.there + .2, A(1405, 352, 2.7, 860, 565)], [a.protects + 1.7, A(1323, 331, 3.25, 960, 505)],
    [a.last + .2, A(1325, 330, 3.34, 960, 505)], [a.last + 2.6, A(1522, 266, 2.35, 1200, 560)], [a.biggest, A(1545, 268, 2.45, 1300, 560)],
    [a.who + .9, A(1550, 270, 2.5, 1300, 560)],
    // c10 (calm pass: shorter travel, same times)
    [a.say + 2.6, A(1640, 300, 1.8, 1380, 600)], [a.won, A(1662, 300, 1.62, 1375, 600)], [a.buildings + 2.3, A(1720, 292, 1.36, 1123, 600)],
    [a.fund, A(1566, 290, 1.95, 1171, 570)], [a.argument, A(1568, 290, 1.98, 1168, 570)],
    [a.trump + 1.0, A(1572, 290, 2.0, 1164, 570)], [a.neither, A(1576, 290, 2.02, 1154, 570)],
    [a.otherwise + .8, A(1650, 284, 2.24, 1386, 580)],
    // c11
    [a.inside + 2.5, A(1430, 420, .9, 1100, 590)], [a.even + 3.0, A(1470, 432, .86, 1020, 595)], [a.leaves - 2.0, A(1475, 431, .862, 1020, 595)],   // calm pass 2: the push to the table: one slow move across the c11|c12 seam
    // c12 (calm pass 2: one long push, a long hold on the card, one long pull to both stairs, then one slow glide into END_CAM)
    [a.whoWant + 1.4, A(2060, 262, 2.0, 960, 620)], [a.listen + .6, A(2062, 263, 2.05, 960, 620)],
    [a.yours + .3, A(-250, 860, .42, 960, 560)], [a.wWork, A(-200, 858, .425, 960, 560)],
    [a.core + 1.6, A(1100, 805, .5, 960, 540)],   // back to you: a wide pan (cheap), the slow push into END_CAM follows
    [a.endT - .6, B.endCam(a.endT - .6)],
  ];
}
const mixCam = (p, q, w) => E.cam3({ x: lerp(p.x, q.x, w), y: lerp(p.y, q.y, w), z: lerp(p.z, q.z, w) });
function camAt(t, B) {
  const { a } = B;
  let c = F.camPath(t, B.K);
  const w0 = smooth(span(t, a.a0, a.a0 + 2.8)); if (w0 < 1) c = mixCam(B.plateCam(t), c, w0);
  const w1 = smooth(span(t, a.endT - 4.6, a.endT - .6)); if (w1 > 0) c = mixCam(c, B.endCam(t), w1);
  // THE FLOAT: a slow elliptical drift of the land card on screen (±R px, one turn in ~8.4 s). An ellipse never stops (a sine drift
  // does), so a hold is a slow glide, never a freeze; it fades in out of the plate and out into the end screen's own push.
  const amt = smooth(span(t, a.a0, a.a0 + 2.0)) * (1 - smooth(span(t, a.endT - 2.6, a.endT - .6)));
  if (amt <= 0) return c;
  const p0 = E.project(c, S.Z_LAND, 0, 0), p1 = E.project({ ...c, x: c.x + 1, y: c.y + 1 }, S.Z_LAND, 0, 0);
  const kx = p0 && p1 ? Math.abs(p1[0] - p0[0]) || 1 : 1, ky = p0 && p1 ? Math.abs(p1[1] - p0[1]) || 1 : 1, w = .75, R = FLOAT_R * amt;
  return E.cam3({ ...c, x: c.x + R * Math.cos(w * t) / kx, y: c.y + .85 * R * Math.sin(w * t) / ky });
}
export const FLOAT_R = 30;
// the stairs' light: year 2 (tread 3) lit until the top step's hit; the hit (F.stepLight, step 4) lights the top step and dims tread 3 to
// 'passed'. In c11 ('But if even part …') the passed steps light up again, stage by stage (discoveries), so every step is lit for the end.
export const STAGE_ON = (a, k) => a.even + .5 + k * .75;
function litAt(t, a, T) {
  const L4 = F.stepLight(T, t, 4), out = [.6, .6, .6, 1 - .4 * clamp(L4), .3 + .7 * L4];
  for (let k = 0; k < 4; k++) out[k] = lerp(out[k], 1, smooth(span(t, STAGE_ON(a, k), STAGE_ON(a, k) + 1.3)));
  return out;
}
function stageAt(t, a) {
  const out = [0, 0, 0, Math.max(1 - span(t, a.last + 1.0, a.last + 2.0), span(t, STAGE_ON(a, 3) + .1, STAGE_ON(a, 3) + 1.1)), span(t, a.last + .9, a.last + 2.1)];
  for (let k = 0; k < 3; k++) out[k] = span(t, STAGE_ON(a, k) + .1, STAGE_ON(a, k) + 1.1);
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- figure helper
// draws you (E.du, the world's defaults) or a person; o.flip -1..1 turns the figure (a squash through the side view, never a mirror pop);
// returns the hands in world space.
export function figure(ctx, f, kind = 'du') {
  const fn = kind === 'du' ? E.du : E.person, base = kind === 'du' ? { light: 1, back: .35, dir: 1, look: .8 } : { light: 1, dir: 1 };
  const o = { ...base, ...(f.o ?? {}) }, h = f.h ?? S.YOU_H;
  if (f.flip == null) return fn(ctx, f.x, f.y, h, o);
  const sx = Math.sign(f.flip || 1) * Math.max(.1, Math.abs(f.flip));
  ctx.save(); ctx.translate(f.x, 0); ctx.scale(sx, 1); ctx.translate(-f.x, 0);
  const hd = fn(ctx, f.x, f.y, h, { ...o, dir: 1 }); ctx.restore();
  const fx = (p) => (p ? [f.x + (p[0] - f.x) * sx, p[1]] : p);
  return hd ? { R: fx(hd.R), L: fx(hd.L) } : hd;
}
// the facing scale through a turn (from ±1 to ∓1): cos-shaped, sign flips at the middle
export const flipAt = (t, t0, d, from) => { const u = sineIO(span(t, t0, t0 + d)); return from * Math.cos(Math.PI * u); };

// ---------------------------------------------------------------------------------------------------------------- the law table (tread 4)
// a plain table with an oblique top (depth band like the treads); it pops up with the square (k) and folds down in c11. Things lie on it:
// o.sheet (the law sheet, 1 = lying), o.tablet 0..1 (your tablet laid down), o.papL / o.papR 0..1 (the two papers, slid on from the ends).
export function slab(ctx, cx, w, col, lift = 0, glow = 0) {
  const { y, dx, dy } = LAW, yy = y - 1 - lift, f = .55;
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(cx - w / 2, yy); ctx.lineTo(cx + w / 2, yy); ctx.lineTo(cx + w / 2 + dx * f, yy + dy * f); ctx.lineTo(cx - w / 2 + dx * f, yy + dy * f); ctx.closePath(); ctx.fill();
  if (glow > 0) halo(ctx, cx + 3, yy - 3, w * 1.3, .3 * glow, COOL.halo, COOL.core);
}
export function lawTable(ctx, t, k, o = {}) {
  if (k <= 0) return;
  const { x0, x1, y, dx, dy } = LAW, feet = Y4;
  ctx.save(); ctx.translate(0, feet); ctx.scale(1, k); ctx.translate(0, -feet);
  ctx.fillStyle = SIL(); ctx.fillRect(x0 + 5, y + 4, 5, feet - y - 4); ctx.fillRect(x1 - 10, y + 4, 5, feet - y - 4); ctx.fillRect(x0 + dx + 3, y + dy + 4, 4, feet - y - dy - 4);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.lineTo(x1 + dx, y + dy); ctx.lineTo(x0 + dx, y + dy); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(GOLD.line, .45); ctx.fillRect(x0, y - 1, x1 - x0, 1.5);
  ctx.fillStyle = SIL(); ctx.fillRect(x0, y, x1 - x0, 5);
  if (o.sheet) slab(ctx, LAW.cx, 30, PAPER.lit);
  if (o.tablet > 0) slab(ctx, LAW.cx + 24, 18, mixHex(P.night1, COOL.deep, .6), 0, .5 * o.tablet);
  if (o.papL > 0) slab(ctx, lerp(LAW.x0 - 30, LAW.x0 + 16, sineIO(o.papL)), 22, PAPER.body, 1);
  if (o.papR > 0) slab(ctx, lerp(LAW.x1 + 30, LAW.x1 - 14, sineIO(o.papR)), 22, PAPER.body, 1);
  ctx.restore();
}
// screen rect of a slab on the law table (for cards that grow out of it)
export function slabRect(c, cx, w) { const p = E.project(c, S.Z_LAND, cx - w / 2, LAW.y - 10), q = E.project(c, S.Z_LAND, cx + w / 2 + 6, LAW.y); return p && q ? { x: p[0], y: p[1], w: q[0] - p[0], h: q[1] - p[1] } : null; }

// ---------------------------------------------------------------------------------------------------------------- the top table (landing)
// S.weddingTable at the endScreen's place, plus THE PLACE CARD (blank) at its left end and the pen (o.pen = { x, y, ang } or null).
export function placeOnTop(ctx, t, o = {}) {
  F.placeCard(ctx, t, TOP.card, TOP.y, 24, { answer: 0, glow: o.glow ?? 0 });
  if (o.pen) pen(ctx, o.pen.x, o.pen.y, o.pen.ang ?? 0, o.pen.tip ?? 0);
}
export function topTable(ctx, t, o = {}) { S.weddingTable(ctx, t, TOP.x0, TOP.x1, TOP.y, { a: 1, lights: o.lights ?? 0 }); placeOnTop(ctx, t, o); }
export function pen(ctx, x, y, ang, tip = 0) {   // (x, y) = the nib; the pen points up-left along ang (rad from horizontal)
  const L = 20, c = Math.cos(ang), s = Math.sin(ang);
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = P.night0; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x - c * 2, y - s * 2); ctx.lineTo(x - c * L, y - s * L); ctx.stroke();
  ctx.strokeStyle = GOLD.body; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - c * 3, y - s * 3); ctx.stroke();
  if (tip > 0) halo(ctx, x, y, 14, .5 * tip, GOLD.halo, GOLD.core);
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- screen helpers
export function veilL(ctx, a, x1 = 1150) {   // a night veil from the left edge (explainers on the left, the world glides on the right)
  if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, x1, 0, [[0, rgba(P.night0, a)], [.55, rgba(P.night0, a * .8)], [1, rgba(P.night0, 0)]]); ctx.fillRect(0, 0, x1, H); ctx.restore();
}
// a card that grows out of a thing on screen: draw(ctx) paints the card in its target rect `to`; the transform maps it to a box between
// `from` (the thing) and `to` (uniform scale from the box centre). m 0 → 1 (sineIO inside).
export function grow(ctx, from, to, m, draw) {
  m = clamp(m); if (m <= 0 || !from) return;
  const e = sineIO(m), fx = from.x + from.w / 2, fy = from.y + from.h / 2, tx = to.x + to.w / 2, ty = to.y + to.h / 2, s = lerp(Math.max(from.w / to.w, from.h / to.h), 1, e);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(lerp(fx, tx, e), lerp(fy, ty, e)); ctx.scale(s, s); ctx.translate(-tx, -ty); draw(ctx, e); ctx.restore();
}
export function paperBox(ctx, r, rot = 0, night = false) {   // the card body (kit look: paper, soft drop shadow, edge)
  ctx.save(); ctx.translate(r.x + r.w / 2, r.y + r.h / 2); ctx.rotate(rot); ctx.translate(-r.w / 2, -r.h / 2);
  ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(6, 10, r.w, r.h, 8); ctx.fill();
  ctx.fillStyle = night ? mixHex(P.night1, P.ind2, .55) : lin(ctx, 0, 0, r.w, r.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(0, 0, r.w, r.h, night ? 12 : 6); ctx.fill();
  ctx.strokeStyle = night ? rgba(GOLD.line, .55) : rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}
export const inkBars = (ctx, x, y, w, n, gap, u, seed, col, lw = 6) => {   // unreadable written lines that write themselves (u 0..1 over all)
  const r = prng(seed);
  for (let i = 0; i < n; i++) {
    const ui = clamp(u * n - i), len = w * (.62 + .36 * r()); if (ui <= 0) { r(); continue; }
    const words = 3 + Math.floor(r() * 4); let xx = x; const yy = y + i * gap;
    ctx.fillStyle = col;
    for (let j = 0; j < words; j++) { const ww = len / words * (.55 + .4 * r()), vis = clamp((x + len * ui - xx) / ww); if (vis > 0) { ctx.beginPath(); ctx.roundRect(xx, yy - lw / 2, ww * vis, lw, lw / 2); ctx.fill(); } xx += len / words; }
    if (ui < 1) halo(ctx, x + len * ui, yy, 18, .5, GOLD.halo, GOLD.core);   // the nib
  }
};

// ================================================================================================================ c09
export default async (T, R) => {
  const B = b3(T), a = B.a;
  return [{ t: R.a, draw: scene(B, T), print: F.PRINT49 }];
};

// you in c09
function you09(t, a) {
  const x0 = S.STAGES[3].x0 + 400, x1 = 1538, xw = 1322;
  const w1 = span(t, a.soGet + .15, a.soGet + 1.25), reach = span(t, a.soGet + 1.25, a.give - .15), up = span(t, a.give - .15, a.give + .15);
  const w2 = span(t, a.give + .15, a.give + 1.9), tf = a.last + .1, w3 = span(t, tf + .4, tf + .7), cl = span(t, tf + .7, tf + 2.3);
  const w4 = span(t, tf + 2.3, tf + 2.95), lay = span(t, tf + 3.0, tf + 3.7);
  const hold = [.75, 2.35];
  if (t < a.soGet + .15) return { x: x0, y: Y3, o: { look: .2 + .14 * smooth(span(t, a.among, a.among + 1.4)) * (1 - smooth(span(t, a.fear, a.fear + 1.2))), back: .45, dir: -1 }, holding: 0 };
  if (w1 < 1) return { x: lerp(x0, x1, sineIO(w1)), y: Y3, o: { walk: w1 * 7, dir: -1, back: .4 }, holding: 0 };
  if (t < a.give - .15) { const r = F.bump(t, a.soGet + 1.25, a.give - a.soGet - 1.4); return { x: x1, y: Y3, o: { dir: -1, lean: .3 * r, armR: [lerp(.2, 1.0, r), lerp(.1, .45, r)], look: .1, back: .4 }, holding: reach > .55 ? 1 : 0 }; }
  if (w2 <= 0) return { x: x1, y: Y3, o: { dir: -1, armR: [lerp(.2, hold[0], sineIO(up)), lerp(.1, hold[1], sineIO(up))], look: .15, back: .4 }, holding: 1 };
  if (w2 < 1) return { x: lerp(x1, xw, sineIO(w2)), y: Y3, o: { walk: w2 * 11, dir: -1, armR: hold, back: .4 }, holding: 1 };
  if (t < tf + .4) {   // at the window: the result in your hand; you look at the screen, then up at the window's two stories
    const lk = .15 + .3 * smooth(span(t, a.protects + .3, a.protects + 1.6));
    if (t < tf) return { x: xw, y: Y3, o: { dir: -1, armR: hold, look: lk, back: .5 }, holding: 1 };
    return { x: xw, y: Y3, flip: flipAt(t, tf, .4, -1), o: { armR: hold, look: lk, back: .5 }, holding: 1 };
  }
  if (w3 < 1) return { x: lerp(xw, 1356, w3), y: Y3, o: { walk: w3 * 3, armR: hold }, holding: 1 };
  if (cl < 1) { const p = S.climbPos(4, cl); return { x: p.x, y: p.y, o: { walk: cl * 10, armR: hold }, holding: 1 }; }
  if (w4 < 1) return { x: lerp(1466, YOU_LAW, sineIO(w4)), y: Y4, o: { walk: w4 * 6, armR: hold }, holding: 1 };
  if (lay < 1) { const r = F.bump(t, tf + 3.0, .7); return { x: YOU_LAW, y: Y4, o: { lean: .22 * r, armR: [lerp(hold[0], .95, r), lerp(hold[1], .9, r)], look: .1 }, holding: lay < .5 ? 1 : 0, laying: lay }; }
  return { x: YOU_LAW, y: Y4, o: { look: .18 + .1 * smooth(span(t, a.biggest, a.biggest + 1.2)), back: .35 }, holding: 0 };
}

// the living room set (S.SETS[3] at u = 1, copied so that the tablet can leave the table and the window can run through one afternoon)
export function livingRoom(ctx, t, o) {
  const Sg = S.STAGES[3], y = Sg.y, k = clamp(o.k ?? 1); if (k <= 0) return;
  ctx.save(); ctx.translate(0, y); ctx.scale(1, k); ctx.translate(0, -y);   // the set folds down into its tread when you leave it (2.13)
  { // the window
    const wx = Sg.x0 + 20, wy = y - 170;
    windowView(ctx, t, wx, wy, 170, 120, o);
    ctx.strokeStyle = SIL(); ctx.lineWidth = 8; ctx.strokeRect(wx, wy, 170, 120); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(wx + 85, wy); ctx.lineTo(wx + 85, wy + 120); ctx.stroke();
  }
  { const tx = Sg.x0 + 250, ty = y - 120; ctx.fillStyle = P.night0; ctx.fillRect(tx, ty, 120, 72); ctx.fillRect(tx + 50, ty + 72, 20, 48);
    ctx.fillStyle = mixHex(P.night1, COOL.body, .7); ctx.fillRect(tx + 6, ty + 6, 108, 60); halo(ctx, tx + 60, ty + 36, 120, .25, COOL.halo, COOL.core);
    for (let i = 0; i < 3; i++) { const run = ((t * 18 + i * 50) % 140) - 20; ctx.fillStyle = rgba(COOL.core, .8); ctx.fillRect(tx + 12, ty + 14 + i * 16, Math.min(96, 50 + run * .3), 6); } }
  { const sx = Sg.x0 + 40; ctx.fillStyle = SIL(); ctx.beginPath(); ctx.roundRect(sx, y - 56, 170, 40, 10); ctx.fill(); ctx.fillRect(sx - 6, y - 76, 26, 76); ctx.fillRect(sx + 160, y - 76, 26, 76); ctx.fillRect(sx + 6, y - 16, 160, 16);
    ctx.fillRect(Sg.x0 + 230, y - 30, 120, 8); ctx.fillRect(Sg.x0 + 240, y - 22, 6, 22); ctx.fillRect(Sg.x0 + 338, y - 22, 6, 22);
    if (o.tabletOnTable) { ctx.fillStyle = mixHex(P.night1, COOL.deep, .5); ctx.fillRect(Sg.x0 + 268, y - 34, 40, 4); } }
  ctx.restore();
}
// the window to the world: night (as the set) → ONE AFTERNOON (warm) → evening (lamps on); the two stories rise in its panes (2.12)
function windowView(ctx, t, wx, wy, ww, wh, o) {
  const d = o.day ?? 0, e = o.eve ?? 0;
  const night = mixHex(P.ind0, P.blue0, .35);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  ctx.fillStyle = night; ctx.fillRect(wx, wy, ww, wh);
  const top = mixHex(mixHex(night, mixHex(GOLD.hot, P.blue1, .35), d), mixHex(P.ind1, '#3b2f6e', .5), e), bot = mixHex(mixHex(night, mixHex(GOLD.body, LAMP.body, .5), d), mixHex(GOLD.mid, P.ind1, .5), e);
  const k = Math.max(d, e);
  if (k > 0) { ctx.globalAlpha = k; ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, top], [1, bot]]); ctx.fillRect(wx, wy, ww, wh); ctx.globalAlpha = 1; }
  if (k > 0) { // the town as flat roofs (seen once the light is up)
    const r = prng(91); ctx.fillStyle = rgba(mixHex(P.ind2, P.night1, .5), .9 * k); let x = wx;
    while (x < wx + ww) { const bw = 14 + r() * 22, bh = 18 + r() * 34; ctx.fillRect(x, wy + wh - bh, bw - 2, bh); x += bw; }
  }
  const r = prng(33); for (let i = 0; i < 26; i++) { ctx.fillStyle = rgba(LAMP.body, (.4 + .4 * r()) * clamp(1 - d + e)); ctx.fillRect(wx + 8 + r() * 154, wy + 60 + r() * 52, 3, 3); }
  if (e > 0) { const q = prng(57); for (let i = 0; i < 18; i++) { const on = clamp(e * 3 - q() * 2); ctx.fillStyle = rgba(LAMP.core, .75 * on); ctx.fillRect(wx + 6 + q() * 158, wy + 74 + q() * 40, 3, 4); } }
  // 2.12 the two stories, each rising in its pane from below the sill
  const half = ww / 2;
  if (o.bill > 0) {   // left pane: the sales pitch, a billboard on two legs
    const k2 = expoOut(o.bill), by = wy + wh + 10 - 84 * k2, bx = wx + 5, bw = 56;
    ctx.fillStyle = SIL(); ctx.fillRect(bx + 12, by + 30, 4, 80); ctx.fillRect(bx + bw - 16, by + 30, 4, 80);
    ctx.fillStyle = mixHex(COOL.body, COOL.core, .4); ctx.fillRect(bx, by, bw, 32); halo(ctx, bx + bw / 2, by + 16, 70, .35 * k2, COOL.halo, COOL.core);
    E.glowText(ctx, F.SOURCES.soon, bx + bw / 2, by + 22, { size: 14, weight: 800, align: 'center', col: P.night0, glow: false });
  }
  if (o.shrug > 0) {   // right pane: the shrug, a figure in a lit window across the street
    const k2 = expoOut(o.shrug), px = wx + ww - 24, py = wy + wh + 6 + 70 * (1 - k2);
    halo(ctx, px, wy + wh - 40, 70, .3 * k2, GOLD.halo, LAMP.core);
    ctx.fillStyle = rgba(LAMP.body, .55 * k2); ctx.fillRect(wx + half + 10, wy + 24, half - 20, wh - 24);
    const sh = smooth(span(o.shrugArms ?? 0, 0, 1));
    E.person(ctx, px, py, 80, { dir: -1, light: .6, armR: [lerp(.2, .55, sh), lerp(.1, 2.3, sh)], armL: [lerp(-.2, -.55, sh), lerp(-.1, -2.3, sh)], look: .1 * sh });
  }
  ctx.restore();
}

// the tablet's screen (2.11), drawn in its target rect PANEL; e = growth (cards only show content once grown)
const PANEL = { x: 1120, y: 150, w: 700, h: 450 };
function tabletPanel(ctx, t, a, e) {
  const { x, y, w, h } = PANEL, b = 22;
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(x + 8, y + 12, w, h, 26); ctx.fill();
  ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(x, y, w, h, 26); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .5); ctx.lineWidth = 2; ctx.stroke();
  const sx = x + b, sy = y + b, sw = w - 2 * b, sh = h - 2 * b;
  ctx.fillStyle = lin(ctx, 0, sy, 0, sy + sh, [[0, mixHex(P.ind1, COOL.deep, .6)], [1, mixHex(P.night1, COOL.deep, .45)]]); ctx.fillRect(sx, sy, sw, sh);
  if (e < .7) return;
  const v = span(e, .7, 1);
  ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, sw, sh); ctx.clip(); ctx.globalAlpha *= v;
  // your old work: a timetable on paper, slid in from the left edge
  const pin = expoOut(span(t, a.task + .2, a.task + 1.2)), px = lerp(sx - 300, sx + 34, pin), py = sy + 40, pw = 250, ph = sh - 80;
  if (pin > 0) {
    ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 6); ctx.fill();
    ctx.fillStyle = mixHex(GOLD.deep, P.night1, .3); ctx.fillRect(px, py, pw, 26);
    ctx.fillStyle = rgba(PAPER.ink, .35); for (let i = 1; i < 4; i++) ctx.fillRect(px + i * pw / 4, py + 26, 1.5, ph - 26);
    inkBars(ctx, px + 18, py + 58, pw - 36, 7, 40, 1, 7, rgba(PAPER.ink, .55), 7);
  }
  // the machine's answer: rows that write themselves, then gold ticks where it shines, one red question mark where it is wrong
  const rx = sx + 330, ry = sy + 64, rows = 6, gap = 50;
  const wr = span(t, a.there - .1, a.there + 1.3);
  if (wr > 0) {
    halo(ctx, rx + 120, ry + 120, 300, .12, COOL.halo, COOL.core);
    inkBars(ctx, rx, ry, 230, rows, gap, wr, 21, rgba(COOL.core, .85), 8);
    for (let i = 0; i < rows; i++) {
      const cy = ry + i * gap, cx = rx + 270;
      if (i === 2) {
        const q = span(t, a.wrong + .05, a.wrong + .4); if (q <= 0) continue;
        halo(ctx, cx + 10, cy - 4, 46, .3 * q, '#e88a6a', '#ffd9c8');
        E.glowText(ctx, '?', cx + 10, cy + 14 + 18 * (1 - expoOut(q)), { size: 46, serif: true, align: 'center', col: RED, glow: false, a: expoOut(q) > .02 ? 1 : 0 });
      } else {
        const q = span(t, a.shines - .1 + (i > 2 ? i - 1 : i) * .14, a.shines + .25 + (i > 2 ? i - 1 : i) * .14); if (q <= 0) continue;
        F.goldSpan(ctx, [[cx - 6, cy - 2], [cx + 4, cy + 8], [cx + 26, cy - 16]], 0, smooth(q), { w: 3.2, spark: q < 1 });
      }
    }
  }
  ctx.restore();
}

// the law sheet (2.13/2.14) in its target rect: lines write themselves, the top line stays blank and catches a gold glint on 'blank'
const SHEET = { x: 250, y: 140, w: 600, h: 470 };
function lawSheet(ctx, t, a, e) {
  paperBox(ctx, SHEET, -.008);
  if (e < .7) return;
  const v = span(e, .7, 1), { x, y, w } = SHEET;
  ctx.save(); ctx.translate(x + w / 2, y + SHEET.h / 2); ctx.rotate(-.008); ctx.translate(-w / 2, -SHEET.h / 2); ctx.globalAlpha *= v;
  ctx.fillStyle = mixHex(GOLD.deep, P.night1, .35); ctx.fillRect(40, 34, 120, 6); ctx.fillRect(w - 160, 34, 120, 6);   // a letterhead rule
  const by = 112;   // the blank top line
  ctx.fillStyle = rgba(PAPER.faint, .6); ctx.fillRect(48, by, w - 96, 2);
  const gl = span(t, a.blank, a.blank + 1.4);
  if (gl > 0) {
    const gx = lerp(48, w - 48, sineIO(gl)); F.goldSpan(ctx, [[48, by], [w - 48, by]], 0, sineIO(gl), { w: 2.2, spark: gl < 1 });
    halo(ctx, gx, by, 90, .25 * Math.sin(Math.PI * gl), GOLD.halo, GOLD.core);
    const pulse = .5 + .5 * Math.sin((t - a.blank) * 2.2); if (gl >= 1) halo(ctx, w / 2, by, 260, .1 + .06 * pulse, GOLD.halo, GOLD.core);
  }
  inkBars(ctx, 48, by + 64, w - 96, 6, 44, span(t, a.written - .3, a.written + 2.5), 49, rgba(PAPER.ink, .62), 7);
  ctx.restore();
}

function scene(B, T) {
  const { a } = B;
  return (ctx, t) => {
    if (t < a.a0) { S.plateMachine(ctx, t, T); return; }
    const c = B.cam(t);
    const you = you09(t, a);
    const picked = t >= a.soGet + 1.25 + (a.give - a.soGet - 1.4) * .55;
    const day = smooth(span(t, a.afternoon - .4, a.afternoon + 1.4)) * (1 - smooth(span(t, a.there + .6, a.protects - .2)));
    const eve = smooth(span(t, a.there + .6, a.protects - .2));
    const tf = a.last + .1;
    const lawK = B.lawK(t), laid = you.laying != null ? span(you.laying, .5, .9) : t > tf + 3.7 ? 1 : 0;
    const sheetUp = span(t, a.rules - .1, a.rules + 1.7) * (1 - span(t, a.who + 1.7, a.who + 3.5));
    let hands = null;
    const st = {
      lit: B.lit(t), stage: picked ? [0, 0, 0, 0, B.stage(t)[4]] : B.stage(t), you: false,
      land: (cx) => {
        if (picked) livingRoom(cx, t, {
          tabletOnTable: false, day, eve, k: 1 - smooth(span(t, a.last + 1.0, a.last + 2.0)),
          bill: span(t, a.pitch - .5, a.pitch + .5) * (1 - span(t, a.last - .3, a.last + .7)),
          shrug: span(t, a.shrug - .45, a.shrug + .45) * (1 - span(t, a.last - .3, a.last + .7)), shrugArms: span(t, a.shrug, a.shrug + .5) * (1 - span(t, a.vague + .4, a.vague + 1)),
        });
        hands = figure(cx, you);
        if (you.holding && hands?.R) {   // the tablet in your hand (edge-on, its screen lights your coat)
          const [hx, hy] = hands.R, on = smooth(span(t, a.give - .2, a.give + .6));
          ctx.fillStyle = mixHex(P.night1, COOL.deep, .6); ctx.save(); ctx.translate(hx, hy); ctx.rotate(-.25); ctx.fillRect(-2, -14, 4.5, 22); ctx.restore();
          if (on > 0) halo(cx, hx - 4, hy - 4, 40, .32 * on, COOL.halo, COOL.core);
          const gold = smooth(span(t, a.shines, a.shines + 1)) * (1 - span(t, tf + .4, tf + 1.4));
          if (gold > 0) halo(cx, hx - 4, hy - 6, 34, .3 * gold, GOLD.halo, GOLD.core);
        }
        lawTable(cx, t, lawK, { sheet: sheetUp <= 0, tablet: laid });
      },
    };
    S.stairsWorld(ctx, c, t, st);
    // ---- 2.09 the Pew bars (screen, left, over a night veil; the room glides on the right)
    const vA = .64 * smooth(span(t, a.among - .3, a.among + 1.5)) * (1 - smooth(span(t, a.fear + .1, a.fear + 1.9)));
    veilL(ctx, vA);
    const out = 1 - span(t, a.fear - .2, a.fear + 1.3);
    const u1 = Math.min(span(t, a.expect - .3, a.expect + 1.6), out), u2 = Math.min(span(t, a.tried - .4, a.tried + 1.3), out);
    if (vA > .02) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      const hu = Math.min(span(t, a.among + .2, a.among + 1.1), out);
      F.goldText(ctx, [['AMERICANS OVER 65', .55]], 150, 236, 34, F.rise(hu), { serif: false, weight: 700, spacing: .08 });
      const [p0, p1] = F.SOURCES.pewBars, fmt = (v) => `${v} %`;
      F.bars(ctx, t, 150, 640, { items: [{ label: p0.label, v: p0.v, gold: 0 }], max: 40, h: 320, bw: 140, gap: 70, u: u1, fmt, size: 24, vsize: 64 });
      F.bars(ctx, t, 430, 640, { items: [{ label: p1.label, v: p1.v, gold: 1 }], max: 40, h: 320, bw: 140, gap: 70, u: u2, fmt, size: 24, vsize: 64 });
      ctx.restore();
    }
    F.source(ctx, t, a.among + 1.0, a.fear + .6, F.SOURCES.pew);
    // ---- 2.10 the untouched tablet catches a cool glint ('experience')
    if (!picked) { const p = E.project(c, S.Z_LAND, S.STAGES[3].x0 + 288, Y3 - 32), gl = F.bump(t, a.fear + 1.6, 1.4); if (p && gl > 0) halo(ctx, p[0], p[1], 60 * p[2] / 2.8, .35 * gl, COOL.halo, COOL.core); }
    // ---- 2.11 ★ the tablet's screen grows out of your hand and goes back
    const pm = span(t, a.task - .25, a.task + 1.55) * (1 - span(t, a.protects - .55, a.protects + 1.25));
    if (pm > 0 && hands?.R) {
      const p = E.project(c, S.Z_LAND, hands.R[0] - 4, hands.R[1] - 6);
      if (p) grow(ctx, { x: p[0] - 10 * p[2], y: p[1] - 14 * p[2], w: 20 * p[2], h: 28 * p[2] }, PANEL, pm, (cx, e) => tabletPanel(cx, t, a, e));
    }
    // ---- 2.12 NOT IN OUR LIFETIME over the right pane (the billboard carries SOON! itself)
    const lu = span(t, a.shrug + .1, a.shrug + .9) * (1 - span(t, a.last - .4, a.last + .3));
    if (lu > 0) { const p = E.project(c, S.Z_LAND, S.STAGES[3].x0 + 20 + 150, Y3 - 170 - 14); if (p) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.goldText(ctx, [[F.SOURCES.notLifetime, .5]], p[0], p[1], 30, F.rise(lu), { serif: false, weight: 700, spacing: .06, align: 'center' }); ctx.restore(); } }
    // ---- 2.13 / 2.14 the law sheet grows out of the table
    if (sheetUp > 0) grow(ctx, slabRect(c, LAW.cx, 30), SHEET, sheetUp, (cx, e) => lawSheet(cx, t, a, e));
    F.counter(ctx, t, T);
  };
}
