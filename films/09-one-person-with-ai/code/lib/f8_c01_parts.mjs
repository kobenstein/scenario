// c01 parts (owned by c01): the low clouds of 0.05 (lit by the workshop, its shadow a tower), the sleeping village of 0.04, the title of 0.01.
import { W, H, rgba, clamp, lin, mix, prng, canvas } from '../engine.mjs';
import { loadImage } from '@napi-rs/canvas';
import { landCam, F8, eoutX, einX } from './f8_kit.mjs';
import { vnoise, fbm } from './art.mjs';

const TAU = Math.PI * 2;
const IM = new Map(), PEND = [];
function cached(key, w, h, paint) {
  let e = IM.get(key); if (e) return e.img || e.c;
  const [c, g] = canvas(w, h); paint(g, c); e = { c, img: null }; IM.set(key, e);
  PEND.push(loadImage(c.toBuffer('image/png')).then((im) => { e.img = im; e.c = null; })); return c;
}
export async function partsReady() { cloudImg(false); cloudImg(true); await Promise.all(PEND.splice(0)); }

// ---------------------------------------------------------------- clouds: a low bank over the valley at depth 2 (reference centre y 470)
const CL = { d: 2, x0: -260, w: W + 520, y: 470, h: 320, heroX: 1000 };
function cloudImg(lit) {
  return cached('cloud:' + lit, CL.w, CL.h, (g) => {
    const q = 2, lw = CL.w / q, lh = CL.h / q, d = g.createImageData(lw, lh), p = d.data, n = vnoise(41), n2 = vnoise(77);
    for (let j = 0; j < lh; j++) for (let i = 0; i < lw; i++) {
      const x = i * q, y = j * q, v = y / CL.h, hu = x / CL.w, band = Math.pow(Math.sin(Math.PI * clamp(v * 1.05)), 1.2) * (1 - .55 * clamp((v - .55) * 2.4)) * Math.pow(Math.sin(Math.PI * hu), .6);
      const f = fbm(n, x * .0042, y * .011, 5) * .75 + fbm(n2, x * .012, y * .03, 3) * .25, cb = Math.exp(-Math.pow((x + CL.x0 - CL.heroX) / 520, 2)), den = clamp((f - .5 + .2 * cb) / .16) * band;
      let r = 40, gg = 38, b = 82, a = .62 * den;
      if (lit) { const dx = (x + CL.x0 - CL.heroX) / 760, fall = Math.exp(-dx * dx * 1.6) * (.35 + .65 * v); r = 255; gg = 186; b = 110; a = Math.min(1, den * fall * 1.25); }
      const o = (j * lw + i) * 4; p[o] = r; p[o + 1] = gg; p[o + 2] = b; p[o + 3] = 255 * a;
    }
    const [lc, lx] = canvas(lw, lh); lx.putImageData(d, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(lc, 0, 0, CL.w, CL.h);
    const dd = g.getImageData(0, 0, CL.w, CL.h), pp = dd.data, r = prng(lit ? 9 : 8);
    for (let i = 3; i < pp.length; i += 4) { const a = pp[i] / 255; if (a <= 0) continue; const kk = .6 * 4 * a * (1 - a), on = r() < a ? Math.min(1, a * 2.2) : 0; pp[i] = 255 * (a * (1 - kk) + kk * on); }
    g.putImageData(dd, 0, 0);
    // engraved underside lines
    g.globalCompositeOperation = 'source-atop'; g.strokeStyle = lit ? 'rgba(255,240,210,.18)' : 'rgba(120,115,190,.12)'; g.lineWidth = 1; g.beginPath();
    for (let y = 8; y < CL.h; y += 6) { g.moveTo(0, y); for (let x = 0; x <= CL.w; x += 40) g.lineTo(x, y + 2 * Math.sin(x * .01 + y)); } g.stroke();
  });
}
// the workshop silhouette (sawtooth), local units: x −120…120, y −104…0
function silhouette(ctx, x, y, s) {
  const v = 2.3; ctx.moveTo(x - 120 * s, y); ctx.lineTo(x - 122 * s, y - 70 * s * v);
  for (let i = 0; i < 4; i++) { const x0 = x + (-122 + i * 61) * s; ctx.lineTo(x0, y - 104 * s * v); ctx.lineTo(x0 + 61 * s, y - 70 * s * v); }
  ctx.lineTo(x + 120 * s, y); ctx.closePath();
}
export function c01Clouds(ctx, t, cam, o = {}) {
  const P = landCam(cam, CL.d), s = P.s, x = P.RX(CL.x0 + (t * 3) % 40 - 20), y = P.RY(CL.y - CL.h / 2);
  ctx.drawImage(cloudImg(false), x, y, CL.w * s, CL.h * s);
  const L = clamp(o.lit ?? 0); if (L <= 0) return;
  // the light of the workshop on the cloud underside, and in it the shadow: the workshop grown to the size of a tower
  const P0 = landCam(cam, 0), hx = P0.X(o.heroX ?? 1000) + (P.RX(CL.heroX) - P0.X(o.heroX ?? 1000)) * .35, base = P.RY(CL.y + 150), ss = 1.55 * s;
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); silhouette(ctx, hx, base, ss); ctx.clip('evenodd');
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = L; ctx.drawImage(cloudImg(true), x, y, CL.w * s, CL.h * s); ctx.globalAlpha = L * .6; ctx.drawImage(cloudImg(true), x, y, CL.w * s, CL.h * s); ctx.restore();
  // penumbra: a slightly larger silhouette, half the light taken away at its rim
  ctx.save(); ctx.beginPath(); silhouette(ctx, hx, base + 4 * s, ss * 1.04); ctx.rect(0, 0, W, H); ctx.clip('evenodd'); ctx.beginPath(); silhouette(ctx, hx, base, ss); ctx.clip();
  ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = L * .35; ctx.drawImage(cloudImg(true), x, y, CL.w * s, CL.h * s); ctx.restore();
}

