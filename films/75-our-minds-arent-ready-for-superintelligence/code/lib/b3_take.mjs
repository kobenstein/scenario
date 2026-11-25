// Film 75 · B3 (c10 c11 c12, 'Then you notice more' → end) · the takes of builder B3 (own file; kit/world are imported, never edited).
// Three hard world changes only (W in shots.md): 4.02 'picture an evening' (match cut on YOUR RING: the big ring gauge → the ring on your
// chest, same screen place, same size) · 4.25 'But the race' (match cut on THE GAP: the wall bracket → the bracket in the sky of the
// sunrise) · 5.09 "We can't upgrade" (match cut on THE GAP again: the big gauges' gap → the sky bracket, narrowed). Everything else is
// one continuous take per stretch, every change over a carrier object:
//   RACE   462.2 → 'picture an evening': out of plateRace the counter runs away right, THE GAP stretches; two hands set cog and ring.
//   WALL   'picture an evening' → 'But the race': THE SCENARIO EVENING (warm lamp) → the seal on the app → the report card grows out of
//          it → the empty row fills → tested before release (a time axis with test marks) → something goes wrong → the rule sheet's cog
//          turns → the reflex niches → "Far away?": the evening becomes a picture on the wall → its parts fly out side by side: the seal
//          (turns over: 15 chat windows, AN EARLY TEST) · the test mark (grows into a test stand, a model is tested before launch,
//          renewed every quarter) · the cog (its rule sheet; the UN lectern; the lectern multiplies into a hall of 135, ★ 2017: 3 →
//          2026: 135) → none of it is settled (the parts apart, the counter racing far right, THE GAP) → not a treaty → paid by the
//          industry → not the course we're on.
//   SUN3   'But the race' → "We can't upgrade": ANCHOR 3/4 the sunrise, THE GAP wide between you and the sphere (A PRODUCT OF CHOICES) →
//          the sunrise shrinks into a picture on the wall → the cog splits off the HUD: LABS · GOVERNMENTS · VOTERS (hands) → the ring
//          splits off the HUD: NEEDS NO VOTE → it flies onto your chest on the sofa (the hook evening) → the next headline (seed 2) →
//          same pulse → the pulse runs left into the stone head and the mouse (the same node) → a light above the node: THIS IS FEAR →
//          back to the phone: one breath (the ring fills), YOU DECIDE → the HUD itself grows into the big gauges: THE FIRST CLOCK ·
//          RULES THAT LEARN (many hands) · ★ THE GAP narrows to ≈ 45 %: SMALL ENOUGH TO STEER.
//   END    "We can't upgrade" → 631.83: ANCHOR 4/4 the sunrise, you with hand axe AND phone, nearer the light: THE GAP small, never zero;
//          the two core lines; subscribe 2 (a SUBSCRIBE tag, no QR); the end screen (lower half calm for the tiles).
import { createCanvas, Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f75_kit.mjs';
import * as S from './f75_world.mjs';
import * as X from './f75_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo, smooth } = E;
const { GOLD, COOL, CREAM, OCHRE, COAT, PAPER, HUD, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
// strings this group needs that are not in F.SOURCES (listed in the report for the lead)
export const B3STR = { course: SRC.notCourse, harari: SRC.notCourseSrc, subscribe: SRC.subscribe };   // lead 25.11.: Harari's own words under the narration line

const MEMO = new WeakMap();
export function b3(T) { if (!MEMO.has(T)) MEMO.set(T, make(T)); return MEMO.get(T); }

// ------------------------------------------------------------------------------------------------ small helpers
const lab = (t, a, b, i = .7, o = .45) => span(t, a, a + i) * (1 - span(t, b - o, b + .1));
const bump = (t, a, d) => Math.sin(Math.PI * span(t, a, a + d));
const logLerp = (a, b, w) => Math.exp(lerp(Math.log(a), Math.log(b), w));
const vBlend = (a, b, w) => (w <= 0 ? a : w >= 1 ? b : { x: lerp(a.x, b.x, w), y: lerp(a.y, b.y, w), s: logLerp(a.s, b.s, w) });
// ∫ sineIO ramp: the distance of something that accelerates from 0 to speed 1 over [t0, t1] and then keeps going
const rampInt = (t, t0, t1) => (t <= t0 ? 0 : t < t1 ? (t - t0) / 2 - (t1 - t0) / (2 * Math.PI) * Math.sin(Math.PI * (t - t0) / (t1 - t0)) : (t1 - t0) / 2 + (t - t1));
const arc = (a, b, u, lift) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - Math.sin(Math.PI * u) * lift];

// a hand of light (flat, no blur): wrist at (x, y), fingers along ang, palm length L; col = its meaning (CREAM rules · COAT you)
function hand(ctx, x, y, ang, L, col, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  const m = E.handMatrix(x, y, ang, L, o.flip ?? 1), p = new Path2D(); p.addPath(E.handPath({ pose: o.pose ?? 'point', curl: o.curl ?? 0 }), m);
  const [cx, cy] = E.applyM(m, .7, 0);
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, cx, cy, L * 2.4, .28, col, col);
  // the hand is light; the forearm fades into the wall within one palm length (no sleeve)
  const g = E.lin(ctx, ...E.applyM(m, -.75, 0), ...E.applyM(m, .25, 0), [[0, rgba(col, 0)], [.5, rgba(mixHex(col, P.shade0, .2), .7)], [1, rgba(col, 1)]]);
  ctx.fillStyle = g; ctx.fill(p);
  const gs = E.lin(ctx, ...E.applyM(m, -.3, 0), ...E.applyM(m, .3, 0), [[0, rgba(mixHex(col, P.shade0, .5), 0)], [1, rgba(mixHex(col, P.shade0, .5), .5)]]);
  ctx.save(); ctx.clip(p); ctx.strokeStyle = gs; ctx.lineWidth = L * .12; ctx.stroke(p); ctx.restore();
  ctx.restore();
  return { tip: E.applyM(m, ...E.handTip({ pose: o.pose ?? 'point' }, 0)), palm: [cx, cy], m };
}
// the GRADE seal: a cream rosette (rules = cream) with GRADE in Inter caps; flip 0..1 turns it over (its back shows cool chat lines)
function seal(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= 0) return;
  const fl = Math.cos(Math.PI * clamp(o.flip ?? 0)), sx = Math.max(.04, Math.abs(fl)), back = fl < 0;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  halo(ctx, 0, 0, r * 2.4, .3 * (o.glow ?? 1), P.halo2, P.core0);
  ctx.scale(sx, 1);
  const p = new Path2D(), n = 16; for (let i = 0; i <= n * 2; i++) { const q = i / (n * 2) * TAU, rr = r * (i % 2 ? .9 : 1); i ? p.lineTo(Math.cos(q) * rr, Math.sin(q) * rr) : p.moveTo(rr, 0); } p.closePath();
  ctx.fillStyle = back ? mixHex(COOL.deep, COOL.body, .35) : E.lin(ctx, 0, -r, 0, r, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fill(p);
  ctx.strokeStyle = rgba(back ? COOL.line : PAPER.edge, .9); ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(0, 0, r * .74, 0, TAU); ctx.stroke();
  if (!back) { ctx.fillStyle = PAPER.ink; ctx.font = `700 ${Math.round(r * .36)}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(SRC.grade, 0, r * .03); }
  else { ctx.fillStyle = rgba(COOL.core, .8); for (let j = 0; j < 3; j++) ctx.fillRect(-r * .4, -r * .3 + j * r * .25, r * (j === 1 ? .55 : .8), r * .1); }
  ctx.restore();
}
// the TEST MARK: a cream ring with a tick (not a rubber stamp); ok 0..1 draws the tick; o.bad turns it ochre (something went wrong)
function testMark(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || r <= 0) return;
  const bad = clamp(o.bad ?? 0), col = mixHex(CREAM, OCHRE.hot, bad);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  halo(ctx, 0, 0, r * 2.2, .25 + .3 * bad, bad > .1 ? OCHRE.mid : P.halo2, col);
  ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = r * .14; ctx.beginPath(); ctx.arc(0, 0, r * .86, 0, TAU); ctx.stroke();
  const ok = clamp(o.ok ?? 1);
  if (ok > 0) { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = r * .16; ctx.beginPath(); const p0 = [-r * .4, 0], p1 = [-r * .1, r * .3], p2 = [r * .45, -r * .32];
    const u1 = clamp(ok * 2), u2 = clamp(ok * 2 - 1); ctx.moveTo(...p0); ctx.lineTo(lerp(p0[0], p1[0], u1), lerp(p0[1], p1[1], u1)); if (u2 > 0) ctx.lineTo(lerp(p1[0], p2[0], u2), lerp(p1[1], p2[1], u2)); ctx.stroke(); }
  ctx.restore();
}
// the TEST STAND: two posts and a beam of cream light (an open gate), a gate bar (lift 0..1), a cool scan line (scan 0..1 sweeps down)
function stand(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = expoOut(u), hh = h * k, ww = w * lerp(.3, 1, k);
  ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  halo(ctx, x, y - hh * .55, w * .9, .18, P.halo2, P.core0);
  ctx.fillStyle = rgba(mixHex(P.night1, P.ind1, .5), .7); ctx.fillRect(x - ww / 2, y - hh, ww, hh);
  X.lightLine(ctx, [[x - ww / 2, y], [x - ww / 2, y - hh], [x + ww / 2, y - hh], [x + ww / 2, y]], 1, { a: .9, w: 5 });
  const sc = o.scan ?? -1; if (sc >= 0 && sc <= 1) { const sy = lerp(y - hh + 10, y - 8, sc); ctx.fillStyle = rgba(COOL.core, .8 * Math.sin(Math.PI * sc)); ctx.fillRect(x - ww / 2 + 6, sy - 2, ww - 12, 4); halo(ctx, x, sy, ww * .5, .25 * Math.sin(Math.PI * sc), COOL.halo, COOL.core); }
  const lift = clamp(o.lift ?? 0), bl = 120; if (k > .5) { ctx.save(); ctx.globalAlpha *= span(k, .5, .9); ctx.translate(x + ww / 2, y - 40); ctx.rotate(-sineIO(lift) * 1.35);   // the exit boom (blocks the way out until the test passes)
    ctx.fillStyle = CREAM; ctx.fillRect(0, -5, bl, 10); ctx.fillStyle = OCHRE.body; for (let i = 0; i < 3; i++) ctx.fillRect(14 + i * bl / 3, -5, bl / 7, 10);
    ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(0, 0, 9, 0, TAU); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
// a lectern (a speaker's desk, seen from the front) with a small figure behind it; lit 0..1 = its light is on (cream)
function lectern(ctx, t, x, y, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const lit = clamp(o.lit ?? 0), k = expoOut(u), w = h * .62;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2) * (o.a ?? 1); ctx.translate(x, y + (1 - k) * h * .5);
  if (lit > 0) halo(ctx, 0, -h * .95, h * 1.3, .5 * lit, P.halo2, P.core0);
  if (o.figure) E.person(ctx, h * .04, -h * .02, h * 1.32, { armR: [.5, .3], look: .1, rim: P.halo2 });
  else if (o.person !== false) { const hd = mixHex(P.blue1, P.core0, .85 * lit); ctx.fillStyle = hd; ctx.beginPath(); ctx.arc(0, -h * 1.18, h * .14, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -h * .9, h * .25, h * .21, 0, Math.PI, 0); ctx.fill(); }
  ctx.fillStyle = mixHex(mixHex(P.ind2, P.blue1, .5), PAPER.lit, .85 * lit);
  ctx.beginPath(); ctx.moveTo(-w / 2, -h * .86); ctx.lineTo(w / 2, -h * .86); ctx.lineTo(w * .34, 0); ctx.lineTo(-w * .34, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(mixHex(P.blue1, CREAM, .3 + .7 * lit), .5 + .5 * lit); ctx.lineWidth = Math.max(1, h * .03); ctx.stroke();
  ctx.fillStyle = rgba(CREAM, .3 + .6 * lit); ctx.fillRect(-w * .52, -h * .9, w * 1.04, h * .07);
  ctx.restore();
}
// the ballot: a folded paper slip with a cross (voters); held at (x, y), rotated
function ballot(ctx, x, y, s, rot, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = E.lin(ctx, 0, -s * .6, 0, s * .6, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-s * .5, -s * .65, s, s * 1.3);
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = s * .03; ctx.strokeRect(-s * .5, -s * .65, s, s * 1.3);
  ctx.strokeStyle = PAPER.ink; ctx.lineWidth = s * .1; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s * .2, -s * .2); ctx.lineTo(s * .2, s * .2); ctx.moveTo(s * .2, -s * .2); ctx.lineTo(-s * .2, s * .2); ctx.stroke();
  ctx.restore();
}
// a soft night shade behind a label on the sky (readability, no box)
function backing(ctx, x, y, w, h, u) {
  if (u <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(w / 2, h / 2);
  ctx.fillStyle = E.rad(ctx, 0, 0, 1, [[0, rgba(P.night0, .66 * clamp(u * 1.5))], [.6, rgba(P.night0, .42 * clamp(u * 1.5))], [1, rgba(P.night0, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill(); ctx.restore();
}
// a frame of light (the evening / the sunrise become a picture on the wall), drawn on with u from the top-left corner both ways
function frameLine(ctx, x, y, w, h, u, o = {}) {
  if (u <= 0) return;
  const pts = [[x + w / 2, y], [x + w, y], [x + w, y + h], [x + w / 2, y + h]], pts2 = [[x + w / 2, y], [x, y], [x, y + h], [x + w / 2, y + h]];
  X.lightLine(ctx, pts, u, { a: o.a ?? .8, w: o.w ?? 4 }); X.lightLine(ctx, pts2, u, { a: o.a ?? .8, w: o.w ?? 4 });
}

// ------------------------------------------------------------------------------------------------ THE GAUGES (big, wall or screen)
// Same geometry and calls as S.clocksBig, plus: o.hud 0..1 (1 = exactly the HUD's line widths, label sizes and glows, so the HUD can grow
// into the big set without a pop), o.run (the counter runs away to the right by run local units; THE GAP stretches with it), o.dim
// { name: alpha }, o.cogWig / o.ringRot (a gesture: a twitch when a hand touches; the clock STATE always comes from F.clockState).
function bigSet(ctx, t, T, cx, cy, k, o = {}) {
  const s = o.state ?? F.clockState(T, t), hu = clamp(o.hud ?? 0), a = o.a ?? 1; if (a <= 0) return null;
  const gw = lerp(HUD.gapW[1], HUD.gapW[0], (s.gap - .45) / .55), run = o.run ?? 0, cxC = HUD.gap0 + gw + 18 + HUD.counter[2] / 2 + run;
  const dim = o.dim ?? {}, A = (n, fn) => { const v = dim[n] ?? 1; if (v <= 0) return; ctx.save(); ctx.globalAlpha *= v; fn(); ctx.restore(); };
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-S.HUD_C[0], -S.HUD_C[1]);
  A('flint', () => F.flintClock(ctx, t, HUD.flint[0], HUD.flint[1], HUD.flint[2], { next: s.flintNext }));
  A('cog', () => F.cogClock(ctx, t, HUD.cog[0], HUD.cog[1], HUD.cog[2], { notch: s.rules.notch + (o.cogWig ?? 0), dashed: s.rules.dashed, glow: lerp(.3, 0, hu) + (o.cogGlow ?? 0) }));
  A('ring', () => { ctx.save(); ctx.translate(HUD.ring[0], HUD.ring[1]); ctx.rotate(o.ringRot ?? 0);
    F.ringClock(ctx, t, 0, 0, HUD.ring[2], { dashed: s.you.dashed, fill: s.you.fill, spin: s.you.spin, glow: lerp(.3, 0, hu) + s.you.fill + (o.ringGlow ?? 0) }); ctx.restore(); });
  A('gap', () => F.gapBracket(ctx, t, HUD.gap0, HUD.gap0 + gw + run, HUD.y - 6, 1, { size: lerp(12, 22, hu), tick: lerp(10, 14, hu), w: lerp(1.2, 1.6, hu) }));
  A('counter', () => F.counterClock(ctx, t, cxC, HUD.counter[1], HUD.counter[2], { glow: lerp(.8, .7, hu), speed: o.speed }));
  const lu = o.labels ?? 1;
  if (lu > 0) [['BRAIN', HUD.flint[0], 'flint'], ['RULES', HUD.cog[0], 'cog'], ['YOU', HUD.ring[0], 'ring'], ['AI', cxC, 'counter']].forEach(([l, x, n], i) => {
    const v = dim[n] ?? 1; if (v <= 0) return; ctx.save(); ctx.globalAlpha *= v;
    F.goldText(ctx, [[l, i === 3 ? .8 : 0]], x, HUD.label + lerp(8, 0, hu), lerp(10, 22, hu), F.rise(span(lu, i * .08, .7 + i * .08)), { serif: false, weight: 600, spacing: .12, align: 'center', col: i === 2 ? COAT.lit : P.cream });
    ctx.restore(); });
  ctx.restore();
  const L = (lx, ly) => [cx + (lx - S.HUD_C[0]) * k, cy + (ly - S.HUD_C[1]) * k];
  return { gw, cxC, flint: L(HUD.flint[0], HUD.flint[1]), cog: L(HUD.cog[0], HUD.cog[1]), ring: L(HUD.ring[0], HUD.ring[1]), counter: L(cxC, HUD.counter[1]),
    gap: [L(HUD.gap0, HUD.y - 6), L(HUD.gap0 + gw + run, HUD.y - 6)], r: { cog: HUD.cog[2] * k, ring: HUD.ring[2] * k, counter: HUD.counter[2] * k } };
}

// ================================================================================================================================ make
function make(T) {
  const a0 = T.G('Then you notice more') - .01;
  const G = (p, n = 0, after = a0) => T.G(p, n, after), GE = (p, n = 0, after = a0) => T.GE(p, n, after);
  const CT = F.clockTimes(T);
  const A = {
    // c10
    then: G('Then you notice more'), raceOn: G('the race runs on'), set: G('So set both clocks'), setBoth: G('both clocks'), cut1: G('picture an evening'), years: G('a few years from now'),
    hlArr: G('The headline still arrives'), pulse: G('Your pulse still jumps'), jumps: G('jumps', 0, 471), version: G('But in this version'), carries: G('carries a grade'),
    clever: G('Not for how clever'), cleverW: G('clever'), whatDoes: G('For what it does'), people: G('the people who use it'), tested: G('It was tested before release'), before: G('before release', 0, 481),
    fewMonths: G('again every few months'), wrong: G('When something goes wrong'), rule: G('the rule changes'), withinYear: G('within the year'), know: G('And you know your reflexes'),
    reflexes: G('reflexes by'), byName: G('by name'), far: G('Far away'), apart: G('Take that evening apart'), grade: G('The grade'), early: G('You just heard an early test'), earlyW: G('early test', 0, G('You just heard an early test') - .5),
    testing: G('Testing before release'), demis: G('Demis Hassabis'), body: G('a body that tests'), tests: G('tests the most powerful'), launch: G('before launch'), renewed: G('The tests would be renewed'),
    renewedW: G('renewed'), quarter: G('every quarter'),
    // c11
    rulesMove: G('Rules that move within a year'), lastMonth: G('Last month, the head'), framework: G('global framework'), oneYear: G('within one year'), pressure: G('And the pressure is there'),
    according: G("According to the UN's"), twenty17: G('twenty seventeen'), three: G('three world leaders'), thisYear: G('This year, a hundred'), h135: G('a hundred and thirty-five'),
    none: G('None of it is settled'), notTreaty: G('The framework is not a treaty'), notW: G('not a treaty'), paid: G('The testing body would be paid'), paidW: G('paid mostly'),
    course: G("And it is not the course"), harari: G('Harari says so himself'), cut2: G('But the race is a product'), choices: G('a product of choices'), soGap: G('So is the gap'),
    labs: G('Labs can test'), gov: G('Governments can write'), update: G('update built in'), voters: G('Voters can demand'), noVote: G('And one clock needs no vote'), needs: G('needs no vote'), atAll: GE('at all'),
    // c12
    tonight: G('Tonight, or tomorrow'), lands: G('lands on your screen'), sameBig: G('Same big letters'), samePulse: G('Same pulse'), reflexOld: G("The reflex hasn't changed"),
    thisTime: G('But this time, you notice'), noticeW: G('notice it'), fear: G('This is fear'), breath: G('You take one breath'), decide: G('decide what your thumb'), thumbDoes: G('thumb does'),
    first: G('That is the first clock'), single: G('It took a single breath'), other: G('The other one takes all'), allUs: G('all of us'), learn: G('rules that learn'), fast: G('as fast as the machine'),
    gapWont: G("The gap won't close"), small: G('small enough that we'), steer: G('we still steer'), cut3: G("We can't upgrade our brains"), minds: G('We can upgrade our minds'),
    channel: G('This channel exists', 0, 600), notice2: G('minds that notice', 0, 600), keepUp: G('rules that keep up', 0, 600), want: G('Want that too', 0, 600), subscribe: G('Then subscribe', 0, 600), end: T.duration, endScr: T.duration - 15,
  };
  for (const [k, v] of Object.entries(A)) if (!(v >= T.G('Then you notice more') - 1e-6)) throw new Error(`b3 anchor ${k} = ${v} lies before c10`);
  const geo = S.sofaScene(createCanvas(8, 8).getContext('2d'), 0);
  const PH = { x: geo.phone.x + geo.phone.w / 2, y: geo.phone.y + geo.phone.h / 2 }, CHEST = geo.chest;

  // ============================================================================================================== RACE (c10 start)
  // plateRace = S.clocksBig(960, 560, k 2.4) in view { 960, 560, creep }. The counter runs away right (THE GAP stretches with it), the
  // camera leaves the creep and follows it a little; "So set both clocks": a cream hand on the cog, your hand (coat) on the ring.
  const PL = { x: 960, y: 560, k: 2.4 }, T0 = A.then;
  const RUN0 = T0 + .75, RUN1 = A.raceOn + .2;
  const runL = (t) => 64 * rampInt(t, RUN0, RUN1);   // local units (× 2.4 on the wall)
  const creepV = (t) => ({ x: 960, y: 560, s: S.creep(t, T, 'Then you notice more') });
  const RK = [[T0 + .5, creepV(T0 + .5)], [A.raceOn + .4, { x: 1180, y: 600, s: .86 }], [A.set + .2, { x: 1300, y: 610, s: .8 }], [A.cut1, { x: 1330, y: 612, s: .79 }]];
  const raceView = (t) => (t < T0 + .5 ? creepV(t) : vBlend(creepV(t), X.viewPath(t, RK), sineIO(span(t, T0 + .5, T0 + 1.9))));
  const ringW = (t) => [PL.x + (HUD.ring[0] - S.HUD_C[0]) * PL.k, PL.y];
  function race(ctx, t) {
    if (t < T0 + .5) { S.plateRace(ctx, t, T); return; }
    const v = raceView(t);
    X.wall(ctx, t, v, { lx: lerp(960, 1300, span(t, RUN0, A.set)), ly: 560, facets: lerp(1, FAC, sineIO(span(t, T0 + .6, A.cut1))) });
    const run = runL(t), hA = span(t, A.set + .05, A.setBoth + .35), hB = span(t, A.set + .3, A.setBoth + .6);
    X.inView(ctx, v, () => {
      const g = bigSet(ctx, t, T, PL.x, PL.y, PL.k, { run, cogWig: .14 * bump(t, A.setBoth + .2, .6), ringGlow: .6 * bump(t, A.setBoth + .45, 1.2) });
      // the gold track the counter runs on
      if (run > 0) X.lightLine(ctx, [[g.counter[0] - run * PL.k, PL.y + 150], [g.counter[0], PL.y + 150]], 1, { col: rgba(GOLD.line, .55), w: 2.5 });
      X.label(ctx, SRC.race, (g.gap[0][0] + g.gap[1][0]) / 2, PL.y + 290, lab(t, A.raceOn - .05, A.cut1 + 1), { size: 46, spacing: .12, gold: .4 });
      // "So set both clocks": two hands rise from below and touch the cog (cream: rules) and the ring (coat: you)
      const reach = (u, x, y, r) => [x, lerp(y + 900, y + r + 66 * 1.55, expoOut(u))];
      if (hA > 0) { const [x, y] = reach(hA, g.cog[0] - 10, g.cog[1], g.r.cog); hand(ctx, x, y, -Math.PI / 2 - .12, 66, CREAM, { pose: 'point' }); }
      if (hB > 0) { const [x, y] = reach(hB, g.ring[0] + 8, g.ring[1], g.r.ring + 8); hand(ctx, x, y, -Math.PI / 2 + .1, 62, COAT.base, { pose: 'point', flip: -1 }); }
    });
  }

  // ============================================================================================================== WALL (c10 → c11)
  // THE SCENARIO EVENING (on the wall, the sofa at S.SOFA_AT), its objects around it, then the parts in a row to the right.
  const CARD = { x: 700, y: 1390, w: 290 }, AX = { x0: 470, x1: 950, y: 1640 }, DOC = { x: 1580, y: 1390, w: 200 }, NICHE = { x: 1150, y: 1520, w: 124 };
  const SEAL0 = { x: geo.phone.x + geo.phone.w * .78, y: geo.phone.y + geo.phone.h * .2, r: 22 };
  const TICKS = [AX.x0 + 40, AX.x0 + 160, AX.x0 + 270, AX.x0 + 370, AX.x0 + 455].map((x, i) => ({ x, t: i ? [A.fewMonths + .3, A.fewMonths + .85, A.fewMonths + 1.35, A.fewMonths + 1.8][i - 1] : A.before + .05 }));
  const DOCCOG = [DOC.x + DOC.w * .38, DOC.y - DOC.w * 1.3 * .4];
  const FRAME = { x: 140, y: 1140, w: 1700, h: 1440 };
  const P1 = { x: 2650, y: 1880 }, P2 = { x: 3200, y: 1960 }, P3 = { x: 3760, y: 1880 };
  const STAND = { w: 300, h: 270 }, MODEL = { r: 34, x0: P2.x - 380, xs: P2.x - 20, x1: P2.x + 290 };
  const RDOC = { w: 210 }; RDOC.h = RDOC.w * 1.3; RDOC.x = P3.x - RDOC.w * .38; RDOC.y = P3.y + RDOC.h * .4;
  const LECT = { x: 4250, y: 2060, h: 150 }, FW = { x: 4030, y: 1700, w: 150 }, YB = { x0: 3570, x1: 4310, y: 2200 };
  const HALL = { x: 5250, y: 2120, cols: 15, rows: 9, dx: 72, dy: -54, h: 52 };
  const SEATS = []; for (let r = 0; r < HALL.rows; r++) for (let c = 0; c < HALL.cols; c++) {
    const sh = 1 - r * .035, x = HALL.x + (c - (HALL.cols - 1) / 2) * HALL.dx * sh, y = HALL.y + r * HALL.dy - Math.abs(c - 7) ** 2 * .9 * (1 - r * .05);
    SEATS.push({ x, y, h: HALL.h * sh, r, c }); }
  const THREE = [SEATS.findIndex((s) => s.r === 3 && s.c === 4), SEATS.findIndex((s) => s.r === 5 && s.c === 9), SEATS.findIndex((s) => s.r === 1 && s.c === 11)];
  const CNT = { x: 6680, y: 1150, s: 420 }, GAPW = { x0: P3.x, x1: 6680 - 420 * .55, y: 1290 };
  const FAC = .6;   // wall facet contrast for B3's takes (camera moves over the wall stay calm)
  const WK = [   // move, then hold: every glide ends in a near-still hold (calm mafd); slow pushes instead of zoom pairs
    [A.cut1, null], [A.cut1 + 1.9, { x: 980, y: 2060, s: 1.0 }], [A.hlArr + .15, { x: 975, y: 2050, s: 1.04 }], [A.carries + .3, { x: PH.x + 70, y: PH.y + 25, s: 2.0 }],
    [A.clever - .15, { x: PH.x + 66, y: PH.y + 22, s: 2.04 }], [A.whatDoes + .6, { x: 760, y: 1420, s: 1.6 }], [A.tested - .1, { x: 752, y: 1438, s: 1.56 }],
    [A.fewMonths + .4, { x: 1010, y: 1480, s: 1.0 }], [A.far - .2, { x: 1030, y: 1492, s: .98 }], [A.apart + .2, { x: 1000, y: 1870, s: .5 }], [A.apart + .6, { x: 1060, y: 1870, s: .5 }],
    [A.early + .25, { x: P1.x, y: 1730, s: 1.18 }], [A.testing - .2, { x: P1.x + 20, y: 1735, s: 1.2 }], [A.testing + 1.4, { x: P2.x + 60, y: 1800, s: 1.3 }],
    [A.launch - .3, { x: P2.x + 90, y: 1790, s: 1.28 }], [A.renewed + .6, { x: P2.x + 120, y: 1830, s: 1.18 }], [A.rulesMove + .05, { x: P2.x + 160, y: 1840, s: 1.14 }], [A.rulesMove + 2.0, { x: 3940, y: 1858, s: .93 }], [A.according - .6, { x: 4010, y: 1866, s: .9 }], [A.according + 1.4, { x: 4980, y: 1830, s: .78 }],
    [A.thisYear + 1.6, { x: 5000, y: 1830, s: .76 }], [A.none + .6, { x: 4860, y: 1660, s: .42 }], [A.course + 1.0, { x: 4830, y: 1600, s: .43 }], [A.cut2, { x: 4825, y: 1580, s: .435 }],
  ];
  // the first key: the match cut on the ring (the chest ring lands where the big ring gauge was, at the same size)
  { const vR = raceView(A.cut1), [sx, sy] = X.toScreen(vR, ...ringW(A.cut1)), s0 = HUD.ring[2] * PL.k * vR.s / X.SOFA.ring;
    WK[0][1] = { x: CHEST[0] - (sx - W / 2) / s0, y: CHEST[1] - (sy - H / 2) / s0, s: s0 }; }
  const wallView = (t) => X.viewPath(t, WK);
  // per-object timings
  const SEAL_LAND = [A.carries + .05, A.carries + .55], CARD_U = [A.clever - .1, A.clever + 1.1];
  const TAKE = [A.apart + .2, A.apart + 1.9], PART = (i) => [TAKE[0] + i * .16, TAKE[1] + i * .16];
  const partPos = (i, t, from, to) => { const [a, b] = PART(i), u = sineIO(span(t, a, b)); return { u, p: arc(from, to, u, 260 - i * 40) }; };
  const flipU = (t) => sineIO(span(t, A.grade + .2, A.grade + .9)) * (1 - sineIO(span(t, A.testing - .5, A.testing + .2)));
  const chatU = (t) => span(t, A.early - .1, A.early + .9) * (1 - sineIO(span(t, A.testing - .75, A.testing - .05)));
  const standU = (t) => span(t, A.testing + .05, A.testing + 1.2);
  const modelX = (t) => { const a = sineIO(span(t, A.demis + .9, A.demis + 3.2)), b = sineIO(span(t, A.launch + .25, A.launch + 1.5)); return lerp(lerp(MODEL.x0, MODEL.xs, a), MODEL.x1, b); };
  const QT = [A.renewedW + .05, A.renewedW + .55, A.quarter - .35, A.quarter + .15];
  const scanAt = (t) => { for (const s of [A.tests, A.tests + .95, ...QT.slice(1)]) if (t >= s && t < s + .8) return (t - s) / .8; return -1; };
  const seatLit = (i, t) => { if (THREE.includes(i)) return span(t, A.three - .05, A.three + .5);
    const s = SEATS[i], d = Math.min(...THREE.map((j) => Math.hypot(SEATS[j].x - s.x, (SEATS[j].y - s.y) * 1.4))); return span(t, A.h135 - .25 + d / 1100 * 1.2, A.h135 + .05 + d / 1100 * 1.2); };

  function wallTake(ctx, t) {
    const v = wallView(t);
    const warmIn = 1 - span(t, A.apart + .6, A.grade + .8), st = F.clockState(T, t);
    X.wall(ctx, t, v, { lx: v.x, ly: v.y - 40, warm: t < A.far ? 1 : .5 * warmIn, facets: FAC });
    const vis = (x0, y0, x1, y1) => x1 > v.x - W / 2 / v.s && x0 < v.x + W / 2 / v.s && y1 > v.y - H / 2 / v.s && y0 < v.y + H / 2 / v.s;
    const pulled = sineIO(span(t, A.far - .1, A.far + .9));
    X.inView(ctx, v, (vs) => {
      // ---- the picture: the warm evening inside a frame of light ("Far away?")
      if (pulled > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, 960, 1900, 1100, [[0, rgba(P.halo2, .07 * pulled)], [1, rgba(P.halo2, 0)]]);
        ctx.fillRect(FRAME.x, FRAME.y, FRAME.w, FRAME.h); ctx.restore(); frameLine(ctx, FRAME.x, FRAME.y, FRAME.w, FRAME.h, pulled, { w: 3 / Math.max(.5, vs) * 1.4 }); }
      if (vis(FRAME.x - 50, FRAME.y - 50, FRAME.x + FRAME.w + 50, FRAME.y + FRAME.h + 300)) {
        // the sofa scene: the scenario evening (warm lamp), the headline on the app, the seal
        const hu = span(t, A.hlArr - .05, A.hlArr + .5), big = span(t, A.pulse - .2, A.pulse + .3), bad = span(t, A.pulse, A.pulse + .45);
        S.sofaScene(ctx, t, { lamp: 1, ring: { dashed: st.you.dashed, fill: st.you.fill, spin: st.you.spin, a: lerp(1, .45, span(vs, 1.3, 2.6)), glow: .2 },
          phone: { on: 1, glow: 1, draw: (c2, r) => F.headline(c2, t, r.x + r.w * .1, r.y + r.h * .16, r.w * .8, { u: hu, big, bad, seed: 11, a: .9 }) } });
        // your pulse still jumps: out of your chest, to the right
        const pu = span(t, A.pulse - .15, A.pulse + .55) * (1 - span(t, A.version + .3, A.carries - .2));
        if (pu > 0) { const hn = pu; halo(ctx, CHEST[0], CHEST[1], 60, .5 * hn, OCHRE.mid, OCHRE.hot);
          F.pulseLine(ctx, t, CHEST[0] + 14, CHEST[0] + 470, CHEST[1], [[CHEST[0] + 230, 1, span(t, A.jumps - .12, A.jumps + .22)]], { u: pu, h: 120, w: 3.2 }); }
        // the seal lands on the app ("carries a grade"); later it flies out to P1
        const sl = span(t, SEAL_LAND[0], SEAL_LAND[1]);
        if (sl > 0 && t < PART(0)[0]) seal(ctx, t, SEAL0.x, SEAL0.y - (1 - expoOut(sl)) * 60, SEAL0.r * lerp(1.5, 1, expoOut(sl)), { a: clamp(sl * 3), rot: -.12 + .25 * (1 - expoOut(sl)) });
        // the report card grows out of the seal; the smart rows dim; the empty row fills
        const cu = span(t, CARD_U[0], CARD_U[1]);
        if (cu > 0) {
          const e = sineIO(cu), cx = lerp(SEAL0.x, CARD.x, e), cy = lerp(SEAL0.y, CARD.y, e) - Math.sin(Math.PI * e) * 80, k = logLerp(.1, 1, e);
          X.lightLine(ctx, [[SEAL0.x, SEAL0.y], [cx + CARD.w * .5 * k, cy]], clamp(cu * 1.5), { a: .35, w: 2, dash: [8, 8] });
          ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-CARD.x, -CARD.y);
          const dimR = span(t, A.cleverW, A.cleverW + .7), rows = [['MATH', 1, 1], ['CODE', .95, 1], ['SCIENCE', .9, 1], ['LANGUAGE', .97, 1]];
          const box = X.reportCard(ctx, t, CARD.x, CARD.y, CARD.w, { rows, empty: SRC.emptyLine, emptyFill: .86 * sineIO(span(t, A.whatDoes + .15, A.people + .7)), u: span(cu, 0, .6) });
          if (box && dimR > 0) { ctx.fillStyle = rgba(P.night0, .62 * dimR); ctx.fillRect(box.x + 6, box.y + CARD.w * .36, box.w - 12, 4 * CARD.w * .13); }
          if (box) { const ef = span(t, A.whatDoes + .15, A.people + .7); if (ef > 0) halo(ctx, box.x + box.w * .7, box.y + CARD.w * .38 + 4.5 * CARD.w * .13, 160, .3 * bump(t, A.whatDoes + .1, 2.4), COAT.base, COAT.lit); }
          ctx.restore();
        }
        // tested before release, again every few months: a time axis under the card with test marks
        const ax = span(t, A.tested - .05, A.tested + .8);
        if (ax > 0) {
          X.lightLine(ctx, [[AX.x0, AX.y], [AX.x1, AX.y]], ax, { a: .55, w: 2.4 });
          X.label(ctx, 'RELEASE', TICKS[0].x, AX.y + 44, span(t, A.before, A.before + .6), { size: 22, weight: 600, col: CREAM });
          TICKS.forEach((k2, i) => { const u = span(t, k2.t - .1, k2.t + .35); if (u <= 0) return; if (i === 0 && t >= PART(1)[0]) return;
            const bad = i === 3 ? span(t, A.wrong + .45, A.wrong + .8) : 0;
            testMark(ctx, t, k2.x, AX.y, (i ? 13 : 19) * expoOut(u), { ok: span(u, .3, 1), bad }); });
        }
        // when something goes wrong, the rule changes within the year: a line from the bad test mark to the rule sheet; its cog turns
        const wl = span(t, A.wrong + .7, A.rule - .1);
        if (wl > 0) X.lightLine(ctx, [[TICKS[3].x, AX.y - 16], [TICKS[3].x, AX.y - 60], [DOC.x - DOC.w / 2 - 20, AX.y - 60], [DOC.x - DOC.w / 2 - 20, DOC.y]], wl * (1 - span(t, A.know, A.know + .6)), { col: rgba(OCHRE.line, .7), w: 2.4, glowCol: OCHRE.mid });
        const du = span(t, A.wrong + 1.4, A.rule + .2);
        if (du > 0) { ctx.save(); ctx.beginPath(); ctx.rect(DOC.x - DOC.w, DOC.y - DOC.w * 1.3 * .5 - 80 - 300 * (1 - expoOut(du)), DOC.w * 2, DOC.w * 1.3 + 400); ctx.clip();
          X.doc(ctx, t, DOC.x, DOC.y, DOC.w, { u: du, cog: t < PART(2)[0] ? span(t, A.rule - .2, A.rule + .4) : 0, notch: sineIO(span(t, A.rule + .1, A.rule + 1)), cogGlow: .5 + .6 * bump(t, A.rule + .1, 1.4) });
          const rw = span(t, A.rule + .3, A.withinYear + .3); if (rw > 0) { ctx.fillStyle = rgba(GOLD.line, .0); ctx.fillStyle = rgba(P.halo2, .8 * rw); ctx.fillRect(DOC.x - DOC.w * .38, DOC.y - DOC.w * 1.3 * .2 + 3 * DOC.w * 1.3 * .055 - 2, DOC.w * .76 * rw, 5); }
          ctx.restore();
          X.label(ctx, SRC.withinYear, DOC.x, DOC.y + DOC.w * .65 + 56, lab(t, A.withinYear - .1, A.far + .3), { size: 30, spacing: .12 }); }
        // you know your reflexes by name: the three niches cut into the wall above the sofa and light with their names
        const nu = (i) => span(t, A.know + .05 + i * .08, A.know + .85 + i * .08), nl = (i) => span(t, A.reflexes + i * .07, A.reflexes + .6 + i * .07);
        if (nu(0) > 0) F.reflexes(ctx, t, NICHE.x, NICHE.y, NICHE.w, { on: [nu(0), nu(1), nu(2)], lit: [nl(0) * .8, nl(1) * .8, nl(2) * .8], grab: .4, line: 1, labelU: [nl(0), nl(1), nl(2)] });
      }
      // ---- the parts, side by side ("Take that evening apart")
      // P1 · the seal → turns over: 15 chat windows (an early test) → back
      const s1 = partPos(0, t, [SEAL0.x, SEAL0.y], [P1.x, P1.y]);
      if (t >= PART(0)[0]) {
        const cr = chatU(t);
        if (cr > 0) { const ww = 44, n = 15, x0 = P1.x - (n * ww + (n - 1) * ww * .25) / 2, tipIx = [0, 1, 3, 4, 5, 7, 8, 10, 12, 13];
          ctx.save(); ctx.beginPath(); ctx.rect(P1.x - 600, P1.y - 330, 1200, 280); ctx.clip();
          X.chatRow(ctx, t, x0, P1.y - 190 + (1 - expoOut(cr)) * 110, n, ww, { u: cr, tip: tipIx, tipU: span(t, A.earlyW + .1, A.earlyW + .9) });
          ctx.restore();
          X.lightLine(ctx, [[P1.x, P1.y - 70], [P1.x, P1.y - 112]], cr, { a: .5, w: 2 }); }
        seal(ctx, t, s1.p[0], s1.p[1], lerp(SEAL0.r, 62, s1.u), { flip: flipU(t), rot: lerp(-.12, 0, s1.u) });
        X.label(ctx, SRC.early, P1.x, P1.y - 360, lab(t, A.earlyW - .05, A.testing - .1), { size: 34, spacing: .12 });
      }
      // P2 · the test mark → grows into the test stand; a model is tested before launch; renewed every quarter
      const s2 = partPos(1, t, [TICKS[0].x, AX.y], [P2.x, P2.y - 130]);
      if (t >= PART(1)[0]) {
        const su = standU(t);
        if (su < 1) testMark(ctx, t, s2.p[0], s2.p[1], lerp(19, 52, s2.u) * (1 - expoOut(su) * .4), { a: 1 - span(su, .5, 1) });
        if (su > 0) {
          // the body that tests: three small figures rise behind the stand
          const bu = span(t, A.body - .1, A.body + .9);
          if (bu > 0) F.crowd(ctx, t, P2.x - 260, P2.x - 170, P2.y, 3, 86, { u: bu, seed: 7, dir: 1 });
          stand(ctx, t, P2.x, P2.y, STAND.w, STAND.h, { u: su, scan: scanAt(t), lift: span(t, A.launch - .05, A.launch + .5) * (1 - span(t, A.renewed - .2, A.renewed + .4)) });
          const ml = span(t, A.demis + .8, A.demis + 1.6);
          if (ml > 0) { const mx = modelX(t), mr = MODEL.r; F.sphere(ctx, t, mx, P2.y - mr - 2, mr * expoOut(ml), { dust: 70, a: 1 });
            ctx.strokeStyle = rgba(GOLD.line, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(MODEL.x0 - 60, P2.y); ctx.lineTo(MODEL.x1 + 80, P2.y); ctx.stroke(); }
          // every quarter: a year line under the stand, four marks light one after another
          const qa = span(t, A.renewed - .05, A.renewed + .6);
          if (qa > 0) { const q0 = P2.x - 200, q1 = P2.x + 280, qy = P2.y + 70; X.lightLine(ctx, [[q0, qy], [q1, qy]], qa, { a: .5, w: 2.2 });
            QT.forEach((qt, i) => { const u = span(t, qt - .05, qt + .3); if (u > 0) testMark(ctx, t, lerp(q0, q1, (i + .5) / 4), qy, 14 * expoOut(u), { ok: span(u, .3, 1) }); }); }
          X.label(ctx, SRC.quarterly, P2.x + 40, P2.y + 150, lab(t, A.quarter - .3, A.rulesMove + 1.4), { size: 32, spacing: .12 });
        }
        // paid mostly by the industry it tests: coins roll from the model's side into the stand
        for (let i = 0; i < 3; i++) { const c0 = A.paidW + i * .45, u = span(t, c0, c0 + 1.1); if (u <= 0 || u >= 1) continue;
          const [x, y] = arc([MODEL.x1, P2.y - 90], [P2.x + 20, P2.y - STAND.h + 10], sineIO(u), 120); X.coin(ctx, t, x, y, 22 * (1 - .3 * span(u, .8, 1)), { flip: u * 2 }); }
        const pg = bump(t, A.paidW + .8, 2.6); if (pg > 0) halo(ctx, P2.x, P2.y - STAND.h * .5, 240, .35 * pg, GOLD.halo, GOLD.hot);
      }
      // P3 · the cog → its rule sheet rises behind it (rules that move within a year?)
      const s3 = partPos(2, t, DOCCOG, [P3.x, P3.y]);
      if (t >= PART(2)[0]) {
        const ru = span(t, A.rulesMove + .1, A.rulesMove + 1.2);
        if (ru > 0) { ctx.save(); ctx.beginPath(); ctx.rect(RDOC.x - RDOC.w, RDOC.y - RDOC.h / 2 - 40 + (1 - expoOut(ru)) * RDOC.h, RDOC.w * 2, RDOC.h + 80); ctx.clip();
          X.doc(ctx, t, RDOC.x, RDOC.y, RDOC.w, { u: 1 }); ctx.restore(); }
        // the cog turns when the hall fills (the rules clock ticks with 'a hundred and thirty-five did')
        const nt = sineIO(span(t, CT.ruleTicks[1], CT.ruleTicks[1] + .9)) + sineIO(span(t, A.rule + .1, A.rule + 1));
        F.cogClock(ctx, t, s3.p[0], s3.p[1], lerp(RDOC.w * .16 * .98, 64, s3.u), { notch: nt, glow: .4 + .8 * bump(t, CT.ruleTicks[1], 1.6) });
      }
      // the UN lectern, the framework sheet, the year in 12 months
      const lu = span(t, A.lastMonth + .1, A.lastMonth + 1.0);
      if (lu > 0) {
        const yb = span(t, A.oneYear - .2, A.oneYear + .6);
        if (yb > 0) { X.lightLine(ctx, [[YB.x0, YB.y], [YB.x1, YB.y]], yb, { a: .5, w: 2.2 });
          for (let i = 0; i < 12; i++) { const u = span(t, A.oneYear + i * .06, A.oneYear + .3 + i * .06); if (u <= 0) continue; const x = lerp(YB.x0, YB.x1, (i + .5) / 12);
            ctx.fillStyle = rgba(CREAM, .85 * u); ctx.fillRect(x - 20, YB.y - 22 * expoOut(u), 40, 12); } }
        const fu = span(t, A.framework - .1, A.framework + .9);
        if (fu > 0) { const e = sineIO(fu), x = lerp(LECT.x, FW.x, e), y = lerp(LECT.y - LECT.h, FW.y, e), k = logLerp(.2, 1, e);
          ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.translate(-FW.x, -FW.y);
          X.doc(ctx, t, FW.x, FW.y, FW.w, { u: 1, dashed: sineIO(span(t, A.notW, A.notW + .6)) }); ctx.restore(); }
        lectern(ctx, t, LECT.x, LECT.y, LECT.h, { u: lu, lit: .6 + .4 * bump(t, A.framework, 2), figure: true });
        // the lectern multiplies: copies peel off into the hall; the hall rises; three light (2017), then all 135 (2026)
        const pm = span(t, A.pressure - .1, A.pressure + 1.6);
        SEATS.forEach((s, i) => {
          const rise = span(t, A.according + .1 + s.r * .09 + Math.abs(s.c - 7) * .012, A.according + .8 + s.r * .09 + Math.abs(s.c - 7) * .012);
          const early = s.r === 0 && s.c >= 4 && s.c <= 10 ? i : -1;
          let x = s.x, y = s.y, u = rise;
          if (early >= 0) { const k2 = (s.c - 4) / 6, e = sineIO(span(pm, k2 * .35, .65 + k2 * .35)); if (e <= 0) return; [x, y] = arc([LECT.x, LECT.y], [s.x, s.y], e, 90); u = 1; }
          else if (u <= 0) return;
          const li = seatLit(i, t); lectern(ctx, t, x, y, s.h, { u, lit: li, person: true }); if (THREE.includes(i) && li > 0) halo(ctx, x, y - s.h, 90, .6 * li, P.halo2, P.core0);
        });
        X.label(ctx, SRC.leaders[0], HALL.x - 180, HALL.y - 620, lab(t, A.three - .05, A.thisYear + .25), { size: 64, spacing: .06, col: CREAM });
        X.label(ctx, SRC.leaders[1], HALL.x - 180, HALL.y - 620, lab(t, A.h135 + .15, A.none + .3), { size: 64, spacing: .06, gold: 0, col: CREAM });
        const fl = bump(t, A.h135 - .2, 2.6); if (fl > 0) halo(ctx, HALL.x, HALL.y - 220, 900, .3 * fl, P.halo2, P.core0);
      }
      // none of it is settled: the parts apart (links that never close), the counter racing far right, THE GAP between
      const nn = span(t, A.none - .1, A.none + .8) * (1 - span(t, A.notTreaty - .3, A.notTreaty + .3)) + span(t, A.course + .2, A.course + 1);
      if (nn > 0) {
        const links = [[P1.x + 80, P2.x - 170], [P2.x + 170, P3.x - 90], [P3.x + 90, FW.x - 100]];
        if (nn > 0) links.forEach(([a, b], i) => { const m = (a + b) / 2, u = span(nn, i * .15, .7 + i * .15); X.lightLine(ctx, [[a, 1640], [m - 24, 1640]], u, { a: .45, w: 2.5, dash: [10, 10] }); X.lightLine(ctx, [[b, 1640], [m + 24, 1640]], u, { a: .45, w: 2.5, dash: [10, 10] }); });
      }
      if (vis(CNT.x - 400, CNT.y - 200, CNT.x + 400, CNT.y + 200)) F.counterClock(ctx, t, CNT.x, CNT.y, CNT.s, { speed: lerp(26, 60, span(t, A.course, A.course + 1.5)), glow: 1 });
      const gu = Math.max(span(t, A.none + .1, A.none + .9) * (1 - span(t, A.notTreaty - .3, A.notTreaty + .2)), span(t, A.course + .2, A.course + 1.1));
      if (gu > 0) { F.gapBracket(ctx, t, GAPW.x0, GAPW.x1, GAPW.y, gu, { size: 50, tick: 46, w: 5 });
        const fl2 = span(t, A.course + .3, A.course + 1.5); if (fl2 > 0 && fl2 < 1) halo(ctx, lerp(GAPW.x0, GAPW.x1, fl2), GAPW.y, 300, .5 * Math.sin(Math.PI * fl2), GOLD.halo, GOLD.core); }
    });
    // ---- screen texts (≥ 22 px, ≤ 6 words), sources at y 880
    X.label(ctx, SRC.scenario, W / 2, 222, lab(t, A.years - .1, A.hlArr + 1.6), { size: 34, spacing: .14, col: P.halo2 });
    X.label(ctx, SRC.tested, W / 2, 222, lab(t, A.tested + .1, A.wrong + .2), { size: 36, spacing: .12 });
    X.label(ctx, SRC.byName, W / 2, 222, lab(t, A.byName - .2, A.far + .5), { size: 36, spacing: .12, col: OCHRE.text });
    X.label(ctx, SRC.hassabis, W / 2, 222, lab(t, A.demis + .05, A.renewed - .1), { size: 34, spacing: .1 });
    F.source(ctx, t, A.body - .2, A.renewed + .3, SRC.hassabisSrc);
    X.label(ctx, SRC.un, W / 2, 222, lab(t, A.framework - .1, A.pressure + .5), { size: 36, spacing: .1 });
    F.source(ctx, t, A.framework + .2, A.pressure + 1.2, SRC.unSrc);
    F.source(ctx, t, A.three, A.none - .1, SRC.leadersSrc);
    X.label(ctx, SRC.notSettled, W / 2, 222, lab(t, A.none + .05, A.notTreaty + .3), { size: 40, spacing: .12 });
    const nq = lab(t, A.notW - .1, A.paid + .2); if (nq > 0) X.big(ctx, SRC.notTreaty, W / 2, 230, 54, nq, { gold: 0 });
    F.source(ctx, t, A.notW, A.paid + .1, SRC.notTreatySrc);
    X.label(ctx, SRC.paidBy, W / 2, 222, lab(t, A.paidW - .1, A.course + .3), { size: 36, spacing: .12, gold: .5 });
    F.source(ctx, t, A.paidW + .2, A.course + .2, SRC.paidBySrc);
    X.label(ctx, B3STR.course, W / 2, 222, lab(t, A.course + .3, A.cut2 + 1), { size: 40, spacing: .12 });
    X.label(ctx, B3STR.harari, W / 2, 280, lab(t, A.harari + .05, A.cut2 + 1), { size: 26, spacing: .14, col: P.halo2 });
    F.source(ctx, t, A.early - .1, A.testing + .1, SRC.humane);
    // lead 25.11.: while THE GAP and the counter stand big on the wall the HUD steps back (no second counter / gap on screen)
    const bigGap = Math.max(span(t, A.none + .1, A.none + .9) * (1 - span(t, A.notTreaty - .3, A.notTreaty + .2)), span(t, A.course + .2, A.course + 1.1));
    F.clocksHud(ctx, t, T, { hide: bigGap });
  }

  // ============================================================================================================== SUN3 (c11 → c12)
  // ANCHOR 3/4. The sky bracket starts where the wall's GAP was at the cut (match), glides to you ↔ the sphere. Then the sunrise shrinks
  // into a picture on the wall (top right), the cog splits off the HUD: hands LABS · GOVERNMENTS · VOTERS; the ring: NEEDS NO VOTE; it
  // flies onto your chest on the sofa → c12: the next headline … → the HUD grows into the big gauges → ★ the gap narrows.
  const YOU3 = { x: 560 }, YOU4 = { x: 800 };
  const camSun3 = (t) => E.cam3({ x: -10 * sineIO(span(t, A.cut2, A.soGap + .6)), y: 20 * sineIO(span(t, A.cut2, A.soGap + .6)), z: 240 * sineIO(span(t, A.cut2, A.soGap + .8)) });
  const wallGapAt = (t) => { const v = wallView(t); return [X.toScreen(v, GAPW.x0, GAPW.y), X.toScreen(v, GAPW.x1, GAPW.y)]; };
  const G2 = wallGapAt(A.cut2 - 1e-3);
  // the picture on the wall (wall coords of the B-stage view)
  const PIC = { x: 1180, y: 150, w: 620, h: 349 };
  const SB = { labs: A.labs, sink: A.noVote + .35 };
  const BV = [[A.soGap + .1, { x: 960, y: 540, s: 1 }], [A.noVote + 2.2, { x: 960, y: 560, s: 1 }], [A.tonight + 1.2, { x: S.SOFA_VIEW.x, y: S.SOFA_VIEW.y, s: 1 }],
    [A.tonight + 1.9, { x: 965, y: 1955, s: 1.04 }], [A.lands - .3, { x: PH.x + 40, y: PH.y + 10, s: 3.1 }], [A.samePulse - .5, { x: PH.x + 40, y: PH.y + 14, s: 3.25 }],
    [A.samePulse + .6, { x: 1000, y: 1940, s: 1.9 }], [A.reflexOld - .3, { x: 980, y: 1880, s: 1.5 }], [A.reflexOld + 1.6, { x: 250, y: 1700, s: 1.35 }], [A.fear + .3, { x: 240, y: 1690, s: 1.38 }],
    [A.breath - .3, { x: 245, y: 1700, s: 1.36 }], [A.breath + 1.1, { x: 930, y: 1985, s: 2.25 }], [A.first, { x: 935, y: 1990, s: 2.3 }], [A.first + 2.2, { x: 960, y: 1300, s: 1.0 }], [A.cut3, { x: 960, y: 1290, s: 1.0 }]];
  const bView = (t) => X.viewPath(t, BV);
  // the pulse (c12): from your chest, up behind you, LEFT along the wall to the mouse and into the stone head (the past = left)
  const HEAD2 = { x: 30, y: 1880, h: 380 }, NODE2 = [HEAD2.x + .06 * HEAD2.h, HEAD2.y - .6 * HEAD2.h], MOUSE = { x: 330, y: 1880, h: 96 };
  const PP = [[CHEST[0], CHEST[1]], [CHEST[0] + 120, CHEST[1]], [CHEST[0] + 120, 1740], [210, 1740], [210, NODE2[1]], [NODE2[0], NODE2[1]]];
  const PL2 = []; { let acc = 0; PL2.push(0); for (let i = 1; i < PP.length; i++) { acc += Math.hypot(PP[i][0] - PP[i - 1][0], PP[i][1] - PP[i - 1][1]); PL2.push(acc); } }
  const LT2 = PL2[PL2.length - 1], MOUSE_S = PL2[3] + (CHEST[0] + 120 - MOUSE.x) - (CHEST[0] + 120 - 470) * 0 - (PL2[3] - PL2[2]) * 0;
  const mouseS = PL2[2] + (CHEST[0] + 120 - MOUSE.x);
  const pS = (t) => { if (t < A.samePulse - .1) return 0; if (t < A.reflexOld - .2) return 300 * sineIO(span(t, A.samePulse - .1, A.samePulse + .5)); return lerp(300, LT2, sineIO(span(t, A.reflexOld - .2, A.reflexOld + 1.7))); };
  const pTail = (t) => LT2 * sineIO(span(t, A.breath - .4, A.breath + 1.2)) - 1;
  const pAt = (s) => { for (let i = 1; i < PP.length; i++) if (s <= PL2[i]) { const f = (s - PL2[i - 1]) / (PL2[i] - PL2[i - 1] || 1); return [lerp(PP[i - 1][0], PP[i][0], f), lerp(PP[i - 1][1], PP[i][1], f)]; } return PP[PP.length - 1]; };
  const GROW = [A.first, A.first + 1.9];   // the HUD grows into the big gauges
  const BIG = { cx: 960, cy: 480, k: 2.45 };
  const bigK = (t) => { const u = sineIO(span(t, GROW[0], GROW[1])); return { cx: lerp(S.HUD_C[0], BIG.cx, u), cy: lerp(S.HUD_C[1], BIG.cy, u), k: logLerp(1, BIG.k, u) * (1 + .05 * sineIO(span(t, A.gapWont - .2, A.steer + .5))), hud: 1 - u, u }; };

  function thumb(ctx, t, r) {   // phone-local: your thumb comes in and HANGS over the screen for one breath, then moves away slowly by itself
    const u = span(t, A.breath - .6, A.breath + .2), out = sineIO(span(t, A.decide, A.decide + 1.8)); if (u <= 0 || out >= 1) return;
    const hang = Math.sin((t - A.breath) * 2.2) * r.h * .01;
    const x = lerp(r.x + r.w * 1.25, r.x + r.w * .6, expoOut(u)) + out * r.w * .9, y = lerp(r.y + r.h * 1.1, r.y + r.h * .55, expoOut(u)) + hang + out * r.h * .35;
    const SK = mixHex(P.shade0, P.core1, .4); ctx.fillStyle = SK; ctx.beginPath(); ctx.ellipse(x, y + r.h * .12, r.w * .16, r.h * .2, -.5, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(SK, P.core1, .4); ctx.beginPath(); ctx.ellipse(x - r.w * .03, y + r.h * .02, r.w * .07, r.h * .05, -.5, 0, TAU); ctx.fill();
  }
  function sunPicture(ctx, t, u, v) {   // the sunrise drawn small inside a frame on the wall (u: 0 = full frame, 1 = the picture)
    const [px, py] = X.toScreen(v, PIC.x, PIC.y), k = logLerp(1, PIC.w * v.s / W, sineIO(u));
    const x = lerp(0, px, sineIO(u)), y = lerp(0, py, sineIO(u));
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, W * k, H * k); ctx.clip();
    E.withOuter({ k, e: x, f: y }, () => S.sunrise(ctx, camSun3(t), t, { you: { x: YOU3.x, hold: 'axe', arm: 1, ring: { dashed: 0, fill: 0, a: 1, glow: .3 } } }));
    ctx.restore();
    return { x, y, k };
  }
  let you3 = null;
  function sun3Gap(ctx, t, k, ox, oy) {   // THE GAP in the sky of anchor 3 (screen; when the picture shrinks, scaled with it)
    const gx0 = you3 ? you3[0] + 6 : YOU3.x, gx1 = 960, gy = 380, m = sineIO(span(t, A.cut2 + .15, A.cut2 + 1.9));
    const x0 = lerp(G2[0][0], gx0, m), x1 = lerp(G2[1][0], gx1, m), y = lerp(G2[0][1], gy, m);
    const fl = span(t, A.soGap + .05, A.soGap + 1);
    ctx.save(); ctx.setTransform(k, 0, 0, k, ox, oy);
    backing(ctx, ox + k * (x0 + x1) / 2, oy + k * (y - 26), k * 320, k * 84, .8);
    ctx.setTransform(k, 0, 0, k, ox, oy);
    F.gapBracket(ctx, t, x0, x1, y, 1, { size: 34, tick: lerp(46 * .455, 26, m), w: lerp(5 * .455, 3, m) });
    if (fl > 0 && fl < 1) halo(ctx, lerp(x0, x1, fl), y, 200, .55 * Math.sin(Math.PI * fl), GOLD.halo, GOLD.core);
    const cu = lab(t, A.choices - .55, A.soGap + 1.4);
    if (cu > 0) { backing(ctx, ox + k * (x0 + x1) / 2, oy + k * (y + 62), k * 640, k * 90, cu); ctx.setTransform(k, 0, 0, k, ox, oy); X.label(ctx, SRC.choices, (x0 + x1) / 2, y + 74, cu, { size: 34, spacing: .12 }); }
    ctx.restore();
  }
  function sun3Take(ctx, t) {
    const pic = span(t, A.soGap + .35, A.labs + .9);   // the sunrise shrinks into a picture on the wall
    if (pic <= 0) {
      const o = S.sunrise(ctx, camSun3(t), t, { you: { x: YOU3.x, hold: 'axe', arm: 1, ring: { dashed: 0, fill: 0, a: 1, glow: .3 } } });
      you3 = o.you?.head || you3;
      sun3Gap(ctx, t, 1, 0, 0);
      F.clocksHud(ctx, t, T);
      return;
    }
    const v = bView(t), st = F.clockState(T, t);
    X.wall(ctx, t, v, { lx: v.x + 80, ly: v.y - 60, facets: FAC });
    const pk = sunPicture(ctx, t, pic, v);
    sun3Gap(ctx, t, pk.k, pk.x, pk.y);
    X.inView(ctx, v, (vs) => { frameLine(ctx, PIC.x, PIC.y, PIC.w, PIC.h, span(pic, .6, 1), { w: 3 }); });
    // ---- LABS · GOVERNMENTS · VOTERS on the cog (it split off the HUD); one clock needs no vote: the ring (split off the HUD)
    const ck = sineIO(span(t, A.soGap + .7, A.labs + 1.0)), COGW = { x: 720, y: 430, r: 140 }, RINGW = { x: 1250, y: 610, r: 110 };
    const sinkC = sineIO(span(t, A.atAll + .2, A.tonight + 1.0));
    X.inView(ctx, v, (vs) => {
      if (ck > 0) { const [hx, hy] = [lerp(HUD.cog[0], COGW.x, ck), lerp(HUD.cog[1], COGW.y, ck) - Math.sin(Math.PI * ck) * 60];
        F.cogClock(ctx, t, hx, hy, lerp(HUD.cog[2], COGW.r, ck), { notch: st.rules.notch + .12 * (bump(t, A.labs + .5, .6) + bump(t, A.gov + .6, .6) + bump(t, A.voters + .5, .6)), glow: .3 + .4 * ck }); }
      const H3 = [[A.labs, 145, SRC.hands[0], 'point', null], [A.gov, 90, SRC.hands[1], 'hold', 'doc'], [A.voters, 35, SRC.hands[2], 'hold', 'ballot']];
      H3.forEach(([t0, deg, lbl, pose, what], i) => {
        const u = span(t, t0 - .15, t0 + .75), out = expoIn(span(t, SB.sink + i * .06, SB.sink + .55 + i * .06)); if (u <= 0 || out >= 1) return;
        const q = deg * Math.PI / 180, L = 52, rr = COGW.r + L * (pose === 'point' ? 1.75 : 1.25) + 6, dx = Math.cos(q), dy = Math.sin(q);
        const wx = COGW.x + dx * rr, wy = COGW.y + dy * rr, back = (1 - expoOut(u)) * 520 + out * 620;
        const hd = hand(ctx, wx + dx * back, wy + dy * back, q + Math.PI, L, CREAM, { pose, curl: pose === 'hold' ? .15 : 0, flip: deg > 90 ? -1 : 1 });
        if (what === 'doc' && hd) X.doc(ctx, t, hd.palm[0], hd.palm[1] - 46, 64, { u: 1, cog: 1, notch: sineIO(span(t, A.update, A.update + .8)) });
        if (what === 'ballot' && hd) ballot(ctx, hd.palm[0] - 10, hd.palm[1] - 26, 50, -.5, 1);
        X.label(ctx, lbl, wx + dx * 70, wy + dy * 70 + 30, lab(t, t0 + .05, SB.sink + .3), { size: 30, spacing: .14 });
      });

      // the ring: a copy splits off the HUD, lands right of the cog; NEEDS NO VOTE; then it flies onto your chest on the sofa (a ride down)
      const ru = sineIO(span(t, A.noVote - .1, A.noVote + 1.1)), land = sineIO(span(t, A.atAll + .3, A.tonight + 1.25));
      if (ru > 0 && t < A.tonight + 1.25) {
        let x = lerp(HUD.ring[0], RINGW.x, ru), y = lerp(HUD.ring[1], RINGW.y, ru) - Math.sin(Math.PI * ru) * 50, r = lerp(HUD.ring[2], RINGW.r, ru);
        if (land > 0) { [x, y] = arc([RINGW.x, RINGW.y], [CHEST[0], CHEST[1]], land, 160); r = lerp(RINGW.r, X.SOFA.ring, land); }
        F.ringClock(ctx, t, x, y, r, { dashed: 0, fill: 0, spin: st.you.spin, glow: .6 * (1 - land) + .3, ink: land });
      }
      X.label(ctx, SRC.noVote, RINGW.x, RINGW.y + RINGW.r + 80, lab(t, A.needs - .1, A.atAll + .9), { size: 36, spacing: .12, col: COAT.lit });
      // ---- the hook evening again (night): the sofa, the next headline (seed 2), the pulse
      if (land > 0 || t > A.tonight) {
        const hu = span(t, A.lands - .1, A.lands + .5), big = span(t, A.sameBig - .05, A.sameBig + .4), bad = span(t, A.sameBig + .3, A.sameBig + .8);
        const ringOn = t >= A.tonight + 1.25, grow = bigK(t);
        S.sofaScene(ctx, t, { ring: { dashed: 0, fill: st.you.fill, spin: st.you.spin, a: ringOn && grow.u <= 0 ? lerp(1, .5, span(vs, 1.3, 2.6) * (1 - st.you.fill)) : 0, glow: st.you.fill * .8, ink: 1 },
          phone: { on: 1, glow: 1, draw: (c2, r) => { F.headline(c2, t, r.x + r.w * .1, r.y + r.h * .16, r.w * .8, { u: hu, big, bad, seed: 2, a: lerp(.95, .55, span(t, A.decide, A.decide + 1.5)) }); thumb(c2, t, r); } } });
        const hn = span(t, A.samePulse - .3, A.samePulse) * (1 - span(t, A.breath, A.breath + 1));
        if (hn > 0) { halo(ctx, CHEST[0], CHEST[1], 70, .6 * hn, OCHRE.mid, OCHRE.hot); ctx.fillStyle = rgba(OCHRE.hot, hn); ctx.beginPath(); ctx.arc(CHEST[0], CHEST[1], 7 * (1 + .25 * Math.max(0, Math.sin(t * 7))), 0, TAU); ctx.fill(); }
      }
      // ---- the reflex hasn't changed: the same ochre node in the mouse and in the stone head; this time a light above it (you notice)
      const ps = pS(t), tail = Math.max(0, pTail(t));
      const sinkHM = 1 - sineIO(span(t, A.breath + .6, A.breath + 1.8)), hdU = span(t, A.reflexOld - .6, A.reflexOld + .6) * sinkHM, mU = span(ps, mouseS - 160, mouseS + 40) * sinkHM;
      if (hdU > 0 && t < A.first + 2.4) {
        ctx.save(); ctx.beginPath(); ctx.rect(HEAD2.x - 260, HEAD2.y - HEAD2.h * 1.05 * expoOut(hdU), 520, HEAD2.h * 1.1); ctx.clip();
        F.stoneHead(ctx, t, HEAD2.x, HEAD2.y, HEAD2.h, { node: span(ps, LT2 - 40, LT2), a: 1 }); ctx.restore(); }
      if (mU > 0 && t < A.first + 2.4) { ctx.save(); ctx.beginPath(); ctx.rect(MOUSE.x - 200, MOUSE.y - MOUSE.h * 1.4 * expoOut(mU), 400, MOUSE.h * 1.45); ctx.clip();
        F.mammal(ctx, t, 'mouse', MOUSE.x, MOUSE.y, MOUSE.h, { dir: -1, node: span(ps, mouseS - 20, mouseS + 60) }); ctx.restore(); }
      if (ps > 0 && tail < LT2 - 1) {
        const spikes = [[150, 1, span(t, A.samePulse - .05, A.samePulse + .3)], [mouseS, .7, span(ps, mouseS - 30, mouseS + 40)]];
        F.pulsePath(ctx, t, PP, ps, spikes, { s0: tail, h: 92, w: 3.4 });
      }
      const nt = span(t, A.noticeW - .3, A.noticeW + .6) * (1 - span(t, A.breath + .4, A.breath + 1.4));
      if (nt > 0) { const lx = NODE2[0], ly = NODE2[1] - 150 + (1 - expoOut(nt)) * 40;
        X.lightLine(ctx, [[lx, ly + 26], [lx, NODE2[1] - 18]], span(nt, .3, 1), { col: rgba(COAT.lit, .8), w: 2.4, glowCol: COAT.base });
        F.ringClock(ctx, t, lx, ly, 34 * expoOut(nt), { dashed: 0, fill: 1, spin: 2.4, glow: 1 });
        X.label(ctx, SRC.thisIsFear, NODE2[0] + 330, NODE2[1] - 40, lab(t, A.fear - .05, A.breath - .1), { size: 40, spacing: .12, col: COAT.lit }); }
    });
    // ---- one breath, you decide (screen texts) · the HUD grows into the big gauges: THE FIRST CLOCK · RULES THAT LEARN · ★ THE GAP
    X.label(ctx, SRC.youDecide, W / 2, 222, lab(t, A.decide - .05, A.first + .4), { size: 40, spacing: .14, col: COAT.lit });
    const g = bigK(t);
    if (g.u > 0) {
      // the chest ring flies up into the big ring and merges with it
      const vb = bView(t), fr = sineIO(span(t, GROW[0] + .1, GROW[1]));
      const focus = (n) => ({ ring: 1 - .6 * span(t, A.other - .2, A.other + .5) + .6 * span(t, A.gapWont - .3, A.gapWont + .3), cog: lerp(.4, 1, span(t, A.other - .2, A.other + .5)),
        counter: lerp(.4, 1, span(t, A.learn - .2, A.learn + .5)), flint: lerp(.4, 1, span(t, A.gapWont - .3, A.gapWont + .3)), gap: lerp(.4, 1, span(t, A.gapWont - .3, A.gapWont + .3)) })[n];
      const dU = sineIO(span(t, GROW[1] - .3, GROW[1] + .9)), fd = (n) => lerp(1, focus(n), dU);
      const dim = dU <= 0 ? null : { flint: fd('flint'), cog: fd('cog'), ring: fd('ring'), gap: fd('gap'), counter: fd('counter') };
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      // many hands at the cog (a crowd rises under it and pushes)
      const gs = bigSet(ctx, t, T, g.cx, g.cy, g.k, { hud: g.hud, labels: g.u, dim: dim ?? undefined, ringRot: F.clockState(T, t).you.notch * TAU / 12, cogGlow: .5 * bump(t, CT.ruleTicks[2], 1.4) });
      const cr = span(t, A.allUs - .2, A.allUs + 1.0) * (1 - span(t, A.gapWont - .4, A.gapWont + .3));
      if (cr > 0) { F.crowd(ctx, t, gs.cog[0] - 170, gs.cog[0] + 170, gs.cog[1] + gs.r.cog + 190, 9, 120, { u: cr, push: span(t, A.allUs, A.allUs + .8), seed: 75 }); }
      const ll = span(t, A.fast - .3, A.fast + .5) * (1 - span(t, A.gapWont - .4, A.gapWont + .2));
      if (ll > 0) X.lightLine(ctx, [[gs.cog[0] + gs.r.cog + 14, gs.cog[1] + gs.r.cog + 30], [gs.counter[0] - 60, gs.cog[1] + gs.r.cog + 30]], ll, { a: .6, w: 2.4, dash: [12, 10] });
      // the chest ring rises into the big ring
      if (fr < 1) { const [cx0, cy0] = X.toScreen(vb, CHEST[0], CHEST[1]); const r0 = X.SOFA.ring * vb.s;
        F.ringClock(ctx, t, lerp(cx0, gs.ring[0], fr), lerp(cy0, gs.ring[1], fr) - Math.sin(Math.PI * fr) * 80, lerp(r0, gs.r.ring, fr), { dashed: 0, fill: F.clockState(T, t).you.fill, spin: F.clockState(T, t).you.spin, glow: .4, ink: 1 - fr }); }
      // ★ the gap narrows: a gold flash runs along it
      const fl = span(t, A.gapWont, A.gapWont + 1.2); if (fl > 0 && fl < 1) halo(ctx, lerp(gs.gap[0][0], gs.gap[1][0], fl), gs.gap[0][1], 260, .55 * Math.sin(Math.PI * fl), GOLD.halo, GOLD.core);
      const sp = bump(t, A.small - .2, 2.4); if (sp > 0) halo(ctx, (gs.gap[0][0] + gs.gap[1][0]) / 2, gs.gap[0][1], 240, .35 * sp, GOLD.halo, GOLD.hot);
      ctx.restore();
      X.label(ctx, SRC.firstClock, gs.ring[0], gs.ring[1] + gs.r.ring + 200, lab(t, A.first + .9, A.other), { size: 38, spacing: .12, col: COAT.lit });
      X.label(ctx, SRC.rulesLearn, gs.cog[0], gs.cog[1] - gs.r.cog - 120, lab(t, A.learn - .05, A.gapWont + .2), { size: 38, spacing: .12 });
      X.label(ctx, SRC.steer, W / 2, 222, lab(t, A.small - .05, A.cut3 + 1), { size: 44, spacing: .12, gold: .5 });
    }
    F.clocksHud(ctx, t, T, { hide: g.u > 0 ? 1 : 0 });
  }

  // ============================================================================================================== END (c12)
  // ANCHOR 4/4 + subscribe 2 + the end screen: one calm take. You nearer the light (hand axe AND phone), the ring set; THE GAP in the
  // sky starts where the big gauges' gap was at the cut, then settles small (≈ 45 % of anchor 3's), never zero.
  const g3 = (() => { const g = bigK(A.cut3 - 1e-3), s = F.clockState(T, A.cut3 - 1e-3), gw = lerp(HUD.gapW[1], HUD.gapW[0], (s.gap - .45) / .55);
    const L = (lx) => g.cx + (lx - S.HUD_C[0]) * g.k; return [[L(HUD.gap0), g.cy + (HUD.y - 6 - S.HUD_C[1]) * g.k], [L(HUD.gap0 + gw), 0]]; })();
  const camEnd = (t) => { const q = t - A.cut3; return E.cam3({ x: 6 * Math.sin(q * .11), y: 24 + 10 * sineIO(clamp(q / 30)), z: 120 + 300 * sineIO(clamp(q / 36)) }); };
  let you4 = null;
  function endTake(ctx, t) {
    const breathe = .5 + .5 * Math.sin((t - A.cut3) * .9 - 1.2), mind = bump(t, A.notice2 - .2, 2.6);
    const o = S.sunrise(ctx, camEnd(t), t, { you: { x: YOU4.x, hold: 'both', arm: 1, ring: { dashed: 0, fill: Math.max(breathe * .6, mind), a: 1, glow: .4 + .5 * mind } } });
    you4 = o.you?.head || you4;
    // THE GAP (small, never zero): from above you to the sphere's centre line
    const m = sineIO(span(t, A.cut3 + .1, A.cut3 + 2.0)), gx0 = you4 ? you4[0] + 6 : 790, gx1 = o.sphere ? o.sphere[0] : 960, gy = 412;
    const x0 = lerp(g3[0][0], gx0, m), x1 = lerp(g3[0][0] + (g3[1][0] - g3[0][0]), gx1, m), y = lerp(g3[0][1], gy, m);
    backing(ctx, (x0 + x1) / 2, y - 24, 300, 80, m * .8);
    F.gapBracket(ctx, t, x0, x1, y, 1, { size: lerp(12 * BIG.k, 30, m), tick: lerp(10 * BIG.k, 22, m), w: lerp(1.2 * BIG.k, 3, m) });
    // the two core lines (serif), on a soft shade over the beams
    const c1 = lab(t, A.cut3 + .05, A.channel - .4, .8, .6), c2 = lab(t, A.minds + .05, A.channel - .4, .8, .6);
    if (c1 > 0 || c2 > 0) { backing(ctx, W / 2, 255, 1300, 200, Math.max(c1, c2)); X.big(ctx, SRC.core[0], W / 2, 228, 60, c1, { gold: 0 }); X.big(ctx, SRC.core[1], W / 2, 302, 52, c2, { gold: .35 }); }
    // rules that keep up: the cog in the HUD lights once
    const ku = bump(t, A.keepUp - .1, 2.2); if (ku > 0) halo(ctx, HUD.cog[0], HUD.cog[1], 90, .5 * ku, P.halo2, P.core0);
    // subscribe 2: a SUBSCRIBE tag rises over the sky (a tag, never a button), lights gold, sinks before the end screen
    const su = lab(t, A.subscribe - .05, A.endScr - .2, .7, .6);
    if (su > 0) { backing(ctx, W / 2, 300, 420, 90, su * .5); X.dateTag(ctx, B3STR.subscribe, W / 2, 300, su, { col: GOLD.text }); const gl = bump(t, A.subscribe + .4, 1.8); if (gl > 0) halo(ctx, W / 2, 300, 200, .35 * gl, GOLD.halo, GOLD.hot); }
    F.clocksHud(ctx, t, T);
  }
  return { race, wallTake, sun3Take, endTake, A, cuts: { c1: A.cut1, c2: A.cut2, c3: A.cut3 } };
}
