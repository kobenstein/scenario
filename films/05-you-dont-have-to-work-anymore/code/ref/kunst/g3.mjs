// G3 · a life in weeks: 80 years x 52 weeks = 4,160 squares (about 4,000). Built like a wall of lit windows
// that a small person looks up at. Row 0 at the bottom: life climbs, like the hill.
// Lived weeks glow amber. Working weeks (age 20–65, 47 weeks a year) are crossed off in ink.
// ≈ 80,000 working hours = 45 years x 47 weeks x ~38 h (own calculation), stated as such.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, fog, bloom, pool, person, printFinish, vnoise, quadMap } from './art.mjs';
import { text, save } from './lib.mjs';

const AMBER = '#ffb35c', HOT = '#ffd9a0', INK = '#0a0d24', RUST = '#a8462a';
export function frame(out) {
  const [cv, ctx] = layer();
  { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#05071a'); g.addColorStop(.6, '#0d1236'); g.addColorStop(1, '#1b1d4a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  // the wall: a quad that leans back (seen from below), 52 columns x 80 rows
  const Q = [[330, 70], [930, 70], [1010, 960], [250, 960]], m = quadMap(Q);
  const COLS = 52, ROWS = 80;
  // glow behind/around the wall
  bloom(ctx, 630, 620, 760, { col: AMBER, core: HOT, a: .18, k: .35, seed: 2, sy: .9 });
  roughPoly(ctx, [m(-.02, -.012), m(1.02, -.012), m(1.02, 1.01), m(-.02, 1.01)], '#0b0e2a', { amp: 1.5, seed: 3 });
  const r = prng(7), n = vnoise(4);
  const [wc, wx] = layer();
  for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
    const age = row, v0 = 1 - (row + 1) / ROWS, v1 = 1 - row / ROWS, u0 = col / COLS, u1 = (col + 1) / COLS, gu = .16 / COLS, gv = .2 / ROWS;
    const q = [m(u0 + gu, v0 + gv), m(u1 - gu, v0 + gv), m(u1 - gu, v1 - gv), m(u0 + gu, v1 - gv)];
    const work = age >= 20 && age < 65 && !(col >= 30 && col < 32) && !(col >= 49);   // 47 working weeks, 5 weeks off
    const flick = .82 + .18 * n(col * .4, row * .3);
    const fill = work ? mixHex('#8a3a22', '#a9502c', flick - .5) : mixHex('#f0a24e', HOT, (flick - .82) * 4);
    roughPoly(wx, q, fill, { amp: .35, step: 3, seed: row * 97 + col });
    if (work) { const [a, b] = [quadMap(q)(.12, .88), quadMap(q)(.88, .12)]; wx.strokeStyle = rgba('#ffc58a', .55); wx.lineWidth = 1.3; wx.beginPath(); wx.moveTo(a[0] + (r() - .5), a[1]); wx.lineTo(b[0], b[1] + (r() - .5)); wx.stroke(); }
  }
  // the wall glows: soft halo of the lit squares (blurred copy, additive), then the squares themselves
  { const [hc, hx] = layer(); hx.filter = 'blur(10px)'; hx.drawImage(wc, 0, 0); put(ctx, hc, { op: 'lighter', a: .45 }); }
  put(ctx, wc);
  // brick-like irregularity: very faint darker tone over the upper rows (they're further away / not yet lived)
  { const [fc, fx] = layer(); fx.beginPath(); roughPath(fx, Q, { amp: 1, seed: 3 }); const g = fx.createLinearGradient(0, 70, 0, 960); g.addColorStop(0, rgba('#0b0e2a', .5)); g.addColorStop(.35, rgba('#0b0e2a', 0)); fx.fillStyle = g; fx.fill(); put(ctx, fc); }
  // fog at the foot of the wall
  fog(ctx, { y0: 860, y1: 1080, col: '#4a4f8a', a: .45, seed: 9, cover: .7, soft: .5, k: .3, sx: .004, sy: .03, edgeTop: .6, edgeBot: .2 });
  // ground + the person looking up
  roughPoly(ctx, [[-10, 1000], [W + 10, 985], [W + 10, H + 10], [-10, H + 10]], '#070919', { amp: 1.5, seed: 5 });
  pool(ctx, 630, 1010, 560, 50, { col: AMBER, a: .45, k: .5, seed: 4 });
  person(ctx, 1110, 1000 - 88 * .62, .62, { lean: -.05, head: -.45, sh: [.15, -.12], el: [.4, .45], hip: [.04, -.06], kn: [0, .05], hood: true, coat: 1 },
    { dress: { coat: '#e59a3a', pants: '#14141e', shoes: '#0b0a12', skin: '#e9c3a0', hair: '#2a1a14' }, flip: true, light: { x: 700, y: 600, col: HOT, a: .55 }, rim: HOT, rimSide: -1, rimW: 1.8 });

  // ---- annotations: age ticks on the left edge of the wall, a brace for the working years on the right
  const rowY = (age, u) => m(u, 1 - age / ROWS);
  for (const age of [0, 20, 40, 65, 80]) { const [x, y] = rowY(age, 0); ctx.strokeStyle = rgba('#d6d1ea', .55); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x - 26, y); ctx.stroke(); text(ctx, String(age), x - 34, y + 6, { size: 18, weight: 500, color: '#cfcae6', align: 'right' }); }
  text(ctx, 'AGE', rowY(40, 0)[0] - 94, rowY(42, 0)[1], { size: 13, weight: 600, color: '#8f8ab0', spacing: 4 });
  { const [ax, ay] = rowY(65, 1), [bx, by] = rowY(20, 1), x0 = Math.max(ax, bx) + 22; ctx.strokeStyle = rgba(AMBER, .8); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x0 - 10, ay); ctx.quadraticCurveTo(x0, ay, x0, ay + 12); ctx.lineTo(x0, (ay + by) / 2 - 10); ctx.quadraticCurveTo(x0, (ay + by) / 2, x0 + 10, (ay + by) / 2); ctx.quadraticCurveTo(x0, (ay + by) / 2, x0, (ay + by) / 2 + 10); ctx.lineTo(x0, by - 12); ctx.quadraticCurveTo(x0, by, x0 - 10, by); ctx.stroke();
    text(ctx, 'working years', x0 + 22, (ay + by) / 2 - 4, { size: 30, font: 'Instrument Serif Italic', color: HOT });
    text(ctx, 'age 20 to 65 · 47 weeks a year', x0 + 22, (ay + by) / 2 + 24, { size: 15, weight: 500, color: '#b9b3d8' }); }
  // ---- right column: the numbers, typeset like an editorial graphic
  const X = 1290;
  ctx.fillStyle = AMBER; ctx.fillRect(X, 128, 28, 2); text(ctx, 'A LIFE IN WEEKS', X, 160, { size: 16, weight: 600, color: '#a49fc4', spacing: 6 });
  text(ctx, 'about 4,000 weeks', X, 236, { size: 64, font: 'Instrument Serif', color: '#f3efe2' });
  text(ctx, '80 years × 52 weeks. One square is one week, one row is one year.', X, 274, { size: 17, weight: 400, color: '#b9b3d8' });
  // legend
  const sq = (x, y, crossed) => { roughRect(ctx, x, y, 22, 22, crossed ? '#9a4526' : '#f6b55f', { amp: .4, seed: x + y }); if (crossed) { ctx.strokeStyle = rgba('#ffc58a', .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 4, y + 18); ctx.lineTo(x + 18, y + 4); ctx.stroke(); } };
  sq(X, 330, false); text(ctx, 'a week lived', X + 40, 349, { size: 26, font: 'Instrument Serif', color: '#f3efe2' });
  sq(X, 378, true); text(ctx, 'a week at work', X + 40, 397, { size: 26, font: 'Instrument Serif', color: '#f3efe2' });
  ctx.strokeStyle = rgba('#d6d1ea', .25); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X, 452); ctx.lineTo(X + 520, 452); ctx.stroke();
  text(ctx, '≈', X, 524, { size: 50, weight: 400, color: HOT }); text(ctx, '80,000 hours', X + 46, 530, { size: 64, font: 'Instrument Serif', color: HOT });
  text(ctx, 'of a lifetime spent at work', X, 568, { size: 26, font: 'Instrument Serif Italic', color: '#f3efe2' });
  text(ctx, '45 years × 47 weeks × about 38 hours', X, 610, { size: 17, weight: 400, color: '#b9b3d8' });
  text(ctx, 'Half the weeks between 20 and 65 — but in hours,', X, 660, { size: 17, weight: 400, color: '#b9b3d8' });
  text(ctx, 'about one ninth of the 700,000 hours in 80 years.', X, 684, { size: 17, weight: 400, color: '#b9b3d8' });
  text(ctx, 'Own calculation. Schematic; real working lives vary.', X, 1040, { size: 14, weight: 400, color: '#8f8ab0' });
  printFinish(ctx, { grain: .08, vig: .5 });
  save(cv, out);
}
frame(process.argv[2] || 'g3.png');
