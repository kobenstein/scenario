// Film 16 · B3 · world A: the writing room of level 7 (c09, 9.01–9.03). Cool documentary daylight from one tall window, a lectern
// with a lamp-lit sheet, the writer (an indigo silhouette, no face), a ballot box and you. The sheet is drawn in plate coordinates
// (f16_b3_common sheet), so the first frame after plateNib is the plate itself, seen through the camera at magnification S_A.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f16_kit.mjs';
import { NIB_PLATE } from './f16_seams.mjs';
import { sheet, sheetPen, sheetSweep, lineY, armIK, lerpArm, label, inOut, SHEET } from './f16_b3_common.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, card, F0, prng, rad, lin, halo } = E;

// ---- geometry (world A, focus card F0) ----
export const S_A = NIB_PLATE.L / 120;                 // plate px per world px: the pen is 120 px long in the room
export const PCA = [640, 470];                         // world point under the screen centre of the plate
export const plateToA = (px, py) => [PCA[0] + (px - 960) / S_A, PCA[1] + (py - 540) / S_A];
const FLOOR = 930;
const BOARD = { x0: 462, x1: 808, y0: 318, y1: 716 };
const LAMP = { base: [476, 318], elbow: [430, 236], head: [508, 206], bulb: [528, 236] };
export const ASK = { x: 924, y: FLOOR, h: 700, dir: -1, side: true };
const WIN = { x0: 1000, x1: 1760, y0: 70, y1: 800 };   // on the wall card (Z WALL)
const WALL = 3600, FAR = 9000;
export const BOX = { x0: -84, x1: 76, y: FLOOR, h: 132 };
export const YOU = { x: -128, y: FLOOR, h: 236, dir: 1 };
const TOWER = { x: 1390, w: 150, top: 150, base: 830 };   // far card
const CITY = (() => { const r = prng(907), b = []; let x = 700; while (x < 2200) { const w = 50 + r() * 90; b.push([x, 830 - (40 + r() * 140), w]); x += w + 4; } return b; })();
const LIGHTS = (() => { const r = prng(4401), L = []; for (let i = 0; i < 700; i++) { const x = 760 + r() * 1420, y = 700 + r() * 128; const d = Math.hypot(x - (TOWER.x + TOWER.w / 2), (y - 820) * 3); L.push([x, y, d, .8 + r() * 1.2, r()]); } return L.sort((p, q) => p[2] - q[2]); })();
const REST_R = [.18, .06], REST_L = [-.12, -.04];
const NAME = [586, 232];
// the writer's hair (a bob, no face): it replaces the kit head's round 'helmet' read in the side view; cool rim from the window
function hair(ctx, f, look) {
  const hx = .012 - .012 * look, hy = -.885 - .008 * look, R = .074 * f.h, cx = f.x + f.h * f.dir * hx, cy = f.y + f.h * hy, b = -f.dir;   // b: the back of the head on screen
  const p = new Path2D();
  p.ellipse(cx + b * .1 * R, cy - .12 * R, 1.06 * R, 1.0 * R, 0, 0, 6.29);
  p.moveTo(cx + b * .05 * R, cy); p.lineTo(cx + b * 1.12 * R, cy - .1 * R); p.quadraticCurveTo(cx + b * 1.2 * R, cy + .9 * R, cx + b * .78 * R, cy + 1.02 * R); p.lineTo(cx + b * .05 * R, cy + .7 * R); p.closePath();
  ctx.fillStyle = lin(ctx, cx - b * R, 0, cx + b * 1.2 * R, 0, [[0, P.night0], [.7, mixHex(P.night0, P.ind2, .6)], [1, mixHex(P.ind2, P.blue1, .5)]]); ctx.fill(p);
  ctx.save(); ctx.clip(p); ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = R * .16; ctx.beginPath(); ctx.ellipse(cx + b * .1 * R + b * R * .08, cy - .12 * R, 1.06 * R, 1.0 * R, 0, b > 0 ? -1.4 : 1.7, b > 0 ? .9 : 4.0); ctx.stroke(); ctx.restore();
}

