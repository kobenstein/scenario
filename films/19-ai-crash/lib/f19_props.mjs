// Film 19 · small props (owned by the lead; builders import, never edit). Flat light-and-paper objects in the channel palette.
// All draw centred on (x, y) at size s (s = 1 ≈ the size noted per prop) unless noted; o.a multiplies alpha; o.lit 0..1 adds the warm glow.
//   paperCard(ctx, x, y, w, h, o)      a card of paper light (base of payslip, statement, IOU): o { tilt, lit, a, cool } → Path2D
//   payslip(ctx, t, x, y, w, o)         PAYSLIP (h = .62 w): header, three rows, a NET PAY line. o { tilt, lit, a, net 0..1 (net-pay line lit), red: [x0,x1] 0..1 (red line across) }
//   iouSlip(ctx, t, x, y, w, o)         a small IOU slip (h = .5 w): "IOU" + amount. o { amount, tilt, a, cool }
//   statement(ctx, t, x, y, w, rows, o) a fund statement (h = 1.3 w), rows = [[label, value], …] (≤ 5). o { u (rows written 0..1), a }
//   phone(ctx, t, x, y, h, o)           a phone (w = .5 h). o { face: 1 up / 0 down (flips about its long axis), screen(ctx, r) callback, buzz 0..1, a }
//   hand(ctx, x, y, s, o)               your hand in a yellow sleeve, reaching from below (o.ang rad, o.a)
//   table(ctx, t, x, y, w, o)           your table top seen at a low angle + the lamp (warm hero). o { lamp 0..1, a, lampX (share of w, .78) } → lamp point
//   envelope(ctx, t, x, y, w, o)        an envelope (h = .64 w). o { open 0..1, lit, a }
//   magnifier(ctx, t, x, y, r, o)       a magnifier of light: lens radius r. o { ang, a }
//   mailbox(ctx, t, x, y, h, o)         a roadside mailbox on its post ((x, y) = foot). o { flag 0..1, lit, a } → slot point
//   calendarLeaf(ctx, t, x, y, w, o)    a tear-off calendar leaf ("NOV" / "5"). o { mon, day, peel 0..1, a }
//   priceTagCard(ctx, t, x, y, w, o)    a small price tag card with text (o.text, o.tilt, o.a) — use f18 `tag` for the hanging tag of light
//   button(ctx, t, x, y, w, o)          a rounded red button (DO SOMETHING): o { text, press 0..1, a }
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import { RED, COOL } from './f19_kit.mjs';
const { P, rgba, mixHex, clamp, lerp, glowFill, halo, lin, rad } = E;

