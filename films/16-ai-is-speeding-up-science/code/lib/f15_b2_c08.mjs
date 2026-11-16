// Film 15 · B2 · c08 (244.20 – 271.60) + the end of c07 (mid-film subscribe) · Station 5: the wide night plain of warm lights
// ("all of us"), the life line that only runs on as a dashed bet, your strongest card, the first morning.
//   7.06  (from c07) the 64 cells have landed as the lights of the plain; you walk in, bottom left; bottom right stays free (subscribe)
//   8.01  one light on the horizon brightens; a gold line draws from it to the right: a life line, ~75 YEARS · ESSAY · 2024
//   8.02  "Doubling": it runs on the same length again, dashed (cool); CLINICAL EVIDENCE: NONE → A BET, NOT A FORECAST
//   8.03  the dashed line folds into a card of light, the camera follows it down into your hand (you, close)
//   8.04★ pull back into the wide plain before dawn: you tiny, the card a speck; on "morning" a thin first light at the horizon
//   8.05  push on the morning light, the camera rolls with it, until it is one short stroke → the tally stroke (c09, STROKE plate)
// All lights, the horizon and you stand on the focus card (F0); far ridge Z 9000, sky Z 40000, a near rise Z 1250 (8.03/8.04).
import { Path2D } from '@napi-rs/canvas';
import { createCanvas } from '@napi-rs/canvas';
import * as C from './f15_b2_common.mjs';
const { E, F } = C;
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, F0, prng } = E;

export const HZ = 520;                      // horizon (design y on F0)
// the stroke plate at c08 → c09 (271.60): one short warm chalk stroke, tilted, in the middle of the night. Screen space.
export const STROKE = { x: 960, y: 540, len: 420, ang: -.13, w: 16 };
export function strokePlate(ctx, t, o = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  C.nightBg(ctx);
  const c = Math.cos(STROKE.ang), s = Math.sin(STROKE.ang), L = STROKE.len / 2, br = 1 + .03 * Math.sin(t * 1.7);
  C.chalk(ctx, [STROKE.x - c * L, STROKE.y - s * L], [STROKE.x + c * L, STROKE.y + s * L], STROKE.w * br, 1, { warm: o.warm ?? .55, glow: 1, grain: false });
  ctx.restore();
}

