// c07 · the chart (7.10): the shaving that flew up from the plane fills the frame (its pale wood, its grain); the wood turns to paper,
// its grain lines shrink into the paper's fibres and the bright middle one straightens into the amber line of an engraved chart:
// LIFE SATISFACTION / YEARS AFTER THE WIN 5–22, WINNERS (amber) level above MATCHED NON-WINNERS (dotted), SCHEMATIC + source.
// On "not less" the amber line glints; the camera pushes into the blank paper beside the chart until it IS the c07>c08 paper plate.
//   chartM(t, K)             sheet → screen (sheet coordinates = the plate's screen coordinates: identity at H.a − 1/30)
//   woodSurface(ctx, M, t, u) the shaving's surface in sheet coordinates (u 0 wood … 1 gone into the paper); lib/v2_c07_shop.mjs draws it too
//   chartTake(ctx, t, K)
// The paper is handoff4's paperPlate (tone cream) copied: the same gradient, the same 420 fibres (prng 77), the same watermark rosette,
// the same vignette; the sheet only goes on beyond the plate's rectangle (more fibres there, a second light over the chart).
import { W, H, rgba, clamp, mix, prng, drift } from '../engine.mjs';
import { TAU, sstep, cio, mixHex, setT } from './v2_c07_kit.mjs';

const PC = ['#f3ecda', '#e3d6b8', '#cdbb94'];
const FIB = (() => { const r = prng(77), f = []; for (let i = 0; i < 420; i++) f.push([r() * W, r() * H, (r() - .5) * 2.4, 6 + r() * 26, r()]); return f; })();
// fibres beyond the plate (never reaching into its rectangle)
const FIBX = (() => { const r = prng(178), f = []; while (f.length < 2600) { const x = -2700 + r() * 4900, y = -700 + r() * 2500, a = (r() - .5) * 2.4, L = 6 + r() * 26, k = r(); if (x > -34 && x < W + 34 && y > -34 && y < H + 34) continue; f.push([x, y, a, L, k]); } return f; })();
const X0 = -2000, X1 = -560, Y0 = 800, YT = 190, yrX = (y) => X0 + y / 23 * (X1 - X0), WIN_Y = 380, NON_Y = 520;
export const WMID = [(yrX(5) + yrX(22)) / 2, WIN_Y];
const K0 = 3.2;   // the close-up on the amber line where the shaving's surface fills the frame (chart0)
const SRC = 'SOURCE: LINDQVIST, ÖSTLING & CESARINI (2020), REVIEW OF ECONOMIC STUDIES';

// ---------------------------------------------------------------- the camera
const camM = (k, cx, cy) => [k, 0, 0, k, W / 2 - k * cx, H / 2 - k * cy];
export const chartM0 = () => camM(K0, WMID[0], WMID[1]);
export function chartM(t, K) {
  const tEnd = K.ha - 1 / 30;
  if (t >= tEnd) return [1, 0, 0, 1, 0, 0];
  const u1 = cio(clamp((t - K.chart0 - .25) / 1.15)), hold = { k: .66, x: -1090, y: 555 };
  let k = Math.exp(mix(Math.log(K0), Math.log(hold.k), u1)), x = mix(WMID[0], hold.x, u1), y = mix(WMID[1], hold.y, u1);
  k *= 1 + .02 * sstep(K.chart0 + 1.4, K.push0, t); x += 12 * drift(t, 1, 2) * u1;
  const u2 = clamp((t - K.push0) / (tEnd - K.push0));
  if (u2 > 0) { const e = u2 * u2 * (3 - 2 * u2), e2 = cio(u2); k = Math.exp(mix(Math.log(k), 0, e)); x = mix(x, W / 2, e2); y = mix(y, H / 2, e2); }
  return camM(k, x, y);
}

