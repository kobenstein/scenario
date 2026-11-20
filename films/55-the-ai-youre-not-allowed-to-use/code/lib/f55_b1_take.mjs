// Film 55 · B1 (c02–c06) · ONE continuous take from plateLine ('At the very front stand') to plateFour ('Fourth in line stand').
// This module owns the shared part of B1: the phrase anchors, the ONE camera path, the world state (marks, groups, the door's
// leak and sign, the second door, the counter, the calendar tower) and the frame loop. The shots' explainers live in
// scenes/sc02.mjs … sc06.mjs (export over / floor / wall); every scene file draws the whole take, so inner chunk boundaries
// match frame for frame by construction. Plan: docs/shots.md 1.01–2.09 · world: docs/MOTION.md · kit: lib/f55_kit.mjs + f55_seams.mjs.
// Kit additions made LOCALLY here (wishes for the lead): a second door on the wall (door2), its carpet and halo; plateCamK (plateCam is
// not exported); defLook (a queuer's default look, so a group can ease back to the exact plate state); say/win text helpers.
import * as E from './f10_editorial.mjs';
import * as F from './f55_kit.mjs';
import * as S from './f55_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo, lin, rad } = E;
const { rise, maskLine, GOLD, CHECK, LAMP } = F;
export const PRINT = F.PRINT55;

export const L = S.LINE, D = L.door, YOU = L.you;
export const D2 = { x: D.x + 8200, w: 2600, h: 5200 };                    // the second door (OpenAI), same wall, right of the side door
export const COUNTER = { x: 10250, z: 14200, w: 1500, h: 200, d: 260 };   // the shop counter in front of door 2 (ASTRA, the empty place BEST)
export const STACK = { x: 700, z: 12900, s: 1500, th: 87 };               // the calendar tower (YEARS → 11 DAYS → 30 HOURS), left of the line
const F0 = 1700, TAU = Math.PI * 2;

// a plate camera with creep factor k (lib/f55_seams.mjs plateCam is module-private)
export const plateCamK = (P0, k) => S.look(P0[0] + S.TRUCK * (k - 1) / S.CREEP * P0[2] / F0, P0[1], P0[2], P0[3] * k, P0[4], P0[5], P0[6] ?? S.HZ);
// a queuer's default look (F.queuer draws look = .1 + r()*.2 with its 5th seeded random number when o.look is undefined)
const LOOKS = new Map();
export const defLook = (seed) => { if (!LOOKS.has(seed)) { const r = E.prng(seed); for (let i = 0; i < 4; i++) r(); LOOKS.set(seed, .1 + r() * .2); } return LOOKS.get(seed); };

// text helpers (screen space): win = in (rise) × out (sine sink); say = one masked line
export const win = (t, t0, t1, din = .5, dout = .5) => rise(span(t, t0, t0 + din)) * (1 - sineIO(span(t, t1 - dout, t1)));
let NOW = 0;   // the frame's time (screen-space explainers float with it: F.screenFloat)
export const floatNow = (ctx, k = 1) => F.screenFloat(ctx, NOW, k);
export function say(ctx, txt, x, y, size, u, o = {}) {
  if (u <= 0) return null;
  ctx.save(); F.screenFloat(ctx, NOW, o.float ?? 1); u = u * u;   // maskLine eases hard (expoOut): soften the first frames (no pop)
  const r = Array.isArray(txt) ? F.accentText(ctx, txt, x, y, size, u, { serif: o.serif ?? false, weight: 600, col: o.col ?? P.core0, acc: o.acc ?? CHECK, align: o.align, glow: o.glow ?? true })
    : maskLine(ctx, [[txt, 0]], x, y, size, u, { serif: o.serif ?? false, weight: 600, col: o.col ?? P.core0, glow: o.glow ?? true, align: o.align });
  ctx.restore(); return r;
}
// a sign over a door that changes: list [[tIn, text]…] → { text, u } (the old one sinks .5 s before the next rises)
export function signAt(t, list, tEnd = 1e9) {
  let cur = null;
  for (let i = 0; i < list.length; i++) {
    const [t0, text] = list[i], t1 = i + 1 < list.length ? list[i + 1][0] - .1 : tEnd;
    if (t >= t0 && t < t1) cur = { text, u: rise(span(t, t0, t0 + .6)) * (1 - sineIO(span(t, t1 - .5, t1))) };
  }
  return cur || { text: undefined, u: 0 };
}

