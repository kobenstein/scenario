// Film 41 · c08 · B3 · 'Take the jury' → 'Ask who decides' (docs/shots.md 7.01–7.17)
// A locked-frame motion-design sequence: one graphic per sentence on the stage, joined by carriers (no cut, no crossfade):
//   7.01 out of plateJury the JURY line lifts off the list and unfolds into the rail of a jury box; twelve empty chairs rise behind it
//   7.02 ★ a gold spark drops from the rail into a pool of light: you, tiny, back view, before the twelve chairs (the box pushes in)
//   7.03 a cyan scale draws itself up out of the floor and weighs a stream of papers in a blur: FASTER
//   7.04 the scale folds back into the floor; the twelve chairs fill with amber people one by one: STILL WANT PEOPLE?
//   7.05 the box folds back into its rail, the rail flies home into the list (which rises around it) and turns solid gold: A RULE
//   7.06 the list steps aside, the ground line runs out of its foot and THE TOWER of 100 windows rises from it; guesses 10/50/90 %
//   7.07 ★ 40 windows turn gold floor by floor, the counter IS the number of gold windows; “In a very extreme form of it” (AXIOS)
//   7.08 the ceiling line draws across at 40; the gold pushes once against it and recoils: “But that’s as high as I can get.”
//   7.09 the 60 above dim: OFF THE LIST; your window pulses: MAYBE YOURS
//   7.10 your window lifts out of the tower and flips into a paper card: IN HIS ESSAY · 7.11 C4 the quote card, words lit as read
//   7.12 the card's two questions slide out as open boxes, a third draws itself: STILL OPEN
//   7.14 the boxes fold into the list's empty lines; one line wobbles under small pushing and pulling hands: HARD TO DRAW · LOBBYING
//   7.15 wage bars on CHILD CARE and TEACHING stop short of WELL PAID · 7.16 UNWRITTEN · HARD TO DRAW · TOO SHORT (the list steps
//   aside, the tower of 100 jobs rises behind it as a ghost, taller than the list) · 7.17 WHY DOES IT MATTER? → c09 lights the tower.
// The tower, the side list and the c08 → c09 hand-over are exported for sc09 (same owner).
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER, PAPER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ======================================================================================================================== THE TOWER
// An office tower at night with exactly 100 windows (10 floors × 10), one window = one job. Row 0 = the bottom floor.
export const TW = { cx: 860, base: 880, s: 34, px: 44, py: 60, cols: 10, rows: 10 };
export const winXY = (i, g = TW) => { const c = i % g.cols, r = Math.floor(i / g.cols); return [g.cx + (c - (g.cols - 1) / 2) * g.px, g.base - 56 - r * g.py]; };
export const winIdx = (r, c) => r * 10 + c;
export const YOU_W = winIdx(6, 5);                            // your window (above the 40 % ceiling; a leftover in c09)
export const TVAR = (() => { const r = E.prng(4808); return Array.from({ length: 100 }, () => .55 + .45 * r()); })();
const TOP = TW.base - 56 - 9 * TW.py - TW.s / 2 - 40;        // the roof line
// o: { rise 0..1 (the tower builds up from the ground line), a, ghost 0..1 (a faint outline tower: windows dim), win(i) → tile options,
//      ground 0..1 (the ground line drawn from the left) }. Returns the roof y.
export function tower(ctx, t, o = {}) {
  const g = TW, a = o.a ?? 1, rise = clamp(o.rise ?? 1), ghost = clamp(o.ghost ?? 0); if (a <= 0) return;
  const x0 = g.cx - 240, x1 = g.cx + 240, yTop = lerp(g.base, 140, sineIO(rise));
  ctx.save(); ctx.globalAlpha *= a;
  // the ground line
  const gu = clamp(o.ground ?? 1);
  if (gu > 0) { ctx.strokeStyle = rgba(CREAM, .28); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, g.base); ctx.lineTo(lerp(80, 1840, sineIO(gu)), g.base); ctx.stroke(); }
  if (rise > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, yTop, W, g.base - yTop); ctx.clip();
    // neighbours: two dark low blocks (no windows: only the tower counts)
    ctx.fillStyle = mixHex(P.night1, P.ind1, .35); ctx.fillRect(x0 - 150, g.base - 300, 130, 300); ctx.fillRect(x1 + 30, g.base - 380, 150, 380);
    ctx.fillStyle = mixHex(P.night1, P.ind1, .55); ctx.fillRect(x0 - 90, g.base - 200, 80, 200);
    // the body + its crown + an antenna (a slow red-free warning light: a soft amber pulse)
    halo(ctx, g.cx, g.base - 340, 520, .1 * (1 - (o.haloG ?? ghost)), P.blue0, P.ind1);
    ctx.fillStyle = lin(ctx, 0, TOP, 0, g.base, [[0, mixHex(P.ind2, P.blue1, .3)], [1, mixHex(P.night1, P.ind1, .3)]]);
    ctx.fillRect(x0, TOP, x1 - x0, g.base - TOP); ctx.fillRect(g.cx - 150, TOP - 38, 300, 40);
    ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, rgba(P.halo2, .16)], [.08, rgba(P.halo2, 0)], [.9, rgba(P.night0, 0)], [1, rgba(P.night0, .35)]]); ctx.fillRect(x0, TOP, x1 - x0, g.base - TOP);
    ctx.strokeStyle = rgba(CREAM2, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(g.cx + 40, TOP - 38); ctx.lineTo(g.cx + 40, TOP - 110); ctx.stroke();
    halo(ctx, g.cx + 40, TOP - 112, 16, .5 + .3 * Math.sin(t * 1.4), AMBER.body, AMBER.core);
    ctx.fillStyle = rgba(P.night0, .5); for (let r = 1; r < 10; r++) ctx.fillRect(x0 + 8, g.base - 56 - r * g.py + g.py / 2 - 1, x1 - x0 - 16, 2);
    ctx.restore();
    // the windows: each lights a moment after the rising edge passes it
    for (let i = 0; i < 100; i++) {
      const [x, y] = winXY(i), on = span(yTop, y + 30, y - 10); if (on <= 0) continue;
      const w = o.win ? o.win(i) : {};
      F.tile(ctx, t, x, y, g.s, { v: TVAR[i], ...w, dim: Math.max(w.dim ?? 0, ghost * .72), a: (w.a ?? 1) * smooth(on) });
      if (o.after) o.after(i, x, y, smooth(on));
    }
  }
  ctx.restore();
  return yTop;
}
// the list standing beside the tower (c08 7.06 → c09)
export const SIDE = { x: 110, y: 330, w: 300, h: 520, n: 7 };
export const SIDE_LINES = ['CHILD CARE', 'JURY', 'ART', 'TEACHING'];
// a moving hold across the c08 → c09 boundary: a slow push about the tower and back (zero at both ends, so nothing else has to match)
export const towerPush = (T) => { const A = T.G('too short', 0, T.G('So the list is unwritten')) + .6, B = T.G('Ask who decides') + 1.75; return (t) => 1 + .03 * Math.sin(Math.PI * sineIO(span(t, A, B))); };
export const pushAbout = (ctx, z, cx = TW.cx, cy = 560) => { ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); };
export const lineOf = (b, i, n = 7) => ({ x0: b.x + b.w * .11, x1: b.x + b.w * .89, y: b.y + b.h * .25 + b.h * .7 * (i + .5) / n });
// the hands that push and pull line 4 (7.14): their offsets drive the wobble (cause → effect)
export const WOB_HANDS = [{ q: .2, up: 1, ph: 0 }, { q: .5, up: -1, ph: 1.9 }, { q: .82, up: 1, ph: 3.4 }];
export const wobD = (t, A) => WOB_HANDS.map((h) => h.up * (14 + 10 * Math.sin(t * 2.3 + h.ph)) * A * Math.sin(Math.PI * (.5 + .5 * Math.sin(t * 1.7 + h.ph))));
// THE LIST of c08/c09 (HUMAN RESERVED with CHILD CARE · JURY · ART · TEACHING; JURY is the thick solid gold line, A RULE).
// b = box; o: { u (rise), glow, a, juryW, juryHalo, wobA (line 4 wobbles; undefined = no wobble line), open 0..1 (lines 4–6 glow: unwritten) }
export function sideList(ctx, t, b, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return;
  const sc = b.w / 480;
  F.list(ctx, t, b.x, b.y, b.w, b.h, { n: 7, u, a, glow: o.glow ?? 1, lines: SIDE_LINES.map((s, i) => ({ text: s, gold: .6, u: i === 1 ? 0 : 1 })) });
  ctx.save(); ctx.globalAlpha *= a;
  const J = lineOf(b, 1), dj = o.juryFull ? 1 : sineIO(span(u, .35, .75));
  if (dj > 0 && o.juryDrawn !== false) {
    F.goldSpan(ctx, [[J.x0, J.y], [J.x1, J.y]], 0, dj, { w: (o.juryW ?? 3.2) * Math.sqrt(sc), spark: false });
    if ((o.juryHalo ?? 0) > 0) halo(ctx, (J.x0 + J.x1) / 2, J.y, 200 * sc, o.juryHalo, GOLD.halo, GOLD.core);
    F.goldText(ctx, [['JURY', .8]], J.x0 + 4, J.y - 12 * sc, Math.max(22, 26 * sc), o.juryFull ? 1 : F.rise(span(u, .4, .9)), { serif: false, weight: 600, spacing: .05 });
  }
  const op = clamp(o.open ?? 0);
  if (op > 0) for (let i = 4; i < 7; i++) { const L = lineOf(b, i), p = .5 + .5 * Math.sin(t * 2.4 + i); halo(ctx, (L.x0 + L.x1) / 2, L.y, b.w * .35, .2 * op * p, GOLD.halo, GOLD.core);
    if (i > 4) F.goldSpan(ctx, [[L.x0, L.y], [L.x1, L.y]], 0, 1, { w: 2.6 * Math.sqrt(sc), spark: false, a: op * (.4 + .4 * p) }); }
  if (o.wobA != null) {
    const L = lineOf(b, 4), d = wobD(t, o.wobA), pts = [];
    for (let x = L.x0; x <= L.x1 + .1; x += 4) { let dy = 0; WOB_HANDS.forEach((h, j) => { dy += d[j] * sc * Math.exp(-(((x - lerp(L.x0, L.x1, h.q)) / ((L.x1 - L.x0) * .13)) ** 2)); }); pts.push([x, L.y + dy]); }
    F.goldSpan(ctx, pts, 0, sineIO(span(u, .5, .9)), { w: 3.4 * Math.sqrt(sc), spark: false, a: .5 + .5 * Math.max(clamp(o.wobA), op) });
  }
  ctx.restore();
}
// an empty chair glyph (local centre x, y, size s): back + seat + legs (for cold windows and empty seats)
export function chairGlyph(ctx, x, y, s, col, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col;
  ctx.beginPath(); ctx.roundRect(x - s * .28, y - s * .42, s * .56, s * .42, s * .06); ctx.fill();
  ctx.fillRect(x - s * .34, y + s * .02, s * .68, s * .12); ctx.fillRect(x - s * .3, y + s * .14, s * .08, s * .28); ctx.fillRect(x + s * .22, y + s * .14, s * .08, s * .28);
  ctx.restore();
}
// outlined heavy caps (a question that has lost its weight): same metrics as F.heavy
export function outlineHeavy(ctx, s, x, y, size, a, o = {}) {
  if (a <= 0) return; const cond = .86, w = F.textW(ctx, s, size), x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `${size}px "Inter Black"`; ctx.translate(x0, y); ctx.scale(cond, 1);
  ctx.strokeStyle = rgba(o.col ?? CREAM, .75); ctx.lineWidth = 2; ctx.strokeText(s, 0, 0); ctx.restore();
}

