// c09 · Mondragon, Fagor, untested, the vote on time, fewer robots (03c rest, 03d start) · 454.14–507.52 · morning · ★ 9.08 (8 h → 6 h)
// Builder B3. Explainers ≈ 72 % (light on night). Carries on the pull-back of c08 (same draw until the zoom has landed).
//
// | beat | time | anchor | picture | hero | moves | transition → carrier · position · direction |
// |---|---|---|---|---|---|---|
// | A EXPL | 454.14–456.62 | moves 455.50 | the globe: from INDIA a thread runs WEST over the co-op ring to the Basque point | thread head | zoom out · pan west | the west point becomes the Basque sun · left · in |
// | B 3D   | 456.62–462.14 | Basque 457.02 · tens 459.66 · workers 461.42 | green hills at sunrise, workshops with sawtooth roofs; warm hand prints appear on their gates | sun | world opens · prints | iris out of the near gate · centre · in |
// | C EXPL | 462.14–467.98 | out 463.34 · move 464.86 · go 466.86 | the workshops as factories of light; one goes dark, its people (warm dots) walk over to the next one, none is lost | the row | dark node · dots walk | push onto the dark node · left · in |
// | D EXPL | 467.98–474.14 | worked 468.86 · Fagor 470.66 · thirteen 472.86 | the dark node: FAGOR · `2013` · bankrupt | the number | push · write | pan east along the row to the ring · right |
// | E EXPL | 474.14–479.18 | idea 476.54 · tested 478.06 | the co-op ring again, now dotted: an idea, `not yet tested` | dotted ring | pan · dotted | one share slides out · right · down |
// | F EXPL | 479.18–482.96 | worth 480.62 · counts 481.58 | the share becomes a price counter with empty digits: `what is one lesson worth?` | counter | slide · digits search | the world opens around the counter → the hall clock · up |
// | G 3D   | 482.96–485.60 | vote 484.72 | the hall: you and the other trainers raise a hand (staggered) | window | hands · tilt to the clock | push into the clock face · top · in |
// | H ★ EXPL | 485.60–492.64 | time 488.80 · income 491.84 | the clock becomes a day of light: the work arc shrinks 8 h → 6 h, the income bar stays the same | the arc | arc shrinks · bar | the day closes back into the clock · top · out |
// | I 3D   | 492.64–496.48 | people 495.44 | you hang the headset on a hook and walk into the light of the window | window | you walk · camera follows | flight into the window light |
// | J 3D   | 496.48–499.36 | vineyard 498.40 | out of the light: the vineyard in the morning, rows as lines of light, the shared robot between the rows | sun | rows · robot | iris out of the robot · right · in |
// | K EXPL | 499.36–507.52 | corner 504.28 · fewer 505.12 · work 506.64 | houses of light; by every door an idle dotted robot → they fold into ONE warm robot that walks the loop, every house gets its work | the robot | dots fold · robot walks | the robot walks on to the right → c10 (into the shared shed) |
import * as B from '../lib/f10_c08_b3.mjs';
import sc08, { MAP, drawLimb, mapPoint, EAST, WEST, H_END } from './sc08.mjs';
import { Path2D, PathOp } from '@napi-rs/canvas';
const { E, P, M, W, H, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, quartIO, halo, trail, catmull } = B;
const { card, cam3, aim, camAt, camDrift, project, F0 } = E;

// the K explainer's world (shared with c10's start): a street of houses of light and the one shared robot on its loop
export const STREET = { y: 680, xs: [300, 520, 740, 960, 1180, 1400, 1620], loopY: 830 };

