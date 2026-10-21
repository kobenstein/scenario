// c17 · the stations of the dolly through time (17.02), all on the same plain, all under the same sky, 9–11 m from the camera rail (z −13.5):
//   the rock      (x 4.8)   someone sitting in silence on a boulder, back view, starlight on the shoulders            "in silence"
//   the wall      (x 8.4)   an old stone wall with an arched niche, candles, two people kneeling before it (back view) "in prayer"
//   the rooftop   (x 13.9)  a low building of today: lit window, water tank, aerial, street lamp; a person on the roof looking up
//                                                                                                                     "under the night sky"
// No religious symbols anywhere (the niche holds only candles). Everything is a billboard at its depth, drawn in metres (ctx scaled by k).
//   stations(ctx, t, C, K, 'back' | 'front')   back: ground light, rock, wall, building, people; front: the street lamp
import { W, H, rgba, clamp, mix, prng } from '../engine.mjs';
import { hatch as engHatch } from '../engine.mjs';
import { figureBack } from './figure.mjs';
import { groundAffine, mixHex, shadeHex, hash } from './v2_c17_kit.mjs';

const TAU = Math.PI * 2;
export const ROCK = { x: 4.8, z: -4.5 }, WALL = { x: 8.4, z: -3.6 }, HOUSE = { x: 13.9, z: -2.6 }, LAMP = { x: 11.2, z: -3.9 };
const visible = (x, w) => x + w > -40 && x - w < W + 40;
const life = (t, sd) => Math.sin(t * TAU / (4.2 + sd * .31) + sd * 1.9);   // breath, −1..1

