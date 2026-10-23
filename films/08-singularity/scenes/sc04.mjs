// Film 8 · c04 · your compass: North and East (VO 03a, C3, 03b, Q2; 208.16 → 277.76 s) · B1. Binding shot list: m1/bild/shots.md §8 c04.
// Worlds, joined without a cut: YOUR sheet (out of the window glass) → the tiny ink window = the real lit window (the light) → the headland in
// time-lapse → blue hour, the trainer → through its rear window into the cockpit → the windscreen = C3 (frame carrier) → back out of the rear
// window, the night flight, the tracks → into the lit window = out of the ink window on the sheet → the east point's light = the hall's globe →
// the hall, the queue, the kite → out of the east window onto the pre-dawn beach, the mirror → the kite string = Q2's line → plate `line` cream.
//
// shot  | VO (accent)                                         | image                                                       | camera
// ------+-----------------------------------------------------+-------------------------------------------------------------+---------------------------
// 04.01 | NORTH first.                                        | out of the glass, down to the sheet: the pen re-inks N, a small N | pull back + tilt down
// 04.02 | What MATTERS to you.                                | the pen draws the house with one window; it lights; push in | push (log)
// 04.03 | When EVERYTHING CHANGES … what WILL CHANGE.         | out of the real window: the night headland, time-lapse round it | pull back, orbit
// 04.04 | It's what WON'T.                                    | everything races except the lit window                       | push toward it
// 04.05 | … what you can BUILD ON.                            | new rooms rise stone by stone beside it, the window at the heart | pull back
// 04.06 | … HOLOCAUST … HEADING … FLIGHT INSTRUCTOR.          | tilt up: blue hour, the trainer; chase into its rear window; the cockpit from behind, the hand points at the dial | tilt, chase, push
// 04.07 | C3 Frankl                                           | out of the windscreen (frame carrier) and back into it       | —
// 04.08 | Your values are that HEADING.                       | out of the rear window: night over the sea, an amber line from the nose to one star | pull back 1.2 s
// 04.09 | The WIND still blows.                               | wind and scud rush in from the left; the plane yaws into it, the line holds | follow
// 04.10 | You just DRIFT LESS.                                | two tracks: the dotted downwind curve, the straight one back to the lit window | pull back over the headland
// 04.11 | THEN:                                               | down the track into the lit window, out of the ink window: N glows; the pen goes to E | push, pull back
// 04.12 | what should you LEARN … LAST?                       | push into the east point's light → out of the hall's globe: the split-flap board | push, pull back
// 04.13 | Not what the MARKET wants.                          | the crowd surges into one queue racing to one lit door       | slow push
// 04.14 | Whatever PULLS you.                                 | one steps out: a paper kite tugs; it leads out of an east window | pan, follow through the glass
// 04.15 | SHANNON VALLOR …                                    | the pre-dawn beach, the mirror pane (label)                  | tilt down, settle
// 04.16 | … it learns from YESTERDAY.                         | the walker passes the mirror: it shows only the dark behind, the footprints | drift
// 04.17 | Who we want to BECOME …                             | the walker turns east; the dawn rim brightens; the kite lifts | turn
// 04.18 | CURIOSITY … doesn't EXPIRE.                         | the kite climbs into the first gold; the walker runs; tilt along the string until it is one line | tilt up
// 04.19 | Q2 Gerjuoy                                          | the card; the quote lifts out, the line stays (= plate `line` cream) | —
import { clamp, canvas } from '../engine.mjs';
import { ready, track, camera, eoX, eiX, sio, u01, mixHex } from '../lib/s8_kit.mjs';
import { drawSky, prepareSky, skyDir } from '../lib/s8_sky.mjs';
import { drawSea } from '../lib/s8_sea.mjs';
import { hand as handoff, SKY0 } from '../lib/handoff4.mjs';
import { label, quoteCard, clip } from '../lib/s8_card.mjs';
import { DESK, room, sheet, sheetCorners, book, cup, penHand } from '../lib/s8_desk.mjs';
import { inkRose } from '../lib/s8_rose.mjs';
import { wind as windStreaks } from '../lib/s8_cloud.mjs';
import { bigStar } from '../lib/s8_c03_sea.mjs';
import { lightIn, lightDisc, HL, winCentre, winPoly, headland, plane, planeL, REAR, cockpit, WSRECT, hall, HALL, GLOBES, beachGround, prints, mirror, MIRROR, walker, kite, glowLine, sandY } from '../lib/s8_c04_world.mjs';

