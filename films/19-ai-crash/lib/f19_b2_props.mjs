// Film 19 · B2 (c07–c10) · own props and helpers (builder B2; not part of the shared kit).
// Flat light-and-paper objects in the channel palette; every prop draws in the CURRENT transform (callers place it with a camera).
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { RED, COOL } from './f19_kit.mjs';
import { paperCard } from './f19_props.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, glowFill, halo, lin, rad, prng, drift } = E;

// ------------------------------------------------------------------ math + camera
export const rise = (x) => 1 - (1 - clamp(x)) ** 3;
export const S = span;
// a 2D camera: design point (px, py) sits at screen (fx, fy), zoom z
export const cam = (z = 1, px = W / 2, py = H / 2, fx = W / 2, fy = H / 2) => ({ z, px, py, fx, fy });
export const ID = cam();
export function camK(t, K) {   // [[t, cam, ease 's'|'q'|'i'|'o']]; z in log space, the anchor point follows the zoom so the move feels even
  if (t <= K[0][0]) return { ...K[0][1] };
  if (t >= K[K.length - 1][0]) return { ...K[K.length - 1][1] };
  let i = 0; while (t > K[i + 1][0]) i++;
  const a = K[i][1], b = K[i + 1][1], e = { s: sineIO, q: quartIO, i: expoIn, o: expoOut }[K[i + 1][2] || 's'];
  const u = e((t - K[i][0]) / (K[i + 1][0] - K[i][0]));
  const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), u));
  // keep the zoom straight: interpolate where the screen centre looks at in design space
  const ca = [a.px + (W / 2 - a.fx) / a.z, a.py + (H / 2 - a.fy) / a.z], cb = [b.px + (W / 2 - b.fx) / b.z, b.py + (H / 2 - b.fy) / b.z];
  const w = (1 / z - 1 / a.z) / (1 / b.z - 1 / a.z || 1e-9), k = Math.abs(b.z - a.z) > 1e-6 ? clamp(w, -.2, 1.2) : u;
  return { z, px: lerp(ca[0], cb[0], k), py: lerp(ca[1], cb[1], k), fx: W / 2, fy: H / 2 };
}
export const camDrift2 = (c, t, amt = 1, seed = 0) => ({ ...c, px: c.px + drift(t, 4 * amt, seed) / c.z, py: c.py + drift(t, 2.5 * amt, seed + 3) / c.z, z: c.z * (1 + drift(t, .004 * amt, seed + 5)) });
export function view(ctx, c, fn) { ctx.save(); ctx.setTransform(c.z, 0, 0, c.z, c.fx - c.px * c.z, c.fy - c.py * c.z); fn(c.z); ctx.restore(); }
export const toS = (c, x, y) => [c.fx + (x - c.px) * c.z, c.fy + (y - c.py) * c.z];

// ------------------------------------------------------------------ type
export function riseText(ctx, s, x, y, u, o = {}) {   // text rising from its baseline (clipped), o.out 0..1 sinks it again
  const k = rise(u) * (1 - rise(o.out ?? 0)); if (k <= 0) return;
  const size = o.size ?? 34;
  ctx.save(); ctx.beginPath(); ctx.rect(-4000, y - size * 1.2, 12000, size * 1.55); ctx.clip();
  E.glowText(ctx, s, x, y + (1 - k) * size * 1.25, o);
  ctx.restore();
}

// ------------------------------------------------------------------ the night ground (identical to the seam plates' night)
export function nightBg(ctx, t, starA = .4) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.6, P.night1], [1, mixHex(P.ind0, P.blue1, .2)]]); ctx.fillRect(0, 0, W, H);
  E.stars(ctx, 1919, 70, t, [0, 0, W, H], starA);
}

