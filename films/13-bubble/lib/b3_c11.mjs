// Film 13 · c11 (B3) · "Nobody gives up what they own." → "…when the rules were right." · ONE take:
//   SCALE  (plate c10|c11)  the two tickets hang themselves on a balance: PUBLIC HELP | CONDITION, it swings out level (nothing is
//                           taken from either side). On "before" five small cards fan out: 1844 · 2009 · STOCKHOLM · OHIO · INTEL.
//   ROOM                    the 2009 card lifts, flies at the camera and FLIPS: its back is your pension letter, which fills the frame;
//                           the line on it falls (crash). Pull-back: you at the table under the lamp, the letter in one hand, the ticket
//                           in the other; the ticket glows (seat). Two tags unfold from it: GOOD ENOUGH? · PRICE? and swing (comments).
//   DAVOS                   the camera flies through the window behind you into the snow: far off, a conference hall, one lit window,
//                           a lectern (DAVOS · JANUARY 2026 · SATYA NADELLA · MICROSOFT). Label only, no quotation marks: NADELLA'S TEST ·
//                           BENEFITS MUCH MORE EVENLY SPREAD. On "evenly spread" the lectern light runs out as many small lights, evenly
//                           along the ground line.
//   PEREZ ★                 the ground line becomes the timeline of technology waves (light running right, the camera with it): each a
//                           spike, then a warm plateau over small figures; golden ages; § = the rules were right (those stay golden).
//                           The last spike rises and rounds into the bubble over the data center → seam plate c11|c12 (plateBubble).
import { Path2D } from '@napi-rs/canvas';
import { E, K, B, rise, ramp, sramp, herm, bump, label, PUSH, zoomAt, nightBack, TK, ticketNew, ticketOld, plateTickets, BB, DCB, PL_C, bwSky, bwGround, bwDC, perez, PZ, PZ_PATH, plateBubble } from './b3_common.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, lin, rad, prng, halo, card, camAt, camDrift, aim, project, F0 } = E;
const { COL } = B;

