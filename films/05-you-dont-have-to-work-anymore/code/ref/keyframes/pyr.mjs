// Film 04 v2: the labelled Maslow pyramid (explainer graphic in channel style). Five levels, each carries small window
// cells that can light up; the camera can push into a cell to reveal a scene. Deterministic, everything a function of t.
import { W, H, C, rgba, glow, text, prng, mix, clamp, sm, speckle } from './lib.mjs';

export const LEVELS = ['Physiological · Safety', 'Belonging', 'Esteem', 'Self-actualization', 'Self-transcendence'];
const FR = [.25, .21, .19, .18, .17];   // level heights as fraction of total (bottom biggest)

// geometry: returns levels with trapezoid corners and cell rects
export function pyrGeo(cx, baseY, bw, ph, gap = 9) {
  const lv = []; let y = baseY;
  const xAt = (yy, s) => cx + s * (bw / 2) * ((yy - (baseY - ph)) / ph);
  for (let i = 0; i < 5; i++) {
    const h = ph * FR[i], y0 = y, y1 = y - h + (i < 4 ? gap : 0);
    const L = { i, y0, y1, xl0: xAt(y0, -1), xr0: xAt(y0, 1), xl1: xAt(y1, -1), xr1: xAt(y1, 1), cells: [] };
    // window cells: rows of small rounded rects inside the trapezoid (top level: a few, set low)
    const rows = i === 0 ? 2 : i === 4 ? 1 : 2, cw = Math.max(8, bw * .018), chh = cw * 1.35;
    for (let r = 0; r < rows; r++) {
      const yy = i === 4 ? y0 - (y0 - y1) * .3 : mix(y0, y1, (r + 1) / (rows + 1)) + chh / 2;
      const xl = xAt(yy - chh, -1) + cw * 1.2, xr = xAt(yy - chh, 1) - cw * 1.2, n = Math.max(1, Math.floor((xr - xl) / (cw * 2.9)));
      for (let k = 0; k < n; k++) { const x = mix(xl, xr, n === 1 ? .5 : k / (n - 1)) - cw / 2; L.cells.push({ x, y: yy - chh, w: cw, h: chh, seed: (i * 97 + r * 31 + k * 7) % 101 / 101 }); }
    }
    lv.push(L); y = y - h;
  }
  return { cx, baseY, bw, ph, lv, apexY: baseY - ph, xAt };
}

function trap(ctx, L) { ctx.beginPath(); ctx.moveTo(L.xl0, L.y0); ctx.lineTo(L.xr0, L.y0); ctx.lineTo(L.xr1, L.y1); ctx.lineTo(L.xl1, L.y1); ctx.closePath(); }

