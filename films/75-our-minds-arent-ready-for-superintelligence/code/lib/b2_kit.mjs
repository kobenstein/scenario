// Film 75 · builder B2 (c06–c09) · small drawing helpers that the kit does not have (owned by B2; nobody else imports this).
// All shapes are flat, lit like the kit's objects (cream = rules / paper, gold = the machine, ochre = old reflexes, COOL = screens,
// the coat yellow = you). Every helper takes u (0..1: how far it has grown) so the voice can drive it; nothing pops.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f75_kit.mjs';
import * as X from './f75_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng, smooth } = E;
const { GOLD, COOL, CREAM, PAPER, OCHRE, FLINT, COAT, WALLC } = F;
const TAU = Math.PI * 2;

// a screen-space statement (Inter caps) with the kit's mask wipe; x, y screen px
export function stmt(ctx, txt, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  X.label(ctx, txt, o.x ?? W / 2, o.y ?? 210, u, { size: o.size ?? 46, spacing: o.spacing ?? .12, col: o.col ?? CREAM, gold: o.gold ?? 0, align: o.align ?? 'center' });
  ctx.restore();
}
// a screen-space serif statement (X.big)
export function bigS(ctx, txt, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); X.big(ctx, txt, o.x ?? W / 2, o.y ?? 230, o.size ?? 84, u, { gold: o.gold ?? .8, col: o.col, align: o.align }); ctx.restore();
}
// label in/out envelope (from sc01): rises over .7 s from a, sinks round b
export const lab = (t, a, b) => span(t, a, a + .7) * (1 - span(t, b - .45, b + .1));

// a soft night shade behind text that sits on light (readability, no box), screen space
export function backing(ctx, x, y, w, h, u) {
  if (u <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(x, y); ctx.scale(w / 2, h / 2);
  ctx.fillStyle = rad(ctx, 0, 0, 1, [[0, rgba(P.night0, .62 * clamp(u * 1.5))], [.6, rgba(P.night0, .4 * clamp(u * 1.5))], [1, rgba(P.night0, 0)]]); ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill(); ctx.restore();
}

// ------------------------------------------------------------------------------------------------ Harari's books
// a stack of n books (bottom at y, centre x, width w); each book drops in from above in turn (u 0..1), lands with a tiny settle
export function books(ctx, t, x, y, w, u, o = {}) {
  const n = o.n ?? 5, r = prng(41), cols = [PAPER.body, mixHex(P.ind2, P.blue1, .5), mixHex(PAPER.shade, OCHRE.mid, .25), mixHex(P.ind2, COOL.deep, .6), PAPER.lit];
  let yy = y;
  for (let i = 0; i < n; i++) {
    const bw = w * (.84 + r() * .16), bh = w * (.13 + r() * .05), dx = (r() - .5) * w * .1, rot = (r() - .5) * .05;
    const k = clamp(u * n - i); yy -= bh;
    if (k <= 0) continue;
    const e = expoOut(k), drop = (1 - e) * 220;
    ctx.save(); ctx.globalAlpha *= clamp(k * 3); ctx.translate(x + dx, yy + bh / 2 - drop); ctx.rotate(rot * e);
    ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-bw / 2 + 5, -bh / 2 + 6, bw, bh);
    ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, bh * .12); ctx.fill();
    ctx.fillStyle = rgba(i % 2 ? CREAM : P.night1, .45); ctx.fillRect(-bw / 2 + bw * .08, -bh * .12, bw * .55, Math.max(2, bh * .1));   // a title line on the spine
    ctx.fillRect(-bw / 2 + bw * .08, bh * .14, bw * .3, Math.max(2, bh * .08));
    ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
  }
  return { top: yy };
}