// ---------------------------------------------------------------- helpers
function poly(ctx, P, close = true) { ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); if (close) ctx.closePath(); }
function smoothPoly(ctx, P) {   // closed Catmull-Rom through points
  const n = P.length, g = (i) => P[(i + n) % n]; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
  for (let i = 0; i < n; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]); }
  ctx.closePath();
}
function groundGlow(ctx, C, X, Z, R, col, a) {
  const A = groundAffine(C, X, Z); if (!A) return;
  ctx.save(); ctx.setTransform(...A); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R); g.addColorStop(0, rgba(col, a)); g.addColorStop(.35, rgba(col, a * .45)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); ctx.restore();
}
function contact(ctx, C, X, Z, rx, rz, a = .55) {   // a soft dark contact shadow on the ground
  const A = groundAffine(C, X, Z); if (!A) return;
  ctx.save(); ctx.setTransform(...A); ctx.scale(1, rz / rx);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); g.addColorStop(0, rgba('#04030a', a)); g.addColorStop(1, rgba('#04030a', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore();
}
// a candle in metres (origin at its foot), flame flickers on its own phase
function candle(ctx, t, x, y, k, h, sd, glowA = 1) {
  const w = .045 * k, hh = h * k, f = 1 + .12 * Math.sin(t * 9.1 + sd * 4) + .07 * Math.sin(t * 15.3 + sd * 7), sway = .006 * k * Math.sin(t * 3.7 + sd * 2);
  ctx.fillStyle = '#e8d8b8'; ctx.fillRect(x - w / 2, y - hh, w, hh);
  ctx.fillStyle = rgba('#8a6a4a', .45); ctx.fillRect(x + w * .1, y - hh, w * .4, hh);
  const fy = y - hh - .005 * k, fh = .05 * k * f, fw = .016 * k;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(x, fy - fh * .4, 0, x, fy - fh * .4, .32 * k); g.addColorStop(0, rgba('#ffcf8a', .45 * glowA)); g.addColorStop(.3, rgba('#ff9a4a', .12 * glowA)); g.addColorStop(1, rgba('#ff9a4a', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, fy - fh * .4, .32 * k, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba('#fff3d6', .95); ctx.beginPath(); ctx.moveTo(x + sway, fy - fh); ctx.quadraticCurveTo(x + fw, fy - fh * .3, x, fy); ctx.quadraticCurveTo(x - fw, fy - fh * .3, x + sway, fy - fh); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- the rock and the one who sits on it (back view, still, breathing)
const ROCK_P = [[-1.02, 0], [-1.08, .22], [-1.0, .5], [-.8, .74], [-.46, .9], [-.1, .97], [.3, .98], [.62, .9], [.86, .7], [1.0, .42], [1.05, .16], [1.0, 0]];
function rock(ctx, t, C) {
  const p = C.P(ROCK.x, 0, ROCK.z); if (!p) return; const [x, y, k] = p; if (!visible(x, 1.4 * k)) return;
  contact(ctx, C, ROCK.x, ROCK.z, 1.5, .8, .6);
  const P = ROCK_P.map(([u, v]) => [x + u * k, y - v * k]);
  smoothPoly(ctx, P); ctx.fillStyle = '#1b1926'; ctx.fill();
  ctx.save(); smoothPoly(ctx, P); ctx.clip();
  const g = ctx.createLinearGradient(0, y - k, 0, y); g.addColorStop(0, rgba('#7f8cc0', .3)); g.addColorStop(.35, rgba('#3a3f66', .12)); g.addColorStop(1, rgba('#020206', .5));
  ctx.fillStyle = g; ctx.fillRect(x - 1.2 * k, y - 1.05 * k, 2.4 * k, 1.1 * k);
  engHatch(ctx, null, -1.15, Math.max(2.4, k * .03), .32, { box: [x - 1.2 * k, y - 1.05 * k, 2.4 * k, 1.1 * k], col: '#000000', w: .8, fade: [0, y, 0, y - k], seed: 17 });
  const r = prng(171); ctx.strokeStyle = rgba('#05040a', .6); ctx.lineWidth = Math.max(.7, k * .008); ctx.beginPath();
  for (let i = 0; i < 7; i++) { let px = x + (r() - .5) * 1.6 * k, py = y - (.15 + r() * .6) * k; ctx.moveTo(px, py); for (let j = 0; j < 3; j++) { px += (r() - .5) * .25 * k; py += (r() - .3) * .12 * k; ctx.lineTo(px, py); } }
  ctx.stroke();
  ctx.fillStyle = rgba('#a7ae94', .22); for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc(x + (r() - .5) * 1.7 * k, y - (.3 + r() * .65) * k, Math.max(.6, k * (.008 + r() * .012)), 0, TAU); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = rgba('#a4b0dc', .45); ctx.lineWidth = Math.max(.9, k * .012); ctx.beginPath();
  const top = P.slice(2, 11); ctx.moveTo(...top[0]); for (const q of top.slice(1)) ctx.lineTo(...q); ctx.stroke();
  // the sitter: on the top, a little right of the middle, facing away (toward the horizon), head lifted a little
  sitBack(ctx, t, x + .18 * k, y - .965 * k, k, { seed: 5, coat: '#2e3a3c', hat: '#5a4252', hair: '#1a1418', tilt: -.12, rim: '#b9c8ec' });
}
// a person seen from behind, sitting (hips at x,y on the seat), arms around the knees in front (the elbows show at the sides)
function sitBack(ctx, t, x, y, k, o) {
  const b = life(t, o.seed), sy = .007 * b, tilt = o.tilt || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const body = [[-.27, .04], [-.25, .12], [-.2, .2], [-.25, .3], [-.24, .4], [-.225, .5 + sy], [-.17, .565 + sy], [-.07, .585 + sy], [.07, .585 + sy], [.17, .565 + sy], [.225, .5 + sy], [.24, .4], [.25, .3], [.2, .2], [.25, .12], [.27, .04], [.2, -.03], [-.2, -.03]];
  const B = body.map(([u, v]) => [u, -v]);
  // starlight rim (behind, offset up)
  ctx.save(); ctx.translate(0, -.012); smoothPoly(ctx, B); ctx.fillStyle = rgba(o.rim, .7); ctx.fill(); ctx.restore();
  smoothPoly(ctx, B); ctx.fillStyle = o.coat; ctx.fill();
  ctx.save(); smoothPoly(ctx, B); ctx.clip();
  const g = ctx.createLinearGradient(0, -.6, 0, .05); g.addColorStop(0, rgba('#8fa2d0', .22)); g.addColorStop(.4, rgba('#000000', 0)); g.addColorStop(1, rgba('#020204', .55));
  ctx.fillStyle = g; ctx.fillRect(-.4, -.7, .8, .8);
  ctx.strokeStyle = rgba('#05050a', .55); ctx.lineWidth = .009; ctx.beginPath(); ctx.moveTo(0, -.57); ctx.lineTo(.005, -.08);
  ctx.moveTo(-.2, -.22); ctx.quadraticCurveTo(-.14, -.3, -.15, -.42); ctx.moveTo(.2, -.22); ctx.quadraticCurveTo(.14, -.3, .15, -.42); ctx.stroke();
  ctx.restore();
  // neck, head (a knitted hat), lifted a little toward the sky
  const hy = -.7 - sy + tilt * .03;
  ctx.fillStyle = shadeHex(o.coat, -.25); ctx.beginPath(); ctx.ellipse(0, -.6 - sy, .055, .04, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(0, -.012); ctx.fillStyle = rgba(o.rim, .75); ctx.beginPath(); ctx.ellipse(0, hy, .1, .115, 0, 0, TAU); ctx.fill(); ctx.restore();
  ctx.fillStyle = o.hair; ctx.beginPath(); ctx.ellipse(0, hy, .1, .115, 0, 0, TAU); ctx.fill();
  if (o.hat) { ctx.fillStyle = o.hat; ctx.beginPath(); ctx.ellipse(0, hy - .03, .104, .095, 0, Math.PI, TAU); ctx.lineTo(.104, hy - .01); ctx.lineTo(-.104, hy - .01); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba('#000000', .35); ctx.lineWidth = .006; ctx.beginPath(); ctx.moveTo(-.1, hy - .02); ctx.lineTo(.1, hy - .02); ctx.stroke(); }
  ctx.restore();
}

// ---------------------------------------------------------------- the old wall with the niche, candles, two people kneeling
const WALL_TOP = [[-3.0, 2.3], [-2.7, 2.36], [-2.66, 2.62], [-1.8, 2.64], [-1.76, 2.78], [-.2, 2.8], [-.16, 2.62], [.5, 2.6], [.54, 2.72], [1.3, 2.7], [1.34, 2.38], [1.8, 2.33], [1.84, 1.92], [2.25, 1.88], [2.29, 1.42], [2.65, 1.38], [2.69, .82], [3.0, .78]];
const NICHE = { w: .92, y0: .55, y1: 1.55, u: -.45 };   // arched: the arch's centre at y1, radius w/2
function nichePath(ctx, x, y, k, inset = 0) {
  const r = NICHE.w / 2 - inset; ctx.beginPath(); ctx.moveTo(x - r * k, y - (NICHE.y0 + inset) * k); ctx.lineTo(x - r * k, y - NICHE.y1 * k);
  ctx.arc(x, y - NICHE.y1 * k, r * k, Math.PI, TAU); ctx.lineTo(x + r * k, y - (NICHE.y0 + inset) * k); ctx.closePath();
}
const CANDLES = (() => { const r = prng(707), a = []; // [u (m from the wall centre), dz (m in front of the wall), h, seed]; on the niche sill dz = 0
  for (const u of [-.26, -.08, .12, .27]) a.push({ u: u + (r() - .5) * .04, sill: true, h: .1 + r() * .14, sd: r() * 10 });
  for (let i = 0; i < 7; i++) a.push({ u: -1.1 + i * .36 + (r() - .5) * .12, dz: .25 + r() * .35, h: .06 + r() * .12, sd: r() * 10 });
  return a; })();
function wall(ctx, t, C) {
  const p = C.P(WALL.x, 0, WALL.z); if (!p) return; const [x, y, k] = p; if (!visible(x, 3.4 * k)) return;
  const fl = .9 + .06 * Math.sin(t * 7.3) + .04 * Math.sin(t * 12.1);
  groundGlow(ctx, C, WALL.x + NICHE.u, WALL.z - .7, 3.0, '#ff9a4a', .32 * fl);
  contact(ctx, C, WALL.x, WALL.z + .05, 3.3, .35, .5);
  const out = [[-3.0, 0], ...WALL_TOP, [3.0, 0]].map(([u, v]) => [x + u * k, y - v * k]);
  poly(ctx, out); ctx.fillStyle = '#211c22'; ctx.fill();
  ctx.save(); poly(ctx, out); ctx.clip();
  // stone courses: rows of blocks with staggered joints, each block a little different
  const r = prng(313), rowH = .3;
  for (let row = 0, v = 0; v < 3.1; row++, v += rowH) {
    let u = -3.1 - (row % 2) * .3;
    while (u < 3.1) { const L = .45 + r() * .4, sh = r(); ctx.fillStyle = mixHex('#1e1a20', '#352e34', sh * .4); ctx.fillRect(x + u * k + 1, y - (v + rowH) * k + 1, L * k - 2, rowH * k - 2); u += L; }
  }
  ctx.strokeStyle = rgba('#07050a', .7); ctx.lineWidth = Math.max(.7, k * .012); ctx.beginPath();
  const r2 = prng(313);
  for (let row = 0, v = 0; v < 3.1; row++, v += rowH) { const yy = y - v * k; ctx.moveTo(x - 3.1 * k, yy); ctx.lineTo(x + 3.1 * k, yy); let u = -3.1 - (row % 2) * .3; while (u < 3.1) { const L = .45 + r2() * .4; r2(); ctx.moveTo(x + u * k, yy); ctx.lineTo(x + u * k, yy - rowH * k); u += L; } }
  ctx.stroke();
  // the candle light on the stones around the niche, the starlight on the broken top
  const ly = y - .75 * k;
  ctx.globalCompositeOperation = 'lighter';
  const lx0 = x + NICHE.u * k, lg = ctx.createRadialGradient(lx0, ly, 0, lx0, ly, 1.7 * k); lg.addColorStop(0, rgba('#ffb35c', .36 * fl)); lg.addColorStop(.4, rgba('#ff8a3a', .1 * fl)); lg.addColorStop(1, rgba('#ff8a3a', 0));
  ctx.fillStyle = lg; ctx.fillRect(x - 3.2 * k, y - 3.2 * k, 6.4 * k, 3.3 * k);
  ctx.globalCompositeOperation = 'source-over';
  const sg = ctx.createLinearGradient(0, y - 3 * k, 0, y - 1.6 * k); sg.addColorStop(0, rgba('#8e9ac8', .2)); sg.addColorStop(1, rgba('#8e9ac8', 0)); ctx.fillStyle = sg; ctx.fillRect(x - 3.2 * k, y - 3.1 * k, 6.4 * k, 1.6 * k);
  engHatch(ctx, null, -1.05, Math.max(2.4, k * .03), .3, { box: [x - 3.1 * k, y - 3.1 * k, 6.2 * k, 3.1 * k], col: '#000000', w: .8, fade: [x - 3.1 * k, 0, x + 3.1 * k, 0], seed: 23 });
  ctx.restore();
  ctx.strokeStyle = rgba('#a4b0dc', .4); ctx.lineWidth = Math.max(.9, k * .012); poly(ctx, out.slice(1, -1), false); ctx.stroke();
  // the niche: a deep arched recess, warm inside, an inner shadow at the top and one side
  ctx.save(); ctx.translate(NICHE.u * k, 0);
  nichePath(ctx, x, y, k); ctx.fillStyle = '#3a1e14'; ctx.fill();
  ctx.save(); nichePath(ctx, x, y, k); ctx.clip();
  const ng = ctx.createRadialGradient(x, y - (NICHE.y0 + .12) * k, 0, x, y - (NICHE.y0 + .12) * k, 1.3 * k); ng.addColorStop(0, rgba('#ffcf8a', .9 * fl)); ng.addColorStop(.35, rgba('#e07a3a', .6)); ng.addColorStop(1, rgba('#401a10', .2));
  ctx.fillStyle = ng; ctx.fillRect(x - k, y - 2.1 * k, 2 * k, 1.6 * k);
  ctx.fillStyle = rgba('#120806', .55); ctx.beginPath(); ctx.arc(x - .06 * k, y - NICHE.y1 * k + .06 * k, NICHE.w / 2 * k, Math.PI, TAU); ctx.lineTo(x + NICHE.w / 2 * k, y - (NICHE.y1 - .02) * k); ctx.lineTo(x - NICHE.w / 2 * k, y - (NICHE.y1 - .3) * k); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = rgba('#ffcf8a', .5); ctx.lineWidth = Math.max(.8, k * .01); ctx.beginPath(); ctx.moveTo(x - NICHE.w / 2 * k, y - NICHE.y0 * k); ctx.lineTo(x + NICHE.w / 2 * k, y - NICHE.y0 * k); ctx.stroke();
  for (const c of CANDLES) if (c.sill) candle(ctx, t, x + c.u * k, y - NICHE.y0 * k, k, c.h, c.sd, .8);
  ctx.restore();
  // fallen blocks at the broken end
  for (const [u, w, h, a] of [[3.25, .55, .28, .12], [3.7, .45, .24, -.2], [3.45, .4, .2, .3]]) {
    ctx.save(); ctx.translate(x + u * k, y - h / 2 * k); ctx.rotate(a); ctx.fillStyle = '#2a242a'; ctx.fillRect(-w / 2 * k, -h / 2 * k, w * k, h * k);
    ctx.fillStyle = rgba('#8e9ac8', .18); ctx.fillRect(-w / 2 * k, -h / 2 * k, w * k, h * .25 * k); ctx.strokeStyle = rgba('#07050a', .7); ctx.lineWidth = Math.max(.7, k * .01); ctx.strokeRect(-w / 2 * k, -h / 2 * k, w * k, h * k); ctx.restore();
  }
}
function wallFront(ctx, t, C) {   // the candles on the ground and the two people kneeling, in front of the wall
  const p = C.P(WALL.x, 0, WALL.z); if (!p) return; const [x0, , k0] = p; if (!visible(x0, 2.8 * k0)) return;
  for (const c of CANDLES) if (!c.sill) { const q = C.P(WALL.x + NICHE.u + c.u, 0, WALL.z - c.dz); if (q) candle(ctx, t, q[0], q[1], q[2], c.h, c.sd); }
  const L = C.P(WALL.x, .8, WALL.z);
  for (const [dx, dz, o] of [[-.55, -1.2, { seed: 2, cloth: '#3a2c3a', hair: '#151018', shawl: '#5a3c34', bow: .55 }], [.5, -1.05, { seed: 7, cloth: '#2c3540', hair: '#9a948a', bow: .3 }]]) {
    const q = C.P(WALL.x + NICHE.u + dx, 0, WALL.z + dz); if (!q) continue;
    contact(ctx, C, WALL.x + NICHE.u + dx, WALL.z + dz, .45, .3, .55);
    kneelBack(ctx, t, q[0], q[1], q[2], L, o);
  }
}
// a person kneeling, sitting back on the heels, head bowed, hands together in front (hidden), seen from behind; the candles in front
// of them light the edges (warm rim all around the top), the soles of the feet show at the bottom
function kneelBack(ctx, t, x, y, k, L, o) {
  const b = life(t, o.seed), sy = .006 * b, bow = o.bow;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const body = [[-.27, 0], [-.29, .1], [-.26, .24], [-.2, .36], [-.2, .46], [-.215, .62 + sy], [-.2, .74 + sy], [-.13, .8 + sy], [0, .815 + sy], [.13, .8 + sy], [.2, .74 + sy], [.215, .62 + sy], [.2, .46], [.2, .36], [.26, .24], [.29, .1], [.27, 0]];
  const B = body.map(([u, v]) => [u, -v]), hy = -.9 + bow * .07 - sy;
  // the warm rim: the silhouette (with the head) a little larger, behind
  ctx.save(); ctx.scale(1.035, 1.012); smoothPoly(ctx, B); ctx.fillStyle = rgba('#ffb066', .85); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, hy, .108, .118, 0, 0, TAU); ctx.fill(); ctx.restore();
  smoothPoly(ctx, B); ctx.fillStyle = o.cloth; ctx.fill();
  ctx.save(); smoothPoly(ctx, B); ctx.clip();
  const g = ctx.createLinearGradient(0, -.85, 0, 0); g.addColorStop(0, rgba('#ff9a4a', .16)); g.addColorStop(.5, rgba('#000000', .1)); g.addColorStop(1, rgba('#020204', .5));
  ctx.fillStyle = g; ctx.fillRect(-.4, -.9, .8, .95);
  ctx.strokeStyle = rgba('#05050a', .55); ctx.lineWidth = .008; ctx.beginPath(); ctx.moveTo(-.02, -.79); ctx.quadraticCurveTo(0, -.5, -.03, -.3);
  ctx.moveTo(-.2, -.36); ctx.quadraticCurveTo(-.1, -.3, -.02, -.3); ctx.moveTo(.2, -.36); ctx.quadraticCurveTo(.1, -.3, .02, -.3); ctx.stroke();
  // the soles of the feet under the hem
  ctx.fillStyle = '#4a3226'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * .1, -.035, .05, .03, 0, 0, TAU); ctx.fill(); }
  ctx.restore();
  // the head, bowed (lower, the nape shows), hair
  ctx.fillStyle = shadeHex(o.cloth, -.2); ctx.beginPath(); ctx.ellipse(0, -.8 - sy, .06, .035, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = o.hair; ctx.beginPath(); ctx.ellipse(0, hy, .1, .11, 0, 0, TAU); ctx.fill();
  if (o.shawl) {   // a shawl around the shoulders
    ctx.fillStyle = o.shawl; ctx.beginPath(); ctx.moveTo(-.215, -.62 - sy); ctx.quadraticCurveTo(-.2, -.78 - sy, -.06, -.81 - sy); ctx.lineTo(.06, -.81 - sy); ctx.quadraticCurveTo(.2, -.78 - sy, .215, -.62 - sy);
    ctx.quadraticCurveTo(.1, -.5, 0, -.46); ctx.quadraticCurveTo(-.1, -.5, -.215, -.62 - sy); ctx.fill();
    ctx.strokeStyle = rgba('#ffb066', .5); ctx.lineWidth = .008; ctx.beginPath(); ctx.moveTo(-.2, -.7 - sy); ctx.quadraticCurveTo(-.15, -.79 - sy, -.06, -.81 - sy); ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the building of today, the street lamp, the person on the roof
const HW = 6.4, HH = 3.2, PAR = .45;
function house(ctx, t, C, K) {
  const p = C.P(HOUSE.x, 0, HOUSE.z); if (!p) return; const [x, y, k] = p; if (!visible(x, HW * k)) return;
  // window light on the ground
  const A = groundAffine(C, HOUSE.x - 1.2, HOUSE.z - .1);
  if (A) { ctx.save(); ctx.setTransform(...A); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, 0, 0, -2.4); g.addColorStop(0, rgba('#ffcf8a', .3)); g.addColorStop(1, rgba('#ffcf8a', 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-.8, 0); ctx.lineTo(.8, 0); ctx.lineTo(1.5, -2.4); ctx.lineTo(-1.3, -2.4); ctx.closePath(); ctx.fill(); ctx.restore(); }
  contact(ctx, C, HOUSE.x, HOUSE.z + .1, HW * .62, .5, .5);
  const L = x - HW / 2 * k, R = x + HW / 2 * k, T = y - (HH + PAR) * k;
  ctx.fillStyle = '#23222e'; ctx.fillRect(L, T, R - L, y - T);
  ctx.save(); ctx.beginPath(); ctx.rect(L, T, R - L, y - T); ctx.clip();
  // concrete panels, the roof slab line, the lamp's sodium light from the left
  const lx = C.P(LAMP.x, 5.4, LAMP.z), sg = ctx.createRadialGradient(lx ? lx[0] : L, lx ? lx[1] : T, 0, lx ? lx[0] : L, lx ? lx[1] : T, 7.5 * k);
  sg.addColorStop(0, rgba('#ff9a3a', .4)); sg.addColorStop(.45, rgba('#c86a2a', .14)); sg.addColorStop(1, rgba('#c86a2a', 0)); ctx.fillStyle = sg; ctx.fillRect(L, T, R - L, y - T);
  const vg = ctx.createLinearGradient(0, T, 0, y); vg.addColorStop(0, rgba('#8e9ac8', .12)); vg.addColorStop(.3, rgba('#000000', 0)); vg.addColorStop(1, rgba('#020206', .45)); ctx.fillStyle = vg; ctx.fillRect(L, T, R - L, y - T);
  ctx.strokeStyle = rgba('#07060c', .6); ctx.lineWidth = Math.max(.7, k * .01); ctx.beginPath();
  ctx.moveTo(L, y - HH * k); ctx.lineTo(R, y - HH * k); ctx.moveTo(L, y - (HH - .18) * k); ctx.lineTo(R, y - (HH - .18) * k);
  for (let u = -HW / 2 + 1.6; u < HW / 2; u += 1.6) { ctx.moveTo(x + u * k, y - (HH - .18) * k); ctx.lineTo(x + u * k, y); }
  ctx.moveTo(L, y - 1.6 * k); ctx.lineTo(R, y - 1.6 * k); ctx.stroke();
  engHatch(ctx, null, -1.1, Math.max(2.4, k * .03), .26, { box: [L, T, R - L, y - T], col: '#000000', w: .8, fade: [R, 0, L, 0], seed: 41 });
  ctx.restore();
  ctx.strokeStyle = rgba('#a4b0dc', .4); ctx.lineWidth = Math.max(.9, k * .012); ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(R, T); ctx.stroke();
  // the lit window (warm, a lamp inside, a plant on the sill, the frame and a half-drawn blind), the door with its small light
  const wx = x - 1.2 * k, wy = y - 2.25 * k, ww = 1.5 * k, wh = 1.05 * k, fl = 1 + .02 * Math.sin(t * .9);
  const wg = ctx.createLinearGradient(wx - ww / 2, wy, wx + ww / 2, wy + wh); wg.addColorStop(0, '#ffe2a8'); wg.addColorStop(.6, '#ffc274'); wg.addColorStop(1, '#e8924a');
  ctx.fillStyle = wg; ctx.fillRect(wx - ww / 2, wy, ww, wh);
  ctx.fillStyle = rgba('#b8642e', .55); ctx.fillRect(wx - ww / 2, wy, ww, wh * .28);
  ctx.fillStyle = rgba('#5a2e1a', .9); ctx.beginPath(); ctx.ellipse(wx + ww * .3, wy + wh * .95, .1 * k, .05 * k, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba('#3a5a2a', .9); ctx.lineWidth = Math.max(.8, k * .012); ctx.beginPath();
  for (let i = 0; i < 6; i++) { const a = -1.1 + i * .44 + .05 * Math.sin(t * .8 + i); ctx.moveTo(wx + ww * .3, wy + wh * .93); ctx.quadraticCurveTo(wx + ww * .3 + Math.sin(a) * .1 * k, wy + wh * .7, wx + ww * .3 + Math.sin(a) * .2 * k, wy + wh * (.93 - .4 * Math.cos(a))); }
  ctx.stroke();
  ctx.strokeStyle = '#17161f'; ctx.lineWidth = Math.max(1.2, k * .035); ctx.strokeRect(wx - ww / 2, wy, ww, wh); ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx, wy + wh); ctx.stroke();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gw = ctx.createRadialGradient(wx, wy + wh / 2, 0, wx, wy + wh / 2, 1.6 * k); gw.addColorStop(0, rgba('#ffc274', .18 * fl)); gw.addColorStop(1, rgba('#ffc274', 0));
  ctx.fillStyle = gw; ctx.beginPath(); ctx.arc(wx, wy + wh / 2, 1.6 * k, 0, TAU); ctx.fill(); ctx.restore();
  { const w2x = x + 2.35 * k; ctx.fillStyle = '#121220'; ctx.fillRect(w2x - .4 * k, wy, .8 * k, wh); ctx.fillStyle = rgba('#8e9ac8', .12); ctx.fillRect(w2x - .4 * k, wy, .8 * k, wh * .3);
    ctx.strokeStyle = '#17161f'; ctx.lineWidth = Math.max(1.2, k * .03); ctx.strokeRect(w2x - .4 * k, wy, .8 * k, wh); }
  { const rr = prng(97); ctx.strokeStyle = rgba('#07060c', .28); ctx.lineWidth = Math.max(.8, k * .02); ctx.beginPath();   // rain streaks under the roof edge
    for (let i = 0; i < 16; i++) { const u = -HW / 2 + .2 + rr() * (HW - .4), l = .3 + rr() * 1.2; ctx.moveTo(x + u * k, y - (HH - .2) * k); ctx.lineTo(x + (u + (rr() - .5) * .04) * k, y - (HH - .2 - l) * k); } ctx.stroke(); }
  const dx = x + 1.5 * k; ctx.fillStyle = '#15141c'; ctx.fillRect(dx - .45 * k, y - 2.1 * k, .9 * k, 2.1 * k);
  ctx.fillStyle = rgba('#ffe2b8', .9); ctx.beginPath(); ctx.arc(dx + .7 * k, y - 2.25 * k, .05 * k, 0, TAU); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gd = ctx.createRadialGradient(dx + .7 * k, y - 2.25 * k, 0, dx + .7 * k, y - 2.25 * k, .9 * k); gd.addColorStop(0, rgba('#ffe2b8', .3)); gd.addColorStop(1, rgba('#ffe2b8', 0));
  ctx.fillStyle = gd; ctx.beginPath(); ctx.arc(dx + .7 * k, y - 2.25 * k, .9 * k, 0, TAU); ctx.fill(); ctx.restore();
  // an outdoor AC unit with its fan grille, the downpipe
  ctx.fillStyle = '#3a3a46'; ctx.fillRect(x - 2.75 * k, y - 1.25 * k, .7 * k, .5 * k); ctx.strokeStyle = rgba('#0a0a12', .7); ctx.lineWidth = Math.max(.6, k * .008); ctx.beginPath(); ctx.arc(x - 2.4 * k, y - 1.0 * k, .17 * k, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#2e2d38'; ctx.fillRect(x + 3.0 * k, y - (HH + PAR) * k, .08 * k, (HH + PAR) * k);
  // on the roof: a water tank on legs, an aerial, a satellite dish (behind the person)
  const ry = y - HH * k;
  ctx.fillStyle = '#2a2a36'; for (const u of [1.0, 1.9]) ctx.fillRect(x + u * k, ry - .7 * k, .06 * k, .7 * k);
  { const cx = x + 1.47 * k, w2 = .6 * k, top = ry - 1.75 * k, bot = ry - .68 * k, e = .12 * k;   // the tank: a cylinder with a lid
    const tg = ctx.createLinearGradient(cx - w2, 0, cx + w2, 0); tg.addColorStop(0, '#4a4a58'); tg.addColorStop(.35, '#3a3a48'); tg.addColorStop(1, '#1e1e28');
    ctx.fillStyle = tg; ctx.beginPath(); ctx.moveTo(cx - w2, top); ctx.lineTo(cx - w2, bot); ctx.ellipse(cx, bot, w2, e, 0, Math.PI, 0, true); ctx.lineTo(cx + w2, top); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba('#0a0a12', .5); ctx.lineWidth = Math.max(.7, k * .01); ctx.beginPath(); for (const f of [.3, .62]) { const yy = mix(top, bot, f); ctx.moveTo(cx + w2, yy); ctx.ellipse(cx, yy, w2, e, 0, 0, Math.PI); } ctx.stroke();
    ctx.fillStyle = '#4e4e5c'; ctx.beginPath(); ctx.ellipse(cx, top, w2, e, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba('#a4b0dc', .45); ctx.lineWidth = Math.max(.8, k * .01); ctx.beginPath(); ctx.ellipse(cx, top, w2, e, 0, Math.PI, TAU); ctx.stroke(); }
  ctx.strokeStyle = '#2c2c38'; ctx.lineWidth = Math.max(1, k * .02); ctx.beginPath(); ctx.moveTo(x - 2.6 * k, ry); ctx.lineTo(x - 2.6 * k, ry - 2.1 * k);
  for (const [v, w] of [[1.95, .5], [1.75, .4], [1.55, .3]]) { ctx.moveTo(x - (2.6 + w) * k, ry - v * k); ctx.lineTo(x - (2.6 - w) * k, ry - v * k); } ctx.stroke();
  ctx.fillStyle = '#2f2f3a'; ctx.beginPath(); ctx.ellipse(x - 1.6 * k, ry - .5 * k, .28 * k, .32 * k, -.5, 0, TAU); ctx.fill(); ctx.fillRect(x - 1.63 * k, ry - .5 * k, .06 * k, .5 * k);
  // the person on the roof (stands behind the parapet, looks up; the phone lowered, its cool light at the chest)
  const s = k * 1.72 / 185, life2 = Math.sin(t * .23 + 1.3), lp = lx ? { x: lx[0], y: lx[1], col: '#ffb066', a: .75 } : undefined;
  figureBack(ctx, x + .2 * k, ry, s, { t, seed: 11, hold: 'phone', headTilt: -.42 + .05 * life2, dress: { coat: '#4a3a3e', pants: '#1a1a26', hair: '#2a1a14', skin: '#a8714a' }, accent: '#6a7f86', light: lp, glow: { col: '#cfe4ff', a: .55 }, rimFloor: PAR * 185 / 1.72, shade: .1 });
  // the parapet in front of the feet
  ctx.fillStyle = '#262532'; ctx.fillRect(L, ry - PAR * k, R - L, PAR * k);
  ctx.save(); ctx.beginPath(); ctx.rect(L, ry - PAR * k, R - L, PAR * k); ctx.clip(); ctx.fillStyle = sg; ctx.fillRect(L, ry - PAR * k, R - L, PAR * k); ctx.restore();
  ctx.strokeStyle = rgba('#a4b0dc', .42); ctx.lineWidth = Math.max(.9, k * .012); ctx.beginPath(); ctx.moveTo(L, ry - PAR * k); ctx.lineTo(R, ry - PAR * k); ctx.stroke();
}
function lamp(ctx, t, C) {   // a street lamp: pole, arm, sodium head, its light cone on the ground
  const p = C.P(LAMP.x, 0, LAMP.z), h = C.P(LAMP.x, 5.4, LAMP.z); if (!p || !h) return; const [x, y, k] = p; if (!visible(x, 2 * k)) return;
  groundGlow(ctx, C, LAMP.x + .5, LAMP.z, 3.4, '#ff9a3a', .4);
  ctx.strokeStyle = '#1c1b24'; ctx.lineWidth = Math.max(1.2, k * .1); ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(h[0], h[1]); ctx.quadraticCurveTo(h[0] + .1 * k, h[1] - .3 * k, h[0] + .7 * k, h[1] - .25 * k); ctx.stroke();
  ctx.strokeStyle = rgba('#a4b0dc', .3); ctx.lineWidth = Math.max(.6, k * .02); ctx.beginPath(); ctx.moveTo(x + .04 * k, y); ctx.lineTo(h[0] + .04 * k, h[1]); ctx.stroke();
  const hx = h[0] + .75 * k, hy = h[1] - .22 * k;
  ctx.fillStyle = '#2a2830'; ctx.beginPath(); ctx.ellipse(hx, hy, .3 * k, .09 * k, 0, 0, TAU); ctx.fill();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rgba('#ffd08a', .95); ctx.beginPath(); ctx.ellipse(hx, hy + .06 * k, .2 * k, .045 * k, 0, 0, TAU); ctx.fill();
  const g = ctx.createRadialGradient(hx, hy + .05 * k, 0, hx, hy + .05 * k, 1.8 * k); g.addColorStop(0, rgba('#ffb35c', .45)); g.addColorStop(.3, rgba('#ff9a3a', .12)); g.addColorStop(1, rgba('#ff9a3a', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy + .05 * k, 1.8 * k, 0, TAU); ctx.fill();
  const cg = ctx.createLinearGradient(0, hy, 0, y); cg.addColorStop(0, rgba('#ffb35c', .1)); cg.addColorStop(1, rgba('#ffb35c', 0));
  ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(hx - .18 * k, hy + .06 * k); ctx.lineTo(hx + .18 * k, hy + .06 * k); ctx.lineTo(hx + 1.6 * k, y); ctx.lineTo(hx - 1.6 * k, y); ctx.closePath(); ctx.fill();
  ctx.restore();
}

export function prepareStations() {}
// parts in depth order (far → near): 'house' (z −2.6), 'wall' (−3.6), 'lamp' (−3.9), 'rock' (−4.5), 'kneel' (candles −3.9…−4.2, people −4.7)
export const STATION_PARTS = [['house', -2.6], ['wall', -3.6], ['lamp', -3.9], ['rock', -4.5], ['kneel', -4.8]];
export function stations(ctx, t, C, K, part) {
  if (part === 'house') house(ctx, t, C, K); else if (part === 'wall') wall(ctx, t, C); else if (part === 'lamp') lamp(ctx, t, C);
  else if (part === 'rock') rock(ctx, t, C); else if (part === 'kneel') wallFront(ctx, t, C);
}
