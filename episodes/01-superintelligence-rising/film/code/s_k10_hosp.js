// "The hospital down the road runs software that AI went through, hole by hole, before anyone could break in."
// The hospital at sunrise. On "software" its facade turns into a wall of glowing code blocks; a small calm cyan
// ring glides over it, stops at each weak spot (a dark gap) and an amber patch seals it, one per beat of
// "hole by hole". On "break in" a few dim probes fly at the wall and bounce off the patches.
const L = require('./lib');
const { W, H, C, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, cone, out, clamp, ease } = L;
const K = require('./s_k10_kit');
const { gf, rr, camera, glowStroke, ring, dawnSky, figure } = K;

const T0 = 615.55, T1 = 622.75;
const BX0 = 520, BX1 = 1400, BY0 = 250, BY1 = 870;      // facade
const ROWH = 66, ROWS = 9;

// software blocks: rows of variable-width blocks across the facade
const R = rng(615);
const BLOCKS = [];
for (let r = 0; r < ROWS; r++) {
  let x = BX0 + 30 + R() * 30;
  while (x < BX1 - 60) { const w = Math.min(BX1 - 30 - x, 50 + R() * 120); if (w < 30) break; BLOCKS.push({ x, y: BY0 + 50 + r * ROWH, w, h: 40, r, tone: R() }); x += w + 12; }
}
// holes, in the order the scanner visits them, with the time each is sealed
const HOLE_T = [618.2, 618.65, 619.1, 619.42, 619.72, 619.96, 620.35];
const HOLES = (() => {
  const want = [[0.18, 1], [0.72, 2], [0.42, 4], [0.86, 4], [0.12, 6], [0.58, 7], [0.80, 8]];
  return want.map(([fx, row], i) => {
    const tx = BX0 + fx * (BX1 - BX0); let best = null, bd = 1e9;
    for (const b of BLOCKS) if (b.r === row) { const d = Math.abs(b.x + b.w / 2 - tx); if (d < bd) { bd = d; best = b; } }
    best.hole = i; return best;
  });
})();
const PROBES = [[0, 621.1], [3, 621.3], [5, 621.42], [1, 621.6]].map(([h, ht], i) => ({ h: HOLES[h], ht, y0: 200 + i * 220, x0: 2100 + i * 60 }));

function scanPos(t) {
  const pts = HOLES.map(b => [b.x + b.w / 2, b.y - 46]);
  const start = [BX0 - 260, BY0 - 160];
  if (t < HOLE_T[0] - 0.35) { const k = ease((t - 617.6) / (HOLE_T[0] - 0.35 - 617.6)); return [lerp(start[0], pts[0][0], k), lerp(start[1], pts[0][1], k) - Math.sin(k * Math.PI) * 60]; }
  for (let i = 0; i < pts.length - 1; i++) {
    const a = HOLE_T[i] + 0.04, b = HOLE_T[i + 1] - 0.16;
    if (t < a) return pts[i];
    if (t < b) { const k = ease((t - a) / (b - a)); return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k) - Math.sin(k * Math.PI) * 40]; }
  }
  const last = pts[pts.length - 1], k = ease((t - HOLE_T[6] - 0.3) / 1.2);
  return [lerp(last[0], 1720, k), lerp(last[1], 330, k) - Math.sin(k * Math.PI) * 60];
}