// ------------------------------------------------------------------------------------------------ the mountain + monastery
// a faceted mountain (flat stone tones, a cream snow cap) with a small monastery on a ledge (three blocks, warm windows).
// x = centre, y = base, w, h. u: rises out of the wall (a clip from the base). o.k scale (shrinks into a picture), o.frame 0..1 (a cream frame)
export function mountain(ctx, t, x, y, w, h, u, o = {}) {
  if (u <= 0) return;
  const k = expoOut(clamp(u));
  ctx.save(); ctx.translate(x, y); const s = o.k ?? 1; ctx.scale(s, s);
  if ((o.frame ?? 0) > 0) { const f = clamp(o.frame), fw = w * 1.08, fh = h * 1.12;
    ctx.fillStyle = rgba(P.night0, .55 * f); ctx.fillRect(-fw / 2, -fh + h * .04, fw, fh);
    ctx.strokeStyle = rgba(CREAM, .75 * f); ctx.lineWidth = 3 / s; ctx.strokeRect(-fw / 2, -fh + h * .04, fw, fh); }
  ctx.beginPath(); ctx.rect(-w, -h * 1.1 * k, w * 2, h * 1.1 * k + 2); ctx.clip();
  const pk = [w * .04, -h], L = [-w / 2, 0], R = [w / 2, 0], ml = [-w * .2, -h * .55], mr = [w * .27, -h * .48];
  const tri = (a, b, c, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.closePath(); ctx.fill(); };
  const lit = mixHex(P.ind1, P.blue1, .5), dark = mixHex(P.night1, P.ind1, .4), mid = mixHex(P.ind1, P.night1, .35);
  tri(L, ml, [0, 0], dark); tri(ml, pk, [0, 0], mid); tri(pk, mr, [0, 0], lit); tri(mr, R, [0, 0], mixHex(lit, mid, .5));
  tri(L, [-w * .62, 0], [-w * .4, -h * .32], dark); tri(R, [w * .64, 0], [w * .42, -h * .3], mid);   // shoulders
  // snow cap
  ctx.fillStyle = mixHex(CREAM, P.blue1, .15); ctx.beginPath(); ctx.moveTo(...pk); ctx.lineTo(pk[0] - w * .1, -h * .8); ctx.lineTo(pk[0] - w * .04, -h * .84);
  ctx.lineTo(pk[0] + w * .02, -h * .78); ctx.lineTo(pk[0] + w * .07, -h * .83); ctx.lineTo(pk[0] + w * .12, -h * .79); ctx.closePath(); ctx.fill();
  // the monastery on a ledge (right flank)
  const mx = w * .2, my = -h * .5;
  ctx.fillStyle = mixHex(P.night1, P.ind2, .6); ctx.fillRect(mx - w * .12, my, w * .24, h * .04);
  [[-.1, .08, .1], [-.02, .12, .09], [.06, .07, .08]].forEach(([dx, bh, bw]) => {
    ctx.fillStyle = mixHex(PAPER.shade, P.ind1, .45); ctx.fillRect(mx + dx * w, my - bh * h, bw * w, bh * h);
    ctx.fillStyle = mixHex(P.night1, P.ind1, .3); ctx.beginPath(); ctx.moveTo(mx + dx * w - w * .01, my - bh * h); ctx.lineTo(mx + (dx + bw / 2) * w, my - bh * h - h * .05); ctx.lineTo(mx + (dx + bw) * w + w * .01, my - bh * h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.core1, .7 + .2 * Math.sin(t * 1.3 + dx * 20)); ctx.fillRect(mx + (dx + bw * .4) * w, my - bh * h * .6, bw * w * .2, bh * h * .25);
  });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the copy of you (KNOWS YOU BETTER)
// the stone head's profile as a path (unit height, base of the neck at 0,0, facing +x) — the same outline as F.stoneHead
export function headPath() {
  const p = new Path2D();
  p.moveTo(-.42, 0); p.bezierCurveTo(-.4, -.2, -.3, -.3, -.2, -.36); p.bezierCurveTo(-.36, -.5, -.34, -.86, -.08, -.96);
  p.bezierCurveTo(.14, -1.02, .34, -.9, .36, -.7); p.lineTo(.42, -.56); p.lineTo(.36, -.53); p.bezierCurveTo(.38, -.46, .36, -.42, .32, -.4);
  p.bezierCurveTo(.3, -.34, .24, -.34, .16, -.34); p.lineTo(.14, -.26); p.bezierCurveTo(.3, -.2, .4, -.12, .42, 0); p.closePath();
  return p;
}
const HP = headPath();
// a sharper copy of the head in COOL lines: the outline traces on (u), then a fine grid of scan lines fills it (fill 0..1)
export function copyHead(ctx, t, x, y, h, u, o = {}) {
  if (u <= 0) return;
  const dir = o.dir ?? -1, fill = clamp(o.fill ?? 0) * smooth(clamp(u));   // the stripes leave with the trace
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.scale(h * dir, h);
  if (fill > 0) { ctx.fillStyle = rgba(COOL.deep, .55 * fill); ctx.fill(HP);
    ctx.save(); ctx.clip(HP); ctx.strokeStyle = rgba(COOL.line, .35 * fill); ctx.lineWidth = .004;
    for (let i = 0; i < 26; i++) { const yy = -1.02 + i * .04 + ((t * .02) % .04); ctx.beginPath(); ctx.moveTo(-.5, yy); ctx.lineTo(.5, yy); ctx.stroke(); }
    ctx.restore(); }
  ctx.setLineDash([3.2, 3.2]); ctx.lineDashOffset = 3.2 * (1 - smooth(clamp(u)));   // the trace: dash length = full outline, offset reveals it
  ctx.restore();
  // trace the outline with a growing dash (outline length ≈ 3.1 h)
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.scale(h * dir, h);
  const Lp = 3.2, k = smooth(clamp(u));
  ctx.setLineDash([Lp * k, Lp]); ctx.strokeStyle = rgba(COOL.core, .95); ctx.lineWidth = 3 / h; ctx.shadowColor = rgba(COOL.halo, .8); ctx.shadowBlur = 10;
  ctx.stroke(HP); ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the grasping hand (craving)
// a flat hand (palm + four fingers that curl with g), ochre-gold, x, y = palm centre, s = size; u grows it from the wrist
export function hand(ctx, x, y, s, g, u, o = {}) {
  if (u <= 0) return;
  const k = expoOut(clamp(u)), col = o.col ?? mixHex(OCHRE.body, GOLD.body, .35);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0); ctx.scale(k, k); ctx.globalAlpha *= clamp(u * 3);
  halo(ctx, 0, 0, s * 1.6, .35 * (o.glow ?? 1), OCHRE.mid, OCHRE.hot);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = s * .2;
  ctx.beginPath(); ctx.moveTo(-s * 1.1, s * .1); ctx.lineTo(-s * .3, s * .1); ctx.stroke();   // the wrist / forearm
  ctx.beginPath(); ctx.roundRect(-s * .45, -s * .3, s * .9, s * .65, s * .2); ctx.fill();
  const gg = smooth(clamp(g));
  for (let f = 0; f < 4; f++) { const fy = -s * .24 + f * s * .17, L = s * (.6 - Math.abs(f - 1.5) * .07), q = gg * 2.3;
    ctx.beginPath(); ctx.moveTo(s * .4, fy); ctx.lineTo(s * .4 + Math.cos(q * .5) * L * .5, fy + Math.sin(q * .5) * L * .5);
    ctx.lineTo(s * .4 + Math.cos(q * .5) * L * .5 + Math.cos(q) * L * .5, fy + Math.sin(q * .5) * L * .5 + Math.sin(q) * L * .5); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(s * .1, -s * .3); ctx.lineTo(s * .35 + gg * s * .1, -s * .62 + gg * s * .25); ctx.stroke();   // thumb
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ meditation
// a cushion (flat ellipse, indigo with a cream rim). x, y = centre of its top, w. o.dashed 0..1 (an open place: only a dashed rim), o.u
export function cushion(ctx, x, y, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const d = clamp(o.dashed ?? 0), h = w * .22, k = expoOut(u);
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (d < 1) { ctx.globalAlpha *= 1 - d;
    ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h, [[0, mixHex(P.ind2, P.blue1, .5)], [1, mixHex(P.night1, P.ind2, .4)]]);
    ctx.beginPath(); ctx.ellipse(0, h * .25, w / 2, h * .75, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .7); ctx.beginPath(); ctx.ellipse(0, 0, w / 2 * .92, h * .5, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha /= Math.max(.001, 1 - d); }
  ctx.strokeStyle = rgba(CREAM, .35 + .5 * d); ctx.lineWidth = 2.5; if (d > 0) ctx.setLineDash([12, 9]);
  ctx.beginPath(); ctx.ellipse(0, h * .25, w / 2, h * .75, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}
// a figure sitting cross-legged on a cushion (the kit's indigo person, cut at the hips, crossed legs in front; no face).
// x, y = the seat (cushion top), h = the person's standing height (seated ≈ .55 h). o.look (the head/eye line jumps away), o.u (rises), o.a
export function meditator(ctx, t, x, y, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), dy = (1 - k) * h * .5, b = .5 + .5 * Math.sin(t * 1.3);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.beginPath(); ctx.rect(x - h, y - h * .62 * k - 4, h * 2, h * .62 * k + h * .2); ctx.clip();
  ctx.save(); ctx.beginPath(); ctx.rect(x - h, y - h, h * 2, h - h * .02); ctx.clip();
  E.person(ctx, x, y + h * .45 + dy - b * h * .004, h, { look: o.look ?? .05, armR: [.42, 1.25], armL: [-.42, -1.25], light: -.3, long: true });
  ctx.restore();
  const sh = mixHex(P.ind2, P.night1, .45), body = mixHex(P.ind2, P.blue0, .35);
  ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(x, y - h * .03 + dy, h * .3, h * .07, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(x - h * .09, y - h * .05 + dy, h * .19, h * .05, .1, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(x + h * .09, y - h * .05 + dy, h * .19, h * .05, -.1, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .5); ctx.lineWidth = Math.max(1.5, h * .004); ctx.stroke();
  ctx.restore();
  return { head: [x, y - h * .41 + dy] };
}

// ------------------------------------------------------------------------------------------------ money
// a pot (jar outline): x = centre, y = bottom, w, h; o.u draws the outline on, o.dashed 0..1 (not the same thing: a dashed border),
// o.col, o.fill 0..1 (a dark inside)
export function pot(ctx, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const p = new Path2D(), nw = w * .62, nh = h * .14;
  p.moveTo(x - nw / 2, y - h); p.lineTo(x - nw / 2, y - h + nh); p.bezierCurveTo(x - w * .62, y - h + nh * 1.6, x - w * .56, y - h * .05, x - w * .36, y);
  p.lineTo(x + w * .36, y); p.bezierCurveTo(x + w * .56, y - h * .05, x + w * .62, y - h + nh * 1.6, x + nw / 2, y - h + nh); p.lineTo(x + nw / 2, y - h);
  ctx.save();
  ctx.fillStyle = rgba(P.night0, .45 * u); ctx.fill(p);
  const d = clamp(o.dashed ?? 0), L = 2.9 * (w + h);
  ctx.lineWidth = o.w ?? 4; ctx.lineCap = 'round'; ctx.strokeStyle = rgba(o.col ?? CREAM, .85);
  ctx.shadowColor = rgba(GOLD.halo, .45); ctx.shadowBlur = 8;
  if (d > .5) ctx.setLineDash([18, 12]); else ctx.setLineDash([L * smooth(u), L]);
  ctx.stroke(p);
  if (d > 0 && d <= .5) { ctx.setLineDash([18, 12]); ctx.globalAlpha *= d * 2; ctx.stroke(p); }
  ctx.restore();
}
// one gold coin seen from the side-top (an ellipse with a rim) at x, y, width cw
function flatCoin(ctx, x, y, cw, c) {
  const ch = cw * .32;
  ctx.fillStyle = c[2]; ctx.beginPath(); ctx.ellipse(x, y + ch * .28, cw / 2, ch / 2, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = c[0]; ctx.beginPath(); ctx.ellipse(x, y, cw / 2, ch / 2, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = c[1]; ctx.lineWidth = Math.max(1, cw * .05); ctx.beginPath(); ctx.ellipse(x, y, cw * .36, ch * .34, 0, 0, TAU); ctx.stroke();
}
const PILE = new Map();
// a mountain of coins: base width w at y (bottom), height h; u rises it from the base (rows appear bottom-up, each coin drops a little)
export function coinPile(ctx, t, x, y, w, h, u, o = {}) {
  if (u <= 0) return;
  const cw = o.cw ?? 44, key = `${w}:${h}:${cw}`;
  if (!PILE.has(key)) { const r = prng(700), list = [], rows = Math.round(h / (cw * .2));
    for (let j = 0; j < rows; j++) { const f = j / rows, half = w / 2 * (1 - f) ** .9, n = Math.max(1, Math.round(half * 2 / (cw * .86)));
      for (let i = 0; i < n; i++) list.push([(n > 1 ? lerp(-half + cw / 2, half - cw / 2, i / (n - 1)) : 0) + (r() - .5) * cw * .3, -f * h + (r() - .5) * cw * .08, f, r()]); }
    list.sort((a, b) => b[1] - a[1]); PILE.set(key, list); }
  const cols = [[GOLD.body, GOLD.mid, GOLD.shade], [GOLD.hot, GOLD.body, GOLD.mid], [mixHex(GOLD.body, GOLD.mid, .5), GOLD.shade, GOLD.deep]];
  ctx.save(); ctx.translate(x, y);
  halo(ctx, 0, -h * .45 * clamp(u), w * .9, .45 * clamp(u), GOLD.halo, GOLD.hot);
  for (const [cx, cy, f, rr] of PILE.get(key)) {
    const k = clamp((u * 1.15 - f) / .15); if (k <= 0) continue;
    flatCoin(ctx, cx, cy - (1 - expoOut(k)) * cw * 1.2, cw * lerp(.6, 1, expoOut(k)), cols[Math.floor(rr * 3)]);
  }
  ctx.restore();
}
// a short stack of n coins (a cream-gold), x = centre, y = bottom
export function coinStack(ctx, x, y, n, cw, u = 1) {
  for (let i = 0; i < n; i++) { const k = clamp(u * n - i); if (k <= 0) continue; flatCoin(ctx, x, y - i * cw * .2 - (1 - expoOut(k)) * cw, cw, [GOLD.body, GOLD.mid, GOLD.shade]); }
}

// ------------------------------------------------------------------------------------------------ the facade (one small window)
// a grid of window frames round the lit one at (cx, cy); cell cw × ch, step sx × sy, nx × ny cells. u draws the frames outward.
export function facade(ctx, cx, cy, cw, ch, sx, sy, nx, ny, u, o = {}) {
  if (u <= 0) return;
  for (let i = -nx; i <= nx; i++) for (let j = -ny; j <= ny; j++) {
    const d = Math.hypot(i, j) / Math.hypot(nx, ny), k = clamp((u - d * .6) / .4); if (k <= 0) continue;
    const x = cx + i * sx, y = cy + j * sy, mine = !i && !j;
    ctx.save(); ctx.globalAlpha *= smooth(k);
    if (!mine) { ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(x - cw / 2, y - ch / 2, cw, ch); }
    ctx.strokeStyle = rgba(mine ? CREAM : WALLC.seam, mine ? .8 : .9); ctx.lineWidth = mine ? 10 : 8; ctx.strokeRect(x - cw / 2, y - ch / 2, cw, ch);
    if (!mine) { ctx.strokeStyle = rgba(WALLC.seam, .7); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y - ch / 2); ctx.lineTo(x, y + ch / 2); ctx.stroke(); }
    ctx.restore();
  }
}

// ------------------------------------------------------------------------------------------------ word bars (a sentence in your head)
// one word as a short cream bar with rounded ends; u slides it in from (fx, fy) out of the dark to (x, y)
export function wordBar(ctx, x, y, w, hgt, u, fx, fy, o = {}) {
  if (u <= 0) return;
  const e = sineIO(clamp(u)), xx = lerp(fx, x, e), yy = lerp(fy, y, e) - Math.sin(Math.PI * e) * 30;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2) * (o.a ?? 1);
  ctx.fillStyle = o.col ?? CREAM; ctx.shadowColor = rgba(P.core1, .5); ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.roundRect(xx, yy - hgt / 2, w, hgt, hgt / 2); ctx.fill(); ctx.restore();
}
// a subscribe pill (cream outline, coat-yellow dot), x, y centre; u grows it from the centre
export function pill(ctx, t, x, y, txt, u, o = {}) {
  if (u <= 0) return;
  ctx.save(); ctx.font = '700 30px Inter'; ctx.letterSpacing = '0.14em';
  const tw = ctx.measureText(txt).width, w = tw + 110, h = 66, k = expoOut(clamp(u));
  ctx.translate(x, y); ctx.globalAlpha *= clamp(u * 2);
  ctx.fillStyle = rgba(P.night0, .7); ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(-w / 2 * k, -h / 2, w * k, h, h / 2); ctx.fill(); ctx.stroke();
  ctx.restore();
  ringDot(ctx, t, x - tw / 2 - 26, y, 11 * expoOut(span(u, .3, 1)));
  X.label(ctx, txt, x + 18, y + 11, span(u, .35, 1), { size: 30, spacing: .14 });
}
function ringDot(ctx, t, x, y, r) { if (r <= 0) return; halo(ctx, x, y, r * 3, .5, COAT.base, COAT.lit); ctx.fillStyle = COAT.lit; ctx.beginPath(); ctx.arc(x, y, r * (1 + .1 * Math.sin(t * 4)), 0, TAU); ctx.fill(); }

// a thread (a COOL line) from a to b with a sag (px; 0 = taut) and a small live wobble; u draws it on from a
export function thread(ctx, t, a, b, u, o = {}) {
  if (u <= 0) return;
  const sag = o.sag ?? 0, n = 28, pts = [];
  for (let i = 0; i <= n; i++) { const f = i / n; pts.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f) + Math.sin(Math.PI * f) * sag + Math.sin(f * 9 + t * 3) * (o.wob ?? 2) * Math.sin(Math.PI * f)]); }
  X.lightLine(ctx, pts, u, { col: rgba(o.col ?? COOL.line, o.a ?? .85), w: o.w ?? 2.4, glowCol: o.glowCol ?? COOL.halo, blur: 8 });
}
