// Film 77 · builder B2 (c07 c08 c09) · own helpers (B2 alone edits this file). Kit: lib/f77_kit.mjs · seams: lib/f77_seams.mjs.
// anchorsB2(T): every phrase anchor of the group in one object (all three chunk files read the same values, so the two inner seams
// c07→c08 ('This channel exists') and c08→c09 ('Terence Tao is one') are drawn by ONE shared function on both sides: identical frames).
//   boardAct  (c07 3.17 → c08 4.01): the mini board grows out of its corner, the grain in row 2, the many figures, your button
//   stacksAct (c08 4.14 → c09 4.17): the calendar of CLAIMs, the stacks, the checkers, the mathematician
import * as F from './f77_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rise, halo, rad, lin, prng, GOLD, CREAM, PAPER, COOL } = F;

// ======================================================================================================================== ANCHORS (phrases only)
export function anchorsB2(T) {
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0, n = 0) => T.GE(p, n, after);
  const a = {};
  // c07
  a.c07 = G("So why isn't it in the power lines"); a.home = G('outside your home', a.c07);
  a.cold = G('Because it only works', a.c07); a.extreme = G('extreme cold', a.cold); a.zero = G('absolute zero', a.cold); a.zeroE = GE('absolute zero', a.cold);
  a.team = G('So far, only its own', a.c07); a.own = G('own team', a.team); a.tested = G('tested it', a.team);
  a.most = G('And most A.I. designs', a.c07); a.designs = G('designs still', a.most); a.screen = G('on a screen', a.most);
  a.man = G("The man you'll hear next", a.c07); a.cofound = G('co-founded', a.man); a.robots = G('robots run', a.man); a.exper = GE('the experiments', a.man);
  a.why = G("Here's why he says", a.c07); a.lab = G('needs a lab', a.why);
  a.C2 = T.clip('C2');
  a.built = G('Only what gets built', a.c07); a.second = G('So the second line', a.c07); a.begun = G('has begun', a.second);
  a.small = G('Still small', a.second); a.real = G('But real', a.small);
  // c08
  a.c08 = G('This channel exists for one reason'); a.well = G('goes well for everybody', a.c08); a.reach = G('So that what it invents', a.c08); a.allus = G('all of us', a.reach);
  a.want = G('Want that too', a.c08); a.sub = G('Then subscribe', a.c08); a.subE = GE('Then subscribe', a.c08);
  a.whyS = G('Why still small', a.c08); a.matter = G('Because matter is slow', a.c08); a.slow = G('is slow', a.matter);
  a.math = G('But in mathematics', a.c08); a.nothing = G('nothing has to be built', a.math);
  a.watch = G("So that's where you can watch", a.c08); a.full = G('full speed', a.watch);
  a.dots = G('Remember the dots', a.c08); a.page = G('on the page', a.dots);
  a.spec = G('behind that answer', a.c08) - .6; a.specW = G('math specialist', a.spec);
  a.maker = G('Its maker, OpenAI', a.c08); a.general = G('general-purpose model', a.maker);
  a.outside = G('Outside mathematicians checked', a.c08); a.checked = G('checked the result', a.outside);
  a.one = G('One would have recommended', a.c08); a.without = G('without any hesitation', a.one); a.journal = G("math's top journal", a.one);
  a.dm = G('And a Google DeepMind system', a.c08); a.solved = G('solved dozens', a.dm); a.each = G('each proof checked', a.dm);
  a.two = G('Two had waited', a.c08); a.half = G('half a century', a.two);
  a.cost = G('The cost per solved', a.c08); a.dollars = G('a few hundred dollars', a.cost);
  a.cracked = G('It cracked only a small', a.c08); a.share = G('small share', a.cracked);
  a.fall = G('But this fall', a.c08); a.claim = G('a new claim', a.fall); a.month = G('every month', a.fall);
  a.big = G('Some so big that', a.c08); a.cant = G("can't check them", a.big); a.enough = GE('fast enough', a.big);
  // c09
  a.c09 = G('Terence Tao is one'); a.leading = G("the world's leading", a.c09);
  a.watched = G('He has watched all', a.c09); a.close = G('up close', a.watched);
  a.C3 = T.clip('C3');
  a.many = G('Too many proofs', a.c09); a.few = G('not too few', a.many);
  a.calls = G('Tao calls it', a.c09); a.indig = G('proof indigestion', a.calls);
  a.sept = G('In September, he and', a.c09); a.tf = G('twenty-four other', a.sept); a.signed = G('signed a warning', a.sept);
  a.notAg = G('Not against A.I.', a.c09);
  a.point = G('Their point', a.c09); a.companies = G('companies and the mathematicians', a.point); a.diff = G('want different things', a.point);
  a.third = G('So the third line', a.c09); a.waiting = G("isn't waiting", a.third);
  a.moving = G("It's moving faster", a.c09); a.follow = G('can follow', a.moving);
  a.raises = G('And that raises a bigger', a.c09); a.who = G('who decides what', a.raises);
  a.your = G("Your list, or someone else's", a.c09); a.else = G("someone else's", a.your);
  a.secondHalf = G("This is where the second half", a.c09); a.goodS = G("Jack Good's sentence", a.secondHalf);
  a.hereAll = G('Here is all of it', a.c09);
  a.quote = G('The first ultra-intelligent machine', a.c09); a.provided = G('provided that the machine', a.quote); a.docileQ = G('docile enough', a.quote); a.underC = G('under control', a.quote); a.quoteE = GE('under control', a.quote);
  a.cond = G("There's the condition", a.c09);
  a.docile = G('Docile: willing', a.c09); a.willing = G('willing to be guided', a.docile);
  a.years = G('Years earlier, his old boss', a.c09); a.turing = G('Alan Turing', a.years); a.darker = G('had been darker', a.years);
  a.atSome = G('At some stage therefore', a.c09); a.take = G('take control', a.atSome); a.takeE = GE('take control', a.atSome);
  a.c10 = G("That's the fourth line");
  return a;
}

