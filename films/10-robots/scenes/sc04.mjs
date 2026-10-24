// Film 10 · c04 · "Wollen wir das? / erste Rechnung" (02a + 02b start) · 192.20–246.78 s · night · ★ 4.06 (you sit with her)
// Editorial-Nacht (lib/f10_editorial.mjs) + B2 helpers (lib/f10_c04_b2.mjs) + the shared work/clock/bill/hall stage (lib/f10_c04_hall.mjs).
//
// PLAN (word → picture · hero light · ≤2 moves · carrier)                                                       [EXPL] = explainer
// 192.20 so it's probably coming  out of the kitchen window light (B1 flew in: flood = 1 at the seam), pull back: a house on a hill,
//        the warm window is the hero, a gift box with a bow at the garden gate in its light.                       move: camera out
// 197.16 more robots · easier      [EXPL] the box opens, a robot of light rises (MORE ROBOTS); the bow's ribbon becomes an arrow of light
//        life · Is it?             up to the window (EASIER LIFE); on "Is it?" the last stretch breaks into dots and a ? glows.
//                                  carrier: the arrow → the window · up right · flight INTO the window (flood)
// 200.84 picture your grandmother  inside: out of the lamp light; the kitchen lamp is the hero, grandmother at the table, light on her
//                                  hands; she looks up.                                                            move: camera out
// 202.52 a robot won't care        the robot comes to the door from the cool corridor and stops at the threshold (rim light from the
//        that stays human          lamp), turns away. Light halves: warm kitchen | cool corridor.                   move: robot
// 206.28 laundry … carrying        [EXPL] the robot walks the corridor; at each door an icon of cool light grows (basket, broom, bag,
//                                  box), one bright at a time. carrier: the robot → the camera trucks right.          moves: robot + truck
// 210.52 ★ time to sit with her    you (yellow) walk in from the left with two cups, sit down across from her, set the cups down; her
//                                  hand on yours. The warmest picture of the night. carrier: lamp light → flight INTO the lamp (flood)
// 212.84 heavy … robot hands       [EXPL] (lib/f10_c04_hall.mjs) out of the light of a beam: a person of light bent under the beam;
//                                  the beam slides onto a robot of light. HUMAN HANDS / ROBOT HANDS.
// 217.64 robots for things …       [EXPL] light halves: robot + boxes (cool, FOR THINGS) | two people (warm, FOR PEOPLE)
// 220.68 will we get that time?    [EXPL] the people's light rises into a clock of light; FREE TIME wedge; “MORE TIME FOR YOU!”;
//        mostly … new work         cool blocks of work fill the wedge cell by cell (NEW WORK).
// 228.36 we have to take it        you walk in under the giant clock, look up, reach and take one piece back: it turns warm.
// 232.38 a bill · goes to us       [EXPL] the piece unrolls into a long strip of light: BILL 1 · TO: US · YOUR WORK · YOUR DATA
// 235.82 go back to the hall       the strip becomes the hall window (shape → shape), the camera glides down into the hall (K3)
// 237.98 every time … better       a trainer (indigo, headset) lifts the cup, the robot copies, its tremor shrinks; echoes stay.
// 241.50 better · less needed      [EXPL] the robot's trace lifts off: ROBOT SKILL ↑ (cool) and TRAINER NEEDED ↓ (warm) cross above her.
// 245.82 little money              the curves sink back; a small coin of light lands in her hand. → c05 (same stage, same camera)
// Explainer share (measured as time in [EXPL] beats): see the report; target 60–70 %.
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import { run, wipe, mark, floodK, floodIn, floodOut, sky, house, env } from '../lib/f10_c04_b2.mjs';
import { initHall, hallStage } from '../lib/f10_c04_hall.mjs';
const { W, H, P, F0, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, rgba, mixHex, lin, rad } = E;