export default async (T, R) => {
  E.prepareEditorial();
  const w = B.wordAt(T);
  const A = {
    t0: R.a, moves: w('moves', 455.5), in: w('in', 456.62), basque: w('basque', 457.02), mond: w('mondragon', 458.02), tens: w('tens', 459.66), workers: w('workers', 461.42),
    when: w('when', 462.14), out: w('out', 462.86), people: w('people', 464.14), move: w('move', 464.86), go: w('go', 466.86),
    not: w('not', 467.98), worked: w('worked', 468.86), mond2: w('mondragon', 469.54), fagor: w('fagor', 470.66), bankrupt: w('bankrupt', 472.06), thirteen: w('thirteen', 472.86),
    and: w('and', 474.14), full: w('full', 474.54), idea: w('idea', 476.54), tested: w('tested', 478.06),
    what: w('what', 479.18), worth: w('worth', 480.62), who: w('who', 481.26), counts: w('counts', 481.58),
    now: w('now', 482.96), vote: w('vote', 484.72), members: w('members', 485.68), money: w('money', 487.84), time: w('time', 488.8), shorter: w('shorter', 489.92), same: w('same', 491.36), income: w('income', 491.84),
    thats: w("that's", 492.64), take: w('take', 494.08), reaches: w('reaches', 495.04), peopleR: w('people', 495.44),
    planet: w('planet', 496.72), go2: w('go', 497.76), vineyard: w('vineyard', 498.4), when2: w('when', 499.36), robot2: w('robot', 500.72), share: w('share', 501.68), nobody: w('nobody', 502.56), corner: w('corner', 504.28),
    fewer: w('fewer', 505.12), same2: w('same', 506.32), work: w('work', 506.64), end: R.b,
  };
  // c08 draws the first second (its pull-back lands at H_END)
  const r8 = { a: T.S('03b', 'So picture the training'), b: R.a };
  const c08 = (await sc08(T, r8))[0].draw;
  const T_H = r8.b + 1.2;   // = c08's A.end + 1.2, the view is H_END

  // ================= A: the west thread on the globe =================
  const T_W0 = A.t0 + .35, T_W1 = A.moves + .9;                       // thread grows from INDIA over the ring to the BASQUE point
  const KA = [[T_H, H_END], [T_W1, { s: .62, x: 540, y: 640 }, 's'], [A.in + .35, { s: 2.4, x: WEST[0], y: WEST[1] }, 's', WEST]];
  const vA = (t) => B.vDrift(B.viewAt(t, KA), t, .3, 21);
  const westPts = (() => { const [rx, ry, rr] = MAP.ring; return catmull([[EAST[0], EAST[1], 3], [1500, 520, 3], [rx, ry + rr + 40, 3], [400, 520, 3], [WEST[0], WEST[1], 3]], 14); })();
  // ================= B: the Basque hills =================
  const T_WB = A.in - .2, T_WBF = A.in + .8;
  const SUN = { Z: 9000, u: 700, v: 560, r: 150 };
  const WB = B.viewToScreen(B.viewAt(T_WB, KA), WEST[0], WEST[1]);
  const KB = [[T_WB, cam3({ x: -60, y: 10, z: -70 })], [T_WBF + .5, cam3({ x: -20, y: 0, z: 30 }), 's'], [A.when, cam3({ x: 40, y: -10, z: 160 })]];
  const camB = (t) => camDrift(camAt(t, KB, SUN.Z), t, .5, 31);
  const SHOPS = [   // workshops on the hills: [Z, x, base y, w, h, prints]
    [4000, 330, 742, 330, 150, 6], [4000, 1250, 730, 300, 140, 6], [F0, 560, 905, 420, 210, 8], [F0, 1500, 900, 380, 190, 8],
  ];
  const NEAR = 2;   // the gate the iris grows out of
  // ================= C/D/E/F: the row of workshops → Fagor → the ring (dotted) → the counter (field, design units) =================
  const ROW = [[300, 560], [640, 470], [980, 520], [1320, 455], [1640, 545]];   // workshop nodes; #1 goes dark (Fagor)
  const DARK = 1, TO = 2, RING = [2500, 470, 190], CTR = [3060, 600];
  const T_IC = A.when - .3, T_ICF = T_IC + .85;
  const gateScreen = (t) => { const c = camB(t), s = SHOPS[NEAR]; return project(c, s[0], s[1], s[2] - s[4] * .32); };
  const GS = gateScreen(T_ICF);
  const KC = [
    [T_ICF, B.viewPut(ROW[TO][0], ROW[TO][1], GS[0], GS[1], 1.9)],
    [A.out + .3, { s: .95, x: 970, y: 520 }, 's', ROW[TO]],
    [A.worked + .2, { s: .98, x: 950, y: 520 }], [A.fagor - .55, { s: .985, x: 948, y: 520 }],
    [A.fagor + .2, { s: 1.9, x: ROW[DARK][0], y: ROW[DARK][1] + 110 }, 'q', ROW[DARK]],
    [A.and - .05, { s: 2.0, x: ROW[DARK][0] + 5, y: ROW[DARK][1] + 112 }],
    [A.idea, { s: 1.15, x: RING[0], y: RING[1] + 60 }, 's'],
    [A.what + .1, { s: 1.18, x: RING[0] + 10, y: RING[1] + 60 }],
    [A.worth + .1, { s: 1.0, x: 2800, y: 520 }, 'q'],
    [A.now + .4, { s: 1.03, x: 2810, y: 522 }],
  ];
  const vC = (t) => B.vDrift(B.viewAt(t, KC), t, .4, 41);
  const dotsWalk = 9;
  // ================= G: the hall votes =================
  const T_WG = A.now - .35, T_WGF = A.now + .85;
  const CLOCK = [860, 205, 62];
  const KG = [[T_WG, aim(F0, 700, 600, 1.6)], [T_WGF + .3, cam3({ x: -60, y: 20, z: 140 }), 's'], [A.vote + .2, cam3({ x: -70, y: 10, z: 200 })],
    [A.members + .5, aim(F0, CLOCK[0], CLOCK[1], 3.2), 'q']];
  const camG = (t) => camDrift(camAt(t, KG), t, .5, 51);
  const TRAINERS = [[130, 934, 240], [300, 926, 232], [465, 918, 226], [930, 912, 222]];   // others at their stations (indigo)
  const handUp = (t, i) => smooth(span(t, A.vote - .55 + i * .06, A.vote + .25 + i * .06));
  // ================= H: the day of light =================
  const T_IH = A.members + .1, T_IHF = T_IH + 1.0, T_IHB = A.thats - .85, T_IHBF = A.thats + .5;
  // ================= I: you walk out =================
  const KI = [[T_IHB, aim(F0, CLOCK[0], CLOCK[1], 3.2)], [A.thats + 1.2, cam3({ x: -40, y: 10, z: 120 }), 's'], [A.reaches - .2, cam3({ x: -10, y: 8, z: 150 })],
    [A.planet + .25, aim(F0, 1370, 470, 55), 'i']];
  const camI = (t) => camDrift(camAt(t, KI), t, .5, 61);
  const walkU = (t) => smooth(span(t, A.take - .2, A.planet - .1));
  // ================= J: the vineyard =================
  const VSUN = { Z: 9000, u: 1180, v: 470, r: 140 };
  const KJ = [[A.planet + .25, aim(VSUN.Z, VSUN.u, VSUN.v, 9)], [A.vineyard + .6, cam3({ x: 20, y: -10, z: 60 }), 's'], [A.when2 + .2, cam3({ x: 60, y: 10, z: 200 })]];
  const camJ = (t) => camDrift(camAt(t, KJ, VSUN.Z), t, .5, 71);
  const VBOT = [1240, 880, 230];
  const T_IK = A.when2 - .15, T_IKF = T_IK + .85;

  const draw = (ctx, t) => {
    if (t < T_H) { c08(ctx, t); return; }
    if (t < T_WB) { B.fieldFill(ctx, { t }); mapA(ctx, t); return; }
    if (t < T_WBF) { const c = camB(t), [qx, qy] = project(c, SUN.Z, SUN.u, SUN.v), [wx, wy] = B.viewToScreen(B.viewAt(t, KA), WEST[0], WEST[1]), m = smooth(span(t, T_WB, T_WBF)), sx = lerp(wx, qx, m), sy = lerp(wy, qy, m); B.irisWorld(ctx, sx, sy, B.irisR(span(t, T_WB, T_WBF), 8, sx, sy), () => basque(ctx, t, c), () => mapA(ctx, t), { t }); return; }
    if (t < T_ICF) { const c = camB(t); basque(ctx, t, c); if (t > T_IC) { const [gx, gy] = gateScreen(t); B.iris(ctx, gx, gy, B.irisR(span(t, T_IC, T_ICF), 30, gx, gy), () => rowC(ctx, t), { t }); } return; }
    if (t < T_WG) { B.fieldFill(ctx, { t }); rowC(ctx, t); return; }
    if (t < T_WGF) { const [cx, cy] = B.viewToScreen(vC(t), CTR[0], CTR[1]); const c = camG(t); B.irisWorld(ctx, cx, cy, B.irisR(span(t, T_WG, T_WGF), 30, cx, cy), () => hallG(ctx, t, c), () => rowC(ctx, t), { t }); return; }
    if (t < T_IHF) { const c = camG(t); hallG(ctx, t, c); if (t > T_IH) { const [cx, cy, k] = project(c, F0, CLOCK[0], CLOCK[1]); B.iris(ctx, cx, cy, B.irisR(span(t, T_IH, T_IHF), CLOCK[2] * k, cx, cy), () => dayH(ctx, t, cx, cy, CLOCK[2] * k), { t }); } return; }
    if (t < T_IHB) { B.fieldFill(ctx, { t }); dayH(ctx, t); return; }
    if (t < A.planet + .25) {
      const c = camI(t); hallI(ctx, t, c);
      if (t < T_IHBF) { const [cx, cy, k] = project(c, F0, CLOCK[0], CLOCK[1]), u = 1 - span(t, T_IHB, T_IHBF); B.iris(ctx, cx, cy, B.irisR(u, CLOCK[2] * k, cx, cy), () => dayH(ctx, t, cx, cy, CLOCK[2] * k), { t }); }
      E.lightFlood(ctx, smooth(span(t, A.planet - .95, A.planet + .25)));   // time-based: the flood never jumps in a few frames
      return;
    }
    const c = camJ(t);
    if (t < T_IKF) { vineyard(ctx, t, c); E.lightFlood(ctx, 1 - smooth(span(t, A.planet + .25, A.planet + 1.65)));
      if (t > T_IK) { const [bx, by] = project(c, F0, VBOT[0], VBOT[1] - VBOT[2] * .55); B.iris(ctx, bx, by, B.irisR(span(t, T_IK, T_IKF), 40, bx, by), () => streetK(ctx, t, bx, by), { t }); }
      return; }
    B.fieldFill(ctx, { t }); streetK(ctx, t);
  };

  // ---------- A ----------
  function mapA(ctx, t) {
    const v = vA(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.applyView(ctx, v);
    drawLimb(ctx, t, v, 1);
    const [rx, ry, rr] = MAP.ring;
    B.shares(ctx, rx, ry, rr, t, { n: 13, u: 1, hi: 12, hk: .6 });
    E.du(ctx, MAP.du[0], MAP.du[1], MAP.du[2] * .5, { dir: 1, light: 1, back: .2, headset: true, look: .9, armR: [.35, .3], armL: [-.1, -.04] });
    const u = expoOut(span(t, T_W0, T_W1));
    trail(ctx, westPts.map((p) => [p[0], p[1], 3 / v.s]), u, { w: 3 / v.s });
    mapPoint(ctx, t, EAST, 1, 'india', v);
    mapPoint(ctx, t, WEST, 1, 'basque country', v, { la: 1 - smooth(span(t, A.in - .6, A.in - .2)) });
    ctx.restore();
  }
  // ---------- B: the Basque Country ----------
  function shop(ctx, x, y, w, h, t, prints, light) {   // a workshop: sawtooth roof, a big gate; warm hand prints appear on the gate
    const teeth = 4, tw = w / teeth;
    ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - h);
    for (let i = 0; i < teeth; i++) { const x0 = x - w / 2 + i * tw; ctx.lineTo(x0 + tw * .75, y - h - h * .32); ctx.lineTo(x0 + tw * .75, y - h); ctx.lineTo(x0 + tw, y - h); }
    ctx.lineTo(x + w / 2, y); ctx.closePath();
    // walls: warm where the low sun hits them, cool in the lee
    ctx.fillStyle = lin(ctx, x - w / 2 * light, 0, x + w / 2 * light, 0, [[0, mixHex(P.ind1, P.halo1, .28)], [.55, mixHex(P.ind0, P.blue1, .25)], [1, mixHex(P.night1, P.ind0, .5)]]); ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = rgba(P.halo1, .8); ctx.lineWidth = 4; ctx.translate(-4 * light, 3); ctx.stroke(); ctx.restore();
    // the sawtooth glazing glows: people work inside
    for (let i = 0; i < teeth; i++) {
      const x0 = x - w / 2 + i * tw + tw * .75, gl = new Path2D(); gl.rect(x0 - 3, y - h - h * .3, 6, h * .3);
      ctx.fillStyle = rgba(P.halo0, .85); ctx.fill(gl); halo(ctx, x0, y - h - h * .15, h * .22, .35, P.halo1, P.core0);
    }
    const gw = w * .32, gh = h * .62, gx = x - gw / 2, gy = y - gh;
    ctx.fillStyle = rad(ctx, x, y, gh * 1.1, [[0, mixHex(P.halo1, P.night0, .35)], [1, mixHex(P.night0, P.halo1, .12)]]); ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeStyle = rgba(P.halo0, .55); ctx.lineWidth = 2; ctx.strokeRect(gx, gy, gw, gh);
    const r = E.prng(prints * 7 + Math.round(x));
    for (let i = 0; i < prints; i++) {
      const k = expoOut(span(t, A.workers - .7 + i * .09 + (x % 7) * .02, A.workers - .1 + i * .09 + (x % 7) * .02)); if (k <= 0) continue;
      const px = gx + gw * (.18 + .64 * ((i % 4) / 3)) + (r() - .5) * 8, py = gy + gh * (.25 + .4 * Math.floor(i / 4)) + (r() - .5) * 10;
      E.icon(ctx, 'hand', px, py, gh * .3 * (.8 + .2 * k), t, { lit: 1, a: k, dust: 0, glow: .7 });
    }
  }
  function basque(ctx, t, c) {
    card(ctx, c, 40000, () => B.morningSky(ctx, .8, 700, { t }));
    card(ctx, c, SUN.Z, () => {
      B.sun(ctx, SUN.u, SUN.v, SUN.r, t, { rays: true, dust: 2500 });
      B.hill(ctx, [[-400, 700], [200, 650], [700, 690], [1200, 630], [1700, 668], [2400, 640]], { c0: mixHex(B.M.leaf0, P.ind0, .4), c1: P.ind0, rim: rgba(P.halo1, .5) });
    });
    card(ctx, c, 4000, () => {
      B.hill(ctx, [[-400, 760], [300, 728], [900, 752], [1500, 718], [2400, 744]], { c0: mixHex(B.M.leaf0, P.ind1, .3), c1: P.night1, rim: rgba(B.M.leafLit, .6) });
      for (const s of SHOPS.filter((q) => q[0] === 4000)) shop(ctx, s[1], s[2], s[3], s[4], t, s[5], s[1] < 700 ? -1 : 1);
    });
    card(ctx, c, F0, () => {
      B.hill(ctx, [[-300, 930], [500, 900], [1100, 918], [2300, 896]], { c0: mixHex(B.M.leaf0, P.ind1, .4), c1: P.night0, rim: rgba(B.M.leafLit, .75), rimW: 3 });
      for (const s of SHOPS.filter((q) => q[0] === F0)) shop(ctx, s[1], s[2], s[3], s[4], t, s[5], s[1] < 700 ? -1 : 1);
    });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const la = 1 - smooth(span(t, A.when - .5, A.when - .1));
    if (la > 0) {
      B.write(ctx, 'mondragon', 150, 200, span(t, A.mond - .1, A.mond + .5), { size: 60, align: 'left', a: la, spacing: .22 });
      B.write(ctx, 'basque country', 153, 250, span(t, A.mond + .1, A.mond + .7), { size: B.SZ.small, align: 'left', col: P.halo2, glow: false, a: la });
      B.write(ctx, 'tens of thousands of worker-owners', 153, 300, span(t, A.tens - .1, A.tens + .6), { size: B.SZ.small, align: 'left', a: la });
    }
    ctx.restore();
  }
  // ---------- C–F: the row of workshops, Fagor, the dotted ring, the counter ----------
  function rowC(ctx, t) {
    const v = vC(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.applyView(ctx, v);
    const grow = (i) => expoOut(span(t, T_IC + .2 + Math.abs(i - TO) * .12, T_ICF + .4 + Math.abs(i - TO) * .12));
    const dark = smooth(span(t, A.out - .3, A.out + .5));
    // the lines between neighbours (a network of co-ops)
    for (let i = 0; i < ROW.length - 1; i++) { const a = ROW[i], b = ROW[i + 1], g = Math.min(grow(i), grow(i + 1)); trail(ctx, B.arcPts([a[0] + 70, a[1]], [b[0] - 70, b[1]], 30, 30, 1.6), g, { w: 1.6, a: .5, spark: false }); }
    ROW.forEach(([x, y], i) => {
      const g = grow(i); if (g <= 0) return;
      const lit = i === DARK ? 1 - dark : 1;
      E.icon(ctx, 'factory', x, y, 120 * (.6 + .4 * g), t, { lit, a: g * (i === DARK ? lerp(1, .55, dark) : 1), dust: 0, seed: 70 + i, glow: i === DARK ? lerp(1, 1.4, dark) : 1 });
    });
    // its people walk over to the next workshop: warm dots along an arc, staggered; none is lost
    const a = ROW[DARK], b = ROW[TO], path = B.arcPts([a[0] + 30, a[1] + 70], [b[0] - 30, b[1] + 70], -60, 40, 2);
    for (let i = 0; i < dotsWalk; i++) {
      const k = sineIO(span(t, A.people - .2 + i * .12, A.move + .9 + i * .12)), appear = smooth(span(t, A.out + .2 + i * .05, A.out + .6 + i * .05));
      if (appear <= 0) continue;
      const [x, y] = B.along(path, k), bob = Math.sin(t * 7 + i) * 2 * (k > 0 && k < 1 ? 1 : 0);
      const ox = (i % 3 - 1) * 14 * (1 - Math.sin(Math.PI * k)), oy = (Math.floor(i / 3) - 1) * 12 * (1 - Math.sin(Math.PI * k));
      halo(ctx, x + ox, y + oy + bob, 16, .55 * appear, P.halo1, P.core0); ctx.fillStyle = P.core1; ctx.globalAlpha = appear; ctx.beginPath(); ctx.arc(x + ox, y + oy + bob, 5.5, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1;
    }
    const la = smooth(span(t, A.move - .2, A.move + .4)) * (1 - smooth(span(t, A.worked - .2, A.worked + .2)));
    if (la > 0) { ctx.save(); ctx.translate(ROW[TO][0], ROW[TO][1] + 150); ctx.scale(1 / v.s, 1 / v.s); B.write(ctx, 'moved, not let go', 0, 0, span(t, A.move - .1, A.move + .5), { size: B.SZ.small, a: la }); ctx.restore(); }
    // D · FAGOR · 2013
    const fa = smooth(span(t, A.fagor - .3, A.fagor + .2)) * (1 - smooth(span(t, A.and + .2, A.and + .7)));
    if (fa > 0) {
      ctx.save(); ctx.translate(ROW[DARK][0], ROW[DARK][1]); ctx.scale(1 / v.s, 1 / v.s);
      B.write(ctx, 'fagor', 0, 190, span(t, A.fagor - .2, A.fagor + .4), { size: 52, a: fa, spacing: .22 });
      B.write(ctx, '2013', 0, 330, span(t, A.thirteen - .4, A.thirteen + .2), { serif: true, size: 132, a: fa });
      B.write(ctx, 'bankrupt', 0, 382, span(t, A.bankrupt - .1, A.bankrupt + .5), { size: B.SZ.small, col: P.halo2, glow: false, a: fa });
      ctx.restore();
    }
    // E · the co-op ring, an idea (dotted)
    const ra = smooth(span(t, A.full - .2, A.full + .6));
    if (ra > 0) {
      const [rx, ry, rr] = RING, slide = expoOut(span(t, A.what - .1, A.what + .7));
      const solid = 1 - smooth(span(t, A.idea - .3, A.idea + .3));
      if (solid > 0) B.shares(ctx, rx, ry, rr, t, { n: 13, u: 1, a: ra * solid, dust: 0 });
      B.shares(ctx, rx, ry, rr, t, { n: 13, u: ra, dotted: true, a: 1 - solid * .99 });
      ctx.save(); ctx.translate(rx, ry + rr + 90); ctx.scale(1 / v.s, 1 / v.s);
      const ta = 1 - smooth(span(t, A.what - .2, A.what + .2));
      B.write(ctx, 'an idea', 0, 0, span(t, A.idea - .1, A.idea + .5), { serif: true, size: 84, a: ta });
      B.write(ctx, 'not yet tested', 0, 52, span(t, A.tested - .3, A.tested + .3), { size: B.SZ.small, col: P.halo2, glow: false, a: ta });
      ctx.restore();
      // F · one share slides out and becomes the counter of what a lesson is worth
      if (slide > 0) {
        const q = -Math.PI / 2 + 3.5 / 13 * 6.283, sx = lerp(rx + Math.cos(q) * rr * .6, CTR[0] - 40, slide), sy = lerp(ry + Math.sin(q) * rr * .6, CTR[1] - 30, slide);
        const wedge = new Path2D(), sr = lerp(rr, 70, slide), a0 = q - Math.PI / 13 * (1 - slide * .4), a1 = q + Math.PI / 13 * (1 - slide * .4);
        wedge.moveTo(sx - Math.cos(q) * sr * .6, sy - Math.sin(q) * sr * .6); wedge.arc(sx - Math.cos(q) * sr * .6, sy - Math.sin(q) * sr * .6, sr, a0, a1); wedge.closePath();
        E.lightShape(ctx, wedge, t, { lit: 1, dust: 0, a: 1 - smooth(span(t, A.worth - .3, A.worth + .1)) });
        counterF(ctx, t, v);
      }
    }
    ctx.restore();
  }
  // the price counter with empty digits: it searches, never lands
  function counterF(ctx, t, v) {
    const k = smooth(span(t, A.worth - .45, A.worth + .1)); if (k <= 0) return;
    const x = CTR[0] - 110, y = CTR[1] + 40;
    ctx.save(); ctx.translate(x, y); ctx.scale(1 / v.s * 1.15, 1 / v.s * 1.15);
    E.glowText(ctx, '$', -10, 0, { size: 132, serif: true, align: 'right', a: k });
    for (let i = 0; i < 3; i++) {
      const dx = 20 + i * 86;
      ctx.save(); ctx.globalAlpha = k; ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(dx, 14); ctx.lineTo(dx + 64, 14); ctx.stroke(); ctx.restore();
      // a digit that keeps rolling (never settles): soft, low contrast
      const roll = (t * (2.2 + i * .7) + i * .37) % 1, dg = Math.floor(t * (2.2 + i * .7) + i * 3) % 10, sa = k * .32 * smooth(span(t, A.who - .3, A.who + .2)) * Math.sin(Math.PI * roll);
      if (sa > .01) E.glowText(ctx, String(dg), dx + 32, -10 - (roll - .5) * 40, { size: 110, serif: true, align: 'center', a: sa, glow: false });
    }
    B.write(ctx, 'what is one lesson worth?', 110, -170, span(t, A.what - .2, A.what + .5), { size: B.SZ.label / 1.15 });
    ctx.restore();
  }
  // ---------- G: the hall votes ----------
  function clock(ctx, t, a = 1) {   // a plain wall clock: pale ring, two hands; it hangs left above the window
    const [x, y, r] = CLOCK;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = mixHex(P.ind0, P.blue1, .3); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
    ctx.strokeStyle = mixHex(P.cream, P.blue1, .35); ctx.lineWidth = 5; ctx.stroke();
    for (let i = 0; i < 12; i++) { const q = i / 12 * 6.283; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + Math.cos(q) * r * .78, y + Math.sin(q) * r * .78); ctx.lineTo(x + Math.cos(q) * r * .9, y + Math.sin(q) * r * .9); ctx.stroke(); }
    const hm = -Math.PI / 2 + (7.1 + t / 3600) / 12 * 6.283, mm = -Math.PI / 2 + (.1 + t / 60 % 1) * 6.283 * 0 + -Math.PI / 2 * 0 + (t * .02) % 6.283;
    ctx.lineCap = 'round'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(hm) * r * .5, y + Math.sin(hm) * r * .5); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(mm - Math.PI / 2) * r * .74, y + Math.sin(mm - Math.PI / 2) * r * .74); ctx.stroke();
    ctx.restore();
  }
  function hallG(ctx, t, c) {
    B.hallScene(ctx, c, t, {
      lift: 0, rob: 0, cup: false, look: .35, duArm: [lerp(.18, 2.85, handUp(t, 4)), lerp(.1, 3.0, handUp(t, 4))],
      behind: (x) => {
        clock(x, t);
        TRAINERS.forEach(([px, py, ph], i) => { const k = handUp(t, i); E.person(x, px, py, ph, { dir: 1, light: 1, rim: rgba(P.halo1, .8), headset: true, armR: [lerp(.15, 2.85, k), lerp(.08, 3.0, k)], look: .3 * k }); });
      },
    });
  }
  // ---------- H ★: the day of light (8 h → 6 h, same income) ----------
  function dayH(ctx, t, ix, iy, ir) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const open = expoOut(span(t, T_IH + .1, T_IHF + .25)), close = expoIn(span(t, T_IHB, T_IHBF));
    const k = open * (1 - close), X = lerp(ix ?? 720, 720, k), Y = lerp(iy ?? 500, 500, k), R = lerp(ir ?? 200, 210, k);
    // the dial: 24 hours as a quiet ring of ticks; the work arc in warm light from 9:00
    ctx.save(); ctx.strokeStyle = rgba(P.blue1, .7); ctx.lineWidth = 2;
    for (let i = 0; i < 24; i++) { const q = -Math.PI / 2 + i / 24 * 6.283, l = i % 6 ? .05 : .1; ctx.beginPath(); ctx.moveTo(X + Math.cos(q) * R * (1.18), Y + Math.sin(q) * R * 1.18); ctx.lineTo(X + Math.cos(q) * R * (1.18 + l), Y + Math.sin(q) * R * (1.18 + l)); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(X, Y, R, 0, 6.29); ctx.stroke(); ctx.restore();
    const hrs = lerp(8, 6, quart(span(t, A.time - .25, A.time + .9))), a0 = -Math.PI / 2 + 9 / 24 * 6.283, a1 = a0 + hrs / 24 * 6.283 * k;
    if (a1 > a0 + .01) { const arc = new Path2D(); arc.arc(X, Y, R, a0, a1); E.lightShape(ctx, arc.stroke({ width: R * .26, cap: 0, join: 1 }), t, { lit: 1, seed: 33, dust: 1200 }); }
    // the free hours given back: a cool ghost of the lost arc
    const gone = 8 - hrs; if (gone > .05) { const g = new Path2D(); g.arc(X, Y, R, a1, a0 + 8 / 24 * 6.283); ctx.save(); ctx.setLineDash([3, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .7); ctx.lineWidth = 4; ctx.stroke(g); ctx.restore(); }
    const ta = k;
    E.glowText(ctx, `${Math.round(hrs)} h`, X, Y + 40, { size: 132, serif: true, align: 'center', a: ta * smooth(span(t, T_IHF - .2, T_IHF + .3)) });
    E.glowText(ctx, 'WORKDAY', X, Y + 92, { size: B.SZ.src + 2, align: 'center', glow: false, col: P.halo2, spacing: .2, a: ta * smooth(span(t, T_IHF, T_IHF + .4)) });
    // income: one bar for each day length, the same height (grows out of the dial's base line)
    const bu = span(t, A.shorter - .1, A.income + .1), bx = 1200, by = 760, bw = 120, bh = 300;
    // noon: a small sun under the dial (the day reads as a day)
    B.sun(ctx, X, Y + R * 1.5, 18 * k, t, { rays: false, dust: 0 });
    // paid in money: a coin waits beside the dial; when the bars rise it sinks into their base line
    const ca = smooth(span(t, A.money - .35, A.money + .15)) * (1 - smooth(span(bu, .02, .3))) * k;
    if (ca > 0) E.icon(ctx, 'coin', bx + bw + 30, lerp(by - bh * .5, by, smooth(span(bu, 0, .3))), 120 * (.7 + .3 * ca), t, { lit: 1, a: ca, dust: 0, seed: 47 });
    if (bu > 0) {
      trail(ctx, [[bx - 40, by, 2], [bx + 2 * bw + 100, by, 2]], expoOut(span(bu, 0, .3)) * k, { spark: false, a: .8 });
      for (let i = 0; i < 2; i++) {
        const kk = expoOut(span(bu, .1 + i * .35, .55 + i * .35)) * k; if (kk <= 0) continue;
        const p = new Path2D(); p.roundRect(bx + i * (bw + 60), by - bh * kk, bw, bh * kk, [24, 24, 0, 0]); E.lightShape(ctx, p, t, { lit: 1, seed: 40 + i, dust: 0, cy: -.4 });
        E.glowText(ctx, i ? '6 h' : '8 h', bx + i * (bw + 60) + bw / 2, by + 52, { size: B.SZ.small, align: 'center', glow: false, col: P.halo2, a: kk });
      }
      B.write(ctx, 'same income', bx + bw + 30, by - bh - 40, span(t, A.income - .3, A.income + .3), { size: B.SZ.label, a: k });
    }
    B.write(ctx, 'shorter days', X, Y - R * 1.3 - 40, span(t, A.shorter - .2, A.shorter + .4), { serif: true, size: 76, a: k });
    ctx.restore();
  }
  const quart = (x) => E.quartIO(x);
  // ---------- I: you hang up the headset and walk into the light ----------
  function hallI(ctx, t, c) {
    const hang = smooth(span(t, A.thats + .3, A.thats + 1.2)), wk = walkU(t);
    const dx = lerp(0, 760, wk), walking = wk > 0 && wk < 1;
    B.hallScene(ctx, c, t, {
      lift: 0, rob: 0, cup: false, du: false,
      behind: (x) => { clock(x, t); TRAINERS.forEach(([px, py, ph]) => E.person(x, px, py, ph, { dir: 1, light: 1, rim: rgba(P.halo1, .8), headset: true })); },
      extra: (x) => {
        const [hx, hy, hh] = B.HALL.du;
        // the hook on the wall + the headset hanging on it (after she hung it)
        const hook = [hx + 70, hy - hh * 1.02];
        x.fillStyle = mixHex(P.ind0, P.blue1, .55); x.beginPath(); x.roundRect(hook[0] - 6, hook[1] - 10, 12, 30, 4); x.fill();
        if (hang > .6) {   // the headset hangs on the peg: band + two ear cups
          x.strokeStyle = mixHex(P.cream, P.blue1, .2); x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.arc(hook[0], hook[1] + 34, 26, Math.PI * 1.05, Math.PI * 1.95); x.stroke();
          x.fillStyle = mixHex(P.cream, P.blue1, .3); for (const s of [-1, 1]) { x.beginPath(); x.roundRect(hook[0] + s * 26 - 7, hook[1] + 30, 14, 24, 5); x.fill(); }
        }
        E.du(x, hx + dx, hy - wk * 30, hh * (1 - wk * .12), { dir: 1, light: 1, back: .2 + .6 * wk, headset: hang < .6, walk: walking || wk >= 1 ? (t - A.take) * 5.5 : undefined, armR: hang < 1 && wk === 0 ? [lerp(.18, 2.6, Math.sin(Math.PI * hang)), lerp(.1, 2.9, Math.sin(Math.PI * hang))] : undefined, look: .2 });
      },
    });
  }
  // ---------- J: the vineyard ----------
  function vineyard(ctx, t, c) {
    card(ctx, c, 40000, () => B.morningSky(ctx, 1, 640, { t }));
    card(ctx, c, VSUN.Z, () => {
      B.sun(ctx, VSUN.u, VSUN.v, VSUN.r, t, { rays: true, dust: 2500 });
      B.hill(ctx, [[-400, 640], [400, 600], [1100, 630], [1800, 596], [2400, 620]], { c0: mixHex(B.M.leaf0, P.ind0, .3), c1: P.ind0, rim: rgba(P.halo1, .5) });
    });
    card(ctx, c, 4000, () => {
      B.hill(ctx, [[-400, 700], [500, 660], [1200, 690], [2400, 650]], { c0: mixHex(B.M.leaf0, P.ind1, .2), c1: P.night1, rim: rgba(B.M.leafLit, .55) });
    });
    card(ctx, c, F0, () => {
      B.hill(ctx, [[-300, 760], [600, 730], [1300, 748], [2300, 720]], { c0: mixHex(B.M.leaf0, P.ind1, .3), c1: P.night0, rim: rgba(B.M.leafLit, .7), rimW: 3 });
      // rows converge toward the sun: lines of light down the slope
      for (let i = -9; i <= 9; i++) {
        const x0 = VSUN.u + i * 70, x1 = VSUN.u + i * 330, y0 = 752, y1 = 1180;
        const g = lin(ctx, 0, y0, 0, y1, [[0, rgba(P.halo0, .65)], [.5, rgba(P.halo1, .25)], [1, rgba(P.halo1, 0)]]);
        ctx.strokeStyle = g; ctx.lineWidth = 2 + Math.abs(i) * .25; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
        // vines: small dark knots along the row
        ctx.fillStyle = mixHex(B.M.leaf0, P.night0, .4);
        for (let j = 1; j < 7; j++) { const f = (j / 7) ** 1.6, x = lerp(x0, x1, f), y = lerp(y0, y1, f), s = 5 + f * 26; ctx.beginPath(); ctx.ellipse(x, y - s * .5, s * .9, s * .7, 0, 0, 6.29); ctx.fill(); }
      }
      E.robot(ctx, VBOT[0], VBOT[1], VBOT[2], { dir: -1, light: -1, rim: P.halo0, body: P.night1, hand: 'gripper', walk: (t - A.planet) * 3.2 });
      // its owners: three growers' hands left their warm prints on its frame (as in c07)
      for (let i = 0; i < 3; i++) halo(ctx, VBOT[0] - 18 + i * 16, VBOT[1] - VBOT[2] * .62 + (i % 2) * 14, 14, .7, P.halo1, P.core0);
    });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    B.write(ctx, 'the vineyard', 150, 200, span(t, A.vineyard - .2, A.vineyard + .4), { size: 52, align: 'left', spacing: .22, a: 1 - smooth(span(t, T_IK - .2, T_IK + .2)) });
    ctx.restore();
  }
  // ---------- K: fewer robots, same work ----------
  const SK = streetTimes(T);
  function streetK(ctx, t) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); drawStreet(ctx, t, SK); ctx.restore(); }
  return [{ t: R.a, draw, print: { editorial: true }, sound: [
    { f: 'whoosh_airy', t: A.t0 + .3, v: .12 }, { f: 'shimmer_rings', t: A.workers - .5, v: .15 }, { f: 'glass_hum', t: A.time - .3, v: .2 }, { f: 'whoosh_up', t: A.planet - .3, v: .15 },
  ] }];
};

