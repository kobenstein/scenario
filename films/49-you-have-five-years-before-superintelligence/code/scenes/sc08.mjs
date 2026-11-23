// Film 49 · c08 (B2) · STEP 2 · THE MACHINE (+ the bridge). Part of B2's one continuous take: the driver lives in scenes/sc06.mjs
// (groupB2), this file holds the c08 layers. The default export returns the same draw as c06/c07; the take exits INTO plateMachine.
//
// | beat  | phrase (VO)                          | picture                                                                                   | camera / kind      |
// |-------|--------------------------------------|-------------------------------------------------------------------------------------------|--------------------|
// | 3.10  | But if a machine can already act     | the child's screen glows on; you look up from it: the door at the top pulses closer; a    | rise · MIX         |
// |       | Are the five years even real?        | big gold 5 and a ? in the sky                                                              |                    |
// | 2.01  | Two years to go · the machine itself | STEP HIT: the fourth step lights, the living room pops up (window, TV headlines, tablet);  | push · MIX         |
// |       |                                      | you climb and walk in                                                                      |                    |
// | 2.02  | Five years to full … not a fact      | wide: a gold YEAR RAIL draws over the stairs, TODAY at the foot, the five years = the five | pull back · EXPL   |
// |       | A short deadline … raise money       | steps up to the door; the lab cards stand on the treads (2027? · 1–2 YEARS · END OF 2028); |                    |
// |       |                                      | A FORECAST, NOT A FACT · THEIR INTEREST / FUNDRAISING                                      |                    |
// | 2.03  | many outside experts say much later  | the rail runs far past the stairs: ≈ 2032 FORECASTING PLATFORMS · ≈ 2047 RESEARCHER SURVEY  | far pull back EXPL |
// | 2.04  | But so far, the experts …            | a marker EXPECTED FOR 2030 slides left past TODAY: DONE IN APRIL 2025 (FRI)                | glide left · EXPL  |
// | 2.05  | The chatbot … not yet old enough     | the rail runs on left; a calendar leaf drops from it: LAUNCHED 30 NOV 2022; bracket to     | glide left · EXPL  |
// |       |                                      | TODAY: NOT YET SCHOOL AGE                                                                  |                    |
// | 2.06  | By its maker's count … a billion     | a cool plumb line drops from the leaf into the ground: a sea of lights spreads under the   | drop · EXPL        |
// |       |                                      | plain and the stairs: OVER 1 BILLION / WEEKLY ACCOUNTS                                     |                    |
// | 2.07★ | And even most of their later dates   | widest: a bracket from TODAY to 2047: LESS THAN ONE GENERATION; down on the old stair the  | pull back · EXPL   |
// |       |                                      | thinking landing lights, a small bracket over that single landing: ONE GENERATION          |                    |
// | 2.08  | So it is the deadline … ready        | the rail pulls back to the five steps and runs into the door; LONGER → EARLY ·             | glide in · EXPL    |
// |       |                                      | FIVE → READY; the camera lands in the living room = plateMachine                           |                    |
// Carriers: the child's glow → the door pulse → the fourth step (step hit) → the rail (its growing end) → the 2047 mark → the FRI marker →
// the calendar leaf → the plumb line → the sea of lights → the bracket → the rail's end into the door → plateMachine.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f49_kit.mjs';
import * as S from '../lib/f49_world.mjs';
const { span, clamp, lerp, smooth, sineIO, expoOut, rgba, mixHex, halo, P, W } = E;
const { GOLD, PAPER, COOL } = F;
const TAU = Math.PI * 2;
export default async (T, R) => (await import('./sc06.mjs')).groupB2(T, R);

// ---- the year rail (world): TODAY (Nov 2026) at the foot of the stairs, one year per step, 2031.9 = the door
export const TODAY = 2026.9, RX0 = S.STEPS[0].L, PXY = (S.LANDING.L - S.STEPS[0].L) / 5, RY = 60;
const KN = [0, 1, 2, 3, 4].map((k) => S.STEPS[k].L).concat([S.LANDING.L]);   // year k of the five = the left edge of tread k (piecewise)
export const X = (yr) => { const f = yr - TODAY; if (f <= 0) return RX0 + f * PXY; if (f >= 5) return KN[5] + (f - 5) * PXY; const i = Math.floor(f); return lerp(KN[i], KN[i + 1], f - i); };
const SEA0 = { x: X(2022.9), y: S.GY + 6 };

