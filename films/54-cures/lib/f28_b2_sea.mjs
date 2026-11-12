// Film 28 · B2 · THE WORLD OUTSIDE CASEY'S WINDOW: one 2.5D world from subscribe 1 to the light door of 5.11 (c07 tail, c08, c09).
//   7.12 the hills at night, a path of small lamps (thumbnail B), you set one down lit · 7.13 the path runs down to the sea, a ship light
//   goes out · No. 6: ships as strings of light with radio rings (the radio) · HOW MANY ARE DARK? · a satellite's radar picture grows out
//   of it (top-down: hulls, the broadcasts, ≈ 75 %, tracks to port, one that never returns, the zigzag, crew, RISK) and shrinks back ·
//   a ship switches its radio off · No. 5: a flat ring on the water · Look up ★ · the twin ring climbs to the charged layer (≈ 300 KM) ·
//   GPS beams tremble · down one beam to a night street with the arrow (GPS) · the bead reads the fingerprint (lamp 5) · two date tiles ·
//   C4 (NASA, mute) as a small plate in the sky over Hawaii · RESEARCH OUTPUT · the coast lights warm → into the lighthouse (light door).
// Cards: sky 40000 · far ridge 14000 · THE SEA CARD 9000 (horizon y 640, all of No. 6 and No. 5 live here) · far hills 5600 · mid hills
// 3800 · near hill 2600 (you + the first lamp). The camera is an aimPath on the sea card; the land leaves the frame to the left.
// Everything is drawn with E.card, so the whole world can also be seen through Casey's window (an OUTER screen transform).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
import * as B from './f28_b2_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const TAU = Math.PI * 2;
export const ZS = 9000, HOR = 640;
const ZN = 2600, ZM = 3800, ZF = 5600, ZR = 14000;
// the path of lamps: per card, points of the pale path and the lamps on it ([x, y, r])
const PATH = {
  [ZN]: { pts: [[600, 1150], [640, 1010], [720, 930], [860, 890], [960, 880]], lamps: [[700, 948, 13], [835, 897, 10]] },
  [ZM]: { pts: [[880, 860], [940, 812], [1010, 782], [1080, 760], [1130, 752]], lamps: [[930, 818, 8.5], [1010, 783, 7.4], [1085, 760, 6.4]] },
  [ZF]: { pts: [[1080, 694], [1150, 688], [1220, 694], [1290, 706], [1350, 720]], lamps: [[1110, 691, 5.6], [1180, 689, 5], [1250, 698, 4.5], [1318, 711, 4]] },
};
const DU = { x: 520, y: 912, h: 132 }, ORB = { r: 20 };
const TOWN = (() => { const r = prng(2828), a = []; for (let k = 0; k < 26; k++) a.push([-420 + r() * 900, 700 + r() * 26, 1.4 + r() * 1.6]); return a; })();
// No. 6 · ships on the sea card
const CARGO = [{ x: 2050, y: 702, s: 230, seed: 3 }, { x: 2700, y: 676, s: 170, seed: 5 }, { x: 2420, y: 660, s: 110, seed: 9 }];
const FISH = (() => { const r = prng(606), a = []; for (let k = 0; k < 9; k++) a.push({ x: 1880 + k * 110 + r() * 40, y: 672 + r() * 18, s: 46 + r() * 16, lit: k % 4 === 1, seed: k + 20 }); return a; })();
const SHIP0 = { x: 1610, y: 662, s: 70, seed: 11 };          // the ship far out in subscribe whose light goes out
// No. 6 · the radar picture (top-down, local 1600 × 900)
const BOATS = (() => { const r = prng(6006), a = []; for (let k = 0; k < 16; k++) a.push({ x: 380 + r() * 1100, y: 120 + r() * 680, ang: r() * TAU, s: 34 + r() * 14, lit: [2, 7, 11, 14].includes(k) }); return a; })();
const PORT = [205, 560], STAR = { x: 1380, y: 250 };
BOATS[5].x = STAR.x; BOATS[5].y = STAR.y; BOATS[5].lit = false; BOATS[5].ang = -.3;
// No. 5 · the tsunami, the layer, GPS, Hawaii
const RING0 = [2560, 712], LAYER = -360, ISLE = { x0: 3120, x1: 3760 }, LIGHTHOUSE = [3148, 612], STATION = [3478, 622];
const SATS = [[2350, -560], [3050, -620], [3700, -540]];
const STREET = E.catmull([[3236, 640], [3290, 634], [3350, 632], [3410, 628], [3448, 624]], 8);
const COASTL = (() => { const r = prng(505), a = []; for (let k = 0; k < 14; k++) a.push([3190 + k * 38 + r() * 14, 630 + r() * 12, 1.6 + r() * 1.2]); return a; })();

