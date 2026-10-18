// Small drawn props shared by sections 6 and 7: idea cards, snail, pill, molecule, wooden door, dials, hands.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, prng, addGlow, glow, text } from '../engine.mjs';
import { P, shade, mixHex } from './world.mjs';

// a glowing idea card (the geniuses' output): rounded card with a few lines, cyan or amber
export function ideaCard(ctx, x, y, s, { a = 1, hex = C.cyan, rot = 0, glowA = .5 } = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = a;
  ctx.fillStyle = rgba(hex, .22); ctx.beginPath(); ctx.roundRect(-34, -22, 68, 44, 7); ctx.fill();
  ctx.strokeStyle = rgba(hex, .95); ctx.lineWidth = 2.2; ctx.stroke();
  ctx.fillStyle = rgba('#ffffff', .8); ctx.fillRect(-24, -11, 34, 4); ctx.fillStyle = rgba(hex, .8); ctx.fillRect(-24, -1, 46, 3); ctx.fillRect(-24, 7, 26, 3);
  ctx.restore();
  if (glowA > 0) addGlow(ctx, x, y, 70 * s, glowA * a, hex, hex === C.cyan ? C.cyanWhite : '#fff3dd');
}

// a capsule pill (amber + cream), optional grey = failed
export function capsule(ctx, x, y, len, ang, { grey = 0, a = 1 } = {}) {
  const w = len * .42;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath(); ctx.roundRect(-len / 2, -w / 2, len, w, w / 2); ctx.save(); ctx.clip();
  ctx.fillStyle = mixHex('#f3efe2', '#5a5d7e', grey); ctx.fillRect(-len / 2, -w / 2, len, w);
  ctx.fillStyle = mixHex(P.amber, '#3b3e60', grey); ctx.fillRect(0, -w / 2, len / 2, w);
  const hl = ctx.createLinearGradient(0, -w / 2, 0, w / 2); hl.addColorStop(0, 'rgba(255,255,255,.55)'); hl.addColorStop(.4, 'rgba(255,255,255,0)'); hl.addColorStop(1, 'rgba(40,20,10,.35)');
  ctx.fillStyle = hl; ctx.fillRect(-len / 2, -w / 2, len, w);
  ctx.restore(); ctx.restore();
}