export const keys = (a, A) => [
  [a.act + 3.0, A(1460, 420, 1.6, 860, 600)],
  [a.real + 1.5, A(1450, 415, 1.66, 860, 600)],
  [a.hit3 + 1.0, A(1430, 420, 1.62, 960, 600)],
  [a.itself + 1.0, A(1425, 418, 1.56, 960, 592)],
  [a.notFact + 2.4, A(1150, 470, .85, 960, 560)],
  [a.deadline - .5, A(1160, 470, .835, 960, 560)],
  [a.later + 3.2, A(2680, 470, .233, 960, 560)],
  [a.count, A(2560, 485, .236, 960, 560)],
  [a.billion + 1.2, A(2470, 495, .238, 960, 560)],
  [a.less + 1.2, A(2000, 560, .19, 960, 540)],
  [a.worth + .1, A(1950, 550, .2, 960, 540)],
  [a.ready - .3, A(1468, 372, 1.9, 960, 600)],
];

const e = (t, t0, t1) => sineIO(span(t, t0, t1));
// the drawn range of the rail [lo, hi] in years
function range(t, a) {
  const hi = TODAY + 5 * e(t, a.notFact - .05, a.notFact + 1.3) + 18.1 * e(t, a.later + .1, a.later + 1.7) - 18.1 * e(t, a.worth + .15, a.worth + 2.05);
  const lo = TODAY - 2.4 * e(t, a.underest + .35, a.underest + 1.35) - 2.5 * e(t, a.chatbot + .1, a.chatbot + 1.1) + 4.9 * e(t, a.worth + .15, a.worth + 2.05)
    + 5 * e(t, a.early - .1, a.early + 1.7);
  return { lo, hi, on: t >= a.notFact - .05 && hi - lo > .01, drop: span(t, a.notFact + .9, a.notFact + 2.4), dropOut: span(t, a.later - .2, a.later + .5) };
}
const seaR = (t, a) => 2600 * sineIO(span(t, a.count + .6, a.count + 3.8)) * (1 - sineIO(span(t, a.worth + .1, a.worth + 1.7)));
const starU = (t, a) => e(t, a.generation - .2, a.generation + 1.8) * (1 - e(t, a.worth + .2, a.worth + 2.2));

export function state(t, H, st) {
  const a = H.a;
  st.stage[3] = span(t, a.hit3, a.hit3 + 1.0);
  st.doorPulse = .9 * Math.sin(Math.PI * span(t, a.act + 1.2, a.real + 1.6)) ** 2;   // "the light at the top looks closer than before"
  const old = .35 * e(t, a.count, a.count + 2.5) + .3 * starU(t, a), s = starU(t, a);
  if (old > 0) { st.old = old; st.hist = [0, 0, .15 * s, .5 * s]; st.histWords = 0; }
}