export function makeSea(T, a, K) {
  const tp = (a.elephant + a.elephantE) / 2 + .35;     // the light door's peak: into the lighthouse → out of the train's headlight
  // ---------------------------------------------------------------- camera (aimPath on the sea card)
  const KO = [
    [K.T0, 960, 540, 1], [a.channel + 1.0, 960, 540, 1], [a.heard - .1, 980, 546, 1.03],
    [a.outsea + .7, 1700, 630, 1.3], [a.big + .3, 2270, 560, 1.58], [a.guess + .3, 2350, 524, 1.64],
    [a.compared + .6, 2345, 436, 1.26], [a.answer + .2, 2372, 428, 1.33], [a.another, 2400, 420, 1.41], [a.verdict, 2425, 424, 1.47],
    [a.shiphide + .7, 2330, 480, 1.33], [a.tsunami + .9, 2520, 610, 1.48],
    [a.open + 1.6, 2700, 612, 1.5], [a.lookup - .1, 2800, 606, 1.52],
    [a.lookup + 1.35, 2840, 40, .82], [a.push + .5, 2860, 30, .79], [a.gps + 1.6, 2900, 40, .78],
    [a.same + 1.15, 3330, 572, 2.3], [a.clue + .6, 3345, 578, 2.45],
    [a.read + 1.1, 3320, 470, 1.45], [a.nasa + .6, 3240, 400, 1.22], [a.replay - .2, 3170, 340, 1.08], [a.gauge + .1, 3180, 350, 1.08],
    [a.research + .4, 3250, 520, 1.55], [a.half + .9, 3230, 590, 2.1], [tp - 1.45, LIGHTHOUSE[0] + 4, LIGHTHOUSE[1] + 4, 3.0],
    [tp, LIGHTHOUSE[0], LIGHTHOUSE[1], 70, 'i'],
  ];
  const view = (t) => { const p = B.aimPath(t, KO); return B.driftView(p, t, 3.5 * (1 - span(t, tp - 1.6, tp - .9)), 3); };
  const cam = (t) => B.camOf(ZS, view(t));

  // ---------------------------------------------------------------- the land (subscribe)
  const orb = (ctx, t, x, y, r, lit, seed = 0) => {
    if (lit > 0) { F.pool(ctx, x, y + r * .9, r * 6, r * 1.2, .9 * lit); halo(ctx, x, y, r * 5.5 * (1 + .04 * Math.sin(t * 1.3 + seed)), .55 * lit, P.halo0, P.core1); }
    ctx.fillStyle = E.rad(ctx, x - r * .3, y - r * .35, r * 1.2, [[0, mixHex(P.ind1, P.core0, lit)], [.6, mixHex(P.night1, P.halo0, lit)], [1, mixHex(P.night0, P.shade0, lit)]]);
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  };
  const pathLine = (ctx, pts, a0 = 1) => { const q = E.catmull(pts, 8); ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = rgba(mixHex(P.blue1, P.halo2, .35), .32 * a0); ctx.lineWidth = 9; ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore(); };
  // lamps light down the path as the pulse is handed on (subscribe), the far ones first lit already
  const lampLit = (t, k, nAll) => { const t0 = a.arrival + .2 + k * .28; return .35 + .65 * E.smooth(span(t, t0, t0 + .7)); };
  function land(ctx, c, t) {
    E.card(ctx, c, ZR, () => F.hills(ctx, [[-4000, 650], [-2500, 598], [-1200, 616], [-300, 590], [450, 614], [900, 636], [1150, 662]], { top: mixHex(P.ind0, P.blue0, .3), bottom: P.night1, rimA: .3 }));
  }
  function landNear(ctx, c, t) {
    const all = [...PATH[ZF].lamps.map(() => 0), ...PATH[ZM].lamps.map(() => 0), ...PATH[ZN].lamps.map(() => 0)].length;
    let idx = all - 1;
    E.card(ctx, c, ZF, () => {
      F.hills(ctx, [[-2200, 730], [-900, 690], [-100, 706], [600, 676], [1100, 684], [1300, 704], [1420, 742], [1560, 820]], { top: mixHex(P.night1, P.ind1, .65), bottom: P.night0, rimA: .32 });
      for (const [x, y, s] of TOWN) { halo(ctx, x, y, s * 6, .4, P.halo0, P.core1); ctx.fillStyle = rgba(P.core1, .85); ctx.fillRect(x - s / 2, y - s / 2, s, s); }
      pathLine(ctx, PATH[ZF].pts, .8); PATH[ZF].lamps.forEach(([x, y, r], k) => orb(ctx, t, x, y, r, lampLit(t, idx--, all), k));
    });
    E.card(ctx, c, ZM, () => {
      F.hills(ctx, [[-1400, 900], [-300, 820], [450, 790], [960, 760], [1180, 772], [1500, 830], [1900, 930]], { top: mixHex(P.night1, P.ind1, .55), bottom: P.night0, rimA: .3 });
      pathLine(ctx, PATH[ZM].pts, .9); PATH[ZM].lamps.forEach(([x, y, r], k) => orb(ctx, t, x, y, r, lampLit(t, idx--, all), k + 5));
    });
    E.card(ctx, c, ZN, () => {
      F.hills(ctx, [[-700, 1030], [100, 930], [560, 900], [900, 886], [1180, 930], [1500, 1050], [1900, 1250]], { top: mixHex(P.night1, P.ind1, .45), bottom: P.night0, rim: mixHex(P.blue0, P.halo1, .4), rimA: .5, depth: 260 });
      pathLine(ctx, PATH[ZN].pts, 1); PATH[ZN].lamps.forEach(([x, y, r], k) => orb(ctx, t, x, y, r, lampLit(t, idx--, all), k + 9));
      you(ctx, t);
    });
  }
  // you set one lamp down, lit: bend, the lamp leaves the hands, touches the ground and wakes; you straighten and look along the path
  function you(ctx, t) {
    const bend = sineIO(span(t, a.arrival - .2, a.want - .1)) * (1 - sineIO(span(t, a.subscribe - .1, a.heard + .6)));
    const look = lerp(.15, .5, E.smooth(span(t, a.subscribe, a.heard + 1)));
    const hands = E.du(ctx, DU.x, DU.y, DU.h, { lean: .5 * bend, armR: [lerp(.5, 1.0, bend), lerp(1.0, .45, bend)], armL: [lerp(-.35, .55, bend), lerp(.6, .3, bend)], look, light: 1, back: .3 });
    const set = span(t, a.want - .25, a.want + .1), lit = E.smooth(span(t, a.want - .1, a.want + .9));
    const hx = hands.R[0] + 8, hy = hands.R[1] + 6, gx = DU.x + 92, gy = DU.y - ORB.r * .95;
    const x = set > 0 ? lerp(hx, gx, sineIO(set)) : hx, y = set > 0 ? lerp(hy, gy, sineIO(set)) : hy;
    orb(ctx, t, set >= 1 ? gx : x, set >= 1 ? gy : y, ORB.r, lit * (1 + .0 * t), 99);
  }
  // ---------------------------------------------------------------- the sea card
  function sea(ctx, c, t, st) {
    E.card(ctx, c, ZS, () => {
      F.water(ctx, -5000, 12000, HOR, 2600, t, { top: mixHex(P.ind0, P.blue0, .32), seed: 7 });
      ctx.strokeStyle = rgba(mixHex(P.blue0, P.halo2, .3), .45); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-5000, HOR); ctx.lineTo(12000, HOR); ctx.stroke();
      isle(ctx, t);
      ships(ctx, t);
      tsunami(ctx, t);
      gpsWorld(ctx, t);
      radarSat(ctx, t);
    });
  }
  // Hawaii: an island on the horizon, a town of small lights, a lighthouse at the west tip, a ground station, one lit street
  function isle(ctx, t) {
    {   // the island sits ON the horizon: its silhouette is closed along the waterline, the sea stays below it
      const q = E.catmull([[ISLE.x0, HOR + 1], [3190, 618], [3300, 596], [3430, 584], [3560, 600], [3680, 628], [ISLE.x1, HOR + 1]], 10), ip = new Path2D();
      q.forEach((v, i) => (i ? ip.lineTo(v[0], v[1]) : ip.moveTo(v[0], v[1]))); ip.lineTo(ISLE.x1, HOR + 3); ip.lineTo(ISLE.x0, HOR + 3); ip.closePath();
      ctx.fillStyle = lin(ctx, 0, 584, 0, HOR, [[0, mixHex(P.night1, P.ind1, .5)], [1, P.night0]]); ctx.fill(ip);
      ctx.strokeStyle = rgba(P.blue0, .3); ctx.lineWidth = 2; ctx.beginPath(); q.forEach((v, i) => (i ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1]))); ctx.stroke();
      // its reflection: a few dark ripples under it
      for (let k = 0; k < 4; k++) { ctx.fillStyle = rgba(P.night0, .35 - k * .07); ctx.fillRect(3180 + k * 20 + 8 * Math.sin(t * .6 + k), HOR + 6 + k * 7, 520 - k * 70, 2.5); }
    }
    const warm = (k) => E.smooth(span(t, a.half + .1 + k * .1, a.half + .6 + k * .1));
    COASTL.forEach(([x, y, s], k) => { const w = warm(k); halo(ctx, x, y, s * (5 + 4 * w), .35 + .3 * w, P.halo0, P.core1); ctx.fillStyle = rgba(P.core1, .7 + .3 * w); ctx.fillRect(x - s / 2, y - s / 2, s, s); });
    // the street (GPS) with its lamps
    const sl = .45 + .55 * E.smooth(span(t, a.same - .2, a.same + .8));
    ctx.save(); ctx.strokeStyle = rgba(P.halo2, .35 * sl); ctx.lineWidth = 2.2; ctx.beginPath(); STREET.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
    for (let k = 0; k < 6; k++) { const p = STREET[Math.min(STREET.length - 1, k * 6)]; halo(ctx, p[0], p[1] - 4, 6, .5 * sl, P.halo0, P.core1); }
    // the lighthouse
    ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.beginPath(); ctx.moveTo(LIGHTHOUSE[0] - 4, 640); ctx.lineTo(LIGHTHOUSE[0] - 2.4, LIGHTHOUSE[1] + 3); ctx.lineTo(LIGHTHOUSE[0] + 2.4, LIGHTHOUSE[1] + 3); ctx.lineTo(LIGHTHOUSE[0] + 4, 640); ctx.fill();
    const lh = .6 + .4 * E.smooth(span(t, a.half + .2, a.half + 1.6)) + 1.2 * E.smooth(span(t, tp - 1.6, tp));
    halo(ctx, LIGHTHOUSE[0], LIGHTHOUSE[1], 14 * lh, .8, P.halo0, P.core0); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(LIGHTHOUSE[0], LIGHTHOUSE[1], 2.2, 0, TAU); ctx.fill();
    // the ground station: a mast with a cool eye
    ctx.strokeStyle = mixHex(P.night0, P.ind1, .6); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(STATION[0], 628); ctx.lineTo(STATION[0], STATION[1] - 10); ctx.stroke();
    halo(ctx, STATION[0], STATION[1] - 11, 6, .5, F.COOL.halo, F.COOL.core);
  }
  function ships(ctx, t) {
    if (t > a.open + 6) return;
    const ringA = span(t, a.big - .1, a.big + .8) * (1 - .6 * span(t, a.radar, a.radar + 1) * (1 - span(t, a.shiphide - .5, a.shiphide + .3)));
    // the far ship of subscribe whose light goes out on 'not be seen'
    const off0 = span(t, a.seen + .05, a.seen + .5), fl0 = off0 > 0 && off0 < 1 ? .5 + .5 * Math.sin(off0 * 40) : 1;
    B.ship(ctx, t, SHIP0.x, SHIP0.y, SHIP0.s, { lit: (1 - off0) * fl0, seed: SHIP0.seed, kind: 'cargo' });
    // the cargo ships broadcast where they are (radio rings); the first one switches its radio off on 'its radio off'
    CARGO.forEach((sh, k) => {
      const o = k === 0 ? span(t, a.radiooff - .1, a.radiooff + .5) : 0, fl = o > 0 && o < 1 ? .5 + .5 * Math.sin(o * 38) : 1;
      const r = B.ship(ctx, t, sh.x, sh.y, sh.s, { lit: (1 - o) * fl, mast: (1 - o) * fl, ring: ringA * (1 - o), seed: sh.seed, kind: 'cargo' });
      if (k === 0) { const tu = span(t, a.big + .3, a.big + 1.2) * (1 - span(t, a.guess - .4, a.guess + .2)); if (tu > 0) { ctx.save(); ctx.globalAlpha *= F.rise(tu); F.tool(ctx, 'radio', r.mast[0], r.mast[1] - 46 - 10 * (1 - expoOut(tu)), 40, { lit: .6 }); ctx.restore(); } }
    });
    // fishing boats as a chain of lights; most are dark (they show only once the radar finds them)
    const rv = (sh) => E.smooth(span(t, a.radar + (sh.x - 1880) / 1000 * 1.2, a.radar + (sh.x - 1880) / 1000 * 1.2 + .4)) * (1 - span(t, a.answer + 1, a.answer + 2.2));
    FISH.forEach((sh) => {
      const lit = sh.lit ? 1 : 0, rr = sh.lit ? 0 : rv(sh);
      if (lit) B.ship(ctx, t, sh.x, sh.y, sh.s, { lit: 1, mast: 1, ring: ringA * .7, seed: sh.seed, kind: 'fish' });
      else { B.ship(ctx, t, sh.x, sh.y, sh.s, { lit: 0, mast: 0, seed: sh.seed, kind: 'fish', a: .9 });
        if (rr > 0) { ctx.save(); ctx.strokeStyle = rgba(F.COOL.core, .8 * rr); ctx.lineWidth = 1.4; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.ellipse(sh.x, sh.y - sh.s * .1, sh.s * .62, sh.s * .2, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); } }
    });
  }
  // the satellite crosses high; its radar fan sweeps the sea; the radar picture grows out of it and later shrinks back into it
  const SAT = (t) => { const u = span(t, a.compared - 1.0, a.shiphide + 2.2); return [lerp(1780, 3120, sineIO(u) * .25 + u * .75), 90 + 10 * Math.sin(t * .4)]; };
  function radarSat(ctx, t) {
    if (t < a.compared - 1.0 || t > a.shiphide + 2.2) return;
    const [x, y] = SAT(t), A = span(t, a.compared - 1.0, a.compared - .3) * (1 - span(t, a.shiphide + 1.5, a.shiphide + 2.2));
    F.tool(ctx, 'satellite', x, y, 54, { col: 'cool', a: A, glow: 1 });
    const fan = span(t, a.compared + .3, a.compared + .9) * (1 - span(t, a.radar + .4, a.radar + 1.0));
    if (fan > 0) { const sw = (t - a.compared) * 1.0; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, x, y, x, 680, [[0, rgba(F.COOL.halo, .22 * fan)], [1, rgba(F.COOL.halo, .05 * fan)]]);
      ctx.beginPath(); ctx.moveTo(x, y + 20); ctx.lineTo(x - 260 + sw * 60, 690); ctx.lineTo(x + 140 + sw * 60, 690); ctx.closePath(); ctx.fill(); ctx.restore(); }
  }
  // ---------------------------------------------------------------- No. 5 on the sea card
  function tsunami(ctx, t) {
    if (t < a.tsunami - .5 || t > a.research + 2) return;
    // the flat ring on the water (barely a ripple), running out toward Hawaii
    const ru = span(t, a.tsunami + .2, a.lookup + 1.0), R = 40 + 900 * (1 - (1 - ru) ** 1.6), ra = E.smooth(span(t, a.tsunami + .2, a.tsunami + 1.2)) * (1 - span(t, a.push + 1, a.gps + 1));
    if (ra > 0) for (let k = 0; k < 3; k++) { const rk = R - k * 26; if (rk <= 4) continue; ctx.strokeStyle = rgba(mixHex(F.COOL.line, P.cream, .3), (.55 - k * .15) * ra); ctx.lineWidth = 2.4 - k * .5; ctx.beginPath(); ctx.ellipse(RING0[0], RING0[1], rk, rk * .07, 0, 0, TAU); ctx.stroke(); }
    // Look up: the twin ring climbs through the air as arcs, the water bump under it, the charged layer high above (≈ 300 KM)
    const up = span(t, a.lookup + .1, a.push + 2.5), ua = E.smooth(span(t, a.lookup + .1, a.lookup + .8)) * (1 - span(t, a.research, a.research + 1.5));
    if (ua > 0) {
      for (let k = 0; k < 4; k++) { const h0 = ((up * 1.25 - k * .18)); if (h0 <= 0 || h0 > 1.1) continue; const hh = (HOR - LAYER) * Math.min(1, h0), al = ua * (1 - span(h0, .9, 1.1)) * (.85 - k * .15);
        ctx.strokeStyle = rgba(F.COOL.line, al); ctx.lineWidth = 2.6 - k * .4; ctx.beginPath(); ctx.ellipse(RING0[0], HOR, hh * .9, hh, 0, Math.PI, TAU); ctx.stroke(); }
      const bump = E.smooth(span(t, a.rising, a.rising + 1.2)) * ua;
      if (bump > 0) { ctx.fillStyle = rgba(mixHex(P.ind0, P.blue0, .45), .95); ctx.beginPath(); ctx.moveTo(RING0[0] - 260, HOR + 1); for (let i = 0; i <= 40; i++) { const u = i / 40, x = RING0[0] - 260 + u * 520; ctx.lineTo(x, HOR - 26 * bump * Math.exp(-(((u - .5) / .2) ** 2)) * (.85 + .15 * Math.sin(t * 2))); } ctx.lineTo(RING0[0] + 260, HOR + 1); ctx.fill();
        ctx.strokeStyle = rgba(F.COOL.line, .7 * bump); ctx.lineWidth = 2; ctx.stroke(); }
      layer(ctx, t, ua, up);
    }
  }
  const layerY = (x, t, hit) => LAYER + 12 * Math.sin(x * .008 + t * .9) + hit * 26 * Math.exp(-(((x - RING0[0]) / 260) ** 2)) * Math.sin(x * .03 - t * 4);
  function layer(ctx, t, ua, up) {
    const hit = E.smooth(span(t, a.push + .6, a.push + 2.2)) * (1 - span(t, a.research, a.research + 1.4));
    ctx.save(); ctx.globalAlpha *= ua;
    for (let band = 0; band < 3; band++) { ctx.strokeStyle = rgba(mixHex(F.COOL.halo, P.cream, .3), .28 - band * .07); ctx.lineWidth = 10 - band * 3; ctx.beginPath();
      for (let x = 1200; x <= 4600; x += 20) { const y = layerY(x, t, hit) + band * 16; x === 1200 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
    const r = prng(77); for (let k = 0; k < 160; k++) { const x = 1200 + r() * 3400, y = layerY(x, t, hit) + (r() - .5) * 40; ctx.fillStyle = rgba(F.COOL.core, (.25 + .4 * r()) * (.6 + .4 * Math.sin(t * 2 + k))); ctx.fillRect(x, y, 2, 2); }
    // ≈ 300 KM: a thin ruler from the water up to the layer
    const lu = span(t, a.lookup + .6, a.lookup + 1.6) * (1 - span(t, a.same, a.same + .8));
    if (lu > 0) { const x = RING0[0] - 430; ctx.strokeStyle = rgba(P.halo2, .6 * lu); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, HOR); ctx.lineTo(x, lerp(HOR, LAYER + 30, expoOut(lu))); ctx.stroke();
      for (const y of [HOR, LAYER + 30]) { ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y); ctx.stroke(); }
      B.approx(ctx, '300 KM', x - 28, (HOR + LAYER) / 2 + 20, 46, F.rise(span(t, a.lookup + 1.0, a.lookup + 1.8)) * (1 - span(t, a.same, a.same + .8)), { serif: true, align: 'right' }); }
    ctx.restore();
  }
  // GPS: satellites above the layer, beams to the ground; where they cross the ripple they tremble (late); one beam leads to a street
  function gpsWorld(ctx, t) {
    const ga = E.smooth(span(t, a.space - .3, a.gps + .6)) * (1 - E.smooth(span(t, a.research + .6, a.half + .6))); if (ga <= 0) return;
    const hit = E.smooth(span(t, a.push + .6, a.push + 2.2)) * (1 - span(t, a.research, a.research + 1.4));
    const targets = [STATION, [2700, 660], [3236, 640], [2150, 672]];
    SATS.forEach(([sx, sy], i) => {
      const e = expoOut(span(t, a.space - .2 + i * .15, a.space + .6 + i * .15)) * ga;
      F.tool(ctx, 'satellite', sx, sy + 6 * Math.sin(t * .5 + i), 46, { col: 'cool', a: e });
      const tg = targets[i === 1 ? 0 : i === 2 ? 2 : 1];
      for (const T2 of [tg, targets[3 - i]]) {
        const bu = sineIO(span(t, a.gps - .4 + i * .12, a.gps + .5 + i * .12)) * ga; if (bu <= 0) continue;
        const n = 50; ctx.save(); ctx.globalAlpha *= bu; ctx.strokeStyle = rgba(F.COOL.line, .75); ctx.lineWidth = 1.6; ctx.beginPath();
        for (let k = 0; k <= n; k++) { const u = k / n * bu, x = lerp(sx, T2[0], u), y0 = lerp(sy, T2[1], u), dl = Math.abs(y0 - layerY(x, t, hit)), tr = hit * 7 * Math.exp(-((dl / 60) ** 2)) * Math.exp(-(((x - RING0[0]) / 420) ** 2)) * Math.sin(k * 2.2 + t * 18);
          const xx = x + tr; k ? ctx.lineTo(xx, y0) : ctx.moveTo(xx, y0); }
        ctx.stroke(); ctx.restore();
        const la = bu * span(t, a.late - .2, a.late + .4); if (la > 0 && T2 === STATION) { const ph = ((t * .8) % 1); halo(ctx, T2[0], T2[1] - 10, 14, .6 * la * (ph < .5 ? 1 : .3), F.COOL.halo, F.COOL.core); }
      }
    });
    const dl = F.rise(span(t, a.late - .1, a.late + .6)) * (1 - span(t, a.same - .2, a.same + .4));
    if (dl > 0) F.maskLine(ctx, [['DELAYED', 0]], STATION[0] + 26, STATION[1] - 70, 30, dl, { serif: false, weight: 600, col: F.COOL.text, glow: false });
    // the arrow on the night street (the signals your phone uses to find your way: no phone)
    const ar = span(t, a.same - .1, a.same + .7) * (1 - span(t, a.read + 1.5, a.read + 2.5));
    if (ar > 0) { const u = ((t - a.same) * .14 + .1) % 1, i = Math.min(STREET.length - 2, Math.floor(u * (STREET.length - 1))), p = STREET[i], q = STREET[i + 1], ang = Math.atan2(q[1] - p[1], q[0] - p[0]);
      ctx.save(); ctx.translate(p[0], p[1] - 4); ctx.rotate(ang + Math.PI / 2); F.tool(ctx, 'gps', 0, 0, 13 * expoOut(ar), { col: 'warm', lit: 1, glow: 1 }); ctx.restore(); }
    // the bead reads the fingerprint at the ground station
    const bd = expoOut(span(t, a.read - .2, a.read + .6)) * (1 - span(t, a.half + .2, a.half + 1.2));
    if (bd > 0) {
      const bx = STATION[0] + 30, by = STATION[1] - 46;
      F.beam(ctx, t, bx, by, STATION[0], STATION[1] - 12, span(t, a.read + .1, a.read + .7), { w: 1.4, a: bd });
      F.agent(ctx, t, bx, by, 6 * bd, { think: span(t, a.read + .3, a.finger + .8) });
      const fp = E.smooth(span(t, a.finger - .1, a.finger + .9)) * bd;
      if (fp > 0) { ctx.save(); ctx.globalAlpha *= fp; for (let k = 0; k < 5; k++) { ctx.strokeStyle = rgba(mixHex(F.COOL.line, P.halo0, fp * .7), .9); ctx.lineWidth = 1.4; ctx.beginPath();
        for (let i = 0; i <= 30; i++) { const ang = Math.PI * (1.1 + .8 * i / 30), r = 8 + k * 6 + 1.6 * Math.sin(i * 1.3 + k * 2 + t * 2), x = bx + 52 + Math.cos(ang) * r, y = by + 16 + Math.sin(ang) * r; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); } ctx.restore(); }
    }
  }
  // ---------------------------------------------------------------- the radar picture (top-down, local 1600 × 900)
  // rect on the sea card (design), grown out of the satellite; local zoom view { x, y, z } inside it
  const PIC = { x: 2440 - 380, y: 370 - 214, w: 760, h: 428 };
  const picGrow = (t) => sineIO(span(t, a.radar - .1, a.radar + 1.0)) * (1 - sineIO(span(t, a.shiphide - .5, a.shiphide + .6)));
  const LZ = [[a.radar, 800, 450, 1], [a.another - .2, 800, 450, 1], [a.another + 1.4, STAR.x - 120, STAR.y + 60, 2.2], [a.risk + .4, STAR.x - 110, STAR.y + 70, 2.25], [a.shiphide - .4, 800, 450, 1]];
  function picture(ctx, c, t) {
    const g = picGrow(t); if (g <= 0) return null;
    const p0 = E.project(c, ZS, PIC.x, PIC.y), p1 = E.project(c, ZS, PIC.x + PIC.w, PIC.y + PIC.h), [sx, sy] = (() => { const s = SAT(t), q = E.project(c, ZS, s[0], s[1]); return [q[0], q[1]]; })();
    const R = { x: lerp(sx, p0[0], g), y: lerp(sy, p0[1], g), w: (p1[0] - p0[0]) * g, h: (p1[1] - p0[1]) * g };
    if (R.w < 4) return null;
    const lv = B.aimPath(t, LZ), k = (p1[0] - p0[0]) / 1600 * lv.s;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.save(); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 10); ctx.clip();
    ctx.translate(R.x + R.w / 2, R.y + R.h / 2); ctx.scale(k, k); ctx.translate(-lv.u, -lv.v);
    chart(ctx, t, lv.s);
    ctx.restore();
    ctx.strokeStyle = rgba(F.COOL.line, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 10); ctx.stroke();
    const la = span(g, .8, 1) * span(t, a.radar + .8, a.radar + 1.4) * (1 - span(t, a.answer - .3, a.answer + .2));
    if (la > 0) F.maskLine(ctx, [['RADAR FROM SPACE', 0]], R.x + 16, R.y - 16, 24, F.rise(la), { serif: false, weight: 600, col: F.COOL.text, glow: false });
    ctx.restore();
    return { R, toScreen: (x, y) => [R.x + R.w / 2 + (x - lv.u) * k, R.y + R.h / 2 + (y - lv.v) * k], k };
  }
  function chart(ctx, t, zs) {
    ctx.fillStyle = lin(ctx, 0, 0, 0, 900, [[0, mixHex(P.night1, P.ind0, .6)], [1, P.night0]]); ctx.fillRect(-1600, -900, 4800, 2700);
    const r = prng(919); ctx.fillStyle = rgba(P.blue1, .35); for (let k = 0; k < 420; k++) ctx.fillRect(r() * 1600, r() * 900, 2, 2);
    ctx.strokeStyle = rgba(P.blue1, .25); ctx.lineWidth = 1 / zs; for (let x = 0; x <= 1600; x += 200) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 900); ctx.stroke(); } for (let y = 0; y <= 900; y += 150) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1600, y); ctx.stroke(); }
    // the coast and its port
    ctx.fillStyle = mixHex(P.ind1, P.blue1, .4); ctx.beginPath(); ctx.moveTo(-200, -50); ctx.lineTo(160, -50); ctx.bezierCurveTo(240, 200, 150, 320, 230, 480); ctx.bezierCurveTo(260, 600, 170, 760, 210, 960); ctx.lineTo(-200, 960); ctx.fill();
    halo(ctx, PORT[0], PORT[1], 40, .7, P.halo0, P.core0);
    // the sweep reveals the hulls (radar returns); the broadcasting ones carry a warm dot
    const sw = lerp(-100, 1700, span(t, a.radar + .5, a.broadcasts + .3)), ais = span(t, a.with ?? a.broadcasts - .6, a.broadcasts + .2);
    ctx.strokeStyle = rgba(F.COOL.core, .6 * (1 - span(t, a.broadcasts + .2, a.broadcasts + .6))); ctx.lineWidth = 3 / zs; ctx.beginPath(); ctx.moveTo(sw, 0); ctx.lineTo(sw, 900); ctx.stroke();
    // tracks: most dark boats loop back to port (they just fish); one never returns
    const tr = E.smooth(span(t, a.darkn + .2, a.darkn + 1.4)) * (1 - span(t, a.shiphide - .6, a.shiphide));
    if (tr > 0) BOATS.forEach((b, i) => { if (b.lit || b === BOATS[5] || i % 2) return; const pts = E.catmull([[PORT[0], PORT[1], 2], [lerp(PORT[0], b.x, .5), lerp(PORT[1], b.y, .5) - 80 + (i % 3) * 60, 2], [b.x, b.y, 2], [lerp(PORT[0], b.x, .55), lerp(PORT[1], b.y, .45) + 70, 2], [PORT[0] + 6, PORT[1] + 4, 2]], 8);
      ctx.save(); ctx.globalAlpha *= .45 * tr; F.coolPath(ctx, pts, 0, tr, 1.6 / zs * 1.5, 1); ctx.restore(); });
    const lone = E.smooth(span(t, a.worst, a.hide1 + .4)) * (1 - span(t, a.shiphide - .6, a.shiphide));
    if (lone > 0) { const zz = [[PORT[0], PORT[1], 3]]; for (let k = 0; k <= 14; k++) zz.push([lerp(PORT[0] + 80, STAR.x, k / 14) + (k % 2 ? 26 : -26) * span(t, a.another, a.flags + .6), lerp(PORT[1] - 30, STAR.y, k / 14) + (k % 2 ? -34 : 34) * span(t, a.another, a.flags + .6), 3]);
      F.coolPath(ctx, E.catmull(zz, 6), 0, lone, 3 / zs * 1.4, 1);
      // months: small ticks along the zigzag
      const mo = span(t, a.another + .4, a.flags + .8); if (mo > 0) for (let k = 1; k < 14; k++) if (k / 14 < mo) { const p = zz[k + 1]; ctx.fillStyle = rgba(F.COOL.core, .8); ctx.beginPath(); ctx.arc(p[0], p[1], 4 / zs * 1.5, 0, TAU); ctx.fill(); } }
    BOATS.forEach((b, i) => {
      const rv = E.smooth(span(sw, b.x - 20, b.x + 30)), lit = b.lit ? E.smooth(span(t, a.broadcasts - .9 + i * .03, a.broadcasts - .4 + i * .03)) : 0;
      const hl = span(t, a.three - .1, a.three + .4) * (1 - span(t, a.darkn, a.darkn + .6)), pulse = hl * (b.lit ? 0 : .5 + .5 * Math.sin(t * 6 + i));
      B.boatTop(ctx, t, b.x, b.y, b.ang, b.s * (1 + .25 * pulse), { radar: rv, lit, crew: b === BOATS[5] ? span(t, a.flags - .2, a.flags + .8) : 0 });
    });
    // the second A.I. reads how the lone ship moves: a bead travelling its zigzag; it flags the ship (a cool ring)
    const rd = span(t, a.another + .2, a.another + .9) * (1 - span(t, a.shiphide - .8, a.shiphide - .3));
    if (rd > 0) { const u = span(t, a.another + .3, a.flags + .2), x = lerp(PORT[0] + 120, STAR.x - 40, sineIO(u)), y = lerp(PORT[1] - 50, STAR.y + 30, sineIO(u)) + 20 * Math.sin(u * 30);
      F.agent(ctx, t, x, y, 12 * rd, { think: .6 });
      const fg = span(t, a.flags, a.flags + .7); if (fg > 0) { ctx.strokeStyle = rgba(F.COOL.line, .9 * fg * rd); ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.arc(STAR.x, STAR.y, 56 * expoOut(fg), 0, TAU); ctx.stroke(); ctx.setLineDash([]); } }
    // ≈ 75 %: four boats, three dark and one lit, and the number
    const an = span(t, a.three - .2, a.three + .5) * (1 - span(t, a.darkn - .2, a.darkn + .4));
    if (an > 0) { ctx.save(); ctx.globalAlpha *= F.rise(an);
      for (let k = 0; k < 4; k++) B.boatTop(ctx, t, 1010 + k * 92, 690, -Math.PI / 2, 66, { radar: 1, lit: k === 3 ? 1 : 0 });
      B.approx(ctx, '75 %', 1010 - 50, 640, 120, an, { serif: true, align: 'right' });
      B.mline(ctx, [['OFF THE PUBLIC MAP', 0]], 1010 - 50, 700, 34, F.rise(span(t, a.three + .1, a.three + .8)), { serif: false, weight: 600, align: 'right', col: P.halo2, glow: false });
      ctx.restore(); }
  }
  // ---------------------------------------------------------------- the C4 plate in the sky over Hawaii (mute, under the VO)
  const c4 = a.C4;
  function c4plate(ctx, c, t) {
    if (!c4 || t < c4.start - 1.7 || t > c4.end + .9) return;
    const grow = sineIO(span(t, c4.start - 1.5, c4.start + .1)), shrink = sineIO(span(t, c4.end - .05, c4.end + .7)), m = grow * (1 - shrink); if (m <= 0) return;
    const sky = E.project(c, ZS, 3300, LAYER + 40), coast = E.project(c, ZS, 3330, 632);
    // a smaller plate inside the scene (morph M of the full rect), centred at PC: clipPlate lerps from the source towards CLIP_RECT, so
    // the source point is chosen where that lerp lands on PC (it lies in the sky over Hawaii)
    const M = .52, R = F.CLIP_RECT, PC = [1150, 400], src = PC.map((v, i) => (v - M * (i ? R.y + R.h / 2 : R.x + R.w / 2)) / (1 - M));
    const from = [src[0], src[1], 10];
    const fade = span(t, c4.start - 1.5, c4.start - 1.2) * (1 - span(t, c4.end + .5, c4.end + .7));
    ctx.save(); ctx.globalAlpha = fade;
    const r = F.clipPlate(ctx, t, T, 'C4', { from, morph: m * M, credits: false });
    // centre the small plate over the sky right of the date tiles: clipPlate lerps toward CLIP_RECT, so shift the result there
    ctx.restore();
    const lu = F.rise(span(t, c4.start + .2, c4.start + 1.0)) * (1 - span(t, c4.end - .5, c4.end)) * fade;
    if (lu > 0 && r) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      F.maskLine(ctx, [['NASA SVS · GUARDIAN REPLAY', 0]], r.cx - r.w / 2, r.cy - r.h / 2 - 16, 22, lu, { serif: false, weight: 600, col: P.halo2, glow: false });
      F.maskLine(ctx, [['ORIGINAL FOOTAGE', 0]], r.cx + r.w / 2 - F.measure('ORIGINAL FOOTAGE', 22, false), r.cy - r.h / 2 - 16, 22, lu, { serif: false, weight: 600, col: P.halo0, glow: false });
      const nu = F.rise(span(t, a.halfhour - .1, a.halfhour + .6)) * (1 - span(t, c4.end - .3, c4.end + .2));
      if (nu > 0) { F.maskLine(ctx, [['32 MIN', 0]], r.cx - r.w / 2, r.cy + r.h / 2 + 76, 70, nu, {});
        F.maskLine(ctx, [['BEFORE THE FIRST TIDE GAUGE', 0]], r.cx - r.w / 2 + F.measure('32 MIN', 70) + 22, r.cy + r.h / 2 + 70, 28, nu, { serif: false, weight: 600, col: P.halo2, glow: false }); }
      ctx.restore();
    }
  }
  // ---------------------------------------------------------------- screen-space things anchored to the sea card
  function overlays(ctx, c, t) {
    const P9 = (x, y) => E.project(c, ZS, x, y);
    // 6.02 the question
    const q = F.rise(span(t, a.guess + .5, a.guess + 1.2)) * (1 - span(t, a.compared - .4, a.compared + .2));
    if (q > 0) { const p = P9(2340, 300); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.maskLine(ctx, [['HOW MANY ARE ', 0], ['DARK?', 1]], p[0], p[1], 50, q, { serif: false, weight: 600, align: 'center', glow: false }); ctx.restore(); }
    // 6.07 risk, not a verdict (on the lone ship in the picture) · 5.10 research output (from the ground station)
    const pic = picture(ctx, c, t);
    if (pic) { const tu = span(t, a.risk - .1, a.risk + .7) * (1 - span(t, a.shiphide - .9, a.shiphide - .4)); if (tu > 0) { const p = pic.toScreen(STAR.x + 50, STAR.y - 40); B.dashTag(ctx, t, p[0], p[1], ['RISK', 'NOT A VERDICT'], tu, { size: 32, len: 30 }); } }
    const ru = span(t, a.research - .1, a.research + .7) * (1 - span(t, a.half + .8, a.half + 1.6));
    if (ru > 0) { const p = P9(STATION[0] - 40, LAYER + 260); B.dashTag(ctx, t, p[0], p[1], ['RESEARCH OUTPUT', 'NOT AN OFFICIAL WARNING'], ru, { size: 28, len: 50 }); }
    // 5.08 the two date tiles rise from the ground station's light
    const dt = (k) => span(t, a.nasa + .1 + k * .7, a.nasa + .9 + k * .7) * (1 - span(t, a.replay - .6, a.replay + .1));
    [['28 JULY 2025', 'SWITCHED ON'], ['29 JULY', 'M8.8 · KAMCHATKA']].forEach(([l1, l2], k) => {
      const u = dt(k); if (u <= 0) return;
      const e = expoOut(u), st = P9(STATION[0], STATION[1] - 12), tg = [lerp(330, 760, k) , 300 + k * 18], x = lerp(st[0], tg[0], e), y = lerp(st[1], tg[1], e), s = lerp(.2, 1, e);
      ctx.save(); ctx.setTransform(s, 0, 0, s, x, y); ctx.globalAlpha = F.rise(u);
      ctx.fillStyle = rgba(mixHex(P.night1, P.ind0, .6), .92); ctx.beginPath(); ctx.roundRect(-170, -70, 340, 150, 10); ctx.fill();
      ctx.strokeStyle = rgba(k ? P.halo0 : F.COOL.line, .9); ctx.lineWidth = 2; ctx.stroke();
      E.glowText(ctx, l1, 0, -2, { size: 48, serif: true, align: 'center', glow: false });
      E.glowText(ctx, l2, 0, 44, { size: 24, weight: 600, align: 'center', spacing: .1, glow: false, col: k ? P.halo2 : F.COOL.text });
      ctx.restore();
    });
    c4plate(ctx, c, t);
  }
  // ---------------------------------------------------------------- the whole world (also seen through the window: outer = { k, e, f })
  function world(ctx, t, outer) {
    const c = cam(t);
    B.oSky(ctx, c, t, { Z: ZS, hor: HOR, outer });
    E.card(ctx, c, 30000, () => halo(ctx, 2900, 560, 1500, .14, P.blue0, mixHex(P.blue0, P.halo2, .3)));
    land(ctx, c, t);
    sea(ctx, c, t);
    if (t < a.big + 6) landNear(ctx, c, t);
    return c;
  }
  return { world, overlays, cam, tp, view };
}
