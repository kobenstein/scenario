// Film 70 · builder B3 (c09–c10) · local helpers (B3 owns this file; the shared kit stays untouched).
// Objects of the three tests and the close: the ring pour, the speech bubble, the score dial, the explanation sheet, the sealed box, the
// magnifier, ring ↔ card morph, the HUD chain flight (HUD ↔ any layout), a dashed absence outline, a partial light line.
import * as E from './f10_editorial.mjs';
import * as F from './f70_kit.mjs';
import * as X from './f70_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, COOL, CREAM, CREAM2, LAMP, PAPER } = F;
const TAU = Math.PI * 2;

// in for .6 s from a, out (sinks behind its mask) over .5 s before b
export const lab = (t, a, b = 1e9) => span(t, a, a + .6) * (1 - span(t, b - .4, b + .1));

// a polyline drawn between arc-length fractions u0..u1 (a line that runs on AND runs off), cream with a warm glow
export function lineSpan(ctx, pts, u0, u1, o = {}) {
  u0 = clamp(u0); u1 = clamp(u1); if (u1 <= u0 || pts.length < 2) return;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = clamp((d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1])); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), i]; };
  const [sx, sy, i0] = at(u0 * L), [ex, ey, i1] = at(u1 * L);
  ctx.save(); ctx.strokeStyle = o.col ?? rgba(CREAM, o.a ?? .8); ctx.lineWidth = o.w ?? 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (o.dash) ctx.setLineDash(o.dash);
  if (o.glow !== false) { ctx.shadowColor = rgba(o.glowCol ?? GOLD.halo, .5); ctx.shadowBlur = o.blur ?? 8; }
  ctx.beginPath(); ctx.moveTo(sx, sy); for (let i = i0; i < i1; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
}
// an arrow head at p pointing along ang
export function arrowHead(ctx, x, y, ang, s, col, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s * .7, -s * .62); ctx.quadraticCurveTo(-s * .35, 0, -s * .7, s * .62); ctx.closePath(); ctx.fill(); ctx.restore();
}

// a ring mould on the anvil that fills with gold from the bottom (the pour), then glows: fill 0..1, glow 0..1, cool 0..1 (the metal
// cools: glow off, a little darker). Board units.
export function pourRing(ctx, t, x, y, L, o = {}) {
  const fill = clamp(o.fill ?? 0), glow = clamp(o.glow ?? 0), wd = L * .58, a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  if (fill < 1) F.chainLink(ctx, t, x, y, L, o.ang ?? 0, { mould: 1 });
  if (fill > 0) {
    const top = y + wd / 2 + 6 - (wd + 12) * sineIO(fill);
    ctx.save(); ctx.beginPath(); ctx.rect(x - L, top, L * 2, wd + 40); ctx.clip();
    F.chainLink(ctx, t, x, y, L, o.ang ?? 0, { lit: glow * (.8 + .2 * Math.sin(t * 2.4)) });
    ctx.restore();
    if (fill < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(GOLD.hot, .55 * (1 - fill)); ctx.fillRect(x - L / 2, top - 1.5, L, 3); ctx.restore(); }
    if (glow > 0) halo(ctx, x, y, L * 1.3, .3 * glow, GOLD.halo, GOLD.core);
  }
  ctx.restore();
}

// a speech bubble (cream outline, night inside) with a tail at the bottom left; text Inter caps. u grows it out of its tail point.
export function bubble(ctx, t, x, y, w, h, txt, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), tx = x - w * .3, ty = y + h / 2 + 26;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (o.a ?? 1); ctx.translate(tx, ty); ctx.scale(k, k); ctx.translate(-tx, -ty);
  ctx.fillStyle = rgba(P.night0, .85); ctx.strokeStyle = rgba(o.col ?? CREAM, .9); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.moveTo(tx + 14, y + h / 2); ctx.lineTo(tx, ty); ctx.lineTo(tx + 40, y + h / 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = rgba(P.night0, .85); ctx.fillRect(tx + 16, y + h / 2 - 3, 22, 5);
  ctx.restore();
  X.label(ctx, txt, x, y + 10, span(u, .35, 1), { size: o.size ?? 26, spacing: .1, col: o.col ?? COOL.text });
}

