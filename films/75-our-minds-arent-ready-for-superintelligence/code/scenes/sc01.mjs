// c01 · HOOK (lead, the quality reference) · "Our minds aren't ready" → "To see what it is" (plateSofa).
// A motion-design sequence, not a world ride: every sentence gets its own picture that shows exactly what it says; the pictures hand over
// through carrier objects (the sphere floods → the gold disc on THE WALL · the BRAIN UPGRADE bar → your phone screen · the pulse runs from
// your chest back through the cave animals into the stone head · the disc runs off → THE GAP · the spark splits into the two dashed clocks
// · the ring lands on your chest, the gauges fly into the HUD). Leitbild only in H.01–H.02 (anchor 1 of 4). Wow ★ = THE GAP (H.16).
//
// | ID    | anchor (phrase)                         | zeigt wörtlich                                                        | kind   | carrier out                  |
// |-------|-----------------------------------------|-----------------------------------------------------------------------|--------|------------------------------|
// | H.01  | Our minds aren't ready                  | thumbnail A: the gold sphere rises, you raise the hand axe; the title | ANCHOR | the sphere                   |
// | H.02  | We have godlike AI and Stone Age brains | GODLIKE AI → the sphere · STONE AGE BRAINS → you with the hand axe     | ANCHOR | the sphere floods the frame  |
// | H.03  | AI gets more capable every few months   | the flood shrinks to a gold disc; it grows in jumps, each leaves a ring: MORE CAPABLE · EVERY FEW MONTHS | EXPL | the disc |
// | H.04  | And you can't upgrade a brain           | a stone head beside the disc; BRAIN UPGRADE bar stuck at 0%          | EXPL   | the bar                      |
// | H.05  | You can feel that tonight               | the bar flies down the wall and becomes your phone screen: the sofa   | SCENE  | the phone                    |
// | H.06  | A headline about AI lands on your screen| push into the phone, the headline drops onto it                       | EXPL   | the headline                 |
// | H.07  | Big letters                             | its bars grow thick                                                   | EXPL   | —                            |
// | H.08  | Bad news                                | two bars turn ochre, underlined                                       | EXPL   | pull back                    |
// | H.09  | Your pulse jumps                        | an ochre pulse rises from your chest and spikes                       | EXPL   | the pulse line               |
// | H.10  | Your thumb is already moving            | the thumb swipes the headline before you read it                      | EXPL   | —                            |
// | H.11  | You decided none of it                  | the sofa, the three marked in ochre: YOU DECIDED NONE OF IT           | MIX    | the pulse runs left          |
// | H.12  | That reflex is older than our species   | the pulse runs back along the wall: a hunter, a wolf, a mouse light up | EXPL  | the pulse turns up           |
// | H.13  | So if your brain can't catch up … what can? | the pulse hits the stone head; the disc runs off right: WHAT CAN CATCH UP? | EXPL | the "?" → a spark   |
// | H.14  | Something can                           | a small yellow spark between head and disc                            | MIX    | —                            |
// | H.15  | Because the danger was never the machine| NOT THE MACHINE under the disc                                        | EXPL   | —                            |
// | H.16★ | It's the gap                            | THE GAP springs open between head and disc                            | EXPL   | the two ends                 |
// | H.17  | The machine's clock is racing           | the disc becomes a racing gold counter                                | EXPL   | —                            |
// | H.18  | The brain's clock barely moves          | the head becomes a flint tally; one scratch, slowly                   | EXPL   | the spark                    |
// | H.19  | But the brain isn't your only clock     | the spark splits into two dashed gauges: NOT YOUR ONLY CLOCK          | EXPL   | —                            |
// | H.20  | Two others can be set                   | the two outlines twitch, ready: TWO CAN BE SET                        | EXPL   | the ground line              |
// | H.21  | The slower takes a whole society        | a crowd rises and pushes the cog one notch: A WHOLE SOCIETY           | EXPL   | —                            |
// | H.22  | The faster takes a single person        | one person under the ring, it turns faster: ONE PERSON                | EXPL   | the ring                     |
// | H.23  | And you are carrying it right now       | the ring flies onto your chest on the sofa, the gauges into the HUD   | MIX    | → plateSofa                  |
import { createCanvas } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f75_kit.mjs';
import * as S from '../lib/f75_world.mjs';
import * as X from '../lib/f75_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, quartIO, expoOut, expoIn, halo } = E;
const { GOLD, COOL, CREAM, OCHRE, COAT, HUD, SOURCES: SRC } = F;
const PR = F.PRINT75;
const SKIN = mixHex(P.shade0, P.core1, .4);