function building(ctx, t) {
  // side wing and main block, lit from the low sun on the left
  gf(ctx, c => c.rect(BX1 - 20, BY0 + 150, 300, BY1 - BY0 - 150), lin(ctx, BX1, 0, BX1 + 300, 0, [[0, '#6e5486'], [1, '#3e3266']]), 0.45);
  for (let r = 0; r < 5; r++) for (let k = 0; k < 5; k++) { ctx.fillStyle = (r + k) % 4 === 0 ? rgba('#ffd59a', 0.7) : 'rgba(40,30,80,0.5)'; ctx.fillRect(BX1 + 20 + k * 52, BY0 + 190 + r * 80, 30, 36); }
  gf(ctx, c => c.rect(BX0, BY0, BX1 - BX0, BY1 - BY0), lin(ctx, BX0, BY0, BX1, BY1, [[0, '#f4cdb4'], [0.35, '#c79aa8'], [1, '#6a5486']]), 0.4);
  ctx.fillStyle = 'rgba(255,230,200,0.5)'; ctx.fillRect(BX0, BY0, BX1 - BX0, 6);
  ctx.fillStyle = '#5a4478'; ctx.fillRect(BX0 - 10, BY0 - 18, BX1 - BX0 + 20, 18);
  // floor bands and windows
  for (let r = 0; r < ROWS; r++) {
    const y = BY0 + 50 + r * ROWH;
    ctx.fillStyle = 'rgba(90,60,110,0.18)'; ctx.fillRect(BX0, y + 48, BX1 - BX0, 6);
    if (r === ROWS - 1) continue;
    for (let k = 0; k < 11; k++) { const x = BX0 + 30 + k * 78, lit = ((r * 11 + k) * 7) % 5 === 0;
      ctx.fillStyle = lit ? lin(ctx, 0, y, 0, y + 40, [[0, '#ffe2b0'], [1, '#e8a060']]) : lin(ctx, 0, y, 0, y + 40, [[0, '#8a6a9a'], [1, '#4a3a70']]); ctx.fillRect(x, y, 54, 38);
      if (!lit) { ctx.fillStyle = 'rgba(255,200,170,0.22)'; ctx.fillRect(x + 4, y + 4, 12, 30); } }
  }
  // entrance canopy with warm light inside
  const ex = 900;
  gf(ctx, c => c.rect(ex - 110, BY1 - 110, 220, 110), lin(ctx, 0, BY1 - 110, 0, BY1, [[0, '#ffe2b0'], [1, '#e8a060']]), 0.25);
  ctx.fillStyle = 'rgba(122,59,23,0.5)'; ctx.fillRect(ex - 2, BY1 - 110, 4, 110);
  gf(ctx, c => { c.moveTo(ex - 170, BY1 - 130); c.lineTo(ex + 170, BY1 - 130); c.lineTo(ex + 150, BY1 - 108); c.lineTo(ex - 150, BY1 - 108); c.closePath(); }, '#4a3a70', 0.4);
  light(ctx, ex, BY1 - 60, 200, C.amber, 0.25);
  // rooftop sign
  ctx.fillStyle = '#3a2e5e'; ctx.fillRect(1250, BY0 - 70, 6, 52); ctx.fillRect(1330, BY0 - 70, 6, 52);
  gf(ctx, c => rr(c, 1236, BY0 - 160, 114, 100, 8), lin(ctx, 0, BY0 - 160, 0, BY0 - 60, [[0, '#ffffff'], [1, '#e6dccc']]), 0.2);
  ctx.fillStyle = '#2e6f8c'; ctx.font = '78px "Inter SemiBold"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('H', 1293, BY0 - 108);
  light(ctx, 1293, BY0 - 110, 140, '#fff0d0', 0.18);
}

function street(ctx, t) {
  gf(ctx, c => c.rect(-200, BY1 - 4, W + 400, 70), lin(ctx, 0, BY1, 0, BY1 + 70, [[0, '#8a6a8e'], [1, '#5a4a76']]), 0.45);
  gf(ctx, c => c.rect(-200, BY1 + 64, W + 400, 400), lin(ctx, 0, BY1 + 64, 0, H + 100, [[0, '#4a3a68'], [1, '#221c40']]), 0.5);
  ctx.strokeStyle = 'rgba(255,200,140,0.3)'; ctx.lineWidth = 5; ctx.setLineDash([60, 46]); ctx.beginPath(); ctx.moveTo(-200, 1010); ctx.lineTo(W + 200, 1010); ctx.stroke(); ctx.setLineDash([]);
  // trees in front of the building
  for (const [x, s] of [[430, 1.2], [610, 0.9], [1220, 1.0], [1500, 1.25], [1760, 1.05]]) {
    ctx.save(); ctx.translate(x, BY1 + 40); ctx.scale(s, s); ctx.rotate(drift(t, 1.2, x) * 0.01);
    ctx.fillStyle = '#2e2248'; ctx.fillRect(-4, -70, 8, 74);
    const crown = c => { c.arc(0, -120, 62, 0, 7); c.moveTo(70, -92); c.arc(30, -92, 40, 0, 7); c.moveTo(-10, -92); c.arc(-36, -92, 38, 0, 7); };
    gf(ctx, crown, lin(ctx, -60, -180, 60, -60, [[0, '#8a5a7a'], [0.4, '#4a3a6a'], [1, '#2a2248']]), 0.45);
    ctx.restore();
  }
}

