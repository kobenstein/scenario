// Perforation, the reservation mark of Film 5 (shots.md §1): letters made of pinholes with light shining through
// ("PROMISE", "WHOLLY OWNED", "IPO PLANNED"; no rubber stamps), and perforation lines where a corner or a coupon tears off.
//
//   perforateText(ctx, text, x, y, o) → { w, h, n }      x,y = centre of the text block
//     o: { size 110 (cap height px), pitch 6.5 (hole spacing px), hole 1.5 (hole radius px), font 'Inter', weight 800, spacing 10 (px),
//          light '#ffe2b0' (what shines through), glow .8 (halo), u 1 (0..1: holes punched in reading order, each with a tiny flash),
//          t (the light breathes), rot 0, a 1, shade '#140c08' (the hole's rim/shadow in the paper), back null (colour of a paper patch
//          behind, null = draw over your own paper) }
//   perforation(ctx, pts, o)   a row of holes along a polyline; o: { pitch 7, hole 1.4, light null (colour shining through) | col,
//          tear 0 (0..1: torn open from the first point on, a ragged fibrous gap), a 1, shade }
//   tearAway(ctx, o)           tears a piece off along a straight perforation: o: { line: [[x0, y0], [x1, y1]], draw(ctx) (draws the whole
//          sheet in screen space), part 'piece' | 'rest', side 1 | -1 (which side of the line is the piece), tear 0..1, lift 60 (px the piece
//          travels once free), rot .35 (rad it turns), dir [dx, dy] (travel direction, default the line normal toward the piece), shadow true,
//          edge '#f6eedb' (torn fibre colour) }
//          Call it twice: part 'rest' (stays) and part 'piece' (comes off). The perforation itself: perforation(ctx, line, { tear }).
import { rgba, clamp, mix, prng, canvas, sm, eout, lin } from '../engine.mjs';

