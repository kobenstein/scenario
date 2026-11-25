// Film 74 clips (ORIGINAL FOOTAGE): C6 (Tekedra Mawakana, Waymo) · C4 · C1 (Demis Hassabis); fallback set C3 · C4 · C1 (the timing file decides). Frames: /tmp/claude-0/f74/clips/<id>/f00001.jpg …
// (cut with tools/clip_frames.sh from the iMac files in Drive "#74 …/3 Rohmaterial/clips"). Missing frames → a placeholder plate with the wording.
// The plate grows out of the OLD SCREEN of the scene (o.from = its rect) and shrinks back into it.
import fs from 'node:fs';
import { loadImage } from '@napi-rs/canvas';
import { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, rad, maskLine, rise, measure, glowText } from '../lib/f74_kit.mjs';
export const CLIPS = {   // lower thirds as text-v3 (25.11.): Hassabis is chairman since 5.8.2026, so role and date are those of the recording
  C6: { name: 'Tekedra Mawakana', role: 'Co-CEO, Waymo', year: '2026', src: 'Stanford GSB', quote: '"…we want to be the world\'s most trusted driver."' },
  C4: { name: 'Demis Hassabis', role: 'Then CEO, Google DeepMind', year: 'Davos, Jan 2026', src: 'World Economic Forum', quote: '"…distribute this new wealth more fairly. I don\'t know if we have the right institutions…"' },
  C1: { name: 'Demis Hassabis', role: 'Then CEO, Google DeepMind', year: 'May 2026', src: 'Google I/O', quote: '"…10 times the impact of the Industrial Revolution, maybe 10 times faster."' },
  C3: { name: 'Demis Hassabis', role: 'Then CEO, Google DeepMind', year: 'May 2026', src: 'Google I/O', quote: '"The future is not written… We don\'t know. Nobody knows."' },   // fallback set only
};
export const CLIP_RECT = { x: 320, y: 132, w: 1280, h: 720 };   // bottom at 852: the subtitle band below stays free; the name sits above the plate
const DIR = (process.env.F74CLIPS || '/tmp/claude-0/f74/clips/').replace(/\/?$/, '/');
const nF = new Map(); const count = (id) => { if (!nF.has(id)) { let n = 0; try { n = fs.readdirSync(DIR + id).filter((f) => /^f\d{5}\.jpg$/.test(f)).length; } catch {} nF.set(id, n); } return nF.get(id); };
const fpath = (id, k) => `${DIR}${id}/f${String(k).padStart(5, '0')}.jpg`;
const cache = new Map();
const frameAt = (id, t, c) => { const n = count(id); return n ? Math.max(1, Math.min(n, Math.floor((t - c.start) * 30) + 1)) : 0; };
export async function prepareClipFrames(T, t) {
  for (const id of Object.keys(CLIPS)) {
    const c = T.clip(id); if (!c || t < c.start - 1 || t > c.end + 1) continue;
    const k = frameAt(id, t, c); if (!k) continue; const f = fpath(id, k); if (cache.has(f)) continue;
    if (cache.size > 40) cache.delete(cache.keys().next().value);
    cache.set(f, await loadImage(fs.readFileSync(f)));
  }
}
export const hasFootage = (id) => count(id) > 0;
// m 0..1: 0 = the old screen's rect (from), 1 = the full plate
export function clipPlate(ctx, t, T, id, from, m) {
  const R = CLIP_RECT, c = T.clip(id) || { start: t, end: t + 1 }, info = CLIPS[id], e = sineIO(clamp(m));
  const x = lerp(from[0], R.x, e), y = lerp(from[1], R.y, e), w = lerp(from[2], R.w, e), h = lerp(from[3], R.h, e);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save(); ctx.shadowColor = rgba('#060a24', .6 * e); ctx.shadowBlur = 40 * e; ctx.shadowOffsetY = 12 * e; ctx.fillStyle = '#0d1438'; ctx.beginPath(); ctx.roundRect(x - 14 * e, y - 14 * e, w + 28 * e, h + 28 * e, 10); ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.clip();
  const k = frameAt(id, t, c), fr = k ? cache.get(fpath(id, k)) : null;
  if (fr) { const s = Math.max(w / fr.width, h / fr.height); ctx.drawImage(fr, x + w / 2 - fr.width * s / 2, y + h / 2 - fr.height * s / 2, fr.width * s, fr.height * s); }
  else {
    ctx.fillStyle = rad(ctx, x + w / 2, y + h * .45, w * .7, [[0, '#26407e'], [1, '#0b1236']]); ctx.fillRect(x, y, w, h);
    if (e > .7) { ctx.globalAlpha = span(e, .7, 1); const sz = Math.max(26, 44 * w / R.w);
      glowText(ctx, info.quote, x + w / 2, y + h * .48, { size: sz, serif: true, align: 'center', col: P.cream });
      glowText(ctx, `PLACEHOLDER · ${id} · ${info.name.toUpperCase()} · THE ORIGINAL FOOTAGE GOES HERE`, x + w / 2, y + h * .62, { size: 22, align: 'center', col: P.halo2, glow: false, spacing: .12 });
      ctx.fillStyle = rgba(P.halo2, .6); ctx.fillRect(x + w * .2, y + h * .7, w * .6 * clamp((t - c.start) / (c.end - c.start)), 3); ctx.globalAlpha = 1; }
  }
  ctx.restore();
  ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.stroke();
  const lu = span(t, c.start + .2, c.start + 1.1) * (1 - span(t, c.end - .5, c.end + .1)) * span(e, .85, 1);
  if (lu > 0) {
    const by = R.y - 30; maskLine(ctx, [[info.name, 0]], R.x, by, 46, rise(lu), { glow: true });
    maskLine(ctx, [[[info.role, info.year].join(' · ').toUpperCase(), 0]], R.x + measure(info.name, 46, true) + 28, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
    maskLine(ctx, [[`ORIGINAL FOOTAGE (${info.src.toUpperCase()})`, .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right', col: '#ffe7a8', glow: false });
  }
  ctx.restore();
}
