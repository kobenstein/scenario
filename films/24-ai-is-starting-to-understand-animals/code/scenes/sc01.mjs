// c01 · Hook · the barn · two pigs · sound 1 / sound 2 · the answer · you and A.I. · feelings yes, words not yet · the zoom out onto
// the night map · the gold ESP pin in California · 2030 · the question → plateCalifornia (lib/f24_seams.mjs) for the last .5 s.
// 0 → T.G('Their A.I. can already') · built by the lead (quality reference). Plan: docs/shots.md 1.01–1.10 · world/rules: docs/MOTION.md
// ONE entry, ONE world, ONE continuous camera, no cut: the barn under its lamp (the warm hero light) → you at the fence → the cards rise
// out of the pigs' backs → a wave grows over each pig while it calls → the beads slide (pig 2: NOT FINE) → you ✓, A.I. 9/10 →
// [translating…] stays empty → the whole barn shrinks into the medallion of the Europe pig pin while the map opens round it (one zoom,
// the medallion IS the barn) → the gold ESP pin grows in California → every species calls → the label, the 2030 strip is born on it and
// docks → the question; the map pushes onto California = the plate.
//
// | ID    | anchor (phrase)                          | picture (one idea)                                              | moves               | camera / layer      |
// |-------|------------------------------------------|-----------------------------------------------------------------|---------------------|---------------------|
// | 1.01★ | Scientists are trying … animals are saying | the barn at night, two pigs under one lamp; small calls rise   | calls · push        | slow push · SCENE   |
// | 1.02  | The first step … A.I. can hear what they feel | the claim, top left (serif, gold on "what they feel")        | line rises          | push · SCENE+EXPL   |
// | 1.03  | Try it yourself                          | the camera pulls back: you at the fence, leaning in             | pull back · lean    | reveal · SCENE      |
// | 1.04  | One of these two pigs … Guess which      | PIG 1 / PIG 2 cards rise out of their backs, FEELS ?            | cards (staggered)   | breathing · EXPL    |
// | 1.05  | Listen [P1] · And this one [P2]           | a wave grows over the calling pig, the snout / the raised head  | wave grows          | drift to the pig    |
// | 1.06  | It's the second pig                      | the beads slide: pig 2 NOT FINE (cool), pig 1 FINE (gold)       | beads               | back to both · EXPL |
// | 1.07  | You probably got it … nine times out of ten | YOU ✓ · A.I. (the gold listener) 9 of 10 marks · 9/10        | tick · marks        | slow push · EXPL    |
// | 1.08  | Feelings, yes. Words, not yet.           | ticks on both FEELS rows · an empty [translating…] bar          | ticks · bar         | push · EXPL         |
// | 1.09  | A small nonprofit in California … on Earth  | the barn shrinks into the pig pin; the night map; the ESP pin; calls spread | ONE zoom out · pin · calls | flight · MAP |
// | 1.10  | Earth Species Project … twenty thirty · Will they make it | label · the 2030 strip born on it, docks · the question · push onto CA | label · strip · push | MAP → plateCalifornia |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f24_kit.mjs';
import { plateCalifornia, CA_VIEW, CA_CALLS, SEAM_HALF } from '../lib/f24_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn } = E;
const { rise, maskLine } = F;

export const PRINT = F.PRINT24;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.sci = G('Scientists are trying'); a.saying = G('animals are saying', a.sci);
  a.first = G('The first step'); a.hear = G('A.I. can hear', a.first); a.feel = G('what they feel', a.first);
  a.try = G('Try it yourself');
  a.one = G('One of these two pigs'); a.doesnt = G("One doesn't", a.one); a.guess = G('Guess which', a.one);
  a.listen = G('Listen', a.guess); a.p1 = T.clip('P1'); a.this = G('And this one', a.listen); a.p2 = T.clip('P2');
  a.second = G("It's the second pig"); a.secondW = G('second pig', a.second);
  a.you = G('You probably got it'); a.ai = G('A.I. gets it too', a.you); a.nine = G('nine times', a.ai); a.ten = G('out of ten', a.ai);
  a.feelings = G('Feelings, yes'); a.words = G('Words, not yet'); a.wordsE = GE('Words, not yet');
  a.small = G('wants to change that') - .9; a.cal = G('California', a.small - 2);   // "A small nonprofit in California wants to change that"
  a.every = G('species on Earth', a.small) - .3; a.everyE = GE('species on Earth', a.small);
  a.esp = G('Earth Species Project', a.every); a.born = GE('breakthroughs by twenty thirty');
  a.will = G('Will they make it'); a.willE = GE('what happens to us if they do', a.will);
  a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

