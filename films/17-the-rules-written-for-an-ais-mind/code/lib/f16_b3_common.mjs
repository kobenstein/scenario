// Film 16 · builder B3 (c09–c11 + end screen) · shared pieces: word anchors, the sheet of paper (plate coordinates), the hand,
// two-link arm IK for the figures, the night sky shared by the explainer and the ending, small type helpers.
// Owned by B3. Kit modules are imported, never edited.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f16_kit.mjs';
import { NIB_PLATE } from './f16_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, expoIn, prng, rad, lin, halo, glowFill } = E;

// ------------------------------------------------------------------------------------------------------------------- anchors
// every time in B3 comes from a phrase (T.G); fences keep repeated words apart
export function anchors(T) {
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  // c09 · level 7 I
  a.T0 = G('Last level');
  a.notTest = G('testing Claude', a.T0); a.asking = G("You're asking", a.T0); a.who = G('who wrote the test', a.T0); a.whoE = GE('who wrote the test', a.T0);
  a.main = G('The main author', a.T0); a.philo = G('philosopher', a.T0); a.askell = G('Amanda Askell', a.T0); a.askellE = GE('Amanda Askell', a.T0);
  a.behind = G('Behind her', a.T0); a.oneco = G('one company', a.T0); a.its = G('Its values reach', a.T0); a.millions = G('millions', a.T0);
  a.nobody = G('Nobody voted', a.T0); a.voted = G('voted', a.nobody); a.fixed = G("There's no fixed", a.T0); a.process = G('public process', a.T0); a.changing = G('changing them', a.T0);
  a.andCons = G('And constitution is', a.T0); a.bigword = G('big word', a.T0); a.compdoc = G('company document', a.T0); a.compdocE = GE('company document', a.T0);
  a.text = G('The text is open', a.T0); a.money = G('money', a.text); a.calls = G('It calls Claude', a.T0); a.comm = G('commercial success', a.T0);
  a.lists = G('And it lists', a.T0); a.commerc = G('commercially helpful', a.lists); a.versus = G('versus being good', a.lists); a.openP = G('open problem', a.lists);
  a.zvi = G('Commentator', a.T0); a.mow = G('Mowshowitz', a.T0); a.fixedRule = G('fixed rule', a.T0); a.changes = G('how changes are made', a.T0);
  a.others = G('Others say', a.T0); a.polish = G('polish', a.others); a.rep = G('reputation', a.others);
  // c10 · level 7 II
  a.could = G('Could the rules'); a.diff = G('differently', a.could); a.openai = G('publishes its own', a.could) - .9; a.spec = G('Model Spec', a.could); a.specE = GE('Model Spec', a.could);
  a.reads = G('It reads less'); a.character = G('character', a.reads); a.chain = G('chain of command', a.reads); a.which = G('Which instruction', a.reads);
  a.outranks = G('outranks', a.reads); a.system = G('the system down', a.reads) + .12; a.down = G('down to the user', a.reads); a.user = G('user', a.down);
  a.rules = G('Rules are easier'); a.easier = G('easier to check', a.rules); a.ifsw = G('If something goes wrong', a.rules); a.line = G('the line that was', a.rules); a.broken = G('broken', a.rules);
  a.charc = G('Character copes', a.rules); a.copes = G('copes better', a.rules); a.nobodyPl = G('nobody planned', a.rules); a.neither = G('Neither has won');
  a.once = G('And once', a.neither); a.ordinary = G('ordinary people', a.neither); a.gotpen = G('got the pen', a.neither); a.y2023 = G('twenty twenty-three', a.neither);
  a.thousand = G('thousand Americans', a.neither); a.votedA = G('voted on principles', a.neither); a.intel = G('artificial intelligence', a.votedA);
  a.begin = G('A beginning', a.neither); a.habit = G('habit', a.begin);
  // c11 · ending
  a.so = G('So, can you give'); a.words1 = G('words', a.so); a.partly = G('Partly', a.so); a.meas = G('measurements', a.so); a.butThey = G('But they come', a.so); a.wrote = G('wrote the words', a.so);
  a.paper = G('Paper alone', a.so); a.outside = G('outside', a.paper); a.comparison = G('Comparison', a.paper); a.many = G('many more hands', a.paper); a.onPen = G('on the pen', a.many);
  a.consPD = G('The constitution is public', a.so); a.pd = G('public domain', a.consPD); a.authors = G('Its authors call', a.so); a.flawed = G('no doubt flawed', a.so);
  a.anyone = G('Anyone can copy', a.so); a.copy = G('copy', a.anyone); a.crit = G('criticize', a.anyone); a.rewrite = G('rewrite', a.anyone);
  a.remember = G('And remember', a.so); a.learned = G('first learned', a.remember); a.online = G('online', a.remember); a.whatWe = G('What we write today', a.so); a.today = G('today', a.whatWe); a.next = G('next model', a.whatWe);
  a.rulesS = G('The rules for superintelligence'); a.rightNow = G('right now', a.rulesS); a.plain = G('plain words', a.rulesS); a.anyoneR = G('anyone can read', a.rulesS);
  a.ifYou = G('If you could add'); a.oneMore = G('one more level', a.ifYou); a.whatW = G('what would it be', a.ifYou);
  a.shape = G('Words can shape', a.ifYou); a.shapeW = G('shape a mind', a.ifYou); a.soIt = G('So it matters', a.ifYou); a.whose = G('whose words', a.soIt); a.voEnd = GE('they are', a.soIt);
  a.end = T.duration;
  return a;
}

