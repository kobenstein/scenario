// c09 · 9.07 ★ "Which tells you exactly where to go": the amber curve runs off the card's edge into the night, keeps rising,
// arcs over the roofs and becomes the flank of the Maslow hill across the bay; the hill (a dark mass in the night) is outlined by
// the line, then fills terrace by terrace, its labels print in, and the camera lands on VIEW H2.
// The hill is drawn only by lib/maslow4.mjs drawHill(); this file only darkens its unbuilt terraces (the hill rises out of the dark)
// and draws the amber outline on top. Once everything is filled the frame is drawHill(VIEWS.H2) and nothing else.
import { W, H, rgba, clamp, mix, sm } from '../engine.mjs';
import { drawHill, VIEWS, HILL, toScreen } from './maslow4.mjs';
import { burinTip } from './ghost.mjs';
import { cs, toScr, NEAR } from './v2_c09_kit.mjs';
import { camFar, hillPt, FAR } from './v2_c09_court.mjs';

const LV = HILL.levels, CX = HILL.cx;
// the silhouette of level lv in hill units (terrace trapezoid + the retaining wall on its top edge; the peak with level 4)
function levelPoly(lv) {
  const L = LV[lv], p = [[CX - L.hw0, L.y0], [CX - L.hw1, L.y1 + 2], [CX - L.hw1 - 6, L.y1 + 2], [CX - L.hw1 - 6, L.y1 - 5]];
  if (lv === 4) { p.push([CX - 90, 214 - 5]); for (let i = 0; i <= 12; i++) { const q = i / 12, x = (1 - q) ** 2 * (CX - 90) + 2 * (1 - q) * q * (CX - 20) + q * q * CX, y = (1 - q) ** 2 * 214 + 2 * (1 - q) * q * 190 + q * q * HILL.summit.y; p.push([x, Math.min(y, 214 - 5)]); } }
  const half = p.slice(), right = half.slice().reverse().map(([x, y]) => [2 * CX - x, y]);
  return [...half, ...right];
}
const POLYS = LV.map((_, lv) => levelPoly(lv));
// the outline the line runs along: base-left → up the stepped flank → over the peak → down to base-right (hill units)
export const OUTLINE = (() => {
  const left = [];
  for (let lv = 0; lv < 5; lv++) { const L = LV[lv]; left.push([CX - L.hw0, L.y0], [CX - L.hw1, L.y1]); }
  for (let i = 1; i <= 16; i++) { const q = i / 16; left.push([(1 - q) ** 2 * (CX - 90) + 2 * (1 - q) * q * (CX - 20) + q * q * CX, (1 - q) ** 2 * 214 + 2 * (1 - q) * q * 190 + q * q * HILL.summit.y]); }
  const right = left.slice(0, -1).reverse().map(([x, y]) => [2 * CX - x, y]);
  return [...left, ...right];
})();
const pathHill = (ctx, cf, pts, dy = 0, mirror = false) => {
  ctx.beginPath(); pts.forEach(([x, y], i) => { const [sx, sy] = toScreen(cf, x, mirror ? 2 * HILL.horizon - y : y); i ? ctx.lineTo(sx, sy + dy) : ctx.moveTo(sx, sy + dy); }); ctx.closePath();
};

