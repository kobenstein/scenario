// Motion-design scenes for film 02 v2 ("the curve is going vertical"): the line of cards, quote pages, the loop.
// Each export returns draw(ctx, t, shot). Times are film seconds.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, sine, back, drift, prng, sky, addGlow, text, label, glowLine, samples } from '../engine.mjs';

// ---------- small helpers ----------
function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
// draw image cropped to fill a w×h box (cover), optional focus fx,fy in 0..1
function cover(ctx, im, x, y, w, h, fx = .5, fy = .5) {
  const s = Math.max(w / im.width, h / im.height), sw = w / s, sh = h / s;
  ctx.drawImage(im, clamp((im.width - sw) * fx, 0, im.width - sw), clamp((im.height - sh) * fy, 0, im.height - sh), sw, sh, x, y, w, h);
}
// word wrap for a given font size; returns lines of word indexes
function wrap(ctx, words, size, font, maxW) {
  ctx.font = `${size}px "${font}"`;
  const lines = []; let cur = [], w = 0; const sp = ctx.measureText(' ').width;
  words.forEach((wd, i) => {
    const ww = ctx.measureText(wd).width;
    if (cur.length && w + sp + ww > maxW) { lines.push(cur); cur = []; w = 0; }
    w += (cur.length ? sp : 0) + ww; cur.push(i);
  });
  if (cur.length) lines.push(cur);
  return lines;
}

