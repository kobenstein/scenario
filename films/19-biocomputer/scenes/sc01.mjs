// c01 · Hook · the drawer · you · the rack in Singapore · feeding · Doom (C1) · no hands, eyes, reward · the question · blood · the clock
// 0 → T.G('In a lab') · built by the lead (quality reference). Plan: docs/shots.md 1.01–1.09 (source tools/shots19.py) · world/rules:
// docs/MOTION.md · kit: lib/f19_kit.mjs · seam: plateClock (lib/f19_seams.mjs) for the last .5 s.
// ONE entry, ONE world, ONE continuous camera (no cut): close above the drawer as it slides open → you and your phone (the same net
// glows in your head) → pull back to the aisle (SINGAPORE) → a pipette feeds the dish → truck to the screen in the aisle (C1 plays in
// it) → the screen goes dark, three glyphs struck → the camera swings back and tilts straight down into the dish: the aisle goes
// dark, the dish IS the explainer field now → the net rewinds into round cells → blood cells → back into the tube → one cell, its
// clock turning backward (= plateClock).
//
// | ID    | anchor (word)                         | picture (one idea)                                                    | 1–2 moves            | camera / layer            |
// |-------|---------------------------------------|-----------------------------------------------------------------------|----------------------|---------------------------|
// | 1.01★ | Computers now run on human brain cells | a rack drawer slides open, the dish with the gold net glows           | drawer · light       | slow push · SCENE         |
// | 1.02  | same kind of cells · watch this        | you with your phone; the same net glows inside your hood              | head net · look      | truck to you · SCENE      |
// | 1.03  | chip · server rack · Singapore         | the aisle: the alive rack among cold servers, you look up; SINGAPORE  | label                | breathing pull · SCENE    |
// | 1.04  | every few days · someone feeds them    | a pipette comes down, one drop, the net answers in a wave             | pipette · drop/wave  | push to drawer · SCENE    |
// | 1.05  | [C1] Cells like these … haven't        | ORIGINAL FOOTAGE in the screen in the aisle                           | footage              | truck into screen · CLIP  |
// | 1.06  | No hands · No eyes · No reward         | the screen dark; hand, eye, star appear, each struck                  | one glyph per word   | hold · EXPL               |
// | 1.07  | So how do you teach a dish of cells    | the question; the camera tilts down into the dish, the aisle goes dark | camera · ladder      | tilt down · SCENE→EXPL    |
// | 1.08  | grew up inside a head · never did      | a head beside the dish (its net gold); the dish answers               | head rises           | field · EXPL              |
// | 1.09  | didn't even start · blood sample · clock | the net rewinds to round cells, cool blood cells, the tube; all but one flow back; the one gets its clock, turning back | rewind · stream · clock | field · EXPL → plateClock |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import { plateClock, CLOCK_PLATE, SEAM_HALF } from '../lib/f19_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, lin, halo, prng } = E;
const { cam, camAt, camDrift, view, proj, bill, COOL, bump, NET } = F;

export const PRINT = F.PRINT19;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0, n = 0) => T.G(p, n, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.comp = G('Computers now run on'); a.cellsE = GE('human brain cells');
  a.same = G('The same kind of cells'); a.watch = G('to watch this', a.same);
  a.but = G('But these live on'); a.rack = G('server rack', a.but); a.sing = G('Singapore', a.but);
  a.every = G('And every few days'); a.someone = G('someone feeds', a.every); a.feeds = G('feeds them', a.every);
  a.c1 = F.clipWin(T, 'C1');
  a.hands = G('No hands'); a.eyes = G('No eyes', a.hands); a.reward = G('No reward', a.hands);
  a.how = G('So how do you teach a dish', a.reward); a.howE = GE('cells anything', a.reward);
  a.head = G('grew up inside a head'); a.never = G('These never did', a.head);
  a.start = G("didn't even start out", a.head); a.blood = G('blood sample', a.start); a.checkup = G('your last checkup', a.blood);
  a.make = G('to make brain cells', a.blood); a.turn = G("turn back a cell's clock", a.make);
  a.end = R.b;
  return [{ t: 0, draw: scene(a, T), print: PRINT }];
};