// ---------------------------------------------------------------------------------------------------------------- anchors (phrases only)
export function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after);
  const a = {};
  a.T0 = G('At the very front stand'); a.built = G('built it', a.T0);
  a.there = G('There, machines'); a.fermat = G("Fermat's", a.there); a.computer = G('a computer can check', a.there); a.step = G('every step', a.there);
  a.expected = G('That work was expected'); a.years = G('years', a.expected); a.eleven = G('eleven days', a.expected); a.fall = G('this fall', a.expected); a.thirty = G('thirty hours', a.expected);
  a.labIs = G('The lab is Anthropic'); a.anth = G('Anthropic', a.labIs); a.numbers = G('the numbers are', a.labIs); a.public = G('first proof is public', a.labIs); a.anyone = G('anyone can run', a.labIs); a.checkE = T.GE('run the check', 0, a.labIs);
  a.machine = G('And the machine that wrote'); a.cant = G("You can't use it", a.machine); a.internal = G('internal research model', a.machine);
  a.second = G('A second lab'); a.openai = G('OpenAI', a.second); a.strongest = G('strongest public', a.second); a.astra = G('Astra', a.second); a.pay = G('pay to use', a.second); a.stage = G('On stage', a.second); a.after = G('the one after it', a.second);
  const A1 = T.clip('A1'); a.A1 = A1.start; a.A1e = A1.end;
  a.inspector = G('So ask what an inspector'); a.who = G('Who checked it from outside', a.inspector); a.some = G('Some mathematicians', a.inspector); a.inPart = G('in part', a.inspector); a.locked = G('stays locked', a.inspector);
  a.worth = G('And both labs are worth'); a.further = G('further ahead', a.worth); a.reported = G('Anthropic reported', a.worth); a.oneDay = G('one day before', a.worth); a.pitching = G('pitching', a.worth);
  a.still = G('Still, two things'); a.real = G('real mathematics', a.still); a.holding = G('holding one back', a.still); a.finance = G('Its finance chief', a.still);
  a.notHidden = G('So the best A.I. is not hidden'); a.announced = G('announced', a.notHidden); a.access = G('is the access', a.notHidden); a.evidence = G('some of the evidence', a.notHidden);
  a.lives = G('But a lab lives'); a.why = G('So why keep', a.lives); a.bestP = G('best product', a.lives); a.shelf = G('off the shelf', a.lives);
  a.ask = G('Ask either lab'); a.safety = G('safety', a.ask); a.clearest = G('The clearest case', a.ask); a.spring = G('this spring', a.ask); a.decades = G('decades-old', a.ask);
  a.stranger = G('It let a stranger'); a.crash = G('crash', a.stranger); a.across = G('across the world', a.stranger); a.connecting = G('connecting', a.stranger);
  a.found = G('The A.I. that found it'); a.mythos = G('Mythos', a.found); a.noPlan = G('no plan', a.found); a.instead = G('Instead', a.found); a.chose = G('chose who goes in', a.found);
  a.second2 = G('Second in line'); a.gov = G('The government', a.second2); a.test = G('may test', a.second2); a.release = G('before release', a.second2); a.volunteers = G('volunteers', a.second2);
  a.third = G('Third come the giants'); a.giants = G('giants', a.third); a.apple = G('Apple', a.third); a.google = G('Google', a.third); a.microsoft = G('Microsoft', a.third); a.jpm = G('JPMorgan', a.third); a.notYou = G('Not you', a.third); a.notYet = G('Not yet', a.third);
  a.butSafety = G('But safety is not all'); a.leaked = G('Leaked files', a.butSafety); a.costly = G('costly', a.butSafety); a.altman = G('And Sam Altman has named', a.butSafety);
  const C1 = T.clip('C1'); a.C1 = C1.start; a.C1e = C1.end;
  a.headStart = G('A head start is worth'); a.computing = G('computing power', a.headStart);
  a.buys = G('So a closed door buys'); a.whoElse = G('Who else gets', a.buys);
  a.T1 = G('Fourth in line stand'); a.seam1 = a.T1 - S.SEAM_HALF;
  return a;
}