// ---------------------------------------------------------------- the sleeping village round the workshop (0.04)
const HOUSES = (() => { const r = prng(606), out = []; for (let i = 0; i < 26; i++) { let sx = 560 + r() * 880; if (Math.abs(sx - 1000) < 70) sx += sx < 1000 ? -90 : 90; out.push({ sx, d: .04 + r() * .4, w: 40 + r() * 28, h: 22 + r() * 14, roof: .5 + r() * .4, chim: r() < .5, win: r() < .4, seed: i }); } out.sort((a, b) => b.d - a.d); return out; })();
const LAST = HOUSES.findIndex((h) => h.d < .2 && h.sx > 1080 && h.sx < 1250);
export function c01Village(ctx, t, cam, o = {}) {
  for (let i = 0; i < HOUSES.length; i++) {
    const hs = HOUSES[i], P = landCam(cam, hs.d), k = P.k * .32, x = P.RX(hs.sx), y = P.RY(866 + hs.d * 18);
    if (x < -200 || x > W + 200 || k * hs.w > 3000) continue;
    const w = hs.w * k, h = hs.h * k, rh = hs.w * hs.roof * .55 * k;
    ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - h); ctx.lineTo(x, y - h - rh); ctx.lineTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y); ctx.closePath();
    ctx.fillStyle = '#0f1131'; ctx.fill(); ctx.strokeStyle = rgba('#7a70c0', .35); ctx.lineWidth = Math.max(.6, k * .9); ctx.stroke();
    // roof face a shade darker, engraved
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 2 * k, y - h); ctx.lineTo(x, y - h - rh); ctx.lineTo(x + w / 2 + 2 * k, y - h); ctx.strokeStyle = rgba('#8f86d8', .5); ctx.stroke();
    if (hs.chim) { ctx.fillStyle = '#0f1131'; ctx.fillRect(x + w * .18, y - h - rh * .9, 5 * k, rh * .55); }
    // windows: dark panes; one warm window that goes out on "sleeps"
    for (let j = 0; j < 2; j++) {
      const wx = x - w * .28 + j * w * .38, wy = y - h * .72, ww = 6 * k, wh = 8 * k;
      const warm = i === LAST && j === 1 ? clamp(1 - (t - o.lastOut) / .22) : 0;
      ctx.fillStyle = warm > 0 ? rgba('#ffb35c', .25 + .7 * warm) : '#07081a'; ctx.fillRect(wx, wy, ww, wh);
      if (warm > 0) { const g = ctx.createRadialGradient(wx + ww / 2, wy + wh / 2, 0, wx + ww / 2, wy + wh / 2, 26 * k); g.addColorStop(0, rgba('#ffb35c', .3 * warm)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(wx - 30 * k, wy - 30 * k, 60 * k, 60 * k); }
    }
  }
}

// ---------------------------------------------------------------- the title: "The Rise of / AI-Native Companies", word masks (o.at: one start time per word)
export function c01Title(ctx, t, o) {
  const words = [['The', 0, 0], ['Rise', 0, 1], ['of', 0, 2], ['AI-Native', 1, 4], ['Companies', 1, 5]], size = 104, X = 150, Y = [262, 372];
  ctx.save(); ctx.font = `${size}px "Instrument Serif"`; ctx.textBaseline = 'alphabetic';
  let x = [X, X];
  for (const [w, line, k] of words) {
    const ww = ctx.measureText(w).width, t0 = o.at[k] - .05, u = eoutX(lin(t0, t0 + .5, t)), out = einX(lin(o.out + k * .06, o.out + .4 + k * .06, t));
    const x0 = x[line]; x[line] += ww + 26;
    if (u <= 0 || out >= 1) continue;
    // mask: the word rises from its baseline into view (and leaves upward into its own top edge)
    const top = Y[line] - size * .82, bot = Y[line] + size * .22;
    ctx.save(); ctx.beginPath(); ctx.rect(x0 - 6, top, ww + 12, bot - top); ctx.clip();
    const dy = (1 - u) * size * 1.0 - out * size * 1.05;
    ctx.fillStyle = '#efe6cf'; ctx.fillText(w, x0, Y[line] + dy);
    ctx.restore();
  }
  ctx.restore();
}
