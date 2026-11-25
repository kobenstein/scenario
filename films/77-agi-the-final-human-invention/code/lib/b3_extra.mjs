// Film 77 · builder B3 · extra objects for c10–c12 (mine alone; the kit stays untouched). Everything is seeded/deterministic.
//   pkg (the new A.I. model as a package: a box with the ring inside) · gate (a test gate on the road) · table · lectern · tool (five method
//   tools) · ballotBox · desk · professor · laptop · sign (?, path, tick) · coolArrow · creamWord (a cream verdict) · tallBoard (THE BOARD with
//   rows that grow/collapse, for the harvest and the end screen) · wordBox (the layout of one word on the Turing card)
import * as F from './f77_kit.mjs';
import * as S from './f77_seams.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, halo, lin, rad, GOLD, CREAM, COOL, PAPER } = F;

// ---------------------------------------------------------------- THE PACKAGE (the new model): (x, y) = bottom centre, s = height
// o: { lid 0..1 (the top flap opens), glow 0..1 (the ring inside lights the opening), lit 0..1 (a passing highlight), inner 0..1 (patterns
// light inside: researchers' lamps), a, ring 0..1 (the small ring in the front window) }. Returns { win (front window rect), top, x0, w }
export function pkg(ctx, t, x, y, s, o = {}) {
  const w = s * 1.3, d = s * .26, x0 = x - w / 2, y0 = y - s, lid = sineIO(clamp(o.lid ?? 0)), gl = clamp(o.glow ?? 0), lit = clamp(o.lit ?? 0);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(x + d * .3, y + 4, w * .62, s * .07, 0, 0, 6.29); ctx.fill();
  // the side face (depth to the upper right)
  ctx.fillStyle = mixHex(P.night1, P.ind1, .35); F.poly(ctx, [[x0 + w, y0], [x0 + w + d, y0 - d * .6], [x0 + w + d, y - d * .6], [x0 + w, y]]); ctx.fill();
  // the front face: indigo with a cool rim
  ctx.fillStyle = lin(ctx, x0, y0, x0 + w, y, [[0, mixHex(P.ind1, P.blue1, .35)], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.fillRect(x0, y0, w, s);
  ctx.strokeStyle = rgba(COOL.line, .75 + .25 * lit); ctx.lineWidth = 2; ctx.strokeRect(x0, y0, w, s);
  // the opening glow (when the lid is up, the ring's light spills out)
  if (lid > 0 && gl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, y0 - s * 1.2, 0, y0, [[0, rgba(COOL.halo, 0)], [1, rgba(COOL.core, .32 * gl * lid)]]); F.poly(ctx, [[x0 + w * .08, y0], [x0 + w * .92, y0], [x0 + w * 1.15, y0 - s * 1.1], [x0 - w * .15, y0 - s * 1.1]]); ctx.fill(); ctx.restore(); }
  // the top face (closed) or the opened flap (it swings back about the far edge)
  const topPts = [[x0, y0], [x0 + w, y0], [x0 + w + d, y0 - d * .6], [x0 + d, y0 - d * .6]];
  if (lid <= 0) { ctx.fillStyle = mixHex(P.blue1, P.ind1, .4); F.poly(ctx, topPts); ctx.fill(); ctx.strokeStyle = rgba(COOL.line, .6); ctx.lineWidth = 1.5; ctx.stroke(); }
  else {
    ctx.fillStyle = mixHex(P.night0, P.ind0, .4); F.poly(ctx, topPts); ctx.fill();
    if (gl > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(COOL.core, .35 * gl * lid); F.poly(ctx, topPts); ctx.fill(); ctx.restore(); }
    const fy = y0 - d * .6, fh = lerp(d * .6, s * .95, lid);   // the flap stands up at the back
    ctx.fillStyle = mixHex(P.blue1, P.ind1, .4); F.poly(ctx, [[x0 + d, fy], [x0 + w + d, fy], [x0 + w + d * lerp(1, .6, lid), fy - fh], [x0 + d * lerp(1, .6, lid), fy - fh]]); ctx.fill();
    ctx.strokeStyle = rgba(COOL.line, .6); ctx.lineWidth = 1.5; ctx.stroke();
  }
  // the front window with the small ring of the model inside
  const win = { x: x0 + w * .2, y: y0 + s * .18, w: w * .6, h: s * .6 };
  ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.beginPath(); ctx.roundRect(win.x, win.y, win.w, win.h, 8); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.roundRect(win.x, win.y, win.w, win.h, 8); ctx.clip();
  ringS(ctx, t, win.x + win.w / 2, win.y + win.h / 2, win.h * .36, { u: o.ring ?? 1, lit: .55 + .45 * gl, think: .3 });
  const inn = clamp(o.inner ?? 0);
  if (inn > 0) {   // patterns inside: a lattice of features lighting where the lamps fall
    const r = F.prng(5), cx = win.x + win.w / 2, cy = win.y + win.h / 2;
    for (let i = 0; i < 26; i++) { const ax = cx + (r() - .5) * win.w * .9, ay = cy + (r() - .5) * win.h * .9, k = span(inn, i / 26 * .6, i / 26 * .6 + .4); if (k <= 0) continue; ctx.fillStyle = rgba(GOLD.core, .85 * k); ctx.beginPath(); ctx.arc(ax, ay, 3.2, 0, 6.29); ctx.fill(); if (i % 3 === 0 && i > 2) { ctx.strokeStyle = rgba(GOLD.line, .5 * k); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx + (r() - .5) * win.w * .8, cy + (r() - .5) * win.h * .8); ctx.stroke(); } }
  }
  ctx.restore();
  ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.roundRect(win.x, win.y, win.w, win.h, 8); ctx.stroke();
  if (lit > 0) halo(ctx, x, y0 + s * .45, s * 1.1, .45 * lit, COOL.halo, COOL.core);
  ctx.restore();
  return { win, top: y0, x0, w, s };
}