// ------------------------------------------------------------------------------------------------------------- the sheet
// The page of film 16's last act. Drawn in PLATE coordinates (the screen of plateNib = 0..1920 × 0..1080 is a window on it), so
// at the B2 → B3 seam the frame is plateNib exactly. Inside that window: only what plateNib draws (lamp-lit paper, its 70 fibres, the
// written line, the pen). Outside it: the heading above, printed lines below (y > 1100).
export const SHEET = { x0: -330, x1: 2170, y0: -560, y1: 2400 };
export const SHEET_C = [(SHEET.x0 + SHEET.x1) / 2, (SHEET.y0 + SHEET.y1) / 2];
const N = NIB_PLATE;
export const lineY = (x) => N.y + 6 * Math.sin(x * .043) + 2.5 * Math.sin(x * .13);
const FIB = (() => { const r = prng(77), f = []; for (let i = 0; i < 70; i++) { const x0 = r() * W, y0 = r() * H, l = 20 + r() * 60, a = r() * 6.28; f.push([x0, y0, x0 + Math.cos(a) * l, y0 + Math.sin(a) * l]); } return f; })();
const PRINTED = (() => { const r = prng(1609), L = []; for (let y = 1230; y < SHEET.y1 - 160; y += 118) L.push([y, -150 + r() * 30, 1990 - r() * (y > 2100 ? 900 : 260)]); return L; })();
export function sheetPath() { const p = new Path2D(); p.rect(SHEET.x0, SHEET.y0, SHEET.x1 - SHEET.x0, SHEET.y1 - SHEET.y0); return p; }
// o: { nibX (end of the written line, plate x; ≥ N.x), fill 0..1 (the lower page lights up
//      evenly: a page of light, not only a lamp pool), heading { text, u, size }, printed 0..1 (share of printed lines drawn), noLine }
export function sheet(ctx, t, o = {}) {
  const sp = sheetPath();
  ctx.save();
  ctx.fillStyle = rad(ctx, 900, 520, 1250, [[0, P.core1], [.25, P.halo0], [.55, P.halo1], [.85, P.shade0], [1, mixHex(P.shade0, P.night1, .5)]]);
  ctx.fill(sp);
  const fl = clamp(o.fill ?? 0);
  if (fl > 0) {   // a second, even light over the whole page (the page becomes a page of light): it never touches the plate window's look at fl = 0
    ctx.save(); ctx.clip(sp); ctx.globalAlpha = fl;
    ctx.fillStyle = rad(ctx, 920, 1150, 1900, [[0, P.core1], [.35, P.halo0], [.75, P.halo1], [1, mixHex(P.halo1, P.shade0, .6)]]); ctx.fillRect(SHEET.x0, SHEET.y0, SHEET.x1 - SHEET.x0, SHEET.y1 - SHEET.y0);
    ctx.restore();
  }
  ctx.strokeStyle = rgba(P.shade0, .1); ctx.lineWidth = 1;
  for (const [x0, y0, x1, y1] of FIB) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
  if (o.edge) { ctx.strokeStyle = rgba(P.shade0, .7 * o.edge); ctx.lineWidth = 6; ctx.stroke(sp); }
  // heading (dark ink serif; rises from its own baseline)
  if (o.heading && o.heading.u > 0) inkLine(ctx, o.heading.text, o.heading.x ?? -150, o.heading.y ?? -230, o.heading.size ?? 300, o.heading.u, { serif: true, a: o.heading.a ?? 1 });
  // printed lines (below the plate window)
  const pr = clamp(o.printed ?? 1);
  if (pr > 0) {
    ctx.strokeStyle = rgba(mixHex(P.shade0, P.ind2, .35), .55); ctx.lineWidth = 16; ctx.lineCap = 'round';
    PRINTED.forEach(([y, x0, x1], i) => { const q = clamp(pr * PRINTED.length - i); if (q <= 0) return; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, q), y); ctx.stroke(); });
  }
  // the written line (plateNib's ink-light), up to the nib
  if (!o.noLine) {
    const nx = Math.max(N.x, o.nibX ?? N.x);
    ctx.lineCap = 'round';
    ctx.strokeStyle = lin(ctx, N.line0, 0, nx, 0, [[0, rgba(P.shade0, .8)], [.85, rgba(mixHex(P.shade0, P.ind2, .3), .9)], [1, P.halo0]]); ctx.lineWidth = 5; ctx.beginPath();
    for (let x = N.line0; x <= nx; x += 6) { const y = lineY(x); x === N.line0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    if (nx > N.x + .01) ctx.lineTo(nx, lineY(nx));
    ctx.stroke();
  }
  ctx.restore();
}
// plateNib's gliding reflection (drawn after the pen, as on the plate), clipped to the sheet
export function sheetSweep(ctx, t, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.clip(sheetPath()); ctx.globalCompositeOperation = 'lighter'; halo(ctx, 960 + 560 * Math.sin(t * .9), 470 + 120 * Math.sin(t * .53), 620, .05 * a, P.halo0, P.halo0); ctx.restore();
}
// plateNib's pen at the end of the line (same call as the plate: nib on the line, ang, L 980)
export function sheetPen(ctx, t, nibX, o = {}) {
  const x = o.x ?? nibX, y = o.y ?? lineY(nibX);
  return K.pen(ctx, x, y, o.ang ?? N.ang, N.L, t, { glow: .8, ...o });
}

