// Film 70 · builder B1 · c02–c05 ('His word for it' → 'Law. Rules written') as ONE continuous take (owned by B1).
// One draw(ctx, t) for the whole group, so the inner chunk boundaries (c02|c03, c03|c04, c04|c05) are the same frame on both sides.
// Stages: (A) THE TRUST BOARD, c02 + c03 up to 2.16 · (W) the Leitbild, anchor 2/4 (2.17–2.22), opened by a circle mask out of the
// dimming desk lamp (the lamp becomes the machine sphere) · (B) the board again, opened by a circle mask out of the TRUTH link (2.23),
// c04 + c05 up to 4.16 · (C) the counter row, opened by a circle mask out of the crack in the CONTRACT link (4.17) → plateLaw.
// Every sentence has its own motif (docs/shots.md, column "zeigt wörtlich"); objects turn into the next object. No hard cut.
// Scenes import: scenes/sc02.mjs … sc05.mjs call b1Entries(T, R, id).
import { createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f70_kit.mjs';
import * as S from './f70_world.mjs';
import * as X from './f70_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, prng } = E;
const { GOLD, COOL, CREAM, CREAM2, LAMP, PAPER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const io = (t, a, b, di = .6, dout = .5) => span(t, a, a + di) * (1 - span(t, b - dout, b));
const breathe = (v, t, k = 1) => ({ x: v.x + k * (18 * Math.sin(t * .37 + .4) + 6 * Math.sin(t * .83 + 2)) / v.s, y: v.y + k * (10 * Math.sin(t * .43 + 1.3) + 4 * Math.sin(t * .97)) / v.s, s: v.s * (1 + k * (.008 * Math.sin(t * .41 + .2) + .005 * Math.sin(t * .79 + 1))) });
const lerpV = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), k)) });
// draw fn clipped above a base line, risen by k (0 = below the line, 1 = up)
function riseClip(ctx, x0, x1, base, k, h, fn) {
  if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(x0, base - 6000, x1 - x0, 6000 + 1); ctx.clip(); ctx.translate(0, (1 - expoOut(k)) * h); fn(); ctx.restore();
}
// a rolled number that leaves by sinking under its baseline (never by rolling back down): uIn rolls it in, keep 1 → 0 sinks it
const rollSink = (ctx, value, x, y, size, uIn, keep, o) => { if (uIn > 0 && keep > 0) riseClip(ctx, x - 900, x + 900, y + size * .28, keep, size * 1.3, () => F.numberRoll(ctx, value, x, y, size, uIn, o)); };
const txt = (ctx, s, x, y, size, u, o = {}) => F.goldText(ctx, [[s, o.gold ?? 0]], x, y, size, F.rise(clamp(u)), { serif: o.serif ?? true, align: o.align ?? 'center', col: o.col, glow: o.glow, weight: o.weight, spacing: o.spacing });
function rrect(ctx, x, y, w, h, r, fill, stroke, lw = 2) { ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
// a book seen from the side (lying): x centre, y bottom
function book(ctx, x, y, w, h, col) {
  rrect(ctx, x - w / 2, y - h, w, h, 4, col, rgba(P.night0, .5), 1.5);
  ctx.fillStyle = rgba(PAPER.lit, .8); ctx.fillRect(x - w / 2 + 6, y - h + 3, w - 16, Math.max(1, h * .14));
  ctx.fillStyle = rgba(P.night0, .25); ctx.fillRect(x + w / 2 - 22, y - h, 4, h);
}
// THE ADVISER'S DESK (own copy of X.deskPerson without its machine screen: here the person walks out and the separate agent screen stays)
function adviserDesk(ctx, t, x, y, h, o = {}) {
  const lamp = clamp(o.lamp ?? 1), dw = h * 1.05, dy = y - h * .42, walk = clamp(o.walk ?? 0);
  if (lamp > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, x + dw * .3, y - h * 1.15, x + dw * .3, dy, [[0, rgba(LAMP.body, .3 * lamp)], [1, rgba(LAMP.body, .04 * lamp)]]);
    ctx.beginPath(); ctx.moveTo(x + dw * .36, y - h * 1.12); ctx.lineTo(x + dw * .8, dy); ctx.lineTo(x - dw * .35, dy); ctx.lineTo(x + dw * .26, y - h * 1.12); ctx.fill(); ctx.restore();
    halo(ctx, x + dw * .31, y - h * 1.1, h * .5, .5 * lamp, LAMP.body, LAMP.core);
  }
  ctx.strokeStyle = mixHex(P.night1, P.blue1, .5); ctx.lineWidth = h * .025; ctx.beginPath(); ctx.moveTo(x + dw * .45, dy); ctx.lineTo(x + dw * .45, y - h * 1.08); ctx.lineTo(x + dw * .3, y - h * 1.12); ctx.stroke();
  const pw = expoIn(walk);
  if (pw < 1) { ctx.save(); ctx.beginPath(); ctx.rect(x - dw, y - h * 1.4, W * 3, h * 1.4 - h * .42 + 2); ctx.clip();
    E.person(ctx, x + dw * .1 + pw * 1500, y, h, { dir: lerp(-1, 1, sineIO(span(walk, 0, .22))) || .01, light: .6 + .4 * lamp, look: o.look ?? -.1, armR: [1.2, 2.1], armL: [-.9, -1.6], walk: walk > 0 ? walk * 15 : undefined, rim: LAMP.body });
    ctx.restore(); }
  ctx.fillStyle = mixHex(P.night1, P.blue1, .35); ctx.fillRect(x - dw / 2, dy, dw, h * .05); ctx.fillRect(x - dw / 2 + h * .06, dy + h * .05, h * .05, h * .37); ctx.fillRect(x + dw / 2 - h * .11, dy + h * .05, h * .05, h * .37);
  ctx.fillStyle = rgba(mixHex(LAMP.body, P.blue1, .4), .5 * lamp); ctx.fillRect(x - dw / 2, dy, dw, 2);
  return { top: dy };
}
// a cool agent screen with text on it (NO)
function screenText(ctx, t, x, y, w, s, u) {
  X.aiScreen(ctx, t, x, y, w, {});
  const h = w * .66; if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2); rrect(ctx, x - w * .45, y - h * .93, w * .9, h * .86, w * .03, rgba(COOL.deep, .82)); ctx.restore();
  txt(ctx, s, x, y - h * .5 + w * .1, w * .3, u, { col: COOL.core, glow: true });
  halo(ctx, x, y - h * .5, w * .75, u * (.15 + .1 * Math.sin(t * 3.1) + .03 * Math.sin(t * 5.3)), COOL.halo, COOL.core);   // the screen's light breathes
}
// a balance scale: post from (x, base) up to beam at y, beam half-width bw, angle th; returns the pan points
function scale(ctx, t, x, base, y, bw, th, o = {}) {
  const k = clamp(o.u ?? 1); if (k <= 0) return null;
  const top = lerp(base, y, expoOut(k)), c = Math.cos(th), s = Math.sin(th), pl = [x - bw * c, top - bw * s], pr = [x + bw * c, top + bw * s], hang = 150;
  ctx.save(); ctx.strokeStyle = rgba(CREAM, .85); ctx.lineCap = 'round'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x, top); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.beginPath(); ctx.moveTo(x - 70, base); ctx.lineTo(x + 70, base); ctx.lineTo(x + 30, base - 26); ctx.lineTo(x - 30, base - 26); ctx.fill();
  if (k > .5) {
    const a = clamp((k - .5) * 2); ctx.globalAlpha *= a;
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(pl[0], pl[1]); ctx.lineTo(pr[0], pr[1]); ctx.stroke();
    halo(ctx, x, top, 26, .5, GOLD.halo, GOLD.core);
    for (const p of [pl, pr]) {
      ctx.lineWidth = 2; ctx.strokeStyle = rgba(CREAM, .6); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] - 70, p[1] + hang); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + 70, p[1] + hang); ctx.stroke();
      ctx.fillStyle = mixHex(P.night1, P.blue1, .45); ctx.beginPath(); ctx.ellipse(p[0], p[1] + hang, 92, 18, 0, 0, Math.PI); ctx.fill();
      ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0] - 92, p[1] + hang); ctx.lineTo(p[0] + 92, p[1] + hang); ctx.stroke();
    }
  }
  ctx.restore();
  return { pl: [pl[0], pl[1] + hang], pr: [pr[0], pr[1] + hang], top };
}