// ------------------------------------------------------------------ paper: bills, the money stack
const PAPER = { top: '#f7efd2', bot: '#e3d3a8', edge: '#b59a6a', ink: '#3a3550' };
export function ink(ctx, s, x, y, size, o = {}) {
  ctx.font = `${o.weight ?? 600} ${size}px ${o.serif ? '"Instrument Serif"' : 'Inter'}`; ctx.fillStyle = o.col ?? PAPER.ink; ctx.textAlign = o.align ?? 'left';
  ctx.letterSpacing = `${o.sp ?? 0}em`; ctx.fillText(s, x, y); ctx.letterSpacing = '0px';
}
// a bill card (repair bill / rent): header, a big amount. o { head, amount, tilt, a, lit, flip (−1..1 scaleX), w/h ratio .7 }
export function bill(ctx, t, x, y, w, o = {}) {
  const h = w * (o.ratio ?? 1.25), a = o.a ?? 1, fx = o.flip ?? 1; if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.tilt ?? 0); ctx.scale(Math.max(.03, Math.abs(fx)), 1);
  paperCard(ctx, 0, 0, w, h, { lit: o.lit ?? .6, a });
  ctx.globalAlpha *= a;
  ink(ctx, o.head ?? 'BILL', -w * .4, -h * .32, w * .085, { sp: .14 });
  ctx.fillStyle = rgba(PAPER.ink, .22); for (let k = 0; k < 2; k++) ctx.fillRect(-w * .4, -h * .2 + k * h * .09, w * .5, w * .014);
  if (o.amount) ink(ctx, o.amount, 0, h * .3, w * .3, { serif: true, align: 'center', weight: 400 });
  ctx.restore();
}
// a stack of bills of paper light (venture money). (x, yb) bottom centre, w, h height; o { n layers, a, glow }
export function moneyStack(ctx, t, x, yb, w, h, o = {}) {
  const n = o.n ?? 22, a = o.a ?? 1; if (a <= 0 || h <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  const body = new Path2D(); body.roundRect(x - w / 2, yb - h, w, h, 6);
  glowFill(ctx, body, 40, .35 * (o.glow ?? 1), P.halo0);
  const lh = h / n;
  for (let k = 0; k < n; k++) {
    const y0 = yb - (k + 1) * lh, off = Math.sin(k * 2.7) * 6 + Math.sin(t * .8 + k) * 1.2;
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + lh, [[0, mixHex(PAPER.top, P.core1, .3)], [1, mixHex(PAPER.bot, P.halo1, .4)]]);
    ctx.beginPath(); ctx.roundRect(x - w / 2 + off, y0, w, Math.max(1, lh - Math.min(3, lh * .2)), Math.min(4, lh / 2)); ctx.fill();
    ctx.fillStyle = rgba(PAPER.edge, .45); ctx.fillRect(x - w / 2 + off + 8, y0 + lh * .45, w * .18, Math.max(1, lh * .12));
  }
  ctx.restore();
}

// ------------------------------------------------------------------ people as icons (ten adults)
export function figIcon(ctx, x, y, s, fill, o = {}) {   // (x, y) feet centre, s ≈ height; fill 0..1 gold
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s / 100, s / 100);
  const p = new Path2D(); p.arc(0, -78, 15, 0, 7); p.moveTo(-26, 0); p.lineTo(-26, -34); p.quadraticCurveTo(-26, -58, 0, -58); p.quadraticCurveTo(26, -58, 26, -34); p.lineTo(26, 0); p.closePath();
  if (fill > 0) { glowFill(ctx, p, 18, .55 * fill, P.halo0); ctx.fillStyle = rgba(mixHex(P.halo0, P.core1, .4), fill); ctx.fill(p); }
  ctx.strokeStyle = rgba(fill > .5 ? P.halo0 : COOL.mid, .85); ctx.lineWidth = 3.5; ctx.stroke(p);
  ctx.restore();
}