// ------------------------------------------------------------------------------------------------ the scale (plate space)
const PIV = [960, 330], ARM = 270, STR = 170;
const CARDS = ['1844', '2009', 'STOCKHOLM', 'OHIO', 'INTEL'], CARD_H = 66, CARD_Y = 820;
const CARD_WS = CARDS.map((s) => Math.round(K.measure(s, 30, false) + 56)), CARD_W = CARD_WS[1];
const CARD_XS = (() => { const gap = 22, tot = CARD_WS.reduce((p, q) => p + q, 0) + gap * 4; let x = 960 - tot / 2; return CARD_WS.map((w) => { const c = x + w / 2; x += w + gap; return c; }); })();
const cardX = (i) => CARD_XS[i];
// ------------------------------------------------------------------------------------------------ the room (design, F0)
const DU = { x: 830, y: 1010, h: 560 };
const ARM_L = [-.15, 1.0], ARM_R = [.7, 1.9];
const handAt = (sd, [s1, s2]) => [DU.x + DU.h * (sd * .098 + Math.sin(s1) * .17 + Math.sin(s2) * .155), DU.y + DU.h * (-.74 + Math.cos(s1) * .17 + Math.cos(s2) * .155)];
const HL = handAt(-1, ARM_L), HR = handAt(1, ARM_R);
const LET = { x: HL[0] - 30, y: HL[1] - 52, w: 122, rot: -.1 }; LET.h = LET.w * 1.29;
const TKT = { x: HR[0] + 20, y: HR[1] - 12, w: 120, rot: -.08 };
const WIN = { x0: 1270, x1: 1730, y0: 230, y1: 680 }, WC = [(WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2];
const LAMP = { x: 560, y: 300 }, TABLE_Y = 762;
const S_LET = 17;                                               // the room camera's scale when the letter fills the frame
// ------------------------------------------------------------------------------------------------ outside (plate coordinates + truck X)
const X_OUT = -3600, Z_OUT = .84;
const HWC = [X_OUT + PL_C[0] + (960 - PL_C[0]) / Z_OUT, PL_C[1] + (540 - PL_C[1]) / Z_OUT];   // the hall's lit window = screen centre at the hand-over
const GY = DCB.y;
const RIDGE = (() => { const r = prng(2601), a = []; const n = 16; for (let i = 0; i <= n; i++) { const x = HWC[0] - 1900 + 3600 * i / n + (r() - .5) * 60, taper = Math.sin(Math.PI * i / n) ** .6; a.push([x, GY - (90 + (i % 2 ? 470 : 230) * (.65 + .35 * r())) * taper]); } return a; })();
const FLAKES = (() => { const r = prng(915), a = []; for (let i = 0; i < 240; i++) a.push([HWC[0] - 1600 + r() * 3200, 80 + r() * 70, r() * 1100, 1.4 + r() * 2.4, r() * 6.3]); return a; })();

function spline(t, K) {   // Catmull-Rom through [t, v] keys, zero velocity at both ends
  if (t <= K[0][0]) return K[0][1]; const n = K.length; if (t >= K[n - 1][0]) return K[n - 1][1];
  let i = 0; while (t > K[i + 1][0]) i++;
  const v = (j) => (j <= 0 || j >= n - 1 ? 0 : (K[j + 1][1] - K[j - 1][1]) / (K[j + 1][0] - K[j - 1][0]));
  return herm(t, K[i][0], K[i + 1][0], K[i][1], K[i + 1][1], v(i), v(i + 1));
}

export function make(T, R) {
  E.prepareEditorial();
  const at = T.seq(R.a), a = {};
  a.T0 = R.a; a.own = at('what they own'); a.cond = at('condition'); a.pubh = at('public help'); a.before = at('before');
  a.shield = at('shield'); a.pension = at('pension'); a.crash = at('crash'); a.decides = at('decides'); a.seat = at('seat');
  a.counts = at('What counts'); a.goodE = at('good enough'); a.price = at('price'); a.real = at('real arguments'); a.comments = at('comments');
  a.beforeC = at('before a crash'); a.notafter = at('not after'); a.so = at('So'); a.bubbleQ = at('bubble'); a.davos = at('Davos'); a.satya = at('Satya');
  a.test = at('test'); a.forthis = at('For this not'); a.evenly = at('evenly spread'); a.econ = at('The economist'); a.perez = at('Carlota Perez');
  a.pattern = at('pattern'); a.aftereach = at('After each'); a.society = at('all of society'); a.golden = at('Golden ages'); a.rules = at('rules were right');
  a.T1 = R.b;
  const tQ = a.T0 + .5, tPlate = a.T1 - .5;

  // ================================================================ A: the scale (plate space, the plate's push eases out)
  const lnA = (t) => (t < tQ ? PUSH * (t - (a.T0 - .5)) : herm(t, tQ, tQ + 5, PUSH, PUSH + .12, PUSH, 0));
  const tPost0 = a.T0 + .25, tPost1 = a.T0 + 1.35, tBeam0 = a.T0 + 1.0, tBeam1 = a.T0 + 1.9, tStr0 = a.T0 + 1.7, tStr1 = a.T0 + 2.25;
  const tCards = a.before - .2, tLift = a.before + .75, tSw = a.pension + .6;
  const theta = (t) => (t < tStr1 ? 0 : .085 * Math.exp(-(t - tStr1) * .8) * Math.sin(2.4 * (t - tStr1)));

  // ================================================================ the room camera
  const tOut = a.so + 1.8;
  const KR = [
    [tSw, aim(F0, LET.x, LET.y, S_LET)],
    [a.seat - .1, aim(F0, 930, 600, 1.0)],
    [a.counts + .3, aim(F0, 940, 598, 1.02)],
    [a.comments, aim(F0, 1010, 612, 1.22)],
    [a.notafter, aim(F0, 1030, 604, 1.25)],
    [tOut, aim(F0, WC[0], WC[1], 6.6), 'q'],
  ];
  const camR = (t) => camDrift(camAt(t, KR), t, .5 * ramp(t, tSw + 2.5, tSw + 4.5) * (1 - ramp(t, a.notafter, tOut)), 11);

  // ================================================================ outside: zoom z (about the plate centre), truck X, the running light
  const zK = (t) => {
    if (t < tOut) return Math.log(Z_OUT);
    if (t < a.econ - 1) return herm(t, tOut, a.econ - 1, Math.log(Z_OUT), Math.log(.9), 0, 0);
    if (t < a.society - 1.5) return herm(t, a.econ - 1, a.society - 1.5, Math.log(.9), Math.log(.62), 0, 0);
    return herm(t, a.society - 1.5, tPlate, Math.log(.62), 0, 0, PUSH);
  };
  const XK = [[tOut, X_OUT], [a.evenly + .3, X_OUT + 170], [a.econ + .2, X_OUT + 420], [a.aftereach + 1.5, -1600], [a.society + .4, -850], [tPlate, 0]];
  const tg = a.golden - .3;
  const lx = (t) => (t < tg ? herm(t, a.econ - .2, tg, HWC[0] + 520, PZ.spikeX - 44, 0, 300) : lerp(PZ.spikeX - 44, 2000, sramp(t, tg, tg + 1.6)));
  const tSpk0 = a.golden - .3, tSpk1 = a.golden + .9, tBub0 = a.golden + .6, tBub1 = tPlate - .15;
  const so = (t) => Math.exp(herm(t, a.notafter, tOut, Math.log(.3), Math.log(Z_OUT), 0, 0));
  // the outside layer's transform (before tOut: anchored in your window; after: the plate's zoom + the truck)
  const outM = (t) => {
    if (t < tOut) { const p = project(camR(t), F0, WC[0], WC[1]), s = so(t); return [s, p[0] - HWC[0] * s, p[1] - HWC[1] * s]; }
    const z = Math.exp(zK(t)), X = spline(t, XK); return [z, PL_C[0] - (X + PL_C[0]) * z, PL_C[1] - PL_C[1] * z];
  };
  const dotT = (x) => a.evenly - .1 + Math.abs(x - HWC[0]) / 1500;

  return (ctx, t) => {
    if (t >= tPlate) { plateBubble(ctx, t, a.T1); return; }
    if (t < tQ) { plateTickets(ctx, t, a.T0); return; }
    if (t < tSw) { scaleScene(ctx, t); flyingCard(ctx, t); return; }
    // the sky of the first image (screen-far), the ground, the outside world, then the room in front
    const z = Math.exp(zK(t));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); zoomAt(ctx, z, PL_C[0], PL_C[1]); bwSky(ctx, t); if (t >= tOut) bwGround(ctx); ctx.restore();
    const [s, ex, ey] = outM(t);
    ctx.save(); ctx.setTransform(s, 0, 0, s, ex, ey); outside(ctx, t, s); ctx.restore();
    if (t < tOut) card(ctx, camR(t), F0, () => room(ctx, t));
    texts(ctx, t);
  };

  // ================================================================================================ A · the scale
  function scaleScene(ctx, t) {
    nightBack(ctx, t, { gy: 500, seed: 1011 });
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); zoomAt(ctx, Math.exp(lnA(t)), 960, 500);
    const th = theta(t), L = ARM * sramp(t, tBeam0, tBeam1), postTop = lerp(1200, PIV[1], sramp(t, tPost0, tPost1)), attach = sramp(t, tStr0, tStr1);
    // the post and its foot (rises from below)
    if (t > tPost0) {
      ctx.fillStyle = lin(ctx, 940, 0, 980, 0, [[0, P.night1], [.6, mixHex(P.ind2, P.blue1, .4)], [1, P.ind2]]); ctx.fillRect(952, postTop, 16, 1300 - postTop);
      ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(966, postTop, 2, 1300 - postTop);
      const fy = postTop + 600; ctx.fillStyle = mixHex(P.ind2, P.blue1, .3); ctx.beginPath(); ctx.moveTo(880, fy); ctx.lineTo(1040, fy); ctx.lineTo(1010, fy - 26); ctx.lineTo(910, fy - 26); ctx.closePath(); ctx.fill();
    }
    // the cards (fan out from the foot on "before")
    CARDS.forEach((txt, i) => {
      const u = sramp(t, tCards + i * .08, tCards + .75 + i * .08); if (u <= 0 || (i === 1 && t >= tLift)) return;
      const x = lerp(960, cardX(i), u), y = lerp(PIV[1] + 600 - 30, CARD_Y, u) - 80 * Math.sin(Math.PI * u);
      cardFront(ctx, x, y, CARD_WS[i] * lerp(.4, 1, u), 0, txt, 1);
    });
    // the beam
    if (L > 1) {
      ctx.save(); ctx.translate(PIV[0], PIV[1]); ctx.rotate(th);
      ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.beginPath(); ctx.roundRect(-L, -5, 2 * L, 10, 5); ctx.fill();
      ctx.fillStyle = rgba(P.halo1, .7); ctx.fillRect(-L + 4, -5, 2 * L - 8, 2);
      ctx.restore();
      ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.arc(PIV[0], PIV[1], 9, 0, 6.29); ctx.fill(); halo(ctx, PIV[0], PIV[1], 60, .4, P.halo1, P.core0);
    }
    // the pans = the two tickets (they settle level and lie a little back)
    const bob = 1 - attach;
    [-1, 1].forEach((sd) => {
      const ex = PIV[0] + sd * ARM * Math.cos(th), ey = PIV[1] + sd * ARM * Math.sin(th);
      const x = ex, y = ey + STR + bob * 3 * Math.sin(t * .8 + (sd > 0 ? 1.4 : 0)), sy = lerp(1, .62, sramp(t, tStr1 - .2, tStr1 + .6));
      const rot = lerp(sd < 0 ? TK.rot[0] : TK.rot[1], 0, attach);
      if (attach > 0) {   // strings to the ticket's upper corners
        ctx.strokeStyle = rgba(P.halo2, .6); ctx.lineWidth = 1.6; const hh = TK.w * .45 * sy / 2, len = STR * attach;
        for (const c of [-.42, .42]) { ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(lerp(ex, x + c * TK.w, attach), lerp(ey, y - hh, attach) - (1 - attach) * 0 + 0 * len); ctx.stroke(); }
      }
      ctx.save(); ctx.translate(x, y); ctx.scale(1, sy);
      if (sd < 0) ticketOld(ctx, 0, 0, TK.w, rot, { glow: .35 }); else ticketNew(ctx, 0, 0, TK.w, rot, { glow: .6 + .15 * (.5 + .5 * Math.sin(t * 1.2)) });
      ctx.restore();
      const lab = sd < 0 ? ['PUBLIC HELP', a.pubh] : ['CONDITION', a.cond];
      label(ctx, [[lab[0], 34]], x, y + TK.w * .45 * sy / 2 + 62, span(t, lab[1] - .15, lab[1] + .55), { align: 'center' });
    });
    ctx.restore();
  }
  function cardFront(ctx, x, y, w, rot, txt, lum = 1) {
    const k = w / K.measure(txt, 30, false) / (1 + 56 / K.measure(txt, 30, false)), h = CARD_H * k;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    const p = new Path2D(); p.roundRect(-w / 2, -h / 2, w, h, w * .04); B.paperFill(ctx, p, { lum, seed: 2009 });
    ctx.fillStyle = rgba(COL.ink, .88); ctx.textAlign = 'center'; ctx.font = `600 ${30 * k}px Inter`; ctx.fillText(txt, 0, h * .17);
    ctx.restore();
  }
  // the 2009 card: lifts, flies at the camera, flips; its back is the pension letter, which fills the frame at tSw
  function flyingCard(ctx, t) {
    if (t < tLift) return;
    const z0 = Math.exp(lnA(tLift)), p0 = [960 + (cardX(1) - 960) * z0, 500 + (CARD_Y - 500) * z0], w0 = CARD_W * z0;
    const x = herm(t, tLift, tSw, p0[0], 960, 0, 0), y = herm(t, tLift, tSw, p0[1], 540, -500, 0);
    const w = Math.exp(herm(t, tLift, tSw, Math.log(w0), Math.log(LET.w * S_LET), 0, 0)), rot = herm(t, tLift, tSw, 0, LET.rot, 0, 0);
    const u = sramp(t, tLift + .2, tLift + .75), c = Math.cos(Math.PI * u), sx = Math.max(.02, Math.abs(c));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx, 1);
    if (c >= 0) cardFront(ctx, 0, 0, w, 0, '2009', 1);
    else letterFace(ctx, w, w * 1.29, t, .42);
    ctx.restore();
    const g = Math.max(0, 1 - Math.abs(c) * 4); if (g > 0) halo(ctx, x, y, w * .6 * g, .35 * g, P.halo0, P.core0);
  }
  // the pension letter (local, centred): header, lines, a climbing line that falls on "crash" (cool, never red)
  function letterFace(ctx, w, h, t, lum) {
    const p = new Path2D(); p.rect(-w / 2, -h / 2, w, h);
    B.paperFill(ctx, p, { lum, seed: 565, lx: -w * .2, ly: -h * .3, r: h });
    ctx.save(); ctx.textAlign = 'left';
    ctx.fillStyle = rgba(COL.ink, .85); ctx.font = `600 ${Math.max(1, w * .075)}px Inter`; ctx.fillText('YOUR PENSION', -w * .4, -h * .36);
    ctx.fillStyle = rgba(COL.ink2, .45); ctx.fillRect(-w * .4, -h * .33, w * .8, Math.max(1, h * .004));
    for (let i = 0; i < 4; i++) ctx.fillRect(-w * .4, -h * .28 + i * h * .045, w * (.7 - (i % 2) * .25), Math.max(1, h * .012));
    const cr = expoOut(span(t, a.crash - .05, a.crash + .6)), pts = [];
    for (let i = 0; i <= 30; i++) { const k = i / 30; let v = .15 + .55 * k + .04 * Math.sin(i * 1.7); if (k > .82) v -= cr * (k - .82) / .18 * .62; pts.push([-w * .38 + w * .76 * k, h * .32 - v * h * .42]); }
    ctx.strokeStyle = rgba(COL.ink2, .35); ctx.lineWidth = Math.max(1, w * .004); ctx.beginPath(); ctx.moveTo(-w * .38, h * .32); ctx.lineTo(w * .38, h * .32); ctx.stroke();
    B.inkLine(ctx, pts.slice(0, 26), 1, { col: COL.ink, w: Math.max(1.2, w * .012) });
    B.inkLine(ctx, pts.slice(25), 1, { col: mixHex(COL.ink, COL.loss, cr), w: Math.max(1.2, w * .012) });
    ctx.restore();
  }

  // ================================================================================================ the room
  function room(ctx, t) {
    const lamp = 1 + .02 * Math.sin(t * 1.7);
    // the wall with the window cut out (the outside shows through)
    const wall = new Path2D(); wall.rect(-3000, -2000, 8000, 5000); wall.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
    ctx.fillStyle = lin(ctx, 0, -200, 0, 1100, [[0, P.night1], [.6, mixHex(P.ind2, P.night1, .4)], [1, P.night1]]); ctx.fill(wall, 'evenodd');
    ctx.save(); ctx.clip(wall, 'evenodd'); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, LAMP.x, LAMP.y + 40, 900 * lamp, [[0, rgba(P.halo1, .5)], [.3, rgba(P.shade0, .26)], [.75, rgba(P.shade1, .06)], [1, rgba(P.shade1, 0)]]); ctx.fillRect(-3000, -2000, 8000, 5000);
    ctx.restore();
    // window frame + sill
    ctx.strokeStyle = P.night0; ctx.lineWidth = 14; ctx.strokeRect(WIN.x0 - 7, WIN.y0 - 7, WIN.x1 - WIN.x0 + 14, WIN.y1 - WIN.y0 + 14);
    ctx.fillStyle = mixHex(P.ind2, P.shade0, .25); ctx.fillRect(WIN.x0 - 26, WIN.y1 + 7, WIN.x1 - WIN.x0 + 52, 10);
    // the lamp (THE light of the room)
    ctx.strokeStyle = P.night0; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LAMP.x, -2000); ctx.lineTo(LAMP.x, LAMP.y - 16); ctx.stroke();
    ctx.fillStyle = lin(ctx, 0, LAMP.y - 16, 0, LAMP.y + 14, [[0, mixHex(P.ind2, P.shade0, .25)], [1, mixHex(P.night1, P.shade0, .5)]]);
    ctx.beginPath(); ctx.moveTo(LAMP.x - 18, LAMP.y - 16); ctx.lineTo(LAMP.x + 18, LAMP.y - 16); ctx.lineTo(LAMP.x + 48, LAMP.y + 14); ctx.lineTo(LAMP.x - 48, LAMP.y + 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = P.core0; ctx.beginPath(); ctx.ellipse(LAMP.x, LAMP.y + 15, 26, 6, 0, 0, 6.29); ctx.fill();
    halo(ctx, LAMP.x, LAMP.y + 18, 230 * lamp, .6, P.halo1, P.core0);
    // you (hood down at home), the letter in one hand, the ticket in the other
    const br = .5 + .5 * Math.sin(t * 1.3);
    E.du(ctx, DU.x, DU.y, DU.h, { dir: 1, light: -1, hood: false, look: .12 + .05 * Math.sin(t * .5) + .25 * ramp(t, a.counts, a.goodE + .5) * (1 - ramp(t, a.notafter, a.notafter + 1.5)), lean: .02 + .006 * br, armL: ARM_L, armR: ARM_R });
    const ly = .8 * Math.sin(t * 1.3) * ramp(t, tSw + 1, tSw + 3);
    ctx.save(); ctx.translate(LET.x, LET.y + ly); ctx.rotate(LET.rot); letterFace(ctx, LET.w, LET.h, t, .42 + .45 * ramp(t, tSw + 1.2, tSw + 3.5)); ctx.restore();
    const glow = .25 + .7 * ramp(t, a.seat - .2, a.seat + .6);
    ticketNew(ctx, TKT.x, TKT.y + ly, TKT.w, TKT.rot, { glow });
    if (glow > .3) halo(ctx, TKT.x, TKT.y, 220, .3 * (glow - .25), P.halo1, P.core0);
    // the table: a top seen a little from above, an apron, two legs (you stand behind it)
    ctx.fillStyle = lin(ctx, 0, TABLE_Y - 30, 0, TABLE_Y, [[0, mixHex(P.ind2, P.shade0, .3)], [1, mixHex(P.ind2, P.shade0, .45)]]);
    ctx.beginPath(); ctx.moveTo(520, TABLE_Y - 30); ctx.lineTo(1120, TABLE_Y - 30); ctx.lineTo(1150, TABLE_Y); ctx.lineTo(490, TABLE_Y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, TABLE_Y, 0, TABLE_Y + 70, [[0, mixHex(P.ind2, P.shade1, .25)], [1, P.night1]]); ctx.fillRect(490, TABLE_Y, 660, 56);
    ctx.fillStyle = P.night1; ctx.fillRect(510, TABLE_Y + 56, 22, 260); ctx.fillRect(1108, TABLE_Y + 56, 22, 260);
    ctx.fillStyle = rgba(P.halo1, .45); ctx.fillRect(490, TABLE_Y - 1, 660, 2);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .3); ctx.fillRect(-3000, TABLE_Y + 300, 8000, 2000);                 // the floor
    ctx.fillStyle = rgba(P.shade0, .2); ctx.fillRect(-3000, TABLE_Y + 300, 8000, 2);
    tags(ctx, t, ly);
  }
  // two tags unfold from the ticket: GOOD ENOUGH? · PRICE? (they swing; again on "comments")
  function tags(ctx, t, ly) {
    const A = [TKT.x + TKT.w * .42, TKT.y + ly + 18];
    [['GOOD ENOUGH?', a.goodE, 92, .1], ['PRICE?', a.price, 168, -.12]].forEach(([txt, t0, len, a0]) => {
      const u = sramp(t, t0 - .25, t0 + .35); if (u <= 0) return;
      const sw = (.32 * Math.exp(-Math.max(0, t - t0) * 1.4) * Math.sin(5 * (t - t0))) + .14 * bump(t, a.comments - .1, a.comments + 2.4) * Math.sin(3.2 * (t - a.comments)) + .02 * Math.sin(t * 1.1 + len);
      ctx.save(); ctx.translate(A[0], A[1]); ctx.rotate(a0 + sw);
      const L = len * u; ctx.strokeStyle = rgba(P.halo2, .75); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, L); ctx.stroke();
      ctx.font = '600 28px Inter'; const tw = ctx.measureText(txt).width + 40, th = 48;
      ctx.translate(0, L); ctx.scale(u, u);
      const p = new Path2D(); p.moveTo(-14, 0); p.lineTo(tw - 14, 0); p.lineTo(tw - 14, th); p.lineTo(-14, th); p.closePath();
      ctx.rotate(-.04); B.paperFill(ctx, p, { lum: .95, seed: 573 + len });
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(2, 10, 4, 0, 6.29); ctx.fill();
      ctx.fillStyle = rgba(COL.ink, .9); ctx.textAlign = 'left'; ctx.fillText(txt, 14, 35);
      ctx.restore();
    });
  }

  // ================================================================================================ outside (Davos → the timeline)
  function outside(ctx, t, s) {
    if (t < tOut) {   // its own ground (the plate's ground once we are out)
      ctx.fillStyle = lin(ctx, 0, GY, 0, GY + 400, [[0, mixHex(P.ind1, P.night1, .45)], [.4, P.night1], [1, P.night0]]); ctx.fillRect(HWC[0] - 6000, GY, 14000, 3000);
      ctx.fillStyle = rgba(P.blue0, .4); ctx.fillRect(HWC[0] - 6000, GY - 1, 14000, 2);
    }
    // the mountains behind the hall
    const rp = new Path2D(); rp.moveTo(RIDGE[0][0], GY); for (const [x, y] of RIDGE) rp.lineTo(x, y); rp.lineTo(RIDGE[RIDGE.length - 1][0], GY); rp.closePath();
    ctx.fillStyle = lin(ctx, 0, GY - 450, 0, GY, [[0, mixHex(P.ind1, P.blue1, .35)], [1, P.night1]]); ctx.fill(rp);
    ctx.save(); ctx.clip(rp); ctx.fillStyle = rgba(P.cream, .16); RIDGE.forEach(([x, y], i) => { if (i % 2 && i < RIDGE.length - 1) { ctx.beginPath(); ctx.moveTo(x - 60, y + 70); ctx.lineTo(x, y); ctx.lineTo(x + 60, y + 70); ctx.closePath(); ctx.fill(); } }); ctx.restore();
    hall(ctx, t);
    // the timeline (lights, plateaus, the line), the data center rising, the bubble
    const lit = t >= a.evenly - .3;
    if (lit) perez(ctx, t, {
      lx: t < a.econ - .2 ? -1e9 : lx(t), gold: ramp(t, a.golden - .1, a.golden + .9), rules: ramp(t, a.rules - .05, a.rules + .7),
      spike: sramp(t, tSpk0, tSpk1),
      dots: (i, x) => span(t, dotT(x) - .8, dotT(x)), dotPos: (i, x, u) => [lerp(HWC[0], x, u), lerp(HWC[1] + 70, GY - 5, u) - 140 * Math.sin(Math.PI * u)],
    });
    if (t > a.econ - .2 && t < tg) { const xx = lx(t), yy = lineY(xx); halo(ctx, xx, yy, 120, .8, P.halo1, P.core0); }
    else if (t >= tg && t < tBub0 + .3) { const sp = sramp(t, tSpk0, tSpk1); halo(ctx, PZ.spikeX, lerp(GY, PZ.spikeTop, sp), 120, .8 * (1 - span(t, tBub0, tBub0 + .3)), P.halo1, P.core0); }
    bwDC(ctx, t, sramp(t, tBub0 - .4, tPlate - .1));
    if (t >= tBub0) { const u = expoOut(span(t, tBub0, tBub1)) * .985 + .015 * span(t, tBub0, tBub1), r = BB.r * u; B.bubble(ctx, BB.x, PZ.spikeTop - r, r, t, { tremble: .25 * u }); }
    snow(ctx, t);
  }
  function lineY(x) { for (let i = 1; i < PZ_PATH.length; i++) { const [x0, y0] = PZ_PATH[i - 1], [x1, y1] = PZ_PATH[i]; if (x <= x1) return lerp(y0, y1, clamp((x - x0) / Math.max(1e-6, x1 - x0))); } return GY; }
  function hall(ctx, t) {
    if (t > a.golden + 2) return;
    const [cx, cy] = HWC, x0 = cx - 430, x1 = cx + 430, top = cy - 230;
    ctx.fillStyle = lin(ctx, 0, top, 0, GY, [[0, mixHex(P.ind2, P.blue1, .3)], [1, P.night1]]); ctx.fillRect(x0, top, x1 - x0, GY - top);
    ctx.fillStyle = rgba(P.cream, .55); ctx.fillRect(x0 - 10, top - 12, x1 - x0 + 20, 14);                     // snow on the roof
    ctx.fillStyle = rgba(P.night0, .5); for (let i = 0; i < 9; i++) { const xx = x0 + 30 + i * 92; if (Math.abs(xx + 30 - cx) < 200) continue; ctx.fillRect(xx, top + 40, 60, 26); ctx.fillRect(xx, GY - 120, 60, 26); }
    // the lit window, the lectern (the hero light)
    const wx0 = cx - 160, wx1 = cx + 160, wy0 = cy - 130, wy1 = cy + 130;
    const spread = ramp(t, a.evenly - .2, a.evenly + 1.2), lum = 1 - .45 * spread;
    ctx.fillStyle = lin(ctx, 0, wy0, 0, wy1, [[0, mixHex(P.ind2, P.shade0, .45 * lum)], [1, mixHex(P.night1, P.shade0, .3 * lum)]]); ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.beginPath(); ctx.moveTo(cx - 34, wy1); ctx.lineTo(cx + 34, wy1); ctx.lineTo(cx + 46, cy + 30); ctx.lineTo(cx - 46, cy + 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.halo1, .8 * lum); ctx.fillRect(cx - 46, cy + 30, 92, 3);
    ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(cx + 22, cy + 18, 5, 0, 6.29); ctx.fill();
    halo(ctx, cx, cy + 20, 300, .6 * lum, P.halo1, P.core0);
    ctx.strokeStyle = P.night0; ctx.lineWidth = 10; ctx.strokeRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
    ctx.fillStyle = rgba(P.cream, .5); ctx.fillRect(wx0 - 14, wy1 + 4, wx1 - wx0 + 28, 7);
    E.lightPool(ctx, wx0 + 20, wx1 - 20, GY + 2, 80, 70, .35 * lum);
  }
  function snow(ctx, t) {
    const cut = a.econ - 1;
    ctx.fillStyle = P.cream;
    for (const [x, v, off, r, ph] of FLAKES) {
      const yy = ((t * v + off) % 1100), tc = t - yy / v; if (tc > cut) continue;
      ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(x + 14 * Math.sin(t * .7 + ph), HWC[1] - 600 + yy, r, 0, 6.29); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ================================================================================================ type (screen)
  function texts(ctx, t) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t > a.davos - .3 && t < a.forthis + .6) {
      const out = span(t, a.forthis - .4, a.forthis + .3);
      label(ctx, [['DAVOS · JANUARY 2026', 34]], 150, 200, span(t, a.davos - .2, a.davos + .5), { out });
      label(ctx, [['SATYA NADELLA · MICROSOFT', 34]], 150, 252, span(t, a.satya - .1, a.satya + .6), { out });
    }
    if (t > a.forthis && t < a.econ + .6) {   // a label, not a quote (the wording is not yet checked against the WEF video)
      const out = span(t, a.econ - .3, a.econ + .4);
      label(ctx, [["NADELLA'S TEST", 34], ['BENEFITS MUCH MORE EVENLY SPREAD', 34]], 150, 200, span(t, a.forthis + .2, a.forthis + 1.2), { out });
    }
    if (t > a.perez - .3 && t < a.society + .7) label(ctx, [['CARLOTA PEREZ', 34], ['TECHNOLOGICAL REVOLUTIONS AND FINANCIAL CAPITAL', 26]], 150, 200, span(t, a.perez - .1, a.perez + .8), { out: span(t, a.society - .3, a.society + .5) });
    ctx.restore();
  }
}
