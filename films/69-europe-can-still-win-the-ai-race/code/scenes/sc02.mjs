// c02 · B1 · 'Those chip machines' → 'Money first'. Station 1 (the machine) · the strengths not connected · the Draghi report · C1 ·
// 1 in 6 · ANCHOR 2/4 (the turn: the five parts on the moon, the piece in your hands) · the test question → the HUD.
// One draw function; the only cuts are the two planned W (into the anchor on 'For AI, five parts', out of it on 'One test for all five'),
// both match cuts on the plan disc (same place, same size). Everything else hands over through a carrier object.
//
// | ID    | anchor (phrase)            | zeigt wörtlich                                              | kind   | carrier out                           |
// |-------|----------------------------|-------------------------------------------------------------|--------|---------------------------------------|
// | 1.01  | Those chip machines        | pull back: the hall, the town plan (canals): ASML · VELDHOVEN | MIX    | the machine                           |
// | 1.02  | Each is the size of a bus  | a bus rolls in under it, same length (measuring lines)      | EXPL   | the machine                           |
// | 1.03  | Shipping one fills         | wrapped, it breaks into crates that load into 3 cargo jets  | EXPL   | the jets fly right (camera follows)   |
// | 1.04  | And almost every advanced  | a machine at work prints one chip, then hundreds, lines back | EXPL  | the lines                             |
// | 1.05★ | This year, by its own      | the lines thicken into sales arrows right; Europe's stays empty: 0% | EXPL | the machine                     |
// | 1.06  | So the strengths are real  | three lights: machines, savings, minds; a dashed line breaks | EXPL  | the dashed line                       |
// | 1.07  | The plan to connect them   | the broken line rolls up into the report: €750–800 BILLION  | EXPL   | the report cover flips                |
// | 1.08  | A year later, he gave      | the cover turns, its back grows into the clip plate         | MIX    | the plate                             |
// | 1.09  | slot C1                    | Draghi: "a harder place"                                    | CLIP   | the plate shrinks into the cover      |
// | 1.10  | A harder place             | the cover opens into 383 squares, 60 gold: 1 IN 6 DONE       | EXPL   | the squares fold into the five outlines |
// | 1.11  | For AI, five parts         | W · ANCHOR 2/4: the moon = the plan, each part lights with its name | ANCHOR | the fifth piece            |
// | 1.12  | That last one can't        | the fifth piece leaves the moon into your hands             | ANCHOR | the moon                              |
// | 1.13  | One test for all five      | W · the same disc on the sheet: REALLY THERE, OR ONLY ON PAPER? → the HUD | EXPL | the HUD           |
//
// Named exports below are B1's shared helpers (the group's own kit, imported by sc03–sc05; the lead's lib stays untouched).
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f69_kit.mjs';
import * as S from '../lib/f69_world.mjs';
import * as X from '../lib/f69_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, prng } = E;
const { GOLD, COOL, CREAM, CREAM2, LAMP, PAPER, SOURCES: SRC } = F;
const PR = F.PRINT69, TAU = Math.PI * 2;

