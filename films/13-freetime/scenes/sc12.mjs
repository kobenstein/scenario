// c12 · the right ones, waking up, letting go, end screen (04a rest) · 612.74–655.36 · low morning sun · ★ 12.05 (you sit down with your grandmother)
// Builder B3. Explainers ≈ 16 % (32 % without the end screen). Starts on the c11 field (the three signs sink away).
//
// | beat | time | anchor | picture | hero | moves | transition → carrier · position · direction |
// |---|---|---|---|---|---|---|
// | A EXPL | 612.74–619.15 | billion 614.02 · robots 614.42 · many 616.90 · right 618.10 · ones 618.42 | the forecast curve once more, dotted to `~1 billion`; on "many" the dots fall and go out; three stay and land as robots by a vine, a hall, a house | the dots | draw · fall · land | push into the house window, iris · lower right → centre · in |
// | B 3D   | 619.15–622.74 | there 620.58 · done 622.10 | the kitchen at low sun: open window (the garden and the sun in it), steam from the kettle; at the sink the robot sets the last cup in the rack | window | push · steam · the cup | truck right along you |
// | C ★ 3D | 622.74–626.58 | table 623.98 · her 625.78 | you walk in with two full cups, sit down with your grandmother, slide one cup to her; both look up into the light | you | walk · sit · cup | flight through the open window · centre · forward |
// | D 3D   | 626.58–630.62 | garden 627.58 · alive 628.70 | the garden: trees, flowers, bees, a bird; the valley in the sun | sun | flight · bird | the camera finds you on the path |
// | E 3D   | 630.62–634.46 | walk 631.58 · go 633.82 | on the garden path you lead the robot by the hand; on "go" you let go, it walks on alone through the gate | the hands | walk · let go | the crane begins · up |
// | F 3D   | 634.46–655.36 | (end screen) | crane up and back: a field of young trees and hands of light, they light where the robot passes; robot small in the centre band; living hold from 640.5 | sun | crane · lighting | film end |
// End screen: free areas left x 80–700, right x 1220–1840, y 140–900 stay calm (sky, hills, dim field); the action stays in x 760–1160.
import * as B from '../lib/f10_c08_b3.mjs';
import sc11 from './sc11.mjs';
import * as D1 from '../lib/f10_c01_draw.mjs';
import { Path2D, PathOp } from '@napi-rs/canvas';
const { E, P, M, W, H, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, quartIO, halo, trail, catmull } = B;
const { card, cam3, aim, camAt, camDrift, project, F0 } = E;
const snap = (u) => expoOut(u) * smooth(clamp(u / .25));
// two-bone reach (angles from straight down, sin → x): shoulder S, target T, lengths l1 l2, bend −1 = elbow below a reach to +x
const ik = (S, T, l1, l2, bend) => {
  const dx = T[0] - S[0], dy = T[1] - S[1], d = Math.min(Math.hypot(dx, dy), (l1 + l2) * .995), th = Math.atan2(dx, dy);
  const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), s1 = th + bend * a, el = [S[0] + Math.sin(s1) * l1, S[1] + Math.cos(s1) * l1];
  return [s1, Math.atan2(T[0] - el[0], T[1] - el[1])];
};
const mixCam = (a, b, u) => ({ ...a, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u) });
const DUC = { lit: E.COAT.lit, base: E.COAT.base, shade: E.COAT.shade, deep: E.COAT.deep, rim: mixHex(P.coat, P.core1, .75) };

