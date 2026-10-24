// Film 10 · B2 · one continuous stage from 213.9 s (c04, "Heavy, dangerous work") to the robot walking home (c05, ~257.3 s).
// Shared by scenes/sc04.mjs and scenes/sc05.mjs so the chunk boundary at 246.78 s is the same picture on both sides.
// One design space (F0 card), the camera travels through it:
//   W  heavy work:  a person of light under a beam of light → the beam moves to a robot of light (human hands → robot hands)
//      then light halves: robot + things (cool) | people + people (warm)
//   K  the clock of light grows out of the two people (time?); free time wedge; new work fills it; you take a piece back
//   B  the piece unrolls into the bill (BILL 1 · US · YOUR WORK · YOUR DATA); the strip becomes the hall window
//   H  the hall (K3): a trainer lifts the cup, the robot copies; skill ↑ / needed ↓ curves; little money
//   c05: the trainer becomes you (yellow); IT KEEPS / YOU DON'T tally; copied; the robot walks into the light (flood → home)
import { Path2D, createCanvas } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { wipe, writeOn, mark, figMark, botMark, clock, wedge, env, floodK, floodIn, floodOut, iris } from './f10_c04_b2.mjs';
const { W, H, P, F0, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rgba, mixHex, lin, rad } = E;

// ---------- layout (design space) ----------
const FY = 900;                                  // floor of the work / clock part
const HUM = { x: 640, s: 300 }, PER2 = { x: 400 }, BOT = { x: 1330, s: 320 };
const BEAM = { w: 520, h: 34 };
const CK = { x: 560, y: 300, r: 170 };
const DU = { h: 260, x: 520 };
const WIN = { x: 300, y: -1300, w: 520, h: 790 };  // the hall window (the bill strip becomes it)
const HF = WIN.y + WIN.h;                        // hall floor
const TRN = { x: -170, y: HF + 84, h: 290 };       // the trainer (then you)
const RB = { x: 575, y: HF + 44, h: 372 };         // the robot in the window light
const WC = [WIN.x + WIN.w / 2, WIN.y + WIN.h * .45];
const HALLCAM = E.aim(F0, WC[0], WC[1], 1, 1420, 465);
export const HALL = { WIN, HF, TRN, RB, WC, HALLCAM };

// ---------- anchors (filled by init from the timing) ----------
let A = null;
export function initHall(T) {
  if (A) return A;
  const s = (sec, ph, n) => T.S(sec, ph, n);
  A = {
    in: null,                                                     // set by sc04 (the flood cut from the kitchen lamp)
    human: s('02a', 'from human hands'), robotH: s('02a', 'to robot hands') + .16, things: s('02a', 'Robots for things'), thingsW: s('02a', 'things.'),
    people: s('02a', 'People for people'), people2: s('02a', 'for people') + .16, will: s('02a', 'But will'), time1: s('02a', 'that time'), mach: s('02a', 'Machines have'),
    before: s('02a', 'time before') + .16, mostly: s('02a', 'Mostly'), work: s('02a', 'new work') + .16, wont: s('02a', "Robots won't give"), give: s('02a', 'give us time'),
    take: s('02a', 'take it'), billS: s('02b', "And there's a bill"), bill: s('02b', 'a bill') + .2, us: s('02b', 'to us') + .12, go: s('02b', 'Go back'), china: s('02b', 'in China'),
    every: s('02b', 'Every time the trainer'), lifts: s('02b', 'lifts that cup'), better: s('02b', 'little better') + .24, trainer2: s('02b', 'And the trainer'), needed: s('02b', 'less needed') + .2,
    often: s('02b', 'Often for'), money: s('02b', 'little money') + .2,
    now: s('02b', 'Now imagine'), job: s('02b', 'your job'), move: s('02b', 'Every move'), keeps: s('02b', 'it keeps'), dont: s('02b', "You don't"),
    not: s('02b', 'Not because'), copy: s('02b', 'enough to copy') + .24, then: s('02b', 'Then the robot comes'), home: s('02b', 'comes home') + .32,
  };
  A.in = A.human - 1.1;   // 213.9: out of the kitchen lamp
  A.flood = A.home + .05;  // into the window light: the robot goes home (c05 stage "door")
  const cv = createCanvas(4, 4);
  DU_HAND = E.du(cv.getContext('2d'), DU.x, FY, DU.h, { pose: 'look', dir: 1, light: 1, armR: [2.6, 2.75], look: 1 }).R;
  return A;
}