// ======================================================================================================================== THE JURY BOX
const RAIL = { y: 600, x0: 500, x1: 1420 };
const CHAIRS = (() => { const out = []; for (let row = 0; row < 2; row++) for (let c = 0; c < 6; c++) out.push({ row, c, x: 960 + (c - 2.5) * 150 + (row ? 38 : -38), y: row ? 592 : 476, s: row ? 106 : 92 }); return out; })();
function chair(ctx, t, ch, u, lit) {   // a juror's chair seen from the front: an arched high back, a lit seat edge
  if (u <= 0) return;
  const { x, s } = ch, y = ch.y + (1 - expoOut(u)) * 160, back = mixHex(P.night1, P.ind2, ch.row ? .75 : .5);
  const bw = s * .78, top = y - s * 1.2, bot = y - s * .34;
  const shape = () => { ctx.beginPath(); ctx.moveTo(x - bw / 2, bot); ctx.lineTo(x - bw / 2, top + bw * .32); ctx.quadraticCurveTo(x - bw / 2, top, x, top); ctx.quadraticCurveTo(x + bw / 2, top, x + bw / 2, top + bw * .32); ctx.lineTo(x + bw / 2, bot); ctx.closePath(); };
  ctx.save(); ctx.translate(7, 9); shape(); ctx.fillStyle = rgba(P.night0, .45); ctx.fill(); ctx.restore();
  shape(); ctx.fillStyle = lin(ctx, 0, top, 0, bot, [[0, mixHex(back, P.blue1, .45)], [.6, back], [1, mixHex(back, P.night0, .3)]]); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(CREAM2, GOLD.line, lit), .3 + .45 * lit); ctx.lineWidth = 2; ctx.stroke();
  ctx.save(); shape(); ctx.clip(); ctx.fillStyle = rgba(P.night0, .25); ctx.fillRect(x - bw * .3, top + bw * .25, bw * .6, bot - top - bw * .35); ctx.restore();   // the cushion
  ctx.fillStyle = lin(ctx, 0, y - s * .38, 0, y - s * .24, [[0, mixHex(back, P.blue1, .6)], [1, mixHex(back, P.night0, .4)]]); ctx.beginPath(); ctx.roundRect(x - s * .5, y - s * .38, s, s * .14, s * .04); ctx.fill();
  ctx.fillStyle = mixHex(back, P.night0, .5); ctx.fillRect(x - s * .42, y - s * .24, s * .07, s * .22); ctx.fillRect(x + s * .35, y - s * .24, s * .07, s * .22);
}
function juror(ctx, t, ch, u) {   // a seated person in amber light, rising into the chair from behind the seat
  if (u <= 0) return;
  const { x, s } = ch, k = expoOut(u), y = ch.y - s * .3, br = .012 * Math.sin(t * 1.1 + x);
  ctx.save(); ctx.beginPath(); ctx.rect(x - s, y - s * 2, s * 2, s * 2); ctx.clip();
  ctx.translate(x, y + (1 - k) * s * 1.1); ctx.scale(1, 1 + br);
  halo(ctx, 0, -s * .5, s * .9, .25 * k, AMBER.body, AMBER.core);
  ctx.fillStyle = lin(ctx, 0, -s * .7, 0, 0, [[0, AMBER.hot], [1, mixHex(AMBER.body, AMBER.shade, .45)]]);
  ctx.beginPath(); ctx.moveTo(-s * .36, 0); ctx.bezierCurveTo(-s * .36, -s * .42, -s * .24, -s * .52, 0, -s * .52); ctx.bezierCurveTo(s * .24, -s * .52, s * .36, -s * .42, s * .36, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(AMBER.body, AMBER.shade, .2); ctx.beginPath(); ctx.arc(0, -s * .72, s * .16, 0, TAU); ctx.fill();
  ctx.restore();
}
// the cyan scale (the machine weighing the evidence): a post drawn up out of the floor, a beam, two pans; papers stream through
function cyanScale(ctx, t, x, floor, u, tilt, papers) {
  if (u <= 0) return;
  const py = floor - 230 * sineIO(clamp(u * 1.8)), hw = 150 * smooth(span(u, .35, .8)), d = 82 * span(u, .55, 1), ang = tilt * .3;
  const ln = (pts, w, al = 1) => { ctx.strokeStyle = rgba(MACH.body, al); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); };
  halo(ctx, x, py, 160, .22 * u, MACH.halo, MACH.core);
  ln([[x, floor], [x, py]], 5);
  ctx.fillStyle = MACH.body; ctx.beginPath(); ctx.ellipse(x, floor, 46 * u, 7, 0, 0, TAU); ctx.fill();
  if (hw <= 0) return;
  const ex = Math.cos(ang) * hw, ey = Math.sin(ang) * hw, L = [x - ex, py - ey], R = [x + ex, py + ey];
  ln([L, R], 5); ctx.fillStyle = MACH.core; ctx.beginPath(); ctx.arc(x, py, 9, 0, TAU); ctx.fill();
  const pans = [];
  for (const p of [L, R]) { if (d <= 0) continue; ln([p, [p[0] - 40, p[1] + d]], 2, .8); ln([p, [p[0] + 40, p[1] + d]], 2, .8); ln([[p[0] - 52, p[1] + d], [p[0] + 52, p[1] + d]], 5); pans.push([p[0], p[1] + d]); }
  if (pans.length === 2 && papers) papers(pans);
}

