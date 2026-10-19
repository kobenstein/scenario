// Transition demo, type (b) PUSH-IN: shot 0.03 -> 0.04 ("On your phone, one message." -> "Your income is taken care of.")
// Bedroom at first light. The phone lights up (anticipation). The camera pushes through the window pane toward the Hill
// across the bay; the window bars sweep past the lens (room layer zooms faster than the world = parallax).
// On arrival the bottom tier of the Hill ignites in a wave from the centre outward: the base of the pyramid, security.
// 5.0 s @ 30 fps. Usage: node demo.mjs <outdir>  (writes PNG frames), then ffmpeg.
import fs from 'node:fs';
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, figure, handPos, hillGeo, drawHill, save, prng, mix, clamp, lin, sm, eio, drift, beam, speckle } from './lib.mjs';

const wx = 1010, wy = 110, ww = 760, wh = 640, hz = wy + wh * .74;
const G = hillGeo(wx + 330, hz, 150, hz - 175);
const AX = G.cx, AY = hz - 70;                         // push target: the middle of the Hill
const quart = (x) => x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2;

function world(ctx, t, ign) {
  // sky, sun, far hills, the Hill, the bay. All in world coordinates (same as K1's window).
  vgrad(ctx, [[0, '#2b2a6a'], [.35, '#4a3a7e'], [.62, '#9a6a9a'], [.85, '#f39a86'], [1, '#ffb98a']], wx - 1400, wy - 500, ww + 2800, (hz - wy) + 500);
  glow(ctx, wx + ww * .62, hz - 10, 420, .32, C.dusk, C.amberHot);
  stars(ctx, t, { n: 60, x0: wx - 400, x1: wx + ww + 400, y0: wy - 300, y1: wy + 160, a: .3 });
  ctx.fillStyle = '#9a6f93'; ctx.beginPath(); ctx.moveTo(wx - 600, hz); ctx.lineTo(wx - 300, hz - 22); ctx.lineTo(wx + 120, hz - 26); ctx.lineTo(wx + 260, hz - 8); ctx.lineTo(wx + 560, hz - 6); ctx.lineTo(wx + 680, hz - 30); ctx.lineTo(wx + ww + 500, hz - 12); ctx.lineTo(wx + ww + 500, hz); ctx.fill();
  // ignition wave: each window turns on when the wave front (from the centre outward) passes it, 40-120 ms stagger built in
  const front = ign * 190;
  const litFn = (wn, h) => h.b === 0 ? clamp((front - Math.abs(wn.x - G.cx) - wn.on * 18) / 14) : 0;
  drawHill(ctx, t, G, { litFn, body: '#4a3a76', body2: '#2e2760', scale: .3, seed: 21, noTrees: true });
  if (ign > 0) for (let i = -20; i <= 20; i++) { const x = G.cx + i * 7.5; if (Math.abs(x - G.cx) > front) continue; glow(ctx, x, hz - 12, 14, .18, C.amber, C.amberHot); }
  // warm wash along the shore that follows the wave
  if (ign > 0) glow(ctx, G.cx, hz - 8, Math.min(front, 170) * 1.2 + 10, .5 * sm(ign), C.amber, C.amberHot, { sy: .22 });
  // bay
  vgrad(ctx, [[0, '#6d5a8e'], [1, '#2a2a5e']], wx - 1400, hz, ww + 2800, 600);
  const r = prng(3); for (let i = 0; i < 160; i++) { const y = hz + Math.pow(r(), 1.5) * 300, x = wx + ww * .62 + (r() - .5) * 300 * (1 + (y - hz) / 100) + drift(t, 4, i); ctx.fillStyle = rgba(C.amberHot, .5 * r()); ctx.fillRect(x, y, 6 + r() * 26, 1.5); }
  // reflections of the lit windows on the water
  if (ign > 0) for (let i = 0; i < 40; i++) { const x = G.cx + (i - 20) * 8; if (Math.abs(x - G.cx) > front) continue; ctx.fillStyle = rgba(C.amberHot, .35 * (.5 + .5 * Math.sin(t * 3 + i))); ctx.fillRect(x, hz + 3 + (i % 3) * 3, 2, 6 + (i % 4) * 2); }
}

