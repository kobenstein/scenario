// c06 · The tour III · Dominica, Bahamas, Berkeley · the empty middle · B2. T.G('In the Caribbean') → T.G('Why is meaning so hard').
// Plan: docs/shots.md 6.01–6.14 · world/rules: docs/MOTION.md · shared: lib/f24_b2_*.mjs (the barn → Dominica flight is shared with c05,
// the bar field with c07).
// ONE entry, one continuous take: the barn closes into its pin, the map flies to Dominica (shared with c05) → into the Dominica
// medallion: deep blue, the sperm whale sinks and clicks; a click row with four sliders RHYTHM · TEMPO · STRETCH · EXTRA CLICK → mixed:
// the variants fan out, fold back → out onto the map, a bead of light: PARTS; the gold California pin pulses → a short flight to Bimini,
// the Bahamas pin with an autocomplete card for whistles (DolphinGemma) → into a large medallion: dolphins, the diver with her
// recorder, 40 YEARS → the medallion grows into the clip plate [C3] and shrinks back → out onto the map: a small cream listener drinks
// the dolphin call (NEXT SOUND), the gold listener at California drinks every species → flight to Berkeley: the finch medallion opens
// wider, two calls: COUCH / SOFA, two different waves fall into one shared sign → IT'S THERE → pull back to the world, all pins lit,
// the slots flash on "names, feelings, what's going on" → the tablet glides to the centre, its empty middle becomes the bar (→ c07).
//
// | ID   | anchor (phrase)                    | picture (one idea)                                                 | move / carrier            |
// |------|------------------------------------|--------------------------------------------------------------------|---------------------------|
// | 6.01 | In the Caribbean                   | barn → pin, flight to Dominica, OTHER TEAM · DOMINICA · PROJECT CETI | flight (shared with c05)  |
// | 6.02 | They found that the clicks         | iris into deep blue: the whale sinks; clicks + four sliders         | zoom in · sliders         |
// | 6.03 | Mixed together                     | the variants fan out                                                | fan                       |
// | 6.04 | Good news for the California       | pull back; a bead → PARTS; the gold pin pulses                      | zoom out · bead · slot    |
// | 6.05 | Up north, in the Bahamas           | flight to Bimini; autocomplete card with whistles; DolphinGemma     | flight · card             |
// | 6.06 | It learned from recordings         | into a large medallion: dolphins, the diver, 40 YEARS               | zoom in                   |
// | 6.07 | Here's what she hopes for          | the medallion grows into the clip plate                             | medallion → plate         |
// | 6.08 | [C3]                               | Denise Herzing · ORIGINAL FOOTAGE                                   | clip                      |
// | 6.09 | Google's model is built            | small cream listener + one dolphin vs gold listener + many species | listeners · bead · slot   |
// | 6.10 | Back in California                 | flight to Berkeley; the finch medallion; two finch calls            | flight · calls            |
// | 6.11 | Like "couch" and "sofa"            | COUCH / SOFA: two waves, one shared sign                            | merge                     |
// | 6.12 | So the meaning is there            | a bead → IT'S THERE                                                 | slot                      |
// | 6.13 | But the machines                   | the whole map, all pins lit; the slots flash on their words         | pull back                 |
// | 6.14 | Not one of them                    | the tablet to the centre; its empty middle becomes the bar          | slot → bar                |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f24_kit.mjs';
import * as B from '../lib/f24_b2_world.mjs';
import * as Hb from '../lib/f24_b2_habitats.mjs';
import { barnPart, barnTimes, DOM_VIEW, domHold } from '../lib/f24_b2_c56.mjs';
import { wallTimes, barMap, bar, worldView, BAR_AT } from '../lib/f24_b2_c67.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, prng } = E;
const { rise } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { ...barnTimes(T), ...wallTimes(T), end: R.b };
  a.built = G('built from a few parts', a.found); a.rhythm = G('rhythm', a.found); a.tempo = G('tempo', a.found);
  a.mixed = G('Mixed together'); a.kinds = G('far more kinds', a.mixed); a.expectedE = GE('than expected', a.mixed);
  a.good = G('Good news for the California'); a.calTeam = G('California team', a.good); a.learnP = G('parts can be learned'); a.learnPE = GE('parts can be learned');
  a.upnorth = G('Up north, in the Bahamas'); a.bah = G('in the Bahamas', a.upnorth); a.google = G('Google has joined in', a.upnorth);
  a.its = G('Its A.I. plays that autocomplete'); a.auto = G('autocomplete', a.its); a.dolS = G('dolphin sounds', a.its); a.dolSE = GE('dolphin sounds', a.its);
  a.rec = G('It learned from recordings'); a.decades = G('four decades', a.rec); a.decadesE = GE('four decades', a.rec);
  a.hopes = G("Here's what she hopes for"); a.c3 = F.clipWin(T, 'C3');
  a.gm = G("Google's model is built for dolphins"); a.gmDol = G('dolphins', a.gm);
  a.espw = G('The Earth Species Project wants one'); a.every = G('every species', a.espw); a.everyE = GE('every species', a.espw);
  a.back = G('Back in California, another'); a.zebra = G('zebra finches', a.back); a.sortC = G('sort their calls', a.back); a.soundE = GE('more than by sound', a.back);
  a.couch = G('couch', a.soundE - .1); a.sofa = G('sofa', a.couch); a.diff = G('different sounds', a.couch); a.same = G('same thing', a.couch); a.sameE = GE('same thing', a.couch);
  a.there = G('So the meaning is there'); a.birds = G('The birds hear it'); a.birdsE = GE('The birds hear it');
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT24 }];
};

