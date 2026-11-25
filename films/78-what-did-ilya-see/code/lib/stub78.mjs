// Film 78 · placeholder chunks so the whole film renders end to end from day one (Editorial-Nacht stage, no blends):
// one entry per shots.md row of the chunk: the row id, the binding "zeigt wörtlich" text and the sentence (words light up with the voice).
// Clip slots show the real footage in F.clipPlate; the group seams show the real plates (S.plateHook / S.plateRecord) for ± SEAM_HALF,
// so tools/seam.mjs can be run against a stub neighbour. The end screen is the real one (S.endScreen). Builders replace scenes/scNN.mjs.
import fs from 'node:fs';
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
import * as S from './f78_world.mjs';
const { W, H, P, rgba, clamp, span } = E;
const ROWS = (() => { try { return JSON.parse(fs.readFileSync(new URL('../docs/shots.json', import.meta.url), 'utf8')); } catch { return []; } })();
function wrap(s, size, maxW, serif = false) { const out = []; let cur = ''; for (const w of s.split(/\s+/)) { const nx = cur ? cur + ' ' + w : w; if (cur && F.measure(nx, size, serif, 600) > maxW) { out.push(cur); cur = w; } else cur = nx; } if (cur) out.push(cur); return out; }
const stubShot = (R, row, T) => (ctx, t) => {
  const c = S.drift2(S.HOME(), t, 1, 3);
  S.stage(ctx, t, c);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (row.type === 'CLIP' && row.anchor.startsWith('slot:')) { F.clipPlate(ctx, t, T, row.anchor.slice(5), { from: [W / 2, H / 2, 40], morph: 1 }); return; }
  F.goldText(ctx, [[`${R.id.toUpperCase()} · STUB · ${row.id} · ${row.type}`, .5]], 120, 150, 24, 1, { serif: false, weight: 700, spacing: .1 });
  wrap(row.shows, 34, W - 260).slice(0, 6).forEach((ln, i) => F.glowText(ctx, ln, 120, 230 + i * 48, { size: 34, weight: 600, col: P.cream, glow: false }));
  const line = T.lineAt(t);
  if (line) { let x = 120, y = 640; for (const o of line.words) { const ww = F.measure(o.w + ' ', 52, true); if (x + ww > W - 140) { x = 120; y += 66; } if (y > 840) break; const on = clamp((t - o.s + .05) / .2); F.glowText(ctx, o.w, x, y, { size: 52, serif: true, col: on > .5 ? F.GOLD.text : F.CREAM2, glow: false, a: .35 + .65 * on }); x += ww; } }
  ctx.fillStyle = rgba(F.CREAM2, .3); ctx.fillRect(120, 872, W - 240, 3); ctx.fillStyle = F.GOLD.body; ctx.fillRect(120, 872, (W - 240) * clamp((t - row.t) / Math.max(.1, row.len)), 3);
};
export function stubChunk(T, R) {
  const out = [];
  for (const row of ROWS) if (row.chunk === R.id) out.push({ t: Math.max(R.a, row.id === 'E.01' ? row.t : row.t - .3), draw: stubShot(R, row, T), tr: 'cut' });
  if (!out.length) out.push({ t: R.a, draw: stubShot(R, { id: '?', type: '?', shows: 'no rows in docs/shots.json (run python3 tools/shots78.py)', t: R.a, len: R.b - R.a, anchor: '' }, T), tr: 'cut' });
  // the real seam plates at the group seams (± SEAM_HALF), the real end screen
  for (const [phrase, plate] of [['So what was in those pages', S.plateHook], ['That is why this channel exists', S.plateRecord]]) {
    const t0 = T.G(phrase), h = S.SEAM_HALF, draw = (c, t) => plate(c, t, T);
    if (Math.abs(R.b - t0) < 1e-6) { for (const e of out) if (e.t > t0 - h) e.t = t0 - h - .01; out.push({ t: t0 - h, draw, tr: 'cut' }); }
    if (Math.abs(R.a - t0) < 1e-6) {   // rows that would start inside the plate window start after it (the latest one wins)
      const early = out.filter((e) => e.t < t0 + h).sort((p, q) => p.t - q.t), keep = early[early.length - 1];
      for (const e of early) e.t = e === keep ? t0 + h : -1;
      out.splice(0, out.length, ...out.filter((e) => e.t >= 0)); out.push({ t: t0, draw, tr: 'cut' });
    }
  }
  if (R.b >= T.duration - 1e-6) { const es = T.duration - 15; for (const e of out) if (e.t > es) e.t = -1; out.splice(0, out.length, ...out.filter((e) => e.t >= 0)); out.push({ t: es, draw: (c, t) => S.endScreen(c, t, T), tr: 'cut' }); }
  return out.sort((p, q) => p.t - q.t);
}
export const errorCard = (id, R, err) => (ctx, t) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#2a1030'; ctx.fillRect(0, 0, W, H);
  F.glowText(ctx, `${id.toUpperCase()} FAILED TO BUILD`, 120, 300, { size: 64, serif: true, col: '#ffd8c8', glow: false });
  String(err?.message || err).match(/.{1,90}(\s|$)/g)?.slice(0, 6).forEach((s, i) => F.glowText(ctx, s, 120, 400 + i * 44, { size: 28, col: '#ffd8c8', glow: false }));
};