// ---------- the camera ----------
const keys = () => [
  [A.in, E.aim(F0, 820, 410, 60)],
  [A.in + 1.6, E.aim(F0, 860, 620, 1.0), 'o'],
  [A.will + .1, E.aim(F0, 850, 610, 1.05)],
  [A.time1 + .7, E.aim(F0, 590, 360, 1.55), 'q'],
  [A.mostly + 1.9, E.aim(F0, 580, 350, 1.6)],
  [A.wont + .9, E.aim(F0, 600, 560, 1.0)],
  [A.billS - .05, E.aim(F0, 600, 545, 1.03)],
];
let DU_HAND = [584, 632];
function stripTop(t) { return lerp(DU_HAND[1] - 70, WIN.y, quartIO(span(t, A.billS + .05, A.billS + 1.45))); }
function camAt(t) {
  if (t < A.billS) return E.camDrift(E.camAt(t, keys()), t, .7);
  const c0 = E.camAt(A.billS - .05, keys());
  // follow the top edge of the strip while it unrolls, then glide to the hall
  const fol = E.aim(F0, 600, stripTop(t) + 330, 1.0), k = smooth(span(t, A.billS, A.billS + .6));
  let c = { ...c0 }; for (const q of ['x', 'y', 'z']) c[q] = lerp(c0[q], fol[q], k);
  const hk = sineIO(span(t, A.china - .4, A.every + .5));
  for (const q of ['x', 'y', 'z']) c[q] = lerp(c[q], HALLCAM[q], hk);
  // breathing hold in the hall, a slow push while the curves stand, the push into the window light at the end
  if (t > A.every) { c.z += 60 * sineIO(span(t, A.every, A.now)); }
  // c05: frame you, the tally and the robot (the tally is the explainer now)
  if (t > A.now - .4) { const nc = E.aim(F0, 150, -935, .93), k = sineIO(span(t, A.now - .4, A.move + .2)); for (const q of ['x', 'y', 'z']) c[q] = lerp(c[q], nc[q], k); }
  if (t > A.then - .1) {
    const fin = E.aim(F0, RB.x + 10, RB.y - RB.h * .62, 60), u = span(t, A.then - .1, A.flood);
    const ci = E.camAt(t, [[A.then - .1, { ...c }], [A.flood, fin, 'i']]); c = ci;
    void u;
  }
  return E.camDrift(c, t, .6);
}
export function hallCam(t) { initCheck(); return camAt(t); }
const initCheck = () => { if (!A) throw new Error('initHall(T) first'); };