// ---------------------------------------------------------------- A TEST GATE on the road: (x, y) = the road point under it, h height, w width
// o: { u 0..1 (the posts draw themselves up), barrier 0..1 (a solid gold arm swings down: the law), ghost 0..1 (where a barrier would be:
// a dashed cream outline, i.e. none), lit 0..1 }
export function gate(ctx, t, x, y, h, w, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return;
  const xl = x - w / 2, xr = x + w / 2, top = y - h;
  F.outline(ctx, [[[xl, y], [xl, top]], [[xr, y], [xr, top]]], u, { w: 4, col: CREAM });
  F.outline(ctx, [[[xl - 16, top], [xr + 16, top]]], span(u, .6, 1), { w: 5, col: CREAM });
  if ((o.lit ?? 0) > 0) halo(ctx, x, top, w * .8, .4 * o.lit, GOLD.halo, GOLD.core);
  const gh = clamp(o.ghost ?? 0);
  if (gh > 0) { ctx.save(); ctx.globalAlpha *= gh; ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 3; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 14; ctx.strokeRect(xl + 6, y - h * .45, w - 12, 22); ctx.setLineDash([]); ctx.restore(); }
  const b = clamp(o.barrier ?? 0);
  if (b > 0) {   // the arm: pivots at the left post, swings from upright to across
    const ang = lerp(-Math.PI / 2, 0, F.backOut(b, .6)), px = xl, py = y - h * .42, L = w - 4;
    ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
    ctx.fillStyle = GOLD.body; ctx.beginPath(); ctx.roundRect(0, -9, L, 18, 9); ctx.fill();
    ctx.fillStyle = GOLD.deep; for (let k = 1; k < 5; k++) ctx.fillRect(L * k / 5 - 8, -9, 14, 18);
    ctx.restore();
    halo(ctx, px + Math.cos(ang) * L / 2, py + Math.sin(ang) * L / 2, L * .6, .35 * b, GOLD.halo, GOLD.core);
  }
}
export function table(ctx, x, y, w, h = 70) {   // (x, y) = floor centre
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.fillRect(x - w / 2, y - h, w, 10); ctx.fillRect(x - w / 2 + 12, y - h, 8, h); ctx.fillRect(x + w / 2 - 20, y - h, 8, h);
  ctx.fillStyle = rgba(P.blue1, .8); ctx.fillRect(x - w / 2, y - h, w, 2);
}
export function lectern(ctx, x, y, s) {   // (x, y) = floor centre, s = height
  ctx.fillStyle = lin(ctx, x - s * .3, 0, x + s * .3, 0, [[0, mixHex(P.night1, P.ind1, .6)], [1, mixHex(P.ind1, P.blue1, .45)]]);
  F.poly(ctx, [[x - s * .22, y], [x + s * .22, y], [x + s * .27, y - s * .82], [x - s * .27, y - s * .82]]); ctx.fill();
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .6); F.poly(ctx, [[x - s * .36, y - s * .82], [x + s * .36, y - s * .82], [x + s * .3, y - s], [x - s * .3, y - s]]); ctx.fill();
  ctx.fillStyle = rgba(P.halo2, .5); ctx.fillRect(x - s * .36, y - s * .82, s * .72, 2);
}
// five method tools (no names: the film does not list them): magnifier, wrench, dial, key, tuning fork. Polylines in units of s (centre 0,0)
const TOOL = {
  lens: () => [F.circlePts(-.12, -.18, .42, 0, 6.29, 30), [[.18, .12], [.62, .62]]],
  wrench: () => [[[-.6, .6], [.2, -.2]], [...F.circlePts(.38, -.38, .28, 2.4, 2.4 + 5.2, 20)]],
  dial: () => [F.circlePts(0, 0, .6, Math.PI * .8, Math.PI * 2.2, 30), [[0, 0], [.32, -.32]], [[-.6, .2], [.6, .2]]],
  key: () => [F.circlePts(-.4, 0, .26, 0, 6.29, 20), [[-.14, 0], [.66, 0]], [[.42, 0], [.42, .22]], [[.6, 0], [.6, .18]]],
  fork: () => [[[0, .7], [0, .05]], [[-.28, -.7], [-.28, -.05], [0, .05], [.28, -.05], [.28, -.7]]],
};
export const TOOLS = ['lens', 'wrench', 'dial', 'key', 'fork'];
export function tool(ctx, kind, x, y, s, o = {}) { F.outline(ctx, TOOL[kind]().map((pl) => pl.map(([u, v]) => [x + u * s, y + v * s])), o.u ?? 1, { w: o.w ?? 3, gold: o.gold, col: o.col, a: o.a }); }
export function ballotBox(ctx, t, x, y, s, o = {}) {   // (x, y) = floor centre
  ctx.fillStyle = lin(ctx, x - s / 2, 0, x + s / 2, 0, [[0, mixHex(P.night1, P.ind1, .5)], [1, mixHex(P.ind1, P.blue1, .5)]]); ctx.fillRect(x - s / 2, y - s * .8, s, s * .8);
  ctx.fillStyle = mixHex(P.blue1, P.ind1, .3); F.poly(ctx, [[x - s / 2, y - s * .8], [x + s / 2, y - s * .8], [x + s * .62, y - s * .92], [x - s * .38, y - s * .92]]); ctx.fill();
  ctx.fillStyle = P.night0; ctx.fillRect(x - s * .18, y - s * .87, s * .4, 5);
  const p = clamp(o.paper ?? 0); if (p > 0 && p < 1) { ctx.save(); ctx.beginPath(); ctx.rect(x - s, y - s * 2, s * 2, s * 2 - s * .86); ctx.clip(); ctx.fillStyle = PAPER.body; ctx.fillRect(x - s * .12, y - s * .86 - s * .4 * (1 - sineIO(p)), s * .26, s * .34); ctx.restore(); }
  ctx.strokeStyle = rgba(CREAM, .6); ctx.lineWidth = 2; ctx.strokeRect(x - s / 2, y - s * .8, s, s * .8);
}
export function desk(ctx, x, y, w, h = 80) {   // an office desk with a drawer block
  ctx.fillStyle = mixHex(P.ind2, P.blue1, .4); ctx.fillRect(x - w / 2, y - h, w, 12); ctx.fillRect(x + w / 2 - w * .32, y - h, w * .3, h); ctx.fillRect(x - w / 2 + 8, y - h, 9, h);
  ctx.fillStyle = rgba(P.blue1, .8); ctx.fillRect(x - w / 2, y - h, w, 2); ctx.fillStyle = rgba(P.halo2, .25); ctx.fillRect(x + w / 2 - w * .26, y - h * .55, w * .18, 3);
}
// a professor: an indigo person in a long gown with a mortarboard (never yellow)
export function professor(ctx, t, x, y, h, o = {}) {
  F.person(ctx, x, y, h, { long: true, dir: o.dir ?? 1, look: o.look ?? .1, armR: [.25, .1], armL: [-.25, -.1], light: o.light ?? .6 });
  const hx = x, hy = y - h * .97;
  ctx.fillStyle = P.night0; F.poly(ctx, [[hx - h * .13, hy], [hx, hy - h * .04], [hx + h * .13, hy], [hx, hy + h * .04]]); ctx.fill();
  ctx.fillRect(hx - h * .05, hy, h * .1, h * .05);
  ctx.strokeStyle = rgba(P.halo2, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx + h * .02, hy); ctx.quadraticCurveTo(hx + h * .12, hy + h * .02, hx + h * .11, hy + h * .09); ctx.stroke();
}
// a laptop on a desk at night: (x, y) = the desk top centre, s = screen width. o: { screen 0..1 } → the screen rect
export function laptop(ctx, t, x, y, s, o = {}) {
  const sc = clamp(o.screen ?? 1), sw = s, sh = s * .64, sx = x - sw / 2, sy = y - sh - 8;
  ctx.fillStyle = mixHex(P.blue1, P.ind1, .4); F.poly(ctx, [[x - sw * .56, y], [x + sw * .56, y], [x + sw * .5, y - 8], [x - sw * .5, y - 8]]); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.beginPath(); ctx.roundRect(sx - 6, sy - 6, sw + 12, sh + 10, 6); ctx.fill();
  ctx.fillStyle = lin(ctx, sx, sy, sx + sw, sy + sh, [[0, mixHex(P.night1, COOL.body, .6 * sc)], [1, mixHex(P.night0, COOL.deep, .7 * sc)]]); ctx.fillRect(sx, sy, sw, sh);
  if (sc > 0) halo(ctx, x, sy + sh / 2, sw * 1.2, .35 * sc, COOL.halo, COOL.core);
  return { x: sx, y: sy, w: sw, h: sh };
}
// a round sign: kind '?' (a question), 'path' (a winding way, the machine's: cool), 'tick'. (x, y) centre, r. o: { u, lit 0..1 }
export function sign(ctx, t, kind, x, y, r, o = {}) {
  const u = clamp(o.u ?? 1); if (u <= 0) return; const lit = clamp(o.lit ?? 0), k = expoOut(u);
  const col = kind === 'path' ? COOL : GOLD;
  if (lit > 0) halo(ctx, x, y, r * 2.2, .55 * lit, col.halo, col.core);
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = rgba(mixHex(P.night0, P.ind1, .4), .92); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.29); ctx.fill();
  ctx.strokeStyle = mixHex(rgba(CREAM, .7), kind === 'path' ? COOL.line : GOLD.line, lit); ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();
  if (kind === '?') F.glowText(ctx, '?', x, y + r * .3, { size: r * 1.05, serif: true, align: 'center', col: mixHex(CREAM, GOLD.body, lit), glow: lit > .5, a: k });
  else if (kind === 'tick') F.goldSpan(ctx, [[x - r * .42, y + r * .02], [x - r * .1, y + r * .34], [x + r * .46, y - r * .34]], 0, smooth(span(u, .3, 1)), { w: r * .09, spark: false, a: lerp(.55, 1, lit) });
  else { const pts = []; for (let i = 0; i <= 30; i++) { const q = i / 30; pts.push([x - r * .6 + q * r * 1.2, y + Math.sin(q * Math.PI * 2.2) * r * .28]); } F.trailCream(ctx, pts, 0, smooth(span(u, .3, 1)), { w: r * .07, col: mixHex(CREAM, COOL.core, lit) }); }
}
// a cool arrow (the machine's light): from a to b, slight arc, drawn with u
export function coolArrow(ctx, a, b, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - (o.arc ?? 60), pts = [];
  for (let i = 0; i <= 30; i++) { const q = i / 30; pts.push([(1 - q) ** 2 * a[0] + 2 * (1 - q) * q * mx + q * q * b[0], (1 - q) ** 2 * a[1] + 2 * (1 - q) * q * my + q * q * b[1]]); }
  const e = F.trailCream(ctx, pts, 0, smooth(u), { w: o.w ?? 3, col: COOL.line, a: o.a });
  if (e) halo(ctx, e[0], e[1], 30, .6 * (o.a ?? 1), COOL.halo, COOL.core);
  if (u > .85) { const p = pts[pts.length - 3], ang = Math.atan2(b[1] - p[1], b[0] - p[0]), s = 18; ctx.save(); ctx.fillStyle = COOL.line; ctx.globalAlpha *= span(u, .85, 1) * (o.a ?? 1); ctx.translate(b[0], b[1]); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-s, -s * .55); ctx.lineTo(-s, s * .55); ctx.closePath(); ctx.fill(); ctx.restore(); }
  return pts;
}
// a cream verdict (a caveat, a condition, an open question: never gold): caps rise behind a mask, a cream dashed underline draws
export function creamWord(ctx, t, x, y, text, u, o = {}) {
  u = clamp(u); if (u <= 0) return null;
  const size = o.size ?? 30, tw = F.measure(text, size, false, 700) + size * text.length * .08, x0 = o.align === 'left' ? x : x - tw / 2;
  F.maskLine(ctx, [[text, 0]], x0, y, size, F.rise(u), { serif: false, weight: 700, col: CREAM, glow: false, spacing: .08 });
  ctx.save(); ctx.strokeStyle = rgba(CREAM, .8); ctx.lineWidth = 1.6; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(x0, y + size * .34); ctx.lineTo(x0 + tw * smooth(span(u, .35, 1)), y + size * .34); ctx.stroke(); ctx.restore();
  return { x: x0, y, w: tw };
}
// a small human figure with a light in hand (one of many): indigo, the light gold. Returns the hand.
export function lightPerson(ctx, t, x, y, h, o = {}) {
  const hd = F.person(ctx, x, y, h, { dir: o.dir ?? 1, look: o.look ?? .4, armR: o.armR ?? [2.2, 2.6], armL: o.armL ?? [-.2, -.1], light: .6, lean: o.lean ?? 0, walk: o.walk });
  const l = clamp(o.light ?? 1); if (l > 0) { const p = hd.R; halo(ctx, p[0], p[1] - 4, h * .5, .75 * l, GOLD.halo, GOLD.core); ctx.fillStyle = rgba(GOLD.core, l); ctx.beginPath(); ctx.arc(p[0], p[1] - 4, h * .03, 0, 6.29); ctx.fill(); }
  return hd;
}