function software(ctx, t, m) {
  if (m <= 0) return;
  ctx.save(); ctx.globalAlpha = m;
  // the facade becomes a deep panel of code blocks
  gf(ctx, c => c.rect(BX0, BY0, BX1 - BX0, BY1 - BY0), lin(ctx, 0, BY0, 0, BY1, [[0, '#0d2a48'], [0.6, '#0a1f3c'], [1, '#08162e']]), 0.4);
  for (const b of BLOCKS) {
    const appear = ramp(t, 617.35 + (b.r * 0.06) + b.tone * 0.25, 617.75 + b.r * 0.06 + b.tone * 0.25);
    if (appear <= 0) continue;
    if (b.hole !== undefined) {
      const i = b.hole, seal = ramp(t, HOLE_T[i], HOLE_T[i] + 0.18), found = ramp(t, HOLE_T[i] - 0.35, HOLE_T[i] - 0.15);
      // the gap: a dark void with a ragged edge, cold air leaking through
      ctx.fillStyle = rgba('#03050f', appear); ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.fill();
      ctx.strokeStyle = rgba('#5a7aa8', 0.6 * appear * (1 - seal)); ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.strokeRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2); ctx.setLineDash([]);
      if (found > 0 && seal < 1) { const bl = 0.5 + 0.5 * Math.sin(t * 22); ctx.strokeStyle = rgba(C.cyanW, found * (0.6 + 0.4 * bl) * (1 - seal)); ctx.lineWidth = 3; ctx.strokeRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8); }
      if (seal > 0) {
        const s = out(seal), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
        gf(ctx, c => rr(c, cx - b.w / 2 * s, cy - b.h / 2 * s, b.w * s, b.h * s, 6), lin(ctx, 0, b.y, 0, b.y + b.h, [[0, '#ffd28c'], [1, '#d27a34']]), 0.3);
        const fl = Math.exp(-Math.max(0, t - HOLE_T[i]) * 4);
        light(ctx, cx, cy, 70 + 60 * fl, C.amber, 0.25 + 0.5 * fl);
        // stitches on the patch
        if (seal >= 1) { ctx.strokeStyle = 'rgba(122,59,23,0.55)'; ctx.lineWidth = 2; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(b.x + b.w * k / 4, b.y + 6); ctx.lineTo(b.x + b.w * k / 4, b.y + b.h - 6); ctx.stroke(); } }
      }
      continue;
    }
    const pulse = 0.85 + 0.15 * Math.sin(t * 2 + b.x * 0.01 + b.r);
    ctx.fillStyle = rgba(b.tone < 0.6 ? '#2d7ea3' : b.tone < 0.85 ? '#4aa6c8' : '#a49fc4', appear * 0.75 * pulse);
    ctx.beginPath(); rr(ctx, b.x, b.y, b.w, b.h, 5); ctx.fill();
    ctx.fillStyle = rgba(C.cyanW, 0.35 * appear); ctx.fillRect(b.x + 8, b.y + 10, b.w * (0.3 + b.tone * 0.5), 5); ctx.fillRect(b.x + 8, b.y + 22, b.w * (0.2 + (1 - b.tone) * 0.4), 5);
  }
  ctx.restore();
}