const TAU = Math.PI * 2;
const HOLES = new Map();
function holesFor(text, size, pitch, font, weight, spacing) {
  const key = JSON.stringify([text, size, pitch, font, weight, spacing]); if (HOLES.has(key)) return HOLES.get(key);
  const fs = size / .72, [m, mx] = canvas(10, 10); mx.font = `${weight} ${fs}px "${font}"`; try { mx.letterSpacing = spacing + 'px'; } catch { }
  const tw = Math.ceil(mx.measureText(text).width) + 20, th = Math.ceil(fs * 1.2), [c, g] = canvas(tw, th);
  g.font = `${weight} ${fs}px "${font}"`; try { g.letterSpacing = spacing + 'px'; } catch { } g.textBaseline = 'alphabetic'; g.fillStyle = '#fff'; g.fillText(text, 10, th * .8);
  const D = g.getImageData(0, 0, tw, th).data, pts = [];
  for (let row = 0, y = pitch * .5; y < th; y += pitch * .866, row++) for (let x = (row & 1) ? pitch * .5 : 0; x < tw; x += pitch) {
    const xi = Math.round(x), yi = Math.round(y); if (xi >= tw || yi >= th) continue; if (D[(yi * tw + xi) * 4 + 3] > 140) pts.push([x - tw / 2, y - th * .8 + size / 2]);
  }
  pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const out = { pts, w: tw - 20, h: size }; HOLES.set(key, out); return out;
}
const SPR = new Map();
function glowSprite(col, r) { const k = col + r; if (!SPR.has(k)) { const R = Math.ceil(r), [c, g] = canvas(R * 2, R * 2), gr = g.createRadialGradient(R, R, 0, R, R, R); gr.addColorStop(0, rgba(col, .9)); gr.addColorStop(.25, rgba(col, .35)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(0, 0, R * 2, R * 2); SPR.set(k, c); } return SPR.get(k); }

export function perforateText(ctx, text, x, y, o = {}) {
  const size = o.size ?? 110, pitch = o.pitch ?? 6.5, hole = o.hole ?? 1.5, light = o.light || '#ffe2b0', a = o.a ?? 1, u = clamp(o.u ?? 1), t = o.t ?? 0;
  const Hs = holesFor(text, size, pitch, o.font || 'Inter', o.weight ?? 800, o.spacing ?? 10), n = Hs.pts.length, shown = Math.floor(n * u);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.globalAlpha = a;
  if (o.back) { ctx.fillStyle = o.back; ctx.fillRect(-Hs.w / 2 - 40, -size / 2 - 40, Hs.w + 80, size + 80); }
  const shade = o.shade || '#140c08', spr = glowSprite(light, hole * 7), br = .85 + .15 * Math.sin(t * 1.7);
  // the punched rims (paper fibre pushed in) under the light
  ctx.fillStyle = rgba(shade, .55);
  for (let i = 0; i < shown; i++) { const [px, py] = Hs.pts[i]; ctx.beginPath(); ctx.arc(px + .5, py + .6, hole + .9, 0, TAU); ctx.fill(); }
  ctx.globalCompositeOperation = 'lighter';
  if ((o.glow ?? .8) > 0) { ctx.globalAlpha = a * (o.glow ?? .8) * .5 * br; for (let i = 0; i < shown; i++) { const [px, py] = Hs.pts[i]; ctx.drawImage(spr, px - spr.width / 2, py - spr.height / 2); } }
  ctx.globalAlpha = a; ctx.fillStyle = light;
  for (let i = 0; i < shown; i++) { const [px, py] = Hs.pts[i], fresh = u < 1 ? clamp(1 - (shown - i) / 12) : 0; ctx.beginPath(); ctx.arc(px, py, hole * (1 + fresh * .8), 0, TAU); ctx.fill(); }
  ctx.globalAlpha = a * .9; ctx.fillStyle = '#ffffff'; for (let i = 0; i < shown; i++) { const [px, py] = Hs.pts[i]; ctx.fillRect(px - .45, py - .45, .9, .9); }
  ctx.restore();
  return { w: Hs.w, h: size, n };
}

export function perforation(ctx, pts, o = {}) {
  if (!pts || pts.length < 2) return; const pitch = o.pitch ?? 7, hole = o.hole ?? 1.4, tear = clamp(o.tear ?? 0), a = o.a ?? 1, r = prng(o.seed ?? 9);
  const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); const L = d[d.length - 1];
  const at = (s) => { let j = 0; while (j < d.length - 2 && d[j + 1] < s) j++; const q = (s - d[j]) / ((d[j + 1] - d[j]) || 1); return [mix(pts[j][0], pts[j + 1][0], q), mix(pts[j][1], pts[j + 1][1], q), Math.atan2(pts[j + 1][1] - pts[j][1], pts[j + 1][0] - pts[j][0])]; };
  ctx.save(); ctx.globalAlpha = a;
  // torn part: a ragged gap with fibres
  if (tear > 0) { const Lt = L * tear; ctx.strokeStyle = rgba(o.shade || '#140c08', .75); ctx.lineWidth = hole * 1.6; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let s = 0; s <= Lt; s += 2.2) { const [x, y, an] = at(s), j = (r() - .5) * 2.2; s ? ctx.lineTo(x - Math.sin(an) * j, y + Math.cos(an) * j) : ctx.moveTo(x, y); } ctx.stroke();
    ctx.strokeStyle = rgba(o.edge || '#f6eedb', .55); ctx.lineWidth = .6; for (let s = 0; s <= Lt; s += 1.7) { const [x, y, an] = at(s), l = 1.5 + r() * 3, sd = r() < .5 ? 1 : -1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.sin(an) * l * sd + (r() - .5), y + Math.cos(an) * l * sd + (r() - .5)); ctx.stroke(); } }
  for (let s = pitch / 2; s < L; s += pitch) {
    if (s < L * tear) continue; const [x, y] = at(s);
    ctx.fillStyle = rgba(o.shade || '#140c08', .6); ctx.beginPath(); ctx.arc(x + .4, y + .5, hole + .7, 0, TAU); ctx.fill();
    if (o.light) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const spr = glowSprite(o.light, hole * 6); ctx.globalAlpha = a * .5; ctx.drawImage(spr, x - spr.width / 2, y - spr.height / 2); ctx.globalAlpha = a; ctx.fillStyle = o.light; ctx.beginPath(); ctx.arc(x, y, hole, 0, TAU); ctx.fill(); ctx.restore(); }
    else { ctx.fillStyle = o.col || '#0b0a12'; ctx.beginPath(); ctx.arc(x, y, hole, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}

export function tearAway(ctx, o = {}) {
  const [[x0, y0], [x1, y1]] = o.line, tear = clamp(o.tear ?? 0), side = o.side ?? 1, part = o.part || 'piece';
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L * side, ny = dx / L * side, BIG = 4000;
  const half = (c) => { c.beginPath(); c.moveTo(x0 - dx / L * BIG, y0 - dy / L * BIG); c.lineTo(x1 + dx / L * BIG, y1 + dy / L * BIG); c.lineTo(x1 + dx / L * BIG + nx * BIG, y1 + dy / L * BIG + ny * BIG); c.lineTo(x0 - dx / L * BIG + nx * BIG, y0 - dy / L * BIG + ny * BIG); c.closePath(); };
  if (part === 'rest') { ctx.save(); const sx = -nx, sy = -ny; ctx.beginPath(); ctx.moveTo(x0 - dx / L * BIG, y0 - dy / L * BIG); ctx.lineTo(x1 + dx / L * BIG, y1 + dy / L * BIG); ctx.lineTo(x1 + dx / L * BIG + sx * BIG, y1 + dy / L * BIG + sy * BIG); ctx.lineTo(x0 - dx / L * BIG + sx * BIG, y0 - dy / L * BIG + sy * BIG); ctx.closePath(); ctx.clip(); o.draw(ctx); ctx.restore(); return; }
  // the piece: hinges at the end that tears last (x1, y1), turns a little as the tear runs, then travels away once free
  const free = sm(lin(.75, 1, tear)), rot = (o.rot ?? .35) * eout(tear) * side, lift = (o.lift ?? 60) * free, dir = o.dir || [nx, ny];
  ctx.save();
  if (o.shadow !== false && tear > 0) { ctx.save(); ctx.translate(dir[0] * lift + 8 * tear, dir[1] * lift + 12 * tear); ctx.translate(x1, y1); ctx.rotate(rot); ctx.translate(-x1, -y1); half(ctx); ctx.clip(); ctx.filter = 'blur(6px)'; ctx.globalAlpha = .35 * tear; ctx.fillStyle = '#000'; ctx.fillRect(Math.min(x0, x1) - 400, Math.min(y0, y1) - 400, Math.abs(dx) + 800, Math.abs(dy) + 800); ctx.filter = 'none'; ctx.restore(); }
  ctx.translate(dir[0] * lift, dir[1] * lift); ctx.translate(x1, y1); ctx.rotate(rot); ctx.translate(-x1, -y1);
  half(ctx); ctx.clip(); o.draw(ctx);
  // torn fibre edge on the piece
  if (tear > 0) { const r = prng(o.seed ?? 4); ctx.strokeStyle = rgba(o.edge || '#f6eedb', .8); ctx.lineWidth = .7; for (let s = 0; s < L * tear; s += 2) { const q = s / L, x = x0 + dx * q, y = y0 + dy * q, l = 1 + r() * 2.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + nx * l, y + ny * l); ctx.stroke(); } }
  ctx.restore();
}
