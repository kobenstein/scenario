// Film 24 · B1 · the kitchen at morning (c03 3.01–3.09; a card stage): a bright window (the hero light), a parent who talks, a baby in a
// high chair, sound bubbles, the bottle. Design px at the home camera (E.cam3()); cards: wall 2600 · people F0 · front 1250.
//   kitchen(ctx, c, t, s)   s = state: { bubbles: [{ x, y, r, kind, col, a, link }], talk 0..1, point 0..1, reach 0..1, babySound 0..1 }
//   WIN = the window rect on the wall card; BABY / PARENT positions; bottleAt(reach) → where the bottle is (design px, F0)
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import * as B from './f24_b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, prng, lin, rad, halo } = E;
const TAU = Math.PI * 2;

export const Z_WALL = 2600, Z_FRONT = 1250, FLOOR = 880;
export const WIN = { x: 1180, y: 250, w: 320, h: 320 / .71875 };
export const BABY = { x: 1250, seat: 610, head: [1236, 428], hr: 50 };
export const PARENT = { x: 690, h: 560 };
export const MOUTH = [PARENT.x + 40, FLOOR - PARENT.h * .87];
const LEAVES = (() => { const r = prng(2461), l = []; for (let i = 0; i < 9; i++) l.push([(r() - .5) * 60, -r() * 70, .3 + r() * .5, (r() - .5) * 1.6]); return l; })();