// ======================================================================================================================== SMALL OBJECTS
// a power pylon (a real thing: a dark filled lattice silhouette with a cool rim, not an outline). (x, y) foot centre, h height
export function pylon(ctx, x, y, h) {
  const w0 = h * .34, w1 = h * .07, top = y - h, arm = top + h * .14, arm2 = top + h * .3;
  ctx.save();
  ctx.strokeStyle = mixHex(P.ind2, P.blue1, .55); ctx.lineCap = 'round';
  const L = (a, b, w) => { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
  const at = (f, s) => [x + s * lerp(w0 / 2, w1 / 2, f), lerp(y, top, f)];
  L(at(0, -1), at(1, -1), h * .022); L(at(0, 1), at(1, 1), h * .022);
  for (let k = 0; k < 7; k++) { const f0 = k / 7, f1 = (k + 1) / 7; L(at(f0, -1), at(f1, 1), h * .008); L(at(f0, 1), at(f1, -1), h * .008); L(at(f1, -1), at(f1, 1), h * .01); }
  L([x - h * .3, arm], [x + h * .3, arm], h * .018); L([x - h * .22, arm2], [x + h * .22, arm2], h * .016);
  ctx.fillStyle = mixHex(P.blue1, P.cream, .35);
  for (const [px, py] of [[x - h * .28, arm], [x + h * .28, arm], [x - h * .2, arm2], [x + h * .2, arm2]]) { ctx.fillRect(px - h * .006, py, h * .012, h * .05); }
  ctx.restore();
  return { L: [x - h * .28, arm + h * .05], R: [x + h * .28, arm + h * .05], L2: [x - h * .2, arm2 + h * .05], R2: [x + h * .2, arm2 + h * .05] };
}
// a sagging wire between two points (sag px at the middle), drawn as a thin cool line
export function wire(ctx, a, b, sag, o = {}) {
  ctx.save(); ctx.strokeStyle = o.col ?? rgba(mixHex(P.blue1, P.cream, .45), .8); ctx.lineWidth = o.w ?? 3;
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag * 2, b[0], b[1]); ctx.stroke(); ctx.restore();
}
// your house at night (dark, a warm lit window); (x, y) = left foot, w width
export function house(ctx, t, x, y, w, o = {}) {
  const h = w * .62, roof = w * .36;
  ctx.save();
  ctx.fillStyle = mixHex(P.night1, P.ind1, .45);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.lineTo(x + w / 2, y - h - roof); ctx.lineTo(x + w, y - h); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 2; ctx.stroke();
  const wl = o.win ?? 1, b = .9 + .1 * Math.sin(t * 1.1);
  for (const [fx, fy] of [[.18, .42], [.6, .42]]) {
    const wx = x + w * fx, wy = y - h + h * fy * .6, ww = w * .2, wh = h * .3;
    ctx.fillStyle = mixHex(P.night0, GOLD.mid, .8 * wl * b); ctx.fillRect(wx, wy, ww, wh);
    halo(ctx, wx + ww / 2, wy + wh / 2, ww * 1.4, .35 * wl * b, GOLD.halo, GOLD.core);
    ctx.fillStyle = rgba(P.night0, .7); ctx.fillRect(wx + ww / 2 - 1.5, wy, 3, wh); ctx.fillRect(wx, wy + wh / 2 - 1.5, ww, 3);
  }
  ctx.restore();
  return { roof: [x + w / 2, y - h - roof] };
}
// a thermometer in kelvin (0 … 300 K, linear): (x, yTop) top of the tube, len tube length, level 0..1 of the scale, band [k0, k1] lit cool,
// u 0..1 (the tube and the ticks draw), retract 0..1 (the tube shortens into its bulb). Returns { bulb: [x, y, r] }.
export function thermo(ctx, t, x, yTop, len, o = {}) {
  const u = clamp(o.u ?? 1), rt = sineIO(clamp(o.retract ?? 0)), r = o.r ?? 42, yb = yTop + len, top = lerp(yTop, yb - r * .6, rt), tw = r * .62;
  const Y = (k) => yb - r * .6 - (k / 300) * (len - r * .6);   // kelvin → y
  ctx.save();
  if (u > 0) {
    ctx.fillStyle = rgba(mixHex(P.night0, P.ind1, .5), .9); ctx.beginPath(); ctx.roundRect(x - tw / 2, top, tw, yb - top, tw / 2); ctx.fill();
    F.outline(ctx, [[[x - tw / 2, yb - r * .5], [x - tw / 2, top + tw / 2]], [[x + tw / 2, yb - r * .5], [x + tw / 2, top + tw / 2]]], u * (1 - rt), { w: 2.5 });
    // ticks every 50 K, labels at 300 (room) and 0
    if (rt < .3) for (let k = 0; k <= 300; k += 50) { const ku = span(u, k / 300 * .6, k / 300 * .6 + .4) * (1 - rt / .3); if (ku <= 0) continue; ctx.fillStyle = rgba(CREAM, .7 * ku); ctx.fillRect(x + tw / 2 + 6, Y(k) - 1, k % 100 ? 14 : 24, 2); }
    // the column (cool once it is cold)
    const lv = clamp(o.level ?? 1), ly = Y(lv * 300), cold = 1 - lv;
    const col = mixHex(GOLD.mid, COOL.body, smooth(clamp(cold * 1.3)));
    ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - tw * .22, Math.max(ly, top + tw * .3), tw * .44, yb - Math.max(ly, top + tw * .3), tw * .22); ctx.fill();
    if (o.band && rt < 1) { const [k0, k1] = o.band, bu = clamp(o.bandU ?? 1); if (bu > 0) { ctx.save(); ctx.globalAlpha *= bu * (1 - rt); ctx.strokeStyle = COOL.core; ctx.lineWidth = 2.5; ctx.strokeRect(x - tw * .75, Y(k1) - 5, tw * 1.5, Y(k0) - Y(k1) + 10); halo(ctx, x, (Y(k0) + Y(k1)) / 2, tw * 2.2, .6 * bu, COOL.halo, COOL.core); ctx.restore(); } }
  }
  // the bulb
  ctx.fillStyle = mixHex(GOLD.mid, COOL.body, smooth(clamp((1 - (o.level ?? 1)) * 1.3))); ctx.beginPath(); ctx.arc(x, yb, r * .78, 0, 6.29); ctx.fill();
  ctx.strokeStyle = CREAM; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, yb, r, 0, 6.29); ctx.stroke();
  ctx.restore();
  return { bulb: [x, yb, r], Y };
}
// a round badge: (x, y) centre, r radius. o: { u (the ring draws), tick 0..1 (gold tick, the ring turns gold), dashed (no one yet), text (round
// the rim), q (a cream ? in the centre) }
export function badge(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const tk = clamp(o.tick ?? 0), col = mixHex(CREAM, GOLD.line, tk);
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .55 * smooth(u)); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  F.outline(ctx, [F.circlePts(x, y, r, -Math.PI / 2, Math.PI * 1.5, 48)], u, { w: r * .045, col, dashed: o.dashed, t, gold: tk > .5 });
  if (!o.dashed) F.outline(ctx, [F.circlePts(x, y, r * .72, -Math.PI / 2, Math.PI * 1.5, 40)], span(u, .3, 1), { w: r * .02, col, gold: tk > .5 });
  if (o.text && u > .5) {
    const fs = Math.max(11, r * .15), n = o.text.length; ctx.font = `700 ${fs}px Inter`; ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha *= span(u, .5, 1);
    for (let i = 0; i < n; i++) { ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2 + (i + .5) / n * Math.PI * 2 + t * .04); ctx.translate(0, -r * .86); ctx.fillText(o.text[i], 0, 0); ctx.restore(); }
  }
  ctx.restore();
  if (tk > 0) F.goldSpan(ctx, [[x - r * .32, y + r * .02], [x - r * .08, y + r * .26], [x + r * .36, y - r * .28]], 0, smooth(tk), { w: r * .07 });
  else if (o.q) F.glowText(ctx, '?', x, y + r * .22, { size: r * .7, serif: true, align: 'center', col: rgba(CREAM, .75 * u), glow: false });
}
// one screen of the DESIGNED stack: a dark panel with a cool rim and a dashed lattice in it (a design, not a thing)
export function screenPanel(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1, lit = clamp(o.lit ?? .6);
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(P.night0, COOL.deep, .45 * lit); ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .55 + .35 * lit); ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  F.lattice(ctx, t, x + w / 2, y + h / 2, h * .36, { dashed: true, seed: o.seed ?? 1, a: a * (.5 + .5 * lit), u: o.u ?? 1 });
}
// a small grey pellet (a made sample) on a tray; lit 0..1 = gold light (real)
export function pellet(ctx, x, y, s, lit = 0) {
  if (lit > 0) halo(ctx, x, y, s * 3.4, .55 * lit, GOLD.halo, GOLD.core);
  ctx.fillStyle = mixHex('#6f7389', GOLD.shade, lit * .5); ctx.beginPath(); ctx.ellipse(x, y + s * .18, s, s * .42, 0, 0, 6.29); ctx.fill();
  ctx.fillStyle = lin(ctx, x - s, y, x + s, y, [[0, mixHex('#a6aabd', GOLD.mid, lit * .6)], [.5, mixHex('#e1e3ec', GOLD.hot, lit * .7)], [1, mixHex('#7a7e93', GOLD.shade, lit * .6)]]); ctx.beginPath(); ctx.ellipse(x, y, s, s * .42, 0, 0, 6.29); ctx.fill();
}
export function tray(ctx, x, y, w) {
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .45); ctx.beginPath(); ctx.roundRect(x - w / 2, y, w, w * .07, 4); ctx.fill();
  ctx.fillStyle = rgba(P.blue1, .9); ctx.fillRect(x - w / 2 + 4, y, w - 8, 2);
  ctx.fillStyle = mixHex(P.ind2, P.night0, .3); ctx.fillRect(x - w * .04, y + w * .07, w * .08, w * .5); ctx.fillRect(x - w * .2, y + w * .55, w * .4, w * .04);
}

