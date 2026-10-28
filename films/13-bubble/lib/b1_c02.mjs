// Film 13 · B1 · c02 "The mania" (56.86 'In a Yorkshire parsonage' → 110.26 'But one thing didn't vanish'), one take.
// docs/shots.md 2.01–2.09. Worlds, all carried:
//   D  (T0 … ~59)   the A1 door slit (plateSlit, received from c01): the camera keeps its push, the slit widens, the leaves part and
//                   leave the frame; through the gap: the parsonage on the moor at night, its lit window exactly where the slit was.
//   M  (… ~60.8)    the moor: one long fly-in to the lit window (three sisters as silhouettes inside), through it into the room.
//   R  (… ~93)      the room: three sisters at the table, the candle (hero). Labels, the ledger, ★ the letter ("…ere it be too late."),
//                   the fold, Emily's hand on the share; its top edge lifts into the RAILWAY SHARE INDEX (−64 %): the share's paper
//                   IS the value, two thirds of it empty out (loss blue).
//   S  (… ~97.5)    the lost paper falls as sheets into savers' hands under one lamp (camera follows down).
//   N  (… 110.26)   the camera flies into one held sheet (paper fills the frame) and out of the Glasgow Argus page from c01 (the
//                   underlined line, no quote). CHARLES MACKAY · EDITOR; the page flips: his book. Light leaves the book and wanders
//                   to Charlotte's letter beside the candle; the ink line under "too late" runs right: the c03 horizon (A2).
// All times are phrase anchors (a.*, lib/b1_take.mjs).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './base_kit.mjs';
import * as B from './bubble_kit.mjs';
import * as S from './bubble_seams.mjs';
import * as U from './b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, cam3, camAt, camDrift, aim, project, F0, lin, rad, halo, prng } = E;
const { COL } = B;
const { rise } = U;

// ------------------------------------------------------------------------------------------------ layout
// the house card (moor) and the room card behind it (seen through the lit window, then entered)
const ZW = F0, ZR = 3400, ZG = 1250;
const WIN = { x: 1120, y: 560, w: 92, h: 134 };                           // the lit window on the house card
const RX0 = 960 + (WIN.x - 960) / 2, RY0 = 540 + (WIN.y - 540) / 2;          // room (960,540) sits on the room card here (camera x,y = window)
const roomT = (ctx) => { ctx.translate(RX0, RY0); ctx.scale(.5, .5); ctx.translate(-960, -540); };
export const roomAim = (u, v, m, sx = W / 2, sy = H / 2) => aim(ZR, RX0 + (u - 960) * .5, RY0 + (v - 540) * .5, 2 * m, sx, sy);
// room design (1920×1080 at m = 1)
const EDGE = 612;                                                           // the table's far edge
const SIS = { C: { x: 560, h: 300, seed: 1, light: 1 }, E: { x: 960, h: 312, seed: 2, light: 1 }, A: { x: 1370, h: 296, seed: 3, light: -1 } };
const CAND = { x: 1170, y: 704, h: 124 };
const LET = { x: 470, y: 838, w: 280, rot: -.035 };                          // Charlotte's letter
const LEDG = { x: 905, y: 790, w: 250, rot: .02 };
const CERT = { x: 1225, y: 880, w: 280, rot: .055 };
const SHEETJ = { x: 268, y: 736, w: 128, rot: -.14 }, SHEETW = { x: 690, y: 962, w: 136, rot: .1 };
// the index chart grows out of the share (in room coords: on the share's own rect)
const CH = (() => { const w = CERT.w, h = w * .66, c = Math.cos(CERT.rot), s = Math.sin(CERT.rot); return { w, h, c, s }; })();
const IDX = [[0, .78], [.07, .86], [.15, .97], [.2, 1], [.27, .95], [.36, .87], [.45, .82], [.55, .7], [.64, .6], [.74, .5], [.84, .42], [.92, .38], [1, .36]];
// savers' hands (world S, below the table in room coords)
const HANDS = [[300, 1720, 'baker', -.18, 1.06], [690, 1760, 'parson', .06, 1], [1080, 1730, 'apron', -.05, 1.04], [1480, 1750, 'clerk', .16, .98]];
// the Argus table (world N): the page from c01, Mackay's book in its place after the flip, the letter + candle to the right
const NEWS = { x: 260, y: 40, w: 760, h: 930 }, UL = { x0: 260 + 760 * .066, x1: 260 + 760 * .37, y: 40 + 930 * .41 };
const BOOK = { x: 640, y: 520, w: 470, h: 640 };
const LET2 = { x: 1420, y: 560, w: 520, rot: 0 }, CAND2 = { x: 1780, y: 420, h: 120 };
// the underline under "too late" (letter-local): it runs on to the right and becomes the c03 horizon (A2). Measured once at build.
const L2 = (() => { const w = LET2.w, h = w * 1.18, sz = 40, ly = -h * .26 + 6 * h * .085 + 8; return { w, h, sz, ly, ul: ly + 10 }; })();

