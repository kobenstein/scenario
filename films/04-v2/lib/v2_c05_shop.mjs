// c05 · the corner shop seen through its display window (5.03): shelves of jars, the counter with a brass till, the shopkeeper in
// profile, you from behind at the till, a long receipt curling out of the till, and the dotted pencil sums above your head that drift
// away as smoke. Drawn as billboards in the city's 3D world (behind the glass at z CITY.opp), so the camera's parallax stays true.
//   shopInterior(ctx, t, cam, rect, st)   st = { sums: 0..1 (0 there … 1 gone), receipt: 0..1 (length), tod }
import { W, H, rgba, clamp, mix, prng, canvas, once, rect3, bb, poly3, putGlow, mixHex, shade, smo, TAU } from './v2_c05_kit.mjs';
import { CITY } from './v2_c05_city.mjs';
import { figure, figureBack, POSES } from './figure.mjs';
import { scribble } from './paper.mjs';

const ZB = CITY.opp + 4.0, ZC = CITY.opp + 2.1, FLOOR = CITY.street;   // back wall, counter front, shop floor (street level)
function shelvesTex() {
  return once('c5:shelves', () => {
    const ppm = 150, w = 5.0, h = 3.3, [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), r = prng(71), X = (x) => x * ppm, Y = (y) => y * ppm;
    const wall = g.createLinearGradient(0, 0, 0, Y(h)); wall.addColorStop(0, '#5a3a2e'); wall.addColorStop(1, '#3a2420'); g.fillStyle = wall; g.fillRect(0, 0, X(w), Y(h));
    for (let i = 0; i < 5; i++) {
      const sy = .45 + i * .55; g.fillStyle = '#6a4630'; g.fillRect(0, Y(sy), X(w), 9); g.fillStyle = rgba('#000', .3); g.fillRect(0, Y(sy) + 9, X(w), 5);
      let x = .1;
      while (x < w - .2) {
        const kind = r(), bw = kind < .5 ? .14 + r() * .06 : kind < .8 ? .1 : .08, bh = kind < .5 ? .2 + r() * .1 : kind < .8 ? .16 : .3;
        const by = Y(sy) - Y(bh);
        if (kind < .5) {   // glass jar with a lid and contents
          const col = ['#d8862a', '#b8423a', '#e8c25a', '#7a9a4a', '#c86a4a', '#e0d0b0'][Math.floor(r() * 6)];
          g.fillStyle = rgba('#e8e0d0', .35); g.fillRect(X(x), by, X(bw), Y(bh)); g.fillStyle = col; g.fillRect(X(x) + 3, by + Y(bh) * .3, X(bw) - 6, Y(bh) * .7 - 2);
          g.fillStyle = '#b8924a'; g.fillRect(X(x) - 1, by - 7, X(bw) + 2, 9); g.fillStyle = rgba('#fff', .35); g.fillRect(X(x) + 4, by + 6, 4, Y(bh) - 12);
          g.fillStyle = '#efe6d2'; g.fillRect(X(x) + X(bw) * .2, by + Y(bh) * .45, X(bw) * .6, Y(bh) * .2);
        } else if (kind < .8) {   // a tin
          const col = ['#2f5a6a', '#8a2a2a', '#3a4a2a', '#6a4a7a'][Math.floor(r() * 4)]; g.fillStyle = col; g.fillRect(X(x), by, X(bw), Y(bh));
          g.fillStyle = rgba('#e8d8b0', .7); g.fillRect(X(x), by + Y(bh) * .35, X(bw), Y(bh) * .25); g.fillStyle = rgba('#fff', .25); g.fillRect(X(x) + 2, by, 3, Y(bh));
        } else {   // a bottle
          const col = ['#3a5a3a', '#6a3a2a', '#2a3a5a'][Math.floor(r() * 3)]; g.fillStyle = col; g.fillRect(X(x), by + Y(bh) * .3, X(bw), Y(bh) * .7); g.fillRect(X(x) + X(bw) * .3, by, X(bw) * .4, Y(bh) * .32);
          g.fillStyle = rgba('#fff', .3); g.fillRect(X(x) + 3, by + Y(bh) * .35, 3, Y(bh) * .55);
        }
        x += bw + .03 + r() * .05;
      }
    }
    // warm pendant-lamp pools on the wall
    for (const lx of [1.2, 3.6]) { const rg = g.createRadialGradient(X(lx), Y(.3), 0, X(lx), Y(.3), X(1.4)); rg.addColorStop(0, rgba('#ffcf8a', .35)); rg.addColorStop(1, rgba('#ffcf8a', 0)); g.fillStyle = rg; g.fillRect(0, 0, X(w), Y(h)); }
    return c;
  });
}
function counterTex() {
  return once('c5:counter', () => {
    const ppm = 220, w = 3.2, h = 1.0, [c, g] = canvas(Math.ceil(w * ppm), Math.ceil(h * ppm)), X = (x) => x * ppm, Y = (y) => y * ppm;
    const fg = g.createLinearGradient(0, 0, 0, Y(h)); fg.addColorStop(0, '#6a4632'); fg.addColorStop(1, '#3a2418'); g.fillStyle = fg; g.fillRect(0, Y(.06), X(w), Y(h - .06));
    g.fillStyle = '#8a6040'; g.fillRect(0, 0, X(w), Y(.07)); g.fillStyle = rgba('#ffd8a0', .5); g.fillRect(0, 0, X(w), 4);
    for (let i = 0; i < 4; i++) { g.strokeStyle = rgba('#1a0c08', .55); g.lineWidth = 4; g.strokeRect(X(.12 + i * .77), Y(.2), X(.66), Y(.66)); g.strokeStyle = rgba('#b08060', .3); g.lineWidth = 2; g.strokeRect(X(.12 + i * .77) + 7, Y(.2) + 7, X(.66) - 14, Y(.66) - 14); }
    return c;
  });
}
function tillTex() {
  return once('c5:till', () => {
    const S = 420, [c, g] = canvas(S, S), u = S / 100;
    const brass = (x0, y0, x1, y1) => { const gg = g.createLinearGradient(x0 * u, y0 * u, x1 * u, y1 * u); gg.addColorStop(0, '#fff0c0'); gg.addColorStop(.3, '#d8a850'); gg.addColorStop(.75, '#8a6024'); gg.addColorStop(1, '#5a3c14'); return gg; };
    // body: a tall ornate brass cash register (engraved scrolls), the number flag window on top, a cash drawer, rows of round keys, a crank
    g.fillStyle = brass(10, 20, 90, 95); g.beginPath(); g.moveTo(14 * u, 96 * u); g.lineTo(14 * u, 40 * u); g.quadraticCurveTo(14 * u, 30 * u, 24 * u, 28 * u); g.lineTo(76 * u, 28 * u); g.quadraticCurveTo(86 * u, 30 * u, 86 * u, 40 * u); g.lineTo(86 * u, 96 * u); g.closePath(); g.fill();
    g.fillStyle = brass(30, 6, 70, 30); g.beginPath(); g.moveTo(28 * u, 30 * u); g.lineTo(30 * u, 12 * u); g.quadraticCurveTo(50 * u, 2 * u, 70 * u, 12 * u); g.lineTo(72 * u, 30 * u); g.closePath(); g.fill();
    g.fillStyle = '#1c1410'; g.fillRect(36 * u, 14 * u, 28 * u, 9 * u); g.fillStyle = '#efe6d2'; for (let i = 0; i < 3; i++) g.fillRect((39 + i * 8.5) * u, 15.5 * u, 6 * u, 6 * u);
    g.strokeStyle = rgba('#3a2408', .55); g.lineWidth = 1.6; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc((22 + i * 7) * u, 34 * u, 3 * u, Math.PI, TAU); g.stroke(); }
    // keys: 4 rows of round white keys
    for (let row = 0; row < 4; row++) for (let i = 0; i < 6; i++) { const kx = (24 + i * 10.5) * u, ky = (44 + row * 9) * u; g.fillStyle = '#2a1c10'; g.beginPath(); g.arc(kx, ky + 1.2 * u, 3.6 * u, 0, TAU); g.fill(); g.fillStyle = '#f4ecd8'; g.beginPath(); g.arc(kx, ky, 3.2 * u, 0, TAU); g.fill(); }
    g.fillStyle = brass(14, 82, 86, 96); g.fillRect(12 * u, 82 * u, 76 * u, 14 * u); g.fillStyle = '#3a2408'; g.fillRect(44 * u, 87.5 * u, 12 * u, 2.4 * u);
    // the crank on the right side and the receipt slot on top-left
    g.strokeStyle = '#8a6024'; g.lineWidth = 3 * u; g.lineCap = 'round'; g.beginPath(); g.moveTo(86 * u, 60 * u); g.lineTo(96 * u, 60 * u); g.lineTo(96 * u, 50 * u); g.stroke();
    g.fillStyle = '#1c1410'; g.fillRect(16 * u, 27 * u, 12 * u, 2 * u);
    return c;
  });
}
// the receipt: a long paper strip from the till's slot, over the counter edge, curling toward the floor (length grows with st.receipt)
function receipt(ctx, t, cam, u, till) {
  if (u <= 0) return;
  const x0 = till.x + .1, y0 = till.y + .02, z = ZC + .05, L = .25 + 1.6 * u, pts = [];
  for (let i = 0; i <= 40; i++) {
    const s = i / 40 * L; let x, y;
    if (s < .22) { x = x0 - s * .3; y = y0 - .05 - s * .5; }                       // up out of the slot
    else if (s < .5) { const a = (s - .22) / .28 * Math.PI; x = x0 - .066 - .14 * Math.sin(a); y = y0 - .16 + .14 * (1 - Math.cos(a)); }   // over in a loop
    else { const v = s - .5; x = x0 - .066 - .02 * v + .05 * Math.sin(v * 7 + t * 1.5) * v; y = y0 + .12 + v; }   // hanging down, swaying
    pts.push(cam.P(x, Math.min(y, FLOOR - .01), z));
  }
  if (pts.some((p) => !p)) return;
  const k = pts[0][2], w = .055 * k;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = '#d8d0c0'; ctx.lineWidth = w + 2; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  ctx.strokeStyle = '#fbf6ea'; ctx.lineWidth = w; ctx.stroke();
  ctx.strokeStyle = rgba('#6a6278', .55); ctx.lineWidth = Math.max(1, w * .12); ctx.setLineDash([w * .35, w * .25]); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}