function wall(ctx, t) {
  const cx = WIN.x + WIN.w / 2, cy = WIN.y + WIN.h / 2;
  ctx.fillStyle = lin(ctx, 0, -600, 0, H + 600, [[0, mixHex(P.night1, P.ind0, .6)], [.5, mixHex(P.ind0, P.shade1, .14)], [1, mixHex(P.night1, P.ind1, .4)]]); ctx.fillRect(-2000, -1200, W + 4000, H + 2400);
  ctx.fillStyle = rad(ctx, cx, cy + 60, 1300, [[0, rgba(P.halo1, .26)], [.45, rgba(P.shade0, .1)], [1, rgba(P.shade0, 0)]]); ctx.fillRect(-2000, -1200, W + 4000, H + 2400);
  // upper cabinets and the counter on the left (dark), a kettle
  ctx.fillStyle = mixHex(P.night1, P.ind1, .35); ctx.fillRect(-700, 110, 1250, 230); ctx.fillRect(-700, 560, 1300, 340);
  ctx.fillStyle = rgba(P.halo1, .28); ctx.fillRect(-700, 556, 1300, 5); ctx.fillRect(-700, 338, 1250, 3);
  ctx.strokeStyle = rgba(P.night0, .6); ctx.lineWidth = 3; for (let x = -600; x < 560; x += 210) { ctx.strokeRect(x, 128, 190, 194); ctx.strokeRect(x, 590, 190, 260); }
  ctx.fillStyle = mixHex(P.night0, P.ind2, .5); ctx.beginPath(); ctx.ellipse(380, 520, 46, 38, 0, 0, TAU); ctx.fill(); ctx.fillRect(334, 520, 92, 36); ctx.fillRect(420, 500, 34, 8);
  ctx.fillStyle = rgba(P.halo1, .3); ctx.fillRect(398, 486, 10, 6);
  // the window: frame, morning light, cross mullions, a plant on the sill
  ctx.fillStyle = P.night0; ctx.fillRect(WIN.x - 16, WIN.y - 16, WIN.w + 32, WIN.h + 32);
  ctx.fillStyle = lin(ctx, 0, WIN.y, 0, WIN.y + WIN.h, [[0, P.core0], [.55, P.core1], [1, mixHex(P.core1, P.halo1, .55)]]); ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
  ctx.fillStyle = rgba(mixHex(P.halo1, P.shade0, .4), .35); ctx.beginPath(); ctx.ellipse(WIN.x + WIN.w * .7, WIN.y + WIN.h * .8, WIN.w * .5, 60, 0, 0, TAU); ctx.fill();   // a soft garden outside
  ctx.fillStyle = mixHex(P.night0, P.ind2, .4); ctx.fillRect(cx - 6, WIN.y, 12, WIN.h); ctx.fillRect(WIN.x, WIN.y + WIN.h * .42, WIN.w, 12);
  ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(WIN.x - 40, WIN.y + WIN.h + 10, WIN.w + 80, 22); ctx.fillStyle = rgba(P.halo1, .5); ctx.fillRect(WIN.x - 40, WIN.y + WIN.h + 10, WIN.w + 80, 3);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(WIN.x + 34, WIN.y + WIN.h - 34, 46, 44);
  for (const [dx, dy, s, a] of LEAVES) { ctx.save(); ctx.translate(WIN.x + 57 + dx * .6, WIN.y + WIN.h - 34 + dy); ctx.rotate(a + .05 * Math.sin(t * .7 + dx)); ctx.beginPath(); ctx.ellipse(0, -24 * s, 10 * s + 4, 26 * s + 6, 0, 0, TAU); ctx.fill(); ctx.restore(); }
}
function floor(ctx, t) {
  ctx.fillStyle = lin(ctx, 0, FLOOR - 30, 0, H + 500, [[0, mixHex(P.shade0, P.ind1, .62)], [.3, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]); ctx.fillRect(-1600, FLOOR - 28, W + 3200, H + 900);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';   // the window's light on the floor
  ctx.fillStyle = rgba(P.halo1, .14); ctx.beginPath(); ctx.moveTo(WIN.x - 60, FLOOR - 10); ctx.lineTo(WIN.x + WIN.w + 40, FLOOR - 10); ctx.lineTo(WIN.x + WIN.w - 260, H + 200); ctx.lineTo(WIN.x - 520, H + 200); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// the high chair and the baby (faces left, towards the parent); point 0..1 raises the near arm to point at the bottle
function baby(ctx, t, s) {
  const bx = BABY.x, sy = BABY.seat, dark = mixHex(P.night0, P.ind2, .45), rim = rgba(mixHex(P.halo0, P.core1, .5), .85);
  // chair legs + tray + seat
  ctx.strokeStyle = dark; ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(bx - 50, sy + 20); ctx.lineTo(bx - 110, FLOOR); ctx.moveTo(bx + 60, sy + 20); ctx.lineTo(bx + 120, FLOOR); ctx.moveTo(bx - 80, sy + 140); ctx.lineTo(bx + 90, sy + 140); ctx.stroke();
  ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(bx - 66, sy - 10, 140, 40, 10); ctx.fill(); ctx.beginPath(); ctx.roundRect(bx + 40, sy - 170, 30, 190, 10); ctx.fill();
  const br = 1 + .015 * Math.sin(t * 2.2), bob = 4 * Math.sin(t * 1.1) + (s.babySound ?? 0) * -6;
  // body
  const body = new Path2D(); body.ellipse(bx, sy - 70 + bob * .3, 58 * br, 82, 0, 0, TAU);
  ctx.fillStyle = lin(ctx, bx - 60, 0, bx + 60, 0, [[0, mixHex(P.ind2, P.blue1, .55)], [1, mixHex(P.ind2, P.night1, .3)]]); ctx.fill(body);
  ctx.save(); ctx.strokeStyle = rim; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(bx, sy - 70 + bob * .3, 58 * br, 82, 0, -1.4, .6); ctx.stroke(); ctx.restore();
  // the tray (in front of the body)
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.beginPath(); ctx.roundRect(bx - 150, sy - 28, 190, 24, 8); ctx.fill(); ctx.fillStyle = rgba(P.halo1, .35); ctx.fillRect(bx - 148, sy - 28, 186, 3);
  // the head: big, round, a tuft; it turns a little towards what it hears
  const [hx, hy] = [BABY.head[0] - 4 * (s.look ?? 0), BABY.head[1] + bob];
  ctx.fillStyle = lin(ctx, hx - 50, 0, hx + 50, 0, [[0, mixHex(P.ind2, P.blue1, .5)], [1, mixHex(P.night1, P.ind2, .5)]]); ctx.beginPath(); ctx.arc(hx, hy, BABY.hr, 0, TAU); ctx.fill();
  ctx.strokeStyle = rim; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(hx, hy, BABY.hr, -1.6, .5); ctx.stroke();
  ctx.strokeStyle = mixHex(P.ind2, P.blue1, .5); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(hx + 6, hy - BABY.hr + 2); ctx.quadraticCurveTo(hx + 2, hy - BABY.hr - 18, hx - 12, hy - BABY.hr - 12); ctx.stroke();
  // arms: the far one rests on the tray, the near one points (towards the bottle, left and up)
  const pt = sineIO(clamp(s.point ?? 0)), wav = .12 * Math.sin(t * 3.1) * (s.wave ?? 0);
  ctx.strokeStyle = mixHex(P.ind2, P.blue1, .4); ctx.lineWidth = 22;
  ctx.beginPath(); ctx.moveTo(bx - 20, sy - 110); ctx.quadraticCurveTo(bx - 60, sy - 70, bx - 80, sy - 40); ctx.stroke();
  const ang = lerp(.9, -.5, pt) + wav, ex = bx - 30 - Math.cos(ang) * 70, ey = sy - 120 + Math.sin(ang) * 70;
  ctx.strokeStyle = mixHex(P.blue1, P.ind2, .3); ctx.beginPath(); ctx.moveTo(bx - 24, sy - 124); ctx.lineTo(ex, ey); ctx.stroke();
  ctx.fillStyle = mixHex(P.blue1, P.ind2, .2); ctx.beginPath(); ctx.arc(ex, ey, 13, 0, TAU); ctx.fill();
  return { head: [hx, hy], mouth: [hx - 40, hy + 14], hand: [ex, ey] };
}
// the bottle (a small light thing): reach 0 = low in the parent's hand (out of the frame of the close shot), 1 = next to the baby on the tray
export function bottleAt(reach) { const e = sineIO(clamp(reach)); return [lerp(860, 1090, e), lerp(980, BABY.seat - 66, e) - 120 * Math.sin(Math.PI * e)]; }
function bottle(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-.12 + .03 * Math.sin(t));
  ctx.fillStyle = lin(ctx, -18, 0, 18, 0, [[0, mixHex(P.cream, P.blue1, .35)], [1, P.core1]]); ctx.beginPath(); ctx.roundRect(-18, -40, 36, 76, 10); ctx.fill();
  ctx.fillStyle = rgba(P.halo0, .55); ctx.fillRect(-18, 2, 36, 34);   // milk
  ctx.fillStyle = mixHex(P.shade0, P.halo1, .4); ctx.fillRect(-14, -52, 28, 14); ctx.beginPath(); ctx.ellipse(0, -60, 8, 10, 0, 0, TAU); ctx.fill();
  ctx.restore();
  halo(ctx, x, y, 90, .25, P.halo1, P.core1);
}
// a sound bubble: a soft ring with a small call inside (col), a: alpha via scale only (they grow from their source)
export function bubble(ctx, t, x, y, r, kind, col, k = 1) {
  if (k <= 0) return;
  const rr = r * expoOut(clamp(k)), wob = 1 + .03 * Math.sin(t * 2.3 + x * .01);
  ctx.fillStyle = rgba(P.night0, .42); ctx.beginPath(); ctx.arc(x, y, rr * wob, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(col, .85); ctx.lineWidth = 3; ctx.stroke();
  B.twave(ctx, t, x, y, rr * 1.3, rr * .9, kind, col, { bars: 9, seed: kind.length, live: true });
}
export function kitchen(ctx, c, t, s = {}) {
  E.card(ctx, c, Z_WALL, () => wall(ctx, t));
  E.card(ctx, c, E.F0, () => {
    floor(ctx, t);
    const reach = clamp(s.reach ?? 0), arm = sineIO(reach);
    const talk = s.talk ?? 0, look = .2 + .1 * Math.sin(t * 2.6) * talk;
    // the parent: faces the baby; the near arm lifts the bottle
    const hands = E.person(ctx, PARENT.x, FLOOR, PARENT.h, { dir: 1, light: 1, back: .35, look, lean: .02 + .02 * Math.sin(t * 1.9) * talk, armR: [lerp(.25, 1.55, arm), lerp(.15, 1.75, arm)] });
    const bb = baby(ctx, t, s);
    const [bx, by] = reach > 0 ? [lerp(hands.R[0], bottleAt(1)[0], span(reach, .85, 1)), lerp(hands.R[1] - 20, bottleAt(1)[1], span(reach, .85, 1))] : [hands.R[0], hands.R[1] - 20];
    bottle(ctx, bx, by, t);
    for (const b of s.bubbles || []) {
      if (b.link) { ctx.strokeStyle = rgba(b.col, .6 * b.link); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(lerp(b.x, b.lx, b.link), lerp(b.y, b.ly, b.link)); ctx.stroke(); }
    }
    for (const b of s.bubbles || []) bubble(ctx, t, b.x, b.y, b.r, b.kind, b.col, b.k);
    s.out = { baby: bb, hands };
  });
  return s.out;
}
