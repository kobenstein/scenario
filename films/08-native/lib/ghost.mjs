// The ghost engraving of Film 5 (shots.md §1 "Wertpapier-Sprache"): a dotted engraved line = it does not exist yet.
// On agreement a burin (engraving tip) runs along it and the line turns solid behind the tip; a mere promise drifts away as smoke.
//
//   ghostLine(ctx, pts, o) → { tip: [x, y, ang] | null, len }
//     pts = polyline [[x, y], …] in the current transform (resample() it for long curves).  o: {
//       ghost 1        1 = dotted ghost, 0 = solid engraved line; in between the dots stretch into dashes and close up
//       burin null     0..1: the engraving tip's position along the line: behind it solid, ahead of it ghost; draws the tip
//                      (steel point, a curling chip, foil dust). null = no burin
//       smoke 0        0..1: the ghost dots lift off and drift away like smoke (1 = gone); solid (engraved) parts never smoke
//       u 1            draw-on: only the first u of the line exists
//       col '#f3efe2', w 1.2 (line width px), a 1, dot 6 (dot pitch px), seed 1, t 0 (time: dust and smoke move),
//       glow null      colour of a soft glow under the solid part (e.g. '#ffb35c' for foil), tipSize 14, foil '#ffb35c' (dust colour),
//       op 'source-over' }
//   ghostPaths(ctx, lines, o)  many polylines (a rosette, a border) with one shared burin front: line k is engraved after line k-1
//                              (o.stagger 0..1, default .6; o.seq true = strictly one line after another, by length) and only o.tips
//                              (default 2) tips are drawn at once. Same options as ghostLine.
//   burinTip(ctx, x, y, ang, t, o)  the tip alone (o: { size 14, foil, a, seed }) — e.g. for C3's hand with the burin (1.02)
//   smokeDots(ctx, pts, smoke, o)   the smoke state alone for any dotted path
// rosette(), gBorder() and certificate() in certificate.mjs take the same ghost / burin / smoke options (all existing calls unchanged).
import { rgba, clamp, mix, prng } from '../engine.mjs';

const TAU = Math.PI * 2;
function cum(pts) { const d = new Float64Array(pts.length); for (let i = 1; i < pts.length; i++) d[i] = d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return d; }
// point and direction at arc length s
function at(pts, d, s) {
  if (s <= 0) return [pts[0][0], pts[0][1], Math.atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0])];
  let lo = 0, hi = d.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (d[m] < s) lo = m; else hi = m; }
  const q = (s - d[lo]) / ((d[hi] - d[lo]) || 1), a = pts[lo], b = pts[hi];
  return [mix(a[0], b[0], q), mix(a[1], b[1], q), Math.atan2(b[1] - a[1], b[0] - a[0])];
}
// the sub-polyline between arc lengths s0..s1
function sub(pts, d, s0, s1) {
  if (s1 <= s0) return [];
  const out = [at(pts, d, s0)]; for (let i = 0; i < pts.length; i++) if (d[i] > s0 && d[i] < s1) out.push(pts[i]); out.push(at(pts, d, s1)); return out;
}
const strokePoly = (ctx, P) => { if (P.length < 2) return; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.stroke(); };

export function ghostLine(ctx, pts, o = {}) {
  if (!pts || pts.length < 2) return { tip: null, len: 0 };
  const d = cum(pts), L = d[d.length - 1], Lu = L * clamp(o.u ?? 1); if (Lu <= 0) return { tip: null, len: L };
  const g = clamp(o.ghost ?? 1), col = o.col || '#f3efe2', w = o.w ?? 1.2, a = o.a ?? 1, P = o.dot ?? 6, smoke = clamp(o.smoke ?? 0);
  const Lb = o.burin == null ? 0 : clamp(o.burin) * Lu;
  ctx.save(); ctx.globalCompositeOperation = o.op || 'source-over'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // the engraved (solid) part
  const solid = o.burin == null ? (g < .02 ? Lu : 0) : Lb;
  if (solid > 0) {
    const S = sub(pts, d, 0, solid);
    if (o.glow) { ctx.strokeStyle = rgba(o.glow, .14 * a); ctx.lineWidth = w * 5; strokePoly(ctx, S); ctx.strokeStyle = rgba(o.glow, .3 * a); ctx.lineWidth = w * 2.2; strokePoly(ctx, S); }
    ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w; strokePoly(ctx, S);
  }
  // the ghost part: dots (or dashes closing up as ghost → 0), or smoke
  const g0 = o.burin == null ? g : Math.max(g, .001), s0 = solid;
  if (Lu - s0 > .5) {
    if (smoke > 0) smokeDots(ctx, sub(pts, d, s0, Lu), smoke, { ...o, phase: s0 });
    else {
      const on = mix(P, .01, g0), off = P - on;
      ctx.strokeStyle = rgba(col, a * mix(1, .85, g0)); ctx.lineWidth = w * mix(1, 1.3, g0);
      if (off > .05) { ctx.setLineDash([on, off]); ctx.lineDashOffset = -s0; }
      strokePoly(ctx, sub(pts, d, s0, Lu)); ctx.setLineDash([]);
    }
  }
  ctx.restore();
  let tip = null;
  if (o.burin != null && o.burin > 0 && o.burin < 1 && !o.noTip) { tip = at(pts, d, Lb); burinTip(ctx, tip[0], tip[1], tip[2], o.t ?? 0, { size: o.tipSize ?? 14, foil: o.foil, a, seed: o.seed }); }
  return { tip, len: L };
}