export default async function (T, R) {
  E.prepareEditorial();
  const s = (sec, ph, n) => T.S(sec, ph, n);
  const A = {
    start: R.a, probably: s('02a', 'probably'), good: s('02a', 'good news'), more: s('02a', 'More robots'), robots: s('02a', 'robots, easier'), easier: s('02a', 'easier'),
    isit: s('02a', 'Is it'), picture: s('02a', 'Picture your'), grand: s('02a', 'grandmother'), arobot: s('02a', "A robot won't"), care: s('02a', 'care for'),
    stays: s('02a', 'That stays'), human: s('02a', 'stays human') + .3, but: s('02a', 'But it could'), laundry: s('02a', 'laundry'), cleaning: s('02a', 'cleaning'),
    shopping: s('02a', 'shopping'), carrying: s('02a', 'carrying'), so: s('02a', 'So you have'), sit: s('02a', 'sit with'), heavy: s('02a', 'Heavy'),
  };
  const H4 = initHall(T);
  const CUT_KITCHEN = A.picture, CUT_BEAM = H4.in;

  // ===================== stage 1 · the house on the hill, the box at the gate, the promise =====================
  const HS = { x: 1150, y: 600, w: 300, h: 180 };
  const WINH = { x: 1222, y: 452, w: 112, h: 92 }, WC = [WINH.x + WINH.w / 2, WINH.y + WINH.h / 2];
  const BOX = { x: 880, y: 780, w: 118, h: 80 };
  const K1 = [
    [A.start, E.aim(F0, WC[0], WC[1], 60)],
    [A.start + 2.9, E.aim(F0, 1060, 560, 1.0), 'o'],
    [A.isit - .2, E.aim(F0, 1010, 590, 1.1)],
    [CUT_KITCHEN, E.aim(F0, WC[0], WC[1], 60), 'i'],
  ];
  const arrowPts = E.catmull([[BOX.x + 40, BOX.y - 180, 4], [985, 470, 4], [1110, 395, 4], [WINH.x - 18, WINH.y + 30, 4]], 14);
  function stage1(ctx, t) {
    const c = E.camDrift(E.camAt(t, K1), t, .8);
    sky(ctx, c, t, { gx: WC[0], gy: 470, gr: 1200, ga: .6, seed: 21 });
    E.card(ctx, c, 9000, () => E.ground(ctx, [[-600, 640], [200, 600], [900, 645], [1500, 585], [2600, 630]], { stops: [[0, P.ind1], [1, P.night1]], rim: rgba(P.blue0, .7) }));
    E.card(ctx, c, 4200, () => E.ground(ctx, [[-600, 760], [300, 690], [800, 730], [1700, 700], [2600, 740]], { stops: [[0, P.ind0], [1, P.night0]], rim: rgba(P.blue1, .6), rimW: 2 }));
    E.card(ctx, c, F0, () => {
      // the hill with the house; the window light spills down the slope toward the gate
      E.ground(ctx, [[-400, 1020], [300, 930], [700, 820], [1000, 660], [1200, 602], [1600, 592], [2400, 650]], { stops: [[0, P.night1], [1, P.night0]] });
      E.lightPool(ctx, HS.x + 10, HS.x + 230, HS.y + 2, 240, 210, .45);
      ctx.save(); ctx.strokeStyle = rgba(P.halo1, .35); ctx.lineWidth = 3; ctx.setLineDash([1, 10]); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(HS.x + 230, HS.y + 2); ctx.bezierCurveTo(1200, 680, 1000, 700, BOX.x + 70, BOX.y); ctx.stroke(); ctx.restore();
      house(ctx, HS.x, HS.y, HS.w, HS.h, { chimney: true, roof: 112 });
      ctx.fillStyle = rgba(P.blue1, .5); ctx.fillRect(HS.x + 228, HS.y - 92, 44, 92);   // the door, dark
      E.lightForm(ctx, 'window', WINH.x, WINH.y, WINH.w, WINH.h, t, { mullions: [2, 2], dust: 1400, seed: 40 });
      E.halo(ctx, WC[0], WC[1], 520, .18, P.halo1, P.halo2);
      // garden gate + the delivery box with its bow
      for (const gx of [BOX.x - 92, BOX.x + 92]) { ctx.fillStyle = P.night0; ctx.fillRect(gx - 6, BOX.y - 74, 12, 76); ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(gx + 3, BOX.y - 74, 3, 76); }
      const open = smooth(span(t, A.more - .1, A.more + .45));
      const bx = BOX.x - BOX.w / 2, by = BOX.y - BOX.h;
      const body = new Path2D(); body.rect(bx, by, BOX.w, BOX.h);
      ctx.fillStyle = lin(ctx, bx, 0, bx + BOX.w, 0, [[0, P.ind0], [1, mixHex(P.ind1, P.shade0, .3)]]); ctx.fill(body);
      ctx.fillStyle = rgba(P.halo1, .55); ctx.fillRect(bx + BOX.w - 4, by, 4, BOX.h);
      // ribbon: the vertical band stays, the bow unties into the arrow
      const rib = env(t, A.start, A.start + .01, A.more + .1, A.more + .6);
      E.lightShape(ctx, (() => { const p = new Path2D(); p.rect(BOX.x - 7, by, 14, BOX.h); return p; })(), t, { lit: 1, dust: 0, glow: .5, a: .9 });
      ctx.save(); ctx.translate(bx, by); ctx.rotate(-1.15 * open); ctx.fillStyle = mixHex(P.ind1, P.shade0, .25); ctx.fillRect(-4, -14, BOX.w + 8, 16); ctx.restore();   // the lid swings open
      if (rib > 0) { for (const d of [-1, 1]) { const p = new Path2D(); p.ellipse(BOX.x + d * 20, by - 12, 22, 12, d * .5, 0, 6.29); E.lightShape(ctx, p, t, { lit: 1, dust: 0, glow: .6, a: rib }); } }
      // [EXPL] more robots → easier life ... is it?
      const ru = span(t, A.more, A.more + .8);
      if (ru > 0) { E.halo(ctx, BOX.x, by - 40, 180, .3 * expoOut(ru), P.blue0, P.blue0); mark(ctx, 'robot', BOX.x, by - 95 - 60 * expoOut(ru), 150, t, { lit: 0, u: ru, glow: 1.4 }); }
      wipe(ctx, 'MORE ROBOTS', BOX.x, BOX.y + 70, span(t, A.robots, A.robots + .5), { size: 42, align: 'center', glow: false, col: mixHex(P.cream, P.blue2, .2), spacing: .14 });
      const au = span(t, A.robots + .1, A.easier + .4), doubt = smooth(span(t, A.isit, A.isit + .4));
      if (au > 0) {
        const cut = lerp(1, .55, doubt), solid = Math.min(au, cut);
        E.trail(ctx, arrowPts, solid, { w: 4 });
        if (au > cut) {   // the doubt: the last stretch only dotted, flickering
          const i0 = Math.floor(cut * (arrowPts.length - 1)), i1 = Math.floor(au * (arrowPts.length - 1));
          ctx.save(); ctx.setLineDash([2, 16]); ctx.lineCap = 'round'; ctx.strokeStyle = rgba(P.halo0, .55 + .3 * Math.sin(t * 9)); ctx.lineWidth = 6; ctx.beginPath();
          for (let i = i0; i <= i1; i++) (i === i0 ? ctx.moveTo(arrowPts[i][0], arrowPts[i][1]) : ctx.lineTo(arrowPts[i][0], arrowPts[i][1])); ctx.stroke(); ctx.restore();
        }
        if (doubt > 0) mark(ctx, 'question', 1060, 330, 120, t, { lit: 1, u: span(t, A.isit + .1, A.isit + .6), glow: .9 });
      }
      wipe(ctx, 'EASIER LIFE', WC[0] + 10, HS.y - HS.h - 150, span(t, A.easier, A.easier + .5), { size: 42, align: 'center', glow: false, col: P.halo2, spacing: .14 });
    });
    E.lightFlood(ctx, Math.max(floodK(c, F0, WINH.w * 1.5), floodOut(t, R.a, 1.0), floodIn(t, CUT_KITCHEN, .6), t >= CUT_KITCHEN - 1e-3 ? 1 : 0));
  }

  // ===================== stage 2 · the kitchen, the threshold, the corridor, you sit with her =====================
  const LAMP = [700, 300], FLR = 900, TBL = { x0: 525, x1: 880, top: 772 }, DOOR = { x0: 1460, x1: 1590, top: 560 };
  const GM = { x: 598, h: 360 }, DUS = { x: 808, h: 336 };
  const DOORS = [1700, 1880, 2060, 2240], TASK = ['basket', 'broom', 'bag', 'boxup'];
  const RX = [[A.arobot - .3, 1760], [A.care, DOOR.x0 + 66], [A.human, DOOR.x0 + 66], [A.laundry, DOORS[0]], [A.cleaning, DOORS[1]], [A.shopping, DOORS[2]], [A.carrying, DOORS[3]], [A.carrying + 1.2, 2460]];
  const robX = (t) => { if (t <= RX[0][0]) return RX[0][1]; for (let i = 1; i < RX.length; i++) if (t <= RX[i][0]) return lerp(RX[i - 1][1], RX[i][1], sineIO(span(t, RX[i - 1][0], RX[i][0]))); return RX[RX.length - 1][1]; };
  const K2 = [
    [CUT_KITCHEN, E.aim(F0, LAMP[0], LAMP[1] + 4, 60)],
    [CUT_KITCHEN + 1.7, E.aim(F0, 900, 580, 1.0), 'o'],
    [A.but - .2, E.aim(F0, 960, 590, 1.04)],
    [A.carrying + .1, E.aim(F0, 1290, 590, 1.04)],
    [A.sit - .05, E.aim(F0, 880, 600, 1.08)],
    [A.heavy - .3, E.aim(F0, 740, 640, 1.3)],
    [CUT_BEAM, E.aim(F0, LAMP[0], LAMP[1] + 4, 60), 'i'],
  ];
  const cupAt = (ctx, x, y, s = 1) => { ctx.fillStyle = P.cream; ctx.beginPath(); ctx.moveTo(x - 11 * s, y - 24 * s); ctx.lineTo(x + 11 * s, y - 24 * s); ctx.lineTo(x + 9 * s, y); ctx.lineTo(x - 9 * s, y); ctx.closePath(); ctx.fill(); };
  function stage2(ctx, t) {
    const c = E.camDrift(E.camAt(t, K2), t, .7);
    const warmth = 1 + .25 * env(t, A.sit - .3, A.sit + .6);
    // back wall: kitchen warm, corridor cool
    E.card(ctx, c, 2300, () => {
      ctx.fillStyle = lin(ctx, 0, -400, 0, FLR + 300, [[0, P.night0], [.6, P.night1], [1, P.ind0]]); ctx.fillRect(-1500, -1500, 5500, 4000);
      ctx.fillStyle = rad(ctx, 1950, 620, 900, [[0, rgba(P.blue0, .5)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(1400, -400, 2000, 2000);
    });
    E.card(ctx, c, F0, () => {
      // kitchen wash around the lamp
      ctx.fillStyle = rad(ctx, LAMP[0], 560, 760, [[0, rgba(P.blue0, .65)], [.5, rgba(P.blue0, .25)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(-600, -400, 2060, 1600);
      // dividing wall with the door opening; floor
      ctx.fillStyle = P.night1; ctx.fillRect(1440, -400, 20, FLR + 400); ctx.fillRect(1590, -400, 24, FLR + 400); ctx.fillRect(1440, DOOR.top - 40, 174, 40);
      ctx.fillStyle = lin(ctx, 0, FLR, 0, FLR + 260, [[0, P.ind1], [.2, P.ind0], [1, P.night0]]); ctx.fillRect(-1200, FLR, 4200, 600);
      ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-1200, FLR); ctx.lineTo(3000, FLR); ctx.stroke();
      ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(1460, DOOR.top, 3, FLR - DOOR.top);   // lamp light on the door jamb
      // corridor doors, each lights with its task
      DOORS.forEach((dx, i) => {
        const on = [A.laundry, A.cleaning, A.shopping, A.carrying][i], k = span(t, on - .2, on + .3), cur = env(t, on - .2, on + .2, on + .75, on + 1.25);
        const p = new Path2D(); p.rect(dx - 62, FLR - 300, 124, 300);
        ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.fill(p);
        if (k > 0) { E.lightShape(ctx, p, t, { lit: 0, dust: 0, glow: .9, a: .25 + .5 * cur }); }
        ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 3; ctx.strokeRect(dx - 62, FLR - 300, 124, 300);
        if (k > 0) mark(ctx, TASK[i], dx, FLR - 410, 116, t, { lit: 0, u: k, glow: 1.4, a: .55 + .45 * cur });
      });
      // the lamp: cord, shade, the light cone onto the table
      ctx.strokeStyle = P.night0; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(LAMP[0], -600); ctx.lineTo(LAMP[0], LAMP[1] - 46); ctx.stroke();
      ctx.save(); ctx.filter = 'blur(10px)';
      ctx.fillStyle = lin(ctx, 0, LAMP[1], 0, TBL.top + 40, [[0, rgba(P.halo0, .5 * warmth)], [.5, rgba(P.halo1, .26 * warmth)], [1, rgba(P.shade0, .2 * warmth)]]);
      ctx.beginPath(); ctx.moveTo(LAMP[0] - 50, LAMP[1]); ctx.lineTo(LAMP[0] + 50, LAMP[1]); ctx.lineTo(TBL.x1 + 40, TBL.top + 40); ctx.lineTo(TBL.x0 - 40, TBL.top + 40); ctx.closePath(); ctx.fill(); ctx.restore();
      E.lightForm(ctx, 'disc', LAMP[0] - 36, LAMP[1] - 18, 72, 40, t, { dust: 1200, seed: 44, breath: .02 });
      E.halo(ctx, LAMP[0], LAMP[1], 380 * warmth, .3, P.halo1, P.halo2);
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.moveTo(LAMP[0] - 24, LAMP[1] - 46); ctx.lineTo(LAMP[0] + 24, LAMP[1] - 46); ctx.lineTo(LAMP[0] + 66, LAMP[1] - 6); ctx.lineTo(LAMP[0] - 66, LAMP[1] - 6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LAMP[0] - 66, LAMP[1] - 6); ctx.lineTo(LAMP[0] + 66, LAMP[1] - 6); ctx.stroke();
      // the robot: comes to the threshold, stops, turns away, walks the corridor
      const rx = robX(t), turned = t > A.stays + .35, tk = span(t, A.stays + .1, A.stays + .6), flip = turned ? 1 : -1;
      const walking = Math.abs(robX(t + .05) - robX(t - .05)) > 1.5;
      if (t > A.arobot - .35) {
        ctx.save(); const sx = Math.abs(Math.cos(Math.PI * tk)) * .92 + .08; ctx.translate(rx, 0); ctx.scale(sx, 1); ctx.translate(-rx, 0);
        E.robot(ctx, rx, FLR, 330, { dir: flip, light: turned ? -1 : -1, rim: P.halo1, body: P.night1, walk: walking ? rx / 40 : undefined, pose: walking ? 'walk' : 'stand' });
        ctx.restore();
      }
      // grandmother at the table (indigo, a bun), her hands in the light
      const gy = FLR + .2 * GM.h, look = smooth(span(t, A.grand, A.grand + .8)) * .55;
      const reach = smooth(span(t, A.sit + .45, A.sit + 1.1));
      E.person(ctx, GM.x, gy, GM.h, { dir: 1, light: 1, long: true, look, rim: mixHex(P.blue0, P.halo1, .55), armR: [lerp(1.05, 1.32, reach), lerp(1.75, 1.62, reach)], armL: [.9, 1.75] });
      const hy = gy - .885 * GM.h; ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(GM.x - .06 * GM.h, hy - .03 * GM.h, .045 * GM.h, 0, 6.29); ctx.fill();   // the bun
      ctx.fillStyle = rgba(P.blue1, .5); ctx.beginPath(); ctx.arc(GM.x - .05 * GM.h, hy - .05 * GM.h, .018 * GM.h, 0, 6.29); ctx.fill();
      // you: walk in from the left with two cups, sit down across from her (behind the table), set the cups down
      let duHands = null;
      const w0 = A.carrying - .5, w1 = A.sit - .1;
      if (t > w0) {
        const k = span(t, w0, w1), x = lerp(1720, DUS.x, sineIO(k)), sit = smooth(span(t, A.sit - .15, A.sit + .45));
        const yy = FLR + sit * .2 * DUS.h, put = smooth(span(t, A.sit + .15, A.sit + .7));
        const o = k < 1 ? { pose: 'walk', walk: -x / DUS.h * 4.2, dir: -1, light: 1, armR: [.75, 2.35], cup: 'R' }
          : { dir: -1, light: 1, back: .1, armR: [lerp(.75, 1.25, put), lerp(2.35, 1.66, put)], armL: [lerp(.3, 1.2, put), lerp(.2, 1.7, put)], cup: put < .5 ? 'R' : undefined, look: .1 };
        duHands = E.du(ctx, x, yy, DUS.h, o);
        if (put < .5) { const L = duHands.L; cupAt(ctx, L[0], L[1] + 4, .95); }
      }
      // the table: top in the lamp light, a long cloth hides the legs; the cups
      ctx.fillStyle = lin(ctx, 0, TBL.top, 0, FLR + 80, [[0, mixHex(P.ind1, P.shade0, .25)], [.08, P.night1], [1, P.night0]]); ctx.fillRect(TBL.x0, TBL.top, TBL.x1 - TBL.x0, FLR + 120 - TBL.top);
      ctx.fillStyle = lin(ctx, TBL.x0, 0, TBL.x1, 0, [[0, rgba(P.halo1, .5)], [.5, rgba(P.core1, .9)], [1, rgba(P.halo1, .5)]]); ctx.fillRect(TBL.x0 - 6, TBL.top - 5, TBL.x1 - TBL.x0 + 12, 7);
      if (t > A.sit + .45) { cupAt(ctx, 690, TBL.top - 2); cupAt(ctx, 735, TBL.top - 2); }
      // her hand on yours: a small warm glow where they meet
      if (reach > 0) E.halo(ctx, 712, TBL.top - 14, 90, .35 * reach, P.halo0, P.core1);
    });
    E.lightFlood(ctx, Math.max(floodK(c, F0, 72 * 2.2), floodOut(t, CUT_KITCHEN, 1.0), floodIn(t, CUT_BEAM, .6), (t < CUT_KITCHEN + 1e-3 || t >= CUT_BEAM - 1e-3) ? 1 : 0));
  }

  const draw = run([[R.a, stage1], [CUT_KITCHEN, stage2], [CUT_BEAM, hallStage]]);
  return [{ t: R.a, draw, print: { editorial: true } }];
}
