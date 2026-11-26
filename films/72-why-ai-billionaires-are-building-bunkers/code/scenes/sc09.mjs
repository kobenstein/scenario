// c09 · B3 · 'But follow the trail' → 'This channel exists' (p910). THE TURN. One continuous take, no cut inside:
// the evidence board (out of plateBoard) → a gold thread runs pin to pin → the test row → the fourth card → the card becomes THE LIST →
// row 4 peels to US and is circled → the circle opens into the Leitbild (ANCHOR 2/3) → the gains flow to a few → you among the lanterns →
// the hatch mouth opens over the whole frame: the view from inside, up through the round opening → up out of it onto THE GROUND LINE,
// the hatch in section, the new question card (p910).
//
// | ID    | anchor (phrase)                  | zeigt wörtlich                           | picture                                                                         | layer  | carrier out |
// |-------|----------------------------------|------------------------------------------|---------------------------------------------------------------------------------|--------|-------------|
// | 5.01★ | But follow the trail             | follow the trail                          | plateBoard; a gold thread comes in from the left and runs to the first pin       | EXPL   | the thread  |
// | 5.02  | Guards                           | guards                                    | the thread reaches GUARDS, the card lights gold                                  | EXPL   | the thread  |
// | 5.03  | Locks                            | locks                                     | … LOCKS                                                                          | EXPL   | the thread  |
// | 5.04  | Mutiny plans                     | mutiny plans                              | … MUTINY PLANS                                                                   | EXPL   | the row     |
// | 5.05  | None of that stops a storm       | none of that stops a storm                | a test row under the line: A STORM ✗                                             | EXPL   | the row     |
// | 5.06  | Or a bomb                        | or a bomb                                 | A BOMB ✗                                                                         | EXPL   | the row     |
// | 5.07  | Or a machine                     | or a machine                              | A MACHINE ✗                                                                      | EXPL   | the pin     |
// | 5.08  | It's built against people        | built against people                      | the thread runs to the 4th pin, a gold card unfolds: BUILT AGAINST PEOPLE         | EXPL   | the card    |
// | 5.09  | They're not hiding from the A.I. | not hiding from the AI                    | cards 1–3 fold, the thread rolls up, the 4th card becomes THE LIST (rows 1–3 resolved, row 2 CROSSED OFF lights) | EXPL | row 4 |
// | 5.10  | They're hiding from us           | they're hiding from us                    | row 4's bar peels: US, circled in gold; the circle opens into the valley          | ANCHOR | the lanterns|
// | 5.11  | From a world where the gains     | the gains go to a few, everyone angry     | gold flows from the crowd to three figures at the hatch (a huge pool): THE GAINS → A FEW; the crowd dims, lanterns flare | MIX | the crowd |
// | 5.12  | You probably don't feel          | you don't feel like a threat              | you in the yellow coat among the lanterns, a shopping bag                         | ANCHOR | the hatch   |
// | 5.13  | But from behind that door        | from behind that door the fear makes sense| the hatch mouth grows over the frame: from inside the shaft up through the round opening, the crowd's heads and lanterns over the rim | ANCHOR | the opening |
// | 5.14  | So what would make               | what would make the bunker unnecessary?   | up out of the opening onto the line: the hatch in section, lanterns both sides; the question card rises (p910) | EXPL | the card |
import { E, F, S, X, LY, TAU, lab, view, seamKeys, keyed, xmark, stage910, P910, PL910, p910 } from '../lib/b3_common.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, halo, rad, lin, prng } = E;
const { GOLD, COOL, CREAM, PAPER, CONCRETE, SOURCES: SRC } = F;
const PR = F.PRINT72;

const B = S.PBOARD, PIN4 = B.pin4, C4 = { x: PIN4[0], y: PIN4[1] - 4 + 75, w: 420, h: 150 };
const TEST = [560, 960, 1360], TEST_Y = 735;
const LISTP = { x: 960, y: 392, s: .8 };
const FEW = [[1268, 850, 116], [1330, 836, 108], [1392, 824, 112]];
const YOU = { x: 720, y: 968, h: 172 };
const OPEN = { x: 960, y: 380, r: 300 };   // the round opening seen from inside the shaft (screen)

