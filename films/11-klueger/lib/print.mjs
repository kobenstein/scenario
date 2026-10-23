// Print-texture finish for Film 5 (applied once per frame by the Film runner, after transitions, before vignette + grain).
// The whole film reads as a print: paper fibre everywhere, a halftone screen that shows only in the light, engraved
// hatching that shows only in the shadows, and a slight risograph misregistration (red plate shifted ~2 px).
// One pixel pass (~30 ms at 1080p): canvas.data() read + luminance-driven LUTs + putImageData.
// Per shot: entry.print = { riso, halftone, hatch, fibre } (0..2, default 1 each) or print: false to switch it off.
import { W, H, prng, canvas, clamp, grain } from '../engine.mjs';
import { printFinish as artFinish } from './art.mjs';
import { ImageData } from '@napi-rs/canvas';

const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
// fibre tile (grey 128 = neutral)
const FIBT = (() => {
  const S = 1024, [c, x] = canvas(S, S), r = prng(41);
  x.fillStyle = '#808080'; x.fillRect(0, 0, S, S); x.lineCap = 'round';
  for (let i = 0; i < 3200; i++) {
    const px = r() * S, py = r() * S, L = 6 + r() * 42, a0 = r() * Math.PI * 2, bend = (r() - .5) * .9, light = r() < .55;
    x.strokeStyle = light ? `rgba(255,255,255,${.12 + r() * .25})` : `rgba(0,0,0,${.1 + r() * .22})`;
    x.lineWidth = .5 + r() * .9; x.beginPath(); x.moveTo(px, py);
    x.quadraticCurveTo(px + Math.cos(a0) * L * .5, py + Math.sin(a0) * L * .5, px + Math.cos(a0 + bend) * L, py + Math.sin(a0 + bend) * L); x.stroke();
  }
  for (let i = 0; i < 160; i++) { const px = r() * S, py = r() * S, R = 20 + r() * 90, g = x.createRadialGradient(px, py, 0, px, py, R), v = r() < .5 ? '255,255,255' : '0,0,0'; g.addColorStop(0, `rgba(${v},${.05 + r() * .06})`); g.addColorStop(1, `rgba(${v},0)`); x.fillStyle = g; x.fillRect(px - R, py - R, 2 * R, 2 * R); }
  return c;
})();
// per-pixel masks, built once: DOT (halftone, <=0), HAT (engraved hatch, >=0), FIB (fibre, +-)
let DOT, HAT, FIB;
function masks() {
  if (DOT) return;
  DOT = new Int8Array(W * H); HAT = new Int8Array(W * H); FIB = new Int8Array(W * H);
  const fb = FIBT.data(), S = 1024, cs = Math.cos(.26), sn = Math.sin(.26), cell = 6.5, ha = -.86, hc = Math.cos(ha), hs = Math.sin(ha), gap = 8.5;
  const r = prng(77), brk = Array.from({ length: 4096 }, () => r());
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const j = y * W + x;
    // halftone: hex-ish grid rotated 15°
    const u = (x * cs - y * sn) / cell, v = (x * sn + y * cs) / cell, row = Math.floor(v), uu = u - (row & 1) * .5;
    const du = uu - Math.round(uu), dv = v - row - .5, d = Math.hypot(du, dv * 1.0) * cell;
    DOT[j] = -Math.round(30 * (1 - sstep(1.0, 2.1, d)));
    // engraved hatch: wobbly lines, broken in places
    const p = (x * hc + y * hs) / gap + .18 * Math.sin((x * -hs + y * hc) * .021), q = Math.abs(p - Math.round(p)) * gap;
    const seg = brk[(Math.round(p) * 31 + Math.floor((x * -hs + y * hc) / 90)) & 4095];
    HAT[j] = seg < .18 ? 0 : Math.round(16 * (1 - sstep(.35, 1.1, q)));
    FIB[j] = Math.round((fb[((y % S) * S + (x % S)) * 4] - 128) * .11);
  }
}
const LL = new Float32Array(256), LD = new Float32Array(256);
for (let i = 0; i < 256; i++) { LL[i] = sstep(.42, .9, i / 255); LD[i] = (1 - sstep(.05, .3, i / 255)) * sstep(0, .03, i / 255 + .015); }

