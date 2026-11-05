// Placeholder shots so the whole film renders end to end from day one: one card per spoken sentence of a chunk,
// showing chunk, section, the sentence (words light up with the voice) and the palette of that section (konzept.md §3).
// Builders replace scenes/scNN.mjs step by step; anything not yet built keeps rendering as a stub.
import { W, H, C, rgba, clamp, lin, eout, drift, text } from '../engine.mjs';

export const PAL = { // ground, middle, accent (konzept.md §3)
  H: ['#1d2a44', '#9fb6cf', '#ffb35c'], 0: ['#3a2a24', '#efe4cc', '#8e2f2a'], 1: ['#2a1c18', '#e8d7b0', '#e9a54b'],
  2: ['#0b0f2a', '#f3efe2', '#c4512e'], 3: ['#0c1b33', '#dfe8f2', '#5fe0a8'], 4: ['#4a3426', '#e8a3a0', '#8fd27a'],
  5: ['#1e4a3a', '#e9c46a', '#b7c25a'], 6: ['#0d1530', '#f5b08a', '#f0a04b'], 7: ['#070918', '#ffd08a', '#ffb35c'],
};
const SECNAME = { 0: '§0 Smarter, or think for you', 1: '§1 What we unlearn', 2: '§2 Why we don’t notice', 3: '§3 The Go players', 4: '§4 Who does the thinking', 5: '§5 Forklift or trainer', 6: '§6 The gym becomes a city', 7: '§7 2035, twice', 8: '§8 What can you do', 9: '§9 Start with you · who has to help' };   // Film 11

function wrapWords(ctx, words, size, maxW) {
  ctx.font = `${size}px "Instrument Serif"`; const sp = ctx.measureText(' ').width, lines = []; let cur = [], w = 0;
  for (const o of words) { const ww = ctx.measureText(o.w).width; if (cur.length && w + sp + ww > maxW) { lines.push(cur); cur = []; w = 0; } w += (cur.length ? sp : 0) + ww; cur.push(o); }
  if (cur.length) lines.push(cur); return lines;
}
export const stubShot = (R, line) => (ctx, t, s) => {
  const [g, m, acc] = PAL[line.sec] || PAL[7];
  const bg = ctx.createLinearGradient(0, 0, W * .3, H); bg.addColorStop(0, g); bg.addColorStop(1, '#070918'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // a slow light so even the stub never stands still
  const lx = W * (.72 + .05 * Math.sin(t * .21)), ly = H * .2, gr = ctx.createRadialGradient(lx, ly, 0, lx, ly, 900);
  gr.addColorStop(0, rgba(acc, .22)); gr.addColorStop(1, rgba(acc, 0)); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  const dx = drift(t, 6, 1), dy = drift(t, 4, 2);
  text(ctx, `${R.id.toUpperCase()} · STUB · shots ${R.shots}`, 120 + dx, 150 + dy, { size: 22, weight: 600, color: rgba(m, .75), spacing: 6 });
  text(ctx, SECNAME[line.sec] || line.sec, 120 + dx, 210 + dy, { size: 46, font: 'Instrument Serif', color: m });
  const lines = wrapWords(ctx, line.words, 72, W - 300);
  lines.forEach((ln, li) => {
    let x = 120 + dx; const y = 470 + li * 92 + dy;
    for (const o of ln) {
      const on = eout(lin(o.s - .05, o.s + .2, t)); ctx.font = '72px "Instrument Serif"';
      text(ctx, o.w, x, y, { size: 72, font: 'Instrument Serif', color: on > .5 ? '#f3efe2' : m, alpha: .28 + .72 * on });
      x += ctx.measureText(o.w + ' ').width;
    }
  });
  const u = clamp((t - line.s) / Math.max(.1, line.e - line.s));
  ctx.fillStyle = rgba(m, .25); ctx.fillRect(120, H - 130, W - 240, 3); ctx.fillStyle = acc; ctx.fillRect(120, H - 130, (W - 240) * u, 3);
  text(ctx, `${t.toFixed(2)} s`, W - 120, H - 150, { size: 20, weight: 500, color: rgba(m, .6), align: 'right' });
};
// stub entries for a chunk: one per sentence in [R.a, R.b)
export function stubChunk(T, R) {
  const out = [];
  for (const sec of T.secs) for (const l of T.lines(sec)) if (l.s >= R.first - .01 && l.s < R.b - .01) out.push({ t: Math.max(0, l.s - .3), draw: stubShot(R, l), tr: 'cut', d: .35 });
  if (!out.length) out.push({ t: R.first, draw: stubShot(R, { sec: T.secs[0], words: [], s: R.a, e: R.b }), tr: 'cut', d: .1 });
  return out;
}
export const errorCard = (id, R, err) => (ctx, t) => {
  ctx.fillStyle = '#3a0d12'; ctx.fillRect(0, 0, W, H);
  text(ctx, `${id.toUpperCase()} FAILED TO BUILD`, 120, 300, { size: 64, font: 'Instrument Serif', color: '#ffd0c8' });
  String(err?.message || err).match(/.{1,90}(\s|$)/g)?.slice(0, 6).forEach((s, i) => text(ctx, s, 120, 400 + i * 44, { size: 28, color: '#ffd0c8' }));
};