// ------------------------------------------------------------------------------------------------ the take
export function build(a) {
  const T0 = a.T0, tS = T0 + S.SEAM_HALF;
  // D: the door keeps the plate's push and then flies through its own gap
  const tD = tS + 1.05;
  const doorS = (t) => S.PLATE_S * S.plateZoom(t, T0) * Math.exp(Math.log(7) * smooth(span(t, tS, tD)) ** 1.7);
  const doorOpen = (t) => lerp(S.TRAIN.slit, 1, sineIO(span(t, tS + .04, tD - .3)));
  // M → R: one fly-in from the slit position to the room (camera x,y = the window centre when it passes the wall)
  const tIn1 = a.inherit + .7;
  const flyE = (u) => .1 * u + .9 * sineIO(u ** 1.15);
  const camM0 = aim(ZW, WIN.x, WIN.y, .3, S.SLIT.x, S.SLIT.y), camR0 = roomAim(960, 600, 1.12);
  // room keys: settle, labels (wide), ledger (Emily + Charlotte), ★ the letter, fold + pull to the share, the chart
  const tLet = a.january - .25, tLet1 = a.late + 1.0;
  const KR = [
    [tIn1, camR0, flyE],
    [a.within + .6, roomAim(960, 565, 1.16)],
    [a.emilyRuns + 1.6, roomAim(800, 655, 1.32), 'q'],
    [a.nervous + .5, roomAim(780, 650, 1.35)],
    [a.january + 1.9, roomAim(LET.x + 20, LET.y - 18, 3.0, 960, 540), 'q'],
    [tLet1 + .6, roomAim(LET.x + 46, LET.y - 20, 3.08, 960, 540)],
    [a.hold + .2, roomAim(CERT.x - 70, CERT.y - 20, 1.9, 960, 580), 'q'],
    [a.bursts - .3, roomAim(CERT.x - 30, CERT.y - 30, 2.05, 960, 600)],
    [a.e1849 + .2, roomAim(CERT.x + 6, CERT.y - 42, 3.15, 960, 640), 'q'],
    [a.small - .1, roomAim(CERT.x + 6, CERT.y - 40, 3.22, 960, 640)],
    [a.holding + .25, roomAim(890, 1590, 1.5, 960, 540), 'q'],
  ];
  const camR = (t) => {
    if (t < tIn1) {
      // one fly-in: log-distance eased; outside the wall the window is held on a screen point that glides from the slit to the
      // centre (so the camera passes the wall exactly through the window), inside it tilts to the room's aim
      const u = flyE(clamp((t - tS) / (tIn1 - tS))), z = ZR - Math.exp(lerp(Math.log(ZR - camM0.z), Math.log(ZR - camR0.z), u));
      if (z < ZW) {
        const g = sineIO(clamp((z - camM0.z) / (ZW - 60 - camM0.z)) ** .7), sx = lerp(S.SLIT.x, W / 2, g), sy = lerp(S.SLIT.y, H / 2, g);
        return E.cam3({ x: (WIN.x - W / 2) - (sx - W / 2) * (ZW - z) / F0, y: (WIN.y - H / 2) - (sy - H / 2) * (ZW - z) / F0, z });
      }
      const v = sineIO(clamp((z - ZW) / (camR0.z - ZW)));
      return E.cam3({ x: lerp(WIN.x - W / 2, camR0.x, v), y: lerp(WIN.y - H / 2, camR0.y, v), z });
    }
    return camDrift(camAt(t, KR, ZR), t, .45 * smooth(span(t, tIn1, tIn1 + 1.5)), 3);
  };
  // S: the lost paper falls into savers' hands; the camera follows down, then flies into one sheet (paper fills the frame)
  const tFall0 = a.small - .35, tHold = a.holding, tFly0 = a.holding + .55, tPaper = a.expert + .55;
  const SHEETS = (() => { const r = prng(2071), out = []; for (let i = 0; i < 4; i++) out.push({ u: .12 + i * .25 + (r() - .5) * .06, v: .2 + r() * .25, spin: (r() - .5) * 2, sw: .6 + r() * .5, dt: i * .09 }); return out; })();
  const holdSheet = (i, t) => {
    // falls from its place in the emptied band to the hand HANDS[i] (room coords); tumbles; lands ~ "holding"
    const h = HANDS[i], sh = SHEETS[i], u = sineIO(span(t, tFall0 + sh.dt, tHold - .1 + sh.dt * .5));
    const p0 = chartPt(sh.u, lerp(1, IDX[IDX.length - 1][1], .5)), p1 = [h[0] + 10, h[1] - 190 * h[4]];
    const x = lerp(p0[0], p1[0], u) + 70 * Math.sin(u * 7 + i) * (1 - u), y = lerp(p0[1], p1[1], u * u * .4 + u * .6);
    const rot = (1 - u) * .7 * Math.sin(u * 6 + sh.spin) + h[3] * .5, ph = Math.PI / 2 + u * 2 * Math.PI * (2 + Math.round(sh.sw)), sx = u <= 0 ? 0 : u < 1 ? Math.cos(ph) * (1 - u) + u : 1;
    return { x, y, rot, sx, w: lerp(60, 210, sineIO(u)) };
  };
  const flyTarget = 1;   // the parson's sheet (centre-left)
  const FLY_M = 9.4;     // the whole share fills the frame (the paper match into world N)
  const SP_END = holdSheet(flyTarget, tHold + 3);
  const camFly1 = roomAim(SP_END.x, SP_END.y, FLY_M, 960, 540);
  // world N's share: the same sheet, the same screen size and angle at tPaper (identical frames: the paper match)
  const CN = { x: 1150, y: 930, w: 330, rot: SP_END.rot };
  const camN0 = aim(F0, CN.x, CN.y, SP_END.w * FLY_M / CN.w, 960, 540);
  // N: the Argus page from the paper; Mackay; the flip into his book; the light wanders to the letter; the underline runs right
  const tOut1 = a.fear + .9;
  // the end of c02: the underline under "too late" (on "didn't"), then the line runs on into the empty margin; the camera flies into
  // the paper after it and lands (tP) 12× close: the frame is paper (B.paperPlate, screen space) with the ink line at y = 700. c03
  // starts from exactly this frame (the paper cut of MOTION §5 #4) and floods it into the dawn valley (A2).
  const tP = a.c03 + .05, MP = 12;
  const ulX0 = -L2.w * .4 + U.measureItalic('…ere it be ', L2.sz), ulX1 = -L2.w * .4 + U.measureItalic('…ere it be too late', L2.sz);
  const xc = ulX1 + 90, yc = L2.ul - (700 - 540) / MP;
  const camP = aim(F0, LET2.x + xc, LET2.y + yc, MP, 960, 540);
  const tUl0 = a.didntW - .05, tUl1 = a.didntW + .45, vRun = (xc + 45 - ulX1) / (tP - tUl1);
  const headLocal = (t) => t < tUl1 ? lerp(ulX0, ulX1, sineIO(span(t, tUl0, tUl1))) : ulX1 + vRun * (t - tUl1) * Math.min(1, .35 + .65 * span(t, tUl1, tUl1 + .5));
  // the head in screen x for t ≥ tP (c03 keeps drawing the line from the same function)
  const headX = (t) => 960 + (headLocal(t) - xc) * MP;
  const KN = [
    [tPaper, camN0],
    [tOut1, aim(F0, 820, 470, 1.06, 960, 540), (u) => sineIO(1 - (1 - u) ** 1.6)],
    [a.mackay + 1.6, aim(F0, 640, 480, .92, 960, 540)],
    [a.book + 1.2, aim(F0, 700, 500, .98, 960, 540)],
    [a.missed + .2, aim(F0, 820, 500, 1.04, 960, 540)],
    [a.didnt - .4, aim(F0, 1360, 540, 1.12, 960, 540), 'q'],
    [tP, camP, (u) => sineIO(u ** 1.2)],
  ];
  const camN = (t) => camDrift(camAt(t, KN), t, .4 * smooth(span(t, tPaper, tOut1 + 1.2)) * (1 - smooth(span(t, tP - 1.6, tP - .2))), 7);

  // ============================================================================================== draw
  const draw = function draw(ctx, t) {
    if (t < tS) { S.plateSlit(ctx, t, T0); return; }
    if (t < tPaper) {
      worldMR(ctx, t, camSav(t));
      if (t < tD) door(ctx, t);
      return;
    }
    worldN(ctx, t);
  };
  draw.tP = tP; draw.headX = headX; draw.lineW = 2.5 * MP;
  return draw;

  function camSav(t) {
    if (t < tFly0) return camR(t);
    // fly into the held sheet of HANDS[flyTarget] until the whole share fills the frame (tPaper)
    const u = span(t, tFly0, tPaper);
    return camAt(u, [[0, camR(tFly0)], [1, camFly1, (x) => sineIO(x) * .55 + (1 - (1 - x) ** 2) * .45]], ZR);
  }

  // ---------------------------------------------------------------------------------------------- D: the door
  function door(ctx, t) {
    const s = doorS(t), op = doorOpen(t), TR = S.TRAIN;
    const dw = TR.h * .42, dx = TR.doorX, dyT = TR.y - TR.h * .12 - TR.h + TR.h * .12, dyB = TR.y - TR.h * .12 - 2;
    const M = [s, 0, 0, s, S.SLIT.x - s * TR.doorX, S.SLIT.y - s * TR.doorY];
    const fm = 4 * smooth(span(op, .55, 1)), ow = dw * op + 2 * fm, r0 = [M[4] + (dx - ow / 2) * s, M[5] + (dyT - fm) * s, ow * s, (dyB - dyT + 2 * fm) * s];
    if (r0[0] < -40 && r0[0] + r0[2] > W + 40 && r0[1] < -40 && r0[1] + r0[3] > H + 40) return;
    // everything of the plate except the opening (the moor shows through it)
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const cl = new Path2D(); cl.rect(-10, -10, W + 20, H + 20); cl.rect(r0[0], r0[1], r0[2], r0[3]); ctx.clip(cl, 'evenodd');
    ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
    ctx.setTransform(...M);
    B.train(ctx, TR.nose, TR.y, TR.len, TR.h, t, { dir: 1, door: TR.slit, doorFromNose: TR.doorFromNose, doorX: TR.doorFromNose });
    ctx.restore();
    // the slit's own light thins out to the window behind it (the plate's door light, identical at tS)
    const k = 1 - smooth(span(t, tS, tS + .8));
    if (k > 0) {
      ctx.save(); ctx.setTransform(...M); ctx.globalAlpha = k;
      ctx.fillStyle = E.lin(ctx, 0, dyT, 0, dyB, [[0, P.core1], [.5, P.halo0], [1, P.halo1]]); ctx.fillRect(dx - dw * TR.slit / 2, dyT, dw * TR.slit, dyB - dyT);
      ctx.restore();
    }
    // the slit life (breathing light + motes) goes on and gives way to the window glow
    const kl = 1 - smooth(span(t, tS, tD - .3));
    if (kl > 0) S.slitLife(ctx, S.SLIT.x, S.SLIT.y, s / S.PLATE_S, t, kl);
    // the door edges: a thin warm rim on the leaves' inner edges while they part
    if (op < .995) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba(P.halo1, .5 * (1 - k * .5)); ctx.fillRect(r0[0] - 2, r0[1], 3, r0[3]); ctx.fillRect(r0[0] + r0[2] - 1, r0[1], 3, r0[3]); ctx.restore(); }
  }

  // ---------------------------------------------------------------------------------------------- M + R (+ S): moor, room, savers
  function worldMR(ctx, t, c) {
    const outside = c.z < ZW - 30;
    if (outside) {
      card(ctx, c, 40000, () => {
        E.nightSky(ctx, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind1, P.night1, .4)]], -2600, H + 900);
        E.stars(ctx, 202, 160, t, [-2400, -2600, W + 4800, 2600], .5);
        clouds(ctx, t);
      });
      card(ctx, c, 9000, () => E.ground(ctx, [[-4200, 770], [-1800, 690], [300, 640], [1500, 700], [2600, 660], [6200, 720]], { stops: [[0, P.ind1], [1, P.night1]], rim: rgba(P.blue0, .45), rimW: 3, bottom: 5000 }));
      card(ctx, c, 4000, () => E.ground(ctx, [[-3200, 800], [-900, 760], [700, 790], [2000, 742], [4800, 800]], { stops: [[0, mixHex(P.ind1, P.night1, .5)], [1, P.night0]], rim: rgba(P.blue0, .3), rimW: 2, bottom: 5000 }));
      // the room, only through the window
      const p0 = project(c, ZW, WIN.x - WIN.w / 2, WIN.y - WIN.h / 2), p1 = project(c, ZW, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2);
      ctx.save(); ctx.beginPath(); ctx.rect(p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]); ctx.clip();
      card(ctx, c, ZR, () => { roomT(ctx); room(ctx, t); });
      ctx.restore();
      card(ctx, c, ZW, (k) => house(ctx, t, k));
      card(ctx, c, ZG, () => grass(ctx, t));
    } else {
      card(ctx, c, ZR, () => { roomT(ctx); room(ctx, t); savers(ctx, t); });
    }
  }

  function clouds(ctx, t) {
    // long dark cloud banks drift right (the wind over the moor); a paler edge where the moon (off frame) catches them
    const CL = [[-1400, 120, 2600, 120, .7], [600, 300, 2200, 90, .55], [-300, -260, 3000, 150, .6], [2300, 40, 2000, 110, .5]];
    for (const [x, y, w, h, a2] of CL) {
      const xx = x + t * 14;
      ctx.fillStyle = E.lin(ctx, 0, y - h, 0, y + h, [[0, rgba(P.blue1, .0)], [.35, rgba(P.blue1, .22 * a2)], [.5, rgba(P.ind1, .55 * a2)], [1, rgba(P.night0, 0)]]);
      ctx.beginPath(); ctx.ellipse(xx, y, w / 2, h, 0, 0, 6.29); ctx.fill();
    }
  }

  function house(ctx, t, k) {
    // the parsonage: a plain Georgian stone house, two storeys, five bays, a door in the middle; one window lit (the dining room)
    const x0 = 560, x1 = 1440, top = 300, gnd = 770;
    const body = new Path2D(); body.rect(x0, top, x1 - x0, gnd - top);
    body.moveTo(x0 - 20, top); body.lineTo(x0 + 120, top - 110); body.lineTo(x1 - 120, top - 110); body.lineTo(x1 + 20, top); body.closePath();
    body.rect(x0 + 40, top - 200, 60, 110); body.rect(x1 - 100, top - 200, 60, 110);   // chimneys
    const win = new Path2D(); win.rect(WIN.x - WIN.w / 2, WIN.y - WIN.h / 2, WIN.w, WIN.h);
    // the window's light on the night (behind the house edge) and on the ground
    halo(ctx, WIN.x, WIN.y, 520, .22, P.halo1, P.halo0);
    ctx.save();
    const bp = new Path2D(); bp.rect(x0, top, x1 - x0, gnd - top);   // (no addPath: it joins the subpaths with a stray line)
    bp.moveTo(x0 - 20, top); bp.lineTo(x0 + 120, top - 110); bp.lineTo(x1 - 120, top - 110); bp.lineTo(x1 + 20, top); bp.closePath();
    bp.rect(x0 + 40, top - 200, 60, 90); bp.rect(x1 - 100, top - 200, 60, 90); bp.rect(WIN.x - WIN.w / 2, WIN.y - WIN.h / 2, WIN.w, WIN.h);
    ctx.fillStyle = E.lin(ctx, 0, top - 200, 0, gnd, [[0, mixHex(P.ind2, P.blue1, .25)], [.3, P.ind2], [1, P.night1]]); ctx.fill(bp, 'evenodd');
    ctx.fillStyle = rgba(P.blue0, .5); ctx.fillRect(x0 - 20, top - 1, x1 - x0 + 40, 3); ctx.fillRect(x0 + 40, top - 200, 60, 2); ctx.fillRect(x1 - 100, top - 200, 60, 2);
    // the warm light from the lit window on the stone around it
    ctx.save(); ctx.clip(bp, 'evenodd'); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, WIN.x, WIN.y + 20, 260, [[0, rgba(P.halo1, .1)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(WIN.x - 300, WIN.y - 300, 600, 600); ctx.restore();
    // the dark windows (four of five bays per floor), the door
    for (const wx of [700, 860, 1120, 1280, 960].slice(0, 5)) for (const wy of [400, WIN.y]) {
      if (wx === WIN.x && wy === WIN.y) continue;
      if (wx === 960 && wy === WIN.y) { ctx.fillStyle = P.night0; ctx.fillRect(960 - 40, WIN.y - 60, 80, gnd - WIN.y + 60); continue; }
      ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(wx - WIN.w / 2 + 6, wy - WIN.h / 2 + 6, WIN.w - 12, WIN.h - 12);
      ctx.fillStyle = rgba(P.blue1, .25); ctx.fillRect(wx - WIN.w / 2 + 6, wy - WIN.h / 2 + 6, WIN.w - 12, 3);
    }
    // the lit window's sash bars (2 × 3 panes) and its sill
    ctx.strokeStyle = mixHex(P.night1, P.shade0, .25); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(WIN.x, WIN.y - WIN.h / 2); ctx.lineTo(WIN.x, WIN.y + WIN.h / 2);
    for (const f of [1 / 3, 2 / 3]) { ctx.moveTo(WIN.x - WIN.w / 2, WIN.y - WIN.h / 2 + WIN.h * f); ctx.lineTo(WIN.x + WIN.w / 2, WIN.y - WIN.h / 2 + WIN.h * f); }
    ctx.stroke(); ctx.lineWidth = 6; ctx.strokeRect(WIN.x - WIN.w / 2, WIN.y - WIN.h / 2, WIN.w, WIN.h);
    ctx.fillStyle = rgba(P.halo1, .45); ctx.fillRect(WIN.x - WIN.w / 2 - 4, WIN.y + WIN.h / 2 + 2, WIN.w + 8, 2.5);
    ctx.restore();
    // the ground of the moor in front, the light pool under the window, a low garden wall, two bare trees bending in the wind
    ctx.fillStyle = E.lin(ctx, 0, gnd, 0, gnd + 900, [[0, mixHex(P.ind1, P.night1, .55)], [.3, P.night1], [1, P.night0]]); ctx.fillRect(-3000, gnd, 8000, 2400);
    ctx.fillStyle = rgba(P.blue0, .35); ctx.fillRect(-3000, gnd, 8000, 2);
    E.lightPool(ctx, WIN.x - 70, WIN.x + 70, gnd + 4, 90, 150, .32);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(320, gnd - 40, 1360, 46); ctx.fillStyle = rgba(P.blue0, .35); ctx.fillRect(320, gnd - 41, 1360, 2);
    for (const [tx, th, ph] of [[300, 420, 0], [1680, 360, 2]]) tree(ctx, tx, gnd - 30, th, t, ph);
  }

  function tree(ctx, x, y, h, t, ph) {
    const sway = .025 * Math.sin(t * 1.1 + ph) + .012 * Math.sin(t * 2.7 + ph);
    ctx.save(); ctx.strokeStyle = mixHex(P.night0, P.ind1, .4); ctx.lineCap = 'round';
    const br = (x0, y0, ang, len, w, d) => {
      const a2 = ang + sway * (4 - d) * .5, x1 = x0 + Math.sin(a2) * len, y1 = y0 - Math.cos(a2) * len;
      ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      if (d < 4) { br(x1, y1, a2 - .45, len * .7, w * .62, d + 1); br(x1, y1, a2 + .38, len * .66, w * .6, d + 1); }
    };
    br(x, y, .08, h * .38, h * .05, 0); ctx.restore();
  }

  function grass(ctx, t) {
    // tufts of moor grass along the bottom, bent by the wind (they pass under the camera as it flies in)
    ctx.save(); ctx.strokeStyle = mixHex(P.night0, P.ind1, .55); ctx.lineCap = 'round';
    const r = prng(77);
    for (let i = 0; i < 70; i++) {
      const x = -900 + i * 55 + r() * 30, y = 1150 + r() * 60, h = 70 + r() * 90, ph = r() * 6;
      const bend = 22 + 14 * Math.sin(t * 1.6 + x * .004 + ph) + 6 * Math.sin(t * 3.7 + ph);
      ctx.lineWidth = 3 + r() * 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + bend * .3, y - h * .6, x + bend, y - h); ctx.stroke();
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------------------------------------- the room (design at m = 1)
  function room(ctx, t) {
    const candleOn = 1;
    // back wall: dark, warm around the candle
    ctx.fillStyle = E.lin(ctx, 0, -400, 0, EDGE, [[0, P.night0], [1, mixHex(P.night1, P.ind2, .6)]]); ctx.fillRect(-1600, -1400, 5200, EDGE + 1400);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const fl = 1 + .02 * Math.sin(t * 5.3) * Math.sin(t * 1.9);
    ctx.fillStyle = rad(ctx, CAND.x, CAND.y - 120, 1000 * fl, [[0, rgba(P.shade0, .42)], [.3, rgba(P.shade1, .12)], [1, rgba(P.shade1, 0)]]); ctx.fillRect(-1600, -1400, 5200, 4400);
    ctx.restore();
    // the sisters (bodies behind the table's far edge)
    const p = poses(t);
    for (const k of ['C', 'E', 'A']) U.seatedWoman(ctx, SIS[k].x, EDGE + 6, SIS[k].h, t, { ...p[k], seed: SIS[k].seed, light: SIS[k].light, pass: 'body' });
    // the table: dark wood, lit by the candle (a pool), its far edge lit
    ctx.fillStyle = E.lin(ctx, 0, EDGE, 0, 1700, [[0, mixHex(P.night1, P.shade1, .22)], [.4, mixHex(P.night0, P.shade1, .12)], [1, P.night0]]); ctx.fillRect(-1600, EDGE, 5200, 1100);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, CAND.x, CAND.y + 20, 820 * fl, [[0, rgba(P.halo1, .34)], [.25, rgba(P.shade0, .14)], [.7, rgba(P.shade1, .03)], [1, rgba(P.shade1, 0)]]); ctx.fillRect(-1600, EDGE, 5200, 1100);
    ctx.restore();
    ctx.fillStyle = rgba(P.halo1, .45); ctx.fillRect(-1600, EDGE - 1, 5200, 3);
    // the things on the table
    letterOnTable(ctx, t);
    const pen = U.ledger(ctx, LEDG.x, LEDG.y, LEDG.w, LEDG.rot, smooth(span(t, a.emilyRuns - .2, a.cgets + .2)) * .75 + .25 * smooth(span(t, a.inherit, a.machine)), { lum: .9 });
    shareAndIndex(ctx, t);
    books(ctx, t);
    // the arms of the sisters on the table
    p.E.hand = [[-.13, .27], emilyHand(t, pen)];
    for (const k of ['C', 'E', 'A']) U.seatedWoman(ctx, SIS[k].x, EDGE + 6, SIS[k].h, t, { ...p[k], seed: SIS[k].seed, light: SIS[k].light, pass: 'arms' });
    U.candle(ctx, CAND.x, CAND.y, CAND.h, t, { lum: candleOn, flick: .35 });
    labels(ctx, t);
  }

  function poses(t) {
    const lean = smooth(span(t, a.nervous - .25, a.nervous + .9)) * (1 - smooth(span(t, a.january - .2, a.january + .9)));
    return {
      C: { lean, look: -.4 * smooth(span(t, a.butShe, a.sister + .6)), hand: [[-.1, .3], [.14, .32]] },
      E: { write: smooth(span(t, a.emilyRuns - .2, a.emilyRuns + .3)) * (1 - smooth(span(t, a.cgets + .2, a.nervous))), writeSide: 1 },
      A: { look: -.3 * smooth(span(t, a.charlotte, a.charlotte + 1)) + .5 * smooth(span(t, a.anne - .3, a.anne + .6)) * (1 - smooth(span(t, a.within, a.within + 1))) },
    };
  }

  function emilyHand(t, pen) {
    // writes in the ledger; on "they hold" her hand rests on the share (then leaves it when the index begins to rise)
    const h = SIS.E.h, toLocal = (q) => [(q[0] - SIS.E.x) / h, (q[1] - EDGE - 6) / h - .04];
    const onShare = smooth(span(t, a.sister, a.hold + .1)) * (1 - smooth(span(t, a.bursts - .6, a.bursts + .2)));
    const write = toLocal(pen), rest = [.12, .3], share = toLocal([CERT.x - 60, CERT.y - 50]);
    const w = smooth(span(t, a.emilyRuns - .5, a.emilyRuns + .2)) * (1 - smooth(span(t, a.cgets + .3, a.nervous + .3)));
    const base = [lerp(rest[0], write[0], w), lerp(rest[1], write[1], w)];
    return [lerp(base[0], share[0], onShare), lerp(base[1], share[1], onShare)];
  }

  function letterOnTable(ctx, t) {
    // Charlotte's letter: the date, a few lines of her hand, then "…ere it be too late." (★ 2.04), the nib stops; then it folds
    const w = LET.w, h = w * 1.18, fold = sineIO(span(t, a.butShe + .1, a.butShe + 1.4));
    const L1 = '…ere it be too late.', sz = 21;
    ctx.save(); ctx.translate(LET.x, LET.y); ctx.rotate(LET.rot);
    // folding: the right half turns over onto the left (a half flip)
    const sheet = (x0, wpx) => { const p = new Path2D(); p.rect(x0, -h / 2, wpx, h); B.paperFill(ctx, p, { lum: .58 + .3 * smooth(span(t, a.inJan - .6, a.january + .4)), seed: 371, lx: w * .5, ly: -h * .3, r: w * 1.3 }); };
    const fx = -w / 2 + w * .5, rightW = (w / 2) * Math.cos(Math.PI * fold);
    sheet(-w / 2, w / 2);
    if (rightW > 0) sheet(fx, rightW);
    ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w / 2 + Math.max(0, rightW), h); ctx.clip();
    // the writing (only while unfolded)
    const sc = fold < .5 ? 1 : 0;
    if (sc) {
      U.handLine(ctx, 'January 1846', w * .04, -h * .38, 17, smooth(span(t, a.january - .1, a.january + 1.0)), { col: rgba(COL.ink, .85) });
      const lines = 6, lu = span(t, a.january + 1.0, a.ere - .2);
      for (let i = 0; i < lines; i++) U.scribble(ctx, -w * .4, -h * .26 + i * h * .085, w * .8, 15, 520 + i, clamp(lu * lines - i), { a: .75 });
      const wu = span(t, a.ere - .05, a.lateE);
      const r = U.handLine(ctx, L1, -w * .4, -h * .26 + lines * h * .085 + 4, sz, wu, { col: rgba(COL.ink, .92), glow: .8 * smooth(span(t, a.missed + .8, a.didnt)) * 0 });
      ctx.restore();
      // the quill in Charlotte's hand writes, and stops after "too late"
      const lineY = (i) => -h * .26 + i * h * .085;
      let nib;
      if (t < a.ere - .2) { const i = Math.min(lines - 1, Math.floor(lu * lines)), k = clamp(lu * lines - i), sb = U.scribbleLine(520 + i, w * .8, 15); nib = [-w * .4 + sb.w * k, lineY(i) - 4 + 3 * Math.sin(t * 13)]; }
      else nib = r.nib;
      const lift = smooth(span(t, a.lateE + .1, a.lateE + .7)) * .8 + .2 * (1 - smooth(span(t, a.january - .6, a.january)));
      const vis = smooth(span(t, a.january - .9, a.january - .2)) * (1 - smooth(span(t, a.butShe - .3, a.butShe + .2)));
      if (vis > 0) { ctx.globalAlpha = 1; B.quill(ctx, nib[0] + 300 * (1 - vis), nib[1] - 200 * (1 - vis), t, { s: 38, lift }); }
    } else ctx.restore();
    ctx.restore();
  }

  function books(ctx, t) {
    // two sheets turn over: the novels to come (warm, the future)
    const fj = expoOut(span(t, a.jane - .05, a.jane + .75)), fw = expoOut(span(t, a.wuthering - .05, a.wuthering + .75));
    for (const [S2, f, ttl, cl] of [[SHEETJ, fj, ['JANE', 'EYRE'], '#3a2a4a'], [SHEETW, fw, ['WUTHERING', 'HEIGHTS'], '#24304f']]) {
      const w = S2.w, h = w * 1.3;
      B.flip(ctx, f, S2.x, S2.y, w, h,
        (x2, sx) => { x2.save(); x2.translate(S2.x, S2.y); x2.rotate(S2.rot); x2.scale(sx, 1); const p = new Path2D(); p.rect(-w / 2, -h / 2, w, h); B.paperFill(x2, p, { lum: .5, seed: 381 }); for (let i = 0; i < 9; i++) U.scribble(x2, -w * .4, -h * .38 + i * h * .09, w * .8, 12, 540 + i + (S2 === SHEETW ? 20 : 0), 1, { a: .5 }); x2.restore(); },
        (x2, sx) => { U.bookCover(x2, S2.x, S2.y, w * .96, h * .96, S2.rot, [...ttl.map((s) => [s, 28]), ['1847', 20, false]], { sx, cloth: cl, glow: .7 * (1 - .5 * smooth(span(t, a.emilyRuns, a.emilyRuns + 2))), lum: 1, size: 28 }); },
        { glint: .8 });
    }
  }

  function chartPt(u, v) {
    // a point of the index chart in room coords: u across the share (0 left … 1 right), v up from its bottom edge (1 = the top edge)
    const lx = (u - .5) * CH.w, ly = CH.h / 2 - v * CH.h;
    return [CERT.x + lx * CH.c - ly * CH.s, CERT.y + lx * CH.s + ly * CH.c];
  }

  function shareAndIndex(ctx, t) {
    // the share on the table; on "bursts" its top edge is the RAILWAY SHARE INDEX 1845–1849: rise, peak, fall to a third
    const glow = smooth(span(t, a.railwayW - .15, a.railwayW + .4)) * (1 - smooth(span(t, a.railwayW + 1.2, a.railwayW + 2.6)));
    const g0 = a.bursts - .9, draw = smooth(span(t, g0, a.bursts + .35)), fall = smooth(span(t, a.bursts - .1, a.twothirds + .3)), empty = smooth(span(t, a.e1849, a.twothirds + .2));
    const gone = smooth(span(t, tFall0 - .1, tFall0 + .5));   // the emptied band leaves as sheets (they fall in world S)
    const w = CH.w, h = CH.h;
    if (draw <= 0) { B.certificate(ctx, CERT.x, CERT.y, w, CERT.rot, { glow }); return; }
    // the curve: drawn in (draw), the falling part revealed as the index falls (fall)
    const n = 60, curve = [];
    const idx = (u) => { let i = 0; while (i < IDX.length - 2 && IDX[i + 1][0] < u) i++; const [u0, v0] = IDX[i], [u1, v1] = IDX[i + 1], f = (u - u0) / (u1 - u0); return lerp(v0, v1, smooth(f)); };
    const uPk = .2, uHead = uPk + (1 - uPk) * fall;
    const vAt = (u) => (u <= uPk ? lerp(1, idx(u), draw) : idx(u));   // the top edge bends into the boom, then the head falls
    for (let i = 0; i <= n; i++) { const u = i / n; if (u > uHead) break; curve.push([u, vAt(u)]); }
    curve.push([uHead, vAt(uHead)]);
    ctx.save(); ctx.translate(CERT.x, CERT.y); ctx.rotate(CERT.rot);
    const X = (u) => (u - .5) * w, Y = (v) => h / 2 - v * h;
    // the paper under the curve (the value); after the drawn head the share keeps its old top edge until the curve gets there
    const area = new Path2D(); area.moveTo(X(0), h / 2); curve.forEach(([u, v]) => area.lineTo(X(u), Y(v))); area.lineTo(X(uHead), Y(1)); area.lineTo(X(1), Y(1)); area.lineTo(X(1), h / 2); area.closePath();
    // the lost value: what was above the falling curve up to the peak, outlined in loss blue (empties as the index falls)
    if (empty > 0 && gone < 1) {
      const lost = new Path2D(); lost.moveTo(X(uPk), Y(1)); for (let i = 0; i <= n; i++) { const u = uPk + (1 - uPk) * i / n; if (u > uHead) break; lost.lineTo(X(u), Y(vAt(u))); } lost.lineTo(X(uHead), Y(1)); lost.closePath();
      ctx.save(); ctx.globalAlpha = 1 - gone; ctx.fillStyle = rgba(COL.loss, .28 * empty); ctx.fill(lost); ctx.setLineDash([6, 6]); ctx.strokeStyle = rgba(COL.cool2, .7 * empty); ctx.lineWidth = 1.6; ctx.stroke(lost); ctx.restore();
    }
    ctx.save(); ctx.clip(area);
    B.certificate(ctx, 0, 0, w, 0, { glow: 0, lum: lerp(1, .9, empty) });
    ctx.restore();
    // the index line: ink-gold, the head a point of light
    const pts = curve.map(([u, v]) => [X(u), Y(v)]);
    B.inkLine(ctx, pts, 1, { col: P.halo0, w: 3, glow: .6 * draw });
    if (uHead < 1 && fall > 0) halo(ctx, X(uHead), Y(vAt(uHead)), 26, .7, P.halo1, P.core0);
    ctx.restore();
    // text: label (rises with the line), years under the share, −64 % on "two thirds", source
    const tl = rise(span(t, g0 + .3, a.bursts + .6)), yrs = rise(span(t, a.bursts + .2, a.e1849 + .4)), num = rise(span(t, a.twothirds - .05, a.twothirds + .6)), src = rise(span(t, a.twothirds + .5, a.twothirds + 1.3));
    const out = 1 - smooth(span(t, tFall0 - .2, tFall0 + .4));
    const pL = chartPt(0, 1.18), pR = chartPt(1, -.12), pN = chartPt(.66, .82), pS = chartPt(1, -.22);
    if (tl > 0 && out > 0) K.maskLine(ctx, [['RAILWAY SHARE INDEX · 1845–1849', 0]], pL[0] - 4, pL[1], 11, tl * out, { serif: false, col: P.halo2, glow: false });
    if (yrs > 0 && out > 0) { const p0 = chartPt(0, -.13), p1 = chartPt(1, -.13); K.maskLine(ctx, [['1845', 0]], p0[0], p0[1], 11, yrs * out, { serif: false, col: P.halo2, glow: false }); K.maskLine(ctx, [['1849', 0]], p1[0] - 27, p1[1], 11, yrs * out, { serif: false, col: P.halo2, glow: false }); }
    if (num > 0 && out > 0) K.maskLine(ctx, [['−64 %', 0]], pN[0], pN[1], 40, num * out, { col: P.cream, align: 'center' });
    if (src > 0 && out > 0) K.maskLine(ctx, [['SOURCE: ODLYZKO', 0]], pS[0] - 76, pS[1], 7.6, src * out, { serif: false, col: rgba(P.halo2, .8), glow: false });
  }

  function labels(ctx, t) {
    // the three names, pinned above the heads; on "Brontë" the family name rises under each
    const L = [['C', 'CHARLOTTE', a.charlotte], ['E', 'EMILY', a.emily], ['A', 'ANNE', a.anne]];
    const off = 1 - smooth(span(t, a.emilyRuns - .6, a.emilyRuns + .3));
    if (off <= 0) return;
    for (const [k, nm, t0] of L) {
      const s = SIS[k], hy = EDGE - s.h * .93, ly = hy - 120;
      U.label(ctx, s.x, hy - 12, ly + 52, nm, 'BRONTË', smooth(span(t, t0 - .2, t0 + .25)) * off, rise(span(t, t0 - .05, t0 + .6)) * off, rise(span(t, a.bronte - .05 + (k === 'C' ? 0 : k === 'E' ? .08 : .16), a.bronte + .6)) * off, { size: 40 });
    }
  }

  function savers(ctx, t) {
    // world S: below the table, four hands rise into the lamp light and catch the falling sheets
    if (t < tFall0 - .2) return;
    const lamp = smooth(span(t, tFall0, tFall0 + 1.2));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rad(ctx, 890, 1240, 1100, [[0, rgba(P.halo1, .22 * lamp)], [.5, rgba(P.shade0, .08 * lamp)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-1600, 1080, 5200, 1800);
    ctx.restore();
    HANDS.forEach(([x, y, kind, ang, s], i) => {
      const up = expoOut(span(t, tFall0 + .3 + i * .12, tHold - .2 + i * .1)), yy = y + 520 * (1 - up);
      const sp = holdSheet(i, t), land = clamp((t - (tHold - .1)) * 3);
      U.savingsHand(ctx, x + (sp.x - x - 10) * land * 0, yy, 210 * s, ang, kind, t);
      certAt(ctx, sp, t);
    });
  }
  function certAt(ctx, sp, t) {
    if (Math.abs(sp.sx) < .03) return;
    B.certificate(ctx, sp.x, sp.y, sp.w, sp.rot, { sx: sp.sx, lum: .85 });
  }

  // ---------------------------------------------------------------------------------------------- N: the Argus, Mackay, the letter
  function worldN(ctx, t) {
    const c = camN(t);
    card(ctx, c, F0, () => {
      // the table, a lamp pool on the page (left) and the candle on the right
      ctx.fillStyle = E.lin(ctx, -600, 0, 3200, 0, [[0, P.night0], [.5, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]); ctx.fillRect(-1600, -1200, 5200, 3400);
      const wander = smooth(span(t, a.missed - .1, a.didnt - .2));
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rad(ctx, 640, 420, 1000, [[0, rgba(P.halo1, .36 * (1 - .75 * wander))], [.35, rgba(P.shade0, .18 * (1 - .7 * wander))], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-1600, -1200, 5200, 3400);
      ctx.fillStyle = rad(ctx, CAND2.x - 160, CAND2.y + 120, 1100, [[0, rgba(P.halo1, .14 + .3 * wander)], [.4, rgba(P.shade0, .08 + .14 * wander)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-1600, -1200, 5200, 3400);
      ctx.restore();
      // the saver's share (the paper match: we came out of it), then the letter (Charlotte's, open again) and its candle
      B.certificate(ctx, CN.x, CN.y, CN.w, CN.rot, { lum: .85 });
      letter2(ctx, t, wander);
      U.candle(ctx, CAND2.x, CAND2.y, CAND2.h, t, { lum: .55 + .45 * wander, flick: .3 });
      // the Argus page → (flip) → Mackay's book
      const fu = sineIO(span(t, a.book - .25, a.book + .85));
      B.flip(ctx, fu, BOOK.x, BOOK.y, NEWS.w, NEWS.h,
        (x2, sx) => { x2.save(); x2.translate(BOOK.x, BOOK.y); x2.scale(sx, 1); x2.translate(-BOOK.x, -BOOK.y); argus(x2, t); x2.restore(); },
        (x2, sx) => { const sz = lerp(1, .62, smooth(span(t, a.book, a.book + 1.4))), cool = smooth(span(t, a.missed - .15, a.missed + 1.1));
          U.bookCover(x2, BOOK.x, BOOK.y, NEWS.w * lerp(.86, .82, sz) * sz / .62 * .62, NEWS.h * .82 * sz / .62 * .62 * 1.0, 0,
            [['EXTRAORDINARY', 44], ['POPULAR DELUSIONS', 44], ['AND THE', 30], ['MADNESS OF CROWDS', 44], ['CHARLES MACKAY · 1841', 22, false]],
            { sx, cloth: mixHex('#2c2a58', COL.loss, cool), glow: .55 * (1 - cool), lum: 1 - .65 * cool, size: 44, dy: -10 }); },
        { glint: .9 });
      // CHARLES MACKAY · EDITOR (pinned to the masthead)
      const lm = rise(span(t, a.mackay - .1, a.mackay + .6)) * (1 - smooth(span(t, a.book - .4, a.book))), ll = smooth(span(t, a.mackay - .3, a.mackay + .2)) * (1 - smooth(span(t, a.book - .4, a.book)));
      if (ll > 0) {   // a leader from the masthead out to the left, the label right-aligned in the dark beside the page
        const ly = NEWS.y + 70;
        B.inkLine(ctx, [[NEWS.x + 90, ly - 14], [NEWS.x - 30, ly - 14]], ll, { col: P.halo2, w: 2, a: .75 });
        K.maskLine(ctx, [['CHARLES MACKAY', 0]], NEWS.x - 44 - K.measure('CHARLES MACKAY', 44, false), ly, 44, lm, { serif: false, col: P.cream, glow: false });
        K.maskLine(ctx, [['EDITOR', 0]], NEWS.x - 44 - K.measure('EDITOR', 40, false), ly + 50, 40, lm, { serif: false, col: P.halo2, glow: false });
      }
    });
  }

  function argus(ctx, t) {
    B.newspaper(ctx, NEWS.x, NEWS.y, NEWS.w, NEWS.h, { mast: 'THE GLASGOW ARGUS', date: 'OCTOBER 1845', open: [0, .78, 1, 1], lx: NEWS.x + NEWS.w * .3, ly: NEWS.y + NEWS.h * .3 });
    B.inkLine(ctx, [[UL.x0, UL.y], [UL.x1, UL.y]], 1, { col: COL.ink, w: 3 });
  }

  function letter2(ctx, t, wander) {
    const w = LET2.w, h = w * 1.18, L1 = '…ere it be too late.', sz = 40, lines = 6;
    ctx.save(); ctx.translate(LET2.x, LET2.y); ctx.rotate(LET2.rot);
    // the paper is the screen-space paper plate seen through the letter's shape: when the camera lands inside the letter (tP) the
    // frame is exactly B.paperPlate (the frame c03 starts from)
    const p = new Path2D(); p.rect(-w / 2, -h / 2, w, h);
    ctx.save(); ctx.clip(p); B.paperPlate(ctx, t, { lum: lerp(.7, 1, wander) }); ctx.restore();
    U.handLine(ctx, 'January 1846', w * .04, -h * .38, 32, 1, { col: rgba(COL.ink, .85) });
    for (let i = 0; i < lines; i++) U.scribble(ctx, -w * .4, -h * .26 + i * h * .085, w * .8, 28, 520 + i, 1, { a: .75 });
    const ly = -h * .26 + lines * h * .085 + 8;
    U.handLine(ctx, L1, -w * .4, ly, sz, 1, { col: rgba(COL.ink, .92), glow: .9 * smooth(span(t, a.young - .2, a.didnt + .2)) * (1 - smooth(span(t, a.didntW, a.didntW + 1))) });
    if (t > tUl0) B.inkLine(ctx, [[ulX0, L2.ul], [headLocal(t), L2.ul]], 1, { col: COL.ink, w: 2.5 });
    ctx.restore();
  }
}
