// Film 15 · B3 · c13 (433.36 – 477.56) · YOU, IN THE STREET. The circle of countries sinks and lies down as the pool of a street
// lamp; the medicine docks as the lamp's head; you stand in its light ("closer than it feels"). One calm walk along one street:
// a lab coat on a hook you pass, five waiting people and a window that finds one of them, your slip TEST · BOOKED, the clinic
// window with a row of empty chairs that fill with lights (the trial on the sign above runs faster), the lab window upstairs that
// gets a coin of public money, the contract next to it that gets one line FAIR PRICE (clamped like the HIV price), the line folds
// into a letter and goes into the lit mailbox YOUR REPRESENTATIVE. Hand-off: the whole street lies in compartment 6 of the box (c14).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f15_kit.mjs';
import { card, look, bracket, contract } from './f15_b3_base.mjs';
import { du, person } from './f15_b3_figure.mjs';
import { MED, R0 } from './f15_b3_deal.mjs';
const { P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin, rad, dust, F0 } = E;

export const GY = 2010;                                   // the pavement (focus card)
const HU = 250;                                           // you
const LAMP = { post: 1640, x: MED.x, y: GY - 540, w: 150 };
const COAT = { x: 1950, y: GY - 430 };
const FIVE = [2410, 2505, 2600, 2695, 2790], FOUND = 3;   // the waiting people; the window finds the 4th
const WIN = { x: 2470, y: GY - 520, w: 92, h: 120 };      // the window that finds someone
const CLIN = { x0: 3130, x1: 3800, y0: GY - 330, y1: GY - 60 }, CHAIRS = [3215, 3320, 3425, 3530, 3635, 3740];
const SIGN = { y: GY - 405, x0: 3160, x1: 3780, gates: [3235, 3335, 3650, 3745] };
const LAB = { x: 3200, y: GY - 700, w: 200, h: 230 };
const PAPER = { x: 3500, y: GY - 730, w: 250, h: 280 };
const BOX = { x: 3020, y: GY - 120, w: 160, h: 220 };     // the mailbox (x = centre, y = bottom of the box on its post)
const HOUSES = [[700, 1180, 600], [1240, 2130, 660], [2190, 2880, 600], [2930, 3920, 800], [3980, 4700, 640], [4760, 5600, 580]];

