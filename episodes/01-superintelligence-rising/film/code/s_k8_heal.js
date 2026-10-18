// "Almost 99 percent of those chemicals have been phased out, and the ozone layer is on track to recover."
// Left: a hundred spray cans. One by one they go dark while the counter climbs to ~99%; one is left.
// Right: the same globe. On "recover" the hole over the pole slowly closes and a warm dawn creeps over the rim.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, stamp, out, ease } = L;
const { drawGlobe, stars } = require('./s_k8_globe');

const T0 = 522.25, T1 = 528.90;

function rr(c, x, y, w, h, r) { c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

const N = 10, GX = 110, GY = 290, SP = 62;
const KEEP = 63;   // the one that stays
const CANS = (() => { const r = rng(99), idx = []; for (let i = 0; i < N * N; i++) if (i !== KEEP) idx.push([r(), i]);
  idx.sort((a, b) => a[0] - b[0]); const out = Array(N * N).fill(1e9);
  idx.forEach(([, i], k) => { out[i] = 522.65 + 3.0 * Math.pow(k / (idx.length - 1), 0.85); }); return out.map((t, i) => ({ t, ph: r() * 6, tilt: (r() - 0.5) * 0.12 })); })();

let CAN = null;
function canSprite() {
  if (CAN) return CAN;
  const cv = L.createCanvas(60, 80), c = cv.getContext('2d');
  c.translate(30, 78);
  c.fillStyle = lin(c, -18, 0, 18, 0, [[0, '#c48ad0'], [0.45, '#9a5aa8'], [1, '#4a2458']]); c.beginPath(); rr(c, -18, -56, 36, 56, 6); c.fill();
  c.fillStyle = 'rgba(243,239,226,0.85)'; c.fillRect(-18, -40, 36, 16);
  c.fillStyle = 'rgba(74,36,88,0.8)'; c.fillRect(-12, -35, 18, 3); c.fillRect(-12, -30, 12, 3);
  c.fillStyle = '#e9e2cc'; c.beginPath(); rr(c, -12, -70, 24, 15, 4); c.fill();
  c.fillStyle = '#2a1a3a'; c.fillRect(8, -66, 8, 5);
  c.fillStyle = 'rgba(255,255,255,0.25)'; c.fillRect(-13, -54, 4, 50);
  CAN = cv; return cv;
}

function draw(ctx, t) {
  const k = (t - T0) / (T1 - T0);
  const dx = drift(t, 1, 2) * 5, dy = drift(t, 1, 6) * 4;
  stars(ctx, t, 0.8);
  // globe: hole from the previous scene, closing on "recover"
  const close = ease(ramp(t, 526.2, 528.6));
  const warm = ramp(t, 526.0, 528.7);
  const R = lerp(380, 400, sm(k));
  drawGlobe(ctx, { cx: 1340 + dx, cy: 520 + dy, R, lat0: lerp(-58, -52, sm(k)), lon0: -40 + (t - 517) * 4, hole: lerp(26, 0, close), t, warm, holeGlow: 1 - 0.6 * close, shell: 1 + 0.3 * warm });
  // the cans
  const spr = canSprite();
  for (let i = 0; i < N * N; i++) {
    const c = CANS[i], gx = i % N, gy = Math.floor(i / N);
    const x = GX + gx * SP + 4 * Math.sin(t * 0.7 + gy * 0.5) * 0, y = GY + gy * SP;
    const off = ramp(t, c.t, c.t + 0.35);
    const bob = Math.sin(t * 2 + c.ph) * 1.2 * (1 - off);
    ctx.save(); ctx.translate(x + 28, y + 50 + bob); ctx.rotate(c.tilt * (1 - off)); ctx.scale(0.8 - 0.08 * off, 0.8 - 0.08 * off);
    ctx.globalAlpha = lerp(1, 0.13, off);
    ctx.drawImage(spr, -30, -78);
    ctx.restore();
    // a tiny puff when it goes out
    if (off > 0 && off < 1) { light(ctx, x + 28, y + 14, 26, '#c48ad0', 0.35 * Math.sin(off * Math.PI)); }
  }
  // the last one keeps a faint glow
  const kx = GX + (KEEP % N) * SP + 28, ky = GY + Math.floor(KEEP / N) * SP + 24;
  light(ctx, kx, ky, 40, '#c48ad0', 0.18 * ramp(t, 525.4, 525.9));
  // counter
  const pct = Math.round(99 * clamp((t - 522.65) / 3.05));
  stamp(ctx, t, 522.6, T1 + 0.4, `${pct >= 99 ? '~99' : pct}%`, 'of those chemicals phased out', { size: 130 });
  // a quiet tag on the recovering globe
  const a = ramp(t, 526.6, 527.3);
  if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.lav; ctx.font = '24px "Inter Medium"'; ctx.letterSpacing = '5px'; ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(4,4,16,0.8)'; ctx.shadowBlur = 16; ctx.fillText('OZONE LAYER RECOVERING', 1340, 82); ctx.restore(); }
}

module.exports = { T0, T1, draw };
