// Film 10 kit, explainer layer (MOTION.md §13 "Explainer-Ebene"): printed cards and plates in the same paper-and-ink world as the
// valley. Every graphic grows OUT of an object that is already on screen and folds back INTO one; nothing fades in, nothing is
// half-transparent. Screen space (px, 1920×1080), pure functions of t, no state.
//   EXP, wcag()                       palette for print on paper, sizes, contrast check (≥ 7:1 for numbers, ≥ 4.5:1 for labels)
//   card(ctx, t, o) → box             a paper card that travels out of an object's screen rect and unfolds on a hinge; box.inside(fn)
//   counter(ctx, t, o)                odometer number (Instrument Serif), digits roll, separators stay
//   bars(ctx, t, o)                   bars grow from one rule, value at the tip; ghost:true = forecast (hatched outline)
//   tally(ctx, t, o)                  n strokes in a row/grid, `lit` of them fill in order (59 of 100, 9 of 10 …)
//   curve(ctx, t, o)                  a line chart whose line IS the trace: it morphs from any screen polyline (the Spur) into the data
//   pie(ctx, t, o)                    share circle; flat 0 = the cup's rim seen at an angle (ellipse), 1 = a flat circle seen from above
//   section(ctx, t, o)                cross-section: 'rings' (a joint motor: shell, coils, magnet ring, shaft) or 'layers' (ground)
//   arrow / flow(ctx, t, o)           flow arrows drawn by the trace between paper chips (human shows → data → model → robot)
//   mapSheet(ctx, t, V, o)            the valley from straight above becomes a printed map: ink roads, river, pins, margin, scale bar
//   tag(ctx, t, o)                    label with leader line: dot on the object, line, paper chip with Inter caps + optional number
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, prng, text, PAL, expoOut, expoIn, qio, sineS, mixHex, hex2rgb, trace } from './f10_core.mjs';
import { VAL } from './f10_valley.mjs';

// ---------------------------------------------------------------- print palette (dark enough to read on paper at phone size)
export const EXP = {
  paper: '#f4ecda', paperShade: '#ddd0b4', paperEdge: '#c9b998', ink: PAL.ink, inkSoft: '#544a42', rule: '#7d7062',
  warm: '#d27a2c', warmLight: '#f2b56a', cold: '#56789a', coldLight: '#a9bdd2', magnet: '#5f5578', green: '#5b8541', soil: '#8a5a3c',
  shadow: 'rgba(43,38,34,.20)',
  // minimum sizes at 1080p (phone check: a 390 px wide screenshot must still show labels ≥ 9 px high)
  size: { hero: 168, num: 112, mid: 72, label: 30, small: 24, src: 22 },
};
const lum = (h) => { const c = hex2rgb(h).map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
export function wcag(a, b) { const A = lum(a), B = lum(b); return (Math.max(A, B) + .05) / (Math.min(A, B) + .05); }

// paper fibre + a faint deckle, cached as an Image (the napi canvas leaks on drawImage(Canvas))
let FIBRE = null;
export async function prepareExpl() {
  if (FIBRE) return;
  const c = createCanvas(512, 512), x = c.getContext('2d'), r = prng(4242);
  for (let i = 0; i < 2600; i++) {
    const px = r() * 512, py = r() * 512, l = 2 + r() * 9, a = r() * Math.PI;
    x.strokeStyle = r() < .5 ? 'rgba(120,98,70,.10)' : 'rgba(255,255,255,.16)'; x.lineWidth = .6 + r() * .6;
    x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
  }
  FIBRE = await loadImage(c.toBuffer('image/png'));
}
function paperFill(ctx, x, y, w, h, col = EXP.paper) {
  ctx.fillStyle = col; ctx.fillRect(x, y, w, h);
  if (FIBRE) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); for (let yy = y - (y % 512); yy < y + h; yy += 512) for (let xx = x - (x % 512); xx < x + w; xx += 512) ctx.drawImage(FIBRE, xx, yy); ctx.restore(); }
}
const fontN = (s) => `400 ${s}px "Instrument Serif"`, fontL = (s, w = 600) => `${w} ${s}px "Inter"`;
// a word wipes up from its baseline (mask, never a fade). k 0..1
function wipeText(ctx, s, x, y, k, o) {
  if (k <= 0) return;
  const size = o.size || 30; ctx.save(); ctx.beginPath(); ctx.rect(x - 4 - (o.align === 'right' ? 2000 : o.align === 'center' ? 1000 : 0), y - size * 1.05, 4000, size * 1.35); ctx.clip();
  text(ctx, s, x, y + size * 1.1 * (1 - expoOut(k)), o); ctx.restore();
}

