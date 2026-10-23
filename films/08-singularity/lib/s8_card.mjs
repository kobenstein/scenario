// Film 8 · cards, labels and clips for the whole film (owner B1; shots.md §8.Q). Everything keys off T.clip(id).start/end, so a clip or card
// slot that changes length moves nothing else.
//
//   clip(ctx, t, T, id, o) → { open 0..1, rect }   any interview clip (C1…C7), full frame, the footage always opaque
//       o.carrier 'line' (default): the frame is black, a horizontal line at o.yOpen opens into the footage (old TV) and closes back to a line at
//                 o.yClose. o.open [t0, t1] (default [start − .3, start + .04]), o.close [t0, t1] (default [end + .02, end + .3]),
//                 o.lineTone 'cool' (default, the horizon light) | 'cream' | 'amber'. Draw nothing else in that window: clip() paints the frame.
//       o.carrier 'frame': an in-world rectangle grows to the full frame and shrinks back. Draw your world first, then call clip(): it paints
//                 only its rect. o.from [x, y, w, h] (screen rect of the object at the clip's first frame; or a function t → rect),
//                 o.to (rect at the end; default o.from), o.grow [t0, t1] (default [start, start + .35], expo-out), o.shrink (default
//                 [end − .35, end], expo-in). Outside grow…shrink the rect is the full frame.
//       o.face [fx, fy] the zoom centre after a jump cut (source-frame px; default the frame centre), o.dx (px, shift the footage sideways),
//       o.cuts [s, …] jump cuts in seconds into the clip (default: from clips.json `parts` / `cuts`); each cut punches in (1.00 → 1.10) and
//       the push keeps going (1.00 → 1.03 per segment). o.zoom(i, u) → zoom overrides that (i = segment, u 0..1 through it).
//       o.info { name, role, source, date } overrides clips.json for the lower third; o.lt false hides it; o.ltY (850).
//       While the clip's frames are not cut yet the footage is a placeholder (breathing silhouette, "FOOTAGE PENDING"), timing already right.
//   quoteCard(ctx, t, T, id, o)   a quote card in the title-card style (§8.Q) in the card slot T.clip(id) (Q1, Q2) or o.win [t0, t1]
//       o.lines ['line 1', 'line 2', …] (max 3; set them yourself, they are not wrapped), o.name 'SØREN KIERKEGAARD', o.source '1843',
//       o.at [s, …] reveal time of each line in seconds from the card start (default .25 + .35·i), o.out [t0, t1] the quote lifts out
//       (default [end − .55, end − .1]; the rule and the card line stay), o.size 80, o.sky (s8 camera opts, default the handoff sky view),
//       o.ground false (you draw the ground yourself), o.line { y 600, u 0..1 drawn, x0, x1, style 'cream' | 'split' (Q1: left cool solid,
//       right amber dotted) | null } the card's line, drawn in screen space; the quote block sits above it.
//       → { lineY, bottom (y under the last quote line) }
//   cardLine(ctx, t, o)        the card line alone (same o as quoteCard's o.line), for the shots before and after the card
//   label(ctx, t, ax, ay, u, top, bottom, o)   a small label: a leader line from the anchor, Inter caps wiped in from below (generalised
//       s8_canoe tag). o: { dx 60, len 120 (leader end relative to the anchor; len > 0 goes up), side 'right' | 'left', size 26, sub 20,
//       col '#f3efe2', dot true }. bottom may be '' (one line, a star-chart name). Never the word "AI".
//   lowerThird                 re-export of f6_kit.lowerThird (name, role · source · date, the ORIGINAL FOOTAGE pill)
import fs from 'node:fs';
import { rgba, clamp } from '../engine.mjs';
import { clipFrame, ROOT } from './kit.mjs';
import { lowerThird } from './f6_kit.mjs';
import { eoX, eiX, sio, u01, TAU } from './s8_kit.mjs';
import { lineGround, lineStroke, SKY0 } from './handoff4.mjs';

export { lowerThird };
const readClips = () => { try { return JSON.parse(fs.readFileSync(ROOT + 'audio/clips.json', 'utf8')); } catch { return {}; } };
let CL = null, CLt = 0;
const clipsJson = () => { const now = Date.now(); if (!CL || now - CLt > 60000) { CL = readClips(); CLt = now; } return CL; };
export function clipCuts(id) {
  const c = clipsJson()[id]; if (!c) return [];
  if (Array.isArray(c.cuts)) return c.cuts.map((x) => (typeof x === 'number' ? x : x.at ?? x[0]));
  if (Array.isArray(c.parts) && c.parts.length > 1) { const out = []; let s = 0; for (let i = 0; i < c.parts.length - 1; i++) { s += c.parts[i][1] - c.parts[i][0]; out.push(s); } return out; }
  return [];
}
const HASF = new Map();
const hasFrames = (id) => { if (!HASF.has(id)) HASF.set(id, fs.existsSync(`${ROOT}clips/${id}/f00001.jpg`)); return HASF.get(id); };
const LINE_TONE = { cool: ['#8fe6ff', '#eefcff'], cream: ['#e9dcc0', '#fffaf0'], amber: ['#ffb35c', '#fff1d6'] };

