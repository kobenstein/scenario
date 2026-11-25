// c06 · B1 · line 2 MATERIALS: what energy is built from · two wishes (a week of battery, a home that keeps itself cool) · the empty
// material slot · the superconductor (no loss) · 2.4 million structures searched · the one that never existed · made in a lab · R = 0.
// 'Because energy is only as good' → "So why isn't it in the power lines" (ends on S.plateSample). Plan: docs/shots.md 3.01–3.09.
// Inner seam c05 → c06: c05 leaves the power-plant outline on the night (its camera tilted up off the lab); c06 continues c05's night
// (its stars and glow, scene().night) and takes the outline over. Outer seam: from R.b − 0.5 the frame IS S.plateSample.
//
// | ID   | anchor (phrase)              | motif                                                                                   | type | carrier → next      |
// |------|------------------------------|-----------------------------------------------------------------------------------------|------|---------------------|
// | 3.01 | Because energy is only       | the plant outline moves over, a battery and a power line draw beside it; all three come apart into their materials (metal blocks, coils, glass): THE STUFF WE BUILD IT WITH | MIX | the pieces |
// | 3.02 | A battery that lasts a week  | the pieces gather into a dashed phone, battery full, seven day ticks: A WEEK            | MIX  | the phone           |
// | 3.03 | A home that keeps itself     | a dashed house under a big gold sun, no AC box, cool inside: KEEPS ITSELF COOL          | MIX  | the house           |
// | 3.04 | Both are waiting             | dashed arrows from both into one empty slot: DOESN'T EXIST YET                          | EXPL | the slot            |
// | 3.05 | One dream material           | the slot stretches into two wires: one leaks its current as heat, in the other all of it arrives · SUPERCONDUCTOR · NO LOSS | EXPL | the clean wire |
// | 3.06 | This year, an A.I. system    | a lens on the clean wire opens into a sea of crystal lattices; a search beam sweeps, one stays lit · 2.4 MILLION STRUCTURES · 28 GPU-HOURS | EXPL | the lit lattice |
// | 3.07 | It designed a superconductor | the lit lattice comes forward and turns: NEVER EXISTED BEFORE                           | EXPL | the lattice         |
// | 3.08 | Then the team behind it      | the lattice condenses into a grey pellet, gloved hands set it into the measuring holder, four gold probes · ELEMENTSCLAW · ALIBABA DAMO ACADEMY + PARTNERS · 4 NEW SUPERCONDUCTORS MADE AND MEASURED · ICML 2026 | MIX | the sample |
// | 3.09 | And it worked.               | the resistance curve falls to zero: R = 0 · IT WORKED → everything else sinks: S.plateSample | EXPL | the sample (seam plate) |
import * as F from '../lib/f77_kit.mjs';
import * as S from '../lib/f77_seams.mjs';
import * as B from '../lib/b1_extra.mjs';
import { scene as scene04, anchors as anchors04 } from './sc04.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, rise, GOLD, CREAM, PAPER, COOL } = F;

