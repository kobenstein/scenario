// Film 13 · c12 (B3) · "The bubble may pop." → end of film (VO end + ≤ 15 s end screen) · ONE take, three worlds, carried:
//   BUBBLE (plate c11|c12)  the bubble over the data center (the film's first image) trembles and finally pops, gently: its notes fly
//                           out and drift down like paper; the data center below keeps glowing, brighter ("won't stop"). Between the
//                           notes two words: "Bubble?" — on "rails" the word "Rails?" rises in its place and pushes it down (the swap).
//   TICKER                  the notes fall into one row and turn over (flip): their backs are the cells of a stock ticker; it runs left
//                           and goes still ("stock market").
//   WINDOWS                 the still ticker becomes a terrace at night: every other cell stretches into a lit window, the rest into the
//                           string course; the facade rises from the band. In the windows people hold a ticket (student, a two-person
//                           start-up, a nurse, then you); they raise it on "who gets to ride". The camera glides right and settles on
//                           your window (calm: your hand with the ticket); on "everyone" the dark windows light up too.
//   A4 ★                    the camera flies into your ticket until it fills the frame; it FLIPS: its back is the sign PRICE: [ ] at
//                           the end of a new rail at dusk. Pull-back: two workers lay the rail (sparks on "right now"), the empty field
//                           glows ("price of a seat"), you stand beside the sign. END SCREEN: the pull-back goes on slowly; the rail
//                           runs left into the dusk, a small lit train glides along the horizon, stars come. Free for the YouTube end
//                           cards: left x 90–780 / right x 1140–1830 (y 250–700), centre x 810–1110 (y 330–600) stay open sky.
import { Path2D } from '@napi-rs/canvas';
import { E, K, B, rise, ramp, sramp, herm, bump, PUSH, zoomAt, BB, DCB, PL_C, bwSky, bwGround, bwDC, perez, plateBubble, ticketNew } from './b3_common.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, prng, halo, card, camAt, camDrift, aim, project, F0, drift } = E;
const { COL } = B;

// ------------------------------------------------------------------------------------------------ ticker (screen at the hand-over)
const SLOT_Y = 600, PITCH = 250, CW = 236, CH = 70, J0 = -2, J1 = 4;     // the notes land in cells J0..J1
const TICK = ['+2.4 %', '−3.1 %', '+0.8 %', '−5.6 %', '+1.9 %', '−0.7 %', '+4.2 %', '−2.2 %', '+0.3 %', '−8.4 %', '+3.3 %', '−1.5 %'];
const VMAX = 520, VEND = 8;
// ------------------------------------------------------------------------------------------------ the terrace (design = screen at the hand-over)
const ROOF = 270, STREET = 900, WIN = { w: 300, y0: 360, y1: 740 }, BAND = { y0: 591, y1: 609 };
const PH = 540, PFEET = 1010;                                             // the people behind the sills
const TW = 64;                                                            // your ticket (design width)
const ARM_REST = [.18, .1], ARM_UP = [.62, 1.78];
// ------------------------------------------------------------------------------------------------ A4 (design at the home camera = the end screen)
const HOR = 730, NEAR = 786, RY = 822, RX_END = 840, FEET = 830, FRY = HOR + 14;
const BOARD = { x: 960, y: 700, w: 170 }; BOARD.h = BOARD.w * .45;
const YOU4 = { x: 1094, h: 100 };
const JOINT = [RX_END - 2, RY + 1];
const ARMS_A = (t) => [.95 + .04 * Math.sin(t * 7.3), .55 + .05 * Math.sin(t * 7.3 + 1)];

// the hand of a front-facing figure (same arm maths as E.figure, no lean)
const handOf = (x, y, h, dir, [s1, s2], sd = 1) => [x + h * dir * (sd * .098 + Math.sin(s1) * .17 + Math.sin(s2) * .155), y + h * (-.74 + Math.cos(s1) * .17 + Math.cos(s2) * .155)];

// a log-scale glide l(t) from l0 (at t0) to l1 (at t1): the rate follows shape(l) (relative), eases in over the first 0.5 s and out over the
// last 0.25 of log distance, and is scaled (bisection) so that it arrives exactly at t1. Returns l(t) (clamped outside [t0, t1]).
function glide(t0, t1, l0, l1, shape) {
  const dt = 1 / 240, sg = Math.sign(l1 - l0), D = Math.abs(l1 - l0);
  const run = (k, keep) => {
    let l = l0, t = t0; const tab = keep ? [l] : null;
    while (Math.abs(l - l0) < D - 1e-4 && t < t1 + 30) {
      const rem = D - Math.abs(l - l0), r = k * shape(l) * smooth(clamp((t - t0) / .5)) * (.06 + .94 * smooth(clamp(rem / .25)));
      l += sg * Math.min(rem, r * dt); t += dt; if (keep) tab.push(l);
    }
    return keep ? tab : t;
  };
  let lo = .05, hi = 50; for (let i = 0; i < 50; i++) { const m = Math.sqrt(lo * hi); run(m) > t1 ? (lo = m) : (hi = m); }
  const tab = run(hi, true), n = tab.length - 1, sc = n * dt / (t1 - t0);   // tiny residual: stretch the table onto [t0, t1]
  return (t) => { if (t <= t0) return l0; if (t >= t1) return l1; const i = (t - t0) / dt * sc, j = Math.min(n - 1, Math.floor(i)); return lerp(tab[j], tab[j + 1], i - j); };
}