function room(ctx, t, phone) {
  // wall with the window cut out (even-odd), so the world shows through
  ctx.save(); ctx.beginPath(); ctx.rect(-4000, -4000, W + 8000, H + 8000); ctx.rect(wx, wy, ww, wh);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0e1034'); g.addColorStop(.7, '#16184a'); g.addColorStop(1, '#0b0c28'); ctx.fillStyle = g; ctx.fill('evenodd'); ctx.restore();
  glow(ctx, wx + ww / 2, wy + wh / 2, 900, .1, C.rose, C.dusk);
  ctx.fillStyle = '#0a0b26';
  ctx.fillRect(wx - 14, wy - 14, ww + 28, 14); ctx.fillRect(wx - 14, wy, 14, wh); ctx.fillRect(wx + ww, wy, 14, wh);
  ctx.fillRect(wx + ww / 2 - 6, wy, 12, wh); ctx.fillRect(wx, wy + wh * .42, ww, 10);
  ctx.fillStyle = '#1d1f58'; ctx.fillRect(wx - 30, wy + wh, ww + 60, 18);
  // curtain breathing in the draught
  ctx.save(); ctx.globalAlpha = .16; const cg = ctx.createLinearGradient(wx - 40, 0, wx + 140, 0); cg.addColorStop(0, '#f3efe2'); cg.addColorStop(1, 'rgba(243,239,226,0)'); ctx.fillStyle = cg;
  ctx.beginPath(); ctx.moveTo(wx - 14, wy - 20); for (let y = wy - 20; y <= wy + wh + 10; y += 10) ctx.lineTo(wx + 60 + Math.sin(y * .018 + t * 1.3) * 22, y); ctx.lineTo(wx - 14, wy + wh + 10); ctx.fill(); ctx.restore();
  vgrad(ctx, [[0, '#0d0e2e'], [1, '#07081c']], -2000, 860, W + 4000, 1500);
  const q = [[wx + 60, 862], [wx + ww - 40, 862], [wx + ww - 380, H], [wx - 560, H]];
  beam(ctx, q, C.amber, .26, { from: [wx + 300, 862], to: [wx - 100, H] });
  const bx = 120, by = 760;
  ctx.fillStyle = '#0a0b24'; ctx.fillRect(bx, by + 40, 860, 140);
  ctx.fillStyle = '#2c2b66'; ctx.beginPath(); ctx.moveTo(bx - 20, by + 60); ctx.bezierCurveTo(bx + 100, by - 10, bx + 400, by + 30, bx + 620, by + 6); ctx.bezierCurveTo(bx + 760, by - 8, bx + 880, by + 20, bx + 900, by + 70); ctx.lineTo(bx + 900, by + 150); ctx.lineTo(bx - 20, by + 150); ctx.fill();
  ctx.fillStyle = rgba(C.rose, .5); ctx.beginPath(); ctx.moveTo(bx + 330, by + 22); ctx.bezierCurveTo(bx + 500, by + 4, bx + 700, by - 12, bx + 900, by + 70); ctx.lineTo(bx + 900, by + 84); ctx.bezierCurveTo(bx + 700, by + 8, bx + 500, by + 20, bx + 330, by + 36); ctx.fill();
  ctx.fillStyle = '#0c0d2c'; ctx.fillRect(bx - 40, 540, 30, 300);
  ctx.fillStyle = '#3a3878'; ctx.beginPath(); ctx.ellipse(bx + 110, by + 4, 120, 34, -.08, 0, 7); ctx.fill();
  { const r = prng(12); for (let i = 0; i < 60; i++) { const u = r(), y = mix(870, H, r()) - ((t * 12 + i * 7) % 60), x = mix(wx + 300, wx - 200, (y - 870) / (H - 870)) + (r() - .5) * 500 + Math.sin(t * .7 + i) * 8; ctx.fillStyle = rgba(C.amberHot, .25 + .5 * u); ctx.beginPath(); ctx.arc(x, y, .8 + u * 1.6, 0, 7); ctx.fill(); } }
  // you: breathing, head lifts slightly toward the window as the camera leaves (secondary action)
  const look = sm(lin(1.2, 2.6, t));
  const pose = { lean: .17 - .06 * look + .006 * Math.sin(t * 2.2), head: .38 - .45 * look, sh: [1.05, .95], el: [1.35, 1.5], hip: [1.42, 1.32], kn: [1.62, 1.4], bulk: 1.25, hair: 'curly' };
  const fx = 820, fy = by + 26, s = 2.45;
  figure(ctx, fx, fy, s, pose, { rim: '#ffc893', rimSide: 1, col: '#100e2c', rimW: 3 });
  const [px, py] = handPos(fx, fy, s, pose, 0);
  ctx.save(); ctx.translate(px + 6, py - 18); ctx.rotate(-.9); ctx.fillStyle = '#0b0d22'; ctx.fillRect(-9, -18, 18, 34); ctx.fillStyle = rgba(C.cyanWhite, .55 + .45 * phone); ctx.fillRect(-7, -16, 14, 30); ctx.restore();
  glow(ctx, px + 4, py - 22, 90 + 70 * phone, .25 + .3 * phone, C.cyan, C.cyanWhite);
}

