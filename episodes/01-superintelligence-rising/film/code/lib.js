// Scenario code-drawn look: flat editorial shapes, grain gradients, soft light, risograph speckle.
// Everything is drawn from code each frame, so every element can move. Deterministic in t.
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const EP = path.resolve(__dirname, '..', '..');
GlobalFonts.registerFromPath(path.join(EP, 'fonts', 'InstrumentSerif-Regular.ttf'), 'Instrument Serif');
GlobalFonts.registerFromPath(path.join(EP, 'fonts', 'Inter-Medium.otf'), 'Inter Medium');
GlobalFonts.registerFromPath(path.join(EP, 'fonts', 'Inter-SemiBold.otf'), 'Inter SemiBold');

// createPattern copies its image into native memory that is never freed (~1 MB per call for a 512 px texture),
// and scenes call it every frame, so hand out one pattern per image and repetition.
{ const proto = Object.getPrototypeOf(createCanvas(1, 1).getContext('2d')), orig = proto.createPattern, cache = new WeakMap();
  proto.createPattern = function (img, rep) { let m = cache.get(img); if (!m) cache.set(img, m = {}); return m[rep] ??= orig.call(this, img, rep); }; }

const W = 1920, H = 1080, FPS = 30;
const C = {
  ink: '#070918', night: '#0b0f2a', indigo: '#151a44', violet: '#3b2f6e', dusk: '#5a4a8a',
  cyan: '#8fe6ff', cyanW: '#d8f7ff', cyanD: '#0a6f8c', amber: '#ffb35c', amberD: '#7a3b17', amberM: '#c9702e',
  cream: '#f3efe2', lav: '#a49fc4',
};

const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x;
const sm = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const out = x => 1 - Math.pow(1 - clamp(x), 3);
const ramp = (t, a, b) => sm((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
function hash(...a) { let h = 2166136261; for (const v of a) for (const ch of String(v)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h / 4294967295; }
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909), ((s ^= s >>> 16) >>> 0) / 4294967295); }
// slow organic wobble that never stops
const drift = (t, f = 1, seed = 0) => Math.sin(t * 0.37 * f + seed) + 0.5 * Math.sin(t * 0.83 * f + 2.1 * seed) + 0.25 * Math.sin(t * 1.71 * f + 0.7 + seed);

// ---------- grain textures (built once) ----------
function speckle(w, h, density, seed, color) {
  const c = createCanvas(w, h), x = c.getContext('2d'), img = x.createImageData(w, h), r = rng(seed);
  const [R, G, B] = color;
  for (let i = 0; i < w * h; i++) if (r() < density) { img.data[i * 4] = R; img.data[i * 4 + 1] = G; img.data[i * 4 + 2] = B; img.data[i * 4 + 3] = 90 + r() * 140; }
  x.putImageData(img, 0, 0); return c;
}
const TEX = {};
function tex() {
  if (TEX.dark) return TEX;
  TEX.dark = speckle(512, 512, 0.16, 3, [4, 4, 16]);     // shadow speckle laid into gradients
  TEX.light = speckle(512, 512, 0.06, 5, [255, 240, 220]);
  TEX.film = [0, 1, 2, 3].map(k => speckle(W, H, 0.05, 11 + k, [128, 128, 128]));
  return TEX;
}

// fill a path with a gradient, then lay risograph speckle into it (texture, never noise on top of text)
function grainFill(ctx, pathFn, fill, grain = 0.5) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) { ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = ctx.createPattern(tex().dark, 'repeat');
    // only cover the visible frame (in local coordinates), not a huge fixed square
    const m = ctx.getTransform().inverse(), xs = [], ys = [];
    for (const [x, y] of [[0, 0], [W, 0], [0, H], [W, H]]) { xs.push(m.a * x + m.c * y + m.e); ys.push(m.b * x + m.d * y + m.f); }
    ctx.fillRect(Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)); }
  ctx.restore();
}

function lin(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function rad(ctx, x, y, r0, r1, stops) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }

// additive light
function light(ctx, x, y, r, hex, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, x, y, 0, r, [[0, rgba(hex, a)], [0.35, rgba(hex, a * 0.35)], [1, rgba(hex, 0)]]);
  ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}
// a cone of light (lamp, screen spill)
function cone(ctx, x, y, w0, w1, h, hex, a) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, x, y, x, y + h, [[0, rgba(hex, a)], [1, rgba(hex, 0)]]);
  ctx.beginPath(); ctx.moveTo(x - w0 / 2, y); ctx.lineTo(x + w0 / 2, y); ctx.lineTo(x + w1 / 2, y + h); ctx.lineTo(x - w1 / 2, y + h); ctx.closePath(); ctx.fill(); ctx.restore();
}

// film finish: vignette + moving film grain
function finish(ctx, fi) {
  const T = tex();
  ctx.save();
  ctx.fillStyle = rad(ctx, W / 2, H / 2, H * 0.45, H * 1.05, [[0, 'rgba(4,4,16,0)'], [1, 'rgba(4,4,16,0.55)']]);
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.22; ctx.drawImage(T.film[fi % 4], 0, 0);
  ctx.restore();
}

// ---------- typography ----------
function stamp(ctx, t, t0, t1, big, sub, opt = {}) {
  const a = ramp(t, t0, t0 + 0.6) * (1 - ramp(t, t1 - 0.5, t1)); if (a <= 0) return;
  const rise = (1 - out((t - t0) / 0.9)) * 18, x = opt.x ?? 96, y = opt.y ?? 70;
  ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(4,4,16,0.75)'; ctx.shadowBlur = 24;
  ctx.fillStyle = opt.color ?? C.cream; ctx.font = `${opt.size ?? 120}px "Instrument Serif"`; ctx.textBaseline = 'top';
  ctx.fillText(big, x, y + rise);
  if (sub) { ctx.font = '26px "Inter Medium"'; ctx.fillStyle = opt.subColor ?? C.lav; ctx.letterSpacing = '6px'; ctx.fillText(sub.toUpperCase(), x + 4, y + rise + (opt.size ?? 120) * 1.02); }
  ctx.restore();
}
function label(ctx, t, t0, t1, text, sub, x, y, opt = {}) {
  const a = ramp(t, t0, t0 + 0.6) * (1 - ramp(t, t1 - 0.5, t1)); if (a <= 0) return;
  const rise = (1 - out((t - t0) / 0.9)) * 12, wipe = out((t - t0) / 0.8);
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = opt.color ?? C.amber; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y + rise); ctx.lineTo(x + 56 * wipe, y + rise); ctx.stroke();
  ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 18; ctx.textBaseline = 'top';
  ctx.fillStyle = C.cream; ctx.font = '40px "Inter SemiBold"'; ctx.fillText(text, x, y + 18 + rise);
  if (sub) { ctx.fillStyle = C.lav; ctx.font = '24px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.fillText(sub.toUpperCase(), x + 2, y + 70 + rise); }
  ctx.restore();
}

module.exports = { createCanvas, W, H, FPS, C, clamp, sm, ease, out, ramp, lerp, hash, rng, drift, tex, grainFill, lin, rad, rgba, light, cone, finish, stamp, label, speckle };