// ---------------------------------------------------------------- card: out of an object, unfold on a hinge, fold back
// o { rect:[x,y,w,h] target, from:[x,y,w,h] the object's screen rect (where the card comes from and returns to),
//     t0 open start, t1 close start (optional), dur (default .9), hinge 'top'|'bottom'|'left'|'right', accent hex (5 px edge), col }
// Phase 1 (45 %): a folded strip leaves the object on an arc (expoOut). Phase 2: it unfolds about the hinge; the turning panel is
// shaded until it lies flat. Content is drawn with box.inside(fn) and is masked by the visible paper, so it rides with the card.
export function card(ctx, t, o) {
  const [tx, ty, tw, th] = o.rect, from = o.from || [tx + tw / 2 - 20, ty + th / 2 - 4, 40, 8], dur = o.dur ?? .9, hinge = o.hinge || 'top';
  const kin = lin(o.t0, o.t0 + dur, t), kout = o.t1 != null ? lin(o.t1, o.t1 + dur * .8, t) : 0, k = kin * (1 - kout);
  if (k <= 0) return null;
  const a = expoOut(lin(0, .45, k)), b = kout > 0 ? qio(lin(.45, 1, k)) : expoOut(lin(.45, 1, k));
  const vert = hinge === 'top' || hinge === 'bottom', strip = vert ? Math.min(14, th) : Math.min(14, tw);
  // travelling folded strip: centre on an arc from the object to the hinge line
  const hx = hinge === 'left' ? tx : hinge === 'right' ? tx + tw : tx + tw / 2, hy = hinge === 'top' ? ty : hinge === 'bottom' ? ty + th : ty + th / 2;
  const fx = from[0] + from[2] / 2, fy = from[1] + from[3] / 2, lift = -Math.min(160, Math.hypot(hx - fx, hy - fy) * .25);
  const cx = mix(fx, hx, a), cy = mix(fy, hy, a) + lift * Math.sin(Math.PI * a);
  const sw = vert ? mix(from[2], tw, a) : strip, sh = vert ? strip : mix(from[3], th, a);
  let x, y, w, h;
  if (vert) { w = sw; h = mix(strip, th, b); x = cx - w / 2; y = hinge === 'top' ? cy : cy - h; }
  else { h = sh; w = mix(strip, tw, b); y = cy - h / 2; x = hinge === 'left' ? cx : cx - w; }
  ctx.save();
  ctx.fillStyle = EXP.shadow; ctx.fillRect(x + 7, y + 10, w, h);
  paperFill(ctx, x, y, w, h, o.col || EXP.paper);
  // the turning panel: the last fold before flat, shaded (light comes from the top left)
  if (b < 1) {
    const sh2 = (1 - b) * .35;
    ctx.fillStyle = rgba(EXP.paperShade, clamp(sh2 * 2.4));
    if (vert) { const fh = h * .5 * (1 - b) + 4; ctx.fillRect(x, hinge === 'top' ? y + h - fh : y, w, fh); }
    else { const fw = w * .5 * (1 - b) + 4; ctx.fillRect(hinge === 'left' ? x + w - fw : x, y, fw, h); }
  }
  ctx.strokeStyle = EXP.paperEdge; ctx.lineWidth = 1.5; ctx.strokeRect(x + .75, y + .75, w - 1.5, h - 1.5);
  if (o.accent) { ctx.fillStyle = o.accent; if (vert) ctx.fillRect(x, y, 6, h); else ctx.fillRect(x, y, w, 6); }
  ctx.restore();
  const box = { x: tx, y: ty, w: tw, h: th, open: b, vis: [x, y, w, h],
    inside(fn) { if (b <= .02) return; ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); fn(box); ctx.restore(); } };
  return box;
}

