// c09 · The pigs, the feeling, the paradox · built by B3. 'Now think back to those pigs' → 'Twenty thirty. Day one'.
// Plan: docs/shots.md 9.01–9.14 · world/rules: docs/MOTION.md · seams: plateBarn (B2 → B3, lib/f24_seams.mjs) at the start, and the
// barn of lib/f24_b3_parts.mjs (barnPart) at the end (c10 draws the same function from the same (t, T)).
// ONE entry, one continuous take, one planned rhyme cut (✂ 9.07: the barn medallion's circle = the record):
//   plateBarn → the slow push to pig 2 → the camera RISES out of the barn into a shelf of plant burgers and oat milk (same stage) →
//   the shelf shrinks into the Europe pig pin's medallion, the night map opens: Germany → 100 figures grow out of the Germany pin,
//   9 light (NO MEAT · 9 IN 100), AGE 14–29: 20 → the grid turns: 91 warm (EATS MEAT) → its ground line becomes a balance:
//   TASTE · PRICE in one pan; a heart with an ear rises out of the pig medallion into the other, the beam tips (FEELING) →
//   the map pushes into the pig pin: the barn from outside, its calls die on the walls ✂ the same circle is a 1970 record; it tilts
//   into the side view, the needle drops, a pig's call floats out and the camera follows it into a kitchen today (the question) →
//   the kitchen shrinks into the pig pin, one flight to Iceland: the whaling ship leaves (ICELAND · JUNE 2026 · FIN WHALES) →
//   one flight back into the barn: you at the fence; THE MEAT PARADOX, two bubbles out of your head; PIG 2's MIND bead sinks
//   (BASTIAN ET AL. 2012); "it's human": a heart rises out of you and shrinks back; the [translating…] bar returns, the strip beside it.
//
// | ID   | anchor (phrase)                     | picture (one idea)                                         | move / carrier                 |
// |------|-------------------------------------|------------------------------------------------------------|--------------------------------|
// | 9.01 | Now think back to those pigs        | plateBarn, slow push to pig 2                              | push                           |
// | 9.02 | Today, going without meat           | the camera rises out of the barn: the shelf                | rise (one stage)               |
// | 9.03 | In Germany, about nine · under-30   | shelf → pig pin, map; grid of 100 out of the Germany pin   | zoom out · grid                |
// | 9.04 | Still, nine in ten                  | the grid turns: 91 warm, EATS MEAT                         | flip                           |
// | 9.05 | Maybe the products                  | the ground line becomes a balance: TASTE · PRICE           | line → beam                    |
// | 9.06 | Or maybe … a feeling · Most of us   | a heart out of the pig pin tips it; push into the pig pin  | heart arc · push               |
// | 9.07✂| Now imagine a machine               | the medallion = the record; needle; the call floats out    | circle rhyme · tilt · follow   |
// | 9.08 | Could that make vegetarian          | the kitchen today, the call fills it; the question         | line rises                     |
// | 9.09 | Maybe. But even for whales          | kitchen → pig pin → Iceland: the whaler leaves             | one flight · iris              |
// | 9.10 | There's also … meat paradox         | flight back into the barn; bubbles out of your head        | one flight · bubbles           |
// | 9.11 | Remind people that farm animals     | PIG 2's card: the MIND bead sinks · BASTIAN ET AL. 2012    | card                           |
// | 9.12 | That's not hypocrisy. It's human.   | you at the fence; a heart rises out of you                 | push to you                    |
// | 9.13 | So maybe a feeling isn't enough     | the heart shrinks back                                     | shrink                         |
// | 9.14 | But what if … in words?             | the [translating…] bar returns, the strip beside it        | bar rises · strip glides       |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f24_kit.mjs';
import * as K from '../lib/f24_b3_kit.mjs';
import * as S from '../lib/f24_b3_sets.mjs';
import { A3, harbourPart, barnPart, ZR_EU, ICE } from '../lib/f24_b3_parts.mjs';
import { plateBarn, SEAM_HALF, CREEP } from '../lib/f24_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, prng } = E;
const { rise, maskLine, measure } = F;

export const PRINT = F.PRINT24;
export default async (T, R) => { E.prepareEditorial(); return [{ t: R.a, draw: scene(A3(T), T, R), print: PRINT }]; };