// ------------------------------------------------------------------ the town: facade + glass door + office inside
export function facade(ctx, t, x0, x1, top, base, o = {}) {
  ctx.fillStyle = lin(ctx, 0, top, 0, base, [[0, mixHex(P.night1, P.ind0, .55)], [1, mixHex(P.night0, P.ind0, .35)]]); ctx.fillRect(x0, top, x1 - x0, base - top);
  ctx.fillStyle = rgba(P.blue2, .35); ctx.fillRect(x0, top, x1 - x0, 3);
  for (let k = 0; x0 + 120 + k * 260 < x1 - 120; k++) {   // dark upper windows, one with a faint cool light
    const wx = x0 + 120 + k * 260; ctx.fillStyle = k === 2 ? rgba(COOL.mid, .14 + .03 * Math.sin(t * .7)) : rgba(P.night0, .7); ctx.fillRect(wx, top + 60, 120, 90);
  }
}
// the glass office door: frame rect (x, y) top-left, w, h. o { light 0..1, wipe 0..1 (whiteboard wiped), person: fn(ctx) drawn inside the glass }
export function glassDoor(ctx, t, x, y, w, h, o = {}) {
  const L = clamp(o.light ?? 1), g = { x: x + 10, y: y + 10, w: w - 20, h: h - 10 };
  if (L > 0) { halo(ctx, x + w / 2, y + h * .55, w * 1.6, .32 * L); E.lightPool(ctx, x + 10, x + w - 10, y + h + 2, 120, 130, .55 * L); }
  ctx.save(); ctx.beginPath(); ctx.rect(g.x, g.y, g.w, g.h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, g.y, 0, g.y + g.h, [[0, mixHex(P.ind1, P.shade0, .25 * L)], [.6, mixHex(P.ind0, P.shade1, .3 * L)], [1, mixHex(P.night1, P.shade0, .2 * L)]]); ctx.fillRect(g.x, g.y, g.w, g.h);
  halo(ctx, g.x + g.w * .7, g.y + g.h * .3, g.w * .9, .45 * L, P.halo1, P.core1);
  // whiteboard with a project plan, wiped right → left by o.wipe
  const bx = g.x + g.w * .12, by = g.y + g.h * .16, bw = g.w * .7, bh = g.h * .22;
  ctx.fillStyle = mixHex(P.cream, P.blue1, .35); ctx.fillRect(bx, by, bw, bh);
  ctx.save(); ctx.beginPath(); ctx.rect(bx + bw * clamp(o.wipe ?? 0), by, bw, bh); ctx.clip();
  ctx.strokeStyle = rgba(P.ind1, .85); ctx.lineWidth = 3;
  for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(bx + 14, by + 18 + k * bh * .2); for (let j = 1; j < 9; j++) ctx.lineTo(bx + 14 + j * bw * .1, by + 18 + k * bh * .2 + Math.sin(j * 2.1 + k) * 3); ctx.stroke(); }
  ctx.strokeStyle = rgba(RED.line, .0); ctx.restore();
  // a desk silhouette
  ctx.fillStyle = mixHex(P.night1, P.shade1, .25 * L); ctx.fillRect(g.x, g.y + g.h * .72, g.w * .8, 12); ctx.fillRect(g.x + g.w * .1, g.y + g.h * .72, 10, g.h * .28);
  if (o.person) o.person(ctx);
  ctx.fillStyle = rgba(mixHex(P.ind1, P.halo1, .2 * L), .28); ctx.fillRect(g.x, g.y, g.w, g.h);   // the glass between you and them
  // glass sheen
  ctx.fillStyle = rgba(P.cream, .05); ctx.beginPath(); ctx.moveTo(g.x + g.w * .55, g.y); ctx.lineTo(g.x + g.w * .75, g.y); ctx.lineTo(g.x + g.w * .3, g.y + g.h); ctx.lineTo(g.x + g.w * .1, g.y + g.h); ctx.fill();
  ctx.restore();
  // frame + handle
  ctx.strokeStyle = mixHex(P.night1, P.blue2, .5); ctx.lineWidth = 12; ctx.strokeRect(x + 6, y + 6, w - 12, h - 6);
  ctx.fillStyle = mixHex(P.shade0, P.halo1, .4 * L); ctx.fillRect(x + 22, y + h * .5, 8, 70);
}
// a sign on a string, swinging from (x, y): ang rad, drop 0..1 (flips down)
export function hangSign(ctx, t, x, y, text, ang, drop, o = {}) {
  if (drop <= 0) return;
  const w = o.w ?? 250, h = o.h ?? 64, L = o.L ?? 70;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.strokeStyle = rgba(P.halo1, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-w * .3, L); ctx.moveTo(0, 0); ctx.lineTo(w * .3, L); ctx.stroke();
  ctx.fillStyle = P.halo0; ctx.beginPath(); ctx.arc(0, 0, 4, 0, 7); ctx.fill();
  ctx.translate(0, L); ctx.scale(1, expoOut(drop));
  paperCard(ctx, 0, h / 2, w, h, { lit: .5 });
  ink(ctx, text, 0, h / 2 + h * .17, h * .4, { align: 'center', sp: .12 });
  ctx.restore();
}