export function room(a) {
  const tWrite = a.T0 + SEAM_END(a);                      // the pen starts to move by itself after the plate
  const tTake = a.who - .25, tTook = a.who + .55;          // the writer's hand closes on the pen
  const tLift = a.andCons - .55, tLifted = a.andCons + .3; // she lifts the pen off the page (before the flight into the sheet)
  const SPEED = 60;                                        // plate px per second of writing
  const nibX = (t) => { const tau = Math.max(0, Math.min(t, tLift) - tWrite); return NIB_PLATE.x + SPEED * (tau - .6 * (1 - Math.exp(-tau / .6))); };   // starts from rest
  const gripOff = (L) => [Math.cos(NIB_PLATE.ang) * .27 * L, Math.sin(NIB_PLATE.ang) * .27 * L];
  const self = { nibX, tLift };

  self.draw = (ctx, t, c) => {
    const lit = smooth(span(t, a.oneco - .15, a.oneco + .9));                 // the company tower lights band by band
    const spread = span(t, a.millions - .2, a.millions + 2.6);                // the lights spread over the city
    // ---------------------------------------------------------------- far: daylight sky, one company tower, the city
    card(ctx, c, FAR, () => {
      ctx.fillStyle = lin(ctx, 0, -600, 0, 900, [[0, mixHex(P.blue1, P.ind1, .35)], [.55, mixHex(P.blue2, P.halo2, .22)], [1, mixHex(P.blue2, P.halo1, .35)]]);
      ctx.fillRect(-2 * W, -2 * H, 5 * W, 5 * H);
      for (const [x, y, w] of CITY) { ctx.fillStyle = lin(ctx, 0, y, 0, 900, [[0, mixHex(P.blue1, P.ind2, .55)], [1, P.ind1]]); ctx.fillRect(x, y, w, 900 - y + 400); }
      // the tower (glass, blue bands) — its floors light up on "one company"
      const { x, w, top, base } = TOWER;
      ctx.fillStyle = lin(ctx, x, 0, x + w, 0, [[0, mixHex(P.ind2, P.blue1, .8)], [.6, P.ind2], [1, P.night1]]); ctx.fillRect(x, top, w, base - top + 400);
      ctx.fillStyle = mixHex(P.ind2, P.blue0, .5); ctx.fillRect(x + w * .42, top - 46, 6, 46);
      const nb = 16;
      for (let i = 0; i < nb; i++) {
        const q = clamp(lit * nb * 1.1 - (nb - 1 - i) * .9), yy = top + 18 + i * (base - top - 30) / nb;
        ctx.fillStyle = q > 0 ? rgba(mixHex(P.blue0, P.halo0, .65 * q), .45 + .5 * q) : rgba(P.blue0, .4);
        ctx.fillRect(x + 10, yy, w - 20, 7);
      }
      if (lit > 0) halo(ctx, x + w / 2, top + 200, 320, .18 * lit, P.blue0, P.halo1);
      // millions of people: small warm lights spreading out from the tower's foot
      if (spread > 0) {
        const R = expoOut(spread) * 1500;
        ctx.save(); ctx.fillStyle = P.core1;
        for (const [lx, ly, d, s, ph] of LIGHTS) { if (d > R) break; ctx.globalAlpha = clamp((R - d) / 90) * (.65 + .35 * Math.sin(t * 1.3 + ph * 9)); ctx.fillRect(lx, ly, s * 4, s * 4); }
        ctx.restore();
      }
    });
    // ---------------------------------------------------------------- the wall with the window
    card(ctx, c, WALL, () => {
      const wall = new Path2D(); wall.rect(-2 * W, -2 * H, 5 * W, 5 * H); wall.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
      ctx.fillStyle = lin(ctx, 0, -300, 0, 1100, [[0, P.night0], [.5, mixHex(P.night1, P.ind2, .5)], [1, P.night1]]); ctx.fill(wall, 'evenodd');
      ctx.fillStyle = rad(ctx, 600, 300, 900, [[0, rgba(P.shade0, .16)], [1, rgba(P.shade0, 0)]]); ctx.fill(wall, 'evenodd');   // the lamp's warmth on the wall
      // mullions and the frame (dark), a cool rim on the inner edge
      ctx.fillStyle = P.night1;
      for (const fx of [1, 2]) ctx.fillRect(lerp(WIN.x0, WIN.x1, fx / 3) - 6, WIN.y0, 12, WIN.y1 - WIN.y0);
      ctx.fillRect(WIN.x0, lerp(WIN.y0, WIN.y1, .36) - 6, WIN.x1 - WIN.x0, 12);
      ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 6; ctx.strokeRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
      ctx.fillStyle = lin(ctx, 0, WIN.y1, 0, WIN.y1 + 30, [[0, mixHex(P.ind2, P.blue1, .6)], [1, P.night1]]); ctx.fillRect(WIN.x0 - 30, WIN.y1, WIN.x1 - WIN.x0 + 60, 26);
    });
    // ---------------------------------------------------------------- the focus card: floor, lectern, sheet, lamp, writer, ballot, you
    card(ctx, c, F0, () => {
      E.ground(ctx, [[-1200, FLOOR], [900, FLOOR], [3200, FLOOR]], { rim: rgba(P.blue1, .7), rimW: 2, stops: [[0, mixHex(P.night1, P.ind2, .4)], [1, P.night0]] });
      // daylight from the window on the floor (cool), the lamp's warmth under the lectern
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(10px)';
      ctx.fillStyle = lin(ctx, 0, FLOOR, 0, FLOOR + 160, [[0, rgba(P.blue1, .32)], [1, rgba(P.blue1, 0)]]);
      ctx.beginPath(); ctx.moveTo(1080, FLOOR + 2); ctx.lineTo(1740, FLOOR + 2); ctx.lineTo(2000, FLOOR + 170); ctx.lineTo(1000, FLOOR + 170); ctx.closePath(); ctx.fill(); ctx.restore();
      E.castShadow(ctx, 635, FLOOR + 1, 120, 150, 2.2, .45);
      // the lectern: column, base, the board (seen almost face-on)
      ctx.fillStyle = lin(ctx, 590, 0, 690, 0, [[0, P.night1], [.6, mixHex(P.ind2, P.blue1, .4)], [1, P.night1]]);
      ctx.beginPath(); ctx.moveTo(600, BOARD.y1); ctx.lineTo(670, BOARD.y1); ctx.lineTo(684, FLOOR - 22); ctx.lineTo(586, FLOOR - 22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = lin(ctx, 0, FLOOR - 26, 0, FLOOR, [[0, mixHex(P.ind2, P.blue1, .5)], [1, P.night1]]); ctx.beginPath(); ctx.roundRect(536, FLOOR - 26, 198, 26, 6); ctx.fill();
      const bd = new Path2D(); bd.roundRect(BOARD.x0, BOARD.y0, BOARD.x1 - BOARD.x0, BOARD.y1 - BOARD.y0, 8);
      ctx.fillStyle = lin(ctx, BOARD.x0, 0, BOARD.x1, 0, [[0, mixHex(P.ind2, P.shade0, .25)], [.5, P.ind2], [1, mixHex(P.ind2, P.blue1, .35)]]); ctx.fill(bd);
      ctx.fillStyle = lin(ctx, 0, BOARD.y1 - 4, 0, BOARD.y1 + 18, [[0, mixHex(P.ind2, P.halo1, .25)], [1, P.night1]]); ctx.fillRect(BOARD.x0 - 6, BOARD.y1 - 2, BOARD.x1 - BOARD.x0 + 12, 18);   // the ledge
      // the sheet + the written line + the pen (plate coordinates)
      const nx = nibX(t), held = t >= tTake;
      const liftU = sineIO(span(t, tLift, tLifted));
      const nibPl = [lerp(nx, 2700, liftU), lerp(lineY(nx), -820, liftU)];
      ctx.save(); ctx.translate(PCA[0] - 960 / S_A, PCA[1] - 540 / S_A); ctx.scale(1 / S_A, 1 / S_A);
      sheet(ctx, t, { nibX: nx });
      ctx.restore();
      // the writer (indigo, side view, facing the lectern); her front arm reaches the grip once she takes the pen
      const nibW = plateToA(nibPl[0], nibPl[1]), g = gripOff(120), grip = [nibW[0] + g[0], nibW[1] + g[1]];
      const take = sineIO(span(t, tTake, tTook));
      const armR = take > 0 ? lerpArm(REST_R, lerpArm(armIK(ASK, 1, grip[0], grip[1]), armIK(ASK, 1, grip[0], grip[1], 'back'), liftU), take) : REST_R;
      const breath = .006 * Math.sin(t * 1.1);
      E.person(ctx, ASK.x, ASK.y, ASK.h, { dir: ASK.dir, view: 'side', long: true, light: -1, armR, armL: REST_L, look: .05 + breath, rim: mixHex(P.blue0, P.halo1, .35) });
      hair(ctx, ASK, .05 + breath);
      // the pen over the sheet (and over her hand: her fingers are drawn on top)
      ctx.save(); ctx.translate(PCA[0] - 960 / S_A, PCA[1] - 540 / S_A); ctx.scale(1 / S_A, 1 / S_A);
      sheetPen(ctx, t, nx, { x: nibPl[0], y: nibPl[1] });
      sheetSweep(ctx, t, 1 - smooth(span(t, tWrite, tWrite + 2.5)));
      ctx.restore();
      if (take > .85) { ctx.fillStyle = mixHex(P.shade0, P.night1, .5); ctx.beginPath(); ctx.ellipse(grip[0] + 2, grip[1] + 1, 8, 6, -.6, 0, 6.29); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 1.2; ctx.stroke(); }
      // the lamp on the board (the warm hero of the room)
      ctx.strokeStyle = mixHex(P.shade0, P.night1, .35); ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(...LAMP.base); ctx.lineTo(...LAMP.elbow); ctx.lineTo(LAMP.head[0] - 10, LAMP.head[1] + 8); ctx.stroke();
      const sh = new Path2D(); sh.moveTo(LAMP.head[0] - 30, LAMP.head[1] - 6); sh.lineTo(LAMP.head[0] + 18, LAMP.head[1] - 22); sh.lineTo(LAMP.bulb[0] + 26, LAMP.bulb[1] - 4); sh.lineTo(LAMP.bulb[0] - 22, LAMP.bulb[1] + 14); sh.closePath();
      ctx.fillStyle = lin(ctx, LAMP.head[0] - 30, 0, LAMP.bulb[0] + 26, 0, [[0, P.night1], [1, mixHex(P.ind2, P.shade0, .5)]]); ctx.fill(sh);
      halo(ctx, LAMP.bulb[0] + 2, LAMP.bulb[1] + 6, 62, .85, P.halo0, P.core0);
      ctx.fillStyle = P.core0; ctx.beginPath(); ctx.ellipse(LAMP.bulb[0] + 2, LAMP.bulb[1] + 5, 12, 5, -.55, 0, 6.29); ctx.fill();
      // 9.02 the name plate (rises on "philosopher", sinks before the window move)
      const nu = inOut(t, a.philo - .25, a.oneco - .9);
      if (nu > 0) {
        K.rule(ctx, NAME[0] - 18, NAME[1] - 46, NAME[0] - 18, NAME[1] + 48, smooth(span(t, a.philo - .4, a.philo + .2)) * (1 - expoIn(span(t, a.oneco - .9, a.oneco - .4))), { spark: false });
        label(ctx, 'AMANDA ASKELL', NAME[0], NAME[1], 34, nu, { col: P.cream, spacing: .1 });
        label(ctx, 'PHILOSOPHER', NAME[0] + 2, NAME[1] + 36, 21, inOut(t, a.philo, a.oneco - .85), { spacing: .14 });
      }
      // 9.03 the ballot box and you: you raise your ballot to the slot; the slot closes ("no fixed public process")
      ballot(ctx, t);
    });
  };

  function ballot(ctx, t) {
    const { x0, x1, y, h } = BOX, top = y - h;
    const close = expoOut(span(t, a.process - .1, a.process + .55));
    ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, mixHex(P.ind2, P.blue1, .55)], [1, P.night1]]); ctx.fillRect(x0, top, x1 - x0, h);
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .75); ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x0 + 26, top - 16); ctx.lineTo(x1 + 26, top - 16); ctx.lineTo(x1, top); ctx.closePath(); ctx.fill();
    ctx.fillStyle = mixHex(P.ind2, P.night1, .6); ctx.beginPath(); ctx.moveTo(x1, top); ctx.lineTo(x1 + 26, top - 16); ctx.lineTo(x1 + 26, y - 16); ctx.lineTo(x1, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(P.halo1, .55); ctx.lineWidth = 2; ctx.strokeRect(x0, top, x1 - x0, h);
    // the slot: a line of warm light that closes from both ends
    const sx = (x0 + x1) / 2 + 13, sy = top - 8, sw = 46 * (1 - close);
    if (sw > .5) { ctx.strokeStyle = P.core1; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx - sw, sy); ctx.lineTo(sx + sw, sy); ctx.stroke(); halo(ctx, sx, sy, 60 * (1 - close) + 10, .7 * (1 - close) + .15, P.halo0, P.core1); }
    else { ctx.strokeStyle = rgba(P.halo1, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - 46, sy); ctx.lineTo(sx + 46, sy); ctx.stroke(); }
    // you: the ballot goes up to the slot on "voted", stays in your hand; lowers after the slot has closed
    const up = sineIO(span(t, a.voted + .45, a.voted + 1.35)) * (1 - sineIO(span(t, a.process + .9, a.process + 2.1)));
    const target = [sx - 20, sy - 30];
    const armR = lerpArm([.25, .1], armIK(YOU, 1, target[0], target[1]), up);
    const hd = E.du(ctx, YOU.x, YOU.y, YOU.h, { dir: 1, light: 1, armR, armL: [-.15, -.05], look: .1 * up });
    // the ballot card in your hand (cream paper, a fold line)
    const [hx, hy] = hd.R;
    ctx.save(); ctx.translate(hx, hy - 4); ctx.rotate(-.25 + .2 * up);
    ctx.fillStyle = P.cream; ctx.fillRect(-4, -26, 30, 24); ctx.strokeStyle = rgba(P.shade0, .7); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-1, -14); ctx.lineTo(22, -14); ctx.stroke();
    ctx.restore();
  }
  return self;
}
export const SEAM_END = () => .5;
