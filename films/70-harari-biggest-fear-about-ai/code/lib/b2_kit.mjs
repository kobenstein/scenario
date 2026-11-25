// Film 70 · builder B2 (c06–c08) · own helpers (lib/f70_* stay untouched; everything here is local to c06–c08).
// THE INNER BOARD: c06 flies INTO the LAW link of plateLaw; c06/c07 then live inside it. Inner coordinates are plain board units
// (1 unit = 1 px at s = 1); inner point (ix, iy) = LAW centre + (ix − OX, iy − OY) / K in the outer (plate) board. K = 16 and
// OX/OY are chosen so the inner dot lattice is exactly the outer lattice at every level (no grid jump when we pass through the link).
import * as E from './f10_editorial.mjs';
import * as F from './f70_kit.mjs';
import * as S from './f70_world.mjs';
import * as X from './f70_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, lin, prng } = E;
const { GOLD, COOL, CREAM, CREAM2, LAMP, PAPER } = F;
const TAU = Math.PI * 2;

export const LC = { x: S.lawRowX(2), y: S.LAWROW.y }, K = 16, OX = 960, OY = 560;
export const inner = (v) => ({ x: OX + (v.x - LC.x) * K, y: OY + (v.y - LC.y) * K, s: v.s / K });
export const outer = (vi) => ({ x: LC.x + (vi.x - OX) / K, y: LC.y + (vi.y - OY) / K, s: vi.s * K });