// ======================================================================================================================== THE FOUR LINES (mini board)
// The mini board (corner icon) of B2: F.board mini, title THE FOUR LINES. st: { e (ENERGY gold 1), m 0..1 (MATERIALS flips WAITING → BEGUN),
// d 0..1 (DISCOVERY), dPulse, mPulse, grain 0..1 (the gold grain in row 2), tick 0..1 }. (x, y) top-left, s scale. Returns geometry.
export const BOARD_CORNER = { x: 1585, y: 64, s: .42 };
export const BOARD_MID = { x: 720, y: 118, s: .8 };
const BW = 600, BHEAD = 112, BROW = 78;
export const boardRowRect = (x, y, s, i) => ({ x: x + 20 * s, y: y + (BHEAD + i * BROW) * s, w: (BW - 40) * s, h: BROW * s });
export const grainAt = (x, y, s) => [x + 330 * s, y + (BHEAD + BROW * 1.5) * s];
export function fourLines(ctx, t, x, y, s, st = {}) {
  const row = (txt, k, pulse = 0) => ({ text: txt, status: k > .5 ? 'BEGUN' : 'WAITING', statusFrom: k > .5 ? 'WAITING' : 'BEGUN', statusFlip: k > .5 ? span(k, .5, 1) : 1, gold: smooth(span(k, .55, 1)), lit: pulse });
  const rows = [row('ENERGY', st.e ?? 1), row('MATERIALS', st.m ?? 0, st.mPulse ?? 0), row('DISCOVERY', st.d ?? 0, st.dPulse ?? 0), { dashed: true, lit: st.cPulse ?? 0 }];
  const b = F.board(ctx, t, x, y, { mini: true, s, w: BW, rowH: BROW, head: BHEAD, title: 'THE FOUR LINES', cells: 14, rows, u: st.u ?? 1, a: st.a ?? 1 });
  // the grain (one gold speck in row 2, not a heap) and its tick
  const gu = clamp(st.grain ?? 0);
  if (gu > 0) {
    const [gx, gy] = grainAt(x, y, s), gr = 6.5 * s * (1 + .08 * Math.sin(t * 2.1));
    halo(ctx, gx, gy, gr * 7, .7 * gu, GOLD.halo, GOLD.core);
    ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(gx, gy, gr * expoOut(gu), 0, 6.29); ctx.fill();
    const tk = clamp(st.tick ?? 0); if (tk > 0) F.goldSpan(ctx, [[gx + gr * 2.2, gy - gr * .2], [gx + gr * 3.4, gy + gr * 1.2], [gx + gr * 5.6, gy - gr * 2.2]], 0, smooth(tk), { w: Math.max(1.4, 2.4 * s) });
  }
  return b;
}

