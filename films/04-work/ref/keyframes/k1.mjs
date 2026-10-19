// K1 · Cold open "Tomorrow morning, you wake up. No alarm. On your phone, one message."
// Bedroom at first light. Across the bay, small in the window: the Hill, its shoreline row of lights faintly on.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, figure, handPos, hillGeo, drawHill, sea, save, prng, mix, speckle, beam } from './lib.mjs';
export function frame(t, out) {
  const [cv, ctx] = canvas();
  // room wall
  vgrad(ctx, [[0, '#0e1034'], [.7, '#16184a'], [1, '#0b0c28']]);
  // window opening (right side, radical asymmetry)
  const wx = 1010, wy = 110, ww = 760, wh = 640;
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  vgrad(ctx, [[0, '#2b2a6a'], [.45, '#7a5f9a'], [.72, '#f39a86'], [.8, '#ffb98a']], wx, wy, ww, wh * .78);
  glow(ctx, wx + ww * .62, wy + wh * .72, 420, .42, C.dusk, C.amberHot);
  stars(ctx, t, { n: 40, x0: wx, x1: wx + ww, y0: wy, y1: wy + 200, a: .35 });
  // far hills + the Hill across the bay
  const hz = wy + wh * .74;
  ctx.fillStyle = '#9a6f93'; ctx.beginPath(); ctx.moveTo(wx, hz); ctx.lineTo(wx + 120, hz - 26); ctx.lineTo(wx + 260, hz - 8); ctx.lineTo(wx + 560, hz - 6); ctx.lineTo(wx + 680, hz - 30); ctx.lineTo(wx + ww, hz - 12); ctx.lineTo(wx + ww, hz); ctx.fill();
  const G = hillGeo(wx + 330, hz, 150, hz - 175);
  drawHill(ctx, t, G, { lit: [.9, 0, 0, 0, 0], body: '#4a3a76', body2: '#2e2760', scale: .3, seed: 21, noTrees: true });
  // water of the bay
  vgrad(ctx, [[0, '#6d5a8e'], [1, '#2a2a5e']], wx, hz, ww, wh - (hz - wy));
  const r = prng(3); for (let i = 0; i < 120; i++) { const y = hz + Math.pow(r(), 1.5) * (wy + wh - hz), x = wx + ww * .62 + (r() - .5) * 300 * (1 + (y - hz) / 100); ctx.fillStyle = rgba(C.amberHot, .5 * r()); ctx.fillRect(x, y, 6 + r() * 26, 1.5); }
  for (let i = 0; i < 6; i++) { const x = G.cx - 120 + i * 48; ctx.fillStyle = rgba(C.amberHot, .35); ctx.fillRect(x, hz + 3, 2, 14); }
  ctx.restore();
  // window frame + cross, sill
  ctx.fillStyle = '#0a0b26';
  ctx.fillRect(wx - 14, wy - 14, ww + 28, 14); ctx.fillRect(wx - 14, wy, 14, wh); ctx.fillRect(wx + ww, wy, 14, wh);
  ctx.fillRect(wx + ww / 2 - 6, wy, 12, wh); ctx.fillRect(wx, wy + wh * .42, ww, 10);
  ctx.fillStyle = '#1d1f58'; ctx.fillRect(wx - 30, wy + wh, ww + 60, 18);
  // sheer curtain on the left edge of the window, lit through
  ctx.save(); ctx.globalAlpha = .16; const cg = ctx.createLinearGradient(wx - 40, 0, wx + 140, 0); cg.addColorStop(0, '#f3efe2'); cg.addColorStop(1, 'rgba(243,239,226,0)'); ctx.fillStyle = cg;
  ctx.beginPath(); ctx.moveTo(wx - 14, wy - 20); for (let y = wy - 20; y <= wy + wh + 10; y += 10) ctx.lineTo(wx + 60 + Math.sin(y * .018 + t) * 22, y); ctx.lineTo(wx - 14, wy + wh + 10); ctx.fill(); ctx.restore();
  // floor
  vgrad(ctx, [[0, '#0d0e2e'], [1, '#07081c']], 0, 860, W, H - 860);
  // window light patch on the floor (with the cross shadow), thrown toward the viewer
  { const q = [[wx + 60, 862], [wx + ww - 40, 862], [wx + ww - 380, H], [wx - 560, H]];
    beam(ctx, q, C.amber, .26, { from: [wx + 300, 862], to: [wx - 100, H] });
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#5a4a8a';
    const L = (u, v) => [mix(mix(q[0][0], q[1][0], u), mix(q[3][0], q[2][0], u), v), mix(862, H, v)];
    ctx.beginPath(); const a1 = L(.49, 0), a2 = L(.51, 0), a3 = L(.51, 1), a4 = L(.51 - .04, 1); ctx.moveTo(...a1); ctx.lineTo(...a2); ctx.lineTo(...a3); ctx.lineTo(...a4); ctx.fill();
    ctx.fillRect(0, mix(862, H, .35), W, 9); ctx.restore(); }
  // soft bounce of the dawn on the back wall around the window
  glow(ctx, wx + ww / 2, wy + wh / 2, 900, .12, C.rose, C.dusk);
  // the bed: low, duvet in shadow with a lit top edge
  const bx = 120, by = 760;
  ctx.fillStyle = '#0a0b24'; ctx.fillRect(bx, by + 40, 860, 140);
  ctx.fillStyle = '#2c2b66'; ctx.beginPath(); ctx.moveTo(bx - 20, by + 60); ctx.bezierCurveTo(bx + 100, by - 10, bx + 400, by + 30, bx + 620, by + 6); ctx.bezierCurveTo(bx + 760, by - 8, bx + 880, by + 20, bx + 900, by + 70); ctx.lineTo(bx + 900, by + 150); ctx.lineTo(bx - 20, by + 150); ctx.fill();
  ctx.fillStyle = rgba(C.rose, .5); ctx.beginPath(); ctx.moveTo(bx + 330, by + 22); ctx.bezierCurveTo(bx + 500, by + 4, bx + 700, by - 12, bx + 900, by + 70); ctx.lineTo(bx + 900, by + 84); ctx.bezierCurveTo(bx + 700, by + 8, bx + 500, by + 20, bx + 330, by + 36); ctx.fill();
  // pillow + headboard
  ctx.fillStyle = '#0c0d2c'; ctx.fillRect(bx - 40, 540, 30, 300);
  ctx.fillStyle = '#3a3878'; ctx.beginPath(); ctx.ellipse(bx + 110, by + 4, 120, 34, -.08, 0, 7); ctx.fill();
  // grain falloff of the beam on the duvet
  speckle(ctx, bx + 300, by - 20, 600, 140, 2400, C.amberHot, .18, 9);
  // dust motes in the beam
  { const r = prng(12); for (let i = 0; i < 70; i++) { const u = r(), y = mix(870, H, r()), x = mix(wx + 300, wx - 200, (y - 870) / (H - 870)) + (r() - .5) * 500 + Math.sin(t * .5 + i) * 6; ctx.fillStyle = rgba(C.amberHot, .25 + .5 * u); ctx.beginPath(); ctx.arc(x, y - 20, .8 + u * 1.6, 0, 7); ctx.fill(); } }
  // "you": sitting on the bed edge, facing the window, reading the phone with both hands
  const pose = { lean: .17, head: .38, sh: [1.05, .95], el: [1.35, 1.5], hip: [1.42, 1.32], kn: [1.62, 1.4], bulk: 1.25, hair: 'curly' };
  const fx = 820, fy = by + 26, s = 2.45;
  figure(ctx, fx, fy, s, pose, { rim: '#ffc893', rimSide: 1, col: '#100e2c', rimW: 3 });
  const [px, py] = handPos(fx, fy, s, pose, 0);
  // phone: the one cool light in a warm room (the message)
  ctx.save(); ctx.translate(px + 6, py - 18); ctx.rotate(-.9); ctx.fillStyle = '#0b0d22'; ctx.fillRect(-9, -18, 18, 34); ctx.fillStyle = rgba(C.cyanWhite, .9); ctx.fillRect(-7, -16, 14, 30); ctx.restore();
  glow(ctx, px + 4, py - 22, 120, .35, C.cyan, C.cyanWhite);
  finish(ctx, t, { grain: .05, vig: .6 });
  save(cv, out);
}
frame(0, process.argv[2] || 'k1.png');
