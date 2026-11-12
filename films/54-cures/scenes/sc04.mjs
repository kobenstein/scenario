// c04 · No. 10 IdentiFlight, Wyoming: stop them all or none? · cameras on towers · eagle or not · only the turbines in its path slow
// down (lamp 10) · −82 % with the caveat ONE WIND FARM · one miss can cost an eagle · the frame drops onto the Nazca desert.
// T.G('Wind turbines make') → T.G('The Nazca desert') · builder B1 · plan: docs/shots.md 10.01–10.09
// ONE continuous take in the prairie (lib/f28_b1_prairie.mjs, opened by c03); at the end the eagle's frame falls and grows: inside it
// lies the desert from above (a portal), which becomes the screen (lib/f28_b1_desert.mjs, continued by c05).
//
// | ID    | anchor (phrase)                    | picture (one idea)                                                          | camera                  |
// |-------|------------------------------------|-----------------------------------------------------------------------------|-------------------------|
// | 10.01 | Wind turbines make clean power     | an eagle glides toward the turning blades                                   | ride, follow the eagle  |
// | 10.02 | Stop them all                      | a light line halves the farm: ALL STOPPED (blades halt, POWER drains cool) · NONE STOPPED (an eagle mark falls) | hold wide |
// | 10.03 | What would you do?                 | the split breathes                                                           | creep                   |
// | 10.04 | On one wind farm in Wyoming        | a camera on a tower wakes (the bead in it), its cool look sweeps the sky · REAL | truck to the tower     |
// | 10.05 | In the blink of an eye             | a frame snaps round the eagle: EAGLE? → YES · ≈ 0.4 S                        | pull back to tower+eagle|
// | 10.06★| Only the turbines in its path      | one turbine slows, the eagle glides through its disc, the others turn on; lamp 10 | follow the eagle   |
// | 10.07 | A study credited the cameras       | five eagle marks, four go out: −82 % EAGLE DEATHS · bracket ONE WIND FARM: NOT YET PROVEN | wide        |
// | 10.08 | Here, one miss can cost an eagle   | the frame stays sharp on the eagle                                           | follow                  |
// | 10.09 | In Peru, a machine was wrong       | the frame drops and grows: inside, a desert from above; many frames, almost all empty | into the frame |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as B from '../lib/f28_b1_kit.mjs';
import * as PR from '../lib/f28_b1_prairie.mjs';
import * as D from '../lib/f28_b1_desert.mjs';
import { ride34 } from './sc03.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, mixHex, prng } = E;

export const ride45 = (T) => { const t0 = T.G('The Nazca desert') - .6; return { t0, cam: B.ride(E.F0, 900, 500, .55, t0) }; };
// which aerial frames the machine flags in 10.09 (almost all empty) — c05 continues them
const FLAG = (() => { const r = prng(4741), s = new Set(); while (s.size < 70) s.add(Math.floor(r() * D.TCOLS * D.TROWS)); return [...s]; })();
export const tileFlag = (k, t, t0) => { const i = FLAG.indexOf(k); if (i < 0) return 0; return span(t, t0 + (i % 35) * .05, t0 + .4 + (i % 35) * .05) * (.55 + .45 * Math.sin(t * 1.3 + i)); };

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.turb = G('Wind turbines make'); a.kill = G('they kill eagles'); a.stopAll = G('Stop them all'); a.lose = G('you lose the power');
  a.stopNone = G('Stop none'); a.die = G('eagles die'); a.what = G('What would you do'); a.farm = G('On one wind farm');
  a.cameras = G('cameras on towers'); a.sky = G('watch the sky'); a.blink = G('In the blink'); a.decides = G('decides');
  a.eagleq = G('eagle or not'); a.only = G('Only the turbines'); a.slowd = G('slow down', a.only); a.study = G('A study credited');
  a.cutting = G('cutting eagle deaths'); a.four = G('four in five'); a.other = G('Other scientists'); a.prove = G("can't prove");
  a.here = G('Here, one miss'); a.peru = G('In Peru, a machine'); a.wrong = G('was wrong almost'); a.worked = G('it still worked'); a.end = R.b;
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT28 }];
};