// ---------------------------------------------------------------- THE TURING CARD: where one word sits (for "control" to lift off)
export function turingWord(word = 'control') {
  const size = S.TURING.size, w = S.TURING.w, pad = 54, words = S.TURING.text.split(/\s+/), lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), size, true) > w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const x = (W - w) / 2, y = S.TURING.y, h = 24 + lines.length * size * 1.22 + 92;
  for (const [li, ln] of lines.entries()) { let xx = pad; for (const wd of ln) { if (wd === word) return { x: x + xx, y: y + 24 + (li + 1) * size * 1.22, w: F.measure(wd, size, true), size, card: { x, y, w, h } }; xx += F.measure(wd, size, true) + size * .26; } }
  return null;
}
// paper patch over that word on the card (same gradient as the card face), so the word can leave its place
export function turingPatch(ctx, wb, u) {
  if (u <= 0) return; const { card } = wb;
  ctx.save(); ctx.translate(card.x + card.w / 2, card.y + card.h / 2); ctx.rotate(-.006); ctx.translate(-card.w / 2, -card.h / 2);
  ctx.globalAlpha *= clamp(u);
  ctx.fillStyle = lin(ctx, 0, 0, card.w, card.h, [[0, PAPER.lit], [1, PAPER.body]]);
  ctx.fillRect(wb.x - card.x - 6, wb.y - card.y - wb.size * .86, wb.w + 14, wb.size * 1.12);
  ctx.restore();
}