export function frame(t) {
  const [cv, ctx] = canvas();
  // phone flash: the message arrives (anticipation before the move)
  const phone = Math.exp(-Math.pow((t - .55) / .18, 2)) * .9 + .1;
  // camera: tiny breathing push, then the push-in (quart in-out 0.9 -> 3.3 s), then a slow continuing push (never still)
  const u = quart(lin(.9, 3.3, t)), tail = Math.max(0, t - 3.3) * .05;
  const zW = mix(1.0, 3.6, u) * (1 + tail) * (1 + .01 * lin(0, .9, t));   // world zoom
  const zR = Math.pow(zW, 1.9);                                             // room zooms faster (it is nearer): parallax
  const cx = mix(W / 2, AX, sm(lin(.9, 3.3, t))), cy = mix(H / 2, AY, sm(lin(.9, 3.3, t)));
  const dx = drift(t, 4, 1), dy = drift(t, 3, 2);
  // world
  ctx.save(); ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(zW, zW); ctx.translate(-cx, -cy);
  ctx.fillStyle = '#2b2a6a'; ctx.fillRect(-4000, -4000, 9000, 9000);
  const ign = clamp((t - 2.75) / 1.6);
  world(ctx, t, ign);
  ctx.restore();
  // room (fades only once the bars have left the frame)
  const roomA = 1 - sm(lin(2.05, 2.35, t));
  if (roomA > 0) {
    ctx.save(); ctx.globalAlpha = roomA; ctx.translate(W / 2 + dx * 1.6, H / 2 + dy * 1.6); ctx.scale(zR, zR); ctx.translate(-cx, -cy);
    room(ctx, t, phone); ctx.restore();
  }
  // motion blur proxy on the fastest part of the push: a soft radial smear
  const sp = Math.max(0, quart(lin(.9, 3.3, t + 1 / 60)) - quart(lin(.9, 3.3, t - 1 / 60)));
  if (sp > .01) { ctx.save(); ctx.globalAlpha = Math.min(.35, sp * 4); ctx.translate(W / 2, H / 2); ctx.scale(1.02, 1.02); ctx.translate(-W / 2, -H / 2); ctx.drawImage(cv, 0, 0); ctx.restore(); }
  finish(ctx, t, { grain: .05, vig: .6 });
  return cv;
}

const outDir = process.argv[2];
if (outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const N = 150, only = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
  for (let f = 0; f < N; f++) { if (only && !only.includes(f)) continue; save(frame(f / 30), `${outDir}/f${String(f).padStart(4, '0')}.png`); }
}
