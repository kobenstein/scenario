// Film 55 · B2 (c07–c11) · ONE continuous take from 'Fourth in line stand' (plateFour) to 'That call was made inside' (plateHeld).
// All five chunk files return the SAME draw function (built once per T), so the inner chunk boundaries c07|c08|c09|c10|c11 are the
// same frame by construction (one camera path, one state). Plan: docs/shots.md 3.01–6.02 · world: docs/MOTION.md.
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                                 | carrier → next            |
// |-------|---------------------------------|------------------------------------------------------------------------------------|---------------------------|
// | 3.01  | Fourth in line stand            | out of plateFour, glide to the side door: it opens (cream), three defenders with tool cases walk in; PROJECT GLASSWING | the side door light |
// | 3.02★ | The lab gives an example        | a panel grows out of the side door: the code wall, zoom onto ONE line; cyan test light runs over it again and again, the counter races to 5,000,000; then ONE gold beam stops exactly on the flaw | the line |
// | 3.03  | And that was one                | the wall pulls back: over the whole wall cyan points glow; 129,000+ (source: VERIFIED · OWN COUNT)   | the panel folds into the side door |
// | 3.04  | Critics called it marketing     | a poster unrolls on the wall (the door, SAFETY); your phone rises: UPDATE READY · RESTART; out of its screen: bars, one over all: JULY · RECORD | the bars |
// | 3.05  | Found is not yet fixed          | the points again: some close (cyan), many wait (FOUND ≠ FIXED); the panel folds onto mark 4: the defenders step ahead | the whole line |
// | M.01  | This channel exists             | subscribe 1: the gold light runs down the whole line, front to your coat; SUBSCRIBE (one small line, no QR) | mark 5 |
// | 4.01★ | Fifth in line                   | you from behind, mark 5; the sheet JUNE 9 falls; the door opens a crack, gold rims your coat; a core flies out to your phone | the phone |
// | 4.02  | It's called Fable               | the kitchen out of your phone: the core in it; a gold thread to the door in the window; the bank letter flies into the phone; HACKING · BIOLOGY go to two older, matte cores | the window |
// | 4.03  | And by its maker's account      | out of the window into the sky: a page dated 2003 before a dark lensing ARC (never a disc); its empty half writes itself | the table |
// | 4.04  | Three personal subscriptions    | three phones on the table, a short proof tape with ticks runs out of them; 3 DAYS | the middle phone's core |
// | 4.05  | Yet one limit is built in       | the core up close: a small slider set low; the same core behind a door and in a phone, the same setting | your phone |
// | 5.01  | But the line doesn't end        | the kitchen folds into your phone; the camera turns wide: everyone behind you, to the horizon, some hooded | calendar sheets |
// | 5.02  | Within months of the Mythos     | APR … AUG fall; far back a smaller door opens, a download bar runs; ABOUT $4,400 | the sheet AUG |
// | 5.03  | So a locked door never          | back to the big door: a stack of calendar sheets grows in front of it (bought time); the top sheet flies to you | the sheet |
// | 5.04  | Switch on automatic             | the kitchen out of the sheet: phone, laptop, router; AUTO-UPDATE switches flip on; RESTART | the old router |
// | 5.05  | And a device too old            | the dusty old router; ✗; the plug comes out, its light dies; REPLACE · OR OFFLINE | the window |
// | 5.06  | That part is in your hands      | the whole kitchen, switches on, far in the window the door | your phone |
// | 6.01  | The rest is decided             | the kitchen folds into your phone; travel to the door; through the gap: the room, the tables where it is decided | the gap |
// | 6.02  | This fall, OpenAI planned       | the parcel ASTRA 6.1 slides up to the door and stops; HELD BACK lands; source → plateHeld | plateHeld |
import * as E from './f10_editorial.mjs';
import * as F from './f55_kit.mjs';
import * as S from './f55_seams.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, mixHex, halo, prng } = E;
const { rise, maskLine, GOLD, CHECK, LAMP, INK } = F;
const L = S.LINE, D = L.door, Y = L.you, TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------------------------- anchors (phrases only)
function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.T0 = G('Fourth in line stand'); a.letIn = G('let in', a.T0); a.software = G('software the world runs', a.T0);
  a.example = G('The lab gives an example'); a.single = G('single line of code', a.example); a.automated = G('Automated tests', a.example);
  a.five = G('five million times', a.example); a.fiveE = GE('five million', a.example); a.never = G('and never caught it', a.example); a.caughtE = GE('never caught it', a.example);
  a.one = G('And that was one'); a.count = G("By the lab's own count", a.one); a.hundred = G('hundred thousand', a.one);
  a.critics = G('Critics called it marketing'); a.marketing = G('marketing', a.critics); a.canbe = G('But it can be marketing', a.critics); a.real = G('still be real', a.critics);
  a.july = G('In July, Microsoft'); a.fixedW = G('fixed more security flaws', a.july); a.ever = G('than ever before', a.july); a.helps = G('helps defenders find more', a.july);
  a.found = G('Found is not yet fixed'); a.often = G('Often, months passed', a.found); a.still = G('Still, the time behind', a.found); a.repair = G('people who repair things', a.found);
  a.chan = G('This channel exists', a.found); a.everybody = G('well for everybody', a.chan); a.subscribe = G('Then subscribe', a.chan);
  a.fifth = G('Fifth in line'); a.you = G('You', a.fifth + .3); a.june = G('By June', a.fifth); a.opened = G('the door opened', a.june); a.partly = G('Partly', a.june); a.what = G('What came through', a.june);
  a.fable = G("It's called Fable"); a.same = G('same machine as Mythos', a.fable); a.ifF = G('So if Fable', a.fable); a.letter = G('bank letter', a.ifF); a.thatm = G('goes to that machine', a.ifF);
  a.hacking = G('high-risk hacking', a.ifF); a.bio = G('research biology', a.ifF); a.older = G('older ones', a.ifF);
  a.bh = G("And by its maker's account"); a.completed = G('completed a black-hole', a.bh); a.twenty = G('twenty years', a.bh); a.toomuch = G('Too much work', a.bh);
  a.three = G('Three personal subscriptions'); a.days = G('three days', a.three);
  a.limit = G('Yet one limit'); a.training = G('In training', a.limit); a.heldback = G('held back in the skills', a.limit); a.lockedv = G('In the locked version', a.limit); a.yours = G('and in yours', a.limit);
  a.lineEnd = G("But the line doesn't end"); a.behind = G('Behind you stands', a.lineEnd); a.attackers = G('Attackers included', a.lineEnd);
  a.within = G('Within months of the Mythos'); a.rival = G('a rival that came close', a.within); a.free = G('free for anyone', a.within); a.download = G('to download', a.free);
  a.strip = G('Stripping out', a.within); a.dollars = G('few thousand dollars', a.within);
  a.so = G('So a locked door never'); a.buys = G('It buys time', a.so); a.use = G('Use yours', a.so);
  a.switch = G('Switch on automatic'); a.phone2 = G('your phone', a.switch); a.laptop = G('your laptop', a.switch); a.router = G('your router', a.switch); a.restart = G('the restart', a.switch);
  a.protects = G('That protects you from attacks', a.switch); a.device = G('a device too old', a.switch); a.replace = G('Replace it', a.switch); a.offline = G('take it offline', a.switch); a.otherwise = G('Otherwise, a flaw', a.switch);
  a.hands = G('That part is in your hands'); a.rest = G('The rest is decided'); a.decided = G('decided behind the door', a.rest); a.sometimes = G('And sometimes', a.rest);
  a.fall = G('This fall, OpenAI'); a.astra = G('update to Astra', a.fall); a.calledOff = G('called the launch off', a.fall); a.offW = GE('called the launch off', a.fall);
  a.reason = G('The reported reason', a.fall); a.deceptive = G('more deceptive', a.fall);
  a.T1 = G('That call was made inside'); a.seam = a.T1 - S.SEAM_HALF;
  return a;
}