// ---------------------------------------------------------------- counter (odometer)
// o { x, y, v0, v1, t0, dur (1.1), size, col, align, prefix, suffix, sep ',' , label (Inter caps under it), src }
export function counter(ctx, t, o) {
  const size = o.size || EXP.size.num, col = o.col || EXP.ink, dur = o.dur ?? 1.1;
  const v = mix(o.v0 ?? 0, o.v1, expoOut(lin(o.t0, o.t0 + dur, t)));
  const n = Math.max(String(Math.round(Math.abs(o.v1))).length, String(Math.round(Math.abs(o.v0 ?? 0))).length);
  ctx.save(); ctx.font = fontN(size);
  const dw = ctx.measureText('0').width, sepw = ctx.measureText(o.sep ?? ',').width, pre = o.prefix || '', suf = o.suffix || '';
  const groups = Math.floor((n - 1) / 3), total = ctx.measureText(pre).width + n * dw + groups * sepw + ctx.measureText(suf).width;
  let x = o.align === 'center' ? o.x - total / 2 : o.align === 'right' ? o.x - total : o.x;
  const y = o.y, lh = size * 1.0;
  text(ctx, pre, x, y, { size, font: 'Instrument Serif', color: col }); x += ctx.measureText(pre).width;
  const vv = Math.max(0, v);
  for (let i = n - 1; i >= 0; i--) {
    const p = Math.pow(10, i), q = vv / p, d = Math.floor(q) % 10;
    const roll = i === 0 ? q - Math.floor(q) : clamp(((vv % p) / p) * 10 - 9);
    const lead = Math.floor(q) === 0 && i > 0 && Math.floor(vv / (p * 10)) === 0 && roll <= 0;
    if (!lead || i === 0) {
      ctx.save(); ctx.beginPath(); ctx.rect(x - 2, y - lh * .82, dw + 4, lh * 1.04); ctx.clip();
      text(ctx, String(d), x, y - lh * roll, { size, font: 'Instrument Serif', color: col });
      if (roll > 0) text(ctx, String((d + 1) % 10), x, y + lh * (1 - roll), { size, font: 'Instrument Serif', color: col });
      ctx.restore();
    }
    x += dw;
    if (i > 0 && i % 3 === 0) { if (!lead) text(ctx, o.sep ?? ',', x, y, { size, font: 'Instrument Serif', color: col }); x += sepw; }
  }
  text(ctx, suf, x, y, { size, font: 'Instrument Serif', color: col });
  ctx.restore();
  const lk = lin(o.t0 + .25, o.t0 + .75, t), lx = o.align === 'center' ? o.x : o.align === 'right' ? o.x : o.x;
  if (o.label) wipeText(ctx, o.label.toUpperCase(), lx, y + EXP.size.label * 1.5, lk, { size: EXP.size.label, weight: 600, color: EXP.ink, spacing: 3, align: o.align });
  if (o.src) wipeText(ctx, o.src.toUpperCase(), lx, y + EXP.size.label * 1.5 + EXP.size.src * 1.7, lin(o.t0 + .5, o.t0 + 1, t), { size: EXP.size.src, weight: 500, color: EXP.inkSoft, spacing: 2.5, align: o.align });
  return v;
}

// ---------------------------------------------------------------- bars
// o { x, y (baseline left), w, h (max length), items:[{label, v, col, ghost, valueText}], max, t0, stag (.12), dir 'v'|'h', gap }
export function bars(ctx, t, o) {
  const n = o.items.length, dir = o.dir || 'v', max = o.max || Math.max(...o.items.map((i) => i.v)), stag = o.stag ?? .12;
  const ru = expoOut(lin(o.t0 - .3, o.t0 + .3, t));
  ctx.save(); ctx.strokeStyle = EXP.ink; ctx.lineWidth = 3; ctx.beginPath();
  if (dir === 'v') { ctx.moveTo(o.x, o.y); ctx.lineTo(o.x + o.w * ru, o.y); } else { ctx.moveTo(o.x, o.y); ctx.lineTo(o.x, o.y + o.h * ru); }
  ctx.stroke();
  const slot = (dir === 'v' ? o.w : o.h) / n, bw = slot * (o.thick ?? .56);
  o.items.forEach((it, i) => {
    const k = expoOut(lin(o.t0 + i * stag, o.t0 + i * stag + .8, t)), len = (dir === 'v' ? o.h : o.w) * (it.v / max) * k;
    const c = it.col || EXP.ink;
    let bx, by, bwid, bhgt;
    if (dir === 'v') { bx = o.x + slot * i + (slot - bw) / 2; by = o.y - len; bwid = bw; bhgt = len; } else { bx = o.x; by = o.y + slot * i + (slot - bw) / 2; bwid = len; bhgt = bw; }
    if (len > .5) {
      if (it.ghost) { ctx.save(); ctx.setLineDash([7, 6]); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.strokeRect(bx + 1.5, by + 1.5, bwid - 3, bhgt - 3); ctx.restore(); hatch(ctx, bx, by, bwid, bhgt, c, 14, .5); }
      else { ctx.fillStyle = c; ctx.fillRect(bx, by, bwid, bhgt); hatch(ctx, bx, by, bwid, bhgt, 'rgba(255,255,255,.18)', 9, 1); }
    }
    const vk = lin(o.t0 + i * stag + .45, o.t0 + i * stag + .95, t), vs = it.valueText ?? String(it.v);
    if (dir === 'v') { wipeText(ctx, vs, bx + bw / 2, by - 16, vk, { size: o.valueSize || EXP.size.mid, font: 'Instrument Serif', color: EXP.ink, align: 'center' }); wipeText(ctx, (it.label || '').toUpperCase(), bx + bw / 2, o.y + 44, vk, { size: EXP.size.small, weight: 600, color: EXP.ink, align: 'center', spacing: 2 }); }
    else { wipeText(ctx, vs, bx + bwid + 18, by + bw * .72, vk, { size: o.valueSize || EXP.size.mid, font: 'Instrument Serif', color: EXP.ink }); wipeText(ctx, (it.label || '').toUpperCase(), o.x - 18, by + bw * .62, vk, { size: EXP.size.small, weight: 600, color: EXP.ink, align: 'right', spacing: 2 }); }
  });
  ctx.restore();
}
function hatch(ctx, x, y, w, h, col, gap = 10, lw = 1) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
  for (let s = -h; s < w + h; s += gap) { ctx.moveTo(x + s, y + h); ctx.lineTo(x + s + h, y); }
  ctx.stroke(); ctx.restore();
}