// ------------------------------------------------------------------ a phone screen: the empty inbox, the bank app
export function inbox(ctx, r, t, o = {}) {
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .45); ctx.fillRect(r.x, r.y, r.w, r.h);
  const s = r.w / 100;
  ink(ctx, 'INBOX', r.x + 8 * s, r.y + 16 * s, 9 * s, { col: P.cream, sp: .1 });
  ctx.strokeStyle = rgba(P.cream, .28); ctx.lineWidth = Math.max(1, s * .8);
  for (let k = 0; k < 4; k++) { ctx.strokeRect(r.x + 8 * s, r.y + (26 + k * 22) * s, r.w - 16 * s, 16 * s); }
  // a refresh ring turning: nothing arrives
  const cx = r.x + r.w / 2, cy = r.y + r.h - 20 * s; ctx.strokeStyle = rgba(P.cream, .6); ctx.lineWidth = 2 * s;
  ctx.beginPath(); ctx.arc(cx, cy, 6 * s, t * 4, t * 4 + 4.4); ctx.stroke();
}

// ------------------------------------------------------------------ route map windows: a rate dial, a house of cards, a bank tower, frost
export function dial(ctx, t, x, y, r, u, o = {}) {   // u 0..1 needle low → high
  ctx.save(); ctx.translate(x, y); ctx.lineCap = 'round';
  ctx.strokeStyle = P.core1; ctx.lineWidth = r * .06; ctx.shadowColor = rgba(P.halo0, .8); ctx.shadowBlur = r * .25;
  ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, 0); ctx.stroke();
  for (let k = 0; k <= 8; k++) { const an = Math.PI + k * Math.PI / 8; ctx.lineWidth = r * (k % 2 ? .03 : .05); ctx.beginPath(); ctx.moveTo(Math.cos(an) * r * .8, Math.sin(an) * r * .8); ctx.lineTo(Math.cos(an) * r * .95, Math.sin(an) * r * .95); ctx.stroke(); }
  const an = Math.PI * (1.08 + .84 * u) + Math.sin(t * 9) * .012 * u;
  ctx.strokeStyle = u > .6 ? mixHex(P.core1, RED.hot, (u - .6) / .4 * .7) : P.core1; ctx.lineWidth = r * .07;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(an) * r * .78, Math.sin(an) * r * .78); ctx.stroke();
  ctx.fillStyle = P.core1; ctx.beginPath(); ctx.arc(0, 0, r * .09, 0, 7); ctx.fill();
  ctx.restore();
}
// house of cards made of loan cards: (x, yb) base centre, u 0..1 built (cards rise in order), shake 0..1, slump 0..1
export function houseOfCards(ctx, t, x, yb, s, u, o = {}) {
  const cw = 46 * s, ch = 86 * s, rows = 3, cards = [];
  for (let r = 0; r < rows; r++) { const n = rows - r; for (let k = 0; k < n; k++) { const cx = x + (k - (n - 1) / 2) * cw * 1.25, cy = yb - r * ch * .96; cards.push([cx - cw * .3, cy, -.32], [cx + cw * .3, cy, .32]); if (r < rows - 1 && k < n - 1) cards.push([cx + cw * .62, cy - ch * .93, Math.PI / 2]); } }
  const N = cards.length, sh = o.shake ?? 0;
  cards.forEach(([cx, cy, ang], i) => {
    const v = clamp(u * N - i); if (v <= 0) return;
    const e = expoOut(v), j = Math.sin(t * 23 + i * 1.7) * sh * .03, fall = (o.slump ?? 0) * (1 + i * .05);
    ctx.save(); ctx.translate(cx + fall * 30 * Math.sign(ang || 1), cy + (1 - e) * 40 * s + fall * 20); ctx.rotate(ang + j + fall * .5 * Math.sign(ang || 1));
    const flat = Math.abs(ang) > 1;
    const w = flat ? ch : cw, hh = flat ? cw * .5 : ch;
    ctx.translate(0, flat ? 0 : -hh / 2);
    paperCard(ctx, 0, 0, flat ? hh * 1.9 : w, flat ? 10 * s : hh, { lit: .35, tilt: 0 });
    if (!flat) { ctx.fillStyle = rgba(PAPER.ink, .3); ctx.fillRect(-w * .3, -hh * .3, w * .6, 3 * s); ctx.fillRect(-w * .3, -hh * .18, w * .45, 3 * s); }
    ctx.restore();
  });
}
// a bank tower (facade with columns) standing at (x, yb), tipping by ang about its base corner
export function bankTower(ctx, t, x, yb, w, h, ang, o = {}) {
  ctx.save(); ctx.translate(x + w / 2, yb); ctx.rotate(ang); ctx.translate(-w / 2, 0);
  ctx.fillStyle = lin(ctx, 0, -h, w, 0, [[0, mixHex(P.ind1, P.blue1, .4)], [1, P.ind0]]); ctx.fillRect(0, -h, w, h);
  ctx.fillStyle = rgba(P.halo1, .25 + .15 * Math.sin(t * .9)); for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) ctx.fillRect(12 + c * (w - 24) / 4, -h + 20 + r * (h - 60) / 9, (w - 24) / 4 - 8, (h - 60) / 9 - 10);
  ctx.strokeStyle = rgba(P.halo0, .5); ctx.lineWidth = 2; ctx.strokeRect(0, -h, w, h);
  ctx.restore();
}
// frost spreading over a pane from (cx, cy): u 0..1 radius share; seeded crystals
const FROST = (() => { const r = prng(4242), a = []; for (let i = 0; i < 260; i++) a.push([r() * 6.283, r(), r(), r()]); return a; })();
export function frost(ctx, t, rect, cx, cy, u, o = {}) {
  if (u <= 0) return;
  const R = Math.hypot(rect.w, rect.h) * 1.05 * u, a = o.a ?? 1;
  ctx.save(); ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip();
  ctx.fillStyle = rad(ctx, cx, cy, Math.max(1, R), [[0, rgba(COOL.core, .32 * a)], [.75, rgba(COOL.mid, .22 * a)], [.97, rgba(COOL.core, .34 * a)], [1, rgba(COOL.core, 0)]]);
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.strokeStyle = rgba(COOL.core, .55 * a); ctx.lineWidth = 1.4;
  for (const [an, d, l, b] of FROST) {   // feathered crystals inside the frozen disc
    const rr = d * R; if (rr > R * .98) continue;
    const x = cx + Math.cos(an) * rr, y = cy + Math.sin(an) * rr, L = 10 + l * 34;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(an) * L, y + Math.sin(an) * L);
    for (const s of [-1, 1]) { ctx.moveTo(x + Math.cos(an) * L * .5, y + Math.sin(an) * L * .5); ctx.lineTo(x + Math.cos(an) * L * .5 + Math.cos(an + s * .7) * L * .35 * b, y + Math.sin(an) * L * .5 + Math.sin(an + s * .7) * L * .35 * b); }
    ctx.stroke();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ the 2009 memory (old-photo tones): office, CRT with the red line, flip phone, two colleagues
export function memory2009(ctx, t, o = {}) {
  const sep = (c) => mixHex(c, P.shade1, .22), z = o.z ?? 1;
  ctx.save(); ctx.translate(W / 2, H * .6); ctx.scale(z, z); ctx.translate(-W / 2, -H * .6);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, sep(P.ind0)], [.7, sep(P.ind1)], [1, sep(P.night1)]]); ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = rgba(P.halo1, .08); ctx.fillRect(0, 700, W, 380);
  // window with a grey morning
  ctx.fillStyle = rgba(mixHex(P.blue2, P.shade1, .5), .55); ctx.fillRect(1180, 140, 560, 320);
  ctx.strokeStyle = sep(P.night1); ctx.lineWidth = 10; ctx.strokeRect(1180, 140, 560, 320); ctx.beginPath(); ctx.moveTo(1460, 140); ctx.lineTo(1460, 460); ctx.stroke();
  // desk + CRT with the red line + flip phone
  ctx.fillStyle = sep(mixHex(P.night1, P.shade1, .4)); ctx.fillRect(240, 640, 820, 26); ctx.fillRect(280, 666, 18, 260); ctx.fillRect(1000, 666, 18, 260);
  ctx.fillStyle = sep(mixHex(P.ind1, P.shade1, .5)); ctx.beginPath(); ctx.roundRect(400, 400, 320, 240, 18); ctx.fill();
  ctx.fillStyle = sep(P.night0); ctx.fillRect(430, 425, 260, 180);
  ctx.strokeStyle = RED.line; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(445, 450);
  for (let i = 1; i <= 24; i++) ctx.lineTo(445 + i * 9.6, 450 + i * 5.6 + Math.sin(i * 1.9) * 6); ctx.stroke();
  ctx.fillStyle = sep(mixHex(P.night1, P.blue2, .5)); ctx.fillRect(520, 640, 80, 14);
  ctx.save(); ctx.translate(880, 628); ctx.rotate(-.2); ctx.fillStyle = sep(P.blue1); ctx.beginPath(); ctx.roundRect(-30, -10, 60, 18, 5); ctx.fill(); ctx.fillStyle = sep(P.ind2); ctx.beginPath(); ctx.roundRect(-30, -22, 58, 12, 4); ctx.fill(); ctx.restore();
  // coffee machine + two colleagues, quiet (alive: one sips, one shifts weight)
  ctx.fillStyle = sep(mixHex(P.ind1, P.shade1, .4)); ctx.fillRect(1360, 560, 130, 240); ctx.fillStyle = rgba(P.halo1, .4); ctx.fillRect(1385, 600, 30, 10);
  const sip = Math.max(0, Math.sin(t * .9)) ** 3;
  E.person(ctx, 1240, 930, 420, { dir: 1, cup: 'R', armR: [lerp(.75, 1.25, sip), lerp(2.35, 2.95, sip)], look: .1 + .1 * sip, light: 1 });
  E.person(ctx, 1640, 935, 410, { dir: -1, lean: .02 * Math.sin(t * .6), armL: [-.15, -.05], light: -1 });
  // a faded photo edge: the warm print tone
  ctx.fillStyle = lin(ctx, 0, 0, W, H, [[0, rgba(P.halo1, .06)], [1, rgba(P.shade0, .1)]]); ctx.fillRect(-W, -H, 3 * W, 3 * H);
  ctx.restore();
}