// the automatic score dial: a half ring (track), three soft zones, a needle (needle 0..1: 0 = up, 1 = hard left = REFUSED), the pivot.
// open 0..1: the face folds up and away (the dial opens). Board units, (x, y) = pivot.
export function dial(ctx, t, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1), op = sineIO(clamp(o.open ?? 0)); if (u <= 0 || op >= 1) return;
  ctx.save(); ctx.globalAlpha *= clamp(u * 2); ctx.translate(x, y); ctx.scale(1, 1 - op); ctx.translate(-x, -y);
  ctx.fillStyle = rgba(mixHex(P.night1, COOL.deep, .5), .9); ctx.beginPath(); ctx.arc(x, y, r * 1.12, Math.PI, TAU); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .5); ctx.lineWidth = 2; ctx.stroke();
  const a0 = Math.PI, seg = [[0, .33, .25], [.33, .66, .45], [.66, 1, .7]];
  for (const [s0, s1, al] of seg) { ctx.strokeStyle = rgba(COOL.body, al * expoOut(u)); ctx.lineWidth = r * .12; ctx.beginPath(); ctx.arc(x, y, r * .86, a0 + Math.PI * s0 + .03, a0 + Math.PI * s1 - .03); ctx.stroke(); }
  for (let i = 0; i <= 10; i++) { const a = a0 + Math.PI * i / 10; ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * .66, y + Math.sin(a) * r * .66); ctx.lineTo(x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72); ctx.stroke(); }
  const na = -Math.PI / 2 - (Math.PI * .42) * clamp(o.needle ?? 0) + .015 * Math.sin(t * 2.3) * (1 - clamp(o.needle ?? 0) * .7);
  ctx.strokeStyle = COOL.core; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(na) * r * .8, y + Math.sin(na) * r * .8); ctx.stroke();
  ctx.fillStyle = COOL.core; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill();
  halo(ctx, x, y - r * .4, r * 1.2, .18, COOL.halo, COOL.core);
  ctx.restore();
  return [x + Math.cos(na) * r * .8, y + Math.sin(na) * r * .8];
}
// a sheet that unfolds upward out of a base line at y (u 0..1), w × h, lines appear staggered; head text (Inter caps, ink)
export function sheet(ctx, t, x, y, w, h, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), hh = h * k;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-w / 2 + 6, -hh + 8, w, hh);
  ctx.fillStyle = lin(ctx, 0, -hh, 0, 0, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(-w / 2, -hh, w, hh);
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -hh, w, hh); ctx.clip(); ctx.translate(0, -hh);
  if (o.head) F.maskLine(ctx, [[o.head, 0]], -w / 2 + 26, 46, 22, F.rise(span(u, .45, 1)), { serif: false, weight: 700, col: PAPER.ink, glow: false });
  ctx.fillStyle = rgba(PAPER.faint, .6);
  for (let j = 0; j < 6; j++) { const a = span(u, .5 + j * .07, .8 + j * .07); if (a > 0) ctx.fillRect(-w / 2 + 26, 78 + j * 30, (w - 52) * (j % 3 === 2 ? .55 : .9) * expoOut(a), 5); }
  ctx.restore(); ctx.restore();
}

