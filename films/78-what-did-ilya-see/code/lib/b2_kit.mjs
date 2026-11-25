// Film 78 · B2 (c07–c10) · chunk-only drawing helpers (builder B2; the lead's kit lib/f78_kit.mjs + lib/f78_world.mjs stay untouched).
// Everything draws in the caller's space (put it under S.view), takes u-style 0..1 parameters driven by phrase anchors in the scene code,
// never creates canvases per frame and never uses Math.random (seeded prng only).
//   rooftops() · university() · schoolboy() · qcard() + litTimes() · ssiBuilding() · safeFrame() · slotRow() · valueBar() · chip() ·
//   labDoor() · arrowsIn() · shelter() · dog() · knot() · blueprint() · audience() · hallDome() · subRing() · manToward() · lerpR …
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo, rad, lin, prng } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, INK, rise, maskLine, measure } = F;
const TAU = Math.PI * 2;

export const lerpR = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), w: lerp(a.w, b.w, u), h: lerp(a.h, b.h, u) });
export const lerpC = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)) });
// a camera that holds the design point (dx, dy) at the screen point (sx, sy) with magnification s
export const camAt = (dx, dy, sx, sy, s) => ({ x: dx - (sx - W / 2) / s, y: dy - (sy - H / 2) / s, s });