// ---------------------------------------------------------------- the sheet (the plate's paper, extended)
function sheet(ctx, M, t) {
  const lx = W * .32 + 30 * drift(t, 1, 2), ly = H * .25;
  ctx.save(); setT(ctx, M);
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1700); g.addColorStop(0, PC[0]); g.addColorStop(.6, PC[1]); g.addColorStop(1, PC[2]);
  ctx.fillStyle = g; ctx.fillRect(-3200, -1400, 7000, 4000);
  // a second light over the chart (it ends before the plate's rectangle)
  const g2 = ctx.createRadialGradient(-1150, 480, 0, -1150, 480, 1100); g2.addColorStop(0, rgba(PC[0], .9)); g2.addColorStop(.55, rgba(PC[0], .55)); g2.addColorStop(1, rgba(PC[0], 0));
  ctx.fillStyle = g2; ctx.fillRect(-2250, -620, 2200, 2200);
  ctx.lineCap = 'round';
  for (const L of [FIBX, FIB]) for (const [x, y, a, Ln, k] of L) { ctx.strokeStyle = rgba(k < .5 ? '#8a7350' : '#fffaf0', .07 + .06 * k); ctx.lineWidth = .7 + k * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * Ln, y + Math.sin(a) * Ln); ctx.stroke(); }
  ctx.strokeStyle = rgba('#9c8458', .1); ctx.lineWidth = .8; const R0 = 300, rot = t * .02;
  for (let k = 0; k < 7; k++) { ctx.beginPath(); for (let i = 0; i <= 360; i++) { const q = i / 360 * TAU, rr = R0 * (.78 + .06 * k / 7) + 26 * Math.sin(q * 12 + k * .9 + rot * 4); const x = W * .72 + rr * Math.cos(q + rot), y = H * .56 + rr * Math.sin(q + rot) * .92; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
  ctx.restore();
}
const vignette = (ctx) => { const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .75); v.addColorStop(0, 'rgba(60,40,20,0)'); v.addColorStop(1, 'rgba(60,40,20,.22)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); };

// ---------------------------------------------------------------- the shaving's surface (wood) and its middle grain = the amber line
const GRAIN = (() => { const r = prng(606), o = []; for (let i = -16; i <= 16; i++) if (i) o.push({ y: WIN_Y + i * 10.6 + (r() - .5) * 4, a: 1.2 + r() * 2.6, f: .004 + r() * .006, ph: r() * TAU, w: .6 + r() * 1.1, d: r() < .3 }); return o; })();
const wavy = (y, a, f, ph, x0, x1, n = 60) => { const o = []; for (let i = 0; i <= n; i++) { const x = mix(x0, x1, i / n); o.push([x, y + a * Math.sin(x * f + ph) + a * .4 * Math.sin(x * f * 2.7 + ph * 2)]); } return o; };
const strokeL = (ctx, L) => { ctx.beginPath(); L.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
// the line of the winners: at u = 0 the shaving's bright middle grain (honey, a little wavy, running on past the frame), at u = 1 the
// chart's amber line (straight, level, from year 5 to year 22)
function winLine(ctx, t, u, glint = -1) {
  const x0 = mix(-2600, yrX(5), sstep(.3, 1, u)), x1 = mix(600, yrX(22), sstep(.3, 1, u)), pts = wavy(WIN_Y, 2.2 * (1 - u), .006, 1.3, x0, x1, 120).map(([x, y], i) => [x, y + 1.2 * Math.sin(i * .37 + t * .4) * u]);
  ctx.lineCap = 'round';
  ctx.strokeStyle = mixHex('#c99858', '#7a3b17', u); ctx.lineWidth = mix(2.2, 9, u); strokeL(ctx, pts);
  ctx.strokeStyle = mixHex('#f6dfb2', '#ffb35c', u); ctx.lineWidth = mix(1.2, 6, u); strokeL(ctx, pts);
  if (u > .5) { ctx.strokeStyle = rgba('#fff1d6', .55 * (u - .5) * 2); ctx.lineWidth = 1.6; strokeL(ctx, pts.map(([x, y]) => [x, y - 1.5])); }
  if (glint >= 0 && glint <= 1) {   // a bright foil glint running along the line
    const gx = mix(yrX(5) - 60, yrX(22) + 60, glint), g = ctx.createLinearGradient(gx - 90, 0, gx + 90, 0);
    g.addColorStop(0, 'rgba(255,241,214,0)'); g.addColorStop(.5, 'rgba(255,248,232,.95)'); g.addColorStop(1, 'rgba(255,241,214,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = g; ctx.lineWidth = 7; strokeL(ctx, pts); ctx.restore();
  }
}
export function woodSurface(ctx, M, t, u = 0) {
  ctx.save(); setT(ctx, M);
  if (u < 1) {
    ctx.globalAlpha = 1 - u;
    const g = ctx.createLinearGradient(0, WIN_Y - 200, 0, WIN_Y + 200); g.addColorStop(0, '#e2bd84'); g.addColorStop(.45, '#efd3a0'); g.addColorStop(.55, '#f1d7a6'); g.addColorStop(1, '#ddb57a');
    ctx.fillStyle = g; ctx.fillRect(-3000, WIN_Y - 900, 6000, 1800);
    ctx.globalAlpha = 1;
  }
  // the grain: the lines shrink into short fibres as the wood becomes paper (dashes get shorter, never transparent)
  for (const G of GRAIN) {
    const dash = mix(400, 0, sstep(0, .8, u)); if (dash < .5) continue;
    ctx.setLineDash(u > 0 ? [dash, mix(0, 34, sstep(0, .5, u))] : []);
    ctx.strokeStyle = G.d ? '#b48550' : '#c99a62'; ctx.lineWidth = G.w * (G.d ? 1.4 : 1); strokeL(ctx, wavy(G.y, G.a * (1 - u * .8), G.f, G.ph, -2600, 600, 90));
  }
  ctx.setLineDash([]);
  winLine(ctx, t, u);
  ctx.restore();
}

// ---------------------------------------------------------------- the chart (engraved: the lines grow, the type is printed letter by letter)
function typeIn(ctx, str, x, y, u, o = {}) {
  if (u <= 0) return;
  ctx.font = o.font; ctx.fillStyle = o.col || '#22304a'; ctx.textBaseline = 'alphabetic';
  try { ctx.letterSpacing = (o.sp ?? 0) + 'px'; } catch { }
  const full = ctx.measureText(str).width, x0 = o.align === 'right' ? x - full : o.align === 'center' ? x - full / 2 : x;
  ctx.textAlign = 'left'; ctx.fillText(str.slice(0, Math.ceil(str.length * clamp(u))), x0, y);
  try { ctx.letterSpacing = '0px'; } catch { }
}
function chart(ctx, M, t, K, u) {
  const c0 = K.chart0, INK = '#22304a';
  ctx.save(); setT(ctx, M); ctx.lineCap = 'butt';
  const ua = cio(clamp((t - c0 - .45) / .5));
  if (ua > 0) {
    ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(mix(X0, X1 + 40, ua), Y0); ctx.moveTo(X0, Y0); ctx.lineTo(X0, mix(Y0, YT, ua)); ctx.stroke();
    if (ua >= 1) { ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(X0, YT - 22); ctx.lineTo(X0 - 9, YT + 2); ctx.lineTo(X0 + 9, YT + 2); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(X1 + 62, Y0); ctx.lineTo(X1 + 40, Y0 - 9); ctx.lineTo(X1 + 40, Y0 + 9); ctx.closePath(); ctx.fill(); }
    ctx.lineWidth = 2; ctx.beginPath(); for (let y = 0; y <= 22; y++) { const x = yrX(y); if (x > mix(X0, X1 + 40, ua)) break; const L = y % 5 === 0 ? 16 : 8; ctx.moveTo(x, Y0); ctx.lineTo(x, Y0 + L); } ctx.stroke();
    // the engraved ruling of the plot area (fine)
    ctx.strokeStyle = rgba(INK, .12); ctx.lineWidth = 1; ctx.beginPath(); for (let y = Y0 - 100; y > YT + 20; y -= 100) { ctx.moveTo(X0, y); ctx.lineTo(mix(X0, X1, ua), y); } ctx.stroke();
  }
  const ul = (d, dur) => (t - c0 - d) / dur;
  ctx.textAlign = 'center';
  for (const [i, y] of [5, 10, 15, 20].entries()) typeIn(ctx, String(y), yrX(y), Y0 + 52, ul(.75 + i * .08, .12), { font: '600 34px "Inter"', align: 'center', col: INK });
  typeIn(ctx, 'YEARS AFTER THE WIN', (X0 + X1) / 2, Y0 + 112, ul(1.0, .5), { font: '600 40px "Inter"', align: 'center', sp: 4, col: INK });
  typeIn(ctx, 'LIFE SATISFACTION', X0, YT - 48, ul(.8, .5), { font: '600 40px "Inter"', sp: 4, col: INK });
  // matched non-winners: dotted, printed dot after dot from year 5 to year 22
  const un = clamp(ul(.9, .6));
  if (un > 0) { ctx.fillStyle = rgba(INK, .85); const n = 56; for (let i = 0; i <= n * un; i++) { const x = mix(yrX(5), yrX(22), i / n), y = NON_Y + 1.5 * Math.sin(i * .9); ctx.beginPath(); ctx.arc(x, y, 4.2, 0, TAU); ctx.fill(); } }
  typeIn(ctx, 'WINNERS', yrX(22) + 30, WIN_Y + 13, ul(1.15, .3), { font: '600 40px "Inter"', sp: 3, col: '#9a5420' });
  typeIn(ctx, 'MATCHED NON-WINNERS', yrX(22) + 30, NON_Y + 13, ul(1.3, .45), { font: '600 40px "Inter"', sp: 3, col: INK });
  typeIn(ctx, 'SCHEMATIC', X1 + 60, YT - 48, ul(1.2, .3), { font: '600 30px "Inter"', align: 'right', sp: 5, col: rgba(INK, .75) });
  typeIn(ctx, SRC, X0, Y0 + 178, ul(1.2, .5), { font: '600 30px "Inter"', sp: 1.5, col: rgba(INK, .8) });
  // the amber line (the shaving straightened), glinting on "not" (while the wood is still there, woodSurface draws it)
  if (u >= 1) winLine(ctx, t, u, K.glint ? (t - K.glint) / .55 : -1);
  ctx.restore();
}
export function chartTake(ctx, t, K) {
  const M = chartM(t, K), u = clamp((t - K.chart0) / .45);
  sheet(ctx, M, t);
  if (t < K.ha - 1 / 30) { chart(ctx, M, t, K, u); if (u < 1) woodSurface(ctx, M, t, u); }
  ctx.save(); ctx.globalAlpha = sstep(K.chart0, K.chart0 + .6, t); vignette(ctx); ctx.restore();   // the shop has none: it grows in with the sheet
}