// the maker's sealed box (dark, a cream band across, a seal knot on top). open 0..1: the lid lifts and swings back (hinge at the back
// right), cool light escapes. (x, y) = bottom centre. Returns the inside point (where the model rises).
export function sealedBox(ctx, t, x, y, w, h, o = {}) {
  const op = clamp(o.open ?? 0), a = o.a ?? 1; if (a <= 0) return [x, y - h];
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x, y, w * .58, 10, 0, 0, TAU); ctx.fill();
  if (op > 0) { halo(ctx, x, y - h, w * (.6 + .5 * op), .5 * op, COOL.halo, COOL.core); }
  ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(P.night1, P.ind2, .5)], [1, mixHex(P.ind2, P.blue1, .45)]]); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.strokeStyle = rgba(mixHex(GOLD.line, P.blue1, .5), .45); ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h, w, h);
  ctx.fillStyle = rgba(PAPER.body, .85); ctx.fillRect(x - w * .07, y - h, w * .14, h);   // the band
  // the lid: hinged at the back right corner, swings up and back
  const ang = .62 * sineIO(op), lh = h * .16;
  ctx.save(); ctx.translate(x + w / 2, y - h); ctx.rotate(ang);
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.fillRect(-w - 8, -lh, w + 16, lh); ctx.strokeStyle = rgba(mixHex(GOLD.line, P.blue1, .5), .5); ctx.strokeRect(-w - 8, -lh, w + 16, lh);
  ctx.fillStyle = rgba(PAPER.body, .9); ctx.fillRect(-w / 2 - w * .07, -lh, w * .14, lh);
  if (op < .25) { ctx.fillStyle = PAPER.lit; ctx.beginPath(); ctx.arc(-w / 2, -lh - 6, 12, 0, TAU); ctx.fill(); }
  ctx.restore();
  ctx.restore();
  return [x, y - h];
}
// a magnifier: lens centre (x, y), radius r, handle along ang (pointing away from the lens); cream rim, a faint glass shine
export function magnifier(ctx, t, x, y, r, ang, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = mixHex(P.night1, P.blue1, .6); ctx.lineWidth = r * .3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * r * 1.05, y + Math.sin(ang) * r * 1.05); ctx.lineTo(x + Math.cos(ang) * r * 2.1, y + Math.sin(ang) * r * 2.1); ctx.stroke();
  ctx.fillStyle = rgba(COOL.core, .1 + .08 * (o.lit ?? 0)); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = CREAM; ctx.lineWidth = r * .14; ctx.stroke();
  ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = r * .06; ctx.beginPath(); ctx.arc(x, y, r * .7, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
  ctx.restore();
}
// a person that rises out of its ground line (mask at y): u 0..1; du = the yellow coat (you)
export function personRise(ctx, x, y, h, u, o = {}, du = false) {
  if (u <= 0) return null;
  const k = expoOut(clamp(u));
  ctx.save(); ctx.beginPath(); ctx.rect(x - h * 1.2, y - h * 1.6, h * 2.4, h * 1.6 + 2); ctx.clip();
  const r = (du ? E.du : E.person)(ctx, x, y + (1 - k) * h * 1.15, h, o);
  ctx.restore();
  return r;
}
// the ring ↔ card morph (one shape): m 0 = a gold ring (L long, face-on), 1 = a cream question card (w × h). (x, y) = centre.
// flip 0..1 turns the card over (scale x = |cos|; the back shows a person), lines = the card text (serif, ink)
export function ringCard(ctx, t, x, y, L, w, h, m, o = {}) {
  m = clamp(m); const a = o.a ?? 1; if (a <= 0) return;
  if (m <= 0) { F.chainLink(ctx, t, x, y, L, o.ang ?? 0, { lit: o.lit ?? 0 }); return; }
  const k = sineIO(m), ww = lerp(L, w, k), hh = lerp(L * .58, h, k), th = lerp(L * .14, hh / 2, k), rr = lerp(hh / 2, 8, k);
  const fl = o.flip ?? 0, sx = Math.max(.02, Math.abs(Math.cos(Math.PI * fl))), back = fl > .5 && fl < 1.5;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate((o.ang ?? 0) * (1 - k) + (o.rot ?? 0) * k); ctx.scale(sx, 1);
  ctx.fillStyle = rgba(P.night0, .3 * k); ctx.beginPath(); ctx.roundRect(-ww / 2 + 6, -hh / 2 + 9, ww, hh, rr); ctx.fill();
  const g = lin(ctx, -ww / 2, -hh / 2, ww / 2, hh / 2, [[0, mixHex(GOLD.hot, PAPER.lit, k)], [1, mixHex(GOLD.shade, PAPER.body, k)]]);
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-ww / 2, -hh / 2, ww, hh, rr);
  if (th < hh / 2 - .5) ctx.roundRect(-ww / 2 + th, -hh / 2 + th, ww - 2 * th, hh - 2 * th, Math.max(0, rr - th));
  ctx.fill('evenodd');
  if (k > .9) {
    const ta = span(k, .9, 1);
    if (!back && o.text) { ctx.globalAlpha *= ta; ctx.font = `${o.size ?? 34}px "Instrument Serif"`; ctx.fillStyle = PAPER.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.text, 0, 2); }
    if (back) { ctx.globalAlpha *= ta; ctx.save(); ctx.beginPath(); ctx.roundRect(-ww / 2, -hh / 2, ww, hh, rr); ctx.clip(); E.person(ctx, 0, hh / 2 + 4, hh * 1.02, { dir: 1, light: .9, look: .1, rim: LAMP.body }); ctx.restore(); }
  }
  ctx.restore();
}
// a dashed outline where a person should be (absence): (x, y) = feet, h
export function absent(ctx, x, y, h, a = 1, t = 0) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2.5; ctx.setLineDash([9, 8]); ctx.lineDashOffset = -t * 6;
  ctx.beginPath(); ctx.arc(x, y - h * .89, h * .075, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - h * .05, y - h * .8); ctx.bezierCurveTo(x - h * .14, y - h * .78, x - h * .15, y - h * .5, x - h * .17, y - h * .3); ctx.lineTo(x - h * .1, y - h * .3);
  ctx.lineTo(x - h * .08, y); ctx.moveTo(x + h * .08, y); ctx.lineTo(x + h * .1, y - h * .3); ctx.lineTo(x + h * .17, y - h * .3);
  ctx.bezierCurveTo(x + h * .15, y - h * .5, x + h * .14, y - h * .78, x + h * .05, y - h * .8); ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- the HUD chain in flight