export default async function (T, R) {
  const Hin = handoff('c03>c04', T), Hout = handoff('c04>c05', T);
  const A = (p, n) => T.S('03a', p, n), B = (p, n) => T.S('03b', p, n);
  const C3 = T.clip('C3'), Q2 = T.clip('Q2');
  const K = {
    b: Hin.b, north: A('North'), first: A('first'), what: A('What'), matters: A('matters'), you: A('you'), when: A('When'), everything: A('everything'),
    changes: A('changes'), will: A('will'), its: A("It's"), wont: A("won't"), because: A('Because'), build: A('build'), aMan: A('A man'), holo: A('Holocaust'),
    heading: A('heading'), flight: A('flight'), instructor: A('instructor'), survived: A('survived'),
    values: B('Your values'), heading2: B('heading'), theWind: B('The wind'), blows: B('blows'), youJust: B('You just'), drift: B('drift'), less: B('less'),
    then: B('Then'), learn: B('learn'), nobody: B('nobody'), skills: B('skills'), last: B('last'), not: B('Not'), market: B('market'), whatever: B('Whatever'),
    pulls: B('pulls'), shannon: B('Shannon'), she: B('She points'), yesterday: B('yesterday'), who: B('Who'), become: B('become'), curiosity: B('Curiosity'),
    skill: B('skill', 1), expire: B('expire'), end: Hout.a,
  };
  const mkTrack = (keys) => { const tr = [1, 2, 3, 4, 5, 6].map((i) => track(keys.map((k) => [k[0], i === 6 ? Math.log(k[i]) : k[i]]))); return (t) => camera({ x: tr[0](t), y: tr[1](t), z: tr[2](t), yaw: tr[3](t), pitch: tr[4](t), F: Math.exp(tr[5](t)) }); };
  const lookAt = (pos, tgt, F) => { const d = [tgt[0] - pos[0], tgt[1] - pos[1], tgt[2] - pos[2]]; return camera({ x: pos[0], y: pos[1], z: pos[2], yaw: Math.atan2(d[0], d[2]), pitch: Math.atan2(-d[1], Math.hypot(d[0], d[2])), F }); };
  const lerp = (a, b, u) => a + (b - a) * u, lerp3 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
  const angLerp = (a, b, u) => a + ((((b - a) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI) * u;

  // ================================================================ W1 · YOUR sheet (the same table as c03.18–c03.20)
  const SH = { x: .04, z: .0, w: .34, aspect: 16 / 9, rot: 0 };
  const shW = (px, py, h = 0) => { const K4 = sheetCorners(SH), u = px / 1920, v = py / (1920 / SH.aspect); const p = K4[0].map((_, i) => (1 - v) * ((1 - u) * K4[0][i] + u * K4[1][i]) + v * ((1 - u) * K4[3][i] + u * K4[2][i])); p[1] += .0006 + h; return p; };
  const BOOKS = [{ x: .5, z: -.13, w: .17, d: .24, th: .032, rot: -.18, col: '#2a3a5a' }, { x: .51, z: -.12, w: .16, d: .23, th: .028, rot: -.1, col: '#5a2a24', y: DESK.top + .032 }];
  const cupI = cup({ x: -.62, z: -.2 });
  const RO = { x: 960, y: 540, R: 300 };
  const WINP = (() => { const s = RO.R * .3, x = RO.x, y = RO.y - RO.R * .48; return [[x - .1 * s, y + .02 * s], [x + .12 * s, y + .02 * s], [x + .12 * s, y + .22 * s], [x - .1 * s, y + .22 * s]]; })();
  const WINc = [(WINP[0][0] + WINP[1][0]) / 2, (WINP[0][1] + WINP[2][1]) / 2];
  const ETIP = [RO.x + RO.R * 1.18, RO.y];
  K.n0 = K.north + .02; K.n1 = K.n0 + .5; K.l0 = K.n1 + .02; K.l1 = K.l0 + .35;           // re-ink N, the letter N
  K.i0 = K.what - .3; K.i1 = K.matters + .3; K.lit = K.i1 + .05;                            // the house icon, its window lights
  K.td = K.lit + .1; K.sw1 = K.when - .12;                                                  // top-down on the window; into the light
  K.sw2 = K.then + .72;                                                                     // out of the ink window (back from the headland)
  K.e0 = K.learn + .02; K.e1 = K.e0 + .35; K.elit = K.nobody - .1; K.etd = K.elit + .25; K.sw3 = K.skills - .2;
  const roseO = (t) => ({ ...RO, ring: 1, cross: 1, points: [1, 1, 1, 1], letters: [u01(t, K.l0, K.l1), u01(t, K.e0, K.e1), 0, 0], icons: [u01(t, K.i0, K.i1), 0, 0, 0], lit: [t > K.sw2 ? 1 : 0, sio(u01(t, K.elit, K.elit + .3)), 0, 0], t });
  const plateAffine = (C) => { const p0 = C.P(...shW(960, 540)), px = C.P(...shW(1010, 540)), py = C.P(...shW(960, 590)); if (!p0 || !px || !py) return null; const a = [(px[0] - p0[0]) / 50, (px[1] - p0[1]) / 50], b = [(py[0] - p0[0]) / 50, (py[1] - p0[1]) / 50]; return [a[0], a[1], b[0], b[1], p0[0] - 960 * a[0] - 540 * b[0], p0[1] - 960 * a[1] - 540 * b[1]]; };
  const toScr = (M, p) => [M[0] * p[0] + M[2] * p[1] + M[4], M[1] * p[0] + M[3] * p[1] + M[5]];
  let PEN = null;
  const sheetItem = { x: SH.x, z: SH.z, drawItem: (ctx, t, C) => {
    sheet(ctx, t, C, { ...SH, res: 1, n: 6 });
    const M = plateAffine(C); if (!M) return;
    ctx.save(); ctx.setTransform(...M);
    const r = inkRose(ctx, t, roseO(t)); PEN = r.pen;
    if (t >= K.n0 && t < K.n1 + .05) { const v = u01(t, K.n0, K.n1); const r2 = inkRose(ctx, t, { ...RO, ring: 0, cross: 0, points: [v, 0, 0, 0], seed: 3 }); if (v < 1) PEN = r2.pen; }
    ctx.restore();
    // the house window: the light (from the moment it lights) seen through it
    if (t >= K.lit) { const P = WINP.map((p) => C.P(...shW(p[0], p[1], .0001))); if (P.every(Boolean)) lightIn(ctx, t, P.map((p) => [p[0], p[1]]), { tone: 'lamp' }); }
    PEN = PEN ? toScr(M, PEN) : null;
  } };
  const penOn = (t) => sio(u01(t, K.b + .1, K.n0)) * (1 - sio(u01(t, K.i1 + .05, K.i1 + .5))) + sio(u01(t, K.sw2 + .5, K.e0)) * (1 - sio(u01(t, K.e1 + .05, K.e1 + .45)));
  const lookFrom = (P, d, yaw, pitch) => [P[0] - Math.sin(yaw) * Math.cos(pitch) * d, P[1] + Math.sin(pitch) * d, P[2] - Math.cos(yaw) * Math.cos(pitch) * d];
  const NT = shW(960, 186), WC = shW(...WINc), EC = shW(...ETIP);
  const camA = mkTrack([
    [K.b, .27, 1.66, .30, 0, -.25, 1400],
    [K.b + .45, .22, 1.56, .0, 0, .3, 1380],
    [K.n0 + .45, ...lookFrom(NT, .5, .04, 1.02), .04, 1.02, 1360],
    [K.l1 + .2, ...lookFrom(NT, .42, .02, 1.15), .02, 1.15, 1380],
    [K.i0 + .3, ...lookFrom(WC, .34, 0, 1.32), 0, 1.32, 1400],
    [K.td, WC[0], WC[1] + .15, WC[2], 0, Math.PI / 2, 1400],
  ]);
  const hW = (t, h0, h1, t0, t1, ease) => Math.exp(Math.log(h0) + (Math.log(h1) - Math.log(h0)) * ease(u01(t, t0, t1)));
  const topCam = (P, h) => { const y = Math.max(h, .06); return camera({ x: P[0], y: P[1] + y, z: P[2], yaw: 0, pitch: Math.PI / 2, F: 1400 * y / h }); };   // very close = a long lens from 6 cm (the near plane)
  const camW1a = (t) => (t < K.td ? camA(t) : topCam(WC, hW(t, .15, .0017, K.td, K.sw1 - .1, (u) => eiX(u))));
  const camB = mkTrack([
    [K.sw2 + .5, WC[0], WC[1] + .3, WC[2], 0, Math.PI / 2, 1400],
    [K.e0 + .15, ...lookFrom(shW(1150, 500), .4, 0, 1.25), 0, 1.25, 1380],
    [K.elit, ...lookFrom(EC, .36, 0, 1.38), 0, 1.38, 1400],
    [K.etd, EC[0], EC[1] + .26, EC[2], 0, Math.PI / 2, 1400],
  ]);
  const camW1b = (t) => {
    if (t < K.sw2 + .5) return topCam(WC, hW(t, .0023, .3, K.sw2, K.sw2 + .5, (u) => eoX(u)));
    if (t < K.etd) return camB(t);
    return topCam(EC, hW(t, .26, .005, K.etd, K.sw3, (u) => eiX(u)));
  };
  function frameW1(ctx, t, C) {
    room(ctx, t, C, { items: [sheetItem, cupI, ...BOOKS.map((b) => book(b))], lampKind: 'oil', glassPane: true, open: false, person: {}, reflect: { a: 1, ring: 1 } });
    const on = penOn(t);
    if (on > 0) { const pp = PEN || C.P(...shW(1300, 700)); const lp = C.P(...DESK.lamp), k = C.P(...shW(960, 540))?.[2] ?? 2000; if (pp) penHand(ctx, t, pp[0] + 300 * (1 - on), pp[1] - 260 * (1 - on), .17 * k / 150, { lift: PEN ? 0 : .6, light: lp ? [lp[0] - pp[0], lp[1] - pp[1]] : [-.6, -1] }); }
  }

  // ================================================================ W2 · the headland at night (house coords HL), time-lapse
  const LAPSE = (() => { const t0 = K.sw1, t1 = K.aMan + 1.2, dt = 1 / 120, sp = (t) => 2.6 * sio(u01(t, t0, t0 + 1.0)) * (1 - sio(u01(t, K.build + .4, K.aMan + .2))) + .25, tab = [0]; for (let t = t0; t < t1; t += dt) tab.push(tab[tab.length - 1] + sp(t) * dt); return (t) => { const i = clamp((t - t0) / dt, 0, tab.length - 1); const a = Math.floor(i); return tab[a] + (tab[Math.min(tab.length - 1, a + 1)] - tab[a]) * (i - a); }; })();
  const buildOf = (t) => sio(u01(t, K.because + .2, K.build + .7));
  const duskOf = (t) => sio(u01(t, K.build + .4, K.aMan + .6));
  const WCN = winCentre();
  const camH = mkTrack([
    [K.sw1, WCN[0], WCN[1], WCN[2] - .45, 0, 0, 1400],
    [K.sw1 + .6, 0, WCN[1] + .15, -5.5, 0, .02, 1400],
    [K.changes + .3, -4, 16.6, -16, .2, .03, 1300],
    [K.will - .2, -10, 17, -24, .36, .02, 1200],
    [K.its - .1, -6, 16.8, -28, .2, .02, 1200],
    [K.wont + .4, -2.5, 16.2, -15, .1, .03, 1300],
    [K.because + .4, -1, 16.0, -10.5, .05, .03, 1350],
    [K.build + .35, 3, 17.0, -16, -.15, .06, 1250],
    [K.aMan, 2, 17, -18, -.08, .0, 1250],
    [K.survived + .2, 2, 16.6, -18.5, -.05, -.8, 1200],
  ]);
  // the trainer at blue hour: from behind the camera, over the headland, away north; the chase into its rear window
  const P1 = (t) => ({ pos: [-1, HL.y + 30, -30 + 22 * (t - K.aMan)], head: 0, pitch: .04, roll: .04 * Math.sin(t * .9) });
  const N_REAR = [0, .75, -.66], RC = [0, .79, -.66], DSW = .48;
  const rearCam = (P, d, F = 1400) => { const pos = planeL(P, 0, RC[1] + N_REAR[1] * d, RC[2] + N_REAR[2] * d); return lookAt(pos, planeL(P, ...RC), F); };
  K.chase0 = K.holo + .05; K.swIn = K.heading - .3;
  const camChase = (t) => {
    const g = camH(K.chase0), P = P1(t), u = u01(t, K.chase0, K.swIn), e = sio(u), d = Math.exp(Math.log(30) + (Math.log(DSW) - Math.log(30)) * eiX(u)), tc = rearCam(P, d);
    const pos = lerp3([g.x, g.y, g.z], [tc.x, tc.y, tc.z], e), lk = lookAt(pos, planeL(P, ...RC), 1400), w = sio(clamp(u * 1.6));
    return camera({ x: pos[0], y: pos[1], z: pos[2], yaw: angLerp(g.yaw, lk.yaw, w), pitch: lerp(g.pitch, lk.pitch, w), F: lerp(g.F, 1400, e) });
  };
  const camW2 = (t) => (t < K.chase0 ? camH(t) : camChase(t));
  function frameW2(ctx, t, C) {
    const lapse = LAPSE(t), dusk = duskOf(t);
    headland(ctx, t, C, { lapse, build: buildOf(t), dusk, skyCam: (lp) => camera({ x: C.x, y: C.y, z: C.z, yaw: C.yaw + .22 * lp, pitch: C.pitch, F: C.F }) });
    if (t > K.aMan - .2) plane(ctx, t, C, P1(t), { dark: .3, glow: .7, inside: (c, S) => insideView(c, t, S, { night: 0 }) });
  }

  // ================================================================ the cockpit (frame space) seen through the rear window, then alone
  const bbox = (S) => { const xs = S.map((p) => p[0]), ys = S.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  const mapOf = (S) => { const b = bbox(S); return { Z: (b[2] - b[0]) / .9 / 1920, bx: (b[0] + b[2]) / 2, by: (b[1] + b[3]) / 2 }; };
  const pointOf = (t) => sio(u01(t, K.heading - .15, K.heading + .55)) * (1 - sio(u01(t, C3.start - .6, C3.start - .1)));
  const cockOpts = (t) => ({ night: t > C3.start ? 1 : 0, point: pointOf(t), hdg: .12 * Math.sin(t * .4), bank: .02 * Math.sin(t * .35) });
  function insideView(ctx, t, S, o) { const m = mapOf(S); ctx.save(); ctx.translate(m.bx, m.by); ctx.scale(m.Z, m.Z); ctx.translate(-960, -540); cockpit(ctx, t, { ...cockOpts(t), ...o }); ctx.restore(); }
  const P2 = (t) => ({ pos: [-20, 160, 350 + 40 * (t - C3.end)], head: -.14 * sio(u01(t, K.theWind + .3, K.blows + .2)), pitch: .02, roll: .05 * Math.sin(t * .8) - .08 * sio(u01(t, K.theWind + .3, K.blows)) * (1 - sio(u01(t, K.youJust, K.less))) });
  K.swOut = K.values + .25;
  let MI = null, MO = null;
  const initMaps = () => { if (MI) return; const pi = P1(K.swIn), ci = rearCam(pi, DSW); MI = mapOf(projRear(ci, pi)); const po = P2(K.swOut), co = rearCam(po, DSW); MO = mapOf(projRear(co, po)); };
  const projRear = (C, P) => REAR.map(([a, b, c]) => C.P(...planeL(P, a, b, c))).map((p) => [p[0], p[1]]);
  const WSC = [WSRECT[0] + WSRECT[2] / 2, WSRECT[1] + WSRECT[3] / 2], ZW = 1.25;
  let icamT = null;
  const icam = (t) => {
    initMaps();
    if (!icamT) {
      const keys = [[K.swIn, MI.Z, MI.bx, MI.by], [K.flight - .4, 1.16, 960, 600], [K.instructor + .3, 1.2, 960, 640], [C3.start - .05, ZW, 960, 540 + (540 - WSC[1]) * ZW], [C3.end + .05, ZW, 960, 540 + (540 - WSC[1]) * ZW], [C3.end + .7, 1.08, 960, 610], [K.swOut, MO.Z, MO.bx, MO.by]];
      icamT = [1, 2, 3].map((i) => track(keys.map((k) => [k[0], k[i]])));
    }
    return { Z: icamT[0](t), bx: icamT[1](t), by: icamT[2](t) };
  };
  function frameCock(ctx, t) { const m = icam(t); ctx.save(); ctx.fillStyle = '#05060c'; ctx.fillRect(0, 0, 1920, 1080); ctx.translate(m.bx, m.by); ctx.scale(m.Z, m.Z); ctx.translate(-960, -540); cockpit(ctx, t, cockOpts(t)); ctx.restore(); }
  const wsRect = (t) => { const m = icam(t); return [m.bx + (WSRECT[0] - 960) * m.Z, m.by + (WSRECT[1] - 540) * m.Z, WSRECT[2] * m.Z, WSRECT[3] * m.Z]; };

  // ================================================================ W3 · the night flight, the heading line, the wind, the two tracks
  const STARH = skyDir(0, .1);
  K.ov0 = K.youJust - .1; K.ov1 = K.then;   // the pull back over the headland
  const OV = { pos: [0, 54.3, -69.9], yaw: 0, pitch: .18, F: 900 };
  const extKeys = [[K.swOut, RC[1] + N_REAR[1] * DSW, RC[2] + N_REAR[2] * DSW, RC[1], RC[2], 1400], [K.swOut + .3, 1.75, -2.0, .85, .2, 1400], [K.swOut + .65, 2.35, -5.5, 1.0, 2.5, 1400], [K.heading2 + .1, 2.6, -16, 1.2, 6, 1400], [K.blows + .4, 3.0, -21, 1.0, 8, 1350], [K.ov0, 3.6, -25, 1.0, 9, 1300]];
  const tExt = [1, 2, 3, 4, 5].map((i) => track(extKeys.map((k) => [k[0], i === 5 ? Math.log(k[i]) : k[i]])));
  const camPlane = (t) => { const P = P2(t), pos = planeL(P, 0, tExt[0](t), tExt[1](t)), tgt = planeL(P, 0, tExt[2](t), tExt[3](t)); return lookAt(pos, tgt, Math.exp(tExt[4](t))); };
  const camW3 = (t) => {
    if (t < K.ov0) return camPlane(t);
    if (t < K.ov1) { const a = camPlane(K.ov0), u = u01(t, K.ov0, K.ov1), e = sio(u); const pos = lerp3([a.x, a.y, a.z], OV.pos, e); return camera({ x: pos[0], y: pos[1], z: pos[2], yaw: angLerp(a.yaw, OV.yaw, e), pitch: lerp(a.pitch, OV.pitch, e), F: Math.exp(lerp(Math.log(a.F), Math.log(OV.F), e)) }); }
    // down the track into the lit window
    const u = u01(t, K.ov1, K.sw2), e = eiX(u), d = Math.exp(Math.log(77.7) + (Math.log(.45) - Math.log(77.7)) * e), a = .52 * (1 - e), pos = [WCN[0], WCN[1] + d * Math.sin(a), WCN[2] - d * Math.cos(a)];
    const lk = lookAt(pos, WCN, 1400), w = sio(clamp(u * 1.8));
    return camera({ x: pos[0], y: pos[1], z: pos[2], yaw: 0, pitch: lerp(OV.pitch, lk.pitch, w), F: Math.exp(lerp(Math.log(OV.F), Math.log(1400), sio(u))) });
  };
  // the scud: soft grey-blue clouds racing in from the left
  function scud(ctx, t, a) {
    if (a <= 0) return;
    ctx.save();
    for (let i = 0; i < 7; i++) { const sp = 700 + 260 * (i % 3), x = ((i * 433 + (t - K.theWind) * sp) % 2900) - 500, y = 160 + (i * 211) % 560, s = 120 + 70 * (i % 4);
      for (let j = 0; j < 5; j++) { const cx = x + (j - 2) * s * .55, cy = y + Math.sin(j * 1.7 + i) * s * .18, r = s * (.5 + .25 * Math.sin(j * 2.3 + i)); const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, `rgba(70,80,112,${.42 * a})`); g.addColorStop(1, 'rgba(70,80,112,0)'); ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, 2 * r, 2 * r); } }
    ctx.restore();
  }
  function frameW3(ctx, t, C) {
    const P = P2(t), lapse = 0;
    headland(ctx, t, C, { lapse, build: 1, dusk: 0 });
    const sp = bigStar(ctx, t, C, STARH, { a: 1, size: 3, seed: 4 });
    // the tracks behind (c04.10): the straight one from the window to the tail, the dotted downwind curve
    const tr = sio(u01(t, K.youJust - .2, K.drift + .4));
    if (tr > 0) {
      const tail = planeL(P, 0, .3, -4.4), N = 60, real = [], dots = [];
      for (let i = 0; i <= N; i++) { const v = i / N; if (v > tr) break; real.push(lerp3(tail, WCN, v)); }
      const sideP = [P.pos[0] + 420, P.pos[1] - 30, P.pos[2] - 160], mid = [WCN[0] + 60, WCN[1] + 70, WCN[2] + 200];
      for (let i = 0; i <= 90; i++) { const v = i / 90; if (v > tr) break; const a = lerp3(WCN, mid, v), b = lerp3(mid, sideP, v); dots.push(lerp3(a, b, v)); }
      const R = real.map((p) => C.P(...p)).filter(Boolean).map((p) => [p[0], p[1]]);
      glowLine(ctx, R, { a: tr });
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const p of dots) { const q = C.P(...p); if (!q) continue; const r = Math.max(1.5, Math.min(6, q[2] * 1.4)); ctx.fillStyle = `rgba(255,179,92,${.75 * tr})`; ctx.beginPath(); ctx.arc(q[0], q[1], r, 0, Math.PI * 2); ctx.fill(); } ctx.restore();
    }
    const r = plane(ctx, t, C, P, { dark: .7, glow: .4, inside: t < K.swOut + .6 ? (c, S) => insideView(c, t, S, { night: 1 }) : null });
    // the heading line: nose → the star
    const hu = eoX(u01(t, K.values + .5, K.heading2 + .2));
    if (hu > 0 && r.nose && sp) glowLine(ctx, [[r.nose[0], r.nose[1]], [lerp(r.nose[0], sp[0], hu), lerp(r.nose[1], sp[1], hu)]], { wk: .7 });
    const wa = sio(u01(t, K.theWind - .1, K.theWind + .5)) * (1 - sio(u01(t, K.youJust - .3, K.drift)));
    if (wa > 0) { windStreaks(ctx, t, { a: .4 * wa, dir: 1, speed: 1.4, n: 30 }); scud(ctx, t, wa); }
  }

  // ================================================================ W4 · the station hall → the pre-dawn beach (one world)
  const r0 = (() => { const r = []; let s = 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; for (let i = 0; i < 64; i++) r.push([rnd(), rnd(), rnd()]); return r; })();
  K.surge = K.not - .05; K.out0 = K.whatever; K.kite0 = K.whatever + .1; K.exitW = K.shannon - .1;
  const QV = 3.4, DOORZ = HALL.z1 - .3;
  const PEOPLE = r0.map(([a, b, c], i) => ({ x0: -9 + 18 * a, z0: 11 + 19 * b, h: 1.62 + .22 * c, slot: i, seed: 40 + i }));
  PEOPLE.sort((p, q) => q.z0 - p.z0).forEach((p, i) => { p.slot = i; });
  const YOU = PEOPLE[Math.floor(PEOPLE.length * .62)];
  const personAt = (p, t) => {
    if (t < K.surge) return { x: p.x0 + .08 * Math.sin(t * .7 + p.seed), z: p.z0, walk: null };
    const qz = DOORZ - p.slot * .62 + QV * 2.2 * (t - K.surge), qx = .35 * Math.sin(p.slot * 2.1);
    const d = Math.hypot(qx - p.x0, Math.min(qz, DOORZ) - p.z0), reach = clamp((t - K.surge) * 4.2 / Math.max(.5, d));
    const e = sio(reach), x = lerp(p.x0, qx, e), z = lerp(p.z0, Math.min(qz, DOORZ + 2), e);
    return { x, z, walk: (t - K.surge) * 9 + p.seed };
  };
  // the one who steps out: queue → right → the east door (x 14, z 21) → the beach
  const youPath = (t) => {
    if (t < K.out0) return personAt(YOU, t);
    const q = personAt(YOU, K.out0), u = u01(t, K.out0, K.out0 + 1.1), v = u01(t, K.out0 + 1.1, K.exitW);
    if (v <= 0) { const e = sio(u); return { x: lerp(q.x, 5.5, e), z: lerp(q.z, 17.5, e), walk: (t - K.out0) * 7 }; }
    return { x: lerp(5.5, 13.6, v), z: lerp(17.5, 20, v), walk: (t - K.out0) * 7 };
  };
  const hallKite = (t) => {   // tugging above the hand, then up and out through the east window
    const p = youPath(t), u = sio(u01(t, K.pulls - .1, K.exitW + .2));
    const near = [p.x + 1.2, HALL.y + 3.1 + .4 * Math.sin(t * 3), p.z + .8], out = [24, HALL.y + 14, 19.5], win = [14, HALL.y + 9, 19.5];
    return u < .6 ? lerp3(near, win, sio(u / .6)) : lerp3(win, out, sio((u - .6) / .4));
  };
  const camHall = mkTrack([
    [K.sw3, 0, 8.2, 9.3, 0, 0, 1400],
    [K.sw3 + .9, 0, 5.4, 2.2, 0, -.12, 1250],
    [K.not, 0, 3.6, 1.0, 0, -.08, 1250],
    [K.whatever, 0, 3.3, 5.0, .05, -.06, 1250],
    [K.pulls + .1, 3.0, 4.2, 8.5, .55, -.16, 1250],
    [K.pulls + .9, 9.0, 7.0, 15.5, 1.2, -.1, 1250],
    [K.exitW + .05, 15.5, 9.4, 19.0, 1.38, -.02, 1250],
    [K.shannon + .8, 30, 6, 15, .75, .1, 1250],
    [K.shannon + 1.8, 56, 2.6, 12, .32, .06, 1300],
    [K.she - .1, 57, 2.4, 15, .26, .05, 1300],
    [K.yesterday + .9, 58.5, 2.2, 17, .22, .04, 1300],
    [K.who + 1.2, 60, 2.0, 15, 1.05, -.02, 1300],
    [K.curiosity + .2, 61, 2.1, 17, 1.0, -.08, 1300],
    [K.skill + .2, 62, 2.6, 23, .85, -.28, 1250],
    [K.expire + .4, 62.5, 3.0, 27, .55, -.45, 1180],
    [Q2.start - .05, 63, 3.2, 30, SKY0.yaw, SKY0.pitch, SKY0.F],
  ]);
  // the beach walker: from the hall's side door down to the water, past the mirror, turning east, then running north along the waterline
  const WPTS = [[K.exitW, 44, 44], [K.she, 56.5, 37], [K.yesterday + .9, 62.6, 29.5], [K.who + .5, 65.2, 25.8], [K.curiosity, 65.6, 25.4], [K.skill, 68.6, 31], [Q2.start, 69.6, 47]];
  const wTr = [1, 2].map((i) => track(WPTS.map((k) => [k[0], k[i]])));
  const walkerAt = (t) => ({ x: wTr[0](t), z: wTr[1](t) });
  const runOf = (t) => sio(u01(t, K.curiosity, K.curiosity + .6));
  const stopOf = (t) => (t > K.who + .5 && t < K.curiosity ? 1 : 0);
  const lift = (t) => sio(u01(t, K.who + .5, K.become + 1.4)) * .35 + .65 * sio(u01(t, K.curiosity, K.expire + .6));
  const beachKite = (t) => { const w = walkerAt(t), l = lift(t); return [w.x + 4 + 26 * l, sandY(w.x) + 9 + 70 * l + .6 * Math.sin(t * 1.7), w.z + 3 + 10 * l]; };
  const dawnOf = (t) => (.22 + .3 * sio(u01(t, K.who, K.become + 1)) + .3 * sio(u01(t, K.curiosity, K.skill + .5))) * (1 - sio(u01(t, K.expire + .3, Q2.start - .1)));
  const mwOf = (t) => .4;
  function outsideWorld(ctx, t, C, o = {}) {
    const dawn = dawnOf(t);
    drawSky(ctx, t, C, { mw: mwOf(t), dawn, dawnAz: Math.PI / 2 + .15 });
    // the swell rows run parallel to the shore (the sea lies along +X here): draw the sea through the same view turned 90° (X,Z) → (−Z, X)
    drawSea(ctx, t, camera({ x: -C.z, y: C.y, z: C.x, yaw: C.yaw - Math.PI / 2, pitch: C.pitch, F: C.F }), { dawn });
    beachGround(ctx, t, C, { dawn });
    if (t < K.exitW - .5) return;
    // footprints, the mirror, the walker, the kite and its string
    const trail = []; for (let tt = K.exitW; tt < t - .25; tt += .32) { const a = walkerAt(tt), b = walkerAt(tt + .05), d = Math.hypot(b.x - a.x, b.z - a.z) || 1; trail.push([a.x, 0, a.z, (b.z - a.z) / d, (b.x - a.x) / d]); }
    prints(ctx, C, trail, 1);
    const w = walkerAt(t), ahead = walkerAt(t + .1), dirx = (C.P(ahead.x, 1, ahead.z)?.[0] ?? 0) - (C.P(w.x, 1, w.z)?.[0] ?? 0);
    const walkerDraw = (c, cam) => { const ww = walkerAt(t), ah = walkerAt(t + .1), dx = (cam.P(ah.x, 1, ah.z)?.[0] ?? 0) - (cam.P(ww.x, 1, ww.z)?.[0] ?? 0); return walker(c, t, cam, ww.x, ww.z, { dir: stopOf(t) ? 1 : dx >= 0 ? 1 : -1, phase: stopOf(t) ? 0 : t * (7 + 5 * runOf(t)), rim: dawnOf(t) }); };
    const mDepth = C.depth(MIRROR.x, 1, MIRROR.z), wDepth = C.depth(w.x, 1, w.z);
    const drawMirror = () => mirror(ctx, t, C, { camera, reflect: (c, _t, cam) => { prints(c, cam, trail, 1); walkerDraw(c, cam); } });
    let hand = null;
    if (mDepth > wDepth) { drawMirror(); hand = walkerDraw(ctx, C); } else { hand = walkerDraw(ctx, C); drawMirror(); }
    void dirx;
    const kp = beachKite(t);
    stringAndKite(ctx, t, C, hand, kp, { lit: dawnOf(t) });
    const lu = u01(t, K.shannon + .1, K.shannon + .7) - u01(t, K.she - .5, K.she - .1), mp = C.P(MIRROR.x, sandY(MIRROR.x) + 3.1, MIRROR.z);
    if (lu > 0 && mp) label(ctx, t, mp[0], mp[1], lu, 'SHANNON VALLOR', 'PHILOSOPHER', { dx: 70, len: 120 });
  }
  // the string from the hand to the kite; from the tilt on it straightens into one line across the frame (Q2's line)
  K.m0 = K.expire + .1;
  function stringAndKite(ctx, t, C, hand, kp, o = {}) {
    const kpS = C.P(...kp); if (!hand && !kpS) return;
    const N = 40, pts = [];
    const handW = (() => { const w = walkerAt(t); return [w.x + .35, sandY(w.x) + 1.1, w.z]; })();
    for (let i = 0; i <= N; i++) { const v = i / N, p = lerp3(handW, kp, v); p[1] -= 3.5 * Math.sin(Math.PI * v) * (1 - .6 * lift(t)); const q = C.P(...p); if (q) pts.push([q[0], q[1]]); }
    if (hand && pts.length) pts[0] = hand;
    const m = sio(u01(t, K.m0, Q2.start - .05));
    if (m > 0) {
      const L = pts.length; for (let i = 0; i < L; i++) { const target = [-40 + 2000 * i / (L - 1), 600 + 2 * Math.sin(t * .9)]; pts[i] = [lerp(pts[i][0], target[0], m), lerp(pts[i][1], target[1], m)]; }
      const cream = [['#e9dcc0', 26, .05], ['#e9dcc0', 10, .14], ['#e9dcc0', 3.2, .55], ['#fffaf0', 1.4, .95]], amber = [['#ffb35c', 22, .06], ['#ffb35c', 7, .2], ['#fff1d6', 2, .95], ['#fff1d6', 0, 0]];
      const cols = cream.map((c, i) => [mixHex(amber[i][0], c[0], m), lerp(amber[i][1], c[1], m), lerp(amber[i][2], c[2], m)]);
      glowLine(ctx, pts, { cols });
      const ke = pts[pts.length - 1]; if (m < .9) { ctx.save(); const kk = kite(ctx, t, camera({ x: 0, y: 0, z: 0, yaw: 0, pitch: 0, F: 1400 }), [(ke[0] - 960) / 1400 * 30, -(ke[1] - 540) / 1400 * 30, 30], { lit: o.lit }); void kk; ctx.restore(); }
      return;
    }
    glowLine(ctx, pts, {});
    if (kpS) kite(ctx, t, C, kp, { lit: o.lit });
  }
  function frameW4(ctx, t, C) {
    const crowdList = [];
    if (C.x < HALL.x1) {
      for (const p of PEOPLE) { if (p === YOU) continue; const s = personAt(p, t); if (s.z > DOORZ + .4) continue; crowdList.push({ x: s.x, z: s.z, h: p.h, seed: p.seed, walk: s.walk }); }
      if (t < K.exitW + .3) { const s = youPath(t); crowdList.push({ x: s.x, z: s.z, h: YOU.h, seed: YOU.seed, walk: s.walk, dress: { coat: '#2a1c22' } }); }
    }
    const r = hall(ctx, t, C, { flip: 1, door: 1, crowd: crowdList, outside: outsideWorld, after: (c, tt, cc) => {
      if (t < K.kite0 || t > K.exitW + 1) return;
      const s = youPath(t), feet = cc.P(s.x, HALL.y, s.z); if (!feet) return; const k = feet[2], hand = [feet[0] + 24 * k * 1.75 / 180 * 1.0, feet[1] - 98 * k * 1.75 / 180];
      const kp = hallKite(t), kq = cc.P(...kp); if (!kq) return;
      const N = 24, pts = []; const hw = [s.x + .3, HALL.y + 1.0, s.z]; for (let i = 0; i <= N; i++) { const v = i / N, p = lerp3(hw, kp, v); p[1] -= .8 * Math.sin(Math.PI * v); const q = cc.P(...p); if (q) pts.push([q[0], q[1]]); }
      if (pts.length) pts[0] = hand; glowLine(c, pts, { a: sio(u01(t, K.kite0, K.kite0 + .3)) }); kite(c, t, cc, kp, { lit: .4 });
    } });
    return r;
  }

  // ================================================================ the frame
  function frame(ctx, t) {
    if (t < K.sw1) { const C = camW1a(t); frameW1(ctx, t, C); return; }
    if (t < K.swIn) { frameW2(ctx, t, camW2(t)); return; }
    if (t < K.swOut) {
      if (t >= C3.start - .001 && t <= C3.end + .001) { frameCock(ctx, t); clip(ctx, t, T, 'C3', { carrier: 'frame', from: wsRect(C3.start), to: wsRect(C3.end) }); return; }
      frameCock(ctx, t); return;
    }
    if (t < K.sw2) { frameW3(ctx, t, camW3(t)); return; }
    if (t < K.sw3) { frameW1(ctx, t, camW1b(t)); const C = camW1b(t), ep = C.P(...EC), k = ep ? ep[2] : 1; if (t > K.elit && ep) lightDisc(ctx, t, ep[0], ep[1], Math.min(5000, k * .0186 * sio(u01(t, K.elit, K.elit + .3)) * (t > K.sw3 - .12 ? 3 : 1)), { tone: 'lamp' }); return; }
    if (t < Q2.start) {
      const C = camHall(t); frameW4(ctx, t, C);
      const u = u01(t, K.sw3, K.sw3 + .7); if (u < 1) { const g = C.P(...GLOBES[0]); if (g) lightDisc(ctx, t, g[0], g[1], u <= 0 ? 5000 : Math.max(g[2] * .6, 4400 * (1 - eoX(u)))); }
      return;
    }
    const u = Math.sin(Math.PI * clamp((t - Q2.start) / (Q2.end - Q2.start)));
    quoteCard(ctx, t, T, 'Q2', { lines: ["Tomorrow's illiterate will not be the man", "who can't read; he will be the man", 'who has not learned how to learn.'], name: 'HERBERT GERJUOY', source: 'QUOTED IN FUTURE SHOCK, 1970', at: [.25, .6, .95], line: { y: 600, style: 'cream', u: 1 }, sky: { yaw: SKY0.yaw + .05 * u, pitch: SKY0.pitch - .03 * u, F: SKY0.F * (1 + .04 * u) } });
  }
  prepareSky();
  await ready();
  return [
    { t: Hin.b, tr: 'cut', d: .1, draw: frame, print: Hin.print },
    { t: Q2.start, tr: 'cut', d: .1, draw: frame, print: Hout.print },
  ];
}