export default async (T, R) => {
  const G = (p, n = 0, after) => T.G(p, n, after), GE = (p, n = 0, after) => T.GE(p, n, after);
  const A = {
    godlike: G('godlike AI'), stone: G('Stone Age brains'), h2e: GE('Stone Age brains'),
    capable: G('AI gets more capable'), months: G('every few months'), upgrade: G("And you can't upgrade"), upE: GE("can't upgrade a brain"),
    tonight: G('You can feel that tonight'), headline: G('A headline about AI'), lands: G('lands on your screen'), big: G('Big letters'), bad: G('Bad news'),
    pulse: G('Your pulse jumps'), jumps: G('jumps'), thumb: G('Your thumb is already'), decided: G('You decided none'), older: G('That reflex is older'), species: G('our species'),
    q: G("So if your brain can't"), brain: G("brain can't catch"), catchup: G('catch up in time'), whatcan: G('what can'),
    something: G('Something can'), danger: G('Because the danger'), machine: G('never the machine'), gap: G("It's the gap"), racing: G("The machine's clock is racing"),
    barely: G("The brain's clock barely"), only: G("But the brain isn't your only"), two: G('Two others can be set'), slower: G('The slower takes'), society: G('a whole society'),
    faster: G('The faster takes'), single: G('a single person'), carry: G('And you are carrying it'), hud: GE('And you are carrying it right now'), end: R.b,
  };
  const tP = A.end - S.SEAM_HALF;
  const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));

  // ---------------------------------------------------------------- geometry on THE WALL (wall units)
  // the machine: a gold disc that GROWS in jumps (one jump = a few months), each jump leaves a growth ring of light behind (no steps, no stairs)
  const DISC0 = { x: 1250, y: 560 }, DR0 = 60, DSTEP = 18, NJ = 5, DRMAX = DR0 + NJ * DSTEP;
  const HEAD = { x: 360, y: 820, h: 360 }, NODE = [HEAD.x + .06 * HEAD.h, HEAD.y - .6 * HEAD.h];
  const BAR = { x: 215, y: 860, w: 300, h: 28 };
  const RUN = { y: DISC0.y, x1: 3050 };
  const FLINT = { x: 360, y: 650, s: 380 }, CNT = { x: RUN.x1, y: RUN.y, s: 440 }, GAPY = 200;
  const COG = { x: 1300, y: 1090, r: 130 }, RING = { x: 2200, y: 1090, r: 110 }, SPARK = { x: 1750, y: 1090 }, GROUND = 1420, QY = 860;
  // the sofa (shared with plateSofa) and its geometry: measured once on a scratch canvas
  const geo = S.sofaScene(createCanvas(8, 8).getContext('2d'), 0);
  const PH = { x: geo.phone.x + geo.phone.w / 2, y: geo.phone.y + geo.phone.h / 2 }, CHEST = geo.chest;
  const PY = 1770, PX = CHEST[0] + 113, PULSE = [[CHEST[0], CHEST[1]], [PX, CHEST[1]], [PX, PY], [-1000, PY], [-1000, NODE[1]], [NODE[0], NODE[1]]];   // out of the heart, past your shoulder, up, left
  const L1 = (PX - CHEST[0]) + (CHEST[1] - PY), L2 = PX + 1000, L3 = PY - NODE[1], LT = L1 + L2 + L3 + (NODE[0] + 1000);
  const ANIMALS = [['hunter', 420, 1905, 250], ['wolf', -120, 1895, 165], ['mouse', -600, 1885, 88]].map(([k, x, y, h]) => ({ k, x, y, h, s: L1 + (PX - x) }));
  const SPIKE0 = L1 + 150;

  // ---------------------------------------------------------------- the disc on the steps (hops), then its run
  const JUMPS = [A.capable + 1.07, A.months + .3, A.months + .85,   // the first jump right after the flood lands (FLOOD.d1)
                 A.upgrade + .45, A.upE + .3], JD = .5;
  function discPos(t) {
    let n = 0; for (const j of JUMPS) n += expoOut(span(t, j, j + JD)) * (1 + .08 * Math.sin(Math.PI * span(t, j, j + JD)));   // a jump with a small overshoot
    const lastLand = JUMPS.filter((j) => t >= j).pop(), r = DR0 + DSTEP * n;
    const ru = span(t, A.catchup - .1, A.catchup + 1.5), rx = ru > 0 ? lerp(DISC0.x, RUN.x1, expoOut(ru) * .25 + .75 * sineIO(ru)) + 3 * Math.max(0, t - (A.catchup + 1.5)) : DISC0.x;
    return { x: rx, y: DISC0.y, r, n: JUMPS.filter((j) => t >= j + .1).length, steps: lastLand != null && t - lastLand < .8 ? (t - lastLand) * 2 : 0, run: ru };
  }

  // ---------------------------------------------------------------- the pulse (arc length over time)
  function pulseS(t) {
    if (t < A.pulse - .1) return 0;
    if (t < A.older - .1) return (L1 + 300) * sineIO(span(t, A.pulse - .1, A.pulse + .55));
    if (t < A.q) return lerp(L1 + 300, L1 + L2, sineIO(span(t, A.older - .1, A.species + .45)));
    return lerp(L1 + L2, LT, quartIO(span(t, A.q, A.brain + .55)));
  }
  const pulseTail = (t) => LT * sineIO(span(t, A.catchup + .2, A.something + .6));
  const pulseHead = (t) => { const s = pulseS(t); let acc = 0; for (let i = 1; i < PULSE.length; i++) { const d = Math.hypot(PULSE[i][0] - PULSE[i - 1][0], PULSE[i][1] - PULSE[i - 1][1]);
    if (s <= acc + d) { const f = (s - acc) / d; return [lerp(PULSE[i - 1][0], PULSE[i][0], f), lerp(PULSE[i - 1][1], PULSE[i][1], f)]; } acc += d; } return NODE; };

  // ---------------------------------------------------------------- the camera: keyed views + following the pulse head (Gate 4)
  const VK = [[A.capable - .5, { x: 880, y: 600, s: 1 }], [A.tonight, { x: 890, y: 610, s: 1.05 }], [A.tonight + 1.9, { x: 980, y: 1990, s: 1.2 }],
    [A.headline + .1, { x: 985, y: 1995, s: 1.22 }], [A.headline + 1.5, { x: PH.x + 40, y: PH.y + 10, s: 3.2 }], [A.pulse - .25, { x: PH.x + 40, y: PH.y + 14, s: 3.4 }],
    [A.pulse + .9, { x: 985, y: 1925, s: 2 }], [A.thumb + 1.2, { x: 990, y: 1928, s: 2.08 }], [A.decided + .9, { x: 900, y: 1900, s: 1.3 }], [A.older - .2, { x: 880, y: 1880, s: 1.27 }],
    [A.catchup + 1.4, { x: 1760, y: 700, s: .52 }], [A.gap - .1, { x: 1760, y: 712, s: .54 }], [A.gap + .35, { x: 1760, y: 700, s: .575 }], [A.gap + 1.6, { x: 1760, y: 704, s: .556 }],
    [A.carry, { x: 1760, y: 740, s: .58 }], [tP, { x: S.SOFA_VIEW.x, y: S.SOFA_VIEW.y, s: 1 }]];
  const follow = (t) => {   // look target = the head averaged over the last .2 s + a lead along its travel; the scale eases from 1.15 to .8 on the climb
    let x = 0, y = 0; for (let k = 0; k < 5; k++) { const p = pulseHead(t - k * .05); x += p[0] / 5; y += p[1] / 5; }
    const a = pulseHead(t - .25), b = pulseHead(t), d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, lead = Math.min(260, d * 1.2);
    return { x: x + (b[0] - a[0]) / d * lead, y: y + (b[1] - a[1]) / d * lead * .6 - 40, s: lerp(1.15, .78, sineIO(span(t, A.q, A.brain + .4))) };
  };
  const view = (t) => {
    const k = X.viewPath(t, VK), w = sineIO(span(t, A.older - .35, A.older + .35)) * (1 - sineIO(span(t, A.brain + .35, A.catchup + 1.3)));
    if (w <= 0) return k;
    const f = follow(t); return { x: lerp(k.x, f.x, w), y: lerp(k.y, f.y, w), s: Math.exp(lerp(Math.log(k.s), Math.log(f.s), w)) };
  };

  // ---------------------------------------------------------------- stage L: the Leitbild (thumbnail A), slow push in, then the flood
  const camL = (t) => S.PUSH(.55 * sineIO(clamp(t / A.h2e)));
  const FLOOD = { full: A.capable + .1, d0: A.h2e + .22, d1: A.capable + 1.05 };
  let sunAt = null, footAt = null, headAt = null, axeAt = null;
  const floodR = (t) => Math.exp(lerp(Math.log(470), Math.log(2400), sineIO(span(t, FLOOD.d0, FLOOD.full))));   // screen radius of the growing sphere
  function leitbild(ctx, t) {
    const o = S.sunrise(ctx, camL(t), t, { sunK: t > FLOOD.d0 ? floodR(t) / 470 : 1, rise: lerp(.9, 1, sineIO(clamp(t / 3))), you: { arm: lerp(.82, 1, sineIO(clamp(t / 2.4))) } });
    sunAt = o.sphere; footAt = o.you?.foot || footAt; headAt = o.you?.head || headAt; axeAt = o.you?.axe || axeAt;
    F.title(ctx, t, 1, { out: span(t, A.godlike - .55, A.godlike + .5) });
    const g = lab(t, A.godlike + .05, FLOOD.d0), s2 = lab(t, A.stone + .05, FLOOD.full);
    if (g > 0 && o.sphere) { X.lightLine(ctx, [[960, 352], [o.sphere[0], o.sphere[1] - o.sphere[2] + 8]], span(t, A.godlike + .2, A.godlike + .8), { col: rgba(GOLD.line, .8), w: 2 });
      backing(ctx, 960, 312, 520, 90, g);
      X.label(ctx, SRC.godlike, 960, 330, g, { size: 64, gold: 1, col: GOLD.text, spacing: .14 }); }
    if (s2 > 0 && o.you?.foot) { X.lightLine(ctx, [[960, 968], [o.you.foot[0] + 4, o.you.foot[1] + 8]], span(t, A.stone + .2, A.stone + .8), { col: rgba(CREAM, .7), w: 2 });
      X.label(ctx, SRC.stoneAge, 960, 1012, s2, { size: 44, spacing: .14 }); }
  }
  function backing(ctx, x, y, w, h, u) {   // a soft night shade behind a label that sits on the beams (readability, no box)
    if (u <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(w / 2, h / 2);
    ctx.fillStyle = E.rad(ctx, 0, 0, 1, [[0, rgba(P.night0, .62 * clamp(u * 1.5))], [.6, rgba(P.night0, .4 * clamp(u * 1.5))], [1, rgba(P.night0, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  function flood(ctx, t) {   // the sphere grows until gold fills the frame, then shrinks into the disc on the wall
    const grow = sineIO(span(t, FLOOD.d0, FLOOD.full)), shrink = sineIO(span(t, FLOOD.full, FLOOD.d1));
    if (grow <= 0 || shrink >= 1) return;
    const sp = sunAt || [960, 905, 470], v = view(FLOOD.d1), [dx, dy] = X.toScreen(v, DISC0.x, DISC0.y), R0 = 2400;
    const x = t < FLOOD.full ? sp[0] : lerp(sp[0], dx, shrink), y = t < FLOOD.full ? sp[1] : lerp(sp[1], dy, shrink);
    const rEnd = discPos(FLOOD.d1).r * v.s;   // log-space radius: no frame-to-frame jump that reads as a cut
    const r = t < FLOOD.full ? sp[2] : Math.exp(lerp(Math.log(R0), Math.log(rEnd), shrink));   // before full: the sphere's own (grown) radius
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t < FLOOD.full) {   // phase A: the sphere itself grows behind the hill and you (leitbild sunK); phase B: a gold curtain pours down
      const y0 = Math.min(headAt ? headAt[1] : 700, axeAt ? axeAt[1] : 700) - 40, yb = lerp(y0, H + 20, sineIO(span(t, FLOOD.full - .22, FLOOD.full)));   // over you and the hill
      if (yb <= y0 + 1) { ctx.restore(); return; }
      ctx.beginPath(); ctx.rect(0, y0, W, yb - y0); ctx.clip(); }
    F.sphere(ctx, t, x, y, r, { dust: t < FLOOD.full ? 2200 : 420 });   // the same sphere as in the Leitbild: the curtain has no seam
    ctx.restore();
  }

  // ---------------------------------------------------------------- stage W: THE WALL (steps, head, sofa, pulse, the gap, the clocks)
  function thumbGlyph(ctx, r, t) {   // on the phone screen (phone-local coordinates): the thumb comes in from bottom right and swipes up
    const u = span(t, A.thumb - .15, A.thumb + .45), sw = sineIO(span(t, A.thumb + .45, A.thumb + 1.1)), out = span(t, A.thumb + 1.3, A.thumb + 1.9);
    if (u <= 0 || out >= 1) return 0;
    const x = lerp(r.x + r.w * 1.25, r.x + r.w * .62, expoOut(u)) + out * r.w * .7, y = lerp(r.y + r.h * 1.1, r.y + r.h * .62, expoOut(u)) - sw * r.h * .22 + out * r.h * .5;
    if (sw > 0 && sw < 1) { ctx.strokeStyle = rgba(COOL.core, .7 * (1 - sw)); ctx.lineWidth = r.w * .02; ctx.beginPath(); ctx.arc(x - r.w * .05, y - r.h * .05, r.w * (.08 + .2 * sw), 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.ellipse(x, y + r.h * .12, r.w * .16, r.h * .2, -.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = mixHex(SKIN, P.core1, .4); ctx.beginPath(); ctx.ellipse(x - r.w * .03, y + r.h * .02, r.w * .07, r.h * .05, -.5, 0, Math.PI * 2); ctx.fill();
    return sw * (1 - out);
  }
  function sofaStage(ctx, t, v) {
    const on = span(t, A.tonight + 1.35, A.tonight + 1.6), scroll = (t2) => thumbGlyphScroll(t2);
    const dec = Math.sin(Math.PI * span(t, A.decided - .1, A.older + .3));
    if (dec > 0) halo(ctx, PH.x, PH.y, 260, .45 * dec, OCHRE.mid, OCHRE.hot);
    const ringLand = t >= A.hud, headA = .85 + .15 * span(t, A.lands, A.lands + .4) * (1 - span(t, A.decided, A.decided + 1));
    S.sofaScene(ctx, t, { ring: { dashed: 1, a: ringLand ? 1 : 0 },
      phone: { on, glow: on, draw: (c2, r) => {
        const hu = span(t, A.lands - .1, A.lands + .55), sc = scroll(t);
        c2.save(); c2.translate(0, -sc * r.h * .22);
        F.headline(c2, t, r.x + r.w * .1, r.y + r.h * .16, r.w * .8, { u: hu, big: span(t, A.big - .05, A.big + .35), bad: span(t, A.bad - .05, A.bad + .45), a: headA });
        c2.restore(); thumbGlyph(c2, r, t); } } });
    // the heart: an ochre node on your chest (the pulse starts here)
    const hn = span(t, A.pulse - .2, A.pulse + .1) * (1 - span(t, A.catchup, A.something));
    if (hn > 0) { halo(ctx, CHEST[0], CHEST[1], 70, .6 * hn, OCHRE.mid, OCHRE.hot); ctx.fillStyle = rgba(OCHRE.hot, hn); ctx.beginPath(); ctx.arc(CHEST[0], CHEST[1], 7 * (1 + .25 * Math.max(0, Math.sin(t * 7))), 0, Math.PI * 2); ctx.fill(); }
  }
  const thumbGlyphScroll = (t) => sineIO(span(t, A.thumb + .45, A.thumb + 1.1)) * (1 - sineIO(span(t, A.decided - .2, A.decided + .8)));

  let RINGW = null;
  function wallStage(ctx, t) {
    RINGW = null;
    const v = view(t), top = v.y - H / 2 / v.s, bot = v.y + H / 2 / v.s, left = v.x - W / 2 / v.s, right = v.x + W / 2 / v.s;
    const lx = t < A.tonight + 1 ? 1000 : t < A.older ? PH.x : t < A.catchup + 1 ? pulseHead(t)[0] : 1760, ly = t < A.tonight + 1 ? 560 : t < A.older ? PH.y : t < A.catchup + 1 ? pulseHead(t)[1] : 760;
    X.wall(ctx, t, v, { lx: t > A.carry ? lerp(1760, 980, span(t, A.carry, tP)) : lx, ly: t > A.carry ? lerp(760, 2000, span(t, A.carry, tP)) : ly });
    const D = discPos(t), cntU = expoOut(span(t, A.racing - .05, A.racing + .7)), flU = expoOut(span(t, A.barely - .05, A.barely + .75));
    const fly = sineIO(span(t, A.carry + .2, A.hud));
    X.inView(ctx, v, () => {
      // the growth rings: one dashed ring of light per jump (the sizes it had), they stay behind when the disc runs off, then retract
      const sr = span(t, A.something - .2, A.something + 1.2);
      if (D.n > 0 && sr < 1) for (let k = 0; k < D.n; k++) { const rr = DR0 + DSTEP * (k + 1) + 26, u = span(t, JUMPS[k] + .05, JUMPS[k] + .55) * (1 - span(sr, k / NJ * .6, k / NJ * .6 + .4));
        if (u <= 0) continue; ctx.save(); ctx.setLineDash([10, 9]); ctx.lineDashOffset = -t * 6; ctx.strokeStyle = rgba(CREAM, .5 * u); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(DISC0.x, DISC0.y, rr * lerp(.8, 1, expoOut(u)), 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      X.label(ctx, SRC.capable, DISC0.x, DISC0.y - DRMAX - 90, lab(t, A.capable + .95, A.tonight + .6), { size: 30, spacing: .12 });
      // the track the disc runs on
      if (D.run > 0) X.lightLine(ctx, [[DISC0.x, RUN.y + DRMAX + 8], [D.x, RUN.y + DRMAX + 8]], 1, { col: rgba(GOLD.line, .6), w: 2.5 });
      // the stone head (rises out of the wall on "upgrade"), its alarm node (lit by the pulse), then it turns into the flint tally
      const hu = span(t, A.upgrade - .3, A.upgrade + .6);
      if (hu > 0 && flU < 1) {
        ctx.save(); ctx.beginPath(); ctx.rect(HEAD.x - 260, HEAD.y - HEAD.h * 1.05 * expoOut(hu), 520, HEAD.h * 1.1); ctx.clip();
        const k = 1 - .6 * flU; ctx.translate(FLINT.x, FLINT.y); ctx.scale(k, k); ctx.translate(-FLINT.x, -FLINT.y); ctx.globalAlpha *= 1 - flU;
        F.stoneHead(ctx, t, HEAD.x, HEAD.y, HEAD.h, { node: span(pulseS(t), LT - 40, LT) * (1 - span(t, A.barely - .4, A.barely)), a: 1 });
        ctx.restore();
      }
      if (flU > 0 && fly < 1) F.flintClock(ctx, t, FLINT.x, FLINT.y, FLINT.s * lerp(.4, 1, flU), { next: span(t, A.barely + .4, A.barely + 6), a: clamp(flU * 2) * (fly > 0 ? 0 : 1), glow: .3 });
      // BRAIN UPGRADE: a progress bar stuck at 0% (a shimmer tries, nothing fills)
      const bu = span(t, A.upgrade + .2, A.upgrade + .8), bf = span(t, A.tonight - .05, A.tonight + .1);
      if (bu > 0 && bf <= 0) barShape(ctx, t, BAR.x, BAR.y, BAR.w, BAR.h, bu, 0);
      X.label(ctx, SRC.upgrade, BAR.x + BAR.w / 2, BAR.y + 72, lab(t, A.upgrade + .3, A.tonight + .2), { size: 28, spacing: .12 });
      X.label(ctx, SRC.upgradeNo, BAR.x + BAR.w + 26, BAR.y + 24, lab(t, A.upE - .3, A.tonight + .2), { size: 30, align: 'left', col: OCHRE.text });
      // the disc (the machine), later the racing counter
      if (cntU < 1) { F.sphere(ctx, t, D.x, D.y, D.r * (1 - cntU), { dust: 420, a: t >= FLOOD.d1 - .05 ? 1 : 0 });
        const k = D.steps / 1.6; if (k > 0 && k < 1) { ctx.strokeStyle = rgba(GOLD.line, .7 * (1 - k)); ctx.lineWidth = 5 * (1 - k * .6); ctx.beginPath(); ctx.arc(D.x, D.y, D.r * (1 + .7 * expoOut(k)), 0, Math.PI * 2); ctx.stroke(); } }
      if (cntU > 0 && fly <= 0) { ctx.save(); ctx.translate(CNT.x + (D.x - RUN.x1), CNT.y); ctx.scale(lerp(.2, 1, cntU), lerp(.5, 1, cntU)); F.counterClock(ctx, t, 0, 0, CNT.s, { a: clamp(cntU * 2), speed: 26 }); ctx.restore(); }
      X.label(ctx, SRC.notMachine, CNT.x, CNT.y + 270, lab(t, A.machine - .1, A.gap + .3), { size: 56, spacing: .12 });
      // the cave animals, painted on as the pulse passes them; they fade as the pulse drains into the head
      const ps = pulseS(t), tail = pulseTail(t);
      for (const a of ANIMALS) {
        const rv = span(ps, a.s - 140, a.s + 80), gone = span(tail, a.s - 100, a.s + 200); if (rv <= 0 || gone >= 1 || a.x + 300 < left || a.x - 300 > right) continue;
        ctx.save(); ctx.globalAlpha *= 1 - gone; ctx.beginPath(); ctx.rect(a.x - a.h * 1.6, a.y - a.h * 1.4, a.h * 3.2, a.h * 1.45 * expoOut(rv)); ctx.clip();
        F.mammal(ctx, t, a.k, a.x, a.y, a.h, { dir: 1, node: span(ps, a.s - 20, a.s + 60) });
        ctx.restore();
      }
      // the sofa (only when in view)
      if (bot > 1500 && top < 2700) sofaStage(ctx, t, v);
      // the pulse line itself
      if (ps > 0 && tail < LT - 1) {
        const spikes = [[SPIKE0, 1, span(t, A.jumps - .1, A.jumps + .25)], ...ANIMALS.map((a) => [a.s, .7, span(ps, a.s - 30, a.s + 40)])];
        F.pulsePath(ctx, t, PULSE, ps, spikes, { s0: tail, h: 92, w: 3.4 / Math.max(.6, Math.min(1.6, v.s)) * 1.2 });
      }
      // WHAT CAN CATCH UP? → NOT YOUR ONLY CLOCK → TWO CAN BE SET (one place, under the gap)
      X.label(ctx, SRC.whatCan, SPARK.x + 250, QY, lab(t, A.whatcan - .1, A.something + .3), { size: 76, spacing: .12 });
      X.label(ctx, SRC.notOnly, SPARK.x, QY, lab(t, A.only + .1, A.two + .1), { size: 76, spacing: .12 });
      X.label(ctx, SRC.canBeSet, SPARK.x, QY, lab(t, A.two + .05, A.slower), { size: 76, spacing: .12, gold: .3 });
      // the spark ("something can"): out of the question's end, up into the middle; it splits into the two dashed gauges
      const sk = span(t, A.something - .15, A.something + .7), split = sineIO(span(t, A.only + .2, A.only + 1.3));
      if (sk > 0 && split < 1) { const x = lerp(SPARK.x + 600, SPARK.x, expoOut(sk)), y = lerp(QY - 24, SPARK.y, sineIO(sk)), r = 16 * (1 + .2 * Math.sin(t * 4));
        halo(ctx, x, y, 120, .7 * (1 - split), COAT.base, COAT.lit); ctx.fillStyle = rgba(COAT.lit, 1 - split); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
      if (split > 0) {
        const wig = (a) => Math.sin(Math.PI * span(t, a, a + .5)) * Math.sin(t * 22) * .12;
        const notch = wig(A.two + .1) + sineIO(span(t, A.society + .35, A.society + 1.25));
        const cx = lerp(SPARK.x, COG.x, split), rx = lerp(SPARK.x, RING.x, split), rf = expoOut(split);
        if (fly <= 0) F.cogClock(ctx, t, cx, COG.y, COG.r * rf, { dashed: 1, notch, glow: .2 });
        const spin = (t2) => .6 * t2 + 1.8 * Math.max(0, t2 - (A.single + .2)) * sineIO(span(t2, A.single, A.single + 1));
        const rl = sineIO(span(t, A.carry + .1, A.hud)), ang = (wig(A.two + .25) + spin(t) * .35) * (1 - rl);
        if (t < A.hud) { const x = lerp(rx, CHEST[0], rl), y = lerp(RING.y, CHEST[1], rl) - Math.sin(Math.PI * rl) * 160, r = lerp(RING.r * rf, X.SOFA.ring, rl);
          ctx.save(); ctx.translate(x, y); ctx.rotate(ang); F.ringClock(ctx, t, 0, 0, r, { dashed: 1, glow: (.3 + .4 * span(t, A.single, A.single + .6)) * (1 - rl), ink: rl }); ctx.restore();
          RINGW = [x, y, r]; }
      }
      // the ground line, the crowd (pushes the cog) and one person (under the ring); they sink back when the ring flies
      const gl = span(t, A.slower - .2, A.slower + .8) * (1 - span(t, A.carry, A.carry + .9));
      if (gl > 0) X.lightLine(ctx, [[COG.x - 420, GROUND], [RING.x + 300, GROUND]], gl, { a: .45, w: 2.5 });
      const cr = span(t, A.slower, A.slower + 1.4) * (1 - span(t, A.carry - .1, A.carry + .7));
      if (cr > 0) F.crowd(ctx, t, COG.x - 330, COG.x + 330, GROUND, 11, 190, { u: cr, push: span(t, A.society, A.society + .8), seed: 75 });
      const pu = span(t, A.faster, A.faster + 1.1) * (1 - span(t, A.carry - .1, A.carry + .7));
      if (pu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(RING.x - 200, GROUND - 400, 400, 400); ctx.clip(); E.du(ctx, RING.x, GROUND + (1 - expoOut(pu)) * 260, 230, { look: .9, armR: [2.4, 2.7], light: .4 }); ctx.restore(); }
      X.label(ctx, SRC.society, COG.x, GROUND + 110, lab(t, A.society - .1, A.carry), { size: 56, spacing: .12 });
      X.label(ctx, SRC.onePerson, RING.x, GROUND + 110, lab(t, A.single - .1, A.carry), { size: 56, spacing: .12, col: COAT.lit });
      // ★ THE GAP: springs open from its middle (overshoot), a gold flash runs along it
      const gu = span(t, A.gap - .08, A.gap + .55);
      if (gu > 0 && fly <= 0) {
        const o = gu < 1 ? expoOut(gu) * (1 + .06 * Math.sin(Math.PI * gu)) : 1, x1 = CNT.x + (D.x - RUN.x1) - (cntU > 0 ? CNT.s * .55 : D.r + 30);
        F.gapBracket(ctx, t, HEAD.x - 20, x1, GAPY, Math.min(1, o), { size: 110, tick: 46, w: 5 });
        const fl = span(t, A.gap, A.gap + .9); if (fl > 0 && fl < 1) halo(ctx, lerp(HEAD.x, x1, fl), GAPY, 260, .55 * Math.sin(Math.PI * fl), GOLD.halo, GOLD.core);
      }
    });
    // the bar flies down the wall and becomes the phone screen (screen space)
    const bf = span(t, A.tonight - .05, A.tonight + 1.5);
    if (bf > 0 && bf < 1) {
      const e = sineIO(bf), [ax, ay] = X.toScreen(v, BAR.x, BAR.y), [bx, by] = X.toScreen(v, geo.phone.x, geo.phone.y);
      const w = lerp(BAR.w * v.s, geo.phone.w * v.s, e), h = lerp(BAR.h * v.s, geo.phone.h * v.s, e), x = lerp(ax, bx, e), y = lerp(ay, by, e) - Math.sin(Math.PI * e) * 60;
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(-.12 * e); barShape(ctx, t, -w / 2, -h / 2, w, h, 1, e); ctx.restore();
    }
    // the gauges fly into the HUD (screen space): flint, cog, THE GAP, counter
    if (fly > 0 && t < A.hud) {
      const L = (a, b) => lerp(a, b, fly), st = F.clockState(T, A.hud);
      const [fx, fy] = X.toScreen(v, FLINT.x, FLINT.y); F.flintClock(ctx, t, L(fx, HUD.flint[0]), L(fy, HUD.flint[1]), L(FLINT.s * v.s, HUD.flint[2]), { next: st.flintNext });
      const [cx, cy] = X.toScreen(v, COG.x, COG.y); F.cogClock(ctx, t, L(cx, HUD.cog[0]), L(cy, HUD.cog[1]), L(COG.r * v.s, HUD.cog[2]), { dashed: 1, notch: 1 });
      const x1w = CNT.x + (D.x - RUN.x1) - CNT.s * .55, [g0x, gy] = X.toScreen(v, HEAD.x - 20, GAPY), [g1x] = X.toScreen(v, x1w, GAPY);
      F.gapBracket(ctx, t, L(g0x, HUD.gap0), L(g1x, HUD.gap0 + HUD.gapW[0]), L(gy, HUD.y - 6), 1, { size: L(110 * v.s, 22), tick: L(46 * v.s, 14), w: L(5 * v.s, 1.6) });
      const [kx, ky] = X.toScreen(v, CNT.x + (D.x - RUN.x1), CNT.y), hc = HUD.gap0 + HUD.gapW[0] + 18 + HUD.counter[2] / 2;
      F.counterClock(ctx, t, L(kx, hc), L(ky, HUD.counter[1]), L(CNT.s * v.s, HUD.counter[2]), { glow: L(1, .7) });
      if (RINGW) { const [rx, ry] = X.toScreen(v, RINGW[0], RINGW[1]), sp = sineIO(span(t, A.carry + .5, A.hud));   // a copy of your ring splits off into the HUD
        if (sp > 0) F.ringClock(ctx, t, lerp(rx, HUD.ring[0], sp), lerp(ry, HUD.ring[1], sp), lerp(RINGW[2] * v.s, HUD.ring[2], sp), { dashed: 1 }); }
    }
    // screen texts
    X.label(ctx, SRC.decided, W / 2, 200, lab(t, A.decided + .05, A.older + .2), { size: 44, spacing: .12, col: OCHRE.text });
    X.label(ctx, SRC.older, W / 2, 200, lab(t, A.older + .3, A.q + .2), { size: 44, spacing: .12, col: OCHRE.text });
    F.clocksHud(ctx, t, T);
  }
  // the BRAIN UPGRADE bar: a dark track with a cream rim, 0% fill + a shimmer that tries; e 0..1 turns it into a lit phone screen
  function barShape(ctx, t, x, y, w, h, u, e) {
    const k = expoOut(clamp(u)); if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(u * 2);
    ctx.fillStyle = mixHex(mixHex(P.night0, P.ind2, .5), mixHex(COOL.deep, COOL.body, .55), e); ctx.beginPath(); ctx.roundRect(x, y, w * k, h, Math.min(h, w) * .2); ctx.fill();
    ctx.strokeStyle = rgba(mixHex(CREAM, COOL.line, e), .8); ctx.lineWidth = Math.max(1.5, Math.min(w, h) * .06); ctx.stroke();
    if (e < .5) { const sh = (t * .55) % 1; ctx.fillStyle = rgba(COAT.lit, .9 * (1 - e * 2)); ctx.fillRect(x + 3, y + 3, Math.max(2, w * .012), h - 6);
      ctx.fillStyle = rgba(CREAM, .22 * (1 - e * 2) * Math.sin(Math.PI * sh)); ctx.fillRect(x + 3 + w * .05 * sh, y + 3, w * .04, h - 6); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- the take
  function hook(ctx, t) {
    if (t < FLOOD.full) leitbild(ctx, t); else wallStage(ctx, t);
    flood(ctx, t);
  }
  const draw = (ctx, t) => hook(ctx, t);
  const marks = [0, A.godlike, A.capable, A.upgrade, A.tonight, A.headline, A.big, A.bad, A.pulse, A.thumb, A.decided, A.older, A.q, A.something, A.danger, A.gap, A.racing, A.barely,
    A.only, A.two, A.slower, A.faster, A.carry];
  return [...marks.map((t) => ({ t, draw, print: PR })), { t: tP, draw: (ctx, t) => S.plateSofa(ctx, t, T), print: PR }];
};
