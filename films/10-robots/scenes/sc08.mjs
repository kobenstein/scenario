// c08 · The hall as a co-op / Karya (03b rest, 03c start) · 409.00–454.14 · morning · ★ 8.04 (the thread runs BACK to the hand)
// Builder B3. Look: Editorial-Nacht (lib/f10_editorial.mjs) + B3 pieces (lib/f10_c08_b3.mjs). Explainers ≈ 63 % (light on night).
//
// | beat | time | anchor word | picture (one idea) | hero light | moves (≤2) | transition → carrier · position · direction |
// |---|---|---|---|---|---|---|
// | A  3D   | 409.00–414.45 | again · trainer · cup | out of the light (seam from c07: flood = 1 at 409.00) into the hall (K3): you with headset + cup, the robot in the window | hall window | camera out of the light · your look | push into your lifted cup · cup · left centre · in |
// | B  EXPL | 414.45–419.95 | share 415.80 · member · vote 418.36 | T2: the cup rim becomes a ring of 12 shares of light; one glows (hers). `1 member · 1 vote`, 12 raised hands around | the ring | ring grows · hands | ring sinks into the ROBOT's cup · centre → right · down |
// | C ★ 3D  | 419.95–424.40 | works 420.04 · taught 423.48 | the robot lifts the cup safely; a fine warm thread runs BACK from its cup into your hand, beads of light flow home | window + thread | robot lifts · thread back | iris opens from the warm glow in your hand · you stay · left |
// | D  EXPL | 424.40–432.30 | co-op 425.56 · away 428.16 · make 430.68 | you, small, under a big ring of shares (the co-op as the sun). `robot co-op`. A 13th share joins, nobody's share shrinks; a trace from your raised hand lights it | the ring | share joins · your trace | pull back: the ring and you shrink onto a curved horizon |
// | E  EXPL | 432.30–436.62 | dream 432.94 · exist 435.10 | the globe's rim; two threads leave the ring: west `BASQUE COUNTRY`, east `INDIA` | threads | threads · pan east | the east point becomes the sun of India · right · in |
// | F  3D   | 436.62–443.82 | India 438.86 · record 441.10 | a village at sunrise, a big tree against the sun; three people speak into phones; cold data points rise | sun | world opens from the point · dots rise | iris opens from the cluster of data · top centre · up |
// | G  EXPL | 443.82–450.86 | wage 446.98 · resold 449.66 | flow VOICE → DATA → SOLD; a warm coin drops into her hand `SEVERAL × MINIMUM WAGE` (self-reported); from SOLD a hair-thin thread back | the flow | flow · coin / thread | — |
// | H  EXPL | 450.86–454.14 | small 452.86 | the flow folds away; in her hand only a tiny glint; pull back: she becomes the INDIA point on the globe (c09 follows the west thread) | glint → map | fold · pull back | plan sequence into c09 · map · centre · out |
import * as B from '../lib/f10_c08_b3.mjs';
const { E, P, M, W, H, rgba, mixHex, lin, rad, clamp, lerp, span, smooth, expoOut, expoIn, sineIO, halo, trail, catmull } = B;
const { card, cam3, aim, camAt, camDrift, project, F0 } = E;