// ---------------------------------------------------------------- tally: n strokes, `lit` fill in order
// o { x, y, w, h, n (100), cols (n = one row), lit, t0, dur (1.4), col (lit), off (unlit), shape 'stroke'|'robot' }
export function tally(ctx, t, o) {
  const n = o.n || 100, cols = o.cols || n, rows = Math.ceil(n / cols), cw = o.w / cols, rh = o.h / rows, dur = o.dur ?? 1.4;
  const appear = expoOut(lin(o.t0 - .5, o.t0, t)), fill = lin(o.t0, o.t0 + dur, t) * (o.lit ?? 0);
  ctx.save();
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols), x = o.x + c * cw + cw / 2, y = o.y + r * rh, k = clamp(appear * n - i * .6 + 1);
    if (k <= 0) continue;
    const on = clamp(fill - i), col = on > 0 ? mixHex(o.off || EXP.paperEdge, o.col || EXP.cold, expoOut(on)) : (o.off || EXP.paperEdge);
    if (o.shape === 'robot') { const s = Math.min(cw, rh) * .42 * k; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y + rh * .22, s * .38, 0, 7); ctx.fill(); ctx.fillRect(x - s * .32, y + rh * .22 + s * .45, s * .64, s * 1.05); }
    else { ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, cw * .38); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y + rh * .9); ctx.lineTo(x, y + rh * .9 - rh * .8 * k); ctx.stroke(); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- curve: the trace becomes the line of a chart
// o { rect:[x,y,w,h], data:[[dx,dy]…], xr:[a,b], yr:[a,b], from: screen pts (the Spur as it is now), k morph 0..1, u draw 0..1,
//     axis 0..1 (axes engrave themselves), xTicks:[[v,label]], yTicks:[[v,label]], col 0 warm … 1 cold, dashFrom (data x, forecast) }
const resample = (pts, N) => {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1] || 1, out = []; let j = 1;
  for (let i = 0; i < N; i++) { const s = tot * i / (N - 1); while (j < L.length - 1 && L[j] < s) j++; const k = (s - L[j - 1]) / ((L[j] - L[j - 1]) || 1); out.push([mix(pts[j - 1][0], pts[j][0], k), mix(pts[j - 1][1], pts[j][1], k)]); }
  return out;
};
export function curve(ctx, t, o) {
  const [x, y, w, h] = o.rect, [xa, xb] = o.xr, [ya, yb] = o.yr, map = (p) => [x + (p[0] - xa) / (xb - xa) * w, y + h - (p[1] - ya) / (yb - ya) * h];
  const ax = o.axis ?? 1;
  if (ax > 0) {
    ctx.save(); ctx.strokeStyle = EXP.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y + h - h * expoOut(ax)); ctx.lineTo(x, y + h); ctx.lineTo(x + w * expoOut(ax), y + h); ctx.stroke();
    for (const [v, s] of o.xTicks || []) { const p = map([v, ya]); if (p[0] > x + w * ax) continue; ctx.beginPath(); ctx.moveTo(p[0], y + h); ctx.lineTo(p[0], y + h + 12); ctx.stroke(); text(ctx, s, p[0], y + h + 46, { size: EXP.size.small, weight: 600, color: EXP.ink, align: 'center', spacing: 1 }); }
    for (const [v, s] of o.yTicks || []) { const p = map([xa, v]); if (y + h - p[1] > h * ax) continue; ctx.strokeStyle = rgba(EXP.rule, .45); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, p[1]); ctx.lineTo(x + w, p[1]); ctx.stroke(); text(ctx, s, x - 16, p[1] + 9, { size: EXP.size.small, weight: 600, color: EXP.ink, align: 'right' }); ctx.strokeStyle = EXP.ink; ctx.lineWidth = 3; }
    ctx.restore();
  }
  const N = 64, D = resample(o.data.map(map), N), F = o.from ? resample(o.from, N) : D, k = sineS(o.k ?? 1);
  const P = D.map((d, i) => [mix(F[i][0], d[0], k), mix(F[i][1], d[1], k)]);
  const cut = o.dashFrom != null ? clamp((map([o.dashFrom, ya])[0] - x) / w) : 1, u = o.u ?? 1, w0 = o.w || 5;
  trace(ctx, P, Math.min(u, cut), { col: o.col || 0, w: w0, head: u < cut });
  if (u > cut) {   // the forecast part: dotted, same colour, no glow
    const i0 = Math.floor(cut * (N - 1)), i1 = Math.floor(u * (N - 1));
    ctx.save(); ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.strokeStyle = mixHex(EXP.warm, EXP.cold, o.col || 0); ctx.lineWidth = w0 * 1.3; ctx.beginPath();
    for (let i = i0; i <= i1; i++) (i === i0 ? ctx.moveTo(P[i][0], P[i][1]) : ctx.lineTo(P[i][0], P[i][1])); ctx.stroke(); ctx.restore();
  }
  return { pts: P, end: P[Math.min(N - 1, Math.floor(u * (N - 1)))], map };
}