// the dotted pencil sums above your head: a column addition of scribbled figures with plain + and = signs (no readable numbers);
// gone = 0..1: every dot drifts up and away like smoke and shrinks to nothing (no alpha fade)
const SUMS = (() => {
  const r = prng(404), dots = [];
  const line = (x0, y0, x1, y1, n, grp) => { for (let i = 0; i <= n; i++) dots.push({ x: mix(x0, x1, i / n), y: mix(y0, y1, i / n), g: grp, r: r(), q: r() }); };
  const wig = (x0, y0, w, grp) => { let px = x0, py = y0; for (let i = 0; i < 26; i++) { const nx = x0 + w * i / 25, ny = y0 + Math.sin(i * 1.7 + r() * 2) * .03 + (r() - .5) * .01; line(px, py, nx, ny, 1, grp); px = nx; py = ny; } };
  for (let row = 0; row < 3; row++) { wig(-.18, -.32 + row * .11, .3, row); }
  line(-.27, -.1, -.21, -.1, 4, 1); line(-.24, -.13, -.24, -.07, 4, 1);           // +
  line(-.22, .0, .16, .0, 18, 3);                                                // the rule
  line(-.27, .06, -.21, .06, 4, 3); line(-.27, .085, -.21, .085, 4, 3);          // =
  wig(-.15, .075, .26, 4);
  line(.17, .07, .19, .02, 3, 4); dots.push({ x: .19, y: .1, g: 4, r: r(), q: r() });   // a "?" hook
  return dots;
})();
function sums(ctx, t, cam, gone, X, Y, Z) {
  if (gone >= 1) return;
  const c = cam.P(X, Y, Z); if (!c) return; const k = c[2];
  ctx.save(); ctx.fillStyle = '#3a3448';
  for (const d of SUMS) {
    const start = d.g * .08 + d.q * .12, u = clamp((gone - start) / .6); if (u >= 1) continue;
    const drift = smo(u), sx = d.x + Math.sin(d.r * 9 + t * 2) * .12 * drift + (d.r - .5) * .25 * drift, sy = d.y - .55 * drift - d.q * .2 * drift;
    const size = (.012 + .006 * d.q) * (1 - u) * (1 + .6 * Math.sin(u * Math.PI)) * k;
    if (size < .4) continue;
    ctx.fillStyle = u > 0 ? mixHex('#3a3448', '#8a8494', drift) : '#3a3448';
    ctx.beginPath(); ctx.arc(c[0] + sx * k, c[1] + sy * k, size, 0, TAU); ctx.fill();
  }
  ctx.restore();
}
export function shopInterior(ctx, t, cam, rect, st = {}) {
  const [rx, ry, rw, rh] = rect;
  // the room behind the glass: back wall with shelves, floor, a warm light; then the counter, the till, the shopkeeper, you
  ctx.fillStyle = '#2a1a16'; ctx.fillRect(rx, ry, rw, rh);
  bb(ctx, cam, shelvesTex(), -1.9, FLOOR - 3.3, ZB, 5.0, 3.3);
  poly3(ctx, cam, [[-2, FLOOR, CITY.opp + .1], [3.2, FLOOR, CITY.opp + .1], [3.2, FLOOR, ZB], [-2, FLOOR, ZB]], '#3a2620');
  for (const lx of [-.2, 1.6]) { const p = cam.P(lx, FLOOR - 2.9, ZC + .8); if (p) { ctx.strokeStyle = '#1c1210'; ctx.lineWidth = Math.max(1, .01 * p[2]); ctx.beginPath(); ctx.moveTo(p[0], p[1] - 2 * p[2]); ctx.lineTo(p[0], p[1]); ctx.stroke(); ctx.fillStyle = '#c99a52'; ctx.beginPath(); ctx.moveTo(p[0] - .16 * p[2], p[1] + .12 * p[2]); ctx.quadraticCurveTo(p[0], p[1] - .06 * p[2], p[0] + .16 * p[2], p[1] + .12 * p[2]); ctx.closePath(); ctx.fill(); putGlow(ctx, p[0], p[1] + .15 * p[2], 1.4 * p[2], .55, '#ffb35c', '#fff1d6'); } }
  // the shopkeeper behind the counter, in profile, working the till (an apron)
  const sk = cam.P(1.45, FLOOR - .92, ZC + .55);
  if (sk) { const s = .92 * sk[2] / 105.7; figure(ctx, sk[0], sk[1], s, POSES.reach, { t, seed: 31, flip: true, dress: { coat: '#e8e0d0', pants: '#2a2430', skin: '#c49270', hair: '#3a2a22' }, accent: '#6a4a3a', accentPart: 'scarf', shadow: false, rim: '#ffcf8a' }); }
  // the counter (front face) and its top, the till on it
  bb(ctx, cam, counterTex(), -1.1, FLOOR - 1.0, ZC, 3.2, 1.0);
  const till = { x: .95, y: FLOOR - 1.0 - .52 };
  bb(ctx, cam, tillTex(), till.x - .26, till.y, ZC - .02, .52, .52);
  receipt(ctx, t, cam, st.receipt ?? 0, { x: till.x - .26, y: till.y + .1 });
  // you, from behind, at the till (a basket on the arm? no: hands by your sides; the sums float above your head)
  const yp = cam.P(.25, FLOOR, ZC - .65);
  if (yp) { const s = 1.0 * yp[2] / 105.7; figureBack(ctx, yp[0], yp[1], s, { t, seed: 5, hold: 'none', dress: { coat: '#2f3652', pants: '#1c1c30', hair: '#2b1d19', skin: '#b8896a' }, accent: '#e8a3a0', light: { x: yp[0] + 400, y: yp[1] - 600, col: '#ffcf8a', a: .8 } }); }
  sums(ctx, t, cam, st.sums ?? 0, .25, FLOOR - 2.2, ZC - .7);
  // the glass: the warm interior light, a reflection of the street (cool) on the upper part
  const gg = ctx.createLinearGradient(0, ry, 0, ry + rh); gg.addColorStop(0, rgba('#c8b8d0', .16)); gg.addColorStop(.4, rgba('#c8b8d0', 0)); ctx.fillStyle = gg; ctx.fillRect(rx, ry, rw, rh);
}
