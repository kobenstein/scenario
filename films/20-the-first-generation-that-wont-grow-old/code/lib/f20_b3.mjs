// Film 20 · builder B3 · c08 → c11 as ONE plan sequence ("the line is a price tag": the solution part, concrete and hopeful).
// Range: T.G("The optimists' estimates") (starts on plateTrack) → the film's end (end screen T.endscreen ≈ last 15 s).
// sc08 … sc11 each return one entry that calls the same draw(ctx, t) built here, so the chunk boundaries inside B3 are invisible
// (one camera, one world state per frame). Plan: docs/shots.md 8.01–11.06 · world/rules: docs/MOTION.md · kit: lib/f20_kit.mjs.
//
// | ID     | anchor (word)                              | picture (one idea)                                              | 1–2 moves              | camera              |
// |--------|--------------------------------------------|-----------------------------------------------------------------|------------------------|---------------------|
// | 8.01   | twenty thirty · twenty fifty · Estimates   | calendar marks 2030 · 2040 · 2050 at the track's left edge;     | marks · pins           | crane up, truck left|
// |        |                                            | three estimate pins drop onto the track (Kurzweil, de Grey, Church)                      |                     |
// | 8.02 ★ | one date · few decades                     | the finish line glides to 2040 and smears into the band         | line → band            | push along          |
// | 8.03   | not just when · who gets there in time     | the four in their lanes before the band; card returns           | card · glow            | pull back           |
// | 8.04   | gene therapy · four and a quarter million  | eye-and-drop mark, counter $4,250,000 (top right)               | counter                | breathing push      |
// | 8.05   | birth year · price tag                     | birth years over the four sink; the number flies down and       | years · the label      | push to the label   |
// |        |                                            | becomes a flat price label standing across the lanes            |                        |                     |
// | 9.01   | lose a year · cake                         | a dashed year-arrow from one lane to another, crossed: NOT A CAKE | arrow · cross        | hold                |
// | 9.02   | how fast the price falls                   | a spark leaves the label, draws a falling price curve (top left)| the curve              | drift               |
// | 9.03   | 1923 · insulin · one dollar                | the chart folds into a patent paper of light; $1 stamps on it   | paper · stamp          | drift               |
// | 9.04   | polio vaccine                              | a second paper (top right): the owner line stays empty          | empty line             | drift               |
// | 9.05   | Q3 slot                                    | the second paper grows into the quote card (Salk), it sinks     | lines rise             | hold                |
// | 10.01  | four kinds of decisions                    | four levers rise beside the label (right of the track)          | four levers            | truck right         |
// | 10.02–5| One · Two · Three · Four                   | each lever pulls, light runs to the label, it drops a step;     | pull · fact            | slow push           |
// |        |                                            | the fact rises top right (doses · bar · $84 · 33 lights → one)  |                        |                     |
// | 10.06  | Two more ideas · regulators · money        | two dashed empty lever slots                                    | slots                  | truck right         |
// | 10.07  | promise of access · almost never           | slot 6: a dashed promise line that does not close               | the line               | hold                |
// | 11.01  | rejuvenation therapy                       | first light (warm sky), the elders walk up to the label         | pull back · walk       | pull back           |
// | 11.02★ | discovery · decision                       | on "decision" the label lifts off and rises away                | the label lifts        | hold                |
// | 11.03  | one more time                              | the four together before the band                               | push                   | push                |
// | 11.04  | when that day comes · who gets there       | the needle trembles; all four lanes light to the band           | needle · lanes         | push                |
// | 11.05  | birth year · decision                      | the four step into the band together                            | the step               | push                |
// | 11.06  | end screen                                 | slow pull back and rise; the four small in the band; free areas | pull back              | pull back           |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f20_kit.mjs';
import * as S from './f20_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, cam3, camAt, camDrift, halo, rad, lin } = E;
const { FAMILY, CLOCK, GY, LANE, laneX, wp, gp, stand, bump, rise, maskLine, srcLine, measure, trailSpan, INK, COOL } = F;

// ===================================================================================================================== world (B3)
const HW = LANE.w * LANE.n / 2;                                    // half width of the track (920)
export const YZ = (y) => 8400 + (y - 2030) * 300;                  // the calendar on the track: 2030 → Z 8400, 2050 → Z 14400
const BAND = { z0: YZ(2030), z1: YZ(2050) };
const LZ = 8100;                                                   // the price label stands across the lanes here (before the band)
const LBL = { w: 1020, h: 820, step: 130 };                       // half width, full height, one step per lever
const LEVX = [1250, 1560, 1870, 2180, 2490, 2800];                 // levers 1–4 and the two empty slots, right of the track
const LEVZ = 6900;                                                 // … a little in front of the label (beside it, seen from behind)
const ZC = 7600, ZB = 8750;                                        // c11: the four gather here, then step into the band here
const PINS = [{ y: 2030, h: 420, name: 'KURZWEIL', sub: '≈ 2030' }, { y: 2036, h: 980, name: 'DE GREY', sub: '50 % BY 2036' }, { y: 2050, h: 1900, name: 'CHURCH', sub: '≈ 2050' }];
const BIRTH = ['1948', '1975', 'YOU', '2019'];
const WALK = { grand: .03, parent: .036, you: .036, kid: .052 };

// 1 → 0: a text sinks below its baseline again. maskLine eases its u with expoOut, so this is the inverse of that applied to a quad-in:
// the line itself then sinks with a plain quad-in (no last-frame snap). outO: the same exit for shapes (sizes, alphas) that use u directly.
const outU = (t, t1, d = .5) => { const x = span(t, t1, t1 + d); return x <= 0 ? 1 : x >= 1 ? 0 : Math.min(1, -.2 * Math.log2(x)); };
const outO = (t, t1, d = .5) => 1 - span(t, t1, t1 + d) ** 2;
const inU = (t, t0, d = .7) => rise(span(t, t0, t0 + d));
const fitSize = (s, size, maxW, serif = false, w = 600) => { let z = size; while (z > 19 && measure(s, z, serif, w) > maxW) z -= 1; return z; };
const money = (v) => '$' + Math.round(v).toLocaleString('en-US');
// a heavy landing: falls in, one small bounce, settles (u 0..1 over the window)
const heavy = (u) => (u <= 0 ? 0 : u < .35 ? (u / .35) ** 2 : 1 - .07 * Math.sin((u - .35) / .65 * Math.PI * 2) * (1 - (u - .35) / .65));