// ===================================================================================================== the set (world units ≈ mm)
const DISH = { X: 0, Y: F.drawerY(F.OPEN) + 12, Z: -F.RACK.tray * .5, R: F.RACK.dishR };   // the open dish (slide 1)
const YOU = { X: -1150, Z: -1100, h: 1700 };                   // you, in the aisle left of the alive rack, facing it (dir 1)
const MON = { X: 1180, Y: 1240, Z: -660, w: 760 };            // the screen on a stand in the aisle (C1 plays in it)
const FIELD = { cx: CLOCK_PLATE.cx, cy: CLOCK_PLATE.cy, r: CLOCK_PLATE.r };   // the dish field (= the plate's dish)
const DROP = [.2, -.05];                                      // where the feeding drop lands (dish units)
const VIAL = { x: 1650, y: 930, h: 340 };                     // the tube, right of the dish (rises from below the frame)
const HEADC = { x: 1640, y: 1060, h: 560 };                    // the head silhouette, same slot (rises, sinks before the tube)
// cameras: the hook, you, the aisle, the feeding, the screen (its content rect lands exactly on CLIP_RECT), straight down on the dish
const C_HOOK0 = cam({ tx: 0, ty: DISH.Y, tz: -170, d: 1250, p: -.47, oy: 110 });
const C_HOOK1 = cam({ tx: 0, ty: DISH.Y, tz: -270, d: 1000, p: -.55, oy: 100 });
const C_YOU0 = cam({ tx: -560, ty: 1260, tz: -520, d: 2750, p: -.08 });          // medium: you (left third) and the open drawer
const C_YOU1 = cam({ tx: -520, ty: 1250, tz: -500, d: 3000, p: -.075 });   // breathing hold: SINGAPORE
const C_FEED0 = cam({ tx: 160, ty: DISH.Y + 240, tz: DISH.Z, d: 1750, p: -.38, oy: 150 });
const C_FEED1 = cam({ tx: 150, ty: DISH.Y + 220, tz: DISH.Z, d: 1580, p: -.42, oy: 150 });
const C_MON = cam({ tx: MON.X, ty: MON.Y, tz: MON.Z, d: 1500 * MON.w / F.CLIP_RECT.w, p: 0, f: 1500, oy: F.CLIP_RECT.y + F.CLIP_RECT.h / 2 - H / 2 });
const C_TOP = cam({ tx: DISH.X, ty: DISH.Y, tz: DISH.Z, d: 1500 * DISH.R / FIELD.r, p: -Math.PI / 2, f: 1500 });
const night = (ctx) => { ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, P.night1], [1, P.night0]]); ctx.fillRect(0, 0, W, H); };
// dish-plane ring (u, v in dish units) through a mapping
function ringAt(ctx, map, cu, cv, rr) { ctx.beginPath(); let s = false; for (let k = 0; k <= 48; k++) { const an = k / 48 * 6.2832, q = map(cu + Math.cos(an) * rr, cv + Math.sin(an) * rr); if (!q) { s = false; continue; } s ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); s = true; } }