// --------------------------------------------------------------------------------------------------------------- type helpers
// dark ink type on paper (rises from its own baseline, like maskLine, but ink, no glow)
export function inkLine(ctx, s, x, y, size, u, o = {}) {
  const k = E.expoOut(clamp(u)), w = K.measure(s, size, o.serif ?? true, o.weight ?? 600);
  const x0 = o.align === 'center' ? x - w / 2 : x;
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - size, y - size * 1.25, w + 2 * size, size * 1.57); ctx.clip();
  ctx.font = (o.serif ?? true) ? `${size}px "Instrument Serif"` : `${o.weight ?? 600} ${size}px Inter`;
  if (o.spacing) ctx.letterSpacing = `${o.spacing}em`;
  ctx.fillStyle = o.col ?? mixHex(P.night1, P.ind2, .4); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.globalAlpha *= o.a ?? 1;
  ctx.fillText(s, x0, y + (1 - k) * size * 1.15);
  ctx.restore();
  return w;
}
// a label (Inter caps, halo gold or cream) that rises from its baseline and sinks below it: u in, d out (0..1)
export function label(ctx, s, x, y, size, u, o = {}) {
  if (u <= 0) return;
  K.maskLine(ctx, [[s, 0]], x, y, size, u, { serif: o.serif ?? false, weight: 600, col: o.col ?? P.halo2, glow: o.glow ?? false, spacing: o.spacing ?? .12, align: o.align });
}
// in/out helper for text: rises at t0 (dur .9), sinks at t1 (dur .55)
export const inOut = (t, t0, t1, din = .9, dout = .55) => K.rise(span(t, t0, t0 + din)) * (t1 == null ? 1 : 1 - E.expoIn(span(t, t1, t1 + dout)));