// ===================================================================================================== Dominica: clicks and sliders
// a click coda as spikes (screen px): params { rhythm, tempo, stretch, extra } 0..1 morph the pattern
function coda(ctx, t, x0, y, L, p, u = 1, o = {}) {
  const A = [0, 1, 2, 3, 4], Bp = [0, .55, 1.1, 2.35, 2.9], pos = A.map((v, i) => lerp(v, Bp[i], p.rhythm));
  const n = 5 + (p.extra > .02 ? 1 : 0), out = [];
  for (let i = 0; i < n; i++) {
    let q = i < 5 ? pos[i] : pos[4] + .55;
    q *= lerp(1.15, .72, p.tempo); q += p.stretch * .12 * i * i;
    out.push(q);
  }
  const sc = L / 5.2;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + L * u, y); ctx.stroke();
  out.forEach((q, i) => {
    const x = x0 + q * sc; if (x > x0 + L * u + 1) return;
    const hh = (i === 5 ? 30 * p.extra : 46) * (o.h ?? 1) * (.92 + .08 * Math.sin(t * 6 + i));
    ctx.strokeStyle = i === 5 ? P.halo0 : (o.col ?? P.cream); ctx.lineWidth = (o.lw ?? 5) * (1 + p.stretch * .25);
    ctx.beginPath(); ctx.moveTo(x, y - hh); ctx.lineTo(x, y + hh); ctx.stroke();
  });
  ctx.restore();
}
const SLIDERS = [['RHYTHM', 'rhythm', .82], ['TEMPO', 'tempo', .25], ['STRETCH', 'stretch', .7], ['EXTRA CLICK', 'extra', 1]];
const FANP = (() => { const r = prng(2601), s = []; for (let i = 0; i < 6; i++) s.push({ rhythm: r(), tempo: r(), stretch: r() * .9, extra: r() < .5 ? 1 : 0 }); return s; })();

