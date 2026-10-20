// Film 4 v2 · the minute, chunk c04: cached layers as decoded Images (the @napi-rs/canvas drawImage(<Canvas>) leak) and the ground
// of the plates. Owner: c04 (minute repair). Pattern copied from lib/sc01_m1_open.mjs (toImg / best / ready), never imported from there.
//   toImg(c), best(c), ready()      a cached Canvas is handed to the renderer as an Image once decoded (ready() awaits all decodes)
//   once(key, f)                    build a Canvas once, return its Image (or the Canvas until the Image has decoded)
//   plateBG(ctx, t, o)              the indigo engraving plate behind the letterpress plates (= lib/sc02_kit.mjs plateBG, same look,
//                                   its layer cached as an Image); o: { warm, cool, dx, dy }
import { Image } from '@napi-rs/canvas';
import { W, H, rgba, drift, canvas } from '../engine.mjs';
import { stipple } from './art.mjs';
import { guilloche } from './certificate.mjs';

const PEND = [], REC = new WeakMap();
const isCanvas = (c) => !!c && typeof c.getContext === 'function' && typeof c.toBuffer === 'function';
export const toImg = (c) => { if (!isCanvas(c) || REC.has(c)) return c; const im = new Image(), r = { im, ok: false }; REC.set(c, r); im.src = c.toBuffer('image/png'); PEND.push(im.decode().then(() => { r.ok = im.width > 0; }, () => { })); return c; };
export const best = (c) => { const r = REC.get(c); return r && r.ok ? r.im : c; };
export async function ready() { while (PEND.length) await PEND.shift(); }
const CACHE = new Map();
export const once = (k, f) => { if (!CACHE.has(k)) CACHE.set(k, toImg(f())); return best(CACHE.get(k)); };

// ---------------------------------------------------------------- the plate ground (copied from lib/sc02_kit.mjs, owner C2)
const PLATE = '#141433', CREAM = '#f3efe2';
function plateLayer() {
  return once('c04plate', () => {
    const w = W + 240, h = H + 240, [c, g] = canvas(w, h);
    const bg = g.createRadialGradient(w * .45, h * .42, 0, w * .5, h * .5, w * .7); bg.addColorStop(0, '#20204a'); bg.addColorStop(.6, PLATE); bg.addColorStop(1, '#0b0b22');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.save(); g.globalAlpha = .05; g.strokeStyle = CREAM; g.lineWidth = .8;
    for (let y = -h; y < h * 2; y += 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + w * .36); g.stroke(); }
    g.restore();
    const G = guilloche({ R: 900, A: 120, B: 40, n: 9, m: 4, lines: 22 }); g.save(); g.translate(w * .5, h * 1.25); g.strokeStyle = rgba(CREAM, .045); g.lineWidth = 1;
    for (let k = 0; k < G.lines; k++) { const P = G.line(k); g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); } g.restore();
    stipple(c, { k: .5, g: 1, seed: 21, mid: false, boost: 1.4 });
    return c;
  });
}
export function plateBG(ctx, t, o = {}) {
  const dx = (o.dx ?? 0) + drift(t, 5, 3), dy = (o.dy ?? 0) + drift(t, 3, 4);
  ctx.fillStyle = PLATE; ctx.fillRect(0, 0, W, H);
  ctx.drawImage(plateLayer(), -120 + dx, -120 + dy);
  const warm = o.warm ?? 1, cool = o.cool ?? 0;
  if (warm > 0) { const lx = 380 + 40 * Math.sin(t * .13), ly = -120, g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 1500); g.addColorStop(0, rgba('#ffb35c', .2 * warm)); g.addColorStop(.45, rgba('#e9a54b', .07 * warm)); g.addColorStop(1, rgba('#e9a54b', 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  if (cool > 0) { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgba('#9fb6cf', .08 * cool)); g.addColorStop(1, rgba('#9fb6cf', 0)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}
export const warmPlateBG = () => plateLayer();
