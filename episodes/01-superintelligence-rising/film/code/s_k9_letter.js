// "Now look at the eleven hundred lab employees who asked Washington to get ready to 'deliberately pace the frontier.'"
// A vast night plaza fills row by row with 1,100 small amber figures. Over their raised hands a long letter unrolls,
// passed from the front of the crowd toward a domed capitol on the horizon, which lights up warm when it arrives.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, hash, lin, rad, rgba, light, cone, out, clamp, ease, stamp } = L;
const { gf, rr, cached, quote } = require('./s_k9_kit');

const T0 = 585.5, T1 = 592.95;
const HOR = 400, DOME = [1480, HOR];
const ROWS = 25, PER = 44;
// perspective: row 0 is nearest (y ~ 900), row ROWS-1 farthest (y ~ 470)
const rowY = r => lerp(905, 470, Math.pow(r / (ROWS - 1), 0.8));
const rowS = r => lerp(1.0, 0.22, Math.pow(r / (ROWS - 1), 0.75));
const PEOPLE = (() => { const R = rng(1100), a = [];
  for (let r = 0; r < ROWS; r++) { const s = rowS(r), y = rowY(r), span = lerp(2300, 900, r / (ROWS - 1)), cx = lerp(900, 1300, r / (ROWS - 1));
    for (let i = 0; i < PER; i++) a.push({ r, x: cx - span / 2 + (i + 0.5) * span / PER + (R() - 0.5) * 30 * s, y: y + (R() - 0.5) * 8 * s, s: s * (0.9 + R() * 0.2),
      pal: R(), ph: R() * 7, hair: R(), up: R(), d: R() }); }
  return a.sort((p, q) => p.y - q.y); })();
// the letter's path: from the front, over the heads, back toward the dome
const PATH = [[560, 870], [760, 760], [1000, 610], [1150, 545], [1280, 495], [1380, 455], [1440, 425]];
const pathAt = u => { const f = clamp(u) * (PATH.length - 1), i = Math.min(PATH.length - 2, Math.floor(f)), k = f - i; return [lerp(PATH[i][0], PATH[i + 1][0], k), lerp(PATH[i][1], PATH[i + 1][1], k)]; };

function skyArt(c) {
  gf(c, cc => cc.rect(-200, -200, W + 400, HOR + 260), lin(c, 0, -200, 0, HOR + 60, [[0, '#070818'], [0.6, '#17164a'], [1, '#3b2f6e']]), 0.55);
  // distant city line and the capitol
  const r = rng(5); let x = -200;
  while (x < W + 200) { const w = 30 + r() * 80, h = 12 + r() * 50; c.fillStyle = '#1a1744'; c.fillRect(x, HOR - h, w, h + 10); x += w + 4; }
  const [dx, dy] = DOME;
  gf(c, cc => { cc.rect(dx - 170, dy - 40, 340, 50); cc.rect(dx - 90, dy - 70, 180, 32); cc.ellipse(dx, dy - 70, 74, 74, 0, Math.PI, 0); cc.rect(dx - 6, dy - 176, 12, 34); }, lin(c, 0, dy - 180, 0, dy, [[0, '#4a4486'], [1, '#221e52']]), 0.4);
  for (let k = 0; k < 9; k++) { c.fillStyle = 'rgba(10,8,30,0.6)'; c.fillRect(dx - 150 + k * 36, dy - 34, 8, 36); }
  // plaza
  gf(c, cc => cc.rect(-200, HOR, W + 400, H - HOR + 200), lin(c, 0, HOR, 0, H, [[0, '#2c2763'], [0.4, '#1b1844'], [1, '#0a0920']]), 0.55);
}

function person(ctx, p, t, show, raise) {
  const s = p.s, b = Math.sin(t * 1.8 + p.ph) * 1.2 * s, pop = out(show);
  if (pop <= 0) return;
  const x = p.x, y = p.y + (1 - pop) * 14 * s;
  const pal = p.pal < 0.33 ? ['#ffb35c', '#a85424'] : p.pal < 0.66 ? ['#ffc27c', '#b8622a'] : ['#e8964e', '#8a451c'];
  ctx.globalAlpha = pop;
  ctx.fillStyle = lin(ctx, x - 20 * s, y - 60 * s, x + 20 * s, y, [[0, pal[0]], [1, pal[1]]]);
  ctx.beginPath(); ctx.moveTo(x - 19 * s, y); ctx.quadraticCurveTo(x - 21 * s, y - 50 * s + b, x - 6 * s, y - 54 * s + b); ctx.lineTo(x + 6 * s, y - 54 * s + b); ctx.quadraticCurveTo(x + 21 * s, y - 50 * s + b, x + 19 * s, y); ctx.closePath(); ctx.fill();
  if (raise > 0) { ctx.strokeStyle = pal[0]; ctx.lineWidth = 6 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 14 * s, y - 44 * s + b); ctx.lineTo(x + 18 * s, y - (44 + 46 * raise) * s + b); ctx.stroke(); }
  ctx.fillStyle = '#e0904a'; ctx.beginPath(); ctx.ellipse(x, y - 66 * s + b, 10 * s, 12 * s, 0, 0, 7); ctx.fill();
  ctx.fillStyle = p.hair < 0.4 ? '#2e140a' : p.hair < 0.7 ? '#1c0a05' : '#5a2a12'; ctx.beginPath(); ctx.ellipse(x, y - 68 * s + b, 10.5 * s, 11 * s, 0, 0, 7); ctx.fill();
  ctx.globalAlpha = 1;
}

