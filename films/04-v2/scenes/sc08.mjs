// c08 · It was the word (03b "Part of what hurts" → 03c → clip S)
//  time            shot   image (one camera; one cut at the 03b→03c section turn)
//  187.09–206.10   8.01–8.07  phase A — the form seen from above: the engraved park-bench vignette (8.01), it heads an official
//                  form, STATUS UNEMPLOYED typed (8.02), the AGE ruler + source (8.03), the marker passes 65 (8.04), the sitter
//                  warms in the sun (8.05), the word goes up as dotted smoke (8.06), RETIRED in foil (8.07)
//  206.10–209.40   8.08  phase B — top-down pull-out: the form lies on one desk of a vast hall of desks with stacked forms;
//                  on "work" the top form of every desk lifts and rises toward the camera, which rises with them
//  209.40–211.20   8.09  phase C — through the open ridge vent; above the glowing glass roof the forms circle over the city at
//                  dusk; one form stays in front of the lens: its UNEMPLOYED dissolves into dotted smoke on "unemployed"
//  211.20–213.90   8.10  the camera tilts up: the dust becomes the first stars on "gone" (★), the forms fold into white birds and
//                  fly off; the camera sinks
//  213.90 (cut)    8.11  phase D — a train shed at dusk: a commuter hurries for the train, the station clock races and stops on
//                  "run", he relaxes and lets the train go (passengers in its windows)
//  218.22          8.12  alone before the big dark screen at the platform's end (the dark glass = the glass plate)
//  220.38          8.13  his reflection in it: the badge on its lanyard; the title line goes up as dotted smoke on "job"
//  223.40–227.41   8.14  the screen lights: clip S (lower third, from c02); it folds to a line; the camera is in its glass
//  227.58          → c09 glass plate
import { W, H, clamp, mix, lin, eout, eio, text, rgba } from '../engine.mjs';
import { handsOf } from '../lib/handoff4.mjs';
import { clipScreen } from '../lib/kit.mjs';
import { ready, track, seg, sio, eo3, ss, TAU } from '../lib/v2_c08_core.mjs';
import { K0, C0, vigStatic, vigRaster } from '../lib/v2_c08_vignette.mjs';
import { drawForm, formPrint } from '../lib/v2_c08_form.mjs';
import { Cam, pathS, onScreen } from '../lib/v2_c08_space.mjs';
import { drawHall, DESKS, DESK_Y, U, fuW, deskMips, holesMips } from '../lib/v2_c08_hall.mjs';
import { flyers, drawFlyers, drawSky, drawDust, drawVaultOut, wordFrames, heroMips } from '../lib/v2_c08_flock.mjs';
import { drawStation } from '../lib/v2_c08_station.mjs';