// ===================================================================================================== the set (barn design px, F0)
const B = F.BARN, F0 = F.F0;
const CARD1 = [262, 300], CARD2 = [1352, 300], CS = 1.2;   // card top-left (scale CS): over each pig's rump
const WAVE1 = [780, 508], WAVE2 = [1140, 508], WW = 280;   // the call waves: over each head, either side of the lamp's axis
const BAR = [960, 398];                                   // [translating…]: between the cards, under the lamp
const CAM = {
  lamp: F.aim(F0, 968, 380, 1.62),    // picture first: close under the lamp (the hero light), then down onto the pigs
  open: F.aim(F0, 1050, 612, 1.2),   // the two pigs and the lamp; you just outside the frame (left)
  push: F.aim(F0, 984, 598, 1.36),
  you: F.aim(F0, 930, 560, 1.02),     // pulled back: you at the fence on the left, both pigs, the lamp
  you2: F.aim(F0, 948, 574, 1.13),
  p1: F.aim(F0, 872, 578, 1.13),
  p2: F.aim(F0, 1068, 578, 1.13),
  res: F.aim(F0, 922, 558, 1.03),
  res2: F.aim(F0, 1004, 566, 1.08),
  med: F.BARN_MED,                    // = the default medallion camera of the pig pin (lib/f24_kit.mjs)
};
// the map: the zoom starts where the pig medallion fills the frame (its radius RF) and ends on the world view (radius PIN_R)
const PIGPIN = F.PINS.find((p) => p.id === 'pigs');
const WORLD = F.mapView(-42, 27, 1.15), WORLD2 = F.mapView(-60, 31, 1.8);
const Z0 = WORLD.z * F.RF / F.PIN_R, V0 = F.mapView(PIGPIN.lon, PIGPIN.lat, Z0);

// the barn camera: a monotone cubic spline through the word keys (x, y, log distance), so the camera glides THROUGH its keys
// instead of stopping at each one (E.camAt eases every segment to zero speed)
function camSpline(t, K) {
  const n = K.length, V = K.map(([, c]) => [c.x, c.y, Math.log(F0 - c.z)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0) return .35 * sec(0); if (j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: F0 - Math.exp(out[2]) });
}

// a cubic-bezier ease (x1, y1, x2, y2), solved by bisection
function bez(x1, y1, x2, y2) {
  const c = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x) => { if (x <= 0) return 0; if (x >= 1) return 1; let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (c(m, x1, x2) < x) lo = m; else hi = m; } return c((lo + hi) / 2, y1, y2); };
}