// ======================================================================================================================== BOARD ACT (c07 3.17 → c08 4.01)
// Shared by sc07 (its end) and sc08 (its start): the frame at 'This channel exists' is the same function of t on both sides.
// Board space = the screen (1920 × 1080) under its own slow camera camBoard(t). The caller draws the night first.
const GROUND_B = 905;
const CROWD_B = (() => { const r = prng(285), out = [];
  for (let i = 0; i < 13; i++) out.push({ x: 300 + i * 110 + (r() - .5) * 40, y: 842, h: 92 + r() * 10, dir: r() < .5 ? 1 : -1, ph: r() * 6 });
  for (let i = 0; i < 10; i++) { const x = 250 + i * 150 + (r() - .5) * 50; if (Math.abs(x - 1100) < 90) continue; out.push({ x, y: GROUND_B, h: 112 + r() * 12, dir: r() < .5 ? 1 : -1, ph: r() * 6 }); }
  return out.map((p) => ({ ...p, d: Math.abs(p.x - 960) / 960 })); })();
export const YOU_B = { x: 1100, y: GROUND_B, h: 150 };
export function boardPose(t, a) {
  const g = quartIO(span(t, a.small - .55, a.small + .45));
  return { g, x: lerp(BOARD_CORNER.x, BOARD_MID.x, g), y: lerp(BOARD_CORNER.y, BOARD_MID.y, g), s: lerp(BOARD_CORNER.s, BOARD_MID.s, g) };
}
export function camBoard(t, a) {
  const [gx, gy] = grainAt(BOARD_MID.x, BOARD_MID.y, BOARD_MID.s);
  return F.lookPath(t, [[a.real + .4, 960, 540, 1], [a.c08 + 1.8, 960, 595, .88], [a.want - .2, 965, 600, .9], [a.want + .7, 1070, 690, 1.22], [a.subE + .45, 1100, 712, 1.3],
    [a.whyS + 1.0, gx - 260, gy, 2.2], [a.matter - .1, gx - 270, gy - 6, 2.3], [a.matter + 3.4, gx - 520, gy - 420, 2.6]]);
}
export const TILT_END = [3690, -1500];   // c07's world camera at the end of its tilt (its stars hold this offset from then on)
export const STARS_B = [-(TILT_END[0] - 960) * .02, -(TILT_END[1] - 520) * .05];
export const boardGlow = (t) => [960, 330, 900, .6 * (1 + .09 * Math.sin(t * 1.3))];
// st: what the board shows; the grain arrives at a.begun (sc07 flies it in), DISCOVERY can pulse later
export function boardAct(ctx, t, a, o = {}) {
  const bp = boardPose(t, a), c = camBoard(t, a), r = BOARD_MID;
  const st = { e: 1, m: span(t, a.begun - .05, a.begun + .55), grain: t >= a.begun ? 1 : 0, tick: span(t, a.real + .05, a.real + .5), u: span(t, a.second - .15, a.second + .75), ...(o.st ?? {}) };
  F.look(ctx, c.cx, c.cy, c.z, () => {
    // the stand: two posts grow down from the board's frame to the ground once it has come to the middle; a button on the right post
    const pu = smooth(span(t, a.small + .25, a.c08 + .2)), bw = BW * r.s, bh = (BHEAD + 4 * BROW + 30) * r.s, by = r.y + bh;
    if (pu > 0) {
      for (const px of [r.x + 34, r.x + bw - 34]) { const y1 = lerp(by, GROUND_B, pu); ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(px - 7, by - 4, 14, y1 - by + 4); F.goldSpan(ctx, [[px + 7, by], [px + 7, y1]], 0, 1, { w: 1, spark: false, a: .55 }); }
      const gu = span(pu, .6, 1); if (gu > 0) { ctx.fillStyle = rgba(P.blue1, .6 * gu); ctx.fillRect(140, GROUND_B - 1, (W - 280) * gu, 2); ctx.fillRect(W / 2 - (W - 280) * gu / 2, GROUND_B - 1, (W - 280) * gu, 2); }
    }
    // the button (it lights when your hand presses it)
    const BT = [r.x + bw - 34, 772], pressed = span(t, a.sub + .22, a.sub + .38);
    if (pu > .8) { ctx.fillStyle = mixHex(P.night0, GOLD.mid, .85 * pressed); ctx.beginPath(); ctx.arc(BT[0], BT[1], 13, 0, 6.29); ctx.fill(); ctx.strokeStyle = mixHex(CREAM, GOLD.line, pressed); ctx.lineWidth = 2.5; ctx.stroke(); if (pressed > 0) halo(ctx, BT[0], BT[1], 90, .8 * pressed, GOLD.halo, GOLD.core); }
    // the many: they rise from behind their ground, centre outward (M.01); the gold of rows 1 and 2 runs out to their hands (M.02)
    const dim = 1 - .45 * span(t, a.want - .1, a.want + .45);
    for (const p of CROWD_B) {
      const k = expoOut(span(t, a.c08 + .25 + p.d * .9, a.c08 + 1.05 + p.d * .9)); if (k <= 0) continue;
      const th0 = a.reach + .1 + p.d * .75, arrive = span(t, th0, th0 + .5), raise = smooth(span(t, th0 - .2, th0 + .35));
      ctx.save(); ctx.globalAlpha *= dim; ctx.beginPath(); ctx.rect(p.x - p.h, p.y - p.h * 1.6, p.h * 2, p.h * 1.6 + 1); ctx.clip();
      const hd = F.person(ctx, p.x, p.y + (1 - k) * p.h * 1.2 + .012 * p.h * Math.sin(t * 1.2 + p.ph), p.h, { dir: p.dir, look: .55 + .1 * Math.sin(t * .5 + p.ph), armR: [lerp(.1, 2.3, raise), lerp(.2, 2.6, raise)], light: .5 });
      ctx.restore();
      const hp = hd?.R; if (!hp) continue;
      if (arrive > 0) { const src = [lerp(r.x + 60, r.x + bw - 60, (p.x - 250) / 1420), by]; const back = span(t, th0 + 1.1, th0 + 1.8); if (back < 1) F.goldSpan(ctx, [src, [lerp(src[0], hp[0], .5), lerp(src[1], hp[1], .35)], hp], smooth(back), smooth(arrive), { w: 1.3, a: .8 * dim }); }
      const lit = span(t, th0 + .45, th0 + .6); if (lit > 0) halo(ctx, hp[0], hp[1], 38, .75 * lit * dim, GOLD.halo, GOLD.core);
    }
    // you, in front, near the right post (M.03 you look up, M.04 your hand presses the button)
    { const k = expoOut(span(t, a.c08 + .2, a.c08 + 1.0)); if (k > 0) {
      const press = sineIO(span(t, a.sub - .15, a.sub + .3)), rel = sineIO(span(t, a.sub + .9, a.whyS - .2)), arm = press * (1 - rel * .6);
      ctx.save(); ctx.beginPath(); ctx.rect(YOU_B.x - 200, YOU_B.y - 260, 400, 261); ctx.clip();
      F.du(ctx, YOU_B.x, YOU_B.y + (1 - k) * YOU_B.h * 1.2, YOU_B.h, { dir: 1, look: lerp(.35, 1, smooth(span(t, a.want - .05, a.want + .5))) * (1 - .5 * press), armR: [lerp(.15, 1.72, arm), lerp(.25, 1.86, arm)], light: .6 + .4 * span(t, a.want, a.want + .5) });
      ctx.restore(); } }
    if (pressed > 0) F.capsLabel(ctx, 'SUBSCRIBE', BT[0] + 26, BT[1] + 9, span(t, a.sub + .25, a.sub + .8) * (1 - span(t, a.whyS - .3, a.whyS + .1)), { size: 22, col: GOLD.text, align: 'left' });
    fourLines(ctx, t, bp.x, bp.y, bp.s, st);
  });
  // screen type
  const sp = (x, y) => F.lookPt(c.cx, c.cy, c.z, x, y), io = (i0, o0, d = .45) => span(t, i0, i0 + .55) * (1 - span(t, o0, o0 + d));
  { const u = io(a.small + .05, a.c08 - .45); if (u > 0) { const [x, y] = sp(r.x + BW * r.s / 2, r.y + (BHEAD + 4 * BROW + 30) * r.s); F.capsLabel(ctx, 'STILL SMALL', x, y + 56, u, { size: 28, col: CREAM }); } }
  { const u = io(a.real + .05, a.c08 - .4); if (u > 0) { const [x, y] = sp(r.x + BW * r.s / 2, r.y + (BHEAD + 4 * BROW + 30) * r.s); F.verdict(ctx, t, x, y + 112, 'REAL', u, { size: 34 }); } }
  return { c, bp };
}
// a wide flat ground (F.land only spans −W … 2W): lit rim at y0, darker below
export function ground(ctx, y0, x0 = -6000, x1 = 14000) {
  ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + 1400, [[0, mixHex(P.ind1, P.blue1, .35)], [.25, P.ind0], [1, P.night0]]); ctx.fillRect(x0, y0, x1 - x0, 4000);
  ctx.fillStyle = rgba(P.blue1, .55); ctx.fillRect(x0, y0 - 1, x1 - x0, 2);
}