// ---- world pieces (Z_LAND card)
const SEA = (() => {
  const r = E.prng(4908), out = [];
  for (let i = 0; i < 1500; i++) {
    const x = lerp(-1350, 1750, r()), y = S.GY + 10 + (r() ** 1.4) * 360, d = Math.hypot(x - SEA0.x, (y - SEA0.y) * 2.2);
    out.push({ x, y, d, s: 3 + r() * 4.5, ph: r() * TAU, f: .6 + r() * 1.4, w: r() < .12 });
  }
  return out.sort((p, q) => p.d - q.d);
})();
const LAB = [
  { x: 520, k: 0, big: '2027?', at: 0 }, { x: 800, k: 0, big: '1–2 YEARS', at: .18 }, { x: 1020, k: 1, big: 'END OF 2028', at: .36 },
];
const labSize = (l) => Math.max(170, F.measure(l.big, 40, true) + 46);
export function land(ctx, t, H, c) {
  const a = H.a;
  // the ground runs on right of the landing (the rail's far years are seen over it)
  const gx0 = S.LANDING.R + 380, gx1 = 9400;
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .18); ctx.fillRect(gx0, S.GY, gx1 - gx0, 5000);
  for (const [dy, al] of [[70, .35], [220, .45], [520, .6]]) { ctx.fillStyle = rgba(P.night0, al); ctx.fillRect(gx0, S.GY + dy, gx1 - gx0, 5000); }
  ctx.fillStyle = rgba(mixHex(P.blue2, GOLD.line, .2), .35); ctx.fillRect(gx0, S.GY, gx1 - gx0, 2);
  // the lab cards on the treads (the dates from the hook, inside the five steps)
  const lu = span(t, a.notFact + .4, a.notFact + 1.6), lo = span(t, a.later - .3, a.later + .5);
  if (lu > 0 && lo < 1) for (const l of LAB) {
    const u = expoOut(span(lu, l.at, l.at + .6)) * (1 - expoOut(span(lo, .3 - l.at * .5, 1 - l.at * .5)));
    F.tentCard(ctx, t, l.x, S.STAGES[l.k].y + 2, labSize(l), { u, big: l.big, bigSize: 40, h: 96, glow: .5 });
  }
  // the sea of lights: weekly accounts, spreading from the launch point through the ground under the plain and the stairs
  const R = seaR(t, a);
  if (R > 1) {
    const dim = 1 - .45 * starU(t, a), kz = H.proj(c, 0, 0).k;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, SEA0.x + R * .35, SEA0.y + 120, Math.max(10, R * .7), [[0, rgba(COOL.halo, .16 * dim)], [1, rgba(COOL.halo, 0)]]);
    ctx.beginPath(); ctx.ellipse(SEA0.x + R * .35, SEA0.y + 150, Math.max(10, R * .75), 190, 0, 0, TAU); ctx.fill();
    for (const d of SEA) {
      if (d.d > R) break;
      const g = clamp((R - d.d) / 140), fl = .82 + .18 * Math.sin(t * d.f * .6 + d.ph), s = Math.max(d.s, 2.6 / kz) * (.4 + .6 * expoOut(g));
      ctx.fillStyle = rgba(d.w ? COOL.core : COOL.body, (.45 + .45 * fl) * g * dim);
      ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s);
    }
    ctx.restore();
  }
}