// ---------------------------------------------------------------------------------------------------------------- cameras (world)
const M = (i) => S.markPt(i);
export const CAM = {
  lab: S.look(2560, 110, 13300, 6.6, 660, 846),                          // 1.01 mark 1: the people who built it, against the leaf
  tapeA: S.look(D.x + 600, 2600, D.z, 1.42, 1300, 560),                  // 1.02 the gap, the tape out of it, room for the words left
  tapeB: S.look(D.x + 620, 2600, D.z, 1.5, 1300, 560),
  tower: S.look(STACK.x + 1500, 3500, STACK.z, .95, 980, 520),           // 1.03 ★ the calendar tower as tall as the door
  towerM: S.look(STACK.x + 1100, 1700, STACK.z, 1.45, 960, 560),
  towerL: S.look(STACK.x + 900, 1050, STACK.z, 1.75, 900, 600),
  doorW: S.look(D.x + 300, 4200, D.z, 1.05, 1420, 520),                  // 1.04 the door with its sign, the tape at the gap
  doorW2: S.look(D.x + 300, 3900, D.z, .98, 1400, 540),                 // 1.05 the leak narrows
  truck: S.look(D.x + 4600, 2600, D.z, 1.05, 960, 540),                  // 1.06 along the wall (the side door passes)
  d2: S.look(11050, 1500, 14500, 1.75, 900, 560),                        // 1.06 door 2, the counter, ASTRA
  d2close: S.look(COUNTER.x + 150, 260, COUNTER.z, 4.2, 960, 640),         // 1.06 ASTRA on the counter, PAID
  d2b: S.look(11300, 1800, 14600, 1.55, 1000, 560),                       // 1.06 the crack, the shadow behind
  d2c: S.look(12000, 2300, D.z, 1.3, 1560, 560),                         // 1.07/1.08 door 2 right, the card / clipboard left
  both: S.look(D.x + 4100, 2700, D.z, .7, 1330, 600),                   // 1.09–1.11 both doors, room for the board left
  both2: S.look(D.x + 4100, 3200, D.z, .72, 960, 430),                   // 1.12 both doors like shop windows, the words below
  bothC: S.look(D.x + 4100, 2700, D.z, .78, 960, 560),                   // 2.01 both doors: SAFETY
  shelf: S.look(COUNTER.x + 200, 260, COUNTER.z, 5.0, 960, 660),          // 1.13 the shelf with the empty place
  shelf2: S.look(COUNTER.x + 420, 260, COUNTER.z, 5.6, 960, 660),
  doorA: S.look(D.x, 3600, D.z, 1.5, 960, 520),                          // 2.01–2.02 the glimpse (as in the hook)
  doorA2: S.look(D.x, 3600, D.z, 1.56, 960, 520),
  list: S.look(D.x + 300, 4200, D.z, 1.05, 1420, 520),                     // 2.03 MYTHOS over the door, the list out of the gap
  m2: S.look(M(1).x, 120, M(1).z, 3.2, 900, 790),                        // 2.04 mark 2: the government
  m3: S.look(M(2).x, 120, M(2).z, 2.6, 1040, 800),                       // 2.05 mark 3: the giants
  back: S.look(1300, 0, 6600, .66, 1000, 720, 520),                      // 2.05 NOT YOU. NOT YET. (you bottom left)
  side: S.look(D.x - 700, 3200, D.z, 1.3, 1420, 520),                    // 2.06 the door from the side (the wall's side face), the glimpse left
  side2: S.look(D.x - 650, 3200, D.z, 1.36, 1420, 520),
  above: S.look(1100, 0, 8000, .4, 960, 434, -841),                       // 2.09 THE LINE FROM ABOVE (a raised camera: door top, you bottom)
  above2: S.look(1080, 0, 7900, .415, 960, 440, -800),
};
const PL = (k) => plateCamK(S.LINE_P, k);
export function keys(a) {
  return [
    [a.T0 - .5, PL(1)], [a.T0 + .5, PL(1.03)],
    [a.there - .1, CAM.lab],
    [a.fermat - .2, CAM.tapeA], [a.expected - .3, CAM.tapeB],
    [a.years + .9, CAM.tower], [a.eleven - .2, S.look(STACK.x + 1480, 3400, STACK.z, .97, 980, 520)],
    [a.eleven + 1.2, CAM.towerM], [a.thirty + 1.0, S.look(STACK.x + 1060, 1650, STACK.z, 1.5, 960, 560)],
    [a.labIs + 1.9, CAM.doorW], [a.machine + .1, S.look(D.x + 300, 4100, D.z, 1.03, 1415, 520)],
    [a.cant + 1.2, CAM.doorW2], [a.second + .3, S.look(D.x + 400, 3850, D.z, .97, 1380, 540)],
    [a.openai + 1.0, CAM.truck], [a.strongest + .3, CAM.d2], [a.astra + .7, CAM.d2close], [a.stage - .6, S.look(COUNTER.x + 190, 260, COUNTER.z, 4.35, 960, 640)], [a.stage + 1.8, CAM.d2b], [a.after + .4, S.look(11300, 1800, 14600, 1.6, 1000, 560)],
    [a.A1 + 1.2, CAM.d2c], [a.inspector + .2, S.look(12000, 2300, D.z, 1.33, 1450, 560)], [a.worth + .2, S.look(12000, 2300, D.z, 1.36, 1450, 560)],
    [a.further + 1.0, CAM.both], [a.notHidden - .2, S.look(D.x + 4100, 2700, D.z, .72, 1330, 600)], [a.notHidden + 1.4, CAM.both2], [a.lives + .2, S.look(D.x + 4100, 3200, D.z, .76, 960, 440)],
    [a.why + .6, CAM.shelf], [a.shelf + .9, CAM.shelf2],
    [a.safety - .5, CAM.bothC], [a.clearest + .3, S.look(D.x + 4000, 2700, D.z, .8, 960, 560)],
    [a.decades + .4, CAM.doorA], [a.found, CAM.doorA2],
    [a.mythos + .5, CAM.list], [a.chose + .6, S.look(D.x + 300, 4200, D.z, 1.09, 1420, 520)],
    [a.gov + .3, CAM.m2], [a.volunteers + .3, S.look(M(1).x, 120, M(1).z, 3.35, 900, 790)],
    [a.giants + .9, CAM.m3], [a.jpm + .2, S.look(M(2).x, 120, M(2).z, 2.72, 1040, 800)],
    [a.notYou + 1.4, CAM.back], [a.butSafety + .2, S.look(1300, 0, 6600, .68, 1000, 720, 520)],
    [a.leaked + .4, CAM.side], [a.C1 + .5, CAM.side2], [a.buys - .2, S.look(D.x - 620, 3200, D.z, 1.4, 1420, 520)],
    [a.buys + 2.4, CAM.above], [a.whoElse + .3, CAM.above2],
    [a.seam1, S.FOUR_CAM],
  ];
}