// ======================================================================================================================== c08 OBJECTS
// a furnace (line 2 vs line 3: MATTER IS SLOW): (x, y) centre of the box. o: { u (the outline draws, the body fills), grow 0..1 (the pellet
// inside grows, slowly), r0 (the pellet's start radius = the grain that flew in), dial (hand angle, rad) }. Returns { pel: [x, y, r] }.
export function furnace(ctx, t, x, y, o = {}) {
  const u = clamp(o.u ?? 1), w = 420, h = 340, x0 = x - w / 2, y0 = y - h / 2, ww = 250, wh = 140, wx = x - ww / 2, wy = y - h * .2 - wh / 2;
  ctx.save();
  if (u > 0) {
    const f = smooth(span(u, .35, 1));
    ctx.fillStyle = rgba(mixHex(P.ind2, P.blue1, .4), f); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 14); ctx.fill();
    ctx.fillStyle = rgba(mixHex(P.ind2, P.night0, .4), f); ctx.fillRect(x0 + 30, y0 + h, 26, 40); ctx.fillRect(x0 + w - 56, y0 + h, 26, 40);
    F.outline(ctx, [F.rectPts(x0, y0, w, h, 14)], span(u, 0, .7), { w: 2.5 });
    const fire = (o.fire ?? .8) * f * (.92 + .08 * Math.sin(t * 4.3));
    ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(P.night0, GOLD.hot, .55 * fire)], [1, mixHex(P.night0, GOLD.shade, .8 * fire)]]); ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 8); ctx.fill();
    halo(ctx, x, wy + wh / 2, ww * .9, .35 * fire, GOLD.halo, GOLD.core);
    // a slow timer dial on the box (a small gauge, not a clock face)
    const dx = x0 + w - 62, dy = y0 + h - 70, dr = 34;
    ctx.strokeStyle = rgba(CREAM, .8 * f); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(dx, dy, dr, 0, 6.29); ctx.stroke();
    for (let k = 0; k < 12; k++) { const an = k / 12 * Math.PI * 2; ctx.fillStyle = rgba(CREAM, .5 * f); ctx.fillRect(dx + Math.cos(an) * dr * .78 - 1.5, dy + Math.sin(an) * dr * .78 - 1.5, 3, 3); }
    const an = o.dial ?? 0; ctx.strokeStyle = rgba(GOLD.line, f); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + Math.cos(an) * dr * .7, dy + Math.sin(an) * dr * .7); ctx.stroke();
    // the stand in the window
    ctx.fillStyle = rgba(mixHex(P.blue1, P.cream, .25), f); ctx.fillRect(x - 44, wy + wh - 26, 88, 8);
  }
  ctx.restore();
  const r = lerp(o.r0 ?? 12, 30, clamp(o.grow ?? 0));
  return { pel: [x, wy + wh - 26 - r * .3, r] };
}
// the handwriting on a page: n lines (cream ink) written from top to bottom; u0/u1 per line from o.at(i) → [0..1 written, 0..1 wiped]
const WRITE = (() => { const r = prng(304), L = []; for (let i = 0; i < 12; i++) { const len = .45 + r() * .5, pts = []; const n = 40; for (let k = 0; k <= n; k++) { const q = k / n; pts.push([q * len, Math.sin(q * 60 + i) * .18 + Math.sin(q * 23 + i * 2) * .25 + (r() - .5) * .3]); } L.push(pts); } return L; })();
export function writing(ctx, x, y, w, h, wr, o = {}) {
  const n = WRITE.length, lh = h / (n + 1);
  for (let i = 0; i < n; i++) {
    const [u, wipe] = wr(i); if (u <= 0 || wipe >= 1) continue;
    const pts = WRITE[i].map(([px, py]) => [x + px * w, y + lh * (i + 1) + py * lh * .32]);
    F.trailCream(ctx, pts, 0, Math.min(u, 1 - wipe), { w: 2.2, a: o.a ?? .9 });
  }
}
// an index card of the problem wall: (x, y) top-left, w × h. o: { u (appears), solved 0..1 (flips to gold, a small machine-check mark), lift,
// dim }
export function indexCard(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const s = clamp(o.solved ?? 0), flip = Math.abs(Math.cos(Math.PI * s)), gold = s > .5, dim = o.dim ?? 1;
  const hh = h * Math.max(.06, flip), yy = y + (h - hh) / 2;
  ctx.save(); ctx.globalAlpha *= expoOut(u) * dim;
  ctx.fillStyle = gold ? mixHex(GOLD.mid, GOLD.body, .5) : mixHex(P.night1, P.ind1, .6); ctx.beginPath(); ctx.roundRect(x, yy, w, hh, 4); ctx.fill();
  ctx.strokeStyle = gold ? GOLD.core : rgba(CREAM, .35); ctx.lineWidth = 1.5; ctx.stroke();
  if (!gold && flip > .5) { ctx.fillStyle = rgba(CREAM, .28); ctx.fillRect(x + w * .14, yy + hh * .34, w * .62, 2); ctx.fillRect(x + w * .14, yy + hh * .6, w * .44, 2); }
  if (gold && flip > .4) { ctx.strokeStyle = P.night0; ctx.lineWidth = Math.max(2, w * .06); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + w * .3, yy + hh * .52); ctx.lineTo(x + w * .45, yy + hh * .7); ctx.lineTo(x + w * .72, yy + hh * .3); ctx.stroke(); }
  ctx.restore();
  if (gold && (o.glow ?? 0) > 0) halo(ctx, x + w / 2, y + h / 2, w * 1.3, .45 * o.glow * dim, GOLD.halo, GOLD.core);
}