function scene(a, T) {
  const T0 = a.end, tPlate = T0 - SEAM_HALF, c1 = a.c1;
  const tLand = a.feeds + .34;                                 // the drop reaches the dish
  const tMon = c1.start + .45;                                 // the screen's content rect sits on CLIP_RECT
  const tDesc0 = a.reward + .55, tTop = a.head - .75;          // the swing down into the dish
  const K = [
    [0, C_HOOK0], [a.same - .3, C_HOOK1],
    [a.watch - .1, C_YOU0], [a.someone - .9, C_YOU1],
    [a.someone + .4, C_FEED0], [Math.max(a.someone + .9, tLand - .05), C_FEED1],
    [tMon, C_MON], [tDesc0, C_MON],
    [tTop, C_TOP],
  ];
  // the blood cells: one per soma, ranked by distance to the tube mouth (the stream back into the tube goes nearest first)
  const FM = F.fieldMap(FIELD.cx, FIELD.cy, FIELD.r);
  const mouth = [VIAL.x, VIAL.y - VIAL.h * 1.02];
  const HERO = NET.centre;
  const rank = NET.somas.map((s, i) => [i, Math.hypot(FM(s[0], s[1])[0] - mouth[0], FM(s[0], s[1])[1] - mouth[1])]).filter(([i]) => i !== HERO).sort((p, q) => p[1] - q[1]).map((p) => p[0]);
  const flowT = new Array(NET.somas.length).fill(null); rank.forEach((i, k) => { flowT[i] = a.make + .15 + k * .055; });
  const rnd = prng(1901), PH = NET.somas.map(() => [rnd() * 6.3, rnd() * 6.3]);
  const dropUV = DROP;
  const dist = NET.somas.map((s) => Math.hypot(s[0] - dropUV[0], s[1] - dropUV[1]));

  // the swing down into the dish: the target reaches the dish first (sine over the first 70 %), pitch and distance follow (tilt over)
  function camDesc(t) {
    const u = span(t, tDesc0, tTop), eT = sineIO(clamp(u / .7)), eP = sineIO(clamp((u - .2) / .8)), A = C_MON, B = C_TOP, o = {};
    for (const k of ['tx', 'ty', 'tz', 'ox', 'oy', 'f']) o[k] = lerp(A[k], B[k], eT);
    o.p = lerp(A.p, B.p, eP); o.d = Math.exp(lerp(Math.log(A.d), Math.log(B.d), eP));
    return o;
  }
  return (ctx, t) => {
    if (t < tTop) world(ctx, t); else field(ctx, t);
    // screen-space layers on top: the question, the ladder
    F.questionLine(ctx, t, a.how, a.head - .5, { y: 128, size: 58 });
    F.ladder(ctx, t, T);
    if (t >= tPlate) plateClock(ctx, t);
  };

  // ---------------------------------------------------------------------------------------------------------------------- 3D: the aisle
  function world(ctx, t) {
    // drift: full in the aisle, none while the screen holds CLIP_RECT and on the landing above the dish
    const hold = Math.max(smooth(span(t, tMon - .9, tMon)) * (1 - smooth(span(t, tDesc0, tDesc0 + 1.2))), smooth(span(t, tTop - 1.4, tTop)));
    const c = camDrift(t > tDesc0 && t < tTop ? camDesc(t) : camAt(t, K), t, (1 - hold) * .35), v = view(c);
    const slide = .3 + .7 * sineIO(span(t, 0, a.cellsE + .5));
    const desc = smooth(span(t, tDesc0, tTop));                // 0 → 1 over the swing down
    const dark = smooth(span(t, tDesc0 + .5, tTop - .55));         // the aisle goes dark round the dish
    const glow = (.75 + .25 * smooth(span(t, .3, 2.6))) * (1 - desc);
    F.hall(ctx, v, t, { pool: slide * (1 - desc) });
    const netO = netOpts(t);
    const dishO = { glow: lerp(.9, .55, desc), chip: lerp(1, .5, desc), electrodes: lerp(.6, .25, desc), rim: lerp(1, .7, desc), a: t >= tDesc0 ? 0 : 1 };
    const out = F.rack(ctx, v, t, { open: F.OPEN, slide, glow, net: netO, dishO, seam: 1 });
    feeding(ctx, t, v, out);
    screen(ctx, t, v);
    you(ctx, t, v);
    location(ctx, t, v);
    if (t >= tDesc0) {                                         // the swing: the aisle sinks into night, the dish stays (drawn on top)
      if (dark > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = dark; night(ctx); ctx.restore(); }
      const m = out.dish && out.dish.map; if (m) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.dish(ctx, t, m, { ...dishO, a: 1, net: netO }); ctx.restore(); }
    }
  }
  // the net through the whole chunk: alive (sparks), answers the drop in a wave, then (field) rewinds
  function netOpts(t) {
    const lit = .55 + .45 * smooth(span(t, .4, 2.4));
    const fire = (i) => { const k = (t - tLand - dist[i] * .75) / .11; return t > tLand - .1 && k > -3 && k < 3 ? Math.exp(-k * k) : 0; };
    const g = 1 - .74 * sineIO(span(t, a.start, a.start + 1.9));
    return { lit, ambient: 1 - smooth(span(t, a.start - .4, a.start + .3)), fire, w: 1.25, grow: g };
  }

  // ---- you: in the aisle with your phone; the same net glows inside your hood; you look up at the rack on "But these"
  function you(ctx, t, v) {
    const look = lerp(-.6, .3, sineIO(span(t, a.but - .2, a.but + .9))) + .04 * Math.sin(t * .7);
    const br = .02 * Math.sin(t * 1.6);
    const down = sineIO(span(t, a.but + .1, a.but + 1.1));     // the phone sinks a little as you look up at the rack
    let hd = null;
    const p = bill(ctx, v, YOU.X, 0, YOU.Z, () => {
      ctx.scale(1, 1 + .006 * Math.sin(t * 1.6));
      const hands = E.du(ctx, 0, 0, YOU.h, { dir: 1, view: 'side', look, light: 1, armR: [lerp(.22, .12, down) + br, lerp(2.3, 1.7, down)], armL: [lerp(.12, .05, down) - br, lerp(2.2, 1.6, down)] });
      // the phone: a small cool screen in the hand, tilted toward the face (its light on the hood)
      ctx.save(); ctx.translate(hands.R[0] + 14, hands.R[1] - 30); ctx.rotate(.35 - .25 * down);
      halo(ctx, 0, 0, 240, .3, COOL.edge, COOL.core);
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.roundRect(-34, -62, 68, 124, 12); ctx.fill();
      ctx.fillStyle = E.rad(ctx, 0, -20, 110, [[0, COOL.core], [1, COOL.mid]]); ctx.beginPath(); ctx.roundRect(-28, -55, 56, 110, 8); ctx.fill();
      ctx.restore();
    });
    // the net in your head: the same NET with the same sparks as the dish, seen through the hood (a zoomed piece, additive)
    const hp = proj(v, YOU.X + (.03 - .012 * look) * YOU.h, .875 * YOU.h, YOU.Z);
    const on = .3 + .7 * bump(t, a.same - .2, 4.8);
    if (hp && p) {
      const r = .07 * YOU.h * hp[2];
      halo(ctx, hp[0], hp[1], r * 2.4, .3 * on, P.halo1, P.core1);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(hp[0], hp[1], r, 0, 6.2832); ctx.clip();
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .75;
      F.net(ctx, t, F.fieldMap(hp[0], hp[1], r * 2.3), { lit: on, ambient: 1, w: .9, nSparks: 9 });
      ctx.restore();
    }
  }

  // ---- the label on the rack: a line from its top corner, SINGAPORE / DATA CENTRE (wipe in from below on "Singapore")
  function location(ctx, t, v) {
    const u = F.rise(span(t, a.sing - .2, a.sing + .6)) * (1 - expoIn(span(t, a.someone - .5, a.someone + .1)));
    if (u <= 0) return;
    const p = proj(v, F.RACK.hw, 1820, 0); if (!p) return;
    const x1 = p[0] + 70, y1 = p[1] - 70;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    F.rule(ctx, p[0] + 6, p[1] - 6, x1, y1, smooth(clamp(u * 1.6)), { w: 2 });
    ctx.strokeStyle = rgba(P.halo1, .6 * u); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + 220 * expoOut(u), y1); ctx.stroke();
    F.maskLine(ctx, [['SINGAPORE', 0]], x1 + 4, y1 - 14, 30, u, { serif: false, weight: 600, col: P.cream, glow: false });
    F.maskLine(ctx, [['DATA CENTRE', 0]], x1 + 4, y1 + 30, 18, F.rise(span(t, a.sing, a.sing + .8)) * (u > 0 ? 1 : 0) * (1 - expoIn(span(t, a.someone - .5, a.someone + .1))), { serif: false, weight: 600, col: P.halo2, glow: false });
    ctx.restore();
  }

  // ---- feeding: a gloved hand lowers a pipette over the dish, one drop falls, the net answers in a wave from the landing point
  function feeding(ctx, t, v, out) {
    const lo = sineIO(span(t, a.every - .3, a.someone + .1)), up = expoIn(span(t, tLand + .4, tLand + 1.5));
    if (lo <= 0 || up >= 1) { ripple(ctx, t, out); return; }
    const tipY = DISH.Y + lerp(1700, 250, lo) + 1500 * up;
    const dx = DISH.X + dropUV[0] * DISH.R, dz = DISH.Z + dropUV[1] * DISH.R;
    bill(ctx, v, dx, tipY, dz, () => F.feeder(ctx, t, {}));
    // the drop: grows at the tip, falls (expo-in), splashes
    const form = smooth(span(t, a.someone + .05, a.feeds + .05)), fall = span(t, a.feeds + .02, tLand);
    if (form > 0 && fall < 1) {
      const y = lerp(tipY, DISH.Y + 6, expoIn(fall));
      bill(ctx, v, dx, y, dz, (s) => { const r = 11 * form; halo(ctx, 0, -r, r * 6, .6, P.halo1, P.core0); ctx.fillStyle = mixHex(P.core0, COOL.core, .3); ctx.beginPath(); ctx.ellipse(0, -r, r * (1 - .25 * fall), r * (1 + .5 * fall), 0, 0, 6.2832); ctx.fill(); });
    }
    ripple(ctx, t, out);
  }
  function ripple(ctx, t, out) {
    const q = span(t, tLand, tLand + 1.1); if (q <= 0 || q >= 1 || !out.dish) return;
    const m = out.dish.map;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    for (const [k, d] of [[0, 0], [1, .16]]) { const qq = clamp((q - d) / (1 - d)); if (qq <= 0) continue; ringAt(ctx, m, dropUV[0], dropUV[1], .05 + .55 * expoOut(qq)); ctx.strokeStyle = rgba(P.halo0, .55 * (1 - qq) * (k ? .6 : 1)); ctx.lineWidth = 2.2; ctx.stroke(); }
    ctx.restore();
  }

  // ---- the screen in the aisle: dark, powers on as the camera arrives, plays C1 (ORIGINAL FOOTAGE), darkens; three glyphs struck
  function screen(ctx, t, v) {
    const r = F.monitor(ctx, v, t, MON.X, MON.Y, MON.Z, MON.w);
    if (!r || r[2] < 8) return;
    const on = smooth(span(t, c1.start - .5, c1.start + .05)) * (1 + .25 * bump(t, c1.start - .55, .2));
    if (on <= 0) return;
    const dk = smooth(span(t, c1.end - .1, c1.end + .45));
    F.clipPlate(ctx, t, T, 'C1', { rect: r, on: Math.min(1, on), dark: dk, credits: true });
    // No hands. No eyes. No reward. — one glyph per word in the dark screen, each struck through a beat later
    if (dk > 0) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(r[0], r[1], r[2], r[3]); ctx.clip();
      [['hand', a.hands], ['eye', a.eyes], ['star', a.reward]].forEach(([k, tk], i) => {
        const u = span(t, tk - .2, tk + .45); if (u <= 0) return;
        const s = r[2] * .14, x = r[0] + r[2] * (.3 + .2 * i), y = r[1] + r[3] * .5 + (1 - expoOut(u)) * r[3] * .12;
        halo(ctx, x, y, s * 1.4, .25 * expoOut(u), P.halo0, P.core1);
        F.glyph(ctx, k, x, y, s, { a: smooth(clamp(u * 2)), strike: expoOut(span(t, tk + .32, tk + .7)) });
      });
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------------------------------------------------------------- 2D: the dish field
  function field(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    night(ctx);
    const cellsU = span(t, a.start + 1.2, a.start + 2.1);     // the somas become round cells (the rewound net's last state)
    const netO = netOpts(t);
    F.dish(ctx, t, FM, { glow: .55, chip: .5, electrodes: .25, rim: .7, net: cellsU < 1 ? { ...netO, lit: netO.lit * (1 - smooth(cellsU)) } : false });
    head(ctx, t);
    if (cellsU > 0) cells(ctx, t, cellsU);
    tube(ctx, t);
    ctx.restore();
  }
  // the head beside the dish: rises on "grew up inside a head" (its own net gold from the bottom), sinks on "didn't even start out"
  function head(ctx, t) {
    const up = expoOut(span(t, a.head - .35, a.head + .9)), dn = expoIn(span(t, a.start - .3, a.start + .6));
    if (up <= 0 || dn >= 1) return;
    const y = HEADC.y + (1 - up) * HEADC.h * 1.1 + dn * HEADC.h * 1.1 + 6 * Math.sin(t * .9);
    halo(ctx, HEADC.x - 20, y - HEADC.h * .62, HEADC.h * .55, .3 * up * (1 - dn), P.halo1, P.core1);
    F.creature(ctx, 'head', HEADC.x, y, HEADC.h, { fill: 0 });
    // its own net (the cells that grew up inside it), a zoomed piece of the same NET, clipped to the skull
    const hx = HEADC.x + .01 * HEADC.h, hy = y - .66 * HEADC.h, hr = .27 * HEADC.h, nl = smooth(span(t, a.head + .1, a.head + 1.2));
    if (nl > 0) { ctx.save(); ctx.beginPath(); ctx.arc(hx, hy, hr, 0, 6.2832); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
      F.net(ctx, t + 3.1, F.fieldMap(hx, hy, hr * 2.1), { lit: nl * (1 - dn), ambient: 1, w: 1.1, grow: lerp(.4, 1, nl) }); ctx.restore(); }
    // "These never did": a thin cool tick across the gap head → dish (the dish never had one)
    const nv = bump(t, a.never - .1, 1.4);
    if (nv > 0) { ctx.strokeStyle = rgba(COOL.mid, .5 * nv); ctx.lineWidth = 2; ctx.setLineDash([10, 12]); ctx.beginPath(); ctx.moveTo(HEADC.x - HEADC.h * .42, y - HEADC.h * .55); ctx.lineTo(FIELD.cx + FIELD.r * 1.04, FIELD.cy - 20); ctx.stroke(); ctx.setLineDash([]); }
  }
  // the somas as cells: gold → cool round blood cells, a slow drift; all but the hero stream back into the tube; the hero comes to the
  // centre, grows, and gets its clock (hands turning backward = CLOCK_PLATE.hand)
  function cells(ctx, t, cellsU) {
    const cool = smooth(span(t, a.start + 1.6, a.blood + .2));
    const r0 = FIELD.r * .016;
    NET.somas.forEach((s, i) => {
      if (i === HERO) return;
      const [x0, y0] = FM(s[0], s[1]), ph = PH[i];
      const dx = 6 * Math.sin(t * .5 + ph[0]), dy = 6 * Math.sin(t * .43 + ph[1]);
      let x = x0 + dx, y = y0 + dy, r = lerp(r0, 15, sineIO(cellsU)), al = 1;
      const f = flowT[i] != null ? span(t, flowT[i], flowT[i] + 1.05) : 0;
      if (f >= 1) return;
      if (f > 0) {                                             // drawn into the tube along an arc (accelerating, shrinking at the mouth)
        const e = expoIn(f), mx = (x + mouth[0]) / 2, my = Math.min(y, mouth[1]) - 160;
        x = lerp(lerp(x, mx, e), lerp(mx, mouth[0], e), e); y = lerp(lerp(y, my, e), lerp(my, mouth[1] + 30, e), e); r *= 1 - .55 * smooth(span(f, .7, 1)); al = 1 - smooth(span(f, .9, 1));
      }
      F.cell(ctx, t, x, y, r, { kind: 'blood', warm: 1 - cool, seed: i, a: al });
    });
    // the hero
    const [hx0, hy0] = FM(NET.somas[HERO][0], NET.somas[HERO][1]);
    const go = sineIO(span(t, a.make + .3, a.turn - .1));
    const x = lerp(hx0 + 6 * Math.sin(t * .5), CLOCK_PLATE.cx, go), y = lerp(hy0 + 6 * Math.sin(t * .43), CLOCK_PLATE.cy, go);
    const r = lerp(lerp(r0, 15, sineIO(cellsU)), CLOCK_PLATE.cellR, go);
    const warm = lerp(1 - cool, 0, go) + CLOCK_PLATE.warm * smooth(span(t, a.turn + .5, a.end - .6));
    const ck = span(t, a.turn - .15, a.turn + 1.35);
    if (go > 0) halo(ctx, x, y, r * 2.6, .25 * bump(t, a.make + .3, a.turn - a.make), P.halo1, P.core1);
    F.cell(ctx, t, x, y, r, { kind: 'blood', warm, clock: ck, clockR: CLOCK_PLATE.clockR, hand: CLOCK_PLATE.hand(t), seed: go > .99 ? 0 : HERO * (1 - go) });
  }
  // the tube: rises from below on "blood sample" (where the head was), takes the stream, sinks on "turn back"
  function tube(ctx, t) {
    const up = expoOut(span(t, a.blood - .5, a.blood + .7)), dn = expoIn(span(t, a.turn - .4, a.turn + .7));
    if (up <= 0 || dn >= 1) return;
    const y = VIAL.y + (1 - up) * (VIAL.h * 1.6) + dn * VIAL.h * 1.6 + 5 * Math.sin(t * 1.1);
    const taken = rank.filter((i) => t > flowT[i] + 1.0).length / rank.length;
    halo(ctx, VIAL.x, y - VIAL.h * .45, VIAL.h * .7, .22 * up, P.halo1, P.core1);
    F.vial(ctx, t, VIAL.x, y, VIAL.h, { fill: .6 + .18 * taken, label: 'DONOR' });
  }
}