// ================================================================================================ B1 helpers (shared by sc02–sc05)
// lab(t, a, b): a text's life: rises over .7 s from a, sinks over the last .45 s before b
export const lab = (t, a, b, din = .7, dout = .45) => span(t, a, a + din) * (1 - span(t, b - dout, b + .05));
// the plain sheet view at every inner seam of the group (both sides draw it, so the frames match): a slow drift, no zoom
// at the two plain-sheet seams (c02|c03, c03|c04) the view also glides through the seam (a slow push to the right that settles back within a few seconds, < 26 px), so the seam
// frames are never frozen; the times are phrases (initSeams(T), called by every B1 scene; idempotent)
let SEAM_T = null;
export const initSeams = (T) => { if (!SEAM_T) SEAM_T = [T.G('Money first'), T.G('But why does it matter')]; };
const glide = (t) => (SEAM_T ? SEAM_T.reduce((a, ts) => a + 26 * Math.tanh((t - ts) / 1.1) * Math.exp(-(((t - ts) / 4.5) ** 2)), 0) : 0);
export const plainView = (t) => ({ x: 960 + 22 * Math.sin(t * .09) + glide(t), y: 540 + 12 * Math.sin(t * .07 + 1), s: 1 });
// THE HUD: a copy of F.kitHud (lib/f69_kit.mjs) with transitions the kit version does not have: the big labels rise / sink behind their
// masks (no alpha fades), the small texts sink while the disc grows, THE MINDS piece can fly back into its slot (o.p4), the glow is
// settable. Without options it draws what F.kitHud draws. o: { big 0..1 (sineIO inside), bx, by, br, lab 0..1 | [5], txt 0..1, parts,
// glow, p4 0..1, p4from [dx, dy, rot], dx, dy, lit2 0..1 (piece 3 lit, for the plateEnergy hand-over) }
export function hud(ctx, t, T, o = {}) {
  const Sk = F.kitParts(T, t), a = (o.a ?? 1) * Sk.on; if (a <= 0) return null;
  const HUD = F.HUD, bg = sineIO(clamp(o.big ?? 0)); let parts = o.parts ?? Sk.parts;
  if (o.lit2) parts = parts.map((p, i) => (i === 2 ? { ...p, lit: Math.max(p.lit ?? 0, o.lit2) } : p));
  const r = lerp(HUD.r, o.br ?? 230, bg), cx = lerp(HUD.x + (1 - Sk.slide) * 300, o.bx ?? W / 2, bg) + (o.dx ?? 0), cy = lerp(HUD.y, o.by ?? 440, bg) + (o.dy ?? 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= a;
  const p4 = o.p4 == null ? 1 : clamp(o.p4), pp = p4 < 1 ? parts.map((p, i) => (i === 4 ? { ...p, fade: 0 } : p)) : parts;
  F.kitDisc(ctx, t, cx, cy, r, pp, { glow: o.glow ?? lerp(.35, 1, bg), stars: 0, loose: o.loose ?? { x: cx + r * 1.3, y: cy + r * 1.1, rot: .35 } });
  if (p4 < 1 && p4 > 0) {   // THE MINDS piece returns to the plan (it was in your hands)
    const [sx, sy] = F.pieceCentre(4, cx, cy, r), [fx, fy, fr] = o.p4from ?? [r * .9, r * 1.1, .6], k = sineIO(p4);
    F.loosePiece(ctx, t, 4, sx + fx * (1 - k), sy + fy * (1 - k) - Math.sin(Math.PI * k) * r * .2, r, { kind: 'blank', lit: .8, rot: fr * (1 - k), glow: 0 });
  }
  const lu = o.lab ?? span(bg, .55, 1);
  F.KIT.parts.forEach((p, i) => {   // every piece labelled: name + verdict (they rise / sink behind the mask)
    const u = Array.isArray(lu) ? lu[i] : lu; if (u <= 0) return;
    const q = F.PIECE_ANG[i], lx = cx + Math.cos(q) * r * 1.42, ly = cy + Math.sin(q) * r * 1.42, al = Math.abs(Math.cos(q)) < .3 ? 'center' : Math.cos(q) > 0 ? 'left' : 'right';
    const st = parts[i], vd = st.kind === 'blank' ? '' : p.verdict;
    F.goldText(ctx, [[p.name, 0]], lx, ly, 24, F.rise(u), { serif: false, weight: 700, spacing: .06, align: al, col: CREAM });
    if (vd) F.goldText(ctx, [[vd, st.kind === 'half' ? 1 : 0]], lx, ly + 32, 22, F.rise(Math.min(u, clamp(st.u * 1.5))), { serif: false, weight: 600, spacing: .1, align: al, col: st.kind === 'half' ? GOLD.text : CREAM2 });
  });
  const tu = (o.txt ?? 1) * (1 - span(bg, 0, .3));
  if (tu > 0) {   // the small HUD texts (as kitHud); they sink while the disc grows
    const xr = HUD.x + HUD.r + 10 + (o.dx ?? 0), y0 = HUD.y + HUD.r + 44 + (o.dy ?? 0);
    if (Sk.cur >= 0 && Sk.name > 0) {
      const p = F.KIT.parts[Sk.cur], st = parts[Sk.cur], n = Sk.name * tu;
      F.goldText(ctx, [[`PART ${Sk.cur + 1} OF 5`, .9]], xr, y0, 22, F.rise(n), { serif: false, weight: 700, spacing: .06, align: 'right' });
      F.goldText(ctx, [[p.name, 0]], xr, y0 + 32, 22, F.rise(span(n, .2, 1)), { serif: false, weight: 600, spacing: .05, align: 'right', col: CREAM });
      if (st.kind !== 'blank') F.goldText(ctx, [[p.verdict, st.kind === 'half' ? 1 : 0]], xr, y0 + 64, 22, F.rise(Math.min(tu, clamp(st.u * 1.4))), { serif: false, weight: 700, spacing: .1, align: 'right', col: st.kind === 'half' ? GOLD.text : CREAM });
    } else if (Sk.test > 0) {
      const n = Sk.test * tu;
      F.goldText(ctx, [['REALLY THERE,', .3]], xr, y0, 22, F.rise(n), { serif: false, weight: 700, spacing: .06, align: 'right' });
      F.goldText(ctx, [['OR ONLY ON PAPER?', 0]], xr, y0 + 32, 22, F.rise(span(n, .2, 1)), { serif: false, weight: 700, spacing: .06, align: 'right', col: CREAM });
    }
  }
  ctx.restore();
  return { cx, cy, r };
}
// the names round the plan disc in the anchor (same layout as hud's big labels): u[i] per piece
export function discLabels(ctx, cx, cy, r, u) {
  F.KIT.parts.forEach((p, i) => {
    if (u[i] <= 0) return;
    const q = F.PIECE_ANG[i], lx = cx + Math.cos(q) * r * 1.42, ly = cy + Math.sin(q) * r * 1.42, al = Math.abs(Math.cos(q)) < .3 ? 'center' : Math.cos(q) > 0 ? 'left' : 'right';
    F.goldText(ctx, [[p.name, 0]], lx, ly, 24, F.rise(u[i]), { serif: false, weight: 700, spacing: .06, align: al, col: CREAM });
  });
}
// a city bus, side view, nose right: x, y = middle of the base, L = length
export function bus(ctx, t, x, y, L, o = {}) {
  const h = L * .27, x0 = x - L / 2, wob = Math.sin(t * 9) * L * .0012 * (o.drive ?? 0);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x, y + 2, L * .52, L * .02, 0, 0, TAU); ctx.fill();
  ctx.translate(0, wob);
  const body = new Path2D(); body.roundRect(x0, y - h - L * .03, L, h, [L * .03, L * .045, L * .02, L * .02]);
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, mixHex(P.blue1, P.cream, .3)], [1, mixHex(P.blue1, P.night1, .35)]]); ctx.fill(body);
  ctx.save(); ctx.clip(body);
  for (let k = 0; k < 9; k++) { const wx = x0 + L * (.06 + k * .092); ctx.fillStyle = rgba(LAMP.body, .55 + .2 * Math.sin(t * .7 + k)); ctx.fillRect(wx, y - h * 1.02, L * .072, h * .36); }
  ctx.fillStyle = rgba(P.night1, .6); ctx.fillRect(x0 + L * .91, y - h * 1.02, L * .09, h * .62);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(x0 + L * .45, y - h * .98, L * .055, h * .9);
  ctx.fillStyle = rgba(P.cream, .22); ctx.fillRect(x0, y - h * .5, L, 3);
  ctx.restore();
  for (const f of [.17, .8]) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(x0 + L * f, y - L * .028, L * .042, 0, TAU); ctx.fill(); ctx.fillStyle = mixHex(P.blue1, P.night0, .4); ctx.beginPath(); ctx.arc(x0 + L * f, y - L * .028, L * .017, 0, TAU); ctx.fill(); }
  halo(ctx, x0 + L, y - h * .3, L * .05, .45, LAMP.body, LAMP.core);
  ctx.restore();
}
// a chip (COOL): a small square die with pins, x, y = centre, s = size
export function chip(ctx, x, y, s, a = 1, glow = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = mixHex(COOL.body, P.cream, .25); const p = s * .12;
  for (let k = 0; k < 4; k++) { const o = -s * .3 + k * s * .2; ctx.fillRect(x + o - p * .3, y - s * .62, p * .6, s * 1.24); ctx.fillRect(x - s * .62, y + o - p * .3, s * 1.24, p * .6); }
  ctx.fillStyle = mixHex(P.night1, COOL.deep, .6); ctx.fillRect(x - s / 2, y - s / 2, s, s);
  ctx.fillStyle = COOL.body; ctx.fillRect(x - s * .3, y - s * .3, s * .6, s * .6);
  ctx.restore();
  if (glow > 0) halo(ctx, x, y, s * 2.2, .3 * glow * a, COOL.halo, COOL.core);
}
// a stack of coins (the savings, warm): x, y = base centre, w = coin width, n coins
export function coins(ctx, t, x, y, w, n) {
  const h = w * .16;
  for (let k = 0; k < n; k++) {
    const yy = y - k * h * .82 - h / 2, jx = Math.sin(k * 2.3 + x) * w * .03;
    ctx.fillStyle = mixHex(GOLD.mid, LAMP.deep, .3); ctx.beginPath(); ctx.ellipse(x + jx, yy + h * .2, w / 2, h * .5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = k === n - 1 ? mixHex(GOLD.hot, LAMP.body, .4) : mixHex(GOLD.body, LAMP.body, .35); ctx.beginPath(); ctx.ellipse(x + jx, yy, w / 2, h * .5, 0, 0, TAU); ctx.fill();
  }
}
// THE VAULT (the savings in the bank): a round door, gold inside behind bars; x, y = centre, r; o.fill 0..1, o.door 0..1 (the ring draws on)
export function vault(ctx, t, x, y, r, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a;
  const fl = clamp(o.fill ?? 1);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .55); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  if (fl > 0) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r * .86, 0, TAU); ctx.clip();
    const top = y + r * .86 - 2 * r * .86 * fl + Math.sin(t * 1.3) * r * .01;
    ctx.fillStyle = lin(ctx, 0, top, 0, y + r, [[0, GOLD.hot], [.4, GOLD.body], [1, GOLD.shade]]); ctx.fillRect(x - r, top, 2 * r, y + r - top);
    ctx.fillStyle = rgba(GOLD.core, .5); for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.ellipse(x - r * .72 + k * r * .18, top + 4 + (k % 2) * 5, r * .09, r * .03, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    halo(ctx, x, y + r * .3, r * 1.4, .22 * fl, GOLD.halo, GOLD.core);
  }
  ctx.strokeStyle = rgba(P.night0, .55); ctx.lineWidth = r * .045; for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(x + k * r * .22, y - r * .82); ctx.lineTo(x + k * r * .22, y + r * .82); ctx.stroke(); }
  const d = clamp(o.door ?? 1);
  X.lightLine(ctx, Array.from({ length: 49 }, (_, k) => [x + Math.cos(-Math.PI / 2 + k / 48 * TAU) * r, y + Math.sin(-Math.PI / 2 + k / 48 * TAU) * r]), d, { w: r * .05, col: rgba(CREAM, .85) });
  ctx.restore();
  return { hx: x + r * 1.02, hy: y };
}
// a company block on a ground line: x = centre, y = ground, w, h (grows from the ground: o.u); o.lean (rad, round the base corner o.pivot),
// o.top (a big lit window near the top: its screen rect is returned), o.cool (cool windows), o.lit
export function block(ctx, t, x, y, w, h, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const hh = h * expoOut(u), lean = o.lean ?? 0, pv = o.pivot ?? 0;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x + pv * w / 2, y); ctx.rotate(lean); ctx.translate(-pv * w / 2, 0);
  ctx.beginPath(); ctx.rect(-w, -h * 1.7, w * 2, h * 1.7 + 1); ctx.clip();
  ctx.fillStyle = lin(ctx, -w / 2, -hh, w / 2, 0, [[0, mixHex(P.ind2, P.blue1, .6)], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.fillRect(-w / 2, -hh, w, hh);
  ctx.fillStyle = rgba(mixHex(GOLD.line, P.blue1, .45), .6); ctx.fillRect(-w / 2, -hh, w, 2);
  const cols = o.cols ?? 3, cw = w / cols, fh = cw * .9, rows = Math.max(1, Math.floor(hh / fh));
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const wy = -(j + 1) * fh + fh * .25; if (o.top && j === rows - 1) continue;
    ctx.fillStyle = rgba(o.cool ? COOL.body : LAMP.body, (o.lit ?? .7) * (.75 + .25 * Math.sin(t * .6 + i * 1.7 + j * 2.3)));
    ctx.fillRect(-w / 2 + i * cw + cw * .22, wy, cw * .56, fh * .5);
  }
  let top = null;
  if (o.top) { const ty = -rows * fh + fh * .2; top = { x: -w / 2 + w * .12, y: ty, w: w * .76, h: fh * .56 }; ctx.fillStyle = rgba(LAMP.body, .92); ctx.fillRect(top.x, top.y, top.w, top.h); halo(ctx, 0, ty + top.h / 2, w * .6, .25, LAMP.body, LAMP.core); }
  ctx.restore();
  const m = ctx.getTransform();
  const map = (px, py) => { const c = Math.cos(lean), s = Math.sin(lean), ux = px + pv * w / 2 - pv * w / 2, X0 = x + pv * w / 2 + (ux - pv * w / 2) * c - py * s, Y0 = y + (ux - pv * w / 2) * s + py * c; return [m.a * X0 + m.c * Y0 + m.e, m.b * X0 + m.d * Y0 + m.f]; };
  const out = { roof: y - hh };
  if (top) { const [ax, ay] = map(top.x, top.y), [bx, by] = map(top.x + top.w, top.y + top.h); out.top = { x: ax, y: ay, w: bx - ax, h: by - ay }; }
  return out;
}
// a report cover (paper): x, y = centre, w; o.lines [[text, size, serif]] (o.wu writes them), o.u slides up, o.sx (flip: 1 → 0 edge-on)
export function cover(ctx, t, x, y, w, o = {}) {
  const h = w * 1.32, u = clamp(o.u ?? 1); if (u <= 0) return null;
  const k = expoOut(u), sx = o.sx ?? 1, sy = o.sy ?? 1; if (sx <= .01 || sy <= .01) return { x: x - 1, y: y - h / 2, w: 2, h };
  ctx.save(); ctx.translate(x, y + (1 - k) * 40); ctx.rotate(o.rot ?? -.02); ctx.scale(sx, sy);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(-w / 2 + 8, -h / 2 + 12, w, h);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = mixHex(P.ind1, P.blue0, .4); ctx.fillRect(-w / 2, -h / 2, w, h * .07);
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.strokeRect(-w / 2, -h / 2, w, h);
  let yy = -h * .22;
  for (const [i, [txt, size, serif]] of (o.lines ?? []).entries()) {
    F.maskLine(ctx, [[txt, 0]], -w / 2 + w * .1, yy, size, F.rise(span(o.wu ?? 1, i * .18, .6 + i * .18)), { serif: serif ?? true, weight: 600, col: serif === false ? PAPER.faint : PAPER.ink, glow: false });
    yy += size * 1.3;
  }
  ctx.fillStyle = rgba(PAPER.faint, .35); for (let j = 0; j < 6; j++) ctx.fillRect(-w * .4, h * .14 + j * h * .045, w * (j === 5 ? .4 : .8), Math.max(1, h * .008));
  ctx.restore();
  return { x: x - w * sx / 2, y: y - h * sy / 2 + (1 - k) * 40, w: w * sx, h: h * sy };
}
// a stack of company-law files (paper sheets, askew): x = centre, y = base, w, n sheets; o.u rises out of the ground line
export function fileStack(ctx, t, x, y, w, n, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const r = prng(o.seed ?? 3), sh = w * .2, k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (u < 1) { ctx.beginPath(); ctx.rect(x - w * 2, y - n * sh - w * 2, w * 4, n * sh + w * 2); ctx.clip(); }
  ctx.translate(0, (1 - k) * (n * sh + 10));
  for (let j = 0; j < n; j++) {
    const jx = (r() - .5) * w * .16, yy = y - (j + 1) * sh;
    ctx.fillStyle = j % 2 ? PAPER.body : PAPER.lit; ctx.fillRect(x - w / 2 + jx, yy, w, sh * .8);
    ctx.fillStyle = rgba(PAPER.edge, .75); ctx.fillRect(x - w / 2 + jx, yy + sh * .8, w, sh * .2);
  }
  ctx.restore();
}
// the hemicycle (parliament from above, no party colours): x, y = centre of the floor, R; o.u rows light from the front
export function hemicycle(ctx, t, x, y, R, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const rows = 8;
  for (let j = 0; j < rows; j++) {
    const rr = R * (.38 + j * .62 / (rows - 1)), n = Math.round(10 + j * 4.2), ru = clamp(u * 1.6 - j / rows * .6); if (ru <= 0) continue;
    for (let k = 0; k <= n; k++) {
      const q = Math.PI + k / n * Math.PI, sx = x + Math.cos(q) * rr, sy = y + Math.sin(q) * rr * .62 - (1 - expoOut(ru)) * 20;
      ctx.fillStyle = rgba(CREAM, (.4 + .3 * Math.sin(t * .8 + k * .7 + j)) * ru); ctx.beginPath(); ctx.arc(sx, sy, R * .024, 0, TAU); ctx.fill();
    }
  }
  ctx.restore();
}
// the foreign plug (COOL): a socket block with two prongs facing left; x, y = centre, s
export function plug(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, y, s * 2.2, .35 * (o.glow ?? 1), COOL.halo, COOL.core);
  ctx.fillStyle = mixHex(COOL.deep, COOL.body, .35); ctx.beginPath(); ctx.roundRect(x - s * .4, y - s * .5, s * .8, s, s * .14); ctx.fill();
  ctx.fillStyle = COOL.core; ctx.fillRect(x - s * .62, y - s * .22, s * .24, s * .09); ctx.fillRect(x - s * .62, y + s * .13, s * .24, s * .09);
  ctx.fillStyle = rgba(COOL.core, .85); ctx.beginPath(); ctx.arc(x + s * .05, y, s * .1, 0, TAU); ctx.fill();
  ctx.restore();
}
// the fund as a vessel: x = centre, y = ground, w, h; o.fill 0..1 (gold), o.target 0..1 (the dashed target line), o.morph 0..1 (bar → jar)
export function vessel(ctx, t, x, y, w, h, o = {}) {
  const m = sineIO(clamp(o.morph ?? 1)), bw = lerp(o.barW ?? w * .5, w, m), rr = lerp(4, w * .28, m), neck = m * w * .14;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const p = new Path2D(); p.moveTo(x - bw / 2 + neck, y - h); p.lineTo(x - bw / 2 + neck, y - h + neck * 1.5);
  p.quadraticCurveTo(x - bw / 2, y - h + neck * 2, x - bw / 2, y - h + neck * 3 + 2); p.lineTo(x - bw / 2, y - rr); p.quadraticCurveTo(x - bw / 2, y, x - bw / 2 + rr, y);
  p.lineTo(x + bw / 2 - rr, y); p.quadraticCurveTo(x + bw / 2, y, x + bw / 2, y - rr); p.lineTo(x + bw / 2, y - h + neck * 3 + 2);
  p.quadraticCurveTo(x + bw / 2, y - h + neck * 2, x + bw / 2 - neck, y - h + neck * 1.5); p.lineTo(x + bw / 2 - neck, y - h); p.closePath();
  ctx.fillStyle = rgba(P.night1, .75); ctx.fill(p);
  const f = clamp(o.fill ?? 0);
  if (f > 0) { ctx.save(); ctx.clip(p); const top = y - h * f + Math.sin(t * 1.4) * 2; ctx.fillStyle = lin(ctx, 0, top, 0, y, [[0, GOLD.hot], [.5, GOLD.body], [1, GOLD.shade]]); ctx.fillRect(x - bw, top, bw * 2, h * f + 4);
    ctx.fillStyle = rgba(GOLD.core, .6); ctx.fillRect(x - bw, top, bw * 2, 3); ctx.restore(); halo(ctx, x, y - h * f * .5, w * 1.1, .28 * f, GOLD.halo, GOLD.core); }
  ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 3; ctx.stroke(p);
  if ((o.target ?? 0) > 0) { ctx.save(); ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 12; ctx.strokeStyle = rgba(GOLD.line, .85 * o.target); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - bw / 2 - 24, y - h * .9); ctx.lineTo(x + bw / 2 + 24, y - h * .9); ctx.stroke(); ctx.restore(); }
  ctx.restore();
}
// a horizontal bar growing from x0 to length L (u); o.col, o.h, o.dashFrom (the rest is a dashed outline)
export function hbar(ctx, t, x0, y, L, u, o = {}) {
  u = clamp(u); if (u <= 0) return 0;
  const h = o.h ?? 34, len = L * expoOut(u), df = o.dashFrom ?? 1, col = o.col ?? CREAM;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x0, y - h / 2, Math.max(1, Math.min(len, L * df)), h, [0, 4, 4, 0]); ctx.fill();
  if (len > L * df) { ctx.setLineDash([8, 6]); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.strokeRect(x0 + L * df, y - h / 2 + 1.5, len - L * df, h - 3); }
  ctx.restore(); return len;
}
// a vertical bar growing up from y (u); o.dashFrom (the top part dashed: a projection)
export function vbar(ctx, t, x, y, w, H0, u, o = {}) {
  u = clamp(u); if (u <= 0) return 0;
  const hh = H0 * expoOut(u), df = o.dashFrom ?? 1, col = o.col ?? CREAM;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  const solid = Math.min(hh, H0 * df); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - w / 2, y - solid, w, Math.max(1, solid), [4, 4, 0, 0]); ctx.fill();
  if (hh > H0 * df) { ctx.setLineDash([9, 7]); ctx.lineDashOffset = -t * 10; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x - w / 2 + 1.5, y - hh, w - 3, hh - solid); }
  ctx.restore(); return hh;
}
// a negotiating table, side view: x = centre, y = the top, w
export function table(ctx, t, x, y, w, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = mixHex(P.night1, P.blue1, .35); ctx.fillRect(x - w / 2, y, w, 22); ctx.fillRect(x - w / 2 + 30, y + 22, 14, 140); ctx.fillRect(x + w / 2 - 44, y + 22, 14, 140);
  ctx.fillStyle = rgba(mixHex(GOLD.line, P.blue1, .4), .55); ctx.fillRect(x - w / 2, y, w, 2);
  ctx.restore();
}
// an arrow band from a to b (sheet units): width w (shaft), head at b; o.col fill, o.dash (outline only), o.flow (light pulses moving to b)
export function arrowBand(ctx, t, a, b, w, o = {}) {
  if (w <= .5) return;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, hl = Math.min(L * .3, w * 2.2), hw = w * 1.15;
  const p = new Path2D(), e = [b[0] - ux * hl, b[1] - uy * hl];
  p.moveTo(a[0] + nx * w / 2, a[1] + ny * w / 2); p.lineTo(e[0] + nx * w / 2, e[1] + ny * w / 2); p.lineTo(e[0] + nx * hw, e[1] + ny * hw); p.lineTo(b[0], b[1]);
  p.lineTo(e[0] - nx * hw, e[1] - ny * hw); p.lineTo(e[0] - nx * w / 2, e[1] - ny * w / 2); p.lineTo(a[0] - nx * w / 2, a[1] - ny * w / 2); p.closePath();
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  if (o.dash) { ctx.setLineDash(o.dash); ctx.lineDashOffset = -t * 20; ctx.strokeStyle = o.col ?? CREAM; ctx.lineWidth = o.lw ?? 4; ctx.stroke(p); }
  else {
    ctx.fillStyle = o.col ?? rgba(COOL.body, .5); ctx.fill(p);
    if (o.flow) { ctx.save(); ctx.clip(p); for (let k = 0; k < 6; k++) { const f = ((t * .45 + k / 6) % 1), px = a[0] + dx * f, py = a[1] + dy * f; halo(ctx, px, py, w * 1.4, .35 * o.flow, COOL.halo, COOL.core); } ctx.restore(); }
  }
  ctx.restore();
}

