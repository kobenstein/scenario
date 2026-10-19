// The craft of an engraved share certificate / banknote: Film 5's motion-graphics language.
// Guilloche rosettes and borders (parametric, animatable: draw-on, rotate, morph, tighten into a point, unwind into any
// polyline such as a coastline), intaglio line shading that follows a form, microtext, an embossed seal and gold-foil glint
// in the film's amber. Static parts are rendered once into cached offscreen layers; per frame only transforms + glints.
//
//   guilloche(o) → { n, line(k, u = 1) → pts }        o: { R, A, B, n, m, lines, twist, squash, tighten 0..1, morph 0..1, n2, m2 }
//   rosette(ctx, x, y, o)          draws all lines; o.u (draw-on 0..1, staggered per line), o.rot, o.col, o.w, o.a, o.cache (true: static → layer)
//   gBorder(ctx, x, y, w, h, o)    woven guilloche band inside the rectangle; o: { band, lines, waves, col, w, a, u (draw-on) } (cached)
//   intaglio(ctx, x, y, w, h, o)   engraved shading: parallel lines bent by o.warp(x,y), swelling with o.tone(x,y) 0..1 (cached by o.key)
//   microtext(ctx, x, y, w, text, o) / microRing(ctx, cx, cy, r, text, o)   tiny repeated caps that read as a line
//   seal(ctx, x, y, r, t, o)       embossed scalloped seal; o.foil (amber foil + glint), o.label (ring microtext), o.emblem 'seed'|'sun'
//   foilGlint(ctx, path, t, o)     a moving specular band clipped to a Path2D (amber foil catching light)
//   certificate(ctx, t, o)         the full "YOUR SHARE" certificate as one cached layer + live glint; o: { x, y, s, rot, title, name ('' = empty line) }
//   unwind(from, to, u, o)         morph one polyline into another (resampled), sweeping from one end: a guilloche line → coastline
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, canvas, eout, eio, lin, text } from '../engine.mjs';
import { roughPath, stipple, vnoise } from './art.mjs';

export const INK = '#1f2a3a', AMBER = '#ffb35c', FOIL = ['#7a3b17', '#c87a2c', '#ffb35c', '#ffe2a8', '#c87a2c'], PAPER = '#efe6cf';
const TAU = Math.PI * 2;
const LAYERS = new Map();
function cached(key, w, h, draw) { if (!LAYERS.has(key)) { const [c, x] = canvas(Math.ceil(w), Math.ceil(h)); draw(x); LAYERS.set(key, c); } return LAYERS.get(key); }