export default async (T, R) => {
  E.prepareEditorial();
  const w = B.wordAt(T);
  const A = {
    t0: R.a, billion: w('billion', 614.02), robots: w('robots', 614.42), maybe: w('maybe', 615.54), many: w('many', 616.90), want: w('want', 617.82), right: w('right', 618.10), ones: w('ones', 618.42),
    picture: w('picture', 619.62), there: w('there', 620.58), dishes: w('dishes', 621.62), done: w('done', 622.10), your: w('your', 622.74), table: w('table', 623.98), time: w('time', 625.06), sit: w('sit', 625.46), her: w('her', 625.78),
    outside: w('outside', 626.58), garden: w('garden', 627.58), alive: w('alive', 628.70), teaching: w('teaching', 630.86), walk: w('walk', 631.58), now: w('now', 632.38), go: w('go', 633.82), b: R.b,
  };
  // c11 draws on until its three signs have sunk away
  const c11 = (await sc11(T, { a: 560.90, b: R.a }))[0].draw;

  // ================= A: the forecast, the many, the right ones (design = screen) =================
  const CH = { x: 360, y: 300, w: 1140, h: 440 };
  const DATA = [[2025, .002], [2028, .012], [2031, .035], [2034, .075], [2037, .14], [2040, .24], [2043, .38], [2046, .58], [2050, 1]];
  const mapC = ([yr, v]) => [CH.x + (yr - 2025) / 25 * CH.w, CH.y + CH.h - v * CH.h];
  const CP = catmull(DATA.map((p) => [...mapC(p), 4]), 12);
  const cum = [0]; for (let i = 1; i < CP.length; i++) cum.push(cum[i - 1] + Math.hypot(CP[i][0] - CP[i - 1][0], CP[i][1] - CP[i - 1][1]));
  const LEN = cum[cum.length - 1];
  const atF = (f) => { const d = f * LEN; let i = 1; while (i < cum.length - 1 && cum[i] < d) i++; const u = (d - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]); return [lerp(CP[i - 1][0], CP[i][0], u), lerp(CP[i - 1][1], CP[i][1], u)]; };
  const iToday = CP.findIndex((p) => p[0] >= mapC([2026.5, 0])[0]), F_TODAY = cum[iToday] / LEN;
  const NDOT = 26, DOTS = [];
  for (let i = 0; i < NDOT; i++) { const f = lerp(F_TODAY + .035, 1, i / (NDOT - 1)); DOTS.push({ f, p: atF(f) }); }
  const PL = [[560, 'vine'], [960, 'factory'], [1360, 'house']], PY = 790;
  const KEEP = PL.map(([px]) => { let b = 0; DOTS.forEach((d, i) => { if (Math.abs(d.p[0] - px) < Math.abs(DOTS[b].p[0] - px)) b = i; }); return b; });
  const drawU = (t) => sineIO(span(t, A.billion - .55, A.robots + .05));
  const HOUSE = [PL[2][0] - 50, PY, 130], HWIN = [HOUSE[0] + .21 * HOUSE[2], HOUSE[1] + .11 * HOUSE[2]];
  const T_IA0 = A.ones + .75, T_IA1 = T_IA0 + 1.0;
  const KA = [[A.t0, { s: 1, x: 960, y: 540 }], [A.many, { s: 1.035, x: 985, y: 522 }], [A.ones + .2, { s: 1, x: 960, y: 560 }], [T_IA0 + .55, { s: 2.6, x: HWIN[0], y: HWIN[1] }, 'i', HWIN]];
  const vA = (t) => B.vDrift(B.viewAt(t, KA), t, .35, 251);

  // ================= B–D: the kitchen (design = screen at home) =================
  const WALL = 2600, CNT = 2150, WIN = { x: 770, y: 150, w: 380, h: 450 }, WINC = [960, 375];
  const ROBK = [1490, 778, 330], SLOT = [1652, 574], KET = [1300, 606];
  const TBL = { x0: 760, x1: 1120, top: 752, foot: 905 }, GR = [1186, 905, 318], DUH = 330, SEAT = 822;
  const T_FLY = A.garden + .42;
  const HW0 = B.viewToScreen(vA(T_IA0 + .2), HWIN[0], HWIN[1]);
  const KK = [[T_IA0, aim(WALL, WINC[0], WINC[1], .5, HW0[0], HW0[1])], [T_IA1 + .45, cam3({ x: 380, y: 10, z: 180 }), 's'], [A.done + .3, cam3({ x: 430, y: 20, z: 290 })],
    [A.table + .15, cam3({ x: -60, y: 30, z: 300 }), 's'], [A.her - .08, cam3({ x: -20, y: 10, z: 360 })], [T_FLY, aim(WALL, WINC[0], WINC[1], 5.5), 's']];
  const camK = (t) => camDrift(camAt(t, KK, WALL), t, .5 * (1 - span(t, A.her + .1, T_FLY)), 261);
  // you: walk in with the tray, sit, set it down, slide one cup to her
  const T_DW0 = A.done + .15, T_DW1 = A.table - .25, X_W0 = 150, X_W1 = 683;
  const duX = (t) => lerp(X_W0, X_W1, smooth(span(t, T_DW0, T_DW1)) * .25 + span(t, T_DW0, T_DW1) * .75) + 32 * smooth(span(t, A.table - .2, A.table + .55));
  const sitK = (t) => span(t, A.table - .2, A.table + .6);
  const TRAY_T = [808, TBL.top - 4];
  const trayAt = (t) => {   // world position of the tray (centre of its bottom)
    const x = duX(t), dr = .17 * smooth(sitK(t)), carry = [x + .3 * DUH, TBL.foot - (.52 - dr) * DUH], k = sineIO(span(t, A.table + .3, A.table + .95));
    return [lerp(carry[0], TRAY_T[0], k), lerp(carry[1], TRAY_T[1], k)];
  };
  const CUP2_T = [1056, TBL.top - 4];
  const cup2At = (t) => { const tr = trayAt(t), k = sineIO(span(t, A.sit - .15, A.her + .15)); return [lerp(tr[0] + 20, CUP2_T[0], k), lerp(tr[1] - 6, CUP2_T[1], k) - Math.sin(Math.PI * k) * 6]; };
  const lookK = (t) => smooth(span(t, A.her + .25, A.outside + .5));

  // ================= D–F: the garden (a pinhole space: ground at Y 360, camera at home = 0,0,0) =================
  const GY = (Z) => 540 + 360 * F0 / Z, GXs = (X, Z) => 960 + X * F0 / Z;
  const onG = (ctx, c, X, Z, fn) => card(ctx, c, Z, () => fn(GXs(X, Z), GY(Z), F0 / Z));
  const pathX = (Z) => Z < 1700 ? -1100 - (1700 - Z) * 1.5 : Z < 3000 ? -1100 * (1 - smooth(clamp((Z - 1700) / 1300))) : 150 * Math.sin((Z - 3000) / 2300);
  // the pair on the path: Z from 1550 (off-frame left) to 2650 (you stop on "go"), the robot at your right; then the robot on alone
  const T_P0 = A.alive - .4, T_GO = A.go;
  const pairZ = (t) => lerp(1550, 2650, span(t, T_P0, T_GO) * .92 + .08 * smooth(span(t, T_P0, T_GO)));
  const duG = (t) => { const Z = t < T_GO ? pairZ(t) : 2650 + 26 * smooth(span(t, T_GO - .1, T_GO + .6)); return [pathX(Z) - 95, Z]; };
  // the robot: same walk to "go", then on through the gate and into the field, slowing to a stroll (never quite still)
  const RZT = []; { let Z = 2650, X = 0; for (let k = 0; k <= 2600; k++) { const t = T_GO + k * .01; const v = t < 642 ? 330 + 60 * smooth(span(t, T_GO, T_GO + 1.2)) : lerp(390, 95, smooth(span(t, 642, 651))); RZT.push(Z); Z += v * .01; } }
  const robZ = (t) => { if (t < T_GO) return pairZ(t); const k = Math.min(RZT.length - 1, (t - T_GO) / .01), i = Math.floor(k); return lerp(RZT[i], RZT[Math.min(i + 1, RZT.length - 1)], k - i); };
  const robG = (t) => { const Z = robZ(t), off = 100 * (1 - smooth(clamp((Z - 2650) / 350))); return [pathX(Z) + off, Z]; };
  const walkPh = (dist, h) => dist / (h * .5) * Math.PI;
  // the field of young trees and hands of light (seeded), lit as the robot passes
  const rnd = E.prng(1207), FIELD = [];
  for (let i = 0; i < 400 && FIELD.length < 66; i++) {
    const Z = 3500 + Math.pow(rnd(), 1.25) * 8500, X = (rnd() * 2 - 1) * 1250 * (Z + 450) / F0;
    if (Math.abs(X - pathX(Z)) < 150 + Z * .012) continue;
    const side = Math.abs(X * F0 / (Z + 450));   // distance from the centre in the end frame
    FIELD.push({ X, Z, kind: rnd() < .6 ? 'hand' : 'tree', s: .8 + rnd() * .45, ph: rnd() * 6.28, side, flip: rnd() < .5 ? 1 : -1 });
  }
  FIELD.sort((a, b) => b.Z - a.Z);
  const ZSTOP = RZT[RZT.length - 1];
  const tAtZ = (Z) => { if (Z <= 2650) return T_GO; for (let k = 0; k < RZT.length; k++) if (RZT[k] >= Z) return T_GO + k * .01; return T_GO + RZT.length * .01 + (Z - ZSTOP) / 400; };
  FIELD.forEach((f) => { let best = 1e9; for (let k = 0; k < RZT.length; k += 10) { const tt = T_GO + k * .01 + (Math.abs(f.Z - RZT[k]) + Math.abs(f.X - pathX(RZT[k]))) / 1300; if (tt < best) best = tt; } f.tl = best; });
  const FLOWERS = []; { const r2 = E.prng(733); for (let i = 0; i < 34; i++) { const Z = 1750 + r2() * 1100, side = r2() < .5 ? -1 : 1; FLOWERS.push({ X: pathX(Z) + side * (130 + r2() * 420), Z, h: 70 + r2() * 90, ph: r2() * 6.28, warm: r2() < .7 }); } FLOWERS.sort((a, b) => b.Z - a.Z); }
  const HP = E.handPath({ pose: 'open' });
  // garden cameras: through the window (far back), the flight, the locked shot on the path, the crane, the end frame
  const G0 = cam3({ x: 0, y: -60, z: -900 }), GM = cam3({ x: -30, y: -20, z: -260 });
  const END = cam3({ x: 0, y: -260, z: -450 });
  // E: a locked medium shot along the path (the pair walks through it, left → centre); F: the crane, then a very slow push on
  const GE = cam3({ x: -600, y: 140, z: 400 }), END2 = cam3({ x: 0, y: -250, z: -300 });
  const T_C0 = T_GO + .1, T_C1 = T_C0 + 6.6;
  // the living end hold: a soft wind runs through the field from the left, light motes drift in the sun
  const LIVE = (t) => smooth(span(t, T_C1 - 1.5, T_C1 + 1.5));
  const gust = (X, t) => LIVE(t) * (.55 + .45 * Math.sin(t * .23)) * Math.sin(X / 700 - t * 1.1);
  const KGa = [[A.her + .1, G0], [T_FLY, GM, 's'], [A.alive + 1.2, GE, 's']];
  const camG = (t) => {
    let c;
    if (t < T_C0) c = camAt(t, KGa, 3000);
    else if (t < T_C1) c = mixCam(GE, END, sineIO(span(t, T_C0, T_C1)));
    else c = mixCam(END, END2, sineIO(span(t, T_C1, A.b + .5)));
    return camDrift(c, t, t < T_C1 ? .6 : .6 + 1.2 * LIVE(t), 271);
  };

  const draw = (ctx, t) => {
    if (t < T_IA0) { explA(ctx, t); return; }
    if (t < T_IA1 + .2) { const c = camK(t), [x, y] = project(c, WALL, WINC[0], WINC[1]); B.irisWorld(ctx, x, y, B.irisR(span(t, T_IA0, T_IA1), 10, x, y), () => kitchen(ctx, t, c), () => explA(ctx, t), { t }); return; }
    if (t < T_FLY) { kitchen(ctx, t, camK(t)); return; }
    garden(ctx, t, camG(t));
  };

  // ---------- A ----------
  function explA(ctx, t) {
    if (t < A.t0 + 1.2) c11(ctx, t); else B.fieldFill(ctx, { t });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.applyView(ctx, vA(t));
    const co = 1 - smooth(span(t, A.many + .25, A.want + .1)), ax = sineIO(span(t, A.t0 + .2, A.t0 + 1.0));
    if (ax > 0 && co > 0) {
      ctx.save(); ctx.globalAlpha = co; ctx.strokeStyle = rgba(P.blue1, .8); ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(CH.x, CH.y + CH.h - CH.h * ax); ctx.lineTo(CH.x, CH.y + CH.h); ctx.lineTo(CH.x + CH.w * ax, CH.y + CH.h); ctx.stroke(); ctx.restore();
      B.write(ctx, '2025', CH.x, CH.y + CH.h + 50, span(t, A.t0 + .6, A.t0 + 1.1), { size: B.SZ.small, col: P.halo2, glow: false, a: co });
      B.write(ctx, '2050', CH.x + CH.w, CH.y + CH.h + 50, span(t, A.t0 + .9, A.t0 + 1.4), { size: B.SZ.small, col: P.halo2, glow: false, a: co });
    }
    const u = drawU(t);
    if (u > 0 && co > 0) { ctx.save(); ctx.globalAlpha = co; trail(ctx, CP.slice(0, iToday + 1), clamp(u / F_TODAY), { w: 4, spark: u < F_TODAY }); ctx.restore(); }
    // the dots: lit as the head passes; on "many" they fall and go out, three stay and land as robots
    DOTS.forEach((d, i) => {
      const a0 = smooth(span(u, d.f - .03, d.f + .01)); if (a0 <= 0) return;
      const keep = KEEP.indexOf(i);
      let [x, y] = d.p, a = a0;
      if (keep < 0) {
        const tf = A.many - .3 + (1 - i / NDOT) * .5, tau = Math.max(0, t - tf), yb = CH.y + CH.h, th = Math.sqrt(Math.max(0, yb - d.p[1]) / 1100);
        y = Math.min(yb, d.p[1] + 1100 * tau * tau);
        if (tau > th) { const o = span(tau - th, 0, .45); a *= 1 - smooth(o); if (o > 0 && o < 1) { ctx.save(); ctx.strokeStyle = rgba(P.halo0, .7 * (1 - o)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, yb, 6 + o * 34, 2 + o * 7, 0, 0, 6.29); ctx.stroke(); ctx.restore(); } }
        if (a <= .01) return;
      } else {
        const [px] = PL[keep], k = quartIO(span(t, A.right - .3 + keep * .06, A.ones + .2 + keep * .06)), tx = px + 70, ty = PY;
        x = lerp(d.p[0], tx, k); y = lerp(d.p[1], ty, k) - Math.sin(Math.PI * k) * 70;
        if (k >= 1) return;   // it has become its robot
      }
      halo(ctx, x, y, 18, .75 * a, P.halo1, P.core0);
      ctx.fillStyle = rgba(P.core1, a); ctx.beginPath(); ctx.arc(x, y, 4.8, 0, 6.29); ctx.fill();
    });
    const head = DOTS.reduce((b, d) => d.f <= u ? d : b, null);
    if (head && u < 1 && u > F_TODAY) halo(ctx, head.p[0], head.p[1], 40, .6);
    if (u >= 1 && co > 0) halo(ctx, DOTS[NDOT - 1].p[0], DOTS[NDOT - 1].p[1], 44, .55 * co * (1 - smooth(span(t, A.many - .4, A.many))));
    // the three places, the three robots
    PL.forEach(([px, kind], i) => {
      const g = snap(span(t, A.ones - .35 + i * .08, A.ones + .25 + i * .08)); if (g <= 0) return;
      if (kind === 'vine') vine(ctx, px - 50, PY, 130 * g, t); else E.icon(ctx, kind, px - 50, PY, 130 * g, t, { lit: 1, dust: 0, seed: 300 + i });
      const f = span(t, A.ones + .2 + i * .06, A.ones + .85 + i * .06);
      if (f > 0) E.icon(ctx, 'robot', px + 70, PY, 104, t, { u: f, lit: 1, dust: 0, seed: 310 + i });
    });
    ctx.restore();
    // words (screen)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (co > 0) {
      B.write(ctx, '~1 billion', CH.x, 214, span(t, A.robots - .25, A.robots + .35), { serif: true, size: 110, align: 'left', a: co });
      B.write(ctx, 'robots by 2050 · forecast', CH.x + 4, 262, span(t, A.robots, A.robots + .5), { size: B.SZ.small, align: 'left', col: P.halo2, glow: false, a: co });
    }
    const ro = 1 - smooth(span(t, T_IA0 - .1, T_IA0 + .3));
    if (ro > 0) B.write(ctx, 'the right ones', 960, 250, span(t, A.right - .2, A.right + .4), { serif: true, size: 92, a: ro });
    ctx.restore();
  }
  function vine(ctx, x, y, s, t) {   // a bunch of grapes and a leaf: the vineyard (as in c10)
    let p = null; for (const [u, v] of [[-.14, -.1], [0, -.1], [.14, -.1], [-.07, .04], [.07, .04], [0, .18], [-.2, -.24], [-.06, -.24], [.08, -.24]]) { const c = new Path2D(); c.arc(x + u * s, y + (v + .12) * s, .085 * s, 0, 6.29); p = p ? p.op(c, PathOp.Union) : c; }
    const lf = new Path2D(); lf.moveTo(x + .02 * s, y - .32 * s); lf.quadraticCurveTo(x + .32 * s, y - .5 * s, x + .38 * s, y - .2 * s); lf.quadraticCurveTo(x + .2 * s, y - .16 * s, x + .02 * s, y - .32 * s); p = p.op(lf, PathOp.Union);
    E.lightShape(ctx, p, t, { lit: 1, dust: 0, seed: 170 });
  }

  // ---------- B–D: the kitchen ----------
  function kitchen(ctx, t, c) {
    garden(ctx, t, camG(t), t < A.her + .1);          // seen through the open window (in full once the flight begins)
    card(ctx, c, WALL, () => wall(ctx, t));
    card(ctx, c, CNT, () => counter(ctx, t));
    const ba = 1 - smooth(span(t, A.outside + .1, T_FLY - .35));
    if (ba > 0) card(ctx, c, 2380, () => beam(ctx, t, ba));
    card(ctx, c, F0, () => tableScene(ctx, t));
    card(ctx, c, 1150, () => fgPlant(ctx, t));
  }
  function wall(ctx, t) {
    const wl = new Path2D(); wl.rect(-3000, -2400, 8000, 2400 + 761); wl.rect(WIN.x, WIN.y, WIN.w, WIN.h);
    ctx.save(); ctx.clip(wl, 'evenodd');
    ctx.fillStyle = lin(ctx, 0, -300, 0, 760, [[0, P.night1], [.55, P.ind0], [1, mixHex(P.ind1, P.shade0, .2)]]); ctx.fillRect(-3000, -2400, 8000, 3200);
    ctx.fillStyle = rad(ctx, WINC[0], WINC[1] + 60, 1100, [[0, rgba(P.halo1, .55)], [.2, rgba(P.halo2, .32)], [.55, rgba(P.blue0, .2)], [1, rgba(P.blue0, .05)]]); ctx.fillRect(-3000, -2400, 8000, 3200);
    // upper cabinets (left), a shelf with plates (right)
    ctx.fillStyle = mixHex(P.night1, P.ind0, .35); ctx.fillRect(1270, 190, 610, 170);
    ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 2; for (const x of [1473, 1676]) { ctx.beginPath(); ctx.moveTo(x, 196); ctx.lineTo(x, 354); ctx.stroke(); }
    ctx.fillStyle = rgba(P.halo1, .45); ctx.fillRect(1270, 357, 610, 3);
    ctx.fillStyle = mixHex(P.night1, P.ind0, .4); ctx.fillRect(250, 330, 380, 12);
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(280 + i * 58, 300, 9, 30, 0, 0, 6.29); ctx.fillStyle = mixHex(P.ind1, P.blue1, .3); ctx.fill(); ctx.strokeStyle = rgba(P.halo1, .4); ctx.stroke(); }
    ctx.restore();
    // the frame, the sill, the two casements swung open into the room
    ctx.save(); ctx.strokeStyle = mixHex(P.night1, P.ind0, .5); ctx.lineWidth = 16; ctx.strokeRect(WIN.x - 8, WIN.y - 8, WIN.w + 16, WIN.h + 16);
    ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 2.5; ctx.strokeRect(WIN.x + 1, WIN.y + 1, WIN.w - 2, WIN.h - 2); ctx.restore();
    ctx.fillStyle = mixHex(P.night1, P.ind0, .6); ctx.fillRect(WIN.x - 40, WIN.y + WIN.h + 8, WIN.w + 80, 18); ctx.fillStyle = rgba(P.halo0, .85); ctx.fillRect(WIN.x - 40, WIN.y + WIN.h + 8, WIN.w + 80, 3);
    const sway = Math.sin(t * .5) * 4;
    for (const s of [-1, 1]) {
      const hx = s < 0 ? WIN.x - 8 : WIN.x + WIN.w + 8, ox = s * (92 + sway), p = new Path2D();
      p.moveTo(hx, WIN.y - 6); p.lineTo(hx + ox, WIN.y + 26); p.lineTo(hx + ox, WIN.y + WIN.h - 26); p.lineTo(hx, WIN.y + WIN.h + 6); p.closePath();
      ctx.fillStyle = rgba(P.blue1, .35); ctx.fill(p); ctx.strokeStyle = mixHex(P.night1, P.ind0, .5); ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.stroke(p);
      ctx.strokeStyle = rgba(P.halo0, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + ox, WIN.y + 26); ctx.lineTo(hx + ox, WIN.y + WIN.h - 26); ctx.stroke();
    }
    // the floor and the light pool from the window
    ctx.fillStyle = lin(ctx, 0, 760, 0, 1300, [[0, mixHex(P.ind1, P.shade0, .25)], [.3, P.ind0], [1, P.night0]]); ctx.fillRect(-3000, 760, 8000, 3000);
    E.lightPool(ctx, WIN.x + 10, WIN.x + WIN.w - 10, 764, 260, 420, .85);
  }
  function counter(ctx, t) {
    // counter, sink, stove with the kettle and its steam, the rack
    ctx.fillStyle = lin(ctx, 0, 606, 0, 780, [[0, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]); ctx.fillRect(1220, 606, 700, 172);
    ctx.fillStyle = rgba(P.halo1, .7); ctx.fillRect(1220, 604, 700, 3);
    ctx.strokeStyle = rgba(P.halo1, .2); ctx.lineWidth = 2; for (const x of [1400, 1620]) { ctx.beginPath(); ctx.moveTo(x, 616); ctx.lineTo(x, 770); ctx.stroke(); }
    ctx.fillStyle = P.night0; ctx.fillRect(1440, 604, 150, 8);
    ctx.strokeStyle = mixHex(P.night1, P.blue1, .4); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1515, 604); ctx.lineTo(1515, 548); ctx.quadraticCurveTo(1515, 532, 1538, 534); ctx.stroke();
    // kettle
    const k = new Path2D(); k.moveTo(KET[0] - 46, KET[1]); k.quadraticCurveTo(KET[0] - 54, KET[1] - 60, KET[0] - 20, KET[1] - 74); k.lineTo(KET[0] + 20, KET[1] - 74); k.quadraticCurveTo(KET[0] + 54, KET[1] - 60, KET[0] + 46, KET[1]); k.closePath();
    k.moveTo(KET[0] + 40, KET[1] - 40); k.lineTo(KET[0] + 84, KET[1] - 74); k.lineTo(KET[0] + 88, KET[1] - 68); k.lineTo(KET[0] + 46, KET[1] - 26); k.closePath();
    ctx.fillStyle = lin(ctx, KET[0] - 50, 0, KET[0] + 50, 0, [[0, P.night1], [1, mixHex(P.ind1, P.blue1, .4)]]); ctx.fill(k);
    ctx.save(); ctx.clip(k); ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 4; ctx.translate(3, 1); ctx.stroke(k); ctx.restore();
    ctx.fillStyle = P.night0; ctx.fillRect(KET[0] - 10, KET[1] - 84, 20, 10);
    steam(ctx, KET[0] + 88, KET[1] - 72, t, 230, 1);
    // the rack: plates and the cups already done
    ctx.save(); ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1620, 604); ctx.lineTo(1620, 560); ctx.moveTo(1750, 604); ctx.lineTo(1750, 560); ctx.moveTo(1616, 590); ctx.lineTo(1754, 590); ctx.stroke();
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(1680 + i * 18, 572, 7, 30, -.12, 0, 6.29); ctx.fillStyle = mixHex(P.ind1, P.blue1, .4); ctx.fill(); ctx.strokeStyle = rgba(P.halo1, .5); ctx.stroke(); }
    ctx.restore();
    D1.cup(ctx, 1632, 602, 26, { lit: .3 });
    // the robot at the sink: it sets the last cup into the rack on "done"
    const reach = quartIO(span(t, A.dishes - .3, A.done - .03)), back = sineIO(span(t, A.done + .2, A.done + 1.0));
    const Tw = [.3 + Math.sin(t * 5.2) * .025 * (1 - reach), -.5 + Math.cos(t * 5.2) * .015 * (1 - reach)], Tr = [(SLOT[0] - ROBK[0]) / ROBK[2], (SLOT[1] - ROBK[1]) / ROBK[2]], Tz = [.24, -.43];
    const tg = reach < 1 || back <= 0 ? [lerp(Tw[0], Tr[0], reach), lerp(Tw[1], Tr[1], reach)] : [lerp(Tr[0], Tz[0], back), lerp(Tr[1], Tz[1], back)];
    const armR = ik([.175, -.79], tg, .165, .21, -1);
    E.castShadow(ctx, ROBK[0], ROBK[1], 60, 120, .5, .35);
    const rh = E.robot(ctx, ROBK[0], ROBK[1], ROBK[2], { dir: 1, light: -1, rim: P.halo0, body: P.night1, hand: 'hand', armR, armL: [-.12, -.06] });
    const held = t < A.done;
    if (held) D1.cup(ctx, rh.R[0], rh.R[1] + 22, 26, { lit: .4 }); else D1.cup(ctx, SLOT[0], SLOT[1] + 26, 26, { lit: .4 });
    if (!held) { const f = span(t, A.done, A.done + .5); if (f < 1) halo(ctx, SLOT[0], SLOT[1] + 14, 30, .5 * (1 - f), P.halo1, P.core0); }
    // status light on the chest (calm cyan: it works, it asks first)
    halo(ctx, ROBK[0] + .05 * ROBK[2], ROBK[1] - .74 * ROBK[2], 10, .6, M.cyanD, M.cyan);
  }
  function steam(ctx, x, y, t, hgt, a) {   // wisps rising from a spout, lit by the window
    ctx.save(); ctx.lineCap = 'round'; ctx.filter = 'blur(5px)';
    for (let s = 0; s < 4; s++) {
      const ph = t * .9 + s * 1.7, pts = [];
      for (let i = 0; i <= 18; i++) { const f = i / 18, yy = y - f * hgt * (.75 + .25 * Math.sin(s * 2.1)); pts.push([x + Math.sin(f * 4.2 + ph * 1.6) * 18 * f + f * 30, yy]); }
      ctx.strokeStyle = rgba(P.halo2, .22 * a * (1 - (s % 2) * .35)); ctx.lineWidth = 10 - s; ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of pts.slice(1)) ctx.lineTo(...p); ctx.stroke();
    }
    ctx.restore();
  }
  function beam(ctx, t, a) {   // the low sun's beam: from the window down onto the table
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(18px)';
    const p = new Path2D(); p.moveTo(WIN.x + 40, WIN.y + 40); p.lineTo(WIN.x + WIN.w - 20, WIN.y + 40); p.lineTo(1150, 940); p.lineTo(680, 940); p.closePath();
    ctx.fillStyle = lin(ctx, 0, WIN.y, 0, 940, [[0, rgba(P.halo1, .18 * a)], [.6, rgba(P.halo2, .1 * a)], [1, rgba(P.halo2, 0)]]); ctx.fill(p);
    ctx.restore();
    B.dust(ctx, 91, 2200, 930, 640, 200, 230, t, .7 * a, P.halo1);
  }
  function tableScene(ctx, t) {
    // chairs
    const chair = (x, s) => { ctx.fillStyle = mixHex(P.night1, P.ind0, .3); ctx.fillRect(x - 34, SEAT, 68, 10); ctx.fillRect(x - 30, SEAT + 10, 6, TBL.foot - SEAT - 10); ctx.fillRect(x + 24, SEAT + 10, 6, TBL.foot - SEAT - 10);
      ctx.fillRect(x + s * 34 - (s > 0 ? 7 : 0), SEAT - 150, 7, 160); ctx.fillStyle = rgba(P.halo1, .45); ctx.fillRect(x - 34, SEAT, 68, 2); };
    chair(715, -1); chair(1194, 1);
    // you
    const x = duX(t), sk = sitK(t), walking = t < T_DW1, dist = Math.max(0, x - X_W0), dr = .17 * sk;
    const tr = trayAt(t), placed = t > A.table + .95;
    const loc = (P2) => [(P2[0] - x) / DUH, (P2[1] - TBL.foot) / DUH];
    const SR = [.095, -.735 + dr], SL = [-.095, -.735 + dr];
    let tR = [tr[0] + 22, tr[1] - 4], tL = [tr[0] - 22, tr[1] - 4];
    if (placed) {
      const c2 = cup2At(t), slide = span(t, A.sit - .35, A.her + .35), rest = [856, TBL.top - 6];
      const hand = slide <= 0 ? lerp2([tr[0] + 22, tr[1] - 4], rest, sineIO(span(t, A.table + .95, A.table + 1.5))) : slide < 1 ? [c2[0] - 12, c2[1] - 14] : lerp2([c2[0] - 12, c2[1] - 14], rest, sineIO(span(t, A.her + .35, A.her + 1.0)));
      tR = hand; tL = lerp2([tr[0] - 22, tr[1] - 4], [776, TBL.top - 6], sineIO(span(t, A.table + .95, A.table + 1.6)));
    }
    const armR = ik(SR, loc(tR), .17, .16, -1), armL = ik(SL, loc(tL), .17, .16, -1);
    if (t > T_DW0 - .05) B.fig(ctx, x, TBL.foot, DUH, { dir: 1, light: 1, colors: DUC, walk: walking ? walkPh(dist, DUH) : undefined, sit: sk, armR, armL, look: .1 + .55 * lookK(t) });
    // your grandmother (indigo, hair in a bun), seated at the far end; her hand takes the cup
    const g2 = cup2At(t), take = smooth(span(t, A.her + .05, A.her + .4)), lift = sineIO(span(t, A.her + .55, A.outside + .4)) * 14;
    const glo = (P2) => [(P2[0] - GR[0]) / -GR[2], (P2[1] - GR[1]) / GR[2]];
    const gT = lerp2([1108, TBL.top - 6 + Math.sin(t * .8) * 1.5], [g2[0] + 13, g2[1] - 14 - lift], take);
    const gArmR = ik([.095, -.735 + .17], glo(gT), .17, .16, -1), gArmL = ik([-.095, -.735 + .17], [.2, -.33 + .17], .17, .16, -1);
    B.fig(ctx, GR[0], GR[1], GR[2], { dir: -1, light: 1, sit: 1, hair: 'bun', armR: gArmR, armL: gArmL, look: .15 + .5 * smooth(span(t, A.her + .45, A.outside + .6)) });
    // the table, then the tray and the two full cups
    ctx.fillStyle = lin(ctx, 0, TBL.top, 0, TBL.foot, [[0, mixHex(P.night1, P.ind0, .55)], [1, P.night0]]);
    ctx.fillRect(TBL.x0, TBL.top, TBL.x1 - TBL.x0, 22); ctx.fillRect(TBL.x0 + 20, TBL.top + 22, 14, TBL.foot - TBL.top - 22); ctx.fillRect(TBL.x1 - 34, TBL.top + 22, 14, TBL.foot - TBL.top - 22);
    ctx.fillStyle = rgba(P.halo0, .85); ctx.fillRect(TBL.x0, TBL.top - 1, TBL.x1 - TBL.x0, 3);
    if (t > T_DW0 - .05) {
      ctx.fillStyle = mixHex(P.shade0, P.night1, .5); ctx.fillRect(tr[0] - 46, tr[1] - 5, 92, 6); ctx.fillStyle = rgba(P.halo1, .7); ctx.fillRect(tr[0] - 46, tr[1] - 6, 92, 2);
      D1.cup(ctx, tr[0] - 16, tr[1] - 5, 28, { lit: .8 }); D1.cup(ctx, g2[0], g2[1] - (t > A.her + .3 ? lift : 0), 28, { lit: .8 });
      steam(ctx, tr[0] - 16, tr[1] - 36, t + 3, 60, .7); steam(ctx, g2[0], g2[1] - 36 - (t > A.her + .3 ? lift : 0), t + 5, 60, .7);
    }
  }
  function fgPlant(ctx, t) {   // a dark potted plant, out of focus, low left
    ctx.save(); ctx.filter = 'blur(9px)'; ctx.fillStyle = rgba(P.night0, .92);
    ctx.beginPath(); ctx.moveTo(-60, 1300); ctx.lineTo(-40, 1010); ctx.lineTo(210, 1010); ctx.lineTo(230, 1300); ctx.fill();
    for (let i = 0; i < 7; i++) { const a = -2.4 + i * .28 + Math.sin(t * .7 + i) * .03, L = 260 + (i % 3) * 60; ctx.beginPath(); ctx.ellipse(85 + Math.cos(a) * L * .5, 1010 + Math.sin(a) * L * .5, L * .5, 26, a, 0, 6.29); ctx.fill(); }
    ctx.restore();
  }
  const blobs = (L) => { let p = null; for (const [x, y, rx, ry] of L) { const q = new Path2D(); q.ellipse(x, y, rx, ry, 0, 0, 6.29); p = p ? p.op(q, PathOp.Union) : q; } return p; };
  const lerp2 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

  // ---------- D–F: the garden ----------
  const BANDS = [
    [22000, (x) => 556 - 150 * smooth(clamp((Math.abs(x - 960) - 220) / 760)), mixHex(M.leaf0, M.dawnBlue, .55), mixHex(P.ind0, M.dawnBlue, .3), rgba(P.halo1, .45)],
    [14000, (x) => 584 - 80 * smooth(clamp((Math.abs(x - 960) - 380) / 900)) + Math.sin(x * .004) * 6, mixHex(M.leaf0, M.dawnBlue, .3), P.ind0, rgba(P.halo1, .5)],
    [9000, (x) => GY(9000) - 26 * smooth(clamp((Math.abs(x - 960) - 600) / 900)) + Math.sin(x * .006 + 1) * 4, mixHex(M.leaf1, P.ind0, .45), mixHex(P.ind0, P.night1, .5), rgba(M.leafLit, .5)],
    [6000, (x) => GY(6000) + Math.sin(x * .005 + 2) * 3, mixHex(M.leaf1, P.ind1, .4), P.night1, rgba(M.leafLit, .22)],
    [4200, (x) => GY(4200) + Math.sin(x * .004 + 3) * 3, mixHex(M.leaf1, P.ind1, .35), P.night1, rgba(M.leafLit, .2)],
    [3000, (x) => GY(3000), mixHex(M.leaf1, P.ind1, .3), P.night0, rgba(M.leafLit, .18)],
    [2200, (x) => GY(2200) + Math.sin(x * .003) * 3, mixHex(M.leaf1, P.ind1, .3), P.night0, rgba(M.leafLit, .18)],
  ];
  const BPTS = BANDS.map(([Z, f]) => { const pts = []; for (let x = -4200; x <= 6200; x += 160) pts.push([x, f(x)]); return pts; });
  function garden(ctx, t, c, lite = false) {
    card(ctx, c, 40000, () => {
      B.morningSky(ctx, 1, 600, { t, stars: false });
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(14px)';
      for (const [y, x0, w0, sp] of [[230, 300, 520, 6], [180, 1250, 420, 4], [420, 1450, 380, 5]]) { ctx.fillStyle = rgba(P.halo1, .1); ctx.fillRect(x0 + (t - 634) * sp, y, w0, 10); }   // no wrap: they only drift
      ctx.restore();
      B.sun(ctx, 960, 330, 92, t, { rays: true, dust: lite ? 0 : 2200 });
    });
    if (t > A.alive - .6) bird(ctx, t, c, A.alive - .6, 1500, 330, 300, 250);
    if (t > 645) bird(ctx, t, c, 645, 1500, 240, 1300, 300);
    BANDS.forEach(([Z, , c0, c1, rim], i) => card(ctx, c, Z, () => B.hill(ctx, BPTS[i], { c0, c1, rim, bottom: 9000 })));
    if (!lite || true) gPath(ctx, t, c);
    // the field (far → near), the robot and you inserted at your depths
    const rg = robG(t), dg = duG(t), objs = [];
    FIELD.forEach((f) => objs.push([f.Z, () => fieldItem(ctx, t, c, f)]));
    objs.push([3000, () => hedge(ctx, t, c)]);
    for (const [X, Z, s] of [[-2000, 3400, 1], [2050, 3700, -1]]) objs.push([Z, () => bigTree(ctx, t, c, X, Z, s)]);
    if (!lite) {
      FLOWERS.forEach((f) => objs.push([f.Z, () => flower(ctx, t, c, f)]));
      objs.push([rg[1] - 1, () => robotG(ctx, t, c, rg)]);
      objs.push([dg[1], () => duGarden(ctx, t, c, dg, rg)]);
    }
    objs.sort((a, b) => b[0] - a[0]).forEach((o) => o[1]());
    if (!lite) { bees(ctx, t, c); motes(ctx, t, c); card(ctx, c, 1250, () => grassFg(ctx, t)); }
  }
  function gPath(ctx, t, c) {   // the garden path, projected point by point (it runs into depth)
    const L = [], Rr = [];
    for (let i = 0; i <= 40; i++) { const Z = 1300 * Math.pow(10000 / 1300, i / 40), X = pathX(Z), w2 = 70 + 30 * (1 - i / 40); const a = project(c, Z, GXs(X - w2, Z), GY(Z)), b = project(c, Z, GXs(X + w2, Z), GY(Z)); if (a && b) { L.push(a); Rr.push(b); } }
    if (L.length < 2) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]); for (const p of L) ctx.lineTo(p[0], p[1]); for (const p of Rr.reverse()) ctx.lineTo(p[0], p[1]); ctx.closePath();
    const yT = L[L.length - 1][1], yB = L[0][1];
    ctx.fillStyle = lin(ctx, 0, yT, 0, Math.max(yT + 1, yB), [[0, rgba(P.halo0, 0)], [.3, rgba(P.halo0, .3)], [.6, rgba(P.halo1, .36)], [1, rgba(P.halo2, .3)]]); ctx.fill(); ctx.restore();
  }
  function fieldItem(ctx, t, c, f) {
    const la = smooth(span(t, f.tl, f.tl + .9)), fade = 1 - .9 * smooth(span(f.side, 220, 520));
    onG(ctx, c, f.X, f.Z, (x, y, k) => {
      ctx.save(); ctx.globalAlpha = fade;
      if (f.kind === 'hand') {
        const L = 78 * f.s * k * (.7 + .3 * la) * (1 + .03 * Math.sin(t * 1.3 + f.ph)), ang = -Math.PI / 2 + Math.sin(t * .8 + f.ph) * .05 + f.flip * .08 + .13 * gust(f.X, t);
        const m = E.handMatrix(x, y - L * .8, ang, L, f.flip), p = new Path2D(); p.addPath(HP, m);
        ctx.save(); ctx.beginPath(); ctx.rect(x - L * 4, y - L * 6, L * 8, L * 6 + 1); ctx.clip();
        if (la < 1) { ctx.fillStyle = mixHex(M.leaf1, P.night1, .35); ctx.globalAlpha = fade * (1 - la * .5); ctx.fill(p); }
        if (la > 0) {
          const [cx, cy] = E.applyM(m, 1.1, 0);
          halo(ctx, cx, cy, L * 2.6, .32 * la * fade, P.halo1, P.halo0);
          ctx.globalAlpha = fade * la; ctx.fillStyle = rad(ctx, cx, cy, L * 1.8, [[0, P.core1], [.35, P.halo0], [1, P.halo1]]); ctx.fill(p);
        }
        ctx.restore();
      } else {
        const hh = 230 * f.s * k, sw = Math.sin(t * .9 + f.ph) * .04 + .07 * gust(f.X, t);
        ctx.strokeStyle = mixHex(P.night1, P.ind0, .4); ctx.lineWidth = Math.max(1, 4 * k); ctx.beginPath(); ctx.moveTo(x + hh * .12, y); ctx.lineTo(x + hh * .12, y - hh * .55); ctx.stroke();   // the stake
        ctx.strokeStyle = mixHex(P.night1, M.leaf0, .5); ctx.lineWidth = Math.max(1, 6 * k); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y - hh * .4, x + sw * hh, y - hh * .62); ctx.stroke();
        const cr = blobs([[x + sw * hh, y - hh * .78, hh * .2, hh * .24], [x + sw * hh - hh * .12, y - hh * .66, hh * .14, hh * .14], [x + sw * hh + hh * .13, y - hh * .68, hh * .13, hh * .13]]);
        ctx.fillStyle = mixHex(M.leaf1, P.night1, .3 - .15 * la); ctx.fill(cr);
        const sh = new Path2D(); sh.addPath(cr, { a: 1, b: 0, c: 0, d: 1, e: 0, f: hh * .04 }); ctx.fillStyle = rgba(M.leafLit, .25 + .55 * la); ctx.fill(new Path2D(cr).op(sh, PathOp.Difference));
      }
      ctx.restore();
    });
  }
  function hedge(ctx, t, c) {
    onG(ctx, c, 0, 3000, (x, y, k) => {
      const hh = 150 * k, gap = 72 * k, p = new Path2D();
      for (const s of [-1, 1]) { p.moveTo(x + s * gap, y); for (let i = 0; i <= 30; i++) { const xx = x + s * (gap + i * 140 * k * 3); p.lineTo(xx, y - hh - Math.sin(i * 1.7) * 8 * k); } p.lineTo(x + s * (gap + 30 * 420 * k), y + 4); p.closePath(); }
      ctx.fillStyle = lin(ctx, 0, y - hh, 0, y, [[0, mixHex(M.leaf1, P.ind1, .35)], [1, P.night1]]); ctx.fill(p);
      const sh = new Path2D(); sh.addPath(p, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 3 }); ctx.fillStyle = rgba(M.leafLit, .6); ctx.fill(new Path2D(p).op(sh, PathOp.Difference));
      // gate posts and the two wings, open
      ctx.fillStyle = mixHex(P.night1, P.ind0, .4); for (const s of [-1, 1]) ctx.fillRect(x + s * gap - 7 * k, y - hh * 1.15, 14 * k, hh * 1.15);
      ctx.strokeStyle = mixHex(P.night1, P.ind0, .6); ctx.lineWidth = 5 * k; ctx.lineCap = 'round';
      for (const s of [-1, 1]) { const x0 = x + s * gap, x1 = x0 + s * 38 * k; ctx.beginPath(); for (const yy of [.25, .8]) { ctx.moveTo(x0, y - hh * yy); ctx.lineTo(x1, y - hh * yy + 6 * k); } for (const f of [.35, .7, 1]) { ctx.moveTo(lerp(x0, x1, f), y - hh * .25 + 2 * k); ctx.lineTo(lerp(x0, x1, f), y - hh * .85 + 6 * k); } ctx.stroke(); }
      ctx.strokeStyle = rgba(P.halo0, .6); ctx.lineWidth = 2 * k; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + s * gap + (s < 0 ? 7 : -7) * k, y - hh * 1.15); ctx.lineTo(x + s * gap + (s < 0 ? 7 : -7) * k, y); ctx.stroke(); }
    });
  }
  function bigTree(ctx, t, c, X, Z, s) {
    onG(ctx, c, X, Z, (x, y, k) => {
      const hh = 1100 * k, sw = Math.sin(t * .45 + X) * .012 + .018 * gust(X, t);
      ctx.fillStyle = mixHex(P.night1, P.night0, .4); ctx.beginPath(); ctx.moveTo(x - 30 * k, y); ctx.quadraticCurveTo(x - 14 * k, y - hh * .4, x - 8 * k + sw * hh, y - hh * .62); ctx.lineTo(x + 14 * k + sw * hh, y - hh * .62); ctx.quadraticCurveTo(x + 18 * k, y - hh * .4, x + 34 * k, y); ctx.fill();
      const cr = blobs([[0, -.78, .3], [-.24, -.66, .22], [.24, -.68, .23], [-.1, -.95, .2], [.16, -.9, .18]].map(([u, v, r]) => [x + (u + sw) * hh, y + v * hh, r * hh, r * hh * .85]));
      ctx.fillStyle = mixHex(M.leaf0, P.night1, .45); ctx.fill(cr);
      const sh = new Path2D(); sh.addPath(cr, { a: 1, b: 0, c: 0, d: 1, e: s * 6 * k, f: 4 * k }); ctx.fillStyle = rgba(M.leafLit, .35); ctx.fill(new Path2D(cr).op(sh, PathOp.Difference));
    });
  }
  function flower(ctx, t, c, f) {
    const fa = 1 - .55 * smooth(span(Math.abs(f.X * F0 / (f.Z + 450)), 300, 700)) * smooth(span(t, T_C0, T_C1));
    onG(ctx, c, f.X, f.Z, (x, y, k) => {
      ctx.globalAlpha = fa;
      const hh = f.h * k, sw = Math.sin(t * 1.1 + f.ph) * .08 + .14 * gust(f.X, t), tx = x + sw * hh, ty = y - hh;
      ctx.strokeStyle = mixHex(M.leaf1, P.night1, .3); ctx.lineWidth = Math.max(1, 3 * k); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y - hh * .5, tx, ty); ctx.stroke();
      ctx.fillStyle = rgba(M.leafLit, .6); ctx.beginPath(); ctx.ellipse(x + 6 * k, y - hh * .35, 9 * k, 3 * k, -.5, 0, 6.29); ctx.fill();
      const r = 11 * k; if (f.warm) halo(ctx, tx, ty, r * 2.6, .28, P.halo1, P.halo0);
      ctx.fillStyle = f.warm ? P.halo0 : mixHex(P.blue1, P.cream, .4); for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283 + f.ph; ctx.beginPath(); ctx.arc(tx + Math.cos(a) * r * .7, ty + Math.sin(a) * r * .7, r * .55, 0, 6.29); ctx.fill(); }
      ctx.fillStyle = f.warm ? P.core1 : P.halo1; ctx.beginPath(); ctx.arc(tx, ty, r * .45, 0, 6.29); ctx.fill();
    });
  }
  const MOTES = []; { const r3 = E.prng(919); for (let i = 0; i < 42; i++) MOTES.push({ x: r3() * 1920, y: 120 + r3() * 700, r: 1.6 + r3() * 2.4, sp: 6 + r3() * 10, ph: r3() * 6.28 }); }
  function motes(ctx, t, c) {   // light motes in the sun, only in the end hold
    const a = LIVE(t); if (a <= 0) return;
    card(ctx, c, 1500, () => {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const m of MOTES) {
        const u = ((t * m.sp / 140 + m.ph / 6.28) % 1 + 1) % 1, x = m.x + u * 140 * 1.6, y = m.y - u * 140 + Math.sin(t * .7 + m.ph) * 14, tw = .5 + .5 * Math.sin(t * 1.3 + m.ph);
        ctx.fillStyle = rgba(P.core1, a * Math.sin(Math.PI * u) * (.2 + .3 * tw));   // each mote lives one rise and fades in and out ctx.beginPath(); ctx.arc(x, y, m.r, 0, 6.29); ctx.fill();
      }
      ctx.restore();
    });
  }
  function bees(ctx, t, c) {
    for (let i = 0; i < 5; i++) {
      const f = FLOWERS[(i * 7 + 3) % FLOWERS.length], ph = t * (1.3 + i * .17) + i * 2;
      onG(ctx, c, f.X + Math.sin(ph) * 120 + Math.sin(ph * 2.3) * 40, f.Z, (x, y, k) => {
        const by = y - f.h * k - 40 * k + Math.sin(ph * 1.7) * 30 * k, r = Math.max(1.6, 5 * k);
        ctx.fillStyle = rgba(P.cream, .45); ctx.beginPath(); ctx.ellipse(x - r * .3, by - r * 1.1, r * 1.1, r * .55 * (1 + .5 * Math.sin(t * 60 + i)), -.4, 0, 6.29); ctx.fill();
        ctx.fillStyle = mixHex(P.halo0, P.shade0, .4); ctx.beginPath(); ctx.ellipse(x, by, r * 1.2, r * .8, 0, 0, 6.29); ctx.fill();
      });
    }
  }
  function bird(ctx, t, c, t0, x0, y0, x1, y1) {   // one bird crosses the morning sky, right to left
    const u = span(t, t0, t0 + 2.6); if (u <= 0 || u >= 1) return;
    card(ctx, c, 12000, () => {
      const x = lerp(x0, x1, u) + (x1 < x0 ? 0 : 0), y = lerp(y0, y1, u) + Math.sin(u * 9) * 6, fl = Math.sin(t * 13), s = 13;
      ctx.strokeStyle = mixHex(P.night1, P.ind0, .3); ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(x - s * 1.4, y - fl * s * .8); ctx.quadraticCurveTo(x - s * .6, y - s * .3 - fl * s * .3, x, y); ctx.quadraticCurveTo(x + s * .6, y - s * .3 - fl * s * .3, x + s * 1.4, y - fl * s * .8); ctx.stroke();
    });
  }
  function grassFg(ctx, t) {   // out of focus grass at the bottom corners (the crane leaves it behind)
    ctx.save(); ctx.filter = 'blur(8px)'; ctx.fillStyle = rgba(P.night0, .9);
    for (let i = 0; i < 14; i++) { const x = i < 7 ? -60 + i * 40 : 1700 + (i - 7) * 40, hgt = 140 + (i * 37) % 90, sw = Math.sin(t * .8 + i) * 10; ctx.beginPath(); ctx.moveTo(x - 18, 1150); ctx.quadraticCurveTo(x, 1080 - hgt * .5, x + sw + 12, 1080 - hgt); ctx.lineTo(x + 20, 1150); ctx.fill(); }
    ctx.restore();
  }
  function robotG(ctx, t, c, [X, Z]) {
    onG(ctx, c, X, Z, (x, y, k) => {
      const h = 400 * k, dist = t < T_GO ? (pairZ(t) - 1550) * 1.6 : (Z - 2650) + (2650 - 1550) * 1.6, held = t < T_GO + .05;
      let armL;
      { const tt = Math.min(t, T_GO), [Xh, Zh] = robG(tt), kh = F0 / Zh, hd = handMeet(tt, Xh, Zh, kh), xh = GXs(Xh, Zh), yh = GY(Zh), a0 = ik([-.175, -.79], [(hd[0] - xh) / (400 * kh), (hd[1] - yh) / (400 * kh)], .165, .21, 1), r = sineIO(span(t, T_GO + .05, T_GO + .8)); armL = [lerp(a0[0], -.1, r), lerp(a0[1], -.05, r)]; }
      E.castShadow(ctx, x, y, 50 * k * 2, 150 * k, 1.75, .4);
      E.robot(ctx, x, y, h, { dir: 1, light: 1, rim: P.halo0, body: P.night1, hand: 'hand', walk: walkPh(dist, 400), armL });
    });
  }
  // where your hand and the robot's hand meet (design coords of the pair's card)
  function handMeet(t, Xr, Z, k) {
    const [Xd] = duG(t), xd = GXs(Xd, Z), xr = GXs(Xr, Z), y = GY(Z);
    return [lerp(xd + .0625 * 360 * k, xr - .175 * 400 * k, .5), y - .53 * 360 * k + Math.sin(t * 2.5) * 2 * k];
  }
  function duGarden(ctx, t, c, [X, Z], rg) {
    onG(ctx, c, X, Z, (x, y, k) => {
      const h = 360 * k, held = t < T_GO + .05, dist = (Math.min(pairZ(t), 2650) - 1550) * 1.6 + 26 * smooth(span(t, T_GO - .1, T_GO + .6));
      const o = { dir: 1, light: 1, back: .35, look: .2 + .25 * smooth(span(t, T_GO, T_GO + 2)) };
      o.walk = walkPh(dist, 360);
      if (held) { const hd = handMeet(t, rg[0], Z, k); o.armR = ik([.0625, -.74], [(hd[0] - x) / h, (hd[1] - y) / h], .17, .155, -1); }
      else { const r = sineIO(span(t, T_GO + .05, T_GO + .9)), hd = handMeet(T_GO, robG(T_GO)[0], Z, k), a0 = ik([.0625, -.74], [(hd[0] - x) / h, (hd[1] - y) / h], .17, .155, -1); o.armR = [lerp(a0[0], .12, r), lerp(a0[1], .06, r)]; }
      E.du(ctx, x, y, h, o);
      // your hand's light where it holds the robot's hand; it lets go on "go"
      const hd = handMeet(Math.min(t, T_GO), held ? rg[0] : robG(T_GO)[0], Z, k), gl = smooth(span(t, T_P0 + .3, A.walk)) * (1 - smooth(span(t, T_GO + .1, T_GO + 1.2)));
      if (gl > 0) halo(ctx, hd[0], hd[1], 26 * k * 2, .55 * gl, P.halo1, P.core0);
    });
  }

  return [{ t: R.a, draw, print: { editorial: true }, sound: [
    { f: 'tick', t: A.robots, v: .12 }, { f: 'spark_tick', t: A.many, v: .12 }, { f: 'chime', t: A.ones, v: .12 }, { f: 'whoosh_airy', t: T_IA0, v: .15 },
    { f: 'steam_hiss', t: A.there - .4, v: .08 }, { f: 'clink', t: A.done, v: .18 }, { f: 'steps', t: T_DW0 + .2, v: .08 }, { f: 'clink', t: A.table + .9, v: .12 },
    { f: 'whoosh_up', t: T_FLY - .7, v: .14 }, { f: 'wings', t: A.alive - .4, v: .14 }, { f: 'chime', t: A.go + .05, v: .1 }, { f: 'swell', t: T_C0 + .5, v: .16 }, { f: 'shimmer_rings', t: T_C0 + 2.5, v: .1 },
  ] }];
};
