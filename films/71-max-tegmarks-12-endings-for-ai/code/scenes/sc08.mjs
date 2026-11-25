// Film 71 · c08 (B2): ENDING 5/12 BENEVOLENT DICTATOR. One continuous take, no cut (docs/shots.md 5.01 – 5.10):
//   the throne of c07 shrinks into its crown, the crown rises into the calm cool light, school and locker sink, the ground line opens into
//   the world disc with its people: BENEVOLENT DICTATOR → rule lines come down from the light over everyone: STRICT RULES, most of them glow:
//   MOST PEOPLE LIKE IT → fly into the lit window of a house on the disc: SCENARIO, you at the window, a street without want (open doors, a
//   free fruit stall) → back out: the disc splits into KNOWLEDGE · PLEASURE · WILDLIFE → you step out of the house and walk over a border →
//   at the edge the rule book behind glass, your hand on the glass, no handle → a balance: a full table left, a ballot right → the ballot
//   becomes the government building (callback H.13): half its windows switch to agents: 50 % · WITHIN 2 YEARS · APR 23, 2026 · UAE Cabinet →
//   a human stays on the roof → the light comes down beside it, becomes a throne again and shrinks into a guard booth by a gate (c09
//   continues the same picture: boothWorld + camKeys89 are shared).
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b2_extra.mjs';
import { anchors07, throneWorld, camKeys78, CROWN } from './sc07.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, GOLD, CREAM, CREAM2, COOL, LAMP, TXT } = F;
const TAU = Math.PI * 2;

export function anchors08(T, a) {
  const G = (p, n = 0, af = a - .1) => T.G(p, n, af);
  const A = {
    a, dict: G('The Benevolent Dictator'), runs: G('An AI runs the world'), strict: G('strict rules'), like: G('most people like it'),
    wake: G('You wake up in a world'), poverty: G('without poverty'), crime: G('or crime'), divided: G('The AI has divided it'),
    sectors: G('into sectors'), know: G('knowledge,'), pleas: G('pleasure,'), wild: G('wildlife.'), move: G('You can move between them'),
    cant: G("You can't change the AI's"), trade: G('Would you take that trade'), april: G('In April, the United Arab'), within: G('within two years'),
    half: G('half of its government'), agents: G('AI agents.'), rulers: G('The rulers stay human'), human: G('stay human'),
    what: G("But what if the machine didn't"), only: G('only stood guard'),
  };
  A.guard = G('guard', 0, A.only); A.gk = G("That's the Gatekeeper");
  return A;
}
// ---------------------------------------------------------------- the booth world (5.08 – 5.10, shared with c09 over the seam)
export const GND = 650, BLD = { x: 2350, cols: 8, rows: 4, cell: 34 }, THR5 = { x: 2800, h: 360 }, BOOTH = { x: 2800 }, GATE = { x0: 2880, x1: 3160 };
export const CROWN5 = [THR5.x, GND - THR5.h * .78], RING5 = [BOOTH.x, GND - 89];
// p: { bld (0..1 rises), sw (windows switched), roof, throne (grows from the crown), shrink (throne → booth), booth, gate, disc: [x, y, r] | null, ring }
export function boothWorld(ctx, t, v, p) {
  F.inView(ctx, v, () => {
    if ((p.bld ?? 0) > 0) {
      const b = F.building(ctx, t, BLD.x, GND, BLD.cols, BLD.rows, BLD.cell, { share: .5, sw: p.sw ?? 0, roof: p.roof ?? 0, a: 1 });
      const c = clamp(p.cover ?? 0); if (c > 0) { ctx.fillStyle = mixHex(P.night1, P.ind2, .7); ctx.fillRect(b.x0 + 1, b.y0 + b.h * (1 - c), b.w - 2, b.h * c - 1); }
    }
    const tg = clamp(p.throne ?? 0), sh = sineIO(clamp(p.shrink ?? 0));
    if (tg > 0 && sh < 1) {
      ctx.save(); const ex = expoOut(tg), [cx, cy] = CROWN5; ctx.translate(cx, cy); ctx.scale(ex, ex); ctx.translate(-cx, -cy);
      const k = lerp(1, .3, sh); ctx.translate(THR5.x, GND); ctx.scale(k, k); ctx.translate(-THR5.x, -GND);
      B.throne(ctx, t, THR5.x, GND, THR5.h, { grow: 1, disc: 1 - sh }); ctx.restore();
    }
    if ((p.booth ?? 0) > 0) B.booth(ctx, t, BOOTH.x, GND, { u: p.booth, ring: p.ring ?? 0 });
    if ((p.gate ?? 0) > 0) B.gate(ctx, t, GATE.x0, GATE.x1, GND, { u: p.gate, open: p.open ?? 0 });
    if ((p.ground ?? 0) > 0) F.lightLine(ctx, [[lerp(BOOTH.x, 2050, p.ground), GND], [lerp(BOOTH.x, 3700, p.ground), GND]], 1, { w: 2.5, a: .45, glow: false });
    if (p.disc) B.machineDisc(ctx, t, p.disc[0], p.disc[1], p.disc[2], { glow: 1 });
  });
}
export const camKeys89 = (A) => [[A.what + 1.4, { x: 2700, y: 470, s: 1.18 }], [A.guard + .7, { x: 2930, y: 545, s: 1.45 }], [A.gk + .5, { x: 2945, y: 540, s: 1.48 }], [A.gk + 2.2, { x: 3080, y: 470, s: 1.15 }]];
export const booth89 = (A, t) => ({   // the booth world as it stands from 5.10 on (both chunks)
  bld: 1, sw: 1, roof: 1, booth: span(t, A.only - .25, A.only + .35), ring: span(t, A.only + .2, A.only + .6), gate: span(t, A.guard - .15, A.guard + .75),
  throne: span(t, A.what + .5, A.what + 1.35), shrink: span(t, A.only - .35, A.only + .45), ground: sineIO(span(t, A.what + .9, A.guard + .5)),
});