// ---------------------------------------------------------------- pie: the cup's rim becomes the share circle
// o { x, y, r, parts:[{v, col, label}], t0, flat 0..1 (0 = ellipse ry0, 1 = circle), ry0 (.34), u sweep 0..1 (default from t0),
//     rimW (the glazed rim, 1 at flat 0 → thin ink ring at 1), labels (show leader labels when flat > .85), start (−π/2) }
export function pie(ctx, t, o) {
  const fl = sineS(o.flat ?? 1), ry = mix(o.ry0 ?? .34, 1, fl), r = o.r, tot = o.parts.reduce((s, p) => s + p.v, 0);
  const u = o.u ?? expoOut(lin(o.t0, o.t0 + 1.2, t)), st = o.start ?? -Math.PI / 2;
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(1, ry);
  ctx.fillStyle = EXP.paper; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
  let a = st;
  for (const p of o.parts) {
    const da = (p.v / tot) * Math.PI * 2, e = Math.min(a + da, st + Math.PI * 2 * u);
    if (e > a) { ctx.fillStyle = p.col || EXP.ink; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, a, e); ctx.closePath(); ctx.fill(); ctx.strokeStyle = EXP.paper; ctx.lineWidth = 3 / ry; ctx.stroke(); }
    p._mid = a + da / 2; a += da;
  }
  // the rim: glaze ochre at flat 0 (it is still the cup), a fine ink ring at flat 1
  ctx.lineWidth = mix(r * .09, 3, fl); ctx.strokeStyle = mixHex('#c58b4a', EXP.ink, fl); ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
  ctx.restore();
  if (o.labels !== false && fl > .85) {
    const lk = lin(.85, 1, fl);
    o.parts.forEach((p, i) => { if (!p.label) return; const ca = Math.cos(p._mid), sa = Math.sin(p._mid), ax = o.x + ca * r * .82, ay = o.y + sa * r * .82 * ry;
      tag(ctx, t, { ax, ay, x: o.x + ca * (r + 90) + (ca > 0 ? 20 : -20), y: o.y + sa * (r + 50) * ry, title: p.label, sub: p.sub, k: clamp(lk * 1.4 - i * .15), align: ca >= 0 ? 'left' : 'right' }); });
  }
}

