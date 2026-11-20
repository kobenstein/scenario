// Film 15 · B1 · c06 STATION 4a (157.32 – 198.46) · the way through the tests: 9 in 10, test 2 no better, the cell in real time.
// Entry: platePill (lib/f15_seams.mjs; drawn by f15_b1.mjs until 157.82). At 157.82 this set takes over at cam3() with the SAME pill
// (card F0 = screen at the home camera), the halves close and it rolls off along a path of light. Exit: plateDivide (from 197.96):
// the cell is drawn in screen space at its projected place and lands exactly on the plate's cell (960, 530, r 250, split .8).
//
// | ID    | time          | anchor                    | picture                                                                         | moves             | carrier → next |
// | 6.01  | 157.32–163.96 | Follow · pharmacy · people | the halves close, the capsule rolls along a path of light; two gates (upright rings); far away a pharmacy window | roll · pull back | plan sequence |
// | 6.02  | 163.96–169.24 | safe · help               | SAFE? rises under gate 1, DOES IT HELP? under gate 2                              | words rise        | plan sequence |
// | 6.03  | 169.24–177.91 | first test · nine · half  | the path splits in two lanes: 10 gold capsules (found with AI) above, 10 cool (usual) below; 9 gold pass gate 1, 5 cool; 9 IN 10 | streams | capsules → gate 2 |
// | 6.04  | 177.91–185.28 | second test · no better · small | at gate 2 equally few pass from both: 4 of 9, 2 of 5; NO BETTER IN TEST 2 · SMALL SAMPLE | streams | plan sequence |
// | 6.05  | 185.28–187.84 | limit                     | pull back: behind gate 2 the path is long and dark, the pharmacy far               | pull back         | plan sequence |
// | 6.06★ | 187.84–198.46 | faster · body · years     | gate 1 turns to face us: the machine's ring, spinning fast; gate 2 turns: one cell of light, dividing very slowly; push on "years" | ring · cell · push | plateDivide |
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import * as U from './f15_b1_util.mjs';
import { PILL, DIVIDE, COOL_HI } from './f15_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, project, F0, prng, drift } = E;