// ------------------------------------------------------------------ the www shops inside the bubble (full-frame design)
export function shops(ctx, t, o = {}) {
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, mixHex(P.night0, COOL.deep, .2)], [.75, mixHex(P.night1, COOL.deep, .25)], [1, P.night0]]); ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(0, 780, W, 300);
  ctx.fillStyle = rgba(COOL.edge, .25); ctx.fillRect(0, 778, W, 3);
  const X = [240, 760, 1280], neon = o.neon ?? [1, 1, 1];
  X.forEach((x0, i) => {
    const w = 420, n = clamp(neon[i]);
    ctx.fillStyle = mixHex(P.ind0, P.night1, .4); ctx.fillRect(x0 - 20, 300, w + 40, 480);
    // the window: empty, a faint cool light when the neon burns
    ctx.fillStyle = lin(ctx, 0, 420, 0, 760, [[0, mixHex(P.night1, COOL.deep, .5 * n)], [1, mixHex(P.night0, COOL.deep, .25 * n)]]); ctx.fillRect(x0, 420, w, 340);
    ctx.strokeStyle = rgba(COOL.mid, .25 + .2 * n); ctx.lineWidth = 3; ctx.strokeRect(x0, 420, w, 340);
    // the neon `www.`
    if (n > 0) { ctx.save(); ctx.globalAlpha *= n; E.glowText(ctx, 'www.', x0 + w / 2, 385, { size: 64, align: 'center', col: COOL.core, spacing: .04 }); ctx.restore(); }
    else { E.glowText(ctx, 'www.', x0 + w / 2, 385, { size: 64, align: 'center', col: mixHex(P.ind1, P.blue1, .3), glow: false, spacing: .04 }); }
  });
}
// a cent: small copper-gold coin (face on), spin about its vertical axis
export function cent(ctx, x, y, r, spin = 0, o = {}) {
  const sc = Math.max(.12, Math.abs(Math.cos(spin)));
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.scale(sc, 1);
  const d = new Path2D(); d.arc(0, 0, r, 0, 7);
  glowFill(ctx, d, r * .8, .55, P.halo0);
  ctx.fillStyle = rad(ctx, -r * .3, -r * .3, r * 1.3, [[0, P.core1], [.5, P.halo0], [1, mixHex(P.shade0, '#a0603a', .4)]]); ctx.fill(d);
  ctx.strokeStyle = rgba(P.shade0, .8); ctx.lineWidth = r * .1; ctx.beginPath(); ctx.arc(0, 0, r * .74, 0, 7); ctx.stroke();
  ctx.restore();
}
// the 1933 bank (sepia-indigo), full-frame design inside a window: columns, door, a crowd before it
export function bank1933(ctx, t, o = {}) {
  const sep = (c) => mixHex(c, P.shade1, .4);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, sep(P.night0)], [1, sep(P.ind0)]]); ctx.fillRect(0, 0, W, H);
  // facade
  ctx.fillStyle = sep(mixHex(P.ind1, P.blue1, .3)); ctx.fillRect(300, 260, 1320, 560);
  ctx.beginPath(); ctx.moveTo(260, 270); ctx.lineTo(960, 90); ctx.lineTo(1660, 270); ctx.closePath(); ctx.fill();
  ctx.fillStyle = sep(P.ind0); ctx.fillRect(260, 262, 1400, 22);
  E.glowText(ctx, 'BANK', 960, 235, { size: 46, align: 'center', col: sep(P.cream), glow: false, spacing: .3 });
  for (const cx of [380, 560, 1360, 1540]) { ctx.fillStyle = lin(ctx, cx - 50, 0, cx + 50, 0, [[0, sep(mixHex(P.blue1, P.cream, .25))], [1, sep(P.ind1)]]); ctx.fillRect(cx - 46, 290, 92, 530); ctx.fillStyle = sep(P.ind0); ctx.fillRect(cx - 58, 290, 116, 18); ctx.fillRect(cx - 58, 802, 116, 18); }
  // the door
  ctx.fillStyle = sep(P.night1); ctx.fillRect(820, 470, 280, 350); ctx.strokeStyle = sep(mixHex(P.shade0, P.ind1, .4)); ctx.lineWidth = 8; ctx.strokeRect(820, 470, 280, 350); ctx.beginPath(); ctx.moveTo(960, 470); ctx.lineTo(960, 820); ctx.stroke();
  ctx.fillStyle = sep(P.night0); ctx.fillRect(-200, 820, W + 400, 700);
  if (o.inner) o.inner(ctx);
}
export const COIN_ICON = 4;