// ---------------------------------------------------------------- cross-section
// mode 'rings' (a joint motor seen end-on): o { x, y, r, u (the cut-away wedge opens 0..1), rings:[{f0, f1, col, hatch, label, sub}] }
// mode 'layers' (ground under the valley): o { rect:[x,y,w,h], u (the cut drops down 0..1), layers:[{f (thickness share), col, hatch, label}], holes:[{x (0..1), w, d}] }
export function section(ctx, t, o) {
  ctx.save();
  if (o.mode === 'layers') {
    const [x, y, w, h] = o.rect, u = expoOut(o.u ?? 1), tot = o.layers.reduce((s, l) => s + l.f, 0);
    ctx.beginPath(); ctx.rect(x, y, w, h * u); ctx.clip();
    let yy = y;
    for (const l of o.layers) {
      const lh = h * l.f / tot; ctx.fillStyle = l.col; ctx.fillRect(x, yy, w, lh + 1);
      if (l.hatch) hatch(ctx, x, yy, w, lh, rgba(EXP.ink, .25), l.hatch, 1.2);
      ctx.strokeStyle = rgba(EXP.ink, .55); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke();
      if (l.label) text(ctx, l.label.toUpperCase(), x + 24, yy + lh / 2 + 9, { size: EXP.size.small, weight: 600, color: EXP.paper, spacing: 2 });
      yy += lh;
    }
    for (const hole of o.holes || []) { const hx = x + w * hole.x; ctx.fillStyle = EXP.ink; ctx.beginPath(); ctx.moveTo(hx - hole.w / 2, y); ctx.lineTo(hx - hole.w * .3, y + hole.d * (hole.k ?? 1)); ctx.lineTo(hx + hole.w * .3, y + hole.d * (hole.k ?? 1)); ctx.lineTo(hx + hole.w / 2, y); ctx.fill(); }
    ctx.restore(); return;
  }
  const { x, y, r } = o, u = expoOut(o.u ?? 1), wedge = Math.PI * .5 * u, a0 = -Math.PI / 2 - wedge / 2;
  // outside the wedge: the closed housing (porcelain shell, engraved)
  ctx.fillStyle = PAL.robotShell; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = EXP.ink; ctx.lineWidth = 3; ctx.stroke();
  for (let i = 1; i < 4; i++) { ctx.strokeStyle = rgba(EXP.ink, .25); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r * (1 - i * .18), 0, 7); ctx.stroke(); }
  // inside the wedge (grows to a quarter, then the whole face opens with u > .7): the rings
  const open = Math.PI * 2 * clamp((u - .7) / .3);
  ctx.save(); ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r + 2, a0 - open / 2, a0 + wedge + open / 2); ctx.closePath(); ctx.clip();
  for (const g of o.rings) {
    ctx.fillStyle = g.col; ctx.beginPath(); ctx.arc(x, y, r * g.f1, 0, 7); ctx.arc(x, y, r * g.f0, 0, 7, true); ctx.fill('evenodd');
    if (g.hatch) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * g.f1, 0, 7); ctx.arc(x, y, r * g.f0, 0, 7, true); ctx.clip('evenodd'); hatch(ctx, x - r, y - r, 2 * r, 2 * r, rgba(EXP.ink, .35), g.hatch, 1.4); ctx.restore(); }
    ctx.strokeStyle = EXP.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, r * g.f1, 0, 7); ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
  // callouts once the face is open
  const lk = lin(.75, 1, o.u ?? 1);
  o.rings.forEach((g, i) => { if (!g.label) return; const ang = -.35 + i * .42, rr = r * (g.f0 + g.f1) / 2;
    tag(ctx, t, { ax: x + Math.cos(ang) * rr, ay: y + Math.sin(ang) * rr, x: x + r + 70, y: y - r * .55 + i * 92, title: g.label, sub: g.sub, k: clamp(lk * 1.6 - i * .2) }); });
}

// ---------------------------------------------------------------- arrows and flow chains (drawn by the trace)
// arrow(ctx, a [x,y], b [x,y], u, { bend (px, + = left of travel), col 0 warm … 1 cold, w })
export function arrow(ctx, a, b, u, o = {}) {
  if (u <= 0) return;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, bend = o.bend ?? 0;
  const c = [mx - dy / L * bend, my + dx / L * bend], pts = [];
  for (let i = 0; i <= 24; i++) { const s = i / 24; pts.push([(1 - s) ** 2 * a[0] + 2 * (1 - s) * s * c[0] + s * s * b[0], (1 - s) ** 2 * a[1] + 2 * (1 - s) * s * c[1] + s * s * b[1]]); }
  const w = o.w || 4, e = trace(ctx, pts, u, { col: o.col || 0, w, head: u < 1 });
  if (u >= .98 && e) {   // the arrowhead lands when the line arrives (ink, so it reads on paper and on sky)
    const p = pts[22], ang = Math.atan2(b[1] - p[1], b[0] - p[0]), s = w * 4.2;
    ctx.save(); ctx.fillStyle = mixHex(EXP.warm, EXP.cold, o.col || 0); ctx.beginPath(); ctx.moveTo(b[0], b[1]);
    ctx.lineTo(b[0] - Math.cos(ang - .45) * s, b[1] - Math.sin(ang - .45) * s); ctx.lineTo(b[0] - Math.cos(ang + .45) * s, b[1] - Math.sin(ang + .45) * s); ctx.fill(); ctx.restore();
  }
}
// flow(ctx, t, { nodes:[{x, y, label, sub, col (0..1 trace colour of the arrow INTO this node)}], t0, step (.6), bend, chip true })
// Node i lands at t0 + i·step; the arrow into it is drawn in the .45 s before. Returns the node chip rects.
export function flow(ctx, t, o) {
  const step = o.step ?? .6, rects = [];
  o.nodes.forEach((n, i) => {
    const tn = o.t0 + i * step;
    if (i > 0) { const p = o.nodes[i - 1]; arrow(ctx, [p.x + (n.x > p.x ? 90 : 0), p.y], [n.x - (n.x > p.x ? 96 : 0), n.y], expoOut(lin(tn - .5, tn, t)), { bend: o.bend ?? -40, col: n.col ?? 0, w: 4 }); }
    rects.push(tag(ctx, t, { x: n.x, y: n.y, title: n.label, sub: n.sub, k: lin(tn - .05, tn + .45, t), align: 'center', noLine: true }));
  });
  return rects;
}