const LLi = new Int32Array(256), LDi = new Int32Array(256);
let ID = null; // one reusable ImageData (creating one per frame costs ~30 ms)
export function printFinish(ctx, t, o = {}) {
  const riso = o.riso ?? 1, ht = o.halftone ?? 1, hat = o.hatch ?? 1, fib = o.fibre ?? 1, src = o.canvas || ctx.canvas;
  if (!src) return;
  masks();
  for (let i = 0; i < 256; i++) { LLi[i] = Math.round(LL[i] * ht * 256); LDi[i] = Math.round(LD[i] * hat * 256); }
  const fk = Math.round(fib * 256);
  if (!ID) ID = new ImageData(W, H);
  ID.data.set(src.data()); const p = ID.data, n = p.length;
  // riso: the red plate is read from (x - dx, y + 1), a pixel further on in memory (not yet written), so no copy is needed
  const dx = Math.round(2 * riso), dy = riso ? 1 : 0, offR = (dy * W - dx) * 4, last = H - dy;
  for (let y = 0; y < H; y++) {
    const row = y * W, rd = y < last;
    for (let x = 0, i = row * 4, j = row; x < W; x++, i += 4, j++) {
      const r = p[i], g = p[i + 1], b = p[i + 2], l = (r * 77 + g * 150 + b * 29) >> 8;
      const add = (LLi[l] * DOT[j] + LDi[l] * HAT[j] + fk * FIB[j]) >> 8;
      p[i] = (rd && x >= dx ? p[i + offR] : r) + add; p[i + 1] = g + add; p[i + 2] = b + add;
    }
  }
  ctx.putImageData(ID, 0, 0);
}

// object-level texture (a sheet, the map paper): fibre and halftone clipped to the current path (fast drawImage, no pixel pass)
let FIBC = null, DOTC = null;
function texCanvases() {
  if (FIBC) return;
  let x; [FIBC, x] = canvas(); const r = prng(43); x.lineCap = 'round';
  for (let i = 0; i < 9000; i++) { const px = r() * W, py = r() * H, L = 5 + r() * 34, a0 = r() * 6.3, bend = (r() - .5) * .9; x.strokeStyle = r() < .5 ? `rgba(255,250,240,${.1 + r() * .25})` : `rgba(40,30,20,${.08 + r() * .2})`; x.lineWidth = .5 + r() * .8; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a0) * L * .5, py + Math.sin(a0) * L * .5, px + Math.cos(a0 + bend) * L, py + Math.sin(a0 + bend) * L); x.stroke(); }
  [DOTC, x] = canvas(); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.fillStyle = '#8a847c';
  for (let y = 0, row = 0; y < H + 8; y += 6, row++) for (let xx = (row & 1) * 3; xx < W + 8; xx += 6) { x.beginPath(); x.arc(xx, y, 1.3, 0, 7); x.fill(); }
}
export function fibreFill(ctx, a = .5) { texCanvases(); ctx.save(); ctx.clip(); ctx.globalAlpha = a; ctx.drawImage(FIBC, 0, 0); ctx.restore(); }
export function halftoneFill(ctx, a = .5) { texCanvases(); ctx.save(); ctx.clip(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = a; ctx.drawImage(DOTC, 0, 0); ctx.restore(); }

// The film-level finish (engine Film calls it once per frame): our print pass (riso, halftone in light, hatch in shadow,
// fibre) at a gentle default, then Film 4's approved art.printFinish (vignette + paper tooth), plus a little moving grain.
// entry.print = { riso, halftone, hatch, fibre, vig, grain, lift, tint } per shot; print: false keeps only vignette + grain.
export function filmFinish(ctx, t, o = {}) {
  if (!o.off) printFinish(ctx, t, { riso: o.riso ?? .5, halftone: o.halftone ?? .6, hatch: o.hatch ?? .6, fibre: o.fibre ?? .6 });
  artFinish(ctx, { grain: o.grain ?? .075, vig: o.vig ?? .42, lift: o.lift ?? 0, tint: o.tint ?? null });
  grain(ctx, t, .028);
}
