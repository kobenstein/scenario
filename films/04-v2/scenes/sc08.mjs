// c08 · It was the word (03b "Part of what hurts" → 03c → clip S): ONE continuous take, one camera through one world.
// (plan table: filled in as the takes are built)
import { W, H, clamp, mix, lin, eout, text } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { source } from '../lib/kit.mjs';
import { ready, track, seg, sio, qio, eo3, eoX } from '../lib/v2_c08_core.mjs';
import { K0, C0, vigStatic, vigRaster } from '../lib/v2_c08_vignette.mjs';
import { drawForm, formPrint } from '../lib/v2_c08_form.mjs';

// the source line in the kit's style (small Inter caps at 110, 890), in ink on the paper
function paperSource(ctx, t, t0, t1, s) {
  const a = eout(lin(t0, t0 + .6, t)) * (1 - lin(t1 - .5, t1, t)); if (a <= 0) return;
  text(ctx, s.toUpperCase(), 110, 890, { size: 17, weight: 600, color: '#4a3d30', alpha: a * .9, spacing: 4 });
}

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c08', T);
  const S = (p, n) => T.S('03b', p, n), E = (p, n) => T.E('03b', p, n), Sc = (p, n) => T.S('03c', p, n), Ec = (p, n) => T.E('03c', p, n);
  // the start / end of word i of a phrase (so every anchor sits on the stressed word itself)
  const wS = (sec, ph, i) => T.W(sec, ph, ph)[i].s, wE = (sec, ph, i) => T.W(sec, ph, ph)[i].e;
  const K = {
    hb: HI.b, part: S('Part of what hurts'), time: wS('03b', 'never the free time', 3), timeE: E('never the free time'), it: S('It was the word'), word: wS('03b', 'It was the word', 3), wordE: E('It was the word'),
    res: S('Researchers watched'), age: wS('03b', 'retirement age', 1), ageE: E('retirement age'), nothing: S('Nothing about'), changedE: E('days changed'),
    but: S('But they got'), happier: wS('03b', 'noticeably happier', 1), happierE: E('noticeably happier'),
    weren: S("They weren't"), unemp: wS('03b', "weren't unemployed", 1), unempE: E("weren't unemployed"), were: S('They were retired'), retired: wS('03b', 'They were retired', 2), retiredE: E('They were retired'),
    now: S('Now imagine'), work: wS('03b', 'has to work', 2), nobody: S('Nobody is'), nobodyUn: wS('03b', 'Nobody is unemployed', 2), the: S('The word is gone'), gone: wS('03b', 'The word is gone', 3), goneE: E('The word is gone'),
    take: Sc('Take away'), run: wS('03c', 'reason to run', 2), runE: Ec('reason to run'), left: Sc("What's left"), question: wS('03c', 'is a question', 2), questionE: Ec('is a question'),
    who: Sc('Who am I'), job: wS('03c', 'not my job', 2), jobE: Ec('not my job'),
    clip0: T.clip('S').start, clip1: T.clip('S').end, ha: HO.a,
  };
  // ════════════════ phase A: the form, seen straight from above (2D: FU → screen with zoom k around a centre)
  const ln = Math.log;
  const camKeys = [   // [t, k, cx, cy]: moves (quart-like through the Hermite track) and slow drifting holds
    [K.hb, 6.9, C0[0], C0[1]], [K.part + .02, 6.84, C0[0] - .4, C0[1] + .2],
    [K.timeE - .6, 2.25, 500, 308],                                   // 8.01 the whole vignette
    [K.it - .45, 1.5, 500, 440], [K.res - .02, 1.48, 501, 444],       // 8.02 the vignette heads the form: STATUS
    [K.res + 1.0, 2.2, 520, 700], [K.age + .35, 2.23, 522, 700],      // 8.03 the AGE ruler
    [K.nothing + .65, 1.3, 500, 492], [K.but, 1.32, 501, 490],       // 8.04 the same picture while the marker passes 65
    [K.happier + .2, 2.6, 560, 322], [K.happierE, 2.63, 561, 322],    // 8.05 the person and the sun
    [K.unemp - .06, 2.0, 500, 620], [K.were, 2.02, 500, 622],         // 8.06 the field
    [K.retired + .05, 2.2, 500, 628], [K.now + .02, 2.23, 500, 628],  // 8.07 RETIRED
  ];
  const tk = track(camKeys.map(([t, k]) => [t, ln(k)])), tx = track(camKeys.map(([t, , x]) => [t, x])), ty = track(camKeys.map(([t, , , y]) => [t, y]));
  const camA = (t) => ({ k: Math.exp(tk(t)), cx: tx(t), cy: ty(t) });
  const Mof = (c) => [c.k, 0, 0, c.k, W / 2 - c.k * c.cx, H / 2 - c.k * c.cy];
  const strikes = [...Array(10)].map((_, i) => K.timeE + .04 + i * (K.word - K.timeE - .04) / 9);
  const smoke = [...Array(10)].map((_, i) => K.unemp + i * (K.unempE - K.unemp) / 10);
  const ageAt = (t) => t < K.res + .9 ? 58 : t < K.age ? mix(58, 64.93, eo3(seg(t, K.res + .9, K.age))) : t < K.nothing + .2 ? 64.93 : mix(64.93, 65.85, sio(seg(t, K.nothing + .2, K.changedE + .3)));
  function phaseA(ctx, t) {
    const c = camA(t), M = Mof(c);
    const lastStrike = strikes.filter((s) => s <= t).pop(), jolt = lastStrike != null ? [0, -1.4 * Math.exp(-(t - lastStrike) * 38)] : null;
    drawForm(ctx, t, M, {
      grow: sio(seg(t, K.part, K.it)), fib: clamp((c.k - .5) / 1.0), plate: 1 - sio(seg(t, K.hb + .2, K.part + 1.6)), jolt,
      vig: { reveal: sio(seg(t, K.part + .45, K.timeE - .7)), ringT0: K.part + .02, rays0: K.part + .95, sit: sio(seg(t, K.but + .35, K.happier + .1)), fly: t - K.happier, warm: sio(seg(t, K.but + .5, K.happierE)) },
      strikes, smoke, ret: { u: sio(seg(t, K.retired - .1, K.retiredE - .1)), glint: seg(t, K.retiredE - .05, K.retiredE + .65) },
      age: ageAt(t),
    });
    paperSource(ctx, t, K.res + .4, K.but - .1, 'Hetschko, Knabe & Schöb (2014), The Economic Journal');
  }
  const draw = (ctx, t) => { phaseA(ctx, t); };
  // warm the caches (static engraving, rasters, print layer, fonts) so the first frames are not slow
  vigStatic(); vigRaster(3.2); formPrint();
  { const { canvas } = await import('../engine.mjs'); const [, g] = canvas(); for (const t of [K.hb, K.time, K.word + .1]) { g.save(); draw(g, t); g.restore(); } }
  await ready();
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw, sound: [{ f: 'teletype', t: K.timeE, v: .22 }] },
  ];
};