function letter(ctx, t, u) {
  if (u <= 0) return;
  // a ribbon of paper over the heads; it unrolls from the front toward the dome
  const N = 60, pts = [];
  for (let i = 0; i <= N; i++) { const k = i / N * u, [x, y] = pathAt(k), w = lerp(46, 8, k), wav = Math.sin(t * 2.2 - k * 14) * 6 * (1 - k);
    pts.push([x, y - 70 * lerp(1, 0.3, k) + wav, w]); }
  ctx.save();
  ctx.beginPath(); pts.forEach(([x, y, w], i) => i ? ctx.lineTo(x, y - w) : ctx.moveTo(x, y - w)); for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + w0(pts[i])); ctx.closePath();
  ctx.fillStyle = lin(ctx, 640, 0, 1440, 0, [[0, '#f6efd9'], [1, '#d9cdb0']]); ctx.fill();
  ctx.clip();
  // lines of writing running along the ribbon
  ctx.strokeStyle = 'rgba(60,40,70,0.45)'; ctx.lineWidth = 2;
  for (const off of [-0.5, -0.15, 0.2, 0.5]) { ctx.beginPath(); pts.forEach(([x, y, w], i) => { const yy = y + off * w; (i % 3 === 1) ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }); ctx.stroke(); }
  ctx.restore();
  // the roll at the leading end
  const [ex, ey, ew] = pts[pts.length - 1];
  if (u < 1) { ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.ellipse(ex, ey, 6 + ew * 0.25, ew + 3, 0.2, 0, 7); ctx.fill(); }
  light(ctx, ex, ey, 120, '#fff1cf', 0.35);
  light(ctx, 900, 600, 600, '#ffe2a8', 0.12);
}
function w0(p) { return p[2]; }

function draw(ctx, t) {
  const z = lerp(1.0, 1.06, sm((t - T0) / (T1 - T0))), dx = drift(t, 1, 41) * 6, dy = drift(t, 1, 42) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(1100, 560); ctx.scale(z, z); ctx.translate(-1100 + dx * par, -560 + dy * par); fn(); ctx.restore(); };
  const arrive = ramp(t, 589.09, 589.9);
  layer(0.3, () => {
    cached(ctx, 'k9plaza', -200, -200, W + 200, H + 200, skyArt);
    // Washington lights up when the letter reaches it
    light(ctx, DOME[0], DOME[1] - 80, 380, C.amber, 0.08 + 0.35 * arrive);
    light(ctx, DOME[0], DOME[1] - 90, 90, '#fff1cf', 0.15 + 0.5 * arrive);
  });
  const u = ease((t - 587.5) / 2.2);
  layer(0.8, () => {
    // rows fill in from the front to the back while "eleven hundred" is said
    const tFill0 = 586.0, tFill1 = 587.9;
    for (const p of PEOPLE) {
      const st = lerp(tFill0, tFill1, p.r / (ROWS - 1) + (p.d - 0.5) * 0.06), show = (t - st) / 0.35;
      // hands go up under the letter as it passes over them
      const lu = (p.r / (ROWS - 1)) * 0.95 + 0.02, [lx] = pathAt(lu);
      const near = Math.abs(p.x - lx) < 170 * p.s + 40 ? 1 : 0;
      const raise = near * ramp(u, lu - 0.05, lu + 0.05) * (0.7 + 0.3 * p.up);
      person(ctx, p, t, show, raise);
    }
    letter(ctx, t, u);
  });
  const n = Math.round(1100 * out((t - 586.69) / 1.1) / 10) * 10;
  stamp(ctx, t, 586.69, 590.5, n.toLocaleString('en-US'), 'lab employees wrote to Washington', { size: 150, x: 96, y: 60 });
  quote(ctx, t, 590.71, T1 - 0.05, ['deliberately pace', 'the frontier'], 'Letter from 1,100 lab employees', 122, 84, { size: 70 });
}

module.exports = { T0, T1, draw };