export const PRINT = F.PRINT77;
export function anchors(T) {
  const t0 = T.G('Because energy is only'), G = (p, after = t0 - .3) => T.G(p, 0, after), a = { t0 };
  a.stuff = G('the stuff we build'); a.battery = G('A battery that lasts'); a.week = G('a week', a.battery);
  a.home = G('A home that keeps'); a.cool = G('itself cool', a.home);
  a.both = G('Both are waiting'); a.exist = G("don't exist yet", a.both);
  a.dream = G('One dream material'); a.superc = G('superconductor', a.dream); a.carries = G('it carries electricity', a.dream); a.losing = G('losing any', a.dream);
  a.year = G('This year', a.dream); a.searched = G('searched more than', a.year); a.two = G('two million', a.year); a.dayC = G('a day of computing', a.year);
  a.designed = G('It designed a superconductor'); a.never = G('never existed', a.designed);
  a.team = G('Then the team behind'); a.made = G('made it in a lab', a.team);
  a.worked = G('And it worked'); a.workedW = G('worked', a.worked);
  a.end = T.G("So why isn't it in the power lines");
  return a;
}
export default async (T, R) => {
  const a4 = anchors04(T);
  return [{ t: R.a, draw: scene(anchors(T), T, scene04(a4, T), a4), print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ layout (screen px)
const ICONS = [['plant', 600, 470], ['battery', 960, 470], ['pylon', 1320, 470]];
const PH = { x: 960, y: 470, s: 175 }, PH2 = { x: 560, y: 450 }, HOUSE = { x: 1360, y: 500, s: 175 }, SUN = { x: 1120, y: 230, s: 95 };
const SLOT = { x: 960, y: 760, w: 380, h: 104 };
const WIRE = { x0: 300, x1: 1560, yA: 470, yB: 690 };
const SM = S.SAMPLE;

function scene(a, T, c05, a4) {
  const t0 = a.t0, tEnd = a.end, tPlate = tEnd - S.SEAM_HALF;
  // ---------------------------------------------------------------- times
  const tMove0 = t0 + .05, tMove1 = t0 + 1.2, tApart0 = a.stuff + .15, tApart1 = a.stuff + 1.5;
  const tGather0 = a.battery - .2, tGather1 = a.battery + .8;
  const tSlide0 = a.home - .2, tSlide1 = a.home + .5;
  const tOut0 = a.dream - .3, tOut1 = a.dream + .4, tWire0 = a.dream - .1, tWire1 = a.dream + .9;
  const tBoardOut0 = a.year - .9, tBoardOut1 = a.year - .2;
  const tLens0 = a.year - .15, tLens1 = a.year + 1.25;
  const tFwd0 = a.designed - .1, tFwd1 = a.designed + 1.3;
  const tCond0 = a.team - .15, tCond1 = a.team + .55, tLand = a.made + .1;
  const zA = (t) => 1 + .025 * sineIO(span(t, t0 + .2, tOut1));

  // ---------------------------------------------------------------- 3.01 the three icons come apart into material pieces
  const PIECES = (() => {
    const r = F.prng(606), out = [];
    ICONS.forEach(([kind, x, y], k) => {
      const polys = F.iconPolys(kind, x, y, 130);
      for (let i = 0; i < 9; i++) {
        const pl = polys[i % polys.length], q = r(), p = F.along(pl, q), ang = Math.atan2(p[1] - y, p[0] - x) + (r() - .5) * .8, d = 60 + r() * 90;
        out.push({ k, kind: ['metal', 'coil', 'glass'][(i + k) % 3], p, to: [p[0] + Math.cos(ang) * d, p[1] + Math.sin(ang) * d * .8], rot: (r() - .5) * 1.2, sz: .8 + r() * .5, q: r() });
      }
    });
    return out;
  })();
  const PHPOLY = F.iconPolys('phone', PH.x, PH.y, PH.s);
  const drawPiece = (ctx, t, kind, x, y, sz, rot, u) => {
    if (u <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot + t * .15); ctx.scale(sz * expoOut(u), sz * expoOut(u));
    if (kind === 'metal') { ctx.fillStyle = F.lin(ctx, -16, -10, 16, 10, [[0, '#a6aabd'], [.5, '#d9dce6'], [1, '#6f7389']]); ctx.beginPath(); ctx.roundRect(-16, -10, 32, 20, 3); ctx.fill(); }
    else if (kind === 'coil') { ctx.strokeStyle = GOLD.line; ctx.lineWidth = 2.6; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const q = i / 40, an = q * Math.PI * 8; const px = -18 + 36 * q, py = Math.sin(an) * 9; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    else { ctx.fillStyle = rgba(COOL.core, .22); ctx.strokeStyle = rgba(COOL.line, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, -16); ctx.lineTo(14, -12); ctx.lineTo(12, 16); ctx.lineTo(-16, 12); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  };
  const drawA = (ctx, t) => {
    // the icons: the plant glides over from c05's spot, battery and power line draw beside it, then all three come apart
    const mv = sineIO(span(t, tMove0, tMove1)), ap = span(t, tApart0, tApart1);
    ICONS.forEach(([kind, x, y], k) => {
      let cx = x, cy = y, s = 130, u = 1;
      if (k === 0) { const pa = c05.plantAt(t); cx = lerp(pa.x, x, mv); cy = lerp(pa.y, y, mv); s = lerp(pa.s, 130, mv); }
      else u = smooth(span(t, t0 + .5 + k * .25, t0 + 1.4 + k * .25));
      const keep = 1 - smooth(span(ap, k * .12, .55 + k * .12));
      if (keep > 0 && u > 0) F.lineIcon(ctx, kind, cx, cy, s, { u: u * keep, w: 3.4 });
    });
    F.capsLabel(ctx, 'POWER PLANT', 600, 650, span(t, t0 + .9, t0 + 1.4) * (1 - span(t, tApart0, tApart0 + .4)), { size: 24, col: CREAM });
    F.capsLabel(ctx, 'BATTERY', 960, 650, span(t, t0 + 1.0, t0 + 1.5) * (1 - span(t, tApart0, tApart0 + .4)), { size: 24, col: CREAM });
    F.capsLabel(ctx, 'POWER LINE', 1320, 650, span(t, t0 + 1.1, t0 + 1.6) * (1 - span(t, tApart0, tApart0 + .4)), { size: 24, col: CREAM });
    // the pieces: they pop out of the lines, float, then fly into the dashed phone (3.02)
    const ga = span(t, tGather0, tGather1);
    PIECES.forEach((pc, i) => {
      const born = span(ap, pc.k * .12 + pc.q * .3, pc.k * .12 + pc.q * .3 + .35); if (born <= 0) return;
      const fl = expoOut(born), hx = lerp(pc.p[0], pc.to[0], fl) + 5 * Math.sin(t * 1.3 + i), hy = lerp(pc.p[1], pc.to[1], fl) + 5 * Math.cos(t * 1.1 + i * .7);
      const g = sineIO(span(ga, (i % 9) / 9 * .4, (i % 9) / 9 * .4 + .6)); if (g >= 1) return;
      const dst = F.along(PHPOLY[0], (i / PIECES.length + .13) % 1);
      drawPiece(ctx, t, pc.kind, lerp(hx, dst[0], g), lerp(hy, dst[1], g), pc.sz * (1 - .7 * g), pc.rot, born * (1 - smooth(span(g, .75, 1))));
    });
    F.capsLabel(ctx, 'METAL · COILS · GLASS', 960, 770, span(t, a.stuff + .5, a.stuff + 1.0) * (1 - span(t, tGather0, tGather0 + .4)), { size: 26, col: CREAM });
    F.capsLabel(ctx, 'THE STUFF WE BUILD IT WITH', 960, 820, span(t, a.stuff - .05, a.stuff + .45) * (1 - span(t, tGather0, tGather0 + .4)), { size: 30, col: GOLD.text });
    // 3.02 the phone (dashed: a wish), battery full, seven day ticks · A WEEK; 3.03 it slides left
    const pu = span(t, tGather0 + .3, tGather1 + .2), sl = sineIO(span(t, tSlide0, tSlide1)), out = expoIn(span(t, tOut0, tOut1));
    if (pu > 0 && out < 1) {
      const x = lerp(PH.x, PH2.x, sl) - out * 900, y = lerp(PH.y, PH2.y, sl);
      ctx.save(); ctx.translate(x - PH.x, y - PH.y);
      F.outline(ctx, PHPOLY, smooth(pu), { dashed: true, t, w: 3.2 });
      const bf = smooth(span(t, a.battery + .5, a.week + .2));   // the battery bar fills
      if (bf > 0) { const bx = PH.x - 40, by = PH.y - 90, bw = 80, bh = 34; ctx.strokeStyle = rgba(CREAM, .9); ctx.lineWidth = 2.5; ctx.strokeRect(bx, by, bw, bh); ctx.fillRect(bx + bw, by + 10, 5, 14); ctx.fillStyle = rgba(CREAM, .85); ctx.fillRect(bx + 4, by + 4, (bw - 8) * bf, bh - 8); }
      for (let d = 0; d < 7; d++) { const k = expoOut(span(t, a.week - .2 + d * .07, a.week + .1 + d * .07)); if (k <= 0) continue; ctx.fillStyle = rgba(CREAM, .9); ctx.fillRect(PH.x - 48 + d * 15, PH.y + 20 + 30 * (1 - k), 8, 30 * k); }
      ctx.restore();
      F.capsLabel(ctx, 'A WEEK', x, y + PH.s + 70, span(t, a.week - .05, a.week + .4) * (1 - span(t, tOut0 - .3, tOut0)), { size: 32, col: CREAM });
    }
    // 3.03 the house under a big sun (no AC box), cool inside
    const hu = span(t, a.home - .05, a.home + .9), hOut = expoIn(span(t, tOut0, tOut1));
    if (hu > 0 && hOut < 1) {
      ctx.save(); ctx.translate(hOut * 900, 0);
      const cool = smooth(span(t, a.cool - .3, a.cool + .5));
      if (cool > 0) { const hp = F.iconPolys('house', HOUSE.x, HOUSE.y, HOUSE.s)[0]; ctx.fillStyle = rgba(COOL.halo, .22 * cool); F.poly(ctx, hp); ctx.fill(); for (let i = 0; i < 3; i++) F.trailCream(ctx, [[HOUSE.x - 70, HOUSE.y + 10 + i * 30], [HOUSE.x + 70, HOUSE.y + 10 + i * 30]], 0, cool, { w: 1.6, col: COOL.line, a: .6 }); }
      F.lineIcon(ctx, 'house', HOUSE.x, HOUSE.y, HOUSE.s, { u: smooth(hu), dashed: true, t, w: 3.2 });
      const su = smooth(span(t, a.home + .2, a.home + 1.0));
      if (su > 0) { F.halo(ctx, SUN.x, SUN.y, SUN.s * 2.6, .7 * su, GOLD.halo, GOLD.core); F.lineIcon(ctx, 'sun', SUN.x, SUN.y, SUN.s, { u: su, gold: true, w: 3.4, rot: t * .1 }); }
      ctx.restore();
      F.capsLabel(ctx, 'KEEPS ITSELF COOL', HOUSE.x, HOUSE.y + HOUSE.s * .72 + 70, span(t, a.cool - .1, a.cool + .4) * (1 - span(t, tOut0 - .3, tOut0)), { size: 32, col: CREAM });
    }
    // 3.04 both point into one empty slot: DOESN'T EXIST YET
    const su = span(t, a.both - .05, a.both + .55), wire = quartIO(span(t, tWire0, tWire1));
    if (su > 0 && wire < 1) {
      const aOut = 1 - span(t, tOut0 - .2, tOut0 + .2);
      if (aOut > 0) {
        F.outline(ctx, [[[PH2.x + 80, PH2.y + PH.s * .7], [SLOT.x - SLOT.w / 2 - 30, SLOT.y - 10]], [[HOUSE.x - 120, HOUSE.y + HOUSE.s * .72 + 10], [SLOT.x + SLOT.w / 2 + 30, SLOT.y - 10]]], smooth(span(t, a.both + .1, a.both + .8)), { dashed: true, t, w: 3, a: aOut });
      }
      if (wire <= 0) F.slot(ctx, t, SLOT.x, SLOT.y, SLOT.w, SLOT.h, { u: su });
      F.capsLabel(ctx, 'DOESN’T EXIST YET', SLOT.x, SLOT.y + 10, span(t, a.exist - .1, a.exist + .4) * (1 - span(t, tWire0 - .2, tWire0 + .15)), { size: 28, col: CREAM });
    }
    // 3.05 the slot stretches into two wires
    if (wire > 0) drawWires(ctx, t, wire);
  };
  // ---------------------------------------------------------------- 3.05 two wires
  const drawWires = (ctx, t, w) => {
    const x0 = lerp(SLOT.x - SLOT.w / 2, WIRE.x0, w), x1 = lerp(SLOT.x + SLOT.w / 2, WIRE.x1, w), yA = lerp(SLOT.y - SLOT.h / 2, WIRE.yA, w), yB = lerp(SLOT.y + SLOT.h / 2, WIRE.yB, w);
    const sides = 1 - smooth(span(w, 0, .5));
    if (sides > 0) { ctx.strokeStyle = rgba(CREAM, .85 * sides); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, yA); ctx.lineTo(x0, yB); ctx.moveTo(x1, yA); ctx.lineTo(x1, yB); ctx.stroke(); }
    const flow = smooth(span(t, a.dream + .7, a.dream + 1.5)), heat = smooth(span(t, a.carries, a.carries + 1.0));
    for (const [y, clean] of [[yA, false], [yB, true]]) {
      ctx.fillStyle = mixHex(P.blue1, CREAM, .55); ctx.fillRect(x0, y - 4, x1 - x0, 8);
      if (!clean && heat > 0) {   // the ordinary wire: its current leaks away as heat (a warm haze and rising wiggles)
        for (let i = 0; i < 12; i++) { const q = (i + .5) / 12; F.halo(ctx, lerp(x0, x1, q), y - 18, 120, .22 * heat * (.3 + .7 * q), GOLD.halo, GOLD.mid); }
        for (let i = 0; i < 9; i++) { const hx = x0 + (i + .5) / 9 * (x1 - x0), q = (t * .7 + i * .37) % 1; ctx.strokeStyle = rgba(GOLD.line, .55 * heat * (1 - q) * ((i + 1) / 9)); ctx.lineWidth = 2; ctx.beginPath(); for (let k = 0; k <= 10; k++) { const yy = y - 14 - q * 70 - k * 3.4; const xx = hx + Math.sin(k * .9 + t * 3 + i) * 6; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
      }
      // the current: gold dots from the left; on the ordinary wire they fade on the way, on the clean wire all of them arrive
      if (flow > 0) for (let i = 0; i < 14; i++) {
        const q = (t * .32 + i / 14) % 1, x = x0 + q * (x1 - x0), al = clean ? 1 : Math.max(0, 1 - q * 1.15 * heat);
        if (al <= .02) continue;
        F.halo(ctx, x, y, 26, .5 * al * flow, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.hot, al * flow); ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.29); ctx.fill();
      }
      // at the end a bulb: dim on the ordinary wire, full on the clean one
      const bl = flow * (clean ? 1 : .25 + .2 * (1 - heat));
      if (w > .6) { if (bl > 0) F.halo(ctx, x1 + 62, y - 6, 90, .7 * bl, GOLD.halo, GOLD.core); F.lineIcon(ctx, 'bulb', x1 + 62, y - 10, 42, { u: smooth(span(w, .6, 1)), w: 2.6, gold: clean && bl > .5 }); }
    }
    F.capsLabel(ctx, 'ORDINARY WIRE', x0, yA - 30, span(t, a.carries - .1, a.carries + .4) * (1 - span(t, tLens0 - .3, tLens0 + .1)), { size: 26, col: CREAM, align: 'left' });
    F.maskLine(ctx, [['superconductor', 1]], x0, yB - 34, 62, rise(span(t, a.superc - .05, a.superc + .45)) * (1 - span(t, tLens0 - .3, tLens0 + .1)), { serif: true, col: GOLD.body, glow: true, align: 'left' });
    F.verdict(ctx, t, x1 - 10, yB + 70, 'NO LOSS', span(t, a.losing - .1, a.losing + .4) * (1 - span(t, tLens0 - .3, tLens0 + .1)), { size: 34 });
  };

  // ---------------------------------------------------------------- 3.06–3.09 B: the sea of lattices → the sample (plate space, S.creep)
  const SEA = (() => {
    const r = F.prng(240), out = [];
    for (let j = 0; j < 7; j++) for (let i = 0; i < 10; i++) {
      const x = -300 + i * 266 + (j % 2) * 133 + (r() - .5) * 60, y = -160 + j * 230 + (r() - .5) * 50;
      out.push({ x, y, seed: 1 + Math.floor(r() * 9), yaw: r() * 6, d: Math.hypot(x - 960, y - 520) / 1400 });
    }
    let best = 0; out.forEach((p, i) => { if (Math.hypot(p.x - 1250, p.y - 380) < Math.hypot(out[best].x - 1250, out[best].y - 380)) best = i; });
    return { L: out, pick: best };
  })();
  const beamX = (t) => lerp(-700, 2600, sineIO(span(t, a.searched - .4, a.dayC + .3)));
  const pickLit = (t) => { const p = SEA.L[SEA.pick]; return smooth(span(beamX(t) - p.x, -40, 120)); };
  const condense = (t) => quartIO(span(t, tCond0, tCond1));
  const pelletY = (t) => lerp(SM.y - 270, SM.y, sineIO(span(t, tCond1 - .1, tLand)));
  const drawSea = (ctx, t) => {
    const fw = quartIO(span(t, tFwd0, tFwd1)), cd = condense(t);
    // far: a fine field of dots (the millions)
    ctx.fillStyle = rgba(CREAM, .18 * (1 - fw)); const r = F.prng(77);
    for (let i = 0; i < 900; i++) { const x = -400 + r() * 2720, y = -260 + r() * 1560; ctx.fillRect(x, y, 2.6, 2.6); }
    const bx = beamX(t), bu = span(t, a.searched - .4, a.searched) * (1 - span(t, a.dayC + .2, a.dayC + .6));
    SEA.L.forEach((p, i) => {
      if (i === SEA.pick) return;
      const u = span(t, a.year + .2 + p.d * .9, a.year + .9 + p.d * .9) * (1 - span(t, tCond0 - .2 + p.d * .2, tCond0 + .5 + p.d * .2)); if (u <= 0) return;
      const lit = bu > 0 ? .6 * Math.max(0, 1 - Math.abs(p.x - bx) / 170) * bu : 0;
      const k = lerp(1, .7, fw), x = lerp(p.x, 960 + (p.x - 960) * 1.25, fw), y = lerp(p.y, 520 + (p.y - 520) * 1.25, fw);
      F.lattice(ctx, t, x, y, 54 * k, { seed: p.seed, yaw: p.yaw + t * .2, u, lit, dashed: true, a: lerp(.85, .35, fw) });
    });
    // the beam (cool light sweeping)
    if (bu > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = F.lin(ctx, bx - 160, 0, bx + 160, 0, [[0, rgba(COOL.halo, 0)], [.5, rgba(COOL.core, .2 * bu)], [1, rgba(COOL.halo, 0)]]); ctx.fillRect(bx - 160, -400, 320, 1900); ctx.restore(); }
    // the one: lit gold after the beam passes; 3.07 it comes forward and turns; 3.08 it condenses into the pellet
    const p = SEA.L[SEA.pick], u = span(t, a.year + .2 + p.d * .9, a.year + .9 + p.d * .9), pl = pickLit(t);
    if (cd < 1) {
      const x = lerp(p.x, SM.x, fw), y = lerp(lerp(p.y, 440, fw), SM.y - 270, cd), s = lerp(lerp(54, 210, fw), 40, cd);
      F.lattice(ctx, t, x, y, s, { seed: p.seed, yaw: p.yaw + t * .2 + fw * 2.4 + cd * 3, u, lit: Math.max(pl, fw), a: 1 - smooth(span(cd, .7, 1)) });
    }
    // the pellet grows out of the condensed lattice and is set into the holder
    const pg = smooth(span(cd, .45, 1));
    if (t < tLand) {
      holder(ctx, SM.x, SM.y, SM.s, smooth(span(t, tCond0, tCond1 + .4)));
      if (pg > 0) pellet(ctx, SM.x, pelletY(t), SM.s * pg);
      gloves(ctx, t);
    } else {
      F.sample(ctx, t, SM.x, SM.y, SM.s, { probes: smooth(span(t, a.made + .2, a.made + 1.1)), cold: (.45 + .1 * Math.sin(t * 1.3)) * smooth(span(t, a.made + .6, a.worked)) });
      gloves(ctx, t);
    }
  };
  // F.sample's holder and pellet, drawn apart while the pellet is carried in (the same code: the switch to F.sample is seamless)
  const holder = (ctx, x, y, s, u) => {
    if (u <= 0) return;
    ctx.save(); ctx.globalAlpha *= u; ctx.translate(0, (1 - u) * 60);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.fillRect(x - s * .16, y + s * .5, s * .32, s * 1.6);
    ctx.fillStyle = F.lin(ctx, 0, y + s * .2, 0, y + s * .7, [[0, mixHex(P.blue1, P.cream, .25)], [1, mixHex(P.ind1, P.night0, .3)]]); ctx.beginPath(); ctx.ellipse(x, y + s * .45, s * 1.75, s * .38, 0, 0, 6.29); ctx.fill();
    ctx.restore();
  };
  const pellet = (ctx, x, y, s) => {
    ctx.fillStyle = F.lin(ctx, x - s, y - s * .5, x + s, y + s * .5, [[0, '#8f93a8'], [.45, '#c9ccd8'], [1, '#5d6178']]); ctx.beginPath(); ctx.ellipse(x, y + s * .1, s, s * .42, 0, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#6f7389'; ctx.fillRect(x - s, y + s * .1, s * 2, s * .22); ctx.beginPath(); ctx.ellipse(x, y + s * .32, s, s * .42, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = F.lin(ctx, x - s, y - s * .3, x + s, y + s * .5, [[0, '#a6aabd'], [.5, '#e1e3ec'], [1, '#7a7e93']]); ctx.beginPath(); ctx.ellipse(x, y + s * .1, s, s * .42, 0, 0, 6.29); ctx.fill();
  };
  // two gloved hands (lab gloves, pale): they come down with the pellet between their fingertips and leave upward
  const gloves = (ctx, t) => {
    const inn = sineIO(span(t, tCond1 - .5, tCond1 + .1)), out = expoIn(span(t, tLand + .15, tLand + .95)); if (inn <= 0 || out >= 1) return;
    const py = t < tLand ? pelletY(t) : SM.y, lift = (1 - inn) * 600 + out * 900;
    for (const sd of [-1, 1]) {
      const tipX = SM.x + sd * (SM.s * 1.02), tipY = py + SM.s * .12 - lift, ang = -Math.PI / 2 + sd * .62;
      const dx = Math.cos(ang), dy = Math.sin(ang);
      ctx.save(); ctx.translate(tipX, tipY); ctx.rotate(ang - Math.PI / 2); ctx.scale(sd, 1);
      const gl = '#a3abdc', gs = '#7f88c2', gh = '#c4caee';   // a nitrile lab glove (a person's hand: indigo family, never yellow)
      ctx.fillStyle = F.lin(ctx, -50, 0, 50, 0, [[0, gs], [.55, gl], [1, gh]]);
      ctx.beginPath(); ctx.roundRect(-30, -6, 22, 96, 11); ctx.fill();                   // index finger
      ctx.beginPath(); ctx.roundRect(6, 8, 24, 74, 12); ctx.fill();                      // thumb
      ctx.beginPath(); ctx.roundRect(-44, 64, 88, 118, [26, 26, 18, 18]); ctx.fill();    // the back of the hand
      ctx.fillStyle = gs; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.roundRect(-44 + k * 10, 60 - k * 6, 18, 40, 9); ctx.fill(); }   // the curled fingers
      ctx.fillStyle = mixHex(gs, P.night0, .25); ctx.beginPath(); ctx.roundRect(-48, 174, 96, 52, 8); ctx.fill();   // the cuff
      ctx.strokeStyle = rgba(gh, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(24, 70); ctx.quadraticCurveTo(30, 120, 18, 170); ctx.stroke();
      ctx.restore();
      void dx; void dy;
    }
  };
  // 3.09 the resistance curve (screen, left of the sample)
  const GR = { x0: 170, x1: 620, y0: 330, y1: 640 };
  const drawGraph = (ctx, t) => {
    const u = span(t, a.worked - .1, a.workedW + .4), out = span(t, tPlate - .45, tPlate - .05); if (u <= 0 || out >= 1) return;
    const k = 1 - out, ax = smooth(span(u, 0, .4)) * k;
    ctx.strokeStyle = rgba(CREAM, .8 * k); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(GR.x0, GR.y0 + (GR.y1 - GR.y0) * (1 - ax)); ctx.lineTo(GR.x0, GR.y1); ctx.lineTo(GR.x0 + (GR.x1 - GR.x0) * ax, GR.y1); ctx.stroke();
    F.capsLabel(ctx, 'R', GR.x0 - 26, GR.y0 + 24, ax, { size: 26, col: CREAM });
    F.capsLabel(ctx, 'T', GR.x1 + 4, GR.y1 + 34, ax, { size: 26, col: CREAM });
    const tc = lerp(GR.x0, GR.x1, .38), pts = [[GR.x1, GR.y0 + 40], [lerp(tc, GR.x1, .5), GR.y0 + 110], [tc + 14, GR.y0 + 160], [tc, GR.y1 - 2], [GR.x0 + 4, GR.y1 - 2]];
    F.goldSpan(ctx, pts, 0, smooth(span(u, .2, 1)) * k, { w: 4, spark: true });
    F.maskLine(ctx, [['R = 0', 1]], GR.x0 + 30, GR.y1 - 30, 46, rise(span(t, a.workedW - .05, a.workedW + .3)) * k, { serif: true, col: GOLD.body, glow: true, align: 'left' });
    F.verdict(ctx, t, (GR.x0 + GR.x1) / 2, GR.y1 + 100, 'IT WORKED', span(t, a.workedW - .05, a.workedW + .35) * k, { size: 40 });
  };
  const drawLabels = (ctx, t) => {
    const out = span(t, a.worked - .35, a.worked + .05), x = 1250;
    F.maskLine(ctx, [['ElementsClaw', 1]], x, 380, 60, rise(span(t, a.team - .05, a.team + .45)) * (1 - out), { serif: true, col: GOLD.body, glow: true, align: 'left' });
    F.capsLabel(ctx, 'ALIBABA DAMO ACADEMY + PARTNERS', x + 2, 430, span(t, a.team + .25, a.team + .75) * (1 - out), { size: 24, col: CREAM, align: 'left' });
    F.capsLabel(ctx, '4 NEW SUPERCONDUCTORS', x + 2, 486, span(t, a.made - .1, a.made + .4) * (1 - out), { size: 26, col: GOLD.text, align: 'left' });
    F.capsLabel(ctx, 'MADE AND MEASURED', x + 2, 522, span(t, a.made + .05, a.made + .5) * (1 - out), { size: 26, col: GOLD.text, align: 'left' });
    F.capsLabel(ctx, 'ICML 2026', x + 2, 576, span(t, a.made + .2, a.made + .7) * (1 - out), { size: 24, col: P.halo2, align: 'left' });
    // 3.06 the numbers (with a dark backing over the sea)
    const nOut = span(t, tFwd0 - .2, tFwd0 + .3), n1 = span(t, a.two - .05, a.two + .45) * (1 - nOut), n2 = span(t, a.dayC - .1, a.dayC + .4) * (1 - nOut);
    const bk = Math.max(n1, n2);
    if (bk > 0) { ctx.save(); ctx.globalAlpha *= bk; ctx.fillStyle = F.rad(ctx, 960, 150, 560, [[0, rgba(P.night0, .85)], [.6, rgba(P.night0, .6)], [1, rgba(P.night0, 0)]]); ctx.save(); ctx.translate(960, 150); ctx.scale(1, .34); ctx.translate(-960, -150); ctx.fillRect(400, -410, 1120, 1120); ctx.restore(); ctx.restore(); }
    F.goldText(ctx, [['2.4 million structures', 1]], 960 - F.measure('2.4 million structures', 74, true) / 2, 150, 74, rise(n1), { serif: true });
    F.capsLabel(ctx, '28 GPU-HOURS · ABOUT A DAY OF COMPUTING', 960, 214, n2, { size: 28, col: CREAM });
    F.capsLabel(ctx, 'NEVER EXISTED BEFORE', 960, 800, span(t, a.never - .1, a.never + .4) * (1 - span(t, tCond0 - .1, tCond0 + .3)), { size: 34, col: CREAM });
  };
  // the plate lives on my side of the seam: over its last 2.4 s the camera eases back a little and then pushes in faster than the creep
  // (plus the light); the offset is exactly 0 at the seam phrase (B2's first frame = S.plateSample) and arrives moving the creep's way
  const lean = (t) => Math.sin(Math.PI * span(t, tEnd - 2.4, tEnd));
  const plateCam = (ctx, t, fn) => { const e = lean(t); F.look(ctx, W / 2 - 14 * e, H / 2 - 20 + 10 * e, S.creepZ(t, tEnd) * (1 - .05 * e), fn); };
  const drawB = (ctx, t) => {
    const g = S.sampleGlow(t), e = lean(t);
    F.night(ctx, t, { glow: [g[0], g[1], g[2] * (1 + .12 * e), g[3] * (1 + .35 * e)] });
    plateCam(ctx, t, () => drawSea(ctx, t));
  };

  // ======================================================================================================================== draw
  return (ctx, t) => {
    if (t >= tEnd) { S.plateSample(ctx, t, T); return; }
    if (t < tLens1 + .02) {
      c05.night(ctx, t);
      const z = zA(t);
      F.look(ctx, W / 2, H / 2, z, () => drawA(ctx, t));
      // 3.06 a lens on the clean wire opens into the sea of lattices
      const lr = 2400 * quartIO(span(t, tLens0, tLens1)) + 4 * smooth(span(t, tLens0 - .05, tLens0 + .1));
      if (lr > .5) {
        const [cx, cy] = F.lookPt(W / 2, H / 2, z, 960, WIRE.yB);
        F.iris(ctx, (g) => g.arc(cx, cy, lr * z, 0, 6.29), (g) => drawB(g, t), { rim: rgba(COOL.line, .9 * (1 - span(t, tLens1 - .5, tLens1))), rimW: 5 });
      }
    } else drawB(ctx, t);
    drawLabels(ctx, t);
    drawGraph(ctx, t);
    // the mini board stays in its corner (MATERIALS pulse from c05), then rises away before the sea (B2 brings it back in c07)
    const up = expoIn(span(t, tBoardOut0, tBoardOut1));
    if (up < 1) B.miniBoard(ctx, t, { x: B.MINI.x, y: B.MINI.y - up * 400, s: B.MINI.s, e: 1, mPulse: .9 * Math.sin(Math.PI * span(t, a4.material + .9, a4.end + .1)) });
  };
}
