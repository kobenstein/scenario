// End card after the last question (no next-episode teaser, no channel name: Jakob 2026-10-18).
// A new dawn, a different one: over a dark plain a huge cyan ring rises like a sun. A small person stands and watches;
// the ring sends out a slow pulse and keeps turning and breathing to the last frame.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out, ease, stamp } = L;
const { gf, curve, glowE, mini } = require('./s_k11_poll');

const T0 = 721.55, T1 = 734.21;
const T_ASK = 725.64;
const RING = { x: 1240, R: 250 };
const HZ = 690;     // horizon
const STARS = (() => { const r = rng(722); return Array.from({ length: 140 }, () => [r() * W, r() * HZ, r()]); })();
const FIG = { back: true, x: 640, y: 780, s: 1.25, wd: 1.05, hem: 3, len: 8, hair: 0, bag: false, ph: 1.3, turn: 0, warm: ['#ffb35c', '#7a3412'], cool: ['#2a2558', '#100f2c'], base: [0] };

function glowStroke(ctx, path, col, w, a) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const [mw, ma] of [[5, 0.10], [2.4, 0.28], [1, 1]]) { ctx.strokeStyle = rgba(col, a * ma); ctx.lineWidth = w * mw; ctx.beginPath(); path(ctx); ctx.stroke(); }
  ctx.restore();
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.1, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 0.8, 101) * 6, dy = drift(t, 0.8, 102) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, HZ); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -HZ + dy * par); fn(); ctx.restore(); };
  const rise = ease(clamp((t - T0) / 3.6)), ry = lerp(HZ + 120, 430, rise);
  const ask = clamp((t - T_ASK) / 2.6), rot = t * 0.12, breath = 0.5 + 0.5 * Math.sin(t * 1.6);
  const glow = 0.4 + 0.6 * rise;
  layer(0.15, () => {
    ctx.fillStyle = lin(ctx, 0, -200, 0, HZ, [[0, '#05061a'], [0.55, '#0c1840'], [0.85, lerp(0, 1, rise) > 0.5 ? '#0f3a5a' : '#102a50'], [1, '#1a5a78']]); ctx.fillRect(-300, -300, W + 600, HZ + 320);
    for (const [x, y, k] of STARS) { const a = (0.15 + 0.35 * k * (0.5 + 0.5 * Math.sin(t * (0.6 + k) + k * 30))) * (1 - 0.6 * rise * clamp(1 - Math.hypot(x - RING.x, y - ry) / 900)); ctx.fillStyle = rgba(C.cream, a); ctx.fillRect(x, y, 2, 2); }
    // the cool dawn the ring makes along the horizon
    glowE(ctx, RING.x, HZ, 1300, 260, [[0, rgba(C.cyan, 0.10 + 0.25 * rise)], [0.5, rgba(C.cyanD, 0.10 + 0.14 * rise)], [1, 'rgba(10,111,140,0)']], true);
  });
  // the ring, rising: broad soft light, rays, a turning ring with ticks and an inner ring counter-rotating
  layer(0.25, () => {
    ctx.save(); ctx.beginPath(); ctx.rect(-400, -400, W + 800, HZ + 400 + 2); ctx.clip();
    light(ctx, RING.x, ry, 900, C.cyan, 0.16 * glow + 0.05 * breath);
    light(ctx, RING.x, ry, 420, C.cyanW, 0.10 * glow);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2 + rot * 0.3, r0 = RING.R * 1.25, r1 = RING.R * (1.9 + 0.5 * Math.sin(k * 1.7 + t * 0.4)); ctx.strokeStyle = rgba(C.cyan, 0.035 * glow); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(RING.x + Math.cos(a) * r0, ry + Math.sin(a) * r0); ctx.lineTo(RING.x + Math.cos(a) * r1, ry + Math.sin(a) * r1); ctx.stroke(); }
    ctx.restore();
    glowStroke(ctx, c => c.arc(RING.x, ry, RING.R, 0, Math.PI * 2), C.cyanW, 7 + 1.5 * breath, 0.8 * glow);
    glowStroke(ctx, c => { c.setLineDash([60, 18, 8, 18]); c.lineDashOffset = -t * 30; c.arc(RING.x, ry, RING.R * 1.12, rot, rot + Math.PI * 2); }, C.cyan, 2.5, 0.7 * glow);
    ctx.setLineDash([]);
    glowStroke(ctx, c => { c.setLineDash([4, 10]); c.lineDashOffset = t * 20; c.arc(RING.x, ry, RING.R * 0.86, -rot, -rot + Math.PI * 2); }, C.cyan, 1.5, 0.6 * glow);
    ctx.setLineDash([]);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.cyan, 0.5 * glow); ctx.lineWidth = 1.5;
    for (let i = 0; i < 72; i++) { const a = i / 72 * Math.PI * 2 + rot * 0.5, r0 = RING.R * 1.2, r1 = RING.R * (i % 6 ? 1.23 : 1.28); ctx.beginPath(); ctx.moveTo(RING.x + Math.cos(a) * r0, ry + Math.sin(a) * r0); ctx.lineTo(RING.x + Math.cos(a) * r1, ry + Math.sin(a) * r1); ctx.stroke(); }
    ctx.restore();
    // sparks circling the rim
    for (let i = 0; i < 8; i++) { const a = t * (0.5 + i * 0.05) + i * 0.79; light(ctx, RING.x + Math.cos(a) * RING.R, ry + Math.sin(a) * RING.R, 10, C.cyanW, 0.7 * glow * (0.5 + 0.5 * Math.sin(t * 5 + i))); }
    // "What would actually happen?": one slow pulse rolls out from the ring
    if (ask > 0 && ask < 1) glowStroke(ctx, c => c.arc(RING.x, ry, RING.R * (1.05 + 1.6 * out(ask)), 0, Math.PI * 2), C.cyanW, 2, 0.7 * (1 - ask));
    ctx.restore();
  });
  // the plain: dark, catching the cyan on its edge, with a shimmer path toward the ring
  layer(0.5, () => {
    gf(ctx, c => { curve(c, [[-300, HZ + 6], [300, HZ - 6], [800, HZ + 4], [1300, HZ - 8], [1800, HZ + 2], [2200, HZ - 4]]); c.lineTo(2200, 1400); c.lineTo(-300, 1400); c.closePath(); },
      lin(ctx, 0, HZ, 0, H, [[0, '#14244a'], [0.4, '#0c1430'], [1, '#05061a']]), 0.55);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.cyan, 0.3 * glow); ctx.lineWidth = 2; ctx.beginPath(); curve(ctx, [[-300, HZ + 6], [300, HZ - 6], [800, HZ + 4], [1300, HZ - 8], [1800, HZ + 2], [2200, HZ - 4]]); ctx.stroke(); ctx.restore();
    glowE(ctx, RING.x, HZ + 60, 520, 60, [[0, rgba(C.cyan, 0.10 * glow)], [1, rgba(C.cyan, 0)]], true);
    // low mist moving over the plain
    for (let k = 0; k < 5; k++) { const x = ((k * 520 + (t - T0) * (9 + k * 3)) % 2600) - 340; glowE(ctx, x, HZ + 30 + k * 26, 460, 26, [[0, rgba('#8ab8d8', 0.06)], [1, 'rgba(138,184,216,0)']]); }
  });
  // the watcher: small, warm, looking up at it; long cool shadow toward us
  layer(0.7, () => {
    ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#03040f'; ctx.beginPath(); ctx.moveTo(FIG.x - 10, FIG.y); ctx.lineTo(FIG.x + 10, FIG.y); ctx.lineTo(FIG.x - 60, FIG.y + 120); ctx.lineTo(FIG.x - 90, FIG.y + 120); ctx.closePath(); ctx.fill(); ctx.restore();
    FIG.turn = 0.3 + 0.2 * ramp(t, T_ASK - 0.3, T_ASK + 0.8);
    ctx.save(); ctx.translate(FIG.x, FIG.y); ctx.rotate(0); ctx.translate(-FIG.x, -FIG.y);
    mini(ctx, FIG, t, 0.85, null);
    ctx.restore();
    // cyan rim light from the ring on the figure's right edge
    light(ctx, FIG.x + 10, FIG.y - 70, 60, C.cyan, 0.12 * glow);
  });
}

module.exports = { T0, T1, draw };
