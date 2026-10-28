// Film 14 · the hook as ONE plan sequence (shots 1.01–2.03), shared by scenes/sc01.mjs and scenes/sc02.mjs so the c01|c02 seam is
// the same function at the same t (no blend). Plan: docs/shots.md · motion rules: docs/MOTION.md · kit: lib/f14_kit.mjs.
//
// | ID     | anchor (word)                    | picture (one idea)                                                          | 1–2 moves               | → carrier          |
// |--------|----------------------------------|-----------------------------------------------------------------------------|-------------------------|--------------------|
// | 1.01 ★ | keys · superintelligence         | KEY ANCHOR 1 (thumbnail): one key of light before a vast dark data centre;  | push · racks wake       | plan sequence      |
// |        |                                  | you small on the ground, looking up. The rack lights wake left → right.     |                         |                    |
// | 1.02   | people building · Every part     | a cream blueprint traces the building (understood), then every part of it   | blueprint draws         | gold line from the |
// |        |                                  |                                                                             |                         | key's bow → rule   |
// | 1.03   | Q1 card (silent slot)            | QUOTE CARD in the sky: the line becomes the rule, the quote rises line by    | tilt up · lines rise    | plan sequence      |
// |        |                                  | line, then the source                                                       |                         |                    |
// | 1.04   | plainly · don't understand       | the quote stands; "do not understand" turns warm                            | the three words glow    | the rule retracts  |
// |        |                                  |                                                                             |                         | into the key       |
// | 1.05   | hold the key · built the lock    | a plain indigo hand takes the key and aims it; a keyhole opens in the       | tilt down · hand        | plan sequence      |
// |        | · can't see inside               | facade (the lock); inside it is dark, only a faint glimmer of numbers        | · keyhole opens         |                    |
// | 1.06   | control · superintelligence      | pull back to scale: you, tiny, under the building with the keyhole           | pull back               | fly into the hole  |
// | 2.01   | Everything … weights             | the camera flies through the keyhole: a night field of numbers (weights)     | dive (one move, 4 s)    | plan sequence      |
// | 2.02   | one giant file                   | the nearest numbers flow into ONE giant file of light; label THE WEIGHTS     | numbers gather · trace  | the file outline   |
// | 2.03   | Copy it · you have it            | the outline clones itself and slides right: a copy, just as full             | clone slides            | (→ 2.04 builders)  |
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
import * as X from './f14_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cardM, cam3, camAt, camDrift, F0 } = E;
const rise = (x) => 1 - (1 - clamp(x)) ** 3;

export const PRINT = K.PRINT13;

// words → times (only phrases; never seconds)
export function hookAnchors(T) {
  const S = (sec, w, n) => T.S(sec, w, n), Ee = (sec, w, n) => T.E(sec, w, n), q = T.clip('Q1');
  return {
    keys: S('s00', 'keys'), sup: S('s00', 'superintelligence'), people: S('s00', 'people building'), underst: S('s00', 'understand'), every: S('s00', 'Every part'), s00e: T.E('s00'),
    q0: q.start, q1: q.end,
    plainly: S('s01', 'plainly'), dont: S('s01', "don't understand"), work: Ee('s01', 'creations work'),
    hold: S('s02', 'hold'), key: S('s02', 'key'), built: S('s02', 'built'), lock: S('s02', 'lock'), cant: S('s02', "can't see"), inside: S('s02', 'inside'),
    so: S('s02', 'So can'), control: S('s02', 'control'), sup2: S('s02', 'superintelligence'), s02e: T.E('s02'),
    every2: S('s03', 'Everything'), weights: S('s03', 'weights'), giant: S('s03', 'one giant'), file: S('s03', 'file'), fileE: Ee('s03', 'giant file'),
    copy: S('s03', 'Copy'), have: S('s03', 'you have'), haveE: Ee('s03', 'have it'), who: S('s03', 'So who'),
  };
}

