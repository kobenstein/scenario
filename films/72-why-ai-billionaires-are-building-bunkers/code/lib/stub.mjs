// Placeholder shots so the whole film renders end to end from day one: one card per spoken sentence of a chunk,
// showing chunk, section, the sentence (words light up with the voice) and the palette of that section (konzept.md §3).
// Builders replace scenes/scNN.mjs step by step; anything not yet built keeps rendering as a stub.
import { W, H, C, rgba, clamp, lin, eout, drift, text } from '../engine.mjs';

export const PAL = { // ground, middle, accent (docs/MOTION.md §5: night blue + one accent per topic)
  H: ['#0a1334', '#f3efe2', '#f6c95c'], 1: ['#0a1334', '#f3efe2', '#f6c95c'], 2: ['#0a1334', '#dbe6f6', '#9fc2ee'], 3: ['#0a1334', '#f3efe2', '#b3abd6'],
  M: ['#0a1334', '#f3efe2', '#f6c95c'], 4: ['#0a1334', '#f3efe2', '#f6c95c'], 5: ['#0a1334', '#f3efe2', '#e3a63f'], 6: ['#0a1334', '#f3efe2', '#ffd982'],
  E: ['#080b27', '#f3efe2', '#f6c95c'], A2: ['#080b27', '#f3efe2', '#f6c95c'],
};
const SECNAME = { H: 'Hook · the people building AI are building bunkers', 1: 'Station 1 · the bomb', 2: 'Station 2 · the machine', 3: 'Station 3 · the chaos', 4: 'Station 4 · us (Rushkoff, floor plans)', M: 'Subscribe 1 · both sides of the door', 5: 'The trail · the turn · what would make it unnecessary', 6: 'The end · the lights of the Earth', A2: 'Subscribe 2 · end screen' };

function wrapWords(ctx, words, size, maxW) {
  ctx.font = `${size}px "Instrument Serif"`; const sp = ctx.measureText(' ').width, lines = []; let cur = [], w = 0;
  for (const o of words) { const ww = ctx.measureText(o.w).width; if (cur.length && w + sp + ww > maxW) { lines.push(cur); cur = []; w = 0; } w += (cur.length ? sp : 0) + ww; cur.push(o); }
  if (cur.length) lines.push(cur); return lines;
}
export const stubShot = (R, line) => (ctx, t, s) => {
  const [g, m, acc] = PAL[line.sec] || PAL.H;
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