// a rubber stamp in dark ink on paper (no destination-out: it must not punch holes into what lies under it). t0 lands, tOut lifts.
export function paperStamp(ctx, t, text, x, y, size, t0, tOut) {
  if (t < t0 - .22) return;
  const drop = expoIn(span(t, t0 - .22, t0)), k = 1.18 - .18 * drop, away = expoIn(span(t, tOut, tOut + .45));
  if (away >= 1) return;
  const tw = K.measure(text, size, false, 600) * 1.12, bw = tw + size * 1.2, bh = size * 1.75, ink = mixHex(P.blue0, P.night1, .25);
  ctx.save(); ctx.translate(x, y - away * 120); ctx.rotate(-.05); ctx.scale(k, k); ctx.globalAlpha *= (drop < 1 ? .35 + .65 * drop : 1) * (1 - away);
  ctx.strokeStyle = ink; ctx.lineWidth = size * .08; ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, size * .18); ctx.stroke();
  ctx.lineWidth = size * .03; ctx.beginPath(); ctx.roundRect(-bw / 2 + size * .16, -bh / 2 + size * .16, bw - size * .32, bh - size * .32, size * .1); ctx.stroke();
  ctx.font = `600 ${size}px Inter`; ctx.letterSpacing = '.12em'; ctx.textAlign = 'center'; ctx.fillStyle = ink; ctx.fillText(text, 0, size * .36);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------------------------- the hand
// a person's hand (indigo silhouette, blue rim, no yellow): handPath from the kit, filled flat. m = handMatrix(...)
export function hand(ctx, m, o = {}) {
  const p = new Path2D(); p.addPath(E.handPath({ pose: o.pose ?? 'hold', curl: o.curl ?? 0 }), m);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = lin(ctx, m.e, m.f - 40, m.e, m.f + 40, [[0, mixHex(P.ind2, P.blue1, .5)], [1, P.night1]]); ctx.fill(p);
  ctx.strokeStyle = rgba(o.rim ?? P.blue0, .9); ctx.lineWidth = Math.max(1.2, Math.hypot(m.a, m.b) * .03); ctx.stroke(p);
  ctx.restore();
  return p;
}

// --------------------------------------------------------------------------------------------------------------------- IK
// two-link arm for E.du / E.person: [shoulder, elbow] angles (from straight down, + forward) that put the hand at (X, Y) (caller
// space). fig = { x, y, h, dir, side: true for the side view }; sd = +1 the front arm (armR), -1 the back arm (armL). Elbow down.
export function armIK(fig, sd, X, Y, pref = 'down') {
  const wf = fig.side ? .74 : 1, su = sd * .098 * wf + (fig.side ? -.01 : 0), sv = -.74, L1 = .17, L2 = .155;
  const tu = (X - fig.x) / (fig.h * (fig.dir ?? 1)), tv = (Y - fig.y) / fig.h;
  let du = tu - su, dv = tv - sv; let D = Math.hypot(du, dv);
  if (D > (L1 + L2) * .995) { const k = (L1 + L2) * .995 / D; du *= k; dv *= k; D = (L1 + L2) * .995; }
  const base = Math.atan2(du, dv), A = Math.acos(clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1));
  let best = null;
  for (const s1 of [base + A, base - A]) {
    const eu = su + Math.sin(s1) * L1, ev = sv + Math.cos(s1) * L1, s2 = Math.atan2(su + du - eu, sv + dv - ev);
    const sc = pref === 'back' ? -eu : ev;
    if (!best || sc > best.sc) best = { s1, s2, sc };
  }
  return [best.s1, best.s2];
}
export const lerpArm = (A, B, u) => [lerp(A[0], B[0], u), lerp(A[1], B[1], u)];

// ------------------------------------------------------------------------------------------------------------- the night sky
// the sky card shared by the explainer night (c09 end, c10) and the ending (c11): the same picture both sides of the world switch.
// dawn 0..1 lifts the lower sky toward first light (ending only).
export function sky(ctx, t, dawn = 0) {
  E.nightSky(ctx, [[0, P.night0], [.5, P.night1], [1, mixHex(P.ind0, P.ind1, .4)]], -2600, H + 2600);
  if (dawn > 0) {
    ctx.save(); ctx.globalAlpha = dawn;
    ctx.fillStyle = lin(ctx, 0, -200, 0, H * .78, [[0, rgba(P.blue1, 0)], [.4, rgba(P.blue1, .4)], [.72, rgba(mixHex(P.blue2, P.shade0, .45), .75)], [.9, rgba(mixHex(P.shade0, P.halo1, .45), .9)], [1, rgba(mixHex(P.halo1, P.core1, .3), .95)]]);
    ctx.fillRect(-3 * W, -3 * H, 7 * W, 7 * H); ctx.restore();
  }
  E.stars(ctx, 31, 260, t, [-2400, -2600, W + 4800, H + 2400], .75 * (1 - .6 * dawn));
}
