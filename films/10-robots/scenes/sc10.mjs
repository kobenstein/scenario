// c10 · repair, magnets back, Niron, how many, house rules (03d rest, 03e start) · 507.52–560.90 · bright morning · ★ 10.08 (the dotted many fold to the few)
// Builder B3. Explainers ≈ 63 % (light on night). Starts on the c09 street (same drawing, same robot, same stride).
//
// | beat | time | anchor | picture | hero | moves | transition → carrier · position · direction |
// |---|---|---|---|---|---|---|
// | A EXPL | 507.52–510.85 | repaired 508.08 · upgraded 508.80 · not 509.68 | the shared robot slows to a stop; push to its knee: the worn module slides out, a new one clicks in | knee module | stop · push · swap | push into the old module · centre · in |
// | B EXPL | 510.85–513.68 | magnets 511.60 · recovered 512.16 · end 512.88 | the module opens: a magnet; a ring of light runs from the old robot over a new one and closes `MAGNETS · RETURN` | magnet | split · ring closes | ring draws back into the magnet · centre |
// | C EXPL | 513.68–516.30 | rare 515.20 · all 515.92 | inside the magnet a cluster of cool rare-earth dots; they let go and drift out: `NO RARE EARTHS`; field lines bloom | magnet | dots leave · field lines | the world grows out of the magnet: it becomes the sun · centre · out |
// | D 3D   | 516.30–525.20 | Niron 518.88 · large 522.48 · now 524.24 | frosty morning, a factory frame against the low sun, a crane sets a beam (`NIRON MAGNETICS`, `FIRST LARGE FACTORY`) | sun | push · beam lowers | camera rises · right |
// | E 3D   | 525.20–528.62 | No 527.92 | the camera rises: on the far hill the terraces of a mine are still there; on "No." the picture holds | sun / mine | rise · hold | iris out of the mine terraces · right · in |
// | F EXPL | 528.62–534.24 | battery 529.92 · power 530.84 · materials 532.32 · ground 533.28 | a chain of light from one robot: BATTERY → POWER → MATERIALS → GROUND (the terraces) | chain head | arrows arrive on the words | the chain folds back into its robot · left → centre |
// | G ★ EXPL | 534.24–540.98 | many 536.24 · build 537.48 · need 539.44 | the robot multiplies into a field of dotted copies (`can build`); on "need" they fold to four places, four warm robots stay (`really need`) | the field | clones spread · fold | world out of the house's window · lower left · in |
// | H 3D   | 540.98–544.30 | home 542.02 · rules 543.78 | your living room, morning window; the home robot by the sofa; you come in | window | you walk in · push | iris out of the robot's status light · centre · in |
// | I EXPL | 544.30–552.70 | switch 544.98 · enters 546.90 · permission 549.62 · yours 551.86 | the house as a plan of light, you and the robot as two dots; four rules write on the right and act in the plan | the rules | light off · line · REC off · data home | world out of your dot (the box) · left · out |
// | J 3D   | 552.70–557.00 | Neo 552.90 · asks 554.02 · rooms 556.42 | the robot waits at the kitchen door, a ? of light on its chest; you nod, it steps in (`1X NEO`) | kitchen door | ? · nod · step | the world closes into a window of the street · centre |
// | K EXPL | 557.00–560.90 | standard 558.58 · law 560.02 | the street again: in every house a robot stops at a threshold, staggered from the middle out | thresholds | staggered stops | → c11 (the street, the hands) |
import * as B from '../lib/f10_c08_b3.mjs';
import { STREET, STREET_D, streetTimes, streetRobotX, streetRobotY, drawStreet, robotOutline } from './sc09.mjs';
import { Path2D, PathOp } from '@napi-rs/canvas';
const { E, P, M, W, H, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, quartIO, halo, trail, catmull } = B;
const { card, cam3, aim, camAt, camDrift, project, F0 } = E;
// a snappy move that still starts from rest (no one-frame jump): accelerates over the first quarter, then a long expo settle
export const STREET_KHOUSE = 3;   // the house whose window the kitchen closes into (c11 opens the plans out of it)
const snap = (u) => expoOut(u) * smooth(clamp(u / .25));