// ---------------------------------------------------------------------------------------------------------------- world things (B1)
// door 2 (local units on the wall's front face: origin = door 1's threshold centre), its halo, an optional dark shadow behind its crack
function drawDoor2(ctx, t, o) {
  const x = D2.x - D.x, g = o.gap;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, x, -D2.h * .55, D2.w * 1.5, [[0, rgba(GOLD.halo, .12 * g)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(x - D2.w * 1.5, -D2.h * 1.4, D2.w * 3, D2.h * 1.4); ctx.restore();
  const r = F.door(ctx, t, x, 0, D2.w, D2.h, { gap: g, open: o.open, sign: o.sign, signU: o.signU });
  if (r && o.open > .005 && o.shadow > 0) {   // the bigger machine behind the crack: a dark rhomb, seen only through the opening
    ctx.save(); ctx.beginPath(); ctx.rect(r.lock, r.top, r.x1 - r.lock, D2.h); ctx.clip();
    const cx = r.lock + D2.w * .16, cy = -D2.h * .46, hw = D2.w * .5, hh = D2.h * .42;
    ctx.globalAlpha = o.shadow; ctx.fillStyle = mixHex(P.night1, GOLD.deep, .28);
    ctx.beginPath(); ctx.moveTo(cx, cy - hh); ctx.lineTo(cx + hw, cy); ctx.lineTo(cx, cy + hh); ctx.lineTo(cx - hw, cy); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(GOLD.core, .5); ctx.lineWidth = 14; ctx.stroke();
    ctx.restore();
  }
}
// the gold carpet in front of door 2 (screen space; painted, never added)
function door2Carpet(ctx, c, g) {
  const zA = D.z, zN = Math.max(c.z + 90, D.z - 5200), q = [S.proj(c, D2.x - D2.w * .5, 0, zA), S.proj(c, D2.x + D2.w * .5, 0, zA), S.proj(c, D2.x + D2.w * .1, 0, zN), S.proj(c, D2.x - D2.w * 1.6, 0, zN)];
  if (q.some((v) => !v)) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, q[0][1], 0, Math.max(q[2][1], q[0][1] + 30), [[0, rgba(mixHex(GOLD.body, GOLD.halo, .5), .26 * g)], [.3, rgba(GOLD.halo, .1 * g)], [1, rgba(GOLD.halo, 0)]]);
  ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill(); ctx.restore();
}
// is door 2 (with its halo and carpet) anywhere in frame for camera c?
export function door2Visible(c) {
  const pts = [[D2.x - D2.w * 1.6, D2.h * 1.4, D.z], [D2.x + D2.w * 1.6, D2.h * 1.4, D.z], [D2.x - D2.w * 1.6, 0, D.z], [D2.x + D2.w * 1.6, 0, D.z], [D2.x - D2.w * 1.6, 0, Math.max(c.z + 90, D.z - 5200)], [D2.x + D2.w * .1, 0, Math.max(c.z + 90, D.z - 5200)]];
  const ps = pts.map((p) => S.proj(c, ...p)).filter(Boolean); if (!ps.length) return false;
  const x0 = Math.min(...ps.map((p) => p[0])), x1 = Math.max(...ps.map((p) => p[0])), y0 = Math.min(...ps.map((p) => p[1])), y1 = Math.max(...ps.map((p) => p[1]));
  return x1 > -40 && x0 < W + 40 && y1 > -40 && y0 < H + 40;
}
// the counter (a long display block in front of door 2) in world units at its floor centre: dim cores, ASTRA, the empty place
export function counter(ctx, t, c, o) {
  S.at(ctx, c, COUNTER.x, COUNTER.z, (k) => {
    const w = COUNTER.w, h = COUNTER.h;
    ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.ellipse(-120, 6, w * .62, 40, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, mixHex(P.ind2, GOLD.deep, .25)], [1, mixHex(P.night1, P.ind1, .4)]]); ctx.fillRect(-w / 2, -h, w, h);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .45); ctx.beginPath(); ctx.moveTo(-w / 2, -h); ctx.lineTo(w / 2, -h); ctx.lineTo(w / 2 + 60, -h - 34); ctx.lineTo(-w / 2 + 60, -h - 34); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(GOLD.line, .35); ctx.fillRect(-w / 2, -h, w, 4);
    if (o.draw) o.draw(ctx, k, w, h);
  });
}
// the calendar tower: n sheets (float), the top sheet shows top/sub; bottom on the floor (world units, local y up negative)
export function tower(ctx, t, n, top, sub, o = {}) {
  if (n <= 0) return;
  const s = STACK.s, th = STACK.th, edges = Math.min(60, n), y = -(s * 1.12 + Math.max(0, edges - 1) * th);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(-s * .1, 4, s * .75, s * .05, 0, 0, TAU); ctx.fill();
  F.calStack(ctx, t, 0, y, s, edges, top, sub, { thick: th / (s * .012), dim: o.dim ?? .35 });   // dim: the door-tall cream pad was the brightest thing in c02
  ctx.restore();
  return y;
}