// ---------------------------------------------------------------- tag: the label with a line (also used by pie/section/flow)
// o { ax, ay (anchor on the object; omit for a free chip), x, y (chip baseline anchor), title (Inter caps), sub (Instrument Serif
//     number or word), t0, t1 or k (0..1 direct), align 'left'|'right'|'center', noLine }
export function tag(ctx, t, o) {
  const k = o.k ?? (lin(o.t0, o.t0 + .7, t) * (1 - (o.t1 != null ? lin(o.t1, o.t1 + .45, t) : 0)));
  if (k <= 0) return null;
  const al = o.align || 'left', ts = EXP.size.label, ss = o.subSize || EXP.size.mid;
  ctx.save();
  ctx.font = fontL(ts); const tw = o.title ? ctx.measureText(o.title.toUpperCase()).width + o.title.length * 3 : 0;
  ctx.font = fontN(ss); const sw = o.sub ? ctx.measureText(o.sub).width : 0;
  const cw = Math.max(tw, sw) + 44, chh = (o.sub ? ss * 1.05 : 0) + ts * 1.5 + 22;
  const cx = al === 'right' ? o.x - cw : al === 'center' ? o.x - cw / 2 : o.x, cy = o.y - chh / 2;
  // dot + leader (draws first), then the chip unfolds from the line's end (left/right edge)
  const kd = expoOut(lin(0, .3, k)), kl = expoOut(lin(.1, .55, k)), kc = expoOut(lin(.4, .85, k)), kt = lin(.55, 1, k);
  if (o.ax != null && !o.noLine) {
    ctx.fillStyle = EXP.ink; ctx.beginPath(); ctx.arc(o.ax, o.ay, 7 * kd, 0, 7); ctx.fill();
    ctx.strokeStyle = EXP.paper; ctx.lineWidth = 2.5; ctx.stroke();
    const ex = al === 'right' ? cx + cw : cx, ey = o.y;
    ctx.strokeStyle = EXP.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(o.ax, o.ay); ctx.lineTo(mix(o.ax, ex, kl), mix(o.ay, ey, kl)); ctx.stroke();
  }
  if (kc > 0) {
    const vw = cw * kc, vx = al === 'right' ? cx + cw - vw : al === 'center' ? cx + (cw - vw) / 2 : cx;
    ctx.fillStyle = EXP.shadow; ctx.fillRect(vx + 5, cy + 7, vw, chh);
    paperFill(ctx, vx, cy, vw, chh); ctx.strokeStyle = EXP.ink; ctx.lineWidth = 2; ctx.strokeRect(vx + 1, cy + 1, vw - 2, chh - 2);
    ctx.beginPath(); ctx.rect(vx, cy, vw, chh); ctx.clip();
    const tx = al === 'center' ? o.x : cx + 22, ta = al === 'center' ? 'center' : 'left';
    if (o.sub) wipeText(ctx, o.sub, tx, cy + 12 + ss * .86, kt, { size: ss, font: 'Instrument Serif', color: EXP.ink, align: ta });
    if (o.title) wipeText(ctx, o.title.toUpperCase(), tx, cy + chh - 18, lin(.1, 1, kt), { size: ts, weight: 600, color: EXP.ink, spacing: 3, align: ta });
  }
  ctx.restore();
  return [cx, cy, cw, chh];
}