function scene(a, T) {
  const T0 = a.end, tPlate = T0 - SEAM_HALF;
  const tz0 = a.wordsE + .05, tz1 = tz0 + 3.4;                             // the zoom out (3.4 s, the hook's one big move)
  const ZE = bez(.55, 0, .25, 1);   // slow while the medallion is big (little picture change per frame), fast once it is small, long settle
  const tp0 = Math.max(a.born + 2.05, a.will + .4), tp1 = tPlate;           // the push onto California (after the strip has docked)
  const K = [
    [0, CAM.lamp], [a.first + .3, CAM.open], [a.try - .3, CAM.push], [a.one + .3, CAM.you], [a.listen - .1, CAM.you2],
    [a.p1.end - .3, CAM.p1], [a.p2.end - .2, CAM.p2], [a.second + 1.5, CAM.res], [tz0, CAM.res2], [tz1 - .3, CAM.med],
  ];
  const cardOut = (t) => 1 - expoIn(span(t, tz0 + .35, tz0 + .95));         // the explanations sink back into the barn while it shrinks
  const sound = (t, c) => (t >= c.start && t < c.end + .25 ? Math.sin(Math.PI * span(t, c.start - .05, c.end + .25)) : 0);
  const PUFFS = [[1, a.sci + .55, 'grunt'], [2, a.sci + 1.35, 'squeal'], [1, a.saying + .15, 'grunt'], [2, a.saying + .75, 'grunt']];

  // ---- the barn world, drawn with camera c (full frame, or inside the medallion through E.withOuter)
  function world(ctx, t, c) {
    const s1 = sound(t, a.p1), s2 = sound(t, a.p2);
    const puff = (k) => PUFFS.reduce((m, [pg, t0]) => (pg === k ? Math.max(m, Math.sin(Math.PI * span(t, t0 - .1, t0 + .5))) : m), 0);
    const arms = (s, e, d) => { const q = sineIO(span(t, a.try - .2 + d, a.try + 1.1 + d)); return [lerp(.08, s, q), lerp(.12, e, q)]; };
    const lean = .12 * sineIO(span(t, a.try + .1, a.try + 1.3)) - .05 * sineIO(span(t, a.second, a.second + 1.2));
    const cast = F.barnCast(ctx, c, t, {
      p1: { snout: Math.max(s1 * (.6 + .4 * Math.sin(t * 17)), puff(1) * .7), open: .25 * s1 * (.5 + .5 * Math.sin(t * 11)) },
      p2: { head: .55 * s2 + .15 * puff(2), open: .85 * s2 * (.7 + .3 * Math.sin(t * 23)) + .2 * puff(2), ear: .25 * s2 },
      you: { look: .15 + .25 * span(t, a.listen - .3, a.listen + .6), lean, armR: arms(1.45, 1.95, 0), armL: arms(1.3, 1.9, .12) },
    });
    E.card(ctx, c, F0, () => {
      // small calls rise from the snouts and shrink away ("what animals are saying")
      for (const [pg, t0, kind] of PUFFS) {
        const u = span(t, t0, t0 + 1.7); if (u <= 0 || u >= 1) continue;
        const m = pg === 1 ? cast.p1.mouth : cast.p2.mouth, x = m[0] + (pg === 1 ? 30 : -30) + 26 * u * (pg === 1 ? 1 : -1), y = m[1] - 40 - 90 * sineIO(u);
        F.wave(ctx, t, x, y, 64, 26 * Math.sin(Math.PI * Math.min(1, u * 1.6)) * (1 - u * .5), kind, { u: Math.min(1, u * 3), bars: 12, seed: 5 + pg, head: false, a: .85 });
      }
      const out = cardOut(t);
      // the call waves: they grow while the pig calls (the recorder's trace), then stay
      const w1 = span(t, a.p1.start, a.p1.end), w2 = span(t, a.p2.start, a.p2.end);
      if (w1 > 0) F.wave(ctx, t, WAVE1[0], WAVE1[1], WW, 96 * out, 'grunt', { u: w1, live: true, seed: 11, col: 'cream' });
      if (w2 > 0) F.wave(ctx, t, WAVE2[0], WAVE2[1], WW, 112 * out, 'squeal', { u: w2, live: true, seed: 12, col: 'cream' });
      // the cards rise out of the pigs' backs
      const res2 = span(t, a.secondW, a.secondW + .9), res1 = span(t, a.secondW + .45, a.secondW + 1.35);
      const tk = (d) => span(t, a.feelings + .15 + d, a.feelings + .7 + d);
      const cardAt = (xy, fn) => { ctx.save(); ctx.translate(xy[0], xy[1]); ctx.scale(CS, CS); fn(); ctx.restore(); };
      cardAt(CARD1, () => F.idCard(ctx, t, 0, 0, { name: 'PIG 1', sub: 'FARM · EUROPE', animal: 'pig', feelRow: true, u: rise(span(t, a.one + .35, a.one + 1.1)) * out,
        q: t >= a.guess && res1 <= 0, feel: res1 > 0 ? 1 : null, feelU: res1, feelWord: 'FINE', tick: tk(0) }));
      cardAt(CARD2, () => F.idCard(ctx, t, 0, 0, { name: 'PIG 2', sub: 'FARM · EUROPE', animal: 'pig', feelRow: true, u: rise(span(t, a.doesnt, a.doesnt + .75)) * out,
        q: t >= a.guess + .12 && res2 <= 0, feel: res2 > 0 ? -1 : null, feelU: res2, feelWord: 'NOT FINE', tick: tk(.15) }));
      cardAt(BAR, () => F.transBar(ctx, t, 0, 0, { w: 470, u: rise(span(t, a.words + .05, a.words + .7)) * out }));
    });
  }

  // ---- screen layer of the barn part: the claim, then the score (top left; both sink before the zoom)
  function claimAndScore(ctx, t, O = null) {   // O: the medallion's outer transform (the layer belongs to the barn frame)
    ctx.save(); if (O) ctx.setTransform(O.k, 0, 0, O.k, O.e, O.f); else ctx.setTransform(1, 0, 0, 1, 0, 0);
    const cu = rise(span(t, a.hear - .1, a.hear + .7)) * (1 - expoIn(span(t, a.one - .1, a.one + .4)));
    if (cu > 0) maskLine(ctx, [['A.I. can hear ', 0], ['what they feel.', 1]], 110, 176, 58, cu, { align: 'left' });
    const out = cardOut(t), yu = rise(span(t, a.you, a.you + .6)), au = rise(span(t, a.ai - .05, a.ai + .6));
    if ((yu > 0 || au > 0) && out > 0) {
      ctx.save(); ctx.translate(110, 80); ctx.scale(1.15, 1.15); ctx.translate(-110, -96);
      ctx.beginPath(); ctx.rect(80, 96, 760, 190); ctx.clip(); ctx.translate(0, (1 - out) * 190);
      if (yu > 0) {
        maskLine(ctx, [['YOU', 0]], 110, 160, 30, yu, { serif: false, weight: 600, col: P.cream, glow: false });
        F.tick(ctx, 196, 148, 15, span(t, a.you + .45, a.you + .95), 'cream');
      }
      if (au > 0) {
        F.listener(ctx, t, 140, 222, 26, { u: au, col: 'gold' });
        maskLine(ctx, [['A.I.', 1]], 184, 234, 30, au, { serif: false, weight: 600, glow: false });
        for (let i = 0; i < 10; i++) {   // ten tries: nine land gold, the tenth stays an empty ring
          const mu = expoOut(span(t, a.nine + i * .07, a.nine + i * .07 + .35)); if (mu <= 0) continue;
          const x = 268 + i * 30, y = 223, r = 9 * mu;
          if (i < 9) { E.halo(ctx, x, y, 22 * mu, .18, P.halo0, P.core1); ctx.fillStyle = F.GOLD.body; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
          else { ctx.strokeStyle = rgba(P.cream, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); }
        }
        maskLine(ctx, [['9/10', 1]], 584, 240, 44, rise(span(t, a.ten - .1, a.ten + .6)), {});
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // ---- the map part: the view, the zoom out of the medallion, the push onto California
  function mapView(t) {
    if (t < tz1) return F.flight(V0, WORLD, ZE(span(t, tz0, tz1)));
    if (t < tp0) return F.flight(WORLD, WORLD2, sineIO(span(t, tz1, tp0)));
    return F.flight(WORLD2, CA_VIEW, sineIO(span(t, tp0, tp1)));
  }
  function mapPart(ctx, t) {
    const v = mapView(t), r = Math.max(F.PIN_R, F.PIN_R * v.z / WORLD.z);
    const calls = lerp(clamp(span(t, a.every - .2, a.everyE + 1.6)), CA_CALLS, sineIO(span(t, tp0, tp1)));
    F.map(ctx, t, v, { calls });
    const [px, py] = F.mapXY(v, PIGPIN.lon, PIGPIN.lat), k = sineIO(clamp((r - F.RF) / (F.PIN_R - F.RF) * 1.25 - .25));
    const head = [px, py - (F.STALK + r) * k];   // the medallion leaves the pin point and settles on its stalk
    const cam = E.camDrift(camSpline(t, K), t, 1.8);
    const hd = F.pins(ctx, t, T, v, {
      head: t < tz1 ? { pigs: head } : {}, r: t < tz1 ? { pigs: r } : {},
      inner: t < tz1 ? { pigs: (cx, cy, rr) => {} } : {},
      labels: { esp: rise(span(t, a.esp - .1, a.esp + .7)) },
    });
    if (t < tz1 && hd.pigs) {   // the barn through the medallion (the pin has cleared its disc; the barn world fills it)
      const [cx, cy, rr] = hd.pigs, s = rr / F.RF;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, rr - 1, 0, 7); ctx.clip();
      const O = { k: s, e: cx - W / 2 * s, f: cy - H / 2 * s };
      E.withOuter(O, () => world(ctx, t, cam)); claimAndScore(ctx, t, O);
      ctx.restore();
      ctx.save(); ctx.strokeStyle = F.CREAM.core; ctx.lineWidth = clamp(rr * .12, 2, 3.2); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.stroke(); ctx.restore();
    }
    const e = hd.esp;
    F.strip(ctx, t, T, { from: e ? [e[0] + e[2] + 150, e[1] + 62] : null });
    F.questionLine(ctx, t, a.will, a.willE + .05, { text: 'Will they make it?', y: 206, size: 60 });
  }

  return (ctx, t) => {
    if (t >= tPlate) { plateCalifornia(ctx, t, T); return; }
    if (t < tz0) world(ctx, t, E.camDrift(camSpline(t, K), t, 1.8));
    else mapPart(ctx, t);
    if (t < tz0) claimAndScore(ctx, t);
  };
}
