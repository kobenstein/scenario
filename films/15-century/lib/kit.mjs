// Shared helpers (Film 5 → 15): VO timing lookup (phrase anchors), quote cards, lower thirds.
// (Interview-clip helpers are kept from film 03 but Film 5 has no clips: everything is guarded.)
import fs from 'node:fs';
import { loadImage } from '@napi-rs/canvas';
import { W, H, C, rgba, clamp, lin, mix, sm, eout, eio, text, addGlow, glow, canvas } from '../engine.mjs';

export const ROOT = (process.env.F15ROOT || '/mnt/project-files/scenario/film-jahrhundert/').replace(/\/?$/, '/'); // Film 15 data root: audio/timing.json, segments.json (small, read only). Renders and frames go to the scratchpad, never here.
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// ---------- timing ----------
// Anchor ONLY via phrases, never via seconds: the provisional timing.json (tools/provisional_timing.py) and the real one
// (audio/build_vo.py) share one format, so code written against one runs unchanged on the other.
//   id = a section or a VO segment id; both work everywhere. Sections: 'H' (= 'H0'), '0'…'7' (= '00'…'07');
//   segments of the real VO: 'H0a', '00a', '01a', '02a', '02b', '02c', '03a', '03b', '04a', '04b', '05a', '05b', '06a', '06b', '07a', '07b'.
//   Prefer section ids ('2', 'H'): they survive any re-split of the VO segments.
//   T.S('H', 'buzzes')        start (s) of that phrase in the section      T.E(…) its end
//   T.S('1', 'Yet', 1)        nth = 1 → the second occurrence in that section;  T.S('3') / T.E('3') = section start / end
//   T.W('0', 'This will', 'many')  word objects [{w,s,e,sec}] from…to (inclusive) for word-by-word reveals
//   T.seg('3')                {start, end} of a section (or segment)      T.secs = section ids in film order
//   T.line('2', 'take')       the sentence containing the phrase: {text, s, e, words}
//   T.lines('2')              all sentences of a section;  T.lineAt(t) the sentence being spoken (or last spoken) at t
//   T.has('2', 'take')        true/false (no throw), for optional beats that may vanish in a script revision
export function timing(file) {
  const TM = JSON.parse(fs.readFileSync(file, 'utf8'));
  TM.clips = TM.clips || [];
  const segSec = {};
  for (const [id, s] of Object.entries(TM.sections)) segSec[id] = s.sec ?? id;
  // canonical section id: 'H0'/'H'/'h' -> 'H', '00' -> '0', '07' -> '7'; segment ids like '02b' stay themselves
  const canon = (x) => { x = String(x); if (/^h0?$/i.test(x)) return 'H'; if (/^\d+$/.test(x)) return String(Number(x)); return x; };
  const secOf = (seg) => canon(segSec[seg] ?? seg);
  const inSec = (w, id) => w.sec === id || segSec[w.sec] === id || secOf(w.sec) === canon(id);
  const wordsOf = (id) => TM.words.filter((w) => inSec(w, id));
  function find(seg, phrase, nth = 0) {
    const ws = wordsOf(seg), q = String(phrase).split(/\s+/).map(norm).filter(Boolean);
    let hit = 0;
    for (let i = 0; i + q.length <= ws.length; i++) {
      if (q.every((p, j) => (j === q.length - 1 ? norm(ws[i + j].w).startsWith(p) : norm(ws[i + j].w) === p))) { if (hit++ === nth) return { s: ws[i].s, e: ws[i + q.length - 1].e, i }; }
    }
    const txt = ws.map((w) => w.w).join(' ');
    throw new Error(`phrase not found in section ${seg}: "${phrase}"${nth ? ` (#${nth})` : ''}. Section text: ${txt.slice(0, 160)}…`);
  }
  // sections in film order (aggregates segments that share a .sec)
  const agg = {};
  for (const [id, s] of Object.entries(TM.sections)) {
    for (const k of new Set([id, segSec[id], canon(segSec[id])])) { const a = agg[k] || (agg[k] = { start: 1e9, end: -1e9 }); a.start = Math.min(a.start, s.start); a.end = Math.max(a.end, s.end); }
  }
  const secs = [...new Set(Object.values(segSec).map(canon))].sort((a, b) => agg[a].start - agg[b].start);
  // sentences: split words at . ? ! (a closing quote after the mark is fine)
  const sentences = (ws) => { const out = []; let cur = []; for (const w of ws) { cur.push(w); if (/[.?!]["”’')\]]*$/.test(w.w)) { out.push(cur); cur = []; } } if (cur.length) out.push(cur); return out.map((c) => ({ text: c.map((w) => w.w).join(' '), s: c[0].s, e: c[c.length - 1].e, words: c, sec: secOf(c[0].sec) })); };
  const linesCache = {}; const lines = (id) => linesCache[id] || (linesCache[id] = sentences(wordsOf(id)));
  const allLines = secs.flatMap((id) => lines(id));
  const T = {
    duration: TM.duration, words: TM.words, sections: TM.sections, clips: Object.fromEntries(TM.clips.map((c) => [c.id, c])), secs,
    S: (seg, phrase, nth) => (phrase == null ? T.seg(seg).start : find(seg, phrase, nth).s),   // no phrase → section start
    E: (seg, phrase, nth) => (phrase == null ? T.seg(seg).end : find(seg, phrase, nth).e),     // no phrase → section end
    at: (seg, phrase, nth) => (phrase == null ? T.seg(seg).start : find(seg, phrase, nth).s),
    has: (seg, phrase, nth) => { try { find(seg, phrase, nth); return true; } catch { return false; } },
    seg: (id) => agg[id] || agg[canon(id)] || (() => { throw new Error('unknown section ' + id); })(),
    canon,
    clip: (id) => TM.clips.find((c) => c.id === id),
    W: (seg, from, to) => { const a = from == null ? -1 : find(seg, from).s, b = to ? find(seg, to).e : 1e9; return wordsOf(seg).filter((w) => w.s >= a - 1e-3 && w.e <= b + 1e-3); },
    lines,
    line: (seg, phrase, nth) => { const { s } = find(seg, phrase, nth); return lines(seg).find((l) => s >= l.s - 1e-3 && s <= l.e + 1e-3); },
    lineAt: (t) => { let cur = allLines[0]; for (const l of allLines) { if (l.s - .35 <= t) cur = l; else break; } return cur; },
    secAt: (t) => { let cur = secs[0]; for (const id of secs) if (agg[id].start - 1 <= t) cur = id; return cur; },
    provisional: !!TM.provisional,
  };
  return T;
}

// ---------- interview clips ----------
const CLIPS = fs.existsSync(ROOT + 'audio/clips.json') ? JSON.parse(fs.readFileSync(ROOT + 'audio/clips.json', 'utf8')) : {}; // Film 5: no clips
const frameCache = new Map();
const framePath = (id, k) => `${ROOT}clips/${id}/f${String(CLIPS[id].maxFrame ? Math.min(k, CLIPS[id].maxFrame) : k).padStart(5, '0')}.jpg`;
const frameIndex = (c, t) => Math.floor(clamp(t - c.start, 0, c.end - c.start) * 30) + 1;
// JPEG decoding in @napi-rs/canvas is async, so the renderer awaits prepareClips(T, t) before each frame;
// clipFrame then only reads the decoded image from the cache.
export async function prepareClips(T, t) {
  for (const c of Object.values(T.clips)) {
    if (!CLIPS[c.id] || t < c.start - .7 || t > c.end + .7 || CLIPS[c.id].card) continue;
    const f = framePath(c.id, frameIndex(c, t));
    if (frameCache.has(f) || !fs.existsSync(f)) continue;
    if (frameCache.size > 40) frameCache.delete(frameCache.keys().next().value);
    frameCache.set(f, await loadImage(f));
  }
}
// the decoded frame k (1-based) of clip id, or null while it is not loaded (prepareClips loads ±0.7 s around the clip window)
export function clipFrame(id, k) { return CLIPS[id] ? frameCache.get(framePath(id, k)) || null : null; }
export const clipInfo = (id) => {
  const c = CLIPS[id] || {};
  if (c.who) { // Film 3/5 format: "Name (role), source, date"
    const parts = c.who.replace(/\s*\(.*?\)/g, '').split(',').map((x) => x.trim());
    return { name: parts[0], role: '', source: parts.slice(1, -1).join(', ') || parts[1] || '', date: parts[parts.length - 1], quote: c.quote, card: !!c.card };
  }
  // Film 6 format (tools/build.py): name, role, source, date, words
  return { name: c.name || id, role: c.role || '', source: c.source || '', date: c.date || '', quote: c.quote || c.words || '', card: !!c.card };
};
// Draw an interview clip into a screen rectangle (x, y, w, h) that belongs to the scene (TV, canvas, monitor).
// Uses the real clip frames from clips/<id>/f00001.jpg… (30 fps, extracted once the YouTube download works);
// until then a placeholder: speaker silhouette + the quote word by word, so the timing already works.
// o.glow = light spill from the screen into the scene, o.bezel = draw a thin frame.
export function clipScreen(ctx, t, T, id, x, y, w, h, o = {}) {
  const c = T.clip(id), info = clipInfo(id), u = (t - c.start) / (c.end - c.start);
  const on = sm(lin(c.start - .6, c.start, t)) * (1 - sm(lin(c.end, c.end + .6, t)));
  ctx.save();
  ctx.beginPath(); ctx.roundRect(x, y, w, h, o.radius ?? 6); ctx.clip();
  ctx.fillStyle = '#05060f'; ctx.fillRect(x, y, w, h);
  const fr = info.card ? null : clipFrame(id, frameIndex(c, t));
  if (info.card) {
    // quote card (source not downloadable): the quote writes itself onto the screen, word by word
    const g = ctx.createRadialGradient(x + w * .5, y + h * .4, 0, x + w * .5, y + h * .4, w * .75);
    g.addColorStop(0, rgba('#1c2a5c', on)); g.addColorStop(1, rgba('#060818', on)); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    const words = info.quote.split(' '), n = words.length, ws = CLIPS[id].wordStarts;
    // read aloud: each word appears as the voice says it; otherwise an even reveal
    const shown = ws ? ws.reduce((k, s0, i) => k + clamp((t - c.start - s0) / .25), 0) : clamp((t - c.start - .3) / (c.end - c.start - 2.2)) * n;
    const size = Math.round(h * .1), lh = size * 1.28, maxW = w * .8; ctx.font = `400 ${size}px "Instrument Serif"`;
    const lines = []; let cur = [];
    words.forEach((wd, i) => { const nx = [...cur, [wd, i]]; if (cur.length && ctx.measureText(nx.map((q) => q[0]).join(' ')).width > maxW) { lines.push(cur); cur = [[wd, i]]; } else cur = nx; });
    if (cur.length) lines.push(cur);
    const y0 = y + h * .46 - (lines.length - 1) * lh / 2;
    text(ctx, '“', x + w * .1 - size * .2, y0 - lh * .55, { size: size * 2.2, font: 'Instrument Serif', color: C.amber, alpha: .8 * on });
    lines.forEach((ln, li) => {
      let xx = x + w * .1;
      for (const [wd, i] of ln) { const a = clamp(shown - i) * on; text(ctx, wd, xx, y0 + li * lh + (1 - a) * 6, { size, font: 'Instrument Serif', color: C.cream, alpha: a }); xx += ctx.measureText(wd + ' ').width; ctx.font = `400 ${size}px "Instrument Serif"`; }
    });
    text(ctx, `— ${info.name}`.toUpperCase(), x + w * .1, y0 + lines.length * lh + size * .3, { size: Math.round(size * .42), weight: 600, color: C.muted, alpha: on * sm(lin(c.start + 1, c.start + 2, t)), spacing: 4 });
  } else if (fr) {
    const s = Math.max(w / fr.width, h / fr.height), dw = fr.width * s, dh = fr.height * s;
    ctx.globalAlpha = on; ctx.drawImage(fr, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); ctx.globalAlpha = 1;
  } else {
    // placeholder: soft studio light, head-and-shoulders silhouette, breathing
    const g = ctx.createRadialGradient(x + w * .5, y + h * .35, 0, x + w * .5, y + h * .35, w * .7);
    g.addColorStop(0, rgba('#2a3a7a', .9 * on)); g.addColorStop(1, rgba('#070918', on)); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    const cx = x + w * .5 + Math.sin(t * .8) * w * .006, cy = y + h * .62, s = h / 600;
    ctx.fillStyle = rgba('#0b0d26', on);
    ctx.beginPath(); ctx.ellipse(cx, cy - 150 * s + Math.sin(t * 2.2) * 2 * s, 78 * s, 96 * s, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - 230 * s, y + h); ctx.bezierCurveTo(cx - 220 * s, cy - 10 * s, cx - 90 * s, cy - 40 * s, cx, cy - 40 * s); ctx.bezierCurveTo(cx + 90 * s, cy - 40 * s, cx + 220 * s, cy - 10 * s, cx + 230 * s, y + h); ctx.fill();
  }
  // scanline + glass sheen so the screen sits in the world
  ctx.globalAlpha = .06 * on; for (let yy = y; yy < y + h; yy += 4) { ctx.fillStyle = '#000'; ctx.fillRect(x, yy, w, 1.5); }
  ctx.globalAlpha = 1;
  const sh = ctx.createLinearGradient(x, y, x + w, y + h); sh.addColorStop(0, 'rgba(216,247,255,.07)'); sh.addColorStop(.5, 'rgba(216,247,255,0)'); ctx.fillStyle = sh; ctx.fillRect(x, y, w, h);
  ctx.restore();
  if (o.bezel !== false) { ctx.strokeStyle = rgba('#d8f7ff', .18 * on); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w, h, o.radius ?? 6); ctx.stroke(); }
  if (o.glow !== false) addGlow(ctx, x + w / 2, y + h / 2, Math.max(w, h) * .9, .12 * on, C.cyan, C.cyanWhite);
  return { on, u };
}
// Lower third for a clip: name + source/date, wipes in, outside the clip rect (screen space)
export function clipLabel(ctx, t, T, id, x = 110, y = 900) {
  const c = T.clip(id), info = clipInfo(id);
  const a = eout(lin(c.start + .2, c.start + .9, t)) * (1 - lin(c.end - .5, c.end, t)); if (a <= 0) return;
  ctx.fillStyle = rgba(C.amber, a); ctx.fillRect(x, y - 34 + (1 - a) * 14, 4, 74);
  text(ctx, info.name, x + 22, y + (1 - a) * 14, { size: 40, font: 'Instrument Serif', alpha: a });
  text(ctx, `${info.source} · ${info.date}`.toUpperCase(), x + 22, y + 34 + (1 - a) * 14, { size: 17, weight: 600, color: C.muted, alpha: a, spacing: 4 });
}
// Placeholder captions inside the clip (the real clip gets burned-in subtitles from the clip transcript later)
export function clipQuote(ctx, t, T, id, x, y, w, size = 34) {
  const c = T.clip(id), info = clipInfo(id), words = info.quote.split(' '), n = words.length;
  return; // the subtitle track carries the clip quote (subs.py), so no second copy inside the screen
  const u = clamp((t - c.start) / (c.end - c.start - .4)), shown = Math.ceil(u * n);
  const lines = []; let cur = '';
  ctx.font = `500 ${size}px "Inter"`;
  for (const wd of words.slice(0, shown)) { const nx = cur ? cur + ' ' + wd : wd; if (ctx.measureText(nx).width > w) { lines.push(cur); cur = wd; } else cur = nx; }
  if (cur) lines.push(cur);
  const a = sm(lin(c.start, c.start + .4, t)) * (1 - sm(lin(c.end, c.end + .4, t)));
  lines.slice(-2).forEach((ln, i, arr) => text(ctx, ln, x + w / 2, y - (arr.length - 1 - i) * size * 1.3, { size, align: 'center', alpha: a, color: C.cream }));
}

// ---------- quote card (written quote, in our voice) ----------
export function quoteCard(ctx, t, t0, t1, { quote, who, x = W / 2, y = H / 2, size = 64, w = 1300, hi = [] } = {}) {
  const a = eout(lin(t0, t0 + .7, t)) * (1 - lin(t1 - .5, t1, t)); if (a <= 0) return;
  ctx.font = `${size}px "Instrument Serif"`;
  const words = quote.split(' '), lines = []; let cur = '';
  for (const wd of words) { const nx = cur ? cur + ' ' + wd : wd; if (ctx.measureText(nx).width > w) { lines.push(cur); cur = wd; } else cur = nx; }
  if (cur) lines.push(cur);
  const y0 = y - (lines.length - 1) * size * .62;
  lines.forEach((ln, i) => text(ctx, ln, x, y0 + i * size * 1.24 + (1 - a) * 16, { size, font: 'Instrument Serif', align: 'center', alpha: a, color: hi.some((h) => ln.includes(h)) ? C.amber : C.cream }));
  if (who) text(ctx, who.toUpperCase(), x, y0 + lines.length * size * 1.24 + 30, { size: 18, weight: 600, color: C.muted, align: 'center', alpha: a, spacing: 5 });
}
// small source line, bottom left
export function source(ctx, t, t0, t1, s, { x = 110, y = 890 } = {}) { // y 890: above the burned-in subtitles (bottom 170 px)
  const a = eout(lin(t0, t0 + .6, t)) * (1 - lin(t1 - .5, t1, t)); if (a <= 0) return;
  text(ctx, s.toUpperCase(), x, y, { size: 17, weight: 600, color: C.muted, alpha: a, spacing: 4 });
}