// ---------- the map (shared with c09: the curved horizon of the globe, the co-op ring, west/east points) ----------
export const MAP = {
  ring: [960, 320, 200], du: [600, 868, 200],            // the co-op over you (beat D), in map/design units
  limb: { cx: 960, cy: 845 + 6000, r: 6000 },          // the globe's rim, top at (960, 845)
  east: 2010, west: -90,                                // x of INDIA / BASQUE COUNTRY on the rim
};
export const limbY = (x) => MAP.limb.cy - Math.sqrt(MAP.limb.r ** 2 - (x - MAP.limb.cx) ** 2);
export const EAST = [MAP.east, limbY(MAP.east)], WEST = [MAP.west, limbY(MAP.west)];
export const H_END = { s: .6, x: 1250, y: 640 };   // where the pull-back out of India ends (c09 starts its pan west from here)
// the globe rim + stars of light (towns) along it; a = visibility
export function drawLimb(ctx, t, v, a = 1) {
  if (a <= 0) return;
  const { cx, cy, r } = MAP.limb;
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rad(ctx, cx, cy, r, [[0, P.night0], [.97, rgba(P.night1, 1)], [1, rgba(P.ind1, 1)]]);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // rim of light (thin, warm toward the top, cooler down the sides)
  const pts = []; for (let i = 0; i <= 120; i++) { const q = -Math.PI / 2 + (i / 120 - .5) * 1.5; pts.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r, 2.2 / Math.max(.3, v.s)]); }
  trail(ctx, pts, 1, { a: .55 * a, spark: false, w: 2.2 / Math.max(.3, v.s) });
  // towns: quiet points of light on the rim
  const rr = E.prng(7);
  for (let i = 0; i < 70; i++) {
    const q = -Math.PI / 2 + (rr() - .5) * 1.4, d = 8 + rr() * 90, x = cx + Math.cos(q) * (r - d), y = cy + Math.sin(q) * (r - d), s = (1.6 + rr() * 1.8) / Math.max(.25, v.s);
    ctx.globalAlpha = a * (.35 + .35 * Math.sin(t * (.6 + rr()) + i)); ctx.fillStyle = P.halo2; ctx.fillRect(x - s / 2, y - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
}
// a point of the map (west / east): a small light form + its name written above
export function mapPoint(ctx, t, p, u, label, v, o = {}) {
  if (u <= 0) return;
  const s = 1 / v.s, k = expoOut(u), pp = new Path2D(); pp.arc(p[0], p[1], 13 * s * k, 0, Math.PI * 2);
  E.lightShape(ctx, pp, t, { lit: 1, dust: 0, seed: 9 });
  halo(ctx, p[0], p[1], 70 * s * k, .5 * k, P.halo1, P.core0);
  if (label) { ctx.save(); ctx.translate(p[0], p[1] - 46 * s); ctx.scale(s, s); B.write(ctx, label, 0, 0, span(u, .35, 1), { size: B.SZ.label, a: o.la ?? 1 }); ctx.restore(); }
}

export default async (T, R) => {
  E.prepareEditorial();
  const w = B.wordAt(T);
  const A = {
    t0: R.a, again: w('again', 410.44), trainer: w('trainer', 411.56), cup: w('cup', 412.6), but: w('but', 413.32), share: w('share', 415.8),
    member: w('member', 417.48), one2: w('one', 418.12), vote: w('vote', 418.36), and: w('and', 419.16), works: w('works', 420.04), little: w('little', 420.84),
    back: w('back', 422.44), taught: w('taught', 423.48), call: w('call', 424.44), coop: w('co-op', 425.56), nobody: w('nobody', 426.52), away: w('away', 428.16),
    you: w('you', 428.84), make: w('make', 430.68), sounds: w('sounds', 432.3), dream: w('dream', 432.94), parts: w('parts', 433.9), exist: w('exist', 435.1),
    paying: w('paying', 436.62), india: w('india', 438.86), record: w('record', 441.1), by: w('by', 443.82), wage: w('wage', 446.98), promises: w('promises', 447.82),
    resold: w('resold', 449.66), sofar: w('so', 450.86), small: w('small', 452.86), end: R.b,
  };

  // ================= A · the hall (K3) =================
  const WINC = [B.HALL.win.x + B.HALL.win.w / 2, 470];
  const lift = (t) => smooth(span(t, A.but + .05, A.but + 1.05));
  const duHand = (lf) => B.measure((x) => B.hallScene(x, cam3(), 0, { lift: lf, rob: 0 })).du;   // hand (design coords)
  const CUP = duHand(1), cupTop = [CUP[0], CUP[1] - .06 * 250];      // centre of the cup rim when lifted
  const T_IRIS1 = A.but + 1.1, T_IRIS1F = T_IRIS1 + .8;             // the cup → ring iris opens (anticipation before it: rim glow)
  const KA = [
    [A.t0, aim(F0, WINC[0], WINC[1], 52)],
    [A.t0 + 2.3, cam3({ x: -30, y: 10, z: 70 }), 's'],               // out of the light (the flood thins over ~1 s), lands in a breathing hold
    [A.but + .1, cam3({ x: -70, y: 16, z: 190 })],                   // slow push while "same trainer, same cup"
    [T_IRIS1F, aim(F0, cupTop[0], cupTop[1], 3.4, W * .5, H * .52), 'q'],   // into the lifted cup
  ];
  // ================= C · the wow (robot lifts, the thread runs back) =================
  const T_BACK0 = A.vote + .95, T_BACK1 = T_BACK0 + 1.0;               // ring sinks into the robot's cup
  const KC = [[T_BACK0 - .1, cam3({ x: 120, y: -30, z: 330 })], [A.call + .2, cam3({ x: 30, y: -10, z: 120 })]];
  const robLift = (t) => smooth(span(t, T_BACK1 - .05, A.works + .75));
  const camC = (t) => camDrift(camAt(t, KC), t, .6, 3);
  const robHand = (t) => B.measure((x) => B.hallScene(x, cam3(), 0, { lift: 0, rob: robLift(t), duArm: duArmC(t) })).rob;
  // your arm in the wow: the cup set down, the hand opens forward to receive (from "a little of what it earns")
  const duArmC = (t) => { const k = smooth(span(t, A.little - .2, A.back + .2)); return [lerp(.25, 1.05, k), lerp(.15, 1.75, k)]; };
  const threadPts = (t) => {   // from the robot's cup back to your hand: a low warm arc
    const r = robHand(t), d = B.measure((x) => B.hallScene(x, cam3(), 0, { lift: 0, rob: robLift(t), duArm: duArmC(t), cup: false })).du;
    return B.arcPts([r[0] - 8, r[1] - 22], [d[0] + 6, d[1] - 4], 170, 48, 2.6);
  };
  const thrU = (t) => expoOut(span(t, A.little, A.taught + .1)) * .999 + (t > A.taught + .1 ? .001 : 0);

  // ================= D · the co-op ring over you (map units) =================
  const T_IRIS3 = A.call - .15, T_IRIS3F = T_IRIS3 + .85;
  const duScreenAt = (t) => {   // your feet + scale on screen in the wow camera (for the carry-over into the field)
    const c = camC(t), f = project(c, F0, B.HALL.du[0], B.HALL.du[1]); return { x: f[0], y: f[1], s: f[2] * B.HALL.du[2] / MAP.du[2] };
  };
  const vTrack = (t) => { const d = duScreenAt(t); return B.viewPut(MAP.du[0], MAP.du[1], d.x, d.y, d.s); };
  const V3 = vTrack(T_IRIS3F);
  const KD = [[T_IRIS3F, V3], [A.coop + .6, { s: 1, x: 960, y: 520 }, 's', MAP.du], [A.sounds + .2, { s: 1.04, x: 945, y: 515 }],
    [A.parts + .4, { s: .62, x: 960, y: 640 }], [A.exist + .2, { s: .6, x: 975, y: 650 }],
    [A.paying + .25, { s: 2.6, x: EAST[0], y: EAST[1] }, 's', EAST]];
  const vD = (t) => (t < T_IRIS3F ? vTrack(t) : B.vDrift(B.viewAt(t, KD), t, .5, 7));
  const shareN = (t) => 12 + smooth(span(t, A.nobody + .1, A.nobody + 1.1));
  const duArmD = (t) => {   // from the receiving hand (as in the hall) to rest, then reaching up for your share
    const k1 = smooth(span(t, T_IRIS3F + .3, T_IRIS3F + 1.5)), k2 = smooth(span(t, A.you - .1, A.you + .8));
    return [lerp(lerp(1.05, .35, k1), 2.5, k2), lerp(lerp(1.75, .3, k1), 2.62, k2)];
  };

  // ================= F · India =================
  const T_WORLD = A.paying - .25, T_WORLDF = A.paying + .75;          // the world opens from the east point (= the sun)
  const SUN = { Z: 9000, u: 1430, v: 600, r: 170 };
  const EW = B.viewToScreen(B.viewAt(T_WORLD, KD), EAST[0], EAST[1]);
  const KF = [[T_WORLD, cam3({ x: 90, y: 10, z: -90 })], [T_WORLDF + .6, cam3({ x: 30, y: 0, z: 40 }), 's'], [A.by, cam3({ x: -40, y: -20, z: 120 })]];
  const camF = (t) => camDrift(camAt(t, KF, SUN.Z), t, .5, 11);
  const PEOPLE = [[600, 868, 262, 1, 'R'], [800, 880, 250, -1, 'R'], [985, 864, 272, -1, 'L']];   // x, feet, h, dir, phone hand
  const HER = 1;   // the woman in the middle receives the wage
  const phoneArm = [.55, 2.75];
  const dotsN = 36, DOT = (() => { const r = E.prng(4), o = []; for (let i = 0; i < dotsN; i++) o.push([i % 3, r(), r(), r()]); return o; })();
  const CLUSTER = [960, 250];
  // ================= G · the Karya flow (screen coords, inside the iris) =================
  const T_IRIS5 = A.by - .35, T_IRIS5F = T_IRIS5 + .85;
  const NODES = { voice: [470, 330], data: [960, 280], sold: [1450, 330] };

  const draw = (ctx, t) => {
    // ---------- A + B + C: the hall ----------
    if (t < T_IRIS3F) {
      const inA = t < T_BACK0 - .1;
      const c = inA ? camDrift(camAt(t, KA), t, .6, 1) : camC(t);
      const st = inA ? { lift: lift(t), look: lerp(.05, .55, smooth(span(t, A.trainer - .3, A.trainer + .7))) - .4 * smooth(span(t, A.cup - .3, A.cup + .5)) }
        : { lift: 0, rob: robLift(t), duArm: duArmC(t), cup: false, look: .15, robCup: false, extra: (x, hands) => { robotCup(x, hands.rob); wowThread(x, t); } };
      const irisOpen = inA && t > T_IRIS1 ? 1 : 0;
      const hands = B.hallScene(ctx, c, t, st);
      // anticipation: the rim of your cup glows before it becomes the ring
      if (inA && t > T_IRIS1 - .45) {
        const [sx, sy, k] = project(c, F0, cupTop[0], cupTop[1]), g = smooth(span(t, T_IRIS1 - .45, T_IRIS1));
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.strokeStyle = rgba(P.core0, g); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(sx, sy, .036 * 250 * k, .012 * 250 * k, 0, 0, 6.29); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); halo(ctx, sx, sy, 60 * k * g, .5 * g, P.halo1, P.core0); ctx.restore();
      }
      if (irisOpen || (t >= T_BACK0 - .1 && t < T_BACK1)) {
        // B: the ring of shares, inside an iris that grows from the cup rim (and closes into the robot's cup)
        let ix, iy, ir;
        if (inA) { const [sx, sy, k] = project(c, F0, cupTop[0], cupTop[1]), u = span(t, T_IRIS1, T_IRIS1F); ix = sx; iy = sy; ir = B.irisR(u, .036 * 250 * k, sx, sy); }
        else { const rh = robHand(t), [sx, sy, k] = project(c, F0, rh[0], rh[1] - .045 * 372), u = 1 - span(t, T_BACK0, T_BACK1); ix = sx; iy = sy; ir = B.irisR(u, .03 * 372 * k, sx, sy); }
        B.iris(ctx, ix, iy, ir, () => ringB(ctx, t, ix, iy), { t });
      }
      if (t >= T_IRIS3) {   // D begins: iris out of the warm glow in your hand; you stay
        const d = threadPts(t), hp = d[d.length - 1], [sx, sy] = project(c, F0, hp[0], hp[1]), u = span(t, T_IRIS3, T_IRIS3F);
        B.iris(ctx, sx, sy, B.irisR(u, 26, sx, sy), () => mapD(ctx, t), { t });
      }
      return;
    }
    // ---------- D + E: the co-op over you, the globe ----------
    if (t < T_WORLDF) {
      if (t < T_WORLD) { B.fieldFill(ctx, { t }); mapD(ctx, t); return; }
      const v = vD(t), [ex, ey] = B.viewToScreen(v, EAST[0], EAST[1]), u = span(t, T_WORLD, T_WORLDF);
      const c = camF(t), [qx, qy] = project(c, SUN.Z, SUN.u, SUN.v), m = smooth(u), sx = lerp(ex, qx, m), sy = lerp(ey, qy, m);   // the iris centre glides from the east point to the sun
      B.irisWorld(ctx, sx, sy, B.irisR(u, 8, sx, sy), () => india(ctx, t, c), () => mapD(ctx, t), { t });
      return;
    }
    // ---------- F: India ----------
    const c = camF(t);
    if (t < T_IRIS5) { india(ctx, t, c); return; }
    // ---------- G + H: the flow, then back to the map ----------
    const u = span(t, T_IRIS5, T_IRIS5F);
    if (t < T_ZOOM) { india(ctx, t, c); const [qx, qy] = project(c, F0, CLUSTER[0], CLUSTER[1]); B.iris(ctx, qx, qy, B.irisR(u, 40, qx, qy), () => flowG(ctx, t, c), { t }); return; }
    B.fieldFill(ctx, { t }); mapH(ctx, t);
  };

  // ---------- B: the ring of 12 shares grown out of the cup ----------
  function ringB(ctx, t, ix, iy) {
    const grow = expoOut(span(t, T_IRIS1 + .05, T_IRIS1F + .3)), back = span(t, T_BACK0, T_BACK1);
    const R0 = 230, cx = lerp(ix, 960, grow), cy = lerp(iy, 430, grow), r = lerp(.036 * 250 * 3.4, R0, grow);
    const bx = lerp(cx, ix, expoIn(back)), by = lerp(cy, iy, expoIn(back)), br = lerp(r, 10, expoIn(back) ** .7);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const fill = span(t, T_IRIS1 + .25, A.share - .1);
    B.shares(ctx, bx, by, br, t, { n: 12, u: Math.max(.02, fill), hi: 7, hk: smooth(span(t, A.share - .05, A.share + .45)), palms: span(t, A.vote - .25, A.vote + .75) * (1 - back), a: 1 });
    const ta = 1 - smooth(span(t, T_BACK0 - .05, T_BACK0 + .3));
    if (ta > 0) {
      B.write(ctx, '1 member · 1 vote', 960, 830, span(t, A.member - .3, A.member + .3), { serif: true, size: 96, a: ta });
      B.write(ctx, 'robot co-op', 960, 884, span(t, A.vote - .1, A.vote + .5), { size: 34, col: P.halo2, glow: false, a: ta, spacing: .3 });
    }
    ctx.restore();
  }
  // the robot's cup: pale against the window so it reads (the kit draws it in the body colour)
  function robotCup(ctx, h) { if (!h) return; const s = 372; ctx.fillStyle = mixHex(P.cream, P.shade0, .35); ctx.beginPath(); ctx.moveTo(h[0] - .03 * s, h[1] - .075 * s); ctx.lineTo(h[0] + .03 * s, h[1] - .075 * s); ctx.lineTo(h[0] + .024 * s, h[1] - .012 * s); ctx.lineTo(h[0] - .024 * s, h[1] - .012 * s); ctx.closePath(); ctx.fill(); }
  // ---------- C: the thread back (drawn on the focus card) ----------
  function wowThread(ctx, t) {
    const u = thrU(t); if (u <= 0) return;
    const pts = threadPts(t);
    trail(ctx, pts, u, { w: 2.6, spark: u < .999 });
    if (u > .98) B.beads(ctx, pts, t, { n: 4, speed: .45, dir: 1, size: 3.4 });
    const hp = pts[pts.length - 1], g = smooth(span(t, A.taught - .25, A.taught + .35)) * (1 - .25 * Math.sin(t * 2.2) ** 2);
    if (g > 0) { halo(ctx, hp[0], hp[1], 46 * g, .8 * g, P.halo1, P.core0); }
  }
  // ---------- D/E: the co-op ring over you, then the globe and the two threads ----------
  function mapD(ctx, t) {
    const v = vD(t);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.applyView(ctx, v);
    const limbA = smooth(span(t, A.coop - .4, A.coop + 1.2));
    drawLimb(ctx, t, v, limbA);
    // the ring: grows out of the glow in your hand, rises over you
    const [rx, ry, rr] = MAP.ring, hand0 = [MAP.du[0] + 32, MAP.du[1] - 120];
    const up = expoOut(span(t, T_IRIS3F - .2, A.coop + .2)), cx = lerp(hand0[0], rx, up), cy = lerp(hand0[1], ry, up), r = lerp(8, rr, up);
    const dreamy = smooth(span(t, A.dream - .2, A.dream + .2)) * (1 - smooth(span(t, A.parts - .1, A.parts + .5)));
    const ring = { n: shareN(t), u: 1, hi: 12, hk: Math.max(.75 * smooth(span(t, A.nobody + .2, A.nobody + 1.1)), smooth(span(t, A.make - .1, A.make + .4))), dust: 1 };
    if (dreamy < 1) B.shares(ctx, cx, cy, r, t, { ...ring, a: 1 - dreamy });
    if (dreamy > 0) B.shares(ctx, cx, cy, r, t, { ...ring, dotted: true, a: dreamy });
    // you: carried over from the hall, then looking up, then reaching for your share
    const look = lerp(.15, .9, smooth(span(t, T_IRIS3F, A.coop))), arm = duArmD(t);
    const hands = E.du(ctx, MAP.du[0], MAP.du[1], MAP.du[2], { dir: 1, light: 1, back: .2, headset: true, look, armR: arm, armL: [-.1, -.04] });
    // the warm glow of the thread stays in your hand until the ring has risen
    const g0 = 1 - smooth(span(t, T_IRIS3F, T_IRIS3F + .5));
    if (g0 > 0) halo(ctx, hand0[0], hand0[1], 46 * g0, .8 * g0, P.halo1, P.core0);
    // your trace to the new share (13th)
    const tu = expoOut(span(t, A.you + .3, A.make - .05));
    if (tu > 0) {
      const q = -Math.PI / 2 + 12.5 / shareN(t) * 6.283, tip = [cx + Math.cos(q) * r * .75, cy + Math.sin(q) * r * .75];
      const pts = catmull([[hands.R[0], hands.R[1], 2.2], [lerp(hands.R[0], tip[0], .45) - 60, lerp(hands.R[1], tip[1], .5), 2.2], tip.concat(2.2)], 14);
      trail(ctx, pts, tu, { w: 2.2, a: 1 - smooth(span(t, A.sounds, A.parts)) });
    }
    // words: "robot co-op" under the ring
    const wa = 1 - smooth(span(t, A.parts - .3, A.parts + .3));
    B.write(ctx, 'robot co-op', rx, ry + rr + 120, span(t, A.coop - .2, A.coop + .4), { serif: true, size: 92, a: wa });
    // E: two threads leave the ring to the west and the east, along the rim
    const th = expoOut(span(t, A.parts + .1, A.exist + .1));
    if (th > 0) {
      for (const [p, lab, d] of [[EAST, 'india', 1], [WEST, 'basque country', -1]]) {
        const pts = B.arcPts([rx + d * rr * .5, ry + rr * .6], p, -40, 60, 3 / v.s);
        trail(ctx, pts, th, { w: 3 / v.s });
        mapPoint(ctx, t, p, span(t, A.exist - .3, A.exist + .7), lab, v);
      }
    }
    ctx.restore();
  }

  // ---------- F: the Indian village at sunrise ----------
  function india(ctx, t, c) {
    card(ctx, c, 40000, () => B.morningSky(ctx, .9, 735, { t }));
    card(ctx, c, SUN.Z, () => {
      B.sun(ctx, SUN.u, SUN.v, SUN.r, t, { rays: true, dust: 2500 });
      B.hill(ctx, [[-400, 735], [300, 722], [900, 732], [1500, 716], [2400, 728]], { c0: mixHex(P.ind0, M.dawnRose, .25), c1: P.ind0, rim: rgba(P.halo1, .55) });
    });
    card(ctx, c, 4000, () => { farRoofs(ctx); ctx.save(); ctx.translate(1520, 770); ctx.scale(1.25, 1.25); bigTree(ctx, 0, 0, t); ctx.restore(); });
    card(ctx, c, F0, () => {
      B.hill(ctx, [[-300, 846], [500, 838], [1100, 846], [2300, 832]], { c0: mixHex(P.ind1, P.blue1, .25), c1: P.night0, rim: rgba(P.halo1, .75), rimW: 3 });
      // the sun lays a warm path on the ground toward us
      E.lightPool(ctx, 1250, 1600, 848, 300, 260, .5);
      for (let i = 0; i < 3; i++) {
        const [x, y, h, dir, ph] = PEOPLE[i];
        E.castShadow(ctx, x, y, h * .16, h * .8, 2.45, .5);
        E.person(ctx, x, y, h, { dir, light: x < 900 ? 1 : -1, rim: rgba(P.halo0, .95), long: true, armR: ph === 'R' ? phoneArm : [.15, .08], armL: ph === 'L' ? [-phoneArm[0], -phoneArm[1]] : [-.15, -.08], look: .1 });
        const hp = PH[i]; ctx.fillStyle = B.M.cyan; ctx.fillRect(hp[0] - 5, hp[1] - 17, 10, 18); halo(ctx, hp[0], hp[1] - 8, 26, .55, P.blue0, B.M.data);
      }
      dataDots(ctx, t);
    });
    // the label: KARYA · INDIA (writes on "India")
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const la = 1 - smooth(span(t, A.by - .6, A.by - .2));
    if (la > 0) { B.write(ctx, 'karya', 150, 200, span(t, A.india - .1, A.india + .5), { size: 60, align: 'left', a: la, spacing: .22 }); B.write(ctx, 'india', 153, 250, span(t, A.india + .1, A.india + .7), { size: B.SZ.small, align: 'left', col: P.halo2, glow: false, a: la }); }
    ctx.restore();
  }
  const PH = PEOPLE.map(([x, y, h, dir, ph]) => B.measure((c) => E.person(c, x, y, h, { dir, long: true, armR: ph === 'R' ? phoneArm : [.15, .08], armL: ph === 'L' ? [-phoneArm[0], -phoneArm[1]] : [-.15, -.08] }))[ph]);
  function dataDots(ctx, t) {   // rise from the phones (on "record") toward one cluster high up (design coords of the focus card ≈ screen)
    for (let i = 0; i < dotsN; i++) {
      const [src, a, b, d] = DOT[i], t0 = A.record - .4 + a * 1.2, k = span(t, t0, t0 + 2.2); if (k <= 0) continue;
      const e = sineIO(k), p0 = PH[src], tx = CLUSTER[0] + (b - .5) * 120, ty = CLUSTER[1] + (d - .5) * 60;
      const x = lerp(p0[0], tx, e) + Math.sin(t * 1.4 + i) * 12 * (1 - e), y = lerp(p0[1] - 10, ty, e) - Math.sin(Math.PI * e) * 40;
      halo(ctx, x, y, 18, .6, P.blue0, B.M.data); ctx.fillStyle = B.M.data; ctx.beginPath(); ctx.arc(x, y, 4.2, 0, 6.29); ctx.fill();
    }
  }
  let TREE = null;
  function bigTree(ctx, x, y, t) {
    if (!TREE) {   // a banyan: one broad, flat crown (a few soft lobes), a thick trunk, hanging roots (cached path, local coords)
      let p = new Path2D();
      const lobes = [[0, -330, 420, 120], [-250, -300, 200, 95], [250, -306, 210, 100], [-110, -400, 230, 95], [130, -405, 220, 90], [-380, -262, 120, 60], [390, -268, 120, 62]];
      for (const [cx, cy, rx, ry] of lobes) { const e = new Path2D(); e.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); p = p.op(e, PathOp.Union); }
      const tr = new Path2D(); tr.moveTo(-54, 0); tr.bezierCurveTo(-40, -90, -34, -180, -96, -262); tr.lineTo(96, -262); tr.bezierCurveTo(40, -180, 44, -90, 60, 0); tr.closePath(); p = p.op(tr, PathOp.Union);
      for (const [rx, w] of [[-300, 6], [-246, 5], [-170, 7], [180, 6], [262, 5], [330, 6]]) { const rt = new Path2D(); rt.roundRect(rx, -250, w, 250, 3); p = p.op(rt, PathOp.Union); }
      TREE = p;
    }
    const sway = Math.sin(t * .5) * .003;
    ctx.save(); ctx.translate(x, y); ctx.transform(1, 0, sway, 1, 0, 0);
    ctx.fillStyle = lin(ctx, -460, 0, 460, 0, [[0, mixHex(P.night1, P.halo1, .1)], [.35, P.night1], [1, P.night0]]); ctx.fill(TREE);
    const sh = new Path2D(); sh.addPath(TREE, { a: 1, b: 0, c: 0, d: 1, e: 6, f: 3 }); ctx.fillStyle = rgba(P.halo0, .6); ctx.fill(new Path2D(TREE).op(sh, PathOp.Difference));
    ctx.restore();
  }
  function farRoofs(ctx) {   // flat roofs with parapets, a water tank, quiet silhouettes left of the tree
    const rr = [[260, 300, 120], [520, 210, 92], [700, 170, 140], [-60, 260, 100], [880, 120, 70]];
    for (const [x, w, h] of rr) {
      const y = 770; ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]);
      ctx.beginPath(); ctx.moveTo(x - w / 2, y + 30); ctx.lineTo(x - w / 2, y - h); ctx.lineTo(x - w / 2 + 14, y - h); ctx.lineTo(x - w / 2 + 14, y - h - 12); ctx.lineTo(x + w / 2, y - h - 12); ctx.lineTo(x + w / 2, y + 30); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(x + w / 2 - 3, y - h - 12, 3, h + 40);
    }
    ctx.fillStyle = P.night1; ctx.fillRect(668, 770 - 140 - 52, 46, 40);   // water tank
  }

  // ---------- G: VOICE → DATA → SOLD, the wage, the thread back ----------
  const T_ZOOM = A.small + .3;
  function herHand(c) { const p = PH[HER]; return project(c, F0, p[0], p[1]); }
  function flowG(ctx, t, c) {
    // the woman stays: same place as in the village (carried through the iris)
    card(ctx, c, F0, () => { const [x, y, h, dir] = PEOPLE[HER]; E.person(ctx, x, y, h, { dir, light: dir, rim: rgba(P.halo1, .9), long: true, armR: [phoneArm[0], phoneArm[1]], armL: [-.15, -.08], look: .1 }); });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const fold = smooth(span(t, A.sofar + .2, A.sofar + 1.3)), ga = 1 - fold;
    const kV = span(t, A.by - .1, A.by + .6), kD = span(t, T_IRIS5 - .2, T_IRIS5F), kS = span(t, A.by + .9, A.by + 1.6);
    // nodes: VOICE (warm, human), DATA (cool), SOLD (cool)
    const nv = NODES.voice, nd = NODES.data, ns = NODES.sold;
    if (ga > 0) {
      B.link(ctx, [nv[0] + 95, nv[1]], [nd[0] - 100, nd[1]], expoOut(span(t, A.by + .2, A.by + 1)) * ga, t, { bend: -50, warm: 0, beads: 4, dir: 1, a: ga });
      B.link(ctx, [nd[0] + 100, nd[1]], [ns[0] - 95, ns[1]], expoOut(span(t, A.by + .7, A.by + 1.5)) * ga, t, { bend: -50, warm: 0, beads: 4, dir: 1, a: ga });
      E.icon(ctx, 'person', nv[0], nv[1], 150 * (1 - .3 * fold), t, { lit: 1, a: expoOut(kV) * ga, dust: 0, seed: 3 });
      E.icon(ctx, 'coin', ns[0], ns[1], 136 * (1 - .3 * fold), t, { lit: 0, a: expoOut(kS) * ga, dust: 0, glow: 1.4, seed: 4 });
      B.write(ctx, 'voice', nv[0], nv[1] + 140, span(t, A.by + .1, A.by + .7), { size: B.SZ.label, a: ga * ga });
      B.write(ctx, 'sold', ns[0], ns[1] + 140, span(t, A.by + 1.1, A.by + 1.7), { size: B.SZ.label, a: ga * ga });
    }
    // the data node: the cluster of cold points closes into one cool disc
    const dd = 1 - fold * .85;
    B.node(ctx, nd[0], nd[1], 74 * dd, kD, t, { warm: 0, glow: 1.3, a: lerp(1, .0, smooth(span(t, A.small - .2, A.small + .3))) });
    if (ga > 0) B.write(ctx, 'data', nd[0], nd[1] + 140, span(t, A.by - .2, A.by + .4), { size: B.SZ.label, a: ga });
    // the wage: a warm coin drops from DATA into her hand
    const [hx, hy] = herHand(c), kw = span(t, A.wage - .45, A.wage + .15);
    if (kw > 0) {
      const e = expoIn(kw), x = lerp(nd[0], hx, e), y = lerp(nd[1] + 60, hy - 14, e) - Math.sin(Math.PI * kw) * 40;
      if (kw < 1) E.icon(ctx, 'coin', x, y, 36, t, { lit: 1, dust: 0, glow: .7 });
      const land = smooth(span(t, A.wage + .1, A.wage + .5)) * (1 - smooth(span(t, A.sofar, A.small)));
      if (land > 0) halo(ctx, hx, hy - 8, 60 * land, .9 * land, P.halo1, P.core0);
      B.tag(ctx, hx + 20, hy - 14, span(t, A.wage + .1, A.wage + 1.1) * ga, { dx: 150, dy: -70, label: 'several × minimum wage', sub: 'self-reported · karya', size: B.SZ.small });
    }
    // the promised cut: from SOLD a hair-thin thread runs back down into her hand
    const kr = expoOut(span(t, A.resold - .2, A.resold + 1.0));
    if (kr > 0) {
      const pts = B.arcPts([ns[0], ns[1] + 50], [hx + 4, hy - 16], 120, 50, 1.1).map((p, i, a) => p);
      const ta = 1 - smooth(span(t, A.small - .3, A.small + .25));
      if (ta > 0) { trail(ctx, pts, kr, { w: lerp(1.6, .7, fold), a: ta }); if (kr > .99) B.beads(ctx, pts, t, { n: 2, speed: .3, size: 1.6, a: ta }); }
    }
    // "small": only a tiny glint lands in her hand
    const gl = smooth(span(t, A.small - .3, A.small + .2));
    if (gl > 0) { halo(ctx, hx + 4, hy - 16, 14 * gl, .9 * gl, P.halo1, P.core0); }
    ctx.restore();
  }
  // ---------- H: pull back, she becomes the INDIA point on the globe (continues in c09) ----------
  // at T_ZOOM her feet on screen = EAST under view VZ0 (computed once from the village camera)
  const VZ = (() => { const c = camF(T_ZOOM), [x, y, k] = project(c, F0, PEOPLE[HER][0], PEOPLE[HER][1]), s = 9; return { v0: B.viewPut(EAST[0], EAST[1], x, y, s), k, s, hand: herHand(c), feet: [x, y] }; })();
  const KH = [[T_ZOOM, VZ.v0], [A.end + 1.2, H_END, 's', EAST]];
  function mapH(ctx, t) {
    const v = B.vDrift(B.viewAt(t, KH), t, .3, 13);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); B.applyView(ctx, v);
    drawLimb(ctx, t, v, smooth(span(t, T_ZOOM + .1, T_ZOOM + 1)));
    // the ring over the hall and the two map points
    const [rx, ry, rr] = MAP.ring;
    B.shares(ctx, rx, ry, rr, t, { n: 13, u: 1, hi: 12, hk: .6, a: smooth(span(t, T_ZOOM + .3, T_ZOOM + 1.2)) });
    mapPoint(ctx, t, WEST, 1, 'basque country', v, { la: smooth(span(t, T_ZOOM + .4, T_ZOOM + 1)) });
    // she, small, on the east point (in map units: screen size / s)
    const s = VZ.s, h = PEOPLE[HER][2] * VZ.k / s;
    const fade = smooth(span(t, T_ZOOM + .35, T_ZOOM + .9));
    E.person(ctx, EAST[0], EAST[1], h, { dir: PEOPLE[HER][3], light: PEOPLE[HER][3], rim: rgba(P.halo1, .9), long: true, armR: [phoneArm[0], phoneArm[1]], armL: [-.15, -.08], look: .1 });
    const hx = EAST[0] + (VZ.hand[0] - VZ.feet[0]) / s, hy = EAST[1] + (VZ.hand[1] - VZ.feet[1]) / s;
    halo(ctx, hx + 4 / s, hy - 16 / s, 14 / s, .9, P.halo1, P.core0);
    mapPoint(ctx, t, EAST, fade, 'india', v);
    ctx.restore();
  }

  return [{ t: R.a, draw, print: { editorial: true }, sound: [
    { f: 'shimmer_rings', t: T_IRIS1 - .1, v: .2 }, { f: 'glass_hum', t: A.taught - .3, v: .2 }, { f: 'whoosh_airy', t: A.parts, v: .12 }, { f: 'shimmer_rings', t: A.wage - .3, v: .15 },
  ] }];
};
import { PathOp, Path2D } from '@napi-rs/canvas';