export function setP(T, ct) {
  const S8 = (w, n) => T.S('s08', w, n);
  const a = {
    allofus: T.S('s07', 'all of us'), subscribe: T.S('s07', 'subscribe'), T8: T.seg('s08').start,
    is: S8('Is the'), toobig: S8('too big'), onepart: S8('one part'), maybe: S8('maybe'), doubling: S8('Doubling'), noevid: S8('no clinical'),
    none: S8('None'), bet: S8('bet'), forecast: S8('forecast'), ifyou: S8("If you're"), skeptical: S8('skeptical'), strongest: S8('strongest'),
    card: S8('card'), fair: S8('fair'), but: S8('But judging'), tenyear: S8('ten-year'), decade: S8('decade'), morning: S8('morning'),
    but2: S8('But if'), start: S8('start'), how: S8('how would'), notice: S8('notice'), T9: T.seg('s09').start,
  };
  const DRIFT = 1.5;
  const t0 = ct.tLand;                       // the cells have become the lights: from here this set draws the frame
  const tPlate = a.T9 - .1;                  // c08 hands over through the stroke plate
  const T9p = tPlate;

  // ------------------------------------------------------------------------------------------------ the lights of the plain (design coords, F0)
  // villages of 2–6 lights; nearer = lower and bigger; keep clear: bottom right (subscribe), bottom left (you), the life line's labels
  const lights = [], VILLAGES = [];
  {
    const r = prng(808);
    const VIL = [[180, 546, 5], [420, 560, 4], [640, 540, 6], [880, 556, 5], [1120, 546, 7], [1360, 566, 5], [1600, 548, 6], [1820, 560, 4],
      [300, 640, 5], [760, 620, 6], [1240, 650, 5], [1560, 618, 4], [980, 720, 5], [760, 810, 4], [1120, 840, 3]];
    for (const [vx, vy, n] of VIL) {
      const d = (vy - HZ) / 420, sp = 10 + 60 * d;
      for (let k = 0; k < n && lights.length < 64; k++) {
        const ang = r() * 6.3, rr = sp * Math.sqrt(r());
        const x = vx + Math.cos(ang) * rr * 1.8, y = vy + Math.sin(ang) * rr * .35, size = 1.8 + 4.6 * d + r() * 1.6 * (k === 0 ? 1.8 : 1);
        lights.push([x, y, size, r() * 6.3]);
      }
      VILLAGES.push([vx, vy, sp, d]);
    }
    while (lights.length < 64) { const x = 100 + r() * 1700, y = HZ + 8 + r() * r() * 160; if (x > 1220 && y > 700) continue; lights.push([x, y, 1.6 + r() * 1.5, r() * 6.3]); }
  }
  const LSTAR = [400, HZ, 6];                           // the light the life line starts from (8.01): one of the lights
  const ISTAR = 5; lights[ISTAR] = [LSTAR[0], LSTAR[1] + 3, 3.6, 1.1];

  // one light (k 1 = landed; k < 1 still a cell of radius r flying in)
  function light(ctx, t, x, y, r, k = 1, r0 = r, o = {}) {
    const br = 1 + .12 * Math.sin(t * (1.1 + (x % 7) * .05) + x * .03), dim = o.dim ?? 1;
    E.halo(ctx, x, y, r * lerp(2.4, 6.5, k) * br, lerp(.3, .42, k) * dim, P.halo1, P.core1);
    ctx.fillStyle = E.rad(ctx, x, y - r * .3, r * 1.4, [[0, P.core0], [.4, P.core1], [1, mixHex(P.halo0, P.halo1, .5)]]);
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  }

  // ------------------------------------------------------------------------------------------------ the world round the lights
  // o.grow 0..1 (from c07: the horizon draws outward from the cell clock, the ground darkens behind it), o.dawn 0..1 (8.04)
  const RIDGE = [[-2600, HZ - 10], [-1400, HZ - 46], [-600, HZ - 18], [100, HZ - 54], [600, HZ - 22], [1000, HZ - 12], [1500, HZ - 40], [2100, HZ - 16], [2700, HZ - 62], [3500, HZ - 20], [4600, HZ - 8]];
  function world(ctx, t, c, o = {}) {
    const grow = clamp(o.grow ?? 1), dawn = clamp(o.dawn ?? 0), gx = 1080, half = 4200 * sineIO(grow), nt = 1 - clamp(o.night ?? 0);
    // sky: the night with a soft indigo glow above the horizon (and the first warm breath of dawn later)
    card(ctx, c, 40000, () => {
      ctx.save(); ctx.translate(1150, 600); ctx.scale(1, .45);
      ctx.fillStyle = E.rad(ctx, 0, 0, 1700, [[0, rgba(P.ind1, .95 * grow * nt)], [.45, rgba(P.ind1, .4 * grow * nt)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-6000, -6000, 12000, 12000);
      if (dawn > 0) { ctx.fillStyle = E.rad(ctx, 100, 0, 1500, [[0, rgba(P.halo1, .34 * dawn * nt)], [.3, rgba(P.shade0, .16 * dawn * nt)], [.7, rgba(P.blue1, .08 * dawn * nt)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-6000, -6000, 12000, 12000); }
      ctx.restore();
      E.stars(ctx, 85, 240, t, [-300, -250, 2600, 760], .95 * smooth(grow) * (1 - .4 * dawn) * nt);
      E.stars(ctx, 86, 420, t, [-2600, -1700, 7000, 2200], .8 * smooth(grow) * (1 - .4 * dawn) * nt);
    });
    // far ridge (only seen when the camera pulls back wide)
    card(ctx, c, 9000, () => {
      ctx.save(); ctx.globalAlpha = smooth(grow) * nt;
      E.ground(ctx, RIDGE.map(([x, y]) => [x, y - 6]), { stops: [[0, P.ind2], [.06, P.night1], [1, P.night0]], rim: rgba(dawn > 0 ? mixHex(P.blue0, P.halo1, .5 * dawn) : P.blue0, .6), rimW: 2, bottom: 4000 });
      ctx.restore();
    });
    // the plain (focus card): ground below the horizon, the horizon rim
    card(ctx, c, F0, () => {
      ctx.save(); ctx.globalAlpha = smooth(grow) * nt;
      ctx.fillStyle = E.lin(ctx, 0, HZ, 0, HZ + 620, [[0, P.ind2], [.05, mixHex(P.ind2, P.night1, .5)], [.4, mixHex(P.night1, P.ind1, .55)], [1, mixHex(P.night0, P.ind0, .6)]]); ctx.fillRect(-4000, HZ, 10000, 6000);
      ctx.globalCompositeOperation = 'lighter';      // the warm pools of the villages on the ground
      for (const [vx, vy, sp] of VILLAGES) { ctx.save(); ctx.translate(vx, vy + 2); ctx.scale(1, .22); ctx.fillStyle = E.rad(ctx, 0, 0, sp * 3 + 40, [[0, rgba(P.halo1, .2)], [.5, rgba(P.halo1, .06)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, sp * 3 + 40, 0, 6.29); ctx.fill(); ctx.restore(); }
      ctx.restore();
      ctx.globalAlpha = nt;
      ctx.fillStyle = E.lin(ctx, gx - half, 0, gx + half, 0, [[0, rgba(P.blue0, 0)], [.15, rgba(P.blue0, .85)], [.5, rgba(mixHex(P.blue0, P.halo1, .25 * grow), .95)], [.85, rgba(P.blue0, .85)], [1, rgba(P.blue0, 0)]]);
      ctx.fillRect(gx - half, HZ - 1, 2 * half, 2); ctx.globalAlpha = 1;
    });
  }

  // ------------------------------------------------------------------------------------------------ you
  const YOU = { x0: -160, x1: 560, y: 905, h: 168 };
  const tWalk = [t0 + .05, a.T8 - .3], WALKN = 9;   // nine half-strides: the stride ends at an odd multiple of π (back knee resting)
  const scratch = createCanvas(8, 8).getContext('2d');
  const HOLD = { armR: [1.72, 1.05], armL: [-.15, -.05] };       // the card held in front of the chest
  const handHold = E.du(scratch, YOU.x1, YOU.y, YOU.h, { dir: 1, walk: Math.PI * 9, ...HOLD, look: .25 }).R;

  // ------------------------------------------------------------------------------------------------ the life line
  const LL = { x0: LSTAR[0], x1: LSTAR[0] + 600, x2: LSTAR[0] + 1200, y: HZ };
  const CARD = { w: 48, h: 66 };                                  // the card in your hand (design px on F0)
  const tFold = [a.skeptical - .25, a.skeptical + .75], tGlide = [a.skeptical + .55, a.card + .05];
  const foldAt = [ (LL.x1 + LL.x2) / 2, LL.y ];
  const GP = F.smoothPath([[foldAt[0], foldAt[1] - 30], [foldAt[0] - 160, foldAt[1] - 60], [foldAt[0] - 520, foldAt[1] + 40], [handHold[0] + 120, handHold[1] - 70], [handHold[0] + 4, handHold[1] - CARD.h * .38]], 16);

  // ------------------------------------------------------------------------------------------------ camera
  const sClose = 2.25, closeAt = [YOU.x1 + 40, YOU.y - 120];
  const MORN = { x: 1250, len: 240 };
  const KP = [
    [t0, cam3()],
    [a.T8 - .2, cam3({ x: 10, y: -6, z: 40 })],
    [a.toobig + .3, cam3({ x: -60, y: -40, z: 220 })],
    [a.doubling + .2, cam3({ x: 20, y: -40, z: 230 })],
    [a.bet + .6, cam3({ x: 200, y: -40, z: 260 })],
    [a.skeptical + .5, cam3({ x: 170, y: -20, z: 220 })],
    [a.card + .25, aim(F0, closeAt[0], closeAt[1], sClose, W / 2 + 80, H / 2 + 20)],
    [a.fair + .5, aim(F0, closeAt[0], closeAt[1], sClose * 1.04, W / 2 + 80, H / 2 + 20)],
    [a.decade, cam3({ x: 120, y: -230, z: -1500 })],
    [a.morning + .7, cam3({ x: 150, y: -236, z: -1440 })],
  ];
  // 8.05: the push into the morning light (log zoom on its centre) with the camera roll that tilts it into the stroke
  const tPush = a.morning + .7, sEnd = STROKE.len / MORN.len;
  const camP = (t) => {
    if (t <= tPush) return camDrift(camAt(t, KP), t, DRIFT);
    const c0 = camDrift(camAt(tPush, KP), tPush, DRIFT), u = span(t, tPush, tPlate), e = sineIO(u);
    // where the morning light sits on screen at tPush, and its scale
    const p0 = E.project(c0, F0, MORN.x, HZ), s0 = p0[2];
    const s = Math.exp(lerp(Math.log(s0), Math.log(sEnd), e)), sx = lerp(p0[0], STROKE.x, e), sy = lerp(p0[1], STROKE.y, e);
    const cc = aim(F0, MORN.x, HZ, s, sx, sy, Math.max(F0, 80 * s));
    return camDrift({ ...cc, roll: STROKE.ang * e }, t, DRIFT * (1 - smooth(u)));
  };

  // ------------------------------------------------------------------------------------------------ draw
  function draw(ctx, t) {
    if (t >= tPlate) { strokePlate(ctx, t); return; }
    const c = camP(t);
    const pushK = span(t, tPush, tPlate);
    const dawn = smooth(span(t, a.morning - .5, a.morning + 1.2));
    C.nightBg(ctx);
    world(ctx, t, c, { grow: 1, dawn, night: smooth(span(pushK, .15, .85)) });
    // the near rise you stand on (it only shows when the camera comes close or pulls far back)
    card(ctx, c, F0, () => {
      const dimL = 1 - .55 * smooth(span(t, a.is, a.toobig)) + .35 * smooth(span(t, a.ifyou, a.card));
      const fade = 1 - smooth(span(pushK, .2, .8));
      lights.forEach(([x, y, r, ph], i) => {
        const star = i === ISTAR;
        const b = star ? expoOut(span(t, a.is - .1, a.is + .7)) * (1 - span(t, a.ifyou, a.card)) : 0;
        if (fade > .01) light(ctx, t, x, y, r * (1 + .45 * b) * (.15 + .85 * fade), 1, r, { dim: clamp(dimL + 1.2 * b, 0, 1.6) * fade });
      });
      lifeLine(ctx, t);
      you(ctx, t);
      morning(ctx, t, pushK);
    });
  }

  function you(ctx, t) {
    const w = span(t, tWalk[0], tWalk[1]);
    const xp = w < 1 ? (w * (2 - w)) * .5 + w * .5 : 1, x = lerp(YOU.x0, YOU.x1, xp);
    const ph = Math.PI * WALKN * xp;
    const settle = smooth(span(t, tWalk[1] - .2, tWalk[1] + .6));
    const hold = smooth(span(t, a.card - .45, a.card + .15));
    const look = lerp(.35, .55, settle) * (1 - hold) + .22 * hold + .04 * Math.sin(t * .7);
    const arms = hold > 0 ? { armR: [lerp(0, HOLD.armR[0], hold), lerp(.3, HOLD.armR[1], hold)], armL: [lerp(0, HOLD.armL[0], hold), lerp(.3, HOLD.armL[1], hold)] } : {};
    E.castShadow(ctx, x, YOU.y + 2, 24, 90, Math.PI * .8, .35);
    const hd = E.du(ctx, x, YOU.y, YOU.h, { dir: 1, walk: ph, look, light: 1, ...arms, rim: mixHex(P.coat, P.core1, .6) });
    // the card in your hand (after the glide): a small card of light with the dashed line printed on it
    if (t >= tGlide[1]) cardOfLight(ctx, t, hd.R[0] + 4, hd.R[1] - CARD.h * .38, 1, -.08 + .02 * Math.sin(t * .9));
  }

  function cardOfLight(ctx, t, x, y, sc, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    const p = new Path2D(); p.roundRect(-CARD.w / 2, -CARD.h / 2, CARD.w, CARD.h, 6);
    E.glowFill(ctx, p, 40, .55, P.blue0); E.glowFill(ctx, p, 10, .6, P.halo1);
    ctx.fillStyle = E.lin(ctx, 0, -CARD.h / 2, 0, CARD.h / 2, [[0, P.core0], [.6, P.core1], [1, P.halo2]]); ctx.fill(p);
    ctx.strokeStyle = rgba(F.INK, .85); ctx.lineWidth = 2.4; ctx.setLineDash([7, 6]); ctx.beginPath(); ctx.moveTo(-CARD.w * .36, 0); ctx.lineTo(CARD.w * .36, 0); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = F.INK; ctx.beginPath(); ctx.arc(-CARD.w * .36, 0, 3, 0, 6.29); ctx.fill();
    ctx.restore();
  }

  // 8.01 · 8.02 · 8.03 the life line, solid then dashed, the dashed part folds into the card and glides to you
  function lifeLine(ctx, t) {
    const u1 = sineIO(span(t, a.toobig - .1, a.toobig + 1.3));
    if (u1 <= 0) return;
    const sink = (u, k) => u * (1 - expoIn(k));
    // solid (gold): the life of the 20th century
    const fadeSolid = smooth(span(t, a.morning - .2, a.morning + 1.2));
    const retract = 1 - smooth(span(t, a.morning + 1.2, T9p - .9));
    if (retract > .01) F.trailSpan(ctx, [[LL.x0, LL.y], [LL.x1, LL.y]], 0, u1 * retract, { w: 2.6 * (1 + .25 * fadeSolid), spark: u1 < 1 });
    for (const k of [0, 25, 50, 75]) { const x = lerp(LL.x0, LL.x1, k / 75), uk = expoOut(span(u1, k / 75 - .05, k / 75 + .1)); if (uk > 0 && k) { ctx.fillStyle = rgba(P.halo0, .9 * (1 - fadeSolid)); ctx.fillRect(x - 1, LL.y - 12 * uk, 2, 12 * uk); } }
    const out1 = span(t, a.ifyou - .1, a.ifyou + .4);
    F.maskLine(ctx, [['~75 years', 0]], (LL.x0 + LL.x1) / 2, LL.y - 34, 52, sink(smooth(span(t, a.toobig + .9, a.toobig + 1.8)), out1), { align: 'center' });
    F.source15(ctx, 'Essay · 2024', (LL.x0 + LL.x1) / 2, LL.y + 58, sink(smooth(span(t, a.onepart, a.onepart + .9)), out1), { align: 'center', size: 24 });
    // dashed (cool): the doubling, the bet. It folds into the card (accordion towards its middle) and leaves along GP
    const u2 = sineIO(span(t, a.doubling - .05, a.doubling + 1.4)), fold = sineIO(span(t, tFold[0], tFold[1]));
    if (u2 > 0 && fold < 1) {
      const mid = (LL.x1 + LL.x2) / 2, half = (LL.x2 - LL.x1) / 2 * (1 - fold);
      const xa = lerp(LL.x1, mid - half, fold), xb = Math.min(LL.x1 + (LL.x2 - LL.x1) * u2, mid + half);
      ctx.save(); ctx.setLineDash([16 * (1 - fold * .7), 14 * (1 - fold * .8)]); ctx.lineDashOffset = 0; ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(F.COOL, .95); ctx.lineWidth = 3 + 3 * fold; ctx.beginPath(); ctx.moveTo(xa, LL.y - 60 * fold); ctx.lineTo(xb, LL.y - 60 * fold); ctx.stroke(); ctx.restore();
      if (fold > 0) { const k = smooth(span(fold, .55, 1)); if (k > 0) cardOfLight(ctx, t, foldAt[0], foldAt[1] - 30 - 60 * fold + 30, k * 1.0, 0); }
    }
    if (fold >= 1 && t < tGlide[1]) {
      const g = sineIO(span(t, tGlide[0], tGlide[1])), fr = F.pathFrame(GP), [x, y] = fr.atU(g);
      cardOfLight(ctx, t, x, y, 1, .25 * Math.sin(Math.PI * g) - .08 * g);
    }
    const outD = span(t, a.ifyou - .1, a.ifyou + .4), uN = sink(smooth(span(t, a.none - .05, a.none + .8)), span(t, a.bet - .25, a.bet + .15));
    F.maskLine(ctx, [['CLINICAL EVIDENCE: NONE', 0]], (LL.x1 + LL.x2) / 2, LL.y - 40, 34, uN, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 });
    const uB = sink(smooth(span(t, a.bet + .05, a.bet + .9)), outD);
    F.maskLine(ctx, [['a bet, not a forecast', 0]], (LL.x1 + LL.x2) / 2, LL.y - 36, 56, uB, { align: 'center' });
  }

  // 8.04 · 8.05 the first morning: a thin warm light at the horizon that grows; the push turns it into one short stroke
  function morning(ctx, t, pushK) {
    const u = expoOut(span(t, a.morning - .25, a.morning + 1.4));
    if (u <= 0) return;
    const br = 1 + .03 * Math.sin(t * 1.7) * smooth(pushK), len = MORN.len * u, th = lerp(2.4, STROKE.w / sEnd, smooth(pushK)) * br;
    const c0 = [MORN.x - len / 2, HZ - 1], c1 = [MORN.x + len / 2, HZ - 1];
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, MORN.x, HZ, len * .9, [[0, rgba(P.halo1, .35 * u * (1 - smooth(span(pushK, .3, .95))))], [.5, rgba(P.halo1, .08 * u * (1 - smooth(span(pushK, .3, .95))))], [1, rgba(P.halo1, 0)]]);
    ctx.save(); ctx.translate(MORN.x, HZ); ctx.scale(1, .22); ctx.translate(-MORN.x, -HZ); ctx.beginPath(); ctx.arc(MORN.x, HZ, len * .9, 0, 6.29); ctx.fill(); ctx.restore();
    ctx.restore();
    C.chalk(ctx, c0, c1, th, 1, { warm: .55 + .45 * (1 - pushK), glow: 1, grain: false });
  }

  return { draw, t0, tPlate, lights, light, world, DRIFT, a };
}