export function anchors(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.t08 = G("The optimists' estimates"); a.thirty = G('twenty thirty', a.t08); a.fifty = G('twenty fifty', a.t08); a.estim = G('Estimates, not studies', a.t08);
  a.thatDay = G('So that day', a.t08); a.oneDate = G('one date', a.thatDay); a.decades = G('few decades', a.thatDay); a.decadesE = GE('few decades', a.thatDay);
  a.changes = G('Which changes the question', a.t08); a.notJust = G('not just when', a.changes); a.whoT = G('who gets there in time', a.changes);
  a.treat = G('That treatment in the eye', a.t08); a.gene = G('gene therapy', a.treat); a.million = G('four and a quarter million', a.treat); a.millionE = GE('million dollars', a.treat);
  a.most = G('So for most of the world', a.treat); a.birth = G('birth year', a.most); a.tag = G('price tag', a.most); a.tagE = GE('price tag', a.most);
  a.t09 = G('Nobody has to lose'); a.lose = G('lose a year', a.t09); a.someone = G('someone else', a.t09); a.gain = G('gain one', a.t09);
  a.isnt = G("This isn't a", a.t09); a.cake = G('cake', a.isnt); a.question = G("The question isn't who", a.t09); a.falls = G('how fast the price falls', a.t09); a.fallsE = GE('price falls', a.t09);
  a.y1923 = G('In nineteen twenty-three', a.t09); a.insulin = G('insulin', a.y1923); a.dollar = G('one dollar', a.y1923); a.dollarE = GE('one dollar', a.y1923);
  a.later = G('A generation later', a.t09); a.owned = G('who owned the patent', a.later); a.polio = G('polio vaccine', a.later);
  const q3 = T.clips?.Q3 || T.clip?.('Q3'); a.q3 = q3 ? q3.start : a.polio + 1.4; a.q3e = q3 ? q3.end : a.q3 + 6; a.q3text = q3?.text;
  a.t10 = G('Both were decisions'); a.kinds = G('four kinds of decisions', a.t10); a.pulled = G('pulled prices down', a.t10);
  a.one = G('One:', a.t10); a.pool = G('pool the patents', a.one); a.sixty = G('sixty billion', a.one); a.poorer = G('poorer countries', a.one);
  a.two = G('Two:', a.one); a.flat = G('flat fee', a.two); a.louis = G('Louisiana', a.two); a.rose = G('rose sharply', a.two);
  a.three = G('Three:', a.two); a.copy = G('copy it', a.three); a.egypt = G('In Egypt', a.three); a.hundred = G('under a hundred dollars', a.three);
  a.four = G('Four:', a.three); a.negot = G('negotiate for everyone', a.four); a.states = G('Thirty-three American states', a.four); a.together = G('together', a.states);
  a.fails = G('If it fails', a.four); a.payback = G('pay back', a.fails);
  a.twoMore = G('Two more ideas', a.four); a.trial = G('A trial that pulls', a.twoMore); a.regul = G('regulators accept', a.trial); a.money = G('the money it needs', a.trial);
  a.publicM = G('And public research money', a.twoMore); a.promise = G('promise of access', a.publicM); a.never = G('It almost never does', a.publicM);
  a.t11 = G('None of this has ever'); a.rejuv = G('rejuvenation therapy', a.t11); a.discov = G('discovery', a.t11); a.each = G('Each one is a decision', a.t11); a.dec1 = G('decision', a.each);
  a.think = G('So think of your family', a.t11); a.oneMore = G('one more time', a.think);
  a.research = G('Research decides when', a.think); a.when = G('when that day', a.research); a.weDecide = G('We decide who', a.research); a.whoT2 = G('who gets there in time', a.weDecide);
  a.first = G('The first generation', a.weDecide); a.birth2 = G('birth year', a.first); a.dec2 = G('decision', a.birth2); a.dec2E = GE('decision', a.birth2);
  a.end = T.duration; a.es = T.endscreen?.start ?? (T.duration - 15);
  return a;
}