// the footage as a full 1920×1080 frame (in the current transform)
function footage(ctx, t, T, id, c, o) {
  const k = Math.floor(clamp(t - c.start, 0, c.end - c.start - 1e-3) * 30) + 1, fr = clipFrame(id, k);
  const cuts = o.cuts ?? clipCuts(id), dt = t - c.start;
  let i = 0; while (i < cuts.length && dt >= cuts[i]) i++;
  const s0 = i ? cuts[i - 1] : 0, s1 = i < cuts.length ? cuts[i] : c.end - c.start, u = clamp((dt - s0) / Math.max(.01, s1 - s0));
  const zoom = o.zoom ? o.zoom(i, u) : (i % 2 ? 1.1 : 1) + .03 * u;
  ctx.fillStyle = '#020208'; ctx.fillRect(0, 0, 1920, 1080);
  if (fr) {
    const b = 1080 / fr.height, s = b * zoom, f = i && o.face ? o.face : [fr.width / 2, fr.height / 2];
    const px = 960 + (o.dx || 0) - fr.width * b / 2 + f[0] * b, py = f[1] * b;
    ctx.drawImage(fr, px - f[0] * s, py - f[1] * s, fr.width * s, fr.height * s);
  } else if (!hasFrames(id)) placeholder(ctx, t, id, zoom);   // frames exist but not decoded yet (a snap far from the clip): black, as the minute
  ctx.globalAlpha = .045; ctx.fillStyle = '#000'; for (let y = 0; y < 1080; y += 4) ctx.fillRect(0, y, 1920, 1.5); ctx.globalAlpha = 1;
  const vg = ctx.createRadialGradient(960, 540, 420, 960, 540, 1150); vg.addColorStop(0, 'rgba(5,6,15,0)'); vg.addColorStop(1, 'rgba(5,6,15,.45)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, 1920, 1080);
}
function placeholder(ctx, t, id, zoom) {
  ctx.save(); ctx.translate(960, 540); ctx.scale(zoom, zoom); ctx.translate(-960, -540);
  const g = ctx.createRadialGradient(900, 380, 0, 900, 380, 1100); g.addColorStop(0, '#2b3566'); g.addColorStop(1, '#090b1c'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
  const cx = 960 + 8 * Math.sin(t * .8), cy = 700, b = 3 * Math.sin(t * 2.2);
  ctx.fillStyle = '#0b0d26'; ctx.beginPath(); ctx.ellipse(cx, cy - 250 + b, 120, 150, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx - 380, 1080); ctx.bezierCurveTo(cx - 360, cy - 20, cx - 150, cy - 70, cx, cy - 70); ctx.bezierCurveTo(cx + 150, cy - 70, cx + 360, cy - 20, cx + 380, 1080); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.font = '600 18px Inter'; ctx.letterSpacing = '4px'; ctx.fillStyle = 'rgba(243,239,226,.55)'; ctx.fillText(`FOOTAGE PENDING · ${id}`, 1560, 80); ctx.restore();
}
const lerpRect = (a, b, e) => a.map((v, i) => v + (b[i] - v) * e);
export function clip(ctx, t, T, id, o = {}) {
  const c = T.clip(id); if (!c) return { open: 0, rect: null };
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  let open = 1, rect = [0, 0, 1920, 1080];
  if ((o.carrier || 'line') === 'line') {
    const op = o.open || [c.start - .3, c.start + .04], cl = o.close || [c.end + .02, c.end + .3], yO = o.yOpen ?? 540, yC = o.yClose ?? 540;
    let top = 0, bot = 1080, lineA = 0;
    if (t < op[1]) { const e = eoX((t - op[0]) / (op[1] - op[0])); top = yO * (1 - e); bot = yO + (1080 - yO) * e; lineA = 1 - e; open = e; }
    if (t > cl[0]) { const e = clamp((t - cl[0]) / (cl[1] - cl[0])), q = e * e * (3 - 2 * e); top = q * yC; bot = 1080 - q * (1080 - yC); lineA = Math.max(lineA, q); open = Math.min(open, 1 - q); }
    if (o.ground) { ctx.save(); o.ground(ctx, t); ctx.restore(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }   // the world stays behind the band
    else { ctx.fillStyle = '#020208'; ctx.fillRect(0, 0, 1920, 1080); }
    const hv = Math.max(0, bot - top); rect = [0, top, 1920, hv];
    if (hv > .5) { ctx.save(); ctx.beginPath(); ctx.rect(0, top, 1920, hv); ctx.clip(); footage(ctx, t, T, id, c, o); ctx.restore(); }
    if (lineA > .01) {
      const [c0, c1] = LINE_TONE[o.lineTone] || LINE_TONE.cool;
      ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (const y of hv < 2 ? [(top + bot) / 2] : [top, bot]) for (const [lw, a] of [[22, .07], [7, .22], [1.8, .95]]) { ctx.strokeStyle = rgba(lw < 3 ? c1 : c0, a * lineA); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(-20, y); ctx.lineTo(1940, y); ctx.stroke(); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    if (o.lt !== false && t > op[1] - .05 && t < cl[0] + .05) lowerThird(ctx, t, T, id, { x: 110, y: o.ltY ?? 850, ...(o.info ? { info: o.info } : {}) });
    return { open, rect };
  }
  // frame carrier
  const R = (r) => (typeof r === 'function' ? r(t) : r), from = R(o.from) || [760, 430, 400, 225], to = R(o.to) || from;
  const gr = o.grow || [c.start, c.start + .35], sh = o.shrink || [c.end - .35, c.end], F = [0, 0, 1920, 1080];
  if (t < gr[1]) { open = eoX(u01(t, gr[0], gr[1])); rect = lerpRect(from, F, open); }
  else if (t > sh[0]) { const e = eiX(u01(t, sh[0], sh[1])); open = 1 - e; rect = lerpRect(F, to, e); }
  const [x, y, w, h] = rect, s = Math.max(w / 1920, h / 1080);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.translate(x + (w - 1920 * s) / 2, y + (h - 1080 * s) / 2); ctx.scale(s, s); footage(ctx, t, T, id, c, o);
  ctx.restore();
  if (open < 1) { ctx.strokeStyle = 'rgba(243,239,226,.35)'; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h); }
  ctx.restore();
  if (o.lt !== false && t > gr[1] - .05 && t < sh[0] + .05) lowerThird(ctx, t, T, id, { x: 110, y: o.ltY ?? 850, ...(o.info ? { info: o.info } : {}) });
  return { open, rect };
}

// ---------------------------------------------------------------- the card line (screen space)
export function cardLine(ctx, t, o = {}) {
  const y = o.y ?? 600, u = clamp(o.u ?? 1); if (u <= 0) return;
  const x0 = o.x0 ?? -40, x1 = o.x1 ?? 1960, xe = x0 + (x1 - x0) * u;
  if ((o.style || 'cream') !== 'split') { lineStroke(ctx, t, { y, tone: o.tone || 'cream', x0: x0 - 960, x1: xe - 960 }); return; }
  // Q1: backwards (left, cool, solid, understood) | forwards (right, amber, dotted, not yet lived)
  const mid = o.mid ?? 960;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const yy = y + 2 * Math.sin(t * .9), L = Math.min(xe, mid);
  if (L > x0) for (const [w, a, c] of [[22, .06, '#8fe6ff'], [7, .2, '#8fe6ff'], [2, .95, '#eefcff']]) { ctx.strokeStyle = rgba(c, a); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(L, yy); ctx.stroke(); }
  if (xe > mid) {
    const br = .85 + .15 * Math.sin(t * 2.3);
    for (let x = mid + 10; x < xe; x += 22) { const g = ctx.createRadialGradient(x, yy, 0, x, yy, 10); g.addColorStop(0, rgba('#fff1d6', .95 * br)); g.addColorStop(.35, rgba('#ffb35c', .5 * br)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(x - 10, yy - 10, 20, 20); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- quote card (§8.Q)
export function quoteCard(ctx, t, T, id, o = {}) {
  const c = o.win ? { start: o.win[0], end: o.win[1] } : T.clip(id); if (!c) return null;
  const lines = o.lines || [], n = lines.length, size0 = o.size ?? 80, lineY = o.line?.y ?? 600;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (o.ground !== false) lineGround(ctx, t, { ground: 'sky', ...SKY0, ...(o.sky || {}) });
  if (o.line !== null) cardLine(ctx, t, o.line || {});
  ctx.font = `400 ${size0}px Anton`; const wmax = Math.max(1, ...lines.map((s) => ctx.measureText(s).width)), size = wmax > 1640 ? size0 * 1640 / wmax : size0;
  const lh = size * 1.18, capH = size * .86, yLast = lineY - 92, y0 = yLast - (n - 1) * lh, out = o.out || [c.end - .55, c.end - .1];
  // name · source above the thin amber rule
  const nameU = eoX(u01(t, c.start + .05, c.start + .6)), outN = eiX(u01(t, out[0] + .12, out[1] + .12)), ly = y0 - capH - 58;
  if (nameU > 0 && outN < 1) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, ly - 30, 1920, 42); ctx.clip();
    ctx.font = '600 22px Inter'; ctx.letterSpacing = '6px'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    const s = [o.name, o.source].filter(Boolean).join('  ·  ').toUpperCase(), dy = (1 - nameU) * 34 - outN * 40;
    ctx.shadowColor = 'rgba(0,0,10,.8)'; ctx.shadowBlur = 8; ctx.fillStyle = '#f3efe2'; ctx.fillText(s, 963, ly + dy);
    ctx.restore();
  }
  const ru = eoX(u01(t, c.start + .15, c.start + .8)) * (1 - outN);
  if (ru > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#ffb35c', .9); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(960 - 90 * ru, ly + 22); ctx.lineTo(960 + 90 * ru, ly + 22); ctx.stroke(); ctx.restore(); }
  // the quote: Anton, cream with the warm glow, each line rises out of its own mask; it keeps rising a few px while it stands
  ctx.font = `400 ${size}px Anton`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  lines.forEach((txt, i) => {
    const t0 = c.start + (o.at ? o.at[i] : .25 + .35 * i), inU = eoX(u01(t, t0, t0 + .6)), outU = eiX(u01(t, out[0] + i * .06, out[1] + i * .06));
    if (inU <= 0 || outU >= 1) return;
    const y = y0 + i * lh, dy = (1 - inU) * capH * 1.15 - outU * capH * 1.25 - (t - t0) * 2.5;
    ctx.save(); ctx.beginPath(); ctx.rect(0, y - capH - 14, 1920, capH + 30); ctx.clip();
    ctx.shadowColor = 'rgba(255,170,80,.55)'; ctx.shadowBlur = 30; ctx.fillStyle = 'rgba(243,239,226,.95)'; ctx.fillText(txt, 960, y + dy);
    ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(255,200,130,.45)'; ctx.fillStyle = '#f3efe2'; ctx.fillText(txt, 960, y + dy);
    ctx.restore();
  });
  ctx.restore();
  return { lineY, bottom: yLast + 20, top: ly - 30 };
}

// ---------------------------------------------------------------- small labels
export function label(ctx, t, ax, ay, u, top, bottom = '', o = {}) {
  if (u <= 0) return;
  const side = o.side === 'left' ? -1 : 1, lx = ax + side * (o.dx ?? 60), ly = ay - (o.len ?? 120), lu = eoX(clamp(u * 1.6)), sz = o.size ?? 26, sb = o.sub ?? 20;
  ctx.save(); ctx.strokeStyle = rgba(o.col || '#f3efe2', .8); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + (lx - ax) * lu, ay + (ly - ay) * lu); ctx.stroke();
  if (o.dot !== false) { ctx.fillStyle = o.col || '#f3efe2'; ctx.beginPath(); ctx.arc(ax, ay, 3, 0, TAU); ctx.fill(); }
  const tu = clamp((u - .3) / .7);
  if (tu > 0) {
    const tx = lx + side * 16, w = 1100;
    ctx.beginPath(); ctx.rect(side > 0 ? lx + 4 : lx - 4 - w, ly - sz * 2.7, w, sz * 2.7 + sb * 1.6); ctx.clip();
    const dy = (1 - eoX(tu)) * sz * 3;
    ctx.textBaseline = 'alphabetic'; ctx.textAlign = side > 0 ? 'left' : 'right'; ctx.shadowColor = 'rgba(0,0,10,.8)'; ctx.shadowBlur = 8;
    ctx.font = `600 ${sz}px Inter`; ctx.letterSpacing = `${sz * .27}px`; ctx.fillStyle = o.col || '#f3efe2'; ctx.fillText(top, tx, ly - (bottom ? sz * 1.15 : sz * .1) + dy);
    if (bottom) { ctx.font = `500 ${sb}px Inter`; ctx.letterSpacing = `${sb * .25}px`; ctx.fillStyle = '#a49fc4'; ctx.fillText(bottom, tx, ly + sb * .2 + dy); }
  }
  ctx.restore();
}