// ---------------------------------------------------------------------------------------------------------- the stage (design coords)
const ZF = 3400, ZN = 7000;                               // the data centre facade · the world inside (the weights)
const DC = { x0: 760, y0: 150, x1: 3100, y1: 822, top: 80, roof: [[300, 160, 26], [620, 90, 40], [1180, 220, 22], [1700, 140, 34]] };
const HOLE = { cx: 1400, cy: 470, s: 150 };
const KEY0 = { x: 560, y: 470, h: 330 };                  // the key, floating (thumbnail motif)
const GROUND = [[-900, 900], [400, 896], [1400, 890], [3200, 884]];
const gy = (x) => lerp(900, 884, clamp((x + 900) / 4100));
const DU = { x: 900, h: 122 };
const TILT = -520;                                         // camera tilt for the quote
const QX = 360, QS = 80, QL = 98, QY0 = -315;             // quote: left edge, size, line pitch, first baseline (focus card)
const RULE_X = 300;
const Q_L1 = [['“…we ', 0], ['do not understand', 1], [' how our own', 0]];
const Q_L2 = [['AI creations work.”', 0]];
const SRC1 = '— Dario Amodei, CEO of Anthropic';
const SRC2 = '“The Urgency of Interpretability”, April 2025';
// the dive: the camera axis passes through the keyhole; the inner world is designed in screen coords at the end of the dive
const AX = (HOLE.cx - W / 2) * ZF / F0, AY = (HOLE.cy + 30 - H / 2) * ZF / F0;
const ZEND = ZN - F0, KIN = ZN / F0;                       // final camera z; scale of the inner card there
const UIN = W / 2 + AX * F0 / ZN, VIN = H / 2 + AY * F0 / ZN;
const FILE = X.fileShape(960, 566, 560, 730, 104);
const COPY_DX = 640;