// a snail with a spiral shell, crawling; body stretches rhythmically. (x, y) = foot front point
export function snail(ctx, x, y, s, t) {
  const st = 1 + .06 * Math.sin(t * 2.2);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // slime trail glint
  const tr = ctx.createLinearGradient(-420, 0, -60, 0); tr.addColorStop(0, 'rgba(143,230,255,0)'); tr.addColorStop(1, 'rgba(143,230,255,.28)');
  ctx.fillStyle = tr; ctx.fillRect(-420, -3, 380, 5);
  // body
  ctx.fillStyle = '#6d6a9a'; ctx.beginPath(); ctx.moveTo(-150 * st, 0); ctx.quadraticCurveTo(-60, -10, 20, -26); ctx.quadraticCurveTo(48, -40, 54, -22); ctx.quadraticCurveTo(60, 0, 30, 2); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(-140 * st, -8, 150, 3);
  // eye stalks
  ctx.strokeStyle = '#6d6a9a'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (const [dx, ph] of [[0, 0], [14, 1.3]]) { const ex = 40 + dx + Math.sin(t * 1.4 + ph) * 5, ey = -78 + Math.cos(t * 1.1 + ph) * 4; ctx.beginPath(); ctx.moveTo(34 + dx * .4, -30); ctx.quadraticCurveTo(38 + dx, -56, ex, ey); ctx.stroke(); ctx.fillStyle = '#1b1d3e'; ctx.beginPath(); ctx.arc(ex, ey, 5, 0, 7); ctx.fill(); }
  // shell
  const g = ctx.createRadialGradient(-60, -80, 10, -60, -70, 90); g.addColorStop(0, '#b58a62'); g.addColorStop(1, '#4a3150');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(-62, -66, 70, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(30,18,40,.6)'; ctx.lineWidth = 5; ctx.beginPath();
  for (let i = 0; i < 120; i++) { const q = i / 120 * Math.PI * 5, r = 64 * (1 - i / 130); const px = -62 + Math.cos(q) * r, py = -66 + Math.sin(q) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
  ctx.stroke();
  ctx.restore();
}

// molecule: two fused rings plus side chains. u = how far it is drawn (0..1), atoms snap in with a pop
const MOL = (() => {
  const A = [], B = []; const hex = (cx, cy, r, ph) => { const ids = []; for (let i = 0; i < 6; i++) { const q = ph + i * Math.PI / 3; A.push([cx + Math.cos(q) * r, cy + Math.sin(q) * r, i % 3 === 1 ? 'N' : 'C']); ids.push(A.length - 1); } for (let i = 0; i < 6; i++) B.push([ids[i], ids[(i + 1) % 6]]); return ids; };
  const r1 = hex(-60, 0, 70, Math.PI / 6), r2 = hex(61, 0, 70, Math.PI / 6);
  // side chains
  const add = (from, x, y, k = 'C') => { A.push([x, y, k]); B.push([from, A.length - 1]); return A.length - 1; };
  const s1 = add(r1[3], -210, 0, 'C'); add(s1, -270, -70, 'O'); add(s1, -280, 60, 'N');
  const s2 = add(r2[0], 200, 0, 'C'); const s3 = add(s2, 260, -80, 'C'); add(s3, 350, -70, 'F'); add(s2, 270, 70, 'O');
  return { A, B };
})();
const ATOM = { C: '#8fe6ff', N: '#7fa8ff', O: '#ff8a7a', F: '#ffd29a' };
export function molecule(ctx, x, y, s, t, { u = 1, a = 1, rot = 0, glowA = .5 } = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot + Math.sin(t * .6) * .04); ctx.scale(s, s); ctx.globalAlpha = a;
  const nb = MOL.B.length, na = MOL.A.length;
  ctx.lineCap = 'round';
  MOL.B.forEach(([i, j], k) => {
    const v = clamp(u * nb * 1.15 - k); if (v <= 0) return;
    const [x0, y0] = MOL.A[i], [x1, y1] = MOL.A[j];
    ctx.strokeStyle = rgba(C.cyanWhite, .9); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(mix(x0, x1, v), mix(y0, y1, v)); ctx.stroke();
  });
  MOL.A.forEach(([ax, ay, k], i) => {
    const v = clamp(u * na * 1.1 - i * .95); if (v <= 0) return;
    const pop = v < 1 ? 1 + Math.sin(v * Math.PI) * .5 : 1, r = (k === 'C' ? 16 : 19) * pop;
    ctx.fillStyle = ATOM[k]; ctx.beginPath(); ctx.arc(ax, ay, r, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.arc(ax - r * .3, ay - r * .3, r * .35, 0, 7); ctx.fill();
  });
  ctx.restore();
  if (glowA > 0) addGlow(ctx, x, y, 380 * s, glowA * a, C.cyan, C.cyanWhite);
}

// old wooden door (w x h) centred at x, bottom at y. open = 0..1 gap of warm light at the edge
export function woodDoor(ctx, x, y, w, h, t, { open = 0, light = .8, planks = 4, keyhole = true } = {}) {
  const x0 = x - w / 2, y0 = y - h;
  // light from behind spills around the frame
  if (light > 0) { addGlow(ctx, x, y - h * .5, h * .9, .35 * light, P.amber, '#fff3dd'); ctx.fillStyle = rgba('#ffe2b0', .9 * light); ctx.fillRect(x0 - 4, y - 6, w + 8, 6); }
  ctx.fillStyle = '#2a1a14'; ctx.fillRect(x0 - w * .06, y0 - w * .06, w * 1.12, h + w * .06);
  const pw = w / planks;
  for (let i = 0; i < planks; i++) {
    const g = ctx.createLinearGradient(x0 + i * pw, 0, x0 + (i + 1) * pw, 0); g.addColorStop(0, '#5a3a26'); g.addColorStop(.5, '#6b4630'); g.addColorStop(1, '#4a2f1f');
    ctx.fillStyle = g; ctx.fillRect(x0 + i * pw + 1, y0, pw - 2, h);
    ctx.strokeStyle = 'rgba(30,16,8,.35)'; ctx.lineWidth = 1.5; for (let k = 0; k < 4; k++) { const gx = x0 + i * pw + pw * (.2 + k * .2); ctx.beginPath(); ctx.moveTo(gx, y0); ctx.bezierCurveTo(gx + 4, y0 + h * .3, gx - 4, y0 + h * .6, gx + 2, y); ctx.stroke(); }
  }
  ctx.fillStyle = '#24160f'; ctx.fillRect(x0, y0 + h * .18, w, h * .045); ctx.fillRect(x0, y0 + h * .76, w, h * .045);
  if (keyhole) { const kx = x + w * .3, ky = y0 + h * .52, k = w * .035; ctx.fillStyle = '#ffe2b0'; ctx.beginPath(); ctx.arc(kx, ky, k, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(kx - k * .6, ky); ctx.lineTo(kx - k * 1.1, ky + k * 3); ctx.lineTo(kx + k * 1.1, ky + k * 3); ctx.lineTo(kx + k * .6, ky); ctx.fill(); addGlow(ctx, kx, ky + k, k * 6, .7 * light, P.amber, '#fff3dd'); }
  if (open > 0) { ctx.fillStyle = rgba('#ffe2b0', .9); ctx.fillRect(x + w / 2 - 2, y0, open * 14, h); addGlow(ctx, x + w / 2, y - h / 2, h * .6, .4 * open, P.amber, '#fff3dd'); }
}

// a rotary dial: ring scale with icons around, needle at v (0..1 over the arc), label under
export function dial(ctx, x, y, r, v, t, { label = '', icons = [], glowA = 1, a = 1, sub = '' } = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  addGlow(ctx, x, y, r * 2.2, .35 * glowA * a, P.amber, '#fff3dd');
  // body
  const g = ctx.createRadialGradient(x - r * .3, y - r * .4, r * .1, x, y, r); g.addColorStop(0, '#3a3466'); g.addColorStop(1, '#141638');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba(P.amber, .8); ctx.lineWidth = Math.max(1.5, r * .025); ctx.beginPath(); ctx.arc(x, y, r * .97, 0, 7); ctx.stroke();
  // scale arc (from 225° to -45°, i.e. bottom-left round over top to bottom-right)
  const A0 = Math.PI * .75, A1 = Math.PI * 2.25;
  for (let i = 0; i <= 40; i++) { const q = mix(A0, A1, i / 40), long = i % 10 === 0; ctx.strokeStyle = rgba(i / 40 <= v ? P.amber : C.cream, long ? .9 : .45); ctx.lineWidth = r * (long ? .02 : .012); ctx.beginPath(); ctx.moveTo(x + Math.cos(q) * r * .78, y + Math.sin(q) * r * .78); ctx.lineTo(x + Math.cos(q) * r * (long ? .9 : .86), y + Math.sin(q) * r * (long ? .9 : .86)); ctx.stroke(); }
  // lit arc up to v
  ctx.strokeStyle = rgba(P.amber, .9); ctx.lineWidth = r * .03; ctx.beginPath(); ctx.arc(x, y, r * .72, A0, mix(A0, A1, v)); ctx.stroke();
  // icons around the scale
  icons.forEach((fn, i) => { const q = mix(A0, A1, icons.length > 1 ? i / (icons.length - 1) : .5); const ix = x + Math.cos(q) * r * 1.22, iy = y + Math.sin(q) * r * 1.22; fn(ctx, ix, iy, r * .14, t); });
  // knob + needle
  const q = mix(A0, A1, v);
  ctx.strokeStyle = '#fff3dd'; ctx.lineWidth = r * .045; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(q) * r * .68, y + Math.sin(q) * r * .68); ctx.stroke();
  addGlow(ctx, x + Math.cos(q) * r * .68, y + Math.sin(q) * r * .68, r * .25, .6 * glowA, P.amber, '#fff3dd');
  ctx.fillStyle = '#0d0f2a'; ctx.beginPath(); ctx.arc(x, y, r * .2, 0, 7); ctx.fill(); ctx.strokeStyle = rgba(P.amber, .7); ctx.lineWidth = r * .02; ctx.stroke();
  ctx.restore();
  if (label) text(ctx, label.toUpperCase(), x, y + r * 1.55, { size: Math.max(14, r * .2), weight: 600, color: P.amber, align: 'center', alpha: a, spacing: Math.max(2, r * .03) });
  if (sub) text(ctx, sub, x, y + r * 1.55 + Math.max(20, r * .26), { size: Math.max(14, r * .16), color: C.cream, align: 'center', alpha: a * .85 });
}

// icons for the dial scales (centre x, y, size s)
export const ICON = {
  snail: (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = C.cream; ctx.lineWidth = s * .14; ctx.beginPath(); ctx.arc(-s * .1, -s * .1, s * .5, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(-s * .1, -s * .1, s * .22, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * .9, s * .45); ctx.lineTo(s * .9, s * .45); ctx.lineTo(s * .7, -s * .1); ctx.stroke(); ctx.restore(); },
  bird: (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = C.cream; ctx.lineWidth = s * .14; ctx.lineCap = 'round'; const f = Math.sin(t * 6) * .3; ctx.beginPath(); ctx.moveTo(-s, -s * (.2 + f)); ctx.quadraticCurveTo(-s * .4, -s * .6, 0, 0); ctx.quadraticCurveTo(s * .4, -s * .6, s, -s * (.2 + f)); ctx.stroke(); ctx.restore(); },
  villa: (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.cream; ctx.fillRect(-s, -s * .2, s * 2, s * .9); ctx.beginPath(); ctx.moveTo(-s * 1.15, -s * .2); ctx.lineTo(0, -s * .95); ctx.lineTo(s * 1.15, -s * .2); ctx.fill(); ctx.fillStyle = '#141638'; for (const dx of [-.6, 0, .6]) ctx.fillRect(dx * s - s * .15, s * .05, s * .3, s * .3); ctx.restore(); },
  houses: (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.cream; for (let i = 0; i < 5; i++) { const hx = -s * 1.2 + i * s * .6, hy = (i % 2) * s * .25; ctx.fillRect(hx - s * .22, hy - s * .1, s * .44, s * .5); ctx.beginPath(); ctx.moveTo(hx - s * .28, hy - s * .1); ctx.lineTo(hx, hy - s * .42); ctx.lineTo(hx + s * .28, hy - s * .1); ctx.fill(); } ctx.restore(); },
  click: (ctx, x, y, s) => { ctx.save(); ctx.translate(x - s * .3, y - s * .5); ctx.fillStyle = C.cream; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, s * 1.2); ctx.lineTo(s * .32, s * .88); ctx.lineTo(s * .55, s * 1.3); ctx.lineTo(s * .75, s * 1.2); ctx.lineTo(s * .52, s * .78); ctx.lineTo(s * .9, s * .74); ctx.closePath(); ctx.fill(); ctx.restore(); },
  stock: (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = C.cream; ctx.lineWidth = s * .14; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-s, s * .5); ctx.lineTo(-s * .4, -s * .1); ctx.lineTo(0, s * .2); ctx.lineTo(s, -s * .6); ctx.stroke(); ctx.beginPath(); ctx.moveTo(s * .55, -s * .62); ctx.lineTo(s, -s * .6); ctx.lineTo(s * .95, -s * .15); ctx.stroke(); ctx.restore(); },
  heart: (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.fillStyle = C.rose; ctx.beginPath(); ctx.moveTo(0, s * .8); ctx.bezierCurveTo(-s * 1.3, -s * .1, -s * .6, -s * 1, 0, -s * .35); ctx.bezierCurveTo(s * .6, -s * 1, s * 1.3, -s * .1, 0, s * .8); ctx.fill(); ctx.restore(); },
  globe: (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = C.cyan; ctx.lineWidth = s * .1; ctx.beginPath(); ctx.arc(0, 0, s * .85, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, s * .38, s * .85, 0, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-s * .85, 0); ctx.lineTo(s * .85, 0); ctx.stroke(); ctx.restore(); },
};

// a simple gloved/working hand silhouette pointing direction ang, at x,y (wrist), size s, holding a tool
export function workHand(ctx, x, y, s, ang, { tool = null, skin = '#c98f6a', sleeve = '#2a2f6e' } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = sleeve; ctx.beginPath(); ctx.roundRect(-260, -34, 220, 68, 20); ctx.fill();
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, 0, 52, 38, 0, 0, 7); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.roundRect(30, -30 + i * 16, 46 - Math.abs(i - 1.5) * 6, 14, 7); ctx.fill(); }
  ctx.beginPath(); ctx.roundRect(-6, -54, 44, 16, 8); ctx.fill();
  if (tool === 'hammer') { ctx.fillStyle = '#3a2618'; ctx.fillRect(50, -110, 12, 190); ctx.fillStyle = '#9aa0c8'; ctx.fillRect(28, -130, 60, 30); }
  if (tool === 'wrench') { ctx.fillStyle = '#9aa0c8'; ctx.fillRect(50, -100, 14, 170); ctx.beginPath(); ctx.arc(57, -110, 24, 0, 7); ctx.fill(); ctx.fillStyle = '#141638'; ctx.fillRect(50, -140, 14, 30); }
  ctx.restore();
}