export default async (T, R) => {
  E.prepareEditorial();
  const w = B.wordAt(T);
  const A = {
    t0: R.a, repaired: w('repaired', 508.08), upgraded: w('upgraded', 508.8), not: w('not', 509.68), with: w('with', 511.2), magnets: w('magnets', 511.6), recovered: w('recovered', 512.16), end: w('end', 512.88),
    and: w('and', 513.68), some: w('some', 513.92), rare: w('rare', 515.2), all: w('all', 515.92),
    united: w('united', 516.96), niron: w('niron', 518.88), iron: w('iron', 520.24), its: w('its', 521.84), large: w('large', 522.48), now: w('now', 524.24),
    does: w('does', 525.2), planet: w('planet', 526.96), no: w('no.', 527.92), every: w('every', 528.72), battery: w('battery', 529.92), power: w('power', 530.84), materials: w('materials', 532.32), ground: w('ground', 533.28),
    so: w('so', 534.24), many: w('many', 536.24), build: w('build', 537.48), need: w('need', 539.44),
    and2: w('and', 540.98), home: w('home', 542.02), rules: w('rules', 543.78), switch: w('switch', 544.98), rooms: w('rooms', 545.86), enters: w('enters', 546.9), stranger: w('stranger', 548.1), permission: w('permission', 549.62), data: w('data', 550.9), yours: w('yours', 551.86),
    neo: w('neo', 552.9), asks: w('asks', 554.02), permission2: w('permission', 554.42), locked: w('locked', 555.62), rooms2: w('rooms', 556.42), now2: w('now', 557.14), standard: w('standard', 558.58), law: w('law', 560.02), b: R.b,
  };

  // ================= A: the street robot stops; push to its knee =================
  const S = streetTimes(T);
  const XF = streetRobotX(A.t0 + STREET_D + .01, S), YF = streetRobotY(A.t0 + 5, S);
  const KNEE = [XF + .066 * 170, YF - .265 * 170], MOD = 15, MOD_OUT = [KNEE[0] + 34, KNEE[1] - 16], MOD_IN0 = [KNEE[0] - 270, KNEE[1] + 30];
  const CB = [960, 450];                                            // the magnet explainer's centre (screen)
  const T_PUSH0 = A.not - .25, T_PUSH1 = A.with - .3;               // fly into the old module
  const KA = [[A.t0, { s: 1, x: 960, y: 540 }], [Math.min(A.repaired + .85, T_PUSH0 - .35), B.viewPut(KNEE[0], KNEE[1], 880, 600, 4.2), 's', KNEE],
    [T_PUSH0, B.viewPut(KNEE[0], KNEE[1], 868, 594, 4.45)], [T_PUSH1, B.viewPut(MOD_OUT[0], MOD_OUT[1], CB[0], CB[1], 10), 'q', MOD_OUT]];
  const vA = (t) => B.viewAt(t, KA);
  S.dim = (t) => smooth(span(t, A.t0 + .1, A.repaired + .35));
  S.robA = (t) => 1 - smooth(span(t, T_PUSH0 + .35, T_PUSH1 - .05));
  // ================= D/E: Minnesota =================
  const SUN = { Z: 9000, u: 980, v: 600, r: 120 }, MINE = { x: 1700, y: 692, w: 620, h: 128 };
  const T_ID0 = A.all + .35, T_ID1 = T_ID0 + 1.0;
  const BEAM = [1304, 488];                                         // where the beam lands (Z 4000)
  const KD = [[T_ID0, cam3({ x: -40, y: 40, z: -80 })], [T_ID1 + .7, cam3({ x: -10, y: 20, z: 0 }), 's'], [A.now - .7, cam3({ x: 150, y: -20, z: 430 })],
    [A.now + .5, cam3({ x: 190, y: -40, z: 520 })], [A.no - .1, cam3({ x: 430, y: -250, z: 600 }), 'q'], [A.every + .4, cam3({ x: 470, y: -262, z: 660 })]];
  const camD = (t) => camDrift(camAt(t, KD, SUN.Z), t, .5, 81);
  const beamK = (t) => { const u = span(t, A.now - .75, A.now + .25); return sineIO(u) + Math.sin(Math.PI * span(t, A.now + .25, A.now + .75)) * .012; };
  // ================= F/G: the chain and the many =================
  const T_IF0 = A.every - .15, T_IF1 = T_IF0 + .95;
  const NODES = [{ x: 260, k: 'robot', at: -1 }, { x: 620, k: 'battery', at: A.battery, label: 'battery' }, { x: 980, k: 'bolt', at: A.power, label: 'power', sub: 'every day' },
    { x: 1340, k: 'ore', at: A.materials, label: 'materials' }, { x: 1700, k: 'terrace', at: A.ground, label: 'ground' }];
  const NY = 470;
  const mineScreen = (t) => { const c = camD(t); return project(c, 9000, MINE.x - 40, MINE.y - MINE.h * .45); };
  const MS = mineScreen(T_IF0 + .2);
  const KF = [[T_IF0, B.viewPut(1700, NY, MS[0], MS[1], 1.25)], [A.battery - .25, { s: 1, x: 980, y: 520 }, 'q', [1700, NY]], [A.need + 2, { s: 1.03, x: 975, y: 522 }]];
  const vF = (t) => B.vDrift(B.viewAt(t, KF), t, .35, 91);
  // the many: a grid of copies around the centre one; four places they fold to
  const GRID = []; for (let r = 0; r < 7; r++) for (let c = 0; c < 21; c++) { const x = 120 + c * 84 + (r % 2) * 20 - 10, y = 330 + r * 90; GRID.push([x, y, Math.hypot(x - 960, (y - 600) * 1.3)]); }
  const PLACES = [[360, 'house'], [760, 'factory'], [1160, 'tool'], [1560, 'vine']], PY = 815;
  const placeOf = (x) => { let b = 0; for (let i = 1; i < 4; i++) if (Math.abs(PLACES[i][0] - x) < Math.abs(PLACES[b][0] - x)) b = i; return b; };
  // ================= H: the living room =================
  const T_IH0 = A.and2 - .2, T_IH1 = T_IH0 + 1.0, WALL = 2600, WIN = { x: 1050, y: 170, w: 400, h: 560 };
  const houseWin = (t) => B.viewToScreen(vF(t), PLACES[0][0] + .21 * 110, PY + .11 * 110);
  const HW = houseWin(T_IH0 + .2);
  const KH = [[T_IH0, aim(WALL, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, .55, HW[0], HW[1])], [T_IH1 + .5, cam3({ x: 20, y: 0, z: -20 }), 's'], [A.switch - .3, cam3({ x: 90, y: -10, z: 240 })]];
  const camH = (t) => camDrift(camAt(t, KH, WALL), t, .4, 101);
  const HBOT = [900, 902, 390], HDU = [470, 938, 330];
  const duX = (t) => lerp(-160, HDU[0], sineIO(span(t, A.and2 + .3, A.rules - .1)));
  const statusAt = (c) => project(c, F0, HBOT[0] + 8, HBOT[1] - HBOT[2] * .72);
  // ================= I: the plan of light =================
  const T_II0 = A.switch - .55, T_II1 = T_II0 + .9;
  const RD = [600, 700], DU = [370, 700], BEDDOOR = [415, 470];
  const SI = statusAt(camH(T_II0 + .2));
  const KI = [[T_II0, B.viewPut(RD[0], RD[1], SI[0], SI[1], 1.15)], [T_II1 + .5, { s: 1, x: 960, y: 540 }, 'q', RD], [A.yours + 2, { s: 1.02, x: 955, y: 542 }]];
  const vI = (t) => B.vDrift(B.viewAt(t, KI), t, .3, 111);
  const robI = (t) => { const k = sineIO(span(t, A.rooms - .3, A.enters)), bump = Math.sin(Math.PI * span(t, A.enters, A.enters + .45)) * 7; return [lerp(RD[0], BEDDOOR[0] + 10, k), lerp(RD[1], BEDDOOR[1] + 44, k) + bump]; };
  // ================= J: the kitchen door =================
  const T_IJ0 = A.neo - .3, T_IJ1 = T_IJ0 + .95;
  const JDU = [600, 942, 330], JBOT = [1240, 905, 400], DOOR = { x: 1120, y: 300, w: 300, h: 605 };
  const boxAt = (t) => B.viewToScreen(vI(t), DU[0], DU[1] + 44);
  const BX = boxAt(T_IJ0 + .2);
  const KJ = [[T_IJ0, aim(F0, JDU[0], JDU[1] - JDU[2] * .5, .35, BX[0], BX[1])], [T_IJ1 + .5, cam3({ x: 30, y: 0, z: 40 }), 's'], [A.now2 - .3, cam3({ x: 80, y: -10, z: 200 })], [A.now2 + .8, cam3({ x: 40, y: -20, z: -900 }), 'q']];
  const camJ = (t) => camDrift(camAt(t, KJ), t, .4, 121);
  // ================= K: the street again =================
  const T_IK0 = A.now2 - .25, T_IK1 = A.now2 + .75, KHOUSE = STREET_KHOUSE, KW = [STREET.xs[KHOUSE] + .21 * 150, STREET.y + .11 * 150];

  const draw = (ctx, t) => {
    if (t < T_PUSH1) { B.fieldFill(ctx, { t }); layerA(ctx, t); return; }
    if (t < T_ID0) { B.fieldFill(ctx, { t }); magnetBC(ctx, t); return; }
    if (t < T_ID1 + .2) {   // the world grows out of the magnet; the iris centre glides onto the sun
      const c = camD(t), [qx, qy] = project(c, SUN.Z, SUN.u, SUN.v), m = smooth(span(t, T_ID0, T_ID1)), sx = lerp(CB[0], qx, m), sy = lerp(CB[1], qy, m);
      B.irisWorld(ctx, sx, sy, B.irisR(span(t, T_ID0, T_ID1), 6, sx, sy), () => minnesota(ctx, t, c), () => magnetBC(ctx, t), { t }); return; }
    if (t < T_IF1) { const c = camD(t); minnesota(ctx, t, c); if (t > T_IF0) { const [mx, my] = mineScreen(t); B.iris(ctx, mx, my, B.irisR(span(t, T_IF0, T_IF1), 30, mx, my), () => chainFG(ctx, t), { t }); } return; }
    if (t < T_IH0) { B.fieldFill(ctx, { t }); chainFG(ctx, t); return; }
    if (t < T_IH1 + .2) { const c = camH(t), [hx, hy] = houseWin(t); B.irisWorld(ctx, hx, hy, B.irisR(span(t, T_IH0, T_IH1), 4, hx, hy), () => room(ctx, t, c), () => chainFG(ctx, t), { t }); return; }
    if (t < T_II1) { const c = camH(t); room(ctx, t, c); if (t > T_II0) { const [sx, sy] = statusAt(c); B.iris(ctx, sx, sy, B.irisR(span(t, T_II0, T_II1), 14, sx, sy), () => planI(ctx, t), { t }); } return; }
    if (t < T_IJ0) { B.fieldFill(ctx, { t }); planI(ctx, t); return; }
    if (t < T_IJ1 + .2) { const c = camJ(t), [bx, by] = boxAt(t); B.irisWorld(ctx, bx, by, B.irisR(span(t, T_IJ0, T_IJ1), 10, bx, by), () => kitchen(ctx, t, c), () => planI(ctx, t), { t }); return; }
    if (t < T_IK0) { kitchen(ctx, t, camJ(t)); return; }
    if (t < T_IK1) {   // the kitchen closes into one window of the street (the reverse iris)
      const u = quartIO(span(t, T_IK0, T_IK1)), r = lerp(Math.hypot(W, H), 0, u);
      B.irisWorld(ctx, KW[0], KW[1], r, () => kitchen(ctx, t, camJ(t)), () => streetK(ctx, t), { t }); return;
    }
    B.fieldFill(ctx, { t }); streetK(ctx, t);
  };

  // ---------- A: the robot stops, the knee module is swapped ----------
  function moduleShape(x, y, s) { const p = new Path2D(); p.roundRect(x - s / 2, y - s / 2, s, s, s * .22); const g = new Path2D(); g.rect(x - s * .3, y - s * .04, s * .6, s * .08); return p.op(g, PathOp.Difference); }
  function layerA(ctx, t) {
    const v = vA(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.applyView(ctx, v);
    drawStreet(ctx, t, S);
    // the worn module (cool) slides out on "repaired"
    const out = snap(span(t, A.repaired - .05, A.repaired + .55)), op = [lerp(KNEE[0], MOD_OUT[0], out), lerp(KNEE[1], MOD_OUT[1], out) - Math.sin(Math.PI * out) * 10];
    E.lightShape(ctx, moduleShape(op[0], op[1], MOD), t, { lit: .15, dust: 0, seed: 7 });
    // the new one (warm) slides in from the left on "upgraded" and clicks home
    const inn = snap(span(t, A.upgraded - .4, A.upgraded + .2));
    if (inn > 0) {
      const ip = [lerp(MOD_IN0[0], KNEE[0], inn), lerp(MOD_IN0[1], KNEE[1], inn)];
      E.lightShape(ctx, moduleShape(ip[0], ip[1], MOD), t, { lit: 1, dust: 0, seed: 8 });
      const click = span(t, A.upgraded + .15, A.upgraded + .7);
      if (click > 0 && click < 1) { ctx.save(); ctx.strokeStyle = rgba(P.core1, .9 * (1 - click)); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(KNEE[0], KNEE[1], MOD * (.7 + 1.6 * expoOut(click)), 0, 6.29); ctx.stroke(); ctx.restore(); }
    }
    ctx.restore();
  }
  // ---------- B/C: the magnet, the ring that closes, no rare earths ----------
  function magnetBC(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const [x, y] = CB, split = snap(span(t, A.with - .1, A.with + .55));
    // the old module at the centre (150 px), opening in two halves that slide apart and dim
    if (split < 1) for (const s of [-1, 1]) {
      const half = new Path2D(); half.roundRect(s < 0 ? -75 : 0, -75, 75, 150, s < 0 ? [33, 0, 0, 33] : [0, 33, 33, 0]);
      const p = new Path2D(); p.addPath(half, { a: 1, b: 0, c: 0, d: 1, e: x + s * 190 * split, f: y });
      E.lightShape(ctx, p, t, { lit: .15, dust: 0, a: 1 - smooth(span(split, .45, 1)), seed: 9 });
    }
    // the magnet rises out of it and fills with light
    const mk = snap(span(t, A.with, A.magnets + .4)), size = lerp(130, 250, mk);
    const relax = smooth(span(t, A.some, A.some + .6)), mfill = span(t, A.with + .1, A.recovered);
    if (mk > 0) E.icon(ctx, 'magnet', x, y, size, t, { u: mfill, lit: 1, seed: 12, dust: 1 });
    // the ring: from the old robot (left) over a new one (right) and back; closes on "end"
    const ru = sineIO(span(t, A.recovered - .3, A.end)), back = smooth(span(t, A.and - .1, A.and + .5)), RR = 290;
    const rUse = ru * (1 - back);
    if (rUse > 0) {
      const pts = []; for (let i = 0; i <= 120; i++) { const q = Math.PI + i / 120 * 6.283; pts.push([x + Math.cos(q) * RR, y + Math.sin(q) * RR, 3.5]); }
      trail(ctx, pts, rUse, { w: 3.5, spark: ru < 1 && back === 0 });
      const closed = smooth(span(t, A.end - .05, A.end + .4)) * (1 - back);
      if (closed > 0) halo(ctx, x, y, RR * 1.25, .22 * closed * (1 - .5 * span(t, A.end + .4, A.end + 1.4)), P.halo1, P.halo0);
    }
    const ia = smooth(span(t, A.recovered - .5, A.recovered - .1)) * (1 - back);
    if (ia > 0) {
      const newLit = smooth(span(ru, .45, .55)), oldLit = smooth(span(ru, .95, 1));
      E.icon(ctx, 'robot', x - RR, y, 170, t, { lit: oldLit, a: ia * (.55 + .45 * oldLit), dust: 0, seed: 14 });
      E.icon(ctx, 'robot', x + RR, y, 170, t, { lit: newLit, a: ia * (.55 + .45 * newLit), dust: 0, seed: 15 });
    }
    B.write(ctx, 'magnets · return', x, y + RR + 100, span(t, A.recovered - .1, A.end), { size: B.SZ.label, a: 1 - back });
    // C: inside the magnet a cluster of cool rare-earth dots; on "rare earths" they let go and drift out
    const da = smooth(span(t, A.some - .1, A.some + .5));
    if (da > 0) {
      const leave = span(t, A.rare + .15, A.all + .5);
      for (let i = 0; i < 11; i++) {
        const q = Math.PI + (i + .5) / 11 * Math.PI, rr = size * .32, px = x + Math.cos(q) * rr, py = y - size * .05 + Math.sin(q) * rr;
        const k = sineIO(span(leave, i * .035, .55 + i * .035)), dx = Math.cos(q) * 260 * k + (i - 5) * 18 * k, dy = Math.sin(q) * 200 * k - 120 * k;
        const a = da * (1 - smooth(span(k, .55, 1))), hl = 1 + .6 * Math.sin(Math.PI * span(t, A.rare - .2, A.rare + .4));
        if (a <= 0) continue;
        halo(ctx, px + dx, py + dy, 20 * hl, .55 * a, P.blue0, M.cyan); ctx.fillStyle = rgba(P.ind0, a); ctx.beginPath(); ctx.arc(px + dx, py + dy, 9, 0, 6.29); ctx.fill();
        ctx.strokeStyle = rgba(M.cyan, a); ctx.lineWidth = 2.5; ctx.stroke(); ctx.fillStyle = rgba(M.data, a); ctx.beginPath(); ctx.arc(px + dx, py + dy, 3.5, 0, 6.29); ctx.fill();
      }
      B.write(ctx, 'no rare earths', x, y + RR + 100, span(t, A.rare - .05, A.rare + .55), { size: B.SZ.label, a: 1 });
    }
    // field lines bloom between the poles on "all"
    const fl = span(t, A.all - .35, A.all + .6);
    if (fl > 0) {
      const py = y + size * .4, half = size * .32;
      ctx.save(); ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const k = sineIO(span(fl, i * .12, .55 + i * .12)); if (k <= 0) continue;
        const rx = half + 28 + i * 44, ry = 46 + i * 52;
        ctx.setLineDash([2, 11]); ctx.lineDashOffset = -t * 30; ctx.strokeStyle = rgba(P.halo0, .9 * k); ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(x, py, rx, ry, 0, Math.PI * (1 - k) / 2, Math.PI - Math.PI * (1 - k) / 2); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
  }
  // ---------- D/E: a factory frame against the low sun, the crane, the mine on the far hill ----------
  function terracePath(x, y, w, h) {   // a hill whose left face is cut in steps (the mine); base centre (x, y)
    const p = new Path2D(), L = x - w / 2, st = 5, sw = w * .5 / st, sh = h / st;
    p.moveTo(L, y);
    for (let i = 0; i < st; i++) { p.lineTo(L + i * sw + sw * .25, y - i * sh); p.lineTo(L + i * sw + sw * .25, y - (i + 1) * sh); p.lineTo(L + (i + 1) * sw, y - (i + 1) * sh); }
    p.bezierCurveTo(x + w * .12, y - h * 1.04, x + w * .3, y - h * .55, x + w / 2, y); p.closePath(); return p;
  }
  function minnesota(ctx, t, c) {
    card(ctx, c, 40000, () => B.morningSky(ctx, .9, 690, { t }));
    card(ctx, c, SUN.Z, () => {
      B.sun(ctx, SUN.u, SUN.v, SUN.r, t, { rays: true, dust: 2500 });
      B.hill(ctx, [[-900, 694], [200, 676], [900, 688], [1400, 672], [2100, 684], [2900, 668]], { c0: mixHex(P.blue1, P.ind1, .35), c1: P.ind0, rim: rgba(P.cream, .55) });
      // the mine: steps cut into the far hill, each step edge catching the sun
      const mp = terracePath(MINE.x, MINE.y, MINE.w, MINE.h);
      ctx.fillStyle = lin(ctx, MINE.x - MINE.w / 2, 0, MINE.x + MINE.w / 2, 0, [[0, mixHex(P.ind1, P.shade0, .22)], [1, P.ind0]]); ctx.fill(mp);
      ctx.save(); ctx.clip(mp); ctx.strokeStyle = rgba(P.halo0, .7); ctx.lineWidth = 2.5; ctx.translate(-2, 2); ctx.stroke(mp); ctx.restore();
    });
    card(ctx, c, 4000, () => {
      B.hill(ctx, [[-900, 744], [300, 736], [1100, 746], [2900, 732]], { c0: mixHex(P.blue1, P.cream, .2), c1: P.ind1, rim: rgba(P.cream, .75), rimW: 2 });
      steel(ctx, t);
    });
    card(ctx, c, F0, () => {
      B.hill(ctx, [[-700, 896], [500, 876], [1300, 892], [2700, 870]], { c0: mixHex(P.blue1, P.cream, .16), c1: P.ind0, rim: rgba(P.cream, .8), rimW: 3 });
      E.dust(ctx, 61, 900, 900, 900, 1300, 30, t, .5, P.cream);   // frost glitter
      ctx.strokeStyle = mixHex(P.night1, P.ind0, .5); ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let i = 0; i < 26; i++) { const x = -100 + i * 97 + (i * 37 % 23), y = 884 + Math.sin(i * 1.7) * 6, h = 18 + (i * 13 % 17); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 2, y - h * .6, x + 6 + Math.sin(t * .8 + i) * 2, y - h); ctx.stroke(); }
    });
    card(ctx, c, 1100, () => { ctx.save(); ctx.filter = 'blur(7px)'; ctx.fillStyle = rgba(P.night0, .85); for (let i = 0; i < 9; i++) { const x = -120 + i * 34; ctx.beginPath(); ctx.moveTo(x, 1200); ctx.quadraticCurveTo(x + 30, 980, x + 70 + Math.sin(t * .6 + i) * 6, 900 - (i % 3) * 40); ctx.lineTo(x + 40, 1200); ctx.fill(); } ctx.restore(); });
    // labels (screen)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const la = smooth(span(t, T_ID1 - .2, T_ID1 + .3)) * (1 - smooth(span(t, A.does - .2, A.does + .3)));
    if (la > 0) {
      B.write(ctx, 'niron magnetics', 150, 200, span(t, A.niron - .15, A.niron + .45), { size: 52, align: 'left', spacing: .2, a: la });
      B.write(ctx, 'iron nitride · minnesota', 153, 250, span(t, A.iron - .2, A.iron + .4), { size: B.SZ.small, align: 'left', col: P.halo2, glow: false, a: la });
      const [bx, by] = project(c, 4000, BEAM[0], BEAM[1] - 10);
      B.tag(ctx, bx, by, span(t, A.large - .3, A.large + .8) * la, { dx: -170, dy: -120, label: 'first large factory', sub: 'under construction', size: B.SZ.label, subSize: B.SZ.small });
    }
    ctx.restore();
  }
  function steel(ctx, t) {
    const GY = 738, TOP = 488, xs = []; for (let i = 0; i < 11; i++) xs.push(620 + i * 72);
    const dark = mixHex(P.night1, P.ind0, .35), rim = rgba(P.halo0, .85);
    ctx.lineCap = 'butt';
    // roof truss over the finished bays
    const tr = (x0, x1) => { ctx.beginPath(); ctx.moveTo(x0, TOP); ctx.lineTo(x1, TOP); ctx.moveTo(x0, TOP + 34); ctx.lineTo(x1, TOP + 34); for (let x = x0; x < x1; x += 36) { ctx.moveTo(x, TOP + 34); ctx.lineTo(x + 18, TOP); ctx.lineTo(x + 36, TOP + 34); } };
    ctx.strokeStyle = dark; ctx.lineWidth = 6; tr(620, 1124); ctx.stroke(); ctx.strokeStyle = rgba(P.halo0, .45); ctx.lineWidth = 1.4; ctx.save(); ctx.translate(-1.5, -1.5); tr(620, 1124); ctx.stroke(); ctx.restore();
    // columns, rim on the side that faces the sun
    for (const x of xs) { ctx.fillStyle = dark; ctx.fillRect(x - 6, TOP, 12, GY - TOP); ctx.fillStyle = rim; ctx.fillRect(x < SUN.u ? x + 4.5 : x - 6, TOP, 1.6, GY - TOP); }
    // the beam on its cable, lowered on "now"
    const k = beamK(t), by = lerp(372, BEAM[1], k), sway = Math.sin(t * 1.3) * 3 * (1 - k);
    // crane: lattice mast, jib, counter-jib, cab
    const MX = 1480, JY = 300;
    ctx.strokeStyle = dark; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(MX - 12, GY); ctx.lineTo(MX - 12, JY); ctx.moveTo(MX + 12, GY); ctx.lineTo(MX + 12, JY);
    for (let y = GY; y > JY + 20; y -= 32) { ctx.moveTo(MX - 12, y); ctx.lineTo(MX + 12, y - 32); } ctx.stroke();
    ctx.beginPath(); ctx.moveTo(940, JY); ctx.lineTo(1700, JY); ctx.moveTo(1000, JY + 18); ctx.lineTo(1660, JY + 18);
    for (let x = 1000; x < 1660; x += 30) { ctx.moveTo(x, JY + 18); ctx.lineTo(x + 15, JY); ctx.lineTo(x + 30, JY + 18); }
    ctx.moveTo(MX, JY); ctx.lineTo(MX, JY - 70); ctx.lineTo(1000, JY); ctx.moveTo(MX, JY - 70); ctx.lineTo(1690, JY); ctx.stroke();
    ctx.fillStyle = dark; ctx.fillRect(1612, JY + 18, 70, 40); ctx.fillRect(MX - 24, JY + 18, 46, 34);
    ctx.strokeStyle = rgba(P.halo0, .5); ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(940, JY - 1.5); ctx.lineTo(1700, JY - 1.5); ctx.moveTo(MX - 13.5, GY); ctx.lineTo(MX - 13.5, JY); ctx.stroke();
    // cable + beam
    const tx = BEAM[0] + sway;
    ctx.strokeStyle = dark; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(BEAM[0], JY + 18); ctx.lineTo(tx, by - 26); ctx.lineTo(tx - 40, by - 8); ctx.moveTo(tx, by - 26); ctx.lineTo(tx + 40, by - 8); ctx.stroke();
    ctx.fillStyle = dark; ctx.fillRect(tx - 52, by - 9, 104, 16); ctx.fillStyle = rim; ctx.fillRect(tx - 52, by - 9, 104, 1.6);
    // three workers steer it with ropes
    for (const [px, d] of [[1196, 1], [1258, 1], [1404, -1]]) {
      const hands = E.person(ctx, px, GY, 54, { dir: d, light: d, rim: rgba(P.halo1, .8), armR: [1.9, 2.3] });
      const hd = hands?.R || [px + d * 10, GY - 34];
      ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(hd[0], hd[1]); ctx.quadraticCurveTo((hd[0] + tx) / 2, by + 40, tx + (px < tx ? -50 : 50), by); ctx.stroke();
    }
  }
  // ---------- F/G: the chain of light, then the many and the few ----------
  function nodeShape(k, x, y, s) {
    const p = new Path2D(), m = { a: s, b: 0, c: 0, d: s, e: x, f: y };
    if (k === 'bolt') { const b = new Path2D(); b.moveTo(.1, -.5); b.lineTo(-.26, .06); b.lineTo(-.03, .06); b.lineTo(-.12, .5); b.lineTo(.26, -.1); b.lineTo(.03, -.1); b.lineTo(.16, -.5); b.closePath(); p.addPath(b, m); return p; }
    if (k === 'ore') { let u = null; for (const [cx, cy, r, n] of [[-.2, .18, .2, 6], [.18, .2, .17, 5], [0, -.14, .22, 7]]) { const q = new Path2D(); for (let i = 0; i < n; i++) { const a = i / n * 6.283 + cx * 3, rr = r * (.8 + .2 * Math.sin(i * 2.3 + cy * 9)); i ? q.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : q.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } q.closePath(); u = u ? u.op(q, PathOp.Union) : q; } p.addPath(u, m); return p; }
    if (k === 'terrace') { p.addPath(terracePath(0, .32, 1, .62), m); return p; }
    return null;
  }
  function chainNode(ctx, t, nd, i, x, y, s, lit, a) {
    if (nd.k === 'robot' || nd.k === 'battery') E.icon(ctx, nd.k, x, y, s, t, { lit, a, dust: 0, seed: 130 + i, level: nd.k === 'battery' ? Math.round(lerp(.15, .9, lit) * 6) / 6 : undefined });
    else E.lightShape(ctx, nodeShape(nd.k, x, y, s * .9), t, { lit, a, dust: 0, seed: 130 + i });
  }
  function chainFG(ctx, t) {
    const v = vF(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.applyView(ctx, v);
    const fold = quartIO(span(t, A.so, A.so + 1.0)), toC = quartIO(span(t, A.so + .7, A.many - .2));
    // the chain: arrows run out from the robot and arrive on the words
    if (fold < 1) NODES.forEach((nd, i) => {
      if (i === 0) return;
      const prev = NODES[i - 1], ka = sineIO(span(t, nd.at - .6, nd.at - .04)), lit = smooth(span(t, nd.at - .08, nd.at + .2));
      const x = lerp(nd.x, NODES[0].x, fold), xp = lerp(prev.x, NODES[0].x, fold), a = (1 - smooth(span(fold, .6, 1)));
      const appear = smooth(span(t, T_IF0 + .1 + (4 - i) * .12, T_IF0 + .6 + (4 - i) * .12));
      if (ka > 0 && fold < .9) {
        const pts = catmull([[xp + 100, NY, 3], [(xp + x) / 2, NY - 26, 3], [x - 100, NY, 3]], 12);
        trail(ctx, pts, ka, { w: 3, a, spark: ka < 1 });
        if (ka >= 1) { const ch = new Path2D(); ch.moveTo(x - 118, NY - 13); ch.lineTo(x - 100, NY); ch.lineTo(x - 118, NY + 13); E.lightShape(ctx, ch.stroke({ width: 4, cap: 1, join: 1 }), t, { dust: 0, a }); }
      }
      chainNode(ctx, t, nd, i, x, NY, 150, lit, a * appear * (.7 + .3 * lit));
      if (nd.label) {
        ctx.save(); ctx.translate(nd.x, NY + 140); ctx.scale(1 / v.s, 1 / v.s);
        B.write(ctx, nd.label, 0, 0, span(t, nd.at - .1, nd.at + .45), { size: B.SZ.label, a: 1 - smooth(span(fold, 0, .35)) });
        if (nd.sub) B.write(ctx, nd.sub, 0, 46, span(t, nd.at + .3, nd.at + .9), { size: B.SZ.small, col: P.halo2, glow: false, a: 1 - smooth(span(fold, 0, .35)) });
        ctx.restore();
      }
    });
    // the robot node: warm, then it walks to the centre and becomes one of many
    const rx = lerp(NODES[0].x, 960, toC), ry = lerp(NY, 600 - 32, toC), rs = lerp(170, 64, toC);
    const need = A.need, gone = quartIO(span(t, need - .35, need + .55));
    if (gone < 1) E.icon(ctx, 'robot', rx + (PLACES[1][0] + 90 - rx) * gone, ry + (PY - ry) * gone, rs * (1 - .3 * gone), t, { lit: 1, dust: 0, seed: 140, a: 1 - smooth(span(gone, .8, 1)) });
    // the many: copies spread out from the centre (by distance), dotted; on "need" each folds to its nearest place
    const ROUT = robotOutline();
    ctx.save(); ctx.lineCap = 'round'; ctx.setLineDash([3, 7]); ctx.lineWidth = 2.6 / 64;
    for (const [gx, gy, d] of GRID) {
      if (d < 30) continue;
      const t0 = A.many - .35 + d / 1200, a0 = smooth(span(t, t0, t0 + .35)); if (a0 <= 0) continue;
      const pi = placeOf(gx), [px] = PLACES[pi], k = quartIO(span(t, need - .45 + d * .00025, need + .5 + d * .00025));
      const x = lerp(gx, px + 90, k), y = lerp(gy, PY + 50, k) - Math.sin(Math.PI * k) * 60, s = 64 * (1 - .5 * k) * (.7 + .3 * a0), a = a0 * (1 - smooth(span(k, .75, 1)));
      if (a <= 0) continue;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a; ctx.strokeStyle = rgba(M.cyan, .9); ctx.lineDashOffset = 0; ctx.setLineDash([3 / 64 / (s / 64), 7 / 64 / (s / 64)]); ctx.stroke(ROUT); ctx.restore();
    }
    ctx.restore();
    // the four places, and the four that stay
    PLACES.forEach(([px, kind], i) => {
      const g = snap(span(t, need - .7 + i * .08, need - .1 + i * .08)); if (g <= 0) return;
      if (kind === 'vine') vine(ctx, px, PY, 110 * g, t); else E.icon(ctx, kind, px, PY, 110 * g, t, { lit: 1, dust: 0, seed: 150 + i });
      const f = span(t, need + .15 + i * .06, need + .8 + i * .06);
      if (f > 0) E.icon(ctx, 'robot', px + 90, PY, 104, t, { u: f, lit: 1, dust: 0, seed: 160 + i });
    });
    ctx.restore();
    // words: "can build" → "really need" (screen)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const ca = 1 - smooth(span(t, need - .45, need - .15));
    if (ca > 0) B.write(ctx, 'can build', 960, 190, span(t, A.build - .25, A.build + .3), { serif: true, size: 92, a: ca });
    B.write(ctx, 'really need', 960, 190, span(t, need - .1, need + .45), { serif: true, size: 92 });
    ctx.restore();
  }
  function vine(ctx, x, y, s, t) {   // a bunch of grapes and a leaf: the vineyard
    let p = null; for (const [u, v] of [[-.14, -.1], [0, -.1], [.14, -.1], [-.07, .04], [.07, .04], [0, .18], [-.2, -.24], [-.06, -.24], [.08, -.24]]) { const c = new Path2D(); c.arc(x + u * s, y + (v + .12) * s, .085 * s, 0, 6.29); p = p ? p.op(c, PathOp.Union) : c; }
    const lf = new Path2D(); lf.moveTo(x + .02 * s, y - .32 * s); lf.quadraticCurveTo(x + .32 * s, y - .5 * s, x + .38 * s, y - .2 * s); lf.quadraticCurveTo(x + .2 * s, y - .16 * s, x + .02 * s, y - .32 * s); p = p.op(lf, PathOp.Union);
    E.lightShape(ctx, p, t, { lit: 1, dust: 0, seed: 170 });
  }
  // ---------- H: your living room ----------
  function room(ctx, t, c) {
    card(ctx, c, 40000, () => { ctx.fillStyle = P.night1; ctx.fillRect(-W, -H, 3 * W, 3 * H); });
    card(ctx, c, WALL, () => {
      ctx.fillStyle = lin(ctx, 0, -200, 0, 780, [[0, P.night1], [.6, P.ind0], [1, P.ind1]]); ctx.fillRect(-W, -H, 3 * W, H + 780 + 1);
      ctx.fillStyle = rad(ctx, WIN.x + WIN.w / 2, WIN.y + WIN.h * .6, 1100, [[0, rgba(P.blue0, .95)], [.45, rgba(P.blue0, .4)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-W, -H, 3 * W, H + 780);
      E.lightForm(ctx, 'window', WIN.x, WIN.y, WIN.w, WIN.h, t, { mullions: [2, 3], dust: 3000, seed: 33, breath: .01 });
      // a shelf and a picture: the room is lived in
      ctx.fillStyle = mixHex(P.night1, P.ind0, .3); ctx.fillRect(250, 430, 260, 12); ctx.fillRect(300, 380, 40, 50); ctx.fillRect(360, 400, 28, 30); ctx.fillRect(560, 250, 150, 110);
      ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 2; ctx.strokeRect(560, 250, 150, 110);
    });
    card(ctx, c, F0, () => {
      ctx.fillStyle = lin(ctx, 0, 780, 0, H, [[0, P.ind1], [.25, P.ind0], [1, P.night0]]); ctx.fillRect(-W, 780, 3 * W, H * 2);
      E.lightPool(ctx, WIN.x + 20, WIN.x + WIN.w - 20, 784, 220, 340, .85);
      // the sofa (left), lit on its right edge
      const sofa = new Path2D(); sofa.roundRect(190, 690, 470, 150, 34); const seat = new Path2D(); seat.roundRect(170, 790, 510, 90, 26); const arm1 = new Path2D(); arm1.roundRect(150, 740, 80, 150, 30); const arm2 = new Path2D(); arm2.roundRect(620, 740, 80, 150, 30);
      const sp = sofa.op(seat, PathOp.Union).op(arm1, PathOp.Union).op(arm2, PathOp.Union);
      ctx.fillStyle = lin(ctx, 150, 0, 700, 0, [[0, P.night1], [1, mixHex(P.ind1, P.blue1, .4)]]); ctx.fill(sp);
      ctx.save(); ctx.clip(sp); ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = 4; ctx.translate(-3, 2); ctx.stroke(sp); ctx.restore();
      E.castShadow(ctx, HBOT[0], HBOT[1], 70, 260, 2.5, .5);
      E.robot(ctx, HBOT[0], HBOT[1], HBOT[2], { dir: -1, light: -1, rim: P.halo0, body: P.night1, hand: 'hand', armR: [.15, .08], armL: [-.12, -.05] });
      const [sx, sy] = [HBOT[0] - 8, HBOT[1] - HBOT[2] * .72];   // the status light on its chest (cyan: on)
      halo(ctx, sx, sy, 22, .7, P.blue0, M.cyan); ctx.fillStyle = M.data; ctx.beginPath(); ctx.arc(sx, sy, 5, 0, 6.29); ctx.fill();
      const x = duX(t), walking = x < HDU[0] - 2;
      E.du(ctx, x, HDU[1], HDU[2], { dir: 1, light: 1, back: .25, walk: walking ? (x + 160) * .028 : undefined, look: smooth(span(t, A.home, A.rules)) * .5 });
    });
    card(ctx, c, 1100, () => {   // a house plant in front, out of focus
      ctx.save(); ctx.filter = 'blur(9px)'; ctx.fillStyle = rgba(P.night0, .9);
      for (let i = 0; i < 7; i++) { const a = -1.9 + i * .22 + Math.sin(t * .5 + i) * .03; ctx.beginPath(); ctx.ellipse(1790 + Math.cos(a) * 160, 1010 + Math.sin(a) * 180, 120, 34, a, 0, 6.29); ctx.fill(); }
      ctx.restore();
    });
  }
  // ---------- I: the plan of light and the four rules ----------
  function planI(ctx, t) {
    const v = vI(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.applyView(ctx, v);
    const g = span(t, T_II0 + .15, T_II1 + .8);
    const walls = [[[200, 190], [1080, 190]], [[1080, 190], [1080, 870]], [[1080, 870], [200, 870]], [[200, 870], [200, 190]],
      [[200, 470], [380, 470]], [[450, 470], [860, 470]], [[930, 470], [1080, 470]], [[640, 190], [640, 470]], [[760, 470], [760, 600]], [[760, 680], [760, 870]]];
    walls.forEach(([a, b], i) => { const d = Math.hypot((a[0] + b[0]) / 2 - RD[0], (a[1] + b[1]) / 2 - RD[1]); const k = sineIO(span(g, d / 900 * .6, d / 900 * .6 + .4)); if (k > 0) trail(ctx, [[a[0], a[1], 3], [b[0], b[1], 3]], k, { w: 3, spark: false, a: .9 }); });
    const ra = smooth(span(g, .5, .9));
    if (ra > 0) for (const [s, x, y] of [['bedroom', 420, 345], ['bath', 860, 345], ['living room', 440, 830], ['kitchen', 920, 830]]) { ctx.save(); ctx.translate(x, y); ctx.scale(1 / v.s, 1 / v.s); E.glowText(ctx, s.toUpperCase(), 0, 0, { size: B.SZ.small, align: 'center', glow: false, col: P.halo2, spacing: .16, a: ra * .8 }); ctx.restore(); }
    // you: a warm dot (with the data box under it later)
    halo(ctx, DU[0], DU[1], 40, .6, P.halo1, P.core0); ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(DU[0], DU[1], 11, 0, 6.29); ctx.fill();
    // 2 · the line across the bedroom door
    const ln = snap(span(t, A.rooms - .1, A.rooms + .5));
    if (ln > 0) { trail(ctx, [[BEDDOOR[0] - 38 * ln, BEDDOOR[1], 5], [BEDDOOR[0] + 38 * ln, BEDDOOR[1], 5]], 1, { w: 5, spark: false }); }
    // the robot: a cool dot with a status ring (1 · off for a moment), it walks to the bedroom and halts at the line
    const [rx, ry] = robI(t), off = smooth(span(t, A.switch - .12, A.switch + .1)) * (1 - smooth(span(t, A.rooms - .7, A.rooms - .4)));
    halo(ctx, rx, ry, 34, .55 * (1 - off * .8), P.blue0, M.cyan);
    ctx.fillStyle = mixHex(M.data, P.ind1, off * .7); ctx.beginPath(); ctx.arc(rx, ry, 11, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(off > .5 ? P.blue1 : M.cyan, .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(rx, ry, 20, 0, 6.29); ctx.stroke();
    // 3 · its camera: a small REC light that goes out on "permission"
    const rec = smooth(span(t, A.stranger - .6, A.stranger - .2)) * (1 - smooth(span(t, A.permission - .1, A.permission + .25)));
    if (rec > 0) { const bl = .75 + .25 * Math.sin(t * 9); halo(ctx, rx + 30, ry - 30, 18, .6 * rec * bl, P.blue0, M.cyan); ctx.fillStyle = rgba(M.cyan, rec * bl); ctx.beginPath(); ctx.arc(rx + 30, ry - 30, 6, 0, 6.29); ctx.fill(); }
    const recOff = smooth(span(t, A.permission, A.permission + .3)) * (1 - smooth(span(t, A.yours + .3, A.yours + .8)));
    if (recOff > 0) { ctx.strokeStyle = rgba(P.blue1, recOff); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(rx + 30, ry - 30, 6, 0, 6.29); ctx.stroke(); }
    // 4 · your data: cool dots up above the house drift home and sink into a small box under your dot
    const dd = smooth(span(t, A.permission + .3, A.permission + .8));
    if (dd > 0) {
      const home = sineIO(span(t, A.data - .3, A.yours)), bx = DU[0], by = DU[1] + 44;
      for (let i = 0; i < 9; i++) {
        const sx = 520 + i * 62 + Math.sin(t * .7 + i) * 10, sy = 120 + Math.sin(t * .9 + i * 1.7) * 14, k = sineIO(span(home, i * .04, .64 + i * .04));
        const x = lerp(sx, bx + (i - 4) * 3, k), y = lerp(sy, by, k) - Math.sin(Math.PI * k) * 40, a = dd * (1 - smooth(span(k, .85, 1)));
        if (a > 0) { halo(ctx, x, y, 12, .45 * a, P.blue0, M.cyan); ctx.fillStyle = rgba(M.data, a); ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 6.29); ctx.fill(); }
      }
      const bk = smooth(span(t, A.data - .1, A.data + .3)), lid = snap(span(t, A.yours + .05, A.yours + .45));
      if (bk > 0) {
        ctx.save(); ctx.globalAlpha = bk; const box = new Path2D(); box.roundRect(bx - 22, by - 6, 44, 30, 5); E.lightShape(ctx, box, t, { lit: 1, dust: 0, seed: 180 });
        ctx.translate(bx - 24, by - 8); ctx.rotate(-1.2 * (1 - lid)); const l = new Path2D(); l.roundRect(0, -6, 48, 8, 3); E.lightShape(ctx, l, t, { lit: 1, dust: 0, seed: 181 }); ctx.restore();
      }
    }
    ctx.restore();
    // the rules, written on the right (screen)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const RULES = [['1', 'off switch', null, A.switch], ['2', 'no-go rooms', null, A.enters], ['3', 'camera', 'only with permission', A.permission], ['4', 'your data', 'stays yours', A.yours]];
    const show = smooth(span(t, T_II1 - .3, T_II1 + .2)) * (1 - smooth(span(t, T_IJ0 + .2, T_IJ0 + .6)));
    RULES.forEach(([n, s, sub, at], i) => {
      const y = 300 + i * 150, u = span(t, at - .45, at + .15), cur = i === 3 ? 1 : 1 - .35 * smooth(span(t, RULES[i + 1][3] - .5, RULES[i + 1][3] - .2));
      if (u <= 0 || show <= 0) return;
      B.write(ctx, n, 1200, y, u, { serif: true, size: 76, align: 'center', a: show * cur });
      B.write(ctx, s, 1260, y - 6, span(u, .2, 1), { size: B.SZ.label, align: 'left', a: show * cur });
      if (sub) B.write(ctx, sub, 1262, y + 40, span(t, at - .1, at + .4), { size: B.SZ.small, align: 'left', col: P.halo2, glow: false, a: show * cur });
    });
    ctx.restore();
  }
  // ---------- J: the robot at the kitchen door asks first ----------
  function kitchen(ctx, t, c) {
    card(ctx, c, 40000, () => { ctx.fillStyle = P.night1; ctx.fillRect(-W, -H, 3 * W, 3 * H); });
    card(ctx, c, WALL, () => {
      ctx.fillStyle = lin(ctx, 0, -200, 0, 905, [[0, P.night1], [.6, P.ind0], [1, P.ind1]]); ctx.fillRect(-W, -H, 3 * W, H + 905);
      ctx.fillStyle = rad(ctx, DOOR.x + DOOR.w / 2, DOOR.y + DOOR.h * .6, 1000, [[0, rgba(P.blue0, .95)], [.5, rgba(P.blue0, .35)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-W, -H, 3 * W, H + 905);
      E.lightForm(ctx, 'gate', DOOR.x, DOOR.y, DOOR.w, DOOR.h, t, { dust: 2500, seed: 41, breath: .01 });
    });
    card(ctx, c, F0, () => {
      ctx.fillStyle = lin(ctx, 0, 905, 0, H, [[0, P.ind1], [.25, P.ind0], [1, P.night0]]); ctx.fillRect(-W, 905, 3 * W, H * 2);
      E.lightPool(ctx, DOOR.x + 10, DOOR.x + DOOR.w - 10, 908, 160, 260, .9);
      // the threshold: a thin line of light on the floor
      trail(ctx, [[DOOR.x - 10, 912, 3], [DOOR.x + DOOR.w + 10, 912, 3]], 1, { w: 3, spark: false, a: .9 });
      const step = sineIO(span(t, A.permission2 + .35, A.locked + .3)), bx = lerp(JBOT[0], JBOT[0] + 40, step), by = lerp(JBOT[1], JBOT[1] - 22, step), bh = JBOT[2] * (1 - .08 * step);
      E.castShadow(ctx, bx, by, 70, 240, 2.6, .5);
      E.robot(ctx, bx, by, bh, { dir: -1, light: -1, rim: P.halo0, body: P.night1, hand: 'hand', walk: step > 0 && step < 1 ? step * 6.283 : undefined, armR: [.12, .06], armL: [-.12, -.05] });
      // it asks first: a ? of light on its chest
      const q = smooth(span(t, A.asks - .25, A.asks + .2)) * (1 - smooth(span(t, A.permission2 + .3, A.permission2 + .8)));
      if (q > 0) { const [qx, qy] = [bx - 6, by - bh * .72]; halo(ctx, qx, qy, 46, .6 * q, P.halo1, P.core0); E.glowText(ctx, '?', qx, qy + 20, { size: 58, serif: true, align: 'center', a: q }); }
      // you nod (twice, small)
      const nod = Math.sin(Math.PI * 2 * span(t, A.permission2 - .1, A.permission2 + .7)) * .5 * (span(t, A.permission2 - .1, A.permission2 + .7) > 0 && span(t, A.permission2 - .1, A.permission2 + .7) < 1 ? 1 : 0);
      E.du(ctx, JDU[0], JDU[1], JDU[2], { dir: 1, light: 1, back: .2, look: .1 + Math.max(0, nod) * .9 });
    });
    card(ctx, c, 1100, () => { ctx.save(); ctx.filter = 'blur(9px)'; ctx.fillStyle = rgba(P.night0, .85); ctx.fillRect(-300, -200, 380, 1500); ctx.restore(); });   // the door frame in front, out of focus
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const la = smooth(span(t, T_IJ1 - .3, T_IJ1 + .2)) * (1 - smooth(span(t, T_IK0, T_IK0 + .3)));
    if (la > 0) {
      B.write(ctx, '1x neo', 150, 200, span(t, A.neo - .1, A.neo + .5), { size: 52, align: 'left', spacing: .2, a: la });
      B.write(ctx, 'asks first · no-go zones', 153, 250, span(t, A.asks - .2, A.asks + .4), { size: B.SZ.small, align: 'left', col: P.halo2, glow: false, a: la });
    }
    ctx.restore();
  }
  // ---------- K: the street: every robot stops at a threshold ----------
  function streetK(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const hs = STREET.xs, open = smooth(span(t, T_IK0 + .2, T_IK1));
    trail(ctx, [[hs[0] - 140, STREET.y + 66, 2], [hs[hs.length - 1] + 140, STREET.y + 66, 2]], open, { spark: false, a: .5 });
    hs.forEach((x, i) => {
      const d = Math.abs(i - KHOUSE), g = i === KHOUSE ? 1 : snap(span(t, T_IK0 + .3 + d * .1, T_IK1 + .2 + d * .1)); if (g <= 0) return;
      E.icon(ctx, 'house', x, STREET.y, 150 * g, t, { lit: 1, dust: 0, seed: 80 + i, a: g });
      // inside: its robot walks to the door and halts at the threshold (staggered from the middle out)
      const k = sineIO(span(t, A.now2 + .5 + d * .32, A.now2 + 1.4 + d * .32)), bump = Math.sin(Math.PI * span(t, A.now2 + 1.4 + d * .32, A.now2 + 1.8 + d * .32)) * 3;
      const ry = lerp(STREET.y - 6, STREET.y + 40, k) - bump, ln = smooth(span(t, A.now2 + 1.1 + d * .32, A.now2 + 1.5 + d * .32));
      if (g > .5) { ctx.fillStyle = rgba(P.night0, .9); ctx.beginPath(); ctx.arc(x, ry, 8.5, 0, 6.29); ctx.fill(); ctx.strokeStyle = rgba(M.cyan, .95); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, ry, 8.5, 0, 6.29); ctx.stroke(); }
      if (ln > 0) trail(ctx, [[x - 26 * ln, STREET.y + 58, 3], [x + 26 * ln, STREET.y + 58, 3]], 1, { w: 3, spark: false });
    });
    const ta = 1 - smooth(span(t, A.b + .25, A.b + .75));   // c11 draws this street on: the words leave there
    B.write(ctx, 'the standard', 960, 300, span(t, A.standard - .2, A.standard + .4), { serif: true, size: 92, a: ta });
    B.write(ctx, 'and the law', 960, 372, span(t, A.law - .2, A.law + .4), { size: B.SZ.label, col: P.halo2, a: ta });
    ctx.restore();
  }

  return [{ t: R.a, draw, print: { editorial: true }, sound: [
    { f: 'stone_click', t: A.upgraded + .12, v: .25 }, { f: 'chime', t: A.end, v: .18 }, { f: 'whoosh_airy', t: T_ID0 + .1, v: .12 }, { f: 'rumble', t: A.now - .5, v: .1 },
    { f: 'multiply', t: A.many - .2, v: .15 }, { f: 'bloom', t: A.need, v: .2 }, { f: 'lever_switch', t: A.switch, v: .2 }, { f: 'screen_off', t: A.permission, v: .15 }, { f: 'key', t: A.yours + .1, v: .18 },
  ] }];
};