// ---------------------------------------------------------------------------------------------------------------- world state
// marks: plateLine has all lit 1; plateFour has mark 4 lit 1, the others .3. In between each mark lights on its phrase.
function markLit(a, t, i) {
  const base = lerp(1, .3, sineIO(span(t, a.T0 + .6, a.T0 + 3.2)));
  const pulse = (t0, t1) => rise(span(t, t0, t0 + .6)) * (1 - sineIO(span(t, t1, t1 + 1.2)));
  let v = base;
  if (i === 0) v = Math.max(v, .85 * pulse(a.T0, a.there + .4));
  if (i === 1) v = Math.max(v, pulse(a.gov - .2, a.third), .9 * pulse(a.whoElse + .1, a.seam1 - 1.6));
  if (i === 2) v = Math.max(v, pulse(a.giants - .2, a.butSafety), .9 * pulse(a.whoElse + .5, a.seam1 - 1.6));
  if (i === 3) v = Math.max(v, rise(span(t, a.whoElse + .9, a.whoElse + 1.5)));
  return v;
}
function personState(a, t, k, q) {
  let w = 0, target = .3;
  if (q.st === 0) { w = rise(span(t, a.T0 + 1, a.T0 + 2.5)) * (1 - sineIO(span(t, a.fermat, a.fermat + 1.5))); target = .45; }
  if (q.st === 1) { w = rise(span(t, a.gov, a.gov + 1)) * (1 - sineIO(span(t, a.third + .5, a.third + 2))); target = .42; }
  if (q.st === 2) { w = rise(span(t, a.giants - .2, a.giants + .9)) * (1 - sineIO(span(t, a.butSafety, a.butSafety + 1.5))); target = .38; }
  if (q.st === 3) { w = rise(span(t, a.whoElse + .9, a.seam1 - .4)); target = .35; if (t >= a.seam1 - .4) return { look: .35 }; }
  if (w <= 0) return {};
  return { look: lerp(defLook(q.seed), target, w) };
}