const CT = (u, v, s, sx, sy) => E.aim(PR.Z_TURB, u, v, s, sx, sy);
const SLOW = 5;                         // the turbine in the eagle's path

function scene(a, T) {
  const R34 = ride34(T), R45 = ride45(T);
  const tDrop0 = a.peru + .15, tDrop1 = a.wrong + .7;        // the frame falls and grows into the screen
  // ---------------------------------------------------------------- the eagle (on the turbine card): soars, then glides through turbine 5
  const EK = [[a.turb - .2, 2350, 250], [a.kill + .6, 1500, 300], [a.stopAll + .4, 1260, 250], [a.die, 1180, 220], [a.what + .8, 1330, 210], [a.farm + 1.5, 1600, 250], [a.sky + .6, 1820, 290],
    [a.blink + .6, 1780, 310], [a.decides + 1.2, 1720, 330], [a.only + .3, 1640, 350], [a.slowd + 1.4, 1240, 372], [a.study + 1.4, 980, 340], [a.four + .8, 860, 300], [a.prove + 1, 820, 280],
    [a.here + 1.5, 700, 300], [a.peru + 1.5, 560, 330], [a.end + 2, 300, 340]];
  const eagleAt = (t) => { // piecewise-cubic through the keys (Catmull in time-x-y)
    if (t <= EK[0][0]) return [EK[0][1], EK[0][2], 0];
    let i = 0; while (i < EK.length - 2 && t > EK[i + 1][0]) i++;
    const p0 = EK[Math.max(0, i - 1)], p1 = EK[i], p2 = EK[i + 1], p3 = EK[Math.min(EK.length - 1, i + 2)], f = clamp((t - p1[0]) / (p2[0] - p1[0]));
    const cr = (j) => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * f + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * f * f + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * f * f * f);
    const dx = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    return [cr(1), cr(2), dx];
  };
  // ---------------------------------------------------------------- turbine spin: the left half stops (10.02), turbine 5 slows (10.06)
  const stopL = (tt) => sineIO(span(tt, a.stopAll + .3, a.lose + .6)) * (1 - sineIO(span(tt, a.farm - .8, a.farm + 1.2)));
  const slow5 = (tt) => sineIO(span(tt, a.only + .5, a.slowd + .5)) * (1 - sineIO(span(tt, a.cutting, a.four + .6)));
  const spin = (k, tt) => { let s = 1; if (PR.TURB[k].x < 860) s *= 1 - stopL(tt); if (k === SLOW) s *= 1 - .9 * slow5(tt); return s; };
  // ---------------------------------------------------------------- camera
  const K = [[R34.t0 + 1.2, R34.cam(R34.t0 + 1.2)], [a.kill + 1, CT(1080, 440, 1.08)], [a.stopAll + .8, CT(860, 470, .98)], [a.what + 1.2, CT(880, 470, 1.0)],
    [a.cameras + .4, CT(1430, 460, 1.3)], [a.sky + .8, CT(1500, 420, 1.28)], [a.decides + .3, CT(1520, 430, 1.18)], [a.slowd + 1.2, CT(1350, 440, 1.12)],
    [a.four, CT(1060, 430, 1.0)], [a.here + .4, CT(940, 420, 1.02)], [tDrop0, CT(820, 440, 1.08)], [tDrop1 + 1, CT(780, 450, 1.12)]];
  const cam = (t) => B.drifted(t < R34.t0 + 1.2 ? R34.cam(t) : F.camPath(t, K), PR.Z_TURB, t, 1);
  // desert (inside the frame, then the screen)
  const KD = [[tDrop0, D.MC(900, 560, 1.0)], [tDrop1, D.MC(900, 545, .96)], [a.worked + .5, D.MC(900, 520, .66)], [R45.t0, R45.cam(R45.t0)]];
  const camD = (t) => (t >= R45.t0 ? R45.cam(t) : F.camPath(t, KD));
  const deskSt = (t) => ({ grid: span(t, tDrop0 + .4, tDrop1), tiles: (k) => tileFlag(k, t, a.wrong) * (1 - .0 * t), paths: 0 });

  // the frame round the eagle (screen rect) and its fall
  function frameAt(c, t) {
    const [ex, ey] = eagleAt(t), p = E.project(c, PR.Z_TURB, ex, ey); if (!p) return null;
    const snap = expoOut(span(t, a.blink + .25, a.blink + .55)), side = lerp(260, 120 * p[2], snap);
    const fall = sineIO(span(t, tDrop0, tDrop1)), cx = lerp(p[0], W / 2, fall), cy = lerp(p[1], H / 2, fall) + 160 * Math.sin(Math.PI * fall) * (1 - fall), sz = lerp(side, W, fall);
    return { x: cx - sz / 2, y: cy - sz / 2, w: sz, cx, cy, snap, fall };
  }
  function drawFrame(ctx, r, a0) {
    ctx.save(); ctx.strokeStyle = rgba(F.COOL.line, .9 * a0); ctx.lineWidth = 2.5; const q = r.w * .22;
    for (const [x, y, dx, dy] of [[r.x, r.y, 1, 1], [r.x + r.w, r.y, -1, 1], [r.x, r.y + r.w, 1, -1], [r.x + r.w, r.y + r.w, -1, -1]]) { ctx.beginPath(); ctx.moveTo(x + dx * q, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * q); ctx.stroke(); }
    ctx.restore();
  }

  return (ctx, t) => {
    if (t >= tDrop1) { D.desertMap(ctx, B.drifted(camD(t), E.F0, t, sineIO(span(t, tDrop1, tDrop1 + 1.5))), t, deskSt(t)); F.lampRail(ctx, t, T); return; }
    const c = cam(t), [ex, ey, edx] = eagleAt(t);
    const eyeA = expoOut(span(t, a.cameras - .1, a.cameras + .6));
    // the camera's look: toward the eagle once it has found it
    const eyeP = E.project(c, PR.Z_TOWER, ...PR.towerEye()), ep = E.project(c, PR.Z_TURB, ex, ey);
    const toEagle = eyeP && ep ? Math.atan2(ep[1] - eyeP[1], ep[0] - eyeP[0]) : -2.2;
    const sweep = lerp(-1.35, -2.3, sineIO(span(t, a.sky - .6, a.sky + .9)));
    const look = lerp(sweep, toEagle, sineIO(span(t, a.blink - .3, a.blink + .4)));
    PR.prairie(ctx, c, t, {
      dawn: .5, spin, slow: SLOW, slowGlow: slow5(t),
      eye: { a: eyeA, ang: look, cone: span(t, a.sky - .9, a.sky) * (1 - span(t, a.study, a.study + 1.2)) * .9 },
      extraFar: (cx) => {
        if (t > a.turb - .3 && t < tDrop1) B.eagle(cx, t, ex, ey, 115, { dir: edx < 0 ? -1 : 1, flap: span(t, a.die - 1, a.die) * (1 - span(t, a.what, a.what + 1)) * .5 + .25 * F.bump(t, a.only - .5, 2), ph: t * 6, bank: clamp(edx * .0008, -.2, .2), rim: P.blue0, glow: .4 * span(t, a.decides, a.eagleq + .5) });
      },
    });
    // 10.02: the light line halves the farm
    const sp = sineIO(span(t, a.stopAll - .1, a.stopAll + .7)) * (1 - sineIO(span(t, a.what + 1.2, a.farm + .2)));
    if (sp > 0) {
      ctx.save(); ctx.strokeStyle = rgba(P.cream, .8); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H * sp * .9); ctx.stroke(); ctx.restore();
      const l1 = span(t, a.stopAll + .2, a.stopAll + .9) * sp, l2 = span(t, a.stopNone, a.stopNone + .7) * sp;
      if (l1 > 0) F.maskLine(ctx, [['ALL STOPPED', 0]], W * .25, 230, 40, F.rise(l1), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
      if (l2 > 0) F.maskLine(ctx, [['NONE STOPPED', 0]], W * .75, 230, 40, F.rise(l2), { serif: false, weight: 600, align: 'center', col: P.cream, glow: false });
      const pw = 1 - sineIO(span(t, a.lose, a.lose + 1.2));
      if (l1 > 0) F.slab(ctx, t, 300, 880, 520 * Math.max(.02, pw), 26, { col: pw > .5 ? 'warm' : 'cool', u: l1, label: 'POWER', a: l1 });
      if (l2 > 0) for (let k = 0; k < 3; k++) { const fall = k === 1 ? expoIn(span(t, a.die - .1, a.die + 1.0)) : 0, x = 1250 + k * 150, y = 880 + 260 * fall; B.eagle(ctx, t, x, y, 90, { a: l2 * (1 - span(fall, .5, 1)), col: mixHex(P.halo2, P.shade0, .2), bank: 2.2 * fall, dir: 1 }); }
      if (l2 > 0) F.maskLine(ctx, [['EAGLES', 0]], 1090, 890, 24, F.rise(l2), { serif: false, weight: 600, align: 'right', col: P.halo2, glow: false });
    }
    F.realStamp(ctx, t, a.farm + .9, a.blink - .3, 'identiflight');
    // 10.05–10.08: the frame round the eagle
    const fr = frameAt(c, t);
    if (fr && t > a.blink + .2) {
      const dim = 1 - .55 * span(t, a.study + .3, a.study + 1) * (1 - span(t, a.here - .4, a.here + .3));
      if (fr.fall > 0) { // the desert from above, inside the falling frame
        const k = fr.w / W; ctx.save(); ctx.beginPath(); ctx.rect(fr.x, fr.y, fr.w, fr.w); ctx.clip();
        E.withOuter({ k, e: fr.cx - W / 2 * k, f: fr.cy - H / 2 * k }, () => D.desertMap(ctx, camD(t), t, deskSt(t))); ctx.restore();
      }
      drawFrame(ctx, fr, fr.snap * dim * (1 - span(fr.fall, .8, 1)));
      const q1 = span(t, a.blink + .5, a.blink + 1.1) * (1 - span(t, a.eagleq - .1, a.eagleq + .2)), q2 = span(t, a.eagleq, a.eagleq + .5) * (1 - span(t, a.slowd + .6, a.slowd + 1.2));
      const lx = fr.x + fr.w + 14, ly = fr.y + 18;
      if (q1 > 0) F.maskLine(ctx, [['EAGLE?', 0]], lx, ly, 26, F.rise(q1), { serif: false, weight: 600, col: F.COOL.text, glow: false });
      if (q2 > 0) { F.maskLine(ctx, [['YES', 1]], lx, ly, 26, F.rise(q2), { serif: false, weight: 600, col: P.cream, glow: false }); F.maskLine(ctx, [['≈ 0.4 S', 0]], lx, ly + 30, 20, F.rise(span(q2, .3, 1)), { serif: false, weight: 600, col: P.halo2, glow: false }); }
    }
    // 10.07: five eagle marks, four go out: −82 %; the bracket of the caveat
    const mk = span(t, a.study + .3, a.study + 1.1) * (1 - span(t, a.here - .2, a.here + .5));
    if (mk > 0) {
      for (let k = 0; k < 5; k++) { const out = k < 4 ? sineIO(span(t, a.cutting + .2 + k * .35, a.cutting + .8 + k * .35)) : 0;
        B.eagle(ctx, t, 700 + k * 130, 250, 84, { a: mk * (1 - .82 * out), col: mixHex(mixHex(P.halo2, P.shade0, .2), P.blue1, out) }); }
      const pu = span(t, a.four + .2, a.four + .9) * mk;
      if (pu > 0) { F.maskLine(ctx, [['−82 %', 1]], 1400, 268, 56, F.rise(pu), { serif: false, weight: 600 }); F.maskLine(ctx, [['EAGLE DEATHS', 0]], 1402, 304, 20, F.rise(pu), { serif: false, weight: 600, col: P.halo2, glow: false }); }
      F.bracket(ctx, 640, 1220, 330, span(t, a.other + .2, a.other + 1.0) * mk, 'ONE WIND FARM: NOT YET PROVEN', { size: 24 });
    }
    F.source(ctx, t, a.cutting, a.here, F.SOURCES.identiflight);
    F.lampRail(ctx, t, T);
  };
}