// ---------------------------------------------------------------- THE BOARD with rows that grow and collapse (harvest + end screen)
// (x, yTop0) = the top-left of the FOUR-ROW board (the end-screen position); extra rows above (o.above, each { ..., k 0..1 }) grow the board
// upward. o: { w, rowH, head, title, titleB, titleK 0..1 (title A → B: A sinks, B rises), rows (the four), cells, glow, sub }
export function tallBoard(ctx, t, x, y, o = {}) {
  const w = o.w ?? 660, rowH = o.rowH ?? 92, head = o.head ?? 112, rows = o.rows ?? [], above = o.above ?? [];
  const extra = above.reduce((s, r) => s + rowH * sineIO(clamp(r.k ?? 1)), 0), top = y - extra, h = head + extra + rows.length * rowH + 30;
  halo(ctx, x + w / 2, top + h * .45, Math.max(w, h) * .75, .22 * (o.glow ?? 1), GOLD.halo, P.halo1);
  const fu = expoOut(clamp(o.u ?? 1)); ctx.save(); if (fu < 1) { ctx.beginPath(); ctx.rect(x - 30, top - 30, w + 60, (h + 60) * fu); ctx.clip(); }
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(x + 10, top + 16, w, h, 14); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, top, 0, top + h, [[0, mixHex(P.night1, P.ind1, .55)], [1, mixHex(P.night0, P.night1, .6)]]); ctx.beginPath(); ctx.roundRect(x, top, w, h, 14); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .5); ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = GOLD.line; ctx.lineWidth = 3.5; const c = 30;
  for (const [qx, qy, sx, sy] of [[x, top, 1, 1], [x + w, top, -1, 1], [x, top + h, 1, -1], [x + w, top + h, -1, -1]]) { ctx.beginPath(); ctx.moveTo(qx + sx * c, qy); ctx.lineTo(qx, qy); ctx.lineTo(qx, qy + sy * c); ctx.stroke(); }
  // the title: A sinks, B rises (behind the same mask)
  const tk = clamp(o.titleK ?? 0), ts = o.titleSize ?? 30;
  if (tk < 1) F.maskLine(ctx, [[o.title ?? '', .9]], x + w / 2, top + head * .52, ts, F.rise(1 - tk), { serif: false, weight: 700, col: GOLD.text, glow: true, align: 'center' });
  if (tk > 0 && o.titleB) F.maskLine(ctx, [[o.titleB, .9]], x + w / 2, top + head * .52, ts, F.rise(tk), { serif: false, weight: 700, col: GOLD.text, glow: true, align: 'center' });
  F.goldSpan(ctx, [[x + w * .12, top + head * .74], [x + w * .88, top + head * .74]], 0, 1, { w: 1.2, spark: false });
  const out = []; let ry = top + head;
  ctx.save(); ctx.beginPath(); ctx.rect(x, top + head - 2, w, h - head); ctx.clip();
  for (const r of above) { const kh = rowH * sineIO(clamp(r.k ?? 1)); if (kh > .5) { ctx.save(); ctx.beginPath(); ctx.rect(x, ry, w, kh); ctx.clip(); F.boardRow(ctx, t, x + 20, ry + kh - rowH, w - 40, rowH, r, { cells: o.cells ?? 15 }); ctx.restore(); } ry += kh; }
  ctx.restore();
  for (const r of rows) { out.push(F.boardRow(ctx, t, x + 20, ry, w - 40, rowH, r, { cells: o.cells ?? 15 })); ry += rowH; }
  ctx.restore();
  return { x, y: top, w, h, rows: out };
}
// F.ring with a smooth "think" pulse: the kit's think pulls each ring on a sawtooth (a radius jump every 1/.55 s → POP flags);
// here the whole ring breathes inward on a cosine instead (same amplitude order), and the kit's think stays 0.
export function ringS(ctx, t, x, y, r, o = {}) {
  const th = o.think ?? 0, k = th * .05 * (1 - Math.cos(t * .55 * Math.PI * 2)) / 2;
  F.ring(ctx, t, x, y, r * (1 - k), { ...o, think: 0 });
}