// a spaced caps label that rises behind its mask (goldText measures the letter spacing; F.label's mask clips spaced text)
export const lab = (ctx, s, x, y, u, o = {}) => { const v = Math.min(clamp(u), 1 - clamp(o.out ?? 0)); if (v <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; F.goldText(ctx, [[s, o.gold ?? 0]], x, y, o.size ?? 24, F.rise(v), { serif: false, weight: 600, spacing: o.spacing ?? .12, col: o.col ?? CREAM2, align: o.align }); ctx.restore(); };
const wrapN = (text, size, wmax) => { let n = 1, cur = []; for (const wd of text.split(/\s+/)) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), size, true) > wmax) { n++; cur = [wd]; } else cur = nx; } return n; };
// ======================================================================================================================== THE SCENE
export default (T, R) => {
  const G = (p, after = R.a - .01) => T.G(p, 0, after);
  const k = {};
  k.take = R.a; k.P0 = R.a + S.SEAM_HALF;
  k.imag = G('Imagine the verdict'); k.verdict = G('verdict', k.imag); k.about = G('about you', k.imag); k.you = G('you', k.about + .05);
  k.mach = G('A machine might weigh'); k.weigh = G('weigh', k.mach); k.evid = G('evidence', k.mach); k.faster = G('faster', k.mach);
  k.would = G('Would you still want'); k.still = G('still', k.would); k.want = G('want', k.would); k.people = G('people', k.would); k.decide = G('decide', k.would);
  k.hr = G('Human Reserved would turn'); k.answer = G('answer', k.hr); k.rule = G('rule', k.hr);
  k.howLong = G('How long could such'); k.list = G('list get', k.howLong); k.guess = G('Take a guess', k.howLong);
  k.ceil = G('His own ceiling'); k.ceilW = G('ceiling', k.ceil); k.very = G('very extreme', k.ceil); k.form = G('form', k.very); k.forty = G('forty percent', k.ceil); k.pct = G('percent', k.forty);
  k.reservedW = G('reserved for humans', k.ceil); k.atFirst = G('at first', k.ceil);
  k.high = G('And that, he says'); k.asHigh = G('as high', k.high); k.canGet = G('can get', k.high);
  k.gen = G('So even at its most generous'); k.leaves = G('leaves most jobs', k.gen); k.offW = G('off', k.leaves); k.maybe = G('Maybe yours', k.gen); k.yours = G('yours', k.maybe);
  k.which = G('Which ones make it'); k.essay = G('In his essay', k.which); k.asks = G('asks that himself', k.essay);
  const C4 = T.clip('C4');
  k.acct = G('By his own account'); k.qs = G('those questions', k.acct); k.open = G('still open', k.acct); k.third = G('a third', k.acct); k.how = G('how to keep companies', k.acct); k.anyway = G('anyway', k.how);
  k.critics = G('Critics add'); k.lineW = G('a line like this', k.critics); k.hard = G('hard to draw', k.critics); k.lobby = G('lobbying', k.critics);
  k.resv = G("And reserved doesn't"); k.wellPaid = G('well paid', k.resv); k.care = G('Care work', k.resv); k.teach = G('teaching', k.care);
  k.unw = G('So the list is unwritten'); k.unwW = G('unwritten', k.unw); k.hard2 = G('Hard to draw', k.unw); k.short = G('too short', k.unw);
  k.why = G('Why does it matter'); k.matter = G('matter', k.why);
  const END = R.b;

  // ------------------------------------------------------------------ 7.01–7.05 the jury box
  const L0 = S.JURY_LIST, juryLine = lineOf(L0, 1);
  const creepK = (t) => { const d = t - (k.take - S.SEAM_HALF); return d < 1 ? 1 + S.CREEP * d : 1 + S.CREEP * (1 + .6 * (1 - Math.exp(-(d - 1) / .6))); };
  const zx = (x, t) => L0.x + L0.w / 2 + (x - (L0.x + L0.w / 2)) * creepK(t);        // the creep zoom about the plate's centre (x only: line 1 sits on its y)
  const lift = (t) => quartIO(span(t, k.P0, k.P0 + .85));
  const fold = (t) => quartIO(span(t, k.hr - .05, k.hr + .85));                        // 7.05: the box folds back into its rail
  function railLine(t) {   // the JURY line: list line → rail of the box → back into the list (solid gold)
    const a = lift(t), f = fold(t);
    let x0 = lerp(zx(juryLine.x0, t), RAIL.x0, a), x1 = lerp(zx(juryLine.x1, t), RAIL.x1, a), y = lerp(juryLine.y, RAIL.y, a) - 70 * Math.sin(Math.PI * a);
    x0 = lerp(x0, juryLine.x0, f); x1 = lerp(x1, juryLine.x1, f); y = lerp(y, juryLine.y, f) - 40 * Math.sin(Math.PI * f);   // home: line 1 of the list (L0)
    return { x0, x1, y };
  }
  const boxPush = (t) => 1 + .07 * sineIO(span(t, k.imag, k.hr)) ;
  function juryBox(ctx, t) {
    if (t < k.P0 || t > k.hr + 1.2) return;
    const f = fold(t), rl = railLine(t), push = boxPush(t);
    ctx.save();
    // the box: scales about the rail centre; in the fold it squashes into the rail (y → 0) and follows it home
    const cx = (RAIL.x0 + RAIL.x1) / 2;
    ctx.translate((rl.x0 + rl.x1) / 2, rl.y); ctx.scale(lerp(push, (rl.x1 - rl.x0) / (RAIL.x1 - RAIL.x0), f), lerp(push, .02, f)); ctx.translate(-cx, -RAIL.y);
    if (f < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - span(f, .6, 1);
      ctx.beginPath(); ctx.rect(0, 0, W, RAIL.y); ctx.clip();
      const order = [...CHAIRS].map((c, i) => ({ c, i, d: Math.abs(c.c - 2.5) * .04 + (c.row ? .06 : 0) }));
      for (const { c, d } of order.sort((p, q) => p.c.row - q.c.row)) {
        const u = span(t, k.P0 + .55 + d, k.P0 + 1.25 + d);
        const ji = c.row * 6 + c.c, jt = k.still + .02 + ji * .12;   // 7.04: one by one, reading order
        chair(ctx, t, c, u, span(t, jt, jt + .4));
        juror(ctx, t, c, span(t, jt, jt + .5));
      }
      ctx.restore();
      // the box front: a dark panel under the rail
      ctx.fillStyle = lin(ctx, 0, RAIL.y, 0, RAIL.y + 90, [[0, mixHex(P.ind1, P.night1, .4)], [1, rgba(P.night0, 0)]]);
      ctx.globalAlpha *= span(t, k.P0 + .4, k.P0 + .9) * (1 - f);
      ctx.fillRect(RAIL.x0, RAIL.y, RAIL.x1 - RAIL.x0, 90);
    }
    ctx.restore();
  }
  const juryW = (t) => lerp(3.2, 7, span(t, k.rule - .2, k.rule + .3));
  const juryHalo = (t) => .3 * span(t, k.rule - .2, k.rule + .3) + .25 * bumpT(t, k.rule - .1, .8);
  function railDraw(ctx, t) {   // the travelling JURY line (7.01 → 7.05); once home, sideList draws it
    if (t < k.P0 || t >= k.hr + .85) return;
    const rl = railLine(t), a = lift(t), f = fold(t), kz = creepK(t) * (1 - a) + a;
    F.goldSpan(ctx, [[rl.x0, rl.y], [rl.x1, rl.y]], 0, 1, { w: juryW(t), spark: false });
    F.goldText(ctx, [['JURY', .8]], rl.x0 + 4, rl.y - 12 * lerp(kz, 1, f), 26 * lerp(kz, lerp(1.15, 1, f), Math.max(a, f)), 1, { serif: false, weight: 600, spacing: .05 });
  }
  // 7.02 the pool of light and you (back view)
  const POOL = [960, 900];
  function you(ctx, t) {
    if (t < k.imag - .1 || t > k.hr + .9) return;
    const drop = sineIO(span(t, k.imag - .05, k.imag + .4)), pool = expoOut(span(t, k.imag + .3, k.imag + 1.0)), up = expoOut(span(t, k.imag + .45, k.imag + 1.15));
    const out = expoIn(span(t, k.hr - .25, k.hr + .45));
    // the spark: from the rail's centre down to the floor
    if (drop < 1 && drop > 0) { const y = lerp(RAIL.y + 4, POOL[1], drop); halo(ctx, POOL[0], y, 40, .8, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(POOL[0], y, 6, 0, TAU); ctx.fill(); }
    ctx.save(); ctx.translate(0, 220 * out);
    if (pool > 0) {
      ctx.fillStyle = lin(ctx, 0, RAIL.y + 90, 0, POOL[1], [[0, rgba(GOLD.hot, 0)], [1, rgba(GOLD.hot, .1 * pool * (1 - out))]]);
      ctx.beginPath(); ctx.moveTo(POOL[0] - 40, RAIL.y + 90); ctx.lineTo(POOL[0] + 40, RAIL.y + 90); ctx.lineTo(POOL[0] + 200 * pool, POOL[1]); ctx.lineTo(POOL[0] - 200 * pool, POOL[1]); ctx.closePath(); ctx.fill();
      halo(ctx, POOL[0], POOL[1] - 60, 260 * pool, .35 * (1 - out), AMBER.body, AMBER.core);
      ctx.fillStyle = lin(ctx, POOL[0] - 200, 0, POOL[0] + 200, 0, [[0, rgba(GOLD.body, 0)], [.5, rgba(GOLD.hot, .55 * (1 - out))], [1, rgba(GOLD.body, 0)]]);
      ctx.beginPath(); ctx.ellipse(POOL[0], POOL[1], 210 * pool, 26 * pool, 0, 0, TAU); ctx.fill();
    }
    if (up > 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, POOL[1] + 2); ctx.clip();
      E.du(ctx, POOL[0], POOL[1] + (1 - up) * 150, 118, { view: 'back', back: .55, look: .35 + .1 * Math.sin(t * .7) });
      ctx.restore();
    }
    ctx.restore();
  }
  // 7.03 the scale
  function scale(ctx, t) {
    const u = span(t, k.mach - .1, k.mach + .9) * (1 - span(t, k.would - .25, k.would + .5)); if (u <= 0) return;
    const wob = span(t, k.weigh - .1, k.faster + .5), tilt = .9 * Math.sin(wob * 26) * Math.sin(Math.PI * wob);
    cyanScale(ctx, t, 330, 840, u, tilt, (pans) => {
      // papers: a stack in the left pan; one after another they flick over to the right pan (an arc, three smear copies)
      const n = 11, t0 = k.weigh - .05, dt = (k.faster + .35 - t0) / n;
      for (let i = 0; i < n; i++) {
        const q = span(t, t0 + i * dt, t0 + (i + 1.4) * dt), a0 = pans[0], a1 = pans[1];
        const pos = (qq) => [lerp(a0[0], a1[0], qq), lerp(a0[1] - 10 - (n - i) * 3, a1[1] - 10 - i * 3, qq) - 120 * Math.sin(Math.PI * qq)];
        for (let s = q > 0 && q < 1 ? 3 : 0; s >= 0; s--) {
          const [px, py] = pos(clamp(q - s * .06)); ctx.fillStyle = rgba(mixHex(PAPER.lit, MACH.hot, .35), s ? .18 : .95);
          ctx.save(); ctx.translate(px, py); ctx.rotate(.4 * Math.sin(Math.PI * q) + i * .03); ctx.fillRect(-30, -4, 60, 7); ctx.restore();
        }
      }
    });
    F.heavy(ctx, 'FASTER', 330, 430, 60, span(t, k.faster - .25, k.faster + .3), { align: 'center', col: MACH.hot, out: span(t, k.would - .3, k.would + .1) });
  }

  // ------------------------------------------------------------------ 7.01 / 7.05 the list (big, centre) → 7.06 the side list → 7.10 out → 7.14 centre → 7.16 side
  const toSide = (t) => quartIO(span(t, k.howLong - .2, k.howLong + .9));
  const listOut = (t) => expoIn(span(t, k.which + .05, k.essay + .25));                    // 7.10: it sinks with the tower
  const reRise = (t) => sineIO(span(t, k.critics - .25, k.critics + .75));                  // 7.14: it rises again at the centre
  const toSide2 = (t) => quartIO(span(t, k.short - .45, k.short + .55));                    // 7.16: it steps aside (too short)
  const MID = { x: 760, y: 150, w: 400, h: 680 };
  const mixB = (p, q, u) => ({ x: lerp(p.x, q.x, u), y: lerp(p.y, q.y, u), w: lerp(p.w, q.w, u), h: lerp(p.h, q.h, u) });
  const phaseC = (t) => t > k.critics - .5;
  function listBox(t) { return phaseC(t) ? mixB(MID, SIDE, toSide2(t)) : mixB(L0, SIDE, toSide(t)); }
  const wobA = (t) => span(t, k.lineW - .1, k.lineW + .6) * (1 - .75 * span(t, k.resv - .2, k.resv + .6)) + .5 * bumpT(t, k.hard2 - .1, 1.2);
  const openU = (t) => span(t, k.unwW - .15, k.unwW + .35) * (1 - .6 * span(t, k.hard2 - .2, k.hard2 + .4));
  function bigList(ctx, t) {
    if (t < k.P0) return;
    if (t < k.hr) {   // 7.01: the plate's list sinks away under the lifting JURY line (its own JURY word drops behind its mask)
      const out = expoIn(span(t, k.P0 + .05, k.P0 + .75)); if (out >= 1) return;
      ctx.save(); ctx.translate(0, 700 * out); ctx.globalAlpha *= 1 - out;
      const kz = creepK(t), cx = L0.x + L0.w / 2, cy = L0.y + L0.h * .4; ctx.translate(cx, cy); ctx.scale(kz, kz); ctx.translate(-cx, -cy);
      F.list(ctx, t, L0.x, L0.y, L0.w, L0.h, { n: 7, lines: S.JURY_LINES.map((s, i) => ({ text: s, gold: .8, u: i === 1 ? 1 - span(t, k.P0, k.P0 + .25) : 1 })), lit: 1 });
      ctx.restore();
      return;
    }
    const b = listBox(t);
    if (!phaseC(t)) {   // 7.05 the list rises around its returning JURY line · 7.06 steps aside · 7.10 sinks with the tower
      const out = listOut(t); if (out >= 1) return;
      ctx.save(); ctx.translate(0, 700 * out);
      sideList(ctx, t, b, { u: sineIO(span(t, k.hr + .45, k.hr + 1.35)), a: 1 - out, glow: 1 - .4 * toSide(t), juryW: juryW(t), juryHalo: juryHalo(t), juryDrawn: t >= k.hr + .85, juryFull: true });
      ctx.restore();
    } else sideList(ctx, t, b, { u: reRise(t), glow: .6 + .4 * (1 - toSide2(t)), juryW: 4, wobA: t > k.lineW - .3 ? wobA(t) : 0, open: openU(t) });
  }

  // ------------------------------------------------------------------ 7.06–7.10 the tower
  const towerRise = (t) => sineIO(span(t, k.howLong + .25, k.list + .9));
  const goldN = (t) => 40 * sineIO(span(t, k.ceilW - .1, k.pct + .35));                   // the gold fill IS the counter
  const ceilU = (t) => sineIO(span(t, k.high - .05, k.asHigh));
  const push = (t) => bumpT(t, k.asHigh + .05, .55);                                        // the gold pushes once against the ceiling
  const CEIL_Y = winXY(winIdx(3, 0))[1] - TW.py / 2;
  const offU = (t) => span(t, k.leaves, k.offW + .4);
  const youLift = (t) => expoOut(span(t, k.which, k.which + .7));
  const flip = (t) => sineIO(span(t, k.essay - .1, k.essay + .72));   // lands exactly on the quote card's frame before quote() takes over
  const towerOut = (t) => expoIn(span(t, k.which + .1, k.essay + .3));
  const ghostRise = (t) => span(t, k.short - .3, k.short + .9);
  function towerWin(t) {
    const n = goldN(t), off = offU(t), ps = push(t);
    return (i) => {
      const r = Math.floor(i / 10), o = {};
      if (i < 40) { o.gold = smooth(clamp(n - i)); o.glyph = 'person'; o.ga = o.gold * .8; o.lift = .5 * o.gold * bumpT(t, k.ceilW + i / 40 * (k.pct - k.ceilW), .5); }
      else { o.dim = .45 * off; if (r === 4) { o.gold = .35 * ps; o.flash = 0; } }
      if (i === YOU_W) { o.glyph = 'you'; o.ga = span(t, k.maybe - .4, k.maybe + .1); o.dim = o.dim * (1 - o.ga); o.lift = .9 * o.ga * (.6 + .4 * Math.sin(t * 3.2)); if (t > k.which) o.a = 0; }
      return o;
    };
  }
  function towerScene(ctx, t) {
    if (t < k.howLong) return;
    // first life: 7.06–7.10 (sinks away under the flying window) · second life: 7.16 the ghost of 100 jobs rises behind the list
    const first = t < k.essay + .6, gr = ghostRise(t);
    if (first) {
      const out = towerOut(t);
      ctx.save(); ctx.translate(0, 700 * out); ctx.globalAlpha *= 1 - out;
      tower(ctx, t, { rise: towerRise(t), ground: span(t, k.howLong, k.howLong + .7), win: towerWin(t) });
      // the ceiling line (7.08): draws from the left across the tower at 40; it bows up when the gold pushes, recoils
      const cu = ceilU(t);
      if (cu > 0) {
        const bow = 14 * push(t), pts = []; for (let x = TW.cx - 300; x <= TW.cx + 300; x += 12) pts.push([x, CEIL_Y - bow * Math.exp(-(((x - TW.cx) / 160) ** 2))]);
        F.goldSpan(ctx, pts, 0, cu, { w: 4 });
        lab(ctx, 'CEILING', TW.cx - 300, CEIL_Y - 16, span(t, k.asHigh, k.asHigh + .5), { size: 22, col: GOLD.text });
      }
      ctx.restore();
    } else if (gr > 0) {
      const g = sineIO(gr);
      tower(ctx, t, { rise: g, ghost: 1, ground: 1, win: () => ({}) });
    }
  }
  function towerWords(ctx, t) {
    if (t < k.howLong - .3 || t > k.essay + 1) return;
    const X = 1190, out = k.which - .1;
    // 7.06
    F.say(ctx, t, [['HOW', k.howLong], ['LONG', k.howLong + .22], ['COULD', k.howLong + .5], ['IT', k.howLong + .7], ['GET?', k.list + .3]], X, 250, { size: 52, out: k.ceil - .8 });
    lab(ctx, '1 WINDOW = 1 JOB · 100 JOBS', X, 860, span(t, k.list, k.list + .6), { size: 22, out: span(t, k.ceil - .3, k.ceil + .1) });
    SRC.guesses.forEach((g, i) => {   // the guesses hover at their heights (10 · 50 · 90 floors of 100 windows)
      const f = [1, 5, 9][i], y = TW.base - 56 - (f - .5) * TW.py + 4 * Math.sin(t * 1.3 + i * 2), u = span(t, k.guess + i * .18, k.guess + .5 + i * .18), o = span(t, k.ceil - .2 + i * .05, k.ceil + .2 + i * .05);
      if (u <= 0 || o >= 1) return;
      ctx.save(); ctx.globalAlpha *= 1 - o; ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(TW.cx + 250, y); ctx.lineTo(TW.cx + 250 + 60 * expoOut(u), y); ctx.stroke(); ctx.restore();
      F.heavy(ctx, g, TW.cx + 330, y + 16, 44, u, { serif: true, col: CREAM, out: o });
    });
    // 7.07 his ceiling
    F.say(ctx, t, [['HIS', k.ceil], ['OWN', k.ceil + .28], ['CEILING', k.ceilW]], X, 250, { size: 52, gold: [2], out: k.gen - .2 });
    F.say(ctx, t, [['“In', k.very - .3], ['a', k.very - .15], ['very', k.very], ['extreme', k.very + .43], ['form', k.form], ['of', k.form + .2], ['it”', k.form + .35]], X, 340, { serif: true, size: 46, out: k.gen - .25 });
    // the counter crossfades between neighbouring numbers (a hard digit swap at 150 px read as a pop on a calm frame)
    const gn = goldN(t), n0 = Math.floor(gn), fr = smooth(clamp((gn - n0 - .3) / .4)), cu = span(t, k.ceilW - .2, k.ceilW + .3), jolt = -14 * push(t);
    if (cu > 0) [[n0, 1 - fr * fr], [Math.min(40, n0 + 1), 1 - (1 - fr) ** 2]].forEach(([n, a], j) => { if (a > .01 && (j === 0 || n > n0)) F.heavy(ctx, `${n}%`, X - 6 + F.textW(ctx, '40%', 150, { serif: true }), 600 + jolt, 150, cu, { serif: true, align: 'right', a, gold: .85 + .15 * span(n, 39, 40), out: span(t, out, out + .4) }); });
    lab(ctx, 'OF JOBS RESERVED FOR HUMANS', X, 648, span(t, k.reservedW - .1, k.reservedW + .5), { size: 24, col: CREAM, out: span(t, out + .05, out + .45) });
    lab(ctx, 'AT FIRST', X, 684, span(t, k.atFirst - .1, k.atFirst + .4), { size: 24, out: span(t, out + .1, out + .5) });
    lab(ctx, SRC.fortySrc, X, 860, span(t, k.pct, k.pct + .6), { size: 22, out: span(t, out, out + .4) });
    // 7.08 the ceiling quote (verbatim, in quotation marks)
    F.say(ctx, t, [['“But', k.asHigh - .35], ['that’s', k.asHigh - .2], ['as', k.asHigh], ['high', k.asHigh + .14], ['as', k.asHigh + .5], ['I', k.canGet - .15], ['can', k.canGet], ['get.”', k.canGet + .14]], X, 782, { serif: true, size: 44, gold: [3], out });
    // 7.09 off the list, maybe yours
    F.say(ctx, t, [['60', k.leaves + .1], ['OF', k.leaves + .25], ['100:', k.leaves + .4], ['OFF', k.offW], ['THE', k.offW + .1], ['LIST', k.offW + .2]], X, 250, { size: 52, out });
    const [yx, yy] = winXY(YOU_W), mu = span(t, k.maybe - .2, k.yours + .3);
    if (mu > 0 && t < k.which + .2) {
      F.goldSpan(ctx, [[yx + 22, yy], [yx + 120, yy - 40], [X - 16, yy - 40]], 0, sineIO(mu) * (1 - span(t, k.which - .2, k.which + .2)), { w: 1.6 });
    }
    F.say(ctx, t, [['MAYBE', k.maybe], ['YOURS', k.yours]], X, yy - 24, { size: 52, gold: [1], out });
  }
  // 7.10 your window lifts out of the tower and flips into a paper card (the C4 card)
  const CARD = (() => { const w = 1320, size = 64, lines = wrapN(SRC.k1.join(' '), size, w - 108), h = 64 + lines * size * 1.22 + 92; return { x: (W - w) / 2, y: Math.round(H / 2 - h / 2 - 40), w, size, h }; })();
  const CARD_TEXT = SRC.k1.join(' ');
  const CARD_HEAD = 'GATESNOTES · “THE TURBULENT AI ERA IS HERE”';
  function flyCard(ctx, t) {
    if (t < k.which || t > k.essay + 1.2) return;
    const [wx, wy] = winXY(YOU_W), l = youLift(t), f = flip(t);
    const cx = lerp(wx, CARD.x + CARD.w / 2, sineIO(span(f, 0, 1))), cy = lerp(wy - 40 * l, CARD.y + CARD.h / 2, sineIO(span(f, 0, 1))) - 60 * Math.sin(Math.PI * f);
    const w0 = TW.s * lerp(1, 2.4, l), w = Math.exp(lerp(Math.log(w0), Math.log(CARD.w), f)), h = Math.exp(lerp(Math.log(w0), Math.log(CARD.h), f));
    const sx = Math.abs(Math.cos(Math.PI * f)) * (f < .5 ? 1 : 1), front = f < .5;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.006 * f); ctx.scale(Math.max(.02, sx), 1);
    if (front) F.tile(ctx, t, 0, 0, w, { glyph: 'you', ga: 1, lift: .9 });
    else { ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.roundRect(-w / 2 + 6, -h / 2 + 10, w, h, 10); ctx.fill();
      ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 6); ctx.fill();
      ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.stroke(); }
    ctx.restore();
  }
  // 7.11 the quote card (C4), 7.12 its questions slide out into open boxes
  const cardPush = (t) => { const u = span(t, k.essay + .5, k.acct + .5); return 1 + .1 * (u - (1 - smooth(clamp(u * 16))) * u); };   // a steady push from the card's landing (eased in), so the read never freezes   // the push starts as the card lands: no frozen beat before C4
  const cardOut = (t) => sineIO(span(t, k.qs - .6, k.qs + 1.15));   // a soft drop (expoIn lurched: a full-width cream card)
  function quote(ctx, t) {
    if (t < k.qs + 1.3) F.say(ctx, t, [['IN', k.essay], ['HIS', k.essay + .1], ['ESSAY', k.essay + .32]], W / 2, CARD.y - 50, { size: 52, align: 'center', out: C4.start - .1 });
    if (t < k.essay + .75 || t > k.qs + 1.3) return;
    const u = lerp(.45, 1, span(t, k.essay + .8, k.essay + 1.6)), out = cardOut(t);
    ctx.save(); const cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2, z = cardPush(t);
    ctx.translate(cx, cy + 760 * out - 44 * (z - 1) / .1); ctx.scale(z * (1 - .4 * out), z * (1 - .4 * out)); ctx.translate(-cx, -cy);
    F.quoteCard(ctx, t, T, { text: CARD_TEXT, x: CARD.x, y: CARD.y, w: CARD.w, size: CARD.size, head: CARD_HEAD, credit: SRC.k1Src, spoken: ['Who gets to decide', 'should we use'], after: C4.start - .2, u });
    ctx.restore();
  }
  const BOX = [0, 1, 2].map((i) => ({ x: 180 + i * 540, y: 400, w: 480, h: 170 }));
  const boxGrow = (i, t) => (i < 2 ? quartIO(span(t, k.qs - .2 + i * .12, k.qs + .7 + i * .12)) : 1);
  function boxes(ctx, t) {
    if (t < k.qs - .3 || t > k.critics + 1.2) return;
    const fin = quartIO(span(t, k.critics - .2, k.critics + .8)), lb = listBox(t);
    BOX.forEach((b0, i) => {
      // from the card's question line (i 0/1), or drawn fresh on "a third" (i 2); 7.14: each box folds into an empty line of the list
      const g = boxGrow(i, t), from = { x: CARD.x + 54, y: CARD.y + 64 + i * CARD.size * 1.22 * 1.3, w: CARD.w - 108, h: CARD.size * 1.1 };
      let b = i < 2 ? { x: lerp(from.x, b0.x, g), y: lerp(from.y, b0.y, g), w: lerp(from.w, b0.w, g), h: lerp(from.h, b0.h, g) } : b0;
      const ly = lb.y + lb.h * .25 + lb.h * .7 * (i + 4.5) / 7, lx0 = lb.x + lb.w * .11, lx1 = lb.x + lb.w * .89;
      b = { x: lerp(b.x, lx0, fin), y: lerp(b.y, ly, fin), w: lerp(b.w, lx1 - lx0, fin), h: lerp(b.h, 0, fin) };
      const draw = i < 2 ? span(g, 0, .2) : sineIO(span(t, k.third - .1, k.third + .8));
      if (draw <= 0) return;
      // the outline is never closed: a gap at the top right stays open (the question is open), it breathes
      const gap = 34 + 8 * Math.sin(t * 1.6 + i), r = 14 * (1 - fin), pts = [[b.x + b.w - r - gap - 40, b.y], [b.x + r, b.y], [b.x, b.y + r], [b.x, b.y + b.h - r], [b.x + r, b.y + b.h], [b.x + b.w - r, b.y + b.h], [b.x + b.w, b.y + b.h - r], [b.x + b.w, b.y + r], [b.x + b.w - r, b.y], [b.x + b.w - r - gap * (1 - fin), b.y]];
      ctx.save(); ctx.globalAlpha *= 1 - span(fin, .7, 1); ctx.strokeStyle = rgba(CREAM, .8); ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
      const L = pts.reduce((s, p, j) => s + (j ? Math.hypot(p[0] - pts[j - 1][0], p[1] - pts[j - 1][1]) : 0), 0); ctx.setLineDash([L * draw, L]);
      ctx.beginPath(); pts.forEach((p, j) => (j ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); ctx.restore();
      const tu = i < 2 ? span(t, k.qs + .25 + i * .15, k.qs + .9 + i * .15) : span(t, k.how - .15, k.how + .5);
      F.heavy(ctx, SRC.open3[i], b.x + b.w / 2, b.y + b.h / 2 + 16, 44, tu, { align: 'center', col: CREAM, out: span(t, k.critics - .35 + i * .04, k.critics + .05 + i * .04) });
    });
    if (t < k.critics + .3) F.verdict(ctx, t, W / 2, 700, 'STILL OPEN', span(t, k.open - .1, k.open + .6) * (1 - span(t, k.critics - .3, k.critics)), { size: 40 });
  }
  // 7.14 the hands that push and pull line 4 (sideList draws the line from the same offsets: wobD)
  const handsU = (t) => span(t, k.lineW - .2, k.lineW + .5) * (1 - span(t, k.resv - .3, k.resv + .3));
  function hands(ctx, t) {
    const hu = handsU(t); if (hu <= 0) return;
    const b = listBox(t), L = lineOf(b, 4), d = wobD(t, wobA(t)), e = expoOut(hu);
    WOB_HANDS.forEach((h, j) => {   // a small hand of the night (cool cream, no face, no logo) on a thin arm from outside grips the line and tugs
      const hx = lerp(L.x0, L.x1, h.q), hy = L.y + d[j], side = j === 1 ? 1 : -1, ox = hx + side * 34, oy = L.y - h.up * 78;
      const gx = lerp(ox, hx, e), gy = lerp(oy, hy - h.up * 4, e);
      ctx.save(); ctx.globalAlpha *= e;
      ctx.strokeStyle = rgba(mixHex(P.blue1, CREAM2, .5), .85); ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(ox + side * 10, oy - h.up * 20); ctx.quadraticCurveTo(ox, lerp(oy, gy, .5), gx, gy); ctx.stroke();
      ctx.fillStyle = mixHex(P.blue1, CREAM2, .7); ctx.beginPath(); ctx.ellipse(gx, gy, 12, 9, Math.atan2(gy - oy, gx - ox), 0, TAU); ctx.fill();
      ctx.fillStyle = rgba(CREAM, .5); ctx.beginPath(); ctx.arc(gx + 3, gy - h.up * 3, 4, 0, TAU); ctx.fill();
      ctx.restore();
    });
  }
  function listWords(ctx, t) {
    if (t < k.critics - .3) return;
    const lb = listBox(t), y4 = lb.y + lb.h * .25 + lb.h * .7 * 4.5 / 7;
    F.say(ctx, t, [['CRITICS', k.critics]], 160, 220, { size: 52, out: k.resv - .5 });
    F.say(ctx, t, [['HARD', k.hard], ['TO', k.hard + .35], ['DRAW', k.hard + .48]], lb.x - 60, y4 + 18, { size: 50, align: 'right', out: k.resv - .25 });
    F.say(ctx, t, [['OPEN', k.lobby - .45], ['TO', k.lobby - .1], ['LOBBYING', k.lobby]], lb.x + lb.w + 60, y4 + 18, { size: 50, out: k.resv - .2 });
    // 7.15 reserved ≠ well paid: two short wage bars stop before the WELL PAID mark (no numbers: a comparison, not data)
    const out15 = span(t, k.unw - .4, k.unw + .1);
    if (t > k.resv - .2 && out15 < 1) {
      F.say(ctx, t, [['RESERVED', k.resv + .24], ['≠', k.wellPaid - .3], ['WELL', k.wellPaid], ['PAID', k.wellPaid + .3]], 160, 220, { size: 52, gold: [0], out: k.unw - .35 });
      const bx = lb.x + lb.w + 30, mark = bx + 420, mu = sineIO(span(t, k.wellPaid - .1, k.wellPaid + .6)) * (1 - out15);
      if (mu > 0) {
        const yA = lb.y + lb.h * .25 + lb.h * .7 * .5 / 7 - 40, yB = lb.y + lb.h * .25 + lb.h * .7 * 3.5 / 7 + 20;
        ctx.save(); ctx.strokeStyle = rgba(CREAM, .7 * mu); ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(mark, yB); ctx.lineTo(mark, lerp(yB, yA, mu)); ctx.stroke(); ctx.restore();
        lab(ctx, 'WELL PAID', mark, yA - 14, mu, { size: 24, col: CREAM, align: 'center' });
      }
      [[0, k.care], [3, k.teach]].forEach(([li, tt], j) => {
        const y = lb.y + lb.h * .25 + lb.h * .7 * (li + .5) / 7, g = expoOut(span(t, tt - .05, tt + .7)) * (1 - expoIn(out15));
        if (g <= 0) return;
        const len = [150, 190][j] * g;
        ctx.fillStyle = lin(ctx, bx, 0, bx + len, 0, [[0, AMBER.hot], [1, AMBER.body]]); ctx.beginPath(); ctx.roundRect(bx, y - 26, len, 22, [2, 4, 4, 2]); ctx.fill();
        lab(ctx, 'WAGE', bx, y - 36, g, { size: 22 });
      });
    }
    // 7.16 three words tick in · 7.17 the question
    const X = 1240, wo = k.why - .3;
    [[SRC.weak3[0], k.unwW], [SRC.weak3[1], k.hard2], [SRC.weak3[2], k.short + .1]].forEach(([s, tt], i) => {
      const u = span(t, tt - .2, tt + .35), y = 400 + i * 90; if (u <= 0) return;
      F.goldSpan(ctx, [[X, y - 18], [X + 30, y - 18]], 0, smooth(span(t, tt - .3, tt)) * (1 - span(t, wo, wo + .3)), { w: 3, spark: false });
      F.heavy(ctx, s, X + 50, y, 50, u, { col: CREAM, out: span(t, wo + i * .05, wo + .4 + i * .05) });
    });
    F.say(ctx, t, [['WHY', k.why], ['DOES', k.why + .17], ['IT', k.why + .35], ['MATTER?', k.matter]], X, 520, { size: 56, out: END - .3 });
  }

  // ------------------------------------------------------------------ the frame
  const tp = towerPush(T);
  const draw = (ctx, t) => {
    F.stage(ctx, t);
    ctx.save(); pushAbout(ctx, tp(t));
    towerScene(ctx, t);
    bigList(ctx, t);
    juryBox(ctx, t);
    railDraw(ctx, t);
    you(ctx, t);
    scale(ctx, t);
    // 7.02–7.05 kickers (top left)
    F.say(ctx, t, [['THE', k.verdict - .12], ['VERDICT', k.verdict], ['IS', k.verdict + .5], ['ABOUT', k.about], ['YOU', k.you]], 160, 220, { size: 56, gold: [4], out: k.mach - .8 });
    F.say(ctx, t, [['A', k.mach], ['MACHINE', k.mach + .05], ['WEIGHS', k.weigh], ['THE', k.weigh + .24], ['EVIDENCE', k.evid]], 160, 220, { size: 56, out: k.still - .85 });
    F.say(ctx, t, [['STILL', k.still], ['WANT', k.want], ['PEOPLE?', k.people]], 160, 220, { size: 56, gold: [2], out: k.hr - .2 });
    F.say(ctx, t, [['AN', k.answer - .12], ['ANSWER', k.answer], ['BECOMES', k.answer + .6]], 160, 220, { size: 56, out: k.howLong - .3 });
    if (t > k.hr && t < k.howLong + .6) F.verdict(ctx, t, 1250, 430, 'A RULE', span(t, k.rule - .15, k.rule + .55) * (1 - span(t, k.howLong - .3, k.howLong + .2)), { size: 44, align: 'left' });
    towerWords(ctx, t);
    flyCard(ctx, t);
    quote(ctx, t);
    boxes(ctx, t);
    hands(ctx, t);
    listWords(ctx, t);
    ctx.restore();
    F.timeline(ctx, t, T);
  };
  return [
    { t: R.a, draw: (ctx, t) => S.plateJury(ctx, t, T), print: F.PRINT41 },
    { t: k.P0, draw, print: F.PRINT41 },
  ];
};
