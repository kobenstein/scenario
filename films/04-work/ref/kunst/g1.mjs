// G1 · Swedish lottery winners: most kept working, and years later they were more satisfied with their lives.
// Big idea: a huge golden ticket hangs over a dawn road like a sun. Under it the winners keep walking to their
// workshops and offices; only a thin side path leads off to a deck chair by the lake. Right: a schematic
// life-satisfaction line that rises after the win and stays up. No invented numbers anywhere.
// Sources: Cesarini, Lindqvist, Notowidigdo & Östling (2017, AER): small labour-supply effect.
//          Lindqvist, Östling & Cesarini (2020, REStud): lasting gains in life satisfaction.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, fog, cone, pool, bloom, house, person, castShadow, printFinish, vnoise, stratus, qpts, limb } from './art.mjs';
import { text, save } from './lib.mjs';

const GOLD = '#ffc15e', HOT = '#ffe2a8', INK = '#0b1026';
export function frame(out) {
  const [cv, ctx] = layer();
  // dawn: deep blue above, a cold-green-teal band low, the ticket is the light
  { const g = ctx.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, '#070b22'); g.addColorStop(.5, '#16204a'); g.addColorStop(.85, '#2f4f6e'); g.addColorStop(1, '#5d7d86'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  { const rr = prng(2); for (let i = 0; i < 200; i++) { const x = rr() * W, y = Math.pow(rr(), 1.6) * 420, m = rr(); ctx.fillStyle = rgba('#dfe8ff', (.12 + .5 * m * m)); ctx.fillRect(x, y, m > .95 ? 2 : 1, m > .95 ? 2 : 1); } }
  // far hills + lake
  const hz = 640;
  roughPoly(ctx, [[-10, hz], [180, 600], [420, 625], [640, 585], [900, 615], [1150, 595], [1400, 620], [1650, 598], [1930, 615], [1930, hz], [-10, hz]], '#22374f', { amp: 3, step: 12, seed: 1 });
  { const g = ctx.createLinearGradient(0, hz, 0, 760); g.addColorStop(0, '#5f8088'); g.addColorStop(1, '#2a3f55'); ctx.fillStyle = g; ctx.fillRect(0, hz, W, 120); }
  // the town at the end of the road: workshops, a bakery, an office, all lit (people going to work)
  { const r = prng(9); let x = 640; while (x < 1180) { const w = 34 + r() * 46, h = 40 + r() * 70; house(ctx, r, x + w / 2, 700, w, h, { wall: mixHex('#1a2340', '#24304e', r()), lit: (a, b, q) => q() < .55 ? .85 : 0, amp: .6, floorH: 20, colW: 18, trim: false, chimney: .6 }); x += w + r() * 6; }
  }
  fog(ctx, { y0: 590, y1: 740, col: '#8fa9b5', a: .45, seed: 3, cover: .7, soft: .4, k: .25, sx: .004, sy: .03 });

  // ---- the ticket: a huge golden lottery ticket hanging in the sky, tilted, perforated edge, numbers circled
  const T = { x: 470, y: 250, w: 560, h: 270, rot: -.12 };
  cone(ctx, T.x + 40, T.y + 120, { dir: .18, spread: .42, len: 900, col: GOLD, a: .3, k: .55, seed: 4, soft: .5 });
  bloom(ctx, T.x, T.y, 760, { col: GOLD, core: HOT, a: .5, k: .35, seed: 5 });
  for (const [d, sp] of [[.05, .05], [.32, .04], [-.2, .03], [.6, .03]]) cone(ctx, T.x, T.y + 60, { dir: d, spread: sp, len: 1000, col: GOLD, a: .12, k: .4, seed: Math.round(d * 100) + 50, soft: .7 });
  ctx.save(); ctx.translate(T.x, T.y); ctx.rotate(T.rot);
  { const pts = []; const hw = T.w / 2, hh = T.h / 2;
    pts.push([-hw, -hh]); for (let x = -hw; x <= hw; x += 20) pts.push([x, -hh], [x + 10, -hh + 6]); pts.push([hw, -hh], [hw, hh]);
    for (let x = hw; x >= -hw; x -= 20) pts.push([x, hh], [x - 10, hh - 6]); pts.push([-hw, hh]);
    ctx.save(); ctx.filter = 'blur(14px)'; roughPoly(ctx, pts, rgba(HOT, .8), { amp: 1, seed: 6 }); ctx.restore();
    roughPoly(ctx, pts, '#f6b850', { amp: 1, seed: 6 });
    ctx.save(); ctx.beginPath(); roughPath(ctx, pts, { amp: 1, seed: 6 }); ctx.clip();
    const g = ctx.createLinearGradient(-hw, -hh, hw, hh); g.addColorStop(0, rgba('#fff3cf', .55)); g.addColorStop(.6, rgba('#ffc15e', 0)); g.addColorStop(1, rgba('#b8641e', .45)); ctx.fillStyle = g; ctx.fillRect(-hw, -hh, T.w, T.h);
    hatch(ctx, [-hw, -hh, T.w, T.h], { angle: .7, gap: 6, w: 1, col: '#a0581c', a: .22, seed: 7, broken: .4 });
    ctx.restore();
    // printed matter: stub line, title, grid of number circles (six circled in ink)
    ctx.setLineDash([3, 6]); ctx.strokeStyle = rgba('#7a3a12', .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-hw + 120, -hh + 16); ctx.lineTo(-hw + 120, hh - 16); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'LOTTERI', -hw + 22, -hh + 56, { size: 20, weight: 600, color: '#6a2e0e', spacing: 2 });
    for (let k = 0; k < 4; k++) roughRect(ctx, -hw + 26, -hh + 82 + k * 22, 70 - k * 12, 5, rgba('#6a2e0e', .55), { amp: .4, seed: k });
    const r = prng(11), picked = new Set([3, 9, 14, 20, 26, 31]);
    for (let i = 0; i < 35; i++) { const cx = -hw + 180 + (i % 7) * 50, cy = -hh + 50 + Math.floor(i / 7) * 42; ctx.strokeStyle = rgba('#6a2e0e', .5); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 15, 0, 7); ctx.stroke(); text(ctx, String(i + 1), cx, cy + 6, { size: 15, weight: 600, color: '#6a2e0e', align: 'center', alpha: .7 });
      if (picked.has(i)) { ctx.strokeStyle = '#2a1a5a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx + 1, cy, 19 + r() * 2, 17, r() * .4, 0, 6.5); ctx.stroke(); } }
  }
  ctx.restore();

  // ---- the road from the foreground to the town; side path to a deck chair by the lake
  const road = (q, side) => { const a = [140 + side * 420, H + 20], c = [760 + side * 120, 820], b = [900 + side * 14, 702]; return [(1 - q) ** 2 * a[0] + 2 * (1 - q) * q * c[0] + q * q * b[0], (1 - q) ** 2 * a[1] + 2 * (1 - q) * q * c[1] + q * q * b[1]]; };
  roughPoly(ctx, [[-10, 742], [W + 10, 736], [W + 10, H + 10], [-10, H + 10]], '#121a33', { amp: 2, seed: 12 });
  { const g = ctx.createLinearGradient(0, 720, 0, H); g.addColorStop(0, '#2a3a52'); g.addColorStop(1, '#0c1226'); ctx.save(); ctx.beginPath(); roughPath(ctx, [[-10, 740], [W + 10, 720], [W + 10, H + 10], [-10, H + 10]], { amp: 2, seed: 12 }); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(0, 700, W, 400);
    hatch(ctx, [0, 720, 1300, 360], { angle: -.04, gap: 7, w: 1, col: '#6f86a8', a: .18, seed: 13, broken: .5 }); ctx.restore(); }
  const L = [], R = []; for (let i = 0; i <= 30; i++) { L.push(road(i / 30, -1)); R.push(road(i / 30, 1)); }
  roughPoly(ctx, [...L, ...R.reverse()], '#8a7a62', { amp: 2, seed: 14 });
  { ctx.save(); ctx.beginPath(); roughPath(ctx, [...L, ...[...R].reverse()], { amp: 2, seed: 14 }); ctx.clip(); const g = ctx.createLinearGradient(0, 1080, 0, 700); g.addColorStop(0, rgba('#0c1226', .55)); g.addColorStop(1, rgba('#0c1226', 0)); ctx.fillStyle = g; ctx.fillRect(0, 680, W, 400); ctx.restore(); }
  // ticket light falling on the road
  pool(ctx, 760, 860, 520, 120, { col: GOLD, a: .38, k: .55, seed: 15, rot: -.15 });
  // side path off to the left, to a deck chair at the water
  { // a small jetty on the lake, someone sitting with a fishing rod: the few who stopped
    const jx = 150, jy = 706; roughRect(ctx, jx - 70, jy, 170, 8, '#0b1026', { amp: .6, seed: 1 }); for (const px of [-60, 0, 60]) roughRect(ctx, jx + px, jy + 6, 5, 22, '#0b1026', { amp: .4, seed: px + 9 });
    const sx = jx + 70, s2 = .42, P = { lean: .12, head: .15, sh: [1.1, .9], el: [.6, .7], hip: [1.5, 1.5], kn: [1.45, 1.4], hair: 'cap' };
    const f = person(ctx, sx, jy - 4 - 0 * s2, s2, P, { dress: { coat: '#3a5070', pants: '#20283a', skin: '#e0b48e', hair: '#2a1a14', hairBack: '#3a2a20' }, light: { x: T.x, y: T.y, col: HOT, a: .45 }, rim: HOT, rimSide: 1, rimW: 1.2 });
    const [hx, hy] = f.hand(0); roughLine(ctx, [[hx - 4, hy + 4], [hx + 90, hy - 50]], { w: 2, col: '#0b1026', seed: 4 }); ctx.strokeStyle = rgba('#d6d1ea', .5); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(hx + 90, hy - 50); ctx.quadraticCurveTo(hx + 110, hy - 10, hx + 112, jy + 18); ctx.stroke();
    for (let k = 0; k < 3; k++) { ctx.strokeStyle = rgba('#d6e4ee', .35 - k * .1); ctx.beginPath(); ctx.ellipse(hx + 112, jy + 20, 8 + k * 10, 2 + k * 2, 0, 0, 7); ctx.stroke(); } }
  // ---- the winners walking to work: a stream of people seen from behind, different clothes, bags, a bike
  const dress = [['#3a5070', '#1a1f30'], ['#6a3a50', '#202030'], ['#2f5a4a', '#1b2228'], ['#7a5a3a', '#22202a'], ['#4a4a6a', '#18182a'], ['#8a3a2a', '#1d1b26'], ['#e59a3a', '#14141e']];
  const r = prng(21); const walkers = [];
  for (let i = 0; i < 26; i++) { const q = .18 + Math.pow(i / 26, .9) * .78, side = (r() - .5) * 1.4, [lx, ly] = road(q, -1), [rx, ry] = road(q, 1), x = mix(lx, rx, .5 + side * .35), y = mix(ly, ry, .5); const s = .9 * Math.pow(1 - q, 1.25) + .07; walkers.push({ x, y, s, i }); }
  walkers.sort((a, b) => a.y - b.y);
  for (const w of walkers) { const d = dress[w.i % dress.length], ph = (w.i * 1.7) % 2 - 1, isAmber = w.i === 3;
    const P = { lean: .04, head: .05, sh: [.25 * ph, -.25 * ph], el: [.3, .35], hip: [.28 * ph, -.28 * ph], kn: [.12, .3], hair: ['short', 'long', 'bun', 'curly', 'cap'][w.i % 5], coat: w.i % 3 === 0 ? .8 : 0, skirt: w.i % 7 === 2 };
    castShadow(ctx, w.x, w.y, w.s, T.x, T.y, { a: .4, len: 1.6, col: '#070a18' });
    person(ctx, w.x, w.y - 88 * w.s, w.s, P, { dress: { coat: isAmber ? '#e59a3a' : d[0], pants: d[1], shoes: '#0b0a12', skin: '#d9a77e', hair: ['#2a1a14', '#5a3a20', '#1a1010', '#c9b8a0'][w.i % 4] }, flip: w.i % 2 === 0, light: { x: T.x, y: T.y, col: HOT, a: .45 }, rim: HOT, rimSide: w.x > T.x ? -1 : 1, rimW: Math.max(1, 2 * w.s), shadeA: .1 }); }
  // ---- annotations on the picture
  const lead = (pts, col = '#e8e2f6') => { ctx.strokeStyle = rgba(col, .6); ctx.lineWidth = 1.3; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of pts.slice(1)) ctx.lineTo(...p); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = rgba(col, .9); ctx.beginPath(); ctx.arc(...pts[0], 3, 0, 7); ctx.fill(); };
  lead([[700, 880], [1030, 880], [1080, 860]]); text(ctx, 'Most kept working.', 1095, 868, { size: 38, font: 'Instrument Serif', color: '#f3efe2' });
  text(ctx, 'The effect of the win on work was small.', 1095, 900, { size: 16, weight: 400, color: '#b9c0dc' });
  lead([[190, 640], [190, 590], [250, 590]], '#c9c4e0'); text(ctx, 'a few stopped', 260, 596, { size: 22, font: 'Instrument Serif Italic', color: '#c9c4e0' });
  // ---- right panel: schematic life-satisfaction line (no numbers)
  { const X0 = 1300, X1 = 1820, Y0 = 520, Y1 = 260;   // plot box
    ctx.fillStyle = GOLD; ctx.fillRect(X0, 110, 28, 2); text(ctx, 'SWEDISH LOTTERY WINNERS', X0, 142, { size: 16, weight: 600, color: '#a9b0d0', spacing: 5 });
    text(ctx, 'Years later, more satisfied', X0, 200, { size: 44, font: 'Instrument Serif', color: '#f3efe2' });
    text(ctx, 'with their lives, not less.', X0, 244, { size: 44, font: 'Instrument Serif Italic', color: HOT });
    const n = vnoise(3), base = (x) => Y0 - 90 + (n(x * .02, 1) - .5) * 6;
    ctx.strokeStyle = rgba('#d6d1ea', .35); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X0, Y0 - 40); ctx.lineTo(X1, Y0 - 40); ctx.stroke();
    // comparison line (did not win): flat, dotted
    ctx.setLineDash([3, 6]); ctx.strokeStyle = rgba('#c9c4e0', .7); ctx.lineWidth = 2; ctx.beginPath(); for (let x = X0; x <= X1; x += 6) ctx.lineTo(x, base(x)); ctx.stroke(); ctx.setLineDash([]);
    // winners: same until the win, then up, and it stays up (hand-drawn, slightly wobbly)
    const xw = X0 + 130, win = (x) => x < xw ? base(x) : base(x) - 70 * (1 - Math.exp(-(x - xw) / 60)) + (n(x * .05, 4) - .5) * 4;
    const pts = []; for (let x = X0; x <= X1; x += 4) pts.push([x, win(x)]);
    { const fill = [...pts, [X1, base(X1)], ...[...pts].reverse().map(([x]) => [x, base(x)])]; ctx.save(); ctx.beginPath(); ctx.moveTo(...pts[0]); for (const p of fill) ctx.lineTo(...p); ctx.closePath(); ctx.clip(); hatch(ctx, [X0, Y1, X1 - X0, Y0 - Y1], { angle: -.8, gap: 6, w: 1.2, col: GOLD, a: .45, seed: 9, broken: .2 }); ctx.restore(); }
    roughLine(ctx, pts, { w: 4, col: GOLD, seed: 7, amp: .3 });
    ctx.fillStyle = HOT; ctx.beginPath(); ctx.arc(xw, base(xw), 6, 0, 7); ctx.fill(); bloom(ctx, xw, base(xw), 40, { a: .6, k: .2, seed: 8 });
    text(ctx, 'the win', xw - 30, Y0 - 12, { size: 15, weight: 600, color: '#a9b0d0', spacing: 2 });
    ctx.strokeStyle = rgba('#d6d1ea', .35); ctx.beginPath(); ctx.moveTo(xw, Y0 - 46); ctx.lineTo(xw, Y0 - 34); ctx.stroke();
    text(ctx, 'years later →', X1, Y0 - 12, { size: 15, weight: 600, color: '#a9b0d0', spacing: 2, align: 'right' });
    text(ctx, 'winners', X1, win(X1) - 14, { size: 22, font: 'Instrument Serif Italic', color: HOT, align: 'right' });
    text(ctx, 'similar people who didn’t win', X1, base(X1) + 22, { size: 15, weight: 400, color: '#c9c4e0', align: 'right' });
    text(ctx, 'LIFE SATISFACTION · SCHEMATIC', X0, Y1 + 26, { size: 13, weight: 600, color: '#8f96b8', spacing: 4 });
  }
  // source line
  text(ctx, 'Sources: Cesarini, Lindqvist, Notowidigdo & Östling (2017), American Economic Review', 1860, 1020, { size: 14, weight: 400, color: '#8f96b8', align: 'right' });
  text(ctx, 'Lindqvist, Östling & Cesarini (2020), Review of Economic Studies', 1860, 1044, { size: 14, weight: 400, color: '#8f96b8', align: 'right' });
  printFinish(ctx, { grain: .085, vig: .45 });
  save(cv, out);
}
frame(process.argv[2] || 'g1.png');