export default async (T, R) => {
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    trail: R.a, guards: G('Guards'), locks: G('Locks'), mutiny: G('Mutiny plans'), none: G('None of that'), storm: G('a storm'), bomb: G('Or a bomb'),
    machine: G('Or a machine'), built: G("It's built against"), people: G('against people'), notH: G("They're not hiding"), theAI: G('from the', 0) + .2,
    hidingUs: G("They're hiding from"), us: G('us'), world: G('From a world'), gains: G('gains of'), few: G('to a few'), everyone: G('everyone else'),
    angry: G('gets angry'), you: G('You probably'), threat: G('a threat'), behind: G('But from behind'), fear: G('the fear makes'), so: G('So what would'),
    unn: G('unnecessary'), end: R.b,
  };
  const tP = A.end - S.SEAM_HALF;
  const tCirc = [A.us + .4, A.us + 2.9];           // the circle opens into the valley
  const tDive = [A.behind + .3, A.behind + 1.6];     // the hatch mouth grows over the frame
  const tRise = [A.so + .05, A.so + 1.45];           // up out of the opening

  // ---------------------------------------------------------------- the board / list part (screen + sheet), view
  const VB = [...seamKeys(T, 'But follow the trail', B.view), [A.mutiny + .4, { x: 1000, y: 505, s: 1.02 }], [A.built - .2, { x: 1020, y: 500, s: 1.0 }], [A.notH + 1.2, { x: 1010, y: 495, s: 1.0 }], [tCirc[1], { x: 1000, y: 490, s: 1.02 }]];
  const vBoard = (t) => view(t, VB);
  const thr = [[[-220, 250], null, A.trail + .45, A.guards - .02], [null, null, A.guards, A.locks - .02], [null, null, A.locks, A.mutiny - .02], [null, PIN4, A.people - .25, A.people + .45]];
  const cardLit = (t, i) => span(t, [A.guards, A.locks, A.mutiny][i] - .1, [A.guards, A.locks, A.mutiny][i] + .3);
  const fold = (t, i) => sineIO(span(t, A.notH - .2 + i * .09, A.notH + .55 + i * .09));
  const rollUp = (t) => span(t, A.notH - .35, A.notH + .45);
  const morph = (t) => quartIO(span(t, A.notH + .25, A.notH + 1.25));
  const c4u = (t) => sineIO(span(t, A.people + .3, A.people + .95));
  function board(ctx, t, v) {
    X.ground(ctx, t, v, { lx: 960, ly: 420, pool: .85 });
    X.inView(ctx, v, (s) => {
      const pins = B.cards.map(([x, y, r], i) => {
        const f = fold(t, i); if (f >= 1) return [x, y - 71];
        ctx.save(); const by = y + 75; ctx.translate(0, by); ctx.scale(1, Math.max(.001, 1 - f)); ctx.translate(0, -by);
        const p = F.evidenceCard(ctx, t, x, y, SRC.trail[i], { rot: r, lit: Math.max(cardLit(t, i), span(t, A.people + .2, A.people + .8)) }).pin; ctx.restore(); return p; });
      // the pin of the 4th card (it was there on the plate) and the 4th card unfolding down from it
      const [px, py] = PIN4, cu = c4u(t), m = morph(t);
      if (cu > 0 && m <= 0) { ctx.save(); ctx.translate(0, py); ctx.scale(1, Math.max(.001, cu)); ctx.translate(0, -py);
        F.evidenceCard(ctx, t, C4.x, C4.y, SRC.againstPeople, { w: C4.w, size: 27, lit: 1 }); ctx.restore(); }
      if (m <= 0) { ctx.fillStyle = mixHex(CREAM, CONCRETE.lit, .3); ctx.beginPath(); ctx.arc(px, py, 9, 0, TAU); ctx.fill(); }
      // test row under the line: A STORM ✗ · A BOMB ✗ · A MACHINE ✗
      const tw = [A.storm, A.bomb, A.machine];
      TEST.forEach((x, i) => { const u = lab(t, tw[i] - .15, A.built + .5); if (u <= 0) return;
        X.label(ctx, SRC.stopsNot[i], x - 26, TEST_Y, u, { size: 30, spacing: .14 });
        const w = F.measure(SRC.stopsNot[i], 30, false, 700) + SRC.stopsNot[i].length * 30 * .12;
        ctx.save(); ctx.globalAlpha *= clamp(u * 2); xmark(ctx, x - 26 + w / 2 + 34, TEST_Y - 11, 13, span(t, tw[i] + .3, tw[i] + .8) * (u < 1 && t > A.built ? u : 1), { s }); ctx.restore(); });
    });
  }
  // the thread is drawn with partial spans (grow and roll-up) here, on top of the board, in the same view
  function threads(ctx, t, v) {
    const ru = rollUp(t); if (ru >= 1) return;
    X.inView(ctx, v, () => {
      const pins = B.cards.map(([x, y]) => [x, y - 71]);
      thr.forEach(([a0, b0, t0, t1], k) => {
        const a = a0 ?? pins[k - 1], b = b0 ?? pins[k], u = sineIO(span(t, t0, t1)); if (u <= 0) return;
        const r0 = clamp(ru * 4 - k), sag = k ? 34 : 60;
        const pts = Array.from({ length: 21 }, (_, i) => { const f = i / 20; return [lerp(a[0], b[0], f), lerp(a[1], b[1], f) + Math.sin(Math.PI * f) * sag]; });
        F.goldSpan(ctx, pts, r0, u, { w: 2.6, spark: u < 1 });
      });
    });
  }
  // the list (screen)
  function listRows(t) {
    const a = A.notH + 1.05, w = (i) => span(t, a + i * .16, a + i * .16 + .35), st = (i) => span(t, a + .25 + i * .16, a + .6 + i * .16);
    const peel = span(t, A.hidingUs - .1, A.hidingUs + .6), circ = span(t, A.us - .05, A.us + .55);
    return [
      { num: w(0), write: w(0), strike: st(0), kind: 'thin', verdict: SRC.verdicts[0], vu: st(0) },
      { num: w(1), write: w(1), strike: st(1), kind: 'bold', verdict: SRC.verdicts[1], vu: st(1), lit: span(t, A.theAI - .1, A.theAI + .3) * (1 - span(t, A.hidingUs - .2, A.hidingUs + .3)), big: F.bump(t, A.theAI - .1, .9) * .5 },
      { num: w(2), write: w(2), strike: st(2), kind: 'half', verdict: SRC.verdicts[2], vu: st(2) },
      { num: w(3), redact: 1, peel, write: span(peel, .35, 1), lit: span(t, A.hidingUs + .2, A.hidingUs + .6), circle: circ },
    ];
  }
  function list(ctx, t, v) {
    const m = morph(t); if (m <= 0) return null;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const Lw = F.LIST.w * LISTP.s, Lh = (F.LIST.head + F.LIST.row * 4 + 36) * LISTP.s;
    let out = null;
    if (m < 1) {   // the 4th card's paper reshapes into the list card
      const [cx, cy] = X.toScreen(v, C4.x, C4.y), cw = C4.w * v.s, ch = C4.h * v.s;
      const x = lerp(cx, LISTP.x, m), y = lerp(cy, LISTP.y, m), w = lerp(cw, Lw, m), h = lerp(ch, Lh, m), r = lerp(0, -.012, m);
      ctx.save(); ctx.translate(x, y); ctx.rotate(r);
      ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-w / 2 + 8 * LISTP.s, -h / 2 + 12 * LISTP.s, w, h, 8); ctx.fill();
      ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 6); ctx.fill();
      ctx.strokeStyle = rgba(mixHex(PAPER.edge, GOLD.mid, 1 - m), .9); ctx.lineWidth = lerp(4, 2 * LISTP.s, m); ctx.stroke();
      const tu = 1 - span(m, 0, .35); if (tu > 0) { const sz = 27 * v.s, tw = F.measure(SRC.againstPeople, sz, false, 700) + SRC.againstPeople.length * sz * .06;
        F.maskLine(ctx, [[SRC.againstPeople, 0]], -tw / 2, 12 * v.s, sz, F.rise(tu), { serif: false, weight: 700, col: mixHex(PAPER.ink, GOLD.deep, 1), glow: false, spacing: .06 }); }
      ctx.restore();
    } else out = F.list(ctx, t, LISTP.x, LISTP.y, { s: LISTP.s, title: span(t, A.notH + 1.2, A.notH + 1.8), rows: listRows(t) });
    ctx.restore();
    return out;
  }

  // ---------------------------------------------------------------- the valley part (ANCHOR 2/3)
  const VV = [[tCirc[0], { x: 960, y: 548, s: 1.03 }], [tCirc[1] + .1, { x: 960, y: 540, s: 1.0 }], [A.angry + .3, { x: 990, y: 548, s: 1.02 }], [A.threat - .2, { x: 1080, y: 700, s: 1.08 }], [tDive[0], { x: 1084, y: 702, s: 1.09 }]];
  const vValley = (t) => view(t, VV);
  const gainsU = (t) => span(t, A.gains - .2, A.few + .5);
  const flowEnv = (t) => span(t, A.gains - .3, A.gains + .5) * (1 - span(t, A.angry + .2, A.you + .6));
  const dim = (t) => .42 * span(t, A.gains + .5, A.few + .9) * (1 - span(t, A.you - .3, A.threat));
  const FLOW = (() => { const r = prng(7331); return Array.from({ length: 54 }, () => [80 + r() * 820, 700 + r() * 300, r(), .8 + r() * .5]); })();
  const FLARE = (() => { const r = prng(7332); return Array.from({ length: 34 }, () => [40 + r() * 900, 660 + r() * 360, r() * 1.6, 12 + r() * 14]); })();
  function valleyOver(ctx, t, s) {
    // the few at the hatch, their pool of gold grows with the gains
    const g = gainsU(t), fx = (FEW[0][0] + FEW[2][0]) / 2, fy = FEW[1][1] - 60;
    halo(ctx, fx, fy, 140 + 420 * sineIO(g), .22 + .3 * g, GOLD.halo, GOLD.core);
    // the gains: gold specks drift from the crowd up and over to the few
    const fe = flowEnv(t);
    if (fe > 0) for (const [x0, y0, ph, sp] of FLOW) { const q = ((t * .42 * sp + ph) % 1), p = sineIO(q), cx = lerp(x0, fx, .5), cy = Math.min(y0, fy) - 220;
      const x = (1 - p) ** 2 * x0 + 2 * p * (1 - p) * cx + p * p * fx, y = (1 - p) ** 2 * y0 + 2 * p * (1 - p) * cy + p * p * fy;
      F.glowDot(ctx, x, y, 14, fe * Math.sin(Math.PI * q) * .9, 'gold'); }
    for (const [x, y, h] of FEW) { halo(ctx, x, y - h * .5, h * .9, .28, GOLD.halo, GOLD.core); F.person(ctx, x, y, h, { pose: 'stand', dir: 1, light: -1, rim: GOLD.line }); }
    // everyone else gets angry: the lanterns in the crowd flare, unevenly
    const an = span(t, A.everyone, A.angry + .2) * (1 - span(t, A.you, A.threat));
    if (an > 0) for (const [x, y, ph, r] of FLARE) { const f = Math.max(0, Math.sin(t * 7.3 + ph * 4) * Math.sin(t * 2.9 + ph * 7)); F.glowDot(ctx, x, y, r * (1 + f), an * (.35 + .65 * f), 'gold'); }
    // you, among the lanterns, a shopping bag
    halo(ctx, YOU.x + 10, YOU.y - YOU.h * .55, YOU.h * 1.1, .18 + .14 * span(t, A.you - .2, A.you + .6), GOLD.halo, GOLD.core);
    const hands = F.du(ctx, YOU.x, YOU.y, YOU.h, { pose: 'stand', dir: 1, light: 1, armL: [-.12, -.05] });
    const hp = hands && (hands.L || hands.R); if (hp) { const [bx, by] = hp, bw = YOU.h * .2, bh = YOU.h * .22;
      ctx.fillStyle = mixHex(PAPER.body, P.night1, .35); ctx.beginPath(); ctx.roundRect(bx - bw / 2, by + 2, bw, bh, 3); ctx.fill();
      ctx.strokeStyle = rgba(mixHex(PAPER.body, P.night1, .5), 1); ctx.lineWidth = 2 / s; ctx.beginPath(); ctx.arc(bx, by + 4, bw * .28, Math.PI, TAU); ctx.stroke(); }
    // the label (sky)
    X.label(ctx, SRC.gains, 1120, 380, lab(t, A.gains - .1, A.you - .2), { size: 36, spacing: .14, gold: .45 });
  }
  function valley(ctx, t, v) {
    S.valleyWorld(ctx, t, v, { flat: 0, open: .8, crowd: 1 - dim(t), you: false, over: (c, s) => valleyOver(c, t, s) });
  }
  // the hatch mouth on screen (for the dive)
  function mouth(v) { const h = S.HATCH_L, rx = h.w / 2, yt = h.y - h.w * .075 * Math.sqrt(1 - h.tilt * h.tilt), [sx, sy] = X.toScreen(v, h.x, yt); return { x: sx, y: sy, rx: rx * .8 * v.s, ry: rx * .8 * h.tilt * v.s }; }

  // ---------------------------------------------------------------- inside the shaft, looking up (screen space)
  const HEADS = (() => { const r = prng(7333); return Array.from({ length: 26 }, (_, i) => [i / 26 * TAU + (r() - .5) * .18, .9 + r() * .2, r() * 6, r() < .78]); })();
  function inside(ctx, t, cx, cy, z, rr) {   // z: scale of the shaft picture; rr: the radius the ring of heads stands at (≥ the opening)
    const R0 = OPEN.r * z, rim = Math.max(R0, rr ?? 0);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = rad(ctx, cx, cy, 1500 * z, [[0, mixHex(CONCRETE.shade, GOLD.shade, .25)], [.35, CONCRETE.deep], [1, P.night0]], R0); ctx.fillRect(0, 0, W, H);
    // the shaft's rings (segments) receding to the opening, and the stipple of concrete
    for (let i = 1; i < 8; i++) { const r = R0 * Math.pow(1.38, i); ctx.strokeStyle = rgba(CREAM, .1 + .05 * (8 - i) / 8); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); }
    // the ladder coming up from below
    ctx.strokeStyle = rgba(mixHex(GOLD.line, CREAM, .4), .55); ctx.lineWidth = 4 * z; ctx.lineCap = 'round'; ctx.beginPath();
    const lb = [cx - 46 * z, cy + R0 * .96], rb = [cx + 46 * z, cy + R0 * .96], la = [cx - 330 * z, cy + 2400 * z], ra = [cx + 330 * z, cy + 2400 * z];
    ctx.moveTo(...lb); ctx.lineTo(...la); ctx.moveTo(...rb); ctx.lineTo(...ra);
    for (let k = 1; k < 9; k++) { const f = Math.pow(k / 9, 1.8); ctx.moveTo(lerp(lb[0], la[0], f), lerp(lb[1], la[1], f)); ctx.lineTo(lerp(rb[0], ra[0], f), lerp(rb[1], ra[1], f)); }
    ctx.stroke();
    halo(ctx, cx, H + 160, 900, .38, GOLD.halo, GOLD.core);   // the shaft's own light from below
    // the opening: night sky; the crowd leans over the rim, their lanterns above us
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R0, 0, TAU); ctx.clip();
    ctx.fillStyle = rad(ctx, cx, cy, R0, [[0, mixHex(P.ind1, P.blue0, .3)], [1, P.night1]]); ctx.fillRect(cx - R0, cy - R0, R0 * 2, R0 * 2);
    E.stars(ctx, 7334, 40, t, [cx - R0, cy - R0, R0 * 2, R0 * 2], .7);
    ctx.restore();
    ctx.strokeStyle = rgba(CONCRETE.edge, .6); ctx.lineWidth = 6 * z; ctx.beginPath(); ctx.arc(cx, cy, R0 + 3 * z, 0, TAU); ctx.stroke();
    const ink = mixHex(P.night0, P.ind2, .55), hz = z * Math.max(1, rim / R0) ** .5;
    for (const [a, k, ph, lamp] of HEADS) {
      const sway = Math.sin(t * .9 + ph) * .02, ca = Math.cos(a + sway), sa = Math.sin(a + sway), rb2 = rim * 1.0, hd = rim * (.9 - .03 * k);
      ctx.fillStyle = ink; ctx.beginPath(); ctx.ellipse(cx + ca * rb2, cy + sa * rb2, 44 * hz * k, 24 * hz * k, a + Math.PI / 2, 0, TAU); ctx.fill();   // shoulders
      ctx.beginPath(); ctx.arc(cx + ca * hd, cy + sa * hd, 19 * hz * k, 0, TAU); ctx.fill();                                             // the head, leaning in
      ctx.strokeStyle = rgba(mixHex(P.blue1, CREAM, .3), .35); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx + ca * hd, cy + sa * hd, 19 * hz * k, a + Math.PI - .9, a + Math.PI + .9); ctx.stroke();
      if (lamp) F.glowDot(ctx, cx + Math.cos(a + .2) * rim * .86, cy + Math.sin(a + .2) * rim * .84, 42 * hz, .75 + .2 * Math.sin(t * 6 + ph * 3), 'gold');
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------- the stage at the end (p910)
  const VS = [[tRise[0], { x: 960, y: 728, s: 1.25 }], [tRise[1] + .2, { x: 960, y: 575, s: 1.03 }], [tP, P910.V]];
  const vStage = (t) => view(t, VS);
  const stageO = (t) => ({ ...PL910, card: span(t, A.unn - .55, A.unn + .35) });

  // ---------------------------------------------------------------- the take
  function draw(ctx, t) {
    if (t < tCirc[1]) {
      const v = vBoard(t); board(ctx, t, v); threads(ctx, t, v); const L = list(ctx, t, v);
      if (t > tCirc[0] && L) {   // the gold circle round US opens into the valley
        const row = L.rows[3], r0 = (row.tw / 2 + 46) * LISTP.s, cu = span(t, tCirc[0], tCirc[1]), m = lerp(cu, sineIO(cu), .35), r = r0 * Math.pow(2300 / r0, m), cx = row.x + 8 * LISTP.s, cy = row.y;
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.ellipse(cx, cy, r, 48 * LISTP.s * Math.pow(2300 / (48 * LISTP.s), m), 0, 0, TAU); ctx.clip();
        valley(ctx, t, vValley(t)); ctx.restore();
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.goldSpan(ctx, F.arcPts(cx, cy, r, 48 * LISTP.s * Math.pow(2300 / (48 * LISTP.s), m), 0, TAU, 90), 0, 1, { w: lerp(4.5, 6.5, m), spark: false, a: 1 - span(m, .35, .8) }); ctx.restore();
      }
      return;
    }
    if (t < tDive[1]) {
      const v = vValley(t); valley(ctx, t, v);
      if (t > tDive[0]) { const mo = mouth(v), m = quartIO(span(t, tDive[0], tDive[1])), cx = lerp(mo.x, 960, m), cy = lerp(mo.y, OPEN.y, m);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.ellipse(cx, cy, lerp(mo.rx, 1500, m), lerp(mo.ry, 1500, m), 0, 0, TAU); ctx.clip();
        inside(ctx, t, cx, lerp(mo.y, OPEN.y, m), lerp(.2, 1, m)); ctx.restore(); }
      return;
    }
    if (t < tRise[1]) {
      inside(ctx, t, OPEN.x, OPEN.y, 1, OPEN.r * lerp(1, 5.6, quartIO(span(t, tRise[0], tRise[1]))));
      if (t > tRise[0]) { const m = quartIO(span(t, tRise[0], tRise[1])), r = lerp(OPEN.r, 1650, m);
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(OPEN.x, OPEN.y, r, 0, TAU); ctx.clip();
        stage910(ctx, t, vStage(t), stageO(t)); ctx.restore(); }
      return;
    }
    stage910(ctx, t, vStage(t), stageO(t));
  }
  const marks = [R.a + S.SEAM_HALF, A.guards, A.mutiny, A.storm, A.built, A.notH, A.us, A.world, A.you, A.behind, A.fear, A.so, A.unn];
  return [{ t: R.a, draw: (ctx, t) => S.plateBoard(ctx, t, T), print: PR }, ...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => p910(ctx, t, T), print: PR }];
};