// ------------------------------------------------------------------------------------------------ word times for cards
// card words light when the VO speaks them: specs [[cardWordIndex, fromPhrase, toPhrase, after]] → each run of consecutive card words
// takes the times of the spoken words from T.GW(from, to, after) one by one. Returns an array (null = not spoken).
export function litTimes(T, n, specs) {
  const out = new Array(n).fill(null);
  for (const [i0, from, to, after] of specs) { const ws = T.GW(from, to, after ?? -1); ws.forEach((w, k) => { if (i0 + k < n) out[i0 + k] = w.s; }); }
  return out;
}
// a quote card on paper (the kit's look) with explicit word lighting: o { text, x, y, w, size, u, times (litTimes), credit, head,
// rot, a, goldAll (0..1: every word to gold ink) }. Returns { x, y, w, h, words: [{x, y, w}] (card space) }.
export function qcard(ctx, t, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const size = o.size ?? 50, w = o.w ?? 1100, pad = 54, words = o.text.split(/\s+/), lines = []; let cur = [];
  for (const wd of words) { const nx = [...cur, wd]; if (cur.length && measure(nx.join(' '), size, true) > w - pad * 2) { lines.push(cur); cur = [wd]; } else cur = nx; }
  if (cur.length) lines.push(cur);
  const head = o.head ? 74 : 26, h = head + lines.length * size * 1.22 + (o.credit ? 96 : 40);
  const x = o.x ?? (W - w) / 2, y = o.y ?? 200;
  F.paperCard(ctx, t, x, y, w, h, { u, rot: o.rot ?? -.006, head: o.head, a: o.a });
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1) * clamp(u * 3);
  ctx.translate(x + w / 2, y + h / 2 + (1 - expoOut(u)) * 40); ctx.rotate((o.rot ?? -.006) + (1 - expoOut(u)) * .04); ctx.translate(-w / 2, -h / 2);
  let k = 0; const pos = [];
  lines.forEach((ln, li) => {
    let xx = pad; const yy = head + (li + 1) * size * 1.22;
    for (const wd of ln) {
      const tt = o.times ? o.times[k] : null, lit = tt == null ? 0 : clamp((t - tt + .04) / .22);
      const g = Math.max(lit, clamp(o.goldAll ?? 0));
      const col = mixHex(o.times && !o.inkAll ? mixHex(PAPER.ink, PAPER.faint, .35) : PAPER.ink, GOLD.deep, g * .9);
      maskLine(ctx, [[wd + ' ', 0]], xx, yy, size, rise(span(u, .3 + li * .08, .9 + li * .08)), { serif: true, col, glow: false });
      if (g > 0) { ctx.fillStyle = rgba(GOLD.mid, .55 * g); ctx.fillRect(xx, yy + size * .14, measure(wd, size, true) * g, Math.max(2, size * .05)); }
      pos.push({ x: xx, y: yy, w: measure(wd, size, true) });
      xx += measure(wd, size, true) + size * .26; k++;
    }
  });
  if (o.credit) maskLine(ctx, [[o.credit.toUpperCase(), 0]], pad, h - 36, 22, rise(span(u, .55, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  ctx.restore();
  return { x, y, w, h, words: pos };
}

// ------------------------------------------------------------------------------------------------ rooftops with windows (M.01)
// a low row of houses along base (x0..x1); windows light up as the wave reaches them: lit(x) 0..1 given by o.wave(x).
const ROOFS = (() => { const r = prng(707), a = []; let x = 0; while (x < 4200) { const w = 70 + r() * 120, h = 40 + r() * 70, roof = r() < .55 ? 'gable' : 'flat', wins = []; const nw = 1 + Math.floor(r() * 3); for (let i = 0; i < nw; i++) wins.push([.18 + .64 * (nw === 1 ? .5 : i / (nw - 1)), .45 + .2 * r(), r()]); a.push({ x, w, h, roof, wins }); x += w + 6 + r() * 30; } return a; })();
export function rooftops(ctx, t, x0, base, o = {}) {
  const k = o.scale ?? 1, rs = expoOut(clamp(o.rise ?? 1)), wave = o.wave ?? (() => 1);
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 50, base - 400 * k, 4400 * k, 400 * k + 2); ctx.clip();
  ctx.translate(0, (1 - rs) * 160 * k);
  for (const b of ROOFS) {
    const bx = x0 + b.x * k, bw = b.w * k, bh = b.h * k; if (b.x * k > (o.len ?? 4200)) break;
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55);
    ctx.beginPath(); ctx.moveTo(bx, base); ctx.lineTo(bx, base - bh);
    if (b.roof === 'gable') { ctx.lineTo(bx + bw / 2, base - bh - bw * .32); ctx.lineTo(bx + bw, base - bh); } else ctx.lineTo(bx + bw, base - bh);
    ctx.lineTo(bx + bw, base); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(GOLD.line, .12); ctx.lineWidth = 1; ctx.stroke();
    for (const [u, v, q] of b.wins) {
      const lw = wave(bx + bw * u), on = clamp(lw * 1.6 - q * .6), wx = bx + bw * u - 7 * k, wy = base - bh * v - 9 * k;
      ctx.fillStyle = mixHex(mixHex(P.night0, P.ind1, .6), mixHex(GOLD.hot, P.core1, q), on * (.8 + .2 * Math.sin(t * .7 + q * 40)));
      ctx.fillRect(wx, wy, 14 * k, 16 * k);
      if (on > .3) halo(ctx, wx + 7 * k, wy + 8 * k, 34 * k, .22 * on, GOLD.halo, GOLD.hot);
    }
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the university (6.02)
// a facade: steps, 4 columns each side of an arched centre window (Ilya at a lectern inside, sound rings), pediment, sign over the door.
// x = centre, base = ground; o { rise 0..1 (out of the ground line), lit 0..1, sign 0..1, inside 0..1 (the lectern), rings 0..1 }.
// Returns { win: {cx, cy, w, h} (the arch window), door: {x, y, w, h} }.
export function university(ctx, t, x, base, w, h, o = {}) {
  const rs = sineIO(clamp(o.rise ?? 1)), lit = clamp(o.lit ?? 1);
  const win = { cx: x, cy: base - h * .56, w: w * (o.winW ?? .2), h: h * (o.winH ?? .42) }, door = { x: x - w * .07, y: base - h * .2, w: w * .14, h: h * .2 - 8 };
  if (rs <= 0) return { win, door };
  ctx.save(); ctx.beginPath(); ctx.rect(x - w, base - h * 1.6, w * 2, h * 1.6); ctx.clip(); ctx.translate(0, (1 - rs) * h * 1.05);
  halo(ctx, x, base - h * .5, w * .9, .16 * lit * (o.winGlow ?? 1), GOLD.halo, GOLD.hot);
  // body + pediment
  const x0 = x - w / 2, top = base - h * .82;
  ctx.fillStyle = lin(ctx, x0, 0, x0 + w, 0, [[0, mixHex(P.ind2, P.night1, .4)], [.5, mixHex(P.ind2, P.blue1, .35)], [1, mixHex(P.ind2, P.night0, .45)]]);
  const wx = win.cx - win.w / 2, wy = win.cy - win.h / 2, arch = new Path2D();
  arch.moveTo(wx, wy + win.h); arch.lineTo(wx, wy + win.w / 2); arch.arc(win.cx, wy + win.w / 2, win.w / 2, Math.PI, 0); arch.lineTo(wx + win.w, wy + win.h); arch.closePath();
  const body = new Path2D(); body.rect(x0, top, w, h * .82); body.addPath(arch); ctx.fill(body, 'evenodd');   // the window is a hole (the fly goes through it)
  ctx.beginPath(); ctx.moveTo(x0 - 16, top + 2); ctx.lineTo(x, base - h); ctx.lineTo(x0 + w + 16, top + 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(GOLD.line, .35 * lit + .1); ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = rgba(GOLD.line, .28 * lit + .08); ctx.fillRect(x0 - 16, top, w + 32, 5);
  // columns
  const nc = 4, cw = w * .045;
  for (const sd of [-1, 1]) for (let i = 0; i < nc; i++) {
    const cx = x + sd * (w * .16 + i * w * .085);
    ctx.fillStyle = lin(ctx, cx - cw / 2, 0, cx + cw / 2, 0, [[0, mixHex(P.blue1, P.night1, .3)], [.4, mixHex(P.blue2, P.cream, .18 + .12 * lit)], [1, mixHex(P.blue1, P.night0, .4)]]);
    ctx.fillRect(cx - cw / 2, top + 14, cw, h * .82 - 40);
  }
  // windows between the columns (small, warm)
  for (const sd of [-1, 1]) for (let i = 0; i < nc - 1; i++) {
    const cx = x + sd * (w * .2 + i * w * .085), q = (i * 7 + (sd > 0 ? 3 : 0)) % 5 / 5;
    for (const fy of [.32, .62]) { const on = clamp(lit * 1.4 - q * .3); ctx.fillStyle = mixHex(P.night0, GOLD.hot, on * (.75 + .2 * Math.sin(t * .5 + q * 9))); ctx.fillRect(cx - cw * .5, top + h * fy * .82, cw, h * .1); }
  }
  // steps
  for (let i = 0; i < 3; i++) { ctx.fillStyle = mixHex(P.ind2, P.blue1, .15 + i * .1); ctx.fillRect(x0 - 30 + i * 14, base - 8 * (i + 1), w + 60 - i * 28, 8); }
  // the arched centre window: warm, Ilya at the lectern inside
  ctx.fillStyle = lin(ctx, 0, wy, 0, wy + win.h, [[0, mixHex(P.night1, GOLD.deep, .35 * lit)], [1, mixHex(GOLD.shade, GOLD.hot, .35 * lit)]]); ctx.save(); ctx.globalAlpha *= o.winFill ?? 1; ctx.fill(arch); ctx.restore();
  ctx.save(); ctx.clip(arch);
  const iu = clamp(o.inside ?? 1);
  if (iu > 0) F.lectern(ctx, t, win.cx, wy + win.h - 4, win.h * .5, { spot: iu, rings: clamp(o.rings ?? .8), rise: iu });
  ctx.restore();
  ctx.strokeStyle = rgba(GOLD.line, .8 * (o.archA ?? 1)); ctx.lineWidth = 3; ctx.stroke(arch);
  halo(ctx, win.cx, win.cy, win.w * 1.4, .25 * lit * (o.winGlow ?? 1), GOLD.halo, GOLD.hot);
  // door + sign
  ctx.fillStyle = mixHex(GOLD.deep, GOLD.hot, .45 * lit); ctx.fillRect(door.x, door.y, door.w, door.h);
  ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(door.x + door.w / 2 - 1, door.y, 2, door.h);
  ctx.restore();
  const su = clamp(o.sign ?? 0);
  if (su > 0 && o.signText) F.goldText(ctx, [[o.signText, .25]], x, top - 22 + (1 - rs) * h, Math.max(22, w * .036), rise(su), { serif: false, weight: 700, spacing: .1, align: 'center', col: CREAM });
  return { win, door };
}
// a schoolboy (E.person, short jacket) with a stack of books under his arm; walking (phase) toward dir
export function schoolboy(ctx, t, x, y, h, o = {}) {
  halo(ctx, x, y - h * .5, h * 1.1, .14 * (o.a ?? 1), GOLD.halo, GOLD.hot);
  const hands = E.person(ctx, x, y, h, { dir: o.dir ?? 1, walk: o.walk, light: 1, rim: GOLD.line, armR: [.55, 1.75] });
  const [hx, hy] = hands.R, d = o.dir ?? 1;
  ctx.save(); ctx.translate(hx - d * h * .03, hy - h * .02); ctx.rotate(-.12 * d);
  [[PAPER.body, 0], ['#b8792a', 1], [PAPER.shade, 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(-h * .1, -h * (.045 + i * .04), h * .2, h * .036); });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ the SSI building (7.05 – 7.18)
// a modest two-storey building: flat roof, a sign board over the door, a big ground-floor window (the shop window), a lab door right.
// x = centre, base = ground, w, h. o { rise, sign 0..1 (SAFE SUPERINTELLIGENCE lights), signText, cut 0..1 (the facade lifts away: the
// inside is drawn by o.inside(ctx, room)), lit }. Returns { sign, shop, door, room } rects.
export function ssiBuilding(ctx, t, x, base, w, h, o = {}) {
  const rs = sineIO(clamp(o.rise ?? 1)), lit = clamp(o.lit ?? 1), cut = sineIO(clamp(o.cut ?? 0));
  const x0 = x - w / 2, top = base - h;
  const sign = { x: x - w * .34, y: top - h * .2, w: w * .68, h: h * .16 };
  const shop = { x: x0 + w * .08, y: base - h * .46, w: w * .5, h: h * .4 };
  const door = { x: x0 + w * .68, y: base - h * .52, w: w * .2, h: h * .52 };
  const room = { x: x0 + 8, y: top + 8, w: w - 16, h: h - 8 };
  if (rs <= 0) return { sign, shop, door, room };
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - w, top - h * 2, w * 3, h * 3); ctx.clip(); ctx.translate(0, (1 - rs) * h * 1.3);
  halo(ctx, x, base - h * .4, w * 1.1, .14 * lit, GOLD.halo, GOLD.hot);
  // the inside (visible when the facade is lifted)
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(x0, top, w, h);
  if (cut > 0 && o.inside) { ctx.save(); ctx.beginPath(); ctx.rect(room.x, room.y, room.w, room.h); ctx.clip(); o.inside(ctx, room); ctx.restore(); }
  // the facade (lifts up and away)
  ctx.save(); ctx.beginPath(); ctx.rect(x0 - 20, top - h * 3, w + 40, h * 3 + (base - top)); ctx.clip();
  ctx.translate(0, cut * h * 1.02);   // the facade sinks into the ground
  ctx.fillStyle = lin(ctx, x0, 0, x0 + w, 0, [[0, mixHex(P.ind2, P.night1, .3)], [.55, mixHex(P.ind2, P.blue1, .3)], [1, mixHex(P.ind2, P.night0, .4)]]);
  ctx.fillRect(x0, top, w, h);
  ctx.strokeStyle = rgba(GOLD.line, .3); ctx.lineWidth = 2; ctx.strokeRect(x0, top, w, h);
  ctx.fillStyle = rgba(GOLD.line, .25); ctx.fillRect(x0 - 10, top - 6, w + 20, 6);
  // upper windows
  for (let i = 0; i < 4; i++) { const wx = x0 + w * (.1 + i * .215), q = (i * 37 % 10) / 10, on = lit * (.6 + .3 * Math.sin(t * .4 + q * 20)); ctx.fillStyle = mixHex(P.night0, GOLD.hot, on); ctx.fillRect(wx, top + h * .1, w * .15, h * .22); }
  // shop window (dark glass, a faint reflection)
  ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fillRect(shop.x, shop.y, shop.w, shop.h);
  ctx.strokeStyle = rgba(CREAM2, .5); ctx.lineWidth = 2; ctx.strokeRect(shop.x, shop.y, shop.w, shop.h);
  ctx.fillStyle = rgba(COOL.line, .07); ctx.beginPath(); ctx.moveTo(shop.x + shop.w * .1, shop.y); ctx.lineTo(shop.x + shop.w * .3, shop.y); ctx.lineTo(shop.x + shop.w * .12, shop.y + shop.h); ctx.lineTo(shop.x - shop.w * .08 + shop.w * .1, shop.y + shop.h); ctx.fill();
  // door (closed, light under it); o.doorDraw(ctx, door) replaces it (the lab door of 7.14)
  if (o.doorDraw) o.doorDraw(ctx, door); else {
  ctx.fillStyle = mixHex(P.night1, P.blue1, .3); ctx.fillRect(door.x, door.y, door.w, door.h);
  ctx.strokeStyle = rgba(GOLD.line, .45); ctx.strokeRect(door.x, door.y, door.w, door.h);
  ctx.fillStyle = rgba(GOLD.hot, .9 * lit); ctx.fillRect(door.x + 2, base - 4, door.w - 4, 3);
  halo(ctx, door.x + door.w / 2, base - 2, door.w * .9, .3 * lit, GOLD.halo, GOLD.hot); }
  ctx.restore();
  ctx.restore();
  // the sign (stays in place; the carrier card lands on it)
  const su = clamp(o.sign ?? 0);
  if (su > 0) {
    const sy = sign.y + (1 - rs) * h * 1.3;
    ctx.fillStyle = INK.panel; ctx.strokeStyle = rgba(GOLD.line, .4 + .5 * su); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(sign.x, sy, sign.w, sign.h, 6); ctx.fill(); ctx.stroke();
    halo(ctx, x, sy + sign.h / 2, sign.w * .7, .3 * su, GOLD.halo, GOLD.hot);
    const ts = Math.min(sign.h * .42, sign.w / ((o.signText ?? 'SAFE SUPERINTELLIGENCE').length * .78));
    F.goldText(ctx, [[o.signText ?? 'SAFE SUPERINTELLIGENCE', su]], x, sy + sign.h * .66, ts, rise(su), { serif: false, weight: 700, spacing: .08, align: 'center', col: CREAM });
  }
  return { sign, shop, door, room };
}
// a gold square frame around a thing (SAFE): drawn as a light line around the rect, label on the top edge
export function safeFrame(ctx, t, R, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const pts = [[R.x, R.y], [R.x + R.w, R.y], [R.x + R.w, R.y + R.h], [R.x, R.y + R.h], [R.x, R.y]];
  F.goldSpan(ctx, pts, 0, sineIO(u), { w: o.w ?? 3, spark: u < 1 });
  if (o.label) { const lu = span(u, .6, 1); if (lu > 0) { const s = o.size ?? 30, tw = measure(o.label, s, false, 700) + s * o.label.length * .12 + 24; ctx.fillStyle = INK.panel; ctx.fillRect(R.x + R.w / 2 - tw / 2, R.y - s * .7, tw, s * 1.3); F.goldText(ctx, [[o.label, 1]], R.x + R.w / 2, R.y + s * .38, s, rise(lu), { serif: false, weight: 700, spacing: .12, align: 'center' }); } }
}
// a row of dashed empty slots (x0..x1 at y, n slots); u draws them in left → right
export function slotRow(ctx, x0, x1, y, n, u, o = {}) {
  const sw = (x1 - x0) / n, h = o.h ?? sw * .7;
  for (let i = 0; i < n; i++) {
    const k = clamp(u * (n + 1) - i); if (k <= 0) continue;
    const bx = x0 + i * sw + sw * .1, bw = sw * .8;
    ctx.save(); ctx.globalAlpha *= clamp(k * 2); ctx.strokeStyle = rgba(CREAM2, .75); ctx.lineWidth = 2; ctx.setLineDash([8, 7]);
    ctx.strokeRect(bx, y - h / 2 + (1 - expoOut(k)) * 30, bw, h); ctx.restore();
  }
}
// a vertical value bar: base line at (x, base), width w, full height h; u fills it with gold from the bottom
export function valueBar(ctx, t, x, base, w, h, u, o = {}) {
  const k = sineIO(clamp(u)), fh = h * k;
  ctx.strokeStyle = rgba(CREAM2, .55 * (o.frame ?? 1)); ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.strokeRect(x - w / 2, base - h, w, h); ctx.setLineDash([]);
  if (fh > 0) {
    ctx.fillStyle = lin(ctx, 0, base - fh, 0, base, [[0, GOLD.hot], [.25, GOLD.body], [1, GOLD.mid]]); ctx.fillRect(x - w / 2, base - fh, w, fh);
    ctx.fillStyle = rgba(GOLD.core, .9); ctx.fillRect(x - w / 2, base - fh, w, 3);
    halo(ctx, x, base - fh, w * 1.6, .35, GOLD.halo, GOLD.core);
  }
  return { top: base - fh };
}
// a chip outline in cool light (pins on all sides), label lines under it
export function chip(ctx, t, x, y, s, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y); ctx.scale(lerp(.8, 1, k), lerp(.8, 1, k));
  halo(ctx, 0, 0, s * 1.4, .22, COOL.halo, COOL.core);
  ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.strokeStyle = rgba(COOL.body, .95); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * .06); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = rgba(COOL.line, .7); ctx.lineWidth = 2; ctx.strokeRect(-s * .28, -s * .28, s * .56, s * .56);
  for (let i = 0; i < 6; i++) { const p = -s * .38 + i * s * .152; for (const [a, b, c, d] of [[p, -s / 2, p, -s / 2 - s * .1], [p, s / 2, p, s / 2 + s * .1], [-s / 2, p, -s / 2 - s * .1, p], [s / 2, p, s / 2 + s * .1, p]]) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); } }
  ctx.fillStyle = rgba(COOL.core, .5 + .3 * Math.sin(t * 1.3)); ctx.fillRect(-s * .12, -s * .12, s * .24, s * .24);
  ctx.restore();
}
// the lab door (big, 7.14 / 7.15 / 7.18): a closed door, plate RESEARCH, light under it; o { frost 0..1 (its window frosts, a cream ?),
// glow (the light under it), plate 0..1 }. x, base, w, h. Returns { seam: { x0, x1, y } }.
export function labDoor(ctx, t, x, base, w, h, o = {}) {
  const x0 = x - w / 2, top = base - h, gl = clamp(o.glow ?? 1);
  // wall
  if (o.wall !== false) { ctx.fillStyle = mixHex(P.night1, P.ind2, .5); ctx.fillRect(x0 - w * .9, top - h * .25, w * 2.8, h * 1.25); }
  // light under the door (spills onto the floor)
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = lin(ctx, 0, base, 0, base + h * .22, [[0, rgba(GOLD.hot, .5 * gl)], [1, rgba(GOLD.halo, 0)]]);
  ctx.beginPath(); ctx.moveTo(x0 + 4, base); ctx.lineTo(x0 + w - 4, base); ctx.lineTo(x0 + w + w * .5, base + h * .22); ctx.lineTo(x0 - w * .5, base + h * .22); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.fillStyle = lin(ctx, x0, 0, x0 + w, 0, [[0, mixHex(P.ind1, P.blue1, .35)], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.fillRect(x0, top, w, h);
  ctx.strokeStyle = rgba(GOLD.line, .55); ctx.lineWidth = 3; ctx.strokeRect(x0, top, w, h);
  ctx.fillStyle = rgba(GOLD.line, .7); ctx.beginPath(); ctx.arc(x0 + w * .85, top + h * .55, w * .035, 0, TAU); ctx.fill();   // the handle
  // the door's window: frosted with a ? when o.frost
  const fw = { x: x0 + w * .25, y: top + h * .12, w: w * .5, h: h * .26 }, fr = clamp(o.frost ?? 0);
  ctx.fillStyle = mixHex(mixHex(P.night0, GOLD.deep, .35), mixHex(CREAM2, P.cream, .3), fr * .55); ctx.fillRect(fw.x, fw.y, fw.w, fw.h);
  ctx.strokeStyle = rgba(GOLD.line, .5); ctx.lineWidth = 2; ctx.strokeRect(fw.x, fw.y, fw.w, fw.h);
  if (fr > 0) { ctx.save(); ctx.globalAlpha *= .25 * fr; const r = prng(23); ctx.fillStyle = P.cream; for (let i = 0; i < 90; i++) ctx.fillRect(fw.x + r() * fw.w, fw.y + r() * fw.h, 3, 3); ctx.restore();
    F.goldText(ctx, [['?', 0]], fw.x + fw.w / 2, fw.y + fw.h * .78, fw.h * .7, rise(span(fr, .3, 1)), { serif: true, align: 'center', col: P.night1 }); }
  // the plate RESEARCH
  const pu = clamp(o.plate ?? 1);
  if (pu > 0) { const ps = Math.max(22, w * .085), pw = measure('RESEARCH', ps, false, 700) + ps * 8 * .12 + 30; ctx.fillStyle = rgba(PAPER.body, .92 * clamp(pu * 3)); ctx.fillRect(x - pw / 2, top + h * .46, pw, ps * 1.5);
    F.goldText(ctx, [['RESEARCH', 0]], x, top + h * .46 + ps * 1.08, ps, rise(pu), { serif: false, weight: 700, spacing: .12, align: 'center', col: PAPER.ink }); }
  // the bright seam under the door
  ctx.fillStyle = mixHex(GOLD.hot, GOLD.core, .5); ctx.globalAlpha = gl; ctx.fillRect(x0 + 3, base - 5, w - 6, 5); ctx.globalAlpha = 1;
  halo(ctx, x, base - 2, w * .8, .45 * gl, GOLD.halo, GOLD.core);
  return { seam: { x0: x0 + 3, x1: x0 + w - 3, y: base - 2.5 } };
}

// ------------------------------------------------------------------------------------------------ c09 pieces
// command arrows pointing at (cx, cy) from n directions at radius r; u brings them in, pulse makes them push
export function arrowsIn(ctx, t, cx, cy, r, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const n = o.n ?? 6, fall = clamp(o.fall ?? 0);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * TAU / n + .3, k = expoOut(clamp(u * 1.4 - i * .07)), push = 10 * Math.sin(t * 3 + i);
    const d = r + 120 * (1 - k) - push * (1 - fall), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d + fall * fall * 600 * (.6 + .4 * ((i * 37) % 10) / 10);
    ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI + fall * (i % 2 ? 1.2 : -1.2)); ctx.globalAlpha *= clamp(k * 2) * (1 - span(fall, .5, 1));
    ctx.fillStyle = rgba(CREAM, .9); ctx.beginPath(); ctx.moveTo(34, 0); ctx.lineTo(-6, -22); ctx.lineTo(4, 0); ctx.lineTo(-6, 22); ctx.closePath(); ctx.fill();
    ctx.fillRect(-58, -4, 56, 8);
    ctx.restore();
  }
}
// the caring machine: the ring's light bends round the figures under it like a shelter (an arc from left to right over the ground)
export function shelter(ctx, t, cx, base, r, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const warm = clamp(o.warm ?? 1), k = sineIO(u);
  halo(ctx, cx, base - r * .5, r * 1.9, .26 * k, mixHex(COOL.halo, GOLD.halo, warm), mixHex(COOL.core, GOLD.hot, warm));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = rad(ctx, cx, base, r * 1.05, [[0, rgba(mixHex(COOL.core, GOLD.hot, warm), .22 * k)], [.7, rgba(mixHex(COOL.halo, GOLD.halo, warm), .1 * k)], [1, rgba(GOLD.halo, 0)]]);
  ctx.beginPath(); ctx.arc(cx, base, r, Math.PI, TAU); ctx.closePath(); ctx.fill(); ctx.restore();
  for (const [rr, w, al] of [[r, 7, .95], [r * 1.05, 2, .7], [r * .9, 2, .35]]) {
    ctx.strokeStyle = rgba(mixHex(COOL.body, GOLD.body, warm), al * k); ctx.lineWidth = w; ctx.beginPath();
    ctx.arc(cx, base, rr, Math.PI + (1 - k) * Math.PI / 2, TAU - (1 - k) * Math.PI / 2); ctx.stroke();
  }
}
// a dog silhouette (side view, facing dir), feet at (x, y), height h (to the ears); o.walk phase
export function dog(ctx, x, y, h, o = {}) {
  const d = o.dir ?? 1, ph = o.walk ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(h * d, h);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.ellipse(0, 0, .55, .04, 0, 0, TAU); ctx.fill();
  const body = mixHex(P.ind2, P.blue1, .5);
  ctx.strokeStyle = body; ctx.lineCap = 'round'; ctx.lineWidth = .1;
  for (const [lx, p] of [[-.3, 0], [-.22, Math.PI], [.25, Math.PI], [.33, 0]]) { const s = Math.sin(ph + p) * .08; ctx.beginPath(); ctx.moveTo(lx, -.42); ctx.lineTo(lx + s, -.02); ctx.stroke(); }
  ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(0, -.5, .42, .17, 0, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.ellipse(.43, -.72, .14, .12, -.3, 0, TAU); ctx.fill();   // head
  ctx.beginPath(); ctx.ellipse(.56, -.68, .1, .055, .1, 0, TAU); ctx.fill();    // snout
  ctx.beginPath(); ctx.ellipse(.36, -.84, .05, .1, -.4, 0, TAU); ctx.fill();    // ear
  ctx.lineWidth = .06; ctx.beginPath(); ctx.moveTo(-.4, -.55); ctx.quadraticCurveTo(-.6, -.7 + .05 * Math.sin(ph * 2), -.62, -.85); ctx.stroke();   // tail
  ctx.strokeStyle = rgba(GOLD.line, .8); ctx.lineWidth = .025; ctx.beginPath(); ctx.ellipse(0, -.5, .42, .17, 0, -2.6, -.4); ctx.stroke();
  ctx.restore();
}
// ONE gold knot (the one condition; the same knot as F.lifeLine's)
export function knot(ctx, x, y, u, r = 16) {
  u = clamp(u); if (u <= 0) return;
  ctx.save(); ctx.strokeStyle = GOLD.body; ctx.lineWidth = r * .25; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(x - r * .5, y - r * .2, r * .8, r * 1.1 * sineIO(u), -.6, 0, TAU * sineIO(u)); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x + r * .5, y + r * .2, r * .8, r * 1.1 * sineIO(span(u, .3, 1)), -.6, 0, TAU * sineIO(span(u, .3, 1))); ctx.stroke();
  ctx.restore(); halo(ctx, x, y, r * 4, .5 * u, GOLD.halo, GOLD.core);
}
// a blueprint sheet: blue paper with a grid, a few drawn strokes (a ring outline, dimension lines), big empty areas
export function blueprint(ctx, t, R, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u);
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  ctx.translate(R.x + R.w / 2, R.y + R.h / 2 + (1 - k) * 40); ctx.rotate(.008 + (1 - k) * .03); ctx.translate(-R.w / 2, -R.h / 2);
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(8, 12, R.w, R.h);
  ctx.fillStyle = lin(ctx, 0, 0, R.w, R.h, [[0, '#24508f'], [1, '#1b3f78']]); ctx.fillRect(0, 0, R.w, R.h);
  ctx.strokeStyle = rgba('#cfe0ff', .12); ctx.lineWidth = 1;
  for (let x = 30; x < R.w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, R.h); ctx.stroke(); }
  for (let y = 30; y < R.h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(R.w, y); ctx.stroke(); }
  ctx.strokeStyle = rgba('#e6efff', .8); ctx.lineWidth = 2; ctx.strokeRect(14, 14, R.w - 28, R.h - 28);
  const dr = sineIO(clamp(o.draw ?? 1));
  ctx.strokeStyle = rgba('#e6efff', .85); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(R.w * .24, R.h * .42, R.h * .2, -Math.PI / 2, -Math.PI / 2 + TAU * .62 * dr); ctx.stroke();   // a ring, unfinished
  ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.arc(R.w * .24, R.h * .42, R.h * .2, -Math.PI / 2 + TAU * .62, -Math.PI / 2 + TAU); ctx.globalAlpha *= .45; ctx.stroke(); ctx.globalAlpha /= .45; ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(R.w * .06, R.h * .78); ctx.lineTo(R.w * .06 + R.w * .36 * dr, R.h * .78); ctx.stroke();
  for (const xx of [R.w * .06, R.w * .42]) { ctx.beginPath(); ctx.moveTo(xx, R.h * .74); ctx.lineTo(xx, R.h * .82); ctx.stroke(); }
  E.glowText(ctx, 'SHEET 1 OF ?', R.w - 30, R.h - 30, { size: 22, weight: 600, align: 'right', spacing: .1, col: rgba('#e6efff', .8), glow: false });
  ctx.restore();
}
// the audience from behind (rows of heads and shoulders), in the caller's space; R = the floor area; o { rows, cols, caps 0..1 (mortar-
// boards), you: [row, col] (that seat is you, yellow), youLit, sink }. Returns the seats [{x, y, s}].
export function audience(ctx, t, R, o = {}) {
  const rows = o.rows ?? 4, cols = o.cols ?? 9, out = [], caps = clamp(o.caps ?? 0), r = prng(55);
  for (let ri = 0; ri < rows; ri++) {
    const f = ri / (rows - 1), y = lerp(R.y, R.y + R.h, f), s = lerp(.55, 1, f), n = Math.round(cols * lerp(1.3, 1, f)), rw = R.w * lerp(.8, 1, f);
    for (let ci = 0; ci < n; ci++) {
      const x = R.x + R.w / 2 + (ci - (n - 1) / 2) * rw / n + (r() - .5) * 10, isYou = o.you && o.you[0] === ri && o.you[1] === ci, hh = 120 * s * (o.scale ?? 1);
      out.push({ x, y, s: hh, you: isYou });
      if (isYou) { halo(ctx, x, y - hh * .6, hh * 1.4, .3 * (o.youLit ?? 1), P.coat, P.core1); E.du(ctx, x, y + hh * .55, hh * 1.55, { light: 1, look: .35, dir: -1, view: 'back' }); continue; }
      const col = mixHex(P.night1, P.ind2, .7 - .4 * f);
      ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, hh * .34, hh * .26, 0, Math.PI, TAU); ctx.lineTo(x + hh * .34, y + hh * .2); ctx.lineTo(x - hh * .34, y + hh * .2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x, y - hh * .36, hh * .14, hh * .17, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, .35 * (o.rim ?? 1)); ctx.lineWidth = Math.max(1, hh * .02); ctx.beginPath(); ctx.ellipse(x, y - hh * .36, hh * .14, hh * .17, 0, -2.4, -.7); ctx.stroke();
      if (caps > 0) {   // a mortarboard: a flat diamond on top, a tassel
        const k = expoOut(clamp(caps * 1.6 - ((ci * 13 + ri * 7) % 10) / 16)), cy = y - hh * .5 - (1 - k) * 30;
        if (k > 0) { ctx.save(); ctx.globalAlpha *= clamp(k * 3); ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.moveTo(x - hh * .26, cy); ctx.lineTo(x, cy - hh * .07); ctx.lineTo(x + hh * .26, cy); ctx.lineTo(x, cy + hh * .07); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = rgba(GOLD.line, .6); ctx.lineWidth = Math.max(1, hh * .015); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x + hh * .2, cy + hh * .12); ctx.stroke(); ctx.restore(); }
      }
    }
  }
  return out;
}
// the dome of Convocation Hall from inside: arcs and ribs drawn over the room (u draws them)
export function hallDome(ctx, t, cx, base, r, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = sineIO(u);
  for (let i = 0; i < 3; i++) { ctx.strokeStyle = rgba(GOLD.line, (.5 - i * .12) * k); ctx.lineWidth = 3 - i * .7; ctx.beginPath(); ctx.ellipse(cx, base, r * (1 - i * .08), r * .78 * (1 - i * .08), 0, Math.PI + (1 - k) * Math.PI * .5, TAU - (1 - k) * Math.PI * .5); ctx.stroke(); }
  for (let i = 1; i < 8; i++) { const a = Math.PI + i * Math.PI / 8, kk = clamp(k * 1.5 - i * .05); ctx.strokeStyle = rgba(GOLD.line, .22 * kk); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r * .3, base + Math.sin(a) * r * .78 * .3); ctx.lineTo(cx + Math.cos(a) * r * lerp(.3, .92, kk), base + Math.sin(a) * r * .78 * lerp(.3, .92, kk)); ctx.stroke(); }
  // the oculus
  halo(ctx, cx, base - r * .78, r * .3, .3 * k, GOLD.halo, GOLD.hot);
}
// the subscribe moment: a calm cream ring draws around (cx, cy) with SUBSCRIBE under it (no QR)
export function subRing(ctx, t, cx, cy, r, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const k = sineIO(u), br = .5 + .5 * Math.sin(t * 1.4);
  halo(ctx, cx, cy, r * 1.6, .18 * k, GOLD.halo, GOLD.hot);
  ctx.strokeStyle = rgba(CREAM, .75 * k); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r * (1 + .02 * br), -Math.PI / 2, -Math.PI / 2 + TAU * k); ctx.stroke();
  ctx.strokeStyle = rgba(GOLD.line, .3 * k); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r * 1.12, 0, TAU); ctx.stroke();
  const lu = span(u, .4, 1); if (lu > 0) F.goldText(ctx, [[o.label ?? 'SUBSCRIBE', .35]], cx, cy + r + 46, o.size ?? 28, rise(lu), { serif: false, weight: 700, spacing: .16, align: 'center', col: CREAM });
}
// Ilya walking toward us (thumbnail C): frontal walk, gold back light from the tower, a long shadow that falls toward the viewer.
// x, y = feet (caller space), h = height, o { walk (phase), sx, sy (shadow direction, default down-left), a }
export function manToward(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1;
  // the long shadow toward us (away from the light behind him)
  ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = lin(ctx, x, y, x + (o.sx ?? -.9) * h * 1.6, y + (o.sy ?? 1) * h * 1.6, [[0, rgba(P.night0, .75)], [1, rgba(P.night0, 0)]]);
  const dx = (o.sx ?? -.9) * h * 1.8, dy = (o.sy ?? 1) * h * 1.2;
  ctx.beginPath(); ctx.moveTo(x - h * .09, y); ctx.lineTo(x + h * .09, y); ctx.lineTo(x + dx + h * .2, y + dy); ctx.lineTo(x + dx - h * .2, y + dy); ctx.closePath(); ctx.fill(); ctx.restore();
  // the gold rim light (back light) around him
  halo(ctx, x, y - h * .7, h * .55, .2 * a, GOLD.halo, GOLD.hot);
  ctx.save(); ctx.globalAlpha *= a;
  E.person(ctx, x, y, h, { long: true, walk: o.walk, view: 'back', light: -.3, back: .9, look: .05, rim: GOLD.line, dir: o.dir ?? 1, breath: true });
  ctx.restore();
}
// a small warm light (a sun at the horizon / a light in a hand)
export function warmLight(ctx, x, y, r, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  halo(ctx, x, y, r * 5, .45 * u, GOLD.halo, GOLD.core);
  ctx.fillStyle = rad(ctx, x, y, r, [[0, GOLD.core], [.6, rgba(GOLD.hot, .95)], [1, rgba(GOLD.body, 0)]]); ctx.beginPath(); ctx.arc(x, y, r * (.95 + .05 * Math.sin((o.t ?? 0) * 2)), 0, TAU); ctx.fill();
}
// a sun rising on a horizon (clipped at y): u 0..1 how far it has risen
export function sunrise(ctx, x, y, r, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  halo(ctx, x, y, r * 6 * (.6 + .4 * u), .4 * u, GOLD.halo, GOLD.hot);
  ctx.save(); ctx.beginPath(); ctx.rect(x - r * 3, y - r * 4, r * 6, r * 4); ctx.clip();
  ctx.fillStyle = rad(ctx, x, y + r * (1 - sineIO(u)) * 1.1, r, [[0, GOLD.core], [.7, GOLD.hot], [1, GOLD.body]]); ctx.beginPath(); ctx.arc(x, y + r * (1 - sineIO(u)) * 1.1, r, 0, TAU); ctx.fill();
  ctx.restore();
  F.goldSpan(ctx, [[x - r * 4, y], [x + r * 4, y]], 0, 1, { w: 1.4, spark: false, a: .6 * u });
}
