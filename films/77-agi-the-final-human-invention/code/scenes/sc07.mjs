// c07 · builder B2 · "So why isn't it in the power lines" → "This channel exists" (line 2, the catch). Rows: docs/shots.md 3.10–3.19 + C2.
// One entry, one draw function; motifs scheduled on phrases (lib/b2_extra.mjs anchorsB2), one world camera (F.lookPath) that follows the carrier.
//
// | ID   | anchor (phrase)            | motif                                                                                   | type | carrier → next        |
// |------|----------------------------|-----------------------------------------------------------------------------------------|------|-----------------------|
// | 3.10 | So why isn't it in the     | S.plateSample; the camera pulls back: the sample floats left of a power line, pylons and | MIX  | the sample            |
// |      |                            | your lit house rise; a dashed cream gap + ? between sample and line (not connected)      |      |                       |
// | 3.11 | Because it only works      | back to the sample, a kelvin thermometer draws beside it; the column falls from ROOM to  | EXPL | the thermometer bulb  |
// |      |                            | 2.5–6.5 K (lit cool) · WORKS ONLY AT 2.5–6.5 KELVIN (ABOUT −271 TO −267 °C)              |      |                       |
// | 3.12 | So far, only its own       | the tube drains into its bulb; the bulb drops into a badge, gold tick (ITS OWN TEAM);    | EXPL | the sample            |
// |      |                            | two dashed badges stay empty (OTHER LABS) · NO INDEPENDENT REPLICATION YET               |      |                       |
// | 3.13 | And most A.I. designs      | the pellet leaves its holder, the camera follows it to a small tray (MADE); beside it a  | EXPL | the tray              |
// |      |                            | tall stack of screens with dashed lattices builds up (DESIGNED) · height comparison      |      |                       |
// | 3.14 | The man you'll hear next   | pan right along the floor: a robot arm sets a dish into a furnace · PERIODIC LABS ·      | MIX  | the furnace window    |
// |      |                            | CO-FOUNDED BY THE NEXT SPEAKER                                                          |      |                       |
// | 3.15 | Here's why he says         | push into the furnace window; it becomes an empty slot · Why a lab?                     | EXPL | the slot              |
// | C2   | T.clip('C2')               | the plate grows out of the slot and returns into it                                     | CLIP | the slot              |
// | 3.16 | Only what gets built       | pull back to the comparison: the screens dim, the pellets light gold · ONLY WHAT GETS    | EXPL | a pellet's grain      |
// |      |                            | BUILT COUNTS                                                                            |      |                       |
// | 3.17 | So the second line         | a grain of gold lifts off the tray and flies into the mini board (corner): MATERIALS     | EXPL | row 2                 |
// |      |                            | flaps BEGUN                                                                             |      |                       |
// | 3.18 | Still small                | the camera tilts up off the lab, the board comes to the middle: one grain · STILL SMALL | EXPL | the grain             |
// | 3.19 | But real                   | the grain gets a tick · REAL → boardAct (shared with c08)                               | EXPL | the board             |
import * as F from '../lib/f77_kit.mjs';
import * as S from '../lib/f77_seams.mjs';
import * as B from '../lib/b2_extra.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, GOLD, CREAM, COOL } = F;