// The HUD layout exactly as F.chainHud draws it (four face links + three edge links between them), so k = 0 hands over to F.chainHud.
export function hudLayout(t) {
  const x0 = F.HUD.x, y0 = F.HUD.y, L = F.HUD.L, gap = L * 1.02, sw = Math.sin(t * .9) * .03;
  return { face: [0, 1, 2, 3].map((i) => ({ x: x0 + i * gap, y: y0, L, ang: sw + (i % 2 ? .04 : -.04) })), edge: [0, 1, 2].map((i) => ({ x: x0 + (i + .5) * gap, y: y0, L: L * .62, ang: sw })) };
}
// a row layout (screen): centre (cx, cy), face link length L, gap between face links, edge link factor
export function rowLayout(cx, cy, L, gap, ek = .55, ang = 0) {
  return { face: [0, 1, 2, 3].map((i) => ({ x: cx + (i - 1.5) * gap, y: cy, L, ang })), edge: [0, 1, 2].map((i) => ({ x: cx + (i - 1) * gap, y: cy, L: L * ek, ang })) };
}
const mixL = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), L: lerp(a.L, b.L, k), ang: lerp(a.ang, b.ang, k) });
export const mixLayout = (A, B, k) => ({ face: A.face.map((f, i) => mixL(f, B.face[i], k)), edge: A.edge.map((e, i) => mixL(e, B.edge[i], k)) });
// draw a layout in SCREEN space with the honest chain state (F.chainState); o.joint(i) → extra options for edge link i, o.lit(i)
export function drawLayout(ctx, t, T, lay, o = {}) {
  const s = F.chainState(T, t).links;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha *= o.a ?? 1;
  lay.edge.forEach((e, i) => F.chainLink(ctx, t, e.x, e.y, e.L, e.ang, { edge: true, ...(o.joint ? o.joint(i) : {}) }));
  lay.face.forEach((f, i) => F.chainLink(ctx, t, f.x, f.y, f.L, f.ang, { lit: o.lit ? o.lit(i) : 0, crack: s[i].crack, mend: s[i].mend }));
  ctx.restore();
}