function scene(a, T) {
  const DOMI = F.PIN.dominica, tabAt = B.tabAt(T);
  // ---- the map tracks
  const zRefD = domHold(a.dz0, a).z, V0D = B.medView('dominica', zRefD);
  const CAR = F.mapView(-93, 27.5, 2.55), do0 = a.good - .25, do1 = do0 + 2.7, V0D2 = B.medView('dominica', CAR.z);
  const carHold = (t) => B.crept(CAR, 1 + .012 * Math.max(0, t - do1));
  const BAH = F.mapView(-74.5, 24.3, 6.2), fb0 = a.upnorth - .1, fb1 = fb0 + 2.7;
  const bahHold = (t) => B.crept(BAH, 1 + .012 * Math.max(0, t - fb1));
  // the large Bahamas medallion (not full frame: it grows into the clip plate): centre MB, radius RB
  const zb0 = a.rec - .15, zb1 = zb0 + 2.8, zRefB = bahHold(zb0).z, RB = 300, MB = [720, 478];
  const VB = (() => {
    const p = F.PIN.bahamas, z = zRefB * RB / F.PIN_R, km = z * W / 360, k = sineIO(clamp((RB - F.RF) / (F.PIN_R - F.RF) * 1.25 - .25)), off = (F.STALK + RB) * k;
    return F.mapView(p.lon - (MB[0] - W / 2) / km, p.lat + (MB[1] + off - H / 2) / km, z);
  })();
  const pm0 = a.hopes, pm1 = a.c3.start, pb0 = a.c3.end, pb1 = pb0 + .9;     // medallion → plate → medallion
  const CB = F.mapView(-101, 31.5, 3.25), zo0 = pb1, zo1 = zo0 + 2.3;
  const cbHold = (t) => B.crept(CB, 1 + .012 * Math.max(0, t - zo1));
  const CAL = F.mapView(-120.6, 36.4, 7.0), fc0 = a.back - .05, fc1 = fc0 + 2.7;
  const calHold = (t) => B.crept(CAL, 1 + .012 * Math.max(0, t - fc1));
  const wv0 = a.wv0, wv1 = a.wv1;

  // ---- Dominica: the whale sinks through the light shaft; the camera pulls back to make room for the sliders
  const DK = [[a.dz0, F.aim(F.F0, 870, 520, 1.5)], [a.dz1, F.aim(F.F0, 900, 540, 1.12)], [a.mixed, F.aim(F.F0, 960, 545, 1.02)], [a.expectedE, F.aim(F.F0, 990, 548, 1.06)], [do1, F.aim(F.F0, 940, 540, 1.3)]];
  const dCam = (t) => B.stageCam(t, DK, 1.4 * span(t, a.dz0, a.dz1), 7);
  const sl = (k, t0) => sineIO(span(t, t0, t0 + .7));
  function dominica(ctx, t, c) {
    const wx = 640, wy = lerp(440, 560, span(t, a.dz0, do1)), wh = 108;
    let head = null;
    Hb.deepSea(ctx, c, t, {
      far: () => F.spermWhale(ctx, t, 420 + 30 * Math.sin(t * .05), 860, 38, { dir: -1, light: 1, warm: .1, seed: 4, tilt: .05, a: .6 }),
      cast: () => {
        const w = F.spermWhale(ctx, t, wx, wy, wh, { dir: 1, light: -1, warm: .35, seed: 2, tilt: .14 });
        head = w.head;
        // the clicks leave the head as thin sonar arcs (rhythm of the coda)
        for (let k = 0; k < 10; k++) {
          const t0 = a.dz0 + .4 + k * .62, u = span(t, t0, t0 + 1.4); if (u <= 0 || u >= 1) continue;
          ctx.save(); ctx.strokeStyle = rgba(P.cream, .45 * (1 - u)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(head[0], head[1], 20 + 220 * expoOut(u), -.5, .5); ctx.stroke(); ctx.restore();
        }
      },
    });
  }
  function sliders(ctx, t) {
    const x0 = 1040, L = 640, cy = 300, gu = B.win(t, a.built - .2, a.mixed - .2);
    const P0 = { rhythm: 0, tempo: .55, stretch: 0, extra: 0 };
    const tgt = { rhythm: a.rhythm, tempo: a.tempo, stretch: a.tempo + .5, extra: a.tempo + .95 };
    const p = {}; for (const [, k, v] of SLIDERS) p[k] = lerp(P0[k], v, sineIO(span(t, tgt[k] - .15, tgt[k] + .55)));
    const mixing = span(t, a.mixed - .2, a.mixed + .5) * (1 - span(t, a.expectedE - .7, a.expectedE - .1));
    if (mixing > 0) { p.rhythm = lerp(p.rhythm, .5 + .45 * Math.sin(t * 2.1), mixing); p.tempo = lerp(p.tempo, .5 + .4 * Math.sin(t * 1.7 + 1), mixing); p.stretch = lerp(p.stretch, .4 + .35 * Math.sin(t * 2.6 + 2), mixing); }
    const ru = rise(span(t, a.found - .1, a.found + .7));
    const fold = span(t, a.expectedE - .5, a.expectedE + .3), fan = sineIO(span(t, a.mixed + .05, a.kinds + .6)) * (1 - sineIO(fold));
    const out = span(t, do0 - .5, do0 + .1);
    B.sink(ctx, cy + 70, out, 160, () => {
      if (ru > 0) B.caps(ctx, 'CLICKS', x0, cy - 64, 26, ru, { col: P.halo2 });
      coda(ctx, t, x0, cy, L, p, sineIO(span(t, a.found, a.found + 1.1)));
      // the fan: the variants slide out of the main row, one under the other (far more kinds of calls)
      FANP.forEach((q, i) => {
        const f = clamp(fan * 1.5 - i * .06); if (f <= 0) return;
        const yy = cy + (i + 1) * 62 * sineIO(f), qq = { rhythm: lerp(p.rhythm, q.rhythm, f), tempo: lerp(p.tempo, q.tempo, f), stretch: lerp(p.stretch, q.stretch, f), extra: lerp(p.extra, q.extra, f) };
        coda(ctx, t, x0 + 30 * i * f, yy, L * (1 - .06 * i * f), qq, 1, { h: .5, lw: 4, col: mixHex(P.cream, P.halo2, .25 + .1 * i) });
      });
    });
    // the four sliders under the row (they sink as the variants fan out)
    B.sink(ctx, cy + 380, span(t, a.mixed - .25, a.mixed + .35), 260, () => {
      SLIDERS.forEach(([lab, k], i) => {
        const y = cy + 110 + i * 66, su = gu * rise(span(t, a.built + i * .09, a.built + .7 + i * .09)); if (su <= 0) return;
        B.caps(ctx, lab, x0, y + 10, 26, su, { col: P.cream });
        const tx0 = x0 + 230, tx1 = x0 + L;
        ctx.save(); ctx.strokeStyle = rgba(P.blue1, .9 * su); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tx0, y); ctx.lineTo(lerp(tx0, tx1, expoOut(su)), y); ctx.stroke();
        const kx = lerp(tx0, tx1, p[k]), act = Math.sin(Math.PI * span(t, tgt[k] - .15, tgt[k] + .7));
        if (su > .6) { halo(ctx, kx, y, 30 + 20 * act, .25 + .4 * act, F.CREAM.body, F.CREAM.core); ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(kx, y, 10, 0, 7); ctx.fill(); }
        ctx.restore();
      });
    });
  }
  function dominicaAll(ctx, t) { dominica(ctx, t, dCam(t)); sliders(ctx, t); }

  // ---- Bahamas: clear water, two dolphins and the diver with her recorder
  const BK = [[zb0, F.aim(F.F0, 790, 500, 2.3)], [pm0, F.aim(F.F0, 860, 505, 2.05)], [pm1, F.aim(F.F0, 1010, 520, 1.15)], [pb0, F.aim(F.F0, 1040, 520, 1.22)], [pb1, F.aim(F.F0, 820, 505, 2.2)], [zo1, F.aim(F.F0, 800, 505, 2.3)]];
  const bCam = (t) => B.stageCam(t, BK, 1.2, 9);
  function bahamas(ctx, t) {
    const c = bCam(t);
    Hb.clearWater(ctx, c, t, { cast: () => {
      const s = t * .05;
      F.dolphin(ctx, t, 640 + 120 * Math.sin(s * 2.3), 470 + 40 * Math.sin(t * .4), 82, { dir: 1, light: 1, warm: .3, seed: 2, tilt: -.06 + .05 * Math.sin(t * .4 + 1), swim: 1.1 });
      F.dolphin(ctx, t, 1000 + 90 * Math.sin(s * 2.3 + 1.5), 640 + 30 * Math.sin(t * .5 + 2), 64, { dir: 1, light: 1, warm: .25, seed: 5, tilt: .05 * Math.sin(t * .5), swim: 1.3 });
      Hb.diver(ctx, t, 1340 + 30 * Math.sin(t * .1), 560, 300, { ang: -.05 });
    } });
  }
  // a medallion that grows into the clip plate (and back), with the scene inside until the footage starts
  function plateMorph(ctx, t, m, fn) {
    const R = F.CLIP_RECT, mm = sineIO(m), cx = lerp(MB[0], R.x + R.w / 2, mm), cy = lerp(MB[1], R.y + R.h / 2, mm), w = lerp(RB * 2, R.w, mm), h = lerp(RB * 2, R.h, mm), rr = lerp(RB, 14, mm);
    const s = lerp(RB / F.RF, Math.max(R.w / W, R.h / H), mm);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); ctx.clip();
    ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2); E.withOuter({ k: s, e: cx - W / 2 * s, f: cy - H / 2 * s }, () => fn(ctx)); ctx.restore();
    ctx.save(); ctx.strokeStyle = F.CREAM.core; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(rr, w / 2, h / 2)); ctx.stroke(); ctx.restore();
  }
  // the autocomplete card for whistles (grows out of the Bahamas medallion)
  function autoCard(ctx, t, hd) {
    const u = B.win(t, a.its - .1, a.rec - .45); if (u <= 0 || !hd) return;
    const x = hd[0] + 40, y = hd[1] + 50, w = 560, h = 168, k = expoOut(u);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath(); ctx.rect(x - 30, y - 10, w + 60, h + 60); ctx.clip(); ctx.translate(0, (1 - k) * (h + 30));
    ctx.fillStyle = rgba(mixHex(P.night0, P.ind0, .5), .9); ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill(); ctx.strokeStyle = rgba(F.CREAM.line, .6); ctx.lineWidth = 2; ctx.stroke();
    E.glowText(ctx, 'DolphinGemma', x + 18, y + 32, { size: 22, weight: 600, col: P.halo2, glow: false, spacing: .04 });
    const typed = span(t, a.its + .2, a.auto + .3), acc = sineIO(span(t, a.dolS - .1, a.dolS + .6));
    F.wave(ctx, t, x + 140, y + 72, 220, 44, 'whistle', { u: typed, bars: 26, seed: 21, col: 'cream', head: false });
    ctx.strokeStyle = rgba(P.halo2, .5 * (1 - acc)); ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.strokeRect(x + 262, y + 50, 150, 44); ctx.setLineDash([]);
    // three suggestions; the first slides up into the gap
    for (let i = 0; i < 3; i++) {
      const su = rise(span(t, a.auto + .1 + i * .12, a.auto + .7 + i * .12)); if (su <= 0) continue;
      let cx = x + 100 + i * 170, cy = y + 134;
      if (i === 0) { cx = lerp(cx, x + 337, acc); cy = lerp(cy, y + 72, acc); }
      ctx.fillStyle = rgba(P.ind1, .9); ctx.beginPath(); ctx.roundRect(cx - 70, cy - 18, 140, 36, 18); ctx.fill();
      ctx.strokeStyle = rgba(i === 0 ? P.cream : P.blue1, .4 + .4 * (i === 0 ? .5 + .5 * acc : 0)); ctx.lineWidth = 2; ctx.stroke();
      F.wave(ctx, t, cx, cy, 100, 22 * su, 'whistle', { u: 1, bars: 14, seed: 30 + i * 7, col: 'cream', head: false, a: i === 0 ? 1 : .6 });
    }
    ctx.restore();
  }
  // the two listeners (6.09): screen px from the pin heads
  const SPECIES = ['crow', 'spermWhale', 'elephant', 'frog', 'finch', 'humpback', 'pig'];
  function listeners(ctx, t, hd) {
    const out = span(t, a.back - .55, a.back + .05);
    if (hd.bahamas) {
      const [bx, by, br] = hd.bahamas, u = rise(span(t, a.gm + .25, a.gm + 1.0)), s = 46, x = bx + br + 30 + .9 * s, y = by;
      if (u > 0) B.sink(ctx, y + s * .8, out, 120, () => {
        F.listener(ctx, t, x, y, s, { u, col: 'cream', drink: .5 + .3 * Math.sin(t * 2.4) });
        B.caps(ctx, 'GOOGLE', x - .9 * s - 4, y + s + 34, 26, u, { col: P.cream });
        for (let k = 0; k < 3; k++) { const q = ((t - a.gm) * .7 + k / 3) % 1; if (t < a.gm + .5) continue; F.wave(ctx, t, lerp(bx + br, x - .9 * s, q), y, 26, 16 * Math.sin(Math.PI * q), 'whistle', { bars: 6, seed: 50 + k, head: false, a: .8 }); }
      });
      B.bead(ctx, [x + 1.05 * s, y], B.slotXY('next'), span(t, tabAt.next - .85, tabAt.next), 'cream', 220);
    }
    if (hd.esp) {
      const [ex, ey, er] = hd.esp, u = rise(span(t, a.espw - .05, a.espw + .75)), s = 82, x = ex + er + 330, y = ey + 20;
      if (u > 0) B.sink(ctx, y + s * 1.6, out, 260, () => {
        F.listener(ctx, t, x, y, s, { u, col: 'gold', drink: .6 + .3 * Math.sin(t * 2) });
        SPECIES.forEach((k, i) => {   // every species: small medallions gather in an arc before the bell
          const g = expoOut(span(t, a.espw + .5 + i * .16, a.espw + 1.1 + i * .16)); if (g <= 0) return;
          const an = Math.PI * (.6 + .8 * i / (SPECIES.length - 1)), R = 120 * g + 40, mx = x - .9 * s - 10 + Math.cos(an) * R, my = y + Math.sin(an) * R * .95;
          const r = 23 * g;
          ctx.fillStyle = mixHex(P.night0, P.ind1, .55); ctx.beginPath(); ctx.arc(mx, my, r, 0, 7); ctx.fill();
          ctx.save(); ctx.beginPath(); ctx.arc(mx, my, r - 1, 0, 7); ctx.clip(); F.icon(ctx, k, mx, my, r * .95, { col: 'gold', t }); ctx.restore();
          ctx.strokeStyle = F.GOLD.body; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mx, my, r, 0, 7); ctx.stroke();
        });
      });
    }
  }
  // Berkeley: the finch medallion opens wider and calls; COUCH / SOFA
  const finchR = (t) => lerp(F.PIN_R, 78, sineIO(span(t, a.zebra - .45, a.zebra + .45)) * (1 - sineIO(span(t, a.birdsE - .2, a.birdsE + .6))));
  const FCALL = [[a.zebra + .45, 'chirp', 3], [a.sortC + .2, 'chirp', 8], [a.birds + .1, 'chirp', 12]];
  const sofa = (ctx, x, y, s) => {   // a flat sofa sign
    const p = new Path2D(); p.roundRect(x - s, y - s * .55, s * 2, s * .7, s * .16); p.roundRect(x - s * 1.18, y - s * .2, s * .36, s * .75, s * .12); p.roundRect(x + s * .82, y - s * .2, s * .36, s * .75, s * .12); p.roundRect(x - s * .9, y + .05 * s, s * 1.8, s * .45, s * .1);
    ctx.fillStyle = F.CREAM.body; ctx.fill(p); ctx.fillStyle = P.night1; ctx.fillRect(x - s * .95, y + s * .5, s * .14, s * .2); ctx.fillRect(x + s * .81, y + s * .5, s * .14, s * .2);
  };
  function berkeley(ctx, t, v) {
    const p = F.PIN.berkeley, [px, py] = F.mapXY(v, p.lon, p.lat), r = finchR(t), e = (r - F.PIN_R) / (78 - F.PIN_R);
    const hx = px + 120 * e, hy = py - (F.STALK + r) * lerp(1, .5, e);
    const open = FCALL.reduce((m, [t0]) => Math.max(m, Math.sin(Math.PI * span(t, t0 - .3, t0 + .3))), 0);
    return { head: [hx, hy], r, inner: (c, cx, cy, hr) => { c.fillStyle = mixHex(P.ind1, P.blue1, .4); c.fillRect(cx - hr, cy - hr, hr * 2, hr * 2); F.finch(c, t, cx - hr * .05, cy + hr * .55, hr * .95, { dir: 1, light: 1, warm: .6, seed: 3, open }); c.strokeStyle = mixHex(P.shade0, P.night1, .4); c.lineWidth = hr * .08; c.beginPath(); c.moveTo(cx - hr, cy + hr * .58); c.lineTo(cx + hr, cy + hr * .5); c.stroke(); } };
  }
  function couchSofa(ctx, t, fh) {
    if (!fh) return;
    const [hx, hy, hr] = fh, out = span(t, a.birdsE - .3, a.birdsE + .3);
    // the finch's calls leave the medallion (small)
    for (const [t0, kind, seed] of FCALL) { const u = span(t, t0, t0 + 1.4); if (u <= 0 || u >= 1) continue; F.wave(ctx, t, hx + hr + 40 + 90 * sineIO(u), hy - 30 * u, 70, 30 * Math.sin(Math.PI * u), kind, { bars: 12, seed, head: false, a: .85 }); }
    const S = [1650, 452], merge = sineIO(span(t, a.same - .15, a.same + .55)), sg = expoOut(span(t, a.same + .2, a.same + .8));
    B.sink(ctx, 760, out, 400, () => {
      [['COUCH', 'chirp', 5, 340, a.couch], ['SOFA', 'whistle', 9, 560, a.sofa]].forEach(([w, kind, seed, y, t0]) => {
        const g = span(t, t0 - .35, t0 + .5); if (g <= 0) return;
        const x0 = hx + hr + 30, x1 = 1340, xs = lerp(lerp(x0, x1, sineIO(g)), S[0], merge), ys = lerp(lerp(hy, y, sineIO(g)), S[1], merge), sc = lerp(lerp(.3, 1, sineIO(g)), .15, merge);
        if (sc > .17) F.wave(ctx, t, xs, ys, 360 * sc, 110 * sc, kind, { bars: 34, seed, col: 'cream', live: true, head: false, a: 1 - .8 * span(merge, .7, 1) });
        B.caps(ctx, w, x1 - 180, y - 74, 40, rise(span(t, t0, t0 + .6)) * (1 - span(merge, 0, .4)), { col: P.cream });
      });
      if (sg > 0) {
        halo(ctx, S[0], S[1], 150 * sg, .3 * sg, F.CREAM.body, F.CREAM.core);
        ctx.fillStyle = mixHex(P.night0, P.ind1, .6); ctx.beginPath(); ctx.arc(S[0], S[1], 84 * sg, 0, 7); ctx.fill(); ctx.strokeStyle = F.CREAM.core; ctx.lineWidth = 3; ctx.stroke();
        sofa(ctx, S[0], S[1] - 4, 44 * sg);
      }
    });
    B.bead(ctx, S, B.slotXY('there'), span(t, tabAt.there - .8, tabAt.there), 'cream', 120);
  }

  // ===================================================================================================== the take
  return (ctx, t) => {
    let tab = {};
    if (t < a.dz0) barnPart(ctx, t, T, a);
    else if (t < a.dz1) {   // into the Dominica medallion
      const v = F.flight(domHold(a.dz0, a), V0D, B.ZIN(span(t, a.dz0, a.dz1)));
      B.mapMed(ctx, t, T, v, { pid: 'dominica', zRef: zRefD, scene: (c) => dominicaAll(c, t) });
    } else if (t < do0) dominicaAll(ctx, t);
    else if (t < fb0) {   // out onto the map; PARTS; the gold pin pulses
      const v = t < do1 ? F.flight(V0D2, CAR, B.ZOUT(span(t, do0, do1))) : carHold(t);
      const { med } = B.mapMed(ctx, t, T, v, { pid: 'dominica', zRef: CAR.z, scene: (c) => dominicaAll(c, t), pins: { pulse: { esp: Math.sin(Math.PI * span(t, a.calTeam - .2, a.learnPE)) } } });
      if (med) B.bead(ctx, [med.cx, med.cy], B.slotXY('parts'), span(t, a.learnP - .75, a.learnP), 'cream', 140);
    } else if (t < zb0) {   // the short flight to Bimini; the autocomplete card
      const v = t < fb1 ? F.flight(carHold(fb0), BAH, B.FLY(span(t, fb0, fb1))) : bahHold(t);
      const { hd } = B.mapMed(ctx, t, T, v, {});
      autoCard(ctx, t, hd.bahamas);
    } else if (t < pm0) {   // into the large medallion; 40 YEARS
      const v = t < zb1 ? F.flight(bahHold(zb0), VB, B.ZIN(span(t, zb0, zb1))) : B.crept(VB, 1);
      B.mapMed(ctx, t, T, v, { pid: 'bahamas', zRef: zRefB, scene: (c) => bahamas(c, t) });
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const yu = B.win(t, a.decades - .1, pm0 - .35, .5, .35);
      B.serif(ctx, '40 YEARS', MB[0] + RB + 90, MB[1] + 30, 96, yu, {}); ctx.restore();
    } else if (t < pb1) {   // the plate: the medallion grows into it, the clip, back into the medallion
      const v = B.crept(VB, 1);
      F.map(ctx, t, v, { calls: B.CA_CALLS, dim: .35 * sineIO(span(t, pm0, pm1)) * (1 - sineIO(span(t, pb0, pb1))) });
      F.pins(ctx, t, T, v, { hide: ['bahamas'] });
      if (t < pm1) plateMorph(ctx, t, span(t, pm0, pm1), (c) => bahamas(c, t));
      else if (t < pb0) { F.clipPlate(ctx, t, T, 'C3', { morph: 1, credits: false }); B.credits(ctx, t, T, 'C3'); }
      else plateMorph(ctx, t, 1 - span(t, pb0, pb1), (c) => bahamas(c, t));
    } else if (t < fc0) {   // out onto the map: the two listeners; NEXT SOUND
      const v = t < zo1 ? F.flight(B.crept(VB, 1), CB, B.ZOUT(span(t, zo0, zo1))) : cbHold(t);
      const { hd } = B.mapMed(ctx, t, T, v, { pid: 'bahamas', zRef: zRefB, scene: (c) => bahamas(c, t) });
      listeners(ctx, t, hd);
    } else if (t < wv0) {   // Berkeley: the finch medallion, COUCH / SOFA, IT'S THERE
      const v = t < fc1 ? F.flight(cbHold(fc0), CAL, B.FLY(span(t, fc0, fc1))) : calHold(t);
      const bk = berkeley(ctx, t, v);
      const { hd } = B.mapMed(ctx, t, T, v, { pins: { head: { berkeley: bk.head }, r: { berkeley: bk.r }, inner: { berkeley: bk.inner } } });
      if (t < fc0 + .7) listeners(ctx, t, hd);
      couchSofa(ctx, t, hd.berkeley);
    } else {   // 6.13 / 6.14: the whole world; the slots flash; the tablet to the centre; its middle becomes the bar
      const v0 = calHold(wv0);
      if (t < wv1) { const v = F.flight(v0, worldView(wv1, a), B.FLY(span(t, wv0, wv1))); F.map(ctx, t, v, { calls: .32 }); F.pins(ctx, t, T, v, { pulse: flashPins(t, a) }); }
      else barMap(ctx, t, T, a, { pulse: flashPins(t, a) });
      const m = sineIO(span(t, a.tm0, a.tm1));
      tab = { x: lerp(B.TABLET_AT.x, 960, m), y: lerp(B.TABLET_AT.y, 540, m), s: lerp(B.TABLET_AT.s, 1, m) };
    }
    // the tablet (docked; at the end it glides to the centre and sinks while its middle becomes the bar)
    if (t < a.bm0 + .8) {
      const sk = span(t, a.bm0, a.bm0 + .75);
      const draw = () => { const r = B.hudTablet(ctx, t, T, tab); flashSlots(ctx, t, a, tab); };
      const ck = span(t, pm0 - .1, pm0 + .5) * (1 - span(t, pb1 - .2, pb1 + .5));   // it steps aside (sinks) while the clip plate is up
      if (sk > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.sink(ctx, 540 + 190, sk, 420, draw); ctx.restore(); }
      else if (ck > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.sink(ctx, B.TABLET_AT.y + 80, ck, 200, draw); ctx.restore(); } else draw();
    }
    if (t >= a.bm0) bar(ctx, t, a, { u: rise(span(t, a.bm0, a.bm0 + .6)) });
    F.strip(ctx, t, T);
  };
}
// the pins and slots flash on their words: names (Kenya), feelings (the pigs), what's going on (Amboseli)
const FLASH = [['names', 'kenya', 'names'], ['feelingsW', 'pigs', 'feel'], ['going', 'amboseli', 'room']];
function flashPins(t, a) { const o = { esp: .25 + .25 * Math.sin(t * 1.3), leon: .2, dominica: .2, bahamas: .2, berkeley: .2 }; for (const [k, id] of FLASH) o[id] = Math.sin(Math.PI * span(t, a[k] - .1, a[k] + .9)); return o; }
function flashSlots(ctx, t, a, tab) {
  for (const [k, , sid] of FLASH) {
    const f = Math.sin(Math.PI * span(t, a[k] - .1, a[k] + .9)); if (f <= 0) continue;
    const [x, y] = B.slotXY(sid, tab); ctx.save(); halo(ctx, x, y, 110 * (tab.s ?? .4) / .4 * .6, .5 * f, F.CREAM.body, F.CREAM.core); ctx.restore();
  }
}
