// Film 24 · c02 world (B1) · "Who are they?" · 2.01–2.11 of docs/shots.md. ONE plan sequence:
//   plateCalifornia → push into the gold ESP pin: its medallion opens (iris) onto the explainer field; the medallion's gold wave shrinks
//   into the bell of the listener as it rises → a dark frog on a leaf calls, the wave (NEVER HEARD) flies into the bell, the card TREE FROG
//   comes out of the tip → tries: most cards land, a few miss; a die rolls its own row and mostly misses → the camera pans left: a phone
//   rises, a thumb flicks the endless feed; AZA RASKIN with a gold ESP medallion → the feed drains out of the phone as a stream of calls
//   into the listener → the phone squats into a toy DOG TRANSLATOR, struck, sinks → the gold medallion grows into a window: two elephants
//   talk at dusk, the listener only an ear at the edge → the window grows into the clip plate (C1) and back → $10M stack, REID HOFFMAN →
//   the stack sinks, a blank dictionary rises and opens; a "?" over the talking elephants; their sun sets while the right page lights up;
//   the camera pushes into the page = WINDOW (the kitchen window of c03, ✂ match on the bright rectangle).
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import * as B from './f24_b1_kit.mjs';
import { plateCalifornia, CA_VIEW, CA_CALLS, SEAM_HALF, creep } from './f24_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { rise, maskLine, measure } = F;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------------------------- the field set (field px)
const LIS = [1010, 470], LS = 165;                 // the listener (bell left, tip right); it glides right (dx) when the dusk window opens
const BELL = [LIS[0] - LS * .9, LIS[1]], TIP = [LIS[0] + LS * 1.05, LIS[1] - LS * .05];
const FROG = [300, 722], FH = 138;                  // the unknown animal on its leaf (dark until the card names it)
const CARD = [1250, 330];                          // the species card (top-left)
const ROW1 = [1276, 528], ROW2 = [1276, 628], RS = 60, NTRY = 8;
const HIT1 = [1, 1, 0, 1, 1, 1, 0, 1], HIT2 = [0, 0, 0, 0, 0, 1, 0, 0];
const PH = [-160, 500], PW = 320, PHH = 640;       // the phone (centre), bottom at 820
const PBOT = PH[1] + PHH / 2;
const MED0 = [80, 300, 46], MED1 = [60, 460, 300];  // Raskin's gold medallion → the dusk window
const STACK = [600, 770];                          // the $10M stack (bottom centre)
const BOOK = [590, 318], BW = 236, BH = 320;      // the dictionary: spine top, page size
// the right page at the end of c02 = the kitchen window of c03 (screen rect): the camera that shows the page there
export const PAGE_Z = 1.62;
const PAGE = { x: BOOK[0] + 6, y: BOOK[1], w: BW - 6, h: BH };
export const WINDOW = { x: 1150, y: 262, w: PAGE.w * PAGE_Z, h: PAGE.h * PAGE_Z };
const CAM_END = { x: PAGE.x - (WINDOW.x - W / 2) / PAGE_Z, y: PAGE.y - (WINDOW.y - H / 2) / PAGE_Z, z: PAGE_Z };

const ESP = F.PIN.esp;
const ZIN = B.bez(.5, 0, .22, 1);                 // the zoom into the ESP pin (3.4 s): slow off the creep, long settle
const zv = (v, k) => F.mapView(v.lon, v.lat, v.z * k);
const ICON_R = .95 * F.RF;                         // the pin icon (gold rumble wave) in medallion space