// ---------------------------------------------------------------- the valley as a printed map (camera straight above, pitch ≈ −π/2)
// mapSheet(ctx, t, V, { u (0..1: ink lines draw along the roads, then pins drop, then the margin closes in from the frame edges),
//   pins:[{p:[x,z], title, sub}], title, scale (metres for the scale bar), col 0..1 (route colour warm/cold), routes:[[ [x,z]… ]] })
// The map is registered with the 3D view (V.P on the ground), so it lies ON the valley; no fade, the world stays underneath.
export function mapSheet(ctx, t, V, o) {
  const u = o.u ?? 1, ku = (a, b) => clamp((u - a) / (b - a));
  const G = (x, z) => { const s = V.P([x, VAL.hgt(x, z), z]); return [s.x, s.y]; };
  ctx.save();
  // 1. the river and roads in ink (the trace draws them, then they settle as ink)
  const roads = [VAL.road, VAL.branchHall, VAL.branchHouse];
  const riv = []; for (let x = -1400; x <= 1400; x += 40) riv.push(G(x, VAL.river.z));
  ctx.strokeStyle = rgba(EXP.cold, .9); ctx.lineWidth = 6; ctx.setLineDash([]); drawPart(ctx, riv, expoOut(ku(0, .35)));
  roads.forEach((rd, i) => { const P = rd.map((q) => G(q[0], q[1])); ctx.strokeStyle = EXP.ink; ctx.lineWidth = 4.5; drawPart(ctx, P, expoOut(ku(.05 + i * .06, .4 + i * .06))); });
  for (const r of o.routes || []) trace(ctx, r.map((q) => G(q[0], q[1])), expoOut(ku(.3, .7)), { col: o.col || 0, w: 5 });
  // 2. pins drop onto the places (staggered), labels unfold beside them
  (o.pins || []).forEach((p, i) => {
    const [px, py] = G(p.p[0], p.p[1]), kp = ku(.4 + i * .06, .62 + i * .06);
    if (kp <= 0) return;
    const drop = 1 - expoOut(kp);
    ctx.fillStyle = EXP.ink; ctx.beginPath(); ctx.arc(px, py - 26 * drop, 9, 0, 7); ctx.fill(); ctx.strokeStyle = EXP.paper; ctx.lineWidth = 3; ctx.stroke();
    if (p.title) tag(ctx, t, { ax: px, ay: py, x: px + (p.left ? -40 : 40), y: py - 38, title: p.title, sub: p.sub, k: clamp(kp * 1.3 - .2), align: p.left ? 'right' : 'left' });
  });
  // 3. the sheet's margin closes in from the frame edges (a solid paper border, not a fade), title and scale bar print on it
  const km = expoOut(ku(.7, 1)), m = 64 * km;
  if (m > .5) {
    ctx.fillStyle = EXP.paper; ctx.fillRect(0, 0, W, m); ctx.fillRect(0, H - m * 1.6, W, m * 1.6); ctx.fillRect(0, 0, m, H); ctx.fillRect(W - m, 0, m, H);
    ctx.strokeStyle = EXP.ink; ctx.lineWidth = 2.5; ctx.strokeRect(m, m, W - 2 * m, H - m * 2.6);
    const kt = lin(.85, 1, u);
    if (o.title) wipeText(ctx, o.title.toUpperCase(), m + 4, H - m * .55, kt, { size: EXP.size.small, weight: 600, color: EXP.ink, spacing: 4 });
    if (o.scale) { const a = G(0, 150), b = G(o.scale, 150), len = Math.abs(b[0] - a[0]); ctx.fillStyle = EXP.ink; ctx.fillRect(W - m - 30 - len, H - m * 1.05, len * kt, 6); wipeText(ctx, `${o.scale} M`, W - m - 30, H - m * .45, kt, { size: EXP.size.small, weight: 600, color: EXP.ink, align: 'right', spacing: 2 }); }
  }
  ctx.restore();
}
function drawPart(ctx, P, u) {
  if (u <= 0 || P.length < 2) return;
  const n = (P.length - 1) * u, i1 = Math.floor(n), f = n - i1;
  ctx.beginPath(); let pen = false;
  for (let i = 0; i <= i1 && i < P.length; i++) { const p = P[i]; if (!isFinite(p[0])) { pen = false; continue; } pen ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); pen = true; }
  if (i1 + 1 < P.length && pen && isFinite(P[i1 + 1][0])) ctx.lineTo(mix(P[i1][0], P[i1 + 1][0], f), mix(P[i1][1], P[i1 + 1][1], f));
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}