// the K timings from the words (c10 rebuilds the same street from them)
export const STREET_V = 300;   // the shared robot's walking speed (design px / s)
export const STREET_D = .75;   // from the c09/c10 boundary it slows to a stop over this time (c10: the repair)
const X0 = STREET.xs[0] + 88;
const runX = (S, u) => (u <= 0 ? 0 : u < .8 ? STREET_V * u * u / 1.6 : STREET_V * (u - .4));
export const streetRobotX = (t, S) => {
  if (t <= S.stop) return X0 + runX(S, t - (S.fewer + .5));
  const tau = Math.min(t - S.stop, STREET_D);
  return X0 + runX(S, S.stop - (S.fewer + .5)) + STREET_V * (tau - tau * tau / (2 * STREET_D));
};
// the stride follows the distance walked (no sliding feet); the offset is chosen so the stop lands with the legs together
export const streetPhase = (t, S) => (streetRobotX(t, S) - X0) * 3 / STREET_V + S.phi;
export const streetRobotY = (t, S) => { const rx = streetRobotX(t, S); return STREET.loopY + Math.sin(rx * .02) * 3 - (STREET.loopY - STREET.y - 62) * (1 - smooth(span(t, S.fewer + .5, S.fewer + 1.2))); };
// the K timings from the words (c10 rebuilds the same street from them)
export const streetTimes = (T) => {
  const w = B.wordAt(T), ik = w('when', 499.36) - .15;
  const S = { open0: ik, open1: ik + .85, robot: w('robot', 500.72), share: w('share', 501.68), nobody: w('nobody', 502.56), corner: w('corner', 504.28), fewer: w('fewer', 505.12), same: w('same', 506.32), stop: w('built', 507.52) };
  S.textOut = S.stop - .05; S.phi = 0;
  const travel = (streetRobotX(S.stop + STREET_D, S) - X0) * 3 / STREET_V;
  S.phi = ((-travel % Math.PI) + Math.PI) % Math.PI;
  return S;
};
// ---------- the street of K (c10 carries it on): houses of light, idle robots fold into one shared robot ----------
// S.dim(t) 0..1 (c10: the street steps back while the camera pushes into the robot), S.robA(t) robot alpha
export function drawStreet(ctx, t, S) {
  const hs = STREET.xs, open = expoOut(span(t, S.open0, S.open1 + .3)), dim = S.dim ? S.dim(t) : 0;
  trail(ctx, [[hs[0] - 140, STREET.y + 66, 2], [hs[hs.length - 1] + 400, STREET.y + 66, 2]], open, { spark: false, a: .5 * (1 - dim) });
  // share it: a warm thread runs along the roofs and ties the houses together
  const sh = expoOut(span(t, S.share - .2, S.share + .9));
  if (sh > 0 && dim < 1) trail(ctx, hs.map((x) => [x, STREET.y - 96, 3]), sh, { w: 3, a: .8 * (1 - dim) });
  const fold = smooth(span(t, S.fewer - .2, S.fewer + .6)), rx = streetRobotX(t, S), one = smooth(span(t, S.fewer + .25, S.fewer + .6));
  hs.forEach((x, i) => {
    const g = expoOut(span(t, S.open0 + .2 + i * .07, S.open1 + .3 + i * .07)); if (g <= 0) return;
    const done = one > 0 ? smooth(span(rx, x - 30, x + 70)) : 0;   // a house lights in the frame the robot reaches it
    if (dim < 1) E.icon(ctx, 'house', x, STREET.y, 150 * g, t, { lit: done * (1 - dim), dust: 0, seed: 80 + i, a: g * (1 - .85 * dim) });
    // one robot per house, idle in its corner (dotted = bought, but standing); on "fewer" they fold to the first house
    const cr = smooth(span(t, S.robot - .1 + i * .08, S.robot + .5 + i * .08)) * (1 - smooth(span(fold, .7, 1))) * lerp(1, .55, smooth(span(t, S.corner - .5, S.corner + .2)));
    const fx = lerp(x + 88, hs[0] + 88, quartIO(clamp(fold * 1.05 - i * .02)));
    if (cr > 0) dottedRobot(ctx, fx, STREET.y + 62, 112, cr);
  });
  const ra = S.robA ? S.robA(t) : 1;
  if (one > 0 && ra > 0) {
    const y = streetRobotY(t, S);
    halo(ctx, rx, y - 95, 110 * one, .7 * one * ra * (1 - dim * .6), P.halo1, P.core1);
    E.robot(ctx, rx, y, 170 * (.85 + .15 * one), { dir: 1, light: 1, rim: P.halo0, body: P.night1, walk: streetPhase(t, S), hand: 'gripper', alpha: ra });
  }
  const qa = 1 - smooth(span(t, S.fewer - .6, S.fewer - .3));
  if (qa > 0) B.write(ctx, 'one robot each?', 960, 300, span(t, S.nobody - .2, S.nobody + .4), { serif: true, size: 72, a: qa });
  const ta = 1 - smooth(span(t, S.textOut, S.textOut + .45));
  if (ta > 0) {
    B.write(ctx, 'fewer robots', 960, 300, span(t, S.fewer - .2, S.fewer + .4), { serif: true, size: 96, a: ta });
    B.write(ctx, 'same work', 960, 370, span(t, S.same - .2, S.same + .4), { size: B.SZ.label, a: ta, col: P.halo2 });
  }
}
export function dottedRobot(ctx, x, y, h, a) {
  ctx.save(); ctx.globalAlpha = a;
  const p = new Path2D(); p.addPath(E.icon.length ? robotOutline() : robotOutline(), { a: h, b: 0, c: 0, d: h, e: x, f: y });
  ctx.fillStyle = rgba(B.M.cyan, .1); ctx.fill(p);
  ctx.setLineDash([3, 7]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(B.M.cyan, 1); ctx.lineWidth = 3.2; ctx.shadowColor = rgba(B.M.cyan, .6); ctx.shadowBlur = 8; ctx.stroke(p);
  ctx.restore();
}
let ROB = null;
export function robotOutline() { if (ROB) return ROB; const m = B.measure((c) => { const p = new Path2D(); p.ellipse(0, -.93, .08, .072, 0, 0, 6.29); const b = new Path2D(); b.roundRect(-.16, -.84, .32, .33, .06); const l = new Path2D(); l.roundRect(-.11, -.5, .09, .5, .03); const r = new Path2D(); r.roundRect(.02, -.5, .09, .5, .03); return p.op(b, PathOp.Union).op(l, PathOp.Union).op(r, PathOp.Union); }); ROB = m; return ROB; }