// ---------------------------------------------------------------------------------------------------------------- the frame loop
let LAYERS = null;
const BREATH = .05;   // the breathing push: ±5 % of the distance to the door plane
export async function take(T) {
  E.prepareEditorial();
  if (!LAYERS) LAYERS = await Promise.all(['sc02', 'sc03', 'sc04', 'sc05', 'sc06'].map((n) => import(new URL(`../scenes/${n}.mjs`, import.meta.url).href)));
  const a = anchors(T), K = keys(a);
  const cam = (t) => { const dA = rise(span(t, a.T0 + .5, a.T0 + 2.2)) * (1 - sineIO(span(t, a.seam1 - 2.4, a.seam1 - .1))); const c = S.camPath(t, K); const dist = Math.max(1500, D.z - c.z), d = S.drift(c, t, dist, 2.6 * dA, 155); d.z += dist * BREATH * dA * E.drift(t * .8, 1, 7); return d; };   // + a slow breathing push (never a frozen hold)
  // door 2 exists only while it can't pop: it appears once it is out of frame after the plate, vanishes once it has left the frame for good
  const fps = 30; let d2On = null, d2Off = null;
  for (let f = Math.ceil((a.T0 + .5) * fps); f / fps < a.second; f++) { if (!door2Visible(cam(f / fps))) { d2On = f / fps; break; } }
  for (let f = Math.floor(a.seam1 * fps); f / fps > a.whoElse; f--) { if (door2Visible(cam(f / fps))) { d2Off = (f + 1) / fps; break; } }
  if (d2On == null) { console.warn('[b1] door 2 never leaves the frame early; it will pop'); d2On = a.there; }
  if (d2Off == null) d2Off = a.whoElse;
  if (d2Off >= a.seam1) console.warn('[b1] door 2 still visible at the seam');
  a.d2On = d2On; a.d2Off = d2Off;
  const X = { a, T, S, F, E, cam };
  return (ctx, t) => {
    if (t < a.T0 + S.SEAM_HALF) { S.plateLine(ctx, t, T); return; }      // the seam in: exactly what c01 hands over
    if (t >= a.seam1) { S.plateFour(ctx, t, T); return; }                // the seam out: exactly what c07 grows from
    const c = cam(t); X.c = c; X.t = t; NOW = t;
    // the leak of door 1: narrows on "You can't use it", grows back with the price tags (1.09)
    const gap1 = 1 - .55 * sineIO(span(t, a.cant, a.cant + 1.3)) * (1 - sineIO(span(t, a.second + 1, a.astra))) - .2 * clamp(span(t, a.astra, a.astra + .1)) * (1 - sineIO(span(t, a.worth + .8, a.further + .8)));
    const sign1 = signAt(t, [[a.anth - .1, 'ANTHROPIC'], [a.safety - .05, 'SAFETY'], [a.mythos - .05, 'MYTHOS']], a.whoElse - .2);
    const d2 = t >= d2On && t < d2Off;
    const g2 = d2 ? .62 + .38 * sineIO(span(t, a.openai - .4, a.openai + .9)) - .3 * sineIO(span(t, a.inspector, a.locked + .8)) * (1 - sineIO(span(t, a.worth + .8, a.further + .8))) : 0;
    const open2 = .3 * sineIO(span(t, a.stage + 1.2, a.after + .6)) * (1 - sineIO(span(t, a.locked - .1, a.locked + 1.1)));
    const sign2 = signAt(t, [[a.openai - .1, 'OPENAI'], [a.safety - .05, 'SAFETY']], a.found + 2);
    const youLook = lerp(.85, .55, sineIO(span(t, a.T0 + 2, a.there))) + .3 * rise(span(t, a.notYou - .4, a.notYou + .6)) * (1 - sineIO(span(t, a.butSafety, a.leaked)));
    const st = {
      gap: gap1, sign: sign1.text, signU: sign1.u,
      mark: (i) => ({ lit: markLit(a, t, i) }),
      person: (k, q) => personState(a, t, k, q),
      you: { o: { look: youLook } },
      wall: (cx, k) => {
        if (d2) drawDoor2(cx, t, { gap: g2, open: open2, shadow: 1, sign: sign2.text, signU: sign2.u });
        for (const Ly of LAYERS) if (Ly.wall) Ly.wall(cx, t, X, k);
      },
      floor: (cx) => {
        if (d2) door2Carpet(cx, c, g2);
        for (const Ly of LAYERS) if (Ly.floor) Ly.floor(cx, t, X);
      },
    };
    X.d2 = d2; X.g2 = g2;
    S.lineWorld(ctx, c, t, st);
    for (const Ly of LAYERS) if (Ly.over) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); Ly.over(ctx, t, X); ctx.restore(); }
  };
}
// a scene file's default export: the whole take, entered at its own chunk start
export const entry = (T, R) => take(T).then((draw) => [{ t: R.a, draw, print: PRINT }]);