// ============ the line of cards ============
// cfg: { cards: [{ t (drop time), x (world units), img, year (big label), title (small), gap (label for gap before it), fx, fy }],
//        view: [{ t, x0, x1 }] world window keyframes, yMax (cumulative scale), counter: { t0, t1, from, to, fmt } optional,
//        bg: optional draw(ctx,t,s) behind, tail: { t, label } (final rise to near-vertical) }
// The curve is the running count of "firsts": each landing card lifts it one step. Shrinking gaps bend it upward.
export const cardLine = (cfg) => {
  const cards = cfg.cards, n = cards.length;
  const CW = cfg.cardW ?? 230, CH = cfg.cardH ?? 172;
  return (ctx, t, s) => {
    if (cfg.bg) cfg.bg(ctx, t, s); else sky(ctx, t, { stars: .55 });
    // world window
    const V = cfg.view; let i = 0; while (i < V.length - 1 && t > V[i + 1].t) i++;
    const v0 = V[i], v1 = V[Math.min(i + 1, V.length - 1)];
    const u = v1 === v0 ? 0 : eio(lin(v1.t - (v1.d ?? 2.2), v1.t, t));
    const wx0 = mix(v0.x0, v1.x0, u) + drift(t, (v0.x1 - v0.x0) * .004), wx1 = mix(v0.x1, v1.x1, u);
    const yMaxA = mix(v0.y ?? n, v1.y ?? n, u);
    const L = 150, R = W - 150, B = H - 190, T = 150;
    const X = (x) => mix(L, R, (x - wx0) / (wx1 - wx0));
    const lift = (k, tt) => { let h = 0; for (let j = 0; j < n; j++) h += eout(lin(cards[j].t + .35, cards[j].t + 1.1, tt)); return h; };
    const Y = (h) => B - h / yMaxA * (B - T);
    // axis + faint grid
    ctx.save(); ctx.strokeStyle = rgba(C.muted, .22); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, B); ctx.lineTo(W, B); ctx.stroke(); ctx.restore();
    if (cfg.ticks) for (const tk of cfg.ticks) { const x = X(tk.x); if (x < -100 || x > W + 100) continue; ctx.fillStyle = rgba(C.muted, .35); ctx.fillRect(x - 1, B, 2, 14); text(ctx, tk.label, x, B + 48, { size: 28, font: 'Instrument Serif', color: C.muted, align: 'center', alpha: .8 }); }
    // the curve: staircase smoothed, drawn up to the newest landed card
    const pts = [[cfg.x0 ?? cards[0].x - (cards[1] ? (cards[1].x - cards[0].x) * .5 : 10), 0]];
    let landed = 0;
    for (let j = 0; j < n; j++) {
      const c = cards[j], a = eout(lin(c.t + .35, c.t + 1.1, t));
      if (t < c.t + .35) break;
      landed = j + 1;
      pts.push([c.x, j + a]);
    }
    if (cfg.tail && t > cfg.tail.t) { const a = eio(lin(cfg.tail.t, cfg.tail.t + 2.5, t)); const last = pts[pts.length - 1]; pts.push([last[0] + (cfg.tail.dx ?? 0) * a, last[1] + (cfg.tail.dy ?? 6) * a]); }
    const P = [];
    for (let j = 0; j < pts.length - 1; j++) {
      const [xa, ya] = pts[j], [xb, yb] = pts[j + 1];
      for (let q = 0; q <= 16; q++) { const v = q / 16; P.push([X(mix(xa, xb, v)), Y(mix(ya, yb, sm(v)))]); }
    }
    if (P.length > 1) glowLine(ctx, P, 1, { width: 5, glowW: 26, color: cfg.color ?? C.cyan });
    // gap labels
    for (let j = 1; j < n; j++) {
      const c = cards[j]; if (!c.gap) continue;
      const a = eout(lin(c.t - 1.6, c.t - .9, t)) * (1 - lin(c.t + (c.gapHold ?? 2.4), c.t + (c.gapHold ?? 2.4) + .6, t)); if (a <= 0) continue;
      const xa = X(cards[j - 1].x), xb = X(c.x), y = B + 100;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = rgba(C.amber, .85); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(xa, y - 10); ctx.lineTo(xa, y); ctx.lineTo(xb, y); ctx.lineTo(xb, y - 10); ctx.stroke(); ctx.restore();
      text(ctx, c.gap, (xa + xb) / 2, y + 44, { size: 36, font: 'Instrument Serif Italic', color: C.amber, align: 'center', alpha: a });
    }
    // cards: drop in, settle above their point on the curve; later cards stack when crowded
    const placed = [];
    for (let j = 0; j < n; j++) {
      const c = cards[j]; if (t < c.t - .2) continue;
      const f = lin(c.t - .2, c.t + .45, t), land = eout(f), bump = Math.sin(Math.PI * lin(c.t + .45, c.t + .8, t)) * 10;
      const k = (c.scale ?? 1) * (j < landed - 3 && cfg.shrinkOld ? .72 : 1);
      const w = CW * k, h = CH * k;
      let cx = X(c.x), cy = Y(j + 1) - h / 2 - 40;
      for (const p of placed) if (Math.abs(p.x - cx) < w * .9 && Math.abs(p.y - cy) < h * .9) cy = Math.min(cy, p.y - h * .62);
      cy = Math.max(cy, h / 2 + 70);
      placed.push({ x: cx, y: cy });
      const y = mix(cy - 520, cy, land) + bump, rot = (1 - land) * (j % 2 ? .25 : -.22) + (c.rot ?? (j % 2 ? .035 : -.03));
      ctx.save(); ctx.translate(cx, y); ctx.rotate(rot); ctx.globalAlpha = clamp(f * 3);
      ctx.fillStyle = 'rgba(0,0,0,.45)'; rrect(ctx, -w / 2 + 8, -h / 2 + 12, w, h + 54 * k, 10); ctx.fill();
      ctx.fillStyle = '#f1e6cf'; rrect(ctx, -w / 2 - 8, -h / 2 - 8, w + 16, h + 62 * k, 10); ctx.fill();
      if (c.img) { ctx.save(); rrect(ctx, -w / 2, -h / 2, w, h, 6); ctx.clip(); cover(ctx, c.img, -w / 2, -h / 2, w, h, c.fx, c.fy); ctx.restore(); }
      text(ctx, c.year, 0, h / 2 + 40 * k, { size: 34 * k, font: 'Instrument Serif', color: '#2a2230', align: 'center' });
      ctx.restore();
      if (c.title) { const ta = eout(lin(c.t + .5, c.t + 1.1, t)) * (1 - lin(c.t + (c.hold ?? 3.5), c.t + (c.hold ?? 3.5) + .6, t)); text(ctx, c.title, cx, y - h / 2 - 34, { size: 28, color: C.cream, align: 'center', alpha: ta, weight: 500 }); }
      addGlow(ctx, cx, Y(j + 1), 80, .55 * Math.exp(-Math.max(0, t - c.t - .4) * 2.5) * (t > c.t + .35 ? 1 : 0), C.amber, '#fff3dd');
    }
    // date counter
    if (cfg.counter) {
      const k = cfg.counter, a = lin(k.t0, k.t0 + .6, t) * (1 - lin(k.hide ?? 1e9, (k.hide ?? 1e9) + .6, t));
      if (a > 0) {
        let val = k.from; for (const c of cards) if (t > c.t) val = c.date ?? val;
        text(ctx, k.top.toUpperCase(), 100, 96, { size: 20, weight: 600, color: C.muted, alpha: a, spacing: 7 });
        text(ctx, val, 96, 170, { size: 72, font: 'Instrument Serif', alpha: a });
      }
    }
    if (cfg.fx) cfg.fx(ctx, t, s, X, Y);
  };
};