// lit[i] 0..1 per level; cellsLit[i] 0..1 fraction of cells lit; open = apex lift 0..1; labels: true/false; labelAlpha per level
export function drawPyramid(ctx, t, P, { lit = [0, 0, 0, 0, 0], cellsLit = null, open = 0, labels = true, labelX = null, title = false, titleA = 1, hiLevel = -1, cellFn = null } = {}) {
  cellsLit = cellsLit || lit;
  for (const L of P.lv) {
    const l = lit[L.i], isTop = L.i === 4;
    if (isTop && open > 0) continue; // drawn by apex()
    // body
    trap(ctx, L);
    const g = ctx.createLinearGradient(0, L.y0, 0, L.y1);
    g.addColorStop(0, mixc('#141742', '#b8601f', l)); g.addColorStop(1, mixc('#1b1f55', '#ffb35c', l * .85));
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = rgba(l > .2 ? C.amberHot : C.cream, l > .2 ? .55 : .22); ctx.lineWidth = 1.5; ctx.stroke();
    if (l > 0) { ctx.save(); trap(ctx, L); ctx.clip(); speckle(ctx, L.xl0, L.y1, L.xr0 - L.xl0, L.y0 - L.y1, Math.floor((L.xr0 - L.xl0) * (L.y0 - L.y1) / 60), C.amberHot, .35 * l, 3 + L.i); speckle(ctx, L.xl0, L.y1, L.xr0 - L.xl0, L.y0 - L.y1, Math.floor((L.xr0 - L.xl0) * (L.y0 - L.y1) / 90), '#3a1a08', .25 * l, 9 + L.i); ctx.restore(); }
    // cells
    for (const c of L.cells) {
      const on = cellFn ? cellFn(L.i, c) : (c.seed < cellsLit[L.i] ? 1 : 0);
      const tw = .85 + .15 * Math.sin(t * 1.7 + c.seed * 40);
      ctx.fillStyle = on ? rgba('#fff1d6', .95 * on * tw) : rgba('#070918', l > .2 ? .35 : .55);
      ctx.beginPath(); ctx.roundRect(c.x, c.y, c.w, c.h, 2); ctx.fill();
      if (!on) { ctx.strokeStyle = rgba(C.cream, .12); ctx.lineWidth = 1; ctx.stroke(); }
      else glow(ctx, c.x + c.w / 2, c.y + c.h / 2, c.w * 2.6, .35 * on, C.amber, C.amberHot);
    }
    if (l > 0) glow(ctx, P.cx, (L.y0 + L.y1) / 2, (L.xr0 - L.xl0) * .62, .22 * l, C.amber, C.amberHot, { sy: .35 });
  }
  if (labels) drawLabels(ctx, P, lit, { x: labelX, hiLevel });
  if (title) { const tx = labelX ?? P.cx + P.bw / 2 + 90; ctx.fillStyle = rgba(C.amber, titleA); ctx.fillRect(tx, P.apexY - 70, 28, 2); text(ctx, 'MASLOW’S HIERARCHY OF NEEDS', tx, P.apexY - 40, { size: 17, weight: 600, color: C.muted, spacing: 6, alpha: titleA }); }
}
export function drawLabels(ctx, P, lit, { x = null, hiLevel = -1, alpha = 1 } = {}) {
  const lx = x ?? P.cx + P.bw / 2 + 90;
  for (const L of P.lv) {
    const ym = (L.y0 + L.y1) / 2 + (L.i === 4 ? (L.y0 - L.y1) * .2 : 0), xr = mix(L.xr0, L.xr1, .5) + 14;
    const on = lit[L.i] > .2, a = alpha * (on ? 1 : .55);
    ctx.strokeStyle = rgba(on ? C.amber : C.muted, .5 * a); ctx.lineWidth = 1.2; ctx.setLineDash([2, 5]);
    ctx.beginPath(); ctx.moveTo(xr, ym); ctx.lineTo(lx - 16, ym); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = rgba(on ? C.amber : C.muted, a); ctx.beginPath(); ctx.arc(xr, ym, 3, 0, 7); ctx.fill();
    text(ctx, LEVELS[L.i], lx, ym + 12, { size: L.i === hiLevel ? 40 : 34, font: 'Instrument Serif', color: on ? C.cream : C.muted, alpha: a });
  }
}
// the top level lifted and coming apart into points that rise into the sky
export function apex(ctx, t, P, open, { seed = 5 } = {}) {
  const L = P.lv[4], lift = open * 150, cx = P.cx;
  const y0 = L.y0 - lift, ap = P.apexY - lift, hw = (L.xr0 - L.xl0) / 2;
  const g = ctx.createLinearGradient(0, ap, 0, y0); g.addColorStop(0, rgba(C.cream, .05)); g.addColorStop(1, rgba(C.amberHot, .55 * (1 - open * .4)));
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - hw, y0); ctx.lineTo(cx, ap); ctx.lineTo(cx + hw, y0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(C.amberHot, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - hw, y0); ctx.lineTo(cx + hw, y0); ctx.stroke();
  const r = prng(seed);
  for (let i = 0; i < 420; i++) {
    const u = r(), v = r(), up = Math.pow(r(), 1.8) * open;
    let x = cx + (u - .5) * 2 * hw * (1 - v), y = y0 - v * (y0 - ap);
    x += (r() - .5) * 260 * up; y -= up * 420;
    ctx.fillStyle = rgba(r() < .5 ? C.amberHot : C.cream, Math.max(0, .95 - up * .8)); const s = 1.6 + r() * 1.6; ctx.fillRect(x - s / 2, y - s / 2, s, s);
  }
  glow(ctx, cx, y0, hw * 2.2, .5, C.amber, C.cream, { sy: .4 });
  // the gap where the apex was: a soft column of light from the level-4 top up to the lifted piece
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cg = ctx.createLinearGradient(0, L.y0, 0, y0); cg.addColorStop(0, rgba(C.amberHot, .25)); cg.addColorStop(1, rgba(C.amberHot, .02));
  ctx.fillStyle = cg; ctx.fillRect(cx - hw, y0, hw * 2, L.y0 - y0); ctx.restore();
}
function mixc(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, clamp(u))); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