export function setC06(T, a) {
  const T0 = a.T6 + .5, TEND = a.T7 - .5;                              // this set draws [T0, TEND); plates outside
  // ------------------------------------------------------------------------------------------------ layout (design, card F0)
  const PY = 640, LG = 520, LC = 760, CW = 130, CH = CW * .42;            // path, gold lane, cool lane, capsule
  const G1 = 2600, G2 = 4600, GR = 300, GRX = 66;                        // gates: upright rings round the path
  const FORK = 760, SLOT = (k) => 2430 - k * 165;
  const ZP = 7000;                                                       // the far pharmacy (its own deep card)
  const GOLD_FAIL1 = [6], COOL_FAIL1 = [1, 3, 4, 7, 8];                   // test 1: 9 of 10 gold pass, 5 of 10 cool
  const GOLD_PASS2 = [0, 2, 5, 7], COOL_PASS2 = [1, 3];                   // test 2 (indices among the passers): 4 of 9, 2 of 5
  // the times
  const tRoll0 = a.follow + .5, tRoll1 = a.people - .2, PILLX = 2150;
  const tFork = a.drugs - .3, tFork1 = a.drugs + .7;
  // each capsule: lane, queue slot, its path through the gates (piecewise: slot → after gate 1 (or stuck) → after gate 2 (or stuck) → away)
  const CAPS = [];
  for (const [lane, y, t1, fail1, pass2, isGold] of [['g', LG, a.firstTest + .05, GOLD_FAIL1, GOLD_PASS2, true], ['c', LC, a.usually + .15, COOL_FAIL1, COOL_PASS2, false]]) {
    let j = 0, f = 0;
    for (let k = 0; k < 10; k++) {
      const c = { lane, y, k, gold: isGold, x0: SLOT(k), t1: t1 + k * .17 };
      if (fail1.includes(k)) { c.fail1 = true; c.x1 = G1 - 110 - f * 150; f++; }
      else { c.j = j; c.x1 = G2 - 330 - j * 165; c.t2 = a.secondTest + (isGold ? .05 : .5) + j * .17; j++; }
      CAPS.push(c);
    }
    // test 2 among the passers
    let f2 = 0, p2 = 0;
    for (const c of CAPS.filter((q) => q.lane === lane && !q.fail1)) {
      if (pass2.includes(c.j)) { c.x2 = G2 + 260 + p2 * 170; c.away = 1; p2++; } else { c.fail2 = true; c.x2 = G2 - 110 - f2 * 150; f2++; }
    }
  }
  const tClone = a.drugs, tCool = a.drugs + .2;
  function capX(c, t) {
    // in the queue: gold clones slide out of the pill to the left, the cool stream comes in from the left
    let x;
    if (c.gold) x = lerp(SLOT(0), c.x0, expoOut(span(t, tClone + .3 + c.k * .07, tClone + 1.1 + c.k * .07)));
    else x = lerp(c.x0 - 2600, c.x0, expoOut(span(t, tCool + c.k * .06, tCool + 1.6 + c.k * .06)));
    const m1 = sineIO(span(t, c.t1, c.t1 + 1.25)); x = lerp(x, c.x1, m1);
    if (c.t2 != null) { x = lerp(x, c.x2, sineIO(span(t, c.t2, c.t2 + 1.25))); if (c.away) x += 120 * Math.max(0, t - c.t2 - 1.25); }
    return x;
  }
  const capOut = (c, t) => c.fail1 ? smooth(span(t, c.t1 + .9, c.t1 + 1.6)) : c.fail2 ? smooth(span(t, c.t2 + .9, c.t2 + 1.6)) : 0;   // its light goes out at the gate

  // ------------------------------------------------------------------------------------------------ camera
  const sEnd = DIVIDE.r / GR;
  const KEYS = [
    [T0, cam3()],
    [a.follow + 2.0, aim(F0, 1450, 600, .7, 960, 560)],
    [a.pharmacy2 + .9, aim(F0, 2000, 600, .6, 960, 560)],
    [a.firstAsks, aim(F0, 2350, 610, .6, 960, 560)],
    [a.safe + .5, aim(F0, 2500, 620, .62, 960, 560)],
    [a.help + .5, aim(F0, 3600, 620, .46, 960, 540)],
    [a.drugs + 1.2, aim(F0, 1950, 640, .58, 960, 560)],
    [a.half + .9, aim(F0, 2800, 630, .54, 960, 560)],
    [a.secondTest + 1.4, aim(F0, 4150, 630, .55, 960, 560)],
    [a.small + .5, aim(F0, 4350, 630, .56, 960, 560)],
    [a.limit + .6, aim(F0, 5000, 600, .34, 960, 540)],
    [a.faster + .2, aim(F0, 3650, 610, .45, 960, 540)],
    [a.years - .55, aim(F0, 3720, 615, .47, 960, 540)],
    [TEND, aim(F0, G2, PY, sEnd, DIVIDE.x, DIVIDE.y), 'q'],
  ];
  const cam = (t) => camDrift(camAt(t, KEYS), t, 1.6 * smooth(span(t, T0, T0 + 1.6)) * (1 - smooth(span(t, a.years - .7, TEND - .2))), 6);
  // the far pharmacy: placed so it sits at the far end of the path in the pull-back (6.05)
  const PH = (() => { const c = camAt(a.limit + .6, KEYS), [x, y] = U.invCard(c, ZP, 1700, project(c, F0, 0, PY)[1]); return { x, y }; })();

  // ------------------------------------------------------------------------------------------------ draw
  function draw(ctx, t) {
    const c = cam(t);
    const k = smooth(span(t, T0, T0 + 3)), kE = smooth(span(t, a.years - 1.2, TEND - .3));
    U.nightBg(ctx, t, { cy: lerp(560, 540, k), r: lerp(1200, 1250, k), mid: .5, wob: 5 * drift(t, 1, 3) * k * (1 - kE), lift: .35 * k * (1 - kE) });
    const dim = (1 - .75 * smooth(span(t, a.computer - .3, a.humanBody + .6))) * (1 - smooth(span(t, a.years - .5, TEND - .25)));   // the path and the capsules dim in 6.06, gone before the plate
    if (dim > 0) card(ctx, c, ZP, () => { ctx.globalAlpha = Math.min(1, dim * 3); pharmacy(ctx, t, dim); });
    card(ctx, c, F0, () => {
      lanes(ctx, t, dim);
      gates(ctx, t, 'back', dim);
      capsules(ctx, t, dim);
      gates(ctx, t, 'front', dim);
      labels(ctx, t);
    });
    cellAndRing(ctx, t, c);
  }

  function lanes(ctx, t, dim) {
    const fork = sineIO(span(t, tFork, tFork1)), x1 = 13000;
    const lineAt = (yT) => { const p = new Path2D(); p.moveTo(-2600, PY); p.lineTo(FORK, PY); p.bezierCurveTo(FORK + 160, PY, FORK + 160, lerp(PY, yT, fork), FORK + 320, lerp(PY, yT, fork)); p.lineTo(x1, lerp(PY, yT, fork)); return p; };
    const grad = (al) => E.lin(ctx, -2600, 0, x1, 0, [[0, rgba(P.halo1, 0)], [.12, rgba(P.halo1, al)], [.5, rgba(P.halo1, al * .8)], [.8, rgba(P.halo1, al * .25)], [1, rgba(P.halo1, 0)]]);
    const reveal = expoOut(span(t, T0 + .1, T0 + 2.6)) * 15000;   // the path draws itself out of the capsule, both ways
    ctx.save(); ctx.beginPath(); ctx.rect(PILL.x - reveal, -4000, 2 * reveal, 9000); ctx.clip();
    for (const [yT, col] of [[LG, P.halo1], [LC, P.blue2]]) {
      const p = lineAt(yT);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(16px)'; ctx.strokeStyle = grad(.35 * dim); ctx.lineWidth = 26; ctx.stroke(p); ctx.restore();
      ctx.strokeStyle = yT === LC && fork > 0 ? E.lin(ctx, -2600, 0, x1, 0, [[0, rgba(COOL_HI, 0)], [.12, rgba(COOL_HI, .8 * dim)], [.6, rgba(COOL_HI, .5 * dim)], [1, rgba(COOL_HI, 0)]]) : grad(.95 * dim);
      ctx.lineWidth = 3; ctx.stroke(p);
    }
    E.dust(ctx, 1571, 500, 3000, PY - 40, 2600, 70, t, .35 * dim, P.halo2);
    ctx.restore();
  }
  function gates(ctx, t, half, dim) {
    const f1 = sineIO(span(t, a.computer - .3, a.computer + .9)), f2 = sineIO(span(t, a.humanBody - .9, a.humanBody + .3));
    const glow = (x) => 1 + .8 * Math.max(0, ...CAPS.map((c) => Math.max(0, 1 - Math.abs(capX(c, t) - x) / 90)));   // a gate brightens as a capsule passes
    if (f1 < 1) U.gateRing(ctx, G1, PY, lerp(GRX, GR, f1), GR, half, { glow: glow(G1) * dim, col: mixHex(P.halo2, COOL_HI, f1) });
    if (f2 < 1) U.gateRing(ctx, G2, PY, lerp(GRX, GR, f2), GR, half, { glow: glow(G2) * dim });
  }
  function capsules(ctx, t, dim) {
    // 6.01–6.02: the pill (from the plate) closes and rolls to gate 1; at "drugs" it becomes the first gold capsule
    if (t < tClone + 1.2) {
      const roll = sineIO(span(t, tRoll0, tRoll1)), close = 1 - Math.pow(1 - span(t, T0, T0 + .9), 2.4);   // the halves snap shut (starts at once)
      const toSlot = sineIO(span(t, tClone - .1, tClone + .6));
      const w = lerp(PILL.w, CW, toSlot), x = lerp(lerp(PILL.x, PILLX, roll), SLOT(0), toSlot);
      const yRest = PY - PILL.w * .42 / 2 - 6, yLane = LG - CH / 2 - 4;
      const yy = lerp(lerp(PILL.y + 5 * drift(t, 1, 7), yRest, sineIO(span(t, T0 + .3, tRoll0 + .6))), yLane, toSlot);
      const rot = .02 * drift(t * .7, 1, 2) * (1 - roll) + .03 * Math.sin((x - PILL.x) / 60) * roll * (1 - toSlot);
      if (t >= tClone + .3) return capsulesQueue(ctx, t, dim);
      F.pill(ctx, x, yy, w, t, { split: .55 * (1 - close), lit: [1, lerp(.12, 1, close)], rot, dust: 600 });
      if (t > tCool) capsulesQueue(ctx, t, dim, true);
      return;
    }
    capsulesQueue(ctx, t, dim);
  }
  function capsulesQueue(ctx, t, dim, coolOnly) {
    for (const c of CAPS) {
      if (coolOnly && c.gold) continue;
      const x = capX(c, t), out = capOut(c, t), y = c.y - CH / 2 - 4 + 1.5 * Math.sin(t * 1.4 + c.k);
      if (x < -3000) continue;
      if (out > 0) {   // a dark capsule (it did not pass): the light goes out of it
        const p = new Path2D(); p.roundRect(x - CW / 2, y - CH / 2, CW, CH, CH / 2);
        ctx.save(); ctx.globalAlpha = Math.min(1, dim * 2.5);
        ctx.fillStyle = E.lin(ctx, 0, y - CH / 2, 0, y + CH / 2, [[0, P.ind2], [1, P.night1]]); ctx.fill(p); ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke(p); ctx.restore();
      }
      if (out < 1) F.pill(ctx, x, y, CW, t, { lit: c.gold ? [1, 1] : [.12, .12], a: (1 - out) * (c.away ? lerp(1, .55, 1 - dim) : dim), dust: c.gold ? 120 : 0 });
    }
  }
  function labels(ctx, t) {
    // the gate words rise from their baseline under each gate
    U.capsLine(ctx, 'safe?', G1, PY + GR + 150, 92, span(t, a.safe - .15, a.safe + .7) * (1 - span(t, a.drugs - .3, a.drugs + .2)), { align: 'center' });
    U.capsLine(ctx, 'does it help?', G2, PY + GR + 150, 92, span(t, a.help - .15, a.help + .7) * (1 - span(t, a.drugs - .3, a.drugs + .2)), { align: 'center' });
    const u1 = span(t, a.nine - .1, a.nine + 1.2) * (1 - span(t, a.secondTest - .4, a.secondTest + .1));
    U.numBlock(ctx, { x: G1 + 170, y: 250, num: '9 in 10', label: 'pass the first test', src: 'Jayatunga et al. · Drug Discovery Today 2024', u: u1, size: 190, labelSize: 52, srcSize: 32, gap: 80 });
    const u2 = span(t, a.noBetter - .15, a.noBetter + 1.0) * (1 - span(t, a.limit - .5, a.limit));
    U.numBlock(ctx, { x: G2 + 170, y: 250, label: ['no better in test 2'], src: 'small sample · same source', u: u2, labelSize: 84, srcSize: 38, gap: -40 });
  }
  function pharmacy(ctx, t, dim) {
    const { x, y } = PH, w = 300, h = 200;
    const p = new Path2D(); p.moveTo(x - w / 2, y); p.lineTo(x - w / 2, y - h); p.lineTo(x, y - h - 50); p.lineTo(x + w / 2, y - h); p.lineTo(x + w / 2, y); p.closePath();
    ctx.fillStyle = E.lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, P.night1], [1, P.ind2]]); ctx.fill(p); ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 4; ctx.stroke(p);
    const wr = new Path2D(); wr.rect(x - 40, y - h * .62, 80, 70);
    E.glowFill(ctx, wr, 40, .8, P.halo1); ctx.fillStyle = E.rad(ctx, x, y - h * .5, 70, [[0, P.core0], [1, P.halo1]]); ctx.fill(wr);
    ctx.fillStyle = P.shade0; ctx.fillRect(x - 6, y - h * .62 + 13, 12, 44); ctx.fillRect(x - 22, y - h * .62 + 29, 44, 12);   // the cross in the lit window
  }

  // 6.06 · the ring (gate 1 turned to face us, spinning fast) and the cell (gate 2 turned, filling with light, dividing slowly).
  // Both in screen space at their projected places; the cell blends onto the plate's exact cell at the end.
  function cellAndRing(ctx, t, c) {
    const f1 = sineIO(span(t, a.computer - .3, a.computer + .9)), f2 = sineIO(span(t, a.humanBody - .9, a.humanBody + .3));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (f1 >= 1) {
      const [x, y, k] = project(c, F0, G1, PY), sp = expoOut(span(t, a.faster - .4, a.faster + .6));
      F.reticle(ctx, x, y, GR * k, t, { rot: .3 + 1.2 * (t - a.computer) + 5.5 * Math.max(0, t - a.faster + .4) * sp });
    }
    if (f2 >= 1) {
      let [x, y, k] = project(c, F0, G2, PY); let r = GR * k;
      const e = smooth(span(t, TEND - .7, TEND)), py = DIVIDE.y + 4 * drift(t, 1, 5);
      x = lerp(x, DIVIDE.x, e); y = lerp(y, py, e); r = lerp(r, DIVIDE.r, e);
      const fillU = expoOut(span(t, a.humanBody + .25, a.humanBody + 1.2));
      const split = DIVIDE.split * sineIO(span(t, a.humanBody + .9, TEND));
      E.dust(ctx, 198, 520, 960, 540, 900, 460, t, .45 * smooth(span(t, a.years - 1.2, TEND - .1)), COOL_HI);
      if (fillU < 1) U.gateRing(ctx, x, y, r, r, 'all', {});
      F.cell(ctx, x, y, r * lerp(.12, 1, fillU), t, { split, rot: DIVIDE.rot + .01 * drift(t * .5, 1, 9), dust: 500 });
    }
    ctx.restore();
  }

  return { draw, KEYS, cam };
}