export function makeStreet(a) {
  const tIn = a.everyone + 1.0;                          // the circle starts to sink (≈ 432.3)
  const tSet = a.closer + .25;                           // the camera stands in the street (≈ 435.2)
  // you: x along the pavement (keys), the gait from the distance walked
  const WK = [[0, 1735], [a.coat - .9, 1735], [a.hep + .5, 2255], [a.book + .45, 2255], [a.trial + .5, 2895], [a.END ?? 600, 2895]];
  const youX = (t) => { let i = 0; while (i < WK.length - 2 && t > WK[i + 1][0]) i++; const [t0, x0] = WK[i], [t1, x1] = WK[i + 1]; return lerp(x0, x1, sineIO(span(t, t0, t1))); };
  const youV = (t) => (youX(t + .02) - youX(t - .02)) / .04;
  const DIST = []; { let d = 0; for (let k = 0; k <= 60000; k++) { const t = 425 + k / 120; DIST.push(d); d += Math.abs(youX(t + 1 / 240) - youX(t - 1 / 240)) * 1; } }
  const youD = (t) => DIST[clamp(Math.round((t - 425) * 120), 0, DIST.length - 1)];
  // the letter
  const slipStart = [PAPER.x + PAPER.w / 2, PAPER.y + 196];
  // camera keys (frame centre u, v; scale s)
  const K = [   // calm (mafd): two wide holds on the street, one pan between them, one push into the contract, one move to the mailbox
    [tIn, 1510, 470, .97],
    [tSet + .4, 2080, 1620, .86],
    [a.finds - .3, 2115, 1624, .895],
    [a.book + .5, 2125, 1626, .905],
    [a.trial + .9, 3180, 1610, .93],
    [a.oneline - .5, 3215, 1602, .97],
    [a.contract + .2, 3520, 1470, 1.28],
    [a.tell + .55, 3090, 1655, 1.15],
    [a.there + .3, 3010, 1690, 1.28],
    [a.T2, 3000, 1692, 1.32],
  ];
  // the far city (card Z 6000) sits with its skyline at screen y ≈ 640 when the camera stands in the street
  const ZC = 6000, c0 = look(1745, 1688, 1), m0 = E.cardM(c0, ZC), vH = (640 - m0.f) / m0.k, uL = (-300 - m0.e) / m0.k;
  const c1 = look(3600, 1688, 1), m1 = E.cardM(c1, ZC), uR = (2300 - m1.e) / m1.k;
  const CITY = []; { const r = E.prng(1313); let x = uL; while (x < uR) { const w = 60 + r() * 140, h = 30 + r() * 110; CITY.push([x, w, h, r()]); x += w + 6 + r() * 30; } }

  function far(ctx, c, t) {
    card(ctx, c, ZC, () => {
      ctx.translate(0, 700 * (1 - sineIO(span(t, tIn, tSet + .3))));   // the far city layer comes up with the descent (no pop at tIn)
      // first light behind the far city (pre-dawn): a warm band low on the sky
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, 0, vH - 360, 0, vH + 10, [[0, rgba(P.halo1, 0)], [.7, rgba(P.halo1, .07)], [1, rgba(P.halo0, .2)]]); ctx.fillRect(uL - 400, vH - 360, uR - uL + 800, 370);
      ctx.restore();
      // the far city rises out of the ground as the camera comes down (staggered from the lamp outwards; bodies grow, never fade)
      const rise = (x) => expoOut(span(t, tIn + .2 + Math.abs(x - LAMP.x * .3) * .0009, tIn + 1.6 + Math.abs(x - LAMP.x * .3) * .0009));
      ctx.fillStyle = mixHex(P.night1, P.ind1, .35);
      for (const [x, w, h] of CITY) ctx.fillRect(x, vH - h * rise(x), w, h * rise(x) + 2);
      ctx.fillRect(uL - 400, vH, uR - uL + 800, 1400);
      ctx.fillStyle = rgba(P.blue0, .55); for (const [x, w, h] of CITY) ctx.fillRect(x, vH - h * rise(x), w, 1.5);
      for (const [x, w, h, r] of CITY) if (r > .55 && rise(x) > .9) { ctx.fillStyle = rgba(P.halo1, .55 * span(rise(x), .9, 1)); const n = 1 + Math.floor(r * 3); for (let k = 0; k < n; k++) ctx.fillRect(x + w * (.2 + .25 * k), vH - h * (.35 + .2 * ((k + r * 7) % 2)), 4, 5); }
    });
  }

  function house(ctx, x0, x1, h, t) {
    const top = GY - h;
    ctx.fillStyle = lin(ctx, 0, top, 0, GY, [[0, mixHex(P.ind2, P.blue1, .18)], [.3, P.ind2], [1, P.night1]]); ctx.fillRect(x0, top, x1 - x0, h);
    ctx.fillStyle = rgba(P.blue0, .85); ctx.fillRect(x0, top, x1 - x0, 2.5);   // roof edge catches the sky
    ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(x1 - 10, top, 10, h);     // a little depth at the corner
  }
  // a dark window in a wall (cool pane, thin frame); lit 0..1 turns it warm
  function pane(ctx, x, y, w, h, lit, t) {
    ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fillRect(x, y, w, h);
    if (lit > 0) { ctx.fillStyle = rad(ctx, x + w / 2, y + h * .75, Math.max(w, h), [[0, rgba(P.core1, lit)], [.5, rgba(P.halo0, .85 * lit)], [1, rgba(P.halo1, .6 * lit)]]); ctx.fillRect(x, y, w, h); halo(ctx, x + w / 2, y + h / 2, Math.max(w, h) * 1.1, .25 * lit, P.halo1, P.core1); }
    ctx.strokeStyle = rgba(lit > .3 ? P.halo0 : P.blue0, .8); ctx.lineWidth = 2; ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = rgba(P.night1, .9); ctx.fillRect(x + w / 2 - 1.5, y, 3, h);
  }
  function labCoat(ctx, x, y, t, sway) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(sway);
    // hook + hanger
    ctx.strokeStyle = rgba(P.blue0, .95); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -8, 9, Math.PI, Math.PI * 2.1); ctx.stroke();
    ctx.strokeStyle = mixHex(F.COOL, P.ind2, .3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-58, 22); ctx.lineTo(0, 2); ctx.lineTo(58, 22); ctx.stroke();
    // the coat: shoulders on the hanger, sleeves hanging, an open front with lapels
    const p = new Path2D();
    p.moveTo(-14, 4); p.quadraticCurveTo(-52, 12, -64, 30); p.lineTo(-74, 150); p.lineTo(-60, 152); p.lineTo(-56, 70); p.lineTo(-58, 250); p.quadraticCurveTo(0, 262, 58, 250);
    p.lineTo(56, 70); p.lineTo(60, 152); p.lineTo(74, 150); p.lineTo(64, 30); p.quadraticCurveTo(52, 12, 14, 4); p.closePath();
    ctx.fillStyle = lin(ctx, -70, 0, 70, 0, [[0, mixHex(F.COOL, P.halo1, .35)], [.45, mixHex(F.COOL, P.cream, .25)], [1, mixHex(F.COOL, P.blue1, .5)]]); ctx.fill(p);
    ctx.strokeStyle = rgba(P.blue2, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, 6); ctx.lineTo(-4, 70); ctx.lineTo(-2, 252); ctx.moveTo(14, 6); ctx.lineTo(4, 70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-56, 70); ctx.lineTo(-48, 160); ctx.moveTo(56, 70); ctx.lineTo(48, 160); ctx.stroke();
    ctx.fillStyle = rgba(P.blue2, .55); ctx.fillRect(22, 150, 26, 4);   // a pocket
    ctx.restore();
  }
  // a seated light (a volunteer): small cream light figure, warm halo
  function seated(ctx, x, y, k, t) {
    if (k <= 0) return;
    halo(ctx, x, y - 40, 70 * k, .4 * k, P.halo1, P.core1);
    ctx.fillStyle = mixHex(P.halo0, P.core1, .5);
    const b = new Path2D(); b.roundRect(x - 15 * k, y - 62 * k, 30 * k, 60 * k, 13 * k); ctx.fill(b);
    ctx.beginPath(); ctx.arc(x, y - 74 * k, 12 * k, 0, 6.29); ctx.fill();
  }
  function chair(ctx, x, t) {
    ctx.fillStyle = P.night0; ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2;
    const p = new Path2D(); p.rect(x - 34, GY - 150, 68, 10); p.rect(x + 24, GY - 250, 10, 100); p.rect(x - 32, GY - 140, 6, 80); p.rect(x + 26, GY - 140, 6, 80);
    ctx.fillStyle = mixHex(P.ind2, P.night1, .3); ctx.fill(p); ctx.stroke(p);
  }
  function envelope(ctx, x, y, w, k, t) {   // k 0 = flat strip, 1 = folded letter
    const ew = lerp(w, w * .62, k), eh = lerp(w * .16, w * .4, k);
    const p = new Path2D(); p.rect(x - ew / 2, y - eh / 2, ew, eh);
    E.glowFill(ctx, p, 30, .35, P.halo1);
    ctx.fillStyle = lin(ctx, 0, y - eh / 2, 0, y + eh / 2, [[0, P.core1], [1, P.halo2]]); ctx.fill(p);
    if (k > .2) { const f = span(k, .2, 1); ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - ew / 2, y - eh / 2); ctx.lineTo(x, y - eh / 2 + eh * .55 * f); ctx.lineTo(x + ew / 2, y - eh / 2); ctx.stroke(); }
    if (k < .6) { ctx.save(); ctx.globalAlpha = 1; ctx.font = `600 ${Math.round(w * .085)}px Inter`; ctx.letterSpacing = '0.12em'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = F.INK;
      ctx.beginPath(); ctx.rect(x - ew / 2, y - eh / 2, ew, eh); ctx.clip(); ctx.translate(x, y); ctx.scale(1 - k * 1.2, 1); ctx.fillText('FAIR PRICE', 0, 1); ctx.restore(); }
  }

  function draw(ctx, t, c) {
    far(ctx, c, t);
    card(ctx, c, F0, () => focus(ctx, t));
  }

  function focus(ctx, t) {
    const uIn = sineIO(span(t, tIn, tSet));
    // ---------- houses, windows
    for (const [x0, x1, h] of HOUSES) house(ctx, x0, x1, h, t);
    // scattered windows in the other houses (quiet: dim warm or cool)
    for (const [x, y, l] of [[820, GY - 470, .5], [1010, GY - 330, 0], [1380, GY - 520, 0], [1560, GY - 330, .45], [2300, GY - 330, 0], [2720, GY - 500, 0], [4100, GY - 480, .4], [4380, GY - 300, 0], [4560, GY - 480, 0], [4900, GY - 420, .35]]) pane(ctx, x, y, 78, 100, l * (.9 + .1 * Math.sin(t * .7 + x)), t);
    // the window that finds someone
    const winL = expoOut(span(t, a.cureworks + .9, a.finds - .1));
    pane(ctx, WIN.x, WIN.y, WIN.w, WIN.h, .15 + .85 * winL, t);
    // the clinic: ground-floor window with chairs, the trial sign, upstairs the lab window and the wall for the contract
    {
      ctx.fillStyle = lin(ctx, 0, CLIN.y0, 0, CLIN.y1, [[0, mixHex(P.ind1, P.blue1, .35)], [1, mixHex(P.ind1, P.night1, .3)]]); ctx.fillRect(CLIN.x0, CLIN.y0, CLIN.x1 - CLIN.x0, CLIN.y1 - CLIN.y0);
      ctx.fillStyle = rad(ctx, (CLIN.x0 + CLIN.x1) / 2, CLIN.y0 - 40, 520, [[0, rgba(F.COOL, .28)], [1, rgba(F.COOL, 0)]]); ctx.fillRect(CLIN.x0, CLIN.y0, CLIN.x1 - CLIN.x0, CLIN.y1 - CLIN.y0);
      ctx.save(); ctx.beginPath(); ctx.rect(CLIN.x0, CLIN.y0, CLIN.x1 - CLIN.x0, CLIN.y1 - CLIN.y0); ctx.clip();
      ctx.fillStyle = rgba(P.night1, .8); ctx.fillRect(CLIN.x0, CLIN.y1 - 6, CLIN.x1 - CLIN.x0, 6);
      CHAIRS.forEach((x) => chair(ctx, x, t));
      // the volunteers: your slip becomes the first light; the others come in from the left on "volunteer"
      for (let k = 0; k < CHAIRS.length; k++) {
        if (k === 0) { const kk = expoOut(span(t, a.trial - .1, a.trial + .5)); seated(ctx, CHAIRS[0] - 4, GY - 146, kk, t); continue; }
        const s0 = a.volunteer - .25 + .38 * (k - 1), u = span(t, s0, s0 + .8 + .06 * k);
        if (u <= 0) continue;
        const x = lerp(CLIN.x0 - 40, CHAIRS[k] - 4, sineIO(u)), y = GY - 146 - 26 * Math.sin(Math.PI * u) * (1 - u);
        seated(ctx, x, y, smooth(span(u, 0, .25)), t);
      }
      ctx.restore();
      ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 3; ctx.strokeRect(CLIN.x0, CLIN.y0, CLIN.x1 - CLIN.x0, CLIN.y1 - CLIN.y0);
      // the trial sign: a small path of light with four gates; the long stretch is the trial
      const capX = (() => {
        const creep = lerp(SIGN.gates[1] + 30, SIGN.gates[1] + 70, span(t, a.trial - 1, a.volunteer));
        return lerp(creep, SIGN.x1 - 18, quartIO(span(t, a.volunteer + .2, a.faster + .6)));
      })();
      const sLine = []; for (let x = SIGN.x0; x <= SIGN.x1; x += 10) sLine.push([x, SIGN.y, 1.6]);
      F.trailSpan(ctx, sLine, 0, 1, { w: 1.6, spark: false, a: .9 });
      const passed = (gx) => expoOut(span(capX, gx - 6, gx + 20));
      SIGN.gates.forEach((gx, i) => { const lit = i < 2 ? 1 : passed(gx); const g = new Path2D(); g.moveTo(gx - 14, SIGN.y); g.lineTo(gx - 14, SIGN.y - 30); g.arc(gx, SIGN.y - 30, 14, Math.PI, 0); g.lineTo(gx + 14, SIGN.y); E.lightShape(ctx, g.stroke({ width: 4, cap: 1, join: 1 }), t, { lit, dust: 0, glow: .3 }); });
      // the slow stretch shows cool until it is passed
      ctx.save(); ctx.strokeStyle = rgba(F.COOL, .9); ctx.lineWidth = 3; ctx.setLineDash([2, 9]); ctx.beginPath(); ctx.moveTo(Math.max(capX + 20, SIGN.gates[1] + 18), SIGN.y); ctx.lineTo(SIGN.gates[2] - 18, SIGN.y); if (capX < SIGN.gates[2] - 30) ctx.stroke(); ctx.restore();
      F.pill(ctx, capX, SIGN.y - 9, 38, t, { lit: [1, .4] });
      const uTr = span(t, a.slowest - .3, a.slowest + .6);
      if (uTr > 0) F.maskLine(ctx, [['TRIALS', 0]], (SIGN.gates[1] + SIGN.gates[2]) / 2, SIGN.y + 38, 26, uTr, { serif: false, align: 'center', col: P.cream, glow: false, weight: 600 });
      // upstairs: the lab window (lights when the coin lands)
      const impact = a.money + .32, labL = (.3 + .7 * expoOut(span(t, impact + .05, impact + .7))) * (1 - .55 * smooth(span(t, a.oneline - .3, a.oneline + .6)));
      pane(ctx, LAB.x, LAB.y, LAB.w, LAB.h, labL, t);
      // the coin of public money falls into it and rests on the sill
      const cu = span(t, a.public - .25, impact);
      if (cu > 0) {
        const y = cu < 1 ? lerp(LAB.y - 900, LAB.y + LAB.h - 30, cu * cu) : LAB.y + LAB.h - 30 - 10 * Math.sin(Math.PI * span(t, impact, impact + .35));
        ctx.save(); ctx.translate(LAB.x + LAB.w / 2, y); ctx.scale(Math.max(.15, Math.abs(Math.cos(t * 5 * (1 - span(t, impact, impact + .5))))), 1);
        E.icon(ctx, 'coin', 0, 0, 58, t, { lit: 1, dust: 0 }); ctx.restore();
        if (cu >= 1) halo(ctx, LAB.x + LAB.w / 2, LAB.y + LAB.h - 30, 120, .5 * Math.exp(-(t - impact) * 1.5), P.halo1, P.core0);
      }
    }
    // the contract next to the lab window: unfolds on "discovery", one line FAIR PRICE, the clamp on "HIV"
    {
      const uC = span(t, a.money + .6, a.money + 1.4);
      const fair = span(t, a.fair - .1, a.fair + .6), one = smooth(span(t, a.oneline - .3, a.oneline + .5));
      const lift = sineIO(span(t, a.contract - .05, a.contract + .7));
      if (uC > 0) {
        ctx.save(); ctx.fillStyle = P.core0; ctx.beginPath(); ctx.arc(PAPER.x + PAPER.w / 2, PAPER.y + 14, 5, 0, 6.29); ctx.fill(); ctx.restore();
        contract(ctx, PAPER.x, PAPER.y, PAPER.w, PAPER.h, t, {
          u: uC, dim: .55 * one,
          scribble: [{ y: 52, w: .9 }, { y: 70, w: .75 }, { y: 88, w: .85 }, { y: 106, w: .6 }, { y: 124, w: .8 }, { y: 228, w: .7 }, { y: 246, w: .5 }].map((s) => ({ ...s, u: span(uC, .4, 1) })),
          lines: lift < 1 ? [{ s: 'FAIR PRICE', y: 186 + lift * 0, u: fair, size: 28, hi: one * (1 - lift) }] : [],
        });
        const uB = expoOut(span(t, a.hiv - .35, a.hiv + .05)) * (1 - span(t, a.contract - .1, a.contract + .2));
        if (uB > 0) {
          const xl = PAPER.x + 26 - 30 * (1 - uB), xr = PAPER.x + PAPER.w - 26 + 30 * (1 - uB), y0 = PAPER.y + 154, y1 = PAPER.y + 200, ym = (y0 + y1) / 2, hh = (y1 - y0) / 2 * (.4 + .6 * uB);
          bracket(ctx, xl, ym - hh, ym + hh, -1, 14 * uB, t, { w: 5 }); bracket(ctx, xr, ym - hh, ym + hh, 1, 14 * uB, t, { w: 5 });
          const fl = Math.sin(Math.PI * span(t, a.hiv - .02, a.hiv + .4)); if (fl > 0) halo(ctx, PAPER.x + PAPER.w / 2, ym, 160, .35 * fl, P.halo1, P.core0);
        }
      }
    }

    // ---------- the pavement, the lamp
    ctx.fillStyle = lin(ctx, 0, GY, 0, GY + 500, [[0, P.ind2], [.1, P.night1], [1, P.night0]]); ctx.fillRect(0, GY, 6000, 900);
    ctx.fillStyle = lin(ctx, 300, 0, 5600, 0, [[0, rgba(P.blue0, .6)], [.25, rgba(P.halo1, .5)], [.33, rgba(P.blue0, .8)], [1, rgba(P.blue0, .6)]]); ctx.fillRect(0, GY - 1, 6000, 3);
    // the lamp post (dark) with its arm; the head is the medicine (docks while the circle lies down)
    {
      const g = sineIO(span(t, tIn + .6, tSet - .2));
      ctx.fillStyle = lin(ctx, LAMP.post - 8, 0, LAMP.post + 8, 0, [[0, P.night0], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .5)]]);
      ctx.fillRect(LAMP.post - 7, GY - 560, 14, 560);
      ctx.strokeStyle = P.ind2; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(LAMP.post, GY - 556); ctx.quadraticCurveTo(LAMP.post + 10, GY - 600, LAMP.x, GY - 580); ctx.lineTo(LAMP.x, GY - 560 + 4); ctx.stroke();
      ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(LAMP.post + 7, GY); ctx.lineTo(LAMP.post + 7, GY - 556); ctx.stroke();
      // the cone and the pool (they swell as the circle lies down)
      const cone = g, cp = new Path2D(); cp.moveTo(LAMP.x - 40, LAMP.y + 8); cp.lineTo(LAMP.x + 40, LAMP.y + 8); cp.lineTo(LAMP.x + 270, GY + 8); cp.lineTo(LAMP.x - 270, GY + 8); cp.closePath();
      if (cone > 0) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(18px)';
        ctx.fillStyle = lin(ctx, 0, LAMP.y, 0, GY, [[0, rgba(P.halo1, .2 * cone)], [.7, rgba(P.halo1, .12 * cone)], [1, rgba(P.halo0, .26 * cone)]]); ctx.fill(cp); ctx.restore();
        E.dust(ctx, 1333, 500, LAMP.x, (LAMP.y + GY) / 2, 120, 200, t, .45 * cone, P.halo2);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(LAMP.x, GY + 4); ctx.scale(1, .13);
        ctx.fillStyle = rad(ctx, 0, 0, 330, [[0, rgba(P.halo1, .6 * cone)], [.55, rgba(P.halo1, .2 * cone)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 330, 0, 6.29); ctx.fill(); ctx.restore();
      }
    }
    // the circle of countries lies down into the pool; the medicine flies down and becomes the lamp's head
    if (t < tSet + 1.2) {
      const u = uIn, cy = lerp(MED.y, GY + 4, u), rx = lerp(R0, 250, u), sq = lerp(.98, .13, u);
      const n = 40, kk = 1 - smooth(span(t, tSet - .4, tSet + 1.2));
      if (kk > 0) {   // the ring line lies down with them and widens into the rim of the pool
        ctx.save(); ctx.strokeStyle = rgba(P.halo0, .8 * kk); ctx.lineWidth = lerp(1.6, 2.4, u); ctx.beginPath(); ctx.ellipse(MED.x, cy, rx, R0 * sq, 0, 0, 6.29); ctx.stroke(); ctx.restore();
      }
      for (let i = 0; i < n; i++) {
        const th = Math.PI + 2 * Math.PI * (i / n) * .985 + u * .6, x = MED.x + Math.cos(th) * rx, y = cy + Math.sin(th) * R0 * sq;
        const r = lerp(7.5, 3, u) * kk; if (r <= .2) continue;
        halo(ctx, x, y, 46 * lerp(1, .5, u) * kk, .45 * kk, P.halo1, P.core1);
        ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
      }
    }
    {
      const u = uIn, w = Math.exp(lerp(Math.log(MED.w), Math.log(LAMP.w), u)), y = lerp(MED.y, LAMP.y, u) - 2 * Math.sin(t * 1.3) * (1 - u);
      if (t >= tIn) {
        F.pill(ctx, LAMP.x, y, w, t, { lit: [1, 1], rot: lerp(-.08, 0, u) + .01 * Math.sin(t * .8) * (1 - u), dust: u < .5 ? 900 : 0 });
        halo(ctx, LAMP.x, y, w * 1.6, lerp(.3, .45, u), P.halo1, P.core1);
      }
    }

    // ---------- the lab coat on its hook (you walk past it)
    labCoat(ctx, COAT.x, COAT.y, t, .015 * Math.sin(t * .9) + .04 * Math.sin(Math.PI * span(t, a.labcoat - .2, a.coat + .9)) * Math.exp(-2 * Math.max(0, t - a.coat)));

    // ---------- the five who wait; the window's beam finds one (warm cream: reached)
    const beam = expoOut(span(t, a.finds - .35, a.finds + .45));
    FIVE.forEach((x, i) => {
      const found = i === FOUND ? beam : 0;
      person(ctx, x, GY, 228 + (i % 2) * 10, { dir: i < 2 ? 1 : -1, view: 'side', light: -1, rim: found > .3 ? mixHex(P.blue0, P.core1, found) : undefined, back: .6 * found, look: i === FOUND ? .25 * found : .05 });
    });
    if (beam > 0) {
      const sx = WIN.x + WIN.w / 2, sy = WIN.y + WIN.h * .6, tx = FIVE[FOUND], ty = GY - 120;
      const ex = lerp(sx, tx, beam), ey = lerp(sy, ty + 120, beam);
      const p = new Path2D(); p.moveTo(sx - 30, sy); p.lineTo(sx + 30, sy); p.lineTo(ex + 80 * beam, ey); p.lineTo(ex - 80 * beam, ey); p.closePath();
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(10px)'; ctx.fillStyle = lin(ctx, sx, sy, ex, ey, [[0, rgba(P.halo1, .35)], [1, rgba(P.halo0, .18)]]); ctx.fill(p); ctx.restore();
      halo(ctx, tx, GY - 120, 180 * beam, .3 * beam, P.halo1, P.core1);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(tx, GY + 4); ctx.scale(1, .14); ctx.fillStyle = rad(ctx, 0, 0, 160, [[0, rgba(P.halo1, .5 * beam)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 160, 0, 6.29); ctx.fill(); ctx.restore();
    }

    // ---------- the mailbox (its slot lights when you have something to post)
    const slot = expoOut(span(t, a.tell - .2, a.tell + .5)), flare = Math.exp(-Math.max(0, t - (a.there + .05)) * 2.2) * (t > a.there ? 1 : 0);
    {
      const bx = BOX.x - BOX.w / 2, by = BOX.y - BOX.h;
      ctx.fillStyle = P.ind2; ctx.fillRect(BOX.x - 9, BOX.y, 18, GY - BOX.y);
      const bp = new Path2D(); bp.roundRect(bx, by, BOX.w, BOX.h, [40, 40, 6, 6]);
      ctx.fillStyle = lin(ctx, bx, 0, bx + BOX.w, 0, [[0, P.night1], [.6, P.ind2], [1, mixHex(P.ind2, P.blue1, .5)]]); ctx.fill(bp);
      ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2.5; ctx.stroke(bp);
      const sp = new Path2D(); sp.roundRect(BOX.x - 50, by + 54, 100, 12, 6);
      ctx.fillStyle = P.night0; ctx.fill(sp);
      if (slot > 0) { ctx.fillStyle = mixHex(P.halo1, P.core0, .6 * slot + .4 * flare); ctx.globalAlpha = 1; ctx.fill(sp); halo(ctx, BOX.x, by + 60, 120 + 120 * flare, .4 * slot + .5 * flare, P.halo1, P.core0);
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(BOX.x, GY + 4); ctx.scale(1, .14); ctx.fillStyle = rad(ctx, 0, 0, 220, [[0, rgba(P.halo1, .35 * slot)], [1, rgba(P.halo1, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 220, 0, 6.29); ctx.fill(); ctx.restore(); }
      const uLb = span(t, a.vote - .5, a.vote + .3);
      if (uLb > 0) F.paperLabel(ctx, 'YOUR REPRESENTATIVE', BOX.x, by - 34, { size: 22, u: uLb, lit: slot });
    }

    // ---------- you
    const x = youX(t), v = youV(t), st = clamp(Math.abs(v) / 150), ph = youD(t) * .0315;
    const sw = Math.sin(ph) * st;
    const raise = sineIO(span(t, a.test - .35, a.test + .35)) * (1 - sineIO(span(t, a.book + .5, a.book + 1.1)));
    const take = sineIO(span(t, a.tell - .3, a.tell + .4)), post = sineIO(span(t, a.vote + .3, a.there + .05)), down = sineIO(span(t, a.there + .3, a.there + 1.1));
    let armR = [-.42 * sw, -.42 * sw + .3], armL = [.42 * sw, .42 * sw + .3];
    const up = [2.45, 2.6], fwd = [1.25, 1.75], slotArm = [1.95, 2.05];
    const lerpA = (A, B, k) => [lerp(A[0], B[0], k), lerp(A[1], B[1], k)];
    armR = lerpA(armR, up, raise);
    armR = lerpA(armR, fwd, take * (1 - post)); armR = lerpA(armR, slotArm, post * (1 - down)); armR = lerpA(armR, [.2, .1], down * take);
    const lookUp = .35 * sineIO(span(t, a.you - .2, a.closer + .6)) * (1 - sineIO(span(t, a.labcoat - .6, a.labcoat))) + .3 * sineIO(span(t, a.public, a.money + .6)) * (1 - sineIO(span(t, a.tell - .5, a.tell)));
    E.castShadow(ctx, x, GY + 2, 26, 120, Math.PI - .3, .4);
    const hands = du(ctx, x, GY, HU, { dir: 1, walk: ph, stride: st, view: 'side', armR, armL, look: clamp(lookUp + .08 * raise), light: -1, rim: mixHex(P.coat, P.core1, .6) });
    // your slip TEST · BOOKED (unfolds above your raised hand; then it flies into the clinic and becomes the first volunteer)
    const uSl = span(t, a.book - .3, a.book + .45), fly = sineIO(span(t, a.book + .9, a.trial - .05));
    if (uSl > 0 && fly < 1) {
      const hx = hands.R[0], hy = hands.R[1] - 34;
      const p0 = [hx + 10, hy], p3 = [CHAIRS[0] - 4, GY - 200];
      const px = lerp(p0[0], p3[0], fly), py = lerp(p0[1], p3[1], fly) - 120 * Math.sin(Math.PI * fly);
      const k = (1 - smooth(span(fly, .7, 1))) * expoOut(span(t, a.book - .32, a.book + .15));   // grows out of your hand, shrinks into the chair
      ctx.save(); ctx.translate(px, py); ctx.scale(k, k); F.paperLabel(ctx, 'TEST · BOOKED', 0, 0, { size: 24, u: uSl, lit: .5, rot: -.03 + .05 * fly }); ctx.restore();
    }
    // the one line: lifts off the contract as a strip, folds into a letter, floats down into your hand, into the slot
    const lift = sineIO(span(t, a.contract - .05, a.contract + .7));
    if (lift > 0) {
      const fall = sineIO(span(t, a.contract + .5, a.tell + .45)), fold = smooth(span(t, a.contract + .4, a.tell - .1));
      const pHand = [hands.R[0] + 14, hands.R[1] - 10], pSlot = [BOX.x, BOX.y - BOX.h + 60];
      let p = [lerp(slipStart[0], slipStart[0] + 40, lift), lerp(slipStart[1], slipStart[1] - 30, lift)];
      if (fall > 0) p = [lerp(p[0], pHand[0], fall) - 60 * Math.sin(Math.PI * fall), lerp(p[1], pHand[1], fall)];
      if (t > a.tell + .45) p = pHand;
      const into = sineIO(span(t, a.vote + .5, a.there + .05));
      if (into > 0) p = [lerp(pHand[0], pSlot[0], into), lerp(pHand[1], pSlot[1], into) + 30 * span(into, .8, 1)];
      if (into < 1) {
        ctx.save(); if (into > .75) { ctx.beginPath(); ctx.rect(-9999, -9999, 30000, 9999 + pSlot[1]); ctx.clip(); }
        envelope(ctx, p[0], p[1], 210, fold, t); ctx.restore();
      }
    }
  }
  return { draw, far, K, focus, tIn, tSet };
}