const PI2 = Math.PI / 2, AMBER = '#ffb35c', CREAM = '#f3efe2';
// a monotone cubic track (Fritsch–Carlson): eases in/out at the ends, never overshoots a key
function trackM(keys) {
  const n = keys.length, d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((keys[i + 1][1] - keys[i][1]) / (keys[i + 1][0] - keys[i][0]));
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s2 = a * a + b * b;
    if (s2 > 9) { const k = 3 / Math.sqrt(s2); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  return (t) => {
    if (t <= keys[0][0]) return keys[0][1];
    if (t >= keys[n - 1][0]) return keys[n - 1][1];
    let i = 0; while (i < n - 2 && t > keys[i + 1][0]) i++;
    const [t0, v0] = keys[i], [t1, v1] = keys[i + 1], h = t1 - t0, u = (t - t0) / h, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * v0 + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * v1 + (u3 - u2) * h * m[i + 1];
  };
}
const tracks = (keys, n) => [...Array(n)].map((_, j) => trackM(keys.map((k) => [k[0], k[j + 1]])));
// the source line in the kit's style (small Inter caps at 110, 890), in ink on the paper
function paperSource(ctx, t, t0, t1, s) {
  const a = eout(lin(t0, t0 + .6, t)) * (1 - lin(t1 - .5, t1, t)); if (a <= 0) return;
  text(ctx, s.toUpperCase(), 110, 890, { size: 17, weight: 600, color: '#4a3d30', alpha: a * .9, spacing: 4 });
}
function label(ctx, s, x, y, o = {}) { ctx.save(); ctx.shadowColor = 'rgba(2,3,12,.85)'; ctx.shadowBlur = 12; text(ctx, s, x, y, { size: o.size ?? 18, weight: o.weight ?? 600, color: rgba(o.col || CREAM, o.alpha ?? .92), spacing: o.spacing ?? 5, align: 'left', font: o.font || 'Inter' }); ctx.restore(); }

export default async (T, R) => {
  const { in: HI, out: HO } = handsOf('c08', T);
  const S = (p, n) => T.S('03b', p, n), E = (p, n) => T.E('03b', p, n), Sc = (p, n) => T.S('03c', p, n), Ec = (p, n) => T.E('03c', p, n);
  // the start / end of word i of a phrase (so every anchor sits on the stressed word itself)
  const wS = (sec, ph, i) => T.W(sec, ph, ph)[i].s;
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
  const camKeys = [   // [t, k, cx, cy]: moves and slow drifting holds
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
  const stA = (t, k) => {
    const lastStrike = strikes.filter((s) => s <= t).pop(), jolt = lastStrike != null ? [0, -1.4 * Math.exp(-(t - lastStrike) * 38)] : null;
    return {
      grow: sio(seg(t, K.part, K.it)), fib: clamp((k - .5) / 1.0), plate: 1 - sio(seg(t, K.hb + .2, K.part + 1.6)), jolt,
      vig: { reveal: sio(seg(t, K.part + .45, K.timeE - .7)), ringT0: K.part + .02, rays0: K.part + .95, sit: sio(seg(t, K.but + .35, K.happier + .1)), fly: t - K.happier, warm: sio(seg(t, K.but + .5, K.happierE)) },
      strikes, smoke, ret: { u: sio(seg(t, K.retired - .1, K.retiredE - .1)), glint: seg(t, K.retiredE - .05, K.retiredE + .65) },
      age: ageAt(t),
    };
  };
  function phaseA(ctx, t) {
    const c = camA(t);
    drawForm(ctx, t, Mof(c), stA(t, c.k));
    paperSource(ctx, t, K.res + .4, K.ageE + .55, 'Hetschko, Knabe & Schöb (2014), The Economic Journal');
  }

  // ════════════════ phases B + C: one world camera (metres, Y up, looking +Z), from straight above the form up through the roof
  const tB = K.now + .02, cB = camA(tB), Y0 = DESK_Y + .0006, h0 = 1400 * U / cB.k;
  const KB = [   // [t, y, z, pitch]   (x = 0: the camera rises through the middle of the ridge vent)
    [tB, Y0 + h0, (707 - cB.cy) * U, -PI2],
    [K.now + 1.47, Y0 + 5.6, .05, -PI2],               // the form stays centred while it shrinks
    [K.work, 12.9, 1.6, -PI2],
    [K.work + 1.0, 15.62, 1.6, -PI2],                 // through the vent
    [K.work + 1.55, 19.2, 1.0, -1.50],
    [210.7, 24.5, -3.2, -1.12],                       // the dissolving word in front of the lens
    [K.gone - .6, 27.6, -7.6, -.42],
    [K.gone, 28.8, -10.2, .2],                        // ★ the first stars
    [K.gone + .55, 28.6, -11.3, .21],
    [213.95, 21.5, -13.2, -.02],                      // sinking
  ];
  const [tyB, tzB, tpB] = [trackM(KB.map((k) => [k[0], Math.log(k[1] - Y0)])), trackM(KB.map((k) => [k[0], k[2]])), trackM(KB.map((k) => [k[0], k[3]]))];
  const camW = (t) => Cam({ x: 0, y: Y0 + Math.exp(tyB(t)), z: tzB(t), yaw: 0, pitch: tpB(t), f: 1400 });
  // the lead sheet (desk in the next row): drawn to the lens, its word dissolves in front of us, then it flies off as a bird
  const leadDesk = DESKS.find((d) => !d.hero && Math.abs(d.cx) < .01 && Math.abs(d.cz - 3.2) < .01);
  const leadAt = (t) => {
    const c = camW(t), F = c.F, Uc = c.U, Rc = c.R, dl = .98 + .05 * Math.sin(t * 1.3), ul = -.16 + .06 * Math.sin(t * .9 + 1), rl = .08 * Math.sin(t * .7 + 2);
    const O = [0, 1, 2].map((i) => c.pos[i] + F[i] * dl + Uc[i] * ul + Rc[i] * rl);
    const th = .18 * Math.sin(t * .55) + .08, ti = .13 * Math.sin(t * 1.7 + .5), ro = .1 * Math.sin(t * 1.3 + 1.2);
    let ex = [0, 1, 2].map((i) => Rc[i] * Math.cos(th) + Uc[i] * Math.sin(th)), ez = [0, 1, 2].map((i) => Uc[i] * Math.cos(th) - Rc[i] * Math.sin(th)), en = F.map((v) => -v);
    const rot = (a, b, g) => [[0, 1, 2].map((i) => a[i] * Math.cos(g) + b[i] * Math.sin(g)), [0, 1, 2].map((i) => b[i] * Math.cos(g) - a[i] * Math.sin(g))];
    [ez, en] = rot(ez, en, ti); [ex, en] = rot(ex, en, ro);
    return { O, ex, ez, en };
  };
  K.lead = { desk: leadDesk, wf: 210.15, tb: 211.3, t0: K.work + .6, t1: K.work + 1.45, at: leadAt, dir: [0, Math.sin(.35), Math.cos(.35)] };
  const FL = flyers(K), heroT0 = FL.find((f) => f.hero).t0;
  const WF = wordFrames();
  let curT = 0;
  const heroM = (cam) => { const p0 = cam.P(...fuW(0, 0)), p1 = cam.P(...fuW(1000, 0)), p2 = cam.P(...fuW(0, 1414)); return [(p1[0] - p0[0]) / 1000, (p1[1] - p0[1]) / 1000, (p2[0] - p0[0]) / 1414, (p2[1] - p0[1]) / 1414, p0[0], p0[1]]; };
  const hallSt = {
    formMips: WF[0],
    heroDraw: (g, cam) => { if (curT >= heroT0) return; const M = heroM(cam); drawForm(g, curT, M, { ...stA(curT, Math.hypot(M[0], M[1])), desk: false }); },
  };
  const ROOF = { cx: 0, half: 8, y0: 11, ridge: 15.6, z0: -11, z1: 46, vent: .055, glow: 1, box: { x0: -17.5, x1: 17.5, z0: -11, z1: 46 } };
  function phaseBC(ctx, t) {
    curT = t;
    const cam = camW(t);
    if (cam.pos[1] < ROOF.ridge) drawHall(ctx, t, cam, hallSt);
    else {
      drawSky(ctx, cam, t, K);
      const r = drawVaultOut(ctx, cam, ROOF);
      // the open ridge vent: the hall is seen through it
      const sp = cam.poly([r.P(-ROOF.vent, ROOF.z0), r.P(-ROOF.vent, ROOF.z1), r.P(ROOF.vent, ROOF.z1), r.P(ROOF.vent, ROOF.z0)]);
      if (sp.length >= 3 && onScreen(sp)) { ctx.save(); ctx.beginPath(); pathS(ctx, sp); ctx.clip(); drawHall(ctx, t, cam, hallSt); ctx.restore(); }
    }
    drawFlyers(ctx, cam, t, K);
    drawDust(ctx, cam, t, K);
  }
  const drawABC = (ctx, t) => (t < tB ? phaseA(ctx, t) : phaseBC(ctx, t));

  // ════════════════ phase D: the station (its own world, cut in on the 03c turn); the camera ends in the screen's glass
  const tD = 213.9;
  const KD = [   // [t, x, y, z, pitch]
    [tD, 34.05, 5.6, 9.4, -.17],
    [214.8, 34.3, 2.85, 11.3, -.045],
    [K.run, 34.4, 2.66, 12.8, -.03],
    [219.9, 34.6, 2.6, 15.0, -.02],                  // he and his reflection in the dark glass
    [222.5, 34.85, 2.55, 16.8, -.01],
    [K.clip0, 34.95, 2.72, 17.6, 0],
    [226.8, 34.98, 2.95, 18.75, 0],
    [227.54, 35.0, 2.9875, 19.55, 0],
    [227.75, 35.0, 2.9875, 19.62, 0],
  ];
  const [dX, dY, dZ, dP] = tracks(KD, 4);
  const camD = (t) => Cam({ x: dX(t), y: dY(t), z: dZ(t), yaw: 0, pitch: dP(t), f: 1400 });
  // the commuter: hurries along the platform for the open door, slows, stops on "run" (feet planted in the world)
  const V0 = 1.45, TS = K.run - tD, Z0 = 19.9 - V0 * TS / 2, SL = .74, MX = 36.2;
  const zh = (t) => { const u = clamp(t - tD, 0, TS); return Z0 + V0 * (u - u * u / (2 * TS)) + (t < tD ? V0 * (t - tD) : 0); };
  const vh = (t) => t >= K.run ? 0 : V0 * (1 - clamp(t - tD, 0, TS) / TS);
  const footAt = (i, p) => {
    const c = p + i / 2, n = Math.floor(c), q = c - n, z0 = Z0 + 2 * SL * (n - i / 2 - .1) + SL / 2, x = MX + (i ? .11 : -.11);
    if (q < .5) return [x, z0, q > .38 ? (q - .38) * .25 : 0];
    const k = (q - .5) / .5; return [x, z0 + 2 * SL * ss(0, 1, k), .16 * Math.sin(Math.PI * k)];
  };
  const pOf = (t) => (zh(t) - Z0) / (2 * SL) + .1;
  const fStop = [0, 1].map((i) => footAt(i, pOf(K.run))), zEnd = zh(K.run);
  const man = (t) => {
    const v = vh(t) / V0, p = pOf(t);
    let feet = [0, 1].map((i) => footAt(i, p));
    if (t > K.run) { const k = ss(0, 1, seg(t, K.run, K.run + .45)), F1 = [[MX - .12, zEnd + .03, 0], [MX + .12, zEnd - .03, 0]]; feet = fStop.map((f, i) => [mix(f[0], F1[i][0], k), mix(f[1], F1[i][1], k), mix(f[2], 0, k) + .05 * Math.sin(Math.PI * k) * (f[2] > .02 ? 1 : 0)]); }
    return { seed: 2.3, hip: [MX, zh(t)], feet, swing: -Math.sin(TAU * p) * .9 * v, lean: .3 * v, relax: ss(0, 1, seg(t, K.run, K.run + 1.1)), light: null };
  };
  const clockM = (t) => { const u = clamp(t - tD, 0, TS); return .13 + .2 * (u - u * u / (2 * TS)); };
  const tDep = K.run + .5;
  const tc = (t) => clamp(t, K.clip0 + .001, K.clip1 - .001);
  function lowerThird(ctx, t) {
    const c0 = K.clip0, c1 = K.clip1; if (t < c0 + .15 || t > c1 + .05) return;
    const x = 130, y = 760;
    const bar = eout(lin(c0 + .2, c0 + .7, t)) * (1 - eio(lin(c1 - .4, c1 - .05, t)));
    if (bar > 0) { ctx.fillStyle = AMBER; ctx.fillRect(x, y - 38, 3, 128 * bar); }
    const rows = [['Mustafa Suleyman', 0, { size: 44, font: 'Instrument Serif', weight: 400, spacing: 0 }], ['CEO, MICROSOFT AI', 32, { size: 17, spacing: 4, alpha: .85 }],
      ['WHAT NOW? WITH TREVOR NOAH', 58, { size: 16, spacing: 3, col: '#c9c3dc', alpha: .8 }], ['SEP 18, 2025', 82, { size: 16, spacing: 3, col: '#c9c3dc', alpha: .8 }]];
    rows.forEach(([s, dy, o], k) => {   // each line rises out of its own mask and sinks back into it
      const rise = (1 - eout(lin(c0 + .25 + k * .08, c0 + .85 + k * .08, t))) + eio(lin(c1 - .5 + k * .04, c1 - .12 + k * .04, t)), z = o.size;
      if (rise >= 1) return;
      ctx.save(); ctx.beginPath(); ctx.rect(x + 12, y + dy - z * 1.25, 560, z * 1.8); ctx.clip(); label(ctx, s, x + 20, y + dy + rise * z * 1.3, o); ctx.restore();
    });
  }
  function drawD(ctx, t) {
    const cam = camD(t), on = seg(t, K.clip0 - .32, K.clip0 - .02), off = seg(t, K.clip1, K.clip1 + .12);
    drawStation(ctx, t, cam, {
      trainDz: t < tDep ? 0 : 2 * (t - tDep) ** 2, doors: 1 - ss(0, 1, seg(t, K.run + .05, K.run + .45)), clockM: clockM(t),
      man: man(t), refl: t < K.clip0 - .02 ? 1 : 0, title: 1 - ss(0, 1, seg(t, K.job + .02, K.job + .55)), smoke: { u: Math.max(0, t - K.job) * 1.15 },
      screen: { on, off, clip: (g, x, y, w, h) => clipScreen(g, tc(t), T, 'S', x, y, w, h, { glow: false, bezel: false, radius: 8 }) },
      plate: (g, tt) => HO.plate(g, tt),
    });
    lowerThird(ctx, t);
  }

  // warm the caches (static engraving, rasters, print layer, textures) so the first frames are not slow
  vigStatic(); vigRaster(3.2); formPrint(); heroMips(); deskMips(); holesMips();
  { const { canvas } = await import('../engine.mjs'); const [, g] = canvas(); for (const t of [K.hb, K.time, K.word + .1]) { g.save(); drawABC(g, t); g.restore(); } }
  await ready();
  return [
    { t: HI.b, tr: 'cut', d: .1, print: HI.print, draw: drawABC,
      sound: [{ f: 'teletype', t: K.timeE, v: .22 }, { f: 'pages', t: K.work - .02, v: .3 }, { f: 'whoosh_up', t: K.work + .85, v: .28 }, { f: 'shimmer_rings', t: K.nobodyUn + .1, v: .16 },
        { f: 'wings', t: 211.32, v: .22 }, { f: 'chime', t: K.gone, v: .26 }, { f: 'gust', t: K.goneE + .1, v: .18 }] },
    { t: tD, tr: 'cut', d: .1, print: HO.print, draw: drawD,
      sound: [{ f: 'steps', t: tD + .05, v: .2 }, { f: 'tick', t: K.run, v: .3 }, { f: 'whoosh', t: tDep + .3, v: .2 }, { f: 'lamp', t: K.clip0 - .32, v: .2 }, { f: 'screen_off', t: K.clip1, v: .24 }] },
  ];
};