// ---------- guilloche math ----------
export function guilloche(o = {}) {
  const R = o.R ?? 220, A = o.A ?? 34, B = o.B ?? 14, lines = o.lines ?? 28, sq = o.squash ?? 1, tw = o.twist ?? 0;
  const tight = eio(clamp(o.tighten ?? 0)), mo = clamp(o.morph ?? 0), n = mix(o.n ?? 18, o.n2 ?? (o.n ?? 18), mo), m = mix(o.m ?? 7, o.m2 ?? (o.m ?? 7), mo);
  const k0 = 1 - tight, steps = o.steps ?? 720;
  const line = (k, u = 1) => {
    const ph = k * TAU / lines, pts = [], N = Math.max(2, Math.round(steps * clamp(u)));
    for (let i = 0; i <= N; i++) {
      const th = i / steps * TAU, r = (R + A * Math.sin(n * th + ph) + B * Math.sin(m * th - ph * .5 + tw)) * k0;
      const a = th + tight * Math.PI * 1.5;
      pts.push([Math.cos(a) * r, Math.sin(a) * r * sq]);
    }
    return pts;
  };
  return { lines, line };
}
function strokePts(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); }
export function rosette(ctx, x, y, o = {}) {
  const u = clamp(o.u ?? 1), col = o.col || INK, w = o.w ?? 1, a = o.a ?? .85;
  const draw = (g, cx, cy) => {
    const G = guilloche(o); g.save(); g.translate(cx, cy); g.strokeStyle = col; g.lineWidth = w; g.globalAlpha = a; g.lineJoin = 'round';
    for (let k = 0; k < G.lines; k++) { const uk = clamp(u * 1.35 - k / G.lines * .35); if (uk > 0) strokePts(g, G.line(k, uk)); }
    g.restore();
  };
  const ext = ((o.R ?? 220) + (o.A ?? 34) + (o.B ?? 14)) + 6;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  if (o.cache && u >= 1 && !(o.tighten > 0)) {
    const key = 'ros' + JSON.stringify([o.R, o.A, o.B, o.n, o.m, o.n2, o.m2, o.morph, o.lines, o.squash, o.twist, col, w, a]);
    const c = cached(key, ext * 2, ext * 2, (g) => draw(g, ext, ext)); ctx.drawImage(c, -ext, -ext);
  } else draw(ctx, 0, 0);
  ctx.restore();
}
// rounded-rectangle perimeter as a function of arc length → [x, y, nx, ny]
function perimeter(w, h, r) {
  const segs = [], L = []; let tot = 0;
  const add = (len, f) => { segs.push([tot, len, f]); tot += len; };
  add(w - 2 * r, (q) => [r + q * (w - 2 * r), 0, 0, 1]);
  add(Math.PI * r / 2, (q) => { const a = -Math.PI / 2 + q * Math.PI / 2; return [w - r + Math.cos(a) * r, r + Math.sin(a) * r, -Math.cos(a), -Math.sin(a)]; });
  add(h - 2 * r, (q) => [w, r + q * (h - 2 * r), -1, 0]);
  add(Math.PI * r / 2, (q) => { const a = q * Math.PI / 2; return [w - r + Math.cos(a) * r, h - r + Math.sin(a) * r, -Math.cos(a), -Math.sin(a)]; });
  add(w - 2 * r, (q) => [w - r - q * (w - 2 * r), h, 0, -1]);
  add(Math.PI * r / 2, (q) => { const a = Math.PI / 2 + q * Math.PI / 2; return [r + Math.cos(a) * r, h - r + Math.sin(a) * r, -Math.cos(a), -Math.sin(a)]; });
  add(h - 2 * r, (q) => [0, h - r - q * (h - 2 * r), 1, 0]);
  add(Math.PI * r / 2, (q) => { const a = Math.PI + q * Math.PI / 2; return [r + Math.cos(a) * r, r + Math.sin(a) * r, -Math.cos(a), -Math.sin(a)]; });
  return { tot, at: (s) => { s = ((s % tot) + tot) % tot; for (const [s0, len, f] of segs) if (s <= s0 + len) return f((s - s0) / (len || 1)); return segs[0][2](0); } };
}
export function gBorder(ctx, x, y, w, h, o = {}) {
  const band = o.band ?? 34, lines = o.lines ?? 9, waves = o.waves ?? 120, col = o.col || INK, lw = o.w ?? .9, a = o.a ?? .8, u = clamp(o.u ?? 1);
  const draw = (g) => {
    const P = perimeter(w - band, h - band, o.radius ?? 18), N = Math.round(P.tot / 2.2);
    g.save(); g.translate(band / 2, band / 2); g.strokeStyle = col; g.lineWidth = lw; g.globalAlpha = a;
    for (let i = 0; i < lines; i++) {
      const ph = i / lines * TAU; g.beginPath();
      for (let j = 0; j <= N * u; j++) {
        const s = j / N * P.tot, [px, py, nx, ny] = P.at(s), q = s / P.tot * waves * TAU;
        const d = band * .42 * (Math.sin(q + ph) * .75 + Math.sin(q * 2.03 - ph * 1.5) * .25);
        j ? g.lineTo(px + nx * d, py + ny * d) : g.moveTo(px + nx * d, py + ny * d);
      }
      g.stroke();
    }
    // two framing hairlines
    g.globalAlpha = a; g.lineWidth = lw * 1.4;
    for (const off of [-band * .5, band * .5]) { g.beginPath(); for (let j = 0; j <= N; j++) { const [px, py, nx, ny] = P.at(j / N * P.tot); j ? g.lineTo(px + nx * off, py + ny * off) : g.moveTo(px + nx * off, py + ny * off); } g.closePath(); g.stroke(); }
    g.restore();
  };
  if (u >= 1) { const c = cached('brd' + JSON.stringify([w, h, band, lines, waves, col, lw, a, o.radius]), w, h, draw); ctx.drawImage(c, x, y); }
  else { ctx.save(); ctx.translate(x, y); draw(ctx); ctx.restore(); }
}
// engraved shading: lines across the box at o.angle, bent by warp, line width swelling with tone (0 = paper, 1 = full ink)
export function intaglio(ctx, x, y, w, h, o = {}) {
  const draw = (g) => {
    const gap = o.gap ?? 4.2, maxW = o.maxW ?? gap * .78, ang = o.angle ?? -.18, c = Math.cos(ang), s = Math.sin(ang);
    const R = Math.hypot(w, h) / 2 + gap, cx = w / 2, cy = h / 2, tone = o.tone || (() => .5), warp = o.warp || (() => 0);
    g.fillStyle = o.col || INK; g.globalAlpha = o.a ?? .9;
    for (let d = -R; d <= R; d += gap) {
      const L = [], Rr = [];
      for (let q = -R; q <= R; q += 3) {
        const px = cx + c * q - s * d, py = cy + s * q + c * d; if (px < -4 || px > w + 4 || py < -4 || py > h + 4) { if (L.length) break; continue; }
        const off = warp(px, py), tw = clamp(tone(px, py)) * maxW / 2;
        const X = px - s * off, Y = py + c * off; L.push([X - s * tw, Y + c * tw]); Rr.push([X + s * tw, Y - c * tw]);
      }
      if (L.length < 2) continue;
      g.beginPath(); g.moveTo(L[0][0], L[0][1]); for (const p of L) g.lineTo(p[0], p[1]); for (let i = Rr.length - 1; i >= 0; i--) g.lineTo(Rr[i][0], Rr[i][1]); g.closePath(); g.fill();
    }
  };
  if (o.key) ctx.drawImage(cached('int' + o.key, w, h, draw), x, y); else { ctx.save(); ctx.translate(x, y); draw(ctx); ctx.restore(); }
}
export function microtext(ctx, x, y, w, str, o = {}) {
  const size = o.size ?? 6.5; ctx.save(); ctx.font = `600 ${size}px "Inter"`; ctx.fillStyle = o.col || INK; ctx.globalAlpha = o.a ?? .75; ctx.textBaseline = 'middle';
  try { ctx.letterSpacing = (o.spacing ?? .6) + 'px'; } catch { }
  const unit = str.endsWith(' ') ? str : str + ' · ', uw = ctx.measureText(unit).width; let xx = x;
  ctx.beginPath(); ctx.rect(x, y - size, w, size * 2); ctx.clip();
  while (xx < x + w) { ctx.fillText(unit, xx, y); xx += uw; }
  ctx.restore();
}
export function microRing(ctx, cx, cy, r, str, o = {}) {
  const size = o.size ?? 7; ctx.save(); ctx.font = `600 ${size}px "Inter"`; ctx.fillStyle = o.col || INK; ctx.globalAlpha = o.a ?? .8; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const unit = str + ' · ', cw = ctx.measureText('M').width * .82, n = Math.floor(TAU * r / cw); let k = 0;
  for (let i = 0; i < n; i++) { const ch = unit[k++ % unit.length], a = (o.rot ?? 0) + i / n * TAU; ctx.save(); ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.rotate(a + Math.PI / 2); ctx.fillText(ch, 0, 0); ctx.restore(); }
  ctx.restore();
}
function foilFill(g, x, y, w, h, ang = .6) { const gr = g.createLinearGradient(x, y, x + Math.cos(ang) * w, y + Math.sin(ang) * h); FOIL.forEach((c, i) => gr.addColorStop(i / (FOIL.length - 1), c)); return gr; }
export function foilGlint(ctx, path, t, o = {}) {
  const sp = o.speed ?? .22, ang = o.angle ?? -.5, bw = o.width ?? 140, span = o.span ?? 900, ph = ((t * sp + (o.phase ?? 0)) % 1.6) - .3;
  const cx = (o.x ?? 0) + ph * span, cy = o.y ?? 0, dx = Math.cos(ang), dy = Math.sin(ang);
  ctx.save(); ctx.clip(path); ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createLinearGradient(cx - dx * bw, cy - dy * bw, cx + dx * bw, cy + dy * bw);
  g.addColorStop(0, 'rgba(255,179,92,0)'); g.addColorStop(.45, `rgba(255,214,150,${.35 * (o.a ?? 1)})`); g.addColorStop(.5, `rgba(255,248,230,${.75 * (o.a ?? 1)})`); g.addColorStop(.55, `rgba(255,214,150,${.35 * (o.a ?? 1)})`); g.addColorStop(1, 'rgba(255,179,92,0)');
  ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3); ctx.restore();
}
// embossed seal; static body cached, glint live
export function seal(ctx, x, y, r, t, o = {}) {
  const foil = !!o.foil, scal = o.scallops ?? 36;
  const edge = (g, rr) => { g.beginPath(); for (let i = 0; i <= 360; i++) { const a = i / 360 * TAU, q = rr * (1 + .035 * Math.cos(scal * a)); i ? g.lineTo(Math.cos(a) * q, Math.sin(a) * q) : g.moveTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); };
  const key = 'seal' + JSON.stringify([r, foil, o.label, o.emblem, scal]);
  const pad = r * .3, S = (r + pad) * 2;
  const c = cached(key, S, S, (g) => {
    g.translate(S / 2, S / 2);
    // emboss: light upper-left rim, dark lower-right rim, then the face
    g.save(); g.translate(-r * .025, -r * .025); edge(g, r); g.fillStyle = foil ? '#ffe9c0' : 'rgba(255,252,240,.9)'; g.fill(); g.restore();
    g.save(); g.translate(r * .035, r * .04); edge(g, r); g.fillStyle = foil ? 'rgba(70,30,8,.85)' : 'rgba(60,45,30,.35)'; g.fill(); g.restore();
    edge(g, r); g.fillStyle = foil ? foilFill(g, -r, -r, 2 * r, 2 * r) : PAPER; g.fill();
    const ink = foil ? 'rgba(90,40,10,.75)' : rgba(INK, .55);
    // concentric rings + ring microtext + a small guilloche rosette as emblem
    g.strokeStyle = ink; g.lineWidth = Math.max(.8, r * .012);
    for (const q of [.9, .72, .7]) { g.beginPath(); g.arc(0, 0, r * q, 0, TAU); g.stroke(); }
    microRing(g, 0, 0, r * .81, o.label || 'ONE EQUAL SHARE FOR EVERY PERSON', { size: Math.max(5, r * .085), col: foil ? '#5a2a08' : INK, a: .8 });
    const G = guilloche({ R: r * .42, A: r * .12, B: r * .05, n: 12, m: 5, lines: 18 }); g.lineWidth = Math.max(.6, r * .008);
    for (let k = 0; k < G.lines; k++) strokePts(g, G.line(k));
    if (o.emblem !== 'none') { // a seed at the centre
      g.save(); g.rotate(-.5); const sr = r * .16, sg = g.createRadialGradient(-sr * .3, -sr * .4, 0, 0, 0, sr * 1.3); sg.addColorStop(0, foil ? '#fff4dc' : '#f3efe2'); sg.addColorStop(1, foil ? '#b8641e' : '#bba98a');
      g.fillStyle = sg; g.beginPath(); g.moveTo(0, -sr * 1.3); g.bezierCurveTo(sr * .95, -sr * .5, sr * .85, sr * .9, 0, sr); g.bezierCurveTo(-sr * .85, sr * .9, -sr * .95, -sr * .5, 0, -sr * 1.3); g.fill(); g.restore();
    }
    // foil texture: fine stipple so it reads as metal leaf, not a gradient
    if (foil) { const [nc, nx] = canvas(Math.ceil(S), Math.ceil(S)); nx.translate(S / 2, S / 2); edge(nx, r); nx.fillStyle = 'rgba(255,240,200,.35)'; nx.fill(); stipple(nc, { k: 1, g: 1.4, seed: 5, mid: false, boost: 1.4 }); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'overlay'; g.drawImage(nc, 0, 0); g.restore(); }
  });
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.drawImage(c, -S / 2, -S / 2);
  if (foil) { const p = new Path2D(); for (let i = 0; i <= 120; i++) { const a = i / 120 * TAU, q = r * (1 + .035 * Math.cos(scal * a)); i ? p.lineTo(Math.cos(a) * q, Math.sin(a) * q) : p.moveTo(Math.cos(a) * q, Math.sin(a) * q); } p.closePath(); foilGlint(ctx, p, t, { x: -r * 1.6, y: 0, span: r * 3.2, width: r * .5, speed: o.glintSpeed ?? .18, phase: o.glintPhase ?? 0 }); }
  ctx.restore();
}
// resample a polyline to n points (by arc length)
export function resample(pts, n) {
  const d = [0]; for (let i = 1; i < pts.length; i++) d.push(d[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = d[d.length - 1] || 1, out = []; let j = 0;
  for (let i = 0; i < n; i++) { const s = i / (n - 1) * L; while (j < d.length - 2 && d[j + 1] < s) j++; const q = (s - d[j]) / ((d[j + 1] - d[j]) || 1); out.push([mix(pts[j][0], pts[j + 1][0], q), mix(pts[j][1], pts[j + 1][1], q)]); }
  return out;
}
// unwind: morph `from` into `to`; the change sweeps from the start of the line to its end (o.sweep 0..1 = how staggered)
export function unwind(from, to, u, o = {}) {
  const n = o.n ?? 900, A = resample(from, n), B = resample(to, n), sw = o.sweep ?? .6;
  return A.map((p, i) => { const q = eio(clamp((u * (1 + sw) - (i / n) * sw))); return [mix(p[0], B[i][0], q), mix(p[1], B[i][1], q)]; });
}

// ---------- the full certificate ----------
const CW = 1500, CH = 980;
function certLayer(o) {
  const key = 'cert' + JSON.stringify([o.title, o.sub, o.name]);
  return cached(key, CW, CH, (g) => {
    // paper with tooth, darker toward the edges, rough edge
    const n = vnoise(13);
    g.beginPath(); roughPath(g, [[0, 0], [CW, 0], [CW, CH], [0, CH]], { amp: 1.6, step: 9, seed: 21 });
    const pg = g.createRadialGradient(CW * .45, CH * .4, 0, CW * .5, CH * .5, CW * .75); pg.addColorStop(0, '#f7efdc'); pg.addColorStop(.7, PAPER); pg.addColorStop(1, '#d8c7a4');
    g.fillStyle = pg; g.fill(); g.save(); g.clip();
    { const r = prng(4); g.lineCap = 'round'; for (let i = 0; i < 2600; i++) { const px = r() * CW, py = r() * CH, L = 4 + r() * 22, a0 = r() * TAU; g.strokeStyle = r() < .5 ? `rgba(255,252,240,${.2 + r() * .3})` : `rgba(120,95,60,${.08 + r() * .14})`; g.lineWidth = .6; g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(a0) * L, py + Math.sin(a0) * L); g.stroke(); } }
    // background security pattern: a faint large rosette field + intaglio sunrise vignette
    rosette(g, CW * .5, CH * .5, { R: 330, A: 46, B: 22, n: 34, m: 11, lines: 70, col: '#9a7a4a', w: .4, a: .16 });
    g.restore();
    gBorder(g, 22, 22, CW - 44, CH - 44, { band: 46, lines: 11, waves: 150, col: '#28405a', w: .8, a: .75, radius: 26 });
    gBorder(g, 82, 82, CW - 164, CH - 164, { band: 16, lines: 5, waves: 260, col: '#8a5a24', w: .6, a: .7, radius: 14 });
    // corner rosettes
    for (const [cx, cy] of [[150, 150], [CW - 150, 150], [150, CH - 150], [CW - 150, CH - 150]]) rosette(g, cx, cy, { R: 46, A: 13, B: 6, n: 14, m: 5, lines: 22, col: '#28405a', w: .6, a: .85 });
    // intaglio vignette: first light over a field. Sky lines thin out toward the sun (light), furrows swell toward the
    // bottom (shadow); the lines bend with the land (warp) — engraving, not a gradient.
    const vx = CW * .5 - 230, vy = 252, vw = 460, vh = 196, sunX = vw * .64, hz = vh * .6;
    const hill = (x) => hz + 14 * Math.sin(x * .011 + .6) + 7 * Math.sin(x * .029 + 2);
    g.save(); g.beginPath(); g.ellipse(vx + vw / 2, vy + vh / 2, vw / 2, vh / 2, 0, 0, TAU); g.clip();
    intaglio(g, vx, vy, vw, vh, {
      gap: 3.3, angle: 0, col: '#22314a', maxW: 2.9,
      tone: (x, y) => { const hy = hill(x); if (y > hy) return .38 + .62 * clamp((y - hy) / (vh - hy)) + .18 * (n(x * .03, y * .07) - .5); const d = Math.hypot(x - sunX, (y - hy) * 1.6); return d < 34 ? 0 : clamp((d - 34) / 230) * .8 + .12; },
      warp: (x, y) => { const hy = hill(x); return y > hy ? (hill(x) - hz) * (1 - (y - hy) / (vh - hy)) * .9 + 3 * Math.sin(x * .05) * (y - hy) / vh : 0; },
    });
    // sun rays engraved as fine radial strokes
    g.strokeStyle = rgba('#22314a', .55); g.lineWidth = .7;
    for (let i = 0; i < 26; i++) { const a = Math.PI + i / 25 * Math.PI, r0 = 40, r1 = 40 + 26 + (i % 2) * 18; g.beginPath(); g.moveTo(vx + sunX + Math.cos(a) * r0, vy + hz + Math.sin(a) * r0 * .9); g.lineTo(vx + sunX + Math.cos(a) * r1, vy + hz + Math.sin(a) * r1 * .9); g.stroke(); }
    g.restore();
    g.strokeStyle = rgba('#28405a', .8); g.lineWidth = 1.2; g.beginPath(); g.ellipse(vx + vw / 2, vy + vh / 2, vw / 2 + 6, vh / 2 + 6, 0, 0, TAU); g.stroke();
    g.lineWidth = .6; g.beginPath(); g.ellipse(vx + vw / 2, vy + vh / 2, vw / 2 + 11, vh / 2 + 11, 0, 0, TAU); g.stroke();
    // lettering: small caps above, engraved title, microtext lines, the empty name line (M3), numbers
    g.textAlign = 'center';
    text(g, (o.sub || 'Certificate of an equal share').toUpperCase(), CW / 2, 200, { size: 22, weight: 600, color: '#28405a', align: 'center', spacing: 9 });
    microtext(g, 300, 228, CW - 600, 'THE FORTUNE THAT DOESN’T EXIST YET · ONE EQUAL SHARE FOR EVERY PERSON ON EARTH', { size: 6, col: '#28405a', a: .8 });
    microtext(g, 300, 650, CW - 600, 'NOT CHARITY BUT A RIGHT · AGREED BEFORE THE FORTUNE EXISTS · SAME SHARE FOR EVERYONE', { size: 6, col: '#28405a', a: .8 });
    text(g, 'THIS CERTIFIES THAT', CW / 2, 712, { size: 20, weight: 600, color: '#3a4a60', align: 'center', spacing: 6 });
    g.strokeStyle = rgba('#28405a', .75); g.lineWidth = 1.4; g.beginPath(); g.moveTo(CW / 2 - 330, 776); g.lineTo(CW / 2 + 330, 776); g.stroke();
    text(g, 'IS THE OWNER OF ONE EQUAL SHARE', CW / 2, 822, { size: 20, weight: 600, color: '#3a4a60', align: 'center', spacing: 6 });
    text(g, 'Nº', 205, 330, { size: 30, font: 'Instrument Serif', color: '#8a3a2a' }); g.strokeStyle = rgba('#8a3a2a', .7); g.beginPath(); g.moveTo(245, 332); g.lineTo(380, 332); g.stroke();
    // stamped wear
    stipple(g.canvas, { k: .25, g: 1, seed: 3, mid: false, boost: 1 });
  });
}
const TL = new Map();
function titleLayers(title) {
  if (TL.has(title)) return TL.get(title);
  const size = 150, [m, mx] = canvas(10, 10); mx.font = `${size}px "Instrument Serif"`; try { mx.letterSpacing = '10px'; } catch { }
  const w = Math.ceil(mx.measureText(title).width + 40), h = Math.ceil(size * 1.15);
  const mk = (fill) => { const [c, x] = canvas(w, h); x.font = `${size}px "Instrument Serif"`; try { x.letterSpacing = '10px'; } catch { } x.textBaseline = 'alphabetic'; x.fillStyle = fill(x); x.fillText(title, 20, h * .78); return c; };
  const L = { w, h, mask: mk(() => '#fff'), shadow: mk(() => 'rgba(40,20,8,1)'), foil: mk((x) => foilFill(x, 0, 0, w, h, .25)), scratch: canvas(w, h) };
  // foil leaf texture on the letters
  { const fx = L.foil.getContext('2d'), [nc, nx] = canvas(w, h); nx.drawImage(L.mask, 0, 0); nx.globalCompositeOperation = 'source-in'; nx.fillStyle = 'rgba(255,236,190,.55)'; nx.fillRect(0, 0, w, h); stipple(nc, { k: 1, g: 1.5, seed: 9, mid: false, boost: 1.3 }); fx.globalCompositeOperation = 'overlay'; fx.drawImage(nc, 0, 0); fx.globalCompositeOperation = 'source-over'; }
  TL.set(title, L); return L;
}
export function certificate(ctx, t, o = {}) {
  const c = certLayer(o), s = o.s ?? .8, x = o.x ?? W / 2, y = o.y ?? H / 2, rot = o.rot ?? -.05;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  // shadow on the table
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 50; ctx.shadowOffsetX = 26; ctx.shadowOffsetY = 34; ctx.fillStyle = '#000'; ctx.fillRect(-CW / 2 + 10, -CH / 2 + 10, CW - 20, CH - 20); ctx.restore();
  ctx.drawImage(c, -CW / 2, -CH / 2);
  // foil title with glint (title cached as a mask; the glint band is clipped to the letters in a small scratch layer)
  const title = o.title || 'YOUR SHARE', ty = -CH / 2 + 612;
  const T = titleLayers(title), tw = T.w, th = T.h;
  ctx.save(); ctx.globalAlpha = .55; ctx.drawImage(T.shadow, -tw / 2 + 3, ty - th * .78 + 4); ctx.restore();
  ctx.drawImage(T.foil, -tw / 2, ty - th * .78);
  const [gc, gx] = T.scratch; gx.globalCompositeOperation = 'source-over'; gx.clearRect(0, 0, tw, th); gx.drawImage(T.mask, 0, 0);
  gx.globalCompositeOperation = 'source-in'; const ph = ((t * .2 + .1) % 1.6) - .3, bx = ph * (tw + 400) - 200;
  const gg = gx.createLinearGradient(bx - 90, 0, bx + 90, th * .4); gg.addColorStop(0, 'rgba(255,179,92,0)'); gg.addColorStop(.5, 'rgba(255,246,225,.9)'); gg.addColorStop(1, 'rgba(255,179,92,0)');
  gx.fillStyle = gg; gx.fillRect(0, 0, tw, th);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(gc, -tw / 2, ty - th * .78); ctx.restore();
  seal(ctx, CW / 2 - 230, CH / 2 - 215, 118, t, { foil: true, rot: -.2 + .02 * Math.sin(t * .3), glintPhase: .4 });
  ctx.restore();
}