export function hook(a) {
  // the hand ("they"): a plain indigo human hand from the lower left; it takes the key by the bow and aims it at the lock
  const HM = (u) => E.handMatrix(lerp(-260, 150, u), lerp(1320, 905, u), -.86, 250, 1);
  const HO = { pose: 'hold', curl: .05 };
  const grip = (u) => E.applyM(HM(u), 1.02, .02);
  // the gold line from the key's bow up to the quote rule (Film 13 thread language)
  const bowTop = [KEY0.x, KEY0.y - KEY0.h * .5];
  const thread = E.catmull([[bowTop[0], bowTop[1], 3], [bowTop[0] - 6, bowTop[1] - 70, 3], [470, 160, 3], [RULE_X + 30, 60, 3], [RULE_X, 0, 3], [RULE_X, -200, 3], [RULE_X, -440, 3]], 10);
  const segLen = thread.slice(1).map((p, i) => Math.hypot(p[0] - thread[i][0], p[1] - thread[i][1])), total = segLen.reduce((s, v) => s + v, 0);
  const iRule = thread.findIndex((p, i) => i > 4 && Math.abs(p[0] - RULE_X) < 1.5);
  const uRule = segLen.slice(0, iRule).reduce((s, v) => s + v, 0) / total;
  // timing
  const tThreadA = a.s00e - .1, tThreadB = a.q0 + 1.2, tTail = tThreadB + .05;
  const tL = [a.q0 + .9, a.q0 + 1.7], tSrc = a.q0 + 2.7;
  const tSink = a.work + .05, tRet = a.work + .25;
  const tHand0 = a.hold - .3, tHand1 = a.key + .1;
  const tAim0 = a.key + .2, tAim1 = a.built - .1;
  const tHole0 = a.built + .05, tHole1 = a.lock + .45;
  const tDive0 = a.so + 1.2, tDive1 = a.weights + .2;
  const tGat0 = a.weights + .2, tGat1 = a.fileE - .05, tTrace0 = a.giant - .1, tTrace1 = a.fileE + .1;
  const tCopy0 = a.copy, tCopy1 = a.have + .3;
  // camera: every move starts early and runs long (calm); the dive first pans onto the keyhole axis, then dollies straight in
  // (x, y fixed while z changes, so the camera really threads the hole instead of passing through the wall beside it)
  const tAxis = tDive0 + 1.7;
  const KEYS = [
    [0, cam3({ z: -70, x: 30, y: 26 })],
    [a.every + .8, cam3({ z: 100, x: 8, y: 6 })],
    [a.s00e - .5, cam3({ z: 115, x: 0, y: -10 })],
    [a.q0 + 3.8, cam3({ z: 90, x: -30, y: TILT })],
    [a.work, cam3({ z: 190, x: -20, y: TILT - 10 })],
    [a.built + .6, cam3({ z: 150, x: 60, y: 10 })],
    [a.cant - .1, cam3({ z: 175, x: 90, y: 8 })],
    [a.inside + .5, cam3({ z: 280, x: 150, y: 14 })],
    [a.sup2 + .2, cam3({ z: -540, x: 160, y: 60 })],
    [tAxis, cam3({ z: -420, x: AX, y: AY })],
    [tDive1 + .9, cam3({ z: ZEND, x: AX, y: AY }), 'q'],
    [tCopy0, cam3({ z: ZEND + 60, x: AX, y: AY })],
    [tCopy1 + 1.4, cam3({ z: ZEND - 520, x: AX + COPY_DX * .5, y: AY + 10 })],
  ];
  return (ctx, t) => {
    const c = camDrift(camAt(t, KEYS, ZN), t, .8 * (1 - .85 * smooth(span(t, tAxis + 1.5, tDive1 + .9))));   // inside, the dense field gets almost no drift (calm)
    // ---- state from the words ----
    const wake = smooth(span(t, a.sup - .3, a.sup + 1.8));
    const keyBreath = 1 + .06 * expoOut(span(t, a.keys - .05, a.keys + .4)) * (1 - smooth(span(t, a.keys + .5, a.keys + 2)));
    const bp0 = smooth(span(t, a.people - .1, a.underst + .5)), bp1 = smooth(span(t, a.every - .05, a.every + 1.3));
    const bpA = 1 - .55 * smooth(span(t, a.q0, a.q0 + 3)) - .45 * smooth(span(t, a.hold, a.built));
    const handU = sineIO(span(t, tHand0, tHand1));
    const aim = sineIO(span(t, tAim0, tAim1)), push = sineIO(span(t, a.cant - .1, a.inside + .5));
    const hole = expoOut(span(t, tHole0, tHole1));
    const dive = span(t, tDive0, tDive1);
    const gather = span(t, tGat0, tGat1);
    const trace = span(t, tTrace0, tTrace1);
    const copyU = span(t, tCopy0, tCopy1);
    // key: floats (gentle bob + slow turn round its long axis), then is taken by the hand and aimed at the lock
    const bob = Math.sin(t * .9) * 6, turn = .22 * Math.sin(t * .45);
    const g = grip(handU);
    const held = smooth(span(t, tHand1 - .25, tHand1 + .1));
    const kx0 = lerp(KEY0.x, g[0] + 12, held), ky0 = lerp(KEY0.y + bob, g[1] - 4, held);
    const kRot = lerp(0, -1.38, aim) + .03 * Math.sin(t * .7) * (1 - held);
    // the key, once held, is drawn bow-in-hand: offset so that the bow sits in the grip
    const kh = KEY0.h * lerp(1, .74, held);
    const bowOff = [-Math.sin(kRot) * .3 * kh, Math.cos(kRot) * .3 * kh];      // centre = grip + rotate(0, +.3h)
    const kx = lerp(kx0, g[0] + bowOff[0], held) + aim * 40 * push, ky = lerp(ky0, g[1] + bowOff[1], held) - aim * 10 * push;

    // ---- sky (far) ----
    card(ctx, c, 40000, () => {
      E.nightSky(ctx, [[0, P.night0], [.55, P.night1], [1, P.ind0]], -1100, H);
      ctx.fillStyle = E.rad(ctx, 600, 420, 1300, [[0, rgba(P.ind1, .9)], [.5, rgba(P.ind1, .4)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-W, -2 * H, 3 * W, 4 * H);
      E.stars(ctx, 14, 210, t, [-500, -900, W + 1000, H + 500], .8);
    });
    // far hills
    card(ctx, c, 9000, () => {
      E.ground(ctx, [[-1400, 760], [-200, 720], [700, 748], [1500, 728], [2600, 752], [3600, 740]], { stops: [[0, P.ind0], [1, P.night1]], rim: rgba(P.blue0, .6), rimW: 2 });
    });
    // ---- the world inside the keyhole (drawn first; seen only through the hole until the camera passes the facade) ----
    const mF = cardM(c, ZF);
    ctx.save();
    if (mF) { ctx.setTransform(mF.k, 0, 0, mF.k, mF.e, mF.f); ctx.beginPath(); ctx.rect(DC.x0, DC.y0, DC.x1 - DC.x0, DC.y1 - DC.y0); ctx.clip(); }
    card(ctx, c, ZN, () => {
      ctx.translate(UIN, VIN); ctx.scale(1 / KIN, 1 / KIN); ctx.translate(-W / 2, -H / 2);
      inside(ctx, t, { dive: smooth(dive), gather, trace, copyU, a });
    });
    ctx.restore();
    // ---- the data centre facade (with the keyhole) ----
    card(ctx, c, ZF, () => {
      E.ground(ctx, [[-1200, 826], [600, 824], [3400, 822]], { stops: [[0, P.night1], [1, P.night0]], rim: rgba(P.blue0, .5), rimW: 2 });
      X.dataCentre(ctx, t, { ...DC, wake, warm: .6 + .2 * (1 - held), hole: { ...HOLE, u: hole, rim: 1, px: 1 / Math.max(1, mF ? mF.k : 1) } });
      X.blueprint(ctx, [DC.x0, DC.y0, 2150, DC.y1], bp0, bp1, { a: bpA * (1 - hole), nx: 10, ny: 5 });
    });
    // ---- the focus plane: ground, you, the hand, the key, the quote ----
    card(ctx, c, F0, () => {
      E.ground(ctx, GROUND, { stops: [[0, P.night1], [1, P.night0]], rim: E.lin(ctx, -900, 0, 3200, 0, [[0, rgba(P.blue0, .8)], [.3, rgba(P.halo1, .55)], [.6, rgba(P.blue0, .8)], [1, rgba(P.blue0, .6)]]), rimW: 3 });
      // a light pool under the key on the ground
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(kx, gy(kx) + 4); ctx.scale(1, .1);
      ctx.fillStyle = E.rad(ctx, 0, 0, 520, [[0, rgba(P.halo1, .3)], [.5, rgba(P.halo1, .08)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 520, 0, 6.29); ctx.fill(); ctx.restore();
      // you: look up at the key; at the pull-back you look toward the lock
      const look = lerp(.35, .95, sineIO(span(t, a.keys - .4, a.sup + .8))) * (1 - .5 * sineIO(span(t, a.lock, a.cant))) + .3 * sineIO(span(t, a.control - .6, a.sup2 + .4));
      const faceLock = sineIO(span(t, a.built, a.lock + .4));
      E.castShadow(ctx, DU.x, gy(DU.x) + 2, 24, 170, .3, .45);
      E.du(ctx, DU.x, gy(DU.x) + 1, DU.h, { dir: faceLock > .5 ? 1 : -1, look: clamp(look), light: faceLock > .5 ? -1 : -1, armL: [-.12, -.05], armR: [.12, .05] });
      // the key's thread up to the quote rule (and back)
      const uHead = smooth(span(t, tThreadA, tThreadB)), uTail = uRule * smooth(span(t, tTail, tTail + 1.1));
      const ret = smooth(span(t, tRet, tRet + 1.1));
      if (uHead > 0 && ret < 1) {
        if (ret <= 0) K.trailSpan(ctx, thread, uTail, uHead, { w: 2.4 });
        else K.trailSpan(ctx, thread, 0, uRule * (1 - ret) + .0001 + (1 - uRule) * 0, { w: 2.4, spark: true, a: 1 - smooth(span(ret, .85, 1)) });
      }
      // the hand (behind the key), then the key
      if (handU > 0) X.darkHand(ctx, HM(handU), { ...HO, warm: .9 * handU, side: -1 });
      X.lightKey(ctx, kx, ky, kh * keyBreath, t, { rot: kRot, turn: turn * (1 - held), lum: 1, glow: 1 + .2 * (keyBreath - 1) / .06, blue: 1 - .7 * held, dust: held > .5 ? 1400 : 2600 });
      // the quote: rule first (the thread), then the two lines from their baselines, then the source; out: sink, staggered
      const sink = (i) => 1 - expoIn(span(t, tSink + i * .08, tSink + .55 + i * .08));
      const warmW = smooth(span(t, a.dont - .05, a.dont + .6));
      if (t > tL[0] - .1 && t < tSink + 1) {
        const u1 = rise(span(t, tL[0], tL[0] + 1)) * sink(0), u2 = rise(span(t, tL[1], tL[1] + 1)) * sink(1);
        if (u1 > 0) K.maskLine(ctx, Q_L1.map(([s, w]) => [s, w * warmW]), QX, QY0, QS, u1);
        if (u2 > 0) K.maskLine(ctx, Q_L2, QX, QY0 + QL, QS, u2);
        const us = rise(span(t, tSrc, tSrc + 1)) * sink(2);
        if (us > 0) { K.maskLine(ctx, [[SRC1, 0]], QX + 2, QY0 + QL + 78, 32, us, { serif: false, col: P.halo2, glow: false }); K.maskLine(ctx, [[SRC2, 0]], QX + 2, QY0 + QL + 122, 28, us, { serif: false, col: rgba(P.halo2, .8), glow: false, weight: 500 }); }
      }
    });
  };
}

// ---------------------------------------------------------------------------------------------------------- inside: the weights
function inside(ctx, t, o) {
  const { dive, gather, trace, copyU } = o;
  // the dark room behind the lock: deeper than the facade, so the keyhole reads black; a warm glow grows where the file forms
  ctx.fillStyle = E.rad(ctx, 960, 560, 1400, [[0, mixHex(P.night0, P.ind0, .25)], [.45, '#050719'], [1, '#03040f']]); ctx.fillRect(-3000, -3000, 8000, 8000);
  const glowU = smooth(gather);
  E.halo(ctx, 960, 560, 900, .1 + .22 * glowU, P.blue0, P.ind1);   // a faint glow where the file will form (seen from inside)
  // the field of numbers (a faint glimmer through the keyhole, full once we are inside)
  X.numberField(ctx, t, { gather: sineIO(gather), file: FILE, a: lerp(.5, 1, dive) });
  // the file: its outline is traced in gold, the inside glows warm (the hero light)
  if (trace > 0) {
    const fill = smooth(span(trace, .35, 1));
    if (fill > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.rad(ctx, 960, 500, 560, [[0, rgba(P.halo0, .3 * fill)], [.6, rgba(P.halo1, .12 * fill)], [1, rgba(P.halo1, .04 * fill)]]); ctx.fill(FILE.path); ctx.restore();
      E.glowFill(ctx, FILE.path, 90, .16 * fill, P.blue0); E.glowFill(ctx, FILE.path, 26, .3 * fill, P.halo1);
    }
    K.trailSpan(ctx, FILE.pts.map(([x, y]) => [x, y]), 0, sineIO(trace), { w: 3 });
    if (fill > 0) { ctx.save(); ctx.globalAlpha = fill; ctx.fillStyle = rgba(P.halo1, .5); ctx.fill(FILE.fold); ctx.restore(); }
    const lu = rise(span(trace, .7, 1));
    if (lu > 0) K.maskLine(ctx, [['THE WEIGHTS', 0]], 960, FILE.rect[1] - 34, 30, lu, { serif: false, align: 'center', col: P.halo2, glow: false });
  }
  // the copy: the outline clones itself and glides right on an arc; the numbers come with it (cool: just as full, not lit)
  if (copyU > 0) {
    const k = sineIO(copyU), dx = COPY_DX * k, dy = -Math.sin(k * Math.PI) * 40;
    ctx.save(); ctx.translate(dx, dy);
    X.numberField(ctx, t, { gather: 1, file: FILE, a: .7 * smooth(span(copyU, 0, .3)), onlyFile: true, cool: true });
    ctx.strokeStyle = rgba(P.cream, .75); ctx.lineWidth = 2.4; ctx.stroke(FILE.path); ctx.fillStyle = rgba(P.blue1, .5); ctx.fill(FILE.fold);
    ctx.restore();
  }
}
