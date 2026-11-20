// Kitchen interior for the Belonging push-in: you visiting your grandmother on a Tuesday afternoon.
// Local space 1000 x ~667, floor at 640. Figures drawn first, table + chair in front so they sit/stand AT the table.
// hill_kitchen.mjs · copy of ref/keyframes/kitchen.mjs (the H2 kitchen the chapter-04 builder continues in), with an
// animated pour: o.pour 0..1 tilts the teapot from upright to pouring and starts the stream. pour = 1 equals the ref frame.
import { C, rgba, vgrad, figure, handPos, beam, speckle, glow } from '../ref/keyframes/lib.mjs';
const clamp01 = (v) => Math.max(0, Math.min(1, v));
export function kitchen(ctx, x, y, w, h, t, { clip = true, pour = 1 } = {}) {
  ctx.save();
  if (clip) { ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.clip(); }
  ctx.translate(x, y); const s = w / 1000; ctx.scale(s, s); const HH = h / s, FL = 640;
  vgrad(ctx, [[0, '#3b2a4e'], [.62, '#5a3a4a'], [.63, '#2c1e34'], [1, '#22172c']], 0, 0, 1000, HH);
  // window with afternoon sky + trees
  vgrad(ctx, [[0, '#e9a07f'], [1, '#ffd2a0']], 430, 90, 320, 250);
  ctx.fillStyle = 'rgba(70,45,75,.55)'; ctx.beginPath(); ctx.moveTo(430, 300); ctx.quadraticCurveTo(500, 240 + Math.sin(t) * 3, 580, 290); ctx.quadraticCurveTo(650, 250, 750, 295); ctx.lineTo(750, 340); ctx.lineTo(430, 340); ctx.fill();
  ctx.fillStyle = '#6a4258'; ctx.fillRect(430, 210, 320, 6); ctx.fillRect(587, 90, 6, 250); ctx.fillRect(420, 336, 340, 10);
  ctx.strokeStyle = '#6a4258'; ctx.lineWidth = 8; ctx.strokeRect(430, 90, 320, 250);
  // plant on the sill
  ctx.fillStyle = '#3a2a3a'; ctx.fillRect(690, 312, 30, 26); ctx.fillStyle = '#4a5a4a'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(705 + (i - 2) * 9, 300 - Math.abs(i - 2) * 4, 6, 16, (i - 2) * .4 + Math.sin(t * 1.3 + i) * .05, 0, 7); ctx.fill(); }
  // light from the window across the room
  beam(ctx, [[430, 340], [750, 340], [880, 640], [330, 640]], C.amberHot, .16, { from: [590, 340], to: [600, 640] });
  // shelf with jars, a framed photo
  ctx.fillStyle = '#2a1c34'; ctx.fillRect(60, 170, 280, 8);
  for (let i = 0; i < 5; i++) { ctx.fillStyle = ['#c98f6a', '#e8a3a0', '#7a5a8c'][i % 3]; ctx.fillRect(80 + i * 50, 126, 32, 44); ctx.fillStyle = 'rgba(255,230,200,.18)'; ctx.fillRect(84 + i * 50, 130, 6, 36); }
  ctx.fillStyle = '#2a1c34'; ctx.fillRect(820, 150, 100, 120); ctx.fillStyle = '#b98a7a'; ctx.fillRect(830, 160, 80, 100);
  ctx.fillStyle = '#5a3a4a'; ctx.beginPath(); ctx.arc(870, 200, 16, 0, 7); ctx.fill(); ctx.fillRect(848, 220, 44, 40);
  const rim = '#ffd2a0', col = '#1a1028', S = 2.05;
  // grandmother: standing at the left end of the table, leaning in, pouring tea
  const gP = { lean: .14, head: .12, sh: [1.05, .55], el: [.55, .75], hip: [.03, -.05], kn: [0, .04], hair: 'bun', skirt: true, bulk: 1.12 };
  const gx = 300, gy = FL - 88 * S;
  figure(ctx, gx, gy, S, gP, { rim, rimSide: 1, col, rimW: 3.5 });
  const [tx, ty] = handPos(gx, gy, S, gP, 0);
  // you: seated on a chair at the right end, forearms on the table, leaning toward her
  const yP = { lean: -.08, head: .22, sh: [1.25, .95], el: [.55, .75], hip: [1.52, 1.45], kn: [1.48, 1.4], hair: 'curly', bulk: 1.05 };
  const yx = 740, yy = 548;
  // chair back (behind you)
  ctx.fillStyle = '#24162a'; ctx.fillRect(782, 380, 14, 260); ctx.fillRect(700, 556, 96, 12); ctx.fillRect(704, 566, 10, 74);
  figure(ctx, yx, yy, S, yP, { rim, rimSide: -1, col, rimW: 3.5, flip: true });
  // table in front of both
  const TT = 470;
  ctx.fillStyle = '#2e1c30'; ctx.fillRect(190, TT, 560, 22); ctx.fillRect(220, TT + 22, 16, FL - TT - 22); ctx.fillRect(704, TT + 22, 16, FL - TT - 22);
  ctx.fillStyle = '#3d2840'; ctx.fillRect(190, TT - 8, 560, 10);  // top surface
  ctx.fillStyle = rgba(C.amberHot, .35); ctx.fillRect(330, TT - 8, 330, 2);
  // teapot in her hand, the pour, two cups, a plate
  ctx.fillStyle = '#ece3d2'; const rot = .35 * pour; ctx.save(); ctx.translate(tx + 14, ty + 6 + 8 * (1 - pour)); ctx.rotate(rot);
  ctx.beginPath(); ctx.ellipse(0, 0, 30, 22, 0, 0, 7); ctx.fill(); ctx.fillRect(-6, -28, 12, 8); ctx.beginPath(); ctx.moveTo(24, -4); ctx.lineTo(50, -16); ctx.lineTo(52, -10); ctx.lineTo(28, 6); ctx.fill(); ctx.restore();
  const ca = Math.cos(rot), sa = Math.sin(rot), sx = tx + 14 + ca * 51 - sa * -13, sy = ty + 6 + sa * 51 + ca * -13;
  const cupX = sx + 4;
  ctx.strokeStyle = rgba('#ffe6c4', .75 * clamp01((pour - .6) / .4)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + 5, sy + 8, sx + 4 + Math.sin(t * 9) * .8, TT - 32); ctx.stroke();
  const cup = (cx) => { ctx.fillStyle = '#ece3d2'; ctx.beginPath(); ctx.moveTo(cx - 18, TT - 38); ctx.lineTo(cx + 18, TT - 38); ctx.lineTo(cx + 14, TT - 8); ctx.lineTo(cx - 14, TT - 8); ctx.fill(); ctx.strokeStyle = '#ece3d2'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx + 20, TT - 24, 8, -1.4, 1.4); ctx.stroke(); };
  cup(cupX); cup(600);
  ctx.fillStyle = '#d9cbb4'; ctx.beginPath(); ctx.ellipse(549, TT - 10, 30, 5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#c98f6a'; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(535 + i * 14, TT - 15, 7, 4.5, 0, 0, 7); ctx.fill(); }
  // steam from your cup
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba(C.cream, .32 - k * .08); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(600 + k * 6 - 6, TT - 40); ctx.bezierCurveTo(588 + k * 8, TT - 80, 618, TT - 100 - k * 10, 600 + Math.sin(t * 1.4 + k) * 10, TT - 140 - k * 16); ctx.stroke(); }
  speckle(ctx, 300, 340, 560, 300, 3000, C.amberHot, .14, 4);
  glow(ctx, 590, 220, 300, .18, C.amber, C.amberHot);
  ctx.restore();
}