const PAPER = { top: '#f7efd2', bot: '#e3d3a8', edge: '#b59a6a', ink: '#3a3550' };
export function paperCard(ctx, x, y, w, h, o = {}) {
  const p = new Path2D(); p.roundRect(-w / 2, -h / 2, w, h, Math.min(w, h) * .03);
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.tilt ?? 0);
  if ((o.lit ?? 1) > 0) glowFill(ctx, p, w * .08, .45 * (o.lit ?? 1), P.halo0);
  const cool = clamp(o.cool ?? 0);
  ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, mixHex(PAPER.top, COOL.core, cool)], [1, mixHex(PAPER.bot, COOL.mid, cool)]]); ctx.fill(p);
  ctx.strokeStyle = rgba(PAPER.edge, .7); ctx.lineWidth = Math.max(1, w * .004); ctx.stroke(p);
  ctx.restore();
  return p;
}
const inLocal = (ctx, x, y, tilt, fn) => { ctx.save(); ctx.translate(x, y); ctx.rotate(tilt ?? 0); fn(); ctx.restore(); };
const ink = (ctx, s, x, y, size, o = {}) => { ctx.font = `${o.weight ?? 600} ${size}px ${o.serif ? '"Instrument Serif"' : 'Inter'}`; ctx.fillStyle = o.col ?? PAPER.ink; ctx.textAlign = o.align ?? 'left'; ctx.letterSpacing = `${o.sp ?? 0}em`; ctx.fillText(s, x, y); ctx.letterSpacing = '0px'; };
export function payslip(ctx, t, x, y, w, o = {}) {
  const h = w * .62, a = o.a ?? 1; if (a <= 0) return;
  paperCard(ctx, x, y, w, h, { tilt: o.tilt, lit: o.lit ?? 1, a });
  inLocal(ctx, x, y, o.tilt, () => {
    ctx.globalAlpha *= a;
    ink(ctx, 'PAYSLIP', -w * .42, -h * .3, w * .055, { sp: .12 });
    ctx.fillStyle = rgba(PAPER.ink, .25); for (let k = 0; k < 3; k++) { ctx.fillRect(-w * .42, -h * .14 + k * h * .14, w * .46, w * .012); ctx.fillRect(w * .22, -h * .14 + k * h * .14, w * .2, w * .012); }
    const ny = h * .3, nl = clamp(o.net ?? 0);
    ink(ctx, 'NET PAY', -w * .42, ny, w * .045, { sp: .1 });
    ctx.fillStyle = rgba(mixHex(PAPER.ink, P.shade0, nl), .8); ctx.fillRect(w * .1, ny - w * .03, w * .32, w * .03);
    if (o.red) { const [u0, u1] = o.red; if (u1 > u0) { ctx.strokeStyle = RED.line; ctx.lineWidth = w * .008; ctx.shadowColor = rgba(RED.deep, .6); ctx.shadowBlur = 8; ctx.beginPath(); ctx.moveTo(-w / 2 + u0 * w, -h * .02); ctx.lineTo(-w / 2 + u1 * w, -h * .02 + (u1 - u0) * h * .12); ctx.stroke(); } }
  });
}
export function iouSlip(ctx, t, x, y, w, o = {}) {
  const h = w * .5, a = o.a ?? 1; if (a <= 0) return;
  paperCard(ctx, x, y, w, h, { tilt: o.tilt, lit: .6, a, cool: o.cool ?? .3 });
  inLocal(ctx, x, y, o.tilt, () => { ctx.globalAlpha *= a; ink(ctx, 'IOU', -w * .4, h * .12, w * .2, { serif: true, weight: 400 }); if (o.amount) ink(ctx, o.amount, w * .4, h * .1, w * .12, { align: 'right' }); });
}
export function statement(ctx, t, x, y, w, rows, o = {}) {
  const h = w * 1.3, a = o.a ?? 1; if (a <= 0) return;
  paperCard(ctx, x, y, w, h, { tilt: o.tilt, lit: o.lit ?? .8, a });
  inLocal(ctx, x, y, o.tilt, () => {
    ctx.globalAlpha *= a; ink(ctx, o.title ?? 'STATEMENT', -w * .4, -h * .38, w * .06, { sp: .1 });
    const u = clamp(o.u ?? 1) * rows.length;
    rows.forEach(([l, v], i) => { const k = clamp(u - i); if (k <= 0) return; ctx.globalAlpha = a * k; ink(ctx, l, -w * .4, -h * .22 + i * h * .13, w * .055, { weight: 500 }); ink(ctx, v, w * .4, -h * .22 + i * h * .13, w * .055, { align: 'right' }); });
  });
}
export function phone(ctx, t, x, y, h, o = {}) {
  const w = h * .5, a = o.a ?? 1, face = clamp(o.face ?? 1), sx = Math.cos(Math.PI * (1 - face)) , buzz = (o.buzz ?? 0) * Math.sin(t * 60) * h * .012;
  if (a <= 0) return null;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x + buzz, y); ctx.rotate(o.tilt ?? 0); ctx.scale(Math.max(.04, Math.abs(sx)), 1);
  const body = new Path2D(); body.roundRect(-w / 2, -h / 2, w, h, w * .14);
  ctx.fillStyle = mixHex(P.night0, P.ind0, .6); ctx.fill(body); ctx.strokeStyle = rgba(P.blue2, .8); ctx.lineWidth = Math.max(1, w * .02); ctx.stroke(body);
  let r = null;
  if (sx > 0) {
    r = { x: -w / 2 + w * .06, y: -h / 2 + w * .06, w: w * .88, h: h - w * .12 };
    const sp = new Path2D(); sp.roundRect(r.x, r.y, r.w, r.h, w * .1);
    glowFill(ctx, sp, w * .25, .35, COOL.edge);
    ctx.save(); ctx.clip(sp); ctx.fillStyle = mixHex(P.ind1, P.blue1, .4); ctx.fillRect(r.x, r.y, r.w, r.h); if (o.screen) o.screen(ctx, r); ctx.restore();
  } else { ctx.fillStyle = rgba(P.blue2, .5); ctx.beginPath(); ctx.arc(-w * .25, -h * .38, w * .08, 0, 7); ctx.fill(); }
  ctx.restore();
  return r;
}
export function hand(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.ang ?? 0); ctx.scale(s, s);
  ctx.fillStyle = E.COAT.base; ctx.beginPath(); ctx.roundRect(-34, 10, 68, 220, 18); ctx.fill();
  ctx.fillStyle = E.COAT.shade; ctx.fillRect(-34, 10, 68, 14);
  ctx.fillStyle = mixHex(P.shade1, P.halo1, .35); ctx.beginPath(); ctx.ellipse(0, -14, 30, 34, 0, 0, 7); ctx.fill();
  for (let k = -1; k <= 2; k++) { ctx.beginPath(); ctx.roundRect(-26 + (k + 1) * 14, -64, 11, 44, 5); ctx.fill(); }
  ctx.restore();
}
export function table(ctx, t, x, y, w, o = {}) {
  const a = o.a ?? 1, L = clamp(o.lamp ?? 1), lx = x - w / 2 + w * (o.lampX ?? .78), ly = y - 300;
  ctx.save(); ctx.globalAlpha *= a;
  if (L > 0) { halo(ctx, lx, ly + 60, 520, .45 * L); E.lightPool(ctx, lx - 260, lx + 200, y + 4, 140, 160, .7 * L); }
  ctx.fillStyle = lin(ctx, 0, y, 0, y + 200, [[0, mixHex(P.shade0, P.ind1, .55)], [1, mixHex(P.night1, P.ind0, .5)]]);
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y); ctx.lineTo(x + w / 2 + 120, y + 220); ctx.lineTo(x - w / 2 - 120, y + 220); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.halo1, .35 * L); ctx.fillRect(x - w / 2, y - 2, w, 3);
  // the lamp: base, arm, shade with the bulb inside
  ctx.strokeStyle = mixHex(P.night1, P.shade0, .4); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(lx + 40, y); ctx.lineTo(lx + 60, ly + 90); ctx.lineTo(lx, ly + 20); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.shade0, .4); ctx.beginPath(); ctx.ellipse(lx + 40, y - 4, 46, 10, 0, 0, 7); ctx.fill();
  if (L > 0) halo(ctx, lx, ly + 40, 160, .8 * L, P.halo0, P.core0);
  ctx.fillStyle = mixHex(P.ind1, P.shade0, .3); ctx.beginPath(); ctx.moveTo(lx - 70, ly + 40); ctx.lineTo(lx - 30, ly - 20); ctx.lineTo(lx + 30, ly - 20); ctx.lineTo(lx + 70, ly + 40); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(P.core0, L); ctx.beginPath(); ctx.ellipse(lx, ly + 40, 60, 8, 0, 0, 7); ctx.fill();
  ctx.restore();
  return [lx, ly + 40];
}
export function envelope(ctx, t, x, y, w, o = {}) {
  const h = w * .64, a = o.a ?? 1, op = clamp(o.open ?? 0); if (a <= 0) return;
  paperCard(ctx, x, y, w, h, { tilt: o.tilt, lit: o.lit ?? .7, a });
  inLocal(ctx, x, y, o.tilt, () => {
    ctx.globalAlpha *= a; ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = w * .008; ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, lerp(h * .08, -h * .95, op)); ctx.lineTo(w / 2, -h / 2); ctx.moveTo(-w / 2, h / 2); ctx.lineTo(-w * .1, 0); ctx.moveTo(w / 2, h / 2); ctx.lineTo(w * .1, 0); ctx.stroke();
  });
}
export function magnifier(ctx, t, x, y, r, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.a ?? 1; ctx.translate(x, y); ctx.rotate(o.ang ?? .7);
  const lens = new Path2D(); lens.arc(0, 0, r, 0, 7);
  glowFill(ctx, lens, r * .4, .5, P.halo0);
  ctx.fillStyle = rad(ctx, -r * .3, -r * .3, r * 1.2, [[0, rgba(P.core0, .35)], [1, rgba(P.halo0, .08)]]); ctx.fill(lens);
  ctx.strokeStyle = P.halo0; ctx.lineWidth = r * .12; ctx.stroke(lens);
  ctx.lineCap = 'round'; ctx.lineWidth = r * .22; ctx.strokeStyle = P.halo1; ctx.beginPath(); ctx.moveTo(r * 1.06, 0); ctx.lineTo(r * 2.1, 0); ctx.stroke();
  ctx.restore();
}
export function mailbox(ctx, t, x, y, h, o = {}) {
  const a = o.a ?? 1, s = h / 300;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = mixHex(P.night1, P.blue2, .3); ctx.fillRect(-7, -200, 14, 200);
  const box = new Path2D(); box.moveTo(-70, -200); box.lineTo(-70, -260); box.arc(0, -260, 70, Math.PI, 0); box.lineTo(70, -200); box.closePath();
  if ((o.lit ?? 0) > 0) glowFill(ctx, box, 30, .5 * o.lit, P.halo0);
  ctx.fillStyle = lin(ctx, -70, 0, 70, 0, [[0, mixHex(P.blue1, P.ind1, .3)], [1, P.ind1]]); ctx.fill(box);
  ctx.fillStyle = rgba(P.night0, .9); ctx.fillRect(-40, -248, 80, 10);
  const fl = clamp(o.flag ?? 0); ctx.save(); ctx.translate(70, -230); ctx.rotate(-Math.PI / 2 * fl); ctx.fillStyle = RED.line; ctx.fillRect(0, -6, 10, 60); ctx.fillRect(0, -6, 34, 22); ctx.restore();
  ctx.restore();
  return [x, y - 243 * s];
}
export function calendarLeaf(ctx, t, x, y, w, o = {}) {
  const h = w * 1.15, a = o.a ?? 1, pe = clamp(o.peel ?? 0); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y - h / 2); ctx.rotate(pe * .5); ctx.translate(0, pe * h * .2);
  paperCard(ctx, 0, h / 2, w, h, { lit: .6 });
  ctx.fillStyle = RED.line; ctx.fillRect(-w / 2, 0, w, h * .26);
  ink(ctx, o.mon ?? 'NOV', 0, h * .19, w * .16, { align: 'center', col: P.cream, sp: .15 });
  ink(ctx, String(o.day ?? 5), 0, h * .82, w * .5, { align: 'center', serif: true, weight: 400 });
  ctx.restore();
}
export function priceTagCard(ctx, t, x, y, w, o = {}) {
  const h = w * .55, a = o.a ?? 1; if (a <= 0) return;
  inLocal(ctx, x, y, o.tilt, () => {
    ctx.globalAlpha *= a; const p = new Path2D(); p.moveTo(-w / 2, 0); p.lineTo(-w / 2 + h / 2, -h / 2); p.lineTo(w / 2, -h / 2); p.lineTo(w / 2, h / 2); p.lineTo(-w / 2 + h / 2, h / 2); p.closePath();
    glowFill(ctx, p, w * .1, .5, P.halo0); ctx.fillStyle = lin(ctx, 0, -h / 2, 0, h / 2, [[0, PAPER.top], [1, PAPER.bot]]); ctx.fill(p);
    ctx.fillStyle = P.night1; ctx.beginPath(); ctx.arc(-w / 2 + h * .45, 0, h * .09, 0, 7); ctx.fill();
    if (o.text) ink(ctx, o.text, w * .1, h * .17, h * .45, { align: 'center' });
  });
}
export function button(ctx, t, x, y, w, o = {}) {
  const h = w * .32, pr = clamp(o.press ?? 0), a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = RED.ink; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2 + 10, w, h, h / 2); ctx.fill();
  ctx.fillStyle = mixHex(RED.line, RED.deep, pr * .5); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2 + pr * 8, w, h, h / 2); ctx.fill();
  if (o.text) { ctx.font = `600 ${Math.round(h * .34)}px Inter`; ctx.fillStyle = P.cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '0.08em'; ctx.fillText(o.text, 0, pr * 8 + 2); }
  ctx.restore();
}