// ------------------------------------------------------------------------------------------------ the dot grid at any zoom
// Identical to X.board's grid at s ≈ 1 (step 60, minor .075, major .16 every 4th); finer and coarser levels cross-fade smoothly.
const isM = (x, m) => Math.abs(Math.round(x / m) * m - x) < m * 1e-4;
export function grid(ctx, v, g = 1) {
  if (g <= 0) return;
  X.inView(ctx, v, (s) => {
    const k = Math.ceil(Math.log(34 / (60 * s)) / Math.log(4) - 1e-9), step = 60 * 4 ** k, f = smooth(clamp((step * s - 34) / 26)), r = 1.6 / s;
    const x0 = v.x - W / 2 / s, x1 = v.x + W / 2 / s, y0 = v.y - H / 2 / s, y1 = v.y + H / 2 / s;
    for (let x = Math.floor(x0 / step) * step; x <= x1; x += step) for (let y = Math.floor(y0 / step) * step; y <= y1; y += step) {
      const on1 = isM(x, step * 4) && isM(y, step * 4), on2 = on1 && isM(x, step * 16) && isM(y, step * 16);
      const a = lerp(on2 ? .16 : on1 ? .075 : 0, on1 ? .16 : .075, f) * g; if (a <= .002) continue;
      ctx.fillStyle = rgba(CREAM, a); ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });
}
// the board ground with the smooth grid; v = the view the grid belongs to (outer or inner), pool in the same units
export function ground(ctx, t, v, o = {}) { X.board(ctx, t, v, { ...o, grid: 0 }); grid(ctx, v, o.grid ?? 1); }

// ------------------------------------------------------------------------------------------------ the HUD, steerable
// chainHud with per-element overrides (used only where the HUD itself is the carrier): o.k (scale about the row centre), o.to(i) →
// { x, y, L, ang, a } screen target per link (o.f 0..1 how far), o.la [a0..a3], o.ea (edge links alpha), o.label false.
export const hudPos = (i) => [F.HUD.x + i * F.HUD.L * 1.02, F.HUD.y];
export function hud(ctx, t, T, o = {}) {
  const s = F.chainState(T, t), a = (o.on ?? s.on) * (o.a ?? 1); if (a <= 0) return s;
  const L = F.HUD.L, gap = L * 1.02, sw = Math.sin(t * .9) * .03, f = clamp(o.f ?? 0), k = o.k ?? 1, cx = F.HUD.x + 1.5 * gap, cy = F.HUD.y;
  const P0 = (x, y) => [cx + (x - cx) * k, cy + (y - cy) * k];
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  for (let i = 0; i < 3; i++) {
    let [x, y] = P0(F.HUD.x + (i + .5) * gap, F.HUD.y), LL = L * .62 * k, ang = sw;
    if (o.toE) { const q = o.toE(i); x = lerp(x, q.x, f); y = lerp(y, q.y, f); LL = lerp(LL, q.L, f); ang = lerp(ang, q.ang ?? 0, f); }
    F.chainLink(ctx, t, x, y, LL, ang, { edge: true, a: o.ea ?? 1 });
  }
  s.links.forEach((l, i) => {
    let [x, y] = P0(F.HUD.x + i * gap, F.HUD.y), LL = L * k, ang = sw + (i % 2 ? .04 : -.04);
    if (o.to) { const q = o.to(i); x = lerp(x, q.x, f); y = lerp(y, q.y, f); LL = lerp(LL, q.L, f); ang = lerp(ang, q.ang ?? 0, f); }
    const la = o.la ? o.la[i] : 1; if (la <= 0) return;
    F.chainLink(ctx, t, x, y, LL, ang, { lit: (o.lit ? o.lit[i] : l.lit * (.75 + .25 * Math.sin(t * 3))), crack: l.crack, mend: l.mend, a: la });
  });
  const cur = s.cur; if (cur >= 0 && o.label !== false) {
    const nu = span(t, s.b.at[cur] - .2, s.b.at[cur] + .5) * (1 - span(t, s.b.at[cur] + 4.5, s.b.at[cur] + 5.1));
    if (nu > 0) F.maskLine(ctx, [[`LINK ${cur + 1} · ${F.CHAIN.names[cur]}`, 0]], F.HUD.x - L / 2, F.HUD.y + L * .95, 22, F.rise(nu), { serif: false, weight: 600, col: GOLD.text, glow: false });
  }
  ctx.restore();
  return s;
}

// ------------------------------------------------------------------------------------------------ paper, lines, windows
export function sheet(ctx, x, y, w, h, o = {}) {   // a cream sheet, centre (x, y)
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(o.sx ?? 1, o.sy ?? 1);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 6, -h / 2 + 9, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  if (o.edge !== false) { ctx.strokeStyle = rgba(PAPER.edge, .8); ctx.lineWidth = 1.5; ctx.strokeRect(-w / 2, -h / 2, w, h); }
  ctx.restore();
}
// n text lines (ink bars) written on from the left: u 0..1 over all lines; o.gap, o.h, o.col, o.short (every nth line shorter),
// o.skip(i) → true hides a line; returns the pen point [x, y] (end of the line being written)
export function inkLines(ctx, x, y, w, n, u, o = {}) {
  const gap = o.gap ?? 26, hh = o.h ?? 5, col = o.col ?? rgba(PAPER.ink, .55), tot = clamp(u) * n; let pen = [x, y];
  for (let i = 0; i < n; i++) {
    const f = clamp(tot - i); if (f <= 0) break; if (o.skip && o.skip(i)) continue;
    const lw = w * ((i + 1) % (o.short ?? 4) === 0 ? .58 : .92 - ((i * 37) % 9) / 100);
    ctx.fillStyle = typeof col === 'function' ? col(i) : col; ctx.fillRect(x, y + i * gap, lw * f, hh); pen = [x + lw * f, y + i * gap];
  }
  return pen;
}
// a chat window (cool frame, a title row): centre (x, y), w × h; o.u 0..1 (grows from its bottom edge), o.title. Returns the inner box.
export function chatWin(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), hh = h * k, top = y + h / 2 - hh;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  halo(ctx, x, y, w * .75, .16 * k, COOL.halo, COOL.core);
  ctx.fillStyle = mixHex(P.night0, COOL.deep, .55); ctx.strokeStyle = rgba(COOL.line, .9); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x - w / 2, top, w, hh, 16); ctx.fill(); ctx.stroke();
  if (k > .5) {
    ctx.beginPath(); ctx.rect(x - w / 2, top, w, hh); ctx.clip();
    ctx.fillStyle = rgba(COOL.line, .25); ctx.fillRect(x - w / 2, top + 52, w, 1.5);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = rgba(COOL.line, .45); ctx.beginPath(); ctx.arc(x - w / 2 + 26 + i * 18, top + 26, 5, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
  if (o.title && k > .6) X.label(ctx, o.title, x - w / 2 + 96, top + 34, span(u, .6, 1), { size: 22, align: 'left', col: COOL.text, weight: 600 });
  return { x0: x - w / 2 + 34, y0: top + 84, w: w - 68, h: hh - 100 };
}
// a horizontal bar: track (cream hairline) + fill (u 0..1 of len), o.col fill colour, o.gold
export function bar(ctx, x, y, len, h, frac, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const tu = clamp(o.track ?? 1);
  if (tu > 0) { ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 1.5; if (o.dash) ctx.setLineDash(o.dash); ctx.beginPath(); ctx.roundRect(x, y - h / 2, len * expoOut(tu), h, 4); ctx.stroke(); ctx.setLineDash([]); }
  const L = len * clamp(frac, 0, 1.2);
  if (L > 1) {
    const c = o.col ?? COOL.body;
    ctx.fillStyle = o.gold ? lin(ctx, x, 0, x + L, 0, [[0, GOLD.mid], [1, GOLD.hot]]) : c;
    ctx.beginPath(); ctx.roundRect(x + 2, y - h / 2 + 2, L - 4, h - 4, 4); ctx.fill();
    if (o.gold) halo(ctx, x + L, y, h * 2.4, .45 * (o.glow ?? 1), GOLD.halo, GOLD.core);
  }
  ctx.restore();
  return x + L;
}
// particles: a line (x, y, w) breaking into dust, d 0..1 (pieces drift right and up and thin out); seeded
export function dustLine(ctx, x, y, w, h, d, seed, col) {
  const r = prng(seed), n = Math.max(8, Math.round(w / 9));
  for (let i = 0; i < n; i++) {
    const px = x + (i + .5) * w / n, q = r(), q2 = r(), dd = clamp(d * 1.6 - (i / n) * .6); if (dd >= 1) continue;
    const e = expoOut(dd), ax = px + e * (110 + q * 260), ay = y + h / 2 - e * (40 + q2 * 170) + Math.sin(dd * 6 + q * 9) * 6 * dd;
    const sz = dd <= 0 ? w / n : lerp(w / n * .7, 1.6, e);
    ctx.fillStyle = col; ctx.globalAlpha = (1 - dd) ** 1.4; ctx.fillRect(ax - sz / 2, ay - h / 2, sz, dd <= 0 ? h : Math.max(1.4, h * (1 - e)));
  }
  ctx.globalAlpha = 1;
}
// a magnifier: lens centre (x, y), radius r, handle to the lower right; o.ang handle angle, o.a, o.lit (cool glass glow)
export function magnifier(ctx, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const ang = o.ang ?? .8;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = mixHex(P.night1, P.blue1, .6); ctx.lineWidth = r * .22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * r * 1.05, y + Math.sin(ang) * r * 1.05); ctx.lineTo(x + Math.cos(ang) * r * 2.1, y + Math.sin(ang) * r * 2.1); ctx.stroke();
  ctx.fillStyle = rgba(COOL.body, .12 + .1 * (o.lit ?? 0)); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = COOL.line; ctx.lineWidth = r * .1; ctx.stroke();
  ctx.strokeStyle = rgba(COOL.core, .7); ctx.lineWidth = r * .04; ctx.beginPath(); ctx.arc(x, y, r * .72, -2.6, -1.9); ctx.stroke();
  halo(ctx, x, y, r * 1.6, .22 * (.6 + .4 * (o.lit ?? 0)), COOL.halo, COOL.core);
  ctx.restore();
}
// a casino chip (cream, notched rim; no logo), rolling: rot
export function chip(ctx, x, y, r, rot = 0, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = mixHex(PAPER.body, CREAM2, .3); ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(0, 0, r, i * TAU / 8 - .13, i * TAU / 8 + .13); ctx.arc(0, 0, r * .72, i * TAU / 8 + .13, i * TAU / 8 - .13, true); ctx.fill(); }
  ctx.strokeStyle = rgba(P.ind2, .7); ctx.lineWidth = r * .06; ctx.beginPath(); ctx.arc(0, 0, r * .5, 0, TAU); ctx.stroke();
  ctx.restore();
}
// an empty speech bubble (cream outline) above (x, y), u 0..1 grows from its tail
export function bubble(ctx, x, y, w, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), h = w * .62;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1);
  ctx.fillStyle = rgba(P.night0, .55); ctx.strokeStyle = rgba(o.col ?? CREAM, .85); ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h - 18, w, h, h * .4); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, -19); ctx.lineTo(0, 0); ctx.lineTo(8, -19); ctx.fillStyle = rgba(P.night0, .55); ctx.fill(); ctx.stroke();
  ctx.restore();
}
// a desk with a front panel (occludes what stands behind it): (x, floor y), width w, top height th
export function desk(ctx, x, y, w, th, o = {}) {
  ctx.fillStyle = mixHex(P.night1, P.blue1, .35); ctx.fillRect(x - w / 2, y - th, w, th * .07);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .45); ctx.fillRect(x - w / 2 + 8, y - th * .93, w - 16, th * .93);
  ctx.fillStyle = rgba(mixHex(LAMP.body, P.blue1, .4), .5 * (o.lamp ?? 1)); ctx.fillRect(x - w / 2, y - th, w, 2);
}
// a desk lamp (arm + shade) at the desk's left end; o.on 0..1 (warm cone)
export function deskLamp(ctx, x, y, h, on) {
  if (on > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, x, y - h, x, y, [[0, rgba(LAMP.body, .16 * on)], [1, rgba(LAMP.body, .015 * on)]]);
    ctx.beginPath(); ctx.moveTo(x + h * .12, y - h); ctx.lineTo(x - h * .25, y); ctx.lineTo(x + h * .9, y); ctx.lineTo(x + h * .26, y - h); ctx.fill(); ctx.restore();
    halo(ctx, x + h * .19, y - h, h * .45, .45 * on, LAMP.body, LAMP.core); }
  ctx.strokeStyle = mixHex(P.night1, P.blue1, .5); ctx.lineWidth = h * .035; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h * .95); ctx.lineTo(x + h * .19, y - h * 1.02); ctx.stroke();
  ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.beginPath(); ctx.moveTo(x + h * .06, y - h * 1.02); ctx.lineTo(x + h * .32, y - h * 1.02); ctx.lineTo(x + h * .25, y - h * 1.12); ctx.lineTo(x + h * .13, y - h * 1.12); ctx.fill();
}
// a monitor on a stand (cool), bottom centre (x, y), w; o.glow
export function monitor(ctx, x, y, w, o = {}) {
  const h = w * .64;
  ctx.fillStyle = mixHex(P.night0, P.blue1, .3); ctx.fillRect(x - w * .04, y - w * .14, w * .08, w * .14); ctx.fillRect(x - w * .18, y - 4, w * .36, 4);
  ctx.fillStyle = mixHex(P.night0, P.blue2, .5); ctx.beginPath(); ctx.roundRect(x - w / 2, y - w * .14 - h, w, h, 8); ctx.fill();
  ctx.fillStyle = lin(ctx, x, y - h, x, y, [[0, mixHex(COOL.deep, COOL.body, .3)], [1, COOL.deep]]); ctx.beginPath(); ctx.roundRect(x - w * .45, y - w * .14 - h * .93, w * .9, h * .86, 6); ctx.fill();
  ctx.fillStyle = rgba(COOL.core, .35); for (let i = 0; i < 4; i++) ctx.fillRect(x - w * .36, y - w * .14 - h * .8 + i * h * .17, w * (i % 2 ? .45 : .62), 3);
  halo(ctx, x, y - w * .14 - h / 2, w * 1.1, .22 * (o.glow ?? 1), COOL.halo, COOL.core);
  return { x0: x - w / 2, x1: x + w / 2, top: y - w * .14 - h, bot: y - w * .14 };
}
// small cream option chip with a letter (A / B), centre (x, y); o.lit cool highlight, o.gold
export function option(ctx, x, y, w, h, txt, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const k = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  const lit = clamp(o.lit ?? 0), g = clamp(o.gold ?? 0);
  if (lit > 0) halo(ctx, 0, 0, w * 1.1, .4 * lit, g > 0 ? GOLD.halo : COOL.halo, g > 0 ? GOLD.core : COOL.core);
  ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .6), g > 0 ? GOLD.deep : COOL.deep, lit * .7); ctx.strokeStyle = g > 0 ? rgba(GOLD.line, .9) : rgba(lit > 0 ? COOL.line : CREAM, .75); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 10); ctx.fill(); ctx.stroke();
  ctx.restore();
  if (txt) X.label(ctx, txt, x, y + 8 * k, u, { size: o.size ?? 22, col: g > 0 ? GOLD.text : lit > .5 ? COOL.core : CREAM, weight: 700 });
}
// the TRUTH-link hand (your yellow sleeve from the left holding one gold link): palm at (x, y), link angle; o.in 0..1 (enters), o.out
export function handLink(ctx, t, x, y, o = {}) {
  const inn = expoOut(clamp(o.in ?? 1)), out = expoIn(clamp(o.out ?? 0)), dx = -(1 - inn) * 900 - out * 900;
  const ang = (o.ang ?? -.12) + .02 * Math.sin(t * 1.1);
  F.sleeve(ctx, t, x + dx, y, { ang, len: 1200, open: .25 });
  return [x + dx, y];
}
// a ride track: polyline points + sleepers; u 0..1 drawn on; returns nothing
export function track(ctx, pts, u, o = {}) {
  X.lightLine(ctx, pts, u, { w: o.w ?? 4, a: .8 });
  X.lightLine(ctx, pts.map(([x, y]) => [x, y + 16]), u, { w: 2, a: .35, glow: false });
  const tot = F.pathLen(pts); ctx.strokeStyle = rgba(CREAM, .3); ctx.lineWidth = 2;
  for (let d = 20; d < tot * clamp(u); d += 46) { const [x, y, a] = F.pathAt(pts, d); ctx.beginPath(); ctx.moveTo(x - Math.sin(a) * 0, y); ctx.lineTo(x - Math.sin(a) * 16, y + Math.cos(a) * 16); ctx.stroke(); }
}
// resample a polyline to n points (for morphs between two lines)
export function resample(pts, n) { const tot = F.pathLen(pts), out = []; for (let i = 0; i < n; i++) { const [x, y] = F.pathAt(pts, tot * i / (n - 1)); out.push([x, y]); } return out; }
// a lectern (front view), bottom centre (x, y), w, h
export function lectern(ctx, x, y, w, h) {
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5);
  ctx.beginPath(); ctx.moveTo(x - w * .5, y - h); ctx.lineTo(x + w * .5, y - h); ctx.lineTo(x + w * .38, y); ctx.lineTo(x - w * .38, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .45); ctx.fillRect(x - w * .56, y - h - 16, w * 1.12, 18);
  ctx.fillStyle = rgba(LAMP.body, .45); ctx.fillRect(x - w * .56, y - h - 16, w * 1.12, 2.5);
}
// a hanging tag (cream, on a string from (x, y0)), label txt, swing angle
export function tag(ctx, x, y0, len, txt, u, sw = 0) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), L = len * k;
  ctx.save(); ctx.translate(x, y0); ctx.rotate(sw);
  ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, L); ctx.stroke();
  const tw = F.measure(txt, 22, false, 700) + txt.length * 22 * .1 + 30;
  ctx.fillStyle = lin(ctx, 0, L, 0, L + 42, [[0, PAPER.lit], [1, PAPER.body]]); ctx.beginPath(); ctx.roundRect(-tw / 2, L, tw, 42, 6); ctx.fill();
  ctx.fillStyle = mixHex(PAPER.ink, P.ind1, .2); ctx.beginPath(); ctx.arc(-tw / 2 + 12, L + 21, 4, 0, TAU); ctx.fill();
  F.goldText(ctx, [[txt, 0]], 6, L + 29, 22, 1, { serif: false, weight: 700, spacing: .1, align: 'center', col: PAPER.ink });
  ctx.restore();
}
// a suitcase (side-on, closed or open): bottom centre (x, y), w; open 0..1 (the lid swings up and back)
export function suitcase(ctx, x, y, w, open) {
  const h = w * .62, lid = h * .22, op = sineIO(clamp(open));
  ctx.fillStyle = mixHex(P.night1, P.blue1, .4); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h + lid, w, h - lid, 12); ctx.fill();
  ctx.fillStyle = rgba(LAMP.body, .35); ctx.fillRect(x - w / 2 + 10, y - h + lid, w - 20, 2);
  ctx.strokeStyle = mixHex(P.ind2, P.blue1, .6); ctx.lineWidth = 3; ctx.strokeRect(x - w * .38, y - h * .5, w * .76, h * .02);
  // the lid: hinged at the back (left) top edge
  ctx.save(); ctx.translate(x - w / 2, y - h + lid); ctx.rotate(-op * 1.95);
  ctx.fillStyle = mixHex(P.night1, P.blue1, .5); ctx.beginPath(); ctx.roundRect(0, -lid, w, lid, 10); ctx.fill();
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.fillRect(w * .4, -lid - 12, w * .2, 12);
  ctx.restore();
  return { hinge: [x - w / 2, y - h + lid], top: y - h + lid, w, h, lidAng: -op * 1.95 };
}
// a parliament outline (cream line drawing: steps, columns, pediment), centre bottom (x, y), w
export function parliament(ctx, x, y, w, u = 1) {
  const h = w * .6, pts = []; ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.moveTo(x - w * .45, y - h * .1); ctx.lineTo(x + w * .45, y - h * .1);
  for (let i = 0; i < 5; i++) { const cx = x - w * .36 + i * w * .18; ctx.moveTo(cx, y - h * .1); ctx.lineTo(cx, y - h * .62); }
  ctx.moveTo(x - w * .46, y - h * .62); ctx.lineTo(x + w * .46, y - h * .62); ctx.lineTo(x, y - h); ctx.closePath(); ctx.stroke();
  ctx.restore();
}
// a chat bubble icon (cool), centre (x, y), w
export function chatIcon(ctx, x, y, w, u = 1) {
  const h = w * .7; ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  ctx.fillStyle = rgba(COOL.deep, .8); ctx.strokeStyle = COOL.line; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h * .35); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - w * .2, y + h / 2 - 1); ctx.lineTo(x - w * .3, y + h * .85); ctx.lineTo(x - w * .02, y + h / 2 - 1); ctx.fill(); ctx.stroke();
  ctx.fillStyle = COOL.core; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(x + i * w * .18, y, w * .055, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// a dial (cream arc + needle) at (x, y), r; v 0..1 (needle from left to right)
export function dial(ctx, x, y, r, v, u = 1) {
  ctx.save(); ctx.globalAlpha *= clamp(u * 2);
  ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, Math.PI, TAU); ctx.stroke();
  ctx.strokeStyle = COOL.body; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r, Math.PI, Math.PI + Math.PI * clamp(v)); ctx.stroke();
  const a = Math.PI + Math.PI * clamp(v); ctx.strokeStyle = COOL.core; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9); ctx.stroke();
  ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(x, y, 5, 0, TAU); ctx.fill();
  ctx.restore();
}
// hold-alive helpers
export const breathe = (t, ph = 0, a = 1) => a * Math.sin(t * 1.3 + ph);
export const lab = (t, a, b, d = .6) => span(t, a, a + d) * (1 - span(t, b - .45, b + .05));
// F.goldText draws (clipped) even at u = 0, and its glow bleeds above the clip as a faint smear: skip invisible text.
export const big = (ctx, txt, x, y, size, u, o) => { if (u > 0) X.big(ctx, txt, x, y, size, u, o); };
export const gold = (ctx, segs, x, y, size, u, o) => (u > 0 ? F.goldText(ctx, segs, x, y, size, u, o) : null);