// ---------- drawing ----------
function backdrop(ctx, c, t) {
  E.card(ctx, c, 40000, () => {
    E.nightSky(ctx, [[0, P.night0], [.6, P.night1], [1, P.ind0]], -1200, H + 600);
    E.stars(ctx, 13, 150, t, [-600, -900, W + 1200, H + 900], .55);
  });
  // a soft blue lift behind the current graphic (the scenes' saturated blue aura), sits far back
  E.card(ctx, c, 6000, () => {
    ctx.fillStyle = rad(ctx, 900, 400, 1500, [[0, rgba(P.blue0, .35)], [.6, rgba(P.blue0, .1)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-3000, -4000, 8000, 9000);
  });
}

function workPart(ctx, t) {
  // the floor: a line of light
  const fl = expoOut(span(t, A.in + .3, A.in + 1.3)) * (1 - smooth(span(t, A.will - .3, A.will + .5)));
  if (fl > 0) E.trail(ctx, [[60, FY, 2], [1700, FY, 2]], fl, { spark: false, a: .7 });
  // light halves for "robots for things / people for people": a warm wash left, a cool wash right, a divider of light
  const hv = env(t, A.things - .1, A.things + .7, A.will + .2, A.will + 1);
  if (hv > 0) {
    ctx.save(); ctx.globalAlpha = hv;
    ctx.fillStyle = rad(ctx, 560, 640, 520, [[0, rgba(P.halo1, .2)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(0, 100, 1000, 900);
    ctx.fillStyle = rad(ctx, 1330, 640, 520, [[0, rgba(P.blue0, .4)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(1000, 100, 900, 900);
    ctx.restore();
    E.trail(ctx, [[1000, FY - 4, 2.4], [1000, 360, 2.4]], hv, { spark: hv < 1, a: .8 });
  }
  // the people shrink into light that rises into the clock
  const shrink = 1 - smooth(span(t, A.time1 - 1.05, A.time1 - .45));
  if (shrink <= 0) return;
  const tr = span(t, A.robotH - .3, A.robotH + .7), slide = quartIO(tr);
  const bend = lerp(.9, 0, smooth(span(t, A.robotH + .1, A.robotH + .9)));
  const cy = (s0) => FY - (1 - shrink) * s0 * .55;
  const hm = figMark(ctx, HUM.x, cy(HUM.s), HUM.s * shrink, t, { lit: 1, bend, arms: lerp(1, .05, smooth(span(t, A.robotH + .2, A.robotH + 1))), seed: 3 });
  void hm;
  if (t > A.people - .2) figMark(ctx, PER2.x, cy(HUM.s * .95), HUM.s * .95 * shrink, t, { lit: 1, dir: -1, u: span(t, A.people - .1, A.people + .5), arms: 0, seed: 4 });
  const ra = smooth(span(t, A.robotH - .5, A.robotH + .1)) * (1 - smooth(span(t, A.things + .2, A.things + .9)));
  const bot = botMark(ctx, BOT.x, FY, BOT.s, t, { lit: 0, arms: ra, glow: 1.3, u: span(t, A.in + .9, A.in + 1.6) });
  // the beam: over your head, then slides onto the robot's hands; at "things" it breaks into three boxes
  const humY = FY - HUM.s * (1.24 - .14 * bend), botY = bot.R[1] - 18;
  const bx = lerp(HUM.x, BOT.x, slide), by = lerp(humY, lerp(botY, FY - BOT.s * .38, 0), slide) - Math.sin(Math.PI * slide) * 60;
  const brk = smooth(span(t, A.things + .1, A.things + .8));
  const bw = BEAM.w * (1 - brk * .9), bh = BEAM.h * (1 + .1 * Math.sin(t * 7) * (1 - slide));
  if (bw > 30) { const p = new Path2D(); p.roundRect(bx - bw / 2, by - bh, bw, bh, 8); E.lightShape(ctx, p, t, { lit: lerp(1, .15, slide), seed: 9, dust: slide < .5 ? 800 : 0 }); }
  if (brk > 0) for (let i = 0; i < 3; i++) {
    const k = span(t, A.things + .2 + i * .12, A.things + .9 + i * .12);
    mark(ctx, 'box', BOT.x + 190 + (i === 2 ? 45 : i * 90), FY - 52 - (i === 2 ? 90 : 0), 110, t, { lit: 0, u: k, glow: 1.3 });
  }
  // labels: human hands / robot hands, then for people / for things (one label per side, mask out → mask in)
  const lab = (s, x, u, warm) => wipe(ctx, s, x, FY + 74, u, { size: 40, align: 'center', glow: false, col: warm ? P.halo2 : mixHex(P.cream, P.blue2, .25), spacing: .14, weight: 600 });
  const out1 = 1 - smooth(span(t, A.things, A.things + .4)), out2 = 1 - smooth(span(t, A.people, A.people + .4));
  const out3 = 1 - smooth(span(t, A.will - .1, A.will + .4));
  lab('HUMAN HANDS', HUM.x, span(t, A.human, A.human + .6) * out2, true);
  lab('ROBOT HANDS', BOT.x, span(t, A.robotH, A.robotH + .6) * out1, false);
  lab('FOR THINGS', BOT.x + 60, span(t, A.thingsW, A.thingsW + .6) * (1 - smooth(span(t, A.will + .1, A.will + .6))), false);
  lab('FOR PEOPLE', (HUM.x + PER2.x) / 2, span(t, A.people2, A.people2 + .6) * out3, true);
}

// the clock: grows from the light of the two people; free time; new work fills it; one piece is taken back
const CELLS = (() => { const out = []; for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) out.push({ a0: j * Math.PI * 2 / 3 / 4, a1: (j + 1) * Math.PI * 2 / 3 / 4, r0: i ? .5 : .2, r1: i ? .8 : .5, k: j * 2 + i }); return out; })();
const TAKE = 7;   // the outer cell nearest 4 o'clock is the piece you take back
function clockPart(ctx, t) {
  const g = expoOut(span(t, A.time1 - .8, A.time1 + .2)) * (1 - E.quartIO(span(t, A.billS - .15, A.billS + .65))); if (g <= .002) return;
  const r = CK.r * g;
  // the light that rises from the two people into the centre
  if (t < A.time1 + .1) for (const [px, i] of [[HUM.x, 0], [PER2.x, 1]]) {
    const u = smooth(span(t, A.time1 - 1 + i * .08, A.time1 - .2 + i * .08)); if (u <= 0 || u >= 1) continue;
    const x = lerp(px, CK.x, u), y = lerp(FY - HUM.s * .55, CK.y, u) - Math.sin(Math.PI * u) * 60; E.halo(ctx, x, y, 60, .9);
  }
  E.halo(ctx, CK.x, CK.y, r * 2.4, .16 * g, P.blue0, P.blue0);
  clock(ctx, CK.x, CK.y, r, t, { min: 1.2 + t * .22, hour: .4 + t * .018, a: 1 });
  const fw = expoOut(span(t, A.mach + .3, A.mach + 1.2));
  if (fw > 0) {
    // free time: a warm wedge from 12 to 4 o'clock; then new work fills it cell by cell (cool blocks fly in from the right)
    for (const c of CELLS) {
      const a1 = Math.min(c.a1, fw * Math.PI * 2 / 3); if (a1 <= c.a0) continue;
      const land = A.mostly + .3 + c.k * .13, k = span(t, land, land + .45), taken = c.k === TAKE ? smooth(span(t, A.take + .05, A.take + .3)) : 0;
      if (taken >= 1) continue;
      const p = wedge(CK.x, CK.y, r * c.r0 + 3, r * c.r1 - 3, c.a0 + .025, a1 - .025);
      E.lightShape(ctx, p, t, { lit: k >= 1 ? 0 : 1, dust: 0, glow: .7, a: 1 - taken });
      if (k > 0 && k < 1) {   // the block on its way in (from the robot side, right)
        const am = (c.a0 + c.a1) / 2 - Math.PI / 2, rm = r * (c.r0 + c.r1) / 2, tx = CK.x + Math.cos(am) * rm, ty = CK.y + Math.sin(am) * rm, e = quartIO(k);
        const x = lerp(CK.x + 820, tx, e), y = lerp(CK.y + 200, ty, e) - Math.sin(Math.PI * e) * 120;
        const b = new Path2D(); b.roundRect(x - 22, y - 16, 44, 32, 6); E.lightShape(ctx, b, t, { lit: 0, dust: 0, glow: 1.2 });
      }
    }
    const ft = span(t, A.mach + .7, A.mach + 1.3) * (1 - smooth(span(t, A.work - .4, A.work)));
    const lx = CK.x + r * 1.18, ly = CK.y - r * .38;
    wipe(ctx, 'FREE TIME', lx, ly, ft, { size: 40, glow: false, col: P.halo2, spacing: .14 });
    wipe(ctx, 'NEW WORK', lx, ly, span(t, A.work, A.work + .5) * (1 - smooth(span(t, A.billS + .3, A.billS + .9))), { size: 40, glow: false, col: mixHex(P.cream, P.blue2, .25), spacing: .14 });
    // the old promise, small, left of the clock (from an old poster: no frame)
    const pr = span(t, A.before - .1, A.before + .5) * (1 - smooth(span(t, A.take + .5, A.take + 1.0)));
    wipe(ctx, '“MORE TIME FOR YOU!”', CK.x - 40, CK.y + CK.r * 1.55, pr, { size: 52, serif: true, align: 'right', desc: .3 });
  }
}

// you walk in under the clock, look up, take one piece back; it becomes a slip, the slip unrolls into the bill
function duPart(ctx, t) {
  const w0 = A.mostly + 1.2, w1 = A.give + .35;
  if (t < w0) return null;
  const k = span(t, w0, w1), x = lerp(-260, DU.x, sineIO(k)), walking = k < 1;
  const reach = smooth(span(t, A.take - .25, A.take + .25));
  const o = walking ? { pose: 'walk', walk: x / DU.h * 4.2, dir: 1, light: 1 } : { pose: 'look', dir: 1, light: 1, armR: reach > 0 ? [lerp(.2, 2.6, reach), lerp(.1, 2.75, reach)] : undefined, look: lerp(.7, 1, reach) };
  E.castShadow(ctx, x, FY, 26, 160, 2.4, .45);
  const hd = E.du(ctx, x, FY, DU.h, o);
  return hd.R;
}
function slipPart(ctx, t, hand) {
  if (!hand || t < A.take) return;
  // the taken piece drops from the clock into your hand and turns warm
  const am = (CELLS[TAKE].a0 + CELLS[TAKE].a1) / 2 - Math.PI / 2, rm = CK.r * .65, sx = CK.x + Math.cos(am) * rm, sy = CK.y + Math.sin(am) * rm;
  const k = quartIO(span(t, A.take + .05, A.take + .75)), x = lerp(sx, hand[0], k), y = lerp(sy, hand[1] - 34, k) - Math.sin(Math.PI * k) * 40;
  if (t < A.billS) {
    const p = new Path2D(); p.roundRect(x - lerp(22, 26, k), y - lerp(16, 34, k), lerp(44, 52, k), lerp(32, 68, k), 5);
    E.lightShape(ctx, p, t, { lit: smooth(span(k, .3, 1)), dust: 0, glow: 1.2 });
  }
}
// the bill: a long strip of cream light printed in dark ink; then it becomes the hall window
function billPart(ctx, t, hand) {
  if (t < A.billS - .02) return;
  const m = smooth(span(t, A.china - .3, A.every + .35));                    // strip → window (the print holds until 'China')
  const hx = DU_HAND[0];
  const sw = lerp(lerp(110, 360, quartIO(span(t, A.billS, A.billS + .9))), WIN.w, m), cx = lerp(hx, WIN.x + WIN.w / 2, m), top = stripTop(t), bot = lerp(DU_HAND[1] - 6, HF, smooth(span(t, A.china - .4, A.every + .2)));
  const x0 = cx - sw / 2, hh = bot - top; if (hh < 4) return;
  // light around the strip (it is the hero now), then the paper/window body
  const p = new Path2D(); p.rect(x0, top, sw, hh);
  E.glowFill(ctx, p, 140, .55 + .35 * m, P.blue0); E.glowFill(ctx, p, 26, .45, P.halo1);
  const g = ctx.createLinearGradient(0, top, 0, bot);
  const wc = WIN.y + WIN.h * .62;
  ctx.fillStyle = m > 0 ? rad(ctx, cx, lerp(top + 260, wc, m), lerp(1100, WIN.h * .62 * 1.25, m), [[0, P.core0], [.18, P.core0], [.35, P.core1], [.62, mixHex(P.core1, P.halo0, m)], [1, mixHex(P.core1, P.halo1, m)]]) : (g.addColorStop(0, P.core0), g.addColorStop(1, P.core1), g);
  ctx.fill(p);
  // the print: header + two lines, written as the voice names them, slides out through the top when the strip becomes the window
  const sl = quartIO(span(t, A.china - .45, A.china + .3)) * 460, ink = mixHex(P.night1, P.shade0, .25);
  ctx.save(); ctx.beginPath(); ctx.rect(x0, top, sw, Math.max(0, hh)); ctx.clip();
  const ty = top + 120 - sl, tx = cx;
  const pr = (s, y, u, o) => writeOn(ctx, s, tx, y, u, { align: 'center', glow: false, col: ink, spark: false, ...o });
  pr('BILL 1', ty, span(t, A.bill - .05, A.bill + .35), { serif: true, size: 104 });
  // what is billed (your work, your data), then who pays: TO: US
  ctx.fillStyle = rgba(ink, .5); if (t > A.bill + .3) for (const yy of [ty + 44, ty + 172]) ctx.fillRect(x0 + 30, yy, (sw - 60) * smooth(span(t, A.bill + .3, A.bill + .7)), 2);
  pr('YOUR WORK', ty + 104, span(t, A.bill + .5, A.bill + .85), { size: 40, spacing: .06 });
  pr('YOUR DATA', ty + 152, span(t, A.bill + .9, A.bill + 1.25), { size: 40, spacing: .06 });
  pr('TO: US', ty + 236, span(t, A.us - .05, A.us + .3), { size: 44, spacing: .18, weight: 700 });
  // the window's mullions grow in as the strip becomes the window
  if (m > 0) {
    ctx.strokeStyle = rgba(P.shade0, .28 * m); ctx.lineWidth = 6;
    for (const f of [1 / 3, 2 / 3]) { ctx.beginPath(); ctx.moveTo(x0 + sw * f, top); ctx.lineTo(x0 + sw * f, top + hh * m); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x0, top + WIN.h * .28); ctx.lineTo(x0 + sw * m, top + WIN.h * .28); ctx.stroke();
  }
  ctx.restore();
  if (m > .02) E.dust(ctx, 77, 5000, cx, top + hh * .55, sw * .62, hh * .5, t, .8 * m, P.halo1);
}

// ---------- the hall (K3): floor, light on the floor, the trainer / you, the robot, the copied move, curves, tally ----------
function hallPart(ctx, t) {
  const m = smooth(span(t, A.china - .2, A.every + .5)); if (m <= 0) return;
  const fy = HF;
  // floor: dark band under the window, the light falling out toward the viewer
  ctx.save();
  ctx.fillStyle = lin(ctx, 0, fy, 0, fy + 700, [[0, P.ind1], [.15, P.ind0], [1, P.night0]]); ctx.fillRect(-1600, fy, 4000, 1200 * m);
  ctx.beginPath(); ctx.moveTo(WIN.x, fy); ctx.lineTo(WIN.x + WIN.w, fy); ctx.lineTo(WIN.x + WIN.w + 360, fy + 260); ctx.lineTo(WIN.x - 520, fy + 260); ctx.closePath();
  ctx.filter = 'blur(6px)'; ctx.fillStyle = lin(ctx, 0, fy, 0, fy + 260, [[0, rgba(P.halo2, .7 * m)], [.45, rgba(P.halo1, .34 * m)], [1, rgba(P.shade0, .1 * m)]]); ctx.fill(); ctx.restore();
  // long shadows thrown toward the viewer
  E.castShadow(ctx, RB.x, RB.y, 50, 300, 1.25, .7 * m); E.castShadow(ctx, TRN.x, TRN.y, 40, 330, 2.2, .45 * m);
}
// the moves: lift k 0..1 (arms), robot copy with a tremor that shrinks
function lifts(t) {
  const L = [[A.lifts - .1, 0], [A.lifts + 1.25, 1]];   // [start, rep]
  let tr = 0, rb = 0, rep = 0, echo = 0, arc = 0;
  for (const [s0, i] of L) {
    if (t < s0) break;
    tr = env(t, s0, s0 + .75, s0 + 1.05, s0 + 1.5); rb = env(t, s0 + .45, s0 + 1.2, s0 + 1.3, s0 + 1.75); rep = i; arc = span(t, s0 + .25, s0 + 1.05); echo = i;
  }
  return { tr, rb, rep, echo, arc };
}
function figuresPart(ctx, t) {
  const m = smooth(span(t, A.china - .1, A.every + .4)); if (m <= 0) return;
  const L = lifts(t);
  // c05: your moves (two), then the robot copies exactly
  const youLift = t > A.move - .2 ? Math.max(env(t, A.move + .05, A.move + .75, A.move + 1.05, A.move + 1.5), env(t, A.keeps + .3, A.keeps + .95, A.keeps + 1.2, A.keeps + 1.6)) : 0;
  const copy = t > A.copy - .1 ? env(t, A.copy, A.copy + .7, A.then - .3, A.then + .2) : 0;
  const lf = Math.max(L.tr, youLift);
  const tremor = t < A.now ? (1 - L.rep * .6) * .09 * Math.sin(t * 31) * L.rb : 0;
  const rl = t < A.now ? L.rb : Math.max(youLift > 0 ? env(t, A.move + .45, A.move + 1.1, A.move + 1.25, A.move + 1.7) : 0, t > A.keeps ? env(t, A.keeps + .7, A.keeps + 1.3, A.keeps + 1.45, A.keeps + 1.9) : 0, copy);
  const walkAway = span(t, A.then + .15, A.flood + .3);
  // the robot in the light, copying (then it walks into the light: smaller, toward the window)
  const rs = 1 - .25 * smooth(walkAway), rx = RB.x + 40 * walkAway, ry = RB.y - 70 * smooth(walkAway);
  const rob = E.robot(ctx, rx, ry, RB.h * rs, { dir: walkAway > 0 ? 1 : -1, light: walkAway > 0 ? 1 : -1, rim: P.halo0, body: P.night1, cup: 'R', walk: walkAway > 0 ? t * 5 : undefined,
    armR: walkAway > 0 ? undefined : [lerp(.2, 1.35, rl) + tremor, lerp(.1, 2.55, rl) + tremor * 1.6], armL: [-.08, -.03] }).R;
  // the trainer (indigo, headset) — from "imagine it's your job" you: yellow rises through her from the hem up
  const yu = smooth(span(t, A.now + .15, A.job + .1));
  const look = t > A.copy + .4 ? 0 : .1, handsIn = smooth(span(t, A.copy + .3, A.copy + .9)) * (1 - smooth(span(t, A.then + .4, A.flood)));
  const tpose = { dir: 1, light: 1, back: .2, headset: true, cup: handsIn > .5 ? undefined : 'R', look,
    armR: handsIn > 0 ? [lerp(.18, .95, handsIn), lerp(.1, 2.0, handsIn)] : [lerp(.18, 1.35, lf), lerp(.1, 2.55, lf)], armL: handsIn > 0 ? [lerp(-.1, .8, handsIn), lerp(-.04, 1.9, handsIn)] : [-.1, -.04] };
  let hand = null;
  if (yu < 1) hand = E.person(ctx, TRN.x, TRN.y, TRN.h, { ...tpose, long: true, rim: mixHex(P.blue0, P.halo1, .3) }).R;
  if (yu > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(TRN.x - 300, TRN.y + 20 - (TRN.h + 60) * yu, 600, (TRN.h + 60) * yu + 10); ctx.clip();
    hand = E.du(ctx, TRN.x, TRN.y, TRN.h, tpose).R; ctx.restore();
    if (yu < 1) { const yy = TRN.y + 20 - (TRN.h + 60) * yu; E.halo(ctx, TRN.x, yy, 70, .5); }
  }
  // the copied move, a trace of light; earlier repetitions stay as faint echoes
  const a = [hand[0] + 6, hand[1] - 14], b = [rob[0] - 6, rob[1] - 14];
  const arcP = (lift, w) => E.catmull([[a[0], a[1], w], [lerp(a[0], b[0], .3), Math.min(a[1], b[1]) - lift * .8, w], [lerp(a[0], b[0], .7), Math.min(a[1], b[1]) - lift * .8, w], [b[0], b[1], w]], 16);
  const end = 1 - smooth(span(t, A.then - .2, A.then + .4));
  if (t < A.now) {
    for (let i = 0; i < L.echo; i++) E.trail(ctx, arcP(170 + (i + 1) * 26, 1.1), 1, { a: .18 * m, spark: false });
    if (L.arc > 0) E.trail(ctx, arcP(170, 3), L.arc, { w: 3, a: m });
  } else {
    const ya = Math.max(span(t, A.move + .3, A.move + 1.1) * (t < A.keeps + .3 ? 1 : 0), span(t, A.keeps + .55, A.keeps + 1.35));
    const echoes = (t > A.keeps + .3 ? 1 : 0) + (t > A.keeps + 1.4 ? 1 : 0) + 2;
    for (let i = 0; i < echoes; i++) E.trail(ctx, arcP(170 + (i + 1) * 26, 1.1), 1, { a: .16 * end, spark: false });
    const was = 1 - smooth(span(t, A.now, A.now + .8));   // the last trace of c04 fades (no pop at the c04/c05 seam)
    if (was > 0 && ya <= 0) E.trail(ctx, arcP(170, 3), 1, { w: 3, a: was, spark: false });
    if (ya > 0 && ya < 1) E.trail(ctx, arcP(170, 3), ya, { w: 3 });
    if (copy > 0) { E.trail(ctx, arcP(170, 4), smooth(span(t, A.copy, A.copy + .8)), { w: 4, a: end }); }
  }
  return { hand, rob };
}
// skill ↑ / needed ↓ above the trainer's head (c04), then IT KEEPS / YOU DON'T (c05)
const CR = { x: -700, y: -1260, w: 400, h: 330 };
function curvesPart(ctx, t, F) {
  if (t > A.better - .4 && t < A.now) {
    const sink = smooth(span(t, A.often - .2, A.often + .8));
    const a1 = span(t, A.better - .1, A.better + 1.2) * (1 - sink), a2 = span(t, A.needed - .6, A.needed + .5) * (1 - sink);
    iris(ctx, CR.x + CR.w / 2, CR.y + CR.h / 2, 560, .55 * env(t, A.better - .4, A.better + .3, A.often, A.often + .8), 1.3);
    const map = (u, v) => [CR.x + u * CR.w, CR.y + CR.h - v * CR.h];
    const skill = [[0, .06], [.25, .14], [.5, .34], [.75, .64], [1, .92]], need = [[0, .9], [.25, .84], [.5, .62], [.75, .32], [1, .1]];
    const lift = (pts) => E.catmull(pts.map(([u, v]) => [...map(u, v), 4]), 10);
    // the robot's cold trace lifts off and becomes the rising line (it starts at the robot's hand and flies into the axes)
    if (a1 > 0) {
      const ax = smooth(span(t, A.better, A.better + .5)) * (1 - sink); E.trail(ctx, [[...map(0, 0), 2], [...map(1.04, 0), 2]], ax, { spark: false, a: .7 }); E.trail(ctx, [[...map(0, 0), 2], [...map(0, 1.05), 2]], ax, { spark: false, a: .7 });
      lightLine(ctx, lift(skill), a1, false, t);
      wipe(ctx, 'ROBOT SKILL ↑', map(1, .92)[0] + 26, map(1, .92)[1] + 14, span(t, A.better + .7, A.better + 1.2) * (1 - sink), { size: 42, glow: false, col: mixHex(P.cream, P.blue2, .15), spacing: .08, weight: 700 });
    }
    if (a2 > 0) {
      lightLine(ctx, lift(need), a2, true, t);
      wipe(ctx, 'TRAINER NEEDED ↓', map(1, .1)[0] + 26, map(1, .1)[1] + 14, span(t, A.needed, A.needed + .5) * (1 - sink), { size: 42, glow: false, col: P.halo1, spacing: .08, weight: 700 });
    }
  }
  // little money: a small coin of light lands in her hand
  if (t > A.money - .2 && t < A.job + .6) {
    const k = span(t, A.money - .1, A.money + .5), sh = 1 - smooth(span(t, A.now + .1, A.job + .5));
    mark(ctx, 'coin', F.hand[0] + 4, F.hand[1] - 30 - 30 * (1 - expoOut(k)), 34 * sh, t, { lit: 1, u: k, glow: .8 });
  }
  // IT KEEPS / YOU DON'T: two rows over the dark wall; strokes collect on the robot's row, yours stays empty
  if (t > A.move) {
    const rx = -660, ry1 = -1170, ry2 = -1010, gone = smooth(span(t, A.copy, A.copy + .9)), vis = 1 - smooth(span(t, A.then - .2, A.then + .4));
    iris(ctx, rx + 370, ry1 + 80, 640, .5 * env(t, A.move, A.move + .6, A.then - .2, A.then + .4), 1.4);
    wipe(ctx, 'IT KEEPS', rx, ry1 - 58, span(t, A.keeps - .1, A.keeps + .4) * vis, { size: 46, weight: 700, glow: false, col: mixHex(P.cream, P.blue2, .25), spacing: .14 });
    wipe(ctx, "YOU DON'T", rx, ry2 - 58, span(t, A.dont - .1, A.dont + .4) * vis, { size: 46, weight: 700, glow: false, col: P.halo2, spacing: .14 });
    // your row: an empty dotted line of light
    ctx.save(); ctx.setLineDash([2, 16]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo1, .55 * vis); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(rx, ry2 + 30); ctx.lineTo(rx + 740 * smooth(span(t, A.dont - .2, A.dont + .6)), ry2 + 30); ctx.stroke(); ctx.restore();
    // the robot's row: tally strokes, five per move, flying in from the trace
    const groups = [A.move + .9, A.keeps + .1, A.keeps + 1.2, A.not + .3, A.not + .9];
    let n = 0;
    groups.forEach((g0, gi) => {
      for (let j = 0; j < 5; j++) {
        const k = span(t, g0 + j * .07, g0 + j * .07 + .45); if (k <= 0) continue; n++;
        const sx = rx + gi * 150 + j * 24 + (j === 4 ? -54 : 0), sy = ry1 + 30;
        const e = quartIO(k), x = lerp(F.rob[0] - 160, sx, e), y = lerp(F.rob[1] - 240, sy, e) - Math.sin(Math.PI * e) * 70;
        // on "copy" every stroke streams into the robot
        const gk = quartIO(span(gone, (gi * 5 + j) / 34, (gi * 5 + j) / 34 + .3)), gx = lerp(x, F.rob[0] - 20, gk), gy = lerp(y, F.rob[1] + 60, gk) - Math.sin(Math.PI * gk) * 90;
        if (gk >= 1) continue;
        const p = new Path2D(); if (j === 4) { p.moveTo(gx - 8, gy + 32); p.lineTo(gx + 106, gy - 32); } else { p.moveTo(gx, gy - 36); p.lineTo(gx, gy + 36); }
        E.lightShape(ctx, p.stroke({ width: 8, cap: 1, join: 1 }), t, { lit: 0, dust: 0, glow: 1.3, a: 1 - .5 * gk });
      }
    });
    void n;
  }
}
function lightLine(ctx, pts, u, warm, t) {
  if (u <= 0) return;
  if (warm) { E.trail(ctx, pts, u, { w: 4 }); return; }
  // cool line: same three passes, blue-cream
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const stop = len[len.length - 1] * clamp(u); let head = pts[0];
  for (const [k, al, col, op] of [[5, .3, P.blue0, 'lighter'], [2.4, .8, mixHex(P.blue2, P.cream, .4), 'source-over'], [1, 1, P.cream, 'source-over']]) {
    ctx.save(); ctx.globalCompositeOperation = op; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.globalAlpha = al; if (k > 3) ctx.filter = 'blur(8px)';
    ctx.lineWidth = 4 * k; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) { if (len[i - 1] >= stop) break; let q = pts[i]; if (len[i] > stop) { const f = (stop - len[i - 1]) / (len[i] - len[i - 1]); q = [lerp(pts[i - 1][0], q[0], f), lerp(pts[i - 1][1], q[1], f)]; } ctx.lineTo(q[0], q[1]); head = q; }
    ctx.stroke(); ctx.restore();
  }
  if (u < 1) E.halo(ctx, head[0], head[1], 50, .6, P.blue0, P.cream);
}

// ---------- the whole stage ----------
export function hallStage(ctx, t) {
  initCheck();
  const c = camAt(t);
  backdrop(ctx, c, t);
  let F = null, hand = null;
  E.card(ctx, c, F0, () => {
    workPart(ctx, t);
    clockPart(ctx, t);
    hand = duPart(ctx, t);
    slipPart(ctx, t, hand);
    hallPart(ctx, t);
    billPart(ctx, t, hand);
    F = figuresPart(ctx, t);
    if (F) curvesPart(ctx, t, F);
  });
  // in: out of the light (the kitchen lamp became the beam); out: into the window light (the robot goes home)
  let fl = 0;
  if (t < A.in + 1.1) fl = Math.max(fl, floodK(c, F0, BEAM.w * .9), floodOut(t, A.in, 1.0), t < A.in + 1e-3 ? 1 : 0);
  if (t > A.then) fl = Math.max(fl, floodK(c, F0, 260), floodIn(t, A.flood, .6), t >= A.flood - 1e-3 ? 1 : 0);
  E.lightFlood(ctx, fl);
}