// the dusk window: two elephants talking across a low sun. s = the scene's scale on screen (zooms in when small)
function dusk(ctx, t, s, a, o = {}) {
  const Z = lerp(1.75, 1.0, clamp((s - .25) / .6)), fx = 960, fy = 690;
  ctx.save(); ctx.translate(fx, fy); ctx.scale(Z, Z); ctx.translate(-fx, -fy);
  B.duskSky(ctx, t, { horizon: 720, sunX: 960, sunY: lerp(668, 790, sineIO(o.set ?? 0)), sunR: 74, set: o.set ?? 0 });
  B.acacia(ctx, 1640, 724, 300); B.acacia(ctx, 250, 726, 190);
  const talk = (t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
  // alternate: left speaks, right answers (a loop of ~3.2 s from a.understand on, both live)
  const cyc = ((t - a.understand + 50) % 3.2 + 3.2) % 3.2, sL = Math.sin(Math.PI * clamp(cyc / 1.4)), sR = Math.sin(Math.PI * clamp((cyc - 1.6) / 1.4));
  const L = F.elephant(ctx, t, 640, 770, 222, { dir: 1, light: 1, warm: .8, seed: 2, trunk: .35 * sL, ears: .3 + .25 * sL, open: sL });
  const R = F.elephant(ctx, t, 1290, 772, 205, { dir: -1, light: -1, warm: .8, seed: 5, trunk: .35 * sR, ears: .3 + .25 * sR, open: sR });
  B.grass(ctx, t, 740, 900, .8);
  if (sL > .02) F.wave(ctx, t, (L.trunk[0] + 960) / 2 + 10, L.head[1] - 40, 150, 70 * sL, 'rumble', { u: clamp(cyc / 1.1), col: 'cream', seed: 41, bars: 20, head: false, a: .9 });
  if (sR > .02) F.wave(ctx, t, (R.trunk[0] + 960) / 2 - 10, R.head[1] - 60, 150, 70 * sR, 'rumble', { u: clamp((cyc - 1.6) / 1.1), col: 'cream', seed: 42, bars: 20, head: false, a: .9 });
  void talk;
  ctx.restore();
}

export function scene(a, T) {
  const T0 = a.T0, tz0 = T0 + SEAM_HALF, tz1 = tz0 + 3.4, END = a.end, C1 = a.c1;
  const HR0 = F.PIN_R * 1.25, ZMAX = F.RF * 1.03 / HR0;
  // ---- the field camera: word keys (field px), plus a drift that fades out into the final push (the match frame must be exact)
  const K = [
    [tz0, { x: 960, y: 540, z: 1 }],
    [tz1, { x: 930, y: 536, z: 1.0 }],
    [a.made + .2, { x: 860, y: 522, z: 1.08 }],
    [a.notEvery + 1.6, { x: 1060, y: 530, z: 1.06 }],
    [a.lucky + .3, { x: 1110, y: 540, z: 1.1 }],
    [a.invented + .5, { x: 300, y: 520, z: 1.04 }],
    [a.inf + 1.4, { x: 290, y: 500, z: 1.1 }],
    [a.listens + .5, { x: 430, y: 520, z: .9 }],
    [a.dog + .1, { x: 320, y: 560, z: .98 }],
    [a.here - .2, { x: 360, y: 540, z: 1.0 }],
    [C1.end - .2, { x: 372, y: 536, z: 1.025 }],
    [a.linked + .6, { x: 420, y: 532, z: 1.045 }],
    [a.noOne - .5, { x: 470, y: 525, z: 1.075 }],
    [END, CAM_END, { lead: .7 }],
  ];
  const camP = B.camPath(K);
  const cam = (t) => { const amt = 1 - sineIO(span(t, a.noOne - .5, END - .3)); return B.fieldDrift(camP(t), t, amt, 3); };

  // ---- the map part (the zoom into the gold pin)
  const caV = (t) => zv(CA_VIEW, creep(t, T, 'Their A.I. can already'));
  const P0 = (() => { const v = caV(tz0); return F.mapXY(v, ESP.lon, ESP.lat); })();
  function zoomState(t) {
    const e = ZIN(span(t, tz0, tz1)), zf = Math.exp(Math.log(ZMAX) * e), vc = caV(t), z = vc.z * zf, k = F.kOf({ z });
    const px = lerp(P0[0], W / 2, e), py = lerp(P0[1], H / 2, e);
    const v = F.mapView(ESP.lon - (px - W / 2) / k, ESP.lat + (py - H / 2) / k, z);
    const hr = HR0 * zf, kk = sineIO(clamp((hr - F.RF) / (HR0 - F.RF) * 1.25 - .25));
    return { e, v, hr, rr: F.PIN_R * zf, head: [px, py - (F.STALK + hr) * kk] };
  }

  // ---- the field (drawn in medallion space: 0..W × 0..H; the iris maps it into the circle)
  const lisU = (t) => rise(span(t, tz0 + 1.2, tz0 + 2.6));
  const frogCall = (t) => Math.max(0, Math.sin(Math.PI * span(t, a.play + .25, a.never + .3))) * (.65 + .35 * Math.sin(t * 15));
  const callU = (t) => span(t, a.play + .3, a.never + .1);
  const callFly = (t) => sineIO(span(t, a.never + .35, a.tell + .1));
  const lisDx = (t) => 140 * sineIO(span(t, a.understand + .1, a.understand + 2.5));
  const cardU = (t) => expoOut(span(t, a.tell + .05, a.tell + .95));
  const drink = (t) => Math.max(F.bump(t, tz1 - .2, .8) * .8, F.bump(t, a.tell - .5, .8), ...STREAM_T.map((s) => F.bump(t, s + 1.35, .5) * .5));
  const fieldOut = (t) => 1 - expoIn(span(t, a.one + .1, a.one + .7));   // card, rows sink when the camera leaves for the phone
  // the feed's flicks
  const FL = []; for (let s = a.one + 1.1; s < a.now - .1; s += .95) FL.push(s);
  const feedOff = (t) => 40 * Math.max(0, t - a.one) + FL.reduce((m, s) => m + 230 * expoOut(span(t, s, s + .65)), 0);
  const thumbLift = (t) => FL.reduce((m, s) => Math.max(m, Math.sin(Math.PI * span(t, s - .18, s + .42))), 0);
  // the drain: chips leave the phone bottom and flow along a curve into the bell
  const STREAM_T = []; for (let s = a.now + .2; s < a.notChat - .7; s += .24) STREAM_T.push(s);
  const PATH = [[PH[0] + 40, PBOT - 10], [PH[0] + 160, PBOT + 90], [560, 760], [BELL[0] - 40, BELL[1] + 6]];
  const bz = (u) => { const [p0, p1, p2, p3] = PATH, q = 1 - u; return [q * q * q * p0[0] + 3 * q * q * u * p1[0] + 3 * q * u * u * p2[0] + u * u * u * p3[0], q * q * q * p0[1] + 3 * q * q * u * p1[1] + 3 * q * u * u * p2[1] + u * u * u * p3[1]]; };
  const KINDS = ['chirp', 'click', 'whistle', 'rumble', 'caw', 'song', 'grunt', 'babble'];
  const boxU = (t) => sineIO(span(t, a.notChat - .1, a.notChat + .75));
  const boxOut = (t) => expoIn(span(t, a.understand - .1, a.understand + .55));
  const medE = (t) => sineIO(span(t, a.understand + .15, a.understand + 2.45));
  const labU = (t) => B.riseOut(t, a.inf - .05, a.understand - .25, .8, .4);
  const medR0 = (t) => MED0[2] * expoOut(span(t, a.inf + .05, a.inf + .75));
  function medNow(t) { const e = medE(t); return [lerp(MED0[0], MED1[0], e), lerp(MED0[1], MED1[1], e), lerp(medR0(t), MED1[2], e)]; }
  const setU = (t) => span(t, a.noOne - .2, END);
  const bookU = (t) => span(t, a.crack + .5, a.noDict + .1);
  const bookRise = (t) => rise(span(t, a.crack + .15, a.crack + .9));
  const stackOut = (t) => expoIn(span(t, a.crack - .2, a.crack + .4));
  const glowU = (t) => E.smooth(span(t, a.noOne + .1, END));

  function field(ctx, t, c) {
    const gu = sineIO(span(t, a.one - .2, a.one + 1.2)), gc = B.toField(c, W / 2, H / 2);
    B.fieldBg(ctx, t, c, { glow: [lerp(960, gc[0], gu), lerp(520, gc[1], gu)] });   // the glow lets go of the listener and rides with the camera (no jump)
    B.withCam(ctx, c, () => {
      const out = fieldOut(t);
      // the frog on its leaf (dark: an animal the machine has never heard)
      // it sinks below its leaf line once the phone story takes over (mask sink, no fade)
      const fsk = expoIn(span(t, a.inf + .2, a.inf + 1.1));
      ctx.save(); if (fsk > 0) { ctx.beginPath(); ctx.rect(FROG[0] - 400, FROG[1] - 600, 800, 640); ctx.clip(); ctx.translate(0, fsk * 240); }
      B.leaf(ctx, FROG[0], FROG[1] + 6, 140, t);
      const fr = F.frog(ctx, t, FROG[0], FROG[1], FH, { dir: 1, light: 1, warm: .5 + .4 * cardU(t), dark: .42 - .37 * cardU(t), open: frogCall(t), seed: 3 });
      ctx.restore();
      // the listener + its name
      const ldx = lisDx(t);
      F.listener(ctx, t, LIS[0] + ldx, LIS[1], LS, { u: lisU(t), drink: drink(t) });
      const nu = B.riseOut(t, tz1 - .9, a.one - .1, .8, .4);
      if (nu > 0) maskLine(ctx, [['NatureLM-audio · ', 0], ['ESP', 1]], LIS[0], LIS[1] + 150, 28, nu, { serif: false, weight: 600, align: 'center', col: P.halo2, glow: false });
      // the unknown call: grows from the frog's mouth while it calls, then flies into the bell (tag NEVER HEARD rides on it)
      const cu = callU(t), cf = callFly(t);
      if (cu > 0 && cf < 1) {
        const x0 = fr.mouth[0] + 150, y0 = fr.mouth[1] - 70, x = lerp(x0, BELL[0] - 30, cf), y = lerp(y0, BELL[1], cf) - 60 * Math.sin(Math.PI * cf), sc = lerp(1, .22, cf * cf);
        ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
        F.wave(ctx, t, 0, 0, 270, 110, 'chirp', { u: cu, col: 'cream', live: true, seed: 21, bars: 30 });
        B.tag(ctx, 'NEVER HEARD', 0, -86, rise(span(t, a.never - .05, a.never + .5)) * (1 - expoIn(span(cf, .35, .7))), { size: 20 });
        ctx.restore();
      }
      // the species card comes out of the tip
      const ku = cardU(t);
      if (ku > 0 && out > 0) {
        const x = lerp(TIP[0], CARD[0], ku), y = lerp(TIP[1] - 20, CARD[1], ku), sc = lerp(.15, 1.4, ku);
        ctx.save(); ctx.translate(x, y + (1 - out) * 160); ctx.scale(sc, sc);
        ctx.beginPath(); ctx.rect(-40, -60, 520, 200 - (1 - out) * 140); ctx.clip();
        F.idCard(ctx, t, 0, 0, { name: 'TREE FROG', animal: 'frog', u: 1, col: 'cream' });
        ctx.restore();
      }
      // tries: the listener's cards land in a row (most hit), the die rolls its own row (mostly misses)
      if (out > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(ROW1[0] - 60, ROW1[1] - 60, NTRY * RS + 120, 160 - (1 - out) * 160); ctx.clip(); ctx.translate(0, (1 - out) * 120);
        for (let i = 0; i < NTRY; i++) {
          const t0 = a.notEvery + .1 + i * .13, fu = span(t, t0, t0 + .55); if (fu <= 0) continue;
          const e = expoOut(fu), x = lerp(TIP[0], ROW1[0] + i * RS, e), y = lerp(TIP[1], ROW1[1] + (HIT1[i] ? 0 : 10), e) - 50 * Math.sin(Math.PI * e);
          B.miniCard(ctx, x, y, fu, !!HIT1[i], t, 1.25);
        }
        ctx.restore();
        const du = span(t, a.but - .05, a.luckyE + .1);
        if (du > 0) {
          ctx.save(); ctx.beginPath(); ctx.rect(ROW2[0] - 120, ROW2[1] - 70, NTRY * RS + 200, 140 - (1 - out) * 140); ctx.clip(); ctx.translate(0, (1 - out) * 120);
          const dx = lerp(ROW2[0] - 80, ROW2[0] + (NTRY - 1) * RS + 70, sineIO(du)), rr = rise(span(t, a.but - .1, a.but + .35));
          for (let i = 0; i < NTRY; i++) { const px = ROW2[0] + i * RS; if (dx > px + 8) B.miniCard(ctx, px, ROW2[1] + (HIT2[i] ? 0 : 10), span(dx, px + 8, px + 40), !!HIT2[i], t, 1.25); }
          B.die(ctx, dx, ROW2[1] + (1 - rr) * 70 - 2, 48, (dx - ROW2[0]) / 20, 1 + Math.floor((dx - ROW2[0]) / 30 + 60) % 6);
          ctx.restore();
        }
      }
      // the phone: rises from its baseline, the thumb flicks the feed; then the feed drains into a stream of calls
      const pu = rise(span(t, a.one + .8, a.one + 1.9)), bo = boxOut(t);
      if (pu > 0 && bo < 1) {
        const bxu = boxU(t), w = lerp(PW, 340, bxu), h = lerp(PHH, 250, bxu), cy = PBOT - h / 2;
        ctx.save(); ctx.beginPath(); ctx.rect(PH[0] - 300, PH[1] - 600, 600, PBOT - PH[1] + 610); ctx.clip();
        ctx.translate(0, (1 - expoOut(pu)) * (PHH + 40) + bo * (h + 40));
        const drain = Math.max(0, t - a.now) ** 1.4 * 420;
        const S = B.phone(ctx, t, PH[0], cy, w, h, { box: bxu, glow: 1 - bxu * .6, screen: (cx, sx, sy, sw, sh) => {
          if (bxu < 1) { cx.save(); cx.globalAlpha *= 1 - span(bxu, 0, .5); B.feed(cx, t, sx, sy, sw, sh, feedOff(t), { drain }); cx.restore(); }
          if (bxu > .4) B.toyScreen(cx, t, sx, sy, sw, sh, span(bxu, .4, 1));
        } });
        if (bxu < .3) B.thumb(ctx, PH[0] + PW * .3, PBOT - 40, 70, thumbLift(t) * (1 - span(t, a.now - .3, a.now + .2)));
        // struck: a cool line across the toy
        const su = expoOut(span(t, a.dog - .05, a.dog + .4));
        if (su > 0) { ctx.strokeStyle = mixHex(P.blue0, P.cream, .45); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(PH[0] - w / 2 - 14, cy - h / 2 - 6); ctx.lineTo(lerp(PH[0] - w / 2 - 14, PH[0] + w / 2 + 14, su), lerp(cy - h / 2 - 6, cy + h / 2 + 6, su)); ctx.stroke(); }
        ctx.restore();
        void S;
      }
      // the stream of calls from the drained feed into the bell
      STREAM_T.forEach((s0, j) => {
        const u = span(t, s0, s0 + 1.45); if (u <= 0 || u >= 1) return;
        const e = E.smooth(u), [x, y] = bz(e), sc = lerp(1, .45, e) * Math.min(1, u * 6);
        B.twave(ctx, t, x, y, 120 * sc, 52 * sc, KINDS[j % KINDS.length], j % 5 === 2 ? P.halo1 : P.cream, { bars: 12, seed: j + 3, a: .95 });
      });
      // Raskin's label and its gold medallion (a stalk from the phone's edge); the medallion becomes the dusk window
      const lu = labU(t), m = medNow(t);
      if (lu > 0) {
        F.rule(ctx, PH[0] + PW / 2 + 6, MED0[1], MED0[0] - MED0[2] - 4, MED0[1], lu, { w: 2, spark: false });
        maskLine(ctx, [['AZA RASKIN', 1]], MED0[0] + 56, MED0[1] - 4, 36, lu, { serif: false, weight: 600, glow: false });
        maskLine(ctx, [['CO-FOUNDER · INVENTED INFINITE SCROLL', 0]], MED0[0] + 56, MED0[1] + 32, 22, rise(span(lu, .2, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
      }
      const inClip = t >= a.here && t < C1.end + 1.3;
      if (m[2] > .5 && !inClip) {
        if (m[2] < 120) halo(ctx, m[0], m[1], m[2] * 3.5, .3 * clamp((120 - m[2]) / 80), F.GOLD.body, F.GOLD.core);
        B.medal(ctx, m[0], m[1], m[2], (cx, s) => dusk(cx, t, s * c.z, a, { set: setU(t) }));
      }
      // the $10M stack, then the dictionary rises in its place and opens
      const so = stackOut(t), su = span(t, a.money - .1, a.ten + .3);
      if (su > 0 && so < 1) {
        ctx.save(); ctx.beginPath(); ctx.rect(STACK[0] - 300, STACK[1] - 700, 600, 704); ctx.clip(); ctx.translate(0, so * 260);
        B.bills(ctx, STACK[0], STACK[1], 8, su, t);
        ctx.restore();
        const nu2 = B.riseOut(t, a.ten - .1, a.crack - .35, .8, .4), lu2 = B.riseOut(t, a.linked - .1, a.crack - .4, .8, .4);
        if (nu2 > 0) maskLine(ctx, [['$10M', 0]], STACK[0], STACK[1] - 8 * 22 - 92, 120, nu2, { align: 'center' });
        if (lu2 > 0) maskLine(ctx, [['REID HOFFMAN · LINKEDIN CO-FOUNDER', 0]], STACK[0], STACK[1] - 8 * 22 - 40, 22, lu2, { serif: false, weight: 600, col: P.halo2, glow: false, align: 'center' });
      }
      const br = bookRise(t);
      if (br > 0) {
        ctx.save(); ctx.beginPath(); ctx.rect(BOOK[0] - 400, BOOK[1] - 200, 800, BH + 236); ctx.clip(); ctx.translate(0, (1 - expoOut(br)) * (BH + 60));
        B.book(ctx, t, BOOK[0], BOOK[1], BW, BH, { u: bookU(t), flip: span(t, a.noDict - .1, a.noDict + 1.5) * 3 % 3 + (t > a.noDict + 1.5 ? 999 : 0), glow: glowU(t), tabs: true });
        ctx.restore();
      }
      const qu = B.riseOut(t, a.noOne - .05, null, .8);
      if (qu > 0) maskLine(ctx, [['?', 0]], MED1[0] + 250, MED1[1] - 200, 120, qu, { align: 'center' });
    });
  }
  // the medallion-space overlay of the zoom: the pin's dark disc and its gold wave become the field and the listener's call
  function zoomOverlay(ctx, t, c, e) {
    const dk = 1 - span(e, .02, .3); if (dk > 0) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind1, .55), dk); ctx.fillRect(-60, -60, W + 120, H + 120); }
    const q = sineIO(span(e, 0, 1)), [bx, by] = B.toScr(c, BELL[0] - 70, BELL[1]), ab = expoIn(span(t, tz1 - .35, tz1 + .25));
    if (ab >= 1) return;
    const w = Math.exp(lerp(Math.log(1.3 * ICON_R), Math.log(150 * c.z), q)) * (1 - ab), h = Math.exp(lerp(Math.log(.9 * ICON_R), Math.log(100 * c.z), q)) * (1 - ab);
    F.wave(ctx, t, lerp(W / 2, bx + 70 * c.z * ab, q), lerp(H / 2 + .05 * F.RF, by, q), w, h, 'rumble', { col: 'gold', u: 1, bars: 9, seed: 4 });
  }

  return (ctx, t) => {
    if (t < tz0) { plateCalifornia(ctx, t, T); return; }
    const c = cam(t);
    if (t < tz1) {   // the map with the growing medallion; the field inside it
      const z = zoomState(t);
      F.map(ctx, t, z.v, { calls: CA_CALLS });
      const hd = F.pins(ctx, t, T, z.v, { head: { esp: z.head }, r: { esp: z.rr }, inner: { esp: () => {} }, labels: { esp: 1 - expoIn(span(t, tz0 + .05, tz0 + .5)) } });
      if (hd.esp) {
        const [cx, cy, rr] = hd.esp, s = rr / F.RF;
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.arc(cx, cy, rr - 1, 0, TAU); ctx.clip();
        ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
        field(ctx, t, c); zoomOverlay(ctx, t, c, z.e);
        ctx.restore();
        ctx.save(); ctx.strokeStyle = F.GOLD.body; ctx.lineWidth = clamp(rr * .12, 2, 3.2); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.stroke(); ctx.restore();
      }
    } else { field(ctx, t, c); zoomOverlay(ctx, t, c, 1); }
    // the clip: the dusk window grows into the plate, C1 plays (the field holds under it), and shrinks back into the window
    if (t >= a.here && t < C1.end + 1.3) {
      const m = medNow(t), [sx, sy] = B.toScr(c, m[0], m[1]), from = [sx, sy, m[2] * c.z];
      if (t < C1.start) B.plateScene(ctx, from, span(t, a.here + .05, C1.start - .05), (cx, s) => dusk(cx, t, s, a, {}));
      else if (t < C1.end) { F.clipPlate(ctx, t, T, 'C1', { from, morph: 1, credits: false }); }
      else B.plateScene(ctx, from, 1 - span(t, C1.end, C1.end + 1.25), (cx, s) => dusk(cx, t, s, a, {}));
      B.credits(ctx, 'C1', span(t, C1.start + .2, C1.start + 1.1) * (1 - span(t, C1.end - .5, C1.end + .1)));
    }
    // the room darkens round the lit page as the sun sets (motivates the cut into the kitchen's morning window)
    const dk = sineIO(span(t, a.noOne, END));
    if (dk > 0) {
      const [px, py] = B.toScr(c, PAGE.x, PAGE.y), pw = PAGE.w * c.z, ph = PAGE.h * c.z, gx = px + pw / 2, gy = py + ph / 2;
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(px, py, pw, ph); ctx.clip('evenodd');   // everything but the lit page
      ctx.fillStyle = E.rad(ctx, gx, gy, 1400, [[0, E.rgba(E.P.night0, .3 * dk)], [.5, E.rgba(E.P.night0, .45 * dk)], [1, E.rgba(E.P.night0, .6 * dk)]]);
      ctx.fillRect(0, 0, W, H); ctx.restore();
    }
    F.strip(ctx, t, T);
  };
}