// ============ a real quote, set on a page; words light up as the narrator reads them ============
// q: { words: [{w, s}] (film times), who, role, date, source, hi: [word indexes or substrings to mark amber], bg, x, w, size, tilt }
export const quotePage = (q) => (ctx, t, s) => {
  if (q.bg) { q.bg(ctx, t, s); ctx.fillStyle = 'rgba(7,9,24,.62)'; ctx.fillRect(0, 0, W, H); } else sky(ctx, t, { stars: .4 });
  const ws = q.words.map((o) => o.w), size = q.size ?? 64, font = 'Instrument Serif';
  const PWd = q.w ?? 1240, cx = q.x ?? W / 2;
  const lines = wrap(ctx, ws, size, font, PWd - 160);
  const lh = size * 1.22, PH = lines.length * lh + 260;
  const a = eout(lin(s.a + .1, s.a + .8, t)), z = mix(.96, 1.02, sine(lin(s.a, s.b, t)));
  ctx.save(); ctx.translate(cx + drift(t, 5, 1), H / 2 + drift(t, 4, 2) + (1 - a) * 40); ctx.rotate((q.tilt ?? -.012) + drift(t, .003, 3)); ctx.scale(z, z); ctx.globalAlpha = a;
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(-PWd / 2 + 16, -PH / 2 + 20, PWd, PH);
  const pg = ctx.createLinearGradient(0, -PH / 2, 0, PH / 2); pg.addColorStop(0, '#f6ecd6'); pg.addColorStop(1, '#e4d3b2');
  ctx.fillStyle = pg; ctx.fillRect(-PWd / 2, -PH / 2, PWd, PH);
  const ink = '#241c2c', x0 = -PWd / 2 + 80;
  text(ctx, (q.source || '').toUpperCase(), x0, -PH / 2 + 70, { size: 20, weight: 600, color: '#7a6a72', spacing: 6 });
  ctx.fillStyle = 'rgba(36,28,44,.25)'; ctx.fillRect(x0, -PH / 2 + 92, PWd - 160, 2);
  ctx.font = `${size}px "${font}"`; const sp = ctx.measureText(' ').width;
  const hi = new Set((q.hi || []).flatMap((h) => typeof h === 'number' ? [h] : ws.map((w, i) => (w.toLowerCase().replace(/[^a-z0-9-]/g, '') === h ? i : -1)).filter((i) => i >= 0)));
  lines.forEach((ln, li) => {
    let x = x0; const y = -PH / 2 + 170 + li * lh;
    ln.forEach((wi) => {
      const o = q.words[wi], wa = mix(.16, 1, eout(lin(o.s - .05, o.s + .25, t))), wd = ctx.measureText(o.w).width;
      text(ctx, o.w, x, y, { size, font, color: hi.has(wi) && t > o.s ? '#b4631d' : ink, alpha: wa });
      if (hi.has(wi)) { const u = eout(lin(o.s, o.s + .4, t)); ctx.fillStyle = rgba(C.amber, .8); ctx.fillRect(x, y + 10, wd * u, 4); }
      x += wd + sp;
    });
  });
  const ya = PH / 2 - 52;
  text(ctx, q.who, x0, ya, { size: 34, font: 'Instrument Serif', color: ink });
  if (q.role || q.date) text(ctx, [q.role, q.date].filter(Boolean).join(' · ').toUpperCase(), PWd / 2 - 80, ya, { size: 18, weight: 600, color: '#7a6a72', align: 'right', spacing: 4 });
  ctx.restore();
};

// ============ the loop that bends the curve ============
// k: n0..n4 (node light times), close (loop complete), gap (open segment appears)
export const loop = (k, nodes = ['cheaper', 'more agents', 'more finds', 'more money', 'more chips']) => (ctx, t, s) => {
  sky(ctx, t, { stars: .4 });
  const cx = 720, cy = 540, r = 300, n = nodes.length, rot = (t - s.a) * .05;
  const P = (i) => { const a = -Math.PI / 2 + i / n * Math.PI * 2 + rot; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
  const gapA = k.gap ? eio(lin(k.gap, k.gap + 1.2, t)) : 0;
  for (let i = 0; i < n; i++) {
    const t0 = k.n[i] ?? s.a + i, t1 = k.n[(i + 1) % n] ?? t0 + 1, [x0, y0] = P(i), [x1, y1] = P(i + 1);
    const segT = i === n - 1 ? (k.close ?? t1) : t1;
    const u = eio(lin(segT - .9, segT, t)), isGap = i === n - 1;
    const arc = samples((v) => { const a = -Math.PI / 2 + (i + .14 + v * .72) / n * Math.PI * 2 + rot; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }, 0, 1, 40);
    glowLine(ctx, arc, u, { width: 4, glowW: 18, alpha: isGap ? 1 - gapA * .75 : 1, dash: isGap && gapA > 0 ? [10, 16] : null, head: u < 1 });
  }
  for (let i = 0; i < n; i++) {
    const t0 = k.n[i] ?? s.a + i, a = eout(lin(t0, t0 + .5, t)), [x, y] = P(i);
    addGlow(ctx, x, y, 70, .5 * a + .3 * Math.exp(-Math.max(0, t - t0) * 2) * a, i === 0 ? C.amber : C.cyan, '#fff');
    text(ctx, nodes[i], x, y + (y < cy ? -50 : 70), { size: 44, font: 'Instrument Serif', align: 'center', alpha: a });
  }
  // the curve it drives, on the right
  const g = lin(k.close ?? s.a + 6, (k.close ?? s.a + 6) + 3, t);
  const pts = samples((v) => [mix(1250, 1780, v), 860 - (Math.pow(2, v * 6) - 1) / 63 * 620], 0, 1, 100);
  glowLine(ctx, pts, eio(g), { width: 5, glowW: 24 });
  if (gapA > 0) label(ctx, t, k.gap + .4, cx, cy + 20, 'not closed', 'yet', { align: 'center', color: C.amber });
};