export default function (T, R) {
  const A7 = anchors07(T, T.G('And if nobody can be trusted')), A = anchors08(T, R.a);
  const DY = 330, DC = [B.DISC.cx, B.DISC.cy + DY];
  const HW = { x: B.HWIN5.x, y: B.HWIN5.y + DY, w: B.HWIN5.w, h: B.HWIN5.h }, HWC = [HW.x + HW.w / 2, HW.y + HW.h / 2];
  const IN1 = A.wake + .55, OUT0 = A.divided - .7;
  // ---------------------------------------------------------------- the camera (yard)
  const CAM = [...camKeys78(A7), [A.strict + .3, { x: 960, y: 405, s: 1.09 }], [A.wake - 1.1, { x: 1000, y: 440, s: 1.16 }],
    [A.wake - .1, { x: 1190, y: 586, s: 3.6 }], [IN1, { x: HWC[0], y: HWC[1], s: 100 }]];
  const CAM2 = [[OUT0, { x: HWC[0], y: HWC[1], s: 100 }], [OUT0 + 1.1, { x: 1200, y: 588, s: 4 }], [A.divided + 1.2, { x: 960, y: 540, s: 1.08 }],
    [A.wild + .7, { x: 965, y: 575, s: 1.24 }], [A.move + .7, { x: 1270, y: 575, s: 2.5 }], [A.cant - .15, { x: 1290, y: 568, s: 2.55 }],
    [A.cant + .9, { x: 1385, y: 505, s: 2.5 }], [A.trade - .25, { x: 1395, y: 500, s: 2.45 }], [A.trade + 1.1, { x: 1800, y: 445, s: 1.5 }],
    [A.april - .2, { x: 1830, y: 440, s: 1.48 }], [A.april + 1.8, { x: 2400, y: 455, s: 1.12 }], [A.agents + .5, { x: 2430, y: 455, s: 1.16 }],
    [A.rulers + .6, { x: 2370, y: 340, s: 1.5 }], [A.what - .45, { x: 2375, y: 332, s: 1.54 }], ...camKeys89(A)];
  const vAt = (t) => (t < IN1 ? F.viewPath(t, CAM) : F.viewPath(t, CAM2));
  // the room behind the house window
  const RC = [[A.wake - .9, { x: 960, y: 470, s: 1 }], [IN1, { x: 965, y: 468, s: 1.0 }], [OUT0, { x: 1010, y: 448, s: 1.1 }]];
  const rcAt = (t) => F.viewPath(t, RC);
  const SF = 100;
  // the calm light: rises out of the throne's crown, then hangs over the frame and travels with the camera, far away (5.10: it comes down)
  const lightAt = (t, v) => {
    const lf = sineIO(span(t, A.dict + .1, A.dict + 1.6)), fx = 960 + .9 * (v.x - 960), fy = 35 + .9 * (v.y - 405);
    let x = lerp(CROWN[0], fx, lf), y = lerp(CROWN[1] - 4 * Math.sin(t * .9), fy, lf);
    const d = sineIO(span(t, A.what - .05, A.what + 1.0)); x = lerp(x, CROWN5[0], d); y = lerp(y, CROWN5[1], d);
    const sh = sineIO(span(t, A.only - .35, A.only + .45)); x = lerp(x, RING5[0], sh); y = lerp(y, RING5[1], sh);
    const r = lerp(lerp(lerp(26, 46, lf), 26, d), 12, sh);
    return [x, y, r, sh];
  };
  const PEO = B.discPeople().map(([x, y, likes]) => [x, y + DY, likes]);
  const discO = (t) => ({
    u: span(t, A.dict + .3, A.dict + 1.7), people: span(t, A.dict + 1.0, A.dict + 2.2), glad: span(t, A.like, A.like + .9),
    house: span(t, A.like + .2, A.like + .8), split: span(t, A.divided + .7, A.divided + 2.0),
    icons: [span(t, A.know - .1, A.know + .5), span(t, A.pleas - .1, A.pleas + .5), span(t, A.wild - .1, A.wild + .5)],
  });
  const youWalk = (t) => {   // 5.05 – 5.06: out of the house, over the border to the edge
    const u = sineIO(span(t, A.move - .15, A.move + 1.05));
    return { x: lerp(1236, 1347, u), y: lerp(628, 548, u), walk: u > 0 && u < 1 ? t * 7 : undefined, view: u > 0 && u < 1 ? 'side' : undefined };
  };
  const CASE = { x: 1408, y: 540, k: .45 };
  const BAL = { x: 1800, y: 372 };
  const tiltAt = (t) => { const q = Math.max(0, t - A.trade); return .07 + .14 * Math.sin(q * 3.1) * Math.exp(-q * .9) * span(t, A.trade, A.trade + .3); };

  function drawRoom(ctx, t) {
    B.roomStreet5(ctx, t, rcAt(t), { pose: 'stand' });
  }
  function drawYard(ctx, t) {
    const v = vAt(t);
    const p78 = { lock: 1, mon: 1, ground: 1, school: 1, throne: 1, disc: 1, sink: span(t, A.dict + .15, A.dict + 1.5), shrink: span(t, A.dict + .1, A.dict + 1.3), lift: span(t, A.dict + .1, A.dict + 1.6) };
    const [lx, ly, lr, lsh] = lightAt(t, v);
    F.yard(ctx, t, v, { lx: lerp(960, 2400, span(t, A.trade, A.april + 1)), ly: 470, pool: .8, rails: 1 });
    if (p78.sink < 1) throneWorld(ctx, t, v, { ...p78, disc: 0 });
    const dO = discO(t);
    let walkU = 0;
    F.inView(ctx, v, () => {
      // the world disc (DISC + DY)
      ctx.save(); ctx.translate(0, DY);
      B.worldDisc(ctx, t, dO);
      ctx.restore();
      // the morning in the house window (always inside, so the fly-in never pops)
      if (dO.house > 0) {
        const e = expoOut(dO.house), hx = B.HOUSE5[0], hy = B.HOUSE5[1] + DY, wr = { x: hx + (HW.x - hx) * e, y: hy + (HW.y - hy) * e, w: HW.w * e, h: HW.h * e };
        ctx.save(); ctx.beginPath(); ctx.rect(wr.x, wr.y, wr.w, wr.h); ctx.clip();
        const [x0, y0] = F.toScreen(v, wr.x, wr.y); ctx.setTransform(1, 0, 0, 1, 0, 0);
        B.roomAt(ctx, t, { x0, y0, w: wr.w * v.s, h: wr.h * v.s }, S.ZEND * v.s * e / SF, rcAt(t), B.roomStreet5, { pose: 'stand' });
        ctx.restore();
      }
      // the rule lines (5.02): from the light to every person
      const ru = span(t, A.strict - .25, A.strict + .8) * (1 - span(t, A.wake - .9, A.wake - .3));
      if (ru > 0) PEO.forEach(([x, y], j) => F.lightLine(ctx, [[lx, ly + 30], [x, y - 46]], clamp(ru * 1.6 - j * .04), { w: 1.6, col: rgba(COOL.line, .45), glow: false }));
      // the sector labels (on their words)
      const sp = sineIO(clamp(dO.split));
      TXT.e5.sectors.forEach((s, i) => { const [x, y] = B.sectorMid(i, .55); F.label(ctx, s, x, y + DY + 44 + (i === 0 ? -132 : 0), dO.icons[i] * (1 - span(t, A.move - .3, A.move + .2)), { size: 26 }); });
      // the border you cross (−30°: PLEASURE → KNOWLEDGE) glows as you step over it
      const bg = Math.sin(Math.PI * span(t, A.move + .25, A.move + 1.4));
      if (bg > 0) { const a = -30 * Math.PI / 180; F.lightLine(ctx, [[DC[0], DC[1]], [DC[0] + B.DISC.rx * Math.cos(a), DC[1] + B.DISC.ry * Math.sin(a)]], 1, { w: 3, col: rgba(CREAM, .8 * bg), glow: false }); }
      // the glass case at the edge (5.06)
      const cu = span(t, A.cant - .35, A.cant + .45);
      if (cu > 0) { ctx.save(); ctx.translate(CASE.x, CASE.y); ctx.scale(CASE.k, CASE.k); ctx.translate(-CASE.x, -CASE.y); B.glassCase(ctx, t, CASE.x, CASE.y, { u: cu }); ctx.restore(); }
      // you: out of the house door, over the border, your hand on the glass
      walkU = span(t, A.move - .15, A.move + 1.05);
      if (t > A.move - .15 && t < A.trade + 1.2) {
        const y = youWalk(t), reach = sineIO(span(t, A.cant + .3, A.cant + .9));
        B.you(ctx, t, y.x, y.y, 46, { walk: y.walk, view: y.view, dir: 1, armR: reach > 0 ? [lerp(.2, 1.75, reach), lerp(.1, 1.6, reach)] : undefined, look: .2 + .2 * reach });
        const tap = Math.sin(Math.PI * span(t, A.cant + .85, A.cant + 1.5)); if (tap > 0) halo(ctx, CASE.x - 34, CASE.y - 75, 30, .5 * tap, COOL.halo, COOL.core);
      }
      // the balance (5.07): a full table left, a ballot right; the ballot lifts off and becomes the building (5.08)
      const bu = span(t, A.trade - .2, A.trade + .6), fly = sineIO(span(t, A.april - .15, A.april + 1.0));
      if (bu > 0) {
        const bb = B.balance(ctx, t, BAL.x, BAL.y, { u: bu, tilt: tiltAt(t), table: span(t, A.trade + .1, A.trade + .7) });
        if (bb && fly < 1) {
          const [px, py] = bb.pr, bx = px, by = py - 30, s0 = .75 * expoOut(span(t, A.trade + .3, A.trade + .9));
          const bw = BLD.cols * (BLD.cell * 1.45) + BLD.cell * .45, bh = BLD.rows * (BLD.cell * 1.75) + BLD.cell * .45;
          const tx = BLD.x, ty = GND - bh / 2, k = lerp(s0, bw / 56, fly), ky = lerp(s0, bh / 72, fly);
          if (s0 > 0) {
            const x = lerp(bx, tx, fly), y = lerp(by, ty, fly) - 160 * Math.sin(Math.PI * fly);
            if (fly < .55) { ctx.save(); ctx.translate(x, y); ctx.scale(k / s0 || 1, ky / s0 || 1); B.ballot(ctx, t, 0, 0, s0); ctx.restore(); }
            else { const m = span(fly, .55, 1), w = 56 * k, h = 72 * ky; ctx.fillStyle = mixHex(F.PAPER.lit, mixHex(P.night1, P.ind2, .7), m); ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.beginPath(); ctx.moveTo(x - w / 2 - 20 * m, y - h / 2); ctx.lineTo(x, y - h / 2 - h * .22 * m); ctx.lineTo(x + w / 2 + 20 * m, y - h / 2); ctx.closePath(); ctx.fill(); }
          }
        }
      }
    });
    // 5.08 – 5.10: the building, the light comes down, throne → booth, the gate
    const bp = booth89(A, t);
    const bld = span(t, A.april + .95, A.april + 1.0);
    const cover = 1 - sineIO(span(t, A.april + 1.0, A.april + 1.6));
    boothWorld(ctx, t, v, { ...bp, bld, cover, sw: span(t, A.half - .1, A.agents + .3), roof: span(t, A.rulers + .05, A.rulers + .75), disc: lsh < 1 ? [lx, ly, lr] : null });
    // type (yard; rides the camera)
    F.inView(ctx, v, () => {
      F.big(ctx, F.END[5].name, 960, 402, 60, span(t, A.dict + .55, A.dict + 1.15) * (1 - span(t, A.strict - .5, A.strict - .1)), { gold: 0 });
      F.label(ctx, 'STRICT RULES', 470, 360, span(t, A.strict + .1, A.strict + .6) * (1 - span(t, A.wake - 1.0, A.wake - .6)), { size: 30 });
      F.label(ctx, 'MOST PEOPLE LIKE IT', 1450, 360, span(t, A.like + .1, A.like + .6) * (1 - span(t, A.wake - 1.0, A.wake - .6)), { size: 30 });
      F.big(ctx, TXT.e5.half, BLD.x, GND + 92, 50, span(t, A.within - .1, A.within + .5) * (1 - span(t, A.what + .3, A.what + .8)), { gold: 0 });
    });
    const tg = span(t, A.april + .1, A.april + .65), tOut = span(t, A.what - .1, A.what + .4);
    if (tg > 0 && tOut < 1) {
      const [tx, ty] = F.toScreen(v, 2800, 330);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.switchTag(ctx, t, tx, ty, F.END[5].tag, tg, { out: tOut }); ctx.restore();
      B.tagToHud(ctx, t, T, 5, [tx, ty]);
    }
    F.source(ctx, t, A.april + .6, A.rulers, TXT.e5.src);
    F.counterHud(ctx, t, T);
  }
  // the disc of c07 (the crown) lifts into the light: drawn by boothWorld's disc (it follows lightAt) from A.dict + .1; before that throneWorld draws it
  function draw(ctx, t) {
    if (t < A.dict + .1) { const v = vAt(t); F.yard(ctx, t, v, { lx: 960, ly: 470, pool: .8, rails: 1 }); throneWorld(ctx, t, v, { lock: 1, mon: 1, ground: 1, school: 1, throne: 1, disc: 1 }); F.counterHud(ctx, t, T); return; }
    if (t >= IN1 && t < OUT0) { drawRoom(ctx, t); F.counterHud(ctx, t, T); F.scenarioTag(ctx, span(t, A.wake - .2, A.wake + .4) * (1 - span(t, OUT0 - .3, OUT0 + .3))); return; }
    drawYard(ctx, t);
    F.scenarioTag(ctx, span(t, A.wake - .2, A.wake + .4) * (1 - span(t, OUT0 - .3, OUT0 + .3)));
  }
  return [{ t: R.a, draw, print: F.PRINT71 }];
}
