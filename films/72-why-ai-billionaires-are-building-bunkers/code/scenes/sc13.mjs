// c13 · B3 · 'So go back to that door' (p1213) → the end screen (S.endScreen from T.duration − 15). ANCHOR 3/3, the answer, subscribe 2.
// One continuous take, no cut inside: the blank sheet flies down and folds into the hatch lid → the world unfolds into the Leitbild valley,
// the tiny hatch before the lantern crowd → it folds flat again: the list rises out of the hatch's light, all rows resolved, row 2 pulses,
// row 4's circle glows → its light runs out as an arrow along the line to the few at the hatch → all the light at a few → down in the
// section: the few alone in a big lit room → the cut closes, the hatch sinks, the few come up, lanterns rise along the whole line → ★ the
// line bends into the curve of the planet, the lanterns become the lights of the Earth at night → it turns toward first light → subscribe 2
// → the end screen (the same Earth, continuous).
//
// | ID   | anchor (phrase)               | zeigt wörtlich                                | picture                                                                         | layer  | carrier out |
// |------|-------------------------------|-----------------------------------------------|---------------------------------------------------------------------------------|--------|-------------|
// | E.01 | So go back to that door       | go back to that door                          | the sheet flies down and folds into the hatch lid; the world unfolds into the Leitbild | ANCHOR | the hatch |
// | E.02 | The one that only opens       | the door that only opens for a few            | the tiny hatch before the lantern crowd                                           | ANCHOR | the sky     |
// | E.03 | Now you know the reason       | now you know the reason                       | the world folds flat; the list rises out of the hatch's light, all four rows resolved | EXPL | row 2      |
// | E.04 | Not the machine               | not the machine                               | row 2's strike pulses                                                             | EXPL   | row 4       |
// | E.05 | The fear of everyone left     | the fear of everyone left outside             | row 4 US: the gold circle glows: THE FEAR OF EVERYONE LEFT OUTSIDE                | EXPL   | the circle  |
// | E.06 | And that fear points          | that fear points at something true            | the circle's light runs out as an arrow down to the line and along it to the hatch | MIX    | the arrow   |
// | E.07 | A future where a few win      | a few win everything isn't safe               | the light diagram: three gold figures at the hatch, all the light in their pool   | MIX    | the pool    |
// | E.08 | Not even for the few          | not even for the few                          | the section opens: the few alone in a big lit room                                | MIX    | the shaft   |
// | E.09 | The safe one leaves           | the safe one leaves no one outside            | the cut closes, the hatch sinks, the few come up; lanterns rise along the whole line, nobody at a door | ANCHOR | the lanterns |
// | E.10 | You can't build a bunker ★    | no bunker for eight billion people            | the line bends into the curve of the planet, the lanterns become its lights: MORE THAN 8 BILLION PEOPLE (UN, 2024) | MIX | the Earth |
// | E.11 | You can only build            | only a world where nobody needs one           | the Earth at night turns slowly toward first light                                | ANCHOR | the Earth   |
// | A.01 | This channel exists (2nd)     | the mission                                   | the mission line under the Earth                                                  | ANCHOR | the Earth   |
// | A.02 | All eight billion             | all eight billion of us                       | the lights of the Earth brighten a little                                         | ANCHOR | the lights  |
// | A.03 | Want that too (2nd)           | want that too?                                | a cream SUBSCRIBE tag rises under the Earth (a tag, never a button)               | ANCHOR | the tag     |
// | A.04 | Then subscribe (2nd)          | then subscribe                                | the same tag, its underline draws; it sinks before the end screen                 | ANCHOR | the end screen |
// | E.12 | ENDSCREEN                     | (end screen)                                  | S.endScreen (the same Earth, continuous)                                          | ANCHOR |             |
import { E, F, S, X, LY, TAU, lab, view, seamKeys, keyed, above, tag, rowPeople, secBunker, earthCurve, stage1213, P1213, PL1213, p1213 } from '../lib/b3_common.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, halo } = E;
const { GOLD, CREAM, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT72;
const HS = S.HATCH_S;
const FEW = [[1478, 102, 1], [1540, 96, -1], [1655, 100, -1]];
const ROWS = [[200, 1250, 11, 7361], [1900, 2700, 8, 7362], [-1400, 150, 14, 7363], [2750, 4300, 14, 7364]].map(([a, b, n, sd]) => rowPeople(a, b, n, 94, sd));
const ROOM = { x0: 1450, x1: 2250, h: 230 }, CUT = { x0: 1330, x1: 2380, depth: 430 };
const LST = { x: 700, y: 318, s: .56 };
const EE = S.END_EARTH, VEND = { x: 960, y: 540, s: 1 };

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    door: R.a, only: G('The one that only'), few1: G('opens for'), reason: G('Now you know'), machine: G('Not the machine'), fear: G('The fear of'), outside: G('left outside'),
    points: G('And that fear'), fut: G('A future where'), unsafe: G("isn't safe"), notEven: G('Not even for'), safeOne: G('The safe one'), cant: G("You can't build"),
    eight: G('eight billion'), only2: G('You can only'), nobody: G('nobody needs'), ch: G('This channel exists'), so2: G('so that the'), all8: G('All eight'), want: G('Want that too'),
    subs: G('Then subscribe'), endS: T.duration - 15,
  };
  // ---------------------------------------------------------------- phases
  const tFly = [A.door + .5, A.door + 1.45];            // the sheet flies into the hatch lid
  const tUn = [tFly[1] + .05, A.only + 1.0];            // flat 1 → 0 (the Leitbild)
  const tFl = [A.reason - .35, A.reason + .8];          // flat 0 → 1 (the stage)
  const tCurve = [A.cant - .1, A.eight + .9];           // the line bends into the planet
  // ---------------------------------------------------------------- view (sheet) for the world part
  const VD = [...seamKeys(T, 'So go back to that door', P1213.V), [tFly[1], { x: 980, y: 540, s: 1.03 }], [A.only + 1.4, { x: 1180, y: 600, s: .78 }], [A.few1 + .5, { x: 1185, y: 602, s: .79 }],
    [tFl[1], { x: 1200, y: 470, s: .9 }], [A.fear + 1.0, { x: 1200, y: 468, s: .92 }], [A.fut + .3, { x: 1320, y: 480, s: .92 }], [A.notEven - .2, { x: 1380, y: 500, s: .97 }],
    [A.notEven + .9, { x: 1720, y: 720, s: .86 }], [A.safeOne + .5, { x: 1700, y: 700, s: .85 }], [A.safeOne + 2.4, { x: 1000, y: 480, s: .62 }], [tCurve[0], { x: 1000, y: 482, s: .615 }]];
  const vw = (t) => view(t, VD);
  const flat = (t) => t < tFly[1] ? 1 : t < tFl[0] ? 1 - span(t, tUn[0], tUn[1]) : span(t, tFl[0], tFl[1]);
  const poolK = [[A.door, [960, 380, .9]], [tUn[1], [1450, 700, .8]], [tFl[1], [1300, 470, .85]], [A.fut + 1, [1590, 520, .9]], [A.safeOne + 2, [1000, 470, .85]]];
  const pool = (t) => { let i = 0; while (i < poolK.length - 2 && t > poolK[i + 1][0]) i++; const [t0, a] = poolK[i], [t1, b] = poolK[i + 1], u = sineIO(span(t, t0, t1)); return a.map((x, j) => lerp(x, b[j], u)); };

  // ---------------------------------------------------------------- E.01 the sheet flies into the hatch lid (stage1213)
  function sheetFly(ctx, t, v) {
    const u = quartIO(span(t, tFly[0], tFly[1])), Q = P1213.sheet, lid = { x: HS.x, y: LY - 9, w: HS.w, h: 16 };
    const sh = { x: lerp(Q.x, lid.x, u), y: lerp(Q.y, lid.y, u) - Math.sin(Math.PI * u) * 60, w: lerp(Q.w, lid.w, u), h: lerp(Q.h, lid.h, u) };
    const fs = (g) => 1 - span(t, g, g + .7);
    stage1213(ctx, t, v, { pool: pool(t), sheet: sh, cw: 230 * sh.w / Q.w, figs: [fs(tFly[0] + .1), fs(tFly[0] + .2), fs(tFly[0] + .3)], labels: [fs(tFly[0]), fs(tFly[0] + .1), fs(tFly[0] + .2)] });
  }

  // ---------------------------------------------------------------- the line: rows of lanterns, the few, the hatch
  const rowU = (t, j) => j < 2 ? span(t, tFl[0] + .3 + j * .2, tFl[1] + .3 + j * .2) : span(t, A.safeOne + .4 + (j - 2) * .25, A.safeOne + 1.6 + (j - 2) * .25);
  const fewUp = (t) => span(t, A.fut - .1, A.fut + .8), fewDown = (t) => span(t, A.notEven - .25, A.notEven + .35), fewBack = (t) => span(t, A.safeOne + .9, A.safeOne + 1.8);
  const poolU = (t) => sineIO(span(t, A.points + 1.6, A.fut + 1.6)) * (1 - .75 * span(t, A.safeOne + .2, A.safeOne + 1.4));
  const cutU = (t) => span(t, A.notEven - .1, A.notEven + .7) * (1 - span(t, A.safeOne + .1, A.safeOne + 1.0));
  const hatchSink = (t) => span(t, A.safeOne + .6, A.safeOne + 1.5);
  function lanterns(ctx, t, s) {
    ROWS.forEach((row, j) => { const u = rowU(t, j); if (u <= 0) return;
      row.forEach((p, i) => { const k = span(u * 1.4 - (j < 2 ? 0 : Math.abs(i - row.length / 2) / row.length * .4), 0, 1); if (k <= 0) return;
        above(ctx, () => F.lanternPerson(ctx, t, p.x, LY + (1 - expoOut(k)) * p.h * 1.05, p.h, { ph: p.ph, dir: p.dir, lamp: span(k, .4, 1) })); }); });
  }
  function few(ctx, t, s) {
    const up = fewUp(t), dn = fewDown(t), bk = fewBack(t), e = expoOut(up) * (1 - sineIO(dn)) + expoOut(bk) * (dn >= 1 ? 1 : 0);
    if (e <= 0) return;
    const pu = poolU(t), fx = (FEW[0][0] + FEW[2][0]) / 2;
    if (pu > 0) halo(ctx, fx, LY - 60, 140 + 520 * pu, .2 + .35 * pu, GOLD.halo, GOLD.core);
    above(ctx, () => FEW.forEach(([x, h, d], i) => { const xx = bk > 0 && dn >= 1 ? lerp(HS.x, x + (i - 1) * 40, sineIO(bk)) : x;
      halo(ctx, xx, LY - h * .5, h * .9, .26 * e, GOLD.halo, GOLD.core);
      F.person(ctx, xx, LY + (1 - e) * h * 1.1, h, { pose: 'stand', dir: d, light: -1, rim: GOLD.line }); }));
  }
  function hatchDraw(ctx, t, s, f) {
    const hp = S.hatchAt(f), sk = hatchSink(t); if (sk >= 1) return;
    const open = (.55 * span(t, tUn[0], tUn[0] + 1.0) * (1 - .7 * sineIO(f)) + .6 * span(t, A.fut, A.fut + .8)) * (1 - span(t, A.safeOne, A.safeOne + .6));
    halo(ctx, hp.x - hp.w * .2, hp.y + 10, hp.w * 1.4, .2 * open, GOLD.halo, GOLD.core);
    const d = () => F.hatch(ctx, t, hp.x, hp.y + sineIO(sk) * 70, hp.w, { tilt: hp.tilt, open, glow: 1, s });
    if (sk > 0) above(ctx, d); else d();
  }
  function room(ctx, t, s) {
    const c = cutU(t); if (c <= 0) return;
    ctx.save(); ctx.beginPath(); ctx.rect(CUT.x0, LY, CUT.x1 - CUT.x0, CUT.depth * sineIO(c)); ctx.clip();
    secBunker(ctx, t, HS.x, LY, { s, depth: 120, room: ROOM, light: 1, door: 1, people: [[2080, 92, -1], [2130, 86, 1], [2185, 90, -1]].map(([x, h, dir]) => ({ x, h, dir, gold: .9 })) });
    halo(ctx, (ROOM.x0 + ROOM.x1) / 2, LY + 120 + ROOM.h * .5, ROOM.x1 - ROOM.x0, .22, GOLD.halo, GOLD.core);
    ctx.restore();
  }

  // ---------------------------------------------------------------- E.03–E.06 the list (screen), the arrow
  const listU = (t) => quartIO(span(t, A.reason - .15, A.reason + .9));
  const listFold = (t) => span(t, A.points + .5, A.points + 1.3);
  function rows(t) {
    return [
      { num: 1, write: 1, strike: 1, kind: 'thin', verdict: SRC.verdicts[0], vu: 1 },
      { num: 1, write: 1, strike: 1, kind: 'bold', verdict: SRC.verdicts[1], vu: 1, lit: F.bump(t, A.machine - .05, 1.1), big: F.bump(t, A.machine - .05, 1.1) * .5 },
      { num: 1, write: 1, strike: 1, kind: 'half', verdict: SRC.verdicts[2], vu: 1 },
      { num: 1, redact: 1, peel: 1, write: 1, lit: span(t, A.fear - .1, A.fear + .4), circle: span(t, A.reason + .5, A.reason + 1.1) },
    ];
  }
  function list(ctx, t, v) {
    const u = listU(t), fo = listFold(t); if (u <= 0 || fo >= 1) return null;
    const [hx, hy] = X.toScreen(v, HS.x, LY - 20), x = lerp(hx, LST.x, u), y = lerp(hy, LST.y, u), s = lerp(.05, LST.s, u);
    const L = F.list(ctx, t, x, y, { s, title: span(t, A.reason + .3, A.reason + .9), fold: fo, rows: rows(t) });
    const cu = span(t, A.fear - .05, A.fear + .7) * (1 - fo);
    if (L && cu > 0) { const r = L.rows[3], cx = r.x + 8 * s, cy = r.y, rr = (r.tw / 2 + 46) * s;
      halo(ctx, cx, cy, rr * 2.2, .35 * cu * (.85 + .15 * Math.sin(t * 3)), GOLD.halo, GOLD.core); }
    return L;
  }
  const arrowU = (t) => sineIO(span(t, A.points + .2, A.points + 1.9)), arrowTail = (t) => sineIO(span(t, A.fut + .1, A.fut + 1.3));
  let circleAt = null;
  function arrow(ctx, t, v) {
    const u = arrowU(t), u0 = arrowTail(t); if (u <= 0 || u0 >= 1 || !circleAt) return;
    const [lx0, ly] = X.toScreen(v, 900, LY), [lx1] = X.toScreen(v, FEW[0][0] - 60, LY), [c0, c1] = circleAt;
    const q0 = [c0, c1 + 30], qc = [c0 - 10, ly - 6], q1 = [lx0, ly - 6];
    const pts = [...Array.from({ length: 16 }, (_, i) => { const f = i / 15; return [(1 - f) ** 2 * q0[0] + 2 * f * (1 - f) * qc[0] + f * f * q1[0], (1 - f) ** 2 * q0[1] + 2 * f * (1 - f) * qc[1] + f * f * q1[1]]; }), [lx1, ly - 6]];
    F.goldSpan(ctx, pts, u0, u, { w: 4, spark: u < 1 });
    if (u > .9 && u0 < .9) X.arrow(ctx, [[lx1 - 60, ly - 6], [lx1, ly - 6]], 1, { col: GOLD.line, w: 4, head: 18 });
  }

  // ---------------------------------------------------------------- the world (valley ↔ stage)
  function world(ctx, t) {
    const v = vw(t), f = flat(t), pl = pool(t);
    S.valleyWorld(ctx, t, v, { flat: f, lx: pl[0], ly: pl[1], pool: pl[2], open: .55, row: 0, you: false, hatch: { x: -9999, w: .001 }, crowd: 1,
      cut: cutU(t) > 0 ? { ...CUT, u: cutU(t) } : null, under: (c, s) => room(c, t, s),
      over: (c, s) => { hatchDraw(c, t, s, f); lanterns(c, t, s); few(c, t, s); } });
    if (t > A.reason - .3) { const L = list(ctx, t, v); if (L) { const r = L.rows[3]; circleAt = [r.x, r.y]; } arrow(ctx, t, v); }
    X.label(ctx, SRC.onlyFew, ...X.toScreen(v, HS.x - 80, 330), lab(t, A.only + .2, A.reason - .4), { size: 34, spacing: .14, gold: .45 });
    X.label(ctx, SRC.fear, LST.x, LST.y + 200, lab(t, A.fear + .1, A.points + .9), { size: 30, spacing: .12, gold: .5 });
  }

  // ---------------------------------------------------------------- E.10 ★ the line bends into the planet, the lanterns become its lights
  const V10 = { x: 1000, y: 482, s: .615 };
  const curveE = (t) => sineIO(span(t, tCurve[0], tCurve[1]));
  // the turn: faster at first, slowing into the end screen's own .012 rad/s (same angle, same speed at T.duration − 15)
  const earthAt = (t) => { const d = Math.max(0, A.endS - t), z = sineIO(span(t, A.only2, A.endS)); return { ...EE, r: EE.r * (1 + .1 * (1 - z)), cy: EE.cy + 26 * (1 - z), rot: 1.1 + t * .012 - .0055 * d * d / 2 }; };
  const lightsAt = (t) => lerp(.82, 1, span(t, A.all8, A.all8 + 1.2)) * span(t, tCurve[0] + .6, tCurve[1] + .4);
  const dawnAt = (t) => .55 * sineIO(span(t, A.only2 - .3, A.ch)) + .2 * span(t, A.endS, A.endS + 15);
  function planet(ctx, t) {
    const e = curveE(t), b = S.breathe(t), v = { x: lerp(V10.x, VEND.x, e) + b.dx, y: lerp(V10.y, VEND.y, e) + b.dy, s: lerp(V10.s, VEND.s, e) };
    X.ground(ctx, t, v, { lx: lerp(1000, 960, e), ly: lerp(470, 300, e), pool: lerp(.85, .7, e), earth: 0, line: 0 });
    const ea = earthAt(t), yl = 540 + (LY - V10.y) * V10.s, R0 = 60000, R = Math.exp(lerp(Math.log(R0), Math.log(ea.r), e)), top = lerp(yl, ea.cy - ea.r, e), cy = top + R;
    earthCurve(ctx, t, { ...ea, cy, r: R, lights: lightsAt(t), dawn: dawnAt(t) });
    // the stage's earth on the disc, giving way as it curves (the material of the ground becomes the night side of the planet)
    const ga = 1 - span(e, .1, .7); if (ga > 0) { ctx.save(); ctx.beginPath(); ctx.arc(960, cy, R, 0, TAU); ctx.clip(); ctx.globalAlpha *= ga;
      ctx.translate(0, top - yl); X.inView(ctx, v, (s) => { const [x0] = X.toSheet(v, -80, 0), [x1] = X.toSheet(v, W + 80, 0), [, yb] = X.toSheet(v, 0, H + 80); X.earth(ctx, t, x0, x1, LY, Math.max(yb, LY + 10) + 1200, s); }); ctx.restore(); }
    // the ground line becomes the rim
    const la = 1 - span(e, .35, .8); if (la > 0) { ctx.save(); ctx.strokeStyle = rgba(CREAM, .78 * la); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(960, cy, R, Math.PI * 1.5 - Math.min(1.6, 1400 / R), Math.PI * 1.5 + Math.min(1.6, 1400 / R)); ctx.stroke(); ctx.restore(); }
    // the lanterns ride the curve and shrink to points of light
    const sc = 1 - span(e, 0, .45), da = 1 - span(e, .5, .9);
    if (da > 0) for (const row of ROWS) for (const p of row) {
      const sx = 960 + (p.x - V10.x) * V10.s, th = (sx - 960) / R; if (Math.abs(th) > 1.45) continue;
      const px = 960 + R * Math.sin(th), py = cy - R * Math.cos(th);
      if (sc > .06) { ctx.save(); ctx.translate(px, py); ctx.rotate(th); F.lanternPerson(ctx, t, 0, 0, p.h * V10.s * sc, { ph: p.ph, dir: p.dir, lamp: 1 }); ctx.restore(); }
      else F.glowDot(ctx, px, py - 4 * sc, 10, .8 * da * Math.cos(th), 'gold');
    }
    if (da > 0) FEW.forEach(([x0, h, d], i) => { const sx = 960 + (lerp(HS.x, x0 + (i - 1) * 40, 1) - V10.x) * V10.s, th = (sx - 960) / R, px = 960 + R * Math.sin(th), py = cy - R * Math.cos(th);
      if (sc > .06) { ctx.save(); ctx.translate(px, py); ctx.rotate(th); halo(ctx, 0, -h * V10.s * sc * .5, h * V10.s * sc, .26, GOLD.halo, GOLD.core); F.person(ctx, 0, 0, h * V10.s * sc, { pose: 'stand', dir: d, light: -1, rim: GOLD.line }); ctx.restore(); }
      else F.glowDot(ctx, px, py, 12, .9 * da, 'gold'); });
    X.label(ctx, SRC.eight, 960, 650, lab(t, A.eight + .7, A.only2 + 1.6), { size: 40, spacing: .12, gold: .5 });
    F.source(ctx, t, A.eight, A.only2 + 1.6, SRC.eightSrc);
    // A.01–A.04: the mission, the tag (under the Earth)
    X.label(ctx, SRC.mission, 960, 640, lab(t, A.ch + .2, A.want - .3), { size: 32, spacing: .12, gold: .35 });
    const tu = span(t, A.want - .15, A.want + .5) * (1 - sineIO(span(t, A.endS - 1.1, A.endS - .3)));
    if (tu > 0) tag(ctx, SRC.subscribe, 960, 650, tu, span(t, A.subs + .05, A.subs + .7) * span(tu, .9, 1));
  }
  function draw(ctx, t) {
    if (t < tFly[1]) return sheetFly(ctx, t, vw(t));
    if (t < tCurve[0]) return world(ctx, t);
    planet(ctx, t);
  }
  const tP = A.endS;
  const marks = [R.a + S.SEAM_HALF, A.only, A.reason, A.fear, A.points, A.fut, A.notEven, A.safeOne, A.cant, A.only2, A.ch, A.all8, A.want];
  return [{ t: R.a, draw: (ctx, t) => p1213(ctx, t, T), print: PR }, ...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => S.endScreen(ctx, t, T), print: PR }];
};