// ---- screen helpers
function pill(ctx, x, y, w, h, a = 1) { if (a <= 0 || w <= 0) return; ctx.fillStyle = rgba(P.night0, .66 * a); ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(h / 2, 16)); ctx.fill(); }
// a gold verdict on a dark plate (the rail may pass behind it)
function plate(ctx, x, y, text, size, u) {
  const tw = F.measure(text, size, false, 700) + size * text.length * .08, k = expoOut(clamp(u * 1.4));
  pill(ctx, x - 22, y - size * 1.05, (tw + 44) * k, size * 1.6, clamp(u * 2));
  F.verdict(ctx, 0, x, y, text, u, { size, align: 'left' });
}
// a mark on the rail: dot, stem, label + sub on a dark plate
function mark(ctx, p, u, o) {
  u = clamp(u); if (u <= 0) return;
  const lift = (o.lift ?? 92) * expoOut(u), col = o.cool ? COOL.body : GOLD.hot;
  ctx.strokeStyle = rgba(o.cool ? COOL.line : GOLD.line, .85 * clamp(u * 3)); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y - 7); ctx.lineTo(p.x, p.y - lift); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, 7 * expoOut(clamp(u * 2)), 0, TAU); ctx.fill();
  halo(ctx, p.x, p.y, 34, .4 * u, o.cool ? COOL.halo : GOLD.halo, o.cool ? COOL.core : GOLD.core);
  const ls = o.size ?? 38, ss = 22, lw = Math.max(F.measure(o.label, ls, true), o.sub ? F.measure(o.sub, ss, false, 600) + o.sub.length * ss * .04 : 0) + 40;
  const top = p.y - lift - (o.sub ? 92 : 62), h = o.sub ? 86 : 56;
  pill(ctx, p.x - lw / 2 * expoOut(u), top, lw * expoOut(u), h, clamp(u * 2));
  F.maskLine(ctx, [[o.label, 0]], p.x, top + ls * .98, ls, F.rise(span(u, .25, 1)), { serif: true, align: 'center', col: o.cool ? COOL.text : GOLD.text, glow: false });
  if (o.sub) F.maskLine(ctx, [[o.sub, 0]], p.x, top + 74, ss, F.rise(span(u, .4, 1)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .04 });
}
function rail(ctx, t, H, c, R) {
  const P0 = (yr) => H.proj(c, X(yr), RY), pl = P0(R.lo), ph = P0(R.hi), ppy = P0(R.lo + 1).x - pl.x;
  F.goldSpan(ctx, [[pl.x, pl.y], [ph.x, ph.y]], 0, 1, { w: 1.8, spark: false });
  const small = smooth(span(ppy, 125, 160));
  for (let yr = Math.ceil(R.lo); yr <= Math.floor(R.hi); yr++) {
    const big = yr % 5 === 0, q = P0(yr), edge = clamp((R.hi - yr) / .35) * clamp((yr - R.lo) / .35);
    const tk = (big ? 13 : 7) * edge; if (tk <= .2) continue;
    ctx.fillStyle = rgba(GOLD.line, big ? .9 : .55); ctx.fillRect(q.x - 1, q.y - tk, 2, tk * 2);
    const lu = edge * (big ? 1 : small);
    if (lu > .01) {
      const s = String(yr), w = F.measure(s, 24, false, 600) + 18;
      pill(ctx, q.x - w / 2, q.y + 20, w, 34, .7 * clamp(lu * 2));
      F.maskLine(ctx, [[s, 0]], q.x, q.y + 45, 24, F.rise(lu), { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
    }
  }
  if (R.drop > 0) for (let k = 0; k < 5; k++) {   // one year = one step: dotted drops from the rail to the treads' left edges
    const u = smooth(span(R.drop, k * .12, .5 + k * .12)) * (1 - smooth(R.dropOut ?? 0)); if (u <= 0 || TODAY + k > R.hi + .01) continue;
    const q = P0(TODAY + k), g = H.proj(c, KN[k], S.STEPS[k].top);
    ctx.strokeStyle = rgba(GOLD.line, .45); ctx.lineWidth = 1.6; ctx.setLineDash([4, 7]); ctx.beginPath(); ctx.moveTo(q.x, q.y + 8); ctx.lineTo(q.x, lerp(q.y + 8, g.y, u)); ctx.stroke(); ctx.setLineDash([]);
  }
  if (R.lo <= TODAY + .01 && R.hi >= TODAY - .01) {   // TODAY
    const q = P0(TODAY), k = clamp((R.hi - TODAY) / .25) * clamp((TODAY - R.lo + .01) / .1 + (R.lo < TODAY - .05 ? 1 : 0));
    ctx.fillStyle = rgba(P.cream, .95 * k); ctx.fillRect(q.x - 1.5, q.y - 22 * k, 3, 44 * k);
    const w = F.measure('TODAY', 24, false, 700) + 22; pill(ctx, q.x - w / 2, q.y - 58, w, 34, .7 * k);
    F.maskLine(ctx, [['TODAY', 0]], q.x, q.y - 33, 24, F.rise(k), { serif: false, weight: 700, align: 'center', col: P.cream, glow: false });
  }
  return { P0, pl, ph };
}

// ---- the screen layers of c08
export function over(ctx, t, H, c) {
  const a = H.a;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // 3.10: the big 5 and a question mark in the sky
  const fu = F.rise(span(t, a.real - .1, a.real + .8)) * (1 - sineIO(span(t, a.two - .4, a.two + .2)));
  if (fu > 0) {
    const r = F.goldText(ctx, [['5', 1]], 140, 500, 250, fu, { serif: true, glow: true });
    F.goldText(ctx, [['?', 0]], 140 + r.w + 14, 500, 250, F.rise(span(t, a.real + .35, a.real + 1.1)) * (1 - sineIO(span(t, a.two - .4, a.two + .2))), { serif: true });
  }
  // the rail
  const R = range(t, a);
  let rr = null;
  if (R.on) {
    rr = rail(ctx, t, H, c, R);
    const grow = (R.hi - range(t - .05, a).hi) > 1e-4, shrinkL = (R.lo - range(t - .05, a).lo) > 1e-4;
    if (grow) halo(ctx, rr.ph.x, rr.ph.y, 60, .55, GOLD.halo, GOLD.core);
    if (shrinkL) halo(ctx, rr.pl.x, rr.pl.y, 60, .55 * (1 - span(t, a.early + 1.4, a.early + 1.7)), GOLD.halo, GOLD.core);
    // the forecasts far right
    const mOut = sineIO(span(t, a.underest - .1, a.underest + .45));
    mark(ctx, rr.P0(2032), span(t, a.later + .55, a.later + 1.4) * (1 - mOut), { label: '≈ 2032', sub: 'FORECASTING PLATFORMS', cool: true });
    mark(ctx, rr.P0(2047), span(t, a.later + 1.25, a.later + 2.1) * (1 - sineIO(span(t, a.worth - .45, a.worth + .15))), { label: '≈ 2047', sub: 'RESEARCHER SURVEY', cool: true });
    // the FRI marker: expected for 2030 → slides left past today → done in April 2025
    const fu2 = span(t, a.underest + .3, a.underest + 1.1), fOut = span(t, a.chatbot + .55, a.chatbot + 1.2);
    if (fu2 > 0 && fOut < 1) {
      const sl = sineIO(span(t, a.repeatedly, a.repeatedly + 1.8)), yr = lerp(2030, 2025.25, sl), p = rr.P0(yr), p30 = rr.P0(2030);
      if (sl > 0) {   // the trail and a ghost tick where it was expected
        F.goldSpan(ctx, [[p30.x, p30.y], [p.x, p.y]], 0, 1, { w: 3.2, spark: false, a: .55 * (1 - fOut) });
        ctx.strokeStyle = rgba(GOLD.line, .6 * (1 - fOut)); ctx.setLineDash([5, 6]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p30.x, p30.y - 6); ctx.lineTo(p30.x, p30.y - 60); ctx.stroke(); ctx.setLineDash([]);
      }
      const swap = span(t, a.repeatedly + 1.75, a.repeatedly + 2.35);
      const u1 = fu2 * (1 - sineIO(clamp(swap * 2))) * (1 - fOut), u2 = span(swap, .45, 1) * (1 - fOut);
      if (u1 > 0) mark(ctx, p, u1, { label: 'EXPECTED FOR 2030', size: 34, lift: 80 });
      if (u2 > 0) mark(ctx, p, Math.max(u2, .001), { label: 'DONE IN APRIL 2025', size: 34, lift: 80 });
    }
    // the calendar leaf: the chatbot's launch
    const lu = span(t, a.chatbot + .6, a.chatbot + 1.4), lOut = span(t, a.generation - .2, a.generation + .4);
    const pL = rr.P0(2022.9);
    if (lu > 0 && lOut < 1 && R.lo <= 2022.95) {
      const k = expoOut(lu) * (1 - sineIO(lOut)), lw = 290, lh = 118 * k, x0 = pL.x - lw / 2, y0 = pL.y + 40;
      ctx.strokeStyle = rgba(GOLD.line, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pL.x, pL.y + 6); ctx.lineTo(pL.x, y0); ctx.stroke();
      ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(pL.x, pL.y, 6, 0, TAU); ctx.fill();
      if (k > .01) {
        ctx.save(); ctx.beginPath(); ctx.rect(x0 - 20, y0, lw + 40, lh + 20); ctx.clip();
        ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(x0 + 6, y0 + 8, lw, lh);
        ctx.fillStyle = PAPER.lit; ctx.fillRect(x0, y0, lw, lh); ctx.fillStyle = mixHex(GOLD.deep, P.night1, .3); ctx.fillRect(x0, y0, lw, 26);
        ctx.fillStyle = PAPER.edge; for (let i = 0; i < 2; i++) ctx.fillRect(x0 + 70 + i * 150, y0 - 6, 6, 18);
        F.maskLine(ctx, [['LAUNCHED', 0]], pL.x, y0 + 56, 22, F.rise(span(lu, .4, 1)), { serif: false, weight: 700, align: 'center', col: PAPER.faint, glow: false, spacing: .08 });
        F.maskLine(ctx, [['30 NOV 2022', 0]], pL.x, y0 + 102, 40, F.rise(span(lu, .55, 1)), { serif: true, align: 'center', col: PAPER.ink, glow: false });
        ctx.restore();
      }
      // the plumb line into the ground (the sea of lights grows out of its foot)
      const pu = span(t, a.count + .05, a.count + .7);
      if (pu > 0) {
        const g = H.proj(c, SEA0.x, SEA0.y), yA = y0 + lh, yB = lerp(yA, g.y, sineIO(pu));
        ctx.strokeStyle = rgba(COOL.line, .85 * (1 - sineIO(lOut))); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pL.x, yA); ctx.lineTo(g.x, yB); ctx.stroke();
        if (pu < 1) halo(ctx, g.x, yB, 40, .6, COOL.halo, COOL.core);
        else halo(ctx, g.x, g.y, 90, .45 * (1 - sineIO(lOut)), COOL.halo, COOL.core);
      }
    }
    // the bracket: launch → today
    const bu = span(t, a.school - .2, a.school + .7) * (1 - sineIO(span(t, a.generation - .5, a.generation)));
    if (bu > 0 && R.lo <= 2022.95) F.bracket(ctx, pL.x, rr.P0(TODAY).x, pL.y - 74, bu, 'NOT YET SCHOOL AGE', { size: 28 });
    // ★ less than one generation: TODAY → 2047; the old stair: one landing
    const su = span(t, a.generation + .2, a.generation + 1.5), sOut = sineIO(span(t, a.worth - .5, a.worth + .1));
    if (su > 0 && sOut < 1) {
      const p0 = rr.P0(TODAY), p1 = rr.P0(2047), y = p0.y - 78;
      F.bracket(ctx, p0.x, p1.x, y, su * (1 - sOut), null);
      const gu = F.rise(span(t, a.less - .1, a.less + .6)) * (1 - sOut), gw = F.measure(F.SOURCES.generation, 42, false, 700) + F.SOURCES.generation.length * 42 * .06 + 40;
      pill(ctx, (p0.x + p1.x) / 2 - gw / 2 * expoOut(gu), y - 76, gw * expoOut(gu), 60, clamp(gu * 2));
      F.goldText(ctx, [[F.SOURCES.generation, .75]], (p0.x + p1.x) / 2, y - 30, 42, gu, { serif: false, weight: 700, spacing: .06, align: 'center' });
      const l = S.OLD_LANDINGS[3], ly = S.landingY(3) - 470, q0 = H.proj(c, l.x - l.w / 2, ly), q1 = H.proj(c, l.x + l.w / 2, ly);
      const ou = span(t, a.less + .5, a.less + 1.3) * (1 - sOut);
      if (ou > 0) {
        F.bracket(ctx, q0.x, q1.x, q0.y, ou, null);
        const w = F.measure('ONE GENERATION', 26, false, 600) + 24;
        pill(ctx, (q0.x + q1.x) / 2 - w / 2, q0.y - 56, w, 38, .7 * clamp(ou * 2));
        F.maskLine(ctx, [['ONE GENERATION', 0]], (q0.x + q1.x) / 2, q0.y - 28, 26, F.rise(span(ou, .3, 1)), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
      }
    }
  }
  // the words
  const vu = span(t, a.fact - .1, a.fact + .7) * (1 - span(t, a.raise - .6, a.raise - .1));
  if (vu > 0) plate(ctx, 100, 380, 'A FORECAST, NOT A FACT', 44, vu);
  const iu = span(t, a.raise - .05, a.raise + .7) * (1 - span(t, a.later + .7, a.later + 1.2));
  if (iu > 0) plate(ctx, 100, 380, 'THEIR INTEREST: FUNDRAISING', 44, iu);
  const bnu = F.rise(span(t, a.billion - .15, a.billion + .7)) * (1 - sineIO(span(t, a.generation - .1, a.generation + .4)));
  if (bnu > 0) {
    F.goldText(ctx, [['OVER 1 BILLION', .9]], 1000, 300, 84, bnu, { serif: true });
    F.maskLine(ctx, [['WEEKLY ACCOUNTS', 0]], 1004, 352, 28, F.rise(span(t, a.billion + .3, a.billion + 1.0)) * (1 - sineIO(span(t, a.generation - .1, a.generation + .4))), { serif: false, weight: 700, col: COOL.text, glow: false, spacing: .08 });
  }
  // 2.08 the two signposts
  const s1 = span(t, a.early + .1, a.early + .9) * (1 - span(t, a.p1 - .75, a.p1 - .35)), s2 = span(t, a.ready - .1, a.ready + .7) * (1 - span(t, a.p1 - .7, a.p1 - .3));
  if (s1 > 0) plate(ctx, 100, 300, F.SOURCES.signs[0], 52, s1);
  if (s2 > 0) plate(ctx, 100, 390, F.SOURCES.signs[1], 52, s2);
  ctx.restore();
}
export function sources(ctx, t, H) {
  const a = H.a;
  F.source(ctx, t, a.later + .5, a.underest + .3, F.SOURCES.platforms + ' · ' + F.SOURCES.survey2047);
  F.source(ctx, t, a.underest + .4, a.chatbot + 1.1, F.SOURCES.fri);
  F.source(ctx, t, a.billion + .1, a.generation + 2.6, F.SOURCES.billion);
}
