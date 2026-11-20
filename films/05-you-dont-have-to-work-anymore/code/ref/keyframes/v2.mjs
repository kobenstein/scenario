// V2-2 · graphic -> scene transition (type b, push-in). §2/§4: the camera pushes into one lit cell of the "Belonging"
// level; the cell grows toward the lens and becomes a window into a real afternoon: you visiting your grandmother on a Tuesday.
// Mid-transition frame: pyramid still legible around it (label, neighbouring cells), smear ghosts of the cell's path.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, figure, handPos, save, prng, mix, text, beam, speckle } from './lib.mjs';
import { pyrGeo, drawPyramid, drawLabels } from './pyr.mjs';

function kitchen(ctx, x, y, w, h, t) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.clip();
  ctx.translate(x, y); const s = w / 1000;
  ctx.scale(s, s); const HH = h / s;
  // warm afternoon kitchen
  vgrad(ctx, [[0, '#3b2a4e'], [.7, '#5a3a4a'], [1, '#2a1c3a']], 0, 0, 1000, HH);
  // back window with afternoon sky
  ctx.fillStyle = '#f2b98a'; ctx.fillRect(560, 70, 300, 250); vgrad(ctx, [[0, '#e9a07f'], [1, '#ffd2a0']], 560, 70, 300, 250);
  ctx.fillStyle = '#7a4a5a'; ctx.fillRect(560, 190, 300, 6); ctx.fillRect(707, 70, 6, 250);
  ctx.fillStyle = 'rgba(60,40,70,.6)'; ctx.beginPath(); ctx.moveTo(560, 300); ctx.quadraticCurveTo(620, 250, 700, 300); ctx.quadraticCurveTo(760, 260, 860, 300); ctx.lineTo(860, 320); ctx.lineTo(560, 320); ctx.fill(); // trees outside
  // light from the window across the table
  beam(ctx, [[560, 320], [860, 320], [760, 640], [300, 640]], C.amberHot, .18, { from: [700, 320], to: [520, 640] });
  // shelf with jars
  ctx.fillStyle = '#2a1c34'; ctx.fillRect(120, 150, 300, 8); for (let i = 0; i < 6; i++) { ctx.fillStyle = ['#c98f6a', '#e8a3a0', '#7a5a8c'][i % 3]; ctx.fillRect(140 + i * 46, 108, 30, 42); }
  // table
  ctx.fillStyle = '#2a1a2e'; ctx.fillRect(230, 520, 560, 18); ctx.fillRect(260, 538, 14, 160); ctx.fillRect(746, 538, 14, 160);
  ctx.fillStyle = rgba(C.cream, .25); ctx.fillRect(230, 518, 560, 3);
  // grandmother (left, standing, pouring) and you (right, seated, leaning in)
  const rim = '#ffd2a0', col = '#1a1028';
  const gP = { lean: .12, head: .3, sh: [1.25, .5], el: [.35, .9], hip: [.04, -.06], kn: [0, .05], hair: 'grey', skirt: true, bulk: 1.15 };
  figure(ctx, 360, 420, 1.12, gP, { rim, rimSide: 1, col, rimW: 2.4 });
  const [tx, ty] = handPos(360, 420, 1.12, gP, 0);
  ctx.fillStyle = '#e9e1d0'; ctx.beginPath(); ctx.ellipse(tx + 10, ty + 4, 20, 14, 0, 0, 7); ctx.fill(); ctx.fillRect(tx + 26, ty - 2, 14, 4);   // teapot
  ctx.strokeStyle = rgba('#e9e1d0', .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx + 40, ty); ctx.quadraticCurveTo(tx + 52, ty + 30, tx + 50, 505); ctx.stroke(); // pour
  ctx.fillStyle = '#e9e1d0'; ctx.fillRect(tx + 40, 500, 22, 18); ctx.fillRect(560, 500, 22, 18);  // cups
  const yP = { lean: .2, head: .15, sh: [1.2, 1.0], el: [.5, .7], hip: [1.5, 1.45], kn: [1.5, 1.45], hair: 'curly', bulk: 1.1 };
  figure(ctx, 660, 470, 1.05, yP, { rim, rimSide: -1, col, rimW: 2.4, flip: true });
  // steam
  for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba(C.cream, .3 - k * .08); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(571, 498); ctx.bezierCurveTo(560 + k * 6, 470, 590, 450 - k * 10, 575 + Math.sin(t + k) * 8, 420 - k * 14); ctx.stroke(); }
  speckle(ctx, 300, 320, 500, 320, 2500, C.amberHot, .15, 4);
  ctx.restore();
}

export function frame(t, out) {
  const [cv, ctx] = canvas();
  vgrad(ctx, [[0, '#070918'], [1, '#141640']]);
  stars(ctx, t, { n: 80, y1: 400, a: .2, seed: 7 });
  // pyramid seen at ~2.4x, camera centred on the Belonging level (lit) - the push is underway
  const P = pyrGeo(800, 880, 1040, 690);
  const z = 2.35, fx = 760, fy = 640;
  ctx.save(); ctx.translate(W / 2 - 120, H / 2); ctx.scale(z, z); ctx.translate(-fx, -fy);
  drawPyramid(ctx, t, P, { lit: [1, .85, 0, 0, 0], cellsLit: [1, .7, 0, 0, 0], labels: false });
  ctx.restore();
  // label of the level, screen space, large (legible during the push)
  const L = P.lv[1], ym = (W / 2 - 120) + ((L.y0 + L.y1) / 2 - fy) * 0;
  { const sy = H / 2 + (((L.y0 + L.y1) / 2) - fy) * z, sxr = W / 2 - 120 + (mix(L.xr0, L.xr1, .5) - fx) * z;
    ctx.strokeStyle = rgba(C.amber, .6); ctx.lineWidth = 1.4; ctx.setLineDash([2, 6]); ctx.beginPath(); ctx.moveTo(sxr + 14, sy); ctx.lineTo(1560, sy); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'Belonging', 1580, sy + 16, { size: 52, font: 'Instrument Serif' });
    text(ctx, 'MASLOW’S HIERARCHY OF NEEDS', 1582, sy + 52, { size: 15, weight: 600, color: C.muted, spacing: 5 }); }
  // the chosen cell: original screen position (small) -> current (large); smear ghosts along the path
  const c0 = { x: 700, y: 570, w: 40, h: 54 }, c1 = { x: 330, y: 170, w: 960, h: 640 };
  for (let k = 1; k <= 4; k++) { const u = k / 5, x = mix(c0.x, c1.x, u * u), y = mix(c0.y, c1.y, u * u), w = mix(c0.w, c1.w, u * u), h = mix(c0.h, c1.h, u * u); ctx.strokeStyle = rgba(C.amberHot, .1 + .08 * k); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w, h, 4 + k * 2); ctx.stroke(); }
  glow(ctx, c1.x + c1.w / 2, c1.y + c1.h / 2, 900, .25, C.amber, C.amberHot);
  ctx.fillStyle = '#05061a'; ctx.beginPath(); ctx.roundRect(c1.x - 8, c1.y - 8, c1.w + 16, c1.h + 16, 14); ctx.fill();
  kitchen(ctx, c1.x, c1.y, c1.w, c1.h, t);
  ctx.strokeStyle = rgba('#fff1d6', .9); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(c1.x, c1.y, c1.w, c1.h, 10); ctx.stroke();
  finish(ctx, t, { grain: .05, vig: .6 });
  save(cv, out);
}
frame(0, process.argv[2] || 'v2.png');