const PIG = K.PIG, GER = F.PIN.germany;
const ZG = 5.2, VG = F.mapView(24.8, 50.48, ZG);       // Germany on the left third, the grid to its right
const GX0 = 800, GDX = 58, GY0 = 352, GDY = 56, GH = 40, GROUND = 878, TX = 1424;
const LIT = (() => { const r = prng(2461), idx = [...Array(100).keys()]; for (let i = 99; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return { nine: new Set(idx.slice(0, 9)), twenty: new Set(idx.slice(0, 20)) }; })();
const backOut = (x, s = 1.3) => { x = clamp(x); return 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2; };
const PIVOT = [1061, 560], ARM = 290, STRING = 150;

function scene(a, T, R) {
  const T0 = a.back, s0 = 1 + CREEP * (2 * SEAM_HALF);   // plateBarn's camera scale at T0 + .5 (it creeps CREEP per second)
  // ---- the barn stage: the push to pig 2, the rise into the shelf
  const tz0 = a.easierE + .05, tz1 = tz0 + 4.2, ZO = K.bez(.8, 0, .3, 1);
  const camB = K.glide([
    [T0 + SEAM_HALF, { u: 960, v: 540, s: s0 }],
    [a.pigsE - .3, { u: 1150, v: 592, s: 1.3 }],
    [a.pigsE + 1.45, { u: 1020, v: 540 - S.SHELF_UP * .62, s: .74 }],   // the rise: the camera backs off on the way up
    [a.easierE - .4, { u: 966, v: 540 - S.SHELF_UP + 40, s: .86 }],
    [tz0, { u: 960, v: 540 - S.SHELF_UP + 20, s: .93 }],              // a soft arrival under the light strip
    [tz1, { u: 960, v: 540 - S.SHELF_UP, s: 1.0 }],
  ], { u: 0, v: 0, ls: CREEP / s0 });
  const driftB = (t) => 1.6 * sineIO(span(t, T0 + SEAM_HALF, T0 + 2.6));
  const barnStage = (ctx, t, k = 1) => {   // k: the inner camera leans in while the medallion closes (the content shrinks slower)
    const p = camB(t), c = K.camAt(k === 1 ? p : { ...p, s: p.s * k }, t, driftB(t), 5);
    const lift = Math.sin(Math.PI * span(t, T0 + .7, T0 + 2.4));
    F.barnCast(ctx, c, t, { you: false, p2: { head: .22 * lift, open: .25 * Math.sin(Math.PI * span(t, T0 + 1.1, T0 + 1.8)) } });
    S.shelf(ctx, c, t);
  };
  // ---- the map: zoom out of the pig medallion, Germany, the push back into the pig pin
  const V0 = K.inView(PIG.lon, PIG.lat, ZG), tp0 = a.most - .2, tp1 = a.imagine - .12;
  const RP = 262, tpA = a.most + 1.8;   // the medallion reaches its rhyme size early, then only creeps (the record takes over at RP)
  const VP = K.viewForHead(PIG.lon, PIG.lat, ZG, 236), VP2 = K.viewForHead(PIG.lon, PIG.lat, ZG, RP);
  const vGer = (t) => F.mapView(VG.lon, VG.lat, VG.z * (1 + .014 * Math.max(0, t - tz1)));
  const mapV = (t) => (t < tz1 ? F.flight(V0, VG, ZO(span(t, tz0, tz1))) : t < tp0 ? vGer(t) : t < tpA ? F.flight(vGer(tp0), VP, sineIO(span(t, tp0, tpA))) : F.flight(VP, VP2, span(t, tpA, a.imagine)));
  const pigInner = (t) => (t < a.still ? barnStage : (ctx, tt) => S.barnOutside(ctx, tt, { k: 1.7 }));
  // ---- the record → kitchen stage (after the rhyme cut)
  const REC0 = { u: S.REC.x, v: S.REC.y, s: RP / S.REC.r };
  const tw0 = a.does + .6, tw1 = tw0 + .8, tw2 = a.whalesE;
  const camR = K.glide([
    [a.imagine, REC0], [a.imagine + 2.1, { u: 740, v: 560, s: 1.08 }], [tw1, { u: 800, v: 545, s: 1.04 }],
    [tw2 + .15, { u: 1960, v: 528, s: 1.0 }], [a.rightsE + .5, { u: 1960, v: 548, s: 1.1 }], [a.summer, { u: 1960, v: 548, s: 1.16 }],
  ]);
  const wave = (t) => {
    if (t < tw0) return null;
    const g = span(t, tw0, tw1), f = sineIO(span(t, tw1, tw2)), x0 = 742, y0 = 600;
    const x = t < tw1 ? lerp(x0, 770, sineIO(g)) : lerp(770, 1960, f), y = t < tw1 ? lerp(y0, 440, sineIO(g)) : lerp(440, 432, f) - 92 * Math.sin(Math.PI * f);
    return { x, y, w: lerp(200, 420, f), h: lerp(70, 128, f), u: span(t, tw0, tw0 + .9) };
  };
  const recStage = (ctx, t) => S.recordKitchen(ctx, K.camAt(camR(t), t, 1.5 * sineIO(span(t, a.imagine, a.imagine + 1.2)), 7), t, {
    tilt: lerp(1, .3, sineIO(span(t, a.imagine + .15, a.imagine + 1.9))), arm: span(t, a.imagine + 1.4, a.does + .1), drop: span(t, a.does + .15, a.does + .6),
    wave: wave(t), fill: span(t, tw2 - .1, tw2 + 1.4), look: sineIO(span(t, tw2 - .3, tw2 + 1.0)),
  });
  // ---- Iceland and the barn (lib)
  const harb = harbourPart(a), barn = barnPart(a, T);
  const th0 = a.maybeW + .05, th1 = a.summer + .45, PIG_IN = K.inView(PIG.lon, PIG.lat, ZR_EU), ICE_IN = K.inView(ICE.lon, ICE.lat, ZR_EU);

  // ===== the grid, the text, the balance (screen layer over the map)
  function grid(ctx, t, v) {
    const [gx, gy] = F.mapXY(v, GER.lon, GER.lat), org = [gx, gy - F.STALK];
    const tb = tz1 - .85, flip0 = a.nineTen + .05, sink0 = a.products - .05;
    const dim = mixHex(P.blue1, P.ind2, .35), warm = mixHex(P.halo1, P.shade0, .2), cool = mixHex(P.blue0, P.ind2, .3);
    // the ground line under the grid (it becomes the balance's beam)
    const gu = expoOut(span(t, tb + .2, tb + 1.2));
    if (t < a.products + .3 && gu > 0) { ctx.strokeStyle = rgba(P.cream, .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1061 - 285 * gu, GROUND); ctx.lineTo(1061 + 285 * gu, GROUND); ctx.stroke(); }
    for (let i = 0; i < 100; i++) {
      const c = i % 10, r = Math.floor(i / 10), x = GX0 + c * GDX, y = GY0 + r * GDY;
      const d = clamp(Math.hypot(x - org[0], y - org[1]) / 1000), u = expoOut(span(t, tb + d * .9, tb + d * .9 + .5)); if (u <= 0) continue;
      const sk = expoIn(span(t, sink0 + (9 - r) * .045, sink0 + (9 - r) * .045 + .4)); if (sk >= 1) continue;
      const l9 = LIT.nine.has(i), l20 = LIT.twenty.has(i), j = [...LIT.twenty].indexOf(i);
      const on1 = l9 ? span(t, a.noMeat + .1 + j * .05, a.noMeat + .5 + j * .05) : l20 ? span(t, a.five + .05 + (j - 9) * .06, a.five + .45 + (j - 9) * .06) : 0;
      const f = span(t, flip0 + c * .06 + r * .012, flip0 + c * .06 + r * .012 + .42), sx = Math.max(.08, Math.abs(Math.cos(Math.PI * f)));
      const col = f < .5 ? mixHex(dim, P.cream, on1) : (l9 ? cool : warm);
      ctx.save(); ctx.beginPath(); ctx.rect(x - 30, y - GH - 14, 60, GH + 14); ctx.clip();
      ctx.translate(x, y + (1 - u) * GH * 1.15 + sk * GH * 1.15); ctx.scale(sx, 1);
      if (f < .5 && on1 > 0) halo(ctx, 0, -GH * .5, 34, .16 * on1, P.halo2, P.cream);
      if (f >= .5 && !l9) halo(ctx, 0, -GH * .5, 30, .1, P.halo1, P.core1);
      K.fig(ctx, 0, 0, GH, col); ctx.restore();
    }
    // the text column: NO MEAT · 9 → 20 IN 100 · AGE 14–29, then EATS MEAT
    const out1 = 1 - expoIn(span(t, a.still - .15, a.still + .35));
    K.capsLine(ctx, 'NO MEAT', TX, 420, 32, rise(span(t, a.noMeat, a.noMeat + .6)) * out1, { col: P.cream });
    const n9 = rise(span(t, a.noMeat + .3, a.noMeat + .9)) * (1 - expoIn(span(t, a.five - .1, a.five + .25))) * out1, n20 = rise(span(t, a.five + .28, a.five + .9)) * out1;
    if (n9 > 0) maskLine(ctx, [['9', 0]], TX, 590, 150, n9, {});
    if (n20 > 0) maskLine(ctx, [['20', 0]], TX, 590, 150, n20, {});
    const nw = lerp(measure('9', 150, true), measure('20', 150, true), sineIO(span(t, a.five + .05, a.five + .4)));
    K.capsLine(ctx, 'IN 100', TX + nw + 16, 586, 28, rise(span(t, a.noMeat + .45, a.noMeat + 1.05)) * out1, { col: P.halo2 });
    K.capsLine(ctx, 'AGE 14–29', TX, 664, 26, rise(span(t, a.among + .1, a.among + .7)) * out1, { col: P.cream });
    K.capsLine(ctx, 'EATS MEAT', TX, 420, 32, rise(span(t, a.nineTen + .7, a.nineTen + 1.3)) * (1 - expoIn(span(t, a.products - .1, a.products + .35))), { col: mixHex(P.cream, P.halo1, .6) });
  }
  function balance(ctx, t, v) {
    const m = sineIO(span(t, a.products + .25, a.products + 1.15)); if (m <= 0) return;
    const sinkU = expoIn(span(t, a.most - .25, a.most + .4)); if (sinkU >= 1) return;
    const heartLand = a.feeling + .2;
    const th = -.12 * backOut(span(t, a.cheap + .25, a.cheap + 1.2)) + .29 * backOut(span(t, heartLand, heartLand + 1.2));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, GROUND + 2); ctx.clip(); ctx.translate(0, sinkU * 700);
    const cx = PIVOT[0], cy = lerp(GROUND, PIVOT[1], m), half = lerp(285, ARM, m), L = [cx - half * Math.cos(th), cy - half * Math.sin(th)], Rr = [cx + half * Math.cos(th), cy + half * Math.sin(th)];
    ctx.strokeStyle = P.cream; ctx.lineCap = 'round'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...L); ctx.lineTo(...Rr); ctx.stroke();
    halo(ctx, cx, cy, 300, .12 * m, P.halo2, P.cream);
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, GROUND); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.fillStyle = P.cream; ctx.beginPath(); ctx.moveTo(cx - 46 * m, GROUND); ctx.lineTo(cx + 46 * m, GROUND); ctx.lineTo(cx + 14, GROUND - 22 * m); ctx.lineTo(cx - 14, GROUND - 22 * m); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, 8, 0, 7); ctx.fill();
    const pu = expoOut(span(t, a.products + .95, a.products + 1.55)), sl = STRING * pu, pans = [];
    for (const e of [L, Rr]) {
      if (pu <= 0) break;
      const py = e[1] + sl; ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[0] - 70 * pu, py); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[0] + 70 * pu, py); ctx.stroke();
      ctx.fillStyle = rgba(mixHex(P.night0, P.ind1, .5), .9); ctx.strokeStyle = P.cream; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(e[0], py, 90 * pu, 26 * pu, 0, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke();
      pans.push([e[0], py]);
    }
    if (pans.length === 2) {
      const tag = (txt, x, y, u) => { if (u <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(x - 70, y - 50, 140, 50); ctx.clip(); ctx.translate(0, (1 - expoOut(u)) * 48);
        const w = measure(txt, 20, false) * 1.18 + 26; ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .95); ctx.strokeStyle = rgba(P.cream, .75); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x - w / 2, y - 40, w, 36, 18); ctx.fill(); ctx.stroke();
        E.glowText(ctx, txt, x, y - 15, { size: 20, weight: 600, align: 'center', col: P.cream, glow: false, spacing: .12 }); ctx.restore(); };
      tag('TASTE', pans[0][0] - 44, pans[0][1], span(t, a.good + .05, a.good + .6));
      tag('PRICE', pans[0][0] + 44, pans[0][1], span(t, a.cheap + .05, a.cheap + .6));
      // the heart: out of the pig medallion, along an arc into the right pan
      const hu = span(t, a.orMaybe + .2, heartLand); if (hu > 0) {
        const mh = K.medHead(v, PIG.lon, PIG.lat, ZG), k = sineIO(hu), dst = [pans[1][0], pans[1][1] - 34];
        const x = lerp(mh.cx, dst[0], k), y = lerp(mh.cy, dst[1], k) - 260 * Math.sin(Math.PI * k);
        K.heartEar(ctx, t, x, y, lerp(22, 64, expoOut(hu)), {});
        K.capsLine(ctx, 'FEELING', dst[0], pans[1][1] + 56, 22, rise(span(t, heartLand + .2, heartLand + .8)), { align: 'center', col: mixHex(P.cream, P.halo1, .5) });
      }
    }
    ctx.restore();
  }
  function mapPart(ctx, t) {
    const v = mapV(t), inner = pigInner(t), rP = K.medHead(v, PIG.lon, PIG.lat, ZG).r, kIn = (clamp(rP, F.RF / 6, F.RF) / F.RF) ** .3;
    const gl = rise(span(t, tz1 - .5, tz1 + .3)) * (1 - expoIn(span(t, a.still - .3, a.still + .2)));
    K.mapWith(ctx, t, T, v, [{ id: 'pigs', lon: PIG.lon, lat: PIG.lat, kind: 'other', zref: ZG, scene: (c2) => inner(c2, t, kIn) }], { labels: { germany: gl } });
    if (t < tp0 + .6) { grid(ctx, t, v); balance(ctx, t, v); }
  }

  return (ctx, t) => {
    if (t < T0 + SEAM_HALF) { plateBarn(ctx, t, T); return; }   // the seam: the same plate as B2's last half second
    if (t < tz0) barnStage(ctx, t);
    else if (t < a.imagine) mapPart(ctx, t);
    else if (t < th0) { recStage(ctx, t); F.questionLine(ctx, t, a.could + .15, a.rightsE + .05, { text: 'Mainstream? New rights?', y: 172, size: 58 }); }
    else if (t < th1) {   // one flight: the kitchen shrinks into the pig pin, Iceland's medallion opens
      const v = F.flight(PIG_IN, ICE_IN, K.HOP(span(t, th0, th1)));
      K.mapWith(ctx, t, T, v, [
        { id: 'pigs', lon: PIG.lon, lat: PIG.lat, kind: 'other', zref: ZR_EU, scene: (c2) => recStage(c2, t) },
        { ...ICE, zref: ZR_EU, grow: span(t, th0 + 1.0, th0 + 1.9), scene: (c2, O) => harb.world(c2, t, O) },
      ]);
    } else if (t < barn.hop2[0]) harb.world(ctx, t, null);
    else if (t < barn.hop2[1]) {   // one flight back: Iceland closes into its pin, the pig pin opens onto the barn
      const v = F.flight(ICE_IN, PIG_IN, K.HOP(span(t, barn.hop2[0], barn.hop2[1])));
      K.mapWith(ctx, t, T, v, [
        { ...ICE, zref: ZR_EU, scene: (c2, O) => harb.world(c2, t, O) },
        { id: 'pigs', lon: PIG.lon, lat: PIG.lat, kind: 'other', zref: ZR_EU, scene: (c2, O) => barn.world(c2, t, K.camAt(barn.inner(t, K.medHead(v, PIG.lon, PIG.lat, ZR_EU).r), t, 1.6, 9), O) },
      ]);
    } else barn.world(ctx, t, K.camAt(barn.cam(t), t, 1.6, 9), null);
    F.strip(ctx, t, T, barn.stripState(t) || {});
  };
}
