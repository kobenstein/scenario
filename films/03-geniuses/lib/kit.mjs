// Shared helpers for film 03: VO timing lookup, interview-clip screens, quote cards, lower thirds.
import fs from 'node:fs';
import { Image } from '@napi-rs/canvas';
import { W, H, C, rgba, clamp, lin, mix, sm, eout, eio, text, addGlow, glow, canvas } from '../engine.mjs';

const ROOT = '/mnt/project-files/scenario/film-03-geniuses/';
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// ---------- timing ----------
// T.S('04a', 'In London') = start of that phrase in segment 04a; T.E = its end; T.seg('04a') = {start,end}; T.clip('K1') = {start,end,...}
export function timing(file) {
  const TM = JSON.parse(fs.readFileSync(file, 'utf8'));
  function find(seg, phrase, nth = 0) {
    const ws = TM.words.filter((w) => w.sec === seg), q = phrase.split(/\s+/).map(norm).filter(Boolean);
    let hit = 0;
    for (let i = 0; i + q.length <= ws.length; i++) {
      if (q.every((p, j) => (j === q.length - 1 ? norm(ws[i + j].w).startsWith(p) : norm(ws[i + j].w) === p))) { if (hit++ === nth) return { s: ws[i].s, e: ws[i + q.length - 1].e }; }
    }
    throw new Error(`phrase not found in ${seg}: "${phrase}"`);
  }
  const clips = Object.fromEntries(TM.clips.map((c) => [c.id, c]));
  return {
    duration: TM.duration, words: TM.words, sections: TM.sections, clips,
    S: (seg, phrase, nth) => find(seg, phrase, nth).s,
    E: (seg, phrase, nth) => find(seg, phrase, nth).e,
    seg: (id) => TM.sections[id],
    clip: (id) => clips[id],
    // words of a segment between two phrases (for word-by-word reveals)
    W: (seg, from, to) => { const a = find(seg, from).s, b = to ? find(seg, to).e : 1e9; return TM.words.filter((w) => w.sec === seg && w.s >= a - 1e-3 && w.e <= b + 1e-3); },
  };
}

// ---------- interview clips ----------
const CLIPS = JSON.parse(fs.readFileSync(ROOT + 'audio/clips.json', 'utf8'));
const frameCache = new Map();
function clipFrame(id, k) {
  const f = `${ROOT}clips/${id}/f${String(k).padStart(5, '0')}.jpg`;
  if (!fs.existsSync(f)) return null;
  if (frameCache.size > 40) frameCache.clear();
  if (!frameCache.has(f)) { const im = new Image(); im.src = fs.readFileSync(f); frameCache.set(f, im); }
  return frameCache.get(f);
}
export const clipInfo = (id) => {
  const c = CLIPS[id]; const parts = c.who.replace(/\s*\(.*?\)/g, '').split(',').map((x) => x.trim());
  return { name: parts[0], source: parts.slice(1, -1).join(', ') || parts[1] || '', date: parts[parts.length - 1], quote: c.quote };
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
  const k = Math.floor(clamp(t - c.start, 0, c.end - c.start) * 30) + 1;
  const fr = clipFrame(id, k);
  if (fr) {
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
export function source(ctx, t, t0, t1, s, { x = 110, y = 1000 } = {}) {
  const a = eout(lin(t0, t0 + .6, t)) * (1 - lin(t1 - .5, t1, t)); if (a <= 0) return;
  text(ctx, s.toUpperCase(), x, y, { size: 17, weight: 600, color: C.muted, alpha: a, spacing: 4 });
}