// st: the H2 state; B: { dark (0..1 how dark the unbuilt hill is), fill[5] (0..1 terrace fill fronts), label[5] (0..1 wipes),
//     outline: [a, b] (part of OUTLINE drawn, 0..1 by length), lineW, t }
export function farField(ctx, t, cam, B) {
  const cf = camFar(cam), st = VIEWS.H2.st, built = !B || (B.fill.every((f) => f >= 1) && B.label.every((u) => u >= 1) && !(B.outline && B.outline[1] > B.outline[0]));
  if (built) { drawHill(ctx, t, cf, st); return; }
  drawHill(ctx, t, cf, { ...st, labels: 0 });
  // the unbuilt terraces: the hill is there, a dark mass in the night; each terrace rises out of the dark from its foot up
  const dk = clamp(B.dark ?? 1);
  for (let lv = 0; lv < 5; lv++) {
    const f = clamp(B.fill[lv]); if (f >= 1 || dk <= 0) continue;
    const L = LV[lv], yTop = lv === 4 ? HILL.summit.y - 4 : L.y1 - 6, [, sy0] = toScreen(cf, 0, L.y0 + 1), [, sy1] = toScreen(cf, 0, yTop);
    const front = mix(sy0, sy1, f), soft = Math.max(2, (sy0 - sy1) * .35);
    for (const mir of [false, true]) {
      ctx.save(); pathHill(ctx, cf, POLYS[lv], 0, mir); ctx.clip();
      const a = .9 * dk * (mir ? .55 : 1);
      if (!mir) {
        const g = ctx.createLinearGradient(0, front + soft * .2, 0, front - soft); g.addColorStop(0, `rgba(6,7,20,0)`); g.addColorStop(1, `rgba(6,7,20,${a})`);
        ctx.fillStyle = g; ctx.fillRect(0, front - soft, W, soft * 1.2 + 1); ctx.fillStyle = `rgba(6,7,20,${a})`; ctx.fillRect(0, -10, W, front - soft + 10);
        // the fill front glows as it climbs (light filling the terrace)
        if (f > 0) { const g2 = ctx.createLinearGradient(0, front + soft * .5, 0, front - soft * .5); g2.addColorStop(0, 'rgba(255,179,92,0)'); g2.addColorStop(.5, `rgba(255,179,92,${.22 * dk})`); g2.addColorStop(1, 'rgba(255,179,92,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g2; ctx.fillRect(0, front - soft * .5, W, soft); ctx.globalCompositeOperation = 'source-over'; }
      } else {
        const [, m0] = toScreen(cf, 0, 2 * HILL.horizon - L.y0), mf = m0 + (front - sy0) * -1;   // mirrored front
        ctx.fillStyle = `rgba(6,7,20,${a})`; ctx.fillRect(0, mf, W, H - mf + 10);
      }
      ctx.restore();
    }
  }
  // the labels print in (the same drawHill, labels on, only inside the revealed bands)
  if (B.label.some((u) => u > 0)) {
    ctx.save(); ctx.beginPath(); let any = false;
    LV.forEach((L, lv) => {
      const u = clamp(B.label[lv]); if (u <= 0) return; any = true;
      const ym = (L.y0 + L.y1) / 2, [fx, fy] = toScreen(cf, CX + (L.hw0 + L.hw1) / 2 + 4, ym), x0 = fx + 4;
      ctx.rect(x0, fy - 46, (W - x0) * u, 70);
    });
    if (any) { ctx.clip(); drawHill(ctx, t, cf, st); }
    ctx.restore();
  }
  // the amber outline, on top of the still dark part only (a filled terrace swallows its piece of the line)
  if (B.outline && B.outline[1] > B.outline[0]) {
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, H);   // clip: everything except the filled part of each terrace
    let yClip = H;
    for (let lv = 0; lv < 5; lv++) { const L = LV[lv], f = clamp(B.fill[lv]); if (f <= 0) break; const yTop = lv === 4 ? HILL.summit.y - 4 : L.y1 - 6, [, sy0] = toScreen(cf, 0, L.y0 + 1), [, sy1] = toScreen(cf, 0, yTop); yClip = mix(sy0, sy1, f) - 2; if (f < 1) break; }
    ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(0, -10, W, yClip + 10); ctx.clip();
    const pts = sliceLen(OUTLINE.map(([x, y]) => toScreen(cf, x, y)), B.outline[0], B.outline[1]);
    amberStroke(ctx, pts, B.lineW ?? 4.5);
    ctx.restore();
  }
}
// the visible piece [a, b] of a polyline (fractions of its length)
export function sliceLen(pts, a, b) {
  const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = d[d.length - 1], s0 = clamp(a) * L, s1 = clamp(b) * L, out = [], at = (s) => { let i = 1; while (i < d.length - 1 && d[i] < s) i++; const q = (s - d[i - 1]) / ((d[i] - d[i - 1]) || 1); return [mix(pts[i - 1][0], pts[i][0], q), mix(pts[i - 1][1], pts[i][1], q)]; };
  if (s1 <= s0) return [];
  out.push(at(s0)); for (let i = 0; i < pts.length; i++) if (d[i] > s0 && d[i] < s1) out.push(pts[i]); out.push(at(s1));
  return out;
}
// the amber foil line: a warm glow under a bright core
export function amberStroke(ctx, pts, w) {
  if (pts.length < 2) return;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); };
  ctx.globalCompositeOperation = 'lighter';
  path(); ctx.strokeStyle = 'rgba(255,150,60,.14)'; ctx.lineWidth = w * 5; ctx.stroke();
  path(); ctx.strokeStyle = 'rgba(255,170,80,.28)'; ctx.lineWidth = w * 2.2; ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
  path(); ctx.strokeStyle = '#ffb35c'; ctx.lineWidth = w; ctx.stroke();
  path(); ctx.strokeStyle = 'rgba(255,241,214,.85)'; ctx.lineWidth = Math.max(.8, w * .35); ctx.stroke();
  ctx.restore();
}
// the near part of the line (3D, projected with the real camera, near-clipped): pts3 = [[X, Y, Z], …]
export function line3Screen(cam, pts3) {
  const out = [];
  for (const p of pts3) { const c = cs(cam, ...p); if (c[2] < NEAR * 4) { if (out.length) break; else continue; } out.push(toScr(cam, c)); }
  return out;
}
export { hillPt, FAR };