// dots lifting off the line and drifting away along a slow flow field, so they form wisps (deterministic per dot; o.t moves the
// plume, o.phase keeps dots fixed on the line, o.wind [x, y] the main drift direction)
export function smokeDots(ctx, pts, smoke, o = {}) {
  if (pts.length < 2) return; const d = cum(pts), L = d[d.length - 1], P = o.dot ?? 6, col = o.col || '#f3efe2', a = o.a ?? 1, w = o.w ?? 1.2, t = o.t ?? 0;
  const r = prng((o.seed ?? 1) * 131 + 7), first = Math.ceil((o.phase ?? 0) / P) * P - (o.phase ?? 0), wind = o.wind ?? [.35, -1], wa = Math.atan2(wind[1], wind[0]);
  ctx.save(); ctx.fillStyle = col;
  for (let s = first, k = 0; s <= L; s += P, k++) {
    const r1 = r(), r2 = r(); r(); const q = clamp(smoke * 1.8 - r1 * .8); if (q >= 1) continue;
    let [x, y] = at(pts, d, s);
    if (q > 0) {   // integrate a few steps through the field: the direction bends with a smooth noise of position and time
      const dist = q * q * (70 + 110 * r2), n = 4, st = dist / n;
      for (let i = 0; i < n; i++) { const f = Math.sin(x * .011 + t * .23) + Math.sin(y * .013 - t * .17 + x * .004) + Math.sin((x + y) * .007 + t * .11), an = wa + f * .55; x += Math.cos(an) * st; y += Math.sin(an) * st; }
    }
    const rad = w * .6 * (1 + q * 2.2); ctx.globalAlpha = a * Math.pow(1 - q, 1.4) * (q > 0 ? .85 : 1); ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// the burin: a steel point cutting the line, a curl of chip lifting behind it, foil dust and a small warm glint
export function burinTip(ctx, x, y, ang, t = 0, o = {}) {
  const S = o.size ?? 14, a = o.a ?? 1, foil = o.foil || '#ffb35c', r = prng((o.seed ?? 3) * 17 + 5);
  ctx.save(); ctx.globalAlpha = a;
  // glint at the contact point
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(x, y, 0, x, y, S * 2.6); gl.addColorStop(0, rgba('#fff1d6', .9)); gl.addColorStop(.25, rgba(foil, .45)); gl.addColorStop(1, rgba(foil, 0)); ctx.fillStyle = gl; ctx.fillRect(x - S * 2.6, y - S * 2.6, S * 5.2, S * 5.2); ctx.restore();
  // foil dust thrown off behind the tip
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 26; i++) { const life = (t * (.8 + r() * .9) + r()) % 1, sp = (r() - .5) * 1.6, dist = S * (.4 + life * (1.5 + r() * 2.5));
    const px = x - Math.cos(ang + sp) * dist, py = y - Math.sin(ang + sp) * dist - life * S * .8; ctx.fillStyle = rgba(r() < .6 ? foil : '#fff1d6', (1 - life) * (.35 + .5 * r())); const z = .8 + r() * 1.2; ctx.fillRect(px, py, z, z); }
  ctx.restore();
  // the chip: a thin metal curl rising from the cut behind the tip
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.strokeStyle = rgba('#ffe2a8', .85); ctx.lineWidth = Math.max(.7, S * .07); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-S * .2, 0); ctx.bezierCurveTo(-S * .9, -S * .1, -S * 1.2, -S * .8, -S * .75, -S * 1.05); ctx.bezierCurveTo(-S * .35, -S * 1.25, -S * .2, -S * .75, -S * .55, -S * .62); ctx.stroke();
  // the steel point (lozenge) leaning back over the line
  ctx.rotate(-.55); const st = ctx.createLinearGradient(0, -S * .3, 0, S * .3); st.addColorStop(0, '#dfe6f2'); st.addColorStop(.45, '#7d8798'); st.addColorStop(1, '#2a2f3a');
  ctx.fillStyle = st; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-S * 1.1, -S * .26); ctx.lineTo(-S * 3.2, -S * .3); ctx.lineTo(-S * 3.2, S * .3); ctx.lineTo(-S * 1.1, S * .26); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#ffffff', .7); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-S * .2, -S * .03); ctx.lineTo(-S * 3.1, -S * .2); ctx.stroke();
  ctx.restore();
  ctx.restore();
}

// many lines, one burin front: used for rosettes, borders, the certificate. lines = [[[x,y],…], …]; a line array may carry .a / .w multipliers
const LENS = new WeakMap();
function lensOf(lines) { let r = LENS.get(lines); if (!r) { r = lines.map((P) => { let s = 0; for (let i = 1; i < P.length; i++) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return s; }); LENS.set(lines, r); } return r; }
export function ghostPaths(ctx, lines, o = {}) {
  const n = lines.length, stg = o.stagger ?? .6, maxTips = o.tips ?? 2; let tips = 0;
  const lens = o.seq ? lensOf(lines) : null, tot = lens ? lens.reduce((a, b) => a + b, 0) : 0; let acc = 0;
  for (let k = 0; k < n; k++) {
    let b = o.burin;
    if (b != null && lens) { b = clamp((b * tot - acc) / (lens[k] || 1)); acc += lens[k]; }
    else if (b != null) { b = clamp(b * (1 + stg) - (k / Math.max(1, n - 1)) * stg); }
    const showTip = b != null && b > 0 && b < 1 && tips < maxTips; if (showTip) tips++;
    const L = lines[k]; ghostLine(ctx, L, { ...o, burin: b, seed: (o.seed ?? 1) + k * 7, noTip: !showTip, a: (o.a ?? 1) * (L.a ?? 1), w: (o.w ?? 1.2) * (L.w ?? 1) });
  }
}