// ======================================================================================================================== the take
const CACHE = new WeakMap();
export function b1Take(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const G = (p, after = 42) => T.G(p, 0, after);
  const T0 = T.G('His word for it'), TL = T.G('Law. Rules written');
  const A = {
    hate: G('Not machines that hate'), hateW: G('hate you'), world: G('A world that keeps running'), stops: G('stops explaining'),
    pic: G('His picture for it'), machines: G('by machines'), medicine: G('and medicine'), lost: G('lost control'),
    civ: G('Now picture a whole'), unable: G('And unable to say'),
    hist: G('Harari is a historian'), books: G('His books have sold'), fifty: G('fifty million'), look: G('But look at the card'),
    ahead: G('Is that world really'), aheadW: G('ahead of you'),
    honest: G('Be honest'), bond: G('explain the bond market'), grid: G('Or the power grid'), phone: G('Or the phone in'), hardly: G('Hardly anyone can'),
    bread: G('The bread still gets'), never: G('Because civilization never ran'), underst: G('on understanding'), says: G('Harari says so himself'),
    q1b: G('civilization is trust'), banker: G('You trust the banker'), analyst: G('The banker trusts the analyst'), chainP: G('A chain of people'),
    far: G('somebody who really understands'), cow: G('So you were always'), worked: G('And it worked'), newP: G('What is new sits'),
    four: G('Four links run between'), strain: G('All four are under strain'), last: G('And the last is'), swear: G('the one you would swear is safe'),
    money: G('Money. Your adviser'), adviser: G('Your adviser used to'), why: G('tell you why'), boe: G('This year the Bank'), oneIn4: G('Only about one in four'),
    most: G('Most rely on the'), eight: G('Eight in ten already'), human: G('A human still decides'), explain: G('But can that human'),
    step: G('Harari looks a step'), invent: G('machines invent themselves'), holds: G('So the first link holds'), expert: G('But the expert at'),
    whatH: G('What happens when the machine'), noW: G('answer is no'),
    contract: G('Contract. A job'), policy: G('An insurance policy'), each: G('Each begins with somebody'), yes: G('saying yes'),
    soft: G('Today software often'), lawsuit: G('In one American lawsuit'), billion: G('One point one billion'), suing: G('The people suing are'),
    falseP: G('The company says the claims'), ruled: G('No court has ruled'), second: G('A second lawsuit says'), notice: G('No notice'),
    correct: G('No way to correct'), undec: G('Also undecided'), cracks: G('If those claims hold'), villain: G('No villain'),
    decision: G('A decision about you'), why2: G('nobody you can ask why'), channel: G('This channel exists for'), arrival: G('So that the arrival'),
    point: G('When a machine says no'), unless: G('Unless a machine wrote'),
  };
  A.trust = T.G('trust', 0, A.q1b + .3);
  A.yesW = T.G('yes', 0, A.each);
  A.job = T.G('A job', 0, A.contract); A.loan = T.G('A loan', 0, A.contract);
  A.fed = T.G('Fed', 0, A.civ); A.housed = T.G('Housed', 0, A.civ); A.running = T.G('Running', 0, A.housed);
  A.names = ['Money', 'Contract', 'Law', 'Truth'].reduce((o, p) => { o.push(T.G(p, 0, o.length ? o[o.length - 1] + .1 : A.four)); return o; }, []);
  A.want = T.G('Want that too', 0, A.channel); A.subscribe = T.G('Then subscribe', 0, A.channel);
  const C2 = T.clip('C2'), CH = F.chainTimes(T), tP = TL - S.SEAM_HALF;
  const M1 = [A.four - .15, A.four + 1.55], M2 = [A.last + 1.1, A.last + 2.7], HUDLAND = [A.money - 1.65, A.money - .35], M3 = [A.villain - .25, A.villain + 1.4];

  // --------------------------------------------------------------------------------------------- stage A: views (board units)
  const V = (x, y, s) => ({ x, y, s });
  const DX = -1610, DY = -345;                       // c03 local → board (you stand where the knot closed around you)
  const L = (x, y, s = 1) => V(x + DX, y + DY, s);
  const DESK = { x: 2950, y: 800, h: 200 }, LAMPL = [DESK.x - DESK.h * 1.05 * .31, DESK.y - DESK.h * 1.1];
  const LAMPVIEW = L(LAMPL[0] - 530, LAMPL[1] + 222, 1);   // the far-end lamp lands where the Leitbild's sphere is (1490, 318)
  const CIV = V(960, 640, .55);
  const VA = [[T0 - .5, V(960, 540, 1)], [T0 + .5, V(960, 540, 1.04)], [A.hate - .2, V(960, 540, 1.1)], [A.civ - .2, V(960, 555, 1.1)], [A.civ + 1.9, CIV],
    [A.look - .25, CIV], [A.look + 1.75, V(-1000, 560, 1)], [A.ahead - .1, V(-990, 552, 1)], [A.ahead + 1.7, V(-690, 455, 1.04)], [A.honest - .05, V(-688, 452, 1.04)],
    [A.honest + 1.6, L(960, 540)], [A.says + .1, L(955, 540)], [A.says + 1.9, L(880, 545)], [A.banker - .3, L(880, 548)], [A.banker + 1.4, L(800, 680, 1.15)], [A.chainP + .1, L(860, 680, 1.15)], [A.chainP + 2.6, L(1700, 640, .85)],
    [A.cow - .35, L(1710, 640, .85)], [A.cow + 1.6, L(560, 700, 1.4)], [A.worked + 1.2, L(570, 700, 1.38)], [A.newP - .1, L(640, 690, 1.3)], [A.newP + 2.4, LAMPVIEW], [M1[1] + 1, LAMPVIEW]];
  const viewA = (t) => breathe(X.viewPath(t, VA), t, span(t, T0 + .5, T0 + 2.5));

  // --------------------------------------------------------------------------------------------- c02 · 1.01–1.03 the type, HATE, the rail network
  const RAILS = [[[960, 560], [640, 560], [520, 440], [260, 440]], [[960, 560], [1280, 560], [1420, 700], [1680, 700]],
    [[960, 560], [960, 400], [1100, 300], [1600, 300]], [[960, 560], [960, 690], [820, 790], [500, 790]]];
  const RL = RAILS.map((r) => F.pathLen(r));
  const STA = RAILS.flatMap((r, i) => [.42, .93].map((f, j) => { const [x, y] = F.pathAt(r, f * RL[i]); return { x, y, f, i, k: i * 2 + j }; }));
  const SIG = STA[4], SIGP = [SIG.x + 30, SIG.y - 20], LAMPHEAD = [720, 392];
  const BLANK = [3, 0, 6, 2, 5, 7, 1, 4];   // the order in which the station signs go blank
  const RECT1 = { x: 660, y: 420, w: 600, h: 360 }, HUB = { x: 915, y: 532, w: 90, h: 56 };
  function secType(ctx, t) {
    const up = sineIO(span(t, A.hate - .15, A.hate + 1.1)), out = span(t, A.pic - .5, A.pic + .1);
    ctx.save(); ctx.translate(960, lerp(560, 205, up)); const k = lerp(1, .5, up); ctx.scale(k, k); ctx.translate(-960, -560);
    X.big(ctx, SRC.dementia, 960, 560, 118, span(t, T0 - .5, T0 + .35) * (1 - out), { gold: .35 });
    ctx.restore();
    // the rule opens into the screen (1.02), the screen shrinks into the network's hub (1.03)
    const m = sineIO(span(t, A.hate - .05, A.hate + 1.0)), h2 = sineIO(span(t, A.world - .1, A.world + 1.1));
    if (m <= 0) { X.lightLine(ctx, [[W / 2 - 450, 616], [W / 2 + 450, 616]], 1, { w: 3, a: .8 }); return; }
    const r0 = { x: 510, y: 614.5, w: 900, h: 3 }, R = {}; for (const key of ['x', 'y', 'w', 'h']) R[key] = lerp(lerp(r0[key], RECT1[key], m), HUB[key], h2);
    const ret = span(t, A.pic - .3, A.pic + .5); if (ret >= 1) return;
    ctx.save(); ctx.translate(R.x + R.w / 2, R.y + R.h / 2); ctx.scale(1 - ret, 1 - ret); ctx.translate(-(R.x + R.w / 2), -(R.y + R.h / 2));
    rrect(ctx, R.x, R.y, R.w, R.h, 14 * m, lin(ctx, 0, R.y, 0, R.y + R.h, [[0, rgba(mixHex(COOL.deep, COOL.body, .25), m)], [1, rgba(COOL.deep, m)]]), rgba(CREAM, .85), 3);
    // HATE, struck by one gold line, then the screen goes calm (iris rings)
    const hu = span(t, A.hate + .3, A.hate + .85) * (1 - span(t, A.hateW + .9, A.hateW + 1.4)) * (1 - h2);
    if (hu > 0) {
      txt(ctx, 'HATE', 960, 640, 112, hu, { col: COOL.text });
      const w = F.measure('HATE', 112, true), y = 640 - 112 * .33, su = expoOut(span(t, A.hateW + .02, A.hateW + .34));
      if (su > 0) F.goldSpan(ctx, [[960 - w / 2 - 24, y], [960 + w / 2 + 24, y]], span(t, A.hateW + .9, A.hateW + 1.35), su, { w: 5 });
    }
    const calm = expoOut(span(t, A.hateW + 1.2, A.hateW + 2.1));
    if (calm > 0) { const cx = R.x + R.w / 2, cy = R.y + R.h / 2, rr = Math.min(R.w, R.h) * .32;
      for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba(COOL.core, (.3 + .18 * k) * calm); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(cx, cy, rr * calm * (1 - k * .28) * (1 + .03 * Math.sin(t * 1.3 - k)), 0, TAU); ctx.stroke(); }
      halo(ctx, cx, cy, rr * 2.2, .25 * calm, COOL.halo, COOL.core); }
    ctx.restore();
  }
  function secRails(ctx, t) {
    const u = span(t, A.world + .5, A.world + 2.0), ret = sineIO(span(t, A.pic - .35, A.pic + .75)), uu = u * (1 - ret);
    if (uu <= 0) return;
    RAILS.forEach((r, i) => X.lightLine(ctx, r, uu, { w: 4, a: .7 }));
    // trains: small cool capsules gliding outward
    RAILS.forEach((r, i) => { for (let j = 0; j < 2; j++) {
      const d = ((t - A.world) * 95 + j * RL[i] / 2 + i * 70) % RL[i]; if (d > uu * RL[i] - 20 || d < 30) continue;
      const [x, y, ang] = F.pathAt(r, d); ctx.save(); ctx.translate(x, y); ctx.rotate(ang); rrect(ctx, -20, -7, 40, 14, 7, COOL.body); ctx.restore(); halo(ctx, x, y, 26, .35, COOL.halo, COOL.core);
    } });
    for (const s of STA) {
      const k = expoOut(span(uu, s.f - .02, s.f + .06)); if (k <= 0) continue;
      ctx.save(); ctx.translate(s.x, s.y); ctx.scale(k, k);
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fillStyle = P.night0; ctx.fill(); ctx.strokeStyle = rgba(CREAM, .9); ctx.lineWidth = 3; ctx.stroke();
      // the station sign: two lines of text that go blank one by one (1.03)
      rrect(ctx, -50, -66, 100, 34, 6, rgba(P.night0, .8), rgba(CREAM, .55), 1.5);
      const bl = span(t, A.stops + BLANK.indexOf(s.k) * .22, A.stops + BLANK.indexOf(s.k) * .22 + .3);
      ctx.fillStyle = rgba(CREAM, .75); ctx.fillRect(-38, -57, 70 * (1 - bl), 5); ctx.fillRect(-38, -45, 46 * (1 - bl), 5);
      if (s === SIG && t < A.pic - .3) { ctx.restore(); lampAt(ctx, t, 0, k); continue; }
      if (s !== SIG) { const on = Math.floor(t * .8 + s.k * .37) % 2; ctx.beginPath(); ctx.arc(30, -20 + 10, 5, 0, TAU); ctx.fillStyle = on ? GOLD.hot : COOL.body; ctx.fill(); }
      ctx.restore();
    }
  }
  // --------------------------------------------------------------------------------------------- 1.04–1.09 the room, the civilization
  const FLOOR = 760;
  function lampAt(ctx, t, k, a = 1) {   // k: the signal light travels into the lamp (0 = still the signal)
    if (a <= 0) return;
    const p = [lerp(SIGP[0], LAMPHEAD[0], sineIO(k)), lerp(SIGP[1], LAMPHEAD[1], sineIO(k))], r = lerp(5, 22, k) * a;
    halo(ctx, p[0], p[1], lerp(30, 260, k) * a, lerp(.5, .55, k), LAMP.body, LAMP.core);
    ctx.fillStyle = mixHex(GOLD.hot, LAMP.core, k); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.fill();
  }
  function room(ctx, t, sink) {
    const lk = span(t, A.pic - .1, A.pic + 1.3);
    const sk = (a, b) => span(t, a, b) * (1 - sink);
    const pole = sk(A.pic + 1.0, A.pic + 1.9);
    if (pole > 0) {   // the floor lamp grows down from its light, the floor line runs out from its foot
      ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.fillRect(LAMPHEAD[0] - 3, LAMPHEAD[1], 6, (FLOOR - LAMPHEAD[1]) * expoOut(pole));
      ctx.fillStyle = mixHex(P.night0, P.ind1, .45); ctx.beginPath(); ctx.moveTo(660, 400); ctx.lineTo(780, 400); ctx.lineTo(752, 352); ctx.lineTo(688, 352); ctx.closePath(); ctx.globalAlpha = expoOut(pole); ctx.fill(); ctx.globalAlpha = 1;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, 400, 0, FLOOR, [[0, rgba(LAMP.body, .2 * pole)], [1, rgba(LAMP.body, .02)]]);
      ctx.beginPath(); ctx.moveTo(662, 400); ctx.lineTo(560, FLOOR); ctx.lineTo(900, FLOOR); ctx.lineTo(778, 400); ctx.fill(); ctx.restore();
      X.lightLine(ctx, [[720, FLOOR], [380, FLOOR]], pole, { w: 2.5, a: .55 }); X.lightLine(ctx, [[720, FLOOR], [1560, FLOOR]], pole, { w: 2.5, a: .55 });
    }
    lampAt(ctx, t, lk, 1 - expoIn(sink));
    // the armchair (seen from the side, the back on the right) with the person in it, still
    riseClip(ctx, 820, 1140, FLOOR, sk(A.pic + 1.4, A.pic + 2.4), 330, () => {
      const cc = mixHex(P.night1, P.ind2, .75), ce = rgba(LAMP.body, .35);
      rrect(ctx, 1040, 500, 72, 260, 20, cc, ce, 2);
      halo(ctx, 990, 560, 120, .18, LAMP.body, LAMP.core);
      E.person(ctx, 1000, 760, 250, { dir: -1, light: .95, look: -.42 + .02 * Math.sin(t * .5), armR: [.55, .35], armL: [.45, .3], rim: LAMP.body });
      rrect(ctx, 870, 650, 240, 56, 16, cc, ce, 2);
      rrect(ctx, 860, 612, 200, 44, 18, mixHex(cc, P.blue1, .2), ce, 2);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(880, 704, 220, 40); ctx.fillRect(890, 744, 14, 16); ctx.fillRect(1080, 744, 14, 16);
    });
    // the heater (machines), the drip stand (medicine): they keep working by themselves
    riseClip(ctx, 1280, 1460, FLOOR, sk(A.machines - .1, A.machines + .7), 140, () => {
      for (let i = 0; i < 6; i++) rrect(ctx, 1290 + i * 24, 650, 18, 108, 8, mixHex(P.night1, P.ind2, .7), rgba(LAMP.body, .25), 1.5);
      halo(ctx, 1355, 700, 150, .14 + .05 * Math.sin(t * 1.1), LAMP.body, LAMP.core);
    });
    riseClip(ctx, 1120, 1240, FLOOR, sk(A.medicine - .1, A.medicine + .8), 360, () => {
      ctx.fillStyle = mixHex(P.night1, P.blue1, .45); ctx.fillRect(1177, 420, 6, FLOOR - 420); ctx.fillRect(1140, FLOOR - 6, 80, 6);
      rrect(ctx, 1158, 436, 44, 66, 12, rgba(COOL.body, .28), rgba(COOL.core, .6), 2);
      ctx.strokeStyle = rgba(COOL.line, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1180, 502); ctx.quadraticCurveTo(1130, 640, 960, 628); ctx.stroke();
      const bl = .5 + .5 * Math.sin(t * 2.4); ctx.fillStyle = rgba(COOL.core, .4 + .5 * bl); ctx.beginPath(); ctx.arc(1180, 560, 6, 0, TAU); ctx.fill(); halo(ctx, 1180, 560, 30, .3 * bl, COOL.halo, COOL.core);
    });
  }
  const PYL = [-520, 140, 800, 1460, 2120, 2780], PYB = 300, PYH = 280, BELT = { y: 1130, x0: -700, x1: 1400 };
  const HOUSES = [[1830, 380], [2070, 300], [2310, 420]];
  const LABC = [['FED', 330, 1060], ['HOUSED', 2160, 250], ['RUNNING', -60, -70]];
  function civ(ctx, t, sink) {
    const k0 = A.civ + .4, f = (a, b) => span(t, a, b) * (1 - sink);
    // three lines grow out of the three devices into three systems
    const lu = f(k0, k0 + 1.0);
    X.lightLine(ctx, [[720, 360], [760, 200], [800, PYB]], lu, { w: 3, a: .6 });
    X.lightLine(ctx, [[1430, 700], [1820, 700]], lu, { w: 3, a: .6 });
    X.lightLine(ctx, [[1180, FLOOR], [1180, BELT.y - 16]], lu, { w: 3, a: .6 });
    // power: pylons rise outward from the lamp's line, the wire hangs between them
    PYL.forEach((x, i) => riseClip(ctx, x - 80, x + 80, PYB, f(k0 + .6 + Math.abs(i - 2) * .12, k0 + 1.3 + Math.abs(i - 2) * .12), PYH + 20, () => {
      ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x - 34, PYB); ctx.lineTo(x - 7, PYB - PYH); ctx.lineTo(x + 7, PYB - PYH); ctx.lineTo(x + 34, PYB); ctx.stroke();
      ctx.beginPath(); for (const q of [.3, .6]) { ctx.moveTo(x - 34 + 27 * q, PYB - PYH * q); ctx.lineTo(x + 34 - 27 * q, PYB - PYH * q); } ctx.moveTo(x - 60, PYB - PYH + 26); ctx.lineTo(x + 60, PYB - PYH + 26); ctx.stroke();
    }));
    const wu = f(k0 + 1.0, k0 + 1.9), wires = [];
    for (let i = 0; i + 1 < PYL.length; i++) wires.push(F.catenary([PYL[i] + 60, PYB - PYH + 26], [PYL[i + 1] - 60, PYB - PYH + 26], 46, { n: 16 }));
    wires.forEach((w, i) => X.lightLine(ctx, i < 2 ? [...w].reverse() : w, wu, { w: 2.5, a: .6 }));
    // RUNNING: light pulses run along the wire
    const ru = f(A.running - .1, A.running + .4);
    if (ru > 0) for (let q = 0; q < 7; q++) { const g = (((t - A.running) * .14 + q / 7) % 1 + 1) % 1, wi = Math.min(4, Math.floor(g * 5)), w = wires[wi], [x, y] = F.pathAt(w, (g * 5 - wi) * F.pathLen(w)); halo(ctx, x, y, 34, .8 * ru, GOLD.halo, GOLD.core); }
    // food: the belt, loaves run along it
    const bu = f(k0 + .7, k0 + 1.6);
    if (bu > 0) {
      X.lightLine(ctx, [[1180, BELT.y], [BELT.x0, BELT.y]], bu, { w: 3, a: .7 }); X.lightLine(ctx, [[1180, BELT.y], [BELT.x1, BELT.y]], bu, { w: 3, a: .7 });
      for (let x = BELT.x0 + 60; x < BELT.x1; x += 140) { if (Math.abs(x - 1180) > (BELT.x1 - BELT.x0) * bu) continue; ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, BELT.y + 22, 16, 0, TAU); ctx.stroke(); const a = t * 1.6; ctx.beginPath(); ctx.moveTo(x + 14 * Math.cos(a), BELT.y + 22 + 14 * Math.sin(a)); ctx.lineTo(x - 14 * Math.cos(a), BELT.y + 22 - 14 * Math.sin(a)); ctx.stroke(); }
      const fu = f(A.fed - .25, A.fed + .2);
      if (fu > 0) for (let j = 0; j < 9; j++) { const x = BELT.x0 + 40 + (((t - A.fed + .25) * 210 + j * 240) % (BELT.x1 - BELT.x0 - 80)); const e = clamp(Math.min(x - BELT.x0, BELT.x1 - x) / 120); F.bread(ctx, t, x, BELT.y - 2, 110 * e * fu, {}); }
    }
    // housing: blocks rise beside the heater's line, roofs click on, windows light
    HOUSES.forEach(([x, h], i) => riseClip(ctx, x - 20, x + 220, FLOOR, f(k0 + .9 + i * .1, k0 + 1.7 + i * .1), h + 40, () => {
      rrect(ctx, x, FLOOR - h, 200, h, 4, mixHex(P.night1, P.ind2, .7), rgba(CREAM, .5), 2);
      const rr = span(t, A.housed - .05 + i * .1, A.housed + .3 + i * .1); if (rr > 0) { const y = FLOOR - h - (1 - expoOut(rr)) * 160;
        ctx.globalAlpha = clamp(rr * 4); ctx.fillStyle = mixHex(P.ind2, LAMP.deep, .5); ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x + 100, y - 70); ctx.lineTo(x + 214, y); ctx.fill(); ctx.strokeStyle = rgba(LAMP.body, .6); ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1; }
      const wl = f(A.housed + .25 + i * .1, A.housed + .6 + i * .1);
      for (let r = 0; r < Math.floor(h / 60); r++) for (let c = 0; c < 3; c++) { const on = ((r * 7 + c * 3 + i) % 5) > 0; rrect(ctx, x + 26 + c * 56, FLOOR - h + 26 + r * 60, 34, 30, 3, on ? rgba(LAMP.body, .15 + .65 * wl) : rgba(P.night0, .6)); }
    }));
    // labels → ? marks (1.09), the ? marks fly into the book stack (1.10)
    const times = [A.fed, A.housed, A.running];
    LABC.forEach(([s, x, y], i) => {
      X.label(ctx, s, x, y, span(t, times[i] + .05, times[i] + .6) * (1 - span(t, A.unable + i * .08, A.unable + .4 + i * .08)), { size: 50, spacing: .2, gold: .25 });
    });
  }
  function qMarks(ctx, t) {   // drawn in screen-design space of the civ view (board → screen at CIV)
    LABC.forEach(([, x, y], i) => {
      const q = span(t, A.unable + .25 + i * .08, A.unable + .8 + i * .08); if (q <= 0) return;
      const fly = sineIO(span(t, A.hist - .2 + i * .07, A.hist + .7 + i * .07)); if (fly >= 1) return;
      const sx = 960 + (x - CIV.x) * CIV.s, sy = 540 + (y - CIV.y) * CIV.s - 20;
      const px = lerp(sx, 960, fly), py = lerp(sy, 700 - i * 30, fly), sc = lerp(1, .5, fly);
      ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc); txt(ctx, '?', 0, 0, 96, q, { col: CREAM, glow: true }); ctx.restore();
    });
  }
  // --------------------------------------------------------------------------------------------- 1.10–1.11 the historian: books → columns (screen design at CIV)
  const COLS = [2, 3, 4, 6, 8, 10, 13];
  const [cNum, cWord] = SRC.copies.split(' '), cVal = parseFloat(cNum), cSuf = cNum.replace(/^[\d.]+/, '');
  function books(ctx, t) {
    const st = span(t, A.hist + .35, A.hist + 1.1), cu = span(t, A.books - .1, A.books + 1.4);
    if (st <= 0) return;
    const bc = [mixHex(PAPER.body, CREAM2, .3), mixHex(P.ind2, P.blue1, .55), PAPER.shade, mixHex(GOLD.shade, P.ind2, .35), mixHex(PAPER.lit, LAMP.body, .3)];
    for (let i = 0; i < 7; i++) {
      const n = i === 3 ? Math.max(5, Math.round(lerp(5, COLS[i], cu))) : COLS[i], x = 960 + (i - 3) * 150 * expoOut(cu);
      for (let b = 0; b < n; b++) {
        const tb = i === 3 && b < 5 ? A.hist + .35 + b * .12 : A.books + .1 + Math.abs(i - 3) * .08 + b * .045, k = expoOut(span(t, tb, tb + .35));
        if (k <= 0 || (i !== 3 && cu <= 0)) continue;
        const w = i === 3 && b < 5 ? lerp(260 - b * 12, 120, expoOut(cu)) : 120;
        ctx.save(); ctx.globalAlpha = clamp(k * 3); book(ctx, x + (b % 2 ? 4 : -4), 720 - b * 26 - (1 - k) * 30, w, 24, bc[(b + i) % 5]); ctx.restore();
      }
    }
  }
  function booksText(ctx, t) {
    const nu = io(t, A.hist + .2, A.books + .3);
    X.big(ctx, SRC.harari, 960, 280, 76, nu, { gold: .25 });
    X.label(ctx, SRC.harariRole, 960, 340, nu, { size: 26, spacing: .12 });
    rollSink(ctx, cVal, 960, 250, 136, span(t, A.fifty - .2, A.fifty + 1.4), 1 - span(t, A.look + .2, A.look + .7), { fmt: (v) => Math.round(v) + cSuf });
    X.label(ctx, cWord, 960, 316, span(t, A.fifty + .3, A.fifty + .9) * (1 - span(t, A.look + .2, A.look + .7)), { size: 30, spacing: .3, gold: .4 });
  }
  // --------------------------------------------------------------------------------------------- 1.12–1.13 the reader again, the knot closes around you
  const RD = { x: -1500, y: 706, w: 230 }, KN = { x: -650, y: 400 }, YOU0 = [KN.x, KN.y + 55];
  function readerKnot(ctx, t) {
    X.counterTop(ctx, t, -2800, -760, RD.y + 14, { u: 1, lamp: .7, lampX: -1560 });
    const tm = F.terminal(ctx, t, RD.x, RD.y, RD.w, { wake: .8 });
    const slide = expoIn(span(t, A.honest + .1, A.honest + .85)) * 1700, op = span(t, A.honest - .1, A.honest + .4);
    const k = X.knot(ctx, t, KN.x + slide + 9 * Math.sin(t * 1.3), KN.y + 7 * Math.sin(t * 1.7 + .6), { u: span(t, A.ahead - .05, A.ahead + 1.1), q: span(t, A.ahead + .3, A.ahead + 1.4), pulse: span(t, A.ahead + 1.2, A.ahead + 2), close: span(t, A.aheadW - .1, A.aheadW + 1.1) * (1 - op) });
    // the light line: hanging out of the reader (1.12), then it runs into the knot (1.13)
    const run = sineIO(span(t, A.ahead - .2, A.ahead + .9)), cb = tm.cable;
    const p2 = [lerp(cb[0] + 70, -1330, run), lerp(cb[1] + 30, 520, run)], p3 = [lerp(cb[0] + 120, -1080, run), lerp(cb[1] + 110, k.entry[1] + 60, run)], p4 = [lerp(cb[0] + 150, k.entry[0], run), lerp(cb[1] + 160, k.entry[1], run)];
    X.lightLine(ctx, [cb, p2, p3, p4], 1 - span(t, A.honest + .2, A.honest + 1.0), { w: 3 });
  }
  // --------------------------------------------------------------------------------------------- c03 (local coords; translate DX, DY)
  const CARDS = [{ x: 520, y: 430, r: -.05, t: 'bond', l: 'THE BOND MARKET' }, { x: 960, y: 380, r: 0, t: 'grid', l: 'THE POWER GRID' }, { x: 1400, y: 430, r: .05, t: 'phone', l: 'THE PHONE IN YOUR HAND' }];
  function card(ctx, t, c, i) {
    const fan = expoOut(span(t, A.honest + .55 + i * .1, A.honest + 1.35 + i * .1)), fold = sineIO(span(t, A.hardly - .15 + i * .08, A.hardly + .35 + i * .08));
    if (fan <= 0 || fold >= 1) return;
    const cx = lerp(960, c.x, fan), cy = lerp(690, c.y, fan), s = lerp(.12, 1, fan);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(c.r * fan); ctx.scale(s, s * (1 - fold));
    ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-176, -116, 360, 250, 10); ctx.fill();
    rrect(ctx, -180, -125, 360, 250, 10, lin(ctx, 0, -125, 0, 125, [[0, PAPER.lit], [1, PAPER.body]]), rgba(PAPER.edge, .9), 2);
    const tc = A[c.t], u = span(t, tc - .05, tc + 1.0), ink = PAPER.ink;
    ctx.strokeStyle = ink; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (c.t === 'bond' && u > 0) {   // a yield curve draws itself
      ctx.strokeStyle = rgba(PAPER.faint, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-140, -90); ctx.lineTo(-140, 70); ctx.lineTo(150, 70); ctx.stroke();
      const pts = []; for (let k = 0; k <= 24; k++) { const f = k / 24; pts.push([-130 + f * 260, 50 - 110 * Math.log(1 + 6 * f) / Math.log(7)]); }
      ctx.lineWidth = 4; ctx.strokeStyle = mixHex(ink, GOLD.deep, .5); ctx.beginPath(); pts.slice(0, Math.max(2, Math.ceil(25 * u))).forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    }
    if (c.t === 'grid' && u > 0) {   // a pylon, lines run to three houses
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-130, 70); ctx.lineTo(-108, -80); ctx.lineTo(-96, -80); ctx.lineTo(-74, 70); ctx.moveTo(-132, -60); ctx.lineTo(-72, -60); ctx.stroke();
      [[10, 30], [70, 40], [130, 25]].forEach(([hx, hy], k) => { const q = span(u, .2 + k * .2, .5 + k * .2); if (q <= 0) return;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-72, -60); ctx.quadraticCurveTo(lerp(-72, hx, .5), -40, lerp(-72, hx, q), lerp(-60, hy - 18, q)); ctx.stroke();
        ctx.globalAlpha = q; ctx.fillStyle = mixHex(ink, PAPER.shade, .3); ctx.beginPath(); ctx.moveTo(hx - 20, 70); ctx.lineTo(hx - 20, hy); ctx.lineTo(hx, hy - 18); ctx.lineTo(hx + 20, hy); ctx.lineTo(hx + 20, 70); ctx.fill(); ctx.globalAlpha = 1; });
    }
    if (c.t === 'phone' && u > 0) {   // a phone in your hand, its layers open
      const op = expoOut(span(u, .3, 1)), up = expoOut(span(u, 0, .45));   // the hand lifts the phone up into the card
      ctx.save(); ctx.beginPath(); ctx.roundRect(-180, -125, 360, 250, 10); ctx.clip(); ctx.translate(0, (1 - up) * 240);
      for (let k = 2; k >= 0; k--) rrect(ctx, -60 + k * 42 * op, -95 - k * 10 * op, 84, 160, 12, k ? rgba(mixHex(PAPER.shade, COOL.deep, .25 * k), .9) : mixHex(P.night1, P.ind2, .6), rgba(ink, .7), 2);
      ctx.fillStyle = rgba(COOL.body, .6); ctx.fillRect(-50, -84, 64, 100);
      ctx.save(); ctx.translate(-90, 40); ctx.scale(.42, .42); F.sleeve(ctx, t, 0, 0, { ang: -.5, len: 300 }); ctx.restore();
      ctx.restore();
    }
    const q = span(t, tc + .7, tc + 1.2);
    if (q > 0) txt(ctx, '?', 120, -40, 74, q, { col: mixHex(ink, GOLD.deep, .3) });
    ctx.restore();
    X.label(ctx, c.l, c.x, c.y + 165, span(t, tc + .1, tc + .7) * (1 - fold), { size: 24, spacing: .12 });
  }
  // the field of 100 tiny figures: only two light up
  const FIELD = (() => { const r = prng(707), out = []; for (let row = 0; row < 10; row++) for (let c = 0; c < 10; c++) out.push({ x: 470 + c * 100 + (row % 2) * 50 + (r() - .5) * 20, y: 380 + row * 38, h: 46 + row * 1.8, d: r(), dir: r() > .5 ? 1 : -1, i: row * 10 + c }); return out; })();
  const LIT = new Set([23, 76]);
  function field(ctx, t) {
    const u = span(t, A.hardly + .15, A.hardly + 1.0), out = span(t, A.never - .2, A.never + .7); if (u <= 0 || out >= 1) return;
    const dim = span(t, A.hardly + .7, A.hardly + 1.3), dark = span(t, A.bread - .1, A.bread + .5);
    for (const f of FIELD) {
      const lit = LIT.has(f.i), k = clamp(u * 1.6 - f.d * .6) * (1 - clamp(out * 1.6 - f.d * .6)); if (k <= 0) continue;
      riseClip(ctx, f.x - 40, f.x + 40, f.y, k, f.h * 1.1, () => {
        if (lit && dim > 0) halo(ctx, f.x, f.y - f.h * .6, 90, .7 * dim, LAMP.body, LAMP.core);
        E.person(ctx, f.x, f.y, f.h, { dir: f.dir, light: lit ? 1 + .3 * dim : .95 - .45 * dim - .2 * dark, look: .2 * Math.sin(t * .5 + f.i), armR: [.15, .1], armL: [-.15, -.1], rim: lit ? GOLD.line : mixHex(P.blue1, CREAM2, .5 * (1 - dim)) });
      });
    }
  }
  // the quote card Q1: where its last word (trust) sits, so TRUST can lift off it
  const Q1 = { x: 310, y: 205, w: 1300, size: 58 };
  const q1Pos = (() => { const words = SRC.q1.text.split(/\s+/), pad = 54, lines = []; let cur = [];
    for (const wd of words) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), Q1.size, true) > Q1.w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
    if (cur.length) lines.push(cur);
    const li = lines.length - 1, ln = lines[li]; let xx = pad; for (let k = 0; k < ln.length - 1; k++) xx += F.measure(ln[k], Q1.size, true) + Q1.size * .26;
    const h = 24 + lines.length * Q1.size * 1.22 + 92;
    return { x: Q1.x + xx + F.measure(ln[ln.length - 1], Q1.size, true) / 2, y: Q1.y + 24 + (li + 1) * Q1.size * 1.22, h }; })();
  const PEOPLE = [{ x: 780, t: 'banker', l: 'BANKER' }, { x: 1140, t: 'analyst', l: 'ANALYST' }, { x: 1500 }, { x: 1860 }, { x: 2220 }, { x: 2580 }];
  const GY = 800, HY = 734, YOUX = (t) => lerp(960, 420, sineIO(span(t, A.says + .1, A.says + 1.7)));
  const CHAIN0 = 450, CHAINEND = DESK.x - 110;
  // the chain of people as one path (you → … → the desk); head(t) = how far it has run
  const CPTS = (() => { const xs = [CHAIN0, ...PEOPLE.flatMap((p) => [p.x - 26, p.x + 26]), CHAINEND], pts = [];
    for (let i = 0; i + 1 < xs.length; i += 2) { const seg = F.catenary([xs[i], HY], [xs[i + 1], HY], 22, { n: 10 }); pts.push(...(pts.length ? seg.slice(1) : seg)); if (i + 2 < xs.length) pts.push([xs[i + 2], HY]); }
    return pts; })();
  const CLEN = F.pathLen(CPTS), dAt = (x) => { let d = 0; for (let i = 1; i < CPTS.length; i++) { if (CPTS[i][0] >= x) return d + (x - CPTS[i - 1][0]); d += Math.hypot(CPTS[i][0] - CPTS[i - 1][0], CPTS[i][1] - CPTS[i - 1][1]); } return d; };
  const D_B = dAt(780 - 26), D_A = dAt(1140 - 26);
  function chainHead(t) {
    if (t < A.banker + .25) return 0;
    if (t < A.analyst + .2) return D_B * expoOut(span(t, A.banker + .25, A.banker + .95));
    if (t < A.chainP + .2) return lerp(D_B, D_A, expoOut(span(t, A.analyst + .2, A.analyst + .9)));
    return lerp(D_A, CLEN, sineIO(span(t, A.chainP + .2, A.chainP + 2.6)));
  }
  function c03(ctx, t) {
    const ground = span(t, A.honest + .1, A.honest + 1.3), hand = [YOUX(t) + 30, HY];
    if (ground > 0) { X.lightLine(ctx, [[960, GY], [200, GY]], ground, { w: 2.5, a: .5 }); X.lightLine(ctx, [[960, GY], [DESK.x + 400, GY]], ground * span(t, A.honest + .1, A.chainP + 2.6), { w: 2.5, a: .5 }); }
    CARDS.forEach((c, i) => card(ctx, t, c, i));
    field(ctx, t);
    // the reader beeps once more, a small loaf lands (2.06)
    const rk = span(t, A.bread - .3, A.bread + .3) * (1 - span(t, A.never, A.never + .6));
    riseClip(ctx, 1040, 1220, GY, rk, 200, () => F.terminal(ctx, t, 1130, GY, 110, { wake: 1, ring: span(t, A.bread + .25, A.bread + 1.0), check: span(t, A.bread + .25, A.bread + .6) }));
    const lf = expoOut(span(t, A.bread + .45, A.bread + 1.4)), lo = span(t, A.says - .2, A.says + .3);
    if (lf > 0 && lo < 1) riseClip(ctx, 600, 1700, GY, 1 - lo, 60, () => F.bread(ctx, t, lerp(1600, 1020, lf), GY, 90, {}));
    // the chain of people
    const hd = chainHead(t);
    if (hd > 0) {
      const sub = []; let d = 0; sub.push(CPTS[0]);
      for (let i = 1; i < CPTS.length; i++) { const l = Math.hypot(CPTS[i][0] - CPTS[i - 1][0], CPTS[i][1] - CPTS[i - 1][1]); if (d + l >= hd) { const f = (hd - d) / l; sub.push([lerp(CPTS[i - 1][0], CPTS[i][0], f), lerp(CPTS[i - 1][1], CPTS[i][1], f)]); break; } sub.push(CPTS[i]); d += l; }
      sub[0] = [hand[0], HY];
      const warm = span(t, A.cow + .5, A.cow + 1.5) * (1 - span(t, A.newP + 1, A.newP + 2.5));
      F.chain(ctx, t, sub, { L: 30, link: (i) => ({ lit: .35 * warm }) });
    }
    PEOPLE.forEach((p, i) => {
      const tp = i === 0 ? A.banker - .1 : i === 1 ? A.analyst - .1 : A.chainP + .2 + 2.4 * Math.acos(1 - 2 * clamp((dAt(p.x - 26) - D_A) / (CLEN - D_A))) / Math.PI - .25;
      const k = span(t, tp, tp + .8); if (k <= 0) return;
      riseClip(ctx, p.x - 120, p.x + 120, GY, k, 140, () => E.person(ctx, p.x, GY, 126, { dir: -1, light: .65, look: .15 * Math.sin(t * .6 + i), armR: [1.25, 1.5], armL: [-1.25, -1.5], rim: LAMP.body }));
      if (p.l) X.label(ctx, p.l, p.x, GY - 170, io(t, tp + .3, A.cow), { size: 22, spacing: .16 });
    });
    // the desk at the far end: the lamp lights, later it flickers and dims
    const dk = span(t, A.chainP + 1.9, A.chainP + 2.7);
    if (dk > 0) {
      const fl = span(t, A.newP + 1.2, A.newP + 1.3) * (1 - span(t, A.newP + 2.2, A.newP + 2.3)), flick = Math.sin(t * 37) * Math.sin(t * 23) > .1 ? .35 : 1;
      const lamp = span(t, A.far - .1, A.far + .6) * lerp(1, flick, fl) * lerp(1, .1, span(t, A.newP + 2.3, A.newP + 3.0));
      riseClip(ctx, DESK.x - 300, DESK.x + 300, GY, dk, 260, () => X.deskPerson(ctx, t, DESK.x, DESK.y, DESK.h, { lamp, look: -.35 }));
      X.label(ctx, 'SOMEBODY WHO UNDERSTANDS', DESK.x, DESK.y - 290, io(t, A.far + .2, A.cow - .2), { size: 24, gold: .3 });
    }
    // you (yellow coat): stand in the knot, walk left to start the chain, look along it; the cow steps in beside you (★ 2.14)
    const yx = YOUX(t), walking = t > A.says + .1 && t < A.says + 1.7, look = span(t, A.cow + .6, A.cow + 1.6);
    const ck = span(t, A.cow - .05, A.cow + 1.0);
    if (ck > 0) riseClip(ctx, 60, 400, GY, ck, 100, () => F.cow(ctx, t, 240, GY, 86, { dir: 1, look: .9 * look, graze: 0 }));
    const yk = span(t, A.aheadW - .7, A.aheadW + .1);
    riseClip(ctx, yx - 120, yx + 120, GY, yk, 140, () => E.du(ctx, yx, GY, 122, { dir: 1, light: 1, back: .15, look: .2 + .5 * look, walk: walking ? t * 8 : undefined, armR: [1.2 * span(t, A.banker, A.banker + .6), 1.4 * span(t, A.banker, A.banker + .6)], armL: [-.2, -.15] }));
    // the loaf travels back along the chain into your hands (2.15)
    const lb = span(t, A.worked - .15, A.worked + 1.1);
    if (lb > 0) { const x = lerp(1900, yx + 70, expoOut(lb)), y = HY - 14 + 16 * Math.sin(Math.PI * clamp((x - 780) / 360)); F.bread(ctx, t, x, y, 64, {}); }
    X.label(ctx, 'IT WORKED', 640, 560, io(t, A.worked + .5, A.newP + .4), { size: 30, spacing: .2, gold: .7 });
  }
  function c03Text(ctx, t) {
    // 2.07 NEVER RAN ON / UNDERSTANDING (local), Q1 (2.08–2.10), TRUST lifts off and bends into the first link (2.11)
    X.label(ctx, 'HARDLY ANYONE', 960, 300, io(t, A.hardly + .5, A.bread + .2), { size: 32, spacing: .2, gold: .5 });
    const nu = io(t, A.never + .05, A.says + .2), dim = span(t, A.underst + .5, A.underst + 1.1);
    X.label(ctx, 'CIVILIZATION', 960, 300, nu, { size: 28, spacing: .3 });
    X.big(ctx, 'NEVER RAN ON', 960, 410, 104, span(t, A.never + .15, A.never + .8) * (1 - span(t, A.says - .2, A.says + .3)), { gold: .2 });
    X.big(ctx, 'UNDERSTANDING', 960, 530, 104, span(t, A.never + .35, A.never + 1.0) * (1 - span(t, A.says - .2, A.says + .3)), { gold: 0, col: mixHex(CREAM, P.blue1, .62 * dim), glow: dim < .5 });
    const cu = span(t, A.says + .1, A.says + 1.0), fold = sineIO(span(t, A.banker - .1, A.banker + .6));
    if (cu > 0 && fold < 1) {
      ctx.save(); ctx.translate(960, Q1.y + q1Pos.h / 2); ctx.scale(lerp(1, .02, fold) ** .5, 1 - fold); ctx.translate(-960, -(Q1.y + q1Pos.h / 2));
      F.quoteCard(ctx, t, T, { text: SRC.q1.text, credit: SRC.q1.credit, spoken: SRC.q1.spoken, after: A.says, size: Q1.size, w: Q1.w, x: Q1.x, y: Q1.y, u: cu, rot: -.004 });
      ctx.restore();
    }
    const lift = expoOut(span(t, A.trust + .3, A.trust + .9)), go = sineIO(span(t, A.banker - .2, A.banker + .75)), bend = span(t, A.banker + .45, A.banker + .9);
    if (lift > 0 && bend < 1) {
      const mid = [(YOUX(t) + 30 + 754) / 2, HY], x = lerp(q1Pos.x, mid[0], go), y = lerp(q1Pos.y - 60 * lift, mid[1] + 12, go), s = lerp(1, .35, go);
      ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 - bend), s * (1 - bend)); X.big(ctx, 'TRUST', 0, 0, 72, 1, { gold: 1 }); ctx.restore();
      if (bend > 0) F.chainLink(ctx, t, mid[0], mid[1], lerp(10, 30, bend), 0, { lit: 1 - bend });
    }
  }
  // --------------------------------------------------------------------------------------------- the Leitbild (anchor 2/4) + its two masks
  const home = (() => { const c = createCanvas(W, H); return S.chainWorld(c.getContext('2d'), A.last, S.homeCam(), { four: 1, sway: 5 }); })();
  const TRUTH0 = home.named[3];
  const pushU = (t) => sineIO(span(t, A.last + .1, A.last + 1.9));
  function camW(t) {
    const g = 1 + .035 * span(t, A.four, A.last), k = pushU(t), z = g * Math.pow(3.1, k);
    return E.cam(z, lerp(940, TRUTH0[0], k), lerp(560, TRUTH0[1], k), lerp(940, TRUTH0[0] - 80, k), lerp(560, TRUTH0[1] + 40, k));
  }
  function world(ctx, t) {
    const nm = A.names, links = [0, 1, 2, 3].map((i) => ({ lit: Math.max(span(t, nm[i] - .05, nm[i] + .35) * (1 - .5 * span(t, nm[i] + .8, nm[i] + 1.4)), i === 3 ? span(t, A.last + .3, A.last + 1.0) : 0), hair: span(t, A.strain + .1, A.strain + 1.2) }));
    return S.chainWorld(ctx, t, camW(t), { four: span(t, A.four + .5, A.four + 2.2), names: nm.map((n) => span(t, n - .1, n + .45)), links, taut: sineIO(span(t, A.strain - .1, A.strain + 1.4)), sway: 6 });
  }
  const N3 = (() => { const c = createCanvas(W, H); return world(c.getContext('2d'), M2[0]).named[3]; })();   // where the TRUTH link is when the board opens
  const circleClip = (ctx, x, y, r) => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip(); };
  // --------------------------------------------------------------------------------------------- stage B (board = screen at V0)
  const V0 = V(960, 540, 1);
  const D3 = { x: 260 + 3 * 155, y: 700 };
  const VB = [[M2[0], V0], [A.explain - .1, V0], [A.explain + 1.7, V(D3.x + 10, 610, 2.5)], [C2.start + .5, V(D3.x + 10, 606, 2.55)], [C2.end - .5, V0],
    [A.whatH + 1.2, V0], [A.contract + .1, V(960, 640, 1.07)], [A.contract + 1.9, V0], [A.cracks - .05, V0], [A.cracks + 2.7, V(960, 540, .3)], [M3[1] + 1, V(960, 540, .3)]];
  const viewB = (t) => breathe(X.viewPath(t, VB), t);
  // the HUD row (2.23): the four links shrink from the TRUTH link's place into the HUD; same geometry as F.chainHud at the end
  function hudRow(ctx, t, k, a0, x0, y0, L0, truthLit) {
    const x = lerp(x0, F.HUD.x, k), y = lerp(y0, F.HUD.y, k), Lh = lerp(L0, F.HUD.L, k), gap = Lh * 1.02, sw = Math.sin(t * .9) * .03;
    const rot = lerp(a0, 0, sineIO(span(k, 0, .5)));
    for (let i = 0; i < 3; i++) F.chainLink(ctx, t, x + (i + .5) * gap, y, Lh * .62, sw + rot, { edge: true });
    for (let i = 0; i < 4; i++) F.chainLink(ctx, t, x + i * gap, y, Lh, sw + rot + (i % 2 ? .04 : -.04), { lit: i === 3 ? truthLit : 0 });
  }
  const BOE = SRC.boe.split(' · ');
  const [AG, HU] = SRC.agentsSub.replace(/[“”"]/g, '').split(', ');
  const DESKS = Array.from({ length: 10 }, (_, i) => ({ x: 260 + i * 155, ai: i !== 2 && i !== 7 }));
  const BLK = { gold: [520, 560], three: [1020, 1240, 1460], s: 170 };
  function boardB(ctx, t, v) {
    const st = F.chainState(T, t);
    // 3.01 the MONEY link lifts out of the row (on its way into the HUD); 3.02 it opens into the table
    const mo = sineIO(span(t, A.money - 1.05, A.money + .95)), tab = sineIO(span(t, A.adviser - .1, A.adviser + 1.1));
    const ppl = span(t, A.adviser + .3, A.adviser + 1.2) * (1 - span(t, A.boe - .2, A.boe + .7));
    if (mo > 0 && tab < 1) {
      // it lifts out of the first link of the row while the row shrinks into the HUD (no empty stage in the pause)
      const hk = sineIO(span(Math.min(t, A.money - .7), HUDLAND[0], HUDLAND[1])), L0 = N3[2], x0 = N3[0] - 3 * L0 * 1.02;
      const [sx, sy] = [lerp(x0, F.HUD.x, hk), lerp(N3[1], F.HUD.y, hk)], bx = v.x + (sx - W / 2) / v.s, by = v.y + (sy - H / 2) / v.s;
      const x = lerp(bx, 960, mo), y = lerp(by, 440, mo), Lk = lerp(lerp(L0, F.HUD.L, hk) / v.s, 320, mo);
      ctx.save(); ctx.translate(x, lerp(y, 640, tab)); ctx.scale(lerp(1, 2.3, tab), lerp(1, .1, tab));
      F.chainLink(ctx, t, 0, 0, Lk, (1 - mo) * -.04, { lit: (.55 + .15 * Math.sin(t * 2)) * span(mo, .05, .5), a: 1 - span(tab, .7, 1) }); ctx.restore();
      X.label(ctx, 'MONEY', 960, 600, span(t, A.money + .7, A.money + 1.3) * (1 - span(t, A.adviser - .2, A.adviser + .2)), { size: 36, spacing: .2, gold: .7 });
    }
    if (tab > .7 && ppl > 0) {
      const k = expoOut(ppl);
      ctx.fillStyle = mixHex(P.night1, P.blue1, .4); ctx.fillRect(960 - 360, 634, 720, 14);
      ctx.fillStyle = rgba(GOLD.line, .45); ctx.fillRect(960 - 360, 634, 720, 2.5);
      riseClip(ctx, 560, 1360, 840, k, 300, () => { ctx.fillStyle = mixHex(P.night1, P.blue1, .35); ctx.fillRect(620, 648, 14, 192); ctx.fillRect(1286, 648, 14, 192); });
      X.lightLine(ctx, [[960, 840], [380, 840]], k, { w: 2.5, a: .5 }); X.lightLine(ctx, [[960, 840], [1540, 840]], k, { w: 2.5, a: .5 });
      riseClip(ctx, 450, 820, 840, k, 330, () => E.du(ctx, 660, 840, 290, { dir: 1, light: 1, back: .2, look: .15, armR: [.9, 1.3], armL: [-.2, -.1] }));
      riseClip(ctx, 1100, 1500, 840, k, 330, () => E.person(ctx, 1250, 840, 300, { dir: -1, light: .8, look: .1, armR: [1.4, 1.9], armL: [-.3, -.2], rim: LAMP.body }));
    }
    // the paper with the WHY arrows → the survey sheet (3.03) → folds into the source line (3.04)
    const pap = span(t, A.adviser + .6, A.adviser + 1.3), sv = sineIO(span(t, A.boe - .1, A.boe + 1.1)), fl = sineIO(span(t, A.oneIn4 - .2, A.oneIn4 + .6));
    if (pap > 0 && fl < 1) {
      const r0 = { x: 860, y: 340, w: 200, h: 264 }, r1 = { x: 260, y: 240, w: 700, h: 400 }, R = {}; for (const key of ['x', 'y', 'w', 'h']) R[key] = lerp(r0[key], r1[key], sv);
      const ry = lerp(R.y, 868, fl), rh = lerp(R.h, 3, fl), rx = lerp(R.x, 110, fl), rw = lerp(R.w, 1100, fl);
      riseClip(ctx, 0, W, 634, sv > 0 ? 1 : pap, 300, () => {
        if (sv < .98 || fl > 0) rrect(ctx, rx, ry, rw, rh, 6, lin(ctx, 0, ry, 0, ry + rh, [[0, PAPER.lit], [1, PAPER.body]]), rgba(PAPER.edge, .9), 2);
        if (sv <= 0) {   // three gold arrows: the why
          [[[900, 400], [1000, 400], [1000, 450]], [[900, 470], [960, 520], [1020, 470]], [[910, 560], [1010, 560]]].forEach((p, k) => {
            const u = expoOut(span(t, A.why - .15 + k * .25, A.why + .35 + k * .25)); if (u <= 0) return;
            const e = F.goldSpan(ctx, p, 0, u, { w: 3, spark: false });
            if (u > .9 && e) { const [ax, ay] = p[p.length - 1], [bx, by] = p[p.length - 2], an = Math.atan2(ay - by, ax - bx); F.goldSpan(ctx, [[ax - 16 * Math.cos(an - .5), ay - 16 * Math.sin(an - .5)], [ax, ay], [ax - 16 * Math.cos(an + .5), ay - 16 * Math.sin(an + .5)]], 0, 1, { w: 3, spark: false }); }
          });
        }
      });
      if (sv > .97 && fl <= 0) F.paperCard(ctx, t, r1.x, r1.y, r1.w, r1.h, { u: lerp(.35, 1, span(t, A.boe + 1.0, A.boe + 1.8)), head: BOE[0], lines: [[BOE[1], 46]], src: BOE[2] });
    }
    // firm blocks (3.03) → four blocks, one lights gold (3.04) → three seal into the maker's box (3.05) → they fold into the desk row (3.06)
    const bIn = span(t, A.boe + 1.3, A.boe + 2.6), four = sineIO(span(t, A.oneIn4 - .2, A.oneIn4 + .9)), seal = sineIO(span(t, A.most - .1, A.most + 1.0)), dn = sineIO(span(t, A.eight - .2, A.eight + .6));
    if (bIn > 0 && dn < 1) {
      ctx.save(); ctx.translate(0, 645); ctx.scale(1, 1 - dn); ctx.translate(0, -645);
      for (let j = 0; j < 12; j++) {
        const k = expoOut(span(t, A.boe + 1.3 + j * .07, A.boe + 2.0 + j * .07)); if (k <= 0) continue;
        const c = j % 4, r = Math.floor(j / 4), g = c === 0 ? 0 : c;   // group: column c → big block c
        const sx = lerp(960, 1140 + c * 120, k), sy = lerp(450, 600 - r * 92, k);
        const tx = g === 0 ? BLK.gold[0] : lerp(BLK.three[g - 1], [1070, 1240, 1410][g - 1], seal), ty = BLK.gold[1];
        const x = lerp(sx, tx, four), y = lerp(sy, ty, four), s = lerp(80, BLK.s, four) * (four > 0 ? 1 : 1);
        if (four > .5 && r > 0) continue;   // the three of a column merged into one block
        const gold = g === 0 ? span(t, A.oneIn4 + .5, A.oneIn4 + 1.1) : 0;
        rrect(ctx, x - s / 2, y - s / 2, s, s, 10, gold > 0 ? lin(ctx, x, y - s / 2, x, y + s / 2, [[0, mixHex(P.ind2, GOLD.hot, gold)], [1, mixHex(P.ind2, GOLD.mid, gold)]]) : mixHex(P.night1, P.ind2, .8), rgba(CREAM, .7), 2);
        if (gold > 0) halo(ctx, x, y, s * 1.3, .35 * gold, GOLD.halo, GOLD.core);
      }
      if (seal > 0) {   // the maker's box closes round the three: outline, lid lines meet in the middle, a band across
        const bx = 960, by = 460, bw = 560, bh = 200, su = expoOut(seal);
        ctx.strokeStyle = rgba(CREAM, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
        X.lightLine(ctx, [[bx, by], [bx + bw / 2, by]], span(t, A.most + .6, A.most + 1.1), { w: 3 }); X.lightLine(ctx, [[bx + bw, by], [bx + bw / 2, by]], span(t, A.most + .6, A.most + 1.1), { w: 3 });
        ctx.globalAlpha = su * .9; ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(bx + 2, by + 2, bw - 4, bh - 4); ctx.globalAlpha = 1;
        ctx.fillStyle = rgba(PAPER.shade, .85 * span(t, A.most + .9, A.most + 1.3)); ctx.fillRect(bx + bw / 2 - 22, by - 4, 44, bh + 8);
      }
      ctx.restore();
      const nu = 1 - span(t, A.eight - .3, A.eight + .2);
      X.big(ctx, 'ABOUT 1 IN 4', BLK.gold[0], 360, 76, span(t, A.oneIn4 + .3, A.oneIn4 + .9) * nu, { gold: .9 });
      X.label(ctx, SRC.boe24, BLK.gold[0], 720, span(t, A.oneIn4 + .7, A.oneIn4 + 1.3) * nu, { size: 22, spacing: .08 });
      rollSink(ctx, parseFloat(SRC.boe81), 1240, 360, 110, span(t, A.most + .3, A.most + 1.6), nu, { fmt: (v) => Math.round(v) + '%', gold: 0 });
      X.label(ctx, SRC.boe81, 1240, 720, span(t, A.most + .6, A.most + 1.2) * nu, { size: 22, spacing: .08 });
    }
    // ten desks, eight with an agent screen (3.06); every human signs (3.07); push to one desk (3.08); the proposal → a strange product (3.09)
    const dk = span(t, A.eight + .2, A.eight + 1.1), dOut = span(t, C2.start + .3, C2.start + .35);
    if (dk > 0 && dOut < 1) {
      X.lightLine(ctx, [[960, 700], [120, 700]], dk, { w: 2.5, a: .5 }); X.lightLine(ctx, [[960, 700], [1800, 700]], dk, { w: 2.5, a: .5 });
      DESKS.forEach((d, i) => {
        const k = span(t, A.eight + .3 + Math.abs(i - 4.5) * .06, A.eight + 1.0 + Math.abs(i - 4.5) * .06); if (k <= 0) return;
        riseClip(ctx, d.x - 90, d.x + 90, 700, k, 140, () => X.deskPerson(ctx, t, d.x, 700, 110, { lamp: .55, look: -.25 }));
        const ak = span(t, A.eight + 1.0 + i * .06, A.eight + 1.5 + i * .06);
        if (d.ai) riseClip(ctx, d.x - 10, d.x + 90, 654, ak, 80, () => X.aiScreen(ctx, t, d.x + 44, 654, 52, {}));
        const sg = span(t, A.human + .1 + i * .07, A.human + .5 + i * .07);
        if (sg > 0) F.goldSpan(ctx, [[d.x - 40, 650], [d.x - 32, 643], [d.x - 25, 651], [d.x - 17, 642], [d.x - 6, 649]], 0, sg, { w: 1.6, spark: sg < 1 });
      });
      // the proposal over desk 3: signature under it, a ? beside it; then it folds into a knot of cool lines
      const pr = span(t, A.explain + .5, A.explain + 1.2), tw = sineIO(span(t, A.step + .2, A.step + 1.4));
      if (pr > 0) {
        if (tw < 1) { ctx.save(); ctx.translate(D3.x - 6, 576); ctx.scale(1 - tw, 1 - tw); ctx.rotate(tw * 1.5); X.doc(ctx, t, 0, 0, 62, { kind: 'form', u: pr }); F.goldSpan(ctx, [[-20, 30], [-12, 24], [-4, 31], [6, 23]], 0, span(t, A.explain + 1.0, A.explain + 1.4), { w: 1.4, spark: false }); ctx.restore(); }
        const q = span(t, A.explain + 1.4, A.explain + 2.0) * (1 - span(t, A.step - .1, A.step + .4));
        if (q > 0) txt(ctx, '?', D3.x + 58, 590, 56, q, { col: CREAM, glow: true });
        const gr = expoOut(span(t, A.step + .5, A.step + 2.5));
        if (gr > 0) { const n = Math.floor(3 + 9 * span(t, A.step + .5, A.step + 4.5)), R = 46 * gr;
          ctx.save(); ctx.translate(D3.x - 6, 576); ctx.strokeStyle = rgba(COOL.line, .85); ctx.lineWidth = 1.3;
          for (let k = 0; k < n; k++) { ctx.beginPath(); for (let s = 0; s <= 60; s++) { const a = s / 60 * TAU, x = R * Math.sin(a * (2 + k % 3) + k + t * .25), y = R * .8 * Math.sin(a * (3 + k % 2) + k * .7); s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
          ctx.restore(); halo(ctx, D3.x - 6, 576, 90 * gr, .3, COOL.halo, COOL.core); }
      }
    }
    // 3.11 ★ the clip frame closes into the MONEY link: the crack runs through it, it holds
    const lk = span(t, C2.end + .3, C2.end + .5), back = sineIO(span(t, A.expert - .2, A.expert + 1.4));
    if (lk > 0 && back < 1) {
      const sh = Math.sin(t * 60) * 3 * (1 - span(t, A.holds + .05, A.holds + .7)) * span(t, A.holds - .05, A.holds + .05);
      F.chainLink(ctx, t, lerp(960 + sh, F.HUD.x, back), lerp(470, F.HUD.y, back), lerp(360, F.HUD.L, back), lerp(0, -.04, back), { lit: .5 * (1 - back), crack: st.links[0].crack });
    }
    // 3.12 the adviser looks up at the agent screen; 3.13 he walks out, the screen alone: NO; 4.01 NO → the CONTRACT link
    const ad = span(t, A.expert + .5, A.expert + 1.4), wk = span(t, A.whatH - .1, A.whatH + 1.6), gs = sineIO(span(t, A.whatH + .7, A.whatH + 2.4)), ck = sineIO(span(t, A.contract - .1, A.contract + 1.4));
    if (ad > 0 && ck < 1) {
      riseClip(ctx, 700, 1500, 860, ad * (1 - span(t, A.contract - .1, A.contract + .6)), 420, () => adviserDesk(ctx, t, 1100, 860, 360, { lamp: 1 - .7 * wk, look: .45 + .05 * Math.sin(t * .7), walk: wk }));
      const sx = lerp(560, 960, gs) + gs * 16 * Math.sin(t * 1.2 + 1), sy = lerp(620, 690, gs) + gs * 7 * Math.sin(t * 1.3), sw = lerp(360, 560, gs) * (1 - ck);
      if (sw > 2) riseClip(ctx, sx - 400, sx + 400, 860, ad, 600, () => screenText(ctx, t, sx, sy, sw, 'NO', span(t, A.noW + .15, A.noW + .6)));
    }
    const lgo = sineIO(span(t, A.lawsuit - .1, A.lawsuit + 1.5));
    if (ck > 0 && lgo < 1) {
      F.chainLink(ctx, t, lerp(960, F.HUD.x + F.HUD.L * 1.02, lgo), lerp(lerp(500, 250, ck), F.HUD.y, lgo), lerp(lerp(20, 220, ck), F.HUD.L, lgo), lgo * (.04 + Math.sin(t * .9) * .03), { lit: .5 * (1 - lgo), crack: st.links[1].crack });
      X.label(ctx, 'CONTRACT', 960, 366, span(t, A.contract + 1.1, A.contract + 1.6) * (1 - span(t, A.soft - .2, A.soft + .3)), { size: 32, spacing: .2, gold: .7 });
    }
    // 4.02–4.05 three sheets drop out of the link, YES writes itself on each
    const SH = [['A JOB', 'contract', A.job], ['A LOAN', 'form', A.loan], ['AN INSURANCE POLICY', 'contract', A.policy]];
    const cov = span(t, A.soft + .9, A.soft + 1.0);
    if (cov < 1) SH.forEach(([l, kind, ts], i) => {
      const k = expoOut(span(t, ts - .1, ts + .7)); if (k <= 0) return;
      const x = lerp(960, 520 + i * 440, k), y = lerp(260, 600, k);
      X.doc(ctx, t, x, y, lerp(40, 220, k), { kind, u: k, rot: (i - 1) * .02 * k });
      X.label(ctx, l, 520 + i * 440, 800, span(t, ts + .2, ts + .8), { size: 26, spacing: .12 });
      const yu = span(t, A.yesW + i * .28, A.yesW + .4 + i * .28);
      if (yu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - 80, 610, 160 * yu, 96); ctx.clip(); F.goldText(ctx, [['Yes', 0]], x, 692, 66, 1, { serif: true, align: 'center', col: mixHex(GOLD.shade, GOLD.deep, .35) }); ctx.restore();
        F.goldSpan(ctx, [[x - 50, 702], [x + 50, 698]], 0, span(yu, .5, 1), { w: 2, spark: false }); }
    });
    // 4.06 a cool screen slides in front of the sheets → 4.07 it turns into the court filing → 4.08 it shrinks to a tag, applications pour out
    const sc = expoOut(span(t, A.soft - .1, A.soft + 1.0)), fm = sineIO(span(t, A.lawsuit + .1, A.lawsuit + 1.3)), tg = sineIO(span(t, A.billion - .4, A.billion + .9)), fOut = span(t, A.falseP - .2, A.falseP + .5);
    const RS = { x: 330, y: 400, w: 1260, h: 400 }, RF = { x: 560, y: 330, w: 800, h: 400 }, RT = { x: 80, y: 120, w: 360, h: 180 };
    if (sc > 0 && fOut < 1) {
      const R = {}; for (const key of ['x', 'y', 'w', 'h']) R[key] = lerp(lerp(RS[key], RF[key], fm), RT[key], tg); R.x -= sineIO(fOut) * 560;   // the tag slides out over the left edge
      const yy = R.y + (1 - sc) * 700, pc = fm;
      if (fm < 1) {
        rrect(ctx, R.x, yy, R.w, R.h, 14, mixHex(mixHex(COOL.deep, P.night1, .3), PAPER.body, pc), rgba(mixHex(COOL.line, PAPER.edge, pc), .9), 3);
        if (pc < .3) { const ex = R.x + R.w / 2, ey = yy + R.h / 2; for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba(COOL.core, (.35 + .15 * k) * (1 - pc * 3)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ex, ey, (70 - k * 20) * (1 + .03 * Math.sin(t * 1.4 - k)), 0, TAU); ctx.stroke(); } halo(ctx, ex, ey, 220, .25 * (1 - pc * 3), COOL.halo, COOL.core); }
      } else {
        const WF = SRC.workday.split(' · ');
        ctx.save(); ctx.translate(R.x, R.y); ctx.scale(R.w / RF.w, R.h / RF.h); ctx.translate(-RF.x, -RF.y);
        F.paperCard(ctx, t, RF.x, RF.y, RF.w, RF.h, { u: lerp(.35, 1, span(t, A.lawsuit + 1.3, A.lawsuit + 2.1)), head: WF[1], lines: [[WF[0], 66]], src: WF[2] });
        ctx.restore();
      }
    }
    // ★ 4.08 1.1 BILLION: tiny sheets pour from the filing into a heap; 4.09 a group stands up out of it; 4.10 it gathers into the scale's pan
    const hg = span(t, A.billion + .2, A.billion + 3.6) * (1 - sineIO(span(t, A.falseP + .2, A.falseP + 1.4)));
    if (hg > 0) {
      const hw = 520 * Math.sqrt(hg), hh = 130 * hg, hx = 960, hb = 830;
      ctx.fillStyle = lin(ctx, 0, hb - hh, 0, hb, [[0, mixHex(PAPER.body, P.ind2, .35)], [1, mixHex(PAPER.shade, P.night1, .6)]]);
      ctx.beginPath(); ctx.moveTo(hx - hw, hb); ctx.quadraticCurveTo(hx, hb - hh * 2, hx + hw, hb); ctx.closePath(); ctx.fill();
      const r = prng(41); ctx.fillStyle = rgba(PAPER.lit, .5); for (let k = 0; k < 60; k++) { const f = r() * 2 - 1, x = hx + f * hw * .9, y = hb - hh * (1 - f * f) * r() * 1.8; if (y < hb - 4) { ctx.save(); ctx.translate(x, y); ctx.rotate(r() - .5); ctx.fillRect(-7, -5, 14, 10); ctx.restore(); } }
    }
    const pour = [A.billion + .3, A.billion + 3.8];
    if (t > pour[0] && t < pour[1] + 1) { const r = prng(9); for (let i = 0; i < 260; i++) {
      const t0 = pour[0] + i * .0135, jx = r(), jy = r(), sp = r(); const f = (t - t0) / .95; if (f < 0 || f > 1) continue;
      const sx = 260 + (jx - .5) * 160, sy = 300, ex = 960 + (jx - .5) * 820 * Math.sqrt(span(t0, pour[0], pour[1])) , ey = 830 - 40 * jy;
      const x = lerp(sx, ex, f), y = sy + (ey - sy) * f * f - 160 * Math.sin(Math.PI * f) * (1 - f);
      ctx.save(); ctx.translate(x, y); ctx.rotate((sp - .5) * 6 * f + sp * 3); ctx.fillStyle = PAPER.lit; ctx.fillRect(-7, -9, 14, 18); ctx.fillStyle = rgba(PAPER.faint, .7); ctx.fillRect(-4, -5, 8, 1.5); ctx.fillRect(-4, -1, 6, 1.5); ctx.restore();
    } }
    // the scale (4.10–4.11, swinging, never settles), the corner (4.12–4.15)
    const su = span(t, A.falseP + .2, A.falseP + 1.4), corner = sineIO(span(t, A.second - .1, A.second + 1.3)), uz = sineIO(span(t, A.undec - .1, A.undec + .9)) * (1 - span(t, A.cracks + .4, A.cracks + 1.4));
    let pans = null;
    if (su > 0) {
      const th = .13 * Math.sin((t - A.falseP) * 1.25 + .6) * (.6 + .4 * span(t, A.falseP + 1, A.falseP + 2)) + .05 * Math.sin(t * .53);
      const cs = lerp(1, .36 + .1 * uz, corner), cx = lerp(960, 270, corner), cy = lerp(0, 430, corner);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(cs, cs); ctx.translate(-960, 0);
      pans = scale(ctx, t, 960, 830, 410, 330, th, { u: su });
      if (pans) {
        X.label(ctx, 'THE CLAIMS', pans.pl[0], pans.pl[1] + 54, span(t, A.falseP + 1.2, A.falseP + 1.8), { size: 26, spacing: .12 });
        X.label(ctx, 'FALSE', pans.pr[0], pans.pr[1] + 54, span(t, A.falseP + 1.5, A.falseP + 2.1), { size: 26, spacing: .2 });
        const g = span(t, A.falseP + 1.3, A.falseP + 1.9);
        if (g > 0) for (let k = 0; k < 5; k++) riseClip(ctx, pans.pl[0] - 80, pans.pl[0] + 80, pans.pl[1], span(g, k * .1, .6 + k * .1), 50, () => E.person(ctx, pans.pl[0] - 52 + k * 26, pans.pl[1], 42, { dir: 1, light: .7, armR: [.1, .1], armL: [-.1, -.1], rim: LAMP.body }));
      }
      ctx.restore();
    }
    const cr = span(t, A.suing - .1, A.suing + .9), gat = span(t, A.falseP + .4, A.falseP + 1.5);
    if (cr > 0 && gat < 1) X.crowdRise(ctx, t, 960, 832, 14, 7, 96, { u: cr, seed: 40, gather: [700, 620], g: gat, rim: LAMP.body });
    // 4.12 the shadow profile + the covered score; 4.13 the empty tray; 4.14 the glass and the pencil
    const pf = expoOut(span(t, A.second + .4, A.second + 1.4)), pOut = 0;
    if (pf > 0 && pOut < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - pOut;
      const sp = expoOut(span(t, A.second + .8, A.second + 1.7));
      if (sp > 0) { const x = lerp(820, 940, sp), y = lerp(520, 260, sp);
        rrect(ctx, x, y, 360, 210, 12, mixHex(P.night1, P.ind2, .6), rgba(GOLD.line, .45), 2);
        X.label(ctx, SRC.score, x + 180, y + 52, span(t, A.second + 1.3, A.second + 1.9), { size: 22, spacing: .1 });
        for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(x + 60 + k * 48, y + 120, 14, 0, TAU); ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 2; ctx.stroke(); }
        const cov = expoOut(span(t, A.second + 2.0, A.second + 2.8)); rrect(ctx, x + 20, y + 84, 320 * cov, 76, 8, mixHex(P.night0, P.ind1, .3), rgba(CREAM, .3), 1.5);
        for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba(CREAM2, .25); if (cov > k / 6) ctx.fillRect(x + 40 + k * 50, y + 100, 30, 3); } }
      ctx.save(); ctx.translate(820, 540 + (1 - pf) * 60);
      rrect(ctx, -200, -240, 400, 480, 12, mixHex(P.night1, P.ind2, .45), rgba(CREAM, .55), 2);
      ctx.save(); ctx.beginPath(); ctx.roundRect(-170, -210, 160, 200, 10); ctx.clip(); ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(-170, -210, 160, 200);
      E.person(ctx, -90, 120, 230, { dir: 1, light: .2, look: 0, armR: [.1, .1], armL: [-.1, -.1], rim: mixHex(P.blue1, CREAM2, .3) }); ctx.restore();
      const wrong = span(t, A.correct - .2, A.correct + .3);
      for (let k = 0; k < 7; k++) { const y = -190 + k * 34 + (k > 4 ? 150 : 0), w = [120, 90, 140, 110, 80, 300, 260][k], x = k > 4 ? -170 : 20;
        if (k === 2 && wrong > 0) { ctx.fillStyle = rgba(COOL.body, .45 * wrong); ctx.fillRect(x - 8, y - 9, w + 16, 22); }
        ctx.fillStyle = rgba(k === 2 ? mixHex(CREAM, COOL.core, wrong) : CREAM, .65); ctx.fillRect(x, y, w, 5); }
      ctx.restore();
      // the empty tray (NO NOTICE)
      const tr = span(t, A.notice - .1, A.notice + .7);
      if (tr > 0) { const p = [[1370, 700], [1400, 770], [1600, 770], [1630, 700]]; X.lightLine(ctx, p, tr, { w: 3, a: .8 }); ctx.fillStyle = rgba(P.night0, .5 * tr); ctx.fillRect(1400, 740, 200, 30); }
      X.label(ctx, 'NO NOTICE', 1500, 650, io(t, A.notice + .2, A.cracks + .9), { size: 26, spacing: .16 });
      // the pane of glass, the pencil stops at it (NO WAY TO CORRECT)
      const gl = expoOut(span(t, A.correct - .1, A.correct + .7));
      if (gl > 0) { const gy = lerp(-500, 0, gl); ctx.fillStyle = rgba(COOL.body, .1); ctx.fillRect(600, 290 + gy, 450, 500); ctx.strokeStyle = rgba(COOL.core, .55); ctx.lineWidth = 2; ctx.strokeRect(600, 290 + gy, 450, 500);
        ctx.strokeStyle = rgba(COOL.core, .25); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(900, 300 + gy); ctx.lineTo(1030, 420 + gy); ctx.moveTo(940, 300 + gy); ctx.lineTo(1040, 390 + gy); ctx.stroke(); }
      const pc = span(t, A.correct + .3, A.correct + 1.1);
      if (pc > 0) { const x = lerp(1700, 1052, expoOut(pc)) + 6 * Math.sin(Math.PI * span(t, A.correct + 1.05, A.correct + 1.35)); ctx.save(); ctx.translate(x, 470); ctx.rotate(-.18);
        rrect(ctx, 26, -9, 220, 18, 4, mixHex(LAMP.body, PAPER.shade, .4)); ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.moveTo(26, -9); ctx.lineTo(0, 0); ctx.lineTo(26, 9); ctx.fill(); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(8, -3); ctx.lineTo(0, 0); ctx.lineTo(8, 3); ctx.fill(); ctx.restore(); }
      X.label(ctx, 'NO WAY TO CORRECT', 1500, 560, io(t, A.correct + .6, A.cracks + .9), { size: 26, spacing: .14 });
      ctx.restore();
    }
    // 4.16 everything sits inside the CONTRACT link (huge, around the frame); the crack runs through it
    if (t > A.cracks - .3) { ctx.save(); ctx.globalAlpha *= sineIO(span(t, A.cracks - .3, A.cracks + .4)); F.chainLink(ctx, t, 960, 540, lerp(4500, 3800, sineIO(span(t, A.cracks - .3, A.cracks + .9))), 0, { crack: st.links[1].crack, lit: .15 }); ctx.restore(); }   // its shade settles over .7 s
  }
  function boardBText(ctx, t) {
    X.big(ctx, 'WHY', 960, 250, 96, io(t, A.why + .1, A.boe), { gold: .9 });
    X.big(ctx, '8 IN 10', 960, 300, 104, io(t, A.eight + .7, A.explain), { gold: .2 });
    X.label(ctx, AG, 960, 372, io(t, A.eight + 1.1, A.explain), { size: 28, spacing: .16 });
    X.label(ctx, HU, 960, 420, io(t, A.human + .1, A.explain), { size: 28, spacing: .16, gold: .6 });
    X.label(ctx, SRC.esma, 960, 190, io(t, A.explain + 1.4, A.step + .2), { size: 30, spacing: .12 });
    X.label(ctx, 'PRODUCTS MACHINES INVENT', 960, 190, io(t, A.step + 1.4, C2.start - .3), { size: 30, spacing: .12 });
    X.big(ctx, 'HOLDS, WITH A CRACK', 960, 760, 64, io(t, A.holds + .9, A.expert + .3), { gold: .7 });
    X.label(ctx, 'THE EXPERT TRUSTS TOO', 960, 190, io(t, A.expert + 1.2, A.whatH + .2), { size: 30, spacing: .14 });
    X.label(ctx, 'SOFTWARE ANSWERS FIRST', 960, 340, io(t, A.soft + .7, A.lawsuit + .2), { size: 30, spacing: .14 });
    rollSink(ctx, parseFloat(SRC.billion), 1120, 260, 132, span(t, A.billion - .05, A.billion + 1.5), 1 - span(t, A.falseP - .2, A.falseP + .3), { fmt: (v) => v.toFixed(1) + SRC.billion.replace(/^[\d.]+/, '') });
    X.label(ctx, SRC.billionWord, 1120, 326, span(t, A.billion + .6, A.billion + 1.2) * (1 - span(t, A.falseP - .2, A.falseP + .3)), { size: 28, spacing: .2 });
    X.label(ctx, SRC.over40, 1120, 410, io(t, A.suing + .4, A.falseP + .3), { size: 26, spacing: .12 });
    X.label(ctx, SRC.workdaySays, 960, 200, io(t, A.falseP + .4, A.ruled + .1), { size: 30, spacing: .12 });
    X.big(ctx, SRC.noRuling, 960, 220, 66, io(t, A.ruled + .2, A.second + .1), { gold: .15 });
    X.label(ctx, SRC.eightfold.split(' · ')[0], 960, 180, io(t, A.second + .5, A.cracks + .6), { size: 32, spacing: .12 });
    X.label(ctx, 'UNDECIDED', 270, 330, io(t, A.undec + .3, A.cracks + .6), { size: 28, spacing: .2 });
    X.big(ctx, 'THIS IS HOW A LINK CRACKS', 960, 140, 60, io(t, A.cracks + 1.8, A.villain), { gold: .5 });
  }
  // --------------------------------------------------------------------------------------------- stage C: the counter row (4.17–4.24) → plateLaw
  const UNIT = 1600, CT = 640, YOUC = 600, HANDY = 480, FEET = CT + 170;
  const VC = [[M3[0], V(1080, 520, 1)], [A.decision - .2, V(1080, 520, 1)], [A.decision + 1.4, V(960, 530, 1)], [A.channel - .1, V(960, 530, 1)], [A.channel + 2.1, V(960, 470, .4)],
    [A.arrival + 4.6, V(960, 470, .4)], [A.want + .4, V(860, 520, 1.12)], [A.unless + .2, V(880, 520, 1.12)], [tP, V0]];
  const viewC = (t) => breathe(X.viewPath(t, VC), t, 1 - span(t, tP - 1.6, tP - .04));
  const PADL = (n) => [YOUC + 50 + n * UNIT, HANDY];
  const ROWP = (() => { const pts = []; for (let k = -2; k < 2; k++) { const seg = F.catenary(PADL(k), PADL(k + 1), 50, { n: 18 }); pts.push(...(pts.length ? seg.slice(1) : seg)); } return pts; })();
  const RLEN = F.pathLen(ROWP), DYOU = F.pathLen(ROWP.filter((p) => p[0] <= PADL(0)[0]));
  function counterRow(ctx, t) {
    const drop = sineIO(span(t, A.unless + .75, A.unless + 2.5)) * 1400;   // 4.24: the scene falls away, the links assemble
    const bookY = drop; ctx.save(); ctx.translate(0, drop);
    for (let k = -2; k <= 2; k++) {
      const cx = 960 + k * UNIT;
      { const cc = mixHex(P.night1, P.ind2, .8), ce = rgba(LAMP.body, .35); rrect(ctx, cx + 290, CT - 230, 76, 320, 22, cc, ce, 2); rrect(ctx, cx + 304, CT - 214, 48, 120, 14, mixHex(cc, P.night0, .4)); rrect(ctx, cx + 150, CT - 84, 200, 30, 12, cc, ce, 2); ctx.fillStyle = cc; ctx.fillRect(cx + 170, CT - 60, 12, 80); }
      X.counterTop(ctx, t, cx - 200, cx + 420, CT, { u: 1, lamp: .55 + (k === 0 ? .2 : 0), lampX: cx + 120 });
      if (k !== 0) { const arm = span(t, A.arrival + .3 + Math.abs(k) * .4, A.arrival + 1.3 + Math.abs(k) * .4);
        E.person(ctx, YOUC + k * UNIT, FEET, 300, { dir: 1, light: .75, look: .1 * Math.sin(t * .5 + k), armR: [lerp(.2, 1.75, arm), lerp(.1, 2.05, arm)], armL: [-.2, -.15], rim: LAMP.body });
        X.aiScreen(ctx, t, cx - 40, CT - 14, 150, {}); }
    }
    // your counter: the screen shows NO; it becomes the law book (4.23), which opens, is written by a cursor, closes (4.24)
    const bk = sineIO(span(t, A.point - .2, A.point + .9));
    if (bk < 1) { ctx.save(); ctx.translate(920, CT - 14); ctx.scale(1, 1 - bk); ctx.translate(-920, -(CT - 14)); screenText(ctx, t, 920, CT - 14, 160, 'NO', span(t, A.decision + .5, A.decision + 1.0)); ctx.restore(); }
    let bookR = null;
    if (bk > 0 && t < ASM[0]) {
      const op = sineIO(span(t, A.unless - .05, A.unless + .5)) * (1 - sineIO(span(t, A.unless + 1.0, A.unless + 1.4))), h = 170 * bk, x = 920, y = CT - 4;
      const bw = 124 + 130 * op;
      // the pages lie under the cover; the cover folds open to the left (and back), so the cream grows out from under it
      const cov = 1 - sineIO(span(op, 0, .75)), cw = bw * cov;
      if (op > 0) rrect(ctx, x - bw / 2, y - h, bw, h, 6, PAPER.lit, rgba(GOLD.line, .55), 2);
      if (cw > 1) rrect(ctx, x - bw / 2, y - h, cw, h, 6, mixHex(P.ind2, P.blue1, .5), rgba(GOLD.line, .55), 2);
      if (cw > 24) { ctx.fillStyle = rgba(GOLD.line, .5); ctx.fillRect(x - bw / 2 + 10, y - h + 20, cw - 20, 3); ctx.fillRect(x - bw / 2 + 10, y - 26, cw - 20, 3); }
      if (bk > .8 && cov > .5) X.label(ctx, 'RULES', x, y - h / 2 + 8, span(t, A.point + .6, A.point + 1.1) * span(cov, .5, 1), { size: 22, spacing: .14, gold: .5 });
      if (op > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - bw / 2 + cw, y - h, bw - cw, h); ctx.clip(); ctx.fillStyle = rgba(PAPER.edge, .9); ctx.fillRect(x - 1, y - h, 2, h);
        const wr = span(t, A.unless + .25, A.unless + .98), n = 10, k = wr * n, li = Math.min(n - 1, Math.floor(k));
        ctx.fillStyle = rgba(COOL.deep, .8);
        for (let j = 0; j < n; j++) { const f = j < li ? 1 : j === li ? k - li : 0; if (f <= 0) continue; const col = j < 5 ? -1 : 1, rr = j % 5; ctx.fillRect(x + (col < 0 ? -bw / 2 + 12 : 12) , y - h + 24 + rr * 26, (bw / 2 - 26) * f * op, 4); }
        if (wr > 0 && wr < 1) { const col = li < 5 ? -1 : 1, rr = li % 5, f = k - li; ctx.fillStyle = COOL.core; ctx.fillRect(x + (col < 0 ? -bw / 2 + 12 : 12) + (bw / 2 - 26) * f * op, y - h + 16 + rr * 26, 4, 16); halo(ctx, x + (col < 0 ? -bw / 2 + 12 : 12) + (bw / 2 - 26) * f * op, y - h + 24 + rr * 26, 30, .5, COOL.halo, COOL.core); } ctx.restore(); }
      bookR = { x, y: y - h / 2 };
    }
    // the empty chair (no villain) is drawn above; you
    const yin = sineIO(span(t, A.villain + .3, A.decision + .9)), yx = lerp(-200, YOUC, yin), walking = yin > 0 && yin < 1;
    const look = span(t, A.want - .1, A.want + .6) * (1 - span(t, A.subscribe + .8, A.subscribe + 1.4)), pt = span(t, A.point + .3, A.point + 1.0) * (1 - span(t, A.unless + .8, A.unless + 1.2));
    const hold = span(t, A.channel + .4, A.channel + 1.2) * (1 - pt);
    E.du(ctx, yx, FEET, 300, { dir: 1, light: 1, back: lerp(.15, 0, look), look: lerp(.1, .9, look), walk: walking ? t * 8 : undefined, armR: [lerp(lerp(.2, 1.75, hold), 1.55, pt), lerp(lerp(.1, 2.05, hold), 1.6, pt)], armL: [-.2, -.15] });
    // your ? rises, nobody answers
    const q = span(t, A.why2 - .1, A.why2 + .5) * (1 - span(t, A.channel - .2, A.channel + .3));
    if (q > 0) { const qy = CT - 360 - 70 * span(t, A.why2, A.channel); txt(ctx, '?', YOUC + 10, qy, 84, q, { col: CREAM, glow: true }); }
    // the gold chain along the whole row (4.19), the hands take hold, it warms (4.20); a new link clicks in beside your hand (4.22)
    const cu = span(t, A.channel + .3, A.channel + 2.4), warm = span(t, A.arrival + 1.0, A.arrival + 4.0), gap = Math.round(DYOU / (34 * .74)) + 1;
    const clk = span(t, A.subscribe + .05, A.subscribe + .55);
    if (cu > 0) {
      const d0 = DYOU * (1 - cu), d1 = DYOU + (RLEN - DYOU) * cu, sub = [];
      for (let d = d0; d <= d1; d += 8) sub.push(F.pathAt(ROWP, d).slice(0, 2));
      if (sub.length > 1) F.chain(ctx, t, sub, { L: 34, link: (i, f) => { const gi = Math.round((DYOU - d0) / (34 * .74)) + 1; return { lit: .5 * warm + .15 * warm * Math.sin(t * 1.3 + i * .6), a: i === gi && clk < 1 ? 0 : 1 }; } });
      if (clk > 0 && clk < 1) { const [gx, gy] = F.pathAt(ROWP, DYOU + 34 * .74 * .5 + 34 * .4), k = expoOut(clk);
        F.chainLink(ctx, t, lerp(gx + 380, gx, k), lerp(gy - 300, gy, k) - Math.sin(Math.PI * k) * 60, 34 * lerp(1.8, 1, k), lerp(-1.2, 0, k), { lit: 1 }); }
      if (clk > .9) { const [gx, gy] = F.pathAt(ROWP, DYOU + 34 * .74 * .5 + 34 * .4); halo(ctx, gx, gy, 140, .7 * (1 - span(t, A.subscribe + .5, A.subscribe + 1.3)), GOLD.halo, GOLD.core); }
    }
    ctx.restore();
    return bookR;
  }
  // 4.24 → plateLaw: the book becomes the LAW link; MONEY, CONTRACT, TRUTH come down out of the HUD into the row
  const ASM = [A.unless + 1.4, tP - .12], HUDGO = [A.unless + .7, tP - .12];
  function assemble(ctx, t, bookR) {
    const k = sineIO(span(t, HUDGO[0], HUDGO[1])), kL = sineIO(span(t, ASM[0], ASM[1])), st = F.chainState(T, t).links, gapH = F.HUD.L * 1.02, sw = Math.sin(t * .9) * .03;
    if (k <= 0) return;
    for (let i = 0; i < 3; i++) { const hx = F.HUD.x + (i + .5) * gapH, px = (S.lawRowX(i) + S.lawRowX(i + 1)) / 2;
      F.chainLink(ctx, t, lerp(hx, px, k), lerp(F.HUD.y, S.LAWROW.y, k), lerp(F.HUD.L * .62, S.LAWROW.L * .55, k), sw * (1 - k), { edge: true }); }
    for (let i = 0; i < 4; i++) {
      const lit = i === 2 ? (.75 + .25 * Math.sin(t * 3)) * k : 0, crack = i < 2 ? 1 : st[i].crack;
      if (i === 2) { const b = bookR ?? { x: 920, y: 560 }; if (kL > 0 || t >= ASM[0]) F.chainLink(ctx, t, lerp(b.x, S.lawRowX(2), kL), lerp(b.y, S.LAWROW.y, kL), lerp(110, S.LAWROW.L, kL), 0, { lit: i === 2 ? (.75 + .25 * Math.sin(t * 3)) * kL : 0, crack }); continue; }
      F.chainLink(ctx, t, lerp(F.HUD.x + i * gapH, S.lawRowX(i), k), lerp(F.HUD.y, S.LAWROW.y, k), lerp(F.HUD.L, S.LAWROW.L, k), (sw + (i % 2 ? .04 : -.04)) * (1 - k), { lit: i === 1 ? (1 - k) * .75 : 0, crack });
    }
    for (let i = 0; i < 4; i++) X.label(ctx, F.CHAIN.names[i], S.lawRowX(i), S.LAWROW.y + S.LAWROW.L * .58 / 2 + 70, span(t, tP - .62, tP - .04), { size: 30, spacing: .16, gold: i === 2 ? 1 : 0, col: i === 2 ? GOLD.text : CREAM });
  }
  function boardCText(ctx, t) {
    X.big(ctx, 'NO VILLAIN', 960, 190, 84, io(t, A.villain + .4, A.decision + 1.4), { gold: .2 });
    X.label(ctx, 'NOBODY TO ASK WHY', 960, 180, io(t, A.why2 + .3, A.channel + .2), { size: 32, spacing: .16 });
  }

  // --------------------------------------------------------------------------------------------- one frame
  function draw(ctx, t) {
    let wInfo = null;
    // stage A (board, c02 + c03)
    if (t < M1[1]) {
      const v = viewA(t), civK = span(t, A.civ - .2, A.civ + 1.9), pool = t < A.look ? [960, lerp(520, 640, civK)] : t < A.honest ? [-900, 520] : [v.x, v.y - 40];
      X.board(ctx, t, v, { lx: pool[0], ly: pool[1] });
      X.inView(ctx, v, () => {
        if (t < A.pic + .8) secType(ctx, t);
        if (t > A.world && t < A.pic + 1) secRails(ctx, t);
        if (t > A.pic - .3 && t < A.hist + 1.3) { const sink = span(t, A.hist - .3, A.hist + .8); room(ctx, t, sink); if (t > A.civ - .3) civ(ctx, t, sink); }
        if (t > A.hist && t < A.ahead + 1) { ctx.save(); ctx.translate(CIV.x - 960 / CIV.s, CIV.y - 540 / CIV.s); ctx.scale(1 / CIV.s, 1 / CIV.s); books(ctx, t); ctx.restore(); }
        if (t > A.look - .6 && t < A.honest + 2) readerKnot(ctx, t);
        if (t > A.aheadW - 1) { ctx.save(); ctx.translate(DX, DY); c03(ctx, t); c03Text(ctx, t); ctx.restore(); }
      });
      if (t > A.unable && t < A.hist + 1) { const v2 = v; ctx.save(); const k = v2.s / CIV.s; ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2 - (v2.x - CIV.x) * CIV.s, -H / 2 - (v2.y - CIV.y) * CIV.s); qMarks(ctx, t); ctx.restore(); }
      if (t > A.hist - .5 && t < A.look + 2) { ctx.save(); const k = v.s / CIV.s; ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2 - (v.x - CIV.x) * CIV.s, -H / 2 - (v.y - CIV.y) * CIV.s); booksText(ctx, t); ctx.restore(); }
      X.big(ctx, 'UNABLE TO SAY HOW', 960, 150, 70, io(t, A.unable + .1, A.hist + .1), { gold: .25 });
      X.big(ctx, 'AHEAD OF YOU?', 960, 160, 80, io(t, A.aheadW, A.honest + .3), { gold: .3 });
      // sources (c02)
      F.source(ctx, t, T0 - .2, T0 + 6, SRC.dementiaSrc);
      F.source(ctx, t, A.fifty + .4, A.look + .6, SRC.copiesSrc);
    }
    // the Leitbild (anchor 2/4), opened by a circle out of the dimming desk lamp
    if (t >= M1[0] && t < M2[1]) {
      const vA = viewA(Math.min(t, M1[1])), [lx, ly] = X.toScreen(vA, LAMPL[0] + DX, LAMPL[1] + DY);
      const r = t < M1[1] ? sineIO(span(t, M1[0], M1[1])) ** .8 * 1900 + 1 : 3000;
      if (t < M1[1]) circleClip(ctx, lerp(lx, S.SPHERE.x, .5), lerp(ly, S.SPHERE.y, .5), r);
      wInfo = world(ctx, t);
      if (t < M1[1]) ctx.restore();
    }
    // stage B (c04 + c05 to 4.16), opened by a circle out of the TRUTH link
    if (t >= M2[0] && t < M3[1]) {
      const inMask = t < M2[1], v = viewB(t);
      if (inMask) { const r = sineIO(span(t, M2[0], M2[1])) ** .8 * 1500 + 1, n3 = wInfo ? wInfo.named[3] : [960, 540]; circleClip(ctx, n3[0], n3[1], r); }
      X.board(ctx, t, v, { lx: v.x, ly: v.y - 40 });
      if (t < HUDLAND[1] + .05) {   // 2.23: the row of four shrinks into the HUD
        const k = sineIO(span(t, HUDLAND[0], HUDLAND[1])), L0 = N3[2], x0 = N3[0] - 3 * L0 * 1.02;
        hudRow(ctx, t, k, -.45, x0, N3[1], L0, 1 - span(t, HUDLAND[0], HUDLAND[1] - .3));
      }
      if (t > A.money - 1.1) {
        const clipOn = t > C2.start + .3 && t < C2.end - .35;
        if (!clipOn) X.inView(ctx, v, () => boardB(ctx, t, v));
        if (!clipOn) boardBText(ctx, t);
        // C2: grows out of the knot of cool lines, closes into the MONEY link (fold 1.9 s, eased once inside plateBox; the clip's last second plays on in the shrinking frame)
        const from = (() => { const [x, y] = X.toScreen(v, D3.x - 6, 576); return [x, y, 50 * v.s]; })();
        if (t > A.invent && t < C2.start + .5) F.clipPlate(ctx, t, T, 'C2', { from, morph: span(t, A.invent + .6, C2.start + .2), dark: (1 - span(t, C2.start - .2, C2.start + .2)) * .35 });
        else if (t >= C2.start + .5 && t < C2.end + 1.55) { const f = span(t, C2.end - .4, C2.end + 1.5), Lk = 360; if (f < 1) F.clipPlate(ctx, t, T, 'C2', { from: { x: 960 - Lk / 2, y: 470 - Lk * .29, w: Lk, h: Lk * .58 }, morph: 1 - f, dark: .35 * span(f, .4, 1) }); }
      }
      const hudA = (t < HUDLAND[1] ? 0 : 1) * (1 - span(t, A.cracks - .1, A.cracks + .5));
      F.chainHud(ctx, t, T, { a: hudA });
      F.source(ctx, t, A.oneIn4 + .5, A.most + .2, SRC.boe);
      F.source(ctx, t, A.most + .4, A.eight + .2, SRC.boe81Src);
      F.source(ctx, t, A.eight + .5, A.explain + .3, SRC.agentsSrc);
      F.source(ctx, t, A.explain + 1.4, A.step + 1.2, SRC.esmaSrc);
      F.source(ctx, t, A.billion + .4, A.falseP + .2, SRC.workday);
      F.source(ctx, t, A.second + .6, A.cracks + .6, SRC.eightfold);
      if (inMask) ctx.restore();
    }
    // stage C (4.17 → plateLaw), opened by a circle out of the crack in the CONTRACT link
    if (t >= M3[0]) {
      // the plate's slow push (CREEP from tP) starts already in the approach, so the speed carries across the hand-over
      const cr = 1 + S.CREEP * (t - tP) * span(t, tP - 2.6, tP - 1.0), v = viewC(t); v.s *= cr;
      const inMask = t < M3[1];
      if (inMask) { const vb = viewB(t), [cx, cy] = X.toScreen(vb, 960 + 3800 * .14, 540 - 3800 * .29 - 3800 * .14 * .2 + 3800 * .14 * .5); circleClip(ctx, cx, cy, sineIO(span(t, M3[0], M3[1])) ** .8 * 2000 + 1); }
      const ak = span(t, ASM[0], tP);
      X.board(ctx, t, v, { lx: lerp(v.x + 120, S.lawRowX(2), ak), ly: lerp(v.y - 60, S.LAWROW.y, ak) });
      X.inView(ctx, v, () => counterRow(ctx, t));
      const [bx, by] = X.toScreen(v, 920, CT - 4 - 85);
      if (t > HUDGO[0]) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(cr, cr); ctx.translate(-W / 2, -H / 2); assemble(ctx, t, { x: W / 2 + (bx - W / 2) / cr, y: H / 2 + (by - H / 2) / cr }); ctx.restore(); }
      boardCText(ctx, t);
      const hudA = span(t, A.point - .5, A.point + .5) * (t < HUDGO[0] ? 1 : 0);
      F.chainHud(ctx, t, T, { a: hudA });
      if (inMask) ctx.restore();
    }
  }
  const out = { draw, A, T0, TL, tP };
  CACHE.set(T, out);
  return out;
}

// the entries of one chunk: one continuous draw (no cut inside the group); the seam plates at the group's two ends
export function b1Entries(T, R, id) {
  const { draw, T0, tP } = b1Take(T), PR = F.PRINT70;
  if (id === 'c02') return [{ t: R.a, draw: (ctx, t) => S.plateDementia(ctx, t, T), print: PR }, { t: T0 + S.SEAM_HALF, draw, print: PR }];
  if (id === 'c05') return [{ t: R.a, draw, print: PR }, { t: tP, draw: (ctx, t) => S.plateLaw(ctx, t, T), print: PR }];
  return [{ t: R.a, draw, print: PR }];
}