// ------------------------------------------------------------------ your raincoat sleeve + hand holding a phone from below (kit `hand` reads as a stick at this size)
// back(): sleeve + palm behind the phone; front(): the thumb over the phone's left edge. (x, y) = palm centre, phone width pw.
export function sleeveBack(ctx, x, y, pw, ang = 0) {
  const s = pw / 220;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  // sleeve: wide, slightly flared toward the bottom, coat gradient + a cuff
  ctx.fillStyle = lin(ctx, -110, 0, 110, 0, [[0, E.COAT.shade], [.45, E.COAT.base], [1, mixHex(E.COAT.base, E.COAT.shade, .5)]]);
  ctx.beginPath(); ctx.moveTo(-70, 70); ctx.quadraticCurveTo(-78, 300, -120, 620); ctx.lineTo(130, 620); ctx.quadraticCurveTo(92, 300, 76, 70); ctx.closePath(); ctx.fill();
  ctx.fillStyle = E.COAT.shade; ctx.beginPath(); ctx.roundRect(-76, 60, 154, 30, 10); ctx.fill();
  // palm + fingers behind the phone (muted warm skin in the night light)
  ctx.fillStyle = mixHex(P.shade1, P.ind1, .35);
  ctx.beginPath(); ctx.ellipse(0, 30, 70, 52, 0, 0, 7); ctx.fill();
  for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.roundRect(96, -60 + k * 34, 30, 26, 12); ctx.fill(); }
  ctx.restore();
}
export function sleeveFront(ctx, x, y, pw, ang = 0) {
  const s = pw / 220;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  ctx.fillStyle = mixHex(P.shade1, P.ind1, .25);
  ctx.beginPath(); ctx.moveTo(-60, 40); ctx.quadraticCurveTo(-130, 0, -122, -70); ctx.quadraticCurveTo(-112, -98, -96, -66); ctx.quadraticCurveTo(-88, -10, -30, 20); ctx.closePath(); ctx.fill();
  ctx.restore();
}