export function make(T, R) {
  E.prepareEditorial();
  const at = T.seq(R.a), a = {};
  a.T0 = R.a; a.pop = at('pop'); a.superI = at('Superintelligence'); a.wont = at("won't stop"); a.twenty = at('In twenty years');
  a.bubbleW = at('bubble'); a.or = at('Or'); a.railsW = at('rails'); a.that = at("That won't"); a.stock = at('stock market');
  a.itll = at("It'll be decided"); a.who = at('who gets to ride'); a.ride = at('ride'); a.we = at('We make these films');
  a.everyone = at('everyone'); a.ifyou = at('If you want'); a.subscribe = at('subscribe'); a.laid = at('The rails are being laid');
  a.rightnow = at('right now'); a.price = at('The price of a seat'); a.seat = at('seat'); a.hasnt = at("hasn't been set"); a.yet = at('yet');
  a.T1 = R.b;
  const tPL = a.T0 + .5, tPop = a.pop;

  // ================================================================ A · the plate world (plate space: zoom about PL_C)
  const tW0 = a.itll;                                                       // the still ticker becomes the terrace
  const lnZ = (t) => (t < tPL ? PUSH * (t - (a.T0 - .5)) : herm(t, tPL, tW0, PUSH, .2, PUSH, .002));
  const zP = (t) => Math.exp(lnZ(Math.min(t, tW0)));
  const trem = (t) => .25 + .6 * ramp(t, tPL, tPop);
  const thin = (t) => .7 * bump(t, tPL, tPop);
  const dcLum = (t) => .8 + .7 * ramp(t, a.wont - .2, a.wont + .7);
  const ALL = new Set([0, 1, 2, 3, 4, 5, 6]);
  const toScr = (x, y, z) => [PL_C[0] + (x - PL_C[0]) * z, PL_C[1] + (y - PL_C[1]) * z];

  // the notes at the pop (exactly B.bubble's poses and look at tPop), then their own flight: burst, then paper drifting down
  const NOTES = B.bubblePoses(BB.x, BB.y, BB.r, tPop, { tremble: trem(tPop) }).map((q) => {
    const r = prng(700 + q.id * 13), dx = q.x - BB.x, dy = q.y - BB.y, l = Math.hypot(dx, dy) || 1, z = q.z;
    return { ...q, ux: dx / l, uy: dy / l, D: BB.r * (.42 + .3 * q.nt.sz), vf: 24 + 16 * r(), A: 22 + 22 * r(), om: .9 + .6 * r(), ph: q.nt.ph,
      a0: z < 0 ? .42 + .3 * (1 + z) : .86 + .14 * z, glow0: z < 0 ? 1 : 1, lum0: z < 0 ? .5 : .78 + .22 * z, sgn: Math.sign(q.sx) || 1 };
  });
  const notePlate = (n, t) => {
    const b = expoOut(span(t, tPop, tPop + 1.5)), tf = Math.max(0, t - tPop - .25), sw = ramp(t, tPop + .15, tPop + 1.8);
    const fall = n.vf * (tf - .8 * (1 - Math.exp(-tf / .8)));
    const x = n.x + n.ux * n.D * b + n.A * Math.sin(n.om * tf + n.ph) * sw - n.A * Math.sin(n.ph) * sw;
    const y = n.y + n.uy * n.D * b * .8 + fall;
    const rot = n.rot + (n.ph - 3) * .3 * b + .26 * Math.sin(n.om * tf + n.ph + 1.2) * sw - .26 * Math.sin(n.ph + 1.2) * sw;
    const sx = lerp(n.sx, n.sgn * (.66 + .34 * Math.cos(n.om * .7 * tf + n.ph)), sw);
    return { x, y, rot, sx, w: n.w, k: b };
  };
  // the gather: sorted by screen x at tG0 → cells J0..J1 (left to right), each glides and flips (its back is the cell)
  const tG0 = a.that - .25;
  const ORDER = NOTES.map((n, i) => [toScr(notePlate(n, tG0).x, 0, zP(tG0))[0], i]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);
  const GATH = new Map(ORDER.map((i, k) => [i, { j: J0 + k, g0: tG0 + .05 * k, g1: tG0 + .05 * k + .85 }]));
  const tGo = Math.max(...[...GATH.values()].map((g) => g.g1));
  const tD0 = a.stock + .1;
  const vT = (t) => (t <= tGo ? 0 : t < tGo + 1 ? VMAX * sineIO(span(t, tGo, tGo + 1)) : t < tD0 ? VMAX : t < tD0 + 1 ? lerp(VMAX, VEND, sineIO(span(t, tD0, tD0 + 1))) : VEND);
  const DT = 1 / 600, OFF = [0];
  for (let tt = tGo; tt <= tW0 + .1; tt += DT) OFF.push(OFF[OFF.length - 1] + vT(tt + DT / 2) * DT);
  const off = (t) => { if (t <= tGo) return 0; const i = Math.min((t - tGo) / DT, OFF.length - 1.001), j = Math.floor(i); return lerp(OFF[j], OFF[j + 1], i - j); };
  const offW = off(tW0);
  const cellX = (j, t) => 960 + j * PITCH - off(Math.min(t, tW0));
  // the terrace: windows on every other cell, starting with the cell nearest x 470 at tW0
  const jr = Math.round((470 - 960 + offW) / PITCH);
  const isWin = (j) => (((j - jr) % 2) + 2) % 2 === 0;
  const WX = (k) => 960 + (jr + 2 * k) * PITCH - offW;
  const XY = WX(3);
  const YOUW = { x: XY + 110, y: PFEET, h: PH };

  // ================================================================ your ticket, the fly-in, the flip (12.04 → 12.05)
  // timing: the slow push into your ticket starts on "everyone" (the dark windows light while it is still wide); the ticket fills the
  // frame in the pause after "subscribe"; the FLIP (backdrop: the paper plate, so nothing else shows while it turns) lands on the sign
  // before "The rails are being laid"; the pull-back reaches the grinder on "right now".
  const tZ0 = a.everyone - .05, tF1 = a.laid - 1.5, tF2 = tF1 + 1.0, tPB1 = a.rightnow + .05;
  const tRaise = a.ride - .15, tCalm = tZ0;
  const breath = (t) => 1 - ramp(t, tCalm, tF1 - .45);
  const yourArm = (t) => {
    const u = sramp(t, tRaise, tRaise + .9), b = breath(t);
    return [lerp(ARM_REST[0], ARM_UP[0], u) + .014 * Math.sin(t * 1.3) * b, lerp(ARM_REST[1], ARM_UP[1], u) + .02 * Math.sin(t * 1.3 + .4) * b];
  };
  const yourTicket = (t) => { const h = handOf(YOUW.x, YOUW.y, YOUW.h, -1, yourArm(t)); return { x: h[0] - 16, y: h[1] - 20, rot: lerp(-.22, 0, sramp(t, tCalm - .4, tF1 - .35)) }; };
  const CXS = 960 + 250, CYS = 540, WFILL = 2800;                  // the ticket just covers the frame here when the flip starts
  const TROWS = [['1 SEAT', .4, true], ['ARTIFICIAL INTELLIGENCE · EVERY DAY', .056, false]];
  const TLUM = (t) => lerp(.72, .5, ramp(t, tZ0 + 1, tF1));            // the paper dims as it fills the frame (low contrast = no lurch)
  const BLUM = (t) => lerp(.5, .72, ramp(t, tPB1, a.seat + .3));
  const tGlow = (t) => (.45 + .2 * ramp(t, a.ride, a.ride + .6) + .1 * Math.sin(t * 1.2) * breath(t)) * (1 - .7 * ramp(t, tF1 - 1.2, tF1));
  const wFlip = (t) => WFILL * Math.exp(PUSH * (t - tF1));
  const DIM = (t) => .35 * ramp(t, tZ0 + 1.2, tF1 - .2) * (1 - ramp(t, tF2 + .2, tPB1));   // night on the full-frame paper (luma ≤ 60, low contrast)              // the plate push goes on while it turns

  // ================================================================ the terrace camera (keys up to tZ0, then the computed fly-in)
  const KH = [
    [tW0, aim(F0, 960, 540, 1)],
    [a.we + 1.2, aim(F0, XY - 20, 556, 1.42)],
    [tZ0, aim(F0, XY - 30, 562, 1.6)],
  ];
  const driftH = (t) => .55 * ramp(t, tW0, tW0 + 2) * (1 - ramp(t, tZ0, tF1 - .3));   // none at the flip: the ticket sits exactly where the flip draws it
  const tk0 = yourTicket(tZ0), P0 = project(camAt(tZ0, KH), F0, tk0.x, tk0.y);
  // log-scale glide: rate follows a shape (slow while the busy facade fills the frame, faster once it is the warm room and the ticket),
  // scaled so that it arrives exactly at tF1 with the ticket WFILL wide
  const tkCov = (l) => { const w = TW * Math.exp(l), h = .45 * w; return Math.max(0, Math.min(W, CXS + w / 2) - Math.max(0, CXS - w / 2)) * Math.max(0, Math.min(H, CYS + h / 2) - Math.max(0, CYS - h / 2)) / (W * H); };
  const FIN = glide(tZ0, tF1, Math.log(1.6), Math.log(WFILL / TW), (l) => Math.min(.5 + .7 * smooth(span(l, Math.log(2.6), Math.log(11))),
    .55 / Math.max(.05, Math.abs((tkCov(l + .01) - tkCov(l - .01)) / .02))));   // and slower while the bright ticket covers more of the frame
  const camH = (t) => {
    if (t <= tZ0) return camDrift(camAt(Math.max(t, tW0), KH), t, driftH(t), 13);
    const l = FIN(t), p = (l - Math.log(1.6)) / (Math.log(WFILL / TW) - Math.log(1.6)), tk = yourTicket(t);
    return camDrift(aim(F0, tk.x, tk.y, Math.exp(l), lerp(P0[0], CXS, p), lerp(P0[1], CYS, p)), t, driftH(t), 13);
  };

  // ================================================================ the A4 camera: computed pull-back (the sign's coverage of the frame falls
  // evenly), then keys into the end screen
  const S0 = wFlip(tF2) / BOARD.w, S1 = 3.3, B1 = [1141, 401];
  const boardCov = (l) => { const w = BOARD.w * Math.exp(l), h = w * .45, q = clamp((Math.log(S0) - l) / (Math.log(S0) - Math.log(S1))), cx = lerp(CXS, B1[0], q), cy = lerp(CYS, B1[1], q);
    return Math.max(0, Math.min(W, cx + w / 2) - Math.max(0, cx - w / 2)) * Math.max(0, Math.min(H, cy + h / 2) - Math.max(0, cy - h / 2)) / (W * H); };
  const PB = glide(tF2, tPB1, Math.log(S0), Math.log(S1), (l) => Math.min(3.5, 1 / Math.max(.08, Math.abs((boardCov(l + .01) - boardCov(l - .01)) / .02))));
  const KA = [
    [tPB1, aim(F0, BOARD.x, BOARD.y, S1, B1[0], B1[1])],
    [a.seat + .6, aim(F0, 950, 738, 2.45, 960, 545)],
    [a.yet + 1.6, aim(F0, 960, 585, 1.12)],                          // the sign sits below the centre end card's zone
    [a.T1, aim(F0, 1000, 540, .86)],
  ];
  const driftA = (t) => .5 * ramp(t, tF2 + .5, tF2 + 3);
  const camA = (t) => {
    if (t >= tPB1) return camDrift(camAt(t, KA), t, driftA(t), 17);
    const l = PB(t), q = (Math.log(S0) - l) / (Math.log(S0) - Math.log(S1));
    return camDrift(aim(F0, BOARD.x, BOARD.y, Math.exp(l), lerp(CXS, B1[0], q), lerp(CYS, B1[1], q)), t, driftA(t), 17);
  };

  // sparks: a seeded stream from the grinder at the rail joint; a burst on "right now", then steady, then short bursts in the end screen
  const tS0 = a.rightnow - .03;
  const rate = (t) => (t < tS0 ? 0 : t < tS0 + .4 ? 75 : t < a.yet + .8 ? 24 * (.75 + .25 * Math.sin(t * 5.1)) : ((t - a.yet) % 2.7) < .6 ? 16 : 0);
  const SPK = (() => {
    const r = prng(6340), out = []; let tt = tS0;
    while (tt < a.T1 + 1) { const rr = rate(tt); if (rr > 0) { out.push({ tb: tt, ang: -3.05 + 1.3 * r(), v: 170 + 260 * r(), life: .28 + .5 * r() }); tt += (.6 + .8 * r()) / rr; } else tt += .02; }
    return out;
  })();
  const spark = (t) => clamp(rate(t) / 40) * (t >= tS0 ? 1 : 0);

  // ================================================================ draw
  return (ctx, t) => {
    if (t < tPL) { plateBubble(ctx, t, a.T0); return; }
    if (t < tW0) { plateWorld(ctx, t); notes(ctx, t); ticker(ctx, t); words(ctx, t); return; }
    if (t < tF1) { terrace(ctx, t); return; }
    a4(ctx, t);
  };

  // ================================================================================================ A · plate world, notes, words
  function plateWorld(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); zoomAt(ctx, zP(t), PL_C[0], PL_C[1]);
    bwSky(ctx, t); bwGround(ctx); perez(ctx, t, { dots: () => 1 });
    bwDC(ctx, t, 1, dcLum(t));
    const g = ramp(t, a.wont - .2, a.wont + .9);
    if (g > 0) halo(ctx, DCB.x + DCB.w / 2, DCB.y - DCB.h * .6, 680, .24 * g * (1 + .08 * Math.sin(t * 1.4)), COL.cool2, COL.cool);
    if (t < tPop) B.bubble(ctx, BB.x, BB.y, BB.r, t, { tremble: trem(t), thin: thin(t) });
    else if (t < tPop + 1.5) B.bubble(ctx, BB.x, BB.y, BB.r, t, { tremble: trem(tPop) * (1 - ramp(t, tPop, tPop + .3)), pop: span(t, tPop, tPop + 1.5), detach: ALL });
    ctx.restore();
  }
  // a note (or, past the edge of its flip, its back: the ticker cell) at screen pose
  function notes(ctx, t) {
    if (t < tPop) return;
    const z = zP(t), list = NOTES.map((n, i) => [n, i]).sort((p, q) => p[0].z - q[0].z);
    for (const [n, i] of list) {
      const G = GATH.get(i); if (t >= G.g1 && t >= tGo) continue;   // the ticker draws it now
      const p = notePlate(n, t), k = smooth(p.k);
      let [x, y] = toScr(p.x, p.y, z), w = p.w * z, rot = p.rot, sxw = p.sx;
      const u = sineIO(span(t, G.g0, G.g1)), fu = sineIO(span(t, G.g0 + .2, G.g1 - .05));
      if (u > 0) { x = lerp(x, cellX(G.j, t), u); y = lerp(y, SLOT_Y, u) - 40 * Math.sin(Math.PI * u); w = lerp(w, CW, u); rot = lerp(rot, 0, u); sxw = lerp(sxw, n.sgn, u); }
      const c = Math.cos(Math.PI * fu);
      if (c >= 0) B.banknote(ctx, x, y, w, rot, { sx: sxw * Math.max(.02, c), a: lerp(n.a0, 1, k), simple: n.z < 0 && k < .5, glow: lerp(n.glow0, .3, k), lum: lerp(n.lum0, .84, k) });
      else cellFace(ctx, x, y, w, w * CH / CW, rot, Math.max(.02, -c), G.j, 1);
      if (Math.abs(c) < .25) halo(ctx, x, y, w * .5 * (1 - Math.abs(c) * 4), .3 * (1 - Math.abs(c) * 4), P.halo0, P.core0);
    }
  }
  function words(ctx, t) {
    if (t < a.bubbleW - .2 || t > a.that + 1.2) return;
    const out = span(t, a.that + .45, a.that + .95), sw = sineIO(span(t, a.or - .2, a.or + .5));
    // "Bubble?" rises (upper line), then slides down a line and cools; "Rails?" rises in its place, warm
    const u1 = Math.min(rise(span(t, a.bubbleW - .15, a.bubbleW + .45)), 1 - out * out);
    if (u1 > 0) K.maskLine(ctx, [['Bubble?', 0]], 560 + 40 * Math.sin(Math.PI * sw), lerp(360, 520, sw), lerp(116, 84, sw), u1, { align: 'center', col: mixHex(P.cream, P.blue2, .55 * sw) });
    const u2 = Math.min(rise(span(t, a.railsW + .02, a.railsW + .65)), 1 - span(t, a.that + .35, a.that + .95) ** 2);
    if (u2 > 0) K.maskLine(ctx, [['Rails?', .8]], 560, 360, 116, u2, { align: 'center' });
  }

  // ================================================================================================ the ticker
  function cellFace(ctx, x, y, w, h, rot, sx, j, textU) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx, 1);
    const p = new Path2D(); p.roundRect(-w / 2, -h / 2, w, h, h * .16);
    ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(P.ind2, P.blue1, .35)], [1, mixHex(P.night1, P.ind2, .5)]]); ctx.fill(p);
    ctx.fillStyle = rgba(COL.cool, .5); ctx.fillRect(-w / 2 + h * .16, -h / 2, w - h * .32, Math.max(1, h * .03));
    if (textU > 0) {
      const s = TICK[((j % TICK.length) + TICK.length) % TICK.length], up = s[0] === '+', col = up ? COL.cool : mixHex(COL.loss, COL.cool, .5), fs = h * .42;
      ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
      const dy = (1 - expoOut(textU)) * h * .8;
      ctx.fillStyle = col; ctx.beginPath();
      const ax = -w * .3, ay = dy;
      if (up) { ctx.moveTo(ax - fs * .3, ay + fs * .2); ctx.lineTo(ax + fs * .3, ay + fs * .2); ctx.lineTo(ax, ay - fs * .3); }
      else { ctx.moveTo(ax - fs * .3, ay - fs * .25); ctx.lineTo(ax + fs * .3, ay - fs * .25); ctx.lineTo(ax, ay + fs * .25); }
      ctx.closePath(); ctx.fill();
      ctx.font = `600 ${fs}px Inter`; ctx.textAlign = 'left'; ctx.fillText(s, -w * .18, ay + fs * .36);
      ctx.restore();
    }
    ctx.restore();
  }
  function ticker(ctx, t) {
    if (t < tGo - .3) return;
    for (let j = J0; j < J0 + 40; j++) {
      const x = cellX(j, t); if (x > W + CW) break; if (x < -CW) continue;
      if (j <= J1) { const G = GATH.get(ORDER[j - J0]); if (t < G.g1) continue; }
      cellFace(ctx, x, SLOT_Y, CW, CH, 0, 1, j, 1);
    }
  }

  // ================================================================================================ the terrace (camera camH)
  function terrace(ctx, t) {
    const c = camH(t), gF = sineIO(span(t, tW0 - .05, tW0 + 1.15));
    const M0 = zP(tW0);
    // the plate's sky (far) and, until the facade covers them, its ground and the data center (mid) — frozen plate transform
    card(ctx, c, 20000, () => { ctx.transform(M0, 0, 0, M0, PL_C[0] * (1 - M0), PL_C[1] * (1 - M0)); bwSky(ctx, t); });
    if (gF < 1) card(ctx, c, 6000, () => { ctx.transform(M0, 0, 0, M0, PL_C[0] * (1 - M0), PL_C[1] * (1 - M0)); bwGround(ctx); perez(ctx, t, { dots: () => 1 }); bwDC(ctx, t, 1, dcLum(t)); });
    card(ctx, c, F0, () => facade(ctx, t, gF));
    // your ticket in screen space (paper grain stays fine at any zoom), clipped to your window
    const tk = yourTicket(t), p = project(c, F0, tk.x, tk.y), w0 = project(c, F0, XY - WIN.w / 2, WIN.y0), w1 = project(c, F0, XY + WIN.w / 2, WIN.y1);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.rect(w0[0], w0[1], w1[0] - w0[0], w1[1] - w0[1]); ctx.clip();
    ticketNew(ctx, p[0], p[1], TW * p[2], tk.rot, { glow: tGlow(t), rows: TROWS, lum: TLUM(t), dim: DIM(t) });
    ctx.restore();
  }
  function facade(ctx, t, gF) {
    const yT = lerp(565, ROOF, gF), yB = lerp(635, 1500, gF), gab = rise(span(gF, .55, 1));
    // the wall (one dark mass that grows out of the band), the street below it
    ctx.fillStyle = lin(ctx, 0, ROOF - 90, 0, STREET, [[0, mixHex(P.ind2, P.blue1, .28)], [.35, P.ind2], [1, mixHex(P.night1, P.ind2, .4)]]);
    ctx.fillRect(-4000, yT, 10000, yB - yT);
    if (gab > 0) {   // gables and chimneys rise from the roof line
      const g = new Path2D();
      for (let k = -2; k <= 7; k++) { const x = WX(k); g.moveTo(x - 210, ROOF + 1); g.lineTo(x, ROOF - 78 * gab); g.lineTo(x + 210, ROOF + 1); g.closePath(); if (k % 2 === 0) g.rect(x + 120, ROOF - 70 * gab - 30 * gab, 34, 70 * gab + 31); }
      ctx.fillStyle = mixHex(P.ind2, P.blue1, .28); ctx.fill(g);
      ctx.strokeStyle = rgba(P.blue0, .55 * gab); ctx.lineWidth = 2.5; ctx.stroke(g);
    }
    if (gF > .02) {
      ctx.fillStyle = rgba(P.blue0, .5 * gF); ctx.fillRect(-4000, yT - 1, 10000, 2);
      for (let k = -2; k <= 7; k++) { const x = WX(k) + 250; ctx.fillStyle = rgba(P.night0, .35 * gF); ctx.fillRect(x - 2, yT, 4, Math.min(STREET, yB) - yT); }   // party walls
    }
    if (yB > STREET) {   // the street
      ctx.fillStyle = lin(ctx, 0, STREET, 0, STREET + 300, [[0, mixHex(P.night1, P.ind2, .3)], [1, P.night0]]); ctx.fillRect(-4000, STREET, 10000, yB - STREET);
      ctx.fillStyle = rgba(P.blue0, .4); ctx.fillRect(-4000, STREET, 10000, 2);
    }
    // the cells: windows (every other) and the string course (the rest)
    for (let j = J0; j < J0 + 40; j++) {
      const x = cellX(j, tW0); if (x > 6000) break;
      const d = .04 * Math.abs(x - 960) / PITCH, g = sineIO(span(t, tW0 + Math.min(.3, d), tW0 + Math.min(.3, d) + .9)), textU = 1 - span(t, tW0 - .25, tW0 + .2);
      if (!isWin(j)) {
        const w = lerp(CW, PITCH + 2, g), y0 = lerp(SLOT_Y - CH / 2, BAND.y0, g), y1 = lerp(SLOT_Y + CH / 2, BAND.y1, g);
        if (g < 1) cellFace(ctx, x, (y0 + y1) / 2, w, y1 - y0, 0, 1, j, textU);
        else { ctx.fillStyle = mixHex(P.ind2, P.blue1, .32); ctx.fillRect(x - w / 2, y0, w, y1 - y0); ctx.fillStyle = rgba(P.blue0, .45); ctx.fillRect(x - w / 2, y0, w, 1.5); }
      }
    }
    for (let j = J0; j < J0 + 40; j++) {
      const x = cellX(j, tW0); if (x > 6000) break; if (!isWin(j)) continue;
      const d = .04 * Math.abs(x - 960) / PITCH, g = sineIO(span(t, tW0 + Math.min(.3, d), tW0 + Math.min(.3, d) + .9)), textU = 1 - span(t, tW0 - .25, tW0 + .2);
      const w = lerp(CW, WIN.w, g), y0 = lerp(SLOT_Y - CH / 2, WIN.y0, g), y1 = lerp(SLOT_Y + CH / 2, WIN.y1, g);
      windowAt(ctx, t, (j - jr) / 2, x, w, y0, y1, g, textU, j);
    }
  }
  function windowAt(ctx, t, k, x, w, y0, y1, g, textU, j) {
    const lit = k >= 0 && k <= 3 ? ramp(t, tW0 + .25 + .1 * k, tW0 + 1.1 + .1 * k) : ramp(t, a.everyone - .15 + .14 * Math.abs(k - 3), a.everyone + .55 + .14 * Math.abs(k - 3));
    const r = new Path2D(); r.rect(x - w / 2, y0, w, y1 - y0);
    // glass / room: from the ticker cell's colour to the night glass, then to the lit room
    const glass = mixHex(mixHex(P.ind2, P.blue1, .3), mixHex(P.night0, P.ind1, .5), g);
    ctx.save(); ctx.clip(r);
    ctx.fillStyle = glass; ctx.fillRect(x - w / 2, y0, w, y1 - y0);
    if (lit > 0) {
      ctx.fillStyle = lin(ctx, 0, y0, 0, y1, [[0, mixHex(glass, mixHex(P.halo1, P.shade0, .45), lit)], [.55, mixHex(glass, mixHex(P.shade0, P.ind2, .35), lit)], [1, mixHex(glass, mixHex(P.shade1, P.night1, .55), lit)]]); ctx.fillRect(x - w / 2, y0, w, y1 - y0);
      const lx = k === 3 ? x - 70 : x + (k % 2 ? 60 : -60);
      halo(ctx, lx, y0 + 70, 260, .55 * lit, P.halo1, P.core0);
      if (k === 3) { ctx.strokeStyle = P.night0; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, y0 - 10); ctx.lineTo(lx, y0 + 52); ctx.stroke(); ctx.fillStyle = mixHex(P.night1, P.shade0, .4); ctx.beginPath(); ctx.moveTo(lx - 14, y0 + 52); ctx.lineTo(lx + 14, y0 + 52); ctx.lineTo(lx + 30, y0 + 72); ctx.lineTo(lx - 30, y0 + 72); ctx.closePath(); ctx.fill(); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.ellipse(lx, y0 + 73, 16, 4, 0, 0, 6.29); ctx.fill(); }
    }
    if (g > .5) people(ctx, t, k, x, lit);
    // a cool reflection on the glass (fades as the room lights)
    ctx.fillStyle = rgba(P.blue0, .12 * g * (1 - .7 * lit)); ctx.beginPath(); ctx.moveTo(x - w / 2 + 20, y1); ctx.lineTo(x - w / 2 + 90, y0); ctx.lineTo(x - w / 2 + 130, y0); ctx.lineTo(x - w / 2 + 60, y1); ctx.closePath(); ctx.fill();
    ctx.restore();
    if (g < .999) { ctx.save(); ctx.globalAlpha = 1; cellText(ctx, x, (y0 + y1) / 2, w, y1 - y0, j, textU, g); ctx.restore(); }
    // frame, mullion, sill
    ctx.strokeStyle = P.night0; ctx.lineWidth = lerp(1, 10, g); ctx.strokeRect(x - w / 2, y0, w, y1 - y0);
    if (g > .3) { ctx.lineWidth = 6 * g; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + (y1 - y0) * .34); ctx.moveTo(x - w / 2, y0 + (y1 - y0) * .34); ctx.lineTo(x + w / 2, y0 + (y1 - y0) * .34); ctx.stroke(); }
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.fillRect(x - w / 2 - 16 * g, y1, w + 32 * g, 12 * g);
    ctx.fillStyle = rgba(lit > 0 ? P.halo1 : P.blue0, .5 * g); ctx.fillRect(x - w / 2 - 16 * g, y1, w + 32 * g, 2);
    if (lit > 0) { ctx.save(); ctx.globalAlpha = .4 * lit; E.lightPool(ctx, x - w / 2 + 10, x + w / 2 - 10, STREET + 2, 90, 110, 1); ctx.restore(); }
  }
  function cellText(ctx, x, y, w, h, j, textU, g) {
    if (textU <= 0) return;
    const s = TICK[((j % TICK.length) + TICK.length) % TICK.length], up = s[0] === '+', col = up ? COL.cool : mixHex(COL.loss, COL.cool, .5), fs = CH * .42;
    ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, y - CH / 2, w, CH); ctx.clip();
    ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.font = `600 ${fs}px Inter`; ctx.textAlign = 'left';
    ctx.fillText(s, x - CW * .18, y + fs * .36 + (1 - expoOut(textU)) * CH * .8);
    ctx.restore();
  }
  // the people in the lit windows (indigo silhouettes against the warm rooms; you in yellow), each with a ticket
  function people(ctx, t, k, x, lit) {
    if (k === 3) {
      E.du(ctx, YOUW.x, YOUW.y, YOUW.h, { dir: -1, hood: false, light: -1, look: .1 + .05 * Math.sin(t * .5) + .2 * ramp(t, a.ride, a.ride + .8) * (1 - ramp(t, tCalm, tCalm + 1.5)), armR: yourArm(t), armL: [-.16, -.08] });
      return;
    }
    const kinds = { 0: 'student', 1: 'duo', 2: 'nurse' }, kind = kinds[k] || 'other';
    const tR = k === 0 ? a.who - .15 : k === 1 ? a.who + .2 : k === 2 ? a.who + .55 : a.everyone + .1 + .14 * Math.abs(k - 3);
    const up = sramp(t, tR, tR + .8), br = .5 + .5 * Math.sin(t * 1.2 + k);
    const dir = k % 2 ? 1 : -1, px = x - dir * 60, arm = [lerp(.18, .7, up) + .01 * br, lerp(.1, 1.85, up)];
    if (kind === 'student') { ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.beginPath(); ctx.roundRect(px + dir * PH * .07, PFEET - PH * .79, PH * .16, PH * .28, 8); ctx.fill(); }
    if (kind === 'duo') { E.person(ctx, x + 75, PFEET + 10, PH - 30, { dir: -1, light: 1, look: .2 * up, rim: mixHex(P.halo1, P.blue0, .4) }); ctx.fillStyle = mixHex(COL.coolDeep, COL.cool, .55); ctx.fillRect(x + 10, 700, 54, 34); halo(ctx, x + 37, 712, 80, .3 * lit, COL.cool2, COL.cool); }
    const hands = kind === 'nurse' ? B.worker(ctx, px, PFEET, PH, t, { dir, armR: arm, seed: 4, look: .15 * up }) : E.person(ctx, px, PFEET, PH - (kind === 'duo' ? 20 : 0), { dir, light: -dir, look: .1 + .25 * up, armR: arm, rim: mixHex(P.halo1, P.blue0, .4), long: kind === 'other' && k % 2 === 0 });
    if (hands && hands.R) ticketNew(ctx, hands.R[0] + dir * 14, hands.R[1] - 20, TW, -.2 * dir, { glow: (.3 + .4 * up) * lit, rows: TROWS, lum: .72 });
  }

  // ================================================================================================ A4 + the flip + the end screen
  function a4(ctx, t) {
    if (t < tF2) {
      // the flip: the paper plate behind (the frame stays paper while the ticket turns), the ticket's back is the sign
      B.paperPlate(ctx, t, { lum: .5, cx: CXS, cy: CYS }); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.night0, DIM(t)); ctx.fillRect(0, 0, W, H); ctx.restore();
      const u = sineIO(span(t, tF1, tF2)), cs = Math.cos(Math.PI * u), sx = Math.max(.02, Math.abs(cs)), w = wFlip(t);
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(CXS, CYS); ctx.scale(sx, 1);
      if (cs >= 0) ticketNew(ctx, 0, 0, w, 0, { glow: tGlow(t), rows: TROWS, lum: TLUM(t), dim: DIM(t) });
      else boardFace(ctx, t, w);
      ctx.restore();
      return;
    }
    const c = camA(t);
    worldA4(ctx, t, c);
    boardScreen(ctx, t, c);
    sparks(ctx, t, c);
  }
  function worldA4(ctx, t, c) {
    const dusk = 1 + .35 * sramp(t, a.yet - 1, a.T1), starA = .12 + .6 * ramp(t, a.hasnt, a.yet + 9);
    card(ctx, c, 40000, () => {
      ctx.fillStyle = lin(ctx, 0, -800, 0, HOR + 30, [[0, P.night0], [.45, P.night1], [.78, mixHex(P.ind1, P.night1, .15)], [1, mixHex(P.ind1, P.shade1, .32 * dusk)]]); ctx.fillRect(-2 * W, -3 * H, 5 * W, 6 * H);
      ctx.fillStyle = rad(ctx, 330, HOR + 30, 1500, [[0, rgba(P.shade0, .55 * dusk)], [.25, rgba(P.shade1, .3 * dusk)], [.6, rgba(P.ind1, .12)], [1, rgba(P.ind1, 0)]]); ctx.fillRect(-2 * W, -3 * H, 5 * W, 6 * H);
      E.stars(ctx, 1241, 170, t, [-500, -1200, W + 1000, HOR - 60], starA);
    });
    card(ctx, c, 9000, () => {
      E.ground(ctx, [[-1600, HOR - 4], [100, HOR - 20], [640, HOR - 8], [1250, HOR - 24], [3500, HOR - 2]], { stops: [[0, mixHex(P.ind1, P.night1, .35)], [1, P.night1]], rim: rgba(P.blue0, .4), rimW: 2, bottom: HOR + 500 });
      B.mist(ctx, HOR - 8, 38, .5 * dusk); B.mist(ctx, HOR - 14, 120, .26 * dusk);
      B.rail(ctx, -1600, 3500, FRY, t, { w: 2.2, sleepers: 0, ballast: 0, rim: .5 });
      // the far train: small, lit, gliding right along the horizon
      const x = -260 + 38 * (t - (a.yet - 4));
      if (x > -400 && x < 2400) { halo(ctx, x - 100, FRY - 12, 170, .3, P.halo1, P.core0); B.train(ctx, x, FRY, 210, 21, t, { dir: 1, lit: 1 }); }
    });
    card(ctx, c, F0, () => {
      // the near ground (an embankment), the new rail running left into the dusk, sleepers laid beyond its end
      ctx.fillStyle = lin(ctx, 0, NEAR, 0, NEAR + 600, [[0, mixHex(P.ind1, P.night1, .55)], [.3, P.night1], [1, P.night0]]); ctx.fillRect(-6000, NEAR, 14000, 3000);
      ctx.fillStyle = rgba(P.blue0, .35); ctx.fillRect(-6000, NEAR - 1, 14000, 2);
      { const bp = new Path2D(); bp.moveTo(-6000, RY + 100); bp.lineTo(-6000, RY + 22); bp.lineTo(RX_END + 30, RY + 22); bp.quadraticCurveTo(RX_END + 120, RY + 30, RX_END + 190, RY + 100); bp.closePath();   // the ballast tapers out past the rail's end
        ctx.fillStyle = lin(ctx, 0, RY, 0, RY + 100, [[0, mixHex(P.ind2, P.blue1, .2)], [1, mixHex(P.ind1, P.night1, .62)]]); ctx.fill(bp); }
      B.rail(ctx, -6000, RX_END, RY, t, { ballast: 0, w: 7, rimStops: [[0, rgba(P.halo0, .7)], [.92, rgba(P.halo0, .95)], [1, rgba(P.halo1, .7)]] });
      for (let xx = RX_END + 23; xx < RX_END + 110; xx += 46) { ctx.fillStyle = P.night1; ctx.fillRect(xx - 13, RY + 6.3, 26, 13); ctx.fillStyle = rgba(P.blue1, .5); ctx.fillRect(xx - 13, RY + 6.3, 26, 1.5); }
      // the sign's posts
      ctx.fillStyle = mixHex(P.night1, P.ind2, .4); for (const dx of [-54, 54]) ctx.fillRect(BOARD.x + dx - 3.5, BOARD.y + BOARD.h / 2 - 4, 7, FEET + 4 - (BOARD.y + BOARD.h / 2));
      workers(ctx, t);
      // you, beside the sign, looking up at its empty field
      E.castShadow(ctx, YOU4.x, FEET + 1, 22, 70, Math.PI * .06, .4);
      E.du(ctx, YOU4.x, FEET, YOU4.h, { dir: -1, light: 1, look: .12 + .28 * ramp(t, a.price, a.seat + .5) + .03 * Math.sin(t * .6), armR: [.14 + .02 * Math.sin(t * 1.4), .08], armL: [-.14, -.07] });
    });
  }
  function workers(ctx, t) {
    // A: bent over the joint with a grinder (lowers it onto the rail just before "right now"); B: stands with a long bar, watching
    const down = sramp(t, a.rightnow - .55, a.rightnow - .05), lean = lerp(.3, .55, down) + .02 * Math.sin(t * 1.1);
    const hA = E.person(ctx, 798, FEET, 98, { dir: 1, lean, look: -.25, light: -1, armR: down > 0 ? ARMS_A(t).map((v, i) => lerp(i ? .9 : .7, v, down)) : [.7, .9], armL: [.6, .7], rim: mixHex(P.halo1, P.blue0, .3) });
    const hx = hA.R[0], hy = hA.R[1], jx = lerp(hx + 14, JOINT[0], down), jy = lerp(hy + 6, JOINT[1] - 2, down);
    ctx.strokeStyle = P.night0; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(jx, jy - 4); ctx.stroke();
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.arc(jx, jy - 4, 7, 0, 6.29); ctx.fill();
    const b = .5 + .5 * Math.sin(t * 1.3 + 1);
    const hB = E.person(ctx, 712, FEET, 102, { dir: 1, lean: .03 + .01 * b, look: -.1 + .05 * Math.sin(t * .5), light: -1, armR: [.55 + .02 * b, 1.1], armL: [.35, .9], rim: mixHex(P.halo1, P.blue0, .3) });
    ctx.strokeStyle = mixHex(P.night1, P.blue1, .3); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(752, FEET); ctx.lineTo(lerp(752, hB.R[0], 1.35), lerp(FEET, hB.R[1], 1.35)); ctx.stroke();
    const s = spark(t); if (s > 0) halo(ctx, JOINT[0], JOINT[1], 90, .5 * s, P.halo1, P.core0);
  }
  function sparks(ctx, t, c) {
    if (t < tS0) return;
    card(ctx, c, F0, () => {
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (const s of SPK) {
        const dt = t - s.tb; if (dt < 0) break; if (dt > s.life) continue;
        const pos = (d) => [JOINT[0] + Math.cos(s.ang) * s.v * d, JOINT[1] + Math.sin(s.ang) * s.v * d + 450 * d * d];
        const [x0, y0] = pos(Math.max(0, dt - .03)), [x1, y1] = pos(dt), age = dt / s.life;
        ctx.strokeStyle = rgba(mixHex(P.core0, P.shade0, age), 1 - age * age); ctx.lineWidth = 1.7; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
      ctx.restore();
    });
  }
  // the sign PRICE: [ ] (local, centred, width w) and in screen space from its projected pose
  function boardFace(ctx, t, w) {
    const h = w * .45, fg = ramp(t, a.seat - .3, a.seat + .5) * (.86 + .14 * Math.sin(t * 1.6));
    const body = new Path2D(); body.roundRect(-w / 2, -h / 2, w, h, w * .02);
    if (fg > 0) E.glowFill(ctx, body, w * .12, .25 * fg, P.halo1);
    B.paperFill(ctx, body, { lum: BLUM(t), seed: 352, lx: -w * .2, ly: -h * .3 });
    if (DIM(t) > 0) { ctx.fillStyle = rgba(P.night0, DIM(t)); ctx.fill(body); }
    ctx.strokeStyle = rgba(COL.ink2, .55); ctx.lineWidth = Math.max(1, w * .006); ctx.strokeRect(-w / 2 + w * .025, -h / 2 + w * .025, w - w * .05, h - w * .05);
    ctx.fillStyle = rgba(COL.ink, .88); ctx.font = `600 ${Math.max(1, h * .3)}px Inter`; ctx.textAlign = 'left'; ctx.fillText('PRICE:', -w * .42, h * .11);
    const fx0 = w * .02, fx1 = w * .42, fy = h * .26;
    if (fg > 0) {
      ctx.fillStyle = lin(ctx, 0, -fy, 0, fy, [[0, rgba(P.core0, .95 * fg)], [1, rgba(P.halo0, .9 * fg)]]); ctx.fillRect(fx0, -fy, fx1 - fx0, 2 * fy);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(P.halo1, .25 * fg); ctx.fillRect(fx0 - w * .02, -fy - w * .02, fx1 - fx0 + w * .04, 2 * fy + w * .04); ctx.restore();
    }
    ctx.strokeStyle = rgba(COL.ink, .8); ctx.lineWidth = Math.max(1, w * .008); ctx.strokeRect(fx0, -fy, fx1 - fx0, 2 * fy);
    return fg;
  }
  function boardScreen(ctx, t, c) {
    const p = project(c, F0, BOARD.x, BOARD.y), w = BOARD.w * p[2];
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(p[0], p[1]);
    const fg = boardFace(ctx, t, w);
    ctx.restore();
    if (fg > 0) halo(ctx, p[0] + w * .22, p[1], w * .9, .28 * fg, P.halo1, P.core0);
  }
}