// ---------------------------------------------------------------------------------------------------------------- helpers
const plateC = (P0, k) => S.look(P0[0] + S.TRUCK * (k - 1) / S.CREEP * P0[2] / F.F0, P0[1], P0[2], P0[3] * k, P0[4], P0[5], P0[6] ?? S.HZ);
const outS = (t, b0, b1) => 1 - sineIO(span(t, b0, b1));                       // a soft exit (expo exits pop)
const io = (t, a0, a1, b0, b1) => rise(span(t, a0, a1)) * outS(t, b0, b1);
function words(ctx, s, x, y, size, u, o = {}) {
  if (u <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  maskLine(ctx, [[s, 0]], x, y, size, u, { serif: o.serif ?? false, weight: 600, col: o.col ?? P.core0, glow: o.glow ?? true, align: o.align });
  ctx.restore();
}
// monotone cubic through keys [[t, [v…]]] (no overshoot, a stop only where a key reverses)
function mono(t, K) {
  const n = K.length, T = K.map((k) => k[0]); if (t <= T[0]) return [...K[0][1]]; if (t >= T[n - 1]) return [...K[n - 1][1]];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < K[0][1].length; d++) {
    const sec = (j) => (K[j + 1][1][d] - K[j][1][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const p = sec(j - 1), q = sec(j); if (p * q <= 0) return 0; const m = (p + q) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(p), 3 * Math.abs(q)); };
    const p0 = K[i][1][d], p1 = K[i + 1][1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return out;
}
// the phone in your hand in the world (as c01): a small lit rect at the right hand
function phoneAt(c) { const p = S.proj(c, Y.x + 34, 96, Y.z); return p ? { x: p[0] - 4 * p[2], y: p[1] - 9 * p[2], w: 8 * p[2], h: 15 * p[2] } : null; }
// a portal's inside grows out of the thing (no pop): its content comes up over the first part of the opening
// … and floats a little inside (never a frozen panel): a slow push and drift about its centre
const fadeIn = (fn, t = 0) => (cx, w, h, m) => { cx.save(); cx.globalAlpha *= E.smooth(span(m, 0, .4)); const z = 1.045 + .015 * Math.sin(t * .23 + 1.1); cx.translate(w / 2 + E.drift(t * 1.4, 14, 3), h / 2 + E.drift(t * 1.4, 7, 6)); cx.scale(z, z); cx.translate(-w / 2, -h / 2); fn(cx, w, h, m); cx.restore(); };
const center = (r) => [r.x + r.w / 2, r.y + r.h / 2];
const PANEL = { x: 160, y: 90, w: 1600, h: 760 };                                  // explainer panels (bottom 850 < 880)
const FULL = { x: 0, y: 0, w: W, h: H };
// kitchen-local geometry (S.kitchen with w = W, h = H)
const KT = { ty: H * .66, wx: W * .64, wy: H * .14, ww: W * .27, wh: H * .38 };
const kz = (z, x, y) => [W / 2 + (x - z.x) * z.s, H / 2 + (y - z.y) * z.s];
const kRect = (z, x, y, w, h) => { const [sx, sy] = kz(z, x, y); return { x: sx, y: sy, w: w * z.s, h: h * z.s }; };
function inZoom(ctx, z, fn) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z.s, z.s); ctx.translate(-z.x, -z.y); fn(); ctx.restore(); }

// ---------------------------------------------------------------------------------------------------------------- world cameras
const CAM = {
  side: S.look(7550, 420, 14800, 4.5, 900, 540),             // the side door close, the big door's gold gap at the left edge
  side1: S.look(7600, 420, 14800, 4.9, 900, 540),
  side2: S.look(7700, 420, 14800, 5.6, 900, 540),
  poster: S.look(6800, 2150, 14800, 3.05, 760, 470),          // the poster on the wall between the doors
  poster1: S.look(6860, 2150, 14800, 3.5, 760, 470),
  def: S.look(-230, 140, 3100, 1.85, 1010, 640, 520),         // mark 4, the defenders (rhymes with plateFour)
  def1: S.look(-150, 140, 3300, 1.95, 1010, 640, 520),
  front: S.look(2500, 200, 12400, 1.15, 1060, 660, 560),       // subscribe: the head of the line in the gold, then back over the whole line to your coat
  wide: S.look(1500, 0, 7400, .62, 960, 720, 520),
  wide1: S.look(1000, 0, 6600, .82, 960, 720, 520),
  back: S.look(Y.x + 110, 120, Y.z, 2.0, 520, 640, 700),      // you from behind, the door far back right
  back1: S.look(Y.x + 110, 120, Y.z, 2.25, 520, 640, 700),
  near: S.look(Y.x + 160, 105, Y.z, 2.3, 760, 690),           // you close, the phone at your hand (as c01)
  near1: S.look(Y.x + 160, 105, Y.z, 2.5, 760, 690),
  tail: S.look(-3000, 300, 6000, .8, 700, 560, 520),          // you, and everyone behind you curving away to the horizon at the left
  tail1: S.look(-3150, 300, 6300, .86, 700, 560, 520),
  rival: S.look(-6500, 700, 24000, 2.2, 1060, 520),           // far back: the smaller door
  rival1: S.look(-6440, 700, 24000, 2.65, 1060, 520),
  over: { ...S.look(0, 0, 10000), x: -1200, y: -1400, z: 9600, hz: 620 },   // rival → stack: an arc high over the line (never through the people)
  stack: S.look(D.x + 300, 1500, D.z - 900, 1.35, 900, 520),  // the big door, the stack of sheets in front of it
  stack1: S.look(D.x + 400, 1400, D.z - 900, 1.45, 900, 520),
  doorA: S.look(D.x, 3600, D.z, 1.5, 960, 520),
  doorA1: S.look(D.x, 3600, D.z, 1.68, 960, 520),
  parcel: S.look(D.x - 650, 1800, D.z, 1.72, 960, 440, 600),
};
const RIVAL = { x: -6500, z: 24000, w: 900, h: 1700 };
const STACK = { x: D.x + 1150, z: D.z - 1500, s: 1000, th: 36 };
const POSTER = { x: 6800 - D.x, top: -2950, h: 1600, w: 1060 };

function keys(a) {
  return [
    [a.T0 + .5, plateC(S.FOUR_P, 1.015)], [a.T0 + 1.1, plateC(S.FOUR_P, 1.033)],
    [a.letIn + .5, CAM.side], [a.example + .5, CAM.side1], [a.critics - .1, CAM.side2],
    [a.marketing + 1.0, CAM.poster], [a.july + .9, CAM.poster1],
    [a.still - .3, CAM.def], [a.repair + 1.0, CAM.def1],
    [a.chan + 2.2, CAM.front], [a.everybody + 1.2, CAM.wide], [a.subscribe + .6, CAM.wide1],
    [a.you + .5, CAM.back], [a.what + .2, CAM.back1],
    [a.fable + .5, CAM.near], [a.lineEnd + 1.0, CAM.near1],
    [a.behind + 1.6, CAM.tail], [a.attackers + .9, CAM.tail1],
    [a.rival + .4, CAM.rival], [a.dollars + .8, CAM.rival1],
    [a.so + .95, CAM.over], [a.so + 2.9, CAM.stack], [a.switch + .5, CAM.stack1],
    [a.hands - 1.0, CAM.near], [a.hands + 2.15, CAM.near1],
    [a.decided + 1.7, CAM.doorA], [a.fall - .2, CAM.doorA1],
    [a.astra + .6, CAM.parcel], [a.seam, S.HELD_CAM],
  ];
}
// kitchen inner camera (x, y, log s)
function kzKeys(a) {
  const k = (t, x, y, s) => [t, [x, y, Math.log(s)]];
  return [
    k(a.fable - .2, 960, 540, 1.0), k(a.same + .3, 1060, 480, 1.1), k(a.thatm, 1020, 505, 1.2), k(a.older + .5, 1110, 500, 1.32),
    k(a.bh + .5, 1488, 356, 1.9), k(a.three - .8, 1488, 356, 2.1), k(a.three + 1.5, 960, 650, 1.45), k(a.lineEnd, 1000, 640, 1.75),
    k(a.use + .3, 800, 520, 1.18), k(a.router + .6, 760, 520, 1.32), k(a.device + .3, 470, 600, 1.42), k(a.otherwise + .6, 440, 615, 1.58),
    k(a.hands - .1, 960, 540, 1.02), k(a.rest, 960, 540, 1.05),
  ];
}