function draw(ctx, t) {
  const push = ease((t - 616.9) / 1.5);
  const layer = camera(ctx, t, T0, T1, { k: () => push * 0.85 + 0.15 * sm((t - T0) / (T1 - T0)), z0: 1.0, z1: 1.36, cx: 960, cy: 600, seed: 9 });
  const m = ramp(t, 617.2, 617.8);
  layer(0.2, () => dawnSky(ctx, t, -200, 900, 150, 760, { glow: 0.4, sunR: 1100 }));
  layer(0.6, () => { building(ctx, t); street(ctx, t); });
  layer(0.6, () => {
    software(ctx, t, m);
    // the scanner ring and its beam
    const sa = ramp(t, 617.6, 618.0) * (1 - ramp(t, 621.9, 622.6));
    if (sa > 0) {
      const [x, y] = scanPos(t);
      let near = null; for (let i = 0; i < 7; i++) if (Math.abs(t - (HOLE_T[i] - 0.15)) < 0.3) near = HOLES[i];
      if (near) { const k = 1 - Math.abs(t - (HOLE_T[HOLES.indexOf(near)] - 0.15)) / 0.3; cone(ctx, x, y + 14, 20, near.w + 30, 40, C.cyan, 0.35 * k * sa); }
      ring(ctx, t, x, y, 50, 17, 0, sa * 1.3, 0.8);
      light(ctx, x, y, 24, C.cyanW, 0.5 * sa);
    }
    // probes: dim darts that fly in and glance off the patches
    for (const p of PROBES) {
      const k = (t - (p.ht - 0.55)) / 0.55; if (k < 0) continue;
      const tx = p.h.x + p.h.w / 2, ty = p.h.y + p.h.h / 2;
      let x, y, a;
      if (k < 1) { const e = k * k; x = lerp(p.x0, tx + 18, e); y = lerp(p.y0, ty, e); a = 0.8; }
      else { const b = (t - p.ht) / 0.6; if (b > 1) continue; x = tx + 18 + b * 140; y = ty - b * 120 + b * b * 160; a = 0.8 * (1 - b); }
      const ang = k < 1 ? Math.atan2(ty - p.y0, tx - p.x0) : -0.6;
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = a;
      ctx.fillStyle = lin(ctx, -160, 0, 0, 0, [[0, 'rgba(150,130,200,0)'], [1, 'rgba(170,150,220,0.75)']]); ctx.fillRect(-160, -3, 160, 6);
      ctx.fillStyle = '#b4a4e0'; ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(-14, -11); ctx.lineTo(-7, 0); ctx.lineTo(-14, 11); ctx.closePath(); ctx.fill();
      ctx.restore();
      if (k >= 1) { const b = (t - p.ht); light(ctx, tx + 10, ty, 110, '#ffe2b0', 0.9 * Math.exp(-b * 5));
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffe2b0', 0.8 * Math.exp(-b * 5)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(tx + 10, ty, 20 + b * 120, 0, 7); ctx.stroke(); ctx.restore(); }
    }
  });
  // two people walking into the entrance
  layer(0.7, () => {
    for (const [k, x0, s] of [[0, 680, 0.42], [1, 1180, 0.38]]) {
      const dir = k ? -1 : 1, x = x0 + dir * (t - T0) * 26, ph = (t - T0) * 2 * Math.PI * 0.9 + k, sw = Math.sin(ph);
      if (Math.abs(x - 900) < 60) continue;
      const leg = sg => ({ a1: Math.PI / 2 + sg * sw * 0.32, a2: Math.PI / 2 + sg * sw * 0.32 + Math.max(0, -sg * sw) * 0.5 });
      figure(ctx, { x, y: BY1 + 48 - 150 * s, s, facing: 'back', br: Math.sin(t * 1.8 + k), turn: dir * 0.6, lx: -1, grain: 0.3, pal: k ? ['#8fd0dc', '#4a8a9c', '#1e4a5a'] : ['#ffb35c', '#c9702e', '#5a2a12'],
        legs: [leg(1), leg(-1)], arms: [{ a1: Math.PI / 2 + 0.15 - sw * 0.25, a2: Math.PI / 2 + 0.05 - sw * 0.2 }, { a1: Math.PI / 2 - 0.15 + sw * 0.25, a2: Math.PI / 2 - 0.05 + sw * 0.2 }] });
    }
  });
  // after the probes: the whole wall glows warm and safe
  const safe = ramp(t, 621.7, 622.4);
  if (safe > 0) layer(0.6, () => light(ctx, (BX0 + BX1) / 2, (BY0 + BY1) / 2, 700, C.amber, 0.12 * safe));
}

module.exports = { T0, T1, draw };