// ======================================================================================================================== STACKS ACT (c08 4.14 → c09 4.17)
// World coordinates of c08's world (the wall hangs above it). Shared by sc08 (its end) and sc09 (its start): identical frames at the seam.
export const STK = { cal: [3098, 3568, 4038], top: 1440, lw: 400, lh: 320, gy: 1830, sw: 230, check: [4390, 4485, 4580], tao: 4960, paper: { x: 4830, y: 1150, w: 760, h: 560 }, mid: 5290, left: 4700, right: 5640 };
export const SLOT = { x: STK.mid, y: 1470, w: 300, h: 169 };
const MONTHS = ['SEP', 'OCT', 'NOV'];
export function stackN(i, t, a) {   // sheets on calendar stack i (lands on its month, then grows ever faster)
  const tl = [a.claim - .15, a.claim + .45, a.month - .05][i], land = span(t, tl, tl + .5) * 6;
  const g = Math.pow(span(t, a.big - .2 + i * .15, a.c09 + 4), 1.6) * (40 + i * 14);
  return land + g;
}
export function camStacks(t, a) {
  const C3 = a.C3;
  return F.lookPath(t, [[a.fall - .2, 3568, 590, 1], [a.fall + 1.45, 3568, 1560, .95], [a.big - .05, 3600, 1565, .96], [a.big + 1.6, 3900, 1545, .9], [a.c09 - .1, 3920, 1545, .905],
    [a.c09 + 1.9, 5120, 1440, .98], [a.watched - .05, 5140, 1442, 1], [a.watched + 1.6, SLOT.x - 40, SLOT.y - 10, 1.32], [C3.end + .4, SLOT.x - 40, SLOT.y - 10, 1.38]]);
}
// draws the calendar, the stacks, the checkers, the mathematician and his paper (world coords; the caller has set the camera)
export function stacksAct(ctx, t, a) {
  if (t < a.fall - .5) return;
  const S = STK;
  // the three calendar leaves (they leave the wall's bottom row as blank cards and open into leaves)
  for (let i = 0; i < 3; i++) {
    const t1 = a.fall + .05 + i * .14, k = sineIO(span(t, t1, t1 + 1.2)); if (k <= 0) continue;
    const sx = 2800 + (6 + i * 6) * 64 + 28, sy = 200 + 14 * 46 + 19, cx = lerp(sx, S.cal[i], k), cy = lerp(sy, S.top + S.lh / 2, k) - Math.sin(Math.PI * k) * 120;
    const w = lerp(56, S.lw, sineIO(span(t, t1 + .3, t1 + 1.2))), h = lerp(38, S.lh, sineIO(span(t, t1 + .3, t1 + 1.2)));
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((1 - k) * .25 * (i - 1));
    ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-w / 2 + 8, -h / 2 + 12, w, h, 8); ctx.fill();
    ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 8); ctx.fill();
    ctx.fillStyle = mixHex(P.ind1, P.blue1, .4); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h * .27, [8, 8, 0, 0]); ctx.fill();
    for (const hx of [-.3, .3]) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(hx * w, -h / 2 + h * .06, Math.max(2, w * .018), 0, 6.29); ctx.fill(); }
    if (k > .6) { F.maskLine(ctx, [[MONTHS[i], 0]], 0, -h / 2 + h * .2, 46, F.rise(span(k, .6, 1)), { serif: false, weight: 700, col: CREAM, glow: false, align: 'center' });
      ctx.fillStyle = rgba(PAPER.edge, .5 * span(k, .7, 1)); for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) ctx.fillRect(-w / 2 + 26 + c * (w - 52) / 7, -h / 2 + h * .36 + r * h * .15, (w - 52) / 7 - 8, 3); }
    ctx.restore();
  }
  // the ground line (it draws out from the first leaf)
  { const u = smooth(span(t, a.fall + .3, a.fall + 1.6)); if (u > 0) { ctx.fillStyle = rgba(P.blue1, .6); ctx.fillRect(S.cal[0] - 400, S.gy - 1, (S.right + 600 - (S.cal[0] - 400)) * u, 2); } }
  // the stacks on the months (CLAIM stamps); the first gets one tick from the checkers, the rest stay NOT YET CHECKED
  for (let i = 0; i < 3; i++) {
    const n = stackN(i, t, a); if (n <= 0) continue;
    const tl = [a.claim - .15, a.claim + .45, a.month - .05][i];
    F.proofStack(ctx, t, S.cal[i], S.gy, S.sw, n, { seed: 8 + i, stamp: span(t, tl + .45, tl + .75), checked: i === 0 ? span(t, a.cant + .25, a.cant + .7) : 0 });
  }
  // the checkers: a short line of three (indigo), stamping slowly
  { const k = expoOut(span(t, a.big - .3, a.big + .6)); if (k > 0) S.check.forEach((x, j) => {
    const cyc = (t * .55 + j * .33) % 1, arm = cyc < .5 ? sineIO(cyc * 2) : 1 - sineIO((cyc - .5) * 2);
    ctx.save(); ctx.beginPath(); ctx.rect(x - 150, S.gy - 260, 300, 261); ctx.clip();
    F.person(ctx, x, S.gy + (1 - k) * 200, 128, { dir: -1, look: -.2, armR: [lerp(.4, 1.6, arm), lerp(1.2, 2.2, arm)], light: .4 });
    ctx.restore(); }); }
  // the mathematician before his paper of working; the stacks grow beside him and close in; a slot opens in the middle one
  if (t > a.big + .5) {
    const P0 = S.paper, pu = expoOut(span(t, a.c09 - .4, a.c09 + 1.2));
    if (pu > 0) {
      ctx.save(); ctx.globalAlpha *= smooth(pu);
      ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(P0.x + 10, P0.y + 14 + (1 - pu) * 80, P0.w, P0.h, 6); ctx.fill();
      ctx.fillStyle = lin(ctx, P0.x, P0.y, P0.x + P0.w, P0.y + P0.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(P0.x, P0.y + (1 - pu) * 80, P0.w, P0.h, 6); ctx.fill();
      ctx.restore();
      ctx.save(); ctx.translate(0, (1 - pu) * 80);
      // working: dark ink lines, written fast; a few boxed symbols
      const wr = (i) => [span(t, a.c09 + .2 + i * .16, a.c09 + .6 + i * .16), 0];
      ctx.save(); ctx.globalCompositeOperation = 'source-over';
      const n = WRITE.length, lh = (P0.h - 40) / (n + 1);
      for (let i = 0; i < n; i++) { const [u] = wr(i); if (u <= 0) continue; const pts = WRITE[i].map(([px, py]) => [P0.x + 40 + px * (P0.w - 80), P0.y + 20 + lh * (i + 1) + py * lh * .3]); const s = F.subPoly(pts, 0, u); ctx.strokeStyle = PAPER.ink; ctx.globalAlpha = .75; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); s.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
      ctx.restore(); ctx.restore();
    }
    const close = sineIO(span(t, a.watched, a.watched + 1.4));
    const sx = [lerp(S.left, S.left + 110, close), S.mid, lerp(S.right, S.right - 120, close)];
    const sn = [Math.pow(span(t, a.c09 + .5, a.watched + 2), 1.3) * 70, Math.pow(span(t, a.watched - .3, a.watched + 1.8), 1.2) * 92, Math.pow(span(t, a.c09 + .9, a.watched + 2.2), 1.3) * 64];
    // the mathematician (indigo, never yellow); he looks at his paper, then turns his head to the stacks
    const k = expoOut(span(t, a.c09 - .3, a.c09 + .8));
    if (k > 0) { ctx.save(); ctx.beginPath(); ctx.rect(S.tao - 300, S.gy - 600, 600, 601); ctx.clip(); F.person(ctx, S.tao, S.gy + (1 - k) * 380, 330, { dir: 1, look: lerp(.25, -.05, span(t, a.watched, a.watched + 1)), armR: [.5, 1.9], armL: [.15, .3], long: true, light: .55, lean: .02 }); ctx.restore(); }
    [0, 2, 1].forEach((i) => { if (sn[i] > 0) F.proofStack(ctx, t, sx[i], S.gy, i === 1 ? SLOT.w + 40 : S.sw, sn[i], { seed: 21 + i }); });
    const su = span(t, a.watched + 1.2, a.watched + 1.9); if (su > 0) F.slot(ctx, t, SLOT.x, SLOT.y, SLOT.w, SLOT.h, { u: su });
  }
}