// ---------------------------------------------------------------------------------------------------------------- panel insides
// 3.02–3.03: the code wall, one line, the tests, the gold beam; then the wall full of found points
const HR = 29, RH = 34, FLAW = { x: 940, y: -600 + HR * RH + RH / 2 };
function codePanel(cx, t, w, h, a) {
  cx.fillStyle = mixHex(P.night0, P.night1, .6); cx.fillRect(0, 0, w, h);
  const zin = sineIO(span(t, a.single - .8, a.single + 1.0)), zout = sineIO(span(t, a.one - .1, a.count + .9));
  const s = lerp(lerp(1, 2.6, zin), .8, zout) * (1 + .012 * (t - a.example)), fx = lerp(800, FLAW.x, zin), fy = lerp(380, FLAW.y, zin);
  cx.save(); cx.translate(w / 2, h / 2); cx.scale(s, s); cx.translate(-fx, -fy);
  F.codeWall(cx, t, -800, -600, w + 1600, h + 1200, { seed: 55, rowH: RH, a: 1 - .62 * zout });
  const sel = zin * (1 - zout);
  if (sel > 0) for (const [x0, x1] of [[-400, -262], [-240, -64], [-46, 46], [64, 196], [214, 372]]) { cx.fillStyle = rgba(mixHex(P.ind2, P.blue1, .7), .95 * sel); cx.fillRect(FLAW.x + x0, FLAW.y - RH * .28, x1 - x0, RH * .56); }
  if (sel > 0) { cx.strokeStyle = rgba(P.cream, .55 * sel); cx.lineWidth = 2 / Math.max(1, zin * 2.6); cx.strokeRect(FLAW.x - 430, FLAW.y - RH * .45, 860, RH * .9); }
  // the tests: a cyan light runs over the line, again and again, faster (never stops at the flaw)
  const t0 = a.automated - .1, tt = Math.max(0, t - t0), f = tt * 1.1 + tt * tt * .22, sw = span(t, t0, t0 + .4) * outS(t, a.never, a.never + .5);
  if (sw > 0 && tt > 0) { const ph = f % 1; F.accentSpan(cx, [[FLAW.x - 420, FLAW.y], [FLAW.x + 420, FLAW.y]], Math.max(0, ph * 1.3 - .3), Math.min(1, ph * 1.3), { w: 3, a: sw }); }
  // the gold beam: ONE, it stops exactly on the flaw
  const bu = expoOut(span(t, a.caughtE - .32, a.caughtE)), bf = 1 - .75 * span(t, a.caughtE + .4, a.caughtE + 1.8);
  if (bu > 0) {
    F.accentSpan(cx, [[FLAW.x, FLAW.y - 700], [FLAW.x, FLAW.y - 8]], 0, bu, { col: GOLD, w: 3.2, a: bf, spark: bu < 1 });
    const g = span(t, a.caughtE - .05, a.caughtE + .25) * (1 - .3 * zout);
    if (g > 0) { halo(cx, FLAW.x, FLAW.y, 90, .55 * g, GOLD.halo, GOLD.core); cx.fillStyle = rgba(GOLD.body, .95 * g); cx.fillRect(FLAW.x - 46, FLAW.y - 9, 92, 18); }
  }
  // 3.03: the points over the whole wall (the flaws the partners found), cyan = verified
  const du = span(t, a.count - .2, a.hundred + 1.0);
  if (du > 0) F.dotField(cx, t, { x: -800, y: -600, w: w + 1600, h: h + 1200, n: 2600, layout: 'scatter', r: 4.2, seed: 129, u: du, on: () => .85, onCol: CHECK });
  cx.restore();
  // the counter (panel px, not zoomed): races to 5,000,000 on "five million"
  const cu = io(t, a.automated + .1, a.automated + .7, a.one + .2, a.one + .9);
  if (cu > 0) {
    const v = Math.round(5e6 * Math.pow(span(t, a.automated + .3, a.fiveE), 2.2) / (span(t, a.automated + .3, a.fiveE) >= 1 ? 1 : 1));
    const str = (span(t, a.automated + .3, a.fiveE) >= 1 ? 5e6 : v).toLocaleString('en-US');
    maskLine(cx, [[str, 0]], w - 70, 150, 112, cu, { serif: true, align: 'right', col: P.core0, glow: true });
  }
  const nu = io(t, a.hundred - .3, a.hundred + .4, a.critics - .5, a.critics + .2);
  if (nu > 0) {
    cx.save(); cx.fillStyle = rgba(P.night1, .55 * nu); cx.fillRect(40, 40, 640, 210); cx.restore();
    maskLine(cx, [['129,000+', 0]], 80, 190, 132, nu, { serif: true, col: P.core0, glow: true });
  }
}
// 3.04–3.05: monthly fixes as slabs (one over all: JULY · RECORD), then the points: found, some fixed
const BARS = [.40, .36, .47, .43, .45, .5];
function barsPanel(cx, t, w, h, a) {
  cx.fillStyle = mixHex(P.night1, P.ind1, .3); cx.fillRect(0, 0, w, h);
  { const m = cx.getTransform(); cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); F.paper(cx, t, { x: -m.e, y: -m.f }); cx.restore(); }
  const sink = sineIO(span(t, a.found - .4, a.found + .5));
  if (sink < 1) {
    cx.save(); cx.translate(0, 80 * sink); cx.globalAlpha *= 1 - sink;
    BARS.forEach((v, k) => F.slab(cx, t, 330, 170 + k * 74, 900 * v, 30, { col: 'stone', u: span(t, a.july + .5 + k * .18, a.july + 1.3 + k * .18) }));
    const ju = span(t, a.fixedW - .2, a.ever + .4), pulse = 1 + .25 * F.bump(t, a.helps, 1.4);
    F.slab(cx, t, 330, 170 + 6 * 74, 960, 34, { col: 'check', u: ju, label: 'JULY', value: 'RECORD', size: 28, vsize: 44 });
    if (ju > .9) halo(cx, 330 + 960, 170 + 6 * 74, 120 * pulse, .25 * span(ju, .9, 1), CHECK.halo, CHECK.core);
    cx.restore();
  }
  // FOUND ≠ FIXED: the points rise, a few close (cyan), many wait
  const pu = span(t, a.found - .1, a.found + 1.3);
  if (pu > 0) {
    F.dotField(cx, t, { x: 300, y: 210, w: 1000, h: 440, n: 160, cols: 16, layout: 'grid', r: 10, seed: 37, u: pu, onCol: CHECK,
      on: (k) => ((k * 7) % 10 < 3 ? span(t, a.often - .3 + (k % 13) * .16, a.often + .2 + (k % 13) * .16) : 0) });
    const tu = io(t, a.found, a.found + .6, a.still + .2, a.still + .8);
    if (tu > 0) F.accentText(cx, [['FOUND ', 0], ['≠ ', 0], ['FIXED', 1]], 300, 160, 64, tu, { serif: false, weight: 600 });
  }
}
// 4.03: out of the window: a page dated 2003 before a dark lensing arc (never a full disc); its empty half writes itself
const PAGE = { x: 560, y: 170, w: 600, h: 660 };
function skyPage(cx, t, w, h, a, m = 1) {
  cx.save(); cx.globalAlpha *= E.smooth(span(m, 0, .45));
  const zk = 1 + .03 * Math.max(0, t - a.bh); cx.translate(w / 2 + E.drift(t * 1.6, 22, 7), h / 2 + E.drift(t * 1.6, 12, 9)); cx.scale(zk, zk); cx.translate(-w / 2, -h / 2);
  cx.fillStyle = E.lin(cx, 0, 0, 0, h, [[0, P.night0], [1, mixHex(P.night1, P.ind1, .5)]]); cx.fillRect(0, 0, w, h);
  E.stars(cx, 5571, 120, t, [0, 0, w, h], .55);
  const bx = 1080, by = 470, R = 330;
  cx.save(); cx.globalAlpha *= E.smooth(span(m, .1, .75));
  cx.save(); cx.fillStyle = E.rad(cx, bx, by, R * 1.5, [[0, rgba(P.night0, .95)], [.55, rgba(P.night0, .8)], [1, rgba(P.night0, 0)]]); cx.fillRect(bx - R * 1.6, by - R * 1.6, R * 3.2, R * 3.2); cx.restore();
  // the lensing arcs (partial, light bent around the dark): two thin bows, slowly turning
  const rot = (t - a.bh) * .03;
  for (const [r0, a0, a1, al] of [[R, -2.9, -.25, .9], [R * 1.08, .25, 1.35, .55], [R * .93, 2.1, 2.75, .4]]) {
    for (const [lw, k, col] of [[14, .18, GOLD.halo], [5, .5, GOLD.body], [1.8, .9, GOLD.core]]) { cx.strokeStyle = rgba(col, k * al); cx.lineWidth = lw; cx.lineCap = 'round'; cx.beginPath(); cx.arc(bx, by, r0, a0 + rot, a1 + rot); cx.stroke(); }
  }
  // the page (in front, left of the dark)
  const pr = -.035 + .006 * Math.sin(t * .4);
  cx.save(); cx.translate(PAGE.x + PAGE.w / 2, PAGE.y); cx.rotate(pr);
  cx.fillStyle = rgba(P.night0, .45); cx.fillRect(-PAGE.w / 2 + 14, 14, PAGE.w, PAGE.h);
  cx.fillStyle = mixHex(P.cream, '#e6dcbc', .55); cx.fillRect(-PAGE.w / 2, 0, PAGE.w, PAGE.h);
  E.glowText(cx, '2003', -PAGE.w / 2 + 48, 96, { size: 70, serif: true, col: P.night1, glow: false });
  const r = prng(2003);
  for (let k = 0; k < 13; k++) {
    const yy = 150 + k * 37, lw = (PAGE.w - 100) * (.55 + r() * .4), old = k < 6;
    const u = old ? 1 : clamp((t - a.completed - .2) * 1.6 - (k - 6) * .55);
    if (u <= 0) continue;
    cx.fillStyle = old ? rgba(mixHex(P.night1, P.blue1, .5), .55) : rgba(mixHex(GOLD.deep, P.night1, .3), .9); cx.fillRect(-PAGE.w / 2 + 48, yy, lw * expoOut(u), 7);
    if (!old && u < 1) halo(cx, -PAGE.w / 2 + 48 + lw * expoOut(u), yy + 3, 26, .5, GOLD.halo, GOLD.core);
  }
  cx.restore();
  cx.restore();
  cx.restore();
}
// 4.05: the core up close, a small slider set low; then the same core behind a door and in a phone, the same setting
function sliderOn(cx, x, y, s, v, a = 1) {
  const tw = s * .5, th = Math.max(2, s * .02);
  cx.save(); cx.globalAlpha *= a;
  cx.fillStyle = rgba(P.night1, .55); cx.beginPath(); cx.roundRect(x - tw / 2 - th * 2, y - th * 3, tw + th * 4, th * 6, th * 3); cx.fill();
  cx.fillStyle = rgba(P.cream, .3); cx.fillRect(x - tw / 2, y - th / 4, tw, th / 2);
  for (let k = 0; k <= 4; k++) { cx.fillStyle = rgba(P.cream, .35); cx.fillRect(x - tw / 2 + tw * k / 4 - th / 4, y - th * 1.6, th / 2, th * 3.2); }
  cx.fillStyle = rgba(P.cream, .9); cx.fillRect(x - tw / 2, y - th / 2, tw * v, th);
  const kx = x - tw / 2 + tw * v;
  cx.fillStyle = P.cream; cx.beginPath(); cx.roundRect(kx - s * .022, y - s * .06, s * .044, s * .12, s * .012); cx.fill();
  cx.strokeStyle = rgba(P.night1, .6); cx.lineWidth = Math.max(1, s * .004); cx.stroke();
  cx.restore();
}
function limitPanel(cx, t, w, h, a) {
  cx.fillStyle = mixHex(P.night1, P.ind1, .3); cx.fillRect(0, 0, w, h);
  { const m = cx.getTransform(); cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); F.paper(cx, t, { x: -m.e, y: -m.f }); cx.restore(); }
  const v = lerp(.82, .26, sineIO(span(t, a.heldback - .1, a.heldback + 1.1)));       // held back in training (anticipation: a small lift first)
  const ant = .04 * F.bump(t, a.heldback - .45, .5), vv = Math.min(.9, v + ant);
  const sp = sineIO(span(t, a.lockedv - .4, a.lockedv + 1.0));                          // the split: the same core behind the door and in a phone
  const bx = lerp(w / 2, 520, sp), bs = lerp(420, 330, sp);
  if (sp > 0) {   // the door behind the left core (a dark frame, its gold edge)
    cx.save(); cx.globalAlpha *= sp; const dw = 300, dh = 480, dx = bx - dw / 2, dy = 360 - dh / 2 - 20;
    cx.fillStyle = mixHex(P.night0, P.ind0, .3); cx.fillRect(dx - 24, dy - 24, dw + 48, dh + 24);
    cx.fillStyle = mixHex(P.night1, P.ind2, .5); cx.fillRect(dx, dy, dw, dh);
    cx.fillStyle = rgba(GOLD.core, .9); cx.fillRect(dx + dw - 6, dy, 6, dh); cx.fillRect(dx, dy, dw, 4);
    cx.restore();
  }
  F.core(cx, t, bx, 360, bs, { glow: 1 });
  sliderOn(cx, bx, 360, bs, vv);
  const pinU = span(t, a.heldback + 1.1, a.heldback + 1.6);
  if (pinU > 0) { const tw = bs * .5, kx = bx - tw / 2 + bs * .02 + (tw - bs * .04) * vv; cx.fillStyle = rgba(P.cream, .9 * pinU); cx.fillRect(kx - 2, 360 + bs * .07, 4, bs * .06 * pinU); }
  if (sp > 0) {   // the phone (yours): grows out of the core and moves right; the same slider in its core
    const px = lerp(w / 2, 1100, sp), ps = lerp(80, 470, sp);
    const lit = .6 + .4 * span(t, a.yours - .2, a.yours + .4);
    const r = F.phone(cx, t, px, 380, ps, { lit, a: span(sp, 0, .25) });
    if (r) { const cs = r.w * .72; F.core(cx, t, px, 380 - r.h * .1, cs, { glow: 1, a: span(sp, .1, .4) }); sliderOn(cx, px, 380 - r.h * .1, cs, vv, span(sp, .2, .5)); }
  }
}
// the door you see far away in the kitchen window (on the horizon, left pane): its gold gap
function windowDoor(ctx, t, a = 1) {
  const { wx, wy, ww, wh } = KT, gy = wy + wh * .8;
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip(); ctx.globalAlpha *= a;
  const dx = wx + ww * .24, dh = wh * .42, dw = dh * .5;
  ctx.fillStyle = mixHex(P.night1, P.ind1, .3); ctx.fillRect(dx - dw / 2, gy - dh, dw, dh);
  ctx.fillStyle = rgba(GOLD.body, .35); ctx.fillRect(dx - dw / 2, gy - dh, 1.5, dh);
  const g = .85 + .1 * Math.sin(t * .7 + .4);
  ctx.fillStyle = E.lin(ctx, 0, gy - dh * .3, 0, gy + wh * .12, [[0, rgba(GOLD.halo, .35 * g)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(dx - dw * .6, gy, dw * 1.6, wh * .12);
  ctx.fillStyle = rgba(GOLD.core, g); ctx.fillRect(dx + dw / 2 - 3, gy - dh, 4, dh); ctx.fillRect(dx - dw / 2, gy - dh, dw, 2.5);
  halo(ctx, dx + dw / 2, gy - dh * .5, dh * .9, .3, GOLD.halo, GOLD.core);
  ctx.restore();
  return [dx + dw / 2, gy - dh * .55];
}
// a toggle: AUTO-UPDATE (off: indigo, on: cyan)
function toggle(ctx, x, y, u, on) {
  if (u <= 0) return; const k = expoOut(clamp(u)), o = sineIO(clamp(on));
  ctx.save(); ctx.translate(x, y + (1 - k) * 30); ctx.globalAlpha *= rise(u);
  E.glowText(ctx, 'AUTO-UPDATE', 0, -30, { size: 22, weight: 600, spacing: .1, align: 'center', col: P.cream, glow: false });
  ctx.fillStyle = mixHex(mixHex(P.ind2, P.blue1, .3), CHECK.body, o); ctx.beginPath(); ctx.roundRect(-36, -16, 72, 32, 16); ctx.fill();
  if (o > 0) halo(ctx, 0, 0, 70, .3 * o, CHECK.halo, CHECK.core);
  ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(lerp(-20, 20, o), 0, 12, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------------------------------------------------------- the scene
export function build(T) {
  E.prepareEditorial();
  const a = anchors(T), K = keys(a), KZ = kzKeys(a);
  const kZoom = (t) => { const v = mono(t, KZ); return { x: v[0] + E.drift(t * 1.8, 22, 3), y: v[1] + E.drift(t * 1.8, 13, 5), s: Math.exp(v[2]) * (1 + .01 * Math.sin(t * .37)) }; };
  // world state over time
  const defOff = (t) => .03 * sineIO(span(t, a.still + .5, a.repair + .7)) * (1 - span(t, a.fable + 1.4, a.fable + 1.6));
  const wave = (t, p) => rise(span(t, a.chan + .3 + (1 - p) * 3.2, a.chan + 1.3 + (1 - p) * 3.2)) * (1 - span(t, a.fable + 1.4, a.fable + 1.6));
  const doorOpen = (t) => .5 * sineIO(span(t, a.opened - .3, a.opened + 1.0)) * (1 - span(t, a.fable + 1.4, a.fable + 1.6));
  const sideOpen = (t) => sineIO(span(t, a.letIn - .6, a.letIn + .6)) * (1 - sineIO(span(t, a.critics + .8, a.critics + 2.0)));

  function worldState(t, c) {
    const st = {};
    st.open = doorOpen(t);
    st.side = { open: sideOpen(t) };
    st.mark = (i) => {
      const four = i === 3 ? 1 : .3, w = rise(span(t, a.chan + .3 + i * .8, a.chan + 1.1 + i * .8));
      const five = i === 4 ? rise(span(t, a.you - .2, a.you + .4)) : 0;
      const back = span(t, a.fable + 1.4, a.fable + 1.6);
      const relax = i === 3 ? lerp(1, .55, span(t, a.letIn, a.letIn + 2)) : .3;
      return { lit: lerp(Math.max(relax, w, five, i === 3 ? lerp(four, .55, span(t, a.letIn, a.letIn + 2)) : 0), .3, back) };
    };
    st.person = (k, q) => {
      const o = {};
      if (q.st === 3) {
        o.look = lerp(.35, .15, span(t, a.letIn, a.letIn + 2.5));
        const off = defOff(t); if (off > 0) { const p = S.linePt(q.p + off); o.x = p.x; o.z = p.z; o.gold = .35 + .6 * q.p + .35 * span(off, 0, .03); }
      }
      const wv = wave(t, q.p); if (wv > 0) o.gold = lerp(o.gold ?? (.35 + .6 * q.p), 1, wv);
      return o;
    };
    const hold = span(t, a.what + .3, a.fable - .3) * (1 - span(t, a.fable + 1.4, a.fable + 1.6)) + span(t, a.lineEnd - 1, a.lineEnd - .9) * (1 - span(t, a.behind - .2, a.behind + .8))
      + span(t, a.hands - 1.0, a.hands - .9) * (1 - span(t, a.rest + .2, a.rest + 1.2));
    const lookUp = lerp(.55, .9, span(t, a.you, a.opened)) * (1 - .5 * span(t, a.what + .3, a.fable)) ;
    const coatGold = Math.max(wave(t, 0), rise(span(t, a.opened, a.opened + 1.1)) * (1 - span(t, a.fable + 1.4, a.fable + 1.6)));
    st.you = { o: { look: lookUp, armR: [lerp(.2, .62, clamp(hold)), lerp(.1, 2.35, clamp(hold))], rim: coatGold > .02 ? mixHex(mixHex(P.coat, P.core1, .75), GOLD.core, coatGold) : undefined } };
    // the poster on the wall (3.04): unrolls on "marketing"; taken down while the camera is far away (5.02)
    const pu = sineIO(span(t, a.marketing - .3, a.marketing + 1.0)) * (t < a.rival + 1.5 ? 1 : 0);
    st.wall = (ctx) => {
      if (pu <= 0) return;
      const { x, top, h, w } = POSTER, vh = h * pu;
      ctx.save(); ctx.fillStyle = rgba(P.night0, .5); ctx.fillRect(x - w / 2 + 30, top + 30, w, vh);
      ctx.fillStyle = mixHex(P.blue1, P.ind2, .55); ctx.fillRect(x - w / 2, top, w, vh);
      ctx.beginPath(); ctx.rect(x - w / 2, top, w, vh); ctx.clip();
      ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 14; ctx.strokeRect(x - w / 2 + 40, top + 40, w - 80, h - 80);
      const dw = 360, dh = 720, dx = x - dw / 2, dy = top + 170;
      ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(dx - 40, dy - 40, dw + 80, dh + 40); ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(dx, dy, dw, dh);
      ctx.fillStyle = rgba(GOLD.core, .95); ctx.fillRect(dx + dw - 22, dy, 22, dh); ctx.fillRect(dx, dy, dw, 14); ctx.fillStyle = rgba(GOLD.body, .4); ctx.fillRect(dx, dy, 6, dh);
      ctx.fillStyle = E.lin(ctx, 0, dy + dh, 0, dy + dh + 260, [[0, rgba(GOLD.halo, .55)], [1, rgba(GOLD.halo, 0)]]); ctx.fillRect(dx - 140, dy + dh, dw + 280, 260);
      E.glowText(ctx, 'SAFETY', x, top + h - 170, { size: 170, weight: 600, spacing: .14, align: 'center', col: P.cream, glow: false });
      ctx.restore();
      ctx.fillStyle = mixHex(P.cream, P.halo2, .5); ctx.fillRect(x - w / 2 - 20, top + vh - 24, w + 40, 48);   // the roll
    };
    // the smaller door far back (5.02) and the stack of sheets at the big door (5.03)
    const rOpen = sineIO(span(t, a.free - .4, a.free + .8));
    const rivalOn = t > a.behind && t < a.switch + 1;
    st.floor = rivalOn ? (ctx) => S.at(ctx, c, RIVAL.x, RIVAL.z, () => {
      const { w, h } = RIVAL;
      ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(-w / 2 - 90, -h - 90, w + 180, h + 90);
      ctx.fillStyle = E.lin(ctx, 0, -h, 0, 0, [[0, mixHex(LAMP.body, GOLD.halo, .4)], [1, mixHex(LAMP.core, GOLD.core, .4)]]); ctx.fillRect(-w / 2, -h, w, h);
      const lw = w * (1 - .7 * rOpen); ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(-w / 2, -h, lw, h);
      if (rOpen > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, w * .2, -h * .4, w * 2.2, [[0, rgba(LAMP.body, .22 * rOpen)], [1, rgba(LAMP.body, 0)]]); ctx.fillRect(-w * 2.4, -h * 2, w * 5, h * 2.2); ctx.restore(); }
      ctx.fillStyle = rgba(LAMP.core, .5 + .4 * rOpen); ctx.fillRect(-w / 2 + lw, -h, Math.max(14, w - lw), 10);
    }) : null;
    const fw = span(t, a.chan + .3, a.chan + 3.8) * (1 - span(t, a.fable + 1.4, a.fable + 1.6)), fwOut = 1 - .5 * span(t, a.fifth, a.fifth + 1.5);
    if (fw > 0) { const prev = st.floor; st.floor = (ctx) => { if (prev) prev(ctx);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      const pf = 1 - fw * 1.05, n = 24;
      for (let i = 0; i < n; i++) { const p0 = 1 - i / n, p1 = 1 - (i + 1) / n; if (p1 < pf - .05) break;
        const A = S.linePt(p0), B = S.linePt(p1), hw = 520, al = .36 * fwOut * clamp((p1 - pf) / .08 + 1) * (.6 + .4 * p0);
        const q = [S.proj(c, A.x - hw + 40, 0, A.z), S.proj(c, A.x + hw + 40, 0, A.z), S.proj(c, B.x + hw + 40, 0, B.z), S.proj(c, B.x - hw + 40, 0, B.z)]; if (q.some((v) => !v)) continue;
        ctx.fillStyle = rgba(GOLD.halo, al); ctx.beginPath(); q.forEach((v, j) => (j ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1]))); ctx.closePath(); ctx.fill(); }
      ctx.restore(); }; }
    const stackOn = t > a.so && t < a.switch + 1;
    const SF = [0, 1, 2, 3, 4].map((k) => a.buys - .2 + k * .3), sn = 4 + SF.filter((tf) => t >= tf + .45).length + 3 * sineIO(span(t, a.so + 1.6, a.so + 3.2));
    st.extra = (ctx) => {
      // 3.01 the defenders walk in through the side door (tool cases), out of the left of the frame
      if (t > a.T0 + .5 && t < a.example + 2) for (let k = 0; k < 3; k++) {
        const u = span(t, a.letIn - 1.4 + k * .45, a.software + 1.6 + k * .45), x = lerp(6000 - k * 260, 8020, u), z = lerp(D.z - 1500 - k * 120, D.z - 40, u), fa = 1 - span(u, .9, 1);
        const f = S.proj(c, x, 0, z); if (!f || fa <= 0) continue;
        F.queuer(ctx, t, f[0], f[1], 190 * f[2], { seed: 811 + k * 7, kind: 'tools', walk: t * 6.2 + k * 1.7, view: 'side', dir: 1, gold: .15, a: fa });
      }
      if (stackOn) S.at(ctx, c, STACK.x, STACK.z, () => {
        const th = STACK.th, top = -(STACK.s * 1.12 + (sn - 1) * th);
        F.calStack(ctx, t, 0, top, STACK.s, sn, 'AUG', '', { thick: th / (STACK.s * .012) });
        for (const tf of SF) { const u = span(t, tf, tf + .45); if (u <= 0 || u >= 1) continue; F.calSheet(ctx, t, 0, lerp(top - 4200, top - th, u * u), STACK.s, 'AUG', '', { rot: .25 * (1 - u) }); }
      });
      // 6.02 the parcel slides up to the door and stops; HELD BACK lands on "off"
      if (t > a.fall - .2) {
        const pu2 = span(t, a.fall + .1, a.astra + .7), e = 1 - Math.pow(1 - pu2, 3), x = lerp(D.x - 5200, S.HELD_PARCEL.x, e);
        const tilt = .05 * Math.sin(Math.PI * pu2) * (1 - pu2) - .02 * F.bump(t, a.astra + .55, .5);
        if (pu2 >= 1 && t > a.offW + .45) S.heldParcel(ctx, c, t, { stampT0: a.offW });
        else S.at(ctx, c, x, S.HELD_PARCEL.z, () => { ctx.rotate(tilt); S.parcel(ctx, t, 0, 0, S.HELD_PARCEL.s, { label: 'ASTRA 6.1', stamp: t > a.offW - .25 ? 'HELD BACK' : null, stampT0: a.offW }); });
      }
      // gold rims your coat when the door opens (4.01) / the subscribe wave reaches you: a soft painted pool at your feet
      if (coatGold > .02) { const f = S.proj(c, Y.x, 0, Y.z); if (f) { ctx.save(); ctx.translate(f[0] + 20 * f[2], f[1]); ctx.scale(1, .28); const rr = 280 * f[2]; ctx.fillStyle = E.rad(ctx, 0, 0, rr, [[0, rgba(GOLD.halo, .32 * coatGold)], [1, rgba(GOLD.halo, 0)]]); ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.fill(); ctx.restore(); } }
      // your phone in your hand (when you hold it)
      const ph = clamp(hold) * (t > a.what ? 1 : 0); if (ph > 0) { const r = phoneAt(c); if (r) { halo(ctx, r.x + r.w / 2, r.y + r.h / 2, Math.max(18, r.h * 3), .45 * ph, LAMP.body, LAMP.core); ctx.fillStyle = rgba(mixHex(LAMP.core, P.cream, .4), ph); ctx.fillRect(r.x, r.y, r.w, r.h); } }
    };
    return st;
  }

  // the kitchen with everything B2 puts in it, drawn full-screen (local = screen at m = 1)
  function kitchenK(ctx, t, z, part) {
    const ty = KT.ty;
    let ko;
    if (part === 1) {
      const lift = span(t, a.thatm - .7, a.thatm + .3);
      ko = { zoom: z, letter: 1 - lift, you: { look: .05, hold: 1 }, phone: { lit: 1, core: 1 }, window: { a: 1 } };
    } else {
      const rs = span(t, a.restart - .1, a.restart + 1.2);
      ko = { zoom: z, letter: 0, you: { look: lerp(.05, -.15, span(t, a.device, a.device + 1) * (1 - span(t, a.hands - .6, a.hands + .4))), hold: lerp(1, .7, span(t, a.device, a.device + 1) * (1 - span(t, a.hands - .6, a.hands + .4))) },
        phone: { lit: 1, core: .8, screen: (cx, w, h) => { if (rs <= 0) return; cx.fillStyle = rgba(P.night1, .8 * rise(rs)); cx.fillRect(w * .12, h * .62, w * .76, h * .09); cx.fillStyle = rgba(CHECK.body, rise(rs)); cx.fillRect(w * .12, h * .62, w * .76 * expoOut(rs), h * .09); } },
        devices: { laptop: 1, router: 1, old: 1 }, window: { a: 1 } };
    }
    const kr = S.kitchen(ctx, t, W, H, ko);
    inZoom(ctx, z, () => {
      const wd = windowDoor(ctx, t);
      const pr = kr.phone, pc = pr ? [pr.x + pr.w / 2, pr.y + pr.h * .38] : [840, 380];
      if (part === 1) {
        // the gold thread: the core in your phone = the machine behind the door (in the window)
        const th = span(t, a.same - .2, a.same + .9) * outS(t, a.ifF + .4, a.ifF + 1.2);
        const cq = [lerp(pc[0], wd[0], .5), Math.min(pc[1], wd[1]) - 110], bez = Array.from({ length: 24 }, (_, i) => { const u = i / 23; return [(1 - u) * (1 - u) * pc[0] + 2 * u * (1 - u) * cq[0] + u * u * wd[0], (1 - u) * (1 - u) * pc[1] + 2 * u * (1 - u) * cq[1] + u * u * wd[1]]; });
        if (th > 0) F.accentSpan(ctx, bez, 0, sineIO(th), { col: GOLD, w: 2.2, a: Math.min(1, th * 2), spark: th < 1 });
        // the bank letter flies into the phone
        const lf = span(t, a.thatm - .7, a.thatm + .3);
        if (lf > 0 && lf < 1) { const e = sineIO(lf), x = lerp(W * .5, pc[0], e), y = lerp(ty - 10, pc[1], e) - 140 * Math.sin(Math.PI * e), s = lerp(1, .25, e);
          ctx.save(); ctx.translate(x, y); ctx.rotate(-.3 * e); ctx.fillStyle = mixHex(P.cream, LAMP.body, .3); ctx.fillRect(-60 * s, -40 * s, 120 * s, 80 * s); ctx.fillStyle = rgba(P.night1, .5); ctx.fillRect(-45 * s, -28 * s, 46 * s, 9 * s); ctx.restore(); }
        // HACKING · BIOLOGY: two older, matte cores rise behind the table; a request goes to each
        const cu = span(t, a.hacking - .9, a.hacking - .1) * (t < a.bh + 1.8 ? 1 : 0);
        if (cu > 0) {
          const C1 = [1220, ty - 175], C2 = [1390, ty - 165];
          ctx.save(); ctx.beginPath(); ctx.rect(0, -H, W * 2, ty + H); ctx.clip();
          for (const [k, [x, y]] of [[0, C1], [1, C2]]) { const e = expoOut(span(cu, k * .2, .8 + k * .2)); F.core(ctx, t, x, y + (1 - e) * 220, 110, { dim: 1, glow: .5 }); }
          ctx.restore();
          for (const [k, word, tt, [x, y]] of [[0, 'HACKING', a.hacking, C1], [1, 'BIOLOGY', a.bio, C2]]) {
            const m = span(t, tt - .2, tt + .9); if (m <= 0) continue; const e = sineIO(m);
            const qx = lerp(pc[0] + 30, x, e), qy = lerp(pc[1] - 20, y + 70, e) - 120 * Math.sin(Math.PI * e);
            F.tag(ctx, t, qx, qy, word, rise(span(m, 0, .4)), { size: 22 });
          }
        }
        // 4.04 three phones on the table; a short proof tape with ticks runs out of them
        if (t > a.bh + 1.8) {
          const tu = span(t, a.three + .3, a.days + .6);
          for (const [k, x] of [[0, 770], [1, 900], [2, 1030]]) F.phone(ctx, t, x, ty - 64, 120, { lit: .85 + .15 * span(t, a.three - .2 + k * .3, a.three + .3 + k * .3), core: .9 });
          if (tu > 0) { ctx.save(); ctx.translate(1090, ty - 26); ctx.rotate(-Math.PI / 2); F.proofTape(ctx, t, 0, 0, 64, 360 * expoOut(tu), { rows: (t - a.three - .4) * 3.2, ticks: (t - a.three - .9) * 3.2, seed: 33, pitch: 26 }); ctx.restore(); }
        }
      } else {
        // 5.04 three AUTO-UPDATE switches flip on, on the words
        const tp = [pr ? pr.x + pr.w + 70 : 920, pr ? pr.y + pr.h * .25 : 330];
        for (const [x, y, tw] of [[tp[0], tp[1], a.phone2], [1122, ty - 160, a.laptop], [444, ty - 120, a.router]]) toggle(ctx, x, y, span(t, tw - .9, tw - .2), span(t, tw, tw + .35));
        // 5.05 the dusty old router: its cable to the wall; ✗ on "replace"; the plug comes out on "offline", its light dies
        const ox = W * .12, oy = ty - 28, pull = expoOut(span(t, a.offline + .1, a.offline + .6));
        const sock = [66, ty - 58], plug = [lerp(sock[0] + 14, sock[0] + 70, pull), lerp(sock[1], sock[1] + 46, pull)];
        ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.fillRect(sock[0] - 16, sock[1] - 22, 32, 44); ctx.fillStyle = rgba(P.night0, .9); ctx.fillRect(sock[0] - 5, sock[1] - 8, 3, 8); ctx.fillRect(sock[0] + 3, sock[1] - 8, 3, 8);
        ctx.strokeStyle = mixHex(P.night0, P.ind2, .7); ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ox, oy + 16); ctx.bezierCurveTo(ox - 60, oy + 90 + 30 * pull, plug[0] + 40, plug[1] + 70, plug[0] + 10, plug[1]); ctx.stroke();
        ctx.fillStyle = mixHex(P.ind2, P.shade1, .3); ctx.fillRect(plug[0] - 6, plug[1] - 12, 22, 24);
        const r2 = prng(77); for (let k = 0; k < 26; k++) { ctx.fillStyle = rgba(P.halo2, .18 + .2 * r2()); ctx.fillRect(ox + r2() * 90, oy + r2() * 26, 2, 2); }
        const led = 1 - pull; ctx.fillStyle = rgba(LAMP.core, .25 + .65 * led); ctx.fillRect(ox + 70, oy + 12, 6, 4); if (led > .05) halo(ctx, ox + 73, oy + 14, 18, .35 * led, LAMP.body, LAMP.core);
        F.crossMark(ctx, ox + 45, oy - 40, 70, span(t, a.replace - .1, a.replace + .5) * outS(t, a.hands - .6, a.hands + .2), { w: 5 });
      }
    });
    return kr;
  }

  return (ctx, t) => {
    if (t < a.T0 + S.SEAM_HALF) { S.plateFour(ctx, t, T); return; }       // the seam: exactly what c06 draws
    if (t >= a.seam) { S.plateHeld(ctx, t, T); return; }                  // the seam: exactly what c12 draws
    // camera: the path plus a drift that grows out of the plate and dies before plateHeld
    const dA = span(t, a.T0 + .5, a.T0 + 2.2) * (1 - span(t, a.calledOff, a.seam - .15));
    let c = S.camPath(t, K); c = S.drift(c, t, Math.max(1500, Math.min(16000, D.z - c.z)), 2.6 * dA, 57);
    // portals: the kitchen (two evenings), and the panels
    const k1 = sineIO(span(t, a.fable - .2, a.fable + 1.2)) * (1 - sineIO(span(t, a.lineEnd - .25, a.lineEnd + 1.0)));
    const k2 = sineIO(span(t, a.use + .3, a.switch + .3)) * (1 - sineIO(span(t, a.hands + .1, a.hands + 2.1)));
    const kFull = (k1 >= 1 || k2 >= 1);
    const st = worldState(t, c);
    if (!kFull) S.lineWorld(ctx, c, t, st);
    // ---- 3.01 PROJECT GLASSWING on the side door
    const sr = S.sideRect(c);
    const gU = io(t, a.letIn + .3, a.letIn + 1.0, a.example - .4, a.example + .3);
    if (gU > 0 && sr) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.label(ctx, sr.x + sr.w * .5, sr.y - 8, 'PROJECT GLASSWING', null, gU, { dx: -70, dy: -46, size: 34, col: CHECK }); ctx.restore(); }
    // ---- 3.02–3.03 panel A out of the side door
    const pA = sineIO(span(t, a.example - .1, a.example + 1.2)) * (1 - sineIO(span(t, a.critics - .2, a.critics + .8)));
    if (pA > 0 && sr) { const RIMA = E.smooth(span(pA, 0, .3)); F.veil(ctx, .45 * pA); F.portal(ctx, sr, PANEL, pA, fadeIn((cx, w, h) => codePanel(cx, t, w, h, a), t), { rim: LAMP, glow: false, rimA: RIMA }); }
    F.source(ctx, t, a.count + .3, a.critics + .2, F.SOURCES.confirmed, { y: 872 });
    // ---- 3.04 your phone rises: UPDATE READY · RESTART; panel B grows out of its screen
    const phU = rise(span(t, a.canbe - .3, a.canbe + .8));
    const pB = sineIO(span(t, a.july - .3, a.july + .9)) * (1 - sineIO(span(t, a.still - .1, a.still + 1.1)));
    let phR = null;
    if (phU > 0 && t < a.july + 1) {
      const lit = span(t, a.real - .2, a.real + .3);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      phR = F.phone(ctx, t, 1540 + E.drift(t, 4, 2), lerp(H + 300, 470, phU), 440, { lit: 1, screen: (cx, w, h) => {
        cx.fillStyle = rgba(P.night1, .85); E.glowText(cx, 'UPDATE READY', w / 2, h * .34, { size: 21, weight: 600, spacing: .08, align: 'center', col: P.night1, glow: false });
        cx.fillStyle = mixHex(mixHex(P.ind2, P.blue1, .3), CHECK.body, lit); cx.beginPath(); cx.roundRect(w * .14, h * .56, w * .72, h * .1, h * .05); cx.fill();
        E.glowText(cx, 'RESTART', w / 2, h * .625, { size: 20, weight: 600, spacing: .1, align: 'center', col: lit > .5 ? P.night1 : P.cream, glow: false });
      } });
      ctx.restore();
    }
    if (pB > 0) { const RIMA = E.smooth(span(pB, 0, .3));
      F.veil(ctx, .55 * pB);
      const ds = (() => { const ps = S.QUEUE.filter((q) => q.st === 3).map((q) => { const p = S.linePt(q.p + defOff(t)); return S.proj(c, p.x, 0, p.z); }).filter(Boolean); if (!ps.length) return null;
        const x0 = Math.min(...ps.map((p) => p[0])), x1 = Math.max(...ps.map((p) => p[0])), y1 = Math.max(...ps.map((p) => p[1])), hh = Math.max(...ps.map((p) => p[2])) * 200; return { x: x0 - 30, y: y1 - hh, w: x1 - x0 + 60, h: hh }; })();
      const from = t < a.found ? (phR ?? { x: 1440, y: 280, w: 194, h: 396 }) : ds;
      F.portal(ctx, from, PANEL, pB, fadeIn((cx, w, h) => barsPanel(cx, t, w, h, a), t), { rim: LAMP, glow: false, rimA: RIMA });
    }
    F.source(ctx, t, a.july + 1.0, a.found - .2, F.SOURCES.msRecord, { y: 872 });
    // ---- M.01 subscribe (one small line)
    words(ctx, 'SUBSCRIBE', 120, 210, 46, io(t, a.subscribe - .1, a.subscribe + .5, a.fifth - .8, a.fifth - .1), { glow: true });
    // ---- 4.01 JUNE 9 falls; the core flies out of the gap to your phone
    const jU = expoOut(span(t, a.june - .5, a.june + .1)), jOut = sineIO(span(t, a.fable - .4, a.fable + .4));
    if (jU > 0 && jOut < 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.calSheet(ctx, t, 300, lerp(-330, 110, jU) - 420 * jOut, 220, 'JUNE 9', '', { rot: lerp(.35, .04, jU) + .01 * Math.sin(t * .8) }); ctx.restore(); }
    const fl = span(t, a.what + .1, a.fable - .1);
    if (fl > 0 && fl < 1 && !kFull) {
      const g = S.gapRect(c, st.open), r = phoneAt(c);
      if (g && r) { const e = sineIO(fl), [x0, y0] = [g.x + g.w * .4, g.y + g.h * .62], [x1, y1] = center(r), x = lerp(x0, x1, e), y = lerp(y0, y1, e) - 260 * Math.sin(Math.PI * e);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.core(ctx, t, x, y, lerp(70, 14, e), { glow: 1 }); ctx.restore(); }
    }
    // ---- 4.02–4.05 the kitchen (evening 1) out of your phone
    if (k1 > 0) {
      const z = kZoom(t), from = phoneAt(c);
      F.portal(ctx, from, FULL, k1, (cx) => {
        kitchenK(cx, t, z, 1);
        // 4.03 the sky out of the window
        const sk = sineIO(span(t, a.bh + .5, a.bh + 1.7)) * (1 - sineIO(span(t, a.three - .9, a.three + .3)));
        if (sk > 0) F.portal(cx, kRect(z, KT.wx, KT.wy, KT.ww, KT.wh), FULL, sk, (c2, w, h, mm) => skyPage(c2, t, w, h, a, mm), { rim: LAMP, glow: false, rimA: E.smooth(span(sk, 0, .4)) * (1 - E.smooth(span(sk, .9, 1))) });
        // 4.05 the core up close, out of the middle phone on the table
        const lp = sineIO(span(t, a.limit - .2, a.limit + 1.0)) * (1 - sineIO(span(t, a.lineEnd - 1.3, a.lineEnd - .3)));
        if (lp > 0) { const RIMA = E.smooth(span(lp, 0, .3)); F.veil(cx, .5 * lp); F.portal(cx, kRect(z, 900 - 27, KT.ty - 64 - 54, 54, 108), PANEL, lp, fadeIn((c2, w, h) => limitPanel(c2, t, w, h, a), t), { rim: GOLD, glow: false, rimA: RIMA }); }
      }, { rim: LAMP, r: 18 * (1 - k1), glow: k1 < .98 });
    }
    F.source(ctx, t, a.bh + 1.8, a.three - .5, F.SOURCES.blackHole, { y: 872 });
    words(ctx, '3 DAYS', 1200, 830, 120, io(t, a.days - .2, a.days + .4, a.limit - .5, a.limit + .1), { serif: true });
    F.source(ctx, t, a.three + .4, a.limit + .1, F.SOURCES.threeSubs, { y: 872 });
    F.source(ctx, t, a.training, a.lineEnd - .3, F.SOURCES.limit, { y: 872, size: 18 });
    // ---- 5.02 APR … AUG fall; the download bar; ABOUT $4,400
    const mU = rise(span(t, a.within - .6, a.within + .2)), mOut = sineIO(span(t, a.so + .4, a.so + 1.2));
    if (mU > 0 && mOut < 1) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      const M = ['APR', 'MAY', 'JUN', 'JUL', 'AUG'];
      for (let i = M.length - 1; i >= 0; i--) {
        const tf = lerp(a.within + .3, a.rival + .5, i / 4), fu = i < 4 ? span(t, tf, tf + .9) : 0; if (fu >= 1) continue;
        const y = lerp(-300, 100, mU) - 460 * mOut + 1100 * fu * fu, x = 260 + 160 * fu;
        F.calSheet(ctx, t, x, y, 190, M[i], '', { rot: .02 + .9 * fu * fu + .01 * Math.sin(t * .7 + i) });
      }
      ctx.restore();
    }
    const rb = S.proj(c, RIVAL.x, 0, RIVAL.z);
    if (rb && t > a.free && t < a.so + 2) {
      const bu = rise(span(t, a.download - .3, a.download + .2)) * outS(t, a.so + .3, a.so + 1.1), fill = sineIO(span(t, a.download, a.download + 1.8));
      if (bu > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = bu; const bx = rb[0] - 170, by = Math.min(800, rb[1] + 50);
        ctx.fillStyle = rgba(P.night0, .7); ctx.fillRect(bx, by, 340, 14); ctx.fillStyle = LAMP.core; ctx.fillRect(bx, by, 340 * fill, 14); halo(ctx, bx + 340 * fill, by + 7, 30, .4 * (1 - span(fill, .95, 1)), LAMP.body, LAMP.core);
        F.priceTag(ctx, t, bx + 340, by + 14, 'ABOUT $4,400', span(t, a.dollars - .4, a.dollars + .5), { size: 26, len: 30 }); ctx.restore(); }
    }
    F.source(ctx, t, a.rival + .4, a.so + .4, F.SOURCES.rival, { y: 872 });
    // ---- 5.03 → 5.04 the top sheet of the stack flies to you; the kitchen (evening 2) out of it
    if (k2 > 0) {
      const z = kZoom(t);
      const tp = S.proj(c, STACK.x, STACK.s * 1.12 + 11 * STACK.th, STACK.z), from = tp ? { x: tp[0] - STACK.s * tp[2] / 2, y: tp[1], w: STACK.s * tp[2], h: STACK.s * 1.12 * tp[2] } : { x: 900, y: 400, w: 80, h: 90 };
      const back = t > a.hands ? phoneAt(c) : from;
      F.portal(ctx, back, FULL, k2, (cx) => kitchenK(cx, t, z, 2), { rim: LAMP, r: 18 * (1 - k2), glow: k2 < .98 });
    }
    words(ctx, 'REPLACE', 120, 220, 84, io(t, a.replace - .1, a.replace + .4, a.otherwise + 1.2, a.otherwise + 1.9));
    words(ctx, 'OR OFFLINE', 120, 320, 84, io(t, a.offline - .1, a.offline + .4, a.otherwise + 1.2, a.otherwise + 1.9));
    // ---- 6.01 a glimpse through the gap: the room, the tables where it is decided
    const gm = sineIO(span(t, a.decided + .5, a.decided + 1.6)) * (1 - sineIO(span(t, a.fall - .7, a.fall + .3)));
    if (gm > 0) { const RIMA = E.smooth(span(gm, 0, .3)); F.veil(ctx, .4 * gm); F.portal(ctx, S.gapRect(c), PANEL, gm, fadeIn((cx, w, h) => S.room(cx, t, w, h, { core: 1, people: 1, tables: 1 }), t), { rim: GOLD, glow: false, rimA: RIMA }); }
    // ---- 6.02 the source of the held-back parcel (gone before the plate)
    F.source(ctx, t, a.reason - .5, a.seam - .2, F.SOURCES.astraHeld, { y: 872 });
  };
}
export const anchorsFor = (T) => anchors(T);
const CACHE = new WeakMap();
export function draw(T) { if (!CACHE.has(T)) CACHE.set(T, build(T)); return CACHE.get(T); }