export const PRINT = F.PRINT77;
export default async (T, R) => {
  const a = B.anchorsB2(T);
  return [{ t: R.a, draw: scene(a, T, R), print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ layout (world px)
const SM = S.SAMPLE;                                          // the sample (the plate's position = world origin of this chunk)
const GR = 1300;                                              // the ground of the whole chunk
const P1 = 2600, P2 = 4150, PH = 1180;                        // the two pylons
const HOUSE = { x: 3200, w: 560 };
const TH = { x: 1330, top: 120, len: 690 };                   // the thermometer
const BG = { y: 1010, r: 86, o1: 1620, o2: 1860, r2: 70, line: 1112 };   // the badges
const ST = { x: 3350, w: 300, h: 170, gap: 15, n: 9 };        // the screen stack
const TR = { x: 3960, w: 380 };                               // the tray
const TRY = GR - TR.w * .59;
const PEL = [3850, 3950, 4060];                               // pellets on the tray (ours lands on the last)
const RB = { x: 4480, s: 520 };                               // the lab robot
const WIN = (() => { const s = RB.s, fx = RB.x + s * 1.05, fw = s * .78, fh = s * .62, fy = GR - fh - s * .2; return { x: fx + fw * .2, y: fy + fh * .25, w: fw * .6, h: fh * .45 }; })();
const WC = [WIN.x + WIN.w / 2, WIN.y + WIN.h / 2];

function scene(a, T, R) {
  const t0 = R.a, tp = t0 + S.SEAM_HALF, C2 = a.C2;
  const tFly0 = a.most + .1, tFly1 = a.designs + .75;        // the pellet's flight to the tray
  const tTilt0 = a.small - .6, tTilt1 = a.real + .35;
  const K = [
    [t0, SM.x, SM.y + 20, 1], [a.home + .45, 2520, 760, .47],   // the pull-back starts AT the seam (lead fix 25.11.: no frozen plate half-second) [a.cold + .1, 2510, 755, .475],
    [a.cold + 1.25, 1150, 500, .95], [a.team - .05, 1160, 505, .965], [a.team + 1.0, 1450, 760, .83], [a.most + .05, 1460, 762, .84],
    [tFly1 + .1, 3640, 640, .52], [a.man - .05, 3660, 640, .525], [a.man + 1.5, 4620, 920, .86], [a.why - .05, 4660, 925, .88],
    [a.lab + .15, WC[0], WC[1], 2.3], [C2.end + .55, WC[0], WC[1], 2.45], [C2.end + 3.4, 3660, 640, .55],
    [tTilt0, 3680, 640, .56], [tTilt1, B.TILT_END[0], B.TILT_END[1], .56],
  ];
  // at t0 the frame IS S.plateSample (z 1, centred); the plate's creep (2 %/s) hands its speed over and dies away while the pull-back eases in
  const cam = (t) => { const c = F.lookPath(t, K), s = Math.max(0, t - t0); return { ...c, z: c.z * (1 + S.CREEP * s * Math.exp(-s / .35)) }; };
  const glowAt = (t) => {
    const s = S.sampleGlow(t), th = [1050, 470, 950, .5];
    s[3] *= 1 + .22 * Math.sin(Math.PI * span(t, t0, t0 + 1.6));   // the sample's light swells once as the camera leaves it (seam: never a still frame)
    const lab = [1100, 520, 1000, .45], bg = B.boardGlow(t);
    const k1 = smooth(span(t, tp, a.cold + 1)), k2 = smooth(span(t, a.most, a.man + 1)), k3 = smooth(span(t, tTilt0, tTilt1));
    return s.map((v, i) => lerp(lerp(lerp(v, th[i], k1), lab[i], k2), bg[i], k3));
  };
  // ---------------------------------------------------------------- 3.10 the line, the pylons, your house (they rise in from below the frame)
  const lineU = (t) => expoOut(span(t, tp - .1, a.home + .3));
  const drawLine = (ctx, t) => {
    const u = lineU(t); if (u <= 0 || t > a.cold + 1.3) return;
    const rise = (x) => (1 - expoOut(span(t, tp - .1 + Math.abs(x - SM.x) / 9000, a.home + .1 + Math.abs(x - SM.x) / 9000))) * PH * 1.1;
    ctx.save(); ctx.beginPath(); ctx.rect(-6000, -4000, 16000, 4000 + GR); ctx.clip();
    ctx.save(); ctx.translate(0, rise(P1)); const p1 = B.pylon(ctx, P1, GR, PH); ctx.restore();
    ctx.save(); ctx.translate(0, rise(P2)); const p2 = B.pylon(ctx, P2, GR, PH); ctx.restore();
    ctx.save(); ctx.translate(0, rise(HOUSE.x)); const hs = B.house(ctx, t, HOUSE.x, GR, HOUSE.w, { win: span(t, a.home - .3, a.home + .3) }); ctx.restore();
    ctx.restore();
    const wu = smooth(span(t, a.c07 + .9, a.home + .5)), dy1 = rise(P1), dy2 = rise(P2);
    if (wu > 0) {
      for (const k of ['L', 'R', 'L2', 'R2']) {
        const A = [p1[k][0], p1[k][1] + dy1], Bp = [p2[k][0], p2[k][1] + dy2];
B.wire(ctx, A, [lerp(A[0], Bp[0], wu), lerp(A[1], Bp[1], wu)], 80 * wu, { w: 2.5 }); B.wire(ctx, Bp, [Bp[0] + 1700 * wu, Bp[1] + 40], 30 * wu, { w: 2.5 });
      }
      const hr = [hs.roof[0], hs.roof[1] + rise(HOUSE.x)]; B.wire(ctx, [p2.L2[0], p2.L2[1] + dy2], [lerp(p2.L2[0], hr[0], wu), lerp(p2.L2[1] + dy2, hr[1], wu)], 40 * wu, { w: 2, col: rgba(GOLD.line, .55) });
    }
    // not connected: a dashed cream line from the sample toward the line, broken in the middle, a ? in the gap
    const gu = smooth(span(t, a.home - .35, a.home + .35)) * (1 - smooth(span(t, a.cold + .2, a.cold + .8)));
    if (gu > 0) {
      const A = [SM.x + 150, SM.y - 30], Bp = [p1.L[0] - 20, p1.L[1] + dy1 + 20], m1 = [lerp(A[0], Bp[0], .4), lerp(A[1], Bp[1], .4)], m2 = [lerp(A[0], Bp[0], .62), lerp(A[1], Bp[1], .62)];
      F.outline(ctx, [[A, m1], [Bp, m2]], gu, { dashed: true, t, w: 4 });
      F.glowText(ctx, '?', (m1[0] + m2[0]) / 2, (m1[1] + m2[1]) / 2 + 30, { size: 96, serif: true, align: 'center', col: GOLD.body, a: span(gu, .5, 1), glow: true });
    }
  };
  // ---------------------------------------------------------------- the sample (in its holder until its pellet leaves for the tray)
  const coldAt = (t) => lerp(.45 + .1 * Math.sin(t * 1.3), 1, smooth(span(t, a.extreme, a.zero + .2))) * (1 - .6 * span(t, a.team + .5, a.most));
  const flyQ = (t) => sineIO(span(t, tFly0, tFly1));
  const pelletAt = (t) => {   // [x, y, s] of the travelling pellet (world)
    const q = flyQ(t), A = [SM.x, SM.y + 6], Bp = [PEL[2], TRY - 12], c = [lerp(A[0], Bp[0], .45), -420];
    return [(1 - q) ** 2 * A[0] + 2 * (1 - q) * q * c[0] + q * q * Bp[0], (1 - q) ** 2 * A[1] + 2 * (1 - q) * q * c[1] + q * q * Bp[1], lerp(SM.s, 38, sineIO(span(t, tFly0, tFly1 - .2)))];
  };
  const drawSample = (ctx, t) => {
    const lift = span(t, tFly0 - .05, tFly0 + .1);
    if (t < tFly1 + 1.5) {   // the holder (and until the lift the pellet with it); after the lift the holder sinks away
      const sk = sineIO(span(t, tFly0, tFly0 + 1.2));
      ctx.save(); ctx.translate(0, sk * 900); ctx.beginPath(); ctx.rect(-4000, -4000, 12000, 4000 + GR); ctx.clip();
      F.sample(ctx, t, SM.x, SM.y, SM.s, { probes: 1 - span(t, tFly0 - .4, tFly0 + .05), cold: coldAt(t) });
      if (lift > 0) { ctx.fillStyle = mixHex(P.ind1, P.night0, .4); ctx.beginPath(); ctx.ellipse(SM.x, SM.y + SM.s * .2, SM.s * 1.02, SM.s * .5, 0, 0, 6.29); ctx.fill(); }
      ctx.restore();
    }
    if (lift > 0) { const [x, y, s] = pelletAt(t); B.pellet(ctx, x, y, s, pelLit(2, t)); }
  };
  const pelLit = (i, t) => smooth(span(t, a.built + .25 + i * .12, a.built + .7 + i * .12)) * (1 - .35 * span(t, a.second + .2, a.second + .8) * (i === 2 ? 1 : 0));
  // ---------------------------------------------------------------- 3.11 the thermometer · 3.12 the badges
  const drawThermo = (ctx, t) => {
    if (t < a.cold - .15 || t > a.team + 1.2) return null;
    const lv = lerp(293 / 300, 4.5 / 300, F.quartIO(span(t, a.extreme - .05, a.zero + .35)));
    const th = B.thermo(ctx, t, TH.x, TH.top, TH.len, { u: span(t, a.cold - .1, a.cold + .8), level: lv, band: [2.5, 6.5], bandU: span(t, a.zero, a.zero + .5), retract: span(t, a.team - .05, a.team + .55), r: 42 });
    const lu = span(t, a.cold + .5, a.cold + 1.1) * (1 - span(t, a.team - .2, a.team + .2));
    if (lu > 0) { F.capsLabel(ctx, 'ROOM TEMPERATURE · 293 K', TH.x + 70, th.Y(293) + 8, lu, { size: 24, col: CREAM, align: 'left' }); F.capsLabel(ctx, 'ABSOLUTE ZERO · 0 K', TH.x + 70, th.Y(0) + 40, span(t, a.zero - .2, a.zero + .4) * (1 - span(t, a.team - .2, a.team + .2)), { size: 24, col: COOL.text, align: 'left' }); }
    return th;
  };
  const drawBadges = (ctx, t) => {
    if (t < a.team + .3 || t > a.man) return;
    const sink = sineIO(span(t, a.most + .1, a.most + 1)) * 260;
    ctx.save(); ctx.beginPath(); ctx.rect(0, -2000, 6000, 2000 + BG.line); ctx.clip(); ctx.translate(0, sink);
    const m = sineIO(span(t, a.team + .3, a.own - .05)), x = TH.x, y = lerp(TH.top + TH.len, BG.y, m), r = lerp(42, BG.r, m);
    if (m < 1) { ctx.fillStyle = mixHex(GOLD.mid, COOL.body, 1); ctx.globalAlpha = 1 - m; ctx.beginPath(); ctx.arc(x, y, r * .78, 0, 6.29); ctx.fill(); ctx.globalAlpha = 1; }
    B.badge(ctx, t, x, y, r, { u: lerp(.9, 1, m), tick: span(t, a.own + .05, a.own + .45) });
    B.badge(ctx, t, BG.o1, BG.y, BG.r2, { u: span(t, a.tested - .35, a.tested + .35), dashed: true, q: true });
    B.badge(ctx, t, BG.o2, BG.y, BG.r2, { u: span(t, a.tested - .2, a.tested + .5), dashed: true, q: true });
    ctx.restore();
    const lu = span(t, a.team + .3, a.team + 1); if (lu > 0) F.outline(ctx, [[[x - 200, BG.line], [BG.o2 + 200, BG.line]]], lu, { w: 1.5, a: .5 });
  };
  // ---------------------------------------------------------------- 3.13 DESIGNED (stack of screens) · MADE (the tray)
  const drawLab = (ctx, t) => {
    if (t < a.most - .3) return;
    const dimS = 1 - .62 * smooth(span(t, a.built, a.built + .6));
    for (let i = 0; i < ST.n; i++) {
      const t1 = a.designs - .1 + i * .19, k = expoOut(span(t, t1, t1 + .5)); if (k <= 0) continue;
      const y = GR - (i + 1) * (ST.h + ST.gap), lit = .35 + .65 * Math.sin(Math.PI * span(t, a.screen - .1 + i * .03, a.screen + .6 + i * .03)) * (i > 5 ? 1 : .4);
      ctx.save(); ctx.beginPath(); ctx.rect(ST.x - 400, -6000, 800, 6000 + y + ST.h + 1); ctx.clip();
      B.screenPanel(ctx, t, ST.x - ST.w / 2, y + (1 - k) * (ST.h + ST.gap) * 1.4, ST.w, ST.h, { seed: i + 3, lit: lit * dimS + .1, a: lerp(1, .55, 1 - dimS) });
      ctx.restore();
    }
    const tu = span(t, a.most + .2, a.most + .9); if (tu > 0) { ctx.save(); ctx.globalAlpha *= smooth(tu); B.tray(ctx, TR.x, TRY, TR.w); ctx.restore(); }
    for (let i = 0; i < 2; i++) { const k = expoOut(span(t, a.most + .5 + i * .15, a.most + 1 + i * .15)); if (k > 0) B.pellet(ctx, PEL[i], TRY - 12 - (1 - k) * 30, 38 * k, pelLit(i, t)); }
    // the robot and its furnace (they are there when the camera reaches them; the arm idles, then sets the dish in)
    const reach = sineIO(span(t, a.cofound + .2, a.exper - .1)), back = sineIO(span(t, a.exper + .3, a.why + 1.5));
    F.labRobot(ctx, t, RB.x, GR, RB.s, { reach: reach * (1 - back * .5) + .04 * Math.sin(t * .9), fire: .55 + .45 * span(t, a.exper - .4, a.exper + .2) });
    // 3.15 the furnace window becomes an empty slot
    const su = span(t, a.why + .3, a.why + 1.2); if (su > 0) F.slot(ctx, t, WC[0], WC[1], WIN.w, WIN.h, { u: su });
  };

  // ======================================================================================================================== draw
  return (ctx, t) => {
    const c = cam(t);
    F.night(ctx, t, { glow: glowAt(t), ox: -(c.cx - SM.x) * .02, oy: -(c.cy - SM.y - 20) * .05 });   // at the tilt's end = B.STARS_B
    if (t < tTilt1 + .2) F.look(ctx, c.cx, c.cy, c.z, () => {
      B.ground(ctx, GR);
      drawLine(ctx, t);
      drawLab(ctx, t);
      drawBadges(ctx, t);
      drawThermo(ctx, t);
      drawSample(ctx, t);
    });
    const sp = (x, y) => F.lookPt(c.cx, c.cy, c.z, x, y), io = (i0, o0, d = .45) => span(t, i0, i0 + .55) * (1 - span(t, o0, o0 + d));
    // ---------------- screen type
    { const u = io(a.zero - .1, a.team - .2); if (u > 0) { F.capsLabel(ctx, 'WORKS ONLY AT 2.5–6.5 KELVIN', 1250, 430, u, { size: 32, col: COOL.text, align: 'left' }); F.capsLabel(ctx, '(ABOUT −271 TO −267 °C)', 1250, 476, span(u, .2, 1), { size: 24, col: CREAM, align: 'left' }); } }
    { const [x1, y1] = sp(TH.x, BG.y + BG.r + 50), [x2] = sp((BG.o1 + BG.o2) / 2, 0), out = a.most + .1;
      F.capsLabel(ctx, 'ITS OWN TEAM', x1, y1, io(a.own, out, .35), { size: 24, col: GOLD.text });
      F.capsLabel(ctx, 'OTHER LABS', x2, y1, io(a.tested, out, .35), { size: 24, col: CREAM });
      F.capsLabel(ctx, 'NO INDEPENDENT REPLICATION YET', W / 2, 200, io(a.tested + .1, out + .05, .4), { size: 32, col: CREAM }); }
    { const out = a.man + .2, [xd, yd] = sp(ST.x, GR + 70), [xm] = sp(TR.x, 0);
      F.capsLabel(ctx, 'DESIGNED', xd, yd, io(a.designs + .3, out, .4) + io(a.built - .1, a.second + .2, .4), { size: 26, col: COOL.text });
      F.capsLabel(ctx, 'MADE', xm, yd, io(a.screen - .2, out, .4) + io(a.built - .1, a.second + .2, .4), { size: 26, col: GOLD.text }); }
    { const [x, y] = sp(RB.x + RB.s * 1.05 + RB.s * .39, GR - RB.s * .82), u = io(a.cofound - .3, a.why + .3);
      if (u > 0) { F.goldLabel(ctx, x, y, 'PERIODIC LABS', 'CO-FOUNDED BY THE NEXT SPEAKER', u, { dx: -90, dy: -110, size: 34 }); } }
    { const u = io(a.lab - .45, C2.start - .1, .3); if (u > 0) F.question(ctx, t, 'Why a lab?', W / 2, 250, 64, { u: u, out: span(t, C2.start - .3, C2.start + .05) }); }
    { const u = io(a.built + .05, a.second + .25); if (u > 0) F.verdict(ctx, t, W / 2, 210, 'ONLY WHAT GETS BUILT COUNTS', u, { size: 34 }); }
    // ---------------- C2: the plate grows out of the slot and goes back into it
    if (t > C2.start - .45 && t < C2.end + .8) {
      const [x0, y0] = sp(WIN.x, WIN.y), [x1, y1] = sp(WIN.x + WIN.w, WIN.y + WIN.h);
      const m = span(t, C2.start - .45, C2.start + .8) * (1 - span(t, C2.end - .45, C2.end + .75));   // single ease (clipPlate eases m itself; the double ease LURCHed)
      if (m > 0) F.clipPlate(ctx, t, T, 'C2', { from: { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }, morph: m });
    }
    // ---------------- 3.17 a grain of gold lifts off the tray and flies into row 2 of the mini board (screen space)
    if (t > a.second - .3 && t < a.begun + .05) {
      const q = sineIO(span(t, a.second - .1, a.begun)), [sx, sy] = sp(PEL[2], TRY - 14), [gx, gy] = B.grainAt(B.BOARD_CORNER.x, B.BOARD_CORNER.y, B.BOARD_CORNER.s), cx1 = lerp(sx, gx, .3), cy1 = Math.min(sy, gy) - 260;
      const x = (1 - q) ** 2 * sx + 2 * (1 - q) * q * cx1 + q * q * gx, y = (1 - q) ** 2 * sy + 2 * (1 - q) * q * cy1 + q * q * gy;
      F.halo(ctx, x, y, 60, .8, GOLD.halo, GOLD.core); ctx.fillStyle = GOLD.hot; ctx.beginPath(); ctx.arc(x, y, lerp(9, 6.5 * B.BOARD_CORNER.s, q), 0, 6.29); ctx.fill();
    }
    if (t > a.second - .2) B.boardAct(ctx, t, a);
  };
}