// ================================================================================================ c02
export default async (T, R) => {
  initSeams(T);
  const G = (p, n = 0) => T.G(p, n, R.a - .01);
  const A = {
    a: R.a, single: G('a single company'), dutch: G('Dutch town'), bus: G('Each is the size'), ship: G('Shipping one fills'), jets: G('three cargo jets'),
    every: G('And almost every'), printed: G('was printed by one'), year: G('This year, by its own'), nothing: G('absolutely nothing'),
    real: G('So the strengths are real'), notc: G('just not connected'), conn: G('connected'), plan: G('The plan to connect them'), draghi: G('Mario Draghi'),
    wrote: G('wrote it down'), later: G('A year later, he gave'), harder: G('A harder place'), one6: G('one in six'), carried: G('fully carried out'),
    five: G('For AI, five parts'), last: G("That last one can't"), won: G('It has to be won'), test: G('One test for all five'), really: G('really there'),
    paper: G('only on paper'), end: R.b,
  };
  const C1 = T.clip('C1'), KT = F.kitTimes(T), tS = A.a + S.SEAM_HALF;

  // ---------------------------------------------------------------- the sheet camera (station 1 → the three strengths)
  const MX = 960, GY = 700, ML = 1100, BY = 1060, M2 = { x: 5200, y: 760, L: 860 };
  const VM = [
    [tS, { x: 960, y: 520, s: 1.04 }], [A.dutch + .7, { x: 960, y: 500, s: .4 }], [A.bus + 1.3, { x: 960, y: 640, s: .62 }], [A.ship + .3, { x: 1000, y: 660, s: .6 }],
    [A.ship + 1.4, { x: 1700, y: 760, s: .55 }], [A.jets + .9, { x: 1850, y: 760, s: .55 }], [A.every + 1.9, { x: 5650, y: 690, s: .62 }],
    [A.year + .2, { x: 5700, y: 690, s: .62 }], [A.year + 1.8, { x: 5150, y: 720, s: .55 }], [A.real + .3, { x: 5160, y: 712, s: .54 }],
    [A.real + 2.1, { x: 5200, y: 610, s: .36 }], [A.five, { x: 5230, y: 604, s: .345 }],
  ];
  const vm = (t) => X.viewPath(t, VM);

  // the town plan of 1.01: street blocks (seeded) + two canals, never over the hall
  const BLOCKS = []; { const r = prng(41); for (let gx = -1500; gx < 3500; gx += 380) for (let gy = -1300; gy < 1800; gy += 340) {
    const x = gx + r() * 40, y = gy + r() * 30, w = 240 + r() * 90, h = 200 + r() * 80;
    if (x + w > 60 && x < 1860 && y + h > -140 && y < 790) continue; if (Math.abs(x - 2280) < 260 || Math.abs(y - 1050) < 160) continue;
    BLOCKS.push([x, y, w, h, Math.hypot(x + w / 2 - 960, y + h / 2 - 380) / 2600]); } }
  const CANALS = [[[-1700, 1110], [-400, 1000], [800, 1080], [2000, 980], [3600, 1060]], [[2300, -1500], [2250, -300], [2330, 700], [2270, 1900]]];
  const HALL = (() => { const x0 = 120, x1 = 1800, top = 40, pts = [[x0, GY], [x0, top]]; for (let k = 0; k < 7; k++) { const a = x0 + k * (x1 - x0) / 7, b = x0 + (k + 1) * (x1 - x0) / 7; pts.push([a, top], [b, top - 90], [b, top]); } pts.push([x1, GY]); return pts; })();
  // 12 crates over the machine's silhouette, 4 per jet
  const CR = []; [[5, 700], [5, 556], [2, 412]].forEach(([n, y], row) => { for (let k = 0; k < n; k++) CR.push([530 + k * 215, y]); });
  const JETS = [2150, 2700, 3250], JL = 480, JY = BY - JL * .07, tSplit = A.jets - .2, tOff = A.jets + .75;
  const jetPos = (j, t) => { const d = Math.max(0, t - tOff - (2 - j) * .16); return [JETS[j] + 900 * d * d, JY - 380 * Math.max(0, d - .7) ** 2, -.04 - .1 * clamp(d - .7)]; };
  // the chips of 1.04: 240 in a field right of the machine at work
  const STAGE = [M2.x, M2.y - M2.L * .3 * .3], CH = Array.from({ length: 240 }, (_, i) => { const c = i % 20, r = Math.floor(i / 20); return { x: M2.x + 640 + c * 54, y: 330 + r * 56, q: ((i * 53) % 240) / 240 }; });
  const ARR = [[7800, 300], [7900, 700], [7700, 1100]], EU = [3850, 690];
  const LIGHTS = [[3300, 'THE SAVINGS'], [M2.x, 'THE MACHINES'], [7100, 'THE MINDS']], LY = 330;
  // the dashed line between the three strengths, broken (br 0..1): four halves, each hangs from its light, droops and shortens
  const halves = (br) => {
    const P0 = LIGHTS.map(([x]) => [x, LY]);
    return [[P0[0], P0[1]], [P0[1], P0[0]], [P0[1], P0[2]], [P0[2], P0[1]]].map(([a, b]) => {
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], L = Math.hypot(m[0] - a[0], m[1] - a[1]) * (1 - .14 * br);
      const dir = Math.atan2(m[1] - a[1], m[0] - a[0]) + (a[0] < b[0] ? 1 : -1) * .22 * br;
      return [a, [a[0] + Math.cos(dir) * L, a[1] + Math.sin(dir) * L]];
    });
  };

  function stationStage(ctx, t) {
    const v = vm(t);
    X.sheet(ctx, t, v, { lx: lerp(960, M2.x, span(t, A.jets, A.every + 1.6)), ly: 470 });
    const hall = span(t, A.a + .8, A.single + .9) * (1 - span(t, A.bus - .2, A.bus + .7)), town = span(t, A.single + .2, A.dutch + 1.0) * (1 - span(t, A.bus - .2, A.bus + .7));
    const sinkL = expoIn(span(t, A.plan + .1, A.plan + 1.2)) * 900;
    X.inView(ctx, v, (s) => {
      // 1.01 the town plan + the hall
      if (town > 0) {
        ctx.lineWidth = 2.2 / s;
        for (const [x, y, w, h, d] of BLOCKS) { const k = clamp(town * 1.9 - d * .9); if (k <= 0) continue; ctx.strokeStyle = rgba(CREAM, .2 * k); ctx.strokeRect(x, y + (1 - expoOut(k)) * 30, w, h); }
        for (const c of CANALS) for (const off of [-34, 34]) X.lightLine(ctx, c.map(([x, y]) => [x + (c === CANALS[1] ? off : 0), y + (c === CANALS[0] ? off : 0)]), town, { col: rgba(COOL.line, .45), w: 5, glow: false });
      }
      if (hall > 0) X.lightLine(ctx, HALL, hall, { col: rgba(CREAM, .7), w: 6 });
      // ground lines
      X.lightLine(ctx, [[MX, GY], [MX - 2600, GY]], span(t, A.a + .6, A.a + 2.2) * (1 - span(t, A.ship + .9, A.jets + .6)), { a: .45, w: 4 });
      X.lightLine(ctx, [[MX, GY], [MX + 2400, GY]], span(t, A.a + .6, A.a + 2.2) * (1 - span(t, A.ship + .9, A.jets + .6)), { a: .45, w: 4 });
      X.lightLine(ctx, [[-1600, BY], [3600, BY]], span(t, A.bus - .4, A.bus + .8) * (1 - span(t, A.every + .4, A.every + 1.4)), { a: .4, w: 4 });
      // 1.02 the bus (in from the left, out to the left) + the measuring lines
      const bin = expoOut(span(t, A.bus - .1, A.bus + 1.3)), bout = expoIn(span(t, A.ship - .3, A.ship + .9));
      if (bin > 0 && bout < 1) bus(ctx, t, lerp(-1600, MX, bin) - bout * 3400, BY, ML, { drive: (bin < 1 ? 1 : 0) + (bout > 0 ? 1 : 0) });
      const ms = span(t, A.bus + .9, A.bus + 1.7) * (1 - span(t, A.ship - .4, A.ship + .1));
      if (ms > 0) for (const x of [MX - ML / 2, MX + ML / 2]) X.lightLine(ctx, [[x, 110], [x, BY + 40]], ms, { col: rgba(GOLD.line, .8), w: 4, dash: [18, 14] });
      // the machine: wrapped, then it breaks into crates (1.03)
      const wrap = span(t, A.ship + .05, A.ship + .65);
      if (t < tSplit) F.chipMachine(ctx, t, MX, GY, ML, { beam: 1 - wrap, glow: 1, crate: wrap });
      else {
        CR.forEach(([x, y], i) => {
          const j = i % 3, t0 = tSplit + .06 * (i % 5) + .05 * j, u = span(t, t0, t0 + .85); if (u >= 1) return;
          const [jx, jy] = jetPos(j, t0 + .85), k = sineIO(u), px = lerp(x, jx - JL * .05, k), py = lerp(y, jy, k) - Math.sin(Math.PI * k) * 260, w = lerp(200, 50, k);
          X.crate(ctx, t, px, py, w, { glow: .4 });
        });
      }
      // the three cargo jets (revealed by the pan; they take off right, the camera follows)
      if (t > A.ship - .5 && t < A.every + 3) JETS.forEach((_, j) => { const [x, y, r] = jetPos(j, t); F.jet(ctx, t, x, y, JL, { rot: r }); });
      // 1.04 the machine at work: one chip, then hundreds, each with a thin line back to it
      if (t > A.jets) {
        const lift = t > A.real ? expoIn(span(t, A.plan + .1, A.plan + 1.2)) * 900 : 0;
        X.lightLine(ctx, [[M2.x, M2.y], [M2.x - 1500, M2.y]], span(t, A.every + .2, A.every + 1.6), { a: .45, w: 4 });
        X.lightLine(ctx, [[M2.x, M2.y], [M2.x + 1500, M2.y]], span(t, A.every + .2, A.every + 1.6), { a: .45, w: 4 });
        ctx.save(); ctx.beginPath(); ctx.rect(M2.x - 8000, -4000, 16000, M2.y + 4000); ctx.clip(); ctx.translate(0, lift);
        halo(ctx, M2.x, M2.y - 180, 700, .25 * span(t, A.real + .2, A.real + 1.2), COOL.halo, COOL.core);
        F.chipMachine(ctx, t, M2.x, M2.y, M2.L, { beam: span(t, A.every + 1.3, A.every + 1.9) * (1 - .5 * span(t, A.real, A.real + 1)), glow: 1 });
        ctx.restore();
        const one = span(t, A.every + 1.9, A.printed - .1), flow = (k) => expoIn(span(t, A.year + .1 + k.q * .7, A.year + 1.2 + k.q * .7)) * 2400;
        const arrOut = span(t, A.real - .2, A.real + .8);
        if (one > 0 && t < A.year + 2.4) {
          CH.forEach((c, i) => {
            const t0 = A.printed + c.q * 1.5, u = i === 0 ? one : span(t, t0, t0 + .7); if (u <= 0) return;
            const k = sineIO(u), fx = flow(c), x = lerp(STAGE[0], c.x, k) + fx, y = lerp(STAGE[1], c.y, k);
            if (u >= 1 && fx < 50) { ctx.strokeStyle = rgba(COOL.line, .16); ctx.lineWidth = 1.6 / s; ctx.beginPath(); ctx.moveTo(STAGE[0] + 60, STAGE[1]); ctx.lineTo(x, y); ctx.stroke(); }
            chip(ctx, x, y, 34, 1, i === 0 ? 1 - span(t, A.printed, A.printed + .6) : 0);
          });
        }
        // 1.05 the sales arrows (away, right) thicken; Europe's arrow stays an empty outline
        const aw = span(t, A.year + .3, A.year + 2.2) * (1 - arrOut);
        if (aw > 0) ARR.forEach((b, k) => arrowBand(ctx, t, [M2.x + 420, M2.y - 70 + (k - 1) * 40], [lerp(M2.x + 420, b[0], expoOut(clamp(aw * 1.6 - k * .15))), lerp(M2.y - 70, b[1], expoOut(clamp(aw * 1.6 - k * .15)))], 110 * sineIO(aw), { col: rgba(COOL.body, .42), flow: 1 }));
        const ea = span(t, A.year + 1.6, A.year + 2.8) * (1 - arrOut);
        if (ea > 0) arrowBand(ctx, t, [M2.x - 430, M2.y - 70], [lerp(M2.x - 430, EU[0], expoOut(ea)), EU[1]], 110, { dash: [22, 16], col: rgba(CREAM, .85 + .15 * Math.sin(Math.PI * span(t, A.nothing, A.nothing + .5))), lw: 5 });
      }
      // 1.06 the three strengths rise out of the ground line, a dashed line tries to connect them and breaks
      if (t > A.real - .2) {
        ctx.save(); ctx.beginPath(); ctx.rect(-8000, -4000, 20000, M2.y + 4000); ctx.clip(); ctx.translate(0, sinkL);
        const su = span(t, A.real + .5, A.real + 1.4), mu = span(t, A.real + .8, A.real + 1.8);
        const SX = LIGHTS[0][0], MXX = LIGHTS[2][0];
        if (su > 0) { halo(ctx, SX, 600, 700, .32 * su, LAMP.body, LAMP.core); ctx.save(); ctx.translate(0, (1 - expoOut(su)) * 360); [[-170, 7], [0, 11], [170, 6]].forEach(([dx, n]) => coins(ctx, t, SX + dx, M2.y, 240, n)); ctx.restore(); }
        if (mu > 0) { halo(ctx, MXX, 520, 700, .38 * mu, LAMP.body, LAMP.core); X.crowdRise(ctx, t, MXX, M2.y, 5, 5, 500, { u: mu, seed: 12, rim: mixHex(GOLD.line, LAMP.body, .3) }); }
        ctx.restore();
        X.lightLine(ctx, [[LIGHTS[0][0] - 1800, M2.y], [LIGHTS[2][0] + 1800, M2.y]], span(t, A.real + .1, A.real + 1.3), { a: .4, w: 4 });
        const dl = span(t, A.notc - .5, A.notc + .25), br = expoOut(span(t, A.conn - .05, A.conn + .7)), roll = span(t, A.plan + .05, A.plan + 1.3);
        if (dl > 0 && roll <= 0) {
          if (br <= 0) X.lightLine(ctx, LIGHTS.map(([x]) => [x, LY]), dl, { col: rgba(CREAM, .85), w: 9, dash: [36, 26] });
          else halves(br).forEach(([a, e]) => X.lightLine(ctx, [a, e], 1, { col: rgba(CREAM, .85), w: 9, dash: [36, 26] }));
        }
      }
    });
    // texts (screen space)
    X.label(ctx, SRC.asml, W / 2, 190, lab(t, A.single + .1, A.bus - .1), { size: 30, spacing: .14 });
    X.label(ctx, 'THE SIZE OF A BUS', W / 2, 150, lab(t, A.bus + .6, A.ship - .1), { size: 30, spacing: .14 });
    X.label(ctx, SRC.euv, W / 2, 140, lab(t, A.ship, A.every + .4), { size: 26, spacing: .16, col: CREAM2 });
    X.big(ctx, '3 CARGO JETS', W / 2, 228, 72, lab(t, A.jets - .1, A.every + .5), { gold: .3 });
    if (t > A.ship && t < A.every + 1.2) F.source(ctx, t, A.jets, A.every + 1.0, SRC.euvSrc);
    X.label(ctx, 'ALMOST EVERY ADVANCED AI CHIP', W / 2, 170, lab(t, A.every + .9, A.year), { size: 30, spacing: .12 });
    X.label(ctx, 'PRINTED BY ONE KIND OF MACHINE', W / 2, 222, lab(t, A.printed, A.year), { size: 30, spacing: .12, gold: 1, col: GOLD.text });
    X.big(ctx, SRC.zeroEurope, W / 2, 200, 70, lab(t, A.nothing + .3, A.real - .1), { gold: .25 });
    const ev = X.toScreen(vm(t), EU[0] - 60, EU[1] - 120);
    X.label(ctx, 'EUROPE', ev[0], ev[1], lab(t, A.year + 2.4, A.real - .1), { size: 26, spacing: .16 });
    if (t > A.nothing && t < A.real + 1) F.source(ctx, t, A.nothing + .3, A.real + .3, SRC.zeroSrc);
    LIGHTS.forEach(([x, name], i) => { const [sx, sy] = X.toScreen(v, x, M2.y + 170); X.label(ctx, name, sx, sy, lab(t, A.real + .9 + i * .15, A.plan + .25), { size: 26, spacing: .14 }); });
    return v;
  }

  // ---------------------------------------------------------------- the report, the plate (C1), the 383 squares, the fold into the disc
  const CV = { x: 760, y: 486, w: 360 }, CVH = CV.w * 1.32, MOON = { x: 1080, y: 340, r: 180 };
  const NG = 383, GC = 24, CELL = 26, GAP = 6, GRID = { x: 960 - (GC * (CELL + GAP) - GAP) / 2, y: 200 };
  const gpos = (i) => [GRID.x + (i % GC) * (CELL + GAP) + CELL / 2, GRID.y + Math.floor(i / GC) * (CELL + GAP) + CELL / 2];
  const GOLDSET = new Set(Array.from({ length: NG }, (_, i) => i).filter((i) => (i * 157) % NG < 60));
  const flipOut = (t) => span(t, A.later + 1.05, A.later + 1.4), flipBack = (t) => span(t, C1.end + .55, C1.end + .9);
  const plateM = (t) => (t < C1.start ? sineIO(span(t, A.later + 1.4, C1.start - .05)) : 1 - sineIO(span(t, C1.end - .05, C1.end + .55)));
  function reportStage(ctx, t) {
    const roll = span(t, A.plan + .05, A.plan + 1.3), unroll = span(t, A.plan + 1.1, A.plan + 1.9), open = span(t, C1.end + 1.0, C1.end + 2.6);
    // the broken line's pieces fly together into a roll (screen space), then the cover unrolls
    if (roll > 0 && unroll < .15) {
      const v = vm(A.plan), k = sineIO(roll);
      halves(1).forEach(([a, e], i) => {
        const A0 = X.toScreen(v, a[0], a[1]), B0 = X.toScreen(v, e[0], e[1]), q = sineIO(clamp(k * 1.2 - i * .05));
        const ax = lerp(A0[0], CV.x - CV.w / 2, q), ay = lerp(A0[1], CV.y - 6 + i * 4, q), bx = lerp(B0[0], CV.x + CV.w / 2, q), by = lerp(B0[1], CV.y - 6 + i * 4, q);
        X.lightLine(ctx, [[ax, ay], [bx, by]], 1, { col: rgba(mixHex(CREAM, PAPER.lit, q), .9), w: lerp(2.7, 6, q), dash: q > .85 ? undefined : [11, 8] });
      });
    }
    const fo = flipOut(t), fb = flipBack(t), pm = plateM(t), coverOn = unroll > 0 && open < 1;
    const sx = t < C1.start ? 1 - sineIO(fo) : sineIO(fb), openK = sineIO(open);
    if (coverOn && (t < A.later + 1.4 || t > C1.end + .55) && openK <= 0) {
      cover(ctx, t, CV.x, CV.y, CV.w, { u: 1, sy: sineIO(unroll), sx, wu: span(t, A.draghi - .3, A.draghi + 1.2), lines: [[SRC.draghi.split(' · ')[0], 38], [SRC.draghi.split(' · ')[1], 22, false]] });
    }
    // the plate grows out of the edge-on cover (its back) and returns into it
    if (pm > 0 && t > A.later + 1.35 && t < C1.end + .6) F.clipPlate(ctx, t, T, 'C1', { from: { x: CV.x - 2, y: CV.y - CVH / 2, w: 4, h: CVH }, morph: pm, dark: 1 - span(pm, .15, .7) });
    X.big(ctx, SRC.draghiSum, 1400, 470, 60, lab(t, A.wrote - .1, A.later + 1.0), { gold: .35 });
    if (t > A.wrote && t < A.later + 1.3) F.source(ctx, t, A.wrote + .2, A.later + 1.0, SRC.draghiSumSrc);
    // the cover opens into 383 squares (one per proposal); 60 light gold; then they fold into the five outlines
    if (open > 0) {
      const fold = span(t, A.five - 1.05, A.five - .12);
      for (let i = 0; i < NG; i++) {
        const c = i % GC, r = Math.floor(i / GC), q = ((i * 37) % NG) / NG;
        const s0x = CV.x - CV.w / 2 + (c + .5) * CV.w / GC, s0y = CV.y - CVH / 2 + (r + .5) * CVH / 16, [gx, gy] = gpos(i);
        const u = sineIO(clamp(open * 1.5 - q * .5)), f = sineIO(clamp(fold * 1.4 - q * .4));
        const ang = -Math.PI / 2 + (i / NG) * TAU, dxx = MOON.x + Math.cos(ang) * MOON.r, dyy = MOON.y + Math.sin(ang) * MOON.r;
        const x = lerp(lerp(s0x, gx, u), dxx, f), y = lerp(lerp(s0y, gy, u), dyy, f), sz = lerp(lerp(CV.w / GC, CELL, u), 5, f), sh = lerp(lerp(CVH / 16, CELL, u), 5, f);
        if (f >= 1) continue;
        const g = GOLDSET.has(i) ? sineIO(span(t, A.one6 - .1 + q * .6, A.one6 + .4 + q * .6)) : 0;
        ctx.fillStyle = mixHex(mixHex(PAPER.body, mixHex(P.ind2, CREAM, .32), u), GOLD.body, g);
        ctx.beginPath(); ctx.roundRect(x - sz / 2, y - sh / 2, sz, sh, Math.min(sz, sh) * .18 * u); ctx.fill();
      }
      const gl = span(t, A.one6, A.one6 + 1) * (1 - span(t, A.five - 1.1, A.five - .6)); if (gl > 0) halo(ctx, 960, 450, 520, .18 * gl, GOLD.halo, GOLD.core);
      const w = span(t, A.five - .75, A.five - .05);
      if (w > 0) F.kitDisc(ctx, t, MOON.x, MOON.y, MOON.r, F.BLANK, { glow: .6 * w, stars: 0, loose: false, write: w });
    }
    X.big(ctx, SRC.oneInSix, 960, 800, 62, lab(t, A.one6 + .1, A.five - .9), { gold: .55 });
    if (t > A.one6 && t < A.five) F.source(ctx, t, A.one6 + .4, A.five - .9, SRC.oneInSixSrc);
  }

  // ---------------------------------------------------------------- ANCHOR 2/4: the moon = the plan; the parts light with their names
  const moonParts = (t) => {
    const p = F.kitParts(T, t).parts.map((q) => ({ ...q }));
    if (t > A.last + .1) p[4] = { ...p[4], fade: 0 };   // the fifth piece has left the moon: the slot stays dark
    return p;
  };
  const camA = (t) => { const u = sineIO(span(t, A.five, A.test)); return E.camDrift(E.cam3({ x: 40 * u, y: -30 * u, z: 220 * u }), t, .5); };
  const youH = 190, flyT = [A.last + .1, A.last + 1.6];
  function anchor(ctx, t) {
    const c = camA(t), fl = span(t, flyT[0], flyT[1]), hold = span(t, flyT[1] - .15, flyT[1] + .3), up = sineIO(span(t, A.won + .2, A.won + 1.4));
    const arms = sineIO(span(t, A.last - .2, flyT[1]));
    const youSt = fl >= 1 ? { h: youH, piece: { u: 1, kind: 'blank', lit: .8 + .2 * up, r: 120 + 10 * up, rot: -.55 + .1 * up, glow: .5 } }
      : { h: youH, o: { armR: [lerp(.2, 2.85, arms), lerp(.1, 3.05, arms)], armL: [lerp(-.2, -2.7, arms), lerp(-.1, -3.0, arms)], look: lerp(.3, 1, arms) } };
    S.seaWorld(ctx, c, t, { moon: { parts: moonParts(t), screen: true, x: MOON.x, y: MOON.y, r: MOON.r, glow: 1, stars: 1 }, lit: .85, away: .2, you: youSt });
    discLabels(ctx, MOON.x, MOON.y, MOON.r, KT.word.map((w) => span(t, w - .1, w + .6)));
    if (fl > 0 && fl < 1) {   // the fifth piece leaves the moon and flies down into your hands
      const [sx, sy] = F.pieceCentre(4, MOON.x, MOON.y, MOON.r), hp = E.project(c, S.Z_ROOF, S.ROOF.you, S.ROOF.y - 12 - youH * 1.18), k = sineIO(fl);
      F.loosePiece(ctx, t, 4, lerp(sx, hp[0], k), lerp(sy, hp[1], k) - Math.sin(Math.PI * k) * 60, lerp(MOON.r, 120 * hp[2], k), { kind: 'blank', lit: .9, rot: lerp(0, -.55, k), glow: 0 });
    }
  }

  // ---------------------------------------------------------------- 1.13: the same disc on the sheet; the question; it shrinks into the HUD
  const DC = { x: 960, y: 330, r: 190 };
  function testStage(ctx, t) {
    X.sheet(ctx, t, plainView(t));
    const g = sineIO(span(t, A.test + .15, A.test + 1.6)), shrink = span(t, A.paper + 1.0, A.end - .25);
    const bx = lerp(MOON.x, DC.x, g), by = lerp(MOON.y, DC.y, g), br = lerp(MOON.r, DC.r, g);
    hud(ctx, t, T, { big: 1 - shrink, bx, by, br, lab: 1 - span(t, A.paper + .8, A.paper + 1.3), p4: span(t, A.paper + .7, A.paper + 2.0), p4from: [br * 1.1, br * 1.6, .7], parts: F.kitParts(T, t).parts });
    X.big(ctx, 'REALLY THERE,', W / 2, 700, 76, lab(t, A.really - .05, A.paper + 1.35), { gold: .9 });
    X.big(ctx, 'OR ONLY ON PAPER?', W / 2, 800, 76, lab(t, A.paper - .05, A.paper + 1.45), { gold: 0 });
  }

  // ---------------------------------------------------------------- the take
  function take(ctx, t) {
    if (t < tS) { S.plateMachine(ctx, t, T); return; }
    if (t >= A.test) { testStage(ctx, t); return; }
    if (t >= A.five) { anchor(ctx, t); return; }
    stationStage(ctx, t);
    if (t > A.plan) reportStage(ctx, t);
  }
  return [{ t: R.a, draw: take, print: PR }, { t: A.five, draw: take, print: PR }, { t: A.test, draw: take, print: PR }];
};