// ===================================================================================================================== the draw
export function makeB3(T) {
  const a = anchors(T);
  if (!a.es || a.es > a.end) a.es = a.end - 15;
  const tP = a.t08 + S.SEAM_HALF;                                   // the plate holds until here

  // ------------------------------------------------------------------------------------------------- cameras (keys on words)
  const C = (x, y, z) => cam3({ x, y, z });
  const K = [
    [a.t08, S.TRACK_CAM],
    [tP, S.TRACK_CAM],
    [a.estim + .6, C(-170, -560, 2250)],                           // 8.01 crane up a little, truck left to the calendar marks
    [a.decadesE + .7, C(-60, -420, 2550)],                         // 8.02 push along the track while the band forms
    [a.whoT + .9, C(0, -90, 1750)],                                // 8.03 pull back: the four before the band
    [a.millionE + .3, C(90, -90, 1850)],                           // 8.04 breathing push
    [a.tagE + 1.8, C(130, -120, 2200)],                            // 8.05 push to the label
    [a.cake + .6, C(40, -110, 2050)],                              // 9.01 settle back: the four and the arrow
    [a.dollarE + .4, C(-50, -120, 2150)],                          // 9.02–9.03 drift
    [a.q3e + .8, C(0, -130, 2250)],                                // 9.05 hold under the card
    [a.pulled + .6, C(820, -150, 2250), 'q'],                      // 10.01 truck right: the levers beside the label
    [a.four + 1.2, C(900, -160, 2450)],                            // 10.02–10.05 slow push through the pulls
    [a.regul, C(1150, -170, 2420)],                                 // 10.06 truck right: the two empty slots
    [a.never + .9, C(1100, -170, 2550)],
    [a.discov, C(300, -170, 1550), 'q'],                           // 11.01 pull back: the wide track at first light
    [a.dec1 + 1.6, C(200, -160, 1500)],                            // 11.02 hold while the label lifts
    [a.oneMore + .8, C(20, -130, 2500)],                           // 11.03 push behind the four
    [a.whoT2 + .6, C(0, -130, 2850)],
    [a.dec2E + .5, C(0, -170, 3150)],                              // 11.05 the step into the band
    [a.end, C(0, -1300, -9000)],                                  // 11.06 slow pull back and rise (end screen)
  ];
  for (let i = 1; i < K.length; i++) K[i][0] = Math.max(K[i][0], K[i - 1][0] + .4);
  const camOf = (t) => (t < tP ? S.TRACK_CAM : camDrift(camAt(t, K, CLOCK.Z), t, smooth(span(t, tP, tP + 2.2))));

  // ------------------------------------------------------------------------------------------------- per-frame world state
  // (the papers and the quote card are big cream faces: the dial steps back under them, luma budget; back before c10 starts)
  const paperDim = (t) => .14 * smooth(span(t, a.y1923 - .8, a.y1923 + .6)) * (1 - smooth(span(t, a.q3e - .4, a.q3e + .4)));
  const litAt = (t) => lerp(lerp(1, .64, smooth(span(t, a.thirty - .5, a.estim + 1.5))), .82, smooth(span(t, a.t11, a.oneMore))) - .2 * smooth(span(t, a.dec2E, a.es + 4)) - paperDim(t);
  const warmAt = (t) => smooth(span(t, a.t11 - .2, a.oneMore + 1));
  // the four: on their STOPS (c01), in c11 they walk up together to ZC (arriving on "one more time"), then step into the band
  const DUR = Object.fromEntries(FAMILY.map((f) => [f.who, Math.max(.8, (ZC - S.STOPS[f.who]) / 330)]));
  const famAt = (t) => FAMILY.map((f, i) => {
    const stop = S.STOPS[f.who], arrive = a.oneMore - .1 + i * .08, w0 = arrive - DUR[f.who];
    const u1 = span(t, w0, arrive), u2 = span(t, a.birth2 - .45 + i * .06, a.dec2E + .25 + i * .06);
    const Z = u2 > 0 ? lerp(ZC, ZB, sineIO(u2)) : lerp(stop, ZC, sineIO(u1));
    const moving = (u1 > 0 && u1 < 1) || (u2 > 0 && u2 < 1);
    const glow = Math.max(.75 * bump(t, a.whoT - .1, 2.4), smooth(span(t, a.whoT2 - .1, a.whoT2 + .6)) * (1 - .5 * smooth(span(t, a.es, a.es + 3))));
    const look = .25 * bump(t, a.changes, 3.4) + .3 * bump(t, a.dec1 + .1, 2.6);
    return { who: f.who, X: f.X, Z, view: 'back', dir: 1, light: 1, walk: moving ? (Z - stop) * WALK[f.who] : undefined, look: -look, glow };
  });
  // finish line → glides to 2040 on "one date" → smears into the band on "few decades"
  const bandAt = (t) => {
    const g = expoOut(span(t, a.decades - 1.4, a.decadesE + .5)), mid = YZ(2040);
    const lifted = smooth(span(t, a.dec1, a.dec1 + 2));
    const dim = 1 - .3 * smooth(span(t, a.tag, a.tag + .8)) * (1 - lifted);
    const lit = smooth(span(t, a.whoT2 - .2, a.whoT2 + 1.2));
    return g > 0 ? { z0: lerp(mid - 250, BAND.z0, g), z1: lerp(mid + 250, BAND.z1, g), a: (.35 + .65 * g) * dim * (1 + .45 * lit + .25 * lifted) } : null;
  };
  const trackAt = (t) => {
    const fu = span(t, a.oneDate - .5, a.oneDate + 1.6), fin = lerp(S.FIN_FAR, YZ(2040), expoOut(fu));
    const finA = .7 * (1 - smooth(span(t, a.decades - 1.2, a.decadesE + .2)));
    const mk = smooth(span(t, a.thirty - .5, a.thirty + .3));
    const marks = [2030, 2040, 2050].map((y, i) => ({ Z: YZ(y), text: '', a: mk * smooth(span(t, a.thirty - .5 + i * .45, a.thirty + .3 + i * .45)) }));
    return { lit: 1 + .35 * smooth(span(t, a.whoT2 - .2, a.whoT2 + 1)), reach: 1, fin, finA, marks, band: bandAt(t) };
  };
  // the price label: lands on "price tag", drops one step per lever, lifts off on "decision" (11.02)
  const LAND = a.tag + .35, FLY0 = LAND - 1.15;
  const PULL = [a.one, a.two, a.three, a.four];
  const DROP = PULL.map((p) => p + .62);
  const labelAt = (t) => {
    if (t < LAND - 1.5) return null;
    const fall = span(t, LAND - 1.5, LAND), y0 = -2600 * (1 - sineIO(fall)) + 22 * bump(t, LAND - .05, .5);   // lowered from the dark, a soft settle
    let sink = 0; for (const d of DROP) sink += LBL.step * heavy(span(t, d, d + .55));
    const dip = 40 * bump(t, a.dec1 - .25, .5), up = 3600 * span(t, a.dec1 + .1, a.dec1 + 3.3) ** 2.2;
    const squash = 0;
    if (up > 3500) return null;
    const unsink = sink * smooth(span(t, a.dec1 + .1, a.dec1 + 1.2));
    return { y: y0 - up + dip, sink: sink - unsink, ghost: smooth(span(t, DROP[0], DROP[0] + .6)) * (1 - smooth(span(t, a.dec1, a.dec1 + .6))),
      word: smooth(span(t, a.pulled - .2, a.pulled + .5)), ink: t >= LAND ? 1 : 0, squash, glow: .5 + .5 * smooth(span(t, a.dec1, a.dec1 + 1)) };
  };

  // screen layout (explainer slots)
  const XR = 1480;
  const HUM_H = (who) => (who === 'kid' ? F.HUM * .6 : F.HUM);
  const CH = { x0: 120, x1: 470, y0: 210, y1: 430 };
  const CURVE = Array.from({ length: 41 }, (_, i) => { const u = i / 40; return [u, Math.exp(-3.1 * u) * (1 - .06 * u)]; });
  const P1 = { x: 110, y: 120, w: 360, h: 420 }, P2 = { x: 1450, y: 120, w: 360, h: 420 };

  // ------------------------------------------------------------------------------------------------- frame
  return (ctx, t) => {
    if (t < tP) { S.plateTrack(ctx, t); return; }
    const c = camOf(t);
    const fam = famAt(t), lit = litAt(t);
    // 11.06 the clock goes low: during the pull back it recedes along the horizon until it sits small and warm in the centre (the two
    // video boxes left and right keep clean sky; never static: it keeps sinking slowly to the last frame)
    const dial = { ...S.DIAL, lit, Z: CLOCK.Z + 90000 * sineIO(span(t, a.dec2E + .5, a.end)), tick: (tt) => { const u = tt - a.when + .05; return u > 0 && u < 1.8 ? 1.4 * Math.sin(u * 34) * Math.exp(-u * 2.6) * smooth(clamp(u * 8)) : 0; } };
    const lb = labelAt(t);
    const res = F.scene20(ctx, c, t, {
      warm: warmAt(t), dial, track: trackAt(t), fam, table: null, lamp: null,
      extra: (cx, cc, tt, layer, d) => {
        if (layer === 'far') dawn(cx, cc, tt);
        if (layer === 'track') { laneLights(cx, cc, tt); pins(cx, cc, tt); levers(cx, cc, tt); if (lb) label(cx, cc, tt, lb); }
      },
    });
    overlays(ctx, t, c, fam, lb, res.dial);
  };

  // ================================================================================================= world objects
  // 8.01 the estimate pins: a thin post of light dropping from the dark onto the track's right edge, a head of light; they sink
  // into the band once it has formed (8.02)
  function pins(ctx, c, t) {
    const out = smooth(span(t, a.decadesE + .6, a.decadesE + 1.8));
    if (out >= 1) return;
    PINS.forEach((p, i) => {
      const t0 = a.thirty + .2 + i * .55 + (i === 2 ? .3 : 0), u = span(t, t0, t0 + .7); if (u <= 0) return;
      const Z = YZ(p.y), X = HW + 70, k = expoOut(u), sinkH = p.h * out;
      stand(ctx, c, 0, Z, () => {
        ctx.save(); ctx.beginPath(); ctx.rect(X - 400, -6000, 800, 6000); ctx.clip();
        const top = -p.h + sinkH - (1 - k) * 1600, bot = Math.min(0, top + p.h);
        ctx.strokeStyle = rgba(P.halo1, .85); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(X, top); ctx.lineTo(X, bot); ctx.stroke();
        halo(ctx, X, top, 120, .8 * clamp(u * 3), P.halo0, P.core0);
        ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(X, top, 22, 0, 6.29); ctx.fill();
        if (k > .95) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo0, .35 * bump(t, t0 + .55, .6)); ctx.beginPath(); ctx.ellipse(X, 0, 130, 26, 0, 0, 6.29); ctx.fill(); }
        ctx.restore();
      });
    });
  }
  // 11.04 all four lanes light to the band: each lane's surface fills with warm light from the start line into the band
  function laneLights(ctx, c, t) {
    const u0 = span(t, a.whoT2 - .3, a.whoT2 + 1.5); if (u0 <= 0) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) {
      const u = expoOut(clamp(u0 * 1.3 - i * .1)), ua = u ** 1.5; if (u <= 0) continue;   // (the light grows with its reach: no bright block at the start)
      const x0 = laneX(i) - LANE.w / 2 + 40, x1 = laneX(i) + LANE.w / 2 - 40, z0 = 4400, z1 = lerp(z0, BAND.z0 + 1500, u);
      const poly = F.flat(c, [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]); if (!poly) continue;
      const n = gp(c, 0, Math.max(z0, c.z + 61)), f = gp(c, 0, z1); if (!n || !f) continue;
      ctx.fillStyle = lin(ctx, 0, n[1], 0, f[1] + .01, [[0, rgba(P.halo1, .02 * ua)], [.7, rgba(P.halo0, .11 * ua)], [1, rgba(P.core1, .2 * ua)]]);
      const pp = new Path2D(); poly.forEach((q, k) => (k ? pp.lineTo(q[0], q[1]) : pp.moveTo(q[0], q[1]))); pp.closePath(); ctx.fill(pp);
    }
    ctx.restore();
  }
  // first light (c11): a low warm dawn along the horizon, either side of the dial
  function dawn(ctx, c, t) {
    const w = warmAt(t); if (w <= 0) return;
    const p = gp(c, 0, 200000), y = p ? p[1] : H / 2;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    ctx.translate(W / 2, y); ctx.scale(1, .16);
    ctx.fillStyle = rad(ctx, 0, 0, 1500, [[0, rgba(P.halo0, .2 * w)], [.5, rgba(P.halo1, .09 * w)], [1, rgba(P.halo1, 0)]]);
    ctx.beginPath(); ctx.arc(0, 0, 1500, 0, 6.29); ctx.fill(); ctx.restore();
  }
  // the levers (10.01–10.05) and the two empty slots (10.06–10.07), standing on the ground right of the track at LZ
  function leverAng(t, i) {
    const p = PULL[i]; if (t < p - .2) return .5;
    const ant = .08 * smooth(span(t, p - .2, p - .02)), go = span(t, p - .02, p + .3), st = span(t, p + .3, p + .8);
    const ov = -.06 * Math.sin(st * Math.PI) * (1 - st);
    return go <= 0 ? .5 + ant : lerp(.5 + ant, -.32, expoOut(go)) + ov;
  }
  function levers(ctx, c, t) {
    for (let i = 0; i < 6; i++) {
      const slot = i >= 4, t0 = slot ? a.twoMore + .1 + (i - 4) * .5 : a.kinds - .2 + i * .16, u = expoOut(span(t, t0, t0 + .9));
      const back = smooth(span(t, a.birth2 - .3 + i * .08, a.birth2 + 1.1 + i * .08));   // gone before the end screen
      if (u <= 0 || back >= 1) continue;
      const X = LEVX[i];
      stand(ctx, c, 0, LEVZ, () => {
        ctx.save(); ctx.beginPath(); ctx.rect(X - 500, -3000, 1000, 3000); ctx.clip();
        ctx.translate(0, (1 - u) * 640 + back * 700);
        if (!slot) {
          const pulled = smooth(span(t, PULL[i] + .1, PULL[i] + .5));
          // base: a heavy dark block with a lit top edge
          ctx.fillStyle = lin(ctx, X - 95, 0, X + 95, 0, [[0, P.night1], [.5, mixHex(P.ind2, P.blue1, .5)], [1, P.ind1]]);
          ctx.beginPath(); ctx.roundRect(X - 95, -110, 190, 110, 10); ctx.fill();
          ctx.fillStyle = rgba(P.halo1, .55 + .35 * pulled); ctx.fillRect(X - 95, -112, 190, 7);
          // the arm (pivot on the base) and its knob of light
          const ang = leverAng(t, i), L = 440, px = X, py = -100, ex = px + Math.sin(ang) * L, ey = py - Math.cos(ang) * L;
          ctx.strokeStyle = lin(ctx, px, py, ex, ey, [[0, mixHex(P.night1, P.shade0, .5)], [1, mixHex(P.shade0, P.halo0, .5 + .4 * pulled)]]); ctx.lineWidth = 26; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex, ey); ctx.stroke();
          halo(ctx, ex, ey, 150 + 60 * pulled, .45 + .45 * pulled, P.halo0, P.core0);
          ctx.fillStyle = mixHex(P.halo0, P.core0, .4 + .6 * pulled); ctx.beginPath(); ctx.arc(ex, ey, 44, 0, 6.29); ctx.fill();
          ctx.fillStyle = mixHex(P.night1, P.shade0, .5); ctx.beginPath(); ctx.arc(px, py, 22, 0, 6.29); ctx.fill();
        } else {
          // an empty slot: the same lever as a dashed outline of light (waiting)
          ctx.setLineDash([26, 18]); ctx.strokeStyle = rgba(P.halo2, .75); ctx.lineWidth = 9;
          ctx.beginPath(); ctx.roundRect(X - 95, -110, 190, 110, 10); ctx.stroke();
          const L = 440, ex = X + Math.sin(.5) * L, ey = -100 - Math.cos(.5) * L;
          ctx.beginPath(); ctx.moveTo(X, -100); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.beginPath(); ctx.arc(ex, ey, 44, 0, 6.29); ctx.stroke();
        }
        ctx.restore();
      });
      // the lever's number on its base (screen space so it stays readable)
      if (!slot) { const p = wp(c, X, GY - 45, LEVZ); if (p) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); maskLine(ctx, [[String(i + 1), 0]], p[0], p[1] + clamp(p[2] * 60, 22, 40) * .35, clamp(p[2] * 80, 24, 44), u * u * (1 - back), { serif: true, col: mixHex(P.halo2, P.core1, smooth(span(t, PULL[i] + .1, PULL[i] + .5))), glow: false, align: 'center' }); ctx.restore(); } }
      // the pull drives the label: a pulse of light runs along the ground from the lever to the label's edge
      if (!slot) {
        const q = span(t, PULL[i] + .26, DROP[i] + .05);
        if (q > 0 && q < 1) {
          ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
          const pts = []; for (let k = 0; k <= 24; k++) { const e = k / 24, p = gp(c, lerp(X - 110, LBL.w - 40, e), lerp(LEVZ, LZ - 40, e)); if (p) pts.push([p[0], p[1]]); }
          if (pts.length > 1) trailSpan(ctx, pts, clamp(expoIn(q) - .35), expoIn(q), { w: 3, spark: true, a: .95 });
          ctx.restore();
        }
      }
    }
  }
  // THE PRICE LABEL: a flat card of light (cream, ink type, notched ends like a ticket: not a hanging tag) standing across the four
  // lanes before the band. It sinks one step into the ground per lever; on "decision" it lifts off and rises away.
  function label(ctx, c, t, lb) {
    stand(ctx, c, 0, LZ, () => {
      const w = LBL.w, h = LBL.h, base = lb.y + lb.sink, top = base - h;
      // the ghost of its first height (how far the price has fallen)
      if (lb.ghost > 0) { ctx.save(); ctx.setLineDash([30, 22]); ctx.strokeStyle = rgba(P.halo2, .55 * lb.ghost); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-w, -h); ctx.lineTo(w, -h); ctx.stroke(); ctx.restore(); }
      ctx.save();
      ctx.beginPath(); ctx.rect(-w - 300, -9000, 2 * w + 600, 9000); ctx.clip();                              // it stands in a slot in the ground
      ctx.translate(0, base); ctx.scale(1 + lb.squash * .5, 1 - lb.squash); ctx.translate(0, -base);
      halo(ctx, 0, top + h * .45, w * 1.3, .28 * lb.glow, P.halo0, P.core1);
      const p = new Path2D(), n = 70, r = 24;
      p.moveTo(-w + r, top); p.lineTo(w - r, top); p.quadraticCurveTo(w, top, w, top + r); p.lineTo(w, top + h / 2 - n); p.arc(w, top + h / 2, n, -Math.PI / 2, Math.PI / 2, true);
      p.lineTo(w, base - r); p.quadraticCurveTo(w, base, w - r, base); p.lineTo(-w + r, base); p.quadraticCurveTo(-w, base, -w, base - r); p.lineTo(-w, top + h / 2 + n);
      p.arc(-w, top + h / 2, n, Math.PI / 2, -Math.PI / 2, true); p.lineTo(-w, top + r); p.quadraticCurveTo(-w, top, -w + r, top); p.closePath();
      ctx.fillStyle = rad(ctx, -w * .3, top + h * .3, w * 1.5, [[0, P.core0], [.55, P.core1], [1, P.halo1]]); ctx.fill(p);
      ctx.strokeStyle = rgba(P.shade0, .75); ctx.lineWidth = 10; ctx.stroke(p);
      // a perforation line near each end (a label, not a sign)
      ctx.save(); ctx.setLineDash([16, 16]); ctx.strokeStyle = rgba(P.shade0, .55); ctx.lineWidth = 6;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * (w - 190), top + 40); ctx.lineTo(s * (w - 190), base - 40); ctx.stroke(); }
      ctx.restore();
      // ink: the price, which rolls to the word PRICE once the decisions start pulling it down
      ctx.save(); ctx.beginPath(); ctx.rect(-w, top + 30, 2 * w, 330); ctx.clip();
      const wd = lb.word, yN = top + 290;
      if (wd < 1 && lb.ink) { ctx.font = '260px "Instrument Serif"'; ctx.textAlign = 'center'; ctx.fillStyle = INK; ctx.fillText('$4,250,000', 0, yN + expoIn(wd) * 330); }
      if (wd > 0) { ctx.font = '600 170px Inter'; ctx.letterSpacing = '34px'; ctx.textAlign = 'center'; ctx.fillStyle = INK; ctx.fillText('PRICE', -420, yN - 40 + (1 - expoOut(wd)) * 330); }
      ctx.restore();
      ctx.fillStyle = rgba(P.shade0, .7); ctx.fillRect(-w + 230, top + 350, 2 * w - 460, 8);
      ctx.restore();
      // the slot's lip on the ground (it reads as standing IN the track)
      if (lb.y > -300) { ctx.fillStyle = rgba(P.night0, .8 * clamp(1 + lb.y / 300)); ctx.beginPath(); ctx.ellipse(0, 0, w + 60, 26, 0, 0, 6.29); ctx.fill(); ctx.fillStyle = rgba(P.halo1, .45); ctx.fillRect(-w - 40, -6, 2 * w + 80, 6); }
    });
  }

  // ================================================================================================= screen-space explainers
  function overlays(ctx, t, c, fam, lb, dial) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    calendar(ctx, t, c);
    if (t < a.t09 + 2) { F.qcard(ctx, t, [[a.whoT - .25, 'WHO GETS THERE IN TIME?'], [a.treat + .3, null]]); }
    price(ctx, t, c, lb);
    birthYears(ctx, t, c, fam);
    cake(ctx, t, c, fam);
    curve(ctx, t, c, lb);
    papers(ctx, t);
    card(ctx, t);
    facts(ctx, t, c);
    ctx.restore();
  }
  // 8.01 the calendar years at the track's left edge (my own labels: readable sizes) + ESTIMATES, NOT STUDIES + the pins' names
  function calendar(ctx, t, c) {
    const out = outU(t, a.t09 + .3, .6);
    if (t > a.t09 + 1 || t < a.thirty - .6) return;
    [2030, 2040, 2050].forEach((y, i) => {
      const u = inU(t, a.thirty - .3 + i * .45) * out; if (u <= 0) return;
      const p = wp(c, -HW - 250, GY, YZ(y)); if (!p) return;
      maskLine(ctx, [[String(y), 0]], p[0], p[1] + 2, clamp(p[2] * 170, 28, 52), u, { serif: true, col: P.cream, glow: true, align: 'right' });
    });
    const eu = inU(t, a.estim - .1) * outU(t, a.whoT - .9);
    if (eu > 0) { maskLine(ctx, [['ESTIMATES,', 0]], 110, 250, 36, eu, { serif: false, col: P.cream, glow: true, weight: 600 });
      maskLine(ctx, [['NOT STUDIES', 0]], 110, 298, 36, clamp(eu * 1.2 - .1), { serif: false, col: P.halo0, glow: true, weight: 600 }); }
    const po = outU(t, a.decadesE + .5, .5);
    PINS.forEach((p, i) => {
      const t0 = a.thirty + .2 + i * .55 + (i === 2 ? .3 : 0), u = inU(t, t0 + .45) * po; if (u <= 0) return;
      const s = wp(c, HW + 70, GY - p.h, YZ(p.y)); if (!s) return;
      const x = s[0] + 26, y = s[1] + 8;
      maskLine(ctx, [[p.name, 0]], x, y, 24, u, { serif: false, col: P.cream, glow: true, weight: 600 });
      srcLine(ctx, t, p.sub, x, y + 28, clamp(u * 1.2 - .1), { size: 20, col: P.halo0 });
    });
  }
  // 8.04 the eye-and-drop mark + the counter $4,250,000 (top right); 8.05 the number flies down onto the label
  function price(ctx, t, c, lb) {
    if (t < a.treat - .2 || t > LAND + .2) return;
    const out = outU(t, a.birth - .4, .5);
    // the eye mark with the drop
    const eu = inU(t, a.treat + .1, .8) * outO(t, a.birth - .4, .5);
    if (eu > 0) {
      ctx.save(); ctx.translate(0, (1 - eu) * 30); ctx.globalAlpha *= clamp(eu * 2);
      F.eye(ctx, t, XR + 70, 175, 130, { open: .4 + .6 * eu, young: smooth(span(t, a.gene + .2, a.gene + 1.2)), drop: span(t, a.gene - .35, a.gene + .1), ripple: span(t, a.gene + .1, a.gene + .9) });
      ctx.restore();
      maskLine(ctx, [['GENE THERAPY', 0]], XR + 160, 186, 28, inU(t, a.gene - .1) * out, { serif: false, col: P.cream, glow: true, weight: 600 });
    }
    const cu = inU(t, a.million - .5) * out;
    if (cu > 0) {
      srcLine(ctx, t, 'UP TO', XR, 262, cu, { size: 22, col: P.halo2 });
      srcLine(ctx, t, 'HIGHEST U.S. LIST PRICE', XR, 384, clamp(cu * 1.2 - .1), { size: 21 });
      srcLine(ctx, t, 'LENMELDY · 2024', XR, 412, clamp(cu * 1.3 - .2), { size: 21 });
    }
    if (t < FLY0 && t > a.million - .6) maskLine(ctx, [['$4,250,000', 0]], XR, 340, 78, inU(t, a.million - .25, .8), { serif: true, col: P.cream, glow: true });
    // the flight: the number lifts off the sky and lands as the label's ink (the label itself falls from the dark at the same time)
    const fly = span(t, FLY0, LAND);
    if (fly > 0 && fly < 1 && lb) {
      const q = wp(c, 0, GY + lb.y - LBL.h + 290 - 6, LZ); if (!q) return;
      const e = sineIO(fly), sx = XR + measure('$4,250,000', 78) / 2, sy = 340, mx = (sx + q[0]) / 2 + 120, my = Math.min(sy, q[1]) - 120;
      const x = (1 - e) ** 2 * sx + 2 * (1 - e) * e * mx + e * e * q[0], y = (1 - e) ** 2 * sy + 2 * (1 - e) * e * my + e * e * q[1];
      const size = lerp(78, 260 * q[2], e);
      ctx.save(); ctx.font = `${size}px "Instrument Serif"`; ctx.textAlign = 'center'; ctx.fillStyle = mixHex(P.cream, INK, e ** 4);
      ctx.shadowColor = rgba(P.halo0, .8 * (1 - e ** 4)); ctx.shadowBlur = size * .4; ctx.fillText('$4,250,000', x, y); ctx.restore();
    }
  }
  // 8.05 the birth years over the four (1948 · 1975 · YOU · 2019): rise on "birth year", sink when the label lands
  function birthYears(ctx, t, c, fam) {
    if (t < a.birth - .6 || t > LAND + .8) return;
    fam.forEach((f, i) => {
      const u = inU(t, a.birth - .35 + i * .07, .6) * outU(t, a.tag - .35 + i * .05, .45); if (u <= 0) return;
      const p = wp(c, f.X, GY - HUM_H(f.who) - 70, f.Z); if (!p) return;
      maskLine(ctx, [[BIRTH[i], 0]], p[0], p[1], BIRTH[i] === 'YOU' ? 26 : 34, u, { serif: BIRTH[i] !== 'YOU', col: BIRTH[i] === 'YOU' ? P.coat : P.cream, glow: true, align: 'center', weight: 600 });
    });
  }
  // 9.01 a year does not move from one lane to another: a dashed arrow from the grandparent to the kid, a token "1 YEAR" travels,
  // the arrow is crossed out on "This isn't", NOT A CAKE on "cake"
  function cake(ctx, t, c, fam) {
    if (t < a.lose - .6 || t > a.question + 1.2) return;
    const out = 1 - smooth(span(t, a.question - .1, a.question + .7));
    const g = fam[0], k = fam[3];
    const pa = wp(c, g.X, GY - F.HUM - 60, g.Z), pb = wp(c, k.X, GY - F.HUM * .6 - 60, k.Z); if (!pa || !pb) return;
    const mx = (pa[0] + pb[0]) / 2, my = Math.min(pa[1], pb[1]) - 430;
    const pts = []; for (let i = 0; i <= 40; i++) { const e = i / 40; pts.push([(1 - e) ** 2 * pa[0] + 2 * (1 - e) * e * mx + e * e * pb[0], (1 - e) ** 2 * pa[1] + 2 * (1 - e) * e * my + e * e * pb[1]]); }
    const du = sineIO(span(t, a.lose - .2, a.someone + .2));
    if (du > 0) {
      ctx.save(); ctx.globalAlpha *= out;
      const sub = pts.slice(0, Math.max(2, Math.round(du * 40) + 1));
      ctx.setLineDash([16, 12]); ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(P.night0, .55); ctx.lineWidth = 9; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      ctx.strokeStyle = rgba(P.cream, .95); ctx.lineWidth = 4; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      ctx.setLineDash([]);
      if (du >= 1) {   // the arrow head at the kid
        const [x1, y1] = pts[40], [x0, y0] = pts[37], an = Math.atan2(y1 - y0, x1 - x0);
        ctx.fillStyle = P.cream; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - Math.cos(an - .45) * 24, y1 - Math.sin(an - .45) * 24); ctx.lineTo(x1 - Math.cos(an + .45) * 24, y1 - Math.sin(an + .45) * 24); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    // the year token travelling along the arrow
    const tu = span(t, a.someone - .1, a.gain + .2);
    if (tu > 0 && tu < 1) { const e = sineIO(tu), [x, y] = F.along(pts, e); halo(ctx, x, y, 44, .9, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.29); ctx.fill(); }
    const q1 = pts[9], q3 = pts[31], ap = pts[20];
    srcLine(ctx, t, '−1 YEAR', q1[0] - 20, q1[1] - 24, inU(t, a.lose - .1, .5) * out, { size: 24, col: P.cream, align: 'center' });
    srcLine(ctx, t, '+1 YEAR', q3[0] + 20, q3[1] - 24, inU(t, a.gain - .1, .5) * out, { size: 24, col: P.halo0, align: 'center' });
    // the cross (two quick strokes) and the verdict
    const x1 = span(t, a.isnt - .05, a.isnt + .14), x2 = span(t, a.isnt + .12, a.isnt + .31);
    if (x1 > 0) {
      ctx.save(); ctx.globalAlpha *= out; ctx.lineCap = 'round';
      const r = 46;
      for (const [u, s] of [[x1, 1], [x2, -1]]) {
        if (u <= 0) continue;
        const ax = ap[0] - r, ay = ap[1] - s * r, bx = lerp(ax, ap[0] + r, expoOut(u)), by = lerp(ay, ap[1] + s * r, expoOut(u));
        ctx.strokeStyle = rgba(P.night0, .6); ctx.lineWidth = 15; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        ctx.strokeStyle = P.halo0; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      }
      ctx.restore();
    }
    const vu = inU(t, a.cake - .15, .6) * out;
    if (vu > 0) maskLine(ctx, [['NOT A CAKE', 0]], ap[0], ap[1] - 70, 44, vu, { serif: false, col: P.cream, glow: true, weight: 600, align: 'center' });
  }
  // 9.02 how fast the price falls: a spark leaves the label's top edge and draws a falling price curve (chart, top left)
  function curve(ctx, t, c, lb) {
    if (t < a.question - .4 || t > a.dollar + 1) return;
    const inn = inU(t, a.question + .2, .8), out = 1 - smooth(span(t, a.y1923 - .4, a.y1923 + .4)), k = inn * out;
    const { x0, x1, y0, y1 } = CH;
    if (k > 0) {
      maskLine(ctx, [['HOW FAST', 0]], x0, y0 - 92, 34, k, { serif: false, col: P.cream, glow: true, weight: 600 });
      maskLine(ctx, [['THE PRICE FALLS', 0]], x0, y0 - 50, 34, clamp(k * 1.2 - .1), { serif: false, col: P.halo0, glow: true, weight: 600 });
      const ax = expoOut(span(t, a.question + .3, a.question + 1.2)) * out;
      ctx.strokeStyle = rgba(P.blue2, .9); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(x0, y1 - (y1 - y0) * ax); ctx.lineTo(x0, y1); ctx.lineTo(x0 + (x1 - x0) * ax, y1); ctx.stroke();
      srcLine(ctx, t, 'PRICE', x0 + 12, y0 + 18, ax, { size: 20 });
      srcLine(ctx, t, 'YEARS', x1, y1 + 32, ax, { size: 20, align: 'right' });
      srcLine(ctx, t, 'OUR ILLUSTRATION', x0, y1 + 64, clamp(k * 1.3 - .3), { size: 19 });
    }
    // the curve, drawn on "how fast the price falls"
    const cu = sineIO(span(t, a.falls - .1, a.fallsE + .7));
    const pts = CURVE.map(([u, v]) => [lerp(x0 + 8, x1 - 10, u), lerp(y1 - 8, y0 + 14, v)]);
    if (cu > 0 && k > 0) trailSpan(ctx, pts, 0, cu, { w: 4.5, spark: cu < 1, a: k });
    // the spark: from the label's top edge up into the curve's start point (the price leaves the label)
    const sp = span(t, a.falls - .75, a.falls - .1);
    if (sp > 0 && sp < 1 && lb) {
      const q = wp(c, -LBL.w * .55, GY + lb.y + lb.sink - LBL.h, LZ); if (!q) return;
      const e = sineIO(sp), [tx, ty] = pts[0], mx = (q[0] + tx) / 2, my = Math.min(q[1], ty) - 90;
      const x = (1 - e) ** 2 * q[0] + 2 * (1 - e) * e * mx + e * e * tx, y = (1 - e) ** 2 * q[1] + 2 * (1 - e) * e * my + e * e * ty;
      halo(ctx, x, y, 50, .85, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.29); ctx.fill();
    }
  }
  // 9.03–9.05 the patent papers of light: insulin (top left, $1 stamps on it) and polio (top right, the owner line stays empty);
  // the polio paper grows into the quote card (Salk) in the centre
  // a paper of light rises out of a line of light (drawn first from its centre out along its bottom edge); it leaves the CALLER's
  // ctx clipped above that line and translated, so the ink drawn after it rises with it (wrap the call in save/restore)
  function paperCard(ctx, r, u) {
    const lu = expoOut(clamp(u / .3)), k = expoOut(clamp((u - .18) / .82)); if (lu <= 0) return null;
    const by = r.y + r.h;
    if (k < 1) { const cx = r.x + r.w / 2, hw = r.w / 2 * lu * 1.04; trailSpan(ctx, [[cx - hw, by], [cx + hw, by]], 0, 1, { w: 3, spark: false, a: 1 - .85 * k }); }
    if (k <= 0) return null;
    ctx.beginPath(); ctx.rect(r.x - 400, r.y - 3000, r.w + 800, r.h + 3000); ctx.clip();
    ctx.translate(0, (1 - k) * (r.h + 12));
    const p = new Path2D(); p.roundRect(r.x, r.y, r.w, r.h, 8);
    halo(ctx, r.x + r.w / 2, r.y + r.h / 2, r.w * .8, .14, P.halo0, P.core1);
    ctx.fillStyle = rad(ctx, r.x + r.w * .3, r.y + r.h * .25, Math.max(r.w, r.h) * 1.1, [[0, P.core0], [.6, P.core1], [1, P.halo1]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.shade0, .6); ctx.lineWidth = 3; ctx.stroke(p);
    return k;
  }
  function papers(ctx, t) {
    if (t < a.y1923 - .8 || t > a.q3 + 1) return;
    const ink = (s, x, y, size, serif, al = 1, wgt = 600) => { if (al <= 0) return; ctx.save(); if (al < 1) { const e = al; ctx.beginPath(); ctx.rect(x - 20, y - size * 1.15, 2000, size * 1.45); ctx.clip(); ctx.translate(0, (1 - e) * size * 1.2); } ctx.font = serif ? `${size}px "Instrument Serif"` : `${wgt} ${size}px Inter`; if (!serif) ctx.letterSpacing = '3px'; ctx.fillStyle = INK; ctx.fillText(s, x, y); ctx.restore(); };
    // paper 1: insulin
    // (it slides in under the growing polio paper before the card comes: it leaves with it, never fades)
    const u1 = span(t, a.y1923 - .5, a.y1923 + .5), m1 = sineIO(span(t, a.q3 - 1.15, a.q3 - .1)), o1 = outU(t, a.q3 - 1.6, .5);
    if (u1 > 0 && t < a.q3 + .2) {
      const cx0 = P1.x + P1.w / 2, cy0 = P1.y + P1.h / 2, sc = lerp(1, .7, m1);
      ctx.save(); ctx.translate(lerp(cx0, 760, m1), lerp(cy0, 540, m1)); ctx.scale(sc, sc); ctx.translate(-cx0, -cy0);
      const k = paperCard(ctx, P1, u1);
      if (k) {
        const l = (d) => clamp(inU(t, a.y1923 + d, .5));
        ctx.save();
        ink('PATENT', P1.x + 34, P1.y + 62, 24, false, l(0));
        ink('Insulin', P1.x + 34, P1.y + 140, 64, true, l(1.4));
        ink('1923', P1.x + 34, P1.y + 210, 52, true, l(.1));
        ctx.fillStyle = rgba(INK, .35 * l(.3)); for (let i = 0; i < 3; i++) ctx.fillRect(P1.x + 34, P1.y + 252 + i * 30, P1.w - 68 - i * 50, 4);
        ink('SOLD FOR', P1.x + 34, P1.y + 370, 22, false, l(2.7));
        ctx.restore();
        K16stamp(ctx, t, '$1', P1.x + 250, P1.y + 352, { t0: a.dollar + .05, size: 58, rot: -.1, ink: mixHex(P.shade0, INK, .35) });
      }
      ctx.restore();
      const su = inU(t, a.dollar + .4) * o1;
      srcLine(ctx, t, 'INSULIN PATENT · 1923', P1.x, P1.y + P1.h + 40, su, { size: 21 });
      srcLine(ctx, t, 'UNIVERSITY OF TORONTO', P1.x, P1.y + P1.h + 68, clamp(su * 1.2 - .1), { size: 21 });
    }
    // paper 2: polio → grows into the quote card (it ends exactly under the card's own first frame and follows its rise, so the
    // card simply takes over the paper's place)
    const q = parseQuote(a.q3text), QW = 1240, QS = 60, QY = 470;
    const u2 = span(t, a.later + .2, a.later + 1.1);
    if (u2 > 0 && t < a.q3 + .9) {
      const words = `“${q.text}”`.split(/\s+/); let nl = 1, cur = [];
      for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.join(' '), QS) > QW - 160) { nl++; cur = [wd]; } else cur = nx; }
      const qh = nl * QS * 1.22 + 190 + 40;
      const cu = rise(span(t, a.q3, a.q3 + .9)), kk = lerp(.94, 1, cu), dy = (1 - cu) * 60;
      const g = sineIO(span(t, a.q3 - 1, a.q3));
      const tw = QW * kk, th = qh * kk, tx = W / 2 - tw / 2, ty = QY + dy - th / 2;
      const r = { x: lerp(P2.x, tx, g), y: lerp(P2.y, ty, g), w: lerp(P2.w, tw, g), h: lerp(P2.h, th, g) };
      ctx.save();
      const k = paperCard(ctx, r, u2);
      if (k) {
        const fade = 1 - smooth(span(t, a.q3 - 1, a.q3 - .55)), l = (d) => clamp(inU(t, a.later + .4 + d, .5)) * fade;
        if (fade > 0) {
          ctx.save();
          ink('PATENT', r.x + 34, r.y + 62, 24, false, l(0));
          ink('Polio vaccine', r.x + 34, r.y + 140, 56, true, smooth(span(t, a.polio - .2, a.polio + .4)) * fade);
          ink('1955', r.x + 34, r.y + 210, 52, true, l(.2));
          ink('OWNER', r.x + 34, r.y + 300, 22, false, smooth(span(t, a.owned - .1, a.owned + .4)) * fade);
          // the owner line stays empty (a dashed line that is drawn and waits; a blinking caret)
          const lu = expoOut(span(t, a.owned + .1, a.owned + .9)) * fade;
          if (lu > 0) { ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = rgba(INK, .7); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(r.x + 34, r.y + 350); ctx.lineTo(r.x + 34 + (r.w - 90) * lu, r.y + 350); ctx.stroke(); ctx.restore();
            ctx.fillStyle = rgba(INK, .8 * fade * F.blink(t, a.owned + .9, 1.06)); ctx.fillRect(r.x + 36, r.y + 318, 4, 28); }
          ctx.restore();
        }
      }
      ctx.restore();
    }
  }
  // 9.05 the quote card (Q3) in the centre: rises from the polio paper, sinks down to the track
  function card(ctx, t) {
    if (t < a.q3 - .1 || t > a.q3e + .2) return;
    const q = parseQuote(a.q3text);
    F.quoteCard(ctx, t, { text: q.text, who: q.who, src: q.src, t0: a.q3, t1: a.q3e - .55, size: 60, w: 1240, y: 470, gold: [['sun?', a.q3 + 2.6]] });
  }
  // 10.02–10.07 the facts (top right), each with its number, rising on its words and sinking when the next one comes
  function facts(ctx, t, c) {
    if (t < a.one - .5 || t > a.t11 + 1.5) return;
    const X = XR, head = (i, s, t0, t1) => { const u = inU(t, t0, .6) * outU(t, t1); if (u > 0) maskLine(ctx, [[`${i} · ${s}`, 0]], X, 150, fitSize(`${i} · ${s}`, 28, 400), u, { serif: false, col: P.halo0, glow: true, weight: 600 }); return u; };
    // 1 · pool the patents: 62 billion doses, 148 countries
    let u = head(1, 'POOL THE PATENTS', a.one - .05, a.two - .5);
    if (u > 0) {
      const cu = inU(t, a.sixty - .15, .8) * outU(t, a.two - .5);
      maskLine(ctx, [['62 BILLION', 0]], X, 250, 72, cu, { serif: true, col: P.cream, glow: true });
      srcLine(ctx, t, 'DOSES · 148 COUNTRIES', X, 294, inU(t, a.poorer - .5) * outU(t, a.two - .5), { size: 24, col: P.cream });
      srcLine(ctx, t, 'MEDICINES PATENT POOL', X, 334, inU(t, a.poorer - .2) * outU(t, a.two - .5), { size: 20 });
      srcLine(ctx, t, '2010–2025 · ANNUAL REPORT', X, 360, inU(t, a.poorer) * outU(t, a.two - .5), { size: 20 });
    }
    // 2 · one flat fee: Louisiana, hepatitis C: treatments rose sharply (a bar rises from the 384 of the year before)
    u = head(2, 'ONE FLAT FEE', a.two - .05, a.three - .5);
    if (u > 0) {
      const o = outU(t, a.three - .5), oo = outO(t, a.three - .5), lu = inU(t, a.louis - .2) * o;
      srcLine(ctx, t, 'LOUISIANA · HEPATITIS C', X, 196, lu, { size: 22, col: P.cream });
      const base = 400, b1 = 26 * expoOut(span(t, a.louis + .2, a.louis + 1)) * oo, b2 = 190 * expoOut(span(t, a.rose - .2, a.rose + 1.1)) * oo;
      if (b1 > 0) { ctx.fillStyle = rgba(P.blue2, .95); ctx.fillRect(X, base - b1, 70, b1); }
      if (b2 > 0) { ctx.fillStyle = lin(ctx, 0, base - b2, 0, base, [[0, P.core1], [1, P.halo0]]); ctx.fillRect(X + 100, base - b2, 70, b2); halo(ctx, X + 135, base - b2, 70, .5 * oo, P.halo0, P.core0); }
      ctx.strokeStyle = rgba(P.blue2, .9 * inU(t, a.louis - .2) * oo); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X - 10, base); ctx.lineTo(X + 190, base); ctx.stroke();
      srcLine(ctx, t, '384', X + 35, base - b1 - 12, inU(t, a.louis + .5) * o, { size: 22, col: P.cream, align: 'center' });
      srcLine(ctx, t, 'BEFORE', X + 35, base + 28, lu, { size: 19, align: 'center' });
      srcLine(ctx, t, 'AFTER', X + 135, base + 28, inU(t, a.rose - .2) * o, { size: 19, align: 'center' });
      maskLine(ctx, [['ROSE SHARPLY', 0]], X + 190, base - 150, 24, inU(t, a.rose + .4) * o, { serif: false, col: P.halo0, glow: true, weight: 600 });
      srcLine(ctx, t, 'FLAT FEE SINCE 2019 · NBER', X, base + 62, inU(t, a.rose + .3) * o, { size: 19 });
    }
    // 3 · let others copy it: Egypt, one hepatitis C treatment, $84,000 (U.S. launch) → $84
    u = head(3, 'LET OTHERS COPY IT', a.three - .05, a.four - .5);
    if (u > 0) {
      const o = outU(t, a.four - .5), cu = inU(t, a.egypt - .2) * o;
      srcLine(ctx, t, 'U.S. LAUNCH PRICE', X, 196, cu * outU(t, a.hundred - .35, .4), { size: 21 });
      srcLine(ctx, t, 'EGYPT · AFTER COPIES', X, 196, inU(t, a.hundred + .15) * o, { size: 21, col: P.cream });
      // $84,000 → the ",000" drops away: $84
      const f = smooth(span(t, a.hundred - .1, a.hundred + .7));
      const m = maskLine(ctx, [['$84', f]], X, 280, 78, cu, { serif: true, col: P.cream, glow: true });
      maskLine(ctx, [[',000', 0]], X + m.w, 280, 78, cu * outU(t, a.hundred - .2, .5), { serif: true, col: P.cream, glow: true });
      srcLine(ctx, t, 'ONE HEPATITIS C TREATMENT', X, 324, cu, { size: 22, col: P.cream });
      srcLine(ctx, t, 'NO COMPOUND PATENT IN EGYPT', X, 362, inU(t, a.hundred + .3) * o, { size: 19 });
      srcLine(ctx, t, 'US$84 PER COURSE · 2018', X, 388, inU(t, a.hundred + .5) * o, { size: 19 });
    }
    // 4 · negotiate for everyone: 33 lights gather into one; makers pay back if it fails
    u = head(4, 'NEGOTIATE FOR EVERYONE', a.four - .05, a.twoMore - .4);
    if (u > 0) {
      const o = outU(t, a.twoMore - .4), oo = outO(t, a.twoMore - .4), g = sineIO(span(t, a.together - .6, a.together + .9));
      const cx = X + 180, cy = 270;
      for (let i = 0; i < 33; i++) {
        const q = inU(t, a.states - .2 + i * .025, .4) * oo; if (q <= 0) continue;
        const col = i % 11, row = Math.floor(i / 11), x0 = X + 12 + col * 34, y0 = 220 + row * 36 + ((col * 7) % 3) * 4;
        const x = lerp(x0, cx, g), y = lerp(y0, cy, g);
        ctx.fillStyle = rgba(mixHex(P.halo0, P.core0, g), q); ctx.beginPath(); ctx.arc(x, y + (1 - q) * 12, 7 * (1 - .4 * g), 0, 6.29); ctx.fill();
      }
      if (g > 0) { halo(ctx, cx, cy, 70 + 50 * g, .8 * g * oo, P.halo0, P.core0); ctx.fillStyle = rgba(P.core0, g * oo); ctx.beginPath(); ctx.arc(cx, cy, 16 * g, 0, 6.29); ctx.fill(); }
      srcLine(ctx, t, '33 STATES · SICKLE CELL', X, 352, inU(t, a.states + .4) * o, { size: 22, col: P.cream });
      maskLine(ctx, [['PAY BACK IF IT FAILS', 0]], X, 400, 28, inU(t, a.payback - .2) * o, { serif: false, col: P.halo0, glow: true, weight: 600 });
      srcLine(ctx, t, 'CMS · CELL & GENE THERAPY', X, 436, inU(t, a.payback + .2) * o, { size: 19 });
      srcLine(ctx, t, 'ACCESS MODEL · 2025', X, 460, inU(t, a.payback + .35) * o, { size: 19 });
    }
    // 5 · the trial on the thread (waiting): goal accepted, money missing
    u = head(5, 'A TRIAL ON THE THREAD', a.trial - .1, a.publicM - .4);
    if (u > 0) {
      const o = outU(t, a.publicM - .4);
      srcLine(ctx, t, 'STILL WAITING', X, 196, inU(t, a.twoMore + .3) * o, { size: 21 });
      maskLine(ctx, [['GOAL ✓ ACCEPTED', 0]], X, 262, 30, inU(t, a.regul + .2) * o, { serif: false, col: P.cream, glow: true, weight: 600 });
      maskLine(ctx, [['MONEY — MISSING', 0]], X, 310, 30, inU(t, a.money) * o, { serif: false, col: COOL.mid, glow: false, weight: 600 });
      srcLine(ctx, t, 'TAME TRIAL · ENDPOINT', X, 350, inU(t, a.money + .3) * o, { size: 19 });
      srcLine(ctx, t, 'AGREED WITH THE FDA', X, 374, inU(t, a.money + .45) * o, { size: 19 });
    }
    // 6 · public money with a promise of access (waiting): a dashed promise line that does not close
    u = head(6, 'PUBLIC MONEY', a.publicM - .1, a.t11 - .1);
    if (u > 0) {
      const o = outU(t, a.t11 - .1), oo = outO(t, a.t11 - .1);
      maskLine(ctx, [['+ A PROMISE OF ACCESS', 0]], X, 220, 26, inU(t, a.promise - .1) * o, { serif: false, col: P.cream, glow: true, weight: 600 });
      srcLine(ctx, t, 'ALMOST NEVER ATTACHED', X, 262, inU(t, a.never + .2) * o, { size: 20, col: COOL.mid });
      // the dashed line from slot 6 toward the label that stops short
      const s6 = wp(c, LEVX[5] + Math.sin(.5) * 440, GY - 100 - Math.cos(.5) * 440, LEVZ), lt = wp(c, LBL.w, GY - LBL.h + 4 * LBL.step - 20, LZ);
      if (s6 && lt) {
        const du = expoOut(span(t, a.promise - .2, a.promise + 1.3)) * (1 - .18 * smooth(span(t, a.never, a.never + 1))) * oo;
        const pts = []; for (let i = 0; i <= 30; i++) { const e = i / 30; pts.push([lerp(s6[0], lt[0], e), lerp(s6[1], lt[1], e) - Math.sin(e * Math.PI) * 120]); }
        const n = Math.max(1, Math.round(.82 * du * 30));
        ctx.save(); ctx.setLineDash([12, 10]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .9 * oo); ctx.lineWidth = 4;
        ctx.beginPath(); for (let i = 0; i <= n; i++) (i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1])); ctx.stroke(); ctx.restore();
        if (du > .05) { ctx.strokeStyle = rgba(P.halo0, .9 * oo); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(pts[n][0], pts[n][1], 9, 0, 6.29); ctx.stroke(); }
      }
    }
  }
}

// the quote card text from timing.json: '“Well, … sun?” — Jonas Salk · See It Now, CBS, 12 April 1955'
function parseQuote(s) {
  if (!s) return { text: 'Well, the people, I would say. There is no patent. Could you patent the sun?', who: 'Jonas Salk', src: 'See It Now, CBS, 12 April 1955' };
  const [q, rest = ''] = s.split(/\s+—\s+/), [who, ...src] = rest.split(/\s+·\s+/);
  return { text: q.replace(/^[“"]\s*/, '').replace(/\s*[”"]$/, ''), who: who.trim(), src: src.join(' · ').trim() };
}
import * as K16 from './f16_kit.mjs';
const K16stamp = (ctx, t, text, x, y, o) => K16.stamp(ctx, t, text, x, y, o);

// one entry per chunk: they all draw the same continuous sequence
const CACHE = new WeakMap();
export function b3Entry(T, R) {
  E.prepareEditorial();
  let d = CACHE.get(T); if (!d) { d = makeB3(T); CACHE.set(T, d); }
  return [{ t: R.a, draw: d, print: F.PRINT20 }];
}
